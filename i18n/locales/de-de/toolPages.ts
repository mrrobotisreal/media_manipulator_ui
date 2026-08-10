/**
 * German partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope (2026-08-09): `name` + `tagline` for the review-allowlisted slugs —
 * the fields surfaced on the home page's "Popular conversions" grid and the
 * /tools index. Translating the full page bodies (h1, sections, FAQs) of all
 * ~65 tools is deliberately deferred; later sessions extend these same
 * per-slug entries incrementally.
 *
 * Register: formal "Sie"; brand names, formats and codecs stay untranslated;
 * "Darkroom" stays "Darkroom".
 */

const deToolPages = {
  pages: {
    'content-studio': {
      name: 'Darkroom',
      tagline:
        'Schneiden, überlagern und mischen Sie Video und Audio auf einer Mehrspur-Timeline – und exportieren Sie als MP4. Ein Editor im Stil von Premiere Pro, direkt im Browser.',
    },
    'remove-exif-metadata': {
      name: 'EXIF-Metadaten aus Bildern entfernen',
      tagline:
        'Entfernen Sie GPS-Koordinaten, Geräte-, Kamera- und Aufnahmedaten aus Ihren Fotos, bevor Sie sie teilen.',
    },
    'compress-image': {
      name: 'Bild komprimieren',
      tagline:
        'Verkleinern Sie JPG-, PNG- und WebP-Dateien für schnellere Websites, kleinere Uploads und einfaches Teilen.',
    },
    'image-resizer': {
      name: 'Bildgröße ändern',
      tagline:
        'Skalieren Sie JPG, PNG, WebP und GIF pixelgenau – mit Beibehaltung des Seitenverhältnisses.',
    },
    'remove-background-from-image': {
      name: 'Hintergrund aus Bild entfernen',
      tagline:
        'Entfernen Sie automatisch den Hintergrund aus jedem Foto und laden Sie ein sauberes PNG mit Transparenz herunter.',
    },
    'image-to-pdf': {
      name: 'Bilder in PDF umwandeln',
      tagline:
        'Verwandeln Sie JPG, PNG und andere Bilder mit einem Klick in ein ordentliches PDF-Dokument.',
    },
    'pdf-to-jpg': {
      name: 'PDF in JPG umwandeln',
      tagline:
        'Wandeln Sie jede PDF-Seite in hochwertige JPG-Bilder um – zum Teilen, Bearbeiten und Veröffentlichen.',
    },
    'compress-video': {
      name: 'Video komprimieren',
      tagline:
        'Verkleinern Sie MP4, WebM, MOV, MKV und AVI für Web, E-Mail, soziale Netzwerke und Cloud-Uploads.',
    },
    'video-trimmer': {
      name: 'Video zuschneiden',
      tagline:
        'Schneiden Sie den gewünschten Abschnitt schnell und ohne Qualitätsverlust aus – wenn möglich ganz ohne Neukodierung.',
    },
    'extract-audio-from-video': {
      name: 'Audio aus Video extrahieren',
      tagline:
        'Speichern Sie die Tonspur eines beliebigen Videos als sauberes MP3, WAV, M4A, AAC, FLAC oder OGG.',
    },
    'convert-video-to-animated-gif': {
      name: 'Video in animiertes GIF umwandeln',
      tagline:
        'Verwandeln Sie kurze Clips aus MP4, WebM, MOV oder MKV in Sekundenschnelle in animierte GIFs.',
    },
    'transcribe-video': {
      name: 'Video transkribieren',
      tagline:
        'Extrahieren Sie gesprochene Worte aus Videos als durchsuchbaren Text, Untertitel oder strukturiertes JSON.',
    },
    'transcode-to-hls': {
      name: 'Video in HLS transkodieren',
      tagline:
        'Verpacken Sie jedes Video als Apple-HLS-VOD-Bundle: master.m3u8 und .ts-Segmente in mehreren Qualitätsstufen – bereit fürs Web.',
    },
    'ai-video-restoration': {
      name: 'KI-Videorestaurierung',
      tagline:
        'Verbessern und restaurieren Sie einen kurzen Videoabschnitt mit bis zu sechs KI-Modellen – Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT und VRT – und vergleichen Sie alle Ergebnisse nebeneinander.',
    },
    'ai-image-restoration': {
      name: 'KI-Bildrestaurierung und -Upscaling',
      tagline:
        'Bereinigen, vergrößern und restaurieren Sie Fotos mit bis zu acht KI-Modellen – schonende Vorverarbeitung (FBCNN, SCUNet, NAFNet), universelle Upscaler (Real-ESRGAN, SwinIR, HAT) und Gesichtsverbesserung (GFPGAN, CodeFormer) – und vergleichen Sie jedes Ergebnis mit dem Original.',
    },
    'ai-document-scan': {
      name: 'KI-Dokumentenscan',
      tagline:
        'Verwandeln Sie Dokumentscans und handschriftliche Notizen in ein durchsuchbares mehrseitiges PDF und ein bearbeitbares Word-Dokument – gedruckte Seiten erhalten eine präzise Tesseract-Textebene, Handschrift entziffert eine visuelle KI mit Unsicherheitsmarkierungen, ohne etwas hinzuzuerfinden.',
    },
  },
} as const;

export default deToolPages;
