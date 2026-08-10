/**
 * Hebrew partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope (2026-08-09): `name` + `tagline` for the review-allowlisted slugs —
 * the fields surfaced on the home page's "Popular conversions" grid and the
 * /tools index. Translating the full page bodies (h1, sections, FAQs) of all
 * ~65 tools is deliberately deferred; later sessions extend these same
 * per-slug entries incrementally.
 *
 * Register: plural imperative for user-facing sentences (Israeli software
 * convention); brand names, formats and codecs stay untranslated; "Darkroom"
 * stays "Darkroom"; Hebrew maqaf (־) before Latin acronyms.
 */

const heToolPages = {
  pages: {
    'content-studio': {
      name: 'Darkroom',
      tagline:
        'ערכו, שלבו ומזגו וידאו ואודיו על טיימליין מרובה רצועות — וייצאו MP4. עורך בסגנון Premiere Pro ישירות בדפדפן.',
    },
    'remove-exif-metadata': {
      name: 'הסרת מטא־נתוני EXIF מתמונות',
      tagline:
        'הסירו נקודות ציון GPS, פרטי מכשיר, מצלמה וזמן צילום מהתמונות שלכם לפני שאתם משתפים אותן.',
    },
    'compress-image': {
      name: 'דחיסת תמונה',
      tagline:
        'הקטינו קבצי JPG, PNG ו־WebP לאתרים מהירים יותר, העלאות קטנות יותר ושיתוף קל.',
    },
    'image-resizer': {
      name: 'שינוי גודל תמונה',
      tagline:
        'שנו גודל של JPG, PNG, WebP ו־GIF לפיקסל המדויק — תוך שמירה על יחס הממדים.',
    },
    'remove-background-from-image': {
      name: 'הסרת רקע מתמונה',
      tagline:
        'הסירו אוטומטית את הרקע מכל תמונה והורידו PNG נקי עם שקיפות.',
    },
    'image-to-pdf': {
      name: 'תמונות ל־PDF',
      tagline:
        'הפכו JPG, PNG ותמונות נוספות למסמך PDF מסודר בלחיצה אחת.',
    },
    'pdf-to-jpg': {
      name: 'PDF ל־JPG',
      tagline:
        'המירו כל עמוד PDF לתמונות JPG איכותיות שאפשר לשתף, לערוך ולפרסם.',
    },
    'compress-video': {
      name: 'דחיסת וידאו',
      tagline:
        'הקטינו קבצי MP4, WebM, MOV, MKV ו־AVI לאינטרנט, לאימייל, לרשתות חברתיות ולהעלאות לענן.',
    },
    'video-trimmer': {
      name: 'חיתוך וידאו',
      tagline:
        'גזרו את הקטע הרצוי במהירות וללא אובדן איכות — בלי קידוד מחדש כשאפשר.',
    },
    'extract-audio-from-video': {
      name: 'חילוץ אודיו מווידאו',
      tagline:
        'שמרו את פסקול הווידאו כקובץ MP3, WAV, M4A, AAC, FLAC או OGG נקי.',
    },
    'convert-video-to-animated-gif': {
      name: 'וידאו ל־GIF מונפש',
      tagline:
        'הפכו קליפים קצרים של MP4, WebM, MOV או MKV ל־GIF מונפש תוך שניות.',
    },
    'transcribe-video': {
      name: 'תמלול וידאו',
      tagline:
        'חלצו מילים מדוברות מהווידאו לטקסט הניתן לחיפוש, לכתוביות או ל־JSON מובנה.',
    },
    'transcode-to-hls': {
      name: 'המרת וידאו ל־HLS',
      tagline:
        'ארזו כל וידאו לחבילת VOD של Apple HLS: קובץ master.m3u8 ומקטעי ts לפי רמות איכות — מוכן לאינטרנט.',
    },
    'ai-video-restoration': {
      name: 'שחזור וידאו בבינה מלאכותית',
      tagline:
        'שפרו ושחזרו קטע וידאו קצר בעזרת עד שישה מודלי AI — Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT ו־VRT — והשוו את כל התוצאות זו לצד זו.',
    },
    'ai-image-restoration': {
      name: 'שחזור והגדלת תמונות בבינה מלאכותית',
      tagline:
        'נקו, הגדילו ושחזרו תמונות בעזרת עד שמונה מודלי AI — עיבוד מקדים עדין (FBCNN, SCUNet, NAFNet), מגדילים אוניברסליים (Real-ESRGAN, SwinIR, HAT) ושיפור פנים (GFPGAN, CodeFormer) — והשוו כל תוצאה למקור.',
    },
    'ai-document-scan': {
      name: 'סריקת מסמכים בבינה מלאכותית',
      tagline:
        'הפכו סריקות מסמכים והערות בכתב יד ל־PDF רב־עמודים הניתן לחיפוש ולמסמך Word הניתן לעריכה — עמודים מודפסים מקבלים שכבת טקסט מדויקת של Tesseract, וכתב יד מפוענח בידי בינה מלאכותית חזותית עם סימוני אי־ודאות, בלי להמציא דבר.',
    },
  },
} as const;

export default heToolPages;
