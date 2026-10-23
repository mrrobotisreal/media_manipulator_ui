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
  },
} as const;

export default esToolPages;
