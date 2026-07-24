import { useState, useEffect, useCallback } from 'react';
import { audio } from './audio';

const SCENES = [
  {
    title: 'L\'Appel de Phandaline',
    text: `Cinq cents ans avant les événements de la Mine oubliée de Phancreux, au cœur de la Côte des Épées, se dresse la fière bourgade de Phandaline.\n\nFondée par une famille de nains en quête de filons, elle doit sa richesse à la Caverne du Ressac, dont la source souterraine murmure en écho au Plan Élémentaire de l\'Eau.\n\nLes gnomes ingénieurs et les enchanteurs humains du conglomérat mené par le mage Mormesk ont bâti leur fortune sur ce lien mystique. Et le village, d\'abord simple hameau dépendant de Padhiver, a grandi jusqu\'à revendiquer son indépendance.\n\nPuis vint le dragon.`,
    emoji: '🐉',
    color: '#0a0a1a',
    accentColor: '#3a6a8a',
  },
  {
    title: 'Le Dragon Vert Azdraka',
    text: `Il y a vingt ans, le Grand Dragon Vert Azdraka s\'installa dans le Bois de Padhiver et imposa sa tyrannie sur toute la région.\n\nUne compagnie d\'aventuriers menée par Dame Tanamere Alagondar se dressa contre lui. On dit que leur combat dura cinq jours et cinq nuits — des montagnes aux forêts, jusqu\'à la Grande Route.\n\nTanamere tomba en portant le coup fatal. Seul Aldrith Tresendar, le rôdeur surnommé « le Faucon Noir », revint annoncer la nouvelle. Reconnaissant, Phandaline le fit Prince.\n\nAprès avoir fait ériger le Tertre du Dragon en mémoire de Tanamere, Aldrith fit bâtir son manoir sur une colline et gouverna avec bienveillance. Phandaline devint le « Joyau du Nord ».`,
    emoji: '⚔️',
    color: '#1a0a0a',
    accentColor: '#c04030',
  },
  {
    title: 'La Bourgade d\'Aujourd\'hui',
    text: `Aujourd\'hui, presque trois mille âmes vivent à Phandaline, protégées par les Serres du Prince Tresendar.\n\n🍺 L\'Auberge du Bon-Vivant, tenue par Oscar Bon-Vivant, où les bardes chantent les légendes et les aventuriers trouvent leurs quêtes.\n\n⚒️ La Forge de l\'Homme-de-Fer, où Anton Hizark arme l\'élite guerrière de Phandaline.\n\n🛒 Le magasin des Bonne-Fortune, la famille halfeline qui commerce jusqu\'à Connyberry et Leilon.\n\n🐴 La ferme du vieux Eliass, qui garde les chevaux du Prince et se souvient du dragon.\n\n🔮 Et le mage Sildar Hallwinter, conseiller du Prince, qui veille sur les arcanes.\n\nApproche-toi et appuie sur [E] pour parler.`,
    emoji: '🏘️',
    color: '#2a1a0a',
    accentColor: '#d0a040',
  },
  {
    title: 'Les Phlandys — Tes Compagnons',
    text: `Tu n\'es pas seul. Les Phlandys, groupe de héros de Phandaline, t\'accompagnent dans tes aventures depuis leur nouvelle demeure : le manoir des Tresendar, un peu à l\'écart sur la colline nord.\n\n🪨 Buddy, nain moine du Feu\n🔵 Azureas, mage bleu de la Tour de Padhiver\n🏹 Kallista, rôdeuse tieffeline à la peau rouge\n🎵 Azazel, son frère, barde à la peau bleue\n🌿 Sindaros, elfe prêtre-mage mystérieux\n✨ Elian, paladin un peu... excentrique\n🍲 Kenrick, gobelin moine sous cape, fin cuisinier\n\nRamasse les objets brillants ✨ pour accomplir tes quêtes. Que ta légende s\'écrive à Phandaline !`,
    emoji: '🗡️',
    color: '#0a1a2a',
    accentColor: '#40a0c0',
  },
];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [scene, setScene] = useState(-1);
  const [typing, setTyping] = useState('');
  const [fade, setFade] = useState(true);
  const [introDone, setIntroDone] = useState(false);

  const currentScene = SCENES[scene];

  const skipIntro = useCallback(() => {
    audio.stopSpeaking();
    audio.playWhoosh();
    onComplete();
  }, [onComplete]);

  // Écran titre initial
  useEffect(() => {
    const t = setTimeout(() => {
      setIntroDone(true);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  // Effet de machine à écrire
  useEffect(() => {
    if (scene < 0 || !currentScene) return;
    setTyping('');
    let i = 0;
    const text = currentScene.text;
    setFade(true);
    const interval = setInterval(() => {
      if (i < text.length) {
        setTyping(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setFade(false);
      }
    }, 22);
    return () => clearInterval(interval);
  }, [scene]);

  const next = useCallback(() => {
    audio.resume();
    if (!currentScene) { setScene(0); return; }
    // Si le texte n'est pas fini, l'afficher d'un coup
    if (typing.length < currentScene.text.length) {
      setTyping(currentScene.text);
      setFade(false);
      return;
    }
    if (scene < SCENES.length - 1) {
      setScene((s) => s + 1);
    } else {
      onComplete();
    }
  }, [scene, currentScene, typing, onComplete]);

  // Escape : passer toute l'introduction et entrer directement dans le jeu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') skipIntro();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [skipIntro]);

  // Lecture vocale de la scène
  useEffect(() => {
    if (scene >= 0 && currentScene && !fade) {
      setTimeout(() => {
        audio.speak(currentScene.text, 0.9, 0.8);
      }, 500);
    }
    return () => { audio.stopSpeaking(); };
  }, [scene, fade]);

  // Écran titre
  if (!introDone) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
        style={{ background: '#0a0810' }}
        onClick={onComplete}
      >
        <div className="text-center animate-pulse">
          <div className="text-8xl mb-4">🐉</div>
          <h1
            className="text-4xl font-bold tracking-wider mb-2"
            style={{ color: '#c9a227', fontFamily: 'serif', textShadow: '0 0 40px rgba(201,162,39,0.5)' }}
          >
            Village de Phandaline
          </h1>
          <p className="text-lg italic" style={{ color: '#a08050', fontFamily: 'serif' }}>
            Les Tréfonds de Phancreux · Campagne D&D 5e maison
          </p>
          <p className="text-sm mt-8 animate-pulse" style={{ color: '#665533', fontFamily: 'serif' }}>
            Cliquez pour entrer dans l'aventure…
          </p>
          <div className="mt-12 text-xs" style={{ color: '#443322', fontFamily: 'serif' }}>
            <span style={{ color: '#806633' }}>Geoffroy Streit</span> — <span style={{ color: '#806633' }}>Rôliste Fantasque</span> — Quid Facis
          </div>
          <div className="mt-4 text-[10px]" style={{ color: '#665533', fontFamily: 'serif' }}>
            Échap : passer l'introduction
          </div>
        </div>
      </div>
    );
  }

  if (scene < 0) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
        style={{ background: '#0a0810' }}
        onClick={() => setScene(0)}
      >
        <div className="text-center">
          <div className="text-9xl mb-6" style={{ filter: 'drop-shadow(0 0 30px rgba(201,162,39,0.4))' }}>🐉</div>
          <h1
            className="text-4xl font-bold tracking-widest mb-4"
            style={{ color: '#c9a227', fontFamily: 'serif', textShadow: '0 0 60px rgba(201,162,39,0.6)' }}
          >
            VILLAGE DE PHANDALINE
          </h1>
          <div className="w-32 h-0.5 mx-auto mb-4" style={{ background: 'linear-gradient(90deg, transparent, #c9a227, transparent)' }} />
          <p className="text-lg italic mb-2" style={{ color: '#a08050', fontFamily: 'serif' }}>
            Campagne D&D 5e — Champion.ne · La Demeure du Mal
          </p>
          <p className="text-xs mt-2 mb-10" style={{ color: '#665533', fontFamily: 'serif' }}>
            Par <span style={{ color: '#c9a227' }}>Geoffroy Streit</span> — <span style={{ color: '#806030' }}>Rôliste Fantasque</span> — Quid Facis
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              audio.resume();
              audio.playDialogueOpen();
              setScene(0);
            }}
            className="px-8 py-3 rounded-lg border-2 text-lg font-bold tracking-wider transition-all hover:scale-105"
            style={{
              borderColor: '#c9a227',
              color: '#c9a227',
              background: 'rgba(201,162,39,0.1)',
              fontFamily: 'serif',
              textShadow: '0 0 20px rgba(201,162,39,0.5)',
              boxShadow: '0 0 30px rgba(201,162,39,0.2)',
            }}
          >
            ⚔️ Commencer l'Aventure
          </button>
          <p className="text-xs mt-6 animate-pulse" style={{ color: '#443322', fontFamily: 'serif' }}>
            Cliquez pour commencer… · Échap pour passer
          </p>
        </div>
      </div>
    );
  }

  const isLast = scene === SCENES.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none"
      onClick={next}
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${currentScene.color}dd, #050508)`,
        transition: 'background 0.8s ease',
      }}
    >
      {/* Étoiles de fond */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-pulse"
          style={{
            width: 1 + Math.random() * 2,
            height: 1 + Math.random() * 2,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            background: '#fff',
            opacity: 0.2 + Math.random() * 0.5,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}

      {/* Illustration */}
      <div className="text-8xl mb-6" style={{
        filter: `drop-shadow(0 0 40px ${currentScene.accentColor}60)`,
        transition: 'all 0.8s ease',
      }}>
        {currentScene.emoji}
      </div>

      {/* Titre */}
      <h2
        className="text-2xl font-bold tracking-wider mb-6 text-center px-8"
        style={{
          color: currentScene.accentColor,
          fontFamily: 'serif',
          textShadow: `0 0 30px ${currentScene.accentColor}40`,
        }}
      >
        {currentScene.title}
      </h2>

      {/* Séparateur */}
      <div
        className="w-48 h-0.5 mb-6 mx-auto"
        style={{
          background: `linear-gradient(90deg, transparent, ${currentScene.accentColor}80, transparent)`,
        }}
      />

      {/* Texte avec machine à écrire */}
      <div
        className="max-w-2xl px-8 text-center leading-relaxed whitespace-pre-line"
        style={{
          color: fade ? '#d0c0a0' : '#e8d8c0',
          fontFamily: 'serif',
          fontSize: '14px',
          lineHeight: '1.8',
          transition: 'color 0.3s',
        }}
      >
        {typing}
        {typing.length < currentScene.text.length && (
          <span className="inline-block w-2 h-4 ml-1 animate-pulse" style={{ background: currentScene.accentColor }} />
        )}
      </div>

      {/* Indicateurs de progression */}
      <div className="flex items-center gap-2 mt-8">
        {SCENES.map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: i === scene ? 32 : i < scene ? 16 : 8,
              background: i <= scene ? currentScene.accentColor : '#332211',
              boxShadow: i === scene ? `0 0 10px ${currentScene.accentColor}60` : 'none',
            }}
          />
        ))}
      </div>

      {/* Bouton */}
      <p className="mt-6 text-xs animate-pulse" style={{ color: fade ? '#443322' : '#665533', fontFamily: 'serif' }}>
        {typing.length < currentScene.text.length
          ? 'Cliquez pour accélérer la lecture…'
          : isLast
          ? '⚔️ Entrer dans Phandaline'
          : 'Cliquez pour continuer ▸'}
      </p>

      {/* Crédit */}
      <div className="absolute bottom-6 text-[10px]" style={{ color: '#332211', fontFamily: 'serif' }}>
        <span style={{ color: '#554433' }}>Geoffroy Streit</span> — <span style={{ color: '#443322' }}>Rôliste Fantasque</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          skipIntro();
        }}
        className="absolute right-6 top-6 rounded-md border border-amber-700/60 bg-black/40 px-3 py-1 font-serif text-xs text-amber-200/80 transition hover:bg-amber-900/30"
      >
        Passer [Échap]
      </button>
    </div>
  );
}
