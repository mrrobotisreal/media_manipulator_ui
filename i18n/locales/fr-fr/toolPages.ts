/**
 * French partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope (MM57, 2026-10-26): only Motion's full page body, which
 * `i18n/motionTranslations.test.ts` requires for every `translated: true`
 * locale (coordinator decision; the ticket otherwise keeps toolPages out of
 * scope). The other tool pages render English until a later session adds
 * per-slug entries here, as de/es do.
 *
 * Register: formal "vous"; brand names, formats and codecs stay untranslated;
 * "Darkroom" and "Motion" stay as they are. Model-written, needs native review.
 */

const frToolPages = {
  pages: {
    // MM48/MM57: Motion's full page body (model-written, needs native review). The brand stays "Motion".
    motion: {
      tagline: 'Dessinez ou importez un SVG, animez-le sur une timeline d’images clés et exportez en SVG animé, Lottie, React, JavaScript, Flutter ou GIF, le tout dans votre navigateur.',
      intro: 'Motion est un éditeur SVG doté d’une timeline d’animation, intégré à Media Manipulator. Ouvrez un fichier SVG (ou une animation Lottie) et chaque forme devient un calque que vous pouvez sélectionner, déplacer, recolorer et animer, ou partez d’une zone de dessin vierge et dessinez avec les outils rectangle, ellipse, ligne, plume et texte. Chaque propriété animée reçoit sa propre piste d’images clés, avec des préréglages d’accélération, un éditeur de courbe pour une accélération personnalisée et des clés de maintien pour les sauts instantanés. Des animateurs en un clic ajoutent le tracé progressif du contour, le déplacement le long d’une trajectoire, le morphing de formes, les changements de couleur de dégradé, l’animation de masque et le flou. Quand le mouvement vous convient, exportez-le en SVG animé, fichier Lottie, composant React, module JavaScript ou TypeScript, widget Flutter ou GIF. L’édition et chaque export s’exécutent dans votre navigateur : votre dessin n’est donc jamais envoyé sur nos serveurs pour être exporté.',
      whatItDoes: [
        'Importe les fichiers SVG dans une arborescence de calques modifiables (groupes, tracés, formes, texte, images, dégradés, masques et tracés de détourage) et importe les animations Lottie JSON avec leurs images clés.',
        'Dessine de nouveaux graphiques avec les outils rectangle, ellipse, ligne, plume (Bézier) et texte, et modifie les nœuds des tracés directement sur la zone de dessin.',
        'Anime la position, l’échelle, la rotation, l’inclinaison, l’opacité, le remplissage, le contour et l’épaisseur du contour sur une timeline d’images clés avec des accélérations linéaire, en entrée, en sortie, en entrée-sortie, cubic-bezier personnalisée et maintien.',
        'Ajoute des animations avancées en un clic : tracé progressif du contour, déplacement le long d’une trajectoire avec rotation automatique facultative, morphing de formes, couleurs des étapes de dégradé, animation de masque et de tracé de détourage, et flou.',
        'Exporte un SVG statique (toujours gratuit), un SVG animé lisible sans aucune bibliothèque, du Lottie JSON, un composant React, un module JavaScript ou TypeScript, un widget Flutter et un GIF animé.',
      ],
      flowSteps: [
        {
          title: 'Ouvrir ou dessiner',
          description: 'Importez un fichier SVG ou Lottie, ou dessinez des formes et des tracés sur une zone de dessin vierge.',
        },
        {
          title: 'Animer',
          description: 'Déplacez la tête de lecture et modifiez une propriété : la timeline enregistre une image clé.',
        },
        {
          title: 'Façonner le rythme',
          description: 'Choisissez un préréglage d’accélération, dessinez une courbe personnalisée, ajoutez des maintiens ou appliquez un animateur en un clic.',
        },
        {
          title: 'Exporter',
          description: 'Téléchargez du SVG animé, Lottie, React, JS/TS, Flutter ou GIF, créé dans votre navigateur.',
        },
      ],
      advancedDetails: [
        'L’export en SVG animé utilise des images clés CSS pures chaque fois que tous les effets peuvent s’exprimer en CSS dans Chrome, Firefox et Safari. Les morphings de forme, les étapes de dégradé mobiles et le flou nécessitent un petit script ; ces fichiers intègrent donc une copie allégée d’anime.js (licence MIT, environ 14 Ko compressés) avec sa mention de licence en tête.',
        'Le morphing de formes normalise les deux formes au même nombre de segments de courbe et aligne leurs points de départ et leur sens de parcours, pour que le morphing ne se torde pas. Deux formes impossibles à apparier sont maintenues au lieu d’être morphées.',
        'Le générateur Lottie cible la spécification Lottie 1.0.1 et l’ensemble de fonctionnalités « Basic » de LottieFiles. Tout ce que Lottie ne peut pas transporter (filtres, texte ou masques avancés, par exemple) est listé après le téléchargement ; rien n’est écarté en silence.',
        'L’export GIF utilise un encodeur écrit pour Media Manipulator, avec une palette globale unique construite à partir d’images réparties sur toute l’animation, pour que les graphiques vectoriels à aplats conservent leurs couleurs exactes.',
        'Les SVG importés sont nettoyés à l’entrée : scripts, gestionnaires d’événements, références externes et autres contenus non sûrs sont supprimés, et l’éditeur reconstruit le balisage non pris en charge à partir d’une liste autorisée au lieu de l’insérer comme du HTML.',
      ],
      whyItMatters: [
        'Les SVG animés restent nets à toutes les tailles et sont généralement bien plus légers qu’une vidéo ou un GIF de la même animation, ce qui les rend idéaux pour les logos, les icônes, les animations de chargement et les illustrations sur le web.',
        'Les développeurs ont besoin d’animation sous forme de code, pas seulement de vidéo : un composant React, un module JavaScript, un fichier Lottie ou un widget Flutter s’intègre directement dans une application.',
        'Exporter dans le navigateur signifie que votre dessin reste sur votre appareil ; seul un décompte de chaque export nous est envoyé, pour appliquer le quota quotidien.',
      ],
      useCases: [
        {
          title: 'Animation de logos et d’icônes',
          description: 'Faites apparaître un logo par un tracé progressif, ou faites rebondir, tourner ou changer de couleur une icône au survol.',
        },
        {
          title: 'Animations de chargement et micro-animations d’interface',
          description: 'Créez des spinners et des animations de progression et exportez-les en SVG CSS pur ou en composant React.',
        },
        {
          title: 'Lottie pour les applications mobiles',
          description: 'Exportez du Lottie JSON pour les lecteurs Lottie iOS, Android, web et Flutter, ou modifiez un fichier Lottie existant.',
        },
        {
          title: 'Illustrations animées',
          description: 'Déplacez des parties d’une illustration le long de trajectoires, morphez des formes les unes en les autres et exportez un GIF pour la messagerie ou l’e-mail.',
        },
      ],
      whyMediaManipulator: [
        'Un véritable éditeur à calques et images clés, avec maintiens, courbes personnalisées et animateurs avancés, pas une galerie de modèles.',
        'Des exports pour les designers comme pour les développeurs : SVG animé, Lottie, React, JavaScript ou TypeScript, Flutter et GIF à partir d’un seul projet.',
        'Les exports sont créés dans votre navigateur, et le seul code tiers qu’un export utilise est sous licence permissive (anime.js sous MIT ; flutter_svg et webview_flutter pour Flutter), sa mention de licence étant conservée dans le fichier.',
      ],
      privacyNote: 'L’édition et l’export ont lieu dans votre navigateur ; votre dessin n’est pas envoyé sur nos serveurs pour être exporté. Sans compte, les projets ne sont conservés que dans ce navigateur. Si vous vous connectez et enregistrez un projet dans votre compte, il est stocké sur nos serveurs comme un projet Darkroom, suit la durée de conservation que vous choisissez et peut être supprimé depuis votre page Compte. Pour chaque export, nous n’enregistrons que son format, sa taille, sa durée et son heure, afin d’appliquer le quota quotidien.',
      faq: [
        {
          question: 'Motion est-il gratuit ?',
          answer: 'Oui. Ouvrir Motion, dessiner, animer, enregistrer et exporter un SVG statique est gratuit et illimité, sans compte. Les exports animés sont décomptés d’un quota quotidien qui dépend de votre offre ; le tableau des offres sur cette page indique le quota et les formats de chaque offre.',
        },
        {
          question: 'Quels formats puis-je exporter ?',
          answer: 'SVG statique, SVG animé (CSS, ou un petit script intégré si nécessaire), Lottie JSON, un composant React (.tsx), un module JavaScript ou TypeScript, un widget Flutter (.dart) et un GIF animé. Les formats inclus dans votre offre et le nombre d’exports quotidiens sont indiqués dans le tableau des offres sur cette page.',
        },
        {
          question: 'Quelles sont les limites ?',
          answer: 'Les exports animés sont comptés par jour et réinitialisés à minuit UTC. Les visiteurs sans compte ne peuvent enregistrer leurs projets que dans leur navigateur ; les offres avec connexion enregistrent un certain nombre de projets dans le compte. Les visiteurs ont aussi une durée d’animation maximale à l’export, et l’export GIF a une limite de taille et de durée. Tous les chiffres à jour figurent dans le tableau des offres sur cette page et sur la page des tarifs.',
        },
        {
          question: 'Puis-je animer un SVG que je possède déjà ?',
          answer: 'Oui. Importez n’importe quel SVG : ses groupes, tracés, formes, textes, dégradés, masques et tracés de détourage deviennent des calques modifiables. Les parties que l’éditeur ne peut pas modifier, comme les motifs ou les filtres complexes, sont conservées et exportées sans changement, et tout élément non sûr (scripts ou liens externes) est supprimé et listé après l’import.',
        },
        {
          question: 'Lottie est-il pris en charge ?',
          answer: 'Oui, dans les deux sens. Vous pouvez importer un fichier Lottie JSON pour le modifier, et exporter votre animation en Lottie JSON pour lottie-web et les lecteurs Lottie iOS, Android et Flutter. Les fonctionnalités qu’un côté ne peut pas représenter sont listées dans la boîte de dialogue au lieu d’être écartées en silence.',
        },
        {
          question: 'Quels navigateurs prennent en charge l’export vidéo ?',
          answer: 'L’export GIF fonctionne dans tous les navigateurs modernes. Les exports MP4 et WebM reposent sur WebCodecs, l’encodeur vidéo intégré du navigateur, disponible dans Chrome et Edge, et dans les versions récentes de Safari et Firefox selon le codec ; la boîte de dialogue d’export vérifie votre navigateur et vous prévient lorsqu’il ne peut pas encoder. Le tableau des offres sur cette page indique quelle offre inclut chaque format vidéo.',
        },
        {
          question: 'Quelle licence s’applique au code exporté ?',
          answer: 'Votre animation vous appartient. Lorsqu’un SVG animé ou un export de code a besoin d’un moteur d’exécution, il utilise anime.js, sous licence MIT ; sa mention de copyright est écrite en tête du fichier et doit y rester. Les exports Flutter utilisent le paquet flutter_svg (MIT) ou webview_flutter (BSD-3-Clause). Tout le reste du fichier est généré à partir de votre projet. Les bibliothèques open source utilisées par l’éditeur sont listées sur notre page des licences.',
        },
        {
          question: 'Où mes projets sont-ils stockés ?',
          answer: 'Sans compte, les projets ne sont conservés que dans ce navigateur ; effacer vos données de navigation les supprime donc. Lorsque vous êtes connecté, vous pouvez enregistrer un projet dans votre compte ; il se synchronise alors entre vos appareils, s’enregistre automatiquement pendant que vous travaillez, suit la durée de conservation que vous avez choisie et peut être supprimé depuis votre page Compte.',
        },
      ],
      supportedFormats: {
        supportedInputFormats: [
          'SVG',
          'Lottie JSON',
          'Projet Motion (.json)',
        ],
        supportedOutputFormats: [
          'SVG statique',
          'SVG animé',
          'Lottie JSON',
          'React (.tsx)',
          'JavaScript / TypeScript',
          'Flutter (.dart)',
          'GIF',
        ],
        maxFileNotes: [
          'Imports SVG et Lottie jusqu’à 4 Mo chacun.',
          'Les projets sans compte ne vivent que dans ce navigateur ; les projets de compte suivent la durée de conservation que vous choisissez.',
        ],
        processingNotes: [
          'L’édition, l’aperçu et chaque export s’exécutent dans votre navigateur. Seul un décompte de chaque export est envoyé à nos serveurs.',
        ],
      },
      embed: {
        title: 'Ouvrir Motion',
        description: 'Commencez un nouveau dessin ou rouvrez-en un récent. L’éditeur s’ouvre en plein écran ; votre travail est conservé dans ce navigateur, et les utilisateurs connectés peuvent l’enregistrer dans leur compte.',
      },
      related: [
        {
          label: 'Tutoriel Motion',
          to: '/tutorials/motion',
          description: 'Importez un SVG, animez-le, façonnez l’accélération et exportez-le, pas à pas.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Montez des vidéos sur une timeline multipiste et exportez en MP4.',
        },
        {
          label: 'Convertir une vidéo en GIF animé',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Transformez un clip vidéo en GIF lorsque votre animation a commencé comme des images filmées.',
        },
        {
          label: 'Licences open source',
          to: '/licenses',
          description: 'Les bibliothèques que l’éditeur exécute et écrit dans vos exports.',
        },
      ],
      metaTitle: 'Motion : éditeur d’animation SVG en ligne gratuit | Media Manipulator',
      metaDescription: 'Animez du SVG dans votre navigateur : images clés, accélération, maintiens, tracé progressif, trajectoires et morphing. Exportez en SVG animé, Lottie JSON, React, JS, Flutter ou GIF.',
      ogTitle: 'Motion : animez du SVG dans votre navigateur',
      ogDescription: 'Importez un SVG ou dessinez-en un, animez-le sur une timeline d’images clés et exportez en SVG animé, Lottie JSON, React, JavaScript, Flutter ou GIF. Les exports sont créés dans votre navigateur.',
    },
    // 2026-10-28 catalog expansion: name + tagline for the /tools catalog cards (model-written, needs native review).
    'inspect-metadata': {
      name: 'Inspecteur de métadonnées',
      tagline: 'Voyez toutes les balises cachées dans une photo, une vidéo, un fichier audio ou un PDF : EXIF, position GPS, appareil photo, codecs, ID3, XMP et plus encore, avant de le partager.',
    },
    'edit-image-metadata': {
      name: 'Modifier les métadonnées d’une image',
      tagline: 'Définissez le titre, l’auteur, le copyright, les mots-clés et la description d’une photo, corrigez ou supprimez sa position GPS et réécrivez les balises EXIF et IPTC.',
    },
    'change-video-speed': {
      name: 'Modifier la vitesse d’une vidéo',
      tagline: 'Créez un time-lapse à 2x, 4x ou plus, ou ralentissez un clip à 0,5x ou 0,25x, avec un son resté synchronisé.',
    },
    'reverse-video': {
      name: 'Inverser une vidéo',
      tagline: 'Lisez n’importe quel clip à l’envers, avec ou sans le son inversé, et, si vous le souhaitez, en aller-retour (ping-pong), d’abord vers l’avant puis vers l’arrière.',
    },
    'flip-video': {
      name: 'Retourner et miroiter une vidéo',
      tagline: 'Inversez une vidéo à l’horizontale pour corriger une webcam ou un selfie en miroir, ou retournez-la à la verticale, en un clic.',
    },
    'stabilize-video': {
      name: 'Stabiliser une vidéo',
      tagline: 'Atténuez les tremblements de la caméra à la main et les secousses de la marche avec un stabilisateur en deux passes, sans trépied ni logiciel de montage.',
    },
    'change-video-frame-rate': {
      name: 'Modifier la fréquence d’images d’une vidéo',
      tagline: 'Convertissez une vidéo en 24, 25, 30 ou 60 images/s, ramenez un clip de 60 à 30 images/s pour obtenir un fichier plus léger, ou adaptez-la à la fréquence d’images de votre projet.',
    },
    'adjust-video-color': {
      name: 'Ajuster la luminosité et les couleurs d’une vidéo',
      tagline: 'Éclaircissez un clip sombre, ajoutez du contraste et de la saturation, décalez la teinte, ou appliquez un flou ou un rendu artistique, avec des curseurs et un aperçu en direct.',
    },
    'convert-video-to-hevc': {
      name: 'Convertir une vidéo en HEVC (H.265)',
      tagline: 'Réencodez n’importe quelle vidéo en H.265 pour obtenir environ la moitié de la taille du H.264 à qualité égale, idéal pour le stockage, la 4K et les appareils récents.',
    },
    'convert-audio-to-wav': {
      name: 'Convertir un fichier audio en WAV',
      tagline: 'Transformez du MP3, M4A, WAV, OGG, FLAC et tout autre fichier audio en WAV sans aucune perte.',
    },
    'convert-audio-to-flac': {
      name: 'Convertir un fichier audio en FLAC',
      tagline: 'Transformez du MP3, M4A, WAV, OGG, FLAC et tout autre fichier audio en FLAC sans aucune perte.',
    },
    'convert-audio-to-ogg': {
      name: 'Convertir un fichier audio en OGG',
      tagline: 'Transformez du MP3, M4A, WAV, OGG, FLAC et tout autre fichier audio en OGG avec le débit de votre choix.',
    },
    'convert-audio-to-m4a': {
      name: 'Convertir un fichier audio en M4A / AAC',
      tagline: 'Transformez du MP3, M4A, WAV, OGG, FLAC et tout autre fichier audio en M4A / AAC avec le débit de votre choix.',
    },
    'convert-audio-to-opus': {
      name: 'Convertir un fichier audio en Opus',
      tagline: 'Transformez du MP3, M4A, WAV, OGG, FLAC et tout autre fichier audio en Opus avec le débit de votre choix.',
    },
    'convert-mp3-to-wav': {
      name: 'Convertir un MP3 en WAV',
      tagline: 'Transformez un MP3 en WAV non compressé pour le monter, l’échantillonner ou le graver sur CD.',
    },
    'change-audio-speed': {
      name: 'Modifier la vitesse d’un fichier audio',
      tagline: 'Accélérez un cours ou un podcast à 1,5x, ou ralentissez un morceau ou un enregistrement à 0,75x pour vous entraîner, sans modifier la hauteur.',
    },
    'change-audio-pitch': {
      name: 'Modifier la hauteur d’un fichier audio',
      tagline: 'Décalez un morceau ou un enregistrement par demi-tons pour changer de tonalité, abaisser une voix ou accorder un sample, en conservant le même tempo.',
    },
    'normalize-audio': {
      name: 'Normaliser un fichier audio',
      tagline: 'Portez un enregistrement trop faible à un volume homogène, pour que podcasts, mémos vocaux et playlists mixtes soient lus au même niveau.',
    },
    'adjust-audio-volume': {
      name: 'Ajuster le volume d’un fichier audio',
      tagline: 'Rendez un fichier audio plus fort ou plus faible d’une valeur fixe, de 10 pour cent au double, ou en décibels avec le curseur d’amplification.',
    },
    'audio-equalizer': {
      name: 'Égaliseur audio',
      tagline: 'Appliquez un renforcement des basses, un relèvement des aigus, une présence vocale ou un préréglage par genre, ou réglez des filtres passe-bas et passe-haut, puis téléchargez le résultat.',
    },
    'add-reverb-to-audio': {
      name: 'Ajouter de la réverbération à un fichier audio',
      tagline: 'Placez une voix ou un enregistrement sec dans une pièce, une salle, une réverbération à plaque ou à ressort, ou ajoutez un delay ou un écho, puis téléchargez le résultat.',
    },
    'trim-audio': {
      name: 'Couper un fichier audio',
      tagline: 'Coupez un MP3, un WAV ou n’importe quel enregistrement entre un début et une fin, avec une forme d’onde pour choisir les points, et téléchargez uniquement cette partie.',
    },
    'transcribe-audio': {
      name: 'Transcrire un fichier audio',
      tagline: 'Transformez un MP3, WAV, M4A ou n’importe quel enregistrement en texte, sous-titres ou JSON grâce à la reconnaissance vocale par IA sur nos propres serveurs GPU.',
    },
    'add-text-to-image': {
      name: 'Ajouter du texte à une image',
      tagline: 'Ajoutez une légende, un titre ou un filigrane sur une photo : choisissez la police, la taille, la couleur, le contour et la position, puis téléchargez-la.',
    },
    'crop-image': {
      name: 'Recadrer une image',
      tagline: 'Faites glisser un cadre sur la partie de la photo qui vous intéresse, redressez le cadrage et téléchargez uniquement cette zone dans le format de votre choix.',
    },
    'grayscale-image': {
      name: 'Convertir une image en noir et blanc',
      tagline: 'Transformez une photo couleur en niveaux de gris, ou en sépia pour un ton vintage, et téléchargez-la dans le format de votre choix.',
    },
    'image-filters': {
      name: 'Filtres et effets d’image',
      tagline: 'Peinture à l’huile, croquis, fusain, relief, vintage, tourbillon, flou, netteté et plus encore, appliqués à n’importe quelle photo en un clic.',
    },
    'rotate-image': {
      name: 'Faire pivoter une image',
      tagline: 'Faites pivoter une photo de 90°, 180° ou 270°, corrigez un scan ou une photo de téléphone de travers, et téléchargez-la dans le format de votre choix.',
    },
    'sharpen-image': {
      name: 'Accentuer la netteté d’une image',
      tagline: 'Faites ressortir les contours d’une photo ou d’un scan un peu flou grâce à un renforcement de netteté en un clic, et téléchargez-le dans le format de votre choix.',
    },
    'blur-image': {
      name: 'Flouter une image',
      tagline: 'Adoucissez une photo entière pour un arrière-plan, un espace réservé ou un écran de confidentialité, et téléchargez-la dans le format de votre choix.',
    },
    'generate-vtt-captions': {
      name: 'Générateur de sous-titres VTT',
      tagline: 'Créez un fichier de sous-titres .vtt pour une vidéo HTML5, YouTube ou un lecteur grâce à la transcription par IA sur nos propres serveurs GPU.',
    },
    'summarize-video': {
      name: 'Résumer une vidéo',
      tagline: 'Obtenez la transcription et une analyse JSON structurée d’un cours, d’une réunion ou d’un entretien, avec horodatage, sur nos propres serveurs GPU.',
    },
  },
} as const;

export default frToolPages;
