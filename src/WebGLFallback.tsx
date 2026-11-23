import { useState } from 'react';
import { WEBGL_API_LABEL, type WebGLDiagnostic } from './webgl';

interface WebGLFallbackProps {
  diagnostic: WebGLDiagnostic;
  /** Le contexte existait puis a été perdu en cours de partie. */
  contextLost: boolean;
  onRetry: () => void;
}

function buildReport(diagnostic: WebGLDiagnostic, contextLost: boolean): string {
  const api = diagnostic.api ? WEBGL_API_LABEL[diagnostic.api] : 'aucune';

  return [
    'Phandaline, diagnostic graphique',
    `Date : ${new Date().toISOString()}`,
    `WebGL : ${diagnostic.ok ? `disponible (${api})` : 'indisponible'}`,
    `Motif : ${diagnostic.reason ?? 'non précisé'}`,
    `Pilote : ${diagnostic.vendor ?? 'non communiqué'}`,
    `Processeur graphique : ${diagnostic.renderer ?? 'non communiqué'}`,
    `Contexte perdu en partie : ${contextLost ? 'oui' : 'non'}`,
    `Navigateur : ${typeof navigator !== 'undefined' ? navigator.userAgent : 'inconnu'}`,
    `Page : ${typeof window !== 'undefined' ? window.location.href : 'inconnue'}`,
  ].join('\n');
}

const ACTIONS = [
  'Quittez complètement le navigateur, puis relancez-le. Chrome désactive WebGL après plusieurs plantages de son processus graphique, et un simple rafraîchissement ne le rétablit pas.',
  'Ouvrez chrome://gpu et vérifiez les lignes WebGL et WebGL2. Si elles indiquent « Disabled » ou « Software only », la cause est le navigateur ou le pilote graphique, pas le jeu.',
  'Dans les paramètres du navigateur, section Système, vérifiez que « Utiliser l’accélération graphique si disponible » est activé.',
  'Fermez les onglets les plus lourds : la mémoire libérée aide le processus graphique à redémarrer.',
  'Si le problème revient, mettez à jour le pilote de la carte graphique.',
];

export default function WebGLFallback({ diagnostic, contextLost, onRetry }: WebGLFallbackProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildReport(diagnostic, contextLost));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers refusé : le diagnostic reste lisible à l'écran.
      setCopied(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-start justify-center overflow-y-auto bg-[#1a130c] p-4 font-serif text-amber-100">
      <div className="w-full max-w-2xl space-y-5 rounded-md border-2 border-amber-700/70 bg-gradient-to-b from-[#2a2018] to-[#1a130c] p-6 shadow-2xl">
        <div>
          <h1 className="text-xl font-bold tracking-wide text-amber-300">
            {contextLost
              ? 'Le contexte graphique a été perdu'
              : 'Le rendu 3D est indisponible dans ce navigateur'}
          </h1>
          <p className="mt-2 text-sm text-amber-200/80">
            Phandaline a besoin de WebGL pour afficher le village. La partie n’est pas en cause :
            seul l’affichage est bloqué.
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-amber-200">Ce que vous pouvez faire</p>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-amber-100/80">
            {ACTIONS.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ol>
        </div>

        <details className="rounded border border-amber-700/50 bg-black/30 p-3 text-xs">
          <summary className="cursor-pointer font-semibold text-amber-200">Diagnostic</summary>
          <pre className="mt-2 whitespace-pre-wrap break-all font-mono text-[11px] leading-relaxed text-amber-100/70">
            {buildReport(diagnostic, contextLost)}
          </pre>
        </details>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md border-2 border-amber-600 bg-amber-800/60 px-4 py-2 text-sm font-semibold text-amber-50 transition hover:bg-amber-700/70"
          >
            Réessayer
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-md border border-amber-700/60 bg-black/40 px-4 py-2 text-sm transition hover:bg-amber-900/30"
          >
            {copied ? 'Diagnostic copié' : 'Copier le diagnostic'}
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-md border border-amber-700/60 bg-black/40 px-4 py-2 text-sm transition hover:bg-amber-900/30"
          >
            Recharger la page
          </button>
        </div>

        <p className="text-xs text-amber-200/60">
          Retrouver les autres jeux :{' '}
          <a
            href="https://games.hylst.fr/"
            className="underline underline-offset-2 hover:text-amber-200"
          >
            games.hylst.fr
          </a>
        </p>
      </div>
    </div>
  );
}
