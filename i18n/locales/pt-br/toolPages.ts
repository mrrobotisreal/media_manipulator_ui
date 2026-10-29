/**
 * Brazilian Portuguese partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope (MM66, 2026-10-27): only Motion's full page body, which
 * `i18n/motionTranslations.test.ts` requires for every `translated: true`
 * locale (coordinator decision; the ticket otherwise keeps toolPages out of
 * scope). The other tool pages render English until a later session adds
 * per-slug entries here, as de/es do.
 *
 * Register: "você", Brazilian vocabulary (arquivo, navegador, baixar, salvar);
 * brand names, formats and codecs stay untranslated; "Darkroom" and "Motion"
 * stay as they are. Model-written, needs native review.
 */

const ptBrToolPages = {
  pages: {
    // MM48/MM66: Motion's full page body (model-written, needs native review). The brand stays "Motion".
    motion: {
      name: 'Motion',
      tagline: 'Desenhe ou importe um SVG, anime em uma linha do tempo de keyframes e exporte como SVG animado, Lottie, React, JavaScript, Flutter ou GIF, tudo no seu navegador.',
      intro: 'O Motion é um editor de SVG com linha do tempo de animação, integrado ao Media Manipulator. Abra um arquivo SVG (ou uma animação Lottie) e cada forma vira uma camada que você pode selecionar, mover, recolorir e animar, ou comece com uma tela em branco e desenhe com as ferramentas de retângulo, elipse, linha, caneta e texto. Cada propriedade animada tem a própria trilha de keyframes, com predefinições de suavização, um editor de curvas para suavizações personalizadas e keyframes de retenção para saltos instantâneos. Os animadores de um clique adicionam desenho progressivo do traço, movimento ao longo de um caminho, morph de formas, mudanças de cor em gradientes, animação de máscaras e desfoque. Quando o movimento estiver do jeito que você quer, exporte como SVG animado, arquivo Lottie, componente React, módulo JavaScript ou TypeScript, widget Flutter ou GIF. A edição e todas as exportações rodam no seu navegador, então sua arte nunca é enviada para ser exportada.',
      whatItDoes: [
        'Importa arquivos SVG como uma árvore de camadas editável (grupos, caminhos, formas, texto, imagens, gradientes, máscaras e caminhos de recorte) e importa animações Lottie JSON com seus keyframes.',
        'Desenha artes novas com as ferramentas de retângulo, elipse, linha, caneta (Bézier) e texto, e edita os nós dos caminhos diretamente na tela.',
        'Anima posição, escala, rotação, inclinação, opacidade, preenchimento, traço e espessura do traço em uma linha do tempo de keyframes com suavização linear, de entrada, de saída, de entrada e saída, cubic-bezier personalizada e retenção.',
        'Adiciona animações avançadas com um clique: desenho progressivo do traço, movimento ao longo de um caminho com giro automático opcional, morph de formas, cores dos pontos de gradiente, animação de máscaras e caminhos de recorte, e desfoque.',
        'Exporta SVG estático (sempre gratuito), SVG animado que toca sem nenhuma biblioteca, Lottie JSON, componente React, módulo JavaScript ou TypeScript, widget Flutter e GIF animado.',
      ],
      flowSteps: [
        {
          title: 'Abra ou desenhe',
          description: 'Importe um arquivo SVG ou Lottie, ou desenhe formas e caminhos em uma tela em branco.',
        },
        {
          title: 'Anime',
          description: 'Mova o cursor de reprodução e altere uma propriedade: a linha do tempo registra um keyframe.',
        },
        {
          title: 'Molde o ritmo',
          description: 'Escolha uma predefinição de suavização, desenhe uma curva personalizada, adicione retenções ou aplique um animador de um clique.',
        },
        {
          title: 'Exporte',
          description: 'Baixe SVG animado, Lottie, React, JS/TS, Flutter ou GIF, criados no seu navegador.',
        },
      ],
      advancedDetails: [
        'A exportação em SVG animado usa keyframes de CSS puro sempre que todos os efeitos podem ser expressos em CSS no Chrome, no Firefox e no Safari. Morphs de forma, pontos de gradiente em movimento e desfoque precisam de um pequeno script, então esses arquivos incluem uma cópia reduzida do anime.js (licença MIT, cerca de 14 KB compactados) com o aviso de licença no início.',
        'O morph de formas normaliza as duas formas para o mesmo número de segmentos de curva e alinha os pontos iniciais e o sentido de rotação, para que a transformação não se retorça. Duas formas que não podem ser pareadas são mantidas em vez de transformadas.',
        'O gerador de Lottie segue a especificação Lottie 1.0.1 e o conjunto de recursos “Basic” do LottieFiles. Tudo o que o Lottie não consegue carregar (como filtros, texto ou máscaras avançadas) é listado após o download; nada é descartado em silêncio.',
        'A exportação em GIF usa um codificador escrito para o Media Manipulator, com uma única paleta global criada a partir de quadros de toda a animação, para que a arte vetorial chapada mantenha as cores exatas.',
        'Os SVGs importados são limpos na entrada: scripts, manipuladores de evento, referências externas e outros conteúdos inseguros são removidos, e o editor reconstrói a marcação não suportada a partir de uma lista de permitidos em vez de inseri-la como HTML.',
      ],
      whyItMatters: [
        'SVGs animados ficam nítidos em qualquer tamanho e costumam pesar muito menos que um vídeo ou GIF da mesma animação, o que os torna ideais para logos, ícones, indicadores de carregamento e ilustrações na web.',
        'Desenvolvedores precisam da animação como código, não só como vídeo: um componente React, um módulo JavaScript, um arquivo Lottie ou um widget Flutter entra direto em um aplicativo.',
        'Fazer a exportação no navegador significa que sua arte fica no seu dispositivo; só a contagem de cada exportação é enviada para nós, para aplicar a cota diária.',
      ],
      useCases: [
        {
          title: 'Animação de logos e ícones',
          description: 'Desenhe um logo com uma animação de traço, ou faça um ícone quicar, girar ou mudar de cor ao passar o mouse.',
        },
        {
          title: 'Indicadores de carregamento e microanimações de interface',
          description: 'Crie spinners e animações de progresso e exporte como SVG só com CSS ou como componente React.',
        },
        {
          title: 'Lottie para aplicativos de celular',
          description: 'Exporte Lottie JSON para os players Lottie de iOS, Android, web e Flutter, ou edite um arquivo Lottie existente.',
        },
        {
          title: 'Ilustrações animadas',
          description: 'Mova partes de uma ilustração ao longo de caminhos, transforme formas umas nas outras e exporte um GIF para chat ou e-mail.',
        },
      ],
      whyMediaManipulator: [
        'Um editor de verdade, com camadas e keyframes, retenções, curvas personalizadas e animadores avançados, não uma galeria de modelos.',
        'Exportações tanto para designers quanto para desenvolvedores: SVG animado, Lottie, React, JavaScript ou TypeScript, Flutter e GIF a partir de um mesmo projeto.',
        'As exportações são feitas no seu navegador, e o único código de terceiros que uma exportação usa tem licença permissiva (anime.js sob MIT; flutter_svg e webview_flutter para Flutter), com o aviso de licença preservado no arquivo.',
      ],
      privacyNote: 'A edição e a exportação acontecem no seu navegador; sua arte não é enviada para ser exportada. Sem conta, os projetos ficam guardados só neste navegador. Se você entrar e salvar um projeto na sua conta, ele é armazenado nos nossos servidores como um projeto do Darkroom, segue o período de retenção que você escolher e pode ser excluído na sua página Conta. De cada exportação registramos apenas formato, tamanho, duração e horário, para aplicar a cota diária.',
      faq: [
        {
          question: 'O Motion é gratuito?',
          answer: 'Sim. Abrir o Motion, desenhar, animar, salvar e exportar um SVG estático é gratuito e ilimitado, sem conta. As exportações animadas contam em uma cota diária que depende do seu plano; a tabela de planos desta página mostra a cota e os formatos de cada plano.',
        },
        {
          question: 'Quais formatos posso exportar?',
          answer: 'SVG estático, SVG animado (CSS ou um pequeno script embutido quando necessário), Lottie JSON, componente React (.tsx), módulo JavaScript ou TypeScript, widget Flutter (.dart) e GIF animado. Quais deles seu plano inclui e o número diário de exportações aparecem na tabela de planos desta página.',
        },
        {
          question: 'Quais são os limites?',
          answer: 'As exportações animadas são contadas por dia e renovadas à meia-noite UTC. Visitantes sem conta só podem salvar projetos no navegador; os planos com login salvam um número de projetos na conta. Visitantes também têm uma duração máxima de animação para exportar, e a exportação em GIF tem limite de tamanho e duração. Todos os números atuais estão na tabela de planos desta página e na página de preços.',
        },
        {
          question: 'Posso animar um SVG que já tenho?',
          answer: 'Sim. Importe qualquer SVG e seus grupos, caminhos, formas, texto, gradientes, máscaras e caminhos de recorte viram camadas editáveis. As partes que o editor não consegue editar, como padrões ou filtros complexos, são mantidas e exportadas sem alteração, e tudo o que não for seguro (scripts ou links externos) é removido e listado após a importação.',
        },
        {
          question: 'É compatível com Lottie?',
          answer: 'Sim, nos dois sentidos. Você pode importar um arquivo Lottie JSON para editá-lo e exportar sua animação como Lottie JSON para o lottie-web e os players Lottie de iOS, Android e Flutter. Os recursos que um dos lados não consegue representar são listados na caixa de diálogo em vez de descartados em silêncio.',
        },
        {
          question: 'Quais navegadores suportam a exportação de vídeo?',
          answer: 'A exportação em GIF funciona em todos os navegadores modernos. A exportação em MP4 e WebM depende do WebCodecs, o codificador de vídeo embutido do navegador, disponível no Chrome e no Edge e em versões recentes do Safari e do Firefox, dependendo do codec; a caixa de exportação verifica seu navegador e avisa quando não consegue codificar. A tabela de planos desta página mostra qual plano inclui cada formato de vídeo.',
        },
        {
          question: 'Qual licença se aplica ao código exportado?',
          answer: 'Sua animação é sua. Quando um SVG animado ou uma exportação de código precisa de um runtime, ele usa o anime.js, licenciado sob MIT; o aviso de copyright dele é gravado no início do arquivo e deve ser mantido lá. As exportações para Flutter usam o pacote flutter_svg (MIT) ou o webview_flutter (BSD-3-Clause). Todo o resto do arquivo é gerado a partir do seu projeto. As bibliotecas de código aberto que o editor usa estão listadas na nossa página de licenças.',
        },
        {
          question: 'Onde meus projetos ficam armazenados?',
          answer: 'Sem conta, os projetos ficam guardados só neste navegador, então limpar os dados do navegador os apaga. Se você estiver conectado, pode salvar um projeto na sua conta; ele então sincroniza entre dispositivos, salva automaticamente enquanto você trabalha, segue o período de retenção que você escolheu e pode ser excluído na sua página Conta.',
        },
      ],
      supportedFormats: {
        supportedInputFormats: [
          'SVG',
          'Lottie JSON',
          'Projeto do Motion (.json)',
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
          'Importações de SVG e Lottie de até 4 MB cada.',
          'Projetos sem conta vivem só neste navegador; projetos com login seguem o período de retenção que você escolher.',
        ],
        processingNotes: [
          'A edição, a pré-visualização e todas as exportações rodam no seu navegador. Só a contagem de cada exportação é enviada aos nossos servidores.',
        ],
      },
      embed: {
        title: 'Abrir o Motion',
        description: 'Comece um novo desenho ou reabra um recente. O editor abre em tela cheia; seu trabalho fica guardado neste navegador e, se você estiver conectado, pode salvá-lo na sua conta.',
      },
      related: [
        {
          label: 'Tutorial do Motion',
          to: '/tutorials/motion',
          description: 'Importe um SVG, anime, ajuste a suavização e exporte, passo a passo.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Edite vídeo em uma linha do tempo multitrilha e exporte em MP4.',
        },
        {
          label: 'Converter vídeo em GIF animado',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Transforme um clipe de vídeo em GIF quando sua animação começou como filmagem.',
        },
        {
          label: 'Licenças de código aberto',
          to: '/licenses',
          description: 'As bibliotecas que o editor executa e grava nas suas exportações.',
        },
      ],
      metaTitle: 'Motion: editor de animação SVG online e grátis | Media Manipulator',
      metaDescription: 'Anime SVG no seu navegador: keyframes, suavização, retenções, caminhos de movimento e morphs. Exporte SVG animado, Lottie JSON, React, JS, Flutter ou GIF.',
      ogTitle: 'Motion: anime SVG no seu navegador',
      ogDescription: 'Importe um SVG ou desenhe um, anime em uma linha do tempo de keyframes e exporte SVG animado, Lottie JSON, React, JavaScript, Flutter ou GIF. As exportações são feitas no seu navegador.',
    },
    // 2026-10-28 catalog expansion: name + tagline for the /tools catalog cards (model-written, needs native review).
    'inspect-metadata': {
      name: 'Inspetor de metadados',
      tagline: 'Veja todas as tags escondidas em uma foto, vídeo, arquivo de áudio ou PDF: EXIF, localização GPS, câmera, codecs, ID3, XMP e muito mais, antes de compartilhar.',
    },
    'edit-image-metadata': {
      name: 'Editar metadados de imagem',
      tagline: 'Defina o título, o autor, os direitos autorais, as palavras-chave e a descrição de uma foto, corrija ou remova a localização GPS e reescreva as tags EXIF e IPTC.',
    },
    'change-video-speed': {
      name: 'Alterar a velocidade do vídeo',
      tagline: 'Crie um time-lapse a 2x, 4x ou mais, ou deixe um clipe mais lento, a 0,5x ou 0,25x, com o áudio sincronizado.',
    },
    'reverse-video': {
      name: 'Inverter vídeo',
      tagline: 'Reproduza qualquer clipe de trás para frente, com ou sem o áudio invertido, e, se quiser, em vaivém: para frente e depois para trás.',
    },
    'flip-video': {
      name: 'Virar e espelhar vídeo',
      tagline: 'Espelhe um vídeo na horizontal para corrigir uma webcam ou selfie invertida, ou vire-o na vertical, com um clique.',
    },
    'stabilize-video': {
      name: 'Estabilizar vídeo',
      tagline: 'Suavize o tremor das mãos e o balanço de quem anda com um estabilizador de duas passagens, sem tripé nem editor de desktop.',
    },
    'change-video-frame-rate': {
      name: 'Alterar a taxa de quadros do vídeo',
      tagline: 'Converta um vídeo para 24, 25, 30 ou 60 fps, reduza um clipe de 60 fps para 30 e gere um arquivo menor, ou ajuste à taxa de quadros do projeto.',
    },
    'adjust-video-color': {
      name: 'Ajustar brilho e cor do vídeo',
      tagline: 'Clareie um clipe escuro, aumente o contraste e a saturação, mude a tonalidade, ou aplique um desfoque ou um visual artístico, com controles deslizantes e prévia ao vivo.',
    },
    'convert-video-to-hevc': {
      name: 'Converter vídeo para HEVC (H.265)',
      tagline: 'Recodifique qualquer vídeo em H.265 e obtenha cerca de metade do tamanho do H.264 com a mesma qualidade, para armazenamento, 4K e dispositivos modernos.',
    },
    'convert-audio-to-wav': {
      name: 'Converter áudio para WAV',
      tagline: 'Converta MP3, M4A, WAV, OGG, FLAC e qualquer outro arquivo de áudio para WAV sem perder nada.',
    },
    'convert-audio-to-flac': {
      name: 'Converter áudio para FLAC',
      tagline: 'Converta MP3, M4A, WAV, OGG, FLAC e qualquer outro arquivo de áudio para FLAC sem perder nada.',
    },
    'convert-audio-to-ogg': {
      name: 'Converter áudio para OGG',
      tagline: 'Converta MP3, M4A, WAV, OGG, FLAC e qualquer outro arquivo de áudio para OGG na taxa de bits que você escolher.',
    },
    'convert-audio-to-m4a': {
      name: 'Converter áudio para M4A / AAC',
      tagline: 'Converta MP3, M4A, WAV, OGG, FLAC e qualquer outro arquivo de áudio para M4A / AAC na taxa de bits que você escolher.',
    },
    'convert-audio-to-opus': {
      name: 'Converter áudio para Opus',
      tagline: 'Converta MP3, M4A, WAV, OGG, FLAC e qualquer outro arquivo de áudio para Opus na taxa de bits que você escolher.',
    },
    'convert-mp3-to-wav': {
      name: 'Converter MP3 para WAV',
      tagline: 'Transforme um MP3 em um WAV sem compressão para edição, sampling ou gravação em CD.',
    },
    'change-audio-speed': {
      name: 'Alterar a velocidade do áudio',
      tagline: 'Acelere uma aula ou um podcast para 1,5x, ou deixe uma música ou gravação mais lenta, a 0,75x, para praticar, sem alterar o tom.',
    },
    'change-audio-pitch': {
      name: 'Alterar o tom do áudio',
      tagline: 'Desloque uma música ou gravação em semitons para mudar a tonalidade, abaixar um vocal ou afinar um sample, mantendo o andamento.',
    },
    'normalize-audio': {
      name: 'Normalizar áudio',
      tagline: 'Leve uma gravação baixa a um volume consistente, para que podcasts, notas de voz e playlists variadas toquem no mesmo nível.',
    },
    'adjust-audio-volume': {
      name: 'Ajustar o volume do áudio',
      tagline: 'Deixe um arquivo de áudio mais alto ou mais baixo em uma quantidade fixa, de 10 por cento ao dobro, ou em decibéis com o controle de amplificação.',
    },
    'audio-equalizer': {
      name: 'Equalizador de áudio',
      tagline: 'Aplique reforço de graves, realce de agudos, presença vocal ou uma predefinição de gênero, ou defina filtros passa-baixa e passa-alta, e baixe o resultado.',
    },
    'add-reverb-to-audio': {
      name: 'Adicionar reverberação ao áudio',
      tagline: 'Coloque um vocal seco ou uma gravação em uma sala, salão, placa ou mola de reverberação, ou adicione um delay ou eco, e baixe o resultado.',
    },
    'trim-audio': {
      name: 'Cortar áudio',
      tagline: 'Corte um MP3, WAV ou qualquer gravação entre um tempo inicial e final, com uma forma de onda para escolher os pontos, e baixe só essa parte.',
    },
    'transcribe-audio': {
      name: 'Transcrever áudio',
      tagline: 'Converta um MP3, WAV, M4A ou qualquer gravação em texto, legendas ou JSON com reconhecimento de fala por IA nos nossos próprios servidores GPU.',
    },
    'add-text-to-image': {
      name: 'Adicionar texto à imagem',
      tagline: 'Coloque uma legenda, um título ou uma marca d\'água em uma foto: escolha a fonte, o tamanho, a cor, o contorno e a posição, e baixe.',
    },
    'crop-image': {
      name: 'Recortar imagem',
      tagline: 'Arraste uma caixa sobre a parte da foto que você quer, endireite o enquadramento e baixe só essa região em qualquer formato.',
    },
    'grayscale-image': {
      name: 'Converter imagem para preto e branco',
      tagline: 'Converta uma foto colorida em tons de cinza, ou em sépia para um tom vintage, e baixe em qualquer formato.',
    },
    'image-filters': {
      name: 'Filtros e efeitos de imagem',
      tagline: 'Pintura a óleo, esboço, carvão, relevo, vintage, redemoinho, desfoque, nitidez e mais, aplicados a qualquer foto com um clique.',
    },
    'rotate-image': {
      name: 'Girar imagem',
      tagline: 'Gire uma foto 90°, 180° ou 270°, corrija um scan ou foto de celular deitada, e baixe em qualquer formato.',
    },
    'sharpen-image': {
      name: 'Aumentar a nitidez da imagem',
      tagline: 'Realce as bordas de uma foto ou scan levemente desfocado com um clique e baixe em qualquer formato.',
    },
    'blur-image': {
      name: 'Desfocar imagem',
      tagline: 'Suavize uma foto inteira para um fundo, um placeholder ou uma tela de privacidade, e baixe em qualquer formato.',
    },
    'generate-vtt-captions': {
      name: 'Gerador de legendas VTT',
      tagline: 'Crie um arquivo de legendas .vtt para vídeo HTML5, YouTube ou um player com transcrição por IA nos nossos próprios servidores GPU.',
    },
    // MM75: summarize-video / summarize-audio full page bodies (model-written, needs native review).
    'summarize-video': {
      name: 'Resumir Vídeo',
      h1: 'Resuma um vídeo com IA: capítulos, tópicos e texto na tela',
      tagline: 'Receba um resumo escrito de uma aula, reunião ou tutorial, com capítulos clicáveis, tópicos e texto na tela, feito nos nossos próprios servidores GPU.',
      metaTitle: 'Resumidor de vídeo com IA e capítulos | Media Manipulator',
      metaDescription: 'Envie um vídeo e receba um resumo escrito com capítulos marcados por tempo, tópicos e o texto exibido na tela. A IA roda nos nossos próprios servidores GPU, nunca em uma IA de terceiros. Conta gratuita necessária.',
      ogTitle: 'Resuma um vídeo com IA',
      ogDescription: 'Um resumo escrito com capítulos clicáveis, tópicos e texto na tela. Conta gratuita necessária.',
      embed: {
        title: 'Resumir um vídeo',
        description: 'Entre, envie um vídeo (ou um arquivo de áudio) e escolha o idioma do resumo. Você recebe um título, um resumo curto, capítulos que levam ao momento certo do vídeo, os tópicos e o texto que aparece na tela.',
      },
      intro: 'Ninguém quer rever uma hora de reunião ou aula para encontrar os cinco minutos que importaram. O Media Manipulator assiste e ouve por você: transcreve a fala com Whisper, analisa com um modelo de visão quadros escolhidos onde a imagem muda e escreve um resumo a partir dos dois, tudo em um servidor GPU que nós operamos. O resultado é um documento curto: um título, algumas frases, capítulos com horários de início e fim, os tópicos e o texto que apareceu na tela. Clique em um capítulo para ir àquele momento do seu vídeo, copie tudo como Markdown ou baixe como Markdown ou JSON. Os resumos exigem uma conta gratuita.',
      whatItDoes: [
        'Escreve um título e um resumo de três a seis frases de todo o vídeo.',
        'Divide o vídeo em capítulos com horários de início e fim; clicar em um leva o player àquele momento.',
        'Lista os tópicos e o texto que aparece na tela, com o horário da primeira aparição.',
        'Descreve a imagem e a fala e anota o que não foi possível fazer (por exemplo, ausência de fala).',
        'Escreve o resumo no idioma que você escolher ou no idioma falado.',
      ],
      flowSteps: [
        {
          title: 'Entre',
          description: 'Uma conta gratuita basta.',
        },
        {
          title: 'Envie',
          description: 'Um vídeo ou um arquivo de áudio.',
        },
        {
          title: 'Resuma',
          description: 'A fala e os quadros são analisados no nosso servidor GPU.',
        },
        {
          title: 'Leia',
          description: 'Clique nos capítulos, copie o Markdown, baixe .md ou .json.',
        },
      ],
      advancedDetails: [
        'A fala é transcrita com Whisper; os quadros são escolhidos nas mudanças de cena, até o limite de quadros do seu plano (24 no Free, 48 no Premium, 96 no Pro), e descritos em lotes por um modelo de visão.',
        'Um modelo de linguagem escreve o resumo a partir da transcrição e das anotações dos quadros. Contas Pro podem pedir um resumo mais profundo, feito por um modelo maior, quando disponível.',
        'Um resumo conta como uma tarefa de IA da sua cota diária; uma tarefa com falha ou recusada não é contabilizada.',
        'A transcrição é gerada por máquina, então nomes e números podem estar errados. O resumo avisa isso nas observações.',
      ],
      whyItMatters: [
        'Um resumo com capítulos se lê em um minuto; o vídeo, não.',
        'Marcações de tempo clicáveis levam direto à parte de que você precisa.',
        'O texto na tela captura títulos de slides e legendas que a fala nunca diz em voz alta.',
      ],
      useCases: [
        {
          title: 'Resumo de reunião',
          description: 'Decisões e tópicos, com horários para conferir os detalhes.',
        },
        {
          title: 'Notas de aula',
          description: 'Capítulos por seção e o texto dos slides, para estudar.',
        },
        {
          title: 'Roteiro de tutorial',
          description: 'Os passos como capítulos, para ir direto ao que você precisa.',
        },
        {
          title: 'Visão geral de entrevista',
          description: 'O que foi discutido e onde.',
        },
      ],
      whyMediaManipulator: [
        'Whisper e os modelos de visão e linguagem rodam em hardware que nós operamos; seu vídeo nunca é enviado a uma IA de terceiros.',
        'Capítulos que navegam no seu próprio vídeo, direto no visualizador de resultados.',
        'Downloads em Markdown e JSON. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'Os resumos exigem uma conta gratuita, então a tarefa fica vinculada a ela. Seu arquivo é processado nos nossos próprios servidores e os modelos de IA rodam em um servidor GPU que nós operamos; nada é enviado a um provedor de IA de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'Preciso de uma conta?',
          answer: 'Sim, uma conta gratuita. Os resumos executam vários modelos de IA no nosso servidor GPU, por isso são limitados a usuários conectados.',
        },
        {
          question: 'O que eu recebo?',
          answer: 'Um título, um resumo curto, capítulos com horários de início e fim, tópicos, texto na tela com horários, uma descrição da imagem e da fala e observações sobre qualquer coisa que não foi possível fazer.',
        },
        {
          question: 'Posso escolher o idioma do resumo?',
          answer: 'Sim. Escolha um dos 18 idiomas do site ou "o mesmo da fala" para escrever no idioma falado.',
        },
        {
          question: 'E se o vídeo não tiver fala?',
          answer: 'O resumo é escrito só a partir da imagem e avisa isso nas observações. Um arquivo sem imagem nem som é recusado e não é contabilizado.',
        },
        {
          question: 'Meu vídeo é enviado a terceiros?',
          answer: 'Não. Todos os modelos rodam em um servidor GPU que nós operamos.',
        },
        {
          question: 'Isso conta na minha cota?',
          answer: 'Sim, como uma tarefa de IA. Tarefas com falha não são contabilizadas.',
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
          description: 'Para arquivos de áudio.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Limpe o áudio primeiro.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Conta como uma tarefa de IA; tarefas com falha não são contabilizadas.',
          'Duração até o limite de duração de vídeo do seu plano.',
        ],
      },
    },
    'summarize-audio': {
      name: 'Resumir Áudio',
      h1: 'Resuma uma gravação de áudio com IA',
      tagline: 'Transforme um podcast, entrevista ou nota de voz em um resumo escrito com capítulos e tópicos, feito nos nossos próprios servidores GPU.',
      metaTitle: 'Resumidor de áudio com IA e capítulos | Media Manipulator',
      metaDescription: 'Envie um MP3, WAV ou M4A e receba um resumo escrito com capítulos marcados por tempo e tópicos. Whisper e o modelo de linguagem rodam nos nossos próprios servidores GPU. Conta gratuita necessária.',
      ogTitle: 'Resuma uma gravação de áudio com IA',
      ogDescription: 'Um resumo escrito com capítulos e tópicos para qualquer gravação. Conta gratuita necessária.',
      embed: {
        title: 'Resumir um arquivo de áudio',
        description: 'Entre, envie uma gravação e escolha o idioma do resumo. Você recebe um título, um resumo curto, capítulos que levam ao momento certo da gravação e os tópicos.',
      },
      intro: 'Um episódio de podcast, uma entrevista ou uma longa nota de voz é mais fácil de usar como página do que como uma hora de áudio. O Media Manipulator transcreve a gravação com Whisper e faz um modelo de linguagem escrever um resumo a partir da transcrição, ambos em um servidor GPU que nós operamos. Você recebe um título, algumas frases, capítulos com horários de início e fim e os tópicos. Clique em um capítulo para ir àquele ponto da gravação, copie o resumo como Markdown ou baixe como Markdown ou JSON. Os resumos exigem uma conta gratuita.',
      whatItDoes: [
        'Escreve um título e um resumo curto da gravação.',
        'Divide-a em capítulos com horários; clicar em um leva o player até lá.',
        'Lista os tópicos e descreve quem fala e em que tom.',
        'Escreve o resumo no idioma que você escolher ou no idioma falado.',
      ],
      flowSteps: [
        {
          title: 'Entre',
          description: 'Uma conta gratuita basta.',
        },
        {
          title: 'Envie',
          description: 'MP3, WAV, M4A e outros formatos de áudio.',
        },
        {
          title: 'Resuma',
          description: 'Whisper e um modelo de linguagem no nosso servidor GPU.',
        },
        {
          title: 'Leia',
          description: 'Clique nos capítulos, copie o Markdown, baixe .md ou .json.',
        },
      ],
      advancedDetails: [
        'A fala é transcrita com Whisper; um modelo de linguagem escreve o resumo a partir da transcrição.',
        'Um arquivo de áudio com capa é tratado como áudio: a imagem é ignorada.',
        'Um resumo conta como uma tarefa de IA da sua cota diária; uma tarefa com falha ou recusada não é contabilizada.',
        'A transcrição é gerada por máquina, então nomes e números podem estar errados. O resumo avisa isso nas observações.',
      ],
      whyItMatters: [
        'Você lê um resumo em um minuto e decide o que ouvir.',
        'Capítulos com horários transformam uma gravação longa em algo navegável.',
        'Os tópicos tornam pesquisável um acervo de episódios.',
      ],
      useCases: [
        {
          title: 'Notas do episódio de podcast',
          description: 'Capítulos e tópicos para a página do episódio.',
        },
        {
          title: 'Resumo de entrevista',
          description: 'O que foi abordado, com horários para citar.',
        },
        {
          title: 'De nota de voz a anotações',
          description: 'Uma nota divagante transformada em uma página curta.',
        },
        {
          title: 'Resumo de chamada',
          description: 'Os pontos de uma chamada gravada.',
        },
      ],
      whyMediaManipulator: [
        'Whisper e o modelo de linguagem rodam em hardware que nós operamos; sua gravação nunca é enviada a uma IA de terceiros.',
        'Capítulos que navegam na sua própria gravação, direto no visualizador de resultados.',
        'Downloads em Markdown e JSON. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'Os resumos exigem uma conta gratuita, então a tarefa fica vinculada a ela. Seu arquivo é processado nos nossos próprios servidores e os modelos de IA rodam em um servidor GPU que nós operamos; nada é enviado a um provedor de IA de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'Preciso de uma conta?',
          answer: 'Sim, uma conta gratuita. Os resumos executam modelos de IA no nosso servidor GPU, por isso são limitados a usuários conectados.',
        },
        {
          question: 'Qual a diferença para a transcrição?',
          answer: 'A transcrição entrega cada palavra. O resumo entrega um título, algumas frases, capítulos e tópicos, escritos a partir dessa transcrição.',
        },
        {
          question: 'Posso escolher o idioma do resumo?',
          answer: 'Sim. Escolha um dos 18 idiomas do site ou "o mesmo da fala".',
        },
        {
          question: 'Minha gravação é enviada a terceiros?',
          answer: 'Não. Os modelos rodam em um servidor GPU que nós operamos.',
        },
        {
          question: 'Isso conta na minha cota?',
          answer: 'Sim, como uma tarefa de IA. Tarefas com falha não são contabilizadas.',
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
          description: 'Adiciona a imagem e o texto na tela.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Limpe o áudio primeiro.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Conta como uma tarefa de IA; tarefas com falha não são contabilizadas.',
        ],
      },
    },
    // MM78 voices: name + tagline (model-written, needs native review).
    'voice-cloning': {
      name: 'Clonagem de voz',
      tagline:
        'Grave ou envie de 5 a 60 segundos da sua própria fala, crie uma voz e faça-a ler qualquer texto em mais de vinte idiomas.',
    },
    'voice-designer': {
      name: 'Criador de vozes',
      tagline:
        'Descreva uma voz em palavras, ouça uma prévia e guarde a que você gostar para ler qualquer texto em mais de vinte idiomas.',
    },
    'voice-changer': {
      name: 'Alterador de voz',
      tagline:
        'Altere instantaneamente o tom e o caráter de uma gravação ou converta a fala com IA para uma voz salva ou predefinida.',
    },
    // MM84: name / tagline / metaTitle / metaDescription for the copy-bar tool pages (model-written, needs native review).
    'content-studio': {
      name: 'Darkroom',
      tagline: 'Edite, sobreponha e mixe vídeo e áudio em uma linha do tempo multipista e depois exporte em MP4. Um editor no estilo Premiere Pro, direto no navegador.',
      metaTitle: 'Darkroom: editor de vídeo multipista online e grátis | Media Manipulator',
      metaDescription: 'Edite, sobreponha e mixe vídeo e áudio em uma linha do tempo multipista e depois exporte em MP4: um editor de vídeo gratuito no estilo Premiere Pro que roda direto no navegador. Sem cadastro e sem instalação.',
    },
    'remove-exif-metadata': {
      name: 'Remover metadados EXIF de imagens',
      tagline: 'Elimine localização GPS e dados de dispositivo, câmera e data e hora das fotos antes de compartilhá-las em qualquer lugar.',
      metaTitle: 'Remover metadados EXIF de imagens online (grátis) | Media Manipulator',
      metaDescription: 'Ferramenta online gratuita para remover metadados EXIF, GPS, IPTC e de câmera de imagens JPG, PNG, WebP e HEIC. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
    },
    'compress-image': {
      name: 'Comprimir imagem',
      tagline: 'Reduza o tamanho de arquivos JPG, PNG e WebP para sites mais rápidos, envios menores e compartilhamento mais fácil.',
      metaTitle: 'Comprimir imagem online grátis | Media Manipulator',
      metaDescription: 'Compressor de imagens online gratuito. Reduza o tamanho de arquivos JPG, PNG e WebP mantendo boa qualidade. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
    },
    'image-resizer': {
      name: 'Redimensionar imagem',
      tagline: 'Redimensione imagens JPG, PNG, WebP e GIF para dimensões exatas em pixels mantendo a proporção.',
      metaTitle: 'Redimensionar imagem online grátis | Media Manipulator',
      metaDescription: 'Redimensionador de imagens online gratuito. Redimensione imagens JPG, PNG, WebP e GIF para dimensões exatas em pixels mantendo a proporção. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
    },
    'remove-background-from-image': {
      name: 'Remover fundo de imagem',
      tagline: 'Apague automaticamente o fundo de qualquer foto e baixe um recorte em PNG limpo e transparente.',
      metaTitle: 'Remover fundo de imagem online grátis | Media Manipulator',
      metaDescription: 'Removedor de fundo online gratuito. Apague automaticamente o fundo de qualquer foto e baixe um PNG transparente. Roda na nossa própria GPU, sem IA de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
    },
    'image-to-pdf': {
      name: 'Imagem para PDF',
      tagline: 'Transforme imagens JPG, PNG e outras em um documento PDF limpo e fácil de compartilhar, com um clique.',
      metaTitle: 'Converter imagem em PDF online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de imagem para PDF. Transforme imagens JPG, PNG e outras em um documento PDF limpo. Sem cadastro e sem marcas d\'água. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
    },
    'pdf-to-jpg': {
      name: 'PDF para JPG',
      tagline: 'Converta cada página de um PDF em imagens JPG de alta qualidade para compartilhar, editar ou publicar.',
      metaTitle: 'Converter PDF em JPG online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de PDF para JPG. Converta cada página de um PDF em imagens JPG de alta qualidade, baixadas em um ZIP. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
    },
    'compress-video': {
      name: 'Comprimir vídeo',
      tagline: 'Reduza o tamanho de arquivos MP4, WebM, MOV, MKV e AVI para web, e-mail, redes sociais e envios para a nuvem.',
      metaTitle: 'Comprimir vídeo online (grátis) | Media Manipulator',
      metaDescription: 'Compressor de vídeo online gratuito. Reduza o tamanho de arquivos MP4, WebM, MOV, MKV e AVI mantendo boa qualidade. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
    },
    'video-trimmer': {
      name: 'Cortar vídeo',
      tagline: 'Corte um clipe para ficar só com a parte que você quer, com um corte rápido que preserva a qualidade, sem recodificar quando possível.',
      metaTitle: 'Cortar vídeo online grátis | Media Manipulator',
      metaDescription: 'Cortador de vídeo online gratuito. Defina um tempo de início e de fim e corte seu clipe de forma rápida e sem perdas. Saída em MP4, sem marca d\'água e sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
    },
    'extract-audio-from-video': {
      name: 'Extrair áudio de vídeo',
      tagline: 'Salve a faixa de áudio de qualquer vídeo como um arquivo MP3, WAV, M4A, AAC, FLAC ou OGG limpo.',
      metaTitle: 'Extrair áudio de vídeo: MP3, WAV, M4A e mais | Media Manipulator',
      metaDescription: 'Ferramenta online gratuita para extrair o áudio de qualquer arquivo de vídeo (MP4, MOV, MKV, WebM, AVI). Saída em MP3, WAV, M4A, AAC, FLAC ou OGG. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
    },
    'convert-video-to-animated-gif': {
      name: 'Converter vídeo em GIF animado',
      tagline: 'Transforme clipes curtos em MP4, WebM, MOV ou MKV em GIFs animados fáceis de compartilhar em segundos.',
      metaTitle: 'Converter vídeo em GIF animado online (grátis) | Media Manipulator',
      metaDescription: 'Conversor online gratuito de vídeo para GIF. Transforme clipes curtos em MP4, WebM, MOV e MKV em GIFs animados, com controle de tamanho e taxa de quadros.',
    },
    'transcribe-video': {
      name: 'Transcrever vídeo',
      tagline: 'Extraia a fala de um vídeo ou arquivo de áudio como legendas WebVTT ou SRT, texto simples ou JSON com marcações de tempo.',
      metaTitle: 'Transcrever vídeo em texto online (grátis) | Media Manipulator',
      metaDescription: 'Transcrição de vídeo online gratuita. Converta arquivos MP4, MOV, WebM, MKV e de áudio em texto pesquisável, legendas VTT ou transcrições em JSON.',
    },
    'transcode-to-hls': {
      name: 'Transcodificar vídeo para HLS',
      tagline: 'Empacote qualquer vídeo em um pacote Apple HLS VOD: master.m3u8 e segmentos .ts por rendition, prontos para a web.',
      metaTitle: 'Transcodificar vídeo para HLS online | Ferramenta gratuita de streaming adaptativo',
      metaDescription: 'Transcodificador HLS online gratuito. Converta MP4, MOV, WebM e MKV em um pacote HLS VOD com renditions de 360p/480p/720p, com legendas e storyboards opcionais.',
    },
    'ai-video-restoration': {
      name: 'Restauração de vídeo com IA',
      tagline: 'Amplie e restaure um trecho curto de vídeo com até seis modelos de IA (Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT e VRT) e compare cada resultado lado a lado.',
      metaTitle: 'Restauração de vídeo com IA: compare 6 modelos de upscaling online | Media Manipulator',
      metaDescription: 'Ferramenta gratuita de restauração de vídeo com IA. Passe um clipe curto pelos modelos de super-resolução Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT e VRT na nossa própria GPU e baixe todos os resultados em um único pacote.',
    },
    'ai-image-restoration': {
      name: 'Restauração e upscaling de imagens com IA',
      tagline: 'Limpe, amplie e restaure uma foto com até oito modelos de IA: pré-limpeza fiel (FBCNN, SCUNet, NAFNet), upscalers gerais (Real-ESRGAN, SwinIR, HAT) e melhoria de rostos (GFPGAN, CodeFormer), e compare cada resultado com o original.',
      metaTitle: 'Restauração e upscaling de imagens com IA: compare 8 modelos | Media Manipulator',
      metaDescription: 'Restauração e ampliação de fotos com IA, grátis. Remova artefatos JPEG, ruído e desfoque, amplie até 4K/8K com Real-ESRGAN, SwinIR ou HAT e melhore rostos com GFPGAN/CodeFormer, tudo na nossa própria GPU e comparado lado a lado.',
    },
    'ai-document-scan': {
      name: 'Digitalização de documentos com IA',
      tagline: 'Transforme documentos digitalizados e anotações manuscritas em um PDF de várias páginas pesquisável e em um documento Word editável: páginas impressas recebem uma camada de texto Tesseract fiel, e a escrita à mão é transcrita por uma IA de visão com a incerteza marcada, nunca inventada.',
      metaTitle: 'Digitalização de documentos com IA: páginas escaneadas e manuscritos em PDF/Word | Media Manipulator',
      metaDescription: 'Digitalização de documentos com IA, grátis: converta imagens escaneadas em PDF pesquisável e em Word com OCR, e transcreva anotações manuscritas em texto. Reordene páginas, misture texto impresso e manuscrito, tudo na nossa própria GPU, literalmente e com a incerteza marcada.',
    },
    'ai-image-upscaler': {
      name: 'Upscaler de imagens com IA',
      tagline: 'Amplie uma foto pequena ou suave com um modelo Real-ESRGAN que reconstrói detalhes finos em vez de apenas esticar os pixels.',
      metaTitle: 'Upscaler de imagens com IA: amplie fotos em 2x ou 4x | Media Manipulator',
      metaDescription: 'Amplie uma foto de baixa resolução em 2x ou 4x com uma IA que restaura bordas e texturas. Roda na nossa própria GPU, saída em PNG. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
    },
    'blur-faces-in-photo': {
      name: 'Desfocar rostos em foto',
      tagline: 'Detecte rostos automaticamente e depois desfoque, pixelize ou cubra de preto todos eles ou só os que você escolher.',
      metaTitle: 'Desfocar rostos em uma foto online | Media Manipulator',
      metaDescription: 'Desfoque, pixelize ou cubra de preto os rostos em uma foto. Detecte cada rosto e escolha quais ocultar. A IA roda na nossa própria GPU. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
    },
    'redact-text-in-image': {
      name: 'Ocultar texto em imagem',
      tagline: 'Encontre texto legível em uma captura de tela ou foto e cubra dados pessoais, ou todo o texto, com desfoque ou uma tarja preta.',
      metaTitle: 'Ocultar texto em uma imagem online | Media Manipulator',
      metaDescription: 'Encontre automaticamente o texto em uma imagem e cubra de preto ou desfoque nomes, e-mails, números e outros dados pessoais. IA na nossa própria GPU. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
    },
    'remove-object-from-photo': {
      name: 'Remover objeto de foto',
      tagline: 'Desenhe uma caixa em volta do que você não quer na imagem e um modelo de inpainting preenche o espaço com um fundo compatível.',
      metaTitle: 'Remover objeto de uma foto online | Media Manipulator',
      metaDescription: 'Apague objetos indesejados de uma foto. Desenhe um retângulo e o inpainting com IA preenche o espaço combinando com o fundo. Roda na nossa própria GPU. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
    },
    'clean-voice-audio': {
      name: 'Limpar áudio de voz',
      tagline: 'Deixe a fala mais clara reduzindo chiado, som ambiente e ruído grave em podcasts, entrevistas e memorandos de voz.',
      metaTitle: 'Limpar gravações de voz com IA | Media Manipulator',
      metaDescription: 'Limpe uma gravação de voz com IA. Reduza chiado, zumbido e ruído do ambiente para ouvir melhor a fala. Roda na nossa própria GPU. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
    },
    'remove-background-noise': {
      name: 'Remover ruído de fundo',
      tagline: 'Reduza chiado, zumbido, trânsito e ruído do ambiente em uma gravação com um redutor de ruído por IA, mantendo o som principal em primeiro plano.',
      metaTitle: 'Remover ruído de fundo de áudio online | Media Manipulator',
      metaDescription: 'Remova o ruído de fundo do áudio. Um redutor de ruído com IA diminui chiado, zumbido e sons ambientes em gravações. Roda na nossa própria GPU. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
    },
    'remove-vocals-from-song': {
      name: 'Remover vocais de uma música',
      tagline: 'Retire o canto de uma faixa e mantenha a música, para karaokê, prática e bases. Use apenas em músicas cujos direitos você possui.',
      metaTitle: 'Remover vocais de uma música: criador de karaokê | Media Manipulator',
      metaDescription: 'Remova os vocais de uma música com IA e baixe o instrumental no mesmo formato do seu arquivo, ou em FLAC ou WAV. Faixas de karaokê e de prática, na nossa própria GPU. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
    },
  },
} as const;

export default ptBrToolPages;
