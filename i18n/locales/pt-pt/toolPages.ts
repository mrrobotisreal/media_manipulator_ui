/**
 * European Portuguese partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope (MM65, 2026-10-27): only Motion's full page body, which
 * `i18n/motionTranslations.test.ts` requires for every `translated: true`
 * locale (coordinator decision; the ticket otherwise keeps toolPages out of
 * scope). The other tool pages render English until a later session adds
 * per-slug entries here, as de/es do.
 *
 * Register: European Portuguese (pt-PT, AO90), third-person polite with no
 * explicit `você`; brand names, formats and codecs stay untranslated;
 * "Darkroom" and "Motion" stay as they are. Model-written, needs native review.
 */

const ptPtToolPages = {
  pages: {
    // MM48/MM65: Motion's full page body (model-written, needs native review). The brand stays "Motion".
    motion: {
      name: 'Motion',
      tagline: 'Desenhe ou importe um SVG, anime-o numa linha temporal de fotogramas-chave e exporte SVG animado, Lottie, React, JavaScript, Flutter ou GIF, tudo no seu navegador.',
      intro: 'O Motion é um editor SVG com uma linha temporal de animação, integrado no Media Manipulator. Abra um ficheiro SVG (ou uma animação Lottie) e cada forma torna-se uma camada que pode selecionar, mover, recolorir e animar, ou comece a partir de uma tela em branco e desenhe com as ferramentas de retângulo, elipse, linha, caneta e texto. Cada propriedade animada recebe a sua própria faixa de fotogramas-chave, com predefinições de suavização, um editor de curvas para suavização personalizada e chaves de manutenção para saltos instantâneos. Os animadores de um clique acrescentam traçado progressivo do contorno, movimento ao longo de uma trajetória, morph de formas, mudanças de cor de gradiente, animação de máscaras e desfocagem. Quando se mover como pretende, exporte-o como SVG animado, ficheiro Lottie, componente React, módulo JavaScript ou TypeScript, widget Flutter ou GIF. A edição e todas as exportações correm no seu navegador, pelo que a sua ilustração nunca é carregada para ser exportada.',
      whatItDoes: [
        'Importa ficheiros SVG para uma árvore de camadas editável (grupos, traçados, formas, texto, imagens, gradientes, máscaras e traçados de recorte) e importa animações Lottie JSON com os respetivos fotogramas-chave.',
        'Desenha novas ilustrações com as ferramentas de retângulo, elipse, linha, caneta (Bézier) e texto, e edita os nós dos traçados diretamente na tela.',
        'Anima posição, escala, rotação, inclinação, opacidade, preenchimento, contorno e espessura do contorno numa linha temporal de fotogramas-chave, com suavização linear, de entrada, de saída, de entrada e saída, cubic-bezier personalizada e de manutenção.',
        'Acrescenta animação avançada com um clique: traçado progressivo do contorno, movimento ao longo de uma trajetória com rotação automática opcional, morph de formas, cores dos pontos de gradiente, animação de máscaras e traçados de recorte, e desfocagem.',
        'Exporta um SVG estático (sempre gratuito), um SVG animado que reproduz sem qualquer biblioteca, Lottie JSON, um componente React, um módulo JavaScript ou TypeScript, um widget Flutter e um GIF animado.',
      ],
      flowSteps: [
        {
          title: 'Abrir ou desenhar',
          description: 'Importe um ficheiro SVG ou Lottie, ou desenhe formas e traçados numa tela em branco.',
        },
        {
          title: 'Animar',
          description: 'Mova o cursor de reprodução e altere uma propriedade: a linha temporal regista um fotograma-chave.',
        },
        {
          title: 'Moldar o ritmo',
          description: 'Escolha uma predefinição de suavização, desenhe uma curva personalizada, acrescente pausas ou aplique um animador de um clique.',
        },
        {
          title: 'Exportar',
          description: 'Transfira SVG animado, Lottie, React, JS/TS, Flutter ou GIF, criados no seu navegador.',
        },
      ],
      advancedDetails: [
        'A exportação de SVG animado usa fotogramas-chave CSS puros sempre que todos os efeitos puderem ser expressos em CSS no Chrome, no Firefox e no Safari. Os morphs de forma, os pontos de gradiente em movimento e a desfocagem precisam de um pequeno script, pelo que esses ficheiros incorporam uma cópia reduzida do anime.js (licença MIT, cerca de 14 KB comprimidos) com o respetivo aviso de licença no topo.',
        'O morph de formas normaliza ambas as formas para o mesmo número de segmentos de curva e alinha os seus pontos de partida e o sentido de desenho, para que o morph não se torça. Duas formas que não possam ser emparelhadas mantêm-se em vez de sofrerem morph.',
        'O gerador de Lottie segue a especificação Lottie 1.0.1 e o conjunto de funcionalidades «Basic» do LottieFiles. Tudo o que o Lottie não consegue transportar (como filtros, texto ou máscaras avançadas) é listado após a transferência; nada é descartado em silêncio.',
        'A exportação de GIF usa um codificador escrito para o Media Manipulator, com uma única paleta global construída a partir de fotogramas de toda a animação, para que a arte vetorial plana mantenha as cores exatas.',
        'Os SVG importados são limpos à entrada: scripts, gestores de eventos, referências externas e outros conteúdos não seguros são removidos, e o editor reconstrói o código não suportado a partir de uma lista permitida em vez de o inserir como HTML.',
      ],
      whyItMatters: [
        'Os SVG animados mantêm-se nítidos em qualquer tamanho e são normalmente muito mais pequenos do que um vídeo ou GIF da mesma animação, o que os torna ideais para logótipos, ícones, indicadores de carregamento e ilustrações na web.',
        'Os programadores precisam de animação como código, e não apenas como vídeo: um componente React, um módulo JavaScript, um ficheiro Lottie ou um widget Flutter encaixa diretamente numa aplicação.',
        'Fazer a exportação no navegador significa que a sua ilustração fica no seu dispositivo; só nos é enviada uma contagem de cada exportação, para aplicar a quota diária.',
      ],
      useCases: [
        {
          title: 'Animação de logótipos e ícones',
          description: 'Faça um logótipo desenhar-se com uma animação de contorno, ou faça um ícone saltar, rodar ou mudar de cor ao passar o rato.',
        },
        {
          title: 'Indicadores de carregamento e microanimações de interface',
          description: 'Crie spinners e animações de progresso e exporte-os como SVG só com CSS ou como componente React.',
        },
        {
          title: 'Lottie para aplicações móveis',
          description: 'Exporte Lottie JSON para os leitores Lottie de iOS, Android, web e Flutter, ou edite um ficheiro Lottie existente.',
        },
        {
          title: 'Ilustrações animadas',
          description: 'Mova partes de uma ilustração ao longo de trajetórias, transforme formas umas nas outras e exporte um GIF para chat ou e-mail.',
        },
      ],
      whyMediaManipulator: [
        'Um verdadeiro editor de camadas e fotogramas-chave, com pausas, curvas personalizadas e animadores avançados, e não uma galeria de modelos.',
        'Exportações tanto para designers como para programadores: SVG animado, Lottie, React, JavaScript ou TypeScript, Flutter e GIF a partir de um único projeto.',
        'As exportações são feitas no seu navegador, e o único código de terceiros que uma exportação usa tem licença permissiva (anime.js sob MIT; flutter_svg e webview_flutter para Flutter), com o respetivo aviso de licença mantido no ficheiro.',
      ],
      privacyNote: 'A edição e a exportação acontecem no seu navegador; a sua ilustração não é carregada para ser exportada. Sem conta, os projetos são conservados apenas neste navegador. Se iniciar sessão e guardar um projeto na sua conta, este é armazenado nos nossos servidores como um projeto do Darkroom, segue o período de retenção que escolher e pode ser eliminado a partir da sua página Conta. Para cada exportação, registamos apenas o formato, o tamanho, a duração e a hora, para aplicar a quota diária.',
      faq: [
        {
          question: 'O Motion é gratuito?',
          answer: 'Sim. Abrir o Motion, desenhar, animar, guardar e exportar um SVG estático é gratuito e ilimitado, sem conta. As exportações animadas contam para uma quota diária que depende do seu plano; a tabela de planos nesta página mostra a quota e os formatos de cada plano.',
        },
        {
          question: 'Que formatos posso exportar?',
          answer: 'SVG estático, SVG animado (CSS, ou um pequeno script incorporado quando necessário), Lottie JSON, um componente React (.tsx), um módulo JavaScript ou TypeScript, um widget Flutter (.dart) e um GIF animado. Quais destes o seu plano inclui, e o número diário de exportações, são indicados na tabela de planos nesta página.',
        },
        {
          question: 'Quais são os limites?',
          answer: 'As exportações animadas são contadas por dia e repostas à meia-noite UTC. Os visitantes sem conta só podem guardar projetos no seu navegador; os planos com sessão iniciada guardam um determinado número de projetos na conta. Os visitantes têm também uma duração máxima de animação para exportação, e a exportação de GIF tem um limite de tamanho e de duração. Todos os números atuais estão na tabela de planos nesta página e na página de preços.',
        },
        {
          question: 'Posso animar um SVG que já tenho?',
          answer: 'Sim. Importe qualquer SVG e os seus grupos, traçados, formas, texto, gradientes, máscaras e traçados de recorte tornam-se camadas editáveis. As partes que o editor não consegue editar, como padrões ou filtros complexos, são mantidas e exportadas sem alterações, e tudo o que for inseguro (scripts ou ligações externas) é removido e listado após a importação.',
        },
        {
          question: 'Suporta Lottie?',
          answer: 'Sim, em ambos os sentidos. Pode importar um ficheiro Lottie JSON para o editar, e exportar a sua animação como Lottie JSON para o lottie-web e os leitores Lottie de iOS, Android e Flutter. As funcionalidades que um dos lados não consegue representar são listadas na caixa de diálogo em vez de serem descartadas em silêncio.',
        },
        {
          question: 'Que navegadores suportam a exportação de vídeo?',
          answer: 'A exportação de GIF funciona em todos os navegadores modernos. As exportações MP4 e WebM dependem do WebCodecs, o codificador de vídeo integrado do navegador, disponível no Chrome e no Edge e em versões recentes do Safari e do Firefox consoante o codec; a caixa de diálogo de exportação verifica o seu navegador e avisa quando não consegue codificar. A tabela de planos nesta página mostra que plano inclui cada formato de vídeo.',
        },
        {
          question: 'Que licença se aplica ao código exportado?',
          answer: 'A sua animação pertence-lhe. Quando um SVG animado ou uma exportação de código precisa de um runtime, usa o anime.js, licenciado sob MIT; o seu aviso de direitos de autor é escrito no topo do ficheiro e tem de lá permanecer. As exportações Flutter usam o pacote flutter_svg (MIT) ou webview_flutter (BSD-3-Clause). Tudo o resto no ficheiro é gerado a partir do seu projeto. As bibliotecas de código aberto que o editor usa estão listadas na nossa página de licenças.',
        },
        {
          question: 'Onde são guardados os meus projetos?',
          answer: 'Sem conta, os projetos são conservados apenas neste navegador, pelo que limpar os dados de navegação os remove. Com sessão iniciada, pode guardar um projeto na sua conta; a partir daí, sincroniza-se entre dispositivos, é guardado automaticamente enquanto trabalha, segue o período de retenção que escolheu e pode ser eliminado a partir da sua página Conta.',
        },
      ],
      supportedFormats: {
        supportedInputFormats: [
          'SVG',
          'Lottie JSON',
          'Projeto Motion (.json)',
        ],
        supportedOutputFormats: [
          'SVG estático',
          'SVG animado',
          'Lottie JSON',
          'React (.tsx)',
          'JavaScript / TypeScript',
          'Flutter (.dart)',
          'GIF',
        ],
        maxFileNotes: [
          'Importações SVG e Lottie até 4 MB cada.',
          'Os projetos sem conta vivem apenas neste navegador; os projetos de conta seguem o período de retenção que escolher.',
        ],
        processingNotes: [
          'A edição, a pré-visualização e todas as exportações correm no seu navegador. Só é enviada aos nossos servidores uma contagem de cada exportação.',
        ],
      },
      embed: {
        title: 'Abrir o Motion',
        description: 'Comece um novo desenho ou reabra um recente. O editor abre em ecrã inteiro; o seu trabalho é conservado neste navegador, e os utilizadores com sessão iniciada podem guardá-lo na sua conta.',
      },
      related: [
        {
          label: 'Tutorial do Motion',
          to: '/tutorials/motion',
          description: 'Importe um SVG, anime-o, molde a suavização e exporte-o, passo a passo.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Edite vídeo numa linha temporal multipista e exporte em MP4.',
        },
        {
          label: 'Converter vídeo em GIF animado',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Transforme um clipe de vídeo num GIF quando a sua animação começou como filmagem.',
        },
        {
          label: 'Licenças de código aberto',
          to: '/licenses',
          description: 'As bibliotecas que o editor executa e escreve nas suas exportações.',
        },
      ],
      metaTitle: 'Motion: editor de animação SVG online e gratuito | Media Manipulator',
      metaDescription: 'Anime SVG no seu navegador: fotogramas-chave, suavização, pausas, traçado progressivo, trajetórias e morph. Exporte SVG animado, Lottie JSON, React, JS, Flutter ou GIF.',
      ogTitle: 'Motion: anime SVG no seu navegador',
      ogDescription: 'Importe um SVG ou desenhe um, anime-o numa linha temporal de fotogramas-chave e exporte SVG animado, Lottie JSON, React, JavaScript, Flutter ou GIF. As exportações são feitas no seu navegador.',
    },
    // 2026-10-28 catalog expansion: name + tagline for the /tools catalog cards (model-written, needs native review).
    'inspect-metadata': {
      name: 'Inspetor de metadados',
      tagline: 'Veja todas as etiquetas escondidas numa fotografia, vídeo, ficheiro de áudio ou PDF: EXIF, localização GPS, câmara, codecs, ID3, XMP e muito mais, antes de o partilhar.',
    },
    'edit-image-metadata': {
      name: 'Editar metadados de imagem',
      tagline: 'Defina o título, o autor, os direitos de autor, as palavras-chave e a descrição de uma fotografia, corrija ou remova a sua localização GPS e reescreva as etiquetas EXIF e IPTC.',
    },
    'change-video-speed': {
      name: 'Alterar a velocidade do vídeo',
      tagline: 'Crie um time-lapse a 2x, 4x ou mais, ou abrande um clipe para 0,5x ou 0,25x, com o áudio sincronizado.',
    },
    'reverse-video': {
      name: 'Inverter vídeo',
      tagline: 'Reproduza qualquer clipe ao contrário, com ou sem o áudio invertido, e, se quiser, em vaivém: para a frente e depois para trás.',
    },
    'flip-video': {
      name: 'Virar e espelhar vídeo',
      tagline: 'Espelhe um vídeo na horizontal para corrigir uma webcam ou selfie invertida, ou vire-o na vertical, com um só clique.',
    },
    'stabilize-video': {
      name: 'Estabilizar vídeo',
      tagline: 'Suavize a tremedeira das mãos e os saltos de quem anda com um estabilizador de duas passagens, sem tripé nem editor de computador.',
    },
    'change-video-frame-rate': {
      name: 'Alterar a taxa de fotogramas do vídeo',
      tagline: 'Converta um vídeo para 24, 25, 30 ou 60 fps, reduza um clipe de 60 fps para 30 para obter um ficheiro mais pequeno, ou ajuste-o à taxa de fotogramas do projeto.',
    },
    'adjust-video-color': {
      name: 'Ajustar brilho e cor do vídeo',
      tagline: 'Ilumine um clipe escuro, aumente o contraste e a saturação, mude o tom, ou aplique um desfoque ou um visual artístico, com controlos deslizantes e pré-visualização em direto.',
    },
    'convert-video-to-hevc': {
      name: 'Converter vídeo para HEVC (H.265)',
      tagline: 'Recodifique qualquer vídeo em H.265 para obter cerca de metade do tamanho do H.264 com a mesma qualidade, para armazenamento, 4K e dispositivos modernos.',
    },
    'convert-audio-to-wav': {
      name: 'Converter áudio para WAV',
      tagline: 'Converta MP3, M4A, WAV, OGG, FLAC e qualquer outro ficheiro de áudio para WAV sem perder nada.',
    },
    'convert-audio-to-flac': {
      name: 'Converter áudio para FLAC',
      tagline: 'Converta MP3, M4A, WAV, OGG, FLAC e qualquer outro ficheiro de áudio para FLAC sem perder nada.',
    },
    'convert-audio-to-ogg': {
      name: 'Converter áudio para OGG',
      tagline: 'Converta MP3, M4A, WAV, OGG, FLAC e qualquer outro ficheiro de áudio para OGG com o débito binário que escolher.',
    },
    'convert-audio-to-m4a': {
      name: 'Converter áudio para M4A / AAC',
      tagline: 'Converta MP3, M4A, WAV, OGG, FLAC e qualquer outro ficheiro de áudio para M4A / AAC com o débito binário que escolher.',
    },
    'convert-audio-to-opus': {
      name: 'Converter áudio para Opus',
      tagline: 'Converta MP3, M4A, WAV, OGG, FLAC e qualquer outro ficheiro de áudio para Opus com o débito binário que escolher.',
    },
    'convert-mp3-to-wav': {
      name: 'Converter MP3 para WAV',
      tagline: 'Transforme um MP3 num WAV sem compressão para edição, sampling ou gravação em CD.',
    },
    'change-audio-speed': {
      name: 'Alterar a velocidade do áudio',
      tagline: 'Acelere uma aula ou um podcast para 1,5x, ou abrande uma canção ou gravação para 0,75x para praticar, sem alterar o tom.',
    },
    'change-audio-pitch': {
      name: 'Alterar o tom do áudio',
      tagline: 'Desloque uma canção ou gravação em meios-tons para mudar a tonalidade, baixar uma voz ou afinar um sample, mantendo o andamento.',
    },
    'normalize-audio': {
      name: 'Normalizar áudio',
      tagline: 'Leve uma gravação baixa a um volume consistente, para que podcasts, notas de voz e listas de reprodução variadas soem ao mesmo nível.',
    },
    'adjust-audio-volume': {
      name: 'Ajustar o volume do áudio',
      tagline: 'Aumente ou diminua o volume de um ficheiro de áudio numa quantidade fixa, de 10 por cento ao dobro, ou em decibéis com o controlo de amplificação.',
    },
    'audio-equalizer': {
      name: 'Equalizador de áudio',
      tagline: 'Aplique reforço de graves, realce de agudos, presença vocal ou uma predefinição de género, ou defina filtros passa-baixo e passa-alto, e transfira o resultado.',
    },
    'add-reverb-to-audio': {
      name: 'Adicionar reverberação ao áudio',
      tagline: 'Coloque uma voz seca ou uma gravação numa sala, salão, placa ou mola de reverberação, ou adicione um atraso ou eco, e transfira o resultado.',
    },
    'trim-audio': {
      name: 'Cortar áudio',
      tagline: 'Corte um MP3, WAV ou qualquer gravação entre um tempo inicial e final, com uma forma de onda para escolher os pontos, e transfira só essa parte.',
    },
    'transcribe-audio': {
      name: 'Transcrever áudio',
      tagline: 'Converta um MP3, WAV, M4A ou qualquer gravação em texto, legendas ou JSON com reconhecimento de voz por IA nos nossos próprios servidores GPU.',
    },
    'add-text-to-image': {
      name: 'Adicionar texto a imagem',
      tagline: 'Coloque uma legenda, um título ou uma marca de água numa fotografia: escolha o tipo de letra, o tamanho, a cor, o contorno e a posição, e transfira.',
    },
    'crop-image': {
      name: 'Recortar imagem',
      tagline: 'Arraste uma caixa sobre a parte da fotografia que quer, endireite o enquadramento e transfira só essa região em qualquer formato.',
    },
    'grayscale-image': {
      name: 'Converter imagem para preto e branco',
      tagline: 'Converta uma fotografia a cores em tons de cinzento, ou em sépia para um tom vintage, e transfira-a em qualquer formato.',
    },
    'image-filters': {
      name: 'Filtros e efeitos de imagem',
      tagline: 'Pintura a óleo, esboço, carvão, relevo, vintage, redemoinho, desfoque, nitidez e mais, aplicados a qualquer fotografia com um clique.',
    },
    'rotate-image': {
      name: 'Rodar imagem',
      tagline: 'Rode uma fotografia 90°, 180° ou 270°, corrija uma digitalização ou foto de telemóvel deitada, e transfira-a em qualquer formato.',
    },
    'sharpen-image': {
      name: 'Aumentar a nitidez da imagem',
      tagline: 'Realce os contornos de uma fotografia ou digitalização ligeiramente desfocada com um só clique e transfira em qualquer formato.',
    },
    'blur-image': {
      name: 'Desfocar imagem',
      tagline: 'Suavize uma fotografia inteira para um fundo, um marcador de posição ou um ecrã de privacidade, e transfira-a em qualquer formato.',
    },
    'generate-vtt-captions': {
      name: 'Gerador de legendas VTT',
      tagline: 'Crie um ficheiro de legendas .vtt para vídeo HTML5, YouTube ou um leitor com transcrição por IA nos nossos próprios servidores GPU.',
    },
    // MM75: summarize-video / summarize-audio full page bodies (model-written, needs native review).
    'summarize-video': {
      name: 'Resumir vídeo',
      h1: 'Resuma um vídeo com IA: capítulos, tópicos e texto no ecrã',
      tagline: 'Obtenha um resumo escrito de uma aula, reunião ou tutorial, com capítulos em que pode clicar, tópicos e texto no ecrã, gerado nos nossos próprios servidores GPU.',
      metaTitle: 'Resumidor de vídeo com IA e capítulos | Media Manipulator',
      metaDescription: 'Carregue um vídeo e obtenha um resumo escrito com capítulos com marcas temporais, tópicos e o texto mostrado no ecrã. A IA é executada nos nossos próprios servidores GPU, nunca numa IA de terceiros. Requer conta gratuita.',
      ogTitle: 'Resuma um vídeo com IA',
      ogDescription: 'Um resumo escrito com capítulos clicáveis, tópicos e texto no ecrã. Requer conta gratuita.',
      embed: {
        title: 'Resumir um vídeo',
        description: 'Inicie sessão, carregue um vídeo (ou um ficheiro de áudio) e escolha o idioma do resumo. Obtém um título, um resumo curto, capítulos que saltam para o momento do seu vídeo, os tópicos e o texto que aparece no ecrã.',
      },
      intro: 'Ninguém quer voltar a ver uma hora de reunião ou de aula para encontrar os cinco minutos que importavam. O Media Manipulator vê e ouve por si: transcreve a fala com Whisper, analisa com um modelo de visão os fotogramas escolhidos onde a imagem muda e escreve um resumo a partir de ambos, tudo num servidor GPU que nós operamos. O resultado é um documento curto: um título, algumas frases, capítulos com hora de início e de fim, os tópicos e o texto que apareceu no ecrã. Clique num capítulo para saltar para esse momento do seu vídeo, copie tudo como Markdown ou transfira-o como Markdown ou JSON. Os resumos requerem uma conta gratuita.',
      whatItDoes: [
        'Escreve um título e um resumo de três a seis frases de todo o vídeo.',
        'Divide o vídeo em capítulos com hora de início e de fim; ao clicar num deles, o leitor salta para esse momento.',
        'Lista os tópicos e o texto que aparece no ecrã, com a hora a que surge pela primeira vez.',
        'Descreve a imagem e a fala, e assinala o que não conseguiu fazer (por exemplo, se não há fala).',
        'Escreve o resumo no idioma que escolher ou no idioma que é falado.',
      ],
      flowSteps: [
        {
          title: 'Inicie sessão',
          description: 'Basta uma conta gratuita.',
        },
        {
          title: 'Carregue',
          description: 'Um vídeo ou um ficheiro de áudio.',
        },
        {
          title: 'Resuma',
          description: 'A fala e os fotogramas são analisados no nosso servidor GPU.',
        },
        {
          title: 'Leia',
          description: 'Clique nos capítulos, copie Markdown, transfira .md ou .json.',
        },
      ],
      advancedDetails: [
        'A fala é transcrita com Whisper; os fotogramas são escolhidos nas mudanças de cena, até ao limite de fotogramas do seu plano (24 no Free, 48 no Premium, 96 no Pro), e descritos em lotes por um modelo de visão.',
        'Um modelo de linguagem escreve o resumo a partir da transcrição e das notas dos fotogramas. As contas Pro podem pedir um resumo mais profundo, com um modelo maior, quando estiver disponível.',
        'Um resumo conta como uma tarefa de IA do seu limite diário; uma tarefa falhada ou recusada não é contabilizada.',
        'A transcrição é gerada por máquina, pelo que os nomes e os números podem estar errados. O resumo indica-o nas suas notas.',
      ],
      whyItMatters: [
        'Um resumo com capítulos lê-se na diagonal em um minuto; o vídeo, não.',
        'As marcas temporais clicáveis levam-no diretamente à parte de que precisa.',
        'O texto no ecrã apanha títulos de diapositivos e legendas que a fala nunca diz em voz alta.',
      ],
      useCases: [
        {
          title: 'Resumo de reunião',
          description: 'Decisões e tópicos, com horas para confirmar os detalhes.',
        },
        {
          title: 'Apontamentos de aula',
          description: 'Capítulos por secção e o texto dos diapositivos, para estudar.',
        },
        {
          title: 'Esquema de tutorial',
          description: 'Os passos como capítulos, para saltar para aquele de que precisa.',
        },
        {
          title: 'Síntese de entrevista',
          description: 'O que foi discutido e em que momento.',
        },
      ],
      whyMediaManipulator: [
        'O Whisper e os modelos de visão e de linguagem são executados em hardware que nós operamos; o seu vídeo nunca é enviado para uma IA de terceiros.',
        'Capítulos que navegam no seu próprio vídeo, diretamente no visualizador de resultados.',
        'Transferências em Markdown e JSON. Os ficheiros são mantidos 24 horas para visitantes; com uma conta gratuita escolhe entre 24 horas e 2 anos.',
      ],
      privacyNote: 'Os resumos requerem uma conta gratuita, pelo que a tarefa fica associada a ela. O seu ficheiro é processado nos nossos próprios servidores e os modelos de IA são executados num servidor GPU que nós operamos; nada é enviado para um fornecedor de IA de terceiros. Os ficheiros são mantidos 24 horas para visitantes; com uma conta gratuita escolhe entre 24 horas e 2 anos.',
      faq: [
        {
          question: 'Preciso de uma conta?',
          answer: 'Sim, uma conta gratuita. Os resumos executam vários modelos de IA no nosso servidor GPU, pelo que estão limitados a utilizadores com sessão iniciada.',
        },
        {
          question: 'O que obtenho?',
          answer: 'Um título, um resumo curto, capítulos com hora de início e de fim, tópicos, texto no ecrã com as respetivas horas, uma descrição da imagem e da fala, e notas sobre tudo o que não foi possível fazer.',
        },
        {
          question: 'Posso escolher o idioma do resumo?',
          answer: 'Sim. Escolha um dos 18 idiomas do site, ou «o mesmo da fala» para o escrever no idioma falado.',
        },
        {
          question: 'E se o vídeo não tiver fala?',
          answer: 'O resumo é escrito apenas a partir da imagem e indica-o nas suas notas. Um ficheiro sem imagem nem som é recusado e não é contabilizado.',
        },
        {
          question: 'O meu vídeo é enviado para terceiros?',
          answer: 'Não. Todos os modelos são executados num servidor GPU que nós operamos.',
        },
        {
          question: 'Conta para o meu limite?',
          answer: 'Sim, como uma tarefa de IA. As tarefas falhadas não são contabilizadas.',
        },
      ],
      related: [
        {
          label: 'Resumir áudio',
          to: '/tools/summarize-audio',
          description: 'Para podcasts e gravações.',
        },
        {
          label: 'Transcrever vídeo',
          to: '/tools/transcribe-video',
          description: 'A transcrição completa.',
        },
        {
          label: 'Transcrever áudio',
          to: '/tools/transcribe-audio',
          description: 'Para ficheiros de áudio.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Limpe primeiro o áudio.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Conta como uma tarefa de IA; as tarefas falhadas não são contabilizadas.',
          'Duração até ao limite de duração de vídeo do seu plano.',
        ],
      },
    },
    'summarize-audio': {
      name: 'Resumir áudio',
      h1: 'Resuma uma gravação de áudio com IA',
      tagline: 'Transforme um podcast, uma entrevista ou uma nota de voz num resumo escrito com capítulos e tópicos, gerado nos nossos próprios servidores GPU.',
      metaTitle: 'Resumidor de áudio com IA e capítulos | Media Manipulator',
      metaDescription: 'Carregue um MP3, WAV ou M4A e obtenha um resumo escrito com capítulos com marcas temporais e tópicos. O Whisper e o modelo de linguagem são executados nos nossos próprios servidores GPU. Requer conta gratuita.',
      ogTitle: 'Resuma uma gravação de áudio com IA',
      ogDescription: 'Um resumo escrito com capítulos e tópicos para qualquer gravação. Requer conta gratuita.',
      embed: {
        title: 'Resumir um ficheiro de áudio',
        description: 'Inicie sessão, carregue uma gravação e escolha o idioma do resumo. Obtém um título, um resumo curto, capítulos que saltam para o momento da sua gravação e os tópicos.',
      },
      intro: 'Um episódio de podcast, uma entrevista ou uma nota de voz longa é mais fácil de usar como página do que como uma hora de áudio. O Media Manipulator transcreve a gravação com Whisper e faz com que um modelo de linguagem escreva um resumo a partir da transcrição, ambos num servidor GPU que nós operamos. Obtém um título, algumas frases, capítulos com hora de início e de fim e os tópicos. Clique num capítulo para saltar para esse ponto da gravação, copie o resumo como Markdown ou transfira-o como Markdown ou JSON. Os resumos requerem uma conta gratuita.',
      whatItDoes: [
        'Escreve um título e um resumo curto da gravação.',
        'Divide-a em capítulos com horas; ao clicar num deles, o leitor salta para aí.',
        'Lista os tópicos e descreve quem fala e em que tom.',
        'Escreve o resumo no idioma que escolher ou no idioma falado.',
      ],
      flowSteps: [
        {
          title: 'Inicie sessão',
          description: 'Basta uma conta gratuita.',
        },
        {
          title: 'Carregue',
          description: 'MP3, WAV, M4A e outros formatos de áudio.',
        },
        {
          title: 'Resuma',
          description: 'O Whisper e um modelo de linguagem no nosso servidor GPU.',
        },
        {
          title: 'Leia',
          description: 'Clique nos capítulos, copie Markdown, transfira .md ou .json.',
        },
      ],
      advancedDetails: [
        'A fala é transcrita com Whisper; um modelo de linguagem escreve o resumo a partir da transcrição.',
        'Um ficheiro de áudio com capa é tratado como áudio: a imagem é ignorada.',
        'Um resumo conta como uma tarefa de IA do seu limite diário; uma tarefa falhada ou recusada não é contabilizada.',
        'A transcrição é gerada por máquina, pelo que os nomes e os números podem estar errados. O resumo indica-o nas suas notas.',
      ],
      whyItMatters: [
        'Pode ler um resumo em um minuto e decidir o que ouvir.',
        'Capítulos com horas transformam uma gravação longa em algo em que pode navegar.',
        'Os tópicos tornam pesquisável um catálogo de episódios.',
      ],
      useCases: [
        {
          title: 'Notas de um podcast',
          description: 'Capítulos e tópicos para a página do episódio.',
        },
        {
          title: 'Síntese de entrevista',
          description: 'O que foi abordado, com horas para citar.',
        },
        {
          title: 'De nota de voz a apontamentos',
          description: 'Uma nota divagante transformada numa página curta.',
        },
        {
          title: 'Resumo de chamada',
          description: 'Os pontos de uma chamada gravada.',
        },
      ],
      whyMediaManipulator: [
        'O Whisper e o modelo de linguagem são executados em hardware que nós operamos; a sua gravação nunca é enviada para uma IA de terceiros.',
        'Capítulos que navegam na sua própria gravação, diretamente no visualizador de resultados.',
        'Transferências em Markdown e JSON. Os ficheiros são mantidos 24 horas para visitantes; com uma conta gratuita escolhe entre 24 horas e 2 anos.',
      ],
      privacyNote: 'Os resumos requerem uma conta gratuita, pelo que a tarefa fica associada a ela. O seu ficheiro é processado nos nossos próprios servidores e os modelos de IA são executados num servidor GPU que nós operamos; nada é enviado para um fornecedor de IA de terceiros. Os ficheiros são mantidos 24 horas para visitantes; com uma conta gratuita escolhe entre 24 horas e 2 anos.',
      faq: [
        {
          question: 'Preciso de uma conta?',
          answer: 'Sim, uma conta gratuita. Os resumos executam modelos de IA no nosso servidor GPU, pelo que estão limitados a utilizadores com sessão iniciada.',
        },
        {
          question: 'Em que difere da transcrição?',
          answer: 'A transcrição dá-lhe cada palavra. Um resumo dá-lhe um título, algumas frases, capítulos e tópicos, escritos a partir dessa transcrição.',
        },
        {
          question: 'Posso escolher o idioma do resumo?',
          answer: 'Sim. Escolha um dos 18 idiomas do site, ou «o mesmo da fala».',
        },
        {
          question: 'A minha gravação é enviada para terceiros?',
          answer: 'Não. Os modelos são executados num servidor GPU que nós operamos.',
        },
        {
          question: 'Conta para o meu limite?',
          answer: 'Sim, como uma tarefa de IA. As tarefas falhadas não são contabilizadas.',
        },
      ],
      related: [
        {
          label: 'Transcrever áudio',
          to: '/tools/transcribe-audio',
          description: 'Cada palavra, como texto ou legendas.',
        },
        {
          label: 'Resumir vídeo',
          to: '/tools/summarize-video',
          description: 'Acrescenta a imagem e o texto no ecrã.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Limpe primeiro o áudio.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Conta como uma tarefa de IA; as tarefas falhadas não são contabilizadas.',
        ],
      },
    },
    // MM78 voices: name + tagline (model-written, needs native review).
    'voice-cloning': {
      name: 'Clonagem de voz',
      tagline:
        'Grave ou carregue 5 a 60 segundos da sua própria fala, crie uma voz e peça-lhe que leia qualquer texto em mais de vinte idiomas.',
    },
    'voice-designer': {
      name: 'Criador de vozes',
      tagline:
        'Descreva uma voz por palavras, pré-visualize-a e mantenha a que preferir para ler qualquer texto em mais de vinte idiomas.',
    },
    'voice-changer': {
      name: 'Alterador de voz',
      tagline:
        'Altere de imediato o tom e o caráter de uma gravação, ou converta a fala para uma voz guardada ou predefinida com IA.',
    },
    // MM84: name / tagline / metaTitle / metaDescription for the copy-bar tool pages (model-written, needs native review).
    'content-studio': {
      name: 'Darkroom',
      tagline: 'Edite, sobreponha e misture vídeo e áudio numa linha temporal multipista e exporte em MP4. Um editor ao estilo do Premiere Pro, diretamente no navegador.',
      metaTitle: 'Darkroom: editor de vídeo multipista online e gratuito | Media Manipulator',
      metaDescription: 'Edite, sobreponha e misture vídeo e áudio numa linha temporal multipista e exporte em MP4: um editor de vídeo gratuito ao estilo do Premiere Pro, que corre no navegador. Sem registo nem instalação.',
    },
    'remove-exif-metadata': {
      name: 'Remover metadados EXIF de imagens',
      tagline: 'Elimine a localização GPS e os dados do dispositivo, da câmara e da data das fotografias antes de as partilhar.',
      metaTitle: 'Remover metadados EXIF de imagens online (grátis) | Media Manipulator',
      metaDescription: 'Ferramenta online gratuita para remover metadados EXIF, GPS, IPTC e da câmara de imagens JPG, PNG, WebP e HEIC. Sem registo. Os ficheiros são guardados 24 horas para visitantes; com uma conta gratuita, escolhe entre 24 horas e 2 anos.',
    },
    'compress-image': {
      name: 'Comprimir imagem',
      tagline: 'Reduza o tamanho de ficheiros JPG, PNG e WebP para sites mais rápidos, envios mais leves e partilha mais fácil.',
      metaTitle: 'Comprimir imagem online grátis | Media Manipulator',
      metaDescription: 'Compressor de imagens online gratuito. Reduza o tamanho de ficheiros JPG, PNG e WebP mantendo boa qualidade. Sem registo. Os ficheiros são guardados 24 horas para visitantes; com uma conta gratuita, escolhe entre 24 horas e 2 anos.',
    },
    'image-resizer': {
      name: 'Redimensionar imagem',
      tagline: 'Redimensione imagens JPG, PNG, WebP e GIF para dimensões exatas em píxeis, mantendo a proporção.',
      metaTitle: 'Redimensionar imagem online grátis | Media Manipulator',
      metaDescription: 'Redimensionador de imagens online gratuito. Redimensione imagens JPG, PNG, WebP e GIF para dimensões exatas em píxeis, mantendo a proporção. Sem registo. Os ficheiros são guardados 24 horas para visitantes; com uma conta gratuita, escolhe entre 24 horas e 2 anos.',
    },
    'remove-background-from-image': {
      name: 'Remover fundo de imagem',
      tagline: 'Apague automaticamente o fundo de qualquer fotografia e descarregue um recorte PNG limpo e transparente.',
      metaTitle: 'Remover fundo de imagem online grátis | Media Manipulator',
      metaDescription: 'Removedor de fundo online gratuito. Apague automaticamente o fundo de qualquer fotografia e descarregue um PNG transparente. Corre na nossa própria GPU, sem IA de terceiros. Os ficheiros são guardados 24 horas para visitantes; com uma conta gratuita, escolhe entre 24 horas e 2 anos.',
    },
    'image-to-pdf': {
      name: 'Imagem para PDF',
      tagline: 'Transforme imagens JPG, PNG e outras num documento PDF limpo e fácil de partilhar com um clique.',
      metaTitle: 'Converter imagem em PDF online grátis | Media Manipulator',
      metaDescription: 'Conversor gratuito de imagem para PDF online. Transforme imagens JPG, PNG e outras num documento PDF limpo. Sem registo nem marcas de água. Os ficheiros são guardados 24 horas para visitantes; com uma conta gratuita, escolhe entre 24 horas e 2 anos.',
    },
    'pdf-to-jpg': {
      name: 'PDF para JPG',
      tagline: 'Converta todas as páginas de um PDF em imagens JPG de alta qualidade que pode partilhar, editar ou publicar.',
      metaTitle: 'Converter PDF em JPG online grátis | Media Manipulator',
      metaDescription: 'Conversor gratuito de PDF para JPG online. Converta todas as páginas de um PDF em imagens JPG de alta qualidade, descarregadas num ZIP. Sem registo. Os ficheiros são guardados 24 horas para visitantes; com uma conta gratuita, escolhe entre 24 horas e 2 anos.',
    },
    'compress-video': {
      name: 'Comprimir vídeo',
      tagline: 'Reduza o tamanho de ficheiros MP4, WebM, MOV, MKV e AVI para a web, o e-mail, as redes sociais e envios para a nuvem.',
      metaTitle: 'Comprimir vídeo online (grátis) | Media Manipulator',
      metaDescription: 'Compressor de vídeo online gratuito. Reduza o tamanho de ficheiros MP4, WebM, MOV, MKV e AVI mantendo boa qualidade. Sem registo. Os ficheiros são guardados 24 horas para visitantes; com uma conta gratuita, escolhe entre 24 horas e 2 anos.',
    },
    'video-trimmer': {
      name: 'Cortar vídeo',
      tagline: 'Corte um clip na parte que pretende com um corte rápido que preserva a qualidade, sem recodificar sempre que possível.',
      metaTitle: 'Cortar vídeo online grátis | Media Manipulator',
      metaDescription: 'Cortador de vídeo online gratuito. Defina o tempo de início e de fim e corte o clip com um corte rápido e sem perdas. Saída em MP4, sem marca de água nem registo. Os ficheiros são guardados 24 horas para visitantes; com uma conta gratuita, escolhe entre 24 horas e 2 anos.',
    },
    'extract-audio-from-video': {
      name: 'Extrair áudio de vídeo',
      tagline: 'Guarde a faixa de áudio de qualquer vídeo como um ficheiro MP3, WAV, M4A, AAC, FLAC ou OGG limpo.',
      metaTitle: 'Extrair áudio de vídeo: MP3, WAV, M4A e mais | Media Manipulator',
      metaDescription: 'Ferramenta online gratuita para extrair o áudio de qualquer ficheiro de vídeo (MP4, MOV, MKV, WebM, AVI). Saída em MP3, WAV, M4A, AAC, FLAC ou OGG. Sem registo. Os ficheiros são guardados 24 horas para visitantes; com uma conta gratuita, escolhe entre 24 horas e 2 anos.',
    },
    'convert-video-to-animated-gif': {
      name: 'Converter vídeo em GIF animado',
      tagline: 'Transforme clips curtos MP4, WebM, MOV ou MKV em GIFs animados fáceis de partilhar em segundos.',
      metaTitle: 'Converter vídeo em GIF animado online (grátis) | Media Manipulator',
      metaDescription: 'Conversor gratuito de vídeo para GIF online. Transforme clips curtos MP4, WebM, MOV e MKV em GIFs animados, com controlo do tamanho e da taxa de fotogramas.',
    },
    'transcribe-video': {
      name: 'Transcrever vídeo',
      tagline: 'Extraia as palavras faladas de um ficheiro de vídeo ou áudio como legendas WebVTT ou SRT, texto simples ou JSON com marcas temporais.',
      metaTitle: 'Transcrever vídeo em texto online (grátis) | Media Manipulator',
      metaDescription: 'Transcrição de vídeo online gratuita. Converta ficheiros MP4, MOV, WebM, MKV e de áudio em texto pesquisável, legendas VTT ou transcrições JSON.',
    },
    'transcode-to-hls': {
      name: 'Transcodificar vídeo para HLS',
      tagline: 'Empacote qualquer vídeo num pacote Apple HLS VOD: master.m3u8 e segmentos .ts por resolução, pronto para a web.',
      metaTitle: 'Transcodificar vídeo para HLS online | Ferramenta gratuita de streaming adaptativo',
      metaDescription: 'Transcodificador HLS online gratuito. Converta MP4, MOV, WebM e MKV num pacote HLS VOD com resoluções de 360p/480p/720p, legendas e storyboards opcionais.',
    },
    'ai-video-restoration': {
      name: 'Restauro de vídeo com IA',
      tagline: 'Melhore a resolução e restaure um pequeno excerto de vídeo com até seis modelos de IA (Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT e VRT) e compare todos os resultados lado a lado.',
      metaTitle: 'Restauro de vídeo com IA: compare 6 modelos de ampliação online | Media Manipulator',
      metaDescription: 'Ferramenta gratuita de restauro de vídeo com IA. Passe um clip curto pelos modelos de super-resolução Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT e VRT na nossa própria GPU e descarregue todos os resultados num só pacote.',
    },
    'ai-image-restoration': {
      name: 'Restauro e ampliação de imagem com IA',
      tagline: 'Limpe, amplie e restaure uma fotografia com até oito modelos de IA (pré-limpeza que preserva a fidelidade com FBCNN, SCUNet e NAFNet; ampliadores gerais Real-ESRGAN, SwinIR e HAT; e melhoria de rostos com GFPGAN e CodeFormer) e compare cada resultado com o original.',
      metaTitle: 'Restauro e ampliação de imagem com IA: compare 8 modelos online | Media Manipulator',
      metaDescription: 'Restauro e ampliação de fotografias com IA, grátis. Remova artefactos JPEG, reduza o ruído e a falta de nitidez, amplie até 4K/8K com Real-ESRGAN, SwinIR ou HAT e melhore rostos com GFPGAN/CodeFormer, tudo na nossa própria GPU e comparado lado a lado.',
    },
    'ai-document-scan': {
      name: 'Digitalização de documentos com IA',
      tagline: 'Transforme documentos digitalizados e notas manuscritas num PDF pesquisável de várias páginas e num documento Word editável. As páginas impressas recebem uma camada de texto fiel do Tesseract; a escrita manuscrita é transcrita por uma IA de visão, com a incerteza assinalada e nunca inventada.',
      metaTitle: 'Digitalização de documentos com IA: páginas digitalizadas e manuscritos para PDF/Word | Media Manipulator',
      metaDescription: 'Digitalização de documentos com IA, grátis: converta imagens digitalizadas num PDF pesquisável e em Word com OCR, e transcreva notas manuscritas para texto. Reordene páginas, misture impresso e manuscrito, tudo na nossa própria GPU, palavra por palavra e com a incerteza assinalada.',
    },
    'ai-image-upscaler': {
      name: 'Ampliador de imagens com IA',
      tagline: 'Amplie uma fotografia pequena ou pouco nítida com um modelo Real-ESRGAN que reconstrói os detalhes finos em vez de apenas esticar píxeis.',
      metaTitle: 'Ampliador de imagens com IA: aumente fotografias 2x ou 4x | Media Manipulator',
      metaDescription: 'Amplie uma fotografia de baixa resolução 2x ou 4x com IA que recupera contornos e texturas. Corre na nossa própria GPU e devolve PNG. Os ficheiros são guardados 24 horas para visitantes; com uma conta gratuita, escolhe entre 24 horas e 2 anos.',
    },
    'blur-faces-in-photo': {
      name: 'Desfocar rostos numa fotografia',
      tagline: 'Detete rostos automaticamente e depois desfoque, pixelize ou tape a preto todos ou apenas os que escolher.',
      metaTitle: 'Desfocar rostos numa fotografia online | Media Manipulator',
      metaDescription: 'Desfoque, pixelize ou tape a preto rostos numa fotografia. Detete todos os rostos e escolha quais ocultar. A IA corre na nossa própria GPU. Os ficheiros são guardados 24 horas para visitantes; com uma conta gratuita, escolhe entre 24 horas e 2 anos.',
    },
    'redact-text-in-image': {
      name: 'Ocultar texto numa imagem',
      tagline: 'Encontre texto legível numa captura de ecrã ou fotografia e cubra os dados pessoais, ou todo o texto, com desfoque ou uma caixa preta.',
      metaTitle: 'Ocultar texto numa imagem online | Media Manipulator',
      metaDescription: 'Encontre automaticamente texto numa imagem e tape a preto ou desfoque nomes, e-mails, números e outros dados pessoais. IA na nossa própria GPU. Os ficheiros são guardados 24 horas para visitantes; com uma conta gratuita, escolhe entre 24 horas e 2 anos.',
    },
    'remove-object-from-photo': {
      name: 'Remover objeto de uma fotografia',
      tagline: 'Desenhe uma caixa à volta do que não quer na imagem e um modelo de inpainting preenche o espaço com um fundo coerente.',
      metaTitle: 'Remover um objeto de uma fotografia online | Media Manipulator',
      metaDescription: 'Apague objetos indesejados de uma fotografia. Desenhe um retângulo e o inpainting com IA preenche o espaço de acordo com o fundo. Corre na nossa própria GPU. Os ficheiros são guardados 24 horas para visitantes; com uma conta gratuita, escolhe entre 24 horas e 2 anos.',
    },
    'clean-voice-audio': {
      name: 'Limpar áudio de voz',
      tagline: 'Torne a fala mais clara reduzindo o chiado, o som da sala e os rumores em podcasts, entrevistas e notas de voz.',
      metaTitle: 'Limpar gravações de voz com IA | Media Manipulator',
      metaDescription: 'Limpe uma gravação de voz com IA. Reduza o chiado, o zumbido e o ruído da sala para que a fala se ouça melhor. Corre na nossa própria GPU. Os ficheiros são guardados 24 horas para visitantes; com uma conta gratuita, escolhe entre 24 horas e 2 anos.',
    },
    'remove-background-noise': {
      name: 'Remover ruído de fundo',
      tagline: 'Reduza o chiado, o zumbido, o trânsito e o ruído ambiente de uma gravação com um removedor de ruído com IA, mantendo o som principal em destaque.',
      metaTitle: 'Remover ruído de fundo de áudio online | Media Manipulator',
      metaDescription: 'Remova o ruído de fundo do áudio. Um removedor de ruído com IA reduz o chiado, o zumbido e o som ambiente em gravações. Corre na nossa própria GPU. Os ficheiros são guardados 24 horas para visitantes; com uma conta gratuita, escolhe entre 24 horas e 2 anos.',
    },
    'remove-vocals-from-song': {
      name: 'Remover voz de uma música',
      tagline: 'Retire o canto de uma faixa e mantenha a música, para karaoke, treino e faixas de acompanhamento. Utilize apenas em música sobre a qual tenha direitos.',
      metaTitle: 'Remover voz de uma música: criador de karaoke | Media Manipulator',
      metaDescription: 'Remova a voz de uma música com IA e descarregue o instrumental no mesmo formato do seu ficheiro, ou em FLAC ou WAV. Karaoke e faixas de treino, na nossa própria GPU. Os ficheiros são guardados 24 horas para visitantes; com uma conta gratuita, escolhe entre 24 horas e 2 anos.',
    },
  },
} as const;

export default ptPtToolPages;
