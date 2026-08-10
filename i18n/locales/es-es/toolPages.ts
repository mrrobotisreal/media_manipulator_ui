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
  },
} as const;

export default esToolPages;
