/**
 * Per-locale <title>/description overrides for the SEO map.
 *
 * `lib/seo.ts` (English) stays the single source of truth for every route's
 * metadata; this module holds sparse, per-locale overrides following the same
 * partial-override pattern as `i18n/toolPageContent.ts`. A path/locale pair
 * with no entry falls back to the English copy.
 *
 * Scope decision (2026-08-08): real Russian titles/descriptions exist for the
 * static core pages and the long-form articles. The ~65 `/tools/[slug]` pages
 * deliberately keep English metadata until their body copy is translated —
 * a Russian title on a fully English page is a worse signal than consistent
 * English. Add tool-page entries here together with their body translations.
 */

export interface SeoOverride {
  title?: string;
  description?: string;
}

type LocaleOverrides = Record<string, SeoOverride>;

const RU_SEO_OVERRIDES: LocaleOverrides = {
  '/': {
    title: 'Бесплатный онлайн-конвертер, редактор и транскрибатор медиафайлов | Media Manipulator',
    description:
      'Конвертируйте, редактируйте, сжимайте, транскрибируйте и анализируйте изображения, видео и аудио онлайн. Media Manipulator — конвертация медиа, инструменты метаданных, ИИ-сводки и обработка файлов с заботой о приватности.',
  },
  '/about': {
    title: 'О Media Manipulator | Бесплатные онлайн-инструменты для медиа от CreaTV Ltd.',
    description:
      'Media Manipulator — бесплатный сервис от CreaTV Ltd. для конвертации, редактирования, сжатия, транскрибации и анализа изображений, видео и аудио.',
  },
  '/how-it-works': {
    title: 'Как работает Media Manipulator | Конвертация файлов, ИИ-обработка и временное хранение',
    description:
      'Узнайте, как Media Manipulator обрабатывает файлы: конвертация форматов, ИИ-транскрибация и сводки, проверка загрузок на безопасность и временное хранение результатов до 24 часов.',
  },
  '/tools': {
    title: 'Бесплатные онлайн-инструменты для медиа | Media Manipulator',
    description:
      'Бесплатные онлайн-инструменты для изображений, видео, аудио, ИИ и метаданных — конвертируйте, сжимайте, транскрибируйте, удаляйте EXIF, отделяйте вокал и не только.',
  },
  '/tutorials': {
    title: 'Руководства Media Manipulator | Инструменты для изображений, видео и аудио',
    description:
      'Пошаговые руководства по конвертеру изображений, видео и аудио, инструментам метаданных, транскрибации и ИИ-функциям Media Manipulator.',
  },
  '/privacy-policy': {
    title: 'Политика конфиденциальности | Media Manipulator',
    description:
      'Узнайте, как Media Manipulator обращается с загруженными файлами: временное хранение, локальная ИИ-обработка, аналитика, реклама, проверка контента и удаление.',
  },
  '/terms-of-service': {
    title: 'Условия использования и правила допустимого использования | Media Manipulator',
    description:
      'Ознакомьтесь с условиями Media Manipulator: загружаемый контент, допустимое использование, обработка файлов, ИИ-функции, реклама и ответственность пользователей.',
  },
  '/pricing': {
    title: 'Тарифы — Media Manipulator',
    description:
      'Сравните бесплатный тариф, тариф с аккаунтом и Premium: дневные лимиты операций, ограничения размера файлов и длительности видео, разрешение на выходе, хранение и реклама.',
  },
  '/blog': {
    title: 'Гайды по конвертации, сжатию и редактированию медиа | Блог Media Manipulator',
    description:
      'Практические статьи о форматах медиа, сжатии, метаданных, транскрибации и обработке файлов на базе FFmpeg от Media Manipulator.',
  },
  '/blog/video/video-compression-guide': {
    title: 'Гайд по сжатию видео: уменьшите размер файла без потери качества | Media Manipulator',
    description:
      'Узнайте, как работает сжатие видео, как кодеки и битрейт влияют на качество и как уменьшить размер видео для веба на практических примерах Media Manipulator и FFmpeg.',
  },
  '/blog/image/image-optimization-guide': {
    title: 'Гайд по оптимизации изображений: сжатие, изменение размера и конвертация для веба | Media Manipulator',
    description:
      'Узнайте, как оптимизировать JPG, PNG, WebP, AVIF и GIF: быстрее сайты, меньше загрузки, лучше качество и безопасный обмен без лишних метаданных.',
  },
  '/blog/audio/audio-quality-guide': {
    title: 'Гайд по качеству звука: битрейт, форматы, сжатие и очистка | Media Manipulator',
    description:
      'Узнайте, как битрейт, частота дискретизации, каналы, кодеки, сжатие, очистка и транскрибация влияют на размер и качество аудиофайлов.',
  },
  '/tutorials/ai-frame-interpolation': {
    title: 'Что такое ИИ-интерполяция кадров? Как работает сглаживание FPS | Media Manipulator',
    description:
      'Узнайте, как работает ИИ-интерполяция кадров, чем она отличается от простого преобразования FPS, когда выбирать 48/60/120 fps, какие бывают артефакты и как использовать инструмент Media Manipulator.',
  },
  '/tutorials/video/getting-started': {
    title: 'Первые шаги в конвертации видео | Руководство Media Manipulator',
    description:
      'Конвертируйте, сжимайте, обрезайте и транскрибируйте видеофайлы с помощью видеоинструментов Media Manipulator.',
  },
  '/tutorials/audio/getting-started': {
    title: 'Первые шаги в конвертации аудио | Руководство Media Manipulator',
    description:
      'Конвертируйте, сжимайте, очищайте и транскрибируйте аудиофайлы с помощью аудиоинструментов Media Manipulator.',
  },
  '/tutorials/image/getting-started': {
    title: 'Первые шаги в конвертации изображений | Руководство Media Manipulator',
    description:
      'Конвертируйте изображения, меняйте их размер, кадрируйте и удаляйте метаданные с помощью инструментов Media Manipulator.',
  },
  '/tutorials/content-studio': {
    title: 'Как пользоваться Darkroom: многодорожечный видеомонтаж в браузере | Media Manipulator',
    description:
      'Пошаговое руководство по Darkroom: импорт медиа, многодорожечный таймлайн, обрезка, разрезание и ripple-удаление, кросс-диссолвы, цветокоррекция, текстовые слои и экспорт MP4 — все в браузере.',
  },
};

const UK_SEO_OVERRIDES: LocaleOverrides = {
  '/': {
    title: 'Безкоштовний онлайн-конвертер, редактор і транскрибатор медіафайлів | Media Manipulator',
    description:
      'Конвертуйте, редагуйте, стискайте, транскрибуйте та аналізуйте зображення, відео й аудіо онлайн. Media Manipulator — конвертація медіа, інструменти метаданих, ШІ-зведення та обробка файлів із турботою про приватність.',
  },
  '/about': {
    title: 'Про Media Manipulator | Безкоштовні онлайн-інструменти для медіа від CreaTV Ltd.',
    description:
      'Media Manipulator — безкоштовний сервіс від CreaTV Ltd. для конвертації, редагування, стиснення, транскрибації та аналізу зображень, відео й аудіо.',
  },
  '/how-it-works': {
    title: 'Як працює Media Manipulator | Конвертація файлів, ШІ-обробка та тимчасове зберігання',
    description:
      'Дізнайтеся, як Media Manipulator обробляє файли: конвертація форматів, ШІ-транскрибація та зведення, перевірка завантажень на безпеку і тимчасове зберігання результатів до 24 годин.',
  },
  '/tools': {
    title: 'Безкоштовні онлайн-інструменти для медіа | Media Manipulator',
    description:
      'Безкоштовні онлайн-інструменти для зображень, відео, аудіо, ШІ та метаданих — конвертуйте, стискайте, транскрибуйте, видаляйте EXIF, відокремлюйте вокал і не тільки.',
  },
  '/tutorials': {
    title: 'Посібники Media Manipulator | Інструменти для зображень, відео та аудіо',
    description:
      'Покрокові посібники з конвертера зображень, відео та аудіо, інструментів метаданих, транскрибації та ШІ-функцій Media Manipulator.',
  },
  '/privacy-policy': {
    title: 'Політика конфіденційності | Media Manipulator',
    description:
      'Дізнайтеся, як Media Manipulator поводиться із завантаженими файлами: тимчасове зберігання, локальна ШІ-обробка, аналітика, реклама, перевірка контенту та видалення.',
  },
  '/terms-of-service': {
    title: 'Умови використання та правила допустимого використання | Media Manipulator',
    description:
      'Ознайомтеся з умовами Media Manipulator: завантажуваний контент, допустиме використання, обробка файлів, ШІ-функції, реклама та відповідальність користувачів.',
  },
  '/pricing': {
    title: 'Тарифи — Media Manipulator',
    description:
      'Порівняйте безкоштовний тариф, тариф з обліковим записом і Premium: денні ліміти операцій, обмеження розміру файлів і тривалості відео, вихідна роздільна здатність, зберігання та реклама.',
  },
  '/blog': {
    title: 'Гайди з конвертації, стиснення та редагування медіа | Блог Media Manipulator',
    description:
      'Практичні статті про формати медіа, стиснення, метадані, транскрибацію та обробку файлів на базі FFmpeg від Media Manipulator.',
  },
  '/blog/video/video-compression-guide': {
    title: 'Гайд зі стиснення відео: зменшіть розмір файлу без втрати якості | Media Manipulator',
    description:
      'Дізнайтеся, як працює стиснення відео, як кодеки та бітрейт впливають на якість і як зменшити розмір відео для вебу на практичних прикладах Media Manipulator і FFmpeg.',
  },
  '/blog/image/image-optimization-guide': {
    title: 'Гайд з оптимізації зображень: стиснення, зміна розміру та конвертація для вебу | Media Manipulator',
    description:
      'Дізнайтеся, як оптимізувати JPG, PNG, WebP, AVIF і GIF: швидші сайти, менші завантаження, краща якість і безпечний обмін без зайвих метаданих.',
  },
  '/blog/audio/audio-quality-guide': {
    title: 'Гайд з якості звуку: бітрейт, формати, стиснення та очищення | Media Manipulator',
    description:
      'Дізнайтеся, як бітрейт, частота дискретизації, канали, кодеки, стиснення, очищення та транскрибація впливають на розмір і якість аудіофайлів.',
  },
  '/tutorials/ai-frame-interpolation': {
    title: 'Що таке ШІ-інтерполяція кадрів? Як працює згладжування FPS | Media Manipulator',
    description:
      'Дізнайтеся, як працює ШІ-інтерполяція кадрів, чим вона відрізняється від простого перетворення FPS, коли обирати 48/60/120 fps, які бувають артефакти та як користуватися інструментом Media Manipulator.',
  },
  '/tutorials/video/getting-started': {
    title: 'Перші кроки в конвертації відео | Посібник Media Manipulator',
    description:
      'Конвертуйте, стискайте, обрізайте та транскрибуйте відеофайли за допомогою відеоінструментів Media Manipulator.',
  },
  '/tutorials/audio/getting-started': {
    title: 'Перші кроки в конвертації аудіо | Посібник Media Manipulator',
    description:
      'Конвертуйте, стискайте, очищайте та транскрибуйте аудіофайли за допомогою аудіоінструментів Media Manipulator.',
  },
  '/tutorials/image/getting-started': {
    title: 'Перші кроки в конвертації зображень | Посібник Media Manipulator',
    description:
      'Конвертуйте зображення, змінюйте їхній розмір, кадруйте та видаляйте метадані за допомогою інструментів Media Manipulator.',
  },
  '/tutorials/content-studio': {
    title: 'Як користуватися Darkroom: багатодоріжковий відеомонтаж у браузері | Media Manipulator',
    description:
      'Покроковий посібник з Darkroom: імпорт медіа, багатодоріжковий таймлайн, обрізання, розрізання та ripple-видалення, крос-діссолви, кольорокорекція, текстові шари та експорт MP4 — усе в браузері.',
  },
};

const OVERRIDES: Record<string, LocaleOverrides> = {
  'ru-RU': RU_SEO_OVERRIDES,
  'uk-UA': UK_SEO_OVERRIDES,
};

export function getSeoOverride(path: string, locale: string): SeoOverride | undefined {
  return OVERRIDES[locale]?.[path];
}
