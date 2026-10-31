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
      name: 'Motion',
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
    // MM75: summarize-video / summarize-audio full page bodies (model-written, needs native review).
    'summarize-video': {
      name: 'Résumer une vidéo',
      h1: 'Résumer une vidéo avec l\'IA : chapitres, sujets et texte à l\'écran',
      tagline: 'Obtenez un résumé écrit d\'un cours, d\'une réunion ou d\'un tutoriel, avec des chapitres cliquables, les sujets et le texte à l\'écran, généré sur nos propres serveurs GPU.',
      metaTitle: 'Résumé vidéo par IA avec chapitres | Media Manipulator',
      metaDescription: 'Importez une vidéo et obtenez un résumé écrit avec des chapitres horodatés, les sujets et le texte affiché à l\'écran. L\'IA s\'exécute sur nos propres serveurs GPU, jamais sur une IA tierce. Compte gratuit requis.',
      ogTitle: 'Résumer une vidéo avec l\'IA',
      ogDescription: 'Un résumé écrit avec chapitres cliquables, sujets et texte à l\'écran. Compte gratuit requis.',
      embed: {
        title: 'Résumer une vidéo',
        description: 'Connectez-vous, importez une vidéo (ou un fichier audio) et choisissez la langue du résumé. Vous obtenez un titre, un court résumé, des chapitres qui mènent au moment voulu de votre vidéo, les sujets et le texte qui apparaît à l\'écran.',
      },
      intro: 'Personne n\'a envie de revoir une heure de réunion ou de cours pour trouver les cinq minutes qui comptaient. Media Manipulator regarde et écoute à votre place : il transcrit la parole avec Whisper, examine avec un modèle de vision des images choisies là où l\'image change, et rédige un résumé à partir des deux, le tout sur un serveur GPU que nous exploitons. Le résultat est un court document : un titre, quelques phrases, des chapitres avec heures de début et de fin, les sujets et le texte apparu à l\'écran. Cliquez sur un chapitre pour aller à ce moment de votre vidéo, copiez le tout en Markdown ou téléchargez-le en Markdown ou en JSON. Les résumés nécessitent un compte gratuit.',
      whatItDoes: [
        'Rédige un titre et un résumé de trois à six phrases de toute la vidéo.',
        'Découpe la vidéo en chapitres avec heures de début et de fin ; un clic place le lecteur à ce moment.',
        'Liste les sujets et le texte qui apparaît à l\'écran, avec l\'heure de sa première apparition.',
        'Décrit l\'image et la parole, et signale ce qui n\'a pas pu être fait (par exemple, absence de parole).',
        'Rédige le résumé dans la langue de votre choix, ou dans la langue parlée.',
      ],
      flowSteps: [
        {
          title: 'Connexion',
          description: 'Un compte gratuit suffit.',
        },
        {
          title: 'Import',
          description: 'Une vidéo ou un fichier audio.',
        },
        {
          title: 'Résumé',
          description: 'La parole et les images sont analysées sur notre serveur GPU.',
        },
        {
          title: 'Lecture',
          description: 'Cliquez sur les chapitres, copiez le Markdown, téléchargez le .md ou le .json.',
        },
      ],
      advancedDetails: [
        'La parole est transcrite avec Whisper ; les images sont choisies aux changements de scène, dans la limite du quota d\'images de votre offre (24 en Free, 48 en Premium, 96 en Pro), puis décrites par lots par un modèle de vision.',
        'Un modèle de langage rédige le résumé à partir de la transcription et des notes sur les images. Les comptes Pro peuvent demander un résumé plus approfondi par un modèle plus grand lorsqu\'il est disponible.',
        'Un résumé compte pour une tâche IA de votre quota quotidien ; une tâche échouée ou refusée n\'est pas comptée.',
        'La transcription est générée automatiquement, donc les noms et les chiffres peuvent être erronés. Le résumé le signale dans ses notes.',
      ],
      whyItMatters: [
        'Un résumé avec chapitres se parcourt en une minute ; la vidéo, non.',
        'Les horodatages cliquables vous mènent directement au passage dont vous avez besoin.',
        'Le texte à l\'écran capte les titres de diapositives et les légendes que la parole ne prononce jamais.',
      ],
      useCases: [
        {
          title: 'Compte rendu de réunion',
          description: 'Décisions et sujets, avec les horaires pour vérifier les détails.',
        },
        {
          title: 'Notes de cours',
          description: 'Des chapitres par partie et le texte des diapositives, pour réviser.',
        },
        {
          title: 'Plan de tutoriel',
          description: 'Les étapes en chapitres, pour aller directement à celle qu\'il vous faut.',
        },
        {
          title: 'Aperçu d\'entretien',
          description: 'Ce qui a été abordé, et à quel moment.',
        },
      ],
      whyMediaManipulator: [
        'Whisper et les modèles de vision et de langage s\'exécutent sur du matériel que nous exploitons ; votre vidéo n\'est jamais envoyée à une IA tierce.',
        'Des chapitres qui naviguent dans votre propre vidéo, directement dans la visionneuse de résultats.',
        'Téléchargements en Markdown et JSON. Les fichiers sont conservés 24 heures pour les invités ; avec un compte gratuit, vous choisissez de 24 heures à 2 ans.',
      ],
      privacyNote: 'Les résumés nécessitent un compte gratuit, la tâche y est donc rattachée. Votre fichier est traité sur nos propres serveurs, et les modèles d\'IA s\'exécutent sur un serveur GPU que nous exploitons ; rien n\'est envoyé à un fournisseur d\'IA tiers. Les fichiers sont conservés 24 heures pour les invités ; avec un compte gratuit, vous choisissez de 24 heures à 2 ans.',
      faq: [
        {
          question: 'Ai-je besoin d\'un compte ?',
          answer: 'Oui, un compte gratuit. Les résumés font appel à plusieurs modèles d\'IA sur notre serveur GPU ; ils sont donc réservés aux utilisateurs connectés.',
        },
        {
          question: 'Qu\'obtiens-je ?',
          answer: 'Un titre, un court résumé, des chapitres avec heures de début et de fin, des sujets, le texte à l\'écran avec les horaires, une description de l\'image et de la parole, et des notes sur tout ce qui n\'a pas pu être fait.',
        },
        {
          question: 'Puis-je choisir la langue du résumé ?',
          answer: 'Oui. Choisissez l\'une des 18 langues du site, ou « identique à la parole » pour le rédiger dans la langue parlée.',
        },
        {
          question: 'Et si la vidéo ne contient pas de parole ?',
          answer: 'Le résumé est rédigé à partir de l\'image seule et le signale dans ses notes. Un fichier sans image ni son est refusé et n\'est pas comptabilisé.',
        },
        {
          question: 'Ma vidéo est-elle envoyée à un tiers ?',
          answer: 'Non. Chaque modèle s\'exécute sur un serveur GPU que nous exploitons.',
        },
        {
          question: 'Cela est-il décompté de mon quota ?',
          answer: 'Oui, pour une tâche IA. Les tâches échouées ne sont pas comptées.',
        },
      ],
      related: [
        {
          label: 'Résumer un audio',
          to: '/tools/summarize-audio',
          description: 'Pour les podcasts et les enregistrements.',
        },
        {
          label: 'Transcrire une vidéo',
          to: '/tools/transcribe-video',
          description: 'La transcription complète.',
        },
        {
          label: 'Transcrire un audio',
          to: '/tools/transcribe-audio',
          description: 'Pour les fichiers audio.',
        },
        {
          label: 'Supprimer le bruit de fond',
          to: '/tools/remove-background-noise',
          description: 'Nettoyez d\'abord l\'audio.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Compte pour une tâche IA ; les tâches échouées ne sont pas comptées.',
          'Durée jusqu\'à la limite de durée vidéo de votre offre.',
        ],
      },
    },
    'summarize-audio': {
      name: 'Résumer un audio',
      h1: 'Résumer un enregistrement audio avec l\'IA',
      tagline: 'Transformez un podcast, un entretien ou un mémo vocal en un résumé écrit avec chapitres et sujets, généré sur nos propres serveurs GPU.',
      metaTitle: 'Résumé audio par IA avec chapitres | Media Manipulator',
      metaDescription: 'Importez un fichier MP3, WAV ou M4A et obtenez un résumé écrit avec chapitres horodatés et sujets. Whisper et le modèle de langage s\'exécutent sur nos propres serveurs GPU. Compte gratuit requis.',
      ogTitle: 'Résumer un enregistrement audio avec l\'IA',
      ogDescription: 'Un résumé écrit avec chapitres et sujets pour tout enregistrement. Compte gratuit requis.',
      embed: {
        title: 'Résumer un fichier audio',
        description: 'Connectez-vous, importez un enregistrement et choisissez la langue du résumé. Vous obtenez un titre, un court résumé, des chapitres qui mènent au moment voulu de votre enregistrement, et les sujets.',
      },
      intro: 'Un épisode de podcast, un entretien ou un long mémo vocal se consulte plus facilement sous forme de page que d\'une heure d\'audio. Media Manipulator transcrit l\'enregistrement avec Whisper et fait rédiger un résumé par un modèle de langage à partir de la transcription, le tout sur un serveur GPU que nous exploitons. Vous obtenez un titre, quelques phrases, des chapitres avec heures de début et de fin, et les sujets. Cliquez sur un chapitre pour aller à ce passage de l\'enregistrement, copiez le résumé en Markdown ou téléchargez-le en Markdown ou en JSON. Les résumés nécessitent un compte gratuit.',
      whatItDoes: [
        'Rédige un titre et un court résumé de l\'enregistrement.',
        'Le découpe en chapitres horodatés ; un clic place le lecteur à cet endroit.',
        'Liste les sujets et décrit qui parle et sur quel ton.',
        'Rédige le résumé dans la langue de votre choix, ou dans la langue parlée.',
      ],
      flowSteps: [
        {
          title: 'Connexion',
          description: 'Un compte gratuit suffit.',
        },
        {
          title: 'Import',
          description: 'MP3, WAV, M4A et autres formats audio.',
        },
        {
          title: 'Résumé',
          description: 'Whisper et un modèle de langage sur notre serveur GPU.',
        },
        {
          title: 'Lecture',
          description: 'Cliquez sur les chapitres, copiez le Markdown, téléchargez le .md ou le .json.',
        },
      ],
      advancedDetails: [
        'La parole est transcrite avec Whisper ; un modèle de langage rédige le résumé à partir de la transcription.',
        'Un fichier audio avec pochette est traité comme de l\'audio : l\'image est ignorée.',
        'Un résumé compte pour une tâche IA de votre quota quotidien ; une tâche échouée ou refusée n\'est pas comptée.',
        'La transcription est générée automatiquement, donc les noms et les chiffres peuvent être erronés. Le résumé le signale dans ses notes.',
      ],
      whyItMatters: [
        'Vous lisez un résumé en une minute et décidez ensuite ce que vous allez écouter.',
        'Des chapitres horodatés font d\'un long enregistrement quelque chose dans lequel on peut naviguer.',
        'Les sujets rendent consultable tout un catalogue d\'épisodes.',
      ],
      useCases: [
        {
          title: 'Notes d\'épisode de podcast',
          description: 'Chapitres et sujets pour la page de l\'épisode.',
        },
        {
          title: 'Compte rendu d\'entretien',
          description: 'Ce qui a été abordé, avec les horaires pour citer.',
        },
        {
          title: 'Du mémo vocal aux notes',
          description: 'Un mémo décousu transformé en courte page.',
        },
        {
          title: 'Résumé d\'appel',
          description: 'Les points d\'un appel enregistré.',
        },
      ],
      whyMediaManipulator: [
        'Whisper et le modèle de langage s\'exécutent sur du matériel que nous exploitons ; votre enregistrement n\'est jamais envoyé à une IA tierce.',
        'Des chapitres qui naviguent dans votre propre enregistrement, directement dans la visionneuse de résultats.',
        'Téléchargements en Markdown et JSON. Les fichiers sont conservés 24 heures pour les invités ; avec un compte gratuit, vous choisissez de 24 heures à 2 ans.',
      ],
      privacyNote: 'Les résumés nécessitent un compte gratuit, la tâche y est donc rattachée. Votre fichier est traité sur nos propres serveurs, et les modèles d\'IA s\'exécutent sur un serveur GPU que nous exploitons ; rien n\'est envoyé à un fournisseur d\'IA tiers. Les fichiers sont conservés 24 heures pour les invités ; avec un compte gratuit, vous choisissez de 24 heures à 2 ans.',
      faq: [
        {
          question: 'Ai-je besoin d\'un compte ?',
          answer: 'Oui, un compte gratuit. Les résumés font appel à des modèles d\'IA sur notre serveur GPU ; ils sont donc réservés aux utilisateurs connectés.',
        },
        {
          question: 'En quoi est-ce différent d\'une transcription ?',
          answer: 'Une transcription vous donne chaque mot. Un résumé vous donne un titre, quelques phrases, des chapitres et des sujets, rédigés à partir de cette transcription.',
        },
        {
          question: 'Puis-je choisir la langue du résumé ?',
          answer: 'Oui. Choisissez l\'une des 18 langues du site, ou « identique à la parole ».',
        },
        {
          question: 'Mon enregistrement est-il envoyé à un tiers ?',
          answer: 'Non. Les modèles s\'exécutent sur un serveur GPU que nous exploitons.',
        },
        {
          question: 'Cela est-il décompté de mon quota ?',
          answer: 'Oui, pour une tâche IA. Les tâches échouées ne sont pas comptées.',
        },
      ],
      related: [
        {
          label: 'Transcrire un audio',
          to: '/tools/transcribe-audio',
          description: 'Chaque mot, en texte ou en sous-titres.',
        },
        {
          label: 'Résumer une vidéo',
          to: '/tools/summarize-video',
          description: 'Ajoute l\'image et le texte à l\'écran.',
        },
        {
          label: 'Supprimer le bruit de fond',
          to: '/tools/remove-background-noise',
          description: 'Nettoyez d\'abord l\'audio.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Compte pour une tâche IA ; les tâches échouées ne sont pas comptées.',
        ],
      },
    },
    // MM78 voices: name + tagline (model-written, needs native review).
    'voice-cloning': {
      name: 'Clonage vocal',
      tagline:
        'Enregistrez ou envoyez de 5 à 60 secondes de votre propre voix, créez une voix et faites-lui lire n\'importe quel texte dans plus de vingt langues.',
    },
    'voice-designer': {
      name: 'Concepteur de voix',
      tagline:
        'Décrivez une voix avec des mots, écoutez un aperçu et conservez celle qui vous plaît pour lire n\'importe quel texte dans plus de vingt langues.',
    },
    'voice-changer': {
      name: 'Changeur de voix',
      tagline:
        'Décalez instantanément la hauteur et le caractère d\'un enregistrement, ou convertissez la parole vers une voix enregistrée ou prédéfinie grâce à l\'IA.',
    },
    // MM84: name / tagline / metaTitle / metaDescription for the copy-bar tool pages (model-written, needs native review).
    'content-studio': {
      name: 'Darkroom',
      tagline: 'Montez, superposez et mixez vidéo et audio sur une timeline multipiste, puis exportez en MP4. Un éditeur de type Premiere Pro, directement dans votre navigateur.',
      metaTitle: 'Darkroom : éditeur vidéo multipiste gratuit en ligne | Media Manipulator',
      metaDescription: 'Montez, superposez et mixez vidéo et audio sur une timeline multipiste, puis exportez en MP4 : un éditeur vidéo gratuit de type Premiere Pro qui fonctionne directement dans votre navigateur. Sans inscription ni installation.',
    },
    'remove-exif-metadata': {
      name: 'Supprimer les métadonnées EXIF des images',
      tagline: 'Supprimez la localisation GPS et les données d’appareil, de caméra et d’horodatage de vos photos avant de les partager.',
      metaTitle: 'Supprimer les métadonnées EXIF d’images en ligne (gratuit) | Media Manipulator',
      metaDescription: 'Outil en ligne gratuit pour supprimer les métadonnées EXIF, GPS, IPTC et d’appareil photo des images JPG, PNG, WebP et HEIC. Sans inscription. Les fichiers sont conservés 24 heures pour les visiteurs ; avec un compte gratuit, vous choisissez entre 24 heures et 2 ans.',
    },
    'compress-image': {
      name: 'Compresser une image',
      tagline: 'Réduisez le poids des fichiers JPG, PNG et WebP pour des sites plus rapides, des envois plus légers et un partage plus simple.',
      metaTitle: 'Compresser une image en ligne gratuitement | Media Manipulator',
      metaDescription: 'Compresseur d’images en ligne gratuit. Réduisez le poids des fichiers JPG, PNG et WebP tout en gardant une bonne qualité. Sans inscription. Les fichiers sont conservés 24 heures pour les visiteurs ; avec un compte gratuit, vous choisissez entre 24 heures et 2 ans.',
    },
    'image-resizer': {
      name: 'Redimensionner une image',
      tagline: 'Redimensionnez des images JPG, PNG, WebP et GIF aux dimensions exactes en pixels tout en conservant les proportions.',
      metaTitle: 'Redimensionner une image en ligne gratuitement | Media Manipulator',
      metaDescription: 'Outil gratuit en ligne pour redimensionner des images. Redimensionnez des images JPG, PNG, WebP et GIF aux dimensions exactes en pixels en conservant les proportions. Sans inscription. Les fichiers sont conservés 24 heures pour les visiteurs ; avec un compte gratuit, vous choisissez entre 24 heures et 2 ans.',
    },
    'remove-background-from-image': {
      name: 'Supprimer l’arrière-plan d’une image',
      tagline: 'Effacez automatiquement l’arrière-plan de n’importe quelle photo et téléchargez un détourage PNG net et transparent.',
      metaTitle: 'Supprimer l’arrière-plan d’une image en ligne gratuitement | Media Manipulator',
      metaDescription: 'Suppression d’arrière-plan gratuite en ligne. Effacez automatiquement l’arrière-plan de n’importe quelle photo et téléchargez un PNG transparent. Fonctionne sur notre propre GPU, sans IA tierce. Les fichiers sont conservés 24 heures pour les visiteurs ; avec un compte gratuit, vous choisissez entre 24 heures et 2 ans.',
    },
    'image-to-pdf': {
      name: 'Image en PDF',
      tagline: 'Transformez des images JPG, PNG et autres en un document PDF propre et facile à partager, en un clic.',
      metaTitle: 'Convertir une image en PDF en ligne gratuitement | Media Manipulator',
      metaDescription: 'Convertisseur d’image en PDF gratuit en ligne. Transformez des images JPG, PNG et autres en un document PDF propre. Sans inscription ni filigrane. Les fichiers sont conservés 24 heures pour les visiteurs ; avec un compte gratuit, vous choisissez entre 24 heures et 2 ans.',
    },
    'pdf-to-jpg': {
      name: 'PDF en JPG',
      tagline: 'Convertissez chaque page d’un PDF en images JPG de haute qualité que vous pouvez partager, modifier ou publier.',
      metaTitle: 'Convertir un PDF en JPG en ligne gratuitement | Media Manipulator',
      metaDescription: 'Convertisseur de PDF en JPG gratuit en ligne. Convertissez chaque page d’un PDF en images JPG de haute qualité, téléchargées dans un ZIP. Sans inscription. Les fichiers sont conservés 24 heures pour les visiteurs ; avec un compte gratuit, vous choisissez entre 24 heures et 2 ans.',
    },
    'compress-video': {
      name: 'Compresser une vidéo',
      tagline: 'Réduisez le poids de vos fichiers MP4, WebM, MOV, MKV et AVI pour le web, l’e-mail, les réseaux sociaux et le cloud.',
      metaTitle: 'Compresser une vidéo en ligne (gratuit) | Media Manipulator',
      metaDescription: 'Compresseur vidéo gratuit en ligne. Réduisez le poids des fichiers MP4, WebM, MOV, MKV et AVI tout en gardant une bonne qualité. Sans inscription. Les fichiers sont conservés 24 heures pour les visiteurs ; avec un compte gratuit, vous choisissez entre 24 heures et 2 ans.',
    },
    'video-trimmer': {
      name: 'Découper une vidéo',
      tagline: 'Coupez un clip pour ne garder que la partie voulue, avec un découpage rapide qui préserve la qualité, sans réencodage lorsque c’est possible.',
      metaTitle: 'Découper une vidéo en ligne gratuitement | Media Manipulator',
      metaDescription: 'Outil gratuit en ligne pour découper une vidéo. Définissez un début et une fin et coupez votre clip avec un découpage rapide et sans perte. Sortie MP4, sans filigrane ni inscription. Les fichiers sont conservés 24 heures pour les visiteurs ; avec un compte gratuit, vous choisissez entre 24 heures et 2 ans.',
    },
    'extract-audio-from-video': {
      name: 'Extraire l’audio d’une vidéo',
      tagline: 'Enregistrez la piste audio de n’importe quelle vidéo en fichier MP3, WAV, M4A, AAC, FLAC ou OGG propre.',
      metaTitle: 'Extraire l’audio d’une vidéo : MP3, WAV, M4A et plus | Media Manipulator',
      metaDescription: 'Outil gratuit en ligne pour extraire l’audio de n’importe quel fichier vidéo (MP4, MOV, MKV, WebM, AVI). Sortie en MP3, WAV, M4A, AAC, FLAC ou OGG. Sans inscription. Les fichiers sont conservés 24 heures pour les visiteurs ; avec un compte gratuit, vous choisissez entre 24 heures et 2 ans.',
    },
    'convert-video-to-animated-gif': {
      name: 'Convertir une vidéo en GIF animé',
      tagline: 'Transformez en quelques secondes de courts clips MP4, WebM, MOV ou MKV en GIF animés faciles à partager.',
      metaTitle: 'Convertir une vidéo en GIF animé en ligne (gratuit) | Media Manipulator',
      metaDescription: 'Convertisseur de vidéo en GIF gratuit en ligne. Transformez de courts clips MP4, WebM, MOV et MKV en GIF animés, avec contrôle de la taille et de la fréquence d’images.',
    },
    'transcribe-video': {
      name: 'Transcrire une vidéo',
      tagline: 'Extrayez les paroles d’une vidéo ou d’un fichier audio sous forme de sous-titres WebVTT ou SRT, de texte brut ou de JSON horodaté.',
      metaTitle: 'Transcrire une vidéo en texte en ligne (gratuit) | Media Manipulator',
      metaDescription: 'Transcription vidéo gratuite en ligne. Convertissez des fichiers MP4, MOV, WebM, MKV et audio en texte consultable, en sous-titres VTT ou en transcriptions JSON.',
    },
    'transcode-to-hls': {
      name: 'Transcoder une vidéo en HLS',
      tagline: 'Empaquetez n’importe quelle vidéo en un lot Apple HLS VOD : master.m3u8 et segments .ts par rendition, prêts pour le web.',
      metaTitle: 'Transcoder une vidéo en HLS en ligne | Outil de streaming adaptatif gratuit',
      metaDescription: 'Transcodeur HLS gratuit en ligne. Convertissez MP4, MOV, WebM et MKV en un paquet HLS VOD avec des renditions 360p/480p/720p, sous-titres et storyboards en option.',
    },
    'ai-video-restoration': {
      name: 'Restauration vidéo par IA',
      tagline: 'Agrandissez et restaurez un court extrait vidéo avec jusqu’à six modèles d’IA (Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT et VRT) et comparez chaque résultat côte à côte.',
      metaTitle: 'Restauration vidéo par IA : comparez 6 modèles d’upscaling en ligne | Media Manipulator',
      metaDescription: 'Outil gratuit de restauration vidéo par IA. Passez un court clip dans les modèles de super-résolution Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT et VRT sur notre propre GPU et téléchargez tous les résultats dans un seul paquet.',
    },
    'ai-image-restoration': {
      name: 'Restauration et upscaling d’images par IA',
      tagline: 'Nettoyez, agrandissez et restaurez une photo avec jusqu’à huit modèles d’IA : pré-nettoyage fidèle (FBCNN, SCUNet, NAFNet), upscalers généralistes (Real-ESRGAN, SwinIR, HAT) et amélioration des visages (GFPGAN, CodeFormer), et comparez chaque résultat à l’original.',
      metaTitle: 'Restauration et upscaling d’images par IA : 8 modèles à comparer | Media Manipulator',
      metaDescription: 'Restauration et agrandissement de photos par IA, gratuits. Supprimez les artefacts JPEG, le bruit et le flou, agrandissez jusqu’en 4K/8K avec Real-ESRGAN, SwinIR ou HAT et améliorez les visages avec GFPGAN/CodeFormer, le tout sur notre propre GPU et comparé côte à côte.',
    },
    'ai-document-scan': {
      name: 'Numérisation de documents par IA',
      tagline: 'Transformez des documents numérisés et des notes manuscrites en un PDF multipage consultable et un document Word modifiable : les pages imprimées reçoivent une couche de texte Tesseract fidèle, l’écriture manuscrite est transcrite par une IA de vision, avec l’incertitude signalée et jamais inventée.',
      metaTitle: 'Numérisation de documents par IA : pages scannées et écriture manuscrite en PDF/Word | Media Manipulator',
      metaDescription: 'Numérisation de documents par IA, gratuite : convertissez des images scannées en PDF consultable et en Word par OCR, et transcrivez des notes manuscrites en texte. Réorganisez les pages, mélangez imprimé et manuscrit, le tout sur notre propre GPU, mot pour mot, avec l’incertitude signalée.',
    },
    'ai-image-upscaler': {
      name: 'Upscaler d’images par IA',
      tagline: 'Agrandissez une photo petite ou floue avec un modèle Real-ESRGAN qui reconstruit les détails fins au lieu de simplement étirer les pixels.',
      metaTitle: 'Upscaler d’images par IA : agrandissez vos photos en 2x ou 4x | Media Manipulator',
      metaDescription: 'Agrandissez une photo basse résolution en 2x ou 4x avec une IA qui restaure les contours et les textures. Fonctionne sur notre propre GPU, sortie en PNG. Les fichiers sont conservés 24 heures pour les visiteurs ; avec un compte gratuit, vous choisissez entre 24 heures et 2 ans.',
    },
    'blur-faces-in-photo': {
      name: 'Flouter les visages sur une photo',
      tagline: 'Détectez automatiquement les visages, puis floutez-les, pixelisez-les ou masquez-les en noir, tous ou seulement ceux que vous choisissez.',
      metaTitle: 'Flouter les visages d’une photo en ligne | Media Manipulator',
      metaDescription: 'Floutez, pixelisez ou masquez en noir les visages d’une photo. Détectez chaque visage, puis choisissez ceux à cacher. L’IA fonctionne sur notre propre GPU. Les fichiers sont conservés 24 heures pour les visiteurs ; avec un compte gratuit, vous choisissez entre 24 heures et 2 ans.',
    },
    'redact-text-in-image': {
      name: 'Masquer du texte dans une image',
      tagline: 'Repérez le texte lisible dans une capture d’écran ou une photo et couvrez les données personnelles, ou tout le texte, avec un flou ou un rectangle noir.',
      metaTitle: 'Masquer du texte dans une image en ligne | Media Manipulator',
      metaDescription: 'Repérez automatiquement le texte d’une image et masquez en noir ou floutez les noms, e-mails, numéros et autres données personnelles. IA sur notre propre GPU. Les fichiers sont conservés 24 heures pour les visiteurs ; avec un compte gratuit, vous choisissez entre 24 heures et 2 ans.',
    },
    'remove-object-from-photo': {
      name: 'Supprimer un objet d’une photo',
      tagline: 'Tracez un cadre autour de ce que vous ne voulez pas voir sur l’image : un modèle d’inpainting comble le vide avec un arrière-plan cohérent.',
      metaTitle: 'Supprimer un objet d’une photo en ligne | Media Manipulator',
      metaDescription: 'Effacez les objets indésirables d’une photo. Tracez un rectangle et l’inpainting par IA remplit l’espace pour l’accorder à l’arrière-plan. Fonctionne sur notre propre GPU. Les fichiers sont conservés 24 heures pour les visiteurs ; avec un compte gratuit, vous choisissez entre 24 heures et 2 ans.',
    },
    'clean-voice-audio': {
      name: 'Nettoyer l’audio d’une voix',
      tagline: 'Rendez la parole plus claire en réduisant le souffle, l’ambiance de la pièce et les grondements dans les podcasts, interviews et mémos vocaux.',
      metaTitle: 'Nettoyer un enregistrement vocal avec l’IA | Media Manipulator',
      metaDescription: 'Nettoyez un enregistrement vocal avec l’IA. Réduisez le souffle, le ronflement et le bruit de la pièce pour mieux entendre la voix. Fonctionne sur notre propre GPU. Les fichiers sont conservés 24 heures pour les visiteurs ; avec un compte gratuit, vous choisissez entre 24 heures et 2 ans.',
    },
    'remove-background-noise': {
      name: 'Supprimer le bruit de fond',
      tagline: 'Réduisez le souffle, le ronflement, la circulation et le bruit de la pièce dans un enregistrement grâce à un débruiteur IA, en gardant le son principal au premier plan.',
      metaTitle: 'Supprimer le bruit de fond d’un audio en ligne | Media Manipulator',
      metaDescription: 'Supprimez le bruit de fond d’un audio. Un débruiteur IA atténue le souffle, le ronflement et les sons ambiants des enregistrements. Fonctionne sur notre propre GPU. Les fichiers sont conservés 24 heures pour les visiteurs ; avec un compte gratuit, vous choisissez entre 24 heures et 2 ans.',
    },
    'remove-vocals-from-song': {
      name: 'Supprimer la voix d’une chanson',
      tagline: 'Retirez le chant d’un morceau et gardez la musique, pour le karaoké, l’entraînement et les pistes d’accompagnement. À utiliser uniquement sur de la musique dont vous détenez les droits.',
      metaTitle: 'Supprimer la voix d’une chanson : créateur de karaoké | Media Manipulator',
      metaDescription: 'Supprimez la voix d’une chanson avec l’IA et téléchargez l’instrumental dans le même format que votre fichier, ou en FLAC ou WAV. Pistes de karaoké et d’entraînement, sur notre propre GPU. Les fichiers sont conservés 24 heures pour les visiteurs ; avec un compte gratuit, vous choisissez entre 24 heures et 2 ans.',
    },

    // 2026-10-31 (MM92): name + tagline for every remaining tool, so the /tools catalog
    // and the home grid never show an English card in this locale. Model-written; native review pending.
    'transcode-to-dash': {
      name: 'Transcoder une vidéo en DASH (AV1 / VP9)',
      tagline: 'Empaquetez n’importe quelle vidéo en un lot MPEG-DASH : manifest.mpd et segments d’initialisation et de média par rendition.',
    },
    'convert-webp-to-jpg': {
      name: 'Convertir un WebP en JPG',
      tagline: 'Transformez vos images WebP en fichiers JPG largement compatibles, lisibles dans n’importe quel visualiseur ou éditeur d’images.',
    },
    'convert-png-to-jpg': {
      name: 'Convertir un PNG en JPG',
      tagline: 'Transformez en quelques secondes de lourdes captures d’écran et images PNG en photos JPG légères et compatibles partout.',
    },
    'convert-jpg-to-png': {
      name: 'Convertir un JPG en PNG',
      tagline: 'Transformez vos photos JPG en fichiers PNG sans perte, prêts pour la retouche, la transparence et les travaux graphiques de qualité.',
    },
    'convert-webp-to-png': {
      name: 'Convertir un WebP en PNG',
      tagline: 'Transformez vos images WebP en fichiers PNG sans perte, qui s’ouvrent partout et conservent toute la transparence.',
    },
    'convert-png-to-webp': {
      name: 'Convertir un PNG en WebP',
      tagline: 'Réduisez le poids de vos images PNG avec le format moderne WebP, plus rapide à charger sur le web, tout en conservant toute la transparence.',
    },
    'convert-jpg-to-webp': {
      name: 'Convertir un JPG en WebP',
      tagline: 'Réduisez le poids de vos photos JPG avec le format moderne WebP, plus rapide à charger sur le web, à qualité visuelle égale.',
    },
    'jpg-converter': {
      name: 'Convertisseur JPG',
      tagline: 'Convertissez des images en JPG : le convertisseur d’images avec JPG présélectionné.',
    },
    'png-converter': {
      name: 'Convertisseur PNG',
      tagline: 'Convertissez des images en PNG : le convertisseur d’images avec PNG présélectionné.',
    },
    'convert-jpg-to-pdf': {
      name: 'Convertir un JPG en PDF',
      tagline: 'Transformez vos photos et scans JPG en documents PDF propres, prêts à être partagés, imprimés ou envoyés.',
    },
    'convert-png-to-pdf': {
      name: 'Convertir un PNG en PDF',
      tagline: 'Transformez vos captures d’écran, images et scans PNG en documents PDF propres et nets.',
    },
    'pdf-to-png': {
      name: 'PDF en PNG',
      tagline: 'Convertissez chaque page d’un PDF en images PNG nettes et sans perte, idéales pour le texte, les schémas et la retouche.',
    },
    'pdf-converter': {
      name: 'Convertisseur PDF',
      tagline: 'Convertissez des PDF en images JPG ou PNG, et des images en PDF, le tout au même endroit.',
    },
    'convert-heic-to-jpg': {
      name: 'Convertir un HEIC en JPG',
      tagline: 'Transformez les photos HEIC de votre iPhone en fichiers JPG compatibles partout, que vous pouvez ouvrir et envoyer n’importe où.',
    },
    'convert-avif-to-jpg': {
      name: 'Convertir un AVIF en JPG',
      tagline: 'Transformez des images AVIF modernes en fichiers JPG compatibles partout, pour les applications et sites qui n’acceptent pas l’AVIF.',
    },
    'convert-avif-to-png': {
      name: 'Convertir un AVIF en PNG',
      tagline: 'Transformez vos images AVIF en fichiers PNG sans perte, qui s’ouvrent partout et conservent toute la transparence.',
    },
    'convert-svg-to-png': {
      name: 'Convertir un SVG en PNG',
      tagline: 'Convertissez vos icônes et logos SVG en images PNG de la taille de votre choix, pour vos envois, présentations et applications.',
    },
    'convert-png-to-svg': {
      name: 'Convertir un PNG en SVG',
      tagline: 'Vectorisez logos, icônes et dessins au trait PNG en véritables tracés SVG redimensionnables grâce à potrace.',
    },
    'png-to-ico': {
      name: 'PNG en ICO',
      tagline: 'Transformez un PNG en véritable favicon .ico multi-tailles, pour les sites web et les icônes d’applications Windows.',
    },
    'svg-converter': {
      name: 'Convertisseur SVG',
      tagline: 'Convertissez un SVG en PNG ou vectorisez un PNG en SVG : le convertisseur d’images avec SVG comme point de départ.',
    },
    'convert-wav-to-mp3': {
      name: 'Convertir un WAV en MP3',
      tagline: 'Réduisez le poids de vos gros enregistrements WAV sans perte en fichiers MP3 largement compatibles, pour les podcasts, le partage et le stockage.',
    },
    'isolate-vocals-from-song': {
      name: 'Isoler la voix d’une chanson',
      tagline: 'Extrayez la voix d’un morceau pour des remix, des reprises, de la transcription et de l’analyse. À utiliser uniquement sur de la musique dont vous détenez les droits.',
    },
    'image-converter': {
      name: 'Convertisseur d’images',
      tagline: 'Convertissez entre JPG, PNG, WebP, AVIF, GIF et bien d’autres, avec un contrôle de la qualité, du redimensionnement, du recadrage et des métadonnées.',
    },
    'video-converter': {
      name: 'Convertisseur vidéo',
      tagline: 'Convertissez entre MP4, WebM, MOV, AVI, MKV et bien d’autres, avec un contrôle complet des codecs, de la résolution et de l’audio.',
    },
    'mp4-converter': {
      name: 'Convertisseur MP4',
      tagline: 'Convertissez une vidéo en MP4 : le convertisseur vidéo avec MP4 présélectionné.',
    },
    'convert-mov-to-mp4': {
      name: 'Convertir un MOV en MP4',
      tagline: 'Transformez vos fichiers .mov QuickTime et iPhone en un MP4 universel, lisible et facile à envoyer partout.',
    },
    'convert-webm-to-mp4': {
      name: 'Convertir un WebM en MP4',
      tagline: 'Transformez une vidéo .webm optimisée pour le web en un MP4 que vous pouvez monter, partager et lire sur n’importe quel appareil.',
    },
    'convert-avi-to-mp4': {
      name: 'Convertir un AVI en MP4',
      tagline: 'Modernisez vos anciennes vidéos .avi en un MP4 compact, lisible sur tous les téléphones, navigateurs et téléviseurs.',
    },
    'convert-mkv-to-mp4': {
      name: 'Convertir un MKV en MP4',
      tagline: 'Transformez vos fichiers Matroska .mkv en un MP4 que l’on peut diffuser, envoyer et lire sur les appareils qui refusent le MKV.',
    },
    'convert-mp4-to-webm': {
      name: 'Convertir un MP4 en WebM',
      tagline: 'Réencodez un MP4 en un WebM VP9 ouvert et plus léger, parfait pour une vidéo web qui se charge vite.',
    },
    'mp4-to-mp3': {
      name: 'Convertir un MP4 en MP3',
      tagline: 'Récupérez l’audio d’un MP4 en MP3 : Extraire l’audio d’une vidéo avec MP4 en entrée et MP3 en sortie.',
    },
    'video-to-mp3': {
      name: 'Convertir une vidéo en MP3',
      tagline: 'Extrayez la bande-son d’une vidéo en MP3 : le même outil que Extraire l’audio d’une vidéo.',
    },
    'mp4-to-gif': {
      name: 'Convertir un MP4 en GIF',
      tagline: 'Créez un GIF en boucle à partir d’un clip MP4 : le convertisseur de GIF animé avec MP4 en entrée verrouillé.',
    },
    'video-to-gif': {
      name: 'Convertir une vidéo en GIF',
      tagline: 'Transformez un court clip, dans n’importe quel format vidéo courant, en GIF en boucle : le même outil que le convertisseur de GIF animé.',
    },
    'gif-converter': {
      name: 'Convertisseur GIF',
      tagline: 'Créez et peaufinez des GIF animés à partir de clips vidéo : le convertisseur de GIF animé sous un autre nom.',
    },
    'video-compressor': {
      name: 'Compresseur vidéo',
      tagline: 'Réduisez le poids d’une vidéo avec un préréglage de compression : le même outil que Compresser une vidéo.',
    },
    'compress-mp4': {
      name: 'Compresser un MP4',
      tagline: 'Allégez un MP4 en le gardant au format MP4 : Compresser une vidéo avec le conteneur verrouillé.',
    },
    'mp4-trimmer': {
      name: 'Découpeur MP4',
      tagline: 'Le découpeur vidéo avec MP4 verrouillé en entrée et en sortie.',
    },
    'video-cutter': {
      name: 'Coupeur de vidéo',
      tagline: 'Gardez une partie d’une vidéo et supprimez le reste : le même outil que le découpeur vidéo.',
    },
    'cut-video-online': {
      name: 'Couper une vidéo en ligne',
      tagline: 'Coupez un extrait d’une vidéo dans votre navigateur, sans rien installer : le découpeur vidéo sous un autre nom.',
    },
    'crop-video': {
      name: 'Recadrer une vidéo',
      tagline: 'Supprimez les bords d’une vidéo, pour changer le cadrage ou le format d’image sans logiciel de montage.',
    },
    'resize-video': {
      name: 'Redimensionner une vidéo',
      tagline: 'Modifiez la résolution d’une vidéo : passez en 1080p, 720p, 480p, ou à la largeur et la hauteur de votre choix.',
    },
    'rotate-video': {
      name: 'Faire pivoter une vidéo',
      tagline: 'Redressez une vidéo couchée ou à l’envers : faites-la pivoter de 90°, 180° ou 270° et retournez-la en un clic.',
    },
    'remove-audio-from-video': {
      name: 'Supprimer l’audio d’une vidéo',
      tagline: 'Rendez une vidéo muette pour de bon : supprimez la piste audio et téléchargez un fichier silencieux, contenant uniquement la vidéo.',
    },
    'audio-converter': {
      name: 'Convertisseur audio',
      tagline: 'Convertissez entre MP3, WAV, M4A, OGG, FLAC, OPUS et bien d’autres, avec un contrôle complet du débit, de la fréquence d’échantillonnage et des canaux.',
    },
    'srt-generator': {
      name: 'Générateur de sous-titres SRT',
      tagline: 'Importez un fichier vidéo ou audio et générez un fichier de sous-titres .srt à télécharger, prêt pour YouTube, les logiciels de montage et les outils d’accessibilité.',
    },
    'caption-translator': {
      name: 'Traducteur de sous-titres',
      tagline: 'Traduisez des fichiers de sous-titres SRT et VTT en préservant les minutages, l’ordre et la structure des sous-titres, sans fournisseur d’IA tiers.',
    },
    'audio-waveform-generator': {
      name: 'Générateur de forme d’onde audio',
      tagline: 'Transformez n’importe quel fichier audio en vidéo de forme d’onde configurable, en image de forme d’onde, ou les deux, parfait pour les podcasts, les aperçus musicaux et les clips pour les réseaux sociaux.',
    },
    'extract-video-only-from-video': {
      name: 'Extraire la vidéo sans l’audio',
      tagline: 'Exportez une copie silencieuse, contenant uniquement la vidéo, sans aucune piste audio, parfaite pour les aperçus muets, les plans de coupe, le montage et la remusicalisation.',
    },
    'extract-frames-from-video': {
      name: 'Extraire des images d’une vidéo',
      tagline: 'Extrayez des images fixes de n’importe quelle vidéo, toutes les N secondes, à une fréquence d’images cible ou à des instants précis, et téléchargez-les dans un ZIP.',
    },
    'stitch-audio-to-video': {
      name: 'Ajouter de l’audio à une vidéo',
      tagline: 'Combinez une vidéo de base avec jusqu’à trois fichiers audio supplémentaires (voix off, musique, narration) et téléchargez un nouveau MP4.',
    },
    'ai-frame-interpolation': {
      name: 'Interpolation d’images par IA',
      tagline: 'Portez la fréquence d’images d’une vidéo à 48, 60 ou 120 images/s grâce à des images intermédiaires générées par IA, pour des mouvements plus fluides.',
    },
  },
} as const;

export default frToolPages;
