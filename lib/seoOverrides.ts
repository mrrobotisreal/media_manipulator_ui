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

const DE_SEO_OVERRIDES: LocaleOverrides = {
  '/': {
    title: 'Kostenloser Online-Konverter, -Editor und -Transkriptionsdienst für Medien | Media Manipulator',
    description:
      'Konvertieren, bearbeiten, komprimieren, transkribieren und analysieren Sie Bilder, Videos und Audio online. Media Manipulator bietet Medienkonvertierung, Metadaten-Tools, KI-Zusammenfassungen und datenschutzfreundliche Dateiverarbeitung.',
  },
  '/about': {
    title: 'Über Media Manipulator | Kostenlose Online-Medientools von CreaTV Ltd.',
    description:
      'Media Manipulator ist ein kostenloser Dienst von CreaTV Ltd. zum Konvertieren, Bearbeiten, Komprimieren, Transkribieren und Analysieren von Bildern, Videos und Audio.',
  },
  '/how-it-works': {
    title: 'So funktioniert Media Manipulator | Dateikonvertierung, KI-Verarbeitung und temporäre Speicherung',
    description:
      'Erfahren Sie, wie Media Manipulator Ihre Dateien verarbeitet: Formatkonvertierung, KI-Transkription und -Zusammenfassungen, Sicherheitsprüfung der Uploads und temporäre Speicherung der Ergebnisse für bis zu 24 Stunden.',
  },
  '/tools': {
    title: 'Kostenlose Online-Medientools | Media Manipulator',
    description:
      'Kostenlose Online-Tools für Bilder, Videos, Audio, KI und Metadaten – konvertieren, komprimieren, transkribieren, EXIF entfernen, Gesang trennen und mehr.',
  },
  '/tutorials': {
    title: 'Media-Manipulator-Anleitungen | Tools für Bilder, Videos und Audio',
    description:
      'Schritt-für-Schritt-Anleitungen zum Bild-, Video- und Audio-Konverter, zu Metadaten-Tools, Transkription und KI-Funktionen von Media Manipulator.',
  },
  '/privacy-policy': {
    title: 'Datenschutzerklärung | Media Manipulator',
    description:
      'Erfahren Sie, wie Media Manipulator mit hochgeladenen Dateien umgeht: temporäre Speicherung, lokale KI-Verarbeitung, Analytik, Werbung, Inhaltsprüfung und Löschung.',
  },
  '/terms-of-service': {
    title: 'Nutzungsbedingungen und Regeln zur zulässigen Nutzung | Media Manipulator',
    description:
      'Lesen Sie die Bedingungen von Media Manipulator: hochgeladene Inhalte, zulässige Nutzung, Dateiverarbeitung, KI-Funktionen, Werbung und Verantwortung der Nutzer.',
  },
  '/pricing': {
    title: 'Preise – Media Manipulator',
    description:
      'Vergleichen Sie den kostenlosen Tarif, den Konto-Tarif und Premium: tägliche Operationslimits, Grenzen für Dateigröße und Videolänge, Ausgabeauflösung, Speicherung und Werbung.',
  },
  '/blog': {
    title: 'Guides zu Medienkonvertierung, Komprimierung und Bearbeitung | Media Manipulator Blog',
    description:
      'Praxisnahe Artikel über Medienformate, Komprimierung, Metadaten, Transkription und FFmpeg-basierte Dateiverarbeitung von Media Manipulator.',
  },
  '/blog/video/video-compression-guide': {
    title: 'Videokomprimierung erklärt: Dateigröße reduzieren ohne Qualitätsverlust | Media Manipulator',
    description:
      'Erfahren Sie, wie Videokomprimierung funktioniert, wie Codecs und Bitrate die Qualität beeinflussen und wie Sie Videos fürs Web verkleinern – mit praktischen Beispielen aus Media Manipulator und FFmpeg.',
  },
  '/blog/image/image-optimization-guide': {
    title: 'Bildoptimierung erklärt: Komprimieren, Skalieren und Konvertieren fürs Web | Media Manipulator',
    description:
      'Erfahren Sie, wie Sie JPG, PNG, WebP, AVIF und GIF optimieren: schnellere Websites, kleinere Downloads, bessere Qualität und sicheres Teilen ohne überflüssige Metadaten.',
  },
  '/blog/audio/audio-quality-guide': {
    title: 'Audioqualität erklärt: Bitrate, Formate, Komprimierung und Bereinigung | Media Manipulator',
    description:
      'Erfahren Sie, wie Bitrate, Abtastrate, Kanäle, Codecs, Komprimierung, Bereinigung und Transkription Größe und Qualität von Audiodateien beeinflussen.',
  },
  '/tutorials/ai-frame-interpolation': {
    title: 'Was ist KI-Frame-Interpolation? So funktioniert FPS-Glättung | Media Manipulator',
    description:
      'Erfahren Sie, wie KI-Frame-Interpolation funktioniert, worin sie sich von einfacher FPS-Umwandlung unterscheidet, wann 48/60/120 fps sinnvoll sind, welche Artefakte auftreten können und wie Sie das Tool von Media Manipulator nutzen.',
  },
  '/tutorials/video/getting-started': {
    title: 'Erste Schritte mit der Videokonvertierung | Media-Manipulator-Anleitung',
    description:
      'Konvertieren, komprimieren, schneiden und transkribieren Sie Videodateien mit den Video-Tools von Media Manipulator.',
  },
  '/tutorials/audio/getting-started': {
    title: 'Erste Schritte mit der Audiokonvertierung | Media-Manipulator-Anleitung',
    description:
      'Konvertieren, komprimieren, bereinigen und transkribieren Sie Audiodateien mit den Audio-Tools von Media Manipulator.',
  },
  '/tutorials/image/getting-started': {
    title: 'Erste Schritte mit der Bildkonvertierung | Media-Manipulator-Anleitung',
    description:
      'Konvertieren Sie Bilder, ändern Sie ihre Größe, schneiden Sie sie zu und entfernen Sie Metadaten mit den Tools von Media Manipulator.',
  },
  '/tutorials/content-studio': {
    title: 'Darkroom nutzen: Mehrspur-Videoschnitt im Browser | Media Manipulator',
    description:
      'Schritt-für-Schritt-Anleitung für Darkroom: Medienimport, Mehrspur-Timeline, Zuschneiden, Schneiden und Ripple-Löschen, Überblendungen, Farbkorrektur, Textebenen und MP4-Export – alles im Browser.',
  },
};

const HE_SEO_OVERRIDES: LocaleOverrides = {
  '/': {
    title: 'ממיר, עורך ומתמלל מדיה חינמי אונליין | Media Manipulator',
    description:
      'המירו, ערכו, דחסו, תמללו ונתחו תמונות, וידאו ואודיו אונליין. Media Manipulator — המרת מדיה, כלי מטא־נתונים, סיכומי בינה מלאכותית ועיבוד קבצים ששומר על הפרטיות.',
  },
  '/about': {
    title: 'אודות Media Manipulator | כלי מדיה חינמיים אונליין מבית CreaTV Ltd.',
    description:
      'Media Manipulator הוא שירות חינמי מבית CreaTV Ltd. להמרה, עריכה, דחיסה, תמלול וניתוח של תמונות, וידאו ואודיו.',
  },
  '/how-it-works': {
    title: 'איך Media Manipulator עובד | המרת קבצים, עיבוד בבינה מלאכותית ואחסון זמני',
    description:
      'גלו איך Media Manipulator מעבד קבצים: המרת פורמטים, תמלול וסיכומים בבינה מלאכותית, בדיקות אבטחה להעלאות ואחסון זמני של התוצאות עד 24 שעות.',
  },
  '/tools': {
    title: 'כלי מדיה חינמיים אונליין | Media Manipulator',
    description:
      'כלים חינמיים אונליין לתמונות, וידאו, אודיו, בינה מלאכותית ומטא־נתונים — המירו, דחסו, תמללו, הסירו EXIF, הפרידו שירה ועוד.',
  },
  '/tutorials': {
    title: 'מדריכי Media Manipulator | כלים לתמונות, וידאו ואודיו',
    description:
      'מדריכים שלב אחר שלב לממיר התמונות, הווידאו והאודיו, לכלי מטא־נתונים, לתמלול וליכולות הבינה המלאכותית של Media Manipulator.',
  },
  '/privacy-policy': {
    title: 'מדיניות פרטיות | Media Manipulator',
    description:
      'גלו איך Media Manipulator מטפל בקבצים שהועלו: אחסון זמני, עיבוד מקומי בבינה מלאכותית, אנליטיקה, פרסומות, בדיקת תוכן ומחיקה.',
  },
  '/terms-of-service': {
    title: 'תנאי שימוש וכללי שימוש מקובל | Media Manipulator',
    description:
      'קראו את תנאי Media Manipulator: תוכן שמועלה, שימוש מקובל, עיבוד קבצים, יכולות בינה מלאכותית, פרסומות ואחריות המשתמשים.',
  },
  '/pricing': {
    title: 'תמחור — Media Manipulator',
    description:
      'השוו בין המסלול החינמי, מסלול עם חשבון ו־Premium: מכסות פעולות יומיות, מגבלות גודל קובץ ואורך וידאו, רזולוציית פלט, אחסון ופרסומות.',
  },
  '/blog': {
    title: 'מדריכים להמרה, דחיסה ועריכה של מדיה | הבלוג של Media Manipulator',
    description:
      'מאמרים מעשיים על פורמטים של מדיה, דחיסה, מטא־נתונים, תמלול ועיבוד קבצים מבוסס FFmpeg מבית Media Manipulator.',
  },
  '/blog/video/video-compression-guide': {
    title: 'המדריך לדחיסת וידאו: הקטינו את גודל הקובץ בלי לאבד איכות | Media Manipulator',
    description:
      'גלו איך דחיסת וידאו עובדת, איך קודקים וקצב סיביות משפיעים על האיכות ואיך להקטין וידאו לאינטרנט — עם דוגמאות מעשיות מ־Media Manipulator ו־FFmpeg.',
  },
  '/blog/image/image-optimization-guide': {
    title: 'המדריך לאופטימיזציית תמונות: דחיסה, שינוי גודל והמרה לאינטרנט | Media Manipulator',
    description:
      'גלו איך לייעל JPG, PNG, WebP, AVIF ו־GIF: אתרים מהירים יותר, הורדות קטנות יותר, איכות טובה יותר ושיתוף בטוח בלי מטא־נתונים מיותרים.',
  },
  '/blog/audio/audio-quality-guide': {
    title: 'המדריך לאיכות שמע: קצב סיביות, פורמטים, דחיסה וניקוי | Media Manipulator',
    description:
      'גלו איך קצב סיביות, קצב דגימה, ערוצים, קודקים, דחיסה, ניקוי ותמלול משפיעים על הגודל והאיכות של קובצי אודיו.',
  },
  '/tutorials/ai-frame-interpolation': {
    title: 'מהי אינטרפולציית פריימים בבינה מלאכותית? כך עובדת החלקת FPS | Media Manipulator',
    description:
      'גלו איך אינטרפולציית פריימים בבינה מלאכותית עובדת, במה היא שונה מהמרת FPS פשוטה, מתי לבחור 48/60/120 fps, אילו ארטיפקטים אפשריים ואיך להשתמש בכלי של Media Manipulator.',
  },
  '/tutorials/video/getting-started': {
    title: 'צעדים ראשונים בהמרת וידאו | מדריך Media Manipulator',
    description:
      'המירו, דחסו, חתכו ותמללו קובצי וידאו עם כלי הווידאו של Media Manipulator.',
  },
  '/tutorials/audio/getting-started': {
    title: 'צעדים ראשונים בהמרת אודיו | מדריך Media Manipulator',
    description:
      'המירו, דחסו, נקו ותמללו קובצי אודיו עם כלי האודיו של Media Manipulator.',
  },
  '/tutorials/image/getting-started': {
    title: 'צעדים ראשונים בהמרת תמונות | מדריך Media Manipulator',
    description:
      'המירו תמונות, שנו את גודלן, חתכו אותן והסירו מטא־נתונים עם הכלים של Media Manipulator.',
  },
  '/tutorials/content-studio': {
    title: 'איך להשתמש ב־Darkroom: עריכת וידאו מרובת רצועות בדפדפן | Media Manipulator',
    description:
      'מדריך שלב אחר שלב ל־Darkroom: ייבוא מדיה, טיימליין מרובה רצועות, חיתוך, פיצול ומחיקת ripple, מעברי דיסולב, תיקון צבע, שכבות טקסט וייצוא MP4 — הכול בדפדפן.',
  },
};

const ES_SEO_OVERRIDES: LocaleOverrides = {
  '/': {
    title: 'Conversor, editor y transcriptor de medios gratis online | Media Manipulator',
    description:
      'Convierte, edita, comprime, transcribe y analiza imágenes, vídeos y audio online. Media Manipulator ofrece conversión de medios, herramientas de metadatos, resúmenes con IA y procesamiento de archivos respetuoso con la privacidad.',
  },
  '/about': {
    title: 'Sobre Media Manipulator | Herramientas de medios gratis online de CreaTV Ltd.',
    description:
      'Media Manipulator es un servicio gratuito de CreaTV Ltd. para convertir, editar, comprimir, transcribir y analizar imágenes, vídeos y audio.',
  },
  '/how-it-works': {
    title: 'Cómo funciona Media Manipulator | Conversión de archivos, procesamiento con IA y almacenamiento temporal',
    description:
      'Descubre cómo Media Manipulator procesa tus archivos: conversión de formatos, transcripción y resúmenes con IA, comprobación de seguridad de las subidas y almacenamiento temporal de los resultados durante un máximo de 24 horas.',
  },
  '/tools': {
    title: 'Herramientas de medios gratis online | Media Manipulator',
    description:
      'Herramientas gratuitas online para imágenes, vídeo, audio, IA y metadatos: convierte, comprime, transcribe, elimina EXIF, separa la voz y mucho más.',
  },
  '/tutorials': {
    title: 'Tutoriales de Media Manipulator | Herramientas de imagen, vídeo y audio',
    description:
      'Guías paso a paso del conversor de imágenes, vídeo y audio, las herramientas de metadatos, la transcripción y las funciones de IA de Media Manipulator.',
  },
  '/privacy-policy': {
    title: 'Política de privacidad | Media Manipulator',
    description:
      'Descubre cómo trata Media Manipulator los archivos subidos: almacenamiento temporal, procesamiento local con IA, analítica, publicidad, revisión de contenido y eliminación.',
  },
  '/terms-of-service': {
    title: 'Términos del servicio y normas de uso aceptable | Media Manipulator',
    description:
      'Consulta las condiciones de Media Manipulator: contenido subido, uso aceptable, procesamiento de archivos, funciones de IA, publicidad y responsabilidad de los usuarios.',
  },
  '/pricing': {
    title: 'Precios — Media Manipulator',
    description:
      'Compara el plan gratuito, el plan con cuenta y Premium: límites diarios de operaciones, límites de tamaño de archivo y duración de vídeo, resolución de salida, almacenamiento y publicidad.',
  },
  '/blog': {
    title: 'Guías de conversión, compresión y edición de medios | Blog de Media Manipulator',
    description:
      'Artículos prácticos sobre formatos de medios, compresión, metadatos, transcripción y procesamiento de archivos con FFmpeg, de Media Manipulator.',
  },
  '/blog/video/video-compression-guide': {
    title: 'Guía de compresión de vídeo: reduce el tamaño sin perder calidad | Media Manipulator',
    description:
      'Descubre cómo funciona la compresión de vídeo, cómo los códecs y el bitrate afectan a la calidad y cómo reducir vídeos para la web, con ejemplos prácticos de Media Manipulator y FFmpeg.',
  },
  '/blog/image/image-optimization-guide': {
    title: 'Guía de optimización de imágenes: comprimir, redimensionar y convertir para la web | Media Manipulator',
    description:
      'Aprende a optimizar JPG, PNG, WebP, AVIF y GIF: webs más rápidas, descargas más pequeñas, mejor calidad y un compartir seguro sin metadatos innecesarios.',
  },
  '/blog/audio/audio-quality-guide': {
    title: 'Guía de calidad de audio: bitrate, formatos, compresión y limpieza | Media Manipulator',
    description:
      'Descubre cómo el bitrate, la frecuencia de muestreo, los canales, los códecs, la compresión, la limpieza y la transcripción afectan al tamaño y la calidad de los archivos de audio.',
  },
  '/tutorials/ai-frame-interpolation': {
    title: '¿Qué es la interpolación de fotogramas con IA? Así funciona el suavizado de FPS | Media Manipulator',
    description:
      'Descubre cómo funciona la interpolación de fotogramas con IA, en qué se diferencia de una conversión de FPS simple, cuándo elegir 48/60/120 fps, qué artefactos pueden aparecer y cómo usar la herramienta de Media Manipulator.',
  },
  '/tutorials/video/getting-started': {
    title: 'Primeros pasos con la conversión de vídeo | Tutorial de Media Manipulator',
    description:
      'Convierte, comprime, recorta y transcribe archivos de vídeo con las herramientas de vídeo de Media Manipulator.',
  },
  '/tutorials/audio/getting-started': {
    title: 'Primeros pasos con la conversión de audio | Tutorial de Media Manipulator',
    description:
      'Convierte, comprime, limpia y transcribe archivos de audio con las herramientas de audio de Media Manipulator.',
  },
  '/tutorials/image/getting-started': {
    title: 'Primeros pasos con la conversión de imágenes | Tutorial de Media Manipulator',
    description:
      'Convierte imágenes, cambia su tamaño, recórtalas y elimina metadatos con las herramientas de Media Manipulator.',
  },
  '/tutorials/content-studio': {
    title: 'Cómo usar Darkroom: edición de vídeo multipista en el navegador | Media Manipulator',
    description:
      'Guía paso a paso de Darkroom: importa medios, línea de tiempo multipista, recorte, corte y eliminación ripple, fundidos cruzados, corrección de color, capas de texto y exportación a MP4 — todo en el navegador.',
  },
};

const OVERRIDES: Record<string, LocaleOverrides> = {
  'ru-RU': RU_SEO_OVERRIDES,
  'uk-UA': UK_SEO_OVERRIDES,
  'de-DE': DE_SEO_OVERRIDES,
  'he-IL': HE_SEO_OVERRIDES,
  'es-ES': ES_SEO_OVERRIDES,
};

export function getSeoOverride(path: string, locale: string): SeoOverride | undefined {
  return OVERRIDES[locale]?.[path];
}
