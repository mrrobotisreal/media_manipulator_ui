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
      name: 'Motion',
      h1: 'Motion',
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
        'L\'esportazione in SVG animato usa puri fotogrammi chiave CSS ogni volta che tutti gli effetti possono essere espressi in CSS su Chrome, Firefox e Safari. Morph di forma, punti di gradiente in movimento e sfocatura richiedono uno script, quindi quei file incorporano una copia ridotta di anime.js (licenza MIT, circa 31 KB di script, all\'incirca 13 KB dopo gzip) con l\'avviso di licenza in cima.',
        'Il morph di forma normalizza entrambe le forme allo stesso numero di segmenti di curva e allinea i loro punti di partenza e il verso, così il morph non si attorciglia. Due forme che non possono essere abbinate restano ferme invece di trasformarsi.',
        'Il writer Lottie segue la specifica Lottie 1.0.1 e l\'insieme di funzioni "Basic" di LottieFiles. Tutto ciò che Lottie non può trasportare (come filtri, testo o maschere avanzate) viene elencato dopo il download; nulla viene scartato in silenzio. Il reader usa la stessa lista nella direzione opposta.',
        'L\'esportazione GIF renderizza i fotogrammi uno alla volta, trasferisce ciascuno a un Worker e codifica con un encoder scritto per Media Manipulator: un\'unica palette globale campionata da cinque fotogrammi distribuiti sull\'intera durata, dithering disattivato per impostazione predefinita (la grafica vettoriale piatta ha pochi colori e il dithering aggiunge rumore), un ritardo tra fotogrammi di round(100 / fps) centesimi di secondo, e trasparenza mantenuta solo quando lo sfondo della tela è trasparente. L\'output è limitato a 2 GB e la finestra mostra una stima della dimensione prima di iniziare.',
        'Gli SVG importati vengono ripuliti in ingresso: script, gestori di eventi, riferimenti esterni e altri contenuti non sicuri vengono rimossi, e l\'editor ricostruisce il markup non supportato da una lista consentita invece di inserirlo come HTML. Il markup che non può modellare viene mantenuto come livello opaco che viene riesportato invariato.',
        'Il contatore delle esportazioni è una singola transazione del database: vengono verificati il blocco del formato e i limiti, poi il contatore e una riga di esportazione vengono scritti insieme. Un\'esportazione rifiutata non scrive nulla e non costa nulla; un\'esportazione che il browser poi annulla o fallisce è già stata conteggiata.',
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
      workedExamples: [
        {
          title: 'Un logo di 2 secondi con tracciamento del contorno come SVG animato',
          body: 'Un logotipo di pochi tracciati con l\'animatore Tracciamento del contorno su 2.000 ms, esportato come SVG animato. Il tracciamento del contorno è un\'animazione di stroke-dasharray e stroke-dashoffset, che il CSS può esprimere in ogni browser principale, quindi l\'esportatore scrive un blocco <style> di @keyframes e nessuno script. Il file è il tuo SVG più qualche centinaio di byte di CSS, si riproduce nel momento in cui è nella pagina e conta come un\'esportazione svg_animated: senza un account è una delle 2 al giorno ed entro il limite di durata di 10 secondi per i visitatori; con un account gratuito una delle 5. L\'esportazione è una trasformazione di stringa nel tuo browser e si completa all\'istante.',
        },
        {
          title: 'Un loop di morph 400 x 400 come GIF',
          body: 'Un morph di forma di 2 secondi su una tela 400 x 400 esportato come GIF a 25 fps con un piano Premium (GIF è un formato Premium per impostazione predefinita). La finestra si limita ai preset di altezza e frame rate del piano, e 25 fps danno un ritardo di round(100 / 25) = 4 centesimi di secondo per fotogramma e 50 fotogrammi in tutto. La stima della dimensione è pixel x fotogrammi x 0,25 byte + 1 KB: 160.000 x 50 x 0,25 fa circa 2 MB, volutamente per eccesso, e la grafica piatta a due colori di solito resta ben al di sotto. I fotogrammi vengono renderizzati nel thread principale e codificati in un Worker uno alla volta, così la memoria resta a un paio di fotogrammi più il file che cresce; il tempo va nella rasterizzazione di 50 fotogrammi di SVG, qualche secondo su un portatile.',
        },
      ],
      whenNotToUse: 'Motion anima grafica vettoriale; non modifica video né fotografie. Se il tuo punto di partenza è un filmato, Darkroom è l\'editor e la pagina da video a GIF trasforma una clip in GIF. Non è nemmeno un vettorizzatore per immagini raster complesse: una fotografia tracciata in tracciati sarà pesante e il risultato non si animerà in modo sensato. Le animazioni che dipendono da filtri, effetti di testo o maschere avanzate non sopravviveranno intatte a un\'esportazione Lottie (la finestra elenca ciò che è stato scartato), quindi per quelle destinazioni resta sulle esportazioni SVG animato, React o JavaScript. E l\'output MP4 o WebM dipende dal supporto WebCodecs del tuo browser e dal tuo piano, quindi controlla la tabella dei piani prima di pianificare una consegna video.',
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
      featureList: [
        'Importazione SVG in livelli modificabili',
        'Importazione Lottie JSON',
        'Strumenti rettangolo, ellisse, linea, penna e testo',
        'Timeline a fotogrammi chiave con preset di easing, curve cubic-bezier personalizzate e chiavi di hold',
        'Animatori per tracciamento del contorno, tracciato di movimento, morph di forma, gradiente, maschera e sfocatura',
        'Esportazione SVG statico',
        'Esportazione SVG animato (CSS o runtime anime.js in linea)',
        'Esportazione Lottie JSON',
        'Esportazione di codice React, JavaScript, TypeScript e Flutter',
        'Esportazione GIF animata',
        'Progetti salvati nel browser o nel tuo account',
      ],
    },
    // 2026-10-28 catalog expansion: name + tagline for the /tools catalog cards (model-written, needs native review).
    'inspect-metadata': {
      name: 'Ispettore di metadati',
      h1: 'Ispeziona i metadati di un file online',
      tagline: 'Scopri ogni tag nascosto in una foto, un video, un file audio o un PDF: EXIF, posizione GPS, fotocamera, codec, ID3, XMP e altro, prima di condividerlo.',
      metaTitle: 'Ispeziona i metadati di un file: EXIF, GPS, codec, ID3 | Media Manipulator',
      metaDescription: 'Ispettore di metadati online gratuito per immagini, video, audio e PDF. Vedi EXIF, coordinate GPS su una mappa, fotocamera e obiettivo, codec e bitrate, tag ID3, XMP e IPTC. Senza registrazione.',
      ogTitle: 'Ispeziona i metadati di un file online',
      ogDescription: 'Ogni tag EXIF, GPS, codec, ID3 e XMP del tuo file, raggruppato e ricercabile, con quelli privati segnalati.',
      intro: 'I file contengono più dei loro pixel e campioni. Una foto scattata con il telefono registra dove e quando è stata presa e con quale dispositivo; un video indica il suo encoder e i bitrate; un MP3 porta tag ID3 e copertina; un PDF memorizza l\'autore e il software che l\'ha creato. L\'ispettore di metadati di Media Manipulator legge tutto questo sui nostri server con ExifTool e ffprobe, lo raggruppa nelle sezioni fotocamera, posizione, dispositivo, orari, codec e documento, ed evidenzia le voci che potrebbero identificarti, così puoi decidere cosa rimuovere prima che un file esca dalle tue mani.',
      whatItDoes: [
        'Legge i dati EXIF, GPS, IPTC, XMP e ICC da immagini JPG, PNG, WebP, HEIC, AVIF, TIFF e derivate da RAW.',
        'Legge i dati di contenitore, flussi, codec, bitrate, frame rate e capitoli da MP4, MOV, MKV, WebM e altri file video.',
        'Legge tag ID3, Vorbis e MP4, copertine e impostazioni dell\'encoder da MP3, M4A, FLAC, OGG e WAV.',
        'Legge autore, produttore, date di creazione e numero di pagine dai PDF.',
        'Mostra le coordinate GPS su un profilo di mappa e segnala ogni voce sensibile per la privacy.',
        'Offre l\'output grezzo di ExifTool e ffprobe e la copia con un clic di qualsiasi blocco.',
      ],
      flowSteps: [
        {
          title: 'Carica un file',
          description: 'Immagine, video, audio o PDF.',
        },
        {
          title: 'Lo leggiamo',
          description: 'ExifTool e ffprobe girano sui nostri server.',
        },
        {
          title: 'Sfoglia il rapporto',
          description: 'Raggruppato, ricercabile, con le voci private segnalate.',
        },
        {
          title: 'Decidi',
          description: 'Rimuovi i metadati con lo strumento EXIF se serve.',
        },
      ],
      advancedDetails: [
        'Immagini e PDF vengono ispezionati automaticamente; video e audio oltre 100 MB attendono un clic, così un file grande non viene caricato per sbaglio.',
        'La copertina incorporata nei file audio viene riportata come voce immagine, non come flusso video.',
        'Il rapporto usa lo stesso catalogo di metadati che alimenta lo strumento di rimozione EXIF e l\'ispettore dei risultati di ogni conversione.',
      ],
      whyItMatters: [
        'Una foto condivisa dal telefono può rivelare l\'indirizzo di casa tua attraverso i tag GPS.',
        'Conoscere il vero codec, bitrate e frame rate di un video spiega perché si riprodurrà o meno da qualche parte.',
        'I metadati dei documenti indicano autori e software di modifica, il che conta per tutto ciò che pubblichi in modo anonimo.',
      ],
      useCases: [
        {
          title: 'Prima di pubblicare una foto',
          description: 'Controlla le coordinate GPS e il numero di serie del dispositivo.',
        },
        {
          title: 'Diagnosi di un video',
          description: 'Vedi il codec reale, il profilo, il frame rate e la disposizione dell\'audio.',
        },
        {
          title: 'Controllo di un file musicale',
          description: 'Verifica i tag, il bitrate e se è stato transcodificato da un bitrate inferiore.',
        },
        {
          title: 'Revisione di un PDF',
          description: 'Scopri chi è indicato nel campo autore e quale software lo ha prodotto.',
        },
      ],
      whyMediaManipulator: [
        'Un unico ispettore per immagini, video, audio e PDF, non quattro strumenti separati.',
        'Le voci sensibili per la privacy sono segnalate, con un percorso diretto per rimuoverle.',
        'Nessuna conversione, nessun account. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      ],
      privacyNote: 'Il tuo file viene letto da ExifTool e ffprobe sul nostro server, il rapporto torna al tuo browser e la copia temporanea viene eliminata appena il rapporto è pronto. Nessuna terza parte vede il file o i suoi tag. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      faq: [
        {
          question: 'Ispezionare un file lo modifica?',
          answer: 'No. Il file viene letto, riportato nel rapporto ed eliminato dopo l\'analisi. Nulla viene riscritto.',
        },
        {
          question: 'Posso rimuovere ciò che l\'ispettore trova?',
          answer: 'Sì. Usa lo strumento Rimuovi i metadati EXIF per le immagini; elimina tutto e mostra un confronto prima/dopo.',
        },
        {
          question: 'Perché un video grande richiede un clic?',
          answer: 'Video e audio oltre 100 MB vengono caricati solo quando lo chiedi, così non invii mai un file grande per sbaglio.',
        },
        {
          question: 'Conta nelle mie conversioni giornaliere?',
          answer: 'No. L\'ispezione è gratuita e non consuma un\'operazione.',
        },
        {
          question: 'I dati vengono inviati a terzi?',
          answer: 'No. ExifTool e ffprobe girano sui nostri server e il file viene eliminato subito dopo.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'L\'ispezione è in sola lettura e non conta come conversione.',
        ],
      },
      related: [
        {
          label: 'Rimuovi i metadati EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimina tutto ciò che l\'ispettore ha trovato.',
        },
        {
          label: 'Modifica i metadati di un\'immagine',
          to: '/tools/edit-image-metadata',
          description: 'Riscrivi titolo, autore, copyright e GPS.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti con o senza metadati.',
        },
      ],
      embed: {
        title: 'Ispeziona un file',
        description: 'Trascina un\'immagine, un video, un file audio o un PDF. Il rapporto raggruppa ogni tag per categoria, segnala quelli che identificano te o la tua posizione e offre una vista grezza di ExifTool e ffprobe.',
      },
    },
    'edit-image-metadata': {
      name: 'Modifica i metadati di un\'immagine',
      h1: 'Modifica i metadati di un\'immagine online',
      tagline: 'Imposta titolo, autore, copyright, parole chiave e descrizione di una foto, correggi o rimuovi la sua posizione GPS e riscrivi i tag EXIF e IPTC.',
      metaTitle: 'Modifica i metadati di un\'immagine: EXIF, IPTC, GPS | Media Manipulator',
      metaDescription: 'Editor di metadati per immagini online gratuito. Imposta titolo, autore, copyright, descrizione e parole chiave, sostituisci o rimuovi la posizione GPS e modifica i tag EXIF e IPTC su JPG, PNG, WebP e altri.',
      ogTitle: 'Modifica i metadati di un\'immagine online',
      ogDescription: 'Scrivi un avviso di copyright, correggi la posizione, imposta le parole chiave. Gratis, senza registrazione.',
      intro: 'I fotografi hanno bisogno di un avviso di copyright e dei recapiti in ogni file che consegnano. Le agenzie vogliono parole chiave e didascalie IPTC. Chiunque condivida una foto può voler eliminare la posizione, o impostarla su una città anziché su una porta di casa. Media Manipulator riscrive i campi EXIF, IPTC e XMP sul posto, sui nostri server con ExifTool, lascia intatti i dati dell\'immagine e ti mostra il confronto prima/dopo.',
      whatItDoes: [
        'Imposta titolo, autore/artista, descrizione, copyright, commento e parole chiave.',
        'Rimuove la posizione GPS o la sostituisce con le coordinate che scegli.',
        'Modifica singoli tag EXIF/TIFF, IPTC e avanzati per nome.',
        'Lascia intatti i pixel; facoltativamente converte il formato nello stesso passaggio.',
        'Mostra un confronto di ciò che è cambiato al termine del lavoro.',
      ],
      flowSteps: [
        {
          title: 'Carica un\'immagine',
          description: 'JPG, PNG, WebP, HEIC, TIFF.',
        },
        {
          title: 'Compila i campi',
          description: 'Titolo, autore, copyright, parole chiave, posizione.',
        },
        {
          title: 'Applica',
          description: 'ExifTool riscrive i tag sui nostri server.',
        },
        {
          title: 'Scarica',
          description: 'Confronta prima e dopo, poi salva.',
        },
      ],
      advancedDetails: [
        'La modalità metadati personalizzati scrive insieme le controparti standard EXIF (Artist, Copyright, ImageDescription), IPTC (Keywords, Caption) e XMP (dc:title, dc:creator), così ogni visualizzatore è d\'accordo.',
        'Sostituire la posizione GPS scrive GPSLatitude/GPSLongitude con gli emisferi di riferimento corretti; rimuoverla cancella ogni tag GPS.',
        'PNG e WebP portano i metadati in chunk di testo e XMP; gli stessi campi vengono scritti lì.',
      ],
      whyItMatters: [
        'Un avviso di copyright incorporato nel file viaggia con esso quando viene ripubblicato.',
        'Parole chiave e didascalie IPTC sono ciò che le agenzie di stock e i sistemi DAM indicizzano.',
        'Una posizione impostata su una città protegge la tua casa mantenendo la foto geolocalizzata.',
      ],
      useCases: [
        {
          title: 'Consegna di foto ai clienti',
          description: 'Incorpora il tuo nome, il copyright e i recapiti in ogni file.',
        },
        {
          title: 'Invii a siti di stock',
          description: 'Aggiungi parole chiave IPTC e una didascalia.',
        },
        {
          title: 'Geotag approssimativo',
          description: 'Sostituisci una posizione GPS precisa con il centro della città.',
        },
        {
          title: 'Correzione di un tag errato',
          description: 'Correggi l\'autore o la data scritti da uno scanner.',
        },
      ],
      whyMediaManipulator: [
        'Scrive EXIF, IPTC e XMP insieme, non solo uno di essi.',
        'Confronto prima/dopo, così vedi esattamente cosa è cambiato.',
      ],
      privacyNote: 'I tag della tua immagine vengono riscritti da ExifTool sul nostro server con i valori che hai digitato; i pixel restano come sono. Nessuna terza parte vede il file o i suoi tag. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      faq: [
        {
          question: 'Modificare i metadati ricodifica il mio JPG?',
          answer: 'Solo se cambi il formato di output o ridimensioni. Con lo stesso formato e senza modifiche ai pixel, i dati dell\'immagine vengono copiati e solo i tag vengono riscritti.',
        },
        {
          question: 'Posso rimuovere la posizione ma conservare tutto il resto?',
          answer: 'Sì. Spunta "Rimuovi i dati di posizione" e lascia intatti gli altri campi.',
        },
        {
          question: 'Posso modificare un tag che non è in elenco?',
          answer: 'Sì. Espandi la sezione avanzata e imposta per nome qualsiasi tag EXIF o IPTC.',
        },
        {
          question: 'Come faccio invece a rimuovere tutto?',
          answer: 'Usa lo strumento Rimuovi i metadati EXIF, che elimina ogni tag con un clic.',
        },
      ],
      related: [
        {
          label: 'Ispeziona i metadati',
          to: '/tools/inspect-metadata',
          description: 'Guarda prima cosa c\'è nel file.',
        },
        {
          label: 'Rimuovi i metadati EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimina tutto.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra formati immagine.',
        },
        {
          label: 'Ritaglia immagine',
          to: '/tools/crop-image',
          description: 'Taglia a una zona.',
        },
        {
          label: 'Ridimensiona immagine',
          to: '/tools/image-resizer',
          description: 'Cambia le dimensioni.',
        },
        {
          label: 'Aggiungi testo a un\'immagine',
          to: '/tools/add-text-to-image',
          description: 'Didascalia o filigrana.',
        },
        {
          label: 'Filtri per immagini',
          to: '/tools/image-filters',
          description: 'Sepia, schizzo, rilievo e altro.',
        },
      ],
      embed: {
        title: 'Modifica i metadati di un\'immagine',
        description: 'Carica un\'immagine. La sezione metadati si apre in modalità personalizzata: compila titolo, autore, copyright, parole chiave, sostituisci o rimuovi la posizione GPS ed espandi i tag avanzati se ti serve. I pixel dell\'immagine restano come sono a meno che tu non cambi anche il formato.',
      },
    },
    'change-video-speed': {
      name: 'Cambia la velocità del video',
      h1: 'Cambia la velocità di un video online: accelera o rallenta',
      tagline: 'Crea un time-lapse a 2x, 4x o più, oppure rallenta una clip a 0,5x o 0,25x, con l\'audio sempre sincronizzato.',
      metaTitle: 'Cambia velocità video online gratis: accelera o slow motion | Media Manipulator',
      metaDescription: 'Cambia la velocità di un video online, gratis. Accelera un video a 1,5x, 2x o 4x per un time-lapse, oppure rallentalo a 0,5x o 0,25x. L\'audio resta sincronizzato. Output MP4, senza filigrana.',
      ogTitle: 'Cambia la velocità di un video online gratis',
      ogDescription: 'Accelera o rallenta qualsiasi video da 0,25x a 4x. L\'audio resta sincronizzato. Gratis, senza registrazione.',
      intro: 'Una registrazione dello schermo che si trascina, un tramonto che deve diventare un time-lapse di dieci secondi, un trick di skateboard che merita lo slow motion: cambiare la velocità di riproduzione è una delle modifiche video più comuni, e non dovrebbe richiedere un editor desktop. Media Manipulator ricalcola i tempi di immagine e suono sui nostri server con FFmpeg, da un quarto della velocità fino a quattro volte, ed esporta un MP4 che si riproduce al nuovo ritmo ovunque.',
      whatItDoes: [
        'Accelera (da 1,25x a 4x) o rallenta (da 0,25x a 0,9x) qualsiasi video.',
        'Ricalcola i tempi dell\'audio con una variazione di tempo che preserva l\'intonazione, così le voci restano naturali.',
        'Mantiene risoluzione e qualità; esporta in MP4 per impostazione predefinita o in qualsiasi contenitore supportato.',
        'Combinalo con taglio, ridimensionamento o regolazioni del colore nello stesso passaggio.',
      ],
      flowSteps: [
        {
          title: 'Carica il tuo video',
          description: 'Qualsiasi formato video comune.',
        },
        {
          title: 'Imposta la velocità',
          description: 'Da 0,25x a 4x; 2x è preselezionato.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg ricalcola i tempi di video e audio.',
        },
        {
          title: 'Scarica',
          description: 'Salva il nuovo MP4.',
        },
      ],
      advancedDetails: [
        'Il video usa setpts per scalare i timestamp di presentazione; l\'audio usa atempo, concatenato per i fattori fuori dall\'intervallo da 0,5 a 2,0.',
        'Rallentare non inventa fotogrammi; per uno slow motion fluido usa l\'interpolazione di fotogrammi con IA dopo aver rallentato la clip.',
        'Il frame rate viene preservato, quindi un time-lapse a 4x ha un quarto dei fotogrammi originali.',
      ],
      whyItMatters: [
        'Time-lapse e riepiloghi si guardano molto meglio tra 2x e 4x.',
        'Lo slow motion rende leggibili le clip sportive e d\'azione.',
        'Tutorial e registrazioni dello schermo spesso rendono meglio tra 1,25x e 1,5x.',
      ],
      useCases: [
        {
          title: 'Time-lapse',
          description: 'Condensa un\'ora di costruzione, cucina o pittura in pochi minuti.',
        },
        {
          title: 'Slow motion',
          description: 'Rallenta una clip sportiva o del tuo animale a metà velocità.',
        },
        {
          title: 'Tutorial più veloce',
          description: 'Accelera una registrazione dello schermo senza l\'effetto voce da scoiattolo.',
        },
        {
          title: 'Adatta a una traccia musicale',
          description: 'Porta una clip a 1,1x per farla coincidere con il ritmo.',
        },
      ],
      whyMediaManipulator: [
        'L\'audio viene ricalcolato preservando l\'intonazione, non lasciato indietro né trasformato in una voce da scoiattolo.',
        'Abbinalo a inversione, taglio e colore nello stesso modulo.',
      ],
      privacyNote: 'Il tuo video viene accelerato o rallentato da FFmpeg sul nostro server, con il tempo dell\'audio modificato di conseguenza. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Il file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'L\'audio resta sincronizzato?',
          answer: 'Sì. Il tempo dell\'audio viene scalato dello stesso fattore, preservando l\'intonazione.',
        },
        {
          question: 'Qual è la velocità massima?',
          answer: '4x più veloce e 0,25x più lento in un unico passaggio. Per andare oltre, passa di nuovo il risultato nello strumento.',
        },
        {
          question: 'Lo slow motion sarà fluido?',
          answer: 'Rallentare ripete i fotogrammi. Per uno slow motion davvero fluido, rallenta la clip qui e poi usa l\'interpolazione di fotogrammi con IA.',
        },
        {
          question: 'Posso invece silenziare l\'audio?',
          answer: 'Sì: usa prima lo strumento Rimuovi l\'audio da un video, oppure esporta in GIF, che non ha audio.',
        },
      ],
      related: [
        {
          label: 'Interpolazione di fotogrammi con IA',
          to: '/tools/ai-frame-interpolation',
          description: 'Slow motion fluido con fotogrammi generati.',
        },
        {
          label: 'Convertitore video',
          to: '/tools/video-converter',
          description: 'Converti tra formati video.',
        },
        {
          label: 'Inverti video',
          to: '/tools/reverse-video',
          description: 'Riproduci una clip al contrario.',
        },
        {
          label: 'Capovolgi video',
          to: '/tools/flip-video',
          description: 'Specchia in orizzontale o in verticale.',
        },
        {
          label: 'Stabilizza video',
          to: '/tools/stabilize-video',
          description: 'Attenua le riprese tremolanti.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso del file.',
        },
        {
          label: 'Taglia video',
          to: '/tools/video-trimmer',
          description: 'Taglia a un intervallo.',
        },
      ],
      embed: {
        title: 'Cambia la velocità di un video',
        description: 'Carica un video e imposta un moltiplicatore di velocità: sopra 1 è più veloce, sotto 1 è più lento. 2x è preselezionato. L\'audio viene ricalcolato di conseguenza, così una voce accelerata resta comprensibile.',
      },
    },
    'reverse-video': {
      name: 'Inverti video',
      h1: 'Inverti un video online gratis',
      tagline: 'Riproduci qualsiasi clip al contrario, con o senza l\'audio invertito, e se vuoi in modalità ping-pong, prima avanti e poi indietro.',
      metaTitle: 'Inverti video online gratis: al contrario, ping-pong | Media Manipulator',
      metaDescription: 'Inverti un video online, gratis. Riproduci un video al contrario, inverti anche l\'audio, oppure crea un loop ping-pong che va avanti e poi indietro. Output MP4 o GIF, senza filigrana né registrazione.',
      ogTitle: 'Inverti un video online gratis',
      ogDescription: 'Riproduci una clip al contrario o crea un loop avanti e poi indietro. Gratis, senza registrazione.',
      intro: 'L\'effetto del video al contrario è più vecchio di internet e funziona ancora: un vetro in frantumi che si ricompone, un tuffatore che balza fuori dalla piscina, una folla che si raduna all\'indietro. Media Manipulator inverte i fotogrammi e, se vuoi, l\'audio di qualsiasi clip sui nostri server con FFmpeg, e l\'opzione ping-pong aggiunge in coda la copia in avanti così il risultato si ripete senza stacchi, che è quello che la maggior parte degli usi social e GIF richiede.',
      whatItDoes: [
        'Inverte i fotogrammi video di qualsiasi clip.',
        'Inverte anche l\'audio, oppure lo elimina per un risultato muto.',
        'La modalità ping-pong riproduce avanti e poi indietro per un loop senza stacchi.',
        'Esporta MP4, WebM o una GIF animata.',
      ],
      flowSteps: [
        {
          title: 'Carica una clip',
          description: 'Le clip brevi funzionano meglio; l\'inversione carica l\'intera clip in memoria.',
        },
        {
          title: 'Scegli inversione o ping-pong',
          description: 'L\'inversione è preselezionata.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg inverte fotogrammi e audio.',
        },
        {
          title: 'Scarica',
          description: 'MP4 per il video, GIF per un loop.',
        },
      ],
      advancedDetails: [
        'L\'inversione mette in buffer ogni fotogramma della clip, quindi le clip molto lunghe o in 4K richiedono più tempo e più memoria; per risultati migliori taglia prima.',
        'L\'audio usa il filtro areverse; per una clip invertita muta, rimuovi prima l\'audio.',
        'Il ping-pong concatena il flusso in avanti e quello invertito, raddoppiando la durata.',
      ],
      whyItMatters: [
        'Le clip invertite e in stile boomerang sono un classico dei video brevi per i social.',
        'Un loop ping-pong nasconde lo stacco che un loop normale mostrerebbe.',
        'Invertire è anche un modo economico per creare una transizione "rewind".',
      ],
      useCases: [
        {
          title: 'Loop in stile boomerang',
          description: 'Trasforma una clip di due secondi in un avanti-e-indietro senza stacchi.',
        },
        {
          title: 'Rivelazione al contrario',
          description: 'Riproduci un unboxing o una costruzione al contrario.',
        },
        {
          title: 'Transizione rewind',
          description: 'Inverti qualche secondo per passare da una scena all\'altra.',
        },
        {
          title: 'GIF invertita',
          description: 'Esporta direttamente in GIF per chat e forum.',
        },
      ],
      whyMediaManipulator: [
        'Inversione e ping-pong con un solo interruttore, con l\'audio gestito correttamente.',
        'Taglia prima ed esporta in GIF nello stesso modulo.',
      ],
      privacyNote: 'La tua clip viene decodificata e riprodotta al contrario in un nuovo file da FFmpeg sul nostro server. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Il file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'Viene invertito anche l\'audio?',
          answer: 'Sì, per impostazione predefinita. Rimuovi prima l\'audio se vuoi una clip muta.',
        },
        {
          question: 'Che cos\'è il ping-pong?',
          answer: 'La clip va avanti e poi indietro, così si ripete in loop senza un salto visibile.',
        },
        {
          question: 'C\'è un limite di durata?',
          answer: 'L\'inversione tiene l\'intera clip in memoria. Le clip di uno o due minuti vanno bene; i video più lunghi vanno tagliati prima.',
        },
        {
          question: 'Posso ottenere una GIF?',
          answer: 'Sì. Scegli GIF come formato di output; è ideale per un loop ping-pong.',
        },
      ],
      related: [
        {
          label: 'Video in GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Crea una GIF in loop.',
        },
        {
          label: 'Convertitore video',
          to: '/tools/video-converter',
          description: 'Converti tra formati video.',
        },
        {
          label: 'Cambia la velocità del video',
          to: '/tools/change-video-speed',
          description: 'Time-lapse o slow motion.',
        },
        {
          label: 'Capovolgi video',
          to: '/tools/flip-video',
          description: 'Specchia in orizzontale o in verticale.',
        },
        {
          label: 'Stabilizza video',
          to: '/tools/stabilize-video',
          description: 'Attenua le riprese tremolanti.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso del file.',
        },
        {
          label: 'Taglia video',
          to: '/tools/video-trimmer',
          description: 'Taglia a un intervallo.',
        },
      ],
      embed: {
        title: 'Inverti un video',
        description: 'Carica una clip. L\'inversione è già attiva nella sezione Effetti temporali; attiva invece il ping-pong per un loop avanti e poi indietro. Esporta in MP4 o GIF.',
      },
    },
    'flip-video': {
      name: 'Capovolgi e specchia video',
      h1: 'Capovolgi o specchia un video online gratis',
      tagline: 'Specchia un video in orizzontale per correggere una webcam o un selfie invertiti, oppure capovolgilo in verticale, con un clic.',
      metaTitle: 'Capovolgi o specchia video online gratis | Media Manipulator',
      metaDescription: 'Capovolgi un video online, gratis. Specchia un video in orizzontale (per correggere selfie e riprese da webcam specchiati) o capovolgilo in verticale. Output MP4, senza filigrana né registrazione.',
      ogTitle: 'Capovolgi o specchia un video online gratis',
      ogDescription: 'Correggi un video selfie specchiato o capovolgi una clip a testa in giù. Gratis, senza registrazione.',
      intro: 'Le fotocamere frontali e le webcam spesso registrano un\'immagine specchiata: il testo si legge al contrario e la riga dei capelli è dal lato sbagliato. Specchiare la clip una volta la rimette a posto. Media Manipulator ribalta il video in orizzontale o in verticale sui nostri server con FFmpeg, ricodifica in modo che il ribaltamento sia impresso nei fotogrammi ed esporta un MP4 che si riproduce correttamente in ogni lettore.',
      whatItDoes: [
        'Specchia un video in orizzontale (sinistra-destra) o lo capovolge in verticale (alto-basso).',
        'Combinalo con una rotazione di 90°, 180° o 270° nello stesso passaggio.',
        'Imprime la trasformazione nei fotogrammi; nessuna dipendenza da un flag di rotazione.',
        'Esporta in MP4 per impostazione predefinita, o in qualsiasi contenitore supportato.',
      ],
      flowSteps: [
        {
          title: 'Carica un video',
          description: 'Qualsiasi formato comune.',
        },
        {
          title: 'Scegli un ribaltamento',
          description: 'L\'orizzontale è preselezionato; aggiungi il verticale o una rotazione.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg applica hflip/vflip e ricodifica.',
        },
        {
          title: 'Scarica',
          description: 'Salva l\'MP4 corretto.',
        },
      ],
      advancedDetails: [
        'Il ribaltamento orizzontale usa il filtro hflip, quello verticale vflip; entrambi sono senza perdita nella geometria e ricodificano i fotogrammi.',
        'Specchiatura più rotazione di 180° equivale a un ribaltamento verticale; il pannello ti permette di combinarli liberamente.',
        'L\'output MP4 usa H.264 + AAC + yuv420p + faststart.',
      ],
      whyItMatters: [
        'Un video selfie specchiato rende illeggibile il testo a schermo.',
        'Alcune action cam montate a testa in giù hanno bisogno di un ribaltamento verticale anziché di una rotazione.',
        'Una copia specchiata è un modo rapido per rendere più facile da seguire un tutorial di danza o di esercizi.',
      ],
      useCases: [
        {
          title: 'Correggi un selfie specchiato',
          description: 'Fai in modo che testo e loghi si leggano correttamente.',
        },
        {
          title: 'Montaggio a testa in giù',
          description: 'Capovolgi le riprese di una fotocamera montata al contrario.',
        },
        {
          title: 'Specchia per un tutorial',
          description: 'Specchia una dimostrazione così chi guarda può copiarla direttamente.',
        },
        {
          title: 'Abbina un\'inquadratura',
          description: 'Specchia una clip così il soggetto guarda dall\'altra parte.',
        },
      ],
      whyMediaManipulator: [
        'Ribaltamento e rotazione in un\'unica sezione di trasformazione, impressi nei fotogrammi.',
        'Taglio, ridimensionamento e colore nello stesso caricamento.',
      ],
      privacyNote: 'Il tuo video viene specchiato in orizzontale o in verticale da FFmpeg sul nostro server. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Il file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'Specchiare o capovolgere: qual è la differenza?',
          answer: 'Specchiare (ribaltamento orizzontale) scambia sinistra e destra. Il ribaltamento verticale scambia alto e basso.',
        },
        {
          question: 'Il ribaltamento è permanente?',
          answer: 'Sì. I fotogrammi vengono ricodificati con il ribaltamento applicato, così ogni lettore lo mostra.',
        },
        {
          question: 'Posso anche ruotare?',
          answer: 'Sì. La rotazione si trova nella stessa sezione Trasformazione, oppure usa lo strumento dedicato Ruota video.',
        },
        {
          question: 'Il ribaltamento riduce la qualità?',
          answer: 'La ricodifica ha un piccolo costo; scegli l\'alta qualità per renderlo trascurabile.',
        },
      ],
      related: [
        {
          label: 'Ruota video',
          to: '/tools/rotate-video',
          description: '90°, 180°, 270°.',
        },
        {
          label: 'Convertitore video',
          to: '/tools/video-converter',
          description: 'Converti tra formati video.',
        },
        {
          label: 'Cambia la velocità del video',
          to: '/tools/change-video-speed',
          description: 'Time-lapse o slow motion.',
        },
        {
          label: 'Inverti video',
          to: '/tools/reverse-video',
          description: 'Riproduci una clip al contrario.',
        },
        {
          label: 'Stabilizza video',
          to: '/tools/stabilize-video',
          description: 'Attenua le riprese tremolanti.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso del file.',
        },
        {
          label: 'Taglia video',
          to: '/tools/video-trimmer',
          description: 'Taglia a un intervallo.',
        },
      ],
      embed: {
        title: 'Capovolgi o specchia un video',
        description: 'Carica un video. Il ribaltamento orizzontale (specchio) è preselezionato nella sezione Trasformazione; attiva invece, o in aggiunta, il ribaltamento verticale. La rotazione è disponibile nella stessa sezione.',
      },
    },
    'stabilize-video': {
      name: 'Stabilizza video',
      h1: 'Stabilizza un video tremolante online gratis',
      tagline: 'Attenua il tremolio delle riprese a mano e il rimbalzo del camminare con uno stabilizzatore a due passaggi, senza treppiede né editor desktop.',
      metaTitle: 'Stabilizza video tremolanti online gratis | Media Manipulator',
      metaDescription: 'Stabilizzatore video online gratuito. Riduci il tremolio delle riprese a mano e il rimbalzo del camminare con l\'attenuazione del movimento di FFmpeg. Intensità regolabile, output MP4, senza filigrana né registrazione.',
      ogTitle: 'Stabilizza un video tremolante online gratis',
      ogDescription: 'Attenua il tremolio della fotocamera in qualsiasi clip. Gratis, senza registrazione.',
      intro: 'Le riprese a mano tremano, e un piccolo tremolio diventa grande su uno schermo grande. La stabilizzazione software traccia il movimento tra i fotogrammi, rende più fluido il percorso della fotocamera e ritaglia un po\' dai bordi per nascondere la correzione. Media Manipulator esegue lo stabilizzatore a compensazione del movimento di FFmpeg sui nostri server con intensità regolabile, così un vlog ripreso camminando o una clip del telefono con lo zoom esce visibilmente più stabile.',
      whatItDoes: [
        'Analizza il movimento tra un fotogramma e l\'altro e rende più fluido il percorso della fotocamera.',
        'Tremolio (quanto tremolio aspettarsi) e precisione (quanto a fondo cercare) regolabili.',
        'Ritaglia leggermente per nascondere la correzione; lo zoom viene applicato automaticamente.',
        'Esporta in MP4 per impostazione predefinita; combinalo con taglio e colore nello stesso passaggio.',
      ],
      flowSteps: [
        {
          title: 'Carica una clip tremolante',
          description: 'Qualsiasi formato comune.',
        },
        {
          title: 'Mantieni o regola l\'intensità',
          description: 'I valori predefiniti vanno bene per le riprese a mano con il telefono.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg stima e compensa il movimento.',
        },
        {
          title: 'Scarica',
          description: 'Confronta il risultato più stabile.',
        },
      ],
      advancedDetails: [
        'Usa il filtro deshake a compensazione del movimento di FFmpeg; il valore di tremolio imposta l\'intervallo di ricerca e la precisione la profondità della ricerca.',
        'La stabilizzazione non può correggere la sfocatura di movimento già presente nei fotogrammi; rimuove solo il tremolio tra uno e l\'altro.',
        'Aspettati un piccolo ritaglio ai bordi, proporzionale a quanto si è mossa la fotocamera.',
      ],
      whyItMatters: [
        'Le riprese stabili sembrano più professionali e sono più facili da guardare.',
        'Le clip del telefono riprese camminando sono il caso più comune e rispondono bene.',
        'Una clip stabilizzata si comprime meglio, perché tra un fotogramma e l\'altro cambia una parte minore dell\'immagine.',
      ],
      useCases: [
        {
          title: 'Vlog camminando',
          description: 'Togli il rimbalzo da una ripresa a mano mentre cammini e parli.',
        },
        {
          title: 'Video del telefono con zoom',
          description: 'Stabilizza una clip di un concerto o di animali selvatici ripresa con lo zoom al massimo.',
        },
        {
          title: 'Supporto per auto o bici',
          description: 'Riduci le vibrazioni di un supporto sul cruscotto o sul manubrio.',
        },
        {
          title: 'Prima di una GIF',
          description: 'Stabilizza prima, così il loop non trema.',
        },
      ],
      whyMediaManipulator: [
        'Vera compensazione del movimento, con l\'intensità esposta anziché nascosta.',
        'Taglio, velocità e colore nello stesso modulo.',
      ],
      privacyNote: 'Le tue riprese vengono analizzate per il tremolio e stabilizzate dal filtro deshake di FFmpeg sul nostro server. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Il file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'Ritaglierà il mio video?',
          answer: 'Leggermente. Lo stabilizzatore sposta i fotogrammi per annullare il tremolio e zooma un po\' per nascondere i bordi in movimento.',
        },
        {
          question: 'Può correggere la sfocatura?',
          answer: 'No. La sfocatura dentro un fotogramma non si può annullare; la stabilizzazione rende stabile solo il movimento tra i fotogrammi.',
        },
        {
          question: 'Quali impostazioni dovrei usare?',
          answer: 'Parti dai valori predefiniti. Aumenta il tremolio per riprese molto mosse; aumenta la precisione se il risultato continua a scivolare.',
        },
        {
          question: 'Funziona in 4K?',
          answer: 'Sì, ma l\'elaborazione richiede più tempo. Valuta di ridimensionare a 1080p nello stesso passaggio.',
        },
      ],
      related: [
        {
          label: 'Restauro video con IA',
          to: '/tools/ai-video-restoration',
          description: 'Riduci rumore e sfocatura e aumenta la risoluzione con l\'IA.',
        },
        {
          label: 'Convertitore video',
          to: '/tools/video-converter',
          description: 'Converti tra formati video.',
        },
        {
          label: 'Cambia la velocità del video',
          to: '/tools/change-video-speed',
          description: 'Time-lapse o slow motion.',
        },
        {
          label: 'Inverti video',
          to: '/tools/reverse-video',
          description: 'Riproduci una clip al contrario.',
        },
        {
          label: 'Capovolgi video',
          to: '/tools/flip-video',
          description: 'Specchia in orizzontale o in verticale.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso del file.',
        },
        {
          label: 'Taglia video',
          to: '/tools/video-trimmer',
          description: 'Taglia a un intervallo.',
        },
      ],
      embed: {
        title: 'Stabilizza un video',
        description: 'Carica una clip tremolante. La stabilizzazione è già attiva nella sezione Effetti temporali; regola tremolio e precisione se il valore predefinito è troppo lieve o ritaglia troppo.',
      },
    },
    'change-video-frame-rate': {
      name: 'Cambia il frame rate del video',
      h1: 'Cambia il frame rate di un video online',
      tagline: 'Converti un video a 24, 25, 30 o 60 fps, porta una clip da 60 a 30 fps per ottenere un file più piccolo, oppure adattalo al frame rate del tuo progetto.',
      metaTitle: 'Cambia il frame rate del video online (24, 30, 60 fps) | Media Manipulator',
      metaDescription: 'Convertitore di frame rate online gratuito. Porta un video a 24, 25, 30, 50 o 60 fps, riduci da 60 a 30 fps per un file più piccolo, oppure adattalo a una timeline di montaggio. Output MP4, senza registrazione.',
      ogTitle: 'Cambia il frame rate di un video online',
      ogDescription: 'Converti qualsiasi video a 24, 25, 30 o 60 fps. Gratis, senza registrazione.',
      intro: 'Il frame rate decide come un video si percepisce e quanto pesa. Il cinema è a 24 fps, la TV europea a 25, la maggior parte dei telefoni a 30 o 60, e mescolarli in una stessa timeline provoca scatti. Media Manipulator ricampiona qualsiasi video al frame rate che ti serve sui nostri server con FFmpeg, scartando o ripetendo i fotogrammi con esattezza, ed esporta in MP4. Quando vuoi più fotogrammi anziché meno, lo strumento di interpolazione di fotogrammi con IA genera quelli intermedi.',
      whatItDoes: [
        'Ricampiona un video a qualsiasi frame rate da 1 a 120 fps.',
        'Dimezza 60 fps a 30 per un file molto più piccolo, senza differenze visibili per la maggior parte dei contenuti.',
        'Adatta il video al frame rate di un progetto (24, 25, 29,97, 30, 50, 60) prima dell\'importazione in un editor.',
        'Mantiene invariati risoluzione, audio e durata.',
      ],
      flowSteps: [
        {
          title: 'Carica un video',
          description: 'Qualsiasi formato comune.',
        },
        {
          title: 'Imposta gli fps di destinazione',
          description: '30 è preselezionato.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg scarta o duplica i fotogrammi per raggiungere il valore.',
        },
        {
          title: 'Scarica',
          description: 'Salva l\'MP4 ricampionato.',
        },
      ],
      advancedDetails: [
        'Usa il filtro fps: i fotogrammi vengono scartati o duplicati in base al timestamp, così durata e sincronizzazione dell\'audio sono preservate con esattezza.',
        'Salire (da 30 a 60) duplica i fotogrammi e non appare più fluido; usa l\'interpolazione di fotogrammi con IA per fotogrammi davvero nuovi.',
        'Scendere elimina dati e non è reversibile; conserva l\'originale.',
      ],
      whyItMatters: [
        'Una clip del telefono a 60 fps pesa il doppio di una a 30 fps, a parità di qualità visibile per la maggior parte dei contenuti.',
        'Frame rate misti in una timeline di montaggio causano scatti; uniformarli prima lo evita.',
        'Alcune piattaforme e dispositivi limitano o richiedono un frame rate specifico.',
      ],
      useCases: [
        {
          title: 'Riduci una clip a 60 fps',
          description: 'Scendi a 30 fps per email, chat o un caricamento più leggero.',
        },
        {
          title: 'Uniforma per il montaggio',
          description: 'Adatta ogni clip al frame rate del progetto.',
        },
        {
          title: 'Look cinematografico',
          description: 'Converti a 24 fps per una cadenza da cinema.',
        },
        {
          title: 'Consegna per la TV',
          description: 'Converti a 25 o 50 fps per le regioni PAL.',
        },
      ],
      whyMediaManipulator: [
        'Ricampionamento esatto basato sui timestamp, con durata e audio intatti.',
        'Interpolazione con IA disponibile quando ti servono più fotogrammi anziché meno.',
      ],
      privacyNote: 'Il tuo video viene riportato al frame rate che scegli da FFmpeg sul nostro server. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Il file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'Il video diventa più corto o più lungo?',
          answer: 'No. La durata viene preservata; i fotogrammi vengono scartati o ripetuti per raggiungere il nuovo frame rate.',
        },
        {
          question: 'Da 30 a 60 fps sembrerà più fluido?',
          answer: 'Non con questo strumento, che duplica i fotogrammi. Usa l\'interpolazione di fotogrammi con IA per generare veri fotogrammi intermedi.',
        },
        {
          question: 'Quale frame rate dovrei scegliere?',
          answer: '30 fps per la maggior parte dei contenuti web e da telefono, 24 per un look cinematografico, 25 o 50 per la TV PAL, 60 per gaming e sport.',
        },
        {
          question: 'L\'audio viene alterato?',
          answer: 'No. Il flusso audio viene copiato o ricodificato con gli stessi tempi.',
        },
      ],
      related: [
        {
          label: 'Interpolazione di fotogrammi con IA',
          to: '/tools/ai-frame-interpolation',
          description: 'Genera fotogrammi fino a 120 fps.',
        },
        {
          label: 'Convertitore video',
          to: '/tools/video-converter',
          description: 'Converti tra formati video.',
        },
        {
          label: 'Cambia la velocità del video',
          to: '/tools/change-video-speed',
          description: 'Time-lapse o slow motion.',
        },
        {
          label: 'Inverti video',
          to: '/tools/reverse-video',
          description: 'Riproduci una clip al contrario.',
        },
        {
          label: 'Capovolgi video',
          to: '/tools/flip-video',
          description: 'Specchia in orizzontale o in verticale.',
        },
        {
          label: 'Stabilizza video',
          to: '/tools/stabilize-video',
          description: 'Attenua le riprese tremolanti.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso del file.',
        },
        {
          label: 'Taglia video',
          to: '/tools/video-trimmer',
          description: 'Taglia a un intervallo.',
        },
      ],
      embed: {
        title: 'Cambia il frame rate di un video',
        description: 'Carica un video e imposta il frame rate di destinazione nella sezione Effetti temporali; 30 fps è preselezionato. I fotogrammi vengono scartati o duplicati per raggiungere il valore scelto. Per un frame rate più alto con fotogrammi intermedi generati, usa invece l\'interpolazione di fotogrammi con IA.',
      },
    },
    'adjust-video-color': {
      name: 'Regola luminosità e colori del video',
      h1: 'Regola luminosità, contrasto e colori di un video online',
      tagline: 'Schiarisci una clip scura, aggiungi contrasto e saturazione, cambia la tonalità oppure applica una sfocatura o un look artistico, con cursori e anteprima in tempo reale.',
      metaTitle: 'Regola luminosità, contrasto e saturazione video online | Media Manipulator',
      metaDescription: 'Regola i colori di un video online, gratis. Correggi luminosità, contrasto, saturazione, tonalità, gamma ed esposizione, aggiungi sfocatura o nitidezza, oppure applica un look artistico. Output MP4, senza filigrana né registrazione.',
      ogTitle: 'Regola luminosità e colori di un video online',
      ogDescription: 'Schiarisci, aggiungi contrasto, intensifica i colori o applica un look a qualsiasi clip. Gratis, senza registrazione.',
      intro: 'Una clip girata al chiuso esce scura e arancione; un video piatto del telefono vuole più contrasto e colore; una clip per una miniatura ha bisogno di un look stilizzato. Media Manipulator applica correzioni di luminosità, contrasto, saturazione, tonalità, gamma ed esposizione sui nostri server con FFmpeg, insieme a sfocatura, nitidezza, grana e una serie di filtri artistici, ed esporta in MP4. È un passaggio di correzione del colore senza aprire un editor.',
      whatItDoes: [
        'Cursori di luminosità, contrasto, saturazione e tonalità da -100 a +100.',
        'Gamma, esposizione, ombre e alte luci per un controllo tonale più fine.',
        'Sfocatura gaussiana e di movimento, nitidezza a maschera di contrasto, grana pellicola e rumore.',
        'Look artistici come pittura a olio, schizzo e vintage.',
        'Combinalo con taglio, ridimensionamento, velocità o ribaltamento nello stesso passaggio.',
      ],
      flowSteps: [
        {
          title: 'Carica una clip',
          description: 'Qualsiasi formato comune.',
        },
        {
          title: 'Muovi i cursori',
          description: 'Luminosità, contrasto, saturazione, tonalità e altro.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg applica il filtro eq e gli effetti.',
        },
        {
          title: 'Scarica',
          description: 'Salva l\'MP4 con il colore corretto.',
        },
      ],
      advancedDetails: [
        'Luminosità, contrasto, saturazione e gamma corrispondono al filtro eq di FFmpeg; la tonalità usa il filtro hue in gradi.',
        'La nitidezza è unsharp con raggio, intensità e soglia; la sfocatura è gblur oppure una sfocatura di movimento direzionale.',
        'Per una LUT 3D, il chroma key o la correzione colore clip per clip su una timeline, usa Darkroom.',
      ],
      whyItMatters: [
        'La maggior parte delle riprese da telefono trae beneficio da un leggero aumento di contrasto e saturazione.',
        'Correggere l\'esposizione prima del caricamento evita che la ricodifica della piattaforma la peggiori.',
        'Un look coerente tra le clip fa sembrare finito un montaggio.',
      ],
      useCases: [
        {
          title: 'Schiarisci una clip scura',
          description: 'Alza esposizione e ombre nelle riprese al chiuso.',
        },
        {
          title: 'Dai carattere a una clip piatta',
          description: 'Aggiungi contrasto e saturazione a un video del telefono dall\'aspetto log.',
        },
        {
          title: 'Correggi una dominante di colore',
          description: 'Sposta la tonalità per eliminare una tinta arancione o verde.',
        },
        {
          title: 'Stilizza per i social',
          description: 'Applica look vintage, schizzo o pittura a olio.',
        },
      ],
      whyMediaManipulator: [
        'Controlli tonali, di colore e di effetti in un\'unica sezione, non un singolo pulsante "migliora".',
        'Usa Darkroom per la correzione colore su timeline con le LUT quando ti serve di più.',
      ],
      privacyNote: 'Luminosità, contrasto, saturazione e gamma del tuo video vengono modificati da FFmpeg sul nostro server. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Il file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'Posso vedere un\'anteprima del risultato?',
          answer: 'I cursori mostrano i loro valori; la correzione completa viene applicata alla conversione. Taglia a pochi secondi per provare rapidamente, poi elabora l\'intera clip.',
        },
        {
          question: 'Posso applicare una LUT?',
          answer: 'Non qui. Darkroom, il nostro editor multitraccia, supporta le LUT 3D e la correzione colore clip per clip.',
        },
        {
          question: 'Correggerà le riprese sovraesposte?',
          answer: 'Può abbassare le alte luci, ma i dettagli bruciati in bianco non si possono recuperare.',
        },
        {
          question: 'Posso aumentare la nitidezza di una clip morbida?',
          answer: 'Sì. Usa i controlli della maschera di contrasto; per un vero recupero dei dettagli prova il restauro video con IA.',
        },
      ],
      related: [
        {
          label: 'Editor video Darkroom',
          to: '/tools/content-studio',
          description: 'Correggi il colore con le LUT su una timeline.',
        },
        {
          label: 'Restauro video con IA',
          to: '/tools/ai-video-restoration',
          description: 'Riduci il rumore e aumenta la risoluzione con l\'IA.',
        },
        {
          label: 'Convertitore video',
          to: '/tools/video-converter',
          description: 'Converti tra formati video.',
        },
        {
          label: 'Cambia la velocità del video',
          to: '/tools/change-video-speed',
          description: 'Time-lapse o slow motion.',
        },
        {
          label: 'Inverti video',
          to: '/tools/reverse-video',
          description: 'Riproduci una clip al contrario.',
        },
        {
          label: 'Capovolgi video',
          to: '/tools/flip-video',
          description: 'Specchia in orizzontale o in verticale.',
        },
        {
          label: 'Stabilizza video',
          to: '/tools/stabilize-video',
          description: 'Attenua le riprese tremolanti.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso del file.',
        },
        {
          label: 'Taglia video',
          to: '/tools/video-trimmer',
          description: 'Taglia a un intervallo.',
        },
      ],
      embed: {
        title: 'Regola il colore di un video',
        description: 'Carica una clip. La sezione Effetti visivi si apre con i cursori di luminosità, contrasto, saturazione, tonalità, gamma ed esposizione, oltre a sfocatura, nitidezza, rumore e look artistici. Esporta in MP4.',
      },
    },
    'convert-video-to-hevc': {
      name: 'Converti video in HEVC (H.265)',
      h1: 'Converti un video in HEVC / H.265 online',
      tagline: 'Ricodifica qualsiasi video in H.265 per ottenere circa metà delle dimensioni dell\'H.264 a parità di qualità, ideale per archiviazione, 4K e dispositivi moderni.',
      metaTitle: 'Converti video in HEVC (H.265) online gratis | Media Manipulator',
      metaDescription: 'Convertitore H.265 / HEVC online gratuito. Ricodifica MP4, MOV, MKV o WebM in HEVC per circa la metà delle dimensioni a parità di qualità. Scegli un preset di qualità. Senza filigrana né registrazione.',
      ogTitle: 'Converti un video in HEVC / H.265 online',
      ogDescription: 'Dimezza le dimensioni di un video con H.265. Gratis, senza registrazione.',
      intro: 'HEVC, chiamato anche H.265, è il successore di H.264. A parità di qualità visiva richiede circa dal 40 al 50 percento di bit in meno, ed è per questo che i telefoni registrano il 4K in questo formato e che è il formato preferito per archiviare le riprese. Media Manipulator ricodifica qualsiasi video in HEVC sui nostri server con l\'encoder x265 di FFmpeg al livello di qualità che scegli, in un contenitore MP4 che iPhone, Mac, Windows 10+, Android e le TV moderne riproducono tutti.',
      whatItDoes: [
        'Ricodifica qualsiasi video in ingresso come H.265 in un contenitore MP4.',
        'Tre preset di qualità mappati su valori CRF; la dimensione del file si dimezza circa rispetto all\'H.264.',
        'Mantiene risoluzione e frame rate; facoltativamente riduce il 4K a 1080p per un file molto più piccolo.',
        'L\'audio viene ricodificato in AAC.',
      ],
      flowSteps: [
        {
          title: 'Carica un video',
          description: 'Qualsiasi formato comune, incluso MP4 H.264.',
        },
        {
          title: 'Scegli una qualità',
          description: 'File più piccolo, bilanciato o alta qualità.',
        },
        {
          title: 'Converti',
          description: 'x265 codifica sui nostri server; più lento dell\'H.264.',
        },
        {
          title: 'Scarica',
          description: 'Salva il file .mp4 con HEVC all\'interno.',
        },
      ],
      advancedDetails: [
        'Codificato con libx265 a CRF 28 (bilanciato), 32 (file più piccolo) o 24 (alta qualità), preset medium, tag hvc1 per la compatibilità con Apple.',
        'La codifica HEVC è diverse volte più lenta dell\'H.264; i file 4K lunghi richiedono minuti.',
        'Browser: Safari ed Edge riproducono HEVC; Chrome e Firefox in genere no. Mantieni H.264 per gli embed web.',
      ],
      whyItMatters: [
        'Metà dello spazio a parità di qualità, sommato su un\'intera libreria, fa la differenza.',
        'La distribuzione in 4K e HDR è standardizzata su HEVC per la maggior parte dei dispositivi.',
        'I file più piccoli si caricano e si sincronizzano più in fretta.',
      ],
      useCases: [
        {
          title: 'Archivia le riprese',
          description: 'Dimezza le dimensioni di un rullino senza perdite visibili.',
        },
        {
          title: 'Condividi in 4K',
          description: 'Rendi una clip 4K abbastanza piccola da inviare.',
        },
        {
          title: 'Ecosistema Apple',
          description: 'Allineati ai file HEVC che gli iPhone già registrano.',
        },
        {
          title: 'Libera spazio su un disco',
          description: 'Converti le vecchie registrazioni H.264 in HEVC.',
        },
      ],
      whyMediaManipulator: [
        'x265 con preset CRF sensati e tag compatibile con Apple.',
        'Lo stesso pannello comprime in H.264, VP9 o AV1 se invece ti servono quelli.',
      ],
      privacyNote: 'Il tuo video viene ricodificato in H.265 (HEVC) da FFmpeg sul nostro server. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Il file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'HEVC si riproduce ovunque?',
          answer: 'iPhone, Mac, Windows 10+, Android 5+, le TV moderne e Safari/Edge lo riproducono. Chrome, Firefox e i dispositivi più vecchi di solito no; per quelli mantieni H.264.',
        },
        {
          question: 'Quanto sarà più piccolo il file?',
          answer: 'In genere dal 40 al 50 percento più piccolo dell\'H.264 a parità di qualità; di più per i contenuti semplici.',
        },
        {
          question: 'La qualità è peggiore?',
          answer: 'Con il preset bilanciato la differenza non è visibile per la maggior parte dei contenuti. Scegli l\'alta qualità per le riprese che modificherai ancora.',
        },
        {
          question: 'Perché è lento?',
          answer: 'x265 fa molto più lavoro per fotogramma rispetto a x264. È il prezzo del file più piccolo.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'La codifica HEVC richiede molta CPU; aspettati diversi minuti per sorgenti lunghe o in 4K.',
        ],
      },
      related: [
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Compressione H.264, VP9 o AV1.',
        },
        {
          label: 'Convertitore video',
          to: '/tools/video-converter',
          description: 'MP4 H.264 standard.',
        },
        {
          label: 'Convertitore video',
          to: '/tools/video-converter',
          description: 'Converti tra formati video.',
        },
        {
          label: 'Cambia la velocità del video',
          to: '/tools/change-video-speed',
          description: 'Time-lapse o slow motion.',
        },
        {
          label: 'Inverti video',
          to: '/tools/reverse-video',
          description: 'Riproduci una clip al contrario.',
        },
        {
          label: 'Capovolgi video',
          to: '/tools/flip-video',
          description: 'Specchia in orizzontale o in verticale.',
        },
        {
          label: 'Stabilizza video',
          to: '/tools/stabilize-video',
          description: 'Attenua le riprese tremolanti.',
        },
        {
          label: 'Taglia video',
          to: '/tools/video-trimmer',
          description: 'Taglia a un intervallo.',
        },
      ],
      embed: {
        title: 'Converti un video in HEVC',
        description: 'Carica un video. Il codec è impostato su H.265 in un contenitore MP4 con il preset bilanciato; scegli invece file più piccolo o alta qualità. I dispositivi più vecchi e alcuni browser non riproducono HEVC; per quelli conserva una copia H.264.',
      },
    },
    'convert-audio-to-wav': {
      name: 'Converti audio in WAV',
      h1: 'Converti audio in WAV online gratis',
      tagline: 'Trasforma MP3, M4A, WAV, OGG, FLAC e qualsiasi altro file audio in WAV senza perdere nulla.',
      metaTitle: 'Converti audio in WAV online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da audio a WAV. Carica MP3, WAV, M4A, OGG, FLAC o AAC e scarica un WAV. Output senza perdita. Senza filigrana né registrazione. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      ogTitle: 'Converti audio in WAV online gratis',
      ogDescription: 'Carica qualsiasi file audio e scarica un WAV. Senza perdita. Gratis, senza registrazione.',
      intro: 'WAV è audio PCM non compresso: ogni campione viene memorizzato così com\'è, quindi non si perde nulla e ogni editor, DAW e campionatore lo apre all\'istante. Media Manipulator converte qualsiasi formato audio comune in WAV con un solo caricamento, mantenendo frequenza di campionamento e disposizione dei canali a meno che tu non li cambi, e offre taglio, normalizzazione, EQ e gli strumenti di pulizia con IA nello stesso modulo.',
      whatItDoes: [
        'Converte MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3 e WMA in WAV.',
        'Conserva ogni campione: l\'output si decodifica esattamente in quello che è entrato.',
        'Taglio, volume, normalizzazione, EQ ed effetti possono essere applicati prima che il PCM venga scritto.',
        'La pulizia con IA è nello stesso modulo: rimuovi il rumore di fondo, ripulisci una voce, oppure isola o rimuovi le parti vocali prima di salvare in WAV.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'audio',
          description: 'Qualsiasi file audio comune, compresso o no.',
        },
        {
          title: 'Regola se necessario',
          description: 'Taglia, normalizza o applica effetti.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg codifica il WAV sui nostri server.',
        },
        {
          title: 'Scarica',
          description: 'Salva il file WAV.',
        },
      ],
      advancedDetails: [
        'L\'output WAV viene codificato con l\'encoder nativo pcm_s16le di FFmpeg alla frequenza di campionamento della sorgente.',
        'Convertire un MP3 lossy in WAV non ripristina i dettagli che l\'encoder MP3 ha scartato; evita soltanto ulteriori perdite.',
        'La copertina dell\'album in una sorgente MP3 o M4A viene riconosciuta come immagine fissa, così la convalida non scambia il file per un video.',
      ],
      whyItMatters: [
        'Montaggio o mastering: WAV è il formato che gli editor audio vogliono, senza passaggio di decodifica e senza perdita di generazione.',
        'Archiviazione di un master o di una registrazione sul campo.',
        'Campionatori, motori di gioco e sistemi broadcast che richiedono PCM.',
      ],
      useCases: [
        {
          title: 'Cambia formato per un dispositivo',
          description: 'Crea una copia WAV per un lettore che ne ha bisogno.',
        },
        {
          title: 'Prepara per il montaggio',
          description: 'Consegna un file senza perdita a una DAW o a un editor video.',
        },
        {
          title: 'Un file alla volta',
          description: 'Trasforma una cartella di memo vocali in WAV uno alla volta, tagliando ciascuno man mano.',
        },
        {
          title: 'Ripulisci strada facendo',
          description: 'Elimina il fruscio da una registrazione sul campo mentre diventa un master non compresso.',
        },
      ],
      whyMediaManipulator: [
        'Frequenza di campionamento e disposizione dei canali vengono mantenute a meno che tu non scelga diversamente.',
        'Normalizza e taglia una take nello stesso caricamento che crea il WAV.',
      ],
      privacyNote: 'Il tuo audio viene decodificato da FFmpeg sul nostro server e scritto come WAV PCM non compresso. Nessun servizio audio esterno è coinvolto. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Ottieni un nuovo file; il caricamento stesso non viene modificato.',
      faq: [
        {
          question: 'Che cos\'è il WAV?',
          answer: 'WAV è audio PCM non compresso: ogni campione viene memorizzato così com\'è, quindi non si perde nulla e ogni editor, DAW e campionatore lo apre all\'istante.',
        },
        {
          question: 'Convertire in WAV migliorerà il suono?',
          answer: 'No. Convertire un MP3 lossy in WAV non ripristina i dettagli che l\'encoder MP3 ha scartato; evita soltanto ulteriori perdite.',
        },
        {
          question: 'Posso tagliare l\'audio mentre lo converto in WAV?',
          answer: 'Sì. Imposta inizio e fine nella sezione di taglio e solo quell\'intervallo viene scritto nel WAV.',
        },
        {
          question: 'Il mio MP3 ha una copertina. Può comunque diventare un WAV?',
          answer: 'Sì. La copertina viene riconosciuta come immagine anziché come traccia video, così il caricamento viene accettato e l\'audio viene decodificato in PCM come al solito.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Output senza perdita; la dimensione del file dipende da durata e frequenza di campionamento.',
        ],
      },
      related: [
        {
          label: 'Convertitore audio',
          to: '/tools/audio-converter',
          description: 'Converti tra tutti i formati audio comuni.',
        },
        {
          label: 'Cambia la velocità dell\'audio',
          to: '/tools/change-audio-speed',
          description: 'Accelera o rallenta una registrazione.',
        },
        {
          label: 'Cambia l\'intonazione dell\'audio',
          to: '/tools/change-audio-pitch',
          description: 'Sposta la tonalità verso l\'alto o verso il basso.',
        },
        {
          label: 'Normalizza audio',
          to: '/tools/normalize-audio',
          description: 'Uniforma il volume.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Rimozione del rumore con IA.',
        },
        {
          label: 'Rimuovi la voce da una canzone',
          to: '/tools/remove-vocals-from-song',
          description: 'Crea una base strumentale.',
        },
      ],
      embed: {
        title: 'Converti audio in WAV',
        description: 'Carica qualsiasi file audio. L\'output è fissato su WAV; frequenza di campionamento e canali vengono mantenuti a meno che tu non li cambi, poi premi Converti.',
      },
    },
    'convert-audio-to-flac': {
      name: 'Converti audio in FLAC',
      h1: 'Converti audio in FLAC online gratis',
      tagline: 'Trasforma MP3, M4A, WAV, OGG, FLAC e qualsiasi altro file audio in FLAC senza perdere nulla.',
      metaTitle: 'Converti audio in FLAC online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da audio a FLAC. Carica MP3, WAV, M4A, OGG, FLAC o AAC e scarica un FLAC. Output senza perdita. Senza filigrana né registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti audio in FLAC online gratis',
      ogDescription: 'Carica qualsiasi file audio e scarica un FLAC. Senza perdita. Gratis, senza registrazione.',
      intro: 'FLAC comprime l\'audio senza perdere nulla, in genere dal 50 al 70 per cento delle dimensioni del WAV, e si decodifica in una copia identica bit per bit. Media Manipulator converte qualsiasi formato audio comune in FLAC con un solo caricamento, mantenendo frequenza di campionamento e disposizione dei canali a meno che tu non le cambi, e offre taglio, normalizzazione, EQ e gli strumenti di pulizia IA nello stesso modulo.',
      whatItDoes: [
        'Converte MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3 e WMA in FLAC.',
        'Conserva ogni campione: l\'output si decodifica esattamente in ciò che è entrato.',
        'Volume, taglio, normalizzazione ed EQ possono essere applicati prima che FLAC comprima il risultato.',
        'Rimozione del rumore, pulizia della voce e isolamento della voce girano sullo stesso caricamento se vuoi una copia senza perdita ripulita.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'audio',
          description: 'WAV, PCM in stile AIFF, MP3, M4A e tutti gli altri.',
        },
        {
          title: 'Regola se serve',
          description: 'Taglia, normalizza o applica effetti.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg codifica il FLAC sui nostri server.',
        },
        {
          title: 'Scarica',
          description: 'Salva il file FLAC.',
        },
      ],
      advancedDetails: [
        'L\'output FLAC viene codificato con l\'encoder flac nativo di FFmpeg alla frequenza di campionamento della sorgente.',
        'Un FLAC creato da un MP3 non è migliore dell\'MP3; FLAC conserva soltanto ciò che c\'è già.',
        'Un MP3 o M4A con copertina incorporata supera la convalida: la copertina viene trattata come immagine, non come flusso video.',
      ],
      whyItMatters: [
        'Librerie musicali senza perdita che occupano metà dello spazio del WAV.',
        'Inviare un master a un collaboratore senza un allegato da 100 MB.',
        'Archiviazione a lungo termine con checksum integrati nel formato.',
      ],
      useCases: [
        {
          title: 'Cambia formato per un dispositivo',
          description: 'Crea una copia FLAC per un lettore che la richiede.',
        },
        {
          title: 'Prepara per il montaggio',
          description: 'Consegna un file senza perdita a una DAW o a un editor video.',
        },
        {
          title: 'Un file alla volta',
          description: 'Archivia una serie di registrazioni senza perdita, un caricamento ciascuna.',
        },
        {
          title: 'Pulisci lungo la strada',
          description: 'Rimuovi prima il rumore di fondo e conserva il risultato ripulito come FLAC.',
        },
      ],
      whyMediaManipulator: [
        'Scegli una frequenza di campionamento o una disposizione dei canali, oppure lasciale entrambe come nella sorgente.',
        'Livella un master troppo basso e archivialo come FLAC in un solo passaggio.',
      ],
      privacyNote: 'Il tuo audio viene compresso senza perdita in FLAC da FFmpeg sul nostro server. Nessun servizio audio esterno è coinvolto. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Ottieni un nuovo file; il file caricato non viene modificato.',
      faq: [
        {
          question: 'Che cos\'è FLAC?',
          answer: 'FLAC comprime l\'audio senza perdere nulla, in genere dal 50 al 70 per cento delle dimensioni del WAV, e si decodifica in una copia identica bit per bit.',
        },
        {
          question: 'Convertire in FLAC migliora il suono?',
          answer: 'No. Un FLAC creato da un MP3 non è migliore dell\'MP3; FLAC conserva soltanto ciò che c\'è già.',
        },
        {
          question: 'Posso tagliare l\'audio mentre lo converto in FLAC?',
          answer: 'Sì. La sezione di taglio imposta un inizio e una fine, e FLAC codifica solo quell\'intervallo.',
        },
        {
          question: 'Un MP3 con copertina si converte in FLAC?',
          answer: 'Sì. La copertina incorporata viene letta come immagine, non come video, quindi la convalida passa e l\'audio viene codificato normalmente.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Output senza perdita; le dimensioni del file dipendono da durata e frequenza di campionamento.',
        ],
      },
      related: [
        {
          label: 'Convertitore audio',
          to: '/tools/audio-converter',
          description: 'Converti tra tutti i formati audio più comuni.',
        },
        {
          label: 'Cambia la velocità dell\'audio',
          to: '/tools/change-audio-speed',
          description: 'Accelera o rallenta una registrazione.',
        },
        {
          label: 'Cambia l\'intonazione dell\'audio',
          to: '/tools/change-audio-pitch',
          description: 'Sposta la tonalità verso l\'alto o verso il basso.',
        },
        {
          label: 'Normalizza audio',
          to: '/tools/normalize-audio',
          description: 'Uniforma il loudness.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Rimozione del rumore con IA.',
        },
        {
          label: 'Rimuovi la voce da una canzone',
          to: '/tools/remove-vocals-from-song',
          description: 'Crea una base strumentale.',
        },
      ],
      embed: {
        title: 'Converti audio in FLAC',
        description: 'Carica qualsiasi file audio. L\'output è bloccato su FLAC; frequenza di campionamento e canali vengono mantenuti a meno che tu non li cambi, poi premi Converti.',
      },
    },
    'convert-audio-to-ogg': {
      name: 'Converti audio in OGG',
      h1: 'Converti audio in OGG online gratis',
      tagline: 'Trasforma MP3, M4A, WAV, OGG, FLAC e qualsiasi altro file audio in OGG con il bitrate che scegli.',
      metaTitle: 'Converti audio in OGG online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da audio a OGG. Carica MP3, WAV, M4A, OGG, FLAC o AAC e scarica un OGG. Scegli il bitrate. Senza filigrana né registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti audio in OGG online gratis',
      ogDescription: 'Carica qualsiasi file audio e scarica un OGG. Scegli il bitrate. Gratis, senza registrazione.',
      intro: 'OGG Vorbis è un formato con perdita libero e privo di brevetti che suona meglio dell\'MP3 allo stesso bitrate ed è nativo nei browser, su Android e nei motori di gioco. Media Manipulator converte qualsiasi formato audio comune in OGG con un solo caricamento, mantenendo frequenza di campionamento e disposizione dei canali a meno che tu non le cambi, e offre taglio, normalizzazione, EQ e gli strumenti di pulizia IA nello stesso modulo.',
      whatItDoes: [
        'Converte MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3 e WMA in OGG.',
        'Ti permette di scegliere bitrate, frequenza di campionamento e disposizione dei canali.',
        'Taglio, volume, normalizzazione del loudness ed EQ avvengono nello stesso passaggio FFmpeg della codifica Vorbis.',
        'Pulisci una voce o rimuovi il rumore di fondo con l\'IA prima che parta l\'encoder Vorbis.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'audio',
          description: 'Un MP3, WAV, FLAC o altro file audio per il tuo gioco o sito.',
        },
        {
          title: 'Regola se serve',
          description: 'Scegli il bitrate; taglia o applica effetti.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg codifica l\'OGG sui nostri server.',
        },
        {
          title: 'Scarica',
          description: 'Salva il file OGG.',
        },
      ],
      advancedDetails: [
        'L\'output OGG usa l\'encoder libvorbis di FFmpeg; 192 kbps è il valore predefinito e una scelta sicura per la musica.',
        'I dispositivi Apple e alcune autoradio non riproducono OGG; per quelli usa M4A o MP3.',
        'La copertina nella sorgente viene riconosciuta come immagine allegata e non fa scattare il controllo sulla traccia video.',
      ],
      whyItMatters: [
        'Risorse sonore per giochi e app, dove contano file piccoli e decodifica senza royalty.',
        'Audio web che deve riprodursi in Firefox e Chrome senza licenze.',
        'File di podcast o musica per lettori Linux e Android.',
      ],
      useCases: [
        {
          title: 'Cambia formato per un dispositivo',
          description: 'Crea una copia OGG per un lettore che la richiede.',
        },
        {
          title: 'Prepara per il montaggio',
          description: 'Crea un file piccolo e compatibile per un progetto.',
        },
        {
          title: 'Un file alla volta',
          description: 'Prepara gli effetti sonori per un motore di gioco un file alla volta.',
        },
        {
          title: 'Pulisci lungo la strada',
          description: 'Togli il ronzio da una registrazione prima di distribuirla come risorsa OGG.',
        },
      ],
      whyMediaManipulator: [
        'Bitrate, frequenza di campionamento e canali li imposti tu per ogni OGG.',
        'Taglia il silenzio da un effetto sonoro mentre diventa OGG.',
      ],
      privacyNote: 'Il tuo audio viene codificato in OGG Vorbis da FFmpeg sul nostro server. Nessun servizio audio esterno è coinvolto. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Ottieni un nuovo file; il file caricato non viene modificato.',
      faq: [
        {
          question: 'Che cos\'è OGG?',
          answer: 'OGG Vorbis è un formato con perdita libero e privo di brevetti che suona meglio dell\'MP3 allo stesso bitrate ed è nativo nei browser, su Android e nei motori di gioco.',
        },
        {
          question: 'Convertire in OGG migliora il suono?',
          answer: 'No. I dispositivi Apple e alcune autoradio non riproducono OGG; per quelli usa M4A o MP3.',
        },
        {
          question: 'Posso tagliare l\'audio mentre lo converto in OGG?',
          answer: 'Sì. Segna inizio e fine e l\'OGG conterrà solo quella parte.',
        },
        {
          question: 'Posso convertire in OGG un M4A con la copertina dell\'album?',
          answer: 'Sì. La copertina viene vista come immagine allegata e non come traccia video, quindi il lavoro prosegue e produce un Vorbis solo audio.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Output con perdita; il bitrate che scegli determina le dimensioni.',
        ],
      },
      related: [
        {
          label: 'Convertitore audio',
          to: '/tools/audio-converter',
          description: 'Converti tra tutti i formati audio più comuni.',
        },
        {
          label: 'Cambia la velocità dell\'audio',
          to: '/tools/change-audio-speed',
          description: 'Accelera o rallenta una registrazione.',
        },
        {
          label: 'Cambia l\'intonazione dell\'audio',
          to: '/tools/change-audio-pitch',
          description: 'Sposta la tonalità verso l\'alto o verso il basso.',
        },
        {
          label: 'Normalizza audio',
          to: '/tools/normalize-audio',
          description: 'Uniforma il loudness.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Rimozione del rumore con IA.',
        },
        {
          label: 'Rimuovi la voce da una canzone',
          to: '/tools/remove-vocals-from-song',
          description: 'Crea una base strumentale.',
        },
      ],
      embed: {
        title: 'Converti audio in OGG',
        description: 'Carica qualsiasi file audio. L\'output è bloccato su OGG; scegli bitrate, frequenza di campionamento e canali, poi premi Converti.',
      },
    },
    'convert-audio-to-m4a': {
      name: 'Converti audio in M4A / AAC',
      h1: 'Converti audio in M4A / AAC online gratis',
      tagline: 'Trasforma MP3, M4A, WAV, OGG, FLAC e qualsiasi altro file audio in M4A / AAC con il bitrate che scegli.',
      metaTitle: 'Converti audio in M4A / AAC online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da audio a M4A / AAC. Carica MP3, WAV, M4A, OGG, FLAC o AAC e scarica un M4A / AAC. Scegli il bitrate. Senza filigrana né registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti audio in M4A / AAC online gratis',
      ogDescription: 'Carica qualsiasi file audio e scarica un M4A / AAC. Scegli il bitrate. Gratis, senza registrazione.',
      intro: 'M4A è audio AAC in un contenitore MP4, il formato usato da Apple Music, dagli iPhone, da YouTube e dalla maggior parte dei servizi di streaming. Batte l\'MP3 in qualità per kilobyte. Media Manipulator converte qualsiasi formato audio comune in M4A / AAC con un solo caricamento, mantenendo frequenza di campionamento e disposizione dei canali a meno che tu non le cambi, e offre taglio, normalizzazione, EQ e gli strumenti di pulizia IA nello stesso modulo.',
      whatItDoes: [
        'Converte MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3 e WMA in M4A / AAC.',
        'Ti permette di scegliere bitrate, frequenza di campionamento e disposizione dei canali.',
        'Taglio, guadagno, normalizzazione, EQ ed effetti entrano nella stessa codifica dell\'AAC.',
        'Gli strumenti IA del modulo possono pulire un memo vocale o rimuovere la voce prima che l\'AAC venga scritto.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'audio',
          description: 'Un master WAV, un MP3 o un memo vocale.',
        },
        {
          title: 'Regola se serve',
          description: 'Scegli il bitrate; taglia o applica effetti.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg codifica l\'M4A / AAC sui nostri server.',
        },
        {
          title: 'Scarica',
          description: 'Salva il file M4A / AAC.',
        },
      ],
      advancedDetails: [
        'L\'output M4A / AAC usa l\'encoder aac di FFmpeg; 192 kbps è il valore predefinito e una scelta sicura per la musica.',
        'Alcuni lettori più vecchi che leggono solo MP3 e alcune autoradio non leggono l\'AAC.',
        'Una copertina dell\'album incorporata viene riconosciuta come immagine e mai confusa con una traccia video.',
      ],
      whyItMatters: [
        'Musica e memo vocali per iPhone, iPad e Mac.',
        'Tracce audio che in seguito inserirai in un video MP4.',
        'Podcast e audiolibri: marcatori di capitolo e file più piccoli dell\'MP3.',
      ],
      useCases: [
        {
          title: 'Cambia formato per un dispositivo',
          description: 'Crea una copia M4A / AAC per un lettore che la richiede.',
        },
        {
          title: 'Prepara per il montaggio',
          description: 'Crea un file piccolo e compatibile per un progetto.',
        },
        {
          title: 'Un file alla volta',
          description: 'Converti i memo vocali per una libreria iPhone, tagliando i silenzi man mano.',
        },
        {
          title: 'Pulisci lungo la strada',
          description: 'Esegui la pulizia della voce su una take di podcast e salvala direttamente in M4A.',
        },
      ],
      whyMediaManipulator: [
        'Bitrate, frequenza di campionamento e numero di canali sono regolabili per l\'output AAC.',
        'Normalizza un episodio e trasformalo in M4A senza un secondo caricamento.',
      ],
      privacyNote: 'Il tuo audio viene codificato in AAC dentro un file M4A da FFmpeg sul nostro server. Nessun servizio audio esterno è coinvolto. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Ottieni un nuovo file; il file caricato non viene modificato.',
      faq: [
        {
          question: 'Che cos\'è M4A / AAC?',
          answer: 'M4A è audio AAC in un contenitore MP4, il formato usato da Apple Music, dagli iPhone, da YouTube e dalla maggior parte dei servizi di streaming. Batte l\'MP3 in qualità per kilobyte.',
        },
        {
          question: 'Convertire in M4A / AAC migliora il suono?',
          answer: 'No. Alcuni lettori più vecchi che leggono solo MP3 e alcune autoradio non leggono l\'AAC.',
        },
        {
          question: 'Posso tagliare l\'audio mentre lo converto in M4A / AAC?',
          answer: 'Sì. Imposta l\'intervallo nella sezione di taglio; l\'M4A inizia e finisce dove hai indicato.',
        },
        {
          question: 'La copertina dell\'album nel mio MP3 compromette la conversione in M4A?',
          answer: 'No. Il flusso della copertina viene identificato come immagine, non come video, e la codifica AAC procede normalmente.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Output con perdita; il bitrate che scegli determina le dimensioni.',
        ],
      },
      related: [
        {
          label: 'Convertitore audio',
          to: '/tools/audio-converter',
          description: 'Converti tra tutti i formati audio più comuni.',
        },
        {
          label: 'Cambia la velocità dell\'audio',
          to: '/tools/change-audio-speed',
          description: 'Accelera o rallenta una registrazione.',
        },
        {
          label: 'Cambia l\'intonazione dell\'audio',
          to: '/tools/change-audio-pitch',
          description: 'Sposta la tonalità verso l\'alto o verso il basso.',
        },
        {
          label: 'Normalizza audio',
          to: '/tools/normalize-audio',
          description: 'Uniforma il loudness.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Rimozione del rumore con IA.',
        },
        {
          label: 'Rimuovi la voce da una canzone',
          to: '/tools/remove-vocals-from-song',
          description: 'Crea una base strumentale.',
        },
      ],
      embed: {
        title: 'Converti audio in M4A / AAC',
        description: 'Carica qualsiasi file audio. L\'output è bloccato su M4A / AAC; scegli bitrate, frequenza di campionamento e canali, poi premi Converti.',
      },
    },
    'convert-audio-to-opus': {
      name: 'Converti audio in Opus',
      h1: 'Converti audio in Opus online gratis',
      tagline: 'Trasforma MP3, M4A, WAV, OGG, FLAC e qualsiasi altro file audio in Opus con il bitrate che scegli.',
      metaTitle: 'Converti audio in Opus online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da audio a Opus. Carica MP3, WAV, M4A, OGG, FLAC o AAC e scarica un Opus. Scegli il bitrate. Senza filigrana né registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti audio in Opus online gratis',
      ogDescription: 'Carica qualsiasi file audio e scarica un Opus. Scegli il bitrate. Gratis, senza registrazione.',
      intro: 'Opus è il codec aperto più recente e la migliore opzione con perdita per voce e musica a bitrate bassi: un Opus a 64 kbps suona come un MP3 a 128 kbps. È quello che usano WhatsApp, Discord e WebRTC. Media Manipulator converte qualsiasi formato audio comune in Opus con un solo caricamento, mantenendo frequenza di campionamento e disposizione dei canali a meno che tu non le cambi, e offre taglio, normalizzazione, EQ e gli strumenti di pulizia IA nello stesso modulo.',
      whatItDoes: [
        'Converte MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3 e WMA in Opus.',
        'Ti permette di scegliere bitrate, frequenza di campionamento e disposizione dei canali.',
        'Taglio, volume, normalizzazione ed EQ si applicano nello stesso passaggio della codifica Opus.',
        'Prima della codifica, il modulo può rimuovere il rumore di fondo o ripulire il parlato con l\'IA sulla nostra GPU.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'audio',
          description: 'Note vocali, podcast, musica o qualsiasi audio comune.',
        },
        {
          title: 'Regola se serve',
          description: 'Scegli il bitrate; taglia o applica effetti.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg codifica l\'Opus sui nostri server.',
        },
        {
          title: 'Scarica',
          description: 'Salva il file Opus.',
        },
      ],
      advancedDetails: [
        'L\'output Opus usa l\'encoder libopus di FFmpeg; 192 kbps è il valore predefinito e una scelta sicura per la musica.',
        'iTunes, i dispositivi Apple più vecchi e molti lettori hardware non supportano Opus; per quelli scegli M4A.',
        'La copertina dell\'album in un file sorgente viene rilevata come immagine e non blocca la conversione.',
      ],
      whyItMatters: [
        'Note vocali, podcast e audiolibri a una frazione delle dimensioni.',
        'Streaming o incorporamento di audio dove la banda conta.',
        'Discord, Matrix e bot di messaggistica che accettano Opus nativamente.',
      ],
      useCases: [
        {
          title: 'Cambia formato per un dispositivo',
          description: 'Crea una copia Opus per un lettore che la richiede.',
        },
        {
          title: 'Prepara per il montaggio',
          description: 'Crea un file piccolo e compatibile per un progetto.',
        },
        {
          title: 'Un file alla volta',
          description: 'Riduci una serie di lezioni in Opus una alla volta.',
        },
        {
          title: 'Pulisci lungo la strada',
          description: 'Pulisci la registrazione rumorosa di una chiamata e conservala come piccolo file Opus.',
        },
      ],
      whyMediaManipulator: [
        'Scegli bitrate, frequenza di campionamento e canali dell\'Opus, oppure mantieni i valori predefiniti.',
        'Taglia e normalizza una nota vocale mentre diventa Opus.',
      ],
      privacyNote: 'Il tuo audio viene codificato in Opus da FFmpeg sul nostro server. Nessun servizio audio esterno è coinvolto. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Ottieni un nuovo file; il file caricato non viene modificato.',
      faq: [
        {
          question: 'Che cos\'è Opus?',
          answer: 'Opus è il codec aperto più recente e la migliore opzione con perdita per voce e musica a bitrate bassi: un Opus a 64 kbps suona come un MP3 a 128 kbps. È quello che usano WhatsApp, Discord e WebRTC.',
        },
        {
          question: 'Convertire in Opus migliora il suono?',
          answer: 'No. iTunes, i dispositivi Apple più vecchi e molti lettori hardware non supportano Opus; per quelli scegli M4A.',
        },
        {
          question: 'Posso tagliare l\'audio mentre lo converto in Opus?',
          answer: 'Sì. Viene codificato in Opus solo il tratto tra l\'inizio e la fine che imposti.',
        },
        {
          question: 'Un file audio con copertina si converte in Opus?',
          answer: 'Sì. La copertina viene rilevata come immagine, non come flusso video, quindi il file viene accettato e viene codificato solo l\'audio.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Output con perdita; il bitrate che scegli determina le dimensioni.',
        ],
      },
      related: [
        {
          label: 'Convertitore audio',
          to: '/tools/audio-converter',
          description: 'Converti tra tutti i formati audio più comuni.',
        },
        {
          label: 'Cambia la velocità dell\'audio',
          to: '/tools/change-audio-speed',
          description: 'Accelera o rallenta una registrazione.',
        },
        {
          label: 'Cambia l\'intonazione dell\'audio',
          to: '/tools/change-audio-pitch',
          description: 'Sposta la tonalità verso l\'alto o verso il basso.',
        },
        {
          label: 'Normalizza audio',
          to: '/tools/normalize-audio',
          description: 'Uniforma il loudness.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Rimozione del rumore con IA.',
        },
        {
          label: 'Rimuovi la voce da una canzone',
          to: '/tools/remove-vocals-from-song',
          description: 'Crea una base strumentale.',
        },
      ],
      embed: {
        title: 'Converti audio in Opus',
        description: 'Carica qualsiasi file audio. L\'output è bloccato su Opus; scegli bitrate, frequenza di campionamento e canali, poi premi Converti.',
      },
    },
    'convert-mp3-to-wav': {
      name: 'Converti MP3 in WAV',
      h1: 'Converti MP3 in WAV online gratis',
      tagline: 'Trasforma un MP3 in un WAV non compresso per modificarlo, campionarlo o masterizzarlo su CD.',
      metaTitle: 'Converti MP3 in WAV online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da MP3 a WAV. Carica un MP3 e scarica un WAV PCM a 16 bit non compresso alla frequenza di campionamento originale. Senza filigrana né registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti MP3 in WAV online gratis',
      ogDescription: 'MP3 in ingresso, WAV non compresso in uscita. Gratis, senza registrazione.',
      intro: 'Editor audio, campionatori e programmi per masterizzare CD vogliono PCM non compresso, e alcuni strumenti più vecchi rifiutano del tutto l\'MP3. Convertire in WAV decodifica l\'MP3 una sola volta, così nel montaggio non si perde altra qualità. Media Manipulator lo fa sui nostri server con FFmpeg, mantiene frequenza di campionamento e canali originali e ignora la copertina incorporata invece di confonderla con una traccia video.',
      whatItDoes: [
        'Decodifica l\'MP3 in WAV PCM a 16 bit alla frequenza di campionamento e disposizione dei canali della sorgente.',
        'Taglio, normalizzazione, dissolvenza ed EQ facoltativi nello stesso passaggio.',
        'Gestisce MP3 con copertina incorporata e tag ID3.',
      ],
      flowSteps: [
        {
          title: 'Carica un MP3',
          description: 'Qualsiasi bitrate, con o senza copertina.',
        },
        {
          title: 'Regola se serve',
          description: 'Taglia, normalizza, EQ.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg decodifica in PCM.',
        },
        {
          title: 'Scarica',
          description: 'Salva il WAV.',
        },
      ],
      advancedDetails: [
        'L\'output WAV è pcm_s16le; il file pesa circa 10 MB per minuto di audio stereo a 44,1 kHz.',
        'La decodifica non recupera nulla di ciò che l\'encoder MP3 ha scartato; evita soltanto ulteriori perdite.',
      ],
      whyItMatters: [
        'Modificare un MP3 e salvarlo di nuovo come MP3 perde qualità ogni volta; il WAV lo evita.',
        'Campionatori, DAW e programmi per masterizzare CD si aspettano PCM.',
      ],
      useCases: [
        {
          title: 'Modifica in una DAW',
          description: 'Importa senza passaggio di decodifica né perdita generazionale.',
        },
        {
          title: 'Masterizza un CD audio',
          description: 'I programmi per masterizzare CD vogliono WAV a 44,1 kHz.',
        },
        {
          title: 'Campiona un suono',
          description: 'Caricalo in un campionatore o in un motore di gioco.',
        },
      ],
      whyMediaManipulator: [
        'Mantiene frequenza di campionamento e canali originali.',
        'La copertina nell\'MP3 viene gestita correttamente.',
      ],
      privacyNote: 'Il tuo MP3 viene decodificato una sola volta da FFmpeg sul nostro server in un WAV PCM a 16 bit. Nessun servizio audio esterno è coinvolto. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Ottieni un nuovo file; il file caricato non viene modificato.',
      faq: [
        {
          question: 'Il WAV suonerà meglio dell\'MP3?',
          answer: 'No. Suona identico; il punto è che ulteriori modifiche non lo degraderanno.',
        },
        {
          question: 'Perché il WAV è così più grande?',
          answer: 'Il WAV non è compresso: circa 10 MB per minuto di audio stereo in qualità CD.',
        },
        {
          question: 'Il mio MP3 ha la copertina dell\'album. È un problema?',
          answer: 'No. La copertina incorporata viene riconosciuta come immagine e ignorata.',
        },
      ],
      related: [
        {
          label: 'Converti audio in WAV',
          to: '/tools/convert-audio-to-wav',
          description: 'Da qualsiasi formato a WAV.',
        },
        {
          label: 'Converti WAV in MP3',
          to: '/tools/convert-wav-to-mp3',
          description: 'La direzione opposta.',
        },
        {
          label: 'Convertitore audio',
          to: '/tools/audio-converter',
          description: 'Converti tra tutti i formati audio più comuni.',
        },
        {
          label: 'Cambia la velocità dell\'audio',
          to: '/tools/change-audio-speed',
          description: 'Accelera o rallenta una registrazione.',
        },
        {
          label: 'Cambia l\'intonazione dell\'audio',
          to: '/tools/change-audio-pitch',
          description: 'Sposta la tonalità verso l\'alto o verso il basso.',
        },
        {
          label: 'Normalizza audio',
          to: '/tools/normalize-audio',
          description: 'Uniforma il loudness.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Rimozione del rumore con IA.',
        },
        {
          label: 'Rimuovi la voce da una canzone',
          to: '/tools/remove-vocals-from-song',
          description: 'Crea una base strumentale.',
        },
      ],
      embed: {
        title: 'Converti MP3 in WAV',
        description: 'Carica un MP3. L\'output è bloccato su WAV; se vuoi taglia o normalizza, poi premi Converti.',
      },
    },
    'change-audio-speed': {
      name: 'Cambia la velocità dell\'audio',
      h1: 'Cambia la velocità dell\'audio online: accelera o rallenta',
      tagline: 'Accelera una lezione o un podcast a 1,5x, oppure rallenta un brano o una registrazione a 0,75x per esercitarti, senza cambiare l\'intonazione.',
      metaTitle: 'Cambia velocità audio online gratis (stessa intonazione) | Media Manipulator',
      metaDescription: 'Strumento online gratuito per cambiare la velocità dell\'audio. Accelera o rallenta MP3, WAV, M4A e altro da 0,25x a 4x mantenendo l\'intonazione. Ideale per lezioni, podcast e basi per esercitarsi. Senza registrazione.',
      ogTitle: 'Cambia la velocità dell\'audio online gratis',
      ogDescription: 'Più veloce o più lento senza l\'effetto chipmunk. Gratis, senza registrazione.',
      intro: 'Una lezione di due ore a 1,5x dura 80 minuti. Un solo di chitarra a 0,75x diventa studiabile. Cambiare la velocità dell\'audio è utile ogni giorno, e l\'insidia è l\'intonazione: un\'accelerazione ingenua trasforma le voci in vocette da chipmunk. Media Manipulator esegue il time-stretch dell\'audio sui nostri server con il filtro tempo di FFmpeg, che mantiene l\'intonazione esattamente dov\'era, da un quarto della velocità fino a quattro volte.',
      whatItDoes: [
        'Accelera (da 1,1x a 4x) o rallenta (da 0,25x a 0,9x) qualsiasi file audio.',
        'Mantiene l\'intonazione, così parlato e musica restano nella stessa tonalità.',
        'Esporta in MP3 per impostazione predefinita oppure in WAV, FLAC, M4A, OGG, Opus.',
        'Taglio, normalizzazione ed EQ facoltativi nello stesso passaggio.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'audio',
          description: 'MP3, WAV, M4A, OGG, FLAC e altro.',
        },
        {
          title: 'Imposta la velocità',
          description: '1,5x è preselezionato; da 0,25x a 4x.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg esegue il time-stretch mantenendo l\'intonazione.',
        },
        {
          title: 'Scarica',
          description: 'Salva il file con i nuovi tempi.',
        },
      ],
      advancedDetails: [
        'Usa il filtro atempo, concatenato automaticamente per fattori fuori dall\'intervallo da 0,5 a 2,0.',
        'Il time-stretch introduce lievi artefatti ai fattori estremi; da 0,5x a 2x è trasparente per il parlato.',
        'Per cambiare velocità E intonazione insieme (l\'effetto nastro), usa l\'opzione time-stretch dello strumento per l\'intonazione.',
      ],
      whyItMatters: [
        'Lezioni, audiolibri e podcast sono spesso comodi da 1,25x a 2x.',
        'I musicisti si esercitano sui passaggi difficili dal 50 al 75 per cento della velocità.',
        'Chi trascrive rallenta le registrazioni per cogliere ogni parola.',
      ],
      useCases: [
        {
          title: 'Lezione più veloce',
          description: 'Ascolta una lezione registrata a 1,5x.',
        },
        {
          title: 'Base per esercitarsi',
          description: 'Rallenta un solo a 0,75x nella stessa tonalità.',
        },
        {
          title: 'Trascrizione',
          description: 'Rallenta un\'intervista a 0,8x.',
        },
        {
          title: 'Rientra in una durata prestabilita',
          description: 'Sposta un voice-over del 5 per cento per farlo rientrare.',
        },
      ],
      whyMediaManipulator: [
        'L\'intonazione viene mantenuta per impostazione predefinita; niente effetto chipmunk né suono da nastro rallentato.',
        'Qualsiasi formato di output, più taglio e normalizzazione nello stesso caricamento.',
      ],
      privacyNote: 'La tua registrazione viene accelerata o rallentata da FFmpeg sul nostro server, usando rubberband o atempo a seconda della modalità che scegli. Nessun servizio audio esterno è coinvolto. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Ottieni un nuovo file; il file caricato non viene modificato.',
      faq: [
        {
          question: 'L\'intonazione cambia?',
          answer: 'No. Il filtro tempo mantiene l\'intonazione esattamente com\'era.',
        },
        {
          question: 'Quanto posso accelerare?',
          answer: '4x in un solo passaggio. Ripassa il risultato per andare oltre.',
        },
        {
          question: 'L\'audio rallentato suonerà robotico?',
          answer: 'Fino a 0,5x è pulito; al di sotto si sente un po\' di phasing.',
        },
        {
          question: 'Posso cambiare velocità e intonazione insieme?',
          answer: 'Sì. Usa lo strumento Cambia l\'intonazione dell\'audio, che ha un controllo di time-stretch.',
        },
      ],
      related: [
        {
          label: 'Convertitore audio',
          to: '/tools/audio-converter',
          description: 'Converti tra tutti i formati audio più comuni.',
        },
        {
          label: 'Cambia l\'intonazione dell\'audio',
          to: '/tools/change-audio-pitch',
          description: 'Sposta la tonalità verso l\'alto o verso il basso.',
        },
        {
          label: 'Normalizza audio',
          to: '/tools/normalize-audio',
          description: 'Uniforma il loudness.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Rimozione del rumore con IA.',
        },
        {
          label: 'Rimuovi la voce da una canzone',
          to: '/tools/remove-vocals-from-song',
          description: 'Crea una base strumentale.',
        },
      ],
      embed: {
        title: 'Cambia la velocità di un file audio',
        description: 'Carica un file audio e imposta un moltiplicatore di velocità; 1,5x è preselezionato. L\'intonazione viene mantenuta, così le voci restano naturali. Per cambiare anche la tonalità, usa lo strumento per l\'intonazione.',
      },
    },
    'change-audio-pitch': {
      name: 'Cambia l\'intonazione dell\'audio',
      h1: 'Cambia l\'intonazione dell\'audio online: trasponi verso l\'alto o verso il basso',
      tagline: 'Sposta un brano o una registrazione di semitoni per cambiarne la tonalità, abbassare una voce o accordare un campione, mantenendo lo stesso tempo.',
      metaTitle: 'Cambia intonazione audio online gratis, per semitoni | Media Manipulator',
      metaDescription: 'Pitch shifter online gratuito. Trasponi MP3, WAV o qualsiasi audio verso l\'alto o verso il basso di semitoni per cambiarne la tonalità, senza variare la velocità. Time-stretch facoltativo. Senza filigrana né registrazione.',
      ogTitle: 'Cambia l\'intonazione dell\'audio online gratis',
      ogDescription: 'Trasponi qualsiasi audio di semitoni. Gratis, senza registrazione.',
      intro: 'Una base nella tonalità sbagliata per la tua voce, un campione che deve adattarsi a un brano, una voce che vorrebbe stare un tono più in basso: il pitch shifting li risolve tutti. Media Manipulator traspone l\'audio di semitoni sui nostri server con FFmpeg, mantenendo la durata invariata, e ti permette di combinarlo con un time-stretch quando invece vuoi il vecchio effetto nastro a velocità variata.',
      whatItDoes: [
        'Traspone l\'audio verso l\'alto o verso il basso fino a 12 semitoni (un\'ottava).',
        'Mantiene la stessa durata, così la traccia continua a rientrare nei tempi.',
        'Time-stretch facoltativo per cambiare la lunghezza in modo indipendente.',
        'Scrive l\'audio trasposto come MP3, WAV, FLAC, M4A, OGG o Opus.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'audio',
          description: 'Qualsiasi formato audio comune.',
        },
        {
          title: 'Imposta i semitoni',
          description: '+2 è preselezionato; da -12 a +12.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg ricampiona e riallinea i tempi.',
        },
        {
          title: 'Scarica',
          description: 'Salva il file trasposto.',
        },
      ],
      advancedDetails: [
        'Lo spostamento ricampiona di 2^(semitoni/12) e compensa il tempo così la lunghezza resta invariata.',
        'Spostamenti ampi (più di 5 semitoni) su mix completi possono suonare artificiali; voci e strumenti singoli reggono meglio.',
        'La conservazione delle formanti è attiva, così una voce abbassata non diventa un\'altra persona.',
      ],
      whyItMatters: [
        'I cantanti traspongono le basi in una tonalità comoda.',
        'I produttori accordano campioni e voci a un brano.',
        'Un semitono o due più in basso rende una voce demo più rilassata.',
      ],
      useCases: [
        {
          title: 'Cambia la tonalità di una base',
          description: 'Abbassa una traccia karaoke di due semitoni.',
        },
        {
          title: 'Accorda un campione',
          description: 'Adatta un colpo di batteria o un frammento vocale al brano.',
        },
        {
          title: 'Abbassa un voice-over',
          description: 'Porta una lettura un semitono più in basso.',
        },
        {
          title: 'Effetto ottava',
          description: 'Sposta di +12 o -12 per un livello di effetto.',
        },
      ],
      whyMediaManipulator: [
        'Controllo in semitoni con durata preservata, e time-stretch quando lo vuoi.',
        'Qualsiasi formato di output, più taglio e normalizzazione nello stesso caricamento.',
      ],
      privacyNote: 'Il tuo audio viene spostato verso l\'alto o verso il basso del numero di semitoni che scegli, da FFmpeg sul nostro server. Nessun servizio audio esterno è coinvolto. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Ottieni un nuovo file; il file caricato non viene modificato.',
      faq: [
        {
          question: 'La velocità cambia?',
          answer: 'No. La durata viene preservata. Usa il controllo di time-stretch se vuoi che cambi.',
        },
        {
          question: 'Di quanto posso spostare?',
          answer: 'Fino a 12 semitoni (un\'ottava) verso l\'alto o verso il basso.',
        },
        {
          question: 'Una voce trasposta suonerà naturale?',
          answer: 'Da uno a tre semitoni, sì. Spostamenti maggiori si fanno sentire; la conservazione delle formanti evita che suoni come un cartone animato.',
        },
        {
          question: 'Posso spostare di cent?',
          answer: 'Non ancora; il controllo è in semitoni interi.',
        },
      ],
      related: [
        {
          label: 'Convertitore audio',
          to: '/tools/audio-converter',
          description: 'Converti tra tutti i formati audio più comuni.',
        },
        {
          label: 'Cambia la velocità dell\'audio',
          to: '/tools/change-audio-speed',
          description: 'Accelera o rallenta una registrazione.',
        },
        {
          label: 'Normalizza audio',
          to: '/tools/normalize-audio',
          description: 'Uniforma il loudness.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Rimozione del rumore con IA.',
        },
        {
          label: 'Rimuovi la voce da una canzone',
          to: '/tools/remove-vocals-from-song',
          description: 'Crea una base strumentale.',
        },
      ],
      embed: {
        title: 'Cambia l\'intonazione di un file audio',
        description: 'Carica un file audio. La sezione Avanzate si apre con il cursore dell\'intonazione; +2 semitoni è preselezionato. I valori negativi abbassano la tonalità. Il time-stretch è lì accanto se vuoi cambiare anche la lunghezza.',
      },
    },
    'normalize-audio': {
      name: 'Normalizza audio',
      h1: 'Normalizza il loudness dell\'audio online',
      tagline: 'Porta una registrazione troppo bassa a un volume uniforme, così podcast, memo vocali e playlist miste vengono riprodotti allo stesso livello.',
      metaTitle: 'Normalizza audio online gratis (loudness) | Media Manipulator',
      metaDescription: 'Normalizzatore audio online gratuito. Uniforma il loudness di MP3, WAV, M4A e altri file con la normalizzazione del loudness EBU R128. Ideale per podcast e memo vocali. Senza filigrana né registrazione.',
      ogTitle: 'Normalizza audio online gratis',
      ogDescription: 'Loudness costante per qualsiasi registrazione. Gratis, senza registrazione.',
      intro: 'Un memo vocale registrato a distanza di un braccio è basso; un brano estratto da un CD è alto; riprodotti uno dopo l\'altro costringono chi ascolta a correre al volume. La normalizzazione del loudness misura il volume percepito di un intero file e lo porta a un target standard, la stessa misurazione EBU R128 usata da emittenti e servizi di streaming. Media Manipulator la esegue sui nostri server con il filtro loudnorm di FFmpeg, che tiene anche i picchi reali sotto il tetto così nulla va in clipping.',
      whatItDoes: [
        'Misura il loudness integrato e normalizza a un target standard broadcast.',
        'Limita i picchi reali così l\'output non va mai in clipping.',
        'Guadagno, dissolvenza in entrata/uscita e compressione della dinamica facoltativi nella stessa sezione.',
        'Salva il file livellato in MP3, WAV, FLAC, M4A, OGG o Opus.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'audio',
          description: 'Qualsiasi formato comune.',
        },
        {
          title: 'Lascia attiva la normalizzazione',
          description: 'Aggiungi dissolvenze o compressione se serve.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg loudnorm misura e corregge.',
        },
        {
          title: 'Scarica',
          description: 'Salva il file livellato.',
        },
      ],
      advancedDetails: [
        'Usa loudnorm (EBU R128) con il suo target integrato predefinito di -24 LUFS e un tetto di picco reale di -2 dBTP.',
        'È una normalizzazione del loudness, non dei picchi: due file che hanno entrambi picchi a 0 dB possono comunque differire molto nel volume percepito.',
        'Per una rapida variazione di guadagno fissa senza analisi, usa il cursore Amplifica o lo strumento Regola il volume.',
      ],
      whyItMatters: [
        'Gli ascoltatori abbandonano i podcast che richiedono continue regolazioni del volume.',
        'Playlist e set da DJ hanno bisogno di tracce a un livello costante.',
        'Le piattaforme normalizzano al caricamento; farlo prima significa nessuna sorpresa.',
      ],
      useCases: [
        {
          title: 'Episodio di podcast',
          description: 'Livella una conversazione registrata prima di pubblicarla.',
        },
        {
          title: 'Memo vocale',
          description: 'Alza una registrazione del telefono troppo bassa.',
        },
        {
          title: 'Registrazione di una lezione',
          description: 'Uniforma un relatore che si allontana dal microfono.',
        },
        {
          title: 'Preparazione di una playlist',
          description: 'Normalizza tracce estratte da fonti diverse.',
        },
      ],
      whyMediaManipulator: [
        'Vera misurazione del loudness EBU R128, non una semplice scansione dei picchi.',
        'Dissolvenze, guadagno e compressione nella stessa sezione.',
      ],
      privacyNote: 'Il loudness del tuo audio viene misurato e uniformato da FFmpeg sul nostro server. Nessun servizio audio esterno è coinvolto. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Ottieni un nuovo file; il file caricato non viene modificato.',
      faq: [
        {
          question: 'Quale loudness target viene usato?',
          answer: '-24 LUFS integrato con un tetto di picco reale di -2 dBTP, il valore predefinito EBU R128. Le piattaforme di podcast puntano di solito a valori tra -16 e -19 LUFS; aggiungi qualche dB di amplificazione se lo vuoi più alto.',
        },
        {
          question: 'Renderà tutto allo stesso volume all\'interno del file?',
          answer: 'No. Livella il file nel suo insieme. Attiva anche il compressore per ridurre le variazioni al suo interno.',
        },
        {
          question: 'Può andare in clipping?',
          answer: 'No. Il limitatore di picco reale tiene i picchi sotto il tetto.',
        },
        {
          question: 'Posso semplicemente alzare il volume?',
          answer: 'Sì. Usa lo strumento Regola il volume per una variazione di guadagno fissa.',
        },
      ],
      related: [
        {
          label: 'Regola il volume',
          to: '/tools/adjust-audio-volume',
          description: 'Guadagno fisso in più o in meno.',
        },
        {
          label: 'Convertitore audio',
          to: '/tools/audio-converter',
          description: 'Converti tra tutti i formati audio più comuni.',
        },
        {
          label: 'Cambia la velocità dell\'audio',
          to: '/tools/change-audio-speed',
          description: 'Accelera o rallenta una registrazione.',
        },
        {
          label: 'Cambia l\'intonazione dell\'audio',
          to: '/tools/change-audio-pitch',
          description: 'Sposta la tonalità verso l\'alto o verso il basso.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Rimozione del rumore con IA.',
        },
        {
          label: 'Rimuovi la voce da una canzone',
          to: '/tools/remove-vocals-from-song',
          description: 'Crea una base strumentale.',
        },
      ],
      embed: {
        title: 'Normalizza un file audio',
        description: 'Carica un file audio. La normalizzazione del loudness è già attiva nella sezione Elaborazione audio di base; aggiungi amplificazione, dissolvenze o compressione se vuoi. Premi Converti.',
      },
    },
    'adjust-audio-volume': {
      name: 'Regola il volume dell\'audio',
      h1: 'Alza o abbassa il volume dell\'audio online',
      tagline: 'Rendi un file audio più forte o più piano di un valore fisso, dal 10 percento al doppio, oppure in decibel con il cursore di amplificazione.',
      metaTitle: 'Alza il volume dell\'audio online gratis (MP3 più forte) | Media Manipulator',
      metaDescription: 'Cambia volume online gratuito. Rendi un MP3, un WAV o qualsiasi file audio più forte o più piano con un moltiplicatore fisso o in decibel, con dissolvenze. Senza filigrana né registrazione.',
      ogTitle: 'Alza o abbassa il volume dell\'audio online',
      ogDescription: 'Rendi qualsiasi audio più forte o più piano. Gratis, senza registrazione.',
      intro: 'A volte un file è semplicemente troppo basso, o decisamente troppo forte rispetto al resto di una playlist, e basta una variazione fissa del guadagno. Media Manipulator regola il volume dell\'audio sui nostri server con FFmpeg, con un moltiplicatore o in decibel, aggiunge dissolvenze se le vuoi e può combinare la modifica con la normalizzazione del loudness, così il risultato non va in clipping.',
      whatItDoes: [
        'Moltiplica il volume da 0,1x (molto basso) a 2x (il doppio).',
        'Oppure imposta un guadagno preciso in decibel, da -60 a +60 dB, con il cursore Amplifica.',
        'Dissolvenza in entrata e in uscita in secondi.',
        'Normalizzazione e compressione facoltative per evitare il clipping con aumenti forti.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'audio',
          description: 'Qualsiasi formato comune.',
        },
        {
          title: 'Imposta il volume',
          description: '1,5x è preselezionato; oppure usa i decibel.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg applica il guadagno.',
        },
        {
          title: 'Scarica',
          description: 'Salva il file regolato.',
        },
      ],
      advancedDetails: [
        'Il volume usa il filtro volume; un moltiplicatore di 2 equivale a +6 dB, 0,5 a -6 dB.',
        'Alzare un file che ha già picchi vicini a 0 dBFS produce clipping; attiva la normalizzazione, che include un limiter true-peak.',
        'Per un loudness percepito uniforme invece di un guadagno fisso, usa Normalizza audio.',
      ],
      whyItMatters: [
        'Le registrazioni a basso volume si sentono male dagli altoparlanti del telefono.',
        'Una suoneria o un effetto sonoro troppo forte è sgradevole e va in clipping.',
        'Il guadagno fisso è lo strumento giusto quando sai esattamente di quanto cambiare.',
      ],
      useCases: [
        {
          title: 'Alza un memo troppo basso',
          description: 'Rendi udibile una registrazione fatta con il telefono.',
        },
        {
          title: 'Doma un effetto troppo forte',
          description: 'Abbassa un effetto sonoro di 10 dB.',
        },
        {
          title: 'Suoneria',
          description: 'Alza il volume e aggiungi una dissolvenza in uscita.',
        },
        {
          title: 'Musica di sottofondo',
          description: 'Abbassa una traccia perché stia sotto una voce.',
        },
      ],
      whyMediaManipulator: [
        'Moltiplicatore o decibel, più le dissolvenze, in un unico posto.',
        'Normalizza e comprimi nello stesso passaggio per prevenire il clipping.',
      ],
      privacyNote: 'Il tuo audio viene reso più forte o più piano della quantità che imposti, da FFmpeg sul nostro server. Nessun servizio audio esterno è coinvolto. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Ottieni un nuovo file; il caricamento in sé non viene modificato.',
      faq: [
        {
          question: 'Qual è l\'aumento massimo?',
          answer: '2x con il moltiplicatore, oppure fino a +60 dB con il cursore Amplifica. Gli aumenti forti vanno in clipping se la normalizzazione non è attiva.',
        },
        {
          question: 'Distorcerà?',
          answer: 'Solo se il segnale amplificato supera il fondo scala. Attiva la normalizzazione, che limita i picchi reali (true peak).',
        },
        {
          question: 'Moltiplicatore o decibel?',
          answer: 'Fanno lo stesso lavoro. 2x equivale a +6 dB; 0,5x equivale a -6 dB.',
        },
        {
          question: 'Posso invece uniformare il volume?',
          answer: 'Sì. Usa Normalizza audio per un loudness percepito uniforme.',
        },
      ],
      related: [
        {
          label: 'Normalizza audio',
          to: '/tools/normalize-audio',
          description: 'Loudness uniforme.',
        },
        {
          label: 'Convertitore audio',
          to: '/tools/audio-converter',
          description: 'Converti tra tutti i formati audio comuni.',
        },
        {
          label: 'Cambia la velocità dell\'audio',
          to: '/tools/change-audio-speed',
          description: 'Accelera o rallenta una registrazione.',
        },
        {
          label: 'Cambia l\'intonazione dell\'audio',
          to: '/tools/change-audio-pitch',
          description: 'Sposta la tonalità verso l\'alto o verso il basso.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Rimozione del rumore con IA.',
        },
        {
          label: 'Rimuovi la voce da una canzone',
          to: '/tools/remove-vocals-from-song',
          description: 'Crea una base strumentale.',
        },
      ],
      embed: {
        title: 'Regola il volume di un file audio',
        description: 'Carica un file audio e imposta il moltiplicatore di volume; 1,5x è preselezionato. Per una variazione in decibel, usa il cursore Amplifica in Elaborazione audio di base. Gli aumenti forti possono andare in clipping; attiva la normalizzazione per un risultato sicuro.',
      },
    },
    'audio-equalizer': {
      name: 'Equalizzatore audio',
      h1: 'Equalizza l\'audio online: enfasi bassi, alti, preset',
      tagline: 'Applica un potenziamento dei bassi, un aumento degli alti, la presenza vocale o un preset per genere, oppure imposta filtri passa-basso e passa-alto, e scarica il risultato.',
      metaTitle: 'Equalizzatore audio online: bassi, alti, voce | Media Manipulator',
      metaDescription: 'Equalizzatore audio online gratuito. Applica preset EQ di enfasi bassi, enfasi alti, voce, rock, jazz o classica, oppure imposta filtri passa-alto e passa-basso, su MP3, WAV e altro. Senza registrazione.',
      ogTitle: 'Equalizza l\'audio online',
      ogDescription: 'Enfasi bassi, alti, presenza vocale e altro ancora. Gratis, senza registrazione.',
      intro: 'L\'EQ modella il timbro di una registrazione: più bassi per una traccia esile, meno per una stanza rimbombante, un rialzo di presenza perché una voce emerga, un passa-alto per eliminare il rumble. Media Manipulator applica l\'equalizzazione sui nostri server con FFmpeg, dai preset con un clic alle frequenze di taglio esplicite dei filtri, ed esporta in qualsiasi formato audio.',
      whatItDoes: [
        'Preset: enfasi bassi, enfasi alti, voce, rock, jazz, classica.',
        'Filtri passa-alto e passa-basso con frequenze di taglio regolabili.',
        'Combinalo con volume, normalizzazione, compressione e riverbero.',
        'Il risultato equalizzato può essere MP3, WAV, FLAC, M4A, OGG o Opus.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'audio',
          description: 'Qualsiasi formato comune.',
        },
        {
          title: 'Scegli un preset o i filtri',
          description: 'Enfasi bassi è preselezionato.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg applica la catena di EQ.',
        },
        {
          title: 'Scarica',
          description: 'Salva il file modellato.',
        },
      ],
      advancedDetails: [
        'I preset corrispondono ai filtri equalizer, bass e treble di FFmpeg con guadagni e valori Q fissi.',
        'Un passa-alto da 80 a 120 Hz elimina rumori di manipolazione e rumble dalle registrazioni vocali; un passa-basso da 8 a 10 kHz attenua il fruscio.',
        'L\'EQ non può aggiungere frequenze che non sono mai state registrate; una registrazione da telefono ha poco da enfatizzare sotto i 100 Hz.',
      ],
      whyItMatters: [
        'Un piccolo rialzo di presenza rende il parlato molto più intelligibile sugli altoparlanti piccoli.',
        'Rumble e fruscio sono le due correzioni più comuni ed entrambe sono semplici filtri.',
        'I preset per genere danno a una playlist un carattere rapido e coerente.',
      ],
      useCases: [
        {
          title: 'Chiarezza della voce',
          description: 'Preset voce più un passa-alto per un podcast.',
        },
        {
          title: 'Enfasi bassi',
          description: 'Dai corpo a una registrazione esile.',
        },
        {
          title: 'Elimina il rumble',
          description: 'Passa-alto a 100 Hz.',
        },
        {
          title: 'Attenua il fruscio',
          description: 'Passa-basso a 10 kHz su un vecchio trasferimento da nastro.',
        },
      ],
      whyMediaManipulator: [
        'Preset e frequenze di taglio esplicite dei filtri in un\'unica sezione.',
        'Concatenalo con normalizzazione, compressione e riverbero nello stesso caricamento.',
      ],
      privacyNote: 'Bassi, medi e alti del tuo audio vengono rimodellati dall\'equalizzatore di FFmpeg sul nostro server. Nessun servizio audio esterno è coinvolto. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Ottieni un nuovo file; il caricamento in sé non viene modificato.',
      faq: [
        {
          question: 'Posso impostare le mie bande?',
          answer: 'Sono esposti i preset più le frequenze di taglio passa-alto e passa-basso; il guadagno per banda è in programma.',
        },
        {
          question: 'Cosa fa un filtro passa-alto?',
          answer: 'Elimina tutto ciò che sta sotto la frequenza di taglio: rumble, rumori di manipolazione, colpi delle plosive.',
        },
        {
          question: 'L\'EQ può correggere una registrazione ovattata?',
          answer: 'Un\'enfasi degli alti aiuta se le alte frequenze sono solo deboli. Se non sono mai state catturate, l\'EQ non può inventarle; prova la pulizia della voce con IA.',
        },
        {
          question: 'L\'EQ va in clipping?',
          answer: 'Le enfasi possono farlo. Attiva la normalizzazione, che include un limiter true-peak.',
        },
      ],
      related: [
        {
          label: 'Pulisci l\'audio della voce',
          to: '/tools/clean-voice-audio',
          description: 'Miglioramento della voce con IA.',
        },
        {
          label: 'Convertitore audio',
          to: '/tools/audio-converter',
          description: 'Converti tra tutti i formati audio comuni.',
        },
        {
          label: 'Cambia la velocità dell\'audio',
          to: '/tools/change-audio-speed',
          description: 'Accelera o rallenta una registrazione.',
        },
        {
          label: 'Cambia l\'intonazione dell\'audio',
          to: '/tools/change-audio-pitch',
          description: 'Sposta la tonalità verso l\'alto o verso il basso.',
        },
        {
          label: 'Normalizza audio',
          to: '/tools/normalize-audio',
          description: 'Uniforma il loudness.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Rimozione del rumore con IA.',
        },
        {
          label: 'Rimuovi la voce da una canzone',
          to: '/tools/remove-vocals-from-song',
          description: 'Crea una base strumentale.',
        },
      ],
      embed: {
        title: 'Equalizza un file audio',
        description: 'Carica un file audio. L\'equalizzatore in Elaborazione audio di base è già attivo con il preset enfasi bassi; scegli un altro preset o imposta le frequenze di taglio passa-alto e passa-basso. Premi Converti.',
      },
    },
    'add-reverb-to-audio': {
      name: 'Aggiungi riverbero all\'audio',
      h1: 'Aggiungi riverbero o eco all\'audio online',
      tagline: 'Inserisci una voce o una registrazione asciutta in una stanza, una sala, un riverbero a piastra o a molla, oppure aggiungi un delay o un eco, e scarica il risultato.',
      metaTitle: 'Aggiungi riverbero o eco all\'audio online gratis | Media Manipulator',
      metaDescription: 'Riverbero ed eco online gratuiti. Aggiungi un riverbero stanza, sala, a piastra o a molla, oppure un delay, a MP3, WAV e qualsiasi file audio, con controlli di livello wet e dimensione della stanza. Senza registrazione.',
      ogTitle: 'Aggiungi riverbero o eco all\'audio online',
      ogDescription: 'Stanza, sala, a piastra, a molla e delay. Gratis, senza registrazione.',
      intro: 'Una voce registrata in una stanza trattata acusticamente suona spenta finché non la collochi da qualche parte. Il riverbero aggiunge quello spazio; il delay aggiunge ritmo. Media Manipulator applica riverberi stanza, sala, a piastra e a molla e delay in stile eco sui nostri server con FFmpeg, con controlli di livello wet e dimensione della stanza, ed esporta in qualsiasi formato audio.',
      whatItDoes: [
        'Riverberi di tipo stanza, sala, a piastra e a molla con dimensione della stanza, smorzamento e mix wet/dry.',
        'Delay eco, multi-tap e ping-pong con tempo e feedback.',
        'Modulazione chorus, flanger, phaser e tremolo nella stessa sezione.',
        'Scegli MP3, WAV, FLAC, M4A, OGG o Opus per la versione con l\'effetto.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'audio',
          description: 'Una voce o uno strumento asciutti funzionano meglio.',
        },
        {
          title: 'Scegli un riverbero',
          description: 'Sala è preselezionato; imposta dimensione e mix.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg renderizza l\'effetto.',
        },
        {
          title: 'Scarica',
          description: 'Salva il risultato.',
        },
      ],
      advancedDetails: [
        'I riverberi sono costruiti con aecho di FFmpeg, con set di delay e decay specifici per tipo; il livello wet miscela l\'effetto con il segnale dry.',
        'Il tempo di delay è in millisecondi; un feedback sopra il 70 percento si accumula rapidamente.',
        'Gli effetti vengono renderizzati nel file; conserva l\'originale asciutto se potresti volerli cambiare.',
      ],
      whyItMatters: [
        'Voci e voci fuori campo asciutte suonano innaturali senza un po\' di ambiente.',
        'Un breve riverbero a piastra è la rifinitura standard per parlato e canto.',
        'Delay e modulazione sono il modo più rapido per creare un elemento di sound design.',
      ],
      useCases: [
        {
          title: 'Rifinitura della voce',
          description: 'Breve riverbero a piastra su una take cantata o parlata.',
        },
        {
          title: 'Grande sala',
          description: 'Metti un coro o un pad in una cattedrale.',
        },
        {
          title: 'Slapback',
          description: 'Un eco rapido su una chitarra o una voce.',
        },
        {
          title: 'Sound design',
          description: 'Delay ping-pong e flanger su un effetto.',
        },
      ],
      whyMediaManipulator: [
        'Quattro tipi di riverbero, tre tipi di delay e quattro effetti di modulazione in un\'unica sezione.',
        'Combinalo con EQ, normalizzazione e intonazione nello stesso caricamento.',
      ],
      privacyNote: 'Il riverbero viene aggiunto al tuo audio da FFmpeg sul nostro server. Nessun servizio audio esterno è coinvolto. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Ottieni un nuovo file; il caricamento in sé non viene modificato.',
      faq: [
        {
          question: 'Quale riverbero dovrei usare per la voce?',
          answer: 'A piastra o una stanza piccola dal 20 al 30 percento wet. La sala è per musica ed effetti.',
        },
        {
          question: 'Posso rimuovere il riverbero?',
          answer: 'Non qui. Lo strumento di pulizia della voce con IA riduce il suono della stanza nel parlato.',
        },
        {
          question: 'Posso aggiungere sia riverbero che delay?',
          answer: 'Sì. Sono entrambi nella stessa sezione e possono essere attivati insieme.',
        },
        {
          question: 'L\'effetto è reversibile?',
          answer: 'No. Viene renderizzato nel file; conserva il tuo originale asciutto.',
        },
      ],
      related: [
        {
          label: 'Convertitore audio',
          to: '/tools/audio-converter',
          description: 'Converti tra tutti i formati audio comuni.',
        },
        {
          label: 'Cambia la velocità dell\'audio',
          to: '/tools/change-audio-speed',
          description: 'Accelera o rallenta una registrazione.',
        },
        {
          label: 'Cambia l\'intonazione dell\'audio',
          to: '/tools/change-audio-pitch',
          description: 'Sposta la tonalità verso l\'alto o verso il basso.',
        },
        {
          label: 'Normalizza audio',
          to: '/tools/normalize-audio',
          description: 'Uniforma il loudness.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Rimozione del rumore con IA.',
        },
        {
          label: 'Rimuovi la voce da una canzone',
          to: '/tools/remove-vocals-from-song',
          description: 'Crea una base strumentale.',
        },
      ],
      embed: {
        title: 'Aggiungi riverbero a un file audio',
        description: 'Carica un file audio. La sezione Effetti temporali si apre con il riverbero sala selezionato; regola dimensione della stanza e livello wet, oppure scegli stanza, a piastra o a molla, o aggiungi un delay. Premi Converti.',
      },
    },
    'trim-audio': {
      name: 'Taglia audio',
      h1: 'Taglia audio online gratis',
      tagline: 'Taglia un MP3, un WAV o qualsiasi registrazione tra un tempo di inizio e uno di fine, con una forma d\'onda per scegliere i punti, e scarica solo quella parte.',
      metaTitle: 'Taglia audio online gratis: ritaglia MP3, WAV | Media Manipulator',
      metaDescription: 'Taglia audio online gratuito. Taglia qualsiasi file audio a un intervallo usando una forma d\'onda, aggiungi dissolvenze e scarica MP3, WAV, M4A o altro. Crea una suoneria o una clip. Senza filigrana né registrazione.',
      ogTitle: 'Taglia audio online gratis',
      ogDescription: 'Scegli inizio e fine sulla forma d\'onda e scarica la clip. Gratis, senza registrazione.',
      intro: 'Il ritornello per una suoneria, l\'unico minuto buono di una registrazione di due ore, la frase a effetto senza l\'introduzione: il taglio è la modifica audio di cui tutti hanno bisogno. Media Manipulator mostra una forma d\'onda, ti lascia trascinare i punti di inizio e fine, taglia sui nostri server con FFmpeg ed esporta in qualsiasi formato con dissolvenze facoltative.',
      whatItDoes: [
        'Taglia qualsiasi file audio a un tempo di inizio e di fine scelti su una forma d\'onda.',
        'Dissolvenza in entrata e in uscita, così il taglio non produce clic.',
        'Il taglio ti torna come MP3, WAV, FLAC, M4A, OGG o Opus.',
        'Combinalo con volume, normalizzazione ed EQ nello stesso passaggio.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'audio',
          description: 'Qualsiasi formato comune.',
        },
        {
          title: 'Imposta l\'intervallo',
          description: 'Trascina i marcatori sulla forma d\'onda.',
        },
        {
          title: 'Converti',
          description: 'FFmpeg taglia e codifica.',
        },
        {
          title: 'Scarica',
          description: 'Salva la clip.',
        },
      ],
      advancedDetails: [
        'Il taglio è preciso al campione; l\'output viene ricodificato nel formato che scegli.',
        'Una dissolvenza da 0,05 a 0,2 secondi elimina i clic nei punti di taglio.',
        'Per un video, usa Taglia video; per un video con la forma d\'onda del risultato, il Generatore di forme d\'onda audio.',
      ],
      whyItMatters: [
        'Suonerie e suoni di notifica richiedono un taglio da 20 a 30 secondi.',
        'Condividere una frase a effetto è più facile che condividere l\'intera registrazione.',
        'Eliminare silenzi e introduzioni prima della trascrizione fa risparmiare tempo.',
      ],
      useCases: [
        {
          title: 'Suoneria',
          description: 'Taglia il ritornello e aggiungi una dissolvenza.',
        },
        {
          title: 'Frase a effetto',
          description: 'Estrai una sola frase da un\'intervista.',
        },
        {
          title: 'Elimina un inizio sbagliato',
          description: 'Scarta i primi 10 secondi di un memo.',
        },
        {
          title: 'Campione',
          description: 'Isola un colpo o una frase musicale.',
        },
      ],
      whyMediaManipulator: [
        'Modifica sulla forma d\'onda con marcatori trascinabili, non timestamp digitati.',
        'Dissolvenze, normalizzazione e qualsiasi formato di output nello stesso caricamento.',
      ],
      privacyNote: 'Il tuo audio viene tagliato all\'inizio e alla fine che imposti da FFmpeg sul nostro server. Nessun servizio audio esterno è coinvolto. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Ottieni un nuovo file; il caricamento in sé non viene modificato.',
      faq: [
        {
          question: 'Posso digitare tempi esatti?',
          answer: 'Sì. La finestra di taglio ha campi di inizio e fine oltre ai marcatori trascinabili.',
        },
        {
          question: 'Il taglio produrrà un clic?',
          answer: 'Aggiungi una breve dissolvenza in entrata e in uscita in Elaborazione audio di base per evitarlo.',
        },
        {
          question: 'Posso mantenere la qualità originale?',
          answer: 'Scegli l\'output WAV o FLAC per evitare una ricodifica con perdita.',
        },
        {
          question: 'Posso tagliare via la parte centrale?',
          answer: 'Un intervallo per passaggio; esegui lo strumento due volte e unisci le parti in Darkroom.',
        },
      ],
      related: [
        {
          label: 'Taglia video',
          to: '/tools/video-trimmer',
          description: 'Lo stesso per i video.',
        },
        {
          label: 'Estrai l\'audio da un video',
          to: '/tools/extract-audio-from-video',
          description: 'Ottieni prima l\'audio.',
        },
        {
          label: 'Convertitore audio',
          to: '/tools/audio-converter',
          description: 'Converti tra tutti i formati audio comuni.',
        },
        {
          label: 'Cambia la velocità dell\'audio',
          to: '/tools/change-audio-speed',
          description: 'Accelera o rallenta una registrazione.',
        },
        {
          label: 'Cambia l\'intonazione dell\'audio',
          to: '/tools/change-audio-pitch',
          description: 'Sposta la tonalità verso l\'alto o verso il basso.',
        },
        {
          label: 'Normalizza audio',
          to: '/tools/normalize-audio',
          description: 'Uniforma il loudness.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Rimozione del rumore con IA.',
        },
        {
          label: 'Rimuovi la voce da una canzone',
          to: '/tools/remove-vocals-from-song',
          description: 'Crea una base strumentale.',
        },
      ],
      embed: {
        title: 'Taglia un file audio',
        description: 'Carica un file audio, premi Taglia audio e trascina i marcatori di inizio e fine sulla forma d\'onda. Se vuoi, aggiungi una dissolvenza in entrata o in uscita in Elaborazione audio di base. Premi Converti.',
      },
    },
    'transcribe-audio': {
      name: 'Trascrivi audio',
      h1: 'Trascrivi l\'audio in testo online',
      tagline: 'Trasforma un MP3, WAV, M4A o qualsiasi registrazione in testo, sottotitoli o JSON con il riconoscimento vocale basato su IA sui nostri server GPU.',
      metaTitle: 'Trascrivi audio in testo online (IA gratuita) | Media Manipulator',
      metaDescription: 'Trascrizione audio online gratuita. Converti registrazioni MP3, WAV, M4A, OGG o FLAC in testo semplice, sottotitoli VTT o SRT, oppure JSON con timestamp. Gira sulla nostra GPU, senza IA di terze parti.',
      ogTitle: 'Trascrivi l\'audio in testo online',
      ogDescription: 'Registrazioni, interviste e memo vocali in testo. Gratis, senza registrazione.',
      intro: 'Interviste, lezioni, memo vocali e registrazioni di riunioni sono molto più utili come testo: ricercabili, citabili, traducibili. Media Manipulator trascrive l\'audio con un modello Whisper su un server GPU che gestiamo noi, così la tua registrazione non lascia mai la nostra infrastruttura, e restituisce testo semplice, sottotitoli VTT o SRT, oppure una trascrizione JSON con i timestamp delle parole.',
      whatItDoes: [
        'Trascrive MP3, WAV, M4A, OGG, FLAC e altri formati audio con Whisper.',
        'Produce testo semplice, VTT, SRT o JSON con timestamp.',
        'Rileva automaticamente la lingua tra decine di lingue.',
        'Gira sulla nostra GPU; nessun fornitore di IA di terze parti.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'audio',
          description: 'Qualsiasi formato comune.',
        },
        {
          title: 'Scegli un output',
          description: 'Testo, VTT, SRT o JSON.',
        },
        {
          title: 'Trascrivi',
          description: 'Whisper gira sul nostro server GPU.',
        },
        {
          title: 'Scarica',
          description: 'Apri il visualizzatore della trascrizione o salva il file.',
        },
      ],
      advancedDetails: [
        'Usa whisper-ctranslate2 con un modello multilingue large; la precisione è massima su parlato chiaro con poco rumore di fondo.',
        'Sulle registrazioni rumorose, esegui prima lo strumento Rimuovi il rumore di fondo per una trascrizione migliore.',
        'La trascrizione conta come un lavoro IA, scalato dalla quota giornaliera IA e non da quella ordinaria; un lavoro non riuscito non viene conteggiato.',
      ],
      whyItMatters: [
        'Il testo è ricercabile e si scorre rapidamente; l\'audio no.',
        'I sottotitoli rendono i contenuti audio accessibili e indicizzabili.',
        'Una trascrizione è il punto di partenza per appunti, articoli e traduzioni.',
      ],
      useCases: [
        {
          title: 'Appunti di intervista',
          description: 'Ottieni un testo da cui citare.',
        },
        {
          title: 'Trascrizione di una lezione',
          description: 'Studia dal testo, cerca i termini.',
        },
        {
          title: 'Sottotitoli per podcast',
          description: 'SRT o VTT per la versione video.',
        },
        {
          title: 'Da memo vocale a testo',
          description: 'Trasforma i pensieri in un documento.',
        },
      ],
      whyMediaManipulator: [
        'Whisper su hardware che gestiamo noi; il tuo audio non viene mai inviato a un\'IA di terze parti.',
        'Quattro formati di output e un visualizzatore della trascrizione integrato.',
      ],
      privacyNote: 'La tua registrazione viene trascritta da Whisper sul nostro server GPU e il testo viene conservato con il lavoro. L\'elaborazione IA gira su hardware che gestiamo noi, mai presso un fornitore di IA di terze parti, e nulla di ciò che carichi viene usato per addestrare un modello. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      faq: [
        {
          question: 'Quali lingue sono supportate?',
          answer: 'Whisper gestisce decine di lingue e rileva la lingua automaticamente.',
        },
        {
          question: 'Quanto è preciso?',
          answer: 'Molto buono su parlato chiaro. Rumore di fondo, voci sovrapposte e accenti marcati riducono la precisione; se puoi, rimuovi prima il rumore.',
        },
        {
          question: 'La mia registrazione viene inviata a OpenAI?',
          answer: 'No. Il modello gira sul nostro server GPU.',
        },
        {
          question: 'Posso ottenere le etichette dei parlanti?',
          answer: 'Non ancora. L\'output JSON ha timestamp a livello di parola con cui puoi segmentare.',
        },
        {
          question: 'Viene scalato dalla mia quota?',
          answer: 'Sì, come un lavoro IA sulla quota IA, che è separata da quella ordinaria. I lavori non riusciti non vengono conteggiati.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Conta come un lavoro IA; i lavori non riusciti non vengono conteggiati.',
        ],
      },
      related: [
        {
          label: 'Trascrivi video',
          to: '/tools/transcribe-video',
          description: 'Lo stesso per i file video.',
        },
        {
          label: 'Generatore di sottotitoli SRT',
          to: '/tools/srt-generator',
          description: 'Direttamente ai sottotitoli.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Ripulisci prima l\'audio.',
        },
        {
          label: 'Traduttore di sottotitoli',
          to: '/tools/caption-translator',
          description: 'Traduci i sottotitoli.',
        },
      ],
      embed: {
        title: 'Trascrivi un file audio',
        description: 'Carica un file audio e scegli un output: testo semplice per un documento, VTT o SRT per i sottotitoli, JSON per i timestamp. Whisper gira sul nostro server GPU; nulla viene inviato a un\'IA di terze parti.',
      },
    },
    'add-text-to-image': {
      name: 'Aggiungi testo a un\'immagine',
      h1: 'Aggiungi testo a un\'immagine online gratis',
      tagline: 'Inserisci una didascalia, un titolo o una filigrana su una foto: scegli carattere, dimensione, colore, contorno e posizione, e scarica.',
      metaTitle: 'Aggiungi testo a immagini online: didascalia, filigrana | Media Manipulator',
      metaDescription: 'Strumento online gratuito per aggiungere testo a una foto. Scegli carattere, dimensione, colore, contorno e posizione per una didascalia, un meme o una filigrana su JPG, PNG, WebP e altro. Senza registrazione.',
      ogTitle: 'Aggiungi testo a un\'immagine online gratis',
      ogDescription: 'Didascalia, titolo o filigrana su qualsiasi foto. Gratis, senza registrazione.',
      intro: 'Una didascalia su uno screenshot, un titolo su una miniatura, una riga di copyright nell\'angolo di una foto: aggiungere testo è la modifica più comune alle immagini dopo il ritaglio. Media Manipulator disegna il testo sull\'immagine sui nostri server con ImageMagick, con carattere, dimensione, colore di riempimento e del contorno, e una posizione scelta tra nove punti di ancoraggio o coordinate esatte in pixel, ed esporta nello stesso formato o in uno diverso.',
      whatItDoes: [
        'Disegna un blocco di testo di qualsiasi dimensione con colori di riempimento e contorno.',
        'Sei caratteri integrati (sans, serif, mono in due famiglie).',
        'Nove posizioni di ancoraggio o posizionamento esatto x/y.',
        'Combinalo con ridimensionamento, ritaglio, filtri e opzioni dei metadati nello stesso passaggio.',
      ],
      flowSteps: [
        {
          title: 'Carica un\'immagine',
          description: 'JPG, PNG, WebP, HEIC e altro.',
        },
        {
          title: 'Scrivi e formatta il testo',
          description: 'Dimensione, colori, contorno, carattere, posizione.',
        },
        {
          title: 'Converti',
          description: 'ImageMagick disegna il testo.',
        },
        {
          title: 'Scarica',
          description: 'Salva l\'immagine con la didascalia.',
        },
      ],
      advancedDetails: [
        'Il testo viene rasterizzato alla dimensione di output; imposta la dimensione in pixel in rapporto alla larghezza dell\'immagine.',
        'Un contorno da 2 a 4 px in un colore contrastante mantiene il testo leggibile sulle foto movimentate.',
        'Scegli l\'output PNG per mantenere uno sfondo trasparente per un modello di filigrana.',
      ],
      whyItMatters: [
        'Le didascalie rendono gli screenshot autoesplicativi.',
        'Una riga di copyright visibile scoraggia la ripubblicazione senza credito.',
        'Le miniature con un titolo ottengono più clic.',
      ],
      useCases: [
        {
          title: 'Didascalia su uno screenshot',
          description: 'Indica cosa sta guardando chi lo vede.',
        },
        {
          title: 'Filigrana su una foto',
          description: 'Il tuo nome nell\'angolo in basso.',
        },
        {
          title: 'Titolo per miniatura',
          description: 'Testo grande e in grassetto per la miniatura di un video.',
        },
        {
          title: 'Meme',
          description: 'Testo in alto, testo in basso.',
        },
      ],
      whyMediaManipulator: [
        'Riempimento, contorno, carattere e posizionamento a nove punti, non solo una casella di testo.',
        'Ridimensiona, ritaglia e converti nello stesso caricamento.',
      ],
      privacyNote: 'Il testo che hai digitato viene disegnato sulla tua immagine da ImageMagick sul nostro server. Nulla viene inviato a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'originale non viene mai alterato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Posso aggiungere più di una riga?',
          answer: 'Un blocco di testo per passaggio; un\'interruzione di riga nel testo va a capo. Esegui di nuovo lo strumento per un secondo blocco.',
        },
        {
          question: 'Posso usare il mio carattere?',
          answer: 'Sono disponibili sei caratteri integrati; il caricamento di caratteri personalizzati non è supportato.',
        },
        {
          question: 'Come posiziono il testo con precisione?',
          answer: 'Scegli un punto di ancoraggio e aggiungi scostamenti x/y in pixel.',
        },
        {
          question: 'Ridurrà la qualità?',
          answer: 'L\'immagine viene ricodificata; scegli PNG o una qualità JPG alta per mantenerla nitida.',
        },
      ],
      related: [
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra formati di immagine.',
        },
        {
          label: 'Ritaglia immagine',
          to: '/tools/crop-image',
          description: 'Taglia a una regione.',
        },
        {
          label: 'Ridimensiona immagine',
          to: '/tools/image-resizer',
          description: 'Cambia le dimensioni.',
        },
        {
          label: 'Filtri per immagini',
          to: '/tools/image-filters',
          description: 'Seppia, schizzo, rilievo e altro ancora.',
        },
        {
          label: 'Rimuovi i metadati EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimina i dati di posizione e del dispositivo.',
        },
      ],
      embed: {
        title: 'Aggiungi testo a un\'immagine',
        description: 'Carica un\'immagine. La sezione Testo sovrapposto è evidenziata: digita il testo, imposta dimensione, colore, contorno, carattere e posizione (nove punti di ancoraggio o coordinate esatte). Premi Converti.',
      },
    },
    'crop-image': {
      name: 'Ritaglia immagine',
      h1: 'Ritaglia un\'immagine online gratis',
      tagline: 'Trascina un riquadro sulla parte della foto che vuoi, raddrizza l\'inquadratura e scarica solo quella regione in qualsiasi formato.',
      metaTitle: 'Ritaglia immagini online gratis | Media Manipulator',
      metaDescription: 'Strumento online gratuito per ritagliare le immagini. Trascina per selezionare una regione di una foto JPG, PNG, WebP o HEIC e scaricala. Combinalo con ridimensionamento, filtri e conversione di formato. Senza registrazione.',
      ogTitle: 'Ritaglia un\'immagine online gratis',
      ogDescription: 'Trascina un riquadro, scarica la regione. Gratis, senza registrazione.',
      intro: 'Il ritaglio corregge l\'inquadratura, elimina il disordine ai bordi e trasforma una foto in una più stretta. Media Manipulator apre un selettore visivo di ritaglio sull\'immagine caricata, applica il ritaglio sui nostri server con ImageMagick e ti lascia ridimensionare, filtrare e convertire il risultato nello stesso passaggio.',
      whatItDoes: [
        'Riquadro di ritaglio visivo con maniglie da trascinare direttamente sull\'immagine.',
        'Coordinate esatte del ritaglio mostrate e modificabili.',
        'Combinalo con il ridimensionamento a una larghezza e altezza di destinazione dopo il ritaglio.',
        'Salva l\'area ritagliata come JPG, PNG, WebP, AVIF o GIF.',
      ],
      flowSteps: [
        {
          title: 'Carica un\'immagine',
          description: 'Qualsiasi formato comune.',
        },
        {
          title: 'Disegna il ritaglio',
          description: 'Trascina il riquadro e le maniglie.',
        },
        {
          title: 'Converti',
          description: 'ImageMagick ritaglia e codifica.',
        },
        {
          title: 'Scarica',
          description: 'Salva l\'immagine ritagliata.',
        },
      ],
      advancedDetails: [
        'Il ritaglio viene applicato prima del ridimensionamento, quindi una foto da 4000 px ritagliata a 1000 px e ridimensionata a 500 px viene ridotta una sola volta.',
        'Il ritaglio elimina pixel e non è reversibile; conserva l\'originale.',
        'L\'orientamento EXIF viene rispettato, quindi una foto del telefono ruotata viene ritagliata come la vedi.',
      ],
      whyItMatters: [
        'Un\'inquadratura più stretta è il miglioramento più rapido per la maggior parte delle foto.',
        'Immagini del profilo e miniature richiedono regioni e proporzioni specifiche.',
        'Ritagliare via un passante o una targa è una correzione per la privacy.',
      ],
      useCases: [
        {
          title: 'Immagine del profilo',
          description: 'Ritaglia sul viso.',
        },
        {
          title: 'Elimina il disordine',
          description: 'Togli i bordi di una foto.',
        },
        {
          title: 'Dettaglio di uno screenshot',
          description: 'Tieni solo la parte rilevante.',
        },
        {
          title: 'Foto di prodotto',
          description: 'Ritaglia stretto, poi ridimensiona per un\'inserzione.',
        },
      ],
      whyMediaManipulator: [
        'Selettore visivo di ritaglio con coordinate esatte, più ridimensionamento e conversione nello stesso passaggio.',
        'Metadati mantenuti o rimossi a tua scelta.',
      ],
      privacyNote: 'La tua immagine viene tagliata all\'area che hai selezionato da ImageMagick sul nostro server. Nulla viene inviato a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'originale non viene mai alterato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Posso ritagliare con proporzioni fisse?',
          answer: 'Trascina il riquadro alle proporzioni che ti servono; larghezza e altezza vengono mostrate mentre procedi.',
        },
        {
          question: 'Il ritaglio fa perdere qualità?',
          answer: 'I pixel rimanenti restano intatti. Scegli PNG o una qualità JPG alta per la ricodifica.',
        },
        {
          question: 'Posso ritagliare un video?',
          answer: 'Sì, con lo strumento Ritaglia video.',
        },
        {
          question: 'Posso ruotare prima?',
          answer: 'Usa lo strumento Ruota immagine, poi ritaglia.',
        },
      ],
      related: [
        {
          label: 'Ritaglia video',
          to: '/tools/crop-video',
          description: 'Lo stesso per i video.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra formati di immagine.',
        },
        {
          label: 'Ridimensiona immagine',
          to: '/tools/image-resizer',
          description: 'Cambia le dimensioni.',
        },
        {
          label: 'Aggiungi testo a un\'immagine',
          to: '/tools/add-text-to-image',
          description: 'Didascalia o filigrana.',
        },
        {
          label: 'Filtri per immagini',
          to: '/tools/image-filters',
          description: 'Seppia, schizzo, rilievo e altro ancora.',
        },
        {
          label: 'Rimuovi i metadati EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimina i dati di posizione e del dispositivo.',
        },
      ],
      embed: {
        title: 'Ritaglia un\'immagine',
        description: 'Carica un\'immagine e premi Ritaglia immagine per aprire il selettore visivo di ritaglio. Trascina il riquadro sulla regione che vuoi e salva; il ritaglio viene applicato quando premi Converti.',
      },
    },
    'grayscale-image': {
      name: 'Converti immagine in bianco e nero',
      h1: 'Converti un\'immagine in bianco e nero online',
      tagline: 'Trasforma una foto a colori in scala di grigi, oppure in seppia per un tono vintage, e scaricala in qualsiasi formato.',
      metaTitle: 'Converti immagini in bianco e nero online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito di foto in bianco e nero. Trasforma qualsiasi immagine JPG, PNG, WebP o HEIC in scala di grigi o seppia e scaricala. Combinalo con ritaglio, ridimensionamento e cambio di formato. Senza registrazione.',
      ogTitle: 'Converti un\'immagine in bianco e nero online',
      ogDescription: 'Scala di grigi o seppia in un clic. Gratis, senza registrazione.',
      intro: 'Il bianco e nero riduce una foto a luce, forma e texture, nasconde le dominanti di colore e le luci miste e dà a un insieme di foto un aspetto coerente. Media Manipulator converte in scala di grigi sui nostri server con ImageMagick usando una conversione pesata sulla luminanza, offre toni seppia e vintage ed esporta in qualsiasi formato di immagine.',
      whatItDoes: [
        'Converte un\'immagine a colori in scala di grigi con la corretta ponderazione della luminanza.',
        'Alternative seppia e vintage per un tono caldo o invecchiato.',
        'Combinalo con ritaglio, ridimensionamento, testo e conversione di formato.',
        'La copia monocromatica può essere JPG, PNG, WebP, AVIF o GIF.',
      ],
      flowSteps: [
        {
          title: 'Carica un\'immagine',
          description: 'Qualsiasi formato comune.',
        },
        {
          title: 'Tieni la scala di grigi o scegli seppia',
          description: 'Il filtro è preselezionato.',
        },
        {
          title: 'Converti',
          description: 'ImageMagick applica la conversione.',
        },
        {
          title: 'Scarica',
          description: 'Salva il risultato.',
        },
      ],
      advancedDetails: [
        'La scala di grigi usa i pesi di luminanza Rec. 709, quindi i verdi risultano più chiari dei blu, come si aspetta l\'occhio.',
        'Il seppia applica un tono dopo la scala di grigi; il vintage aggiunge una leggera sbiaditura e una vignettatura.',
        'L\'output mantiene tre canali, a meno che tu non scelga un formato che memorizza la scala di grigi in modo nativo.',
      ],
      whyItMatters: [
        'Il monocromo nasconde colori scadenti e luci miste.',
        'Un insieme coerente in bianco e nero sembra curato.',
        'Le immagini in scala di grigi si comprimono in file più piccoli.',
      ],
      useCases: [
        {
          title: 'Ritratto',
          description: 'Classico primo piano in bianco e nero.',
        },
        {
          title: 'Scansione di un documento',
          description: 'Porta in scala di grigi una pagina fotografata.',
        },
        {
          title: 'Aspetto vintage',
          description: 'Seppia su una foto di famiglia.',
        },
        {
          title: 'Stampa',
          description: 'Prepara per una stampante in bianco e nero.',
        },
      ],
      whyMediaManipulator: [
        'Scala di grigi corretta per luminanza, più seppia e vintage.',
        'Ritaglia, ridimensiona e converti nello stesso caricamento.',
      ],
      privacyNote: 'Il colore della tua immagine viene rimosso da ImageMagick sul nostro server. Nulla viene inviato a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'originale non viene mai alterato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Scala di grigi o desaturazione?',
          answer: 'Questa è una scala di grigi pesata sulla luminanza, che appare più naturale della semplice rimozione della saturazione.',
        },
        {
          question: 'Posso ottenere un tono seppia?',
          answer: 'Sì. Scegli seppia o vintage nel menu del filtro.',
        },
        {
          question: 'Posso farlo su un video?',
          answer: 'Sì. Usa Regola luminosità e colori del video e imposta la saturazione a -100.',
        },
        {
          question: 'Il colore originale è recuperabile?',
          answer: 'No. Conserva il file originale.',
        },
      ],
      related: [
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra formati di immagine.',
        },
        {
          label: 'Ritaglia immagine',
          to: '/tools/crop-image',
          description: 'Taglia a una regione.',
        },
        {
          label: 'Ridimensiona immagine',
          to: '/tools/image-resizer',
          description: 'Cambia le dimensioni.',
        },
        {
          label: 'Aggiungi testo a un\'immagine',
          to: '/tools/add-text-to-image',
          description: 'Didascalia o filigrana.',
        },
        {
          label: 'Filtri per immagini',
          to: '/tools/image-filters',
          description: 'Seppia, schizzo, rilievo e altro ancora.',
        },
        {
          label: 'Rimuovi i metadati EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimina i dati di posizione e del dispositivo.',
        },
      ],
      embed: {
        title: 'Converti un\'immagine in bianco e nero',
        description: 'Carica un\'immagine. Il filtro è preimpostato su scala di grigi; passa a seppia o vintage per un tono più caldo. Premi Converti.',
      },
    },
    'image-filters': {
      name: 'Filtri ed effetti per immagini',
      h1: 'Applica filtri ed effetti a un\'immagine online',
      tagline: 'Pittura a olio, schizzo, carboncino, rilievo, vintage, vortice, sfocatura, nitidezza e altro ancora, applicati a qualsiasi foto con un clic.',
      metaTitle: 'Filtri per immagini online gratis: schizzo, olio, rilievo | Media Manipulator',
      metaDescription: 'Filtri fotografici online gratuiti. Applica pittura a olio, schizzo a matita, carboncino, rilievo, vintage, seppia, vortice, sfocatura o nitidezza a JPG, PNG, WebP e altro, poi scarica. Senza registrazione.',
      ogTitle: 'Applica filtri ed effetti a un\'immagine online',
      ogDescription: 'Schizzo, pittura a olio, rilievo, vintage e altro ancora. Gratis, senza registrazione.',
      intro: 'A volte una foto vuole diventare qualcos\'altro: uno schizzo per un invito, una pittura a olio per una stampa, un logo in rilievo, un astratto a vortice. Media Manipulator applica i filtri artistici e correttivi di ImageMagick sui nostri server, dallo schizzo a matita alla nitidezza, ed esporta in qualsiasi formato immagine, con ritaglio, ridimensionamento e didascalia facoltativi nello stesso passaggio.',
      whatItDoes: [
        'Artistici: pittura a olio, schizzo, carboncino, rilievo, vintage, seppia, vortice, distorsione a barilotto.',
        'Correttivi: sfocatura, nitidezza, scala di grigi.',
        'Rotazioni di 45, 90, 180 e 270 gradi nello stesso menu.',
        'Combinalo con ritaglio, ridimensionamento, testo in sovrimpressione e conversione di formato.',
      ],
      flowSteps: [
        {
          title: 'Carica un\'immagine',
          description: 'Qualsiasi formato comune.',
        },
        {
          title: 'Scegli un filtro',
          description: 'Pittura a olio è preselezionata.',
        },
        {
          title: 'Converti',
          description: 'ImageMagick renderizza l\'effetto.',
        },
        {
          title: 'Scarica',
          description: 'Salva il risultato.',
        },
      ],
      advancedDetails: [
        'Pittura a olio e carboncino si basano su un raggio e scalano con la dimensione dell\'immagine; ridimensiona da 1500 a 2500 px per l\'effetto più marcato.',
        'Schizzo e rilievo funzionano meglio su immagini con contorni netti e un buon contrasto.',
        'Gli effetti vengono renderizzati nei pixel; conserva l\'originale.',
      ],
      whyItMatters: [
        'Un\'immagine stilizzata si distingue in un feed di foto.',
        'Gli stili a schizzo e a dipinto sono comuni per biglietti, poster e stampe.',
        'Nitidezza e sfocatura sono correzioni di tutti i giorni.',
      ],
      useCases: [
        {
          title: 'Ritratto a matita',
          description: 'Filtro schizzo su una foto per un biglietto.',
        },
        {
          title: 'Stampa dipinta',
          description: 'Pittura a olio per una stampa su tela.',
        },
        {
          title: 'Logo in rilievo',
          description: 'Metti in rilievo un logo piatto.',
        },
        {
          title: 'Nitidezza per una scansione',
          description: 'Fai risaltare i contorni di una scansione morbida.',
        },
      ],
      whyMediaManipulator: [
        'Dodici filtri artistici e correttivi in un unico menu.',
        'Ritaglia, ridimensiona, aggiungi una didascalia e converti nello stesso caricamento.',
      ],
      privacyNote: 'Il filtro che scegli viene applicato alla tua immagine da ImageMagick sul nostro server. Nulla viene inviato a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'originale non viene mai modificato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Posso regolare l\'intensità?',
          answer: 'I filtri usano intensità fisse e calibrate. Ridimensiona l\'immagine più grande o più piccola per cambiare quanto appare forte un effetto basato sul raggio.',
        },
        {
          question: 'Posso sovrapporre più filtri?',
          answer: 'Un filtro per passaggio; ripassa il risultato nello strumento per applicarne un secondo.',
        },
        {
          question: 'C\'è un trasferimento di stile con IA?',
          answer: 'No. Sono effetti classici di ImageMagick, che vengono applicati all\'istante.',
        },
        {
          question: 'Quale filtro funziona per un logo?',
          answer: 'Rilievo o carboncino su un logo ad alto contrasto.',
        },
      ],
      related: [
        {
          label: 'Bianco e nero',
          to: '/tools/grayscale-image',
          description: 'Scala di grigi e seppia.',
        },
        {
          label: 'Sfoca immagine',
          to: '/tools/blur-image',
          description: 'Ammorbidisci o nascondi.',
        },
        {
          label: 'Aumenta la nitidezza dell\'immagine',
          to: '/tools/sharpen-image',
          description: 'Fai risaltare i dettagli.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra formati immagine.',
        },
        {
          label: 'Ritaglia immagine',
          to: '/tools/crop-image',
          description: 'Taglia una regione.',
        },
        {
          label: 'Ridimensiona immagine',
          to: '/tools/image-resizer',
          description: 'Cambia le dimensioni.',
        },
        {
          label: 'Aggiungi testo a un\'immagine',
          to: '/tools/add-text-to-image',
          description: 'Didascalia o filigrana.',
        },
        {
          label: 'Rimuovi i metadati EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimina i dati di posizione e dispositivo.',
        },
      ],
      embed: {
        title: 'Applica un filtro a un\'immagine',
        description: 'Carica un\'immagine e scegli un filtro; pittura a olio è preselezionata. Sono disponibili schizzo, carboncino, rilievo, vintage, seppia, vortice, distorsione a barilotto, sfocatura e nitidezza. Premi Converti.',
      },
    },
    'rotate-image': {
      name: 'Ruota immagine',
      h1: 'Ruota un\'immagine online gratis',
      tagline: 'Ruota una foto di 90°, 180° o 270°, correggi una scansione o una foto del telefono di traverso, e scaricala in qualsiasi formato.',
      metaTitle: 'Ruota immagine online gratis (90°, 180°, 270°) | Media Manipulator',
      metaDescription: 'Rotatore di immagini online gratuito. Ruota una foto JPG, PNG, WebP o HEIC di 90, 180 o 270 gradi, oppure di 45 per un\'inclinazione, e scaricala. La rotazione viene fissata nei pixel. Senza registrazione.',
      ogTitle: 'Ruota un\'immagine online gratis',
      ogDescription: 'Correggi una foto di traverso con un clic. Gratis, senza registrazione.',
      intro: 'I telefoni registrano l\'orientamento come un tag che alcuni visualizzatori ignorano, mentre scanner e vecchie fotocamere lo sbagliano del tutto. Ruotare i pixel stessi risolve il problema una volta per tutte. Media Manipulator ruota le immagini sui nostri server con ImageMagick di 90, 180, 270 o 45 gradi, rispetta prima il tag di orientamento esistente ed esporta in qualsiasi formato.',
      whatItDoes: [
        'Ruota di 90° (in senso orario), 180°, 270° (in senso antiorario) o 45°.',
        'Fissa la rotazione nei pixel e azzera il tag di orientamento EXIF.',
        'Combinalo con ritaglio, ridimensionamento e conversione di formato.',
        'Salva l\'immagine ruotata come JPG, PNG, WebP, AVIF o GIF.',
      ],
      flowSteps: [
        {
          title: 'Carica un\'immagine',
          description: 'Qualsiasi formato comune.',
        },
        {
          title: 'Scegli l\'angolo',
          description: '90° è preselezionato.',
        },
        {
          title: 'Converti',
          description: 'ImageMagick ruota e codifica.',
        },
        {
          title: 'Scarica',
          description: 'Salva l\'immagine dritta.',
        },
      ],
      advancedDetails: [
        'L\'orientamento EXIF esistente viene applicato per primo, così ciò che vedi è ciò che viene ruotato.',
        'Una rotazione di 45° aggiunge un riempimento di sfondo agli angoli; se serve, ritaglia dopo.',
        'Per lo specchio orizzontale o verticale usa invece gli strumenti Capovolgi e rifletti.',
      ],
      whyItMatters: [
        'Le foto di traverso sono il reclamo più comune sui caricamenti in forum e moduli.',
        'Alcune app ignorano il tag di orientamento, quindi la rotazione fissata nei pixel è l\'unica correzione affidabile.',
        'Scansioni e file di vecchie fotocamere spesso non hanno alcun tag.',
      ],
      useCases: [
        {
          title: 'Foto del telefono di traverso',
          description: 'Ruota di 90° così è dritta ovunque.',
        },
        {
          title: 'Scansione capovolta',
          description: 'Ruota di 180°.',
        },
        {
          title: 'Correggi un caricamento per un modulo',
          description: 'Ruota prima di inviare la foto di un documento.',
        },
        {
          title: 'Effetto inclinato',
          description: 'Ruota di 45° per un elemento grafico.',
        },
      ],
      whyMediaManipulator: [
        'Rotazione applicata ai pixel, con il tag di orientamento gestito correttamente.',
        'Ritaglia, ridimensiona e converti nello stesso caricamento.',
      ],
      privacyNote: 'La tua immagine viene ruotata dell\'angolo che scegli da ImageMagick sul nostro server. Nulla viene inviato a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'originale non viene mai modificato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Perché la mia foto è dritta sul telefono ma di traverso altrove?',
          answer: 'Il tuo telefono ha scritto un tag di orientamento che l\'altra app ignora. Ruotandola qui, l\'orientamento viene fissato nei pixel.',
        },
        {
          question: 'Ruotare fa perdere qualità?',
          answer: 'La rotazione per multipli di 90° è senza perdita a livello geometrico; l\'unico costo è la ricodifica. Usa PNG o una qualità JPG alta.',
        },
        {
          question: 'Posso ruotare di un angolo qualsiasi?',
          answer: 'Sono offerti solo i 45° e i multipli di 90°.',
        },
        {
          question: 'Posso invece specchiare l\'immagine?',
          answer: 'Non qui; la riflessione non è attualmente offerta per le immagini.',
        },
      ],
      related: [
        {
          label: 'Ruota video',
          to: '/tools/rotate-video',
          description: 'Lo stesso per i video.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra formati immagine.',
        },
        {
          label: 'Ritaglia immagine',
          to: '/tools/crop-image',
          description: 'Taglia una regione.',
        },
        {
          label: 'Ridimensiona immagine',
          to: '/tools/image-resizer',
          description: 'Cambia le dimensioni.',
        },
        {
          label: 'Aggiungi testo a un\'immagine',
          to: '/tools/add-text-to-image',
          description: 'Didascalia o filigrana.',
        },
        {
          label: 'Filtri per immagini',
          to: '/tools/image-filters',
          description: 'Seppia, schizzo, rilievo e altro ancora.',
        },
        {
          label: 'Rimuovi i metadati EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimina i dati di posizione e dispositivo.',
        },
      ],
      embed: {
        title: 'Ruota un\'immagine',
        description: 'Carica un\'immagine. Il menu dei filtri è preimpostato su ruota di 90°; scegli invece 180°, 270° o 45°. La rotazione viene applicata ai pixel, così ogni visualizzatore la mostra allo stesso modo. Premi Converti.',
      },
    },
    'sharpen-image': {
      name: 'Aumenta la nitidezza dell\'immagine',
      h1: 'Aumenta la nitidezza di un\'immagine online gratis',
      tagline: 'Fai risaltare i contorni di una foto o di una scansione leggermente morbida con una nitidezza in un clic, e scarica in qualsiasi formato.',
      metaTitle: 'Aumenta la nitidezza di un\'immagine online gratis | Media Manipulator',
      metaDescription: 'Strumento online gratuito per la nitidezza delle immagini. Rendi più nitida una foto o una scansione JPG, PNG, WebP o HEIC morbida e scaricala. Per recuperare davvero i dettagli prova il restauro di immagini con IA. Senza registrazione.',
      ogTitle: 'Aumenta la nitidezza di un\'immagine online gratis',
      ogDescription: 'Rendi più nitida una foto morbida con un clic. Gratis, senza registrazione.',
      intro: 'Una foto un po\' morbida per via di un obiettivo lento, di un ridimensionamento o di uno scanner trae beneficio da un passaggio di nitidezza che aumenta il contrasto lungo i contorni. Media Manipulator applica una nitidezza con maschera di contrasto sui nostri server con ImageMagick ed esporta in qualsiasi formato. Per una sfocatura che va oltre la semplice morbidezza, lo strumento di restauro di immagini con IA recupera dettagli che la nitidezza non può restituire.',
      whatItDoes: [
        'Applica una nitidezza con maschera di contrasto calibrata a qualsiasi immagine.',
        'Combinalo con il ridimensionamento: aumenta la nitidezza dopo la riduzione per miniature nitide.',
        'Scarica il risultato più nitido come JPG, PNG, WebP, AVIF o GIF.',
        'Confronta originale e risultato fianco a fianco.',
      ],
      flowSteps: [
        {
          title: 'Carica un\'immagine',
          description: 'Qualsiasi formato comune.',
        },
        {
          title: 'Lascia selezionata la nitidezza',
          description: 'Aggiungi un ridimensionamento, se vuoi.',
        },
        {
          title: 'Converti',
          description: 'ImageMagick applica la maschera di contrasto.',
        },
        {
          title: 'Scarica',
          description: 'Salva l\'immagine più nitida.',
        },
      ],
      advancedDetails: [
        'La nitidezza aumenta il contrasto locale sui contorni; non aggiunge dettagli. Un eccesso di nitidezza si vede sotto forma di aloni.',
        'Ridurre e poi aumentare la nitidezza è la ricetta classica per immagini web nitide.',
        'Per il mosso, la messa a fuoco mancata o le sorgenti a bassa risoluzione, usa il restauro di immagini con IA.',
      ],
      whyItMatters: [
        'Le immagini ridotte perdono contrasto sui contorni e sembrano morbide senza un passaggio di nitidezza.',
        'Le scansioni di documenti e stampe sono spesso leggermente morbide.',
        'Un\'immagine nitida viene percepita come di qualità più alta.',
      ],
      useCases: [
        {
          title: 'Miniatura',
          description: 'Ridimensiona e aumenta la nitidezza per il web.',
        },
        {
          title: 'Scansione morbida',
          description: 'Rendi più nitida una stampa scansionata.',
        },
        {
          title: 'Foto di prodotto',
          description: 'Definisci i contorni prima di pubblicare l\'annuncio.',
        },
        {
          title: 'Fuoco leggermente mancato',
          description: 'Recupera un po\' di nitidezza apparente.',
        },
      ],
      whyMediaManipulator: [
        'Maschera di contrasto calibrata con ridimensionamento nello stesso passaggio.',
        'Restauro con IA disponibile quando la nitidezza non basta.',
      ],
      privacyNote: 'La tua immagine viene resa più nitida da ImageMagick sul nostro server con l\'intensità che imposti. Nulla viene inviato a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'originale non viene mai modificato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Sistema una foto sfocata?',
          answer: 'Aiuta con una leggera morbidezza. Per una vera sfocatura, usa il restauro di immagini con IA, che ricostruisce i dettagli.',
        },
        {
          question: 'Posso controllare l\'intensità?',
          answer: 'L\'intensità è fissa e calibrata; ripeti il passaggio due volte per un effetto maggiore, oppure usa una dimensione di output più piccola per un effetto relativo più forte.',
        },
        {
          question: 'Aggiunge rumore?',
          answer: 'La nitidezza può accentuare la grana già presente. Usa una qualità JPG alta per non peggiorarla.',
        },
      ],
      related: [
        {
          label: 'Restauro di immagini con IA',
          to: '/tools/ai-image-restoration',
          description: 'Recupera dettagli reali con l\'IA.',
        },
        {
          label: 'Upscaler di immagini con IA',
          to: '/tools/ai-image-upscaler',
          description: 'Ingrandisci senza sfocature.',
        },
        {
          label: 'Sfoca immagine',
          to: '/tools/blur-image',
          description: 'L\'opposto.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra formati immagine.',
        },
        {
          label: 'Ritaglia immagine',
          to: '/tools/crop-image',
          description: 'Taglia una regione.',
        },
        {
          label: 'Ridimensiona immagine',
          to: '/tools/image-resizer',
          description: 'Cambia le dimensioni.',
        },
        {
          label: 'Aggiungi testo a un\'immagine',
          to: '/tools/add-text-to-image',
          description: 'Didascalia o filigrana.',
        },
        {
          label: 'Filtri per immagini',
          to: '/tools/image-filters',
          description: 'Seppia, schizzo, rilievo e altro ancora.',
        },
        {
          label: 'Rimuovi i metadati EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimina i dati di posizione e dispositivo.',
        },
      ],
      embed: {
        title: 'Aumenta la nitidezza di un\'immagine',
        description: 'Carica un\'immagine. Il filtro è preimpostato su nitidezza. Premi Converti e confronta il risultato con l\'originale nel visualizzatore.',
      },
    },
    'blur-image': {
      name: 'Sfoca immagine',
      h1: 'Sfoca un\'immagine online gratis',
      tagline: 'Ammorbidisci un\'intera foto per uno sfondo, un segnaposto o uno schermo di privacy, e scaricala in qualsiasi formato.',
      metaTitle: 'Sfoca immagine online gratis | Media Manipulator',
      metaDescription: 'Sfocatura di immagini online gratuita. Ammorbidisci un\'intera foto JPG, PNG, WebP o HEIC per uno sfondo, un segnaposto o uno schermo di privacy. Per sfocare solo i volti usa lo strumento di sfocatura dei volti. Senza registrazione.',
      ogTitle: 'Sfoca un\'immagine online gratis',
      ogDescription: 'Ammorbidisci una foto con un clic. Gratis, senza registrazione.',
      intro: 'Una foto sfocata crea uno sfondo tranquillo dietro un testo, un segnaposto a basso dettaglio mentre l\'immagine vera si carica, oppure uno schermo di privacy per uno screenshot. Media Manipulator applica una sfocatura gaussiana all\'intera immagine sui nostri server con ImageMagick ed esporta in qualsiasi formato. Per sfocare solo i volti o una targa, gli strumenti di sfocatura dei volti con IA e di oscuramento del testo intervengono proprio su quelle regioni.',
      whatItDoes: [
        'Applica una sfocatura gaussiana all\'intera immagine.',
        'Combinalo con il ridimensionamento per un minuscolo segnaposto sfocato.',
        'L\'immagine ammorbidita torna come JPG, PNG, WebP, AVIF o GIF.',
        'Gli strumenti correlati sfocano i volti o oscurano il testo in modo selettivo.',
      ],
      flowSteps: [
        {
          title: 'Carica un\'immagine',
          description: 'Qualsiasi formato comune.',
        },
        {
          title: 'Lascia selezionata la sfocatura',
          description: 'Ridimensiona, se vuoi.',
        },
        {
          title: 'Converti',
          description: 'ImageMagick sfoca e codifica.',
        },
        {
          title: 'Scarica',
          description: 'Salva l\'immagine ammorbidita.',
        },
      ],
      advancedDetails: [
        'Il raggio di sfocatura è fisso; per un effetto più forte, prima riduci l\'immagine, sfocala e poi ingrandiscila di nuovo.',
        'Le immagini sfocate si comprimono moltissimo, ed è per questo che sono ottimi segnaposto.',
        'Uno screenshot sfocato non è un oscuramento: a volte il testo può essere recuperato. Per i contenuti sensibili usa l\'oscuramento del testo.',
      ],
      whyItMatters: [
        'Gli sfondi sfocati mantengono leggibile il testo in sovrimpressione.',
        'I segnaposto a bassa qualità migliorano la velocità percepita della pagina.',
        'Una versione soffusa di una foto è un elemento grafico comune.',
      ],
      useCases: [
        {
          title: 'Sfondo per un testo',
          description: 'Sfoca una foto su cui mettere un titolo.',
        },
        {
          title: 'Segnaposto',
          description: 'Minuscola anteprima sfocata per il caricamento differito.',
        },
        {
          title: 'Schermo di privacy',
          description: 'Ammorbidisci uno screenshot prima di condividerlo, poi oscuralo come si deve.',
        },
        {
          title: 'Effetto sognante',
          description: 'Sovrapposizione soffusa per una grafica.',
        },
      ],
      whyMediaManipulator: [
        'Qui la sfocatura dell\'intera immagine; sfocatura dei volti e oscuramento del testo come strumenti IA dedicati.',
        'Ridimensiona e converti nello stesso caricamento.',
      ],
      privacyNote: 'La tua immagine viene sfocata da ImageMagick sul nostro server con il raggio che imposti. Nulla viene inviato a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'originale non viene mai modificato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Posso sfocare solo una parte dell\'immagine?',
          answer: 'Usa Sfoca i volti in una foto per i volti oppure Oscura il testo in un\'immagine per testo e targhe.',
        },
        {
          question: 'La sfocatura basta a nascondere un testo?',
          answer: 'Non in modo affidabile. Usa lo strumento di oscuramento, che ricopre la regione.',
        },
        {
          question: 'Posso controllare la quantità di sfocatura?',
          answer: 'Il raggio è fisso; riduci l\'immagine prima di sfocarla per un effetto più forte.',
        },
      ],
      related: [
        {
          label: 'Sfoca i volti in una foto',
          to: '/tools/blur-faces-in-photo',
          description: 'Sfocatura dei volti con IA.',
        },
        {
          label: 'Oscura il testo in un\'immagine',
          to: '/tools/redact-text-in-image',
          description: 'Nascondi testo e targhe.',
        },
        {
          label: 'Aumenta la nitidezza dell\'immagine',
          to: '/tools/sharpen-image',
          description: 'L\'opposto.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra formati immagine.',
        },
        {
          label: 'Ritaglia immagine',
          to: '/tools/crop-image',
          description: 'Taglia una regione.',
        },
        {
          label: 'Ridimensiona immagine',
          to: '/tools/image-resizer',
          description: 'Cambia le dimensioni.',
        },
        {
          label: 'Aggiungi testo a un\'immagine',
          to: '/tools/add-text-to-image',
          description: 'Didascalia o filigrana.',
        },
        {
          label: 'Filtri per immagini',
          to: '/tools/image-filters',
          description: 'Seppia, schizzo, rilievo e altro ancora.',
        },
        {
          label: 'Rimuovi i metadati EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimina i dati di posizione e dispositivo.',
        },
      ],
      embed: {
        title: 'Sfoca un\'immagine',
        description: 'Carica un\'immagine. Il filtro è preimpostato su sfocatura, che ammorbidisce l\'intera foto. Per sfocare solo i volti, usa lo strumento Sfoca i volti in una foto. Premi Converti.',
      },
    },
    'generate-vtt-captions': {
      name: 'Generatore di sottotitoli VTT',
      h1: 'Genera sottotitoli WebVTT da video o audio',
      tagline: 'Crea un file di sottotitoli .vtt per video HTML5, YouTube o un lettore con trascrizione basata su IA sui nostri server GPU.',
      metaTitle: 'Generatore di sottotitoli VTT online (IA gratis) | Media Manipulator',
      metaDescription: 'Generatore di sottotitoli WebVTT online gratuito. Carica un file video o audio e scarica un file .vtt con sottotitoli temporizzati per video HTML5, YouTube, Vimeo o qualsiasi lettore. Gira sulla nostra GPU.',
      ogTitle: 'Genera sottotitoli WebVTT online',
      ogDescription: 'Sottotitoli .vtt temporizzati dall\'IA per qualsiasi video. Gratis, senza registrazione.',
      intro: 'WebVTT è il formato dei sottotitoli del web: l\'elemento track di HTML5, YouTube, Vimeo e i lettori HLS e DASH lo leggono tutti. Media Manipulator genera sottotitoli VTT temporizzati da qualsiasi video o audio con un modello Whisper su un server GPU che gestiamo noi, così i tuoi file non vanno mai a un\'IA di terze parti, e apre il risultato in un visualizzatore di sottotitoli dove puoi controllare i tempi prima di scaricare.',
      whatItDoes: [
        'Trascrive il parlato e lo segmenta in battute temporizzate.',
        'Produce un file .vtt conforme allo standard.',
        'Rileva automaticamente la lingua.',
        'Gira sulla nostra GPU; nessun fornitore di IA di terze parti.',
      ],
      flowSteps: [
        {
          title: 'Carica video o audio',
          description: 'Qualsiasi formato comune.',
        },
        {
          title: 'Lascia selezionato VTT',
          description: 'Oppure passa a SRT, testo o JSON.',
        },
        {
          title: 'Trascrivi',
          description: 'Whisper temporizza ogni battuta.',
        },
        {
          title: 'Scarica',
          description: 'Collega il .vtt al tuo lettore.',
        },
      ],
      advancedDetails: [
        'Le battute seguono la segmentazione di Whisper, in genere una frase o una proposizione per battuta, da 2 a 7 secondi.',
        'Traduci il risultato in altre lingue con il Traduttore di sottotitoli.',
        'Per una traccia di sottotitoli impressa nel video, usa la corsia sottotitoli di Darkroom.',
      ],
      whyItMatters: [
        'I sottotitoli sono necessari per l\'accessibilità e vengono letti dalla maggior parte degli spettatori, che guardano senza audio.',
        'VTT è l\'unico formato che i video HTML5 leggono in modo nativo.',
        'I sottotitoli temporizzati sono indicizzabili dai motori di ricerca.',
      ],
      useCases: [
        {
          title: 'Video HTML5',
          description: 'Collega il file con un elemento track.',
        },
        {
          title: 'Caricamento su YouTube',
          description: 'Carica il .vtt come traccia di sottotitoli.',
        },
        {
          title: 'Video di un corso',
          description: 'Sottotitoli per il lettore di una piattaforma LMS.',
        },
        {
          title: 'Traduci più tardi',
          description: 'VTT in ingresso, VTT tradotto in uscita.',
        },
      ],
      whyMediaManipulator: [
        'Whisper sul nostro hardware; nulla viene inviato a un\'IA di terze parti.',
        'Visualizzatore di sottotitoli per controllare i tempi prima del download.',
      ],
      privacyNote: 'Il parlato del tuo file viene trascritto da Whisper sul nostro server GPU e temporizzato in sottotitoli WebVTT. Il lavoro dell\'IA gira su hardware che gestiamo noi, mai presso un fornitore di IA di terze parti, e nulla di ciò che carichi viene usato per addestrare un modello. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      faq: [
        {
          question: 'VTT o SRT?',
          answer: 'VTT per i lettori web e YouTube; SRT per gli editor video e alcune piattaforme più vecchie. Sono offerti entrambi.',
        },
        {
          question: 'Posso modificare i sottotitoli?',
          answer: 'Scarica il .vtt e modificalo in qualsiasi editor di testo; il formato è testo semplice.',
        },
        {
          question: 'Posso tradurli?',
          answer: 'Sì, con lo strumento Traduttore di sottotitoli.',
        },
        {
          question: 'Il mio video viene inviato a terze parti?',
          answer: 'No. La trascrizione gira sul nostro server GPU.',
        },
        {
          question: 'Viene scalato dalla mia quota?',
          answer: 'Ogni file VTT è un lavoro IA, scalato dalla quota IA e mai da quella ordinaria. I lavori non riusciti non vengono conteggiati.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Ogni file di sottotitoli conta come un lavoro IA; i lavori non riusciti non vengono conteggiati.',
        ],
      },
      related: [
        {
          label: 'Generatore SRT',
          to: '/tools/srt-generator',
          description: 'Formato SubRip.',
        },
        {
          label: 'Trascrivi video',
          to: '/tools/transcribe-video',
          description: 'Testo semplice o JSON.',
        },
        {
          label: 'Traduttore di sottotitoli',
          to: '/tools/caption-translator',
          description: 'Traduci i sottotitoli.',
        },
        {
          label: 'Editor video Darkroom',
          to: '/tools/content-studio',
          description: 'Imprimi i sottotitoli nel video.',
        },
      ],
      embed: {
        title: 'Genera sottotitoli VTT',
        description: 'Carica un file video o audio. L\'output è preimpostato su WebVTT; la trascrizione viene temporizzata da Whisper sul nostro server GPU e restituita come file .vtt che puoi collegare con un elemento track o caricare su una piattaforma.',
      },
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
        'Capitoli che portano al punto giusto del tuo video, direttamente nel visualizzatore dei risultati.',
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
        'Capitoli che portano al punto giusto della tua registrazione, direttamente nel visualizzatore dei risultati.',
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
      h1: 'Clona la tua voce da una breve registrazione',
      tagline: 'Registra o carica da 5 a 60 secondi del tuo parlato, crea una voce e fagli leggere qualsiasi testo in più di venti lingue.',
      metaTitle: 'Clona la tua voce da una registrazione | Media Manipulator',
      metaDescription: 'Crea una voce da 5 a 60 secondi del tuo parlato e trasforma il testo in voce con essa in più di 20 lingue. Gira sui nostri server; gli output hanno una filigrana.',
      ogTitle: 'Clona la tua voce da una breve registrazione',
      ogDescription: 'Registra qualche frase, conferma che è la tua voce e genera il parlato con essa in più di 20 lingue. Modelli ospitati da noi, output con filigrana.',
      intro: 'La clonazione vocale crea una voce riutilizzabile da una breve registrazione del tuo parlato. Leggi qualche frase naturale al microfono, oppure carica una clip da 5 a 60 secondi, conferma che la voce è tua (o che hai il permesso esplicito della persona che parla) e crea la voce. Compare in Le mie voci con una breve anteprima. Da quel momento puoi digitare qualsiasi testo, scegliere una delle oltre venti lingue e un livello di emozione, e ottenere un MP3 e un WAV di quella voce che lo legge. Il modello gira su un server GPU che gestiamo noi, ogni file generato contiene una filigrana inudibile e nulla di ciò che registri viene usato per addestrare alcunché.',
      whatItDoes: [
        'Crea una voce salvata da 5 a 60 secondi di parlato registrato nel browser o caricato come file audio.',
        'Controlla che la registrazione sia abbastanza lunga e contenga davvero del parlato prima di conteggiare qualsiasi cosa.',
        'Legge qualsiasi testo con la voce salvata in più di 20 lingue, con un controllo dell\'emozione da calma a espressiva.',
        'Restituisce il parlato come MP3, con un download WAV creato nel tuo browser.',
        'Contrassegna ogni file generato con una filigrana inudibile, così il parlato sintetico può essere identificato.',
      ],
      flowSteps: [
        {
          title: 'Registra o carica',
          description: 'Da 5 a 60 secondi di parlato chiaro in una stanza silenziosa.',
        },
        {
          title: 'Conferma il consenso',
          description: 'Spunta la casella per confermare che la voce è tua o che hai il permesso di chi parla.',
        },
        {
          title: 'Crea la voce',
          description: 'Viene generata una breve anteprima e la voce viene salvata nel tuo account.',
        },
        {
          title: 'Genera il parlato',
          description: 'Digita un testo, scegli lingua ed emozione e scarica l\'audio.',
        },
      ],
      advancedDetails: [
        'Il motore vocale è Chatterbox Multilingual (licenza MIT), eseguito sul nostro server GPU. Clona dalla clip di riferimento nel momento in cui generi; nessun modello viene addestrato sulla tua voce.',
        'Creare una voce conta come un lavoro IA (l\'anteprima). Ogni generazione conta come un lavoro IA. Una richiesta che fallisce o viene rifiutata non viene conteggiata.',
        'La lunghezza del testo per richiesta dipende dal tuo piano, circa 18 caratteri per secondo di parlato; il contatore sotto la casella di testo mostra il tuo limite.',
        'Ogni file generato contiene la filigrana PerTh di Resemble AI, che è inudibile e resiste alle comuni operazioni di modifica e compressione.',
        'La prima richiesta dopo un periodo di inattività può richiedere fino a 20 secondi mentre il motore si carica.',
      ],
      whyItMatters: [
        'Narrazione con la tua voce, senza prenotare una sessione in studio per ogni modifica al copione.',
        'La stessa voce in un\'altra lingua, per un video o un corso che raggiunge più persone.',
        'Un motore ospitato da noi significa che le tue registrazioni restano con noi, non presso un fornitore di IA di terze parti.',
      ],
      useCases: [
        {
          title: 'Narrazione video',
          description: 'Rileggi una battuta modificata del copione senza registrarla di nuovo.',
        },
        {
          title: 'Corsi e tutorial',
          description: 'Dai voce alla stessa lezione in più lingue.',
        },
        {
          title: 'Accessibilità',
          description: 'Fai leggere ad alta voce testi lunghi con una voce familiare.',
        },
        {
          title: 'Prototipazione',
          description: 'Ascolta un copione letto prima di registrare la versione definitiva.',
        },
      ],
      whyMediaManipulator: [
        'Modelli aperti su hardware che gestiamo noi; le registrazioni non vanno mai a un servizio di IA esterno.',
        'Consenso esplicito prima della creazione di qualsiasi voce, registrato insieme alla voce.',
        'Output con filigrana e un pulsante di eliminazione tutto tuo per ogni voce salvata.',
      ],
      privacyNote: 'I 5-60 secondi di parlato che registri o carichi diventano una voce salvata nel tuo account; quella registrazione di riferimento è ciò che il modello legge ogni volta che la voce parla. Le registrazioni vocali e le voci salvate vengono elaborate sui nostri server; nulla viene inviato a un fornitore di IA di terze parti e nulla viene usato per addestrare alcun modello. Una voce salvata (la sua registrazione di riferimento e la sua anteprima) è conservata nel tuo account, segue il periodo di conservazione che scegli e può essere eliminata in qualsiasi momento da Account, Voci; viene eliminata insieme al tuo account. L\'audio generato viene conservato come qualsiasi altro risultato: i file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      faq: [
        {
          question: 'Posso clonare la voce di qualcun altro?',
          answer: 'Solo con il permesso esplicito di quella persona. Prima che una voce venga creata devi confermare che la voce è tua o che hai il permesso, e conserviamo quella conferma insieme alla voce. Impersonare qualcuno senza permesso, le frodi e i deepfake politici sono vietati dai nostri Termini.',
        },
        {
          question: 'Suonerà esattamente come me?',
          answer: 'Di solito suona riconoscibilmente come chi parla, ma non è una copia perfetta: accenti, voci insolite e registrazioni rumorose sono più difficili. Per il risultato migliore registra qualche frase naturale in una stanza silenziosa.',
        },
        {
          question: 'La mia registrazione viene usata per addestrare un modello di IA?',
          answer: 'No. Nulla di ciò che carichi o generi viene usato per addestrare alcun modello. La voce viene clonata dalla tua clip di riferimento ogni volta che generi del parlato.',
        },
        {
          question: 'Si può capire che l\'audio è generato?',
          answer: 'Ogni file generato con una voce salvata contiene una filigrana inudibile che gli strumenti di rilevamento possono leggere. Non cambia il suono dell\'audio.',
        },
        {
          question: 'Come elimino una voce?',
          answer: 'Apri Account, Voci ed eliminala. La sua registrazione di riferimento e la sua anteprima vengono rimosse; l\'audio che hai già generato resta nella tua cronologia fino al termine del suo periodo di conservazione.',
        },
        {
          question: 'Quante voci posso conservare?',
          answer: 'Dipende dal tuo piano; la pagina mostra quante ne hai salvate e il tuo limite.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Il riferimento deve durare da 5 a 60 secondi e contenere del parlato.',
          'Salvare una voce richiede un account; le voci predefinite funzionano senza.',
        ],
      },
      related: [
        {
          label: 'Progettista di voci',
          to: '/tools/voice-designer',
          description: 'Descrivi una nuova voce e conservala.',
        },
        {
          label: 'Cambia voce',
          to: '/tools/voice-changer',
          description: 'Varia una registrazione o convertila in una voce.',
        },
        {
          label: 'Pulisci l\'audio della voce',
          to: '/tools/clean-voice-audio',
          description: 'Ripulisci una registrazione prima di usarla.',
        },
        {
          label: 'Cambia l\'intonazione dell\'audio',
          to: '/tools/change-audio-pitch',
          description: 'Cambia la tonalità di musica o parlato.',
        },
      ],
      embed: {
        title: 'Crea una voce',
        description: 'Registra o carica una registrazione pulita da 5 a 60 secondi, conferma che la voce è tua o che hai il permesso di chi parla e crea la voce. Poi digita un testo e genera il parlato. Le voci predefinite funzionano senza account.',
      },
    },
    'voice-designer': {
      name: 'Progettista di voci',
      h1: 'Progetta una nuova voce a partire da una descrizione',
      tagline: 'Descrivi una voce a parole, ascolta un\'anteprima e conserva quella che ti piace per leggere qualsiasi testo in più di venti lingue.',
      metaTitle: 'Progetta una nuova voce da una descrizione | Media Manipulator',
      metaDescription: 'Descrivi la voce che vuoi, ad esempio calda, bassa e calma, ascoltala in anteprima gratis, conservala e genera il parlato con lei. Modelli sui nostri server; output con filigrana.',
      ogTitle: 'Progetta una nuova voce a partire da una descrizione',
      ogDescription: 'Descrivi una voce, ascolta anteprime gratuite, conserva quella che ti piace e genera il parlato con lei. Sui nostri server, con filigrana.',
      intro: 'Il progettista di voci crea una voce che non appartiene a nessuno. Descrivila in poche parole, ad esempio genere, età, accento, timbro e ritmo, oppure componi la descrizione con i chip, e ascolta in anteprima una frase di esempio. Le anteprime sono gratuite, tre per descrizione ogni ora. Quando senti quella che vuoi, dalle un nome e conservala: la voce esatta che hai ascoltato in anteprima viene salvata nel tuo account e da quel momento può leggere qualsiasi testo, in qualsiasi lingua dello strumento di sintesi vocale. La progettazione gira su Qwen3-TTS e il parlato su Chatterbox, entrambi sul nostro server GPU, e ogni file generato contiene una filigrana inudibile.',
      whatItDoes: [
        'Trasforma la descrizione testuale di una voce in un\'anteprima parlata.',
        'Conserva la voce esatta dell\'anteprima (lo stesso seed) quando la salvi.',
        'Legge qualsiasi testo con la voce conservata in più di 20 lingue.',
        'Restituisce un MP3 del parlato, con un download WAV creato nel tuo browser.',
      ],
      flowSteps: [
        {
          title: 'Descrivi',
          description: 'Scrivi o clicca le caratteristiche che vuoi.',
        },
        {
          title: 'Ascolta l\'anteprima',
          description: 'Tre anteprime gratuite per descrizione ogni ora.',
        },
        {
          title: 'Conservala',
          description: 'Dai un nome alla voce e salvala nel tuo account.',
        },
        {
          title: 'Genera il parlato',
          description: 'Digita qualsiasi testo e scarica l\'audio.',
        },
      ],
      advancedDetails: [
        'La progettazione usa Qwen3-TTS VoiceDesign (Apache 2.0). La frase di anteprima può essere resa in dieci lingue: cinese, inglese, giapponese, coreano, tedesco, francese, russo, portoghese, spagnolo e italiano.',
        'Una voce conservata viene salvata come descrizione, seed e clip di riferimento di 10 secondi; da quel momento la fa parlare Chatterbox, quindi suona uguale ovunque e in ogni lingua supportata.',
        'Le anteprime non vengono conteggiate. Conservare una voce conta come un lavoro IA, e ogni generazione conta come un lavoro IA.',
        'Le descrizioni funzionano meglio in inglese; i chip aggiungono caratteristiche in inglese.',
      ],
      whyItMatters: [
        'Una voce distintiva per un narratore o un personaggio senza ingaggiare un doppiatore per una bozza.',
        'Non è coinvolta la voce di nessuna persona reale, quindi non si prende in prestito l\'identità di nessuno.',
        'La voce conservata resta coerente in ogni copione e in ogni lingua.',
      ],
      useCases: [
        {
          title: 'Personaggi',
          description: 'Dai a ogni personaggio di una storia o del prototipo di un gioco una voce tutta sua.',
        },
        {
          title: 'Video esplicativi',
          description: 'Un narratore calmo e chiaro per video di prodotto e di formazione.',
        },
        {
          title: 'Audio provvisorio',
          description: 'Una voce fuori campo temporanea mentre il copione sta ancora cambiando.',
        },
        {
          title: 'Accessibilità',
          description: 'Una voce di lettura piacevole per i documenti lunghi.',
        },
      ],
      whyMediaManipulator: [
        'Modelli aperti sul nostro server GPU; nessun fornitore di IA di terze parti.',
        'Anteprime gratuite prima che qualcosa venga conteggiato.',
        'Output con filigrana e un pulsante di eliminazione per ogni voce conservata.',
      ],
      privacyNote: 'Al modello vocale viene inviata solo la descrizione testuale che scrivi; le anteprime che produce sono audio generato da noi, e quella che conservi viene salvata tramite il suo seed. Le registrazioni vocali e le voci salvate vengono elaborate sui nostri server; nulla viene inviato a un fornitore di IA di terze parti e nulla viene usato per addestrare alcun modello. Una voce salvata (la sua registrazione di riferimento e l\'anteprima) è conservata nel tuo account, segue il periodo di conservazione che scegli e può essere eliminata in qualsiasi momento da Account, Voci; viene eliminata insieme al tuo account. L\'audio generato viene conservato come qualsiasi altro risultato: i file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      faq: [
        {
          question: 'Una voce progettata è la voce reale di qualcuno?',
          answer: 'No. Viene generata dalla tua descrizione e da un seed casuale; non è modellata su nessuna persona in particolare.',
        },
        {
          question: 'Perché le anteprime si esauriscono?',
          answer: 'Ogni descrizione può essere ascoltata in anteprima tre volte all\'ora, così le anteprime gratuite restano disponibili per tutti. Cambia la descrizione per ottenere un\'altra anteprima, oppure conserva la voce che ti piace.',
        },
        {
          question: 'La voce conservata suonerà come l\'anteprima?',
          answer: 'Sì. Conservarla invia la stessa descrizione e lo stesso seed dell\'anteprima che hai ascoltato, e la voce viene salvata a partire da quel rendering.',
        },
        {
          question: 'Quali lingue può parlare?',
          answer: 'Una voce viene progettata in una di dieci lingue e, una volta conservata, può parlare tutte le lingue dello strumento di sintesi vocale, più di venti in totale.',
        },
        {
          question: 'L\'output è contrassegnato come generato?',
          answer: 'Sì. Ogni file generato contiene una filigrana inudibile che gli strumenti di rilevamento possono leggere.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Anteprime: 3 per descrizione ogni ora, non conteggiate.',
          'Per conservare una voce serve un account.',
        ],
      },
      related: [
        {
          label: 'Clonazione vocale',
          to: '/tools/voice-cloning',
          description: 'Crea una voce da una tua registrazione.',
        },
        {
          label: 'Cambia voce',
          to: '/tools/voice-changer',
          description: 'Varia una registrazione o convertila in una voce.',
        },
        {
          label: 'Pulisci l\'audio della voce',
          to: '/tools/clean-voice-audio',
          description: 'Ripulisci una registrazione prima di usarla.',
        },
        {
          label: 'Cambia l\'intonazione dell\'audio',
          to: '/tools/change-audio-pitch',
          description: 'Cambia la tonalità di musica o parlato.',
        },
      ],
      embed: {
        title: 'Descrivi una voce',
        description: 'Scrivi una breve descrizione o clicca i chip delle caratteristiche, ascolta la voce in anteprima (tre anteprime gratuite per descrizione ogni ora), poi conservala per generare il parlato. Per conservare una voce serve un account.',
      },
    },
    'voice-changer': {
      name: 'Cambia voce',
      h1: 'Cambia la voce in una registrazione',
      tagline: 'Varia subito tonalità e carattere di una registrazione, oppure converti il parlato in una voce salvata o predefinita con l\'IA.',
      metaTitle: 'Cambia voce: varia o converti una registrazione | Media Manipulator',
      metaDescription: 'Cambia la voce in una registrazione: varia subito tonalità e formante, oppure converti il parlato in una voce salvata o predefinita con l\'IA. Confronta prima e dopo.',
      ogTitle: 'Cambia la voce in una registrazione',
      ogDescription: 'Varia subito tonalità e formante, oppure converti il parlato in un\'altra voce con l\'IA, poi confronta prima e dopo.',
      intro: 'Cambia voce ha due modi per modificare una registrazione. Variazione è il classico cambio di tonalità e formante: sposta la tonalità fino a dodici semitoni in su o in giù, mantieni il carattere di chi parla oppure varialo insieme alla tonalità, o parti da un preset come Più grave, Più acuta, Infantile, Anziana o Telefono. È istantaneo, non richiede un account e non usa l\'IA. Converti usa la conversione vocale con IA per far suonare il parlato come una delle tue voci salvate o una voce predefinita, mantenendo parole, tempi e intonazione. In entrambi i casi puoi confrontare l\'originale e il risultato con un lettore A/B senza interruzioni prima di scaricare.',
      whatItDoes: [
        'Varia la tonalità fino a 12 semitoni in su o in giù, con la formante mantenuta o variata.',
        'Offre preset di variazione: più grave, più acuta, infantile, anziana e telefono.',
        'Converte il parlato in una voce salvata o in una voce predefinita con la conversione vocale IA.',
        'Riproduce l\'originale e il risultato in un confronto A/B sincronizzato.',
        'Restituisce un MP3, con un download WAV creato nel tuo browser.',
      ],
      flowSteps: [
        {
          title: 'Registra o carica',
          description: 'Parlato dal tuo microfono o da un file audio o video.',
        },
        {
          title: 'Scegli Variazione o Converti',
          description: 'Cambio di tonalità istantaneo, oppure conversione IA in un\'altra voce.',
        },
        {
          title: 'Confronta',
          description: 'Passa dall\'originale al risultato senza interruzioni.',
        },
        {
          title: 'Scarica',
          description: 'MP3, oppure un WAV creato nel tuo browser.',
        },
      ],
      advancedDetails: [
        'Variazione usa il pitch shifter rubberband tramite ffmpeg sul nostro server. «Mantieni il carattere della voce» preserva la formante; «Varia insieme alla tonalità» la sposta, e il risultato suona come una persona più piccola o più grande. Telefono applica anche un passa-banda da 300 a 3400 Hz.',
        'Variazione conta come una singola operazione e il suo output non ha filigrana. Converti conta come un lavoro IA e il suo output contiene una filigrana inudibile.',
        'Converti usa la conversione vocale Chatterbox sul nostro server GPU. La durata della registrazione che puoi convertire dipende dal tuo piano.',
        'Per convertire serve un account. Convertire nella voce di un\'altra persona richiede il permesso di quella persona, come per la clonazione.',
      ],
      whyItMatters: [
        'Camuffa una voce per un\'intervista anonima o una clip attenta alla privacy con una semplice variazione.',
        'Correggi una ripresa registrata con la voce sbagliata senza registrarla di nuovo.',
        'Senti subito la differenza con il lettore A/B invece di tirare a indovinare.',
      ],
      useCases: [
        {
          title: 'Audio anonimo',
          description: 'Varia una voce così che chi parla sia più difficile da riconoscere.',
        },
        {
          title: 'Voci di personaggi',
          description: 'Trasforma la tua lettura in una voce diversa per una storia.',
        },
        {
          title: 'Narrazione coerente',
          description: 'Converti la battuta di un ospite nella voce salvata del narratore.',
        },
        {
          title: 'Effetti',
          description: 'Un effetto telefono o infantile per la scena di un video.',
        },
      ],
      whyMediaManipulator: [
        'La variazione è gratuita e non richiede un account.',
        'La conversione IA gira sul nostro server GPU, non su un servizio di terze parti.',
        'Confronto A/B integrato tra l\'originale e il risultato.',
      ],
      privacyNote: 'La registrazione che carichi viene variata con rubberband oppure convertita in un\'altra voce da un modello di IA, a seconda della modalità che scegli. Le registrazioni vocali e le voci salvate vengono elaborate sui nostri server; nulla viene inviato a un fornitore di IA di terze parti e nulla viene usato per addestrare alcun modello. Una voce salvata (la sua registrazione di riferimento e l\'anteprima) è conservata nel tuo account, segue il periodo di conservazione che scegli e può essere eliminata in qualsiasi momento da Account, Voci; viene eliminata insieme al tuo account. L\'audio generato viene conservato come qualsiasi altro risultato: i file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      faq: [
        {
          question: 'Qual è la differenza tra Variazione e Converti?',
          answer: 'Variazione cambia tonalità e carattere della stessa voce con l\'elaborazione del segnale; è istantanea e gratuita. Converti usa l\'IA per far suonare il parlato come una voce diversa, una delle tue voci salvate o una predefinita.',
        },
        {
          question: 'La variazione aggiunge una filigrana?',
          answer: 'No. L\'audio variato è normale elaborazione del segnale e non ha filigrana. L\'audio convertito contiene una filigrana inudibile.',
        },
        {
          question: 'Posso convertire la mia voce in quella di una celebrità?',
          answer: 'No. Puoi convertire solo nelle tue voci salvate o nelle nostre voci predefinite, e usare la voce di una persona reale richiede il suo permesso esplicito. L\'impersonificazione senza permesso è vietata dai nostri Termini.',
        },
        {
          question: 'Quanto può durare la registrazione?',
          answer: 'Variazione accetta registrazioni fino al limite di durata del tuo piano. La conversione ha un proprio limite per piano, mostrato quando carichi.',
        },
        {
          question: 'Posso usare un file video?',
          answer: 'Sì. Viene usata la traccia audio e l\'immagine viene scartata.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Variazione: una singola operazione, nessun account necessario.',
          'Converti: un lavoro IA, account e piano richiesti.',
        ],
      },
      related: [
        {
          label: 'Clonazione vocale',
          to: '/tools/voice-cloning',
          description: 'Crea una voce da una tua registrazione.',
        },
        {
          label: 'Progettista di voci',
          to: '/tools/voice-designer',
          description: 'Descrivi una nuova voce e conservala.',
        },
        {
          label: 'Pulisci l\'audio della voce',
          to: '/tools/clean-voice-audio',
          description: 'Ripulisci una registrazione prima di usarla.',
        },
        {
          label: 'Cambia l\'intonazione dell\'audio',
          to: '/tools/change-audio-pitch',
          description: 'Cambia la tonalità di musica o parlato.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Ripulisci prima la registrazione.',
        },
      ],
      embed: {
        title: 'Cambia una voce',
        description: 'Registra o carica del parlato. Variazione cambia subito tonalità e formante, per tutti. Converti fa suonare la registrazione come una delle tue voci salvate o una voce predefinita, e richiede un account con un piano che la includa.',
      },
    },
    // MM84: name / tagline / metaTitle / metaDescription for the copy-bar tool pages (model-written, needs native review).
    'content-studio': {
      name: 'Darkroom',
      h1: 'Darkroom',
      tagline: 'Modifica, sovrapponi e mixa video e audio su una timeline multitraccia, poi esporta in MP4. Un editor in stile Premiere Pro, direttamente nel browser.',
      metaTitle: 'Darkroom: editor video multitraccia online gratuito | Media Manipulator',
      metaDescription: 'Modifica, sovrapponi e mixa video e audio su una timeline multitraccia, poi esporta in MP4: un editor video gratuito in stile Premiere Pro che funziona direttamente nel browser. Senza registrazione né installazione.',
      ogTitle: '🎬 Darkroom: editor video multitraccia gratuito nel tuo browser',
      ogDescription: 'Monta, sovrapponi e mixa video e audio su una timeline multitraccia, aggiungi titoli, transizioni e colore, poi esporta in MP4. Un editor in stile Premiere Pro, direttamente nel browser, senza registrazione, completamente gratuito. Vieni a provarlo! 🎬',
      intro: 'Darkroom è un editor video multitraccia che gira in una scheda del browser. Crei un progetto con una tela e un frame rate, trascini file video, immagine e audio in un contenitore multimediale, li disponi su tracce sovrapposte, li tagli e li dividi ai confini dei fotogrammi, li correggi nel colore e applichi il chroma key, aggiungi titoli, transizioni e sottotitoli, mixi l\'audio con un mixer per traccia e poi consegni la timeline finita al nostro server di rendering, dove ffmpeg costruisce l\'intero montaggio come un unico grafo di filtri e lo codifica in H.264 o HEVC dentro un MP4, oppure in MP3 o WAV quando il progetto è solo audio. L\'anteprima su cui lavori viene composta dal vivo sulla tua GPU in WebGL2; l\'esportazione viene verificata rispetto a quell\'anteprima, così quello che hai visto è quello che ottieni.',
      whatItDoes: [
        'Esegue una timeline multitraccia precisa al fotogramma: taglio, divisione, eliminazione con ripple, lametta, slip, slide, roll e ripple, marcatori, gruppi, blocco, solo e nascondi per traccia, e separazione dell\'audio dal video.',
        'Compone le tracce in ordine di sovrapposizione con ritaglio, adattamento, trasformazione, una correzione colore in stile Lumetri (esposizione, contrasto, saturazione, temperatura, tinta, vividezza), LUT 3D, chroma key con contagocce, opacità e otto metodi di fusione.',
        'Anima posizione, scala, rotazione, opacità, volume, pan e parametri degli effetti con fotogrammi chiave e cinque curve di easing; aggiunge quindici transizioni e clip di titolo costruite con livelli di testo e di forma.',
        'Mixa l\'audio con fader per traccia, pan, equalizzatore a tre bande e compressore con misuratori dal vivo, più ducking e preset di loudness per streaming, podcast e broadcast sul bus master.',
        'Genera i sottotitoli con Whisper sulla nostra GPU, ti permette di modificarli in una corsia dedicata e li esporta impressi nell\'immagine oppure come file SRT o VTT separato.',
        'Esporta MP4 H.264 o HEVC con audio AAC, oppure MP3 o WAV, alla dimensione della tela o scalati a 720, 1080, 1440 o 2160 righe, e mantiene un pannello delle esportazioni con avanzamento e nuovo rendering.',
      ],
      flowSteps: [
        {
          title: 'Crea un progetto',
          description: 'Scegli una tela (16:9 a 1920 x 1080, 9:16 a 1080 x 1920, 1:1, 4:5 o una dimensione personalizzata) e un frame rate di 24, 30 o 60.',
        },
        {
          title: 'Importa i media',
          description: 'Carica video, immagini e audio nel contenitore multimediale. Il server genera un proxy di anteprima con un fotogramma chiave ogni secondo, così lo scorrimento resta leggero.',
        },
        {
          title: 'Taglia e sovrapponi',
          description: 'Posiziona le clip sulle tracce, taglia e dividi al cursore, impila sovrapposizioni e titoli sopra il filmato di base e tieni le immagini fisse per la durata che vuoi.',
        },
        {
          title: 'Correggi, applica il chroma key e mixa',
          description: 'Regola il colore, applica una LUT, elimina uno sfondo con il chroma key, imposta fotogrammi chiave su ciò che deve muoversi e bilancia le tracce audio sul mixer.',
        },
        {
          title: 'Esporta',
          description: 'Scegli formato, qualità, altezza di output, modalità dei sottotitoli e preset di loudness. ffmpeg esegue il rendering della timeline sul nostro server e il file compare nel pannello delle esportazioni.',
        },
      ],
      advancedDetails: [
        'L\'esportazione è una sola invocazione di ffmpeg: ogni sorgente è un input, la timeline diventa un grafo filter_complex (trim, scale, overlay, drawtext per i titoli, eq e filtri colore, amix con normalize=0 per l\'audio) e l\'output viene codificato in un unico passaggio. I parametri con fotogrammi chiave viaggiano in un file sendcmd affiancato al grafo, che richiede ffmpeg 4.4 o più recente sull\'host di rendering.',
        'H.264 usa l\'encoder hardware h264_nvenc quando una codifica di prova riesce sulla GPU di rendering, altrimenti libx264. I preset di qualità corrispondono al preset NVENC p4 a qualità costante 23 (Media), p5 a CQ 19 (Alta) e p4 a CQ 28 (Bassa); su libx264 sono preset medium CRF 23, slow CRF 18 e veryfast CRF 28. Entrambi fissano yuv420p.',
        'HEVC usa hevc_nvenc o libx265 a valori CQ o CRF più alti di cinque punti (28, 24, 33 su NVENC; 28, 24, 32 su libx265), che è lo scarto abituale per una qualità percepita equivalente, e marca il flusso come hvc1 così l\'MP4 si riproduce in Safari e QuickTime. Se nessuno dei due encoder è disponibile, l\'esportazione fallisce in modo esplicito invece di restituire un H.264 sotto il nome di HEVC.',
        'L\'audio viene ricampionato a 48 kHz stereo dentro il grafo e codificato in AAC a 192 kb/s per le esportazioni video; le esportazioni MP3 usano libmp3lame a 192 kb/s e le esportazioni WAV sono PCM a 16 bit. I preset di loudness sono loudnorm di ffmpeg: streaming I=-14 LUFS TP=-1.5 LRA=11, podcast I=-16 TP=-1.5 LRA=11, broadcast I=-23 TP=-2 LRA=7.',
        'Scegliere un\'altezza di output scala il fotogramma composto come ultimo filtro (lanczos, pixel quadrati, larghezza arrotondata a un numero pari), dopo che i sottotitoli sono stati impressi, così il testo viene scalato insieme all\'immagine invece di essere ridisegnato. Un\'altezza che il tuo piano non può renderizzare viene rifiutata con un errore, mai declassata in silenzio.',
        'I file MP4 vengono scritti con -movflags +faststart, così l\'indice sta all\'inizio e il file comincia a riprodursi prima di essere stato scaricato del tutto. Le immagini fisse sulla timeline diventano input con -loop 1 -framerate <project fps> -t <hold>, quindi una foto tenuta ferma non costa più da decodificare dei suoi fotogrammi.',
      ],
      whyItMatters: [
        'Uno strumento di conversione cambia un file. Un montaggio ne combina diversi: il B-roll sotto l\'intervista, il titolo sull\'apertura, il letto musicale sotto entrambi, ciascuno tagliato al fotogramma.',
        'Negli editor nel browser anteprima ed esportazione di solito divergono. Darkroom esegue il rendering dell\'anteprima sulla tua GPU e dell\'esportazione sulla nostra, e tiene le due entro una tolleranza documentata con un sistema di confronto a immagini di riferimento.',
        'Il lavoro pesante resta fuori dal tuo portatile. Un\'esportazione 4K, una trascrizione con Whisper o un composito multilivello con LUT girano su un server di rendering con GPU, così anche un notebook leggero porta a termine il lavoro.',
      ],
      useCases: [
        {
          title: 'Clip verticali per le piattaforme di contenuti brevi',
          description: 'Una tela 1080 x 1920, uno zoom sull\'oratore, una scheda titolo, musica abbassata sotto la voce e sottotitoli impressi.',
        },
        {
          title: 'Tutorial e registrazioni dello schermo',
          description: 'Taglia le pause, unisci le riprese, sovrapponi la webcam in picture-in-picture, aggiungi richiami ed esporta a 1080p con un file di sottotitoli separato.',
        },
        {
          title: 'Interviste ed episodi di podcast',
          description: 'Due inquadrature montate seguendo chi parla, un mix normalizzato nel loudness e un\'esportazione MP3 della stessa timeline per il feed audio.',
        },
        {
          title: 'Promo e video di prodotto',
          description: 'Filmato in chroma key su uno sfondo, una LUT per il look, movimenti del logo con fotogrammi chiave e un taglio di 15 secondi a 4K per lo schermo a parete.',
        },
      ],
      workedExamples: [
        {
          title: 'Un montaggio di 90 secondi a 1080p30 con il preset Media',
          body: 'Due clip 1080p, una traccia musicale e una scheda titolo su una tela 1920 x 1080 a 30 fps, esportati in H.264 con il preset Media. Sul server di rendering con NVENC funzionante questo è h264_nvenc preset p4 a qualità costante 23 con yuv420p; senza, libx264 preset medium CRF 23. Il mix audio viene codificato in AAC a 192 kb/s, che per 90 secondi fa 192.000 x 90 / 8, circa 2,2 MB di audio indipendentemente dal contenuto. La parte video punta a una qualità e non a un bitrate, quindi la sua dimensione segue il filmato: un busto parlante statico a CQ 23 si codifica piccolo, una ripresa a mano in movimento si codifica grande. Il tempo di rendering cresce con la lunghezza della timeline e con il numero di clip visibili contemporaneamente, perché ogni fotogramma di ogni clip visibile viene decodificato e composto prima che l\'encoder lo veda.',
        },
        {
          title: 'Un podcast di 20 minuti esportato come MP3 e come WAV',
          body: 'Un progetto solo audio (due tracce vocali, un jingle di apertura, preset di loudness podcast) salta del tutto il grafo video. Esportato come MP3 il file è libmp3lame a 192 kb/s costanti: 192.000 x 1.200 / 8 = 28,8 MB, quindi circa 29 MB. Esportato come WAV è PCM a 16 bit ai 48 kHz stereo del grafo: 48.000 x 2 canali x 2 byte = 192.000 byte al secondo, 230 MB per 20 minuti. La fase loudnorm punta a -16 LUFS integrati con un tetto di -1,5 dBTP e 11 LU di intervallo di loudness. Senza fotogrammi da comporre, il lavoro è limitato dalla decodifica delle sorgenti e dai filtri audio, quindi finisce ben prima della durata dell\'episodio.',
        },
      ],
      whenNotToUse: 'Darkroom è lo strumento sbagliato per un lavoro a un solo passaggio. Se ti serve solo tagliare l\'inizio e la fine di una clip, cambiarne il formato o ridurla, le pagine dedicate per tagliare e comprimere i video lo fanno con un solo caricamento e senza progetto. Non è nemmeno il posto per filmati che non puoi caricare: ogni sorgente viene inviata al nostro server per i proxy e il rendering, quindi il materiale che non deve mai lasciare la tua macchina va in un editor desktop. I progetti in una sessione ospite sono limitati a uno e durano 24 ore; accedi prima di iniziare qualcosa a cui vorrai tornare la settimana prossima.',
      whyMediaManipulator: [
        'Veri strumenti di montaggio: lametta, slip, slide, roll, ripple, marcatori, gruppi, fotogrammi chiave con easing, un mixer con equalizzatore e compressione, non un taglierino con un campo per il titolo.',
        'Esportazioni oneste: la codifica hardware o software viene scelta da una prova dal vivo, HEVC rifiuta invece di mentire, e una risoluzione che il tuo piano non può renderizzare è un errore, non un declassamento silenzioso.',
        'Un account, un unico posto: trascrivi, comprimi o rimuovi i metadati dagli stessi file che monti, e genera voce fuori campo o sottotitoli sullo stesso server GPU.',
      ],
      privacyNote: 'Darkroom conserva i tuoi media sui nostri server finché il progetto esiste: i caricamenti finiscono nel contenitore multimediale come risorse, il server ne genera proxy di anteprima, filmstrip e picchi della forma d\'onda, e le esportazioni vengono costruite da ffmpeg in outputs/<jobId>/ sull\'host di rendering. Quando richiedi i sottotitoli, l\'audio viene inviato a Whisper sulla nostra GPU e le battute risultanti vengono salvate con il progetto. Il documento del progetto, le sue risorse, le versioni e le esportazioni possono essere eliminati dall\'editor o dalla pagina del tuo Account. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Video e audio caricati passano anche attraverso una fase di analisi automatica sul nostro server. Nulla viene inviato a un fornitore di IA di terze parti e nessun file viene usato per addestrare alcunché.',
      faq: [
        {
          question: 'Darkroom è gratuito?',
          answer: 'Sì. Senza un account puoi tenere un progetto e fare il rendering di 5 esportazioni al giorno, con caricamenti fino a 200 MB per file e output fino a 1080 righe. Un account gratuito porta il limite a 5 progetti, 30 esportazioni al giorno, file da 1 GB e 1440 righe; Premium offre progetti illimitati, 300 esportazioni al giorno, file da 5 GB e output a 2160 righe; Pro porta le esportazioni a 700 al giorno. Le esportazioni hanno un proprio contatore giornaliero e non consumano la quota generale di operazioni. Questi sono i valori predefiniti; la pagina dei prezzi mostra i numeri aggiornati.',
        },
        {
          question: 'Cosa posso esportare?',
          answer: 'MP4 con video H.264 o HEVC e audio AAC, oppure MP3 o WAV per i progetti solo audio. Il video può uscire alla dimensione della tela o scalato a 720, 1080, 1440 o 2160 righe, con i sottotitoli impressi, come file SRT o VTT separato, oppure omessi, e con un preset di loudness streaming, podcast o broadcast sul mix.',
        },
        {
          question: 'Quale preset di qualità dovrei scegliere?',
          answer: 'Media è CRF 23 su libx264 o qualità costante 23 su NVENC ed è il valore predefinito ragionevole per caricare su una piattaforma che comunque ricodifica. Alta (CRF 18 o CQ 19, preset slow o p5) è per un master che modificherai di nuovo o mostrerai su un grande schermo. Bassa (CRF 28 o CQ 28, veryfast o p4) è per un\'anteprima veloce da inviare a un collega.',
        },
        {
          question: 'Perché la mia esportazione HEVC è fallita?',
          answer: 'HEVC richiede hevc_nvenc sulla GPU di rendering oppure libx265 nella build di ffmpeg. Se il server non ha nessuno dei due, l\'esportazione fallisce con un messaggio di encoder non supportato invece di restituire un file H.264 etichettato come HEVC. Passa il formato a H.264 e la stessa timeline verrà renderizzata.',
        },
        {
          question: 'Come vengono creati i sottotitoli?',
          answer: 'Genera sottotitoli invia l\'audio della timeline a Whisper sul nostro server GPU. I segmenti tornano come battute che puoi modificare nella corsia dei sottotitoli, poi esportare impresse nell\'immagine (una traccia di sottotitoli ASS renderizzata nei fotogrammi) oppure come file SRT o VTT accanto al video. Generare i sottotitoli conta come un lavoro IA, dalla quota IA.',
        },
        {
          question: 'L\'esportazione corrisponde all\'anteprima?',
          answer: 'È proprio lo scopo del progetto. L\'anteprima compone in WebGL2 nello stesso ordine usato dal grafo di filtri del server (ritaglio, adattamento, trasformazione, correzione colore, LUT, chroma key, opacità, fusione), e un sistema di confronto a immagini di riferimento paragona i fotogrammi di entrambi entro una tolleranza documentata. Solo e nascondi si applicano all\'esportazione esattamente come all\'anteprima.',
        },
        {
          question: 'Posso tornare a un progetto più tardi?',
          answer: 'Sì. I progetti vengono salvati con numeri di revisione, così una scheda non aggiornata non può sovrascrivere lavoro più recente, e la cronologia delle versioni conserva punti di controllo a cui puoi tornare. Una bozza viene conservata anche nel tuo browser per il ripristino in caso di crash. Gli utenti che hanno effettuato l\'accesso possono aprire i progetti recenti da qualsiasi dispositivo; i progetti ospite restano legati alla sessione del browser e alla finestra di conservazione di 24 ore.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'I file sorgente ed esportati vengono elaborati sui nostri server. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
        ],
        processingNotes: [
          'L\'anteprima viene composta nel browser; l\'esportazione finale viene codificata sul server in MP4 H.264 o HEVC, oppure in audio MP3 o WAV.',
        ],
      },
      related: [
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci ulteriormente un\'esportazione per l\'e-mail o una connessione lenta.',
        },
        {
          label: 'Trascrivi video',
          to: '/tools/transcribe-video',
          description: 'Ottieni la trascrizione completa di un montaggio finito, non solo i sottotitoli.',
        },
        {
          label: 'Estrai l\'audio da un video',
          to: '/tools/extract-audio-from-video',
          description: 'Estrai la colonna sonora da una clip prima di portarla nella timeline.',
        },
        {
          label: 'Taglia video',
          to: '/tools/video-trimmer',
          description: 'Quando ti basta un solo taglio.',
        },
        {
          label: 'Motion',
          to: '/tools/motion',
          description: 'Anima un logo o un sottopancia come SVG, poi esporta una GIF per la timeline.',
        },
        {
          label: 'Tutorial di Darkroom',
          to: '/tutorials/content-studio',
          description: 'Costruisci un montaggio dal progetto vuoto all\'MP4 esportato, passo dopo passo.',
        },
      ],
      embed: {
        title: 'Monta un video',
        description: 'Crea un nuovo progetto (o riaprine uno recente), trascina file video, immagine e audio nel contenitore multimediale, poi rilasciali sulla timeline multitraccia. Taglia, dividi e disponi le clip, sovrapponi overlay e titoli, mixa l\'audio ed esporta un MP4 finito, tutto nel tuo browser.',
      },
    },
    'remove-exif-metadata': {
      name: 'Rimuovi i metadati EXIF dalle immagini',
      h1: 'Rimuovi i metadati EXIF dalle immagini online',
      tagline: 'Elimina posizione GPS, dati del dispositivo, della fotocamera e dell\'orario dalle foto prima di condividerle ovunque.',
      metaTitle: 'Rimuovi i metadati EXIF dalle immagini online (gratis) | Media Manipulator',
      metaDescription: 'Strumento online gratuito per rimuovere metadati EXIF, GPS, IPTC e della fotocamera da immagini JPG, PNG, WebP e HEIC. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Rimuovi i metadati EXIF dalle immagini online',
      ogDescription: 'Elimina posizione GPS, fotocamera e metadati di data e ora dalle immagini prima di condividerle pubblicamente.',
      intro: 'Una foto porta dentro di sé un secondo documento. Accanto ai pixel, un telefono o una fotocamera scrive marca e modello del dispositivo, spesso il suo numero di serie, l\'obiettivo, l\'esposizione, il secondo esatto in cui è scattato l\'otturatore, il software che ha salvato il file per ultimo, una piccola miniatura di anteprima e, quando i servizi di localizzazione erano attivi, latitudine, longitudine e altitudine del punto in cui ti trovavi. Questo strumento legge tutto questo da un JPG, PNG, WebP o HEIC, ti mostra ogni tag raggruppato per ciò che rivela e poi rimuove tutto con un singolo passaggio di ExifTool, così la copia che condividi porta con sé solo l\'immagine.',
      whatItDoes: [
        'Ispeziona il caricamento con ExifTool ed elenca ogni tag trovato, raggruppato in categorie (fotocamera, obiettivo, GPS, data e ora, XMP, IPTC, miniatura, colore, maker notes e altro) con i tag di posizione, identità, dispositivo e cronologia segnalati.',
        'Rimuove i blocchi EXIF (IFD0 ed ExifIFD: marca, modello, numero di serie del corpo macchina, modello dell\'obiettivo, esposizione, ISO, lunghezza focale, date di scatto e di modifica) e la GPS IFD (latitudine, longitudine, altitudine, i loro tag di riferimento, timestamp GPS).',
        'Rimuove la miniatura di anteprima incorporata IFD1, che è una piccola copia separata dell\'immagine e sopravvive al ritaglio in molti editor.',
        'Rimuove i pacchetti XMP (strumento di creazione, cronologia delle modifiche, parole chiave, valutazioni), i record IPTC (autore, copyright, didascalia), i blocchi di risorse Photoshop, le maker notes dei produttori e il profilo colore ICC.',
        'Applica prima l\'orientamento EXIF ai pixel, così una foto da telefono che si affidava al tag di rotazione non esce di traverso una volta rimosso il tag.',
        'Conta ciò che è stato rimosso confrontando i report prima e dopo e mostra il numero, con una nota quando tra i tag c\'erano quelli di posizione.',
      ],
      flowSteps: [
        {
          title: 'Carica la foto',
          description: 'Trascina un JPG, PNG, WebP o HEIC. Il server esegue ExifTool due volte (un passaggio leggibile e uno numerico per i valori GPS e di esposizione) e restituisce il report.',
        },
        {
          title: 'Leggi il report',
          description: 'I tag sono raggruppati per categoria; le coordinate GPS vengono tracciate su una mappa, così vedi esattamente cosa rivela il file.',
        },
        {
          title: 'Rimuovi tutto',
          description: 'Un clic salva di nuovo l\'immagine con ImageMagick ed esegue exiftool -all= sul risultato.',
        },
        {
          title: 'Confronta e scarica',
          description: 'La schermata del risultato riporta quanti tag sono stati rimossi, offre un confronto affiancato dei due report e ti consegna il file pulito.',
        },
      ],
      advancedDetails: [
        'Il passaggio sui pixel è ImageMagick: convert <input> -auto-orient -quality 85 <output>, con il contenitore di output uguale a quello di input per JPG, PNG, WebP, GIF e AVIF. HEIC, TIFF e BMP non hanno un percorso con lo stesso contenitore in questa pagina e tornano come JPG.',
        'Il passaggio sui metadati è exiftool -overwrite_original -all= sul file convertito. -all= rimuove ogni gruppo scrivibile in un colpo solo: EXIF (IFD0, ExifIFD, GPS, InteropIFD), la miniatura IFD1, XMP, IPTC, Photoshop IRB, ICC_Profile, maker notes e qualsiasi segmento APP che ExifTool sa scrivere. I segmenti JFIF e Adobe APP14 di cui un decoder JPEG ha bisogno restano al loro posto; descrivono la disposizione dei pixel, non te.',
        'Poiché l\'immagine viene ricodificata, un JPG viene riscritto a qualità 85 e un PNG viene riscritto senza perdita. La rimozione non è una copia byte per byte con i metadati tagliati via.',
        'I report prima e dopo sono lo stesso MetadataDocument costruito dall\'ispettore: voci con chiave di gruppo come GPS:GPSLatitude o XMP-xmpMM:History, ciascuna classificata da un catalogo di circa 1.800 tag in 22 categorie e quattro classi di privacy (posizione, identità, dispositivo, cronologia).',
        'Il conteggio dei rimossi esclude le righe che cambiano a ogni conversione (nome del file, dimensione, data di modifica, tipo MIME, dimensioni dell\'immagine), così riflette i metadati effettivamente eliminati e non la contabilità.',
        'Anche i contenitori video e audio possono essere ripuliti, dai convertitori video e audio: ffmpeg viene eseguito con -map_metadata -1 -map_chapters -1, e per MP4, MOV, M4A e M4V segue un passaggio exiftool -all= perché ffmpeg lascia indietro le chiavi QuickTime e l\'XMP.',
      ],
      whyItMatters: [
        'I tag GPS corrispondono a un indirizzo. La foto di un divano in vendita, pubblicata da casa, può dire a uno sconosciuto dove si trova il divano.',
        'I tag del dispositivo e del numero di serie collegano le foto tra loro e a te. Due immagini con lo stesso BodySerialNumber sono state scattate con la stessa fotocamera, qualunque sia l\'account che le ha pubblicate.',
        'La miniatura IFD1 è una copia del fotogramma originale. Ritaglia un volto o un documento dall\'immagine e l\'anteprima potrebbe mostrarlo ancora.',
        'Molti siti rimuovono gli EXIF al caricamento e molti no. App di messaggistica, allegati e-mail, condivisioni cloud e marketplace spesso lasciano passare il file intatto.',
      ],
      useCases: [
        {
          title: 'Annunci su marketplace e siti di vendita',
          description: 'Rimuovi posizione e ora dello scatto dalle foto dei prodotti fatte a casa prima che le vedano gli acquirenti.',
        },
        {
          title: 'Foto di documenti',
          description: 'Lo scatto di un modulo o di una lettera registra anche quando e dove è stato fotografato; rimuovilo prima di inviarlo.',
        },
        {
          title: 'Pubblicare da un luogo sensibile',
          description: 'Elimina identificativi del dispositivo e coordinate da un\'immagine prima che esca dal tuo controllo, e verifica con il confronto che siano spariti.',
        },
        {
          title: 'Pulire un\'immagine modificata',
          description: 'Gli editor aggiungono la cronologia XMP e conservano la miniatura originale; rimuovi entrambi così il file mostra solo ciò che intendevi.',
        },
      ],
      workedExamples: [
        {
          title: 'Un JPEG da iPhone da 12 megapixel con GPS',
          body: 'Un JPEG 4032 x 3024 appena uscito da un iPhone 15 Pro porta, in un caso tipico, 5 tag IFD0 (marca, modello, orientamento, software, data di modifica), 7 tag ExifIFD tra cui numero di serie del corpo macchina e modello dell\'obiettivo, 5 tag GPS, 4 voci XMP tra cui la cronologia delle modifiche, 2 voci del profilo ICC, le 3 voci della miniatura IFD1 (circa 5 KB di JPEG di anteprima) e una GPSPosition derivata. La schermata del risultato riporta 27 tag rimossi, inclusa la posizione: quei 27 sono ogni voce tranne le righe di nome, dimensione, data e tipo del file e le dimensioni dell\'immagine, che esistono in qualsiasi file. L\'output è un JPG ricodificato a qualità 85 con l\'orientamento applicato ai pixel; la ricodifica decide la dimensione finale. Il lavoro è una singola decodifica e codifica di ImageMagick più una riscrittura di ExifTool, quindi finisce in pochi secondi e il tempo va nei pixel, non nei tag.',
        },
        {
          title: 'Un HEIC da un telefono recente',
          body: 'HEIC non ha un percorso con lo stesso contenitore in questa pagina, quindi un HEIC da 12 megapixel viene decodificato da ImageMagick e scritto come JPG a qualità 85, poi ripulito con exiftool -all=. Perdi il contenitore HEIC e il suo profilo colore e ottieni un file che ogni browser e marketplace accetta. Aspettati un file più grande dell\'HEIC che hai caricato, perché la ricodifica JPEG a qualità 85 è l\'unica compressione applicata e decide la dimensione. Il report elenca le maker notes Apple e il blocco GPS prima, e nient\'altro che le righe di file e dimensioni dell\'immagine dopo. La decodifica HEIC è la parte lenta; resta comunque una questione di secondi per una foto.',
        },
      ],
      whenNotToUse: 'Non ripulire una foto che devi ancora modificare o di cui devi dimostrare la provenienza. I file RAW delle fotocamere non vengono accettati qui e comunque non andrebbero ripuliti con -all=, perché le loro maker notes contengono dati di cui il convertitore RAW ha bisogno. Se vuoi conservare una nota di copyright o un titolo eliminando i tag GPS e del dispositivo, usa invece la modalità Metadati personalizzati del convertitore di immagini, che rimuove tutto e riscrive solo i campi che compili. E ricorda che rimuovere i metadati non rimuove ciò che è visibile nell\'immagine: un cartello stradale, un riflesso o un volto dicono comunque dove eri; gli strumenti per sfocare i volti e oscurare il testo si occupano di quello.',
      whyMediaManipulator: [
        'Vedi le prove. L\'ispettore elenca ogni tag prima della rimozione e un confronto dimostra cosa è sparito dopo, invece di una spunta verde e una promessa.',
        'Un passaggio, ogni gruppo. ExifTool -all= rimuove insieme EXIF, GPS, XMP, IPTC, Photoshop, ICC, maker notes e miniatura di anteprima; nulla va spuntato un blocco alla volta.',
        'L\'orientamento è gestito. Il tag di rotazione viene applicato ai pixel prima di essere rimosso, così una foto da telefono ripulita non finisce di traverso altrove, cosa che di solito succede quando il tag viene eliminato senza ruotare i pixel.',
      ],
      privacyNote: 'Questo strumento rimuove, dalla copia che restituisce, i blocchi EXIF (marca, modello, numero di serie, obiettivo, esposizione, date della fotocamera), il blocco GPS, la miniatura di anteprima IFD1, i record XMP e IPTC, le risorse Photoshop, le maker notes e il profilo ICC. Per farlo il server deve prima leggerli: il caricamento viene ispezionato con ExifTool e il report viene scritto nella cartella del lavoro come metadata.json, e dopo la rimozione un secondo report del risultato viene conservato accanto, così la vista Confronta può mostrare la differenza. Entrambi i report ed entrambi i file vivono in uploads/<jobId>/ e outputs/<jobId>/ e vengono eliminati insieme quando termina la finestra di conservazione. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'ispettore autonomo (che legge un file senza convertirlo) rimuove la sua copia temporanea appena il report è prodotto. Le immagini passano anche attraverso una fase di analisi automatica sul nostro server; nulla viene inviato a terze parti.',
      faq: [
        {
          question: 'Quali gruppi di metadati vengono rimossi esattamente?',
          answer: 'Tutto ciò che ExifTool può scrivere: EXIF (IFD0, ExifIFD, InteropIFD), la GPS IFD, la miniatura IFD1, XMP in tutti i suoi namespace (xmp, dc, xmpMM, photoshop e così via), i record IPTC IIM, i blocchi di risorse Photoshop, le maker notes di Apple, Canon, Nikon, Sony e altri produttori, e il profilo colore ICC. Per i PNG questo include i chunk tEXt, iTXt, zTXt, eXIf e iCCP; per i WebP i chunk EXIF, XMP e ICCP.',
        },
        {
          question: 'L\'immagine viene ricodificata?',
          answer: 'Sì. Il file passa attraverso ImageMagick (che applica anche il tag di orientamento ai pixel) prima che ExifTool rimuova i tag. Un JPG viene riscritto a qualità 85, un PNG viene riscritto senza perdita, un WebP a qualità 85. Visivamente la ricodifica del JPG è difficile da distinguere dall\'originale alle dimensioni di visualizzazione normali, ma non è il bitstream identico.',
        },
        {
          question: 'Perché il mio HEIC è tornato come JPG?',
          answer: 'La rimozione con un clic conserva il contenitore per JPG, PNG, WebP, GIF e AVIF. HEIC, TIFF e BMP vengono decodificati e scritti come JPG, così il risultato si apre ovunque. Se ti serve di nuovo un HEIC, convertilo nel convertitore di immagini con i metadati impostati su Rimuovi tutti i metadati.',
        },
        {
          question: 'Il profilo colore viene rimosso, e ha importanza?',
          answer: 'Sì, exiftool -all= rimuove il profilo ICC. Per una foto sRGB standard non cambia nulla, perché i visualizzatori presumono sRGB quando non c\'è un profilo. Per una foto Display P3 ad ampio gamut da un telefono recente, i colori possono sembrare leggermente meno saturi nei software che rispettano i profili. Se per te conta, usa la modalità Metadati personalizzati del convertitore di immagini e conserva lì il profilo.',
        },
        {
          question: 'Posso conservare una riga di copyright o un titolo?',
          answer: 'Non con la rimozione con un clic, che elimina tutto. La sezione metadati del convertitore di immagini ha una modalità Personalizzata che ripulisce il file e poi riscrive solo ciò che digiti: titolo, autore, descrizione, copyright, commento, parole chiave e i campi EXIF o GPS scelti. Usala quando vuoi un file pulito che però porti ancora il tuo nome.',
        },
        {
          question: 'Come so che ha funzionato?',
          answer: 'La schermata del risultato indica il numero di tag rimossi e segnala quando tra questi c\'erano dati di posizione. Apri Confronta per il prima e dopo completo: è lo stesso report di ExifTool eseguito sul file di output, quindi una riga GPS o del numero di serie sopravvissuta comparirebbe lì.',
        },
        {
          question: 'È gratuito, e quante foto posso ripulire?',
          answer: 'Sì. Ogni rimozione è un caricamento attraverso il convertitore standard, quindi conta nella quota giornaliera di operazioni: per impostazione predefinita 5 al giorno senza account e fino a 200 MB per file, 30 al giorno con un account gratuito e file fino a 1 GB, 300 con Premium e 700 con Pro. Un lavoro che fallisce restituisce la sua unità. I numeri aggiornati sono nella pagina dei prezzi.',
        },
      ],
      related: [
        {
          label: 'Sfoca i volti in una foto',
          to: '/tools/blur-faces-in-photo',
          description: 'I metadati sono solo metà della storia; nascondi i volti che l\'immagine stessa mostra.',
        },
        {
          label: 'Oscura il testo in un\'immagine',
          to: '/tools/redact-text-in-image',
          description: 'Copri nomi, indirizzi e numeri stampati nell\'immagine.',
        },
        {
          label: 'Comprimi immagine',
          to: '/tools/compress-image',
          description: 'Riduci la foto ripulita prima di pubblicarla.',
        },
        {
          label: 'Da immagine a PDF',
          to: '/tools/image-to-pdf',
          description: 'Raccogli le foto di documenti ripulite in un unico PDF.',
        },
        {
          label: 'Informativa sulla privacy',
          to: '/privacy-policy',
          description: 'Come caricamenti, report e risultati vengono conservati ed eliminati.',
        },
      ],
      embed: {
        title: 'Rimuovi i metadati da un\'immagine',
        description: 'Carica una foto JPG, PNG, WebP o HEIC. Ti mostriamo ogni tag che contiene, poi premi Rimuovi tutto per eliminarli tutti e vedere esattamente cosa è stato rimosso.',
      },
    },
    'compress-image': {
      name: 'Comprimi immagine',
      h1: 'Comprimi immagini online gratis',
      tagline: 'Riduci il peso dei file JPG, PNG e WebP per siti più veloci, caricamenti più leggeri e condivisione più semplice.',
      metaTitle: 'Comprimi immagini online gratis | Media Manipulator',
      metaDescription: 'Compressore di immagini online gratuito. Riduci il peso dei file JPG, PNG e WebP mantenendo una buona qualità. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Comprimi immagini online gratis',
      ogDescription: 'Riduci il peso dei file JPG, PNG e WebP mantenendo una buona qualità. Gratis, veloce, senza registrazione.',
      intro: 'Comprimere un\'immagine significa ricodificarla così che la stessa immagine occupi meno byte. Questa pagina apre il convertitore di immagini con il campo qualità già impostato a 80 e il formato di uscita uguale a quello del tuo caricamento, così un JPG resta JPG e un WebP resta WebP. Sul nostro server il lavoro è un unico comando ImageMagick: il file viene orientato automaticamente in base al flag di rotazione EXIF e poi scritto con -quality 80, o con qualunque numero tra 1 e 100 che digiti. Per JPG e WebP è quel numero a decidere il peso del file. Per il PNG viene ignorato, perché il PNG è senza perdita, quindi la vera leva per una foto PNG è passare l\'uscita a JPG o WebP.',
      whatItDoes: [
        'Ricodifica l\'uscita JPG e WebP alla qualità che scegli; il modulo parte da 80.',
        'Mantiene il formato di ingresso a meno che tu non lo cambi; portare una foto PNG a WebP o JPG è ciò che produce i grandi risparmi per il PNG.',
        'Può ridurre le dimensioni in pixel nello stesso passaggio: una larghezza o un\'altezza digitata nei campi di ridimensionamento viene applicata prima dell\'impostazione di qualità, così i due risparmi si sommano.',
        'Ricopia i tag EXIF, IPTC e XMP originali sul file compresso, a meno che tu non imposti la modalità metadati su strip.',
        'Scrive il risultato come converted.jpg, converted.webp o converted.png nella cartella di uscita del lavoro, che è ciò che il link di download serve.',
      ],
      flowSteps: [
        {
          title: 'Carica un JPG, PNG o WebP',
          description: 'Qualsiasi file fino al limite per file del tuo piano, che per gli ospiti è di 200 MB per impostazione predefinita.',
        },
        {
          title: 'Scegli un numero di qualità',
          description: '80 è preimpostato. Da 60 a 75 riduce di più; 90 e oltre conserva quasi tutto.',
        },
        {
          title: 'ImageMagick ricodifica',
          description: 'convert input -auto-orient -quality N output, seguito da un passaggio di exiftool che copia i tag.',
        },
        {
          title: 'Scarica il file più leggero',
          description: 'L\'uscita viene servita dalla cartella del lavoro fino alla fine del suo periodo di conservazione.',
        },
      ],
      advancedDetails: [
        'Il comando esatto è ImageMagick convert con prima il percorso di ingresso, poi -auto-orient, un -crop e un -resize facoltativi, poi -quality N e infine il percorso di uscita. L\'argomento -quality viene aggiunto solo quando il formato di uscita è jpg, jpeg o webp (convertImage in converter.go).',
        'La qualità viene validata sul server nell\'intervallo da 1 a 100; un valore al di fuori viene rifiutato prima che inizi qualsiasi lavoro, e il credito del lavoro viene rimborsato.',
        'L\'uscita PNG non riceve mai un argomento -quality, quindi abbassare il numero in un lavoro da PNG a PNG non cambia nulla. Il convertitore non esegue pngquant né alcuna riduzione della palette; per rendere un PNG più piccolo devi cambiarne il formato.',
        'Nella modalità metadati predefinita il server esegue exiftool -TagsFromFile <original> -all:all -unsafe sul risultato, così i tag di fotocamera, obiettivo, data e GPS sopravvivono alla compressione. Scegliendo strip viene eseguito invece exiftool -all= sull\'uscita.',
        'Un ridimensionamento, se lo imposti, avviene prima dell\'applicazione della qualità. La sola larghezza mantiene le proporzioni; larghezza più altezza forza esattamente quel riquadro anche quando le proporzioni differiscono.',
        'Filtri, una tinta e una sovrapposizione di testo sono disponibili nello stesso modulo: un filtro viene applicato subito dopo il ridimensionamento, mentre tinta e sovrapposizione di testo vengono aggiunte per ultime, dopo l\'impostazione di qualità.',
      ],
      whyItMatters: [
        'I byte delle immagini sono di solito la parte più grande di una pagina web o di un\'email, quindi dimezzarli è il guadagno di velocità più economico disponibile.',
        'Moduli di caricamento, campi dei CMS e app di messaggistica applicano limiti misurati in megabyte, non in pixel.',
        'Ricodificare una volta a una qualità scelta da te è meglio che lasciare che una piattaforma ricodifichi alle sue condizioni.',
      ],
      useCases: [
        {
          title: 'Foto per blog e prodotti',
          description: 'Porta un JPEG da fotocamera da 4 a 6 MB ben sotto 1 MB prima di pubblicarlo.',
        },
        {
          title: 'Allegati email',
          description: 'Fai stare una serie di foto sotto un limite di casella da 20 o 25 MB.',
        },
        {
          title: 'Portali di candidatura',
          description: 'Rispetta un limite di 2 MB per una foto tessera o la foto di un documento senza perdita visibile.',
        },
        {
          title: 'Copie di lavoro',
          description: 'Tieni copie più leggere per l\'uso quotidiano mentre gli originali restano nel tuo archivio.',
        },
      ],
      workedExamples: [
        {
          title: 'Un JPEG da telefono 4000 x 3000 a qualità 80 con larghezza 1600 px',
          body: 'Ingresso: un JPEG da 4,8 MB, 4000 x 3000 pixel, appena uscito dalla fotocamera di un telefono. Impostazioni: larghezza 1600, altezza vuota, qualità 80, formato invariato. ImageMagick esegue -resize 1600x, che mantiene le proporzioni e produce 1600 x 1200 pixel: 1,92 megapixel contro i 12 originali, circa un sesto dei pixel. Il risultato viene scritto con -quality 80 e riceve di nuovo i suoi EXIF, quindi l\'uscita è un JPG 1600 x 1200 il cui peso segue quella riduzione di pixel, più o meno un sesto dell\'originale, quindi aspettati circa 1 MB o meno dai 4,8 MB. La conversione è un singolo passaggio di ImageMagick su un\'immagine da 12 megapixel e richiede qualche secondo; caricare il file da 4,8 MB richiede di solito più tempo che convertirlo.',
        },
        {
          title: 'Uno screenshot PNG da 2,6 MB passato a WebP',
          body: 'Ingresso: uno screenshot PNG 1920 x 1080 da 2,6 MB senza trasparenza. Lasciare il formato su PNG e portare la qualità a 60 non cambierebbe nulla, perché -quality non viene passato per l\'uscita PNG. Passare l\'uscita a WebP alla qualità preimpostata 80 esegue convert input -auto-orient -quality 80 converted.webp. Non compressi, quei 2.073.600 pixel sono 6,2 MB di RGB; il WebP con perdita a qualità 80 ne conserva solo una frazione, quindi il risultato è una frazione del PNG da 2,6 MB, con la cifra esatta che dipende da quanto colore piatto e testo contiene lo screenshot. Le dimensioni restano 1920 x 1080 e il lavoro finisce in qualche secondo.',
        },
      ],
      whenNotToUse: 'Non usare la compressione con perdita su un\'immagine che intendi ancora modificare pesantemente, su un PNG la cui trasparenza devi mantenere come PNG (passare a JPG appiattisce il canale alfa) o su screenshot di testo piccolo, dove una qualità molto sotto 85 fa sbavare le lettere. Se il file è pesante solo per le sue dimensioni in pixel, il ridimensionatore di immagini è il primo passo migliore; se il tuo obiettivo è la privacy e non il peso, lo strumento di rimozione EXIF elimina i tag senza toccare i pixel. E un JPG già salvato a qualità 70 non si riduce molto a 80; ogni nuovo salvataggio aggiunge perdita senza un guadagno corrispondente.',
      whyMediaManipulator: [
        'Il comando che viene eseguito è scritto in questa pagina, compreso il fatto che il PNG ignora il numero di qualità, così non resti a chiederti perché un file non si è ridotto.',
        'I controlli di qualità, ridimensionamento, formato e metadati vivono in un unico modulo e un unico caricamento, e non viene aggiunta nessuna filigrana.',
        'Nulla da installare e nessun account necessario per lo strumento standard. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ],
      privacyNote: 'La tua immagine viene conservata in uploads/<jobId>/ sul nostro server, ImageMagick scrive la copia compressa in outputs/<jobId>/ e accanto viene scritto un rapporto dei metadati dell\'originale. Nella modalità predefinita exiftool copia i tag EXIF, IPTC e XMP originali sul file compresso, così i dati di posizione e fotocamera tornano con il risultato, a meno che tu non scelga l\'opzione strip. Ogni immagine caricata viene anche passata a un\'analisi automatica eseguita da un modello di visione sullo stesso server, e il suo riepilogo JSON viene conservato con il lavoro. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Nulla viene inviato a un servizio di terze parti.',
      faq: [
        {
          question: 'Comprimere un\'immagine qui è gratis?',
          answer: 'Sì per lo strumento standard. Un lavoro di compressione spende una delle operazioni della giornata: gli ospiti ne hanno 5 al giorno con un limite per file di 200 MB per impostazione predefinita, un account gratuito porta il limite a 30 al giorno e 1 GB per file, e Premium e Pro arrivano a 300 e 700. I numeri aggiornati sono su /pricing, perché i limiti possono cambiare.',
        },
        {
          question: 'Quale numero di qualità dovrei usare?',
          answer: '80 è il valore preimpostato e un default sensato per le foto. Scendi solo quando un limite rigido di peso ti obbliga, e sali a 90 o oltre per immagini che verranno stampate o ritagliate in seguito. Il numero viene passato direttamente all\'opzione -quality di ImageMagick, quindi significa la stessa cosa che negli altri strumenti basati su ImageMagick.',
        },
        {
          question: 'Perché il mio PNG non si è ridotto?',
          answer: 'Perché il campo qualità non fa nulla per l\'uscita PNG: il server aggiunge -quality solo per jpg, jpeg e webp. Cambia il formato di uscita in WebP o JPG. Se devi mantenere la trasparenza, il WebP conserva un canale alfa mentre il JPG no.',
        },
        {
          question: 'La compressione conserva i miei dati EXIF e GPS?',
          answer: 'Per impostazione predefinita sì. Dopo che ImageMagick ha scritto il file, exiftool copia ogni gruppo di tag dall\'originale sul risultato. Scegli strip nella sezione metadati per rimuoverli tutti, oppure usa lo strumento dedicato di rimozione EXIF.',
        },
        {
          question: 'L\'immagine verrà anche ridimensionata?',
          answer: 'No, a meno che tu non digiti una larghezza o un\'altezza. Con entrambi i campi vuoti le dimensioni in pixel restano invariate e cambia solo la codifica.',
        },
        {
          question: 'Posso comprimere più immagini in una volta sola?',
          answer: 'Ogni caricamento è un lavoro con un unico file di uscita. Esegui lo strumento una volta per immagine; ogni lavoro conta come un\'operazione nel limite giornaliero.',
        },
        {
          question: 'Il WebP è sempre più piccolo del JPG alla stessa qualità?',
          answer: 'Di solito per le fotografie, ma le scale di qualità dei due encoder non sono identiche, quindi confronta le due uscite invece di darlo per scontato. Resta sul JPG quando il file deve aprirsi in software precedenti al supporto WebP.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Abbassare la qualità incide sull\'uscita JPG e WebP. Per ridurre molto una foto PNG, convertila in JPG o WebP.',
        ],
      },
      related: [
        {
          label: 'Ridimensiona immagine',
          to: '/tools/image-resizer',
          description: 'Riduci prima le dimensioni in pixel per i risparmi maggiori.',
        },
        {
          label: 'Rimuovi i metadati EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimina i tag di posizione e fotocamera senza ricodificare.',
        },
        {
          label: 'Da immagine a PDF',
          to: '/tools/image-to-pdf',
          description: 'Inserisci il JPG compresso in un PDF di una pagina.',
        },
        {
          label: 'Upscaler di immagini con IA',
          to: '/tools/ai-image-upscaler',
          description: 'Fai il percorso inverso e ingrandisci un\'immagine piccola.',
        },
        {
          label: 'Tutorial del convertitore di immagini',
          to: '/tutorials/image/getting-started',
          description: 'Esplora le impostazioni di qualità, ridimensionamento e formato.',
        },
      ],
      embed: {
        title: 'Comprimi un\'immagine',
        description: 'Carica un\'immagine e abbassa il cursore della qualità per ridurre il file. Il formato di uscita resta lo stesso per impostazione predefinita, oppure passa a WebP per il peso minimo. Una qualità intorno a 75–85 è un buon equilibrio.',
      },
    },
    'image-resizer': {
      name: 'Ridimensiona immagine',
      h1: 'Ridimensiona immagini online gratis',
      tagline: 'Ridimensiona immagini JPG, PNG, WebP e GIF alle dimensioni esatte in pixel mantenendo le proporzioni.',
      metaTitle: 'Ridimensiona immagini online gratis | Media Manipulator',
      metaDescription: 'Strumento online gratuito per ridimensionare le immagini. Ridimensiona immagini JPG, PNG, WebP e GIF alle dimensioni esatte in pixel mantenendo le proporzioni. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Ridimensiona immagini online gratis',
      ogDescription: 'Ridimensiona immagini JPG, PNG, WebP e GIF alle dimensioni esatte in pixel. Gratis, veloce, senza registrazione.',
      intro: 'Questa pagina apre il convertitore di immagini con i campi di ridimensionamento in primo piano. Digita una larghezza, un\'altezza o entrambe, e il server esegue ImageMagick con un argomento -resize costruito esattamente da quello che hai digitato: 1600x per la sola larghezza, x900 per la sola altezza e 1600x900! quando compili entrambe. Quel punto esclamativo finale è importante: dice a ImageMagick di produrre esattamente quel riquadro anche se le proporzioni differiscono dall\'originale, il che stira l\'immagine. La regola quindi è semplice. Un campo mantiene le proporzioni; due campi ti danno la dimensione esatta e si fidano che tu abbia scelto proporzioni corrispondenti o che abbia prima ritagliato.',
      whatItDoes: [
        'Scala immagini JPG, PNG, WebP e GIF alla larghezza e all\'altezza in pixel che digiti, dopo averle orientate automaticamente in base al flag di rotazione EXIF.',
        'Mantiene le proporzioni quando è compilata una sola dimensione; forza il riquadro esatto quando lo sono entrambe.',
        'Offre un riquadro di ritaglio nello stesso modulo, applicato prima del ridimensionamento: è così che ottieni un quadrato o un banner esatti senza distorsioni.',
        'Scrive l\'uscita nel formato originale per impostazione predefinita, con qualità 85 per JPG e WebP, e vi copia i tag dei metadati originali.',
        'Limita l\'altezza richiesta al limite di uscita del tuo piano e le dimensioni a quelle che ImageMagick è autorizzato a produrre.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'immagine',
          description: 'JPG, PNG, WebP o GIF, fino al limite per file del tuo piano.',
        },
        {
          title: 'Digita larghezza, altezza o entrambe',
          description: 'Un valore mantiene le proporzioni. Due valori forzano il riquadro. Ritaglia prima se le proporzioni devono cambiare.',
        },
        {
          title: 'ImageMagick ridimensiona',
          description: 'convert input -auto-orient [-crop WxH+X+Y] -resize <arg> [-quality 85] output.',
        },
        {
          title: 'Scarica',
          description: 'Il file ridimensionato viene servito dalla cartella di uscita del lavoro come converted.<format>.',
        },
      ],
      advancedDetails: [
        'L\'argomento di ridimensionamento viene costruito in convertImage (converter.go): entrambi i valori danno WxH! (forza l\'esatto), la sola larghezza dà Wx, la sola altezza dà xH. Viene usato il filtro di ricampionamento predefinito di ImageMagick; non c\'è un\'opzione per sceglierne un altro.',
        'Un ritaglio, se impostato, viene passato come -crop WxH+X+Y ed eseguito prima di -resize, quindi le coordinate del ritaglio si riferiscono all\'originale orientato automaticamente, non al risultato ridimensionato.',
        'Il server rifiuta una larghezza o un\'altezza superiore a 10000 o inferiore a 1, e il modulo limita entrambi i campi a 4096.',
        'Un\'altezza esplicita viene anche controllata rispetto al limite di altezza in uscita del tuo piano prima che il caricamento venga accettato: 1080 px per gli ospiti per impostazione predefinita, 1440 con un account gratuito, 2160 con Premium e Pro. Una richiesta oltre il limite viene rifiutata con un messaggio che indica entrambi i numeri, e non viene speso nessun credito. La sola larghezza non viene controllata.',
        'L\'uscita JPG e WebP riceve -quality 85, a meno che tu non cambi il numero; PNG e GIF lo ignorano. Ingrandire con questo strumento si limita a interpolare i pixel esistenti, quindi un ingrandimento 2x o 4x risulta morbido; per quel caso esiste l\'upscaler con IA.',
        'Quando ImageMagick ha finito, exiftool copia i tag originali sul risultato nella modalità metadati predefinita, così il file ridimensionato porta ancora con sé data di scatto, modello di fotocamera ed eventuale posizione GPS.',
      ],
      whyItMatters: [
        'Gli spazi per avatar, copertine e miniature vogliono dimensioni in pixel specifiche, e il ridimensionamento fatto dalla piattaforma è di solito di qualità inferiore e fuori dal tuo controllo.',
        'Il numero di pixel è il fattore più importante in assoluto per il peso del file; una foto da 24 megapixel mostrata a 1920 px di larghezza porta con sé dieci volte i dati che lo schermo può visualizzare.',
        'Ridimensionare alle tue condizioni ti permette anche di scegliere il ritaglio, invece di lasciare che uno spazio quadrato tagli via una testa.',
      ],
      useCases: [
        {
          title: 'Foto profilo e avatar',
          description: 'Ritaglia a quadrato, poi ridimensiona ai 400 o 512 px richiesti dal servizio.',
        },
        {
          title: 'Immagini per web e blog',
          description: 'Scala le foto della fotocamera alla larghezza di colonna a cui verranno davvero mostrate.',
        },
        {
          title: 'Banner e intestazioni',
          description: 'Taglia le proporzioni esatte, poi raggiungi al pixel la larghezza richiesta.',
        },
        {
          title: 'Limiti dei moduli di caricamento',
          description: 'Riduci le dimensioni per restare sotto un limite in megapixel o megabyte.',
        },
      ],
      workedExamples: [
        {
          title: 'Un JPEG da fotocamera 6000 x 4000 scalato a 1920 px di larghezza',
          body: 'Ingresso: un JPEG da 8,5 MB e 24 megapixel da una fotocamera mirrorless. Impostazioni: larghezza 1920, altezza vuota, formato invariato, qualità 85. Il server esegue convert input -auto-orient -resize 1920x -quality 85 converted.jpg. Le proporzioni sono 3:2, quindi l\'uscita è di 1920 x 1280 pixel, circa 2,46 megapixel, più o meno un decimo del numero di pixel originale. Il peso del file cala in proporzione simile, quindi aspettati qualcosa sotto 1 MB. Un passaggio di ImageMagick su 24 megapixel richiede qualche secondo sul server, e la copia con exiftool subito dopo conserva i tag di obiettivo ed esposizione.',
        },
        {
          title: 'Un avatar 400 x 400 da una foto verticale da telefono 3024 x 4032',
          body: 'Ingresso: un JPEG verticale da 3,1 MB, largo 3024 e alto 4032. Digitare solo 400 e 400 eseguirebbe -resize 400x400! e schiaccerebbe l\'immagine 3:4 in un quadrato. Imposta invece il ritaglio a 3024 x 3024 con scostamento 0,504 (un quadrato preso dal centro), poi larghezza 400 e altezza 400. Il comando diventa convert input -auto-orient -crop 3024x3024+0+504 -resize 400x400! -quality 85 converted.jpg, e il risultato è un JPG 400 x 400 non distorto di 160.000 pixel, qualche decina di kilobyte. Ritaglio e ridimensionamento sono un unico passaggio e finiscono in qualche secondo.',
        },
      ],
      whenNotToUse: 'Non usare il ridimensionatore per ingrandire un\'immagine piccola: ImageMagick si limita a interpolare i pixel esistenti, quindi una foto da 640 px spinta a 2560 px esce sfocata, e quel caso spetta all\'upscaler con IA. Non digitare sia una larghezza sia un\'altezza con proporzioni diverse da quelle dell\'immagine se non hai prima ritagliato, perché la modalità a riquadro esatto stira invece di aggiungere bande. Se il file è pesante ma le dimensioni sono già giuste, usa il compressore e lascia stare i pixel. E le GIF animate sono gestite meglio da uno strumento GIF dedicato che da un semplice ridimensionamento.',
      whyMediaManipulator: [
        'Il comportamento riquadro esatto contro mantieni proporzioni è spiegato qui con i veri argomenti di ImageMagick, così nessuna sorpresa quando una foto torna stirata.',
        'Ritaglio, ridimensionamento, formato e qualità sono un unico caricamento, e l\'uscita non ha filigrana.',
        'Nessuna registrazione per lo strumento standard. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ],
      privacyNote: 'L\'immagine caricata viene salvata in uploads/<jobId>/ sul nostro server e la copia ridimensionata in outputs/<jobId>/; entrambe le cartelle sono nel registro di conservazione e vengono rimosse insieme. Poiché la modalità metadati predefinita copia i tag originali sul file ridimensionato con exiftool, le coordinate GPS e il numero di serie della fotocamera viaggiano con il risultato, a meno che tu non scelga strip nella sezione metadati del modulo. Le immagini caricate per il ridimensionamento passano anche per l\'analisi automatica che gira su ogni immagine sul nostro server, con un modello di visione locale, e il riepilogo viene conservato nella cartella del lavoro. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Nessuna terza parte riceve il file.',
      faq: [
        {
          question: 'Ridimensionare costa qualcosa?',
          answer: 'Nessun account e nessun pagamento per lo strumento standard. Ogni ridimensionamento è un\'operazione giornaliera: 5 al giorno per gli ospiti e 30 per un account gratuito per impostazione predefinita, con un limite per file rispettivamente di 200 MB e 1 GB. Premium e Pro portano i conteggi a 300 e 700. Vedi /pricing per i numeri in vigore oggi.',
        },
        {
          question: 'Come mantengo le proporzioni?',
          answer: 'Compila solo uno dei due campi. La sola larghezza diventa -resize 1600x e l\'altezza viene calcolata dalle proporzioni originali; la sola altezza diventa x900 e la larghezza segue.',
        },
        {
          question: 'Perché la mia immagine è uscita stirata?',
          answer: 'Hai compilato sia la larghezza sia l\'altezza con proporzioni che non corrispondono all\'immagine. Due valori vengono inviati come WxH!, che forza esattamente quel riquadro. Ritaglia prima alle proporzioni desiderate, nello stesso modulo, e poi imposta entrambi i valori.',
        },
        {
          question: 'Qual è la dimensione massima che posso richiedere?',
          answer: 'Il modulo accetta fino a 4096 per ciascun campo e il server fino a 10000. Un\'altezza esplicita oltre il limite di uscita del tuo piano (1080 px per gli ospiti per impostazione predefinita) viene rifiutata prima che inizi il caricamento e non costa nulla.',
        },
        {
          question: 'Posso ingrandire una foto piccola con questo strumento?',
          answer: 'Puoi digitare un numero più grande, ma ImageMagick si limita a interpolare, quindi il risultato è morbido. Per un ingrandimento 2x o 4x che ricostruisce i dettagli, usa l\'upscaler con IA, che esegue invece Real-ESRGAN.',
        },
        {
          question: 'L\'uscita conserva i miei dati EXIF e l\'orientamento?',
          answer: 'I pixel vengono prima orientati automaticamente, così il risultato appare dritto ovunque, e nella modalità predefinita exiftool ricopia i tag originali sul file. Scegli strip se vuoi eliminare i tag.',
        },
        {
          question: 'Posso ridimensionare una GIF?',
          answer: 'La GIF è accettata in ingresso e in uscita e passa per lo stesso comando ImageMagick. Lo strumento è pensato per immagini fisse; per le GIF animate uno strumento GIF dedicato offre più controllo su fotogrammi e palette.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Lascia vuota una dimensione per scalare in proporzione e mantenere le proporzioni.',
        ],
      },
      related: [
        {
          label: 'Comprimi immagine',
          to: '/tools/compress-image',
          description: 'Abbassa la qualità senza cambiare le dimensioni.',
        },
        {
          label: 'Upscaler di immagini con IA',
          to: '/tools/ai-image-upscaler',
          description: 'Ingrandisci 2x o 4x con un modello invece dell\'interpolazione.',
        },
        {
          label: 'Rimuovi i metadati EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimina i tag che il ridimensionamento conserva per impostazione predefinita.',
        },
        {
          label: 'Da immagine a PDF',
          to: '/tools/image-to-pdf',
          description: 'Inserisci l\'immagine ridimensionata in una pagina PDF.',
        },
        {
          label: 'Tutorial del convertitore di immagini',
          to: '/tutorials/image/getting-started',
          description: 'Esplora le impostazioni di ridimensionamento, ritaglio e qualità.',
        },
      ],
      embed: {
        title: 'Ridimensiona un\'immagine',
        description: 'Carica un\'immagine e imposta qui sotto una larghezza e/o un\'altezza di destinazione. Lasciane una vuota per scalare in proporzione e mantenere le proporzioni originali. Il formato di uscita resta lo stesso, a meno che tu non lo cambi.',
      },
    },
    'remove-background-from-image': {
      name: 'Rimuovi lo sfondo da un\'immagine',
      h1: 'Rimuovi lo sfondo da un\'immagine online gratis',
      tagline: 'Cancella automaticamente lo sfondo da qualsiasi foto e scarica un ritaglio PNG nitido e trasparente.',
      metaTitle: 'Rimuovi lo sfondo da un\'immagine online gratis | Media Manipulator',
      metaDescription: 'Rimozione dello sfondo online gratuita. Cancella automaticamente lo sfondo da qualsiasi foto e scarica un PNG trasparente. Funziona sulla nostra GPU, senza IA di terze parti. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Rimuovi lo sfondo da un\'immagine online gratis',
      ogDescription: 'Cancella automaticamente lo sfondo da qualsiasi foto e scarica un ritaglio PNG trasparente. Gratis, senza registrazione.',
      intro: 'Questa pagina apre il convertitore di immagini con l\'operazione IA bloccata su Rimuovi sfondo e l\'output bloccato su PNG. Quando converti, il server passa il tuo file a rembg, uno strumento di segmentazione open source in esecuzione su una GPU di nostra proprietà: per impostazione predefinita carica il modello BiRefNet General, prevede quali pixel appartengono al soggetto e scrive un PNG il cui canale alfa è trasparente ovunque altrove. Nel modulo sono selezionabili altri sei modelli (un BiRefNet più leggero, una variante per ritratti, ISNet e tre build di U2Net) per i casi in cui il modello generale valuta male capelli, vetro o una persona su uno sfondo affollato.',
      whatItDoes: [
        'Esegue rembg con il modello che scegli (BiRefNet General, se non lo cambi) e restituisce il soggetto su uno sfondo trasparente.',
        'Scrive sempre PNG, perché la trasparenza richiede un canale alfa e l\'API forza l\'estensione .png per questa operazione.',
        'Mantiene le dimensioni in pixel complete del file caricato; il ritaglio non viene ridimensionato né tagliato.',
        'Viene eseguito sulla nostra GPU tramite ONNX Runtime con CUDA; nessuna immagine viene inviata a un servizio IA esterno.',
        'Conta come un lavoro ordinario, la stessa unità di una semplice conversione di formato, non come un lavoro IA.',
      ],
      flowSteps: [
        {
          title: 'Carica un JPG, PNG o WebP',
          description: 'Un unico soggetto ben definito dà la maschera più pulita.',
        },
        {
          title: 'Scegli un modello, o tieni quello predefinito',
          description: 'BiRefNet General è preselezionato; i modelli per ritratti e per la segmentazione umana sono pensati per le persone.',
        },
        {
          title: 'rembg segmenta sulla GPU',
          description: 'rembg i -m <model> input output.png viene eseguito con l\'ambiente CUDA di ONNX Runtime caricato.',
        },
        {
          title: 'Scarica il PNG trasparente',
          description: 'Il risultato è converted.png nella cartella di output del lavoro.',
        },
      ],
      advancedDetails: [
        'La chiamata è RemoveBackground in ai_tools.go: una shell bash carica lo script dell\'ambiente CUDA di ONNX Runtime, imposta U2NET_HOME sulla directory dei modelli del server ed esegue rembg i -m <model> <input> <output>. I pesi dei modelli sono memorizzati nella cache del server, quindi il primo lavoro dopo un riavvio può richiedere un po\' più di tempo mentre vengono caricati.',
        'I nomi di modello accettati sono birefnet-general, birefnet-general-lite, isnet-general-use, u2net, u2netp, u2net_human_seg e birefnet-portrait; qualsiasi altro valore viene rifiutato prima che il lavoro inizi. Un valore vuoto diventa birefnet-general.',
        'Il percorso IA sostituisce completamente la pipeline ImageMagick, quindi il valore di qualità, i filtri, la tinta, la sovrapposizione di testo e le opzioni dei metadati nel modulo non hanno effetto su questa operazione; l\'output è ciò che rembg scrive.',
        'Poiché il normale passaggio di copia con exiftool non viene eseguito per le operazioni IA, il PNG non contiene alcun EXIF dell\'originale. Se ti servono i tag sul ritaglio, l\'editor di metadati può aggiungerli in un secondo lavoro.',
        'La dimensione dell\'output dipende dal soggetto: le regioni completamente trasparenti in PNG si comprimono fino a quasi nulla, quindi un piccolo prodotto su una tela grande dà un file piccolo, mentre un soggetto a pieno fotogramma dà un file vicino a un PNG senza perdita dell\'originale.',
      ],
      whyItMatters: [
        'Schede prodotto, miniature e composizioni partono tutte da un ritaglio, e mascherarne uno a mano richiede minuti per ogni immagine.',
        'I marketplace richiedono sempre più spesso uno sfondo neutro o bianco, cioè un ritaglio trasparente posato su un livello bianco.',
        'Un modello addestrato su milioni di maschere gestisce pelliccia, capelli e bordi semitrasparenti meglio di una selezione con la bacchetta magica.',
      ],
      useCases: [
        {
          title: 'Prodotti per e-commerce',
          description: 'Isola l\'articolo e posizionalo su bianco o su qualsiasi colore del brand.',
        },
        {
          title: 'Ritratti e pagine del team',
          description: 'Usa il modello per ritratti per ritagliare le persone in modo pulito dagli sfondi d\'ufficio.',
        },
        {
          title: 'Loghi estratti dalle foto',
          description: 'Ottieni una versione trasparente di un logo che esiste solo su un\'insegna o una pagina colorata.',
        },
        {
          title: 'Miniature e sticker',
          description: 'Costruisci design a livelli da più ritagli nel tuo editor.',
        },
      ],
      workedExamples: [
        {
          title: 'Un JPEG di prodotto da 3000 x 2000 con il modello predefinito',
          body: 'Input: un JPEG da 2,1 MB, 3000 x 2000, di una scarpa su uno sfondo grigio. Modello lasciato su BiRefNet General. Il server esegue rembg sulla GPU e scrive converted.png agli stessi 3000 x 2000 pixel, a quattro canali. Non compressi sarebbero 24 MB di RGBA, ma lo sfondo trasparente si comprime fino a quasi nulla, quindi la dimensione del PNG è determinata dalla scarpa stessa, in genere qualche megabyte perché il PNG è senza perdita. Il tempo è un passaggio in avanti del modello sull\'immagine più la codifica PNG, pochi secondi quando il modello è già caldo; la prima esecuzione dopo un periodo di inattività aggiunge il tempo di caricamento dei pesi.',
        },
        {
          title: 'Un ritratto da 1080 x 1080 con il modello per ritratti',
          body: 'Input: un selfie WebP da 640 KB, 1080 x 1080, davanti a una libreria. Passa al modello BiRefNet Portrait, ottimizzato per persone e capelli. L\'output è un PNG da 1080 x 1080 con la persona opaca e gli scaffali completamente trasparenti. A 1,17 megapixel il passaggio del modello è rapido; la maggior parte del tempo effettivo se ne va in caricamento e scrittura del PNG. Poiché il percorso IA salta la copia dei metadati, il PNG non ha EXIF, che di solito è proprio ciò che vuoi per un\'immagine del profilo.',
        },
      ],
      whenNotToUse: 'Evita questo strumento quando il soggetto non è un singolo elemento distinto: una folla, un paesaggio, un pattern o un interno senza un primo piano evidente non danno al modello nulla da separare e la maschera sarà arbitraria. È lo strumento sbagliato anche quando vuoi una sfocatura morbida dietro il soggetto invece della trasparenza, quando ti serve il risultato in JPG (il JPG non può contenere il canale alfa, quindi dovresti appiattirlo in seguito) e quando l\'input è uno screenshot o un disegno al tratto, dove ISNet o una selezione manuale in un editor funzionano meglio di un modello addestrato su fotografie.',
      whyMediaManipulator: [
        'Sette veri modelli di segmentazione sono esposti per nome, così puoi passare dal modello generale a una build per ritratti o U2Net quando un bordo esce male.',
        'L\'output è un semplice PNG trasparente a piena risoluzione, senza filigrana e senza riduzione forzata.',
        'Il modello gira su hardware che gestiamo noi, e lo strumento standard non richiede alcun account. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      ],
      privacyNote: 'La tua foto viene scritta in uploads/<jobId>/ sul nostro server e letta da rembg in esecuzione su una GPU nella stessa macchina; il ritaglio va in outputs/<jobId>/converted.png. Per la segmentazione non viene chiamata alcuna API esterna e nulla della tua immagine viene usato per addestrare alcunché. Come ogni caricamento di immagini, il file viene anche esaminato una volta da un passaggio di analisi automatica con un modello di visione ospitato sul nostro server, e quel riepilogo viene conservato con il lavoro. Il PNG non contiene EXIF dell\'originale perché il passaggio di copia dei metadati non viene eseguito per le operazioni IA. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      faq: [
        {
          question: 'La rimozione dello sfondo è gratuita?',
          answer: 'Sì, entro la quota giornaliera. La rimozione dello sfondo conta deliberatamente come un lavoro ordinario, non come uno della quota IA separata: 5 al giorno per gli ospiti e 30 con un account gratuito per impostazione predefinita, con limiti per file di 200 MB e 1 GB. Premium e Pro ne hanno 300 e 700. Le cifre aggiornate sono su /pricing.',
        },
        {
          question: 'Quale modello dovrei scegliere?',
          answer: 'Tieni BiRefNet General per oggetti, prodotti e la maggior parte delle foto. Scegli BiRefNet Portrait o U2Net Human Segmentation per le persone, e BiRefNet General Lite o U2Net Lite quando vuoi un passaggio più veloce su un\'immagine grande.',
        },
        {
          question: 'Perché l\'output è sempre PNG?',
          answer: 'L\'API forza l\'estensione .png per questa operazione perché il ritaglio ha bisogno di un canale alfa; il JPG non ne ha e mostrerebbe lo sfondo in nero o in bianco. Converti in un altro formato in seguito, dopo averlo appiattito su un colore.',
        },
        {
          question: 'Posso ottenere uno sfondo bianco invece della trasparenza?',
          answer: 'Non direttamente da questo strumento. Posiziona il PNG su un livello bianco in qualsiasi editor o in Darkroom; i pixel trasparenti prendono il colore sottostante.',
        },
        {
          question: 'Funziona su capelli, pelliccia e vetro?',
          answer: 'Spesso sì, e i modelli per ritratti e BiRefNet sono stati addestrati tenendo conto di quei bordi, ma le regioni semitrasparenti sono il caso più difficile. Prova un secondo modello se il primo lascia una frangia.',
        },
        {
          question: 'La mia foto viene inviata a un\'azienda di IA esterna?',
          answer: 'No. rembg e i suoi modelli girano sul nostro server GPU, e il lavoro non chiama mai un\'API di terze parti.',
        },
        {
          question: 'Il ritaglio conserva i miei dati EXIF?',
          answer: 'No. Le operazioni IA saltano la copia con exiftool che il convertitore normale esegue, quindi il PNG non ha tag di fotocamera, data o GPS.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'L\'output è sempre un PNG trasparente. La rimozione dello sfondo gira sul nostro server GPU locale, non su un\'API di terze parti.',
        ],
      },
      related: [
        {
          label: 'Rimuovi un oggetto da una foto',
          to: '/tools/remove-object-from-photo',
          description: 'Cancella un elemento e mantieni il resto della scena.',
        },
        {
          label: 'Ridimensiona immagine',
          to: '/tools/image-resizer',
          description: 'Scala il ritaglio alla dimensione richiesta dal tuo layout.',
        },
        {
          label: 'Upscaler di immagini con IA',
          to: '/tools/ai-image-upscaler',
          description: 'Ingrandisci un ritaglio piccolo prima di posizionarlo.',
        },
        {
          label: 'Sfoca i volti in una foto',
          to: '/tools/blur-faces-in-photo',
          description: 'Rendi anonime le persone invece di isolarle.',
        },
        {
          label: 'Tutorial del convertitore di immagini',
          to: '/tutorials/image/getting-started',
          description: 'Esplora ogni opzione IA e di immagine.',
        },
      ],
      embed: {
        title: 'Rimuovi lo sfondo da un\'immagine',
        description: 'Carica una foto. Questo strumento è preimpostato sulla rimozione dello sfondo con IA e produce un PNG trasparente. Basta caricare e convertire: il soggetto viene mantenuto e lo sfondo cancellato.',
      },
    },
    'image-to-pdf': {
      name: 'Da immagine a PDF',
      h1: 'Converti immagini in PDF online gratis',
      tagline: 'Trasforma immagini JPG, PNG e altre in un documento PDF pulito e facile da condividere, con un clic.',
      metaTitle: 'Converti immagini in PDF online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da immagine a PDF. Trasforma immagini JPG, PNG e altre in un documento PDF pulito. Senza registrazione né filigrane. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti immagini in PDF online gratis',
      ogDescription: 'Trasforma JPG, PNG e altre immagini in un PDF pulito e facile da condividere. Gratis, veloce, senza registrazione.',
      intro: 'Questa pagina blocca il formato di output su PDF, il che invia la tua immagine lungo un percorso dedicato della nostra API che costruisce il documento in puro Go anziché tramite ImageMagick o Ghostscript. Un JPEG viene incorporato byte per byte con il filtro /DCTDecode, quindi la foto dentro il PDF è lo stesso identico flusso compresso che hai caricato. Un PNG, GIF o WebP viene decodificato, composto su bianco e memorizzato come RGB a 8 bit compresso con zlib. L\'unica pagina è dimensionata in modo che l\'immagine stia a 96 pixel per pollice: ogni pixel diventa 0,75 punti, il che mantiene l\'immagine alla risoluzione nativa senza ricampionamento.',
      whatItDoes: [
        'Racchiude un\'immagine in un documento PDF 1.4 di una pagina, dimensionato sull\'immagine a 96 DPI.',
        'Incorpora i dati JPEG intatti, quindi per le foto non c\'è una seconda generazione di compressione.',
        'Appiattisce su bianco i pixel trasparenti di PNG e GIF e li memorizza senza perdita con zlib.',
        'Rasterizza prima con ImageMagick WebP e gli altri contenitori che Go non può decodificare, poi incorpora il risultato senza perdita.',
        'Ignora le impostazioni di qualità, ridimensionamento, ritaglio, filtri e IA; il percorso PDF prende solo l\'immagine.',
      ],
      flowSteps: [
        {
          title: 'Carica qualsiasi immagine',
          description: 'JPG, PNG, GIF e WebP sono gli input più comuni; il campo accetta qualsiasi tipo di immagine.',
        },
        {
          title: 'Il server legge i pixel',
          description: 'Le dimensioni del JPEG arrivano dall\'intestazione; gli altri formati vengono decodificati e appiattiti in RGB.',
        },
        {
          title: 'Viene assemblato un PDF di una pagina',
          description: 'Catalogo, pagina, XObject immagine e un flusso di contenuto che disegna l\'immagine a riempire la pagina.',
        },
        {
          title: 'Scarica converted.pdf',
          description: 'Servito dalla cartella di output del lavoro fino alla scadenza della conservazione.',
        },
      ],
      advancedDetails: [
        'Il builder è imageToPDFBytes in pdf_tools.go. Un file che inizia con il marcatore JPEG FF D8 FF viene incorporato come /DCTDecode con /DeviceRGB o /DeviceGray; un JPEG CMYK ricade sul percorso di decodifica e appiattimento, così il PDF non contiene mai un flusso CMYK.',
        'Gli input non JPEG vengono decodificati con i codec immagine di Go (PNG e GIF sono registrati). Ogni pixel viene composto in alfa su bianco e scritto come tre byte, poi l\'intero buffer viene compresso con zlib e memorizzato con /FlateDecode a 8 bit per componente.',
        'WebP e tutto ciò che Go non può decodificare viene prima rasterizzato da ImageMagick con -auto-orient in un flusso PNG in memoria, e quel PNG viene poi appiattito e incorporato.',
        'La dimensione della pagina in punti è larghezza x 72 / 96 e altezza x 72 / 96, quindi un\'immagine da 1200 x 1600 dà una pagina da 900 x 1200 punti (12,5 per 16,7 pollici). I visualizzatori PDF adattano la pagina alla finestra e le stampanti la adattano alla carta, quindi una pagina grande non è un problema per la visualizzazione, ma imposta «adatta alla pagina» quando stampi.',
        'I JPEG sul percorso rapido conservano il loro EXIF, compreso un flag di orientamento, ma i visualizzatori PDF non applicano l\'orientamento EXIF. Una foto del telefono memorizzata di traverso con un flag di rotazione apparirà di traverso nel PDF; convertila prima una volta in JPG (che applica l\'orientamento automatico) e poi in PDF.',
        'Il valore di qualità inviato dal modulo viene accettato ma non usato su questo percorso, e non esiste una modalità multi-immagine: un caricamento produce un PDF di una sola pagina.',
      ],
      whyItMatters: [
        'I portali per visti, università e sistemi HR accettano spesso solo PDF, anche per la foto di una ricevuta.',
        'Un PDF si stampa e si visualizza allo stesso modo su ogni dispositivo, mentre una semplice immagine può essere ruotata o scalata dal visualizzatore.',
        'Incorporare il JPEG intatto significa che il PDF è di qualità probatoria: nulla è stato ricodificato lungo il percorso.',
      ],
      useCases: [
        {
          title: 'Ricevute e moduli',
          description: 'Trasforma la foto di una pagina firmata scattata con il telefono in un PDF che un portale accetterà.',
        },
        {
          title: 'Caricamento di documenti d\'identità',
          description: 'Invia una tessera o un certificato scansionati come il PDF richiesto dal modulo.',
        },
        {
          title: 'Bozze di grafica',
          description: 'Invia a un cliente il PDF di un design PNG con la trasparenza appiattita su bianco.',
        },
        {
          title: 'Archiviazione',
          description: 'Conserva una foto insieme ad altri documenti in un unico formato.',
        },
      ],
      workedExamples: [
        {
          title: 'Un JPEG da telefono da 3024 x 4032 (2,9 MB)',
          body: 'Input: un JPEG da 2,9 MB, largo 3024 e alto 4032, RGB. L\'intestazione viene letta per le dimensioni e il flusso JPEG viene incorporato così com\'è con /DCTDecode. La pagina è larga 3024 x 0,75 = 2268 punti e alta 4032 x 0,75 = 3024 punti, cioè 31,5 per 42 pollici. Il PDF risulta di circa 2,9 MB più meno di un kilobyte di struttura PDF, perché nulla viene ricodificato. Il lavoro consiste nel leggere il file e riscriverlo, quindi il job è limitato dal disco e dalla velocità di caricamento più che dalla CPU, e termina in pochi secondi.',
        },
        {
          title: 'Un PNG da 1920 x 1080 con sfondo trasparente',
          body: 'Input: un PNG da 1,4 MB di un logo su trasparenza. Il PNG viene decodificato, ogni pixel viene composto su bianco e i 1920 x 1080 x 3 = 6.220.800 byte di RGB vengono compressi con zlib e memorizzati con /FlateDecode. La pagina è di 1440 x 810 punti (20 per 11,25 pollici). Poiché il bianco uniforme e i colori pieni si comprimono bene con zlib, il PDF è in genere nello stesso ordine di grandezza del PNG, a volte più grande, perché lo zlib puro non ha i filtri di riga che il PNG usa. Decodificare, comporre due milioni di pixel e comprimerli è lavoro per la CPU che richiede qualche secondo; la trasparenza nel risultato è assente per scelta.',
        },
      ],
      whenNotToUse: 'Questo non è lo strumento per un documento multipagina: crea esattamente una pagina da un\'immagine, quindi una serie di scansioni richiede di convertire ogni pagina e poi unirle in un editor PDF. Non usarlo quando la trasparenza deve sopravvivere, perché ogni pixel viene appiattito su bianco. Non aspettarti un file più piccolo: un JPEG viene incorporato invariato e un PNG diventa RGB compresso con zlib, quindi comprimi o ridimensiona prima l\'immagine se la dimensione conta. E una foto il cui orientamento corretto vive solo in un flag EXIF andrebbe prima convertita una volta in JPG, altrimenti il PDF la mostra come memorizzata.',
      whyMediaManipulator: [
        'Il passaggio diretto del JPEG è una scelta di progettazione: la tua foto viene incorporata senza ricodifica, cosa che molti convertitori non promettono.',
        'Niente Ghostscript e nessuna policy PDF di ImageMagick sul percorso, quindi la conversione non dipende da un\'impostazione di sicurezza del server che potrebbe rifiutare i PDF.',
        'Gratis per lo strumento standard, senza bisogno di account. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      ],
      privacyNote: 'L\'immagine viene memorizzata in uploads/<jobId>/ e il PDF in outputs/<jobId>/converted.pdf sul nostro server; entrambi vengono eliminati insieme alla chiusura della finestra di conservazione. Un JPEG conserva tutti i suoi metadati incorporati dentro il PDF perché il flusso viene copiato alla lettera, quindi i tag EXIF di posizione e fotocamera restano leggibili da chiunque estragga l\'immagine; rimuovili prima con lo strumento per rimuovere l\'EXIF se la cosa conta. PNG e gli altri input vengono decodificati in pixel grezzi, quindi nessun tag viene trasferito. Il caricamento stesso è un\'immagine e quindi passa anche attraverso l\'analisi automatica con modello di visione eseguita sul nostro server, il cui riepilogo resta con il lavoro. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      faq: [
        {
          question: 'La conversione da immagine a PDF è gratuita?',
          answer: 'Sì per lo strumento standard. Ogni conversione consuma un\'operazione giornaliera: 5 al giorno come ospite con un limite di 200 MB per file, 30 al giorno e 1 GB con un account gratuito, e 300 o 700 con Premium o Pro, tutti valori predefiniti ed elencati su /pricing.',
        },
        {
          question: 'La foto viene ricompressa dentro il PDF?',
          answer: 'No, se è un JPEG: i byte originali vengono incorporati con /DCTDecode. PNG, GIF e WebP vengono memorizzati senza perdita come RGB compresso con zlib dopo l\'appiattimento, quindi nemmeno lì si perde qualità.',
        },
        {
          question: 'Che dimensione di pagina ha il PDF?',
          answer: 'La pagina corrisponde all\'immagine a 96 pixel per pollice, quindi larghezza e altezza in punti sono 0,75 volte le dimensioni in pixel. Un\'immagine da 1200 x 1600 dà una pagina da 12,5 per 16,7 pollici; visualizzatori e stampanti la adattano.',
        },
        {
          question: 'Posso unire più immagini in un unico PDF?',
          answer: 'Non in questa pagina. Ogni caricamento produce un PDF di una sola pagina. Converti ogni immagine e unisci i PDF risultanti in un editor PDF.',
        },
        {
          question: 'Cosa succede alla trasparenza?',
          answer: 'Viene appiattita su bianco. Gli XObject immagine del PDF su questo percorso non hanno alfa, quindi i pixel trasparenti diventano pixel bianchi.',
        },
        {
          question: 'Perché la foto del mio telefono è di traverso nel PDF?',
          answer: 'I telefoni spesso memorizzano i pixel in orizzontale e impostano un flag EXIF di orientamento. Il JPEG viene incorporato intatto e i visualizzatori PDF ignorano quel flag. Passa prima la foto nel convertitore di immagini come JPG, che applica l\'orientamento automatico, poi converti il risultato in PDF.',
        },
        {
          question: 'Il PDF conserva i miei dati EXIF?',
          answer: 'Per un JPEG sì, perché l\'intero flusso JPEG, EXIF compreso, è dentro il PDF. Usa prima lo strumento per rimuovere l\'EXIF se non lo vuoi. Per PNG e gli altri input vengono conservati solo i pixel.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'L\'output è un PDF di una sola pagina. La trasparenza viene appiattita su bianco perché le pagine PDF sono opache.',
        ],
      },
      related: [
        {
          label: 'Da PDF a JPG',
          to: '/tools/pdf-to-jpg',
          description: 'Riporta le pagine PDF a immagini.',
        },
        {
          label: 'Rimuovi i metadati EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimina i tag prima che vengano incorporati nel PDF.',
        },
        {
          label: 'Comprimi immagine',
          to: '/tools/compress-image',
          description: 'Riduci prima il JPEG, dato che il PDF lo incorpora così com\'è.',
        },
        {
          label: 'Scansione documenti con IA',
          to: '/tools/ai-document-scan',
          description: 'Ripulisci e applica l\'OCR a una pagina fotografata invece di limitarti a racchiuderla.',
        },
        {
          label: 'Ridimensiona immagine',
          to: '/tools/image-resizer',
          description: 'Imposta prima la dimensione in pixel, e quindi quella della pagina.',
        },
      ],
      embed: {
        title: 'Converti un\'immagine in PDF',
        description: 'Carica qualsiasi immagine: JPG, PNG e altre. Per questo strumento l\'output è bloccato su PDF, quindi ottieni un PDF di una pagina che racchiude la tua immagine alla risoluzione nativa.',
      },
    },
    'pdf-to-jpg': {
      name: 'Da PDF a JPG',
      h1: 'Converti PDF in JPG online gratis',
      tagline: 'Converti ogni pagina di un PDF in immagini JPG di alta qualità da condividere, modificare o pubblicare.',
      metaTitle: 'Converti PDF in JPG online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da PDF a JPG. Converti ogni pagina di un PDF in immagini JPG di alta qualità, scaricate in un file ZIP. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti PDF in JPG online gratis',
      ogDescription: 'Trasforma ogni pagina di un PDF in immagini JPG di alta qualità. Gratis, veloce, senza registrazione.',
      intro: 'Carica un PDF e il nostro server esegue il rendering di ogni pagina con pdftoppm del toolkit Poppler, lo stesso rasterizzatore usato da molti visualizzatori PDF desktop. Il modulo di questa pagina è preimpostato su JPG, tutte le pagine e 150 DPI; puoi cambiare i DPI a 100, 200 o 300, limitare il lavoro alla prima pagina e impostare la qualità JPEG, che per impostazione predefinita è 90. Con tutte le pagine selezionate ottieni uno ZIP contenente page-001.jpg, page-002.jpg e così via; con solo la prima pagina ottieni un singolo JPG. Prima del rendering, pdfinfo conta le pagine e il lavoro viene rifiutato se sono più di 500.',
      whatItDoes: [
        'Rasterizza ogni pagina, o solo la prima, in un JPG alla risoluzione che scegli.',
        'Impacchetta l\'output multipagina in un unico ZIP con nomi file ordinabili e con zeri iniziali.',
        'Usa la qualità JPEG che imposti (90 per impostazione predefinita) per ogni pagina.',
        'Legge prima il numero di pagine, così un documento troppo grande fallisce prima che inizi qualsiasi rendering.',
        'Tiene i PDF fuori dall\'analisi automatica delle immagini, che viene eseguita solo sui caricamenti di immagini, video e audio.',
      ],
      flowSteps: [
        {
          title: 'Carica un PDF',
          description: 'Qualsiasi .pdf entro il tuo limite per file; il numero di pagine deve essere 500 o inferiore.',
        },
        {
          title: 'Scegli pagine, DPI e qualità',
          description: 'Tutte le pagine o solo la prima; 100, 150, 200 o 300 DPI; qualità JPEG da 1 a 100.',
        },
        {
          title: 'pdftoppm esegue il rendering',
          description: 'pdftoppm -r <dpi> -jpeg -jpegopt quality=<q> [-f 1 -l 1] input page',
        },
        {
          title: 'Scarica',
          description: 'converted.jpg per una singola pagina, converted.zip per tutte le pagine.',
        },
      ],
      advancedDetails: [
        'Il renderer è convertPDFToImages in pdf_tools.go. Chiama pdfinfo per il numero di pagine, rifiuta più di 500 pagine, poi esegue pdftoppm con -r per i DPI, -jpeg e -jpegopt quality=N per l\'output JPG, e -f 1 -l 1 quando si vuole solo la prima pagina.',
        'Il server limita i DPI all\'intervallo da 50 a 400 e la qualità da 1 a 100 indipendentemente da ciò che invia il modulo; il modulo stesso offre 100, 150, 200 e 300.',
        'pdftoppm scrive un file per pagina; il server li rinomina in page-001.jpg, page-002.jpg e così via (tre cifre, con zeri iniziali) e li comprime in uno ZIP, così i file si ordinano per pagina in qualsiasi gestore di file.',
        'Le dimensioni in pixel derivano direttamente dai DPI: una pagina US Letter (8,5 x 11 pollici) è 1275 x 1650 pixel a 150 DPI e 2550 x 3300 a 300; una pagina A4 (8,27 x 11,69 pollici) è 1240 x 1754 a 150 e 2480 x 3508 a 300.',
        'Un PDF che è a sua volta una scansione viene rasterizzato di nuovo: se la scansione incorporata era a 300 DPI e fai il rendering a 150, ogni pagina esce a metà della risoluzione lineare della scansione. Scegli 300 per mantenere ciò che la scansione aveva.',
        'La variante PNG di questo strumento usa lo stesso renderer con -png e senza opzione di qualità; il JPG è la scelta giusta per pagine fotografiche o scansionate, il PNG per pagine con testo netto e colori piatti dove il ringing del JPEG si noterebbe.',
      ],
      whyItMatters: [
        'Molti strumenti e piattaforme accettano immagini ma non PDF: presentazioni, post sui social, app di chat ed editor di immagini.',
        'Una pagina renderizzata è un\'immagine fedele di layout, caratteri e grafica vettoriale, senza nulla da incorporare o reimpaginare.',
        'Scegliere tu i DPI significa decidere tra un\'anteprima veloce e un\'esportazione a risoluzione da stampa.',
      ],
      useCases: [
        {
          title: 'Presentazioni e post sui social',
          description: 'Trasforma la pagina di un report o un poster in un\'immagine da pubblicare o inserire in una presentazione.',
        },
        {
          title: 'Miniature e anteprime',
          description: 'Esegui il rendering solo della prima pagina a 100 DPI per un\'immagine di copertina.',
        },
        {
          title: 'Annotazioni in un editor',
          description: 'Apri una pagina in un editor di immagini per annotare, oscurare o ritagliare.',
        },
        {
          title: 'Estrazione di scansioni',
          description: 'Recupera ogni pagina scansionata da un PDF come JPG separato alla risoluzione originale.',
        },
      ],
      workedExamples: [
        {
          title: 'Un report A4 di 12 pagine, tutte le pagine a 150 DPI',
          body: 'Input: un PDF A4 di 12 pagine da 1,8 MB contenente testo e qualche grafico. Impostazioni lasciate sul preset: JPG, tutte le pagine, 150 DPI, qualità 90. pdfinfo riporta 12 pagine, sotto il limite di 500, e pdftoppm viene eseguito con -r 150 -jpeg -jpegopt quality=90. Ogni pagina viene renderizzata a 8,27 x 150 per 11,69 x 150, cioè 1240 x 1754 pixel (2,2 megapixel). I dodici file vengono rinominati da page-001.jpg a page-012.jpg e compressi in converted.zip. Il rendering è per pagina e dipende soprattutto da quanto contenuto vettoriale e testo ha ciascuna pagina; una dozzina di pagine di testo richiede pochi secondi in totale. La dimensione del JPEG per pagina dipende dal contenuto: le pagine di testo per lo più bianche si comprimono molto meglio di un grafico a pagina intera.',
        },
        {
          title: 'Solo la prima pagina di una scansione US Letter a 300 DPI',
          body: 'Input: un contratto scansionato di 40 pagine, formato Letter, 28 MB. Scegli solo la prima pagina e 300 DPI, tieni la qualità a 90. Il server esegue pdftoppm -r 300 -jpeg -jpegopt quality=90 -f 1 -l 1, quindi viene rasterizzata una sola pagina, a 8,5 x 300 per 11 x 300 = 2550 x 3300 pixel (8,4 megapixel). L\'output è un singolo converted.jpg, non uno ZIP. Il rendering di una pagina scansionata è veloce perché la pagina è un\'unica immagine incorporata; il caricamento di 28 MB richiede più tempo del rendering. A 150 DPI la stessa pagina sarebbe 1275 x 1650, un quarto dei pixel, che basta per la lettura a schermo ma non per ristampare la scansione.',
        },
      ],
      whenNotToUse: 'Non convertire un PDF in JPG quando il testo deve restare selezionabile o ricercabile: il risultato sono pixel, e uno screen reader o un indice di ricerca non ne ricavano nulla. Non usare il JPG per pagine composte per lo più da testo netto e disegni al tratto se le ingrandirai, perché la compressione JPEG lascia un lieve ringing attorno ai bordi; la variante PNG è più pulita in quel caso. I documenti più lunghi di 500 pagine vengono rifiutati del tutto, e DPI molto alti su un documento lungo producono uno ZIP grande, quindi fai il rendering solo delle pagine che ti servono davvero. E se l\'obiettivo è modificare il contenuto del PDF anziché fotografarlo, lo strumento giusto è un editor PDF.',
      whyMediaManipulator: [
        'Rendering Poppler con i veri controlli di DPI e qualità esposti, non una dimensione di anteprima fissa.',
        'Un unico ZIP con nomi file numerati per pagina invece di una pila di download.',
        'Senza registrazione per lo strumento standard. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      ],
      privacyNote: 'Il tuo PDF viene memorizzato in uploads/<jobId>/ sul nostro server e i JPG renderizzati, o il loro ZIP, in outputs/<jobId>/; le pagine vengono renderizzate in una directory temporanea dentro la cartella di output, che viene rimossa appena lo ZIP è scritto. I caricamenti PDF vengono rilevati come documenti e non vengono passati all\'analisi automatica di visione che ricevono i caricamenti di immagini, video e audio. Poppler gira interamente sulla nostra macchina, e nessuna pagina viene inviata a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      faq: [
        {
          question: 'La conversione da PDF a JPG è gratuita?',
          answer: 'Sì per lo strumento standard. Un PDF, qualunque sia il numero di pagine, è un\'operazione giornaliera: 5 al giorno come ospite con un limite di 200 MB per file, 30 al giorno e 1 GB con un account gratuito, 300 con Premium e 700 con Pro, tutti valori predefiniti e mostrati su /pricing.',
        },
        {
          question: 'Quante immagini otterrò?',
          answer: 'Una per pagina quando è selezionato tutte le pagine, consegnate come converted.zip con file chiamati da page-001.jpg in su. Con solo la prima pagina ottieni un singolo converted.jpg e nessuno ZIP.',
        },
        {
          question: 'Quali DPI dovrei scegliere?',
          answer: '150 per la lettura a schermo e la condivisione (1240 x 1754 per l\'A4). 300 per la stampa o per scansioni fatte a 300 (2480 x 3508 per l\'A4). 100 per piccole anteprime. Il server accetta da 50 a 400.',
        },
        {
          question: 'A cosa serve l\'impostazione di qualità?',
          answer: 'Viene passata a pdftoppm come -jpegopt quality=N, la scala di qualità JPEG standard. 90 è il valore predefinito; abbassalo per file più piccoli su pagine ricche di foto.',
        },
        {
          question: 'C\'è un limite di pagine?',
          answer: 'Sì, 500 pagine. pdfinfo le conta prima che inizi il rendering e un documento più lungo viene rifiutato con un messaggio che indica il conteggio e il limite, e l\'operazione viene rimborsata.',
        },
        {
          question: 'Il testo nell\'immagine sarà ricercabile?',
          answer: 'No. L\'output è un\'immagine raster di ogni pagina. Se ti serve il testo, tieni il PDF, oppure usa lo strumento di scansione documenti con IA, che esegue l\'OCR su una pagina fotografata.',
        },
        {
          question: 'Posso ottenere PNG invece di JPG?',
          answer: 'Questa pagina blocca il formato su JPG. Lo stesso renderer produce PNG tramite la pagina Da PDF a PNG, che usa -png e non ha un\'impostazione di qualità.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'L\'output con tutte le pagine viene consegnato come .zip; l\'output della sola prima pagina è un singolo .jpg.',
          'La risoluzione di rendering predefinita è 150 DPI; aumentala per un output di qualità da stampa.',
        ],
      },
      related: [
        {
          label: 'Da immagine a PDF',
          to: '/tools/image-to-pdf',
          description: 'Nella direzione opposta: racchiudi un\'immagine in una pagina PDF.',
        },
        {
          label: 'Comprimi immagine',
          to: '/tools/compress-image',
          description: 'Riduci i JPG renderizzati per il web.',
        },
        {
          label: 'Ridimensiona immagine',
          to: '/tools/image-resizer',
          description: 'Scala una pagina renderizzata alla dimensione di una miniatura o di un banner.',
        },
        {
          label: 'Scansione documenti con IA',
          to: '/tools/ai-document-scan',
          description: 'Applica l\'OCR e ripulisci una pagina fotografata.',
        },
        {
          label: 'Oscura il testo in un\'immagine',
          to: '/tools/redact-text-in-image',
          description: 'Copri di nero nomi o numeri su una pagina renderizzata.',
        },
      ],
      embed: {
        title: 'Converti PDF in JPG',
        description: 'Carica un PDF. Ogni pagina viene convertita in un\'immagine JPG. Scegli «tutte le pagine» per uno ZIP di immagini, oppure «solo la prima pagina» per un singolo JPG. Scegli i DPI di rendering per un output più nitido.',
      },
    },
    'compress-video': {
      name: 'Comprimi video',
      h1: 'Comprimi video online senza rovinare la qualità',
      tagline: 'Riduci il peso di file MP4, WebM, MOV, MKV e AVI per web, e-mail, social e caricamenti nel cloud.',
      metaTitle: 'Comprimi video online (gratis) | Media Manipulator',
      metaDescription: 'Compressore video online gratuito. Riduci il peso di file MP4, WebM, MOV, MKV e AVI mantenendo una buona qualità. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Comprimi video online senza rovinare la qualità',
      ogDescription: 'Riduci file video MP4, WebM, MOV e AVI per il web senza perdere una qualità guardabile.',
      intro: 'Un file video è grande per via del suo bitrate: quanti bit l\'encoder ha speso per ogni secondo di filmato. Telefoni e registratori dello schermo spendono con generosità, ed è per questo che una breve clip 1080p può arrivare a decine o centinaia di megabyte. Questa pagina apre un compressore a tre controlli invece del convertitore completo: un livello di compressione, un contenitore di output e, facoltativamente, una risoluzione e un codec. Sul nostro server il lavoro è un solo comando FFmpeg che ricodifica l\'immagine a un\'impostazione di qualità costante (CRF) scelta dal livello, ricodifica l\'audio in AAC o Opus e scrive il risultato con l\'indice all\'inizio del file, così comincia a riprodursi prima di essere stato scaricato del tutto.',
      whatItDoes: [
        'Ricodifica il video a un livello di qualità fisso invece che a un bitrate fisso: File più piccolo è CRF 31, Bilanciato è CRF 26 e Alta qualità è CRF 22.',
        'Produce MP4 (H.264 per impostazione predefinita, oppure H.265/HEVC se lo scegli) o WebM (VP9 con audio Opus).',
        'Facoltativamente riduce l\'immagine a 1080p, 720p o 480p nello stesso passaggio mantenendo le proporzioni.',
        'Facoltativamente elimina del tutto la traccia audio per il file più piccolo possibile.',
        'Accetta caricamenti MP4, MOV, M4V, WebM, MKV, AVI, FLV, WMV, MPEG e MPG; la pagina del convertitore completo gestisce ProRes e gli altri formati per il montaggio.',
      ],
      flowSteps: [
        {
          title: 'Carica il video',
          description: 'Il browser mette il file direttamente nel nostro bucket di archiviazione, poi chiede all\'API di avviare il lavoro.',
        },
        {
          title: 'Scegli un livello',
          description: 'Bilanciato è preselezionato. File più piccolo sacrifica dettagli visibili in cambio della dimensione; Alta qualità ne conserva di più.',
        },
        {
          title: 'Facoltativamente cambia formato, risoluzione o codec',
          description: 'MP4 con H.264 si riproduce ovunque; H.265 e WebM sono più piccoli sui dispositivi che li decodificano.',
        },
        {
          title: 'FFmpeg ricodifica',
          description: 'libx264, libx265 o libvpx-vp9 con il CRF del tuo livello, più audio AAC o Opus e faststart per MP4.',
        },
        {
          title: 'Scarica il file più piccolo',
          description: 'Il risultato resta nella cartella del lavoro finché non termina la sua finestra di conservazione.',
        },
      ],
      advancedDetails: [
        'Il comando esatto per MP4 è ffmpeg -i input [-vf scale=-1:H] -c:v libx264 -crf N -pix_fmt yuv420p -movflags +faststart -c:a aac output.mp4, dove N è 31, 26 o 22 per i tre livelli (buildVideoCodecArgs e videoCRF in converter.go). Non viene passato alcun preset di velocità dell\'encoder, quindi libx264 gira al suo valore predefinito, medium.',
        'Scegliere H.265 sostituisce l\'encoder con libx265 e aggiunge -tag:v hvc1, il tag di cui QuickTime e Safari hanno bisogno per riconoscere HEVC dentro un MP4. I telefoni Android più vecchi, le smart TV e molti lettori web non riescono affatto a decodificare H.265.',
        'L\'output WebM esegue libvpx-vp9 con -b:v 0 -crf N e audio Opus; se la build FFmpeg del server non avesse VP9 o Opus, ricadrebbe su VP8 e Vorbis. Viene passato lo stesso N, ma VP9 legge il CRF su una scala da 0 a 63, quindi 26 è lì un\'impostazione di qualità relativamente alta.',
        'Una scelta di risoluzione diventa scale=-1:1080, scale=-1:720 o scale=-1:480: altezza fissa, larghezza calcolata dalle proporzioni della sorgente. L\'altezza viene applicata così com\'è, quindi scegliere 1080p per una sorgente 720p la ingrandisce e rende il file più grande, non più piccolo; scegli un\'altezza pari o inferiore alla sorgente.',
        'Rimuovi la traccia audio aggiunge -an. Altrimenti l\'audio viene ricodificato dall\'encoder AAC nativo di FFmpeg al suo bitrate predefinito (non viene passato -b:a; per lo stereo è tipicamente circa 128 kbps), che è una piccola frazione del file a qualsiasi livello.',
        'La compressione è guidata dal CRF, quindi la dimensione di output segue il contenuto: le diapositive statiche si comprimono molto più dei coriandoli o dell\'acqua. Il server convalida il CRF tra 0 e 51 e il livello di compressione a uno dei tre nomi prima che inizi qualsiasi codifica.',
        'Il caricamento viene anche messo in coda per l\'analisi automatica dei contenuti che ogni conversione standard riceve: i fotogrammi vengono campionati e descritti da un modello di visione locale e l\'audio viene trascritto sul nostro hardware. Il risultato dell\'analisi viene conservato con il lavoro, non condiviso.',
      ],
      whyItMatters: [
        'App di chat, server di posta e piattaforme di e-learning impongono limiti in megabyte, e una clip da telefono al suo bitrate nativo li sfonda.',
        'Una pagina che riproduce in automatico un video di sfondo da 60 MB si blocca sulle connessioni mobili; la stessa clip a CRF 26 è una frazione di quello.',
        'Le bollette di archiviazione e banda crescono con i byte, quindi tenere copie compresse degli originali che apri raramente fa presto la differenza.',
      ],
      useCases: [
        {
          title: 'E-mail e chat',
          description: 'Porta una registrazione da telefono di 1 minuto sotto un limite di 25 MB o 100 MB senza un link di condivisione separato.',
        },
        {
          title: 'Hero e loop di sfondo per siti web',
          description: 'Codifica un WebM o un MP4 H.264 che una pagina può riprodurre in automatico senza un lungo buffering.',
        },
        {
          title: 'Registrazioni di corsi e riunioni',
          description: 'Riduci le registrazioni dello schermo, le cui diapositive statiche si comprimono benissimo a qualsiasi CRF.',
        },
        {
          title: 'Copie di archivio',
          description: 'Tieni una copia Bilanciato a 720p degli originali lunghi e sposta il master nell\'archiviazione a freddo.',
        },
      ],
      workedExamples: [
        {
          title: 'Una clip da telefono 1080p di 48 MB e 30 secondi con Bilanciato',
          body: 'Input: un MP4 di 30 secondi da un telefono, 1920 x 1080, 48 MB, che corrisponde a circa 12,8 Mbps. Impostazioni: Bilanciato, MP4, H.264, risoluzione mantenuta, audio mantenuto. Il server esegue libx264 a CRF 26 con yuv420p e faststart, e ricodifica l\'audio in AAC a 128 kbps, quindi la sola traccia sonora è circa 0,5 MB del risultato (128 kbps x 30 s). Tutto il resto lo decide l\'immagine: CRF 26 sacrifica prima la grana fine e il rumore, quindi una ripresa a mano ferma esce come una piccola frazione della sorgente a 12,8 Mbps, mentre azione veloce o forte rumore della fotocamera si riducono meno. La codifica è un singolo passaggio su 900 fotogrammi 1080p con il preset predefinito medium; sul nostro server è un lavoro breve, e il caricamento dei 48 MB di solito è la parte più lunga dell\'attesa.',
        },
        {
          title: 'Una clip 4K di 160 MB e 60 secondi a 720p H.265 con File più piccolo',
          body: 'Input: un MP4 3840 x 2160 di 60 secondi da 160 MB, circa 21 Mbps, entro il limite ospite di 200 MB. Impostazioni: File più piccolo, MP4, codec H.265, risoluzione 720p, audio rimosso. FFmpeg applica scale=-1:720, che produce 1280 x 720: 0,92 megapixel per fotogramma contro 8,3 della sorgente, circa un nono dei pixel prima che il codec faccia qualsiasi cosa. Poi libx265 gira a CRF 31 con -tag:v hvc1 e -an elimina l\'audio. La combinazione di nove volte meno pixel, un codec più efficiente e un CRF alto è da dove arrivano le riduzioni maggiori, quindi aspettati un risultato misurato in pochi megabyte anziché in decine. Il tempo è dominato dalla decodifica dei fotogrammi 4K e da libx265, che è sensibilmente più lento di libx264 allo stesso preset, quindi questo lavoro richiede più tempo dell\'esempio 1080p anche se l\'output è più piccolo.',
        },
      ],
      whenNotToUse: 'Non comprimere un file che intendi ancora montare o correggere nel colore; ogni ricodifica perde dettagli, e un editor vuole l\'originale o un intermedio ProRes dal convertitore completo. Non usarlo per far riprodurre una clip su un dispositivo particolare se il problema è il contenitore e non la dimensione; il convertitore video cambia formato senza abbassare la qualità. Se il tuo unico obiettivo è tagliare una sezione, lo strumento di taglio copia i flussi senza ricodificare ed è sia più veloce sia senza perdita. E se il file è grande perché è lungo, la compressione aiuta meno di quanto speri; una registrazione di 20 minuti a CRF 26 è ancora una registrazione di 20 minuti.',
      whyMediaManipulator: [
        'Il CRF dietro ogni livello è scritto in questa pagina, così puoi prevedere cosa farà File più piccolo a un filmato dettagliato prima di aspettarlo.',
        'H.265 in MP4 riceve il tag hvc1 richiesto dai lettori Apple, che molti compressori online dimenticano.',
        'La codifica gira sui nostri server con FFmpeg; nulla viene consegnato a un servizio di elaborazione esterno e non viene aggiunta alcuna filigrana.',
        'Una compressione conta come un\'operazione della tua quota giornaliera: 5 al giorno senza account per impostazione predefinita, 30 con un account gratuito. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      ],
      privacyNote: 'Il compressore ricodifica il tuo video sui nostri server con FFmpeg. Il caricamento viene salvato in uploads/<jobId>/ e il file compresso in outputs/<jobId>/; entrambi sono nel registro di conservazione e vengono eliminati quando termina la finestra. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Poiché si tratta di una conversione standard, il caricamento passa anche attraverso la nostra analisi automatica dei contenuti sullo stesso hardware (fotogrammi campionati descritti da un modello di visione locale, audio trascritto localmente); quel report viene conservato con il lavoro e non viene condiviso con terze parti. I metadati del contenitore vengono mantenuti a meno che tu non scelga di rimuoverli; nulla viene inviato a un fornitore esterno di IA o di elaborazione.',
      faq: [
        {
          question: 'Comprimere peggiorerà l\'aspetto del mio video?',
          answer: 'Un po\' di dettaglio si perde sempre in una ricodifica. Con Alta qualità (CRF 22) e Bilanciato (CRF 26) la perdita riguarda soprattutto grana fine e rumore che la maggior parte degli spettatori non nota; con File più piccolo (CRF 31) puoi vedere un ammorbidimento sui filmati dettagliati. Mantenere la risoluzione evita la sfocatura aggiunta dal ridimensionamento.',
        },
        {
          question: 'Dovrei scegliere H.264, H.265 o WebM?',
          answer: 'MP4 H.264 si riproduce su tutto, compresi vecchi televisori e portatili aziendali. H.265 dà un file più piccolo allo stesso CRF ma richiede un dispositivo che decodifichi HEVC; lo marchiamo hvc1 così i lettori Apple lo accettano. WebM (VP9 e Opus) è la scelta per le pagine web in cui controlli il lettore.',
        },
        {
          question: 'Di quanto sarà più piccolo il file?',
          answer: 'Dipende dal bitrate della sorgente e dal contenuto. Una clip da telefono a 12 Mbps ha molto margine e si riduce drasticamente a CRF 26; un file già codificato a un bitrate modesto si riduce poco, perché il CRF spende quanto l\'immagine richiede. Scendere a 720p e rimuovere l\'audio aiuta sempre.',
        },
        {
          question: 'Il compressore aggiunge una filigrana o cambia il frame rate?',
          answer: 'No. Frame rate, durata e proporzioni vengono preservati, e nulla viene disegnato sull\'immagine. Cambiano solo il codec, il CRF, l\'altezza facoltativa e la rimozione facoltativa dell\'audio.',
        },
        {
          question: 'Comprimere un video è gratuito, e quali sono i limiti?',
          answer: 'Per impostazione predefinita un ospite ha 5 operazioni al giorno con file fino a 200 MB e 5 minuti di video, output fino a 1080p; un account gratuito porta il limite a 30 al giorno, 1 GB e 20 minuti. Una compressione che fallisce viene rimborsata. I numeri attuali sono nella pagina dei prezzi.',
        },
        {
          question: 'Perché l\'output non è più piccolo dell\'originale?',
          answer: 'Probabilmente la sorgente era già compressa in modo efficiente, oppure è a un bitrate basso per la sua risoluzione. Il CRF non può scendere sotto ciò che l\'immagine richiede senza un livello più basso. Prova File più piccolo, oppure abbassa la risoluzione, oppure passa a H.265.',
        },
        {
          question: 'Posso comprimere un video senza audio o mantenere l\'audio originale intatto?',
          answer: 'Una sorgente muta resta muta. L\'audio di una traccia mantenuta viene sempre ricodificato in AAC (MP4) o Opus (WebM) da questa pagina; il convertitore video completo è dove imposti un bitrate audio esplicito.',
        },
      ],
      related: [
        {
          label: 'Taglia video',
          to: '/tools/video-trimmer',
          description: 'Taglia prima la clip; il compressore avrà poi meno da codificare.',
        },
        {
          label: 'Converti video in GIF animata',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Per clip di pochi secondi, la GIF è il formato che si riproduce in linea.',
        },
        {
          label: 'Transcodifica in HLS',
          to: '/tools/transcode-to-hls',
          description: 'Confeziona un video come flusso adattivo invece che come file unico.',
        },
        {
          label: 'Estrai l\'audio da un video',
          to: '/tools/extract-audio-from-video',
          description: 'Conserva solo la traccia sonora come MP3, WAV o FLAC.',
        },
        {
          label: 'Trascrivi video',
          to: '/tools/transcribe-video',
          description: 'Ottieni il parlato come testo prima o dopo la compressione.',
        },
        {
          label: 'Tutorial del convertitore video',
          to: '/tutorials/video/getting-started',
          description: 'Guida passo dopo passo a ogni opzione video.',
        },
      ],
      embed: {
        title: 'Comprimi un video',
        description: 'Carica un video e scegli un preset di qualità più basso o un bitrate inferiore. Mantieni lo stesso codec per il risultato più rapido, oppure passa a WebM/H.265 per file più piccoli sui dispositivi moderni. Mantenere la stessa risoluzione dà il risultato dall\'aspetto più naturale.',
      },
    },
    'video-trimmer': {
      name: 'Taglia video',
      h1: 'Taglia video online gratis',
      tagline: 'Taglia una clip per tenere solo la parte che vuoi, con un taglio veloce che preserva la qualità, senza ricodifica quando possibile.',
      metaTitle: 'Taglia video online gratis | Media Manipulator',
      metaDescription: 'Strumento online gratuito per tagliare i video. Imposta un orario di inizio e di fine e taglia la clip in modo rapido e senza perdita. Output MP4, senza filigrana né registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Taglia video online gratis',
      ogDescription: 'Taglia i video alla parte che vuoi con un taglio rapido che preserva la qualità. Gratis, senza filigrana.',
      intro: 'Tagliare significa tenere un tratto di un video e scartare il resto. La maggior parte degli strumenti online ricodifica l\'intera clip per farlo, il che è lento e costa qualità. Questa pagina fa qualcosa di più semplice per impostazione predefinita: chiede a FFmpeg di posizionarsi sul tuo tempo di inizio e di copiare i pacchetti video e audio compressi in un nuovo file per la durata richiesta, senza decodificarli. È una copia dei flussi, è senza perdita e gira più o meno alla velocità con cui il file può essere letto. Se la copia non può funzionare, perché il codec di origine non è ammesso nel contenitore che hai scelto o perché hai spuntato l\'opzione di precisione al fotogramma, il server ricodifica solo il tratto selezionato.',
      whatItDoes: [
        'Taglia un singolo intervallo da un video, da un tempo di inizio a un tempo di fine, digitato in secondi o scelto su una timeline visiva.',
        'Copia i flussi senza ricodificare ogni volta che il contenitore di output accetta i codec di origine, così la parte conservata è l\'originale bit per bit.',
        'Ripiega automaticamente su una ricodifica quando la copia viene rifiutata, e ti permette di forzare una ricodifica per un taglio sul fotogramma esatto.',
        'Scrive MP4 per impostazione predefinita, oppure MOV o WebM; MP4 e MOV ricevono il flag faststart così la riproduzione parte prima che il download finisca.',
        'Verifica con ffprobe che il file abbia davvero un flusso video e rifiuta i caricamenti solo audio con un messaggio chiaro.',
      ],
      flowSteps: [
        {
          title: 'Carica il video',
          description: 'MP4, MOV, M4V, WebM, MKV, AVI, FLV, WMV, MPEG o MPG, caricato direttamente nel nostro bucket di archiviazione.',
        },
        {
          title: 'Imposta inizio e fine',
          description: 'Digita i secondi o trascina le due maniglie; il pannello mostra la durata risultante della clip.',
        },
        {
          title: 'Scegli un contenitore e, se serve, la precisione al fotogramma',
          description: 'MP4 è preimpostato. Spunta Ricodifica per un taglio preciso al fotogramma solo quando il fotogramma esatto conta.',
        },
        {
          title: 'FFmpeg taglia',
          description: 'Una copia dei flussi con -ss, -t e -c copy; oppure una ricodifica libx264 CRF 18 quando copiare è impossibile o l\'hai richiesta tu.',
        },
        {
          title: 'Scarica la clip',
          description: 'L\'output porta il suffisso _trimmed e resta nella cartella del lavoro fino alla fine del suo periodo di conservazione.',
        },
      ],
      advancedDetails: [
        'Il comando di copia dei flussi è ffmpeg -ss START -i input -t DURATION -map 0 -c copy -avoid_negative_ts make_zero [-movflags +faststart] output (runTrimVideo in specialized_tools.go). -map 0 mantiene ogni flusso, comprese le tracce audio aggiuntive e i sottotitoli, e i tempi sono scritti con precisione al millisecondo.',
        'Con -ss prima di -i e senza decodifica, FFmpeg può iniziare solo a un fotogramma chiave, quindi la copia parte dal fotogramma chiave più vicino uguale o precedente al tuo tempo di inizio. In una registrazione da telefono i fotogrammi chiave distano in genere da 1 a 2 secondi, che è il massimo di cui l\'inizio può spostarsi; -avoid_negative_ts make_zero riallinea poi i timestamp così i lettori partono in modo pulito.',
        'Il percorso di ricodifica usa buildVideoCodecArgs all\'impostazione di qualità alta: libx264 -crf 18 -pix_fmt yuv420p con AAC per MP4 e MOV, oppure libvpx-vp9 -b:v 0 -crf 18 con Opus per WebM. Vengono mappati solo il primo flusso video e il primo flusso audio (se presente), quindi su questo percorso le tracce aggiuntive vengono scartate.',
        'La modalità di copia viene inviata come auto, che tenta la copia e ricodifica in caso di errore. Scegliere WebM per una sorgente H.264 finisce sempre sul percorso di ricodifica, perché il WebM accetta solo video VP8, VP9 e AV1.',
        'Validazione sul server: l\'inizio deve essere 0 o successivo, la clip deve durare almeno 0.1 secondi e al massimo 6 ore, e la fine deve venire dopo l\'inizio. Tutto il resto viene rifiutato prima che FFmpeg parta e l\'operazione viene rimborsata.',
        'Poiché il taglio è una modalità specializzata, il caricamento salta l\'analisi automatica dei contenuti che ricevono le conversioni standard; il server esegue solo ffprobe e il taglio.',
      ],
      whyItMatters: [
        'Il silenzio all\'inizio e uno stop impacciato alla fine ci sono in quasi ogni registrazione, e rimuoverli è la modifica più comune in assoluto.',
        'Un taglio senza perdita significa che puoi tagliare un file master senza creare una copia di seconda generazione.',
        'Tagliare prima rende più economico ogni passaggio successivo: comprimere, sottotitolare o trasformare la clip in GIF deve toccare solo la parte che hai conservato.',
      ],
      useCases: [
        {
          title: 'Registrazioni di riunioni e lezioni',
          description: 'Elimina i minuti in cui le persone si collegano prima che il contenuto inizi.',
        },
        {
          title: 'Momenti salienti per i post social',
          description: 'Tieni i 20 secondi che contano e carica solo quelli.',
        },
        {
          title: 'Prove e segnalazioni di bug',
          description: 'Condividi esattamente il momento in cui si è verificato un problema, con la qualità originale intatta.',
        },
        {
          title: 'Preparare una GIF o uno spezzone da restaurare',
          description: 'Taglia a pochi secondi prima di passare la clip a uno strumento che lavora meglio su input brevi.',
        },
      ],
      workedExamples: [
        {
          title: 'Un taglio in copia dei flussi di 30 secondi da un MP4 1080p di 180 MB e 4.5 minuti',
          body: 'Input: un MP4 H.264 1920 x 1080 di 4 minuti e 30 secondi e 180 MB, circa 5.3 Mbps, che rientra nei limiti predefiniti per gli ospiti di 200 MB e 5 minuti. Impostazioni: inizio 45.000, fine 75.000, output MP4, ricodifica non spuntata. Il server esegue il comando di copia con -ss 45.000 e -t 30.000. Poiché i pacchetti vengono copiati, l\'output contiene circa 30 dei 270 secondi di dati, circa 20 MB, esattamente con qualità, codec e frequenza dei fotogrammi originali. Il taglio inizia all\'ultimo fotogramma chiave prima di 45 s, quindi la clip può aprirsi fino a uno o due secondi prima. Il lavoro è limitato dalla lettura del file, non dal calcolo, e finisce in pochi secondi.',
        },
        {
          title: 'Un taglio preciso al fotogramma di 12 secondi da un MP4 1080p di 60 MB',
          body: 'Input: un MP4 1920 x 1080 di 2 minuti e 60 MB. Impostazioni: inizio 30.250, fine 42.250, output MP4, Ricodifica per un taglio preciso al fotogramma spuntata. FFmpeg ora decodifica esattamente da 30.250, codifica 12 secondi (360 fotogrammi a 30 fps) con libx264 a CRF 18, yuv420p e faststart, e ricodifica l\'audio in AAC. CRF 18 mantiene l\'immagine visivamente molto vicina alla sorgente, quindi il risultato ha lo stesso ordine di grandezza di peso al secondo della sorgente, pochi megabyte per 12 secondi. Vengono codificati solo i 12 secondi conservati, mai i 2 minuti interi, quindi è una codifica breve anziché una copia di pochi secondi.',
        },
      ],
      whenNotToUse: 'Non usare il taglia video per rimuovere più sezioni separate da un unico video; mantiene esattamente un intervallo, quindi un taglio centrale richiede due tagli e un\'unione in Darkroom. Non aspettarti che una copia dei flussi cada sul fotogramma esatto; se un taglio anticipato di un secondo conta, spunta l\'opzione di ricodifica e accetta una breve codifica. Se il tuo vero obiettivo è un file più piccolo, il taglio aiuta solo nella misura in cui tagli; è il compressore a cambiare il bitrate. E se il caricamento non ha un flusso video, per esempio un M4A rinominato in MP4, il taglia video lo rifiuta; i file solo audio sono gestiti dagli strumenti audio.',
      whyMediaManipulator: [
        'La copia dei flussi senza perdita è l\'impostazione predefinita, con il ripiego sulla ricodifica messo per iscritto anziché nascosto dietro una ricodifica di tutto, lenta ma sicura.',
        'I flag FFmpeg esatti sono su questa pagina, incluso il motivo per cui un taglio può iniziare al fotogramma chiave precedente e come evitarlo.',
        'Un taglio consuma un\'operazione della tua quota giornaliera (5 al giorno come ospite per impostazione predefinita, 30 con un account gratuito), e un lavoro non riuscito viene rimborsato. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ],
      privacyNote: 'Il taglia video esegue ffprobe e un solo comando FFmpeg sui nostri server. Nel percorso predefinito i pacchetti video e audio vengono copiati, mai decodificati, quindi il server non ricostruisce una sola immagine dal tuo file; nel percorso di ricodifica FFmpeg decodifica solo i secondi che hai conservato. Il caricamento risiede in uploads/<jobId>/ e la clip in outputs/<jobId>/, entrambi registrati nel registro di conservazione ed eliminati alla fine del periodo. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Il taglio è una modalità specializzata, quindi l\'analisi automatica dei contenuti che ricevono le conversioni standard non viene eseguita su questo caricamento, e nulla viene inviato a un servizio di terze parti.',
      faq: [
        {
          question: 'Il taglio ricodifica il mio video?',
          answer: 'Non per impostazione predefinita. Il server copia i flussi compressi con -c copy, così la parte conservata è identica all\'originale. Ricodifica solo quando spunti l\'opzione di precisione al fotogramma o quando il contenitore che hai scelto non può contenere il codec di origine, come nel caso del WebM per un file H.264.',
        },
        {
          question: 'Perché la mia clip inizia un attimo prima del tempo che ho digitato?',
          answer: 'Una copia dei flussi può iniziare solo a un fotogramma chiave, e FFmpeg sceglie il più vicino uguale o precedente al tuo tempo di inizio. Nelle riprese da fotocamera i fotogrammi chiave distano di solito da 1 a 2 secondi. Spunta Ricodifica per un taglio preciso al fotogramma per iniziare sul fotogramma esatto.',
        },
        {
          question: 'Quali contenitori di output posso scegliere, e quali mantengono la qualità originale?',
          answer: 'MP4, MOV e WebM. MP4 e MOV accettano il video H.264 o HEVC e l\'audio AAC che la maggior parte delle fotocamere produce, quindi restano senza perdita. Il WebM accetta solo VP8, VP9 e AV1, quindi con questa scelta una sorgente H.264 viene ricodificata in VP9 a CRF 18.',
        },
        {
          question: 'Quanto può essere lunga o corta la clip tagliata?',
          answer: 'Almeno 0.1 secondi e al massimo 6 ore, con la fine dopo l\'inizio. In pratica sono i limiti di caricamento a contare per primi: per impostazione predefinita 5 minuti di video per un ospite, 20 minuti con un account gratuito, 2 ore con Premium.',
        },
        {
          question: 'Mantiene tutte le tracce audio e i sottotitoli?',
          answer: 'Nel percorso di copia dei flussi sì: -map 0 copia ogni flusso del file. Nel percorso di ricodifica vengono mantenuti solo il primo flusso video e il primo flusso audio.',
        },
        {
          question: 'Posso tagliare un video in più parti in una volta?',
          answer: 'No. Un caricamento produce una clip da un intervallo. Per più pezzi, esegui il taglia video una volta per intervallo, oppure assembla le parti su una timeline in Darkroom.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Copia dei flussi quando possibile (nessuna perdita di qualità); il ripiego sulla ricodifica usa H.264 + AAC per l\'MP4.',
        ],
      },
      related: [
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso della clip dopo averla tagliata.',
        },
        {
          label: 'Converti video in GIF animata',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Trasforma i secondi tagliati in una GIF.',
        },
        {
          label: 'Estrai l\'audio da un video',
          to: '/tools/extract-audio-from-video',
          description: 'Salva solo il suono della clip.',
        },
        {
          label: 'Restauro video con IA',
          to: '/tools/ai-video-restoration',
          description: 'Il restauro lavora su spezzoni di 15 secondi o meno; taglia prima.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Unisci più pezzi tagliati in un unico montaggio.',
        },
      ],
      embed: {
        title: 'Taglia un video',
        description: 'Carica un video, poi imposta un tempo di inizio e di fine (o scegli l\'intervallo visivamente). Quando possibile manteniamo la qualità originale con un taglio rapido e senza perdita.',
      },
    },
    'extract-audio-from-video': {
      name: 'Estrai l\'audio da un video',
      h1: 'Estrai l\'audio da un video',
      tagline: 'Salva la traccia audio di qualsiasi video come file MP3, WAV, M4A, AAC, FLAC o OGG pulito.',
      metaTitle: 'Estrai l\'audio da un video: MP3, WAV, M4A e altro | Media Manipulator',
      metaDescription: 'Strumento online gratuito per estrarre l\'audio da qualsiasi file video (MP4, MOV, MKV, WebM, AVI). Output in MP3, WAV, M4A, AAC, FLAC oppure OGG. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Estrai l\'audio da un video',
      ogDescription: 'Salva le tracce audio di MP4/MOV/MKV/WebM/AVI come MP3, WAV, M4A, AAC, FLAC o OGG. Gratis, senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      intro: 'Ogni contenitore video trasporta l\'audio come flusso separato, quindi tirare fuori il suono non coinvolge affatto l\'immagine. Questa pagina chiede a FFmpeg di selezionare il primo flusso audio, ignorare il video e codificare quel flusso nel formato che scegli: MP3 per tutto ciò che riproduce musica, WAV o FLAC quando vuoi i campioni intatti, M4A o AAC per un file compatto che i telefoni gestiscono nativamente, oppure OGG Vorbis. Prima di iniziare, il server verifica con ffprobe che esista un flusso audio, perché altrimenti FFmpeg scriverebbe un file vuoto senza lamentarsi.',
      whatItDoes: [
        'Seleziona il primo flusso audio (-map 0:a:0) da MP4, MOV, M4V, WebM, MKV, AVI e dagli altri contenitori video comuni e scarta il video (-vn).',
        'Codifica l\'MP3 con libmp3lame a qualità 2 (bitrate variabile con una media di circa 190 kbps), il WAV come PCM a 16 bit, M4A o AAC a 192 kbps, il FLAC senza perdita, oppure l\'OGG con libvorbis a qualità 5.',
        'Mantiene la frequenza di campionamento e il numero di canali originali; nulla viene ricampionato o mixato.',
        'Rifiuta subito un video senza flusso audio con il messaggio che non c\'è nulla da estrarre.',
        'Restituisce un unico file audio con il nome dell\'originale e l\'estensione scelta.',
      ],
      flowSteps: [
        {
          title: 'Carica il video',
          description: 'Qualsiasi contenitore comune; il file va direttamente nel nostro bucket di archiviazione e l\'API lo prende in carico.',
        },
        {
          title: 'Scegli il formato audio',
          description: 'MP3 è preimpostato. WAV e FLAC sono senza perdita; M4A e AAC sono compatti; OGG è l\'opzione lossy aperta.',
        },
        {
          title: 'ffprobe conferma che esiste un flusso audio',
          description: 'Un video muto si ferma qui con un errore chiaro invece di produrre un file vuoto.',
        },
        {
          title: 'FFmpeg codifica il flusso',
          description: 'Un solo comando con -map 0:a:0 -vn e l\'encoder per il tuo formato.',
        },
        {
          title: 'Scarica l\'audio',
          description: 'Il file resta nella cartella del lavoro fino alla fine del suo periodo di conservazione.',
        },
      ],
      advancedDetails: [
        'Il comando è ffmpeg -y -i input -map 0:a:0 -vn <encoder args> output (runExtractAudio in specialized_tools.go). -vn significa che il flusso video non viene mai decodificato, ed è per questo che l\'estrazione è veloce anche su sorgenti 4K.',
        'L\'MP3 usa -c:a libmp3lame -q:a 2, l\'impostazione a bitrate variabile LAME V2, che in media si attesta intorno ai 190 kbps sulla musica e meno sul parlato. Il WAV usa -c:a pcm_s16le, quindi una sorgente stereo a 44.1 kHz costa circa 10.1 MB al minuto e una sorgente a 48 kHz circa 11 MB al minuto.',
        'M4A e AAC usano entrambi l\'encoder AAC nativo di FFmpeg con -b:a 192k. Il FLAC è senza perdita e di solito si attesta tra il 50 e il 70 percento della dimensione del WAV. L\'OGG usa -c:a libvorbis -q:a 5, circa 160 kbps.',
        'Non viene passato alcun flag -ar o -ac, quindi l\'output mantiene la frequenza di campionamento e la disposizione dei canali della sorgente; il surround 5.1 resta 5.1 in WAV e FLAC, mentre l\'MP3 trasporterà al massimo due canali.',
        'Viene mappato solo il flusso 0:a:0. Un file con una traccia di commento o una seconda lingua mantiene la traccia elencata per prima nel contenitore.',
        'L\'estrazione è una modalità specializzata: il caricamento non viene messo in coda per l\'analisi automatica dei contenuti che ricevono le conversioni standard, e i controlli di qualità, ridimensionamento ed effetti del convertitore video non si applicano.',
      ],
      whyItMatters: [
        'Podcaster, trascrittori e montatori di solito hanno bisogno del suono senza i pixel, e il video è spesso da 20 a 50 volte più grande dell\'audio che contiene.',
        'Un MP3 o M4A con i tag corretti si riproduce su ogni telefono e in ogni lettore senza la decodifica video che scarica le batterie.',
        'L\'output WAV o FLAC senza perdita è l\'input giusto per la pulizia del rumore, la separazione della voce o una trascrizione accurata.',
      ],
      useCases: [
        {
          title: 'Episodi solo audio',
          description: 'Pubblica il sonoro di una videointervista registrata come MP3 per podcast.',
        },
        {
          title: 'Preparazione alla trascrizione',
          description: 'Passa a un trascrittore una registrazione di 18 minuti come MP3 da 25 MB invece che come MP4 da 540 MB.',
        },
        {
          title: 'Sound design e campionamento',
          description: 'Estrai un WAV da una clip per riutilizzare ambiente o musica in un altro montaggio.',
        },
        {
          title: 'Appunti di lezione',
          description: 'Conserva l\'audio della registrazione di una lezione per ascoltarlo in movimento.',
        },
      ],
      workedExamples: [
        {
          title: 'Una registrazione 720p di 18 minuti e 540 MB in MP3',
          body: 'Input: un MP4 1280 x 720 di 18 minuti e 540 MB (circa 4 Mbps), caricato con un account gratuito perché supera i limiti predefiniti per gli ospiti di 200 MB e 5 minuti. Impostazioni: MP3. Il server conferma con ffprobe la traccia AAC stereo a 48 kHz ed esegue libmp3lame -q:a 2. A circa 190 kbps sono circa 1.4 MB al minuto, quindi il risultato arriva a circa 25 MB, circa un ventesimo del caricamento. Poiché -vn salta completamente il video, il lavoro è una semplice decodifica e codifica audio ed è rapido; caricare 540 MB richiede molto più tempo che estrarne l\'audio.',
        },
        {
          title: 'Un video musicale 1080p di 4 minuti e 95 MB in WAV',
          body: 'Input: un MP4 1920 x 1080 di 4 minuti e 95 MB con una traccia AAC stereo a 44.1 kHz, entro i limiti per gli ospiti. Impostazioni: WAV. FFmpeg decodifica l\'AAC una volta e scrive PCM a 16 bit con pcm_s16le, mantenendo 44.1 kHz e due canali. Il PCM a quella frequenza è 44.100 x 16 x 2 bit al secondo, circa 10.1 MB al minuto, quindi il file arriva a circa 40 MB indipendentemente da quanto la musica sia forte o densa. Scegliendo invece FLAC, gli stessi campioni verrebbero compressi senza perdita a circa 20-28 MB a seconda del materiale. Il tempo è quello di pochi secondi di decodifica audio; il video non viene mai toccato.',
        },
      ],
      whenNotToUse: 'Non usare questa pagina per migliorare il suono: copia ciò che c\'è, e una registrazione rumorosa o lontana resta rumorosa. Gli strumenti Pulisci l\'audio della voce e Rimuovi il rumore di fondo sono fatti per quello. Non aspettarti che un WAV recuperi la qualità persa dal video; la traccia di origine è quasi sempre AAC lossy, quindi un WAV è una copia fedele di un segnale compresso, non un master da studio. Se il video ha due tracce in lingue diverse e ti serve la seconda, questo strumento prende solo la prima. E se quello che vuoi davvero sono le parole, il trascrittore legge l\'audio e ti restituisce direttamente testo e sottotitoli.',
      whyMediaManipulator: [
        'Le impostazioni dell\'encoder sono dichiarate: LAME V2 per l\'MP3, 192 kbps per l\'AAC, PCM a 16 bit per il WAV e la frequenza di campionamento originale ovunque.',
        'Un video muto viene intercettato da ffprobe prima che parta qualsiasi cosa, così non scarichi mai un file di lunghezza zero.',
        'Un\'estrazione è un\'operazione della tua quota giornaliera: 5 al giorno senza account per impostazione predefinita, 30 con un account gratuito; un lavoro rifiutato o non riuscito viene rimborsato. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ],
      privacyNote: 'L\'estrazione gira sui nostri server come un singolo comando FFmpeg che legge solo il primo flusso audio del tuo caricamento; i fotogrammi video non vengono mai decodificati. Il file caricato si trova in uploads/<jobId>/ e l\'audio in outputs/<jobId>/, entrambi registrati nel registro di conservazione e rimossi alla fine del periodo. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Poiché l\'estrazione è una modalità specializzata, il caricamento non passa dall\'analisi automatica dei contenuti che ricevono le conversioni standard; non viene trascritto né descritto, e nulla lascia il nostro hardware.',
      faq: [
        {
          question: 'In quali formati audio posso estrarre, e quali sono senza perdita?',
          answer: 'MP3, WAV, M4A, AAC, FLAC e OGG. WAV e FLAC sono copie senza perdita della traccia decodificata. MP3 (circa 190 kbps VBR), M4A e AAC (192 kbps) e OGG (qualità 5) sono lossy ma superiori al bitrate della maggior parte delle tracce audio dei video.',
        },
        {
          question: 'Quanto sarà grande l\'audio estratto?',
          answer: 'Il WAV è circa 10.1 MB al minuto a 44.1 kHz stereo, oppure 11 MB a 48 kHz. L\'MP3 con l\'impostazione di questa pagina è circa 1.4 MB al minuto, M4A e AAC circa 1.4 MB al minuto a 192 kbps, l\'OGG circa 1.2 MB al minuto. Il FLAC di solito si attesta tra la metà e i due terzi della dimensione del WAV.',
        },
        {
          question: 'L\'estrazione cambia la frequenza di campionamento o l\'immagine stereo?',
          answer: 'No. FFmpeg viene eseguito senza -ar né -ac, quindi l\'output mantiene la frequenza di campionamento e la disposizione dei canali della sorgente. Una traccia stereo a 48 kHz resta stereo a 48 kHz.',
        },
        {
          question: 'Cosa succede se il mio video non ha audio?',
          answer: 'Il server analizza prima il file e si ferma con il messaggio che non c\'è nulla da estrarre. L\'operazione viene rimborsata e non viene prodotto alcun file vuoto.',
        },
        {
          question: 'Il mio video ha due tracce audio; quale ottengo?',
          answer: 'La prima nel contenitore, il flusso 0:a:0. Per ora non c\'è un selettore di tracce. Se quella che ti serve è la seconda, prima rimuxa o riesporta il video con quella traccia.',
        },
        {
          question: 'Estrarre l\'audio è gratis, e quanto può essere lungo il video che carico?',
          answer: 'Sì. Per impostazione predefinita un ospite può eseguire 5 operazioni al giorno su file fino a 200 MB e 5 minuti; un account gratuito consente 30 al giorno, 1 GB e 20 minuti; Premium arriva a 5 GB e 2 ore. I limiti attuali sono elencati nella pagina dei prezzi.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Estraiamo il primo flusso audio. I video senza alcun flusso audio restituiscono un errore chiaro invece di un file vuoto.',
        ],
      },
      related: [
        {
          label: 'Trascrivi video',
          to: '/tools/transcribe-video',
          description: 'Salta il file audio e ottieni direttamente le parole.',
        },
        {
          label: 'Pulisci l\'audio della voce',
          to: '/tools/clean-voice-audio',
          description: 'Riduci il rumore e livella il parlato estratto.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Togli ronzio e fruscio dalla traccia estratta.',
        },
        {
          label: 'Rimuovi la voce da una canzone',
          to: '/tools/remove-vocals-from-song',
          description: 'Trasforma la musica estratta in una base strumentale.',
        },
        {
          label: 'Taglia video',
          to: '/tools/video-trimmer',
          description: 'Taglia il video alla parte che ti interessa prima di estrarre.',
        },
      ],
      embed: {
        title: 'Estrai la traccia audio da un video',
        description: 'Carica qualsiasi contenitore video comune. Scegli MP3 per la massima compatibilità, WAV per l\'assenza di perdita o M4A/AAC per un file compresso compatto. I video senza traccia audio restituiscono un errore chiaro.',
      },
    },
    'convert-video-to-animated-gif': {
      name: 'Converti video in GIF animata',
      h1: 'Converti video in GIF animata online',
      tagline: 'Trasforma in pochi secondi brevi clip MP4, WebM, MOV o MKV in GIF animate facili da condividere.',
      metaTitle: 'Converti video in GIF animata online (gratis) | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da video a GIF. Trasforma brevi clip MP4, WebM, MOV e MKV in GIF animate, con controllo su dimensioni e frame rate.',
      ogTitle: 'Converti video in GIF animata online',
      ogDescription: 'Trasforma brevi clip video in GIF animate facili da condividere. Controlla frame rate, dimensioni e loop.',
      intro: 'Una GIF animata è una pila di fotogrammi a colori indicizzati, al massimo 256 colori per palette, senza compressione tra fotogrammi oltre a una semplice codifica run-length. Ecco perché una GIF di pochi secondi può pesare più di un MP4 di un minuto, e perché farne una buona dipende soprattutto dalla scelta di larghezza, frame rate e dimensione della palette. Questa pagina esegue una pipeline in due fasi: FFmpeg scala il video alla larghezza che imposti e lo campiona al tuo frame rate, scrivendo una GIF grezza, poi gifsicle riquantizza la palette al numero di colori scelto, imposta il ritardo tra fotogrammi e ottimizza i fotogrammi così da memorizzare solo i pixel cambiati. I valori predefiniti sono calibrati per le registrazioni dello schermo: 900 pixel di larghezza, 12 fotogrammi al secondo, 128 colori.',
      whatItDoes: [
        'Scala la clip a una larghezza scelta (da 16 a 2000 px) con l\'altezza calcolata dalle proporzioni e arrotondata a un multiplo di 4.',
        'Campiona la sorgente a un frame rate scelto (da 1 a 50 fps; 12 per impostazione predefinita) con FFmpeg.',
        'Quantizza ogni fotogramma a una palette da 2 a 256 colori (128 per impostazione predefinita) e ottimizza la memorizzazione tra fotogrammi con gifsicle al livello da 1 a 3.',
        'Imposta il ritardo tra fotogrammi in centesimi di secondo, che decide la velocità di riproduzione indipendentemente dalla frequenza di campionamento.',
        'Rispetta un intervallo di taglio dal modulo del convertitore, così solo i secondi selezionati diventano fotogrammi.',
      ],
      flowSteps: [
        {
          title: 'Carica un video e scegli GIF',
          description: 'GIF è già selezionato come output in questa pagina; il controllo Qualità è disabilitato perché non si applica.',
        },
        {
          title: 'Taglia a pochi secondi',
          description: 'Usa il controllo di taglio per tenere il momento che vuoi; ogni secondo in più sono 12 fotogrammi in più alla frequenza predefinita.',
        },
        {
          title: 'Imposta larghezza, frame rate, colori e ritardo',
          description: 'Il pannello Impostazioni GIF animata parte da 900 px, 12 fps, 128 colori, ritardo 3, ottimizzazione 3.',
        },
        {
          title: 'FFmpeg campiona, gifsicle ottimizza',
          description: 'ffmpeg scale=W:-4 -pix_fmt rgb8 -r FPS, poi gifsicle --optimize --delay --colors --interlace.',
        },
        {
          title: 'Scarica la GIF',
          description: 'Una GIF standard in loop che le app di chat e i browser riproducono in linea.',
        },
      ],
      advancedDetails: [
        'La prima fase è ffmpeg -i input [-ss START -t DURATION] -vf scale=W:-4 -pix_fmt rgb8 -r FPS -f gif raw.gif (convertVideoToGIF in converter.go). Il -4 chiede un\'altezza che mantenga le proporzioni e sia divisibile per 4; rgb8 è un intermedio indicizzato a 8 bit che la seconda fase riquantizza.',
        'La seconda fase è gifsicle --optimize=L --delay=D --colors C --interlace raw.gif -o output.gif. Il livello di ottimizzazione 3 è il più lento e il più compatto: memorizza solo il rettangolo di pixel cambiati tra un fotogramma e l\'altro, ed è per questo che uno screencast con una barra degli strumenti statica si comprime molto meglio di una panoramica di telecamera.',
        'Il ritardo viene applicato a ogni fotogramma dopo il campionamento ed è indipendente dalla frequenza di campionamento. Ai 12 fps e al ritardo 3 predefiniti (30 ms per fotogramma) una clip si riproduce circa 2,8 volte più veloce del tempo reale; imposta il ritardo a 8 (80 ms, 12,5 fps) per una riproduzione all\'incirca in tempo reale a 12 fps, oppure a 10 a 10 fps.',
        'Una larghezza digitata nel campo Larghezza principale del convertitore ha la precedenza sulla larghezza del pannello GIF, così gli utenti esperti possono usare un solo controllo. I colori vengono limitati dal modulo tra 2 e 256; una palette GIF non può mai superare 256.',
        'Qui non c\'è un passaggio palettegen in FFmpeg; la qualità della palette viene da gifsicle --colors, che costruisce un\'unica palette ottimizzata per l\'intera animazione. Le clip fotografiche con gradienti morbidi traggono beneficio da 256 colori; i filmati di interfacce piatte sono identici a 64.',
        'La fase gifsicle gira con un timeout di 6 ore, e il caricamento riceve anche l\'analisi automatica dei contenuti che le conversioni standard ricevono, dato che GIF è un formato del normale convertitore video.',
      ],
      whyItMatters: [
        'Le GIF si riproducono automaticamente in linea in issue tracker, app di chat, siti di documentazione e client di posta dove un allegato video mostrerebbe un pulsante di riproduzione o niente del tutto.',
        'Una GIF di 5 secondi di un bug lo riproduce più in fretta di un paragrafo e non ha bisogno di un lettore video.',
        'Le scelte di palette e frame rate cambiano la dimensione di un ordine di grandezza, quindi esporle è meglio di un preset unico per tutti.',
      ],
      useCases: [
        {
          title: 'Riproduzioni di bug',
          description: 'Registra lo schermo, taglia fino all\'errore e inserisci la GIF nel ticket.',
        },
        {
          title: 'Demo per README e documentazione',
          description: 'Mostra una funzione in movimento dove non è permesso incorporare un video.',
        },
        {
          title: 'Clip di reazione',
          description: 'Taglia 3 secondi da un video e condividili ovunque si accettino immagini.',
        },
        {
          title: 'Anteprime per e-mail',
          description: 'Una piccola GIF in loop che rimanda al video completo, dove il video stesso non si riprodurrebbe.',
        },
      ],
      workedExamples: [
        {
          title: 'Una registrazione dello schermo 1080p di 8 secondi con i valori predefiniti',
          body: 'Input: una registrazione dello schermo MP4 1920 x 1080 di 8 secondi da circa 15 MB. Impostazioni: GIF, larghezza 900, 12 fps, 128 colori, ritardo 3, ottimizzazione 3. FFmpeg scala a 900 pixel di larghezza per circa 506 di altezza (aggiustata a un multiplo di 4) e campiona 96 fotogrammi. Non compressi, quei 96 fotogrammi indicizzati sarebbero circa 43 MB (900 x 504 x 96 byte), che è il tetto da cui gifsicle parte per ridurre; con una barra degli strumenti statica e un cursore in movimento, l\'ottimizzazione di livello 3 memorizza solo i rettangoli che cambiano, quindi uno screencast finisce molto sotto quel limite, tipicamente in pochi megabyte. Con ritardo 3 i 96 fotogrammi si riproducono in circa 2,9 secondi, all\'incirca 2,8 volte più veloce della sorgente di 8 secondi; imposta il ritardo a 8 per riprodurli in circa 7,7 secondi. Il lavoro è una breve codifica più un passaggio di gifsicle su 96 fotogrammi.',
        },
        {
          title: 'Una clip di reazione di 5 secondi a 480 px, 10 fps e 64 colori',
          body: 'Input: un MP4 1080p di 20 secondi da 40 MB, tagliato nel modulo a un intervallo di 5 secondi. Impostazioni: GIF, larghezza 480, 10 fps, 64 colori, ritardo 10, ottimizzazione 3. FFmpeg taglia i 5 secondi, scala a 480 pixel di larghezza per circa 270 di altezza (arrotondata a un multiplo di 4) e campiona 50 fotogrammi. I dati grezzi dei fotogrammi sono circa 6,5 MB (480 x 268 x 50 byte) prima dell\'ottimizzazione, e una palette a 64 colori richiede solo 6 bit per pixel, quindi una ripresa di telecamera con movimento su tutto il fotogramma resterà comunque ben al di sotto, mentre un busto parlante fermo si comprime a una frazione di quel valore. Ritardo 10 significa 100 ms per fotogramma, quindi 50 fotogrammi si riproducono esattamente in 5 secondi, in tempo reale a 10 fps.',
        },
      ],
      whenNotToUse: 'Non fare una GIF di qualcosa più lungo di circa 10 secondi o con movimento fotografico su tutto il fotogramma; il formato non ha una vera compressione tra fotogrammi, quindi clip del genere diventano decine di megabyte mentre un MP4 o WebM della stessa cosa è un decimo della dimensione. Non usare GIF quando conta la fedeltà dei colori, perché ogni fotogramma è limitato a una palette di 256 colori e i gradienti mostrano bande. Se la destinazione riproduce video in linea, un MP4 compresso è migliore sotto ogni aspetto. E se ti serve l\'audio, una GIF non può proprio trasportarlo.',
      whyMediaManipulator: [
        'Entrambe le fasi della pipeline e i loro valori predefiniti sono documentati qui, compreso il comportamento del ritardo che fa riprodurre veloci le GIF predefinite.',
        'Larghezza, frame rate, numero di colori, ritardo e livello di ottimizzazione sono tutti esposti, non un singolo cursore di dimensione.',
        'Una conversione in GIF conta come un\'operazione (5 al giorno per gli ospiti per impostazione predefinita, 30 con un account gratuito), e un lavoro fallito viene rimborsato. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      ],
      privacyNote: 'La conversione in GIF gira sui nostri server: FFmpeg campiona e scala i fotogrammi, poi gifsicle li quantizza e li ottimizza; una GIF grezza temporanea viene eliminata appena gifsicle finisce. Il caricamento viene conservato in uploads/<jobId>/ e la GIF in outputs/<jobId>/, entrambi nel registro di conservazione ed eliminati quando termina la finestra. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. In quanto formato del convertitore video standard, il caricamento passa anche attraverso la nostra analisi automatica dei contenuti sullo stesso hardware (fotogrammi campionati descritti da un modello di visione locale, eventuale audio trascritto localmente); quel report resta con il lavoro e non viene condiviso con terze parti.',
      faq: [
        {
          question: 'Perché la mia GIF si riproduce più veloce del video originale?',
          answer: 'Il ritardo tra fotogrammi viene impostato dopo il campionamento ed è di 3 centesimi di secondo per impostazione predefinita, cioè circa 33 fotogrammi al secondo di riproduzione per fotogrammi campionati a 12 al secondo. Imposta il ritardo a 8 a 12 fps, oppure a 10 a 10 fps, per una riproduzione in tempo reale.',
        },
        {
          question: 'Come rendo la GIF più piccola?',
          answer: 'In ordine di efficacia: taglia a meno secondi, abbassa la larghezza (480 basta e avanza per le chat), abbassa il frame rate a 8 o 10 e riduci i colori a 64 sui filmati di interfacce piatte. Tieni l\'ottimizzazione a 3; i livelli 1 e 2 scambiano solo dimensione per velocità.',
        },
        {
          question: 'Quanti colori dovrei usare?',
          answer: '128, il predefinito, va bene per la maggior parte delle registrazioni dello schermo. Le interfacce piatte sono identiche a 64 e risparmiano byte. I filmati fotografici con gradienti vogliono 256, che è il massimo per le GIF.',
        },
        {
          question: 'Posso scegliere quale parte del video diventa la GIF?',
          answer: 'Sì. Usa il controllo di taglio nel convertitore per impostare un inizio e una fine; viene campionato solo quell\'intervallo. Più corto è meglio, perché ogni secondo aggiunge fotogrammi alla frequenza scelta.',
        },
        {
          question: 'La GIF andrà in loop, e mantiene il suono?',
          answer: 'Va in loop, come fanno le GIF per impostazione predefinita in ogni lettore. Non può trasportare l\'audio; il formato non ha una traccia sonora. Estrai l\'audio separatamente se ti serve.',
        },
        {
          question: 'Qual è la GIF più grande che posso creare?',
          answer: 'Il modulo consente fino a 2000 px di larghezza, 50 fps e 256 colori, ma una GIF con quelle impostazioni cresce enormemente in fretta. Il caricamento stesso è limitato dal tuo piano, 200 MB e 5 minuti di video per un ospite per impostazione predefinita.',
        },
      ],
      related: [
        {
          label: 'Taglia video',
          to: '/tools/video-trimmer',
          description: 'Taglia prima i secondi esatti, senza perdita.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Per qualsiasi cosa più lunga di pochi secondi, un piccolo MP4 batte una GIF.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Aggiungi sottotitoli o ritaglia prima di esportare la clip.',
        },
        {
          label: 'Tutorial del convertitore video',
          to: '/tutorials/video/getting-started',
          description: 'Guida alle impostazioni di taglio, ridimensionamento e filtri.',
        },
      ],
      embed: {
        title: 'Converti una clip video in GIF',
        description: 'Carica un breve video e scegli GIF come formato di output. Taglia a meno di ~10 secondi e abbassa il frame rate per un file più piccolo.',
      },
    },
    'transcribe-video': {
      name: 'Trascrivi video',
      h1: 'Trascrivi video in testo online',
      tagline: 'Estrai le parole pronunciate in un video o in un file audio come sottotitoli WebVTT o SRT, testo semplice o JSON con timestamp.',
      metaTitle: 'Trascrivi video in testo online (gratis) | Media Manipulator',
      metaDescription: 'Trascrizione video online gratuita. Converti file MP4, MOV, WebM, MKV e audio in testo ricercabile, sottotitoli VTT o trascrizioni JSON.',
      ogTitle: 'Trascrivi video in testo online',
      ogDescription: 'Estrai il parlato dai video in testo, sottotitoli o trascrizioni JSON. Gira su un server GPU locale.',
      intro: 'Trascrivi video prende un MP4, MOV, WebM, MKV o un semplice file audio, separa la traccia audio e la passa a Whisper su un server GPU che gestiamo noi. Scegli la forma del risultato prima di caricare: un file di sottotitoli WebVTT o SRT con i tempi delle battute, un file di testo semplice con solo le parole, oppure un documento JSON con ogni segmento e il suo tempo di inizio e fine al millisecondo. La lingua viene rilevata automaticamente, oppure puoi digitare un codice di due lettere per fissarla.',
      whatItDoes: [
        'Decodifica la traccia audio con ffmpeg in un WAV mono a 16 kHz, la frequenza di campionamento che Whisper si aspetta, ed elimina quell\'intermedio quando il lavoro finisce.',
        'Esegue whisper-ctranslate2 con il modello Whisper medium in float16 sulla nostra GPU, con il filtro di attività vocale attivo, così silenzi e lunghi tratti di musica vengono saltati.',
        'Scrive un solo file chiamato transcript.vtt, transcript.srt, transcript.txt o transcript.json, a seconda del formato scelto.',
        'Rileva la lingua parlata dall\'audio stesso; un codice lingua digitato nel modulo ha la precedenza sul rilevamento per le clip brevi o miste.',
        'Riferisce onestamente quando non c\'è nulla da trascrivere: un video senza flusso audio, o un audio senza parlato riconoscibile, si completa comunque con un breve messaggio invece di un file vuoto.',
      ],
      flowSteps: [
        {
          title: 'Carica video o audio',
          description: 'MP4, MOV, WebM, MKV, AVI, oppure un file audio come MP3, WAV, M4A o FLAC.',
        },
        {
          title: 'Scegli un formato',
          description: 'VTT o SRT per i sottotitoli, TXT per una trascrizione leggibile, JSON per timestamp che puoi elaborare.',
        },
        {
          title: 'ffmpeg estrae l\'audio',
          description: 'La traccia viene convertita in PCM mono a 16 kHz; i fotogrammi video non vengono mai decodificati.',
        },
        {
          title: 'Whisper trascrive sulla nostra GPU',
          description: 'Il lavoro attende uno slot GPU libero, poi il modello medium passa sull\'intero file in un unico passaggio.',
        },
        {
          title: 'Scarica la trascrizione',
          description: 'Il file compare con il lavoro e può essere scaricato finché il lavoro viene conservato.',
        },
      ],
      advancedDetails: [
        'Il comando esatto di estrazione è ffmpeg -vn -acodec pcm_s16le -ar 16000 -ac 1, quindi una traccia stereo a 48 kHz viene ridotta a mono e ricampionata prima che Whisper la veda. Quell\'intermedio costa 32 KB al secondo (circa 1,9 MB al minuto) di disco mentre il lavoro gira e viene rimosso dopo.',
        'whisper-ctranslate2 viene avviato con --model medium --device cuda --compute_type float16 --vad_filter True e --output_format json; l\'API analizza quel JSON e produce da sé il formato che hai scelto. Il modello è un\'impostazione del server (WHISPER_CT2_MODEL), quindi medium è il predefinito, non una promessa.',
        'L\'output VTT inizia con l\'intestazione WEBVTT e numera ogni battuta; i timestamp sono HH:MM:SS.mmm. SRT è lo stesso elenco di battute con la virgola come separatore dei millisecondi. A un segmento la cui fine coincide con l\'inizio viene assegnato mezzo secondo, così i lettori lo mostrano comunque.',
        'L\'output JSON contiene language, hasAudio, hasSpeech, transcript, durationSeconds e un array segments di {id, start, end, text} con tempi arrotondati al millisecondo. In questo output non ci sono tempi per parola né punteggi di confidenza.',
        'Per impostazione predefinita gira un solo processo Whisper alla volta (WHISPER_GPU_CONCURRENCY=1), e lo scheduler della GPU controlla la VRAM libera prima di avviarlo; il modello medium in float16 richiede circa 3,5 GB più un margine di 512 MB. Se la scheda è occupata il tuo lavoro attende in coda invece di fallire.',
        'Con il filtro VAD attivo, un file che è tutto musica o parlato molto debole può tornare con "Audio was detected but no recognizable speech was found." Quel messaggio viene scritto nel file della trascrizione, così il download non è mai vuoto.',
      ],
      whyItMatters: [
        'Un file di sottotitoli fa la differenza tra un video che può essere guardato senza audio, cercato o citato e uno che non può.',
        'I segmenti con timestamp ti permettono di saltare al momento in cui una frase è stata detta, ed è questo che trasforma una registrazione di due ore in qualcosa che puoi davvero usare.',
        'Tenere la trascrizione su hardware che gestiamo noi significa che l\'audio non viene consegnato a un\'API di riconoscimento vocale esterna.',
      ],
      useCases: [
        {
          title: 'Sottotitoli per un video pubblicato',
          description: 'Esporta VTT per il video HTML e la maggior parte dei lettori web, oppure SRT per le suite di montaggio e i flussi di lavoro di sottotitolazione in stile TV.',
        },
        {
          title: 'Appunti di riunioni e interviste',
          description: 'Porta l\'output TXT in un documento e lavora da lì invece di scrivere da zero.',
        },
        {
          title: 'Indicizzare un archivio di registrazioni',
          description: 'Usa i segmenti JSON per costruire un indice di ricerca che punti al secondo esatto in cui una parola è stata detta.',
        },
        {
          title: 'Una prima bozza di un articolo',
          description: 'Trascrivi un intervento o uno screencast, poi riscrivi il testo semplice in prosa.',
        },
      ],
      workedExamples: [
        {
          title: 'Un MP4 1080p di 9 minuti da 120 MB, come sottotitoli VTT',
          body: 'I 120 MB sono sotto il limite ospite di 200 MB, ma 9 minuti superano il limite ospite di 5 minuti, quindi questo richiede un account gratuito, che consente 20 minuti per impostazione predefinita. ffmpeg scrive un WAV mono a 16 kHz di circa 17 MB (32.000 byte al secondo per 540 secondi), che viene eliminato dopo l\'esecuzione. Whisper medium produce poi battute numerate con tempi HH:MM:SS.mmm, e il transcript.vtt risultante è di pochi kilobyte, perché contiene solo testo e timestamp. Caricare 120 MB da una connessione domestica di solito richiede più tempo dell\'estrazione, che è di pochi secondi; il passaggio di Whisper è il resto e cresce con la lunghezza del parlato, non con la dimensione del video.',
        },
        {
          title: 'Un podcast MP3 di 18 minuti da circa 26 MB, come JSON',
          body: 'Un MP3 a 192 kbps è 24 KB al secondo, quindi 1.080 secondi arrivano a circa 26 MB. I file solo audio sono soggetti allo stesso limite di durata dei video, quindi 18 minuti richiedono un account gratuito (limite di 20 minuti) anziché una sessione ospite (5 minuti). Non c\'è video da saltare, ma il file viene comunque convertito prima in PCM mono a 16 kHz (circa 35 MB su disco, rimossi dopo). La lingua viene rilevata dall\'audio e scritta nel JSON come codice di due lettere, e ogni segmento porta il proprio tempo di inizio e fine. Il JSON è più grande del TXT della stessa registrazione perché ogni segmento è avvolto nel proprio oggetto, ma resta ben sotto il megabyte.',
        },
      ],
      whenNotToUse: 'Non usarlo quando ti servono tempi per parola, etichette degli oratori o punteggi di confidenza: l\'output non ne ha, solo timestamp a livello di segmento. È anche lo strumento sbagliato per un file il cui audio è musica senza parlato, perché il filtro di attività vocale lo salterà e otterrai un breve messaggio invece del testo della canzone. Se ti serve solo ascoltare il file, o vuoi i sottotitoli tradotti in un\'altra lingua, cerchi un passaggio diverso. E se la registrazione è più lunga di quanto il tuo piano consenta (5 minuti come ospite, 20 minuti con un account gratuito per impostazione predefinita), tagliala prima oppure accedi.',
      whyMediaManipulator: [
        'Scegli VTT, SRT, TXT o JSON prima di caricare, quindi non c\'è un secondo passaggio di conversione dopo che la trascrizione esiste.',
        'Whisper gira sulla nostra GPU con la cache del modello in modalità offline; nessun servizio di riconoscimento vocale esterno riceve l\'audio.',
        'La trascrizione conta come un lavoro IA, scalato dalla quota IA, che è separata da quella quotidiana: per impostazione predefinita 3 al giorno per un ospite e 10 con un account gratuito, e i tuoi lavori quotidiani restano intatti (vedi /pricing).',
      ],
      privacyNote: 'Il tuo file video o audio viene conservato nella cartella del suo lavoro sul nostro server. ffmpeg scrive un WAV mono a 16 kHz temporaneo che Whisper legge sulla nostra GPU, e quel WAV viene eliminato quando il lavoro finisce. Il file della trascrizione e una copia transcribe_result.json dei segmenti restano con il lavoro, e il testo della trascrizione viene anche passato a un modello linguistico che gira sul nostro hardware per un riassunto automatico e una verifica di sicurezza, il cui risultato viene conservato con il lavoro. Nulla viene inviato a un fornitore di IA di terze parti. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      faq: [
        {
          question: 'Quale formato di sottotitoli dovrei scegliere, VTT o SRT?',
          answer: 'VTT se i sottotitoli sono per il web (video HTML, la maggior parte dei lettori) e SRT se vanno in un editor video o in un flusso di lavoro di tipo broadcast. Entrambi contengono le stesse battute; cambiano solo l\'intestazione e il separatore dei millisecondi, un punto in VTT e una virgola in SRT.',
        },
        {
          question: 'La trascrizione JSON include punteggi di confidenza o tempi per parola?',
          answer: 'No. Ogni segmento ha un id, un tempo di inizio e di fine in secondi (arrotondati al millisecondo) e il suo testo. Il file registra anche la lingua rilevata, la durata e se è stato trovato parlato, ma non ci sono tempi per parola né probabilità.',
        },
        {
          question: 'Quanto può essere lungo un file da trascrivere?',
          answer: 'I caricamenti solo audio sono soggetti allo stesso limite di durata dei video: 5 minuti per un ospite, 20 minuti con un account gratuito, 2 ore con Premium e Pro per impostazione predefinita, e rispettivamente 200 MB, 1 GB o 5 GB per file. Il modulo mostra i limiti che si applicano a te, e /pricing elenca i numeri attuali.',
        },
        {
          question: 'Perché ho ricevuto "no recognizable speech was found"?',
          answer: 'Whisper gira con il rilevamento dell\'attività vocale attivo, quindi un file di musica, suoni ambientali, silenzio o parlato molto debole può essere ridotto a nulla. Il messaggio viene scritto nel file della trascrizione stesso, così il download funziona comunque. Registra di nuovo a volume più alto oppure taglia alla parte parlata e riprova.',
        },
        {
          question: 'Posso forzare la lingua invece di lasciarla rilevare?',
          answer: 'Sì. Digita un codice lingua di due lettere come en, de o es nel campo della lingua e Whisper trascriverà in quella lingua. Lascialo vuoto per il rilevamento automatico, che funziona bene sulle clip più lunghe di pochi secondi.',
        },
        {
          question: 'La trascrizione usa la mia quota IA?',
          answer: 'Sì. Ogni trascrizione è un lavoro IA: per impostazione predefinita 3 al giorno come ospite, 10 con un account gratuito, 100 con Premium e 200 con Pro. La quota IA è un contatore a sé, quindi trascrivere non consuma mai la quota quotidiana per le conversioni. Un lavoro che fallisce rimborsa l\'unità.',
        },
        {
          question: 'Quale modello viene usato, e posso sceglierne uno più grande?',
          answer: 'Il servizio esegue whisper-ctranslate2 con il modello medium in float16 su una GPU CUDA per impostazione predefinita. Non c\'è un selettore del modello nel modulo; il modello è impostato sul server, quindi le varianti molto veloci o molto grandi non sono qualcosa che puoi richiedere per singolo lavoro.',
        },
      ],
      related: [
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci una registrazione grande prima di caricarla per la trascrizione.',
        },
        {
          label: 'Estrai l\'audio da un video',
          to: '/tools/extract-audio-from-video',
          description: 'Estrai la traccia audio se vuoi conservarne anche una copia.',
        },
        {
          label: 'Pulisci l\'audio della voce',
          to: '/tools/clean-voice-audio',
          description: 'Migliora una registrazione rumorosa prima di trascriverla.',
        },
        {
          label: 'Taglia video',
          to: '/tools/video-trimmer',
          description: 'Riduci prima il file alla parte parlata.',
        },
        {
          label: 'Tutorial del convertitore video',
          to: '/tutorials/video/getting-started',
          description: 'Prepara e converti il video prima di trascriverlo.',
        },
      ],
      embed: {
        title: 'Trascrivi un video',
        description: 'Carica un video. Il modello di trascrizione IA gira sul nostro server GPU locale ed esporta come sottotitoli VTT, testo semplice o JSON: VTT per i sottotitoli, testo semplice per un articolo, JSON per gli strumenti a valle.',
      },
    },
    'transcode-to-hls': {
      name: 'Transcodifica video in HLS',
      h1: 'Transcodifica video in HLS online',
      tagline: 'Crea da qualsiasi video un pacchetto Apple HLS VOD: master.m3u8 e segmenti .ts per ogni rendition, pronti per il web.',
      metaTitle: 'Transcodifica video in HLS online | Strumento gratuito per lo streaming adattivo',
      metaDescription: 'Transcoder HLS online gratuito. Converti MP4, MOV, WebM e MKV in un pacchetto HLS VOD con rendition a 360p/480p/720p, con sottotitoli e storyboard opzionali.',
      ogTitle: 'Transcodifica video in HLS online',
      ogDescription: 'Genera un pacchetto HLS adattivo (master.m3u8 + playlist delle varianti + segmenti .ts) da qualsiasi video, gratis, nel tuo browser.',
      intro: 'HTTP Live Streaming serve un video come playlist di brevi segmenti a più livelli di qualità, così un lettore può partire in fretta e cambiare livello quando la connessione cambia. Produrre quel pacchetto a mano significa codificare ogni rendition con fotogrammi chiave allineati, segmentarle e scrivere una playlist master che descriva correttamente ogni variante. Questa pagina fa tutto il lavoro: analizza il tuo caricamento, propone i livelli della scala che la tua sorgente e il tuo piano consentono, codifica ciascuno con libx264 e AAC in segmenti MPEG-TS da 2 secondi, aggiunge facoltativamente i sottotitoli dal nostro trascrittore Whisper, uno sprite sheet di storyboard e una playlist I-frame per lo scorrimento, e raccoglie tutto in un tar.gz o zip che puoi scompattare su qualsiasi host statico.',
      whatItDoes: [
        'Analizza la sorgente con ffprobe ed elenca i livelli della scala: 144p, 240p, 360p, 480p, 720p, 1080p e 2160p, ciascuno abilitato solo se la sorgente è abbastanza alta e il tuo piano lo consente.',
        'Codifica ogni livello selezionato con libx264 profilo High livello 4.1 e AAC stereo a 48 kHz, in segmenti .ts da 2 secondi con un fotogramma chiave a ogni confine di segmento.',
        'Scrive hls/master.m3u8 con BANDWIDTH, RESOLUTION, FRAME-RATE e CODECS per ogni variante, più un index.m3u8 per livello.',
        'Facoltativamente trascrive l\'audio con Whisper in una traccia WebVTT, la traduce in fino a 3 lingue aggiuntive con un modello locale e collega ciascuna come rendition di sottotitoli nella master.',
        'Facoltativamente genera uno sprite sheet di storyboard con un indice WebVTT per le miniature della barra di scorrimento, e prova sempre ad aggiungere una playlist solo I-frame a 240p.',
        'Confeziona la cartella con README.txt e report.json in un tar.gz (o zip) e ti dà un link di download prefirmato.',
      ],
      flowSteps: [
        {
          title: 'Carica',
          description: 'Il browser carica direttamente nel nostro bucket di archiviazione con una PUT prefirmata; l\'API poi lo scarica per lavorarci.',
        },
        {
          title: 'Analizza',
          description: 'ffprobe legge larghezza, altezza, frame rate, durata e presenza dell\'audio; i livelli più alti della sorgente vengono disabilitati.',
        },
        {
          title: 'Scegli livelli ed extra',
          description: '360p, 480p e 720p sono preselezionati. Spunta sottotitoli, lingue aggiuntive dei sottotitoli, storyboard, e tar.gz o zip.',
        },
        {
          title: 'Codifica ogni livello',
          description: 'libx264 al CRF e bitrate del livello con un GOP di 2 secondi, AAC al bitrate audio del livello, output HLS VOD.',
        },
        {
          title: 'Aggiungi gli extra e scrivi la master',
          description: 'Sottotitoli, storyboard e playlist I-frame vengono generati, poi master.m3u8 viene riscritta per riferirsi a loro.',
        },
        {
          title: 'Scarica il pacchetto',
          description: 'Un link prefirmato valido per 30 minuti per impostazione predefinita; la pagina del lavoro ti permette di recuperarlo finché dura.',
        },
      ],
      advancedDetails: [
        'La scala (transcode_profiles.go) è: 144p 200 kbps video e 64 kbps audio, CRF 26; 240p 400/64, CRF 25; 360p 800/96, CRF 23; 480p 1200/128, CRF 23; 720p 2800/128, CRF 22; 1080p 5000/192, CRF 22; 2160p 12000/256, CRF 21. Tutti i livelli usano il preset veryfast tranne 2160p, che usa slow.',
        'Ogni livello viene codificato come ffmpeg -i input -map 0:v:0 -vf scale=-2:H -r FPS -c:v libx264 -profile:v high -level 4.1 -preset P -crf N -sc_threshold 0 -g GOP -keyint_min GOP -b:v B -maxrate 1.2B -bufsize 2B -force_key_frames expr:gte(t,n_forced*2) -map 0:a:0? -c:a aac -b:a A -ac 2 -ar 48000 -hls_time 2 -hls_playlist_type vod -hls_flags independent_segments. Il GOP è il frame rate per 2, così i segmenti iniziano su fotogrammi chiave in ogni livello.',
        'Poiché la codifica è guidata dal CRF con -maxrate come tetto, un livello ha in media al massimo circa il bitrate indicato (il tetto è 1,2 volte quello) e resta più basso sui contenuti facili. La playlist master dichiara BANDWIDTH come bitrate video più audio indicati, e CODECS come avc1.640028 con mp4a.40.2 aggiunto quando è presente l\'audio.',
        'Per impostazione predefinita un ospite può selezionare da 360p a 720p, un account gratuito da 360p a 1080p, e Premium o Pro l\'intera scala da 144p a 2160p; le sorgenti più basse di 360p vengono rifiutate sotto Premium. Il server riconvalida i livelli all\'avvio, così un client non può richiedere un livello che non gli è stato proposto.',
        'I sottotitoli usano lo stesso modello Whisper (whisper-ctranslate2, medium) del trascrittore; la traccia principale viene scritta in captions/<lang>/auto.vtt con un wrapper subs.m3u8 a un segmento e referenziata dalla master come EXT-X-MEDIA TYPE=SUBTITLES. Fino a 3 lingue aggiuntive da una lista di 37 vengono tradotte segmento per segmento da un modello Ollama locale (una build di translategemma 12b); una traduzione fallita viene registrata come avviso, mai come lavoro fallito.',
        'Gli storyboard sono un singolo passaggio ffmpeg: fps=1/N con N di 5, 10 o 15 secondi a seconda della durata (sotto 10 minuti, sotto 30, più lunghi), riquadri 160 x 90 riempiti a 16:9 in una griglia 10 x 10 per sprite JPEG, più storyboard.vtt con cue #xywh. La playlist I-frame ricodifica solo i fotogrammi chiave a 240p (select=eq(pict_type,I), libx264 CRF 30, segmenti da 4 secondi) ed è elencata come EXT-X-I-FRAME-STREAM-INF.',
        'La master contiene EXT-X-VERSION:6, EXT-X-INDEPENDENT-SEGMENTS e tre voci EXT-X-SESSION-DATA che indicano il produttore, il sito e il titolare del copyright. report.json registra l\'analisi, le varianti con conteggi dei segmenti e dimensioni in byte, avvisi e timestamp.',
      ],
      whyItMatters: [
        'HLS è il formato di streaming nativo di iOS, Safari e di ogni CDN, e con hls.js si riproduce anche in tutti gli altri browser.',
        'I livelli adattivi permettono a uno spettatore con una connessione debole di continuare a guardare a 360p invece di restare in buffering a 1080p.',
        'Un pacchetto VOD già segmentato è fatto di file statici, quindi può essere ospitato su un object storage senza un server di transcodifica dietro.',
      ],
      useCases: [
        {
          title: 'Piattaforme di corsi',
          description: 'Servi le lezioni da un bucket con bitrate adattivo e sottotitoli in più lingue.',
        },
        {
          title: 'Pagine di prodotto e marketing',
          description: 'Trasmetti una demo senza un host video di terze parti e il marchio del suo lettore.',
        },
        {
          title: 'Portali interni',
          description: 'Ospita video di formazione sulla tua CDN con miniature nella barra di scorrimento.',
        },
        {
          title: 'Archivi',
          description: 'Converti un catalogo storico in una struttura trasmissibile in streaming che controlli e puoi replicare.',
        },
      ],
      workedExamples: [
        {
          title: 'Una clip 1080p di 3 minuti ai tre livelli predefiniti',
          body: 'Input: un MP4 1920 x 1080 a 30 fps di 3 minuti da 140 MB con audio stereo, entro i limiti ospite. Impostazioni: 360p, 480p e 720p (la selezione predefinita e il massimo che un ospite può scegliere), senza sottotitoli né storyboard, tar.gz. Ogni livello viene tagliato in segmenti da 2 secondi, 90 per livello, con un GOP di 60 fotogrammi, così ogni segmento inizia su un fotogramma chiave. Ai bitrate indicati i livelli pesano al massimo circa 20 MB per 360p (800 + 96 kbps x 180 s), 30 MB per 480p (1200 + 128 kbps) e 66 MB per 720p (2800 + 128 kbps), circa 116 MB in tutto prima della piccola playlist I-frame a 240p, e meno sui contenuti facili perché la codifica è guidata dal CRF con il bitrate come tetto. Il pacchetto risultante ha 270 segmenti .ts, tre file index.m3u8 e la master. Il tempo è quello di tre codifiche libx264 veryfast di 5400 fotogrammi ciascuna, eseguite una dopo l\'altra; il livello 720p è quello che richiede più tempo.',
        },
        {
          title: 'Un webinar 720p di 12 minuti con sottotitoli in inglese, traduzione in spagnolo e storyboard',
          body: 'Input: un MP4 1280 x 720 a 25 fps di 12 minuti da 380 MB, caricato con un account gratuito perché supera i 5 minuti predefiniti per gli ospiti. Impostazioni: 360p e 720p (1080p è disabilitato perché la sorgente è 720p), sottotitoli attivi con lo spagnolo come lingua aggiuntiva, storyboard attivi, zip. Whisper trascrive prima i 12 minuti e scrive captions/en/auto.vtt; la traccia spagnola viene tradotta in lotti di 30 segmenti in captions/es/auto.vtt, ed entrambe vengono elencate come rendition di sottotitoli nella master. Gli storyboard usano un intervallo di 10 secondi per una sorgente oltre i 10 minuti: 72 miniature 160 x 90 entrano in un singolo sprite_001.jpg da 1600 x 900 con uno storyboard.vtt che punta a ogni riquadro. I due livelli sono 360 segmenti ciascuno da 2 secondi, con un GOP di 50 fotogrammi a 25 fps, e pesano al massimo circa 81 MB (360p) e 264 MB (720p) ai bitrate indicati. Il lavoro passa più tempo su Whisper e sulle due codifiche che su qualsiasi altra cosa; la traduzione è un breve passaggio in più.',
        },
      ],
      whenNotToUse: 'Non transcodificare in HLS se vuoi semplicemente un singolo file più piccolo da inviare o incorporare; il compressore lo fa in un passaggio senza segmenti e playlist. Non usarlo per eventi dal vivo, perché l\'output è una playlist VOD finita, non un\'origine live. Se la tua sorgente è sotto i 360p, la scala non può essere costruita senza Premium. E se il tuo lettore è un semplice tag video senza supporto HLS, ti serve prima un MP4 o un lettore in stile hls.js; una master.m3u8 da sola si riproduce nativamente solo in Safari e sui dispositivi Apple.',
      whyMediaManipulator: [
        'Ogni bitrate, CRF, preset e flag FFmpeg di ogni livello è elencato in questa pagina, così il contenuto del pacchetto non è una sorpresa.',
        'I sottotitoli arrivano dal nostro trascrittore Whisper e le traduzioni da un modello sul nostro hardware, entrambi referenziati correttamente nella playlist master.',
        'Il pacchetto è fatto di semplici file con un README e un report.json; scompattalo su qualsiasi host statico e punta un lettore a master.m3u8.',
        'Una transcodifica spende un\'operazione della tua quota giornaliera (5 al giorno come ospite per impostazione predefinita, 30 con un account gratuito) ed è limitata a 10 avvii all\'ora per sessione; un lavoro fallito viene rimborsato. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      ],
      privacyNote: 'Il tuo caricamento va direttamente dal browser al nostro bucket di archiviazione e viene poi scaricato sul nostro server, dove girano ffprobe, FFmpeg e, se spunti i sottotitoli, il nostro trascrittore Whisper e un modello di traduzione Ollama locale; nessun servizio di transcodifica o di IA di terze parti è coinvolto. L\'oggetto sorgente, la directory di lavoro e il pacchetto finito sono tutti registrati nel registro di conservazione e vengono eliminati quando termina la finestra, e il link di download stesso scade dopo 30 minuti per impostazione predefinita. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. La transcodifica non esegue l\'analisi automatica dei contenuti che le conversioni standard ricevono. La playlist master generata contiene righe di session-data che indicano Media Manipulator come produttore; non contengono alcuna informazione su di te.',
      faq: [
        {
          question: 'Quali livelli posso selezionare con il mio piano?',
          answer: 'Per impostazione predefinita un ospite ha 360p, 480p e 720p; un account gratuito aggiunge 1080p; Premium e Pro sbloccano anche 144p, 240p e 2160p. Un livello più alto della tua sorgente è sempre disabilitato, perché nulla viene ingrandito. I chip mostrano il motivo al passaggio del mouse.',
        },
        {
          question: 'Quanto sono lunghi i segmenti, e perché 2 secondi?',
          answer: 'Ogni livello viene tagliato in segmenti MPEG-TS da 2 secondi con un fotogramma chiave forzato a ogni confine, così un lettore può cambiare livello a qualsiasi segmento senza difetti visivi. La playlist I-frame usa segmenti da 4 secondi perché contiene solo fotogrammi chiave.',
        },
        {
          question: 'I sottotitoli sono collegati nella playlist master?',
          answer: 'Sì. Ogni lingua viene scritta come captions/<lang>/auto.vtt con un wrapper subs.m3u8 e dichiarata in master.m3u8 come EXT-X-MEDIA TYPE=SUBTITLES nel gruppo subs, con la lingua di origine marcata DEFAULT. Puoi aggiungere fino a 3 lingue tradotte dalla lista di 37.',
        },
        {
          question: 'E se il mio video non ha audio?',
          answer: 'I livelli vengono codificati solo video con -an, l\'attributo CODECS omette mp4a.40.2 e il passaggio dei sottotitoli viene saltato con un avviso in report.json, dato che non c\'è nulla da trascrivere.',
        },
        {
          question: 'Cosa c\'è nel pacchetto, e come lo ospito?',
          answer: 'hls/master.m3u8, una cartella per livello con index.m3u8 e segmenti, hls/iframes/, captions/ e storyboards/ facoltative, README.txt e report.json. Scompattalo su qualsiasi host statico o bucket che serva .m3u8 e .ts con i tipi MIME corretti e punta il tuo lettore a master.m3u8.',
        },
        {
          question: 'Quanto dura il link di download, e posso avere tar.gz o zip?',
          answer: 'Il link prefirmato dura 30 minuti per impostazione predefinita; esegui di nuovo il lavoro se è scaduto. Scegli tar.gz (il predefinito) o zip nel modulo prima di avviare.',
        },
        {
          question: 'Quanto tempo richiede una transcodifica HLS?',
          answer: 'Ogni livello selezionato è una codifica libx264 completa con il preset veryfast, eseguita una dopo l\'altra, quindi il tempo cresce con la durata moltiplicata per il numero di livelli; 720p domina i tre livelli predefiniti. I sottotitoli aggiungono un passaggio di Whisper su tutto l\'audio. La pagina del lavoro mostra ogni fase man mano che si completa.',
        },
      ],
      related: [
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Un singolo MP4 più piccolo invece di un pacchetto per lo streaming.',
        },
        {
          label: 'Trascrivi video',
          to: '/tools/transcribe-video',
          description: 'Ottieni gli stessi sottotitoli Whisper come VTT o SRT autonomo.',
        },
        {
          label: 'Taglia video',
          to: '/tools/video-trimmer',
          description: 'Rimuovi l\'inizio e la fine inutili prima di transcodificare.',
        },
        {
          label: 'Restauro video con IA',
          to: '/tools/ai-video-restoration',
          description: 'Ingrandisci uno spezzone a bassa risoluzione prima di costruirne una scala.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Monta e sottotitola il video, poi transcodifica l\'esportazione.',
        },
      ],
      embed: {
        title: 'Transcodifica un video in HLS',
        description: 'Carica un MP4/MOV/WebM/MKV. Analizziamo la sorgente con ffprobe, ti lasciamo scegliere i livelli di qualità gratuiti (360p/480p/720p), poi eseguiamo la codifica ffmpeg H.264 + AAC e confezioniamo un tar.gz scaricabile del pacchetto HLS.',
      },
    },
    'ai-video-restoration': {
      name: 'Restauro video con IA',
      h1: 'Strumento di restauro video con IA',
      tagline: 'Ingrandisci e restaura un breve spezzone video con fino a sei modelli di IA (Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT e VRT) e confronta ogni risultato affiancato.',
      metaTitle: 'Restauro video con IA: confronta 6 modelli di upscaling online | Media Manipulator',
      metaDescription: 'Strumento gratuito di restauro video con IA. Passa una breve clip attraverso i modelli di super-risoluzione Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT e VRT sulla nostra GPU e scarica tutti i risultati in un unico pacchetto.',
      ogTitle: 'Restauro video con IA: confronta Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT e VRT',
      ogDescription: 'Scegli uno spezzone del tuo video, seleziona i modelli di restauro e scarica un unico pacchetto con ogni versione migliorata più l\'originale per il confronto A/B.',
      intro: 'I modelli di restauro video non sono d\'accordo tra loro. Un upscaler GAN come Real-ESRGAN produce singoli fotogrammi nitidi che possono sfarfallare in movimento; un transformer video come VRT mantiene stabile la sequenza ma può ammorbidire i dettagli. L\'unico modo onesto per scegliere è passare lo stesso filmato attraverso tutti e guardare. Questa pagina fa esattamente questo su uno spezzone di al massimo 15 secondi: estrae i fotogrammi, esegue i sei modelli che scegli sulla nostra GPU, ricompone ogni risultato in un MP4 al frame rate della sorgente con l\'audio originale e impacchetta tutto, compreso lo spezzone intatto, in un unico archivio per il confronto affiancato. Ogni numero qui sotto viene dalla pipeline così come gira oggi.',
      whatItDoes: [
        'Taglia lo spezzone che selezioni (da 0.5 a 15 secondi, al massimo 450 fotogrammi al tuo frame rate) con precisione al fotogramma, insieme al suo audio.',
        'Esegue qualsiasi combinazione di Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT e VRT; i primi tre migliorano fotogramma per fotogramma, gli ultimi tre restaurano la sequenza nel suo insieme.',
        'Sceglie 4x per le sorgenti fino a 540p e 2x oltre, perché ogni modello esegue la sua rete nativa 4x e il risultato 2x è una riduzione Lanczos al momento della ricomposizione.',
        'Ricompone ogni risultato con libx264 a CRF 16 all\'esatta frazione di frame rate della sorgente e riallega l\'audio.',
        'Impacchetta original/clip.mp4, una cartella per modello, i fotogrammi PNG migliorati facoltativi per i modelli fotogramma per fotogramma, manifest.json e README.txt in un unico tar.gz.',
        'Prosegue quando un modello fallisce: la sua cartella riceve un FAILED.txt, il manifest registra il motivo e ogni altro risultato viene comunque consegnato.',
      ],
      flowSteps: [
        {
          title: 'Carica un video',
          description: 'Fino a 1920 x 1080; le sorgenti lunghe vanno bene perché viene elaborato solo lo spezzone.',
        },
        {
          title: 'Seleziona uno spezzone',
          description: 'Trascina le maniglie per scegliere fino a 15 secondi; si consigliano 10 secondi o meno e il selettore ti avvisa oltre quella soglia.',
        },
        {
          title: 'Scegli i modelli e se includere i fotogrammi',
          description: 'Uno qualsiasi dei sei; il selettore mostra una stima dei tempi per modello, calcolata dai secondi per fotogramma pubblicati dal server.',
        },
        {
          title: 'Segui le fasi',
          description: 'Download, analisi, estrazione della clip, estrazione dei fotogrammi, poi ogni modello dal più veloce al più lento, infine l\'impacchettamento.',
        },
        {
          title: 'Confronta e scarica',
          description: 'Riproduci l\'MP4 di ogni modello accanto all\'originale nel visualizzatore, poi scarica l\'archivio finché il suo link di 6 ore è valido.',
        },
      ],
      advancedDetails: [
        'La clip di riferimento viene tagliata con ffmpeg -ss START -i source -t WINDOW -c:v libx264 -crf 10 -preset medium -pix_fmt yuv420p -c:a aac, poi i fotogrammi vengono estratti con -vsync 0 in PNG numerati; se il conteggio supera 450, i fotogrammi in eccesso vengono scartati.',
        'Real-ESRGAN esegue realesrgan-ncnn-vulkan con il modello realesrgan-x4plus, scala 4 e tile da 256 px. SwinIR usa i pesi GAN 003_realSR_BSRGAN SwinIR-L x4 e HAT usa Real_HAT_GAN_SRx4, entrambi con inferenza a tile (tile da 320 px, sovrapposizione di 32 px) così i fotogrammi 1080p entrano in memoria.',
        'BasicVSR++ esegue il generatore REDS4 c64n7 tramite mmagic in finestre di 16 fotogrammi; RVRT (001_RVRT_videosr_bi_REDS_30frames) e VRT (001_VRT_videosr_bi_REDS_6frames) girano tramite i rispettivi script di test KAIR con tile temporali di 30 e 12 fotogrammi e tile spaziali di 128 x 128.',
        'La ricomposizione è uniforme: ffmpeg -framerate FPS_FRACTION -i frames/%06d.png [-i clip.mp4 -map 0:v -map 1:a -c:a aac] [-vf scale=iw/2:ih/2:flags=lanczos] -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -movflags +faststart -shortest. La frazione di frame rate, ad esempio 30000/1001, è presa alla lettera da ffprobe, così l\'audio resta sincronizzato.',
        'I modelli girano in un ordine fisso, Real-ESRGAN, BasicVSR++, SwinIR, RVRT, HAT, VRT, sotto un lease dello scheduler GPU con budget di VRAM rispettivamente di 3, 11, 9, 12, 10 e 14 GB, un solo lavoro di restauro alla volta su tutto il server e un timeout di 75 minuti per modello.',
        'Le stime per fotogramma pubblicate che il selettore moltiplica per il tuo numero di fotogrammi sono 0.8 s (Real-ESRGAN), 1.0 s (BasicVSR++), 3.0 s (RVRT), 3.5 s (SwinIR), 5.0 s (HAT) e 7.0 s (VRT); sono valori predefiniti lato server che possono cambiare, non misurazioni della tua clip.',
        'Il 4x esplicito viene rifiutato per le sorgenti più alte di 1080p perché l\'output supererebbe il 4K; la modalità auto sceglie 2x da 541p a 1080p e 4x fino a 540p. I fotogrammi inclusi sono i PNG nativi 4x anche sul percorso 2x, quindi una sorgente 1080p produce fotogrammi da 7680 x 4320.',
      ],
      whyItMatters: [
        'Nessun modello di restauro vince su tutti i filmati, e i confronti su fotogrammi fissi nascondono lo sfarfallio che solo la riproduzione rivela.',
        'Uno spezzone di 10 secondi attraverso ogni modello costa minuti di tempo GPU e ti dice quale modello merita un\'elaborazione completa altrove.',
        'Nastri digitalizzati, clip delle prime fotocamere digitali ed esportazioni social compresse si degradano in modo diverso e rispondono a famiglie di modelli diverse.',
      ],
      useCases: [
        {
          title: 'Vecchi video di famiglia',
          description: 'Scopri quale modello recupera volti e tessuti su un riversamento da nastro a 480p prima di restaurare l\'intera bobina.',
        },
        {
          title: 'Filmati d\'archivio',
          description: 'Prova il 4x su materiale a 360p e 480p e giudica l\'output di classe 4K sul tuo monitor.',
        },
        {
          title: 'Scelta del modello prima di un render lungo',
          description: 'Scegli il modello per un lavoro di ore a partire da un test rappresentativo di 10 secondi.',
        },
        {
          title: 'Download compressi',
          description: 'Confronta la nitidezza GAN con la stabilità dei transformer su esportazioni social piene di blocchi.',
        },
        {
          title: 'Controlli di stabilità temporale',
          description: 'Riproduci gli MP4 dei vari modelli affiancati per individuare lo sfarfallio che i fotogrammi fissi nascondono.',
        },
      ],
      workedExamples: [
        {
          title: 'Un video domestico di 8 secondi a 640 x 480 attraverso tutti e sei i modelli',
          body: 'Ingresso: un MP4 a 640 x 480 e 29.97 fps da un nastro digitalizzato, con audio. Impostazioni: uno spezzone di 8 secondi, tutti e sei i modelli, fotogrammi migliorati inclusi, scala auto. La pipeline taglia una clip di riferimento di 8 secondi ed estrae 240 fotogrammi (8 x 29.97, arrotondato). A 480p la regola auto sceglie 4x, quindi ogni modello scrive fotogrammi da 2560 x 1920 e gli MP4 ricomposti sono a 2560 x 1920 e 30000/1001 fps con l\'audio originale. La stima del selettore è il numero di fotogrammi per i secondi per fotogramma pubblicati: circa 3.2 minuti per Real-ESRGAN, 4 minuti per BasicVSR++, 12 per RVRT, 14 per SwinIR, 20 per HAT e 28 per VRT, circa 81 minuti in totale perché i modelli girano uno dopo l\'altro. Includere i fotogrammi aggiunge all\'archivio 3 x 240 PNG da 2560 x 1920, ed è per questo che il download si misura in gigabyte anziché in megabyte.',
        },
        {
          title: 'Una clip 1080p di 10 secondi a scala auto con Real-ESRGAN e BasicVSR++',
          body: 'Ingresso: un MP4 a 1920 x 1080 e 30 fps da 90 MB, la risoluzione massima accettata dallo strumento. Impostazioni: uno spezzone di 10 secondi, Real-ESRGAN e BasicVSR++, fotogrammi esclusi, scala auto. L\'estrazione produce 300 fotogrammi, entro il tetto di 450 (a 60 fps lo stesso tetto limiterebbe lo spezzone a 7.5 secondi). Oltre i 540p auto sceglie 2x, quindi ogni modello esegue comunque la sua rete nativa 4x, producendo fotogrammi da 7680 x 4320, e la ricomposizione applica scale=iw/2:ih/2:flags=lanczos per consegnare MP4 a 3840 x 2160 e CRF 16. Le stime pubblicate danno circa 4 minuti per Real-ESRGAN (0.8 s x 300) e 5 minuti per BasicVSR++ (1.0 s x 300), quindi il lavoro termina ben entro il timeout di 75 minuti per modello e l\'archivio contiene due MP4 in 4K, la clip originale, manifest.json e README.txt.',
        },
      ],
      whenNotToUse: 'Non usare questa pagina per restaurare un intero film; è uno strumento di confronto limitato a 15 secondi e 450 fotogrammi, e già per quello l\'archivio può pesare gigabyte. Non aspettarti che inventi ciò che non è mai stato registrato: forte sfocatura di movimento, blocchi da compressione estrema e riprese molto scure migliorano ma non diventano perfette. Le sorgenti oltre 1920 x 1080 vengono rifiutate, perché il restauro è pensato per materiale a bassa risoluzione e il 2x di 1080p è già 4K. Se la tua clip ha bisogno solo di un file più piccolo, di un cambio di formato o di un taglio, il compressore, il convertitore e lo strumento di taglio lo fanno in pochi secondi senza GPU.',
      whyMediaManipulator: [
        'Sei modelli di livello scientifico dietro un unico caricamento, con pesi, dimensioni dei tile e comando di ricomposizione dichiarati in questa pagina anziché nascosti dietro un marchio.',
        'Tutto gira sulla nostra GPU; il tuo filmato non va mai a un fornitore di IA di terze parti e nulla viene usato per l\'addestramento.',
        'Un restauro consuma un lavoro IA dalla tua quota giornaliera di IA, che per impostazione predefinita è di 3 al giorno senza account e 10 con un account gratuito, ed è limitato a 2 avvii l\'ora per sessione; un lavoro fallito viene rimborsato. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      ],
      privacyNote: 'Il tuo caricamento passa dal browser al nostro bucket di archiviazione e viene scaricato sul nostro server GPU, dove FFmpeg taglia lo spezzone e i sei modelli girano come processi locali; nessun fornitore esterno di IA è coinvolto e nulla viene usato per l\'addestramento. Solo lo spezzone selezionato viene decodificato in fotogrammi; il resto della sorgente non viene mai elaborato. L\'oggetto di origine, i fotogrammi di lavoro, gli MP4 per modello conservati per il visualizzatore di confronto e l\'archivio dei risultati sono tutti registrati nel registro di conservazione e vengono eliminati alla fine del periodo, e il link dell\'archivio scade dopo 6 ore. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. I lavori di restauro non passano per l\'analisi automatica dei contenuti che ricevono le conversioni standard.',
      faq: [
        {
          question: 'Qual è il miglior modello IA di upscaling video?',
          answer: 'Dipende dal filmato, ed è per questo che esiste questo strumento. Gli upscaler GAN come Real-ESRGAN e HAT producono fotogrammi nitidi che possono sfarfallare in movimento; i modelli di sequenza come BasicVSR++, RVRT e VRT usano i fotogrammi vicini per la stabilità e possono risultare più morbidi. Passa il tuo spezzone attraverso tutti e giudica in movimento.',
        },
        {
          question: 'Perché la clip è limitata a 15 secondi e 450 fotogrammi?',
          answer: 'Il restauro è costoso per ogni fotogramma: la stima pubblicata per il solo VRT è di 7 secondi a fotogramma a 4x. Il tetto di fotogrammi viene verificato rispetto al tuo frame rate reale, quindi una sorgente a 60 fps è limitata a 7.5 secondi. Uno spezzone breve basta per giudicare la qualità prima di un restauro più lungo altrove.',
        },
        {
          question: 'Come funziona la scelta tra 2x e 4x?',
          answer: 'Auto sceglie 4x per le sorgenti fino a 540p e 2x oltre. Ogni modello esegue comunque la sua rete nativa 4x; sul percorso 2x la ricomposizione dimezza i fotogrammi con un filtro Lanczos. Il 4x esplicito viene rifiutato oltre i 1080p perché l\'output supererebbe il 4K.',
        },
        {
          question: 'Il video restaurato conserva audio e frame rate?',
          answer: 'Sì. Lo spezzone viene tagliato con il suo audio, e ogni ricomposizione usa l\'esatta frazione di frame rate letta da ffprobe (ad esempio 30000/1001) e riallega quell\'audio come AAC, così tutti i risultati sono allineati per la riproduzione A/B.',
        },
        {
          question: 'Cosa contiene l\'archivio dei risultati e quanto è grande?',
          answer: 'original/clip.mp4, una cartella per modello con il suo MP4 (e, per Real-ESRGAN, SwinIR e HAT con i fotogrammi inclusi, ogni PNG migliorato al 4x nativo), manifest.json con tempi e dimensioni, e README.txt. Con i fotogrammi attivi, una clip di 10 secondi aggiunge centinaia di PNG di grandi dimensioni per modello, quindi aspettati gigabyte.',
        },
        {
          question: 'Cosa succede se un modello fallisce o va in timeout?',
          answer: 'Il lavoro prosegue. La cartella di quel modello contiene un FAILED.txt con il motivo, manifest.json lo registra e ogni altro modello selezionato viene comunque consegnato nell\'archivio. Il lavoro fallisce solo quando falliscono tutti i modelli selezionati.',
        },
        {
          question: 'Quanto dura un\'elaborazione di restauro?',
          answer: 'I fotogrammi per la stima di ciascun modello, sommati sui modelli scelti, visto che girano uno dopo l\'altro: 0.8, 1.0, 3.0, 3.5, 5.0 e 7.0 secondi per fotogramma per Real-ESRGAN, BasicVSR++, RVRT, SwinIR, HAT e VRT. Una clip da 300 fotogrammi attraverso tutti e sei richiede circa 100 minuti; con il solo Real-ESRGAN circa 4.',
        },
        {
          question: 'Quanti restauri posso eseguire, e costano un lavoro IA?',
          answer: 'Avviare un restauro consuma un lavoro IA: per impostazione predefinita 3 al giorno senza account, 10 con un account gratuito, 100 con Premium e 200 con Pro, più un limite di 2 avvii l\'ora per sessione. Un lavoro che fallisce del tutto viene rimborsato. Consulta la pagina dei prezzi per i numeri aggiornati.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Gli spezzoni sono limitati a 15 secondi o 450 fotogrammi (il valore più basso al frame rate del tuo video); si consigliano 10 secondi o meno.',
          'La risoluzione della sorgente è limitata a 1920×1080: il restauro è pensato per filmati a bassa risoluzione, e l\'output 4x di 1080p è già oltre il 4K.',
        ],
        processingNotes: [
          'I modelli girano dal più veloce al più lento (Real-ESRGAN per primo, VRT per ultimo), così i risultati parziali sono disponibili presto.',
          'Un modello fallito non affonda mai il lavoro: la sua cartella contiene un FAILED.txt e gli altri risultati restano scaricabili.',
          'I link di download restano validi per 6 ore; l\'archivio può essere grande quando sono inclusi i fotogrammi migliorati.',
        ],
      },
      related: [
        {
          label: 'Taglia video',
          to: '/tools/video-trimmer',
          description: 'Taglia lo spezzone da restaurare prima di caricarlo.',
        },
        {
          label: 'Restauro di immagini con IA',
          to: '/tools/ai-image-restoration',
          description: 'Le stesse famiglie di modelli per una singola foto o un fotogramma.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso di un risultato 4K restaurato per condividerlo.',
        },
        {
          label: 'Transcodifica in HLS',
          to: '/tools/transcode-to-hls',
          description: 'Impacchetta una clip restaurata per lo streaming adattivo.',
        },
        {
          label: 'Trascrivi video',
          to: '/tools/transcribe-video',
          description: 'Aggiungi sottotitoli al filmato restaurato.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Monta lo spezzone restaurato in un progetto più lungo.',
        },
      ],
      embed: {
        title: 'Restauro video con IA',
        description: 'Carica un video, seleziona trascinando uno spezzone breve (10 secondi o meno funziona meglio), scegli i modelli di restauro da confrontare e scarica un unico pacchetto con ogni risultato migliorato.',
      },
    },
    'ai-image-restoration': {
      name: 'Restauro e upscaling di immagini con IA',
      h1: 'Strumento di restauro e upscaling di immagini con IA',
      tagline: 'Pulisci, ingrandisci e restaura una foto con fino a otto modelli di IA: pre-pulizia fedele (FBCNN, SCUNet, NAFNet), upscaler generici (Real-ESRGAN, SwinIR, HAT) e miglioramento dei volti (GFPGAN, CodeFormer), e confronta ogni risultato con l\'originale.',
      metaTitle: 'Restauro e upscaling di immagini con IA: confronta 8 modelli | Media Manipulator',
      metaDescription: 'Restauro e ingrandimento di foto con IA, gratis. Rimuovi artefatti JPEG, rumore e sfocatura, ingrandisci fino a 4K/8K con Real-ESRGAN, SwinIR o HAT e migliora i volti con GFPGAN/CodeFormer, tutto sulla nostra GPU e confrontato affiancato.',
      ogTitle: 'Restauro e upscaling di immagini con IA: pre-pulizia, upscaling e miglioramento dei volti',
      ogDescription: 'Carica un\'immagine, ritagliala e pre-puliscila se vuoi, poi esegui più modelli di upscaling e per i volti e confronta ogni risultato in linea con l\'originale.',
      intro: 'Il restauro di immagini con IA passa una foto attraverso una pipeline configurabile di fino a otto modelli e mostra ogni risultato accanto all\'originale. Una fase di pre-pulizia fedele all\'originale (FBCNN per gli artefatti JPEG, SCUNet per il rumore, NAFNet per la sfocatura di movimento) rimuove il degrado senza inventare dettagli; gli upscaler generici (Real-ESRGAN, SwinIR, HAT) ingrandiscono poi 2x o 4x; e il miglioramento facoltativo dei volti (GFPGAN, CodeFormer) ricostruisce i visi. La pre-pulizia non è generativa: filtra il segnale che c\'è. Il miglioramento dei volti è generativo: sintetizza dettagli plausibili e non va considerato un recupero fedele della sorgente. Ogni modello gira sul nostro server GPU.',
      whatItDoes: [
        'Ti permette di selezionare trascinando un ritaglio, così il budget di pixel e il tempo GPU vanno alla zona che ti interessa; il ritaglio viene applicato lato server sull\'originale orientato automaticamente, quindi nel browser non si perde qualità.',
        'Facoltativamente pre-pulisce per primo, sempre nell\'ordine FBCNN, SCUNet, NAFNet, ogni modello lavorando sull\'output del precedente; l\'immagine pulita diventa la base da cui parte ogni modello successivo.',
        'Esegue qualsiasi combinazione di Real-ESRGAN, SwinIR e HAT a 2x o 4x. Tutti e tre sono reti native x4; un risultato 2x è l\'output x4 ridotto al 50 percento con un filtro Lanczos.',
        'Facoltativamente esegue GFPGAN v1.4 e, dove è abilitato sul server, CodeFormer con un peso di fedeltà, sulla sorgente e, con Catena attiva, anche sul risultato di ogni upscaler.',
        'Impacchetta l\'originale preparato, ogni PNG di output, un manifest.json e un README in un unico .tar.gz, e mostra una griglia di confronto in linea mentre l\'archivio viene servito dal lavoro.',
        'Registra un modello fallito come voce fallita con un motivo comprensibile e impacchetta comunque ogni risultato riuscito.',
      ],
      flowSteps: [
        {
          title: 'Carica un\'immagine',
          description: 'PNG, JPEG, WebP, TIFF o BMP fino a 12.000 pixel per lato; le foto vecchie, piccole e troppo compresse sono il bersaglio.',
        },
        {
          title: 'Ritaglia o tieni l\'intera inquadratura',
          description: 'Trascina una zona (un volto, una targa, un cartello) oppure lascia il ritaglio disattivato per restaurare tutto.',
        },
        {
          title: 'Scegli pre-pulizia, upscaler, volti, scala',
          description: 'Spunta i modelli che vuoi; il selettore mostra quanti output produrrà la selezione sui 12 consentiti.',
        },
        {
          title: 'Segui le fasi',
          description: 'Il lavoro si mette in coda per l\'unico slot di restauro, prepara l\'immagine, poi esegue ogni unità con il proprio avanzamento e il proprio indicatore di errore.',
        },
        {
          title: 'Confronta e scarica',
          description: 'Ogni risultato sta accanto all\'originale nella griglia; scarica l\'archivio quando hai deciso quale pipeline ha vinto.',
        },
      ],
      advancedDetails: [
        'La fase di preparazione esegue ImageMagick -auto-orient verso un PNG normalizzato, ne legge le dimensioni, rifiuta tutto ciò che supera 12.000 x 12.000, converte il tuo rettangolo di ritaglio normalizzato in pixel interi e scrive working_source.png. Quel file viene salvato anche come original.png nei risultati, così ciò con cui confronti è esattamente ciò che i modelli hanno ricevuto.',
        'La scala auto sceglie 4x quando il ritaglio è alto 540 pixel o meno e 2x altrimenti. Qualunque sia la scala, l\'output viene verificato rispetto a un budget di 67.108.864 pixel (circa 64 megapixel): un\'immagine intera da 6.000 x 4.000 a 2x fa 96 megapixel e viene rifiutata con un messaggio che ti invita a scegliere 2x o un ritaglio più piccolo.',
        'Real-ESRGAN esegue la rete realesrgan-x4plus tramite realesrgan-ncnn-vulkan con tile da 256 pixel. SwinIR usa i pesi GAN 003_realSR_BSRGAN SwinIR-L x4 e HAT i pesi Real_HAT_GAN_SRx4, entrambi tramite lo stesso script per fotogramma del Restauro video con IA, con tile da 320 pixel e sovrapposizione di 32 pixel, così i ritagli grandi non superano mai la memoria GPU.',
        'I pesi di pre-pulizia sono fbcnn_color.pth, scunet_color_real_psnr.pth (il modello per rumore reale addestrato su PSNR, non la variante GAN che inventa texture) e NAFNet-GoPro-width64.pth (sfocatura di movimento, non di fuoco). Girano in tile da 512 pixel con sovrapposizione di 32 pixel e non cambiano mai le dimensioni. FBCNN predice alla cieca il fattore di qualità JPEG a meno che tu non ne imposti uno da 1 a 100; un numero più basso presume una compressione più pesante.',
        'GFPGAN usa l\'architettura clean v1.4 con l\'upsampling dello sfondo disattivato, così al di fuori dei volti l\'immagine viene semplicemente ridimensionata del fattore di scala anziché migliorata dal modello; questo mantiene onesto il confronto. CodeFormer accetta un peso di fedeltà w da 0 a 1 (predefinito 0.7): più basso è più gradevole, più alto resta più vicino all\'ingresso. CodeFormer è distribuito con licenza non commerciale ed è dietro un flag del server disattivato per impostazione predefinita.',
        'Catena riesegue ogni modello per i volti a 1x sull\'output di ogni upscaler oltre che sulla sorgente, quindi il numero di output è pre-pulizia + generici + volti + volti x generici. Il server limita un lavoro a 12 output, esegue un lavoro di restauro alla volta e concede a ogni modello 1.800 secondi prima di segnarlo come in timeout.',
        'Il server stima il tempo di esecuzione per modello dai propri valori predefiniti di secondi per megapixel: FBCNN 3, SCUNet 8, NAFNet 6, Real-ESRGAN 2, SwinIR 12, HAT 18, GFPGAN 6, CodeFormer 8. Alimentano i pesi dell\'avanzamento e la stima nell\'interfaccia; sono valori di taratura, non una garanzia.',
        'I risultati non vengono caricati nello storage a oggetti: il .tar.gz e i PNG dei risultati restano nella cartella di output del lavoro e vengono serviti dal lavoro per il periodo di conservazione.',
      ],
      whyItMatters: [
        'Nessun modello vince su ogni foto: rimozione degli artefatti, riduzione del rumore, upscaling e ricostruzione dei volti correggono ciascuno un danno diverso, e l\'ordine giusto dipende da come l\'immagine si è degradata.',
        'Eseguire più modelli su un unico caricamento e vederli affiancati risponde alla domanda "quale, e a quale scala?" prima di impegnarti in un lotto più grande.',
        'La distinzione tra non generativo e generativo conta: un\'immagine pre-pulita è una copia filtrata della prova, una con i volti migliorati è una ricostruzione plausibile, e la pagina indica quale è quale.',
      ],
      useCases: [
        {
          title: 'Restauro di foto vecchie o scansionate',
          description: 'Pre-pulisci il rumore dello scanner e la compressione, poi ingrandisci e, se vuoi, ricostruisci i volti.',
        },
        {
          title: 'Miglioramento di fermi immagine a bassa risoluzione',
          description: 'Ritaglia la zona di interesse, rimuovi gli artefatti e ingrandisci; concatena il miglioramento dei volti per chiarezza, mai come prova di identificazione.',
        },
        {
          title: 'Correzione di download compressi',
          description: 'Le esportazioni social ricompresse pesantemente rispondono bene a FBCNN e poi SCUNet, seguiti da un upscaler GAN.',
        },
        {
          title: 'Confronto di upscaler prima di un lotto',
          description: 'Passa un\'immagine rappresentativa attraverso Real-ESRGAN, SwinIR e HAT per scegliere il modello per un insieme più grande.',
        },
        {
          title: 'Concentrare il budget su una sola zona',
          description: 'Seleziona trascinando solo un volto o un cartello, così il budget di 64 megapixel e il tempo GPU vanno dove contano.',
        },
      ],
      workedExamples: [
        {
          title: 'Un JPEG da 1.200 x 800 (circa 350 KB), inquadratura intera, scala auto, FBCNN + Real-ESRGAN + GFPGAN',
          body: 'Il ritaglio è l\'intera inquadratura da 0.96 megapixel e la sua altezza di 800 pixel supera 540, quindi la scala auto si risolve in 2x. FBCNN gira per primo a 1x e il suo output diventa la sorgente di lavoro. Real-ESRGAN la ingrandisce a 4.800 x 3.200 con realesrgan-x4plus, poi ImageMagick la ridimensiona al 50 percento con Lanczos per un PNG da 2.400 x 1.600. GFPGAN gira sulla sorgente pre-pulita con upscale 2, dando un altro PNG da 2.400 x 1.600 con i volti ricostruiti e il resto semplicemente ridimensionato. Sono tre output sui 12 consentiti. Secondo le stime per megapixel del server, il tempo dei modelli è circa 0.96 x (3 + 2 + 6), intorno agli 11 secondi, più qualche secondo di preparazione e impacchettamento; l\'attesa per l\'unico slot di restauro può aggiungerne altri. Un lavoro consuma un lavoro IA.',
        },
        {
          title: 'Un ritaglio di volto da 300 x 400 su un fermo immagine da 640 x 480, pre-pulizia, tre upscaler, GFPGAN con Catena',
          body: 'Il ritaglio è di 0.12 megapixel e alto 400 pixel, quindi la scala auto sceglie 4x e ogni risultato ingrandito è 1.200 x 1.600 (1.92 megapixel), ben dentro il budget di 64 megapixel. Con la pre-pulizia FBCNN e SCUNet, Real-ESRGAN, SwinIR e HAT, e GFPGAN concatenato, il lavoro produce 2 + 3 + 1 + 1 x 3 = 9 output: due passaggi di pre-pulizia, tre ingrandimenti, GFPGAN sulla sorgente pulita e GFPGAN su ogni risultato ingrandito a 1x. I passaggi di pre-pulizia e upscaling su 0.12 megapixel richiedono ciascuno pochi secondi secondo le stime del server, mentre i tre passaggi concatenati sui volti girano sui risultati da 1.92 megapixel e durano proporzionalmente di più. Ogni output dei volti porta una nota generativa nel manifest, perché ciò che vedi in quei volti è ricostruzione, non recupero.',
        },
      ],
      whenNotToUse: 'Non usare il miglioramento dei volti per l\'identificazione: GFPGAN e CodeFormer disegnano volti plausibili a partire da un prior appreso, quindi un volto ricostruito è al massimo un indizio e mai una prova di chi c\'era nella foto. Evita lo strumento per immagini già grandi e nitide, dove un passaggio 2x aggiunge per lo più texture GAN, e per foto più grandi di 12.000 pixel per lato, che vengono rifiutate. Se ti serve solo una copia più grande di un\'immagine pulita, senza pre-pulizia, modelli per i volti o griglia di confronto, l\'Upscaler di immagini con IA è più rapido. E se il tuo danno è una sfocatura di fuoco anziché di movimento, i pesi GoPro di NAFNet sono il modello sbagliato.',
      whyMediaManipulator: [
        'Otto modelli di ricerca dietro un unico caricamento, senza notebook, configurazione CUDA o file di pesi da gestire.',
        'Ogni modello gira su un server GPU gestito da noi; l\'immagine non viene inviata a un servizio di IA di terze parti.',
        'La pagina mantiene onesta la distinzione: gli output di pre-pulizia portano una nota di fedeltà, quelli dei volti una nota generativa, e l\'originale preparato è sempre nella griglia.',
      ],
      privacyNote: 'La tua immagine viene salvata nella cartella del suo lavoro, orientata automaticamente e ritagliata da ImageMagick in un PNG di lavoro, ed elaborata dai modelli selezionati sulla nostra GPU. Al termine del lavoro la cartella dei caricamenti e l\'albero di lavoro vengono eliminati; ciò che resta con il lavoro è l\'originale preparato, ogni PNG di risultato, il manifest e il .tar.gz impacchettato, serviti dal lavoro per il download e per la griglia di confronto. Gli output dei modelli per i volti sono etichettati in quel manifest come ricostruzioni generative. Nessun fornitore di IA di terze parti riceve l\'immagine. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      faq: [
        {
          question: 'Qual è la differenza tra la pre-pulizia e i modelli di upscaling o per i volti?',
          answer: 'I modelli di pre-pulizia (FBCNN, SCUNet, NAFNet) non sono generativi: rimuovono artefatti di compressione, rumore e sfocatura di movimento filtrando il segnale esistente a 1x. Gli upscaler aggiungono risoluzione, e i modelli per i volti (GFPGAN, CodeFormer) sono generativi, sintetizzano dettagli facciali plausibili. Un output di pre-pulizia è un\'immagine filtrata fedele; un output dei volti è una ricostruzione.',
        },
        {
          question: 'Un volto migliorato può essere usato come prova di identificazione?',
          answer: 'No. GFPGAN e CodeFormer producono volti plausibili a partire da un prior appreso; non recuperano il volto reale. Il manifest contrassegna ogni output dei volti con una nota generativa proprio per questo. Usali solo per chiarezza visiva e come indizi.',
        },
        {
          question: 'Perché i modelli di pre-pulizia girano in un ordine fisso qualunque cosa spunti?',
          answer: 'Gli artefatti di compressione vanno rimossi prima della riduzione del rumore, altrimenti il denoiser tratta i blocchi come segnale, e la riduzione della sfocatura funziona meglio sull\'ingresso più pulito, quindi il server esegue sempre FBCNN, poi SCUNet, poi NAFNet, ciascuno sul risultato precedente. Se uno di essi fallisce, il successivo prosegue dall\'ultimo passaggio riuscito.',
        },
        {
          question: 'Come decide Auto tra 2x e 4x, e qual è il limite di dimensione?',
          answer: 'Auto sceglie 4x quando il ritaglio è alto al massimo 540 pixel e 2x altrimenti. L\'output viene poi verificato rispetto a un budget di circa 64 megapixel (67.108.864 pixel); una richiesta che lo supera viene rifiutata indicando il numero di megapixel e suggerendo di scegliere 2x o un ritaglio più piccolo. Le sorgenti oltre 12.000 pixel su uno dei due lati vengono rifiutate prima ancora.',
        },
        {
          question: 'Cosa fa Catena al numero di output?',
          answer: 'Con Catena attiva, ogni modello per i volti gira anche a 1x sul risultato di ogni upscaler, quindi output = pre-pulizia + generici + volti + volti x generici. Due upscaler e due modelli per i volti con la catena fanno 2 + 2 + 4 = 8 output prima di qualsiasi pre-pulizia; il server ne consente 12 per lavoro.',
        },
        {
          question: 'Cosa succede se un modello di immagine fallisce o va in timeout?',
          answer: 'Il lavoro prosegue. L\'unità viene segnata come fallita con un motivo comprensibile (ad esempio un timeout dopo 1.800 secondi con il suggerimento di un ritaglio più piccolo o del 2x), il manifest lo registra, e ogni altro risultato viene comunque impacchettato e mostrato. Il lavoro fallisce solo quando falliscono tutti i modelli selezionati, e in quel caso il lavoro IA viene rimborsato.',
        },
        {
          question: 'Perché CodeFormer è disattivato?',
          answer: 'CodeFormer ha una licenza per uso non commerciale, quindi sta dietro un flag del server disattivato per impostazione predefinita; le capacità lo segnalano allora come attualmente disabilitato. GFPGAN e i tre modelli di pre-pulizia hanno licenze permissive e sono disponibili ogni volta che i loro pesi sono installati.',
        },
        {
          question: 'Quanti restauri posso eseguire, ed è gratuito?',
          answer: 'Avviare un restauro consuma un lavoro IA: 3 al giorno come ospite, 10 con un account gratuito, 100 con Premium e 200 con Pro per impostazione predefinita, indipendentemente da quanti modelli spunti in quel lavoro. C\'è anche un limite dedicato di 6 avvii per sessione all\'ora. Il limite di caricamento è 200 MB per gli ospiti e 1 GB con un account gratuito; /pricing mostra i numeri aggiornati.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'L\'output è limitato da un budget di pixel (~64 megapixel), ben oltre l\'8K: se un ritaglio e una scala lo superassero, scegli 2x o un ritaglio più piccolo.',
          'I modelli di pre-pulizia non cambiano mai le dimensioni (1x); solo gli upscaler generici cambiano la risoluzione.',
        ],
        processingNotes: [
          'La pre-pulizia gira sempre per prima in un ordine fisso (FBCNN → SCUNet → NAFNet); l\'immagine pulita diventa la base per ogni altro modello.',
          'Un modello fallito non affonda mai il lavoro: la sua voce mostra il motivo e gli altri risultati restano scaricabili.',
          'Il miglioramento dei volti è una ricostruzione generativa: usalo per chiarezza e come indizio, non come prova di identificazione.',
        ],
      },
      related: [
        {
          label: 'Restauro video con IA',
          to: '/tools/ai-video-restoration',
          description: 'Il fratello per le immagini in movimento: gli stessi upscaler su una clip breve.',
        },
        {
          label: 'Upscaler di immagini con IA',
          to: '/tools/ai-image-upscaler',
          description: 'Un singolo passaggio Real-ESRGAN quando ti serve solo un\'immagine più grande.',
        },
        {
          label: 'Rimuovi lo sfondo',
          to: '/tools/remove-background-from-image',
          description: 'Ritaglia il soggetto dopo averlo restaurato.',
        },
        {
          label: 'Comprimi immagine',
          to: '/tools/compress-image',
          description: 'Riduci il peso del PNG restaurato per condividerlo.',
        },
        {
          label: 'Ridimensiona immagine',
          to: '/tools/image-resizer',
          description: 'Ridimensiona l\'immagine restaurata a dimensioni esatte.',
        },
        {
          label: 'Rimuovi i metadati EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimina i metadati dal risultato prima di pubblicarlo.',
        },
      ],
      embed: {
        title: 'Restauro e upscaling di immagini con IA',
        description: 'Carica un\'immagine, ritaglia facoltativamente una zona, pre-puliscila se vuoi, scegli i modelli di upscaling e di miglioramento dei volti da confrontare e scarica un unico pacchetto con ogni risultato.',
      },
    },
    'ai-document-scan': {
      name: 'Scansione documenti con IA',
      h1: 'Scansione documenti con IA: pagine scansionate e scrittura a mano in PDF / Word ricercabili',
      tagline: 'Trasforma documenti scansionati e appunti scritti a mano in un PDF multipagina ricercabile e in un documento Word modificabile: le pagine stampate ottengono un fedele livello di testo Tesseract, la scrittura a mano viene trascritta da una IA di visione con l\'incertezza segnalata, mai inventata.',
      metaTitle: 'Scansione documenti con IA: pagine scansionate e scrittura a mano in PDF/Word | Media Manipulator',
      metaDescription: 'Scansione di documenti con IA, gratis: converti immagini scansionate in PDF ricercabile e in Word con OCR, e trascrivi appunti scritti a mano in testo. Riordina le pagine, mescola stampato e manoscritto, tutto sulla nostra GPU, alla lettera e con l\'incertezza segnalata.',
      ogTitle: 'Scansione documenti con IA: PDF ricercabile + Word da scansioni e scrittura a mano',
      ogDescription: 'Carica una o più pagine scansionate, stampate o scritte a mano, riordinale e ottieni un PDF ricercabile e un DOCX modificabile. Le pagine stampate restano fedeli; la scrittura a mano viene trascritta alla lettera con i marcatori [illegible]/[?] conservati.',
      intro: 'La Scansione documenti con IA trasforma una o più pagine fotografate o scansionate in un PDF multipagina ricercabile e, se lo richiedi, in un documento Word modificabile. Tratta due tipi di pagina in modo diverso e ti dice quale è quale. Le pagine stampate o dattiloscritte passano per OCRmyPDF e Tesseract: la pagina di output è la tua scansione, intatta, con sotto un livello di testo invisibile che ti permette di cercare, selezionare e copiare. Le pagine scritte a mano vengono lette da un modello visione-linguaggio in esecuzione sulla nostra GPU, che trascrive la scrittura parola per parola, segna ciò che non riesce a leggere come [illegible], racchiude una parola dubbia in [?: ipotesi migliore] e ha l\'istruzione di non completare, correggere o sistemare mai nulla. Un singolo lavoro può mescolare entrambi i tipi, pagina per pagina, nell\'ordine che imposti tu, e il risultato indica il motore e il livello di confidenza per ogni pagina.',
      whatItDoes: [
        'Accetta fino a 50 immagini di pagina per lavoro (PNG, JPEG, WebP, TIFF, BMP o HEIC, 25 MB ciascuna per impostazione predefinita), normalizza ciascuna in un PNG dritto e ti lascia prima trascinarle nell\'ordine di lettura.',
        'In modalità Auto pone al modello di visione una domanda per pagina (stampata o scritta a mano?) e indirizza la pagina di conseguenza; le modalità Stampato e Scrittura a mano forzano la risposta.',
        'Costruisce un PDF/A in cui ogni pagina stampata è la scansione originale più un livello di testo Tesseract, e ogni pagina scritta a mano è la scansione più un livello invisibile di trascrizione automatica posizionato riga per riga, con un piè di pagina visibile che lo dichiara.',
        'Facoltativamente costruisce un documento Word: le pagine stampate ricostruite come titoli, elenchi e tabelle da PaddleOCR-VL (o Docling), le pagine scritte a mano come trascrizione letterale sotto una nota in grassetto che invita a verificare rispetto alla scansione, impaginate da Pandoc.',
        'Riporta, per ogni pagina, il motore usato, una confidenza alta, media o bassa e il numero di marcatori di incertezza, così sai dove guardare.',
        'Può eseguire un passaggio di verifica che rilegge solo i token segnalati, una seconda opinione indipendente che segnala i disaccordi come [?: vlm | other] e un riassunto IA etichettato a parte, quando il server ha quei motori abilitati.',
      ],
      flowSteps: [
        {
          title: 'Aggiungi le tue pagine',
          description: 'Trascina un\'immagine di pagina per file, stampata o scritta a mano o un misto, e mettile in ordine trascinandole.',
        },
        {
          title: 'Scegli modalità e output',
          description: 'Auto, Stampato o Scrittura a mano; PDF sempre, Word facoltativo; la lingua Tesseract per le pagine stampate; raddrizzamento e rotazione automatica per l\'OCR del testo stampato.',
        },
        {
          title: 'Preparazione e lettura',
          description: 'Le pagine vengono orientate automaticamente e, per la scrittura a mano, ingrandite 2x con Real-ESRGAN prima che il modello le legga; le pagine stampate attendono Tesseract nella fase PDF.',
        },
        {
          title: 'Creazione dei file',
          description: 'OCRmyPDF e reportlab creano i PDF per pagina, pikepdf li unisce; il documento Word viene assemblato dal Markdown con Pandoc.',
        },
        {
          title: 'Rivedi e scarica',
          description: 'Un visualizzatore si apre sul PDF; scaricalo, insieme al file Word se richiesto e al manifest che registra motore e confidenza di ogni pagina.',
        },
      ],
      advancedDetails: [
        'Pagine stampate: il PNG normalizzato viene incapsulato senza perdita con img2pdf, poi OCRmyPDF esegue Tesseract con i tuoi codici lingua, deskew e rotate_pages se spuntati, output_type pdfa e force_ocr, e scrive il livello di testo sotto l\'immagine. Se OCRmyPDF fallisce su una pagina, la pagina con la sola immagine viene mantenuta, così il PDF resta completo.',
        'Pagine scritte a mano: il modello è qwen3-vl (8B, instruct, quantizzazione q8_0) servito da Ollama a temperatura 0.1, con l\'istruzione di trascrivere alla lettera, mantenere le interruzioni di riga, segnare [illegible] e [?: ipotesi], annotare segni come (freccia) o (cerchiato) e restituire JSON con il testo completo e un riquadro di delimitazione per riga.',
        'La pagina PDF per la scrittura a mano viene disegnata con reportlab alle dimensioni in pixel dell\'immagine: la scansione è la pagina visibile, ogni riga trascritta viene posizionata nel suo riquadro in modalità di rendering del testo 3 (ricercabile, mai disegnata) in Helvetica con un corpo pari all\'altezza della riga tra 6 e 48 punti, con un blocco invisibile a pagina intera come ripiego quando non arrivano riquadri, e un piè di pagina grigio a 8 punti con la scritta "Machine transcription, verify against original".',
        'La confidenza è calcolata, non stimata: alta quando una pagina non ha marcatori, media quando meno del 15 percento delle sue righe ne porta uno, bassa altrimenti. Il passaggio di verifica (attivo per impostazione predefinita) rimanda al modello la pagina e la bozza con l\'istruzione di risolvere solo i token segnati e non cambiare nient\'altro; se fallisce, la bozza viene mantenuta.',
        'La pre-pulizia per la scrittura a mano è realesrgan-x4plus a scala 2 sulla GPU Vulkan, attiva per impostazione predefinita in Auto e Scrittura a mano e disattivata in Stampato; è best effort e gli originali vengono mantenuti se fallisce. Il documento Word viene costruito da Markdown in stile GitHub con Pandoc; il riassunto facoltativo usa un modello di testo separato e viene scritto in un proprio file con un\'etichetta di contenuto generato dall\'IA.',
        'Sul server gira per impostazione predefinita un solo lavoro documenti alla volta, ogni chiamata al modello ha un tetto di 40 minuti, e i caricamenti e la cartella di lavoro vengono eliminati nell\'istante in cui il lavoro termina; solo la cartella dei risultati (PDF, DOCX, manifest.json, README.txt) resta per il periodo di conservazione.',
      ],
      whyItMatters: [
        'La foto di una pagina non è un documento finché non può essere cercata e citata. Il PDF aggiunge questo senza toccare i pixel, così la scansione resta l\'autorità.',
        'Un riconoscimento della scrittura a mano che tira a indovinare con sicurezza è peggio di nessun riconoscimento. Marcatori espliciti [illegible] e [?: ipotesi], una confidenza per pagina e un\'etichetta visibile rendono la trascrizione utilizzabile come bozza e mai confondibile con l\'originale.',
        'Pagine stampate e scritte a mano hanno bisogno di motori diversi. Indirizzare ogni pagina a quello giusto, dentro un unico lavoro ordinato, è ciò che fa uscire un quaderno con un modulo stampato e risposte scritte a mano come un unico file.',
      ],
      useCases: [
        {
          title: 'Documenti cartacei ricercabili',
          description: 'Contratti, ricevute e moduli scansionati diventano un unico PDF/A in cui cercare e da cui copiare, con le immagini delle pagine intatte.',
        },
        {
          title: 'Quaderni di campo e di laboratorio',
          description: 'Gli appunti scritti a mano diventano un PDF ricercabile e una bozza Word con ogni parola incerta segnata perché tu la controlli.',
        },
        {
          title: 'Da immagine a Word',
          description: 'Una pagina stampata fotografata con il telefono diventa un .docx modificabile con titoli, elenchi e tabelle ricostruiti.',
        },
        {
          title: 'Documenti misti',
          description: 'Un questionario stampato con risposte scritte a mano passa per entrambi i motori e torna come un unico file ordinato.',
        },
        {
          title: 'Archivi',
          description: 'Vecchie lettere e verbali dattiloscritti acquistano un livello di testo per l\'indicizzazione mentre la scansione resta esattamente com\'era.',
        },
      ],
      workedExamples: [
        {
          title: 'Tre pagine A4 stampate a 300 dpi',
          body: 'Tre scansioni JPEG da 2480 x 3508 in modalità Stampato, solo PDF, lingua eng, raddrizzamento e rotazione automatica attivi. Nessun modello è coinvolto: ogni pagina viene incapsulata da img2pdf, poi OCRmyPDF esegue Tesseract e scrive un livello di testo invisibile, produce PDF/A, e pikepdf unisce le tre in document.pdf. Il livello di testo aggiunge solo kilobyte per pagina, quindi il PDF pesa più o meno quanto le tre immagini delle pagine (una pagina raddrizzata viene ri-renderizzata, una non toccata viene incorporata com\'è). Il lavoro consuma un lavoro IA (rimborsato se fallisce) e il suo tempo è quello di Tesseract sulla CPU, pagina dopo pagina, più l\'eventuale attesa in coda, visto che per impostazione predefinita gira un solo lavoro documenti alla volta.',
        },
        {
          title: 'Due pagine scritte a mano fotografate con il telefono, con Word',
          body: 'Due foto da 4032 x 3024 scattate con il telefono a pagine di quaderno in modalità Auto con PDF e DOCX. La preparazione orienta automaticamente entrambe in PNG e, poiché la modalità non è Stampato, le ingrandisce 2x con realesrgan-x4plus a 8064 x 6048. La classificazione pone a qwen3-vl una domanda per pagina, il riconoscimento restituisce la trascrizione con un riquadro di delimitazione per riga e la verifica rilegge solo i token segnalati. Se una pagina ha 30 righe e 2 di esse portano marcatori [?: ...], 2 / 30 è sotto il 15 percento e la pagina viene segnata con confidenza media e illegibleCount 2. Le pagine PDF sono le immagini elaborate con righe Helvetica invisibili in quei riquadri e il timbro a piè di pagina; il file Word contiene il testo letterale sotto la nota di verifica in grassetto. Il tempo è di tre passaggi sequenziali del modello di visione per pagina sulla nostra GPU; nulla viene eseguito altrove.',
        },
      ],
      whenNotToUse: 'Non usarlo quando hai bisogno che il testo sia autorevole senza controllarlo: l\'output della scrittura a mano è una lettura automatica con lacune segnate, e il documento Word e il riassunto sono ricostruzioni, quindi verificali rispetto alla scansione prima di citarli. Non è uno strumento OCR da PDF a PDF: gli ingressi sono immagini di pagina, quindi converti prima un PDF esistente in immagini, e non è un traduttore. Se ti serve solo rilegare le pagine in un PDF senza livello di testo, il semplice strumento da immagine a PDF lo fa come lavoro ordinario anziché come lavoro IA, il che conserva la quota ospite di tre lavori IA al giorno per il lavoro che richiede un modello.',
      whyMediaManipulator: [
        'Il PDF per il testo stampato è fedele per costruzione: OCRmyPDF colloca il testo sotto un\'immagine di pagina intatta e produce PDF/A, nulla viene ridisegnato.',
        'La scrittura a mano è letterale e con prove: il prompt vieta di inventare, l\'incertezza è segnata nel testo, la confidenza viene contata da quei segni e la pagina dichiara di essere una trascrizione automatica.',
        'Ogni motore è nostro: Tesseract su CPU, qwen3-vl e il modello di testo tramite Ollama, PaddleOCR-VL e Real-ESRGAN sulle nostre GPU. Nessuna pagina va a un servizio di IA di terze parti.',
      ],
      privacyNote: 'Le immagini delle tue pagine vengono salvate in uploads/<jobId>/src/ e le copie normalizzate in una cartella di lavoro; le pagine scritte a mano vengono inviate al modello qwen3-vl servito da Ollama sulla nostra GPU, le pagine stampate vengono lette da Tesseract sulla CPU, e le bozze di trascrizione per pagina vengono conservate come JSON in quella cartella di lavoro mentre il lavoro è in corso. Al termine del lavoro, sia i caricamenti sia la cartella di lavoro vengono eliminati immediatamente; ciò che resta è la cartella dei risultati in outputs/<jobId>/ con il PDF, il file Word se richiesto, il manifest (motore, confidenza e conteggio dei marcatori per pagina) e un README, e quella cartella viene rimossa alla fine del periodo di conservazione. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Il testo trascritto vive dentro il livello di testo del PDF e nel DOCX che scarichi. Nulla viene inviato a un fornitore di IA di terze parti e nulla viene usato per l\'addestramento.',
      faq: [
        {
          question: 'Qual è la differenza tra il PDF e il documento Word?',
          answer: 'Il PDF è la tua scansione con un livello di testo ricercabile: un livello Tesseract sotto una pagina stampata, una trascrizione automatica invisibile sotto una scritta a mano, in entrambi i casi con l\'immagine originale come pagina visibile. Il documento Word è una ricostruzione separata: le pagine stampate come titoli, elenchi e tabelle prodotti da PaddleOCR-VL o Docling, le pagine scritte a mano come trascrizione letterale sotto una nota in grassetto che ti invita a verificarla. Considera l\'immagine del PDF come l\'autorità e il DOCX come una bozza.',
        },
        {
          question: 'Quanto è affidabile la trascrizione della scrittura a mano?',
          answer: 'È una lettura automatica accurata, non una trascrizione certificata. Il modello ha l\'istruzione di copiare esattamente ciò che è scritto, di segnare tutto ciò che è illeggibile come [illegible] e ogni parola dubbia come [?: ipotesi migliore], e di non inventare né correggere mai. Ogni pagina riceve una confidenza (alta senza marcatori, media sotto il 15 percento di righe segnate, bassa oltre) e un conteggio dei marcatori, e la pagina PDF porta un piè di pagina visibile di trascrizione automatica. Confronta le parole segnalate con la scansione.',
        },
        {
          question: 'Posso mescolare pagine stampate e pagine scritte a mano?',
          answer: 'Sì. In modalità Auto al modello di visione viene chiesto, per ogni pagina, se è prevalentemente stampata o scritta a mano, e la pagina va a Tesseract o al modello per la scrittura a mano di conseguenza. Il manifest registra la risposta per pagina, e il PDF e il file Word finali mantengono l\'ordine che hai impostato prima di avviare.',
        },
        {
          question: 'Quali lingue supporta l\'OCR del testo stampato?',
          answer: 'I codici lingua di Tesseract, uniti da un segno più per le pagine miste (ad esempio eng+fra). I codici offerti dal server sono elencati nel modulo; l\'inglese è installato per impostazione predefinita e gli altri compaiono man mano che vengono aggiunti. La scrittura a mano viene letta da un modello di visione e non usa questi codici.',
        },
        {
          question: 'Quali sono i limiti per lavoro?',
          answer: 'Per impostazione predefinita fino a 50 immagini di pagina per lavoro (ogni immagine è una pagina, quindi 50 è in pratica anche il limite di pagine), 25 MB per immagine, un lavoro in esecuzione alla volta per server (gli altri attendono in coda) e un tetto di 40 minuti per fase del modello. Ogni lavoro consuma un lavoro IA: 3 al giorno senza account, 10 con un account gratuito, 100 con Premium e 200 con Pro, con l\'unità rimborsata quando un lavoro fallisce. I numeri aggiornati sono nella pagina dei prezzi.',
        },
        {
          question: 'Perché il mio PDF di scrittura a mano ha un piè di pagina, e posso rimuoverlo?',
          answer: 'Ogni pagina scritta a mano porta una piccola riga grigia "Machine transcription, verify against original", e la sezione Word ha un equivalente in grassetto, perché una copia ricercabile di una scrittura a mano può essere confusa con una verificata. Fanno parte dell\'output per scelta e non possono essere disattivati. Le pagine stampate, il cui livello è l\'output deterministico di Tesseract, non portano alcun timbro.',
        },
        {
          question: 'Le mie pagine lasciano i vostri server?',
          answer: 'No. Tesseract gira sulla CPU, il modello per scrittura a mano e classificazione gira tramite Ollama sulla nostra GPU, e il motore di struttura e l\'upscaler girano su una seconda GPU nella stessa macchina. I caricamenti e i file di lavoro vengono eliminati appena il lavoro termina.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Aggiungi fino a 50 immagini di pagina per lavoro per impostazione predefinita; ogni immagine di pagina ha un limite di dimensione individuale (~25 MB).',
          'Viene sempre prodotto un PDF ricercabile; il documento Word modificabile è facoltativo.',
        ],
        processingNotes: [
          'Le pagine stampate usano un OCR deterministico (OCRmyPDF + Tesseract) per un livello di testo fedele e ricercabile.',
          'La scrittura a mano viene trascritta alla lettera da una IA di visione con i marcatori [illegible]/[?] conservati: è una trascrizione automatica, non la pagina autorevole.',
          'Il documento Word e qualsiasi riassunto IA sono ricostruzioni: verificali rispetto alla scansione originale.',
        ],
      },
      related: [
        {
          label: 'Da immagine a PDF',
          to: '/tools/image-to-pdf',
          description: 'Rilega le immagini delle pagine in un PDF senza livello di testo, come lavoro ordinario.',
        },
        {
          label: 'Da PDF a JPG',
          to: '/tools/pdf-to-jpg',
          description: 'Converti un PDF esistente in immagini di pagina da dare in pasto alla scansione.',
        },
        {
          label: 'Restauro di immagini con IA',
          to: '/tools/ai-image-restoration',
          description: 'Ripara una scansione sbiadita o sfocata prima di trascriverla.',
        },
        {
          label: 'Rimuovi i metadati EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimina i tag di posizione e dispositivo dalle foto di documenti scattate con il telefono.',
        },
        {
          label: 'Oscura il testo in un\'immagine',
          to: '/tools/redact-text-in-image',
          description: 'Oscura nomi o numeri su una pagina prima di condividere la scansione.',
        },
      ],
      embed: {
        title: 'Scansione documenti con IA',
        description: 'Aggiungi una o più immagini di pagine scansionate (documenti stampati o appunti scritti a mano), riordinale se serve, scegli una modalità di contenuto e gli output, e ottieni un PDF ricercabile più un documento Word facoltativo.',
      },
    },
    'ai-image-upscaler': {
      name: 'Upscaler di immagini con IA',
      h1: 'Upscaler di immagini con IA: ingrandisci le foto 2x o 4x online',
      tagline: 'Ingrandisci una foto piccola o morbida con un modello Real-ESRGAN che ricostruisce i dettagli fini invece di limitarsi a stirare i pixel.',
      metaTitle: 'Upscaler di immagini con IA: ingrandisci le foto 2x o 4x | Media Manipulator',
      metaDescription: 'Ingrandisci una foto a bassa risoluzione 2x o 4x con una IA che ripristina bordi e texture. Funziona sulla nostra GPU, output in PNG. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Upscaler di immagini con IA: ingrandisci le foto 2x o 4x',
      ogDescription: 'Ingrandisci foto piccole o morbide con un modello IA Real-ESRGAN che ricostruisce i dettagli invece di stirare i pixel.',
      intro: 'Questa pagina apre il convertitore di immagini con Upscaling IA bloccato e l\'output impostato su PNG. Il server esegue realesrgan-ncnn-vulkan, la build Vulkan di Real-ESRGAN, su una GPU di nostra proprietà: il modello predefinito è realesrgan-x4plus a 4x, con realesrgan-x4plus-anime e realesr-animevideov3 disponibili per disegni e fotogrammi di animazione, e 2x come scala alternativa. Invece di interpolare tra i pixel esistenti, la rete prevede l\'aspetto di bordi, pelle, tessuti e fogliame alla dimensione maggiore e disegna quei dettagli. Il risultato viene scritto come PNG senza perdita, così nessun nuovo artefatto di compressione si accumula sopra i dettagli sintetizzati.',
      whatItDoes: [
        'Ingrandisce un\'immagine a 2x o 4x della sua larghezza e altezza con un modello Real-ESRGAN in esecuzione sulla nostra GPU.',
        'Ti permette di scegliere nel modulo tra un modello per foto e due modelli in stile anime; 4x e il modello per foto sono preselezionati.',
        'Produce sempre PNG; l\'API forza l\'estensione .png per questa operazione.',
        'Suddivide automaticamente l\'immagine in tile sulla GPU, così gli input grandi non esauriscono la memoria video.',
        'Consuma un lavoro IA dalla quota giornaliera di IA, un contatore a sé; la quota ordinaria per le conversioni non viene toccata.',
      ],
      flowSteps: [
        {
          title: 'Carica un\'immagine piccola o morbida',
          description: 'JPG, PNG o WebP. Più piccolo è l\'input, più il modello deve inventare.',
        },
        {
          title: 'Scegli 4x o 2x e un modello',
          description: 'realesrgan-x4plus per le foto, i modelli anime per disegni al tratto e fotogrammi di cartoni.',
        },
        {
          title: 'Real-ESRGAN gira sulla GPU',
          description: 'realesrgan-ncnn-vulkan -i in -o out -n <model> -s <2|4> -t 0 -g <gpu> -f png',
        },
        {
          title: 'Scarica il PNG',
          description: 'converted.png a 2x o 4x delle dimensioni in pixel originali.',
        },
      ],
      advancedDetails: [
        'La chiamata è UpscaleImage in ai_tools.go. Avvia realesrgan-ncnn-vulkan con -n per il modello, -s per la scala, -t 0 per la dimensione automatica dei tile, -g per l\'indice della GPU e -f png; l\'ICD Vulkan è fissato tramite variabili d\'ambiente, così il loader trova sempre il driver NVIDIA.',
        'Sono accettate solo le scale 2 e 4 e solo i tre nomi di modello realesrgan-x4plus, realesrgan-x4plus-anime e realesr-animevideov3; qualsiasi altro valore viene rifiutato prima dell\'avvio del lavoro.',
        '2x esegue la stessa rete x4 a metà scala. Il modulo riporta una nota secondo cui 2x può apparire leggermente ritagliato o zoomato su alcune immagini, cosa osservata sul server con una foto da 640 x 360; l\'API deliberatamente non lo nasconde eseguendo 4x e riducendo.',
        'Poiché il percorso IA salta ImageMagick e la copia con exiftool, le impostazioni di qualità, ridimensionamento, filtro e metadati del modulo qui non fanno nulla, e il PNG non porta alcun EXIF dell\'originale.',
        'Il numero di pixel cresce con il quadrato della scala: 4x significa 16 volte più pixel e 2x significa 4 volte. L\'RGB non compresso dell\'output è larghezza x altezza x 3 byte, il che limita quanto può essere grande il PNG.',
        'Non c\'è un limite lato server alle dimensioni dell\'input specifico per questa operazione, oltre al limite di dimensione per file del tuo piano; gli input molto grandi richiedono semplicemente più tempo, tile dopo tile.',
      ],
      whyItMatters: [
        'Vecchie foto digitali, download a bassa risoluzione e piccole immagini web spesso devono essere stampati o mostrati molto più grandi di come sono stati acquisiti.',
        'La semplice interpolazione produce un\'immagine più grande, non più nitida; un modello di super-risoluzione fa la differenza tra sfocato e utilizzabile.',
        'Partire da un PNG senza perdita ti lascia libero di comprimere o ridimensionare il risultato in seguito senza accumulare artefatti.',
      ],
      useCases: [
        {
          title: 'Stampare vecchie foto',
          description: 'Porta una foto da 1 megapixel di una vecchia fotocamera a una dimensione che si stampa bene.',
        },
        {
          title: 'Recuperare piccoli download',
          description: 'Ingrandisci un\'immagine di prodotto o di riferimento da 400 px fino a qualcosa di utilizzabile.',
        },
        {
          title: 'Anime e illustrazioni',
          description: 'Ingrandisci i disegni al tratto con realesrgan-x4plus-anime senza bordi impastati.',
        },
        {
          title: 'Fotogrammi di giochi e video',
          description: 'Usa realesr-animevideov3 su fotogrammi di animazione catturati.',
        },
      ],
      workedExamples: [
        {
          title: 'Un JPEG da 640 x 360 a 4x con realesrgan-x4plus',
          body: 'Input: una miniatura JPEG di un paesaggio da 92 KB, 640 x 360. Impostazioni lasciate al preset: 4x, modello per foto, output PNG. Il server esegue realesrgan-ncnn-vulkan -n realesrgan-x4plus -s 4 -t 0 -f png e scrive converted.png a 2560 x 1440 pixel, 16 volte i 230.400 pixel originali. L\'output non compresso è 2560 x 1440 x 3 = 11 MB di RGB, e il PNG si colloca al di sotto a seconda di quanto cielo e colore piatto contiene, quindi aspettati diversi megabyte da un input di 92 KB. Il passaggio della GPU sui tile scelti automaticamente è questione di secondi per un output di queste dimensioni; la codifica del PNG e il download di un file di diversi megabyte occupano una parte rilevante del totale.',
        },
        {
          title: 'Una foto da 1200 x 800 a 2x',
          body: 'Input: un JPEG di una persona da 480 KB, 1200 x 800. Scegli 2x e mantieni il modello per foto. L\'output è un PNG da 2400 x 1600, 3,84 megapixel, quattro volte gli 0,96 originali. Non compresso sono 11,5 MB di RGB, e il PNG ne sarà una frazione. Poiché 2x esegue la rete x4 a metà scala, controlla i bordi per il leggero ritaglio o zoom di cui avvisa il modulo; se compare, esegui invece 4x e riduci il risultato da 4800 x 3200 a 2400 x 1600 con lo strumento di ridimensionamento, il che costa un\'operazione in più.',
        },
      ],
      whenNotToUse: 'Non ingrandire un\'immagine che è già grande e nitida: una foto da 12 megapixel a 4x diventa un PNG da 192 megapixel che è lento da produrre, pesa centinaia di megabyte non compresso e non guadagna nulla di visibile. Non fare affidamento su questo strumento per volti, testo, loghi o qualsiasi cosa in cui l\'originale esatto debba essere preservato, perché i dettagli aggiunti sono previsti, non recuperati, e il testo piccolo può uscire come lettere plausibili ma sbagliate. Il forte mosso e la messa a fuoco mancata non si risolvono con la risoluzione. Se ti serve solo una dimensione in pixel specifica da un originale più grande, il semplice strumento di ridimensionamento è più veloce ed economico.',
      whyMediaManipulator: [
        'Il binario, i modelli e i flag reali sono indicati qui, così sai che si tratta di Real-ESRGAN con suddivisione automatica in tile e non di un generico «migliora».',
        'L\'avvertenza sul 2x è dichiarata anziché nascosta, e l\'operazione è bloccata, così non c\'è nessun menu in cui andare a cercare.',
        'Funziona su hardware di nostra proprietà; lo strumento standard non richiede un account. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      ],
      privacyNote: 'La tua immagine viene salvata in uploads/<jobId>/ sul nostro server e letta direttamente dal binario realesrgan-ncnn-vulkan su una GPU della stessa macchina; il PNG prodotto va in outputs/<jobId>/converted.png. Nessun fornitore di IA esterno è coinvolto e la tua immagine non viene usata per addestrare nulla. Come per ogni caricamento di immagini, una fase di analisi automatica sul nostro server esegue una volta un modello di visione locale sul file e ne salva il riepilogo insieme al lavoro. Il risultato non ha alcun EXIF dell\'originale, perché le operazioni IA saltano la copia dei metadati. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      faq: [
        {
          question: 'L\'upscaler con IA è gratuito?',
          answer: 'Sì, entro la quota giornaliera di IA. Ogni upscaling consuma un lavoro IA: per impostazione predefinita 3 al giorno per gli ospiti e 10 con un account gratuito, con limiti per file di 200 MB e 1 GB; 100 e 200 con Premium e Pro. Quella quota è separata da quella ordinaria, quindi le tue conversioni non ne risentono. I numeri aggiornati sono su /pricing.',
        },
        {
          question: 'In cosa differisce dallo strumento di ridimensionamento?',
          answer: 'Lo strumento di ridimensionamento esegue ImageMagick, che interpola i pixel esistenti e produce un\'immagine più grande ma più morbida. Questo strumento esegue una rete Real-ESRGAN addestrata che sintetizza bordi e texture alla dimensione maggiore. È un\'inferenza, non dati recuperati.',
        },
        {
          question: 'Devo scegliere 2x o 4x?',
          answer: '4x è il valore predefinito e dà l\'output più coerente. 2x esegue la stessa rete a metà scala e può apparire leggermente ritagliato su alcune immagini, quindi se 4x è più di quanto ti serve, valuta 4x seguito da una riduzione.',
        },
        {
          question: 'Quale modello è adatto ai disegni?',
          answer: 'realesrgan-x4plus-anime per illustrazioni e grafica a colori piatti; realesr-animevideov3 per fotogrammi presi da animazioni. Il modello per foto aggiunge una texture simile alla pelle che sui disegni al tratto appare sbagliata.',
        },
        {
          question: 'Perché l\'output è PNG e così grande?',
          answer: 'Il PNG è forzato così i dettagli sintetizzati non vengono subito danneggiati dalla compressione JPEG. Un risultato a 4x ha 16 volte i pixel, quindi il file è grande; comprimilo in JPG o WebP in seguito per condividerlo.',
        },
        {
          question: 'Può correggere una foto sfocata o fuori fuoco?',
          answer: 'Aiuta con la morbidezza dovuta alla bassa risoluzione. Non può annullare il mosso o una messa a fuoco mancata, e può lisciare o alterare volti e testo fine. Confronta il risultato con l\'originale prima di usarlo.',
        },
        {
          question: 'La mia foto viene inviata a un servizio di IA di terze parti?',
          answer: 'No. Real-ESRGAN gira su un server GPU gestito da noi, e il lavoro non chiama mai un\'API esterna.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'L\'output è PNG. I limiti di dimensione e la quota giornaliera di IA dipendono dal tuo piano e vengono mostrati nel modulo, non fissati in questa pagina.',
        ],
      },
      related: [
        {
          label: 'Restauro di immagini con IA',
          to: '/tools/ai-image-restoration',
          description: 'Ripulisci compressione e rumore prima o dopo l\'ingrandimento.',
        },
        {
          label: 'Ridimensiona immagine',
          to: '/tools/image-resizer',
          description: 'Porta un risultato a 4x alla dimensione esatta che ti serve.',
        },
        {
          label: 'Comprimi immagine',
          to: '/tools/compress-image',
          description: 'Trasforma il PNG pesante in un JPG o WebP condivisibile.',
        },
        {
          label: 'Rimuovi lo sfondo da un\'immagine',
          to: '/tools/remove-background-from-image',
          description: 'Ritaglia il soggetto ingrandito su uno sfondo trasparente.',
        },
        {
          label: 'Restauro video con IA',
          to: '/tools/ai-video-restoration',
          description: 'L\'equivalente per i fotogrammi video.',
        },
      ],
      embed: {
        title: 'Ingrandisci un\'immagine con l\'IA',
        description: 'Carica una foto. Upscaling IA è già selezionato e bloccato, con l\'output impostato su PNG. Scegli 2x o 4x e un modello (foto o anime), poi converti.',
      },
    },
    'blur-faces-in-photo': {
      name: 'Sfoca i volti in una foto',
      h1: 'Sfoca i volti in una foto online',
      tagline: 'Rileva automaticamente i volti, poi sfocali, pixelalli o coprili di nero, tutti oppure solo quelli che scegli.',
      metaTitle: 'Sfoca i volti in una foto online | Media Manipulator',
      metaDescription: 'Sfoca, pixela o copri di nero i volti in una foto. Rileva ogni volto, poi scegli quali nascondere. L\'IA funziona sulla nostra GPU. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Sfoca i volti in una foto online',
      ogDescription: 'Trova automaticamente i volti in una foto e sfoca, pixella o copri di nero tutti oppure solo quelli che scegli.',
      intro: 'Pubblicare la foto di una folla, di una classe o di una strada di solito significa nascondere le persone che non hanno mai accettato di comparirvi. Questa pagina trova i volti con il rilevatore YuNet eseguito in OpenCV sul nostro server e copre ciascuno con una sfocatura gaussiana, un mosaico di pixel o un rettangolo nero pieno. Puoi coprire ogni volto rilevato in un solo passaggio, oppure eseguire prima il rilevamento, vedere i riquadri disegnati sulla tua foto e scegliere solo i volti da nascondere o solo quelli da mantenere. Il rilevatore, la sua soglia di confidenza e la dimensione esatta di ogni effetto sono descritti qui sotto, così sai cosa il risultato proteggerà e cosa no.',
      whatItDoes: [
        'Rileva i volti con OpenCV FaceDetectorYN e il modello YuNet 2023 a una soglia di confidenza di 0.85, poi allarga ogni riquadro del 18 percento su ogni lato, così anche capelli e mascella vengono coperti.',
        'Nasconde ogni volto scelto con una sfocatura gaussiana il cui kernel è un terzo della dimensione del riquadro, con un mosaico di 14 blocchi lungo il riquadro o con un riempimento nero.',
        'Offre tre modalità di selezione: tutti i volti rilevati, solo i volti che hai spuntato, oppure tutti tranne i volti che hai spuntato.',
        'Conserva i risultati del rilevamento in una sessione di 30 minuti legata allo SHA-256 del tuo file, così i riquadri applicati sono esattamente quelli che hai visto.',
        'Scrive un nuovo JPG, PNG o WebP con le stesse dimensioni in pixel; il file caricato in origine non viene alterato.',
      ],
      flowSteps: [
        {
          title: 'Carica la foto',
          description: 'JPG, PNG o WebP. Sfoca / pixella i volti è preselezionato e bloccato in questa pagina.',
        },
        {
          title: 'Scegli sfocatura, pixel o riquadro nero',
          description: 'La sfocatura è preimpostata; un riquadro nero elimina completamente i pixel.',
        },
        {
          title: 'Facoltativamente rileva e seleziona',
          description: 'Premi Rileva volti per vedere i riquadri numerati, poi spunta quelli da nascondere o da mantenere.',
        },
        {
          title: 'Avvia il lavoro',
          description: 'Il server applica l\'effetto all\'interno di ogni riquadro scelto e salva una nuova immagine.',
        },
        {
          title: 'Controlla e scarica',
          description: 'Ingrandisci a dimensione reale e cerca eventuali volti sfuggiti prima di pubblicarla.',
        },
      ],
      advancedDetails: [
        'Il rilevamento esegue face_privacy.py con OpenCV FaceDetectorYN su face_detection_yunet_2023mar.onnx alla risoluzione piena dell\'immagine, con soglia di punteggio 0.85, soglia NMS 0.3 e fino a 5000 candidati. I riquadri vengono ampliati di 0.18 della loro larghezza e altezza su ogni lato e limitati ai bordi dell\'immagine.',
        'La sfocatura applica cv2.GaussianBlur con un kernel impari di max(3, lato più lungo del riquadro / 3) pixel, quindi un volto di 300 px riceve un kernel di 101 px; più grande è il volto, più forte è la sfocatura. Pixel riduce il riquadro a 14 blocchi in larghezza con filtro lineare e lo riporta alle dimensioni originali con interpolazione nearest-neighbour, producendo tessere quadrate visibili. Il riquadro nero scrive (0, 0, 0) nella regione.',
        'Quando rilevi prima, il server calcola lo SHA-256 del file caricato, conserva i riquadri normalizzati in una sessione che scade dopo 30 minuti e rifiuta di applicare una sessione il cui hash non corrisponde al file che invii in seguito, così i riquadri non possono essere trapiantati su un\'immagine diversa.',
        'Senza una sessione di rilevamento lo script rileva di nuovo al momento dell\'esecuzione e copre ogni volto che trova; il risultato è identico a eseguire Rileva volti e lasciare la modalità su tutti.',
        'L\'output è scritto da OpenCV, e il passaggio di ricopiatura con exiftool del convertitore non viene eseguito sugli output IA, quindi il risultato non contiene nessuno dei tag EXIF, GPS o della fotocamera originali. Non sostituisce comunque lo strumento EXIF, che ti permette di vedere e scegliere cosa viene rimosso.',
        'Una sfocatura leggera su un volto grande e nitido può essere parzialmente invertita con strumenti di deconvoluzione; il riquadro nero è l\'unica scelta che distrugge l\'informazione, e un mosaico grossolano sta nel mezzo.',
      ],
      whyItMatters: [
        'Le foto di altre persone, e soprattutto di bambini, comportano questioni di consenso e a volte obblighi legali che una didascalia non può risolvere.',
        'Ritoccare a mano una foto con 20 volti è lento e disomogeneo; il rilevamento trova anche quelli piccoli in ultima fila.',
        'Rileva-e-seleziona ti permette di lasciare visibile il tuo gruppo mentre rendi anonimi i passanti.',
      ],
      useCases: [
        {
          title: 'Foto di eventi e folle',
          description: 'Nascondi gli astanti prima di pubblicare le immagini di un evento pubblico.',
        },
        {
          title: 'Post di scuole e associazioni',
          description: 'Copri i bambini specifici le cui famiglie non hanno dato il consenso.',
        },
        {
          title: 'Giornalismo e reportage',
          description: 'Proteggi fonti o partecipanti in un fotogramma di documentario.',
        },
        {
          title: 'Screenshot di videochiamate',
          description: 'Rendi anonimi i colleghi nella cattura di una riunione prima di condividerla fuori dal team.',
        },
      ],
      workedExamples: [
        {
          title: 'Una foto di gruppo 4000 x 3000 con 14 volti, tutti sfocati',
          body: 'Input: un JPEG da 3.5 MB di 4000 x 3000 pixel scattato con un telefono, con 14 persone. Impostazioni: sfocatura, modalità di selezione tutti, nessun rilevamento preliminare. Lo script esegue YuNet sull\'intero fotogramma da 12 megapixel; un volto il cui riquadro misura 300 x 360 pixel viene ampliato del 18 percento fino a circa 408 x 490 e sfocato con un kernel gaussiano di 163 px (490 / 3, arrotondato a impari), che lo trasforma in una macchia priva di tratti. Un volto di 60 px in ultima fila riceve un kernel di 27 px, sufficiente a cancellare i tratti a quella dimensione. L\'output è un JPG 4000 x 3000 scritto da OpenCV, di solito entro poche centinaia di kilobyte dalla dimensione originale. Rilevamento e sfocatura richiedono pochi secondi; il caricamento dei 3.5 MB di solito dura di più.',
        },
        {
          title: 'Uno screenshot di videochiamata 1920 x 1080, due volti su sei pixellati',
          body: 'Input: uno screenshot PNG da 1.1 MB di 1920 x 1080 che mostra sei partecipanti. Impostazioni: prima Rileva volti, modalità di selezione solo selezionati, due volti spuntati, pixel. Il rilevamento restituisce sei riquadri e li conserva in una sessione di 30 minuti legata all\'hash del file. All\'invio il server verifica l\'hash, passa allo script gli id dei due riquadri selezionati, e ogni riquadro selezionato, circa 140 x 180 pixel dopo l\'ampliamento, viene ridotto a 14 blocchi in larghezza, così ogni tessera misura circa 10 x 13 pixel, poi riscritto come quadrati netti. Gli altri quattro volti restano intatti. L\'output è un PNG 1920 x 1080 e il lavoro dura pochi secondi perché non serve un nuovo rilevamento.',
        },
      ],
      whenNotToUse: 'Non affidarti a questo strumento per casi in cui un solo volto sfuggito è inaccettabile, come un oscuramento imposto per legge; YuNet a una soglia di 0.85 salta i volti minuscoli, girati, mascherati o in ombra profonda, e devi controllare tu stesso il risultato. Non usare una sfocatura leggera su un volto grande se la persona deve restare non identificabile; usa il riquadro nero. Cartellini con il nome, targhe e schermi non sono volti, quindi per quelli la scelta giusta è lo strumento di oscuramento del testo o quello di rimozione degli oggetti. E se il tuo obiettivo è eliminare del tutto una persona dalla scena invece di nasconderne il volto, è lo strumento di rimozione degli oggetti a farlo.',
      whyMediaManipulator: [
        'Il rilevatore, la sua soglia, l\'ampliamento e il calcolo del kernel sono dichiarati, così puoi giudicare quanta protezione offre ogni stile.',
        'I riquadri di rilevamento sono legati all\'hash del file e scadono dopo 30 minuti, così selezioni sull\'immagine esatta che verrà elaborata.',
        'La sfocatura dei volti consuma un lavoro IA dalla quota IA giornaliera (di default 3 al giorno senza account, 10 con un account gratuito), tenuta separata dalla quota standard, e l\'anteprima Rileva volti non viene conteggiata affatto. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ],
      privacyNote: 'Rilevamento e sfocatura dei volti vengono eseguiti come processo OpenCV locale sul nostro hardware; nessun servizio IA esterno riceve la tua foto e nulla viene usato per l\'addestramento. L\'anteprima Rileva volti salva una copia temporanea, ne calcola l\'hash, rileva ed elimina la copia prima di rispondere; vengono conservate solo le coordinate dei riquadri, per 30 minuti. La foto caricata risiede in uploads/<jobId>/ e il risultato in outputs/<jobId>/, entrambi nel registro di conservazione ed eliminati alla fine del periodo. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Come ogni caricamento di immagine standard, la foto passa anche attraverso la nostra analisi automatica dei contenuti sullo stesso server, dove un modello di visione locale scrive una breve descrizione che resta con il lavoro e non viene condivisa con terze parti.',
      faq: [
        {
          question: 'Quali volti sfuggiranno al rilevatore?',
          answer: 'YuNet viene eseguito a una soglia di confidenza di 0.85, quindi salta i candidati a bassa confidenza: volti molto piccoli, profili girati rispetto alla fotocamera, volti coperti da mascherine o mani e volti in ombra profonda. Controlla il risultato a dimensione reale prima di condividerlo.',
        },
        {
          question: 'Come faccio a sfocare solo alcuni volti?',
          answer: 'Premi Rileva volti, spunta i riquadri numerati e imposta la modalità di selezione su solo i volti selezionati o tutti tranne i volti selezionati. I riquadri vengono conservati per 30 minuti in base all\'hash del file, quindi ripeti il rilevamento se cambi immagine.',
        },
        {
          question: 'Quanto è forte la sfocatura e si può annullare?',
          answer: 'Il kernel gaussiano è un terzo della dimensione del riquadro, quindi un volto di 300 px riceve un kernel di 101 px. Una sfocatura forte è difficile da invertire, ma un attaccante determinato con un volto grande e nitido ha qualche possibilità; il riquadro nero elimina i pixel e non può essere annullato.',
        },
        {
          question: 'L\'output conserva i dati EXIF e GPS della mia foto?',
          answer: 'No. Il risultato viene scritto da zero da OpenCV e il passaggio di ricopiatura dei metadati viene saltato per gli output IA, quindi i tag di fotocamera e posizione non vengono trasferiti. Usa lo strumento EXIF se vuoi ispezionare o rimuovere selettivamente i tag.',
        },
        {
          question: 'La mia foto viene inviata a un\'azienda di IA esterna?',
          answer: 'No. Il rilevamento e l\'effetto vengono eseguiti in un processo OpenCV locale sul nostro server, e il file non viene condiviso con fornitori di IA di terze parti.',
        },
        {
          question: 'La sfocatura dei volti usa la mia quota IA giornaliera?',
          answer: 'Sì. Ogni foto sfocata è un lavoro IA: di default 3 al giorno come ospite, 10 con un account gratuito. Non consuma mai la quota standard. L\'anteprima Rileva volti ha un limite di frequenza ma non viene conteggiata. Un lavoro non riuscito viene rimborsato.',
        },
        {
          question: 'E per targhe, cartellini con il nome o testo sugli schermi?',
          answer: 'Non sono volti e qui non vengono rilevati. Usa lo strumento di oscuramento del testo per qualsiasi cosa leggibile, oppure quello di rimozione degli oggetti per cancellare una targa o un cartello dall\'immagine.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Ogni lavoro consuma un lavoro IA dalla tua quota IA giornaliera; il limite di dimensione per file del tuo piano è mostrato nel modulo.',
        ],
      },
      related: [
        {
          label: 'Oscura il testo in un\'immagine',
          to: '/tools/redact-text-in-image',
          description: 'Nascondi e-mail, numeri di telefono e altro testo leggibile.',
        },
        {
          label: 'Rimuovi un oggetto da una foto',
          to: '/tools/remove-object-from-photo',
          description: 'Cancella del tutto una persona, una targa o un cartello.',
        },
        {
          label: 'Rimuovi i metadati EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimina i dati GPS e della fotocamera dalla stessa foto.',
        },
        {
          label: 'Comprimi immagine',
          to: '/tools/compress-image',
          description: 'Riduci il peso della foto anonimizzata prima di pubblicarla.',
        },
        {
          label: 'Ridimensiona immagine',
          to: '/tools/image-resizer',
          description: 'Porta il risultato alla dimensione richiesta da una piattaforma.',
        },
      ],
      embed: {
        title: 'Sfoca i volti in una foto',
        description: 'Carica una foto. Sfoca / pixella i volti è già selezionato e bloccato. Scegli lo stile, facoltativamente rileva i volti e seleziona quali nascondere, poi converti.',
      },
    },
    'redact-text-in-image': {
      name: 'Oscura il testo in un\'immagine',
      h1: 'Oscura testo e dati personali in un\'immagine',
      tagline: 'Trova il testo leggibile in uno screenshot o in una foto e copri i dati personali, o tutto il testo, con una sfocatura o un riquadro nero.',
      metaTitle: 'Oscura il testo in un\'immagine online | Media Manipulator',
      metaDescription: 'Trova automaticamente il testo in un\'immagine e copri di nero o sfoca nomi, e-mail, numeri e altri dati personali. IA sulla nostra GPU. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Oscura testo e dati personali in un\'immagine',
      ogDescription: 'Trova il testo in screenshot e foto e copri i dati personali o tutto il testo con una sfocatura o un riquadro nero.',
      intro: 'Gli screenshot lasciano trapelare le cose che i loro proprietari hanno smesso di vedere: un indirizzo e-mail in un\'intestazione, un numero di conto in una tabella, un numero di telefono in una nuvoletta di chat. Questa pagina legge ogni porzione di testo in un\'immagine con EasyOCR sul nostro server e copre le corrispondenze con un rettangolo nero, una sfocatura o un mosaico di pixel. Nella modalità predefinita copre solo il testo che corrisponde a schemi di dati personali: indirizzi e-mail, numeri di telefono, numeri in stile previdenziale, lunghe sequenze di cifre simili a carte di pagamento e indirizzi stradali. Nella modalità tutto il testo copre ogni parola che riesce a leggere, la scelta più sicura quando non puoi prevedere cosa c\'è nella pagina.',
      whatItDoes: [
        'Esegue EasyOCR sull\'intera immagine per trovare i riquadri di testo e il testo al loro interno, usando la GPU del nostro server.',
        'In modalità dati personali copre i riquadri il cui testo corrisponde a uno di cinque schemi: e-mail, numero di telefono, identificatore di cifre 3-2-4, sequenza da 13 a 19 cifre simile a una carta, oppure un indirizzo stradale che termina con Street, Avenue, Road, Drive, Lane, Boulevard, Way, Court, Circle o Place.',
        'In modalità tutto il testo copre ogni riquadro di testo riconosciuto, indipendentemente dal contenuto.',
        'Amplia ogni riquadro dell\'8 percento del suo lato maggiore (almeno 3 pixel) e lo riempie di nero, lo sfoca con un kernel pari a un terzo della sua dimensione, oppure lo pixella in 12 blocchi.',
        'Scrive un nuovo JPG, PNG o WebP con le stesse dimensioni e riporta quanti oscuramenti sono stati effettuati.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'immagine',
          description: 'Uno screenshot, un modulo scansionato o una foto con testo leggibile, in JPG, PNG o WebP.',
        },
        {
          title: 'Scegli solo dati personali o tutto il testo',
          description: 'Oscura testo / dati personali è preselezionato e bloccato in questa pagina; solo dati personali è la modalità di rilevamento predefinita.',
        },
        {
          title: 'Scegli riquadro nero, sfocatura o pixel',
          description: 'Il riquadro nero è l\'impostazione predefinita e l\'unica irreversibile.',
        },
        {
          title: 'OCR e oscuramento in esecuzione',
          description: 'EasyOCR legge l\'immagine, ogni riquadro corrispondente viene ampliato e coperto, e il risultato viene salvato.',
        },
        {
          title: 'Leggilo con attenzione e scarica',
          description: 'Controlla il testo che l\'OCR non ha letto, soprattutto quello piccolo, ruotato o scritto a mano.',
        },
      ],
      advancedDetails: [
        'Il server esegue redact_text_pii.py con --detect pii o all-text, --redaction blackbox, blur o pixelate e --gpu. Lo script costruisce un Reader EasyOCR per l\'inglese (l\'unica lingua passata oggi) e chiama readtext sul file, che restituisce un riquadro, il testo e una confidenza per ogni riga.',
        'Gli schemi dei dati personali sono espressioni regolari: un\'e-mail (parte locale, @, dominio con un punto e un TLD di 2+ lettere); un numero di telefono nordamericano di 10 cifre con +1, parentesi, punti, spazi o trattini facoltativi; tre, due e quattro cifre separate da un trattino o uno spazio; da 13 a 19 cifre facoltativamente separate da spazi o trattini (numeri di carta); e un numero civico seguito da un nome e da una parola che indica il tipo di via. Non esiste uno schema per i nomi di persona, le date di nascita o gli identificatori non statunitensi.',
        'Ogni riquadro corrispondente viene ampliato di max(3, 0.08 x il maggiore tra larghezza e altezza) pixel su ogni lato e limitato ai bordi dell\'immagine. Il riquadro nero usa cv2.rectangle con interno nero pieno; pixel riduce la regione a 12 blocchi in larghezza e la riporta alle dimensioni originali con interpolazione nearest-neighbour; la sfocatura usa un kernel gaussiano di max(11, lato più lungo / 3), reso impari.',
        'L\'OCR legge meglio la stampa orizzontale pulita. Scrittura a mano, caratteri decorativi, testo molto piccolo, forte inclinazione e basso contrasto abbassano la confidenza e possono sfuggire del tutto. La modalità tutto il testo non rimedia a una riga che l\'OCR non ha mai visto.',
        'L\'output è scritto da OpenCV e la ricopiatura con exiftool del convertitore viene saltata per gli output IA, quindi i tag EXIF, GPS e della fotocamera originali non vengono trasferiti nel risultato; questo strumento serve per i pixel, non per i metadati.',
        'Lo script stampa redactions=N quando termina; un risultato di zero significa che l\'OCR non ha trovato testo corrispondente, non che l\'immagine fosse pulita.',
      ],
      whyItMatters: [
        'Ticket di assistenza, segnalazioni di bug e post sui social contengono di continuo screenshot con dati reali di clienti o account.',
        'Coprire il testo a mano con uno strumento di disegno lascia fuori delle righe e produce risultati irregolari; una ricerca per schemi trova la terza e-mail che avevi smesso di notare.',
        'Un rettangolo opaco è l\'unico oscuramento che resiste a nitidezza, aumento del contrasto e zoom.',
      ],
      useCases: [
        {
          title: 'Segnalazioni di bug e assistenza',
          description: 'Condividi uno screenshot senza esporre e-mail, numeri di telefono o cifre di carte.',
        },
        {
          title: 'Moduli scansionati',
          description: 'Nascondi identificatori e indirizzi su una pagina prima di inoltrarla.',
        },
        {
          title: 'Screenshot di chat',
          description: 'Rimuovi numeri di telefono ed e-mail da una conversazione prima di pubblicarla.',
        },
        {
          title: 'Materiale didattico',
          description: 'Trasforma una cattura di schermo reale in un esempio sicuro con tutto il testo coperto.',
        },
      ],
      workedExamples: [
        {
          title: 'Uno screenshot 1440 x 900 di un ticket di assistenza in modalità dati personali',
          body: 'Input: un PNG da 400 KB di 1440 x 900 che mostra una scheda cliente con due indirizzi e-mail, un numero di telefono scritto come (555) 123-4567 e il nome di un cliente. Impostazioni: solo dati personali, riquadro nero. EasyOCR restituisce circa 40 righe di testo; tre di esse corrispondono agli schemi di e-mail e telefono, il nome non corrisponde a nulla. Ciascuno dei tre riquadri, diciamo 260 x 22 pixel per un\'e-mail, viene ampliato dell\'8 percento di 260, circa 21 pixel, su ogni lato e riempito di nero, producendo un rettangolo di 302 x 64. Il nome resta visibile, perché non esiste uno schema per i nomi; passa a tutto il testo se deve sparire anche quello. L\'output è un PNG 1440 x 900 e il lavoro richiede pochi secondi, per la maggior parte spesi a caricare il modello OCR e a leggere la pagina.',
        },
        {
          title: 'Una foto 3024 x 4032 da telefono di un modulo compilato in modalità tutto il testo con sfocatura',
          body: 'Input: una foto JPEG da 2.1 MB di un modulo stampato, 3024 x 4032 pixel, leggermente inclinata. Impostazioni: tutto il testo, sfocatura. Ogni riga letta da EasyOCR viene coperta: il valore di un campo dattiloscritto di 600 x 40 pixel viene ampliato di 48 pixel per lato e sfocato con un kernel di 201 px (600 / 3, reso impari), che a quella scala elimina completamente le lettere; un\'etichetta di 120 x 30 riceve il kernel minimo di 11 px, che a quella dimensione lascia ancora intuibili le forme delle lettere, quindi scegli il riquadro nero per qualsiasi cosa sensibile. Le voci scritte a mano che l\'OCR non riesce a leggere restano come erano e vanno controllate a occhio. L\'output è un JPG 3024 x 4032; l\'OCR su una foto da 12 megapixel è il passaggio più lento e richiede più tempo rispetto a uno screenshot.',
        },
      ],
      whenNotToUse: 'Non usare questo strumento come unica salvaguardia su un documento che deve essere completamente oscurato; l\'OCR fa il possibile, oggi legge solo la stampa in inglese e gli schemi dei dati personali non sanno nulla di nomi, date di nascita o identificatori provenienti da fuori il Nord America. Non usare la sfocatura su testo che pubblicherai, perché la sfocatura del testo è l\'oscuramento più facile da invertire; usa il riquadro nero. Volti, loghi e fotografie non sono testo e non vengono toccati; a quelli pensano lo strumento di sfocatura dei volti e quello di rimozione degli oggetti. E se i dati sensibili sono nei metadati del file anziché nei pixel, il posto giusto è lo strumento EXIF.',
      whyMediaManipulator: [
        'I cinque schemi dei dati personali, l\'ampliamento e le dimensioni dei kernel sono scritti per esteso, così sai esattamente quale testo verrà intercettato e come verrà coperto.',
        'OCR e oscuramento vengono eseguiti in un processo locale sulla nostra GPU; gli screenshot pieni di dati dei clienti non lasciano mai il nostro hardware.',
        'L\'oscuramento del testo consuma un lavoro IA (di default 3 al giorno senza account, 10 con un account gratuito), conteggiato sulla quota IA e non su quella standard, e un lavoro non riuscito viene rimborsato. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ],
      privacyNote: 'Riconoscimento del testo e oscuramento vengono eseguiti come processo locale EasyOCR e OpenCV sul nostro server GPU; nessun servizio OCR o IA esterno riceve l\'immagine, e il testo riconosciuto viene usato solo per decidere quali riquadri coprire e non viene conservato. Il file caricato risiede in uploads/<jobId>/ e l\'immagine oscurata in outputs/<jobId>/, entrambi registrati nel registro di conservazione ed eliminati alla fine del periodo. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Come ogni caricamento di immagine standard, il file passa anche attraverso la nostra analisi automatica dei contenuti sullo stesso server, dove un modello di visione locale scrive una breve descrizione che viene conservata con il lavoro e non condivisa con terze parti.',
      faq: [
        {
          question: 'Quali dati personali rileva la modalità dati personali?',
          answer: 'Il testo che corrisponde a cinque schemi: indirizzi e-mail, numeri di telefono nordamericani, identificatori di cifre 3-2-4, sequenze da 13 a 19 cifre simili a carte e indirizzi stradali che terminano con una parola come Street, Avenue o Road. Nomi, date e identificatori non statunitensi non vengono riconosciuti; per quelli usa tutto il testo.',
        },
        {
          question: 'Quando dovrei usare tutto il testo invece di solo dati personali?',
          answer: 'Ogni volta che non puoi elencare in anticipo cosa è sensibile: moduli, tabelle, registri di chat con nomi. Tutto il testo copre ogni riga letta dall\'OCR, quindi l\'unico rischio residuo è il testo che l\'OCR non è riuscito a leggere.',
        },
        {
          question: 'Lo strumento legge lingue diverse dall\'inglese?',
          answer: 'Non oggi. Il lettore OCR viene avviato solo per l\'inglese, quindi il testo in alfabeto latino viene letto in modo accettabile, ma altri alfabeti possono sfuggire o essere letti male. Controlla il risultato quando la pagina non è in inglese.',
        },
        {
          question: 'Qui il riquadro nero è più sicuro di sfocatura o pixel?',
          answer: 'Sì. Il riquadro viene riempito di nero pieno, quindi non resta nulla. La sfocatura usa un kernel pari a un terzo della dimensione del riquadro con un minimo di 11 px, e pixel lascia 12 blocchi in larghezza; entrambi possono lasciare intuibile un testo breve. Scegli il riquadro nero per qualsiasi cosa pubblicherai.',
        },
        {
          question: 'L\'oscuramento rimuove i metadati nascosti nella mia foto?',
          answer: 'Il risultato viene scritto da zero da OpenCV senza copiare i tag originali, quindi i dati EXIF e GPS non vengono trasferiti. Per una rimozione deliberata e verificabile su un file che non stai altrimenti modificando, usa lo strumento per i metadati EXIF.',
        },
        {
          question: 'Perché parte del testo è rimasta visibile?',
          answer: 'O l\'OCR non l\'ha letta (scrittura a mano, caratteri minuscoli, inclinazione, basso contrasto) oppure, in modalità dati personali, non corrispondeva a uno schema. Il server riporta quanti riquadri ha coperto; zero significa che nulla ha corrisposto, non che non c\'era nulla.',
        },
        {
          question: 'Oscurare il testo è gratuito e cosa viene conteggiato sulla mia quota?',
          answer: 'Sì. È un lavoro IA, di default 3 al giorno senza account e 10 con un account gratuito, su immagini rispettivamente fino a 200 MB e 1 GB. Usa solo la quota IA, mai quella standard. La pagina dei prezzi riporta i numeri aggiornati.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Ogni lavoro consuma un lavoro IA dalla tua quota IA giornaliera; il limite di dimensione per file del tuo piano è mostrato nel modulo.',
        ],
      },
      related: [
        {
          label: 'Sfoca i volti in una foto',
          to: '/tools/blur-faces-in-photo',
          description: 'Nascondi le persone nella stessa immagine.',
        },
        {
          label: 'Rimuovi i metadati EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimina i dati nascosti di posizione e dispositivo.',
        },
        {
          label: 'Scansione documenti con IA',
          to: '/tools/ai-document-scan',
          description: 'Trasforma una pagina fotografata in un PDF pulito e ricercabile.',
        },
        {
          label: 'Rimuovi un oggetto da una foto',
          to: '/tools/remove-object-from-photo',
          description: 'Cancella un logo, una targa o un badge che non è testo.',
        },
        {
          label: 'Comprimi immagine',
          to: '/tools/compress-image',
          description: 'Riduci il peso dello screenshot oscurato prima di allegarlo.',
        },
      ],
      embed: {
        title: 'Oscura il testo in un\'immagine',
        description: 'Carica uno screenshot o una foto. Oscura testo / dati personali è già selezionato e bloccato. Scegli se coprire i dati personali o tutto il testo, e lo stile di oscuramento, poi converti.',
      },
    },
    'remove-object-from-photo': {
      name: 'Rimuovi un oggetto da una foto',
      h1: 'Rimuovi un oggetto da una foto online',
      tagline: 'Disegna un riquadro attorno a ciò che non vuoi nell\'immagine e un modello di inpainting riempie il vuoto con uno sfondo coerente.',
      metaTitle: 'Rimuovi un oggetto da una foto online | Media Manipulator',
      metaDescription: 'Cancella gli oggetti indesiderati da una foto. Disegna un rettangolo e l\'inpainting con IA riempie lo spazio in modo coerente con lo sfondo. Funziona sulla nostra GPU. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Rimuovi un oggetto da una foto online',
      ogDescription: 'Disegna un riquadro su un oggetto indesiderato e l\'inpainting con IA riempie lo spazio con uno sfondo coerente.',
      intro: 'Carica una foto, trascina uno o più rettangoli sulle cose che vuoi far sparire e converti. Il modulo invia ogni rettangolo come frazioni dell\'immagine (sinistra, alto, larghezza e altezza tra 0 e 1) e la nostra API le trasforma in una maschera: un PNG in scala di grigi delle stesse dimensioni della tua foto, bianco all\'interno dei rettangoli e nero ovunque altrove. Uno script Python apre quindi l\'immagine e la maschera ed esegue il modello di inpainting LaMa del pacchetto simple_lama_inpainting sulla nostra GPU, che ridipinge le regioni bianche usando la scena circostante. Ricevi la foto a dimensione piena nel formato che hai scelto, con le aree segnate riempite.',
      whatItDoes: [
        'Accetta uno o più rettangoli disegnati sull\'anteprima e rimuove tutto ciò che contengono.',
        'Costruisce sul server una maschera precisa al pixel a partire dalle coordinate normalizzate dei rettangoli, così la maschera non dipende dalle dimensioni del tuo schermo.',
        'Esegue l\'inpainting LaMa su una GPU gestita da noi e riempie le aree mascherate con contenuto che prosegue lo sfondo.',
        'Restituisce l\'immagine a piena risoluzione in JPG, PNG, WebP o GIF, come selezionato nel modulo.',
        'Conta come un lavoro IA sulla quota IA giornaliera; le conversioni semplici usano una quota diversa e separata.',
      ],
      flowSteps: [
        {
          title: 'Carica la foto',
          description: 'JPG, PNG o WebP. L\'anteprima compare con una sovrapposizione per disegnare.',
        },
        {
          title: 'Disegna i rettangoli',
          description: 'Un riquadro per oggetto, leggermente più grande dell\'oggetto stesso. Serve almeno un riquadro.',
        },
        {
          title: 'Maschera e inpainting',
          description: 'Il server scrive un PNG di maschera delle stesse dimensioni, poi esegue remove_object_lama.py con l\'immagine e la maschera.',
        },
        {
          title: 'Scarica e controlla',
          description: 'Ingrandisci le regioni riempite per verificare le giunture prima di usare l\'immagine.',
        },
      ],
      advancedDetails: [
        'Il gestore è RemoveObject in ai_tools.go. Legge le dimensioni dell\'immagine con ImageMagick identify, rasterizza i rettangoli in una maschera PNG in scala di grigi nella directory temporanea del server (bianco all\'interno, nero all\'esterno, coordinate arrotondate a pixel interi e limitate ai bordi dell\'immagine), esegue lo script ed elimina la maschera al termine.',
        'remove_object_lama.py apre l\'immagine con Pillow e la converte in RGB, carica la maschera in scala di grigi, ridimensiona la maschera all\'immagine se le dimensioni differiscono, chiama SimpleLama(image, mask) e salva il risultato nel percorso di output. A causa della conversione in RGB, un PNG trasparente in ingresso perde il canale alfa.',
        'Ogni rettangolo viene convalidato sul server: larghezza e altezza devono essere positive e il riquadro deve trovarsi tra 0 e 1 su entrambi gli assi, altrimenti il lavoro viene rifiutato prima di iniziare e l\'operazione viene rimborsata.',
        'Il percorso IA salta la fase ImageMagick, quindi filtri, tinta, testo sovrapposto, qualità e impostazioni di ridimensionamento non si applicano, e la copia dei metadati con exiftool non viene eseguita; il risultato non contiene EXIF dell\'originale. Pillow salva il file con le impostazioni predefinite del proprio encoder per il formato scelto.',
        'LaMa riempie a partire dal contesto, quindi la qualità del riempimento dipende da ciò che circonda il riquadro. Cielo, erba, sabbia, acqua, muri e pavimenti danno risultati convincenti; un riquadro che attraversa un volto, un testo o un motivo regolare costringe il modello a inventare una struttura che non può conoscere.',
      ],
      whyItMatters: [
        'Un ritocco con il timbro clone su uno sfondo con texture richiede pratica e tempo; un rettangolo richiede due secondi.',
        'Una persona, un cavo o un cartello di troppo possono essere l\'unica cosa tra uno scatto utilizzabile e doverlo rifare.',
        'Funziona anche come strumento per la privacy, per numeri civici, targhe e schermi che non dovrebbero comparire in una foto condivisa.',
      ],
      useCases: [
        {
          title: 'Viaggi e paesaggi',
          description: 'Rimuovi un turista, un filo o un cestino da una veduta altrimenti pulita.',
        },
        {
          title: 'Foto di prodotti',
          description: 'Cancella un cartellino del prezzo, un supporto o un granello di polvere da un\'immagine per un annuncio.',
        },
        {
          title: 'Immobiliare',
          description: 'Elimina un\'auto, un bidone o il disordine dal bordo dell\'inquadratura.',
        },
        {
          title: 'Privacy',
          description: 'Cancella un numero civico, una targa o un monitor visibile.',
        },
      ],
      workedExamples: [
        {
          title: 'Un rettangolo su una foto di spiaggia 4000 x 3000',
          body: 'Input: un JPEG da 5.2 MB di 4000 x 3000 con una persona sulla linea dell\'acqua. Disegna un riquadro che parte al 60% in orizzontale e al 40% in verticale, largo il 10% e alto il 15%, e mantieni JPG come output. L\'API moltiplica quelle frazioni per le dimensioni dell\'immagine e scrive una maschera 4000 x 3000 con un blocco bianco di 400 x 450 pixel a (2400, 1200). LaMa viene eseguito una volta su immagine e maschera sulla GPU e lo script salva un JPG 4000 x 3000 con i 180,000 pixel mascherati riempiti con la sabbia e l\'acqua circostanti. Il passaggio del modello su un\'immagine da 12 megapixel richiede secondi sulla GPU; scrivere e scaricare un JPG di diversi megabyte occupa una quota comparabile del totale.',
        },
        {
          title: 'Due rettangoli su una foto di prodotto PNG 1920 x 1080',
          body: 'Input: un PNG da 2.3 MB di 1920 x 1080 di una lampada su un tavolo con un cavo e un adesivo del prezzo. Disegna due riquadri: uno sul cavo (circa 5% per 30%) e uno sull\'adesivo (circa 8% per 6%). Entrambi vengono rasterizzati nella stessa maschera 1920 x 1080, così un unico passaggio di inpainting gestisce entrambe le regioni. Scegli PNG come output per evitare artefatti JPEG nelle aree riempite; il risultato è un PNG 1920 x 1080, RGB opaco perché Pillow converte l\'input in RGB prima dell\'inpainting. A 2 megapixel il passaggio sulla GPU è rapido, e la maggior parte del tempo effettivo è il caricamento e la scrittura del PNG.',
        },
      ],
      whenNotToUse: 'Non usare l\'inpainting su un oggetto che occupa una grande parte dell\'inquadratura, sta davanti a un volto, si sovrappone a testo leggibile o interrompe un motivo regolare come mattoni, piastrelle o una tastiera: il modello deve inventare una struttura e il risultato apparirà sbavato o ripetitivo. È anche lo strumento sbagliato quando vuoi mantenere intatto un PNG trasparente, perché lo script appiattisce l\'input in RGB, e quando la modifica deve essere forensicamente onesta, perché la regione riempita è contenuto generato. Per sostituire l\'intero sfondo usa lo strumento di rimozione dello sfondo; per volti che vanno solo nascosti, è più adatto lo strumento di sfocatura dei volti.',
      whyMediaManipulator: [
        'La maschera viene costruita sul server da frazioni esatte, così ciò che disegni sull\'anteprima di un telefono corrisponde agli stessi pixel di un desktop.',
        'Il modello è indicato per nome (LaMa tramite simple_lama_inpainting) e il comportamento di formato e canale alfa è documentato invece di essere lasciato a indovinare.',
        'Funziona sulla nostra GPU; lo strumento standard non richiede un account. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ],
      privacyNote: 'La tua foto è conservata in uploads/<jobId>/ sul nostro server; la maschera dei rettangoli viene scritta come PNG temporaneo nella directory temporanea del server ed eliminata appena lo script di inpainting termina; l\'immagine riempita va in outputs/<jobId>/. Le coordinate dei rettangoli vengono conservate nelle opzioni del lavoro per consentire la rendicontazione del lavoro. LaMa viene eseguito su una GPU nella stessa macchina e nessuna parte dell\'immagine va a un fornitore esterno. Ogni caricamento di immagine, compreso questo, viene anche riassunto una volta da una fase di analisi automatica sul nostro server tramite un modello di visione locale, e quel riassunto resta con il lavoro. L\'output non contiene EXIF perché le operazioni IA saltano la copia dei metadati. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      faq: [
        {
          question: 'La rimozione degli oggetti è gratuita?',
          answer: 'Sì, entro la quota IA giornaliera. Ogni rimozione consuma un lavoro IA: di default 3 al giorno per gli ospiti e 10 con un account gratuito, con limiti per file di 200 MB e 1 GB; 100 e 200 su Premium e Pro. La tua quota standard per le conversioni è separata e resta com\'era. I numeri in vigore sono su /pricing.',
        },
        {
          question: 'Quanto deve essere preciso il rettangolo?',
          answer: 'Non molto. La maschera è il rettangolo che hai disegnato, arrotondato a pixel interi, quindi includi un po\' di sfondo attorno all\'oggetto e alla sua ombra. Il modello fonde il margine in più.',
        },
        {
          question: 'Posso rimuovere più oggetti in una volta?',
          answer: 'Sì. Ogni rettangolo che disegni viene dipinto nella stessa maschera e tutti vengono riempiti in un unico passaggio. Serve almeno un rettangolo, altrimenti il lavoro viene rifiutato.',
        },
        {
          question: 'Perché l\'area riempita appare sfocata o ripetuta?',
          answer: 'LaMa riempie a partire dai pixel attorno al riquadro. Un riquadro su dettagli fini o su un motivo regolare lo costringe a indovinare. Prova un riquadro più stretto, rimuovi un oggetto alla volta, oppure scegli uno scatto in cui lo sfondo dietro l\'oggetto è più semplice.',
        },
        {
          question: 'In che formato arriva il risultato?',
          answer: 'Quello che hai scelto nel modulo: JPG, PNG, WebP o GIF. L\'input viene convertito in RGB prima dell\'inpainting, quindi la trasparenza non viene preservata. PNG evita artefatti JPEG nelle regioni riempite.',
        },
        {
          question: 'Il risultato conserva i miei dati EXIF?',
          answer: 'No. Il percorso IA salta la copia con exiftool che il convertitore normale esegue, e Pillow scrive un file nuovo, quindi nessun tag di fotocamera, data o GPS viene trasferito.',
        },
        {
          question: 'La maschera o la mia foto vengono inviate altrove?',
          answer: 'No. La maschera è un file temporaneo sul nostro server che viene eliminato dopo l\'esecuzione, e il modello di inpainting funziona sulla nostra GPU.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Ogni lavoro consuma un lavoro IA dalla tua quota IA giornaliera; il limite di dimensione per file del tuo piano è mostrato nel modulo.',
        ],
      },
      related: [
        {
          label: 'Rimuovi lo sfondo da un\'immagine',
          to: '/tools/remove-background-from-image',
          description: 'Ritaglia completamente il soggetto invece di correggere una sola area.',
        },
        {
          label: 'Sfoca i volti in una foto',
          to: '/tools/blur-faces-in-photo',
          description: 'Nascondi le persone senza inventare lo sfondo.',
        },
        {
          label: 'Oscura il testo in un\'immagine',
          to: '/tools/redact-text-in-image',
          description: 'Copri di nero il testo che l\'OCR riesce a trovare, invece di ricostruirlo con l\'inpainting.',
        },
        {
          label: 'Restauro di immagini con IA',
          to: '/tools/ai-image-restoration',
          description: 'Ripulisci rumore e compressione attorno alla correzione.',
        },
        {
          label: 'Comprimi immagine',
          to: '/tools/compress-image',
          description: 'Riduci il peso della foto finita per condividerla.',
        },
      ],
      embed: {
        title: 'Rimuovi un oggetto da una foto',
        description: 'Carica una foto. Rimuovi oggetto è già selezionato e bloccato. Disegna uno o più rettangoli su ciò che vuoi far sparire, poi converti.',
      },
    },
    'clean-voice-audio': {
      name: 'Pulisci l\'audio della voce',
      h1: 'Pulisci le registrazioni vocali con l\'IA',
      tagline: 'Rendi il parlato più chiaro riducendo fruscio, ambiente della stanza e rimbombo in podcast, interviste e note vocali.',
      metaTitle: 'Pulisci le registrazioni vocali con l\'IA | Media Manipulator',
      metaDescription: 'Pulisci una registrazione vocale con l\'IA. Riduci fruscio, ronzio e rumore ambientale per sentire meglio il parlato. Funziona sulla nostra GPU. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Pulisci le registrazioni vocali con l\'IA',
      ogDescription: 'Riduci fruscio, ronzio e rumore della stanza per un parlato più chiaro in podcast, interviste e note vocali.',
      intro: 'Una nota vocale registrata con il telefono in una cucina piena di eco, l\'ospite di un podcast al microfono del portatile, una lezione registrata dal fondo dell\'aula: le parole ci sono, ma restano sotto fruscio e rumore della stanza. Pulisci voce fa passare la registrazione attraverso DeepFilterNet sulla nostra GPU, poi attraverso una catena di rifinitura fissa in stile broadcast che taglia il rimbombo, limita le alte frequenze, porta il livello a una loudness costante e impedisce ai picchi di andare in clipping. È pensato per il parlato, non per la musica.',
      whatItDoes: [
        'Converte il tuo file in mono a 48 kHz con ffmpeg, che è l\'input atteso da DeepFilterNet, e passa quel WAV al modello sulla nostra GPU.',
        'Sopprime i suoni di fondo costanti (fruscio, ventole, ronzio, rumore ambientale) mantenendo il parlato, grazie alla rete di enhancement DeepFilterNet.',
        'Applica una catena di rifinitura dopo la riduzione del rumore: un passa-alto a 80 Hz, un passa-basso a 14 kHz, normalizzazione della loudness a -16 LUFS con un tetto true-peak di -1.5 dBTP e un limiter a 0.95.',
        'Codifica il risultato nel formato che scegli: MP3, AAC o OGG a 192 kbps, Opus a 128 kbps, FLAC oppure WAV a 16 bit.',
        'Salta i controlli standard di bitrate, EQ, effetti e taglio, perché il percorso IA sostituisce la normale pipeline di filtri ffmpeg.',
      ],
      flowSteps: [
        {
          title: 'Carica una registrazione',
          description: 'Note vocali, audio di interviste, take di podcast o registrazioni di lezioni in MP3, WAV, FLAC, M4A, AAC, OGG o Opus.',
        },
        {
          title: 'Pulisci voce è preimpostato',
          description: 'L\'operazione è fissa in questa pagina; l\'unica scelta che resta è il formato di output.',
        },
        {
          title: 'Normalizza, riduci il rumore, rifinisci',
          description: 'ffmpeg crea un WAV mono a 48 kHz, DeepFilterNet ne riduce il rumore e i filtri di rifinitura impostano timbro e loudness.',
        },
        {
          title: 'Scarica e ascolta',
          description: 'Confrontalo con l\'originale in cuffia prima di pubblicarlo.',
        },
      ],
      advancedDetails: [
        'La catena di rifinitura è esattamente highpass=f=80,lowpass=f=14000,loudnorm=I=-16:TP=-1.5:LRA=11,alimiter=limit=0.95, applicata una sola volta al WAV ripulito. Il passa-alto elimina il rimbombo da manipolazione e i colpi delle plosive, il passa-basso attenua il fruscio sopra i 14 kHz e loudnorm porta la loudness integrata a -16 LUFS, il target abituale dei podcast parlati.',
        'L\'output è sempre mono a 48 kHz perché il modello lavora su un solo canale. Un\'intervista stereo resta intelligibile ma perde la collocazione sinistra-destra; se ti serve lo stereo, questo è lo strumento sbagliato.',
        'Le impostazioni dell\'encoder derivano dall\'estensione di output: libmp3lame a 192 kbps per MP3, aac a 192 kbps per AAC o M4A, libvorbis a 192 kbps per OGG, libopus a 128 kbps per Opus, flac per FLAC e pcm_s16le per WAV. Non c\'è un selettore di bitrate nel percorso IA.',
        'Gli intervalli di taglio e i soliti effetti vengono ignorati quando è selezionata un\'operazione IA; il convertitore invia il file direttamente al modello e restituisce il risultato. Taglia prima la registrazione se vuoi pulirne solo una parte.',
        'Un secondo passaggio in Pulisci voce normalizza di nuovo un audio già a -16 LUFS e può aggiungere una qualità acquosa alle consonanti. Eseguilo una volta sola.',
        'Il modello fatica con voci concorrenti, basi musicali ed eventi improvvisi ad alto volume; non sono "rumore di fondo costante" e vengono in gran parte lasciati al loro posto.',
      ],
      whyItMatters: [
        'Gli ascoltatori interrompono una registrazione faticosa da sentire anche quando ciò che viene detto vale la pena di essere ascoltato.',
        'Un livello costante a -16 LUFS fa sì che un episodio suoni allo stesso volume di quelli vicini, senza un passaggio manuale sul guadagno.',
        'Il parlato sollevato dal rumore si trascrive anche con maggiore precisione, quindi pulire prima migliora anche i sottotitoli.',
      ],
      useCases: [
        {
          title: 'Podcast e interviste',
          description: 'Sistema un ospite remoto registrato con un microfono di base e portalo alla stessa loudness del conduttore.',
        },
        {
          title: 'Note vocali e dettatura',
          description: 'Rendi una registrazione del telefono comprensibile in seguito, e abbastanza forte da sentirla senza cuffie.',
        },
        {
          title: 'Lezioni e riunioni',
          description: 'Abbassa il ronzio dell\'aria condizionata e la ventola del proiettore in una registrazione fatta dal fondo di una sala.',
        },
        {
          title: 'Narrazione per un video',
          description: 'Rifinisci la voce fuori campo prima di inserirla nell\'editor Darkroom.',
        },
      ],
      workedExamples: [
        {
          title: 'Una nota vocale da 12 minuti (M4A, 128 kbps, circa 11 MB) in MP3',
          body: 'Un file AAC a 128 kbps occupa 16 KB al secondo, quindi 720 secondi sono circa 11.5 MB. Dodici minuti superano il limite di 5 minuti per gli ospiti, quindi serve un account gratuito (20 minuti). ffmpeg scrive prima un WAV mono a 48 kHz di circa 69 MB (96,000 byte al secondo) in una cartella temporanea che viene rimossa alla fine del lavoro. DeepFilterNet e la catena di rifinitura lavorano su quello, e l\'encoder MP3 scrive il risultato a 192 kbps: circa 17 MB, più grande dell\'input perché 192 kbps è un bitrate più alto di quello con cui la nota era stata registrata. I due passaggi ffmpeg richiedono secondi; il passaggio DeepFilterNet domina e cresce con la lunghezza della registrazione.',
        },
        {
          title: 'Un\'intervista WAV stereo da 4 minuti (44.1 kHz, 16 bit, circa 42 MB) in WAV',
          body: 'Il PCM stereo a 16 bit e 44.1 kHz occupa 176,400 byte al secondo, quindi 240 secondi sono circa 42 MB, entro i limiti per gli ospiti di 200 MB e 5 minuti. Il file viene ripiegato in mono e ricampionato a 48 kHz prima dell\'esecuzione del modello, e il WAV ripulito torna come mono a 16 bit e 48 kHz: 96,000 byte al secondo, circa 23 MB. È più piccolo dell\'input solo perché ha un canale invece di due. Scegliendo FLAC si conservano gli stessi campioni senza perdita in meno spazio; scegliendo MP3 si ottengono circa 5.8 MB a 192 kbps.',
        },
      ],
      whenNotToUse: 'Evita questo strumento per musica, canto o qualsiasi cosa in cui il fondo faccia parte del suono che vuoi conservare: il modello tratta come rumore tutto ciò che non è parlato, e la catena di rifinitura taglia sotto gli 80 Hz e sopra i 14 kHz, svuotando gli strumenti. È anche la scelta sbagliata quando devi mantenere lo stereo, quando la registrazione è in clipping o distorta (quel danno non è rumore e non può essere filtrato), oppure quando vuoi solo abbassare il rumore senza alcuna modifica di livello o timbro, che è invece ciò che fa la pagina Rimuovi il rumore di fondo.',
      whyMediaManipulator: [
        'DeepFilterNet e la catena di rifinitura funzionano su una GPU gestita da noi; la registrazione non viene inviata a un servizio esterno di speech enhancement.',
        'La pagina si apre con Pulisci voce già selezionato e il menu delle operazioni nascosto, quindi l\'unica decisione è il formato di output.',
        'Un lavoro di pulizia è un lavoro standard sulla tua quota giornaliera (di default 5 come ospite, 30 con un account gratuito), non un lavoro IA, e un lavoro non riuscito viene rimborsato.',
      ],
      privacyNote: 'La tua registrazione viene salvata nella cartella del suo lavoro, convertita da ffmpeg in un WAV mono temporaneo a 48 kHz in una directory di lavoro e passata a DeepFilterNet sulla nostra GPU; quella directory di lavoro viene eliminata appena il file ripulito è stato codificato. L\'output ripulito resta con il lavoro per il download. I caricamenti audio passano anche attraverso una fase di analisi automatica sul nostro server, che trascrive la registrazione con Whisper per una revisione interna dei contenuti e conserva quel risultato con il lavoro. Nessun fornitore di IA di terze parti riceve il file. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      faq: [
        {
          question: 'Perché il file ripulito esce in mono?',
          answer: 'La pipeline converte ogni input in un solo canale a 48 kHz prima dell\'esecuzione di DeepFilterNet e codifica l\'output del modello così com\'è. Una registrazione stereo torna quindi in mono. Per un\'intervista a due microfoni, separa prima i canali e pulisci ciascuno a parte se devi mantenere la separazione.',
        },
        {
          question: 'A quale loudness normalizza Pulisci voce?',
          answer: 'La catena di rifinitura usa loudnorm di ffmpeg con un target integrato di -16 LUFS, un tetto true-peak di -1.5 dBTP e un loudness range di 11 LU, seguito da un limiter a 0.95. Corrisponde ai comuni target di consegna per il parlato, quindi un episodio pulito qui si collocherà a un livello simile a quello dei podcast masterizzati professionalmente.',
        },
        {
          question: 'Posso impostare il bitrate o tagliare il file in questa pagina?',
          answer: 'No. Quando è attiva un\'operazione IA il convertitore passa direttamente al modello e ignora le impostazioni di bitrate, EQ, effetti e taglio. Il bitrate di output è fissato dal formato: 192 kbps per MP3, AAC e OGG, 128 kbps per Opus. Taglia prima la registrazione con un altro strumento se ne vuoi solo una parte.',
        },
        {
          question: 'In cosa differisce da Rimuovi il rumore di fondo?',
          answer: 'Entrambi eseguono lo stesso modello DeepFilterNet. Pulisci voce aggiunge in seguito passa-alto, passa-basso, normalizzazione della loudness e limiter; Rimuovi il rumore di fondo si ferma al segnale ripulito e lascia intatti livelli e timbro. Scegli Pulisci voce per un file parlato finito e l\'altra pagina quando prevedi di mixarlo o masterizzarlo da solo.',
        },
        {
          question: 'Può sistemare una registrazione in clipping o distorta?',
          answer: 'No. Il clipping è forma d\'onda mancante, non rumore aggiunto, e il modello non ha nulla da sottrarre. Può comunque abbassare il fruscio attorno a una take distorta, ma la gracchiatura sulle sillabe forti resterà.',
        },
        {
          question: 'Quante registrazioni posso pulire al giorno, ed è gratuito?',
          answer: 'Pulisci voce è conteggiato di proposito come lavoro standard, quindi consuma un lavoro dalla quota standard: di default 5 al giorno come ospite, 30 con un account gratuito, 300 su Premium e 700 su Pro, con limiti per file di 200 MB, 1 GB e 5 GB e limiti di durata di 5 minuti, 20 minuti e 2 ore. La tabella aggiornata è su /pricing.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Pulisci voce usa la quota standard; i limiti di durata dipendono dal tuo piano e sono mostrati in tempo reale nel modulo.',
        ],
      },
      related: [
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Lo stesso denoiser senza la rifinitura di loudness e timbro.',
        },
        {
          label: 'Trascrivi video',
          to: '/tools/transcribe-video',
          description: 'Trasforma il parlato ripulito in sottotitoli o testo.',
        },
        {
          label: 'Estrai l\'audio da un video',
          to: '/tools/extract-audio-from-video',
          description: 'Estrai la traccia vocale da un video prima di pulirla.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Colloca la narrazione rifinita su una timeline video.',
        },
        {
          label: 'Rimuovi la voce da una canzone',
          to: '/tools/remove-vocals-from-song',
          description: 'Per la musica anziché il parlato, separa invece il cantante.',
        },
      ],
      embed: {
        title: 'Pulisci una registrazione vocale',
        description: 'Carica una registrazione. Pulisci voce è già applicato, quindi non c\'è un menu delle operazioni da impostare. Scegli un formato di output se ti serve qualcosa di diverso dal predefinito, poi converti.',
      },
    },
    'remove-background-noise': {
      name: 'Rimuovi il rumore di fondo',
      h1: 'Rimuovi il rumore di fondo dall\'audio online',
      tagline: 'Riduci fruscio, ronzio, traffico e rumore ambientale in una registrazione con un denoiser IA, mantenendo in primo piano il suono principale.',
      metaTitle: 'Rimuovi il rumore di fondo dall\'audio online | Media Manipulator',
      metaDescription: 'Rimuovi il rumore di fondo dall\'audio. Un denoiser IA riduce fruscio, ronzio e suoni ambientali nelle registrazioni. Funziona sulla nostra GPU. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Rimuovi il rumore di fondo dall\'audio online',
      ogDescription: 'Un denoiser IA che abbassa fruscio, ronzio, traffico e rumore della stanza nelle registrazioni audio.',
      intro: 'Condizionatori, ventole dei computer, traffico stradale e ronzio elettrico sono suoni costanti che stanno sotto ciò che volevi davvero registrare. Questa pagina fa passare il file attraverso DeepFilterNet, un denoiser basato su deep learning, sulla nostra GPU e restituisce il segnale ripulito senza alcuna altra modifica: nessuna normalizzazione della loudness, nessuna equalizzazione, nessun limiter. Questo la rende la scelta giusta quando intendi mixare o masterizzare il risultato da solo, o quando vuoi che il carattere dell\'originale resti intatto.',
      whatItDoes: [
        'Ricampiona il file caricato in mono a 48 kHz con ffmpeg e passa quel WAV al binario DeepFilterNet sulla nostra GPU.',
        'Stima il rumore di fondo stazionario e lo sottrae, abbassando fruscio, ronzio, ventole, impianti di aerazione e traffico costante.',
        'Restituisce l\'output grezzo del modello codificato nel formato che scegli, con lo stesso livello di picco e lo stesso bilanciamento tonale prodotti dal modello; in questa pagina non c\'è alcuna fase di post-elaborazione.',
        'Mantiene visibile il menu delle operazioni, così puoi passare a Pulisci voce o agli strumenti per la voce dallo stesso modulo.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'audio',
          description: 'Qualsiasi file audio comune, compresa una traccia estratta da un video.',
        },
        {
          title: 'La riduzione del rumore è preselezionata',
          description: 'Rimuovi rumore di fondo è già scelto; cambia il formato di output se vuoi qualcosa di diverso da MP3.',
        },
        {
          title: 'DeepFilterNet funziona sulla nostra GPU',
          description: 'Il modello separa il rumore costante dal primo piano e scrive un WAV migliorato.',
        },
        {
          title: 'Codifica e scarica',
          description: 'ffmpeg scrive il WAV migliorato nel formato scelto; ascoltalo accanto all\'originale.',
        },
      ],
      advancedDetails: [
        'L\'unica differenza tra questa pagina e Pulisci voce nell\'API è un singolo flag: polish=false. Il passaggio di codifica ffmpeg non riceve nessun filtro -af, quindi il WAV migliorato viene codificato così come l\'ha scritto DeepFilterNet.',
        'La normalizzazione dell\'input è ffmpeg -ac 1 -ar 48000: il modello lavora su un solo canale a 48 kHz, quindi l\'output è mono a 48 kHz indipendentemente dalla disposizione dei canali o dalla frequenza di campionamento dell\'input.',
        'Gli encoder seguono l\'estensione: MP3 tramite libmp3lame a 192 kbps, AAC a 192 kbps, OGG tramite libvorbis a 192 kbps, Opus tramite libopus a 128 kbps, FLAC senza perdita, WAV come pcm_s16le. Scegli WAV o FLAC se intendi continuare a modificare, così paghi una codifica con perdita una sola volta.',
        'Poiché non viene eseguita alcuna normalizzazione della loudness, una registrazione a basso volume resta a basso volume. La riduzione del rumore toglie energia, quindi il risultato può avere un livello un po\' più basso dell\'input; se serve, alza il guadagno nel tuo editor in seguito.',
        'DeepFilterNet è addestrato su rumore stazionario e che varia lentamente. Clic di tastiera, porte che sbattono, un secondo interlocutore o una base musicale vengono in gran parte preservati, perché per il modello sembrano segnale.',
        'La directory di lavoro che contiene i WAV normalizzato e migliorato viene eliminata al termine del lavoro; solo l\'output codificato resta con il lavoro.',
      ],
      whyItMatters: [
        'Il rumore costante maschera le consonanti deboli e affatica gli ascoltatori molto prima che si accorgano del perché.',
        'Molte registrazioni non possono essere rifatte: il discorso a un matrimonio, una lezione, un\'intervista con qualcuno che non è più disponibile.',
        'Una traccia ripulita ma non normalizzata né limitata ti dà un punto di partenza pulito per il tuo mix, invece di un file dal suono finito che poi devi disfare.',
      ],
      useCases: [
        {
          title: 'Audio estratto da un video',
          description: 'Estrai la traccia, rimuovi la ventola della fotocamera o il vento, poi rimettila sotto le immagini in Darkroom.',
        },
        {
          title: 'Registrazioni sul campo',
          description: 'Abbassa il rombo di una strada o di un generatore sotto un\'intervista all\'aperto.',
        },
        {
          title: 'Esportazioni di chiamate e riunioni',
          description: 'Riduci il fruscio di linea in una chiamata registrata prima di condividerla o trascriverla.',
        },
        {
          title: 'Cassette digitalizzate',
          description: 'Abbassa il fruscio del nastro su una registrazione convertita senza cambiarne i livelli.',
        },
      ],
      workedExamples: [
        {
          title: 'Una registrazione di chiamata MP3 da 18 minuti a 128 kbps (circa 17 MB) in FLAC',
          body: 'A 128 kbps un MP3 occupa 16 KB al secondo, quindi 1,080 secondi sono circa 17 MB. Diciotto minuti rientrano nel limite di 20 minuti dell\'account gratuito ma superano il limite di 5 minuti per gli ospiti, quindi accedi prima. ffmpeg scrive un WAV mono a 48 kHz di circa 104 MB (96,000 byte al secondo) per il modello, e quel WAV viene scartato dopo la codifica. Scegliendo FLAC si ottengono i campioni mono a 48 kHz migliorati senza perdita; il FLAC è più piccolo del WAV da 104 MB di una quantità che dipende da quanto silenzio e fruscio è stato rimosso, e la riduzione del rumore di solito fa comprimere meglio il FLAC. Scegliendo MP3 si otterrebbero invece circa 26 MB a 192 kbps.',
        },
        {
          title: 'Una registrazione sul campo FLAC stereo da 4 minuti e 30 secondi (circa 30 MB) in WAV',
          body: 'Quattro minuti e mezzo e 30 MB rientrano nei limiti per gli ospiti di 5 minuti e 200 MB, quindi non serve un account. Il file stereo viene ripiegato in mono e ricampionato a 48 kHz, DeepFilterNet abbassa il tappeto di traffico e l\'output WAV è mono a 16 bit e 48 kHz: 96,000 byte al secondo per 270 secondi, circa 26 MB. Il livello è quello lasciato dal modello, senza normalizzazione applicata, quindi alzalo nel tuo editor se l\'originale era a basso volume. Le due conversioni ffmpeg richiedono pochi secondi ciascuna; il passaggio sulla GPU cresce con la durata.',
        },
      ],
      whenNotToUse: 'Non è lo strumento adatto a registrazioni in cui il rumore è intermittente o è a sua volta una voce: interlocutori sovrapposti, una televisione nella stanza accanto, sedie che strisciano e ticchettio di tastiera restano in gran parte intatti perché il modello è costruito per il rumore costante. Non usarlo su musica finita, dove il "rumore" che rimuove potrebbe essere il riverbero e l\'ambiente della sala che hai pagato. Se ti serve l\'output in stereo è la scelta sbagliata, perché la pipeline è mono. E se vuoi un file parlato pronto da pubblicare a una loudness standard, Pulisci voce aggiunge quella rifinitura; questa pagina, di proposito, no.',
      whyMediaManipulator: [
        'Il denoiser funziona su una GPU gestita da noi; il tuo audio non viene caricato su un servizio di rimozione del rumore di terze parti.',
        'Nulla viene aggiunto dopo il modello: nessuna modifica della loudness, nessun EQ, quindi ciò che senti è la riduzione del rumore e solo quella.',
        'Un lavoro di riduzione del rumore è un lavoro standard dalla tua quota giornaliera, non un lavoro IA, e viene rimborsato se il lavoro non riesce.',
      ],
      privacyNote: 'Il file che carichi viene scritto nella cartella del suo lavoro, ricampionato da ffmpeg in un WAV mono temporaneo a 48 kHz in una directory di lavoro e ripulito da DeepFilterNet sulla nostra GPU; la directory di lavoro viene rimossa una volta codificato l\'output. Il risultato codificato viene conservato con il lavoro per il download. Come ogni caricamento audio, passa anche attraverso una fase di analisi automatica sul nostro server, che lo trascrive con Whisper per una revisione interna che resta con il lavoro. Nulla va a un fornitore di IA esterno. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      faq: [
        {
          question: 'Quali rumori gestisce bene DeepFilterNet, e quali no?',
          answer: 'Suoni costanti e che cambiano lentamente: fruscio, ronzio di rete, ventole, aria condizionata, rumore ambientale, una strada costante. Gli eventi brevi e tutto ciò che somiglia al parlato (una seconda persona, una televisione, clic, colpi) sembrano primo piano al modello e vengono in gran parte conservati.',
        },
        {
          question: 'Il livello o il timbro della mia registrazione cambieranno?',
          answer: 'Solo come effetto collaterale della rimozione dell\'energia del rumore; in questa pagina non viene applicata alcuna normalizzazione, EQ o limitazione. Se vuoi un livello costante a -16 LUFS per il parlato e anche un passaggio con passa-alto e passa-basso, usa Pulisci voce, che esegue lo stesso modello con quella catena di rifinitura aggiunta.',
        },
        {
          question: 'Perché il file ripulito è mono?',
          answer: 'Il modello accetta un solo canale a 48 kHz, quindi ffmpeg ripiega prima in mono qualsiasi input stereo e l\'output viene scritto così. Una registrazione stereo con rumore diverso in ciascun canale va separata e ripulita un canale alla volta se devi mantenerla stereo.',
        },
        {
          question: 'Posso ridurre il rumore dell\'audio di un video direttamente?',
          answer: 'Carica la traccia audio anziché il video: estraila con lo strumento Estrai l\'audio, riduci il rumore qui, poi unisci la traccia ripulita e il video in Darkroom.',
        },
        {
          question: 'Qual è il formato di output migliore per continuare a modificare?',
          answer: 'WAV (mono a 16 bit e 48 kHz, 96 KB al secondo) oppure FLAC, che contiene gli stessi campioni in meno spazio. MP3, AAC e OGG vengono scritti a 192 kbps e Opus a 128 kbps; sceglili solo per la condivisione finale, così la codifica con perdita avviene una sola volta.',
        },
        {
          question: 'La riduzione del rumore viene conteggiata sulla quota IA?',
          answer: 'No. La rimozione del rumore di fondo è conteggiata di proposito come lavoro standard, come Pulisci voce: di default 5 al giorno per un ospite, 30 con un account gratuito, 300 su Premium e 700 su Pro. (Isolare o rimuovere la voce è diverso: ciascuna di quelle operazioni è un lavoro IA.) La durata è limitata a 5 minuti per gli ospiti e 20 minuti per gli account gratuiti; i limiti aggiornati sono su /pricing.',
        },
        {
          question: 'E se la registrazione è già abbastanza pulita?',
          answer: 'Il modello viene comunque eseguito e rimuoverà il rumore di fondo residuo che trova, ma la differenza udibile sarà piccola e potresti preferire l\'originale intatto. Confronta i due prima di sostituire qualcosa.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'La riduzione del rumore usa la quota standard; i limiti di durata dipendono dal tuo piano e sono mostrati in tempo reale nel modulo.',
        ],
      },
      related: [
        {
          label: 'Pulisci l\'audio della voce',
          to: '/tools/clean-voice-audio',
          description: 'Lo stesso denoiser più la rifinitura di loudness e timbro per il parlato.',
        },
        {
          label: 'Estrai l\'audio da un video',
          to: '/tools/extract-audio-from-video',
          description: 'Estrai prima la traccia audio da un video.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Rimetti la traccia ripulita sotto il video.',
        },
        {
          label: 'Trascrivi video',
          to: '/tools/transcribe-video',
          description: 'Trascrivi l\'audio più pulito per i sottotitoli.',
        },
        {
          label: 'Rimuovi la voce da una canzone',
          to: '/tools/remove-vocals-from-song',
          description: 'Separa il canto dalla musica con un modello diverso.',
        },
      ],
      embed: {
        title: 'Rimuovi il rumore di fondo',
        description: 'Carica una registrazione. Rimuovi rumore di fondo è già selezionato per te. Puoi comunque cambiare il formato di output, poi converti.',
      },
    },
    'remove-vocals-from-song': {
      name: 'Rimuovi la voce da una canzone',
      h1: 'Rimuovi la voce da una canzone per una base strumentale o karaoke',
      tagline: 'Elimina il canto da un brano e mantieni la musica, per karaoke, esercizio e basi musicali. Usalo solo su musica di cui possiedi i diritti.',
      metaTitle: 'Rimuovi la voce da una canzone: crea basi karaoke | Media Manipulator',
      metaDescription: 'Rimuovi la voce da una canzone con l\'IA e scarica la base strumentale nello stesso formato del tuo file, oppure in FLAC o WAV. Basi per karaoke ed esercizio, sulla nostra GPU. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Rimuovi la voce da una canzone per il karaoke',
      ogDescription: 'Elimina il canto da una canzone con l\'IA e scarica la base strumentale in MP3, FLAC o WAV.',
      intro: 'Serate karaoke, esercizio di canto e registrazioni di cover hanno tutte bisogno della band senza il cantante. Questa pagina fa passare la canzone attraverso Demucs (il modello htdemucs) sulla nostra GPU in modalità a due stem, che divide il mix in "voce" e "tutto il resto", e restituisce lo stem con tutto il resto. La base strumentale torna di default nello stesso formato del tuo file, così un MP3 a 320 kbps resta un MP3 a 320 kbps invece di gonfiarsi in un WAV; FLAC e WAV sono disponibili quando vuoi un file senza perdita per il montaggio.',
      whatItDoes: [
        'Esegue Demucs htdemucs con --two-stems=vocals, così il modello stima solo due parti: la voce principale e l\'accompagnamento.',
        'Conserva lo stem no_vocals e scarta lo stem vocale; il risultato è un unico file stereo con il canto rimosso.',
        'Risolve "Come l\'input" in un formato concreto al caricamento: MP3 resta MP3, AAC/M4A resta AAC/M4A, OGG e Opus restano com\'erano, e gli input WAV, FLAC, AIFF o ALAC tornano come FLAC.',
        'Scrive gli stem MP3 e AAC a 320 kbps anziché ai 192 kbps usati dagli altri strumenti audio, così la codifica non aggiunge perdita udibile oltre alla separazione.',
        'Mostra una stima della dimensione di output per ogni scelta di formato prima che tu inizi, in base alla durata del tuo file.',
      ],
      flowSteps: [
        {
          title: 'Carica una canzone',
          description: 'Un brano che possiedi o che hai la licenza di usare, in MP3, WAV, FLAC, M4A, AAC, OGG o Opus.',
        },
        {
          title: 'Rimuovi la voce è preimpostato',
          description: 'L\'operazione è fissa; "Formato di output" è impostato di default su Come l\'input, con MP3, FLAC e WAV come alternative.',
        },
        {
          title: 'Demucs separa il mix',
          description: 'Il modello elabora la canzone in segmenti di 7 secondi sulla nostra GPU e scrive vocals.wav e no_vocals.wav.',
        },
        {
          title: 'Codifica e scarica',
          description: 'Lo stem no_vocals viene codificato nel formato risolto e offerto per il download.',
        },
      ],
      advancedDetails: [
        'L\'invocazione esatta è demucs -n htdemucs --two-stems=vocals --segment 7; la lunghezza del segmento limita la memoria GPU e permette di elaborare brani lunghi su una singola scheda. Demucs scrive stem stereo a 44.1 kHz qualunque siano la frequenza o il numero di canali dell\'input, quindi una sorgente mono o a 48 kHz torna come stereo a 44.1 kHz.',
        'La codifica degli stem è libmp3lame -b:a 320k per MP3 e aac -b:a 320k per AAC o M4A; OGG resta a 192 kbps, Opus a 128 kbps, FLAC e WAV sono senza perdita. Ogni altra operazione audio IA usa 192 kbps, il bitrate di 320 kbps è specifico degli stem.',
        'La regola "Come l\'input" è: un input con perdita restituisce lo stesso contenitore, un input senza perdita restituisce FLAC, e un file video o qualsiasi cosa che il server non riesce a collocare restituisce MP3 a 320 kbps. Un .m4a viene analizzato con ffprobe prima di decidere, perché potrebbe contenere ALAC senza perdita anziché AAC.',
        'La regola esiste a causa di un lavoro reale: un MP3 di 87 minuti e 68 MB una volta è tornato come WAV di 880 MB. Il PCM non aggiunge alcuna fedeltà che una sorgente con perdita non ha mai avuto, quindi ora il default non ingrandisce mai l\'audio con perdita in WAV; scegliere WAV esplicitamente viene comunque rispettato.',
        'La separazione non è mai perfetta. Le code di riverbero sulla voce, le armonie di accompagnamento e tutto ciò che il modello sente come "simile a una voce" (alcuni lead di sintetizzatore, fischi) possono filtrare nella base strumentale, e i mix densi si separano peggio delle produzioni moderne e ben spaziate.',
        'Il modulo avvisa quando una scelta WAV supererebbe i 500 MB, perché il WAV stereo a 44.1 kHz e 16 bit occupa 176,400 byte al secondo, circa 10.6 MB al minuto.',
      ],
      whyItMatters: [
        'Le versioni strumentali ufficiali non esistono per la maggior parte delle canzoni, e le basi su licenza sono spesso registrate di nuovo anziché essere l\'arrangiamento originale.',
        'I cantanti si esercitano in modo più utile sull\'arrangiamento reale che su un\'approssimazione MIDI.',
        'Restituire lo stem nel formato dell\'input mantiene un file da telefono a misura di telefono; un MP3 da 10 MB non dovrebbe diventare per sbaglio un download da 50 MB.',
      ],
      useCases: [
        {
          title: 'Karaoke a casa',
          description: 'Crea una versione da cantare di una canzone che già possiedi.',
        },
        {
          title: 'Esercizio vocale',
          description: 'Prova la tua parte sulla band originale senza il cantante principale nell\'orecchio.',
        },
        {
          title: 'Cover e remix',
          description: 'Usa la base strumentale come tappeto per la tua take vocale.',
        },
        {
          title: 'Musica di sottofondo per video',
          description: 'Ricava un tappeto senza voce da musica che hai la licenza di usare per un progetto Darkroom.',
        },
      ],
      workedExamples: [
        {
          title: 'Un MP3 a 320 kbps da 4 minuti (circa 9.6 MB) con Come l\'input',
          body: 'A 320 kbps un MP3 occupa 40 KB al secondo, quindi 240 secondi sono circa 9.6 MB, ben entro i limiti per gli ospiti di 5 minuti e 200 MB. Il formato si risolve in MP3 perché l\'input è MP3. Demucs elabora la canzone in finestre di 7 secondi sulla nostra GPU e scrive un no_vocals.wav stereo a 44.1 kHz di circa 42 MB in una cartella di lavoro, che ffmpeg codifica poi con libmp3lame a 320 kbps: la base strumentale è di nuovo circa 9.6 MB. Il WAV di lavoro viene eliminato. Il passaggio di separazione domina il tempo di esecuzione e cresce con la durata del brano.',
        },
        {
          title: 'Un WAV in qualità CD da 4 minuti e 50 secondi (circa 51 MB), FLAC di default o WAV esplicito',
          body: 'Un WAV stereo a 44.1 kHz e 16 bit occupa 176,400 byte al secondo, quindi 290 secondi sono circa 51 MB, ancora entro il limite di 5 minuti per gli ospiti. Poiché l\'input è senza perdita, Come l\'input si risolve in FLAC: il modulo stima il FLAC a circa il 55 percento della dimensione PCM, circa 28 MB, e il valore effettivo dipende dalla musica. Scegliendo WAV si ottiene invece lo stem come PCM a 16 bit di circa 51 MB, la stessa dimensione dell\'input; scegliendo MP3 si ottengono circa 11.6 MB a 320 kbps. Tutti e tre provengono dallo stesso stem no_vocals, cambia solo l\'encoder.',
        },
      ],
      whenNotToUse: 'Non eseguirlo su musica che non possiedi o per cui non hai una licenza; sei tu il responsabile dell\'uso del risultato. È anche lo strumento sbagliato quando vuoi il cantante anziché la band (quella è l\'operazione Isola la voce nello stesso modulo), quando ti serve una divisione a quattro vie in batteria, basso e altri strumenti (questa pagina produce solo voce e accompagnamento), oppure quando la registrazione è parlato e non canto, che le pagine Pulisci voce e rumore di fondo gestiscono meglio. Le registrazioni mono molto vecchie e i bootleg dal vivo con la voce che filtra in ogni microfono si separano male, quindi lì aspettati fantasmi udibili.',
      whyMediaManipulator: [
        'La separazione viene eseguita su una GPU gestita da noi con il modello Demucs htdemucs; la tua musica non viene inviata a un servizio di stem esterno.',
        'L\'output segue di default il tuo file, con lo stem MP3 o AAC codificato a 320 kbps, e FLAC o WAV a un clic di distanza.',
        'La stima della dimensione per ogni formato è mostrata prima che tu inizi, così un WAV sovradimensionato è una scelta, non una sorpresa.',
      ],
      privacyNote: 'La tua canzone viene conservata nella cartella del suo lavoro e passata a Demucs sulla nostra GPU, che scrive gli stem di voce e accompagnamento in una directory di lavoro; solo l\'accompagnamento viene codificato nel tuo download, e la directory di lavoro (compreso lo stem vocale scartato) viene eliminata alla fine del lavoro. La base strumentale codificata viene conservata con il lavoro. I caricamenti audio passano anche attraverso una fase di analisi automatica sul nostro server che trascrive il file con Whisper per una revisione interna conservata con il lavoro. Nessun fornitore di IA di terze parti è coinvolto. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      faq: [
        {
          question: 'Ogni traccia del cantante sparirà?',
          answer: 'La maggior parte della voce principale, ma raramente tutta. Code di riverbero, voci raddoppiate e armonie, e suoni che il modello sente come simili a una voce possono restare a basso livello. Le produzioni stereo moderne si separano meglio; le registrazioni mono o dal vivo con molte rientranze peggio.',
        },
        {
          question: 'In che formato e frequenza di campionamento arriva la base strumentale?',
          answer: 'Demucs scrive stem stereo a 44.1 kHz, quindi quella è la frequenza di ogni output. Il contenitore segue di default il tuo file: MP3 in ingresso, MP3 in uscita a 320 kbps; AAC o M4A in ingresso, lo stesso in uscita a 320 kbps; WAV, FLAC, AIFF o ALAC in ingresso, FLAC in uscita. Puoi invece scegliere esplicitamente MP3, FLAC o WAV.',
        },
        {
          question: 'Perché il default non è più WAV?',
          answer: 'Perché un MP3 di 87 minuti da 68 MB una volta tornava come WAV da 880 MB, e il PCM non può ripristinare dettagli che una sorgente con perdita non ha mai avuto. Lo stem ora resta nel formato dell\'input, con gli stem con perdita scritti a 320 kbps così la codifica aggiuntiva non è udibile. WAV è ancora disponibile se lo chiedi.',
        },
        {
          question: 'Posso ottenere solo la voce invece della base?',
          answer: 'Sì, scegli Isola la voce nel menu delle operazioni del convertitore audio; conserva lo stem vocals.wav della stessa esecuzione Demucs a due stem e scarta l\'accompagnamento.',
        },
        {
          question: 'Posso caricare un video musicale invece di un file audio?',
          answer: 'Carica l\'audio: estrai prima la traccia dal video. Se un file video arriva comunque a questa operazione, il server risolve Come l\'input in MP3 a 320 kbps, perché il contenitore video non è un formato audio.',
        },
        {
          question: 'Quante canzoni al giorno posso separare gratis?',
          answer: 'Ogni canzone è un lavoro IA: di default 3 al giorno senza account, 10 con un account gratuito, 100 su Premium e 200 su Pro. La quota IA è conteggiata a parte, quindi separare canzoni lascia intatta la tua quota standard. Le canzoni sono limitate a 5 minuti per gli ospiti e 20 minuti per gli account gratuiti, con 2 ore sui piani a pagamento; /pricing riporta la tabella aggiornata.',
        },
        {
          question: 'È legale creare una base karaoke in questo modo?',
          answer: 'Solo da musica che possiedi, che hai la licenza di usare o che puoi usare in base a un\'eccezione prevista dove vivi. Lo strumento non verifica i diritti; sei tu il responsabile del risultato e di come lo distribuisci.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'La rimozione della voce usa la quota IA; questa e i limiti di durata dipendono dal tuo piano e sono mostrati in tempo reale nel modulo.',
        ],
      },
      related: [
        {
          label: 'Estrai l\'audio da un video',
          to: '/tools/extract-audio-from-video',
          description: 'Estrai l\'audio da un video musicale prima di separarlo.',
        },
        {
          label: 'Pulisci l\'audio della voce',
          to: '/tools/clean-voice-audio',
          description: 'Per le registrazioni di parlato, usa invece il modello di speech enhancement.',
        },
        {
          label: 'Rimuovi il rumore di fondo',
          to: '/tools/remove-background-noise',
          description: 'Abbassa il rumore costante in una registrazione senza separarla.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Usa la base strumentale come tappeto musicale in un montaggio video.',
        },
        {
          label: 'Trascrivi video',
          to: '/tools/transcribe-video',
          description: 'Ottieni il testo della canzone dal mix originale.',
        },
      ],
      embed: {
        title: 'Rimuovi la voce da una canzone',
        description: 'Carica una canzone. Rimuovi la voce è già selezionato e la base strumentale torna nello stesso formato del tuo file (MP3 resta MP3); scegli FLAC o WAV sotto Formato di output per un file senza perdita. Premi converti.',
      },
    },

    // 2026-10-31 (MM92): name + tagline for every remaining tool, so the /tools catalog
    // and the home grid never show an English card in this locale. Model-written; native review pending.
    'transcode-to-dash': {
      name: 'Transcodifica video in DASH (AV1 / VP9)',
      h1: 'Transcodifica video in DASH AV1 o VP9 online',
      tagline: 'Crea da qualsiasi video un pacchetto MPEG-DASH con manifest.mpd e segmenti di inizializzazione e media per ogni rendition.',
      metaTitle: 'Transcodifica video in DASH AV1/VP9 online | Strumento MPEG-DASH gratuito',
      metaDescription: 'Transcoder MPEG-DASH online gratuito. Converti MP4, MOV, WebM e MKV in un pacchetto DASH con video AV1 o VP9, sottotitoli e storyboard opzionali.',
      ogTitle: 'Transcodifica video in DASH AV1/VP9 online',
      ogDescription: 'Genera un pacchetto DASH adattivo (manifest.mpd + segmenti init/media per ogni rendition) da qualsiasi video, gratis, nel tuo browser.',
      intro: 'MPEG-DASH è lo standard aperto di streaming adattivo supportato da ogni browser moderno. Media Manipulator transcodifica il tuo video sorgente in un pacchetto DASH VOD, manifest.mpd più init.mp4 e segmenti .m4s per ogni rendition, usando AV1 (file più piccoli, ideale per i nuovi lettori web) o VP9 (supporto di riproduzione più ampio). Metti la cartella scompattata su qualsiasi CDN o origin e servi manifest.mpd ai client. Il piano gratuito copre 360p, 480p e 720p.',
      whatItDoes: [
        'Analizza la sorgente con ffprobe e mostra risoluzione, FPS, durata, codec e presenza dell\'audio.',
        'Ti permette di scegliere quali livelli di qualità codificare e se produrre AV1 o VP9.',
        'Rileva automaticamente il miglior encoder AV1 disponibile (av1_nvenc → libsvtav1 → libaom-av1).',
        'Genera un manifest.mpd MPEG-DASH che fa riferimento a ogni Representation video più una Representation audio AAC quando presente.',
        'Facoltativamente genera sottotitoli WebVTT e miniature di storyboard per la barra di scorrimento.',
        'Confeziona il risultato in media-manipulator-dash-<codec>-<jobID>.tar.gz con un report.json e un README.',
        'Carica l\'archivio su S3 e ti restituisce un URL GET prefirmato di breve durata.',
      ],
      flowSteps: [
        {
          title: 'Carica',
          description: 'PUT prefirmata diretta su S3: il tuo file non passa mai dal server API.',
        },
        {
          title: 'Analizza',
          description: 'ffprobe legge risoluzione, FPS, presenza dell\'audio e metadati del codec.',
        },
        {
          title: 'Scegli livelli + codec',
          description: 'Scegli AV1 o VP9 e qualsiasi combinazione di 360p/480p/720p.',
        },
        {
          title: 'Codifica',
          description: 'AV1 (svtav1/libaom/nvenc) o libvpx-vp9 con segmenti da 2 secondi.',
        },
        {
          title: 'Confeziona',
          description: 'manifest.mpd + init/segmenti per ogni rendition in un tar.gz con report.json e README.',
        },
        {
          title: 'Scarica',
          description: 'URL GET S3 prefirmato valido per 30 minuti.',
        },
      ],
      advancedDetails: [
        'La selezione dell\'encoder AV1 preferisce av1_nvenc (GPU) quando disponibile, ricadendo su libsvtav1 e poi su libaom-av1.',
        'VP9 usa libvpx-vp9 con row-mt, decodifica frame-parallel e indicazione CRF + bitrate.',
        'Le varianti DASH vengono prodotte con -seg_duration 2 -use_template 1 -use_timeline 0 -single_file 0.',
        'manifest.mpd dichiara un AdaptationSet per tipo di contenuto (video + audio quando presente) con attributi codecs "av01.0.08M.08" / "vp09.00.51.08" / "mp4a.40.2".',
        'Nessun ingrandimento: i livelli più alti della risoluzione sorgente vengono disabilitati con un tooltip.',
      ],
      whyItMatters: [
        'AV1 di norma dimezza il bitrate a qualità equivalente rispetto a H.264.',
        'DASH è il formato di streaming adattivo dominante fuori dall\'ecosistema Apple.',
        'Un VOD già confezionato evita i costi di transcodifica per richiesta sulle piattaforme di streaming.',
      ],
      useCases: [
        {
          title: 'Lettori web moderni',
          description: 'Shaka Player e dash.js leggono manifest.mpd nativamente.',
        },
        {
          title: 'Distribuzione attenta alla banda',
          description: 'AV1 dà quasi la metà dei byte di un pacchetto HLS H.264.',
        },
        {
          title: 'Libreria multimediale interna',
          description: 'Ospita in autonomia video adattivo senza pagare una piattaforma di streaming SaaS.',
        },
        {
          title: 'Test di qualità',
          description: 'Confronta codifiche AV1 e VP9 fianco a fianco dalla stessa sorgente.',
        },
      ],
      whyMediaManipulator: [
        'Gira sui nostri server: nessun fornitore di transcodifica di terze parti vede il tuo video.',
        'AV1 selezionato per impostazione predefinita, perché AV1 è il futuro dello streaming adattivo di alta qualità.',
        'Formato di pacchetto aperto: basta scompattare il .tar.gz e ospitare il manifest.mpd.',
      ],
      privacyNote: 'Il tuo video viene letto una volta da FFmpeg, codificato in rendition AV1 o VP9 e diviso in segmenti DASH con un manifest, tutto sui nostri server. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Il tuo file sorgente resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'AV1 o VP9: quale dovrei scegliere?',
          answer: 'AV1 produce file più piccoli a qualità equivalente, ma la codifica è più lenta sugli host con sola CPU. VP9 ha un supporto di riproduzione più ampio e una codifica più veloce. AV1 è il predefinito.',
        },
        {
          question: 'Il mio server dice che AV1 non è disponibile?',
          answer: 'AV1 richiede uno tra av1_nvenc (GPU NVIDIA), libsvtav1 o libaom-av1 in FFmpeg. Controlla /api/video-transcode/capabilities per vedere cosa ha la tua installazione.',
        },
        {
          question: 'L\'audio è sempre AAC?',
          answer: 'Sì: l\'AdaptationSet audio DASH attualmente produce AAC LC a 128 kbps per la massima compatibilità, indipendentemente dal codec sorgente.',
        },
        {
          question: 'Posso servire questo manifest cross-origin?',
          answer: 'Sì, ma la tua CDN o origin ha bisogno delle intestazioni CORS corrette sui file .mpd, init.mp4 e .m4s. L\'archivio non include quelle intestazioni.',
        },
        {
          question: 'Quanto dura l\'URL di download?',
          answer: 'Gli URL GET prefirmati sono validi per 30 minuti per impostazione predefinita. Esegui di nuovo la transcodifica se ti serve un link nuovo.',
        },
      ],
      related: [
        {
          label: 'Transcodifica video in HLS',
          to: '/tools/transcode-to-hls',
          description: 'Stesso caricamento, ma produce un pacchetto Apple HLS con H.264 + AAC.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci un MP4 con la normale pipeline FFmpeg.',
        },
        {
          label: 'Trascrivi video',
          to: '/tools/transcribe-video',
          description: 'Estrai il parlato da un video in testo ricercabile.',
        },
      ],
      embed: {
        title: 'Transcodifica un video in DASH (AV1 / VP9)',
        description: 'Carica un MP4/MOV/WebM/MKV. Analizziamo la sorgente con ffprobe, ti lasciamo scegliere i livelli di qualità gratuiti (360p/480p/720p), poi eseguiamo una codifica ffmpeg AV1 (predefinita) o VP9 e confezioniamo un tar.gz scaricabile con manifest.mpd.',
      },
    },
    'convert-webp-to-jpg': {
      name: 'Converti WebP in JPG',
      h1: 'Converti WebP in JPG online',
      tagline: 'Trasforma le immagini WebP in file JPG ampiamente compatibili, che si aprono in qualsiasi visualizzatore o editor di immagini.',
      metaTitle: 'Converti WebP in JPG online (gratis) | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da WebP a JPG. Trasforma in pochi secondi le immagini .webp in file JPG compatibili con tutto, alla qualità che scegli tu.',
      ogTitle: 'Converti WebP in JPG online',
      ogDescription: 'Trasforma le immagini WebP in file JPG compatibili con tutto, in un paio di clic.',
      intro: 'WebP è ottimo per il web, ma software datati, programmi per presentazioni e stampanti spesso non riescono a leggerlo. Media Manipulator riconverte il WebP in JPG, così puoi usare l\'immagine ovunque. Scegli la qualità che vuoi e al resto pensiamo noi.',
      whatItDoes: [
        'Converte qualsiasi immagine .webp (fissa o un fotogramma di un\'animazione) in un .jpg standard.',
        'Ti lascia scegliere la qualità del JPG: qualità più alta = file più grande.',
        'Appiattisce la trasparenza su un colore di sfondo a tua scelta (il JPG non ha canale alfa).',
        'Conserva il profilo colore quando è possibile.',
      ],
      flowSteps: [
        {
          title: 'Carica il WebP',
          description: 'Trascina un file .webp dal tuo computer.',
        },
        {
          title: 'Scegli la qualità JPG',
          description: '85 è un buon valore predefinito; abbassalo per file più piccoli.',
        },
        {
          title: 'Codifica JPG',
          description: 'ImageMagick ricodifica l\'immagine alla qualità scelta.',
        },
        {
          title: 'Scarica il JPG',
          description: 'Salva un file .jpg compatibile con tutto.',
        },
      ],
      advancedDetails: [
        'La qualità 85 è da sempre il punto di equilibrio: sopra ~92 il file cresce quasi soltanto di dimensione, con un miglioramento visivo minimo.',
        'Il JPG non ha trasparenza, quindi i WebP trasparenti vengono appiattiti. Se ti serve la trasparenza, converti in PNG.',
        'Per una conversione senza perdita o per i WebP animati, preferisci il PNG (immagini fisse) o la GIF animata.',
      ],
      whyItMatters: [
        'Alcuni browser datati, editor di immagini e software integrati non supportano ancora il WebP.',
        'Molte stampanti, chioschi fotografici e programmi per presentazioni richiedono JPG o PNG.',
        'Il JPG è di fatto il formato di scambio standard per le foto.',
      ],
      useCases: [
        {
          title: 'Invio di foto ai clienti',
          description: 'Assicurati che il destinatario possa aprire il file su qualsiasi dispositivo.',
        },
        {
          title: 'Inserimento nelle presentazioni',
          description: 'Le diapositive di PowerPoint e Keynote accettano il JPG ovunque; con il WebP va a fortuna.',
        },
        {
          title: 'Stampa e laboratori fotografici',
          description: 'La maggior parte dei laboratori accetta solo JPG.',
        },
        {
          title: 'Invio a siti di foto stock',
          description: 'Molti siti di foto stock richiedono caricamenti in JPG.',
        },
      ],
      whyMediaManipulator: [
        'Nessuna filigrana, nessuna registrazione, gratuito per l\'uso occasionale.',
        'Regoli qualità e compressione con precisione, invece di un preset uguale per tutti.',
        'Stesso modello di privacy e di conservazione del resto degli strumenti.',
      ],
      privacyNote: 'Il tuo WebP viene decodificato e ricodificato come JPG sul nostro server; le aree trasparenti vengono appiattite perché il JPG non può conservarle. Nulla viene inviato a un servizio esterno. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. L\'originale non viene mai modificato: scarichi un nuovo file.',
      faq: [
        {
          question: 'E la trasparenza?',
          answer: 'Il JPG non supporta la trasparenza. I WebP trasparenti vengono appiattiti sul colore di sfondo scelto. Se ti serve la trasparenza, converti in PNG.',
        },
        {
          question: 'Quale qualità dovrei usare?',
          answer: '85 è un valore predefinito equilibrato. Usa 90 o più per le foto in cui la qualità conta di più, 70 per miniature o anteprime.',
        },
        {
          question: 'Funziona con i WebP animati?',
          answer: 'Solo il primo fotogramma diventa un JPG. Per un WebP animato, converti invece in GIF animata.',
        },
        {
          question: 'Posso convertire più file in blocco?',
          answer: 'Lo strumento gratuito elabora un file alla volta. Per ora converti ogni WebP singolarmente.',
        },
      ],
      related: [
        {
          label: 'Converti WebP in PNG',
          to: '/tools/convert-webp-to-png',
          description: 'Mantieni la trasparenza con un PNG senza perdita.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra JPG, PNG, WebP, AVIF e GIF.',
        },
        {
          label: 'Comprimi immagine',
          to: '/tools/compress-image',
          description: 'Riduci ancora di più il peso del JPG.',
        },
        {
          label: 'Rimuovi i metadati EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimina i metadati privati prima di condividere il JPG.',
        },
        {
          label: 'Tutorial del convertitore di immagini',
          to: '/tutorials/image/getting-started',
          description: 'Guida passo dopo passo a ogni opzione per le immagini.',
        },
      ],
      embed: {
        title: 'Converti WebP in JPG',
        description: 'Carica un\'immagine WebP e scegli JPG come formato di uscita. Regola il cursore della qualità per bilanciare peso del file e qualità dell\'immagine. Il JPG elimina la trasparenza, quindi usa il PNG se la tua immagine ha uno sfondo trasparente.',
      },
    },
    'convert-png-to-jpg': {
      name: 'Converti PNG in JPG',
      h1: 'Converti PNG in JPG online gratis',
      tagline: 'Trasforma in pochi secondi screenshot e grafiche PNG pesanti in foto JPG leggere e compatibili con tutto.',
      metaTitle: 'Converti PNG in JPG online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da PNG a JPG. Trasforma i file .png in immagini JPG più leggere e compatibili con tutto, alla qualità che scegli tu. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti PNG in JPG online gratis',
      ogDescription: 'Trasforma le immagini PNG in file JPG più leggeri e compatibili con tutto. Gratis, veloce, senza registrazione.',
      intro: 'Il PNG è un formato senza perdita, perfetto per screenshot e grafiche ma spesso molto più pesante del necessario per le foto. Convertire un PNG in JPG può ridurre il file di 5–10× senza differenze visibili per i contenuti fotografici. Media Manipulator converte il tuo PNG in un JPG pulito alla qualità che scegli: gratis, online e senza registrazione.',
      whatItDoes: [
        'Converte qualsiasi immagine .png in un file .jpg (JPEG) standard.',
        'Ti lascia scegliere la qualità del JPG, così bilanci il peso del file e la fedeltà.',
        'Appiattisce la trasparenza su uno sfondo a tinta unita, perché il JPG non ha canale alfa.',
        'I pixel che vedi restano gli stessi; solo il file viene ricodificato da PNG a JPG.',
      ],
      flowSteps: [
        {
          title: 'Carica il PNG',
          description: 'Trascina uno screenshot, una grafica o una foto .png.',
        },
        {
          title: 'Scegli la qualità JPG',
          description: '85 è un valore predefinito equilibrato; abbassalo per file più piccoli.',
        },
        {
          title: 'Codifica JPG',
          description: 'ImageMagick ricodifica la tua immagine come JPEG.',
        },
        {
          title: 'Scarica il JPG',
          description: 'Salva un file .jpg più leggero e compatibile con tutto.',
        },
      ],
      advancedDetails: [
        'La qualità 85 è da sempre il punto ideale: sopra ~92 aggiungi quasi soltanto peso al file, con un guadagno visibile minimo.',
        'Un PNG fotografico passa spesso da diversi megabyte a poche centinaia di kilobyte come JPG.',
        'Per grafiche con bordi netti o testo, PNG o WebP di solito risultano più puliti del JPG a parità di dimensione.',
        'Se il tuo PNG ha una trasparenza che vuoi mantenere, converti in WebP: il JPG non può conservare un canale alfa.',
      ],
      whyItMatters: [
        'Il JPG è il formato fotografico accettato più universalmente: ogni dispositivo, editor e modulo di caricamento lo accetta.',
        'I JPG più leggeri si caricano più in fretta sul web e restano entro i limiti di email e moduli di caricamento.',
        'Molti laboratori di stampa, marketplace e siti di foto stock accettano solo JPG.',
      ],
      useCases: [
        {
          title: 'Alleggerire gli screenshot',
          description: 'Trasforma uno screenshot PNG pesante in un JPG leggero per email o chat.',
        },
        {
          title: 'Caricare foto',
          description: 'Converti un PNG fotografico in JPG per rispettare il formato richiesto da un sito.',
        },
        {
          title: 'Stampa e laboratori fotografici',
          description: 'La maggior parte dei laboratori richiede il JPG: converti prima di ordinare.',
        },
        {
          title: 'Pagine web più veloci',
          description: 'Sostituisci le foto PNG pesanti con JPG compatti per ridurre il peso della pagina.',
        },
      ],
      whyMediaManipulator: [
        'L\'uscita è davvero bloccata su JPG, quindi non c\'è nulla da configurare male.',
        'Controllo preciso della qualità invece di un preset uguale per tutti.',
      ],
      privacyNote: 'Il tuo PNG viene ricodificato come JPG alla qualità che imposti, sul nostro server, e l\'eventuale trasparenza viene appiattita su uno sfondo a tinta unita. Nulla viene inviato a un servizio esterno. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. L\'originale non viene mai modificato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Come converto un PNG in JPG gratis?',
          answer: 'Carica il tuo .png qui sopra, scegli una qualità JPG e clicca su converti. Il download è un file .jpg standard.',
        },
        {
          question: 'Convertire da PNG a JPG riduce la qualità?',
          answer: 'Il JPG è un formato con perdita, quindi c\'è un piccolo compromesso sulla qualità. A qualità 85–90 la differenza è invisibile per le foto. Per grafiche con testo nitido, resta sul PNG o usa il WebP.',
        },
        {
          question: 'Cosa succede alla trasparenza quando converto da PNG a JPG?',
          answer: 'Il JPG non supporta la trasparenza, quindi le aree trasparenti vengono appiattite su uno sfondo a tinta unita. Se devi mantenere la trasparenza, converti il PNG in WebP.',
        },
        {
          question: 'Perché il mio PNG è tanto più grande del JPG?',
          answer: 'Il PNG è senza perdita e memorizza ogni pixel esattamente, il che per le foto significa file grandi. Il JPG usa una compressione percettiva, quindi le immagini fotografiche si riducono drasticamente con cambiamenti visibili minimi.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Le aree trasparenti del PNG vengono appiattite su uno sfondo a tinta unita perché il JPG non ha trasparenza.',
        ],
      },
      related: [
        {
          label: 'Converti JPG in PNG',
          to: '/tools/convert-jpg-to-png',
          description: 'Fai il percorso inverso e ottieni un PNG che supporta la trasparenza.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra JPG, PNG, WebP, AVIF e altro ancora.',
        },
        {
          label: 'Comprimi immagine',
          to: '/tools/compress-image',
          description: 'Riduci ancora il JPG senza cambiare formato.',
        },
        {
          label: 'Tutorial del convertitore di immagini',
          to: '/tutorials/image/getting-started',
          description: 'Esplora in dettaglio ogni opzione per le immagini.',
        },
      ],
      embed: {
        title: 'Converti PNG in JPG',
        description: 'Carica un\'immagine PNG. In questo strumento l\'uscita è bloccata su JPG: scegli una qualità e converti. Le aree trasparenti vengono appiattite su uno sfondo a tinta unita perché il JPG non ha canale alfa.',
      },
    },
    'convert-jpg-to-png': {
      name: 'Converti JPG in PNG',
      h1: 'Converti JPG in PNG online gratis',
      tagline: 'Trasforma le foto JPG in file PNG senza perdita, pronti per la modifica, la trasparenza e la grafica di alta qualità.',
      metaTitle: 'Converti JPG in PNG online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da JPG a PNG. Trasforma le foto .jpg in file PNG senza perdita per modifica, trasparenza e grafica. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti JPG in PNG online gratis',
      ogDescription: 'Trasforma le foto JPG in file PNG senza perdita per modifica e grafica. Gratis, veloce, senza registrazione.',
      intro: 'Il PNG è un formato senza perdita che non aggiunge mai artefatti di compressione, il che lo rende ideale quando inizi a modificare un\'immagine, aggiungere trasparenza o sovrapporre grafiche. Convertire un JPG in PNG fissa i pixel attuali, così le modifiche successive non degradano la qualità. Media Manipulator converte il tuo JPG in un PNG pulito, online, gratis e senza registrazione.',
      whatItDoes: [
        'Converte qualsiasi immagine .jpg/.jpeg in un file .png senza perdita.',
        'Conserva esattamente i pixel attuali, così le modifiche ripetute non aggiungono artefatti.',
        'Produce un PNG che in seguito puoi sovrapporre, mascherare o rendere trasparente in un editor.',
        'Ogni pixel del JPG viene mantenuto esattamente; il PNG lo memorizza senza ulteriori perdite.',
      ],
      flowSteps: [
        {
          title: 'Carica il JPG',
          description: 'Trascina una foto .jpg o .jpeg.',
        },
        {
          title: 'Converti in PNG',
          description: 'Ricodifichiamo l\'immagine senza perdita come PNG.',
        },
        {
          title: 'Codifica PNG',
          description: 'ImageMagick scrive un PNG standard a 24/32 bit.',
        },
        {
          title: 'Scarica il PNG',
          description: 'Salva un .png senza perdita pronto per la modifica.',
        },
      ],
      advancedDetails: [
        'Il PNG è senza perdita, quindi il file convertito sarà di solito più grande del JPG di partenza: è normale.',
        'Convertire da JPG a PNG non recupera i dettagli che il JPG ha già scartato; congela i pixel attuali senza perdita.',
        'Il PNG supporta un canale alfa, quindi il risultato è pronto per aggiungere la trasparenza in un editor.',
        'Per i file web senza perdita più piccoli, il WebP (senza perdita) è spesso più leggero del PNG.',
      ],
      whyItMatters: [
        'Il PNG senza perdita è il formato di lavoro giusto quando un\'immagine verrà modificata più volte.',
        'Strumenti di design, risorse per app e lavoro sulle interfacce richiedono il PNG per bordi nitidi e supporto della trasparenza.',
        'Il PNG evita la perdita generazionale che si verifica quando risalvi un JPG più e più volte.',
      ],
      useCases: [
        {
          title: 'Preparazione alla modifica',
          description: 'Converti un JPG in PNG prima del ritocco, così le modifiche restano senza perdita.',
        },
        {
          title: 'Aggiunta di trasparenza',
          description: 'Ottieni una tela PNG pronta per scontornare uno sfondo.',
        },
        {
          title: 'Risorse per interfacce e app',
          description: 'La maggior parte dei design system richiede il PNG per icone e grafiche.',
        },
        {
          title: 'Inserimento nei documenti',
          description: 'Usa il PNG quando testo e linee nitidi contano più del peso del file.',
        },
      ],
      whyMediaManipulator: [
        'L\'uscita è davvero bloccata su PNG, quindi il risultato è sempre senza perdita.',
        'Gira sui nostri server: nessuna elaborazione della tua immagine da parte di terzi.',
      ],
      privacyNote: 'Il tuo JPG viene decodificato sul nostro server e scritto come PNG senza perdita con esattamente gli stessi pixel. Nulla viene inviato a un servizio esterno. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. L\'originale non viene mai modificato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Come converto un JPG in PNG gratis?',
          answer: 'Carica il tuo .jpg qui sopra e clicca su converti: l\'uscita è un .png senza perdita. È gratis, non richiede registrazione e funziona nel tuo browser.',
        },
        {
          question: 'Convertire da JPG a PNG migliora la qualità?',
          answer: 'No. La conversione è senza perdita, ma non può recuperare i dettagli che il JPG ha già scartato. Congela i pixel attuali, così le modifiche future restano senza artefatti.',
        },
        {
          question: 'Il PNG sarà più grande del mio JPG?',
          answer: 'Di solito sì. Il PNG memorizza ogni pixel esattamente, senza compressione con perdita, quindi un PNG fotografico è in genere più grande del JPG equivalente.',
        },
        {
          question: 'Posso aggiungere la trasparenza dopo la conversione in PNG?',
          answer: 'Sì. Il PNG supporta un canale alfa, quindi una volta ottenuto il PNG puoi cancellare o scontornare uno sfondo in qualsiasi editor di immagini.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Il PNG è senza perdita, quindi l\'uscita è di solito più grande del JPG di partenza.',
        ],
      },
      related: [
        {
          label: 'Converti PNG in JPG',
          to: '/tools/convert-png-to-jpg',
          description: 'Fai il percorso inverso e riduci un PNG in un JPG.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra JPG, PNG, WebP, AVIF e altro ancora.',
        },
        {
          label: 'Rimuovi lo sfondo da un\'immagine',
          to: '/tools/remove-background-from-image',
          description: 'Crea automaticamente un ritaglio PNG trasparente.',
        },
        {
          label: 'Tutorial del convertitore di immagini',
          to: '/tutorials/image/getting-started',
          description: 'Esplora in dettaglio ogni opzione per le immagini.',
        },
      ],
      embed: {
        title: 'Converti JPG in PNG',
        description: 'Carica un\'immagine JPG. In questo strumento l\'uscita è bloccata su PNG, così ottieni un file senza perdita pronto per la modifica o per la sovrapposizione su una tela trasparente.',
      },
    },
    'convert-webp-to-png': {
      name: 'Converti WebP in PNG',
      h1: 'Converti WebP in PNG online gratis',
      tagline: 'Trasforma le immagini WebP in file PNG senza perdita che si aprono ovunque e mantengono tutta la trasparenza.',
      metaTitle: 'Converti WebP in PNG online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da WebP a PNG. Trasforma le immagini .webp in file PNG senza perdita che mantengono la trasparenza e si aprono in qualsiasi editor. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti WebP in PNG online gratis',
      ogDescription: 'Trasforma le immagini WebP in file PNG senza perdita che conservano la trasparenza. Gratis, veloce, senza registrazione.',
      intro: 'Il WebP è ottimo per il web, ma molti editor, software datati e strumenti di design richiedono ancora il PNG, e a differenza del JPG il PNG mantiene tutta la trasparenza. Media Manipulator converte il tuo WebP in un PNG pulito e senza perdita, così si apre ovunque e il canale alfa sopravvive.',
      whatItDoes: [
        'Converte qualsiasi immagine .webp in un file .png senza perdita.',
        'Conserva il canale alfa, così i WebP trasparenti restano trasparenti.',
        'Produce un PNG che si apre in qualsiasi editor, visualizzatore o strumento di design.',
        'L\'immagine non cambia; la compressione WebP viene sostituita dalla memorizzazione PNG senza perdita.',
      ],
      flowSteps: [
        {
          title: 'Carica il WebP',
          description: 'Trascina un file .webp, trasparente o a tinta piena.',
        },
        {
          title: 'Converti in PNG',
          description: 'Decodifichiamo il WebP e lo ricodifichiamo come PNG.',
        },
        {
          title: 'Codifica PNG',
          description: 'ImageMagick scrive un PNG senza perdita a 24/32 bit.',
        },
        {
          title: 'Scarica il PNG',
          description: 'Salva un file .png che conserva la trasparenza.',
        },
      ],
      advancedDetails: [
        'La trasparenza del WebP di partenza viene conservata come canale alfa del PNG.',
        'Solo il primo fotogramma di un WebP animato diventa un PNG fisso: per l\'animazione, converti in GIF.',
        'Il PNG è senza perdita, quindi l\'uscita è di solito più grande del WebP di partenza; è il prezzo della compatibilità universale e della memorizzazione senza perdita.',
      ],
      whyItMatters: [
        'Alcuni editor, programmi per presentazioni e software datati non riescono ancora ad aprire il WebP.',
        'Il PNG mantiene la trasparenza, cosa che il JPG non può fare: importante per loghi e ritagli.',
        'Il PNG è un formato di interscambio sicuro e senza perdita per il lavoro grafico.',
      ],
      useCases: [
        {
          title: 'Aprire WebP negli editor',
          description: 'Converti in PNG così un editor privo di supporto WebP può aprirlo.',
        },
        {
          title: 'Mantenere la trasparenza',
          description: 'Conserva un logo WebP trasparente come PNG trasparente.',
        },
        {
          title: 'Consegne di design',
          description: 'Passa un PNG a strumenti o colleghi che richiedono risorse PNG.',
        },
        {
          title: 'Presentazioni',
          description: 'Inserisci un PNG in un software per diapositive che non accetta il WebP.',
        },
      ],
      whyMediaManipulator: [
        'L\'uscita è bloccata su PNG con la trasparenza conservata automaticamente.',
        'Gira sui nostri server: nessuna elaborazione della tua immagine da parte di terzi.',
      ],
      privacyNote: 'Il tuo WebP viene decodificato sul nostro server e salvato come PNG senza perdita, mantenendo la trasparenza. Nulla viene inviato a un servizio esterno. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. L\'originale non viene mai modificato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Come converto un WebP in PNG gratis?',
          answer: 'Carica il tuo .webp qui sopra e clicca su converti. Il download è un .png senza perdita con la trasparenza conservata. È gratis e non richiede registrazione.',
        },
        {
          question: 'La conversione da WebP a PNG mantiene la trasparenza?',
          answer: 'Sì. Se il tuo WebP ha uno sfondo trasparente, il PNG risultante mantiene intatto quel canale alfa.',
        },
        {
          question: 'Perché convertire il WebP in PNG invece che in JPG?',
          answer: 'Il PNG è senza perdita e conserva la trasparenza, mentre il JPG appiattisce la trasparenza e aggiunge compressione. Scegli il PNG quando ti servono trasparenza o grafiche senza perdita; scegli il JPG per i file fotografici più piccoli.',
        },
        {
          question: 'Posso convertire un WebP animato?',
          answer: 'Solo il primo fotogramma diventa un PNG. Per l\'animazione, converti il WebP in GIF animata.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'La trasparenza viene conservata. Di un WebP animato viene convertito solo il primo fotogramma.',
        ],
      },
      related: [
        {
          label: 'Converti PNG in WebP',
          to: '/tools/convert-png-to-webp',
          description: 'Fai il percorso inverso e riduci un PNG in un WebP.',
        },
        {
          label: 'Converti WebP in JPG',
          to: '/tools/convert-webp-to-jpg',
          description: 'Converti il WebP in un JPG compatto.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra JPG, PNG, WebP, AVIF e altro ancora.',
        },
        {
          label: 'Comprimi immagine',
          to: '/tools/compress-image',
          description: 'Riduci un\'immagine senza il fastidio di cambiare formato.',
        },
      ],
      embed: {
        title: 'Converti WebP in PNG',
        description: 'Carica un\'immagine WebP. In questo strumento l\'uscita è bloccata su PNG, così la trasparenza viene conservata e il file si apre in qualsiasi editor o visualizzatore di immagini.',
      },
    },
    'convert-png-to-webp': {
      name: 'Converti PNG in WebP',
      h1: 'Converti PNG in WebP online gratis',
      tagline: 'Riduci le grafiche PNG in file WebP moderni che si caricano più velocemente sul web e mantengono tutta la trasparenza.',
      metaTitle: 'Converti PNG in WebP online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da PNG a WebP. Riduci i file .png in immagini WebP più leggere per siti più veloci, mantenendo la trasparenza. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti PNG in WebP online gratis',
      ogDescription: 'Riduci le grafiche PNG in file WebP più leggeri che conservano la trasparenza, per siti più veloci. Gratis, senza registrazione.',
      intro: 'Il WebP è il formato immagine moderno del web: produce file drasticamente più piccoli del PNG conservando la trasparenza, il che significa pagine più veloci e Core Web Vitals migliori. Media Manipulator converte il tuo PNG in WebP alla qualità che scegli: gratis, online, con la trasparenza intatta e senza bisogno di registrazione.',
      whatItDoes: [
        'Converte qualsiasi immagine .png in un moderno file .webp.',
        'Conserva il canale alfa, così i PNG trasparenti restano trasparenti.',
        'Ti lascia scegliere la qualità per bilanciare peso del file e fedeltà.',
        'In genere produce file più piccoli del 25–80% rispetto al PNG di partenza.',
      ],
      flowSteps: [
        {
          title: 'Carica il PNG',
          description: 'Trascina una grafica, un\'icona o uno screenshot .png.',
        },
        {
          title: 'Scegli la qualità WebP',
          description: '80–85 è un ottimo valore predefinito per l\'uso web.',
        },
        {
          title: 'Codifica WebP',
          description: 'ImageMagick ricodifica la tua immagine come WebP.',
        },
        {
          title: 'Scarica il WebP',
          description: 'Salva un file .webp più leggero che conserva la trasparenza.',
        },
      ],
      advancedDetails: [
        'Il WebP supporta sia la modalità con perdita sia quella senza perdita; a qualità ~80 di solito batte di gran lunga il PNG come peso del file, restando visivamente pulito.',
        'La trasparenza viene conservata, così loghi e risorse per interfacce mantengono il canale alfa.',
        'Il WebP è supportato da ogni browser moderno: servilo direttamente per pagine che si caricano più in fretta.',
        'Per la massima compatibilità con software molto datati, conserva un PNG di riserva.',
      ],
      whyItMatters: [
        'Immagini più leggere sono la leva più importante in assoluto per pagine più veloci e un SEO migliore.',
        'Il WebP mantiene la trasparenza, quindi non devi sacrificare il canale alfa in cambio del peso, come faresti con il JPG.',
        'I Core Web Vitals di Google premiano le pagine più leggere: il WebP aiuta direttamente.',
      ],
      useCases: [
        {
          title: 'Siti web più veloci',
          description: 'Sostituisci le risorse PNG pesanti con WebP per ridurre il peso della pagina.',
        },
        {
          title: 'Loghi trasparenti',
          description: 'Riduci un logo PNG trasparente mantenendo il canale alfa.',
        },
        {
          title: 'Risorse per app e interfacce',
          description: 'Distribuisci grafiche più leggere senza perdere nitidezza.',
        },
        {
          title: 'Gallerie piene di immagini',
          description: 'Converti una serie di PNG in WebP per una galleria più scattante.',
        },
      ],
      whyMediaManipulator: [
        'L\'uscita è bloccata su WebP con la trasparenza conservata.',
        'Controllo preciso della qualità, così decidi tu il compromesso tra peso e fedeltà.',
      ],
      privacyNote: 'Il tuo PNG viene ricodificato come WebP sul nostro server alla qualità che scegli, mantenendo la trasparenza. Nulla viene inviato a un servizio esterno. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. L\'originale non viene mai modificato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Come converto un PNG in WebP gratis?',
          answer: 'Carica il tuo .png qui sopra, scegli una qualità e clicca su converti. Il download è un file .webp. È gratis e non richiede registrazione.',
        },
        {
          question: 'La conversione da PNG a WebP mantiene la trasparenza?',
          answer: 'Sì. Il WebP supporta un canale alfa, quindi i PNG trasparenti restano trasparenti dopo la conversione.',
        },
        {
          question: 'Quanto sarà più piccolo il WebP?',
          answer: 'Dipende dall\'immagine, ma il WebP è comunemente più piccolo del 25–80% rispetto al PNG di partenza, a una qualità visivamente simile.',
        },
        {
          question: 'Il WebP è supportato ovunque?',
          answer: 'Ogni browser moderno supporta il WebP. Alcuni programmi datati o di nicchia no: conserva un PNG di riserva se devi supportarli.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'La trasparenza viene conservata nel WebP in uscita.',
        ],
      },
      related: [
        {
          label: 'Converti WebP in PNG',
          to: '/tools/convert-webp-to-png',
          description: 'Fai il percorso inverso e torna a un PNG senza perdita.',
        },
        {
          label: 'Converti JPG in WebP',
          to: '/tools/convert-jpg-to-webp',
          description: 'Riduci le foto JPG in WebP per il web.',
        },
        {
          label: 'Comprimi immagine',
          to: '/tools/compress-image',
          description: 'Riduci ancora le immagini senza cambiare formato.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra JPG, PNG, WebP, AVIF e GIF.',
        },
        {
          label: 'Tutorial del convertitore di immagini',
          to: '/tutorials/image/getting-started',
          description: 'Esplora in dettaglio ogni opzione per le immagini.',
        },
      ],
      embed: {
        title: 'Converti PNG in WebP',
        description: 'Carica un\'immagine PNG. In questo strumento l\'uscita è bloccata su WebP: scegli una qualità e converti. La trasparenza viene conservata e i file WebP sono in genere molto più piccoli dei PNG.',
      },
    },
    'convert-jpg-to-webp': {
      name: 'Converti JPG in WebP',
      h1: 'Converti JPG in WebP online gratis',
      tagline: 'Riduci le foto JPG in file WebP moderni che si caricano più velocemente sul web, a parità di qualità visiva.',
      metaTitle: 'Converti JPG in WebP online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da JPG a WebP. Riduci le foto .jpg in immagini WebP più leggere per siti più veloci, alla qualità che scegli tu. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti JPG in WebP online gratis',
      ogDescription: 'Riduci le foto JPG in file WebP più leggeri per siti più veloci, a parità di qualità visiva. Gratis, senza registrazione.',
      intro: 'Il WebP offre la stessa qualità visiva del JPG in un file nettamente più piccolo, ed è per questo che è diventato il formato immagine predefinito dei siti veloci. Media Manipulator converte il tuo JPG in WebP alla qualità che scegli, così le tue foto restano identiche ma si caricano più in fretta.',
      whatItDoes: [
        'Converte qualsiasi foto .jpg/.jpeg in un moderno file .webp.',
        'Ti lascia scegliere la qualità WebP per bilanciare peso del file e fedeltà.',
        'In genere produce file più piccoli del 25–35% rispetto al JPG di partenza, a parità di qualità.',
        'La foto resta identica; i suoi byte vengono ricodificati in WebP per rendere il file più piccolo.',
      ],
      flowSteps: [
        {
          title: 'Carica il JPG',
          description: 'Trascina una foto .jpg o .jpeg.',
        },
        {
          title: 'Scegli la qualità WebP',
          description: '80–85 corrisponde da vicino alla qualità tipica di un JPG.',
        },
        {
          title: 'Codifica WebP',
          description: 'ImageMagick ricodifica la tua foto come WebP.',
        },
        {
          title: 'Scarica il WebP',
          description: 'Salva un .webp più leggero pronto per il web.',
        },
      ],
      advancedDetails: [
        'A parità di qualità visiva, il WebP è comunemente più piccolo del 25–35% rispetto al JPG, grazie a una compressione più moderna.',
        'Evita di accumulare compressioni pesanti: ricodificare un JPG già con perdita a una qualità WebP molto bassa può sommare gli artefatti.',
        'Il WebP è supportato da ogni browser moderno: servilo direttamente per velocizzare il caricamento delle pagine.',
        'Per la massima compatibilità con software molto datati, conserva un JPG di riserva.',
      ],
      whyItMatters: [
        'Immagini più leggere migliorano direttamente tempo di caricamento, frequenza di rimbalzo e SEO.',
        'Il WebP ti dà una qualità simile al JPG in un file più piccolo, con una sola conversione.',
        'I Core Web Vitals premiano le immagini più piccole: il WebP è un risultato facile.',
      ],
      useCases: [
        {
          title: 'Siti web più veloci',
          description: 'Converti i JPG di hero e gallerie in WebP per ridurre il peso della pagina.',
        },
        {
          title: 'Cataloghi e-commerce',
          description: 'Riduci le foto dei prodotti così le schede si caricano all\'istante.',
        },
        {
          title: 'Blog e articoli',
          description: 'Servi immagini in linea più leggere senza perdita di qualità visibile.',
        },
        {
          title: 'Foto per le email',
          description: 'Ottieni file più piccoli che restano entro i limiti degli allegati.',
        },
      ],
      whyMediaManipulator: [
        'L\'uscita è bloccata su WebP, quindi non c\'è nulla da configurare male.',
        'Controllo preciso della qualità invece di un preset fisso.',
      ],
      privacyNote: 'Il tuo JPG viene ricodificato come WebP più leggero sul nostro server alla qualità che scegli. Nulla viene inviato a un servizio esterno. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. L\'originale non viene mai modificato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Come converto un JPG in WebP gratis?',
          answer: 'Carica il tuo .jpg qui sopra, scegli una qualità e clicca su converti. Il download è un file .webp. È gratis e non richiede registrazione.',
        },
        {
          question: 'Il WebP è meglio del JPG?',
          answer: 'Per il web, di solito sì: il WebP offre una qualità simile in un file più piccolo. Il JPG vince ancora per la compatibilità universale con software molto datati.',
        },
        {
          question: 'Quanto è più piccolo il WebP rispetto al JPG?',
          answer: 'A parità di qualità visiva, il WebP è comunemente più piccolo del 25–35% rispetto al JPG, anche se il risparmio esatto dipende dall\'immagine.',
        },
        {
          question: 'Convertire da JPG a WebP fa perdere qualità?',
          answer: 'Entrambi i formati sono con perdita. A qualità 80–85 il risultato appare identico al JPG. Evita di impostare una qualità WebP molto bassa per non sommare gli artefatti.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Il JPG non ha trasparenza, quindi il WebP in uscita è completamente opaco.',
        ],
      },
      related: [
        {
          label: 'Converti WebP in JPG',
          to: '/tools/convert-webp-to-jpg',
          description: 'Fai il percorso inverso e torna a un JPG universale.',
        },
        {
          label: 'Converti PNG in WebP',
          to: '/tools/convert-png-to-webp',
          description: 'Riduci le grafiche PNG in WebP per il web.',
        },
        {
          label: 'Comprimi immagine',
          to: '/tools/compress-image',
          description: 'Riduci ancora le immagini senza cambiare formato.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra JPG, PNG, WebP, AVIF e GIF.',
        },
        {
          label: 'Tutorial del convertitore di immagini',
          to: '/tutorials/image/getting-started',
          description: 'Esplora in dettaglio ogni opzione per le immagini.',
        },
      ],
      embed: {
        title: 'Converti JPG in WebP',
        description: 'Carica un\'immagine JPG. In questo strumento l\'uscita è bloccata su WebP: scegli una qualità e converti. Il WebP produce di solito un file più piccolo del JPG a parità di qualità visiva.',
      },
    },
    'jpg-converter': {
      name: 'Convertitore JPG',
      tagline: 'Converti le immagini in JPG: il convertitore di immagini con JPG già selezionato.',
    },
    'png-converter': {
      name: 'Convertitore PNG',
      tagline: 'Converti le immagini in PNG: il convertitore di immagini con PNG già selezionato.',
    },
    'convert-jpg-to-pdf': {
      name: 'Converti JPG in PDF',
      h1: 'Converti JPG in PDF online gratis',
      tagline: 'Trasforma foto e scansioni JPG in documenti PDF puliti, pronti da condividere, stampare o caricare.',
      metaTitle: 'Converti JPG in PDF online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da JPG a PDF. Trasforma foto e scansioni .jpg in documenti PDF puliti senza perdita di qualità. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti JPG in PDF online gratis',
      ogDescription: 'Trasforma foto e scansioni JPG in documenti PDF puliti. Senza perdita, gratis, senza registrazione.',
      intro: 'Il JPG è il formato in cui scattano il tuo telefono e la tua fotocamera, ma il PDF è quello che vogliono la maggior parte di moduli, domande e uffici. Media Manipulator incorpora il tuo JPG direttamente in un PDF senza ricompressione, così il documento è identico alla tua foto e resta leggero.',
      whatItDoes: [
        'Racchiude una foto JPG/JPEG in un documento PDF di una sola pagina.',
        'Incorpora i byte originali del JPG senza perdita: zero compressione aggiunta.',
        'Dimensiona la pagina sulla foto, così nulla viene tagliato o deformato.',
        'Produce un PDF standard che si apre e si stampa ovunque.',
      ],
      flowSteps: [
        {
          title: 'Carica il JPG',
          description: 'Trascina una foto o una scansione .jpg o .jpeg.',
        },
        {
          title: 'Lo incorporiamo',
          description: 'Il JPG viene posizionato su una pagina di dimensioni corrispondenti, senza compressione.',
        },
        {
          title: 'Genera il PDF',
          description: 'Viene assemblato un PDF standard di una sola pagina.',
        },
        {
          title: 'Scarica il PDF',
          description: 'Salva un .pdf pulito, pronto da condividere o caricare.',
        },
      ],
      advancedDetails: [
        'Il flusso JPG viene incorporato con il filtro PDF /DCTDecode, il che significa che la foto viene memorizzata così com\'è: nessun secondo giro di compressione con perdita.',
        'Poiché non c\'è ricodifica, un documento da JPG a PDF ha in genere circa la stessa dimensione della foto originale.',
        'La pagina viene dimensionata dall\'immagine a 96 DPI, quindi una tipica foto da telefono produce una pagina di dimensioni comode.',
      ],
      whyItMatters: [
        'Moduli, portali e domande richiedono spesso PDF, non JPG.',
        'Un PDF si stampa in modo prevedibile, dove un JPG grezzo potrebbe venire suddiviso o riscalato.',
        'L\'incorporamento senza perdita mantiene leggibile il testo di un documento scansionato.',
      ],
      useCases: [
        {
          title: 'Candidature di lavoro',
          description: 'Trasforma la foto di un modulo firmato in un PDF che un portale accetta.',
        },
        {
          title: 'Ricevute e spese',
          description: 'Converti le foto delle ricevute in PDF per le note spese.',
        },
        {
          title: 'Documenti scansionati',
          description: 'Racchiudi la scansione di una pagina fatta col telefono in un PDF ordinato.',
        },
        {
          title: 'Stampa',
          description: 'Ottieni una stampa prevedibile da un JPG.',
        },
      ],
      whyMediaManipulator: [
        'Davvero senza perdita: il JPG dentro il PDF è identico al tuo originale.',
        'L\'output è bloccato su PDF, quindi non c\'è nulla da configurare male.',
      ],
      privacyNote: 'Il tuo JPG viene posizionato, senza essere ricompresso, su una singola pagina PDF che il nostro server costruisce. Nulla viene inviato a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'originale non viene mai modificato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Come converto un JPG in PDF gratis?',
          answer: 'Carica il tuo .jpg qui sopra e fai clic su converti: l\'output è un PDF di una sola pagina. È gratis e non richiede registrazione.',
        },
        {
          question: 'Convertire un JPG in PDF riduce la qualità?',
          answer: 'No. Il JPG viene incorporato direttamente nel PDF senza ricompressione, quindi la qualità dell\'immagine è identica al tuo file originale.',
        },
        {
          question: 'Il PDF sarà molto più grande del mio JPG?',
          answer: 'No: poiché non c\'è ricodifica, il PDF ha più o meno la stessa dimensione del JPG di origine più un minuscolo involucro di documento.',
        },
        {
          question: 'Posso unire più JPG in un unico PDF?',
          answer: 'Questo strumento crea un PDF per immagine. Converti ogni JPG e unisci i PDF con uno strumento di unione se ti servono più pagine.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Il JPG viene incorporato senza perdita (nessuna ricompressione) in un PDF di una sola pagina.',
        ],
      },
      related: [
        {
          label: 'Converti PNG in PDF',
          to: '/tools/convert-png-to-pdf',
          description: 'Convertitore dedicato PNG → PDF.',
        },
        {
          label: 'Da immagine a PDF',
          to: '/tools/image-to-pdf',
          description: 'Converti qualsiasi formato di immagine in PDF.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra JPG, PNG, WebP, AVIF e altro.',
        },
        {
          label: 'Da PDF a JPG',
          to: '/tools/pdf-to-jpg',
          description: 'Nella direzione opposta: trasforma un PDF in JPG.',
        },
        {
          label: 'Convertitore PDF',
          to: '/tools/pdf-converter',
          description: 'Il centro completo per le conversioni PDF.',
        },
      ],
      embed: {
        title: 'Converti JPG in PDF',
        description: 'Carica un\'immagine JPG. L\'output è bloccato su PDF e il tuo JPG viene incorporato senza perdita: la foto dentro il PDF è identica bit per bit al tuo originale.',
      },
    },
    'convert-png-to-pdf': {
      name: 'Converti PNG in PDF',
      h1: 'Converti PNG in PDF online gratis',
      tagline: 'Trasforma screenshot, grafiche e scansioni PNG in documenti PDF puliti e nitidi.',
      metaTitle: 'Converti PNG in PDF online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da PNG a PDF. Trasforma screenshot e grafiche .png in documenti PDF nitidi e senza perdita. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti PNG in PDF online gratis',
      ogDescription: 'Trasforma screenshot e grafiche PNG in documenti PDF nitidi e senza perdita. Gratis, senza registrazione.',
      intro: 'Il PNG è il formato per screenshot, diagrammi e grafiche con testo nitido e bordi netti. Quando devi inviarne o stamparne uno come documento, il PDF è l\'involucro giusto. Media Manipulator incorpora il tuo PNG senza perdita in un PDF, così ogni bordo resta nitido.',
      whatItDoes: [
        'Racchiude un\'immagine PNG in un documento PDF di una sola pagina.',
        'Incorpora l\'immagine senza perdita, così testo e disegni al tratto restano nitidi.',
        'Appiattisce la trasparenza su bianco, dato che le pagine PDF sono opache.',
        'Produce un PDF standard che si apre e si stampa ovunque.',
      ],
      flowSteps: [
        {
          title: 'Carica il PNG',
          description: 'Trascina uno screenshot, un diagramma o una grafica .png.',
        },
        {
          title: 'Lo incorporiamo',
          description: 'Il PNG viene composto su una pagina bianca e incorporato senza perdita.',
        },
        {
          title: 'Genera il PDF',
          description: 'Viene assemblato un PDF standard di una sola pagina.',
        },
        {
          title: 'Scarica il PDF',
          description: 'Salva un .pdf nitido, pronto da condividere o stampare.',
        },
      ],
      advancedDetails: [
        'I PNG vengono decodificati e incorporati con compressione zlib (Flate) senza perdita, quindi testo e bordi netti vengono preservati esattamente: nessun artefatto JPEG.',
        'Le aree trasparenti diventano bianche perché le pagine PDF non hanno un canale alfa.',
        'La pagina viene dimensionata dall\'immagine a 96 DPI per una dimensione fisica predefinita sensata.',
      ],
      whyItMatters: [
        'Screenshot e diagrammi vengono spesso inviati come PDF in ticket e report.',
        'L\'incorporamento senza perdita mantiene leggibili testo piccolo e linee sottili.',
        'Il PDF si stampa in modo prevedibile, dove un PNG grezzo può riscalarsi in modo inatteso.',
      ],
      useCases: [
        {
          title: 'Segnalazioni di bug',
          description: 'Trasforma uno screenshot in un PDF da allegare a un ticket.',
        },
        {
          title: 'Diagrammi e grafici',
          description: 'Racchiudi una grafica esportata in un PDF facile da condividere.',
        },
        {
          title: 'Moduli scansionati',
          description: 'Converti una scansione PNG in un documento PDF ordinato.',
        },
        {
          title: 'Stampa',
          description: 'Ottieni stampe nitide e prevedibili da un PNG.',
        },
      ],
      whyMediaManipulator: [
        'L\'incorporamento senza perdita mantiene testo e bordi perfettamente nitidi.',
        'L\'output è bloccato su PDF, quindi non c\'è nulla da configurare male.',
      ],
      privacyNote: 'Il tuo PNG viene incorporato senza perdita in un PDF di una pagina sul nostro server, con la trasparenza appiattita su bianco. Nulla viene inviato a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'originale non viene mai modificato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Come converto un PNG in PDF gratis?',
          answer: 'Carica il tuo .png qui sopra e fai clic su converti: l\'output è un PDF di una sola pagina. È gratis e non richiede registrazione.',
        },
        {
          question: 'Da PNG a PDF il testo resta nitido?',
          answer: 'Sì. Il PNG viene incorporato senza perdita, quindi testo e disegni al tratto restano nitidi, senza artefatti in stile JPEG.',
        },
        {
          question: 'Cosa succede a un PNG trasparente?',
          answer: 'Le aree trasparenti vengono appiattite su uno sfondo bianco perché le pagine PDF sono opache. Il contenuto visibile resta invariato.',
        },
        {
          question: 'Posso unire più PNG in un unico PDF?',
          answer: 'Questo strumento crea un PDF per immagine. Converti ogni PNG e unisci i PDF con uno strumento di unione per i documenti multipagina.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Il PNG viene incorporato senza perdita. La trasparenza viene appiattita su bianco perché le pagine PDF sono opache.',
        ],
      },
      related: [
        {
          label: 'Converti JPG in PDF',
          to: '/tools/convert-jpg-to-pdf',
          description: 'Convertitore dedicato JPG → PDF.',
        },
        {
          label: 'Da immagine a PDF',
          to: '/tools/image-to-pdf',
          description: 'Converti qualsiasi formato di immagine in PDF.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra JPG, PNG, WebP, AVIF e altro.',
        },
        {
          label: 'Da PDF a PNG',
          to: '/tools/pdf-to-png',
          description: 'Nella direzione opposta: trasforma un PDF in PNG.',
        },
        {
          label: 'Convertitore PDF',
          to: '/tools/pdf-converter',
          description: 'Il centro completo per le conversioni PDF.',
        },
      ],
      embed: {
        title: 'Converti PNG in PDF',
        description: 'Carica un\'immagine PNG. L\'output è bloccato su PDF e il tuo PNG viene incorporato senza perdita, così testo e bordi netti restano nitidi sulla pagina.',
      },
    },
    'pdf-to-png': {
      name: 'Da PDF a PNG',
      h1: 'Converti PDF in PNG online gratis',
      tagline: 'Converti ogni pagina di un PDF in immagini PNG nitide e senza perdita, ideali per testi, diagrammi e modifiche.',
      metaTitle: 'Converti PDF in PNG online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da PDF a PNG. Trasforma ogni pagina di un PDF in immagini PNG nitide e senza perdita, scaricate in un file ZIP. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti PDF in PNG online gratis',
      ogDescription: 'Trasforma ogni pagina di un PDF in immagini PNG nitide e senza perdita. Gratis, veloce, senza registrazione.',
      intro: 'Il PNG è la scelta migliore quando una pagina PDF ha testo nitido, linee sottili o diagrammi che vuoi mantenere perfettamente definiti. Media Manipulator converte ogni pagina in un PNG senza perdita con Poppler, così non ci sono artefatti JPEG attorno al testo. Scegli tutte le pagine o solo la prima, e scegli la risoluzione.',
      whatItDoes: [
        'Converte ogni pagina del PDF in un\'immagine PNG senza perdita ai DPI che scegli.',
        'Converte tutte le pagine (scaricate come ZIP) o solo la prima (un singolo PNG).',
        'Nomina chiaramente l\'output multipagina: page-001.png, page-002.png e così via.',
        'Mantiene testo e disegni al tratto nitidi con la codifica PNG senza perdita.',
      ],
      flowSteps: [
        {
          title: 'Carica il PDF',
          description: 'Trascina qualsiasi documento .pdf.',
        },
        {
          title: 'Scegli pagine e DPI',
          description: 'Tutte le pagine o solo la prima; 150 DPI è un buon valore predefinito.',
        },
        {
          title: 'Converti in PNG',
          description: 'Poppler rasterizza ogni pagina in un PNG senza perdita.',
        },
        {
          title: 'Scarica',
          description: 'Ottieni un singolo PNG, oppure uno ZIP con un PNG per pagina.',
        },
      ],
      advancedDetails: [
        'Il rendering usa Poppler (pdftoppm) per un output delle pagine accurato e fedele.',
        'Il PNG è senza perdita, quindi è la scelta migliore rispetto al JPG quando la pagina è composta per lo più da testo, diagrammi o grafica netta.',
        'DPI più alti producono immagini più nitide e più grandi: 150 DPI va bene per gli schermi, 300 DPI per la stampa.',
        'I PNG renderizzati hanno uno sfondo bianco; le pagine PDF sono opache, quindi non c\'è trasparenza da preservare.',
      ],
      whyItMatters: [
        'Il PNG senza perdita mantiene leggibili testo piccolo e linee sottili, senza artefatti.',
        'Le pagine PNG si inseriscono senza problemi in editor, documenti e strumenti di design.',
        'Una pagina renderizzata cattura l\'esatto layout visivo del documento.',
      ],
      useCases: [
        {
          title: 'Diagrammi e schemi',
          description: 'Converti pagine tecniche senza artefatti.',
        },
        {
          title: 'Annotazioni e revisione',
          description: 'Apri una pagina nitida in un editor per annotarla.',
        },
        {
          title: 'Risorse di design',
          description: 'Porta la grafica pulita di una pagina in uno strumento di design.',
        },
        {
          title: 'Miniature',
          description: 'Genera un\'anteprima PNG nitida della prima pagina.',
        },
      ],
      whyMediaManipulator: [
        'Il rendering PNG senza perdita mantiene testo e bordi nitidi.',
        'Pacchetto ZIP chiaro e ordinato con nomi file numerati per pagina e ordinabili.',
      ],
      privacyNote: 'Le pagine del tuo PDF vengono convertite in immagini PNG con Poppler sul nostro server e, se sono più di una, raccolte in uno ZIP. Nulla viene inviato a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'originale non viene mai modificato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Come converto un PDF in PNG gratis?',
          answer: 'Carica il tuo .pdf qui sopra, scegli tutte le pagine o solo la prima, scegli i DPI e fai clic su converti.',
        },
        {
          question: 'Perché scegliere PNG invece di JPG per un PDF?',
          answer: 'Il PNG è senza perdita, quindi mantiene testo, linee sottili e diagrammi nitidi, senza artefatti di compressione. Il JPG è meglio quando vuoi file più piccoli per pagine ricche di foto.',
        },
        {
          question: 'Otterrò un\'immagine o molte?',
          answer: 'Scegli «tutte le pagine» per ottenere uno ZIP con un PNG per pagina (page-001.png, …), oppure «solo la prima pagina» per un singolo PNG.',
        },
        {
          question: 'I PNG hanno uno sfondo trasparente?',
          answer: 'No: le pagine PDF sono opache, quindi le pagine renderizzate hanno uno sfondo bianco. Non c\'è trasparenza da preservare.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'L\'output con tutte le pagine viene consegnato come .zip; l\'output della sola prima pagina è un singolo .png.',
          'Le pagine renderizzate hanno uno sfondo bianco: le pagine PDF sono opache, quindi non c\'è trasparenza.',
        ],
      },
      related: [
        {
          label: 'Da PDF a JPG',
          to: '/tools/pdf-to-jpg',
          description: 'Converti le pagine PDF in JPG più compatti.',
        },
        {
          label: 'Convertitore PDF',
          to: '/tools/pdf-converter',
          description: 'Converti i PDF in immagini e le immagini in PDF.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti le immagini renderizzate tra formati.',
        },
        {
          label: 'Da immagine a PDF',
          to: '/tools/image-to-pdf',
          description: 'Nella direzione opposta: trasforma le immagini in un PDF.',
        },
      ],
      embed: {
        title: 'Converti PDF in PNG',
        description: 'Carica un PDF. Ogni pagina viene convertita in un\'immagine PNG senza perdita. Scegli «tutte le pagine» per uno ZIP, oppure «solo la prima pagina» per un singolo PNG. Scegli i DPI di rendering per un output più nitido.',
      },
    },
    'pdf-converter': {
      name: 'Convertitore PDF',
      h1: 'Convertitore PDF online gratuito',
      tagline: 'Converti i PDF in immagini JPG o PNG e trasforma le immagini in PDF, tutto in un unico posto.',
      metaTitle: 'Convertitore PDF online gratuito | Media Manipulator',
      metaDescription: 'Convertitore PDF online gratuito. Converti i PDF in immagini JPG o PNG e trasforma le immagini in PDF. Senza registrazione né filigrane. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Convertitore PDF online gratuito',
      ogDescription: 'Converti i PDF in immagini JPG/PNG e le immagini in PDF: tutto in un unico strumento gratuito. Senza registrazione.',
      intro: 'Il convertitore PDF gestisce entrambe le direzioni in un unico posto: converte le pagine di un PDF in immagini JPG o PNG, oppure racchiude un\'immagine in un documento PDF. Carica un PDF e ottieni i controlli per l\'esportazione in immagini; carica un\'immagine e ottieni la conversione da immagine a PDF. Tutto gira sui nostri server.',
      whatItDoes: [
        'Converte le pagine PDF in JPG o PNG alla risoluzione che scegli.',
        'Converte JPG, PNG e altre immagini in PDF di una sola pagina.',
        'Impacchetta le esportazioni di PDF multipagina in uno ZIP ordinato di immagini numerate.',
        'Adatta automaticamente il modulo al file che carichi.',
      ],
      flowSteps: [
        {
          title: 'Carica un file',
          description: 'Trascina un PDF, oppure un\'immagine come JPG o PNG.',
        },
        {
          title: 'Scegli l\'output',
          description: 'Per un PDF, scegli JPG/PNG, pagine e DPI; per un\'immagine, l\'output è PDF.',
        },
        {
          title: 'Converti',
          description: 'Convertiamo o racchiudiamo il tuo file sul nostro server.',
        },
        {
          title: 'Scarica',
          description: 'Salva un PDF, una singola immagine o uno ZIP di immagini delle pagine.',
        },
      ],
      advancedDetails: [
        'Il rendering PDF → immagine usa Poppler (pdftoppm); la conversione immagine → PDF incorpora i JPG senza perdita e gli altri formati con compressione Flate senza perdita.',
        'Le esportazioni di PDF multipagina vengono consegnate come .zip con nomi file ordinabili page-001/page-002.',
        'Da immagine a PDF la pagina viene dimensionata sull\'immagine a 96 DPI; da PDF a immagine il valore predefinito è 150 DPI e sono supportati 300+ per la stampa.',
        'Un limite sul numero di pagine protegge dai PDF troppo grandi.',
      ],
      whyItMatters: [
        'Un solo strumento copre entrambe le direzioni di conversione PDF più comuni.',
        'Nessun bisogno di cercare uno strumento diverso a seconda della direzione in cui converti.',
        'Qualità coerente, lato server, indipendentemente dal tuo browser o dispositivo.',
      ],
      useCases: [
        {
          title: 'Flussi di lavoro misti',
          description: 'Passa da PDF→immagine a immagine→PDF senza cambiare strumento.',
        },
        {
          title: 'Preparazione di documenti',
          description: 'Trasforma le immagini in PDF per i moduli di caricamento.',
        },
        {
          title: 'Riutilizzo',
          description: 'Converti le pagine PDF in immagini per presentazioni o social.',
        },
        {
          title: 'Anteprime rapide',
          description: 'Genera un\'immagine della prima pagina da qualsiasi PDF.',
        },
      ],
      whyMediaManipulator: [
        'Entrambe le direzioni di conversione in un unico strumento adattivo.',
        'Conversione immagine→PDF senza perdita e rendering PDF→immagine accurato con Poppler.',
      ],
      privacyNote: 'Il tuo PDF viene convertito pagina per pagina in immagini, oppure la tua immagine viene racchiusa in un PDF, da Poppler e ImageMagick sul nostro server. Nulla viene inviato a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'originale non viene mai modificato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Cosa può fare il convertitore PDF?',
          answer: 'Converte le pagine PDF in immagini JPG o PNG e converte le immagini (JPG, PNG e altre) in documenti PDF: tutto in un unico strumento gratuito.',
        },
        {
          question: 'Come fa a sapere in quale direzione convertire?',
          answer: 'Si adatta al tuo caricamento: un PDF mostra i controlli per l\'esportazione in immagini (formato, pagine, DPI), mentre un\'immagine viene convertita in PDF.',
        },
        {
          question: 'Posso convertire un PDF multipagina in immagini?',
          answer: 'Sì. Scegli «tutte le pagine» e ottieni uno ZIP contenente un\'immagine per pagina, chiamate page-001, page-002 e così via.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Carica un PDF per PDF→immagine; carica un\'immagine per immagine→PDF. Il modulo si adatta automaticamente.',
          'L\'esportazione di tutte le pagine di un PDF viene consegnata come .zip di immagini numerate.',
        ],
      },
      related: [
        {
          label: 'Da PDF a JPG',
          to: '/tools/pdf-to-jpg',
          description: 'Converti le pagine PDF in immagini JPG.',
        },
        {
          label: 'Da PDF a PNG',
          to: '/tools/pdf-to-png',
          description: 'Converti le pagine PDF in immagini PNG senza perdita.',
        },
        {
          label: 'Da immagine a PDF',
          to: '/tools/image-to-pdf',
          description: 'Trasforma qualsiasi immagine in un PDF.',
        },
        {
          label: 'Converti JPG in PDF',
          to: '/tools/convert-jpg-to-pdf',
          description: 'Convertitore dedicato JPG → PDF.',
        },
        {
          label: 'Converti PNG in PDF',
          to: '/tools/convert-png-to-pdf',
          description: 'Convertitore dedicato PNG → PDF.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra formati di immagine.',
        },
      ],
      embed: {
        title: 'Converti un PDF o un\'immagine',
        description: 'Carica un PDF per convertirne le pagine in immagini JPG o PNG, oppure carica un\'immagine per trasformarla in un PDF. Il modulo si adatta al file che scegli.',
      },
    },
    'convert-heic-to-jpg': {
      name: 'Converti HEIC in JPG',
      h1: 'Converti HEIC in JPG online gratis',
      tagline: 'Trasforma le foto HEIC dell\'iPhone in file JPG compatibili con tutto, che si aprono e si caricano ovunque.',
      metaTitle: 'Converti HEIC in JPG online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da HEIC a JPG. Trasforma le foto .heic/.heif dell\'iPhone in file JPG compatibili con tutto. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti HEIC in JPG online gratis',
      ogDescription: 'Trasforma le foto HEIC dell\'iPhone in file JPG compatibili con tutto. Gratis, veloce, senza registrazione.',
      intro: 'HEIC è il formato ad alta efficienza che gli iPhone usano per risparmiare spazio, ma non si apre su molti PC Windows, siti web o app più vecchie. Media Manipulator converte le tue foto HEIC in JPG, il formato che funziona ovunque, con l\'orientamento corretto e la qualità che scegli.',
      whatItDoes: [
        'Converte le foto HEIC/HEIF di Apple in JPG standard.',
        'Orienta automaticamente l\'immagine usando l\'EXIF, così i ritratti non sono di traverso.',
        'Ti lascia scegliere la qualità JPG per bilanciare dimensione del file e fedeltà.',
        'Produce un JPG che si apre su qualsiasi dispositivo, sito o app.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'HEIC',
          description: 'Trascina una foto .heic o .heif dal tuo iPhone.',
        },
        {
          title: 'Orientamento automatico',
          description: 'Leggiamo l\'orientamento EXIF così la foto è dritta.',
        },
        {
          title: 'Codifica in JPG',
          description: 'ImageMagick decodifica l\'HEIC (libheif) e scrive un JPG.',
        },
        {
          title: 'Scarica il JPG',
          description: 'Salva un file .jpg compatibile con tutto.',
        },
      ],
      advancedDetails: [
        'La decodifica HEIC si basa su ImageMagick compilato con un delegato libheif. Se il server non supporta HEIC, lo strumento restituisce un errore chiaro invece di un file danneggiato.',
        'Una qualità di 85–90 è un ottimo valore predefinito: l\'HEIC è già efficiente, quindi un JPG di alta qualità mantiene la foto identica.',
        'L\'orientamento EXIF viene applicato prima della codifica, il che risolve il comune problema della «rotazione di 90°» quando l\'HEIC viene convertito in modo ingenuo.',
      ],
      whyItMatters: [
        'Windows, molti moduli di caricamento web e i software più vecchi non riescono ancora ad aprire l\'HEIC.',
        'Condividere un JPG garantisce che il destinatario possa vederlo su qualsiasi dispositivo.',
        'La maggior parte dei laboratori di stampa e dei marketplace richiede JPG.',
      ],
      useCases: [
        {
          title: 'Condivisione di foto dell\'iPhone',
          description: 'Invia foto che si aprono su qualsiasi telefono o PC.',
        },
        {
          title: 'Caricamenti web',
          description: 'Soddisfa i moduli e i siti che rifiutano l\'HEIC.',
        },
        {
          title: 'Stampa',
          description: 'Converti in JPG prima di ordinare le stampe.',
        },
        {
          title: 'Modifica in app più vecchie',
          description: 'Apri la tua foto in software senza supporto HEIC.',
        },
      ],
      whyMediaManipulator: [
        'Orientamento automatico corretto: niente foto di traverso.',
        'Controllo della qualità invece di un preset fisso.',
      ],
      privacyNote: 'La tua foto HEIC viene decodificata sul nostro server, girata nel verso giusto e salvata come JPG. Nulla viene inviato a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'originale non viene mai modificato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Come converto HEIC in JPG gratis?',
          answer: 'Carica la tua foto .heic qui sopra, scegli una qualità e fai clic su converti. Ottieni un .jpg standard.',
        },
        {
          question: 'Perché la mia foto HEIC non si apre su Windows?',
          answer: 'HEIC è un formato preferito da Apple che le versioni più vecchie di Windows e molte app non riescono a leggere. Convertirla in JPG fa sì che la foto si apra ovunque.',
        },
        {
          question: 'La foto perderà qualità?',
          answer: 'Il JPG è con perdita, ma a qualità 85–90 il risultato appare identico all\'originale HEIC per praticamente tutte le foto.',
        },
        {
          question: 'Perché la mia foto convertita in passato era ruotata?',
          answer: 'I convertitori ingenui ignorano l\'orientamento EXIF. Noi orientiamo automaticamente l\'immagine, così la tua foto esce nel verso giusto.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'La decodifica HEIC richiede ImageMagick con un delegato libheif sul server.',
        ],
      },
      related: [
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra JPG, PNG, WebP, AVIF e altro.',
        },
        {
          label: 'Converti AVIF in JPG',
          to: '/tools/convert-avif-to-jpg',
          description: 'Converti le moderne foto AVIF in JPG.',
        },
        {
          label: 'Comprimi immagine',
          to: '/tools/compress-image',
          description: 'Riduci il JPG per il web.',
        },
        {
          label: 'Tutorial del convertitore di immagini',
          to: '/tutorials/image/getting-started',
          description: 'Esplora ogni opzione di immagine.',
        },
      ],
      embed: {
        title: 'Converti HEIC in JPG',
        description: 'Carica una foto HEIC o HEIF dal tuo iPhone. L\'output è bloccato su JPG, orientato automaticamente così da apparire nel verso giusto, alla qualità che scegli.',
      },
    },
    'convert-avif-to-jpg': {
      name: 'Converti AVIF in JPG',
      h1: 'Converti AVIF in JPG online gratis',
      tagline: 'Trasforma le moderne immagini AVIF in file JPG compatibili con tutto, per le app e i siti che non accettano AVIF.',
      metaTitle: 'Converti AVIF in JPG online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da AVIF a JPG. Trasforma le immagini .avif in file JPG compatibili con tutto, alla qualità che scegli tu. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti AVIF in JPG online gratis',
      ogDescription: 'Trasforma le moderne immagini AVIF in file JPG compatibili con tutto. Gratis, veloce, senza registrazione.',
      intro: 'AVIF è un formato immagine all\'avanguardia che produce file minuscoli, ma molte app, editor e moduli di caricamento non riescono ancora ad aprirlo. Media Manipulator converte AVIF in JPG così la tua immagine funziona ovunque. Scegli una qualità e scarica.',
      whatItDoes: [
        'Converte le immagini AVIF in JPG standard.',
        'Appiattisce l\'eventuale trasparenza su uno sfondo, perché il JPG non ha canale alfa.',
        'Ti permette di scegliere la qualità del JPG per l\'equilibrio tra peso e fedeltà che preferisci.',
        'Produce un JPG che si apre su qualsiasi dispositivo o app.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'AVIF',
          description: 'Trascina un\'immagine .avif.',
        },
        {
          title: 'Scegli la qualità del JPG',
          description: '85 è un valore predefinito equilibrato.',
        },
        {
          title: 'Codifica il JPG',
          description: 'ImageMagick decodifica l\'AVIF (libaom/libheif) e scrive un JPG.',
        },
        {
          title: 'Scarica il JPG',
          description: 'Salva un file .jpg compatibile con tutto.',
        },
      ],
      advancedDetails: [
        'La decodifica AVIF si basa su ImageMagick compilato con un delegato AVIF (libaom o libheif). Se il server non supporta AVIF, lo strumento restituisce un errore chiaro.',
        'AVIF supporta la trasparenza; nella conversione in JPG le aree trasparenti vengono appiattite perché il JPG non ha canale alfa. Usa AVIF → PNG per mantenere la trasparenza.',
        'Una qualità di 85–90 mantiene il JPG visivamente identico all\'AVIF per la maggior parte delle immagini.',
      ],
      whyItMatters: [
        'Molte app e moduli di caricamento non supportano ancora AVIF.',
        'Il JPG garantisce che il destinatario possa aprire l\'immagine.',
        'La conversione ti permette di usare un download AVIF ovunque ti serva un JPG.',
      ],
      useCases: [
        {
          title: 'Salvare immagini dal web',
          description: 'Converti un AVIF che hai scaricato in un JPG utilizzabile.',
        },
        {
          title: 'Compatibilità con le app',
          description: 'Apri un AVIF in un software privo di supporto AVIF.',
        },
        {
          title: 'Caricamenti',
          description: 'Soddisfa un modulo che accetta solo JPG.',
        },
        {
          title: 'Stampa',
          description: 'Produci un JPG per un laboratorio fotografico.',
        },
      ],
      whyMediaManipulator: [
        'Controllo della qualità invece di un preset uguale per tutti.',
        'Funziona sui nostri server: nessuna elaborazione da parte di terzi.',
      ],
      privacyNote: 'Il tuo AVIF viene decodificato sul nostro server e ricodificato come JPG alla qualità che imposti. Nulla viene inviato a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'originale non viene mai alterato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Come converto AVIF in JPG gratis?',
          answer: 'Carica la tua immagine .avif qui sopra, scegli una qualità e clicca su converti. Ricevi un file .jpg standard.',
        },
        {
          question: 'Perché non riesco ad aprire i file AVIF?',
          answer: 'AVIF è un formato più recente; molte app, editor e siti web non ne hanno ancora aggiunto il supporto. La conversione in JPG fa aprire l\'immagine ovunque.',
        },
        {
          question: 'E la trasparenza?',
          answer: 'Il JPG non ha trasparenza, quindi le aree trasparenti dell\'AVIF vengono appiattite su uno sfondo. Se devi mantenere la trasparenza, usa lo strumento AVIF → PNG.',
        },
        {
          question: 'Perderò qualità?',
          answer: 'A qualità 85–90 il JPG appare sostanzialmente identico all\'AVIF per la maggior parte delle immagini.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'La decodifica AVIF richiede ImageMagick con un delegato AVIF sul server. La trasparenza viene appiattita nell\'output JPG.',
        ],
      },
      related: [
        {
          label: 'Converti AVIF in PNG',
          to: '/tools/convert-avif-to-png',
          description: 'Mantieni la trasparenza con un PNG, invece.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra JPG, PNG, WebP, AVIF e altro ancora.',
        },
        {
          label: 'Converti HEIC in JPG',
          to: '/tools/convert-heic-to-jpg',
          description: 'Converti le foto HEIC dell\'iPhone in JPG.',
        },
        {
          label: 'Comprimi immagine',
          to: '/tools/compress-image',
          description: 'Riduci il peso del JPG per il web.',
        },
      ],
      embed: {
        title: 'Converti AVIF in JPG',
        description: 'Carica un\'immagine AVIF. L\'output è bloccato su JPG, così ottieni un file che ogni app, editor e modulo di caricamento accetta, alla qualità che scegli tu.',
      },
    },
    'convert-avif-to-png': {
      name: 'Converti AVIF in PNG',
      h1: 'Converti AVIF in PNG online gratis',
      tagline: 'Trasforma le immagini AVIF in file PNG senza perdita che si aprono ovunque e mantengono tutta la trasparenza.',
      metaTitle: 'Converti AVIF in PNG online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da AVIF a PNG. Trasforma le immagini .avif in file PNG senza perdita che conservano la trasparenza e si aprono in qualsiasi editor. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti AVIF in PNG online gratis',
      ogDescription: 'Trasforma le immagini AVIF in file PNG senza perdita che conservano la trasparenza. Gratis, veloce, senza registrazione.',
      intro: 'Quando un\'immagine AVIF ha una trasparenza, come un logo o un ritaglio, convertirla in JPG la appiattirebbe. Il PNG mantiene il canale alfa ed è senza perdita, quindi è il formato giusto per la grafica. Media Manipulator converte AVIF in PNG con la trasparenza intatta.',
      whatItDoes: [
        'Converte le immagini AVIF in PNG senza perdita.',
        'Conserva il canale alfa, così gli AVIF trasparenti restano trasparenti.',
        'Produce un PNG che si apre in qualsiasi editor, visualizzatore o strumento di design.',
        'L\'immagine viene preservata pixel per pixel quando l\'AVIF diventa un PNG.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'AVIF',
          description: 'Trascina un\'immagine .avif, trasparente o piena.',
        },
        {
          title: 'Decodifica l\'AVIF',
          description: 'ImageMagick decodifica l\'AVIF con il suo delegato AVIF.',
        },
        {
          title: 'Codifica il PNG',
          description: 'Viene scritto un PNG senza perdita con la trasparenza preservata.',
        },
        {
          title: 'Scarica il PNG',
          description: 'Salva un file .png che conserva la trasparenza.',
        },
      ],
      advancedDetails: [
        'La decodifica AVIF si basa su ImageMagick compilato con un delegato AVIF (libaom o libheif). Se il server non supporta AVIF, lo strumento restituisce un errore chiaro.',
        'La trasparenza dell\'AVIF viene conservata come canale alfa del PNG.',
        'Il PNG è senza perdita, quindi l\'output è di solito più grande dell\'AVIF di partenza: è il prezzo da pagare per compatibilità universale e trasparenza.',
      ],
      whyItMatters: [
        'Il PNG mantiene la trasparenza che il JPG distruggerebbe, essenziale per loghi e ritagli.',
        'Alcuni editor e app non riescono ad aprire AVIF; il PNG si apre ovunque.',
        'Il PNG è un formato di interscambio sicuro e senza perdita per la grafica.',
      ],
      useCases: [
        {
          title: 'Loghi trasparenti',
          description: 'Converti un logo AVIF trasparente in un PNG utilizzabile.',
        },
        {
          title: 'Consegne di design',
          description: 'Fornisci un PNG agli strumenti che non leggono AVIF.',
        },
        {
          title: 'Modifica',
          description: 'Apri l\'immagine senza perdita nel tuo editor.',
        },
        {
          title: 'Risorse web',
          description: 'Tieni un PNG di riserva per i browser più vecchi.',
        },
      ],
      whyMediaManipulator: [
        'Trasparenza conservata automaticamente.',
        'Output PNG senza perdita per il lavoro grafico.',
      ],
      privacyNote: 'Il tuo AVIF viene decodificato sul nostro server e salvato come PNG senza perdita con la trasparenza intatta. Nulla viene inviato a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'originale non viene mai alterato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Come converto AVIF in PNG gratis?',
          answer: 'Carica la tua immagine .avif qui sopra e clicca su converti: l\'output è un file .png senza perdita con la trasparenza preservata.',
        },
        {
          question: 'La conversione da AVIF a PNG mantiene la trasparenza?',
          answer: 'Sì. Il PNG supporta un canale alfa, quindi un AVIF trasparente resta trasparente dopo la conversione.',
        },
        {
          question: 'Devo scegliere PNG o JPG per il mio AVIF?',
          answer: 'Scegli PNG quando ti serve la trasparenza o una qualità senza perdita (loghi, grafica). Scegli JPG per il file più piccolo quando l\'immagine è una foto senza trasparenza.',
        },
        {
          question: 'Perché il PNG è più grande dell\'AVIF?',
          answer: 'AVIF è un formato compresso molto efficiente, mentre il PNG è senza perdita, quindi il PNG è in genere più grande. È normale.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'La decodifica AVIF richiede ImageMagick con un delegato AVIF. La trasparenza viene conservata nell\'output PNG.',
        ],
      },
      related: [
        {
          label: 'Converti AVIF in JPG',
          to: '/tools/convert-avif-to-jpg',
          description: 'Converti l\'AVIF in un JPG compatto, invece.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra JPG, PNG, WebP, AVIF e altro ancora.',
        },
        {
          label: 'Converti HEIC in JPG',
          to: '/tools/convert-heic-to-jpg',
          description: 'Converti le foto HEIC dell\'iPhone in JPG.',
        },
        {
          label: 'Rimuovi lo sfondo da un\'immagine',
          to: '/tools/remove-background-from-image',
          description: 'Crea automaticamente un ritaglio PNG trasparente.',
        },
      ],
      embed: {
        title: 'Converti AVIF in PNG',
        description: 'Carica un\'immagine AVIF. L\'output è bloccato su PNG, così la trasparenza viene conservata e il file si apre senza perdita in qualsiasi editor o visualizzatore.',
      },
    },
    'convert-svg-to-png': {
      name: 'Converti SVG in PNG',
      h1: 'Converti SVG in PNG online gratis',
      tagline: 'Rasterizza icone e loghi SVG in immagini PNG di qualsiasi dimensione per caricamenti, presentazioni e app.',
      metaTitle: 'Converti SVG in PNG online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da SVG a PNG. Rasterizza icone e loghi SVG in immagini PNG della dimensione che scegli tu. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti SVG in PNG online gratis',
      ogDescription: 'Rasterizza icone e loghi SVG in immagini PNG di qualsiasi dimensione. Gratis, veloce, senza registrazione.',
      intro: 'Gli SVG sono vettori perfetti, ma molte piattaforme (social network, marketplace, strumenti per presentazioni e app) accettano solo immagini raster come il PNG. Media Manipulator rasterizza il tuo SVG in un PNG nitido che conserva la trasparenza, della dimensione che scegli tu. Gli SVG vengono elaborati come input non attendibile con un renderer sicuro.',
      whatItDoes: [
        'Rasterizza i file vettoriali SVG in immagini PNG.',
        'Ti permette di impostare una larghezza e/o un\'altezza di destinazione per la risoluzione dell\'output.',
        'Conserva nel PNG la trasparenza dell\'SVG.',
        'Esegue il rendering con un rasterizzatore sicuro che non recupera risorse esterne dalla rete.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'SVG',
          description: 'Trascina un\'icona, un logo o un\'illustrazione .svg.',
        },
        {
          title: 'Imposta la dimensione (facoltativo)',
          description: 'Scegli larghezza/altezza, oppure usa la dimensione naturale dell\'SVG.',
        },
        {
          title: 'Rasterizza',
          description: 'L\'SVG viene renderizzato in un\'immagine a pixel sul nostro server.',
        },
        {
          title: 'Scarica il PNG',
          description: 'Salva un file .png nitido che conserva la trasparenza.',
        },
      ],
      advancedDetails: [
        'Il rendering usa rsvg-convert (librsvg) quando disponibile, che per impostazione predefinita non carica risorse remote, con ImageMagick come fallback protetto.',
        'Poiché l\'SVG è un vettore, puoi renderizzarlo a qualsiasi risoluzione senza perdita di qualità; scegli una larghezza maggiore per un output più nitido.',
        'Gli SVG caricati vengono trattati come input non attendibile ed elaborati con l\'accesso alla rete disabilitato, per evitare rischi di SSRF e di recupero di risorse esterne.',
      ],
      whyItMatters: [
        'La maggior parte dei moduli di caricamento e delle piattaforme social rifiuta l\'SVG ma accetta il PNG.',
        'Rasterizzare a una dimensione scelta garantisce un output nitido per quell\'uso.',
        'Il PNG mantiene la trasparenza su cui icone e loghi fanno affidamento.',
      ],
      useCases: [
        {
          title: 'Social e caricamenti',
          description: 'Trasforma un logo SVG in un PNG che la piattaforma accetta.',
        },
        {
          title: 'Presentazioni',
          description: 'Inserisci in una slide un PNG nitido di un\'icona.',
        },
        {
          title: 'Risorse per app',
          description: 'Esporta un PNG della dimensione esatta che serve alla tua app.',
        },
        {
          title: 'E-mail',
          description: 'Usa un PNG dove l\'SVG non è supportato.',
        },
      ],
      whyMediaManipulator: [
        'Rendering a qualsiasi dimensione senza perdita di qualità: i vettori si scalano perfettamente.',
        'Gestione sicura degli SVG con i recuperi esterni disabilitati.',
      ],
      privacyNote: 'Il tuo SVG viene renderizzato in PNG da librsvg sul nostro server, senza recuperare le immagini e i font esterni a cui fa riferimento. Nulla viene inviato a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'originale non viene mai alterato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Come converto SVG in PNG gratis?',
          answer: 'Carica il tuo file .svg qui sopra, imposta se vuoi una larghezza o un\'altezza e clicca su converti. Ricevi un file .png nitido.',
        },
        {
          question: 'Che dimensione avrà il PNG?',
          answer: 'Per impostazione predefinita usa la dimensione naturale dell\'SVG. Imposta una larghezza e/o un\'altezza per renderizzare più grande o più piccolo: i vettori si scalano senza perdita di qualità.',
        },
        {
          question: 'Il PNG mantiene la trasparenza?',
          answer: 'Sì. Le aree trasparenti dell\'SVG vengono conservate come trasparenza nel PNG.',
        },
        {
          question: 'È sicuro caricare un SVG?',
          answer: 'Sì. Trattiamo gli SVG come input non attendibile e li renderizziamo con i recuperi esterni dalla rete disabilitati, così i riferimenti remoti incorporati non possono essere caricati.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Renderizzato con rsvg-convert (preferito) o con un fallback ImageMagick protetto. I recuperi esterni dalla rete da parte dell\'SVG sono disabilitati.',
        ],
      },
      related: [
        {
          label: 'Converti PNG in SVG',
          to: '/tools/convert-png-to-svg',
          description: 'Fai il percorso inverso: vettorializza un PNG in SVG.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra JPG, PNG, WebP, AVIF e altro ancora.',
        },
        {
          label: 'Da PNG a ICO',
          to: '/tools/png-to-ico',
          description: 'Trasforma il PNG in una favicon.',
        },
      ],
      embed: {
        title: 'Converti SVG in PNG',
        description: 'Carica un SVG. L\'output è bloccato su PNG. Se vuoi, imposta una larghezza o un\'altezza per controllare la risoluzione del rendering; lasciale vuote per usare la dimensione naturale dell\'SVG.',
      },
    },
    'convert-png-to-svg': {
      name: 'Converti PNG in SVG',
      h1: 'Converti PNG in SVG online gratis',
      tagline: 'Vettorializza loghi, icone e disegni al tratto da PNG in veri tracciati SVG scalabili con potrace.',
      metaTitle: 'Converti PNG in SVG online gratis | Media Manipulator',
      metaDescription: 'Vettorializzatore online gratuito da PNG a SVG. Traccia loghi, icone e disegni al tratto in veri tracciati SVG scalabili. Ideale per grafica semplice, non per foto. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti PNG in SVG online gratis',
      ogDescription: 'Vettorializza loghi, icone e disegni al tratto da PNG in veri tracciati SVG scalabili. Gratis, senza registrazione.',
      intro: 'Una vera conversione da PNG a SVG significa tracciare l\'immagine in veri tracciati vettoriali che si scalano a qualsiasi dimensione senza pixelatura. Media Manipulator usa potrace per vettorializzare il tuo PNG: ideale per loghi, icone, firme e disegni al tratto in bianco e nero. È una vera vettorializzazione, non un PNG nascosto dentro un SVG. Non è pensata per trasformare le fotografie in grafica vettoriale pulita.',
      whatItDoes: [
        'Traccia un PNG in veri tracciati vettoriali SVG scalabili con potrace.',
        'Riduce l\'immagine a una bitmap pulita in bianco e nero, poi vettorializza le forme.',
        'Ti permette di regolare la soglia bianco/nero per catturare più o meno dettagli.',
        'Produce un vero file .svg, non un\'immagine raster avvolta in un tag <image>.',
      ],
      flowSteps: [
        {
          title: 'Carica il PNG',
          description: 'Trascina un logo, un\'icona, una firma o un disegno al tratto in PNG.',
        },
        {
          title: 'Imposta la soglia',
          description: 'Scegli il punto di separazione bianco/nero per controllare i dettagli.',
        },
        {
          title: 'Traccia in vettori',
          description: 'ImageMagick prepara una bitmap; potrace traccia i tracciati.',
        },
        {
          title: 'Scarica l\'SVG',
          description: 'Salva un vero file .svg scalabile.',
        },
      ],
      advancedDetails: [
        'La pipeline appiattisce il PNG in una bitmap a due livelli (soglia di ImageMagick) e poi esegue potrace per produrre tracciati vettoriali Bézier morbidi.',
        'La vettorializzazione funziona meglio su grafica semplice e ad alto contrasto: loghi, icone, monogrammi, firme e disegni al tratto in bianco e nero.',
        'Non riprodurrà fedelmente fotografie o gradienti complessi: tracciare una foto produce tracciati grandi e disordinati, non grafica vettoriale pulita.',
        'Alza la soglia per catturare dettagli più fini e più chiari; abbassala per tenere solo le forme più marcate.',
      ],
      whyItMatters: [
        'I loghi vettoriali si scalano a qualsiasi dimensione, da una favicon a un cartellone, senza pixelatura.',
        'Gli SVG sono minuscoli per la grafica semplice e modificabili in strumenti vettoriali come Illustrator o Inkscape.',
        'Recuperare un vettore da un logo PNG evita di ricrearlo da zero.',
      ],
      useCases: [
        {
          title: 'Recupero di loghi',
          description: 'Vettorializza un logo PNG di cui non hai più il file sorgente.',
        },
        {
          title: 'Icone e monogrammi',
          description: 'Trasforma un\'icona semplice in un SVG scalabile.',
        },
        {
          title: 'Firme',
          description: 'Vettorializza una firma scansionata per riutilizzarla in modo pulito.',
        },
        {
          title: 'Disegni al tratto',
          description: 'Traccia illustrazioni in bianco e nero in tracciati modificabili.',
        },
      ],
      whyMediaManipulator: [
        'Vera vettorializzazione con potrace, onesta su ciò che sa fare bene (e ciò che no).',
        'Controllo della soglia per mettere a punto il tracciamento.',
      ],
      privacyNote: 'La tua immagine viene ridotta in bianco e nero e tracciata in tracciati vettoriali da potrace sul nostro server. Nulla viene inviato a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'originale non viene mai alterato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Come converto un PNG in SVG gratis?',
          answer: 'Carica il tuo file .png qui sopra, regola la soglia se necessario e clicca su converti. Ricevi un vero file .svg vettoriale.',
        },
        {
          question: 'È una vera vettorializzazione o solo un PNG incapsulato?',
          answer: 'È una vera vettorializzazione. Tracciamo l\'immagine in veri tracciati SVG con potrace: non incorporiamo il PNG dentro un SVG per poi dichiarare il lavoro finito.',
        },
        {
          question: 'Vettorializzerà la mia foto?',
          answer: 'Non bene. La vettorializzazione è pensata per loghi, icone, firme e disegni al tratto. Fotografie e gradienti complessi producono tracciati grandi e disordinati anziché vettori puliti.',
        },
        {
          question: 'A cosa serve il controllo della soglia?',
          answer: 'Imposta il punto di separazione bianco/nero prima del tracciamento. Alzalo per catturare più dettagli (più chiari); abbassalo per tenere solo le forme più marcate.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'La vettorializzazione richiede potrace sul server. Ideale per loghi, icone e disegni al tratto, non per fotografie.',
        ],
      },
      related: [
        {
          label: 'Converti SVG in PNG',
          to: '/tools/convert-svg-to-png',
          description: 'Fai il percorso inverso: rasterizza un SVG in PNG.',
        },
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra JPG, PNG, WebP, AVIF e altro ancora.',
        },
        {
          label: 'Da PNG a ICO',
          to: '/tools/png-to-ico',
          description: 'Trasforma un PNG in una favicon.',
        },
      ],
      embed: {
        title: 'Vettorializza PNG in SVG',
        description: 'Carica un PNG. L\'output è bloccato su SVG e prodotto da una vera vettorializzazione (potrace), non da un raster avvolto in un SVG. Regola la soglia bianco/nero per catturare più o meno dettagli. Ideale per loghi, icone, firme e disegni al tratto.',
      },
    },
    'png-to-ico': {
      name: 'Da PNG a ICO',
      h1: 'Converti PNG in ICO online gratis',
      tagline: 'Trasforma un PNG in una vera favicon .ico multi-dimensione per siti web e icone di app Windows.',
      metaTitle: 'Converti PNG in ICO online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da PNG a ICO. Genera una vera favicon .ico multi-dimensione (16–256px) per siti web e icone Windows. Senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti PNG in ICO online gratis',
      ogDescription: 'Genera una vera favicon .ico multi-dimensione da un PNG. Gratis, veloce, senza registrazione.',
      intro: 'Una favicon deve essere un vero file .ico contenente più dimensioni, così browser e Windows possono scegliere quella giusta. Media Manipulator genera un autentico ICO multi-dimensione dal tuo PNG, non un file rinominato, includendo la scala standard di icone da 16 a 256 px.',
      whatItDoes: [
        'Genera un vero contenitore .ico da un\'immagine PNG.',
        'Racchiude più dimensioni (16, 32, 48, 64, 128, 256 px) in un unico file.',
        'Conserva la trasparenza, così l\'icona si posa in modo pulito su qualsiasi sfondo.',
        'Produce un file che browser e Windows accettano come favicon o icona di app.',
      ],
      flowSteps: [
        {
          title: 'Carica il PNG',
          description: 'Trascina un PNG: un\'immagine quadrata dà l\'icona migliore.',
        },
        {
          title: 'Genera le dimensioni',
          description: 'Renderizziamo ogni dimensione standard di icona dalla tua immagine.',
        },
        {
          title: 'Impacchetta l\'ICO',
          description: 'Le dimensioni vengono racchiuse in un unico vero contenitore .ico.',
        },
        {
          title: 'Scarica l\'ICO',
          description: 'Salva favicon.ico per il tuo sito o la tua app.',
        },
      ],
      advancedDetails: [
        'L\'ICO viene costruito con il ridimensionamento automatico per icone di ImageMagick, producendo un vero contenitore multi-immagine, non un PNG rinominato.',
        'Includere più dimensioni permette a browser e Windows di scegliere l\'icona più nitida per ogni contesto (scheda, barra delle applicazioni, desktop).',
        'Per il risultato più pulito, parti da un PNG quadrato a 256×256 o più grande, così ogni dimensione viene ridotta in modo nitido.',
      ],
      whyItMatters: [
        'I browser si aspettano una vera favicon .ico; un PNG rinominato può non funzionare o apparire sfocato.',
        'Un\'icona multi-dimensione resta nitida da una scheda a 16px a un collegamento sul desktop a 256px.',
        'Le icone delle app Windows richiedono il formato .ico.',
      ],
      useCases: [
        {
          title: 'Favicon per siti web',
          description: 'Genera favicon.ico per l\'icona della scheda del tuo sito.',
        },
        {
          title: 'Icone per app Windows',
          description: 'Crea un file .ico per un\'applicazione desktop.',
        },
        {
          title: 'Collegamenti',
          description: 'Crea un\'icona nitida per un collegamento sul desktop.',
        },
        {
          title: 'Branding',
          description: 'Trasforma un logo PNG in un vero file icona.',
        },
      ],
      whyMediaManipulator: [
        'Un autentico ICO multi-dimensione, non un PNG rinominato.',
        'Trasparenza conservata per icone pulite.',
      ],
      privacyNote: 'La tua immagine viene ridimensionata a ogni dimensione standard di icona e racchiusa in un unico file .ico da ImageMagick sul nostro server. Nulla viene inviato a un servizio esterno. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. L\'originale non viene mai alterato: scarichi un nuovo file.',
      faq: [
        {
          question: 'Come converto un PNG in ICO gratis?',
          answer: 'Carica il tuo file .png qui sopra e clicca su converti: ricevi un vero file .ico multi-dimensione.',
        },
        {
          question: 'È un vero ICO o un PNG rinominato?',
          answer: 'Un vero ICO. Generiamo più dimensioni di icona e le racchiudiamo in un autentico contenitore .ico, che è ciò che browser e Windows si aspettano.',
        },
        {
          question: 'Quali dimensioni sono incluse?',
          answer: 'La scala standard delle favicon: 16, 32, 48, 64, 128 e 256 px. Browser e Windows scelgono la dimensione migliore per ogni contesto.',
        },
        {
          question: 'Quale immagine funziona meglio?',
          answer: 'Un PNG quadrato a 256×256 o più grande dà il risultato più nitido, perché ogni dimensione più piccola viene ridotta in modo pulito a partire da esso.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Viene generato un ICO multi-dimensione (16/32/48/64/128/256 px). Parti da un\'immagine quadrata per il risultato migliore.',
        ],
      },
      related: [
        {
          label: 'Convertitore di immagini',
          to: '/tools/image-converter',
          description: 'Converti tra JPG, PNG, WebP, AVIF e altro ancora.',
        },
        {
          label: 'Converti SVG in PNG',
          to: '/tools/convert-svg-to-png',
          description: 'Rasterizza un logo SVG prima di creare un\'icona.',
        },
        {
          label: 'Ridimensiona immagine',
          to: '/tools/image-resizer',
          description: 'Crea un\'immagine quadrata prima di generare l\'icona.',
        },
        {
          label: 'Rimuovi lo sfondo da un\'immagine',
          to: '/tools/remove-background-from-image',
          description: 'Crea una sorgente trasparente per l\'icona.',
        },
      ],
      embed: {
        title: 'Converti PNG in ICO',
        description: 'Carica un PNG (un\'immagine quadrata funziona meglio). L\'output è bloccato su ICO e viene generata una vera icona multi-dimensione contenente le versioni a 16, 32, 48, 64, 128 e 256 px.',
      },
    },
    'svg-converter': {
      name: 'Convertitore SVG',
      tagline: 'Rasterizza un SVG in PNG o vettorializza un PNG in SVG: il convertitore di immagini con SVG come punto di partenza.',
    },
    'convert-wav-to-mp3': {
      name: 'Converti WAV in MP3',
      h1: 'Converti WAV in MP3 online',
      tagline: 'Riduci le pesanti registrazioni WAV senza perdita in file MP3 ampiamente compatibili per podcast, condivisione e archiviazione.',
      metaTitle: 'Converti WAV in MP3 online (gratis) | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da WAV a MP3. Comprimi le registrazioni .wav senza perdita in file MP3 più piccoli, al bitrate che scegli tu.',
      ogTitle: 'Converti WAV in MP3 online',
      ogDescription: 'Comprimi le registrazioni WAV in file MP3 ampiamente compatibili, al bitrate che scegli tu.',
      intro: 'I file WAV sono senza perdita e pesanti. L\'MP3 è il formato audio compresso compatibile con tutto: ogni telefono, laptop e app musicale lo riproduce. Media Manipulator ricodifica il tuo WAV in MP3 al bitrate che scegli, così sacrifichi solo un briciolo di qualità per un file 5–10 volte più piccolo.',
      whatItDoes: [
        'Ricodifica le registrazioni WAV in MP3 al bitrate che scegli.',
        'Supporta frequenza di campionamento, canali e bitrate personalizzati (da 128 a 320 kbps).',
        'Preserva il volume ed evita ricampionamenti inutili.',
        'Produce un file .mp3 standard con tag ID3.',
      ],
      flowSteps: [
        {
          title: 'Carica il WAV',
          description: 'Trascina qualsiasi file .wav dal tuo computer.',
        },
        {
          title: 'Scegli il bitrate',
          description: '192 kbps per la voce, 256–320 kbps per la musica.',
        },
        {
          title: 'Codifica l\'MP3',
          description: 'FFmpeg codifica un MP3 pulito con le impostazioni scelte.',
        },
        {
          title: 'Scarica l\'MP3',
          description: 'Salva un file .mp3 ampiamente compatibile.',
        },
      ],
      advancedDetails: [
        'Dietro le quinte usa una codifica in stile LAME tramite FFmpeg.',
        'L\'MP3 è un codec con perdita: per la musica la qualità raggiunge il suo plateau intorno ai 256 kbps. I contenuti vocali suonano benissimo a 128–192 kbps.',
        'Se ti servono file più piccoli senza perdita, usa invece FLAC o ALAC. Usa Opus (in OGG) per i file con perdita moderni più piccoli, quando hai il controllo del lettore.',
      ],
      whyItMatters: [
        'I file WAV sono 5–10 volte più grandi dell\'MP3 equivalente a bitrate ragionevoli.',
        'L\'MP3 si riproduce su ogni dispositivo: nessun problema di compatibilità dei codec.',
        'Podcast, audiolibri e piattaforme musicali in genere richiedono o preferiscono caricamenti in MP3.',
      ],
      useCases: [
        {
          title: 'Episodi di podcast',
          description: 'Masterizza in WAV, pubblica in MP3 a 96–128 kbps mono.',
        },
        {
          title: 'Memo vocali',
          description: 'Riduci le registrazioni del telefono prima di condividerle o archiviarle.',
        },
        {
          title: 'Demo musicali',
          description: 'Invia i mix a 256–320 kbps senza allegati enormi.',
        },
        {
          title: 'Incorporare in un sito web',
          description: 'Usa l\'MP3 per la compatibilità: ogni browser lo riproduce in modo nativo.',
        },
      ],
      whyMediaManipulator: [
        'Scegli con precisione bitrate, frequenza di campionamento e configurazione dei canali.',
        'Gratis, senza registrazione, senza filigrane: l\'output è interamente tuo.',
        'Stesso modello di privacy e conservazione del resto degli strumenti.',
      ],
      privacyNote: 'Il tuo WAV viene codificato in MP3 da FFmpeg sul nostro server al bitrate che scegli. Nessun servizio audio esterno è coinvolto. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Ricevi un nuovo file; il caricamento in sé non viene modificato.',
      faq: [
        {
          question: 'Quale bitrate devo scegliere?',
          answer: '192 kbps è un valore predefinito equilibrato. Usa 128 kbps per voce e podcast, 256–320 kbps per la musica.',
        },
        {
          question: 'La qualità audio peggiorerà?',
          answer: 'Leggermente: l\'MP3 è con perdita. A 256 kbps e oltre la maggior parte degli ascoltatori non nota la differenza rispetto al WAV originale.',
        },
        {
          question: 'Posso convertire altri formati in MP3?',
          answer: 'Sì: il convertitore audio accetta FLAC, M4A/AAC, OGG, OPUS e altri ancora. Usa lo strumento generale di conversione audio.',
        },
        {
          question: 'C\'è un limite di dimensione dei file?',
          answer: 'Vengono accettati file di dimensioni ragionevoli. Per registrazioni molto lunghe, valuta di tagliarle prima.',
        },
      ],
      related: [
        {
          label: 'Convertitore audio',
          to: '/tools/audio-converter',
          description: 'Converti tra qualsiasi coppia di formati audio.',
        },
        {
          label: 'Isola la voce da una canzone',
          to: '/tools/isolate-vocals-from-song',
          description: 'Estrai la voce dai brani musicali.',
        },
        {
          label: 'Tutorial del convertitore audio',
          to: '/tutorials/audio/getting-started',
          description: 'Esplora ogni opzione audio, compresi gli strumenti di IA.',
        },
      ],
      embed: {
        title: 'Converti WAV in MP3',
        description: 'Carica un file WAV e scegli MP3 come formato di output. 192 kbps è un buon valore predefinito per la voce; usa 256–320 kbps per la musica.',
      },
    },
    'isolate-vocals-from-song': {
      name: 'Isola la voce da una canzone',
      h1: 'Isola la voce da una canzone online',
      tagline: 'Estrai la voce dai brani musicali per remix, cover, trascrizioni e analisi. Usalo solo su musica di cui possiedi i diritti.',
      metaTitle: 'Isola la voce da una canzone online (gratis) | Media Manipulator',
      metaDescription: 'Isolamento vocale online gratuito. Estrai la voce da una canzone in uno stem pulito per remix, cover, trascrizioni o analisi.',
      ogTitle: 'Isola la voce da una canzone online',
      ogDescription: 'Estrai la voce da una canzone in uno stem isolato e pulito, per remix, cover, trascrizioni o analisi.',
      intro: 'La separazione delle sorgenti basata su IA può estrarre la traccia vocale da un mix finito: perfetto per remix, cover, preparazione di karaoke o trascrizione dei testi. Media Manipulator esegue la separazione sul nostro server GPU. Il risultato è un singolo stem vocale che puoi scaricare e usare ovunque, purché tu ne abbia il diritto per il materiale di partenza.',
      whatItDoes: [
        'Esegue una separazione delle sorgenti basata su IA per estrarre la traccia vocale da una registrazione musicale.',
        'Produce un singolo stem vocale isolato nello stesso formato del tuo file (l\'MP3 resta MP3), oppure in FLAC, WAV o MP3 se lo scegli.',
        'Si abbina bene agli strumenti di pulizia audio come riduzione del rumore ed EQ per un risultato rifinito.',
        'Supporta in ingresso WAV, MP3, FLAC, M4A, OGG, OPUS e altri ancora.',
      ],
      flowSteps: [
        {
          title: 'Carica la canzone',
          description: 'Trascina qualsiasi file audio comune con voce e musica mixate.',
        },
        {
          title: 'Esegui la separazione con IA',
          description: 'Un modello sulla GPU locale separa la voce dal resto del mix.',
        },
        {
          title: 'Pulisci (facoltativo)',
          description: 'Applica riduzione del rumore, EQ o guadagno per rifinire lo stem.',
        },
        {
          title: 'Scarica lo stem vocale',
          description: 'Salva la voce isolata: nello stesso formato del tuo file per impostazione predefinita, oppure in FLAC, WAV o MP3.',
        },
      ],
      advancedDetails: [
        'La separazione delle sorgenti è per sua natura imperfetta: riverbero, armonie ed effetti pesanti filtrano nell\'output.',
        'Un MP3 o un altro file compresso torna nel suo stesso formato (MP3 a 320 kbps). I file senza perdita (WAV, FLAC, AIFF) tornano come FLAC. FLAC e WAV conservano il massimo dei dettagli per ulteriori modifiche in una DAW; il WAV è il più pesante.',
        'Per il karaoke (solo strumentale), usa invece la modalità dedicata «Rimuovi la voce» nel convertitore audio.',
      ],
      whyItMatters: [
        'Produttori e remixer possono costruire nuovi brani attorno a una voce esistente.',
        'I cantanti possono trascrivere testi o melodie con più precisione.',
        'Docenti e tecnici audio usano gli stem isolati per studiare le tecniche di mixaggio.',
      ],
      useCases: [
        {
          title: 'Remix e cover',
          description: 'Costruisci una nuova base strumentale attorno a una voce isolata.',
        },
        {
          title: 'Trascrizione di testi e melodie',
          description: 'Ottieni un segnale più chiaro per la trascrizione manuale o con IA.',
        },
        {
          title: 'Preparazione di karaoke',
          description: 'Abbina la voce isolata a una versione strumentale separata.',
        },
        {
          title: 'Pratica di ingegneria audio',
          description: 'Studia le tecniche di mixaggio su registrazioni commerciali.',
        },
      ],
      whyMediaManipulator: [
        'IA su GPU locale: nessun fornitore di IA di terze parti vede il tuo audio.',
        'Combina EQ, riduzione del rumore e taglio in un unico caricamento.',
        'Gratis, senza registrazione, senza filigrane sull\'output.',
      ],
      privacyNote: 'La tua canzone viene separata in stem da Demucs sul nostro server GPU e ti viene restituito solo lo stem vocale. Nessun servizio audio esterno è coinvolto. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Ricevi un nuovo file; il caricamento in sé non viene modificato.',
      faq: [
        {
          question: 'La separazione è perfettamente pulita?',
          answer: 'Nessuno strumento di separazione delle sorgenti è perfetto. Aspettati qualche artefatto, soprattutto in presenza di riverbero pesante e armonie. Scegli l\'output FLAC o WAV se prevedi di ripulire lo stem in seguito in una DAW.',
        },
        {
          question: 'Quali formati audio sono supportati?',
          answer: 'WAV, MP3, FLAC, M4A/AAC, OGG, OPUS e la maggior parte degli altri formati audio comuni.',
        },
        {
          question: 'Posso usarlo su musica protetta da copyright?',
          answer: 'Solo se possiedi i diritti, hai una licenza o operi nell\'ambito del fair use della tua giurisdizione. Sei tu il responsabile dell\'uso che fai dell\'output.',
        },
        {
          question: 'Dove posso ottenere solo la base strumentale?',
          answer: 'Usa la modalità IA «Rimuovi la voce» nel convertitore audio: stesso caricamento, output diverso.',
        },
      ],
      related: [
        {
          label: 'Convertitore audio',
          to: '/tools/audio-converter',
          description: 'Converti e ripulisci lo stem dopo l\'isolamento.',
        },
        {
          label: 'Converti WAV in MP3',
          to: '/tools/convert-wav-to-mp3',
          description: 'Comprimi lo stem WAV in MP3 per condividerlo.',
        },
        {
          label: 'Tutorial del convertitore audio',
          to: '/tutorials/audio/getting-started',
          description: 'Esplora ogni opzione audio, compresi gli strumenti di IA.',
        },
      ],
      embed: {
        title: 'Isola la voce',
        description: 'Carica una canzone e premi il pulsante: Isola la voce è già selezionato. Il risultato torna nello stesso formato del tuo file (l\'MP3 resta MP3); scegli FLAC o WAV sotto Formato di output per un risultato senza perdita.',
      },
    },
    'image-converter': {
      name: 'Convertitore di immagini',
      h1: 'Convertitore di immagini online gratuito',
      tagline: 'Converti tra JPG, PNG, WebP, AVIF, GIF e altro ancora, con controllo su qualità, ridimensionamento, ritaglio e metadati.',
      metaTitle: 'Convertitore di immagini online gratuito | Media Manipulator',
      metaDescription: 'Convertitore di immagini online gratuito per JPG, PNG, WebP, AVIF, GIF e HEIC. Ridimensiona, comprimi, ritaglia e rimuovi i metadati in un solo caricamento.',
      ogTitle: 'Convertitore di immagini online gratuito',
      ogDescription: 'Converti JPG, PNG, WebP, AVIF, GIF e HEIC. Ridimensiona, comprimi e rimuovi i metadati in un solo caricamento.',
      intro: 'Una singola immagine spesso deve vivere in più posti: il tuo sito web, una presentazione, un materiale stampato, un annuncio su un marketplace. Ognuno preferisce un formato diverso. Media Manipulator gestisce ogni formato di immagine comune in un unico posto, con un controllo preciso su qualità, ridimensionamento e metadati.',
      whatItDoes: [
        'Converte tra JPG, PNG, WebP, AVIF, GIF, HEIC e altro ancora.',
        'Ridimensiona, ritaglia, ruota e applica filtri visivi in un unico passaggio.',
        'Rimuovi o mantieni i metadati EXIF/IPTC/XMP secondo necessità.',
        'Strumenti IA: sfocatura dei volti, rimozione dello sfondo, upscaling e oscuramento di testo/dati personali.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'immagine',
          description: 'Trascina qualsiasi file immagine comune.',
        },
        {
          title: 'Scegli il formato di output',
          description: 'JPG, PNG, WebP, AVIF, GIF.',
        },
        {
          title: 'Regola qualità e metadati',
          description: 'Ridimensiona, ritaglia o rimuovi gli EXIF.',
        },
        {
          title: 'Scarica',
          description: 'Salva l\'immagine convertita.',
        },
      ],
      advancedDetails: [
        'WebP e AVIF danno i file web più piccoli: AVIF spesso batte WebP alla stessa qualità visiva.',
        'PNG è senza perdita e supporta la trasparenza; ottimo per risorse di interfaccia e screenshot.',
        'JPG è il formato di scambio più sicuro per le foto.',
      ],
      whyItMatters: [
        'Piattaforme e strumenti diversi accettano formati di immagine diversi.',
        'File immagine più piccoli caricano le pagine più velocemente, e Google posiziona più in alto le pagine più veloci.',
        'Rimuovere i metadati prima di condividere protegge la tua privacy.',
      ],
      useCases: [
        {
          title: 'Ottimizzazione web',
          description: 'Converti le foto PNG in WebP/AVIF per ridurre il peso della pagina.',
        },
        {
          title: 'Condivisione tra piattaforme',
          description: 'Converti le foto HEIC dell\'iPhone in JPG.',
        },
        {
          title: 'Annunci su marketplace',
          description: 'Rimuovi i metadati e ridimensiona prima di pubblicare.',
        },
        {
          title: 'Stampa e presentazioni',
          description: 'Esporta in JPG con un preset di alta qualità.',
        },
      ],
      whyMediaManipulator: [
        'Un solo caricamento copre conversione, ridimensionamento, ritaglio, filtri, IA e metadati.',
        'Gratis, senza registrazione, senza filigrane.',
        'Gli strumenti IA funzionano sul nostro server GPU.',
      ],
      privacyNote: 'La tua immagine viene convertita, e ridimensionata o ritagliata se lo hai richiesto, da ImageMagick sul nostro server. Nulla viene inviato a un servizio esterno. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. L\'originale non viene mai alterato: scarichi un file nuovo.',
      faq: [
        {
          question: 'Qual è il miglior formato di immagine?',
          answer: 'Dipende: WebP/AVIF per il web, PNG per la trasparenza, JPG per la compatibilità.',
        },
        {
          question: 'Posso convertire in batch?',
          answer: 'Lo strumento gratuito converte un\'immagine alla volta. Esegui più conversioni in sequenza.',
        },
        {
          question: 'Rimuoverà i metadati?',
          answer: 'Solo se imposti la Modalità metadati su "Rimuovi". Di default i metadati vengono mantenuti.',
        },
        {
          question: 'Funziona con HEIC?',
          answer: 'Sì: le foto HEIC dell\'iPhone si convertono senza problemi in JPG, PNG o WebP.',
        },
      ],
      related: [
        {
          label: 'Ridimensiona immagine',
          to: '/tools/image-resizer',
          description: 'Ridimensiona alle dimensioni esatte in pixel.',
        },
        {
          label: 'Comprimi immagine',
          to: '/tools/compress-image',
          description: 'Riduci il peso del file immagine per il web.',
        },
        {
          label: 'Da immagine a PDF',
          to: '/tools/image-to-pdf',
          description: 'Racchiudi un\'immagine in un documento PDF.',
        },
        {
          label: 'Convertitore PDF',
          to: '/tools/pdf-converter',
          description: 'Converti PDF in immagini e viceversa.',
        },
        {
          label: 'Converti HEIC in JPG',
          to: '/tools/convert-heic-to-jpg',
          description: 'Converti le foto HEIC dell\'iPhone in JPG.',
        },
        {
          label: 'Rimuovi lo sfondo da un\'immagine',
          to: '/tools/remove-background-from-image',
          description: 'Cancella automaticamente uno sfondo in un PNG trasparente.',
        },
        {
          label: 'Converti WebP in JPG',
          to: '/tools/convert-webp-to-jpg',
          description: 'Convertitore dedicato da WebP → JPG.',
        },
        {
          label: 'Tutorial del convertitore di immagini',
          to: '/tutorials/image/getting-started',
          description: 'Guida completa a ogni opzione.',
        },
      ],
      embed: {
        title: 'Converti un\'immagine',
        description: 'Carica qualsiasi immagine e scegli formato di output, qualità e impostazioni di ridimensionamento/ritaglio. JPG è adatto alle foto, PNG mantiene la trasparenza e WebP/AVIF danno i file web più piccoli.',
      },
    },
    'video-converter': {
      name: 'Convertitore video',
      h1: 'Convertitore video online gratuito',
      tagline: 'Converti tra MP4, WebM, MOV, AVI, MKV e altro ancora, con pieno controllo su codec, risoluzione e audio.',
      metaTitle: 'Convertitore video online gratuito | Media Manipulator',
      metaDescription: 'Convertitore video online gratuito per MP4, WebM, MOV, AVI, MKV e altro ancora. Scegli codec, bitrate, risoluzione e impostazioni audio.',
      ogTitle: 'Convertitore video online gratuito',
      ogDescription: 'Converti MP4, WebM, MOV, AVI, MKV, FLV, WMV e altro ancora. Scegli codec, bitrate e impostazioni audio.',
      intro: 'Piattaforme diverse vogliono formati video diversi. Monta su un Mac in MOV, pubblica sul web in MP4 o WebM, archivia in MKV. Media Manipulator gestisce ogni contenitore e codec video comune in un unico posto, con pieno controllo su bitrate, risoluzione e audio.',
      whatItDoes: [
        'Converte tra MP4, WebM, MOV, AVI, MKV, FLV, WMV e ProRes.',
        'Scegli il codec (H.264, H.265, VP9, ProRes, DNxHD).',
        'Ridimensiona, cambia il frame rate, taglia e ricodifica l\'audio.',
        'Applica facoltativamente filtri e color grading.',
      ],
      flowSteps: [
        {
          title: 'Carica il video',
          description: 'Trascina qualsiasi contenitore video comune.',
        },
        {
          title: 'Scegli il formato di destinazione',
          description: 'MP4, WebM, MOV, AVI, MKV.',
        },
        {
          title: 'Regola codec e qualità',
          description: 'Bitrate, risoluzione, audio.',
        },
        {
          title: 'Scarica',
          description: 'Salva il video convertito.',
        },
      ],
      advancedDetails: [
        'H.264 in MP4 è l\'impostazione predefinita sicura ovunque.',
        'H.265 (HEVC) e VP9 danno file più piccoli di circa il 25–50% alla stessa qualità visiva, ma richiedono un lettore moderno.',
        'Per i passaggi di consegna in montaggio, ProRes (in MOV) o DNxHD (in MOV/MXF) preservano la massima qualità.',
      ],
      whyItMatters: [
        'App di montaggio, browser e piattaforme social preferiscono ciascuno formati diversi.',
        'File video più piccoli migliorano i tempi di caricamento delle pagine e i costi di banda.',
        'La ricodifica ti permette di correggere codec sbagliati o file non riproducibili.',
      ],
      useCases: [
        {
          title: 'MOV → MP4',
          description: 'Rendi riproducibili ovunque le riprese fatte con dispositivi Apple.',
        },
        {
          title: 'AVI → MP4',
          description: 'Modernizza un vecchio video d\'archivio.',
        },
        {
          title: 'MP4 → WebM',
          description: 'Riduci il peso dei video web per i browser moderni.',
        },
        {
          title: 'Consegne per il montaggio',
          description: 'Esporta in ProRes o DNxHD per un montaggio di alta qualità.',
        },
      ],
      whyMediaManipulator: [
        'Pieno controllo su codec, bitrate e audio in un solo caricamento.',
        'Trascrizione IA disponibile sullo stesso file.',
        'Gratis, senza registrazione, senza filigrane.',
      ],
      privacyNote: 'Il tuo video viene ricodificato da FFmpeg sul nostro server nel contenitore e nel codec che scegli. L\'elaborazione avviene sui nostri server, non su un servizio di transcodifica di terze parti. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Il tuo file sorgente resta intatto e il risultato è un file nuovo.',
      faq: [
        {
          question: 'Qual è il formato di output migliore?',
          answer: 'MP4 con H.264 per la compatibilità, WebM con VP9 per i file web più piccoli.',
        },
        {
          question: 'Posso tagliare prima di convertire?',
          answer: 'Sì: la sezione di taglio del modulo ti permette di accorciare la clip prima della ricodifica.',
        },
        {
          question: 'L\'audio resterà sincronizzato?',
          answer: 'Sì: FFmpeg mantiene la sincronizzazione A/V. Se cambi frame rate o velocità, l\'audio viene ricampionato di conseguenza.',
        },
        {
          question: 'C\'è un limite di dimensione del file?',
          answer: 'I file molto grandi possono essere rifiutati nel piano gratuito. Prova prima ad abbassare la risoluzione.',
        },
      ],
      related: [
        {
          label: 'Converti MOV in MP4',
          to: '/tools/convert-mov-to-mp4',
          description: 'Rendi riproducibili ovunque le riprese QuickTime/iPhone.',
        },
        {
          label: 'Converti WebM in MP4',
          to: '/tools/convert-webm-to-mp4',
          description: 'Trasforma un video web in un MP4 modificabile.',
        },
        {
          label: 'Converti MP4 in WebM',
          to: '/tools/convert-mp4-to-webm',
          description: 'Riduci un MP4 in WebM VP9 per il web.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Compressore dedicato per ridurre il peso dei file video.',
        },
        {
          label: 'Converti video in GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Trasforma brevi clip in GIF animate.',
        },
        {
          label: 'Estrai l\'audio da un video',
          to: '/tools/extract-audio-from-video',
          description: 'Salva la colonna sonora come MP3, WAV o M4A.',
        },
        {
          label: 'Taglia video',
          to: '/tools/video-trimmer',
          description: 'Taglia una clip alla parte che vuoi, senza perdita.',
        },
        {
          label: 'Ridimensiona video',
          to: '/tools/resize-video',
          description: 'Cambia la risoluzione a 1080p, 720p o personalizzata.',
        },
        {
          label: 'Ruota video',
          to: '/tools/rotate-video',
          description: 'Correggi riprese di lato o capovolte.',
        },
        {
          label: 'Trascrivi video',
          to: '/tools/transcribe-video',
          description: 'Estrai il parlato da un video come testo o sottotitoli VTT.',
        },
        {
          label: 'Interpolazione di fotogrammi con IA',
          to: '/tools/ai-frame-interpolation',
          description: 'Porta gli FPS del video a 48, 60 o 120 con fotogrammi generati dall\'IA.',
        },
        {
          label: 'Transcodifica video in HLS',
          to: '/tools/transcode-to-hls',
          description: 'Genera un pacchetto HLS adattivo da qualsiasi video.',
        },
        {
          label: 'Transcodifica video in DASH',
          to: '/tools/transcode-to-dash',
          description: 'Genera un pacchetto MPEG-DASH AV1/VP9 da qualsiasi video.',
        },
        {
          label: 'Tutorial del convertitore video',
          to: '/tutorials/video/getting-started',
          description: 'Guida completa a ogni opzione.',
        },
      ],
      embed: {
        title: 'Converti un video',
        description: 'Carica qualsiasi video e scegli contenitore/codec di destinazione. Il preset di qualità "media" è un buon punto di partenza. MP4 si riproduce ovunque; WebM dà file più piccoli nei browser moderni.',
      },
    },
    'mp4-converter': {
      name: 'Convertitore MP4',
      tagline: 'Converti un video in MP4: il convertitore video con MP4 già selezionato.',
    },
    'convert-mov-to-mp4': {
      name: 'Converti MOV in MP4',
      h1: 'Converti MOV in MP4 online gratis',
      tagline: 'Trasforma i file .mov di QuickTime e iPhone in un MP4 universale che si riproduce e si carica ovunque.',
      metaTitle: 'Converti MOV in MP4 online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da MOV a MP4. Converti i video .mov di QuickTime e iPhone in un MP4 che si riproduce ovunque. Senza filigrana né registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti MOV in MP4 online gratis',
      ogDescription: 'Converti i file MOV di QuickTime / iPhone in un MP4 universale che si carica e si riproduce su qualsiasi dispositivo.',
      intro: 'MOV è il contenitore QuickTime di Apple: è quello in cui iPhone, Mac e molte fotocamere registrano per impostazione predefinita. Funziona benissimo nell\'ecosistema Apple, ma può rifiutarsi di riprodursi su Windows, Android o in alcuni moduli di caricamento. Convertire un MOV in MP4 mantiene lo stesso video H.264 e lo stesso audio AAC in un contenitore accettato in tutto il mondo, di solito senza alcun cambiamento visibile di qualità.',
      whatItDoes: [
        'Converte i file .mov di QuickTime / iPhone in MP4.',
        'Blocca l\'output su MP4 (H.264 + AAC) così il risultato si riproduce ovunque.',
        'Aggiunge -pix_fmt yuv420p e +faststart così l\'MP4 si riproduce nei browser e parte all\'istante.',
        'Taglia il MOV, ridimensionalo o scegli un preset di qualità nello stesso caricamento.',
      ],
      flowSteps: [
        {
          title: 'Carica il tuo MOV',
          description: 'Trascina un file .mov dal tuo iPhone, Mac o fotocamera.',
        },
        {
          title: 'L\'output è bloccato su MP4',
          description: 'Nessun formato da scegliere: per questo strumento è impostato MP4.',
        },
        {
          title: 'Converti',
          description: 'Reincapsuliamo o ricodifichiamo il video in un MP4 pulito.',
        },
        {
          title: 'Scarica',
          description: 'Salva il tuo MP4, pronto per qualsiasi dispositivo o piattaforma.',
        },
      ],
      advancedDetails: [
        'La maggior parte dei file MOV contiene già video H.264, quindi la conversione è rapida e quasi senza perdita con la qualità Alta.',
        'Forziamo la crominanza yuv420p così l\'MP4 si riproduce in Safari e sulle piattaforme social che rifiutano il video 4:2:2/4:4:4.',
        'Se il tuo MOV contiene ProRes, il convertitore lo transcodifica in H.264: scegli la qualità Alta per conservare il massimo dettaglio.',
      ],
      whyItMatters: [
        'Il MOV spesso non si riproduce su Windows o Android senza codec aggiuntivi.',
        'Molti moduli di caricamento ed editor accettano l\'MP4 ma rifiutano il MOV.',
        'L\'MP4 è il formato più sicuro per condividere un video da iPhone con chiunque.',
      ],
      useCases: [
        {
          title: 'Video da iPhone',
          description: 'Converti un .mov registrato su iPhone così si riproduce su un PC Windows.',
        },
        {
          title: 'Caricamento sul web',
          description: 'Trasforma un\'esportazione QuickTime in un MP4 che un sito web accetterà.',
        },
        {
          title: 'Invio a utenti non Apple',
          description: 'Condividi le riprese con utenti Android e Windows senza problemi di riproduzione.',
        },
        {
          title: 'Compatibilità con gli editor',
          description: 'Fornisci un MP4 agli editor che fanno fatica con il MOV grezzo.',
        },
      ],
      whyMediaManipulator: [
        'Output bloccato su un profilo MP4 collaudato: nessuna impostazione da indovinare.',
        'FFmpeg lato server gestisce anche le sorgenti ProRes in MOV e HEVC in MOV.',
      ],
      privacyNote: 'Il tuo MOV viene ricodificato da FFmpeg sul nostro server in un MP4 H.264 e AAC. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Il file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'Come converto un MOV in MP4?',
          answer: 'Carica il tuo file .mov e clicca su converti: l\'output è già impostato su MP4, quindi non c\'è altro da scegliere.',
        },
        {
          question: 'Convertire un MOV in MP4 fa perdere qualità?',
          answer: 'La maggior parte dei file MOV usa H.264, quindi con la qualità Alta la ricodifica è visivamente quasi senza perdita. I preset più bassi sacrificano un po\' di qualità per un file più piccolo.',
        },
        {
          question: 'Perché il MOV del mio iPhone non si riproduce su Windows?',
          answer: 'Windows potrebbe non avere i codec QuickTime/HEVC. L\'MP4 con H.264 + AAC si riproduce senza software aggiuntivo.',
        },
        {
          question: 'QuickTime in MP4 è la stessa cosa?',
          answer: 'Sì: i file QuickTime usano il contenitore .mov, quindi convertire QuickTime in MP4 è esattamente questo strumento.',
        },
        {
          question: 'C\'è una filigrana o serve registrarsi?',
          answer: 'Nessuna filigrana e nessun account richiesto. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'L\'output è bloccato su MP4 (H.264 + AAC, yuv420p, +faststart).',
        ],
      },
      related: [
        {
          label: 'Convertitore video',
          to: '/tools/video-converter',
          description: 'Converti qualsiasi video in MP4.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso dell\'MP4 per e-mail o web.',
        },
        {
          label: 'Converti video in GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Taglia una clip ed esporta una GIF animata.',
        },
        {
          label: 'Tutorial del convertitore video',
          to: '/tutorials/video/getting-started',
          description: 'Scopri passo dopo passo le opzioni di taglio, ridimensionamento e qualità.',
        },
      ],
      embed: {
        title: 'Converti MOV in MP4',
        description: 'Carica il tuo file .mov. Per questo strumento l\'output è bloccato su MP4 (H.264 + AAC), quindi basta caricare e convertire.',
      },
    },
    'convert-webm-to-mp4': {
      name: 'Converti WebM in MP4',
      h1: 'Converti WebM in MP4 online gratis',
      tagline: 'Trasforma i video .webm ottimizzati per il web in un MP4 che puoi modificare, condividere e riprodurre su qualsiasi dispositivo.',
      metaTitle: 'Converti WebM in MP4 online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da WebM a MP4. Converti video .webm (VP8/VP9) in MP4 (H.264 + AAC) per gli editor e i dispositivi che non aprono il WebM. Senza filigrana né registrazione.',
      ogTitle: 'Converti WebM in MP4 online gratis',
      ogDescription: 'Converti un video .webm in un MP4 universale che editor, telefoni e TV possono riprodurre.',
      intro: 'WebM è un contenitore moderno e aperto nato per il web: file piccoli, ottimi per il video nel browser. Ma molti editor video, dispositivi meno recenti e app di messaggistica non riescono ad aprire il WebM. Convertire un WebM in MP4 ricodifica il video VP8/VP9 in H.264 e l\'audio in AAC, dandoti un file che funziona in Premiere, Resolve, sui telefoni e sulle TV.',
      whatItDoes: [
        'Converte i video .webm (VP8/VP9 + Vorbis/Opus) in MP4.',
        'Blocca l\'output su MP4 (H.264 + AAC) per la massima compatibilità.',
        'Aggiunge yuv420p e +faststart così l\'MP4 si riproduce in ogni browser e parte all\'istante.',
        'Una registrazione dello schermo in WebM può essere tagliata o ridimensionata nel passaggio a MP4.',
      ],
      flowSteps: [
        {
          title: 'Carica il tuo WebM',
          description: 'Trascina un file .webm scaricato dal web o da un registratore dello schermo.',
        },
        {
          title: 'L\'output è bloccato su MP4',
          description: 'Per questo strumento MP4 è preimpostato: niente da configurare.',
        },
        {
          title: 'Converti',
          description: 'Transcodifichiamo VP8/VP9 in H.264 + AAC.',
        },
        {
          title: 'Scarica',
          description: 'Salva il tuo MP4 per montarlo o riprodurlo ovunque.',
        },
      ],
      advancedDetails: [
        'Il WebM usa video VP8/VP9, che la maggior parte degli editor non riesce a importare; l\'MP4/H.264 si importa senza problemi in ogni NLE.',
        'Forziamo yuv420p così l\'MP4 si riproduce in Safari e sulle piattaforme social.',
        'Se in realtà vuoi un file web più piccolo, lo strumento inverso da MP4 a WebM produce invece un WebM VP9.',
      ],
      whyItMatters: [
        'La maggior parte degli editor desktop non importa il WebM ma gestisce l\'MP4 in modo nativo.',
        'Alcuni telefoni, TV e app di chat si rifiutano di riprodurre il WebM.',
        'L\'MP4 è il formato di consegna sicuro per un video che hai scaricato come WebM.',
      ],
      useCases: [
        {
          title: 'Monta un video scaricato',
          description: 'Porta una clip .webm in Premiere o Resolve come MP4.',
        },
        {
          title: 'Registrazioni dello schermo',
          description: 'Converti una registrazione dello schermo in WebM in un MP4 condivisibile.',
        },
        {
          title: 'Riproduzione su dispositivi meno recenti',
          description: 'Fai riprodurre un file WebM su una TV o un telefono che non lo supporta.',
        },
        {
          title: 'App di messaggistica',
          description: 'Invia video alle app che accettano l\'MP4 ma non il WebM.',
        },
      ],
      whyMediaManipulator: [
        'FFmpeg lato server decodifica VP8 e VP9 in modo affidabile.',
        'Output bloccato su un profilo MP4 collaudato.',
      ],
      privacyNote: 'Il tuo WebM viene ricodificato da FFmpeg sul nostro server da VP8 o VP9 in un MP4 H.264. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Il file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'Come converto un WebM in MP4?',
          answer: 'Carica il tuo file .webm e clicca su converti: l\'output è già impostato su MP4.',
        },
        {
          question: 'Perché il mio editor non apre il WebM?',
          answer: 'La maggior parte degli editor non include l\'importazione VP8/VP9. Convertire in MP4 (H.264) risolve l\'importazione.',
        },
        {
          question: 'Il file diventerà più grande?',
          answer: 'L\'MP4/H.264 può essere leggermente più grande di un WebM VP9 a pari qualità. Scegli un preset di qualità più basso se il peso conta.',
        },
        {
          question: 'Mantiene l\'audio?',
          answer: 'Sì: l\'audio Vorbis/Opus viene ricodificato in AAC e resta sincronizzato.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'L\'output è bloccato su MP4 (H.264 + AAC, yuv420p, +faststart).',
        ],
      },
      related: [
        {
          label: 'Convertitore video',
          to: '/tools/video-converter',
          description: 'Converti qualsiasi video in MP4.',
        },
        {
          label: 'Converti MP4 in WebM',
          to: '/tools/convert-mp4-to-webm',
          description: 'L\'inverso: crea un WebM VP9 leggero.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso dell\'MP4 per condividerlo.',
        },
      ],
      embed: {
        title: 'Converti WebM in MP4',
        description: 'Carica il tuo file .webm. Per questo strumento l\'output è bloccato su MP4 (H.264 + AAC), quindi basta caricare e convertire.',
      },
    },
    'convert-avi-to-mp4': {
      name: 'Converti AVI in MP4',
      h1: 'Converti AVI in MP4 online gratis',
      tagline: 'Porta i vecchi video .avi nel presente con un MP4 compatto che si riproduce su ogni telefono, browser e TV.',
      metaTitle: 'Converti AVI in MP4 online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da AVI a MP4. Converti i vecchi video .avi (Xvid/DivX) in MP4 (H.264 + AAC) che si riproduce ovunque. Senza filigrana né registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti AVI in MP4 online gratis',
      ogDescription: 'Converti un vecchio video .avi in un MP4 moderno e compatto che si riproduce su qualsiasi dispositivo.',
      intro: 'AVI è un classico contenitore Windows dell\'era DivX/Xvid. I file sono spesso grandi e usano codec che telefoni, browser e TV moderni non riproducono più. Convertire un AVI in MP4 ricodifica il video nell\'efficiente H.264 e l\'audio in AAC, producendo un file più piccolo che si riproduce su qualsiasi dispositivo tu abbia oggi.',
      whatItDoes: [
        'Converte i vecchi .avi (Xvid, DivX, MJPEG e altri) in MP4.',
        'Blocca l\'output su MP4 (H.264 + AAC) per la riproduzione moderna.',
        'Di solito produce un file sensibilmente più piccolo dell\'AVI di origine.',
        'Un vecchio AVI può essere tagliato e scalato mentre viene convertito.',
      ],
      flowSteps: [
        {
          title: 'Carica il tuo AVI',
          description: 'Trascina un vecchio file .avi da un archivio o da una videocamera.',
        },
        {
          title: 'L\'output è bloccato su MP4',
          description: 'MP4 è preimpostato: niente da configurare.',
        },
        {
          title: 'Converti',
          description: 'Ricodifichiamo in H.264 + AAC.',
        },
        {
          title: 'Scarica',
          description: 'Salva un MP4 moderno e più piccolo.',
        },
      ],
      advancedDetails: [
        'L\'AVI usa comunemente Xvid/DivX (MPEG-4 Part 2); H.264 è circa due volte più efficiente, quindi l\'MP4 è di solito molto più piccolo.',
        'Forziamo yuv420p così il risultato si riproduce nei browser e sulle piattaforme social.',
        'Le acquisizioni AVI interlacciate possono trarre vantaggio dall\'opzione di deinterlacciamento nel convertitore video completo.',
      ],
      whyItMatters: [
        'I file AVI sono grandi e sempre più spesso non riproducibili sui dispositivi moderni.',
        'L\'MP4/H.264 è più piccolo e si riproduce ovunque.',
        'Convertire i vecchi archivi in MP4 li rende a prova di futuro.',
      ],
      useCases: [
        {
          title: 'Vecchi archivi video',
          description: 'Modernizza gli AVI da videocamera o da rip di DVD in MP4.',
        },
        {
          title: 'Libera spazio',
          description: 'Riduci un AVI pesante in un MP4 più piccolo.',
        },
        {
          title: 'Riproduzione su telefono e TV',
          description: 'Fai riprodurre un AVI sui dispositivi che hanno abbandonato il supporto AVI.',
        },
        {
          title: 'Caricamento sul web',
          description: 'Trasforma un AVI in un MP4 che un sito accetterà.',
        },
      ],
      whyMediaManipulator: [
        'FFmpeg lato server decodifica i vecchi codec AVI su cui altri strumenti si inceppano.',
        'Output bloccato su un profilo MP4 collaudato.',
      ],
      privacyNote: 'Il tuo AVI viene ricodificato da FFmpeg sul nostro server in un moderno MP4 H.264. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Il file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'Come converto un AVI in MP4?',
          answer: 'Carica il tuo file .avi e clicca su converti: l\'output è già impostato su MP4.',
        },
        {
          question: 'L\'MP4 sarà più piccolo dell\'AVI?',
          answer: 'Di solito sì. H.264 è molto più efficiente dei codec Xvid/DivX usati dalla maggior parte degli AVI.',
        },
        {
          question: 'Supporta i vecchi AVI DivX/Xvid?',
          answer: 'Sì: FFmpeg decodifica i codec AVI più comuni e li ricodifica in H.264.',
        },
        {
          question: 'Perderò qualità?',
          answer: 'La ricodifica comporta una perdita, ma con la qualità Alta la differenza è minima e il file è comunque più piccolo.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'L\'output è bloccato su MP4 (H.264 + AAC, yuv420p, +faststart).',
        ],
      },
      related: [
        {
          label: 'Convertitore video',
          to: '/tools/video-converter',
          description: 'Converti qualsiasi video in MP4.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci ulteriormente il peso dell\'MP4.',
        },
        {
          label: 'Tutorial del convertitore video',
          to: '/tutorials/video/getting-started',
          description: 'Scopri passo dopo passo taglio, ridimensionamento e deinterlacciamento.',
        },
      ],
      embed: {
        title: 'Converti AVI in MP4',
        description: 'Carica il tuo file .avi. Per questo strumento l\'output è bloccato su MP4 (H.264 + AAC), quindi basta caricare e convertire.',
      },
    },
    'convert-mkv-to-mp4': {
      name: 'Converti MKV in MP4',
      h1: 'Converti MKV in MP4 online gratis',
      tagline: 'Trasforma i file Matroska .mkv in un MP4 che si riproduce in streaming, si carica e si guarda sui dispositivi che rifiutano l\'MKV.',
      metaTitle: 'Converti MKV in MP4 online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da MKV a MP4. Converti video Matroska .mkv in MP4 (H.264 + AAC) per i dispositivi e i siti che non riproducono l\'MKV. Senza filigrana né registrazione.',
      ogTitle: 'Converti MKV in MP4 online gratis',
      ogDescription: 'Converti un video Matroska .mkv in un MP4 universale che si riproduce e si carica ovunque.',
      intro: 'MKV (Matroska) è un contenitore flessibile, popolare per i video di alta qualità, ma molti telefoni, browser, smart TV e moduli di caricamento non lo riproducono. Convertire un MKV in MP4 mette il video in un contenitore che quei dispositivi capiscono. Media Manipulator ricodifica in H.264 + AAC così il risultato si riproduce e si carica senza problemi.',
      whatItDoes: [
        'Converte i file Matroska .mkv in MP4.',
        'Blocca l\'output su MP4 (H.264 + AAC) per un ampio supporto dei dispositivi.',
        'Aggiunge yuv420p e +faststart così l\'MP4 va in streaming e parte all\'istante.',
        'Taglia un episodio MKV o cambiane le dimensioni prima che l\'MP4 venga scritto.',
      ],
      flowSteps: [
        {
          title: 'Carica il tuo MKV',
          description: 'Trascina un file .mkv.',
        },
        {
          title: 'L\'output è bloccato su MP4',
          description: 'Per questo strumento MP4 è preimpostato.',
        },
        {
          title: 'Converti',
          description: 'Spostiamo o transcodifichiamo il video in un MP4.',
        },
        {
          title: 'Scarica',
          description: 'Salva un MP4 che si riproduce ovunque.',
        },
      ],
      advancedDetails: [
        'Se l\'MKV contiene già H.264 + AAC, la conversione è rapida e visivamente senza perdita.',
        'Forziamo yuv420p così l\'MP4 si riproduce in Safari e sulle piattaforme social.',
        'L\'MKV può contenere molte tracce di sottotitoli e audio; il convertitore mantiene il video principale e la prima traccia audio.',
      ],
      whyItMatters: [
        'Molti dispositivi e siti web semplicemente non supportano l\'MKV.',
        'L\'MP4 è il contenitore sicuro per condividere e caricare.',
        'La conversione mantiene il tuo video di alta qualità utilizzabile ovunque.',
      ],
      useCases: [
        {
          title: 'Riproduzione su telefono e TV',
          description: 'Fai riprodurre un MKV su un dispositivo che lo rifiuta.',
        },
        {
          title: 'Caricamento sul web',
          description: 'Trasforma un MKV in un MP4 che un sito accetterà.',
        },
        {
          title: 'Consegna all\'editor',
          description: 'Importa un MP4 negli editor che fanno fatica con l\'MKV.',
        },
        {
          title: 'Uniforma una libreria',
          description: 'Allinea i download MKV alla tua collezione di MP4.',
        },
      ],
      whyMediaManipulator: [
        'FFmpeg lato server gestisce gli MKV con più tracce.',
        'Output bloccato su un profilo MP4 collaudato.',
      ],
      privacyNote: 'Il tuo MKV viene ricodificato da FFmpeg sul nostro server in un MP4 che telefoni e browser riproducono. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Il file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'Come converto un MKV in MP4?',
          answer: 'Carica il tuo file .mkv e clicca su converti: l\'output è già impostato su MP4.',
        },
        {
          question: 'Convertire un MKV in MP4 fa perdere qualità?',
          answer: 'Se l\'MKV usa già H.264, il risultato è visivamente senza perdita con la qualità Alta. Altrimenti è una normale ricodifica con perdita.',
        },
        {
          question: 'Cosa succede alle tracce audio o ai sottotitoli aggiuntivi?',
          answer: 'Il convertitore mantiene il video principale e la prima traccia audio. Se hai bisogno di più tracce, contattaci e possiamo valutare la selezione delle tracce.',
        },
        {
          question: 'Perché il mio MKV non si riproduce?',
          answer: 'Molti telefoni, TV, browser e siti non supportano il contenitore MKV anche quando i codec al suo interno sono comuni.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'L\'output è bloccato su MP4 (H.264 + AAC, yuv420p, +faststart). Vengono mantenuti il video principale e la prima traccia audio.',
        ],
      },
      related: [
        {
          label: 'Convertitore video',
          to: '/tools/video-converter',
          description: 'Converti qualsiasi video in MP4.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso dell\'MP4 per condividerlo.',
        },
        {
          label: 'Tutorial del convertitore video',
          to: '/tutorials/video/getting-started',
          description: 'Scopri passo dopo passo ogni opzione.',
        },
      ],
      embed: {
        title: 'Converti MKV in MP4',
        description: 'Carica il tuo file .mkv. Per questo strumento l\'output è bloccato su MP4 (H.264 + AAC), quindi basta caricare e convertire.',
      },
    },
    'convert-mp4-to-webm': {
      name: 'Converti MP4 in WebM',
      h1: 'Converti MP4 in WebM online gratis',
      tagline: 'Ricodifica un MP4 in un WebM VP9 aperto e più leggero, perfetto per video web a caricamento rapido.',
      metaTitle: 'Converti MP4 in WebM online gratis | Media Manipulator',
      metaDescription: 'Convertitore online gratuito da MP4 a WebM. Ricodifica un MP4 in WebM VP9 + Opus per video web più leggeri e veloci. Senza filigrana né registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Converti MP4 in WebM online gratis',
      ogDescription: 'Converti un MP4 in un WebM VP9 aperto e più leggero, ideale da incorporare nel web moderno.',
      intro: 'WebM è il formato video aperto nato per il web. Con video VP9 e audio Opus produce file più piccoli dell\'MP4 a pari qualità, il che significa pagine più veloci da caricare per i video incorporati. Convertire il tuo MP4 in WebM è la scelta giusta quando controlli il lettore: tutti i browser moderni lo supportano in modo nativo.',
      whatItDoes: [
        'Converte MP4 (H.264) in WebM (VP9 + Opus).',
        'Blocca l\'output su WebM per incorporamenti coerenti sul web aperto.',
        'In genere produce un file più piccolo dell\'MP4 a pari qualità visiva.',
        'Accorcia o riduci la clip e scegli un preset di qualità prima che il WebM venga creato.',
      ],
      flowSteps: [
        {
          title: 'Carica il tuo MP4',
          description: 'Trascina un file .mp4.',
        },
        {
          title: 'L\'output è bloccato su WebM',
          description: 'Per questo strumento WebM (VP9 + Opus) è preimpostato.',
        },
        {
          title: 'Converti',
          description: 'Ricodifichiamo H.264 in VP9 e AAC in Opus.',
        },
        {
          title: 'Scarica',
          description: 'Salva un .webm più leggero per il web.',
        },
      ],
      advancedDetails: [
        'L\'output WebM usa video VP9 con audio Opus dove disponibili, con ripiego su VP8 + Vorbis sulle build di FFmpeg senza VP9/Opus.',
        'La codifica VP9 è più lenta dell\'H.264 ma produce file più piccoli del ~25-50% a qualità comparabile.',
        'Usa il tag <video> con una sorgente WebM e una MP4, così i browser scelgono la migliore tra quelle che supportano.',
      ],
      whyItMatters: [
        'Video web più leggeri significano pagine più veloci e bollette di banda più basse.',
        'Il WebM è libero da royalty e supportato da tutti i browser moderni.',
        'Una coppia WebM + MP4 copre praticamente ogni browser con i file più piccoli possibili.',
      ],
      useCases: [
        {
          title: 'Video hero per siti web',
          description: 'Servi una clip di sfondo o hero leggera e a caricamento rapido.',
        },
        {
          title: 'Incorporamenti sul web aperto',
          description: 'Incorpora video senza preoccupazioni legate ai codec proprietari.',
        },
        {
          title: 'Risparmio di banda',
          description: 'Riduci il peso di consegna per le pagine ad alto traffico.',
        },
        {
          title: 'HTML5 <video>',
          description: 'Fornisci una sorgente WebM accanto a un MP4 di ripiego.',
        },
      ],
      whyMediaManipulator: [
        'Codifica VP9 + Opus con ripiego automatico su VP8 + Vorbis.',
        'Output bloccato su WebM così il risultato è prevedibile.',
      ],
      privacyNote: 'Il tuo video viene ricodificato da FFmpeg sul nostro server in un WebM VP9. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Il file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'Come converto un MP4 in WebM?',
          answer: 'Carica il tuo file .mp4 e clicca su converti: l\'output è già impostato su WebM.',
        },
        {
          question: 'Il WebM è più piccolo dell\'MP4?',
          answer: 'A pari qualità visiva, un WebM VP9 è di solito più piccolo del 25-50% rispetto a un MP4 H.264.',
        },
        {
          question: 'Tutti i browser supportano il WebM?',
          answer: 'Tutti i browser moderni sì. Per i browser meno recenti, fornisci un MP4 di ripiego nel tuo tag <video>.',
        },
        {
          question: 'Perché la codifica WebM è più lenta?',
          answer: 'VP9 richiede più calcolo dell\'H.264. In cambio ottieni un file più piccolo.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'L\'output è bloccato su WebM (VP9 + Opus, oppure VP8 + Vorbis se VP9/Opus non è disponibile).',
        ],
      },
      related: [
        {
          label: 'Converti WebM in MP4',
          to: '/tools/convert-webm-to-mp4',
          description: 'La direzione inversa.',
        },
        {
          label: 'Convertitore video',
          to: '/tools/video-converter',
          description: 'Converti qualsiasi video in MP4.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso del video senza cambiare contenitore.',
        },
      ],
      embed: {
        title: 'Converti MP4 in WebM',
        description: 'Carica il tuo file .mp4. Per questo strumento l\'output è bloccato su WebM (VP9 + Opus), quindi basta caricare e convertire.',
      },
    },
    'mp4-to-mp3': {
      name: 'Converti MP4 in MP3',
      tagline: 'Ottieni l\'audio di un MP4 come MP3: Estrai l\'audio da un video con MP4 in ingresso e MP3 in uscita.',
    },
    'video-to-mp3': {
      name: 'Converti video in MP3',
      tagline: 'Estrai la colonna sonora di un video come MP3: lo stesso strumento di Estrai l\'audio da un video.',
    },
    'mp4-to-gif': {
      name: 'Converti MP4 in GIF',
      tagline: 'Crea una GIF in loop da una clip MP4: il convertitore di GIF animate con l\'ingresso MP4 bloccato.',
    },
    'video-to-gif': {
      name: 'Converti video in GIF',
      tagline: 'Trasforma una breve clip in qualsiasi formato video comune in una GIF in loop: lo stesso strumento del convertitore di GIF animate.',
    },
    'gif-converter': {
      name: 'Convertitore GIF',
      tagline: 'Crea e ottimizza GIF animate da clip video: il convertitore di GIF animate con un altro nome.',
    },
    'video-compressor': {
      name: 'Compressore video',
      tagline: 'Riduci il peso di un video con un preset di compressione: lo stesso strumento di Comprimi video.',
    },
    'compress-mp4': {
      name: 'Comprimi MP4',
      tagline: 'Rendi un MP4 più leggero mantenendolo MP4: Comprimi video con il contenitore bloccato.',
    },
    'mp4-trimmer': {
      name: 'Taglia MP4',
      tagline: 'Il taglia video con MP4 bloccato in ingresso e in uscita.',
    },
    'video-cutter': {
      name: 'Taglia video',
      tagline: 'Tieni una sezione di un video e scarta il resto: lo stesso strumento del taglia video.',
    },
    'cut-video-online': {
      name: 'Taglia video online',
      tagline: 'Taglia una clip da un video nel browser, senza installare nulla: il taglia video con un altro nome.',
    },
    'crop-video': {
      name: 'Ritaglia video',
      h1: 'Ritaglia video online gratis',
      tagline: 'Elimina i bordi di un video: cambia l\'inquadratura o le proporzioni senza un editor.',
      metaTitle: 'Ritaglia video online gratis | Media Manipulator',
      metaDescription: 'Strumento online gratuito per ritagliare i video. Ritaglia i bordi di un video per reinquadrarlo o cambiarne le proporzioni. Output MP4, senza filigrana né registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Ritaglia video online gratis',
      ogDescription: 'Ritaglia i bordi di un video per reinquadrarlo o cambiarne le proporzioni. Gratis, senza filigrana.',
      intro: 'Il ritaglio rimuove i bordi esterni di un video: utile per reinquadrare una ripresa, eliminare bande nere o una filigrana, o cambiare le proporzioni per una piattaforma. Lo strumento di ritaglio video di Media Manipulator prende un rettangolo in pixel (da dove partire e quanto grande) ed esporta solo quell\'area come MP4 pulito.',
      whatItDoes: [
        'Ritaglia un video a un rettangolo che specifichi in pixel.',
        'Rimuove bande nere, bordi, filigrane o zone indesiderate.',
        'Aiuta a reinquadrare in formato quadrato o verticale per le piattaforme social.',
        'Esporta MP4 (H.264 + AAC) per impostazione predefinita.',
      ],
      flowSteps: [
        {
          title: 'Carica il tuo video',
          description: 'MP4, MOV, MKV, WebM, AVI o M4V da ritagliare.',
        },
        {
          title: 'Inserisci il rettangolo di ritaglio',
          description: 'Imposta lo scostamento X/Y e la larghezza/altezza da conservare.',
        },
        {
          title: 'Ritaglia',
          description: 'FFmpeg ritaglia esattamente quella zona e ricodifica.',
        },
        {
          title: 'Scarica',
          description: 'Salva il video ritagliato.',
        },
      ],
      advancedDetails: [
        'Le coordinate di ritaglio sono in pixel dall\'angolo in alto a sinistra: X/Y è dove inizia l\'area conservata, larghezza/altezza è la sua dimensione.',
        'Il ritaglio ricodifica il video; l\'output MP4 usa H.264 + AAC + yuv420p + faststart.',
        'Per un\'inquadratura precisa al pixel su un\'anteprima, il convertitore completo nella pagina iniziale offre una sovrapposizione visiva di ritaglio.',
      ],
      whyItMatters: [
        'Il ritaglio reinquadra una ripresa senza rigirarla.',
        'Rimuove le bande nere (letterbox/pillarbox) e i bordi indesiderati.',
        'Cambiare le proporzioni (per esempio a 9:16) aiuta il video ad adattarsi a una piattaforma.',
      ],
      useCases: [
        {
          title: 'Rendilo verticale',
          description: 'Ritaglia una clip orizzontale a 9:16 per Reels, Shorts e TikTok.',
        },
        {
          title: 'Rimuovi le bande nere',
          description: 'Ritaglia via il letterbox.',
        },
        {
          title: 'Nascondi una filigrana',
          description: 'Ritaglia via un logo in un angolo o un timestamp.',
        },
        {
          title: 'Reinquadra un soggetto',
          description: 'Stringi l\'inquadratura su ciò che conta.',
        },
      ],
      whyMediaManipulator: [
        'Ritaglio preciso al pixel lato server con FFmpeg.',
        'Output MP4 pulito, senza filigrana.',
      ],
      privacyNote: 'Il tuo video viene ritagliato al rettangolo che hai disegnato e ricodificato da FFmpeg sul nostro server. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Il file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'Come ritaglio un video?',
          answer: 'Caricalo, inserisci il rettangolo da conservare (scostamento X/Y e larghezza/altezza in pixel) e scarica il video ritagliato.',
        },
        {
          question: 'Posso ritagliare in formato quadrato o verticale?',
          answer: 'Sì: imposta larghezza e altezza secondo le proporzioni che vuoi (per esempio valori uguali per il quadrato, più alto che largo per il 9:16).',
        },
        {
          question: 'Il ritaglio abbassa la qualità?',
          answer: 'Il ritaglio ricodifica, ma con la nostra qualità predefinita la perdita è minima.',
        },
        {
          question: 'Posso ritagliare via una filigrana?',
          answer: 'Sì, se la filigrana è vicino a un bordo: ritaglia il fotogramma in modo da escluderla.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Il ritaglio ricodifica; l\'output MP4 usa H.264 + AAC + yuv420p + faststart.',
        ],
      },
      related: [
        {
          label: 'Ridimensiona video',
          to: '/tools/resize-video',
          description: 'Cambia la risoluzione invece di ritagliare.',
        },
        {
          label: 'Ruota video',
          to: '/tools/rotate-video',
          description: 'Correggi i video di traverso o capovolti.',
        },
        {
          label: 'Convertitore video',
          to: '/tools/video-converter',
          description: 'Converti tra formati video.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso del video ritagliato.',
        },
      ],
      embed: {
        title: 'Ritaglia un video',
        description: 'Carica un video e inserisci il rettangolo da conservare (scostamento + larghezza/altezza in pixel). Ritagliamo esattamente quell\'area ed esportiamo in MP4.',
      },
    },
    'resize-video': {
      name: 'Ridimensiona video',
      h1: 'Ridimensiona video online gratis',
      tagline: 'Cambia la risoluzione di un video: scala a 1080p, 720p, 480p o a qualsiasi larghezza e altezza personalizzate.',
      metaTitle: 'Ridimensiona video online gratis | Media Manipulator',
      metaDescription: 'Strumento online gratuito per ridimensionare i video. Cambia la risoluzione di un video a 1080p, 720p, 480p o a una dimensione personalizzata. Output MP4, senza filigrana né registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Ridimensiona video online gratis',
      ogDescription: 'Cambia la risoluzione di un video a 1080p, 720p, 480p o a una dimensione personalizzata. Gratis, senza filigrana.',
      intro: 'Il ridimensionamento cambia la risoluzione di un video: porta una clip 4K a 1080p, riducila a 720p per il web o raggiungi la dimensione esatta in pixel richiesta da una piattaforma. Lo strumento di ridimensionamento video di Media Manipulator scala il tuo video alle dimensioni che scegli, mantenendo le proporzioni per impostazione predefinita, ed esporta un MP4 pulito.',
      whatItDoes: [
        'Scala un video a una larghezza e/o altezza di destinazione.',
        'Mantiene le proporzioni per impostazione predefinita (lascia vuota una dimensione per scalare automaticamente).',
        'Riduce la risoluzione per alleggerire il file o la aumenta per raggiungere una dimensione di destinazione.',
        'Esporta MP4 (H.264 + AAC) per impostazione predefinita.',
      ],
      flowSteps: [
        {
          title: 'Carica il tuo video',
          description: 'Scegli la clip che vuoi a una dimensione diversa.',
        },
        {
          title: 'Imposta la dimensione',
          description: 'Inserisci una larghezza e/o un\'altezza in pixel.',
        },
        {
          title: 'Ridimensiona',
          description: 'FFmpeg scala il video e lo ricodifica.',
        },
        {
          title: 'Scarica',
          description: 'Salva il video ridimensionato.',
        },
      ],
      advancedDetails: [
        'Lascia vuota una dimensione per scalare in proporzione e mantenere le proporzioni originali.',
        'Tieni attivo "Mantieni il rapporto d\'aspetto" per adattare il video al riquadro senza deformarlo quando sono impostate entrambe le dimensioni.',
        'Il ridimensionamento ricodifica; l\'output MP4 usa H.264 + AAC + yuv420p + faststart. Massimo 4096 px per lato.',
      ],
      whyItMatters: [
        'Una risoluzione più bassa significa file più piccoli e caricamenti più rapidi.',
        'Alcune piattaforme richiedono una risoluzione esatta.',
        'Il ridimensionamento uniforma una libreria con risoluzioni miste.',
      ],
      useCases: [
        {
          title: 'Riduci per il web',
          description: 'Passa da 4K a 1080p o 720p per pagine più veloci.',
        },
        {
          title: 'Raggiungi una dimensione precisa',
          description: 'Rispetta esattamente le specifiche di una piattaforma.',
        },
        {
          title: 'Riduci il peso del file',
          description: 'Abbassa la risoluzione per tagliare i byte.',
        },
        {
          title: 'Uniforma le riprese',
          description: 'Porta le clip a un\'unica risoluzione.',
        },
      ],
      whyMediaManipulator: [
        'Scalatura lato server con FFmpeg che rispetta il rapporto d\'aspetto.',
        'Output MP4 pulito, senza filigrana.',
      ],
      privacyNote: 'Il tuo video viene scalato alla larghezza e all\'altezza che hai impostato e ricodificato da FFmpeg sul nostro server. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Il file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'Come ridimensiono un video?',
          answer: 'Caricalo, imposta una larghezza e/o un\'altezza di destinazione e scarica il video ridimensionato.',
        },
        {
          question: 'Come cambio la risoluzione a 720p?',
          answer: 'Imposta l\'altezza a 720 e lascia vuota la larghezza per scalare in proporzione.',
        },
        {
          question: 'Il ridimensionamento mantiene le proporzioni?',
          answer: 'Sì: lascia vuota una dimensione, oppure tieni attivo "Mantieni il rapporto d\'aspetto" così il video non viene deformato.',
        },
        {
          question: 'Posso aumentare la risoluzione di un video?',
          answer: 'Puoi scalarlo a una dimensione maggiore, ma l\'upscaling non può aggiungere dettagli che non sono stati catturati.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Il ridimensionamento ricodifica; l\'output MP4 usa H.264 + AAC + yuv420p + faststart. Massimo 4096 px per lato.',
        ],
      },
      related: [
        {
          label: 'Ritaglia video',
          to: '/tools/crop-video',
          description: 'Elimina i bordi invece di scalare.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso del file con i preset.',
        },
        {
          label: 'Convertitore video',
          to: '/tools/video-converter',
          description: 'Converti in MP4.',
        },
        {
          label: 'Ruota video',
          to: '/tools/rotate-video',
          description: 'Correggi l\'orientamento.',
        },
      ],
      embed: {
        title: 'Ridimensiona un video',
        description: 'Carica un video e imposta una larghezza e/o un\'altezza di destinazione. Lasciane una vuota per scalare in proporzione. L\'output è MP4 per impostazione predefinita.',
      },
    },
    'rotate-video': {
      name: 'Ruota video',
      h1: 'Ruota video online gratis',
      tagline: 'Correggi i video di traverso o capovolti: ruota di 90°, 180° o 270° e rifletti con un clic.',
      metaTitle: 'Ruota video online gratis | Media Manipulator',
      metaDescription: 'Rotatore video online gratuito. Ruota un video di 90°, 180° o 270° e correggi le clip di traverso o capovolte. Output MP4, senza filigrana né registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Ruota video online gratis',
      ogDescription: 'Ruota un video di 90°, 180° o 270° per correggere riprese di traverso o capovolte. Gratis, senza filigrana.',
      intro: 'I video del telefono spesso vengono registrati di traverso, e alcune clip finiscono capovolte. Il rotatore video di Media Manipulator corregge l\'orientamento una volta per tutte: scegli 90°, 180° o 270° e noi ruotiamo i fotogrammi veri e propri (scambiando larghezza e altezza per 90°/270°), così il video si riproduce nel verso giusto su ogni lettore, non solo su quelli che leggono il flag di rotazione.',
      whatItDoes: [
        'Ruota un video di 90° in senso orario, di 180° o di 270° (90° in senso antiorario).',
        'Facoltativamente riflette il video in orizzontale o in verticale (effetto specchio).',
        'Ricodifica in modo che la rotazione sia impressa nei fotogrammi, non solo in un flag nei metadati.',
        'Esporta in MP4 (H.264 + AAC) per impostazione predefinita.',
      ],
      flowSteps: [
        {
          title: 'Carica il tuo video',
          description: 'Per esempio una clip del telefono registrata di traverso.',
        },
        {
          title: 'Scegli una rotazione',
          description: '90°, 180° o 270°, e rifletti se serve.',
        },
        {
          title: 'Ruota',
          description: 'FFmpeg ruota i fotogrammi (transpose) e ricodifica.',
        },
        {
          title: 'Scarica',
          description: 'Salva il video con l\'orientamento corretto.',
        },
      ],
      advancedDetails: [
        'Usiamo il filtro transpose di FFmpeg per 90°/270° (che scambia correttamente larghezza e altezza) e un doppio transpose per 180°.',
        'Imprimere la rotazione nei pixel risolve il problema dei lettori che ignorano il flag di rotazione del contenitore.',
        'La rotazione ricodifica; l\'output MP4 usa H.264 + AAC + yuv420p + faststart.',
      ],
      whyItMatters: [
        'I video del telefono di traverso sono uno dei fastidi più comuni quando si lavora con i video.',
        'Una rotazione impressa nei fotogrammi si riproduce correttamente ovunque, a differenza di un flag di rotazione.',
        'La riflessione corregge le riprese specchiate di selfie e webcam.',
      ],
      useCases: [
        {
          title: 'Correggi una clip di traverso',
          description: 'Ruota un video verticale del telefono perché si riproduca dritto.',
        },
        {
          title: 'Rifletti un video selfie',
          description: 'Elimina l\'effetto specchio dalle riprese della webcam o della fotocamera frontale.',
        },
        {
          title: 'Giralo di 180°',
          description: 'Correggi una registrazione capovolta.',
        },
        {
          title: 'Riorienta per il montaggio',
          description: 'Sistema l\'orientamento prima dell\'importazione.',
        },
      ],
      whyMediaManipulator: [
        'Vera rotazione dei fotogrammi (transpose), non solo un flag nei metadati.',
        'Ruota e rifletti in un unico pannello dedicato.',
      ],
      privacyNote: 'Il tuo video viene girato dell\'angolo che scegli e ricodificato da FFmpeg sul nostro server. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Il file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'Come faccio a ruotare un video?',
          answer: 'Caricalo, scegli 90°, 180° o 270° e scarica il video ruotato.',
        },
        {
          question: 'Come correggo un video del telefono registrato di traverso?',
          answer: 'Ruotalo di 90° in senso orario o antiorario finché non si riproduce dritto; la rotazione viene impressa nei fotogrammi.',
        },
        {
          question: 'Ruota davvero i fotogrammi o imposta solo un flag?',
          answer: 'Ruota i fotogrammi veri e propri (transpose di FFmpeg), così il video è dritto su ogni lettore.',
        },
        {
          question: 'Posso anche riflettere / specchiare il video?',
          answer: 'Sì: sono incluse le opzioni di riflessione orizzontale e verticale.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'La rotazione ricodifica tramite il filtro transpose di FFmpeg; l\'output MP4 usa H.264 + AAC + yuv420p + faststart.',
        ],
      },
      related: [
        {
          label: 'Ritaglia video',
          to: '/tools/crop-video',
          description: 'Taglia via i bordi.',
        },
        {
          label: 'Ridimensiona video',
          to: '/tools/resize-video',
          description: 'Cambia la risoluzione.',
        },
        {
          label: 'Convertitore video',
          to: '/tools/video-converter',
          description: 'Converti tra formati video.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso del video ruotato.',
        },
      ],
      embed: {
        title: 'Ruota un video',
        description: 'Carica un video e scegli una rotazione (90°, 180° o 270°). Puoi anche rifletterlo. Ruotiamo i fotogrammi veri e propri ed esportiamo in MP4.',
      },
    },
    'remove-audio-from-video': {
      name: 'Rimuovi l\'audio da un video',
      h1: 'Rimuovi l\'audio da un video online gratis',
      tagline: 'Silenzia un video per sempre: elimina la traccia audio e scarica un file muto, solo video.',
      metaTitle: 'Rimuovi l\'audio da un video online gratis | Media Manipulator',
      metaDescription: 'Strumento online gratuito per rimuovere l\'audio da un video. Elimina il sonoro e scarica un MP4 muto, solo video. Senza filigrana né registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ogTitle: 'Rimuovi l\'audio da un video online gratis',
      ogDescription: 'Elimina la traccia audio da un video e scarica un file muto, solo video. Gratis, senza filigrana.',
      intro: 'Rimuovere l\'audio da un video ti dà un file muto, solo video: comodo per silenziare il rumore di fondo, togliere la musica protetta da copyright prima di ricaricare il video, o preparare una clip a cui aggiungerai un nuovo audio. Media Manipulator elimina la traccia audio e restituisce il video, copiando il flusso dell\'immagine dove possibile, così non c\'è perdita di qualità.',
      whatItDoes: [
        'Rimuove (silenzia) la traccia audio e restituisce un file solo video.',
        'Copia il flusso video dove possibile: nessuna ricodifica, nessuna perdita di qualità.',
        'Ricorre a una ricodifica quando il contenitore o il codec lo richiedono.',
        'Output in MP4 per impostazione predefinita (disponibile anche WebM).',
      ],
      flowSteps: [
        {
          title: 'Carica il tuo video',
          description: 'La clip di cui vuoi eliminare il sonoro.',
        },
        {
          title: 'Scegli il formato di output',
          description: 'MP4 (predefinito) o WebM.',
        },
        {
          title: 'Rimuovi l\'audio',
          description: 'FFmpeg scarta l\'audio e mantiene il video.',
        },
        {
          title: 'Scarica',
          description: 'Salva il file muto, solo video.',
        },
      ],
      advancedDetails: [
        'Copiamo il flusso video (`-c:v copy -an`) così l\'immagine resta intatta; se il contenitore non accetta il codec di origine, ricodifichiamo in H.264.',
        'L\'output non ha alcuna traccia audio: è muto, non semplicemente abbassato a volume zero.',
        'Il nome del file scaricato ha il suffisso `_silent`, così puoi distinguerlo dall\'originale.',
      ],
      whyItMatters: [
        'Silenziare elimina per sempre rumore di fondo, chiacchiere o vento.',
        'Togliere la musica protetta da copyright evita le rimozioni quando ricarichi il video.',
        'Una clip di base muta è il punto di partenza per aggiungere un nuovo audio o una voce fuori campo.',
      ],
      useCases: [
        {
          title: 'Silenzia il rumore di fondo',
          description: 'Rimuovi i suoni indesiderati da una clip.',
        },
        {
          title: 'Togli l\'audio protetto da copyright',
          description: 'Elimina la musica prima di ripubblicare.',
        },
        {
          title: 'Prepara per un nuovo audio',
          description: 'Ottieni una base muta a cui aggiungere una voce fuori campo.',
        },
        {
          title: 'Privacy',
          description: 'Rimuovi una conversazione catturata in sottofondo.',
        },
      ],
      whyMediaManipulator: [
        'Copia del flusso video che preserva la qualità.',
        'Output davvero muto (traccia audio rimossa, non solo abbassata).',
      ],
      privacyNote: 'La traccia audio del tuo video viene scartata da FFmpeg sul nostro server e l\'immagine viene mantenuta. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Il file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'Come faccio a rimuovere l\'audio da un video?',
          answer: 'Carica il video, scegli un formato di output e scarica il file muto, solo video.',
        },
        {
          question: 'Questo strumento silenzia il video o rimuove la traccia?',
          answer: 'Rimuove completamente la traccia audio, quindi il risultato è davvero muto e non semplicemente abbassato a zero.',
        },
        {
          question: 'La qualità del video cambierà?',
          answer: 'No: copiamo il flusso video dove possibile, così l\'immagine resta intatta.',
        },
        {
          question: 'Perché il file si chiama "_silent"?',
          answer: 'Aggiungiamo il suffisso _silent così puoi distinguere la copia senza audio dall\'originale.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Il flusso video viene copiato dove possibile; la traccia audio viene rimossa completamente. Suffisso del download: _silent.',
        ],
      },
      related: [
        {
          label: 'Rimuovi l\'audio (solo video)',
          to: '/tools/extract-video-only-from-video',
          description: 'Lo stesso strumento per ottenere un video muto.',
        },
        {
          label: 'Estrai l\'audio da un video',
          to: '/tools/extract-audio-from-video',
          description: 'Salva l\'audio invece di rimuoverlo.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso del video muto.',
        },
        {
          label: 'Aggiungi audio a un video',
          to: '/tools/stitch-audio-to-video',
          description: 'Aggiungi una nuova colonna sonora alla clip muta.',
        },
      ],
      embed: {
        title: 'Rimuovi l\'audio da un video',
        description: 'Carica un video e noi eliminiamo la traccia audio, restituendo un file muto, solo video. L\'output è MP4 per impostazione predefinita. Copiamo il flusso video dove possibile (nessuna perdita di qualità).',
      },
    },
    'audio-converter': {
      name: 'Convertitore audio',
      h1: 'Convertitore audio online gratuito',
      tagline: 'Converti tra MP3, WAV, M4A, OGG, FLAC, OPUS e altro ancora, con pieno controllo su bitrate, frequenza di campionamento e canali.',
      metaTitle: 'Convertitore audio online gratuito | Media Manipulator',
      metaDescription: 'Convertitore audio online gratuito per MP3, WAV, M4A, OGG, FLAC, OPUS e altro ancora. Scegli bitrate, frequenza di campionamento e canali.',
      ogTitle: 'Convertitore audio online gratuito',
      ogDescription: 'Converti WAV, MP3, M4A, OGG, FLAC, OPUS e altro ancora. Scegli bitrate, frequenza di campionamento e canali.',
      intro: 'Dispositivi, piattaforme di podcast ed editor audio diversi vogliono formati diversi. Media Manipulator gestisce ogni formato audio comune in un unico posto, con un controllo preciso su bitrate, frequenza di campionamento e disposizione dei canali.',
      whatItDoes: [
        'Converte tra MP3, WAV, M4A/AAC, OGG, FLAC, ALAC, OPUS, AC3 e DTS.',
        'Scegli bitrate, frequenza di campionamento e disposizione dei canali.',
        'Taglia e applica equalizzazione, riduzione del rumore o pulizia con IA nello stesso caricamento.',
        'Produce file validi, con tag ID3 dove applicabile.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'audio',
          description: 'MP3, WAV, M4A, FLAC, OGG e altro ancora.',
        },
        {
          title: 'Scegli il formato di output',
          description: 'MP3, WAV, FLAC, M4A, OGG, OPUS.',
        },
        {
          title: 'Regola bitrate e frequenza',
          description: 'Taglia o esegui la pulizia con IA.',
        },
        {
          title: 'Scarica',
          description: 'Salva l\'audio convertito.',
        },
      ],
      advancedDetails: [
        'MP3 è il formato compresso universale: ogni dispositivo lo riproduce.',
        'FLAC e ALAC sono senza perdita: più grandi dell\'MP3, più piccoli del WAV.',
        'OPUS (in OGG) è il formato lossy moderno più compatto per voce e musica: ottimo quando sei tu a controllare il lettore.',
      ],
      whyItMatters: [
        'Piattaforme di podcast, servizi musicali ed editor audio preferiscono ciascuno formati diversi.',
        'File più piccoli significano meno spazio occupato e consegna più veloce.',
        'I formati senza perdita sono fondamentali quando l\'audio verrà rimontato.',
      ],
      useCases: [
        {
          title: 'Pubblicazione di podcast',
          description: 'Master WAV → episodio MP3.',
        },
        {
          title: 'Condivisione di note vocali',
          description: 'Taglia e comprimi in MP3.',
        },
        {
          title: 'Archiviazione musicale',
          description: 'Converti MP3 → FLAC (nessun guadagno di qualità) o WAV → FLAC per un\'archiviazione senza perdita.',
        },
        {
          title: 'Risorse per giochi e app',
          description: 'Converti WAV → OPUS per risorse mobile leggerissime.',
        },
      ],
      whyMediaManipulator: [
        'Pieno controllo su bitrate, frequenza di campionamento e canali.',
        'Strumenti di pulizia con IA (riduzione del rumore, isolamento della voce, rimozione della voce) nello stesso caricamento.',
        'Gratis, senza registrazione, senza filigrane.',
      ],
      privacyNote: 'Il tuo audio viene decodificato e ricodificato da FFmpeg sul nostro server nel formato e al bitrate che scegli. Nessun servizio audio esterno è coinvolto. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Ottieni un nuovo file; il caricamento in sé non viene modificato.',
      faq: [
        {
          question: 'Qual è il formato migliore per la musica?',
          answer: 'FLAC per l\'archiviazione senza perdita, MP3 a 256–320 kbps per la condivisione, OPUS per il file in streaming più piccolo.',
        },
        {
          question: 'Qual è il formato migliore per la voce?',
          answer: 'MP3 a 96–128 kbps è un\'ottima impostazione predefinita per i podcast.',
        },
        {
          question: 'Posso tagliare durante la conversione?',
          answer: 'Sì: imposta i secondi di inizio e fine nella sezione di taglio prima di inviare.',
        },
        {
          question: 'FLAC è davvero senza perdita?',
          answer: 'Sì: FLAC comprime senza scartare alcun dato. La decodifica restituisce una copia bit per bit identica all\'input.',
        },
      ],
      related: [
        {
          label: 'Converti WAV in MP3',
          to: '/tools/convert-wav-to-mp3',
          description: 'Convertitore dedicato WAV → MP3.',
        },
        {
          label: 'Isola la voce da una canzone',
          to: '/tools/isolate-vocals-from-song',
          description: 'Estrai la voce dalle tracce musicali.',
        },
        {
          label: 'Tutorial del convertitore audio',
          to: '/tutorials/audio/getting-started',
          description: 'Guida completa a ogni opzione.',
        },
      ],
      embed: {
        title: 'Converti un file audio',
        description: 'Carica qualsiasi file audio e scegli il formato di destinazione. Un MP3 a 192 kbps è un\'impostazione predefinita ragionevole. WAV è senza perdita ma pesante; M4A/AAC è una buona scelta compressa per la musica.',
      },
    },
    'srt-generator': {
      name: 'Generatore di sottotitoli SRT',
      h1: 'Generatore SRT gratuito',
      tagline: 'Carica un file video o audio e genera un file di sottotitoli .srt scaricabile, pronto per YouTube, gli editor e gli strumenti di accessibilità.',
      metaTitle: 'Generatore SRT online gratis: da video e audio a SRT | Media Manipulator',
      metaDescription: 'Genera file di sottotitoli SRT da MP4, MOV, MP3, WAV e altro ancora. Gratis, senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Funziona con YouTube, Premiere e DaVinci Resolve.',
      ogTitle: 'Generatore SRT gratuito: da video e audio a SRT',
      ogDescription: 'Genera file di sottotitoli SRT precisi da qualsiasi video o audio. Trascrizione con IA locale, senza fornitori di terze parti.',
      intro: 'SRT (SubRip) è il formato di sottotitoli più supportato su internet: YouTube, Vimeo, Premiere, DaVinci Resolve, Final Cut e quasi tutte le piattaforme social lo accettano. Media Manipulator ti permette di generare un file SRT da qualsiasi video o audio con un solo caricamento. La trascrizione gira sul nostro server GPU con whisper-ctranslate2, quindi l\'audio non lascia mai la nostra infrastruttura e non passa mai da un fornitore di IA di terze parti.',
      whatItDoes: [
        'Trascrive qualsiasi file video o audio in un file di sottotitoli .srt con codici temporali.',
        'Usa whisper-ctranslate2 sul nostro server GPU locale: nessun fornitore di IA di terze parti vede i tuoi file.',
        'Produce file in formato SubRip (timestamp HH:MM:SS,mmm, battute numerate in sequenza) compatibili con tutti i principali editor e lettori video.',
        'Supporta il rilevamento automatico della lingua oppure un suggerimento di lingua BCP-47 facoltativo per una maggiore precisione sulle clip brevi.',
      ],
      flowSteps: [
        {
          title: 'Carica il tuo file',
          description: 'Trascina qualsiasi file MP4, MOV, MP3, WAV o un altro formato supportato.',
        },
        {
          title: 'Estraiamo l\'audio',
          description: 'FFmpeg estrae la traccia audio e la converte nel formato che whisper si aspetta.',
        },
        {
          title: 'Whisper trascrive',
          description: 'Il nostro server GPU esegue whisper-ctranslate2 per produrre segmenti con i tempi.',
        },
        {
          title: 'Scarica il file .srt',
          description: 'Viene generato un file SubRip pulito, con battute in sequenza e tempi precisi.',
        },
      ],
      advancedDetails: [
        'Whisper gira sul nostro server con GPU NVIDIA tramite ctranslate2: non c\'è alcuna API esterna nel processo.',
        'L\'output SRT usa timestamp con i millisecondi separati da virgola (00:00:01,234) e numeri di battuta sequenziali a partire da 1, il formato che massimizza la compatibilità con gli editor.',
        'La pipeline di trascrizione supporta il rilevamento automatico della lingua oppure un suggerimento BCP-47 facoltativo in stile WHISPER_CT2_LANGUAGE tramite il campo lingua.',
        'Gli output passano dallo stesso sistema di lavori del resto dell\'app: dal modulo di trascrizione puoi anche scegliere VTT, testo semplice o JSON strutturato.',
      ],
      whyItMatters: [
        'YouTube, Vimeo, Premiere, DaVinci Resolve, Final Cut e la maggior parte delle piattaforme social accettano SRT come formato di sottotitoli predefinito.',
        'I sottotitoli rendono i video accessibili agli spettatori sordi e con problemi di udito e aumentano il coinvolgimento sulle piattaforme social, dove la maggior parte dei video viene riprodotta senza audio.',
        'I motori di ricerca possono indicizzare il contenuto della trascrizione dei tuoi video quando pubblichi insieme a loro un file .srt corrispondente.',
      ],
      useCases: [
        {
          title: 'Creator di YouTube',
          description: 'Genera sottotitoli precisi e caricali come traccia SRT su ogni video.',
        },
        {
          title: 'Produttori di corsi',
          description: 'Aggiungi le trascrizioni ai video delle lezioni così gli studenti possono cercarle, rivederle e tradurle in seguito.',
        },
        {
          title: 'Podcaster che ripubblicano in video',
          description: 'Trasforma gli episodi del podcast in clip video sottotitolate per le piattaforme social.',
        },
        {
          title: 'Team marketing / social',
          description: 'Sottotitola ogni clip così chi guarda in riproduzione automatica senza audio riceve comunque il messaggio.',
        },
      ],
      whyMediaManipulator: [
        'Whisper gira sulla nostra infrastruttura GPU: i tuoi file non toccano mai un fornitore di IA di terze parti.',
        'Senza registrazione, senza filigrane. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
        'Lo stesso motore di trascrizione usato dal resto dell\'app, quindi la precisione è coerente tra gli output SRT, VTT, testo semplice e JSON.',
      ],
      privacyNote: 'Il parlato del tuo file viene trascritto da Whisper sul nostro server GPU e sincronizzato in un file di sottotitoli SRT. Il lavoro di IA gira su hardware gestito da noi, mai su un fornitore di IA di terze parti, e nulla di ciò che carichi viene usato per addestrare un modello. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      faq: [
        {
          question: 'Che cos\'è un file SRT?',
          answer: 'SRT (SubRip) è un file di sottotitoli in testo semplice con timestamp e numeri di battuta. È il formato di sottotitoli predefinito accettato da YouTube, dalla maggior parte degli editor video e dalla maggior parte dei lettori video.',
        },
        {
          question: 'Posso generare sottotitoli da un MP4?',
          answer: 'Sì. Carica qualsiasi MP4 (o MOV, MKV, WebM, AVI, M4V) e produrremo un file di sottotitoli .srt scaricabile.',
        },
        {
          question: 'Posso usare il file SRT su YouTube?',
          answer: 'Sì: YouTube accetta SRT direttamente. Carica il tuo video, poi aggiungi il file dei sottotitoli in Sottotitoli → Aggiungi lingua → Carica file.',
        },
        {
          question: 'Quali lingue sono supportate?',
          answer: 'Whisper supporta decine di lingue e può rilevare automaticamente la lingua parlata. Puoi anche passare un suggerimento BCP-47 (per es. en, es, ja) per una maggiore precisione sulle clip molto brevi.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'La trascrizione gira sul nostro server GPU locale: il tuo file non viene mai inviato a un fornitore di IA esterno.',
          'Per i video lunghi il lavoro viene eseguito in modo asincrono e puoi tenere la scheda aperta per seguire l\'avanzamento.',
        ],
      },
      related: [
        {
          label: 'Traduttore di sottotitoli',
          to: '/tools/caption-translator',
          description: 'Traduci l\'SRT generato in altre lingue.',
        },
        {
          label: 'Estrai l\'audio da un video',
          to: '/tools/extract-audio-from-video',
          description: 'Estrai l\'audio prima di trascrivere manualmente.',
        },
        {
          label: 'Estrai i fotogrammi da un video',
          to: '/tools/extract-frames-from-video',
          description: 'Cattura immagini fisse per miniature e riferimento.',
        },
        {
          label: 'Transcodifica video in HLS',
          to: '/tools/transcode-to-hls',
          description: 'Prepara il tuo video per lo streaming.',
        },
        {
          label: 'Transcodifica video in DASH',
          to: '/tools/transcode-to-dash',
          description: 'Pacchettizzazione DASH AV1 / VP9.',
        },
      ],
      embed: {
        title: 'Genera un file di sottotitoli SRT',
        description: 'Carica un file video o audio. Lo trascriviamo sul nostro server GPU con whisper-ctranslate2 e restituiamo un file di sottotitoli .srt che puoi inserire in qualsiasi editor video.',
      },
    },
    'caption-translator': {
      name: 'Traduttore di sottotitoli',
      h1: 'Traduttore di sottotitoli gratuito',
      tagline: 'Traduci i file di sottotitoli SRT e VTT mantenendo tempi, ordine e struttura delle battute, senza alcun fornitore di IA di terze parti.',
      metaTitle: 'Traduttore di sottotitoli gratuito (SRT e VTT): tempi intatti | Media Manipulator',
      metaDescription: 'Traduci online sottotitoli SRT e VTT mantenendo esattamente i tempi delle battute. Gira sul nostro server IA locale: i tuoi sottotitoli non vengono mai inviati a fornitori di terze parti.',
      ogTitle: 'Traduttore di sottotitoli gratuito: SRT e VTT',
      ogDescription: 'Traduci sottotitoli SRT o VTT preservando timestamp e ordine delle battute. IA locale, senza fornitori di terze parti.',
      intro: 'Traduci file di sottotitoli esistenti da una lingua all\'altra senza mai toccare i tempi delle battute. Media Manipulator analizza le battute del tuo file .srt o .vtt, traduce solo il testo con il nostro modello di traduzione per sottotitoli ospitato in locale e riscrive alla lettera i timestamp originali. Nessuna API di traduzione di terze parti vede i tuoi sottotitoli: il modello gira sul nostro server GPU.',
      whatItDoes: [
        'Accetta file di sottotitoli .srt o .vtt e produce una copia tradotta nello stesso formato (o nell\'altro, se lo scegli).',
        'Preserva esattamente numeri, ordine e timestamp delle battute: viene tradotto solo il testo.',
        'Esegue la traduzione sul nostro server di modelli Ollama locale con un modello personalizzato ottimizzato per i sottotitoli: i tuoi sottotitoli non lasciano mai la nostra infrastruttura.',
        'Supporta oltre 30 lingue di destinazione, tra cui le principali lingue europee, asiatiche e mediorientali.',
      ],
      flowSteps: [
        {
          title: 'Carica il file .srt o .vtt',
          description: 'Trascina il tuo file di sottotitoli esistente nell\'area di caricamento.',
        },
        {
          title: 'Scegli le lingue',
          description: 'Rileva automaticamente o scegli una lingua di origine, poi scegli una lingua di destinazione.',
        },
        {
          title: 'Traduciamo il testo delle battute',
          description: 'La nostra IA locale traduce solo il testo dei sottotitoli: timestamp e ordine restano bloccati.',
        },
        {
          title: 'Scarica i sottotitoli tradotti',
          description: 'Ricevi un file .srt o .vtt pulito con tempi identici e una copia tradotta di ogni battuta.',
        },
      ],
      advancedDetails: [
        'La traduzione gira sul nostro server Ollama con un derivato di Translate-Gemma ottimizzato per i sottotitoli (mm-captions-translategemma-12b).',
        'Inviamo al modello solo il testo delle battute più un\'intestazione con uno schema JSON rigoroso e, leggendo la risposta, riprendiamo i tempi dal file originale: così nemmeno un modello che si comporta male può corrompere i tempi delle tue battute.',
        'I blocchi NOTE e STYLE dei file VTT vengono preservati e non vengono mai inviati al traduttore.',
        'Per le tracce di sottotitoli lunghe raggruppiamo le battute in lotti, così il modello non si avvicina mai al suo limite di contesto.',
      ],
      whyItMatters: [
        'Tradurre i sottotitoli a mano è soggetto a errori: è facilissimo rompere la formattazione dei timestamp o riordinare le battute per sbaglio.',
        'Un traduttore pensato appositamente per i sottotitoli preserva la struttura del file che editor e lettori si aspettano.',
        'Fare la traduzione internamente su un modello locale mantiene i flussi di lavoro dei creator indipendenti dai prezzi e dalle politiche dei servizi di traduzione di terze parti.',
      ],
      useCases: [
        {
          title: 'Canali YouTube multilingue',
          description: 'Traduci un unico SRT master in inglese in 5 o più lingue per lo stesso caricamento.',
        },
        {
          title: 'Corsi online',
          description: 'Raggiungi gli studenti internazionali con sottotitoli nella loro lingua madre.',
        },
        {
          title: 'Documentari / festival cinematografici',
          description: 'Prepara le tracce di traduzione senza toccare i tempi delle battute.',
        },
        {
          title: 'Notizie e giornalismo',
          description: 'Traduci le tracce di sottotitoli delle ultime notizie mantenendo una sincronizzazione precisa.',
        },
      ],
      whyMediaManipulator: [
        'Traduzione con IA locale: i tuoi sottotitoli non vanno mai a un fornitore di IA di terze parti.',
        'Analisi sicura per i tempi, che ripristina gli istanti originali di inizio e fine delle battute anche se il modello si comporta male.',
      ],
      privacyNote: 'Viene letto solo il testo del tuo file SRT o VTT: ogni sottotitolo viene tradotto da un modello linguistico che eseguiamo sul nostro server GPU, e i tempi vengono copiati senza modifiche. Il lavoro di IA gira su hardware gestito da noi, mai su un fornitore di IA di terze parti, e nulla di ciò che carichi viene usato per addestrare un modello. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      faq: [
        {
          question: 'Posso tradurre un file SRT senza rompere i timestamp?',
          answer: 'Sì: è proprio lo scopo di questo strumento. Analizziamo le battute, traduciamo solo il testo e poi ripristiniamo esattamente i timestamp originali prima di scrivere l\'output.',
        },
        {
          question: 'Quali formati di sottotitoli sono supportati?',
          answer: 'Sono supportati sia SubRip (.srt) sia WebVTT (.vtt). Puoi mantenere per l\'output lo stesso formato dell\'input oppure convertire dall\'uno all\'altro.',
        },
        {
          question: 'Posso tradurre i sottotitoli per i video di YouTube?',
          answer: 'Sì. Genera (o esporta) un SRT dal tuo video, traducilo qui e carica il nuovo SRT come traccia in un\'altra lingua su YouTube.',
        },
        {
          question: 'I sottotitoli vengono tradotti con un fornitore di IA di terze parti?',
          answer: 'No. La traduzione gira sul nostro modello ospitato su Ollama: i tuoi sottotitoli non lasciano mai la nostra infrastruttura.',
        },
        {
          question: 'Cosa succede ai tempi delle battute?',
          answer: 'Gli istanti di inizio e fine delle battute vengono preservati esattamente: li ripristiniamo dal file originale dopo la traduzione, così nemmeno un modello che si comporta male può corrompere i tuoi tempi.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Dimensione massima del file di sottotitoli: 2 MB (le tracce di sottotitoli reali di solito restano ben al di sotto).',
        ],
        processingNotes: [
          'La traduzione gira su un modello Ollama ospitato in locale: non viene contattata alcuna API di traduzione di terze parti.',
          'I blocchi NOTE e STYLE dei file WebVTT vengono preservati così come sono.',
        ],
      },
      related: [
        {
          label: 'Generatore di sottotitoli SRT',
          to: '/tools/srt-generator',
          description: 'Genera un nuovo SRT da un file video o audio.',
        },
        {
          label: 'Estrai l\'audio da un video',
          to: '/tools/extract-audio-from-video',
          description: 'Estrai l\'audio per una revisione o una nuova trascrizione.',
        },
        {
          label: 'Aggiungi audio a un video',
          to: '/tools/stitch-audio-to-video',
          description: 'Aggiungi una voce fuori campo tradotta dopo aver tradotto i sottotitoli.',
        },
        {
          label: 'Transcodifica video in HLS',
          to: '/tools/transcode-to-hls',
          description: 'Impacchetta il tuo video per lo streaming.',
        },
        {
          label: 'Transcodifica video in DASH',
          to: '/tools/transcode-to-dash',
          description: 'Pacchettizzazione DASH AV1 / VP9.',
        },
      ],
      embed: {
        title: 'Traduci un file di sottotitoli SRT o VTT',
        description: 'Carica un file .srt o .vtt esistente, scegli una lingua di destinazione e ricevi un file di sottotitoli tradotto con i tempi originali delle battute preservati esattamente.',
      },
    },
    'audio-waveform-generator': {
      name: 'Generatore di forme d\'onda audio',
      h1: 'Generatore di forme d\'onda audio gratuito',
      tagline: 'Trasforma qualsiasi file audio in un video con forma d\'onda configurabile, in un\'immagine della forma d\'onda o in entrambi: perfetto per podcast, anteprime musicali e clip social.',
      metaTitle: 'Generatore di forme d\'onda audio: video e immagini | Media Manipulator',
      metaDescription: 'Genera video e immagini con forma d\'onda da qualsiasi file audio. Strisce larghe 10:1 per podcast, anteprime quadrate per i social, canali stereo separati, colori personalizzati e altro ancora.',
      ogTitle: 'Generatore di forme d\'onda audio gratuito',
      ogDescription: 'Genera video e immagini con forma d\'onda da MP3, WAV, M4A, FLAC e altro ancora. Altamente configurabile, senza registrazione.',
      intro: 'Una forma d\'onda rende visibile l\'audio: una risorsa fondamentale per podcast, anteprime musicali, miniature di clip social e timeline di montaggio. Media Manipulator disegna le forme d\'onda con i filtri showwaves / showwavespic di FFmpeg, con impostazioni predefinite sensate (una striscia larga 10:1 a 1600×160) e un pannello avanzato completo per regolare modalità di disegno, colore, scala e separazione dei canali stereo.',
      whatItDoes: [
        'Crea video con forma d\'onda animata usando il filtro showwaves di FFmpeg, con le modalità point / line / p2p / cline.',
        'Crea immagini fisse della forma d\'onda usando il filtro showwavespic di FFmpeg, perfette per miniature e copertine.',
        'Supporta i preset di proporzioni consigliati (10:1 largo, 8:1, 6:1, 16:9, 1:1) oltre a larghezza e altezza personalizzate.',
        'Disegno facoltativo a canali separati, così il canale sinistro e il destro vengono tracciati con colori diversi.',
      ],
      flowSteps: [
        {
          title: 'Carica l\'audio',
          description: 'Trascina qualsiasi file MP3, WAV, M4A, AAC, FLAC o OGG.',
        },
        {
          title: 'Scegli output e dimensioni',
          description: 'Scegli video con forma d\'onda, immagine o entrambi, e scegli un preset di proporzioni o una dimensione personalizzata.',
        },
        {
          title: 'Regola l\'aspetto (facoltativo)',
          description: 'Regola modalità di disegno, frame rate, colori, scala e modalità di tracciamento nel pannello avanzato.',
        },
        {
          title: 'Scarica',
          description: 'Salva il tuo video con forma d\'onda, l\'immagine o uno .zip con entrambi.',
        },
      ],
      advancedDetails: [
        'Le modalità di disegno corrispondono direttamente alle modalità showwaves di FFmpeg: point, line, p2p, cline. Ognuna ha un\'anteprima nel modulo, così puoi scegliere a colpo d\'occhio.',
        'Puoi scegliere o il frame rate di output (rate=) o i campioni per colonna (n=), mai entrambi, come il parametro mutuamente esclusivo di FFmpeg.',
        'Le opzioni di scala (lin, log, sqrt, cbrt) ti permettono di decidere quanto devono essere visibili le sezioni silenziose.',
        'Quando richiedi sia il video sia l\'immagine, li impacchettiamo in un unico .zip: lo stesso sistema di lavori di ogni altro download di Media Manipulator.',
      ],
      whyItMatters: [
        'Le forme d\'onda rendono condivisibili i contenuti audio: una clip con una forma d\'onda in movimento rende molto meglio di una miniatura statica nei feed social in riproduzione automatica senza audio.',
        'Editor e produttori usano le forme d\'onda come risorse di riferimento quando organizzano le timeline o progettano le copertine degli album.',
        'Una forma d\'onda ben regolata è allo stesso tempo miniatura, audiogramma e teaser audio.',
      ],
      useCases: [
        {
          title: 'Podcast',
          description: 'Crea audiogrammi per i social: clip + forma d\'onda + sottotitoli = il formato promozionale per podcast che rende di più.',
        },
        {
          title: 'Anteprime musicali',
          description: 'Genera una card quadrata con forma d\'onda per Instagram o una larga per le descrizioni di YouTube.',
        },
        {
          title: 'Timeline di montaggio',
          description: 'Usa l\'immagine fissa della forma d\'onda come fotogramma di riferimento in Premiere o DaVinci Resolve.',
        },
        {
          title: 'Consegna di voci fuori campo',
          description: 'Invia ai clienti una card con forma d\'onda insieme al WAV, così possono farsi un\'idea a colpo d\'occhio.',
        },
      ],
      whyMediaManipulator: [
        'Le impostazioni predefinite puntano alla forma più utile (10:1 largo) invece del 600×240 predefinito di FFmpeg.',
        'Controlli avanzati di FFmpeg esposti in sicurezza: ogni impostazione viene convalidata sul server prima di essere passata al grafo dei filtri.',
        'Output in MP4, PNG o uno ZIP con entrambi: non serve avviare un secondo lavoro.',
      ],
      privacyNote: 'Il tuo audio viene disegnato in un\'immagine o in un video con forma d\'onda da FFmpeg sul nostro server. Nessun servizio audio esterno è coinvolto. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Ottieni un nuovo file; il caricamento in sé non viene modificato.',
      faq: [
        {
          question: 'Che cos\'è una forma d\'onda audio?',
          answer: 'Una forma d\'onda è la rappresentazione visiva dell\'ampiezza di un segnale audio nel tempo. È la linea in movimento che vedi negli editor video e su piattaforme come SoundCloud.',
        },
        {
          question: 'Posso creare un video con forma d\'onda da un MP3?',
          answer: 'Sì. Carica l\'MP3 (o WAV/M4A/FLAC/OGG/AAC) e lo strumento crea un video con forma d\'onda usando il filtro showwaves di FFmpeg.',
        },
        {
          question: 'Posso creare anche un\'immagine della forma d\'onda?',
          answer: 'Sì. Imposta l\'output su "Immagine" per un PNG/WebP fisso, oppure su "Entrambi" per ricevere uno ZIP con il video e l\'immagine.',
        },
        {
          question: 'Che dimensioni devo usare per una forma d\'onda?',
          answer: 'Per la maggior parte dei flussi di lavoro di podcast e musica il preset largo 10:1 (1600×160) è quello che rende meglio. Usa 16:9 o 1:1 se ti serve una forma adatta ai social.',
        },
        {
          question: 'Cosa significano le modalità point, line, p2p e cline?',
          answer: 'Sono le modalità di disegno showwaves di FFmpeg. Point disegna un punto per campione, line disegna una barra verticale, p2p collega ogni punto con una linea e cline disegna una barra verticale centrata. Il modulo mostra un\'anteprima di ciascuna.',
        },
        {
          question: 'Posso separare i canali audio sinistro e destro?',
          answer: 'Sì: attiva "Separa i canali stereo" nelle impostazioni avanzate e scegli un colore diverso per ogni canale.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Impostazione predefinita consigliata: forma d\'onda larga 10:1 (1600×160), ottima per podcast, anteprime musicali e timeline di montaggio.',
          'Quando selezioni "Entrambi", il risultato viene impacchettato in un unico ZIP con il video e l\'immagine.',
        ],
      },
      related: [
        {
          label: 'Estrai l\'audio da un video',
          to: '/tools/extract-audio-from-video',
          description: 'Estrai l\'audio da un video prima di generare una forma d\'onda.',
        },
        {
          label: 'Generatore di sottotitoli SRT',
          to: '/tools/srt-generator',
          description: 'Abbina la forma d\'onda ai sottotitoli per audiogrammi social.',
        },
        {
          label: 'Aggiungi audio a un video',
          to: '/tools/stitch-audio-to-video',
          description: 'Combina il tuo render con forma d\'onda con un altro video.',
        },
      ],
      embed: {
        title: 'Genera una forma d\'onda da un file audio',
        description: 'Carica un file audio e scegli se vuoi un video con forma d\'onda, un\'immagine della forma d\'onda o entrambi. I controlli avanzati ti permettono di regolare dimensioni, colori, modalità di disegno e comportamento stereo. L\'impostazione predefinita è un video con forma d\'onda larga 10:1, adatto a podcast e anteprime musicali.',
      },
    },
    'extract-video-only-from-video': {
      name: 'Estrai il video senza audio',
      h1: 'Estrai il video senza audio (solo video)',
      tagline: 'Esporta una copia muta, solo video, con tutte le tracce audio rimosse: perfetta per anteprime senza sonoro, B-roll, montaggi e nuove colonne sonore.',
      metaTitle: 'Estrai il video senza audio: esportazione solo video | Media Manipulator',
      metaDescription: 'Strumento online gratuito per esportare una copia solo video (muta) con tutte le tracce audio rimosse. Copia il flusso video dove possibile: nessuna ricodifica, nessuna perdita di qualità.',
      ogTitle: 'Estrai il video senza audio (solo video)',
      ogDescription: 'Esporta una copia solo video (muta) del tuo video con tutte le tracce audio rimosse. Gratis, senza registrazione. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      intro: 'A volte vuoi il video senza l\'audio: per un\'anteprima muta nel feed social, un B-roll da inserire in un nuovo montaggio o un flusso di lavoro di nuova sonorizzazione in cui aggiungerai musica nuova. Media Manipulator elimina ogni traccia audio e produce un file pulito, solo video. Il flusso video viene copiato ovunque possibile, quindi non c\'è ricodifica né perdita di qualità.',
      whatItDoes: [
        'Rimuove ogni flusso audio dal tuo video.',
        'Copia il flusso video ovunque possibile: nessuna ricodifica, nessuna perdita di qualità.',
        'Ricodifica in un H.264 baseline compatibile solo se il contenitore di destinazione lo richiede.',
        'Restituisce un MP4 (o WebM) muto che puoi inserire direttamente in un nuovo montaggio.',
      ],
      flowSteps: [
        {
          title: 'Carica il tuo video',
          description: 'Trascina qualsiasi file MP4, MOV, MKV, WebM, AVI o M4V.',
        },
        {
          title: 'Scegli il contenitore di output',
          description: 'MP4 è la scelta sicura predefinita. WebM è offerto per le sorgenti VP9/AV1.',
        },
        {
          title: 'Eliminiamo l\'audio',
          description: 'FFmpeg scarta il flusso audio e copia il flusso video quando possibile.',
        },
        {
          title: 'Scarica il video muto',
          description: 'Salva una copia pulita e senza audio del tuo video.',
        },
      ],
      advancedDetails: [
        'Il tentativo predefinito usa `-c:v copy`, quindi non avviene alcuna ricodifica: la qualità del flusso video è preservata bit per bit.',
        'Se il contenitore di destinazione rifiuta il codec di origine, ricorriamo a una ricodifica libx264 + yuv420p a CRF 20.',
        'Nessuna filigrana, nessuna sovrapposizione, nessun ridimensionamento: per impostazione predefinita l\'output visivo è identico alla sorgente.',
      ],
      whyItMatters: [
        'Il video muto è di fatto il formato standard per la riproduzione automatica sulla maggior parte delle piattaforme social.',
        'Rimuovere l\'audio è anche una misura di privacy: elimina voci e conversazioni incorporate nelle registrazioni dello schermo prima che le condividi.',
        'I montatori spesso vogliono un file pulito, solo video, per una nuova sonorizzazione o per sincronizzarlo con una registrazione audio diversa.',
      ],
      useCases: [
        {
          title: 'Anteprime social mute',
          description: 'Crea una clip pulita in riproduzione automatica per Instagram, X, LinkedIn o TikTok.',
        },
        {
          title: 'Progetti di nuova sonorizzazione',
          description: 'Elimina l\'audio originale prima di aggiungere musica o voce fuori campo.',
        },
        {
          title: 'Condivisioni delicate per la privacy',
          description: 'Rimuovi le conversazioni di sottofondo catturate durante una registrazione dello schermo.',
        },
        {
          title: 'Preparazione di B-roll',
          description: 'Inserisci una clip senza audio in un montaggio multicamera o basato su B-roll.',
        },
      ],
      whyMediaManipulator: [
        'Copia del flusso dove possibile: preserva la qualità video originale.',
        'Chiaro, veloce, senza registrazione, senza filigrane.',
        'Gratis. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
      ],
      privacyNote: 'Il tuo video viene copiato senza la sua traccia audio da FFmpeg sul nostro server. Il lavoro gira sui nostri server, non su un servizio di transcodifica di terze parti. I file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni. Il file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'Come faccio a rimuovere l\'audio da un video?',
          answer: 'Carica il tuo video e clicca su "Rimuovi l\'audio dal video". Lo strumento produce una copia solo video nel contenitore che hai scelto.',
        },
        {
          question: 'La qualità del video cambierà?',
          answer: 'No, nel caso predefinito. Copiamo il flusso video, quindi l\'output è identico bit per bit sul lato video. Ricodifichiamo solo se il contenitore di destinazione lo richiede.',
        },
        {
          question: 'Posso rendere muto un MP4?',
          answer: 'Sì: MP4 è il contenitore di output predefinito e il caso d\'uso più comune.',
        },
        {
          question: 'Il video originale viene modificato?',
          answer: 'No. Il caricamento originale resta intatto. Produciamo un nuovo file e conserviamo o eliminiamo il caricamento secondo la regola di conservazione: i file degli ospiti restano 24 ore; con un account gratuito scegli tu da 24 ore a 2 anni.',
        },
        {
          question: 'E se il mio video non ha audio?',
          answer: 'Nessun problema: lo strumento riesce normalmente e restituisce una copia pulita e reimpacchettata.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Il flusso video viene copiato senza ricodifica ovunque il contenitore di destinazione lo supporti.',
          'I video di input senza flusso audio riescono normalmente e restituiscono una copia reimpacchettata.',
        ],
      },
      related: [
        {
          label: 'Rimuovi l\'audio da un video',
          to: '/tools/remove-audio-from-video',
          description: 'La pagina semplice per silenziare / rimuovere il sonoro.',
        },
        {
          label: 'Estrai l\'audio da un video',
          to: '/tools/extract-audio-from-video',
          description: 'Estrai la traccia audio come MP3, WAV ecc.',
        },
        {
          label: 'Aggiungi audio a un video',
          to: '/tools/stitch-audio-to-video',
          description: 'Aggiungi una nuova colonna sonora al tuo video muto.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso del video muto.',
        },
        {
          label: 'Estrai i fotogrammi da un video',
          to: '/tools/extract-frames-from-video',
          description: 'Estrai immagini fisse dal video muto.',
        },
      ],
      embed: {
        title: 'Rimuovi l\'audio da un video',
        description: 'Carica il tuo video e noi produciamo una copia muta, solo video. Il flusso video viene copiato ovunque possibile, quindi non c\'è ricodifica né perdita di qualità.',
      },
    },
    'extract-frames-from-video': {
      name: 'Estrai i fotogrammi da un video',
      h1: 'Estrai i fotogrammi da un video',
      tagline: 'Estrai fotogrammi fissi da qualsiasi video, ogni N secondi, a un frame rate prefissato o in momenti precisi, e scaricali come ZIP.',
      metaTitle: 'Estrai i fotogrammi da un video: estrattore gratuito | Media Manipulator',
      metaDescription: 'Strumento online gratuito per estrarre immagini fisse da qualsiasi video. Scegli ogni N secondi, un numero di fotogrammi al secondo o istanti specifici. Output come ZIP di fotogrammi JPG, PNG o WebP.',
      ogTitle: 'Estrai i fotogrammi da un video',
      ogDescription: 'Estrai fotogrammi fissi da MP4, MOV, MKV, WebM, AVI e M4V. Scaricali come ZIP di fotogrammi JPG, PNG o WebP.',
      intro: 'L\'estrazione dei fotogrammi riporta un video a una sequenza di immagini fisse: utile per miniature, inquadrature di riferimento, mockup di design, dataset di machine learning e anteprime di animazioni o storyboard. Media Manipulator ti permette di campionare i fotogrammi ogni N secondi, a un frame rate prefissato o in istanti specifici, e raccoglie le immagini risultanti in un unico ZIP da scaricare.',
      whatItDoes: [
        'Estrae fotogrammi fissi come immagini JPG, PNG o WebP.',
        'Supporta tre modalità di campionamento: ogni N secondi, un numero prefissato di fotogrammi al secondo oppure istanti specifici.',
        'Raccoglie i fotogrammi in un unico ZIP da scaricare con un clic.',
        'Applica un limite massimo di fotogrammi, così le elaborazioni restano veloci e prevedibili.',
      ],
      flowSteps: [
        {
          title: 'Carica il tuo video',
          description: 'Trascina un file MP4, MOV, MKV, WebM, AVI o M4V qualsiasi.',
        },
        {
          title: 'Scegli una modalità di campionamento',
          description: 'Ogni N secondi, un FPS prefissato oppure un elenco di istanti separati da virgola.',
        },
        {
          title: 'Scegli il formato immagine',
          description: 'JPG per miniature compatte, PNG per fotogrammi senza perdita, WebP per file moderni più piccoli.',
        },
        {
          title: 'Scarica lo ZIP',
          description: 'Tutti i fotogrammi estratti vengono raccolti in un unico file .zip che puoi estrarre ovunque.',
        },
      ],
      advancedDetails: [
        'Le modalità ogni N secondi e FPS usano il filtro fps di FFmpeg per campionare in modo uniforme lungo tutta la timeline.',
        'La modalità a istanti esegue una chiamata FFmpeg per ogni istante richiesto, così gli errori sul singolo fotogramma (richieste fuori dalla durata, ecc.) emergono chiaramente.',
        'Il limite massimo di fotogrammi è 300 per impostazione predefinita e arriva al massimo a 1000: mantiene veloci le elaborazioni ed evita estrazioni fuori controllo.',
      ],
      whyItMatters: [
        'L\'estrazione dei fotogrammi è il modo più semplice per ricavare miniature o fotogrammi di riferimento da video già esistenti.',
        'Designer e animatori usano i fotogrammi campionati come riferimento per il disegno e come B-roll per gli storyboard.',
        'Chi lavora con il machine learning li usa per costruire dataset di classificazione o rilevamento senza bisogno di una pipeline personalizzata.',
      ],
      useCases: [
        {
          title: 'Miniature e anteprime',
          description: 'Scegli un singolo fotogramma da usare come miniatura per YouTube o Vimeo.',
        },
        {
          title: 'Riferimenti per il design',
          description: 'Campiona una sequenza di fotogrammi da un gameplay o da un\'animazione come riferimento per il disegno.',
        },
        {
          title: 'Storyboard',
          description: 'Genera una sequenza di fotogrammi chiave per presentare uno storyboard.',
        },
        {
          title: 'Dataset di machine learning',
          description: 'Costruisci rapidamente piccoli dataset di immagini da un numero ridotto di video.',
        },
      ],
      whyMediaManipulator: [
        'Tre modalità di campionamento coprono quasi ogni esigenza reale: intervallo, FPS o istanti specifici.',
        'L\'output in ZIP mantiene il download a un solo clic, indipendentemente da quanti fotogrammi hai estratto.',
        'FFmpeg lato server significa un output coerente, qualunque sia il browser o il supporto ai codec.',
      ],
      privacyNote: 'I fotogrammi vengono estratti dal tuo video, alla frequenza che scegli, da FFmpeg sul nostro server e restituiti come ZIP di immagini. L\'elaborazione avviene sui nostri server, non su un servizio di transcodifica di terze parti. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Il tuo file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'Come estraggo i fotogrammi da un video?',
          answer: 'Carica il video, scegli una modalità di campionamento (ogni N secondi è quella predefinita), scegli un formato immagine e fai clic su "Estrai fotogrammi". Il risultato è uno ZIP di immagini fisse.',
        },
        {
          question: 'Posso esportare un fotogramma ogni pochi secondi?',
          answer: 'Sì, è la modalità predefinita. Imposta "Secondi tra un fotogramma e l\'altro" sull\'intervallo che preferisci.',
        },
        {
          question: 'Quali formati immagine sono supportati?',
          answer: 'JPG (compatto, ideale per le miniature), PNG (senza perdita) e WebP (file moderni più piccoli).',
        },
        {
          question: 'Perché lo strumento restituisce un file ZIP?',
          answer: 'Anche i video brevi possono produrre decine di fotogrammi. Restituire un unico ZIP mantiene il download a un solo clic ed evita di litigare con il browser per il download di più file.',
        },
        {
          question: 'Perché esiste un limite massimo di fotogrammi?',
          answer: 'Il limite evita elaborazioni fuori controllo per sbaglio (ad esempio estrarre decine di migliaia di fotogrammi da un video lungo). Il valore predefinito è 300 e il tetto assoluto è 1000.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Il limite predefinito di fotogrammi è 300: alzalo fino a 1000 nel modulo se ti servono davvero di più.',
          'La modalità a istanti accetta un elenco di secondi separati da virgola (ad esempio "1, 5.5, 12.25, 30").',
        ],
      },
      related: [
        {
          label: 'Estrai l\'audio da un video',
          to: '/tools/extract-audio-from-video',
          description: 'Estrai l\'audio dallo stesso video.',
        },
        {
          label: 'Generatore di sottotitoli SRT',
          to: '/tools/srt-generator',
          description: 'Trascrivi lo stesso video in sottotitoli .srt.',
        },
        {
          label: 'Rimuovi l\'audio da un video',
          to: '/tools/extract-video-only-from-video',
          description: 'Elimina l\'audio per tenere una copia muta del video.',
        },
      ],
      embed: {
        title: 'Estrai i fotogrammi da un video',
        description: 'Carica un video, scegli una modalità di campionamento (ogni N secondi, a un frame rate o in istanti specifici) e scarica uno ZIP di fotogrammi fissi.',
      },
    },
    'stitch-audio-to-video': {
      name: 'Aggiungi audio a un video',
      h1: 'Aggiungi audio a un video',
      tagline: 'Combina un video di base con fino a tre file audio aggiuntivi, come voci fuori campo, musica e narrazione, e scarica un nuovo MP4.',
      metaTitle: 'Aggiungi audio a un video: voce, musica, sostituisci, mixa | Media Manipulator',
      metaDescription: 'Strumento online gratuito per aggiungere voci fuori campo, musica o narrazione a un video, o per sostituire del tutto l\'audio originale. Volume e offset per ogni traccia, output MP4.',
      ogTitle: 'Aggiungi audio a un video',
      ogDescription: 'Aggiungi voce fuori campo, musica, narrazione, oppure sostituisci l\'audio originale. Volume e offset per ogni traccia, output MP4, senza registrazione.',
      intro: 'Combinare un video di base con uno o più file audio aggiuntivi è una delle operazioni di montaggio più comuni: aggiungere una voce fuori campo, inserire una base musicale, narrare una registrazione dello schermo o sostituire del tutto l\'audio originale. Media Manipulator ti offre controlli di volume e offset per ogni traccia, un selettore mixa/sostituisci e un output MP4 che si inserisce senza problemi in qualsiasi lettore.',
      whatItDoes: [
        'Combina un video di base con fino a tre tracce audio aggiuntive.',
        'Controlli per ogni traccia: volume (0–4×), offset di inizio in secondi, ripetizione facoltativa fino alla durata del video.',
        'Selettore di modalità generale: "mixa" conserva l\'audio originale, "sostituisci" lo elimina.',
        'L\'output è sempre MP4 con audio AAC a 192 kbps, l\'impostazione predefinita che funziona ovunque.',
      ],
      flowSteps: [
        {
          title: 'Carica il video di base',
          description: 'Trascina un file MP4, MOV, MKV, WebM, AVI o M4V qualsiasi.',
        },
        {
          title: 'Aggiungi le tracce audio',
          description: 'Aggiungi fino a tre file audio (voce fuori campo, musica, narrazione) con impostazioni per ogni traccia.',
        },
        {
          title: 'Scegli tra mixa e sostituisci',
          description: 'Conserva l\'audio originale e mixa le nuove tracce, oppure elimina l\'originale e usa solo il nuovo audio.',
        },
        {
          title: 'Scarica il nuovo MP4',
          description: 'Uniamo tutto sul nostro server e restituiamo un MP4 pulito.',
        },
      ],
      advancedDetails: [
        'Il grafo dei filtri viene costruito in modo programmatico: nodi adelay + volume per ogni traccia, poi un unico amix per combinarle.',
        'Il flusso video viene copiato senza ricodifica ogni volta che è possibile: solo l\'audio viene ricodificato (in AAC a 192 kbps).',
        'La ripetizione è implementata con `-stream_loop -1` sull\'ingresso audio, così le basi musicali brevi si estendono in modo pulito fino alla durata del video.',
        'La durata dell\'output è per impostazione predefinita "taglia alla durata del video": togli la spunta se vuoi che l\'output si estenda fino all\'ingresso più lungo.',
      ],
      whyItMatters: [
        'Voce fuori campo, musica e narrazione sono le aggiunte audio più comuni nei video brevi.',
        'I controlli di volume e offset per ogni traccia ti permettono di creare un vero mix invece di una singola traccia sovrapposta.',
        'Farlo nel browser sarebbe lento e poco affidabile: FFmpeg lato server è rapido e preciso.',
      ],
      useCases: [
        {
          title: 'Video per creator',
          description: 'Aggiungi un tappeto musicale sotto un segmento parlato, oppure sostituisci l\'audio ambientale con una voce fuori campo pulita.',
        },
        {
          title: 'Tutorial',
          description: 'Sovrapponi una traccia di narrazione a una registrazione dello schermo.',
        },
        {
          title: 'Clip per i social',
          description: 'Aggiungi un brano di tendenza con un offset preciso a un montaggio di 15 secondi.',
        },
        {
          title: 'Video familiari e personali',
          description: 'Aggiungi una musica di sottofondo a un montaggio delle vacanze.',
        },
      ],
      whyMediaManipulator: [
        'Controlli di volume e offset per ogni traccia, non un semplice file audio sovrapposto.',
        'Copia il flusso video senza ricodifica dove possibile, preservando la qualità video originale.',
        'Gratuito, senza registrazione, FFmpeg lato server. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      ],
      privacyNote: 'Il tuo video e il file audio che aggiungi vengono uniti in un unico MP4 da FFmpeg sul nostro server. L\'elaborazione avviene sui nostri server, non su un servizio di transcodifica di terze parti. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni. Il tuo file di origine resta intatto e il risultato è un nuovo file.',
      faq: [
        {
          question: 'Posso aggiungere musica a un video?',
          answer: 'Sì: aggiungi il file musicale come traccia audio, imposta il suo volume e lascia la modalità su "mixa" per conservare l\'audio originale sotto.',
        },
        {
          question: 'Posso aggiungere una voce fuori campo e conservare l\'audio originale?',
          answer: 'Sì: lascia la modalità su "mixa", aggiungi la voce fuori campo e abbassa l\'audio originale impostando un volume basso sulle tracce aggiuntive se vuoi che la voce resti in primo piano.',
        },
        {
          question: 'Posso sostituire la traccia audio originale?',
          answer: 'Sì: imposta la modalità su "sostituisci" e l\'audio originale viene eliminato. Solo le tracce aggiunte vengono mixate nell\'output.',
        },
        {
          question: 'Cosa succede se l\'audio è più lungo del video?',
          answer: 'Per impostazione predefinita tagliamo alla durata del video. Togli la spunta a "Taglia alla durata del video" se vuoi che l\'output si estenda fino all\'ingresso più lungo.',
        },
        {
          question: 'Posso regolare il volume dell\'audio aggiunto?',
          answer: 'Sì: ogni traccia aggiunta ha un proprio moltiplicatore di volume (0–4×) e un offset di inizio in secondi.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Massimo 3 tracce audio aggiunte per ogni elaborazione.',
        ],
        processingNotes: [
          'Il flusso video viene copiato senza ricodifica dove possibile: solo l\'audio viene ricodificato (in AAC a 192 kbps).',
          'La casella di ripetizione estende le basi musicali brevi fino alla durata del video.',
        ],
      },
      related: [
        {
          label: 'Estrai l\'audio da un video',
          to: '/tools/extract-audio-from-video',
          description: 'Estrai l\'audio da un video per riusarlo in un altro.',
        },
        {
          label: 'Rimuovi l\'audio da un video',
          to: '/tools/extract-video-only-from-video',
          description: 'Elimina l\'audio per preparare una base pulita da musicare di nuovo.',
        },
        {
          label: 'Generatore di forme d\'onda audio',
          to: '/tools/audio-waveform-generator',
          description: 'Crea un accompagnamento visivo per la tua traccia audio.',
        },
      ],
      embed: {
        title: 'Aggiungi o sostituisci la traccia audio di un video',
        description: 'Carica un video di base, aggiungi da uno a tre file audio, imposta volume e offset per ogni traccia e scegli "mixa" o "sostituisci". Restituiamo un MP4 con tutto combinato.',
      },
    },
    'ai-frame-interpolation': {
      name: 'Interpolazione di fotogrammi con IA',
      h1: 'Strumento di interpolazione IA dei fotogrammi',
      tagline: 'Aumenta il frame rate di un video a 48, 60 o 120 FPS con fotogrammi intermedi generati dall\'IA per un movimento più fluido.',
      metaTitle: 'Interpolazione IA dei fotogrammi: porta un video a 60 o 120 FPS | Media Manipulator',
      metaDescription: 'Strumento online gratuito di interpolazione IA dei fotogrammi. Usa RIFE per trasformare video a 24/30fps in MP4 più fluidi a 48, 60 o 120 FPS. Nessuna API di terze parti: gira sulla nostra GPU.',
      ogTitle: 'Interpolazione IA dei fotogrammi: video più fluidi a 60 o 120 FPS',
      ogDescription: 'Carica un video, scegli gli FPS di destinazione e scarica un MP4 con fotogrammi intermedi generati dall\'IA per un movimento più fluido.',
      intro: 'L\'interpolazione IA dei fotogrammi aumenta il frame rate di un video generando nuovi fotogrammi intermedi con una rete neurale (RIFE), invece di limitarsi a duplicare o fondere quelli esistenti. Il risultato è un movimento nettamente più fluido: le riprese a 24/30fps iniziano a sembrare a 60fps, e le clip a 60fps possono salire a 120fps, ideali per gli schermi ad alta frequenza di aggiornamento. L\'elaborazione gira sul nostro server GPU, non su un\'API di terze parti, e l\'output è un MP4 che puoi inserire direttamente in qualsiasi lettore.',
      whatItDoes: [
        'Sintetizza nuovi fotogrammi intermedi con RIFE (rife-ncnn-vulkan) invece di duplicare o fondere quelli esistenti.',
        'Punta a 48, 60 o 120 FPS con preset di qualità e di altezza massima di elaborazione che controlli tu.',
        'Gira sul nostro server GPU: nessun fornitore di IA di terze parti vede il tuo file.',
        'Restituisce un MP4 con H.264 + AAC (la traccia audio della sorgente viene mantenuta per impostazione predefinita).',
        'Limita in anticipo le sorgenti lunghe o molto alte, così una singola elaborazione non può monopolizzare la GPU.',
      ],
      flowSteps: [
        {
          title: 'Carica un video',
          description: 'Trascina una clip breve in MP4, MOV, WebM, MKV o AVI.',
        },
        {
          title: 'Apri gli Strumenti video IA',
          description: 'Nel modulo video scorri fino a "Strumenti video IA" e seleziona Interpolazione IA dei fotogrammi.',
        },
        {
          title: 'Scegli FPS di destinazione e qualità',
          description: 'Scegli 48, 60 o 120 FPS e una qualità di codifica / altezza massima di elaborazione.',
        },
        {
          title: 'Avvia l\'interpolazione',
          description: 'Estraiamo i fotogrammi, eseguiamo RIFE sulla nostra GPU e ricodifichiamo un MP4 ai nuovi FPS.',
        },
        {
          title: 'Scarica l\'MP4',
          description: 'Salva la clip interpolata e guardala in anteprima accanto all\'originale.',
        },
      ],
      advancedDetails: [
        'L\'estrazione dei fotogrammi usa ffmpeg con vsync=0, così il numero di fotogrammi in ingresso corrisponde esattamente agli FPS della sorgente.',
        'RIFE gira tramite rife-ncnn-vulkan con la cartella del modello scelto (rife-v4.6 è il predefinito consigliato; rife-v4 e rife-v2.3 sono disponibili per compatibilità).',
        'Dopo l\'interpolazione, ffmpeg ricodifica in H.264 (libx264) + AAC alla qualità scelta (CRF 26/20/17 per bassa/media/alta).',
        'L\'audio della sorgente viene rimappato sulla nuova codifica e l\'output usa +faststart, così il file va in streaming senza problemi via HTTP.',
        'Un\'altezza massima di elaborazione (720p per impostazione predefinita) limita la pressione sulla memoria GPU per le sorgenti alte; le proporzioni originali vengono preservate con lo scaling -2:min(ih,N).',
      ],
      whyItMatters: [
        'La fluidità del movimento è una delle maggiori differenze percepibili tra un video amatoriale e uno di qualità broadcast.',
        'Gli schermi moderni e molte piattaforme social privilegiano i contenuti a 60fps e 120fps per una riproduzione più fluida.',
        'Le riprese datate o a basso frame rate possono fare un salto di qualità senza rigirare il materiale originale.',
      ],
      useCases: [
        {
          title: 'Da 30fps a 60fps per il web',
          description: 'Porta riprese parlate, screencast o vlog nella fascia più fluida dei 60fps tipica dei moderni siti social e video.',
        },
        {
          title: 'Da 60fps a 120fps per schermi ad alta frequenza',
          description: 'Prepara le riprese per schermi a 120Hz/144Hz o per un successivo montaggio al rallentatore.',
        },
        {
          title: 'Clip brevi più fluide',
          description: 'Rendi nettamente più fluido un montaggio di 5–10 secondi prima di condividerlo.',
        },
        {
          title: 'Recupero di clip datate',
          description: 'Porta vecchie clip a 24/30fps a 48 o 60fps per una riproduzione dal sapore più moderno.',
        },
        {
          title: 'Preparazione al montaggio',
          description: 'Genera una timeline di fotogrammi più densa prima di applicare rallentatori o motion graphics in un editor successivo.',
        },
      ],
      whyMediaManipulator: [
        'Gira sulla nostra infrastruttura GPU: nessun fornitore di IA di terze parti riceve il file.',
        'Usa rife-ncnn-vulkan, un binario Vulkan portabile, invece di un pesante stack PyTorch: meno dipendenze, avvii a freddo più rapidi.',
        'Gratuito, senza registrazione. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      ],
      privacyNote: 'I nuovi fotogrammi intermedi del tuo video vengono generati da RIFE sul nostro server GPU. Il lavoro di IA gira su hardware gestito da noi, mai su un fornitore di IA di terze parti, e nulla di ciò che carichi viene usato per addestrare un modello. I file vengono conservati 24 ore per gli ospiti; con un account gratuito scegli da 24 ore a 2 anni.',
      faq: [
        {
          question: 'L\'interpolazione IA dei fotogrammi migliora davvero la qualità del video?',
          answer: 'Migliora la fluidità del movimento, non la risoluzione né la nitidezza. Se la sorgente è già a 60fps, a 120fps sembrerà più fluida. Se la sorgente è a 24/30fps, si avvicinerà alla sensazione dei 60fps. Non recupera magicamente un movimento reale che la videocamera non ha mai catturato.',
        },
        {
          question: 'L\'interpolazione IA dei fotogrammi è la stessa cosa di un semplice aumento degli FPS?',
          answer: 'No. La conversione FPS di base di solito duplica, scarta o fonde i fotogrammi esistenti. L\'interpolazione IA sintetizza fotogrammi intermedi del tutto nuovi in base al movimento stimato, con un risultato di norma molto più naturale della duplicazione.',
        },
        {
          question: 'Posso convertire da 30fps a 60fps?',
          answer: 'Sì: da 30fps a 60fps è uno degli obiettivi più comuni e un buon primo test.',
        },
        {
          question: 'Posso convertire da 60fps a 120fps?',
          answer: 'Sì. 120fps raddoppia il lavoro della GPU rispetto a 60fps e produce un file più grande, quindi prova prima con una clip breve.',
        },
        {
          question: 'Perché l\'interpolazione dei fotogrammi può creare artefatti?',
          answer: 'La stima del movimento deve indovinare cosa succede tra due fotogrammi reali. Movimenti rapidi, mani, capelli, ruote, occlusioni e cambi di scena sono per natura più difficili: in quelle zone il fotogramma sintetizzato può deformarsi, creare scie o sbavature.',
        },
        {
          question: 'Quale formato di output crea lo strumento?',
          answer: 'MP4 con video H.264 e audio AAC. La v1 produce solo MP4 perché quel contenitore si riproduce ovunque e supporta i frame rate elevati generati da questo strumento.',
        },
        {
          question: '60fps è sempre meglio di 30fps?',
          answer: 'Per screencast di interfacce, sport, gameplay e clip ricche di movimento, 60fps risulta di solito più fluido. Per i contenuti cinematografici, 24/30fps è spesso il look voluto. Scegli gli FPS in base a come vuoi che si percepisca il risultato.',
        },
        {
          question: 'L\'interpolazione IA dei fotogrammi è meglio di minterpolate di FFmpeg?',
          answer: 'L\'interpolazione IA (RIFE) produce in genere un movimento più pulito del filtro minterpolate integrato in FFmpeg, soprattutto con movimenti non rigidi. minterpolate è più veloce, più semplice e resta utile per conversioni rapide di ripiego.',
        },
        {
          question: 'Perché i cambi di scena a volte sembrano strani dopo l\'interpolazione?',
          answer: 'Il modello presume che i fotogrammi adiacenti appartengano alla stessa sequenza di movimento. Un cambio di scena netto rompe quel presupposto, quindi il fotogramma sintetizzato al confine può mostrare una breve deformazione. Tagli puliti e clip brevi aiutano.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'La durata massima della sorgente e l\'altezza di elaborazione sono limitate da AI_FRAME_INTERPOLATION_MAX_DURATION_SECONDS e AI_FRAME_INTERPOLATION_MAX_HEIGHT sul server.',
        ],
        processingNotes: [
          'L\'interpolazione IA è pesante per la GPU. Abbassa l\'altezza massima di elaborazione per tempi più rapidi con sorgenti alte.',
          'L\'output è MP4 (H.264 + AAC) nella v1. L\'audio della sorgente viene mantenuto per impostazione predefinita.',
        ],
      },
      related: [
        {
          label: 'Convertitore video',
          to: '/tools/video-converter',
          description: 'Converti MP4, WebM, MOV, AVI, MKV e altri.',
        },
        {
          label: 'Comprimi video',
          to: '/tools/compress-video',
          description: 'Riduci il peso del file video dopo l\'interpolazione.',
        },
        {
          label: 'Converti video in GIF animata',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Trasforma clip brevi in GIF animate facili da condividere.',
        },
        {
          label: 'Estrai i fotogrammi da un video',
          to: '/tools/extract-frames-from-video',
          description: 'Estrai i singoli fotogrammi come PNG.',
        },
        {
          label: 'Tutorial sull\'interpolazione IA dei fotogrammi',
          to: '/tutorials/ai-frame-interpolation',
          description: 'Scopri come funziona l\'interpolazione IA e quando usarla.',
        },
      ],
      embed: {
        title: 'Interpolazione IA dei fotogrammi',
        description: 'Carica un video breve. L\'interpolazione IA dei fotogrammi è già selezionata: scegli gli FPS di destinazione (48, 60 o 120) e lo strumento sintetizza nuovi fotogrammi intermedi e restituisce un MP4.',
      },
    },
  },
} as const;

export default itToolPages;
