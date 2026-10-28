/**
 * Italian partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope (MM58, 2026-10-26): only the Motion tool page body, which
 * `i18n/motionTranslations.test.ts` (MM48) requires for every translated
 * locale. The other ~65 tool pages render English until a later session
 * extends this file slug by slug, as the other locales do.
 *
 * Register: informal "tu"; brand names, formats and codecs stay untranslated;
 * "Motion" and "Darkroom" stay as they are. Model-written, needs native review.
 */

const itToolPages = {
  pages: {
    // MM48: Motion's full page body (model-written, needs native review). The brand stays "Motion".
    motion: {
      tagline: 'Disegna o importa un SVG, animalo su una timeline a fotogrammi chiave ed esporta SVG animato, Lottie, React, JavaScript, Flutter o GIF, tutto nel tuo browser.',
      intro: 'Motion è un editor SVG con timeline di animazione, integrato in Media Manipulator. Apri un file SVG (o un\'animazione Lottie) e ogni forma diventa un livello che puoi selezionare, spostare, ricolorare e animare, oppure parti da una tela vuota e disegna con gli strumenti rettangolo, ellisse, linea, penna e testo. Ogni proprietà animata ha una propria traccia di fotogrammi chiave, con preset di easing, un editor di curve per easing personalizzati e chiavi di hold per i salti istantanei. Gli animatori con un clic aggiungono tracciamento del contorno, movimento lungo un tracciato, morph di forma, cambi di colore dei gradienti, animazione delle maschere e sfocatura. Quando si muove come vuoi, esportalo come SVG animato, file Lottie, componente React, modulo JavaScript o TypeScript, widget Flutter o GIF. La modifica e ogni esportazione girano nel tuo browser, quindi la tua grafica non viene mai caricata per esportarla.',
      whatItDoes: [
        'Importa file SVG in un albero di livelli modificabile (gruppi, tracciati, forme, testo, immagini, gradienti, maschere e tracciati di ritaglio) e importa animazioni Lottie JSON con i loro fotogrammi chiave.',
        'Disegna nuova grafica con gli strumenti rettangolo, ellisse, linea, penna (Bézier) e testo, e modifica i nodi dei tracciati direttamente sulla tela.',
        'Anima posizione, scala, rotazione, inclinazione, opacità, riempimento, contorno e spessore del contorno su una timeline a fotogrammi chiave con easing lineare, ease-in, ease-out, ease-in-out, cubic-bezier personalizzato e hold.',
        'Aggiunge animazioni avanzate con un clic: tracciamento del contorno, movimento lungo un tracciato con rotazione automatica facoltativa, morph di forma, colori dei punti del gradiente, animazione di maschere e tracciati di ritaglio, e sfocatura.',
        'Esporta un SVG statico (sempre gratuito), un SVG animato che si riproduce senza alcuna libreria, Lottie JSON, un componente React, un modulo JavaScript o TypeScript, un widget Flutter e una GIF animata.',
      ],
      flowSteps: [
        {
          title: 'Apri o disegna',
          description: 'Importa un file SVG o Lottie, oppure disegna forme e tracciati su una tela vuota.',
        },
        {
          title: 'Anima',
          description: 'Sposta il cursore e cambia una proprietà: la timeline registra un fotogramma chiave.',
        },
        {
          title: 'Modella i tempi',
          description: 'Scegli un preset di easing, disegna una curva personalizzata, aggiungi hold o applica un animatore con un clic.',
        },
        {
          title: 'Esporta',
          description: 'Scarica SVG animato, Lottie, React, JS/TS, Flutter o GIF, creati nel tuo browser.',
        },
      ],
      advancedDetails: [
        'L\'esportazione in SVG animato usa puri fotogrammi chiave CSS ogni volta che tutti gli effetti possono essere espressi in CSS su Chrome, Firefox e Safari. Morph di forma, punti di gradiente in movimento e sfocatura richiedono un piccolo script, quindi quei file incorporano una copia ridotta di anime.js (licenza MIT, circa 14 KB compressi) con l\'avviso di licenza in cima.',
        'Il morph di forma normalizza entrambe le forme allo stesso numero di segmenti di curva e allinea i loro punti di partenza e il verso, così il morph non si attorciglia. Due forme che non possono essere abbinate restano ferme invece di trasformarsi.',
        'Il writer Lottie segue la specifica Lottie 1.0.1 e l\'insieme di funzioni "Basic" di LottieFiles. Tutto ciò che Lottie non può trasportare (come filtri, testo o maschere avanzate) viene elencato dopo il download; nulla viene scartato in silenzio.',
        'L\'esportazione GIF usa un encoder scritto apposta per Media Manipulator, con un\'unica palette globale costruita dai fotogrammi di tutta l\'animazione, così la grafica vettoriale piatta mantiene i suoi colori esatti.',
        'Gli SVG importati vengono ripuliti in ingresso: script, gestori di eventi, riferimenti esterni e altri contenuti non sicuri vengono rimossi, e l\'editor ricostruisce il markup non supportato da una lista consentita invece di inserirlo come HTML.',
      ],
      whyItMatters: [
        'Gli SVG animati restano nitidi a qualsiasi dimensione e sono di solito molto più piccoli di un video o di una GIF della stessa animazione, il che li rende ideali per loghi, icone, loader e illustrazioni sul web.',
        'Gli sviluppatori hanno bisogno dell\'animazione come codice, non solo come video: un componente React, un modulo JavaScript, un file Lottie o un widget Flutter si inserisce direttamente in un\'app.',
        'Fare l\'esportazione nel browser significa che la tua grafica resta sul tuo dispositivo; ci viene inviato solo un conteggio di ogni esportazione, per applicare la quota giornaliera.',
      ],
      useCases: [
        {
          title: 'Animazione di loghi e icone',
          description: 'Traccia un logo con un\'animazione del contorno, oppure fai rimbalzare, ruotare o cambiare colore a un\'icona al passaggio del mouse.',
        },
        {
          title: 'Loader e micro-animazioni di interfaccia',
          description: 'Crea spinner e animazioni di avanzamento ed esportali come SVG solo CSS o come componente React.',
        },
        {
          title: 'Lottie per app mobili',
          description: 'Esporta Lottie JSON per i lettori Lottie di iOS, Android, web e Flutter, oppure modifica un file Lottie esistente.',
        },
        {
          title: 'Illustrazioni animate',
          description: 'Sposta parti di un\'illustrazione lungo tracciati, trasforma forme l\'una nell\'altra ed esporta una GIF per chat o email.',
        },
      ],
      whyMediaManipulator: [
        'Un vero editor a livelli e fotogrammi chiave con hold, curve personalizzate e animatori avanzati, non una galleria di modelli.',
        'Esportazioni per designer e sviluppatori insieme: SVG animato, Lottie, React, JavaScript o TypeScript, Flutter e GIF da un unico progetto.',
        'Le esportazioni vengono create nel tuo browser, e l\'unico codice di terze parti usato da un\'esportazione ha licenze permissive (anime.js sotto MIT; flutter_svg e webview_flutter per Flutter), con l\'avviso di licenza conservato nel file.',
      ],
      privacyNote: 'Modifica ed esportazione avvengono nel tuo browser; la tua grafica non viene caricata per esportarla. Senza un account, i progetti restano solo in questo browser. Se accedi e salvi un progetto nel tuo account, viene conservato sui nostri server come un progetto Darkroom, segue il periodo di conservazione che scegli e può essere eliminato dalla pagina del tuo Account. Per ogni esportazione registriamo solo formato, dimensione, durata e ora, per applicare la quota giornaliera.',
      faq: [
        {
          question: 'Motion è gratuito?',
          answer: 'Sì. Aprire Motion, disegnare, animare, salvare ed esportare un SVG statico è gratuito e illimitato, senza account. Le esportazioni animate contano in una quota giornaliera che dipende dal tuo piano; la tabella dei piani in questa pagina mostra quota e formati di ogni piano.',
        },
        {
          question: 'Quali formati posso esportare?',
          answer: 'SVG statico, SVG animato (CSS, o un piccolo script in linea quando serve), Lottie JSON, un componente React (.tsx), un modulo JavaScript o TypeScript, un widget Flutter (.dart) e una GIF animata. Quali di questi include il tuo piano, e il numero giornaliero di esportazioni, sono indicati nella tabella dei piani in questa pagina.',
        },
        {
          question: 'Quali sono i limiti?',
          answer: 'Le esportazioni animate vengono conteggiate per giorno e si azzerano a mezzanotte UTC. I visitatori senza account possono salvare i progetti solo nel browser; i piani con accesso salvano un certo numero di progetti nell\'account. I visitatori hanno anche una durata massima dell\'animazione per l\'esportazione, e l\'esportazione GIF ha un limite di dimensione e durata. Tutti i numeri aggiornati sono nella tabella dei piani in questa pagina e nella pagina dei prezzi.',
        },
        {
          question: 'Posso animare un SVG che ho già?',
          answer: 'Sì. Importa qualsiasi SVG e i suoi gruppi, tracciati, forme, testo, gradienti, maschere e tracciati di ritaglio diventano livelli modificabili. Le parti che l\'editor non può modificare, come pattern o filtri complessi, vengono mantenute ed esportate invariate, e tutto ciò che non è sicuro (script o collegamenti esterni) viene rimosso ed elencato dopo l\'importazione.',
        },
        {
          question: 'Supporta Lottie?',
          answer: 'Sì, in entrambe le direzioni. Puoi importare un file Lottie JSON per modificarlo ed esportare la tua animazione come Lottie JSON per lottie-web e i lettori Lottie di iOS, Android e Flutter. Le funzioni che una delle due parti non può rappresentare vengono elencate nella finestra invece di essere scartate in silenzio.',
        },
        {
          question: 'Quali browser supportano l\'esportazione video?',
          answer: 'L\'esportazione GIF funziona in tutti i browser moderni. Le esportazioni MP4 e WebM si basano su WebCodecs, l\'encoder video integrato nel browser, disponibile in Chrome ed Edge e nelle versioni recenti di Safari e Firefox a seconda del codec; la finestra di esportazione controlla il tuo browser e ti avvisa quando non può codificare. La tabella dei piani in questa pagina mostra quale piano include ciascun formato video.',
        },
        {
          question: 'Quale licenza si applica al codice esportato?',
          answer: 'La tua animazione appartiene a te. Quando un SVG animato o un\'esportazione di codice ha bisogno di un runtime, usa anime.js, con licenza MIT; il suo avviso di copyright è scritto in cima al file e deve restare lì. Le esportazioni Flutter usano il pacchetto flutter_svg (MIT) o webview_flutter (BSD-3-Clause). Tutto il resto nel file è generato dal tuo progetto. Le librerie open source usate dall\'editor sono elencate nella nostra pagina delle licenze.',
        },
        {
          question: 'Dove vengono conservati i miei progetti?',
          answer: 'Senza un account, i progetti restano solo in questo browser, quindi cancellare i dati del browser li rimuove. Quando hai effettuato l\'accesso puoi salvare un progetto nel tuo account; da quel momento si sincronizza tra i dispositivi, si salva automaticamente mentre lavori, segue il periodo di conservazione che hai scelto e può essere eliminato dalla pagina del tuo Account.',
        },
      ],
      supportedFormats: {
        supportedInputFormats: [
          'SVG',
          'Lottie JSON',
          'Progetto Motion (.json)',
        ],
        supportedOutputFormats: [
          'SVG statico',
          'SVG animato',
          'Lottie JSON',
          'React (.tsx)',
          'JavaScript / TypeScript',
          'Flutter (.dart)',
          'GIF',
        ],
        maxFileNotes: [
          'Importazioni SVG e Lottie fino a 4 MB ciascuna.',
          'I progetti senza account vivono solo in questo browser; i progetti con accesso seguono il periodo di conservazione che scegli.',
        ],
        processingNotes: [
          'Modifica, anteprima e ogni esportazione girano nel tuo browser. Ai nostri server viene inviato solo un conteggio di ogni esportazione.',
        ],
      },
      embed: {
        title: 'Apri Motion',
        description: 'Inizia un nuovo disegno o riapri uno recente. L\'editor si apre a schermo intero; il tuo lavoro resta in questo browser, e gli utenti con accesso possono salvarlo nel proprio account.',
      },
      related: [
        {
          label: 'Tutorial di Motion',
          to: '/tutorials/motion',
          description: 'Importa un SVG, animalo, modella l\'easing ed esportalo, passo dopo passo.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Monta video su una timeline multitraccia ed esporta in MP4.',
        },
        {
          label: 'Converti video in GIF animata',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Trasforma una clip video in GIF quando la tua animazione è nata come filmato.',
        },
        {
          label: 'Licenze open source',
          to: '/licenses',
          description: 'Le librerie che l\'editor esegue e scrive nelle tue esportazioni.',
        },
      ],
      metaTitle: 'Motion: editor di animazioni SVG online gratuito | Media Manipulator',
      metaDescription: 'Anima SVG nel browser: fotogrammi chiave, easing, hold, tracciamento, tracciati di movimento e morph. Esporta SVG animato, Lottie JSON, React, JS, Flutter o GIF.',
      ogTitle: 'Motion: anima SVG nel tuo browser',
      ogDescription: 'Importa un SVG o disegnalo, animalo su una timeline a fotogrammi chiave ed esporta SVG animato, Lottie JSON, React, JavaScript, Flutter o GIF. Le esportazioni vengono create nel tuo browser.',
    },
    // 2026-10-28 catalog expansion: name + tagline for the /tools catalog cards (model-written, needs native review).
    'inspect-metadata': {
      name: 'Ispettore di metadati',
      tagline: 'Scopri ogni tag nascosto in una foto, un video, un file audio o un PDF: EXIF, posizione GPS, fotocamera, codec, ID3, XMP e altro, prima di condividerlo.',
    },
    'edit-image-metadata': {
      name: 'Modifica i metadati di un\'immagine',
      tagline: 'Imposta titolo, autore, copyright, parole chiave e descrizione di una foto, correggi o rimuovi la sua posizione GPS e riscrivi i tag EXIF e IPTC.',
    },
    'change-video-speed': {
      name: 'Cambia la velocità del video',
      tagline: 'Crea un time-lapse a 2x, 4x o più, oppure rallenta una clip a 0,5x o 0,25x, con l\'audio sempre sincronizzato.',
    },
    'reverse-video': {
      name: 'Inverti video',
      tagline: 'Riproduci qualsiasi clip al contrario, con o senza l\'audio invertito, e se vuoi in modalità ping-pong, prima avanti e poi indietro.',
    },
    'flip-video': {
      name: 'Capovolgi e specchia video',
      tagline: 'Specchia un video in orizzontale per correggere una webcam o un selfie invertiti, oppure capovolgilo in verticale, con un clic.',
    },
    'stabilize-video': {
      name: 'Stabilizza video',
      tagline: 'Attenua il tremolio delle riprese a mano e il rimbalzo del camminare con uno stabilizzatore a due passaggi, senza treppiede né editor desktop.',
    },
    'change-video-frame-rate': {
      name: 'Cambia il frame rate del video',
      tagline: 'Converti un video a 24, 25, 30 o 60 fps, porta una clip da 60 a 30 fps per ottenere un file più piccolo, oppure adattalo al frame rate del tuo progetto.',
    },
    'adjust-video-color': {
      name: 'Regola luminosità e colori del video',
      tagline: 'Schiarisci una clip scura, aggiungi contrasto e saturazione, cambia la tonalità oppure applica una sfocatura o un look artistico, con cursori e anteprima in tempo reale.',
    },
    'convert-video-to-hevc': {
      name: 'Converti video in HEVC (H.265)',
      tagline: 'Ricodifica qualsiasi video in H.265 per ottenere circa metà delle dimensioni dell\'H.264 a parità di qualità, ideale per archiviazione, 4K e dispositivi moderni.',
    },
    'convert-audio-to-wav': {
      name: 'Converti audio in WAV',
      tagline: 'Trasforma MP3, M4A, WAV, OGG, FLAC e qualsiasi altro file audio in WAV senza perdere nulla.',
    },
    'convert-audio-to-flac': {
      name: 'Converti audio in FLAC',
      tagline: 'Trasforma MP3, M4A, WAV, OGG, FLAC e qualsiasi altro file audio in FLAC senza perdere nulla.',
    },
    'convert-audio-to-ogg': {
      name: 'Converti audio in OGG',
      tagline: 'Trasforma MP3, M4A, WAV, OGG, FLAC e qualsiasi altro file audio in OGG con il bitrate che scegli.',
    },
    'convert-audio-to-m4a': {
      name: 'Converti audio in M4A / AAC',
      tagline: 'Trasforma MP3, M4A, WAV, OGG, FLAC e qualsiasi altro file audio in M4A / AAC con il bitrate che scegli.',
    },
    'convert-audio-to-opus': {
      name: 'Converti audio in Opus',
      tagline: 'Trasforma MP3, M4A, WAV, OGG, FLAC e qualsiasi altro file audio in Opus con il bitrate che scegli.',
    },
    'convert-mp3-to-wav': {
      name: 'Converti MP3 in WAV',
      tagline: 'Trasforma un MP3 in un WAV non compresso per modificarlo, campionarlo o masterizzarlo su CD.',
    },
    'change-audio-speed': {
      name: 'Cambia la velocità dell\'audio',
      tagline: 'Accelera una lezione o un podcast a 1,5x, oppure rallenta un brano o una registrazione a 0,75x per esercitarti, senza cambiare l\'intonazione.',
    },
    'change-audio-pitch': {
      name: 'Cambia l\'intonazione dell\'audio',
      tagline: 'Sposta un brano o una registrazione di semitoni per cambiarne la tonalità, abbassare una voce o accordare un campione, mantenendo lo stesso tempo.',
    },
    'normalize-audio': {
      name: 'Normalizza audio',
      tagline: 'Porta una registrazione troppo bassa a un volume uniforme, così podcast, memo vocali e playlist miste vengono riprodotti allo stesso livello.',
    },
    'adjust-audio-volume': {
      name: 'Regola il volume dell\'audio',
      tagline: 'Rendi un file audio più forte o più piano di un valore fisso, dal 10 percento al doppio, oppure in decibel con il cursore di amplificazione.',
    },
    'audio-equalizer': {
      name: 'Equalizzatore audio',
      tagline: 'Applica un potenziamento dei bassi, un aumento degli alti, la presenza vocale o un preset per genere, oppure imposta filtri passa-basso e passa-alto, e scarica il risultato.',
    },
    'add-reverb-to-audio': {
      name: 'Aggiungi riverbero all\'audio',
      tagline: 'Inserisci una voce o una registrazione asciutta in una stanza, una sala, un riverbero a piastra o a molla, oppure aggiungi un delay o un eco, e scarica il risultato.',
    },
    'trim-audio': {
      name: 'Taglia audio',
      tagline: 'Taglia un MP3, un WAV o qualsiasi registrazione tra un tempo di inizio e uno di fine, con una forma d\'onda per scegliere i punti, e scarica solo quella parte.',
    },
    'transcribe-audio': {
      name: 'Trascrivi audio',
      tagline: 'Trasforma un MP3, WAV, M4A o qualsiasi registrazione in testo, sottotitoli o JSON con il riconoscimento vocale basato su IA sui nostri server GPU.',
    },
    'add-text-to-image': {
      name: 'Aggiungi testo a un\'immagine',
      tagline: 'Inserisci una didascalia, un titolo o una filigrana su una foto: scegli carattere, dimensione, colore, contorno e posizione, e scarica.',
    },
    'crop-image': {
      name: 'Ritaglia immagine',
      tagline: 'Trascina un riquadro sulla parte della foto che vuoi, raddrizza l\'inquadratura e scarica solo quella regione in qualsiasi formato.',
    },
    'grayscale-image': {
      name: 'Converti immagine in bianco e nero',
      tagline: 'Trasforma una foto a colori in scala di grigi, oppure in seppia per un tono vintage, e scaricala in qualsiasi formato.',
    },
    'image-filters': {
      name: 'Filtri ed effetti per immagini',
      tagline: 'Pittura a olio, schizzo, carboncino, rilievo, vintage, vortice, sfocatura, nitidezza e altro ancora, applicati a qualsiasi foto con un clic.',
    },
    'rotate-image': {
      name: 'Ruota immagine',
      tagline: 'Ruota una foto di 90°, 180° o 270°, correggi una scansione o una foto del telefono di traverso, e scaricala in qualsiasi formato.',
    },
    'sharpen-image': {
      name: 'Aumenta la nitidezza dell\'immagine',
      tagline: 'Fai risaltare i contorni di una foto o di una scansione leggermente morbida con una nitidezza in un clic, e scarica in qualsiasi formato.',
    },
    'blur-image': {
      name: 'Sfoca immagine',
      tagline: 'Ammorbidisci un\'intera foto per uno sfondo, un segnaposto o uno schermo di privacy, e scaricala in qualsiasi formato.',
    },
    'generate-vtt-captions': {
      name: 'Generatore di sottotitoli VTT',
      tagline: 'Crea un file di sottotitoli .vtt per video HTML5, YouTube o un lettore con trascrizione basata su IA sui nostri server GPU.',
    },
    // MM75: summarize-video / summarize-audio full page bodies (model-written, needs native review).
    'summarize-video': {
      name: 'Riassumi video',
      h1: 'Riassumi un video con l\'IA: capitoli, argomenti e testo a schermo',
      tagline: 'Ottieni un riassunto scritto di una lezione, una riunione o un tutorial, con capitoli cliccabili, argomenti e testo a schermo, creato sui nostri server GPU.',
      metaTitle: 'Riassunto video con IA e capitoli | Media Manipulator',
      metaDescription: 'Carica un video e ottieni un riassunto scritto con capitoli con marcatori temporali, argomenti e il testo mostrato a schermo. L\'IA gira sui nostri server GPU, mai su un\'IA di terze parti. Account gratuito richiesto.',
      ogTitle: 'Riassumi un video con l\'IA',
      ogDescription: 'Un riassunto scritto con capitoli cliccabili, argomenti e testo a schermo. Account gratuito richiesto.',
      embed: {
        title: 'Riassumi un video',
        description: 'Accedi, carica un video (o un file audio) e scegli la lingua del riassunto. Ottieni un titolo, un breve riassunto, capitoli che portano al momento giusto del tuo video, gli argomenti e il testo che compare a schermo.',
      },
      intro: 'Nessuno vuole rivedere un\'ora di riunione o di lezione per trovare i cinque minuti che contavano. Media Manipulator guarda e ascolta al posto tuo: trascrive il parlato con Whisper, osserva con un modello di visione i fotogrammi scelti dove l\'immagine cambia e scrive un riassunto a partire da entrambi, tutto su un server GPU che gestiamo noi. Il risultato è un breve documento: un titolo, qualche frase, capitoli con orari di inizio e fine, gli argomenti e il testo comparso a schermo. Clicca su un capitolo per saltare a quel momento del tuo video, copia tutto come Markdown oppure scaricalo come Markdown o JSON. I riassunti richiedono un account gratuito.',
      whatItDoes: [
        'Scrive un titolo e un riassunto di tre-sei frasi dell\'intero video.',
        'Divide il video in capitoli con orari di inizio e fine; cliccandone uno il lettore salta a quel momento.',
        'Elenca gli argomenti e il testo che compare a schermo, con l\'orario della prima comparsa.',
        'Descrive l\'immagine e il parlato e segnala ciò che non è stato possibile fare (per esempio, assenza di parlato).',
        'Scrive il riassunto nella lingua che scegli, oppure nella lingua parlata.',
      ],
      flowSteps: [
        {
          title: 'Accedi',
          description: 'Basta un account gratuito.',
        },
        {
          title: 'Carica',
          description: 'Un video o un file audio.',
        },
        {
          title: 'Riassumi',
          description: 'Parlato e fotogrammi vengono analizzati sul nostro server GPU.',
        },
        {
          title: 'Leggi',
          description: 'Clicca sui capitoli, copia il Markdown, scarica il .md o il .json.',
        },
      ],
      advancedDetails: [
        'Il parlato viene trascritto con Whisper; i fotogrammi sono scelti ai cambi di scena, fino al limite di fotogrammi del tuo piano (24 con Free, 48 con Premium, 96 con Pro), e descritti a gruppi da un modello di visione.',
        'Un modello linguistico scrive il riassunto dalla trascrizione e dalle note sui fotogrammi. Gli account Pro possono richiedere un riassunto più approfondito da un modello più grande, quando disponibile.',
        'Un riassunto conta come un lavoro IA della tua quota giornaliera; un lavoro non riuscito o rifiutato non viene conteggiato.',
        'La trascrizione è generata automaticamente, quindi nomi e numeri possono essere sbagliati. Il riassunto lo segnala nelle sue note.',
      ],
      whyItMatters: [
        'Un riassunto con capitoli si scorre in un minuto; il video no.',
        'I marcatori temporali cliccabili ti portano direttamente alla parte che ti serve.',
        'Il testo a schermo cattura titoli di diapositive e didascalie che il parlato non dice mai ad alta voce.',
      ],
      useCases: [
        {
          title: 'Riepilogo di riunione',
          description: 'Decisioni e argomenti, con gli orari per verificare i dettagli.',
        },
        {
          title: 'Appunti di lezione',
          description: 'Capitoli per sezione e il testo delle diapositive, per studiare.',
        },
        {
          title: 'Schema di tutorial',
          description: 'I passaggi come capitoli, per saltare subito a quello che ti serve.',
        },
        {
          title: 'Panoramica di intervista',
          description: 'Di cosa si è parlato, e dove.',
        },
      ],
      whyMediaManipulator: [
        'Whisper e i modelli di visione e linguistici girano su hardware che gestiamo noi; il tuo video non viene mai inviato a un\'IA di terze parti.',
        'Capitoli che si spostano nel tuo video, direttamente nel visualizzatore dei risultati.',
        'Download in Markdown e JSON. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      ],
      privacyNote: 'I riassunti richiedono un account gratuito, quindi il lavoro è associato ad esso. Il tuo file viene elaborato sui nostri server e i modelli di IA girano su un server GPU che gestiamo noi; nulla viene inviato a un fornitore di IA di terze parti. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      faq: [
        {
          question: 'Mi serve un account?',
          answer: 'Sì, un account gratuito. I riassunti usano diversi modelli di IA sul nostro server GPU, quindi sono riservati agli utenti che hanno effettuato l\'accesso.',
        },
        {
          question: 'Cosa ottengo?',
          answer: 'Un titolo, un breve riassunto, capitoli con orari di inizio e fine, argomenti, testo a schermo con gli orari, una descrizione dell\'immagine e del parlato e note su tutto ciò che non è stato possibile fare.',
        },
        {
          question: 'Posso scegliere la lingua del riassunto?',
          answer: 'Sì. Scegli una delle 18 lingue del sito, oppure «come il parlato» per scriverlo nella lingua parlata.',
        },
        {
          question: 'E se il video non ha parlato?',
          answer: 'Il riassunto viene scritto solo a partire dall\'immagine e lo segnala nelle sue note. Un file senza immagini né suono viene rifiutato e non conteggiato.',
        },
        {
          question: 'Il mio video viene inviato a terze parti?',
          answer: 'No. Ogni modello gira su un server GPU che gestiamo noi.',
        },
        {
          question: 'Viene scalato dalla mia quota?',
          answer: 'Sì, come un lavoro IA. I lavori non riusciti non vengono conteggiati.',
        },
      ],
      related: [
        {
          label: 'Riassumi audio',
          to: '/tools/summarize-audio',
          description: 'Per podcast e registrazioni.',
        },
        {
          label: 'Trascrivi video',
          to: '/tools/transcribe-video',
          description: 'La trascrizione completa.',
        },
        {
          label: 'Trascrivi audio',
          to: '/tools/transcribe-audio',
          description: 'Per i file audio.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Ripulisci prima l\'audio.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Conta come un lavoro IA; i lavori non riusciti non vengono conteggiati.',
          'Durata fino al limite di durata video del tuo piano.',
        ],
      },
    },
    'summarize-audio': {
      name: 'Riassumi audio',
      h1: 'Riassumi una registrazione audio con l\'IA',
      tagline: 'Trasforma un podcast, un\'intervista o una nota vocale in un riassunto scritto con capitoli e argomenti, creato sui nostri server GPU.',
      metaTitle: 'Riassunto audio con IA e capitoli | Media Manipulator',
      metaDescription: 'Carica un file MP3, WAV o M4A e ottieni un riassunto scritto con capitoli con marcatori temporali e argomenti. Whisper e il modello linguistico girano sui nostri server GPU. Account gratuito richiesto.',
      ogTitle: 'Riassumi una registrazione audio con l\'IA',
      ogDescription: 'Un riassunto scritto con capitoli e argomenti per qualsiasi registrazione. Account gratuito richiesto.',
      embed: {
        title: 'Riassumi un file audio',
        description: 'Accedi, carica una registrazione e scegli la lingua del riassunto. Ottieni un titolo, un breve riassunto, capitoli che portano al momento giusto della tua registrazione e gli argomenti.',
      },
      intro: 'Una puntata di podcast, un\'intervista o una lunga nota vocale è più facile da usare come pagina che come un\'ora di audio. Media Manipulator trascrive la registrazione con Whisper e fa scrivere a un modello linguistico un riassunto dalla trascrizione, entrambi su un server GPU che gestiamo noi. Ottieni un titolo, qualche frase, capitoli con orari di inizio e fine e gli argomenti. Clicca su un capitolo per saltare a quel punto della registrazione, copia il riassunto come Markdown oppure scaricalo come Markdown o JSON. I riassunti richiedono un account gratuito.',
      whatItDoes: [
        'Scrive un titolo e un breve riassunto della registrazione.',
        'La divide in capitoli con orari; cliccandone uno il lettore salta lì.',
        'Elenca gli argomenti e descrive chi parla e con quale tono.',
        'Scrive il riassunto nella lingua che scegli, oppure nella lingua parlata.',
      ],
      flowSteps: [
        {
          title: 'Accedi',
          description: 'Basta un account gratuito.',
        },
        {
          title: 'Carica',
          description: 'MP3, WAV, M4A e altri formati audio.',
        },
        {
          title: 'Riassumi',
          description: 'Whisper e un modello linguistico sul nostro server GPU.',
        },
        {
          title: 'Leggi',
          description: 'Clicca sui capitoli, copia il Markdown, scarica il .md o il .json.',
        },
      ],
      advancedDetails: [
        'Il parlato viene trascritto con Whisper; un modello linguistico scrive il riassunto dalla trascrizione.',
        'Un file audio con copertina viene trattato come audio: l\'immagine viene ignorata.',
        'Un riassunto conta come un lavoro IA della tua quota giornaliera; un lavoro non riuscito o rifiutato non viene conteggiato.',
        'La trascrizione è generata automaticamente, quindi nomi e numeri possono essere sbagliati. Il riassunto lo segnala nelle sue note.',
      ],
      whyItMatters: [
        'Un riassunto si legge in un minuto e poi decidi cosa ascoltare.',
        'I capitoli con orari trasformano una lunga registrazione in qualcosa in cui puoi muoverti.',
        'Gli argomenti rendono ricercabile un intero archivio di puntate.',
      ],
      useCases: [
        {
          title: 'Note di puntata del podcast',
          description: 'Capitoli e argomenti per la pagina della puntata.',
        },
        {
          title: 'Riepilogo di intervista',
          description: 'Cosa è stato trattato, con gli orari da cui citare.',
        },
        {
          title: 'Da nota vocale ad appunti',
          description: 'Una nota prolissa ridotta a una breve pagina.',
        },
        {
          title: 'Riassunto di chiamata',
          description: 'I punti di una chiamata registrata.',
        },
      ],
      whyMediaManipulator: [
        'Whisper e il modello linguistico girano su hardware che gestiamo noi; la tua registrazione non viene mai inviata a un\'IA di terze parti.',
        'Capitoli che si spostano nella tua registrazione, direttamente nel visualizzatore dei risultati.',
        'Download in Markdown e JSON. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      ],
      privacyNote: 'I riassunti richiedono un account gratuito, quindi il lavoro è associato ad esso. Il tuo file viene elaborato sui nostri server e i modelli di IA girano su un server GPU che gestiamo noi; nulla viene inviato a un fornitore di IA di terze parti. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      faq: [
        {
          question: 'Mi serve un account?',
          answer: 'Sì, un account gratuito. I riassunti usano modelli di IA sul nostro server GPU, quindi sono riservati agli utenti che hanno effettuato l\'accesso.',
        },
        {
          question: 'In cosa è diverso dalla trascrizione?',
          answer: 'La trascrizione ti dà ogni parola. Un riassunto ti dà un titolo, qualche frase, capitoli e argomenti, scritti a partire da quella trascrizione.',
        },
        {
          question: 'Posso scegliere la lingua del riassunto?',
          answer: 'Sì. Scegli una delle 18 lingue del sito, oppure «come il parlato».',
        },
        {
          question: 'La mia registrazione viene inviata a terze parti?',
          answer: 'No. I modelli girano su un server GPU che gestiamo noi.',
        },
        {
          question: 'Viene scalato dalla mia quota?',
          answer: 'Sì, come un lavoro IA. I lavori non riusciti non vengono conteggiati.',
        },
      ],
      related: [
        {
          label: 'Trascrivi audio',
          to: '/tools/transcribe-audio',
          description: 'Ogni parola, come testo o sottotitoli.',
        },
        {
          label: 'Riassumi video',
          to: '/tools/summarize-video',
          description: 'Aggiunge l\'immagine e il testo a schermo.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Ripulisci prima l\'audio.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Conta come un lavoro IA; i lavori non riusciti non vengono conteggiati.',
        ],
      },
    },
    // MM78 voices: name + tagline (model-written, needs native review).
    'voice-cloning': {
      name: 'Clonazione vocale',
      tagline:
        'Registra o carica da 5 a 60 secondi del tuo parlato, crea una voce e fagli leggere qualsiasi testo in più di venti lingue.',
    },
    'voice-designer': {
      name: 'Progettista di voci',
      tagline:
        'Descrivi una voce a parole, ascolta un\'anteprima e conserva quella che ti piace per leggere qualsiasi testo in più di venti lingue.',
    },
    'voice-changer': {
      name: 'Cambia voce',
      tagline:
        'Varia subito tonalità e carattere di una registrazione, oppure converti il parlato in una voce salvata o predefinita con l\'IA.',
    },
  },
} as const;

export default itToolPages;
