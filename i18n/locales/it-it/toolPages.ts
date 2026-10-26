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
  },
} as const;

export default itToolPages;
