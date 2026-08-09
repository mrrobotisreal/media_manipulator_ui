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

const OVERRIDES: Record<string, LocaleOverrides> = {
  'ru-RU': RU_SEO_OVERRIDES,
};

export function getSeoOverride(path: string, locale: string): SeoOverride | undefined {
  return OVERRIDES[locale]?.[path];
}
