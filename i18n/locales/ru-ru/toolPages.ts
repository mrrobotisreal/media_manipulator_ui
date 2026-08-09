/**
 * Russian partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope (2026-08-08): `name` + `tagline` for the review-allowlisted slugs —
 * the fields surfaced on the home page's "Popular conversions" grid and the
 * /tools index. Translating the full page bodies (h1, sections, FAQs) of all
 * ~65 tools is deliberately deferred; later sessions extend these same
 * per-slug entries incrementally.
 *
 * Register: «вы» form, «е» not «ё»; brand names, formats and codecs stay
 * untranslated; "Darkroom" stays "Darkroom".
 */

const ruToolPages = {
  pages: {
    'content-studio': {
      name: 'Darkroom',
      tagline:
        'Монтируйте, накладывайте и микшируйте видео и аудио на многодорожечном таймлайне — и экспортируйте MP4. Редактор в стиле Premiere Pro прямо в браузере.',
    },
    'remove-exif-metadata': {
      name: 'Удаление EXIF-метаданных из изображений',
      tagline:
        'Удалите GPS-координаты, данные об устройстве, камере и времени съемки из фотографий, прежде чем делиться ими.',
    },
    'compress-image': {
      name: 'Сжатие изображения',
      tagline:
        'Уменьшите размер JPG, PNG и WebP для быстрых сайтов, компактных загрузок и удобного обмена.',
    },
    'image-resizer': {
      name: 'Изменение размера изображения',
      tagline:
        'Меняйте размер JPG, PNG, WebP и GIF до точных пикселей с сохранением пропорций.',
    },
    'remove-background-from-image': {
      name: 'Удаление фона с изображения',
      tagline:
        'Автоматически удалите фон с любой фотографии и скачайте чистый PNG с прозрачностью.',
    },
    'image-to-pdf': {
      name: 'Изображения в PDF',
      tagline:
        'Превратите JPG, PNG и другие изображения в аккуратный PDF-документ одним кликом.',
    },
    'pdf-to-jpg': {
      name: 'PDF в JPG',
      tagline:
        'Преобразуйте каждую страницу PDF в качественные JPG-изображения, которыми можно делиться, редактировать и публиковать.',
    },
    'compress-video': {
      name: 'Сжатие видео',
      tagline:
        'Уменьшите размер MP4, WebM, MOV, MKV и AVI для веба, почты, соцсетей и облачных загрузок.',
    },
    'video-trimmer': {
      name: 'Обрезка видео',
      tagline:
        'Вырежьте нужный фрагмент быстро и без потери качества — без перекодирования, когда это возможно.',
    },
    'extract-audio-from-video': {
      name: 'Извлечение аудио из видео',
      tagline:
        'Сохраните звуковую дорожку любого видео в чистый MP3, WAV, M4A, AAC, FLAC или OGG.',
    },
    'convert-video-to-animated-gif': {
      name: 'Видео в анимированный GIF',
      tagline:
        'Превратите короткие клипы MP4, WebM, MOV или MKV в анимированные GIF за считанные секунды.',
    },
    'transcribe-video': {
      name: 'Транскрибация видео',
      tagline:
        'Извлеките произнесенные слова из видео в текст с возможностью поиска, субтитры или структурированный JSON.',
    },
    'transcode-to-hls': {
      name: 'Транскодирование видео в HLS',
      tagline:
        'Упакуйте любое видео в Apple HLS VOD-бандл: master.m3u8 и .ts-сегменты по качествам — готово для веба.',
    },
    'ai-video-restoration': {
      name: 'ИИ-реставрация видео',
      tagline:
        'Улучшайте и восстанавливайте короткий фрагмент видео с помощью до шести ИИ-моделей — Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT и VRT — и сравнивайте все результаты рядом.',
    },
    'ai-image-restoration': {
      name: 'ИИ-реставрация и апскейл изображений',
      tagline:
        'Очищайте, увеличивайте и восстанавливайте фото с помощью до восьми ИИ-моделей — бережная предобработка (FBCNN, SCUNet, NAFNet), универсальные апскейлеры (Real-ESRGAN, SwinIR, HAT) и улучшение лиц (GFPGAN, CodeFormer) — и сравнивайте каждый результат с оригиналом.',
    },
    'ai-document-scan': {
      name: 'ИИ-сканирование документов',
      tagline:
        'Превратите сканы документов и рукописные заметки в многостраничный PDF с поиском и редактируемый документ Word — печатные страницы получают точный текстовый слой Tesseract, рукописный текст расшифровывает визуальный ИИ с пометками о неуверенности, ничего не выдумывая.',
    },
  },
} as const;

export default ruToolPages;
