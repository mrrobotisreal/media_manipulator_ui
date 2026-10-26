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
  },
} as const;

export default frToolPages;
