/**
 * Spanish partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope (2026-08-09): `name` + `tagline` for the review-allowlisted slugs —
 * the fields surfaced on the home page's "Popular conversions" grid and the
 * /tools index. Translating the full page bodies (h1, sections, FAQs) of all
 * ~65 tools is deliberately deferred; later sessions extend these same
 * per-slug entries incrementally.
 *
 * Register: informal "tú"; brand names, formats and codecs stay untranslated;
 * "Darkroom" stays "Darkroom"; es-ES spelling ("vídeo").
 */

const esToolPages = {
  pages: {
    // MM48: Motion's full page body (model-written, needs native review). The brand stays "Motion".
    motion: {
      tagline: 'Dibuja o importa un SVG, anímalo en una línea de tiempo de fotogramas clave y exporta SVG animado, Lottie, React, JavaScript, Flutter o GIF, todo en tu navegador.',
      intro: 'Motion es un editor de SVG con línea de tiempo de animación, integrado en Media Manipulator. Abre un archivo SVG (o una animación Lottie) y cada forma se convierte en una capa que puedes seleccionar, mover, cambiar de color y animar, o empieza con un lienzo en blanco y dibuja con las herramientas de rectángulo, elipse, línea, pluma y texto. Cada propiedad animada tiene su propia pista de fotogramas clave, con preajustes de suavizado, un editor de curvas para suavizados personalizados y fotogramas de retención para saltos instantáneos. Los animadores de un clic añaden dibujo progresivo del trazo, movimiento a lo largo de un trazado, morfosis de formas, cambios de color en degradados, animación de máscaras y desenfoque. Cuando se mueva como quieres, expórtalo como SVG animado, archivo Lottie, componente React, módulo JavaScript o TypeScript, widget de Flutter o GIF. La edición y todas las exportaciones se ejecutan en tu navegador, así que tu ilustración nunca se sube para exportarla.',
      whatItDoes: [
        'Importa archivos SVG a un árbol de capas editable (grupos, trazados, formas, texto, imágenes, degradados, máscaras y trazados de recorte) e importa animaciones Lottie JSON con sus fotogramas clave.',
        'Dibuja ilustraciones nuevas con las herramientas de rectángulo, elipse, línea, pluma (Bézier) y texto, y edita los nodos de los trazados directamente en el lienzo.',
        'Anima posición, escala, rotación, inclinación, opacidad, relleno, trazo y grosor del trazo en una línea de tiempo de fotogramas clave con suavizado lineal, de entrada suave, de salida suave, de entrada y salida suaves, cubic-bezier personalizado y de retención.',
        'Añade animación avanzada con un clic: dibujo progresivo del trazo, movimiento a lo largo de un trazado con giro automático opcional, morfosis de formas, colores de las paradas de degradado, animación de máscaras y trazados de recorte, y desenfoque.',
        'Exporta un SVG estático (siempre gratis), un SVG animado que se reproduce sin ninguna biblioteca, Lottie JSON, un componente React, un módulo JavaScript o TypeScript, un widget de Flutter y un GIF animado.',
      ],
      flowSteps: [
        {
          title: 'Abre o dibuja',
          description: 'Importa un archivo SVG o Lottie, o dibuja formas y trazados en un lienzo en blanco.',
        },
        {
          title: 'Anima',
          description: 'Mueve la cabeza de reproducción y cambia una propiedad: la línea de tiempo registra un fotograma clave.',
        },
        {
          title: 'Da forma al ritmo',
          description: 'Elige un preajuste de suavizado, dibuja una curva personalizada, añade retenciones o aplica un animador de un clic.',
        },
        {
          title: 'Exporta',
          description: 'Descarga SVG animado, Lottie, React, JS/TS, Flutter o GIF, creados en tu navegador.',
        },
      ],
      advancedDetails: [
        'La exportación a SVG animado usa fotogramas clave de CSS puro siempre que todos los efectos se puedan expresar en CSS en Chrome, Firefox y Safari. Las morfosis de formas, las paradas de degradado en movimiento y el desenfoque necesitan un pequeño script, así que esos archivos incluyen una copia reducida de anime.js (licencia MIT, unos 14 KB comprimidos) con su aviso de licencia al principio.',
        'La morfosis de formas normaliza ambas formas al mismo número de segmentos de curva y alinea sus puntos de inicio y su sentido de giro, para que la transformación no se retuerza. Dos formas que no se pueden emparejar se mantienen en lugar de transformarse.',
        'El escritor de Lottie sigue la especificación Lottie 1.0.1 y el conjunto de funciones «Basic» de LottieFiles. Todo lo que Lottie no puede transportar (como filtros, texto o máscaras avanzadas) se enumera tras la descarga; nada se descarta en silencio.',
        'La exportación a GIF usa un codificador escrito para Media Manipulator, con una única paleta global creada a partir de fotogramas de toda la animación, de modo que el arte vectorial plano conserva sus colores exactos.',
        'Los SVG importados se limpian al entrar: se eliminan los scripts, los controladores de eventos, las referencias externas y otro contenido no seguro, y el editor reconstruye el marcado no compatible a partir de una lista de permitidos en lugar de insertarlo como HTML.',
      ],
      whyItMatters: [
        'Los SVG animados se ven nítidos en cualquier tamaño y suelen pesar mucho menos que un vídeo o un GIF de la misma animación, lo que los hace ideales para logotipos, iconos, indicadores de carga e ilustraciones en la web.',
        'Los desarrolladores necesitan la animación como código, no solo como vídeo: un componente React, un módulo JavaScript, un archivo Lottie o un widget de Flutter se integra directamente en una aplicación.',
        'Hacer la exportación en el navegador significa que tu ilustración se queda en tu dispositivo; solo se nos envía el recuento de cada exportación, para aplicar el cupo diario.',
      ],
      useCases: [
        {
          title: 'Animación de logotipos e iconos',
          description: 'Dibuja un logotipo con una animación de trazo, o haz que un icono rebote, gire o cambie de color al pasar el cursor.',
        },
        {
          title: 'Indicadores de carga y microanimaciones de interfaz',
          description: 'Crea spinners y animaciones de progreso y expórtalos como SVG solo con CSS o como componente React.',
        },
        {
          title: 'Lottie para aplicaciones móviles',
          description: 'Exporta Lottie JSON para los reproductores Lottie de iOS, Android, web y Flutter, o edita un archivo Lottie existente.',
        },
        {
          title: 'Ilustraciones animadas',
          description: 'Mueve partes de una ilustración a lo largo de trazados, transforma formas unas en otras y exporta un GIF para chat o correo.',
        },
      ],
      whyMediaManipulator: [
        'Un auténtico editor de capas y fotogramas clave con retenciones, curvas personalizadas y animadores avanzados, no una galería de plantillas.',
        'Exportaciones para diseñadores y desarrolladores por igual: SVG animado, Lottie, React, JavaScript o TypeScript, Flutter y GIF desde un mismo proyecto.',
        'Las exportaciones se hacen en tu navegador, y el único código de terceros que usa una exportación tiene licencia permisiva (anime.js bajo MIT; flutter_svg y webview_flutter para Flutter), con su aviso de licencia conservado en el archivo.',
      ],
      privacyNote: 'La edición y la exportación se hacen en tu navegador; tu ilustración no se sube para exportarla. Sin cuenta, los proyectos se conservan solo en este navegador. Si inicias sesión y guardas un proyecto en tu cuenta, se almacena en nuestros servidores como un proyecto de Darkroom, sigue el periodo de conservación que elijas y puede eliminarse desde tu página Cuenta. De cada exportación registramos únicamente su formato, tamaño, duración y hora, para aplicar el cupo diario.',
      faq: [
        {
          question: '¿Motion es gratis?',
          answer: 'Sí. Abrir Motion, dibujar, animar, guardar y exportar un SVG estático es gratis e ilimitado, sin cuenta. Las exportaciones animadas cuentan para un cupo diario que depende de tu plan; la tabla de planes de esta página muestra el cupo y los formatos de cada plan.',
        },
        {
          question: '¿Qué formatos puedo exportar?',
          answer: 'SVG estático, SVG animado (CSS, o un pequeño script integrado cuando hace falta), Lottie JSON, un componente React (.tsx), un módulo JavaScript o TypeScript, un widget de Flutter (.dart) y un GIF animado. Cuáles incluye tu plan y el número diario de exportaciones aparecen en la tabla de planes de esta página.',
        },
        {
          question: '¿Cuáles son los límites?',
          answer: 'Las exportaciones animadas se cuentan por día y se restablecen a medianoche UTC. Los visitantes sin cuenta solo pueden guardar proyectos en su navegador; los planes con sesión iniciada guardan un número de proyectos en la cuenta. Los visitantes también tienen una duración máxima de animación para exportar, y la exportación a GIF tiene un límite de tamaño y duración. Todas las cifras actuales están en la tabla de planes de esta página y en la página de precios.',
        },
        {
          question: '¿Puedo animar un SVG que ya tengo?',
          answer: 'Sí. Importa cualquier SVG y sus grupos, trazados, formas, texto, degradados, máscaras y trazados de recorte se convierten en capas editables. Las partes que el editor no puede editar, como patrones o filtros complejos, se conservan y se exportan sin cambios, y todo lo que no sea seguro (scripts o enlaces externos) se elimina y se enumera tras la importación.',
        },
        {
          question: '¿Es compatible con Lottie?',
          answer: 'Sí, en ambos sentidos. Puedes importar un archivo Lottie JSON para editarlo y exportar tu animación como Lottie JSON para lottie-web y los reproductores Lottie de iOS, Android y Flutter. Las funciones que un lado no puede representar se enumeran en el diálogo en lugar de descartarse en silencio.',
        },
        {
          question: '¿Qué navegadores admiten la exportación de vídeo?',
          answer: 'La exportación a GIF funciona en todos los navegadores modernos. La exportación a MP4 y WebM depende de WebCodecs, el codificador de vídeo integrado del navegador, disponible en Chrome y Edge y en versiones recientes de Safari y Firefox según el códec; el diálogo de exportación comprueba tu navegador y avisa cuando no puede codificar. La tabla de planes de esta página muestra qué plan incluye cada formato de vídeo.',
        },
        {
          question: '¿Qué licencia se aplica al código exportado?',
          answer: 'Tu animación es tuya. Cuando un SVG animado o una exportación de código necesita un entorno de ejecución, usa anime.js, con licencia MIT; su aviso de copyright se escribe al principio del archivo y debe conservarse ahí. Las exportaciones a Flutter usan el paquete flutter_svg (MIT) o webview_flutter (BSD-3-Clause). Todo lo demás del archivo se genera a partir de tu proyecto. Las bibliotecas de código abierto que usa el editor figuran en nuestra página de licencias.',
        },
        {
          question: '¿Dónde se almacenan mis proyectos?',
          answer: 'Sin cuenta, los proyectos se conservan solo en este navegador, así que borrar los datos del navegador los elimina. Si has iniciado sesión, puedes guardar un proyecto en tu cuenta; entonces se sincroniza entre dispositivos, se guarda automáticamente mientras trabajas, sigue el periodo de conservación que elegiste y puede eliminarse desde tu página Cuenta.',
        },
      ],
      supportedFormats: {
        supportedInputFormats: [
          'SVG',
          'Lottie JSON',
          'Proyecto de Motion (.json)',
        ],
        supportedOutputFormats: [
          'SVG estático',
          'SVG animado',
          'Lottie JSON',
          'React (.tsx)',
          'JavaScript / TypeScript',
          'Flutter (.dart)',
          'GIF',
        ],
        maxFileNotes: [
          'Importaciones de SVG y Lottie de hasta 4 MB cada una.',
          'Los proyectos sin cuenta viven solo en este navegador; los proyectos con sesión iniciada siguen el periodo de conservación que elijas.',
        ],
        processingNotes: [
          'La edición, la vista previa y todas las exportaciones se ejecutan en tu navegador. A nuestros servidores solo se envía el recuento de cada exportación.',
        ],
      },
      embed: {
        title: 'Abrir Motion',
        description: 'Empieza un dibujo nuevo o reabre uno reciente. El editor se abre a pantalla completa; tu trabajo se conserva en este navegador y, si has iniciado sesión, puedes guardarlo en tu cuenta.',
      },
      related: [
        {
          label: 'Tutorial de Motion',
          to: '/tutorials/motion',
          description: 'Importa un SVG, anímalo, ajusta el suavizado y expórtalo, paso a paso.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Edita vídeo en una línea de tiempo multipista y exporta MP4.',
        },
        {
          label: 'Convertir vídeo en GIF animado',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Convierte un clip de vídeo en un GIF cuando tu animación empezó como metraje.',
        },
        {
          label: 'Licencias de código abierto',
          to: '/licenses',
          description: 'Las bibliotecas que ejecuta el editor y que se escriben en tus exportaciones.',
        },
      ],
      metaTitle: 'Motion: editor de animación SVG gratis en línea | Media Manipulator',
      metaDescription: 'Anima SVG en tu navegador: fotogramas clave, suavizado, retenciones, trayectorias y morfosis. Exporta SVG animado, Lottie JSON, React, JS, Flutter o GIF.',
      ogTitle: 'Motion: editor de animación SVG gratis en línea',
      ogDescription: 'Anima SVG en tu navegador: fotogramas clave, suavizado, retenciones, trayectorias y morfosis. Exporta SVG animado, Lottie JSON, React, JS, Flutter o GIF.',
    },
    'content-studio': {
      name: 'Darkroom',
      tagline:
        'Edita, superpón y mezcla vídeo y audio en una línea de tiempo multipista, y exporta en MP4. Un editor al estilo de Premiere Pro, directamente en tu navegador.',
    },
    'remove-exif-metadata': {
      name: 'Eliminar metadatos EXIF de imágenes',
      tagline:
        'Elimina la ubicación GPS y los datos de dispositivo, cámara y fecha de tus fotos antes de compartirlas.',
    },
    'compress-image': {
      name: 'Comprimir imagen',
      tagline:
        'Reduce el tamaño de tus archivos JPG, PNG y WebP para webs más rápidas, subidas más ligeras y un compartir más fácil.',
    },
    'image-resizer': {
      name: 'Redimensionar imagen',
      tagline:
        'Cambia el tamaño de imágenes JPG, PNG, WebP y GIF a dimensiones exactas en píxeles manteniendo la relación de aspecto.',
    },
    'remove-background-from-image': {
      name: 'Eliminar el fondo de una imagen',
      tagline:
        'Borra automáticamente el fondo de cualquier foto y descarga un recorte PNG limpio y transparente.',
    },
    'image-to-pdf': {
      name: 'Imagen a PDF',
      tagline:
        'Convierte JPG, PNG y otras imágenes en un documento PDF limpio y listo para compartir con un solo clic.',
    },
    'pdf-to-jpg': {
      name: 'PDF a JPG',
      tagline:
        'Convierte cada página de un PDF en imágenes JPG de alta calidad para compartir, editar o publicar.',
    },
    'compress-video': {
      name: 'Comprimir vídeo',
      tagline:
        'Reduce archivos MP4, WebM, MOV, MKV y AVI para la web, el correo, las redes sociales y la nube.',
    },
    'video-trimmer': {
      name: 'Recortar vídeo',
      tagline:
        'Corta el fragmento que quieras con un recorte rápido que conserva la calidad — sin recodificar cuando es posible.',
    },
    'extract-audio-from-video': {
      name: 'Extraer audio de un vídeo',
      tagline:
        'Guarda la pista de audio de cualquier vídeo como un archivo MP3, WAV, M4A, AAC, FLAC u OGG limpio.',
    },
    'convert-video-to-animated-gif': {
      name: 'Convertir vídeo en GIF animado',
      tagline:
        'Convierte clips cortos MP4, WebM, MOV o MKV en GIF animados listos para compartir en cuestión de segundos.',
    },
    'transcribe-video': {
      name: 'Transcribir vídeo',
      tagline:
        'Extrae las palabras habladas de tus vídeos como texto con búsqueda, subtítulos o JSON estructurado.',
    },
    'transcode-to-hls': {
      name: 'Transcodificar vídeo a HLS',
      tagline:
        'Empaqueta cualquier vídeo como un paquete HLS VOD de Apple: master.m3u8 y segmentos .ts por calidad, listo para la web.',
    },
    'ai-video-restoration': {
      name: 'Restauración de vídeo con IA',
      tagline:
        'Escala y restaura un fragmento corto de vídeo con hasta seis modelos de IA — Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT y VRT — y compara todos los resultados lado a lado.',
    },
    'ai-image-restoration': {
      name: 'Restauración y escalado de imágenes con IA',
      tagline:
        'Limpia, escala y restaura una foto con hasta ocho modelos de IA — limpieza previa fiel (FBCNN, SCUNet, NAFNet), escaladores generales (Real-ESRGAN, SwinIR, HAT) y mejora de rostros (GFPGAN, CodeFormer) — y compara cada resultado con el original.',
    },
    'ai-document-scan': {
      name: 'Escaneo de documentos con IA',
      tagline:
        'Convierte documentos escaneados y notas manuscritas en un PDF de varias páginas con búsqueda y un documento de Word editable — las páginas impresas reciben una capa de texto fiel de Tesseract y la escritura a mano la transcribe una IA visual que marca sus dudas, sin inventar nada.',
    },
    'ai-image-upscaler': {
      name: 'Escalador de imágenes con IA',
      h1: 'Escalador de imágenes con IA: amplía fotos 2x o 4x en línea',
      tagline: 'Amplía fotos pequeñas o borrosas con un modelo Real-ESRGAN que reconstruye el detalle en lugar de estirar píxeles.',
      metaTitle: 'Escalador de imágenes con IA: amplía fotos 2x o 4x | Media Manipulator',
      metaDescription: 'Amplía una foto de baja resolución 2x o 4x con IA que recupera bordes y texturas. Se ejecuta en nuestra propia GPU y entrega PNG.',
      ogTitle: 'Escalador de imágenes con IA: amplía fotos 2x o 4x',
      ogDescription: 'Amplía fotos pequeñas o borrosas con un modelo de IA Real-ESRGAN que reconstruye el detalle.',
      intro: 'Redimensionar de forma normal solo interpola entre los píxeles que ya existen, por eso una copia más grande de una foto pequeña se ve borrosa. Esta página usa un modelo de superresolución con IA (Real-ESRGAN) que ha aprendido cómo suelen verse bordes, piel, tela y hojas, y dibuja detalle plausible. Eliges 2x o 4x y recibes un PNG sin pérdida.',
      flowSteps: [
        { title: 'Sube una foto pequeña', description: 'Un JPG, PNG o WebP que quieras hacer más grande.' },
        { title: 'Elige 2x o 4x', description: 'La operación ya es Escalado con IA; solo elige escala y modelo.' },
        { title: 'La IA reconstruye el detalle', description: 'El modelo amplía la imagen y genera bordes y texturas más nítidos.' },
        { title: 'Descarga el PNG', description: 'Guarda el resultado ampliado y sin pérdida.' },
      ],
      faq: [
        { question: '¿En qué se diferencia el escalado con IA de redimensionar?', answer: 'Redimensionar interpola píxeles existentes y se ve borroso. El modelo de IA predice bordes y texturas plausibles. Sigue siendo una estimación, no datos originales recuperados.' },
        { question: '¿Elijo 2x o 4x?', answer: '2x si el original ya es aceptable. 4x para imágenes muy pequeñas, con un archivo mucho mayor y algo más de detalle inventado.' },
        { question: '¿Enfocará una foto borrosa?', answer: 'Ayuda con la suavidad por baja resolución. No arregla el desenfoque de movimiento fuerte ni el enfoque fallido. Compara siempre con el original.' },
        { question: '¿Hay límites en el uso gratuito?', answer: 'Las operaciones de IA pueden limitarse por tamaño o cuota diaria según tu plan. El formulario muestra los límites que te aplican al subir el archivo.' },
      ],
      embed: { title: 'Escalar una imagen con IA', description: 'Sube una foto. Escalado con IA ya está seleccionado y bloqueado, con salida PNG. Elige 2x o 4x y un modelo, y convierte.' },
    },
    'blur-faces-in-photo': {
      name: 'Difuminar caras en una foto',
      h1: 'Difuminar caras en una foto en línea',
      tagline: 'Detecta caras automáticamente y desenfoca, pixela o tapa con negro todas o solo las que elijas.',
      metaTitle: 'Difuminar caras en una foto en línea | Media Manipulator',
      metaDescription: 'Desenfoca, pixela o tapa caras en una foto. Detecta todas las caras y elige cuáles ocultar. IA en nuestra propia GPU.',
      ogTitle: 'Difuminar caras en una foto en línea',
      ogDescription: 'Encuentra caras automáticamente y desenfoca, pixela o tapa todas o solo las que elijas.',
      intro: 'Publicar una foto de una multitud, un aula o una calle suele significar proteger a personas que no dieron su permiso. Esta página encuentra caras con un detector de IA y las oculta con desenfoque, mosaico de píxeles o un recuadro negro. Puedes ocultar todas con un clic o detectar primero y marcar solo las que deban taparse.',
      flowSteps: [
        { title: 'Sube una foto', description: 'Elige una imagen con las caras que quieres proteger.' },
        { title: 'Elige un estilo', description: 'Desenfoque, pixelado o recuadro negro. El desenfoque de caras ya está seleccionado.' },
        { title: 'Detecta y selecciona (opcional)', description: 'Ejecuta la detección y toca las caras a tapar, o deja todas las caras.' },
        { title: 'Descarga el resultado', description: 'Guarda la imagen anonimizada y revisa cada cara antes de publicar.' },
      ],
      faq: [
        { question: '¿Encuentra todas las caras?', answer: 'Ningún detector es perfecto. Las caras muy pequeñas, de perfil, tapadas o con poca luz pueden pasar desapercibidas. Revisa el resultado a tamaño completo.' },
        { question: '¿Puedo difuminar solo algunas caras?', answer: 'Sí. Ejecuta primero la detección y selecciona las caras a cubrir. Si omites ese paso, se ocultan todas las caras detectadas.' },
        { question: '¿Qué es más seguro: desenfoque, pixelado o recuadro negro?', answer: 'El recuadro negro, porque elimina los píxeles por completo. Un desenfoque leve en una cara grande y nítida a veces puede reconstruirse en parte.' },
        { question: '¿Mi foto se envía a una empresa de IA externa?', answer: 'No. La detección y el desenfoque se ejecutan en un servidor GPU que operamos nosotros. Los archivos no se comparten con proveedores de IA de terceros.' },
      ],
      embed: { title: 'Difuminar caras en una foto', description: 'Sube una foto. Desenfoque/pixelado de caras ya está seleccionado y bloqueado. Elige el estilo, detecta caras si quieres y selecciona cuáles ocultar.' },
    },
    'redact-text-in-image': {
      name: 'Ocultar texto en una imagen',
      h1: 'Ocultar texto y datos personales en una imagen',
      tagline: 'Encuentra texto legible en capturas y fotos y tapa los datos personales, o todo el texto, con desenfoque o recuadro negro.',
      metaTitle: 'Ocultar texto en una imagen en línea | Media Manipulator',
      metaDescription: 'Encuentra texto en una imagen automáticamente y tapa nombres, correos, números y otros datos personales. IA en nuestra propia GPU.',
      ogTitle: 'Ocultar texto y datos personales en una imagen',
      ogDescription: 'Encuentra texto en capturas y fotos y cubre datos personales o todo el texto.',
      intro: 'Las capturas de pantalla suelen filtrar cosas que sus dueños olvidaron: un correo en una esquina, un número de cuenta en una tabla, un nombre en un chat. Esta página lee el texto de la imagen con OCR y lo cubre. Puedes limitarlo a datos personales como correos, teléfonos e identificadores, o cubrir todo el texto con desenfoque o recuadro negro opaco.',
      flowSteps: [
        { title: 'Sube la imagen', description: 'Una captura, un formulario escaneado o una foto con texto legible.' },
        { title: 'Elige qué ocultar', description: 'Ocultar texto ya está seleccionado; elige solo datos personales o todo el texto.' },
        { title: 'Recuadro negro o desenfoque', description: 'El recuadro negro es la opción más segura e irreversible.' },
        { title: 'Revisa y descarga', description: 'Lee el resultado con atención y luego guárdalo.' },
      ],
      faq: [
        { question: '¿Detecta toda la información personal?', answer: 'No. Encuentra texto con OCR y reconoce patrones como correos y números. La letra manuscrita, las fuentes raras, el texto diminuto y lo que no es texto (como una cara) pueden quedar sin cubrir. Revisa el resultado.' },
        { question: '¿Qué diferencia hay entre datos personales y todo el texto?', answer: 'El modo de datos personales solo cubre texto que parece privado. El modo de todo el texto cubre cada palabra legible, más seguro cuando no sabes qué hay en la página.' },
        { question: '¿Desenfoque o recuadro negro?', answer: 'Recuadro negro para lo que vayas a publicar. El texto desenfocado a veces puede reconstruirse enfocando la imagen.' },
        { question: '¿También elimina metadatos ocultos?', answer: 'No, solo edita píxeles visibles. Elimina ubicación y datos de cámara con la herramienta de metadatos EXIF.' },
      ],
      embed: { title: 'Ocultar texto en una imagen', description: 'Sube una captura o una foto. Ocultar texto/datos personales ya está seleccionado y bloqueado. Elige datos personales o todo el texto, el estilo, y convierte.' },
    },
    'remove-object-from-photo': {
      name: 'Quitar un objeto de una foto',
      h1: 'Quitar un objeto de una foto en línea',
      tagline: 'Dibuja un recuadro sobre lo que no quieres y un modelo de inpainting rellena el hueco con un fondo coherente.',
      metaTitle: 'Quitar un objeto de una foto en línea | Media Manipulator',
      metaDescription: 'Borra objetos no deseados de una foto. Dibuja un rectángulo y el inpainting con IA rellena el espacio para que coincida con el fondo. En nuestra propia GPU.',
      ogTitle: 'Quitar un objeto de una foto en línea',
      ogDescription: 'Dibuja un recuadro sobre un objeto no deseado y el inpainting con IA rellena el espacio con un fondo coherente.',
      intro: 'Un cable suelto, alguien que se coló en la foto, un cubo de basura al borde de un paisaje: pequeñas distracciones pueden estropear una buena toma. Sube la foto, arrastra un rectángulo sobre lo que sobra y el modelo de inpainting LaMa vuelve a pintar esa zona usando la escena circundante. Funciona mejor con fondos simples y repetitivos como cielo, césped, paredes y agua.',
      flowSteps: [
        { title: 'Sube una foto', description: 'Elige la imagen con el objeto no deseado.' },
        { title: 'Dibuja rectángulos', description: 'Arrastra un recuadro sobre el objeto. Añade más para más objetos.' },
        { title: 'La IA rellena el hueco', description: 'El modelo pinta píxeles nuevos que se integran con lo que rodea el recuadro.' },
        { title: 'Descarga e inspecciona', description: 'Amplía la zona reparada para comprobar las uniones.' },
      ],
      faq: [
        { question: '¿Cómo funciona la eliminación de objetos?', answer: 'Marcas una zona con un rectángulo. Un modelo de inpainting genera píxeles nuevos que coinciden con la textura, los colores y las líneas cercanos.' },
        { question: '¿Qué objetos se quitan mejor?', answer: 'Objetos pequeños o medianos sobre fondos simples o repetitivos como cielo, césped, arena, agua, paredes y suelos. Las escenas complejas y los objetos grandes cuestan más.' },
        { question: '¿Por qué la zona reparada se ve borrosa?', answer: 'El modelo tiene que inventar detalle. Prueba un recuadro más ajustado, quita el objeto en varios pasos pequeños o elige una foto con un fondo más simple.' },
        { question: '¿Tengo que dibujar un contorno exacto?', answer: 'No. Bastan los rectángulos, y dibujarlos un poco más grandes que el objeto suele dar un resultado más limpio.' },
      ],
      embed: { title: 'Quitar un objeto de una foto', description: 'Sube una foto. Quitar objeto ya está seleccionado y bloqueado. Dibuja uno o más rectángulos sobre lo que quieres eliminar y convierte.' },
    },
    'clean-voice-audio': {
      name: 'Limpiar la voz en un audio',
      h1: 'Limpia grabaciones de voz con IA',
      tagline: 'Haz el habla más clara reduciendo siseo, ruido de sala y zumbidos en pódcasts, entrevistas y notas de voz.',
      metaTitle: 'Limpia grabaciones de voz con IA | Media Manipulator',
      metaDescription: 'Limpia una grabación de voz con IA. Reduce siseo, zumbido y ruido de sala para entender mejor el habla. Se ejecuta en nuestra propia GPU.',
      ogTitle: 'Limpia grabaciones de voz con IA',
      ogDescription: 'Reduce siseo, zumbido y ruido de sala para un habla más clara en pódcasts, entrevistas y notas de voz.',
      intro: 'Una nota de voz en una cocina con eco, un invitado de pódcast con el micrófono del portátil, una clase grabada desde el fondo: las palabras están ahí, pero enterradas bajo siseo y sonido de sala. Limpiar voz procesa la grabación con una mejora de habla por IA que acerca al hablante y atenúa lo que no es voz. Está pensada para hablar, no para música.',
      flowSteps: [
        { title: 'Sube una grabación', description: 'Notas de voz, entrevistas, tomas de pódcast o clases grabadas.' },
        { title: 'Limpiar voz ya está elegido', description: 'Sin menú: la página ya está configurada con la operación de limpieza de voz.' },
        { title: 'La IA mejora el habla', description: 'El modelo separa la voz de los sonidos molestos y la reequilibra.' },
        { title: 'Descarga el audio limpio', description: 'Escúchalo con auriculares antes de usarlo.' },
      ],
      faq: [
        { question: '¿Elimina todo el ruido de fondo?', answer: 'Reduce mucho los sonidos constantes como siseo, zumbido y ruido de sala. Los ruidos repentinos, otras voces y la música son más difíciles; el resultado depende de la grabación.' },
        { question: '¿Puede hacer que un mal micrófono suene profesional?', answer: 'Puede aclarar el habla, pero no añade calidad que nunca se grabó. La distorsión o la saturación fuerte no se arreglan del todo.' },
        { question: '¿En qué se diferencia de quitar el ruido de fondo?', answer: 'Limpiar voz mejora el habla en sí; la otra herramienta se centra en bajar el ruido a su alrededor. Si una no va bien con tu grabación, prueba la otra.' },
        { question: '¿Funciona con música?', answer: 'Está afinada para voz y puede dañar la música. Para trabajar con canto, usa las herramientas de aislar o quitar voces.' },
      ],
      embed: { title: 'Limpiar una grabación de voz', description: 'Sube una grabación. Limpiar voz ya se aplica, así que no hay menú de operación. Elige otro formato de salida si lo necesitas y convierte.' },
    },
    'remove-background-noise': {
      name: 'Quitar el ruido de fondo',
      h1: 'Quitar el ruido de fondo de un audio en línea',
      tagline: 'Reduce siseo, zumbido, tráfico y ruido de sala con un eliminador de ruido por IA, manteniendo al frente el sonido principal.',
      metaTitle: 'Quitar el ruido de fondo de un audio en línea | Media Manipulator',
      metaDescription: 'Quita el ruido de fondo del audio. Un reductor de ruido con IA baja el siseo, el zumbido y el sonido ambiente. Se ejecuta en nuestra propia GPU.',
      ogTitle: 'Quitar el ruido de fondo de un audio en línea',
      ogDescription: 'Un reductor de ruido con IA que baja siseo, zumbido, tráfico y ruido de sala en grabaciones.',
      intro: 'Aires acondicionados, ventiladores, tráfico y zumbido eléctrico son sonidos constantes que quedan bajo lo que querías grabar. Esta página aplica un modelo de reducción de ruido con IA que baja esa capa de ruido para que el audio principal se oiga mejor. Sirve para entrevistas, locuciones, grabaciones de campo y la pista de audio extraída de un vídeo.',
      flowSteps: [
        { title: 'Sube el audio', description: 'Cualquier archivo de audio común, incluido el audio extraído de un vídeo.' },
        { title: 'Reducir ruido ya está elegido', description: 'La operación de IA ya es Quitar ruido de fondo.' },
        { title: 'La IA baja el ruido', description: 'El modelo separa el ruido constante del sonido en primer plano.' },
        { title: 'Descarga y compara', description: 'Escucha el resultado junto al original antes de usarlo.' },
      ],
      faq: [
        { question: '¿Qué tipos de ruido trata mejor?', answer: 'Los sonidos constantes: siseo, zumbido, ventiladores, aire acondicionado, ruido de sala y tráfico continuo. Los golpes repentinos, las conversaciones superpuestas y la música son mucho más difíciles.' },
        { question: '¿Sonará distinta mi voz después?', answer: 'Posiblemente un poco. Una reducción fuerte puede hacer que las voces suenen más finas o ligeramente procesadas, por eso conviene comparar con el original.' },
        { question: '¿Puedo usarlo con un vídeo?', answer: 'Extrae primero el audio del vídeo, límpialo aquí y vuelve a unirlo con la herramienta de unir audio a vídeo.' },
        { question: '¿Qué formato de salida elijo?', answer: 'WAV conserva toda la calidad para seguir editando. MP3 pesa menos para compartir. Si vas a editar más, elige WAV ahora y comprime al final.' },
      ],
      embed: { title: 'Quitar el ruido de fondo', description: 'Sube una grabación. Quitar ruido de fondo ya está seleccionado. Puedes cambiar el formato de salida y luego convertir.' },
    },
    'remove-vocals-from-song': {
      name: 'Quitar la voz de una canción',
      h1: 'Quitar la voz de una canción para un instrumental o karaoke',
      tagline: 'Quita el canto de una pista y conserva la música, para karaoke, práctica y bases. Úsalo solo con música sobre la que tengas derechos.',
      metaTitle: 'Quitar la voz de una canción: creador de karaoke | Media Manipulator',
      metaDescription: 'Quita la voz de una canción con IA y descarga el instrumental en WAV. Karaoke y pistas de práctica en nuestra propia GPU.',
      ogTitle: 'Quitar la voz de una canción para karaoke',
      ogDescription: 'Quita el canto de una canción con IA y descarga el instrumental en WAV sin pérdida.',
      intro: 'Las noches de karaoke, la práctica de canto y las versiones propias necesitan lo mismo: la banda sin el cantante. Un modelo de separación de fuentes con IA divide la mezcla final en voz y acompañamiento, y esta página te entrega el acompañamiento. El instrumental llega como WAV sin pérdida para que lo edites o lo conviertas tú mismo a MP3.',
      flowSteps: [
        { title: 'Sube una canción', description: 'Usa una pista que poseas o tengas licencia para usar.' },
        { title: 'Quitar voz ya está elegido', description: 'Sin menú que configurar; la página ya está ajustada para quitar el canto.' },
        { title: 'La IA divide la mezcla', description: 'El modelo estima por separado la voz y el acompañamiento.' },
        { title: 'Descarga el instrumental', description: 'Guarda el WAV o conviértelo a MP3 para el móvil.' },
      ],
      faq: [
        { question: '¿Desaparecerá toda la voz?', answer: 'La mayor parte de la voz principal, pero no siempre todo. Pueden quedar colas de reverberación, coros y filtraciones; el resultado varía según la canción.' },
        { question: '¿Por qué la salida es un archivo WAV?', answer: 'WAV es sin pérdida, así que el instrumental conserva todo el detalle para editar. Pesa más que MP3; conviértelo después si quieres algo menor.' },
        { question: '¿Puedo usarlo con cualquier canción?', answer: 'Solo con música que poseas, para la que tengas licencia o que puedas usar según el uso legítimo donde vives. Eres responsable del uso del resultado.' },
        { question: '¿Cómo obtengo solo la voz?', answer: 'Usa la página de aislar voces de una canción, que devuelve la pista vocal en lugar del instrumental.' },
      ],
      embed: { title: 'Quitar la voz de una canción', description: 'Sube una canción. Quitar voz ya está seleccionado y el instrumental llega en WAV, sin pérdida pero más pesado. Pulsa convertir.' },
    },
    // 2026-10-28 catalog expansion: name + tagline for the /tools catalog cards (model-written, needs native review).
    'inspect-metadata': {
      name: 'Inspector de metadatos',
      tagline: 'Mira todas las etiquetas ocultas en una foto, un vídeo, un archivo de audio o un PDF: EXIF, ubicación GPS, cámara, códecs, ID3, XMP y más, antes de compartirlo.',
    },
    'edit-image-metadata': {
      name: 'Editar metadatos de imagen',
      tagline: 'Define el título, el autor, el copyright, las palabras clave y la descripción de una foto, corrige o elimina su ubicación GPS y reescribe las etiquetas EXIF e IPTC.',
    },
    'change-video-speed': {
      name: 'Cambiar la velocidad del vídeo',
      tagline: 'Crea un time-lapse a 2x, 4x o más, o ralentiza un clip a 0,5x o 0,25x, con el audio sincronizado.',
    },
    'reverse-video': {
      name: 'Invertir vídeo',
      tagline: 'Reproduce cualquier clip hacia atrás, con o sin el audio invertido, y, si quieres, hazlo ir y volver (ping-pong) hacia delante y hacia atrás.',
    },
    'flip-video': {
      name: 'Voltear y reflejar vídeo',
      tagline: 'Refleja un vídeo en horizontal para corregir una webcam o un selfi invertidos, o dale la vuelta en vertical, con un solo clic.',
    },
    'stabilize-video': {
      name: 'Estabilizar vídeo',
      tagline: 'Suaviza el temblor de la cámara en mano y el rebote al caminar con un estabilizador de dos pasadas, sin trípode ni editor de escritorio.',
    },
    'change-video-frame-rate': {
      name: 'Cambiar los fotogramas por segundo del vídeo',
      tagline: 'Convierte un vídeo a 24, 25, 30 o 60 fps, reduce un clip de 60 fps a 30 para obtener un archivo más pequeño o ajústalo a la frecuencia de fotogramas de tu proyecto.',
    },
    'adjust-video-color': {
      name: 'Ajustar brillo y color del vídeo',
      tagline: 'Aclara un clip oscuro, añade contraste y saturación, cambia el tono o aplica un desenfoque o un aspecto artístico, con controles deslizantes y vista previa en directo.',
    },
    'convert-video-to-hevc': {
      name: 'Convertir vídeo a HEVC (H.265)',
      tagline: 'Recodifica cualquier vídeo en H.265 para obtener aproximadamente la mitad de tamaño que con H.264 con la misma calidad, ideal para almacenamiento, 4K y dispositivos modernos.',
    },
    'convert-audio-to-wav': {
      name: 'Convertir audio a WAV',
      tagline: 'Convierte MP3, M4A, WAV, OGG, FLAC y cualquier otro archivo de audio a WAV sin perder nada.',
    },
    'convert-audio-to-flac': {
      name: 'Convertir audio a FLAC',
      tagline: 'Convierte MP3, M4A, WAV, OGG, FLAC y cualquier otro archivo de audio a FLAC sin perder nada.',
    },
    'convert-audio-to-ogg': {
      name: 'Convertir audio a OGG',
      tagline: 'Convierte MP3, M4A, WAV, OGG, FLAC y cualquier otro archivo de audio a OGG con la tasa de bits que elijas.',
    },
    'convert-audio-to-m4a': {
      name: 'Convertir audio a M4A / AAC',
      tagline: 'Convierte MP3, M4A, WAV, OGG, FLAC y cualquier otro archivo de audio a M4A / AAC con la tasa de bits que elijas.',
    },
    'convert-audio-to-opus': {
      name: 'Convertir audio a Opus',
      tagline: 'Convierte MP3, M4A, WAV, OGG, FLAC y cualquier otro archivo de audio a Opus con la tasa de bits que elijas.',
    },
    'convert-mp3-to-wav': {
      name: 'Convertir MP3 a WAV',
      tagline: 'Convierte un MP3 en un WAV sin comprimir para editarlo, samplearlo o grabarlo en un CD.',
    },
    'change-audio-speed': {
      name: 'Cambiar la velocidad del audio',
      tagline: 'Acelera una clase o un pódcast a 1,5x, o ralentiza una canción o una grabación a 0,75x para practicar, sin cambiar el tono.',
    },
    'change-audio-pitch': {
      name: 'Cambiar el tono del audio',
      tagline: 'Desplaza una canción o una grabación por semitonos para cambiar su tonalidad, bajar una voz o afinar un sample, manteniendo el mismo tempo.',
    },
    'normalize-audio': {
      name: 'Normalizar audio',
      tagline: 'Sube una grabación baja a un volumen uniforme, para que los pódcast, las notas de voz y las listas de reproducción mixtas suenen al mismo nivel.',
    },
    'adjust-audio-volume': {
      name: 'Ajustar el volumen del audio',
      tagline: 'Sube o baja el volumen de un archivo de audio en una cantidad fija, del 10 por ciento al doble, o en decibelios con el control deslizante de amplificación.',
    },
    'audio-equalizer': {
      name: 'Ecualizador de audio',
      tagline: 'Aplica un refuerzo de graves, un realce de agudos, presencia vocal o un preajuste de género, o configura filtros de paso bajo y paso alto, y descarga el resultado.',
    },
    'add-reverb-to-audio': {
      name: 'Añadir reverberación al audio',
      tagline: 'Coloca una voz o una grabación seca en una sala, un auditorio o una reverb de placa o de muelle, o añade un delay o un eco, y descarga el resultado.',
    },
    'trim-audio': {
      name: 'Recortar audio',
      tagline: 'Corta un MP3, un WAV o cualquier grabación entre un tiempo de inicio y uno de fin, con una forma de onda para elegir los puntos, y descarga solo esa parte.',
    },
    'transcribe-audio': {
      name: 'Transcribir audio',
      tagline: 'Convierte un MP3, WAV, M4A o cualquier grabación en texto, subtítulos o JSON con reconocimiento de voz con IA en nuestros propios servidores GPU.',
    },
    'add-text-to-image': {
      name: 'Añadir texto a una imagen',
      tagline: 'Pon un pie de foto, un título o una marca de agua en una foto: elige la fuente, el tamaño, el color, el contorno y la posición, y descárgala.',
    },
    'crop-image': {
      name: 'Recortar imagen',
      tagline: 'Arrastra un cuadro sobre la parte de la foto que quieras, endereza el encuadre y descarga solo esa región en el formato que prefieras.',
    },
    'grayscale-image': {
      name: 'Convertir imagen a blanco y negro',
      tagline: 'Convierte una foto en color a escala de grises, o a sepia para un tono vintage, y descárgala en el formato que quieras.',
    },
    'image-filters': {
      name: 'Filtros y efectos de imagen',
      tagline: 'Óleo, boceto, carboncillo, relieve, vintage, remolino, desenfoque, nitidez y más, aplicados a cualquier foto con un solo clic.',
    },
    'rotate-image': {
      name: 'Girar imagen',
      tagline: 'Gira una foto 90°, 180° o 270°, corrige un escaneo o una foto del móvil que salió de lado y descárgala en el formato que quieras.',
    },
    'sharpen-image': {
      name: 'Enfocar imagen',
      tagline: 'Realza los bordes de una foto o un escaneo algo borroso con un enfoque de un solo clic y descárgalo en el formato que quieras.',
    },
    'blur-image': {
      name: 'Desenfocar imagen',
      tagline: 'Suaviza una foto entera para un fondo, un marcador de posición o una pantalla de privacidad, y descárgala en el formato que quieras.',
    },
    'generate-vtt-captions': {
      name: 'Generador de subtítulos VTT',
      tagline: 'Crea un archivo de subtítulos .vtt para vídeo HTML5, YouTube o un reproductor con transcripción por IA en nuestros propios servidores GPU.',
    },
    'summarize-video': {
      name: 'Resumir vídeo',
      tagline: 'Obtén la transcripción y un análisis JSON estructurado de una clase, una reunión o una entrevista, con marcas de tiempo, en nuestros propios servidores GPU.',
    },
    // MM78 voices: name + tagline (model-written, needs native review).
    'voice-cloning': {
      name: 'Clonación de voz',
      tagline:
        'Graba o sube entre 5 y 60 segundos de tu propia voz, crea una voz y haz que lea cualquier texto en más de veinte idiomas.',
    },
    'voice-designer': {
      name: 'Diseñador de voz',
      tagline:
        'Describe una voz con palabras, escúchala en una vista previa y conserva la que te guste para que lea cualquier texto en más de veinte idiomas.',
    },
    'voice-changer': {
      name: 'Cambiador de voz',
      tagline:
        'Modifica al instante el tono y el carácter de una grabación, o convierte el habla a una voz guardada o predefinida con IA.',
    },
  },
} as const;

export default esToolPages;
