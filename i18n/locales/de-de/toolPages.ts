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
      metaDescription: 'Entfernen Sie Gesang aus einem Song mit KI und laden Sie das Instrumental als WAV herunter. Karaoke und Übungstracks auf unserer eigenen GPU.',
      ogTitle: 'Gesang aus einem Song für Karaoke entfernen',
      ogDescription: 'Entfernen Sie den Gesang mit KI und laden Sie das Instrumental als verlustfreie WAV-Datei herunter.',
      intro: 'Karaoke-Abende, Gesangsübungen und Cover brauchen dasselbe: die Band ohne Sänger. Ein KI-Modell zur Quellentrennung teilt den fertigen Mix in Gesang und Begleitung, und diese Seite liefert die Begleitung. Das Instrumental kommt als verlustfreie WAV-Datei, die Sie bearbeiten oder selbst in MP3 umwandeln können.',
      flowSteps: [
        { title: 'Song hochladen', description: 'Verwenden Sie einen Titel, den Sie besitzen oder nutzen dürfen.' },
        { title: 'Gesang entfernen ist voreingestellt', description: 'Kein Menü; die Seite ist bereits auf das Entfernen des Gesangs eingestellt.' },
        { title: 'KI teilt den Mix', description: 'Das Modell schätzt Gesang und Begleitung getrennt.' },
        { title: 'Instrumental herunterladen', description: 'Speichern Sie die WAV-Datei oder wandeln Sie sie für das Handy in MP3 um.' },
      ],
      faq: [
        { question: 'Ist der Gesang dann komplett weg?', answer: 'Meist der Hauptgesang, aber nicht immer alles. Hallfahnen, Background-Chor und Übersprechen können bleiben; die Ergebnisse hängen vom Song ab.' },
        { question: 'Warum ist die Ausgabe eine WAV-Datei?', answer: 'WAV ist verlustfrei, das Instrumental behält also alle Details für die Bearbeitung. Sie ist größer als MP3; wandeln Sie sie danach um, wenn Sie etwas Kleineres wollen.' },
        { question: 'Kann ich das bei jedem Song nutzen?', answer: 'Nur bei Musik, die Sie besitzen, für die Sie eine Lizenz haben oder die Sie nach dem Recht Ihres Landes nutzen dürfen. Für die Verwendung des Ergebnisses sind Sie verantwortlich.' },
        { question: 'Wie bekomme ich stattdessen nur den Gesang?', answer: 'Nutzen Sie die Seite „Gesang aus Song isolieren“, die die Gesangsspur statt des Instrumentals liefert.' },
      ],
      embed: { title: 'Gesang aus einem Song entfernen', description: 'Laden Sie einen Song hoch. „Gesang entfernen“ ist bereits gewählt; das Instrumental kommt als WAV, verlustfrei, aber größer. Starten Sie die Umwandlung.' },
    },
  },
} as const;

export default deToolPages;
