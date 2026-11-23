/**
 * Détection WebGL avant le montage du Canvas.
 *
 * Un navigateur peut refuser tout contexte graphique sans rien afficher :
 * après plusieurs plantages de son processus GPU, Chrome relance ce processus
 * avec `--use-gl=disabled`, et `getContext("webgl")` renvoie alors `null`.
 * Le jeu resterait noir, sans message ni erreur visible.
 */

export type WebGLApi = 'webgl2' | 'webgl' | 'experimental-webgl';

export interface WebGLDiagnostic {
  ok: boolean;
  api: WebGLApi | null;
  vendor: string | null;
  renderer: string | null;
  reason: string | null;
}

export const WEBGL_API_LABEL: Record<WebGLApi, string> = {
  webgl2: 'WebGL 2',
  webgl: 'WebGL 1',
  'experimental-webgl': 'WebGL 1 (expérimental)',
};

const API_ORDER: WebGLApi[] = ['webgl2', 'webgl', 'experimental-webgl'];

const PROBE_ATTRIBUTES: WebGLContextAttributes = {
  alpha: false,
  antialias: false,
  depth: false,
  stencil: false,
  preserveDrawingBuffer: false,
  failIfMajorPerformanceCaveat: false,
};

function releaseProbe(gl: WebGLRenderingContext | WebGL2RenderingContext) {
  try {
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    // l'extension n'est pas garantie, l'échec est sans conséquence
  }
}

export function detectWebGL(): WebGLDiagnostic {
  if (typeof document === 'undefined') {
    return { ok: false, api: null, vendor: null, renderer: null, reason: 'Environnement sans DOM.' };
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  for (const api of API_ORDER) {
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      gl = canvas.getContext(api, PROBE_ATTRIBUTES) as
        | WebGLRenderingContext
        | WebGL2RenderingContext
        | null;
    } catch {
      gl = null;
    }
    if (!gl) continue;

    let vendor: string | null = null;
    let renderer: string | null = null;
    try {
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      if (info) {
        vendor = String(gl.getParameter(info.UNMASKED_VENDOR_WEBGL));
        renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL));
      } else {
        vendor = String(gl.getParameter(gl.VENDOR));
        renderer = String(gl.getParameter(gl.RENDERER));
      }
    } catch {
      // paramètres masqués par le navigateur
    }

    releaseProbe(gl);
    return { ok: true, api, vendor, renderer, reason: null };
  }

  return {
    ok: false,
    api: null,
    vendor: null,
    renderer: null,
    reason: "Aucun contexte WebGL 2 ni WebGL 1 n'a pu être créé.",
  };
}
