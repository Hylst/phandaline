import type { CharacterProps } from './Characters';
import { useGame, QuestId, QuestStatus } from './store';

export interface NpcDef {
  id: string;
  name: string;
  role: string;
  position: [number, number, number];
  rotationY: number;
  scale?: number;
  appearance: Partial<CharacterProps>;
}

// ===== LES PHLANDYS : Héros de Phandaline =====
// Buddy, nain moine ; Azureas, mage bleu ; Kallista, rôdeuse tieffeline rouge
// Azazel, barde tieffelin bleu ; Sindaros, prêtre-mage elfe ; Elian, paladin
// Kenrick, gobelin moine sous cape

export const NPC_DEFS: NpcDef[] = [
  // --- Personnages de quête ---
  {
    id: 'oscar',
    name: 'Oscar Bon-Vivant',
    role: 'Aubergiste du Bon-Vivant',
    position: [-4, 0, 1.4],
    rotationY: 0.9,
    appearance: {
      color: '#7a5a2a', hatType: 'conical', hatColor: '#c2a24a',
      hairColor: '#2a1810', action: 'wave', variant: 1,
    },
  },
  {
    id: 'anton',
    name: 'Anton Hizark',
    role: 'Maître-forgeron, l\'Homme-de-Fer',
    position: [6.7, 0, -4.1],
    rotationY: -2.4,
    appearance: {
      color: '#3a3a45', pantColor: '#2a2018', hatType: 'none',
      hairColor: '#5a5a5a', skinColor: '#c89868', action: 'hammer', variant: 3,
    },
  },
  {
    id: 'halfeline',
    name: 'Mira Bonne-Fortune',
    role: 'Commerçante halfeline',
    position: [4.6, 0, 3.9],
    rotationY: Math.PI + 0.4,
    scale: 0.72,
    appearance: {
      color: '#8a4a5a', hatType: 'conical', hatColor: '#5a3040',
      skinColor: '#e0b090', variant: 2,
    },
  },
  {
    id: 'eliass',
    name: 'Vieux Eliass',
    role: 'Gardien des écuries du Prince',
    position: [-25.8, 0, 22.2],
    rotationY: 0.3,
    appearance: {
      color: '#5a7a3a', hatType: 'conical', hatColor: '#8a6a3a',
      skinColor: '#d8b890', action: 'carry', variant: 3,
    },
  },
  {
    id: 'sildar',
    name: 'Sildar Hallwinter',
    role: 'Mage, conseiller du Prince Tresendar',
    position: [-4.5, 0, -1.2],
    rotationY: 0.8,
    appearance: {
      color: '#2a3858', pantColor: '#1a2040', hatType: 'hood', hatColor: '#1a2040',
      hairColor: '#c8c8d0', skinColor: '#e0c8b0', variant: 1,
    },
  },

  // --- Les Phlandys : groupe de héros ---
  {
    id: 'buddy',
    name: 'Buddy',
    role: 'Nain moine, compagnon du Feu',
    position: [-3.8, 0.5, -46.5],
    rotationY: -2.8,
    scale: 0.85,
    appearance: {
      color: '#8a4a2a', pantColor: '#6a3a1a', hatType: 'none',
      hairColor: '#5a3a1a', skinColor: '#b88868', species: 'dwarf', accessory: 'staff', variant: 0,
    },
  },
  {
    id: 'azureas',
    name: 'Azureas',
    role: 'Mage bleu',
    position: [-1.7, 0.5, -47.2],
    rotationY: -2.9,
    appearance: {
      color: '#1a3a8a', pantColor: '#0a1a4a', hatType: 'hood', hatColor: '#0a1a6a',
      hairColor: '#8888b8', skinColor: '#d8c8e0', accessory: 'staff', variant: 2,
    },
  },
  {
    id: 'kallista',
    name: 'Kallista',
    role: 'Rôdeuse tieffeline (peau rouge)',
    position: [1.1, 0.5, -46.6],
    rotationY: -3.0,
    appearance: {
      color: '#5a2a2a', pantColor: '#2a1010', hatType: 'none',
      hairColor: '#1a0808', skinColor: '#c23030', species: 'tiefling', accessory: 'bow', variant: 1,
    },
  },
  {
    id: 'azazel',
    name: 'Azazel',
    role: 'Barde tieffelin (peau bleue)',
    position: [3.5, 0.5, -46.9],
    rotationY: -3.2,
    appearance: {
      color: '#3a3a8a', pantColor: '#1a1a4a', hatType: 'turban', hatColor: '#4040c0',
      hairColor: '#2020a0', skinColor: '#3a5aa8', species: 'tiefling', accessory: 'lute', action: 'wave', variant: 0,
    },
  },
  {
    id: 'sindaros',
    name: 'Sindaros',
    role: 'Prêtre-mage elfe',
    position: [-5.7, 0.5, -51.2],
    rotationY: -1.6,
    appearance: {
      color: '#4a6a4a', pantColor: '#2a3a2a', hatType: 'hood', hatColor: '#1a2a1a',
      hairColor: '#d8d8c0', skinColor: '#e8e4d0', species: 'elf', accessory: 'holySymbol', variant: 3,
    },
  },
  {
    id: 'elian',
    name: 'Elian',
    role: 'Paladin un peu... excentrique',
    position: [5.8, 0.5, -51],
    rotationY: 1.7,
    appearance: {
      color: '#c0a040', pantColor: '#5a4a20', hatType: 'none',
      hairColor: '#8a6a20', skinColor: '#e0c890', accessory: 'holySymbol', variant: 1,
    },
  },
  {
    id: 'kenrick',
    name: 'Kenrick',
    role: 'Gobelin moine sous cape, cuisinier',
    position: [0, 0.5, -44.8],
    rotationY: Math.PI,
    scale: 0.8,
    appearance: {
      color: '#3a4a3a', pantColor: '#2a2a2a', hatType: 'hood', hatColor: '#1a2a1a',
      hairColor: '#1a2a1a', skinColor: '#6a8a5a', species: 'goblin', accessory: 'pan', variant: 2,
    },
  },
];

// ====================== SCRIPTS DE DIALOGUE ======================

export interface Script {
  lines: string[];
  onEnd?: () => void;
}

function findQuest(quests: Record<QuestId, QuestStatus>, id: QuestId): boolean {
  return quests[id] !== 'none';
}

export function npcScript(id: string, quests: Record<QuestId, QuestStatus>): Script {
  const g = useGame.getState();

  switch (id) {
    // ===================== OSCAR (aubergiste) =====================
    case 'oscar':
      if (!findQuest(quests, 'apples'))
        return {
          lines: [
            'Bienvenue au Bon-Vivant, voyageur ! Je suis Oscar Bon-Vivant, aubergiste de père en fils.',
            'C\'est ici que tout commence à Phandaline. Les bardes y chantent les exploits de Dame Tanamere, les marchands y négocient leurs minerais...',
            'Et justement, j\'ai un souci. Ma livraison de pommes (les pommes d\'or d\'Eliass !) est tombée d\'une charrette près de la porte sud.',
            'Sans elles, pas de tarte Tatinamère, ma spécialité. Rapporte-les-moi et 10 pièces sont à toi. Et une tarte gratuite, ça va de soi !',
          ],
          onEnd: () => g.setQuest('apples', 'active'),
        };
      if (quests.apples === 'active')
        return { lines: [
          'Ma tarte ! Mes pommes dorées ! Cherche du côté de la porte sud, près de la charrette qui a versé. La route est boueuse par là-bas.',
        ]};
      if (quests.apples === 'found')
        return {
          lines: [
            'Mes pommes ! Tu es mon sauveur, l\'ami. Tiens, 10 pièces bien méritées.',
            'La prochaine fois que tu passes, la tarte est pour moi. Et si tu cherches du travail, Anton le forgeron cherche quelqu\'un pour récupérer son marteau. Tu le trouveras à sa forge, vers l\'est.',
          ],
          onEnd: () => { g.setQuest('apples', 'done'); g.addGold(10); },
        };
      return { lines: [
        'Le Bon-Vivant est le cœur de Phandaline depuis trois générations. Les murs ont vu passer Dame Tanamere elle-même, tu sais...',
        'Reviens quand tu veux, il y aura toujours un bol de ragoût et une histoire à raconter.',
      ]};

    // ===================== ANTON HIZARK (forgeron) =====================
    case 'anton':
      if (!findQuest(quests, 'hammer'))
        return {
          lines: [
            'GRRR ! Encore UN marteau égaré ! Je suis Anton Hizark, l\'Homme-de-Fer. Je forge pour les Serres du Prince lui-même.',
            'Je crois l\'avoir laissé près des mannequins d\'entraînement, à l\'est, quand je testais une nouvelle lame sur les bottes de paille.',
            'Sans lui, je ne peux honorer les commandes des Serres. Rapporte-le et tu auras 15 pièces. Et peut-être une petite réduction sur une épée, plus tard...',
          ],
          onEnd: () => g.setQuest('hammer', 'active'),
        };
      if (quests.hammer === 'active')
        return { lines: [
          'Les mannequins ! À l\'est ! Tu ne peux pas les louper, ils sont alignés près des remparts. Mon marteau a un manche en chêne noir, tu le reconnaîtras.',
        ]};
      if (quests.hammer === 'found')
        return {
          lines: [
            'Mon marteau ! Par Moradin, quel soulagement. Ce brave outil m\'accompagne depuis quarante ans.',
            'Tiens, voici tes 15 pièces. Et si jamais tu cherches une armure digne de ce nom, repasse me voir. Les Serres ont de bons rabais pour les âmes vaillantes.',
          ],
          onEnd: () => { g.setQuest('hammer', 'done'); g.addGold(15); },
        };
      return { lines: [
        'Le fer de Phancreux chante sous mon marteau. Depuis la réouverture des mines, la qualité n\'a jamais été aussi bonne. Les nains savent y faire.',
      ]};

    // ===================== MIRA BONNE-FORTUNE (commerçante halfeline) =====================
    case 'halfeline':
      if (!findQuest(quests, 'letter'))
        return {
          lines: [
            'Oh, un nouveau visage ! Ravie de te rencontrer, chéri(e). Je suis Mira Bonne-Fortune, de la famille Halfeline. Nous avons des comptoirs à Connyberry et Leilon aussi !',
            'J\'ai reçu une lettre urgente de Padhiver : ils disent que la piste vers Troisanglier n\'est plus sûre. Des traces de gobelins... et pire.',
            'Porte cette lettre scellée à Sildar Hallwinter, le mage du Prince. Il saura quoi en faire. 20 pièces pour ta peine, et une réduction au magasin !',
          ],
          onEnd: () => g.setQuest('letter', 'active'),
        };
      if (quests.letter === 'active')
        return { lines: [
          'Sildar Hallwinter est un vieux loup aux cheveux d\'argent, il traîne souvent vers la place centrale, à l\'ouest du puits. Ne tarde pas, cette lettre est importante !',
        ]};
      return { lines: [
        'Les Halfeline sont de redoutables marchands, je l\'admets. Mais gare à qui veut nous rouler : nous avons le bras long à Phandaline, et le Prince Tresendar lui-même nous doit quelques faveurs...',
      ]};

    // ===================== VIEUX ELIASS (écuries) =====================
    case 'eliass':
      return {
        lines: [
          'Ah ! Un jeune visage ! Je m\'appelle Eliass, je m\'occupe des écuries du Prince depuis... eh bien, depuis le temps où le dragon vert Azdraka terrorisait la région !',
          'J\'ai vu Dame Tanamere partir pour son combat contre la bête. Je l\'ai vue revenir... portée par Aldrith le Faucon Noir, seul survivant.',
          'Elle a donné sa vie pour nous sauver. Le Prince Tresendar a fait ériger le Tertre du Dragon en son honneur, tu le verras sur la colline.',
          'Maintenant c\'est à vous, les jeunes, de protéger ce qu\'elle nous a légué. Un coup de main aux écuries et tu ne repartiras pas les mains vides !',
        ],
      };

    // ===================== SILDAR HALLWINTER =====================
    case 'sildar':
      if (quests.letter === 'active')
        return {
          lines: [
            'Une lettre de Mira Bonne-Fortune ? Donne-moi ça...',
            'Hum. Des traces de gobelins sur la route de Troisanglier. Et elle mentionne des écailles vertes dans les sous-bois... Écailles vertes.',
            'Il y a 500 ans, nous pensions Azdraka mort. Et si ce n\'était pas le cas ? Ou bien sa lignée... Je dois en référer au Prince immédiatement.',
            'Tu as rendu un fier service à Phandaline, citoyen. Voici 20 pièces d\'or. Et reste sur tes gardes : les temps qui viennent pourraient être plus sombres que prévu.',
          ],
          onEnd: () => { g.setQuest('letter', 'done'); g.addGold(20); },
        };
      return {
        lines: [
          'Je suis Sildar Hallwinter, conseiller du Prince Aldrith Tresendar. Je conseille, j\'étudie, je veille.',
          'La mine du Ressac, dans la Caverne éponyme, est le cœur battant de notre richesse. L\'eau qui y coule vient du Plan Élémentaire de l\'Eau lui-même, le mage Mormesk l\'a confirmé.',
          'Cette magie fait la puissance de Phandaline... et sa vulnérabilité. Reste vigilant, aventurier.',
        ],
      };

    // ===================== BUDDY (nain moine) =====================
    case 'buddy':
      return {
        lines: [
          'Gloire à Moradin, p\'tit gars ! Je suis Buddy, moine nain, du clan des Forge-Pierre.',
          'J\'ai troqué le marteau de guerre contre le bâton et la méditation. Ça étonne, hein ? Un nain qui ne forge pas !',
          'Mais crois-moi, quand la situation chauffe, mes poings parlent aussi fort que l\'enclume d\'Anton.',
          'On tient désormais nos quartiers au vieux manoir des Tresendar, sur la colline nord. C\'est notre demeure, notre salle de réunion... et parfois notre cuisine.',
        ],
      };

    // ===================== AZUREAS (mage bleu) =====================
    case 'azureas':
      return {
        lines: [
          'Hmm... Salutations, intriguant spécimen. Je suis Azureas, arcaniste de la Tour Bleue de Padhiver.',
          'Les flux magiques ici sont... fascinants. La proximité du Plan Élémentaire de l\'Eau dans la Caverne du Ressac crée des anomalies résiduelles.',
          'J\'ai installé un laboratoire discret dans l\'aile est du manoir Tresendar. Si tu entends des murmures dans les sources, ne t\'inquiète pas... habituellement.',
        ],
      };

    // ===================== KALLISTA (tieffeline rouge) =====================
    case 'kallista':
      return {
        lines: [
          'Ne t\'approche pas trop, humain. Kallista, rôdeuse. Mon arc voit plus loin que tes yeux.',
          'Je piste les traces de gobelins sur la route du Fort de l\'Aigle depuis trois lunes. Les Serres du Faucon Noir patrouillent, mais ce n\'est pas suffisant.',
          'Azazel est mon frère, il a la peau bleue, tu ne peux pas le louper. Depuis le manoir, je garde un œil sur les bois et sur ses mensonges.',
        ],
      };

    // ===================== AZAZEL (barde tieffelin bleu) =====================
    case 'azazel':
      return {
        lines: [
          '🎵 Ah, un nouveau public ! Je suis Azazel, barde des Phlandys, et je chante les légendes depuis Padhiver jusqu\'à Eauprofonde.',
          'Tu connais la complainte de Dame Tanamere ? ♪ Cinq jours et cinq nuits, la guerrière tint bon, le dragon tomba, mais elle aussi ♪...',
          'La grande salle du manoir Tresendar a une acoustique divine. Si tu as quelques pièces, j\'en connais des bien plus tristes. Ou des bien plus grivoises, selon ton humeur !',
        ],
      };

    // ===================== SINDAROS (elfe prêtre-mage) =====================
    case 'sindaros':
      return {
        lines: [
          'Que la grâce de Corellon Larethian t\'accompagne, voyageur. Je suis Sindaros, prêtre et arcaniste.',
          'Je médite à la chapelle du manoir Tresendar et au sanctuaire de Phandaline. Nous veillons sur l\'équilibre entre les plans.',
          'Les dieux anciens murmurent dans les feuilles du Bois de Padhiver. Apprends à écouter, et tu entendras leurs conseils.',
        ],
      };

    // ===================== ELIAN (paladin excentrique) =====================
    case 'elian':
      return {
        lines: [
          'Salut, beauté ! Elian, paladin de Torm, pourfendeur du mal... et accessoirement célibataire.',
          'Mon armure brille parce que je la polis tous les matins, oui. Une apparence négligée est une insulte envers les dieux, pas vrai ?',
          'Je garde la porte du manoir quand je ne me regarde pas dans les reflets de mon bouclier. Bon, certes, je ne suis pas le plus pieux des paladins... mais mon épée est sacrée !',
        ],
      };

    // ===================== KENRICK (gobelin sous cape) =====================
    case 'kenrick':
      return {
        lines: [
          '...chut ! Parle moins fort, tu vas me faire repérer. Je suis Kenrick. Moine. Et cuisinier.',
          'Oui, je suis gobelin. Oui, je porte une cape. Non, je ne suis pas un espion. J\'essaie juste de survivre, tu vois ?',
          'Je cuisine pour les Phlandys au manoir. Mes popovers au fromage sont célèbres dans tout le secteur. Si tu promets de ne rien dire sur ma... nature, je te ferai goûter.',
        ],
      };

    default:
      return { lines: ['Bonjour, voyageur. Bienvenue à Phandaline.'] };
  }
}
