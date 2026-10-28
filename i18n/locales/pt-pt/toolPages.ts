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
    'summarize-video': {
      name: 'Resumir vídeo',
      tagline: 'Obtenha a transcrição e uma análise JSON estruturada de uma aula, reunião ou entrevista, com marcas temporais, nos nossos próprios servidores GPU.',
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
  },
} as const;

export default ptPtToolPages;
