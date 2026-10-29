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
    // MM48: Motion's full page body (model-written, needs native review). The brand stays "Motion".
    motion: {
      name: 'Motion',
      tagline: 'Zeichnen oder importieren Sie ein SVG, animieren Sie es auf einer Keyframe-Zeitleiste und exportieren Sie animiertes SVG, Lottie, React, JavaScript, Flutter oder GIF, alles in Ihrem Browser.',
      intro: 'Motion ist ein SVG-Editor mit Animationszeitleiste, integriert in Media Manipulator. Öffnen Sie eine SVG-Datei (oder eine Lottie-Animation), und jede Form wird zu einer Ebene, die Sie auswählen, verschieben, umfärben und animieren können, oder beginnen Sie mit einer leeren Zeichenfläche und zeichnen Sie mit den Werkzeugen für Rechteck, Ellipse, Linie, Zeichenstift und Text. Jede animierte Eigenschaft erhält eine eigene Keyframe-Spur, mit Easing-Vorgaben, einem Kurveneditor für eigenes Easing und Hold-Keys für sofortige Sprünge. Ein-Klick-Animatoren fügen Konturzeichnung, Bewegung entlang eines Pfads, Form-Morphing, Farbverläufe, Maskenanimation und Weichzeichner hinzu. Wenn es sich so bewegt, wie Sie möchten, exportieren Sie es als animiertes SVG, Lottie-Datei, React-Komponente, JavaScript- oder TypeScript-Modul, Flutter-Widget oder GIF. Bearbeitung und jeder Export laufen in Ihrem Browser, Ihre Grafik wird also nie hochgeladen, um sie zu exportieren.',
      whatItDoes: [
        'Importiert SVG-Dateien in einen bearbeitbaren Ebenenbaum (Gruppen, Pfade, Formen, Text, Bilder, Verläufe, Masken und Beschneidungspfade) und importiert Lottie-JSON-Animationen mit ihren Keyframes.',
        'Zeichnet neue Grafiken mit den Werkzeugen für Rechteck, Ellipse, Linie, Zeichenstift (Bézier) und Text und bearbeitet Pfadknoten direkt auf der Zeichenfläche.',
        'Animiert Position, Skalierung, Drehung, Neigung, Deckkraft, Füllung, Kontur und Konturbreite auf einer Keyframe-Zeitleiste mit Linear, Ease In, Ease Out, Ease In-Out, eigenem Cubic-Bezier und Hold-Easing.',
        'Fügt fortgeschrittene Animationen mit einem Klick hinzu: Konturzeichnung, Bewegung entlang eines Pfads mit optionaler automatischer Drehung, Form-Morphing, Farben von Verlaufsstopps, Masken- und Beschneidungspfad-Animation sowie Weichzeichner.',
        'Exportiert ein statisches SVG (immer kostenlos), ein animiertes SVG, das ohne Bibliothek abgespielt wird, Lottie JSON, eine React-Komponente, ein JavaScript- oder TypeScript-Modul, ein Flutter-Widget und ein animiertes GIF.',
      ],
      flowSteps: [
        {
          title: 'Öffnen oder zeichnen',
          description: 'Importieren Sie eine SVG- oder Lottie-Datei oder zeichnen Sie Formen und Pfade auf einer leeren Zeichenfläche.',
        },
        {
          title: 'Animieren',
          description: 'Bewegen Sie den Abspielkopf und ändern Sie eine Eigenschaft: Die Zeitleiste zeichnet dafür einen Keyframe auf.',
        },
        {
          title: 'Timing gestalten',
          description: 'Wählen Sie eine Easing-Vorgabe, zeichnen Sie eine eigene Kurve, fügen Sie Holds hinzu oder wenden Sie einen Ein-Klick-Animator an.',
        },
        {
          title: 'Exportieren',
          description: 'Laden Sie animiertes SVG, Lottie, React, JS/TS, Flutter oder GIF herunter, erstellt in Ihrem Browser.',
        },
      ],
      advancedDetails: [
        'Der Export als animiertes SVG nutzt reine CSS-Keyframes, sofern sich jeder Effekt in Chrome, Firefox und Safari in CSS ausdrücken lässt. Form-Morphing, bewegte Verlaufsstopps und Weichzeichner benötigen ein kleines Skript, daher enthalten diese Dateien eine gekürzte Kopie von anime.js (MIT-Lizenz, etwa 14 KB komprimiert) mit ihrem Lizenzvermerk am Anfang.',
        'Beim Form-Morphing werden beide Formen auf dieselbe Anzahl von Kurvensegmenten normalisiert und ihre Startpunkte und Umlaufrichtung angeglichen, damit sich das Morphing nicht verdreht. Zwei Formen, die sich nicht angleichen lassen, werden gehalten, statt gemorpht zu werden.',
        'Der Lottie-Writer folgt der Lottie-Spezifikation 1.0.1 und dem Funktionsumfang „Basic“ von LottieFiles. Alles, was Lottie nicht abbilden kann (etwa Filter, Text oder erweiterte Masken), wird nach dem Download aufgelistet; nichts wird stillschweigend verworfen.',
        'Der GIF-Export nutzt einen eigens für Media Manipulator geschriebenen Encoder mit einer globalen Palette aus Bildern der gesamten Animation, sodass flache Vektorgrafiken ihre exakten Farben behalten.',
        'Importierte SVGs werden beim Einlesen bereinigt: Skripte, Ereignishandler, externe Verweise und andere unsichere Inhalte werden entfernt, und der Editor baut nicht unterstütztes Markup aus einer Positivliste neu auf, statt es als HTML einzufügen.',
      ],
      whyItMatters: [
        'Animierte SVGs bleiben in jeder Größe scharf und sind meist deutlich kleiner als ein Video oder GIF derselben Animation, was sie ideal für Logos, Icons, Ladeanimationen und Illustrationen im Web macht.',
        'Entwickler brauchen Animation als Code, nicht nur als Video: Eine React-Komponente, ein JavaScript-Modul, eine Lottie-Datei oder ein Flutter-Widget lässt sich direkt in eine App einfügen.',
        'Der Export im Browser bedeutet, dass Ihre Grafik auf Ihrem Gerät bleibt; nur die Anzahl jedes Exports wird an uns gesendet, um das tägliche Kontingent durchzusetzen.',
      ],
      useCases: [
        {
          title: 'Logo- und Icon-Animation',
          description: 'Zeichnen Sie ein Logo mit einer Konturanimation ein oder lassen Sie ein Icon beim Überfahren hüpfen, sich drehen oder die Farbe wechseln.',
        },
        {
          title: 'Ladeanimationen und UI-Mikroanimationen',
          description: 'Erstellen Sie Spinner und Fortschrittsanimationen und exportieren Sie sie als reines CSS-SVG oder React-Komponente.',
        },
        {
          title: 'Lottie für mobile Apps',
          description: 'Exportieren Sie Lottie JSON für die Lottie-Player für iOS, Android, Web und Flutter oder bearbeiten Sie eine vorhandene Lottie-Datei.',
        },
        {
          title: 'Animierte Illustrationen',
          description: 'Bewegen Sie Teile einer Illustration entlang von Pfaden, morphen Sie Formen ineinander und exportieren Sie ein GIF für Chat oder E-Mail.',
        },
      ],
      whyMediaManipulator: [
        'Ein echter Editor mit Ebenen und Keyframes, mit Holds, eigenen Kurven und fortgeschrittenen Animatoren, keine Vorlagengalerie.',
        'Exporte für Designer und Entwickler gleichermaßen: animiertes SVG, Lottie, React, JavaScript oder TypeScript, Flutter und GIF aus einem Projekt.',
        'Exporte werden in Ihrem Browser erstellt, und der einzige Drittanbieter-Code, den ein Export verwendet, ist permissiv lizenziert (anime.js unter MIT; flutter_svg und webview_flutter für Flutter), wobei sein Lizenzvermerk in der Datei erhalten bleibt.',
      ],
      privacyNote: 'Bearbeitung und Export finden in Ihrem Browser statt; Ihre Grafik wird nicht hochgeladen, um sie zu exportieren. Ohne Konto werden Projekte nur in diesem Browser gespeichert. Wenn Sie sich anmelden und ein Projekt in Ihrem Konto speichern, wird es wie ein Darkroom-Projekt auf unseren Servern gespeichert, folgt der von Ihnen gewählten Aufbewahrungsdauer und kann auf Ihrer Kontoseite gelöscht werden. Zu jedem Export erfassen wir nur Format, Größe, Länge und Zeitpunkt, um das tägliche Kontingent durchzusetzen.',
      faq: [
        {
          question: 'Ist Motion kostenlos?',
          answer: 'Ja. Motion zu öffnen, zu zeichnen, zu animieren, zu speichern und ein statisches SVG zu exportieren ist kostenlos und unbegrenzt, ohne Konto. Animierte Exporte zählen zu einem Tageskontingent, das von Ihrem Tarif abhängt; die Tariftabelle auf dieser Seite zeigt Kontingent und Formate jedes Tarifs.',
        },
        {
          question: 'Welche Formate kann ich exportieren?',
          answer: 'Statisches SVG, animiertes SVG (CSS oder bei Bedarf ein kleines Inline-Skript), Lottie JSON, eine React-Komponente (.tsx), ein JavaScript- oder TypeScript-Modul, ein Flutter-Widget (.dart) und ein animiertes GIF. Welche davon Ihr Tarif enthält und wie viele Exporte täglich möglich sind, zeigt die Tariftabelle auf dieser Seite.',
        },
        {
          question: 'Welche Limits gibt es?',
          answer: 'Animierte Exporte werden pro Tag gezählt und um Mitternacht UTC zurückgesetzt. Besucher ohne Konto können Projekte nur in ihrem Browser speichern; angemeldete Tarife speichern eine bestimmte Anzahl von Projekten im Konto. Für den Export gibt es außerdem eine maximale Animationslänge, und der GIF-Export hat eine Größen- und Längenbegrenzung. Alle aktuellen Zahlen stehen in der Tariftabelle auf dieser Seite und auf der Preisseite.',
        },
        {
          question: 'Kann ich ein vorhandenes SVG animieren?',
          answer: 'Ja. Importieren Sie ein beliebiges SVG, und seine Gruppen, Pfade, Formen, Texte, Verläufe, Masken und Beschneidungspfade werden zu bearbeitbaren Ebenen. Teile, die der Editor nicht bearbeiten kann, etwa Muster oder komplexe Filter, werden beibehalten und unverändert exportiert, und alles Unsichere (Skripte oder externe Links) wird entfernt und nach dem Import aufgelistet.',
        },
        {
          question: 'Unterstützt es Lottie?',
          answer: 'Ja, in beide Richtungen. Sie können eine Lottie-JSON-Datei zum Bearbeiten importieren und Ihre Animation als Lottie JSON für lottie-web sowie die Lottie-Player für iOS, Android und Flutter exportieren. Funktionen, die eine Seite nicht abbilden kann, werden im Dialog aufgelistet, statt stillschweigend verworfen zu werden.',
        },
        {
          question: 'Welche Browser unterstützen den Videoexport?',
          answer: 'Der GIF-Export funktioniert in allen modernen Browsern. MP4- und WebM-Export stützen sich auf WebCodecs, den integrierten Videoencoder des Browsers, der in Chrome und Edge sowie je nach Codec in neueren Versionen von Safari und Firefox verfügbar ist; der Exportdialog prüft Ihren Browser und meldet, wenn er nicht kodieren kann. Die Tariftabelle auf dieser Seite zeigt, welcher Tarif welches Videoformat enthält.',
        },
        {
          question: 'Welche Lizenz gilt für den exportierten Code?',
          answer: 'Ihre Animation gehört Ihnen. Wenn ein animiertes SVG oder ein Code-Export eine Laufzeitumgebung benötigt, verwendet es anime.js, das MIT-lizenziert ist; sein Urheberrechtsvermerk steht am Anfang der Datei und muss dort erhalten bleiben. Flutter-Exporte verwenden das Paket flutter_svg (MIT) oder webview_flutter (BSD-3-Clause). Alles andere in der Datei wird aus Ihrem Projekt erzeugt. Die Open-Source-Bibliotheken, die der Editor verwendet, sind auf unserer Lizenzseite aufgeführt.',
        },
        {
          question: 'Wo werden meine Projekte gespeichert?',
          answer: 'Ohne Konto werden Projekte nur in diesem Browser gespeichert, sodass das Löschen Ihrer Browserdaten sie entfernt. Wenn Sie angemeldet sind, können Sie ein Projekt in Ihrem Konto speichern; es wird dann zwischen Geräten synchronisiert, beim Arbeiten automatisch gespeichert, folgt der von Ihnen gewählten Aufbewahrungsdauer und kann auf Ihrer Kontoseite gelöscht werden.',
        },
      ],
      supportedFormats: {
        supportedInputFormats: [
          'SVG',
          'Lottie JSON',
          'Motion-Projekt (.json)',
        ],
        supportedOutputFormats: [
          'Statisches SVG',
          'Animiertes SVG',
          'Lottie JSON',
          'React (.tsx)',
          'JavaScript / TypeScript',
          'Flutter (.dart)',
          'GIF',
        ],
        maxFileNotes: [
          'SVG- und Lottie-Importe bis zu je 4 MB.',
          'Projekte ohne Konto bleiben nur in diesem Browser; angemeldete Projekte folgen der von Ihnen gewählten Aufbewahrungsdauer.',
        ],
        processingNotes: [
          'Bearbeitung, Vorschau und jeder Export laufen in Ihrem Browser. Nur die Anzahl jedes Exports wird an unsere Server gesendet.',
        ],
      },
      embed: {
        title: 'Motion öffnen',
        description: 'Beginnen Sie eine neue Zeichnung oder öffnen Sie eine letzte erneut. Der Editor öffnet sich im Vollbild; Ihre Arbeit bleibt in diesem Browser erhalten, und angemeldete Nutzer können sie in ihrem Konto speichern.',
      },
      related: [
        {
          label: 'Motion-Tutorial',
          to: '/tutorials/motion',
          description: 'Importieren Sie ein SVG, animieren Sie es, gestalten Sie das Easing und exportieren Sie es, Schritt für Schritt.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Bearbeiten Sie Video auf einer Multi-Track-Zeitleiste und exportieren Sie MP4.',
        },
        {
          label: 'Video in animiertes GIF umwandeln',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Wandeln Sie einen Videoclip in ein GIF um, wenn Ihre Animation als Filmmaterial begann.',
        },
        {
          label: 'Open-Source-Lizenzen',
          to: '/licenses',
          description: 'Die Bibliotheken, die der Editor ausführt und in Ihre Exporte schreibt.',
        },
      ],
      metaTitle: 'Motion: Kostenloser SVG-Animationseditor | Media Manipulator',
      metaDescription: 'Animieren Sie SVG im Browser: Keyframes, Easing, Holds, Konturzeichnung, Bewegungspfade und Morphing. Export als animiertes SVG, Lottie JSON, React, JS, Flutter oder GIF.',
      ogTitle: 'Motion: Kostenloser SVG-Animationseditor',
      ogDescription: 'Animieren Sie SVG im Browser: Keyframes, Easing, Holds, Konturzeichnung, Bewegungspfade und Morphing. Export als animiertes SVG, Lottie JSON, React, JS, Flutter oder GIF.',
    },
    'content-studio': {
      metaTitle: 'Darkroom: kostenloser Online-Videoeditor mit mehreren Spuren | Media Manipulator',
      metaDescription: 'Bearbeiten, schichten und mischen Sie Video und Audio auf einer Mehrspur-Zeitleiste und exportieren Sie anschließend MP4 – ein kostenloser Videoeditor im Stil von Premiere Pro, der direkt in Ihrem Browser läuft. Ohne Anmeldung, ohne Installation.',
      name: 'Darkroom',
      tagline:
        'Schneiden, überlagern und mischen Sie Video und Audio auf einer Mehrspur-Timeline – und exportieren Sie als MP4. Ein Editor im Stil von Premiere Pro, direkt im Browser.',
    },
    'remove-exif-metadata': {
      metaTitle: 'EXIF-Metadaten aus Bildern entfernen – online & kostenlos | Media Manipulator',
      metaDescription: 'Kostenloses Online-Tool zum Entfernen von EXIF-, GPS-, IPTC- und Kamerametadaten aus JPG-, PNG-, WebP- und HEIC-Bildern. Ohne Anmeldung. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      name: 'EXIF-Metadaten aus Bildern entfernen',
      tagline:
        'Entfernen Sie GPS-Koordinaten, Geräte-, Kamera- und Aufnahmedaten aus Ihren Fotos, bevor Sie sie teilen.',
    },
    'compress-image': {
      metaTitle: 'Bilder online kostenlos komprimieren | Media Manipulator',
      metaDescription: 'Kostenloser Online-Bildkompressor. Verkleinern Sie JPG-, PNG- und WebP-Dateien bei guter Qualität. Ohne Anmeldung. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      name: 'Bild komprimieren',
      tagline:
        'Verkleinern Sie JPG-, PNG- und WebP-Dateien für schnellere Websites, kleinere Uploads und einfaches Teilen.',
    },
    'image-resizer': {
      metaTitle: 'Bildgröße online kostenlos ändern | Media Manipulator',
      metaDescription: 'Kostenloser Online-Bildgrößenänderer. Ändern Sie die Größe von JPG-, PNG-, WebP- und GIF-Bildern auf exakte Pixelmaße und behalten Sie dabei das Seitenverhältnis bei. Ohne Anmeldung. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      name: 'Bildgröße ändern',
      tagline:
        'Skalieren Sie JPG, PNG, WebP und GIF pixelgenau – mit Beibehaltung des Seitenverhältnisses.',
    },
    'remove-background-from-image': {
      metaTitle: 'Hintergrund aus Bild online kostenlos entfernen | Media Manipulator',
      metaDescription: 'Kostenloser Online-Hintergrundentferner. Löschen Sie den Hintergrund jedes Fotos automatisch und laden Sie ein transparentes PNG herunter. Läuft auf unserer eigenen GPU – ohne KI von Drittanbietern. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      name: 'Hintergrund aus Bild entfernen',
      tagline:
        'Entfernen Sie automatisch den Hintergrund aus jedem Foto und laden Sie ein sauberes PNG mit Transparenz herunter.',
    },
    'image-to-pdf': {
      metaTitle: 'Bild online kostenlos in PDF umwandeln | Media Manipulator',
      metaDescription: 'Kostenloser Online-Konverter von Bild zu PDF. Wandeln Sie JPG, PNG und andere Bilder in ein sauberes PDF-Dokument um. Ohne Anmeldung, ohne Wasserzeichen. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      name: 'Bilder in PDF umwandeln',
      tagline:
        'Verwandeln Sie JPG, PNG und andere Bilder mit einem Klick in ein ordentliches PDF-Dokument.',
    },
    'pdf-to-jpg': {
      metaTitle: 'PDF online kostenlos in JPG umwandeln | Media Manipulator',
      metaDescription: 'Kostenloser Online-Konverter von PDF zu JPG. Rendern Sie jede Seite eines PDFs als hochwertiges JPG-Bild und laden Sie alles als ZIP herunter. Ohne Anmeldung. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      name: 'PDF in JPG umwandeln',
      tagline:
        'Wandeln Sie jede PDF-Seite in hochwertige JPG-Bilder um – zum Teilen, Bearbeiten und Veröffentlichen.',
    },
    'compress-video': {
      metaTitle: 'Video online komprimieren (kostenlos) | Media Manipulator',
      metaDescription: 'Kostenloser Online-Videokompressor. Verkleinern Sie MP4-, WebM-, MOV-, MKV- und AVI-Dateien bei guter Qualität. Ohne Anmeldung. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      name: 'Video komprimieren',
      tagline:
        'Verkleinern Sie MP4, WebM, MOV, MKV und AVI für Web, E-Mail, soziale Netzwerke und Cloud-Uploads.',
    },
    'video-trimmer': {
      metaTitle: 'Video online kostenlos schneiden | Media Manipulator',
      metaDescription: 'Kostenloser Online-Videotrimmer. Legen Sie Start- und Endzeit fest und schneiden Sie Ihren Clip schnell und verlustfrei zu. MP4-Ausgabe, ohne Wasserzeichen, ohne Anmeldung. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      name: 'Video zuschneiden',
      tagline:
        'Schneiden Sie den gewünschten Abschnitt schnell und ohne Qualitätsverlust aus – wenn möglich ganz ohne Neukodierung.',
    },
    'extract-audio-from-video': {
      metaTitle: 'Audio aus Video extrahieren – MP3, WAV, M4A und mehr | Media Manipulator',
      metaDescription: 'Kostenloses Online-Tool zum Extrahieren der Tonspur aus jeder Videodatei (MP4, MOV, MKV, WebM, AVI). Ausgabe als MP3, WAV, M4A, AAC, FLAC oder OGG. Ohne Anmeldung. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      name: 'Audio aus Video extrahieren',
      tagline:
        'Speichern Sie die Tonspur eines beliebigen Videos als sauberes MP3, WAV, M4A, AAC, FLAC oder OGG.',
    },
    'convert-video-to-animated-gif': {
      metaTitle: 'Video online in animiertes GIF umwandeln (kostenlos) | Media Manipulator',
      metaDescription: 'Kostenloser Online-Konverter von Video zu GIF. Wandeln Sie kurze MP4-, WebM-, MOV- und MKV-Clips in animierte GIFs um – mit Kontrolle über Größe und Bildrate.',
      name: 'Video in animiertes GIF umwandeln',
      tagline:
        'Verwandeln Sie kurze Clips aus MP4, WebM, MOV oder MKV in Sekundenschnelle in animierte GIFs.',
    },
    'transcribe-video': {
      metaTitle: 'Video online in Text transkribieren (kostenlos) | Media Manipulator',
      metaDescription: 'Kostenlose Online-Videotranskription. Wandeln Sie MP4-, MOV-, WebM-, MKV- und Audiodateien in durchsuchbaren Text, VTT-Untertitel oder JSON-Transkripte um.',
      name: 'Video transkribieren',
      tagline:
        'Extrahieren Sie gesprochene Worte aus Videos als durchsuchbaren Text, Untertitel oder strukturiertes JSON.',
    },
    'transcode-to-hls': {
      metaTitle: 'Video online in HLS transcodieren | Kostenloses Adaptive-Streaming-Tool',
      metaDescription: 'Kostenloser Online-HLS-Transcoder. Wandeln Sie MP4, MOV, WebM und MKV in ein HLS-VOD-Paket mit 360p-/480p-/720p-Varianten um, optional mit Untertiteln und Storyboards.',
      name: 'Video in HLS transkodieren',
      tagline:
        'Verpacken Sie jedes Video als Apple-HLS-VOD-Bundle: master.m3u8 und .ts-Segmente in mehreren Qualitätsstufen – bereit fürs Web.',
    },
    'ai-video-restoration': {
      metaTitle: 'KI-Videorestaurierung – 6 Upscaling-Modelle online vergleichen | Media Manipulator',
      metaDescription: 'Kostenloses KI-Tool zur Videorestaurierung. Schicken Sie einen kurzen Clip durch die Super-Resolution-Modelle Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT und VRT auf unserer eigenen GPU und laden Sie alle Ergebnisse in einem Paket herunter.',
      name: 'KI-Videorestaurierung',
      tagline:
        'Verbessern und restaurieren Sie einen kurzen Videoabschnitt mit bis zu sechs KI-Modellen – Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT und VRT – und vergleichen Sie alle Ergebnisse nebeneinander.',
    },
    'ai-image-restoration': {
      metaTitle: 'KI-Bildrestaurierung & Upscaler – 8 Modelle online vergleichen | Media Manipulator',
      metaDescription: 'Kostenlose KI-Fotorestaurierung und -Vergrößerung. Entfernen Sie JPEG-Artefakte, Rauschen und Unschärfe, vergrößern Sie mit Real-ESRGAN, SwinIR oder HAT auf 4K/8K und verbessern Sie Gesichter mit GFPGAN/CodeFormer – alles auf unserer eigenen GPU, nebeneinander verglichen.',
      name: 'KI-Bildrestaurierung und -Upscaling',
      tagline:
        'Bereinigen, vergrößern und restaurieren Sie Fotos mit bis zu acht KI-Modellen – schonende Vorverarbeitung (FBCNN, SCUNet, NAFNet), universelle Upscaler (Real-ESRGAN, SwinIR, HAT) und Gesichtsverbesserung (GFPGAN, CodeFormer) – und vergleichen Sie jedes Ergebnis mit dem Original.',
    },
    'ai-document-scan': {
      metaTitle: 'KI-Dokumentenscan – gescannte Seiten & Handschrift in PDF/Word | Media Manipulator',
      metaDescription: 'Kostenloser KI-Dokumentenscan: Wandeln Sie gescannte Bilder in ein durchsuchbares PDF und per Bild-zu-Word-OCR um und transkribieren Sie handschriftliche Notizen in Text. Ordnen Sie Seiten neu an, mischen Sie Gedrucktes und Handschrift – alles auf unserer eigenen GPU, wortgetreu und mit markierter Unsicherheit.',
      name: 'KI-Dokumentenscan',
      tagline:
        'Verwandeln Sie Dokumentscans und handschriftliche Notizen in ein durchsuchbares mehrseitiges PDF und ein bearbeitbares Word-Dokument – gedruckte Seiten erhalten eine präzise Tesseract-Textebene, Handschrift entziffert eine visuelle KI mit Unsicherheitsmarkierungen, ohne etwas hinzuzuerfinden.',
    },
    'ai-image-upscaler': {
      name: 'KI-Bild-Upscaler',
      h1: 'KI-Bild-Upscaler: Fotos online 2x oder 4x vergrößern',
      tagline: 'Vergrößern Sie kleine oder weiche Fotos mit einem Real-ESRGAN-Modell, das Details neu aufbaut, statt nur Pixel zu strecken.',
      metaTitle: 'KI-Bild-Upscaler: Fotos 2x oder 4x vergrößern | Media Manipulator',
      metaDescription: 'Vergrößern Sie ein niedrig aufgelöstes Foto 2x oder 4x mit KI, die Kanten und Texturen wiederherstellt. Läuft auf unserer eigenen GPU, Ausgabe als PNG.',
      ogTitle: 'KI-Bild-Upscaler: Fotos 2x oder 4x vergrößern',
      ogDescription: 'Vergrößern Sie kleine oder weiche Fotos mit einem Real-ESRGAN-KI-Modell, das Details neu aufbaut.',
      intro: 'Normales Skalieren interpoliert nur zwischen vorhandenen Pixeln, deshalb wirkt ein vergrößertes Foto unscharf. Diese Seite nutzt ein KI-Super-Resolution-Modell (Real-ESRGAN), das typische Kanten, Haut, Stoff und Laub kennt und plausible Details ergänzt. Sie wählen 2x oder 4x und erhalten ein verlustfreies PNG.',
      flowSteps: [
        { title: 'Kleines Foto hochladen', description: 'JPG, PNG oder WebP, das größer werden soll.' },
        { title: '2x oder 4x wählen', description: 'KI-Upscaling ist bereits eingestellt; wählen Sie nur Maßstab und Modell.' },
        { title: 'KI baut Details auf', description: 'Das Modell vergrößert das Bild und erzeugt schärfere Kanten und Texturen.' },
        { title: 'PNG herunterladen', description: 'Speichern Sie das vergrößerte, verlustfreie Ergebnis.' },
      ],
      faq: [
        { question: 'Wie unterscheidet sich KI-Upscaling von normalem Skalieren?', answer: 'Normales Skalieren interpoliert vorhandene Pixel und wirkt unscharf. Das KI-Modell sagt plausible Kanten und Texturen voraus. Es bleibt eine fundierte Vermutung, keine zurückgewonnene Originalinformation.' },
        { question: 'Soll ich 2x oder 4x wählen?', answer: '2x, wenn die Vorlage schon brauchbar ist. 4x für sehr kleine Bilder, mit deutlich größerer Datei und etwas mehr erfundenem Detail.' },
        { question: 'Macht es ein unscharfes Foto scharf?', answer: 'Es hilft bei Weichheit durch geringe Auflösung. Starke Bewegungsunschärfe oder verfehlten Fokus kann es nicht beheben. Vergleichen Sie immer mit dem Original.' },
        { question: 'Gibt es Limits für die kostenlose Nutzung?', answer: 'KI-Vorgänge können je nach Tarif nach Dateigröße oder Tageskontingent begrenzt sein. Das Formular zeigt beim Hochladen die für Sie geltenden Limits.' },
      ],
      embed: { title: 'Bild mit KI hochskalieren', description: 'Laden Sie ein Foto hoch. KI-Upscaling ist bereits gewählt und gesperrt, die Ausgabe ist PNG. Wählen Sie 2x oder 4x und ein Modell und starten Sie.' },
    },
    'blur-faces-in-photo': {
      name: 'Gesichter im Foto unkenntlich machen',
      h1: 'Gesichter in einem Foto online unkenntlich machen',
      tagline: 'Gesichter automatisch erkennen und alle oder nur ausgewählte weichzeichnen, verpixeln oder schwärzen.',
      metaTitle: 'Gesichter im Foto online unkenntlich machen | Media Manipulator',
      metaDescription: 'Gesichter in einem Foto weichzeichnen, verpixeln oder schwärzen. Erkennen Sie alle Gesichter und wählen Sie, welche verdeckt werden. KI auf unserer eigenen GPU.',
      ogTitle: 'Gesichter in einem Foto online unkenntlich machen',
      ogDescription: 'Gesichter automatisch finden und alle oder nur ausgewählte weichzeichnen, verpixeln oder schwärzen.',
      intro: 'Fotos von Menschenmengen, Schulklassen oder Straßenszenen zeigen oft Personen, die nicht abgebildet werden wollten. Diese Seite findet Gesichter mit einem KI-Detektor und verdeckt sie per Weichzeichner, Pixelmosaik oder schwarzem Kasten. Sie können alle Gesichter auf einmal verdecken oder zuerst erkennen und nur bestimmte auswählen.',
      flowSteps: [
        { title: 'Foto hochladen', description: 'Wählen Sie ein Bild mit den Gesichtern, die geschützt werden sollen.' },
        { title: 'Stil wählen', description: 'Weichzeichnen, Verpixeln oder schwarzer Kasten. Gesichtsunschärfe ist bereits gewählt.' },
        { title: 'Erkennen und auswählen (optional)', description: 'Starten Sie die Erkennung und tippen Sie die zu verdeckenden Gesichter an, oder lassen Sie alle Gesichter aktiv.' },
        { title: 'Ergebnis herunterladen', description: 'Speichern Sie das anonymisierte Bild und prüfen Sie jedes Gesicht vor dem Veröffentlichen.' },
      ],
      faq: [
        { question: 'Findet es jedes Gesicht?', answer: 'Kein Detektor ist perfekt. Sehr kleine, seitliche, verdeckte oder schlecht beleuchtete Gesichter können übersehen werden. Prüfen Sie das Ergebnis in voller Größe.' },
        { question: 'Kann ich nur einige Gesichter verdecken?', answer: 'Ja. Starten Sie zuerst die Gesichtserkennung und wählen Sie dann die Gesichter aus. Ohne diesen Schritt werden alle erkannten Gesichter verdeckt.' },
        { question: 'Was ist am sichersten: Weichzeichnen, Verpixeln oder Kasten?', answer: 'Ein schwarzer Kasten entfernt die Pixel vollständig und ist am sichersten. Leichtes Weichzeichnen kann bei großen, scharfen Gesichtern teilweise rekonstruiert werden.' },
        { question: 'Wird mein Foto an eine fremde KI-Firma gesendet?', answer: 'Nein. Erkennung und Weichzeichnung laufen auf einem GPU-Server, den wir betreiben. Dateien werden nicht an externe KI-Anbieter weitergegeben.' },
      ],
      embed: { title: 'Gesichter in einem Foto unkenntlich machen', description: 'Laden Sie ein Foto hoch. Gesichtsunschärfe/Verpixeln ist bereits gewählt und gesperrt. Wählen Sie den Stil, erkennen Sie optional Gesichter und wählen Sie aus, welche verdeckt werden.' },
    },
    'redact-text-in-image': {
      name: 'Text im Bild schwärzen',
      h1: 'Text und persönliche Daten in einem Bild schwärzen',
      tagline: 'Finden Sie lesbaren Text in Screenshots und Fotos und verdecken Sie persönliche Angaben oder allen Text.',
      metaTitle: 'Text in einem Bild online schwärzen | Media Manipulator',
      metaDescription: 'Text in einem Bild automatisch finden und Namen, E-Mails, Nummern und andere persönliche Daten schwärzen oder weichzeichnen. KI auf unserer eigenen GPU.',
      ogTitle: 'Text und persönliche Daten in einem Bild schwärzen',
      ogDescription: 'Text in Screenshots und Fotos finden und persönliche Daten oder allen Text verdecken.',
      intro: 'Screenshots enthüllen oft mehr als gedacht: eine E-Mail-Adresse in der Ecke, eine Kontonummer in einer Tabelle, einen Namen im Chat. Diese Seite liest den Text im Bild per OCR und verdeckt ihn. Sie können sich auf persönliche Daten wie E-Mails, Telefonnummern und Kennungen beschränken oder jeden Text verdecken, per Weichzeichner oder schwarzem Kasten.',
      flowSteps: [
        { title: 'Bild hochladen', description: 'Ein Screenshot, ein gescanntes Formular oder ein Foto mit lesbarem Text.' },
        { title: 'Festlegen, was verdeckt wird', description: 'Text schwärzen ist vorgewählt; wählen Sie nur persönliche Daten oder allen Text.' },
        { title: 'Kasten oder Weichzeichner', description: 'Ein schwarzer Kasten ist die sicherere, nicht umkehrbare Option.' },
        { title: 'Prüfen und herunterladen', description: 'Lesen Sie das Ergebnis sorgfältig, dann speichern Sie es.' },
      ],
      faq: [
        { question: 'Erfasst es alle persönlichen Informationen?', answer: 'Nein. Es findet Text per OCR und erkennt Muster wie E-Mails und Nummern. Handschrift, ungewöhnliche Schriften, winziger Text und alles, was kein Text ist (etwa ein Gesicht), kann übersehen werden. Prüfen Sie das Ergebnis.' },
        { question: 'Was ist der Unterschied zwischen persönlichen Daten und allem Text?', answer: 'Der Modus für persönliche Daten verdeckt nur Text, der wie private Angaben aussieht. Der Modus für allen Text verdeckt jedes lesbare Wort, was sicherer ist, wenn man den Inhalt nicht vorhersagen kann.' },
        { question: 'Weichzeichner oder schwarzer Kasten?', answer: 'Für alles, was Sie veröffentlichen, den schwarzen Kasten. Weichgezeichneter Text lässt sich manchmal durch Schärfen rekonstruieren.' },
        { question: 'Entfernt das auch versteckte Metadaten?', answer: 'Nein, nur sichtbare Pixel werden geändert. Entfernen Sie Standort- und Kameradaten mit dem EXIF-Metadaten-Tool.' },
      ],
      embed: { title: 'Text in einem Bild schwärzen', description: 'Laden Sie einen Screenshot oder ein Foto hoch. Text/PII schwärzen ist bereits gewählt und gesperrt. Wählen Sie persönliche Daten oder allen Text sowie den Stil und starten Sie.' },
    },
    'remove-object-from-photo': {
      name: 'Objekt aus Foto entfernen',
      h1: 'Ein Objekt online aus einem Foto entfernen',
      tagline: 'Ziehen Sie einen Rahmen um das, was stören soll, und ein Inpainting-Modell füllt die Lücke passend zum Hintergrund.',
      metaTitle: 'Objekt online aus einem Foto entfernen | Media Manipulator',
      metaDescription: 'Unerwünschte Objekte aus einem Foto löschen. Zeichnen Sie ein Rechteck, und KI-Inpainting füllt die Fläche passend zum Hintergrund. Auf unserer eigenen GPU.',
      ogTitle: 'Ein Objekt online aus einem Foto entfernen',
      ogDescription: 'Zeichnen Sie einen Rahmen um ein störendes Objekt, und KI-Inpainting füllt die Fläche passend zum Hintergrund.',
      intro: 'Ein Kabel, ein Passant im Bild, ein Mülleimer am Rand einer Landschaft: kleine Störungen können ein gutes Foto verderben. Laden Sie das Foto hoch, ziehen Sie ein Rechteck über das Unerwünschte, und das LaMa-Inpainting-Modell malt diesen Bereich anhand der Umgebung neu. Am besten funktioniert das auf einfachen, gleichmäßigen Hintergründen wie Himmel, Gras, Wänden und Wasser.',
      flowSteps: [
        { title: 'Foto hochladen', description: 'Wählen Sie das Bild mit dem unerwünschten Objekt.' },
        { title: 'Rechtecke zeichnen', description: 'Ziehen Sie einen Rahmen über das Objekt. Für weitere Objekte weitere Rahmen.' },
        { title: 'KI füllt die Lücke', description: 'Das Modell malt neue Pixel, die zur Umgebung des Rahmens passen.' },
        { title: 'Herunterladen und prüfen', description: 'Zoomen Sie in den reparierten Bereich und prüfen Sie die Übergänge.' },
      ],
      faq: [
        { question: 'Wie funktioniert die Objektentfernung?', answer: 'Sie markieren einen Bereich mit einem Rechteck. Ein Inpainting-Modell erzeugt dafür neue Pixel, die zu Textur, Farben und Linien der Umgebung passen.' },
        { question: 'Welche Objekte lassen sich gut entfernen?', answer: 'Kleine bis mittelgroße Objekte auf einfachen oder sich wiederholenden Hintergründen wie Himmel, Gras, Sand, Wasser, Wänden und Böden. Komplexe Szenen und große Objekte sind schwieriger.' },
        { question: 'Warum sieht die reparierte Stelle verschmiert aus?', answer: 'Das Modell muss Details erfinden. Versuchen Sie einen engeren Rahmen, entfernen Sie das Objekt in mehreren kleineren Schritten oder wählen Sie ein Foto mit einfacherem Hintergrund.' },
        { question: 'Muss ich eine genaue Kontur zeichnen?', answer: 'Nein. Rechtecke genügen, und ein etwas größerer Rahmen als das Objekt liefert meist ein saubereres Ergebnis.' },
      ],
      embed: { title: 'Objekt aus einem Foto entfernen', description: 'Laden Sie ein Foto hoch. Objekt entfernen ist bereits gewählt und gesperrt. Zeichnen Sie ein oder mehrere Rechtecke über das Unerwünschte und starten Sie.' },
    },
    'clean-voice-audio': {
      name: 'Stimme in Audio bereinigen',
      h1: 'Sprachaufnahmen mit KI bereinigen',
      tagline: 'Machen Sie Sprache klarer, indem Sie Rauschen, Raumklang und Brummen in Podcasts, Interviews und Sprachmemos verringern.',
      metaTitle: 'Sprachaufnahmen mit KI bereinigen | Media Manipulator',
      metaDescription: 'Bereinigen Sie eine Sprachaufnahme mit KI. Weniger Rauschen, Brummen und Raumgeräusche für bessere Verständlichkeit. Läuft auf unserer eigenen GPU.',
      ogTitle: 'Sprachaufnahmen mit KI bereinigen',
      ogDescription: 'Weniger Rauschen, Brummen und Raumgeräusche für klarere Sprache in Podcasts, Interviews und Sprachmemos.',
      intro: 'Ein Sprachmemo in einer hallenden Küche, ein Podcast-Gast am Laptop-Mikrofon, eine Vorlesung von der letzten Reihe: Die Worte sind da, aber unter Rauschen und Raumklang begraben. „Stimme bereinigen“ verarbeitet die Aufnahme mit einer KI-Sprachverbesserung, die den Sprecher nach vorn holt und alles, was keine Sprache ist, dämpft. Gedacht für Sprache, nicht für Musik.',
      flowSteps: [
        { title: 'Aufnahme hochladen', description: 'Sprachmemos, Interviews, Podcast-Takes oder Vorlesungsmitschnitte.' },
        { title: 'Stimme bereinigen ist voreingestellt', description: 'Kein Menü: Die Seite ist bereits auf die Sprachbereinigung eingestellt.' },
        { title: 'KI verbessert die Sprache', description: 'Das Modell trennt die Stimme von störenden Geräuschen und gleicht sie neu ab.' },
        { title: 'Bereinigtes Audio herunterladen', description: 'Hören Sie vor der Verwendung mit Kopfhörern Probe.' },
      ],
      faq: [
        { question: 'Entfernt es allen Hintergrundlärm?', answer: 'Es reduziert gleichmäßige Geräusche wie Rauschen, Brummen und Raumklang deutlich. Plötzliche Geräusche, andere Stimmen und Musik sind schwieriger; die Ergebnisse hängen von der Aufnahme ab.' },
        { question: 'Kann es ein schlechtes Mikrofon professionell klingen lassen?', answer: 'Es macht Sprache klarer, kann aber keine Qualität hinzufügen, die nie aufgenommen wurde. Verzerrungen oder starkes Übersteuern lassen sich nicht ganz beheben.' },
        { question: 'Was unterscheidet das vom Entfernen von Hintergrundgeräuschen?', answer: 'Stimme bereinigen verbessert die Sprache selbst, das andere Tool senkt vor allem das Rauschen um sie herum. Passt eines nicht zu Ihrer Aufnahme, probieren Sie das andere.' },
        { question: 'Funktioniert es bei Musik?', answer: 'Es ist auf Sprache abgestimmt und kann Musik beschädigen. Für Gesang nutzen Sie die Tools zum Isolieren oder Entfernen von Vocals.' },
      ],
      embed: { title: 'Sprachaufnahme bereinigen', description: 'Laden Sie eine Aufnahme hoch. „Stimme bereinigen“ wird bereits angewendet, es gibt kein Operationsmenü. Wählen Sie bei Bedarf ein Ausgabeformat und starten Sie.' },
    },
    'remove-background-noise': {
      name: 'Hintergrundgeräusche entfernen',
      h1: 'Hintergrundgeräusche aus Audio online entfernen',
      tagline: 'Verringern Sie Rauschen, Brummen, Verkehr und Raumgeräusche mit einem KI-Entrauscher, ohne das Hauptsignal zu verlieren.',
      metaTitle: 'Hintergrundgeräusche aus Audio online entfernen | Media Manipulator',
      metaDescription: 'Hintergrundgeräusche aus Audio entfernen. Ein KI-Entrauscher senkt Rauschen, Brummen und Umgebungsgeräusche. Läuft auf unserer eigenen GPU.',
      ogTitle: 'Hintergrundgeräusche aus Audio online entfernen',
      ogDescription: 'Ein KI-Entrauscher, der Rauschen, Brummen, Verkehr und Raumgeräusche in Aufnahmen senkt.',
      intro: 'Klimaanlagen, Computerlüfter, Straßenverkehr und Netzbrummen sind gleichmäßige Geräusche unter dem, was Sie eigentlich aufnehmen wollten. Diese Seite wendet ein KI-Entrauschungsmodell an, das diese Geräuschschicht senkt, damit das Hauptsignal besser zu hören ist. Geeignet für Interviews, Sprecheraufnahmen, Feldaufnahmen und Tonspuren aus Videos.',
      flowSteps: [
        { title: 'Audio hochladen', description: 'Jede gängige Audiodatei, auch aus einem Video extrahiertes Audio.' },
        { title: 'Entrauschen ist vorgewählt', description: 'Der KI-Vorgang steht bereits auf „Hintergrundgeräusche entfernen“.' },
        { title: 'KI senkt das Rauschen', description: 'Das Modell trennt gleichmäßiges Rauschen vom Vordergrundsignal.' },
        { title: 'Herunterladen und vergleichen', description: 'Hören Sie das Ergebnis neben dem Original, bevor Sie es verwenden.' },
      ],
      faq: [
        { question: 'Welche Geräusche werden am besten behandelt?', answer: 'Gleichmäßige Geräusche: Rauschen, Brummen, Lüfter, Klimaanlage, Raumklang und konstanter Verkehr. Plötzliche Knalle, überlappende Gespräche und Musik sind viel schwerer zu entfernen.' },
        { question: 'Klingt meine Stimme danach anders?', answer: 'Möglicherweise etwas. Starkes Entrauschen kann Stimmen dünner oder leicht bearbeitet klingen lassen, daher sollten Sie mit dem Original vergleichen.' },
        { question: 'Kann ich es für ein Video nutzen?', answer: 'Extrahieren Sie zuerst das Audio, entrauschen Sie es hier und fügen Sie es dann mit dem Tool „Audio zu Video“ wieder ein.' },
        { question: 'Welches Ausgabeformat soll ich wählen?', answer: 'WAV behält die volle Qualität für weitere Bearbeitung. MP3 ist kleiner zum Teilen. Wenn Sie weiter bearbeiten, wählen Sie jetzt WAV und komprimieren zum Schluss.' },
      ],
      embed: { title: 'Hintergrundgeräusche entfernen', description: 'Laden Sie eine Aufnahme hoch. „Hintergrundgeräusche entfernen“ ist bereits für Sie gewählt. Sie können das Ausgabeformat ändern und dann starten.' },
    },
    'remove-vocals-from-song': {
      name: 'Gesang aus Song entfernen',
      h1: 'Gesang aus einem Song entfernen: Instrumental oder Karaoke',
      tagline: 'Entfernen Sie den Gesang und behalten Sie die Musik, für Karaoke, Üben und Backing-Tracks. Nur für Musik, an der Sie die Rechte haben.',
      metaTitle: 'Gesang aus Song entfernen: Karaoke-Maker | Media Manipulator',
      metaDescription: 'Entfernen Sie Gesang aus einem Song mit KI und laden Sie das Instrumental im selben Format wie Ihre Datei herunter, oder als FLAC oder WAV. Karaoke und Übungstracks auf unserer eigenen GPU.',
      ogTitle: 'Gesang aus einem Song für Karaoke entfernen',
      ogDescription: 'Entfernen Sie den Gesang mit KI und laden Sie das Instrumental als MP3, FLAC oder WAV herunter.',
      intro: 'Karaoke-Abende, Gesangsübungen und Cover brauchen dasselbe: die Band ohne Sänger. Ein KI-Modell zur Quellentrennung teilt den fertigen Mix in Gesang und Begleitung, und diese Seite liefert die Begleitung. Das Instrumental kommt im selben Format wie Ihre Datei, eine MP3 bleibt also eine kompakte MP3; wählen Sie FLAC oder WAV, wenn Sie eine verlustfreie Datei zum Bearbeiten möchten.',
      flowSteps: [
        { title: 'Song hochladen', description: 'Verwenden Sie einen Titel, den Sie besitzen oder nutzen dürfen.' },
        { title: 'Gesang entfernen ist voreingestellt', description: 'Kein Menü; die Seite ist bereits auf das Entfernen des Gesangs eingestellt.' },
        { title: 'KI teilt den Mix', description: 'Das Modell schätzt Gesang und Begleitung getrennt.' },
        { title: 'Instrumental herunterladen', description: 'Speichern Sie es im gewählten Format; die Größenschätzung sehen Sie vor dem Start.' },
      ],
      faq: [
        { question: 'Ist der Gesang dann komplett weg?', answer: 'Meist der Hauptgesang, aber nicht immer alles. Hallfahnen, Background-Chor und Übersprechen können bleiben; die Ergebnisse hängen vom Song ab.' },
        { question: 'Welches Format hat das Instrumental?', answer: 'Standardmäßig dasselbe wie Ihre Datei: Eine MP3 kommt als MP3 mit 320 kbps zurück, eine verlustfreie Datei (WAV, FLAC, AIFF) als FLAC. Unter „Ausgabeformat“ können Sie stattdessen FLAC oder WAV (verlustfrei) oder MP3 wählen; jede Option zeigt ihre geschätzte Größe.' },
        { question: 'Kann ich das bei jedem Song nutzen?', answer: 'Nur bei Musik, die Sie besitzen, für die Sie eine Lizenz haben oder die Sie nach dem Recht Ihres Landes nutzen dürfen. Für die Verwendung des Ergebnisses sind Sie verantwortlich.' },
        { question: 'Wie bekomme ich stattdessen nur den Gesang?', answer: 'Nutzen Sie die Seite „Gesang aus Song isolieren“, die die Gesangsspur statt des Instrumentals liefert.' },
      ],
      embed: { title: 'Gesang aus einem Song entfernen', description: 'Laden Sie einen Song hoch. „Gesang entfernen“ ist bereits gewählt; das Instrumental kommt im selben Format wie Ihre Datei (eine MP3 bleibt MP3). Wählen Sie unter „Ausgabeformat“ FLAC oder WAV für verlustfreie Qualität. Starten Sie die Umwandlung.' },
    },
    // 2026-10-28 catalog expansion: name + tagline for the /tools catalog cards (model-written, needs native review).
    'inspect-metadata': {
      name: 'Metadaten-Prüfer',
      tagline:
        'Sehen Sie jedes Tag, das in einem Foto, Video, einer Audiodatei oder einem PDF steckt: EXIF, GPS-Standort, Kamera, Codecs, ID3, XMP und mehr, bevor Sie die Datei teilen.',
    },
    'edit-image-metadata': {
      name: 'Bild-Metadaten bearbeiten',
      tagline:
        'Legen Sie Titel, Autor, Copyright, Schlagwörter und Beschreibung eines Fotos fest, korrigieren oder entfernen Sie den GPS-Standort und schreiben Sie EXIF- und IPTC-Tags neu.',
    },
    'change-video-speed': {
      name: 'Videogeschwindigkeit ändern',
      tagline:
        'Erstellen Sie einen Zeitraffer mit 2x, 4x oder schneller oder verlangsamen Sie einen Clip auf 0.5x oder 0.25x, mit synchron bleibendem Ton.',
    },
    'reverse-video': {
      name: 'Video rückwärts abspielen',
      tagline:
        'Spielen Sie jeden Clip rückwärts ab, mit oder ohne umgekehrten Ton, und lassen Sie ihn auf Wunsch im Ping-Pong-Stil erst vor- und dann zurücklaufen.',
    },
    'flip-video': {
      name: 'Video spiegeln & drehen',
      tagline:
        'Spiegeln Sie ein Video horizontal, um eine seitenverkehrte Webcam oder ein Selfie zu korrigieren, oder kippen Sie es vertikal, mit einem Klick.',
    },
    'stabilize-video': {
      name: 'Video stabilisieren',
      tagline:
        'Glätten Sie Handverwackelungen und Gehschwankungen mit einem Zwei-Pass-Stabilisator, ohne Stativ und ohne Desktop-Editor.',
    },
    'change-video-frame-rate': {
      name: 'Videobildrate ändern',
      tagline:
        'Wandeln Sie ein Video in 24, 25, 30 oder 60 fps um, reduzieren Sie einen 60-fps-Clip für eine kleinere Datei auf 30 oder passen Sie die Bildrate eines Projekts an.',
    },
    'adjust-video-color': {
      name: 'Videohelligkeit & -farbe anpassen',
      tagline:
        'Hellen Sie einen dunklen Clip auf, ergänzen Sie Kontrast und Sättigung, verschieben Sie den Farbton oder wenden Sie Unschärfe oder einen künstlerischen Look an, mit Reglern und Live-Vorschau.',
    },
    'convert-video-to-hevc': {
      name: 'Video in HEVC (H.265) umwandeln',
      tagline:
        'Kodieren Sie jedes Video als H.265 neu: bei gleicher Qualität ist die Datei etwa halb so groß wie mit H.264, ideal für Archivierung, 4K und moderne Geräte.',
    },
    'convert-audio-to-wav': {
      name: 'Audio in WAV umwandeln',
      tagline:
        'Wandeln Sie MP3, M4A, WAV, OGG, FLAC und jede andere Audiodatei verlustfrei in WAV um.',
    },
    'convert-audio-to-flac': {
      name: 'Audio in FLAC umwandeln',
      tagline:
        'Wandeln Sie MP3, M4A, WAV, OGG, FLAC und jede andere Audiodatei verlustfrei in FLAC um.',
    },
    'convert-audio-to-ogg': {
      name: 'Audio in OGG umwandeln',
      tagline:
        'Wandeln Sie MP3, M4A, WAV, OGG, FLAC und jede andere Audiodatei in OGG mit der von Ihnen gewählten Bitrate um.',
    },
    'convert-audio-to-m4a': {
      name: 'Audio in M4A / AAC umwandeln',
      tagline:
        'Wandeln Sie MP3, M4A, WAV, OGG, FLAC und jede andere Audiodatei in M4A / AAC mit der von Ihnen gewählten Bitrate um.',
    },
    'convert-audio-to-opus': {
      name: 'Audio in Opus umwandeln',
      tagline:
        'Wandeln Sie MP3, M4A, WAV, OGG, FLAC und jede andere Audiodatei in Opus mit der von Ihnen gewählten Bitrate um.',
    },
    'convert-mp3-to-wav': {
      name: 'MP3 in WAV umwandeln',
      tagline:
        'Wandeln Sie eine MP3 in eine unkomprimierte WAV-Datei um, zum Bearbeiten, Sampeln oder Brennen auf CD.',
    },
    'change-audio-speed': {
      name: 'Audiogeschwindigkeit ändern',
      tagline:
        'Beschleunigen Sie eine Vorlesung oder einen Podcast auf 1.5x oder verlangsamen Sie einen Song oder eine Aufnahme zum Üben auf 0.75x, ohne die Tonhöhe zu ändern.',
    },
    'change-audio-pitch': {
      name: 'Tonhöhe ändern',
      tagline:
        'Verschieben Sie einen Song oder eine Aufnahme um Halbtöne, um die Tonart zu ändern, einen Gesang abzusenken oder ein Sample zu stimmen, bei gleichbleibendem Tempo.',
    },
    'normalize-audio': {
      name: 'Audio normalisieren',
      tagline:
        'Heben Sie eine leise Aufnahme auf eine einheitliche Lautheit an, damit Podcasts, Sprachmemos und gemischte Playlists gleich laut abgespielt werden.',
    },
    'adjust-audio-volume': {
      name: 'Audiolautstärke anpassen',
      tagline:
        'Machen Sie eine Audiodatei um einen festen Betrag lauter oder leiser, von 10 Prozent bis zum Doppelten, oder in Dezibel mit dem Verstärkungsregler.',
    },
    'audio-equalizer': {
      name: 'Audio-Equalizer',
      tagline:
        'Wenden Sie Bassanhebung, Höhenanhebung, Stimmpräsenz oder ein Genre-Preset an oder stellen Sie Tiefpass- und Hochpassfilter ein, und laden Sie das Ergebnis herunter.',
    },
    'add-reverb-to-audio': {
      name: 'Hall zu Audio hinzufügen',
      tagline:
        'Versetzen Sie einen trockenen Gesang oder eine Aufnahme in einen Raum-, Hallen-, Platten- oder Federhall oder fügen Sie Delay oder Echo hinzu, und laden Sie das Ergebnis herunter.',
    },
    'trim-audio': {
      name: 'Audio schneiden',
      tagline:
        'Schneiden Sie eine MP3, WAV oder jede andere Aufnahme auf eine Start- und Endzeit zu, mit Wellenform zur Wahl der Punkte, und laden Sie nur diesen Teil herunter.',
    },
    'transcribe-audio': {
      name: 'Audio transkribieren',
      tagline:
        'Wandeln Sie eine MP3, WAV, M4A oder jede andere Aufnahme mit KI-Spracherkennung auf unseren eigenen GPU-Servern in Text, Untertitel oder JSON um.',
    },
    'add-text-to-image': {
      name: 'Text zu Bild hinzufügen',
      tagline:
        'Setzen Sie eine Bildunterschrift, einen Titel oder ein Wasserzeichen auf ein Foto: Wählen Sie Schriftart, Größe, Farbe, Kontur und Position und laden Sie es herunter.',
    },
    'crop-image': {
      name: 'Bild zuschneiden',
      tagline:
        'Ziehen Sie einen Rahmen über den gewünschten Teil eines Fotos, richten Sie den Ausschnitt gerade aus und laden Sie nur diesen Bereich in jedem Format herunter.',
    },
    'grayscale-image': {
      name: 'Bild in Schwarzweiß umwandeln',
      tagline:
        'Wandeln Sie ein Farbfoto in Graustufen oder in Sepia für einen Vintage-Ton um und laden Sie es in jedem Format herunter.',
    },
    'image-filters': {
      name: 'Bildfilter & Effekte',
      tagline:
        'Ölgemälde, Skizze, Kohle, Prägung, Vintage, Strudel, Unschärfe, Schärfen und mehr, mit einem Klick auf jedes Foto angewendet.',
    },
    'rotate-image': {
      name: 'Bild drehen',
      tagline:
        'Drehen Sie ein Foto um 90°, 180° oder 270°, korrigieren Sie einen seitlich eingescannten Scan oder ein Handyfoto und laden Sie es in jedem Format herunter.',
    },
    'sharpen-image': {
      name: 'Bild schärfen',
      tagline:
        'Holen Sie die Kanten eines leicht weichen Fotos oder Scans mit einem Klick heraus und laden Sie es in jedem Format herunter.',
    },
    'blur-image': {
      name: 'Bild weichzeichnen',
      tagline:
        'Zeichnen Sie ein ganzes Foto weich, für einen Hintergrund, einen Platzhalter oder einen Sichtschutz, und laden Sie es in jedem Format herunter.',
    },
    'generate-vtt-captions': {
      name: 'VTT-Untertitel-Generator',
      tagline:
        'Erstellen Sie eine .vtt-Untertiteldatei für HTML5-Video, YouTube oder einen Player mit KI-Transkription auf unseren eigenen GPU-Servern.',
    },
    // MM75: summarize-video / summarize-audio full page bodies (model-written, needs native review).
    'summarize-video': {
      name: 'Video zusammenfassen',
      h1: 'Video mit KI zusammenfassen: Kapitel, Themen und Text im Bild',
      tagline: 'Erhalten Sie eine schriftliche Zusammenfassung von Vorlesung, Besprechung oder Tutorial – mit anklickbaren Kapiteln, Themen und Text im Bild, erstellt auf unseren eigenen GPU-Servern.',
      metaTitle: 'KI-Videozusammenfassung mit Kapiteln | Media Manipulator',
      metaDescription: 'Laden Sie ein Video hoch und erhalten Sie eine schriftliche Zusammenfassung mit Kapiteln samt Zeitmarken, Themen und dem im Bild gezeigten Text. Die KI läuft auf unseren eigenen GPU-Servern, nie bei einer fremden KI. Kostenloses Konto erforderlich.',
      ogTitle: 'Video mit KI zusammenfassen',
      ogDescription: 'Eine schriftliche Zusammenfassung mit anklickbaren Kapiteln, Themen und Text im Bild. Kostenloses Konto erforderlich.',
      embed: {
        title: 'Video zusammenfassen',
        description: 'Melden Sie sich an, laden Sie ein Video (oder eine Audiodatei) hoch und wählen Sie die Sprache der Zusammenfassung. Sie erhalten einen Titel, eine kurze Zusammenfassung, Kapitel, die zur jeweiligen Stelle in Ihrem Video springen, die Themen und den Text, der im Bild erscheint.',
      },
      intro: 'Niemand möchte eine Stunde Besprechung oder Vorlesung noch einmal ansehen, nur um die fünf wichtigen Minuten zu finden. Media Manipulator sieht und hört für Sie zu: Es transkribiert die Sprache mit Whisper, betrachtet mit einem Bildmodell Einzelbilder, die an Bildwechseln ausgewählt werden, und schreibt aus beidem eine Zusammenfassung – alles auf einem GPU-Server, den wir selbst betreiben. Das Ergebnis ist ein kurzes Dokument: ein Titel, einige Sätze, Kapitel mit Start- und Endzeit, die Themen und der Text, der im Bild erschien. Klicken Sie auf ein Kapitel, um zu dieser Stelle in Ihrem Video zu springen, kopieren Sie das Ganze als Markdown oder laden Sie es als Markdown oder JSON herunter. Für Zusammenfassungen ist ein kostenloses Konto nötig.',
      whatItDoes: [
        'Schreibt einen Titel und eine Zusammenfassung des gesamten Videos in drei bis sechs Sätzen.',
        'Teilt das Video in Kapitel mit Start- und Endzeit; ein Klick lässt den Player zur jeweiligen Stelle springen.',
        'Listet die Themen und den Text im Bild auf, mit der Zeit seines ersten Erscheinens.',
        'Beschreibt Bild und Sprache und vermerkt, was nicht möglich war (zum Beispiel: keine Sprache).',
        'Schreibt die Zusammenfassung in der Sprache Ihrer Wahl oder in der gesprochenen Sprache.',
      ],
      flowSteps: [
        {
          title: 'Anmelden',
          description: 'Ein kostenloses Konto genügt.',
        },
        {
          title: 'Hochladen',
          description: 'Ein Video oder eine Audiodatei.',
        },
        {
          title: 'Zusammenfassen',
          description: 'Sprache und Einzelbilder werden auf unserem GPU-Server analysiert.',
        },
        {
          title: 'Lesen',
          description: 'Kapitel anklicken, Markdown kopieren, .md oder .json herunterladen.',
        },
      ],
      advancedDetails: [
        'Die Sprache wird mit Whisper transkribiert; Einzelbilder werden an Szenenwechseln ausgewählt, bis zum Bildkontingent Ihres Tarifs (24 bei Free, 48 bei Premium, 96 bei Pro), und stapelweise von einem Bildmodell beschrieben.',
        'Ein Sprachmodell schreibt die Zusammenfassung aus dem Transkript und den Bildnotizen. Pro-Konten können, sofern verfügbar, eine ausführlichere Zusammenfassung von einem größeren Modell anfordern.',
        'Eine Zusammenfassung zählt als ein KI-Job Ihres Tageskontingents; ein fehlgeschlagener oder abgelehnter Job wird nicht angerechnet.',
        'Das Transkript wird maschinell erstellt, daher können Namen und Zahlen falsch sein. Die Zusammenfassung weist in ihren Hinweisen darauf hin.',
      ],
      whyItMatters: [
        'Eine Zusammenfassung mit Kapiteln ist in einer Minute überflogen; das Video nicht.',
        'Anklickbare Zeitmarken führen Sie direkt zu der Stelle, die Sie brauchen.',
        'Text im Bild erfasst Folientitel und Untertitel, die in der Sprache nie ausgesprochen werden.',
      ],
      useCases: [
        {
          title: 'Besprechungsprotokoll',
          description: 'Entscheidungen und Themen, mit Zeitangaben zum Nachprüfen der Details.',
        },
        {
          title: 'Vorlesungsmitschrift',
          description: 'Kapitel pro Abschnitt und der Folientext zum Lernen.',
        },
        {
          title: 'Tutorial-Gliederung',
          description: 'Die Schritte als Kapitel, damit Sie direkt zum gewünschten springen können.',
        },
        {
          title: 'Interview-Überblick',
          description: 'Was besprochen wurde und wo.',
        },
      ],
      whyMediaManipulator: [
        'Whisper sowie die Bild- und Sprachmodelle laufen auf Hardware, die wir betreiben; Ihr Video wird nie an eine fremde KI gesendet.',
        'Kapitel, die in Ihrem eigenen Video springen, direkt in der Ergebnisansicht.',
        'Downloads als Markdown und JSON. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ],
      privacyNote: 'Für Zusammenfassungen ist ein kostenloses Konto nötig, daher wird der Job diesem zugeordnet. Ihre Datei wird auf unseren eigenen Servern verarbeitet, und die KI-Modelle laufen auf einem GPU-Server, den wir betreiben; es wird nichts an einen externen KI-Anbieter gesendet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      faq: [
        {
          question: 'Brauche ich ein Konto?',
          answer: 'Ja, ein kostenloses Konto. Für Zusammenfassungen laufen mehrere KI-Modelle auf unserem GPU-Server, daher sind sie angemeldeten Nutzern vorbehalten.',
        },
        {
          question: 'Was erhalte ich?',
          answer: 'Einen Titel, eine kurze Zusammenfassung, Kapitel mit Start- und Endzeit, Themen, Text im Bild mit Zeitangaben, eine Beschreibung von Bild und Sprache sowie Hinweise zu allem, was nicht möglich war.',
        },
        {
          question: 'Kann ich die Sprache der Zusammenfassung wählen?',
          answer: 'Ja. Wählen Sie eine der 18 Sprachen der Website oder „wie die gesprochene Sprache“, um sie in der gesprochenen Sprache zu verfassen.',
        },
        {
          question: 'Was ist, wenn das Video keine Sprache enthält?',
          answer: 'Die Zusammenfassung wird allein aus dem Bild erstellt und weist in ihren Hinweisen darauf hin. Eine Datei ohne Bild und Ton wird abgelehnt und nicht angerechnet.',
        },
        {
          question: 'Wird mein Video an Dritte gesendet?',
          answer: 'Nein. Jedes Modell läuft auf einem GPU-Server, den wir betreiben.',
        },
        {
          question: 'Wird das auf mein Kontingent angerechnet?',
          answer: 'Ja, als ein KI-Job. Fehlgeschlagene Jobs werden nicht angerechnet.',
        },
      ],
      related: [
        {
          label: 'Audio zusammenfassen',
          to: '/tools/summarize-audio',
          description: 'Für Podcasts und Aufnahmen.',
        },
        {
          label: 'Video transkribieren',
          to: '/tools/transcribe-video',
          description: 'Das vollständige Transkript.',
        },
        {
          label: 'Audio transkribieren',
          to: '/tools/transcribe-audio',
          description: 'Für Audiodateien.',
        },
        {
          label: 'Hintergrundgeräusche entfernen',
          to: '/tools/remove-background-noise',
          description: 'Bereinigen Sie zuerst das Audio.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Zählt als ein KI-Job; fehlgeschlagene Jobs werden nicht angerechnet.',
          'Länge bis zur Videodauergrenze Ihres Tarifs.',
        ],
      },
    },
    'summarize-audio': {
      name: 'Audio zusammenfassen',
      h1: 'Audioaufnahme mit KI zusammenfassen',
      tagline: 'Machen Sie aus Podcast, Interview oder Sprachmemo eine schriftliche Zusammenfassung mit Kapiteln und Themen, erstellt auf unseren eigenen GPU-Servern.',
      metaTitle: 'KI-Audiozusammenfassung mit Kapiteln | Media Manipulator',
      metaDescription: 'Laden Sie eine MP3-, WAV- oder M4A-Datei hoch und erhalten Sie eine schriftliche Zusammenfassung mit Kapiteln samt Zeitmarken und Themen. Whisper und das Sprachmodell laufen auf unseren eigenen GPU-Servern. Kostenloses Konto erforderlich.',
      ogTitle: 'Audioaufnahme mit KI zusammenfassen',
      ogDescription: 'Eine schriftliche Zusammenfassung mit Kapiteln und Themen für jede Aufnahme. Kostenloses Konto erforderlich.',
      embed: {
        title: 'Audiodatei zusammenfassen',
        description: 'Melden Sie sich an, laden Sie eine Aufnahme hoch und wählen Sie die Sprache der Zusammenfassung. Sie erhalten einen Titel, eine kurze Zusammenfassung, Kapitel, die zur jeweiligen Stelle in Ihrer Aufnahme springen, und die Themen.',
      },
      intro: 'Eine Podcast-Folge, ein Interview oder ein langes Sprachmemo lässt sich als Seite leichter nutzen denn als Stunde Audio. Media Manipulator transkribiert die Aufnahme mit Whisper und lässt ein Sprachmodell daraus eine Zusammenfassung schreiben, beides auf einem GPU-Server, den wir selbst betreiben. Sie erhalten einen Titel, einige Sätze, Kapitel mit Start- und Endzeit und die Themen. Klicken Sie auf ein Kapitel, um zu dieser Stelle in der Aufnahme zu springen, kopieren Sie die Zusammenfassung als Markdown oder laden Sie sie als Markdown oder JSON herunter. Für Zusammenfassungen ist ein kostenloses Konto nötig.',
      whatItDoes: [
        'Schreibt einen Titel und eine kurze Zusammenfassung der Aufnahme.',
        'Teilt sie in Kapitel mit Zeitangaben; ein Klick lässt den Player dorthin springen.',
        'Listet die Themen auf und beschreibt, wer spricht und in welchem Ton.',
        'Schreibt die Zusammenfassung in der Sprache Ihrer Wahl oder in der gesprochenen Sprache.',
      ],
      flowSteps: [
        {
          title: 'Anmelden',
          description: 'Ein kostenloses Konto genügt.',
        },
        {
          title: 'Hochladen',
          description: 'MP3, WAV, M4A und andere Audioformate.',
        },
        {
          title: 'Zusammenfassen',
          description: 'Whisper und ein Sprachmodell auf unserem GPU-Server.',
        },
        {
          title: 'Lesen',
          description: 'Kapitel anklicken, Markdown kopieren, .md oder .json herunterladen.',
        },
      ],
      advancedDetails: [
        'Die Sprache wird mit Whisper transkribiert; ein Sprachmodell schreibt die Zusammenfassung aus dem Transkript.',
        'Eine Audiodatei mit Cover wird als Audio behandelt: Das Bild wird ignoriert.',
        'Eine Zusammenfassung zählt als ein KI-Job Ihres Tageskontingents; ein fehlgeschlagener oder abgelehnter Job wird nicht angerechnet.',
        'Das Transkript wird maschinell erstellt, daher können Namen und Zahlen falsch sein. Die Zusammenfassung weist in ihren Hinweisen darauf hin.',
      ],
      whyItMatters: [
        'Eine Zusammenfassung lesen Sie in einer Minute und entscheiden dann, was Sie anhören.',
        'Kapitel mit Zeitangaben machen aus einer langen Aufnahme etwas, in dem Sie navigieren können.',
        'Themen machen einen Fundus älterer Folgen durchsuchbar.',
      ],
      useCases: [
        {
          title: 'Podcast-Shownotes',
          description: 'Kapitel und Themen für die Folgenseite.',
        },
        {
          title: 'Interview-Rückblick',
          description: 'Was behandelt wurde, mit Zeitangaben zum Zitieren.',
        },
        {
          title: 'Sprachmemo zu Notizen',
          description: 'Ein ausuferndes Memo als kurze Seite.',
        },
        {
          title: 'Gesprächszusammenfassung',
          description: 'Die Kernpunkte eines aufgezeichneten Anrufs.',
        },
      ],
      whyMediaManipulator: [
        'Whisper und das Sprachmodell laufen auf Hardware, die wir betreiben; Ihre Aufnahme wird nie an eine fremde KI gesendet.',
        'Kapitel, die in Ihrer eigenen Aufnahme springen, direkt in der Ergebnisansicht.',
        'Downloads als Markdown und JSON. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ],
      privacyNote: 'Für Zusammenfassungen ist ein kostenloses Konto nötig, daher wird der Job diesem zugeordnet. Ihre Datei wird auf unseren eigenen Servern verarbeitet, und die KI-Modelle laufen auf einem GPU-Server, den wir betreiben; es wird nichts an einen externen KI-Anbieter gesendet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      faq: [
        {
          question: 'Brauche ich ein Konto?',
          answer: 'Ja, ein kostenloses Konto. Für Zusammenfassungen laufen KI-Modelle auf unserem GPU-Server, daher sind sie angemeldeten Nutzern vorbehalten.',
        },
        {
          question: 'Worin unterscheidet sich das von einer Transkription?',
          answer: 'Eine Transkription liefert jedes Wort. Eine Zusammenfassung liefert einen Titel, einige Sätze, Kapitel und Themen, geschrieben aus diesem Transkript.',
        },
        {
          question: 'Kann ich die Sprache der Zusammenfassung wählen?',
          answer: 'Ja. Wählen Sie eine der 18 Sprachen der Website oder „wie die gesprochene Sprache“.',
        },
        {
          question: 'Wird meine Aufnahme an Dritte gesendet?',
          answer: 'Nein. Die Modelle laufen auf einem GPU-Server, den wir betreiben.',
        },
        {
          question: 'Wird das auf mein Kontingent angerechnet?',
          answer: 'Ja, als ein KI-Job. Fehlgeschlagene Jobs werden nicht angerechnet.',
        },
      ],
      related: [
        {
          label: 'Audio transkribieren',
          to: '/tools/transcribe-audio',
          description: 'Jedes Wort, als Text oder Untertitel.',
        },
        {
          label: 'Video zusammenfassen',
          to: '/tools/summarize-video',
          description: 'Ergänzt Bild und Text im Bild.',
        },
        {
          label: 'Hintergrundgeräusche entfernen',
          to: '/tools/remove-background-noise',
          description: 'Bereinigen Sie zuerst das Audio.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Zählt als ein KI-Job; fehlgeschlagene Jobs werden nicht angerechnet.',
        ],
      },
    },
    // MM78 voices: name + tagline (model-written, needs native review).
    'voice-cloning': {
      name: 'Stimmklonen',
      tagline:
        'Nehmen Sie 5 bis 60 Sekunden Ihrer eigenen Sprache auf oder laden Sie sie hoch, erstellen Sie eine Stimme und lassen Sie sie beliebige Texte in mehr als zwanzig Sprachen vorlesen.',
    },
    'voice-designer': {
      name: 'Stimmdesigner',
      tagline:
        'Beschreiben Sie eine Stimme in Worten, hören Sie sich eine Vorschau an und behalten Sie die, die beliebige Texte in mehr als zwanzig Sprachen vorlesen soll.',
    },
    'voice-changer': {
      name: 'Stimmwechsler',
      tagline:
        'Verschieben Sie Tonhöhe und Charakter einer Aufnahme sofort oder wandeln Sie die Sprache mithilfe von KI in eine gespeicherte oder voreingestellte Stimme um.',
    },
  },
} as const;

export default deToolPages;
