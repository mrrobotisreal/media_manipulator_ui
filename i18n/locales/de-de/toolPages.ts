/**
 * German partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope: MM86 (2026-10-29) added full bodies (h1, intro, sections, worked
 * examples, FAQ, related, embed) for the 24 copy-bar pages
 * (`REVIEW_CATALOG_SLUGS`), model-written by Fable 5.1 from MM84's English;
 * the other slugs keep `name` + `tagline` only (the fields surfaced on the
 * home page's "Popular conversions" grid and the /tools index).
 *
 * Register: formal "Sie"; brand names, formats and codecs stay untranslated;
 * "Darkroom" stays "Darkroom".
 */

const deToolPages = {
  pages: {
    // MM48: Motion's full page body (model-written, needs native review). The brand stays "Motion".
    motion: {
      name: 'Motion',
      h1: 'Motion',
      tagline: 'Zeichnen oder importieren Sie ein SVG, animieren Sie es auf einer Keyframe-Zeitleiste und exportieren Sie animiertes SVG, Lottie, React, JavaScript, Flutter oder GIF, alles in Ihrem Browser.',
      metaTitle: 'Motion: Kostenloser SVG-Animationseditor | Media Manipulator',
      metaDescription: 'Animieren Sie SVG im Browser: Keyframes, Easing, Holds, Konturzeichnung, Bewegungspfade und Morphing. Export als animiertes SVG, Lottie JSON, React, JS, Flutter oder GIF.',
      ogTitle: 'Motion: SVG in Ihrem Browser animieren',
      ogDescription: 'Importieren oder zeichnen Sie ein SVG, animieren Sie es auf einer Keyframe-Zeitleiste und exportieren Sie animiertes SVG, Lottie JSON, React, JavaScript, Flutter oder GIF. Exporte werden in Ihrem Browser erstellt.',
      intro: 'Motion ist ein SVG-Editor mit Animationszeitleiste, integriert in Media Manipulator. Öffnen Sie eine SVG-Datei (oder eine Lottie-Animation), und jede Form wird zu einer Ebene, die Sie auswählen, verschieben, umfärben und animieren können, oder beginnen Sie mit einer leeren Zeichenfläche und zeichnen Sie mit den Werkzeugen für Rechteck, Ellipse, Linie, Zeichenstift und Text. Jede animierte Eigenschaft erhält eine eigene Keyframe-Spur, mit Easing-Vorgaben, einem Kurveneditor für eigenes Easing und Hold-Keys für sofortige Sprünge. Ein-Klick-Animatoren fügen Konturzeichnung, Bewegung entlang eines Pfads, Form-Morphing, Farbverlaufsänderungen, Maskenanimation und Weichzeichner hinzu. Wenn es sich so bewegt, wie Sie möchten, exportieren Sie es als animiertes SVG, Lottie-Datei, React-Komponente, JavaScript- oder TypeScript-Modul, Flutter-Widget oder GIF. Bearbeitung und jeder Export laufen in Ihrem Browser, Ihre Grafik wird also nie hochgeladen, um sie zu exportieren; der Server wird nur gebeten, den Export auf Ihr Tageskontingent anzurechnen.',
      whatItDoes: [
        'Importiert SVG-Dateien in einen bearbeitbaren Ebenenbaum (Gruppen, Pfade, Formen, Text, Bilder, Verläufe, Masken und Beschneidungspfade) und importiert Lottie-JSON-Animationen mit ihren Keyframes, jede Datei bis zu 4 MB.',
        'Zeichnet neue Grafiken mit den Werkzeugen für Rechteck, Ellipse, Linie, Zeichenstift (Bézier) und Text und bearbeitet Pfadknoten direkt auf der Zeichenfläche.',
        'Animiert Position, Skalierung, Drehung, Neigung, Deckkraft, Füllung, Kontur und Konturbreite auf einer Keyframe-Zeitleiste mit Linear, Ease-In, Ease-Out, Ease-In-Out, eigenem Cubic-Bezier und Hold-Easing.',
        'Fügt sechs Ein-Klick-Animatoren hinzu: Konturzeichnung, Bewegung entlang eines Pfads mit optionaler automatischer Drehung, Form-Morphing, Farben von Verlaufsstopps, Masken- und Beschneidungspfad-Animation sowie Weichzeichner.',
        'Exportiert ein statisches SVG (immer kostenlos und nie gezählt), ein animiertes SVG, das ohne Bibliothek abgespielt wird, Lottie JSON, eine React-Komponente, ein JavaScript- oder TypeScript-Modul, ein Flutter-Widget und ein animiertes GIF, alles auf Ihrem Gerät erzeugt.',
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
          description: 'Wählen Sie ein Format; der Server zählt einen Export, dann erstellt Ihr Browser die Datei und lädt sie herunter.',
        },
      ],
      advancedDetails: [
        'Der Export als animiertes SVG nutzt reine CSS-Keyframes, sofern sich jeder Effekt in Chrome, Firefox und Safari in CSS ausdrücken lässt. Form-Morphing, bewegte Verlaufsstopps und Weichzeichner benötigen ein Skript, daher enthalten diese Dateien eine gekürzte Kopie von anime.js (MIT-Lizenz, etwa 31 KB Skript, rund 13 KB nach gzip) mit ihrem Lizenzvermerk am Anfang.',
        'Beim Form-Morphing werden beide Formen auf dieselbe Anzahl von Kurvensegmenten normalisiert und ihre Startpunkte und Umlaufrichtung angeglichen, damit sich das Morphing nicht verdreht. Zwei Formen, die sich nicht angleichen lassen, werden gehalten, statt gemorpht zu werden.',
        'Der Lottie-Writer folgt der Lottie-Spezifikation 1.0.1 und dem Funktionsumfang „Basic“ von LottieFiles. Alles, was Lottie nicht abbilden kann (etwa Filter, Text oder erweiterte Masken), wird nach dem Download aufgelistet; nichts wird stillschweigend verworfen. Der Reader verwendet dieselbe Liste in der anderen Richtung.',
        'Der GIF-Export rendert die Bilder einzeln, übergibt jedes an einen Worker und kodiert mit einem für Media Manipulator geschriebenen Encoder: eine globale Palette aus fünf über die Dauer verteilten Bildern, Dithering standardmäßig aus (flache Vektorgrafik hat wenige Farben, und Dithering fügt Rauschen hinzu), eine Bildverzögerung von round(100 / fps) Hundertstelsekunden und Transparenz nur, wenn der Zeichenflächenhintergrund transparent ist. Die Ausgabe ist auf 2 GB begrenzt, und der Dialog zeigt vor dem Start eine Größenschätzung.',
        'Importierte SVGs werden beim Einlesen bereinigt: Skripte, Ereignishandler, externe Verweise und andere unsichere Inhalte werden entfernt, und der Editor baut nicht unterstütztes Markup aus einer Positivliste neu auf, statt es als HTML einzufügen. Markup, das er nicht abbilden kann, bleibt als undurchsichtige Ebene erhalten, die unverändert durchgereicht wird.',
        'Der Exportzähler ist eine einzige Datenbanktransaktion: Formatsperre und Obergrenzen werden geprüft, dann werden Zähler und eine Exportzeile zusammen geschrieben. Ein abgelehnter Export schreibt nichts und kostet nichts; ein Export, den der Browser danach abbricht oder der fehlschlägt, ist bereits gezählt.',
      ],
      whyItMatters: [
        'Animierte SVGs bleiben in jeder Größe scharf und sind meist deutlich kleiner als ein Video oder GIF derselben Animation, was sie ideal für Logos, Icons, Ladeanimationen und Illustrationen im Web macht.',
        'Entwickler brauchen Animation als Code, nicht nur als Video: Eine React-Komponente, ein JavaScript-Modul, eine Lottie-Datei oder ein Flutter-Widget lässt sich direkt in eine App einfügen.',
        'Der Export im Browser bedeutet, dass Ihre Grafik auf Ihrem Gerät bleibt; nur Format, Größe, Länge und Zeitpunkt jedes Exports werden an uns gesendet, um das Tageskontingent durchzusetzen.',
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
      workedExamples: [
        {
          title: 'Eine 2-sekündige Logo-Konturzeichnung als animiertes SVG',
          body: 'Eine Wortmarke aus wenigen Pfaden mit dem Animator „Konturzeichnung“ über 2.000 ms, exportiert als animiertes SVG. Konturzeichnung ist eine stroke-dasharray- und stroke-dashoffset-Animation, die CSS in jedem großen Browser ausdrücken kann, daher schreibt der Exporter einen <style>-Block mit @keyframes und gar kein Skript. Die Datei ist Ihr SVG plus ein paar hundert Bytes CSS, sie spielt, sobald sie in der Seite ist, und zählt als ein svg_animated-Export: ohne Konto einer von 2 pro Tag und innerhalb der Längengrenze von 10 Sekunden für Besucher; mit einem kostenlosen Konto einer von 5. Der Export ist eine Zeichenkettenumwandlung in Ihrem Browser und ist sofort fertig.',
        },
        {
          title: 'Eine Morph-Schleife mit 400 x 400 als GIF',
          body: 'Ein 2-sekündiges Form-Morphing auf einer Zeichenfläche von 400 x 400, exportiert als GIF mit 25 fps im Tarif Premium (GIF ist standardmäßig ein Premium-Format). Der Dialog begrenzt auf die Höhen- und Bildraten-Vorgaben des Tarifs; 25 fps ergeben eine Verzögerung von round(100 / 25) = 4 Hundertstelsekunden pro Bild und insgesamt 50 Bilder. Die Größenschätzung ist Pixel x Bilder x 0,25 Bytes + 1 KB: 160.000 x 50 x 0,25 sind etwa 2 MB, bewusst hoch angesetzt, und flache zweifarbige Grafik landet meist deutlich darunter. Die Bilder werden im Hauptthread gerendert und in einem Worker einzeln kodiert, sodass der Speicherbedarf bei ein paar Bildern plus der wachsenden Datei bleibt; die Zeit geht ins Rastern von 50 SVG-Bildern, ein paar Sekunden auf einem Laptop.',
        },
      ],
      whenNotToUse: 'Motion animiert Vektorgrafiken; es bearbeitet keine Videos oder Fotos. Wenn Ihr Ausgangspunkt Filmmaterial ist, ist Darkroom der Editor, und die Seite „Video in GIF“ wandelt einen Clip in ein GIF um. Es ist auch kein Vektorisierer für komplexe Rasterbilder: Ein in Pfade nachgezeichnetes Foto wird schwer, und das Ergebnis lässt sich nicht sinnvoll animieren. Animationen, die auf Filtern, Texteffekten oder erweiterten Masken beruhen, überstehen einen Lottie-Export nicht unbeschadet (der Dialog listet auf, was verworfen wurde), bleiben Sie für diese Ziele also bei den Exporten als animiertes SVG, React oder JavaScript. Und die Ausgabe als MP4 oder WebM hängt von der WebCodecs-Unterstützung Ihres Browsers und von Ihrem Tarif ab, prüfen Sie also die Tariftabelle, bevor Sie ein Video als Lieferformat einplanen.',
      whyMediaManipulator: [
        'Ein echter Editor mit Ebenen und Keyframes, mit Holds, eigenen Kurven und sechs Animatoren, keine Vorlagengalerie.',
        'Exporte für Designer und Entwickler gleichermaßen: animiertes SVG, Lottie, React, JavaScript oder TypeScript, Flutter und GIF aus einem Projekt.',
        'Exporte werden in Ihrem Browser erstellt, und der einzige Drittanbieter-Code, den ein Export verwendet, ist permissiv lizenziert (anime.js unter MIT; flutter_svg und webview_flutter für Flutter), wobei sein Lizenzvermerk in der Datei erhalten bleibt.',
      ],
      privacyNote: 'Bearbeitung und Export finden in Ihrem Browser statt; Ihre Grafik wird nicht hochgeladen, um sie zu exportieren. Ohne Konto werden Projekte nur in diesem Browser gespeichert. Wenn Sie sich anmelden und ein Projekt in Ihrem Konto speichern, werden das bereinigte Dokument (bis zu 4 MB) und ein Vorschaubild wie ein Darkroom-Projekt auf unseren Servern gespeichert, folgen der von Ihnen gewählten Aufbewahrungsdauer und können auf Ihrer Kontoseite gelöscht werden. Zu jedem gezählten Export erfassen wir nur Format, Höhe, Bildrate, Länge und Zeitpunkt, mit Ihrem Konto oder Ihrer Sitzung als Eigentümer, um das Tageskontingent durchzusetzen; die Exportzeile enthält nie die Grafik.',
      faq: [
        {
          question: 'Ist Motion kostenlos?',
          answer: 'Ja. Motion zu öffnen, zu zeichnen, zu animieren, in diesem Browser zu speichern und ein statisches SVG zu exportieren ist kostenlos, unbegrenzt und braucht kein Konto. Animierte Exporte zählen zu einem Tageskontingent, das von Ihrem Tarif abhängt: standardmäßig 2 pro Tag ohne Konto (nur animiertes SVG), 5 mit einem kostenlosen Konto, 30 mit Premium und 150 mit Pro. Die Tariftabelle auf dieser Seite zeigt das aktuelle Kontingent und die Formate jedes Tarifs.',
        },
        {
          question: 'Welche Formate kann ich exportieren?',
          answer: 'Statisches SVG, animiertes SVG (CSS oder bei Bedarf ein kleines Inline-Skript), Lottie JSON, eine React-Komponente (.tsx), ein JavaScript- oder TypeScript-Modul, ein Flutter-Widget (.dart) und ein animiertes GIF. Standardmäßig ist animiertes SVG in jedem Tarif enthalten, Lottie ab dem kostenlosen Konto und React, JS/TS, Flutter und GIF ab Premium. Welche davon Ihr Tarif enthält und wie viele Exporte täglich möglich sind, zeigt die Tariftabelle auf dieser Seite.',
        },
        {
          question: 'Welche Limits gibt es?',
          answer: 'Animierte Exporte werden pro Tag gezählt und um Mitternacht UTC zurückgesetzt; ein abgelehnter Export wird nicht gezählt, ein Export, den Sie nach der Zählung abbrechen, hingegen schon. Besucher ohne Konto speichern Projekte nur in ihrem Browser und können Animationen bis zu 10 Sekunden Länge exportieren; ein kostenloses Konto speichert 3 Projekte im Konto, Premium 25, Pro ohne Limit. SVG- und Lottie-Importe sind auf je 4 MB begrenzt, der GIF-Export auf 50 fps und 2 GB Ausgabe. Alle aktuellen Zahlen stehen in der Tariftabelle auf dieser Seite und auf der Preisseite.',
        },
        {
          question: 'Kann ich ein vorhandenes SVG animieren?',
          answer: 'Ja. Importieren Sie ein beliebiges SVG, und seine Gruppen, Pfade, Formen, Texte, Verläufe, Masken und Beschneidungspfade werden zu bearbeitbaren Ebenen. Teile, die der Editor nicht bearbeiten kann, etwa Muster oder komplexe Filter, werden beibehalten und unverändert exportiert, und alles Unsichere (Skripte, Ereignishandler oder externe Links) wird entfernt und nach dem Import aufgelistet.',
        },
        {
          question: 'Unterstützt es Lottie?',
          answer: 'Ja, in beide Richtungen. Sie können eine Lottie-JSON-Datei zum Bearbeiten importieren (der Import zählt ab dem kostenlosen Tarif als eine Einheit) und Ihre Animation als Lottie JSON für lottie-web sowie die Lottie-Player für iOS, Android und Flutter exportieren. Funktionen, die eine Seite nicht abbilden kann, werden im Dialog aufgelistet, statt stillschweigend verworfen zu werden.',
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
        maxFileNotes: [
          'SVG- und Lottie-Importe bis zu je 4 MB.',
          'Projekte ohne Konto bleiben nur in diesem Browser; angemeldete Projekte folgen der von Ihnen gewählten Aufbewahrungsdauer.',
        ],
        processingNotes: [
          'Bearbeitung, Vorschau und jeder Export laufen in Ihrem Browser. Nur die Anzahl jedes Exports wird an unsere Server gesendet.',
        ],
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
          description: 'Bearbeiten Sie Video auf einer Multitrack-Timeline und exportieren Sie MP4.',
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
      embed: {
        title: 'Motion öffnen',
        description: 'Beginnen Sie eine neue Zeichnung oder öffnen Sie eine letzte erneut. Der Editor öffnet sich im Vollbild; Ihre Arbeit bleibt in diesem Browser erhalten, und angemeldete Nutzer können sie in ihrem Konto speichern.',
      },
      featureList: [
        'SVG-Import in bearbeitbare Ebenen',
        'Lottie-JSON-Import',
        'Werkzeuge für Rechteck, Ellipse, Linie, Zeichenstift und Text',
        'Keyframe-Zeitleiste mit Easing-Vorgaben, eigenen Cubic-Bezier-Kurven und Hold-Keys',
        'Animatoren für Konturzeichnung, Bewegungspfad, Form-Morphing, Verlauf, Maske und Weichzeichner',
        'Export als statisches SVG',
        'Export als animiertes SVG (CSS oder Inline-Laufzeit anime.js)',
        'Lottie-JSON-Export',
        'Code-Export für React, JavaScript, TypeScript und Flutter',
        'Export als animiertes GIF',
        'Projekte im Browser oder in Ihrem Konto gespeichert',
      ],
    },
    'content-studio': {
      name: 'Darkroom',
      h1: 'Darkroom',
      tagline: 'Schneiden, überlagern und mischen Sie Video und Audio auf einer Multitrack-Timeline und exportieren Sie anschließend MP4. Ein Editor im Stil von Premiere Pro, direkt in Ihrem Browser.',
      metaTitle: 'Darkroom: Kostenloser Online-Multitrack-Videoeditor | Media Manipulator',
      metaDescription: 'Schneiden, überlagern und mischen Sie Video und Audio auf einer Multitrack-Timeline und exportieren Sie dann MP4: ein kostenloser Videoeditor im Stil von Premiere Pro, direkt in Ihrem Browser. Ohne Anmeldung, ohne Installation.',
      ogTitle: '🎬 Darkroom: Kostenloser Multitrack-Videoeditor in Ihrem Browser',
      ogDescription: 'Schneiden, überlagern und mischen Sie Video und Audio auf einer Multitrack-Timeline, fügen Sie Titel, Übergänge und Farbkorrektur hinzu und exportieren Sie MP4. Ein Editor im Stil von Premiere Pro, direkt in Ihrem Browser, ohne Anmeldung, völlig kostenlos. Probieren Sie es aus! 🎬',
      intro: 'Darkroom ist ein Multitrack-Videoeditor, der in einem Browser-Tab läuft. Sie legen ein Projekt mit einer Zeichenfläche und einer Bildrate an, ziehen Video-, Bild- und Audiodateien in den Medienbereich, ordnen sie auf übereinanderliegenden Spuren an, trimmen und teilen sie an Bildgrenzen, graden und keyen sie, fügen Titel, Übergänge und Untertitel hinzu, mischen den Ton mit einem Mixer pro Spur und übergeben die fertige Timeline dann an unseren Render-Server, wo ffmpeg den gesamten Schnitt als einen einzigen Filtergraphen aufbaut und ihn als H.264 oder HEVC in MP4 kodiert, oder als MP3 oder WAV, wenn das Projekt nur Audio enthält. Die Vorschau, gegen die Sie schneiden, wird live auf Ihrer GPU in WebGL2 zusammengesetzt; der Export wird gegen diese Vorschau geprüft, damit Sie genau das bekommen, was Sie gesehen haben.',
      whatItDoes: [
        'Bietet eine bildgenaue Multitrack-Timeline: Trimmen, Teilen, Ripple-Löschen, Razor-, Slip-, Slide-, Roll- und Ripple-Schnitte, Marker, Gruppen, Spursperre, Solo und Ausblenden sowie das Trennen von Audio und Video.',
        'Setzt Spuren in Stapelreihenfolge zusammen, mit Zuschnitt, Einpassen, Transformation, einer Farbkorrektur im Lumetri-Stil (Belichtung, Kontrast, Sättigung, Farbtemperatur, Tönung, Dynamik), 3D-LUTs, Chroma-Key mit Pipette, Deckkraft und acht Füllmethoden.',
        'Animiert Position, Skalierung, Drehung, Deckkraft, Lautstärke, Panorama und Effektparameter mit Keyframes und fünf Easing-Kurven; bietet fünfzehn Übergänge und Titelclips aus Text- und Formebenen.',
        'Mischt Audio über Fader pro Spur, Panorama, Dreiband-EQ und Kompressor mit Live-Pegelanzeigen, dazu Ducking sowie Lautheits-Presets für Streaming, Podcast und Broadcast auf dem Master-Bus.',
        'Erzeugt Untertitel mit Whisper auf unserer GPU, lässt Sie diese in einer Untertitelspur bearbeiten und exportiert sie ins Bild eingebrannt oder als SRT- oder VTT-Begleitdatei.',
        'Exportiert H.264- oder HEVC-MP4 mit AAC-Audio oder MP3 bzw. WAV, in Zeichenflächengröße oder skaliert auf 720, 1080, 1440 oder 2160 Zeilen, und führt ein Export-Panel mit Fortschritt und erneutem Rendern.',
      ],
      flowSteps: [
        {
          title: 'Projekt anlegen',
          description: 'Wählen Sie eine Zeichenfläche (16:9 mit 1920 x 1080, 9:16 mit 1080 x 1920, 1:1, 4:5 oder eine eigene Größe) und eine Bildrate von 24, 30 oder 60.',
        },
        {
          title: 'Medien importieren',
          description: 'Laden Sie Video, Bilder und Audio in den Medienbereich hoch. Der Server rendert einen Vorschau-Proxy mit einem Keyframe pro Sekunde, damit das Scrubben günstig bleibt.',
        },
        {
          title: 'Schneiden und überlagern',
          description: 'Platzieren Sie Clips auf Spuren, trimmen und teilen Sie an der Abspielposition, stapeln Sie Overlays und Titel über dem Basismaterial und halten Sie Standbilder beliebig lange.',
        },
        {
          title: 'Graden, keyen und mischen',
          description: 'Passen Sie die Farbe an, wenden Sie eine LUT an, keyen Sie einen Hintergrund heraus, setzen Sie Keyframes für alles, was sich bewegen soll, und gleichen Sie die Audiospuren im Mixer ab.',
        },
        {
          title: 'Exportieren',
          description: 'Wählen Sie Format, Qualität, Ausgabehöhe, Untertitelmodus und Lautheits-Preset. ffmpeg rendert die Timeline auf unserem Server, und die Datei erscheint im Export-Panel.',
        },
      ],
      advancedDetails: [
        'Der Export ist ein einziger ffmpeg-Aufruf: Jede Quelle ist ein Input, die Timeline wird zu einem filter_complex-Graphen (trim, scale, overlay, drawtext für Titel, eq- und Farbfilter, amix mit normalize=0 für Audio), und die Ausgabe wird in einem Durchgang kodiert. Keyframe-gesteuerte Parameter laufen über eine sendcmd-Begleitdatei im Graphen, was ffmpeg 4.4 oder neuer auf dem Render-Host erfordert.',
        'H.264 verwendet den Hardware-Encoder h264_nvenc, wenn eine Testkodierung auf der Render-GPU gelingt, sonst libx264. Die Qualitäts-Presets entsprechen NVENC-Preset p4 bei konstanter Qualität 23 (Mittel), p5 bei CQ 19 (Hoch) und p4 bei CQ 28 (Niedrig); auf libx264 sind es preset medium CRF 23, slow CRF 18 und veryfast CRF 28. Beide legen yuv420p fest.',
        'HEVC verwendet hevc_nvenc oder libx265 mit CQ- bzw. CRF-Werten, die fünf Punkte höher liegen (28, 24, 33 auf NVENC; 28, 24, 32 auf libx265), der übliche Versatz für gleiche wahrgenommene Qualität, und kennzeichnet den Stream als hvc1, damit das MP4 in Safari und QuickTime abgespielt wird. Ist keiner der beiden Encoder verfügbar, schlägt der Export mit einer klaren Fehlermeldung fehl, statt H.264 unter einem HEVC-Namen zurückzugeben.',
        'Audio wird im Graphen auf 48 kHz Stereo neu abgetastet und bei Videoexporten als AAC mit 192 kb/s kodiert; MP3-Exporte verwenden libmp3lame mit 192 kb/s, WAV-Exporte sind 16-Bit-PCM. Die Lautheits-Presets sind ffmpeg loudnorm: Streaming I=-14 LUFS TP=-1.5 LRA=11, Podcast I=-16 TP=-1.5 LRA=11, Broadcast I=-23 TP=-2 LRA=7.',
        'Eine gewählte Ausgabehöhe skaliert das zusammengesetzte Bild als letzten Filter (lanczos, quadratische Pixel, Breite auf eine gerade Zahl gerundet), nachdem die Untertitel eingebrannt wurden, sodass Text mit dem Bild skaliert statt neu gezeichnet wird. Eine Höhe, die Ihr Tarif nicht rendern kann, wird mit einem Fehler abgelehnt und nie stillschweigend herabgestuft.',
        'MP4-Dateien werden mit -movflags +faststart geschrieben, sodass der Index am Anfang liegt und die Datei abspielt, bevor sie vollständig heruntergeladen ist. Standbilder auf der Timeline werden zu Inputs mit -loop 1 -framerate <project fps> -t <hold>, sodass ein gehaltenes Foto beim Dekodieren nicht mehr kostet als seine Bilder.',
      ],
      whyItMatters: [
        'Ein Konvertierungstool verändert eine Datei. Ein Schnitt kombiniert mehrere: das B-Roll unter dem Interview, den Titel über dem Anfang, das Musikbett unter beidem, jedes bildgenau getrimmt.',
        'Vorschau und Export driften in Browser-Editoren meist auseinander. Darkroom rendert die Vorschau auf Ihrer GPU und den Export auf unserer und hält beide mit einem Golden-Image-Testaufbau innerhalb einer dokumentierten Toleranz.',
        'Die schwere Arbeit bleibt Ihrem Laptop erspart. Ein 4K-Export, eine Whisper-Transkription oder ein LUT-gegradetes Komposit mit mehreren Ebenen läuft auf einem GPU-Render-Server, sodass auch ein dünnes Notebook die Aufgabe erledigt.',
      ],
      useCases: [
        {
          title: 'Vertikale Clips für Kurzvideo-Plattformen',
          description: 'Eine Zeichenfläche von 1080 x 1920, ein Zoom auf die sprechende Person, eine Titelkarte, Musik unter der Stimme abgesenkt und eingebrannte Untertitel.',
        },
        {
          title: 'Tutorials und Bildschirmaufnahmen',
          description: 'Pausen herausschneiden, Takes zusammenfügen, ein Webcam-Bild als Bild-im-Bild überlagern, Hinweise einfügen und in 1080p mit einer Untertitel-Begleitdatei exportieren.',
        },
        {
          title: 'Interview- und Podcast-Folgen',
          description: 'Zwei Kameraperspektiven auf die sprechende Person geschnitten, ein lautheitsnormalisierter Mix und ein MP3-Export derselben Timeline für den Audio-Feed.',
        },
        {
          title: 'Promos und Produktvideos',
          description: 'Chroma-gekeytes Material über einer Hintergrundplatte, eine LUT für den Look, Logobewegungen per Keyframe und ein 15-Sekunden-Schnitt in 4K für die Videowand.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein 90-Sekunden-Schnitt in 1080p30 mit dem Preset Mittel',
          body: 'Zwei 1080p-Clips, eine Musikspur und eine Titelkarte auf einer Zeichenfläche von 1920 x 1080 mit 30 fps, exportiert als H.264 mit Mittel. Auf dem Render-Server mit funktionierendem NVENC ist das h264_nvenc Preset p4 bei konstanter Qualität 23 mit yuv420p; ohne NVENC libx264 preset medium CRF 23. Der Audiomix wird als AAC mit 192 kb/s kodiert, was für 90 Sekunden 192.000 x 90 / 8 ergibt, etwa 2,2 MB Audio unabhängig vom Inhalt. Die Videoseite ist qualitäts- statt bitratengesteuert, ihre Größe folgt also dem Material: statische Talking-Head-Aufnahmen werden bei CQ 23 klein, Handkamera-Bewegung groß. Die Renderzeit skaliert mit der Länge der Timeline und der Anzahl gleichzeitig sichtbarer Clips, denn jedes Bild jedes sichtbaren Clips wird dekodiert und zusammengesetzt, bevor der Encoder es sieht.',
        },
        {
          title: 'Ein 20-Minuten-Podcast als MP3 und als WAV exportiert',
          body: 'Ein reines Audioprojekt (zwei Sprachspuren, ein Intro-Jingle, Lautheits-Preset Podcast) überspringt den Videographen vollständig. Als MP3 exportiert ist die Datei libmp3lame mit konstanten 192 kb/s: 192.000 x 1.200 / 8 = 28,8 MB, also etwa 29 MB. Als WAV exportiert ist sie 16-Bit-PCM mit den 48 kHz Stereo des Graphen: 48.000 x 2 Kanäle x 2 Bytes = 192.000 Bytes pro Sekunde, 230 MB für 20 Minuten. Die loudnorm-Stufe zielt auf -16 LUFS integriert mit einer Obergrenze von -1,5 dBTP und 11 LU Lautheitsumfang. Da keine Bilder zusammenzusetzen sind, wird der Auftrag nur vom Dekodieren der Quellen und den Audiofiltern begrenzt und ist deutlich schneller fertig als die Folge lang ist.',
        },
      ],
      whenNotToUse: 'Darkroom ist das falsche Werkzeug für eine Aufgabe in einem Schritt. Wenn Sie nur Anfang und Ende eines Clips abschneiden, sein Format ändern oder ihn verkleinern möchten, erledigen das die Einzelzweck-Seiten Video-Trimmer und Video komprimieren mit einem Upload und ohne Projekt. Es ist auch kein Ort für Material, das Sie nicht hochladen dürfen: Jede Quelle wird für Proxys und Rendering an unseren Server gesendet, Material, das Ihren Rechner nie verlassen darf, gehört also in einen Desktop-Editor. Projekte in einer Gastsitzung sind auf eines begrenzt und bestehen 24 Stunden; melden Sie sich an, bevor Sie etwas beginnen, zu dem Sie nächste Woche zurückkehren möchten.',
      whyMediaManipulator: [
        'Echte Schnittwerkzeuge: Razor, Slip, Slide, Roll, Ripple, Marker, Gruppen, Keyframes mit Easing, ein Mixer mit EQ und Kompression, kein Trimmer mit Titelfeld.',
        'Ehrliche Exporte: Hardware- oder Software-Kodierung wird per Live-Test gewählt, HEVC verweigert statt zu täuschen, und eine Auflösung, die Ihr Tarif nicht rendern kann, ist ein Fehler, keine stille Herabstufung.',
        'Ein Konto, ein Ort: Transkribieren, komprimieren oder Metadaten entfernen bei denselben Dateien, die Sie schneiden, und Voice-over oder Untertitel auf demselben GPU-Server erzeugen.',
      ],
      privacyNote: 'Darkroom behält Ihre Medien so lange auf unseren Servern, wie das Projekt besteht: Uploads landen als Assets im Medienbereich, der Server rendert daraus Vorschau-Proxys, Filmstreifen und Wellenform-Spitzen, und Exporte werden von ffmpeg in outputs/<jobId>/ auf dem Render-Host erstellt. Wenn Sie Untertitel anfordern, wird das Audio an Whisper auf unserer eigenen GPU gesendet, und die entstehenden Cues werden mit dem Projekt gespeichert. Das Projektdokument, seine Assets, Versionen und Exporte können im Editor oder auf Ihrer Kontoseite gelöscht werden. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre. Hochgeladenes Video und Audio durchläuft außerdem einen automatisierten Analyseschritt auf unserem eigenen Server. Nichts wird an einen externen KI-Anbieter gesendet, und keine Datei wird zum Trainieren verwendet.',
      faq: [
        {
          question: 'Ist Darkroom kostenlos?',
          answer: 'Ja. Ohne Konto können Sie ein Projekt behalten und 5 Exporte pro Tag rendern, mit Uploads bis 200 MB pro Datei und Ausgabe bis 1080 Zeilen. Ein kostenloses Konto erhöht das auf 5 Projekte, 30 Exporte pro Tag, 1 GB große Dateien und 1440 Zeilen; Premium bietet unbegrenzte Projekte, 300 Exporte pro Tag, 5 GB große Dateien und Ausgabe mit 2160 Zeilen; Pro erhöht die Exporte auf 700 pro Tag. Exporte haben einen eigenen Tageszähler und verbrauchen nicht das allgemeine Vorgangskontingent. Das sind die Standardwerte; die Preisseite zeigt die aktuellen Zahlen.',
        },
        {
          question: 'Was kann ich exportieren?',
          answer: 'MP4 mit H.264- oder HEVC-Video und AAC-Audio, oder MP3 bzw. WAV für reine Audioprojekte. Video kann in Zeichenflächengröße oder skaliert auf 720, 1080, 1440 oder 2160 Zeilen ausgegeben werden, mit eingebrannten Untertiteln, als SRT- oder VTT-Begleitdatei oder ohne Untertitel, und mit einem Lautheits-Preset für Streaming, Podcast oder Broadcast auf dem Mix.',
        },
        {
          question: 'Welches Qualitäts-Preset soll ich wählen?',
          answer: 'Mittel ist CRF 23 auf libx264 bzw. konstante Qualität 23 auf NVENC und die sinnvolle Vorgabe für den Upload auf eine Plattform, die ohnehin neu kodiert. Hoch (CRF 18 oder CQ 19, Preset slow oder p5) ist für ein Master, das Sie erneut bearbeiten oder auf einer großen Leinwand zeigen. Niedrig (CRF 28 oder CQ 28, veryfast oder p4) ist für eine schnelle Vorschau, die Sie einer Kollegin oder einem Kollegen schicken.',
        },
        {
          question: 'Warum ist mein HEVC-Export fehlgeschlagen?',
          answer: 'HEVC braucht entweder hevc_nvenc auf der Render-GPU oder libx265 im ffmpeg-Build. Hat der Server keines von beiden, schlägt der Export mit einer Meldung über einen nicht unterstützten Encoder fehl, statt eine als HEVC bezeichnete H.264-Datei zurückzugeben. Stellen Sie das Format auf H.264 um, und dieselbe Timeline wird gerendert.',
        },
        {
          question: 'Wie werden Untertitel erzeugt?',
          answer: '„Untertitel generieren“ sendet das Timeline-Audio an Whisper auf unserem GPU-Server. Die Segmente kommen als Cues zurück, die Sie in der Untertitelspur bearbeiten können, und werden dann ins Bild eingebrannt (eine ASS-Untertitelspur, die in die Bilder gerendert wird) oder als SRT- oder VTT-Datei neben dem Video exportiert. Das Erzeugen von Untertiteln zählt als ein KI-Auftrag aus dem KI-Kontingent.',
        },
        {
          question: 'Stimmt der Export mit der Vorschau überein?',
          answer: 'Genau das ist der Sinn des Designs. Die Vorschau setzt in WebGL2 in derselben Reihenfolge zusammen, die der Filtergraph des Servers verwendet (Zuschnitt, Einpassen, Transformation, Farbkorrektur, LUT, Key, Deckkraft, Füllmethode), und ein Golden-Image-Testaufbau vergleicht Bilder aus beiden innerhalb einer dokumentierten Toleranz. Solo und Ausblenden gelten für den Export genau wie für die Vorschau.',
        },
        {
          question: 'Kann ich später zu einem Projekt zurückkehren?',
          answer: 'Ja. Projekte werden mit Revisionsnummern gespeichert, sodass ein veralteter Tab neuere Arbeit nicht überschreiben kann, und der Versionsverlauf behält Prüfpunkte, zu denen Sie zurückkehren können. Ein Entwurf wird außerdem in Ihrem Browser für die Wiederherstellung nach einem Absturz behalten. Angemeldete Nutzer können letzte Projekte von jedem Gerät öffnen; Gastprojekte bleiben an die Browsersitzung und die Aufbewahrungsfrist von 24 Stunden gebunden.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Quell- und Exportdateien werden auf unseren Servern verarbeitet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
        ],
        processingNotes: [
          'Die Vorschau wird im Browser zusammengesetzt; der endgültige Export wird auf dem Server als H.264- oder HEVC-MP4 oder als MP3- oder WAV-Audio kodiert.',
        ],
      },
      related: [
        {
          label: 'Video komprimieren',
          to: '/tools/compress-video',
          description: 'Verkleinern Sie einen Export weiter für E-Mail oder eine langsame Verbindung.',
        },
        {
          label: 'Video transkribieren',
          to: '/tools/transcribe-video',
          description: 'Erhalten Sie ein vollständiges Transkript eines fertigen Schnitts, nicht nur Untertitel.',
        },
        {
          label: 'Audio aus Video extrahieren',
          to: '/tools/extract-audio-from-video',
          description: 'Ziehen Sie die Tonspur aus einem Clip, bevor Sie ihn in die Timeline bringen.',
        },
        {
          label: 'Video-Trimmer',
          to: '/tools/video-trimmer',
          description: 'Wenn ein einzelner Schnitt alles ist, was Sie brauchen.',
        },
        {
          label: 'Motion',
          to: '/tools/motion',
          description: 'Animieren Sie ein Logo oder eine Bauchbinde als SVG und exportieren Sie dann ein GIF für die Timeline.',
        },
        {
          label: 'Darkroom-Tutorial',
          to: '/tutorials/content-studio',
          description: 'Bauen Sie einen Schnitt vom leeren Projekt bis zum exportierten MP4, Schritt für Schritt.',
        },
      ],
      embed: {
        title: 'Video bearbeiten',
        description: 'Legen Sie ein neues Projekt an (oder öffnen Sie ein letztes erneut), ziehen Sie Video-, Bild- und Audiodateien in den Medienbereich und legen Sie sie dann auf der Multitrack-Timeline ab. Trimmen, teilen und ordnen Sie Clips, überlagern Sie Overlays und Titel, mischen Sie den Ton und exportieren Sie ein fertiges MP4, alles in Ihrem Browser.',
      },
    },
    'remove-exif-metadata': {
      name: 'EXIF-Metadaten aus Bildern entfernen',
      h1: 'EXIF-Metadaten aus Bildern online entfernen',
      tagline: 'Entfernen Sie GPS-Standort, Geräte-, Kamera- und Zeitstempeldaten aus Fotos, bevor Sie sie irgendwo teilen.',
      metaTitle: 'EXIF-Metadaten aus Bildern online entfernen (kostenlos) | Media Manipulator',
      metaDescription: 'Kostenloses Online-Tool zum Entfernen von EXIF-, GPS-, IPTC- und Kamerametadaten aus JPG-, PNG-, WebP- und HEIC-Bildern. Ohne Anmeldung. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ogTitle: 'EXIF-Metadaten aus Bildern online entfernen',
      ogDescription: 'Entfernen Sie GPS-Standort-, Kamera- und Zeitstempel-Metadaten aus Bildern, bevor Sie sie öffentlich teilen.',
      intro: 'Ein Foto trägt ein zweites Dokument in sich. Neben den Pixeln schreibt ein Telefon oder eine Kamera Marke und Modell des Geräts, oft seine Seriennummer, das Objektiv, die Belichtung, die genaue Sekunde der Auslösung, die Software, die die Datei zuletzt gespeichert hat, ein kleines Vorschaubild und, wenn Ortungsdienste aktiv waren, Breitengrad, Längengrad und Höhe des Punkts, an dem Sie standen. Dieses Tool liest all das aus einem JPG, PNG, WebP oder HEIC aus, zeigt Ihnen jeden Tag gruppiert nach dem, was er verrät, und entfernt dann alles in einem einzigen Durchgang mit ExifTool, sodass die Kopie, die Sie teilen, nur noch das Bild enthält.',
      whatItDoes: [
        'Untersucht den Upload mit ExifTool und listet jeden gefundenen Tag auf, gruppiert in Kategorien (Kamera, Objektiv, GPS, Datum und Uhrzeit, XMP, IPTC, Vorschaubild, Farbe, Herstellernotizen und mehr), wobei Standort-, Identitäts-, Geräte- und Verlaufs-Tags markiert werden.',
        'Entfernt die EXIF-Blöcke (IFD0 und ExifIFD: Marke, Modell, Gehäuse-Seriennummer, Objektivmodell, Belichtung, ISO, Brennweite, Aufnahme- und Änderungsdatum) und das GPS-IFD (Breitengrad, Längengrad, Höhe, ihre Referenz-Tags, GPS-Zeitstempel).',
        'Entfernt das eingebettete IFD1-Vorschaubild, eine separate kleine Kopie des Bildes, die in vielen Editoren das Zuschneiden überlebt.',
        'Entfernt XMP-Pakete (Erstellungssoftware, Bearbeitungsverlauf, Schlüsselwörter, Bewertungen), IPTC-Datensätze (Autor, Copyright, Bildunterschrift), Photoshop-Ressourcenblöcke, Herstellernotizen und das ICC-Farbprofil.',
        'Wendet zuerst die EXIF-Ausrichtung auf die Pixel an, damit ein Handyfoto, das sich auf den Rotations-Tag verlassen hat, nicht seitlich gedreht herauskommt, wenn der Tag weg ist.',
        'Zählt, was entfernt wurde, indem die Berichte vor und nach dem Vorgang verglichen werden, und zeigt die Zahl an, mit einem Hinweis, wenn Standort-Tags darunter waren.',
      ],
      flowSteps: [
        {
          title: 'Foto hochladen',
          description: 'Legen Sie ein JPG, PNG, WebP oder HEIC ab. Der Server führt ExifTool zweimal aus (ein lesbarer Durchgang und ein numerischer für GPS- und Belichtungswerte) und liefert den Bericht.',
        },
        {
          title: 'Bericht lesen',
          description: 'Die Tags sind nach Kategorie gruppiert; GPS-Koordinaten werden auf einer Karte angezeigt, damit Sie genau sehen, was die Datei preisgibt.',
        },
        {
          title: 'Alles entfernen',
          description: 'Ein Klick speichert das Bild mit ImageMagick neu und führt exiftool -all= auf dem Ergebnis aus.',
        },
        {
          title: 'Vergleichen und herunterladen',
          description: 'Die Ergebnisseite meldet, wie viele Tags entfernt wurden, bietet einen Vergleich der beiden Berichte nebeneinander und gibt Ihnen die bereinigte Datei.',
        },
      ],
      advancedDetails: [
        'Der Pixel-Durchgang ist ImageMagick: convert <input> -auto-orient -quality 85 <output>, wobei der Ausgabecontainer bei JPG, PNG, WebP, GIF und AVIF dem Eingabeformat entspricht. HEIC, TIFF und BMP haben auf dieser Seite keinen Weg im gleichen Container und kommen als JPG zurück.',
        'Der Metadaten-Durchgang ist exiftool -overwrite_original -all= auf der konvertierten Datei. -all= entfernt jede beschreibbare Gruppe auf einmal: EXIF (IFD0, ExifIFD, GPS, InteropIFD), das IFD1-Vorschaubild, XMP, IPTC, Photoshop IRB, ICC_Profile, Herstellernotizen und alle APP-Segmente, die ExifTool schreiben kann. Die JFIF- und Adobe-APP14-Segmente, die ein JPEG-Decoder braucht, bleiben erhalten; sie beschreiben das Pixel-Layout, nicht Sie.',
        'Da das Bild neu kodiert wird, wird ein JPG mit Qualität 85 neu geschrieben und ein PNG verlustfrei neu geschrieben. Das Entfernen ist keine Byte-für-Byte-Kopie mit herausgeschnittenen Metadaten.',
        'Die Berichte vor und nach dem Vorgang sind dasselbe MetadataDocument, das der Inspektor erstellt: nach Gruppe benannte Einträge wie GPS:GPSLatitude oder XMP-xmpMM:History, jeder durch einen Katalog von etwa 1.800 Tags in 22 Kategorien und vier Datenschutzklassen (Standort, Identität, Gerät, Verlauf) eingeordnet.',
        'Die Anzahl der entfernten Einträge lässt Zeilen aus, die sich bei jeder Konvertierung ändern (Dateiname, Größe, Änderungsdatum, MIME-Typ, Bildgröße), sodass sie tatsächlich entfernte Metadaten widerspiegelt und keine Buchhaltung.',
        'Video- und Audiocontainer lassen sich ebenfalls bereinigen, über die Video- und Audiokonverter: ffmpeg wird mit -map_metadata -1 -map_chapters -1 ausgeführt, und bei MP4, MOV, M4A und M4V folgt ein Durchgang mit exiftool -all=, weil ffmpeg QuickTime-Schlüssel und XMP zurücklässt.',
      ],
      whyItMatters: [
        'GPS-Tags lassen sich zu einer Straßenadresse auflösen. Ein von zu Hause gepostetes Foto eines Sofas zum Verkauf kann einem Fremden sagen, wo das Sofa steht.',
        'Geräte- und Seriennummern-Tags verknüpfen Fotos miteinander und mit Ihnen. Zwei Bilder mit derselben BodySerialNumber wurden mit derselben Kamera aufgenommen, egal welches Konto sie gepostet hat.',
        'Das IFD1-Vorschaubild ist eine Kopie des Originalbildes. Schneiden Sie ein Gesicht oder ein Dokument aus dem Bild heraus, zeigt die Vorschau es möglicherweise immer noch.',
        'Viele Websites entfernen EXIF beim Hochladen, viele nicht. Messenger, E-Mail-Anhänge, Cloud-Freigaben und Marktplätze reichen die Datei häufig unverändert weiter.',
      ],
      useCases: [
        {
          title: 'Marktplatz- und Kleinanzeigen',
          description: 'Entfernen Sie Standort und Aufnahmezeit aus zu Hause aufgenommenen Produktfotos, bevor Käufer sie sehen.',
        },
        {
          title: 'Fotos von Dokumenten',
          description: 'Ein Schnappschuss eines Formulars oder Briefs hält auch fest, wann und wo er fotografiert wurde; entfernen Sie das, bevor Sie ihn weitergeben.',
        },
        {
          title: 'Veröffentlichen von einem sensiblen Ort',
          description: 'Entfernen Sie Gerätekennungen und Koordinaten aus einem Bild, bevor es Ihre Kontrolle verlässt, und prüfen Sie im Vergleich, dass sie weg sind.',
        },
        {
          title: 'Ein bearbeitetes Bild bereinigen',
          description: 'Editoren hängen einen XMP-Verlauf an und behalten das ursprüngliche Vorschaubild; entfernen Sie beides, damit die Datei nur zeigt, was Sie beabsichtigt haben.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein iPhone-JPEG mit 12 Megapixeln und GPS',
          body: 'Ein JPEG mit 4032 x 3024 direkt von einem iPhone 15 Pro trägt im typischen Fall 5 IFD0-Tags (Marke, Modell, Ausrichtung, Software, Änderungsdatum), 7 ExifIFD-Tags einschließlich Gehäuse-Seriennummer und Objektivmodell, 5 GPS-Tags, 4 XMP-Einträge einschließlich Bearbeitungsverlauf, 2 ICC-Profil-Einträge, die 3 IFD1-Vorschaubild-Einträge (etwa 5 KB Vorschau-JPEG) und eine abgeleitete GPSPosition. Die Ergebnisseite meldet 27 entfernte Tags, darunter Standort: Diese 27 sind jeder Eintrag außer den Zeilen für Dateiname, Größe, Datum und Typ sowie der Bildgröße, die bei jeder Datei vorhanden sind. Die Ausgabe ist ein JPG, neu kodiert mit Qualität 85 und mit der Ausrichtung fest in den Pixeln; die Neukodierung bestimmt die endgültige Größe. Der Auftrag ist ein einzelnes Dekodieren und Kodieren mit ImageMagick plus ein Neuschreiben mit ExifTool, er ist also in wenigen Sekunden fertig, und die Zeit geht in die Pixel, nicht in die Tags.',
        },
        {
          title: 'Ein HEIC von einem aktuellen Telefon',
          body: 'HEIC hat auf dieser Seite keinen Weg im gleichen Container, daher wird ein HEIC mit 12 Megapixeln von ImageMagick dekodiert und als JPG mit Qualität 85 geschrieben, dann mit exiftool -all= bereinigt. Sie verlieren den HEIC-Container und sein Farbprofil und gewinnen eine Datei, die jeder Browser und jeder Marktplatz akzeptiert. Rechnen Sie mit einer größeren Datei als dem hochgeladenen HEIC, denn die JPEG-Neukodierung mit Qualität 85 ist die einzige angewendete Kompression und bestimmt die Größe. Der Bericht listet vorher die Apple-Herstellernotizen und den GPS-Block und nachher nichts außer den Zeilen für Datei und Bildgröße. Das HEIC-Dekodieren ist der langsame Teil; für ein Foto bleibt es dennoch eine Sache von Sekunden.',
        },
      ],
      whenNotToUse: 'Bereinigen Sie kein Foto, das Sie noch bearbeiten oder dessen Herkunft Sie noch nachweisen müssen. Kamera-RAW-Dateien werden hier nicht akzeptiert und sollten ohnehin nicht mit -all= bereinigt werden, weil ihre Herstellernotizen Daten enthalten, die der RAW-Konverter braucht. Wenn Sie einen Copyright-Hinweis oder einen Titel behalten und zugleich GPS- und Geräte-Tags entfernen möchten, verwenden Sie stattdessen den Modus „Benutzerdefinierte Metadaten“ des Bildkonverters, der alles entfernt und nur die von Ihnen ausgefüllten Felder zurückschreibt. Und bedenken Sie, dass das Entfernen von Metadaten nicht entfernt, was im Bild sichtbar ist: Ein Straßenschild, eine Spiegelung oder ein Gesicht sagt immer noch, wo Sie waren; dafür gibt es die Tools zum Unkenntlichmachen von Gesichtern und zum Schwärzen von Text.',
      whyMediaManipulator: [
        'Sie sehen die Beweise. Der Inspektor listet jeden Tag vor dem Entfernen auf, und ein Vergleich belegt danach, was weg ist, statt eines grünen Häkchens und eines Versprechens.',
        'Ein Durchgang, jede Gruppe. ExifTool -all= entfernt EXIF, GPS, XMP, IPTC, Photoshop, ICC, Herstellernotizen und das Vorschaubild zusammen; nichts muss Block für Block angehakt werden.',
        'Die Ausrichtung wird berücksichtigt. Der Rotations-Tag wird auf die Pixel angewendet, bevor er entfernt wird, damit ein bereinigtes Handyfoto anderswo nicht auf der Seite liegt, was üblicherweise passiert, wenn der Tag entfernt wird, ohne die Pixel zu drehen.',
      ],
      privacyNote: 'Dieses Tool entfernt aus der zurückgegebenen Kopie die EXIF-Blöcke (Kameramarke, Modell, Seriennummer, Objektiv, Belichtung, Daten), den GPS-Block, das IFD1-Vorschaubild, XMP- und IPTC-Datensätze, Photoshop-Ressourcen, Herstellernotizen und das ICC-Profil. Dafür muss der Server sie zuerst lesen: Der Upload wird mit ExifTool untersucht, der Bericht wird als metadata.json im Auftragsordner gespeichert, und nach dem Entfernen wird ein zweiter Bericht über das Ergebnis daneben abgelegt, damit die Vergleichsansicht den Unterschied zeigen kann. Beide Berichte und beide Dateien liegen in uploads/<jobId>/ und outputs/<jobId>/ und werden gemeinsam gelöscht, wenn die Aufbewahrungsfrist endet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre. Der eigenständige Inspektor (Lesen einer Datei ohne Konvertierung) entfernt seine temporäre Kopie, sobald der Bericht erstellt ist. Bilder durchlaufen außerdem einen automatisierten Analyseschritt auf unserem eigenen Server; nichts wird an Dritte gesendet.',
      faq: [
        {
          question: 'Welche Metadatengruppen werden genau entfernt?',
          answer: 'Alles, was ExifTool schreiben kann: EXIF (IFD0, ExifIFD, InteropIFD), das GPS-IFD, das IFD1-Vorschaubild, XMP in allen seinen Namensräumen (xmp, dc, xmpMM, photoshop und so weiter), IPTC-IIM-Datensätze, Photoshop-Ressourcenblöcke, Herstellernotizen von Apple, Canon, Nikon, Sony und anderen Herstellern sowie das ICC-Farbprofil. Bei PNG umfasst das die Chunks tEXt, iTXt, zTXt, eXIf und iCCP; bei WebP die Chunks EXIF, XMP und ICCP.',
        },
        {
          question: 'Wird das Bild neu kodiert?',
          answer: 'Ja. Die Datei durchläuft ImageMagick (das auch den Ausrichtungs-Tag auf die Pixel anwendet), bevor ExifTool die Tags entfernt. Ein JPG wird mit Qualität 85 neu geschrieben, ein PNG verlustfrei, ein WebP mit Qualität 85. Optisch ist die JPG-Neukodierung bei normaler Betrachtungsgröße kaum vom Original zu unterscheiden, aber es ist nicht der identische Bitstream.',
        },
        {
          question: 'Warum kam mein HEIC als JPG zurück?',
          answer: 'Das Ein-Klick-Entfernen behält den Container bei JPG, PNG, WebP, GIF und AVIF. HEIC, TIFF und BMP werden dekodiert und als JPG geschrieben, damit sich das Ergebnis überall öffnen lässt. Wenn Sie ein HEIC zurückbrauchen, konvertieren Sie es im Bildkonverter mit der Metadaten-Einstellung „Entfernen“.',
        },
        {
          question: 'Wird das Farbprofil entfernt, und spielt das eine Rolle?',
          answer: 'Ja, exiftool -all= entfernt das ICC-Profil. Bei einem Standard-sRGB-Foto ändert sich nichts, weil Anzeigeprogramme ohne Profil sRGB annehmen. Bei einem Display-P3-Foto mit großem Farbraum von einem aktuellen Telefon können die Farben in Software, die Profile berücksichtigt, etwas weniger gesättigt aussehen. Wenn Ihnen das wichtig ist, verwenden Sie den Modus „Benutzerdefinierte Metadaten“ des Bildkonverters und behalten Sie dort das Profil.',
        },
        {
          question: 'Kann ich eine Copyright-Zeile oder einen Titel behalten?',
          answer: 'Nicht mit dem Ein-Klick-Entfernen, das alles entfernt. Der Metadatenbereich des Bildkonverters hat einen Modus „Benutzerdefiniert“, der die Datei bereinigt und dann nur zurückschreibt, was Sie eingeben: Titel, Autor, Beschreibung, Copyright, Kommentar, Schlüsselwörter und ausgewählte EXIF- oder GPS-Felder. Verwenden Sie diesen, wenn Sie eine saubere Datei möchten, die trotzdem Ihren Namen nennt.',
        },
        {
          question: 'Woher weiß ich, dass es funktioniert hat?',
          answer: 'Die Ergebnisseite nennt die Anzahl der entfernten Tags und weist darauf hin, wenn Standortdaten darunter waren. Öffnen Sie „Vergleichen“ für den vollständigen Vorher-Nachher-Vergleich: Es ist derselbe ExifTool-Bericht, ausgeführt auf der Ausgabedatei, sodass eine überlebende GPS- oder Seriennummern-Zeile dort erscheinen würde.',
        },
        {
          question: 'Ist es kostenlos, und wie viele Fotos kann ich bereinigen?',
          answer: 'Ja. Jedes Bereinigen ist ein Upload über den Standardkonverter und zählt daher zum täglichen Vorgangskontingent: standardmäßig 5 pro Tag ohne Konto und bis zu 200 MB pro Datei, 30 pro Tag mit einem kostenlosen Konto und Dateien bis 1 GB, 300 mit Premium und 700 mit Pro. Ein fehlgeschlagener Auftrag gibt seine Einheit zurück. Die aktuellen Zahlen stehen auf der Preisseite.',
        },
      ],
      related: [
        {
          label: 'Gesichter im Foto unkenntlich machen',
          to: '/tools/blur-faces-in-photo',
          description: 'Metadaten sind nur die halbe Geschichte; verbergen Sie die Gesichter, die das Bild selbst zeigt.',
        },
        {
          label: 'Text im Bild schwärzen',
          to: '/tools/redact-text-in-image',
          description: 'Schwärzen Sie Namen, Adressen und Nummern, die im Bild zu lesen sind.',
        },
        {
          label: 'Bild komprimieren',
          to: '/tools/compress-image',
          description: 'Verkleinern Sie das bereinigte Foto vor dem Posten.',
        },
        {
          label: 'Bild in PDF',
          to: '/tools/image-to-pdf',
          description: 'Fassen Sie bereinigte Fotos von Dokumenten in einem PDF zusammen.',
        },
        {
          label: 'Datenschutzerklärung',
          to: '/privacy-policy',
          description: 'Wie Uploads, Berichte und Ergebnisse gespeichert und gelöscht werden.',
        },
      ],
      embed: {
        title: 'Metadaten aus einem Bild entfernen',
        description: 'Laden Sie ein JPG-, PNG-, WebP- oder HEIC-Foto hoch. Wir zeigen jeden enthaltenen Tag; klicken Sie dann auf „Alles entfernen“, um sie alle zu entfernen und genau zu sehen, was entfernt wurde.',
      },
    },
    'compress-image': {
      name: 'Bild komprimieren',
      h1: 'Bild online kostenlos komprimieren',
      tagline: 'Verkleinern Sie JPG-, PNG- und WebP-Dateien für schnellere Websites, kleinere Uploads und einfacheres Teilen.',
      metaTitle: 'Bild online kostenlos komprimieren | Media Manipulator',
      metaDescription: 'Kostenloser Online-Bildkompressor. Verkleinern Sie JPG-, PNG- und WebP-Dateien bei guter Qualität. Ohne Anmeldung. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ogTitle: 'Bild online kostenlos komprimieren',
      ogDescription: 'Verkleinern Sie JPG-, PNG- und WebP-Dateien bei guter Qualität. Kostenlos, schnell, ohne Anmeldung.',
      intro: 'Ein Bild zu komprimieren bedeutet, es neu zu kodieren, sodass dasselbe Bild weniger Bytes belegt. Diese Seite öffnet den Bildkonverter mit dem Qualitätsfeld bereits auf 80 gesetzt und dem Ausgabeformat passend zu Ihrem Upload, sodass ein JPG ein JPG bleibt und ein WebP ein WebP. Auf unserem Server ist der Auftrag ein einziger ImageMagick-Befehl: Die Datei wird anhand ihres EXIF-Rotations-Flags automatisch ausgerichtet und dann mit -quality 80 geschrieben, oder mit der Zahl zwischen 1 und 100, die Sie eingeben. Bei JPG und WebP entscheidet diese Zahl über die Dateigröße. Bei PNG wird sie ignoriert, weil PNG verlustfrei ist, der eigentliche Hebel für ein PNG-Foto ist also der Wechsel der Ausgabe zu JPG oder WebP.',
      whatItDoes: [
        'Kodiert JPG- und WebP-Ausgabe mit der von Ihnen gewählten Qualität neu; das Formular beginnt bei 80.',
        'Behält das Eingabeformat, sofern Sie es nicht ändern; der Wechsel eines PNG-Fotos zu WebP oder JPG ist die Quelle der großen Einsparungen bei PNG.',
        'Kann im selben Durchgang die Pixelmaße verkleinern: Eine in die Größenfelder eingegebene Breite oder Höhe wird vor der Qualitätseinstellung angewendet, sodass sich beide Einsparungen addieren.',
        'Kopiert die ursprünglichen EXIF-, IPTC- und XMP-Tags zurück auf die komprimierte Datei, sofern Sie den Metadatenmodus nicht auf „Entfernen“ setzen.',
        'Schreibt das Ergebnis als converted.jpg, converted.webp oder converted.png in den Ausgabeordner des Auftrags, den der Download-Link ausliefert.',
      ],
      flowSteps: [
        {
          title: 'JPG, PNG oder WebP hochladen',
          description: 'Alles bis zur Dateigrößengrenze Ihres Tarifs, die für Gäste standardmäßig 200 MB beträgt.',
        },
        {
          title: 'Qualitätszahl wählen',
          description: '80 ist voreingestellt. 60 bis 75 komprimiert stärker; 90 und mehr behält fast alles.',
        },
        {
          title: 'ImageMagick kodiert neu',
          description: 'convert input -auto-orient -quality N output, gefolgt von einem exiftool-Durchgang, der die Tags überträgt.',
        },
        {
          title: 'Kleinere Datei herunterladen',
          description: 'Die Ausgabe wird aus dem Auftragsordner ausgeliefert, bis ihre Aufbewahrungsfrist endet.',
        },
      ],
      advancedDetails: [
        'Der genaue Befehl ist ImageMagick convert mit dem Eingabepfad zuerst, dann -auto-orient, optional -crop und -resize, dann -quality N, dann der Ausgabepfad. Das Argument -quality wird nur angehängt, wenn das Ausgabeformat jpg, jpeg oder webp ist (convertImage in converter.go).',
        'Die Qualität wird auf dem Server auf den Bereich 1 bis 100 geprüft; ein Wert außerhalb wird abgelehnt, bevor irgendeine Arbeit beginnt, und die Auftragseinheit wird zurückerstattet.',
        'PNG-Ausgabe erhält nie ein Argument -quality, daher ändert eine niedrigere Zahl bei einem PNG-zu-PNG-Auftrag nichts. Der Konverter führt weder pngquant noch eine Palettenreduktion aus; um ein PNG kleiner zu machen, ändern Sie sein Format.',
        'Im Standard-Metadatenmodus führt der Server exiftool -TagsFromFile <original> -all:all -unsafe auf dem Ergebnis aus, sodass Kamera-, Objektiv-, Datums- und GPS-Tags die Kompression überstehen. Die Wahl von „Entfernen“ führt stattdessen exiftool -all= auf der Ausgabe aus.',
        'Eine Größenänderung, falls Sie eine festlegen, erfolgt vor der Anwendung der Qualität. Eine Breite allein behält das Seitenverhältnis; Breite plus Höhe erzwingt genau diesen Rahmen, auch wenn das Verhältnis abweicht.',
        'Filter, eine Tönung und eine Textüberlagerung sind im selben Formular verfügbar: Ein Filter wird direkt nach der Größenänderung angewendet, Tönung und Textüberlagerung werden zuletzt hinzugefügt, nach der Qualitätseinstellung.',
      ],
      whyItMatters: [
        'Bild-Bytes sind meist der größte Teil einer Webseite oder E-Mail, sie zu halbieren ist also der günstigste verfügbare Geschwindigkeitsgewinn.',
        'Upload-Formulare, CMS-Felder und Messenger setzen Grenzen in Megabyte durch, nicht in Pixeln.',
        'Einmal mit einer selbst gewählten Qualität neu zu kodieren ist besser, als eine Plattform nach ihren eigenen Regeln neu kodieren zu lassen.',
      ],
      useCases: [
        {
          title: 'Blog- und Produktfotos',
          description: 'Bringen Sie ein 4 bis 6 MB großes Kamera-JPEG vor dem Veröffentlichen deutlich unter 1 MB.',
        },
        {
          title: 'E-Mail-Anhänge',
          description: 'Bringen Sie eine Reihe von Fotos unter ein Postfachlimit von 20 oder 25 MB.',
        },
        {
          title: 'Bewerbungsportale',
          description: 'Halten Sie ein 2-MB-Limit für Porträt- oder Dokumentfotos ohne sichtbaren Verlust ein.',
        },
        {
          title: 'Arbeitskopien',
          description: 'Behalten Sie kleinere Kopien für den Alltag, während die Originale in Ihrem Archiv bleiben.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein Handy-JPEG mit 4000 x 3000 bei Qualität 80 mit 1600 px Breite',
          body: 'Eingabe: ein JPEG mit 4,8 MB, 4000 x 3000 Pixel, direkt aus einer Handykamera. Einstellungen: Breite 1600, Höhe leer gelassen, Qualität 80, Format unverändert. ImageMagick führt -resize 1600x aus, was das Verhältnis behält und 1600 x 1200 Pixel ergibt: 1,92 Megapixel gegenüber den ursprünglichen 12, etwa ein Sechstel der Pixel. Das Ergebnis wird mit -quality 80 geschrieben und erhält sein EXIF zurückkopiert, die Ausgabe ist also ein JPG mit 1600 x 1200, dessen Größe dieser Pixelreduktion folgt, grob ein Sechstel des Originals, rechnen Sie also mit etwa 1 MB oder weniger statt 4,8 MB. Die Konvertierung ist ein einzelner ImageMagick-Durchgang über ein Bild mit 12 Megapixeln und dauert wenige Sekunden; das Hochladen der 4,8-MB-Datei dauert meist länger als das Konvertieren.',
        },
        {
          title: 'Ein PNG-Screenshot mit 2,6 MB zu WebP gewechselt',
          body: 'Eingabe: ein PNG-Screenshot mit 1920 x 1080 und 2,6 MB ohne Transparenz. Das Format bei PNG zu lassen und die Qualität auf 60 zu senken, würde nichts ändern, weil -quality bei PNG-Ausgabe nicht übergeben wird. Der Wechsel der Ausgabe zu WebP mit der Voreinstellung 80 führt convert input -auto-orient -quality 80 converted.webp aus. Unkomprimiert sind diese 2.073.600 Pixel 6,2 MB RGB; verlustbehaftetes WebP mit Qualität 80 behält nur einen Bruchteil davon, das Ergebnis ist also ein Bruchteil des PNG mit 2,6 MB, wobei die genaue Zahl davon abhängt, wie viel flache Farbe und Text der Screenshot enthält. Die Maße bleiben 1920 x 1080, und der Auftrag ist in wenigen Sekunden fertig.',
        },
      ],
      whenNotToUse: 'Verwenden Sie keine verlustbehaftete Kompression bei einem Bild, das Sie noch stark bearbeiten wollen, bei einem PNG, dessen Transparenz Sie als PNG behalten müssen (der Wechsel zu JPG entfernt den Alphakanal), oder bei Screenshots mit kleiner Schrift, bei denen eine Qualität deutlich unter 85 die Buchstaben verschmieren lässt. Wenn die Datei nur wegen ihrer Pixelmaße groß ist, ist der Bildgrößen-Änderer der bessere erste Schritt; wenn es Ihnen um Datenschutz statt Größe geht, entfernt der EXIF-Entferner Tags, ohne die Pixel anzutasten. Und ein JPG, das bereits mit Qualität 70 gespeichert wurde, wird bei 80 nicht viel kleiner; jedes erneute Speichern fügt Verlust hinzu, ohne entsprechenden Gewinn.',
      whyMediaManipulator: [
        'Der ausgeführte Befehl steht auf dieser Seite, einschließlich der Tatsache, dass PNG die Qualitätszahl ignoriert, sodass Sie nicht raten müssen, warum eine Datei nicht kleiner wurde.',
        'Qualität, Größenänderung, Format und Metadaten-Steuerung liegen in einem Formular und einem Upload, und es wird kein Wasserzeichen hinzugefügt.',
        'Nichts zu installieren und kein Konto für das Standardtool nötig. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ],
      privacyNote: 'Ihr Bild wird unter uploads/<jobId>/ auf unserem eigenen Server gespeichert, ImageMagick schreibt die komprimierte Kopie nach outputs/<jobId>/, und ein Metadatenbericht des Originals wird daneben abgelegt. Im Standardmodus kopiert exiftool die ursprünglichen EXIF-, IPTC- und XMP-Tags auf die komprimierte Datei, sodass Standort- und Kameradaten mit dem Ergebnis zurückkommen, sofern Sie nicht die Option „Entfernen“ wählen. Jedes hochgeladene Bild wird außerdem einer automatisierten Analyse durch ein Bildmodell auf demselben Server übergeben, und seine JSON-Zusammenfassung wird beim Auftrag aufbewahrt. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre. Nichts wird an einen Drittanbieter gesendet.',
      faq: [
        {
          question: 'Ist das Komprimieren eines Bildes hier kostenlos?',
          answer: 'Ja, für das Standardtool. Ein Kompressionsauftrag verbraucht einen der Vorgänge des Tages: Gäste erhalten standardmäßig 5 pro Tag mit einer Grenze von 200 MB pro Datei, ein kostenloses Konto erhöht das auf 30 pro Tag und 1 GB pro Datei, und Premium und Pro gehen auf 300 und 700. Die aktuellen Zahlen stehen auf /pricing, weil sich die Limits ändern können.',
        },
        {
          question: 'Welche Qualitätszahl soll ich verwenden?',
          answer: '80 ist voreingestellt und ein sinnvoller Standard für Fotos. Gehen Sie nur tiefer, wenn ein hartes Größenlimit es erzwingt, und auf 90 oder mehr bei Bildern, die später gedruckt oder zugeschnitten werden. Die Zahl wird direkt an die Option -quality von ImageMagick übergeben und bedeutet daher dasselbe wie in anderen auf ImageMagick aufgebauten Tools.',
        },
        {
          question: 'Warum wurde mein PNG nicht kleiner?',
          answer: 'Weil das Qualitätsfeld bei PNG-Ausgabe nichts bewirkt: Der Server fügt -quality nur bei jpg, jpeg und webp hinzu. Ändern Sie das Ausgabeformat auf WebP oder JPG. Wenn Sie Transparenz behalten müssen, behält WebP einen Alphakanal, JPG nicht.',
        },
        {
          question: 'Behält die Kompression meine EXIF- und GPS-Daten?',
          answer: 'Standardmäßig ja. Nachdem ImageMagick die Datei geschrieben hat, kopiert exiftool jede Tag-Gruppe vom Original auf das Ergebnis. Wählen Sie im Metadatenbereich „Entfernen“, um sie alle zu entfernen, oder verwenden Sie den eigenen EXIF-Entferner.',
        },
        {
          question: 'Wird das Bild auch in der Größe geändert?',
          answer: 'Nicht, solange Sie keine Breite oder Höhe eingeben. Sind beide Felder leer, bleiben die Pixelmaße unverändert, und nur die Kodierung ändert sich.',
        },
        {
          question: 'Kann ich mehrere Bilder auf einmal komprimieren?',
          answer: 'Jeder Upload ist ein Auftrag mit einer Ausgabedatei. Führen Sie das Tool einmal pro Bild aus; jeder Auftrag zählt als ein Vorgang gegen das Tageskontingent.',
        },
        {
          question: 'Ist WebP bei gleicher Qualität immer kleiner als JPG?',
          answer: 'Bei Fotos meist ja, aber die Qualitätsskalen der beiden Encoder sind nicht identisch, vergleichen Sie also die beiden Ausgaben, statt es anzunehmen. Bleiben Sie bei JPG, wenn die Datei in Software geöffnet werden muss, die älter ist als die WebP-Unterstützung.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Eine niedrigere Qualität wirkt sich auf JPG- und WebP-Ausgabe aus. Um ein PNG-Foto stark zu verkleinern, konvertieren Sie es zu JPG oder WebP.',
        ],
      },
      related: [
        {
          label: 'Bildgröße ändern',
          to: '/tools/image-resizer',
          description: 'Reduzieren Sie zuerst die Pixelmaße für die größten Einsparungen.',
        },
        {
          label: 'EXIF-Metadaten entfernen',
          to: '/tools/remove-exif-metadata',
          description: 'Entfernen Sie Standort- und Kamera-Tags ohne Neukodierung.',
        },
        {
          label: 'Bild in PDF',
          to: '/tools/image-to-pdf',
          description: 'Verpacken Sie das komprimierte JPG in ein einseitiges PDF.',
        },
        {
          label: 'KI-Bild-Upscaler',
          to: '/tools/ai-image-upscaler',
          description: 'Gehen Sie den umgekehrten Weg und vergrößern Sie ein kleines Bild.',
        },
        {
          label: 'Bildkonverter-Tutorial',
          to: '/tutorials/image/getting-started',
          description: 'Schritt für Schritt durch Qualitäts-, Größen- und Formateinstellungen.',
        },
      ],
      embed: {
        title: 'Ein Bild komprimieren',
        description: 'Laden Sie ein Bild hoch und senken Sie den Qualitätsregler, um die Datei zu verkleinern. Das Ausgabeformat bleibt standardmäßig gleich, oder wechseln Sie zu WebP für die kleinste Größe. Eine Qualität um 75–85 ist ein guter Kompromiss.',
      },
    },
    'image-resizer': {
      name: 'Bildgröße ändern',
      h1: 'Bildgröße online kostenlos ändern',
      tagline: 'Bringen Sie JPG-, PNG-, WebP- und GIF-Bilder auf exakte Pixelmaße und behalten Sie dabei das Seitenverhältnis.',
      metaTitle: 'Bildgröße online kostenlos ändern | Media Manipulator',
      metaDescription: 'Kostenloser Online-Bildgrößen-Änderer. Bringen Sie JPG-, PNG-, WebP- und GIF-Bilder auf exakte Pixelmaße und behalten Sie das Seitenverhältnis. Ohne Anmeldung. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ogTitle: 'Bildgröße online kostenlos ändern',
      ogDescription: 'Bringen Sie JPG-, PNG-, WebP- und GIF-Bilder auf exakte Pixelmaße. Kostenlos, schnell, ohne Anmeldung.',
      intro: 'Diese Seite öffnet den Bildkonverter mit den Größenfeldern im Vordergrund. Geben Sie eine Breite, eine Höhe oder beides ein, und der Server führt ImageMagick mit einem -resize-Argument aus, das genau aus Ihrer Eingabe gebildet wird: 1600x für eine Breite allein, x900 für eine Höhe allein und 1600x900! wenn Sie beides ausfüllen. Dieses abschließende Ausrufezeichen ist wichtig: Es weist ImageMagick an, genau diesen Rahmen zu erzeugen, auch wenn das Verhältnis vom Original abweicht, was das Bild verzerrt. Die Regel ist also einfach: Ein Feld behält die Proportionen; zwei Felder liefern die exakte Größe und vertrauen darauf, dass Sie ein passendes Verhältnis gewählt oder zuerst zugeschnitten haben.',
      whatItDoes: [
        'Skaliert JPG-, PNG-, WebP- und GIF-Bilder auf die eingegebene Pixelbreite und -höhe, nachdem sie anhand des EXIF-Rotations-Flags automatisch ausgerichtet wurden.',
        'Behält das Seitenverhältnis, wenn nur eine Abmessung ausgefüllt ist; erzwingt den exakten Rahmen, wenn beide ausgefüllt sind.',
        'Bietet im selben Formular einen Zuschnittrahmen, der vor der Größenänderung angewendet wird; so erhalten Sie ein exaktes Quadrat oder Banner ohne Verzerrung.',
        'Schreibt die Ausgabe standardmäßig im Originalformat, mit einer Qualität von 85 für JPG und WebP, und kopiert die ursprünglichen Metadaten-Tags darauf.',
        'Begrenzt die angeforderte Höhe auf die Ausgabegrenze Ihres Tarifs und die Maße auf das, was ImageMagick erzeugen darf.',
      ],
      flowSteps: [
        {
          title: 'Bild hochladen',
          description: 'JPG, PNG, WebP oder GIF, bis zur Dateigrößengrenze Ihres Tarifs.',
        },
        {
          title: 'Breite, Höhe oder beides eingeben',
          description: 'Ein Wert behält das Verhältnis. Zwei Werte erzwingen den Rahmen. Schneiden Sie zuerst zu, wenn sich das Verhältnis ändern muss.',
        },
        {
          title: 'ImageMagick ändert die Größe',
          description: 'Der Server führt convert input -auto-orient [-crop WxH+X+Y] -resize <arg> [-quality 85] output aus.',
        },
        {
          title: 'Herunterladen',
          description: 'Die skalierte Datei wird aus dem Ausgabeordner des Auftrags als converted.<format> ausgeliefert.',
        },
      ],
      advancedDetails: [
        'Das Resize-Argument wird in convertImage (converter.go) gebildet: Beide Werte ergeben WxH! (exakt erzwingen), Breite allein ergibt Wx, Höhe allein ergibt xH. Der Standard-Resampling-Filter von ImageMagick wird verwendet; es gibt keine Option für einen anderen.',
        'Ein Zuschnitt, falls gesetzt, wird als -crop WxH+X+Y übergeben und läuft vor -resize, sodass sich die Zuschnittkoordinaten auf das automatisch ausgerichtete Original beziehen, nicht auf das skalierte Ergebnis.',
        'Der Server lehnt eine Breite oder Höhe über 10000 oder unter 1 ab, und das Formular begrenzt beide Felder auf 4096.',
        'Eine explizite Höhe wird außerdem vor Annahme des Uploads gegen die Ausgabehöhengrenze Ihres Tarifs geprüft: standardmäßig 1080 px für Gäste, 1440 mit einem kostenlosen Konto, 2160 bei Premium und Pro. Eine Anfrage über der Grenze wird mit einer Meldung abgelehnt, die beide Zahlen nennt, und es wird keine Einheit verbraucht. Die Breite allein wird nicht geprüft.',
        'JPG- und WebP-Ausgabe erhalten -quality 85, sofern Sie die Zahl nicht ändern; PNG und GIF ignorieren sie. Vergrößern mit diesem Tool interpoliert nur vorhandene Pixel, daher wirkt eine 2x- oder 4x-Vergrößerung weich; für diesen Fall gibt es den KI-Upscaler.',
        'Nachdem ImageMagick fertig ist, kopiert exiftool im Standard-Metadatenmodus die ursprünglichen Tags auf das Ergebnis, sodass die skalierte Datei weiterhin Aufnahmedatum, Kameramodell und eine etwaige GPS-Position trägt.',
      ],
      whyItMatters: [
        'Avatar-, Titelbild- und Vorschaubild-Felder verlangen bestimmte Pixelgrößen, und eine Skalierung durch die Plattform ist meist eine unkontrollierte mit geringerer Qualität.',
        'Die Pixelzahl ist der größte Einzelfaktor für die Dateigröße; ein Foto mit 24 Megapixeln, das 1920 px breit angezeigt wird, trägt zehnmal so viele Daten, wie der Bildschirm zeigen kann.',
        'Nach eigenen Vorgaben zu skalieren lässt Sie auch den Zuschnitt wählen, statt ein quadratisches Feld einen Kopf abschneiden zu lassen.',
      ],
      useCases: [
        {
          title: 'Profilbilder und Avatare',
          description: 'Schneiden Sie auf ein Quadrat zu und skalieren Sie dann auf die 400 oder 512 px, die der Dienst verlangt.',
        },
        {
          title: 'Web- und Blogbilder',
          description: 'Skalieren Sie Kamerafotos auf die Spaltenbreite, in der sie tatsächlich angezeigt werden.',
        },
        {
          title: 'Banner und Kopfbilder',
          description: 'Schneiden Sie das exakte Seitenverhältnis zu und treffen Sie dann die geforderte Breite pixelgenau.',
        },
        {
          title: 'Upload-Limits in Formularen',
          description: 'Senken Sie die Maße, um unter eine Megapixel- oder Megabyte-Grenze zu kommen.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein Kamera-JPEG mit 6000 x 4000 auf 1920 px Breite skaliert',
          body: 'Eingabe: ein JPEG mit 8,5 MB und 24 Megapixeln aus einer spiegellosen Kamera. Einstellungen: Breite 1920, Höhe leer, Format unverändert, Qualität 85. Der Server führt convert input -auto-orient -resize 1920x -quality 85 converted.jpg aus. Das Verhältnis ist 3:2, die Ausgabe hat also 1920 x 1280 Pixel, etwa 2,46 Megapixel, grob ein Zehntel der ursprünglichen Pixelzahl. Die Dateigröße sinkt in ähnlichem Verhältnis, rechnen Sie also mit etwas unter 1 MB. Ein ImageMagick-Durchgang über 24 Megapixel dauert auf dem Server wenige Sekunden, und das anschließende Kopieren mit exiftool behält die Objektiv- und Belichtungs-Tags.',
        },
        {
          title: 'Ein Avatar mit 400 x 400 aus einem Hochformat-Handyfoto mit 3024 x 4032',
          body: 'Eingabe: ein Hochformat-JPEG mit 3,1 MB, 3024 breit und 4032 hoch. Nur 400 und 400 einzugeben würde -resize 400x400! ausführen und das 3:4-Bild zu einem Quadrat zusammenquetschen. Setzen Sie stattdessen den Zuschnitt auf 3024 x 3024 bei Versatz 0,504 (ein Quadrat aus der Mitte), dann Breite 400 und Höhe 400. Der Befehl wird zu convert input -auto-orient -crop 3024x3024+0+504 -resize 400x400! -quality 85 converted.jpg, und das Ergebnis ist ein unverzerrtes JPG mit 400 x 400 und 160.000 Pixeln, einige Dutzend Kilobyte. Zuschnitt und Größenänderung sind ein Durchgang und in wenigen Sekunden fertig.',
        },
      ],
      whenNotToUse: 'Verwenden Sie den Größen-Änderer nicht, um ein kleines Bild zu vergrößern: ImageMagick interpoliert nur die vorhandenen Pixel, ein Foto mit 640 px, das auf 2560 px gezogen wird, kommt also unscharf heraus, und dieser Fall gehört zum KI-Upscaler. Geben Sie nicht Breite und Höhe mit einem vom Bild abweichenden Verhältnis ein, ohne zuerst zuzuschneiden, denn der Exakt-Modus verzerrt, statt Ränder hinzuzufügen. Wenn die Datei groß ist, die Maße aber bereits stimmen, verwenden Sie stattdessen den Kompressor und lassen Sie die Pixel in Ruhe. Und animierte GIFs sind mit einem eigenen GIF-Tool besser bedient als mit einer einfachen Größenänderung.',
      whyMediaManipulator: [
        'Das Verhalten „exakter Rahmen“ gegenüber „Verhältnis behalten“ ist hier mit den echten ImageMagick-Argumenten erklärt, sodass es keine Überraschung gibt, wenn ein Foto verzerrt zurückkommt.',
        'Zuschnitt, Größenänderung, Format und Qualität sind ein Upload, und die Ausgabe trägt kein Wasserzeichen.',
        'Keine Anmeldung für das Standardtool. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ],
      privacyNote: 'Das hochgeladene Bild wird unter uploads/<jobId>/ auf unserem Server gespeichert und die skalierte Kopie unter outputs/<jobId>/; beide Verzeichnisse stehen im Aufbewahrungsregister und werden gemeinsam entfernt. Da der Standard-Metadatenmodus die ursprünglichen Tags mit exiftool auf die skalierte Datei kopiert, reisen GPS-Koordinaten und die Kamera-Seriennummer mit dem Ergebnis mit, sofern Sie im Metadatenbereich des Formulars nicht „Entfernen“ wählen. Zum Skalieren hochgeladene Bilder durchlaufen außerdem die automatisierte Analyse, die auf unserem Server für jedes Bild läuft, mit einem lokalen Bildmodell, wobei die Zusammenfassung im Auftragsordner gespeichert wird. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre. Kein Dritter erhält die Datei.',
      faq: [
        {
          question: 'Kostet das Ändern der Größe etwas?',
          answer: 'Kein Konto und keine Zahlung für das Standardtool. Jede Größenänderung ist ein täglicher Vorgang: standardmäßig 5 pro Tag für Gäste und 30 für ein kostenloses Konto, mit einer Grenze von 200 MB bzw. 1 GB pro Datei. Premium und Pro erhöhen die Zahlen auf 300 und 700. Siehe /pricing für die heute geltenden Zahlen.',
        },
        {
          question: 'Wie behalte ich das Seitenverhältnis?',
          answer: 'Füllen Sie nur eines der beiden Felder aus. Eine Breite allein wird zu -resize 1600x, und die Höhe wird aus dem ursprünglichen Verhältnis berechnet; eine Höhe allein wird zu x900, und die Breite folgt.',
        },
        {
          question: 'Warum kam mein Bild verzerrt heraus?',
          answer: 'Sie haben Breite und Höhe mit einem Verhältnis ausgefüllt, das nicht zum Bild passt. Zwei Werte werden als WxH! gesendet, was genau diesen Rahmen erzwingt. Schneiden Sie zuerst im selben Formular auf das Zielverhältnis zu und setzen Sie dann beide Werte.',
        },
        {
          question: 'Welche Größe kann ich maximal anfordern?',
          answer: 'Das Formular akzeptiert bis zu 4096 für jedes Feld und der Server bis zu 10000. Eine explizite Höhe über der Ausgabegrenze Ihres Tarifs (standardmäßig 1080 px für Gäste) wird vor Beginn des Uploads abgelehnt und kostet nichts.',
        },
        {
          question: 'Kann ich mit diesem Tool ein kleines Foto vergrößern?',
          answer: 'Sie können eine größere Zahl eingeben, aber ImageMagick interpoliert nur, das Ergebnis ist also weich. Für eine 2x- oder 4x-Vergrößerung, die Details neu aufbaut, verwenden Sie den KI-Upscaler, der stattdessen Real-ESRGAN ausführt.',
        },
        {
          question: 'Behält die Ausgabe meine EXIF-Daten und die Ausrichtung?',
          answer: 'Die Pixel werden zuerst automatisch ausgerichtet, sodass das Ergebnis überall aufrecht angezeigt wird, und im Standardmodus kopiert exiftool die ursprünglichen Tags zurück. Wählen Sie „Entfernen“, wenn die Tags weg sollen.',
        },
        {
          question: 'Kann ich die Größe eines GIF ändern?',
          answer: 'GIF wird als Eingabe und Ausgabe akzeptiert und durchläuft denselben ImageMagick-Befehl. Das Tool ist für Standbilder gebaut; bei animierten GIFs bietet ein eigenes GIF-Tool mehr Kontrolle über Bilder und Palette.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Lassen Sie eine Abmessung leer, um proportional zu skalieren und das Seitenverhältnis zu behalten.',
        ],
      },
      related: [
        {
          label: 'Bild komprimieren',
          to: '/tools/compress-image',
          description: 'Senken Sie die Qualität, ohne die Maße zu ändern.',
        },
        {
          label: 'KI-Bild-Upscaler',
          to: '/tools/ai-image-upscaler',
          description: 'Vergrößern Sie 2x oder 4x mit einem Modell statt mit Interpolation.',
        },
        {
          label: 'EXIF-Metadaten entfernen',
          to: '/tools/remove-exif-metadata',
          description: 'Entfernen Sie die Tags, die die Größenänderung standardmäßig behält.',
        },
        {
          label: 'Bild in PDF',
          to: '/tools/image-to-pdf',
          description: 'Verpacken Sie das skalierte Bild in eine PDF-Seite.',
        },
        {
          label: 'Bildkonverter-Tutorial',
          to: '/tutorials/image/getting-started',
          description: 'Schritt für Schritt durch Größen-, Zuschnitt- und Qualitätseinstellungen.',
        },
      ],
      embed: {
        title: 'Bildgröße ändern',
        description: 'Laden Sie ein Bild hoch und legen Sie unten eine Zielbreite und/oder -höhe fest. Lassen Sie ein Feld leer, um proportional zu skalieren und das ursprüngliche Seitenverhältnis zu behalten. Das Ausgabeformat bleibt gleich, sofern Sie es nicht ändern.',
      },
    },
    'remove-background-from-image': {
      name: 'Hintergrund aus Bild entfernen',
      h1: 'Hintergrund aus Bild online kostenlos entfernen',
      tagline: 'Entfernen Sie automatisch den Hintergrund aus jedem Foto und laden Sie einen sauberen, transparenten PNG-Ausschnitt herunter.',
      metaTitle: 'Hintergrund aus Bild online kostenlos entfernen | Media Manipulator',
      metaDescription: 'Kostenloser Online-Hintergrundentferner. Entfernen Sie automatisch den Hintergrund aus jedem Foto und laden Sie ein transparentes PNG herunter. Läuft auf unserer eigenen GPU, ohne externe KI. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ogTitle: 'Hintergrund aus Bild online kostenlos entfernen',
      ogDescription: 'Entfernen Sie automatisch den Hintergrund aus jedem Foto und laden Sie einen transparenten PNG-Ausschnitt herunter. Kostenlos, ohne Anmeldung.',
      intro: 'Diese Seite öffnet den Bildkonverter mit der KI-Operation fest auf „Hintergrund entfernen“ und der Ausgabe fest auf PNG. Beim Konvertieren übergibt der Server Ihre Datei an rembg, ein Open-Source-Segmentierungstool, das auf einer GPU in unserem Besitz läuft: Standardmäßig lädt es das Modell BiRefNet General, bestimmt, welche Pixel zum Motiv gehören, und schreibt ein PNG, dessen Alphakanal überall sonst transparent ist. Sechs weitere Modelle sind im Formular wählbar (ein leichteres BiRefNet, eine Porträtvariante, ISNet und drei U2Net-Builds) für Fälle, in denen das allgemeine Modell Haare, Glas oder eine Person vor unruhigem Hintergrund falsch einschätzt.',
      whatItDoes: [
        'Führt rembg mit dem gewählten Modell aus (BiRefNet General, sofern Sie es nicht ändern) und liefert das Motiv auf transparentem Hintergrund.',
        'Schreibt immer PNG, weil Transparenz einen Alphakanal braucht und die API für diese Operation die Endung .png erzwingt.',
        'Behält die vollen Pixelmaße Ihres Uploads; der Ausschnitt wird weder skaliert noch zugeschnitten.',
        'Läuft auf unserer eigenen GPU über ONNX Runtime mit CUDA; kein Bild wird an einen externen KI-Dienst gesendet.',
        'Zählt als ein Standardauftrag, dieselbe Einheit wie eine einfache Formatkonvertierung, nicht als KI-Auftrag.',
      ],
      flowSteps: [
        {
          title: 'JPG, PNG oder WebP hochladen',
          description: 'Ein einzelnes klares Motiv ergibt die sauberste Maske.',
        },
        {
          title: 'Modell wählen oder Standard behalten',
          description: 'BiRefNet General ist vorausgewählt; die Porträt- und Personensegmentierungsmodelle gibt es für Menschen.',
        },
        {
          title: 'rembg segmentiert auf der GPU',
          description: 'rembg i -m <model> input output.png läuft mit geladener CUDA-ONNX-Runtime-Umgebung.',
        },
        {
          title: 'Transparentes PNG herunterladen',
          description: 'Das Ergebnis ist converted.png im Ausgabeordner des Auftrags.',
        },
      ],
      advancedDetails: [
        'Der Aufruf ist RemoveBackground in ai_tools.go: Eine Bash-Shell lädt das ONNX-Runtime-CUDA-Umgebungsskript, setzt U2NET_HOME auf das Modellverzeichnis des Servers und führt rembg i -m <model> <input> <output> aus. Die Modellgewichte sind auf dem Server zwischengespeichert, daher kann der erste Auftrag nach einem Neustart etwas länger dauern, während sie geladen werden.',
        'Zulässige Modellnamen sind birefnet-general, birefnet-general-lite, isnet-general-use, u2net, u2netp, u2net_human_seg und birefnet-portrait; jeder andere Wert wird vor dem Start des Auftrags abgelehnt. Ein leerer Wert wird zu birefnet-general.',
        'Der KI-Pfad ersetzt die ImageMagick-Pipeline vollständig, daher haben Qualitätszahl, Filter, Tönung, Textüberlagerung und Metadatenoptionen im Formular bei dieser Operation keine Wirkung; die Ausgabe ist das, was rembg schreibt.',
        'Da der normale exiftool-Kopierschritt bei KI-Operationen nicht läuft, trägt das PNG kein EXIF des Originals. Wenn Sie die Tags auf dem Ausschnitt brauchen, kann der Metadaten-Editor sie in einem zweiten Auftrag hinzufügen.',
        'Die Ausgabegröße folgt dem Motiv: Vollständig transparente Bereiche komprimieren in PNG auf fast nichts, ein kleines Produkt auf großer Fläche ergibt also eine kleine Datei, während ein formatfüllendes Motiv eine Datei nahe an einem verlustfreien PNG des Originals ergibt.',
      ],
      whyItMatters: [
        'Produktangebote, Vorschaubilder und Komposits beginnen alle mit einem Ausschnitt, und einen von Hand zu maskieren kostet Minuten pro Bild.',
        'Marktplätze verlangen zunehmend einen neutralen oder weißen Hintergrund, also einen transparenten Ausschnitt auf einer weißen Ebene.',
        'Ein auf Millionen von Masken trainiertes Modell behandelt Fell, Haare und halbtransparente Kanten besser als eine Zauberstab-Auswahl.',
      ],
      useCases: [
        {
          title: 'E-Commerce-Produkte',
          description: 'Isolieren Sie den Artikel und setzen Sie ihn auf Weiß oder eine beliebige Markenfarbe.',
        },
        {
          title: 'Porträts und Teamseiten',
          description: 'Verwenden Sie das Porträtmodell, um Personen sauber aus Bürohintergründen zu lösen.',
        },
        {
          title: 'Logos aus Fotos gelöst',
          description: 'Erhalten Sie eine transparente Version eines Logos, das nur auf einem farbigen Schild oder einer Seite existiert.',
        },
        {
          title: 'Vorschaubilder und Sticker',
          description: 'Bauen Sie in Ihrem Editor Designs mit Ebenen aus mehreren Ausschnitten.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein Produkt-JPEG mit 3000 x 2000 und dem Standardmodell',
          body: 'Eingabe: ein JPEG mit 2,1 MB und 3000 x 2000 von einem Schuh vor grauem Hintergrund. Modell bei BiRefNet General gelassen. Der Server führt rembg auf der GPU aus und schreibt converted.png mit denselben 3000 x 2000 Pixeln, vier Kanäle. Unkomprimiert sind das 24 MB RGBA, aber der transparente Hintergrund komprimiert auf fast nichts, die PNG-Größe wird also vom Schuh selbst bestimmt, typischerweise einige Megabyte, weil PNG verlustfrei ist. Die Zeit ist ein Vorwärtsdurchlauf des Modells über das Bild plus PNG-Kodierung, wenige Sekunden, sobald das Modell warm ist; der erste Durchlauf nach einer ruhigen Phase fügt die Ladezeit der Gewichte hinzu.',
        },
        {
          title: 'Ein Porträt mit 1080 x 1080 und dem Porträtmodell',
          body: 'Eingabe: ein WebP-Selfie mit 640 KB und 1080 x 1080 vor einem Bücherregal. Stellen Sie das Modell auf BiRefNet Portrait um, das auf Personen und Haare abgestimmt ist. Die Ausgabe ist ein PNG mit 1080 x 1080, in dem die Person deckend und die Regale vollständig transparent sind. Bei 1,17 Megapixeln ist der Modelldurchlauf schnell; der größte Teil der Gesamtzeit entfällt auf den Upload und das Schreiben des PNG. Da der KI-Pfad das Kopieren der Metadaten überspringt, hat das PNG kein EXIF, was bei einem Profilbild meist erwünscht ist.',
        },
      ],
      whenNotToUse: 'Lassen Sie dieses Tool aus, wenn das Motiv kein einzelnes klar abgegrenztes Objekt ist: Eine Menschenmenge, eine Landschaft, ein Muster oder ein Innenraum ohne offensichtlichen Vordergrund gibt dem Modell nichts zu trennen, und die Maske wird willkürlich. Es ist auch das falsche Tool, wenn Sie hinter einem Motiv eine weiche Unschärfe statt Transparenz möchten, wenn Sie das Ergebnis als JPG brauchen (JPG kann keinen Alphakanal speichern, Sie müssten es also anschließend auf eine Farbe reduzieren) und wenn die Eingabe ein Screenshot oder eine Strichzeichnung ist, wo ISNet oder eine manuelle Auswahl in einem Editor besser funktioniert als ein auf Fotos trainiertes Modell.',
      whyMediaManipulator: [
        'Sieben echte Segmentierungsmodelle sind namentlich wählbar, sodass Sie vom allgemeinen Modell zu einem Porträt- oder U2Net-Build wechseln können, wenn eine Kante falsch herauskommt.',
        'Die Ausgabe ist ein einfaches transparentes PNG in voller Auflösung ohne Wasserzeichen und ohne erzwungene Verkleinerung.',
        'Das Modell läuft auf Hardware, die wir betreiben, und das Standardtool braucht kein Konto. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ],
      privacyNote: 'Ihr Foto wird nach uploads/<jobId>/ auf unserem Server geschrieben und von rembg gelesen, das auf einer GPU in derselben Maschine läuft; der Ausschnitt geht nach outputs/<jobId>/converted.png. Für die Segmentierung wird keine externe API aufgerufen, und nichts aus Ihrem Bild wird zum Trainieren verwendet. Wie jeder Bild-Upload wird die Datei außerdem einmal von einem automatisierten Analyseschritt mit einem auf unserem Server gehosteten Bildmodell untersucht, und diese Zusammenfassung wird beim Auftrag gespeichert. Das PNG trägt kein EXIF des Originals, weil der Metadaten-Kopierschritt bei KI-Operationen nicht läuft. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      faq: [
        {
          question: 'Ist das Entfernen des Hintergrunds kostenlos?',
          answer: 'Ja, innerhalb des Tageskontingents. Das Entfernen des Hintergrunds zählt bewusst als Standardauftrag, nicht als Auftrag aus dem separaten KI-Kontingent: standardmäßig 5 pro Tag für Gäste und 30 mit einem kostenlosen Konto, mit Grenzen von 200 MB und 1 GB pro Datei. Premium und Pro erhalten 300 und 700. Die aktuellen Zahlen stehen auf /pricing.',
        },
        {
          question: 'Welches Modell soll ich wählen?',
          answer: 'Behalten Sie BiRefNet General für Objekte, Produkte und die meisten Fotos. Wählen Sie BiRefNet Portrait oder U2Net Human Segmentation für Personen und BiRefNet General Lite oder U2Net Lite, wenn Sie einen schnelleren Durchlauf bei einem großen Bild möchten.',
        },
        {
          question: 'Warum ist die Ausgabe immer PNG?',
          answer: 'Die API erzwingt für diese Operation die Endung .png, weil der Ausschnitt einen Alphakanal braucht; JPG hat keinen und würde den Hintergrund schwarz oder weiß zeigen. Konvertieren Sie anschließend in ein anderes Format, wenn Sie das Bild auf eine Farbe reduziert haben.',
        },
        {
          question: 'Kann ich statt Transparenz einen weißen Hintergrund bekommen?',
          answer: 'Nicht direkt mit diesem Tool. Legen Sie das PNG in einem beliebigen Editor oder in Darkroom über eine weiße Ebene; die transparenten Pixel nehmen die Farbe darunter an.',
        },
        {
          question: 'Funktioniert es bei Haaren, Fell und Glas?',
          answer: 'Oft, und die Porträt- und BiRefNet-Modelle wurden mit Blick auf solche Kanten trainiert, aber halbtransparente Bereiche sind der schwierigste Fall. Probieren Sie ein zweites Modell, wenn das erste einen Saum hinterlässt.',
        },
        {
          question: 'Wird mein Foto an eine externe KI-Firma gesendet?',
          answer: 'Nein. rembg und seine Modelle laufen auf unserem eigenen GPU-Server, und der Auftrag ruft nie eine Drittanbieter-API auf.',
        },
        {
          question: 'Behält der Ausschnitt meine EXIF-Daten?',
          answer: 'Nein. KI-Operationen umgehen das exiftool-Kopieren, das der normale Konverter ausführt, daher hat das PNG keine Kamera-, Datums- oder GPS-Tags.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Die Ausgabe ist immer ein transparentes PNG. Das Entfernen des Hintergrunds läuft auf unserem lokalen GPU-Server, nicht über eine Drittanbieter-API.',
        ],
      },
      related: [
        {
          label: 'Objekt aus Foto entfernen',
          to: '/tools/remove-object-from-photo',
          description: 'Entfernen Sie ein Element und behalten Sie den Rest der Szene.',
        },
        {
          label: 'Bildgröße ändern',
          to: '/tools/image-resizer',
          description: 'Skalieren Sie den Ausschnitt auf die Größe, die Ihr Layout braucht.',
        },
        {
          label: 'KI-Bild-Upscaler',
          to: '/tools/ai-image-upscaler',
          description: 'Vergrößern Sie einen kleinen Ausschnitt vor dem Platzieren.',
        },
        {
          label: 'Gesichter im Foto unkenntlich machen',
          to: '/tools/blur-faces-in-photo',
          description: 'Anonymisieren Sie Personen, statt sie zu isolieren.',
        },
        {
          label: 'Bildkonverter-Tutorial',
          to: '/tutorials/image/getting-started',
          description: 'Schritt für Schritt durch jede KI- und Bildoption.',
        },
      ],
      embed: {
        title: 'Hintergrund aus einem Bild entfernen',
        description: 'Laden Sie ein Foto hoch. Dieses Tool ist auf den KI-Hintergrundentferner voreingestellt und gibt ein transparentes PNG aus. Einfach hochladen und konvertieren: Das Motiv bleibt erhalten, der Hintergrund wird entfernt.',
      },
    },
    'image-to-pdf': {
      name: 'Bild in PDF',
      h1: 'Bild online kostenlos in PDF umwandeln',
      tagline: 'Verwandeln Sie JPG, PNG und andere Bilder mit einem Klick in ein sauberes, teilbares PDF-Dokument.',
      metaTitle: 'Bild online kostenlos in PDF umwandeln | Media Manipulator',
      metaDescription: 'Kostenloser Online-Konverter von Bild zu PDF. Verwandeln Sie JPG, PNG und andere Bilder in ein sauberes PDF-Dokument. Ohne Anmeldung, ohne Wasserzeichen. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ogTitle: 'Bild online kostenlos in PDF umwandeln',
      ogDescription: 'Verwandeln Sie JPG, PNG und andere Bilder in ein sauberes, teilbares PDF. Kostenlos, schnell, ohne Anmeldung.',
      intro: 'Diese Seite legt das Ausgabeformat fest auf PDF, wodurch Ihr Bild einen eigenen Pfad in unserer API nimmt, der das Dokument in reinem Go erstellt statt über ImageMagick oder Ghostscript. Ein JPEG wird Byte für Byte mit dem Filter /DCTDecode eingebettet, sodass das Foto im PDF der identische komprimierte Datenstrom ist, den Sie hochgeladen haben. Ein PNG, GIF oder WebP wird dekodiert, auf Weiß gelegt und als zlib-komprimiertes 8-Bit-RGB gespeichert. Die einzelne Seite ist so bemessen, dass das Bild bei 96 Pixel pro Zoll liegt: Jedes Pixel wird zu 0,75 Punkt, was das Bild ohne Neuberechnung in nativer Auflösung hält.',
      whatItDoes: [
        'Verpackt ein Bild in ein einseitiges PDF-1.4-Dokument, das bei 96 DPI auf das Bild bemessen ist.',
        'Bettet JPEG-Daten unverändert ein, sodass es bei Fotos keine zweite Kompressionsgeneration gibt.',
        'Legt transparente PNG- und GIF-Pixel auf Weiß und speichert sie verlustfrei mit zlib.',
        'Rastert WebP und andere Container, die Go nicht dekodieren kann, zuerst über ImageMagick und bettet das Ergebnis dann verlustfrei ein.',
        'Ignoriert die Einstellungen für Qualität, Größe, Zuschnitt, Filter und KI; der PDF-Pfad nimmt nur das Bild.',
      ],
      flowSteps: [
        {
          title: 'Beliebiges Bild hochladen',
          description: 'JPG, PNG, GIF und WebP sind die üblichen Eingaben; das Feld akzeptiert jeden Bildtyp.',
        },
        {
          title: 'Der Server liest die Pixel',
          description: 'JPEG-Maße kommen aus dem Header; andere Formate werden dekodiert und auf RGB reduziert.',
        },
        {
          title: 'Ein einseitiges PDF wird zusammengesetzt',
          description: 'Katalog, Seite, Bild-XObject und ein Inhaltsstrom, der das Bild seitenfüllend zeichnet.',
        },
        {
          title: 'converted.pdf herunterladen',
          description: 'Wird aus dem Ausgabeordner des Auftrags ausgeliefert, bis die Aufbewahrung endet.',
        },
      ],
      advancedDetails: [
        'Der Builder ist imageToPDFBytes in pdf_tools.go. Eine Datei, die mit der JPEG-Markierung FF D8 FF beginnt, wird als /DCTDecode mit /DeviceRGB oder /DeviceGray eingebettet; ein CMYK-JPEG fällt auf den Pfad „dekodieren und auf Weiß legen“ zurück, sodass das PDF nie einen CMYK-Strom enthält.',
        'Nicht-JPEG-Eingaben werden mit den Go-Bildcodecs dekodiert (PNG und GIF sind registriert). Jedes Pixel wird per Alpha über Weiß gelegt und als drei Bytes geschrieben, dann wird der gesamte Puffer zlib-komprimiert und mit /FlateDecode bei 8 Bit pro Komponente gespeichert.',
        'WebP und alles andere, was Go nicht dekodieren kann, wird zuerst von ImageMagick mit -auto-orient in einen PNG-Strom im Speicher gerastert, und dieses PNG wird dann auf Weiß gelegt und eingebettet.',
        'Die Seitengröße in Punkt ist Breite x 72 / 96 und Höhe x 72 / 96, ein Bild mit 1200 x 1600 ergibt also eine Seite mit 900 x 1200 Punkt (12,5 mal 16,7 Zoll). PDF-Anzeigeprogramme skalieren eine Seite auf das Fenster und Drucker auf das Papier, eine große Seite ist für die Anzeige also kein Problem, aber stellen Sie beim Drucken „An Seite anpassen“ ein.',
        'JPEGs auf dem schnellen Pfad behalten ihr EXIF einschließlich eines Orientation-Flags, aber PDF-Anzeigeprogramme wenden die EXIF-Ausrichtung nicht an. Ein seitlich gespeichertes Handyfoto mit Rotations-Flag erscheint im PDF seitlich; konvertieren Sie es zuerst einmal zu JPG (was automatisch ausrichtet) und dann zu PDF.',
        'Der vom Formular gesendete Qualitätswert wird akzeptiert, auf diesem Pfad aber nicht verwendet, und es gibt keinen Modus für mehrere Bilder: Ein Upload ergibt ein einseitiges PDF.',
      ],
      whyItMatters: [
        'Portale für Visa, Universitäten und Personalabteilungen akzeptieren häufig nur PDF, selbst für das Foto einer Quittung.',
        'Ein PDF druckt und zeigt auf jedem Gerät gleich, während ein bloßes Bild vom Anzeigeprogramm gedreht oder skaliert werden kann.',
        'Das unveränderte Einbetten des JPEG bedeutet, dass das PDF Beweisqualität hat: Nichts wurde auf dem Weg neu kodiert.',
      ],
      useCases: [
        {
          title: 'Quittungen und Formulare',
          description: 'Verwandeln Sie ein Handyfoto einer unterschriebenen Seite in ein PDF, das ein Portal akzeptiert.',
        },
        {
          title: 'Ausweis- und Dokument-Uploads',
          description: 'Reichen Sie eine gescannte Karte oder ein Zeugnis als das PDF ein, das das Formular verlangt.',
        },
        {
          title: 'Entwurfsabnahmen',
          description: 'Senden Sie einem Kunden ein PDF eines PNG-Designs mit auf Weiß reduzierter Transparenz.',
        },
        {
          title: 'Archivierung',
          description: 'Bewahren Sie ein Foto zusammen mit anderen Dokumenten in einem Format auf.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein Handy-JPEG mit 3024 x 4032 (2,9 MB)',
          body: 'Eingabe: ein JPEG mit 2,9 MB, 3024 breit und 4032 hoch, RGB. Der Header wird für die Maße gelesen, und der JPEG-Strom wird unverändert mit /DCTDecode eingebettet. Die Seite ist 3024 x 0,75 = 2268 Punkt breit und 4032 x 0,75 = 3024 Punkt hoch, also 31,5 mal 42 Zoll. Das PDF kommt auf etwa 2,9 MB plus unter einem Kilobyte PDF-Struktur, weil nichts neu kodiert wird. Die Arbeit besteht aus Lesen und Zurückschreiben der Datei, der Auftrag ist also durch Festplatten- und Upload-Geschwindigkeit begrenzt, nicht durch die CPU, und in wenigen Sekunden fertig.',
        },
        {
          title: 'Ein PNG mit 1920 x 1080 und transparentem Hintergrund',
          body: 'Eingabe: ein PNG mit 1,4 MB von einem Logo auf Transparenz. Das PNG wird dekodiert, jedes Pixel wird über Weiß gelegt, und die 1920 x 1080 x 3 = 6.220.800 Bytes RGB werden zlib-komprimiert und mit /FlateDecode gespeichert. Die Seite hat 1440 x 810 Punkt (20 mal 11,25 Zoll). Weil flaches Weiß und einfarbige Flächen unter zlib gut komprimieren, liegt das PDF typischerweise im Bereich des PNG, manchmal darüber, da reines zlib die Zeilenfilter von PNG nicht hat. Das Dekodieren, Zusammensetzen und Komprimieren von zwei Millionen Pixeln ist CPU-Arbeit von wenigen Sekunden; die Transparenz ist im Ergebnis absichtlich weg.',
        },
      ],
      whenNotToUse: 'Dies ist nicht das Tool für ein mehrseitiges Dokument: Es erzeugt genau eine Seite aus einem Bild, ein Satz Scans muss also seitenweise konvertiert und dann in einem PDF-Editor zusammengeführt werden. Verwenden Sie es nicht, wenn Transparenz erhalten bleiben muss, denn jedes Pixel wird auf Weiß gelegt. Erwarten Sie keine kleinere Datei: Ein JPEG wird unverändert eingebettet und ein PNG wird zu zlib-komprimiertem RGB, komprimieren oder verkleinern Sie das Bild also zuerst, wenn die Größe wichtig ist. Und ein Foto, dessen richtige Ausrichtung nur in einem EXIF-Flag steckt, sollte vorher einmal zu JPG konvertiert werden, sonst zeigt das PDF es so, wie es gespeichert ist.',
      whyMediaManipulator: [
        'Die JPEG-Durchreichung ist eine Designentscheidung: Ihr Foto wird ohne Neukodierung eingebettet, was viele Konverter nicht versprechen.',
        'Kein Ghostscript und keine ImageMagick-PDF-Richtlinie auf dem Pfad, die Konvertierung hängt also nicht von einer serverseitigen Sicherheitseinstellung ab, die PDFs verweigern könnte.',
        'Kostenlos für das Standardtool, kein Konto erforderlich. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ],
      privacyNote: 'Das Bild wird unter uploads/<jobId>/ und das PDF unter outputs/<jobId>/converted.pdf auf unserem eigenen Server gespeichert; beide werden gemeinsam gelöscht, wenn die Aufbewahrungsfrist endet. Ein JPEG behält alle eingebetteten Metadaten im PDF, weil der Strom wörtlich kopiert wird, sodass EXIF-Standort- und Kamera-Tags für jeden lesbar bleiben, der das Bild extrahiert; entfernen Sie sie vorher mit dem EXIF-Entferner, wenn das wichtig ist. PNG und andere Eingaben werden zu Rohpixeln dekodiert, es werden also keine Tags übernommen. Der Upload selbst ist ein Bild und durchläuft daher ebenfalls die automatisierte Bildmodell-Analyse auf unserem Server, deren Zusammenfassung beim Auftrag bleibt. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      faq: [
        {
          question: 'Ist die Umwandlung von Bild in PDF kostenlos?',
          answer: 'Ja, für das Standardtool. Jede Konvertierung verbraucht einen täglichen Vorgang: 5 pro Tag als Gast mit einer Dateigrenze von 200 MB, 30 pro Tag und 1 GB mit einem kostenlosen Konto und 300 oder 700 bei Premium oder Pro, alles standardmäßig und auf /pricing aufgeführt.',
        },
        {
          question: 'Wird das Foto im PDF erneut komprimiert?',
          answer: 'Nicht, wenn es ein JPEG ist: Die Originalbytes werden mit /DCTDecode eingebettet. PNG, GIF und WebP werden nach dem Reduzieren auf Weiß verlustfrei als zlib-komprimiertes RGB gespeichert, auch dort geht also keine Qualität verloren.',
        },
        {
          question: 'Welche Seitengröße hat das PDF?',
          answer: 'Die Seite entspricht dem Bild bei 96 Pixel pro Zoll, Breite und Höhe in Punkt sind also 0,75-mal die Pixelmaße. Ein Bild mit 1200 x 1600 ergibt eine Seite mit 12,5 mal 16,7 Zoll; Anzeigeprogramme und Drucker skalieren sie passend.',
        },
        {
          question: 'Kann ich mehrere Bilder in einem PDF zusammenfassen?',
          answer: 'Nicht auf dieser Seite. Jeder Upload erzeugt ein einseitiges PDF. Konvertieren Sie jedes Bild und führen Sie die entstandenen PDFs in einem PDF-Editor zusammen.',
        },
        {
          question: 'Was passiert mit Transparenz?',
          answer: 'Sie wird auf Weiß reduziert. PDF-Bild-XObjects auf diesem Pfad haben kein Alpha, transparente Pixel werden also zu weißen Pixeln.',
        },
        {
          question: 'Warum liegt mein Handyfoto im PDF seitlich?',
          answer: 'Telefone speichern die Pixel oft im Querformat und setzen ein EXIF-Orientation-Flag. Das JPEG wird unverändert eingebettet, und PDF-Anzeigeprogramme ignorieren dieses Flag. Lassen Sie das Foto zuerst als JPG durch den Bildkonverter laufen, der die automatische Ausrichtung anwendet, und konvertieren Sie dann das Ergebnis zu PDF.',
        },
        {
          question: 'Behält das PDF meine EXIF-Daten?',
          answer: 'Bei einem JPEG ja, weil der gesamte JPEG-Strom einschließlich EXIF im PDF steckt. Verwenden Sie zuerst den EXIF-Entferner, wenn Sie das nicht möchten. Bei PNG und anderen Eingaben werden nur die Pixel übernommen.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Die Ausgabe ist ein einseitiges PDF. Transparenz wird auf Weiß reduziert, weil PDF-Seiten deckend sind.',
        ],
      },
      related: [
        {
          label: 'PDF in JPG',
          to: '/tools/pdf-to-jpg',
          description: 'Rendern Sie PDF-Seiten zurück in Bilder.',
        },
        {
          label: 'EXIF-Metadaten entfernen',
          to: '/tools/remove-exif-metadata',
          description: 'Entfernen Sie Tags, bevor sie ins PDF eingebettet werden.',
        },
        {
          label: 'Bild komprimieren',
          to: '/tools/compress-image',
          description: 'Verkleinern Sie zuerst das JPEG, da das PDF es unverändert einbettet.',
        },
        {
          label: 'KI-Dokumentenscan',
          to: '/tools/ai-document-scan',
          description: 'Bereinigen und OCR-Verarbeitung einer fotografierten Seite statt bloßem Verpacken.',
        },
        {
          label: 'Bildgröße ändern',
          to: '/tools/image-resizer',
          description: 'Legen Sie zuerst die Pixelgröße und damit die Seitengröße fest.',
        },
      ],
      embed: {
        title: 'Ein Bild in PDF umwandeln',
        description: 'Laden Sie ein beliebiges Bild hoch: JPG, PNG und mehr. Die Ausgabe ist bei diesem Tool fest auf PDF gesetzt, Sie erhalten also ein einseitiges PDF, das Ihr Bild in nativer Auflösung umschließt.',
      },
    },
    'pdf-to-jpg': {
      name: 'PDF in JPG',
      h1: 'PDF online kostenlos in JPG umwandeln',
      tagline: 'Rendern Sie jede Seite eines PDF in hochwertige JPG-Bilder, die Sie teilen, bearbeiten oder posten können.',
      metaTitle: 'PDF online kostenlos in JPG umwandeln | Media Manipulator',
      metaDescription: 'Kostenloser Online-Konverter von PDF zu JPG. Rendern Sie jede Seite eines PDF in hochwertige JPG-Bilder, heruntergeladen als ZIP. Ohne Anmeldung. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ogTitle: 'PDF online kostenlos in JPG umwandeln',
      ogDescription: 'Rendern Sie jede Seite eines PDF in hochwertige JPG-Bilder. Kostenlos, schnell, ohne Anmeldung.',
      intro: 'Laden Sie ein PDF hoch, und unser Server rendert jede Seite mit pdftoppm aus dem Poppler-Toolkit, demselben Rasterizer, den viele Desktop-PDF-Anzeigeprogramme verwenden. Das Formular auf dieser Seite ist auf JPG, alle Seiten und 150 DPI voreingestellt; Sie können die DPI auf 100, 200 oder 300 ändern, den Auftrag auf die erste Seite beschränken und die JPEG-Qualität festlegen, die standardmäßig 90 beträgt. Mit allen Seiten erhalten Sie ein ZIP mit page-001.jpg, page-002.jpg und so weiter; mit „nur erste Seite“ erhalten Sie ein einzelnes JPG. Vor dem Rendern zählt pdfinfo die Seiten, und der Auftrag wird abgelehnt, wenn es mehr als 500 sind.',
      whatItDoes: [
        'Rastert jede Seite oder nur die erste in ein JPG mit der gewählten Auflösung.',
        'Verpackt mehrseitige Ausgabe als ein ZIP mit mit Nullen aufgefüllten, sortierbaren Dateinamen.',
        'Verwendet die eingestellte JPEG-Qualität (standardmäßig 90) für jede Seite.',
        'Liest zuerst die Seitenzahl, sodass ein zu großes Dokument scheitert, bevor gerendert wird.',
        'Hält PDFs aus der automatisierten Bildanalyse heraus, die nur bei Bild-, Video- und Audio-Uploads läuft.',
      ],
      flowSteps: [
        {
          title: 'PDF hochladen',
          description: 'Jede .pdf bis zu Ihrer Dateigrößengrenze; die Seitenzahl muss 500 oder weniger betragen.',
        },
        {
          title: 'Seiten, DPI und Qualität wählen',
          description: 'Alle Seiten oder nur die erste; 100, 150, 200 oder 300 DPI; JPEG-Qualität 1 bis 100.',
        },
        {
          title: 'pdftoppm rendert',
          description: 'Der Server führt pdftoppm -r <dpi> -jpeg -jpegopt quality=<q> [-f 1 -l 1] input page aus.',
        },
        {
          title: 'Herunterladen',
          description: 'converted.jpg bei einer einzelnen Seite, converted.zip bei allen Seiten.',
        },
      ],
      advancedDetails: [
        'Der Renderer ist convertPDFToImages in pdf_tools.go. Er ruft pdfinfo für die Seitenzahl auf, lehnt mehr als 500 Seiten ab und führt dann pdftoppm aus, mit -r für die DPI, -jpeg und -jpegopt quality=N für JPG-Ausgabe sowie -f 1 -l 1, wenn nur die erste Seite gewünscht ist.',
        'Der Server begrenzt die DPI auf den Bereich 50 bis 400 und die Qualität auf 1 bis 100, unabhängig davon, was das Formular sendet; das Formular selbst bietet 100, 150, 200 und 300.',
        'pdftoppm schreibt eine Datei pro Seite; der Server benennt sie in page-001.jpg, page-002.jpg und so weiter um (dreistellig, mit Nullen aufgefüllt) und packt sie in ein ZIP, sodass die Dateien in jedem Dateimanager in Seitenreihenfolge sortiert sind.',
        'Die Pixelmaße folgen direkt aus den DPI: Eine US-Letter-Seite (8,5 x 11 Zoll) hat 1275 x 1650 Pixel bei 150 DPI und 2550 x 3300 bei 300; eine A4-Seite (8,27 x 11,69 Zoll) hat 1240 x 1754 bei 150 und 2480 x 3508 bei 300.',
        'Ein PDF, das selbst ein Scan ist, wird neu gerastert: War der eingebettete Scan 300 DPI und rendern Sie mit 150, kommt jede Seite mit der halben linearen Auflösung des Scans heraus. Wählen Sie 300, um zu behalten, was der Scan hatte.',
        'Die PNG-Variante dieses Tools verwendet denselben Renderer mit -png und ohne Qualitätsoption; JPG ist die richtige Wahl für fotografische oder gescannte Seiten, PNG für Seiten mit scharfem Text und flachen Farben, bei denen JPEG-Artefakte sichtbar wären.',
      ],
      whyItMatters: [
        'Viele Tools und Plattformen akzeptieren Bilder, aber keine PDFs: Präsentationen, Social-Media-Beiträge, Chat-Apps und Bildeditoren.',
        'Eine gerenderte Seite ist ein getreues Abbild von Layout, Schriften und Vektorgrafiken, ohne etwas einzubetten oder neu umzubrechen.',
        'Die DPI selbst zu wählen bedeutet, dass Sie zwischen einer schnellen Vorschau und einem Export in Druckauflösung entscheiden.',
      ],
      useCases: [
        {
          title: 'Folien und Social-Media-Beiträge',
          description: 'Rendern Sie eine Berichtsseite oder ein Poster in ein Bild, das Sie posten oder in eine Präsentation einfügen können.',
        },
        {
          title: 'Vorschaubilder und Vorschauen',
          description: 'Rendern Sie nur die erste Seite mit 100 DPI als Titelbild.',
        },
        {
          title: 'Markierungen in einem Editor',
          description: 'Öffnen Sie eine Seite in einem Bildeditor, um sie zu kommentieren, zu schwärzen oder zuzuschneiden.',
        },
        {
          title: 'Scan-Extraktion',
          description: 'Holen Sie jede gescannte Seite als separates JPG in Originalauflösung aus einem PDF heraus.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein 12-seitiger A4-Bericht, alle Seiten bei 150 DPI',
          body: 'Eingabe: ein 12-seitiges A4-PDF mit 1,8 MB, das Text und einige Diagramme enthält. Einstellungen bei der Voreinstellung gelassen: JPG, alle Seiten, 150 DPI, Qualität 90. pdfinfo meldet 12 Seiten, unter der Grenze von 500, und pdftoppm läuft mit -r 150 -jpeg -jpegopt quality=90. Jede Seite rendert mit 8,27 x 150 mal 11,69 x 150, also 1240 x 1754 Pixel (2,2 Megapixel). Die zwölf Dateien werden in page-001.jpg bis page-012.jpg umbenannt und in converted.zip gepackt. Das Rendern erfolgt pro Seite und hängt vor allem davon ab, wie viel Vektorinhalt und Text jede Seite hat; ein Dutzend Textseiten dauert insgesamt wenige Sekunden. Die JPEG-Größe pro Seite hängt vom Inhalt ab: überwiegend weiße Textseiten komprimieren weit besser als ein randloses Diagramm.',
        },
        {
          title: 'Nur die erste Seite eines US-Letter-Scans bei 300 DPI',
          body: 'Eingabe: ein 40-seitiger gescannter Vertrag, Letter-Format, 28 MB. Wählen Sie „nur erste Seite“ und 300 DPI, behalten Sie Qualität 90. Der Server führt pdftoppm -r 300 -jpeg -jpegopt quality=90 -f 1 -l 1 aus, es wird also nur eine Seite gerastert, mit 8,5 x 300 mal 11 x 300 = 2550 x 3300 Pixel (8,4 Megapixel). Die Ausgabe ist ein einzelnes converted.jpg, kein ZIP. Das Rendern einer gescannten Seite ist schnell, weil die Seite ein einziges eingebettetes Bild ist; der Upload von 28 MB dauert länger als das Rendern. Bei 150 DPI hätte dieselbe Seite 1275 x 1650, ein Viertel der Pixel, was zum Lesen am Bildschirm reicht, aber nicht zum erneuten Drucken des Scans.',
        },
      ],
      whenNotToUse: 'Rendern Sie ein PDF nicht in JPG, wenn der Text auswählbar oder durchsuchbar bleiben muss: Das Ergebnis sind Pixel, und ein Screenreader oder ein Suchindex bekommt nichts. Verwenden Sie kein JPG für Seiten, die überwiegend aus scharfem Text und Strichzeichnungen bestehen, wenn Sie hineinzoomen werden, da die JPEG-Kompression schwache Artefakte um Kanten hinterlässt; die PNG-Variante ist dort sauberer. Dokumente mit mehr als 500 Seiten werden von vornherein abgelehnt, und sehr hohe DPI bei einem langen Dokument erzeugen ein großes ZIP, rendern Sie also nur die Seiten, die Sie wirklich brauchen. Und wenn das Ziel ist, den PDF-Inhalt zu bearbeiten statt ihn abzubilden, ist ein PDF-Editor das richtige Werkzeug.',
      whyMediaManipulator: [
        'Poppler-Rendering mit echten DPI- und Qualitätsreglern, keine feste Vorschaugröße.',
        'Ein einziges ZIP mit seitennummerierten Dateinamen statt eines Haufens von Downloads.',
        'Keine Anmeldung für das Standardtool. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ],
      privacyNote: 'Ihr PDF wird unter uploads/<jobId>/ auf unserem Server gespeichert und die gerenderten JPGs oder ihr ZIP unter outputs/<jobId>/; die Seiten werden in ein temporäres Verzeichnis im Ausgabeordner gerendert, das entfernt wird, sobald das ZIP geschrieben ist. PDF-Uploads werden als Dokumente erkannt und nicht an die automatisierte Bildanalyse übergeben, die Bild-, Video- und Audio-Uploads erhalten. Poppler läuft vollständig auf unserer Maschine, und keine Seite wird an einen externen Dienst gesendet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      faq: [
        {
          question: 'Ist die Umwandlung von PDF in JPG kostenlos?',
          answer: 'Ja, für das Standardtool. Ein PDF, egal mit wie vielen Seiten, ist ein täglicher Vorgang: 5 pro Tag als Gast mit einer Grenze von 200 MB pro Datei, 30 pro Tag und 1 GB mit einem kostenlosen Konto, 300 bei Premium und 700 bei Pro, alles standardmäßig und auf /pricing angezeigt.',
        },
        {
          question: 'Wie viele Bilder erhalte ich?',
          answer: 'Eines pro Seite, wenn „alle Seiten“ gewählt ist, geliefert als converted.zip mit Dateien ab page-001.jpg aufwärts. Mit „nur erste Seite“ erhalten Sie ein converted.jpg und kein ZIP.',
        },
        {
          question: 'Welche DPI soll ich wählen?',
          answer: '150 zum Lesen am Bildschirm und Teilen (1240 x 1754 für A4). 300 für den Druck oder für Scans, die mit 300 erstellt wurden (2480 x 3508 für A4). 100 für kleine Vorschauen. Der Server akzeptiert 50 bis 400.',
        },
        {
          question: 'Was bewirkt die Qualitätseinstellung?',
          answer: 'Sie wird als -jpegopt quality=N an pdftoppm übergeben, die Standard-JPEG-Qualitätsskala. 90 ist der Standard; senken Sie ihn für kleinere Dateien bei fotolastigen Seiten.',
        },
        {
          question: 'Gibt es eine Seitenbegrenzung?',
          answer: 'Ja, 500 Seiten. pdfinfo zählt sie vor dem Rendern, und ein längeres Dokument wird mit einer Meldung abgelehnt, die Anzahl und Limit nennt, und der Vorgang wird zurückerstattet.',
        },
        {
          question: 'Ist der Text im Bild durchsuchbar?',
          answer: 'Nein. Die Ausgabe ist ein Rasterbild jeder Seite. Wenn Sie Text brauchen, behalten Sie das PDF oder verwenden Sie den KI-Dokumentenscan, der OCR auf einer fotografierten Seite ausführt.',
        },
        {
          question: 'Kann ich PNG statt JPG bekommen?',
          answer: 'Diese Seite legt das Format fest auf JPG. Derselbe Renderer erzeugt PNG über die Seite „PDF in PNG“, die -png verwendet und keine Qualitätseinstellung hat.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Die Ausgabe aller Seiten wird als .zip geliefert; die Ausgabe der ersten Seite ist ein einzelnes .jpg.',
          'Die Standard-Renderauflösung ist 150 DPI; erhöhen Sie sie für Ausgabe in Druckqualität.',
        ],
      },
      related: [
        {
          label: 'Bild in PDF',
          to: '/tools/image-to-pdf',
          description: 'Der umgekehrte Weg: Verpacken Sie ein Bild in eine PDF-Seite.',
        },
        {
          label: 'Bild komprimieren',
          to: '/tools/compress-image',
          description: 'Verkleinern Sie die gerenderten JPGs für das Web.',
        },
        {
          label: 'Bildgröße ändern',
          to: '/tools/image-resizer',
          description: 'Skalieren Sie eine gerenderte Seite auf Vorschaubild- oder Bannergröße.',
        },
        {
          label: 'KI-Dokumentenscan',
          to: '/tools/ai-document-scan',
          description: 'OCR und Bereinigung einer fotografierten Seite.',
        },
        {
          label: 'Text im Bild schwärzen',
          to: '/tools/redact-text-in-image',
          description: 'Schwärzen Sie Namen oder Nummern auf einer gerenderten Seite.',
        },
      ],
      embed: {
        title: 'PDF in JPG umwandeln',
        description: 'Laden Sie ein PDF hoch. Jede Seite wird in ein JPG-Bild gerendert. Wählen Sie „alle Seiten“ für ein ZIP mit Bildern oder „nur erste Seite“ für ein einzelnes JPG. Wählen Sie eine Render-DPI für schärfere Ausgabe.',
      },
    },
    'compress-video': {
      name: 'Video komprimieren',
      h1: 'Video online komprimieren, ohne die Qualität zu ruinieren',
      tagline: 'Verkleinern Sie MP4-, WebM-, MOV-, MKV- und AVI-Dateien für Web, E-Mail, soziale Medien und Cloud-Uploads.',
      metaTitle: 'Video online komprimieren (kostenlos) | Media Manipulator',
      metaDescription: 'Kostenloser Online-Videokompressor. Reduzieren Sie die Dateigröße von MP4, WebM, MOV, MKV und AVI bei guter Qualität. Ohne Anmeldung. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ogTitle: 'Video online komprimieren, ohne die Qualität zu ruinieren',
      ogDescription: 'Verkleinern Sie MP4-, WebM-, MOV- und AVI-Videodateien für das Web, ohne sichtbar an Qualität zu verlieren.',
      intro: 'Eine Videodatei ist wegen ihrer Bitrate groß: wie viele Bits der Encoder pro Sekunde Material ausgegeben hat. Telefone und Bildschirmrekorder geben großzügig aus, weshalb ein kurzer 1080p-Clip Dutzende oder Hunderte Megabyte erreichen kann. Diese Seite öffnet statt des vollständigen Konverters einen Kompressor mit drei Reglern: eine Kompressionsstufe, einen Ausgabecontainer sowie optional Auflösung und Codec. Auf unserem Server ist der Auftrag ein einziger FFmpeg-Befehl, der das Bild mit einer von der Stufe bestimmten Einstellung für konstante Qualität (CRF) neu kodiert, das Audio zu AAC oder Opus neu kodiert und das Ergebnis mit dem Index am Dateianfang schreibt, sodass es abspielt, bevor es vollständig heruntergeladen ist.',
      whatItDoes: [
        'Kodiert das Video mit einer festen Qualitätsstufe statt einer festen Bitrate neu: „Kleinste Datei“ ist CRF 31, „Ausgewogen“ ist CRF 26 und „Hohe Qualität“ ist CRF 22.',
        'Gibt MP4 aus (standardmäßig H.264 oder H.265/HEVC, wenn Sie es wählen) oder WebM (VP9 mit Opus-Audio).',
        'Skaliert das Bild optional im selben Durchgang auf 1080p, 720p oder 480p herunter und behält dabei das Seitenverhältnis.',
        'Entfernt optional die Tonspur vollständig für die kleinstmögliche Datei.',
        'Akzeptiert Uploads in MP4, MOV, M4V, WebM, MKV, AVI, FLV, WMV, MPEG und MPG; die vollständige Konverterseite behandelt ProRes und andere Schnittformate.',
      ],
      flowSteps: [
        {
          title: 'Video hochladen',
          description: 'Der Browser legt die Datei direkt in unserem Speicher-Bucket ab und bittet dann die API, den Auftrag zu starten.',
        },
        {
          title: 'Stufe wählen',
          description: '„Ausgewogen“ ist vorausgewählt. „Kleinste Datei“ tauscht sichtbare Details gegen Größe; „Hohe Qualität“ behält mehr davon.',
        },
        {
          title: 'Optional Format, Auflösung oder Codec ändern',
          description: 'MP4 mit H.264 spielt überall; H.265 und WebM sind auf Geräten, die sie dekodieren, kleiner.',
        },
        {
          title: 'FFmpeg kodiert neu',
          description: 'libx264, libx265 oder libvpx-vp9 mit dem CRF Ihrer Stufe, plus AAC- oder Opus-Audio und faststart für MP4.',
        },
        {
          title: 'Kleinere Datei herunterladen',
          description: 'Das Ergebnis bleibt im Auftragsordner, bis seine Aufbewahrungsfrist endet.',
        },
      ],
      advancedDetails: [
        'Der genaue Befehl für MP4 ist ffmpeg -i input [-vf scale=-1:H] -c:v libx264 -crf N -pix_fmt yuv420p -movflags +faststart -c:a aac output.mp4, wobei N für die drei Stufen 31, 26 oder 22 ist (buildVideoCodecArgs und videoCRF in converter.go). Es wird kein Encoder-Geschwindigkeits-Preset übergeben, libx264 läuft also mit seinem Standard, medium.',
        'Die Wahl von H.265 tauscht den Encoder gegen libx265 und fügt -tag:v hvc1 hinzu, das Tag, das QuickTime und Safari brauchen, um HEVC in MP4 zu erkennen. Ältere Android-Telefone, Smart-TVs und viele Web-Player können H.265 überhaupt nicht dekodieren.',
        'Die WebM-Ausgabe läuft mit libvpx-vp9 und -b:v 0 -crf N sowie Opus-Audio; fehlte dem FFmpeg-Build des Servers VP9 oder Opus, würde er auf VP8 und Vorbis zurückfallen. Dasselbe N wird übergeben, aber VP9 liest CRF auf einer Skala von 0 bis 63, 26 ist dort also eine relativ hohe Qualitätseinstellung.',
        'Eine Auflösungswahl wird zu scale=-1:1080, scale=-1:720 oder scale=-1:480: Höhe fest, Breite aus dem Seitenverhältnis der Quelle berechnet. Die Höhe wird wie angegeben angewendet, die Wahl von 1080p für eine 720p-Quelle skaliert sie also hoch und macht die Datei größer, nicht kleiner; wählen Sie eine Höhe gleich oder unter der Quelle.',
        '„Tonspur entfernen“ fügt -an hinzu. Andernfalls wird das Audio vom nativen AAC-Encoder von FFmpeg mit seiner Standard-Bitrate neu kodiert (es wird kein -b:a übergeben; für Stereo sind das typischerweise etwa 128 kbps), was bei jeder Stufe nur ein kleiner Bruchteil der Datei ist.',
        'Die Kompression ist CRF-gesteuert, die Ausgabegröße folgt also dem Inhalt: Statische Folien komprimieren weit stärker als Konfetti oder Wasser. Der Server prüft den CRF auf 0 bis 51 und die Kompressionsstufe auf einen der drei Namen, bevor eine Kodierung beginnt.',
        'Der Upload wird außerdem für die automatisierte Inhaltsanalyse eingereiht, die jede Standardkonvertierung erhält: Bilder werden abgetastet und von einem lokalen Bildmodell beschrieben, und das Audio wird auf unserer eigenen Hardware transkribiert. Das Analyseergebnis wird beim Auftrag gespeichert, nicht weitergegeben.',
      ],
      whyItMatters: [
        'Chat-Apps, Mailserver und Lernplattformen setzen Grenzen in Megabyte durch, und ein Handy-Clip mit nativer Bitrate sprengt sie.',
        'Eine Seite, die ein 60 MB großes Hintergrundvideo automatisch abspielt, stockt auf Mobilverbindungen; derselbe Clip bei CRF 26 ist ein Bruchteil davon.',
        'Speicher- und Bandbreitenkosten skalieren mit Bytes, komprimierte Kopien von selten geöffneten Originalen zu behalten summiert sich also schnell.',
      ],
      useCases: [
        {
          title: 'E-Mail und Chat',
          description: 'Bringen Sie eine 1 Minute lange Handyaufnahme ohne separaten Freigabelink unter ein Limit von 25 MB oder 100 MB.',
        },
        {
          title: 'Website-Hero- und Hintergrundschleifen',
          description: 'Kodieren Sie ein WebM oder H.264-MP4, das eine Seite ohne langes Puffern automatisch abspielen kann.',
        },
        {
          title: 'Kurs- und Meeting-Aufzeichnungen',
          description: 'Verkleinern Sie Bildschirmaufnahmen, deren statische Folien bei jedem CRF extrem gut komprimieren.',
        },
        {
          title: 'Archivkopien',
          description: 'Behalten Sie eine 720p-Kopie in „Ausgewogen“ von langen Originalen und verschieben Sie das Master in den Kaltspeicher.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein 48 MB großer, 30 Sekunden langer 1080p-Handy-Clip in „Ausgewogen“',
          body: 'Eingabe: ein 30 Sekunden langes MP4 von einem Telefon, 1920 x 1080, 48 MB, was etwa 12,8 Mbps entspricht. Einstellungen: Ausgewogen, MP4, H.264, Auflösung beibehalten, Audio beibehalten. Der Server führt libx264 mit CRF 26, yuv420p und faststart aus und kodiert das Audio zu AAC mit 128 kbps neu, die Tonspur allein macht also etwa 0,5 MB des Ergebnisses aus (128 kbps x 30 s). Alles andere entscheidet das Bild: CRF 26 gibt zuerst feines Korn und Rauschen auf, eine ruhige Handkameraaufnahme kommt also als kleiner Bruchteil der 12,8-Mbps-Quelle heraus, während schnelle Action oder starkes Kamerarauschen weniger schrumpft. Die Kodierung ist ein einzelner Durchgang über 900 Bilder in 1080p mit dem Standard-Preset medium; auf unserem Server ist das ein kurzer Auftrag, und der Upload von 48 MB bestimmt meist die Wartezeit.',
        },
        {
          title: 'Ein 160 MB großer, 60 Sekunden langer 4K-Clip zu 720p H.265 in „Kleinste Datei“',
          body: 'Eingabe: ein 60 Sekunden langes MP4 mit 3840 x 2160 und 160 MB, etwa 21 Mbps, innerhalb der Gastgrenze von 200 MB. Einstellungen: Kleinste Datei, MP4, Codec H.265, Auflösung 720p, Audio entfernt. FFmpeg wendet scale=-1:720 an, was 1280 x 720 ergibt: 0,92 Megapixel pro Bild gegenüber 8,3 bei der Quelle, grob ein Neuntel der Pixel, bevor der Codec überhaupt etwas tut. Dann läuft libx265 mit CRF 31 und -tag:v hvc1, und -an entfernt das Audio. Die Kombination aus neunmal weniger Pixeln, einem effizienteren Codec und einem hohen CRF ist die Quelle der größten Reduktionen, rechnen Sie also mit einem Ergebnis von wenigen Megabyte statt Dutzenden. Die Zeit wird vom Dekodieren der 4K-Bilder und von libx265 bestimmt, das bei gleichem Preset deutlich langsamer ist als libx264, dieser Auftrag dauert also länger als das 1080p-Beispiel, obwohl die Ausgabe kleiner ist.',
        },
      ],
      whenNotToUse: 'Komprimieren Sie keine Datei, die Sie noch schneiden oder farblich graden wollen; jede Neukodierung verliert Details, und ein Editor will stattdessen das Original oder eine ProRes-Zwischenkopie aus dem vollständigen Konverter. Verwenden Sie es nicht, um einen Clip auf einem bestimmten Gerät abspielbar zu machen, wenn das Problem der Container ist und nicht die Größe; der Videokonverter ändert Formate, ohne die Qualität zu senken. Wenn Ihr einziges Ziel ist, einen Abschnitt herauszuschneiden, kopiert der Trimmer die Streams ohne Neukodierung und ist sowohl schneller als auch verlustfrei. Und wenn die Datei groß ist, weil sie lang ist, hilft Kompression weniger, als Sie hoffen; eine 20-minütige Aufzeichnung bei CRF 26 ist immer noch eine 20-minütige Aufzeichnung.',
      whyMediaManipulator: [
        'Der CRF hinter jeder Stufe steht auf dieser Seite, sodass Sie vorhersagen können, was „Kleinste Datei“ mit detailreichem Material macht, bevor Sie darauf warten.',
        'H.265 in MP4 erhält das hvc1-Tag, das Apple-Player verlangen und das viele Online-Kompressoren vergessen.',
        'Die Kodierung läuft mit FFmpeg auf unseren eigenen Servern; nichts wird an einen externen Verarbeitungsdienst übergeben, und es wird kein Wasserzeichen hinzugefügt.',
        'Eine Kompression zählt als ein Vorgang Ihres Tageskontingents: standardmäßig 5 pro Tag ohne Konto, 30 mit einem kostenlosen Konto. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ],
      privacyNote: 'Der Kompressor kodiert Ihr Video mit FFmpeg auf unseren eigenen Servern neu. Der Upload wird unter uploads/<jobId>/ und die komprimierte Datei unter outputs/<jobId>/ gespeichert; beide stehen im Aufbewahrungsregister und werden gelöscht, wenn die Frist endet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre. Da dies eine Standardkonvertierung ist, durchläuft der Upload außerdem unsere automatisierte Inhaltsanalyse auf derselben Hardware (abgetastete Bilder, beschrieben von einem lokalen Bildmodell, Audio lokal transkribiert); dieser Bericht wird beim Auftrag aufbewahrt und nicht an Dritte weitergegeben. Container-Metadaten bleiben erhalten, sofern Sie sie nicht entfernen lassen; nichts wird an einen externen KI- oder Verarbeitungsanbieter gesendet.',
      faq: [
        {
          question: 'Sieht mein Video nach dem Komprimieren schlechter aus?',
          answer: 'Bei einer Neukodierung gehen immer einige Details verloren. Bei „Hohe Qualität“ (CRF 22) und „Ausgewogen“ (CRF 26) liegt der Verlust meist in feinem Korn und Rauschen, das die meisten Betrachter nicht bemerken; bei „Kleinste Datei“ (CRF 31) sehen Sie bei detailreichem Material eine Weichzeichnung. Die Auflösung beizubehalten vermeidet die Unschärfe, die das Herunterskalieren hinzufügt.',
        },
        {
          question: 'Soll ich H.264, H.265 oder WebM wählen?',
          answer: 'H.264-MP4 spielt auf allem, auch auf alten Fernsehern und Firmen-Laptops. H.265 ergibt bei gleichem CRF eine kleinere Datei, braucht aber ein Gerät, das HEVC dekodiert; wir kennzeichnen es mit hvc1, damit Apple-Player es akzeptieren. WebM (VP9 und Opus) ist die Wahl für Webseiten, auf denen Sie den Player kontrollieren.',
        },
        {
          question: 'Wie viel kleiner wird die Datei?',
          answer: 'Das hängt von der Quell-Bitrate und vom Inhalt ab. Ein Handy-Clip mit 12 Mbps hat viel Spielraum und schrumpft bei CRF 26 drastisch; eine Datei, die bereits mit moderater Bitrate kodiert war, schrumpft wenig, weil CRF ausgibt, was das Bild braucht. Auf 720p zu gehen und das Audio zu entfernen hilft immer.',
        },
        {
          question: 'Fügt der Kompressor ein Wasserzeichen hinzu oder ändert er die Bildrate?',
          answer: 'Nein. Bildrate, Dauer und Seitenverhältnis bleiben erhalten, und nichts wird ins Bild gezeichnet. Nur Codec, CRF, die optionale Höhe und das optionale Entfernen des Audios ändern sich.',
        },
        {
          question: 'Ist das Komprimieren eines Videos kostenlos, und welche Limits gibt es?',
          answer: 'Standardmäßig erhält ein Gast 5 Vorgänge pro Tag mit Dateien bis 200 MB und 5 Minuten Video, Ausgabe bis 1080p; ein kostenloses Konto erhöht das auf 30 pro Tag, 1 GB und 20 Minuten. Eine fehlgeschlagene Kompression wird zurückerstattet. Die aktuellen Zahlen stehen auf der Preisseite.',
        },
        {
          question: 'Warum ist die Ausgabe nicht kleiner als das Original?',
          answer: 'Die Quelle war wahrscheinlich bereits effizient komprimiert oder hat für ihre Auflösung eine niedrige Bitrate. CRF kann nicht unter das gehen, was das Bild braucht, ohne eine niedrigere Stufe. Probieren Sie „Kleinste Datei“, senken Sie die Auflösung oder wechseln Sie zu H.265.',
        },
        {
          question: 'Kann ich ein Video ohne Audio komprimieren oder das Original-Audio unangetastet lassen?',
          answer: 'Eine stumme Quelle bleibt stumm. Audio in einer beibehaltenen Spur wird von dieser Seite immer zu AAC (MP4) oder Opus (WebM) neu kodiert; im vollständigen Videokonverter legen Sie eine explizite Audio-Bitrate fest.',
        },
      ],
      related: [
        {
          label: 'Video trimmen',
          to: '/tools/video-trimmer',
          description: 'Schneiden Sie den Clip zuerst; der Kompressor hat dann weniger zu kodieren.',
        },
        {
          label: 'Video in animiertes GIF umwandeln',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Für Clips von wenigen Sekunden ist GIF das Format, das inline abspielt.',
        },
        {
          label: 'In HLS transkodieren',
          to: '/tools/transcode-to-hls',
          description: 'Verpacken Sie ein Video als adaptiven Stream statt als eine Datei.',
        },
        {
          label: 'Audio aus Video extrahieren',
          to: '/tools/extract-audio-from-video',
          description: 'Behalten Sie nur die Tonspur als MP3, WAV oder FLAC.',
        },
        {
          label: 'Video transkribieren',
          to: '/tools/transcribe-video',
          description: 'Erhalten Sie die Sprache als Text, vor oder nach dem Komprimieren.',
        },
        {
          label: 'Videokonverter-Tutorial',
          to: '/tutorials/video/getting-started',
          description: 'Schritt-für-Schritt-Anleitung zu jeder Videooption.',
        },
      ],
      embed: {
        title: 'Ein Video komprimieren',
        description: 'Laden Sie ein Video hoch und wählen Sie eine kleinere Qualitätsvorgabe oder eine niedrigere Bitrate. Behalten Sie denselben Codec für das schnellste Ergebnis, oder wechseln Sie zu WebM/H.265 für kleinere Dateien auf modernen Geräten. Die gleiche Auflösung beizubehalten ergibt das natürlichste Ergebnis.',
      },
    },
    'video-trimmer': {
      name: 'Video-Trimmer',
      h1: 'Video online kostenlos trimmen',
      tagline: 'Schneiden Sie einen Clip mit einem schnellen, qualitätserhaltenden Trimm auf den gewünschten Teil, wo möglich ohne Neukodierung.',
      metaTitle: 'Video online kostenlos trimmen | Media Manipulator',
      metaDescription: 'Kostenloser Online-Video-Trimmer. Legen Sie Start- und Endzeit fest und schneiden Sie Ihren Clip mit einem schnellen, verlustfreien Trimm. MP4-Ausgabe, ohne Wasserzeichen, ohne Anmeldung. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ogTitle: 'Video online kostenlos trimmen',
      ogDescription: 'Trimmen Sie Videos mit einem schnellen, qualitätserhaltenden Schnitt auf den gewünschten Teil. Kostenlos, ohne Wasserzeichen.',
      intro: 'Trimmen behält einen Abschnitt eines Videos und verwirft den Rest. Die meisten Online-Trimmer kodieren dafür den gesamten Clip neu, was langsam ist und Qualität kostet. Diese Seite macht standardmäßig etwas Einfacheres: Sie bittet FFmpeg, zu Ihrer Startzeit zu springen und die komprimierten Video- und Audiopakete für die gewünschte Dauer in eine neue Datei zu kopieren, ohne sie zu dekodieren. Das ist eine Stream-Kopie, sie ist verlustfrei und läuft etwa so schnell, wie die Datei gelesen werden kann. Wenn die Kopie nicht möglich ist, weil der Quellcodec im gewählten Container nicht zulässig ist oder weil Sie die Option für Bildgenauigkeit angehakt haben, kodiert der Server stattdessen nur den gewählten Abschnitt neu.',
      whatItDoes: [
        'Schneidet einen einzelnen Bereich aus einem Video, von einer Startzeit bis zu einer Endzeit, in Sekunden eingegeben oder auf einer visuellen Zeitleiste gewählt.',
        'Kopiert die Streams ohne Neukodierung, wann immer der Ausgabecontainer die Quellcodecs akzeptiert, sodass der behaltene Teil Bit für Bit das Original ist.',
        'Fällt automatisch auf eine Neukodierung zurück, wenn die Kopie verweigert wird, und lässt Sie eine Neukodierung für einen Schnitt auf das exakte Bild erzwingen.',
        'Schreibt standardmäßig MP4, oder MOV oder WebM; MP4 und MOV erhalten das faststart-Flag, damit die Wiedergabe beginnt, bevor der Download abgeschlossen ist.',
        'Prüft mit ffprobe, dass die Datei tatsächlich einen Videostream hat, und lehnt reine Audio-Uploads mit einer klaren Meldung ab.',
      ],
      flowSteps: [
        {
          title: 'Video hochladen',
          description: 'MP4, MOV, M4V, WebM, MKV, AVI, FLV, WMV, MPEG oder MPG, direkt in unseren Speicher-Bucket hochgeladen.',
        },
        {
          title: 'Start und Ende festlegen',
          description: 'Geben Sie die Sekunden ein oder ziehen Sie die beiden Griffe; das Panel zeigt die resultierende Cliplänge.',
        },
        {
          title: 'Container und bei Bedarf Bildgenauigkeit wählen',
          description: 'MP4 ist voreingestellt. Haken Sie „Für bildgenauen Schnitt neu kodieren“ nur an, wenn das exakte Bild wichtig ist.',
        },
        {
          title: 'FFmpeg schneidet',
          description: 'Eine Stream-Kopie mit -ss, -t und -c copy; oder eine libx264-Neukodierung mit CRF 18, wenn Kopieren unmöglich ist oder Sie es verlangt haben.',
        },
        {
          title: 'Clip herunterladen',
          description: 'Die Ausgabe trägt das Suffix _trimmed und liegt im Auftragsordner, bis ihre Aufbewahrungsfrist endet.',
        },
      ],
      advancedDetails: [
        'Der Stream-Kopier-Befehl ist ffmpeg -ss START -i input -t DURATION -map 0 -c copy -avoid_negative_ts make_zero [-movflags +faststart] output (runTrimVideo in specialized_tools.go). -map 0 behält jeden Stream, einschließlich zusätzlicher Tonspuren und Untertitel, und die Zeiten werden mit Millisekundengenauigkeit geschrieben.',
        'Mit -ss vor -i und ohne Dekodierung kann FFmpeg nur an einem Keyframe beginnen, die Kopie startet also am nächsten Keyframe bei oder vor Ihrer Startzeit. Bei einer Handyaufnahme liegen Keyframes typischerweise 1 bis 2 Sekunden auseinander, mehr kann der Anfang also nicht abweichen; -avoid_negative_ts make_zero setzt dann die Zeitstempel neu, damit Player sauber starten.',
        'Der Neukodierungspfad verwendet buildVideoCodecArgs in der Einstellung für hohe Qualität: libx264 -crf 18 -pix_fmt yuv420p mit AAC für MP4 und MOV, oder libvpx-vp9 -b:v 0 -crf 18 mit Opus für WebM. Nur der erste Videostream und der erste Audiostream (falls vorhanden) werden übernommen, zusätzliche Spuren fallen auf diesem Pfad also weg.',
        'Der Kopiermodus wird als auto gesendet, der die Kopie versucht und bei Fehlschlag neu kodiert. Die Wahl von WebM für eine H.264-Quelle landet immer auf dem Neukodierungspfad, weil WebM nur VP8-, VP9- und AV1-Video akzeptiert.',
        'Prüfung auf dem Server: Der Start muss 0 oder später sein, der Clip muss mindestens 0,1 Sekunden und höchstens 6 Stunden lang sein, und das Ende muss nach dem Start liegen. Alles andere wird abgelehnt, bevor FFmpeg startet, und der Vorgang wird zurückerstattet.',
        'Da Trimmen ein spezialisierter Modus ist, überspringt der Upload die automatisierte Inhaltsanalyse, die Standardkonvertierungen erhalten; der Server führt nur ffprobe und den Schnitt aus.',
      ],
      whyItMatters: [
        'Leerlauf am Anfang und ein verpatztes Ende stecken in fast jeder Aufnahme, und sie zu entfernen ist der häufigste Schnitt überhaupt.',
        'Ein verlustfreier Schnitt bedeutet, dass Sie eine Masterdatei trimmen können, ohne eine Kopie zweiter Generation zu erzeugen.',
        'Zuerst zu schneiden macht jeden späteren Schritt günstiger: Komprimieren, Untertiteln oder das Umwandeln in ein GIF muss nur den behaltenen Teil anfassen.',
      ],
      useCases: [
        {
          title: 'Meeting- und Vorlesungsaufzeichnungen',
          description: 'Entfernen Sie die Minuten, in denen Leute beitreten, bevor der Inhalt beginnt.',
        },
        {
          title: 'Highlights für soziale Medien',
          description: 'Behalten Sie die 20 Sekunden, die zählen, und laden Sie nur diese hoch.',
        },
        {
          title: 'Beweise und Fehlerberichte',
          description: 'Teilen Sie genau den Moment, in dem ein Problem auftrat, mit unveränderter Originalqualität.',
        },
        {
          title: 'Ein GIF oder einen Restaurierungsausschnitt vorbereiten',
          description: 'Schneiden Sie auf wenige Sekunden, bevor Sie den Clip einem Tool übergeben, das am besten mit kurzen Eingaben arbeitet.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein 30 Sekunden langer Stream-Kopie-Schnitt aus einem 180 MB großen, 4,5 Minuten langen 1080p-MP4',
          body: 'Eingabe: ein 4 Minuten 30 Sekunden langes H.264-MP4 mit 1920 x 1080 und 180 MB, etwa 5,3 Mbps, was in die Standard-Gastgrenzen von 200 MB und 5 Minuten passt. Einstellungen: Start 45.000, Ende 75.000, Ausgabe MP4, Neukodierung nicht angehakt. Der Server führt den Kopierbefehl mit -ss 45.000 und -t 30.000 aus. Da die Pakete kopiert werden, enthält die Ausgabe grob 30 der 270 Sekunden Daten, etwa 20 MB, mit exakt der ursprünglichen Qualität, dem Codec und der Bildrate. Der Schnitt beginnt am letzten Keyframe vor 45 s, der Clip kann also bis zu ein oder zwei Sekunden früher einsetzen. Der Auftrag ist durch das Lesen der Datei begrenzt, nicht durch Rechnen, und in wenigen Sekunden fertig.',
        },
        {
          title: 'Ein bildgenauer 12-Sekunden-Schnitt aus einem 60 MB großen 1080p-MP4',
          body: 'Eingabe: ein 2 Minuten langes MP4 mit 1920 x 1080 und 60 MB. Einstellungen: Start 30.250, Ende 42.250, Ausgabe MP4, „Für bildgenauen Schnitt neu kodieren“ angehakt. FFmpeg dekodiert jetzt exakt ab 30.250, kodiert 12 Sekunden (360 Bilder bei 30 fps) mit libx264 bei CRF 18, yuv420p und faststart und kodiert das Audio zu AAC neu. CRF 18 hält das Bild visuell sehr nah an der Quelle, das Ergebnis liegt also pro Sekunde in derselben Größenordnung wie die Quelle, wenige Megabyte für 12 Sekunden. Nur die behaltenen 12 Sekunden werden kodiert, nie die vollen 2 Minuten, es ist also eine kurze Kodierung statt einer Kopie von wenigen Sekunden.',
        },
      ],
      whenNotToUse: 'Verwenden Sie den Trimmer nicht, um mehrere getrennte Abschnitte aus einem Video zu entfernen; er behält genau einen Bereich, ein Schnitt in der Mitte braucht also zwei Trimms und ein Zusammenfügen in Darkroom. Erwarten Sie von einer Stream-Kopie nicht, dass sie das exakte Bild trifft; wenn ein Schnitt, der eine Sekunde zu früh liegt, wichtig ist, haken Sie die Neukodierungsoption an und nehmen Sie eine kurze Kodierung in Kauf. Wenn Ihr eigentliches Ziel eine kleinere Datei ist, hilft Trimmen nur so viel, wie Sie wegschneiden; der Kompressor ändert die Bitrate. Und wenn der Upload keinen Videostream hat, zum Beispiel ein zu MP4 umbenanntes M4A, lehnt der Trimmer ihn ab; die Audio-Tools behandeln reine Audiodateien.',
      whyMediaManipulator: [
        'Verlustfreie Stream-Kopie ist der Standard, mit dokumentiertem Neukodierungs-Fallback statt einer langsamen, aber sicheren Neukodierung von allem im Verborgenen.',
        'Die genauen FFmpeg-Flags stehen auf dieser Seite, einschließlich der Erklärung, warum ein Schnitt am vorherigen Keyframe beginnen kann und wie Sie das vermeiden.',
        'Ein Trimm verbraucht einen Vorgang Ihres Tageskontingents (standardmäßig 5 pro Tag als Gast, 30 mit einem kostenlosen Konto), und ein fehlgeschlagener Auftrag wird zurückerstattet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ],
      privacyNote: 'Der Trimmer führt ffprobe und einen FFmpeg-Befehl auf unseren eigenen Servern aus. Im Standardpfad werden die Video- und Audiopakete kopiert, nie dekodiert, der Server rekonstruiert also kein einziges Bild aus Ihrer Datei; im Neukodierungspfad dekodiert FFmpeg nur die Sekunden, die Sie behalten haben. Der Upload liegt in uploads/<jobId>/ und der Clip in outputs/<jobId>/, beide im Aufbewahrungsregister eingetragen und gelöscht, wenn die Frist endet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre. Trimmen ist ein spezialisierter Modus, daher wird die automatisierte Inhaltsanalyse, die Standardkonvertierungen erhalten, bei diesem Upload nicht ausgeführt, und nichts wird an einen Drittanbieterdienst gesendet.',
      faq: [
        {
          question: 'Kodiert das Trimmen mein Video neu?',
          answer: 'Standardmäßig nicht. Der Server kopiert die komprimierten Streams mit -c copy, der behaltene Teil ist also identisch mit dem Original. Er kodiert nur neu, wenn Sie die Option für Bildgenauigkeit anhaken oder wenn der gewählte Container den Quellcodec nicht aufnehmen kann, wie bei WebM für eine H.264-Datei.',
        },
        {
          question: 'Warum beginnt mein Clip einen Moment vor der eingegebenen Zeit?',
          answer: 'Eine Stream-Kopie kann nur an einem Keyframe beginnen, und FFmpeg wählt den nächsten bei oder vor Ihrer Startzeit. Keyframes liegen bei Kameramaterial meist 1 bis 2 Sekunden auseinander. Haken Sie „Für bildgenauen Schnitt neu kodieren“ an, um auf dem exakten Bild zu starten.',
        },
        {
          question: 'Welche Ausgabecontainer kann ich wählen, und welche behalten die Originalqualität?',
          answer: 'MP4, MOV und WebM. MP4 und MOV akzeptieren das H.264- oder HEVC-Video und AAC-Audio, das die meisten Kameras erzeugen, und bleiben daher verlustfrei. WebM akzeptiert nur VP8, VP9 und AV1, eine H.264-Quelle wird bei dieser Wahl also zu VP9 mit CRF 18 neu kodiert.',
        },
        {
          question: 'Wie lang oder kurz kann der getrimmte Clip sein?',
          answer: 'Mindestens 0,1 Sekunden und höchstens 6 Stunden, mit dem Ende nach dem Start. In der Praxis greifen die Upload-Grenzen zuerst: standardmäßig 5 Minuten Video für einen Gast, 20 Minuten mit einem kostenlosen Konto, 2 Stunden bei Premium.',
        },
        {
          question: 'Behält es alle Tonspuren und Untertitel?',
          answer: 'Im Stream-Kopie-Pfad ja: -map 0 kopiert jeden Stream in der Datei. Im Neukodierungspfad werden nur der erste Video- und der erste Audiostream behalten.',
        },
        {
          question: 'Kann ich ein Video auf einmal in mehrere Teile trimmen?',
          answer: 'Nein. Ein Upload erzeugt einen Clip aus einem Bereich. Für mehrere Teile führen Sie den Trimmer einmal pro Bereich aus oder setzen die Teile auf einer Timeline in Darkroom zusammen.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Stream-Kopie, wo möglich (kein Qualitätsverlust); der Neukodierungs-Fallback verwendet H.264 + AAC für MP4.',
        ],
      },
      related: [
        {
          label: 'Video komprimieren',
          to: '/tools/compress-video',
          description: 'Verkleinern Sie den Clip nach dem Trimmen.',
        },
        {
          label: 'Video in animiertes GIF umwandeln',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Verwandeln Sie die getrimmten Sekunden in ein GIF.',
        },
        {
          label: 'Audio aus Video extrahieren',
          to: '/tools/extract-audio-from-video',
          description: 'Speichern Sie nur den Ton des Clips.',
        },
        {
          label: 'KI-Videorestaurierung',
          to: '/tools/ai-video-restoration',
          description: 'Die Restaurierung arbeitet mit Ausschnitten von 15 Sekunden oder weniger; trimmen Sie zuerst.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Fügen Sie mehrere getrimmte Teile zu einem Schnitt zusammen.',
        },
      ],
      embed: {
        title: 'Ein Video trimmen',
        description: 'Laden Sie ein Video hoch und legen Sie dann Start- und Endzeit fest (oder wählen Sie den Bereich visuell). Wo immer möglich behalten wir die Originalqualität mit einem schnellen, verlustfreien Schnitt.',
      },
    },
    'extract-audio-from-video': {
      name: 'Audio aus Video extrahieren',
      h1: 'Audio aus Video extrahieren',
      tagline: 'Speichern Sie die Tonspur eines beliebigen Videos als saubere MP3-, WAV-, M4A-, AAC-, FLAC- oder OGG-Datei.',
      metaTitle: 'Audio aus Video extrahieren: MP3, WAV, M4A und mehr | Media Manipulator',
      metaDescription: 'Kostenloses Online-Tool zum Extrahieren des Audios aus jeder Videodatei (MP4, MOV, MKV, WebM, AVI). Ausgabe als MP3, WAV, M4A, AAC, FLAC oder OGG. Ohne Anmeldung. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ogTitle: 'Audio aus Video extrahieren',
      ogDescription: 'Speichern Sie die Tonspuren von MP4/MOV/MKV/WebM/AVI als MP3, WAV, M4A, AAC, FLAC oder OGG. Kostenlos, ohne Anmeldung. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      intro: 'Jeder Videocontainer führt sein Audio als separaten Stream, den Ton herauszuholen hat also mit dem Bild gar nichts zu tun. Diese Seite bittet FFmpeg, den ersten Audiostream auszuwählen, das Video zu ignorieren und diesen Stream in das gewählte Format zu kodieren: MP3 für alles, was Musik abspielt, WAV oder FLAC, wenn die Samples unangetastet bleiben sollen, M4A oder AAC für eine kleine Datei, die Telefone nativ verarbeiten, oder OGG Vorbis. Vor dem Start prüft der Server mit ffprobe, dass ein Audiostream existiert, weil FFmpeg sonst ohne Beschwerde eine leere Datei schreiben würde.',
      whatItDoes: [
        'Wählt den ersten Audiostream (-map 0:a:0) aus MP4, MOV, M4V, WebM, MKV, AVI und den anderen gängigen Videocontainern und verwirft das Video (-vn).',
        'Kodiert MP3 mit libmp3lame bei Qualität 2 (variable Bitrate, im Mittel etwa 190 kbps), WAV als 16-Bit-PCM, M4A oder AAC mit 192 kbps, FLAC verlustfrei oder OGG mit libvorbis bei Qualität 5.',
        'Behält die ursprüngliche Abtastrate und Kanalzahl; nichts wird neu abgetastet oder heruntergemischt.',
        'Lehnt ein Video ohne Audiostream von vornherein mit der Meldung ab, dass es nichts zu extrahieren gibt.',
        'Liefert eine einzelne Audiodatei, benannt nach dem Original mit der gewählten Endung.',
      ],
      flowSteps: [
        {
          title: 'Video hochladen',
          description: 'Jeder gängige Container; die Datei geht direkt in unseren Speicher-Bucket, und die API nimmt sie auf.',
        },
        {
          title: 'Audioformat wählen',
          description: 'MP3 ist voreingestellt. WAV und FLAC sind verlustfrei; M4A und AAC sind kompakt; OGG ist die offene verlustbehaftete Option.',
        },
        {
          title: 'ffprobe bestätigt, dass ein Audiostream existiert',
          description: 'Ein stummes Video endet hier mit einem klaren Fehler, statt eine leere Datei zu erzeugen.',
        },
        {
          title: 'FFmpeg kodiert den Stream',
          description: 'Ein Befehl mit -map 0:a:0 -vn und dem Encoder für Ihr Format.',
        },
        {
          title: 'Audio herunterladen',
          description: 'Die Datei liegt im Auftragsordner, bis ihre Aufbewahrungsfrist endet.',
        },
      ],
      advancedDetails: [
        'Der Befehl ist ffmpeg -y -i input -map 0:a:0 -vn <encoder args> output (runExtractAudio in specialized_tools.go). -vn bedeutet, dass der Videostream nie dekodiert wird, weshalb die Extraktion selbst bei 4K-Quellen schnell ist.',
        'MP3 verwendet -c:a libmp3lame -q:a 2, die LAME-V2-Einstellung mit variabler Bitrate, die bei Musik im Mittel etwa 190 kbps erreicht und bei Sprache weniger. WAV verwendet -c:a pcm_s16le, eine 44,1-kHz-Stereoquelle kostet also etwa 10,1 MB pro Minute und eine 48-kHz-Quelle etwa 11 MB pro Minute.',
        'M4A und AAC verwenden beide den nativen FFmpeg-AAC-Encoder mit -b:a 192k. FLAC ist verlustfrei und landet typischerweise bei 50 bis 70 Prozent der WAV-Größe. OGG verwendet -c:a libvorbis -q:a 5, grob 160 kbps.',
        'Es wird kein -ar- oder -ac-Flag übergeben, die Ausgabe behält also Abtastrate und Kanalanordnung der Quelle; 5.1-Surround bleibt in WAV und FLAC 5.1, während MP3 höchstens zwei Kanäle trägt.',
        'Nur Stream 0:a:0 wird übernommen. Eine Datei mit Kommentarspur oder zweiter Sprache behält die Spur, die im Container zuerst aufgeführt ist.',
        'Die Extraktion ist ein spezialisierter Modus: Der Upload wird nicht für die automatisierte Inhaltsanalyse eingereiht, die Standardkonvertierungen erhalten, und die Qualitäts-, Größen- und Effektregler des Videokonverters gelten nicht.',
      ],
      whyItMatters: [
        'Podcaster, Transkribierende und Editoren brauchen meist den Ton ohne die Pixel, und das Video ist oft 20- bis 50-mal größer als das Audio darin.',
        'Ein korrekt getaggtes MP3 oder M4A spielt auf jedem Telefon und in jedem Player, ohne die Videodekodierung, die Akkus leert.',
        'Verlustfreie WAV- oder FLAC-Ausgabe ist die richtige Eingabe für Rauschentfernung, Gesangstrennung oder eine sorgfältige Transkription.',
      ],
      useCases: [
        {
          title: 'Reine Audio-Folgen',
          description: 'Veröffentlichen Sie den Ton eines aufgezeichneten Videointerviews als Podcast-MP3.',
        },
        {
          title: 'Vorbereitung der Transkription',
          description: 'Übergeben Sie eine 18 Minuten lange Aufnahme als 25 MB großes MP3 statt als 540 MB großes MP4 an einen Transkriptionsdienst.',
        },
        {
          title: 'Sounddesign und Sampling',
          description: 'Ziehen Sie ein WAV aus einem Clip, um Atmosphäre oder Musik in einem anderen Schnitt wiederzuverwenden.',
        },
        {
          title: 'Vorlesungsnotizen',
          description: 'Behalten Sie das Audio einer Unterrichtsaufzeichnung zum Anhören unterwegs.',
        },
      ],
      workedExamples: [
        {
          title: 'Eine 18 Minuten lange, 540 MB große 720p-Aufnahme zu MP3',
          body: 'Eingabe: ein 18 Minuten langes MP4 mit 1280 x 720 und 540 MB (etwa 4 Mbps), mit einem kostenlosen Konto hochgeladen, weil es die Gast-Standardwerte von 200 MB und 5 Minuten überschreitet. Einstellungen: MP3. Der Server bestätigt die Stereo-AAC-Spur mit 48 kHz per ffprobe und führt libmp3lame -q:a 2 aus. Bei grob 190 kbps sind das etwa 1,4 MB pro Minute, das Ergebnis kommt also auf etwa 25 MB, etwa ein Zwanzigstel des Uploads. Da -vn das Video vollständig überspringt, ist der Auftrag ein reines Audio-Dekodieren und -Kodieren und schnell; das Hochladen von 540 MB dauert weit länger als das Extrahieren daraus.',
        },
        {
          title: 'Ein 4 Minuten langes, 95 MB großes 1080p-Musikvideo zu WAV',
          body: 'Eingabe: ein 4 Minuten langes MP4 mit 1920 x 1080 und 95 MB mit einer Stereo-AAC-Spur mit 44,1 kHz, innerhalb der Gastgrenzen. Einstellungen: WAV. FFmpeg dekodiert das AAC einmal und schreibt 16-Bit-PCM mit pcm_s16le, wobei 44,1 kHz und zwei Kanäle erhalten bleiben. PCM mit dieser Rate sind 44.100 x 16 x 2 Bits pro Sekunde, etwa 10,1 MB pro Minute, die Datei kommt also auf etwa 40 MB, egal wie laut oder dicht die Musik ist. Die Wahl von FLAC würde dieselben Samples stattdessen verlustfrei auf irgendwo zwischen 20 und 28 MB komprimieren, je nach Material. Die Zeit sind ein paar Sekunden Audiodekodierung; das Video wird nie angefasst.',
        },
      ],
      whenNotToUse: 'Verwenden Sie diese Seite nicht, um den Ton zu verbessern; sie kopiert, was da ist, und eine verrauschte oder entfernte Aufnahme bleibt verrauscht. Die Tools „Stimme säubern“ und „Hintergrundgeräusche entfernen“ sind dafür gebaut. Erwarten Sie nicht, dass ein WAV Qualität zurückholt, die das Video verloren hat; die Quellspur ist fast immer verlustbehaftetes AAC, ein WAV ist also eine getreue Kopie eines komprimierten Signals, kein Studiomaster. Wenn das Video zwei Sprachspuren hat und Sie die zweite brauchen, nimmt dieses Tool nur die erste. Und wenn Sie eigentlich die Wörter wollen, liest der Transkriptionsdienst das Audio und gibt Ihnen direkt Text und Untertitel.',
      whyMediaManipulator: [
        'Die Encoder-Einstellungen sind angegeben: LAME V2 für MP3, 192 kbps für AAC, 16-Bit-PCM für WAV und durchgehend die ursprüngliche Abtastrate.',
        'Ein stummes Video wird von ffprobe erkannt, bevor irgendetwas läuft, sodass Sie nie eine Datei mit null Länge herunterladen.',
        'Eine Extraktion ist ein Vorgang Ihres Tageskontingents: standardmäßig 5 pro Tag ohne Konto, 30 mit einem kostenlosen Konto; ein abgelehnter oder fehlgeschlagener Auftrag wird zurückerstattet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ],
      privacyNote: 'Die Extraktion läuft auf unseren eigenen Servern als ein einzelner FFmpeg-Befehl, der nur den ersten Audiostream Ihres Uploads liest; die Videobilder werden nie dekodiert. Die hochgeladene Datei liegt in uploads/<jobId>/ und das Audio in outputs/<jobId>/, beide im Aufbewahrungsregister eingetragen und entfernt, wenn die Frist endet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre. Da die Extraktion ein spezialisierter Modus ist, durchläuft der Upload nicht die automatisierte Inhaltsanalyse, die Standardkonvertierungen erhalten; er wird weder transkribiert noch beschrieben, und nichts verlässt unsere Hardware.',
      faq: [
        {
          question: 'In welche Audioformate kann ich extrahieren, und welche sind verlustfrei?',
          answer: 'MP3, WAV, M4A, AAC, FLAC und OGG. WAV und FLAC sind verlustfreie Kopien der dekodierten Spur. MP3 (etwa 190 kbps VBR), M4A und AAC (192 kbps) und OGG (Qualität 5) sind verlustbehaftet, liegen aber über der Bitrate der meisten Video-Tonspuren.',
        },
        {
          question: 'Wie groß wird das extrahierte Audio?',
          answer: 'WAV ist etwa 10,1 MB pro Minute bei 44,1 kHz Stereo oder 11 MB bei 48 kHz. MP3 mit der Einstellung dieser Seite ist etwa 1,4 MB pro Minute, M4A und AAC etwa 1,4 MB pro Minute bei 192 kbps, OGG etwa 1,2 MB pro Minute. FLAC landet meist zwischen der Hälfte und zwei Dritteln der WAV-Größe.',
        },
        {
          question: 'Ändert die Extraktion die Abtastrate oder das Stereobild?',
          answer: 'Nein. FFmpeg läuft ohne -ar oder -ac, die Ausgabe behält also Abtastrate und Kanalanordnung der Quelle. Eine Stereospur mit 48 kHz bleibt Stereo mit 48 kHz.',
        },
        {
          question: 'Was passiert, wenn mein Video kein Audio hat?',
          answer: 'Der Server prüft die Datei zuerst und bricht mit der Meldung ab, dass es nichts zu extrahieren gibt. Der Vorgang wird zurückerstattet, und es wird keine leere Datei erzeugt.',
        },
        {
          question: 'Mein Video hat zwei Tonspuren; welche bekomme ich?',
          answer: 'Die erste im Container, Stream 0:a:0. Eine Spurauswahl gibt es noch nicht. Wenn die benötigte Spur die zweite ist, remuxen oder exportieren Sie das Video zuerst mit dieser Spur neu.',
        },
        {
          question: 'Ist das Extrahieren von Audio kostenlos, und wie lang darf ein hochgeladenes Video sein?',
          answer: 'Ja. Standardmäßig kann ein Gast 5 Vorgänge pro Tag mit Dateien bis 200 MB und 5 Minuten ausführen; ein kostenloses Konto erlaubt 30 pro Tag, 1 GB und 20 Minuten; Premium nimmt 5 GB und 2 Stunden. Die aktuellen Limits stehen auf der Preisseite.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Wir extrahieren den ersten Audiostream. Videos ohne Audiostream liefern einen klaren Fehler statt einer leeren Datei.',
        ],
      },
      related: [
        {
          label: 'Video transkribieren',
          to: '/tools/transcribe-video',
          description: 'Überspringen Sie die Audiodatei und erhalten Sie direkt die Wörter.',
        },
        {
          label: 'Sprachaufnahme säubern',
          to: '/tools/clean-voice-audio',
          description: 'Entrauschen und pegeln Sie die extrahierte Sprache.',
        },
        {
          label: 'Hintergrundgeräusche entfernen',
          to: '/tools/remove-background-noise',
          description: 'Nehmen Sie Brummen und Rauschen aus der extrahierten Spur.',
        },
        {
          label: 'Gesang aus Song entfernen',
          to: '/tools/remove-vocals-from-song',
          description: 'Verwandeln Sie die extrahierte Musik in ein Instrumental.',
        },
        {
          label: 'Video trimmen',
          to: '/tools/video-trimmer',
          description: 'Schneiden Sie das Video vor dem Extrahieren auf den gewünschten Teil.',
        },
      ],
      embed: {
        title: 'Die Tonspur aus einem Video extrahieren',
        description: 'Laden Sie einen beliebigen gängigen Videocontainer hoch. Wählen Sie MP3 für breite Kompatibilität, WAV für verlustfrei oder M4A/AAC für eine kompakte komprimierte Datei. Videos ohne Tonspur liefern einen klaren Fehler.',
      },
    },
    'convert-video-to-animated-gif': {
      name: 'Video in animiertes GIF umwandeln',
      h1: 'Video online in animiertes GIF umwandeln',
      tagline: 'Verwandeln Sie kurze MP4-, WebM-, MOV- oder MKV-Clips in Sekunden in teilbare animierte GIFs.',
      metaTitle: 'Video online in animiertes GIF umwandeln (kostenlos) | Media Manipulator',
      metaDescription: 'Kostenloser Online-Konverter von Video zu GIF. Verwandeln Sie kurze MP4-, WebM-, MOV- und MKV-Clips in animierte GIFs mit Kontrolle über Größe und Bildrate.',
      ogTitle: 'Video online in animiertes GIF umwandeln',
      ogDescription: 'Verwandeln Sie kurze Videoclips in teilbare animierte GIFs. Steuern Sie Bildrate, Maße und Schleife.',
      intro: 'Ein animiertes GIF ist ein Stapel von Bildern mit indizierten Farben, höchstens 256 Farben pro Palette, ohne Kompression zwischen den Bildern jenseits einfacher Lauflängenkodierung. Deshalb kann ein GIF von wenigen Sekunden schwerer sein als ein MP4 von einer Minute, und deshalb geht es beim Erstellen eines guten GIF vor allem um die Wahl von Breite, Bildrate und Palettengröße. Diese Seite führt eine zweistufige Pipeline aus: FFmpeg skaliert das Video auf die eingestellte Breite und tastet es mit Ihrer Bildrate ab, wobei ein rohes GIF entsteht, dann quantisiert gifsicle die Palette auf Ihre Farbanzahl neu, setzt die Bildverzögerung und optimiert die Bilder, sodass nur geänderte Pixel gespeichert werden. Die Standardwerte sind auf Bildschirmaufnahmen abgestimmt: 900 Pixel Breite, 12 Bilder pro Sekunde, 128 Farben.',
      whatItDoes: [
        'Skaliert den Clip auf eine gewählte Breite (16 bis 2000 px), wobei die Höhe aus dem Seitenverhältnis berechnet und auf ein Vielfaches von 4 gerundet wird.',
        'Tastet die Quelle mit FFmpeg mit einer gewählten Bildrate ab (1 bis 50 fps; standardmäßig 12).',
        'Quantisiert jedes Bild auf eine Palette von 2 bis 256 Farben (standardmäßig 128) und optimiert die Speicherung zwischen den Bildern mit gifsicle auf Stufe 1 bis 3.',
        'Setzt die Bildverzögerung in Hundertstelsekunden, die die Wiedergabegeschwindigkeit unabhängig von der Abtastrate bestimmt.',
        'Berücksichtigt einen Trimmbereich aus dem Konverterformular, sodass nur die gewählten Sekunden zu Bildern werden.',
      ],
      flowSteps: [
        {
          title: 'Video hochladen und GIF wählen',
          description: 'GIF ist auf dieser Seite bereits als Ausgabe gewählt; der Qualitätsregler ist deaktiviert, weil er nicht zutrifft.',
        },
        {
          title: 'Auf wenige Sekunden trimmen',
          description: 'Nutzen Sie den Trimmregler, um den gewünschten Moment zu behalten; jede zusätzliche Sekunde sind bei der Standardrate 12 weitere Bilder.',
        },
        {
          title: 'Breite, Bildrate, Farben und Verzögerung festlegen',
          description: 'Das Panel „Einstellungen für animiertes GIF“ beginnt bei 900 px, 12 fps, 128 Farben, Verzögerung 3, Optimierung 3.',
        },
        {
          title: 'FFmpeg tastet ab, gifsicle optimiert',
          description: 'ffmpeg scale=W:-4 -pix_fmt rgb8 -r FPS, dann gifsicle --optimize --delay --colors --interlace.',
        },
        {
          title: 'GIF herunterladen',
          description: 'Ein normales GIF in Schleife, das Chat-Apps und Browser inline abspielen.',
        },
      ],
      advancedDetails: [
        'Stufe eins ist ffmpeg -i input [-ss START -t DURATION] -vf scale=W:-4 -pix_fmt rgb8 -r FPS -f gif raw.gif (convertVideoToGIF in converter.go). Das -4 fordert eine Höhe, die das Seitenverhältnis behält und durch 4 teilbar ist; rgb8 ist ein indiziertes 8-Bit-Zwischenformat, das Stufe zwei neu quantisiert.',
        'Stufe zwei ist gifsicle --optimize=L --delay=D --colors C --interlace raw.gif -o output.gif. Optimierungsstufe 3 ist die langsamste und kleinste: Sie speichert nur das Rechteck der Pixel, die sich zwischen den Bildern geändert haben, weshalb ein Screencast mit statischer Werkzeugleiste weit besser komprimiert als eine Kameraschwenk-Aufnahme.',
        'Die Verzögerung wird nach dem Abtasten auf jedes Bild angewendet und ist von der Abtastrate unabhängig. Bei den Standardwerten 12 fps und Verzögerung 3 (30 ms pro Bild) spielt ein Clip etwa 2,8-mal schneller als in Echtzeit; setzen Sie die Verzögerung auf 8 (80 ms, 12,5 fps) für ungefähr Echtzeitwiedergabe bei 12 fps oder auf 10 bei 10 fps.',
        'Eine in das Hauptfeld „Breite“ des Konverters eingegebene Breite überschreibt die Breite des GIF-Panels, sodass erfahrene Nutzer bei einem Regler bleiben können. Die Farben werden vom Formular auf 2 bis 256 begrenzt; eine GIF-Palette kann nie mehr als 256 haben.',
        'Es gibt hier keinen palettegen-Durchgang in FFmpeg; die Palettenqualität kommt von gifsicle --colors, das eine optimierte Palette für die gesamte Animation erstellt. Fotografische Clips mit weichen Verläufen profitieren von 256 Farben; flaches UI-Material sieht bei 64 identisch aus.',
        'Die gifsicle-Stufe läuft mit einem Timeout von 6 Stunden, und der Upload erhält außerdem die automatisierte Inhaltsanalyse, die Standardkonvertierungen bekommen, da GIF ein Format des regulären Videokonverters ist.',
      ],
      whyItMatters: [
        'GIFs spielen inline automatisch in Issue-Trackern, Chat-Apps, Dokumentationsseiten und E-Mail-Programmen, wo ein Videoanhang eine Abspieltaste oder gar nichts zeigen würde.',
        'Ein 5 Sekunden langes GIF eines Fehlers reproduziert ihn schneller als ein Absatz und braucht keinen Videoplayer.',
        'Paletten- und Bildratenwahl ändern die Größe um eine Zehnerpotenz, sie offenzulegen ist also besser als eine Einheitsvorgabe.',
      ],
      useCases: [
        {
          title: 'Fehlerreproduktionen',
          description: 'Nehmen Sie den Bildschirm auf, trimmen Sie auf den Fehler und legen Sie das GIF ins Ticket.',
        },
        {
          title: 'README- und Dokumentations-Demos',
          description: 'Zeigen Sie eine Funktion in Bewegung, wo eine Videoeinbettung nicht erlaubt ist.',
        },
        {
          title: 'Reaktionsclips',
          description: 'Schneiden Sie 3 Sekunden aus einem Video und teilen Sie sie überall, wo Bilder akzeptiert werden.',
        },
        {
          title: 'E-Mail-Vorschauen',
          description: 'Ein kleines GIF in Schleife, das zum vollständigen Video verlinkt, wo Video selbst nicht abspielt.',
        },
      ],
      workedExamples: [
        {
          title: 'Eine 8 Sekunden lange 1080p-Bildschirmaufnahme mit den Standardwerten',
          body: 'Eingabe: eine 8 Sekunden lange MP4-Bildschirmaufnahme mit 1920 x 1080 und etwa 15 MB. Einstellungen: GIF, Breite 900, 12 fps, 128 Farben, Verzögerung 3, Optimierung 3. FFmpeg skaliert auf 900 Pixel Breite und etwa 506 Höhe (auf ein Vielfaches von 4 angepasst) und tastet 96 Bilder ab. Unkomprimiert wären diese 96 indizierten Bilder etwa 43 MB (900 x 504 x 96 Bytes), die Obergrenze, von der gifsicle nach unten arbeitet; mit statischer Werkzeugleiste und bewegtem Cursor speichert die Optimierung auf Stufe 3 nur die sich ändernden Rechtecke, ein Screencast landet also weit unter dieser Grenze, typischerweise im niedrigen Megabyte-Bereich. Mit Verzögerung 3 spielen die 96 Bilder in etwa 2,9 Sekunden, grob 2,8-mal schneller als die 8 Sekunden lange Quelle; setzen Sie die Verzögerung auf 8, um in etwa 7,7 Sekunden abzuspielen. Der Auftrag ist eine kurze Kodierung plus ein gifsicle-Durchgang über 96 Bilder.',
        },
        {
          title: 'Ein 5 Sekunden langer Reaktionsclip mit 480 px, 10 fps und 64 Farben',
          body: 'Eingabe: ein 20 Sekunden langes 1080p-MP4 mit 40 MB, im Formular auf einen Bereich von 5 Sekunden getrimmt. Einstellungen: GIF, Breite 480, 10 fps, 64 Farben, Verzögerung 10, Optimierung 3. FFmpeg schneidet die 5 Sekunden, skaliert auf 480 Pixel Breite und etwa 270 Höhe (auf ein Vielfaches von 4 gerundet) und tastet 50 Bilder ab. Die rohen Bilddaten sind vor der Optimierung etwa 6,5 MB (480 x 268 x 50 Bytes), und eine Palette mit 64 Farben braucht nur 6 Bit pro Pixel, eine Kameraaufnahme mit Bewegung im ganzen Bild kommt also immer noch deutlich darunter heraus, während ein ruhiger Talking Head auf einen Bruchteil davon komprimiert. Verzögerung 10 sind 100 ms pro Bild, 50 Bilder spielen also in genau 5 Sekunden, passend zur Echtzeit bei 10 fps.',
        },
      ],
      whenNotToUse: 'Machen Sie kein GIF aus etwas, das länger als etwa 10 Sekunden ist oder fotografische Bewegung im ganzen Bild hat; das Format hat keine echte Kompression zwischen den Bildern, solche Clips werden also Dutzende Megabyte groß, während ein MP4 oder WebM desselben Inhalts ein Zehntel der Größe hat. Verwenden Sie GIF nicht, wenn Farbtreue wichtig ist, da jedes Bild auf eine Palette von 256 Farben begrenzt ist und Verläufe Streifen bilden. Wenn das Ziel Video inline abspielt, ist ein komprimiertes MP4 in jeder Hinsicht besser. Und wenn Sie Audio brauchen, kann ein GIF es überhaupt nicht tragen.',
      whyMediaManipulator: [
        'Beide Stufen der Pipeline und ihre Standardwerte sind hier dokumentiert, einschließlich des Verzögerungsverhaltens, das Standard-GIFs schnell abspielen lässt.',
        'Breite, Bildrate, Farbanzahl, Verzögerung und Optimierungsstufe sind alle zugänglich, nicht nur ein einzelner Größenregler.',
        'Eine GIF-Konvertierung zählt als ein Vorgang (standardmäßig 5 pro Tag für Gäste, 30 mit einem kostenlosen Konto), und ein fehlgeschlagener Auftrag wird zurückerstattet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ],
      privacyNote: 'Die GIF-Konvertierung läuft auf unseren eigenen Servern: FFmpeg tastet die Bilder ab und skaliert sie, dann quantisiert und optimiert gifsicle sie; ein temporäres rohes GIF wird gelöscht, sobald gifsicle fertig ist. Der Upload wird in uploads/<jobId>/ und das GIF in outputs/<jobId>/ aufbewahrt, beide im Aufbewahrungsregister und gelöscht, wenn die Frist endet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre. Als Format des Standard-Videokonverters durchläuft der Upload außerdem unsere automatisierte Inhaltsanalyse auf derselben Hardware (abgetastete Bilder, beschrieben von einem lokalen Bildmodell, etwaiges Audio lokal transkribiert); dieser Bericht bleibt beim Auftrag und wird nicht an Dritte weitergegeben.',
      faq: [
        {
          question: 'Warum spielt mein GIF schneller als das Originalvideo?',
          answer: 'Die Bildverzögerung wird nach dem Abtasten gesetzt und beträgt standardmäßig 3 Hundertstelsekunden, was bei mit 12 pro Sekunde abgetasteten Bildern etwa 33 Bilder pro Sekunde Wiedergabe ergibt. Setzen Sie die Verzögerung auf 8 bei 12 fps oder auf 10 bei 10 fps für Echtzeitwiedergabe.',
        },
        {
          question: 'Wie mache ich das GIF kleiner?',
          answer: 'In der Reihenfolge der Wirkung: auf weniger Sekunden trimmen, die Breite senken (480 reicht für Chats völlig), die Bildrate auf 8 oder 10 senken und die Farben bei flachem UI-Material auf 64 reduzieren. Lassen Sie die Optimierung auf 3; die Stufen 1 und 2 tauschen nur Größe gegen Geschwindigkeit.',
        },
        {
          question: 'Wie viele Farben soll ich verwenden?',
          answer: '128, der Standard, passt zu den meisten Bildschirmaufnahmen. Flache Oberflächen sehen bei 64 identisch aus und sparen Bytes. Fotografisches Material mit Verläufen will 256, das GIF-Maximum.',
        },
        {
          question: 'Kann ich wählen, welcher Teil des Videos zum GIF wird?',
          answer: 'Ja. Nutzen Sie den Trimmregler im Konverter, um Start und Ende festzulegen; nur dieser Bereich wird abgetastet. Kürzer ist besser, da jede Sekunde Bilder mit der gewählten Rate hinzufügt.',
        },
        {
          question: 'Läuft das GIF in Schleife, und behält es den Ton?',
          answer: 'Es läuft in Schleife, wie GIFs standardmäßig in jedem Player. Es kann kein Audio tragen; das Format hat keine Tonspur. Extrahieren Sie das Audio separat, wenn Sie es brauchen.',
        },
        {
          question: 'Was ist das größte GIF, das ich erstellen kann?',
          answer: 'Das Formular erlaubt bis zu 2000 px Breite, 50 fps und 256 Farben, aber ein GIF mit diesen Einstellungen wächst schnell enorm. Der Upload selbst ist durch Ihren Tarif begrenzt, standardmäßig 200 MB und 5 Minuten Video für einen Gast.',
        },
      ],
      related: [
        {
          label: 'Video trimmen',
          to: '/tools/video-trimmer',
          description: 'Schneiden Sie zuerst die exakten Sekunden, verlustfrei.',
        },
        {
          label: 'Video komprimieren',
          to: '/tools/compress-video',
          description: 'Für alles, was länger als ein paar Sekunden ist, schlägt ein kleines MP4 ein GIF.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Fügen Sie Untertitel hinzu oder schneiden Sie zu, bevor Sie den Clip exportieren.',
        },
        {
          label: 'Videokonverter-Tutorial',
          to: '/tutorials/video/getting-started',
          description: 'Schritt für Schritt durch Trimm-, Größen- und Filtereinstellungen.',
        },
      ],
      embed: {
        title: 'Einen Videoclip in GIF umwandeln',
        description: 'Laden Sie ein kurzes Video hoch und wählen Sie GIF als Ausgabeformat. Trimmen Sie auf unter ~10 Sekunden und senken Sie die Bildrate für eine kleinere Datei.',
      },
    },
    'transcribe-video': {
      name: 'Video transkribieren',
      h1: 'Video online in Text transkribieren',
      tagline: 'Holen Sie die gesprochenen Wörter aus einer Video- oder Audiodatei als WebVTT- oder SRT-Untertitel, Klartext oder JSON mit Zeitstempeln.',
      metaTitle: 'Video online in Text transkribieren (kostenlos) | Media Manipulator',
      metaDescription: 'Kostenlose Online-Videotranskription. Wandeln Sie MP4-, MOV-, WebM-, MKV- und Audiodateien in durchsuchbaren Text, VTT-Untertitel oder JSON-Transkripte um.',
      ogTitle: 'Video online in Text transkribieren',
      ogDescription: 'Extrahieren Sie Sprache aus Videos als Text, Untertitel oder JSON-Transkripte. Läuft auf einem lokalen GPU-Server.',
      intro: '„Video transkribieren“ nimmt ein MP4, MOV, WebM, MKV oder eine reine Audiodatei, trennt die Tonspur ab und lässt sie durch Whisper auf einem GPU-Server laufen, den wir betreiben. Sie wählen die Form des Ergebnisses vor dem Upload: eine WebVTT- oder SRT-Untertiteldatei mit Cue-Zeiten, eine Klartextdatei nur mit den Wörtern oder ein JSON-Dokument mit jedem Segment und seiner Start- und Endzeit auf die Millisekunde. Die Sprache wird automatisch erkannt, oder Sie geben einen zweibuchstabigen Code ein, um sie festzulegen.',
      whatItDoes: [
        'Dekodiert die Tonspur mit ffmpeg in ein Mono-WAV mit 16 kHz, der Abtastrate, die Whisper erwartet, und löscht diese Zwischendatei, wenn der Auftrag abgeschlossen ist.',
        'Führt whisper-ctranslate2 mit dem Whisper-Modell medium in float16 auf unserer GPU aus, mit eingeschalteter Sprachaktivitätsfilterung, sodass Stille und lange Musikpassagen übersprungen werden.',
        'Schreibt eine Datei namens transcript.vtt, transcript.srt, transcript.txt oder transcript.json, je nach gewähltem Format.',
        'Erkennt die gesprochene Sprache aus dem Audio selbst; ein im Formular eingegebener Sprachcode überschreibt die Erkennung bei kurzen oder gemischten Clips.',
        'Meldet ehrlich, wenn es nichts zu transkribieren gibt: Ein Video ohne Audiostream oder Audio ohne erkennbare Sprache wird trotzdem mit einer kurzen Meldung abgeschlossen statt mit einer leeren Datei.',
      ],
      flowSteps: [
        {
          title: 'Video oder Audio hochladen',
          description: 'MP4, MOV, WebM, MKV, AVI oder eine Audiodatei wie MP3, WAV, M4A oder FLAC.',
        },
        {
          title: 'Format wählen',
          description: 'VTT oder SRT für Untertitel, TXT für ein lesbares Transkript, JSON für Zeitstempel, die Sie weiterverarbeiten können.',
        },
        {
          title: 'ffmpeg extrahiert das Audio',
          description: 'Die Spur wird in Mono-PCM mit 16 kHz umgewandelt; die Videobilder werden nie dekodiert.',
        },
        {
          title: 'Whisper transkribiert auf unserer GPU',
          description: 'Der Auftrag wartet auf einen freien GPU-Platz, dann läuft das Modell medium in einem Durchgang über die gesamte Datei.',
        },
        {
          title: 'Transkript herunterladen',
          description: 'Die Datei erscheint beim Auftrag und kann heruntergeladen werden, solange der Auftrag aufbewahrt wird.',
        },
      ],
      advancedDetails: [
        'Der genaue Extraktionsbefehl ist ffmpeg -vn -acodec pcm_s16le -ar 16000 -ac 1, eine Stereospur mit 48 kHz wird also auf Mono zusammengelegt und neu abgetastet, bevor Whisper sie sieht. Diese Zwischendatei kostet 32 KB pro Sekunde (etwa 1,9 MB pro Minute) Speicherplatz, während der Auftrag läuft, und wird danach entfernt.',
        'whisper-ctranslate2 wird mit --model medium --device cuda --compute_type float16 --vad_filter True und --output_format json gestartet; die API liest dieses JSON und erzeugt Ihr gewähltes Format selbst. Das Modell ist eine Servereinstellung (WHISPER_CT2_MODEL), medium ist also der Standard, kein Versprechen.',
        'VTT-Ausgabe beginnt mit dem WEBVTT-Header und nummeriert jeden Cue; Zeitstempel sind HH:MM:SS.mmm. SRT ist dieselbe Cue-Liste mit Kommas als Millisekundentrenner. Ein Segment, dessen Ende gleich seinem Start ist, erhält eine halbe Sekunde, damit Player es trotzdem anzeigen.',
        'JSON-Ausgabe enthält language, hasAudio, hasSpeech, transcript, durationSeconds und ein Array segments aus {id, start, end, text} mit auf die Millisekunde gerundeten Zeiten. Es gibt in dieser Ausgabe keine Zeiten pro Wort und keine Konfidenzwerte.',
        'Standardmäßig läuft nur ein Whisper-Prozess gleichzeitig (WHISPER_GPU_CONCURRENCY=1), und der GPU-Scheduler prüft vor dem Start den freien VRAM; das Modell medium in float16 braucht etwa 3,5 GB plus 512 MB Reserve. Ist die Karte belegt, wartet Ihr Auftrag in der Warteschlange, statt fehlzuschlagen.',
        'Mit eingeschaltetem VAD-Filter kann eine Datei, die nur Musik oder sehr leise Sprache enthält, mit „Audio was detected but no recognizable speech was found.“ zurückkommen. Diese Meldung wird in die Transkriptdatei geschrieben, sodass der Download nie leer ist.',
      ],
      whyItMatters: [
        'Eine Untertiteldatei macht den Unterschied zwischen einem Video, das stumm angesehen, durchsucht oder zitiert werden kann, und einem, bei dem das nicht geht.',
        'Segmente mit Zeitstempeln lassen Sie zu dem Moment springen, in dem ein Satz gesagt wurde, und machen aus einer zweistündigen Aufzeichnung etwas, das Sie tatsächlich nutzen können.',
        'Die Transkription auf Hardware zu belassen, die wir betreiben, bedeutet, dass das Audio nicht an eine externe Sprach-API übergeben wird.',
      ],
      useCases: [
        {
          title: 'Untertitel für ein veröffentlichtes Video',
          description: 'Exportieren Sie VTT für HTML-Video und die meisten Web-Player oder SRT für Schnittprogramme und Untertitel-Workflows im TV-Stil.',
        },
        {
          title: 'Meeting- und Interviewnotizen',
          description: 'Übernehmen Sie die TXT-Ausgabe in ein Dokument und bearbeiten Sie von dort aus, statt alles von Grund auf zu tippen.',
        },
        {
          title: 'Ein Aufnahmearchiv indexieren',
          description: 'Nutzen Sie die JSON-Segmente, um einen Suchindex zu bauen, der auf die exakte Sekunde zeigt, in der ein Wort gesprochen wurde.',
        },
        {
          title: 'Ein erster Entwurf eines Artikels',
          description: 'Transkribieren Sie einen Vortrag oder Screencast und schreiben Sie den Klartext dann zu Prosa um.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein 9-minütiges 1080p-MP4 mit 120 MB als VTT-Untertitel',
          body: 'Die 120 MB liegen unter der Gastgrenze von 200 MB, aber 9 Minuten überschreiten das Gastlimit von 5 Minuten, dieser Fall braucht also ein kostenloses Konto, das standardmäßig 20 Minuten erlaubt. ffmpeg schreibt ein Mono-WAV mit 16 kHz und etwa 17 MB (32.000 Bytes pro Sekunde für 540 Sekunden), das nach dem Lauf gelöscht wird. Whisper medium erzeugt dann nummerierte Cues mit Zeiten im Format HH:MM:SS.mmm, und die entstehende transcript.vtt ist wenige Kilobyte groß, weil sie nur Text und Zeitstempel enthält. Das Hochladen von 120 MB über eine Heimverbindung dauert meist länger als die Extraktion, die wenige Sekunden braucht; der Whisper-Durchlauf ist der Rest und skaliert mit der Länge der Sprache, nicht mit der Größe des Videos.',
        },
        {
          title: 'Ein 18-minütiges Podcast-MP3 mit etwa 26 MB als JSON',
          body: 'Ein MP3 mit 192 kbps sind 24 KB pro Sekunde, 1.080 Sekunden ergeben also etwa 26 MB. Reine Audiodateien unterliegen demselben Längenlimit wie Video, 18 Minuten brauchen also ein kostenloses Konto (Grenze 20 Minuten) statt einer Gastsitzung (5 Minuten). Es gibt kein Video zu überspringen, aber die Datei wird trotzdem zuerst in Mono-PCM mit 16 kHz umgewandelt (etwa 35 MB auf der Festplatte, danach entfernt). Die Sprache wird aus dem Audio erkannt und als zweibuchstabiger Code ins JSON geschrieben, und jedes Segment trägt seine eigene Start- und Endzeit. Das JSON ist größer als die TXT derselben Aufnahme, weil jedes Segment in ein eigenes Objekt gehüllt ist, bleibt aber deutlich unter einem Megabyte.',
        },
      ],
      whenNotToUse: 'Verwenden Sie dies nicht, wenn Sie Zeiten pro Wort, Sprecherkennzeichnungen oder Konfidenzwerte brauchen: Die Ausgabe hat nichts davon, nur Zeitstempel auf Segmentebene. Es ist auch das falsche Tool für eine Datei, deren Audio Musik ohne Sprache ist, da der Sprachaktivitätsfilter sie überspringt und Sie statt Liedtexten eine kurze Meldung erhalten. Wenn Sie die Datei nur anhören möchten oder Untertitel in eine andere Sprache übersetzt haben wollen, suchen Sie einen anderen Schritt. Und wenn die Aufnahme länger ist, als Ihr Tarif erlaubt (standardmäßig 5 Minuten als Gast, 20 Minuten mit einem kostenlosen Konto), trimmen Sie sie zuerst oder melden Sie sich an.',
      whyMediaManipulator: [
        'Sie wählen VTT, SRT, TXT oder JSON vor dem Upload, es gibt also keinen zweiten Konvertierungsschritt, nachdem das Transkript existiert.',
        'Whisper läuft auf unserer eigenen GPU mit dem Modell-Cache im Offline-Modus; kein externer Sprachdienst erhält das Audio.',
        'Die Transkription zählt als ein KI-Auftrag aus dem KI-Kontingent, das vom Standardkontingent getrennt ist: standardmäßig 3 pro Tag als Gast und 10 mit einem kostenlosen Konto, und Ihre Standardaufträge bleiben unberührt (siehe /pricing).',
      ],
      privacyNote: 'Ihre Video- oder Audiodatei wird in ihrem Auftragsordner auf unserem Server gespeichert. ffmpeg schreibt ein temporäres Mono-WAV mit 16 kHz, das Whisper auf unserer GPU liest, und dieses WAV wird gelöscht, wenn der Auftrag abgeschlossen ist. Die Transkriptdatei und eine Kopie der Segmente als transcribe_result.json bleiben beim Auftrag, und der Transkripttext wird außerdem an ein Sprachmodell auf unserer eigenen Hardware übergeben, für eine automatisierte Zusammenfassung und Sicherheitsprüfung, deren Ergebnis beim Auftrag aufbewahrt wird. Nichts wird an einen externen KI-Anbieter gesendet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      faq: [
        {
          question: 'Welches Untertitelformat soll ich wählen, VTT oder SRT?',
          answer: 'VTT, wenn die Untertitel fürs Web sind (HTML-Video, die meisten Player), und SRT, wenn sie in ein Schnittprogramm oder einen Workflow im Broadcast-Stil gehen. Beide enthalten dieselben Cues; nur der Header und der Millisekundentrenner unterscheiden sich, ein Punkt bei VTT und ein Komma bei SRT.',
        },
        {
          question: 'Enthält das JSON-Transkript Konfidenzwerte oder Zeiten pro Wort?',
          answer: 'Nein. Jedes Segment hat eine id, eine Start- und Endzeit in Sekunden (auf die Millisekunde gerundet) und seinen Text. Die Datei hält auch die erkannte Sprache, die Dauer und ob Sprache gefunden wurde fest, aber es gibt keine Zeiten pro Wort und keine Wahrscheinlichkeiten.',
        },
        {
          question: 'Wie lang darf eine Datei sein, die ich transkribiere?',
          answer: 'Reine Audio-Uploads unterliegen derselben Längengrenze wie Video: standardmäßig 5 Minuten für einen Gast, 20 Minuten mit einem kostenlosen Konto, 2 Stunden bei Premium und Pro, sowie 200 MB, 1 GB bzw. 5 GB pro Datei. Das Formular zeigt die für Sie geltenden Limits, und /pricing listet die aktuellen Zahlen.',
        },
        {
          question: 'Warum habe ich „no recognizable speech was found“ erhalten?',
          answer: 'Whisper läuft mit eingeschalteter Sprachaktivitätserkennung, eine Datei mit Musik, Umgebungsgeräuschen, Stille oder sehr leiser Sprache kann also auf nichts zusammengekürzt werden. Die Meldung wird in die Transkriptdatei selbst geschrieben, sodass der Download trotzdem funktioniert. Nehmen Sie lauter neu auf oder trimmen Sie auf den gesprochenen Teil und versuchen Sie es erneut.',
        },
        {
          question: 'Kann ich die Sprache erzwingen, statt sie erkennen zu lassen?',
          answer: 'Ja. Geben Sie im Sprachfeld einen zweibuchstabigen Sprachcode wie en, de oder es ein, und Whisper transkribiert in dieser Sprache. Lassen Sie es leer für automatische Erkennung, die bei Clips von mehr als ein paar Sekunden gut funktioniert.',
        },
        {
          question: 'Verbraucht die Transkription mein KI-Kontingent?',
          answer: 'Ja. Jede Transkription ist ein KI-Auftrag: standardmäßig 3 pro Tag als Gast, 10 mit einem kostenlosen Konto, 100 bei Premium und 200 bei Pro. Das KI-Kontingent ist ein eigener Zähler, die Transkription verbraucht also nie das Standardkontingent für Konvertierungen. Ein fehlgeschlagener Auftrag erstattet die Einheit zurück.',
        },
        {
          question: 'Welches Modell wird verwendet, und kann ich ein größeres wählen?',
          answer: 'Der Dienst führt standardmäßig whisper-ctranslate2 mit dem Modell medium in float16 auf einer CUDA-GPU aus. Es gibt keine Modellauswahl im Formular; das Modell wird auf dem Server festgelegt, sehr schnelle oder sehr große Varianten können Sie also nicht pro Auftrag anfordern.',
        },
      ],
      related: [
        {
          label: 'Video komprimieren',
          to: '/tools/compress-video',
          description: 'Verkleinern Sie eine große Aufnahme, bevor Sie sie für ein Transkript hochladen.',
        },
        {
          label: 'Audio aus Video extrahieren',
          to: '/tools/extract-audio-from-video',
          description: 'Ziehen Sie die Tonspur heraus, wenn Sie auch eine Kopie davon behalten möchten.',
        },
        {
          label: 'Sprachaufnahme säubern',
          to: '/tools/clean-voice-audio',
          description: 'Verbessern Sie eine verrauschte Aufnahme vor dem Transkribieren.',
        },
        {
          label: 'Video-Trimmer',
          to: '/tools/video-trimmer',
          description: 'Kürzen Sie die Datei zuerst auf den gesprochenen Teil.',
        },
        {
          label: 'Videokonverter-Tutorial',
          to: '/tutorials/video/getting-started',
          description: 'Bereiten Sie das Video vor dem Transkribieren vor und konvertieren Sie es.',
        },
      ],
      embed: {
        title: 'Ein Video transkribieren',
        description: 'Laden Sie ein Video hoch. Das KI-Transkriptionsmodell läuft auf unserem lokalen GPU-Server und exportiert als VTT-Untertitel, Klartext oder JSON: VTT für Untertitel, Klartext für einen Artikel, JSON für nachgelagerte Werkzeuge.',
      },
    },
    'transcode-to-hls': {
      name: 'Video in HLS transkodieren',
      h1: 'Video online in HLS transkodieren',
      tagline: 'Verpacken Sie jedes Video in ein Apple-HLS-VOD-Paket: master.m3u8, .ts-Segmente pro Rendition, bereit fürs Web.',
      metaTitle: 'Video online in HLS transkodieren (kostenlos) | Media Manipulator',
      metaDescription: 'Kostenloser Online-HLS-Transcoder. Wandeln Sie MP4, MOV, WebM, MKV in ein HLS-VOD-Paket mit Renditionen in 360p/480p/720p, optionalen Untertiteln und Storyboards um.',
      ogTitle: 'Video online in HLS transkodieren',
      ogDescription: 'Erzeugen Sie ein adaptives HLS-Paket (master.m3u8 + Varianten-Playlists + .ts-Segmente) aus jedem Video, kostenlos, in Ihrem Browser.',
      intro: 'HTTP Live Streaming liefert ein Video als Playlist kurzer Segmente in mehreren Qualitätsstufen, sodass ein Player schnell starten und bei wechselnder Verbindung die Stufe wechseln kann. Dieses Paket von Hand zu erzeugen bedeutet, jede Rendition mit ausgerichteten Keyframes zu kodieren, sie zu segmentieren und eine Master-Playlist zu schreiben, die jede Variante korrekt beschreibt. Diese Seite erledigt die ganze Arbeit: Sie analysiert Ihren Upload, bietet die Stufen der Leiter an, die Quelle und Tarif erlauben, kodiert jede mit libx264 und AAC in 2-Sekunden-MPEG-TS-Segmente, fügt optional Untertitel aus unserem eigenen Whisper-Transkriptionsdienst, ein Storyboard-Sprite-Sheet und eine I-Frame-Playlist zum Scrubben hinzu und bündelt alles als tar.gz oder zip, das Sie auf jedem statischen Host entpacken können.',
      whatItDoes: [
        'Analysiert die Quelle mit ffprobe und listet die Stufen der Leiter: 144p, 240p, 360p, 480p, 720p, 1080p und 2160p, jede nur aktiviert, wenn die Quelle hoch genug ist und Ihr Tarif es erlaubt.',
        'Kodiert jede gewählte Stufe mit libx264 High-Profil Level 4.1 und AAC Stereo mit 48 kHz in 2-Sekunden-.ts-Segmente mit einem Keyframe an jeder Segmentgrenze.',
        'Schreibt hls/master.m3u8 mit BANDWIDTH, RESOLUTION, FRAME-RATE und CODECS für jede Variante sowie eine index.m3u8 pro Stufe.',
        'Transkribiert das Audio optional mit Whisper in eine WebVTT-Spur, übersetzt sie mit einem lokalen Modell in bis zu 3 weitere Sprachen und verknüpft jede als Untertitel-Rendition im Master.',
        'Rendert optional ein Storyboard-Sprite-Sheet mit WebVTT-Index für Scrubber-Vorschaubilder und versucht immer, eine reine I-Frame-Playlist in 240p hinzuzufügen.',
        'Verpackt den Ordner mit README.txt und report.json in ein tar.gz (oder zip) und gibt Ihnen einen vorsignierten Download-Link.',
      ],
      flowSteps: [
        {
          title: 'Hochladen',
          description: 'Der Browser lädt direkt per vorsigniertem PUT in unseren Speicher-Bucket hoch; die API lädt die Datei dann zur Bearbeitung herunter.',
        },
        {
          title: 'Analysieren',
          description: 'ffprobe liest Breite, Höhe, Bildrate, Dauer und ob Audio vorhanden ist; Stufen, die höher als die Quelle sind, werden ausgegraut.',
        },
        {
          title: 'Stufen und Extras wählen',
          description: '360p, 480p und 720p sind vorausgewählt. Haken Sie Untertitel, zusätzliche Untertitelsprachen, Storyboards sowie tar.gz oder zip an.',
        },
        {
          title: 'Jede Stufe kodieren',
          description: 'libx264 mit dem CRF und der Bitrate der Stufe und einer GOP von 2 Sekunden, AAC mit der Audio-Bitrate der Stufe, HLS-VOD-Ausgabe.',
        },
        {
          title: 'Extras hinzufügen und Master schreiben',
          description: 'Untertitel, Storyboards und die I-Frame-Playlist werden erzeugt, dann wird master.m3u8 neu geschrieben, um sie zu referenzieren.',
        },
        {
          title: 'Paket herunterladen',
          description: 'Ein vorsignierter Link, standardmäßig 30 Minuten gültig; die Auftragsseite lässt Sie ihn abrufen, solange er gilt.',
        },
      ],
      advancedDetails: [
        'Die Leiter (transcode_profiles.go) ist: 144p 200 kbps Video und 64 kbps Audio, CRF 26; 240p 400/64, CRF 25; 360p 800/96, CRF 23; 480p 1200/128, CRF 23; 720p 2800/128, CRF 22; 1080p 5000/192, CRF 22; 2160p 12000/256, CRF 21. Alle Stufen verwenden das Preset veryfast außer 2160p, das slow verwendet.',
        'Jede Stufe wird kodiert als ffmpeg -i input -map 0:v:0 -vf scale=-2:H -r FPS -c:v libx264 -profile:v high -level 4.1 -preset P -crf N -sc_threshold 0 -g GOP -keyint_min GOP -b:v B -maxrate 1.2B -bufsize 2B -force_key_frames expr:gte(t,n_forced*2) -map 0:a:0? -c:a aac -b:a A -ac 2 -ar 48000 -hls_time 2 -hls_playlist_type vod -hls_flags independent_segments. GOP ist die Bildrate mal 2, sodass Segmente in jeder Stufe an Keyframes beginnen.',
        'Da die Kodierung CRF-gesteuert ist mit -maxrate als Obergrenze, liegt eine Stufe im Mittel höchstens etwa bei ihrer gelisteten Bitrate (die Obergrenze ist das 1,2-Fache) und bei einfachem Inhalt darunter. Die Master-Playlist gibt BANDWIDTH als gelistete Video- plus Audio-Bitrate an und CODECS als avc1.640028, ergänzt um mp4a.40.2, wenn Audio vorhanden ist.',
        'Standardmäßig darf ein Gast 360p bis 720p wählen, ein kostenloses Konto 360p bis 1080p und Premium oder Pro die volle Leiter von 144p bis 2160p; Quellen unter 360p werden unterhalb von Premium abgelehnt. Der Server prüft die Stufen beim Start erneut, ein Client kann also keine Stufe anfordern, die ihm nicht angeboten wurde.',
        'Untertitel verwenden dasselbe Whisper-Modell (whisper-ctranslate2, medium) wie der Transkriptionsdienst; die Primärspur wird nach captions/<lang>/auto.vtt geschrieben, mit einer subs.m3u8-Hülle aus einem Segment, und im Master als EXT-X-MEDIA TYPE=SUBTITLES referenziert. Bis zu 3 weitere Sprachen aus einer Liste von 37 werden Segment für Segment von einem lokalen Ollama-Modell (ein translategemma-12b-Build) übersetzt; eine fehlgeschlagene Übersetzung wird als Warnung festgehalten, nie als fehlgeschlagener Auftrag.',
        'Storyboards sind ein ffmpeg-Durchgang: fps=1/N mit N von 5, 10 oder 15 Sekunden je nach Dauer (unter 10 Minuten, unter 30, länger), Kacheln von 160 x 90 auf 16:9 aufgefüllt in einem Raster von 10 x 10 pro JPEG-Sprite, plus storyboard.vtt mit #xywh-Cues. Die I-Frame-Playlist kodiert nur Keyframes in 240p neu (select=eq(pict_type,I), libx264 CRF 30, 4-Sekunden-Segmente) und wird als EXT-X-I-FRAME-STREAM-INF gelistet.',
        'Der Master trägt EXT-X-VERSION:6, EXT-X-INDEPENDENT-SEGMENTS und drei EXT-X-SESSION-DATA-Einträge, die Produzent, Website und Rechteinhaber nennen. report.json hält die Analyse, die Varianten mit Segmentanzahl und Bytegrößen, Warnungen und Zeitstempel fest.',
      ],
      whyItMatters: [
        'HLS ist das native Streaming-Format von iOS, Safari und jedem CDN, und mit hls.js spielt es auch in jedem anderen Browser.',
        'Adaptive Stufen lassen einen Zuschauer mit schwacher Verbindung in 360p weiterschauen, statt in 1080p zu puffern.',
        'Ein vorsegmentiertes VOD-Paket besteht aus statischen Dateien und kann daher auf Objektspeicher gehostet werden, ohne Transcoding-Server dahinter.',
      ],
      useCases: [
        {
          title: 'Kursplattformen',
          description: 'Liefern Sie Lektionen aus einem Bucket mit adaptiver Bitrate und Untertiteln in mehreren Sprachen.',
        },
        {
          title: 'Produkt- und Marketingseiten',
          description: 'Streamen Sie eine Demo ohne externen Video-Host und dessen Player-Branding.',
        },
        {
          title: 'Interne Portale',
          description: 'Hosten Sie Schulungsvideos auf Ihrem eigenen CDN mit Scrubber-Vorschaubildern.',
        },
        {
          title: 'Archive',
          description: 'Wandeln Sie einen Backkatalog in ein streambares Layout um, das Sie kontrollieren und spiegeln können.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein 3 Minuten langer 1080p-Clip mit den drei Standardstufen',
          body: 'Eingabe: ein 3 Minuten langes MP4 mit 1920 x 1080, 30 fps und 140 MB mit Stereo-Audio, innerhalb der Gastgrenzen. Einstellungen: 360p, 480p und 720p (die Standardauswahl und das Maximum für einen Gast), keine Untertitel oder Storyboards, tar.gz. Jede Stufe wird in 2-Sekunden-Segmente geschnitten, 90 pro Stufe, mit einer GOP von 60 Bildern, sodass jedes Segment an einem Keyframe beginnt. Bei den gelisteten Bitraten wiegen die Stufen höchstens etwa 20 MB für 360p (800 + 96 kbps x 180 s), 30 MB für 480p (1200 + 128 kbps) und 66 MB für 720p (2800 + 128 kbps), zusammen etwa 116 MB vor der kleinen I-Frame-Playlist in 240p, und bei einfachem Inhalt weniger, weil die Kodierung CRF-gesteuert ist mit der Bitrate als Obergrenze. Das entstehende Paket hat 270 .ts-Segmente, drei index.m3u8-Dateien und den Master. Die Zeit sind drei libx264-veryfast-Kodierungen von je 5400 Bildern, nacheinander ausgeführt; die 720p-Stufe dauert am längsten.',
        },
        {
          title: 'Ein 12 Minuten langes 720p-Webinar mit englischen Untertiteln, spanischer Übersetzung und Storyboards',
          body: 'Eingabe: ein 12 Minuten langes MP4 mit 1280 x 720, 25 fps und 380 MB, mit einem kostenlosen Konto hochgeladen, weil es den Gast-Standard von 5 Minuten überschreitet. Einstellungen: 360p und 720p (1080p ist ausgegraut, weil die Quelle 720p ist), Untertitel an mit Spanisch als zusätzlicher Sprache, Storyboards an, zip. Whisper transkribiert zuerst die 12 Minuten und schreibt captions/en/auto.vtt; die spanische Spur wird in Blöcken von 30 Segmenten nach captions/es/auto.vtt übersetzt, und beide werden im Master als Untertitel-Renditionen gelistet. Storyboards verwenden ein Intervall von 10 Sekunden für eine Quelle über 10 Minuten: 72 Vorschaubilder von 160 x 90 passen in ein einziges sprite_001.jpg mit 1600 x 900, mit einer storyboard.vtt, die auf jede Kachel zeigt. Die beiden Stufen haben je 360 Segmente von 2 Sekunden, mit einer GOP von 50 Bildern bei 25 fps, und wiegen bei den gelisteten Bitraten höchstens etwa 81 MB (360p) und 264 MB (720p). Der Auftrag verbringt mehr Zeit mit Whisper und den beiden Kodierungen als mit allem anderen; die Übersetzung ist ein kurzer zusätzlicher Schritt.',
        },
      ],
      whenNotToUse: 'Transkodieren Sie nicht in HLS, wenn Sie einfach eine kleinere einzelne Datei zum Versenden oder Einbetten möchten; der Kompressor erledigt das in einem Durchgang ohne Segmente und Playlists. Verwenden Sie es nicht für Live-Events, da die Ausgabe eine fertige VOD-Playlist ist, kein Live-Origin. Wenn Ihre Quelle unter 360p liegt, kann die Leiter ohne Premium nicht gebaut werden. Und wenn Ihr Player ein einfaches Video-Tag ohne HLS-Unterstützung ist, brauchen Sie zuerst ein MP4 oder einen Player im Stil von hls.js; eine master.m3u8 allein spielt nativ nur in Safari und auf Apple-Geräten.',
      whyMediaManipulator: [
        'Jede Stufen-Bitrate, jeder CRF, jedes Preset und jedes FFmpeg-Flag ist auf dieser Seite aufgeführt, der Inhalt des Pakets ist also keine Überraschung.',
        'Untertitel kommen von unserem eigenen Whisper-Transkriptionsdienst und Übersetzungen von einem Modell auf unserer eigenen Hardware, beide korrekt in der Master-Playlist referenziert.',
        'Das Paket besteht aus einfachen Dateien mit README und report.json; entpacken Sie es auf einem beliebigen statischen Host und richten Sie einen Player auf master.m3u8.',
        'Eine Transkodierung verbraucht einen Vorgang Ihres Tageskontingents (standardmäßig 5 pro Tag als Gast, 30 mit einem kostenlosen Konto) und ist auf 10 Starts pro Stunde und Sitzung begrenzt; ein fehlgeschlagener Auftrag wird zurückerstattet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ],
      privacyNote: 'Ihr Upload geht direkt vom Browser in unseren Speicher-Bucket und wird dann auf unseren eigenen Server heruntergeladen, wo ffprobe, FFmpeg und, wenn Sie Untertitel anhaken, unser Whisper-Transkriptionsdienst und ein lokales Ollama-Übersetzungsmodell laufen; kein externer Transcoding- oder KI-Dienst ist beteiligt. Das Quellobjekt, das Arbeitsverzeichnis und das fertige Paket sind alle im Aufbewahrungsregister eingetragen und werden gelöscht, wenn die Frist endet, und der Download-Link selbst läuft standardmäßig nach 30 Minuten ab. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre. Die Transkodierung führt nicht die automatisierte Inhaltsanalyse aus, die Standardkonvertierungen erhalten. Die erzeugte Master-Playlist enthält Session-Data-Zeilen, die Media Manipulator als Produzenten nennen; sie enthalten keine Informationen über Sie.',
      faq: [
        {
          question: 'Welche Stufen kann ich in meinem Tarif wählen?',
          answer: 'Standardmäßig erhält ein Gast 360p, 480p und 720p; ein kostenloses Konto fügt 1080p hinzu; Premium und Pro schalten zusätzlich 144p, 240p und 2160p frei. Eine Stufe, die höher als Ihre Quelle ist, ist immer deaktiviert, weil nichts hochskaliert wird. Die Chips zeigen den Grund beim Überfahren.',
        },
        {
          question: 'Wie lang sind die Segmente, und warum 2 Sekunden?',
          answer: 'Jede Stufe wird in 2-Sekunden-MPEG-TS-Segmente mit einem erzwungenen Keyframe an jeder Grenze geschnitten, sodass ein Player an jedem Segment ohne sichtbaren Fehler die Stufe wechseln kann. Die I-Frame-Playlist verwendet 4-Sekunden-Segmente, weil sie nur Keyframes enthält.',
        },
        {
          question: 'Sind die Untertitel in der Master-Playlist verknüpft?',
          answer: 'Ja. Jede Sprache wird als captions/<lang>/auto.vtt mit einer subs.m3u8-Hülle geschrieben und in master.m3u8 als EXT-X-MEDIA TYPE=SUBTITLES in der Gruppe subs deklariert, wobei die Quellsprache als DEFAULT markiert ist. Sie können bis zu 3 übersetzte Sprachen aus der Liste von 37 hinzufügen.',
        },
        {
          question: 'Was ist, wenn mein Video kein Audio hat?',
          answer: 'Die Stufen werden nur mit Video und -an kodiert, das Attribut CODECS lässt mp4a.40.2 weg, und der Untertitelschritt wird mit einer Warnung in report.json übersprungen, da es nichts zu transkribieren gibt.',
        },
        {
          question: 'Was ist im Paket enthalten, und wie hoste ich es?',
          answer: 'hls/master.m3u8, ein Ordner pro Stufe mit index.m3u8 und Segmenten, hls/iframes/, optional captions/ und storyboards/, README.txt und report.json. Entpacken Sie es auf einem beliebigen statischen Host oder Bucket, der .m3u8 und .ts mit den richtigen MIME-Typen ausliefert, und richten Sie Ihren Player auf master.m3u8.',
        },
        {
          question: 'Wie lange funktioniert der Download-Link, und bekomme ich tar.gz oder zip?',
          answer: 'Der vorsignierte Link gilt standardmäßig 30 Minuten; führen Sie den Auftrag erneut aus, wenn er abgelaufen ist. Wählen Sie vor dem Start im Formular tar.gz (der Standard) oder zip.',
        },
        {
          question: 'Wie lange dauert eine HLS-Transkodierung?',
          answer: 'Jede gewählte Stufe ist eine vollständige libx264-Kodierung mit dem Preset veryfast, nacheinander ausgeführt, die Zeit wächst also mit Dauer mal Anzahl der Stufen; 720p dominiert bei den drei Standardstufen. Untertitel fügen einen Whisper-Durchlauf über das gesamte Audio hinzu. Die Auftragsseite zeigt jede Phase, sobald sie abgeschlossen ist.',
        },
      ],
      related: [
        {
          label: 'Video komprimieren',
          to: '/tools/compress-video',
          description: 'Ein kleineres MP4 statt eines Streaming-Pakets.',
        },
        {
          label: 'Video transkribieren',
          to: '/tools/transcribe-video',
          description: 'Erhalten Sie dieselben Whisper-Untertitel als eigenständiges VTT oder SRT.',
        },
        {
          label: 'Video trimmen',
          to: '/tools/video-trimmer',
          description: 'Entfernen Sie den toten Anfang und das Ende vor dem Transkodieren.',
        },
        {
          label: 'KI-Videorestaurierung',
          to: '/tools/ai-video-restoration',
          description: 'Skalieren Sie einen niedrig aufgelösten Ausschnitt hoch, bevor Sie daraus eine Leiter bauen.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Schneiden und untertiteln Sie das Video und transkodieren Sie dann den Export.',
        },
      ],
      embed: {
        title: 'Ein Video in HLS transkodieren',
        description: 'Laden Sie ein MP4/MOV/WebM/MKV hoch. Wir analysieren die Quelle mit ffprobe, lassen Sie kostenlose Qualitätsstufen wählen (360p/480p/720p), führen dann die H.264 + AAC-Kodierung mit ffmpeg aus und bündeln ein herunterladbares tar.gz des HLS-Pakets.',
      },
    },
    'ai-video-restoration': {
      name: 'KI-Videorestaurierung',
      h1: 'KI-Videorestaurierungs-Tool',
      tagline: 'Skalieren und restaurieren Sie einen kurzen Videoausschnitt mit bis zu sechs KI-Modellen (Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT und VRT) und vergleichen Sie jedes Ergebnis nebeneinander.',
      metaTitle: 'KI-Videorestaurierung: 6 Upscaling-Modelle online vergleichen | Media Manipulator',
      metaDescription: 'Kostenloses KI-Videorestaurierungs-Tool. Lassen Sie einen kurzen Clip durch die Super-Resolution-Modelle Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT und VRT auf unserer eigenen GPU laufen und laden Sie jedes Ergebnis in einem Paket herunter.',
      ogTitle: 'KI-Videorestaurierung: Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT und VRT vergleichen',
      ogDescription: 'Wählen Sie einen Ausschnitt aus Ihrem Video, wählen Sie Restaurierungsmodelle und laden Sie ein Paket mit jeder verbesserten Version plus dem Original zum A/B-Vergleich herunter.',
      intro: 'Videorestaurierungsmodelle widersprechen einander. Ein GAN-Upscaler wie Real-ESRGAN liefert knackige Einzelbilder, die in Bewegung flimmern können; ein Video-Transformer wie VRT hält die Sequenz stabil, kann aber Details weichzeichnen. Der einzige ehrliche Weg zur Auswahl ist, dasselbe Material durch alle laufen zu lassen und hinzusehen. Diese Seite tut genau das mit einem Ausschnitt von bis zu 15 Sekunden: Sie extrahiert die Bilder, lässt Ihre Auswahl aus sechs Modellen auf unserer eigenen GPU laufen, fügt jedes Ergebnis mit der Bildrate der Quelle und dem Originalton wieder zu einem MP4 zusammen und verpackt alles, einschließlich des unveränderten Ausschnitts, in ein Archiv zum direkten Vergleich. Jede Zahl unten stammt aus der Pipeline, wie sie heute läuft.',
      whatItDoes: [
        'Trimmt den gewählten Ausschnitt (0,5 bis 15 Sekunden, höchstens 450 Bilder bei Ihrer Bildrate) bildgenau mit seinem Ton.',
        'Führt eine beliebige Kombination aus Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT und VRT aus; die ersten drei verbessern Bild für Bild, die letzten drei restaurieren die Sequenz als Ganzes.',
        'Wählt 4x für Quellen bis 540p und 2x darüber, da jedes Modell sein natives 4x-Netz ausführt und das 2x-Ergebnis beim Zusammenfügen eine Lanczos-Verkleinerung ist.',
        'Fügt jedes Ergebnis mit libx264 bei CRF 16 mit dem exakten Bildratenbruch der Quelle zusammen und hängt den Ton wieder an.',
        'Verpackt original/clip.mp4, einen Ordner pro Modell, optional verbesserte PNG-Bilder für die bildweisen Modelle, manifest.json und README.txt in ein tar.gz.',
        'Macht weiter, wenn ein Modell fehlschlägt: Sein Ordner erhält FAILED.txt, das Manifest hält den Grund fest, und jedes andere Ergebnis wird trotzdem geliefert.',
      ],
      flowSteps: [
        {
          title: 'Video hochladen',
          description: 'Bis zu 1920 x 1080; lange Quellen sind in Ordnung, weil nur der Ausschnitt verarbeitet wird.',
        },
        {
          title: 'Ausschnitt wählen',
          description: 'Ziehen Sie die Griffe, um bis zu 15 Sekunden zu wählen; 10 Sekunden oder weniger werden empfohlen, und die Auswahl warnt darüber.',
        },
        {
          title: 'Modelle wählen und entscheiden, ob Bilder enthalten sein sollen',
          description: 'Beliebige der sechs; die Auswahl zeigt eine Zeitschätzung pro Modell aus den vom Server veröffentlichten Sekunden-pro-Bild-Werten.',
        },
        {
          title: 'Die Phasen verfolgen',
          description: 'Download, Analyse, Clip extrahieren, Bilder extrahieren, dann jedes Modell vom schnellsten zum langsamsten, dann Verpacken.',
        },
        {
          title: 'Vergleichen und herunterladen',
          description: 'Spielen Sie jedes Modell-MP4 neben dem Original im Viewer ab und holen Sie dann das Archiv, solange sein 6-Stunden-Link gilt.',
        },
      ],
      advancedDetails: [
        'Der Referenzclip wird mit ffmpeg -ss START -i source -t WINDOW -c:v libx264 -crf 10 -preset medium -pix_fmt yuv420p -c:a aac geschnitten, dann werden die Bilder mit -vsync 0 in nummerierte PNGs extrahiert; überschreitet die Anzahl 450, werden die überzähligen Bilder verworfen.',
        'Real-ESRGAN läuft als realesrgan-ncnn-vulkan mit dem Modell realesrgan-x4plus, Skalierung 4 und Kacheln von 256 px. SwinIR verwendet die Gewichte 003_realSR_BSRGAN SwinIR-L x4 GAN und HAT verwendet Real_HAT_GAN_SRx4, beide mit gekachelter Inferenz (Kacheln von 320 px, 32 px Überlappung), damit 1080p-Bilder in den Speicher passen.',
        'BasicVSR++ führt den REDS4-c64n7-Generator über mmagic in Fenstern von 16 Bildern aus; RVRT (001_RVRT_videosr_bi_REDS_30frames) und VRT (001_VRT_videosr_bi_REDS_6frames) laufen über ihre KAIR-Testskripte mit zeitlichen Kacheln von 30 und 12 Bildern und räumlichen Kacheln von 128 x 128.',
        'Das Zusammenfügen ist einheitlich: ffmpeg -framerate FPS_FRACTION -i frames/%06d.png [-i clip.mp4 -map 0:v -map 1:a -c:a aac] [-vf scale=iw/2:ih/2:flags=lanczos] -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -movflags +faststart -shortest. Der Bildratenbruch, zum Beispiel 30000/1001, wird wörtlich von ffprobe übernommen, damit der Ton synchron bleibt.',
        'Die Modelle laufen in fester Reihenfolge, Real-ESRGAN, BasicVSR++, SwinIR, RVRT, HAT, VRT, unter einer GPU-Scheduler-Zuteilung mit VRAM-Budgets von jeweils 3, 11, 9, 12, 10 und 14 GB, ein Restaurierungsauftrag gleichzeitig serverweit und ein Timeout von 75 Minuten pro Modell.',
        'Die veröffentlichten Schätzungen pro Bild, die die Auswahl mit Ihrer Bildanzahl multipliziert, sind 0,8 s (Real-ESRGAN), 1,0 s (BasicVSR++), 3,0 s (RVRT), 3,5 s (SwinIR), 5,0 s (HAT) und 7,0 s (VRT); sie sind serverseitige Standardwerte, die sich ändern können, keine Messungen Ihres Clips.',
        'Explizites 4x wird für Quellen über 1080p abgelehnt, weil die Ausgabe 4K überschreiten würde; der Auto-Modus wählt 2x für 541p bis 1080p und 4x bei 540p oder darunter. Enthaltene Bilder sind auch auf dem 2x-Pfad die nativen 4x-PNGs, eine 1080p-Quelle ergibt also Bilder mit 7680 x 4320.',
      ],
      whyItMatters: [
        'Kein einzelnes Restaurierungsmodell gewinnt bei jedem Material, und Standbildvergleiche verbergen das Flimmern, das erst die Wiedergabe zeigt.',
        'Ein 10 Sekunden langer Ausschnitt durch jedes Modell kostet Minuten GPU-Zeit und sagt Ihnen, welches Modell anderswo einen Lauf in voller Länge verdient.',
        'Digitalisierte Bänder, frühe Digitalkamera-Clips und komprimierte Social-Media-Exporte verfallen jeweils anders und reagieren auf unterschiedliche Modellfamilien.',
      ],
      useCases: [
        {
          title: 'Alte Familienvideos',
          description: 'Sehen Sie, welches Modell Gesichter und Stoff auf einem 480p-Bandtransfer wiederherstellt, bevor Sie die ganze Spule restaurieren.',
        },
        {
          title: 'Archivmaterial',
          description: 'Testen Sie 4x an Material in 360p und 480p und beurteilen Sie die Ausgabe der 4K-Klasse auf Ihrem eigenen Monitor.',
        },
        {
          title: 'Modellauswahl vor einem langen Rendering',
          description: 'Wählen Sie das Modell für einen stundenlangen Auftrag anhand eines repräsentativen 10-Sekunden-Tests.',
        },
        {
          title: 'Komprimierte Downloads',
          description: 'Vergleichen Sie GAN-Schärfung mit Transformer-Stabilität bei blockigen Social-Media-Exporten.',
        },
        {
          title: 'Prüfung der zeitlichen Stabilität',
          description: 'Spielen Sie die MP4s pro Modell nebeneinander ab, um Flimmern und Flackern zu erkennen, das Standbilder verbergen.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein 8 Sekunden langes Heimvideo mit 640 x 480 durch alle sechs Modelle',
          body: 'Eingabe: ein MP4 mit 640 x 480 und 29,97 fps von einem digitalisierten Band, mit Ton. Einstellungen: ein Ausschnitt von 8 Sekunden, alle sechs Modelle, verbesserte Bilder enthalten, Skalierung auto. Die Pipeline schneidet einen 8 Sekunden langen Referenzclip und extrahiert 240 Bilder (8 x 29,97, gerundet). Bei 480p wählt die Auto-Regel 4x, jedes Modell schreibt also Bilder mit 2560 x 1920, und die zusammengefügten MP4s haben 2560 x 1920 bei 30000/1001 fps mit dem Originalton. Die Schätzung der Auswahl ist die Bildanzahl mal die veröffentlichten Sekunden pro Bild: etwa 3,2 Minuten für Real-ESRGAN, 4 Minuten für BasicVSR++, 12 für RVRT, 14 für SwinIR, 20 für HAT und 28 für VRT, insgesamt etwa 81 Minuten, weil die Modelle nacheinander laufen. Enthaltene Bilder fügen dem Archiv 3 x 240 PNGs mit 2560 x 1920 hinzu, weshalb der Download in Gigabyte statt Megabyte gemessen wird.',
        },
        {
          title: 'Ein 10 Sekunden langer 1080p-Clip mit Skalierung auto und Real-ESRGAN und BasicVSR++',
          body: 'Eingabe: ein MP4 mit 1920 x 1080, 30 fps und 90 MB, die größte Quellauflösung, die das Tool akzeptiert. Einstellungen: ein Ausschnitt von 10 Sekunden, Real-ESRGAN und BasicVSR++, Bilder ausgeschlossen, Skalierung auto. Die Extraktion ergibt 300 Bilder, innerhalb der Grenze von 450 (bei 60 fps würde dieselbe Grenze den Ausschnitt auf 7,5 Sekunden beschränken). Über 540p wählt auto 2x, jedes Modell führt also trotzdem sein natives 4x-Netz aus und erzeugt Bilder mit 7680 x 4320, und das Zusammenfügen wendet scale=iw/2:ih/2:flags=lanczos an, um MP4s mit 3840 x 2160 bei CRF 16 zu liefern. Die veröffentlichten Schätzungen ergeben etwa 4 Minuten für Real-ESRGAN (0,8 s x 300) und 5 Minuten für BasicVSR++ (1,0 s x 300), der Auftrag ist also deutlich vor dem Timeout von 75 Minuten pro Modell fertig, und das Archiv enthält zwei 4K-MP4s, den Originalclip, manifest.json und README.txt.',
        },
      ],
      whenNotToUse: 'Verwenden Sie diese Seite nicht, um einen ganzen Film zu restaurieren; sie ist ein Vergleichswerkzeug, begrenzt auf 15 Sekunden und 450 Bilder, und schon dafür kann das Archiv Gigabyte groß sein. Erwarten Sie nicht, dass sie erfindet, was nie aufgenommen wurde: Starke Bewegungsunschärfe, extreme Kompressionsblöcke und sehr dunkles Material werden besser, aber nicht makellos. Quellen über 1920 x 1080 werden abgelehnt, weil die Restaurierung auf niedrig aufgelöstes Material zielt und 2x von 1080p bereits 4K ist. Wenn Ihr Clip nur eine kleinere Datei, einen Formatwechsel oder einen Schnitt braucht, erledigen das Kompressor, Konverter und Trimmer in Sekunden ohne GPU.',
      whyMediaManipulator: [
        'Sechs Modelle auf Forschungsniveau hinter einem Upload, mit Gewichten, Kachelgrößen und Stitch-Befehl auf dieser Seite benannt, statt hinter einem Markennamen versteckt.',
        'Alles läuft auf unserer eigenen GPU; Ihr Material geht nie an einen externen KI-Anbieter, und nichts wird zum Trainieren verwendet.',
        'Eine Restaurierung verbraucht einen KI-Auftrag Ihres täglichen KI-Kontingents, standardmäßig 3 pro Tag ohne Konto und 10 mit einem kostenlosen Konto, und ist auf 2 Starts pro Stunde und Sitzung begrenzt; ein fehlgeschlagener Auftrag wird zurückerstattet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ],
      privacyNote: 'Ihr Upload geht vom Browser in unseren Speicher-Bucket und wird auf unseren eigenen GPU-Server heruntergeladen, wo FFmpeg den Ausschnitt schneidet und die sechs Modelle als lokale Prozesse laufen; kein externer KI-Anbieter ist beteiligt, und nichts wird zum Trainieren verwendet. Nur der gewählte Ausschnitt wird in Bilder dekodiert; der Rest der Quelle wird nie verarbeitet. Das Quellobjekt, die Arbeitsbilder, die für den Vergleichs-Viewer aufbewahrten MP4s pro Modell und das Ergebnisarchiv sind alle im Aufbewahrungsregister eingetragen und werden gelöscht, wenn die Frist endet, und der Archivlink läuft nach 6 Stunden ab. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre. Restaurierungsaufträge führen nicht die automatisierte Inhaltsanalyse aus, die Standardkonvertierungen erhalten.',
      faq: [
        {
          question: 'Welches KI-Modell zum Hochskalieren von Video ist das beste?',
          answer: 'Das hängt vom Material ab, und genau deshalb gibt es dieses Tool. GAN-Upscaler wie Real-ESRGAN und HAT erzeugen knackige Bilder, die in Bewegung flimmern können; Sequenzmodelle wie BasicVSR++, RVRT und VRT nutzen Nachbarbilder für Stabilität und können weicher wirken. Lassen Sie Ihren eigenen Ausschnitt durch sie laufen und beurteilen Sie ihn in Bewegung.',
        },
        {
          question: 'Warum ist der Clip auf 15 Sekunden und 450 Bilder begrenzt?',
          answer: 'Restaurierung ist pro Bild teuer: Die veröffentlichte Schätzung allein für VRT beträgt 7 Sekunden pro Bild bei 4x. Die Bildgrenze wird gegen Ihre tatsächliche Bildrate geprüft, eine 60-fps-Quelle ist also auf 7,5 Sekunden begrenzt. Ein kurzer Ausschnitt reicht, um die Qualität vor einer längeren Restaurierung anderswo zu beurteilen.',
        },
        {
          question: 'Wie funktioniert die Wahl zwischen 2x und 4x?',
          answer: 'Auto wählt 4x für Quellen bis 540p und 2x darüber. Jedes Modell führt unabhängig davon sein natives 4x-Netz aus; auf dem 2x-Pfad halbiert das Zusammenfügen die Bilder mit einem Lanczos-Filter. Explizites 4x wird über 1080p abgelehnt, weil die Ausgabe 4K überschreiten würde.',
        },
        {
          question: 'Behält das restaurierte Video meinen Ton und meine Bildrate?',
          answer: 'Ja. Der Ausschnitt wird mit seinem Ton geschnitten, und jedes Zusammenfügen verwendet den exakten Bildratenbruch von ffprobe (zum Beispiel 30000/1001) und hängt diesen Ton als AAC wieder an, sodass alle Ergebnisse für die A/B-Wiedergabe übereinstimmen.',
        },
        {
          question: 'Was enthält das Ergebnisarchiv, und wie groß ist es?',
          answer: 'original/clip.mp4, einen Ordner pro Modell mit seinem MP4 (und, bei Real-ESRGAN, SwinIR und HAT mit enthaltenen Bildern, jedes verbesserte PNG in nativem 4x), manifest.json mit Zeiten und Maßen sowie README.txt. Mit Bildern fügt ein 10 Sekunden langer Clip pro Modell Hunderte großer PNGs hinzu, rechnen Sie also mit Gigabyte.',
        },
        {
          question: 'Was passiert, wenn ein Modell fehlschlägt oder das Zeitlimit überschreitet?',
          answer: 'Der Auftrag läuft weiter. Der Ordner dieses Modells enthält FAILED.txt mit dem Grund, manifest.json hält ihn fest, und jedes andere gewählte Modell wird trotzdem im Archiv geliefert. Nur wenn alle gewählten Modelle fehlschlagen, schlägt der Auftrag fehl.',
        },
        {
          question: 'Wie lange dauert ein Restaurierungslauf?',
          answer: 'Bilder mal die Schätzung pro Modell, summiert über die gewählten Modelle, da sie nacheinander laufen: 0,8, 1,0, 3,0, 3,5, 5,0 und 7,0 Sekunden pro Bild für Real-ESRGAN, BasicVSR++, RVRT, SwinIR, HAT und VRT. Ein Clip mit 300 Bildern durch alle sechs dauert grob 100 Minuten; durch Real-ESRGAN allein etwa 4.',
        },
        {
          question: 'Wie viele Restaurierungen kann ich ausführen, und kostet es einen KI-Auftrag?',
          answer: 'Das Starten einer Restaurierung verbraucht einen KI-Auftrag: standardmäßig 3 pro Tag ohne Konto, 10 mit einem kostenlosen Konto, 100 bei Premium und 200 bei Pro, plus ein Limit von 2 Starts pro Stunde und Sitzung. Ein Auftrag, der komplett fehlschlägt, wird zurückerstattet. Die aktuellen Zahlen stehen auf der Preisseite.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Ausschnitte sind auf 15 Sekunden oder 450 Bilder begrenzt (je nachdem, was bei der Bildrate Ihres Videos kleiner ist); 10 Sekunden oder weniger werden empfohlen.',
          'Die Quellauflösung ist auf 1920×1080 begrenzt: Die Restaurierung zielt auf niedrig aufgelöstes Material, und die 4x-Ausgabe von 1080p ist bereits 4K+.',
        ],
        processingNotes: [
          'Die Modelle laufen vom schnellsten zum langsamsten (Real-ESRGAN zuerst, VRT zuletzt), damit früh Teilergebnisse vorliegen.',
          'Ein fehlgeschlagenes Modell bringt den Auftrag nie zum Scheitern: Sein Ordner enthält FAILED.txt, und die anderen Ergebnisse lassen sich trotzdem herunterladen.',
          'Download-Links bleiben 6 Stunden gültig; das Archiv kann groß sein, wenn verbesserte Bilder enthalten sind.',
        ],
      },
      related: [
        {
          label: 'Video trimmen',
          to: '/tools/video-trimmer',
          description: 'Schneiden Sie den Ausschnitt, den Sie restaurieren möchten, vor dem Hochladen.',
        },
        {
          label: 'KI-Bildrestaurierung',
          to: '/tools/ai-image-restoration',
          description: 'Dieselben Modellfamilien für ein einzelnes Foto oder Bild.',
        },
        {
          label: 'Video komprimieren',
          to: '/tools/compress-video',
          description: 'Verkleinern Sie ein restauriertes 4K-Ergebnis zum Teilen.',
        },
        {
          label: 'In HLS transkodieren',
          to: '/tools/transcode-to-hls',
          description: 'Verpacken Sie einen restaurierten Clip für adaptives Streaming.',
        },
        {
          label: 'Video transkribieren',
          to: '/tools/transcribe-video',
          description: 'Fügen Sie dem restaurierten Material Untertitel hinzu.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Schneiden Sie den restaurierten Ausschnitt in ein längeres Werk.',
        },
      ],
      embed: {
        title: 'KI-Videorestaurierung',
        description: 'Laden Sie ein Video hoch, wählen Sie per Ziehen einen kurzen Ausschnitt (10 Sekunden oder weniger funktionieren am besten), wählen Sie die Restaurierungsmodelle, die Sie vergleichen möchten, und laden Sie ein Paket mit jedem verbesserten Ergebnis herunter.',
      },
    },
    'ai-image-restoration': {
      name: 'KI-Bildrestaurierung und -Upscaling',
      h1: 'KI-Tool zur Bildrestaurierung und zum Upscaling',
      tagline: 'Bereinigen, vergrößern und restaurieren Sie ein Foto mit bis zu acht KI-Modellen (treueerhaltende Vorbereinigung mit FBCNN, SCUNet, NAFNet, allgemeine Upscaler Real-ESRGAN, SwinIR, HAT und Gesichtsverbesserung mit GFPGAN, CodeFormer) und vergleichen Sie jedes Ergebnis mit dem Original.',
      metaTitle: 'KI-Bildrestaurierung und Upscaler: 8 Modelle online vergleichen | Media Manipulator',
      metaDescription: 'Kostenlose KI-Fotorestaurierung und -Vergrößerung. Entfernen Sie JPEG-Artefakte, Rauschen und Unschärfe, skalieren Sie dann mit Real-ESRGAN, SwinIR oder HAT auf 4K/8K hoch und verbessern Sie Gesichter mit GFPGAN/CodeFormer, alles auf unserer eigenen GPU, nebeneinander verglichen.',
      ogTitle: 'KI-Bildrestaurierung und -Upscaling: Vorbereinigen, Vergrößern und Gesichter verbessern',
      ogDescription: 'Laden Sie ein Bild hoch, schneiden Sie es optional zu, bereinigen Sie es optional vor, lassen Sie dann mehrere Upscaling- und Gesichtsmodelle laufen und vergleichen Sie jedes Ergebnis inline mit dem Original.',
      intro: 'Die KI-Bildrestaurierung lässt ein Foto durch eine konfigurierbare Pipeline von bis zu acht Modellen laufen und zeigt jedes Ergebnis neben dem Original. Eine treueerhaltende Vorbereinigungsstufe (FBCNN für JPEG-Artefakte, SCUNet für Rauschen, NAFNet für Bewegungsunschärfe) entfernt Schäden, ohne Details zu erfinden; allgemeine Upscaler (Real-ESRGAN, SwinIR, HAT) vergrößern dann 2x oder 4x; und eine optionale Gesichtsverbesserung (GFPGAN, CodeFormer) rekonstruiert Gesichter. Die Vorbereinigung ist nicht generativ: Sie filtert das vorhandene Signal. Die Gesichtsverbesserung ist generativ: Sie synthetisiert plausible Details und darf nicht als getreue Wiederherstellung der Quelle betrachtet werden. Jedes Modell läuft auf unserem eigenen GPU-Server.',
      whatItDoes: [
        'Lässt Sie per Ziehen einen Zuschnitt wählen, damit Pixelbudget und GPU-Zeit in den Bereich fließen, der Ihnen wichtig ist; der Zuschnitt wird serverseitig auf dem automatisch ausgerichteten Original angewendet, im Browser geht also keine Qualität verloren.',
        'Bereinigt optional zuerst vor, immer in der Reihenfolge FBCNN, SCUNet, NAFNet, wobei jedes Modell auf der Ausgabe des vorherigen arbeitet; das bereinigte Bild wird zur Basis, von der jedes spätere Modell ausgeht.',
        'Führt eine beliebige Kombination aus Real-ESRGAN, SwinIR und HAT bei 2x oder 4x aus. Alle drei sind native x4-Netze; ein 2x-Ergebnis ist die x4-Ausgabe, mit einem Lanczos-Filter auf 50 Prozent verkleinert.',
        'Führt optional GFPGAN v1.4 und, wo es auf dem Server aktiviert ist, CodeFormer mit einem Treuegewicht aus, auf der Quelle und, mit „Verketten“, auch auf dem Ergebnis jedes Upscalers.',
        'Verpackt das vorbereitete Original, jedes Ausgabe-PNG, eine manifest.json und eine README in ein .tar.gz und zeigt ein Inline-Vergleichsraster, während das Archiv vom Auftrag ausgeliefert wird.',
        'Hält ein fehlgeschlagenes Modell als fehlgeschlagenen Eintrag mit einer nutzerfreundlichen Begründung fest und verpackt trotzdem jedes erfolgreiche Ergebnis.',
      ],
      flowSteps: [
        {
          title: 'Bild hochladen',
          description: 'PNG, JPEG, WebP, TIFF oder BMP bis zu 12.000 Pixel pro Seite; alte, kleine und stark komprimierte Fotos sind das Ziel.',
        },
        {
          title: 'Zuschneiden oder das ganze Bild behalten',
          description: 'Ziehen Sie einen Bereich (ein Gesicht, ein Kennzeichen, ein Schild) oder lassen Sie den Zuschnitt aus, um alles zu restaurieren.',
        },
        {
          title: 'Vorbereinigung, Upscaler, Gesichter, Skalierung wählen',
          description: 'Haken Sie die gewünschten Modelle an; die Auswahl zeigt, wie viele der 12 erlaubten Ausgaben die Auswahl erzeugen wird.',
        },
        {
          title: 'Die Phasen verfolgen',
          description: 'Der Auftrag wartet auf den einzelnen Restaurierungsplatz, bereitet das Bild vor und führt dann jede Einheit mit eigenem Fortschritt und Fehlerabzeichen aus.',
        },
        {
          title: 'Vergleichen und herunterladen',
          description: 'Jedes Ergebnis liegt im Raster neben dem Original; laden Sie das Archiv herunter, wenn Sie entschieden haben, welche Pipeline gewonnen hat.',
        },
      ],
      advancedDetails: [
        'Die Vorbereitungsstufe führt ImageMagick -auto-orient zu einem normalisierten PNG aus, liest dessen Maße, lehnt alles über 12.000 x 12.000 ab, wandelt Ihr normalisiertes Zuschnittrechteck in ganze Pixel um und schreibt working_source.png. Diese Datei wird in den Ergebnissen auch als original.png gespeichert, sodass das, womit Sie vergleichen, genau das ist, was die Modelle erhalten haben.',
        'Die automatische Skalierung wählt 4x, wenn der Zuschnitt 540 Pixel hoch oder niedriger ist, und sonst 2x. Unabhängig von der Skalierung wird die Ausgabe gegen ein Budget von 67.108.864 Pixeln (etwa 64 Megapixel) geprüft: Ein ganzes Bild mit 6.000 x 4.000 bei 2x sind 96 Megapixel und wird mit einer Meldung abgelehnt, die Ihnen rät, 2x oder einen kleineren Zuschnitt zu wählen.',
        'Real-ESRGAN führt das Netz realesrgan-x4plus über realesrgan-ncnn-vulkan mit Kacheln von 256 Pixeln aus. SwinIR verwendet die Gewichte 003_realSR_BSRGAN SwinIR-L x4 GAN und HAT die Gewichte Real_HAT_GAN_SRx4, beide über dasselbe Skript pro Bild wie die KI-Videorestaurierung mit Kacheln von 320 Pixeln und 32 Pixeln Überlappung, sodass große Zuschnitte nie den GPU-Speicher überschreiten.',
        'Die Vorbereinigungsgewichte sind fbcnn_color.pth, scunet_color_real_psnr.pth (das PSNR-trainierte Modell für echtes Rauschen, nicht die GAN-Variante, die Textur erfindet) und NAFNet-GoPro-width64.pth (Bewegungsunschärfe, nicht Defokus). Sie laufen in Kacheln von 512 Pixeln mit 32 Pixeln Überlappung und ändern nie die Maße. FBCNN schätzt den JPEG-Qualitätsfaktor blind, sofern Sie keinen von 1 bis 100 festlegen; eine niedrigere Zahl nimmt stärkere Kompression an.',
        'GFPGAN verwendet die Clean-Architektur v1.4 mit deaktiviertem Hintergrund-Upsampling, außerhalb der Gesichter wird das Bild also schlicht um den Skalierungsfaktor vergrößert statt vom Modell verbessert; das hält den Vergleich ehrlich. CodeFormer nimmt ein Treuegewicht w von 0 bis 1 (Standard 0,7): niedriger ist schöner, höher bleibt näher an der Eingabe. CodeFormer steht unter einer nichtkommerziellen Lizenz und liegt hinter einem Server-Flag, das standardmäßig aus ist.',
        '„Verketten“ führt jedes Gesichtsmodell zusätzlich zur Quelle bei 1x auf der Ausgabe jedes Upscalers erneut aus, die Ausgabezahl ist also Vorbereinigung + allgemein + Gesicht + Gesicht x allgemein. Der Server begrenzt einen Auftrag auf 12 Ausgaben, führt einen Restaurierungsauftrag gleichzeitig aus und gibt jedem Modell 1.800 Sekunden, bevor er es als Zeitüberschreitung markiert.',
        'Der Server schätzt die Laufzeit pro Modell aus seinen eigenen Standardwerten in Sekunden pro Megapixel: FBCNN 3, SCUNet 8, NAFNet 6, Real-ESRGAN 2, SwinIR 12, HAT 18, GFPGAN 6, CodeFormer 8. Diese speisen die Fortschrittsgewichte und die Schätzung in der Oberfläche; sie sind Abstimmungswerte, keine Garantie.',
        'Ergebnisse werden nicht in den Objektspeicher hochgeladen: Das .tar.gz und die Ergebnis-PNGs bleiben im Ausgabeordner des Auftrags und werden für die Aufbewahrungsfrist vom Auftrag ausgeliefert.',
      ],
      whyItMatters: [
        'Kein einzelnes Modell gewinnt bei jedem Foto: Artefaktentfernung, Entrauschen, Upscaling und Gesichtsrekonstruktion beheben jeweils andere Schäden, und die richtige Reihenfolge hängt davon ab, wie das Bild beschädigt wurde.',
        'Mehrere Modelle auf einem Upload laufen zu lassen und sie nebeneinander zu sehen beantwortet die Frage „welches, und in welcher Skalierung?“, bevor Sie sich auf einen größeren Stapel festlegen.',
        'Die Unterscheidung zwischen nicht generativ und generativ ist wichtig: Ein vorbereinigtes Bild ist eine gefilterte Kopie des Beweismaterials, ein gesichtsverbessertes eine plausible Rekonstruktion, und die Seite kennzeichnet, was was ist.',
      ],
      useCases: [
        {
          title: 'Alte oder gescannte Fotos restaurieren',
          description: 'Bereinigen Sie Scannerrauschen und Kompression vor, skalieren Sie dann hoch und rekonstruieren Sie, wenn Sie möchten, Gesichter.',
        },
        {
          title: 'Niedrig aufgelöste Standbilder verbessern',
          description: 'Schneiden Sie auf den relevanten Bereich zu, entfernen Sie Artefakte und skalieren Sie hoch; verketten Sie die Gesichtsverbesserung für Klarheit, nie als Identifikationsbeweis.',
        },
        {
          title: 'Komprimierte Downloads reparieren',
          description: 'Stark nachkomprimierte Social-Media-Exporte reagieren gut auf FBCNN, dann SCUNet, gefolgt von einem GAN-Upscaler.',
        },
        {
          title: 'Upscaler vor einem Stapel vergleichen',
          description: 'Lassen Sie ein repräsentatives Bild durch Real-ESRGAN, SwinIR und HAT laufen, um das Modell für eine größere Menge zu wählen.',
        },
        {
          title: 'Das Budget auf einen Bereich konzentrieren',
          description: 'Wählen Sie per Ziehen nur ein Gesicht oder ein Schild, damit das Budget von 64 Megapixeln und die GPU-Zeit dort landen, wo es zählt.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein JPEG mit 1.200 x 800 (etwa 350 KB), ganzes Bild, Skalierung auto, FBCNN + Real-ESRGAN + GFPGAN',
          body: 'Der Zuschnitt ist das volle Bild mit 0,96 Megapixeln, und seine Höhe von 800 Pixeln liegt über 540, die automatische Skalierung ergibt also 2x. FBCNN läuft zuerst bei 1x, und seine Ausgabe wird zur Arbeitsquelle. Real-ESRGAN skaliert diese mit realesrgan-x4plus auf 4.800 x 3.200 hoch, dann verkleinert ImageMagick sie mit Lanczos auf 50 Prozent für ein PNG mit 2.400 x 1.600. GFPGAN läuft auf der vorbereinigten Quelle mit Upscale 2 und ergibt ein weiteres PNG mit 2.400 x 1.600 mit rekonstruierten Gesichtern und schlicht vergrößertem Rest. Das sind drei Ausgaben von den 12 erlaubten. Nach den eigenen Schätzungen des Servers pro Megapixel beträgt die Modellzeit etwa 0,96 x (3 + 2 + 6), rund 11 Sekunden, plus ein paar Sekunden für Vorbereitung und Verpackung; das Warten auf den einzelnen Restaurierungsplatz kann mehr hinzufügen. Ein Auftrag verbraucht einen KI-Auftrag aus dem KI-Kontingent.',
        },
        {
          title: 'Ein Gesichtszuschnitt mit 300 x 400 aus einem Standbild mit 640 x 480, Vorbereinigung, drei Upscaler, GFPGAN mit „Verketten“',
          body: 'Der Zuschnitt hat 0,12 Megapixel und ist 400 Pixel hoch, die automatische Skalierung wählt also 4x, und jedes hochskalierte Ergebnis hat 1.200 x 1.600 (1,92 Megapixel), weit innerhalb des Budgets von 64 Megapixeln. Mit der Vorbereinigung durch FBCNN und SCUNet, Real-ESRGAN, SwinIR und HAT sowie verkettetem GFPGAN erzeugt der Auftrag 2 + 3 + 1 + 1 x 3 = 9 Ausgaben: zwei Vorbereinigungsschritte, drei Upscales, GFPGAN auf der bereinigten Quelle und GFPGAN bei 1x auf jedem hochskalierten Ergebnis. Die Vorbereinigungs- und Upscale-Durchgänge auf 0,12 Megapixeln dauern nach den Schätzungen des Servers jeweils wenige Sekunden, während die drei verketteten Gesichtsdurchgänge auf den Ergebnissen mit 1,92 Megapixeln laufen und entsprechend länger brauchen. Jede Gesichtsausgabe trägt im Manifest einen Generativ-Hinweis, denn was Sie in diesen Gesichtern sehen, ist Rekonstruktion, nicht Wiederherstellung.',
        },
      ],
      whenNotToUse: 'Verwenden Sie die Gesichtsverbesserung nicht zur Identifikation: GFPGAN und CodeFormer zeichnen plausible Gesichter aus einem gelernten Prior, ein rekonstruiertes Gesicht ist also höchstens ein Hinweis und nie ein Beweis dafür, wer im Bild war. Lassen Sie das Tool bei Bildern aus, die bereits groß und scharf sind, wo ein 2x-Durchgang vor allem GAN-Textur hinzufügt, und bei Fotos mit mehr als 12.000 Pixeln pro Seite, die abgelehnt werden. Wenn Sie nur eine größere Kopie eines sauberen Bildes brauchen, ohne Vorbereinigung, Gesichtsmodelle oder Vergleichsraster, ist der KI-Bild-Upscaler zeitlich günstiger. Und wenn Ihr Schaden Defokus-Unschärfe statt Bewegungsunschärfe ist, sind die GoPro-Gewichte von NAFNet das falsche Modell dafür.',
      whyMediaManipulator: [
        'Acht Forschungsmodelle hinter einem Upload, ohne Notebooks, CUDA-Einrichtung oder zu verwaltende Gewichtsdateien.',
        'Jedes Modell läuft auf einem GPU-Server, den wir betreiben; das Bild wird nicht an einen externen KI-Dienst gesendet.',
        'Die Seite hält die Unterscheidung ehrlich: Vorbereinigungsausgaben tragen einen Treue-Hinweis, Gesichtsausgaben einen Generativ-Hinweis, und das vorbereitete Original ist immer im Raster.',
      ],
      privacyNote: 'Ihr Bild wird in seinem Auftragsordner gespeichert, von ImageMagick automatisch ausgerichtet und zu einem Arbeits-PNG zugeschnitten und von den gewählten Modellen auf unserer eigenen GPU verarbeitet. Wenn der Auftrag endet, werden der Upload-Ordner und der Arbeitsbaum gelöscht; was beim Auftrag bleibt, sind das vorbereitete Original, jedes Ergebnis-PNG, das Manifest und das verpackte .tar.gz, vom Auftrag zum Download und für das Vergleichsraster ausgeliefert. Ausgaben der Gesichtsmodelle sind in diesem Manifest als generative Rekonstruktionen gekennzeichnet. Kein externer KI-Anbieter erhält das Bild. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      faq: [
        {
          question: 'Was ist der Unterschied zwischen Vorbereinigung und den Upscaling- oder Gesichtsmodellen?',
          answer: 'Vorbereinigungsmodelle (FBCNN, SCUNet, NAFNet) sind nicht generativ: Sie entfernen Kompressionsartefakte, Rauschen und Bewegungsunschärfe, indem sie das vorhandene Signal bei 1x filtern. Upscaler fügen Auflösung hinzu, und die Gesichtsmodelle (GFPGAN, CodeFormer) sind generativ und synthetisieren plausible Gesichtsdetails. Eine Vorbereinigungsausgabe ist ein getreu gefiltertes Bild; eine Gesichtsausgabe ist eine Rekonstruktion.',
        },
        {
          question: 'Kann ein verbessertes Gesicht als Identifikationsbeweis dienen?',
          answer: 'Nein. GFPGAN und CodeFormer erzeugen plausible Gesichter aus einem gelernten Prior; sie stellen nicht das wahre Gesicht wieder her. Das Manifest markiert genau deshalb jede Gesichtsausgabe mit einem Generativ-Hinweis. Verwenden Sie sie nur für visuelle Klarheit und Hinweise.',
        },
        {
          question: 'Warum laufen die Vorbereinigungsmodelle in fester Reihenfolge, egal was ich anhake?',
          answer: 'Kompressionsartefakte müssen vor dem Entrauschen weg, sonst behandelt der Entrauscher Blockbildung als Signal, und das Entschärfen funktioniert am besten auf der sauberst möglichen Eingabe, daher führt der Server immer FBCNN, dann SCUNet, dann NAFNet aus, jedes auf dem vorherigen Ergebnis. Schlägt eines davon fehl, macht das nächste beim letzten erfolgreichen Schritt weiter.',
        },
        {
          question: 'Wie entscheidet Auto zwischen 2x und 4x, und was ist die Größengrenze?',
          answer: 'Auto wählt 4x, wenn der Zuschnitt höchstens 540 Pixel hoch ist, und sonst 2x. Die Ausgabe wird dann gegen ein Budget von etwa 64 Megapixeln (67.108.864 Pixel) geprüft; eine Anfrage darüber wird mit der Megapixelzahl und dem Vorschlag abgelehnt, 2x oder einen kleineren Zuschnitt zu wählen. Quellen mit mehr als 12.000 Pixeln auf einer Seite werden schon davor abgelehnt.',
        },
        {
          question: 'Was bewirkt „Verketten“ bei der Anzahl der Ausgaben?',
          answer: 'Mit „Verketten“ läuft jedes Gesichtsmodell zusätzlich bei 1x auf dem Ergebnis jedes Upscalers, also Ausgaben = Vorbereinigung + allgemein + Gesicht + Gesicht x allgemein. Zwei Upscaler und zwei Gesichtsmodelle mit Verkettung ergeben 2 + 2 + 4 = 8 Ausgaben vor jeder Vorbereinigung; der Server erlaubt 12 pro Auftrag.',
        },
        {
          question: 'Was passiert, wenn ein Bildmodell fehlschlägt oder das Zeitlimit überschreitet?',
          answer: 'Der Auftrag läuft weiter. Die Einheit wird mit einer nutzerfreundlichen Begründung als fehlgeschlagen markiert (zum Beispiel eine Zeitüberschreitung nach 1.800 Sekunden mit dem Vorschlag eines kleineren Zuschnitts oder 2x), das Manifest hält sie fest, und jedes andere Ergebnis wird trotzdem verpackt und angezeigt. Nur wenn jedes gewählte Modell fehlschlägt, schlägt der Auftrag fehl, und dann wird der KI-Auftrag zurückerstattet.',
        },
        {
          question: 'Warum ist CodeFormer ausgegraut?',
          answer: 'CodeFormer ist für nichtkommerzielle Nutzung lizenziert und liegt daher hinter einem Server-Flag, das standardmäßig aus ist; die Fähigkeiten melden es dann als derzeit deaktiviert. GFPGAN und die drei Vorbereinigungsmodelle haben permissive Lizenzen und sind verfügbar, wann immer ihre Gewichte installiert sind.',
        },
        {
          question: 'Wie viele Restaurierungen kann ich ausführen, und ist es kostenlos?',
          answer: 'Das Starten einer Restaurierung verbraucht einen KI-Auftrag: standardmäßig 3 pro Tag als Gast, 10 mit einem kostenlosen Konto, 100 bei Premium und 200 bei Pro, unabhängig davon, wie viele Modelle Sie in diesem Auftrag anhaken. Außerdem gibt es ein eigenes Limit von 6 Starts pro Sitzung und Stunde. Die Upload-Grenze beträgt 200 MB für Gäste und 1 GB mit einem kostenlosen Konto; /pricing zeigt die aktuellen Zahlen.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Die Ausgabe ist durch ein Pixelbudget (~64 Megapixel) begrenzt, deutlich über 8K; würden Zuschnitt und Skalierung es überschreiten, wählen Sie 2x oder einen kleineren Zuschnitt.',
          'Vorbereinigungsmodelle ändern nie die Maße (1x); nur die allgemeinen Upscaler ändern die Auflösung.',
        ],
        processingNotes: [
          'Die Vorbereinigung läuft immer zuerst in fester Reihenfolge (FBCNN → SCUNet → NAFNet); das bereinigte Bild wird zur Basis für jedes andere Modell.',
          'Ein fehlgeschlagenes Modell bringt den Auftrag nie zum Scheitern: Sein Eintrag zeigt den Grund, und die anderen Ergebnisse lassen sich trotzdem herunterladen.',
          'Die Gesichtsverbesserung ist generative Rekonstruktion: Nutzen Sie sie für Klarheit und Hinweise, nicht als Identifikationsbeweis.',
        ],
      },
      related: [
        {
          label: 'KI-Videorestaurierung',
          to: '/tools/ai-video-restoration',
          description: 'Das Gegenstück für Bewegtbild: dieselben Upscaler auf einem kurzen Clip.',
        },
        {
          label: 'KI-Bild-Upscaler',
          to: '/tools/ai-image-upscaler',
          description: 'Ein einzelner Real-ESRGAN-Durchgang, wenn Sie nur ein größeres Bild brauchen.',
        },
        {
          label: 'Hintergrund entfernen',
          to: '/tools/remove-background-from-image',
          description: 'Schneiden Sie das Motiv nach der Restaurierung aus.',
        },
        {
          label: 'Bild komprimieren',
          to: '/tools/compress-image',
          description: 'Verkleinern Sie das restaurierte PNG zum Teilen.',
        },
        {
          label: 'Bildgröße ändern',
          to: '/tools/image-resizer',
          description: 'Bringen Sie das restaurierte Bild auf exakte Maße.',
        },
        {
          label: 'EXIF-Metadaten entfernen',
          to: '/tools/remove-exif-metadata',
          description: 'Entfernen Sie Metadaten aus dem Ergebnis vor dem Posten.',
        },
      ],
      embed: {
        title: 'KI-Bildrestaurierung und -Upscaling',
        description: 'Laden Sie ein Bild hoch, schneiden Sie es optional auf einen Bereich zu, bereinigen Sie es optional vor, wählen Sie die Upscaling- und Gesichtsverbesserungsmodelle, die Sie vergleichen möchten, und laden Sie ein Paket mit jedem Ergebnis herunter.',
      },
    },
    'ai-document-scan': {
      name: 'KI-Dokumentenscan',
      h1: 'KI-Dokumentenscan: Gescannte Seiten und Handschrift in durchsuchbares PDF / Word',
      tagline: 'Verwandeln Sie gescannte Dokumente und handschriftliche Notizen in ein durchsuchbares, mehrseitiges PDF und ein bearbeitbares Word-Dokument: Gedruckte Seiten erhalten eine getreue Tesseract-Textebene, Handschrift wird von einer Bild-KI transkribiert, mit markierten Unsicherheiten, nie erfunden.',
      metaTitle: 'KI-Dokumentenscan: Gescannte Seiten und Handschrift in PDF/Word | Media Manipulator',
      metaDescription: 'Kostenloser KI-Dokumentenscan: Wandeln Sie gescannte Bilder in ein durchsuchbares PDF um, OCR von Bild zu Word, und transkribieren Sie handschriftliche Notizen in Text. Seiten neu ordnen, Druck und Handschrift mischen, alles auf unserer eigenen GPU, wortgetreu, mit markierten Unsicherheiten.',
      ogTitle: 'KI-Dokumentenscan: Durchsuchbares PDF + Word aus Scans und Handschrift',
      ogDescription: 'Laden Sie eine oder mehrere gescannte Seiten hoch, gedruckt oder handschriftlich, ordnen Sie sie neu und erhalten Sie ein durchsuchbares PDF und ein bearbeitbares DOCX. Gedruckte Seiten bleiben getreu; Handschrift wird wortgetreu transkribiert, mit erhaltenen [illegible]/[?]-Markern.',
      intro: 'Der KI-Dokumentenscan verwandelt eine oder mehrere fotografierte oder gescannte Seiten in ein durchsuchbares, mehrseitiges PDF und, wenn Sie es wünschen, in ein bearbeitbares Word-Dokument. Er behandelt zwei Arten von Seiten unterschiedlich und sagt Ihnen, welche welche ist. Gedruckte oder getippte Seiten durchlaufen OCRmyPDF und Tesseract: Die Ausgabeseite ist Ihr Scan, unverändert, mit einer unsichtbaren Textebene darunter, damit Sie suchen, markieren und kopieren können. Handschriftliche Seiten werden von einem Bild-Sprach-Modell auf unserer eigenen GPU gelesen, das die Schrift Wort für Wort transkribiert, Unlesbares als [illegible] markiert und ein zweifelhaftes Wort als [?: best guess] einfasst, und das angewiesen ist, nie etwas zu ergänzen, zu korrigieren oder aufzuräumen. Ein einzelner Auftrag kann beide Arten mischen, Seite für Seite, in der von Ihnen festgelegten Reihenfolge, und das Ergebnis nennt für jede Seite die Engine und die Konfidenz.',
      whatItDoes: [
        'Akzeptiert bis zu 50 Seitenbilder pro Auftrag (PNG, JPEG, WebP, TIFF, BMP oder HEIC, standardmäßig je 25 MB), normalisiert jedes zu einem aufrechten PNG und lässt Sie sie zuerst in Lesereihenfolge ziehen.',
        'Stellt im Modus Auto dem Bildmodell eine Frage pro Seite (gedruckt oder handschriftlich?) und leitet die Seite entsprechend weiter; die Modi Gedruckt und Handschrift erzwingen die Antwort.',
        'Erstellt ein PDF/A, in dem jede gedruckte Seite der Originalscan plus eine Tesseract-Textebene ist und jede handschriftliche Seite der Scan plus eine unsichtbare, Zeile für Zeile platzierte Maschinentranskriptionsebene, mit einer sichtbaren Fußzeile, die das sagt.',
        'Erstellt optional ein Word-Dokument: gedruckte Seiten als Überschriften, Listen und Tabellen rekonstruiert von PaddleOCR-VL (oder Docling), handschriftliche Seiten als wortgetreue Transkription unter einem fett gesetzten Hinweis zum Abgleich mit dem Scan, gerendert von Pandoc.',
        'Meldet pro Seite die verwendete Engine, eine Konfidenz von hoch, mittel oder niedrig und die Anzahl der Unsicherheitsmarker, damit Sie wissen, wo Sie hinsehen müssen.',
        'Kann einen Prüfdurchlauf ausführen, der nur die markierten Tokens erneut liest, eine unabhängige zweite Meinung, die Abweichungen als [?: vlm | other] kennzeichnet, und eine separat gekennzeichnete KI-Zusammenfassung, wenn der Server diese Engines aktiviert hat.',
      ],
      flowSteps: [
        {
          title: 'Seiten hinzufügen',
          description: 'Legen Sie ein Seitenbild pro Datei ab, gedruckt oder handschriftlich oder gemischt, und ziehen Sie sie in die richtige Reihenfolge.',
        },
        {
          title: 'Modus und Ausgaben wählen',
          description: 'Auto, Gedruckt oder Handschrift; PDF immer, Word optional; die Tesseract-Sprache für gedruckte Seiten; Begradigen und automatisches Drehen für die OCR gedruckter Seiten.',
        },
        {
          title: 'Vorbereiten und lesen',
          description: 'Die Seiten werden automatisch ausgerichtet und bei Handschrift mit Real-ESRGAN 2x hochskaliert, bevor das Modell sie liest; gedruckte Seiten warten auf Tesseract im PDF-Schritt.',
        },
        {
          title: 'Dateien erstellen',
          description: 'OCRmyPDF und reportlab erzeugen die PDFs pro Seite, pikepdf führt sie zusammen; das Word-Dokument wird von Pandoc aus Markdown zusammengesetzt.',
        },
        {
          title: 'Prüfen und herunterladen',
          description: 'Ein Viewer öffnet das PDF; laden Sie es herunter, dazu die Word-Datei, falls angefordert, und das Manifest, das Engine und Konfidenz jeder Seite festhält.',
        },
      ],
      advancedDetails: [
        'Gedruckte Seiten: Das normalisierte PNG wird verlustfrei mit img2pdf verpackt, dann führt OCRmyPDF Tesseract mit Ihren Sprachcodes aus, mit deskew und rotate_pages, wenn angehakt, output_type pdfa und force_ocr, und schreibt die Textebene unter das Bild. Schlägt OCRmyPDF bei einer Seite fehl, wird die reine Bildseite behalten, sodass das PDF trotzdem vollständig ist.',
        'Handschriftliche Seiten: Das Modell ist qwen3-vl (8B, instruct, Quantisierung q8_0), bereitgestellt von Ollama bei Temperatur 0,1, angewiesen, wortgetreu zu transkribieren, Zeilenumbrüche zu behalten, [illegible] und [?: guess] zu markieren, Zeichen wie (arrow) oder (circled) zu vermerken und JSON mit dem vollständigen Text und einem Begrenzungsrahmen pro Zeile zurückzugeben.',
        'Die Handschrift-PDF-Seite wird mit reportlab in der Pixelgröße des Bildes gezeichnet: Der Scan ist die sichtbare Seite, jede transkribierte Zeile wird an ihrem Begrenzungsrahmen im Textrendermodus 3 (durchsuchbar, nie gezeichnet) in Helvetica platziert, in der Zeilenhöhe zwischen 6 und 48 Punkt, mit einem ganzseitigen unsichtbaren Block als Rückfall, wenn keine Rahmen zurückkamen, und einer grauen 8-Punkt-Fußzeile mit dem Text „Machine transcription, verify against original“.',
        'Die Konfidenz wird berechnet, nicht geraten: hoch, wenn eine Seite keine Marker hat, mittel, wenn weniger als 15 Prozent ihrer Zeilen einen tragen, sonst niedrig. Der Prüfdurchlauf (standardmäßig an) sendet Seite und Entwurf mit der Anweisung zurück an das Modell, nur markierte Tokens aufzulösen und nichts anderes zu ändern; schlägt er fehl, wird der Entwurf behalten.',
        'Die Vorbereinigung für Handschrift ist realesrgan-x4plus mit Skalierung 2 auf der Vulkan-GPU, standardmäßig an für Auto und Handschrift und aus für Gedruckt; sie erfolgt nach bestem Bemühen, und die Originale werden behalten, wenn sie fehlschlägt. Das Word-Dokument wird von Pandoc aus GitHub-Flavored Markdown erstellt; die optionale Zusammenfassung verwendet ein separates Textmodell und wird mit einer KI-Kennzeichnung in eine eigene Datei geschrieben.',
        'Standardmäßig läuft ein Dokumentauftrag gleichzeitig auf dem Server, jeder Modellaufruf hat eine Obergrenze von 40 Minuten, und die Uploads und der Arbeitsordner werden gelöscht, sobald der Auftrag endet; nur der Ergebnisordner (PDF, DOCX, manifest.json, README.txt) bleibt für die Aufbewahrungsfrist.',
      ],
      whyItMatters: [
        'Ein Foto einer Seite ist kein Dokument, bis es durchsucht und zitiert werden kann. Das PDF fügt das hinzu, ohne die Pixel anzutasten, der Scan bleibt also die Autorität.',
        'Handschrifterkennung, die selbstbewusst rät, ist schlimmer als keine. Explizite [illegible]- und [?: guess]-Marker, eine Konfidenz pro Seite und eine sichtbare Kennzeichnung machen die Transkription als Entwurf nutzbar und nie mit dem Original verwechselbar.',
        'Gedruckte und handschriftliche Seiten brauchen unterschiedliche Engines. Jede Seite zur richtigen zu leiten, innerhalb eines geordneten Auftrags, macht aus einem Heft mit gedrucktem Formular und handschriftlichen Antworten eine einzige Datei.',
      ],
      useCases: [
        {
          title: 'Durchsuchbare Unterlagen',
          description: 'Gescannte Verträge, Belege und Formulare werden ein PDF/A, das Sie durchsuchen und aus dem Sie kopieren können, mit unveränderten Seitenbildern.',
        },
        {
          title: 'Feld- und Laborbücher',
          description: 'Handschriftliche Notizen werden ein durchsuchbares PDF und ein Word-Entwurf, in dem jedes unsichere Wort zur Prüfung markiert ist.',
        },
        {
          title: 'Bild zu Word',
          description: 'Eine mit dem Telefon fotografierte gedruckte Seite wird ein bearbeitbares .docx mit rekonstruierten Überschriften, Listen und Tabellen.',
        },
        {
          title: 'Gemischte Dokumente',
          description: 'Ein gedruckter Fragebogen mit handschriftlichen Antworten durchläuft beide Engines und kommt als eine einzige geordnete Datei zurück.',
        },
        {
          title: 'Archive',
          description: 'Alte getippte Briefe und Protokolle erhalten eine Textebene für die Indexierung, während der Scan genau so bleibt, wie er war.',
        },
      ],
      workedExamples: [
        {
          title: 'Drei gedruckte A4-Seiten mit 300 dpi',
          body: 'Drei JPEG-Scans mit 2480 x 3508 im Modus Gedruckt, nur PDF, Sprache eng, Begradigen und automatisches Drehen an. Kein Modell ist beteiligt: Jede Seite wird von img2pdf verpackt, dann führt OCRmyPDF Tesseract aus und schreibt eine unsichtbare Textebene, gibt PDF/A aus, und pikepdf führt die drei zu document.pdf zusammen. Die Textebene fügt nur Kilobytes pro Seite hinzu, das PDF hat also grob die Größe der drei Seitenbilder (eine begradigte Seite wird neu gerendert, eine unveränderte unverändert eingebettet). Der Auftrag verbraucht einen KI-Auftrag (zurückerstattet, wenn er fehlschlägt), und seine Zeit ist Tesseract auf der CPU, Seite nach Seite, plus etwaiges Warten in der Warteschlange, da standardmäßig ein Dokumentauftrag gleichzeitig läuft.',
        },
        {
          title: 'Zwei handschriftliche Seiten vom Telefon, mit Word',
          body: 'Zwei Handyfotos mit 4032 x 3024 von Notizbuchseiten im Modus Auto mit PDF und DOCX. Die Vorbereitung richtet beide automatisch zu PNG aus und skaliert sie, weil der Modus nicht Gedruckt ist, mit realesrgan-x4plus 2x auf 8064 x 6048 hoch. Die Klassifizierung stellt qwen3-vl eine Frage pro Seite, die Erkennung liefert die Transkription mit einem Begrenzungsrahmen pro Zeile, und die Prüfung liest nur die markierten Tokens erneut. Hat eine Seite 30 Zeilen und 2 davon tragen [?: ...]-Marker, liegt 2 / 30 unter 15 Prozent, und die Seite wird mit mittlerer Konfidenz und illegibleCount 2 markiert. Die PDF-Seiten sind die verarbeiteten Bilder mit unsichtbaren Helvetica-Zeilen an diesen Rahmen und dem Fußzeilenstempel; die Word-Datei enthält den wortgetreuen Text unter dem fett gesetzten Prüfhinweis. Die Zeit sind drei aufeinanderfolgende Bildmodell-Durchläufe pro Seite auf unserer GPU; nichts läuft anderswo.',
        },
      ],
      whenNotToUse: 'Verwenden Sie dies nicht, wenn der Text ohne Prüfung verbindlich sein muss: Die Handschriftausgabe ist eine Maschinenlesung mit markierten Lücken, und das Word-Dokument und die Zusammenfassung sind Rekonstruktionen, prüfen Sie sie also gegen den Scan, bevor Sie sie zitieren. Es ist kein OCR-Tool von PDF zu PDF: Eingaben sind Seitenbilder, rendern Sie ein vorhandenes PDF also zuerst in Bilder, und es ist kein Übersetzer. Wenn Sie die Seiten nur ohne Textebene zu einem PDF binden müssen, erledigt das einfache Tool „Bild in PDF“ das als Standardauftrag statt als KI-Auftrag, womit das Gastkontingent von drei KI-Aufträgen pro Tag für Arbeit frei bleibt, die ein Modell braucht.',
      whyMediaManipulator: [
        'Das PDF gedruckter Seiten ist von Konstruktion her getreu: OCRmyPDF legt Text unter ein unverändertes Seitenbild und gibt PDF/A aus, nichts wird neu gezeichnet.',
        'Handschrift ist wortgetreu mit Belegen: Der Prompt verbietet Erfindungen, Unsicherheit ist im Text markiert, die Konfidenz wird aus diesen Markern gezählt, und die Seite sagt, dass sie eine Maschinentranskription ist.',
        'Jede Engine ist unsere: Tesseract auf der CPU, qwen3-vl und das Textmodell über Ollama, PaddleOCR-VL und Real-ESRGAN auf unseren GPUs. Keine Seite geht an einen externen KI-Dienst.',
      ],
      privacyNote: 'Ihre Seitenbilder werden nach uploads/<jobId>/src/ gespeichert und normalisierte Kopien in einen Arbeitsordner; handschriftliche Seiten werden an das von Ollama auf unserer eigenen GPU bereitgestellte Modell qwen3-vl gesendet, gedruckte Seiten werden von Tesseract auf der CPU gelesen, und die Transkriptionsentwürfe pro Seite werden als JSON in diesem Arbeitsordner aufbewahrt, während der Auftrag läuft. Wenn der Auftrag endet, werden sowohl die Uploads als auch der Arbeitsordner sofort gelöscht; was bleibt, ist der Ergebnisordner in outputs/<jobId>/ mit dem PDF, der Word-Datei, falls angefordert, dem Manifest (Engine, Konfidenz und Markeranzahl pro Seite) und einer README, und dieser Ordner wird entfernt, wenn die Aufbewahrungsfrist endet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre. Der transkribierte Text steckt in der PDF-Textebene und im DOCX, das Sie herunterladen. Nichts wird an einen externen KI-Anbieter gesendet, und nichts wird zum Trainieren verwendet.',
      faq: [
        {
          question: 'Was ist der Unterschied zwischen dem PDF und dem Word-Dokument?',
          answer: 'Das PDF ist Ihr Scan mit einer durchsuchbaren Textebene: eine Tesseract-Ebene unter einer gedruckten Seite, eine unsichtbare Maschinentranskription unter einer handschriftlichen, in beiden Fällen mit dem Originalbild als sichtbarer Seite. Das Word-Dokument ist eine separate Rekonstruktion: gedruckte Seiten als Überschriften, Listen und Tabellen, erzeugt von PaddleOCR-VL oder Docling, handschriftliche Seiten als wortgetreue Transkription unter einem fett gesetzten Hinweis, sie zu prüfen. Betrachten Sie das PDF-Bild als Autorität und das DOCX als Entwurf.',
        },
        {
          question: 'Wie zuverlässig ist die Handschrifttranskription?',
          answer: 'Sie ist eine sorgfältige Maschinenlesung, kein beglaubigtes Transkript. Das Modell ist angewiesen, genau zu kopieren, was geschrieben steht, alles Unlesbare als [illegible] und jedes zweifelhafte Wort als [?: best guess] zu markieren und nie zu erfinden oder zu korrigieren. Jede Seite erhält eine Konfidenz (hoch ohne Marker, mittel unter 15 Prozent markierter Zeilen, niedrig darüber) und eine Markeranzahl, und die PDF-Seite trägt eine sichtbare Fußzeile zur Maschinentranskription. Lesen Sie die markierten Wörter gegen den Scan.',
        },
        {
          question: 'Kann ich gedruckte und handschriftliche Seiten mischen?',
          answer: 'Ja. Im Modus Auto wird das Bildmodell für jede Seite gefragt, ob sie überwiegend gedruckt oder handschriftlich ist, und die Seite geht entsprechend an Tesseract oder an das Handschriftmodell. Das Manifest hält die Antwort pro Seite fest, und das endgültige PDF und die Word-Datei behalten die Reihenfolge, die Sie vor dem Start festgelegt haben.',
        },
        {
          question: 'Welche Sprachen unterstützt die OCR gedruckter Seiten?',
          answer: 'Tesseract-Sprachcodes, für gemischte Seiten mit einem Pluszeichen verbunden (zum Beispiel eng+fra). Die vom Server angebotenen Codes sind im Formular aufgeführt; Englisch ist standardmäßig installiert, weitere erscheinen, sobald sie hinzugefügt werden. Handschrift wird von einem Bildmodell gelesen und verwendet diese Codes nicht.',
        },
        {
          question: 'Welche Limits gelten pro Auftrag?',
          answer: 'Standardmäßig bis zu 50 Seitenbilder pro Auftrag (jedes Bild ist eine Seite, 50 ist in der Praxis also auch das Seitenlimit), 25 MB pro Bild, ein laufender Auftrag gleichzeitig pro Server (andere warten in der Warteschlange) und eine Obergrenze von 40 Minuten pro Modellphase. Jeder Auftrag verbraucht einen KI-Auftrag: 3 pro Tag ohne Konto, 10 mit einem kostenlosen Konto, 100 mit Premium und 200 mit Pro, wobei die Einheit zurückerstattet wird, wenn ein Auftrag fehlschlägt. Die aktuellen Zahlen stehen auf der Preisseite.',
        },
        {
          question: 'Warum hat mein Handschrift-PDF eine Fußzeile, und kann ich sie entfernen?',
          answer: 'Jede handschriftliche Seite trägt eine kleine graue Zeile „Machine transcription, verify against original“, und der Word-Abschnitt hat ein fett gesetztes Gegenstück, weil eine durchsuchbare Kopie von Handschrift mit einer geprüften verwechselt werden kann. Sie sind absichtlich Teil der Ausgabe und lassen sich nicht abschalten. Gedruckte Seiten, deren Ebene deterministische Tesseract-Ausgabe ist, tragen keinen Stempel.',
        },
        {
          question: 'Verlassen meine Seiten Ihre Server?',
          answer: 'Nein. Tesseract läuft auf der CPU, das Handschrift- und Klassifizierungsmodell läuft über Ollama auf unserer GPU, und die Struktur-Engine und der Upscaler laufen auf einer zweiten GPU in derselben Maschine. Die Uploads und Arbeitsdateien werden gelöscht, sobald der Auftrag abgeschlossen ist.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Fügen Sie standardmäßig bis zu 50 Seitenbilder pro Auftrag hinzu; jedes Seitenbild hat eine eigene Größengrenze (~25 MB).',
          'Ein durchsuchbares PDF wird immer erzeugt; das bearbeitbare Word-Dokument ist optional.',
        ],
        processingNotes: [
          'Gedruckte Seiten verwenden deterministische OCR (OCRmyPDF + Tesseract) für eine getreue, durchsuchbare Textebene.',
          'Handschrift wird von einer Bild-KI wortgetreu transkribiert, mit erhaltenen [illegible]/[?]-Markern; es ist eine Maschinentranskription, nicht die verbindliche Seite.',
          'Das Word-Dokument und jede KI-Zusammenfassung sind Rekonstruktionen; prüfen Sie sie gegen den Originalscan.',
        ],
      },
      related: [
        {
          label: 'Bild in PDF',
          to: '/tools/image-to-pdf',
          description: 'Binden Sie Seitenbilder ohne Textebene zu einem PDF, als Standardauftrag.',
        },
        {
          label: 'PDF in JPG',
          to: '/tools/pdf-to-jpg',
          description: 'Rendern Sie ein vorhandenes PDF in Seitenbilder, die Sie dem Scan übergeben können.',
        },
        {
          label: 'KI-Bildrestaurierung',
          to: '/tools/ai-image-restoration',
          description: 'Reparieren Sie einen verblassten oder unscharfen Scan vor dem Transkribieren.',
        },
        {
          label: 'EXIF-Metadaten entfernen',
          to: '/tools/remove-exif-metadata',
          description: 'Entfernen Sie Standort- und Geräte-Tags aus Handyfotos von Dokumenten.',
        },
        {
          label: 'Text im Bild schwärzen',
          to: '/tools/redact-text-in-image',
          description: 'Schwärzen Sie Namen oder Nummern auf einer Seite, bevor Sie den Scan teilen.',
        },
      ],
      embed: {
        title: 'KI-Dokumentenscan',
        description: 'Fügen Sie ein oder mehrere gescannte Seitenbilder hinzu (gedruckte Dokumente oder handschriftliche Notizen), ordnen Sie sie bei Bedarf neu, wählen Sie einen Inhaltsmodus und die Ausgaben und erhalten Sie ein durchsuchbares PDF plus ein optionales Word-Dokument.',
      },
    },
    'ai-image-upscaler': {
      name: 'KI-Bild-Upscaler',
      h1: 'KI-Bild-Upscaler: Fotos online 2x oder 4x vergrößern',
      tagline: 'Vergrößern Sie ein kleines oder weiches Foto mit einem Real-ESRGAN-Modell, das feine Details neu aufbaut, statt nur Pixel zu strecken.',
      metaTitle: 'KI-Bild-Upscaler: Fotos 2x oder 4x vergrößern | Media Manipulator',
      metaDescription: 'Skalieren Sie ein niedrig aufgelöstes Foto 2x oder 4x mit KI hoch, die Kanten und Texturen wiederherstellt. Läuft auf unserer eigenen GPU, Ausgabe als PNG. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ogTitle: 'KI-Bild-Upscaler: Fotos 2x oder 4x vergrößern',
      ogDescription: 'Vergrößern Sie kleine oder weiche Fotos mit einem Real-ESRGAN-KI-Modell, das Details neu aufbaut, statt Pixel zu strecken.',
      intro: 'Diese Seite öffnet den Bildkonverter mit fest eingestelltem KI-Upscaling und PNG als Ausgabe. Der Server führt realesrgan-ncnn-vulkan, den Vulkan-Build von Real-ESRGAN, auf einer GPU in unserem Besitz aus: Das Standardmodell ist realesrgan-x4plus bei 4x, mit realesrgan-x4plus-anime und realesr-animevideov3 für Zeichnungen und Animationsbilder und 2x als alternativer Skalierung. Statt zwischen Ihren vorhandenen Pixeln zu interpolieren, sagt das Netz voraus, wie Kanten, Haut, Stoff und Laub in der größeren Größe aussehen, und zeichnet diese Details ein. Das Ergebnis wird als verlustfreies PNG geschrieben, damit sich keine neuen Kompressionsartefakte über die synthetisierten Details legen.',
      whatItDoes: [
        'Vergrößert ein Bild auf 2x oder 4x seiner Breite und Höhe mit einem Real-ESRGAN-Modell auf unserer GPU.',
        'Lässt Sie im Formular zwischen einem Fotomodell und zwei Modellen im Anime-Stil wählen; 4x und das Fotomodell sind vorausgewählt.',
        'Gibt immer PNG aus; die API erzwingt für diese Operation die Endung .png.',
        'Kachelt das Bild auf der GPU automatisch, damit großen Eingaben nicht der Grafikspeicher ausgeht.',
        'Verbraucht einen KI-Auftrag aus dem täglichen KI-Kontingent, einem eigenen Zähler; das Standardkontingent für Konvertierungen bleibt unberührt.',
      ],
      flowSteps: [
        {
          title: 'Kleines oder weiches Bild hochladen',
          description: 'JPG, PNG oder WebP. Je kleiner die Eingabe, desto mehr muss das Modell erfinden.',
        },
        {
          title: '4x oder 2x und ein Modell wählen',
          description: 'realesrgan-x4plus für Fotos, die Anime-Modelle für Strichzeichnungen und Cartoon-Bilder.',
        },
        {
          title: 'Real-ESRGAN läuft auf der GPU',
          description: 'Der Server führt realesrgan-ncnn-vulkan -i in -o out -n <model> -s <2|4> -t 0 -g <gpu> -f png aus.',
        },
        {
          title: 'PNG herunterladen',
          description: 'converted.png mit 2x oder 4x den ursprünglichen Pixelmaßen.',
        },
      ],
      advancedDetails: [
        'Der Aufruf ist UpscaleImage in ai_tools.go. Er startet realesrgan-ncnn-vulkan mit -n für das Modell, -s für die Skalierung, -t 0 für automatische Kachelgröße, -g für den GPU-Index und -f png; der Vulkan-ICD wird über Umgebungsvariablen festgelegt, damit der Loader immer den NVIDIA-Treiber findet.',
        'Nur die Skalierungen 2 und 4 und nur die drei Modellnamen realesrgan-x4plus, realesrgan-x4plus-anime und realesr-animevideov3 werden akzeptiert; alles andere wird vor dem Start des Auftrags abgelehnt.',
        '2x führt dasselbe x4-Netz mit halber Skalierung aus. Das Formular trägt einen Hinweis, dass 2x bei manchen Bildern leicht beschnitten oder gezoomt wirken kann, was auf dem Server bei einem Foto mit 640 x 360 beobachtet wurde; die API verbirgt das absichtlich nicht, indem sie 4x ausführt und verkleinert.',
        'Da der KI-Pfad ImageMagick und das exiftool-Kopieren umgeht, bewirken die Qualitäts-, Größen-, Filter- und Metadateneinstellungen im Formular hier nichts, und das PNG trägt kein EXIF des Originals.',
        'Die Pixelzahl wächst mit dem Quadrat der Skalierung: 4x bedeutet 16-mal so viele Pixel und 2x 4-mal. Das unkomprimierte RGB der Ausgabe ist Breite x Höhe x 3 Bytes, was begrenzt, wie groß das PNG werden kann.',
        'Es gibt für diese Operation keine serverseitige Grenze der Eingabemaße jenseits des Dateigrößenlimits Ihres Tarifs; sehr große Eingaben dauern einfach länger, Kachel für Kachel.',
      ],
      whyItMatters: [
        'Alte Digitalfotos, niedrig aufgelöste Downloads und kleine Webbilder müssen oft weit größer gedruckt oder gezeigt werden, als sie aufgenommen wurden.',
        'Einfache Interpolation macht ein größeres Bild, kein schärferes; ein Super-Resolution-Modell ist der Unterschied zwischen unscharf und brauchbar.',
        'Mit einem verlustfreien PNG zu beginnen lässt Ihnen die Freiheit, das Ergebnis danach zu komprimieren oder zu skalieren, ohne Artefakte zu verstärken.',
      ],
      useCases: [
        {
          title: 'Alte Fotos drucken',
          description: 'Bringen Sie ein Foto mit 1 Megapixel von einer frühen Kamera auf eine Größe, die sich gut drucken lässt.',
        },
        {
          title: 'Kleine Downloads retten',
          description: 'Vergrößern Sie ein Produkt- oder Referenzbild mit 400 px zu etwas Brauchbarem.',
        },
        {
          title: 'Anime und Illustration',
          description: 'Skalieren Sie Strichzeichnungen mit realesrgan-x4plus-anime ohne matschige Kanten hoch.',
        },
        {
          title: 'Spiel- und Videobilder',
          description: 'Verwenden Sie realesr-animevideov3 für aufgenommene Animationsbilder.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein JPEG mit 640 x 360 bei 4x mit realesrgan-x4plus',
          body: 'Eingabe: ein JPEG-Vorschaubild einer Landschaft mit 92 KB und 640 x 360. Einstellungen bei der Voreinstellung gelassen: 4x, Fotomodell, PNG-Ausgabe. Der Server führt realesrgan-ncnn-vulkan -n realesrgan-x4plus -s 4 -t 0 -f png aus und schreibt converted.png mit 2560 x 1440 Pixeln, 16-mal die ursprünglichen 230.400 Pixel. Die unkomprimierte Ausgabe ist 2560 x 1440 x 3 = 11 MB RGB, und das PNG landet darunter, je nachdem, wie viel Himmel und flache Farbe es enthält, rechnen Sie also mit mehreren Megabyte aus einer Eingabe von 92 KB. Der GPU-Durchgang über die automatisch gewählten Kacheln ist bei einer Ausgabe dieser Größe eine Sache von Sekunden; die PNG-Kodierung und der Download einer mehrere Megabyte großen Datei nehmen einen spürbaren Anteil der Gesamtzeit ein.',
        },
        {
          title: 'Ein Foto mit 1200 x 800 bei 2x',
          body: 'Eingabe: ein JPEG einer Person mit 480 KB und 1200 x 800. Wählen Sie 2x und behalten Sie das Fotomodell. Die Ausgabe ist ein PNG mit 2400 x 1600, 3,84 Megapixel, viermal die ursprünglichen 0,96. Unkomprimiert sind das 11,5 MB RGB, und das PNG wird ein Bruchteil davon sein. Da 2x das x4-Netz mit halber Skalierung ausführt, prüfen Sie die Ränder auf den leichten Beschnitt oder Zoom, vor dem das Formular warnt; tritt er auf, führen Sie stattdessen 4x aus und verkleinern Sie das Ergebnis mit 4800 x 3200 mit dem Bildgrößen-Änderer auf 2400 x 1600, was einen weiteren Vorgang kostet.',
        },
      ],
      whenNotToUse: 'Skalieren Sie kein Bild hoch, das bereits groß und scharf ist: Ein Foto mit 12 Megapixeln bei 4x wird ein PNG mit 192 Megapixeln, das langsam zu erzeugen ist, unkomprimiert Hunderte Megabyte groß und nichts Sichtbares gewinnt. Verlassen Sie sich nicht darauf bei Gesichtern, Text, Logos oder allem, wo das exakte Original erhalten bleiben muss, denn die hinzugefügten Details sind vorhergesagt, nicht wiederhergestellt, und kleiner Text kann als plausible, aber falsche Buchstaben herauskommen. Starke Bewegungsunschärfe und verfehlter Fokus werden durch Auflösung nicht behoben. Wenn Sie nur eine bestimmte Pixelgröße aus einem größeren Original brauchen, ist der einfache Größen-Änderer schneller und günstiger.',
      whyMediaManipulator: [
        'Die echte Binärdatei, die Modelle und Flags sind hier benannt, sodass Sie wissen, dass es Real-ESRGAN mit automatischer Kachelung ist und kein generisches „Verbessern“.',
        'Der Vorbehalt zu 2x wird genannt statt versteckt, und die Operation ist fest eingestellt, sodass Sie kein Menü durchsuchen müssen.',
        'Läuft auf Hardware in unserem Besitz; das Standardtool braucht kein Konto. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ],
      privacyNote: 'Ihr Bild wird unter uploads/<jobId>/ auf unserem Server gespeichert und direkt von der Binärdatei realesrgan-ncnn-vulkan auf einer GPU in derselben Maschine gelesen; das erzeugte PNG geht nach outputs/<jobId>/converted.png. Kein externer KI-Anbieter ist beteiligt, und Ihr Bild wird nicht zum Trainieren verwendet. Wie bei jedem Bild-Upload lässt ein automatisierter Analyseschritt auf unserem Server einmal ein lokales Bildmodell über die Datei laufen und speichert seine Zusammenfassung beim Auftrag. Das Ergebnis hat kein EXIF des Originals, weil KI-Operationen das Kopieren der Metadaten überspringen. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      faq: [
        {
          question: 'Ist der KI-Upscaler kostenlos nutzbar?',
          answer: 'Ja, innerhalb des täglichen KI-Kontingents. Jedes Hochskalieren verbraucht einen KI-Auftrag: standardmäßig 3 pro Tag für Gäste und 10 mit einem kostenlosen Konto, mit Grenzen von 200 MB und 1 GB pro Datei; 100 und 200 bei Premium und Pro. Dieses Kontingent ist vom Standardkontingent getrennt, Ihre Konvertierungen bleiben also unberührt. Die aktuellen Zahlen stehen auf /pricing.',
        },
        {
          question: 'Wie unterscheidet sich das vom Bildgrößen-Änderer?',
          answer: 'Der Größen-Änderer führt ImageMagick aus, das vorhandene Pixel interpoliert und ein größeres, aber weicheres Bild erzeugt. Dieses Tool führt ein trainiertes Real-ESRGAN-Netz aus, das Kanten und Texturen in der größeren Größe synthetisiert. Es ist eine Schlussfolgerung, keine wiederhergestellten Daten.',
        },
        {
          question: 'Soll ich 2x oder 4x wählen?',
          answer: '4x ist der Standard und liefert die konsistenteste Ausgabe. 2x führt dasselbe Netz mit halber Skalierung aus und kann bei manchen Bildern leicht beschnitten wirken, wenn 4x also mehr ist, als Sie brauchen, erwägen Sie 4x mit anschließender Verkleinerung.',
        },
        {
          question: 'Welches Modell ist für Zeichnungen richtig?',
          answer: 'realesrgan-x4plus-anime für Illustrationen und flächige Grafik; realesr-animevideov3 für Bilder aus Animationen. Das Fotomodell fügt hautähnliche Textur hinzu, die bei Strichzeichnungen falsch aussieht.',
        },
        {
          question: 'Warum ist die Ausgabe PNG und so groß?',
          answer: 'PNG wird erzwungen, damit die synthetisierten Details nicht sofort durch JPEG-Kompression beschädigt werden. Ein 4x-Ergebnis hat 16-mal so viele Pixel, die Datei ist also groß; komprimieren Sie sie zum Teilen anschließend zu JPG oder WebP.',
        },
        {
          question: 'Kann es ein unscharfes oder unfokussiertes Foto reparieren?',
          answer: 'Es hilft bei Weichheit, die von geringer Auflösung kommt. Es kann Bewegungsunschärfe oder verfehlten Fokus nicht rückgängig machen und kann Gesichter und feinen Text glätten oder verändern. Vergleichen Sie das Ergebnis vor der Verwendung mit dem Original.',
        },
        {
          question: 'Wird mein Foto an einen externen KI-Dienst gesendet?',
          answer: 'Nein. Real-ESRGAN läuft auf einem GPU-Server, den wir betreiben, und der Auftrag ruft nie eine externe API auf.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Die Ausgabe ist PNG. Größenlimits und das tägliche KI-Kontingent hängen von Ihrem Tarif ab und werden im Formular angezeigt, nicht fest auf dieser Seite.',
        ],
      },
      related: [
        {
          label: 'KI-Bildrestaurierung',
          to: '/tools/ai-image-restoration',
          description: 'Bereinigen Sie Kompression und Rauschen vor oder nach dem Vergrößern.',
        },
        {
          label: 'Bildgröße ändern',
          to: '/tools/image-resizer',
          description: 'Bringen Sie ein 4x-Ergebnis auf die exakte Größe, die Sie brauchen.',
        },
        {
          label: 'Bild komprimieren',
          to: '/tools/compress-image',
          description: 'Verwandeln Sie das große PNG in ein teilbares JPG oder WebP.',
        },
        {
          label: 'Hintergrund aus Bild entfernen',
          to: '/tools/remove-background-from-image',
          description: 'Schneiden Sie das vergrößerte Motiv auf Transparenz aus.',
        },
        {
          label: 'KI-Videorestaurierung',
          to: '/tools/ai-video-restoration',
          description: 'Das Gegenstück für Videobilder.',
        },
      ],
      embed: {
        title: 'Ein Bild mit KI hochskalieren',
        description: 'Laden Sie ein Foto hoch. KI-Upscaling ist bereits gewählt und gesperrt, die Ausgabe ist PNG. Wählen Sie 2x oder 4x und ein Modell (Foto oder Anime) und konvertieren Sie dann.',
      },
    },
    'blur-faces-in-photo': {
      name: 'Gesichter im Foto unkenntlich machen',
      h1: 'Gesichter in einem Foto online unkenntlich machen',
      tagline: 'Erkennen Sie Gesichter automatisch und machen Sie dann alle oder nur die gewählten durch Weichzeichnen, Verpixeln oder Schwärzen unkenntlich.',
      metaTitle: 'Gesichter in einem Foto online unkenntlich machen | Media Manipulator',
      metaDescription: 'Gesichter in einem Foto weichzeichnen, verpixeln oder schwärzen. Erkennen Sie jedes Gesicht und wählen Sie dann, welche verdeckt werden. KI auf unserer eigenen GPU. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ogTitle: 'Gesichter in einem Foto online unkenntlich machen',
      ogDescription: 'Finden Sie Gesichter in einem Foto automatisch und machen Sie alle oder nur die gewählten durch Weichzeichnen, Verpixeln oder Schwärzen unkenntlich.',
      intro: 'Ein Foto einer Menschenmenge, einer Schulklasse oder einer Straßenszene zu veröffentlichen bedeutet meist, Personen zu verbergen, die nie zugestimmt haben, darin zu erscheinen. Diese Seite findet Gesichter mit dem YuNet-Detektor, der in OpenCV auf unserem eigenen Server läuft, und verdeckt jedes mit einem Gaußschen Weichzeichner, einem Pixelmosaik oder einem schwarzen Rechteck. Sie können jedes erkannte Gesicht in einem Schritt verdecken oder zuerst die Erkennung ausführen, die auf Ihrem Foto eingezeichneten Rahmen ansehen und nur die zu verdeckenden oder nur die zu behaltenden Gesichter wählen. Der Detektor, seine Konfidenzschwelle und die genaue Größe jedes Effekts sind unten beschrieben, damit Sie wissen, was die Ausgabe schützt und was nicht.',
      whatItDoes: [
        'Erkennt Gesichter mit OpenCV FaceDetectorYN und dem YuNet-Modell von 2023 bei einer Konfidenzschwelle von 0,85 und vergrößert dann jeden Rahmen auf jeder Seite um 18 Prozent, damit auch Haare und Kinnlinie verdeckt werden.',
        'Verdeckt jedes gewählte Gesicht mit einem Gaußschen Weichzeichner, dessen Kernel ein Drittel der Rahmengröße ist, einem Mosaik von 14 Blöcken über die Rahmenbreite oder einer schwarzen Füllung.',
        'Bietet drei Auswahlmodi: alle erkannten Gesichter, nur die angehakten Gesichter oder alle außer den angehakten.',
        'Speichert die Erkennungsergebnisse in einer 30-minütigen Sitzung, die an den SHA-256 Ihrer Datei gebunden ist, sodass genau die Rahmen angewendet werden, die Sie gesehen haben.',
        'Schreibt ein neues JPG, PNG oder WebP mit denselben Pixelmaßen; der ursprüngliche Upload wird nicht verändert.',
      ],
      flowSteps: [
        {
          title: 'Foto hochladen',
          description: 'JPG, PNG oder WebP. „Gesichter weichzeichnen / verpixeln“ ist auf dieser Seite vorausgewählt und gesperrt.',
        },
        {
          title: 'Weichzeichnen, Verpixeln oder schwarzen Kasten wählen',
          description: 'Weichzeichnen ist voreingestellt; ein schwarzer Kasten entfernt die Pixel vollständig.',
        },
        {
          title: 'Optional erkennen und auswählen',
          description: 'Klicken Sie auf „Gesichter erkennen“, um nummerierte Rahmen zu sehen, und haken Sie dann die zu verdeckenden oder zu behaltenden an.',
        },
        {
          title: 'Auftrag ausführen',
          description: 'Der Server wendet den Effekt in jedem gewählten Rahmen an und speichert ein neues Bild.',
        },
        {
          title: 'Prüfen und herunterladen',
          description: 'Zoomen Sie auf volle Größe und suchen Sie nach übersehenen Gesichtern, bevor Sie es posten.',
        },
      ],
      advancedDetails: [
        'Die Erkennung führt face_privacy.py mit OpenCV FaceDetectorYN auf face_detection_yunet_2023mar.onnx in voller Bildauflösung aus, Score-Schwelle 0,85, NMS-Schwelle 0,3 und bis zu 5000 Kandidaten. Die Rahmen werden auf jeder Seite um 0,18 ihrer Breite und Höhe erweitert und auf das Bild begrenzt.',
        'Weichzeichnen wendet cv2.GaussianBlur mit einem ungeraden Kernel von max(3, längste Rahmenseite / 3) Pixeln an, ein Gesicht mit 300 px erhält also einen Kernel von 101 px; je größer das Gesicht, desto stärker der Weichzeichner. Verpixeln verkleinert den Rahmen mit linearer Filterung auf 14 Blöcke über die Breite und skaliert ihn mit Nächster-Nachbar zurück, was sichtbare quadratische Kacheln ergibt. Der schwarze Kasten schreibt (0, 0, 0) in den Bereich.',
        'Wenn Sie zuerst erkennen, berechnet der Server den SHA-256 des Uploads, speichert die normalisierten Rahmen in einer Sitzung, die nach 30 Minuten abläuft, und verweigert die Anwendung einer Sitzung, deren Hash nicht zu der später eingereichten Datei passt, sodass Rahmen nicht auf ein anderes Bild übertragen werden können.',
        'Ohne Erkennungssitzung erkennt das Skript zur Laufzeit neu und verdeckt jedes gefundene Gesicht; das Ergebnis ist identisch mit „Gesichter erkennen“ und dem Modus „alle“.',
        'Die Ausgabe wird von OpenCV geschrieben, und der exiftool-Rückkopierschritt des Konverters läuft bei KI-Ausgaben nicht, das Ergebnis trägt also keine der ursprünglichen EXIF-, GPS- oder Kamera-Tags. Es ist trotzdem kein Ersatz für das EXIF-Tool, mit dem Sie sehen und wählen können, was entfernt wird.',
        'Ein leichter Weichzeichner auf einem großen, scharfen Gesicht kann mit Dekonvolutionswerkzeugen teilweise rückgängig gemacht werden; der schwarze Kasten ist die einzige Wahl, die die Information zerstört, und ein grobes Mosaik liegt dazwischen.',
      ],
      whyItMatters: [
        'Fotos anderer Menschen, und besonders von Kindern, bringen Einwilligungs- und manchmal rechtliche Pflichten mit sich, die eine Bildunterschrift nicht beheben kann.',
        'Ein Foto mit 20 Gesichtern von Hand zu bearbeiten ist langsam und uneinheitlich; die Erkennung findet auch die kleinen in der hinteren Reihe.',
        'Erkennen und dann auswählen lässt Sie Ihre eigene Gruppe sichtbar lassen, während Passanten anonymisiert werden.',
      ],
      useCases: [
        {
          title: 'Event- und Menschenmengenfotos',
          description: 'Verbergen Sie Unbeteiligte, bevor Sie Bilder einer öffentlichen Veranstaltung veröffentlichen.',
        },
        {
          title: 'Schul- und Vereinsbeiträge',
          description: 'Verdecken Sie bestimmte Kinder, deren Familien keine Einwilligung gegeben haben.',
        },
        {
          title: 'Journalismus und Berichterstattung',
          description: 'Schützen Sie Quellen oder Beteiligte in einem Dokumentarfoto.',
        },
        {
          title: 'Screenshots von Videoanrufen',
          description: 'Anonymisieren Sie Kolleginnen und Kollegen in einer Meeting-Aufnahme, bevor Sie sie außerhalb des Teams teilen.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein Gruppenfoto mit 4000 x 3000 und 14 Gesichtern, alle weichgezeichnet',
          body: 'Eingabe: ein JPEG mit 3,5 MB und 4000 x 3000 Pixeln von einem Telefon, mit 14 Personen. Einstellungen: Weichzeichnen, Auswahlmodus alle, keine vorherige Erkennung. Das Skript lässt YuNet über das volle Bild mit 12 Megapixeln laufen; ein Gesicht, dessen Rahmen 300 x 360 Pixel misst, wird um 18 Prozent auf etwa 408 x 490 erweitert und mit einem Gaußschen Kernel von 163 px (490 / 3, auf ungerade gerundet) weichgezeichnet, was es in einen konturlosen Fleck verwandelt. Ein Gesicht mit 60 px in der hinteren Reihe erhält einen Kernel von 27 px, genug, um die Züge bei dieser Größe zu entfernen. Die Ausgabe ist ein von OpenCV geschriebenes JPG mit 4000 x 3000, meist innerhalb weniger hundert Kilobyte der Originalgröße. Erkennung und Weichzeichnen dauern wenige Sekunden; der Upload von 3,5 MB dauert meist länger.',
        },
        {
          title: 'Ein Videoanruf-Screenshot mit 1920 x 1080, zwei von sechs Gesichtern verpixelt',
          body: 'Eingabe: ein PNG-Screenshot mit 1,1 MB und 1920 x 1080, der sechs Teilnehmer zeigt. Einstellungen: zuerst „Gesichter erkennen“, Auswahlmodus nur gewählte, zwei Gesichter angehakt, Verpixeln. Die Erkennung liefert sechs Rahmen und speichert sie in einer 30-minütigen Sitzung, die an den Datei-Hash gebunden ist. Beim Absenden prüft der Server den Hash, übergibt die zwei gewählten Rahmen-IDs an das Skript, und jeder gewählte Rahmen, nach der Erweiterung etwa 140 x 180 Pixel, wird auf 14 Blöcke über die Breite reduziert, sodass jede Kachel grob 10 x 13 Pixel misst, und dann als harte Quadrate zurückgeschrieben. Die anderen vier Gesichter bleiben unberührt. Die Ausgabe ist ein PNG mit 1920 x 1080, und der Auftrag läuft in wenigen Sekunden, weil keine erneute Erkennung nötig ist.',
        },
      ],
      whenNotToUse: 'Verlassen Sie sich nicht auf dieses Tool, wenn ein einzelnes übersehenes Gesicht unzulässig ist, etwa bei einer gesetzlich vorgeschriebenen Schwärzung; YuNet bei einer Schwelle von 0,85 überspringt Gesichter, die winzig, abgewandt, maskiert oder in tiefem Schatten sind, und Sie müssen die Ausgabe selbst prüfen. Verwenden Sie keinen leichten Weichzeichner auf einem großen Gesicht, wenn die Person unidentifizierbar bleiben muss; verwenden Sie den schwarzen Kasten. Namensschilder, Kennzeichen und Bildschirme sind keine Gesichter, dafür ist das Tool zum Schwärzen von Text oder der Objektentferner die richtige Wahl. Und wenn Sie eine Person ganz aus der Szene entfernen wollen, statt ihr Gesicht zu verbergen, erledigt das der Objektentferner.',
      whyMediaManipulator: [
        'Der Detektor, seine Schwelle, die Erweiterung und die Kernel-Arithmetik sind angegeben, sodass Sie beurteilen können, wie viel Schutz jeder Stil bietet.',
        'Die Erkennungsrahmen sind an den Datei-Hash gebunden und laufen nach 30 Minuten ab, sodass Sie auf genau dem Bild auswählen, das verarbeitet wird.',
        'Das Unkenntlichmachen von Gesichtern verbraucht einen KI-Auftrag aus dem täglichen KI-Kontingent (standardmäßig 3 pro Tag ohne Konto, 10 mit einem kostenlosen Konto), das vom Standardkontingent getrennt geführt wird, und die Vorschau „Gesichter erkennen“ wird gar nicht gezählt. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ],
      privacyNote: 'Gesichtserkennung und Weichzeichnen laufen als lokaler OpenCV-Prozess auf unserer eigenen Hardware; kein externer KI-Dienst erhält Ihr Foto, und nichts wird zum Trainieren verwendet. Die Vorschau „Gesichter erkennen“ speichert eine temporäre Kopie, berechnet ihren Hash, erkennt und löscht die Kopie vor der Antwort; nur die Rahmenkoordinaten werden behalten, für 30 Minuten. Das hochgeladene Foto liegt in uploads/<jobId>/ und das Ergebnis in outputs/<jobId>/, beide im Aufbewahrungsregister und gelöscht, wenn die Frist endet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre. Als Standard-Bild-Upload durchläuft das Foto außerdem unsere automatisierte Inhaltsanalyse auf demselben Server, wo ein lokales Bildmodell eine kurze Beschreibung schreibt, die beim Auftrag bleibt und nicht an Dritte weitergegeben wird.',
      faq: [
        {
          question: 'Welche Gesichter übersieht der Detektor?',
          answer: 'YuNet läuft mit einer Konfidenzschwelle von 0,85 und überspringt daher Kandidaten mit niedriger Konfidenz: sehr kleine Gesichter, von der Kamera abgewandte Profile, von Masken oder Händen verdeckte Gesichter und Gesichter in tiefem Schatten. Prüfen Sie das Ergebnis vor dem Teilen in voller Größe.',
        },
        {
          question: 'Wie mache ich nur einige Gesichter unkenntlich?',
          answer: 'Klicken Sie auf „Gesichter erkennen“, haken Sie die nummerierten Rahmen an und stellen Sie den Auswahlmodus auf „nur gewählte Gesichter“ oder „alle außer gewählten Gesichtern“. Die Rahmen werden 30 Minuten gegen den Datei-Hash gespeichert, erkennen Sie also neu, wenn Sie das Bild wechseln.',
        },
        {
          question: 'Wie stark ist der Weichzeichner, und lässt er sich rückgängig machen?',
          answer: 'Der Gaußsche Kernel ist ein Drittel der Rahmengröße, ein Gesicht mit 300 px erhält also einen Kernel von 101 px. Starker Weichzeichner ist schwer umzukehren, aber ein entschlossener Angreifer hat bei einem scharfen großen Gesicht eine Chance; der schwarze Kasten entfernt die Pixel und lässt sich nicht rückgängig machen.',
        },
        {
          question: 'Behält die Ausgabe die EXIF- und GPS-Daten meines Fotos?',
          answer: 'Nein. Das Ergebnis wird von OpenCV neu geschrieben, und der Metadaten-Rückkopierschritt wird bei KI-Ausgaben übersprungen, Kamera- und Standort-Tags werden also nicht übernommen. Verwenden Sie das EXIF-Tool, wenn Sie Tags prüfen oder gezielt entfernen möchten.',
        },
        {
          question: 'Wird mein Foto an eine externe KI-Firma gesendet?',
          answer: 'Nein. Erkennung und Effekt laufen in einem lokalen OpenCV-Prozess auf unserem eigenen Server, und die Datei wird nicht an externe KI-Anbieter weitergegeben.',
        },
        {
          question: 'Verbraucht das Unkenntlichmachen von Gesichtern mein tägliches KI-Kontingent?',
          answer: 'Ja. Jedes unkenntlich gemachte Foto ist ein KI-Auftrag: standardmäßig 3 pro Tag als Gast, 10 mit einem kostenlosen Konto. Es greift nie auf das Standardkontingent zu. Die Vorschau „Gesichter erkennen“ ist ratenbegrenzt, wird aber nicht gezählt. Ein fehlgeschlagener Auftrag wird zurückerstattet.',
        },
        {
          question: 'Was ist mit Kennzeichen, Namensschildern oder Text auf Bildschirmen?',
          answer: 'Das sind keine Gesichter und werden hier nicht erkannt. Verwenden Sie das Tool zum Schwärzen von Text für alles Lesbare oder den Objektentferner, um ein Kennzeichen oder ein Schild aus dem Bild zu löschen.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Jeder Auftrag verbraucht einen KI-Auftrag Ihres täglichen KI-Kontingents; das Dateigrößenlimit Ihres Tarifs wird im Formular angezeigt.',
        ],
      },
      related: [
        {
          label: 'Text im Bild schwärzen',
          to: '/tools/redact-text-in-image',
          description: 'Verbergen Sie E-Mail-Adressen, Telefonnummern und anderen lesbaren Text.',
        },
        {
          label: 'Objekt aus Foto entfernen',
          to: '/tools/remove-object-from-photo',
          description: 'Löschen Sie eine Person, ein Kennzeichen oder ein Schild vollständig.',
        },
        {
          label: 'EXIF-Metadaten entfernen',
          to: '/tools/remove-exif-metadata',
          description: 'Entfernen Sie GPS- und Kameradaten aus demselben Foto.',
        },
        {
          label: 'Bild komprimieren',
          to: '/tools/compress-image',
          description: 'Verkleinern Sie das anonymisierte Foto vor dem Posten.',
        },
        {
          label: 'Bildgröße ändern',
          to: '/tools/image-resizer',
          description: 'Skalieren Sie das Ergebnis auf die Größe, die eine Plattform verlangt.',
        },
      ],
      embed: {
        title: 'Gesichter in einem Foto unkenntlich machen',
        description: 'Laden Sie ein Foto hoch. „Gesichter weichzeichnen / verpixeln“ ist bereits gewählt und gesperrt. Wählen Sie den Stil, erkennen Sie optional Gesichter und wählen Sie aus, welche verdeckt werden, und konvertieren Sie dann.',
      },
    },
    'redact-text-in-image': {
      name: 'Text im Bild schwärzen',
      h1: 'Text und personenbezogene Daten in einem Bild schwärzen',
      tagline: 'Finden Sie lesbaren Text in einem Screenshot oder Foto und verdecken Sie persönliche Angaben oder allen Text mit einem Weichzeichner oder einem schwarzen Kasten.',
      metaTitle: 'Text in einem Bild online schwärzen | Media Manipulator',
      metaDescription: 'Finden Sie automatisch Text in einem Bild und schwärzen oder verwischen Sie Namen, E-Mail-Adressen, Nummern und andere personenbezogene Daten. KI auf unserer eigenen GPU. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ogTitle: 'Text und personenbezogene Daten in einem Bild schwärzen',
      ogDescription: 'Finden Sie Text in Screenshots und Fotos und verdecken Sie personenbezogene Daten oder allen Text mit einem Weichzeichner oder schwarzen Kasten.',
      intro: 'Screenshots verraten die Dinge, die ihre Besitzer nicht mehr wahrnehmen: eine E-Mail-Adresse in einer Kopfzeile, eine Kontonummer in einer Tabelle, eine Telefonnummer in einer Chatblase. Diese Seite liest jeden Textteil in einem Bild mit EasyOCR auf unserem eigenen Server und verdeckt die Treffer mit einem schwarzen Rechteck, einem Weichzeichner oder einem Pixelmosaik. Im Standardmodus verdeckt sie nur Text, der auf Muster personenbezogener Daten passt: E-Mail-Adressen, Telefonnummern, Nummern im Stil von Sozialversicherungsnummern, lange kartenähnliche Ziffernfolgen und Straßenadressen. Im Modus „Aller Text“ verdeckt sie jedes Wort, das sie lesen kann, was die sicherere Wahl ist, wenn Sie nicht vorhersagen können, was auf der Seite steht.',
      whatItDoes: [
        'Lässt EasyOCR über das gesamte Bild laufen, um Textrahmen und den Text darin zu finden, mit der GPU unseres Servers.',
        'Verdeckt im PII-Modus Rahmen, deren Text auf eines von fünf Mustern passt: E-Mail, Telefonnummer, Kennung mit 3-2-4 Ziffern, kartenähnliche Folge von 13 bis 19 Ziffern oder eine Straßenadresse, die auf Street, Avenue, Road, Drive, Lane, Boulevard, Way, Court, Circle oder Place endet.',
        'Verdeckt im Modus „Aller Text“ jeden erkannten Textrahmen unabhängig vom Inhalt.',
        'Erweitert jeden Rahmen um 8 Prozent seiner längeren Seite (mindestens 3 Pixel) und füllt ihn schwarz, verwischt ihn mit einem Kernel von einem Drittel seiner Größe oder verpixelt ihn in 12 Blöcke.',
        'Schreibt ein neues JPG, PNG oder WebP mit denselben Maßen und meldet, wie viele Schwärzungen vorgenommen wurden.',
      ],
      flowSteps: [
        {
          title: 'Bild hochladen',
          description: 'Ein Screenshot, ein gescanntes Formular oder ein Foto mit lesbarem Text, als JPG, PNG oder WebP.',
        },
        {
          title: 'Nur PII oder allen Text wählen',
          description: '„Text / PII schwärzen“ ist auf dieser Seite vorausgewählt und gesperrt; „Nur PII“ ist der Standard-Erkennungsmodus.',
        },
        {
          title: 'Schwarzen Kasten, Weichzeichner oder Verpixeln wählen',
          description: 'Der schwarze Kasten ist der Standard und der einzige unumkehrbare.',
        },
        {
          title: 'OCR und Schwärzung laufen',
          description: 'EasyOCR liest das Bild, jeder passende Rahmen wird erweitert und verdeckt, und das Ergebnis wird gespeichert.',
        },
        {
          title: 'Sorgfältig prüfen und herunterladen',
          description: 'Suchen Sie nach Text, den die OCR nicht gelesen hat, besonders kleinen, gedrehten oder handschriftlichen Text.',
        },
      ],
      advancedDetails: [
        'Der Server führt redact_text_pii.py mit --detect pii oder all-text, --redaction blackbox, blur oder pixelate und --gpu aus. Das Skript erstellt einen EasyOCR-Reader für Englisch (die einzige heute übergebene Sprache) und ruft readtext auf der Datei auf, was für jede Zeile einen Rahmen, den Text und eine Konfidenz zurückgibt.',
        'Die PII-Muster sind reguläre Ausdrücke: eine E-Mail (lokaler Teil, @, Domain mit Punkt und einer TLD aus mindestens 2 Buchstaben); eine nordamerikanische Telefonnummer mit 10 Ziffern und optional +1, Klammern, Punkten, Leerzeichen oder Bindestrichen; drei, zwei und vier Ziffern, durch Bindestrich oder Leerzeichen getrennt; 13 bis 19 Ziffern, optional durch Leerzeichen oder Bindestriche getrennt (Kartennummern); und eine Hausnummer gefolgt von einem Namen und einem Straßentyp-Wort. Es gibt kein Muster für Personennamen, Geburtsdaten oder Kennungen außerhalb der USA.',
        'Jeder passende Rahmen wird auf jeder Seite um max(3, 0,08 x die größere Seite aus Breite und Höhe) Pixel erweitert und auf das Bild begrenzt. Der schwarze Kasten verwendet cv2.rectangle mit gefülltem schwarzem Inneren; Verpixeln verkleinert den Bereich auf 12 Blöcke über die Breite und skaliert mit Nächster-Nachbar zurück; der Weichzeichner verwendet einen Gaußschen Kernel von max(11, längste Seite / 3), auf ungerade gebracht.',
        'OCR liest sauberen horizontalen Druck am besten. Handschrift, dekorative Schriften, sehr kleiner Text, starke Schräglage und geringer Kontrast senken die Konfidenz und können ganz übersehen werden. Der Modus „Aller Text“ repariert keine Zeile, die die OCR nie gesehen hat.',
        'Die Ausgabe wird von OpenCV geschrieben, und das exiftool-Rückkopieren des Konverters wird bei KI-Ausgaben übersprungen, die ursprünglichen EXIF-, GPS- und Kamera-Tags werden also nicht ins Ergebnis übernommen; die Pixel, nicht die Metadaten, sind der Zweck dieses Tools.',
        'Das Skript gibt redactions=N aus, wenn es fertig ist; ein Ergebnis von null bedeutet, dass die OCR keinen passenden Text gefunden hat, nicht, dass das Bild sauber war.',
      ],
      whyItMatters: [
        'Support-Tickets, Fehlerberichte und Social-Media-Beiträge enthalten routinemäßig Screenshots mit echten Kunden- oder Kontodaten.',
        'Text von Hand mit einem Zeichenwerkzeug zu verdecken übersieht Zeilen und hinterlässt ungleichmäßige Ergebnisse; eine Mustersuche findet die dritte E-Mail-Adresse, die Sie nicht mehr bemerkt haben.',
        'Ein deckendes Rechteck ist die einzige Schwärzung, die Schärfen, Kontraststreckung und Zoom überlebt.',
      ],
      useCases: [
        {
          title: 'Fehlerberichte und Support',
          description: 'Teilen Sie einen Screenshot, ohne E-Mail-Adressen, Telefonnummern oder Kartenziffern preiszugeben.',
        },
        {
          title: 'Gescannte Formulare',
          description: 'Verbergen Sie Kennungen und Adressen auf einer Seite, bevor Sie sie weiterleiten.',
        },
        {
          title: 'Chat-Screenshots',
          description: 'Entfernen Sie Telefonnummern und E-Mail-Adressen aus einer Unterhaltung, bevor Sie sie posten.',
        },
        {
          title: 'Schulungsmaterial',
          description: 'Verwandeln Sie eine echte Bildschirmaufnahme in ein sicheres Beispiel mit vollständig verdecktem Text.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein Support-Ticket-Screenshot mit 1440 x 900 im PII-Modus',
          body: 'Eingabe: ein PNG mit 400 KB und 1440 x 900, das einen Kundendatensatz mit zwei E-Mail-Adressen, einer als (555) 123-4567 geschriebenen Telefonnummer und einem Kundennamen zeigt. Einstellungen: Nur PII, schwarzer Kasten. EasyOCR liefert etwa 40 Textzeilen; drei davon passen auf die E-Mail- und Telefonmuster, der Name passt auf nichts. Jeder der drei Rahmen, etwa 260 x 22 Pixel für eine E-Mail, wird auf jeder Seite um 8 Prozent von 260, etwa 21 Pixel, erweitert und schwarz gefüllt, was ein Rechteck von 302 x 64 ergibt. Der Name bleibt sichtbar, weil es kein Namensmuster gibt; wechseln Sie zu „Aller Text“, wenn er ebenfalls weg muss. Die Ausgabe ist ein PNG mit 1440 x 900, und der Auftrag dauert wenige Sekunden, größtenteils für das Laden des OCR-Modells und das Lesen der Seite.',
        },
        {
          title: 'Ein Handyfoto mit 3024 x 4032 eines ausgefüllten Formulars im Modus „Aller Text“ mit Weichzeichner',
          body: 'Eingabe: ein JPEG-Foto eines gedruckten Formulars mit 2,1 MB, 3024 x 4032 Pixel, leicht schräg. Einstellungen: Aller Text, Weichzeichner. Jede Zeile, die EasyOCR liest, wird verdeckt: Ein getippter Feldwert mit 600 x 40 Pixeln wird um 48 Pixel pro Seite erweitert und mit einem Kernel von 201 px (600 / 3, auf ungerade gebracht) verwischt, was die Schrift bei dieser Größe vollständig entfernt; eine Beschriftung mit 120 x 30 erhält den Mindestkernel von 11 px, der bei dieser Größe Buchstabenformen noch erahnbar lässt, wählen Sie also für alles Sensible den schwarzen Kasten. Handschriftliche Einträge, die die OCR nicht lesen kann, bleiben wie sie waren und müssen mit dem Auge geprüft werden. Die Ausgabe ist ein JPG mit 3024 x 4032; OCR über ein Foto mit 12 Megapixeln ist der langsamste Schritt und dauert länger als bei einem Screenshot.',
        },
      ],
      whenNotToUse: 'Verwenden Sie dieses Tool nicht als einzige Absicherung bei einem Dokument, das vollständig geschwärzt werden muss; OCR arbeitet nach bestem Bemühen, liest heute nur englischen Druck, und die PII-Muster wissen nichts über Namen, Geburtsdaten oder Kennungen von außerhalb Nordamerikas. Verwenden Sie keinen Weichzeichner auf Text, den Sie veröffentlichen werden, da Textunschärfe die am leichtesten umkehrbare Schwärzung ist; verwenden Sie den schwarzen Kasten. Gesichter, Logos und Fotos sind kein Text und werden nicht angetastet; das Tool zum Unkenntlichmachen von Gesichtern und der Objektentferner kümmern sich darum. Und wenn die sensiblen Daten in den Dateimetadaten statt in den Pixeln stecken, ist das EXIF-Tool der richtige Ort.',
      whyMediaManipulator: [
        'Die fünf PII-Muster, die Erweiterung und die Kernelgrößen sind ausgeschrieben, sodass Sie genau wissen, welcher Text erfasst wird und wie er verdeckt wird.',
        'OCR und Schwärzung laufen in einem lokalen Prozess auf unserer eigenen GPU; Screenshots voller Kundendaten verlassen unsere Hardware nie.',
        'Die Textschwärzung verbraucht einen KI-Auftrag (standardmäßig 3 pro Tag ohne Konto, 10 mit einem kostenlosen Konto), der auf das KI-Kontingent und nicht auf das Standardkontingent angerechnet wird, und ein fehlgeschlagener Auftrag wird zurückerstattet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ],
      privacyNote: 'Texterkennung und Schwärzung laufen als lokaler EasyOCR- und OpenCV-Prozess auf unserem eigenen GPU-Server; kein externer OCR- oder KI-Dienst erhält das Bild, und der erkannte Text wird nur verwendet, um zu entscheiden, welche Rahmen verdeckt werden, und nicht gespeichert. Der Upload liegt in uploads/<jobId>/ und das geschwärzte Bild in outputs/<jobId>/, beide im Aufbewahrungsregister eingetragen und gelöscht, wenn die Frist endet. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre. Wie jeder Standard-Bild-Upload durchläuft die Datei außerdem unsere automatisierte Inhaltsanalyse auf demselben Server, wo ein lokales Bildmodell eine kurze Beschreibung schreibt, die beim Auftrag aufbewahrt und nicht an Dritte weitergegeben wird.',
      faq: [
        {
          question: 'Welche personenbezogenen Daten erkennt der PII-Modus?',
          answer: 'Text, der auf fünf Muster passt: E-Mail-Adressen, nordamerikanische Telefonnummern, Kennungen mit 3-2-4 Ziffern, kartenähnliche Folgen von 13 bis 19 Ziffern und Straßenadressen, die auf ein Wort wie Street, Avenue oder Road enden. Namen, Daten und Kennungen außerhalb der USA werden nicht erfasst; verwenden Sie dafür „Aller Text“.',
        },
        {
          question: 'Wann sollte ich „Aller Text“ statt „Nur PII“ verwenden?',
          answer: 'Immer, wenn Sie nicht im Voraus auflisten können, was sensibel ist: Formulare, Tabellen, Chatverläufe mit Namen. „Aller Text“ verdeckt jede Zeile, die die OCR liest, das einzige verbleibende Risiko ist also Text, den die OCR nicht lesen konnte.',
        },
        {
          question: 'Liest das Tool andere Sprachen als Englisch?',
          answer: 'Heute nicht. Der OCR-Reader wird nur für Englisch gestartet, Text in lateinischer Schrift wird also einigermaßen gelesen, andere Schriften können aber übersehen oder falsch gelesen werden. Prüfen Sie die Ausgabe, wenn die Seite nicht auf Englisch ist.',
        },
        {
          question: 'Ist ein schwarzer Kasten hier sicherer als Weichzeichner oder Verpixeln?',
          answer: 'Ja. Der Kasten wird mit deckendem Schwarz gefüllt, es bleibt also nichts übrig. Der Weichzeichner verwendet einen Kernel von einem Drittel der Rahmengröße mit einem Minimum von 11 px, und Verpixeln lässt 12 Blöcke über die Breite; beide können kurzen Text erahnbar lassen. Wählen Sie den schwarzen Kasten für alles, was Sie veröffentlichen.',
        },
        {
          question: 'Entfernt die Schwärzung die versteckten Metadaten in meinem Foto?',
          answer: 'Das Ergebnis wird von OpenCV neu geschrieben, ohne die ursprünglichen Tags zu kopieren, EXIF- und GPS-Daten werden also nicht übernommen. Für ein gezieltes, nachprüfbares Entfernen bei einer Datei, die Sie sonst nicht bearbeiten, verwenden Sie das EXIF-Metadaten-Tool.',
        },
        {
          question: 'Warum blieb mancher Text sichtbar?',
          answer: 'Entweder hat die OCR ihn nicht gelesen (Handschrift, winziger Druck, Schräglage, geringer Kontrast) oder er passte im PII-Modus auf kein Muster. Der Server meldet, wie viele Rahmen er verdeckt hat; null bedeutet, dass nichts gepasst hat, nicht, dass nichts da war.',
        },
        {
          question: 'Ist das Schwärzen von Text kostenlos, und was zählt gegen mein Kontingent?',
          answer: 'Ja. Es ist ein KI-Auftrag, standardmäßig 3 pro Tag ohne Konto und 10 mit einem kostenlosen Konto, bei Bildern bis 200 MB bzw. 1 GB. Es verbraucht ausschließlich das KI-Kontingent, nie das Standardkontingent. Die Preisseite hat die aktuellen Zahlen.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Jeder Auftrag verbraucht einen KI-Auftrag Ihres täglichen KI-Kontingents; das Dateigrößenlimit Ihres Tarifs wird im Formular angezeigt.',
        ],
      },
      related: [
        {
          label: 'Gesichter im Foto unkenntlich machen',
          to: '/tools/blur-faces-in-photo',
          description: 'Verbergen Sie die Personen im selben Bild.',
        },
        {
          label: 'EXIF-Metadaten entfernen',
          to: '/tools/remove-exif-metadata',
          description: 'Entfernen Sie versteckte Standort- und Gerätedaten.',
        },
        {
          label: 'KI-Dokumentenscan',
          to: '/tools/ai-document-scan',
          description: 'Verwandeln Sie eine fotografierte Seite in ein sauberes, durchsuchbares PDF.',
        },
        {
          label: 'Objekt aus Foto entfernen',
          to: '/tools/remove-object-from-photo',
          description: 'Löschen Sie ein Logo, Kennzeichen oder Abzeichen, das kein Text ist.',
        },
        {
          label: 'Bild komprimieren',
          to: '/tools/compress-image',
          description: 'Verkleinern Sie den geschwärzten Screenshot vor dem Anhängen.',
        },
      ],
      embed: {
        title: 'Text in einem Bild schwärzen',
        description: 'Laden Sie einen Screenshot oder ein Foto hoch. „Text / PII schwärzen“ ist bereits gewählt und gesperrt. Wählen Sie, ob personenbezogene Daten oder aller Text verdeckt werden sollen, sowie den Schwärzungsstil, und konvertieren Sie dann.',
      },
    },
    'remove-object-from-photo': {
      name: 'Objekt aus Foto entfernen',
      h1: 'Ein Objekt online aus einem Foto entfernen',
      tagline: 'Ziehen Sie einen Rahmen um etwas, das Sie nicht im Bild haben wollen, und ein Inpainting-Modell füllt die Lücke mit passendem Hintergrund.',
      metaTitle: 'Ein Objekt online aus einem Foto entfernen | Media Manipulator',
      metaDescription: 'Löschen Sie unerwünschte Objekte aus einem Foto. Ziehen Sie ein Rechteck, und KI-Inpainting füllt die Fläche passend zum Hintergrund. Läuft auf unserer eigenen GPU. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ogTitle: 'Ein Objekt online aus einem Foto entfernen',
      ogDescription: 'Ziehen Sie einen Rahmen über ein unerwünschtes Objekt, und KI-Inpainting füllt die Fläche mit passendem Hintergrund.',
      intro: 'Laden Sie ein Foto hoch, ziehen Sie ein oder mehrere Rechtecke über die Dinge, die verschwinden sollen, und konvertieren Sie. Das Formular sendet jedes Rechteck als Bruchteile des Bildes (links, oben, Breite und Höhe zwischen 0 und 1), und unsere API macht daraus eine Maske: ein Graustufen-PNG in der Größe Ihres Fotos, weiß innerhalb der Rechtecke und schwarz überall sonst. Ein Python-Skript öffnet dann Bild und Maske und führt das LaMa-Inpainting-Modell aus dem Paket simple_lama_inpainting auf unserer GPU aus, das die weißen Bereiche anhand der umgebenden Szene neu malt. Sie erhalten das Foto in voller Größe im gewählten Format zurück, mit gefüllten markierten Bereichen.',
      whatItDoes: [
        'Akzeptiert ein oder mehrere auf der Vorschau gezogene Rechtecke und entfernt, was darin liegt.',
        'Erstellt auf dem Server aus den normalisierten Rechteckkoordinaten eine pixelgenaue Maske, sodass die Maske nicht von Ihrer Bildschirmgröße abhängt.',
        'Führt LaMa-Inpainting auf einer von uns betriebenen GPU aus und füllt die maskierten Bereiche mit Inhalt, der den Hintergrund fortsetzt.',
        'Liefert das Bild in voller Auflösung als JPG, PNG, WebP oder GIF, wie im Formular gewählt.',
        'Zählt als ein KI-Auftrag auf das tägliche KI-Kontingent; einfache Konvertierungen nutzen ein anderes, separates Kontingent.',
      ],
      flowSteps: [
        {
          title: 'Foto hochladen',
          description: 'JPG, PNG oder WebP. Die Vorschau erscheint mit einer Zeichenebene.',
        },
        {
          title: 'Rechtecke ziehen',
          description: 'Ein Rahmen pro Objekt, etwas größer als das Objekt selbst. Mindestens ein Rahmen ist erforderlich.',
        },
        {
          title: 'Maskieren und inpainten',
          description: 'Der Server schreibt ein Masken-PNG gleicher Größe und führt dann remove_object_lama.py mit Bild und Maske aus.',
        },
        {
          title: 'Herunterladen und prüfen',
          description: 'Zoomen Sie in die gefüllten Bereiche, um die Nahtstellen zu prüfen, bevor Sie das Bild verwenden.',
        },
      ],
      advancedDetails: [
        'Der Handler ist RemoveObject in ai_tools.go. Er liest die Bildmaße mit ImageMagick identify, rastert die Rechtecke in eine Graustufen-PNG-Maske im temporären Verzeichnis des Servers (innen weiß, außen schwarz, Koordinaten auf ganze Pixel gerundet und auf das Bild begrenzt), führt das Skript aus und löscht die Maske danach.',
        'remove_object_lama.py öffnet das Bild mit Pillow und wandelt es in RGB um, lädt die Maske als Graustufen, passt die Maske an das Bild an, wenn die Größen abweichen, ruft SimpleLama(image, mask) auf und speichert das Ergebnis im Ausgabepfad. Wegen der RGB-Umwandlung verliert eine transparente PNG-Eingabe ihren Alphakanal.',
        'Jedes Rechteck wird serverseitig geprüft: Breite und Höhe müssen positiv sein, und der Rahmen muss auf beiden Achsen innerhalb von 0 bis 1 liegen, sonst wird der Auftrag vor dem Start abgelehnt und der Vorgang zurückerstattet.',
        'Der KI-Pfad überspringt die ImageMagick-Stufe, Filter, Tönung, Textüberlagerung, Qualitäts- und Größeneinstellungen gelten also nicht, und das exiftool-Kopieren der Metadaten läuft nicht; das Ergebnis trägt kein EXIF des Originals. Pillow speichert die Datei mit seinen eigenen Standard-Encoder-Einstellungen für das gewählte Format.',
        'LaMa füllt aus dem Kontext, die Qualität der Füllung hängt also davon ab, was den Rahmen umgibt. Himmel, Gras, Sand, Wasser, Wände und Böden liefern überzeugende Ergebnisse; ein Rahmen, der ein Gesicht, Text oder ein regelmäßiges Muster durchschneidet, zwingt das Modell, Struktur zu erfinden, die es nicht kennen kann.',
      ],
      whyItMatters: [
        'Eine Retusche mit dem Kopierstempel über strukturiertem Hintergrund braucht Übung und Zeit; ein Rechteck braucht zwei Sekunden.',
        'Eine einzelne störende Person, ein Kabel oder ein Schild kann das Einzige sein, was zwischen einer brauchbaren Aufnahme und einem Neudreh steht.',
        'Es dient zugleich als Datenschutzwerkzeug für Hausnummern, Kennzeichen und Bildschirme, die nicht in einem geteilten Foto sein sollten.',
      ],
      useCases: [
        {
          title: 'Reise und Landschaft',
          description: 'Entfernen Sie einen Touristen, ein Kabel oder einen Mülleimer aus einer sonst sauberen Ansicht.',
        },
        {
          title: 'Produktfotos',
          description: 'Löschen Sie ein Preisschild, einen Ständer oder ein Staubkorn aus einem Angebotsbild.',
        },
        {
          title: 'Immobilien',
          description: 'Entfernen Sie ein Auto, eine Mülltonne oder Unordnung vom Bildrand.',
        },
        {
          title: 'Datenschutz',
          description: 'Übermalen Sie eine Hausnummer, ein Kennzeichen oder einen sichtbaren Monitor.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein Rechteck auf einem Strandfoto mit 4000 x 3000',
          body: 'Eingabe: ein JPEG mit 5,2 MB und 4000 x 3000 mit einer Person an der Wasserlinie. Ziehen Sie einen Rahmen, der bei 60% quer und 40% nach unten beginnt, 10% breit und 15% hoch, und behalten Sie JPG als Ausgabe. Die API multipliziert diese Bruchteile mit der Bildgröße und schreibt eine Maske mit 4000 x 3000 mit einem weißen Block von 400 x 450 Pixeln bei (2400, 1200). LaMa läuft einmal über Bild und Maske auf der GPU, und das Skript speichert ein JPG mit 4000 x 3000, in dem die 180.000 maskierten Pixel aus dem umgebenden Sand und Wasser gefüllt sind. Der Modelldurchlauf auf einem Bild mit 12 Megapixeln dauert auf der GPU Sekunden; das Schreiben und Herunterladen eines mehrere Megabyte großen JPG ist ein vergleichbarer Anteil der Gesamtzeit.',
        },
        {
          title: 'Zwei Rechtecke auf einer PNG-Produktaufnahme mit 1920 x 1080',
          body: 'Eingabe: ein PNG mit 2,3 MB und 1920 x 1080 von einer Lampe auf einem Tisch mit einem Kabel und einem Preisaufkleber. Ziehen Sie zwei Rahmen: einen über das Kabel (etwa 5% mal 30%) und einen über den Aufkleber (etwa 8% mal 6%). Beide werden in dieselbe Maske mit 1920 x 1080 gerastert, ein einziger Inpainting-Durchgang behandelt also beide Bereiche. Wählen Sie PNG als Ausgabe, um JPEG-Artefakte in den gefüllten Bereichen zu vermeiden; das Ergebnis ist ein PNG mit 1920 x 1080, deckendes RGB, weil Pillow die Eingabe vor dem Inpainting in RGB umwandelt. Bei 2 Megapixeln ist der GPU-Durchgang schnell, und der größte Teil der Gesamtzeit entfällt auf den Upload und das Schreiben des PNG.',
        },
      ],
      whenNotToUse: 'Verwenden Sie Inpainting nicht bei einem Objekt, das einen großen Teil des Bildes einnimmt, vor einem Gesicht liegt, lesbaren Text überlappt oder ein regelmäßiges Muster wie Ziegel, Fliesen oder eine Tastatur unterbricht: Das Modell muss Struktur erfinden, und das Ergebnis wirkt verschmiert oder repetitiv. Es ist auch das falsche Tool, wenn Sie ein transparentes PNG unverändert behalten wollen, da das Skript die Eingabe auf RGB reduziert, und wenn die Bearbeitung forensisch ehrlich sein muss, weil der gefüllte Bereich generierter Inhalt ist. Für den Austausch des gesamten Hintergrunds verwenden Sie den Hintergrundentferner; für Gesichter, die nur verborgen werden müssen, ist das Tool zum Unkenntlichmachen von Gesichtern besser geeignet.',
      whyMediaManipulator: [
        'Die Maske wird auf dem Server aus exakten Bruchteilen erstellt, sodass das, was Sie auf einer Handy-Vorschau zeichnen, auf dieselben Pixel abgebildet wird wie auf dem Desktop.',
        'Das Modell ist benannt (LaMa über simple_lama_inpainting), und das Format- und Alpha-Verhalten ist dokumentiert statt dem Raten überlassen.',
        'Läuft auf unserer eigenen GPU; das Standardtool braucht kein Konto. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ],
      privacyNote: 'Ihr Foto wird unter uploads/<jobId>/ auf unserem Server gespeichert; die Rechteckmaske wird als temporäres PNG im temporären Verzeichnis des Servers geschrieben und gelöscht, sobald das Inpainting-Skript fertig ist; das gefüllte Bild geht nach outputs/<jobId>/. Die Rechteckkoordinaten werden in den Auftragsoptionen behalten, damit über den Auftrag berichtet werden kann. LaMa läuft auf einer GPU in derselben Maschine, und kein Teil des Bildes geht an einen externen Anbieter. Jeder Bild-Upload, auch dieser, wird außerdem einmal von einem automatisierten Analyseschritt auf unserem Server mit einem lokalen Bildmodell zusammengefasst, und diese Zusammenfassung bleibt beim Auftrag. Die Ausgabe trägt kein EXIF, weil KI-Operationen das Kopieren der Metadaten überspringen. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      faq: [
        {
          question: 'Ist das Entfernen von Objekten kostenlos?',
          answer: 'Ja, innerhalb des täglichen KI-Kontingents. Jedes Entfernen verbraucht einen KI-Auftrag: standardmäßig 3 pro Tag für Gäste und 10 mit einem kostenlosen Konto, mit Grenzen von 200 MB und 1 GB pro Datei; 100 und 200 bei Premium und Pro. Ihr Standardkontingent für Konvertierungen ist davon getrennt und bleibt, wie es war. Die geltenden Zahlen stehen auf /pricing.',
        },
        {
          question: 'Wie genau muss das Rechteck sein?',
          answer: 'Nicht sehr. Die Maske ist das gezogene Rechteck, auf ganze Pixel gerundet, nehmen Sie also etwas Hintergrund um das Objekt und seinen Schatten mit. Das Modell blendet den zusätzlichen Rand ein.',
        },
        {
          question: 'Kann ich mehrere Objekte auf einmal entfernen?',
          answer: 'Ja. Jedes gezogene Rechteck wird in dieselbe Maske gemalt, und alle werden in einem Durchgang gefüllt. Mindestens ein Rechteck ist erforderlich, sonst wird der Auftrag abgelehnt.',
        },
        {
          question: 'Warum sieht der gefüllte Bereich unscharf oder wiederholt aus?',
          answer: 'LaMa füllt aus den Pixeln rund um den Rahmen. Ein Rahmen über feinen Details oder einem regelmäßigen Muster lässt es raten. Versuchen Sie einen engeren Rahmen, entfernen Sie ein Objekt nach dem anderen oder wählen Sie eine Aufnahme, bei der der Hintergrund hinter dem Objekt einfacher ist.',
        },
        {
          question: 'In welchem Format kommt das Ergebnis?',
          answer: 'In dem, das Sie im Formular gewählt haben: JPG, PNG, WebP oder GIF. Die Eingabe wird vor dem Inpainting in RGB umgewandelt, Transparenz bleibt also nicht erhalten. PNG vermeidet JPEG-Artefakte in den gefüllten Bereichen.',
        },
        {
          question: 'Behält das Ergebnis meine EXIF-Daten?',
          answer: 'Nein. Der KI-Pfad überspringt das exiftool-Kopieren, das der normale Konverter ausführt, und Pillow schreibt eine neue Datei, es werden also keine Kamera-, Datums- oder GPS-Tags übernommen.',
        },
        {
          question: 'Wird die Maske oder mein Foto irgendwo anders hingeschickt?',
          answer: 'Nein. Die Maske ist eine temporäre Datei auf unserem Server, die nach dem Lauf gelöscht wird, und das Inpainting-Modell läuft auf unserer eigenen GPU.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Jeder Auftrag verbraucht einen KI-Auftrag Ihres täglichen KI-Kontingents; das Dateigrößenlimit Ihres Tarifs wird im Formular angezeigt.',
        ],
      },
      related: [
        {
          label: 'Hintergrund aus Bild entfernen',
          to: '/tools/remove-background-from-image',
          description: 'Schneiden Sie das Motiv vollständig aus, statt einen Bereich auszubessern.',
        },
        {
          label: 'Gesichter im Foto unkenntlich machen',
          to: '/tools/blur-faces-in-photo',
          description: 'Verbergen Sie Personen, ohne Hintergrund zu erfinden.',
        },
        {
          label: 'Text im Bild schwärzen',
          to: '/tools/redact-text-in-image',
          description: 'Schwärzen Sie Text, den die OCR finden kann, statt ihn zu inpainten.',
        },
        {
          label: 'KI-Bildrestaurierung',
          to: '/tools/ai-image-restoration',
          description: 'Bereinigen Sie Rauschen und Kompression rund um die Reparatur.',
        },
        {
          label: 'Bild komprimieren',
          to: '/tools/compress-image',
          description: 'Verkleinern Sie das fertige Foto zum Teilen.',
        },
      ],
      embed: {
        title: 'Ein Objekt aus einem Foto entfernen',
        description: 'Laden Sie ein Foto hoch. „Objekt entfernen“ ist bereits gewählt und gesperrt. Ziehen Sie ein oder mehrere Rechtecke über das, was verschwinden soll, und konvertieren Sie dann.',
      },
    },
    'clean-voice-audio': {
      name: 'Sprachaufnahme säubern',
      h1: 'Sprachaufnahmen mit KI säubern',
      tagline: 'Machen Sie Sprache klarer, indem Sie Rauschen, Raumklang und Rumpeln in Podcasts, Interviews und Sprachmemos reduzieren.',
      metaTitle: 'Sprachaufnahmen mit KI säubern | Media Manipulator',
      metaDescription: 'Säubern Sie eine Sprachaufnahme mit KI. Reduzieren Sie Rauschen, Brummen und Raumgeräusche, damit Sprache leichter zu hören ist. Läuft auf unserer eigenen GPU. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ogTitle: 'Sprachaufnahmen mit KI säubern',
      ogDescription: 'Reduzieren Sie Rauschen, Brummen und Raumgeräusche, damit Sprache in Podcasts, Interviews und Sprachmemos klarer wird.',
      intro: 'Ein Sprachmemo vom Telefon in einer hallenden Küche, ein Podcast-Gast am Laptop-Mikrofon, eine Vorlesung aus der letzten Reihe aufgenommen: Die Wörter sind da, aber sie liegen unter Rauschen und Raumklang. „Stimme säubern“ lässt die Aufnahme durch DeepFilterNet auf unserer GPU laufen und dann durch eine feste Nachbearbeitungskette im Broadcast-Stil, die Rumpeln beschneidet, die Höhen begrenzt, den Pegel auf eine gleichmäßige Lautheit bringt und Spitzen vor dem Übersteuern bewahrt. Sie ist für Sprache gebaut, nicht für Musik.',
      whatItDoes: [
        'Wandelt Ihren Upload mit ffmpeg in Mono mit 48 kHz um, die Eingabe, die DeepFilterNet erwartet, und übergibt dieses WAV an das Modell auf unserer GPU.',
        'Unterdrückt gleichmäßige Hintergrundgeräusche (Rauschen, Lüfter, Brummen, Raumklang) und behält dabei die Sprache, mit dem Verbesserungsnetz von DeepFilterNet.',
        'Wendet nach dem Entrauschen eine Nachbearbeitungskette an: einen Hochpass bei 80 Hz, einen Tiefpass bei 14 kHz, Lautheitsnormalisierung auf -16 LUFS mit einer True-Peak-Obergrenze von -1,5 dBTP und einen Limiter bei 0,95.',
        'Kodiert das Ergebnis im gewählten Format: MP3, AAC oder OGG mit 192 kbps, Opus mit 128 kbps, FLAC oder 16-Bit-WAV.',
        'Überspringt die üblichen Regler für Bitrate, EQ, Effekte und Trimmen, da der KI-Pfad die normale ffmpeg-Filterpipeline ersetzt.',
      ],
      flowSteps: [
        {
          title: 'Aufnahme hochladen',
          description: 'Sprachmemos, Interview-Audio, Podcast-Takes oder Vorlesungsmitschnitte als MP3, WAV, FLAC, M4A, AAC, OGG oder Opus.',
        },
        {
          title: '„Stimme säubern“ ist voreingestellt',
          description: 'Die Operation ist auf dieser Seite fest; die einzige verbleibende Wahl ist das Ausgabeformat.',
        },
        {
          title: 'Normalisieren, entrauschen, nachbearbeiten',
          description: 'ffmpeg erzeugt ein Mono-WAV mit 48 kHz, DeepFilterNet entrauscht es, und die Nachbearbeitungsfilter setzen Klang und Lautheit.',
        },
        {
          title: 'Herunterladen und anhören',
          description: 'Vergleichen Sie mit dem Original über Kopfhörer, bevor Sie es veröffentlichen.',
        },
      ],
      advancedDetails: [
        'Die Nachbearbeitungskette ist genau highpass=f=80,lowpass=f=14000,loudnorm=I=-16:TP=-1.5:LRA=11,alimiter=limit=0.95, einmal auf das entrauschte WAV angewendet. Der Hochpass entfernt Griffgeräusche und Plosiv-Pumpen, der Tiefpass zähmt Rauschen über 14 kHz, und loudnorm bringt die integrierte Lautheit auf -16 LUFS, das übliche Ziel für Sprach-Podcasts.',
        'Die Ausgabe ist immer Mono mit 48 kHz, weil das Modell auf einem einzelnen Kanal läuft. Ein Stereo-Interview bleibt verständlich, verliert aber seine Links-rechts-Platzierung; wenn Sie Stereo brauchen, ist dies das falsche Tool.',
        'Die Encoder-Einstellungen ergeben sich aus der Ausgabeendung: libmp3lame mit 192 kbps für MP3, aac mit 192 kbps für AAC oder M4A, libvorbis mit 192 kbps für OGG, libopus mit 128 kbps für Opus, flac für FLAC und pcm_s16le für WAV. Auf dem KI-Pfad gibt es keine Bitratenauswahl.',
        'Trimmbereiche und die üblichen Effekte werden ignoriert, wenn eine KI-Operation gewählt ist; der Konverter leitet die Datei direkt an das Modell und gibt sie zurück. Trimmen Sie die Aufnahme zuerst, wenn nur ein Teil gesäubert werden soll.',
        'Ein zweiter Durchlauf durch „Stimme säubern“ normalisiert Audio neu, das bereits bei -16 LUFS liegt, und kann Konsonanten eine wässrige Qualität geben. Führen Sie es einmal aus.',
        'Das Modell hat Mühe mit konkurrierenden Stimmen, Musikbetten und plötzlichen lauten Ereignissen; das sind keine „gleichmäßigen Hintergrundgeräusche“ und bleiben weitgehend erhalten.',
      ],
      whyItMatters: [
        'Zuhörer brechen eine Aufnahme ab, die anstrengend zu hören ist, selbst wenn das Gesagte hörenswert ist.',
        'Ein gleichmäßiger Pegel von -16 LUFS bedeutet, dass eine Folge ohne manuelle Pegelanpassung so laut spielt wie die um sie herum.',
        'Sprache, die aus dem Rauschen gehoben wurde, wird auch genauer transkribiert, Säubern verbessert also auch Untertitel.',
      ],
      useCases: [
        {
          title: 'Podcasts und Interviews',
          description: 'Bringen Sie einen entfernt mit einfachem Mikrofon aufgenommenen Gast in Ordnung und auf dieselbe Lautheit wie den Moderator.',
        },
        {
          title: 'Sprachmemos und Diktate',
          description: 'Machen Sie eine Handyaufnahme später verständlich und laut genug, um sie ohne Kopfhörer zu hören.',
        },
        {
          title: 'Vorlesungen und Meetings',
          description: 'Senken Sie das Brummen der Klimaanlage und den Projektorlüfter in einer Aufnahme aus der letzten Reihe.',
        },
        {
          title: 'Sprecherstimme für ein Video',
          description: 'Bearbeiten Sie ein Voice-over nach, bevor Sie es im Darkroom-Editor platzieren.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein 12-minütiges Handymemo (M4A, 128 kbps, etwa 11 MB) zu MP3',
          body: 'Eine AAC-Datei mit 128 kbps sind 16 KB pro Sekunde, 720 Sekunden sind also etwa 11,5 MB. Zwölf Minuten liegen über dem Gastlimit von 5 Minuten, dafür braucht es also ein kostenloses Konto (20 Minuten). ffmpeg schreibt zuerst ein Mono-WAV mit 48 kHz und etwa 69 MB (96.000 Bytes pro Sekunde) in einen temporären Ordner, der am Ende des Auftrags entfernt wird. DeepFilterNet und die Nachbearbeitungskette laufen darauf, und der MP3-Encoder schreibt das Ergebnis mit 192 kbps: etwa 17 MB, also größer als die Eingabe, weil 192 kbps eine höhere Rate ist, als das Memo aufgenommen wurde. Die beiden ffmpeg-Schritte dauern Sekunden; der DeepFilterNet-Durchlauf dominiert und wächst mit der Länge der Aufnahme.',
        },
        {
          title: 'Ein 4-minütiges Stereo-WAV-Interview (44,1 kHz, 16 Bit, etwa 42 MB) zu WAV',
          body: 'Stereo-PCM mit 16 Bit und 44,1 kHz sind 176.400 Bytes pro Sekunde, 240 Sekunden sind also etwa 42 MB, innerhalb der Gastlimits von 200 MB und 5 Minuten. Die Datei wird auf Mono zusammengelegt und auf 48 kHz neu abgetastet, bevor das Modell läuft, und das gesäuberte WAV kommt als 16-Bit-Mono mit 48 kHz zurück: 96.000 Bytes pro Sekunde, etwa 23 MB. Es ist nur deshalb kleiner als die Eingabe, weil es einen Kanal statt zwei hat. Die Wahl von FLAC behält dieselben Samples verlustfrei auf weniger Platz; die Wahl von MP3 ergibt etwa 5,8 MB bei 192 kbps.',
        },
      ],
      whenNotToUse: 'Lassen Sie dieses Tool bei Musik, Gesang oder allem aus, wo der Hintergrund Teil des Klangs ist, den Sie behalten möchten: Das Modell behandelt alles, was keine Sprache ist, als Rauschen, und die Nachbearbeitungskette schneidet unter 80 Hz und über 14 kHz ab, was Instrumente aushöhlt. Es ist auch die falsche Wahl, wenn Sie Stereo behalten müssen, wenn die Aufnahme übersteuert oder verzerrt ist (dieser Schaden ist kein Rauschen und lässt sich nicht herausfiltern) oder wenn Sie nur das Rauschen senken möchten, ohne Pegel oder Klang zu ändern, was stattdessen die Seite „Hintergrundgeräusche entfernen“ tut.',
      whyMediaManipulator: [
        'DeepFilterNet und die Nachbearbeitungskette laufen auf einer GPU, die wir betreiben; die Aufnahme wird nicht an einen externen Sprachverbesserungsdienst gesendet.',
        'Die Seite öffnet mit bereits gewähltem „Stimme säubern“ und ausgeblendetem Operationsmenü, die einzige Entscheidung ist also das Ausgabeformat.',
        'Ein Säuberungsauftrag ist ein Standardauftrag Ihres Tageskontingents (standardmäßig 5 als Gast, 30 mit einem kostenlosen Konto), kein KI-Auftrag, und ein fehlgeschlagener Auftrag erstattet ihn zurück.',
      ],
      privacyNote: 'Ihre Aufnahme wird in ihrem Auftragsordner gespeichert, von ffmpeg in ein temporäres Mono-WAV mit 48 kHz in einem Arbeitsverzeichnis umgewandelt und an DeepFilterNet auf unserer eigenen GPU übergeben; dieses Arbeitsverzeichnis wird gelöscht, sobald die gesäuberte Datei kodiert ist. Die gesäuberte Ausgabe bleibt zum Download beim Auftrag. Audio-Uploads durchlaufen außerdem einen automatisierten Analysedurchlauf auf unserem Server, der die Aufnahme mit Whisper für eine interne Inhaltsprüfung transkribiert und dieses Ergebnis beim Auftrag aufbewahrt. Kein externer KI-Anbieter erhält die Datei. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      faq: [
        {
          question: 'Warum kommt die gesäuberte Datei in Mono heraus?',
          answer: 'Die Pipeline wandelt jede Eingabe vor dem Lauf von DeepFilterNet in einen Kanal mit 48 kHz um und kodiert die Modellausgabe, wie sie ist. Eine Stereoaufnahme kommt daher als Mono zurück. Bei einem Interview mit zwei Mikrofonen teilen Sie zuerst die Kanäle und säubern jeden separat, wenn Sie die Trennung behalten müssen.',
        },
        {
          question: 'Auf welche Lautheit normalisiert „Stimme säubern“?',
          answer: 'Die Nachbearbeitungskette verwendet ffmpeg loudnorm mit einem integrierten Ziel von -16 LUFS, einer True-Peak-Obergrenze von -1,5 dBTP und einem Lautheitsumfang von 11 LU, gefolgt von einem Limiter bei 0,95. Das entspricht gängigen Zielwerten für Sprachinhalte, eine hier gesäuberte Folge liegt also auf einem ähnlichen Pegel wie professionell gemasterte Podcasts.',
        },
        {
          question: 'Kann ich auf dieser Seite die Bitrate einstellen oder die Datei trimmen?',
          answer: 'Nein. Wenn eine KI-Operation aktiv ist, leitet der Konverter direkt an das Modell und ignoriert die Einstellungen für Bitrate, EQ, Effekte und Trimmen. Die Ausgaberate ist durch das Format festgelegt: 192 kbps für MP3, AAC und OGG, 128 kbps für Opus. Trimmen Sie die Aufnahme zuerst mit einem anderen Tool, wenn Sie nur einen Teil davon möchten.',
        },
        {
          question: 'Wie unterscheidet sich das von „Hintergrundgeräusche entfernen“?',
          answer: 'Beide führen dasselbe DeepFilterNet-Modell aus. „Stimme säubern“ fügt danach Hochpass, Tiefpass, Lautheitsnormalisierung und Limiter hinzu; „Hintergrundgeräusche entfernen“ hört beim entrauschten Signal auf und lässt Ihre Pegel und Ihren Klang in Ruhe. Wählen Sie „Stimme säubern“ für eine fertige Sprachdatei und die andere Seite, wenn Sie selbst mischen oder mastern wollen.',
        },
        {
          question: 'Kann es eine übersteuerte oder verzerrte Aufnahme reparieren?',
          answer: 'Nein. Übersteuerung ist fehlende Wellenform, kein hinzugefügtes Rauschen, und das Modell hat nichts abzuziehen. Es kann trotzdem das Rauschen rund um einen verzerrten Take senken, aber das Knirschen auf lauten Silben bleibt.',
        },
        {
          question: 'Wie viele Aufnahmen kann ich pro Tag säubern, und ist es kostenlos?',
          answer: '„Stimme säubern“ zählt bewusst als Standardauftrag und verbraucht daher einen Auftrag aus dem Standardkontingent: standardmäßig 5 pro Tag als Gast, 30 mit einem kostenlosen Konto, 300 bei Premium und 700 bei Pro, mit Dateigrenzen von 200 MB, 1 GB und 5 GB und Längengrenzen von 5 Minuten, 20 Minuten und 2 Stunden. Die aktuelle Tabelle steht auf /pricing.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '„Stimme säubern“ nutzt das Standardkontingent; die Längenlimits hängen von Ihrem Tarif ab und werden live im Formular angezeigt.',
        ],
      },
      related: [
        {
          label: 'Hintergrundgeräusche entfernen',
          to: '/tools/remove-background-noise',
          description: 'Derselbe Entrauscher ohne die Nachbearbeitung von Lautheit und Klang.',
        },
        {
          label: 'Video transkribieren',
          to: '/tools/transcribe-video',
          description: 'Verwandeln Sie die gesäuberte Sprache in Untertitel oder Text.',
        },
        {
          label: 'Audio aus Video extrahieren',
          to: '/tools/extract-audio-from-video',
          description: 'Ziehen Sie die Sprachspur aus einem Video, bevor Sie sie säubern.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Platzieren Sie die nachbearbeitete Sprecherstimme auf einer Video-Timeline.',
        },
        {
          label: 'Gesang aus einem Song entfernen',
          to: '/tools/remove-vocals-from-song',
          description: 'Für Musik statt Sprache: Trennen Sie stattdessen den Gesang ab.',
        },
      ],
      embed: {
        title: 'Eine Sprachaufnahme säubern',
        description: 'Laden Sie eine Aufnahme hoch. „Stimme säubern“ ist bereits angewendet, es gibt also kein Operationsmenü einzustellen. Wählen Sie ein Ausgabeformat, wenn Sie etwas anderes als den Standard brauchen, und konvertieren Sie dann.',
      },
    },
    'remove-background-noise': {
      name: 'Hintergrundgeräusche entfernen',
      h1: 'Hintergrundgeräusche online aus Audio entfernen',
      tagline: 'Senken Sie Rauschen, Brummen, Verkehr und Raumgeräusche in einer Aufnahme mit einem KI-Entrauscher und halten Sie den Hauptklang im Vordergrund.',
      metaTitle: 'Hintergrundgeräusche online aus Audio entfernen | Media Manipulator',
      metaDescription: 'Entfernen Sie Hintergrundgeräusche aus Audio. Ein KI-Entrauscher senkt Rauschen, Brummen und Umgebungsgeräusche in Aufnahmen. Läuft auf unserer eigenen GPU. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ogTitle: 'Hintergrundgeräusche online aus Audio entfernen',
      ogDescription: 'Ein KI-Entrauscher, der Rauschen, Brummen, Verkehr und Raumgeräusche in Audioaufnahmen senkt.',
      intro: 'Klimaanlagen, Computerlüfter, Straßenverkehr und Netzbrummen sind gleichmäßige Geräusche, die unter dem liegen, was Sie eigentlich aufnehmen wollten. Diese Seite lässt die Datei durch DeepFilterNet, einen Deep-Learning-Entrauscher, auf unserer GPU laufen und liefert das entrauschte Signal zurück, ohne sonst etwas zu ändern: keine Lautheitsnormalisierung, keine Entzerrung, kein Limiter. Das macht sie zur richtigen Wahl, wenn Sie das Ergebnis selbst mischen oder mastern wollen oder wenn der Charakter des Originals unangetastet bleiben soll.',
      whatItDoes: [
        'Tastet den Upload mit ffmpeg auf Mono mit 48 kHz neu ab und übergibt dieses WAV an die DeepFilterNet-Binärdatei auf unserer GPU.',
        'Schätzt den stationären Rauschteppich und zieht ihn ab, wodurch Rauschen, Brummen, Lüfter, Lüftungsanlagen und gleichmäßiger Verkehr leiser werden.',
        'Liefert die rohe Modellausgabe im gewählten Format kodiert zurück, mit demselben Spitzenpegel und derselben Klangbalance, die das Modell erzeugt hat; auf dieser Seite gibt es keine Nachbearbeitungsstufe.',
        'Lässt das Operationsmenü sichtbar, sodass Sie im selben Formular zu „Stimme säubern“ oder den Gesangs-Tools wechseln können.',
      ],
      flowSteps: [
        {
          title: 'Audio hochladen',
          description: 'Jede gängige Audiodatei, auch eine aus einem Video extrahierte Spur.',
        },
        {
          title: 'Entrauschen ist vorausgewählt',
          description: '„Hintergrundgeräusche entfernen“ ist bereits gewählt; ändern Sie das Ausgabeformat, wenn Sie etwas anderes als MP3 möchten.',
        },
        {
          title: 'DeepFilterNet läuft auf unserer GPU',
          description: 'Das Modell trennt gleichmäßiges Rauschen vom Vordergrund und schreibt ein verbessertes WAV.',
        },
        {
          title: 'Kodieren und herunterladen',
          description: 'ffmpeg schreibt das verbesserte WAV in Ihrem gewählten Format; hören Sie es neben dem Original an.',
        },
      ],
      advancedDetails: [
        'Der einzige Unterschied zwischen dieser Seite und „Stimme säubern“ in der API ist ein einzelnes Flag: polish=false. Der ffmpeg-Kodierschritt erhält keinen -af-Filter, das verbesserte WAV wird also so kodiert, wie DeepFilterNet es geschrieben hat.',
        'Die Eingabenormalisierung ist ffmpeg -ac 1 -ar 48000: Das Modell läuft auf einem Kanal mit 48 kHz, die Ausgabe ist also Mono mit 48 kHz, unabhängig von Kanalanordnung oder Abtastrate der Eingabe.',
        'Die Encoder folgen der Endung: MP3 über libmp3lame mit 192 kbps, AAC mit 192 kbps, OGG über libvorbis mit 192 kbps, Opus über libopus mit 128 kbps, FLAC verlustfrei, WAV als pcm_s16le. Wählen Sie WAV oder FLAC, wenn Sie weiterbearbeiten wollen, damit Sie nur einmal für eine verlustbehaftete Kodierung zahlen.',
        'Da keine Lautheitsnormalisierung läuft, bleibt eine leise Aufnahme leise. Entrauschen entfernt Energie, das Ergebnis kann also im Pegel etwas niedriger liegen als die Eingabe; heben Sie die Verstärkung bei Bedarf anschließend in Ihrem Editor an.',
        'DeepFilterNet ist auf stationäres und langsam veränderliches Rauschen trainiert. Tastaturklicks, Türknallen, ein zweiter Sprecher oder ein Musikbett bleiben weitgehend erhalten, da sie für das Modell wie Signal aussehen.',
        'Das Arbeitsverzeichnis mit den normalisierten und verbesserten WAVs wird gelöscht, wenn der Auftrag abgeschlossen ist; nur die kodierte Ausgabe bleibt beim Auftrag.',
      ],
      whyItMatters: [
        'Gleichmäßiges Rauschen überdeckt leise Konsonanten und ermüdet Zuhörer, lange bevor sie merken, warum.',
        'Viele Aufnahmen lassen sich nicht wiederholen: eine Hochzeitsrede, eine Vorlesung, ein Interview mit jemandem, der nicht mehr verfügbar ist.',
        'Eine entrauschte Spur, die weder normalisiert noch limitiert wurde, gibt Ihnen einen sauberen Ausgangspunkt für Ihren eigenen Mix statt einer fertig klingenden Datei, die Sie dann rückgängig machen müssen.',
      ],
      useCases: [
        {
          title: 'Aus einem Video gezogenes Audio',
          description: 'Extrahieren Sie die Spur, entfernen Sie Kameralüfter oder Wind und legen Sie sie in Darkroom wieder unter das Bild.',
        },
        {
          title: 'Außenaufnahmen',
          description: 'Senken Sie das Dröhnen einer Straße oder eines Generators unter einem Interview im Freien.',
        },
        {
          title: 'Anruf- und Meeting-Exporte',
          description: 'Reduzieren Sie das Leitungsrauschen in einem aufgezeichneten Anruf, bevor Sie ihn teilen oder transkribieren.',
        },
        {
          title: 'Digitalisierte Kassetten',
          description: 'Senken Sie das Bandrauschen auf einer digitalisierten Aufnahme, ohne ihre Pegel zu ändern.',
        },
      ],
      workedExamples: [
        {
          title: 'Eine 18-minütige MP3-Anrufaufzeichnung mit 128 kbps (etwa 17 MB) zu FLAC',
          body: 'Bei 128 kbps ist ein MP3 16 KB pro Sekunde, 1.080 Sekunden sind also etwa 17 MB. Achtzehn Minuten liegen innerhalb der Grenze von 20 Minuten für kostenlose Konten, aber über der Gastgrenze von 5 Minuten, melden Sie sich also zuerst an. ffmpeg schreibt ein Mono-WAV mit 48 kHz und etwa 104 MB (96.000 Bytes pro Sekunde) für das Modell, und dieses WAV wird nach der Kodierung verworfen. Die Wahl von FLAC liefert die verbesserten Mono-Samples mit 48 kHz verlustfrei zurück; das FLAC ist kleiner als das WAV mit 104 MB, um einen Betrag, der davon abhängt, wie viel Stille und Rauschen entfernt wurde, und das Entrauschen selbst lässt FLAC meist besser komprimieren. Die Wahl von MP3 würde stattdessen etwa 26 MB bei 192 kbps ergeben.',
        },
        {
          title: 'Eine 4 Minuten 30 Sekunden lange Stereo-FLAC-Außenaufnahme (etwa 30 MB) zu WAV',
          body: 'Viereinhalb Minuten und 30 MB liegen innerhalb der Gastlimits von 5 Minuten und 200 MB, es ist also kein Konto nötig. Die Stereodatei wird auf Mono zusammengelegt und auf 48 kHz neu abgetastet, DeepFilterNet senkt das Verkehrsbett, und die WAV-Ausgabe ist 16-Bit-Mono mit 48 kHz: 96.000 Bytes pro Sekunde für 270 Sekunden, etwa 26 MB. Der Pegel ist, was das Modell übrig gelassen hat, ohne angewendete Normalisierung, heben Sie ihn also in Ihrem Editor an, wenn das Original leise war. Die beiden ffmpeg-Umwandlungen dauern je ein paar Sekunden; der GPU-Durchlauf skaliert mit der Dauer.',
        },
      ],
      whenNotToUse: 'Dies ist nicht das Tool für Aufnahmen, bei denen das Störgeräusch unregelmäßig ist oder selbst eine Stimme: Überlappende Sprecher, ein Fernseher im Nebenraum, Stuhlrücken und Tastaturgeklapper bleiben weitgehend erhalten, weil das Modell für gleichmäßiges Rauschen gebaut ist. Verwenden Sie es nicht bei fertiger Musik, wo das „Rauschen“, das es entfernt, Hall und Raumatmosphäre sein kann, für die Sie bezahlt haben. Wenn Sie die Ausgabe in Stereo brauchen, ist es die falsche Wahl, weil die Pipeline mono ist. Und wenn Sie eine veröffentlichungsfertige Sprachdatei mit Standardlautheit wollen, fügt „Stimme säubern“ diese Nachbearbeitung hinzu; diese Seite tut das absichtlich nicht.',
      whyMediaManipulator: [
        'Der Entrauscher läuft auf einer GPU, die wir betreiben; Ihr Audio wird nicht zu einem externen Rauschentfernungsdienst hochgeladen.',
        'Nach dem Modell wird nichts hinzugefügt: keine Lautheitsänderung, kein EQ, was Sie hören, ist also das Entrauschen und nur das Entrauschen.',
        'Ein Entrauschungsauftrag ist ein Standardauftrag Ihres Tageskontingents, kein KI-Auftrag, und wird zurückerstattet, wenn der Auftrag fehlschlägt.',
      ],
      privacyNote: 'Die hochgeladene Datei wird in ihren Auftragsordner geschrieben, von ffmpeg in ein temporäres Mono-WAV mit 48 kHz in einem Arbeitsverzeichnis neu abgetastet und von DeepFilterNet auf unserer eigenen GPU entrauscht; das Arbeitsverzeichnis wird entfernt, sobald die Ausgabe kodiert ist. Das kodierte Ergebnis bleibt zum Download beim Auftrag. Wie jeder Audio-Upload durchläuft sie außerdem einen automatisierten Analyseschritt auf unserem Server, der sie mit Whisper für eine interne Prüfung transkribiert, die beim Auftrag bleibt. Nichts geht an einen externen KI-Anbieter. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      faq: [
        {
          question: 'Welche Geräusche behandelt DeepFilterNet gut, und welche nicht?',
          answer: 'Gleichmäßige, sich langsam ändernde Geräusche: Rauschen, Netzbrummen, Lüfter, Klimaanlage, Raumklang, eine gleichmäßig befahrene Straße. Kurze Ereignisse und alles Sprachähnliche (eine zweite Person, ein Fernseher, Klicks, Knalle) sehen für das Modell wie Vordergrund aus und bleiben weitgehend erhalten.',
        },
        {
          question: 'Ändert sich der Pegel oder der Klang meiner Aufnahme?',
          answer: 'Nur als Nebeneffekt des Entfernens von Rauschenergie; auf dieser Seite wird keine Normalisierung, kein EQ und keine Begrenzung angewendet. Wenn Sie einen gleichmäßigen Sprachpegel von -16 LUFS sowie einen Hochpass- und Tiefpassdurchgang möchten, verwenden Sie „Stimme säubern“, das dasselbe Modell mit dieser zusätzlichen Nachbearbeitungskette ausführt.',
        },
        {
          question: 'Warum ist die entrauschte Datei mono?',
          answer: 'Das Modell nimmt einen einzelnen Kanal mit 48 kHz, ffmpeg legt also jede Stereoeingabe zuerst auf Mono zusammen, und die Ausgabe wird so geschrieben. Eine Stereoaufnahme mit unterschiedlichem Rauschen in jedem Kanal sollte geteilt und kanalweise entrauscht werden, wenn Sie sie in Stereo behalten müssen.',
        },
        {
          question: 'Kann ich das Audio eines Videos direkt entrauschen?',
          answer: 'Laden Sie die Tonspur statt des Videos hoch: Extrahieren Sie sie mit dem Tool „Audio extrahieren“, entrauschen Sie sie hier und kombinieren Sie dann die gesäuberte Spur und das Video in Darkroom.',
        },
        {
          question: 'Welches Ausgabeformat ist für die Weiterbearbeitung am besten?',
          answer: 'WAV (16-Bit-Mono mit 48 kHz, 96 KB pro Sekunde) oder FLAC, das dieselben Samples auf weniger Platz hält. MP3, AAC und OGG werden mit 192 kbps und Opus mit 128 kbps geschrieben; wählen Sie diese nur für die endgültige Weitergabe, damit die verlustbehaftete Kodierung einmal erfolgt.',
        },
        {
          question: 'Zählt das Entrauschen gegen das KI-Kontingent?',
          answer: 'Nein. Das Entfernen von Hintergrundgeräuschen zählt bewusst als Standardauftrag, wie „Stimme säubern“: standardmäßig 5 pro Tag für einen Gast, 30 mit einem kostenlosen Konto, 300 bei Premium und 700 bei Pro. (Das Isolieren oder Entfernen von Gesang ist etwas anderes: Jedes davon ist ein KI-Auftrag.) Die Länge ist für Gäste auf 5 Minuten und für kostenlose Konten auf 20 Minuten begrenzt; die aktuellen Limits stehen auf /pricing.',
        },
        {
          question: 'Was ist, wenn die Aufnahme schon ziemlich sauber ist?',
          answer: 'Das Modell läuft trotzdem und entfernt den Restteppich, den es findet, aber der hörbare Unterschied wird klein sein, und Sie bevorzugen vielleicht das unangetastete Original. Vergleichen Sie beide, bevor Sie etwas ersetzen.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Das Entrauschen nutzt das Standardkontingent; die Längenlimits hängen von Ihrem Tarif ab und werden live im Formular angezeigt.',
        ],
      },
      related: [
        {
          label: 'Sprachaufnahme säubern',
          to: '/tools/clean-voice-audio',
          description: 'Derselbe Entrauscher plus Nachbearbeitung von Lautheit und Klang für Sprache.',
        },
        {
          label: 'Audio aus Video extrahieren',
          to: '/tools/extract-audio-from-video',
          description: 'Ziehen Sie zuerst die Tonspur aus einem Video.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Legen Sie die entrauschte Spur wieder unter das Video.',
        },
        {
          label: 'Video transkribieren',
          to: '/tools/transcribe-video',
          description: 'Transkribieren Sie das sauberere Audio für Untertitel.',
        },
        {
          label: 'Gesang aus einem Song entfernen',
          to: '/tools/remove-vocals-from-song',
          description: 'Trennen Sie Gesang von Musik mit einem anderen Modell.',
        },
      ],
      embed: {
        title: 'Hintergrundgeräusche entfernen',
        description: 'Laden Sie eine Aufnahme hoch. „Hintergrundgeräusche entfernen“ ist bereits für Sie gewählt. Sie können weiterhin das Ausgabeformat ändern und dann konvertieren.',
      },
    },
    'remove-vocals-from-song': {
      name: 'Gesang aus einem Song entfernen',
      h1: 'Gesang aus einem Song entfernen für ein Instrumental oder eine Karaoke-Version',
      tagline: 'Entfernen Sie den Gesang aus einem Track und behalten Sie die Musik, für Karaoke, Übung und Begleitspuren. Nur bei Musik verwenden, an der Sie die Rechte haben.',
      metaTitle: 'Gesang aus einem Song entfernen: Karaoke-Maker | Media Manipulator',
      metaDescription: 'Entfernen Sie Gesang mit KI aus einem Song und laden Sie das Instrumental im Format Ihrer Datei oder als FLAC oder WAV herunter. Karaoke- und Übungsspuren, auf unserer eigenen GPU. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      ogTitle: 'Gesang aus einem Song für Karaoke entfernen',
      ogDescription: 'Entfernen Sie den Gesang mit KI aus einem Song und laden Sie das Instrumental als MP3, FLAC oder WAV herunter.',
      intro: 'Karaoke-Abende, Gesangsübung und Cover-Aufnahmen brauchen alle die Band ohne den Sänger. Diese Seite lässt den Song durch Demucs (das Modell htdemucs) auf unserer GPU im Zwei-Stem-Modus laufen, der den Mix in „Gesang“ und „alles andere“ aufteilt, und liefert den Stem „alles andere“ zurück. Das Instrumental kommt standardmäßig im Format Ihrer Datei zurück, ein MP3 mit 320 kbps bleibt also ein MP3 mit 320 kbps, statt zu einem WAV anzuschwellen; FLAC und WAV stehen bereit, wenn Sie eine verlustfreie Datei zum Bearbeiten möchten.',
      whatItDoes: [
        'Führt Demucs htdemucs mit --two-stems=vocals aus, sodass das Modell nur zwei Teile schätzt: den Leadgesang und die Begleitung.',
        'Behält den Stem no_vocals und verwirft den Gesangs-Stem; das Ergebnis ist eine Stereodatei ohne Gesang.',
        'Löst „Wie Eingabe“ beim Upload zu einem konkreten Format auf: MP3 bleibt MP3, AAC/M4A bleibt AAC/M4A, OGG und Opus bleiben, wie sie sind, und WAV-, FLAC-, AIFF- oder ALAC-Eingaben kommen als FLAC zurück.',
        'Schreibt MP3- und AAC-Stems mit 320 kbps statt der 192 kbps der anderen Audio-Tools, damit die Kodierung keinen hörbaren Verlust zur Trennung hinzufügt.',
        'Zeigt vor dem Start für jede Formatwahl eine geschätzte Ausgabegröße, basierend auf der Länge Ihrer Datei.',
      ],
      flowSteps: [
        {
          title: 'Song hochladen',
          description: 'Ein Track, den Sie besitzen oder zu dessen Nutzung Sie lizenziert sind, als MP3, WAV, FLAC, M4A, AAC, OGG oder Opus.',
        },
        {
          title: '„Gesang entfernen“ ist voreingestellt',
          description: 'Die Operation ist fest; „Ausgabeformat“ steht standardmäßig auf „Wie Eingabe“, mit MP3, FLAC und WAV als Alternativen.',
        },
        {
          title: 'Demucs trennt den Mix',
          description: 'Das Modell arbeitet den Song in 7-Sekunden-Abschnitten auf unserer GPU ab und schreibt vocals.wav und no_vocals.wav.',
        },
        {
          title: 'Kodieren und herunterladen',
          description: 'Der Stem no_vocals wird im aufgelösten Format kodiert und zum Download angeboten.',
        },
      ],
      advancedDetails: [
        'Der genaue Aufruf ist demucs -n htdemucs --two-stems=vocals --segment 7; die Abschnittslänge begrenzt den GPU-Speicher und lässt lange Tracks auf einer einzelnen Karte laufen. Demucs schreibt Stereo-Stems mit 44,1 kHz, unabhängig von Abtastrate oder Kanalzahl der Eingabe, eine Mono- oder 48-kHz-Quelle kommt also als Stereo mit 44,1 kHz zurück.',
        'Die Stem-Kodierung ist libmp3lame -b:a 320k für MP3 und aac -b:a 320k für AAC oder M4A; OGG bleibt bei 192 kbps, Opus bei 128 kbps, FLAC und WAV sind verlustfrei. Jede andere KI-Audio-Operation verwendet 192 kbps, die Rate von 320 kbps gilt speziell für Stems.',
        'Die Regel für „Wie Eingabe“ lautet: Verlustbehaftete Eingabe liefert denselben Container, verlustfreie Eingabe liefert FLAC, und eine Videodatei oder alles, was der Server nicht einordnen kann, liefert MP3 mit 320 kbps. Eine .m4a wird vor der Entscheidung mit ffprobe geprüft, weil sie verlustfreies ALAC statt AAC enthalten kann.',
        'Die Regel gibt es wegen eines echten Auftrags: Ein 87-minütiges MP3 mit 68 MB kam einmal als WAV mit 880 MB zurück. PCM fügt keine Treue hinzu, die eine verlustbehaftete Quelle nie hatte, der Standard vergrößert verlustbehaftetes Audio also nie mehr zu WAV; die explizite Wahl von WAV wird weiterhin berücksichtigt.',
        'Die Trennung ist nie perfekt. Hallfahnen des Gesangs, Begleitharmonien und alles, was das Modell als „stimmähnlich“ hört (manche Synth-Leads, Pfeifen), können ins Instrumental durchsickern, und dichte Mixe trennen sich schlechter als moderne, gut gestaffelte Produktionen.',
        'Das Formular warnt, wenn eine WAV-Wahl über 500 MB läge, da WAV mit 44,1 kHz Stereo und 16 Bit 176.400 Bytes pro Sekunde sind, etwa 10,6 MB pro Minute.',
      ],
      whyItMatters: [
        'Offizielle Instrumentalversionen existieren für die meisten Songs nicht, und lizenzierte Begleitspuren sind oft neu eingespielt statt das Originalarrangement.',
        'Sänger proben sinnvoller gegen das echte Arrangement als gegen eine MIDI-Annäherung.',
        'Den Stem im Eingabeformat zurückzugeben hält eine handygroße Datei handygroß; ein MP3 mit 10 MB sollte nicht versehentlich zu einem Download von 50 MB werden.',
      ],
      useCases: [
        {
          title: 'Karaoke zu Hause',
          description: 'Erstellen Sie eine Mitsingversion eines Songs, den Sie bereits besitzen.',
        },
        {
          title: 'Gesangsübung',
          description: 'Proben Sie Ihren Part über der Originalband, ohne den Leadsänger im Ohr.',
        },
        {
          title: 'Cover und Remixe',
          description: 'Verwenden Sie das Instrumental als Grundlage für Ihre eigene Gesangsaufnahme.',
        },
        {
          title: 'Hintergrundmusik für Video',
          description: 'Ziehen Sie ein gesangsfreies Musikbett aus Musik, zu deren Nutzung Sie lizenziert sind, für ein Darkroom-Projekt.',
        },
      ],
      workedExamples: [
        {
          title: 'Ein 4-minütiges MP3 mit 320 kbps (etwa 9,6 MB) mit „Wie Eingabe“',
          body: 'Bei 320 kbps ist ein MP3 40 KB pro Sekunde, 240 Sekunden sind also etwa 9,6 MB, deutlich innerhalb der Gastlimits von 5 Minuten und 200 MB. Das Format wird zu MP3 aufgelöst, weil die Eingabe MP3 ist. Demucs läuft in 7-Sekunden-Fenstern auf unserer GPU über den Song und schreibt eine Stereo-no_vocals.wav mit 44,1 kHz und etwa 42 MB in einen Arbeitsordner, die ffmpeg dann mit libmp3lame bei 320 kbps kodiert: Das Instrumental ist wieder etwa 9,6 MB groß. Das Arbeits-WAV wird gelöscht. Der Trennungsdurchlauf dominiert die Laufzeit und wächst mit der Länge des Tracks.',
        },
        {
          title: 'Ein 4 Minuten 50 Sekunden langes WAV in CD-Qualität (etwa 51 MB), Standard FLAC oder explizit WAV',
          body: 'Ein Stereo-WAV mit 44,1 kHz und 16 Bit sind 176.400 Bytes pro Sekunde, 290 Sekunden sind also etwa 51 MB, noch innerhalb der Gastgrenze von 5 Minuten. Da die Eingabe verlustfrei ist, löst „Wie Eingabe“ zu FLAC auf: Das Formular schätzt das FLAC auf grob 55 Prozent der PCM-Größe, etwa 28 MB, und die tatsächliche Zahl hängt von der Musik ab. Die Wahl von WAV liefert den Stem stattdessen als 16-Bit-PCM mit etwa 51 MB, so groß wie die Eingabe; die Wahl von MP3 ergibt etwa 11,6 MB bei 320 kbps. Alle drei stammen aus demselben no_vocals-Stem, nur der Encoder unterscheidet sich.',
        },
      ],
      whenNotToUse: 'Führen Sie dies nicht bei Musik aus, die Sie nicht besitzen oder für die Sie keine Lizenz haben; Sie sind dafür verantwortlich, wie das Ergebnis verwendet wird. Es ist auch das falsche Tool, wenn Sie den Sänger statt der Band möchten (das ist die Operation „Gesang isolieren“ im selben Formular), wenn Sie eine Vier-Wege-Trennung in Drums, Bass und andere Instrumente brauchen (diese Seite erzeugt nur Gesang und Begleitung) oder wenn die Aufnahme Sprache statt Gesang ist, was die Seiten „Stimme säubern“ und „Hintergrundgeräusche entfernen“ besser behandeln. Sehr alte Monoaufnahmen und Live-Bootlegs, bei denen der Gesang in jedes Mikrofon einstreut, trennen sich schlecht, rechnen Sie dort also mit hörbaren Geistern.',
      whyMediaManipulator: [
        'Die Trennung läuft auf einer GPU, die wir betreiben, mit dem Demucs-Modell htdemucs; Ihre Musik wird nicht an einen externen Stem-Dienst gesendet.',
        'Die Ausgabe folgt standardmäßig Ihrer Datei, mit dem kodierten MP3- oder AAC-Stem bei 320 kbps, und FLAC oder WAV sind einen Klick entfernt.',
        'Die Größenschätzung für jedes Format wird vor dem Start angezeigt, sodass ein übergroßes WAV eine Entscheidung ist, keine Überraschung.',
      ],
      privacyNote: 'Ihr Song wird in seinem Auftragsordner gespeichert und an Demucs auf unserer eigenen GPU übergeben, das die Gesangs- und Begleitungs-Stems in ein Arbeitsverzeichnis schreibt; nur die Begleitung wird in Ihren Download kodiert, und das Arbeitsverzeichnis (einschließlich des verworfenen Gesangs-Stems) wird gelöscht, wenn der Auftrag endet. Das kodierte Instrumental bleibt beim Auftrag. Audio-Uploads durchlaufen außerdem einen automatisierten Analyseschritt auf unserem Server, der die Datei mit Whisper für eine interne Prüfung transkribiert, die beim Auftrag bleibt. Kein externer KI-Anbieter ist beteiligt. Dateien werden für Gäste 24 Stunden aufbewahrt; mit einem kostenlosen Konto wählen Sie 24 Stunden bis 2 Jahre.',
      faq: [
        {
          question: 'Ist jede Spur des Sängers weg?',
          answer: 'Der größte Teil des Leadgesangs, aber selten alles. Hallfahnen, gedoppelte und Harmoniegesänge sowie Klänge, die das Modell als stimmähnlich hört, können auf niedrigem Pegel bleiben. Moderne Stereoproduktionen trennen sich am besten; Mono- oder stark einstreuende Liveaufnahmen am schlechtesten.',
        },
        {
          question: 'In welchem Format und mit welcher Abtastrate kommt das Instrumental?',
          answer: 'Demucs schreibt Stereo-Stems mit 44,1 kHz, das ist also die Rate jeder Ausgabe. Der Container folgt standardmäßig Ihrer Datei: MP3 rein, MP3 raus mit 320 kbps; AAC oder M4A rein, dasselbe raus mit 320 kbps; WAV, FLAC, AIFF oder ALAC rein, FLAC raus. Sie können stattdessen explizit MP3, FLAC oder WAV wählen.',
        },
        {
          question: 'Warum ist der Standard nicht mehr WAV?',
          answer: 'Weil ein 87-minütiges MP3 mit 68 MB früher als WAV mit 880 MB zurückkam und PCM keine Details wiederherstellen kann, die eine verlustbehaftete Quelle nie hatte. Der Stem bleibt jetzt im Eingabeformat, wobei verlustbehaftete Stems mit 320 kbps geschrieben werden, damit die zusätzliche Kodierung nicht hörbar ist. WAV ist weiterhin verfügbar, wenn Sie es verlangen.',
        },
        {
          question: 'Kann ich statt der Begleitung nur den Gesang bekommen?',
          answer: 'Ja, wählen Sie „Gesang isolieren“ im Operationsmenü des Audiokonverters; es behält den Stem vocals.wav aus demselben Zwei-Stem-Demucs-Lauf und verwirft die Begleitung.',
        },
        {
          question: 'Kann ich statt einer Audiodatei ein Musikvideo hochladen?',
          answer: 'Laden Sie das Audio hoch: Extrahieren Sie zuerst die Spur aus dem Video. Erreicht doch eine Videodatei diese Operation, löst der Server „Wie Eingabe“ zu MP3 mit 320 kbps auf, da der Videocontainer kein Audioformat ist.',
        },
        {
          question: 'Wie viele Songs pro Tag kann ich kostenlos trennen?',
          answer: 'Jeder Song ist ein KI-Auftrag: standardmäßig 3 pro Tag ohne Konto, 10 mit einem kostenlosen Konto, 100 bei Premium und 200 bei Pro. Das KI-Kontingent wird separat gezählt, das Trennen von Songs lässt Ihr Standardkontingent also unangetastet. Songs sind für Gäste auf 5 Minuten und für kostenlose Konten auf 20 Minuten begrenzt, mit 2 Stunden bei bezahlten Tarifen; /pricing hat die aktuelle Tabelle.',
        },
        {
          question: 'Ist es legal, auf diese Weise eine Karaoke-Version zu erstellen?',
          answer: 'Nur aus Musik, die Sie besitzen, zu deren Nutzung Sie lizenziert sind oder die Sie unter einer Ausnahme an Ihrem Wohnort nutzen dürfen. Das Tool prüft keine Rechte; Sie sind für das Ergebnis und dessen Verbreitung verantwortlich.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Das Entfernen von Gesang nutzt das KI-Kontingent; dieses und die Längenlimits hängen von Ihrem Tarif ab und werden live im Formular angezeigt.',
        ],
      },
      related: [
        {
          label: 'Audio aus Video extrahieren',
          to: '/tools/extract-audio-from-video',
          description: 'Holen Sie das Audio aus einem Musikvideo, bevor Sie es trennen.',
        },
        {
          label: 'Sprachaufnahme säubern',
          to: '/tools/clean-voice-audio',
          description: 'Verwenden Sie für Sprachaufnahmen stattdessen das Sprachverbesserungsmodell.',
        },
        {
          label: 'Hintergrundgeräusche entfernen',
          to: '/tools/remove-background-noise',
          description: 'Senken Sie gleichmäßiges Rauschen in einer Aufnahme, ohne sie zu trennen.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Verwenden Sie das Instrumental als Musikbett in einem Videoschnitt.',
        },
        {
          label: 'Video transkribieren',
          to: '/tools/transcribe-video',
          description: 'Erhalten Sie den Liedtext als Text aus dem Originalmix.',
        },
      ],
      embed: {
        title: 'Gesang aus einem Song entfernen',
        description: 'Laden Sie einen Song hoch. „Gesang entfernen“ ist bereits gewählt, und das Instrumental kommt im Format Ihrer Datei zurück (MP3 bleibt MP3); wählen Sie unter „Ausgabeformat“ FLAC oder WAV für verlustfrei. Klicken Sie auf Konvertieren.',
      },
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

    // 2026-10-31 (MM92): name + tagline for every remaining tool, so the /tools catalog
    // and the home grid never show an English card in this locale. Model-written; native review pending.
    'transcode-to-dash': {
      name: 'Video in DASH transkodieren (AV1 / VP9)',
      tagline: 'Verpacken Sie jedes Video in ein MPEG-DASH-Paket mit manifest.mpd sowie Init- und Mediensegmenten pro Rendition.',
    },
    'convert-webp-to-jpg': {
      name: 'WebP in JPG umwandeln',
      tagline: 'Verwandeln Sie WebP-Bilder in weithin kompatible JPG-Dateien, die in jedem Bildbetrachter und Editor funktionieren.',
    },
    'convert-png-to-jpg': {
      name: 'PNG in JPG umwandeln',
      tagline: 'Verwandeln Sie große PNG-Screenshots und -Grafiken in Sekunden in kleine, universell kompatible JPG-Fotos.',
    },
    'convert-jpg-to-png': {
      name: 'JPG in PNG umwandeln',
      tagline: 'Verwandeln Sie JPG-Fotos in verlustfreie PNG-Dateien für Bearbeitung, Transparenz und hochwertige Grafikarbeit.',
    },
    'convert-webp-to-png': {
      name: 'WebP in PNG umwandeln',
      tagline: 'Verwandeln Sie WebP-Bilder in verlustfreie PNG-Dateien, die überall geöffnet werden können und die volle Transparenz behalten.',
    },
    'convert-png-to-webp': {
      name: 'PNG in WebP umwandeln',
      tagline: 'Verkleinern Sie PNG-Grafiken zu modernen WebP-Dateien, die im Web schneller laden und die volle Transparenz behalten.',
    },
    'convert-jpg-to-webp': {
      name: 'JPG in WebP umwandeln',
      tagline: 'Verkleinern Sie JPG-Fotos zu modernen WebP-Dateien, die bei gleicher Bildqualität im Web schneller laden.',
    },
    'jpg-converter': {
      name: 'JPG-Konverter',
      tagline: 'Bilder in JPG umwandeln: der Bildkonverter mit vorgewähltem JPG.',
    },
    'png-converter': {
      name: 'PNG-Konverter',
      tagline: 'Bilder in PNG umwandeln: der Bildkonverter mit vorgewähltem PNG.',
    },
    'convert-jpg-to-pdf': {
      name: 'JPG in PDF umwandeln',
      tagline: 'Verwandeln Sie JPG-Fotos und Scans in saubere PDF-Dokumente, bereit zum Teilen, Drucken oder Hochladen.',
    },
    'convert-png-to-pdf': {
      name: 'PNG in PDF umwandeln',
      tagline: 'Verwandeln Sie PNG-Screenshots, -Grafiken und Scans in saubere, gestochen scharfe PDF-Dokumente.',
    },
    'pdf-to-png': {
      name: 'PDF in PNG',
      tagline: 'Rendern Sie jede Seite eines PDF in gestochen scharfe, verlustfreie PNG-Bilder – ideal für Text, Diagramme und Bearbeitung.',
    },
    'pdf-converter': {
      name: 'PDF-Konverter',
      tagline: 'Wandeln Sie PDFs in JPG- oder PNG-Bilder um und machen Sie aus Bildern PDFs – alles an einem Ort.',
    },
    'convert-heic-to-jpg': {
      name: 'HEIC in JPG umwandeln',
      tagline: 'Verwandeln Sie iPhone-HEIC-Fotos in universell kompatible JPG-Dateien, die sich überall öffnen und hochladen lassen.',
    },
    'convert-avif-to-jpg': {
      name: 'AVIF in JPG umwandeln',
      tagline: 'Verwandeln Sie moderne AVIF-Bilder in universell kompatible JPG-Dateien für Apps und Websites, die AVIF nicht akzeptieren.',
    },
    'convert-avif-to-png': {
      name: 'AVIF in PNG umwandeln',
      tagline: 'Verwandeln Sie AVIF-Bilder in verlustfreie PNG-Dateien, die überall geöffnet werden können und die volle Transparenz behalten.',
    },
    'convert-svg-to-png': {
      name: 'SVG in PNG umwandeln',
      tagline: 'Rastern Sie SVG-Icons und -Logos in beliebiger Größe zu PNG-Bildern für Uploads, Folien und Apps.',
    },
    'convert-png-to-svg': {
      name: 'PNG in SVG umwandeln',
      tagline: 'Vektorisieren Sie Logos, Icons und Strichzeichnungen aus PNG mit potrace in echte, skalierbare SVG-Pfade.',
    },
    'png-to-ico': {
      name: 'PNG in ICO',
      tagline: 'Verwandeln Sie ein PNG in ein echtes .ico-Favicon mit mehreren Größen für Websites und Windows-App-Icons.',
    },
    'svg-converter': {
      name: 'SVG-Konverter',
      tagline: 'SVG in PNG rastern oder ein PNG in SVG nachzeichnen: der Bildkonverter mit SVG als Ausgangspunkt.',
    },
    'convert-wav-to-mp3': {
      name: 'WAV in MP3 umwandeln',
      tagline: 'Verkleinern Sie große verlustfreie WAV-Aufnahmen zu weithin kompatiblen MP3-Dateien für Podcasts, Teilen und Speicherung.',
    },
    'isolate-vocals-from-song': {
      name: 'Gesang aus einem Song isolieren',
      tagline: 'Extrahieren Sie Gesang aus Musikstücken für Remixe, Covers, Transkription und Analyse. Nur bei Musik verwenden, an der Sie die Rechte haben.',
    },
    'image-converter': {
      name: 'Bildkonverter',
      tagline: 'Konvertieren Sie zwischen JPG, PNG, WebP, AVIF, GIF und mehr – mit Kontrolle über Qualität, Größenänderung, Zuschnitt und Metadaten.',
    },
    'video-converter': {
      name: 'Videokonverter',
      tagline: 'Konvertieren Sie zwischen MP4, WebM, MOV, AVI, MKV und mehr – mit voller Kontrolle über Codecs, Auflösung und Audio.',
    },
    'mp4-converter': {
      name: 'MP4-Konverter',
      tagline: 'Ein Video in MP4 umwandeln: der Videokonverter mit vorgewähltem MP4.',
    },
    'convert-mov-to-mp4': {
      name: 'MOV in MP4 umwandeln',
      tagline: 'Verwandeln Sie QuickTime- und iPhone-.mov-Dateien in ein universelles MP4, das überall abgespielt und hochgeladen werden kann.',
    },
    'convert-webm-to-mp4': {
      name: 'WebM in MP4 umwandeln',
      tagline: 'Verwandeln Sie webtaugliche .webm-Videos in ein MP4, das Sie bearbeiten, teilen und auf jedem Gerät abspielen können.',
    },
    'convert-avi-to-mp4': {
      name: 'AVI in MP4 umwandeln',
      tagline: 'Bringen Sie alte .avi-Videos auf den neuesten Stand: als kompaktes MP4, das auf jedem Smartphone, in jedem Browser und auf jedem Fernseher läuft.',
    },
    'convert-mkv-to-mp4': {
      name: 'MKV in MP4 umwandeln',
      tagline: 'Verwandeln Sie Matroska-.mkv-Dateien in ein MP4, das sich streamen, hochladen und auf Geräten abspielen lässt, die MKV ablehnen.',
    },
    'convert-mp4-to-webm': {
      name: 'MP4 in WebM umwandeln',
      tagline: 'Kodieren Sie MP4 in ein kleineres, offenes VP9-WebM um, ideal für schnell ladende Web-Videos.',
    },
    'mp4-to-mp3': {
      name: 'MP4 in MP3 umwandeln',
      tagline: 'Den Ton eines MP4 als MP3 speichern: Audio aus Video extrahieren mit MP4 als Eingabe und MP3 als Ausgabe.',
    },
    'video-to-mp3': {
      name: 'Video in MP3 umwandeln',
      tagline: 'Die Tonspur eines Videos als MP3 herausziehen: dasselbe Werkzeug wie Audio aus Video extrahieren.',
    },
    'mp4-to-gif': {
      name: 'MP4 in GIF umwandeln',
      tagline: 'Aus einem MP4-Clip ein sich wiederholendes GIF machen: der Konverter für animierte GIFs mit festgelegter MP4-Eingabe.',
    },
    'video-to-gif': {
      name: 'Video in GIF umwandeln',
      tagline: 'Verwandeln Sie einen kurzen Clip in einem gängigen Videoformat in ein sich wiederholendes GIF: dasselbe Werkzeug wie der Konverter für animierte GIFs.',
    },
    'gif-converter': {
      name: 'GIF-Konverter',
      tagline: 'Animierte GIFs aus Videoclips erstellen und feinabstimmen: der Konverter für animierte GIFs unter anderem Namen.',
    },
    'video-compressor': {
      name: 'Videokompressor',
      tagline: 'Ein Video mit einer Komprimierungsvorgabe verkleinern: dasselbe Werkzeug wie Video komprimieren.',
    },
    'compress-mp4': {
      name: 'MP4 komprimieren',
      tagline: 'Ein MP4 verkleinern und als MP4 behalten: Video komprimieren mit festgelegtem Container.',
    },
    'mp4-trimmer': {
      name: 'MP4-Trimmer',
      tagline: 'Der Video-Trimmer mit festgelegtem MP4 als Ein- und Ausgabe.',
    },
    'video-cutter': {
      name: 'Video-Cutter',
      tagline: 'Einen Abschnitt eines Videos behalten und den Rest weglassen: dasselbe Werkzeug wie der Video-Trimmer.',
    },
    'cut-video-online': {
      name: 'Video online schneiden',
      tagline: 'Einen Clip direkt im Browser aus einem Video schneiden, ohne etwas zu installieren: der Video-Trimmer unter anderem Namen.',
    },
    'crop-video': {
      name: 'Video zuschneiden',
      tagline: 'Schneiden Sie die Ränder eines Videos ab – ändern Sie Bildausschnitt oder Seitenverhältnis ohne Editor.',
    },
    'resize-video': {
      name: 'Videogröße ändern',
      tagline: 'Ändern Sie die Auflösung eines Videos – skalieren Sie auf 1080p, 720p, 480p oder eine beliebige Breite und Höhe.',
    },
    'rotate-video': {
      name: 'Video drehen',
      tagline: 'Beheben Sie seitlich oder auf dem Kopf stehende Videos – drehen Sie um 90°, 180° oder 270° und spiegeln Sie mit einem Klick.',
    },
    'remove-audio-from-video': {
      name: 'Audio aus Video entfernen',
      tagline: 'Schalten Sie ein Video dauerhaft stumm – entfernen Sie die Tonspur und laden Sie eine stumme Datei nur mit Bild herunter.',
    },
    'audio-converter': {
      name: 'Audiokonverter',
      tagline: 'Konvertieren Sie zwischen MP3, WAV, M4A, OGG, FLAC, OPUS und mehr – mit voller Kontrolle über Bitrate, Samplerate und Kanäle.',
    },
    'srt-generator': {
      name: 'SRT-Generator',
      tagline: 'Laden Sie eine Video- oder Audiodatei hoch und erzeugen Sie eine herunterladbare .srt-Untertiteldatei für YouTube, Editoren und Barrierefreiheitswerkzeuge.',
    },
    'caption-translator': {
      name: 'Untertitelübersetzer',
      tagline: 'Übersetzen Sie SRT- und VTT-Untertiteldateien und behalten Sie dabei Zeitmarken, Reihenfolge und Struktur der Einträge bei – ohne KI-Anbieter von Drittanbietern.',
    },
    'audio-waveform-generator': {
      name: 'Audio-Wellenform-Generator',
      tagline: 'Verwandeln Sie jede Audiodatei in ein konfigurierbares Wellenform-Video, ein Wellenform-Bild oder beides – perfekt für Podcasts, Musikvorschauen und Social-Clips.',
    },
    'extract-video-only-from-video': {
      name: 'Video ohne Audio extrahieren',
      tagline: 'Exportieren Sie eine stumme Kopie nur mit Bild, bei der alle Audiospuren entfernt sind – perfekt für stumme Vorschauen, B-Roll, Schnitte und neue Vertonung.',
    },
    'extract-frames-from-video': {
      name: 'Einzelbilder aus Video extrahieren',
      tagline: 'Ziehen Sie Standbilder aus jedem Video – alle N Sekunden, mit einer Ziel-Bildrate oder zu bestimmten Zeitpunkten – und laden Sie sie als ZIP herunter.',
    },
    'stitch-audio-to-video': {
      name: 'Audio zu Video hinzufügen',
      tagline: 'Kombinieren Sie ein Basisvideo mit bis zu drei weiteren Audiodateien – Voiceovers, Musik, Erzählung – und laden Sie ein neues MP4 herunter.',
    },
    'ai-frame-interpolation': {
      name: 'KI-Frame-Interpolation',
      tagline: 'Erhöhen Sie die Bildrate eines Videos mit KI-erzeugten Zwischenbildern auf 48, 60 oder 120 FPS für flüssigere Bewegung.',
    },
  },
} as const;

export default deToolPages;
