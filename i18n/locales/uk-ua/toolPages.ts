/**
 * Ukrainian partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope (2026-08-08): `name` + `tagline` for the review-allowlisted slugs —
 * the fields surfaced on the home page's "Popular conversions" grid and the
 * /tools index. Translating the full page bodies (h1, sections, FAQs) of all
 * ~65 tools is deliberately deferred; later sessions extend these same
 * per-slug entries incrementally.
 *
 * Register: «ви» form; brand names, formats and codecs stay untranslated;
 * "Darkroom" stays "Darkroom".
 */

const ukToolPages = {
  pages: {
    'content-studio': {
      name: 'Darkroom',
      tagline:
        'Монтуйте, накладайте та мікшуйте відео й аудіо на багатодоріжковому таймлайні — і експортуйте MP4. Редактор у стилі Premiere Pro прямо у вашому браузері.',
    },
    'remove-exif-metadata': {
      name: 'Видалення EXIF-метаданих із зображень',
      tagline:
        'Видаліть GPS-координати, дані про пристрій, камеру та час зйомки з фотографій, перш ніж ділитися ними.',
    },
    'compress-image': {
      name: 'Стиснення зображення',
      tagline:
        'Зменшіть розмір файлів JPG, PNG і WebP для швидших сайтів, компактніших завантажень і зручнішого обміну.',
    },
    'image-resizer': {
      name: 'Зміна розміру зображення',
      tagline:
        'Змінюйте розмір зображень JPG, PNG, WebP і GIF до точних пікселів зі збереженням пропорцій.',
    },
    'remove-background-from-image': {
      name: 'Видалення фону із зображення',
      tagline:
        'Автоматично видаліть фон із будь-якого фото та завантажте чистий PNG із прозорістю.',
    },
    'image-to-pdf': {
      name: 'Зображення в PDF',
      tagline:
        'Перетворіть JPG, PNG та інші зображення на охайний PDF-документ одним кліком.',
    },
    'pdf-to-jpg': {
      name: 'PDF в JPG',
      tagline:
        'Перетворіть кожну сторінку PDF на якісні зображення JPG, якими можна ділитися, редагувати та публікувати.',
    },
    'compress-video': {
      name: 'Стиснення відео',
      tagline:
        'Зменшіть розмір файлів MP4, WebM, MOV, MKV і AVI для веб-сайтів, пошти, соцмереж і хмарних завантажень.',
    },
    'video-trimmer': {
      name: 'Обрізання відео',
      tagline:
        'Виріжте потрібний фрагмент швидко і без втрати якості — без перекодування, коли це можливо.',
    },
    'extract-audio-from-video': {
      name: 'Видобування аудіо з відео',
      tagline:
        'Збережіть звукову доріжку будь-якого відео як чистий MP3, WAV, M4A, AAC, FLAC або OGG.',
    },
    'convert-video-to-animated-gif': {
      name: 'Відео в анімований GIF',
      tagline:
        'Перетворіть короткі кліпи MP4, WebM, MOV або MKV на анімовані GIF за лічені секунди.',
    },
    'transcribe-video': {
      name: 'Транскрибація відео',
      tagline:
        'Витягніть промовлені слова з відео в текст із можливістю пошуку, субтитри або структурований JSON.',
    },
    'transcode-to-hls': {
      name: 'Транскодування відео в HLS',
      tagline:
        'Запакуйте будь-яке відео в Apple HLS VOD-пакет: master.m3u8 та .ts-сегменти за якостями — готово для вебу.',
    },
    'ai-video-restoration': {
      name: 'ШІ-реставрація відео',
      tagline:
        'Покращуйте та відновлюйте короткий фрагмент відео за допомогою до шести ШІ-моделей — Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT і VRT — і порівнюйте всі результати поруч.',
    },
    'ai-image-restoration': {
      name: 'ШІ-реставрація та апскейл зображень',
      tagline:
        'Очищайте, збільшуйте та відновлюйте фото за допомогою до восьми ШІ-моделей — дбайлива попередня обробка (FBCNN, SCUNet, NAFNet), універсальні апскейлери (Real-ESRGAN, SwinIR, HAT) і покращення облич (GFPGAN, CodeFormer) — і порівнюйте кожен результат з оригіналом.',
    },
    'ai-document-scan': {
      name: 'ШІ-сканування документів',
      tagline:
        'Перетворіть скани документів і рукописні нотатки на багатосторінковий PDF із пошуком і редагований документ Word — друковані сторінки отримують точний текстовий шар Tesseract, рукописний текст розшифровує візуальний ШІ з позначками невпевненості, нічого не вигадуючи.',
    },
  },
} as const;

export default ukToolPages;
