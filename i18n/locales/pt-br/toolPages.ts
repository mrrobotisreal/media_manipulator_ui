/**
 * Brazilian Portuguese partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope: MM66 (2026-10-27) added Motion's full page body; MM92 (2026-10-31)
 * added `name` + `tagline` for every tool; MM93 (2026-11-03) added the full
 * body of every non-alias tool page (98), model-written by Fable 5.1 and
 * Opus 5.5; native review pending.
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
      h1: 'Motion',
      tagline: 'Desenhe ou importe um SVG, anime em uma linha do tempo de keyframes e exporte como SVG animado, Lottie, React, JavaScript, Flutter ou GIF, tudo no seu navegador.',
      intro: 'O Motion é um editor de SVG com linha do tempo de animação, integrado ao Media Manipulator. Abra um arquivo SVG (ou uma animação Lottie) e cada forma vira uma camada que você pode selecionar, mover, recolorir e animar, ou comece com uma tela em branco e desenhe com as ferramentas de retângulo, elipse, linha, caneta e texto. Cada propriedade animada tem a própria trilha de keyframes, com predefinições de suavização, um editor de curvas para suavizações personalizadas e keyframes de retenção para saltos instantâneos. Os animadores de um clique adicionam desenho progressivo do traço, movimento ao longo de um caminho, morph de formas, mudanças de cor em gradientes, animação de máscaras e desfoque. Quando o movimento estiver do jeito que você quer, exporte como SVG animado, arquivo Lottie, componente React, módulo JavaScript ou TypeScript, widget Flutter ou GIF. A edição e todas as exportações rodam no seu navegador, então sua arte nunca é enviada para ser exportada.',
      whatItDoes: [
        'Importa arquivos SVG como uma árvore de camadas editável (grupos, caminhos, formas, texto, imagens, gradientes, máscaras e caminhos de recorte) e importa animações Lottie JSON com seus keyframes, cada arquivo com até 4 MB.',
        'Desenha artes novas com as ferramentas de retângulo, elipse, linha, caneta (Bézier) e texto, e edita os nós dos caminhos diretamente na tela.',
        'Anima posição, escala, rotação, inclinação, opacidade, preenchimento, traço e espessura do traço em uma linha do tempo de keyframes com suavização linear, de entrada, de saída, de entrada e saída, cubic-bezier personalizada e retenção.',
        'Adiciona seis animadores de um clique: desenho progressivo do traço, movimento ao longo de um caminho com giro automático opcional, morph de formas, cores dos pontos de gradiente, animação de máscaras e caminhos de recorte, e desfoque.',
        'Exporta SVG estático (sempre gratuito e nunca contabilizado), SVG animado que toca sem nenhuma biblioteca, Lottie JSON, componente React, módulo JavaScript ou TypeScript, widget Flutter e GIF animado, tudo gerado no seu computador.',
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
        'A exportação em SVG animado usa keyframes de CSS puro sempre que todos os efeitos podem ser expressos em CSS no Chrome, no Firefox e no Safari. Morphs de forma, pontos de gradiente em movimento e desfoque precisam de um script, então esses arquivos incluem uma cópia reduzida do anime.js (licença MIT, cerca de 31 KB de script, aproximadamente 13 KB após gzip) com o aviso de licença no início.',
        'O morph de formas normaliza as duas formas para o mesmo número de segmentos de curva e alinha os pontos iniciais e o sentido de rotação, para que a transformação não se retorça. Duas formas que não podem ser pareadas são mantidas em vez de transformadas.',
        'O gerador de Lottie segue a especificação Lottie 1.0.1 e o conjunto de recursos “Basic” do LottieFiles. Tudo o que o Lottie não consegue carregar (como filtros, texto ou máscaras avançadas) é listado após o download; nada é descartado em silêncio. O leitor usa a mesma lista no sentido inverso.',
        'A exportação em GIF renderiza os quadros um por vez, transfere cada um para um Worker e codifica com um codificador escrito para o Media Manipulator: uma única paleta global amostrada de cinco quadros distribuídos ao longo da duração, dithering desativado por padrão (arte vetorial chapada tem poucas cores, e o dithering acrescenta ruído), um atraso de quadro de round(100 / fps) centésimos de segundo e transparência mantida só quando o fundo da tela é transparente. A saída é limitada a 2 GB e a caixa de diálogo mostra uma estimativa de tamanho antes de você começar.',
        'Os SVGs importados são limpos na entrada: scripts, manipuladores de evento, referências externas e outros conteúdos inseguros são removidos, e o editor reconstrói a marcação não suportada a partir de uma lista de permitidos em vez de inseri-la como HTML. A marcação que ele não consegue modelar é mantida como uma camada opaca, que faz o percurso de ida e volta sem alteração.',
        'O contador de exportações é uma única transação de banco de dados: o bloqueio de formato e os limites são verificados, e depois o contador e uma linha de exportação são gravados juntos. Uma exportação recusada não grava nada e não custa nada; uma exportação que o navegador depois cancela ou que falha já foi contabilizada.',
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
      workedExamples: [
        {
          title: 'Um desenho progressivo de logo de 2 segundos como SVG animado',
          body: 'Um logotipo em texto com alguns caminhos, com o animador Desenho progressivo ao longo de 2.000 ms, exportado como SVG animado. O desenho progressivo é uma animação de stroke-dasharray e stroke-dashoffset, que o CSS consegue expressar em todos os principais navegadores, então o exportador grava um bloco <style> com @keyframes e nenhum script. O arquivo é o seu SVG mais algumas centenas de bytes de CSS, toca no instante em que entra na página e conta como uma exportação svg_animated: sem conta, é uma das 2 por dia e dentro do limite de 10 segundos de duração para visitantes; com uma conta gratuita, uma das 5. A exportação é uma transformação de texto no seu navegador e termina na hora.',
        },
        {
          title: 'Um loop de morph de 400 x 400 como GIF',
          body: 'Um morph de formas de 2 segundos em uma tela de 400 x 400, exportado como GIF a 25 fps em um plano Premium (GIF é um formato Premium por padrão). A caixa de diálogo limita às predefinições de altura e taxa de quadros do plano; 25 fps dá um atraso de round(100 / 25) = 4 centésimos de segundo por quadro e 50 quadros no total. A estimativa de tamanho é pixels x quadros x 0,25 bytes + 1 KB: 160.000 x 50 x 0,25 dá cerca de 2 MB, deliberadamente para cima, e uma arte chapada de duas cores costuma ficar bem abaixo disso. Os quadros são renderizados na thread principal e codificados em um Worker um por vez, então a memória fica em um par de quadros mais o arquivo em crescimento; o tempo é gasto rasterizando 50 quadros de SVG, alguns segundos em um notebook.',
        },
      ],
      whenNotToUse: 'O Motion anima arte vetorial; ele não edita vídeo nem fotografias. Se o seu ponto de partida é uma filmagem, o Darkroom é o editor e a página de vídeo para GIF transforma um clipe em GIF. Ele também não é um vetorizador para imagens rasterizadas complexas: uma fotografia convertida em caminhos ficará pesada e o resultado não vai animar de forma significativa. Animações que dependem de filtros, efeitos de texto ou máscaras avançadas não sobrevivem intactas a uma exportação em Lottie (a caixa de diálogo lista o que foi descartado), então para esses destinos fique com as exportações em SVG animado, React ou JavaScript. E a saída em MP4 ou WebM depende do suporte a WebCodecs do seu navegador e do seu plano, então confira a tabela de planos antes de planejar uma entrega em vídeo.',
      whyMediaManipulator: [
        'Um editor de verdade, com camadas e keyframes, retenções, curvas personalizadas e animadores avançados, não uma galeria de modelos.',
        'Exportações tanto para designers quanto para desenvolvedores: SVG animado, Lottie, React, JavaScript ou TypeScript, Flutter e GIF a partir de um mesmo projeto.',
        'As exportações são feitas no seu navegador, e o único código de terceiros que uma exportação usa tem licença permissiva (anime.js sob MIT; flutter_svg e webview_flutter para Flutter), com o aviso de licença preservado no arquivo.',
      ],
      privacyNote: 'A edição e a exportação acontecem no seu navegador; sua arte não é enviada para ser exportada. Sem conta, os projetos ficam guardados só neste navegador. Se você entrar e salvar um projeto na sua conta, o documento já higienizado (até 4 MB) e uma miniatura são armazenados nos nossos servidores como um projeto do Darkroom, seguem o período de retenção que você escolher e podem ser excluídos na sua página Conta. De cada exportação contabilizada registramos apenas formato, altura, taxa de quadros, duração e horário, com sua conta ou sessão como proprietária, para aplicar a cota diária; o registro da exportação nunca contém a arte.',
      faq: [
        {
          question: 'O Motion é gratuito?',
          answer: 'Sim. Abrir o Motion, desenhar, animar, salvar neste navegador e exportar um SVG estático é gratuito, ilimitado e não exige conta. As exportações animadas contam em uma cota diária que depende do seu plano: por padrão, 2 por dia sem conta (só SVG animado), 5 com uma conta gratuita, 30 com o Premium e 150 com o Pro. A tabela de planos desta página mostra a cota atual e os formatos de cada plano.',
        },
        {
          question: 'Quais formatos posso exportar?',
          answer: 'SVG estático, SVG animado (CSS ou um pequeno script embutido quando necessário), Lottie JSON, componente React (.tsx), módulo JavaScript ou TypeScript, widget Flutter (.dart) e GIF animado. Por padrão, o SVG animado está em todos os planos, o Lottie a partir da conta gratuita, e React, JS/TS, Flutter e GIF a partir do Premium. Quais deles seu plano inclui e o número diário de exportações aparecem na tabela de planos desta página.',
        },
        {
          question: 'Quais são os limites?',
          answer: 'As exportações animadas são contadas por dia e renovadas à meia-noite UTC; uma exportação recusada não é contabilizada, mas uma exportação que você cancela depois de a contagem ser feita é contabilizada. Visitantes sem conta salvam projetos só no navegador e podem exportar animações de até 10 segundos; uma conta gratuita salva 3 projetos na conta, o Premium 25 e o Pro sem limite. As importações de SVG e Lottie são limitadas a 4 MB cada, e a exportação em GIF a 50 fps e 2 GB de saída. Todos os números atuais estão na tabela de planos desta página e na página de preços.',
        },
        {
          question: 'Posso animar um SVG que já tenho?',
          answer: 'Sim. Importe qualquer SVG e seus grupos, caminhos, formas, texto, gradientes, máscaras e caminhos de recorte viram camadas editáveis. As partes que o editor não consegue editar, como padrões ou filtros complexos, são mantidas e exportadas sem alteração, e tudo o que não for seguro (scripts, manipuladores de evento ou links externos) é removido e listado após a importação.',
        },
        {
          question: 'É compatível com Lottie?',
          answer: 'Sim, nos dois sentidos. Você pode importar um arquivo Lottie JSON para editá-lo (a importação conta como uma unidade, a partir do plano gratuito) e exportar sua animação como Lottie JSON para o lottie-web e os players Lottie de iOS, Android e Flutter. Os recursos que um dos lados não consegue representar são listados na caixa de diálogo em vez de descartados em silêncio.',
        },
        {
          question: 'Quais navegadores suportam a exportação de vídeo?',
          answer: 'A exportação em GIF funciona em todos os navegadores modernos. A exportação em MP4 e WebM depende do WebCodecs, o codificador de vídeo embutido do navegador, disponível no Chrome e no Edge e em versões recentes do Safari e do Firefox, dependendo do codec; a caixa de diálogo de exportação verifica seu navegador e avisa quando não consegue codificar. A tabela de planos desta página mostra qual plano inclui cada formato de vídeo.',
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
      featureList: [
        'Importação de SVG em camadas editáveis',
        'Importação de Lottie JSON',
        'Ferramentas de retângulo, elipse, linha, caneta e texto',
        'Linha do tempo de keyframes com predefinições de suavização, curvas cubic-bezier personalizadas e keyframes de retenção',
        'Animadores de desenho progressivo do traço, caminho de movimento, morph de formas, gradiente, máscara e desfoque',
        'Exportação em SVG estático',
        'Exportação em SVG animado (CSS ou runtime anime.js embutido)',
        'Exportação em Lottie JSON',
        'Exportação de código React, JavaScript, TypeScript e Flutter',
        'Exportação em GIF animado',
        'Projetos salvos no navegador ou na sua conta',
      ],
    },
    // 2026-10-28 catalog expansion: name + tagline for the /tools catalog cards (model-written, needs native review).
    'inspect-metadata': {
      name: 'Inspetor de metadados',
      h1: 'Inspecionar metadados de arquivos online',
      tagline: 'Veja todas as tags escondidas em uma foto, vídeo, arquivo de áudio ou PDF: EXIF, localização GPS, câmera, codecs, ID3, XMP e muito mais, antes de compartilhar.',
      metaTitle: 'Inspecionar metadados online: EXIF, GPS, codecs, ID3 | Media Manipulator',
      metaDescription: 'Inspetor de metadados online gratuito para imagens, vídeo, áudio e PDF. Veja EXIF, coordenadas GPS em um mapa, câmera e lente, codecs e taxas de bits, tags ID3, XMP e IPTC. Sem cadastro.',
      ogTitle: 'Inspecionar metadados de arquivos online',
      ogDescription: 'Cada tag EXIF, GPS, de codec, ID3 e XMP do seu arquivo, agrupada e pesquisável, com as privadas sinalizadas.',
      intro: 'Os arquivos carregam mais do que seus pixels e amostras. Uma foto de celular registra onde e quando foi tirada e em qual dispositivo; um vídeo nomeia seu codificador e suas taxas de bits; um MP3 carrega tags ID3 e a capa do álbum; um PDF guarda o autor e o software que o criou. O inspetor de metadados do Media Manipulator lê tudo isso nos nossos servidores com o ExifTool e o ffprobe, agrupa em seções de câmera, localização, dispositivo, tempo, codec e documento, e destaca as entradas que poderiam identificar você, para que você decida o que remover antes que um arquivo saia das suas mãos.',
      whatItDoes: [
        'Lê dados EXIF, GPS, IPTC, XMP e ICC de imagens JPG, PNG, WebP, HEIC, AVIF, TIFF e derivadas de RAW.',
        'Lê dados de contêiner, fluxo, codec, taxa de bits, taxa de quadros e capítulos de arquivos MP4, MOV, MKV, WebM e outros vídeos.',
        'Lê tags ID3, Vorbis e MP4, capas e configurações do codificador de MP3, M4A, FLAC, OGG e WAV.',
        'Lê autor, produtor, datas de criação e contagem de páginas de PDFs.',
        'Mostra as coordenadas GPS no contorno de um mapa e sinaliza cada entrada sensível à privacidade.',
        'Oferece a saída bruta do ExifTool e do ffprobe e a cópia de qualquer bloco com um clique.',
      ],
      flowSteps: [
        {
          title: 'Envie um arquivo',
          description: 'Imagem, vídeo, áudio ou PDF.',
        },
        {
          title: 'Nós o lemos',
          description: 'O ExifTool e o ffprobe rodam nos nossos servidores.',
        },
        {
          title: 'Navegue pelo relatório',
          description: 'Agrupado, pesquisável, com as entradas privadas sinalizadas.',
        },
        {
          title: 'Decida',
          description: 'Remova os metadados com a ferramenta de EXIF, se necessário.',
        },
      ],
      advancedDetails: [
        'Imagens e PDFs são inspecionados automaticamente; vídeo e áudio acima de 100 MB esperam por um clique, para que um arquivo grande não seja enviado por acidente.',
        'A capa incorporada em arquivos de áudio é informada como uma entrada de imagem, não como um fluxo de vídeo.',
        'O relatório usa o mesmo catálogo de metadados que alimenta a ferramenta de remoção de EXIF e o inspetor de resultados de cada conversão.',
      ],
      whyItMatters: [
        'Uma foto compartilhada do celular pode revelar o endereço da sua casa pelas tags de GPS.',
        'Conhecer o codec, a taxa de bits e a taxa de quadros reais de um vídeo explica por que ele vai ou não ser reproduzido em algum lugar.',
        'Os metadados de documentos nomeiam autores e softwares de edição, o que importa para qualquer coisa que você publique anonimamente.',
      ],
      useCases: [
        {
          title: 'Antes de publicar uma foto',
          description: 'Verifique as coordenadas GPS e o número de série do dispositivo.',
        },
        {
          title: 'Depurar um vídeo',
          description: 'Veja o codec, o perfil, a taxa de quadros e o layout de áudio reais.',
        },
        {
          title: 'Verificar um arquivo de música',
          description: 'Confirme as tags, a taxa de bits e se ele foi transcodificado de uma taxa de bits menor.',
        },
        {
          title: 'Revisar um PDF',
          description: 'Veja quem o campo de autor nomeia e qual software o produziu.',
        },
      ],
      whyMediaManipulator: [
        'Um único inspetor para imagens, vídeo, áudio e PDF, não quatro ferramentas separadas.',
        'As entradas sensíveis à privacidade são sinalizadas, com um caminho direto para removê-las.',
        'Sem conversão, sem conta. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'Seu arquivo é lido pelo ExifTool e pelo ffprobe no nosso servidor, o relatório volta para o seu navegador, e a cópia temporária é excluída assim que o relatório é gerado. Nenhum terceiro vê o arquivo nem suas tags. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'Inspecionar um arquivo o altera?',
          answer: 'Não. O arquivo é lido, relatado e excluído após a análise. Nada é gravado de volta.',
        },
        {
          question: 'Posso remover o que o inspetor encontra?',
          answer: 'Sim. Use a ferramenta Remover metadados EXIF para imagens; ela remove tudo e mostra uma comparação do antes e depois.',
        },
        {
          question: 'Por que um vídeo grande precisa de um clique?',
          answer: 'Vídeo e áudio acima de 100 MB só são enviados quando você pede, para que você nunca envie um arquivo grande por acidente.',
        },
        {
          question: 'Isso conta nas minhas conversões diárias?',
          answer: 'Não. A inspeção é gratuita e não gasta uma operação.',
        },
        {
          question: 'Os dados são enviados a terceiros?',
          answer: 'Não. O ExifTool e o ffprobe rodam nos nossos próprios servidores, e o arquivo é excluído em seguida.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A inspeção é somente leitura e não conta como conversão.',
        ],
      },
      related: [
        {
          label: 'Remover metadados EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Remova tudo o que o inspetor encontrou.',
        },
        {
          label: 'Editar metadados de imagem',
          to: '/tools/edit-image-metadata',
          description: 'Reescreva título, autor, direitos autorais e GPS.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta com ou sem metadados.',
        },
      ],
      embed: {
        title: 'Inspecionar um arquivo',
        description: 'Solte uma imagem, um vídeo, um arquivo de áudio ou um PDF. O relatório agrupa cada tag por categoria, sinaliza as que identificam você ou sua localização e oferece uma visão bruta do ExifTool e do ffprobe.',
      },
    },
    'edit-image-metadata': {
      name: 'Editar metadados de imagem',
      h1: 'Editar metadados de imagem online',
      tagline: 'Defina o título, o autor, os direitos autorais, as palavras-chave e a descrição de uma foto, corrija ou remova a localização GPS e reescreva as tags EXIF e IPTC.',
      metaTitle: 'Editar metadados de imagem online: EXIF, IPTC, copyright, GPS | Media Manipulator',
      metaDescription: 'Editor de metadados de imagem online gratuito. Defina título, autor, copyright, descrição e palavras-chave, substitua ou remova a localização GPS e edite tags EXIF e IPTC em JPG, PNG, WebP e mais.',
      ogTitle: 'Editar metadados de imagem online',
      ogDescription: 'Grave um aviso de copyright, corrija a localização, defina palavras-chave. Grátis, sem cadastro.',
      intro: 'Fotógrafos precisam de um aviso de copyright e dados de contato em cada arquivo que entregam. Agências querem palavras-chave e legendas IPTC. Quem compartilha uma foto pode querer a localização removida, ou definida como uma cidade em vez de uma porta de casa. O Media Manipulator reescreve os campos EXIF, IPTC e XMP no próprio arquivo, nos nossos servidores, com o ExifTool, mantém os dados da imagem sem alterações e mostra a comparação do antes e depois.',
      whatItDoes: [
        'Define título, autor/artista, descrição, copyright, comentário e palavras-chave.',
        'Remove a localização GPS ou a substitui por coordenadas que você escolher.',
        'Edita tags EXIF/TIFF, IPTC e avançadas individualmente, pelo nome.',
        'Mantém os pixels sem alterações; opcionalmente converte o formato na mesma passagem.',
        'Mostra uma comparação do que mudou depois do trabalho.',
      ],
      flowSteps: [
        {
          title: 'Envie uma imagem',
          description: 'JPG, PNG, WebP, HEIC, TIFF.',
        },
        {
          title: 'Preencha os campos',
          description: 'Título, autor, copyright, palavras-chave, localização.',
        },
        {
          title: 'Aplique',
          description: 'O ExifTool reescreve as tags nos nossos servidores.',
        },
        {
          title: 'Baixe',
          description: 'Compare o antes e o depois, depois salve.',
        },
      ],
      advancedDetails: [
        'O modo de metadados personalizados grava juntos os equivalentes padrão em EXIF (Artist, Copyright, ImageDescription), IPTC (Keywords, Caption) e XMP (dc:title, dc:creator), para que todo visualizador concorde.',
        'Substituir a localização GPS grava GPSLatitude/GPSLongitude com os hemisférios de referência corretos; removê-la limpa todas as tags de GPS.',
        'PNG e WebP carregam metadados em blocos de texto e XMP; os mesmos campos são gravados lá.',
      ],
      whyItMatters: [
        'Um aviso de copyright incorporado no arquivo viaja com ele quando é republicado.',
        'As palavras-chave e legendas em IPTC são o que as agências de banco de imagens e os sistemas DAM indexam.',
        'Uma localização definida como uma cidade protege sua casa enquanto mantém a foto geolocalizada.',
      ],
      useCases: [
        {
          title: 'Entregar fotos a clientes',
          description: 'Incorpore seu nome, copyright e contato em cada arquivo.',
        },
        {
          title: 'Envios para bancos de imagens',
          description: 'Adicione palavras-chave IPTC e uma legenda.',
        },
        {
          title: 'Geolocalização aproximada',
          description: 'Substitua uma posição GPS precisa pelo centro da cidade.',
        },
        {
          title: 'Corrigir uma tag errada',
          description: 'Corrija o autor ou a data que um scanner gravou.',
        },
      ],
      whyMediaManipulator: [
        'Grava EXIF, IPTC e XMP juntos, não só um deles.',
        'Comparação do antes e depois para você ver exatamente o que mudou.',
      ],
      privacyNote: 'As tags da sua imagem são reescritas pelo ExifTool no nosso servidor com os valores que você digitou; os pixels ficam como estão. Nenhum terceiro vê o arquivo nem suas tags. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'Editar os metadados vai recodificar meu JPG?',
          answer: 'Só se você mudar o formato de saída ou redimensionar. Com o mesmo formato e sem edições nos pixels, os dados da imagem são copiados e só as tags são reescritas.',
        },
        {
          question: 'Posso remover a localização e manter todo o resto?',
          answer: 'Sim. Marque “remover dados de localização” e deixe os outros campos como estão.',
        },
        {
          question: 'Posso editar uma tag que não está na lista?',
          answer: 'Sim. Expanda a seção avançada e defina qualquer tag EXIF ou IPTC pelo nome.',
        },
        {
          question: 'Como removo tudo em vez disso?',
          answer: 'Use a ferramenta Remover metadados EXIF, que remove todas as tags com um clique.',
        },
      ],
      related: [
        {
          label: 'Inspecionar metadados',
          to: '/tools/inspect-metadata',
          description: 'Veja primeiro o que há no arquivo.',
        },
        {
          label: 'Remover metadados EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Remova tudo.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre formatos de imagem.',
        },
        {
          label: 'Recortar imagem',
          to: '/tools/crop-image',
          description: 'Corte para uma região.',
        },
        {
          label: 'Redimensionar imagem',
          to: '/tools/image-resizer',
          description: 'Altere as dimensões.',
        },
        {
          label: 'Adicionar texto à imagem',
          to: '/tools/add-text-to-image',
          description: 'Legenda ou marca d\'água.',
        },
        {
          label: 'Filtros de imagem',
          to: '/tools/image-filters',
          description: 'Sépia, esboço, relevo e mais.',
        },
      ],
      embed: {
        title: 'Editar os metadados de uma imagem',
        description: 'Envie uma imagem. A seção de metadados abre no modo personalizado: preencha título, autor, copyright e palavras-chave, substitua ou remova a localização GPS e expanda as tags avançadas se precisar. Os pixels da imagem ficam como estão, a menos que você também mude o formato.',
      },
    },
    'change-video-speed': {
      name: 'Alterar a velocidade do vídeo',
      h1: 'Alterar a velocidade do vídeo online: acelerar ou desacelerar',
      tagline: 'Crie um time-lapse a 2x, 4x ou mais, ou deixe um clipe mais lento, a 0,5x ou 0,25x, com o áudio sincronizado.',
      metaTitle: 'Alterar velocidade do vídeo grátis: acelerar ou câmera lenta | Media Manipulator',
      metaDescription: 'Alterador de velocidade de vídeo online gratuito. Acelere um vídeo para 1,5x, 2x ou 4x para um time-lapse, ou deixe-o mais lento, a 0,5x ou 0,25x. O áudio continua sincronizado. Saída em MP4, sem marca d\'água.',
      ogTitle: 'Alterar a velocidade do vídeo online grátis',
      ogDescription: 'Acelere ou desacelere qualquer vídeo de 0,25x a 4x. O áudio continua sincronizado. Grátis, sem cadastro.',
      intro: 'Uma gravação de tela que se arrasta, um pôr do sol que precisa virar um time-lapse de dez segundos, uma manobra de skate que merece câmera lenta: mudar a velocidade de reprodução é uma das edições de vídeo mais comuns, e não deveria exigir um editor de desktop. O Media Manipulator ajusta o tempo da imagem e do som nos nossos servidores com o FFmpeg, de um quarto da velocidade até quatro vezes mais rápido, e exporta um MP4 que toca no novo ritmo em qualquer lugar.',
      whatItDoes: [
        'Acelera (de 1,25x a 4x) ou desacelera (de 0,25x a 0,9x) qualquer vídeo.',
        'Ajusta o tempo do áudio com uma mudança de andamento que preserva o tom, para que as vozes continuem naturais.',
        'Mantém a resolução e a qualidade; exporta MP4 por padrão ou qualquer contêiner compatível.',
        'Combine com corte, redimensionamento ou ajustes de cor na mesma passagem.',
      ],
      flowSteps: [
        {
          title: 'Envie seu vídeo',
          description: 'Qualquer formato de vídeo comum.',
        },
        {
          title: 'Defina a velocidade',
          description: 'De 0,25x a 4x; 2x vem pré-selecionado.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg ajusta o tempo do vídeo e do áudio.',
        },
        {
          title: 'Baixe',
          description: 'Salve o novo MP4.',
        },
      ],
      advancedDetails: [
        'O vídeo usa setpts para escalar as marcações de tempo de apresentação; o áudio usa atempo, encadeado para fatores fora da faixa de 0,5 a 2,0.',
        'Desacelerar não inventa quadros; para uma câmera lenta suave, use a interpolação de quadros com IA depois de desacelerar o clipe.',
        'A taxa de quadros é preservada, então um time-lapse a 4x tem um quarto dos quadros originais.',
      ],
      whyItMatters: [
        'Time-lapses e resumos são muito mais agradáveis de assistir a 2x a 4x.',
        'A câmera lenta torna clipes de esporte e ação legíveis.',
        'Tutoriais e gravações de tela costumam ficar melhores a 1,25x a 1,5x.',
      ],
      useCases: [
        {
          title: 'Time-lapse',
          description: 'Comprima uma hora de construção, cozinha ou pintura em minutos.',
        },
        {
          title: 'Câmera lenta',
          description: 'Deixe um clipe de esporte ou de pet na metade da velocidade.',
        },
        {
          title: 'Tutorial mais rápido',
          description: 'Acelere uma gravação de tela sem o áudio ficar com voz de esquilo.',
        },
        {
          title: 'Encaixar em uma música',
          description: 'Ajuste um clipe para 1,1x para encaixar em uma batida.',
        },
      ],
      whyMediaManipulator: [
        'O áudio tem o tempo ajustado com o tom preservado, sem ficar para trás nem com voz de esquilo.',
        'Combine com reverso, corte e cor no mesmo formulário.',
      ],
      privacyNote: 'Seu vídeo é acelerado ou desacelerado pelo FFmpeg no nosso servidor, com o andamento do áudio alterado para acompanhar. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original fica intocado e o resultado é um novo arquivo.',
      faq: [
        {
          question: 'O áudio continua sincronizado?',
          answer: 'Sim. O andamento do áudio é escalado pelo mesmo fator, com o tom preservado.',
        },
        {
          question: 'Qual é a velocidade máxima?',
          answer: '4x mais rápido e 0,25x mais lento em uma passagem. Para mais, passe o resultado pela ferramenta de novo.',
        },
        {
          question: 'A câmera lenta vai ficar suave?',
          answer: 'Desacelerar repete quadros. Para uma câmera lenta realmente suave, desacelere o clipe aqui e depois use a interpolação de quadros com IA.',
        },
        {
          question: 'Posso silenciar o áudio em vez disso?',
          answer: 'Sim, use primeiro a ferramenta Remover áudio de vídeo, ou exporte como GIF, que não tem áudio.',
        },
      ],
      related: [
        {
          label: 'Interpolação de quadros com IA',
          to: '/tools/ai-frame-interpolation',
          description: 'Câmera lenta suave com quadros gerados.',
        },
        {
          label: 'Conversor de vídeo',
          to: '/tools/video-converter',
          description: 'Converta entre formatos de vídeo.',
        },
        {
          label: 'Inverter vídeo',
          to: '/tools/reverse-video',
          description: 'Reproduza um clipe de trás para frente.',
        },
        {
          label: 'Virar vídeo',
          to: '/tools/flip-video',
          description: 'Espelhe na horizontal ou na vertical.',
        },
        {
          label: 'Estabilizar vídeo',
          to: '/tools/stabilize-video',
          description: 'Suavize filmagens tremidas.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o arquivo.',
        },
        {
          label: 'Cortar vídeo',
          to: '/tools/video-trimmer',
          description: 'Corte para um trecho.',
        },
      ],
      embed: {
        title: 'Alterar a velocidade de um vídeo',
        description: 'Envie um vídeo e defina um multiplicador de velocidade: acima de 1 fica mais rápido, abaixo de 1 fica mais lento. 2x vem pré-selecionado. O tempo do áudio é ajustado para acompanhar, então uma voz acelerada continua inteligível.',
      },
    },
    'reverse-video': {
      name: 'Inverter vídeo',
      h1: 'Inverter um vídeo online grátis',
      tagline: 'Reproduza qualquer clipe de trás para frente, com ou sem o áudio invertido, e, se quiser, em vaivém: para frente e depois para trás.',
      metaTitle: 'Inverter vídeo online grátis: de trás para frente, ping-pong | Media Manipulator',
      metaDescription: 'Inversor de vídeo online gratuito. Reproduza um vídeo de trás para frente, inverta também o áudio, ou crie um loop ping-pong que vai para frente e depois para trás. Saída em MP4 ou GIF, sem marca d\'água, sem cadastro.',
      ogTitle: 'Inverter um vídeo online grátis',
      ogDescription: 'Reproduza um clipe de trás para frente ou crie um loop que vai e volta. Grátis, sem cadastro.',
      intro: 'O efeito de vídeo invertido é mais antigo que a internet e ainda funciona: vidro quebrado se remontando, um mergulhador saltando para fora da piscina, uma multidão se reagrupando. O Media Manipulator inverte os quadros e, opcionalmente, o áudio de qualquer clipe nos nossos servidores com o FFmpeg, e a opção ping-pong acrescenta a cópia normal para que o resultado faça um loop sem emendas, que é o que a maioria dos usos em redes sociais e GIFs pede.',
      whatItDoes: [
        'Inverte os quadros de vídeo de qualquer clipe.',
        'Inverte o áudio junto, ou descarta o áudio para um resultado mudo.',
        'O modo ping-pong reproduz para frente e depois para trás, para um loop sem emendas.',
        'Exporta MP4, WebM ou um GIF animado.',
      ],
      flowSteps: [
        {
          title: 'Envie um clipe',
          description: 'Clipes curtos funcionam melhor; a inversão carrega o clipe inteiro na memória.',
        },
        {
          title: 'Escolha reverso ou ping-pong',
          description: 'Reverso vem pré-selecionado.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg inverte os quadros e o áudio.',
        },
        {
          title: 'Baixe',
          description: 'MP4 para vídeo, GIF para um loop.',
        },
      ],
      advancedDetails: [
        'A inversão armazena cada quadro do clipe em buffer, então clipes muito longos ou em 4K levam mais tempo e mais memória; corte antes para obter os melhores resultados.',
        'O áudio usa o filtro areverse; para um clipe invertido mudo, remova o áudio antes.',
        'O ping-pong concatena os fluxos normal e invertido, dobrando a duração.',
      ],
      whyItMatters: [
        'Clipes invertidos e no estilo boomerang são um clássico dos vídeos curtos para redes sociais.',
        'Um loop ping-pong esconde o corte que um loop simples mostraria.',
        'Inverter também é um jeito barato de fazer uma transição de "rebobinar".',
      ],
      useCases: [
        {
          title: 'Loop estilo boomerang',
          description: 'Transforme um clipe de dois segundos em um vaivém sem emendas.',
        },
        {
          title: 'Revelação invertida',
          description: 'Reproduza um unboxing ou uma montagem ao contrário.',
        },
        {
          title: 'Transição de rebobinar',
          description: 'Inverta alguns segundos para cortar entre cenas.',
        },
        {
          title: 'GIF invertido',
          description: 'Exporte direto para GIF para chats e fóruns.',
        },
      ],
      whyMediaManipulator: [
        'Reverso e ping-pong em um único botão, com o áudio tratado corretamente.',
        'Corte antes e exporte GIF no mesmo formulário.',
      ],
      privacyNote: 'Seu clipe é decodificado e reproduzido de trás para frente em um novo arquivo pelo FFmpeg no nosso servidor. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original fica intocado e o resultado é um novo arquivo.',
      faq: [
        {
          question: 'O áudio também é invertido?',
          answer: 'Sim, por padrão. Remova o áudio antes se quiser um clipe mudo.',
        },
        {
          question: 'O que é ping-pong?',
          answer: 'O clipe toca para frente e depois para trás, então ele faz loop sem um salto visível.',
        },
        {
          question: 'Existe limite de duração?',
          answer: 'A inversão mantém o clipe inteiro na memória. Clipes de um ou dois minutos funcionam bem; corte vídeos mais longos antes.',
        },
        {
          question: 'Posso obter um GIF?',
          answer: 'Sim. Escolha GIF como formato de saída; ele é ideal para um loop ping-pong.',
        },
      ],
      related: [
        {
          label: 'Vídeo para GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Crie um GIF em loop.',
        },
        {
          label: 'Conversor de vídeo',
          to: '/tools/video-converter',
          description: 'Converta entre formatos de vídeo.',
        },
        {
          label: 'Alterar a velocidade do vídeo',
          to: '/tools/change-video-speed',
          description: 'Time-lapse ou câmera lenta.',
        },
        {
          label: 'Virar vídeo',
          to: '/tools/flip-video',
          description: 'Espelhe na horizontal ou na vertical.',
        },
        {
          label: 'Estabilizar vídeo',
          to: '/tools/stabilize-video',
          description: 'Suavize filmagens tremidas.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o arquivo.',
        },
        {
          label: 'Cortar vídeo',
          to: '/tools/video-trimmer',
          description: 'Corte para um trecho.',
        },
      ],
      embed: {
        title: 'Inverter um vídeo',
        description: 'Envie um clipe. O reverso já vem ativado na seção Efeitos temporais; ative o ping-pong no lugar dele para um loop que vai e volta. Exporte MP4 ou GIF.',
      },
    },
    'flip-video': {
      name: 'Virar e espelhar vídeo',
      h1: 'Virar ou espelhar um vídeo online grátis',
      tagline: 'Espelhe um vídeo na horizontal para corrigir uma webcam ou selfie invertida, ou vire-o na vertical, com um clique.',
      metaTitle: 'Virar ou espelhar vídeo online grátis | Media Manipulator',
      metaDescription: 'Ferramenta online gratuita para virar vídeos. Espelhe um vídeo na horizontal (corrija selfies e filmagens de webcam espelhadas) ou vire-o na vertical. Saída em MP4, sem marca d\'água, sem cadastro.',
      ogTitle: 'Virar ou espelhar um vídeo online grátis',
      ogDescription: 'Corrija um vídeo de selfie espelhado ou vire um clipe de cabeça para baixo. Grátis, sem cadastro.',
      intro: 'Câmeras frontais e webcams muitas vezes gravam uma imagem espelhada: o texto aparece ao contrário e a sua risca de cabelo fica do lado errado. Espelhar o clipe uma vez coloca tudo no lugar. O Media Manipulator vira o vídeo na horizontal ou na vertical nos nossos servidores com o FFmpeg, recodifica para que a viragem fique gravada nos quadros, e exporta um MP4 que toca corretamente em qualquer player.',
      whatItDoes: [
        'Espelha um vídeo na horizontal (esquerda-direita) ou vira-o na vertical (cima-baixo).',
        'Combine com rotação de 90°, 180° ou 270° na mesma passagem.',
        'Grava a transformação nos quadros; sem depender de um sinalizador de rotação.',
        'Exporta MP4 por padrão, ou qualquer contêiner compatível.',
      ],
      flowSteps: [
        {
          title: 'Envie um vídeo',
          description: 'Qualquer formato comum.',
        },
        {
          title: 'Escolha como virar',
          description: 'Horizontal vem pré-selecionado; adicione vertical ou uma rotação.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg aplica hflip/vflip e recodifica.',
        },
        {
          title: 'Baixe',
          description: 'Salve o MP4 corrigido.',
        },
      ],
      advancedDetails: [
        'A viragem horizontal usa o filtro hflip, a vertical usa vflip; ambos são sem perdas na geometria e recodificam os quadros.',
        'Espelhar mais uma rotação de 180° equivale a uma viragem vertical; o painel permite combinar tudo livremente.',
        'A saída em MP4 usa H.264 + AAC + yuv420p + faststart.',
      ],
      whyItMatters: [
        'Um vídeo de selfie espelhado deixa o texto na tela ilegível.',
        'Algumas câmeras de ação montadas de cabeça para baixo precisam de uma viragem vertical, e não de uma rotação.',
        'Uma cópia espelhada é um jeito rápido de deixar um tutorial de dança ou exercício mais fácil de acompanhar.',
      ],
      useCases: [
        {
          title: 'Corrigir uma selfie espelhada',
          description: 'Faça textos e logos aparecerem corretamente.',
        },
        {
          title: 'Montagem de cabeça para baixo',
          description: 'Vire a filmagem de uma câmera invertida.',
        },
        {
          title: 'Espelhar para um tutorial',
          description: 'Espelhe uma demonstração para que quem assiste possa copiá-la diretamente.',
        },
        {
          title: 'Combinar com outro plano',
          description: 'Espelhe um clipe para que a pessoa fique voltada para o outro lado.',
        },
      ],
      whyMediaManipulator: [
        'Virar e girar em uma única seção de transformação, gravados nos quadros.',
        'Corte, redimensionamento e cor no mesmo envio.',
      ],
      privacyNote: 'Seu vídeo é espelhado na horizontal ou na vertical pelo FFmpeg no nosso servidor. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original fica intocado e o resultado é um novo arquivo.',
      faq: [
        {
          question: 'Espelhar ou virar, qual é a diferença?',
          answer: 'Espelhar (viragem horizontal) troca esquerda e direita. A viragem vertical troca cima e baixo.',
        },
        {
          question: 'A viragem é permanente?',
          answer: 'Sim. Os quadros são recodificados com a viragem aplicada, então todo player a exibe.',
        },
        {
          question: 'Também posso girar?',
          answer: 'Sim. A rotação fica na mesma seção Transformação, ou use a ferramenta dedicada Girar vídeo.',
        },
        {
          question: 'Virar reduz a qualidade?',
          answer: 'A recodificação tem um custo pequeno; escolha alta qualidade para mantê-lo desprezível.',
        },
      ],
      related: [
        {
          label: 'Girar vídeo',
          to: '/tools/rotate-video',
          description: '90°, 180°, 270°.',
        },
        {
          label: 'Conversor de vídeo',
          to: '/tools/video-converter',
          description: 'Converta entre formatos de vídeo.',
        },
        {
          label: 'Alterar a velocidade do vídeo',
          to: '/tools/change-video-speed',
          description: 'Time-lapse ou câmera lenta.',
        },
        {
          label: 'Inverter vídeo',
          to: '/tools/reverse-video',
          description: 'Reproduza um clipe de trás para frente.',
        },
        {
          label: 'Estabilizar vídeo',
          to: '/tools/stabilize-video',
          description: 'Suavize filmagens tremidas.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o arquivo.',
        },
        {
          label: 'Cortar vídeo',
          to: '/tools/video-trimmer',
          description: 'Corte para um trecho.',
        },
      ],
      embed: {
        title: 'Virar ou espelhar um vídeo',
        description: 'Envie um vídeo. A viragem horizontal (espelhar) vem pré-selecionada na seção Transformação; ative a viragem vertical no lugar dela ou junto. A rotação está disponível na mesma seção.',
      },
    },
    'stabilize-video': {
      name: 'Estabilizar vídeo',
      h1: 'Estabilizar vídeo tremido online grátis',
      tagline: 'Suavize o tremor das mãos e o balanço de quem anda com um estabilizador de duas passagens, sem tripé nem editor de desktop.',
      metaTitle: 'Estabilizar vídeo tremido online grátis | Media Manipulator',
      metaDescription: 'Estabilizador de vídeo online gratuito. Reduza o tremor das mãos e o balanço da caminhada com a suavização de movimento do FFmpeg. Intensidade ajustável, saída em MP4, sem marca d\'água, sem cadastro.',
      ogTitle: 'Estabilizar vídeo tremido online grátis',
      ogDescription: 'Suavize o tremor da câmera em qualquer clipe. Grátis, sem cadastro.',
      intro: 'Filmagens feitas à mão tremem, e um pouco de tremor vira muito em uma tela grande. A estabilização por software rastreia o movimento entre os quadros, suaviza a trajetória da câmera e recorta um pouco das bordas para esconder a correção. O Media Manipulator roda o estabilizador por compensação de movimento do FFmpeg nos nossos servidores com intensidade ajustável, para que um vlog caminhando ou um clipe de celular com zoom saia visivelmente mais firme.',
      whatItDoes: [
        'Analisa o movimento entre quadros e suaviza a trajetória da câmera.',
        'Tremor (quanto tremor esperar) e precisão (quão a fundo buscar) ajustáveis.',
        'Recorta levemente para esconder a correção; o zoom é aplicado automaticamente.',
        'Exporta MP4 por padrão; combine com corte e cor na mesma passagem.',
      ],
      flowSteps: [
        {
          title: 'Envie um clipe tremido',
          description: 'Qualquer formato comum.',
        },
        {
          title: 'Mantenha ou ajuste a intensidade',
          description: 'Os padrões servem para filmagens de celular feitas à mão.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg estima e compensa o movimento.',
        },
        {
          title: 'Baixe',
          description: 'Compare o resultado mais firme.',
        },
      ],
      advancedDetails: [
        'Usa o filtro de compensação de movimento deshake do FFmpeg; o valor de tremor define o alcance da busca, e a precisão, a profundidade da busca.',
        'A estabilização não corrige o desfoque de movimento que já está nos quadros; ela só remove a vibração entre eles.',
        'Espere um pequeno recorte nas bordas, proporcional a quanto a câmera se moveu.',
      ],
      whyItMatters: [
        'Uma filmagem firme parece mais profissional e é mais fácil de assistir.',
        'Clipes de celular gravados caminhando são o caso mais comum e respondem bem.',
        'Um clipe estabilizado comprime melhor, já que menos partes da imagem mudam entre os quadros.',
      ],
      useCases: [
        {
          title: 'Vlog caminhando',
          description: 'Tire o balanço de uma gravação feita à mão enquanto você anda e fala.',
        },
        {
          title: 'Vídeo de celular com zoom',
          description: 'Firme um clipe de show ou de vida selvagem gravado com zoom máximo.',
        },
        {
          title: 'Suporte em carro ou bicicleta',
          description: 'Reduza a vibração de um suporte no painel ou no guidão.',
        },
        {
          title: 'Antes de um GIF',
          description: 'Estabilize antes para que o loop não vibre.',
        },
      ],
      whyMediaManipulator: [
        'Compensação de movimento de verdade, com a intensidade exposta em vez de escondida.',
        'Corte, velocidade e cor no mesmo formulário.',
      ],
      privacyNote: 'Sua filmagem é analisada em busca de tremor e suavizada pelo filtro deshake do FFmpeg no nosso servidor. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original fica intocado e o resultado é um novo arquivo.',
      faq: [
        {
          question: 'Ele vai recortar meu vídeo?',
          answer: 'Um pouco. O estabilizador desloca os quadros para cancelar o tremor e aplica um leve zoom para esconder as bordas em movimento.',
        },
        {
          question: 'Ele consegue corrigir desfoque?',
          answer: 'Não. O desfoque dentro de um quadro não pode ser desfeito; a estabilização só firma o movimento entre os quadros.',
        },
        {
          question: 'Quais configurações devo usar?',
          answer: 'Comece com os padrões. Aumente o tremor para filmagens muito instáveis; aumente a precisão se o resultado ainda derivar.',
        },
        {
          question: 'Funciona em 4K?',
          answer: 'Sim, mas o processamento leva mais tempo. Considere redimensionar para 1080p na mesma passagem.',
        },
      ],
      related: [
        {
          label: 'Restauração de vídeo com IA',
          to: '/tools/ai-video-restoration',
          description: 'Remova ruído, desfoque e amplie com IA.',
        },
        {
          label: 'Conversor de vídeo',
          to: '/tools/video-converter',
          description: 'Converta entre formatos de vídeo.',
        },
        {
          label: 'Alterar a velocidade do vídeo',
          to: '/tools/change-video-speed',
          description: 'Time-lapse ou câmera lenta.',
        },
        {
          label: 'Inverter vídeo',
          to: '/tools/reverse-video',
          description: 'Reproduza um clipe de trás para frente.',
        },
        {
          label: 'Virar vídeo',
          to: '/tools/flip-video',
          description: 'Espelhe na horizontal ou na vertical.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o arquivo.',
        },
        {
          label: 'Cortar vídeo',
          to: '/tools/video-trimmer',
          description: 'Corte para um trecho.',
        },
      ],
      embed: {
        title: 'Estabilizar um vídeo',
        description: 'Envie um clipe tremido. A estabilização já vem ativada na seção Efeitos temporais; ajuste o tremor e a precisão se o padrão for suave demais ou recortar demais.',
      },
    },
    'change-video-frame-rate': {
      name: 'Alterar a taxa de quadros do vídeo',
      h1: 'Alterar a taxa de quadros do vídeo online',
      tagline: 'Converta um vídeo para 24, 25, 30 ou 60 fps, reduza um clipe de 60 fps para 30 e gere um arquivo menor, ou ajuste à taxa de quadros do projeto.',
      metaTitle: 'Alterar taxa de quadros do vídeo (24, 30, 60 fps) | Media Manipulator',
      metaDescription: 'Conversor de taxa de quadros online gratuito. Converta um vídeo para 24, 25, 30, 50 ou 60 fps, reduza 60 fps para 30 para um arquivo menor, ou ajuste a uma linha do tempo de edição. Saída em MP4, sem cadastro.',
      ogTitle: 'Alterar a taxa de quadros do vídeo online',
      ogDescription: 'Converta qualquer vídeo para 24, 25, 30 ou 60 fps. Grátis, sem cadastro.',
      intro: 'A taxa de quadros decide como um vídeo parece e quão grande ele fica. Cinema é 24 fps, a TV europeia é 25, a maioria dos celulares grava a 30 ou 60, e misturar tudo em uma linha do tempo causa tremulação. O Media Manipulator reamostra qualquer vídeo para a taxa de quadros de que você precisa nos nossos servidores com o FFmpeg, descartando ou repetindo quadros com exatidão, e exporta MP4. Quando você quer mais quadros em vez de menos, a ferramenta de interpolação de quadros com IA gera os intermediários.',
      whatItDoes: [
        'Reamostra um vídeo para qualquer taxa de quadros de 1 a 120 fps.',
        'Reduz 60 fps pela metade, para 30, e gera um arquivo muito menor sem mudança visível na maioria dos conteúdos.',
        'Ajusta à taxa de quadros do projeto (24, 25, 29,97, 30, 50, 60) antes de importar em um editor.',
        'Mantém resolução, áudio e duração inalterados.',
      ],
      flowSteps: [
        {
          title: 'Envie um vídeo',
          description: 'Qualquer formato comum.',
        },
        {
          title: 'Defina os fps desejados',
          description: '30 vem pré-selecionado.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg descarta ou duplica quadros para chegar lá.',
        },
        {
          title: 'Baixe',
          description: 'Salve o MP4 reamostrado.',
        },
      ],
      advancedDetails: [
        'Usa o filtro fps: os quadros são descartados ou duplicados por marcação de tempo, então a duração e a sincronia do áudio são preservadas com exatidão.',
        'Subir (de 30 para 60) duplica quadros e não fica mais suave; use a interpolação de quadros com IA para quadros novos de verdade.',
        'Descer remove dados e não é reversível; guarde o original.',
      ],
      whyItMatters: [
        'Um clipe de celular a 60 fps tem o dobro do tamanho de um a 30 fps com a mesma qualidade visível na maioria dos conteúdos.',
        'Taxas de quadros misturadas em uma linha do tempo de edição causam engasgos; conformar antes evita isso.',
        'Algumas plataformas e dispositivos limitam ou exigem uma taxa de quadros específica.',
      ],
      useCases: [
        {
          title: 'Reduzir um clipe de 60 fps',
          description: 'Baixe para 30 fps para e-mail, chat ou um envio menor.',
        },
        {
          title: 'Conformar para edição',
          description: 'Ajuste todos os clipes à taxa do projeto.',
        },
        {
          title: 'Visual de cinema',
          description: 'Converta para 24 fps para uma cadência cinematográfica.',
        },
        {
          title: 'Entrega para TV',
          description: 'Converta para 25 ou 50 fps para regiões PAL.',
        },
      ],
      whyMediaManipulator: [
        'Reamostragem exata baseada em marcações de tempo, com duração e áudio intocados.',
        'Interpolação com IA disponível quando você precisa de mais quadros em vez de menos.',
      ],
      privacyNote: 'Seu vídeo tem o tempo ajustado para a taxa de quadros que você escolher pelo FFmpeg no nosso servidor. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original fica intocado e o resultado é um novo arquivo.',
      faq: [
        {
          question: 'O vídeo fica mais curto ou mais longo?',
          answer: 'Não. A duração é preservada; os quadros são descartados ou repetidos para atingir a nova taxa.',
        },
        {
          question: 'De 30 para 60 fps vai ficar mais suave?',
          answer: 'Não com esta ferramenta, que duplica quadros. Use a interpolação de quadros com IA para gerar quadros intermediários de verdade.',
        },
        {
          question: 'Qual taxa de quadros devo escolher?',
          answer: '30 fps para a maioria dos conteúdos de web e celular, 24 para um visual de cinema, 25 ou 50 para TV PAL, 60 para games e esportes.',
        },
        {
          question: 'O áudio é afetado?',
          answer: 'Não. O fluxo de áudio é copiado ou recodificado com a mesma temporização.',
        },
      ],
      related: [
        {
          label: 'Interpolação de quadros com IA',
          to: '/tools/ai-frame-interpolation',
          description: 'Gere quadros até 120 fps.',
        },
        {
          label: 'Conversor de vídeo',
          to: '/tools/video-converter',
          description: 'Converta entre formatos de vídeo.',
        },
        {
          label: 'Alterar a velocidade do vídeo',
          to: '/tools/change-video-speed',
          description: 'Time-lapse ou câmera lenta.',
        },
        {
          label: 'Inverter vídeo',
          to: '/tools/reverse-video',
          description: 'Reproduza um clipe de trás para frente.',
        },
        {
          label: 'Virar vídeo',
          to: '/tools/flip-video',
          description: 'Espelhe na horizontal ou na vertical.',
        },
        {
          label: 'Estabilizar vídeo',
          to: '/tools/stabilize-video',
          description: 'Suavize filmagens tremidas.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o arquivo.',
        },
        {
          label: 'Cortar vídeo',
          to: '/tools/video-trimmer',
          description: 'Corte para um trecho.',
        },
      ],
      embed: {
        title: 'Alterar a taxa de quadros de um vídeo',
        description: 'Envie um vídeo e defina a taxa de quadros desejada na seção Efeitos temporais; 30 fps vem pré-selecionado. Os quadros são descartados ou duplicados para atingir o alvo. Para uma taxa maior com quadros intermediários gerados, use a interpolação de quadros com IA.',
      },
    },
    'adjust-video-color': {
      name: 'Ajustar brilho e cor do vídeo',
      h1: 'Ajustar brilho, contraste e cor do vídeo online',
      tagline: 'Clareie um clipe escuro, aumente o contraste e a saturação, mude a tonalidade, ou aplique um desfoque ou um visual artístico, com controles deslizantes e prévia ao vivo.',
      metaTitle: 'Ajustar brilho, contraste e saturação de vídeo online | Media Manipulator',
      metaDescription: 'Ajustador de cor de vídeo online gratuito. Corrija brilho, contraste, saturação, matiz, gama e exposição, adicione desfoque ou nitidez, ou aplique um visual artístico. Saída em MP4, sem marca d\'água, sem cadastro.',
      ogTitle: 'Ajustar brilho e cor do vídeo online',
      ogDescription: 'Clareie, adicione contraste, realce a cor ou aplique um visual a qualquer clipe. Grátis, sem cadastro.',
      intro: 'Um clipe gravado em ambiente fechado sai escuro e alaranjado; um vídeo de celular sem contraste pede mais contraste e cor; um clipe para miniatura precisa de um visual estilizado. O Media Manipulator aplica correções de brilho, contraste, saturação, matiz, gama e exposição nos nossos servidores com o FFmpeg, junto com desfoque, nitidez, granulação e um conjunto de filtros artísticos, e exporta MP4. É uma passagem de correção de cor sem abrir um editor.',
      whatItDoes: [
        'Controles deslizantes de brilho, contraste, saturação e matiz de -100 a +100.',
        'Gama, exposição, sombras e realces para um controle tonal mais fino.',
        'Desfoque gaussiano e de movimento, nitidez por máscara de desfoque, granulação de filme e ruído.',
        'Visuais artísticos como pintura a óleo, esboço e vintage.',
        'Combine com corte, redimensionamento, velocidade ou viragem na mesma passagem.',
      ],
      flowSteps: [
        {
          title: 'Envie um clipe',
          description: 'Qualquer formato comum.',
        },
        {
          title: 'Mova os controles',
          description: 'Brilho, contraste, saturação, matiz e mais.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg aplica os filtros eq e de efeitos.',
        },
        {
          title: 'Baixe',
          description: 'Salve o MP4 com a correção aplicada.',
        },
      ],
      advancedDetails: [
        'Brilho, contraste, saturação e gama correspondem ao filtro eq do FFmpeg; o matiz usa o filtro hue em graus.',
        'A nitidez é o unsharp com raio, intensidade e limiar; o desfoque é o gblur ou um desfoque de movimento direcional.',
        'Para uma LUT 3D, chroma key ou correção por clipe em uma linha do tempo, use o Darkroom.',
      ],
      whyItMatters: [
        'A maioria das filmagens de celular se beneficia de um pequeno aumento de contraste e saturação.',
        'Corrigir a exposição antes de publicar evita que a recodificação da plataforma piore o resultado.',
        'Um visual consistente entre os clipes faz uma edição parecer finalizada.',
      ],
      useCases: [
        {
          title: 'Clarear um clipe escuro',
          description: 'Aumente a exposição e as sombras em filmagens de ambientes fechados.',
        },
        {
          title: 'Dar vida a um clipe sem contraste',
          description: 'Adicione contraste e saturação a um vídeo de celular com aparência lavada, tipo log.',
        },
        {
          title: 'Corrigir uma dominante de cor',
          description: 'Desloque o matiz para tirar um tom alaranjado ou esverdeado.',
        },
        {
          title: 'Estilizar para redes sociais',
          description: 'Aplique visuais vintage, de esboço ou de pintura a óleo.',
        },
      ],
      whyMediaManipulator: [
        'Controles de tom, cor e efeitos em uma única seção, não um único botão de "melhorar".',
        'Use o Darkroom para correção de cor na linha do tempo com LUTs quando precisar de mais.',
      ],
      privacyNote: 'O brilho, o contraste, a saturação e o gama do seu vídeo são alterados pelo FFmpeg no nosso servidor. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original fica intocado e o resultado é um novo arquivo.',
      faq: [
        {
          question: 'Posso ver uma prévia do resultado?',
          answer: 'Os controles mostram seus valores; a correção completa é aplicada na conversão. Corte para alguns segundos para testar rápido, depois processe o clipe inteiro.',
        },
        {
          question: 'Posso aplicar uma LUT?',
          answer: 'Aqui não. O Darkroom, nosso editor multipista, aceita LUTs 3D e correção de cor por clipe.',
        },
        {
          question: 'Isso vai corrigir uma filmagem superexposta?',
          answer: 'Ele pode baixar os realces, mas detalhes que estouraram para o branco não podem ser recuperados.',
        },
        {
          question: 'Posso dar nitidez a um clipe sem foco?',
          answer: 'Sim. Use os controles de máscara de desfoque; para recuperar detalhes de verdade, experimente a restauração de vídeo com IA.',
        },
      ],
      related: [
        {
          label: 'Editor de vídeo Darkroom',
          to: '/tools/content-studio',
          description: 'Corrija a cor com LUTs em uma linha do tempo.',
        },
        {
          label: 'Restauração de vídeo com IA',
          to: '/tools/ai-video-restoration',
          description: 'Remova ruído e amplie com IA.',
        },
        {
          label: 'Conversor de vídeo',
          to: '/tools/video-converter',
          description: 'Converta entre formatos de vídeo.',
        },
        {
          label: 'Alterar a velocidade do vídeo',
          to: '/tools/change-video-speed',
          description: 'Time-lapse ou câmera lenta.',
        },
        {
          label: 'Inverter vídeo',
          to: '/tools/reverse-video',
          description: 'Reproduza um clipe de trás para frente.',
        },
        {
          label: 'Virar vídeo',
          to: '/tools/flip-video',
          description: 'Espelhe na horizontal ou na vertical.',
        },
        {
          label: 'Estabilizar vídeo',
          to: '/tools/stabilize-video',
          description: 'Suavize filmagens tremidas.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o arquivo.',
        },
        {
          label: 'Cortar vídeo',
          to: '/tools/video-trimmer',
          description: 'Corte para um trecho.',
        },
      ],
      embed: {
        title: 'Ajustar a cor de um vídeo',
        description: 'Envie um clipe. A seção Efeitos visuais abre com controles deslizantes de brilho, contraste, saturação, matiz, gama e exposição, além de desfoque, nitidez, ruído e visuais artísticos. Exporte MP4.',
      },
    },
    'convert-video-to-hevc': {
      name: 'Converter vídeo para HEVC (H.265)',
      h1: 'Converter vídeo para HEVC / H.265 online',
      tagline: 'Recodifique qualquer vídeo em H.265 e obtenha cerca de metade do tamanho do H.264 com a mesma qualidade, para armazenamento, 4K e dispositivos modernos.',
      metaTitle: 'Converter vídeo para HEVC (H.265) online grátis | Media Manipulator',
      metaDescription: 'Conversor H.265 / HEVC online gratuito. Recodifique MP4, MOV, MKV ou WebM em HEVC para cerca de metade do tamanho com a mesma qualidade. Escolha uma predefinição de qualidade. Sem marca d\'água, sem cadastro.',
      ogTitle: 'Converter vídeo para HEVC / H.265 online',
      ogDescription: 'Reduza o tamanho de um vídeo pela metade com H.265. Grátis, sem cadastro.',
      intro: 'O HEVC, também chamado de H.265, é o sucessor do H.264. Com a mesma qualidade visual, ele precisa de cerca de 40 a 50 por cento menos bits, e é por isso que os celulares gravam 4K nele e que ele é o formato preferido para arquivar filmagens. O Media Manipulator recodifica qualquer vídeo em HEVC nos nossos servidores com o codificador x265 do FFmpeg no nível de qualidade que você escolher, em um contêiner MP4 que iPhones, Macs, Windows 10+, Android e TVs modernas reproduzem.',
      whatItDoes: [
        'Recodifica qualquer vídeo de entrada como H.265 em um contêiner MP4.',
        'Três predefinições de qualidade mapeadas para valores de CRF; o tamanho do arquivo cai mais ou menos pela metade em relação ao H.264.',
        'Mantém a resolução e a taxa de quadros; opcionalmente reduz 4K para 1080p para um arquivo muito menor.',
        'O áudio é recodificado como AAC.',
      ],
      flowSteps: [
        {
          title: 'Envie um vídeo',
          description: 'Qualquer formato comum, incluindo MP4 H.264.',
        },
        {
          title: 'Escolha uma qualidade',
          description: 'Menor arquivo, equilibrado ou alta qualidade.',
        },
        {
          title: 'Converta',
          description: 'O x265 codifica nos nossos servidores; é mais lento que o H.264.',
        },
        {
          title: 'Baixe',
          description: 'Salve o .mp4 com HEVC dentro.',
        },
      ],
      advancedDetails: [
        'Codificado com libx265 em CRF 28 (equilibrado), 32 (menor arquivo) ou 24 (alta qualidade), preset medium, tag hvc1 para compatibilidade com a Apple.',
        'A codificação HEVC é várias vezes mais lenta que a H.264; arquivos longos em 4K levam minutos.',
        'Navegadores: Safari e Edge reproduzem HEVC; Chrome e Firefox geralmente não. Mantenha H.264 para incorporações na web.',
      ],
      whyItMatters: [
        'Metade do armazenamento com a mesma qualidade faz diferença em uma biblioteca inteira.',
        'A entrega em 4K e HDR é padronizada em HEVC na maioria dos dispositivos.',
        'Arquivos menores são enviados e sincronizados mais rápido.',
      ],
      useCases: [
        {
          title: 'Arquivar filmagens',
          description: 'Reduza pela metade o tamanho da galeria da câmera sem perda visível.',
        },
        {
          title: 'Compartilhar 4K',
          description: 'Deixe um clipe em 4K pequeno o bastante para enviar.',
        },
        {
          title: 'Ecossistema Apple',
          description: 'Combine com os arquivos HEVC que os iPhones já gravam.',
        },
        {
          title: 'Liberar espaço no disco',
          description: 'Converta gravações antigas em H.264 para HEVC.',
        },
      ],
      whyMediaManipulator: [
        'x265 com predefinições de CRF sensatas e tag compatível com a Apple.',
        'O mesmo painel comprime para H.264, VP9 ou AV1 se você precisar deles em vez disso.',
      ],
      privacyNote: 'Seu vídeo é recodificado em H.265 (HEVC) pelo FFmpeg no nosso servidor. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original fica intocado e o resultado é um novo arquivo.',
      faq: [
        {
          question: 'HEVC vai tocar em qualquer lugar?',
          answer: 'iPhone, Mac, Windows 10+, Android 5+, TVs modernas e Safari/Edge reproduzem. Chrome, Firefox e dispositivos antigos geralmente não; mantenha H.264 para esses.',
        },
        {
          question: 'Quanto menor o arquivo vai ficar?',
          answer: 'Normalmente de 40 a 50 por cento menor que o H.264 com a mesma qualidade; mais em conteúdos simples.',
        },
        {
          question: 'A qualidade é pior?',
          answer: 'Na predefinição equilibrada, a diferença não é visível na maioria dos conteúdos. Escolha alta qualidade para filmagens que você vai editar de novo.',
        },
        {
          question: 'Por que é lento?',
          answer: 'O x265 faz muito mais trabalho por quadro que o x264. É o preço do arquivo menor.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A codificação HEVC exige muito da CPU; espere vários minutos para fontes longas ou em 4K.',
        ],
      },
      related: [
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Compressão em H.264, VP9 ou AV1.',
        },
        {
          label: 'Conversor de vídeo',
          to: '/tools/video-converter',
          description: 'MP4 H.264 padrão.',
        },
        {
          label: 'Conversor de vídeo',
          to: '/tools/video-converter',
          description: 'Converta entre formatos de vídeo.',
        },
        {
          label: 'Alterar a velocidade do vídeo',
          to: '/tools/change-video-speed',
          description: 'Time-lapse ou câmera lenta.',
        },
        {
          label: 'Inverter vídeo',
          to: '/tools/reverse-video',
          description: 'Reproduza um clipe de trás para frente.',
        },
        {
          label: 'Virar vídeo',
          to: '/tools/flip-video',
          description: 'Espelhe na horizontal ou na vertical.',
        },
        {
          label: 'Estabilizar vídeo',
          to: '/tools/stabilize-video',
          description: 'Suavize filmagens tremidas.',
        },
        {
          label: 'Cortar vídeo',
          to: '/tools/video-trimmer',
          description: 'Corte para um trecho.',
        },
      ],
      embed: {
        title: 'Converter um vídeo para HEVC',
        description: 'Envie um vídeo. O codec vem definido como H.265 em um contêiner MP4 com a predefinição equilibrada; escolha menor arquivo ou alta qualidade se preferir. Dispositivos mais antigos e alguns navegadores não reproduzem HEVC; mantenha uma cópia em H.264 para esses.',
      },
    },
    'convert-audio-to-wav': {
      name: 'Converter áudio para WAV',
      h1: 'Converter áudio para WAV online grátis',
      tagline: 'Converta MP3, M4A, WAV, OGG, FLAC e qualquer outro arquivo de áudio para WAV sem perder nada.',
      metaTitle: 'Converter áudio para WAV online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de áudio para WAV. Envie MP3, WAV, M4A, OGG, FLAC ou AAC e baixe WAV. Saída sem perdas. Sem marca d\'água, sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter áudio para WAV online grátis',
      ogDescription: 'Envie qualquer arquivo de áudio e baixe WAV. Sem perdas. Grátis, sem cadastro.',
      intro: 'WAV é áudio PCM sem compressão: cada amostra é armazenada como está, então nada se perde e qualquer editor, DAW e sampler o abre na hora. O Media Manipulator converte qualquer formato de áudio comum para WAV em um único envio, mantendo a taxa de amostragem e a disposição dos canais a menos que você as altere, e oferece corte, normalização, equalização e as ferramentas de limpeza com IA no mesmo formulário.',
      whatItDoes: [
        'Converte MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3 e WMA para WAV.',
        'Mantém cada amostra: a saída decodifica exatamente para o que entrou.',
        'Corte, volume, normalização, equalização e efeitos podem ser aplicados antes de o PCM ser gravado.',
        'A limpeza com IA está no mesmo formulário: remova ruído de fundo, limpe uma voz, ou isole ou remova os vocais antes de salvar como WAV.',
      ],
      flowSteps: [
        {
          title: 'Envie o áudio',
          description: 'Qualquer arquivo de áudio comum, comprimido ou não.',
        },
        {
          title: 'Ajuste se precisar',
          description: 'Corte, normalize ou aplique efeitos.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg codifica o WAV nos nossos servidores.',
        },
        {
          title: 'Baixe',
          description: 'Salve o arquivo WAV.',
        },
      ],
      advancedDetails: [
        'A saída em WAV é codificada com o codificador nativo pcm_s16le do FFmpeg na taxa de amostragem da fonte.',
        'Converter um MP3 com perdas para WAV não recupera os detalhes que o codificador MP3 descartou; apenas impede novas perdas.',
        'A capa do álbum em uma fonte MP3 ou M4A é reconhecida como imagem estática, então a validação não confunde o arquivo com um vídeo.',
      ],
      whyItMatters: [
        'Edição ou masterização: WAV é o formato que os editores de áudio querem, sem etapa de decodificação e sem perda de geração.',
        'Arquivamento de um master ou de uma gravação de campo.',
        'Samplers, motores de jogos e sistemas de transmissão que exigem PCM.',
      ],
      useCases: [
        {
          title: 'Trocar o formato para um dispositivo',
          description: 'Crie uma cópia em WAV para um player que precise dela.',
        },
        {
          title: 'Preparar para edição',
          description: 'Entregue um arquivo sem perdas a uma DAW ou editor de vídeo.',
        },
        {
          title: 'Um arquivo por vez',
          description: 'Transforme uma pasta de memorandos de voz em WAV um a um, cortando cada um no caminho.',
        },
        {
          title: 'Limpar no caminho',
          description: 'Tire o chiado de uma gravação de campo a caminho de um master sem compressão.',
        },
      ],
      whyMediaManipulator: [
        'A taxa de amostragem e a disposição dos canais são mantidas, a menos que você escolha o contrário.',
        'Normalize e corte um take no mesmo envio que gera o WAV.',
      ],
      privacyNote: 'Seu áudio é decodificado pelo FFmpeg no nosso servidor e gravado como WAV PCM sem compressão. Nenhum serviço de áudio externo está envolvido. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Você recebe um novo arquivo; o envio em si não é alterado.',
      faq: [
        {
          question: 'O que é WAV?',
          answer: 'WAV é áudio PCM sem compressão: cada amostra é armazenada como está, então nada se perde e qualquer editor, DAW e sampler o abre na hora.',
        },
        {
          question: 'Converter para WAV vai melhorar o som?',
          answer: 'Não. Converter um MP3 com perdas para WAV não recupera os detalhes que o codificador MP3 descartou; apenas impede novas perdas.',
        },
        {
          question: 'Posso cortar o áudio enquanto converto para WAV?',
          answer: 'Sim. Defina o início e o fim na seção de corte e só esse trecho é gravado no WAV.',
        },
        {
          question: 'Meu MP3 tem capa de álbum. Ele ainda pode virar um WAV?',
          answer: 'Sim. A capa é reconhecida como imagem, e não como faixa de vídeo, então o envio é aceito e o áudio é decodificado para PCM normalmente.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Saída sem perdas; o tamanho do arquivo depende da duração e da taxa de amostragem.',
        ],
      },
      related: [
        {
          label: 'Conversor de áudio',
          to: '/tools/audio-converter',
          description: 'Converta entre todos os formatos de áudio comuns.',
        },
        {
          label: 'Alterar a velocidade do áudio',
          to: '/tools/change-audio-speed',
          description: 'Acelere ou desacelere uma gravação.',
        },
        {
          label: 'Alterar o tom do áudio',
          to: '/tools/change-audio-pitch',
          description: 'Mude o tom para cima ou para baixo.',
        },
        {
          label: 'Normalizar áudio',
          to: '/tools/normalize-audio',
          description: 'Equilibre o volume.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Remoção de ruído com IA.',
        },
        {
          label: 'Remover vocais de uma música',
          to: '/tools/remove-vocals-from-song',
          description: 'Crie um instrumental.',
        },
      ],
      embed: {
        title: 'Converter áudio para WAV',
        description: 'Envie qualquer arquivo de áudio. A saída fica travada em WAV; a taxa de amostragem e os canais são mantidos a menos que você os altere; depois, pressione Converter.',
      },
    },
    'convert-audio-to-flac': {
      name: 'Converter áudio para FLAC',
      h1: 'Converter áudio para FLAC online grátis',
      tagline: 'Converta MP3, M4A, WAV, OGG, FLAC e qualquer outro arquivo de áudio para FLAC sem perder nada.',
      metaTitle: 'Converter áudio para FLAC online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de áudio para FLAC. Envie MP3, WAV, M4A, OGG, FLAC ou AAC e baixe em FLAC. Saída sem perdas. Sem marca d\'água, sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter áudio para FLAC online grátis',
      ogDescription: 'Envie qualquer arquivo de áudio e baixe em FLAC. Sem perdas. Grátis, sem cadastro.',
      intro: 'O FLAC comprime o áudio sem perder nada, normalmente para 50 a 70 por cento do tamanho do WAV, e decodifica para uma cópia idêntica bit a bit. O Media Manipulator converte qualquer formato de áudio comum para FLAC em um só envio, mantendo a taxa de amostragem e o layout de canais a menos que você os altere, e oferece corte, normalização, equalização e as ferramentas de limpeza por IA no mesmo formulário.',
      whatItDoes: [
        'Converte MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3 e WMA para FLAC.',
        'Mantém cada amostra: a saída decodifica exatamente para o que entrou.',
        'Volume, corte, normalização e equalização podem ser aplicados antes que o FLAC comprima o resultado.',
        'Remoção de ruído, limpeza de voz e isolamento de vocais rodam no mesmo envio, se você quiser uma cópia sem perdas já limpa.',
      ],
      flowSteps: [
        {
          title: 'Envie o áudio',
          description: 'WAV, PCM no estilo AIFF, MP3, M4A e os demais.',
        },
        {
          title: 'Ajuste se precisar',
          description: 'Corte, normalize ou aplique efeitos.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg codifica o FLAC nos nossos servidores.',
        },
        {
          title: 'Baixe',
          description: 'Salve o arquivo FLAC.',
        },
      ],
      advancedDetails: [
        'A saída FLAC é codificada com o codificador flac nativo do FFmpeg, na taxa de amostragem de origem.',
        'Um FLAC feito a partir de um MP3 não é melhor que o MP3; o FLAC só preserva o que já está lá.',
        'Um MP3 ou M4A com capa embutida passa na validação: a arte é tratada como imagem, não como fluxo de vídeo.',
      ],
      whyItMatters: [
        'Bibliotecas de música sem perdas que ocupam metade do espaço do WAV.',
        'Enviar um master a um colaborador sem um anexo de 100 MB.',
        'Arquivamento de longo prazo com checksums embutidos no formato.',
      ],
      useCases: [
        {
          title: 'Trocar de formato para um dispositivo',
          description: 'Faça uma cópia em FLAC para um player que precise dela.',
        },
        {
          title: 'Preparar para edição',
          description: 'Entregue um arquivo sem perdas a uma DAW ou a um editor de vídeo.',
        },
        {
          title: 'Um arquivo por vez',
          description: 'Arquive um conjunto de gravações sem perdas, um envio para cada.',
        },
        {
          title: 'Limpar no caminho',
          description: 'Remova o ruído de fundo primeiro e guarde o resultado limpo como FLAC.',
        },
      ],
      whyMediaManipulator: [
        'Escolha uma taxa de amostragem ou um layout de canais, ou deixe os dois como estão na origem.',
        'Nivele um master baixo e arquive-o como FLAC em uma só etapa.',
      ],
      privacyNote: 'Seu áudio é comprimido sem perdas para FLAC pelo FFmpeg no nosso servidor. Nenhum serviço de áudio externo está envolvido. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos. Você recebe um arquivo novo; o arquivo enviado não é alterado.',
      faq: [
        {
          question: 'O que é FLAC?',
          answer: 'O FLAC comprime o áudio sem perder nada, normalmente para 50 a 70 por cento do tamanho do WAV, e decodifica para uma cópia idêntica bit a bit.',
        },
        {
          question: 'Converter para FLAC melhora o som?',
          answer: 'Não. Um FLAC feito a partir de um MP3 não é melhor que o MP3; o FLAC só preserva o que já está lá.',
        },
        {
          question: 'Posso cortar o áudio enquanto converto para FLAC?',
          answer: 'Sim. A seção de corte define um início e um fim, e o FLAC codifica só esse trecho.',
        },
        {
          question: 'Um MP3 com capa converte para FLAC?',
          answer: 'Sim. A arte embutida é lida como imagem, não como vídeo, então a validação passa e o áudio é codificado normalmente.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Saída sem perdas; o tamanho do arquivo depende da duração e da taxa de amostragem.',
        ],
      },
      related: [
        {
          label: 'Conversor de áudio',
          to: '/tools/audio-converter',
          description: 'Converta entre todos os formatos de áudio comuns.',
        },
        {
          label: 'Alterar a velocidade do áudio',
          to: '/tools/change-audio-speed',
          description: 'Acelere ou desacelere uma gravação.',
        },
        {
          label: 'Alterar o tom do áudio',
          to: '/tools/change-audio-pitch',
          description: 'Desloque a tonalidade para cima ou para baixo.',
        },
        {
          label: 'Normalizar áudio',
          to: '/tools/normalize-audio',
          description: 'Nivele o volume.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Remoção de ruído com IA.',
        },
        {
          label: 'Remover vocais de uma música',
          to: '/tools/remove-vocals-from-song',
          description: 'Crie um instrumental.',
        },
      ],
      embed: {
        title: 'Converter áudio para FLAC',
        description: 'Envie qualquer arquivo de áudio. A saída fica fixa em FLAC; a taxa de amostragem e os canais são mantidos a menos que você os altere. Depois, pressione Converter.',
      },
    },
    'convert-audio-to-ogg': {
      name: 'Converter áudio para OGG',
      h1: 'Converter áudio para OGG online grátis',
      tagline: 'Converta MP3, M4A, WAV, OGG, FLAC e qualquer outro arquivo de áudio para OGG na taxa de bits que você escolher.',
      metaTitle: 'Converter áudio para OGG online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de áudio para OGG. Envie MP3, WAV, M4A, OGG, FLAC ou AAC e baixe em OGG. Escolha a taxa de bits. Sem marca d\'água, sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter áudio para OGG online grátis',
      ogDescription: 'Envie qualquer arquivo de áudio e baixe em OGG. Escolha a taxa de bits. Grátis, sem cadastro.',
      intro: 'O OGG Vorbis é um formato com perdas, livre e sem patentes, que soa melhor que o MP3 na mesma taxa de bits e é nativo em navegadores, no Android e em motores de jogos. O Media Manipulator converte qualquer formato de áudio comum para OGG em um só envio, mantendo a taxa de amostragem e o layout de canais a menos que você os altere, e oferece corte, normalização, equalização e as ferramentas de limpeza por IA no mesmo formulário.',
      whatItDoes: [
        'Converte MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3 e WMA para OGG.',
        'Permite escolher a taxa de bits, a taxa de amostragem e o layout de canais.',
        'Corte, volume, normalização de loudness e equalização acontecem na mesma passagem do FFmpeg que a codificação Vorbis.',
        'Limpe uma voz ou remova o ruído de fundo com IA antes de o codificador Vorbis rodar.',
      ],
      flowSteps: [
        {
          title: 'Envie o áudio',
          description: 'Um MP3, WAV, FLAC ou outro arquivo de áudio para o seu jogo ou site.',
        },
        {
          title: 'Ajuste se precisar',
          description: 'Escolha a taxa de bits; corte ou aplique efeitos.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg codifica o OGG nos nossos servidores.',
        },
        {
          title: 'Baixe',
          description: 'Salve o arquivo OGG.',
        },
      ],
      advancedDetails: [
        'A saída OGG usa o codificador libvorbis do FFmpeg; 192 kbps é o padrão e uma escolha segura para música.',
        'Dispositivos Apple e alguns sons automotivos não tocam OGG; use M4A ou MP3 para eles.',
        'A capa presente na origem é reconhecida como um anexo de imagem e não dispara a verificação de faixa de vídeo.',
      ],
      whyItMatters: [
        'Recursos de som para jogos e aplicativos, onde arquivos pequenos e decodificação sem royalties importam.',
        'Áudio para a web que precisa tocar no Firefox e no Chrome sem licença.',
        'Arquivos de podcast ou música para players Linux e Android.',
      ],
      useCases: [
        {
          title: 'Trocar de formato para um dispositivo',
          description: 'Faça uma cópia em OGG para um player que precise dela.',
        },
        {
          title: 'Preparar para edição',
          description: 'Crie um arquivo pequeno e compatível para um projeto.',
        },
        {
          title: 'Um arquivo por vez',
          description: 'Prepare efeitos sonoros para um motor de jogo, um arquivo por vez.',
        },
        {
          title: 'Limpar no caminho',
          description: 'Tire o zumbido de uma gravação antes de ela sair como um recurso OGG.',
        },
      ],
      whyMediaManipulator: [
        'Taxa de bits, taxa de amostragem e canais ficam por sua conta em cada OGG.',
        'Corte o silêncio de um efeito sonoro enquanto ele vira OGG.',
      ],
      privacyNote: 'Seu áudio é codificado em OGG Vorbis pelo FFmpeg no nosso servidor. Nenhum serviço de áudio externo está envolvido. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos. Você recebe um arquivo novo; o arquivo enviado não é alterado.',
      faq: [
        {
          question: 'O que é OGG?',
          answer: 'O OGG Vorbis é um formato com perdas, livre e sem patentes, que soa melhor que o MP3 na mesma taxa de bits e é nativo em navegadores, no Android e em motores de jogos.',
        },
        {
          question: 'Converter para OGG melhora o som?',
          answer: 'Não. Dispositivos Apple e alguns sons automotivos não tocam OGG; use M4A ou MP3 para eles.',
        },
        {
          question: 'Posso cortar o áudio enquanto converto para OGG?',
          answer: 'Sim. Marque o início e o fim, e o OGG conterá só essa parte.',
        },
        {
          question: 'Posso converter para OGG um M4A que tem capa de álbum?',
          answer: 'Sim. A capa é vista como um anexo de imagem, e não como uma faixa de vídeo, então a tarefa prossegue e produz um Vorbis só de áudio.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Saída com perdas; a taxa de bits que você escolher define o tamanho.',
        ],
      },
      related: [
        {
          label: 'Conversor de áudio',
          to: '/tools/audio-converter',
          description: 'Converta entre todos os formatos de áudio comuns.',
        },
        {
          label: 'Alterar a velocidade do áudio',
          to: '/tools/change-audio-speed',
          description: 'Acelere ou desacelere uma gravação.',
        },
        {
          label: 'Alterar o tom do áudio',
          to: '/tools/change-audio-pitch',
          description: 'Desloque a tonalidade para cima ou para baixo.',
        },
        {
          label: 'Normalizar áudio',
          to: '/tools/normalize-audio',
          description: 'Nivele o volume.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Remoção de ruído com IA.',
        },
        {
          label: 'Remover vocais de uma música',
          to: '/tools/remove-vocals-from-song',
          description: 'Crie um instrumental.',
        },
      ],
      embed: {
        title: 'Converter áudio para OGG',
        description: 'Envie qualquer arquivo de áudio. A saída fica fixa em OGG; escolha a taxa de bits, a taxa de amostragem e os canais e depois pressione Converter.',
      },
    },
    'convert-audio-to-m4a': {
      name: 'Converter áudio para M4A / AAC',
      h1: 'Converter áudio para M4A / AAC online grátis',
      tagline: 'Converta MP3, M4A, WAV, OGG, FLAC e qualquer outro arquivo de áudio para M4A / AAC na taxa de bits que você escolher.',
      metaTitle: 'Converter áudio para M4A / AAC online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de áudio para M4A / AAC. Envie MP3, WAV, M4A, OGG, FLAC ou AAC e baixe em M4A / AAC. Escolha a taxa de bits. Sem marca d\'água, sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter áudio para M4A / AAC online grátis',
      ogDescription: 'Envie qualquer arquivo de áudio e baixe em M4A / AAC. Escolha a taxa de bits. Grátis, sem cadastro.',
      intro: 'M4A é áudio AAC em um contêiner MP4, o formato que o Apple Music, os iPhones, o YouTube e a maioria dos serviços de streaming usam. Ele supera o MP3 em qualidade por kilobyte. O Media Manipulator converte qualquer formato de áudio comum para M4A / AAC em um só envio, mantendo a taxa de amostragem e o layout de canais a menos que você os altere, e oferece corte, normalização, equalização e as ferramentas de limpeza por IA no mesmo formulário.',
      whatItDoes: [
        'Converte MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3 e WMA para M4A / AAC.',
        'Permite escolher a taxa de bits, a taxa de amostragem e o layout de canais.',
        'Corte, ganho, normalização, equalização e efeitos entram na mesma codificação que o AAC.',
        'As ferramentas de IA do formulário podem limpar uma nota de voz ou remover vocais antes de o AAC ser gravado.',
      ],
      flowSteps: [
        {
          title: 'Envie o áudio',
          description: 'Um master em WAV, um MP3 ou uma nota de voz.',
        },
        {
          title: 'Ajuste se precisar',
          description: 'Escolha a taxa de bits; corte ou aplique efeitos.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg codifica o M4A / AAC nos nossos servidores.',
        },
        {
          title: 'Baixe',
          description: 'Salve o arquivo M4A / AAC.',
        },
      ],
      advancedDetails: [
        'A saída M4A / AAC usa o codificador aac do FFmpeg; 192 kbps é o padrão e uma escolha segura para música.',
        'Alguns players antigos que só tocam MP3 e algumas centrais multimídia de carro não leem AAC.',
        'Uma capa de álbum embutida é reconhecida como imagem e nunca é confundida com uma faixa de vídeo.',
      ],
      whyItMatters: [
        'Música e notas de voz para iPhone, iPad e Mac.',
        'Faixas de áudio que você vai depois multiplexar em um vídeo MP4.',
        'Podcasts e audiolivros: marcadores de capítulo e arquivos menores que o MP3.',
      ],
      useCases: [
        {
          title: 'Trocar de formato para um dispositivo',
          description: 'Faça uma cópia em M4A / AAC para um player que precise dela.',
        },
        {
          title: 'Preparar para edição',
          description: 'Crie um arquivo pequeno e compatível para um projeto.',
        },
        {
          title: 'Um arquivo por vez',
          description: 'Converta notas de voz para uma biblioteca do iPhone, cortando os silêncios pelo caminho.',
        },
        {
          title: 'Limpar no caminho',
          description: 'Rode a limpeza de voz em uma tomada de podcast e salve direto em M4A.',
        },
      ],
      whyMediaManipulator: [
        'Taxa de bits, taxa de amostragem e número de canais são ajustáveis na saída AAC.',
        'Normalize um episódio e transforme-o em M4A sem um segundo envio.',
      ],
      privacyNote: 'Seu áudio é codificado em AAC dentro de um arquivo M4A pelo FFmpeg no nosso servidor. Nenhum serviço de áudio externo está envolvido. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos. Você recebe um arquivo novo; o arquivo enviado não é alterado.',
      faq: [
        {
          question: 'O que é M4A / AAC?',
          answer: 'M4A é áudio AAC em um contêiner MP4, o formato que o Apple Music, os iPhones, o YouTube e a maioria dos serviços de streaming usam. Ele supera o MP3 em qualidade por kilobyte.',
        },
        {
          question: 'Converter para M4A / AAC melhora o som?',
          answer: 'Não. Alguns players antigos que só tocam MP3 e algumas centrais multimídia de carro não leem AAC.',
        },
        {
          question: 'Posso cortar o áudio enquanto converto para M4A / AAC?',
          answer: 'Sim. Defina o trecho na seção de corte; o M4A começa e termina onde você indicou.',
        },
        {
          question: 'A capa de álbum no meu MP3 quebra a conversão para M4A?',
          answer: 'Não. O fluxo da arte é identificado como imagem, não como vídeo, e a codificação AAC roda normalmente.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Saída com perdas; a taxa de bits que você escolher define o tamanho.',
        ],
      },
      related: [
        {
          label: 'Conversor de áudio',
          to: '/tools/audio-converter',
          description: 'Converta entre todos os formatos de áudio comuns.',
        },
        {
          label: 'Alterar a velocidade do áudio',
          to: '/tools/change-audio-speed',
          description: 'Acelere ou desacelere uma gravação.',
        },
        {
          label: 'Alterar o tom do áudio',
          to: '/tools/change-audio-pitch',
          description: 'Desloque a tonalidade para cima ou para baixo.',
        },
        {
          label: 'Normalizar áudio',
          to: '/tools/normalize-audio',
          description: 'Nivele o volume.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Remoção de ruído com IA.',
        },
        {
          label: 'Remover vocais de uma música',
          to: '/tools/remove-vocals-from-song',
          description: 'Crie um instrumental.',
        },
      ],
      embed: {
        title: 'Converter áudio para M4A / AAC',
        description: 'Envie qualquer arquivo de áudio. A saída fica fixa em M4A / AAC; escolha a taxa de bits, a taxa de amostragem e os canais e depois pressione Converter.',
      },
    },
    'convert-audio-to-opus': {
      name: 'Converter áudio para Opus',
      h1: 'Converter áudio para Opus online grátis',
      tagline: 'Converta MP3, M4A, WAV, OGG, FLAC e qualquer outro arquivo de áudio para Opus na taxa de bits que você escolher.',
      metaTitle: 'Converter áudio para Opus online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de áudio para Opus. Envie MP3, WAV, M4A, OGG, FLAC ou AAC e baixe em Opus. Escolha a taxa de bits. Sem marca d\'água, sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter áudio para Opus online grátis',
      ogDescription: 'Envie qualquer arquivo de áudio e baixe em Opus. Escolha a taxa de bits. Grátis, sem cadastro.',
      intro: 'O Opus é o codec aberto mais novo e a melhor opção com perdas para voz e música em taxas de bits baixas: Opus a 64 kbps soa como MP3 a 128 kbps. É o que o WhatsApp, o Discord e o WebRTC usam. O Media Manipulator converte qualquer formato de áudio comum para Opus em um só envio, mantendo a taxa de amostragem e o layout de canais a menos que você os altere, e oferece corte, normalização, equalização e as ferramentas de limpeza por IA no mesmo formulário.',
      whatItDoes: [
        'Converte MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3 e WMA para Opus.',
        'Permite escolher a taxa de bits, a taxa de amostragem e o layout de canais.',
        'Corte, volume, normalização e equalização são aplicados na mesma passagem que a codificação Opus.',
        'Antes de codificar, o formulário pode remover o ruído de fundo ou limpar a fala com IA na nossa GPU.',
      ],
      flowSteps: [
        {
          title: 'Envie o áudio',
          description: 'Notas de voz, podcasts, música ou qualquer áudio comum.',
        },
        {
          title: 'Ajuste se precisar',
          description: 'Escolha a taxa de bits; corte ou aplique efeitos.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg codifica o Opus nos nossos servidores.',
        },
        {
          title: 'Baixe',
          description: 'Salve o arquivo Opus.',
        },
      ],
      advancedDetails: [
        'A saída Opus usa o codificador libopus do FFmpeg; 192 kbps é o padrão e uma escolha segura para música.',
        'O iTunes, dispositivos Apple mais antigos e muitos players de hardware não suportam Opus; escolha M4A para eles.',
        'A capa de álbum em um arquivo de origem é detectada como imagem e não interrompe a conversão.',
      ],
      whyItMatters: [
        'Notas de voz, podcasts e audiolivros com uma fração do tamanho.',
        'Streaming ou incorporação de áudio onde a largura de banda importa.',
        'Discord, Matrix e bots de mensagens que aceitam Opus nativamente.',
      ],
      useCases: [
        {
          title: 'Trocar de formato para um dispositivo',
          description: 'Faça uma cópia em Opus para um player que precise dela.',
        },
        {
          title: 'Preparar para edição',
          description: 'Crie um arquivo pequeno e compatível para um projeto.',
        },
        {
          title: 'Um arquivo por vez',
          description: 'Reduza uma série de aulas para Opus, uma por uma.',
        },
        {
          title: 'Limpar no caminho',
          description: 'Limpe a gravação de uma chamada ruidosa e guarde-a como um arquivo Opus pequeno.',
        },
      ],
      whyMediaManipulator: [
        'Escolha a taxa de bits, a taxa de amostragem e os canais do Opus, ou mantenha os padrões.',
        'Corte e normalize uma nota de voz no caminho para o Opus.',
      ],
      privacyNote: 'Seu áudio é codificado em Opus pelo FFmpeg no nosso servidor. Nenhum serviço de áudio externo está envolvido. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos. Você recebe um arquivo novo; o arquivo enviado não é alterado.',
      faq: [
        {
          question: 'O que é Opus?',
          answer: 'O Opus é o codec aberto mais novo e a melhor opção com perdas para voz e música em taxas de bits baixas: Opus a 64 kbps soa como MP3 a 128 kbps. É o que o WhatsApp, o Discord e o WebRTC usam.',
        },
        {
          question: 'Converter para Opus melhora o som?',
          answer: 'Não. O iTunes, dispositivos Apple mais antigos e muitos players de hardware não suportam Opus; escolha M4A para eles.',
        },
        {
          question: 'Posso cortar o áudio enquanto converto para Opus?',
          answer: 'Sim. Só o trecho entre o início e o fim que você definir é codificado em Opus.',
        },
        {
          question: 'Um arquivo de áudio com capa converte para Opus?',
          answer: 'Sim. A capa é detectada como imagem, não como fluxo de vídeo, então o arquivo é aceito e só o áudio é codificado.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Saída com perdas; a taxa de bits que você escolher define o tamanho.',
        ],
      },
      related: [
        {
          label: 'Conversor de áudio',
          to: '/tools/audio-converter',
          description: 'Converta entre todos os formatos de áudio comuns.',
        },
        {
          label: 'Alterar a velocidade do áudio',
          to: '/tools/change-audio-speed',
          description: 'Acelere ou desacelere uma gravação.',
        },
        {
          label: 'Alterar o tom do áudio',
          to: '/tools/change-audio-pitch',
          description: 'Desloque a tonalidade para cima ou para baixo.',
        },
        {
          label: 'Normalizar áudio',
          to: '/tools/normalize-audio',
          description: 'Nivele o volume.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Remoção de ruído com IA.',
        },
        {
          label: 'Remover vocais de uma música',
          to: '/tools/remove-vocals-from-song',
          description: 'Crie um instrumental.',
        },
      ],
      embed: {
        title: 'Converter áudio para Opus',
        description: 'Envie qualquer arquivo de áudio. A saída fica fixa em Opus; escolha a taxa de bits, a taxa de amostragem e os canais e depois pressione Converter.',
      },
    },
    'convert-mp3-to-wav': {
      name: 'Converter MP3 para WAV',
      h1: 'Converter MP3 para WAV online grátis',
      tagline: 'Transforme um MP3 em um WAV sem compressão para edição, sampling ou gravação em CD.',
      metaTitle: 'Converter MP3 para WAV online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de MP3 para WAV. Envie um MP3 e baixe um WAV PCM de 16 bits sem compressão, na taxa de amostragem original. Sem marca d\'água, sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter MP3 para WAV online grátis',
      ogDescription: 'Entra MP3, sai WAV sem compressão. Grátis, sem cadastro.',
      intro: 'Editores de áudio, samplers e gravadores de CD querem PCM sem compressão, e algumas ferramentas mais antigas recusam MP3 de vez. Converter para WAV decodifica o MP3 uma única vez, para que nenhuma qualidade a mais se perca na edição. O Media Manipulator faz isso nos nossos servidores com o FFmpeg, mantém a taxa de amostragem e os canais originais e ignora a capa de álbum embutida em vez de confundi-la com uma faixa de vídeo.',
      whatItDoes: [
        'Decodifica o MP3 para WAV PCM de 16 bits na taxa de amostragem e no layout de canais de origem.',
        'Corte, normalização, fade e equalização opcionais na mesma passagem.',
        'Lida com MP3s que têm capa embutida e tags ID3.',
      ],
      flowSteps: [
        {
          title: 'Envie um MP3',
          description: 'Qualquer taxa de bits, com ou sem capa.',
        },
        {
          title: 'Ajuste se precisar',
          description: 'Corte, normalize, equalize.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg decodifica para PCM.',
        },
        {
          title: 'Baixe',
          description: 'Salve o WAV.',
        },
      ],
      advancedDetails: [
        'A saída WAV é pcm_s16le; o arquivo tem cerca de 10 MB por minuto de áudio estéreo a 44,1 kHz.',
        'A decodificação não recupera nada do que o codificador MP3 descartou; ela só evita perdas adicionais.',
      ],
      whyItMatters: [
        'Editar um MP3 e salvá-lo de novo como MP3 perde qualidade a cada vez; o WAV acaba com isso.',
        'Samplers, DAWs e gravadores de CD esperam PCM.',
      ],
      useCases: [
        {
          title: 'Editar em uma DAW',
          description: 'Importe sem etapa de decodificação nem perda de geração.',
        },
        {
          title: 'Gravar um CD de áudio',
          description: 'Gravadores de CD querem WAV a 44,1 kHz.',
        },
        {
          title: 'Samplear um som',
          description: 'Carregue em um sampler ou em um motor de jogo.',
        },
      ],
      whyMediaManipulator: [
        'Mantém a taxa de amostragem e os canais originais.',
        'A capa no MP3 é tratada corretamente.',
      ],
      privacyNote: 'Seu MP3 é decodificado uma única vez pelo FFmpeg no nosso servidor em um WAV PCM de 16 bits. Nenhum serviço de áudio externo está envolvido. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos. Você recebe um arquivo novo; o arquivo enviado não é alterado.',
      faq: [
        {
          question: 'O WAV vai soar melhor que o MP3?',
          answer: 'Não. Ele soa idêntico; a questão é que edições posteriores não vão degradá-lo.',
        },
        {
          question: 'Por que o WAV é tão maior?',
          answer: 'O WAV não tem compressão: cerca de 10 MB por minuto de áudio estéreo com qualidade de CD.',
        },
        {
          question: 'Meu MP3 tem capa de álbum. Isso é um problema?',
          answer: 'Não. A capa embutida é reconhecida como imagem e ignorada.',
        },
      ],
      related: [
        {
          label: 'Converter áudio para WAV',
          to: '/tools/convert-audio-to-wav',
          description: 'Qualquer formato para WAV.',
        },
        {
          label: 'Converter WAV para MP3',
          to: '/tools/convert-wav-to-mp3',
          description: 'O caminho inverso.',
        },
        {
          label: 'Conversor de áudio',
          to: '/tools/audio-converter',
          description: 'Converta entre todos os formatos de áudio comuns.',
        },
        {
          label: 'Alterar a velocidade do áudio',
          to: '/tools/change-audio-speed',
          description: 'Acelere ou desacelere uma gravação.',
        },
        {
          label: 'Alterar o tom do áudio',
          to: '/tools/change-audio-pitch',
          description: 'Desloque a tonalidade para cima ou para baixo.',
        },
        {
          label: 'Normalizar áudio',
          to: '/tools/normalize-audio',
          description: 'Nivele o volume.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Remoção de ruído com IA.',
        },
        {
          label: 'Remover vocais de uma música',
          to: '/tools/remove-vocals-from-song',
          description: 'Crie um instrumental.',
        },
      ],
      embed: {
        title: 'Converter MP3 para WAV',
        description: 'Envie um MP3. A saída fica fixa em WAV; corte ou normalize se quiser e depois pressione Converter.',
      },
    },
    'change-audio-speed': {
      name: 'Alterar a velocidade do áudio',
      h1: 'Alterar a velocidade do áudio online: acelere ou desacelere',
      tagline: 'Acelere uma aula ou um podcast para 1,5x, ou deixe uma música ou gravação mais lenta, a 0,75x, para praticar, sem alterar o tom.',
      metaTitle: 'Alterar velocidade do áudio online (sem mudar o tom) | Media Manipulator',
      metaDescription: 'Alterador de velocidade de áudio online e gratuito. Acelere ou desacelere MP3, WAV, M4A e mais, de 0,25x a 4x, mantendo o tom. Ideal para aulas, podcasts e faixas de prática. Sem cadastro.',
      ogTitle: 'Alterar a velocidade do áudio online grátis',
      ogDescription: 'Mais rápido ou mais devagar, sem o efeito de voz de esquilo. Grátis, sem cadastro.',
      intro: 'Uma aula de duas horas a 1,5x vira 80 minutos. Um solo de guitarra a 0,75x fica possível de aprender. Alterar a velocidade do áudio é útil todo dia, e o problema é o tom: acelerar do jeito ingênuo transforma as vozes em voz de esquilo. O Media Manipulator alonga o áudio no tempo nos nossos servidores com o filtro de andamento do FFmpeg, que mantém o tom exatamente onde estava, de um quarto da velocidade até quatro vezes.',
      whatItDoes: [
        'Acelera (de 1,1x a 4x) ou desacelera (de 0,25x a 0,9x) qualquer arquivo de áudio.',
        'Preserva o tom, então fala e música continuam na mesma tonalidade.',
        'Exporta em MP3 por padrão, ou em WAV, FLAC, M4A, OGG e Opus.',
        'Corte, normalização e equalização opcionais na mesma passagem.',
      ],
      flowSteps: [
        {
          title: 'Envie o áudio',
          description: 'MP3, WAV, M4A, OGG, FLAC e mais.',
        },
        {
          title: 'Defina a velocidade',
          description: '1,5x vem pré-selecionado; de 0,25x a 4x.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg alonga o tempo mantendo o tom.',
        },
        {
          title: 'Baixe',
          description: 'Salve o arquivo com o novo andamento.',
        },
      ],
      advancedDetails: [
        'Usa o filtro atempo, encadeado automaticamente para fatores fora da faixa de 0,5 a 2,0.',
        'O alongamento temporal introduz artefatos leves em fatores extremos; de 0,5x a 2x é transparente para fala.',
        'Para alterar velocidade E tom juntos (o efeito de fita), use a opção de alongamento temporal da ferramenta de tom.',
      ],
      whyItMatters: [
        'Aulas, audiolivros e podcasts costumam ficar confortáveis entre 1,25x e 2x.',
        'Músicos praticam trechos difíceis a 50 a 75 por cento da velocidade.',
        'Transcritores desaceleram gravações para captar cada palavra.',
      ],
      useCases: [
        {
          title: 'Aula mais rápida',
          description: 'Ouça uma aula gravada a 1,5x.',
        },
        {
          title: 'Faixa de prática',
          description: 'Desacelere um solo para 0,75x na mesma tonalidade.',
        },
        {
          title: 'Transcrição',
          description: 'Desacelere uma entrevista para 0,8x.',
        },
        {
          title: 'Caber em um tempo definido',
          description: 'Ajuste uma locução em 5 por cento para caber.',
        },
      ],
      whyMediaManipulator: [
        'O tom é preservado por padrão; nada de voz de esquilo nem de som de fita lenta.',
        'Qualquer formato de saída, além de corte e normalização no mesmo envio.',
      ],
      privacyNote: 'Sua gravação é acelerada ou desacelerada pelo FFmpeg no nosso servidor, usando rubberband ou atempo conforme o modo que você escolher. Nenhum serviço de áudio externo está envolvido. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos. Você recebe um arquivo novo; o arquivo enviado não é alterado.',
      faq: [
        {
          question: 'O tom muda?',
          answer: 'Não. O filtro de andamento mantém o tom exatamente como estava.',
        },
        {
          question: 'Até que velocidade posso ir?',
          answer: '4x em uma passagem. Rode o resultado de novo para ir além.',
        },
        {
          question: 'O áudio desacelerado vai soar robótico?',
          answer: 'Até 0,5x ele fica limpo; abaixo disso, algum efeito de fase fica audível.',
        },
        {
          question: 'Posso alterar velocidade e tom juntos?',
          answer: 'Sim. Use a ferramenta Alterar o tom do áudio, que tem um controle de alongamento temporal.',
        },
      ],
      related: [
        {
          label: 'Conversor de áudio',
          to: '/tools/audio-converter',
          description: 'Converta entre todos os formatos de áudio comuns.',
        },
        {
          label: 'Alterar o tom do áudio',
          to: '/tools/change-audio-pitch',
          description: 'Desloque a tonalidade para cima ou para baixo.',
        },
        {
          label: 'Normalizar áudio',
          to: '/tools/normalize-audio',
          description: 'Nivele o volume.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Remoção de ruído com IA.',
        },
        {
          label: 'Remover vocais de uma música',
          to: '/tools/remove-vocals-from-song',
          description: 'Crie um instrumental.',
        },
      ],
      embed: {
        title: 'Alterar a velocidade de um arquivo de áudio',
        description: 'Envie um arquivo de áudio e defina um multiplicador de velocidade; 1,5x vem pré-selecionado. O tom é preservado, então as vozes continuam naturais. Para mudar a tonalidade também, use a ferramenta de tom.',
      },
    },
    'change-audio-pitch': {
      name: 'Alterar o tom do áudio',
      h1: 'Alterar o tom do áudio online: transponha para cima ou para baixo',
      tagline: 'Desloque uma música ou gravação em semitons para mudar a tonalidade, abaixar um vocal ou afinar um sample, mantendo o andamento.',
      metaTitle: 'Alterar o tom do áudio online grátis: transpor semitons | Media Manipulator',
      metaDescription: 'Alterador de tom online e gratuito. Transponha MP3, WAV ou qualquer áudio para cima ou para baixo em semitons para mudar a tonalidade, sem alterar a velocidade. Alongamento temporal opcional. Sem marca d\'água, sem cadastro.',
      ogTitle: 'Alterar o tom do áudio online grátis',
      ogDescription: 'Transponha qualquer áudio em semitons. Grátis, sem cadastro.',
      intro: 'Uma base na tonalidade errada para a sua voz, um sample que precisa combinar com uma música, um vocal que pediria um tom abaixo: a mudança de tom resolve todos esses casos. O Media Manipulator transpõe o áudio em semitons nos nossos servidores com o FFmpeg, mantendo a duração inalterada, e permite combinar isso com um alongamento temporal quando você prefere o velho efeito de velocidade de fita.',
      whatItDoes: [
        'Transpõe o áudio para cima ou para baixo em até 12 semitons (uma oitava).',
        'Mantém a mesma duração, então a faixa continua cabendo.',
        'Alongamento temporal opcional para mudar o comprimento de forma independente.',
        'Grava o áudio deslocado como MP3, WAV, FLAC, M4A, OGG ou Opus.',
      ],
      flowSteps: [
        {
          title: 'Envie o áudio',
          description: 'Qualquer formato de áudio comum.',
        },
        {
          title: 'Defina os semitons',
          description: '+2 vem pré-selecionado; de -12 a +12.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg reamostra e reajusta o tempo.',
        },
        {
          title: 'Baixe',
          description: 'Salve o arquivo transposto.',
        },
      ],
      advancedDetails: [
        'O deslocamento reamostra por 2^(semitons/12) e compensa o andamento para que o comprimento não mude.',
        'Deslocamentos grandes (mais de 5 semitons) em mixagens completas podem soar artificiais; vocais e instrumentos isolados se comportam melhor.',
        'A preservação de formantes está ativada, então uma voz abaixada não vira outra pessoa.',
      ],
      whyItMatters: [
        'Cantores transpõem bases para uma tonalidade confortável.',
        'Produtores afinam samples e vocais para uma música.',
        'Um ou dois semitons abaixo deixam um vocal de demo mais relaxado.',
      ],
      useCases: [
        {
          title: 'Mudar a tonalidade de uma base',
          description: 'Abaixe uma faixa de karaokê em dois semitons.',
        },
        {
          title: 'Afinar um sample',
          description: 'Encaixe um hit de bateria ou de vocal na música.',
        },
        {
          title: 'Abaixar uma locução',
          description: 'Desça uma leitura em um semitom.',
        },
        {
          title: 'Efeito de oitava',
          description: 'Desloque +12 ou -12 para uma camada de efeito.',
        },
      ],
      whyMediaManipulator: [
        'Controle em semitons com a duração preservada, e alongamento temporal quando você quiser.',
        'Qualquer formato de saída, além de corte e normalização no mesmo envio.',
      ],
      privacyNote: 'Seu áudio é deslocado para cima ou para baixo no número de semitons que você escolher, pelo FFmpeg no nosso servidor. Nenhum serviço de áudio externo está envolvido. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos. Você recebe um arquivo novo; o arquivo enviado não é alterado.',
      faq: [
        {
          question: 'A velocidade muda?',
          answer: 'Não. A duração é preservada. Use o controle de alongamento temporal se quiser que ela mude.',
        },
        {
          question: 'Até onde posso deslocar?',
          answer: 'Até 12 semitons (uma oitava) para cima ou para baixo.',
        },
        {
          question: 'Uma voz deslocada vai soar natural?',
          answer: 'De um a três semitons, sim. Deslocamentos maiores ficam audíveis; a preservação de formantes evita que soe como desenho animado.',
        },
        {
          question: 'Posso deslocar em cents?',
          answer: 'Ainda não; o controle é em semitons inteiros.',
        },
      ],
      related: [
        {
          label: 'Conversor de áudio',
          to: '/tools/audio-converter',
          description: 'Converta entre todos os formatos de áudio comuns.',
        },
        {
          label: 'Alterar a velocidade do áudio',
          to: '/tools/change-audio-speed',
          description: 'Acelere ou desacelere uma gravação.',
        },
        {
          label: 'Normalizar áudio',
          to: '/tools/normalize-audio',
          description: 'Nivele o volume.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Remoção de ruído com IA.',
        },
        {
          label: 'Remover vocais de uma música',
          to: '/tools/remove-vocals-from-song',
          description: 'Crie um instrumental.',
        },
      ],
      embed: {
        title: 'Alterar o tom de um arquivo de áudio',
        description: 'Envie um arquivo de áudio. A seção Avançado abre com o controle deslizante de tom; +2 semitons vem pré-selecionado. Valores negativos abaixam a tonalidade. O alongamento temporal fica ao lado, se você também quiser mudar o comprimento.',
      },
    },
    'normalize-audio': {
      name: 'Normalizar áudio',
      h1: 'Normalizar o loudness do áudio online',
      tagline: 'Leve uma gravação baixa a um volume consistente, para que podcasts, notas de voz e playlists variadas toquem no mesmo nível.',
      metaTitle: 'Normalizar áudio online grátis (loudness) | Media Manipulator',
      metaDescription: 'Normalizador de áudio online e gratuito. Iguale o volume de MP3, WAV, M4A e outros arquivos com normalização de loudness EBU R128. Ideal para podcasts e notas de voz. Sem marca d\'água, sem cadastro.',
      ogTitle: 'Normalizar áudio online grátis',
      ogDescription: 'Loudness consistente para qualquer gravação. Grátis, sem cadastro.',
      intro: 'Uma nota de voz gravada com o braço esticado fica baixa; uma música extraída de um CD fica alta; tocadas uma após a outra, elas fazem o ouvinte correr para o volume. A normalização de loudness mede o volume percebido de um arquivo inteiro e o leva a um alvo padrão, a mesma medição EBU R128 que emissoras e serviços de streaming usam. O Media Manipulator roda isso nos nossos servidores com o filtro loudnorm do FFmpeg, que também mantém os picos reais abaixo do teto para que nada clipe.',
      whatItDoes: [
        'Mede o loudness integrado e normaliza para um alvo de padrão broadcast.',
        'Limita os picos reais para que a saída nunca clipe.',
        'Ganho, fade in/out e compressão de faixa dinâmica opcionais na mesma seção.',
        'Salva o arquivo nivelado em MP3, WAV, FLAC, M4A, OGG ou Opus.',
      ],
      flowSteps: [
        {
          title: 'Envie o áudio',
          description: 'Qualquer formato comum.',
        },
        {
          title: 'Mantenha a normalização ativada',
          description: 'Adicione fades ou compressão se precisar.',
        },
        {
          title: 'Converta',
          description: 'O loudnorm do FFmpeg mede e corrige.',
        },
        {
          title: 'Baixe',
          description: 'Salve o arquivo nivelado.',
        },
      ],
      advancedDetails: [
        'Usa o loudnorm (EBU R128) com o alvo integrado padrão de -24 LUFS e teto de pico real de -2 dBTP.',
        'Isto é normalização de loudness, não normalização de pico: dois arquivos que atingem 0 dB de pico ainda podem diferir muito em volume percebido.',
        'Para uma mudança de ganho fixa e rápida, sem análise, use o controle Amplificar ou a ferramenta Ajustar volume.',
      ],
      whyItMatters: [
        'Ouvintes abandonam podcasts que exigem ajuste constante de volume.',
        'Playlists e sets de DJ precisam de faixas em um nível consistente.',
        'As plataformas normalizam no envio; fazer isso antes evita surpresas.',
      ],
      useCases: [
        {
          title: 'Episódio de podcast',
          description: 'Nivele uma conversa gravada antes de publicar.',
        },
        {
          title: 'Nota de voz',
          description: 'Aumente uma gravação baixa feita no celular.',
        },
        {
          title: 'Gravação de aula',
          description: 'Iguale um palestrante que se afasta do microfone.',
        },
        {
          title: 'Preparar uma playlist',
          description: 'Normalize faixas extraídas de fontes diferentes.',
        },
      ],
      whyMediaManipulator: [
        'Medição de loudness EBU R128 de verdade, não só uma varredura de picos.',
        'Fades, ganho e compressão na mesma seção.',
      ],
      privacyNote: 'O loudness do seu áudio é medido e nivelado pelo FFmpeg no nosso servidor. Nenhum serviço de áudio externo está envolvido. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos. Você recebe um arquivo novo; o arquivo enviado não é alterado.',
      faq: [
        {
          question: 'Qual loudness-alvo é usado?',
          answer: '-24 LUFS integrado com teto de pico real de -2 dBTP, o padrão EBU R128. Plataformas de podcast costumam mirar entre -16 e -19 LUFS; adicione alguns dB de amplificação se quiser mais alto.',
        },
        {
          question: 'Ele vai deixar tudo no mesmo volume dentro do arquivo?',
          answer: 'Não. Ele nivela o arquivo como um todo. Ative também o compressor para reduzir a variação interna.',
        },
        {
          question: 'Pode clipar?',
          answer: 'Não. O limitador de pico real mantém os picos abaixo do teto.',
        },
        {
          question: 'Posso só deixar mais alto?',
          answer: 'Sim. Use a ferramenta Ajustar volume para uma mudança de ganho fixa.',
        },
      ],
      related: [
        {
          label: 'Ajustar volume',
          to: '/tools/adjust-audio-volume',
          description: 'Ganho fixo para cima ou para baixo.',
        },
        {
          label: 'Conversor de áudio',
          to: '/tools/audio-converter',
          description: 'Converta entre todos os formatos de áudio comuns.',
        },
        {
          label: 'Alterar a velocidade do áudio',
          to: '/tools/change-audio-speed',
          description: 'Acelere ou desacelere uma gravação.',
        },
        {
          label: 'Alterar o tom do áudio',
          to: '/tools/change-audio-pitch',
          description: 'Desloque a tonalidade para cima ou para baixo.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Remoção de ruído com IA.',
        },
        {
          label: 'Remover vocais de uma música',
          to: '/tools/remove-vocals-from-song',
          description: 'Crie um instrumental.',
        },
      ],
      embed: {
        title: 'Normalizar um arquivo de áudio',
        description: 'Envie um arquivo de áudio. A normalização de loudness já vem ativada na seção Processamento básico; adicione amplificação, fades ou compressão se quiser. Pressione Converter.',
      },
    },
    'adjust-audio-volume': {
      name: 'Ajustar o volume do áudio',
      h1: 'Aumentar ou diminuir o volume do áudio online',
      tagline: 'Deixe um arquivo de áudio mais alto ou mais baixo em uma quantidade fixa, de 10 por cento ao dobro, ou em decibéis com o controle de amplificação.',
      metaTitle: 'Aumentar o volume do áudio online grátis (MP3 mais alto) | Media Manipulator',
      metaDescription: 'Alterador de volume online e gratuito. Deixe um MP3, WAV ou qualquer arquivo de áudio mais alto ou mais baixo por um multiplicador fixo ou em decibéis, com fades. Sem marca d\'água, sem cadastro.',
      ogTitle: 'Aumentar ou diminuir o volume do áudio online',
      ogDescription: 'Deixe qualquer áudio mais alto ou mais baixo. Grátis, sem cadastro.',
      intro: 'Às vezes um arquivo está simplesmente baixo demais, ou alto demais para o resto de uma playlist, e uma mudança fixa de ganho é tudo de que ele precisa. O Media Manipulator ajusta o volume do áudio nos nossos servidores com o FFmpeg, por um multiplicador ou em decibéis, adiciona fades se você quiser e pode combinar a mudança com a normalização de loudness para que o resultado não sature.',
      whatItDoes: [
        'Multiplica o volume de 0,1x (muito baixo) a 2x (o dobro).',
        'Ou define um ganho preciso em decibéis, de -60 a +60 dB, com o controle de amplificação.',
        'Fade in e fade out em segundos.',
        'Normalização e compressão opcionais para evitar saturação em aumentos grandes.',
      ],
      flowSteps: [
        {
          title: 'Envie o áudio',
          description: 'Qualquer formato comum.',
        },
        {
          title: 'Defina o volume',
          description: '1,5x vem pré-selecionado; ou use decibéis.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg aplica o ganho.',
        },
        {
          title: 'Baixe',
          description: 'Salve o arquivo ajustado.',
        },
      ],
      advancedDetails: [
        'O volume usa o filtro volume; um multiplicador de 2 equivale a +6 dB, e 0,5 a -6 dB.',
        'Aumentar um arquivo que já tem picos perto de 0 dBFS vai saturar; ative a normalização, que inclui um limitador de true peak.',
        'Para um loudness percebido consistente em vez de um ganho fixo, use Normalizar áudio.',
      ],
      whyItMatters: [
        'Gravações baixas são difíceis de ouvir no alto-falante do celular.',
        'Um toque de celular ou efeito sonoro alto demais incomoda e satura.',
        'O ganho fixo é a ferramenta certa quando você sabe exatamente quanto mudar.',
      ],
      useCases: [
        {
          title: 'Aumentar uma nota de voz baixa',
          description: 'Deixe uma gravação do celular audível.',
        },
        {
          title: 'Domar um efeito alto',
          description: 'Reduza um efeito sonoro em 10 dB.',
        },
        {
          title: 'Toque de celular',
          description: 'Aumente o volume e adicione um fade out.',
        },
        {
          title: 'Música de fundo',
          description: 'Abaixe uma faixa para ficar sob uma voz.',
        },
      ],
      whyMediaManipulator: [
        'Multiplicador ou decibéis, mais fades, em um só lugar.',
        'Normalize e comprima na mesma passagem para evitar saturação.',
      ],
      privacyNote: 'Seu áudio fica mais alto ou mais baixo na quantidade que você definir, pelo FFmpeg no nosso servidor. Nenhum serviço de áudio externo participa. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos. Você recebe um arquivo novo; o arquivo enviado em si não é alterado.',
      faq: [
        {
          question: 'Qual é o aumento máximo?',
          answer: '2x com o multiplicador, ou até +60 dB com o controle de amplificação. Aumentos grandes saturam, a menos que a normalização esteja ativada.',
        },
        {
          question: 'Vai distorcer?',
          answer: 'Só se o sinal amplificado ultrapassar a escala máxima. Ative a normalização, que limita os picos reais (true peak).',
        },
        {
          question: 'Multiplicador ou decibéis?',
          answer: 'Fazem a mesma coisa. 2x equivale a +6 dB; 0,5x equivale a -6 dB.',
        },
        {
          question: 'Posso equilibrar o volume em vez disso?',
          answer: 'Sim. Use Normalizar áudio para um loudness percebido consistente.',
        },
      ],
      related: [
        {
          label: 'Normalizar áudio',
          to: '/tools/normalize-audio',
          description: 'Loudness consistente.',
        },
        {
          label: 'Conversor de áudio',
          to: '/tools/audio-converter',
          description: 'Converta entre todos os formatos de áudio comuns.',
        },
        {
          label: 'Alterar a velocidade do áudio',
          to: '/tools/change-audio-speed',
          description: 'Acelere ou desacelere uma gravação.',
        },
        {
          label: 'Alterar o tom do áudio',
          to: '/tools/change-audio-pitch',
          description: 'Suba ou abaixe a tonalidade.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Remoção de ruído com IA.',
        },
        {
          label: 'Remover vocais de uma música',
          to: '/tools/remove-vocals-from-song',
          description: 'Crie um instrumental.',
        },
      ],
      embed: {
        title: 'Ajustar o volume de um arquivo de áudio',
        description: 'Envie um arquivo de áudio e defina o multiplicador de volume; 1,5x vem pré-selecionado. Para uma mudança em decibéis, use o controle de amplificação em Processamento básico. Aumentos grandes podem saturar; ative a normalização para um resultado seguro.',
      },
    },
    'audio-equalizer': {
      name: 'Equalizador de áudio',
      h1: 'Equalizar áudio online: reforço de graves, agudos, predefinições',
      tagline: 'Aplique reforço de graves, realce de agudos, presença vocal ou uma predefinição de gênero, ou defina filtros passa-baixa e passa-alta, e baixe o resultado.',
      metaTitle: 'Equalizador de áudio online: graves, agudos, vocal | Media Manipulator',
      metaDescription: 'Equalizador de áudio online e gratuito. Aplique predefinições de EQ de reforço de graves, reforço de agudos, vocal, rock, jazz ou clássica, ou defina filtros passa-alta e passa-baixa, em MP3, WAV e mais. Sem cadastro.',
      ogTitle: 'Equalizar áudio online',
      ogDescription: 'Reforço de graves, agudos, presença vocal e mais. Grátis, sem cadastro.',
      intro: 'A equalização molda o timbre de uma gravação: mais graves para uma faixa fina, menos para uma sala retumbante, um realce de presença para a voz se destacar, um passa-alta para remover o ronco. O Media Manipulator aplica a equalização nos nossos servidores com o FFmpeg, de predefinições de um clique a frequências de corte explícitas, e exporta em qualquer formato de áudio.',
      whatItDoes: [
        'Predefinições: reforço de graves, reforço de agudos, vocal, rock, jazz, clássica.',
        'Filtros passa-alta e passa-baixa com frequências de corte ajustáveis.',
        'Combine com volume, normalização, compressão e reverb.',
        'O resultado equalizado pode ser MP3, WAV, FLAC, M4A, OGG ou Opus.',
      ],
      flowSteps: [
        {
          title: 'Envie o áudio',
          description: 'Qualquer formato comum.',
        },
        {
          title: 'Escolha uma predefinição ou filtros',
          description: 'Reforço de graves vem pré-selecionado.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg aplica a cadeia de EQ.',
        },
        {
          title: 'Baixe',
          description: 'Salve o arquivo com o timbre ajustado.',
        },
      ],
      advancedDetails: [
        'As predefinições correspondem aos filtros equalizer, bass e treble do FFmpeg, com ganhos e valores de Q fixos.',
        'Um passa-alta de 80 a 120 Hz remove ruído de manuseio e ronco de gravações de voz; um passa-baixa de 8 a 10 kHz doma o chiado.',
        'A equalização não consegue adicionar frequências que nunca foram gravadas; uma gravação de celular tem pouco abaixo de 100 Hz para reforçar.',
      ],
      whyItMatters: [
        'Um pequeno realce de presença deixa a fala muito mais inteligível em alto-falantes pequenos.',
        'Ronco e chiado são as duas correções mais comuns, e ambas são filtros simples.',
        'As predefinições de gênero dão um caráter rápido e consistente a uma playlist.',
      ],
      useCases: [
        {
          title: 'Clareza da voz',
          description: 'Predefinição vocal mais um passa-alta para um podcast.',
        },
        {
          title: 'Reforço de graves',
          description: 'Encorpe uma gravação fina.',
        },
        {
          title: 'Remover ronco',
          description: 'Passa-alta em 100 Hz.',
        },
        {
          title: 'Domar o chiado',
          description: 'Passa-baixa em 10 kHz em uma transferência de fita antiga.',
        },
      ],
      whyMediaManipulator: [
        'Predefinições e frequências de corte explícitas em uma só seção.',
        'Encadeie com normalização, compressão e reverb no mesmo envio.',
      ],
      privacyNote: 'Os graves, médios e agudos do seu áudio são remodelados pelo equalizador do FFmpeg no nosso servidor. Nenhum serviço de áudio externo participa. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos. Você recebe um arquivo novo; o arquivo enviado em si não é alterado.',
      faq: [
        {
          question: 'Posso definir minhas próprias bandas?',
          answer: 'Estão disponíveis as predefinições e as frequências de corte passa-alta e passa-baixa; o ganho por banda está no roadmap.',
        },
        {
          question: 'O que faz um filtro passa-alta?',
          answer: 'Remove tudo abaixo da frequência de corte: ronco, ruído de manuseio, estalos de plosivas.',
        },
        {
          question: 'A equalização consegue corrigir uma gravação abafada?',
          answer: 'Um reforço de agudos ajuda se os agudos estiverem apenas baixos. Se nunca foram captados, a equalização não consegue inventá-los; experimente a limpeza de voz com IA.',
        },
        {
          question: 'A equalização vai saturar?',
          answer: 'Os reforços podem saturar. Ative a normalização, que inclui um limitador de true peak.',
        },
      ],
      related: [
        {
          label: 'Limpar áudio de voz',
          to: '/tools/clean-voice-audio',
          description: 'Aprimoramento de voz com IA.',
        },
        {
          label: 'Conversor de áudio',
          to: '/tools/audio-converter',
          description: 'Converta entre todos os formatos de áudio comuns.',
        },
        {
          label: 'Alterar a velocidade do áudio',
          to: '/tools/change-audio-speed',
          description: 'Acelere ou desacelere uma gravação.',
        },
        {
          label: 'Alterar o tom do áudio',
          to: '/tools/change-audio-pitch',
          description: 'Suba ou abaixe a tonalidade.',
        },
        {
          label: 'Normalizar áudio',
          to: '/tools/normalize-audio',
          description: 'Equilibre o loudness.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Remoção de ruído com IA.',
        },
        {
          label: 'Remover vocais de uma música',
          to: '/tools/remove-vocals-from-song',
          description: 'Crie um instrumental.',
        },
      ],
      embed: {
        title: 'Equalizar um arquivo de áudio',
        description: 'Envie um arquivo de áudio. O equalizador em Processamento básico já está ativado com a predefinição de reforço de graves; escolha outra predefinição ou defina as frequências de corte passa-alta e passa-baixa. Pressione Converter.',
      },
    },
    'add-reverb-to-audio': {
      name: 'Adicionar reverberação ao áudio',
      h1: 'Adicionar reverberação ou eco ao áudio online',
      tagline: 'Coloque um vocal seco ou uma gravação em uma sala, salão, placa ou mola de reverberação, ou adicione um delay ou eco, e baixe o resultado.',
      metaTitle: 'Adicionar reverberação ou eco ao áudio online grátis | Media Manipulator',
      metaDescription: 'Reverb e eco online e gratuitos. Adicione reverb de sala, hall, placa ou mola, ou um delay, a MP3, WAV e qualquer arquivo de áudio, com controles de nível wet e tamanho da sala. Sem cadastro.',
      ogTitle: 'Adicionar reverberação ou eco ao áudio online',
      ogDescription: 'Sala, hall, placa, mola e delay. Grátis, sem cadastro.',
      intro: 'Um vocal gravado em uma sala tratada soa morto até ser colocado em algum lugar. O reverb adiciona esse espaço; o delay adiciona ritmo. O Media Manipulator aplica reverbs de sala, hall, placa e mola e delays no estilo eco nos nossos servidores com o FFmpeg, com controles de nível wet e tamanho da sala, e exporta em qualquer formato de áudio.',
      whatItDoes: [
        'Tipos de reverb de sala, hall, placa e mola, com tamanho da sala, amortecimento e mistura wet/dry.',
        'Delay de eco, multi-tap e ping-pong com tempo e feedback.',
        'Modulação de chorus, flanger, phaser e tremolo na mesma seção.',
        'Escolha MP3, WAV, FLAC, M4A, OGG ou Opus para a versão com efeito.',
      ],
      flowSteps: [
        {
          title: 'Envie o áudio',
          description: 'Um vocal ou instrumento seco funciona melhor.',
        },
        {
          title: 'Escolha um reverb',
          description: 'Hall vem pré-selecionado; defina o tamanho e a mistura.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg renderiza o efeito.',
        },
        {
          title: 'Baixe',
          description: 'Salve o resultado.',
        },
      ],
      advancedDetails: [
        'Os reverbs são construídos com o aecho do FFmpeg, com conjuntos de delay e decaimento por tipo; o nível wet mistura o efeito com o sinal seco.',
        'O tempo de delay é em milissegundos; um feedback acima de 70 por cento se acumula rapidamente.',
        'Os efeitos são renderizados no arquivo; guarde o original seco caso queira alterá-los depois.',
      ],
      whyItMatters: [
        'Vocais e locuções secos soam artificiais sem um pouco de ambiente.',
        'Um reverb de placa curto é o acabamento padrão em fala e em canto.',
        'Delay e modulação são o caminho mais rápido para criar um elemento de design de som.',
      ],
      useCases: [
        {
          title: 'Acabamento vocal',
          description: 'Placa curta em um take cantado ou falado.',
        },
        {
          title: 'Hall grande',
          description: 'Coloque um coral ou um pad em uma catedral.',
        },
        {
          title: 'Slapback',
          description: 'Um eco rápido em uma guitarra ou vocal.',
        },
        {
          title: 'Design de som',
          description: 'Delay ping-pong e flanger em um efeito.',
        },
      ],
      whyMediaManipulator: [
        'Quatro tipos de reverb, três tipos de delay e quatro efeitos de modulação em uma só seção.',
        'Combine com equalização, normalização e tom no mesmo envio.',
      ],
      privacyNote: 'O reverb é adicionado ao seu áudio pelo FFmpeg no nosso servidor. Nenhum serviço de áudio externo participa. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos. Você recebe um arquivo novo; o arquivo enviado em si não é alterado.',
      faq: [
        {
          question: 'Qual reverb devo usar para voz?',
          answer: 'Placa ou uma sala pequena com 20 a 30 por cento de wet. Hall é para música e efeitos.',
        },
        {
          question: 'Posso remover o reverb?',
          answer: 'Não aqui. A ferramenta de limpeza de voz com IA reduz o som de ambiente na fala.',
        },
        {
          question: 'Posso adicionar reverb e delay ao mesmo tempo?',
          answer: 'Sim. Os dois ficam na mesma seção e podem ser ativados juntos.',
        },
        {
          question: 'O efeito é reversível?',
          answer: 'Não. Ele é renderizado no arquivo; guarde o seu original seco.',
        },
      ],
      related: [
        {
          label: 'Conversor de áudio',
          to: '/tools/audio-converter',
          description: 'Converta entre todos os formatos de áudio comuns.',
        },
        {
          label: 'Alterar a velocidade do áudio',
          to: '/tools/change-audio-speed',
          description: 'Acelere ou desacelere uma gravação.',
        },
        {
          label: 'Alterar o tom do áudio',
          to: '/tools/change-audio-pitch',
          description: 'Suba ou abaixe a tonalidade.',
        },
        {
          label: 'Normalizar áudio',
          to: '/tools/normalize-audio',
          description: 'Equilibre o loudness.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Remoção de ruído com IA.',
        },
        {
          label: 'Remover vocais de uma música',
          to: '/tools/remove-vocals-from-song',
          description: 'Crie um instrumental.',
        },
      ],
      embed: {
        title: 'Adicionar reverb a um arquivo de áudio',
        description: 'Envie um arquivo de áudio. A seção Efeitos temporais abre com o reverb hall selecionado; ajuste o tamanho da sala e o nível wet, ou escolha sala, placa ou mola, ou adicione um delay. Pressione Converter.',
      },
    },
    'trim-audio': {
      name: 'Cortar áudio',
      h1: 'Cortar áudio online grátis',
      tagline: 'Corte um MP3, WAV ou qualquer gravação entre um tempo inicial e final, com uma forma de onda para escolher os pontos, e baixe só essa parte.',
      metaTitle: 'Cortar áudio online grátis: MP3, WAV | Media Manipulator',
      metaDescription: 'Cortador de áudio online e gratuito. Corte qualquer arquivo de áudio em um trecho usando uma forma de onda, adicione fades e baixe em MP3, WAV, M4A ou mais. Crie um toque de celular ou um clipe. Sem marca d\'água, sem cadastro.',
      ogTitle: 'Cortar áudio online grátis',
      ogDescription: 'Escolha um início e um fim na forma de onda e baixe o clipe. Grátis, sem cadastro.',
      intro: 'O refrão para um toque de celular, o único minuto bom de uma gravação de duas horas, a frase de impacto sem a introdução: cortar é a edição de áudio de que todo mundo precisa. O Media Manipulator mostra uma forma de onda, deixa você arrastar os pontos de início e fim, corta nos nossos servidores com o FFmpeg e exporta em qualquer formato, com fades opcionais.',
      whatItDoes: [
        'Corta qualquer arquivo de áudio em um tempo de início e fim escolhidos em uma forma de onda.',
        'Fade in e fade out para que o corte não estale.',
        'O corte volta como MP3, WAV, FLAC, M4A, OGG ou Opus.',
        'Combine com volume, normalização e equalização na mesma passagem.',
      ],
      flowSteps: [
        {
          title: 'Envie o áudio',
          description: 'Qualquer formato comum.',
        },
        {
          title: 'Defina o trecho',
          description: 'Arraste os marcadores na forma de onda.',
        },
        {
          title: 'Converta',
          description: 'O FFmpeg corta e codifica.',
        },
        {
          title: 'Baixe',
          description: 'Salve o clipe.',
        },
      ],
      advancedDetails: [
        'O corte é preciso ao nível da amostra; a saída é recodificada no formato que você escolher.',
        'Um fade de 0,05 a 0,2 segundos remove os estalos nos pontos de corte.',
        'Para um vídeo, use o Cortar vídeo; para um vídeo com a forma de onda do resultado, o Gerador de forma de onda de áudio.',
      ],
      whyItMatters: [
        'Toques de celular e sons de notificação precisam de um corte de 20 a 30 segundos.',
        'Compartilhar uma frase de impacto é mais fácil do que compartilhar a gravação inteira.',
        'Remover silêncios e introduções antes da transcrição economiza tempo.',
      ],
      useCases: [
        {
          title: 'Toque de celular',
          description: 'Corte o refrão e adicione um fade.',
        },
        {
          title: 'Frase de impacto',
          description: 'Extraia uma frase de uma entrevista.',
        },
        {
          title: 'Remover um começo ruim',
          description: 'Descarte os primeiros 10 segundos de uma nota de voz.',
        },
        {
          title: 'Sample',
          description: 'Isole uma batida ou uma frase musical.',
        },
      ],
      whyMediaManipulator: [
        'Edição na forma de onda com marcadores arrastáveis, não com tempos digitados.',
        'Fades, normalização e qualquer formato de saída no mesmo envio.',
      ],
      privacyNote: 'Seu áudio é cortado no início e no fim que você definir pelo FFmpeg no nosso servidor. Nenhum serviço de áudio externo participa. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos. Você recebe um arquivo novo; o arquivo enviado em si não é alterado.',
      faq: [
        {
          question: 'Posso digitar os tempos exatos?',
          answer: 'Sim. A caixa de diálogo de corte tem campos de início e fim, além dos marcadores arrastáveis.',
        },
        {
          question: 'O corte vai estalar?',
          answer: 'Adicione um fade in e um fade out curtos em Processamento básico para evitar isso.',
        },
        {
          question: 'Posso manter a qualidade original?',
          answer: 'Escolha a saída em WAV ou FLAC para evitar uma recodificação com perdas.',
        },
        {
          question: 'Posso cortar o meio?',
          answer: 'Um trecho por passagem; execute a ferramenta duas vezes e junte as partes no Darkroom.',
        },
      ],
      related: [
        {
          label: 'Cortar vídeo',
          to: '/tools/video-trimmer',
          description: 'O mesmo para vídeo.',
        },
        {
          label: 'Extrair áudio de vídeo',
          to: '/tools/extract-audio-from-video',
          description: 'Obtenha o áudio primeiro.',
        },
        {
          label: 'Conversor de áudio',
          to: '/tools/audio-converter',
          description: 'Converta entre todos os formatos de áudio comuns.',
        },
        {
          label: 'Alterar a velocidade do áudio',
          to: '/tools/change-audio-speed',
          description: 'Acelere ou desacelere uma gravação.',
        },
        {
          label: 'Alterar o tom do áudio',
          to: '/tools/change-audio-pitch',
          description: 'Suba ou abaixe a tonalidade.',
        },
        {
          label: 'Normalizar áudio',
          to: '/tools/normalize-audio',
          description: 'Equilibre o loudness.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Remoção de ruído com IA.',
        },
        {
          label: 'Remover vocais de uma música',
          to: '/tools/remove-vocals-from-song',
          description: 'Crie um instrumental.',
        },
      ],
      embed: {
        title: 'Cortar um arquivo de áudio',
        description: 'Envie um arquivo de áudio, pressione Cortar áudio e arraste os marcadores de início e fim na forma de onda. Se quiser, adicione um fade in ou fade out em Processamento básico. Pressione Converter.',
      },
    },
    'transcribe-audio': {
      name: 'Transcrever áudio',
      h1: 'Transcrever áudio em texto online',
      tagline: 'Converta um MP3, WAV, M4A ou qualquer gravação em texto, legendas ou JSON com reconhecimento de fala por IA nos nossos próprios servidores GPU.',
      metaTitle: 'Transcrever áudio em texto online (IA grátis) | Media Manipulator',
      metaDescription: 'Transcrição de áudio online e gratuita. Converta gravações em MP3, WAV, M4A, OGG ou FLAC em texto simples, legendas VTT ou SRT, ou JSON com marcações de tempo. Roda na nossa própria GPU, sem IA de terceiros.',
      ogTitle: 'Transcrever áudio em texto online',
      ogDescription: 'Gravações, entrevistas e notas de voz em texto. Grátis, sem cadastro.',
      intro: 'Entrevistas, aulas, notas de voz e gravações de reuniões são muito mais úteis como texto: pesquisáveis, citáveis, traduzíveis. O Media Manipulator transcreve áudio com um modelo Whisper em um servidor GPU que nós operamos, então sua gravação nunca sai da nossa infraestrutura, e devolve texto simples, legendas VTT ou SRT, ou uma transcrição em JSON com marcações de tempo por palavra.',
      whatItDoes: [
        'Transcreve MP3, WAV, M4A, OGG, FLAC e outros áudios com o Whisper.',
        'Gera texto simples, VTT, SRT ou JSON com marcações de tempo.',
        'Detecta o idioma automaticamente entre dezenas de idiomas.',
        'Roda na nossa própria GPU; sem provedor de IA de terceiros.',
      ],
      flowSteps: [
        {
          title: 'Envie o áudio',
          description: 'Qualquer formato comum.',
        },
        {
          title: 'Escolha uma saída',
          description: 'Texto, VTT, SRT ou JSON.',
        },
        {
          title: 'Transcreva',
          description: 'O Whisper roda no nosso servidor GPU.',
        },
        {
          title: 'Baixe',
          description: 'Abra o visualizador de transcrição ou salve o arquivo.',
        },
      ],
      advancedDetails: [
        'Usa o whisper-ctranslate2 com um modelo multilíngue grande; a precisão é melhor em fala clara com pouco ruído de fundo.',
        'Execute primeiro a ferramenta Remover ruído de fundo em gravações ruidosas para obter uma transcrição melhor.',
        'A transcrição conta como uma tarefa de IA, da cota diária de IA e não da cota comum; uma tarefa com falha não é contabilizada.',
      ],
      whyItMatters: [
        'Texto dá para pesquisar e passar os olhos; áudio, não.',
        'Legendas tornam o conteúdo em áudio acessível e indexável.',
        'Uma transcrição é o ponto de partida para anotações, artigos e traduções.',
      ],
      useCases: [
        {
          title: 'Anotações de entrevista',
          description: 'Tenha um texto de onde você pode citar.',
        },
        {
          title: 'Transcrição de aula',
          description: 'Estude pelo texto, pesquise termos.',
        },
        {
          title: 'Legendas de podcast',
          description: 'SRT ou VTT para a versão em vídeo.',
        },
        {
          title: 'Nota de voz em texto',
          description: 'Transforme pensamentos em um documento.',
        },
      ],
      whyMediaManipulator: [
        'Whisper em hardware que nós operamos; seu áudio nunca é enviado a uma IA de terceiros.',
        'Quatro formatos de saída e um visualizador de transcrição integrado.',
      ],
      privacyNote: 'Sua gravação é transcrita pelo Whisper no nosso próprio servidor GPU, e o texto fica guardado com a tarefa. O trabalho de IA roda em hardware que nós operamos, nunca em um provedor de IA de terceiros, e nada que você envia é usado para treinar um modelo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'Quais idiomas são suportados?',
          answer: 'O Whisper lida com dezenas de idiomas e detecta o idioma automaticamente.',
        },
        {
          question: 'Qual é a precisão?',
          answer: 'Muito boa em fala clara. Ruído de fundo, falas sobrepostas e sotaques carregados reduzem a precisão; se puder, remova o ruído primeiro.',
        },
        {
          question: 'Minha gravação é enviada à OpenAI?',
          answer: 'Não. O modelo roda no nosso próprio servidor GPU.',
        },
        {
          question: 'Posso ter identificação de quem fala?',
          answer: 'Ainda não. A saída em JSON tem marcações de tempo por palavra, que você pode usar para segmentar.',
        },
        {
          question: 'Isso conta na minha cota?',
          answer: 'Sim, como uma tarefa de IA na cota de IA, que é separada da cota comum. Tarefas com falha não são contabilizadas.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Conta como uma tarefa de IA; tarefas com falha não são contabilizadas.',
        ],
      },
      related: [
        {
          label: 'Transcrever vídeo',
          to: '/tools/transcribe-video',
          description: 'O mesmo para arquivos de vídeo.',
        },
        {
          label: 'Gerador de SRT',
          to: '/tools/srt-generator',
          description: 'Direto para legendas.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Limpe o áudio primeiro.',
        },
        {
          label: 'Tradutor de legendas',
          to: '/tools/caption-translator',
          description: 'Traduza as legendas.',
        },
      ],
      embed: {
        title: 'Transcrever um arquivo de áudio',
        description: 'Envie um arquivo de áudio e escolha uma saída: texto simples para um documento, VTT ou SRT para legendas, JSON para marcações de tempo. O Whisper roda no nosso servidor GPU; nada vai para uma IA de terceiros.',
      },
    },
    'add-text-to-image': {
      name: 'Adicionar texto à imagem',
      h1: 'Adicionar texto a uma imagem online grátis',
      tagline: 'Coloque uma legenda, um título ou uma marca d\'água em uma foto: escolha a fonte, o tamanho, a cor, o contorno e a posição, e baixe.',
      metaTitle: 'Adicionar texto à imagem grátis: legenda, marca d\'água | Media Manipulator',
      metaDescription: 'Ferramenta online e gratuita para adicionar texto a uma foto. Escolha fonte, tamanho, cor, contorno e posição para uma legenda, meme ou marca d\'água em JPG, PNG, WebP e mais. Sem cadastro.',
      ogTitle: 'Adicionar texto a uma imagem online grátis',
      ogDescription: 'Legenda, título ou marca d\'água em qualquer foto. Grátis, sem cadastro.',
      intro: 'Uma legenda em uma captura de tela, um título em uma miniatura, uma linha de direitos autorais no canto de uma foto: adicionar texto é a edição de imagem mais comum depois do recorte. O Media Manipulator renderiza texto sobre uma imagem nos nossos servidores com o ImageMagick, com fonte, tamanho, cor de preenchimento e de contorno, e uma posição escolhida entre nove âncoras ou coordenadas exatas em pixels, e exporta no mesmo formato ou em outro.',
      whatItDoes: [
        'Renderiza um bloco de texto em qualquer tamanho, com cores de preenchimento e de contorno.',
        'Seis fontes incluídas (sem serifa, com serifa e monoespaçada, em duas famílias).',
        'Nove posições de âncora ou posicionamento exato por x/y.',
        'Combine com redimensionamento, recorte, filtros e opções de metadados na mesma passagem.',
      ],
      flowSteps: [
        {
          title: 'Envie uma imagem',
          description: 'JPG, PNG, WebP, HEIC e mais.',
        },
        {
          title: 'Digite e estilize o texto',
          description: 'Tamanho, cores, contorno, fonte, posição.',
        },
        {
          title: 'Converta',
          description: 'O ImageMagick desenha o texto.',
        },
        {
          title: 'Baixe',
          description: 'Salve a imagem com a legenda.',
        },
      ],
      advancedDetails: [
        'O texto é rasterizado no tamanho de saída; defina o tamanho em pixels em relação à largura da imagem.',
        'Um contorno de 2 a 4 px em uma cor contrastante mantém o texto legível em fotos cheias de detalhes.',
        'Escolha a saída em PNG para manter um fundo transparente em um modelo de marca d\'água.',
      ],
      whyItMatters: [
        'Legendas deixam as capturas de tela autoexplicativas.',
        'Uma linha visível de direitos autorais desencoraja a republicação sem crédito.',
        'Miniaturas com título recebem mais cliques.',
      ],
      useCases: [
        {
          title: 'Legendar uma captura de tela',
          description: 'Indique o que a pessoa está vendo.',
        },
        {
          title: 'Marca d\'água em uma foto',
          description: 'Seu nome no canto inferior.',
        },
        {
          title: 'Título de miniatura',
          description: 'Texto grande e em negrito para a miniatura de um vídeo.',
        },
        {
          title: 'Meme',
          description: 'Texto em cima, texto embaixo.',
        },
      ],
      whyMediaManipulator: [
        'Preenchimento, contorno, fonte e posicionamento em nove pontos, não só uma caixa de texto.',
        'Redimensione, recorte e converta no mesmo envio.',
      ],
      privacyNote: 'O texto que você digitou é desenhado sobre a sua imagem pelo ImageMagick no nosso servidor. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Posso adicionar mais de uma linha?',
          answer: 'Um bloco de texto por passagem; uma quebra de linha no texto é renderizada em uma nova linha. Execute a ferramenta de novo para um segundo bloco.',
        },
        {
          question: 'Posso usar minha própria fonte?',
          answer: 'Seis fontes incluídas estão disponíveis; o envio de fontes personalizadas não é suportado.',
        },
        {
          question: 'Como posiciono o texto com exatidão?',
          answer: 'Escolha uma âncora e adicione deslocamentos x/y em pixels.',
        },
        {
          question: 'Vai reduzir a qualidade?',
          answer: 'A imagem é recodificada; escolha PNG ou uma qualidade JPG alta para mantê-la nítida.',
        },
      ],
      related: [
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre formatos de imagem.',
        },
        {
          label: 'Recortar imagem',
          to: '/tools/crop-image',
          description: 'Corte uma região.',
        },
        {
          label: 'Redimensionar imagem',
          to: '/tools/image-resizer',
          description: 'Altere as dimensões.',
        },
        {
          label: 'Filtros de imagem',
          to: '/tools/image-filters',
          description: 'Sépia, esboço, relevo e mais.',
        },
        {
          label: 'Remover metadados EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Remova dados de localização e do dispositivo.',
        },
      ],
      embed: {
        title: 'Adicionar texto a uma imagem',
        description: 'Envie uma imagem. A seção Texto sobreposto fica em destaque: digite o texto, defina tamanho, cor, contorno, fonte e posição (nove pontos de âncora ou coordenadas exatas). Pressione Converter.',
      },
    },
    'crop-image': {
      name: 'Recortar imagem',
      h1: 'Recortar uma imagem online grátis',
      tagline: 'Arraste uma caixa sobre a parte da foto que você quer, endireite o enquadramento e baixe só essa região em qualquer formato.',
      metaTitle: 'Recortar imagem online grátis | Media Manipulator',
      metaDescription: 'Recortador de imagens online e gratuito. Arraste para selecionar uma região de uma foto JPG, PNG, WebP ou HEIC e baixe. Combine com redimensionamento, filtros e conversão de formato. Sem cadastro.',
      ogTitle: 'Recortar uma imagem online grátis',
      ogDescription: 'Arraste uma caixa e baixe a região. Grátis, sem cadastro.',
      intro: 'Recortar corrige o enquadramento, remove a bagunça das bordas e transforma uma foto em outra mais fechada. O Media Manipulator abre um recortador visual sobre a imagem enviada, aplica o recorte nos nossos servidores com o ImageMagick e deixa você redimensionar, filtrar e converter o resultado na mesma passagem.',
      whatItDoes: [
        'Caixa de recorte visual com alças de arrastar sobre a imagem real.',
        'Coordenadas exatas do recorte exibidas e editáveis.',
        'Combine com o redimensionamento para uma largura e altura de destino depois do recorte.',
        'Salve a área recortada como JPG, PNG, WebP, AVIF ou GIF.',
      ],
      flowSteps: [
        {
          title: 'Envie uma imagem',
          description: 'Qualquer formato comum.',
        },
        {
          title: 'Desenhe o recorte',
          description: 'Arraste a caixa e as alças.',
        },
        {
          title: 'Converta',
          description: 'O ImageMagick recorta e codifica.',
        },
        {
          title: 'Baixe',
          description: 'Salve a imagem recortada.',
        },
      ],
      advancedDetails: [
        'O recorte é aplicado antes do redimensionamento, então uma foto de 4000 px recortada para 1000 px e redimensionada para 500 px é reduzida uma única vez.',
        'Recortar remove pixels e não é reversível; guarde o original.',
        'A orientação EXIF é respeitada, então uma foto de celular girada é recortada do jeito que você a vê.',
      ],
      whyItMatters: [
        'Um enquadramento mais fechado é a melhoria mais rápida para a maioria das fotos.',
        'Fotos de perfil e miniaturas precisam de regiões e proporções específicas.',
        'Recortar para tirar um transeunte ou uma placa de carro é uma correção de privacidade.',
      ],
      useCases: [
        {
          title: 'Foto de perfil',
          description: 'Recorte no rosto.',
        },
        {
          title: 'Remover a bagunça',
          description: 'Elimine as bordas de uma foto.',
        },
        {
          title: 'Detalhe de captura de tela',
          description: 'Mantenha só a parte relevante.',
        },
        {
          title: 'Foto de produto',
          description: 'Recorte bem fechado e depois redimensione para um anúncio.',
        },
      ],
      whyMediaManipulator: [
        'Recortador visual com coordenadas exatas, mais redimensionamento e conversão na mesma passagem.',
        'Metadados mantidos ou removidos, como você preferir.',
      ],
      privacyNote: 'Sua imagem é cortada na área que você selecionou pelo ImageMagick no nosso servidor. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Posso recortar em uma proporção fixa?',
          answer: 'Arraste a caixa até a proporção de que você precisa; a largura e a altura são exibidas enquanto você ajusta.',
        },
        {
          question: 'Recortar perde qualidade?',
          answer: 'Os pixels que ficam não são tocados. Escolha PNG ou uma qualidade JPG alta para a recodificação.',
        },
        {
          question: 'Posso recortar um vídeo?',
          answer: 'Sim, com a ferramenta Recortar vídeo.',
        },
        {
          question: 'Posso girar antes?',
          answer: 'Use a ferramenta Girar imagem e depois recorte.',
        },
      ],
      related: [
        {
          label: 'Recortar vídeo',
          to: '/tools/crop-video',
          description: 'O mesmo para vídeo.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre formatos de imagem.',
        },
        {
          label: 'Redimensionar imagem',
          to: '/tools/image-resizer',
          description: 'Altere as dimensões.',
        },
        {
          label: 'Adicionar texto à imagem',
          to: '/tools/add-text-to-image',
          description: 'Legenda ou marca d\'água.',
        },
        {
          label: 'Filtros de imagem',
          to: '/tools/image-filters',
          description: 'Sépia, esboço, relevo e mais.',
        },
        {
          label: 'Remover metadados EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Remova dados de localização e do dispositivo.',
        },
      ],
      embed: {
        title: 'Recortar uma imagem',
        description: 'Envie uma imagem e pressione Recortar imagem para abrir o recortador visual. Arraste a caixa até a região que você quer e salve; o recorte é aplicado quando você pressiona Converter.',
      },
    },
    'grayscale-image': {
      name: 'Converter imagem para preto e branco',
      h1: 'Converter uma imagem para preto e branco online',
      tagline: 'Converta uma foto colorida em tons de cinza, ou em sépia para um tom vintage, e baixe em qualquer formato.',
      metaTitle: 'Converter imagem para preto e branco online grátis | Media Manipulator',
      metaDescription: 'Conversor online e gratuito de fotos para preto e branco. Transforme qualquer imagem JPG, PNG, WebP ou HEIC em escala de cinza ou sépia e baixe. Combine com recorte, redimensionamento e troca de formato. Sem cadastro.',
      ogTitle: 'Converter uma imagem para preto e branco online',
      ogDescription: 'Escala de cinza ou sépia em um clique. Grátis, sem cadastro.',
      intro: 'O preto e branco reduz uma foto a luz, forma e textura, esconde dominantes de cor e iluminação mista, e dá um visual consistente a um conjunto de fotos. O Media Manipulator converte para escala de cinza nos nossos servidores com o ImageMagick, usando uma conversão ponderada por luminância, oferece tons sépia e vintage e exporta em qualquer formato de imagem.',
      whatItDoes: [
        'Converte uma imagem colorida em escala de cinza com a ponderação de luminância correta.',
        'Alternativas sépia e vintage para um tom quente ou envelhecido.',
        'Combine com recorte, redimensionamento, texto e conversão de formato.',
        'A cópia monocromática pode ser JPG, PNG, WebP, AVIF ou GIF.',
      ],
      flowSteps: [
        {
          title: 'Envie uma imagem',
          description: 'Qualquer formato comum.',
        },
        {
          title: 'Mantenha a escala de cinza ou escolha sépia',
          description: 'O filtro vem pré-selecionado.',
        },
        {
          title: 'Converta',
          description: 'O ImageMagick aplica a conversão.',
        },
        {
          title: 'Baixe',
          description: 'Salve o resultado.',
        },
      ],
      advancedDetails: [
        'A escala de cinza usa os pesos de luminância da Rec. 709, então os verdes parecem mais claros que os azuis, como o olho espera.',
        'O sépia aplica um tom depois da escala de cinza; o vintage adiciona um leve desbotamento e uma vinheta.',
        'A saída mantém três canais, a menos que você escolha um formato que armazene escala de cinza nativamente.',
      ],
      whyItMatters: [
        'O monocromático esconde cores ruins e iluminação mista.',
        'Um conjunto consistente em preto e branco parece curado.',
        'Imagens em escala de cinza ficam menores quando comprimidas.',
      ],
      useCases: [
        {
          title: 'Retrato',
          description: 'Retrato clássico em preto e branco.',
        },
        {
          title: 'Digitalização de documento',
          description: 'Converta uma página fotografada para escala de cinza.',
        },
        {
          title: 'Visual vintage',
          description: 'Sépia em uma foto de família.',
        },
        {
          title: 'Impressão',
          description: 'Prepare para uma impressora em preto e branco.',
        },
      ],
      whyMediaManipulator: [
        'Escala de cinza com luminância correta, mais sépia e vintage.',
        'Recorte, redimensione e converta no mesmo envio.',
      ],
      privacyNote: 'A cor da sua imagem é removida pelo ImageMagick no nosso servidor. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Escala de cinza ou dessaturar?',
          answer: 'Esta é uma escala de cinza ponderada por luminância, que parece mais natural do que simplesmente remover a saturação.',
        },
        {
          question: 'Posso obter um tom sépia?',
          answer: 'Sim. Escolha sépia ou vintage no seletor de filtro.',
        },
        {
          question: 'Posso fazer isso em um vídeo?',
          answer: 'Sim. Use Ajustar brilho e cor do vídeo e defina a saturação em -100.',
        },
        {
          question: 'A cor original pode ser recuperada?',
          answer: 'Não. Guarde o arquivo original.',
        },
      ],
      related: [
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre formatos de imagem.',
        },
        {
          label: 'Recortar imagem',
          to: '/tools/crop-image',
          description: 'Corte uma região.',
        },
        {
          label: 'Redimensionar imagem',
          to: '/tools/image-resizer',
          description: 'Altere as dimensões.',
        },
        {
          label: 'Adicionar texto à imagem',
          to: '/tools/add-text-to-image',
          description: 'Legenda ou marca d\'água.',
        },
        {
          label: 'Filtros de imagem',
          to: '/tools/image-filters',
          description: 'Sépia, esboço, relevo e mais.',
        },
        {
          label: 'Remover metadados EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Remova dados de localização e do dispositivo.',
        },
      ],
      embed: {
        title: 'Converter uma imagem para preto e branco',
        description: 'Envie uma imagem. O filtro vem predefinido como escala de cinza; mude para sépia ou vintage para um tom mais quente. Pressione Converter.',
      },
    },
    'image-filters': {
      name: 'Filtros e efeitos de imagem',
      h1: 'Aplique filtros e efeitos a uma imagem online',
      tagline: 'Pintura a óleo, esboço, carvão, relevo, vintage, redemoinho, desfoque, nitidez e mais, aplicados a qualquer foto com um clique.',
      metaTitle: 'Filtros de imagem online grátis: esboço, pintura a óleo, relevo | Media Manipulator',
      metaDescription: 'Filtros de foto online gratuitos. Aplique pintura a óleo, esboço a lápis, carvão, relevo, vintage, sépia, redemoinho, desfoque ou nitidez a JPG, PNG, WebP e mais, e depois baixe. Sem cadastro.',
      ogTitle: 'Aplique filtros e efeitos a uma imagem online',
      ogDescription: 'Esboço, pintura a óleo, relevo, vintage e mais. Grátis, sem cadastro.',
      intro: 'Às vezes uma foto quer ser outra coisa: um esboço para um convite, uma pintura a óleo para uma impressão, um logo em relevo, um abstrato em redemoinho. O Media Manipulator aplica os filtros artísticos e corretivos do ImageMagick nos nossos servidores, do esboço a lápis à nitidez, e exporta em qualquer formato de imagem, opcionalmente recortada, redimensionada e legendada na mesma passagem.',
      whatItDoes: [
        'Artísticos: pintura a óleo, esboço, carvão, relevo, vintage, sépia, redemoinho, distorção de barril.',
        'Corretivos: desfoque, nitidez, escala de cinza.',
        'Rotações de 45, 90, 180 e 270 graus no mesmo seletor.',
        'Combine com recorte, redimensionamento, sobreposição de texto e conversão de formato.',
      ],
      flowSteps: [
        {
          title: 'Envie uma imagem',
          description: 'Qualquer formato comum.',
        },
        {
          title: 'Escolha um filtro',
          description: 'Pintura a óleo vem pré-selecionada.',
        },
        {
          title: 'Converta',
          description: 'O ImageMagick renderiza o efeito.',
        },
        {
          title: 'Baixe',
          description: 'Salve o resultado.',
        },
      ],
      advancedDetails: [
        'Pintura a óleo e carvão são baseados em raio e variam com o tamanho da imagem; redimensione para 1500 a 2500 px para o efeito mais forte.',
        'Esboço e relevo funcionam melhor em imagens com bordas definidas e bom contraste.',
        'Os efeitos são renderizados nos pixels; guarde o original.',
      ],
      whyItMatters: [
        'Uma imagem estilizada se destaca em um feed de fotos.',
        'Visuais de esboço e pintura são comuns em cartões, pôsteres e impressões.',
        'Nitidez e desfoque são correções do dia a dia.',
      ],
      useCases: [
        {
          title: 'Retrato a lápis',
          description: 'Filtro de esboço em uma foto para um cartão.',
        },
        {
          title: 'Impressão pintada',
          description: 'Pintura a óleo para uma impressão em tela.',
        },
        {
          title: 'Logo em relevo',
          description: 'Aplique relevo a um logo chapado.',
        },
        {
          title: 'Nitidez em um scan',
          description: 'Realce as bordas de um scan suave.',
        },
      ],
      whyMediaManipulator: [
        'Doze filtros artísticos e corretivos em um só seletor.',
        'Recorte, redimensione, legende e converta no mesmo envio.',
      ],
      privacyNote: 'O filtro que você escolhe é aplicado à sua imagem pelo ImageMagick no nosso servidor. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Posso ajustar a intensidade?',
          answer: 'Os filtros usam intensidades fixas e calibradas. Redimensione a imagem para maior ou menor para mudar a força aparente de um efeito baseado em raio.',
        },
        {
          question: 'Posso combinar filtros?',
          answer: 'Um filtro por passagem; passe o resultado pela ferramenta de novo para aplicar um segundo.',
        },
        {
          question: 'Existe transferência de estilo por IA?',
          answer: 'Não. Estes são efeitos clássicos do ImageMagick, que rodam instantaneamente.',
        },
        {
          question: 'Qual filtro funciona para um logo?',
          answer: 'Relevo ou carvão em um logo de alto contraste.',
        },
      ],
      related: [
        {
          label: 'Preto e branco',
          to: '/tools/grayscale-image',
          description: 'Escala de cinza e sépia.',
        },
        {
          label: 'Desfocar imagem',
          to: '/tools/blur-image',
          description: 'Suavize ou oculte.',
        },
        {
          label: 'Aumentar a nitidez da imagem',
          to: '/tools/sharpen-image',
          description: 'Realce os detalhes.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre formatos de imagem.',
        },
        {
          label: 'Recortar imagem',
          to: '/tools/crop-image',
          description: 'Corte uma região.',
        },
        {
          label: 'Redimensionar imagem',
          to: '/tools/image-resizer',
          description: 'Altere as dimensões.',
        },
        {
          label: 'Adicionar texto à imagem',
          to: '/tools/add-text-to-image',
          description: 'Legenda ou marca d\'água.',
        },
        {
          label: 'Remover metadados EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimine dados de localização e de dispositivo.',
        },
      ],
      embed: {
        title: 'Aplicar um filtro a uma imagem',
        description: 'Envie uma imagem e escolha um filtro; pintura a óleo vem pré-selecionada. Esboço, carvão, relevo, vintage, sépia, redemoinho, distorção de barril, desfoque e nitidez estão disponíveis. Clique em Converter.',
      },
    },
    'rotate-image': {
      name: 'Girar imagem',
      h1: 'Gire uma imagem online grátis',
      tagline: 'Gire uma foto 90°, 180° ou 270°, corrija um scan ou foto de celular deitada, e baixe em qualquer formato.',
      metaTitle: 'Girar imagem online grátis (90°, 180°, 270°) | Media Manipulator',
      metaDescription: 'Rotacionador de imagens online gratuito. Gire uma foto JPG, PNG, WebP ou HEIC em 90, 180 ou 270 graus, ou em 45 para inclinar, e baixe. A rotação é gravada nos pixels. Sem cadastro.',
      ogTitle: 'Gire uma imagem online grátis',
      ogDescription: 'Corrija uma foto deitada com um clique. Grátis, sem cadastro.',
      intro: 'Celulares registram a orientação como uma tag que alguns visualizadores ignoram, e scanners e câmeras antigas simplesmente erram. Girar os próprios pixels resolve de uma vez por todas. O Media Manipulator gira imagens nos nossos servidores com o ImageMagick em 90, 180, 270 ou 45 graus, respeita primeiro a tag de orientação existente e exporta em qualquer formato.',
      whatItDoes: [
        'Gira em 90° (sentido horário), 180°, 270° (sentido anti-horário) ou 45°.',
        'Grava a rotação nos pixels e limpa a tag de orientação EXIF.',
        'Combine com recorte, redimensionamento e conversão de formato.',
        'Salve a imagem girada como JPG, PNG, WebP, AVIF ou GIF.',
      ],
      flowSteps: [
        {
          title: 'Envie uma imagem',
          description: 'Qualquer formato comum.',
        },
        {
          title: 'Escolha o ângulo',
          description: '90° vem pré-selecionado.',
        },
        {
          title: 'Converta',
          description: 'O ImageMagick gira e codifica.',
        },
        {
          title: 'Baixe',
          description: 'Salve a imagem na posição certa.',
        },
      ],
      advancedDetails: [
        'A orientação EXIF existente é aplicada primeiro, então o que você vê é o que será girado.',
        'Uma rotação de 45° adiciona um preenchimento de fundo nos cantos; recorte depois, se necessário.',
        'Para espelhar na horizontal ou na vertical, use as ferramentas Virar e espelhar.',
      ],
      whyItMatters: [
        'Fotos deitadas são a reclamação mais comum sobre envios em fóruns e formulários.',
        'Alguns aplicativos ignoram a tag de orientação, então a rotação gravada nos pixels é a única correção confiável.',
        'Scans e arquivos de câmeras antigas muitas vezes não têm tag nenhuma.',
      ],
      useCases: [
        {
          title: 'Foto de celular deitada',
          description: 'Gire 90° para ficar em pé em qualquer lugar.',
        },
        {
          title: 'Scan de cabeça para baixo',
          description: 'Gire 180°.',
        },
        {
          title: 'Corrigir o envio em um formulário',
          description: 'Gire antes de enviar a foto de um documento.',
        },
        {
          title: 'Efeito inclinado',
          description: 'Gire 45° para um elemento de design.',
        },
      ],
      whyMediaManipulator: [
        'Rotação aplicada aos pixels, com a tag de orientação tratada corretamente.',
        'Recorte, redimensione e converta no mesmo envio.',
      ],
      privacyNote: 'Sua imagem é girada no ângulo que você escolher pelo ImageMagick no nosso servidor. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Por que minha foto aparece em pé no celular, mas deitada em outros lugares?',
          answer: 'Seu celular gravou uma tag de orientação que o outro aplicativo ignora. Girar aqui grava a orientação nos pixels.',
        },
        {
          question: 'Girar perde qualidade?',
          answer: 'A rotação em múltiplos de 90° é sem perdas na geometria; a recodificação é o único custo. Use PNG ou alta qualidade JPG.',
        },
        {
          question: 'Posso girar em um ângulo arbitrário?',
          answer: 'Só 45° e os múltiplos de 90° são oferecidos.',
        },
        {
          question: 'Posso espelhar em vez de girar?',
          answer: 'Aqui não; o espelhamento não é oferecido para imagens no momento.',
        },
      ],
      related: [
        {
          label: 'Girar vídeo',
          to: '/tools/rotate-video',
          description: 'O mesmo para vídeo.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre formatos de imagem.',
        },
        {
          label: 'Recortar imagem',
          to: '/tools/crop-image',
          description: 'Corte uma região.',
        },
        {
          label: 'Redimensionar imagem',
          to: '/tools/image-resizer',
          description: 'Altere as dimensões.',
        },
        {
          label: 'Adicionar texto à imagem',
          to: '/tools/add-text-to-image',
          description: 'Legenda ou marca d\'água.',
        },
        {
          label: 'Filtros de imagem',
          to: '/tools/image-filters',
          description: 'Sépia, esboço, relevo e mais.',
        },
        {
          label: 'Remover metadados EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimine dados de localização e de dispositivo.',
        },
      ],
      embed: {
        title: 'Girar uma imagem',
        description: 'Envie uma imagem. O seletor de filtro vem predefinido para girar 90°; escolha 180°, 270° ou 45° se preferir. A rotação é aplicada aos pixels, então todos os visualizadores concordam. Clique em Converter.',
      },
    },
    'sharpen-image': {
      name: 'Aumentar a nitidez da imagem',
      h1: 'Aumente a nitidez de uma imagem online grátis',
      tagline: 'Realce as bordas de uma foto ou scan levemente desfocado com um clique e baixe em qualquer formato.',
      metaTitle: 'Aumentar a nitidez da imagem online grátis | Media Manipulator',
      metaDescription: 'Ferramenta online gratuita de nitidez de imagem. Deixe mais nítida uma foto ou um scan JPG, PNG, WebP ou HEIC suave e baixe. Para recuperar detalhes de verdade, experimente a restauração de imagens com IA. Sem cadastro.',
      ogTitle: 'Aumente a nitidez de uma imagem online grátis',
      ogDescription: 'Deixe uma foto suave mais nítida com um clique. Grátis, sem cadastro.',
      intro: 'Uma foto um pouco suave por causa de uma lente lenta, de um redimensionamento ou de um scanner se beneficia de uma passagem de nitidez que aumenta o contraste ao longo das bordas. O Media Manipulator aplica uma máscara de nitidez (unsharp mask) nos nossos servidores com o ImageMagick e exporta em qualquer formato. Para um desfoque que vai além da suavidade, a ferramenta de restauração de imagens com IA recupera detalhes que a nitidez não consegue.',
      whatItDoes: [
        'Aplica uma máscara de nitidez calibrada a qualquer imagem.',
        'Combine com redimensionamento: aumente a nitidez depois de reduzir para miniaturas nítidas.',
        'Baixe o resultado nítido como JPG, PNG, WebP, AVIF ou GIF.',
        'Compare o original e o resultado lado a lado.',
      ],
      flowSteps: [
        {
          title: 'Envie uma imagem',
          description: 'Qualquer formato comum.',
        },
        {
          title: 'Mantenha nitidez selecionada',
          description: 'Adicione um redimensionamento, se quiser.',
        },
        {
          title: 'Converta',
          description: 'O ImageMagick aplica a máscara de nitidez.',
        },
        {
          title: 'Baixe',
          description: 'Salve a imagem mais nítida.',
        },
      ],
      advancedDetails: [
        'A nitidez aumenta o contraste local nas bordas; ela não adiciona detalhes. O excesso de nitidez aparece como halos.',
        'Reduzir o tamanho e depois aumentar a nitidez é a receita clássica para imagens nítidas na web.',
        'Para desfoque de movimento, falta de foco ou fontes de baixa resolução, use a restauração de imagens com IA.',
      ],
      whyItMatters: [
        'Imagens reduzidas perdem contraste nas bordas e ficam suaves sem nitidez.',
        'Scans de documentos e impressões costumam ficar um pouco suaves.',
        'Uma imagem nítida passa a impressão de mais qualidade.',
      ],
      useCases: [
        {
          title: 'Miniatura',
          description: 'Redimensione e aumente a nitidez para a web.',
        },
        {
          title: 'Scan suave',
          description: 'Deixe mais nítida uma impressão digitalizada.',
        },
        {
          title: 'Foto de produto',
          description: 'Adicione definição às bordas antes de anunciar.',
        },
        {
          title: 'Foco levemente perdido',
          description: 'Recupere um pouco de nitidez aparente.',
        },
      ],
      whyMediaManipulator: [
        'Máscara de nitidez calibrada com redimensionamento na mesma passagem.',
        'Restauração com IA disponível quando a nitidez não basta.',
      ],
      privacyNote: 'Sua imagem recebe nitidez do ImageMagick no nosso servidor, na intensidade que você define. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Vai corrigir uma foto desfocada?',
          answer: 'Ajuda com uma suavidade leve. Para desfoque de verdade, use a restauração de imagens com IA, que reconstrói os detalhes.',
        },
        {
          question: 'Posso controlar a intensidade?',
          answer: 'A intensidade é fixa e calibrada; rode duas vezes para mais, ou use um tamanho de saída menor para um efeito relativo mais forte.',
        },
        {
          question: 'Adiciona ruído?',
          answer: 'A nitidez pode realçar a granulação existente. Use alta qualidade JPG para não agravar o problema.',
        },
      ],
      related: [
        {
          label: 'Restauração de imagens com IA',
          to: '/tools/ai-image-restoration',
          description: 'Recupere detalhes reais com IA.',
        },
        {
          label: 'Upscaler de imagens com IA',
          to: '/tools/ai-image-upscaler',
          description: 'Amplie sem desfoque.',
        },
        {
          label: 'Desfocar imagem',
          to: '/tools/blur-image',
          description: 'O oposto.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre formatos de imagem.',
        },
        {
          label: 'Recortar imagem',
          to: '/tools/crop-image',
          description: 'Corte uma região.',
        },
        {
          label: 'Redimensionar imagem',
          to: '/tools/image-resizer',
          description: 'Altere as dimensões.',
        },
        {
          label: 'Adicionar texto à imagem',
          to: '/tools/add-text-to-image',
          description: 'Legenda ou marca d\'água.',
        },
        {
          label: 'Filtros de imagem',
          to: '/tools/image-filters',
          description: 'Sépia, esboço, relevo e mais.',
        },
        {
          label: 'Remover metadados EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimine dados de localização e de dispositivo.',
        },
      ],
      embed: {
        title: 'Aumentar a nitidez de uma imagem',
        description: 'Envie uma imagem. O filtro vem predefinido para nitidez. Clique em Converter e compare o resultado com o original no visualizador.',
      },
    },
    'blur-image': {
      name: 'Desfocar imagem',
      h1: 'Desfoque uma imagem online grátis',
      tagline: 'Suavize uma foto inteira para um fundo, um placeholder ou uma tela de privacidade, e baixe em qualquer formato.',
      metaTitle: 'Desfocar imagem online grátis | Media Manipulator',
      metaDescription: 'Desfoque de imagem online gratuito. Suavize uma foto JPG, PNG, WebP ou HEIC inteira para um fundo, um placeholder ou uma tela de privacidade. Para desfocar só os rostos, use a ferramenta de desfoque de rostos. Sem cadastro.',
      ogTitle: 'Desfoque uma imagem online grátis',
      ogDescription: 'Suavize uma foto com um clique. Grátis, sem cadastro.',
      intro: 'Uma foto desfocada cria um fundo tranquilo atrás de um texto, um placeholder de poucos detalhes enquanto a imagem real carrega ou uma tela de privacidade para uma captura de tela. O Media Manipulator aplica um desfoque gaussiano à imagem inteira nos nossos servidores com o ImageMagick e exporta em qualquer formato. Para desfocar só os rostos ou uma placa de carro, as ferramentas de desfoque de rostos com IA e de ocultação de texto atuam nessas regiões.',
      whatItDoes: [
        'Aplica um desfoque gaussiano à imagem inteira.',
        'Combine com redimensionamento para um placeholder desfocado minúsculo.',
        'A imagem suavizada volta como JPG, PNG, WebP, AVIF ou GIF.',
        'Ferramentas relacionadas desfocam rostos ou ocultam texto de forma seletiva.',
      ],
      flowSteps: [
        {
          title: 'Envie uma imagem',
          description: 'Qualquer formato comum.',
        },
        {
          title: 'Mantenha desfoque selecionado',
          description: 'Redimensione, se quiser.',
        },
        {
          title: 'Converta',
          description: 'O ImageMagick desfoca e codifica.',
        },
        {
          title: 'Baixe',
          description: 'Salve a imagem suavizada.',
        },
      ],
      advancedDetails: [
        'O raio do desfoque é fixo; para um efeito mais forte, reduza o tamanho primeiro, desfoque e depois amplie.',
        'Imagens desfocadas comprimem muito bem, e é por isso que servem tão bem como placeholders.',
        'Uma captura de tela desfocada não é uma ocultação: às vezes o texto pode ser recuperado. Use a ocultação de texto para conteúdo sensível.',
      ],
      whyItMatters: [
        'Fundos desfocados mantêm o texto sobreposto legível.',
        'Placeholders de imagem em baixa qualidade melhoram a velocidade percebida da página.',
        'Uma versão suave de uma foto é um elemento de design comum.',
      ],
      useCases: [
        {
          title: 'Fundo para texto',
          description: 'Desfoque uma foto para colocar um título em cima.',
        },
        {
          title: 'Placeholder',
          description: 'Prévia minúscula desfocada para lazy loading.',
        },
        {
          title: 'Tela de privacidade',
          description: 'Suavize uma captura de tela antes de compartilhar e depois oculte de verdade.',
        },
        {
          title: 'Efeito onírico',
          description: 'Sobreposição suave para um design.',
        },
      ],
      whyMediaManipulator: [
        'Desfoque da imagem inteira aqui; desfoque de rostos e ocultação de texto como ferramentas de IA dedicadas.',
        'Redimensione e converta no mesmo envio.',
      ],
      privacyNote: 'Sua imagem é desfocada pelo ImageMagick no nosso servidor, no raio que você define. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Posso desfocar só uma parte da imagem?',
          answer: 'Use Desfocar rostos em foto para rostos ou Ocultar texto em imagem para texto e placas de carro.',
        },
        {
          question: 'O desfoque basta para esconder texto?',
          answer: 'Não de forma confiável. Use a ferramenta de ocultação, que pinta por cima da região.',
        },
        {
          question: 'Posso controlar a quantidade de desfoque?',
          answer: 'O raio é fixo; reduza o tamanho antes de desfocar para um efeito mais forte.',
        },
      ],
      related: [
        {
          label: 'Desfocar rostos em foto',
          to: '/tools/blur-faces-in-photo',
          description: 'Desfoque de rostos com IA.',
        },
        {
          label: 'Ocultar texto em imagem',
          to: '/tools/redact-text-in-image',
          description: 'Esconda texto e placas.',
        },
        {
          label: 'Aumentar a nitidez da imagem',
          to: '/tools/sharpen-image',
          description: 'O oposto.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre formatos de imagem.',
        },
        {
          label: 'Recortar imagem',
          to: '/tools/crop-image',
          description: 'Corte uma região.',
        },
        {
          label: 'Redimensionar imagem',
          to: '/tools/image-resizer',
          description: 'Altere as dimensões.',
        },
        {
          label: 'Adicionar texto à imagem',
          to: '/tools/add-text-to-image',
          description: 'Legenda ou marca d\'água.',
        },
        {
          label: 'Filtros de imagem',
          to: '/tools/image-filters',
          description: 'Sépia, esboço, relevo e mais.',
        },
        {
          label: 'Remover metadados EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimine dados de localização e de dispositivo.',
        },
      ],
      embed: {
        title: 'Desfocar uma imagem',
        description: 'Envie uma imagem. O filtro vem predefinido para desfoque, que suaviza a imagem inteira. Para desfocar só os rostos, use a ferramenta Desfocar rostos em foto. Clique em Converter.',
      },
    },
    'generate-vtt-captions': {
      name: 'Gerador de legendas VTT',
      h1: 'Gere legendas WebVTT a partir de vídeo ou áudio',
      tagline: 'Crie um arquivo de legendas .vtt para vídeo HTML5, YouTube ou um player com transcrição por IA nos nossos próprios servidores GPU.',
      metaTitle: 'Gerador de legendas VTT online (IA grátis) | Media Manipulator',
      metaDescription: 'Gerador de legendas WebVTT online gratuito. Envie um arquivo de vídeo ou áudio e baixe um arquivo .vtt com legendas sincronizadas para vídeo HTML5, YouTube, Vimeo ou qualquer player. Roda na nossa própria GPU.',
      ogTitle: 'Gere legendas WebVTT online',
      ogDescription: 'Legendas .vtt sincronizadas por IA para qualquer vídeo. Grátis, sem cadastro.',
      intro: 'O WebVTT é o formato de legendas da web: o elemento track do HTML5, o YouTube, o Vimeo e os players HLS e DASH leem todos esse formato. O Media Manipulator gera legendas VTT sincronizadas a partir de qualquer vídeo ou áudio com um modelo Whisper em um servidor GPU que nós operamos, então sua mídia nunca vai para uma IA de terceiros, e abre o resultado em um visualizador de legendas onde você pode conferir a sincronia antes de baixar.',
      whatItDoes: [
        'Transcreve a fala e a divide em legendas com tempo marcado.',
        'Gera um arquivo .vtt em conformidade com o padrão.',
        'Detecta o idioma automaticamente.',
        'Roda na nossa própria GPU; sem provedor de IA terceirizado.',
      ],
      flowSteps: [
        {
          title: 'Envie vídeo ou áudio',
          description: 'Qualquer formato comum.',
        },
        {
          title: 'Mantenha VTT selecionado',
          description: 'Ou mude para SRT, texto ou JSON.',
        },
        {
          title: 'Transcreva',
          description: 'O Whisper marca o tempo de cada legenda.',
        },
        {
          title: 'Baixe',
          description: 'Anexe o .vtt ao seu player.',
        },
      ],
      advancedDetails: [
        'As legendas seguem a segmentação do Whisper, normalmente uma frase ou oração por legenda, de 2 a 7 segundos.',
        'Traduza o resultado para outros idiomas com o Tradutor de legendas.',
        'Para uma faixa de legendas gravada no vídeo, use a faixa de legendas do Darkroom.',
      ],
      whyItMatters: [
        'Legendas são obrigatórias para acessibilidade, e a maioria dos espectadores assiste no mudo.',
        'VTT é o único formato que o vídeo HTML5 lê nativamente.',
        'Legendas sincronizadas podem ser indexadas pelos mecanismos de busca.',
      ],
      useCases: [
        {
          title: 'Vídeo HTML5',
          description: 'Anexe o arquivo com um elemento track.',
        },
        {
          title: 'Envio para o YouTube',
          description: 'Envie o .vtt como faixa de legendas.',
        },
        {
          title: 'Vídeo de curso',
          description: 'Legendas para um player de LMS.',
        },
        {
          title: 'Traduzir depois',
          description: 'Entra VTT, sai VTT traduzido.',
        },
      ],
      whyMediaManipulator: [
        'Whisper no nosso próprio hardware; nada é enviado a uma IA de terceiros.',
        'Visualizador de legendas para conferir a sincronia antes de baixar.',
      ],
      privacyNote: 'A fala do seu arquivo é transcrita pelo Whisper no nosso próprio servidor GPU e sincronizada em legendas WebVTT. O trabalho de IA roda em hardware que nós operamos, nunca em um provedor de IA de terceiros, e nada que você envia é usado para treinar um modelo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'VTT ou SRT?',
          answer: 'VTT para players web e YouTube; SRT para editores de vídeo e algumas plataformas mais antigas. Os dois são oferecidos.',
        },
        {
          question: 'Posso editar as legendas?',
          answer: 'Baixe o .vtt e edite em qualquer editor de texto; o formato é texto simples.',
        },
        {
          question: 'Posso traduzi-las?',
          answer: 'Sim, com a ferramenta Tradutor de legendas.',
        },
        {
          question: 'Meu vídeo é enviado a terceiros?',
          answer: 'Não. A transcrição roda no nosso próprio servidor GPU.',
        },
        {
          question: 'Isso conta na minha cota?',
          answer: 'Cada arquivo VTT é uma tarefa de IA, descontada da cota de IA e nunca da cota comum. Tarefas com falha não são contabilizadas.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Cada arquivo de legendas conta como uma tarefa de IA; tarefas com falha não são contabilizadas.',
        ],
      },
      related: [
        {
          label: 'Gerador de SRT',
          to: '/tools/srt-generator',
          description: 'Formato SubRip.',
        },
        {
          label: 'Transcrever vídeo',
          to: '/tools/transcribe-video',
          description: 'Texto simples ou JSON.',
        },
        {
          label: 'Tradutor de legendas',
          to: '/tools/caption-translator',
          description: 'Traduza as legendas.',
        },
        {
          label: 'Editor de vídeo Darkroom',
          to: '/tools/content-studio',
          description: 'Grave as legendas no vídeo.',
        },
      ],
      embed: {
        title: 'Gerar legendas VTT',
        description: 'Envie um arquivo de vídeo ou áudio. A saída vem predefinida como WebVTT; a transcrição é sincronizada pelo Whisper no nosso servidor GPU e devolvida como um arquivo .vtt que você pode anexar com um elemento track ou enviar a uma plataforma.',
      },
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
      h1: 'Clone sua voz a partir de uma gravação curta',
      tagline: 'Grave ou envie de 5 a 60 segundos da sua própria fala, crie uma voz e faça-a ler qualquer texto em mais de vinte idiomas.',
      metaTitle: 'Clone sua própria voz a partir de uma gravação | Media Manipulator',
      metaDescription: 'Crie uma voz a partir de 5 a 60 segundos da sua própria fala e transforme texto em fala com ela em mais de 20 idiomas. Roda nos nossos próprios servidores; as saídas têm marca d\'água.',
      ogTitle: 'Clone sua própria voz a partir de uma gravação curta',
      ogDescription: 'Grave algumas frases, confirme que a voz é sua e gere fala com ela em mais de 20 idiomas. Modelos hospedados por nós, saída com marca d\'água.',
      intro: 'A clonagem de voz cria uma voz reutilizável a partir de uma gravação curta da sua própria fala. Leia algumas frases naturais no seu microfone, ou envie um clipe de 5 a 60 segundos, confirme que a voz é sua (ou que você tem a permissão explícita da pessoa que fala) e crie a voz. Ela aparece em Minhas vozes com uma prévia curta. A partir daí você pode digitar qualquer texto, escolher um de mais de vinte idiomas e um nível de emoção, e receber um MP3 e um WAV dessa voz lendo o texto. O modelo roda em um servidor GPU que nós operamos, todo arquivo gerado carrega uma marca d\'água inaudível, e nada que você grava é usado para treinar coisa alguma.',
      whatItDoes: [
        'Cria uma voz salva a partir de 5 a 60 segundos de fala gravada no navegador ou enviada como arquivo de áudio.',
        'Verifica se a gravação é longa o suficiente e realmente contém fala antes de contabilizar qualquer coisa.',
        'Fala qualquer texto com a voz salva em mais de 20 idiomas, com um controle de emoção que vai de calmo a expressivo.',
        'Devolve a fala como MP3, com um download em WAV gerado no seu navegador.',
        'Marca todo arquivo gerado com uma marca d\'água inaudível para que a fala sintética possa ser identificada.',
      ],
      flowSteps: [
        {
          title: 'Grave ou envie',
          description: 'De 5 a 60 segundos de fala clara em um ambiente silencioso.',
        },
        {
          title: 'Confirme o consentimento',
          description: 'Marque que a voz é sua, ou que você tem a permissão de quem fala.',
        },
        {
          title: 'Crie a voz',
          description: 'Uma prévia curta é renderizada e a voz é salva na sua conta.',
        },
        {
          title: 'Gere a fala',
          description: 'Digite o texto, escolha um idioma e uma emoção, e baixe o áudio.',
        },
      ],
      advancedDetails: [
        'O motor de voz é o Chatterbox Multilingual (licença MIT), rodando no nosso próprio servidor GPU. Ele clona a partir do clipe de referência no momento em que você gera; nenhum modelo é treinado com a sua voz.',
        'Criar uma voz conta como uma tarefa de IA (a prévia). Cada geração conta como uma tarefa de IA. Uma solicitação que falha ou é recusada não é contabilizada.',
        'O tamanho do texto por solicitação depende do seu plano, a cerca de 18 caracteres por segundo de fala; o contador abaixo da caixa de texto mostra o seu limite.',
        'Todo arquivo gerado carrega a marca d\'água PerTh da Resemble AI, que é inaudível e resiste à edição e à compressão comuns.',
        'A primeira solicitação depois de um período de inatividade pode levar até 20 segundos enquanto o motor carrega.',
      ],
      whyItMatters: [
        'Narração na sua própria voz, sem reservar uma sessão de estúdio a cada mudança no roteiro.',
        'A mesma voz em outro idioma, para um vídeo ou um curso que alcança mais pessoas.',
        'Um motor hospedado por nós significa que suas gravações ficam conosco, não com um provedor de IA de terceiros.',
      ],
      useCases: [
        {
          title: 'Narração de vídeo',
          description: 'Releia uma frase alterada do roteiro sem gravar de novo.',
        },
        {
          title: 'Cursos e tutoriais',
          description: 'Dê voz à mesma aula em vários idiomas.',
        },
        {
          title: 'Acessibilidade',
          description: 'Faça um texto longo ser lido em voz alta por uma voz familiar.',
        },
        {
          title: 'Protótipos',
          description: 'Ouça um roteiro lido antes de gravar a versão final.',
        },
      ],
      whyMediaManipulator: [
        'Modelos abertos em hardware que nós operamos; as gravações nunca vão para um serviço de IA externo.',
        'Consentimento explícito antes de qualquer voz ser criada, registrado junto com a voz.',
        'Saída com marca d\'água e seu próprio botão de excluir para cada voz salva.',
      ],
      privacyNote: 'Os 5 a 60 segundos de fala que você grava ou envia se tornam uma voz salva na sua conta; essa gravação de referência é o que o modelo lê toda vez que a voz fala. Gravações de voz e vozes salvas são processadas nos nossos próprios servidores; nada é enviado a um provedor de IA de terceiros e nada é usado para treinar modelo algum. Uma voz salva (sua gravação de referência e prévia) fica armazenada na sua conta, segue o período de retenção que você escolher e pode ser excluída em Conta, Vozes a qualquer momento; ela é excluída junto com a sua conta. O áudio gerado é guardado como qualquer outro resultado: os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'Posso clonar a voz de outra pessoa?',
          answer: 'Só com a permissão explícita dessa pessoa. Você precisa confirmar que a voz é sua ou que tem permissão antes de uma voz ser criada, e nós guardamos essa confirmação junto com a voz. Fazer-se passar por alguém sem permissão, fraude e deepfakes políticos são proibidos pelos nossos Termos.',
        },
        {
          question: 'Vai soar exatamente como eu?',
          answer: 'Normalmente soa reconhecivelmente como quem fala, mas não é uma cópia perfeita: sotaques, vozes incomuns e gravações com ruído são mais difíceis. Grave algumas frases naturais em um ambiente silencioso para o melhor resultado.',
        },
        {
          question: 'Minha gravação é usada para treinar um modelo de IA?',
          answer: 'Não. Nada que você envia ou gera é usado para treinar modelo algum. A voz é clonada a partir do seu clipe de referência cada vez que você gera fala.',
        },
        {
          question: 'As pessoas conseguem perceber que o áudio é gerado?',
          answer: 'Todo arquivo gerado com uma voz salva carrega uma marca d\'água inaudível que ferramentas de detecção conseguem ler. Ela não altera o som do áudio.',
        },
        {
          question: 'Como excluo uma voz?',
          answer: 'Abra Conta, Vozes e exclua a voz. A gravação de referência e a prévia são removidas; o áudio que você já gerou continua no seu histórico até o fim do próprio período de retenção.',
        },
        {
          question: 'Quantas vozes posso guardar?',
          answer: 'Depende do seu plano; a página mostra quantas você salvou e o seu limite.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A referência precisa ter de 5 a 60 segundos e conter fala.',
          'Salvar uma voz exige uma conta; as vozes predefinidas funcionam sem conta.',
        ],
      },
      related: [
        {
          label: 'Criador de vozes',
          to: '/tools/voice-designer',
          description: 'Descreva uma voz nova e guarde-a.',
        },
        {
          label: 'Alterador de voz',
          to: '/tools/voice-changer',
          description: 'Altere uma gravação ou converta-a para uma voz.',
        },
        {
          label: 'Limpar áudio de voz',
          to: '/tools/clean-voice-audio',
          description: 'Limpe uma gravação antes de usá-la.',
        },
        {
          label: 'Alterar o tom do áudio',
          to: '/tools/change-audio-pitch',
          description: 'Mude a tonalidade de uma música ou fala.',
        },
      ],
      embed: {
        title: 'Criar uma voz',
        description: 'Grave ou envie uma gravação limpa de 5 a 60 segundos, confirme que a voz é sua ou que você tem a permissão de quem fala, e crie a voz. Depois digite um texto e gere a fala. As vozes predefinidas funcionam sem conta.',
      },
    },
    'voice-designer': {
      name: 'Criador de vozes',
      h1: 'Crie uma nova voz a partir de uma descrição',
      tagline: 'Descreva uma voz em palavras, ouça uma prévia e guarde a que você gostar para ler qualquer texto em mais de vinte idiomas.',
      metaTitle: 'Crie uma nova voz a partir de uma descrição | Media Manipulator',
      metaDescription: 'Descreva a voz que você quer, como calorosa, grave e calma, ouça uma prévia grátis, guarde a voz e gere fala com ela. Modelos nos nossos próprios servidores; saída com marca d\'água.',
      ogTitle: 'Crie uma nova voz a partir de uma descrição',
      ogDescription: 'Descreva uma voz, ouça prévias grátis, guarde a que você gostar e gere fala com ela. Nos nossos próprios servidores, com marca d\'água.',
      intro: 'O criador de vozes cria uma voz que não pertence a ninguém. Descreva-a em poucas palavras, como gênero, idade, sotaque, tom e ritmo, ou monte a descrição com os chips, e ouça a prévia de uma frase de exemplo. As prévias são gratuitas, três por descrição a cada hora. Quando ouvir a voz que você quer, dê um nome a ela e guarde-a: exatamente a voz que você ouviu na prévia é salva na sua conta e, a partir daí, pode ler qualquer texto, em qualquer idioma da ferramenta de fala. A criação roda no Qwen3-TTS e a fala no Chatterbox, ambos no nosso próprio servidor GPU, e todo arquivo gerado leva uma marca d\'água inaudível.',
      whatItDoes: [
        'Transforma a descrição em texto de uma voz em uma prévia falada.',
        'Guarda exatamente a voz da prévia (a mesma seed) quando você a salva.',
        'Fala qualquer texto com a voz guardada em mais de 20 idiomas.',
        'Entrega um MP3 da fala, com um download em WAV gerado no seu navegador.',
      ],
      flowSteps: [
        {
          title: 'Descreva',
          description: 'Escreva ou clique nos traços que você quer.',
        },
        {
          title: 'Ouça a prévia',
          description: 'Três prévias grátis por descrição a cada hora.',
        },
        {
          title: 'Guarde',
          description: 'Dê um nome à voz e salve-a na sua conta.',
        },
        {
          title: 'Gere a fala',
          description: 'Digite qualquer texto e baixe o áudio.',
        },
      ],
      advancedDetails: [
        'A criação usa o Qwen3-TTS VoiceDesign (Apache 2.0). A frase da prévia pode ser gerada em dez idiomas: chinês, inglês, japonês, coreano, alemão, francês, russo, português, espanhol e italiano.',
        'Uma voz guardada é armazenada como sua descrição, a seed e um clipe de referência de 10 segundos; a partir daí o Chatterbox fala com ela, então ela soa igual em todo lugar e em todos os idiomas suportados.',
        'As prévias não são contabilizadas. Guardar uma voz conta como uma tarefa de IA, e cada geração conta como uma tarefa de IA.',
        'As descrições funcionam melhor em inglês; os chips acrescentam traços em inglês.',
      ],
      whyItMatters: [
        'Uma voz de narrador ou de personagem distinta sem contratar um dublador para um rascunho.',
        'Nenhuma voz de pessoa real está envolvida, então a imagem de ninguém é emprestada.',
        'A voz guardada se mantém consistente em todo roteiro e idioma.',
      ],
      useCases: [
        {
          title: 'Personagens',
          description: 'Dê a cada personagem de uma história ou de um protótipo de jogo a própria voz.',
        },
        {
          title: 'Vídeos explicativos',
          description: 'Um narrador calmo e claro para vídeos de produto e de treinamento.',
        },
        {
          title: 'Áudio provisório',
          description: 'Narração temporária enquanto o roteiro ainda está mudando.',
        },
        {
          title: 'Acessibilidade',
          description: 'Uma voz de leitura agradável para documentos longos.',
        },
      ],
      whyMediaManipulator: [
        'Modelos abertos no nosso próprio servidor GPU; sem provedor de IA de terceiros.',
        'Prévias grátis antes de qualquer coisa ser contabilizada.',
        'Saída com marca d\'água e um botão de excluir para cada voz guardada.',
      ],
      privacyNote: 'Só a descrição em texto que você escreve é enviada ao modelo de voz; as prévias que ele produz são áudio gerado por nós, e a que você guarda é armazenada pela sua seed. Gravações de voz e vozes salvas são processadas nos nossos próprios servidores; nada é enviado a um provedor de IA de terceiros e nada é usado para treinar qualquer modelo. Uma voz salva (sua gravação de referência e prévia) fica armazenada na sua conta, segue o período de retenção que você escolher e pode ser excluída em Conta, Vozes a qualquer momento; ela é excluída junto com a sua conta. O áudio gerado é guardado como qualquer outro resultado: os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'Uma voz criada é a voz real de alguém?',
          answer: 'Não. Ela é gerada a partir da sua descrição e de uma seed aleatória; não é modelada em nenhuma pessoa específica.',
        },
        {
          question: 'Por que as prévias acabam?',
          answer: 'Cada descrição pode ter três prévias por hora, para que as prévias gratuitas continuem disponíveis para todo mundo. Mude a descrição para ouvir outra prévia, ou guarde a voz de que você gostou.',
        },
        {
          question: 'A voz guardada vai soar como a prévia?',
          answer: 'Sim. Guardar envia a mesma descrição e a mesma seed da prévia que você ouviu, e a voz é salva a partir dessa geração.',
        },
        {
          question: 'Quais idiomas ela pode falar?',
          answer: 'Uma voz é criada em um de dez idiomas e, depois de guardada, pode falar todos os idiomas da ferramenta de fala, mais de vinte no total.',
        },
        {
          question: 'A saída é marcada como gerada?',
          answer: 'Sim. Todo arquivo gerado leva uma marca d\'água inaudível que ferramentas de detecção conseguem ler.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Prévias: 3 por descrição por hora, não contabilizadas.',
          'Guardar uma voz exige uma conta.',
        ],
      },
      related: [
        {
          label: 'Clonagem de voz',
          to: '/tools/voice-cloning',
          description: 'Crie uma voz a partir da sua própria gravação.',
        },
        {
          label: 'Alterador de voz',
          to: '/tools/voice-changer',
          description: 'Desloque uma gravação ou converta-a para uma voz.',
        },
        {
          label: 'Limpar áudio de voz',
          to: '/tools/clean-voice-audio',
          description: 'Limpe uma gravação antes de usá-la.',
        },
        {
          label: 'Alterar o tom do áudio',
          to: '/tools/change-audio-pitch',
          description: 'Mude a tonalidade de uma música ou fala.',
        },
      ],
      embed: {
        title: 'Descreva uma voz',
        description: 'Escreva uma descrição curta ou clique nos chips de traços, ouça a prévia da voz (três prévias grátis por descrição a cada hora) e depois guarde-a para gerar fala. Guardar uma voz exige uma conta.',
      },
    },
    'voice-changer': {
      name: 'Alterador de voz',
      h1: 'Altere a voz de uma gravação',
      tagline: 'Altere instantaneamente o tom e o caráter de uma gravação ou converta a fala com IA para uma voz salva ou predefinida.',
      metaTitle: 'Alterador de voz: desloque ou converta uma gravação | Media Manipulator',
      metaDescription: 'Altere a voz de uma gravação: desloque tom e formante instantaneamente, ou converta a fala para uma voz salva ou predefinida com IA. Compare o antes e o depois.',
      ogTitle: 'Altere a voz de uma gravação',
      ogDescription: 'Desloque tom e formante instantaneamente, ou converta a fala para outra voz com IA, e depois compare o antes e o depois.',
      intro: 'O alterador de voz tem duas formas de alterar uma gravação. Deslocar é uma mudança clássica de tom e formante: mova o tom em até doze semitons para cima ou para baixo, mantenha o caráter de quem fala ou desloque-o junto com o tom, ou comece por uma predefinição como Mais grave, Mais aguda, Infantil, Mais velha ou Telefone. É instantâneo, não exige conta e não usa IA. Converter usa conversão de voz por IA para fazer a fala soar como uma das suas vozes salvas ou uma voz predefinida, mantendo as palavras, o tempo e a entonação. Nos dois casos, você pode comparar o original e o resultado com um player A/B sem interrupções antes de baixar.',
      whatItDoes: [
        'Desloca o tom em até 12 semitons para cima ou para baixo, com o formante preservado ou deslocado.',
        'Oferece predefinições de deslocamento: mais grave, mais aguda, infantil, mais velha e telefone.',
        'Converte a fala para uma voz salva ou uma voz predefinida com conversão de voz por IA.',
        'Reproduz o original e o resultado em uma comparação A/B sincronizada.',
        'Entrega um MP3, com um download em WAV gerado no seu navegador.',
      ],
      flowSteps: [
        {
          title: 'Grave ou envie',
          description: 'Fala do seu microfone ou de um arquivo de áudio ou vídeo.',
        },
        {
          title: 'Escolha Deslocar ou Converter',
          description: 'Mudança de tom instantânea, ou conversão por IA para outra voz.',
        },
        {
          title: 'Compare',
          description: 'Alterne entre o original e o resultado sem interrupção.',
        },
        {
          title: 'Baixe',
          description: 'MP3, ou um WAV gerado no seu navegador.',
        },
      ],
      advancedDetails: [
        'Deslocar usa o deslocador de tom rubberband por meio do ffmpeg no nosso servidor. "Manter o caráter da voz" preserva o formante; "Deslocar junto com o tom" o move, o que soa como uma pessoa menor ou maior falando. Telefone também aplica um filtro passa-faixa de 300 a 3400 Hz.',
        'Deslocar conta como uma operação e a saída não leva marca d\'água. Converter conta como uma tarefa de IA e a saída leva uma marca d\'água inaudível.',
        'Converter usa a conversão de voz do Chatterbox no nosso próprio servidor GPU. A duração da gravação que você pode converter depende do seu plano.',
        'Converter exige uma conta. Converter para a voz de outra pessoa exige a permissão dessa pessoa, assim como na clonagem.',
      ],
      whyItMatters: [
        'Disfarce uma voz para uma entrevista anônima ou um clipe que respeita a privacidade com um simples deslocamento.',
        'Corrija um take gravado com a voz errada sem regravá-lo.',
        'Ouça a diferença na hora com o player A/B, em vez de adivinhar.',
      ],
      useCases: [
        {
          title: 'Áudio anônimo',
          description: 'Desloque uma voz para que quem fala seja mais difícil de reconhecer.',
        },
        {
          title: 'Vozes de personagens',
          description: 'Transforme a sua própria leitura em outra voz para uma história.',
        },
        {
          title: 'Narração consistente',
          description: 'Converta a fala de um convidado para a voz salva do narrador.',
        },
        {
          title: 'Efeitos',
          description: 'Um efeito de telefone ou de voz infantil para uma cena de vídeo.',
        },
      ],
      whyMediaManipulator: [
        'O deslocador é gratuito e não exige conta.',
        'A conversão por IA roda no nosso próprio servidor GPU, não em um serviço de terceiros.',
        'Comparação A/B integrada entre o original e o resultado.',
      ],
      privacyNote: 'A gravação que você envia é deslocada com o rubberband ou convertida para outra voz por um modelo de IA, dependendo do modo que você escolher. Gravações de voz e vozes salvas são processadas nos nossos próprios servidores; nada é enviado a um provedor de IA de terceiros e nada é usado para treinar qualquer modelo. Uma voz salva (sua gravação de referência e prévia) fica armazenada na sua conta, segue o período de retenção que você escolher e pode ser excluída em Conta, Vozes a qualquer momento; ela é excluída junto com a sua conta. O áudio gerado é guardado como qualquer outro resultado: os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'Qual é a diferença entre Deslocar e Converter?',
          answer: 'Deslocar muda o tom e o caráter da mesma voz com processamento de sinal; é instantâneo e gratuito. Converter usa IA para fazer a fala soar como uma voz diferente, uma das suas vozes salvas ou uma predefinida.',
        },
        {
          question: 'Deslocar adiciona uma marca d\'água?',
          answer: 'Não. O áudio deslocado é processamento de sinal comum e não leva marca d\'água. O áudio convertido leva uma marca d\'água inaudível.',
        },
        {
          question: 'Posso converter minha voz para a de uma celebridade?',
          answer: 'Não. Você só pode converter para as suas próprias vozes salvas ou para as nossas vozes predefinidas, e usar a voz de uma pessoa real exige a permissão explícita dela. Imitar alguém sem permissão é proibido pelos nossos Termos.',
        },
        {
          question: 'Qual pode ser a duração da gravação?',
          answer: 'Deslocar aceita gravações até o limite de duração do seu plano. A conversão tem o próprio limite por plano, mostrado quando você envia.',
        },
        {
          question: 'Posso usar um arquivo de vídeo?',
          answer: 'Sim. A faixa de áudio é usada e a imagem é descartada.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Deslocar: uma operação, sem precisar de conta.',
          'Converter: uma tarefa de IA, conta e plano necessários.',
        ],
      },
      related: [
        {
          label: 'Clonagem de voz',
          to: '/tools/voice-cloning',
          description: 'Crie uma voz a partir da sua própria gravação.',
        },
        {
          label: 'Criador de vozes',
          to: '/tools/voice-designer',
          description: 'Descreva uma nova voz e guarde-a.',
        },
        {
          label: 'Limpar áudio de voz',
          to: '/tools/clean-voice-audio',
          description: 'Limpe uma gravação antes de usá-la.',
        },
        {
          label: 'Alterar o tom do áudio',
          to: '/tools/change-audio-pitch',
          description: 'Mude a tonalidade de uma música ou fala.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Limpe a gravação primeiro.',
        },
      ],
      embed: {
        title: 'Altere uma voz',
        description: 'Grave ou envie uma fala. Deslocar muda o tom e o formante instantaneamente, para todo mundo. Converter faz a gravação soar como uma das suas vozes salvas ou uma voz predefinida, e exige uma conta em um plano que inclua esse recurso.',
      },
    },
    // MM84: name / tagline / metaTitle / metaDescription for the copy-bar tool pages (model-written, needs native review).
    'content-studio': {
      name: 'Darkroom',
      h1: 'Darkroom',
      tagline: 'Edite, sobreponha e mixe vídeo e áudio em uma linha do tempo multipista e depois exporte em MP4. Um editor no estilo Premiere Pro, direto no navegador.',
      metaTitle: 'Darkroom: editor de vídeo multipista online e grátis | Media Manipulator',
      metaDescription: 'Edite, sobreponha e mixe vídeo e áudio em uma linha do tempo multipista e depois exporte em MP4: um editor de vídeo gratuito no estilo Premiere Pro que roda direto no navegador. Sem cadastro e sem instalação.',
      ogTitle: '🎬 Darkroom: editor de vídeo multipista gratuito no seu navegador',
      ogDescription: 'Edite, sobreponha e mixe vídeo e áudio em uma linha do tempo multipista, adicione títulos, transições e cor e depois exporte em MP4. Um editor no estilo Premiere Pro, direto no seu navegador, sem cadastro e totalmente gratuito. Venha experimentar! 🎬',
      intro: 'O Darkroom é um editor de vídeo multipista que roda em uma aba do navegador. Você cria um projeto com uma tela e uma taxa de quadros, solta arquivos de vídeo, imagem e áudio em uma bandeja de mídia, distribui tudo em pistas empilhadas, corta e divide nos limites dos quadros, faz a correção de cor e o chroma key, adiciona títulos, transições e legendas, mixa o áudio com um mixer por pista e depois entrega a linha do tempo pronta ao nosso servidor de renderização, onde o ffmpeg monta toda a edição como um único grafo de filtros e a codifica em H.264 ou HEVC dentro de MP4, ou em MP3 ou WAV quando o projeto é só de áudio. A pré-visualização sobre a qual você edita é composta ao vivo na sua GPU em WebGL2; a exportação é conferida contra essa pré-visualização, então o que você viu é o que você recebe.',
      whatItDoes: [
        'Roda uma linha do tempo multipista com precisão de quadro: cortar, dividir, excluir com ripple, navalha, edições slip, slide, roll e ripple, marcadores, grupos, bloqueio de pista, solo e ocultar, e separação do áudio do vídeo.',
        'Compõe as pistas em ordem de empilhamento com recorte, ajuste, transformação, correção de cor no estilo Lumetri (exposição, contraste, saturação, temperatura, tonalidade, vibração), LUTs 3D, chroma key com conta-gotas, opacidade e oito modos de mesclagem.',
        'Anima posição, escala, rotação, opacidade, volume, pan e parâmetros de efeitos com keyframes e cinco curvas de suavização; adiciona quinze transições e clipes de título construídos com camadas de texto e forma.',
        'Mixa o áudio com fader por pista, pan, equalizador de três bandas e compressor com medidores ao vivo, além de ducking e predefinições de loudness para streaming, podcast e broadcast no barramento master.',
        'Gera legendas com o Whisper na nossa GPU, deixa você editá-las em uma faixa de legendas e as exporta gravadas na imagem ou como arquivo SRT ou VTT separado.',
        'Exporta MP4 em H.264 ou HEVC com áudio AAC, ou MP3 ou WAV, no tamanho da tela ou redimensionado para 720, 1080, 1440 ou 2160 linhas, e mantém um painel de exportações com progresso e renderização de novo.',
      ],
      flowSteps: [
        {
          title: 'Crie um projeto',
          description: 'Escolha uma tela (16:9 em 1920 x 1080, 9:16 em 1080 x 1920, 1:1, 4:5 ou um tamanho personalizado) e uma taxa de quadros de 24, 30 ou 60.',
        },
        {
          title: 'Importe a mídia',
          description: 'Envie vídeo, imagens e áudio para a bandeja de mídia. O servidor renderiza um proxy de pré-visualização com um keyframe a cada segundo para que a navegação continue leve.',
        },
        {
          title: 'Corte e sobreponha',
          description: 'Coloque os clipes nas pistas, corte e divida no cursor de reprodução, empilhe sobreposições e títulos acima da filmagem de base e mantenha imagens estáticas por qualquer duração.',
        },
        {
          title: 'Corrija a cor, aplique o chroma key e mixe',
          description: 'Ajuste a cor, aplique uma LUT, remova um fundo com chroma key, adicione keyframes ao que deve se mover e equilibre as pistas de áudio no mixer.',
        },
        {
          title: 'Exporte',
          description: 'Escolha formato, qualidade, altura de saída, modo de legendas e predefinição de loudness. O ffmpeg renderiza a linha do tempo no nosso servidor e o arquivo aparece no painel de exportações.',
        },
      ],
      advancedDetails: [
        'A exportação é uma única chamada do ffmpeg: cada fonte é uma entrada, a linha do tempo vira um grafo filter_complex (trim, scale, overlay, drawtext para os títulos, eq e filtros de cor, amix com normalize=0 para o áudio) e a saída é codificada em uma só passagem. Os parâmetros com keyframes viajam em um arquivo sendcmd anexo ao grafo, o que exige ffmpeg 4.4 ou mais recente no host de renderização.',
        'O H.264 usa o codificador de hardware h264_nvenc quando uma codificação de teste é bem-sucedida na GPU de renderização; caso contrário, libx264. As predefinições de qualidade correspondem ao preset p4 do NVENC com qualidade constante 23 (Média), p5 com CQ 19 (Alta) e p4 com CQ 28 (Baixa); no libx264 são preset medium com CRF 23, slow com CRF 18 e veryfast com CRF 28. Ambos fixam yuv420p.',
        'O HEVC usa hevc_nvenc ou libx265 com valores de CQ ou CRF cinco pontos mais altos (28, 24, 33 no NVENC; 28, 24, 32 no libx265), que é o deslocamento habitual para a mesma qualidade percebida, e marca o fluxo como hvc1 para que o MP4 toque no Safari e no QuickTime. Se nenhum dos dois codificadores estiver disponível, a exportação falha de forma explícita em vez de devolver H.264 com nome de HEVC.',
        'O áudio é reamostrado para 48 kHz estéreo dentro do grafo e codificado como AAC a 192 kb/s nas exportações de vídeo; as exportações em MP3 usam libmp3lame a 192 kb/s e as exportações em WAV são PCM de 16 bits. As predefinições de loudness são o loudnorm do ffmpeg: streaming I=-14 LUFS TP=-1.5 LRA=11, podcast I=-16 TP=-1.5 LRA=11, broadcast I=-23 TP=-2 LRA=7.',
        'Escolher uma altura de saída redimensiona o quadro composto como último filtro (lanczos, pixels quadrados, largura arredondada para um número par), depois de as legendas serem gravadas, para que o texto seja redimensionado junto com a imagem em vez de redesenhado. Uma altura que seu plano não pode renderizar é recusada com um erro, nunca rebaixada em silêncio.',
        'Os arquivos MP4 são gravados com -movflags +faststart, para que o índice fique no início e o arquivo comece a tocar antes de ser baixado por completo. Imagens estáticas na linha do tempo viram entradas com -loop 1 -framerate <project fps> -t <hold>, então uma foto mantida na tela não custa mais para decodificar do que seus quadros.',
      ],
      whyItMatters: [
        'Uma ferramenta de conversão altera um arquivo. Uma edição combina vários: o b-roll sob a entrevista, o título sobre a abertura, a trilha musical sob os dois, cada um cortado no quadro exato.',
        'Pré-visualização e exportação costumam divergir em editores de navegador. O Darkroom renderiza a pré-visualização na sua GPU e a exportação na nossa, e mantém as duas dentro de uma tolerância documentada com um conjunto de testes de imagens de referência.',
        'O trabalho pesado fica fora do seu notebook. Uma exportação em 4K, uma transcrição com Whisper ou uma composição de várias camadas com LUT roda em um servidor de renderização com GPU, então um notebook fino consegue terminar o trabalho.',
      ],
      useCases: [
        {
          title: 'Clipes verticais para plataformas de vídeo curto',
          description: 'Uma tela de 1080 x 1920, um zoom no apresentador, um cartão de título, música com ducking sob a voz e legendas gravadas no vídeo.',
        },
        {
          title: 'Tutoriais e gravações de tela',
          description: 'Corte as pausas, junte as tomadas, sobreponha a webcam em picture-in-picture, adicione destaques e exporte em 1080p com um arquivo de legendas separado.',
        },
        {
          title: 'Episódios de entrevista e podcast',
          description: 'Dois ângulos de câmera cortados para quem está falando, uma mixagem com loudness normalizado e uma exportação em MP3 da mesma linha do tempo para o feed de áudio.',
        },
        {
          title: 'Promos e vídeos de produto',
          description: 'Filmagem com chroma key sobre um fundo, uma LUT para o visual, movimentos de logo com keyframes e um corte de 15 segundos em 4K para o telão.',
        },
      ],
      workedExamples: [
        {
          title: 'Um corte de 90 segundos em 1080p30 na predefinição Média',
          body: 'Dois clipes em 1080p, uma faixa de música e um cartão de título em uma tela de 1920 x 1080 a 30 fps, exportados em H.264 na predefinição Média. No servidor de renderização com NVENC funcionando, isso é h264_nvenc preset p4 com qualidade constante 23 e yuv420p; sem ele, libx264 preset medium com CRF 23. A mixagem de áudio é codificada como AAC a 192 kb/s, o que para 90 segundos dá 192.000 x 90 / 8, cerca de 2,2 MB de áudio, independentemente do conteúdo. O lado do vídeo mira qualidade, não taxa de bits, então o tamanho segue a filmagem: material estático de alguém falando para a câmera em CQ 23 codifica pequeno; movimento de câmera na mão codifica grande. O tempo de renderização cresce com a duração da linha do tempo e com o número de clipes visíveis ao mesmo tempo, porque cada quadro de cada clipe visível é decodificado e composto antes de chegar ao codificador.',
        },
        {
          title: 'Um podcast de 20 minutos exportado em MP3 e em WAV',
          body: 'Um projeto só de áudio (duas pistas de voz, uma vinheta de abertura, predefinição de loudness para podcast) pula o grafo de vídeo por completo. Exportado em MP3, o arquivo é libmp3lame a 192 kb/s constantes: 192.000 x 1.200 / 8 = 28,8 MB, ou seja, cerca de 29 MB. Exportado em WAV, é PCM de 16 bits nos 48 kHz estéreo do grafo: 48.000 x 2 canais x 2 bytes = 192.000 bytes por segundo, 230 MB para 20 minutos. A etapa de loudnorm mira -16 LUFS integrados com teto de -1.5 dBTP e 11 LU de faixa de loudness. Sem quadros para compor, o trabalho fica limitado pela decodificação das fontes e pelos filtros de áudio, então termina bem antes da duração do episódio.',
        },
      ],
      whenNotToUse: 'O Darkroom é a ferramenta errada para um trabalho de uma só etapa. Se você só precisa cortar o começo e o fim de um clipe, mudar o formato ou reduzir o tamanho, as páginas dedicadas do cortador e do compressor de vídeo fazem isso com um envio e sem projeto. Também não é lugar para filmagens que você não pode enviar: cada fonte é mandada ao nosso servidor para proxies e renderização, então material que nunca pode sair da sua máquina pertence a um editor de desktop. Os projetos em uma sessão de visitante ficam limitados a um e duram 24 horas; entre na sua conta antes de começar qualquer coisa a que você queira voltar na semana que vem.',
      whyMediaManipulator: [
        'Primitivas de edição de verdade: navalha, slip, slide, roll, ripple, marcadores, grupos, keyframes com suavização, um mixer com equalizador e compressão, e não um cortador com um campo de título.',
        'Exportações honestas: a codificação por hardware ou software é escolhida por um teste ao vivo, o HEVC recusa em vez de mentir, e uma resolução que seu plano não pode renderizar é um erro, não um rebaixamento silencioso.',
        'Uma conta, um lugar: transcreva, comprima ou remova metadados dos mesmos arquivos que você edita, e gere narração ou legendas no mesmo servidor com GPU.',
      ],
      privacyNote: 'O Darkroom mantém sua mídia nos nossos servidores enquanto o projeto existir: os envios vão para a bandeja de mídia como ativos, o servidor renderiza a partir deles os proxies de pré-visualização, as tiras de quadros e os picos de forma de onda, e as exportações são montadas pelo ffmpeg em outputs/<jobId>/ no host de renderização. Quando você pede legendas, o áudio é enviado ao Whisper na nossa própria GPU e as marcações resultantes são armazenadas com o projeto. O documento do projeto, seus ativos, versões e exportações podem ser excluídos no editor ou na sua página Conta. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Os vídeos e áudios enviados também passam por uma etapa de análise automatizada no nosso próprio servidor. Nada é enviado a um provedor de IA terceirizado e nenhum arquivo é usado para treinar nada.',
      faq: [
        {
          question: 'O Darkroom é gratuito?',
          answer: 'Sim. Sem conta, você pode manter um projeto e renderizar 5 exportações por dia, com envios de até 200 MB por arquivo e saída de até 1080 linhas. Uma conta gratuita aumenta isso para 5 projetos, 30 exportações por dia, arquivos de 1 GB e 1440 linhas; o Premium dá projetos ilimitados, 300 exportações por dia, arquivos de 5 GB e saída de 2160 linhas; o Pro eleva as exportações para 700 por dia. As exportações têm um contador diário próprio e não consomem a cota geral de operações. Esses são os padrões; a página de preços mostra os números atuais.',
        },
        {
          question: 'O que posso exportar?',
          answer: 'MP4 com vídeo H.264 ou HEVC e áudio AAC, ou MP3 ou WAV para projetos só de áudio. O vídeo pode sair no tamanho da tela ou redimensionado para 720, 1080, 1440 ou 2160 linhas, com legendas gravadas na imagem, como arquivo SRT ou VTT separado ou omitidas, e com uma predefinição de loudness para streaming, podcast ou broadcast na mixagem.',
        },
        {
          question: 'Qual predefinição de qualidade devo escolher?',
          answer: 'Média é CRF 23 no libx264 ou qualidade constante 23 no NVENC e é o padrão sensato para enviar a uma plataforma que recodifica de qualquer jeito. Alta (CRF 18 ou CQ 19, preset slow ou p5) é para um master que você vai editar de novo ou exibir em uma tela grande. Baixa (CRF 28 ou CQ 28, veryfast ou p4) é para uma pré-visualização rápida para mandar a um colega.',
        },
        {
          question: 'Por que minha exportação em HEVC falhou?',
          answer: 'O HEVC precisa de hevc_nvenc na GPU de renderização ou de libx265 na compilação do ffmpeg. Se o servidor não tiver nenhum dos dois, a exportação falha com uma mensagem de codificador não suportado em vez de devolver um arquivo H.264 rotulado como HEVC. Mude o formato para H.264 e a mesma linha do tempo será renderizada.',
        },
        {
          question: 'Como as legendas são feitas?',
          answer: 'Gerar legendas envia o áudio da linha do tempo ao Whisper no nosso servidor com GPU. Os segmentos voltam como marcações que você pode editar na faixa de legendas e depois exportar gravadas na imagem (uma trilha de legendas ASS renderizada nos quadros) ou como arquivo SRT ou VTT ao lado do vídeo. Gerar legendas conta como um trabalho de IA, da cota de IA.',
        },
        {
          question: 'A exportação corresponde à pré-visualização?',
          answer: 'Esse é o objetivo do projeto. A pré-visualização compõe em WebGL2 na mesma ordem que o grafo de filtros do servidor usa (recorte, ajuste, transformação, correção de cor, LUT, chroma key, opacidade, mesclagem), e um conjunto de testes de imagens de referência compara quadros dos dois dentro de uma tolerância documentada. Solo e ocultar valem para a exportação exatamente como valem para a pré-visualização.',
        },
        {
          question: 'Posso voltar a um projeto mais tarde?',
          answer: 'Sim. Os projetos são salvos com números de revisão, então uma aba desatualizada não consegue sobrescrever um trabalho mais novo, e o histórico de versões mantém pontos de verificação aos quais você pode voltar. Um rascunho também fica guardado no seu navegador para recuperação em caso de travamento. Usuários conectados podem abrir projetos recentes de qualquer dispositivo; os projetos de visitante ficam com a sessão do navegador e com a janela de retenção de 24 horas.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Os arquivos de origem e exportados são processados nos nossos servidores. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
        ],
        processingNotes: [
          'A pré-visualização é composta no navegador; a exportação final é codificada no servidor em MP4 H.264 ou HEVC, ou em áudio MP3 ou WAV.',
        ],
      },
      related: [
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza ainda mais uma exportação para e-mail ou uma conexão lenta.',
        },
        {
          label: 'Transcrever vídeo',
          to: '/tools/transcribe-video',
          description: 'Obtenha a transcrição completa de uma edição finalizada, não só as legendas.',
        },
        {
          label: 'Extrair áudio de vídeo',
          to: '/tools/extract-audio-from-video',
          description: 'Retire a trilha sonora de um clipe antes de levá-lo para a linha do tempo.',
        },
        {
          label: 'Cortar vídeo',
          to: '/tools/video-trimmer',
          description: 'Quando um único corte é tudo de que você precisa.',
        },
        {
          label: 'Motion',
          to: '/tools/motion',
          description: 'Anime um logo ou um lower third como SVG e depois exporte um GIF para a linha do tempo.',
        },
        {
          label: 'Tutorial do Darkroom',
          to: '/tutorials/content-studio',
          description: 'Monte uma edição do projeto vazio ao MP4 exportado, passo a passo.',
        },
      ],
      embed: {
        title: 'Editar vídeo',
        description: 'Crie um novo projeto (ou reabra um recente), arraste arquivos de vídeo, imagem e áudio para a bandeja de mídia e depois solte-os na linha do tempo multipista. Corte, divida e organize os clipes, sobreponha camadas e títulos, mixe o áudio e exporte um MP4 finalizado, tudo no seu navegador.',
      },
    },
    'remove-exif-metadata': {
      name: 'Remover metadados EXIF de imagens',
      h1: 'Remover metadados EXIF de imagens online',
      tagline: 'Elimine localização GPS e dados de dispositivo, câmera e data e hora das fotos antes de compartilhá-las em qualquer lugar.',
      metaTitle: 'Remover metadados EXIF de imagens online (grátis) | Media Manipulator',
      metaDescription: 'Ferramenta online gratuita para remover metadados EXIF, GPS, IPTC e de câmera de imagens JPG, PNG, WebP e HEIC. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Remover metadados EXIF de imagens online',
      ogDescription: 'Elimine metadados de localização GPS, câmera e data e hora das imagens antes de compartilhá-las publicamente.',
      intro: 'Uma foto carrega um segundo documento dentro dela. Ao lado dos pixels, um celular ou uma câmera grava a marca e o modelo do dispositivo, muitas vezes o número de série, a lente, a exposição, o segundo exato em que o obturador disparou, o software que salvou o arquivo pela última vez, uma pequena miniatura de pré-visualização e, quando os serviços de localização estavam ativados, a latitude, a longitude e a altitude do ponto onde você estava. Esta ferramenta lê tudo isso de um JPG, PNG, WebP ou HEIC, mostra cada tag agrupada pelo que ela revela e depois remove tudo em uma única passagem do ExifTool, para que a cópia que você compartilha carregue só a imagem.',
      whatItDoes: [
        'Inspeciona o arquivo enviado com o ExifTool e lista cada tag encontrada, agrupada em categorias (câmera, lente, GPS, data e hora, XMP, IPTC, miniatura, cor, notas do fabricante e mais), com as tags de localização, identidade, dispositivo e histórico sinalizadas.',
        'Remove os blocos EXIF (IFD0 e ExifIFD: marca, modelo, número de série do corpo, modelo da lente, exposição, ISO, distância focal, datas de captura e modificação) e o IFD de GPS (latitude, longitude, altitude, suas tags de referência, marcações de tempo do GPS).',
        'Remove a miniatura de pré-visualização embutida no IFD1, que é uma pequena cópia separada da imagem e sobrevive ao recorte em muitos editores.',
        'Remove pacotes XMP (ferramenta de criação, histórico de edição, palavras-chave, classificações), registros IPTC (autor, direitos autorais, legenda), blocos de recursos do Photoshop, notas do fabricante e o perfil de cor ICC.',
        'Aplica primeiro a orientação EXIF aos pixels, para que uma foto de celular que dependia da tag de rotação não saia de lado depois que a tag desaparecer.',
        'Conta o que foi removido comparando os relatórios de antes e depois e mostra o número, com um aviso quando havia tags de localização entre elas.',
      ],
      flowSteps: [
        {
          title: 'Envie a foto',
          description: 'Solte um JPG, PNG, WebP ou HEIC. O servidor roda o ExifTool duas vezes (uma passagem legível e uma passagem numérica para os valores de GPS e exposição) e devolve o relatório.',
        },
        {
          title: 'Leia o relatório',
          description: 'As tags são agrupadas por categoria; as coordenadas GPS são marcadas em um localizador para você ver exatamente o que o arquivo entrega.',
        },
        {
          title: 'Remova tudo',
          description: 'Um clique salva a imagem de novo com o ImageMagick e roda exiftool -all= sobre o resultado.',
        },
        {
          title: 'Compare e baixe',
          description: 'A tela de resultado informa quantas tags foram removidas, oferece uma comparação lado a lado dos dois relatórios e entrega o arquivo limpo.',
        },
      ],
      advancedDetails: [
        'A passagem de pixels é do ImageMagick: convert <input> -auto-orient -quality 85 <output>, com o contêiner de saída igual ao de entrada para JPG, PNG, WebP, GIF e AVIF. HEIC, TIFF e BMP não têm caminho para o mesmo contêiner nesta página e voltam como JPG.',
        'A passagem de metadados é exiftool -overwrite_original -all= no arquivo convertido. -all= remove todos os grupos graváveis de uma vez: EXIF (IFD0, ExifIFD, GPS, InteropIFD), a miniatura IFD1, XMP, IPTC, Photoshop IRB, ICC_Profile, notas do fabricante e qualquer segmento APP que o ExifTool saiba gravar. Os segmentos JFIF e Adobe APP14 de que um decodificador JPEG precisa ficam no lugar; eles descrevem o layout dos pixels, não você.',
        'Como a imagem é recodificada, um JPG é gravado de novo com qualidade 85 e um PNG é gravado de novo sem perdas. A remoção não é uma cópia byte a byte com os metadados cortados.',
        'Os relatórios de antes e depois são o mesmo MetadataDocument que o inspetor monta: entradas com chave de grupo, como GPS:GPSLatitude ou XMP-xmpMM:History, cada uma classificada por um catálogo de cerca de 1.800 tags em 22 categorias e quatro classes de privacidade (localização, identidade, dispositivo, histórico).',
        'A contagem de removidos exclui as linhas que mudam em toda conversão (nome do arquivo, tamanho, data de modificação, tipo MIME, tamanho da imagem), então ela reflete os metadados que foram de fato descartados, e não a contabilidade.',
        'Contêineres de vídeo e áudio também podem ser limpos, a partir dos conversores de vídeo e áudio: o ffmpeg é executado com -map_metadata -1 -map_chapters -1 e, para MP4, MOV, M4A e M4V, segue uma passagem de exiftool -all=, porque o ffmpeg deixa para trás chaves do QuickTime e XMP.',
      ],
      whyItMatters: [
        'Tags de GPS apontam para um endereço. Uma foto de um sofá à venda, publicada de casa, pode dizer a um estranho onde o sofá está.',
        'Tags de dispositivo e número de série ligam as fotos umas às outras e a você. Duas imagens com o mesmo BodySerialNumber foram tiradas com a mesma câmera, não importa qual conta as publicou.',
        'A miniatura IFD1 é uma cópia do quadro original. Recorte um rosto ou um documento da imagem e a pré-visualização ainda pode mostrá-lo.',
        'Muitos sites removem o EXIF no envio, e muitos não. Aplicativos de mensagens, anexos de e-mail, compartilhamentos na nuvem e marketplaces frequentemente repassam o arquivo intocado.',
      ],
      useCases: [
        {
          title: 'Anúncios em marketplaces e classificados',
          description: 'Remova a localização e a hora da captura de fotos de produtos tiradas em casa antes que os compradores as vejam.',
        },
        {
          title: 'Fotos de documentos',
          description: 'Uma foto de um formulário ou de uma carta também registra quando e onde foi fotografada; remova isso antes de encaminhá-la.',
        },
        {
          title: 'Publicar de um local sensível',
          description: 'Elimine os identificadores do dispositivo e as coordenadas de uma imagem antes que ela saia do seu controle, e confirme na comparação que eles desapareceram.',
        },
        {
          title: 'Limpar uma imagem editada',
          description: 'Os editores acrescentam histórico XMP e mantêm a miniatura original; remova os dois para que o arquivo mostre só o que você pretendia.',
        },
      ],
      workedExamples: [
        {
          title: 'Um JPEG de 12 megapixels de iPhone com GPS',
          body: 'Um JPEG de 4032 x 3024 saído direto de um iPhone 15 Pro carrega, em um caso típico, 5 tags IFD0 (marca, modelo, orientação, software, data de modificação), 7 tags ExifIFD, incluindo o número de série do corpo e o modelo da lente, 5 tags de GPS, 4 entradas XMP, incluindo o histórico de edição, 2 entradas de perfil ICC, as 3 entradas da miniatura IFD1 (cerca de 5 KB de JPEG de pré-visualização) e um GPSPosition derivado. A tela de resultado informa 27 tags removidas, incluindo localização: essas 27 são todas as entradas exceto as linhas de nome, tamanho, data e tipo do arquivo e o tamanho da imagem, que existem em qualquer arquivo. A saída é um JPG recodificado com qualidade 85 e a orientação incorporada aos pixels; a recodificação decide o tamanho final. O trabalho é uma única decodificação e codificação do ImageMagick mais uma regravação do ExifTool, então termina em alguns segundos, e o tempo é gasto nos pixels, não nas tags.',
        },
        {
          title: 'Um HEIC de um celular recente',
          body: 'O HEIC não tem caminho para o mesmo contêiner nesta página, então um HEIC de 12 megapixels é decodificado pelo ImageMagick e gravado como JPG com qualidade 85, depois limpo com exiftool -all=. Você perde o contêiner HEIC e seu perfil de cor e ganha um arquivo que todo navegador e marketplace aceita. Espere um arquivo maior que o HEIC enviado, porque a recodificação JPEG com qualidade 85 é a única compressão aplicada e é ela que decide o tamanho. O relatório lista as notas do fabricante da Apple e o bloco de GPS antes, e nada além das linhas de arquivo e tamanho da imagem depois. A decodificação do HEIC é a parte lenta; ainda assim, é questão de segundos para uma foto.',
        },
      ],
      whenNotToUse: 'Não limpe uma foto que você ainda precisa editar ou cuja procedência precisa provar. Arquivos RAW de câmera não são aceitos aqui e, de qualquer forma, não deveriam ser limpos com -all=, porque suas notas do fabricante guardam dados de que o conversor RAW precisa. Se você quer manter um aviso de direitos autorais ou um título enquanto elimina as tags de GPS e de dispositivo, use o modo de metadados Personalizada do conversor de imagens, que remove tudo e grava de volta só os campos que você preencher. E lembre que remover metadados não remove o que está visível na imagem: uma placa de rua, um reflexo ou um rosto ainda dizem onde você estava; as ferramentas de desfocar rostos e ocultar texto cuidam disso.',
      whyMediaManipulator: [
        'Você vê as provas. O inspetor lista cada tag antes de você limpar, e uma comparação prova o que desapareceu depois, em vez de um sinal verde e uma promessa.',
        'Uma passagem, todos os grupos. O ExifTool -all= remove EXIF, GPS, XMP, IPTC, Photoshop, ICC, notas do fabricante e a miniatura de pré-visualização de uma vez; nada precisa ser marcado bloco por bloco.',
        'A orientação é tratada. A tag de rotação é aplicada aos pixels antes de ser removida, então uma foto de celular limpa não acaba de lado em outro lugar, que é o que costuma acontecer quando a tag é descartada sem girar os pixels.',
      ],
      privacyNote: 'Esta ferramenta remove, da cópia que devolve, os blocos EXIF (marca, modelo, número de série, lente, exposição, datas da câmera), o bloco de GPS, a miniatura de pré-visualização IFD1, os registros XMP e IPTC, os recursos do Photoshop, as notas do fabricante e o perfil ICC. Para isso, o servidor precisa lê-los primeiro: o arquivo enviado é inspecionado com o ExifTool e o relatório é gravado na pasta do trabalho como metadata.json; depois da remoção, um segundo relatório do resultado é mantido ao lado para que a visualização Comparar possa mostrar a diferença. Os dois relatórios e os dois arquivos ficam em uploads/<jobId>/ e outputs/<jobId>/ e são excluídos juntos quando a janela de retenção termina. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O inspetor independente (que lê um arquivo sem convertê-lo) remove sua cópia temporária assim que o relatório é produzido. As imagens também passam por uma etapa de análise automatizada no nosso próprio servidor; nada é enviado a terceiros.',
      faq: [
        {
          question: 'Exatamente quais grupos de metadados são removidos?',
          answer: 'Tudo o que o ExifTool consegue gravar: EXIF (IFD0, ExifIFD, InteropIFD), o IFD de GPS, a miniatura IFD1, XMP em todos os seus namespaces (xmp, dc, xmpMM, photoshop e assim por diante), registros IPTC IIM, blocos de recursos do Photoshop, notas do fabricante da Apple, Canon, Nikon, Sony e outros, e o perfil de cor ICC. Para PNG, isso inclui os chunks tEXt, iTXt, zTXt, eXIf e iCCP; para WebP, os chunks EXIF, XMP e ICCP.',
        },
        {
          question: 'A imagem é recodificada?',
          answer: 'Sim. O arquivo passa pelo ImageMagick (que também aplica a tag de orientação aos pixels) antes que o ExifTool remova as tags. Um JPG é regravado com qualidade 85, um PNG é regravado sem perdas, um WebP com qualidade 85. Visualmente, a recodificação do JPG é difícil de distinguir do original em tamanhos normais de visualização, mas não é o mesmo fluxo de bits.',
        },
        {
          question: 'Por que meu HEIC voltou como JPG?',
          answer: 'A remoção com um clique mantém o contêiner para JPG, PNG, WebP, GIF e AVIF. HEIC, TIFF e BMP são decodificados e gravados como JPG para que o resultado abra em qualquer lugar. Se você precisa de um HEIC de volta, converta-o no conversor de imagens com os metadados definidos como Remover.',
        },
        {
          question: 'O perfil de cor será removido, e isso importa?',
          answer: 'Sim, o exiftool -all= remove o perfil ICC. Para uma foto sRGB comum nada muda, porque os visualizadores assumem sRGB quando não há perfil. Para uma foto Display P3 de gama ampla de um celular recente, as cores podem parecer um pouco menos saturadas em softwares que respeitam perfis. Se isso importa para você, use o modo de metadados Personalizada do conversor de imagens e mantenha o perfil lá.',
        },
        {
          question: 'Posso manter uma linha de direitos autorais ou um título?',
          answer: 'Não com a remoção com um clique, que elimina tudo. A seção de metadados do conversor de imagens tem um modo Personalizada que limpa o arquivo e depois grava de volta só o que você digitar: título, autor, descrição, direitos autorais, comentário, palavras-chave e os campos EXIF ou GPS escolhidos. Use esse modo quando quiser um arquivo limpo que ainda traga o seu nome.',
        },
        {
          question: 'Como sei que funcionou?',
          answer: 'A tela de resultado dá o número de tags removidas e sinaliza quando havia dados de localização entre elas. Abra Comparar para ver o antes e o depois completos: é o mesmo relatório do ExifTool rodado no arquivo de saída, então uma linha de GPS ou de número de série que tivesse sobrevivido apareceria ali.',
        },
        {
          question: 'É gratuito, e quantas fotos posso limpar?',
          answer: 'Sim. Cada remoção é um envio pelo conversor padrão, então conta na cota diária de operações: por padrão, 5 por dia sem conta e até 200 MB por arquivo, 30 por dia com uma conta gratuita e arquivos de até 1 GB, 300 com o Premium e 700 com o Pro. Um trabalho que falha devolve sua unidade. Os números atuais estão na página de preços.',
        },
      ],
      related: [
        {
          label: 'Desfocar rostos em foto',
          to: '/tools/blur-faces-in-photo',
          description: 'Os metadados são só metade da história; esconda os rostos que a própria imagem mostra.',
        },
        {
          label: 'Ocultar texto em imagem',
          to: '/tools/redact-text-in-image',
          description: 'Cubra de preto nomes, endereços e números impressos na imagem.',
        },
        {
          label: 'Comprimir imagem',
          to: '/tools/compress-image',
          description: 'Reduza a foto limpa antes de publicá-la.',
        },
        {
          label: 'Imagem para PDF',
          to: '/tools/image-to-pdf',
          description: 'Reúna fotos limpas de documentos em um único PDF.',
        },
        {
          label: 'Política de privacidade',
          to: '/privacy-policy',
          description: 'Como envios, relatórios e resultados são armazenados e excluídos.',
        },
      ],
      embed: {
        title: 'Remover metadados de uma imagem',
        description: 'Envie uma foto JPG, PNG, WebP ou HEIC. Mostramos cada tag que ela carrega; depois, pressione Remover tudo para eliminar todas e ver exatamente o que foi removido.',
      },
    },
    'compress-image': {
      name: 'Comprimir imagem',
      h1: 'Comprimir imagem online grátis',
      tagline: 'Reduza o tamanho de arquivos JPG, PNG e WebP para sites mais rápidos, envios menores e compartilhamento mais fácil.',
      metaTitle: 'Comprimir imagem online grátis | Media Manipulator',
      metaDescription: 'Compressor de imagens online gratuito. Reduza o tamanho de arquivos JPG, PNG e WebP mantendo boa qualidade. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Comprimir imagem online grátis',
      ogDescription: 'Reduza o tamanho de arquivos JPG, PNG e WebP mantendo boa qualidade. Grátis, rápido e sem cadastro.',
      intro: 'Comprimir uma imagem significa recodificá-la para que a mesma imagem ocupe menos bytes. Esta página abre o conversor de imagens com o campo de qualidade já definido em 80 e o formato de saída igual ao do seu envio, então um JPG continua JPG e um WebP continua WebP. No nosso servidor, a tarefa é um único comando do ImageMagick: o arquivo é orientado automaticamente a partir do marcador de rotação EXIF e depois gravado com -quality 80, ou com o número entre 1 e 100 que você digitar. Para JPG e WebP, esse número é o que decide o tamanho do arquivo. Para PNG, ele é ignorado, porque o PNG é sem perdas, então a verdadeira alavanca para uma foto em PNG é mudar a saída para JPG ou WebP.',
      whatItDoes: [
        'Recodifica a saída em JPG e WebP na qualidade que você escolher; o formulário começa em 80.',
        'Mantém o formato de entrada, a menos que você o mude; passar uma foto em PNG para WebP ou JPG é de onde vem a grande economia para PNG.',
        'Pode reduzir as dimensões em pixels na mesma passagem: uma largura ou altura digitada nos campos de redimensionamento é aplicada antes da configuração de qualidade, então as duas economias se somam.',
        'Copia as tags EXIF, IPTC e XMP originais de volta para o arquivo comprimido, a menos que você defina o modo de metadados como remover.',
        'Grava o resultado como converted.jpg, converted.webp ou converted.png dentro da pasta de saída da tarefa, que é o que o link de download serve.',
      ],
      flowSteps: [
        {
          title: 'Envie um JPG, PNG ou WebP',
          description: 'Qualquer arquivo até o limite por arquivo do seu plano, que é de 200 MB para visitantes por padrão.',
        },
        {
          title: 'Escolha um número de qualidade',
          description: '80 é o valor predefinido. De 60 a 75 reduz mais; 90 ou acima mantém quase tudo.',
        },
        {
          title: 'O ImageMagick recodifica',
          description: 'convert input -auto-orient -quality N output, seguido de uma passagem do exiftool que copia as tags.',
        },
        {
          title: 'Baixe o arquivo menor',
          description: 'A saída é servida da pasta da tarefa até o fim da janela de retenção.',
        },
      ],
      advancedDetails: [
        'O comando exato é o convert do ImageMagick com o caminho de entrada primeiro, depois -auto-orient, um -crop e um -resize opcionais, depois -quality N e, por fim, o caminho de saída. O argumento -quality só é acrescentado quando o formato de saída é jpg, jpeg ou webp (convertImage em converter.go).',
        'A qualidade é validada no servidor na faixa de 1 a 100; um valor fora dela é rejeitado antes de qualquer trabalho começar, e a unidade da tarefa é devolvida.',
        'A saída em PNG nunca recebe um argumento -quality, então diminuir o número em uma tarefa de PNG para PNG não muda nada. O conversor não executa pngquant nem nenhuma redução de paleta; para deixar um PNG menor, você muda o formato dele.',
        'No modo padrão de metadados, o servidor executa exiftool -TagsFromFile <original> -all:all -unsafe no resultado, então as tags de câmera, lente, data e GPS sobrevivem à compressão. Escolher remover executa exiftool -all= na saída.',
        'Um redimensionamento, se você definir um, acontece antes de a qualidade ser aplicada. A largura sozinha mantém a proporção; largura mais altura força exatamente essa caixa, mesmo quando a proporção é diferente.',
        'Filtros, uma tonalidade e uma sobreposição de texto estão disponíveis no mesmo formulário: um filtro é aplicado logo após o redimensionamento, e a tonalidade e a sobreposição de texto são adicionadas por último, depois da configuração de qualidade.',
      ],
      whyItMatters: [
        'Os bytes de imagem costumam ser a maior parte de uma página web ou de um e-mail, então reduzi-los pela metade é o ganho de velocidade mais barato que existe.',
        'Formulários de envio, campos de CMS e aplicativos de mensagens impõem limites medidos em megabytes, não em pixels.',
        'Recodificar uma vez em uma qualidade que você escolheu é melhor do que deixar uma plataforma recodificar do jeito dela.',
      ],
      useCases: [
        {
          title: 'Fotos de blog e de produtos',
          description: 'Leve um JPEG de câmera de 4 a 6 MB para bem abaixo de 1 MB antes de publicar.',
        },
        {
          title: 'Anexos de e-mail',
          description: 'Deixe um conjunto de fotos abaixo de um limite de 20 ou 25 MB da caixa de e-mail.',
        },
        {
          title: 'Portais de inscrição',
          description: 'Cumpra um limite de 2 MB para foto de rosto ou de documento sem perda visível.',
        },
        {
          title: 'Cópias de trabalho',
          description: 'Mantenha cópias menores para o dia a dia enquanto os originais ficam no seu arquivo.',
        },
      ],
      workedExamples: [
        {
          title: 'Um JPEG de celular de 4000 x 3000 na qualidade 80 com 1600 px de largura',
          body: 'Entrada: um JPEG de 4,8 MB, 4000 x 3000 pixels, direto da câmera de um celular. Configurações: largura 1600, altura em branco, qualidade 80, formato inalterado. O ImageMagick executa -resize 1600x, que mantém a proporção e produz 1600 x 1200 pixels: 1,92 megapixel contra os 12 originais, cerca de um sexto dos pixels. O resultado é gravado com -quality 80 e recebe o EXIF copiado de volta, então a saída é um JPG de 1600 x 1200 cujo tamanho acompanha essa redução de pixels, aproximadamente um sexto do original, então espere cerca de 1 MB ou menos a partir de 4,8 MB. A conversão é uma única passagem do ImageMagick sobre uma imagem de 12 megapixels e leva alguns segundos; enviar o arquivo de 4,8 MB normalmente leva mais tempo do que convertê-lo.',
        },
        {
          title: 'Uma captura de tela em PNG de 2,6 MB convertida para WebP',
          body: 'Entrada: uma captura de tela em PNG de 1920 x 1080 com 2,6 MB e sem transparência. Deixar o formato como PNG e mover a qualidade para 60 não mudaria nada, porque -quality não é passado para saída em PNG. Mudar a saída para WebP na qualidade predefinida 80 executa convert input -auto-orient -quality 80 converted.webp. Sem compressão, esses 2.073.600 pixels são 6,2 MB de RGB; o WebP com perdas na qualidade 80 mantém só uma fração disso, então o resultado é uma fração do PNG de 2,6 MB, com o número exato dependendo de quanta cor chapada e quanto texto a captura de tela contém. As dimensões continuam 1920 x 1080 e a tarefa termina em alguns segundos.',
        },
      ],
      whenNotToUse: 'Não use compressão com perdas em uma imagem que você ainda pretende editar bastante, em um PNG cuja transparência você precisa manter como PNG (mudar para JPG achata o canal alfa) ou em capturas de tela com texto pequeno, em que uma qualidade muito abaixo de 85 faz as letras borrarem. Se o arquivo é grande só por causa das dimensões em pixels, o redimensionador de imagens é o melhor primeiro passo; se o seu objetivo é privacidade em vez de tamanho, o removedor de EXIF elimina as tags sem tocar nos pixels. E um JPG que já foi salvo na qualidade 70 não fica muito menor em 80; cada novo salvamento adiciona perda sem um ganho correspondente.',
      whyMediaManipulator: [
        'O comando que roda está escrito nesta página, inclusive o fato de que o PNG ignora o número de qualidade, então você não fica adivinhando por que um arquivo não encolheu.',
        'Os controles de qualidade, redimensionamento, formato e metadados ficam em um só formulário e um só envio, e nenhuma marca d\'água é adicionada.',
        'Nada para instalar e sem conta para a ferramenta padrão. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'Sua imagem é armazenada em uploads/<jobId>/ no nosso próprio servidor, o ImageMagick grava a cópia comprimida em outputs/<jobId>/, e um relatório de metadados do original é gravado ao lado. No modo padrão, o exiftool copia as tags EXIF, IPTC e XMP originais para o arquivo comprimido, então os dados de localização e câmera voltam com o resultado, a menos que você escolha a opção remover. Toda imagem enviada também passa por uma análise automatizada feita por um modelo de visão no mesmo servidor, e o resumo em JSON é mantido com a tarefa. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Nada é enviado a um serviço de terceiros.',
      faq: [
        {
          question: 'Comprimir uma imagem aqui é grátis?',
          answer: 'Sim, para a ferramenta padrão. Uma tarefa de compressão gasta uma das operações do dia: visitantes têm 5 por dia com um limite por arquivo de 200 MB por padrão, uma conta gratuita eleva isso para 30 por dia e 1 GB por arquivo, e Premium e Pro vão para 300 e 700. Os números atuais estão em /pricing, porque os limites podem mudar.',
        },
        {
          question: 'Qual número de qualidade devo usar?',
          answer: '80 é o valor predefinido e um padrão sensato para fotos. Vá mais baixo só quando um limite rígido de tamanho obrigar, e vá para 90 ou acima em imagens que serão impressas ou recortadas depois. O número é passado direto para a opção -quality do ImageMagick, então significa o mesmo que em outras ferramentas construídas sobre o ImageMagick.',
        },
        {
          question: 'Por que meu PNG não ficou menor?',
          answer: 'Porque o campo de qualidade não faz nada para saída em PNG: o servidor só adiciona -quality para jpg, jpeg e webp. Mude o formato de saída para WebP ou JPG. Se você precisa manter a transparência, o WebP mantém um canal alfa, e o JPG não.',
        },
        {
          question: 'A compressão mantém meus dados EXIF e GPS?',
          answer: 'Por padrão, sim. Depois que o ImageMagick grava o arquivo, o exiftool copia todos os grupos de tags do original para o resultado. Escolha remover na seção de metadados para eliminar todas elas, ou use o removedor de EXIF dedicado.',
        },
        {
          question: 'A imagem também será redimensionada?',
          answer: 'Não, a menos que você digite uma largura ou uma altura. Com os dois campos vazios, as dimensões em pixels não mudam e só a codificação muda.',
        },
        {
          question: 'Posso comprimir várias imagens de uma vez?',
          answer: 'Cada envio é uma tarefa com um arquivo de saída. Execute a ferramenta uma vez por imagem; cada tarefa conta como uma operação da cota diária.',
        },
        {
          question: 'O WebP é sempre menor que o JPG na mesma qualidade?',
          answer: 'Normalmente, para fotografias, mas as escalas de qualidade dos dois codificadores não são idênticas, então compare as duas saídas em vez de presumir. Fique com o JPG quando o arquivo precisar abrir em softwares anteriores ao suporte a WebP.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Diminuir a qualidade afeta a saída em JPG e WebP. Para reduzir muito uma foto em PNG, converta-a para JPG ou WebP.',
        ],
      },
      related: [
        {
          label: 'Redimensionar imagem',
          to: '/tools/image-resizer',
          description: 'Reduza as dimensões em pixels primeiro para a maior economia.',
        },
        {
          label: 'Remover metadados EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimine as tags de localização e câmera sem recodificar.',
        },
        {
          label: 'Imagem para PDF',
          to: '/tools/image-to-pdf',
          description: 'Coloque o JPG comprimido em um PDF de uma página.',
        },
        {
          label: 'Upscaler de imagens com IA',
          to: '/tools/ai-image-upscaler',
          description: 'Faça o caminho inverso e amplie uma imagem pequena.',
        },
        {
          label: 'Tutorial do conversor de imagens',
          to: '/tutorials/image/getting-started',
          description: 'Percorra as configurações de qualidade, redimensionamento e formato.',
        },
      ],
      embed: {
        title: 'Comprimir uma imagem',
        description: 'Envie uma imagem e diminua o controle de qualidade para reduzir o arquivo. O formato de saída continua o mesmo por padrão, ou mude para WebP para o menor tamanho. Uma qualidade em torno de 75–85 é um bom equilíbrio.',
      },
    },
    'image-resizer': {
      name: 'Redimensionar imagem',
      h1: 'Redimensionar imagem online grátis',
      tagline: 'Redimensione imagens JPG, PNG, WebP e GIF para dimensões exatas em pixels mantendo a proporção.',
      metaTitle: 'Redimensionar imagem online grátis | Media Manipulator',
      metaDescription: 'Redimensionador de imagens online gratuito. Redimensione imagens JPG, PNG, WebP e GIF para dimensões exatas em pixels mantendo a proporção. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Redimensionar imagem online grátis',
      ogDescription: 'Redimensione imagens JPG, PNG, WebP e GIF para dimensões exatas em pixels. Grátis, rápido e sem cadastro.',
      intro: 'Esta página abre o conversor de imagens com os campos de redimensionamento em destaque. Digite uma largura, uma altura ou as duas, e o servidor executa o ImageMagick com um argumento -resize montado exatamente a partir do que você digitou: 1600x para uma largura sozinha, x900 para uma altura sozinha e 1600x900! quando você preenche os dois. Esse ponto de exclamação no final importa: ele diz ao ImageMagick para produzir exatamente essa caixa mesmo que a proporção seja diferente da original, o que estica a imagem. Então a regra é simples. Um campo mantém as proporções; dois campos dão o tamanho exato e confiam que você escolheu uma proporção compatível ou recortou antes.',
      whatItDoes: [
        'Redimensiona imagens JPG, PNG, WebP e GIF para a largura e a altura em pixels que você digitar, depois de orientá-las automaticamente a partir do marcador de rotação EXIF.',
        'Mantém a proporção quando só uma dimensão é preenchida; força a caixa exata quando as duas são.',
        'Oferece uma caixa de recorte no mesmo formulário, aplicada antes do redimensionamento, que é como você obtém um quadrado ou banner exato sem distorção.',
        'Grava a saída no formato original por padrão, com qualidade 85 para JPG e WebP, e copia as tags de metadados originais para ela.',
        'Limita a altura solicitada ao limite de saída do seu plano e as dimensões ao que o ImageMagick tem permissão para produzir.',
      ],
      flowSteps: [
        {
          title: 'Envie a imagem',
          description: 'JPG, PNG, WebP ou GIF, até o limite por arquivo do seu plano.',
        },
        {
          title: 'Digite largura, altura ou as duas',
          description: 'Um valor mantém a proporção. Dois valores forçam a caixa. Recorte antes se a proporção precisar mudar.',
        },
        {
          title: 'O ImageMagick redimensiona',
          description: 'convert input -auto-orient [-crop WxH+X+Y] -resize <arg> [-quality 85] output.',
        },
        {
          title: 'Baixe',
          description: 'O arquivo redimensionado é servido da pasta de saída da tarefa como converted.<format>.',
        },
      ],
      advancedDetails: [
        'O argumento de redimensionamento é montado em convertImage (converter.go): os dois valores geram WxH! (forçar exato), a largura sozinha gera Wx e a altura sozinha gera xH. O filtro de reamostragem padrão do ImageMagick é usado; não há opção para escolher outro.',
        'Um recorte, quando definido, é passado como -crop WxH+X+Y e roda antes do -resize, então as coordenadas do recorte se referem ao original orientado automaticamente, não ao resultado redimensionado.',
        'O servidor rejeita largura ou altura acima de 10000 ou abaixo de 1, e o formulário limita os dois campos a 4096.',
        'Uma altura explícita também é verificada contra o limite de altura de saída do seu plano antes de o envio ser aceito: 1080 px para visitantes por padrão, 1440 com uma conta gratuita e 2160 no Premium e no Pro. Uma solicitação acima do limite é recusada com uma mensagem que cita os dois números, e nenhuma unidade é gasta. A largura sozinha não é verificada.',
        'As saídas em JPG e WebP recebem -quality 85, a menos que você mude o número; PNG e GIF o ignoram. Ampliar com esta ferramenta apenas interpola os pixels existentes, então uma ampliação de 2x ou 4x fica suave; o upscaler com IA existe para esse caso.',
        'Depois que o ImageMagick termina, o exiftool copia as tags originais para o resultado no modo padrão de metadados, então o arquivo redimensionado ainda carrega a data de captura, o modelo da câmera e qualquer posição GPS.',
      ],
      whyItMatters: [
        'Espaços de avatar, capa e miniatura pedem tamanhos específicos em pixels, e o redimensionamento feito pela plataforma costuma ser de qualidade inferior e sem controle.',
        'A quantidade de pixels é o maior fator individual no tamanho do arquivo; uma foto de 24 megapixels exibida com 1920 px de largura carrega dez vezes mais dados do que a tela consegue mostrar.',
        'Redimensionar do seu jeito também permite escolher o recorte, em vez de deixar um espaço quadrado cortar uma cabeça fora.',
      ],
      useCases: [
        {
          title: 'Fotos de perfil e avatares',
          description: 'Recorte em um quadrado e depois redimensione para os 400 ou 512 px que o serviço pede.',
        },
        {
          title: 'Imagens para web e blog',
          description: 'Redimensione fotos de câmera para a largura de coluna em que elas realmente serão exibidas.',
        },
        {
          title: 'Banners e cabeçalhos',
          description: 'Corte a proporção exata e depois acerte a largura exigida com precisão de pixel.',
        },
        {
          title: 'Limites de envio em formulários',
          description: 'Reduza as dimensões para ficar abaixo de um limite de megapixels ou megabytes.',
        },
      ],
      workedExamples: [
        {
          title: 'Um JPEG de câmera de 6000 x 4000 redimensionado para 1920 px de largura',
          body: 'Entrada: um JPEG de 8,5 MB e 24 megapixels de uma câmera mirrorless. Configurações: largura 1920, altura vazia, formato inalterado, qualidade 85. O servidor executa convert input -auto-orient -resize 1920x -quality 85 converted.jpg. A proporção é 3:2, então a saída tem 1920 x 1280 pixels, cerca de 2,46 megapixels, aproximadamente um décimo da quantidade original de pixels. O tamanho do arquivo cai em proporção semelhante, então espere algo abaixo de 1 MB. Uma passagem do ImageMagick sobre 24 megapixels leva alguns segundos no servidor, e a cópia do exiftool em seguida mantém as tags de lente e exposição.',
        },
        {
          title: 'Um avatar de 400 x 400 a partir de uma foto de celular em retrato de 3024 x 4032',
          body: 'Entrada: um JPEG em retrato de 3,1 MB, com 3024 de largura por 4032 de altura. Digitar 400 e 400 sozinhos executaria -resize 400x400! e espremeria a imagem 3:4 em um quadrado. Em vez disso, defina o recorte como 3024 x 3024 no deslocamento 0,504 (um quadrado a partir do meio) e depois largura 400 e altura 400. O comando vira convert input -auto-orient -crop 3024x3024+0+504 -resize 400x400! -quality 85 converted.jpg, e o resultado é um JPG de 400 x 400 sem distorção, com 160.000 pixels, de algumas dezenas de kilobytes. O recorte e o redimensionamento são uma única passagem e terminam em alguns segundos.',
        },
      ],
      whenNotToUse: 'Não use o redimensionador para aumentar uma imagem pequena: o ImageMagick só interpola os pixels que existem, então uma foto de 640 px esticada para 2560 px sai borrada, e esse caso é para o upscaler com IA. Não digite uma largura e uma altura cuja proporção seja diferente da imagem, a menos que tenha recortado antes, porque o modo de caixa exata estica em vez de adicionar bordas. Se o arquivo é grande, mas as dimensões já estão certas, use o compressor e deixe os pixels em paz. E GIFs animados são mais bem tratados por uma ferramenta dedicada a GIF do que por um redimensionamento simples.',
      whyMediaManipulator: [
        'O comportamento de caixa exata versus manter a proporção está explicado aqui com os argumentos reais do ImageMagick, então não há surpresa quando uma foto volta esticada.',
        'Recorte, redimensionamento, formato e qualidade em um único envio, e a saída não carrega marca d\'água.',
        'Sem cadastro para a ferramenta padrão. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'A imagem enviada é salva em uploads/<jobId>/ no nosso servidor e a cópia redimensionada em outputs/<jobId>/; os dois diretórios estão no registro de retenção e são removidos juntos. Como o modo padrão de metadados copia as tags originais para o arquivo redimensionado com o exiftool, as coordenadas GPS e o número de série da câmera viajam com o resultado, a menos que você escolha remover na seção de metadados do formulário. As imagens enviadas para redimensionamento também passam pela análise automatizada que roda em toda imagem no nosso servidor, usando um modelo de visão local, com o resumo armazenado na pasta da tarefa. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Nenhum terceiro recebe o arquivo.',
      faq: [
        {
          question: 'Redimensionar custa alguma coisa?',
          answer: 'Sem conta e sem pagamento para a ferramenta padrão. Cada redimensionamento é uma operação diária: 5 por dia para visitantes e 30 para uma conta gratuita por padrão, com limite por arquivo de 200 MB e 1 GB, respectivamente. Premium e Pro elevam as contagens para 300 e 700. Veja /pricing para os números em vigor hoje.',
        },
        {
          question: 'Como mantenho a proporção?',
          answer: 'Preencha só um dos dois campos. A largura sozinha vira -resize 1600x e a altura é calculada a partir da proporção original; a altura sozinha vira x900 e a largura acompanha.',
        },
        {
          question: 'Por que minha imagem saiu esticada?',
          answer: 'Você preencheu largura e altura com uma proporção que não corresponde à imagem. Dois valores são enviados como WxH!, o que força exatamente essa caixa. Recorte primeiro na proporção desejada, no mesmo formulário, e depois defina os dois valores.',
        },
        {
          question: 'Qual é o maior tamanho que posso solicitar?',
          answer: 'O formulário aceita até 4096 em cada campo e o servidor até 10000. Uma altura explícita acima do limite de saída do seu plano (1080 px para visitantes por padrão) é recusada antes de o envio começar e não custa nada.',
        },
        {
          question: 'Posso aumentar uma foto pequena com esta ferramenta?',
          answer: 'Você pode digitar um número maior, mas o ImageMagick só interpola, então o resultado fica suave. Para uma ampliação de 2x ou 4x que reconstrói detalhes, use o upscaler com IA, que executa o Real-ESRGAN.',
        },
        {
          question: 'A saída mantém meus dados EXIF e a orientação?',
          answer: 'Os pixels são orientados automaticamente primeiro, então o resultado aparece na posição certa em qualquer lugar, e, no modo padrão, o exiftool copia as tags originais de volta para ele. Escolha remover se quiser eliminar as tags.',
        },
        {
          question: 'Posso redimensionar um GIF?',
          answer: 'O GIF é aceito como entrada e saída e passa pelo mesmo comando do ImageMagick. A ferramenta foi feita para imagens estáticas; para GIFs animados, uma ferramenta dedicada a GIF dá mais controle sobre quadros e paleta.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Deixe uma dimensão em branco para redimensionar proporcionalmente e manter a proporção.',
        ],
      },
      related: [
        {
          label: 'Comprimir imagem',
          to: '/tools/compress-image',
          description: 'Diminua a qualidade sem mudar as dimensões.',
        },
        {
          label: 'Upscaler de imagens com IA',
          to: '/tools/ai-image-upscaler',
          description: 'Amplie em 2x ou 4x com um modelo em vez de interpolação.',
        },
        {
          label: 'Remover metadados EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimine as tags que o redimensionamento mantém por padrão.',
        },
        {
          label: 'Imagem para PDF',
          to: '/tools/image-to-pdf',
          description: 'Coloque a imagem redimensionada em uma página de PDF.',
        },
        {
          label: 'Tutorial do conversor de imagens',
          to: '/tutorials/image/getting-started',
          description: 'Percorra as configurações de redimensionamento, recorte e qualidade.',
        },
      ],
      embed: {
        title: 'Redimensionar uma imagem',
        description: 'Envie uma imagem e defina abaixo uma largura e/ou altura de destino. Deixe uma em branco para redimensionar proporcionalmente e manter a proporção original. O formato de saída continua o mesmo, a menos que você o mude.',
      },
    },
    'remove-background-from-image': {
      name: 'Remover fundo de imagem',
      h1: 'Remover fundo de imagem online grátis',
      tagline: 'Apague automaticamente o fundo de qualquer foto e baixe um recorte em PNG limpo e transparente.',
      metaTitle: 'Remover fundo de imagem online grátis | Media Manipulator',
      metaDescription: 'Removedor de fundo online gratuito. Apague automaticamente o fundo de qualquer foto e baixe um PNG transparente. Roda na nossa própria GPU, sem IA de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Remover fundo de imagem online grátis',
      ogDescription: 'Apague automaticamente o fundo de qualquer foto e baixe um recorte em PNG transparente. Grátis, sem cadastro.',
      intro: 'Esta página abre o conversor de imagens com a operação de IA fixada em Remover fundo e a saída fixada em PNG. Quando você converte, o servidor entrega seu arquivo ao rembg, uma ferramenta de segmentação de código aberto, rodando em uma GPU que é nossa: por padrão ele carrega o modelo BiRefNet General, prevê quais pixels pertencem ao sujeito e grava um PNG cujo canal alfa é transparente em todo o resto. Outros seis modelos podem ser selecionados no formulário (um BiRefNet mais leve, uma variante para retratos, o ISNet e três versões do U2Net) para os casos em que o modelo geral erra em cabelos, vidro ou uma pessoa diante de um fundo cheio de detalhes.',
      whatItDoes: [
        'Roda o rembg com o modelo que você escolher (BiRefNet General, a menos que você mude) e devolve o sujeito sobre um fundo transparente.',
        'Sempre grava PNG, porque a transparência precisa de um canal alfa e a API força a extensão .png nesta operação.',
        'Mantém as dimensões completas em pixels do seu envio; o recorte não é redimensionado nem cortado.',
        'Executa na nossa própria GPU por meio do ONNX Runtime com CUDA; nenhuma imagem é enviada a um serviço de IA externo.',
        'Conta como uma tarefa comum, a mesma unidade de uma conversão de formato simples, e não como uma tarefa de IA.',
      ],
      flowSteps: [
        {
          title: 'Envie um JPG, PNG ou WebP',
          description: 'Um único sujeito bem definido gera a máscara mais limpa.',
        },
        {
          title: 'Escolha um modelo ou mantenha o padrão',
          description: 'O BiRefNet General vem pré-selecionado; os modelos de retrato e de segmentação humana existem para pessoas.',
        },
        {
          title: 'O rembg segmenta na GPU',
          description: 'rembg i -m <model> input output.png roda com o ambiente CUDA do ONNX Runtime carregado.',
        },
        {
          title: 'Baixe o PNG transparente',
          description: 'O resultado é o converted.png na pasta de saída da tarefa.',
        },
      ],
      advancedDetails: [
        'A chamada é RemoveBackground em ai_tools.go: um shell bash carrega o script de ambiente CUDA do ONNX Runtime, define U2NET_HOME como o diretório de modelos do servidor e executa rembg i -m <model> <input> <output>. Os pesos dos modelos ficam em cache no servidor, então a primeira tarefa depois de uma reinicialização pode demorar um pouco mais enquanto eles carregam.',
        'Os nomes de modelo aceitos são birefnet-general, birefnet-general-lite, isnet-general-use, u2net, u2netp, u2net_human_seg e birefnet-portrait; qualquer outro valor é rejeitado antes de a tarefa começar. Um valor vazio vira birefnet-general.',
        'O caminho de IA substitui por completo o pipeline do ImageMagick, então o número de qualidade, os filtros, a tonalidade, o texto sobreposto e as opções de metadados do formulário não têm efeito nesta operação; a saída é o que o rembg gravar.',
        'Como a etapa normal de cópia com exiftool não roda em operações de IA, o PNG não carrega nenhum EXIF do original. Se você precisar das tags no recorte, o editor de metadados pode adicioná-las em uma segunda tarefa.',
        'O tamanho da saída acompanha o sujeito: regiões totalmente transparentes comprimem para quase nada em PNG, então um produto pequeno em uma tela grande gera um arquivo pequeno, enquanto um sujeito que ocupa o quadro inteiro gera um arquivo próximo de um PNG sem perdas do original.',
      ],
      whyItMatters: [
        'Anúncios de produtos, miniaturas e composições começam com um recorte, e fazer a máscara à mão leva minutos por imagem.',
        'Os marketplaces exigem cada vez mais um fundo liso ou branco, que é um recorte transparente colocado sobre uma camada branca.',
        'Um modelo treinado com milhões de máscaras lida melhor com pelos, cabelos e bordas semitransparentes do que uma seleção com varinha mágica.',
      ],
      useCases: [
        {
          title: 'Produtos de e-commerce',
          description: 'Isole o item e coloque-o sobre branco ou qualquer cor da marca.',
        },
        {
          title: 'Fotos de perfil e páginas de equipe',
          description: 'Use o modelo de retrato para recortar pessoas com precisão de fundos de escritório.',
        },
        {
          title: 'Logos extraídos de fotos',
          description: 'Obtenha uma versão transparente de um logo que só existe em uma placa ou página colorida.',
        },
        {
          title: 'Miniaturas e adesivos',
          description: 'Monte designs em camadas a partir de vários recortes no seu editor.',
        },
      ],
      workedExamples: [
        {
          title: 'Um JPEG de produto de 3000 x 2000 com o modelo padrão',
          body: 'Entrada: um JPEG de 2,1 MB, 3000 x 2000, de um tênis sobre um fundo cinza. Modelo mantido em BiRefNet General. O servidor roda o rembg na GPU e grava o converted.png nos mesmos 3000 x 2000 pixels, com quatro canais. Sem compressão, isso são 24 MB de RGBA, mas o fundo transparente comprime para quase nada, então o tamanho do PNG é determinado pelo próprio tênis, normalmente alguns megabytes, porque o PNG é sem perdas. O tempo é uma passagem do modelo pela imagem mais a codificação do PNG, alguns segundos quando o modelo já está aquecido; a primeira execução depois de um período ocioso soma o tempo de carregar os pesos.',
        },
        {
          title: 'Uma foto de perfil de 1080 x 1080 com o modelo de retrato',
          body: 'Entrada: uma selfie em WebP de 640 KB, 1080 x 1080, na frente de uma estante de livros. Troque o modelo para BiRefNet Portrait, ajustado para pessoas e cabelos. A saída é um PNG de 1080 x 1080 com a pessoa opaca e as estantes totalmente transparentes. Com 1,17 megapixel, a passagem do modelo é rápida; a maior parte do tempo total é o envio e a gravação do PNG. Como o caminho de IA pula a cópia de metadados, o PNG não tem EXIF, que normalmente é o que você quer em uma imagem de perfil.',
        },
      ],
      whenNotToUse: 'Pule esta ferramenta quando o sujeito não for uma única coisa distinta: uma multidão, uma paisagem, um padrão ou um interior sem primeiro plano evidente não dão ao modelo nada para separar, e a máscara será arbitrária. Também é a ferramenta errada quando você quer um desfoque suave atrás do sujeito em vez de transparência, quando precisa do resultado em JPG (o JPG não guarda canal alfa, então você teria que achatá-lo depois) e quando a entrada é uma captura de tela ou um desenho de linha, caso em que o ISNet ou uma seleção manual em um editor funciona melhor do que um modelo treinado com fotos.',
      whyMediaManipulator: [
        'Sete modelos reais de segmentação ficam expostos pelo nome, então você pode trocar do modelo geral para uma versão de retrato ou U2Net quando uma borda sai errada.',
        'A saída é um PNG transparente simples em resolução completa, sem marca d\'água e sem redução forçada.',
        'O modelo roda em hardware que nós operamos, e a ferramenta padrão não exige conta. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'Sua foto é gravada em uploads/<jobId>/ no nosso servidor e lida pelo rembg rodando em uma GPU na mesma máquina; o recorte vai para outputs/<jobId>/converted.png. Nenhuma API externa é chamada para a segmentação e nada da sua imagem é usado para treinar coisa alguma. Como todo envio de imagem, o arquivo também é examinado uma vez por uma etapa de análise automática que usa um modelo de visão hospedado no nosso servidor, e esse resumo é armazenado com a tarefa. O PNG não carrega EXIF do original porque a etapa de cópia de metadados não roda em operações de IA. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'A remoção de fundo é gratuita?',
          answer: 'Sim, dentro da cota diária. A remoção de fundo conta de propósito como uma tarefa comum, e não como uma da cota separada de IA: 5 por dia para visitantes e 30 com uma conta gratuita, por padrão, com limites por arquivo de 200 MB e 1 GB. Premium e Pro recebem 300 e 700. Os números atuais estão em /pricing.',
        },
        {
          question: 'Qual modelo devo escolher?',
          answer: 'Mantenha o BiRefNet General para objetos, produtos e a maioria das fotos. Escolha o BiRefNet Portrait ou o U2Net Human Segmentation para pessoas, e o BiRefNet General Lite ou o U2Net Lite quando quiser uma passagem mais rápida em uma imagem grande.',
        },
        {
          question: 'Por que a saída é sempre PNG?',
          answer: 'A API força a extensão .png nesta operação porque o recorte precisa de um canal alfa; o JPG não tem nenhum e mostraria o fundo em preto ou branco. Converta para outro formato depois, se você já tiver achatado o recorte sobre uma cor.',
        },
        {
          question: 'Posso ter um fundo branco em vez de transparência?',
          answer: 'Não diretamente nesta ferramenta. Coloque o PNG sobre uma camada branca em qualquer editor ou no Darkroom; os pixels transparentes assumem a cor que estiver embaixo.',
        },
        {
          question: 'Funciona com cabelo, pelos e vidro?',
          answer: 'Muitas vezes sim, e os modelos de retrato e BiRefNet foram treinados pensando nessas bordas, mas regiões semitransparentes são o caso mais difícil. Tente um segundo modelo se o primeiro deixar uma franja.',
        },
        {
          question: 'Minha foto é enviada a uma empresa de IA externa?',
          answer: 'Não. O rembg e seus modelos rodam no nosso próprio servidor GPU, e a tarefa nunca chama uma API de terceiros.',
        },
        {
          question: 'O recorte mantém meus dados EXIF?',
          answer: 'Não. As operações de IA pulam a cópia com exiftool que o conversor normal faz, então o PNG não tem tags de câmera, data ou GPS.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A saída é sempre um PNG transparente. A remoção de fundo roda no nosso servidor GPU local, não em uma API de terceiros.',
        ],
      },
      related: [
        {
          label: 'Remover objeto de foto',
          to: '/tools/remove-object-from-photo',
          description: 'Apague uma coisa e mantenha o resto da cena.',
        },
        {
          label: 'Redimensionar imagem',
          to: '/tools/image-resizer',
          description: 'Ajuste o recorte ao tamanho que o seu layout precisa.',
        },
        {
          label: 'Upscaler de imagens com IA',
          to: '/tools/ai-image-upscaler',
          description: 'Amplie um recorte pequeno antes de posicioná-lo.',
        },
        {
          label: 'Desfocar rostos em foto',
          to: '/tools/blur-faces-in-photo',
          description: 'Anonimize as pessoas em vez de isolá-las.',
        },
        {
          label: 'Tutorial do conversor de imagens',
          to: '/tutorials/image/getting-started',
          description: 'Percorra todas as opções de IA e de imagem.',
        },
      ],
      embed: {
        title: 'Remover o fundo de uma imagem',
        description: 'Envie uma foto. Esta ferramenta vem predefinida com o removedor de fundo por IA e gera um PNG transparente. Basta enviar e converter: o sujeito é mantido e o fundo é apagado.',
      },
    },
    'image-to-pdf': {
      name: 'Imagem para PDF',
      h1: 'Converter imagem em PDF online grátis',
      tagline: 'Transforme imagens JPG, PNG e outras em um documento PDF limpo e fácil de compartilhar, com um clique.',
      metaTitle: 'Converter imagem em PDF online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de imagem para PDF. Transforme imagens JPG, PNG e outras em um documento PDF limpo. Sem cadastro e sem marcas d\'água. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter imagem em PDF online grátis',
      ogDescription: 'Transforme JPG, PNG e outras imagens em um PDF limpo e fácil de compartilhar. Grátis, rápido, sem cadastro.',
      intro: 'Esta página fixa o formato de saída em PDF, o que envia sua imagem por um caminho dedicado na nossa API que monta o documento em Go puro, em vez de passar pelo ImageMagick ou pelo Ghostscript. Um JPEG é incorporado byte a byte com o filtro /DCTDecode, então a foto dentro do PDF é exatamente o mesmo fluxo comprimido que você enviou. Um PNG, GIF ou WebP é decodificado, composto sobre branco e armazenado como RGB de 8 bits comprimido com zlib. A página única é dimensionada para que a imagem fique a 96 pixels por polegada: cada pixel vira 0,75 ponto, o que mantém a imagem na resolução nativa sem reamostragem.',
      whatItDoes: [
        'Envolve uma imagem em um documento PDF 1.4 de uma página, dimensionado para a imagem a 96 DPI.',
        'Incorpora os dados JPEG sem alteração, então não há uma segunda geração de compressão para fotos.',
        'Achata os pixels transparentes de PNG e GIF sobre branco e os armazena sem perdas com zlib.',
        'Rasteriza WebP e outros contêineres que o Go não consegue decodificar primeiro pelo ImageMagick e depois incorpora o resultado sem perdas.',
        'Ignora as configurações de qualidade, redimensionamento, recorte, filtro e IA; o caminho de PDF recebe apenas a imagem.',
      ],
      flowSteps: [
        {
          title: 'Envie qualquer imagem',
          description: 'JPG, PNG, GIF e WebP são as entradas comuns; o campo aceita qualquer tipo de imagem.',
        },
        {
          title: 'O servidor lê os pixels',
          description: 'As dimensões do JPEG vêm do cabeçalho; os outros formatos são decodificados e achatados para RGB.',
        },
        {
          title: 'Um PDF de uma página é montado',
          description: 'Catálogo, página, XObject de imagem e um fluxo de conteúdo que desenha a imagem preenchendo a página.',
        },
        {
          title: 'Baixe o converted.pdf',
          description: 'Servido da pasta de saída da tarefa até a retenção expirar.',
        },
      ],
      advancedDetails: [
        'O construtor é imageToPDFBytes em pdf_tools.go. Um arquivo que começa com o marcador JPEG FF D8 FF é incorporado como /DCTDecode com /DeviceRGB ou /DeviceGray; um JPEG CMYK cai no caminho de decodificar e achatar, para que o PDF nunca carregue um fluxo CMYK.',
        'Entradas que não são JPEG são decodificadas com os codecs de imagem do Go (PNG e GIF estão registrados). Cada pixel é composto com alfa sobre branco e gravado como três bytes; depois, o buffer inteiro é comprimido com zlib e armazenado com /FlateDecode a 8 bits por componente.',
        'WebP e qualquer outra coisa que o Go não consiga decodificar é rasterizada primeiro pelo ImageMagick com -auto-orient para um fluxo PNG em memória, e esse PNG é então achatado e incorporado.',
        'O tamanho da página em pontos é largura x 72 / 96 e altura x 72 / 96, então uma imagem de 1200 x 1600 gera uma página de 900 x 1200 pontos (12,5 por 16,7 polegadas). Os visualizadores de PDF ajustam a página à janela e as impressoras ajustam ao papel, então uma página grande não é problema para visualizar, mas marque "ajustar à página" ao imprimir.',
        'JPEGs no caminho rápido mantêm o EXIF, incluindo a flag de orientação, mas os visualizadores de PDF não aplicam a orientação EXIF. Uma foto de celular armazenada de lado com uma flag de rotação aparecerá de lado no PDF; converta-a para JPG uma vez antes (o que aplica a orientação automática) e depois para PDF.',
        'O valor de qualidade enviado pelo formulário é aceito, mas não é usado neste caminho, e não há modo de várias imagens: um envio gera um PDF de uma única página.',
      ],
      whyItMatters: [
        'Portais de vistos, universidades e sistemas de RH com frequência aceitam apenas PDF, mesmo para a foto de um recibo.',
        'Um PDF imprime e exibe igual em qualquer dispositivo, enquanto uma imagem solta pode ser girada ou redimensionada pelo visualizador.',
        'Incorporar o JPEG sem alteração significa que o PDF tem qualidade de prova: nada foi recodificado no caminho.',
      ],
      useCases: [
        {
          title: 'Recibos e formulários',
          description: 'Transforme a foto de celular de uma página assinada em um PDF que um portal aceite.',
        },
        {
          title: 'Envio de documentos e identidade',
          description: 'Envie um cartão ou certificado digitalizado como o PDF que o formulário exige.',
        },
        {
          title: 'Provas de arte',
          description: 'Mande ao cliente um PDF de um design PNG com a transparência achatada em branco.',
        },
        {
          title: 'Arquivamento',
          description: 'Guarde uma foto junto de outros documentos em um único formato.',
        },
      ],
      workedExamples: [
        {
          title: 'Um JPEG de celular de 3024 x 4032 (2,9 MB)',
          body: 'Entrada: um JPEG de 2,9 MB, 3024 de largura por 4032 de altura, RGB. O cabeçalho é lido para obter as dimensões e o fluxo JPEG é incorporado como está com /DCTDecode. A página tem 3024 x 0,75 = 2268 pontos de largura e 4032 x 0,75 = 3024 pontos de altura, ou seja, 31,5 por 42 polegadas. O PDF sai com cerca de 2,9 MB mais menos de um kilobyte de estrutura PDF, porque nada é recodificado. O trabalho é ler o arquivo e gravá-lo de volta, então a tarefa depende do disco e da velocidade de envio, não da CPU, e termina em alguns segundos.',
        },
        {
          title: 'Um PNG de 1920 x 1080 com fundo transparente',
          body: 'Entrada: um PNG de 1,4 MB de um logo sobre transparência. O PNG é decodificado, cada pixel é composto sobre branco, e os 1920 x 1080 x 3 = 6.220.800 bytes de RGB são comprimidos com zlib e armazenados com /FlateDecode. A página tem 1440 x 810 pontos (20 por 11,25 polegadas). Como branco liso e cores sólidas comprimem bem com zlib, o PDF costuma ficar na mesma faixa do PNG, às vezes maior, já que o zlib puro não tem os filtros de linha que o PNG usa. Decodificar, compor dois milhões de pixels e comprimi-los é trabalho de CPU que leva alguns segundos; a transparência desaparece no resultado por design.',
        },
      ],
      whenNotToUse: 'Esta não é a ferramenta para um documento de várias páginas: ela gera exatamente uma página a partir de uma imagem, então um conjunto de digitalizações precisa ter cada página convertida e depois unida em um editor de PDF. Não a use quando a transparência precisar sobreviver, porque cada pixel é achatado sobre branco. Não espere um arquivo menor: um JPEG é incorporado sem alteração e um PNG vira RGB comprimido com zlib, então comprima ou redimensione a imagem antes se o tamanho importar. E uma foto cuja orientação correta está apenas em uma flag EXIF deve ser convertida para JPG uma vez antes; caso contrário, o PDF a mostra como foi armazenada.',
      whyMediaManipulator: [
        'A passagem direta do JPEG é uma decisão de design: sua foto é incorporada sem recodificação, algo que muitos conversores não prometem.',
        'Sem Ghostscript e sem política de PDF do ImageMagick no caminho, então a conversão não depende de uma configuração de segurança do servidor que possa recusar PDFs.',
        'Grátis na ferramenta padrão, sem necessidade de conta. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'A imagem é armazenada em uploads/<jobId>/ e o PDF em outputs/<jobId>/converted.pdf no nosso próprio servidor; os dois são excluídos juntos quando a janela de retenção termina. Um JPEG mantém todos os metadados incorporados dentro do PDF porque o fluxo é copiado literalmente, então as tags EXIF de localização e câmera continuam legíveis para quem extrair a imagem; remova-as antes com o removedor de EXIF se isso importar. PNG e outras entradas são decodificadas em pixels brutos, então nenhuma tag é transferida. O envio em si é uma imagem e, portanto, também passa pela análise automática com modelo de visão que roda no nosso servidor, cujo resumo fica com a tarefa. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'A conversão de imagem em PDF é gratuita?',
          answer: 'Sim, na ferramenta padrão. Cada conversão gasta uma operação diária: 5 por dia como visitante, com limite de 200 MB por arquivo; 30 por dia e 1 GB com uma conta gratuita; e 300 ou 700 no Premium ou no Pro, tudo por padrão e listado em /pricing.',
        },
        {
          question: 'A foto é recomprimida dentro do PDF?',
          answer: 'Não, se for um JPEG: os bytes originais são incorporados com /DCTDecode. PNG, GIF e WebP são armazenados sem perdas como RGB comprimido com zlib depois do achatamento, então também não há perda de qualidade ali.',
        },
        {
          question: 'Qual é o tamanho de página do PDF?',
          answer: 'A página corresponde à imagem a 96 pixels por polegada, então a largura e a altura em pontos são 0,75 vez as dimensões em pixels. Uma imagem de 1200 x 1600 gera uma página de 12,5 por 16,7 polegadas; visualizadores e impressoras a ajustam para caber.',
        },
        {
          question: 'Posso juntar várias imagens em um PDF?',
          answer: 'Não nesta página. Cada envio produz um PDF de uma página. Converta cada imagem e una os PDFs resultantes em um editor de PDF.',
        },
        {
          question: 'O que acontece com a transparência?',
          answer: 'Ela é achatada sobre branco. Os XObjects de imagem do PDF neste caminho não têm alfa, então os pixels transparentes viram pixels brancos.',
        },
        {
          question: 'Por que minha foto de celular está de lado no PDF?',
          answer: 'Os celulares costumam armazenar os pixels em paisagem e definir uma flag de orientação EXIF. O JPEG é incorporado sem alteração e os visualizadores de PDF ignoram essa flag. Passe a foto pelo conversor de imagens como JPG primeiro, o que aplica a orientação automática, e depois converta o resultado em PDF.',
        },
        {
          question: 'O PDF mantém meus dados EXIF?',
          answer: 'Para um JPEG, sim, porque o fluxo JPEG inteiro, incluindo o EXIF, está dentro do PDF. Use o removedor de EXIF antes se não quiser isso. Para PNG e outras entradas, só os pixels são mantidos.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A saída é um PDF de uma única página. A transparência é achatada sobre branco porque as páginas de PDF são opacas.',
        ],
      },
      related: [
        {
          label: 'PDF para JPG',
          to: '/tools/pdf-to-jpg',
          description: 'Renderize páginas de PDF de volta em imagens.',
        },
        {
          label: 'Remover metadados EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Remova as tags antes que elas sejam incorporadas ao PDF.',
        },
        {
          label: 'Comprimir imagem',
          to: '/tools/compress-image',
          description: 'Reduza o JPEG antes, já que o PDF o incorpora como está.',
        },
        {
          label: 'Digitalização de documentos com IA',
          to: '/tools/ai-document-scan',
          description: 'Limpe e faça OCR de uma página fotografada em vez de apenas envolvê-la.',
        },
        {
          label: 'Redimensionar imagem',
          to: '/tools/image-resizer',
          description: 'Defina o tamanho em pixels, e portanto o tamanho da página, antes.',
        },
      ],
      embed: {
        title: 'Converter uma imagem em PDF',
        description: 'Envie qualquer imagem: JPG, PNG e mais. A saída é fixada em PDF nesta ferramenta, então você recebe um PDF de uma única página envolvendo sua imagem na resolução nativa.',
      },
    },
    'pdf-to-jpg': {
      name: 'PDF para JPG',
      h1: 'Converter PDF em JPG online grátis',
      tagline: 'Converta cada página de um PDF em imagens JPG de alta qualidade para compartilhar, editar ou publicar.',
      metaTitle: 'Converter PDF em JPG online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de PDF para JPG. Converta cada página de um PDF em imagens JPG de alta qualidade, baixadas em um ZIP. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter PDF em JPG online grátis',
      ogDescription: 'Renderize todas as páginas de um PDF em imagens JPG de alta qualidade. Grátis, rápido, sem cadastro.',
      intro: 'Envie um PDF e nosso servidor renderiza cada página com o pdftoppm, do conjunto de ferramentas Poppler, o mesmo rasterizador usado por muitos visualizadores de PDF para desktop. O formulário desta página vem predefinido com JPG, todas as páginas e 150 DPI; você pode mudar o DPI para 100, 200 ou 300, limitar a tarefa à primeira página e definir a qualidade JPEG, que por padrão é 90. Com todas as páginas selecionadas, você recebe um ZIP contendo page-001.jpg, page-002.jpg e assim por diante; com só a primeira página, você recebe um único JPG. Antes de renderizar, o pdfinfo conta as páginas e a tarefa é recusada se houver mais de 500.',
      whatItDoes: [
        'Rasteriza todas as páginas, ou só a primeira, em JPG na resolução que você escolher.',
        'Empacota a saída de várias páginas em um único ZIP com nomes de arquivo ordenáveis, com zeros à esquerda.',
        'Usa a qualidade JPEG que você definir (90 por padrão) em todas as páginas.',
        'Lê a contagem de páginas primeiro, para que um documento grande demais falhe antes de qualquer renderização.',
        'Mantém os PDFs fora da análise automática de imagens, que só roda em envios de imagem, vídeo e áudio.',
      ],
      flowSteps: [
        {
          title: 'Envie um PDF',
          description: 'Qualquer .pdf até o seu limite por arquivo; a contagem de páginas deve ser de 500 ou menos.',
        },
        {
          title: 'Escolha páginas, DPI e qualidade',
          description: 'Todas as páginas ou só a primeira; 100, 150, 200 ou 300 DPI; qualidade JPEG de 1 a 100.',
        },
        {
          title: 'O pdftoppm renderiza',
          description: 'pdftoppm -r <dpi> -jpeg -jpegopt quality=<q> [-f 1 -l 1] input page',
        },
        {
          title: 'Baixe',
          description: 'converted.jpg para uma única página, converted.zip para todas as páginas.',
        },
      ],
      advancedDetails: [
        'O renderizador é convertPDFToImages em pdf_tools.go. Ele chama o pdfinfo para contar as páginas, recusa mais de 500 páginas e então roda o pdftoppm com -r para o DPI, -jpeg e -jpegopt quality=N para a saída em JPG, e -f 1 -l 1 quando só a primeira página é desejada.',
        'O servidor limita o DPI ao intervalo de 50 a 400 e a qualidade de 1 a 100, independentemente do que o formulário enviar; o formulário em si oferece 100, 150, 200 e 300.',
        'O pdftoppm grava um arquivo por página; o servidor os renomeia para page-001.jpg, page-002.jpg e assim por diante (três dígitos, com zeros à esquerda) e os compacta em ZIP, então os arquivos ficam em ordem de página em qualquer gerenciador de arquivos.',
        'As dimensões em pixels decorrem diretamente do DPI: uma página US Letter (8,5 x 11 pol) tem 1275 x 1650 pixels a 150 DPI e 2550 x 3300 a 300; uma página A4 (8,27 x 11,69 pol) tem 1240 x 1754 a 150 e 2480 x 3508 a 300.',
        'Um PDF que é em si um scan é rasterizado de novo: se o scan incorporado tinha 300 DPI e você renderiza a 150, cada página sai com metade da resolução linear do scan. Escolha 300 para manter o que o scan tinha.',
        'A variante PNG desta ferramenta usa o mesmo renderizador com -png e sem opção de qualidade; JPG é a escolha certa para páginas fotográficas ou digitalizadas, e PNG para páginas com texto nítido e cores chapadas, onde o ringing do JPEG apareceria.',
      ],
      whyItMatters: [
        'Muitas ferramentas e plataformas aceitam imagens, mas não PDFs: apresentações, posts em redes sociais, apps de chat e editores de imagem.',
        'Uma página renderizada é um retrato fiel do layout, das fontes e dos gráficos vetoriais, sem nada para incorporar ou refluir.',
        'Escolher o DPI por conta própria significa decidir entre uma prévia rápida e uma exportação em resolução de impressão.',
      ],
      useCases: [
        {
          title: 'Slides e posts em redes sociais',
          description: 'Renderize a página de um relatório ou um pôster em uma imagem que você pode publicar ou colocar em uma apresentação.',
        },
        {
          title: 'Miniaturas e prévias',
          description: 'Renderize só a primeira página a 100 DPI para uma imagem de capa.',
        },
        {
          title: 'Anotações em um editor',
          description: 'Abra uma página em um editor de imagens para anotar, censurar ou recortar.',
        },
        {
          title: 'Extração de scans',
          description: 'Recupere cada página digitalizada de um PDF como um JPG separado na resolução original.',
        },
      ],
      workedExamples: [
        {
          title: 'Um relatório A4 de 12 páginas, todas as páginas a 150 DPI',
          body: 'Entrada: um PDF A4 de 12 páginas e 1,8 MB, com texto e alguns gráficos. Configurações mantidas no padrão: JPG, todas as páginas, 150 DPI, qualidade 90. O pdfinfo informa 12 páginas, abaixo do limite de 500, e o pdftoppm roda -r 150 -jpeg -jpegopt quality=90. Cada página é renderizada a 8,27 x 150 por 11,69 x 150, ou seja, 1240 x 1754 pixels (2,2 megapixels). Os doze arquivos são renomeados de page-001.jpg a page-012.jpg e compactados em converted.zip. A renderização é por página e dominada pela quantidade de conteúdo vetorial e texto de cada uma; uma dúzia de páginas de texto leva alguns segundos no total. O tamanho do JPEG de cada página depende do conteúdo: páginas de texto majoritariamente brancas comprimem muito melhor do que um gráfico que ocupa a página inteira.',
        },
        {
          title: 'Só a primeira página de um scan US Letter a 300 DPI',
          body: 'Entrada: um contrato digitalizado de 40 páginas, tamanho Letter, 28 MB. Escolha só a primeira página e 300 DPI, mantendo a qualidade 90. O servidor roda pdftoppm -r 300 -jpeg -jpegopt quality=90 -f 1 -l 1, então só uma página é rasterizada, a 8,5 x 300 por 11 x 300 = 2550 x 3300 pixels (8,4 megapixels). A saída é um único converted.jpg, não um ZIP. Renderizar uma página digitalizada é rápido porque a página é uma única imagem incorporada; o envio de 28 MB demora mais que a renderização. A 150 DPI a mesma página teria 1275 x 1650, um quarto dos pixels, o que basta para leitura em tela, mas não para reimprimir o scan.',
        },
      ],
      whenNotToUse: 'Não renderize um PDF em JPG quando precisar que o texto continue selecionável ou pesquisável: o resultado são pixels, e um leitor de tela ou um índice de busca não recebe nada. Não use JPG para páginas que são principalmente texto nítido e desenhos de linha se você for dar zoom, já que a compressão JPEG deixa um leve ringing ao redor das bordas; a variante PNG é mais limpa nesses casos. Documentos com mais de 500 páginas são recusados de imediato, e um DPI muito alto em um documento longo produz um ZIP grande, então renderize só as páginas de que você realmente precisa. E se o objetivo é editar o conteúdo do PDF, e não retratá-lo, um editor de PDF é a ferramenta certa.',
      whyMediaManipulator: [
        'Renderização com Poppler com os controles reais de DPI e qualidade expostos, e não um tamanho de prévia fixo.',
        'Um único ZIP com nomes de arquivo numerados por página, em vez de uma pilha de downloads.',
        'Sem cadastro na ferramenta padrão. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'Seu PDF é armazenado em uploads/<jobId>/ no nosso servidor e os JPGs renderizados, ou o ZIP deles, em outputs/<jobId>/; as páginas são renderizadas em um diretório temporário dentro da pasta de saída, que é removido assim que o ZIP é gravado. Envios de PDF são detectados como documentos e não passam pela análise automática de visão que os envios de imagem, vídeo e áudio recebem. O Poppler roda inteiramente na nossa máquina, e nenhuma página é enviada a qualquer serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'A conversão de PDF em JPG é gratuita?',
          answer: 'Sim, na ferramenta padrão. Um PDF, não importa quantas páginas, é uma operação diária: 5 por dia como visitante, com limite de 200 MB por arquivo; 30 por dia e 1 GB com uma conta gratuita; 300 no Premium e 700 no Pro, tudo por padrão e exibido em /pricing.',
        },
        {
          question: 'Quantas imagens vou receber?',
          answer: 'Uma por página quando todas as páginas estiverem selecionadas, entregues como converted.zip com arquivos nomeados a partir de page-001.jpg. Com só a primeira página, você recebe um único converted.jpg e nenhum ZIP.',
        },
        {
          question: 'Qual DPI devo escolher?',
          answer: '150 para ler na tela e compartilhar (1240 x 1754 para A4). 300 para impressão ou para scans feitos a 300 (2480 x 3508 para A4). 100 para prévias pequenas. O servidor aceita de 50 a 400.',
        },
        {
          question: 'O que a configuração de qualidade faz?',
          answer: 'Ela é passada ao pdftoppm como -jpegopt quality=N, a escala padrão de qualidade JPEG. 90 é o padrão; reduza para arquivos menores em páginas com muitas fotos.',
        },
        {
          question: 'Existe limite de páginas?',
          answer: 'Sim, 500 páginas. O pdfinfo as conta antes de a renderização começar, e um documento mais longo é recusado com uma mensagem informando a contagem e o limite, e a operação é reembolsada.',
        },
        {
          question: 'O texto na imagem será pesquisável?',
          answer: 'Não. A saída é uma imagem rasterizada de cada página. Se você precisa do texto, mantenha o PDF ou use a ferramenta de digitalização de documentos com IA, que faz OCR em uma página fotografada.',
        },
        {
          question: 'Posso receber PNG em vez de JPG?',
          answer: 'Esta página fixa o formato em JPG. O mesmo renderizador produz PNG pela página PDF para PNG, que usa -png e não tem configuração de qualidade.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A saída de todas as páginas é entregue como um .zip; a saída da primeira página é um único .jpg.',
          'A resolução de renderização padrão é 150 DPI; aumente-a para uma saída com qualidade de impressão.',
        ],
      },
      related: [
        {
          label: 'Imagem para PDF',
          to: '/tools/image-to-pdf',
          description: 'Faça o caminho inverso: envolva uma imagem em uma página de PDF.',
        },
        {
          label: 'Comprimir imagem',
          to: '/tools/compress-image',
          description: 'Reduza os JPGs renderizados para a web.',
        },
        {
          label: 'Redimensionar imagem',
          to: '/tools/image-resizer',
          description: 'Ajuste uma página renderizada ao tamanho de uma miniatura ou de um banner.',
        },
        {
          label: 'Digitalização de documentos com IA',
          to: '/tools/ai-document-scan',
          description: 'Faça OCR e limpe uma página fotografada.',
        },
        {
          label: 'Ocultar texto em imagem',
          to: '/tools/redact-text-in-image',
          description: 'Tarje nomes ou números em uma página renderizada.',
        },
      ],
      embed: {
        title: 'Converter PDF em JPG',
        description: 'Envie um PDF. Cada página é renderizada em uma imagem JPG. Escolha "todas as páginas" para um ZIP de imagens ou "só a primeira página" para um único JPG. Escolha um DPI de renderização para uma saída mais nítida.',
      },
    },
    'compress-video': {
      name: 'Comprimir vídeo',
      h1: 'Comprimir vídeo online sem arruinar a qualidade',
      tagline: 'Reduza o tamanho de arquivos MP4, WebM, MOV, MKV e AVI para web, e-mail, redes sociais e envios para a nuvem.',
      metaTitle: 'Comprimir vídeo online (grátis) | Media Manipulator',
      metaDescription: 'Compressor de vídeo online gratuito. Reduza o tamanho de arquivos MP4, WebM, MOV, MKV e AVI mantendo boa qualidade. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Comprimir vídeo online sem arruinar a qualidade',
      ogDescription: 'Reduza arquivos de vídeo MP4, WebM, MOV e AVI para a web sem perder qualidade de visualização.',
      intro: 'Um arquivo de vídeo é grande por causa da taxa de bits: quantos bits o codificador gastou por segundo de filmagem. Celulares e gravadores de tela gastam com generosidade, e é por isso que um clipe curto em 1080p pode chegar a dezenas ou centenas de megabytes. Esta página abre um compressor de três controles em vez do conversor completo: um nível de compactação, um contêiner de saída e, opcionalmente, resolução e codec. No nosso servidor, o trabalho é um único comando do FFmpeg que recodifica a imagem em uma configuração de qualidade constante (CRF) escolhida pelo nível, recodifica o áudio para AAC ou Opus e grava o resultado com o índice no início do arquivo, para que ele comece a tocar antes de ser baixado por completo.',
      whatItDoes: [
        'Recodifica o vídeo em um nível de qualidade fixo, e não em uma taxa de bits fixa: Menor arquivo é CRF 31, Equilibrado é CRF 26 e Alta qualidade é CRF 22.',
        'Gera MP4 (H.264 por padrão, ou H.265/HEVC quando você escolhe) ou WebM (VP9 com áudio Opus).',
        'Opcionalmente reduz a imagem para 1080p, 720p ou 480p na mesma passagem, mantendo a proporção.',
        'Opcionalmente descarta a faixa de áudio por completo para obter o menor arquivo possível.',
        'Aceita envios em MP4, MOV, M4V, WebM, MKV, AVI, FLV, WMV, MPEG e MPG; a página do conversor completo cuida de ProRes e outros formatos de edição.',
      ],
      flowSteps: [
        {
          title: 'Envie o vídeo',
          description: 'O navegador coloca o arquivo direto no nosso bucket de armazenamento e depois pede à API para iniciar o trabalho.',
        },
        {
          title: 'Escolha um nível',
          description: 'Equilibrado vem pré-selecionado. Menor arquivo troca detalhe visível por tamanho; Alta qualidade preserva mais detalhe.',
        },
        {
          title: 'Se quiser, altere formato, resolução ou codec',
          description: 'MP4 com H.264 toca em qualquer lugar; H.265 e WebM são menores nos dispositivos que os decodificam.',
        },
        {
          title: 'O FFmpeg recodifica',
          description: 'libx264, libx265 ou libvpx-vp9 com o CRF do seu nível, mais áudio AAC ou Opus e faststart para MP4.',
        },
        {
          title: 'Baixe o arquivo menor',
          description: 'O resultado fica na pasta do trabalho até o fim da janela de retenção.',
        },
      ],
      advancedDetails: [
        'O comando exato para MP4 é ffmpeg -i input [-vf scale=-1:H] -c:v libx264 -crf N -pix_fmt yuv420p -movflags +faststart -c:a aac output.mp4, em que N é 31, 26 ou 22 para os três níveis (buildVideoCodecArgs e videoCRF em converter.go). Nenhuma predefinição de velocidade do codificador é passada, então o libx264 roda no padrão, medium.',
        'Escolher H.265 troca o codificador por libx265 e adiciona -tag:v hvc1, a tag de que o QuickTime e o Safari precisam para reconhecer HEVC dentro de MP4. Celulares Android mais antigos, smart TVs e muitos players web não conseguem decodificar H.265.',
        'A saída em WebM roda libvpx-vp9 com -b:v 0 -crf N e áudio Opus; se a compilação do FFmpeg no servidor não tivesse VP9 ou Opus, ela cairia para VP8 e Vorbis. O mesmo N é passado, mas o VP9 lê o CRF em uma escala de 0 a 63, então 26 é uma configuração de qualidade relativamente alta ali.',
        'Uma escolha de resolução vira scale=-1:1080, scale=-1:720 ou scale=-1:480: altura fixa, largura calculada a partir da proporção da origem. A altura é aplicada como foi dada, então escolher 1080p para uma origem em 720p amplia a imagem e deixa o arquivo maior, não menor; escolha uma altura igual ou inferior à da origem.',
        'Remover a faixa de áudio adiciona -an. Caso contrário, o áudio é recodificado pelo codificador AAC nativo do FFmpeg na taxa de bits padrão (nenhum -b:a é passado; para estéreo, normalmente cerca de 128 kbps), que é uma fração pequena do arquivo em qualquer nível.',
        'A compressão é guiada por CRF, então o tamanho da saída segue o conteúdo: slides estáticos comprimem muito mais do que confete ou água. O servidor valida o CRF entre 0 e 51 e o nível de compactação como um dos três nomes antes de qualquer codificação começar.',
        'O envio também entra na fila da análise de conteúdo automatizada que toda conversão padrão recebe: quadros são amostrados e descritos por um modelo de visão local, e o áudio é transcrito no nosso próprio hardware. O resultado da análise é armazenado com o trabalho, não compartilhado.',
      ],
      whyItMatters: [
        'Aplicativos de chat, servidores de e-mail e plataformas de ensino impõem limites em megabytes, e um clipe de celular na taxa de bits nativa estoura todos eles.',
        'Uma página que reproduz automaticamente um vídeo de fundo de 60 MB trava em conexões móveis; o mesmo clipe em CRF 26 é uma fração disso.',
        'As contas de armazenamento e de banda crescem com os bytes, então manter cópias comprimidas de originais que você raramente abre faz diferença rápido.',
      ],
      useCases: [
        {
          title: 'E-mail e chat',
          description: 'Coloque uma gravação de celular de 1 minuto abaixo de um limite de 25 MB ou 100 MB sem precisar de um link de compartilhamento separado.',
        },
        {
          title: 'Loops de destaque e de fundo em sites',
          description: 'Codifique um WebM ou um MP4 H.264 que uma página possa reproduzir automaticamente sem um buffer longo.',
        },
        {
          title: 'Gravações de cursos e reuniões',
          description: 'Reduza gravações de tela cujos slides estáticos comprimem extremamente bem em qualquer CRF.',
        },
        {
          title: 'Cópias de arquivo',
          description: 'Guarde uma cópia Equilibrado em 720p de originais longos e mova o master para o armazenamento frio.',
        },
      ],
      workedExamples: [
        {
          title: 'Um clipe de celular de 48 MB, 30 segundos e 1080p no nível Equilibrado',
          body: 'Entrada: um MP4 de 30 segundos de um celular, 1920 x 1080, 48 MB, o que dá cerca de 12,8 Mbps. Configurações: Equilibrado, MP4, H.264, resolução mantida, áudio mantido. O servidor roda libx264 em CRF 26 com yuv420p e faststart e recodifica o áudio para AAC a 128 kbps, então só a faixa de som são cerca de 0,5 MB do resultado (128 kbps x 30 s). Todo o resto é decidido pela imagem: CRF 26 abre mão primeiro do grão fino e do ruído, então uma tomada estável de câmera na mão sai como uma fração pequena da origem de 12,8 Mbps, enquanto ação rápida ou ruído pesado de câmera encolhem menos. A codificação é uma única passagem por 900 quadros em 1080p com a predefinição padrão medium; no nosso servidor, é um trabalho curto, e o envio de 48 MB costuma dominar a espera.',
        },
        {
          title: 'Um clipe 4K de 160 MB e 60 segundos para 720p H.265 no nível Menor arquivo',
          body: 'Entrada: um MP4 de 60 segundos em 3840 x 2160, com 160 MB, cerca de 21 Mbps, dentro do limite de 200 MB para visitantes. Configurações: Menor arquivo, MP4, codec H.265, resolução 720p, áudio removido. O FFmpeg aplica scale=-1:720, que produz 1280 x 720: 0,92 megapixel por quadro contra 8,3 da origem, aproximadamente um nono dos pixels antes que o codec faça qualquer coisa. Depois o libx265 roda em CRF 31 com -tag:v hvc1, e -an descarta o áudio. A combinação de nove vezes menos pixels, um codec mais eficiente e um CRF alto é de onde vêm as maiores reduções, então espere um resultado medido em poucos megabytes, não em dezenas. O tempo é dominado pela decodificação dos quadros 4K e pelo libx265, que é visivelmente mais lento que o libx264 na mesma predefinição, então este trabalho leva mais tempo que o exemplo em 1080p mesmo com a saída menor.',
        },
      ],
      whenNotToUse: 'Não comprima um arquivo que você ainda pretende editar ou corrigir a cor; toda recodificação perde detalhe, e um editor quer o original ou um intermediário ProRes do conversor completo. Não use para fazer um clipe tocar em um dispositivo específico se o problema é o contêiner, não o tamanho; o conversor de vídeo muda formatos sem reduzir a qualidade. Se o seu único objetivo é recortar um trecho, o cortador copia os fluxos sem recodificar e é mais rápido e sem perdas. E se o arquivo é grande porque é longo, a compressão ajuda menos do que você espera; uma gravação de 20 minutos em CRF 26 continua sendo uma gravação de 20 minutos.',
      whyMediaManipulator: [
        'O CRF por trás de cada nível está escrito nesta página, então você pode prever o que Menor arquivo vai fazer com uma filmagem detalhada antes de esperar por ela.',
        'O H.265 em MP4 recebe a tag hvc1 que os players da Apple exigem, algo que muitos compressores online esquecem.',
        'A codificação roda nos nossos próprios servidores com o FFmpeg; nada é entregue a um serviço de processamento externo, e nenhuma marca d\'água é adicionada.',
        'Uma compressão conta como uma operação da sua cota diária: 5 por dia sem conta por padrão, 30 com uma conta gratuita. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'O compressor recodifica seu vídeo nos nossos próprios servidores com o FFmpeg. O envio é armazenado em uploads/<jobId>/ e o arquivo comprimido em outputs/<jobId>/; ambos estão no registro de retenção e são excluídos quando a janela termina. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Como se trata de uma conversão padrão, o envio também passa pela nossa análise de conteúdo automatizada no mesmo hardware (quadros amostrados descritos por um modelo de visão local, áudio transcrito localmente); esse relatório fica com o trabalho e não é compartilhado com terceiros. Os metadados do contêiner são mantidos, a menos que você escolha removê-los; nada é enviado a um provedor externo de IA ou de processamento.',
      faq: [
        {
          question: 'Comprimir vai deixar meu vídeo pior?',
          answer: 'Algum detalhe sempre se perde em uma recodificação. Em Alta qualidade (CRF 22) e Equilibrado (CRF 26), a perda fica principalmente no grão fino e no ruído que a maioria dos espectadores não nota; em Menor arquivo (CRF 31), dá para ver uma suavização em filmagens detalhadas. Manter a resolução evita o desfoque que a redução de escala acrescenta.',
        },
        {
          question: 'Devo escolher H.264, H.265 ou WebM?',
          answer: 'MP4 H.264 toca em tudo, inclusive TVs antigas e notebooks corporativos. O H.265 dá um arquivo menor no mesmo CRF, mas precisa de um dispositivo que decodifique HEVC; nós o marcamos como hvc1 para que os players da Apple o aceitem. WebM (VP9 e Opus) é a escolha para páginas web em que você controla o player.',
        },
        {
          question: 'Quanto menor o arquivo vai ficar?',
          answer: 'Depende da taxa de bits da origem e do conteúdo. Um clipe de celular a 12 Mbps tem muita folga e encolhe drasticamente em CRF 26; um arquivo que já foi codificado em uma taxa de bits modesta encolhe pouco, porque o CRF gasta o que a imagem precisa. Baixar para 720p e remover o áudio sempre ajudam.',
        },
        {
          question: 'O compressor adiciona marca d\'água ou altera a taxa de quadros?',
          answer: 'Não. A taxa de quadros, a duração e a proporção são preservadas, e nada é desenhado sobre a imagem. Só mudam o codec, o CRF, a altura opcional e a remoção opcional do áudio.',
        },
        {
          question: 'Comprimir um vídeo é gratuito, e quais são os limites?',
          answer: 'Por padrão, um visitante tem 5 operações por dia com arquivos de até 200 MB e 5 minutos de vídeo, com saída de até 1080p; uma conta gratuita aumenta isso para 30 por dia, 1 GB e 20 minutos. Uma compressão que falha é reembolsada. Os números atuais estão na página de preços.',
        },
        {
          question: 'Por que a saída não ficou menor que o original?',
          answer: 'A origem provavelmente já estava comprimida de forma eficiente, ou está em uma taxa de bits baixa para a resolução. O CRF não consegue ir abaixo do que a imagem exige sem um nível mais baixo. Tente Menor arquivo, ou reduza a resolução, ou mude para H.265.',
        },
        {
          question: 'Posso comprimir um vídeo sem áudio ou manter o áudio original intocado?',
          answer: 'Uma origem muda continua muda. O áudio de uma faixa mantida é sempre recodificado para AAC (MP4) ou Opus (WebM) por esta página; o conversor de vídeo completo é onde você define uma taxa de bits de áudio explícita.',
        },
      ],
      related: [
        {
          label: 'Cortar vídeo',
          to: '/tools/video-trimmer',
          description: 'Corte o clipe primeiro; assim o compressor tem menos para codificar.',
        },
        {
          label: 'Converter vídeo em GIF animado',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Para clipes de poucos segundos, o GIF é o formato que toca inline.',
        },
        {
          label: 'Transcodificar para HLS',
          to: '/tools/transcode-to-hls',
          description: 'Empacote um vídeo como um stream adaptativo em vez de um único arquivo.',
        },
        {
          label: 'Extrair áudio de vídeo',
          to: '/tools/extract-audio-from-video',
          description: 'Fique só com a faixa de som em MP3, WAV ou FLAC.',
        },
        {
          label: 'Transcrever vídeo',
          to: '/tools/transcribe-video',
          description: 'Obtenha a fala em texto antes ou depois de comprimir.',
        },
        {
          label: 'Tutorial do conversor de vídeo',
          to: '/tutorials/video/getting-started',
          description: 'Passo a passo de cada opção de vídeo.',
        },
      ],
      embed: {
        title: 'Comprimir um vídeo',
        description: 'Envie um vídeo e escolha uma predefinição de qualidade menor ou uma taxa de bits mais baixa. Mantenha o mesmo codec para o resultado mais rápido, ou mude para WebM/H.265 para arquivos menores em dispositivos modernos. Manter a mesma resolução dá o resultado de aparência mais natural.',
      },
    },
    'video-trimmer': {
      name: 'Cortar vídeo',
      h1: 'Cortar vídeo online grátis',
      tagline: 'Corte um clipe para ficar só com a parte que você quer, com um corte rápido que preserva a qualidade, sem recodificar quando possível.',
      metaTitle: 'Cortar vídeo online grátis | Media Manipulator',
      metaDescription: 'Cortador de vídeo online gratuito. Defina um tempo de início e de fim e corte seu clipe de forma rápida e sem perdas. Saída em MP4, sem marca d\'água e sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Cortar vídeo online grátis',
      ogDescription: 'Corte vídeos para ficar só com a parte que você quer, com um corte rápido que preserva a qualidade. Grátis, sem marca d\'água.',
      intro: 'Cortar um vídeo mantém um trecho dele e descarta o resto. A maioria dos cortadores online recodifica o clipe inteiro para fazer isso, o que é lento e custa qualidade. Esta página faz algo mais simples por padrão: pede ao FFmpeg que vá até o seu tempo de início e copie os pacotes comprimidos de vídeo e áudio para um arquivo novo pela duração pedida, sem decodificá-los. Isso é uma cópia de stream, é sem perdas e roda quase na velocidade em que o arquivo pode ser lido. Se a cópia não puder funcionar, porque o codec de origem não é permitido no contêiner que você escolheu ou porque você marcou a opção de precisão por quadro, o servidor recodifica apenas o trecho selecionado.',
      whatItDoes: [
        'Recorta um único intervalo de um vídeo, de um tempo de início a um tempo de fim, digitado em segundos ou escolhido em uma linha do tempo visual.',
        'Copia os streams sem recodificar sempre que o contêiner de saída aceita os codecs de origem, então a parte mantida é idêntica ao original, bit a bit.',
        'Recorre automaticamente a uma recodificação quando a cópia é recusada e permite forçar a recodificação para um corte no quadro exato.',
        'Grava MP4 por padrão, ou MOV ou WebM; MP4 e MOV recebem a flag faststart para que a reprodução comece antes de o download terminar.',
        'Verifica com o ffprobe se o arquivo realmente tem um stream de vídeo e recusa envios só de áudio com uma mensagem clara.',
      ],
      flowSteps: [
        {
          title: 'Envie o vídeo',
          description: 'MP4, MOV, M4V, WebM, MKV, AVI, FLV, WMV, MPEG ou MPG, enviados direto para o nosso bucket de armazenamento.',
        },
        {
          title: 'Defina início e fim',
          description: 'Digite os segundos ou arraste as duas alças; o painel mostra a duração resultante do clipe.',
        },
        {
          title: 'Escolha um contêiner e, se precisar, a precisão por quadro',
          description: 'O MP4 vem predefinido. Marque Recodificar para um corte preciso por quadro só quando o quadro exato importar.',
        },
        {
          title: 'O FFmpeg corta',
          description: 'Uma cópia de stream com -ss, -t e -c copy; ou uma recodificação libx264 CRF 18 quando copiar é impossível ou quando você pediu.',
        },
        {
          title: 'Baixe o clipe',
          description: 'A saída recebe o sufixo _trimmed e fica na pasta do trabalho até o fim do período de retenção.',
        },
      ],
      advancedDetails: [
        'O comando de cópia de stream é ffmpeg -ss START -i input -t DURATION -map 0 -c copy -avoid_negative_ts make_zero [-movflags +faststart] output (runTrimVideo em specialized_tools.go). -map 0 mantém todos os streams, inclusive faixas de áudio extras e legendas, e os tempos são escritos com precisão de milissegundos.',
        'Com -ss antes de -i e sem decodificação, o FFmpeg só consegue começar em um keyframe, então a cópia começa no keyframe mais próximo no seu tempo de início ou antes dele. Em uma gravação de celular, os keyframes costumam estar separados por 1 a 2 segundos, que é o máximo que o início pode se deslocar; -avoid_negative_ts make_zero então rebaseia os carimbos de tempo para que os players comecem sem problemas.',
        'O caminho de recodificação usa buildVideoCodecArgs na configuração de qualidade alta: libx264 -crf 18 -pix_fmt yuv420p com AAC para MP4 e MOV, ou libvpx-vp9 -b:v 0 -crf 18 com Opus para WebM. Só o primeiro stream de vídeo e o primeiro stream de áudio (se houver) são mapeados, então as faixas extras são descartadas nesse caminho.',
        'O modo de cópia é enviado como auto, que tenta a cópia e recodifica em caso de falha. Escolher WebM para uma fonte H.264 sempre acaba no caminho de recodificação, porque o WebM só aceita vídeo VP8, VP9 e AV1.',
        'Validação no servidor: o início deve ser 0 ou mais, o clipe deve ter pelo menos 0,1 segundo e no máximo 6 horas, e o fim deve vir depois do início. Qualquer outra coisa é rejeitada antes de o FFmpeg começar, e a operação é reembolsada.',
        'Como o corte é um modo especializado, o envio pula a análise automática de conteúdo que as conversões padrão recebem; o servidor só roda o ffprobe e o corte.',
      ],
      whyItMatters: [
        'Um silêncio no começo e uma parada atrapalhada no fim estão em quase toda gravação, e removê-los é a edição mais comum de todas.',
        'Um corte sem perdas significa que você pode cortar um arquivo master sem criar uma cópia de segunda geração.',
        'Cortar primeiro torna cada etapa seguinte mais barata: comprimir, legendar ou transformar o clipe em GIF só precisa tocar a parte que você manteve.',
      ],
      useCases: [
        {
          title: 'Gravações de reuniões e aulas',
          description: 'Elimine os minutos de gente entrando antes de o conteúdo começar.',
        },
        {
          title: 'Destaques para redes sociais',
          description: 'Fique com os 20 segundos que importam e envie só eles.',
        },
        {
          title: 'Provas e relatórios de bugs',
          description: 'Compartilhe exatamente o momento em que um problema aconteceu, com a qualidade original intacta.',
        },
        {
          title: 'Preparar um GIF ou um trecho para restauração',
          description: 'Corte para alguns segundos antes de entregar o clipe a uma ferramenta que funciona melhor com entradas curtas.',
        },
      ],
      workedExamples: [
        {
          title: 'Um corte por cópia de stream de 30 segundos de um MP4 1080p de 180 MB e 4,5 minutos',
          body: 'Entrada: um MP4 H.264 de 1920 x 1080 com 4 minutos e 30 segundos e 180 MB, cerca de 5,3 Mbps, que cabe nos limites padrão de 200 MB e 5 minutos para visitantes. Configurações: início 45.000, fim 75.000, saída MP4, recodificação desmarcada. O servidor roda o comando de cópia com -ss 45.000 e -t 30.000. Como os pacotes são copiados, a saída contém cerca de 30 dos 270 segundos de dados, uns 20 MB, exatamente na qualidade, no codec e na taxa de quadros originais. O corte começa no último keyframe antes de 45 s, então o clipe pode abrir até um ou dois segundos mais cedo. O trabalho é limitado pela leitura do arquivo, não pelo processamento, e termina em poucos segundos.',
        },
        {
          title: 'Um corte preciso por quadro de 12 segundos de um MP4 1080p de 60 MB',
          body: 'Entrada: um MP4 de 1920 x 1080 com 2 minutos e 60 MB. Configurações: início 30.250, fim 42.250, saída MP4, Recodificar para um corte preciso por quadro marcado. Agora o FFmpeg decodifica exatamente a partir de 30.250, codifica 12 segundos (360 quadros a 30 fps) com libx264 em CRF 18, yuv420p e faststart, e recodifica o áudio em AAC. O CRF 18 mantém a imagem visualmente muito próxima da fonte, então o resultado fica na mesma ordem de tamanho por segundo que a fonte, alguns megabytes para 12 segundos. Só os 12 segundos mantidos são codificados, nunca os 2 minutos completos, então isso é uma codificação curta, e não uma cópia de poucos segundos.',
        },
      ],
      whenNotToUse: 'Não use o cortador para remover vários trechos separados de um mesmo vídeo; ele mantém exatamente um intervalo, então um corte no meio exige dois cortes e uma junção no Darkroom. Não espere que uma cópia de stream caia no quadro exato; se um corte um segundo mais cedo faz diferença, marque a opção de recodificar e aceite uma codificação curta. Se o seu objetivo real é um arquivo menor, cortar só ajuda na medida do que você corta; é o compressor que muda a taxa de bits. E se o envio não tem stream de vídeo, por exemplo um M4A renomeado para MP4, o cortador o recusa; as ferramentas de áudio cuidam de arquivos só de áudio.',
      whyMediaManipulator: [
        'A cópia de stream sem perdas é o padrão, com o fallback de recodificação documentado em vez de escondido atrás de uma recodificação lenta, mas segura, de tudo.',
        'As flags exatas do FFmpeg estão nesta página, inclusive por que um corte pode começar no keyframe anterior e como evitar isso.',
        'Um corte gasta uma operação da sua cota diária (5 por dia como visitante por padrão, 30 com uma conta gratuita), e um trabalho que falha é reembolsado. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'O cortador roda o ffprobe e um comando do FFmpeg nos nossos próprios servidores. No caminho padrão, os pacotes de vídeo e áudio são copiados, nunca decodificados, então o servidor não reconstrói uma única imagem do seu arquivo; no caminho de recodificação, o FFmpeg decodifica só os segundos que você manteve. O envio fica em uploads/<jobId>/ e o clipe em outputs/<jobId>/, ambos registrados no livro de retenção e excluídos quando o período termina. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O corte é um modo especializado, então a análise automática de conteúdo que as conversões padrão recebem não é executada neste envio, e nada é enviado a um serviço de terceiros.',
      faq: [
        {
          question: 'Cortar recodifica meu vídeo?',
          answer: 'Não por padrão. O servidor copia os streams comprimidos com -c copy, então a parte mantida é idêntica ao original. Ele só recodifica quando você marca a opção de precisão por quadro ou quando o contêiner que você escolheu não pode conter o codec de origem, como o WebM para um arquivo H.264.',
        },
        {
          question: 'Por que meu clipe começa um pouco antes do tempo que digitei?',
          answer: 'Uma cópia de stream só pode começar em um keyframe, e o FFmpeg escolhe o mais próximo no seu tempo de início ou antes dele. Em filmagens de câmera, os keyframes costumam estar separados por 1 a 2 segundos. Marque Recodificar para um corte preciso por quadro para começar no quadro exato.',
        },
        {
          question: 'Quais contêineres de saída posso escolher, e quais mantêm a qualidade original?',
          answer: 'MP4, MOV e WebM. MP4 e MOV aceitam o vídeo H.264 ou HEVC e o áudio AAC que a maioria das câmeras produz, então permanecem sem perdas. O WebM só aceita VP8, VP9 e AV1, então uma fonte H.264 é recodificada em VP9 com CRF 18 nessa escolha.',
        },
        {
          question: 'Qual pode ser a duração mínima e máxima do clipe cortado?',
          answer: 'No mínimo 0,1 segundo e no máximo 6 horas, com o fim depois do início. Na prática, os limites de envio pesam primeiro: por padrão, 5 minutos de vídeo para visitantes, 20 minutos com uma conta gratuita e 2 horas no Premium.',
        },
        {
          question: 'Ele mantém todas as faixas de áudio e legendas?',
          answer: 'No caminho de cópia de stream, sim: -map 0 copia todos os streams do arquivo. No caminho de recodificação, só o primeiro stream de vídeo e o primeiro de áudio são mantidos.',
        },
        {
          question: 'Posso cortar um vídeo em várias partes de uma vez?',
          answer: 'Não. Um envio produz um clipe de um intervalo. Para várias partes, rode o cortador uma vez por intervalo ou monte as partes em uma linha do tempo no Darkroom.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Cópia de stream quando possível (sem perda de qualidade); o fallback de recodificação usa H.264 + AAC para MP4.',
        ],
      },
      related: [
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o clipe depois de cortá-lo.',
        },
        {
          label: 'Converter vídeo em GIF animado',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Transforme os segundos cortados em um GIF.',
        },
        {
          label: 'Extrair áudio de vídeo',
          to: '/tools/extract-audio-from-video',
          description: 'Salve só o som do clipe.',
        },
        {
          label: 'Restauração de vídeo com IA',
          to: '/tools/ai-video-restoration',
          description: 'A restauração funciona em trechos de 15 segundos ou menos; corte primeiro.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Junte várias partes cortadas em uma única edição.',
        },
      ],
      embed: {
        title: 'Cortar um vídeo',
        description: 'Envie um vídeo e defina um tempo de início e de fim (ou escolha o intervalo visualmente). Mantemos a qualidade original com um corte rápido e sem perdas sempre que possível.',
      },
    },
    'extract-audio-from-video': {
      name: 'Extrair áudio de vídeo',
      h1: 'Extrair áudio de vídeo',
      tagline: 'Salve a faixa de áudio de qualquer vídeo como um arquivo MP3, WAV, M4A, AAC, FLAC ou OGG limpo.',
      metaTitle: 'Extrair áudio de vídeo: MP3, WAV, M4A e mais | Media Manipulator',
      metaDescription: 'Ferramenta online gratuita para extrair o áudio de qualquer arquivo de vídeo (MP4, MOV, MKV, WebM, AVI). Saída em MP3, WAV, M4A, AAC, FLAC ou OGG. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Extrair áudio de vídeo',
      ogDescription: 'Salve as faixas de áudio de MP4/MOV/MKV/WebM/AVI como MP3, WAV, M4A, AAC, FLAC ou OGG. Grátis, sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      intro: 'Todo contêiner de vídeo carrega o áudio como um fluxo separado, então tirar o som de lá não envolve a imagem em nada. Esta página pede ao FFmpeg que selecione o primeiro fluxo de áudio, ignore o vídeo e codifique esse fluxo no formato que você escolher: MP3 para qualquer coisa que toque música, WAV ou FLAC quando você quer as amostras intocadas, M4A ou AAC para um arquivo pequeno que os celulares reproduzem nativamente, ou OGG Vorbis. Antes de começar, o servidor verifica com o ffprobe se existe um fluxo de áudio, porque, do contrário, o FFmpeg gravaria um arquivo vazio sem reclamar.',
      whatItDoes: [
        'Seleciona o primeiro fluxo de áudio (-map 0:a:0) de MP4, MOV, M4V, WebM, MKV, AVI e dos outros contêineres de vídeo comuns e descarta o vídeo (-vn).',
        'Codifica MP3 com libmp3lame em qualidade 2 (taxa de bits variável com média de cerca de 190 kbps), WAV como PCM de 16 bits, M4A ou AAC a 192 kbps, FLAC sem perdas, ou OGG com libvorbis em qualidade 5.',
        'Mantém a taxa de amostragem e o número de canais originais; nada é reamostrado nem mixado para menos canais.',
        'Recusa de antemão um vídeo sem fluxo de áudio, com a mensagem de que não há nada para extrair.',
        'Devolve um único arquivo de áudio com o nome do original e a extensão escolhida.',
      ],
      flowSteps: [
        {
          title: 'Envie o vídeo',
          description: 'Qualquer contêiner comum; o arquivo vai direto para o nosso bucket de armazenamento e a API o recolhe.',
        },
        {
          title: 'Escolha o formato de áudio',
          description: 'MP3 vem pré-selecionado. WAV e FLAC são sem perdas; M4A e AAC são compactos; OGG é a opção aberta com perdas.',
        },
        {
          title: 'O ffprobe confirma que existe um fluxo de áudio',
          description: 'Um vídeo mudo para aqui, com um erro claro, em vez de produzir um arquivo vazio.',
        },
        {
          title: 'O FFmpeg codifica o fluxo',
          description: 'Um único comando com -map 0:a:0 -vn e o codificador do seu formato.',
        },
        {
          title: 'Baixe o áudio',
          description: 'O arquivo fica na pasta da tarefa até o fim do período de retenção.',
        },
      ],
      advancedDetails: [
        'O comando é ffmpeg -y -i input -map 0:a:0 -vn <encoder args> output (runExtractAudio em specialized_tools.go). -vn significa que o fluxo de vídeo nunca é decodificado, e é por isso que a extração é rápida mesmo em fontes 4K.',
        'MP3 usa -c:a libmp3lame -q:a 2, a configuração LAME V2 de taxa de bits variável, que fica em média em torno de 190 kbps em música e menos em fala. WAV usa -c:a pcm_s16le, então uma fonte estéreo a 44,1 kHz custa cerca de 10,1 MB por minuto e uma fonte a 48 kHz, cerca de 11 MB por minuto.',
        'M4A e AAC usam o codificador AAC nativo do FFmpeg com -b:a 192k. FLAC é sem perdas e costuma ficar entre 50 e 70 por cento do tamanho do WAV. OGG usa -c:a libvorbis -q:a 5, cerca de 160 kbps.',
        'Nenhuma flag -ar ou -ac é passada, então a saída mantém a taxa de amostragem e a configuração de canais da origem; surround 5.1 continua 5.1 em WAV e FLAC, enquanto o MP3 carrega no máximo dois canais.',
        'Só o fluxo 0:a:0 é mapeado. Um arquivo com faixa de comentários ou um segundo idioma fica com a faixa que estiver listada primeiro no contêiner.',
        'A extração é um modo especializado: o envio não entra na fila da análise automática de conteúdo que as conversões padrão recebem, e os controles de qualidade, redimensionamento e efeitos do conversor de vídeo não se aplicam.',
      ],
      whyItMatters: [
        'Podcasters, transcritores e editores geralmente precisam do som sem os pixels, e o vídeo costuma ser de 20 a 50 vezes maior que o áudio dentro dele.',
        'Um MP3 ou M4A corretamente etiquetado toca em qualquer celular e em qualquer player sem a decodificação de vídeo que drena a bateria.',
        'A saída sem perdas em WAV ou FLAC é a entrada certa para limpeza de ruído, separação de vocais ou uma transcrição cuidadosa.',
      ],
      useCases: [
        {
          title: 'Episódios só em áudio',
          description: 'Publique o som de uma entrevista gravada em vídeo como um MP3 de podcast.',
        },
        {
          title: 'Preparação para transcrição',
          description: 'Entregue uma gravação de 18 minutos a um transcritor como um MP3 de 25 MB em vez de um MP4 de 540 MB.',
        },
        {
          title: 'Design de som e sampling',
          description: 'Extraia um WAV de um clipe para reutilizar a ambiência ou a música em outra edição.',
        },
        {
          title: 'Anotações de aula',
          description: 'Guarde o áudio da gravação de uma aula para ouvir em qualquer lugar.',
        },
      ],
      workedExamples: [
        {
          title: 'Uma gravação 720p de 18 minutos e 540 MB para MP3',
          body: 'Entrada: um MP4 de 18 minutos em 1280 x 720 com 540 MB (cerca de 4 Mbps), enviado com uma conta gratuita porque ultrapassa os padrões de visitante de 200 MB e 5 minutos. Configurações: MP3. O servidor confirma a faixa AAC estéreo a 48 kHz com o ffprobe e roda libmp3lame -q:a 2. A cerca de 190 kbps, isso dá cerca de 1,4 MB por minuto, então o resultado sai com cerca de 25 MB, mais ou menos um vigésimo do envio. Como -vn pula o vídeo por completo, a tarefa é uma simples decodificação e codificação de áudio e é rápida; enviar 540 MB leva muito mais tempo do que extrair o áudio deles.',
        },
        {
          title: 'Um videoclipe 1080p de 4 minutos e 95 MB para WAV',
          body: 'Entrada: um MP4 de 4 minutos em 1920 x 1080 com 95 MB e uma faixa AAC estéreo a 44,1 kHz, dentro dos limites de visitante. Configurações: WAV. O FFmpeg decodifica o AAC uma vez e grava PCM de 16 bits com pcm_s16le, mantendo 44,1 kHz e dois canais. PCM nessa taxa são 44.100 x 16 x 2 bits por segundo, cerca de 10,1 MB por minuto, então o arquivo sai com cerca de 40 MB, não importa quão alta ou densa seja a música. Escolher FLAC comprimiria essas mesmas amostras sem perdas para algo entre 20 e 28 MB, dependendo do material. O tempo é de alguns segundos de decodificação de áudio; o vídeo nunca é tocado.',
        },
      ],
      whenNotToUse: 'Não use esta página para melhorar o som; ela copia o que está lá, e uma gravação ruidosa ou distante continua ruidosa. As ferramentas Limpar áudio de voz e Remover ruído de fundo foram feitas para isso. Não espere que um WAV recupere a qualidade que o vídeo perdeu; a faixa de origem é quase sempre AAC com perdas, então um WAV é uma cópia fiel de um sinal comprimido, não um master de estúdio. Se o vídeo tem duas faixas de idioma e você precisa da segunda, esta ferramenta só pega a primeira. E se o que você realmente quer são as palavras, o transcritor lê o áudio e entrega texto e legendas diretamente.',
      whyMediaManipulator: [
        'As configurações do codificador são declaradas: LAME V2 para MP3, 192 kbps para AAC, PCM de 16 bits para WAV e a taxa de amostragem original em todos os casos.',
        'Um vídeo mudo é detectado pelo ffprobe antes de qualquer coisa rodar, então você nunca baixa um arquivo de tamanho zero.',
        'Uma extração é uma operação da sua cota diária: 5 por dia sem conta, por padrão, e 30 com uma conta gratuita; uma tarefa recusada ou com falha é devolvida. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'A extração roda nos nossos próprios servidores como um único comando do FFmpeg que lê apenas o primeiro fluxo de áudio do seu envio; os quadros de vídeo nunca são decodificados. O arquivo enviado fica em uploads/<jobId>/ e o áudio em outputs/<jobId>/, ambos registrados no livro de retenção e removidos quando o período termina. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Como a extração é um modo especializado, o envio não passa pela análise automática de conteúdo que as conversões padrão recebem; ele não é transcrito nem descrito, e nada sai do nosso hardware.',
      faq: [
        {
          question: 'Para quais formatos de áudio posso extrair, e quais são sem perdas?',
          answer: 'MP3, WAV, M4A, AAC, FLAC e OGG. WAV e FLAC são cópias sem perdas da faixa decodificada. MP3 (cerca de 190 kbps VBR), M4A e AAC (192 kbps) e OGG (qualidade 5) têm perdas, mas ficam acima da taxa de bits da maioria das trilhas sonoras de vídeo.',
        },
        {
          question: 'Qual será o tamanho do áudio extraído?',
          answer: 'WAV tem cerca de 10,1 MB por minuto em estéreo a 44,1 kHz, ou 11 MB a 48 kHz. MP3 na configuração desta página tem cerca de 1,4 MB por minuto, M4A e AAC cerca de 1,4 MB por minuto a 192 kbps, OGG cerca de 1,2 MB por minuto. FLAC costuma ficar entre a metade e dois terços do tamanho do WAV.',
        },
        {
          question: 'A extração altera a taxa de amostragem ou a imagem estéreo?',
          answer: 'Não. O FFmpeg roda sem -ar nem -ac, então a saída mantém a taxa de amostragem e a configuração de canais da origem. Uma faixa estéreo a 48 kHz continua estéreo a 48 kHz.',
        },
        {
          question: 'O que acontece se meu vídeo não tiver áudio?',
          answer: 'O servidor analisa o arquivo primeiro e para com a mensagem de que não há nada para extrair. A operação é devolvida e nenhum arquivo vazio é produzido.',
        },
        {
          question: 'Meu vídeo tem duas faixas de áudio; qual delas eu recebo?',
          answer: 'A primeira do contêiner, o fluxo 0:a:0. Ainda não há um seletor de faixa. Se a que você precisa é a segunda, remuxe ou reexporte o vídeo com essa faixa em primeiro lugar.',
        },
        {
          question: 'Extrair áudio é grátis, e qual é a duração máxima do vídeo que posso enviar?',
          answer: 'Sim. Por padrão, um visitante pode rodar 5 operações por dia em arquivos de até 200 MB e 5 minutos; uma conta gratuita permite 30 por dia, 1 GB e 20 minutos; o Premium aceita 5 GB e 2 horas. Os limites atuais estão listados na página de preços.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Extraímos o primeiro fluxo de áudio. Vídeos sem nenhum fluxo de áudio retornam um erro claro em vez de um arquivo vazio.',
        ],
      },
      related: [
        {
          label: 'Transcrever vídeo',
          to: '/tools/transcribe-video',
          description: 'Pule o arquivo de áudio e receba as palavras diretamente.',
        },
        {
          label: 'Limpar áudio de voz',
          to: '/tools/clean-voice-audio',
          description: 'Reduza o ruído e nivele a fala extraída.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Tire o zumbido e o chiado da faixa extraída.',
        },
        {
          label: 'Remover vocais de uma música',
          to: '/tools/remove-vocals-from-song',
          description: 'Transforme a música extraída em um instrumental.',
        },
        {
          label: 'Cortar vídeo',
          to: '/tools/video-trimmer',
          description: 'Corte o vídeo até a parte que você quer antes de extrair.',
        },
      ],
      embed: {
        title: 'Extrair a faixa de áudio de um vídeo',
        description: 'Envie qualquer contêiner de vídeo comum. Escolha MP3 para ampla compatibilidade, WAV para sem perdas ou M4A/AAC para um arquivo comprimido compacto. Vídeos sem faixa de áudio retornam um erro claro.',
      },
    },
    'convert-video-to-animated-gif': {
      name: 'Converter vídeo em GIF animado',
      h1: 'Converter vídeo em GIF animado online',
      tagline: 'Transforme clipes curtos em MP4, WebM, MOV ou MKV em GIFs animados fáceis de compartilhar em segundos.',
      metaTitle: 'Converter vídeo em GIF animado online (grátis) | Media Manipulator',
      metaDescription: 'Conversor online gratuito de vídeo para GIF. Transforme clipes curtos em MP4, WebM, MOV e MKV em GIFs animados, com controle de tamanho e taxa de quadros.',
      ogTitle: 'Converter vídeo em GIF animado online',
      ogDescription: 'Transforme clipes curtos de vídeo em GIFs animados fáceis de compartilhar. Controle a taxa de quadros, as dimensões e o loop.',
      intro: 'Um GIF animado é uma pilha de quadros com cores indexadas, no máximo 256 cores por paleta, sem compressão entre quadros além de uma simples codificação por comprimento de sequência. É por isso que um GIF de poucos segundos pode pesar mais que um MP4 de um minuto, e por isso que fazer um bom GIF é, acima de tudo, escolher largura, taxa de quadros e tamanho da paleta. Esta página roda um pipeline de duas etapas: o FFmpeg redimensiona o vídeo para a largura definida e o amostra na sua taxa de quadros, gravando um GIF bruto; depois o gifsicle requantiza a paleta para a sua contagem de cores, define o atraso entre quadros e otimiza os quadros para que só os pixels alterados sejam armazenados. Os padrões são ajustados para gravações de tela: 900 pixels de largura, 12 quadros por segundo, 128 cores.',
      whatItDoes: [
        'Redimensiona o clipe para uma largura escolhida (16 a 2000 px), com a altura calculada a partir da proporção e arredondada para um múltiplo de 4.',
        'Amostra a origem em uma taxa de quadros escolhida (1 a 50 fps; 12 por padrão) com o FFmpeg.',
        'Quantiza cada quadro para uma paleta de 2 a 256 cores (128 por padrão) e otimiza o armazenamento entre quadros com o gifsicle nos níveis 1 a 3.',
        'Define o atraso entre quadros em centésimos de segundo, o que decide a velocidade de reprodução independentemente da taxa de amostragem.',
        'Respeita um intervalo de corte do formulário do conversor, para que só os segundos selecionados virem quadros.',
      ],
      flowSteps: [
        {
          title: 'Envie um vídeo e escolha GIF',
          description: 'GIF já vem selecionado como saída nesta página; o controle de Qualidade fica desabilitado porque não se aplica.',
        },
        {
          title: 'Corte para poucos segundos',
          description: 'Use o controle de corte para ficar com o momento que você quer; cada segundo extra são 12 quadros a mais na taxa padrão.',
        },
        {
          title: 'Defina largura, taxa de quadros, cores e atraso',
          description: 'O painel Configurações de GIF animado começa em 900 px, 12 fps, 128 cores, atraso 3, otimização 3.',
        },
        {
          title: 'O FFmpeg amostra, o gifsicle otimiza',
          description: 'ffmpeg scale=W:-4 -pix_fmt rgb8 -r FPS, depois gifsicle --optimize --delay --colors --interlace.',
        },
        {
          title: 'Baixe o GIF',
          description: 'Um GIF padrão em loop que aplicativos de chat e navegadores reproduzem inline.',
        },
      ],
      advancedDetails: [
        'A primeira etapa é ffmpeg -i input [-ss START -t DURATION] -vf scale=W:-4 -pix_fmt rgb8 -r FPS -f gif raw.gif (convertVideoToGIF em converter.go). O -4 pede uma altura que mantenha a proporção e seja divisível por 4; rgb8 é um intermediário indexado de 8 bits que a segunda etapa requantiza.',
        'A segunda etapa é gifsicle --optimize=L --delay=D --colors C --interlace raw.gif -o output.gif. O nível de otimização 3 é o mais lento e o menor: ele armazena só o retângulo de pixels que mudou entre os quadros, e é por isso que um screencast com uma barra de ferramentas estática comprime muito melhor que uma tomada de câmera em panorâmica.',
        'O atraso é aplicado a cada quadro após a amostragem e é independente da taxa de amostragem. Nos 12 fps e atraso 3 padrão (30 ms por quadro), um clipe toca cerca de 2,8 vezes mais rápido que o tempo real; defina o atraso como 8 (80 ms, 12,5 fps) para uma reprodução aproximadamente em tempo real a 12 fps, ou 10 a 10 fps.',
        'Uma largura digitada no campo Largura principal do conversor sobrepõe a largura do painel de GIF, então usuários avançados podem ficar com um único controle. As cores são limitadas de 2 a 256 pelo formulário; uma paleta de GIF nunca pode passar de 256.',
        'Não há passagem de palettegen no FFmpeg aqui; a qualidade da paleta vem do gifsicle --colors, que monta uma única paleta otimizada para toda a animação. Clipes fotográficos com gradientes suaves se beneficiam de 256 cores; filmagens chapadas de interface ficam idênticas com 64.',
        'A etapa do gifsicle roda com um tempo limite de 6 horas, e o envio também recebe a análise de conteúdo automatizada que as conversões padrão recebem, já que o GIF é um formato do conversor de vídeo normal.',
      ],
      whyItMatters: [
        'GIFs são reproduzidos automaticamente inline em rastreadores de problemas, aplicativos de chat, sites de documentação e clientes de e-mail onde um anexo de vídeo mostraria um botão de reproduzir ou nada.',
        'Um GIF de 5 segundos de um bug o reproduz mais rápido que um parágrafo e não precisa de um player de vídeo.',
        'As escolhas de paleta e taxa de quadros mudam o tamanho em uma ordem de grandeza, então expô-las é melhor que uma predefinição única.',
      ],
      useCases: [
        {
          title: 'Reproduções de bugs',
          description: 'Grave a tela, corte até a falha e solte o GIF no ticket.',
        },
        {
          title: 'Demonstrações em README e documentação',
          description: 'Mostre um recurso em movimento onde a incorporação de vídeo não é permitida.',
        },
        {
          title: 'Clipes de reação',
          description: 'Recorte 3 segundos de um vídeo e compartilhe em qualquer lugar que aceite imagens.',
        },
        {
          title: 'Pré-visualizações em e-mail',
          description: 'Um pequeno GIF em loop com link para o vídeo completo, onde o vídeo em si não toca.',
        },
      ],
      workedExamples: [
        {
          title: 'Uma gravação de tela de 8 segundos em 1080p com os padrões',
          body: 'Entrada: uma gravação de tela MP4 de 8 segundos em 1920 x 1080, com cerca de 15 MB. Configurações: GIF, largura 900, 12 fps, 128 cores, atraso 3, otimização 3. O FFmpeg redimensiona para 900 pixels de largura por cerca de 506 de altura (ajustada para um múltiplo de 4) e amostra 96 quadros. Sem compressão, esses 96 quadros indexados teriam cerca de 43 MB (900 x 504 x 96 bytes), que é o teto a partir do qual o gifsicle trabalha para baixo; com uma barra de ferramentas estática e um cursor em movimento, a otimização de nível 3 armazena só os retângulos que mudam, então um screencast fica muito abaixo desse limite, normalmente em poucos megabytes. Com atraso 3, os 96 quadros tocam em cerca de 2,9 segundos, aproximadamente 2,8 vezes mais rápido que a origem de 8 segundos; defina o atraso como 8 para tocar em cerca de 7,7 segundos. O trabalho é uma codificação curta mais uma passagem do gifsicle por 96 quadros.',
        },
        {
          title: 'Um clipe de reação de 5 segundos em 480 px, 10 fps e 64 cores',
          body: 'Entrada: um MP4 de 20 segundos em 1080p com 40 MB, cortado no formulário para um intervalo de 5 segundos. Configurações: GIF, largura 480, 10 fps, 64 cores, atraso 10, otimização 3. O FFmpeg recorta os 5 segundos, redimensiona para 480 pixels de largura por cerca de 270 de altura (arredondada para um múltiplo de 4) e amostra 50 quadros. Os dados brutos dos quadros são cerca de 6,5 MB (480 x 268 x 50 bytes) antes da otimização, e uma paleta de 64 cores precisa de só 6 bits por pixel, então uma tomada de câmera com movimento em todo o quadro ainda sai bem abaixo disso, enquanto uma pessoa falando parada comprime para uma fração. Atraso 10 são 100 ms por quadro, então 50 quadros tocam em exatamente 5 segundos, batendo com o tempo real a 10 fps.',
        },
      ],
      whenNotToUse: 'Não faça um GIF de nada com mais de cerca de 10 segundos ou com movimento fotográfico em todo o quadro; o formato não tem compressão real entre quadros, então esses clipes viram dezenas de megabytes, enquanto um MP4 ou WebM da mesma coisa tem um décimo do tamanho. Não use GIF quando a fidelidade de cor importa, já que cada quadro fica limitado a uma paleta de 256 cores e os gradientes formam faixas. Se o destino reproduz vídeo inline, um MP4 comprimido é melhor em todos os sentidos. E se você precisa de áudio, um GIF simplesmente não consegue carregá-lo.',
      whyMediaManipulator: [
        'As duas etapas do pipeline e seus padrões estão documentadas aqui, incluindo o comportamento do atraso que faz os GIFs padrão tocarem rápido.',
        'Largura, taxa de quadros, contagem de cores, atraso e nível de otimização estão todos expostos, e não um único controle deslizante de tamanho.',
        'Uma conversão para GIF conta como uma operação (5 por dia para visitantes por padrão, 30 com uma conta gratuita), e um trabalho que falha é reembolsado. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'A conversão para GIF roda nos nossos próprios servidores: o FFmpeg amostra e redimensiona os quadros, depois o gifsicle os quantiza e otimiza; um GIF bruto temporário é excluído assim que o gifsicle termina. O envio fica em uploads/<jobId>/ e o GIF em outputs/<jobId>/, ambos no registro de retenção e excluídos quando a janela termina. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Como formato do conversor de vídeo padrão, o envio também passa pela nossa análise de conteúdo automatizada no mesmo hardware (quadros amostrados descritos por um modelo de visão local, qualquer áudio transcrito localmente); esse relatório fica com o trabalho e não é compartilhado com terceiros.',
      faq: [
        {
          question: 'Por que meu GIF toca mais rápido que o vídeo original?',
          answer: 'O atraso entre quadros é definido após a amostragem e tem como padrão 3 centésimos de segundo, o que dá cerca de 33 quadros por segundo de reprodução para quadros amostrados a 12 por segundo. Defina o atraso como 8 a 12 fps, ou 10 a 10 fps, para reprodução em tempo real.',
        },
        {
          question: 'Como deixo o GIF menor?',
          answer: 'Em ordem de efeito: corte para menos segundos, reduza a largura (480 é mais que suficiente para chat), baixe a taxa de quadros para 8 ou 10 e reduza as cores para 64 em filmagens chapadas de interface. Mantenha a otimização em 3; os níveis 1 e 2 só trocam tamanho por velocidade.',
        },
        {
          question: 'Quantas cores devo usar?',
          answer: '128, o padrão, serve para a maioria das gravações de tela. Interfaces chapadas ficam idênticas com 64 e economizam bytes. Filmagens fotográficas com gradientes pedem 256, que é o máximo do GIF.',
        },
        {
          question: 'Posso escolher qual parte do vídeo vira o GIF?',
          answer: 'Sim. Use o controle de corte no conversor para definir um início e um fim; só esse intervalo é amostrado. Quanto mais curto, melhor, já que cada segundo acrescenta quadros na taxa escolhida.',
        },
        {
          question: 'O GIF vai ficar em loop, e ele mantém o som?',
          answer: 'Ele fica em loop, como os GIFs fazem por padrão em todos os players. Ele não consegue carregar áudio; o formato não tem trilha de som. Extraia o áudio separadamente se precisar dele.',
        },
        {
          question: 'Qual é o maior GIF que posso fazer?',
          answer: 'O formulário permite até 2000 px de largura, 50 fps e 256 cores, mas um GIF com essas configurações cresce enormemente rápido. O envio em si é limitado pelo seu plano: 200 MB e 5 minutos de vídeo para um visitante por padrão.',
        },
      ],
      related: [
        {
          label: 'Cortar vídeo',
          to: '/tools/video-trimmer',
          description: 'Recorte primeiro os segundos exatos, sem perdas.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Para qualquer coisa com mais de poucos segundos, um MP4 pequeno é melhor que um GIF.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Adicione legendas ou recorte antes de exportar o clipe.',
        },
        {
          label: 'Tutorial do conversor de vídeo',
          to: '/tutorials/video/getting-started',
          description: 'Percorra as configurações de corte, redimensionamento e filtros.',
        },
      ],
      embed: {
        title: 'Converter um clipe de vídeo em GIF',
        description: 'Envie um vídeo curto e escolha GIF como formato de saída. Corte para menos de ~10 segundos e reduza a taxa de quadros para um arquivo menor.',
      },
    },
    'transcribe-video': {
      name: 'Transcrever vídeo',
      h1: 'Transcrever vídeo em texto online',
      tagline: 'Extraia a fala de um vídeo ou arquivo de áudio como legendas WebVTT ou SRT, texto simples ou JSON com marcações de tempo.',
      metaTitle: 'Transcrever vídeo em texto online (grátis) | Media Manipulator',
      metaDescription: 'Transcrição de vídeo online gratuita. Converta arquivos MP4, MOV, WebM, MKV e de áudio em texto pesquisável, legendas VTT ou transcrições em JSON.',
      ogTitle: 'Transcrever vídeo em texto online',
      ogDescription: 'Extraia a fala de vídeos em texto, legendas ou transcrições JSON. Roda em um servidor local com GPU.',
      intro: 'Transcrever vídeo recebe um MP4, MOV, WebM, MKV ou um arquivo de áudio simples, separa a faixa de áudio e a passa pelo Whisper em um servidor com GPU que nós operamos. Você escolhe a forma do resultado antes de enviar: um arquivo de legendas WebVTT ou SRT com as marcações de tempo, um arquivo de texto simples só com as palavras, ou um documento JSON com cada segmento e seu início e fim com precisão de milissegundo. O idioma é detectado automaticamente, ou você pode digitar um código de duas letras para fixá-lo.',
      whatItDoes: [
        'Decodifica a faixa de áudio com o ffmpeg em um WAV mono de 16 kHz, a taxa de amostragem que o Whisper espera, e exclui esse intermediário quando o trabalho termina.',
        'Roda o whisper-ctranslate2 com o modelo Whisper medium em float16 na nossa GPU, com filtragem por atividade de voz ativada para que silêncio e trechos longos de música sejam pulados.',
        'Grava um arquivo chamado transcript.vtt, transcript.srt, transcript.txt ou transcript.json, conforme o formato que você escolheu.',
        'Detecta o idioma falado a partir do próprio áudio; um código de idioma digitado no formulário sobrepõe a detecção em clipes curtos ou mistos.',
        'Informa com honestidade quando não há nada para transcrever: um vídeo sem fluxo de áudio, ou um áudio sem fala reconhecível, ainda é concluído com uma mensagem curta em vez de um arquivo vazio.',
      ],
      flowSteps: [
        {
          title: 'Envie vídeo ou áudio',
          description: 'MP4, MOV, WebM, MKV, AVI ou um arquivo de áudio como MP3, WAV, M4A ou FLAC.',
        },
        {
          title: 'Escolha um formato',
          description: 'VTT ou SRT para legendas, TXT para uma transcrição legível, JSON para marcações de tempo que você possa processar.',
        },
        {
          title: 'O ffmpeg extrai o áudio',
          description: 'A faixa é convertida em PCM mono de 16 kHz; os quadros de vídeo nunca são decodificados.',
        },
        {
          title: 'O Whisper transcreve na nossa GPU',
          description: 'O trabalho espera uma vaga livre na GPU, e então o modelo medium percorre todo o arquivo em uma passagem.',
        },
        {
          title: 'Baixe a transcrição',
          description: 'O arquivo aparece junto com o trabalho e pode ser baixado enquanto o trabalho for mantido.',
        },
      ],
      advancedDetails: [
        'O comando exato de extração é ffmpeg -vn -acodec pcm_s16le -ar 16000 -ac 1, então uma faixa estéreo de 48 kHz é reduzida a mono e reamostrada antes que o Whisper a veja. Esse intermediário custa 32 KB por segundo (cerca de 1,9 MB por minuto) de disco enquanto o trabalho roda e é removido depois.',
        'O whisper-ctranslate2 é iniciado com --model medium --device cuda --compute_type float16 --vad_filter True e --output_format json; a API interpreta esse JSON e gera ela mesma o formato que você escolheu. O modelo é uma configuração do servidor (WHISPER_CT2_MODEL), então medium é o padrão, não uma promessa.',
        'A saída VTT começa com o cabeçalho WEBVTT e numera cada marcação; as marcações de tempo são HH:MM:SS.mmm. O SRT é a mesma lista de marcações com vírgula como separador de milissegundos. Um segmento cujo fim é igual ao início recebe meio segundo para que os players ainda o exibam.',
        'A saída JSON contém language, hasAudio, hasSpeech, transcript, durationSeconds e um array segments de {id, start, end, text}, com tempos arredondados ao milissegundo. Não há marcações por palavra nem pontuações de confiança nessa saída.',
        'Só um processo do Whisper roda por vez por padrão (WHISPER_GPU_CONCURRENCY=1), e o agendador da GPU verifica a VRAM livre antes de começar; o modelo medium em float16 precisa de cerca de 3,5 GB mais uma margem de 512 MB. Se a placa estiver ocupada, seu trabalho espera na fila em vez de falhar.',
        'Com o filtro VAD ativado, um arquivo que é só música ou fala muito fraca pode voltar com "Audio was detected but no recognizable speech was found." Essa mensagem é gravada no arquivo de transcrição, então o download nunca fica vazio.',
      ],
      whyItMatters: [
        'Um arquivo de legendas é a diferença entre um vídeo que pode ser assistido no mudo, pesquisado ou citado e um que não pode.',
        'Segmentos com marcação de tempo deixam você pular para o momento em que uma frase foi dita, e é isso que transforma uma gravação de duas horas em algo que você realmente consegue usar.',
        'Manter a transcrição em hardware que nós operamos significa que o áudio não é entregue a uma API de fala externa.',
      ],
      useCases: [
        {
          title: 'Legendas para um vídeo publicado',
          description: 'Exporte VTT para vídeo em HTML e a maioria dos players web, ou SRT para suítes de edição e fluxos de legendagem no estilo da TV.',
        },
        {
          title: 'Anotações de reuniões e entrevistas',
          description: 'Leve a saída TXT para um documento e edite a partir dali em vez de digitar do zero.',
        },
        {
          title: 'Indexação de um acervo de gravações',
          description: 'Use os segmentos JSON para montar um índice de busca que aponte para o segundo exato em que uma palavra foi dita.',
        },
        {
          title: 'Um primeiro rascunho de artigo',
          description: 'Transcreva uma palestra ou um screencast e depois reescreva o texto simples em prosa.',
        },
      ],
      workedExamples: [
        {
          title: 'Um MP4 de 9 minutos em 1080p com 120 MB, como legendas VTT',
          body: 'Os 120 MB ficam abaixo do limite de 200 MB para visitantes, mas 9 minutos passam do limite de 5 minutos para visitantes, então este precisa de uma conta gratuita, que permite 20 minutos por padrão. O ffmpeg grava um WAV mono de 16 kHz com cerca de 17 MB (32.000 bytes por segundo durante 540 segundos), que é excluído após a execução. O Whisper medium então produz marcações numeradas com tempos em HH:MM:SS.mmm, e o transcript.vtt resultante tem poucos kilobytes, porque contém só texto e marcações de tempo. Enviar 120 MB em uma conexão doméstica costuma levar mais tempo que a extração, que dura poucos segundos; a passagem do Whisper é o resto e cresce com a duração da fala, não com o tamanho do vídeo.',
        },
        {
          title: 'Um MP3 de podcast de 18 minutos com cerca de 26 MB, como JSON',
          body: 'Um MP3 a 192 kbps são 24 KB por segundo, então 1.080 segundos dão cerca de 26 MB. Arquivos só de áudio seguem o mesmo limite de duração que o vídeo, então 18 minutos precisam de uma conta gratuita (limite de 20 minutos) em vez de uma sessão de visitante (5 minutos). Não há vídeo para pular, mas o arquivo ainda é convertido primeiro em PCM mono de 16 kHz (cerca de 35 MB em disco, removidos depois). O idioma é detectado a partir do áudio e gravado no JSON como um código de duas letras, e cada segmento carrega seu próprio início e fim. O JSON é maior que o TXT da mesma gravação porque cada segmento vem envolto no próprio objeto, mas ainda fica bem abaixo de um megabyte.',
        },
      ],
      whenNotToUse: 'Não use isto quando precisar de marcações por palavra, identificação de quem fala ou pontuações de confiança: a saída não tem nada disso, só marcações de tempo por segmento. Também é a ferramenta errada para um arquivo cujo áudio é música sem fala, já que o filtro de atividade de voz vai pulá-lo e você receberá uma mensagem curta em vez da letra. Se você só precisa ouvir o arquivo, ou quer legendas traduzidas para outro idioma, está atrás de uma etapa diferente. E se a gravação é mais longa do que o seu plano permite (5 minutos como visitante, 20 minutos em uma conta gratuita por padrão), corte-a primeiro ou entre na sua conta.',
      whyMediaManipulator: [
        'Você escolhe VTT, SRT, TXT ou JSON antes de enviar, então não há uma segunda etapa de conversão depois que a transcrição existe.',
        'O Whisper roda na nossa própria GPU com o cache de modelos em modo offline; nenhum serviço de fala externo recebe o áudio.',
        'A transcrição conta como um trabalho de IA, retirado da cota de IA, que é separada da cota comum: por padrão, 3 por dia para um visitante e 10 com uma conta gratuita, e seus trabalhos comuns ficam intactos (veja /pricing).',
      ],
      privacyNote: 'Seu arquivo de vídeo ou áudio é armazenado na pasta do trabalho no nosso servidor. O ffmpeg grava um WAV mono de 16 kHz temporário que o Whisper lê na nossa GPU, e esse WAV é excluído quando o trabalho termina. O arquivo de transcrição e uma cópia transcribe_result.json dos segmentos ficam com o trabalho, e o texto da transcrição também é passado a um modelo de linguagem que roda no nosso próprio hardware para um resumo automatizado e uma revisão de segurança, cujo resultado é mantido com o trabalho. Nada é enviado a um provedor de IA terceirizado. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'Qual formato de legenda devo escolher, VTT ou SRT?',
          answer: 'VTT se as legendas são para a web (vídeo em HTML, a maioria dos players) e SRT se vão para um editor de vídeo ou um fluxo de trabalho no estilo broadcast. Os dois contêm as mesmas marcações; só o cabeçalho e o separador de milissegundos diferem, um ponto no VTT e uma vírgula no SRT.',
        },
        {
          question: 'A transcrição em JSON inclui pontuações de confiança ou marcações por palavra?',
          answer: 'Não. Cada segmento tem um id, um início e um fim em segundos (arredondados ao milissegundo) e seu texto. O arquivo também registra o idioma detectado, a duração e se foi encontrada fala, mas não há marcações por palavra nem probabilidades.',
        },
        {
          question: 'Qual é a duração máxima de arquivo que posso transcrever?',
          answer: 'Envios só de áudio seguem o mesmo limite de duração que o vídeo: 5 minutos para um visitante, 20 minutos com uma conta gratuita, 2 horas no Premium e no Pro por padrão, e 200 MB, 1 GB ou 5 GB por arquivo, respectivamente. O formulário mostra os limites que valem para você, e /pricing lista os números atuais.',
        },
        {
          question: 'Por que recebi "no recognizable speech was found"?',
          answer: 'O Whisper roda com detecção de atividade de voz ativada, então um arquivo que é música, som ambiente, silêncio ou fala muito fraca pode ser reduzido a nada. A mensagem é gravada no próprio arquivo de transcrição, então o download continua funcionando. Grave de novo mais alto ou corte até a parte falada e tente outra vez.',
        },
        {
          question: 'Posso forçar o idioma em vez de deixar detectar?',
          answer: 'Sim. Digite um código de idioma de duas letras, como en, de ou es, no campo de idioma e o Whisper transcreverá nesse idioma. Deixe em branco para a detecção automática, que funciona bem em clipes com mais de alguns segundos.',
        },
        {
          question: 'A transcrição usa minha cota de IA?',
          answer: 'Sim. Cada transcrição é um trabalho de IA: por padrão, 3 por dia como visitante, 10 com uma conta gratuita, 100 no Premium e 200 no Pro. A cota de IA é um contador próprio, então transcrever nunca consome a cota comum de conversões. Um trabalho que falha devolve a unidade.',
        },
        {
          question: 'Qual modelo é usado, e posso escolher um maior?',
          answer: 'O serviço roda o whisper-ctranslate2 com o modelo medium em float16 em uma GPU CUDA por padrão. Não há seletor de modelo no formulário; o modelo é definido no servidor, então variantes muito rápidas ou muito grandes não são algo que você possa pedir por trabalho.',
        },
      ],
      related: [
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza uma gravação grande antes de enviá-la para transcrição.',
        },
        {
          label: 'Extrair áudio de vídeo',
          to: '/tools/extract-audio-from-video',
          description: 'Retire a faixa de áudio se quiser guardar uma cópia dela também.',
        },
        {
          label: 'Limpar áudio de voz',
          to: '/tools/clean-voice-audio',
          description: 'Melhore uma gravação com ruído antes de transcrevê-la.',
        },
        {
          label: 'Cortar vídeo',
          to: '/tools/video-trimmer',
          description: 'Corte o arquivo até a parte falada primeiro.',
        },
        {
          label: 'Tutorial do conversor de vídeo',
          to: '/tutorials/video/getting-started',
          description: 'Prepare e converta o vídeo antes de transcrever.',
        },
      ],
      embed: {
        title: 'Transcrever um vídeo',
        description: 'Envie um vídeo. O modelo de transcrição com IA roda no nosso servidor local com GPU e exporta como legendas VTT, texto simples ou JSON: VTT para legendas, texto simples para um artigo, JSON para ferramentas posteriores.',
      },
    },
    'transcode-to-hls': {
      name: 'Transcodificar vídeo para HLS',
      h1: 'Transcodificar vídeo para HLS online',
      tagline: 'Empacote qualquer vídeo em um pacote Apple HLS VOD: master.m3u8 e segmentos .ts por rendition, prontos para a web.',
      metaTitle: 'Transcodificar vídeo para HLS online | Streaming adaptativo | Media Manipulator',
      metaDescription: 'Transcodificador HLS online gratuito. Converta MP4, MOV, WebM e MKV em um pacote HLS VOD com renditions de 360p/480p/720p, com legendas e storyboards opcionais.',
      ogTitle: 'Transcodificar vídeo para HLS online',
      ogDescription: 'Gere um pacote HLS adaptativo (master.m3u8 + playlists de variantes + segmentos .ts) a partir de qualquer vídeo, grátis, no seu navegador.',
      intro: 'O HTTP Live Streaming entrega um vídeo como uma playlist de segmentos curtos em vários níveis de qualidade, para que um player comece rápido e troque de nível conforme a conexão muda. Produzir esse pacote à mão significa codificar cada rendição com keyframes alinhados, segmentá-las e escrever uma playlist master que descreva cada variante corretamente. Esta página faz o trabalho inteiro: analisa o seu envio, oferece os níveis da escada que a origem e o seu plano permitem, codifica cada um com libx264 e AAC em segmentos MPEG-TS de 2 segundos, opcionalmente adiciona legendas do nosso próprio transcritor Whisper, um sprite sheet de storyboard e uma playlist de I-frames para a navegação, e empacota tudo em um tar.gz ou zip que você pode descompactar em qualquer host estático.',
      whatItDoes: [
        'Analisa a origem com o ffprobe e lista os níveis da escada: 144p, 240p, 360p, 480p, 720p, 1080p e 2160p, cada um habilitado só se a origem for alta o bastante e o seu plano permitir.',
        'Codifica cada nível selecionado com libx264 perfil High nível 4.1 e AAC estéreo a 48 kHz, em segmentos .ts de 2 segundos com um keyframe em cada limite de segmento.',
        'Grava hls/master.m3u8 com BANDWIDTH, RESOLUTION, FRAME-RATE e CODECS para cada variante, mais um index.m3u8 por nível.',
        'Opcionalmente transcreve o áudio com o Whisper em uma faixa WebVTT, traduz para até 3 idiomas adicionais com um modelo local e vincula cada uma como rendição de legenda no master.',
        'Opcionalmente renderiza um sprite sheet de storyboard com um índice WebVTT para as miniaturas da barra de progresso, e sempre tenta adicionar uma playlist só de I-frames em 240p.',
        'Empacota a pasta com README.txt e report.json em um tar.gz (ou zip) e entrega um link de download pré-assinado.',
      ],
      flowSteps: [
        {
          title: 'Envie',
          description: 'O navegador envia direto para o nosso bucket de armazenamento com um PUT pré-assinado; a API então o baixa para trabalhar.',
        },
        {
          title: 'Analise',
          description: 'O ffprobe lê largura, altura, taxa de quadros, duração e se há áudio; os níveis mais altos que a origem ficam desabilitados.',
        },
        {
          title: 'Escolha os níveis e os extras',
          description: '360p, 480p e 720p vêm pré-selecionados. Marque legendas, idiomas extras de legenda, storyboards e tar.gz ou zip.',
        },
        {
          title: 'Codifique cada nível',
          description: 'libx264 no CRF e na taxa de bits do nível com GOP de 2 segundos, AAC na taxa de bits de áudio do nível, saída HLS VOD.',
        },
        {
          title: 'Adicione os extras e grave o master',
          description: 'Legendas, storyboards e a playlist de I-frames são gerados, e depois o master.m3u8 é reescrito para referenciá-los.',
        },
        {
          title: 'Baixe o pacote',
          description: 'Um link pré-assinado válido por 30 minutos por padrão; a página do trabalho deixa você buscá-lo enquanto durar.',
        },
      ],
      advancedDetails: [
        'A escada (transcode_profiles.go) é: 144p com 200 kbps de vídeo e 64 kbps de áudio, CRF 26; 240p 400/64, CRF 25; 360p 800/96, CRF 23; 480p 1200/128, CRF 23; 720p 2800/128, CRF 22; 1080p 5000/192, CRF 22; 2160p 12000/256, CRF 21. Todos os níveis usam a predefinição veryfast, exceto 2160p, que usa slow.',
        'Cada nível é codificado como ffmpeg -i input -map 0:v:0 -vf scale=-2:H -r FPS -c:v libx264 -profile:v high -level 4.1 -preset P -crf N -sc_threshold 0 -g GOP -keyint_min GOP -b:v B -maxrate 1.2B -bufsize 2B -force_key_frames expr:gte(t,n_forced*2) -map 0:a:0? -c:a aac -b:a A -ac 2 -ar 48000 -hls_time 2 -hls_playlist_type vod -hls_flags independent_segments. GOP é a taxa de quadros vezes 2, para que os segmentos comecem em keyframes em todos os níveis.',
        'Como a codificação é guiada por CRF com -maxrate como teto, um nível fica em média no máximo perto da taxa de bits listada (o teto é 1.2 vezes ela) e sai mais baixo em conteúdo fácil. A playlist master anuncia BANDWIDTH como a taxa de bits de vídeo listada mais a de áudio, e CODECS como avc1.640028 com mp4a.40.2 acrescentado quando há áudio.',
        'Por padrão, um visitante pode selecionar de 360p a 720p, uma conta gratuita de 360p a 1080p, e Premium ou Pro a escada completa de 144p a 2160p; origens menores que 360p são recusadas abaixo do Premium. O servidor revalida os níveis no início, então um cliente não consegue pedir um nível que não lhe foi oferecido.',
        'As legendas usam o mesmo modelo Whisper (whisper-ctranslate2, medium) que o transcritor; a faixa principal é gravada em captions/<lang>/auto.vtt com um invólucro subs.m3u8 de um segmento e referenciada no master como EXT-X-MEDIA TYPE=SUBTITLES. Até 3 idiomas extras de uma lista de 37 são traduzidos segmento a segmento por um modelo Ollama local (uma compilação translategemma 12b); uma tradução que falha é registrada como aviso, nunca como trabalho com falha.',
        'Os storyboards são uma única passagem do ffmpeg: fps=1/N com N de 5, 10 ou 15 segundos conforme a duração (menos de 10 minutos, menos de 30, mais longo), blocos de 160 x 90 preenchidos para 16:9 em uma grade de 10 x 10 por sprite JPEG, mais storyboard.vtt com marcações #xywh. A playlist de I-frames recodifica só os keyframes em 240p (select=eq(pict_type,I), libx264 CRF 30, segmentos de 4 segundos) e é listada como EXT-X-I-FRAME-STREAM-INF.',
        'O master traz EXT-X-VERSION:6, EXT-X-INDEPENDENT-SEGMENTS e três entradas EXT-X-SESSION-DATA que nomeiam o produtor, o site e o detentor dos direitos autorais. O report.json registra a análise, as variantes com contagem de segmentos e tamanhos em bytes, avisos e marcações de tempo.',
      ],
      whyItMatters: [
        'O HLS é o formato nativo de streaming do iOS, do Safari e de toda CDN e, com o hls.js, toca também em todos os outros navegadores.',
        'Níveis adaptativos deixam um espectador com conexão fraca continuar assistindo em 360p em vez de ficar carregando em 1080p.',
        'Um pacote VOD pré-segmentado é só arquivos estáticos, então pode ser hospedado em armazenamento de objetos sem nenhum servidor de transcodificação por trás.',
      ],
      useCases: [
        {
          title: 'Plataformas de cursos',
          description: 'Sirva aulas a partir de um bucket com taxa de bits adaptativa e legendas em vários idiomas.',
        },
        {
          title: 'Páginas de produto e marketing',
          description: 'Transmita uma demonstração sem um host de vídeo terceirizado e a marca do player dele.',
        },
        {
          title: 'Portais internos',
          description: 'Hospede vídeos de treinamento na sua própria CDN com miniaturas na barra de progresso.',
        },
        {
          title: 'Acervos',
          description: 'Converta um catálogo antigo em um layout transmissível que você controla e pode espelhar.',
        },
      ],
      workedExamples: [
        {
          title: 'Um clipe de 3 minutos em 1080p nos três níveis padrão',
          body: 'Entrada: um MP4 de 3 minutos em 1920 x 1080 a 30 fps, com 140 MB e áudio estéreo, dentro dos limites para visitantes. Configurações: 360p, 480p e 720p (a seleção padrão e o máximo que um visitante pode escolher), sem legendas nem storyboards, tar.gz. Cada nível é cortado em segmentos de 2 segundos, 90 por nível, com GOP de 60 quadros para que cada segmento comece em um keyframe. Nas taxas de bits listadas, os níveis pesam no máximo cerca de 20 MB para 360p (800 + 96 kbps x 180 s), 30 MB para 480p (1200 + 128 kbps) e 66 MB para 720p (2800 + 128 kbps), cerca de 116 MB no total antes da pequena playlist de I-frames em 240p, e menos em conteúdo fácil, porque a codificação é guiada por CRF com a taxa de bits como teto. O pacote resultante tem 270 segmentos .ts, três arquivos index.m3u8 e o master. O tempo é de três codificações libx264 veryfast de 5400 quadros cada, executadas uma após a outra; o nível de 720p é o que leva mais tempo.',
        },
        {
          title: 'Um webinar de 12 minutos em 720p com legendas em inglês, tradução para espanhol e storyboards',
          body: 'Entrada: um MP4 de 12 minutos em 1280 x 720 a 25 fps, com 380 MB, enviado com uma conta gratuita porque excede o padrão de 5 minutos para visitantes. Configurações: 360p e 720p (1080p fica desabilitado porque a origem é 720p), legendas ativadas com espanhol como idioma extra, storyboards ativados, zip. O Whisper transcreve primeiro os 12 minutos e grava captions/en/auto.vtt; a faixa em espanhol é traduzida em lotes de 30 segmentos para captions/es/auto.vtt, e as duas são listadas como rendições de legenda no master. Os storyboards usam um intervalo de 10 segundos para uma origem acima de 10 minutos: 72 miniaturas de 160 x 90 cabem em um único sprite_001.jpg de 1600 x 900, com um storyboard.vtt apontando para cada bloco. Os dois níveis têm 360 segmentos cada um, de 2 segundos, com GOP de 50 quadros a 25 fps, e pesam no máximo cerca de 81 MB (360p) e 264 MB (720p) nas taxas de bits listadas. O trabalho gasta mais tempo no Whisper e nas duas codificações do que em qualquer outra coisa; a tradução é uma etapa extra curta.',
        },
      ],
      whenNotToUse: 'Não transcodifique para HLS se você só quer um único arquivo menor para enviar ou incorporar; o compressor faz isso em uma passagem, sem segmentos nem playlists. Não use para eventos ao vivo, já que a saída é uma playlist VOD finalizada, não uma origem ao vivo. Se a sua origem está abaixo de 360p, a escada não pode ser montada sem o Premium. E se o seu player é uma tag de vídeo simples sem suporte a HLS, você precisa primeiro de um MP4 ou de um player no estilo hls.js; um master.m3u8 sozinho toca nativamente só no Safari e em dispositivos Apple.',
      whyMediaManipulator: [
        'Cada taxa de bits de nível, CRF, predefinição e flag do FFmpeg está listada nesta página, então o que o pacote contém não é surpresa.',
        'As legendas vêm do nosso próprio transcritor Whisper e as traduções de um modelo no nosso próprio hardware, ambas referenciadas corretamente na playlist master.',
        'O pacote é feito de arquivos simples com um README e um report.json; descompacte em qualquer host estático e aponte um player para o master.m3u8.',
        'Uma transcodificação gasta uma operação da sua cota diária (5 por dia como visitante por padrão, 30 com uma conta gratuita) e é limitada a 10 inícios por hora por sessão; um trabalho que falha é reembolsado. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'Seu envio vai direto do navegador para o nosso bucket de armazenamento e depois é baixado para o nosso próprio servidor, onde rodam o ffprobe, o FFmpeg e, se você marcar legendas, o nosso transcritor Whisper e um modelo de tradução Ollama local; nenhum serviço terceirizado de transcodificação ou IA está envolvido. O objeto de origem, o diretório de trabalho e o pacote finalizado são todos registrados no registro de retenção e excluídos quando a janela termina, e o próprio link de download expira após 30 minutos por padrão. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. A transcodificação não executa a análise de conteúdo automatizada que as conversões padrão recebem. A playlist master gerada contém linhas de session-data que nomeiam o Media Manipulator como produtor; elas não carregam nenhuma informação sobre você.',
      faq: [
        {
          question: 'Quais níveis posso selecionar no meu plano?',
          answer: 'Por padrão, um visitante tem 360p, 480p e 720p; uma conta gratuita adiciona 1080p; Premium e Pro liberam também 144p, 240p e 2160p. Um nível mais alto que a sua origem fica sempre desabilitado, porque nada é ampliado. As etiquetas mostram o motivo ao passar o mouse.',
        },
        {
          question: 'Qual é a duração dos segmentos, e por que 2 segundos?',
          answer: 'Cada nível é cortado em segmentos MPEG-TS de 2 segundos com um keyframe forçado em cada limite, para que um player possa trocar de nível em qualquer segmento sem falha visual. A playlist de I-frames usa segmentos de 4 segundos porque contém só keyframes.',
        },
        {
          question: 'As legendas ficam vinculadas na playlist master?',
          answer: 'Sim. Cada idioma é gravado como captions/<lang>/auto.vtt com um invólucro subs.m3u8 e declarado no master.m3u8 como EXT-X-MEDIA TYPE=SUBTITLES no grupo subs, com o idioma de origem marcado como DEFAULT. Você pode adicionar até 3 idiomas traduzidos da lista de 37.',
        },
        {
          question: 'E se meu vídeo não tiver áudio?',
          answer: 'Os níveis são codificados só com vídeo usando -an, o atributo CODECS omite mp4a.40.2 e a etapa de legendas é pulada com um aviso no report.json, já que não há nada para transcrever.',
        },
        {
          question: 'O que há no pacote, e como hospedo?',
          answer: 'hls/master.m3u8, uma pasta por nível com index.m3u8 e segmentos, hls/iframes/, as pastas opcionais captions/ e storyboards/, README.txt e report.json. Descompacte em qualquer host estático ou bucket que sirva .m3u8 e .ts com os tipos MIME corretos e aponte seu player para o master.m3u8.',
        },
        {
          question: 'Por quanto tempo o link de download funciona, e posso escolher tar.gz ou zip?',
          answer: 'O link pré-assinado dura 30 minutos por padrão; execute o trabalho de novo se ele tiver expirado. Escolha tar.gz (o padrão) ou zip no formulário antes de começar.',
        },
        {
          question: 'Quanto tempo leva uma transcodificação para HLS?',
          answer: 'Cada nível selecionado é uma codificação libx264 completa com a predefinição veryfast, executadas uma após a outra, então o tempo cresce com a duração vezes o número de níveis; o 720p domina os três níveis padrão. As legendas acrescentam uma passagem do Whisper por todo o áudio. A página do trabalho mostra cada etapa à medida que termina.',
        },
      ],
      related: [
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Um único MP4 menor em vez de um pacote de streaming.',
        },
        {
          label: 'Transcrever vídeo',
          to: '/tools/transcribe-video',
          description: 'Obtenha as mesmas legendas do Whisper como um VTT ou SRT independente.',
        },
        {
          label: 'Cortar vídeo',
          to: '/tools/video-trimmer',
          description: 'Remova o começo e o fim mortos antes de transcodificar.',
        },
        {
          label: 'Restauração de vídeo com IA',
          to: '/tools/ai-video-restoration',
          description: 'Amplie um trecho de baixa resolução antes de montar uma escada a partir dele.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Edite e legende o vídeo, depois transcodifique a exportação.',
        },
      ],
      embed: {
        title: 'Transcodificar um vídeo para HLS',
        description: 'Envie um MP4/MOV/WebM/MKV. Analisamos a origem com o ffprobe, deixamos você escolher os níveis de qualidade gratuitos (360p/480p/720p), depois rodamos a codificação H.264 + AAC do ffmpeg e empacotamos um tar.gz do pacote HLS para download.',
      },
    },
    'ai-video-restoration': {
      name: 'Restauração de vídeo com IA',
      h1: 'Ferramenta de restauração de vídeo com IA',
      tagline: 'Amplie e restaure um trecho curto de vídeo com até seis modelos de IA (Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT e VRT) e compare cada resultado lado a lado.',
      metaTitle: 'Restauração de vídeo com IA: compare 6 modelos de upscaling online | Media Manipulator',
      metaDescription: 'Ferramenta gratuita de restauração de vídeo com IA. Passe um clipe curto pelos modelos de super-resolução Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT e VRT na nossa própria GPU e baixe todos os resultados em um único pacote.',
      ogTitle: 'Restauração de vídeo com IA: compare Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT e VRT',
      ogDescription: 'Escolha um trecho do seu vídeo, selecione os modelos de restauração e baixe um único pacote com cada versão aprimorada mais o original para comparação A/B.',
      intro: 'Os modelos de restauração de vídeo discordam entre si. Um upscaler GAN como o Real-ESRGAN entrega quadros individuais nítidos que podem tremular em movimento; um transformer de vídeo como o VRT mantém a sequência estável, mas pode suavizar os detalhes. O único jeito honesto de escolher é passar a mesma filmagem por todos eles e olhar. Esta página faz exatamente isso com um trecho de até 15 segundos: extrai os quadros, roda os seis modelos que você escolher na nossa própria GPU, remonta cada resultado em um MP4 na taxa de quadros da origem com o áudio original e agrupa tudo, inclusive o trecho sem alterações, em um único arquivo para comparação lado a lado. Todos os números abaixo vêm do pipeline como ele roda hoje.',
      whatItDoes: [
        'Corta o trecho que você selecionar (de 0.5 a 15 segundos, no máximo 450 quadros na sua taxa de quadros) com precisão de quadro e com o áudio.',
        'Roda qualquer combinação de Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT e VRT; os três primeiros aprimoram quadro a quadro, os três últimos restauram a sequência como um todo.',
        'Escolhe 4x para origens de até 540p e 2x acima disso, já que todo modelo roda sua rede nativa de 4x e o resultado em 2x é uma redução Lanczos na hora da remontagem.',
        'Remonta cada resultado com libx264 em CRF 16, na fração exata da taxa de quadros da origem, e reanexa o áudio.',
        'Agrupa original/clip.mp4, uma pasta por modelo, quadros PNG aprimorados opcionais para os modelos quadro a quadro, manifest.json e README.txt em um único tar.gz.',
        'Continua quando um modelo falha: a pasta dele recebe um FAILED.txt, o manifesto registra o motivo e todos os outros resultados são entregues mesmo assim.',
      ],
      flowSteps: [
        {
          title: 'Envie um vídeo',
          description: 'Até 1920 x 1080; origens longas não são problema, porque só o trecho é processado.',
        },
        {
          title: 'Selecione um trecho',
          description: 'Arraste as alças para escolher até 15 segundos; 10 segundos ou menos é o recomendado, e o seletor avisa acima disso.',
        },
        {
          title: 'Escolha os modelos e se quer incluir os quadros',
          description: 'Qualquer um dos seis; o seletor mostra uma estimativa de tempo por modelo a partir dos valores de segundos por quadro publicados pelo servidor.',
        },
        {
          title: 'Acompanhe as etapas',
          description: 'Download, análise, extração do clipe, extração dos quadros, depois cada modelo do mais rápido ao mais lento e, por fim, o empacotamento.',
        },
        {
          title: 'Compare e baixe',
          description: 'Reproduza o MP4 de cada modelo ao lado do original no visualizador e depois baixe o arquivo enquanto o link de 6 horas durar.',
        },
      ],
      advancedDetails: [
        'O clipe de referência é cortado com ffmpeg -ss START -i source -t WINDOW -c:v libx264 -crf 10 -preset medium -pix_fmt yuv420p -c:a aac; depois os quadros são extraídos com -vsync 0 em PNGs numerados; se a contagem passar de 450, os quadros excedentes são descartados.',
        'O Real-ESRGAN roda o realesrgan-ncnn-vulkan com o modelo realesrgan-x4plus, escala 4 e blocos de 256 px. O SwinIR usa os pesos GAN 003_realSR_BSRGAN SwinIR-L x4 e o HAT usa Real_HAT_GAN_SRx4, ambos com inferência em blocos (blocos de 320 px, sobreposição de 32 px) para que quadros 1080p caibam na memória.',
        'O BasicVSR++ roda o gerador REDS4 c64n7 pelo mmagic em janelas de 16 quadros; o RVRT (001_RVRT_videosr_bi_REDS_30frames) e o VRT (001_VRT_videosr_bi_REDS_6frames) rodam pelos scripts de teste do KAIR com blocos temporais de 30 e 12 quadros e blocos espaciais de 128 x 128.',
        'A remontagem é uniforme: ffmpeg -framerate FPS_FRACTION -i frames/%06d.png [-i clip.mp4 -map 0:v -map 1:a -c:a aac] [-vf scale=iw/2:ih/2:flags=lanczos] -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -movflags +faststart -shortest. A fração da taxa de quadros, por exemplo 30000/1001, é tirada literalmente do ffprobe para que o áudio continue sincronizado.',
        'Os modelos rodam em uma ordem fixa, Real-ESRGAN, BasicVSR++, SwinIR, RVRT, HAT, VRT, sob uma reserva do agendador de GPU com orçamentos de VRAM de 3, 11, 9, 12, 10 e 14 GB respectivamente, um trabalho de restauração por vez em todo o servidor e um tempo limite de 75 minutos por modelo.',
        'As estimativas por quadro publicadas que o seletor multiplica pela sua contagem de quadros são 0.8 s (Real-ESRGAN), 1.0 s (BasicVSR++), 3.0 s (RVRT), 3.5 s (SwinIR), 5.0 s (HAT) e 7.0 s (VRT); são padrões do servidor que podem mudar, não medições do seu clipe.',
        'O 4x explícito é recusado para origens mais altas que 1080p, porque a saída ultrapassaria 4K; o modo automático escolhe 2x de 541p a 1080p e 4x em 540p ou menos. Os quadros incluídos são os PNGs nativos em 4x mesmo no caminho de 2x, então uma origem 1080p gera quadros de 7680 x 4320.',
      ],
      whyItMatters: [
        'Nenhum modelo de restauração vence em toda filmagem, e comparações de quadros estáticos escondem o tremular que só a reprodução revela.',
        'Um trecho de 10 segundos por todos os modelos custa minutos de GPU e diz qual modelo merece uma execução completa em outro lugar.',
        'Fitas digitalizadas, clipes de câmeras digitais antigas e exportações comprimidas de redes sociais degradam de formas diferentes e respondem a famílias de modelos diferentes.',
      ],
      useCases: [
        {
          title: 'Vídeos antigos de família',
          description: 'Veja qual modelo recupera rostos e tecidos em uma transferência de fita em 480p antes de restaurar o rolo inteiro.',
        },
        {
          title: 'Filmagens de arquivo',
          description: 'Teste 4x em material de 360p e 480p e julgue a saída de classe 4K no seu próprio monitor.',
        },
        {
          title: 'Seleção de modelo antes de uma renderização longa',
          description: 'Escolha o modelo para um trabalho de horas a partir de um teste representativo de 10 segundos.',
        },
        {
          title: 'Downloads comprimidos',
          description: 'Compare a nitidez do GAN com a estabilidade do transformer em exportações cheias de blocos de redes sociais.',
        },
        {
          title: 'Verificações de estabilidade temporal',
          description: 'Reproduza os MP4 de cada modelo lado a lado para notar o tremular e a cintilação que os quadros estáticos escondem.',
        },
      ],
      workedExamples: [
        {
          title: 'Um vídeo caseiro de 8 segundos em 640 x 480 por todos os seis modelos',
          body: 'Entrada: um MP4 de 640 x 480 a 29.97 fps de uma fita digitalizada, com áudio. Configurações: um trecho de 8 segundos, todos os seis modelos, quadros aprimorados incluídos, escala automática. O pipeline corta um clipe de referência de 8 segundos e extrai 240 quadros (8 x 29.97, arredondado). Em 480p a regra automática escolhe 4x, então todo modelo grava quadros de 2560 x 1920 e os MP4 remontados ficam em 2560 x 1920 a 30000/1001 fps com o áudio original. A estimativa do seletor é a contagem de quadros vezes os segundos por quadro publicados: cerca de 3.2 minutos para o Real-ESRGAN, 4 minutos para o BasicVSR++, 12 para o RVRT, 14 para o SwinIR, 20 para o HAT e 28 para o VRT, cerca de 81 minutos no total, porque os modelos rodam um após o outro. Incluir os quadros adiciona 3 x 240 PNGs de 2560 x 1920 ao arquivo, e é por isso que o download se mede em gigabytes, e não em megabytes.',
        },
        {
          title: 'Um clipe 1080p de 10 segundos em escala automática com Real-ESRGAN e BasicVSR++',
          body: 'Entrada: um MP4 de 1920 x 1080 a 30 fps com 90 MB, a maior resolução de origem que a ferramenta aceita. Configurações: um trecho de 10 segundos, Real-ESRGAN e BasicVSR++, quadros excluídos, escala automática. A extração gera 300 quadros, dentro do limite de 450 (a 60 fps o mesmo limite restringiria o trecho a 7.5 segundos). Acima de 540p o automático escolhe 2x, então cada modelo ainda roda sua rede nativa de 4x, produzindo quadros de 7680 x 4320, e a remontagem aplica scale=iw/2:ih/2:flags=lanczos para entregar MP4 de 3840 x 2160 em CRF 16. As estimativas publicadas dão cerca de 4 minutos para o Real-ESRGAN (0.8 s x 300) e 5 minutos para o BasicVSR++ (1.0 s x 300), então o trabalho termina bem antes do tempo limite de 75 minutos por modelo, e o arquivo contém dois MP4 em 4K, o clipe original, manifest.json e README.txt.',
        },
      ],
      whenNotToUse: 'Não use esta página para restaurar um filme inteiro; é uma ferramenta de comparação limitada a 15 segundos e 450 quadros, e mesmo assim o arquivo pode ter gigabytes. Não espere que ela invente o que nunca foi gravado: desfoque de movimento severo, blocos de compressão extrema e filmagens muito escuras melhoram, mas não ficam impecáveis. Origens acima de 1920 x 1080 são recusadas, porque a restauração é voltada a material de baixa resolução e 2x de 1080p já é 4K. Se seu clipe só precisa de um arquivo menor, de uma mudança de formato ou de um corte, o compressor, o conversor e o cortador fazem isso em segundos sem GPU.',
      whyMediaManipulator: [
        'Seis modelos de nível de pesquisa atrás de um único envio, com os pesos, os tamanhos de bloco e o comando de remontagem nomeados nesta página, em vez de escondidos atrás de uma marca.',
        'Tudo roda na nossa própria GPU; sua filmagem nunca vai para um provedor de IA de terceiros, e nada é usado para treinamento.',
        'Uma restauração gasta um trabalho de IA da sua cota diária de IA, que por padrão é de 3 por dia sem conta e 10 com uma conta gratuita, e está limitada a 2 inícios por hora por sessão; um trabalho que falha é reembolsado. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'Seu envio vai do navegador para o nosso bucket de armazenamento e é baixado para o nosso próprio servidor com GPU, onde o FFmpeg corta o trecho e os seis modelos rodam como processos locais; nenhum provedor de IA externo participa, e nada é usado para treinamento. Só o trecho selecionado é decodificado em quadros; o resto da origem nunca é processado. O objeto de origem, os quadros de trabalho, os MP4 por modelo mantidos para o visualizador de comparação e o arquivo de resultados são todos registrados no livro de retenção e excluídos quando a janela termina, e o link do arquivo expira após 6 horas. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Os trabalhos de restauração não passam pela análise de conteúdo automatizada que as conversões comuns recebem.',
      faq: [
        {
          question: 'Qual é o melhor modelo de upscaling de vídeo com IA?',
          answer: 'Depende da filmagem, e é por isso que esta ferramenta existe. Upscalers GAN como Real-ESRGAN e HAT produzem quadros nítidos que podem tremular em movimento; modelos de sequência como BasicVSR++, RVRT e VRT usam os quadros vizinhos para ganhar estabilidade e podem parecer mais suaves. Passe seu próprio trecho por eles e julgue em movimento.',
        },
        {
          question: 'Por que o clipe é limitado a 15 segundos e 450 quadros?',
          answer: 'A restauração é cara por quadro: a estimativa publicada só para o VRT é de 7 segundos por quadro em 4x. O limite de quadros é verificado contra a sua taxa de quadros real, então uma origem a 60 fps fica limitada a 7.5 segundos. Um trecho curto basta para julgar a qualidade antes de uma restauração mais longa em outro lugar.',
        },
        {
          question: 'Como funciona a escolha entre 2x e 4x?',
          answer: 'O automático escolhe 4x para origens de até 540p e 2x acima disso. Todo modelo roda sua rede nativa de 4x de qualquer jeito; no caminho de 2x, a remontagem reduz os quadros pela metade com um filtro Lanczos. O 4x explícito é recusado acima de 1080p porque a saída ultrapassaria 4K.',
        },
        {
          question: 'O vídeo restaurado mantém meu áudio e minha taxa de quadros?',
          answer: 'Sim. O trecho é cortado com o áudio, e toda remontagem usa a fração exata da taxa de quadros vinda do ffprobe (por exemplo 30000/1001) e reanexa esse áudio como AAC, então todos os resultados ficam alinhados para a reprodução A/B.',
        },
        {
          question: 'O que o arquivo de resultados contém, e qual é o tamanho dele?',
          answer: 'original/clip.mp4, uma pasta por modelo com o MP4 dele (e, para Real-ESRGAN, SwinIR e HAT com quadros incluídos, cada PNG aprimorado em 4x nativo), manifest.json com tempos e dimensões, e README.txt. Com os quadros ativados, um clipe de 10 segundos adiciona centenas de PNGs grandes por modelo, então espere gigabytes.',
        },
        {
          question: 'O que acontece se um modelo falhar ou estourar o tempo?',
          answer: 'O trabalho continua. A pasta desse modelo contém um FAILED.txt com o motivo, o manifest.json o registra, e todos os outros modelos selecionados são entregues no arquivo mesmo assim. O trabalho só falha quando todos os modelos selecionados falham.',
        },
        {
          question: 'Quanto tempo leva uma restauração?',
          answer: 'Quadros vezes a estimativa por modelo, somados para os modelos que você escolheu, já que rodam um após o outro: 0.8, 1.0, 3.0, 3.5, 5.0 e 7.0 segundos por quadro para Real-ESRGAN, BasicVSR++, RVRT, SwinIR, HAT e VRT. Um clipe de 300 quadros por todos os seis leva cerca de 100 minutos; só pelo Real-ESRGAN, cerca de 4.',
        },
        {
          question: 'Quantas restaurações posso rodar, e isso custa um trabalho de IA?',
          answer: 'Iniciar uma restauração gasta um trabalho de IA: por padrão 3 por dia sem conta, 10 com uma conta gratuita, 100 no Premium e 200 no Pro, além de um limite de 2 inícios por hora por sessão. Um trabalho que falha por completo é reembolsado. Veja os números atuais na página de preços.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Os trechos são limitados a 15 segundos ou 450 quadros (o que for menor na taxa de quadros do seu vídeo); 10 segundos ou menos é o recomendado.',
          'A resolução da origem é limitada a 1920×1080: a restauração é voltada a filmagens de baixa resolução, e a saída em 4x de 1080p já é 4K+.',
        ],
        processingNotes: [
          'Os modelos rodam do mais rápido ao mais lento (Real-ESRGAN primeiro, VRT por último), então resultados parciais existem desde cedo.',
          'Um modelo com falha nunca derruba o trabalho: a pasta dele contém um FAILED.txt e os outros resultados continuam disponíveis para download.',
          'Os links de download continuam válidos por 6 horas; o arquivo pode ser grande quando os quadros aprimorados são incluídos.',
        ],
      },
      related: [
        {
          label: 'Cortar vídeo',
          to: '/tools/video-trimmer',
          description: 'Corte o trecho que você quer restaurar antes de enviar.',
        },
        {
          label: 'Restauração de imagens com IA',
          to: '/tools/ai-image-restoration',
          description: 'As mesmas famílias de modelos para uma única foto ou quadro.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza um resultado restaurado em 4K para compartilhar.',
        },
        {
          label: 'Transcodificar para HLS',
          to: '/tools/transcode-to-hls',
          description: 'Empacote um clipe restaurado para streaming adaptativo.',
        },
        {
          label: 'Transcrever vídeo',
          to: '/tools/transcribe-video',
          description: 'Adicione legendas à filmagem restaurada.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Edite o trecho restaurado em uma peça mais longa.',
        },
      ],
      embed: {
        title: 'Restauração de vídeo com IA',
        description: 'Envie um vídeo, selecione arrastando um trecho curto (10 segundos ou menos funciona melhor), escolha os modelos de restauração que quer comparar e baixe um único pacote com cada resultado aprimorado.',
      },
    },
    'ai-image-restoration': {
      name: 'Restauração e upscaling de imagens com IA',
      h1: 'Ferramenta de restauração e upscaling de imagens com IA',
      tagline: 'Limpe, amplie e restaure uma foto com até oito modelos de IA: pré-limpeza fiel (FBCNN, SCUNet, NAFNet), upscalers gerais (Real-ESRGAN, SwinIR, HAT) e melhoria de rostos (GFPGAN, CodeFormer), e compare cada resultado com o original.',
      metaTitle: 'Restauração e upscaling de imagens com IA: compare 8 modelos | Media Manipulator',
      metaDescription: 'Restauração e ampliação de fotos com IA, grátis. Remova artefatos JPEG, ruído e desfoque, amplie até 4K/8K com Real-ESRGAN, SwinIR ou HAT e melhore rostos com GFPGAN/CodeFormer, tudo na nossa própria GPU e comparado lado a lado.',
      ogTitle: 'Restauração e upscaling de imagens com IA: pré-limpe, amplie e aprimore rostos',
      ogDescription: 'Envie uma imagem, recorte opcionalmente, pré-limpe opcionalmente, depois rode vários modelos de upscaling e de rosto e compare cada resultado na página com o original.',
      intro: 'A restauração de imagens com IA passa uma foto por um pipeline configurável de até oito modelos e mostra cada resultado ao lado do original. Uma etapa de pré-limpeza que preserva a fidelidade (FBCNN para artefatos JPEG, SCUNet para ruído, NAFNet para desfoque de movimento) remove a degradação sem inventar detalhes; os upscalers gerais (Real-ESRGAN, SwinIR, HAT) então ampliam em 2x ou 4x; e o aprimoramento opcional de rostos (GFPGAN, CodeFormer) reconstrói os rostos. A pré-limpeza não é generativa: ela filtra o sinal que já existe. O aprimoramento de rostos é generativo: ele sintetiza detalhes plausíveis e não deve ser tratado como uma recuperação fiel da origem. Todo modelo roda no nosso próprio servidor com GPU.',
      whatItDoes: [
        'Permite selecionar um recorte arrastando, para que o orçamento de pixels e o tempo de GPU vão para a região que importa a você; o recorte é aplicado no servidor sobre o original com orientação corrigida, então nenhuma qualidade se perde no navegador.',
        'Opcionalmente faz a pré-limpeza primeiro, sempre na ordem FBCNN, SCUNet, NAFNet, cada modelo trabalhando sobre a saída do anterior; a imagem limpa vira a base de onde todo modelo posterior parte.',
        'Roda qualquer combinação de Real-ESRGAN, SwinIR e HAT em 2x ou 4x. Os três são redes nativas de x4; um resultado em 2x é a saída x4 reduzida a 50 por cento com um filtro Lanczos.',
        'Opcionalmente roda o GFPGAN v1.4 e, onde estiver habilitado no servidor, o CodeFormer com um peso de fidelidade, sobre a origem e, com Encadear ativado, também sobre o resultado de cada upscaler.',
        'Agrupa o original preparado, cada PNG de saída, um manifest.json e um README em um único .tar.gz, e mostra uma grade de comparação na página enquanto o arquivo é servido a partir do trabalho.',
        'Registra um modelo com falha como uma entrada falha, com um motivo seguro para o usuário, e ainda assim agrupa todos os resultados que deram certo.',
      ],
      flowSteps: [
        {
          title: 'Envie uma imagem',
          description: 'PNG, JPEG, WebP, TIFF ou BMP de até 12.000 pixels de cada lado; fotos antigas, pequenas e muito comprimidas são o alvo.',
        },
        {
          title: 'Recorte ou mantenha o quadro inteiro',
          description: 'Arraste uma região (um rosto, uma placa, um letreiro) ou deixe o recorte desativado para restaurar tudo.',
        },
        {
          title: 'Escolha pré-limpeza, upscalers, rostos e escala',
          description: 'Marque os modelos que quiser; o seletor mostra quantas saídas a seleção vai produzir das 12 permitidas.',
        },
        {
          title: 'Acompanhe as etapas',
          description: 'O trabalho entra na fila da única vaga de restauração, prepara a imagem e depois roda cada unidade com o próprio progresso e indicador de falha.',
        },
        {
          title: 'Compare e baixe',
          description: 'Cada resultado fica ao lado do original na grade; baixe o arquivo quando tiver decidido qual pipeline venceu.',
        },
      ],
      advancedDetails: [
        'A etapa de preparação roda o ImageMagick -auto-orient para um PNG normalizado, lê as dimensões dele, rejeita qualquer coisa acima de 12.000 x 12.000, converte seu retângulo de recorte normalizado em pixels inteiros e grava o working_source.png. Esse arquivo também é salvo como original.png nos resultados, então o que você compara é exatamente o que os modelos receberam.',
        'A escala automática escolhe 4x quando o recorte tem 540 pixels de altura ou menos e 2x nos demais casos. Seja qual for a escala, a saída é verificada contra um orçamento de 67.108.864 pixels (cerca de 64 megapixels): uma imagem inteira de 6.000 x 4.000 em 2x dá 96 megapixels e é recusada com uma mensagem pedindo para escolher 2x ou um recorte menor.',
        'O Real-ESRGAN roda a rede realesrgan-x4plus pelo realesrgan-ncnn-vulkan com blocos de 256 pixels. O SwinIR usa os pesos GAN 003_realSR_BSRGAN SwinIR-L x4 e o HAT, os pesos Real_HAT_GAN_SRx4, ambos pelo mesmo script por quadro da Restauração de vídeo com IA, com blocos de 320 pixels e sobreposição de 32 pixels, para que recortes grandes nunca ultrapassem a memória da GPU.',
        'Os pesos de pré-limpeza são fbcnn_color.pth, scunet_color_real_psnr.pth (o modelo de ruído real treinado por PSNR, não a variante GAN que inventa textura) e NAFNet-GoPro-width64.pth (desfoque de movimento, não de foco). Eles rodam em blocos de 512 pixels com sobreposição de 32 pixels e nunca alteram as dimensões. O FBCNN prevê o fator de qualidade JPEG às cegas, a menos que você defina um de 1 a 100; um número menor presume compressão mais pesada.',
        'O GFPGAN usa a arquitetura clean v1.4 com a ampliação do fundo desativada, então, fora dos rostos, a imagem é simplesmente redimensionada pelo fator de escala em vez de aprimorada pelo modelo; isso mantém a comparação honesta. O CodeFormer recebe um peso de fidelidade w de 0 a 1 (padrão 0.7): mais baixo fica mais bonito, mais alto fica mais próximo da entrada. O CodeFormer é distribuído sob uma licença não comercial e fica atrás de uma flag do servidor que vem desativada por padrão.',
        'Encadear roda de novo cada modelo de rosto em 1x sobre a saída de cada upscaler, além da origem, então a contagem de saídas é pré-limpeza + gerais + rostos + rostos x gerais. O servidor limita um trabalho a 12 saídas, roda um trabalho de restauração por vez e dá a cada modelo 1.800 segundos antes de marcá-lo como tempo esgotado.',
        'O servidor estima o tempo de execução por modelo a partir dos próprios padrões de segundos por megapixel: FBCNN 3, SCUNet 8, NAFNet 6, Real-ESRGAN 2, SwinIR 12, HAT 18, GFPGAN 6, CodeFormer 8. Eles alimentam os pesos do progresso e a estimativa da interface; são valores de ajuste, não uma garantia.',
        'Os resultados não são enviados para o armazenamento de objetos: o .tar.gz e os PNGs de resultado ficam na pasta de saída do trabalho e são servidos a partir dele durante a janela de retenção.',
      ],
      whyItMatters: [
        'Nenhum modelo vence em toda foto: remoção de artefatos, redução de ruído, upscaling e reconstrução de rostos corrigem danos diferentes, e a ordem certa depende de como a imagem foi degradada.',
        'Rodar vários modelos em um único envio e vê-los lado a lado responde à pergunta “qual deles, e em que escala?” antes de você se comprometer com um lote maior.',
        'A distinção entre não generativo e generativo importa: uma imagem pré-limpa é uma cópia filtrada da evidência, uma imagem com rostos aprimorados é uma reconstrução plausível, e a página indica qual é qual.',
      ],
      useCases: [
        {
          title: 'Restaurar fotos antigas ou digitalizadas',
          description: 'Pré-limpe o ruído do scanner e a compressão, depois amplie e, se quiser, reconstrua os rostos.',
        },
        {
          title: 'Aprimorar imagens de baixa resolução',
          description: 'Recorte a região de interesse, remova os artefatos e amplie; encadeie o aprimoramento de rostos para ganhar clareza, nunca como prova de identificação.',
        },
        {
          title: 'Consertar downloads comprimidos',
          description: 'Exportações de redes sociais muito recomprimidas respondem bem a FBCNN e depois SCUNet, seguidos de um upscaler GAN.',
        },
        {
          title: 'Comparar upscalers antes de um lote',
          description: 'Passe uma imagem representativa por Real-ESRGAN, SwinIR e HAT para escolher o modelo de um conjunto maior.',
        },
        {
          title: 'Gastar o orçamento em uma única região',
          description: 'Selecione arrastando só um rosto ou um letreiro, para que o orçamento de 64 megapixels e o tempo de GPU vão para onde importa.',
        },
      ],
      workedExamples: [
        {
          title: 'Um JPEG de 1.200 x 800 (cerca de 350 KB), quadro inteiro, escala automática, FBCNN + Real-ESRGAN + GFPGAN',
          body: 'O recorte é o quadro inteiro de 0.96 megapixel, e a altura de 800 pixels passa de 540, então a escala automática resolve para 2x. O FBCNN roda primeiro em 1x e a saída dele vira a origem de trabalho. O Real-ESRGAN amplia isso para 4.800 x 3.200 com o realesrgan-x4plus; depois o ImageMagick o redimensiona a 50 por cento com Lanczos, resultando em um PNG de 2.400 x 1.600. O GFPGAN roda sobre a origem pré-limpa com ampliação 2, gerando outro PNG de 2.400 x 1.600 com os rostos reconstruídos e o resto simplesmente redimensionado. São três saídas das 12 permitidas. Pelas próprias estimativas por megapixel do servidor, o tempo dos modelos é de cerca de 0.96 x (3 + 2 + 6), em torno de 11 segundos, mais alguns segundos de preparação e empacotamento; esperar pela única vaga de restauração pode acrescentar mais. Um trabalho gasta um trabalho de IA.',
        },
        {
          title: 'Um recorte de rosto de 300 x 400 de uma imagem de 640 x 480, pré-limpeza, três upscalers, GFPGAN com Encadear',
          body: 'O recorte tem 0.12 megapixel e 400 pixels de altura, então a escala automática escolhe 4x e todo resultado ampliado fica em 1.200 x 1.600 (1.92 megapixel), bem dentro do orçamento de 64 megapixels. Com a pré-limpeza FBCNN e SCUNet, Real-ESRGAN, SwinIR e HAT, e o GFPGAN encadeado, o trabalho produz 2 + 3 + 1 + 1 x 3 = 9 saídas: duas etapas de pré-limpeza, três ampliações, o GFPGAN sobre a origem limpa e o GFPGAN sobre cada resultado ampliado em 1x. As passagens de pré-limpeza e ampliação sobre 0.12 megapixel levam alguns segundos cada, pelas estimativas do servidor, enquanto as três passagens de rosto encadeadas rodam sobre os resultados de 1.92 megapixel e demoram proporcionalmente mais. Cada saída de rosto carrega uma nota generativa no manifesto, porque o que você vê nesses rostos é reconstrução, não recuperação.',
        },
      ],
      whenNotToUse: 'Não use o aprimoramento de rostos para identificação: o GFPGAN e o CodeFormer desenham rostos plausíveis a partir de um conhecimento prévio aprendido, então um rosto reconstruído é, no máximo, uma pista, e nunca prova de quem estava na foto. Dispense a ferramenta para imagens que já são grandes e nítidas, em que uma passagem de 2x acrescenta sobretudo textura de GAN, e para fotos com mais de 12.000 pixels de lado, que são recusadas. Se você só precisa de uma cópia maior de uma imagem limpa, sem pré-limpeza, modelos de rosto ou grade de comparação, o Upscaler de imagens com IA custa menos tempo. E se o seu dano é desfoque de foco, e não de movimento, os pesos GoPro do NAFNet são o modelo errado para isso.',
      whyMediaManipulator: [
        'Oito modelos de pesquisa atrás de um único envio, sem notebooks, configuração de CUDA ou arquivos de pesos para gerenciar.',
        'Todo modelo roda em um servidor com GPU que nós operamos; a imagem não é enviada a um serviço de IA de terceiros.',
        'A página mantém a distinção honesta: as saídas de pré-limpeza carregam uma nota de fidelidade, as saídas de rosto uma nota generativa, e o original preparado está sempre na grade.',
      ],
      privacyNote: 'Sua imagem é salva na pasta do trabalho, tem a orientação corrigida e é recortada pelo ImageMagick em um PNG de trabalho, e é processada pelos modelos selecionados na nossa própria GPU. Quando o trabalho termina, a pasta de envio e a árvore de trabalho são excluídas; o que permanece com o trabalho é o original preparado, cada PNG de resultado, o manifesto e o .tar.gz empacotado, servidos a partir do trabalho para download e para a grade de comparação. As saídas dos modelos de rosto são identificadas como reconstruções generativas nesse manifesto. Nenhum provedor de IA de terceiros recebe a imagem. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'Qual é a diferença entre a pré-limpeza e os modelos de upscaling ou de rosto?',
          answer: 'Os modelos de pré-limpeza (FBCNN, SCUNet, NAFNet) não são generativos: eles removem artefatos de compressão, ruído e desfoque de movimento filtrando o sinal existente em 1x. Os upscalers adicionam resolução, e os modelos de rosto (GFPGAN, CodeFormer) são generativos, sintetizando detalhes faciais plausíveis. Uma saída de pré-limpeza é uma imagem filtrada fiel; uma saída de rosto é uma reconstrução.',
        },
        {
          question: 'Um rosto aprimorado pode ser usado como prova de identificação?',
          answer: 'Não. O GFPGAN e o CodeFormer produzem rostos plausíveis a partir de um conhecimento prévio aprendido; eles não recuperam o rosto verdadeiro. O manifesto marca cada saída de rosto com uma nota generativa exatamente por esse motivo. Use-os só para clareza visual e pistas.',
        },
        {
          question: 'Por que os modelos de pré-limpeza rodam em uma ordem fixa, seja o que eu marcar?',
          answer: 'Os artefatos de compressão precisam sair antes da redução de ruído, senão o redutor de ruído trata os blocos como sinal, e a remoção de desfoque funciona melhor na entrada mais limpa, então o servidor sempre roda FBCNN, depois SCUNet, depois NAFNet, cada um sobre o resultado anterior. Se um deles falhar, o próximo continua a partir da última etapa bem-sucedida.',
        },
        {
          question: 'Como a escala Automática decide entre 2x e 4x, e qual é o limite de tamanho?',
          answer: 'A Automática escolhe 4x quando o recorte tem no máximo 540 pixels de altura e 2x nos demais casos. A saída é então verificada contra um orçamento de cerca de 64 megapixels (67.108.864 pixels); um pedido acima disso é recusado com a contagem de megapixels e uma sugestão de escolher 2x ou um recorte menor. Origens com mais de 12.000 pixels em qualquer um dos lados são rejeitadas antes disso.',
        },
        {
          question: 'O que Encadear faz com o número de saídas?',
          answer: 'Com Encadear ativado, cada modelo de rosto também roda em 1x sobre o resultado de cada upscaler, então saídas = pré-limpeza + gerais + rostos + rostos x gerais. Dois upscalers e dois modelos de rosto com encadeamento dão 2 + 2 + 4 = 8 saídas antes de qualquer pré-limpeza; o servidor permite 12 por trabalho.',
        },
        {
          question: 'O que acontece se um modelo de imagem falhar ou estourar o tempo?',
          answer: 'O trabalho continua. A unidade é marcada como falha com um motivo seguro para o usuário (por exemplo, um tempo esgotado após 1.800 segundos sugerindo um recorte menor ou 2x), o manifesto o registra, e todos os outros resultados são empacotados e exibidos mesmo assim. O trabalho só falha quando todos os modelos selecionados falham, e então o trabalho de IA é reembolsado.',
        },
        {
          question: 'Por que o CodeFormer está acinzentado?',
          answer: 'O CodeFormer é licenciado para uso não comercial, então fica atrás de uma flag do servidor que vem desativada por padrão; os recursos então o reportam como desativado no momento. O GFPGAN e os três modelos de pré-limpeza têm licenças permissivas e ficam disponíveis sempre que seus pesos estiverem instalados.',
        },
        {
          question: 'Quantas restaurações posso rodar, e é grátis?',
          answer: 'Iniciar uma restauração gasta um trabalho de IA: 3 por dia como visitante, 10 com uma conta gratuita, 100 no Premium e 200 no Pro por padrão, independentemente de quantos modelos você marcar nesse trabalho. Há também um limite dedicado de 6 inícios por sessão por hora. O limite de envio é de 200 MB para visitantes e 1 GB com uma conta gratuita; /pricing mostra os números atuais.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'A saída é limitada por um orçamento de pixels (~64 megapixels), bem acima de 8K; se um recorte e uma escala ultrapassarem esse valor, escolha 2x ou um recorte menor.',
          'Os modelos de pré-limpeza nunca alteram as dimensões (1x); só os upscalers gerais mudam a resolução.',
        ],
        processingNotes: [
          'A pré-limpeza sempre roda primeiro, em uma ordem fixa (FBCNN → SCUNet → NAFNet); a imagem limpa vira a base de todos os outros modelos.',
          'Um modelo com falha nunca derruba o trabalho: a entrada dele mostra o motivo e os outros resultados continuam disponíveis para download.',
          'O aprimoramento de rostos é uma reconstrução generativa: use-o para clareza e pistas, não como prova de identificação.',
        ],
      },
      related: [
        {
          label: 'Restauração de vídeo com IA',
          to: '/tools/ai-video-restoration',
          description: 'A versão para imagens em movimento: os mesmos upscalers em um clipe curto.',
        },
        {
          label: 'Upscaler de imagens com IA',
          to: '/tools/ai-image-upscaler',
          description: 'Uma única passagem de Real-ESRGAN quando você só precisa de uma imagem maior.',
        },
        {
          label: 'Remover fundo',
          to: '/tools/remove-background-from-image',
          description: 'Recorte o objeto depois de restaurá-lo.',
        },
        {
          label: 'Comprimir imagem',
          to: '/tools/compress-image',
          description: 'Reduza o PNG restaurado para compartilhar.',
        },
        {
          label: 'Redimensionar imagem',
          to: '/tools/image-resizer',
          description: 'Redimensione a imagem restaurada para dimensões exatas.',
        },
        {
          label: 'Remover metadados EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Remova os metadados do resultado antes de publicá-lo.',
        },
      ],
      embed: {
        title: 'Restauração e upscaling de imagens com IA',
        description: 'Envie uma imagem, recorte opcionalmente uma região, faça opcionalmente a pré-limpeza, escolha os modelos de upscaling e de aprimoramento de rostos que quer comparar e baixe um único pacote com cada resultado.',
      },
    },
    'ai-document-scan': {
      name: 'Digitalização de documentos com IA',
      h1: 'Digitalização de documentos com IA: páginas escaneadas e manuscritos em PDF/Word pesquisável',
      tagline: 'Transforme documentos digitalizados e anotações manuscritas em um PDF de várias páginas pesquisável e em um documento Word editável: páginas impressas recebem uma camada de texto Tesseract fiel, e a escrita à mão é transcrita por uma IA de visão com a incerteza marcada, nunca inventada.',
      metaTitle: 'Digitalização com IA: páginas escaneadas e manuscritos em PDF/Word | Media Manipulator',
      metaDescription: 'Digitalização de documentos com IA, grátis: converta imagens escaneadas em PDF pesquisável e em Word com OCR, e transcreva anotações manuscritas em texto. Reordene páginas, misture texto impresso e manuscrito, tudo na nossa própria GPU, literalmente e com a incerteza marcada.',
      ogTitle: 'Digitalização de documentos com IA: PDF pesquisável + Word a partir de digitalizações e manuscritos',
      ogDescription: 'Envie uma ou mais páginas digitalizadas, impressas ou manuscritas, reordene-as e receba um PDF pesquisável e um DOCX editável. As páginas impressas continuam fiéis; o manuscrito é transcrito literalmente com os marcadores [illegible]/[?] preservados.',
      intro: 'A Digitalização de documentos com IA transforma uma ou mais páginas fotografadas ou escaneadas em um PDF pesquisável de várias páginas e, se você pedir, em um documento Word editável. Ela trata dois tipos de página de forma diferente e informa qual é qual. Páginas impressas ou datilografadas passam pelo OCRmyPDF e pelo Tesseract: a página de saída é a sua digitalização, sem alterações, com uma camada de texto invisível por baixo para você pesquisar, selecionar e copiar. Páginas manuscritas são lidas por um modelo de visão e linguagem que roda na nossa própria GPU, que transcreve a escrita palavra por palavra, marca o que não consegue ler como [illegible] e envolve uma palavra duvidosa como [?: melhor suposição], e recebe a instrução de nunca completar, corrigir ou arrumar nada. Um único trabalho pode misturar os dois tipos, página por página, na ordem que você definir, e o resultado nomeia o mecanismo e a confiança de cada página.',
      whatItDoes: [
        'Aceita até 50 imagens de página por trabalho (PNG, JPEG, WebP, TIFF, BMP ou HEIC, 25 MB cada por padrão), normaliza cada uma em um PNG na orientação correta e permite arrastá-las para a ordem de leitura antes de começar.',
        'No modo Automático, faz ao modelo de visão uma pergunta por página (impressa ou manuscrita?) e encaminha a página de acordo; os modos Impresso e Manuscrito forçam a resposta.',
        'Monta um PDF/A em que cada página impressa é a digitalização original mais uma camada de texto do Tesseract, e cada página manuscrita é a digitalização mais uma camada invisível de transcrição automática posicionada linha por linha, com um rodapé visível dizendo isso.',
        'Opcionalmente monta um documento Word: páginas impressas reconstruídas como títulos, listas e tabelas pelo PaddleOCR-VL (ou Docling), páginas manuscritas como a transcrição literal sob uma nota em negrito pedindo para conferir com a digitalização, renderizado pelo Pandoc.',
        'Informa, por página, o mecanismo usado, uma confiança alta, média ou baixa e o número de marcadores de incerteza, para você saber onde olhar.',
        'Pode rodar uma passagem de verificação que relê só os tokens marcados, uma segunda opinião independente que sinaliza divergências como [?: vlm | other] e um resumo por IA identificado separadamente, quando o servidor tem esses mecanismos habilitados.',
      ],
      flowSteps: [
        {
          title: 'Adicione suas páginas',
          description: 'Solte uma imagem de página por arquivo, impressa, manuscrita ou uma mistura, e arraste-as para ordenar.',
        },
        {
          title: 'Escolha o modo e as saídas',
          description: 'Automático, Impresso ou Manuscrito; PDF sempre, Word opcionalmente; o idioma do Tesseract para páginas impressas; alinhar e girar automaticamente para o OCR de impressos.',
        },
        {
          title: 'Preparar e ler',
          description: 'As páginas têm a orientação corrigida e, no caso de manuscritos, são ampliadas em 2x com o Real-ESRGAN antes de o modelo lê-las; as páginas impressas esperam pelo Tesseract na etapa do PDF.',
        },
        {
          title: 'Montar os arquivos',
          description: 'O OCRmyPDF e o reportlab criam os PDFs por página, o pikepdf os mescla; o documento Word é montado a partir de Markdown pelo Pandoc.',
        },
        {
          title: 'Revise e baixe',
          description: 'Um visualizador abre o PDF; baixe-o, o arquivo Word se tiver pedido, e o manifesto que registra o mecanismo e a confiança de cada página.',
        },
      ],
      advancedDetails: [
        'Páginas impressas: o PNG normalizado é envolvido sem perdas com o img2pdf; depois o OCRmyPDF roda o Tesseract com o(s) seu(s) código(s) de idioma, deskew e rotate_pages quando marcados, output_type pdfa e force_ocr, e grava a camada de texto sob a imagem. Se o OCRmyPDF falhar em uma página, a página só com imagem é mantida, então o PDF continua completo.',
        'Páginas manuscritas: o modelo é o qwen3-vl (8B, instruct, quantização q8_0) servido pelo Ollama com temperatura 0.1, instruído a transcrever literalmente, manter as quebras de linha, marcar [illegible] e [?: suposição], anotar marcas como (seta) ou (circulado) e devolver JSON com o texto completo e uma caixa delimitadora por linha.',
        'A página de PDF manuscrita é desenhada com o reportlab no tamanho em pixels da imagem: a digitalização é a página visível, cada linha transcrita é posicionada na sua caixa delimitadora no modo de renderização de texto 3 (pesquisável, nunca desenhado) em Helvetica, com tamanho ajustado à altura da linha entre 6 e 48 pontos, com um bloco invisível de página inteira como alternativa quando nenhuma caixa é devolvida, e um rodapé cinza de 8 pontos com o texto “Transcrição automática, confira com o original”.',
        'A confiança é calculada, não adivinhada: alta quando a página não tem marcadores, média quando menos de 15 por cento das linhas dela têm um, baixa nos demais casos. A passagem de verificação (ativada por padrão) envia a página e o rascunho de volta ao modelo com instruções para resolver só os tokens marcados e não alterar mais nada; se ela falhar, o rascunho é mantido.',
        'A pré-limpeza de manuscritos é o realesrgan-x4plus em escala 2 na GPU Vulkan, ativada por padrão em Automático e Manuscrito e desativada em Impresso; é feita na medida do possível, e os originais são mantidos se ela falhar. O documento Word é montado a partir de Markdown no sabor do GitHub pelo Pandoc; o resumo opcional usa um modelo de texto separado e é gravado em um arquivo próprio com um rótulo de gerado por IA.',
        'Um trabalho de documento roda por vez no servidor por padrão, cada chamada de modelo tem um teto de 40 minutos, e os envios e a pasta de trabalho são excluídos no instante em que o trabalho termina; só a pasta de resultados (PDF, DOCX, manifest.json, README.txt) permanece durante a janela de retenção.',
      ],
      whyItMatters: [
        'A foto de uma página não é um documento até que possa ser pesquisada e citada. O PDF acrescenta isso sem tocar nos pixels, então a digitalização continua sendo a autoridade.',
        'Um reconhecimento de manuscrito que adivinha com confiança é pior que nenhum. Marcadores explícitos [illegible] e [?: suposição], uma confiança por página e um rótulo visível tornam a transcrição útil como rascunho e nunca confundível com o original.',
        'Páginas impressas e manuscritas precisam de mecanismos diferentes. Encaminhar cada página para o mecanismo certo, dentro de um único trabalho ordenado, é o que faz um caderno com um formulário impresso e respostas manuscritas sair como um único arquivo.',
      ],
      useCases: [
        {
          title: 'Papelada pesquisável',
          description: 'Contratos, recibos e formulários escaneados viram um único PDF/A em que você pode pesquisar e copiar, com as imagens das páginas sem alterações.',
        },
        {
          title: 'Cadernos de campo e de laboratório',
          description: 'Anotações manuscritas viram um PDF pesquisável e um rascunho em Word com cada palavra incerta marcada para você conferir.',
        },
        {
          title: 'Imagem para Word',
          description: 'Uma página impressa fotografada com o celular vira um .docx editável com os títulos, as listas e as tabelas reconstruídos.',
        },
        {
          title: 'Documentos mistos',
          description: 'Um questionário impresso com respostas manuscritas passa pelos dois mecanismos e volta como um único arquivo ordenado.',
        },
        {
          title: 'Arquivos históricos',
          description: 'Cartas e atas datilografadas antigas ganham uma camada de texto para indexação enquanto a digitalização permanece exatamente como estava.',
        },
      ],
      workedExamples: [
        {
          title: 'Três páginas A4 impressas a 300 dpi',
          body: 'Três digitalizações JPEG de 2480 x 3508 no modo Impresso, só PDF, idioma eng, alinhar e girar automaticamente ativados. Nenhum modelo participa: cada página é envolvida pelo img2pdf; depois o OCRmyPDF roda o Tesseract e grava uma camada de texto invisível, gera PDF/A, e o pikepdf mescla as três em document.pdf. A camada de texto acrescenta só alguns kilobytes por página, então o PDF tem mais ou menos o tamanho das três imagens de página (uma página alinhada é renderizada de novo, uma sem alterações é incorporada como está). O trabalho gasta um trabalho de IA (reembolsado se falhar), e o tempo dele é o Tesseract na CPU, página após página, mais qualquer espera na fila, já que um trabalho de documento roda por vez por padrão.',
        },
        {
          title: 'Duas páginas manuscritas fotografadas com o celular, com Word',
          body: 'Duas fotos de celular de 4032 x 3024 de páginas de caderno no modo Automático com PDF e DOCX. A preparação corrige a orientação de ambas para PNG e, como o modo não é Impresso, amplia-as em 2x com o realesrgan-x4plus para 8064 x 6048. A classificação faz ao qwen3-vl uma pergunta por página, o reconhecimento devolve a transcrição com uma caixa delimitadora por linha, e a verificação relê só os tokens marcados. Se uma página tem 30 linhas e 2 delas carregam marcadores [?: ...], 2 / 30 fica abaixo de 15 por cento e a página é marcada com confiança média e illegibleCount 2. As páginas do PDF são as imagens processadas com linhas invisíveis em Helvetica nessas caixas e o carimbo do rodapé; o arquivo Word contém o texto literal sob a nota de conferência em negrito. O tempo é de três passagens sequenciais do modelo de visão por página na nossa GPU; nada roda em outro lugar.',
        },
      ],
      whenNotToUse: 'Não use isto quando precisar que o texto seja autoritativo sem conferência: a saída de manuscrito é uma leitura automática com lacunas marcadas, e o documento Word e o resumo são reconstruções, então confira-os com a digitalização antes de citá-los. Não é uma ferramenta de OCR de PDF para PDF: as entradas são imagens de página, então renderize um PDF existente em imagens primeiro, e não é um tradutor. Se você só precisa das páginas reunidas em um PDF sem camada de texto, a ferramenta simples de imagem para PDF faz isso como um trabalho comum em vez de um trabalho de IA, o que preserva a cota de visitante de três trabalhos de IA por dia para o que precisa de um modelo.',
      whyMediaManipulator: [
        'O PDF de impressos é fiel por construção: o OCRmyPDF posiciona o texto sob uma imagem de página sem alterações e gera PDF/A, nada é redesenhado.',
        'O manuscrito é literal e com evidências: o prompt proíbe invenção, a incerteza é marcada no texto, a confiança é contada a partir dessas marcas, e a página diz que é uma transcrição automática.',
        'Todos os mecanismos são nossos: Tesseract na CPU, qwen3-vl e o modelo de texto pelo Ollama, PaddleOCR-VL e Real-ESRGAN nas nossas GPUs. Nenhuma página vai para um serviço de IA de terceiros.',
      ],
      privacyNote: 'Suas imagens de página são salvas em uploads/<jobId>/src/ e as cópias normalizadas em uma pasta de trabalho; as páginas manuscritas são enviadas ao modelo qwen3-vl servido pelo Ollama na nossa própria GPU, as páginas impressas são lidas pelo Tesseract na CPU, e os rascunhos de transcrição por página ficam guardados como JSON nessa pasta de trabalho enquanto o trabalho roda. Quando o trabalho termina, tanto os envios quanto a pasta de trabalho são excluídos imediatamente; o que permanece é a pasta de resultados em outputs/<jobId>/ com o PDF, o arquivo Word se tiver sido pedido, o manifesto (mecanismo, confiança e contagem de marcadores por página) e um README, e essa pasta é removida quando a janela de retenção termina. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O texto transcrito fica dentro da camada de texto do PDF e do DOCX que você baixa. Nada é enviado a um provedor de IA de terceiros, e nada é usado para treinamento.',
      faq: [
        {
          question: 'Qual é a diferença entre o PDF e o documento Word?',
          answer: 'O PDF é a sua digitalização com uma camada de texto pesquisável: uma camada do Tesseract sob uma página impressa, uma transcrição automática invisível sob uma manuscrita, nos dois casos com a imagem original como página visível. O documento Word é uma reconstrução separada: páginas impressas como títulos, listas e tabelas produzidos pelo PaddleOCR-VL ou pelo Docling, páginas manuscritas como a transcrição literal sob uma nota em negrito pedindo para você conferir. Trate a imagem do PDF como a autoridade e o DOCX como um rascunho.',
        },
        {
          question: 'Quão confiável é a transcrição de manuscritos?',
          answer: 'É uma leitura automática cuidadosa, não uma transcrição certificada. O modelo é instruído a copiar exatamente o que está escrito, a marcar tudo o que for ilegível como [illegible] e qualquer palavra duvidosa como [?: melhor suposição], e a nunca inventar ou corrigir. Cada página recebe uma confiança (alta sem marcadores, média com menos de 15 por cento das linhas marcadas, baixa acima disso) e uma contagem de marcadores, e a página do PDF carrega um rodapé visível de transcrição automática. Leia as palavras marcadas comparando com a digitalização.',
        },
        {
          question: 'Posso misturar páginas impressas e páginas manuscritas?',
          answer: 'Sim. No modo Automático, o modelo de visão é perguntado, para cada página, se ela é predominantemente impressa ou manuscrita, e a página vai para o Tesseract ou para o modelo de manuscrito de acordo. O manifesto registra a resposta por página, e o PDF e o arquivo Word finais mantêm a ordem que você definiu antes de começar.',
        },
        {
          question: 'Quais idiomas o OCR de impressos suporta?',
          answer: 'Códigos de idioma do Tesseract, unidos com um sinal de mais para páginas mistas (por exemplo, eng+fra). Os códigos que o servidor oferece estão listados no formulário; o inglês vem instalado por padrão, e outros aparecem conforme são adicionados. O manuscrito é lido por um modelo de visão e não usa esses códigos.',
        },
        {
          question: 'Quais são os limites por trabalho?',
          answer: 'Por padrão, até 50 imagens de página por trabalho (cada imagem é uma página, então 50 também é o limite de páginas na prática), 25 MB por imagem, um trabalho em execução por vez por servidor (os outros esperam na fila) e um teto de 40 minutos por etapa de modelo. Cada trabalho gasta um trabalho de IA: 3 por dia sem conta, 10 com uma conta gratuita, 100 com o Premium e 200 com o Pro, com a unidade reembolsada quando um trabalho falha. Os números atuais estão na página de preços.',
        },
        {
          question: 'Por que meu PDF de manuscrito tem um rodapé, e posso removê-lo?',
          answer: 'Cada página manuscrita carrega uma pequena linha cinza “Transcrição automática, confira com o original”, e a seção do Word tem um equivalente em negrito, porque uma cópia pesquisável de um manuscrito pode ser confundida com uma cópia verificada. Eles fazem parte da saída por design e não podem ser desativados. As páginas impressas, cuja camada é a saída determinística do Tesseract, não carregam carimbo.',
        },
        {
          question: 'Minhas páginas saem dos seus servidores?',
          answer: 'Não. O Tesseract roda na CPU, o modelo de manuscrito e classificação roda pelo Ollama na nossa GPU, e o mecanismo de estrutura e o upscaler rodam em uma segunda GPU na mesma máquina. Os envios e os arquivos de trabalho são excluídos assim que o trabalho termina.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Adicione até 50 imagens de página por trabalho por padrão; cada imagem de página tem um limite de tamanho individual (~25 MB).',
          'Um PDF pesquisável é sempre produzido; o documento Word editável é opcional.',
        ],
        processingNotes: [
          'As páginas impressas usam OCR determinístico (OCRmyPDF + Tesseract) para uma camada de texto fiel e pesquisável.',
          'O manuscrito é transcrito literalmente por uma IA de visão com os marcadores [illegible]/[?] preservados: é uma transcrição automática, não a página autoritativa.',
          'O documento Word e qualquer resumo por IA são reconstruções: confira-os com a digitalização original.',
        ],
      },
      related: [
        {
          label: 'Imagem para PDF',
          to: '/tools/image-to-pdf',
          description: 'Reúna imagens de página em um PDF sem camada de texto, como um trabalho comum.',
        },
        {
          label: 'PDF para JPG',
          to: '/tools/pdf-to-jpg',
          description: 'Renderize um PDF existente em imagens de página que você pode enviar para a digitalização.',
        },
        {
          label: 'Restauração de imagens com IA',
          to: '/tools/ai-image-restoration',
          description: 'Repare uma digitalização desbotada ou borrada antes de transcrevê-la.',
        },
        {
          label: 'Remover metadados EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Remova as tags de localização e de dispositivo das fotos de documentos feitas com o celular.',
        },
        {
          label: 'Ocultar texto em imagem',
          to: '/tools/redact-text-in-image',
          description: 'Tarje nomes ou números em uma página antes de compartilhar a digitalização.',
        },
      ],
      embed: {
        title: 'Digitalização de documentos com IA',
        description: 'Adicione uma ou mais imagens de páginas digitalizadas (documentos impressos ou anotações manuscritas), reordene-as se necessário, escolha um tipo de conteúdo e as saídas, e receba um PDF pesquisável mais um documento Word opcional.',
      },
    },
    'ai-image-upscaler': {
      name: 'Upscaler de imagens com IA',
      h1: 'Upscaler de imagens com IA: amplie fotos em 2x ou 4x online',
      tagline: 'Amplie uma foto pequena ou suave com um modelo Real-ESRGAN que reconstrói detalhes finos em vez de apenas esticar os pixels.',
      metaTitle: 'Upscaler de imagens com IA: amplie fotos em 2x ou 4x | Media Manipulator',
      metaDescription: 'Amplie uma foto de baixa resolução em 2x ou 4x com uma IA que restaura bordas e texturas. Roda na nossa própria GPU, saída em PNG. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Upscaler de imagens com IA: amplie fotos em 2x ou 4x',
      ogDescription: 'Amplie fotos pequenas ou suaves com um modelo de IA Real-ESRGAN que reconstrói os detalhes em vez de esticar os pixels.',
      intro: 'Esta página abre o conversor de imagens com o Upscale com IA fixado e a saída definida como PNG. O servidor executa o realesrgan-ncnn-vulkan, a versão Vulkan do Real-ESRGAN, em uma GPU que é nossa: o modelo padrão é o realesrgan-x4plus em 4x, com o realesrgan-x4plus-anime e o realesr-animevideov3 disponíveis para desenhos e quadros de animação, e 2x como escala alternativa. Em vez de interpolar entre os pixels existentes, a rede prevê como bordas, pele, tecido e folhagem ficam no tamanho maior e desenha esses detalhes. O resultado é gravado como um PNG sem perdas, para que nenhum novo artefato de compressão seja empilhado sobre os detalhes sintetizados.',
      whatItDoes: [
        'Amplia uma imagem para 2x ou 4x da largura e da altura com um modelo Real-ESRGAN rodando na nossa GPU.',
        'Permite escolher no formulário entre um modelo para fotos e dois modelos no estilo anime; 4x e o modelo para fotos vêm pré-selecionados.',
        'Sempre gera PNG; a API força a extensão .png para esta operação.',
        'Divide a imagem em blocos automaticamente na GPU, para que entradas grandes não esgotem a memória de vídeo.',
        'Consome um job de IA da cota diária de IA, um contador próprio; a cota comum para conversões não é afetada.',
      ],
      flowSteps: [
        {
          title: 'Envie uma imagem pequena ou suave',
          description: 'JPG, PNG ou WebP. Quanto menor a entrada, mais o modelo precisa inventar.',
        },
        {
          title: 'Escolha 4x ou 2x e um modelo',
          description: 'realesrgan-x4plus para fotos, os modelos anime para ilustrações de traço e quadros de desenho animado.',
        },
        {
          title: 'O Real-ESRGAN roda na GPU',
          description: 'realesrgan-ncnn-vulkan -i in -o out -n <model> -s <2|4> -t 0 -g <gpu> -f png',
        },
        {
          title: 'Baixe o PNG',
          description: 'converted.png com 2x ou 4x as dimensões em pixels do original.',
        },
      ],
      advancedDetails: [
        'A chamada é UpscaleImage em ai_tools.go. Ela inicia o realesrgan-ncnn-vulkan com -n para o modelo, -s para a escala, -t 0 para tamanho automático de bloco, -g para o índice da GPU e -f png; o ICD do Vulkan é fixado por variáveis de ambiente para que o carregador sempre encontre o driver da NVIDIA.',
        'Só as escalas 2 e 4 e só os três nomes de modelo realesrgan-x4plus, realesrgan-x4plus-anime e realesr-animevideov3 são aceitos; qualquer outra coisa é rejeitada antes de o job começar.',
        'O 2x executa a mesma rede x4 em metade da escala. O formulário traz um aviso de que o 2x pode parecer levemente recortado ou ampliado em algumas imagens, o que foi observado no servidor com uma foto de 640 x 360; a API deliberadamente não esconde isso rodando 4x e reduzindo depois.',
        'Como o caminho de IA ignora o ImageMagick e a cópia do exiftool, as configurações de qualidade, redimensionamento, filtro e metadados do formulário não fazem nada aqui, e o PNG não carrega nenhum EXIF do original.',
        'A contagem de pixels cresce com o quadrado da escala: 4x significa 16 vezes mais pixels e 2x significa 4 vezes. O RGB não comprimido da saída é largura x altura x 3 bytes, o que limita o tamanho que o PNG pode ter.',
        'Não há no servidor um limite de dimensões de entrada específico desta operação além do limite de tamanho por arquivo do seu plano; entradas muito grandes simplesmente demoram mais, bloco por bloco.',
      ],
      whyItMatters: [
        'Fotos digitais antigas, downloads de baixa resolução e imagens pequenas da web muitas vezes precisam ser impressos ou exibidos bem maiores do que foram capturados.',
        'A interpolação simples gera uma imagem maior, não mais nítida; um modelo de super-resolução é a diferença entre desfocado e utilizável.',
        'Partir de um PNG sem perdas deixa você livre para comprimir ou redimensionar o resultado depois sem acumular artefatos.',
      ],
      useCases: [
        {
          title: 'Imprimir fotos antigas',
          description: 'Leve uma foto de 1 megapixel de uma câmera antiga a um tamanho que imprime bem.',
        },
        {
          title: 'Resgatar downloads pequenos',
          description: 'Amplie uma imagem de produto ou de referência de 400 px para algo utilizável.',
        },
        {
          title: 'Anime e ilustração',
          description: 'Amplie ilustrações de traço com o realesrgan-x4plus-anime sem bordas borradas.',
        },
        {
          title: 'Quadros de jogos e vídeos',
          description: 'Use o realesr-animevideov3 em quadros de animação capturados.',
        },
      ],
      workedExamples: [
        {
          title: 'Um JPEG de 640 x 360 em 4x com o realesrgan-x4plus',
          body: 'Entrada: uma miniatura JPEG de 92 KB e 640 x 360 de uma paisagem. Configurações mantidas na predefinição: 4x, modelo para fotos, saída em PNG. O servidor executa realesrgan-ncnn-vulkan -n realesrgan-x4plus -s 4 -t 0 -f png e grava o converted.png com 2560 x 1440 pixels, 16 vezes os 230.400 pixels originais. A saída não comprimida é 2560 x 1440 x 3 = 11 MB de RGB, e o PNG fica abaixo disso dependendo de quanto céu e cor chapada ela contém, então espere vários megabytes a partir de uma entrada de 92 KB. A passagem da GPU pelos blocos escolhidos automaticamente é questão de segundos para uma saída desse tamanho; a codificação do PNG e o download de um arquivo de vários megabytes levam uma parcela perceptível do total.',
        },
        {
          title: 'Uma foto de 1200 x 800 em 2x',
          body: 'Entrada: um JPEG de 480 KB e 1200 x 800 de uma pessoa. Escolha 2x e mantenha o modelo para fotos. A saída é um PNG de 2400 x 1600, 3,84 megapixels, quatro vezes os 0,96 originais. Sem compressão, são 11,5 MB de RGB, e o PNG será uma fração disso. Como o 2x executa a rede x4 em metade da escala, inspecione as bordas em busca do leve recorte ou zoom sobre o qual o formulário avisa; se ele aparecer, rode 4x e reduza o resultado de 4800 x 3200 para 2400 x 1600 com o redimensionador de imagens, o que custa mais uma operação.',
        },
      ],
      whenNotToUse: 'Não amplie uma imagem que já é grande e nítida: uma foto de 12 megapixels em 4x vira um PNG de 192 megapixels, lento de produzir, com centenas de megabytes sem compressão e sem nenhum ganho visível. Não confie nela para rostos, textos, logotipos ou qualquer coisa em que o original exato precise ser preservado, porque os detalhes adicionados são previstos, não recuperados, e textos pequenos podem sair como letras plausíveis, mas erradas. Desfoque de movimento intenso e foco perdido não são corrigidos pela resolução. Se você só precisa de um tamanho específico em pixels a partir de um original maior, o redimensionador simples é mais rápido e mais barato.',
      whyMediaManipulator: [
        'O binário, os modelos e as flags reais são nomeados aqui, então você sabe que é o Real-ESRGAN com divisão automática em blocos, e não um “aprimorar” genérico.',
        'A ressalva do 2x é declarada em vez de escondida, e a operação é fixada, então não há menu para vasculhar.',
        'Roda em hardware que é nosso; a ferramenta padrão não exige conta. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'Sua imagem é armazenada em uploads/<jobId>/ no nosso servidor e lida diretamente pelo binário realesrgan-ncnn-vulkan em uma GPU na mesma máquina; o PNG que ele produz vai para outputs/<jobId>/converted.png. Nenhum provedor de IA externo está envolvido, e sua imagem não é usada para treinar nada. Como em todo envio de imagem, uma etapa de análise automatizada no nosso servidor passa um modelo de visão local pelo arquivo uma vez e armazena o resumo junto com o job. O resultado não tem nenhum EXIF do original, porque as operações de IA pulam a cópia de metadados. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'O upscaler com IA é gratuito?',
          answer: 'Sim, dentro da cota diária de IA. Cada ampliação consome um job de IA: por padrão, 3 por dia para visitantes e 10 com uma conta gratuita, com limites de 200 MB e 1 GB por arquivo; 100 e 200 nos planos Premium e Pro. Essa cota é separada da cota comum, então suas conversões não são afetadas. Os números atuais estão em /pricing.',
        },
        {
          question: 'Qual é a diferença em relação ao redimensionador de imagens?',
          answer: 'O redimensionador executa o ImageMagick, que interpola os pixels existentes e gera uma imagem maior, mas mais suave. Esta ferramenta executa uma rede Real-ESRGAN treinada, que sintetiza bordas e texturas no tamanho maior. É uma inferência, não dados recuperados.',
        },
        {
          question: 'Devo escolher 2x ou 4x?',
          answer: '4x é o padrão e dá o resultado mais consistente. O 2x executa a mesma rede em metade da escala e pode parecer levemente recortado em algumas imagens, então, se 4x for mais do que você precisa, considere 4x seguido de uma redução.',
        },
        {
          question: 'Qual modelo é o certo para desenhos?',
          answer: 'realesrgan-x4plus-anime para ilustrações e arte de cores chapadas; realesr-animevideov3 para quadros tirados de animações. O modelo para fotos adiciona uma textura parecida com pele que fica errada em ilustrações de traço.',
        },
        {
          question: 'Por que a saída é PNG e tão grande?',
          answer: 'O PNG é forçado para que os detalhes sintetizados não sejam danificados de imediato pela compressão JPEG. Um resultado em 4x tem 16 vezes mais pixels, então o arquivo é grande; comprima-o para JPG ou WebP depois para compartilhar.',
        },
        {
          question: 'Ele consegue corrigir uma foto desfocada ou fora de foco?',
          answer: 'Ele ajuda com a suavidade que vem da baixa resolução. Não consegue desfazer desfoque de movimento nem um foco perdido, e pode suavizar ou alterar rostos e textos finos. Compare o resultado com o original antes de usá-lo.',
        },
        {
          question: 'Minha foto é enviada a um serviço de IA de terceiros?',
          answer: 'Não. O Real-ESRGAN roda em um servidor com GPU operado por nós, e o job nunca chama uma API externa.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A saída é PNG. Os limites de tamanho e a cota diária de IA dependem do seu plano e são exibidos no formulário, não fixados nesta página.',
        ],
      },
      related: [
        {
          label: 'Restauração de imagens com IA',
          to: '/tools/ai-image-restoration',
          description: 'Limpe compressão e ruído antes ou depois de ampliar.',
        },
        {
          label: 'Redimensionar imagem',
          to: '/tools/image-resizer',
          description: 'Reduza um resultado em 4x ao tamanho exato de que você precisa.',
        },
        {
          label: 'Comprimir imagem',
          to: '/tools/compress-image',
          description: 'Transforme o PNG grande em um JPG ou WebP fácil de compartilhar.',
        },
        {
          label: 'Remover fundo de imagem',
          to: '/tools/remove-background-from-image',
          description: 'Recorte o objeto ampliado sobre um fundo transparente.',
        },
        {
          label: 'Restauração de vídeo com IA',
          to: '/tools/ai-video-restoration',
          description: 'O equivalente para quadros de vídeo.',
        },
      ],
      embed: {
        title: 'Ampliar uma imagem com IA',
        description: 'Envie uma foto. O Upscale com IA já está selecionado e fixado, com a saída definida como PNG. Escolha 2x ou 4x e um modelo (foto ou anime) e depois converta.',
      },
    },
    'blur-faces-in-photo': {
      name: 'Desfocar rostos em foto',
      h1: 'Desfoque rostos em uma foto online',
      tagline: 'Detecte rostos automaticamente e depois desfoque, pixelize ou cubra de preto todos eles ou só os que você escolher.',
      metaTitle: 'Desfocar rostos em uma foto online | Media Manipulator',
      metaDescription: 'Desfoque, pixelize ou cubra de preto os rostos em uma foto. Detecte cada rosto e escolha quais ocultar. A IA roda na nossa própria GPU. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Desfoque rostos em uma foto online',
      ogDescription: 'Encontre rostos em uma foto automaticamente e desfoque, pixelize ou cubra de preto todos eles ou só os que você escolher.',
      intro: 'Publicar uma foto de multidão, de sala de aula ou de rua normalmente significa esconder pessoas que nunca concordaram em aparecer nela. Esta página encontra rostos com o detector YuNet rodando no OpenCV no nosso próprio servidor e cobre cada um com um desfoque gaussiano, um mosaico de pixels ou um retângulo preto sólido. Você pode cobrir todos os rostos detectados em uma etapa ou rodar a detecção primeiro, ver as caixas desenhadas na sua foto e escolher só os rostos a esconder ou só os rostos a manter. O detector, o limiar de confiança dele e o tamanho exato de cada efeito estão descritos abaixo, para você saber o que a saída vai e não vai proteger.',
      whatItDoes: [
        'Detecta rostos com o OpenCV FaceDetectorYN e o modelo YuNet 2023 em um limiar de confiança de 0,85 e depois amplia cada caixa em 18 por cento de cada lado, para cobrir também o cabelo e a linha do queixo.',
        'Esconde cada rosto escolhido com um desfoque gaussiano cujo kernel é um terço do tamanho da caixa, com um mosaico de 14 blocos na largura da caixa ou com um preenchimento preto.',
        'Oferece três modos de seleção: todos os rostos detectados, só os rostos que você marcou ou todos exceto os rostos que você marcou.',
        'Guarda os resultados da detecção em uma sessão de 30 minutos vinculada ao SHA-256 do seu arquivo, para que as caixas aplicadas sejam exatamente as caixas que você viu.',
        'Grava um novo JPG, PNG ou WebP com as mesmas dimensões em pixels; o arquivo enviado original não é alterado.',
      ],
      flowSteps: [
        {
          title: 'Envie a foto',
          description: 'JPG, PNG ou WebP. Desfocar / pixelizar rostos vem pré-selecionado e bloqueado nesta página.',
        },
        {
          title: 'Escolha desfoque, pixelização ou tarja preta',
          description: 'O desfoque é o padrão; a tarja preta remove os pixels por completo.',
        },
        {
          title: 'Opcionalmente, detecte e selecione',
          description: 'Pressione Detectar rostos para ver caixas numeradas e depois marque as que você quer esconder ou manter.',
        },
        {
          title: 'Execute a tarefa',
          description: 'O servidor aplica o efeito dentro de cada caixa escolhida e salva uma nova imagem.',
        },
        {
          title: 'Confira e baixe',
          description: 'Amplie até o tamanho real e procure rostos que escaparam antes de publicar.',
        },
      ],
      advancedDetails: [
        'A detecção roda o face_privacy.py com o OpenCV FaceDetectorYN sobre o face_detection_yunet_2023mar.onnx na resolução completa da imagem, com limiar de pontuação 0,85, limiar de NMS 0,3 e até 5000 candidatos. As caixas recebem um acréscimo de 0,18 da largura e da altura de cada lado e são limitadas às bordas da imagem.',
        'O desfoque aplica cv2.GaussianBlur com um kernel ímpar de max(3, maior lado da caixa / 3) pixels, então um rosto de 300 px recebe um kernel de 101 px; quanto maior o rosto, mais forte o desfoque. A pixelização reduz a caixa a 14 blocos de largura com filtragem linear e a amplia de volta com vizinho mais próximo, gerando quadrados visíveis. A tarja preta grava (0, 0, 0) na região.',
        'Quando você detecta primeiro, o servidor calcula o SHA-256 do arquivo enviado, guarda as caixas normalizadas em uma sessão que expira depois de 30 minutos e se recusa a aplicar uma sessão cujo hash não corresponda ao arquivo que você enviar depois, para que as caixas não possam ser transplantadas para outra imagem.',
        'Sem uma sessão de detecção, o script detecta de novo na hora da execução e cobre todos os rostos que encontra; o resultado é idêntico a rodar Detectar rostos e deixar o modo em todos.',
        'A saída é gravada pelo OpenCV, e a etapa de cópia de metadados com exiftool do conversor não roda em saídas de IA, então o resultado não carrega nenhuma tag EXIF, GPS ou de câmera do original. Ainda assim, isso não substitui a ferramenta de EXIF, que permite ver e escolher o que é removido.',
        'Um desfoque leve em um rosto grande e nítido pode ser parcialmente revertido com ferramentas de deconvolução; a tarja preta é a única opção que destrói a informação, e um mosaico grosso fica no meio do caminho.',
      ],
      whyItMatters: [
        'Fotos de outras pessoas, e especialmente de crianças, trazem obrigações de consentimento e às vezes legais que uma legenda não resolve.',
        'Editar à mão uma foto com 20 rostos é lento e irregular; a detecção encontra os pequenos da última fileira.',
        'Detectar e depois selecionar permite manter o seu grupo visível enquanto anonimiza quem passava por ali.',
      ],
      useCases: [
        {
          title: 'Fotos de eventos e multidões',
          description: 'Esconda quem estava de passagem antes de publicar fotos de um evento público.',
        },
        {
          title: 'Publicações de escolas e clubes',
          description: 'Cubra crianças específicas cujas famílias não deram consentimento.',
        },
        {
          title: 'Jornalismo e reportagem',
          description: 'Proteja fontes ou participantes em um quadro de documentário.',
        },
        {
          title: 'Capturas de tela de videochamadas',
          description: 'Anonimize colegas em uma captura de reunião antes de compartilhá-la fora da equipe.',
        },
      ],
      workedExamples: [
        {
          title: 'Uma foto de grupo de 4000 x 3000 com 14 rostos, todos desfocados',
          body: 'Entrada: um JPEG de 3,5 MB com 4000 x 3000 pixels, tirado com um celular, com 14 pessoas. Configurações: desfoque, modo de seleção todos, sem detecção prévia. O script roda o YuNet sobre o quadro inteiro de 12 megapixels; um rosto cuja caixa tem 300 x 360 pixels recebe um acréscimo de 18 por cento, chegando a cerca de 408 x 490, e é desfocado com um kernel gaussiano de 163 px (490 / 3, arredondado para ímpar), o que o transforma em uma mancha sem traços. Um rosto de 60 px na última fileira recebe um kernel de 27 px, suficiente para apagar os traços nesse tamanho. A saída é um JPG de 4000 x 3000 gravado pelo OpenCV, normalmente a poucas centenas de kilobytes do tamanho original. A detecção e o desfoque levam alguns segundos; o envio dos 3,5 MB costuma demorar mais.',
        },
        {
          title: 'Uma captura de tela de videochamada de 1920 x 1080, dois de seis rostos pixelizados',
          body: 'Entrada: uma captura de tela em PNG de 1,1 MB com 1920 x 1080, mostrando seis participantes. Configurações: Detectar rostos primeiro, modo de seleção só os selecionados, dois rostos marcados, pixelização. A detecção retorna seis caixas e as guarda em uma sessão de 30 minutos vinculada ao hash do arquivo. Ao enviar, o servidor verifica o hash, passa os ids das duas caixas selecionadas ao script, e cada caixa selecionada, com cerca de 140 x 180 pixels depois do acréscimo, é reduzida a 14 blocos de largura, de modo que cada bloco tem aproximadamente 10 x 13 pixels, e depois é gravada de volta como quadrados duros. Os outros quatro rostos ficam intactos. A saída é um PNG de 1920 x 1080, e a tarefa roda em alguns segundos porque não é preciso detectar de novo.',
        },
      ],
      whenNotToUse: 'Não confie nesta ferramenta para nada em que um único rosto perdido seja inaceitável, como uma censura exigida por lei; o YuNet em um limiar de 0,85 pula rostos minúsculos, virados, cobertos por máscara ou em sombra profunda, e você mesmo precisa conferir a saída. Não use um desfoque leve em um rosto grande se a pessoa precisa continuar irreconhecível; use a tarja preta. Crachás, placas de carro e telas não são rostos, então a ferramenta de censura de texto ou o removedor de objetos é a escolha certa para eles. E se o seu objetivo é remover uma pessoa da cena por completo, em vez de esconder o rosto dela, o removedor de objetos faz isso.',
      whyMediaManipulator: [
        'O detector, o limiar dele, o acréscimo das caixas e a aritmética do kernel estão declarados, para você avaliar quanta proteção cada estilo oferece.',
        'As caixas de detecção ficam vinculadas ao hash do arquivo e expiram depois de 30 minutos, então você seleciona na imagem exata que vai ser processada.',
        'O desfoque de rostos gasta uma tarefa de IA da cota diária de IA (3 por dia sem conta, por padrão, e 10 com uma conta gratuita), que é mantida separada da cota comum, e a pré-visualização de Detectar rostos não é contabilizada. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'A detecção e o desfoque de rostos rodam como um processo local do OpenCV no nosso próprio hardware; nenhum serviço de IA externo recebe sua foto, e nada é usado para treinamento. A pré-visualização de Detectar rostos salva uma cópia temporária, calcula o hash dela, detecta e exclui a cópia antes de responder; só as coordenadas das caixas são guardadas, por 30 minutos. A foto enviada fica em uploads/<jobId>/ e o resultado em outputs/<jobId>/, ambos no registro de retenção e excluídos quando o período termina. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Como um envio de imagem padrão, a foto também passa pela nossa análise automatizada de conteúdo no mesmo servidor, onde um modelo de visão local escreve uma descrição curta que fica com a tarefa e não é compartilhada com terceiros.',
      faq: [
        {
          question: 'Quais rostos o detector vai perder?',
          answer: 'O YuNet roda em um limiar de confiança de 0,85, então pula candidatos de baixa confiança: rostos muito pequenos, perfis virados para longe da câmera, rostos cobertos por máscaras ou mãos e rostos em sombra profunda. Confira o resultado no tamanho real antes de compartilhar.',
        },
        {
          question: 'Como desfoco só alguns dos rostos?',
          answer: 'Pressione Detectar rostos, marque as caixas numeradas e defina o modo de seleção como só os rostos selecionados ou todos exceto os selecionados. As caixas ficam guardadas por 30 minutos vinculadas ao hash do arquivo, então detecte de novo se trocar a imagem.',
        },
        {
          question: 'Quão forte é o desfoque, e ele pode ser desfeito?',
          answer: 'O kernel gaussiano é um terço do tamanho da caixa, então um rosto de 300 px recebe um kernel de 101 px. Um desfoque forte é difícil de reverter, mas um atacante determinado com um rosto grande e nítido tem alguma chance; a tarja preta remove os pixels e não pode ser desfeita.',
        },
        {
          question: 'A saída mantém os dados EXIF e GPS da minha foto?',
          answer: 'Não. O resultado é gravado do zero pelo OpenCV e a etapa de cópia de metadados é pulada em saídas de IA, então as tags de câmera e localização não são transferidas. Use a ferramenta de EXIF se quiser inspecionar ou remover tags seletivamente.',
        },
        {
          question: 'Minha foto é enviada para uma empresa de IA externa?',
          answer: 'Não. A detecção e o efeito rodam em um processo local do OpenCV no nosso próprio servidor, e o arquivo não é compartilhado com provedores de IA terceirizados.',
        },
        {
          question: 'O desfoque de rostos usa minha cota diária de IA?',
          answer: 'Sim. Cada foto desfocada é uma tarefa de IA: 3 por dia como visitante, por padrão, e 10 com uma conta gratuita. Ela nunca consome a cota comum. A pré-visualização de Detectar rostos tem limite de frequência, mas não é contabilizada. Uma tarefa com falha é devolvida à cota.',
        },
        {
          question: 'E placas de carro, crachás ou texto em telas?',
          answer: 'Isso não são rostos e não são detectados aqui. Use a ferramenta de censura de texto para qualquer coisa legível, ou o removedor de objetos para apagar uma placa ou um letreiro da imagem.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Cada tarefa gasta uma tarefa de IA da sua cota diária de IA; o limite de tamanho por arquivo do seu plano aparece no formulário.',
        ],
      },
      related: [
        {
          label: 'Ocultar texto em imagem',
          to: '/tools/redact-text-in-image',
          description: 'Esconda e-mails, telefones e outros textos legíveis.',
        },
        {
          label: 'Remover objeto de foto',
          to: '/tools/remove-object-from-photo',
          description: 'Apague uma pessoa, placa ou letreiro por completo.',
        },
        {
          label: 'Remover metadados EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Remova GPS e dados de câmera da mesma foto.',
        },
        {
          label: 'Comprimir imagem',
          to: '/tools/compress-image',
          description: 'Reduza a foto anonimizada antes de publicar.',
        },
        {
          label: 'Redimensionar imagem',
          to: '/tools/image-resizer',
          description: 'Ajuste o resultado ao tamanho que uma plataforma pede.',
        },
      ],
      embed: {
        title: 'Desfocar rostos em uma foto',
        description: 'Envie uma foto. Desfocar / pixelizar rostos já está selecionado e bloqueado. Escolha o estilo, opcionalmente detecte os rostos e selecione quais esconder, depois converta.',
      },
    },
    'redact-text-in-image': {
      name: 'Ocultar texto em imagem',
      h1: 'Oculte texto e dados pessoais em uma imagem',
      tagline: 'Encontre texto legível em uma captura de tela ou foto e cubra dados pessoais, ou todo o texto, com desfoque ou uma tarja preta.',
      metaTitle: 'Ocultar texto em uma imagem online | Media Manipulator',
      metaDescription: 'Encontre automaticamente o texto em uma imagem e cubra de preto ou desfoque nomes, e-mails, números e outros dados pessoais. IA na nossa própria GPU. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Oculte texto e dados pessoais em uma imagem',
      ogDescription: 'Encontre texto em capturas de tela e fotos e cubra dados pessoais ou todo o texto com um desfoque ou uma tarja preta.',
      intro: 'Capturas de tela vazam as coisas que os donos delas deixaram de enxergar: um endereço de e-mail em um cabeçalho, um número de conta em uma tabela, um telefone em um balão de chat. Esta página lê cada trecho de texto em uma imagem com o EasyOCR no nosso próprio servidor e cobre as correspondências com um retângulo preto, um desfoque ou um mosaico de pixels. No modo padrão, ela cobre só o texto que corresponde a padrões de dados pessoais: endereços de e-mail, números de telefone, números no estilo de documentos de identificação, sequências longas de dígitos parecidas com cartões e endereços de rua. No modo todo o texto, cobre cada palavra que consegue ler, que é a escolha mais segura quando você não consegue prever o que há na página.',
      whatItDoes: [
        'Roda o EasyOCR sobre a imagem inteira para encontrar as caixas de texto e o texto dentro delas, usando a GPU do nosso servidor.',
        'No modo dados pessoais, cobre as caixas cujo texto corresponde a um de cinco padrões: e-mail, número de telefone, identificador de 3-2-4 dígitos, sequência de 13 a 19 dígitos parecida com cartão ou endereço de rua terminado em Street, Avenue, Road, Drive, Lane, Boulevard, Way, Court, Circle ou Place.',
        'No modo todo o texto, cobre cada caixa de texto reconhecida, independentemente do conteúdo.',
        'Acrescenta a cada caixa 8 por cento do lado maior dela (no mínimo 3 pixels) e a preenche de preto, desfoca com um kernel de um terço do tamanho dela ou pixeliza em 12 blocos.',
        'Grava um novo JPG, PNG ou WebP nas mesmas dimensões e informa quantas censuras foram feitas.',
      ],
      flowSteps: [
        {
          title: 'Envie a imagem',
          description: 'Uma captura de tela, um formulário digitalizado ou uma foto com texto legível, em JPG, PNG ou WebP.',
        },
        {
          title: 'Escolha só dados pessoais ou todo o texto',
          description: 'Censurar texto / dados pessoais vem pré-selecionado e bloqueado nesta página; só dados pessoais é o modo de detecção padrão.',
        },
        {
          title: 'Escolha tarja preta, desfoque ou pixelização',
          description: 'A tarja preta é o padrão e a única opção irreversível.',
        },
        {
          title: 'O OCR e a censura rodam',
          description: 'O EasyOCR lê a imagem, cada caixa correspondente recebe o acréscimo e é coberta, e o resultado é salvo.',
        },
        {
          title: 'Leia com atenção e baixe',
          description: 'Procure texto que o OCR não leu, principalmente texto pequeno, inclinado ou manuscrito.',
        },
      ],
      advancedDetails: [
        'O servidor roda o redact_text_pii.py com --detect pii ou all-text, --redaction blackbox, blur ou pixelate e --gpu. O script cria um Reader do EasyOCR para inglês (o único idioma passado hoje) e chama readtext no arquivo, que retorna uma caixa, o texto e uma confiança para cada linha.',
        'Os padrões de dados pessoais são expressões regulares: um e-mail (parte local, @, domínio com ponto e um TLD de 2+ letras); um número de telefone norte-americano de 10 dígitos com +1, parênteses, pontos, espaços ou hifens opcionais; três, dois e quatro dígitos separados por hífen ou espaço; 13 a 19 dígitos opcionalmente separados por espaços ou hifens (números de cartão); e um número de casa seguido de um nome e de uma palavra de tipo de rua. Não há padrão para nomes de pessoas, datas de nascimento ou identificadores de fora dos EUA.',
        'Cada caixa correspondente é ampliada em max(3, 0,08 x o maior entre largura e altura) pixels de cada lado e limitada às bordas da imagem. A tarja preta usa cv2.rectangle com interior preto preenchido; a pixelização reduz a região a 12 blocos de largura e a amplia de volta com vizinho mais próximo; o desfoque usa um kernel gaussiano de max(11, maior lado / 3), tornado ímpar.',
        'O OCR lê melhor texto impresso horizontal e limpo. Letra manuscrita, fontes decorativas, texto muito pequeno, inclinação forte e baixo contraste reduzem a confiança e podem passar completamente despercebidos. O modo todo o texto não corrige uma linha que o OCR nunca viu.',
        'A saída é gravada pelo OpenCV e a cópia de metadados com exiftool do conversor é pulada em saídas de IA, então as tags EXIF, GPS e de câmera originais não são transferidas para o resultado; esta ferramenta serve para os pixels, não para os metadados.',
        'O script imprime redactions=N ao terminar; um resultado zero significa que o OCR não encontrou texto correspondente, não que a imagem estava limpa.',
      ],
      whyItMatters: [
        'Chamados de suporte, relatórios de bugs e publicações em redes sociais carregam rotineiramente capturas de tela com dados reais de clientes ou contas.',
        'Cobrir texto à mão com uma ferramenta de desenho deixa linhas passar e produz resultados irregulares; uma busca por padrões encontra o terceiro e-mail que você deixou de notar.',
        'Um retângulo opaco é a única censura que resiste a nitidez, ampliação de contraste e zoom.',
      ],
      useCases: [
        {
          title: 'Relatórios de bugs e suporte',
          description: 'Compartilhe uma captura de tela sem expor e-mails, telefones ou dígitos de cartão.',
        },
        {
          title: 'Formulários digitalizados',
          description: 'Esconda identificadores e endereços em uma página antes de encaminhá-la.',
        },
        {
          title: 'Capturas de tela de chats',
          description: 'Remova telefones e e-mails de uma conversa antes de publicá-la.',
        },
        {
          title: 'Material de treinamento',
          description: 'Transforme uma captura de tela real em um exemplo seguro com todo o texto coberto.',
        },
      ],
      workedExamples: [
        {
          title: 'Uma captura de tela de chamado de suporte de 1440 x 900 no modo dados pessoais',
          body: 'Entrada: um PNG de 400 KB com 1440 x 900 mostrando um cadastro de cliente com dois endereços de e-mail, um telefone escrito como (555) 123-4567 e o nome do cliente. Configurações: só dados pessoais, tarja preta. O EasyOCR retorna cerca de 40 linhas de texto; três delas correspondem aos padrões de e-mail e telefone, e o nome não corresponde a nada. Cada uma das três caixas, digamos 260 x 22 pixels para um e-mail, recebe um acréscimo de 8 por cento de 260, cerca de 21 pixels, de cada lado e é preenchida de preto, produzindo um retângulo de 302 x 64. O nome continua visível, porque não há padrão para nomes; mude para todo o texto se ele também precisar sair. A saída é um PNG de 1440 x 900, e a tarefa leva alguns segundos, a maior parte deles carregando o modelo de OCR e lendo a página.',
        },
        {
          title: 'Uma foto de celular de 3024 x 4032 de um formulário preenchido, no modo todo o texto com desfoque',
          body: 'Entrada: uma foto em JPEG de 2,1 MB de um formulário impresso, com 3024 x 4032 pixels, levemente inclinada. Configurações: todo o texto, desfoque. Cada linha que o EasyOCR lê é coberta: o valor digitado de um campo com 600 x 40 pixels recebe um acréscimo de 48 pixels por lado e é desfocado com um kernel de 201 px (600 / 3, tornado ímpar), o que remove as letras por completo nessa escala; um rótulo de 120 x 30 recebe o kernel mínimo de 11 px, que nesse tamanho ainda deixa os formatos das letras adivinháveis, então escolha a tarja preta para qualquer coisa sensível. As anotações manuscritas que o OCR não consegue ler ficam como estavam e precisam ser conferidas a olho. A saída é um JPG de 3024 x 4032; o OCR sobre uma foto de 12 megapixels é a etapa mais lenta e demora mais do que em uma captura de tela.',
        },
      ],
      whenNotToUse: 'Não use esta ferramenta como única proteção em um documento que precisa ser totalmente censurado; o OCR é feito com o melhor esforço possível, hoje só lê texto impresso em inglês, e os padrões de dados pessoais não sabem nada sobre nomes, datas de nascimento ou identificadores de fora da América do Norte. Não use desfoque em texto que você vai publicar, já que o desfoque de texto é a censura mais fácil de reverter; use a tarja preta. Rostos, logotipos e fotografias não são texto e não são tocados; a ferramenta de desfoque de rostos e o removedor de objetos cuidam deles. E se os dados sensíveis estão nos metadados do arquivo, e não nos pixels, a ferramenta de EXIF é o lugar certo.',
      whyMediaManipulator: [
        'Os cinco padrões de dados pessoais, o acréscimo das caixas e os tamanhos de kernel estão escritos, para você saber exatamente qual texto vai ser capturado e como vai ser coberto.',
        'O OCR e a censura rodam em um processo local na nossa própria GPU; capturas de tela cheias de dados de clientes nunca saem do nosso hardware.',
        'A censura de texto gasta uma tarefa de IA (3 por dia sem conta, por padrão, e 10 com uma conta gratuita), contabilizada na cota de IA e não na comum, e uma tarefa com falha é devolvida à cota. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'O reconhecimento de texto e a censura rodam como um processo local do EasyOCR e do OpenCV no nosso próprio servidor com GPU; nenhum serviço externo de OCR ou IA recebe a imagem, e o texto reconhecido é usado só para decidir quais caixas cobrir e não é armazenado. O arquivo enviado fica em uploads/<jobId>/ e a imagem censurada em outputs/<jobId>/, ambos registrados no registro de retenção e excluídos quando o período termina. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Como todo envio de imagem padrão, o arquivo também passa pela nossa análise automatizada de conteúdo no mesmo servidor, onde um modelo de visão local escreve uma descrição curta que é guardada com a tarefa e não é compartilhada com terceiros.',
      faq: [
        {
          question: 'Quais dados pessoais o modo dados pessoais detecta?',
          answer: 'Texto que corresponde a cinco padrões: endereços de e-mail, números de telefone norte-americanos, identificadores de 3-2-4 dígitos, sequências de 13 a 19 dígitos parecidas com cartões e endereços de rua terminados em uma palavra como Street, Avenue ou Road. Nomes, datas e identificadores de fora dos EUA não são capturados; use todo o texto para eles.',
        },
        {
          question: 'Quando devo usar todo o texto em vez de só dados pessoais?',
          answer: 'Sempre que você não conseguir listar de antemão o que é sensível: formulários, tabelas, registros de chat com nomes. Todo o texto cobre cada linha que o OCR lê, então o único risco restante é o texto que o OCR não conseguiu ler.',
        },
        {
          question: 'A ferramenta lê outros idiomas além do inglês?',
          answer: 'Hoje não. O leitor de OCR é iniciado só para inglês, então texto em alfabeto latino é lido razoavelmente, mas outros alfabetos podem passar despercebidos ou ser lidos errado. Revise a saída quando a página não estiver em inglês.',
        },
        {
          question: 'A tarja preta é mais segura do que o desfoque ou a pixelização aqui?',
          answer: 'Sim. A caixa é preenchida com preto sólido, então nada sobra. O desfoque usa um kernel de um terço do tamanho da caixa com um mínimo de 11 px, e a pixelização deixa 12 blocos de largura; os dois podem deixar textos curtos adivinháveis. Escolha a tarja preta para qualquer coisa que você vá publicar.',
        },
        {
          question: 'A censura remove os metadados ocultos da minha foto?',
          answer: 'O resultado é gravado do zero pelo OpenCV sem copiar as tags originais, então os dados EXIF e GPS não são transferidos. Para uma remoção deliberada e verificável em um arquivo que você não está editando de outra forma, use a ferramenta de metadados EXIF.',
        },
        {
          question: 'Por que parte do texto continuou visível?',
          answer: 'Ou o OCR não o leu (letra manuscrita, texto minúsculo, inclinação, baixo contraste) ou, no modo dados pessoais, ele não correspondeu a nenhum padrão. O servidor informa quantas caixas cobriu; zero significa que nada correspondeu, não que não havia nada.',
        },
        {
          question: 'Ocultar texto é grátis, e o que conta na minha cota?',
          answer: 'Sim. É uma tarefa de IA, 3 por dia sem conta, por padrão, e 10 com uma conta gratuita, em imagens de até 200 MB e 1 GB, respectivamente. Ela usa só a cota de IA, nunca a comum. A página de preços tem os números atualizados.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Cada tarefa gasta uma tarefa de IA da sua cota diária de IA; o limite de tamanho por arquivo do seu plano aparece no formulário.',
        ],
      },
      related: [
        {
          label: 'Desfocar rostos em foto',
          to: '/tools/blur-faces-in-photo',
          description: 'Esconda as pessoas na mesma imagem.',
        },
        {
          label: 'Remover metadados EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Remova dados ocultos de localização e dispositivo.',
        },
        {
          label: 'Digitalização de documentos com IA',
          to: '/tools/ai-document-scan',
          description: 'Transforme uma página fotografada em um PDF limpo e pesquisável.',
        },
        {
          label: 'Remover objeto de foto',
          to: '/tools/remove-object-from-photo',
          description: 'Apague um logotipo, uma placa ou um crachá que não seja texto.',
        },
        {
          label: 'Comprimir imagem',
          to: '/tools/compress-image',
          description: 'Reduza a captura de tela censurada antes de anexá-la.',
        },
      ],
      embed: {
        title: 'Ocultar texto em uma imagem',
        description: 'Envie uma captura de tela ou foto. Censurar texto / dados pessoais já está selecionado e bloqueado. Escolha se quer cobrir os dados pessoais ou todo o texto, e o estilo de censura, depois converta.',
      },
    },
    'remove-object-from-photo': {
      name: 'Remover objeto de foto',
      h1: 'Remova um objeto de uma foto online',
      tagline: 'Desenhe uma caixa em volta do que você não quer na imagem e um modelo de inpainting preenche o espaço com um fundo compatível.',
      metaTitle: 'Remover objeto de uma foto online | Media Manipulator',
      metaDescription: 'Apague objetos indesejados de uma foto. Desenhe um retângulo e o inpainting com IA preenche o espaço combinando com o fundo. Roda na nossa própria GPU. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Remova um objeto de uma foto online',
      ogDescription: 'Desenhe uma caixa sobre um objeto indesejado e o inpainting com IA preenche o espaço com um fundo compatível.',
      intro: 'Envie uma foto, arraste um ou mais retângulos sobre o que você quer que suma e converta. O formulário envia cada retângulo como frações da imagem (esquerda, topo, largura e altura entre 0 e 1), e nossa API as transforma em uma máscara: um PNG em tons de cinza do mesmo tamanho da sua foto, branco dentro dos retângulos e preto em todo o resto. Um script em Python então abre a imagem e a máscara e roda o modelo de inpainting LaMa do pacote simple_lama_inpainting na nossa GPU, que repinta as regiões brancas usando a cena ao redor. Você recebe a foto de volta em tamanho real, no formato que escolheu, com as áreas marcadas preenchidas.',
      whatItDoes: [
        'Aceita um ou mais retângulos desenhados na pré-visualização e remove o que estiver dentro deles.',
        'Monta no servidor uma máscara exata em pixels a partir das coordenadas normalizadas dos retângulos, então a máscara não depende do tamanho da sua tela.',
        'Roda o inpainting LaMa em uma GPU que nós operamos e preenche as áreas mascaradas com conteúdo que dá continuidade ao fundo.',
        'Retorna a imagem em resolução completa em JPG, PNG, WebP ou GIF, conforme selecionado no formulário.',
        'Conta como uma tarefa de IA na cota diária de IA; conversões comuns usam uma cota diferente e separada.',
      ],
      flowSteps: [
        {
          title: 'Envie a foto',
          description: 'JPG, PNG ou WebP. A pré-visualização aparece com uma camada de desenho.',
        },
        {
          title: 'Desenhe retângulos',
          description: 'Uma caixa por objeto, um pouco maior do que o próprio objeto. Pelo menos uma caixa é obrigatória.',
        },
        {
          title: 'Máscara e inpainting',
          description: 'O servidor grava um PNG de máscara do mesmo tamanho e depois roda o remove_object_lama.py com a imagem e a máscara.',
        },
        {
          title: 'Baixe e inspecione',
          description: 'Amplie as regiões preenchidas para conferir as emendas antes de usar a imagem.',
        },
      ],
      advancedDetails: [
        'O handler é o RemoveObject em ai_tools.go. Ele lê as dimensões da imagem com o identify do ImageMagick, rasteriza os retângulos em uma máscara PNG em tons de cinza no diretório temporário do servidor (branco dentro, preto fora, coordenadas arredondadas para pixels inteiros e limitadas às bordas da imagem), roda o script e exclui a máscara depois.',
        'O remove_object_lama.py abre a imagem com o Pillow e a converte para RGB, carrega a máscara em tons de cinza, redimensiona a máscara para a imagem se os tamanhos diferirem, chama SimpleLama(image, mask) e salva o resultado no caminho de saída. Por causa da conversão para RGB, um PNG transparente de entrada perde o canal alfa.',
        'Cada retângulo é validado no servidor: a largura e a altura precisam ser positivas e a caixa precisa estar dentro de 0 a 1 nos dois eixos, caso contrário a tarefa é rejeitada antes de começar e a operação é devolvida à cota.',
        'O caminho de IA pula a etapa do ImageMagick, então as configurações de filtros, tonalidade, texto sobreposto, qualidade e redimensionamento não se aplicam, e a cópia de metadados com exiftool não roda; o resultado não carrega nenhum EXIF do original. O Pillow salva o arquivo com as próprias configurações padrão de codificador para o formato escolhido.',
        'O LaMa preenche a partir do contexto, então a qualidade do preenchimento depende do que cerca a caixa. Céu, grama, areia, água, paredes e pisos dão resultados convincentes; uma caixa que atravessa um rosto, um texto ou um padrão regular obriga o modelo a inventar uma estrutura que ele não pode conhecer.',
      ],
      whyItMatters: [
        'Um retoque com carimbo em um fundo texturizado exige prática e tempo; um retângulo leva dois segundos.',
        'Uma pessoa, um cabo ou uma placa perdidos podem ser a única coisa entre uma foto aproveitável e uma nova sessão.',
        'Também serve como ferramenta de privacidade para números de casa, placas e telas que não deveriam estar em uma foto compartilhada.',
      ],
      useCases: [
        {
          title: 'Viagens e paisagens',
          description: 'Remova um turista, um fio ou uma lixeira de uma vista que, fora isso, está limpa.',
        },
        {
          title: 'Fotos de produtos',
          description: 'Apague uma etiqueta de preço, um suporte ou um grão de poeira de uma imagem de anúncio.',
        },
        {
          title: 'Imóveis',
          description: 'Tire um carro, uma lata de lixo ou a bagunça da borda do quadro.',
        },
        {
          title: 'Privacidade',
          description: 'Apague um número de rua, uma placa de carro ou um monitor visível.',
        },
      ],
      workedExamples: [
        {
          title: 'Um retângulo em uma foto de praia de 4000 x 3000',
          body: 'Entrada: um JPEG de 5,2 MB com 4000 x 3000 e uma pessoa na beira da água. Desenhe uma caixa começando a 60% da largura e 40% da altura, com 10% de largura e 15% de altura, e mantenha JPG como saída. A API multiplica essas frações pelo tamanho da imagem e grava uma máscara de 4000 x 3000 com um bloco branco de 400 x 450 pixels em (2400, 1200). O LaMa roda uma vez sobre a imagem e a máscara na GPU e o script salva um JPG de 4000 x 3000 com os 180.000 pixels mascarados preenchidos a partir da areia e da água ao redor. A passagem do modelo em uma imagem de 12 megapixels leva segundos na GPU; gravar e baixar um JPG de vários megabytes é uma parcela comparável do total.',
        },
        {
          title: 'Dois retângulos em uma foto de produto em PNG de 1920 x 1080',
          body: 'Entrada: um PNG de 2,3 MB com 1920 x 1080 de uma lâmpada sobre uma mesa, com um cabo e um adesivo de preço. Desenhe duas caixas: uma sobre o cabo (cerca de 5% por 30%) e uma sobre o adesivo (cerca de 8% por 6%). As duas são rasterizadas na mesma máscara de 1920 x 1080, então uma única passagem de inpainting cuida das duas regiões. Escolha PNG como saída para evitar artefatos de JPEG nas áreas preenchidas; o resultado é um PNG de 1920 x 1080, em RGB opaco porque o Pillow converte a entrada para RGB antes do inpainting. Com 2 megapixels a passagem na GPU é rápida, e a maior parte do tempo total é o envio e a gravação do PNG.',
        },
      ],
      whenNotToUse: 'Não use inpainting em um objeto que ocupa uma parte grande do quadro, fica na frente de um rosto, se sobrepõe a texto legível ou interrompe um padrão regular como tijolos, azulejos ou um teclado: o modelo precisa fabricar estrutura e o resultado vai parecer borrado ou repetitivo. Também é a ferramenta errada quando você quer manter um PNG transparente intacto, já que o script achata a entrada para RGB, e quando a edição precisa ser forensicamente honesta, porque a região preenchida é conteúdo gerado. Para substituir o fundo inteiro, use o removedor de fundo; para rostos que só precisam ser escondidos, a ferramenta de desfoque de rostos é mais adequada.',
      whyMediaManipulator: [
        'A máscara é montada no servidor a partir de frações exatas, então o que você desenha na pré-visualização de um celular corresponde aos mesmos pixels que em um computador.',
        'O modelo é nomeado (LaMa por meio do simple_lama_inpainting) e o comportamento de formato e de canal alfa está documentado, em vez de deixado à adivinhação.',
        'Roda na nossa própria GPU; a ferramenta padrão não exige conta. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'Sua foto fica armazenada em uploads/<jobId>/ no nosso servidor; a máscara dos retângulos é gravada como um PNG temporário no diretório temporário do servidor e excluída assim que o script de inpainting termina; a imagem preenchida vai para outputs/<jobId>/. As coordenadas dos retângulos ficam guardadas nas opções da tarefa para que a tarefa possa ser reportada. O LaMa roda em uma GPU na mesma máquina e nenhuma parte da imagem vai para um provedor externo. Todo envio de imagem, incluindo este, também é resumido uma vez por uma etapa de análise automatizada no nosso servidor usando um modelo de visão local, e esse resumo fica com a tarefa. A saída não carrega EXIF porque as operações de IA pulam a cópia de metadados. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'A remoção de objetos é grátis?',
          answer: 'Sim, dentro da cota diária de IA. Cada remoção gasta uma tarefa de IA: por padrão, 3 por dia para visitantes e 10 com uma conta gratuita, com limites por arquivo de 200 MB e 1 GB; 100 e 200 no Premium e no Pro. Sua cota comum para conversões é separada e continua como estava. Os números em vigor estão em /pricing.',
        },
        {
          question: 'Quão preciso o retângulo precisa ser?',
          answer: 'Não muito. A máscara é o retângulo que você desenhou, arredondado para pixels inteiros, então inclua um pouco de fundo em volta do objeto e da sombra dele. O modelo mescla a margem extra.',
        },
        {
          question: 'Posso remover vários objetos de uma vez?',
          answer: 'Sim. Cada retângulo que você desenha é pintado na mesma máscara e todos são preenchidos em uma única passagem. Pelo menos um retângulo é obrigatório, ou a tarefa é rejeitada.',
        },
        {
          question: 'Por que a área preenchida parece borrada ou repetida?',
          answer: 'O LaMa preenche a partir dos pixels em volta da caixa. Uma caixa sobre detalhes finos ou um padrão regular o deixa adivinhando. Tente uma caixa mais justa, remova um objeto por vez ou escolha uma foto em que o fundo atrás do objeto seja mais simples.',
        },
        {
          question: 'Em que formato o resultado vem?',
          answer: 'No que você escolheu no formulário: JPG, PNG, WebP ou GIF. A entrada é convertida para RGB antes do inpainting, então a transparência não é preservada. O PNG evita artefatos de JPEG nas regiões preenchidas.',
        },
        {
          question: 'O resultado mantém meus dados EXIF?',
          answer: 'Não. O caminho de IA pula a cópia com exiftool que o conversor normal faz, e o Pillow grava um arquivo novo, então nenhuma tag de câmera, data ou GPS é transferida.',
        },
        {
          question: 'A máscara ou minha foto é enviada para algum outro lugar?',
          answer: 'Não. A máscara é um arquivo temporário no nosso servidor que é excluído depois da execução, e o modelo de inpainting roda na nossa própria GPU.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Cada tarefa gasta uma tarefa de IA da sua cota diária de IA; o limite de tamanho por arquivo do seu plano aparece no formulário.',
        ],
      },
      related: [
        {
          label: 'Remover fundo de imagem',
          to: '/tools/remove-background-from-image',
          description: 'Recorte o objeto principal por completo, em vez de corrigir uma área.',
        },
        {
          label: 'Desfocar rostos em foto',
          to: '/tools/blur-faces-in-photo',
          description: 'Esconda pessoas sem inventar fundo.',
        },
        {
          label: 'Ocultar texto em imagem',
          to: '/tools/redact-text-in-image',
          description: 'Cubra de preto o texto que o OCR encontra, em vez de fazer inpainting.',
        },
        {
          label: 'Restauração de imagens com IA',
          to: '/tools/ai-image-restoration',
          description: 'Limpe ruído e compressão em volta do reparo.',
        },
        {
          label: 'Comprimir imagem',
          to: '/tools/compress-image',
          description: 'Reduza a foto pronta para compartilhar.',
        },
      ],
      embed: {
        title: 'Remover um objeto de uma foto',
        description: 'Envie uma foto. Remover objeto já está selecionado e bloqueado. Desenhe um ou mais retângulos sobre o que você quer que suma, depois converta.',
      },
    },
    'clean-voice-audio': {
      name: 'Limpar áudio de voz',
      h1: 'Limpe gravações de voz com IA',
      tagline: 'Deixe a fala mais clara reduzindo chiado, som ambiente e ruído grave em podcasts, entrevistas e memorandos de voz.',
      metaTitle: 'Limpar gravações de voz com IA | Media Manipulator',
      metaDescription: 'Limpe uma gravação de voz com IA. Reduza chiado, zumbido e ruído do ambiente para ouvir melhor a fala. Roda na nossa própria GPU. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Limpe gravações de voz com IA',
      ogDescription: 'Reduza chiado, zumbido e ruído do ambiente para que a fala fique mais clara em podcasts, entrevistas e memorandos de voz.',
      intro: 'Um memorando de voz do celular em uma cozinha com eco, um convidado de podcast no microfone do notebook, uma aula gravada do fundo da sala: as palavras estão lá, mas ficam enterradas sob chiado e som ambiente. O Limpar voz passa a gravação pelo DeepFilterNet na nossa GPU e depois por uma cadeia fixa de acabamento no estilo de transmissão, que corta o ronco grave, limita os agudos, leva o nível a um loudness consistente e impede que os picos saturem. Foi feito para fala, não para música.',
      whatItDoes: [
        'Converte seu arquivo para 48 kHz mono com o ffmpeg, que é a entrada que o DeepFilterNet espera, e entrega esse WAV ao modelo na nossa GPU.',
        'Suprime o som de fundo constante (chiado, ventiladores, zumbido, som ambiente) mantendo a fala, usando a rede de aprimoramento do DeepFilterNet.',
        'Aplica uma cadeia de acabamento depois da redução de ruído: um passa-altas de 80 Hz, um passa-baixas de 14 kHz, normalização de loudness para -16 LUFS com teto de true-peak de -1,5 dBTP e um limitador em 0,95.',
        'Codifica o resultado no formato que você escolher: MP3, AAC ou OGG a 192 kbps, Opus a 128 kbps, FLAC ou WAV de 16 bits.',
        'Pula os controles padrão de bitrate, equalização, efeitos e corte, já que o caminho de IA substitui o pipeline normal de filtros do ffmpeg.',
      ],
      flowSteps: [
        {
          title: 'Envie uma gravação',
          description: 'Memorandos de voz, áudio de entrevistas, tomadas de podcast ou gravações de aulas em MP3, WAV, FLAC, M4A, AAC, OGG ou Opus.',
        },
        {
          title: 'Limpar voz vem predefinido',
          description: 'A operação é fixa nesta página; a única escolha que resta é o formato de saída.',
        },
        {
          title: 'Normalizar, reduzir ruído, dar acabamento',
          description: 'O ffmpeg gera um WAV mono de 48 kHz, o DeepFilterNet reduz o ruído, e os filtros de acabamento ajustam o timbre e o loudness.',
        },
        {
          title: 'Baixe e ouça',
          description: 'Compare com o original em fones de ouvido antes de publicar.',
        },
      ],
      advancedDetails: [
        'A cadeia de acabamento é exatamente highpass=f=80,lowpass=f=14000,loudnorm=I=-16:TP=-1.5:LRA=11,alimiter=limit=0.95, aplicada uma vez ao WAV com ruído reduzido. O passa-altas remove o ronco de manuseio e os estalos de plosivas, o passa-baixas domestica o chiado acima de 14 kHz, e o loudnorm leva o loudness integrado a -16 LUFS, o alvo habitual para podcasts de fala.',
        'A saída é sempre mono a 48 kHz porque o modelo roda em um único canal. Uma entrevista em estéreo continua inteligível, mas perde o posicionamento esquerda-direita; se você precisa de estéreo, esta é a ferramenta errada.',
        'As configurações do codificador vêm da extensão de saída: libmp3lame a 192 kbps para MP3, aac a 192 kbps para AAC ou M4A, libvorbis a 192 kbps para OGG, libopus a 128 kbps para Opus, flac para FLAC e pcm_s16le para WAV. Não há seletor de bitrate no caminho de IA.',
        'Os intervalos de corte e os efeitos habituais são ignorados quando uma operação de IA está selecionada; o conversor encaminha o arquivo direto ao modelo e retorna. Corte a gravação antes se quiser limpar só uma parte dela.',
        'Uma segunda passagem pelo Limpar voz renormaliza um áudio que já está a -16 LUFS e pode dar às consoantes uma qualidade aguada. Rode uma vez só.',
        'O modelo tem dificuldade com vozes concorrentes, trilhas musicais de fundo e eventos altos e repentinos; isso não é "fundo constante" e fica, em grande parte, intacto.',
      ],
      whyItMatters: [
        'Os ouvintes param uma gravação cansativa de ouvir mesmo quando o que está sendo dito vale a pena.',
        'Um nível consistente de -16 LUFS significa que um episódio toca no mesmo volume dos episódios em volta dele, sem uma passagem manual de ganho.',
        'A fala que foi retirada do ruído também é transcrita com mais precisão, então limpar primeiro melhora as legendas também.',
      ],
      useCases: [
        {
          title: 'Podcasts e entrevistas',
          description: 'Arrume um convidado remoto gravado em um microfone básico e leve-o ao mesmo loudness do apresentador.',
        },
        {
          title: 'Memorandos de voz e ditados',
          description: 'Deixe uma gravação do celular compreensível depois, e alta o suficiente para ouvir sem fones.',
        },
        {
          title: 'Aulas e reuniões',
          description: 'Abaixe o zumbido do ar-condicionado e o ventilador do projetor em uma gravação feita do fundo de uma sala.',
        },
        {
          title: 'Narração para um vídeo',
          description: 'Dê acabamento à narração antes de colocá-la no editor Darkroom.',
        },
      ],
      workedExamples: [
        {
          title: 'Um memorando de celular de 12 minutos (M4A, 128 kbps, cerca de 11 MB) para MP3',
          body: 'Um arquivo AAC a 128 kbps tem 16 KB por segundo, então 720 segundos dão cerca de 11,5 MB. Doze minutos passam do limite de 5 minutos para visitantes, então isso exige uma conta gratuita (20 minutos). O ffmpeg primeiro grava um WAV mono de 48 kHz de cerca de 69 MB (96.000 bytes por segundo) em uma pasta temporária, removida quando a tarefa termina. O DeepFilterNet e a cadeia de acabamento rodam sobre ele, e o codificador de MP3 grava o resultado a 192 kbps: cerca de 17 MB, maior do que a entrada porque 192 kbps é uma taxa mais alta do que a usada na gravação do memorando. As duas etapas do ffmpeg levam segundos; a passagem do DeepFilterNet domina e cresce com a duração da gravação.',
        },
        {
          title: 'Uma entrevista em WAV estéreo de 4 minutos (44,1 kHz, 16 bits, cerca de 42 MB) para WAV',
          body: 'PCM estéreo de 16 bits a 44,1 kHz tem 176.400 bytes por segundo, então 240 segundos dão cerca de 42 MB, dentro dos limites de 200 MB e 5 minutos para visitantes. O arquivo é somado para mono e reamostrado para 48 kHz antes de o modelo rodar, e o WAV limpo volta como mono de 16 bits a 48 kHz: 96.000 bytes por segundo, cerca de 23 MB. Ele só é menor do que a entrada porque tem um canal em vez de dois. Escolher FLAC mantém as mesmas amostras sem perdas em menos espaço; escolher MP3 dá cerca de 5,8 MB a 192 kbps.',
        },
      ],
      whenNotToUse: 'Pule esta ferramenta para música, canto ou qualquer coisa em que o fundo faça parte do som que você quer manter: o modelo trata tudo que não é fala como ruído, e a cadeia de acabamento corta abaixo de 80 Hz e acima de 14 kHz, o que esvazia os instrumentos. Também é a escolha errada quando você precisa manter o estéreo, quando a gravação está saturada ou distorcida (esse dano não é ruído e não pode ser filtrado) ou quando você só quer abaixar o ruído sem nenhuma mudança de nível ou timbre, que é o que a página Remover ruído de fundo faz.',
      whyMediaManipulator: [
        'O DeepFilterNet e a cadeia de acabamento rodam em uma GPU que nós operamos; a gravação não é enviada a um serviço externo de aprimoramento de fala.',
        'A página abre com Limpar voz já selecionado e o menu de operações oculto, então a única decisão é o formato de saída.',
        'Uma tarefa de limpeza é uma tarefa comum da sua cota diária (5 como visitante, 30 com uma conta gratuita, por padrão), não uma tarefa de IA, e uma tarefa com falha é devolvida à cota.',
      ],
      privacyNote: 'Sua gravação é salva na pasta da tarefa, convertida pelo ffmpeg em um WAV temporário mono de 48 kHz em um diretório temporário e passada ao DeepFilterNet na nossa própria GPU; esse diretório temporário é excluído assim que o arquivo limpo é codificado. A saída limpa fica com a tarefa para download. Os envios de áudio também passam por uma análise automatizada no nosso servidor, que transcreve a gravação com Whisper para uma revisão interna de conteúdo e guarda esse resultado com a tarefa. Nenhum provedor de IA terceirizado recebe o arquivo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'Por que o arquivo limpo sai em mono?',
          answer: 'O pipeline converte toda entrada para um canal a 48 kHz antes de o DeepFilterNet rodar e codifica a saída do modelo como ela vem. Uma gravação em estéreo, portanto, volta em mono. Para uma entrevista com dois microfones, separe os canais antes e limpe cada um separadamente se precisar manter a separação.',
        },
        {
          question: 'Para que loudness o Limpar voz normaliza?',
          answer: 'A cadeia de acabamento usa o loudnorm do ffmpeg com um alvo integrado de -16 LUFS, um teto de true-peak de -1,5 dBTP e uma faixa de loudness de 11 LU, seguido de um limitador em 0,95. Isso corresponde aos alvos comuns de entrega de conteúdo falado, então um episódio limpo aqui fica em um nível semelhante ao de podcasts masterizados profissionalmente.',
        },
        {
          question: 'Posso definir o bitrate ou cortar o arquivo nesta página?',
          answer: 'Não. Quando uma operação de IA está ativa, o conversor encaminha direto ao modelo e ignora as configurações de bitrate, equalização, efeitos e corte. A taxa de saída é fixada pelo formato: 192 kbps para MP3, AAC e OGG, 128 kbps para Opus. Corte a gravação antes em outra ferramenta se quiser só uma parte dela.',
        },
        {
          question: 'Qual é a diferença em relação ao Remover ruído de fundo?',
          answer: 'Os dois rodam o mesmo modelo DeepFilterNet. O Limpar voz acrescenta depois o passa-altas, o passa-baixas, a normalização de loudness e o limitador; o Remover ruído de fundo para no sinal com ruído reduzido e não mexe nos seus níveis nem no timbre. Escolha Limpar voz para um arquivo de fala pronto e a outra página quando você mesmo pretende mixar ou masterizar.',
        },
        {
          question: 'Ele consegue consertar uma gravação saturada ou distorcida?',
          answer: 'Não. A saturação é forma de onda que falta, não ruído adicionado, e o modelo não tem nada a subtrair. Ele ainda pode abaixar o chiado em volta de uma tomada distorcida, mas o estalo nas sílabas altas vai continuar.',
        },
        {
          question: 'Quantas gravações posso limpar por dia, e é grátis?',
          answer: 'O Limpar voz é deliberadamente contabilizado como uma tarefa comum, então gasta uma da cota comum: 5 por dia como visitante, 30 com uma conta gratuita, 300 no Premium e 700 no Pro, por padrão, com limites de arquivo de 200 MB, 1 GB e 5 GB e limites de duração de 5 minutos, 20 minutos e 2 horas. A tabela atual está em /pricing.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'O Limpar voz usa a cota comum; os limites de duração dependem do seu plano e aparecem ao vivo no formulário.',
        ],
      },
      related: [
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'O mesmo redutor de ruído sem o acabamento de loudness e timbre.',
        },
        {
          label: 'Transcrever vídeo',
          to: '/tools/transcribe-video',
          description: 'Transforme a fala limpa em legendas ou texto.',
        },
        {
          label: 'Extrair áudio de vídeo',
          to: '/tools/extract-audio-from-video',
          description: 'Retire a faixa de voz de um vídeo antes de limpá-la.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Coloque a narração com acabamento em uma linha do tempo de vídeo.',
        },
        {
          label: 'Remover vocais de uma música',
          to: '/tools/remove-vocals-from-song',
          description: 'Para música em vez de fala, separe o cantor.',
        },
      ],
      embed: {
        title: 'Limpar uma gravação de voz',
        description: 'Envie uma gravação. O Limpar voz já está aplicado, então não há menu de operações para configurar. Escolha um formato de saída se precisar de algo diferente do padrão, depois converta.',
      },
    },
    'remove-background-noise': {
      name: 'Remover ruído de fundo',
      h1: 'Remova ruído de fundo de áudio online',
      tagline: 'Reduza chiado, zumbido, trânsito e ruído do ambiente em uma gravação com um redutor de ruído por IA, mantendo o som principal em primeiro plano.',
      metaTitle: 'Remover ruído de fundo de áudio online | Media Manipulator',
      metaDescription: 'Remova o ruído de fundo do áudio. Um redutor de ruído com IA diminui chiado, zumbido e sons ambientes em gravações. Roda na nossa própria GPU. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Remova ruído de fundo de áudio online',
      ogDescription: 'Um redutor de ruído com IA que abaixa chiado, zumbido, trânsito e ruído do ambiente em gravações de áudio.',
      intro: 'Aparelhos de ar-condicionado, ventoinhas de computador, trânsito da rua e zumbido elétrico são sons constantes que ficam por baixo do que você realmente queria gravar. Esta página passa o arquivo pelo DeepFilterNet, um redutor de ruído de aprendizado profundo, na nossa GPU e retorna o sinal com ruído reduzido sem nenhuma outra mudança: sem normalização de loudness, sem equalização, sem limitador. Isso faz dela a escolha certa quando você pretende mixar ou masterizar o resultado por conta própria, ou quando quer que o caráter do original fique intacto.',
      whatItDoes: [
        'Reamostra o arquivo enviado para 48 kHz mono com o ffmpeg e passa esse WAV ao binário do DeepFilterNet na nossa GPU.',
        'Estima o piso de ruído estacionário e o subtrai, abaixando chiado, zumbido, ventiladores, ventilação e trânsito constante.',
        'Retorna a saída bruta do modelo codificada no formato que você escolher, com o mesmo nível de pico e equilíbrio tonal que o modelo produziu; não há etapa de pós-processamento nesta página.',
        'Mantém o menu de operações visível, para você poder mudar para Limpar voz ou para as ferramentas de vocais no mesmo formulário.',
      ],
      flowSteps: [
        {
          title: 'Envie o áudio',
          description: 'Qualquer arquivo de áudio comum, incluindo uma faixa extraída de um vídeo.',
        },
        {
          title: 'A redução de ruído vem pré-selecionada',
          description: 'Remover ruído de fundo já está escolhido; mude o formato de saída se quiser algo diferente de MP3.',
        },
        {
          title: 'O DeepFilterNet roda na nossa GPU',
          description: 'O modelo separa o ruído constante do primeiro plano e grava um WAV aprimorado.',
        },
        {
          title: 'Codifique e baixe',
          description: 'O ffmpeg grava o WAV aprimorado no formato que você escolheu; ouça ao lado do original.',
        },
      ],
      advancedDetails: [
        'A única diferença entre esta página e o Limpar voz na API é um único sinalizador: polish=false. A etapa de codificação do ffmpeg não recebe nenhum filtro -af, então o WAV aprimorado é codificado como o DeepFilterNet o gravou.',
        'A normalização de entrada é ffmpeg -ac 1 -ar 48000: o modelo roda em um canal a 48 kHz, então a saída é mono a 48 kHz, independentemente do arranjo de canais ou da taxa de amostragem da entrada.',
        'Os codificadores seguem a extensão: MP3 via libmp3lame a 192 kbps, AAC a 192 kbps, OGG via libvorbis a 192 kbps, Opus via libopus a 128 kbps, FLAC sem perdas, WAV como pcm_s16le. Escolha WAV ou FLAC se for editar depois, para pagar por uma codificação com perdas só uma vez.',
        'Como nenhuma normalização de loudness roda, uma gravação baixa continua baixa. A redução de ruído remove energia, então o resultado pode ficar com um nível um pouco mais baixo do que a entrada; aumente o ganho no seu editor depois, se necessário.',
        'O DeepFilterNet é treinado em ruído estacionário e de variação lenta. Cliques de teclado, portas batendo, uma segunda pessoa falando ou uma trilha musical de fundo são, em grande parte, preservados, já que parecem sinal para o modelo.',
        'O diretório temporário que guarda os WAVs normalizado e aprimorado é excluído quando a tarefa termina; só a saída codificada fica com a tarefa.',
      ],
      whyItMatters: [
        'O ruído constante mascara consoantes baixas e cansa os ouvintes muito antes de eles perceberem o motivo.',
        'Muitas gravações não podem ser refeitas: um discurso de casamento, uma aula, uma entrevista com alguém que não está mais disponível.',
        'Uma faixa com ruído reduzido que não foi normalizada nem limitada dá um ponto de partida limpo para a sua própria mixagem, em vez de um arquivo com som de pronto que você depois precisa desfazer.',
      ],
      useCases: [
        {
          title: 'Áudio retirado de um vídeo',
          description: 'Extraia a faixa, remova o ventilador da câmera ou o vento e depois a coloque de volta sob a imagem no Darkroom.',
        },
        {
          title: 'Gravações de campo',
          description: 'Abaixe o zunido de uma estrada ou de um gerador por baixo de uma entrevista ao ar livre.',
        },
        {
          title: 'Exportações de chamadas e reuniões',
          description: 'Reduza o chiado da linha em uma chamada gravada antes de compartilhá-la ou transcrevê-la.',
        },
        {
          title: 'Fitas cassete digitalizadas',
          description: 'Abaixe o chiado da fita em uma gravação convertida sem mudar os níveis dela.',
        },
      ],
      workedExamples: [
        {
          title: 'Uma gravação de chamada em MP3 de 18 minutos a 128 kbps (cerca de 17 MB) para FLAC',
          body: 'A 128 kbps, um MP3 tem 16 KB por segundo, então 1.080 segundos dão cerca de 17 MB. Dezoito minutos ficam dentro do limite de 20 minutos da conta gratuita, mas acima do limite de 5 minutos para visitantes, então entre antes. O ffmpeg grava um WAV mono de 48 kHz de cerca de 104 MB (96.000 bytes por segundo) para o modelo, e esse WAV é descartado depois da codificação. Escolher FLAC retorna as amostras aprimoradas em mono a 48 kHz sem perdas; o FLAC é menor do que o WAV de 104 MB em uma proporção que depende de quanto silêncio e chiado foi removido, e a própria redução de ruído normalmente faz o FLAC comprimir melhor. Escolher MP3 daria cerca de 26 MB a 192 kbps.',
        },
        {
          title: 'Uma gravação de campo em FLAC estéreo de 4 minutos e 30 segundos (cerca de 30 MB) para WAV',
          body: 'Quatro minutos e meio e 30 MB ficam dentro dos limites de 5 minutos e 200 MB para visitantes, então não é preciso ter conta. O arquivo estéreo é somado para mono e reamostrado para 48 kHz, o DeepFilterNet abaixa o fundo de trânsito, e a saída em WAV é mono de 16 bits a 48 kHz: 96.000 bytes por segundo por 270 segundos, cerca de 26 MB. O nível é o que o modelo deixou, sem nenhuma normalização aplicada, então aumente-o no seu editor se o original estava baixo. As duas conversões do ffmpeg levam alguns segundos cada; a passagem na GPU cresce com a duração.',
        },
      ],
      whenNotToUse: 'Esta não é a ferramenta para gravações em que o ruído é intermitente ou é, ele mesmo, uma voz: pessoas falando ao mesmo tempo, uma televisão no cômodo ao lado, cadeiras arrastando e teclados batendo ficam, em grande parte, intactos, porque o modelo foi feito para ruído constante. Não a use em música finalizada, em que o "ruído" removido pode ser a reverberação e a ambiência da sala pelas quais você pagou. Se você precisa da saída em estéreo, é a escolha errada, porque o pipeline é mono. E se você quer um arquivo de fala pronto para publicar em um loudness padrão, o Limpar voz acrescenta esse acabamento; esta página, deliberadamente, não.',
      whyMediaManipulator: [
        'O redutor de ruído roda em uma GPU que nós operamos; seu áudio não é enviado a um serviço terceirizado de remoção de ruído.',
        'Nada é acrescentado depois do modelo: nenhuma mudança de loudness, nenhuma equalização, então o que você ouve é a redução de ruído e só a redução de ruído.',
        'Uma tarefa de redução de ruído é uma tarefa comum da sua cota diária, não uma tarefa de IA, e é devolvida à cota se a tarefa falhar.',
      ],
      privacyNote: 'O arquivo que você envia é gravado na pasta da tarefa, reamostrado pelo ffmpeg em um WAV temporário mono de 48 kHz em um diretório temporário e tem o ruído reduzido pelo DeepFilterNet na nossa própria GPU; o diretório temporário é removido assim que a saída é codificada. O resultado codificado fica com a tarefa para download. Como todo envio de áudio, ele também passa por uma etapa de análise automatizada no nosso servidor, que o transcreve com Whisper para uma revisão interna que fica com a tarefa. Nada vai para um provedor de IA externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'Com quais ruídos o DeepFilterNet lida bem, e com quais não?',
          answer: 'Som constante e de variação lenta: chiado, zumbido da rede elétrica, ventiladores, ar-condicionado, som ambiente, uma estrada constante. Eventos curtos e qualquer coisa parecida com fala (uma segunda pessoa, uma televisão, cliques, batidas) parecem primeiro plano para o modelo e são, em grande parte, mantidos.',
        },
        {
          question: 'O nível ou o timbre da minha gravação vão mudar?',
          answer: 'Só como efeito colateral da remoção da energia do ruído; nenhuma normalização, equalização ou limitação é aplicada nesta página. Se você quer um nível consistente de -16 LUFS para conteúdo falado e também uma passagem de passa-altas e passa-baixas, use o Limpar voz, que roda o mesmo modelo com essa cadeia de acabamento acrescentada.',
        },
        {
          question: 'Por que o arquivo com ruído reduzido é mono?',
          answer: 'O modelo recebe um único canal a 48 kHz, então o ffmpeg soma qualquer entrada estéreo para mono antes, e a saída é gravada assim. Uma gravação estéreo com ruídos diferentes em cada canal deve ser separada e ter o ruído reduzido um canal por vez se você precisar mantê-la em estéreo.',
        },
        {
          question: 'Posso reduzir o ruído do áudio de um vídeo diretamente?',
          answer: 'Envie a faixa de áudio em vez do vídeo: extraia-a com a ferramenta Extrair áudio, reduza o ruído aqui e depois combine a faixa limpa e o vídeo no Darkroom.',
        },
        {
          question: 'Qual formato de saída é melhor para continuar editando?',
          answer: 'WAV (mono de 16 bits a 48 kHz, 96 KB por segundo) ou FLAC, que guarda as mesmas amostras em menos espaço. MP3, AAC e OGG são gravados a 192 kbps e Opus a 128 kbps; escolha esses só para o compartilhamento final, para que a codificação com perdas aconteça uma vez só.',
        },
        {
          question: 'A redução de ruído conta na cota de IA?',
          answer: 'Não. A remoção de ruído de fundo é deliberadamente contabilizada como uma tarefa comum, como o Limpar voz: 5 por dia para visitantes, 30 com uma conta gratuita, 300 no Premium e 700 no Pro, por padrão. (Isolar ou remover vocais é diferente: cada um deles é uma tarefa de IA.) A duração é limitada a 5 minutos para visitantes e 20 minutos para contas gratuitas; os limites atuais estão em /pricing.',
        },
        {
          question: 'E se a gravação já estiver razoavelmente limpa?',
          answer: 'O modelo roda mesmo assim e remove o piso residual que encontrar, mas a diferença audível vai ser pequena e você pode preferir o original intocado. Compare os dois antes de substituir qualquer coisa.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A redução de ruído usa a cota comum; os limites de duração dependem do seu plano e aparecem ao vivo no formulário.',
        ],
      },
      related: [
        {
          label: 'Limpar áudio de voz',
          to: '/tools/clean-voice-audio',
          description: 'O mesmo redutor de ruído mais o acabamento de loudness e timbre para fala.',
        },
        {
          label: 'Extrair áudio de vídeo',
          to: '/tools/extract-audio-from-video',
          description: 'Retire a faixa de áudio de um vídeo primeiro.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Coloque a faixa com ruído reduzido de volta sob o vídeo.',
        },
        {
          label: 'Transcrever vídeo',
          to: '/tools/transcribe-video',
          description: 'Transcreva o áudio mais limpo para legendas.',
        },
        {
          label: 'Remover vocais de uma música',
          to: '/tools/remove-vocals-from-song',
          description: 'Separe o canto da música com um modelo diferente.',
        },
      ],
      embed: {
        title: 'Remover ruído de fundo',
        description: 'Envie uma gravação. Remover ruído de fundo já está selecionado para você. Você ainda pode mudar o formato de saída, depois converta.',
      },
    },
    'remove-vocals-from-song': {
      name: 'Remover vocais de uma música',
      h1: 'Remova os vocais de uma música para uma faixa instrumental ou de karaokê',
      tagline: 'Retire o canto de uma faixa e mantenha a música, para karaokê, prática e bases. Use apenas em músicas cujos direitos você possui.',
      metaTitle: 'Remover vocais de uma música: criador de karaokê | Media Manipulator',
      metaDescription: 'Remova os vocais de uma música com IA e baixe o instrumental no mesmo formato do seu arquivo, ou em FLAC ou WAV. Faixas de karaokê e de prática, na nossa própria GPU. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Remova os vocais de uma música para karaokê',
      ogDescription: 'Retire o canto de uma música com IA e baixe o instrumental em MP3, FLAC ou WAV.',
      intro: 'Noites de karaokê, prática de canto e gravações de covers precisam da banda sem o cantor. Esta página passa a música pelo Demucs (o modelo htdemucs) na nossa GPU no modo de dois stems, que divide a mixagem em "vocais" e "todo o resto", e retorna o stem com todo o resto. O instrumental volta no mesmo formato do seu arquivo por padrão, então um MP3 de 320 kbps continua um MP3 de 320 kbps em vez de inchar até virar um WAV; FLAC e WAV estão disponíveis quando você quer um arquivo sem perdas para editar.',
      whatItDoes: [
        'Roda o Demucs htdemucs com --two-stems=vocals, então o modelo estima só duas partes: o vocal principal e o acompanhamento.',
        'Mantém o stem no_vocals e descarta o stem vocal; o resultado é um único arquivo estéreo com o canto removido.',
        'Resolve "Igual à entrada" para um formato concreto no envio: MP3 continua MP3, AAC/M4A continua AAC/M4A, OGG e Opus continuam como estão, e entradas em WAV, FLAC, AIFF ou ALAC voltam como FLAC.',
        'Grava os stems em MP3 e AAC a 320 kbps, em vez dos 192 kbps que as outras ferramentas de áudio usam, para que a codificação não acrescente perdas audíveis por cima da separação.',
        'Mostra um tamanho estimado de saída para cada opção de formato antes de você começar, com base na duração do seu arquivo.',
      ],
      flowSteps: [
        {
          title: 'Envie uma música',
          description: 'Uma faixa que você possui ou tem licença para usar, em MP3, WAV, FLAC, M4A, AAC, OGG ou Opus.',
        },
        {
          title: 'Remover vocais vem predefinido',
          description: 'A operação é fixa; "Formato de saída" vem por padrão como Igual à entrada, com MP3, FLAC e WAV como alternativas.',
        },
        {
          title: 'O Demucs separa a mixagem',
          description: 'O modelo percorre a música em segmentos de 7 segundos na nossa GPU e grava vocals.wav e no_vocals.wav.',
        },
        {
          title: 'Codifique e baixe',
          description: 'O stem no_vocals é codificado no formato resolvido e oferecido para download.',
        },
      ],
      advancedDetails: [
        'A invocação exata é demucs -n htdemucs --two-stems=vocals --segment 7; a duração do segmento limita a memória da GPU e permite que faixas longas rodem em uma única placa. O Demucs grava stems estéreo a 44,1 kHz qualquer que seja a taxa ou o número de canais da entrada, então uma fonte mono ou a 48 kHz volta como estéreo a 44,1 kHz.',
        'A codificação dos stems é libmp3lame -b:a 320k para MP3 e aac -b:a 320k para AAC ou M4A; OGG fica a 192 kbps, Opus a 128 kbps, FLAC e WAV são sem perdas. Toda outra operação de IA em áudio usa 192 kbps; a taxa de 320 kbps é específica dos stems.',
        'A regra de "Igual à entrada" é: entrada com perdas retorna o mesmo contêiner, entrada sem perdas retorna FLAC, e um arquivo de vídeo ou qualquer coisa que o servidor não consiga classificar retorna MP3 a 320 kbps. Um .m4a é sondado com ffprobe antes de decidir, porque pode conter ALAC sem perdas em vez de AAC.',
        'A regra existe por causa de uma tarefa real: um MP3 de 87 minutos e 68 MB uma vez voltou como um WAV de 880 MB. O PCM não acrescenta nenhuma fidelidade que uma fonte com perdas nunca teve, então o padrão agora nunca aumenta um áudio com perdas para WAV; escolher WAV explicitamente continua sendo respeitado.',
        'A separação nunca é perfeita. Caudas de reverberação do vocal, harmonias de apoio e qualquer coisa que o modelo ouça como "parecido com voz" (alguns leads de sintetizador, assobios) podem vazar para o instrumental, e mixagens densas separam pior do que produções modernas e bem espaçadas.',
        'O formulário avisa quando uma escolha de WAV passaria de 500 MB, já que WAV estéreo de 16 bits a 44,1 kHz tem 176.400 bytes por segundo, cerca de 10,6 MB por minuto.',
      ],
      whyItMatters: [
        'Versões instrumentais oficiais não existem para a maioria das músicas, e as bases licenciadas costumam ser regravações, e não o arranjo original.',
        'Cantores ensaiam de forma mais útil sobre o arranjo real do que sobre uma aproximação em MIDI.',
        'Retornar o stem no formato da entrada mantém um arquivo de tamanho de celular com tamanho de celular; um MP3 de 10 MB não deveria virar um download de 50 MB por acidente.',
      ],
      useCases: [
        {
          title: 'Karaokê em casa',
          description: 'Faça uma versão para cantar junto de uma música que você já possui.',
        },
        {
          title: 'Prática vocal',
          description: 'Ensaie a sua parte sobre a banda original sem o vocalista principal no seu ouvido.',
        },
        {
          title: 'Covers e remixes',
          description: 'Use o instrumental como base para a sua própria tomada vocal.',
        },
        {
          title: 'Música de fundo para vídeo',
          description: 'Retire uma base sem vocais de uma música que você tem licença para usar em um projeto do Darkroom.',
        },
      ],
      workedExamples: [
        {
          title: 'Um MP3 de 4 minutos a 320 kbps (cerca de 9,6 MB) com Igual à entrada',
          body: 'A 320 kbps, um MP3 tem 40 KB por segundo, então 240 segundos dão cerca de 9,6 MB, bem dentro dos limites de 5 minutos e 200 MB para visitantes. O formato resolve para MP3 porque a entrada é MP3. O Demucs percorre a música em janelas de 7 segundos na nossa GPU e grava um no_vocals.wav estéreo a 44,1 kHz de cerca de 42 MB em uma pasta temporária, que o ffmpeg então codifica com libmp3lame a 320 kbps: o instrumental tem de novo cerca de 9,6 MB. O WAV temporário é excluído. A passagem de separação domina o tempo de execução e cresce com a duração da faixa.',
        },
        {
          title: 'Um WAV com qualidade de CD de 4 minutos e 50 segundos (cerca de 51 MB), FLAC padrão ou WAV explícito',
          body: 'Um WAV estéreo de 16 bits a 44,1 kHz tem 176.400 bytes por segundo, então 290 segundos dão cerca de 51 MB, ainda dentro do limite de 5 minutos para visitantes. Como a entrada é sem perdas, Igual à entrada resolve para FLAC: o formulário estima o FLAC em aproximadamente 55 por cento do tamanho do PCM, cerca de 28 MB, e o número real depende da música. Escolher WAV retorna o stem como PCM de 16 bits com cerca de 51 MB, o mesmo tamanho da entrada; escolher MP3 dá cerca de 11,6 MB a 320 kbps. Os três vêm do mesmo stem no_vocals, só o codificador muda.',
        },
      ],
      whenNotToUse: 'Não rode isto em músicas que você não possui ou para as quais não tem licença; você é responsável pelo uso do resultado. Também é a ferramenta errada quando você quer o cantor em vez da banda (essa é a operação isolar vocais no mesmo formulário), quando precisa de uma divisão em quatro partes com bateria, baixo e outros instrumentos (esta página só produz vocais e acompanhamento) ou quando a gravação é fala, e não canto, caso em que as páginas Limpar voz e de ruído de fundo funcionam melhor. Gravações mono muito antigas e bootlegs ao vivo com o vocal vazando em todos os microfones separam mal, então espere fantasmas audíveis nelas.',
      whyMediaManipulator: [
        'A separação roda em uma GPU que nós operamos com o modelo Demucs htdemucs; sua música não é enviada a um serviço externo de stems.',
        'A saída segue o seu arquivo por padrão, com o stem codificado em MP3 ou AAC a 320 kbps, e FLAC ou WAV a um clique de distância.',
        'A estimativa de tamanho de cada formato aparece antes de você começar, então um WAV enorme é uma escolha, não uma surpresa.',
      ],
      privacyNote: 'Sua música fica armazenada na pasta da tarefa e é passada ao Demucs na nossa própria GPU, que grava os stems de vocal e de acompanhamento em um diretório temporário; só o acompanhamento é codificado no seu download, e o diretório temporário (incluindo o stem vocal descartado) é excluído quando a tarefa termina. O instrumental codificado fica com a tarefa. Os envios de áudio também passam por uma etapa de análise automatizada no nosso servidor, que transcreve o arquivo com Whisper para uma revisão interna guardada com a tarefa. Nenhum provedor de IA terceirizado está envolvido. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'Todo traço do cantor vai sumir?',
          answer: 'A maior parte do vocal principal, mas raramente tudo. Caudas de reverberação, vocais dobrados e de harmonia e sons que o modelo ouve como parecidos com voz podem permanecer em nível baixo. Produções modernas em estéreo separam melhor; gravações mono ou ao vivo com muito vazamento separam pior.',
        },
        {
          question: 'Em que formato e taxa de amostragem o instrumental vem?',
          answer: 'O Demucs grava stems estéreo a 44,1 kHz, então essa é a taxa de toda saída. O contêiner segue o seu arquivo por padrão: MP3 entra, MP3 sai a 320 kbps; AAC ou M4A entra, o mesmo sai a 320 kbps; WAV, FLAC, AIFF ou ALAC entra, FLAC sai. Em vez disso, você pode escolher MP3, FLAC ou WAV explicitamente.',
        },
        {
          question: 'Por que o padrão não é mais WAV?',
          answer: 'Porque um MP3 de 87 minutos e 68 MB costumava voltar como um WAV de 880 MB, e o PCM não pode restaurar detalhes que uma fonte com perdas nunca teve. O stem agora fica no formato da entrada, com stems com perdas gravados a 320 kbps para que a codificação extra não seja audível. O WAV continua disponível se você pedir.',
        },
        {
          question: 'Posso obter só os vocais em vez da base?',
          answer: 'Sim, escolha Isolar vocais no menu de operações do conversor de áudio; ele mantém o stem vocals.wav da mesma execução de dois stems do Demucs e descarta o acompanhamento.',
        },
        {
          question: 'Posso enviar um videoclipe em vez de um arquivo de áudio?',
          answer: 'Envie o áudio: extraia a faixa do vídeo primeiro. Se um arquivo de vídeo chegar a esta operação, o servidor resolve Igual à entrada para MP3 a 320 kbps, já que o contêiner de vídeo não é um formato de áudio.',
        },
        {
          question: 'Quantas músicas por dia posso separar de graça?',
          answer: 'Cada música é uma tarefa de IA: por padrão, 3 por dia sem conta, 10 com uma conta gratuita, 100 no Premium e 200 no Pro. A cota de IA é contabilizada separadamente, então separar músicas deixa sua cota comum intacta. As músicas são limitadas a 5 minutos para visitantes e 20 minutos para contas gratuitas, com 2 horas nos planos pagos; /pricing tem a tabela atual.',
        },
        {
          question: 'É legal fazer uma faixa de karaokê desse jeito?',
          answer: 'Só a partir de músicas que você possui, tem licença para usar ou pode usar sob uma exceção vigente onde você vive. A ferramenta não verifica direitos; você é responsável pelo resultado e por como o distribui.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A remoção de vocais usa a cota de IA; ela e os limites de duração dependem do seu plano e aparecem ao vivo no formulário.',
        ],
      },
      related: [
        {
          label: 'Extrair áudio de vídeo',
          to: '/tools/extract-audio-from-video',
          description: 'Retire o áudio de um videoclipe antes de separá-lo.',
        },
        {
          label: 'Limpar áudio de voz',
          to: '/tools/clean-voice-audio',
          description: 'Para gravações de fala, use o modelo de aprimoramento de fala.',
        },
        {
          label: 'Remover ruído de fundo',
          to: '/tools/remove-background-noise',
          description: 'Abaixe o ruído constante em uma gravação sem separá-la.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Use o instrumental como trilha musical em uma edição de vídeo.',
        },
        {
          label: 'Transcrever vídeo',
          to: '/tools/transcribe-video',
          description: 'Obtenha a letra como texto a partir da mixagem original.',
        },
      ],
      embed: {
        title: 'Remover vocais de uma música',
        description: 'Envie uma música. Remover vocais já está selecionado, e o instrumental volta no mesmo formato do seu arquivo (MP3 continua MP3); escolha FLAC ou WAV em Formato de saída para sem perdas. Pressione converter.',
      },
    },

    // 2026-10-31 (MM92): name + tagline for every remaining tool, so the /tools catalog
    // and the home grid never show an English card in this locale. Model-written; native review pending.
    'transcode-to-dash': {
      name: 'Transcodificar vídeo para DASH (AV1 / VP9)',
      h1: 'Transcodificar vídeo para DASH AV1 ou VP9 online',
      tagline: 'Empacote qualquer vídeo em um pacote MPEG-DASH com manifest.mpd e segmentos de inicialização e de mídia para cada rendição.',
      metaTitle: 'Transcodificar vídeo para DASH AV1/VP9 online | Ferramenta MPEG-DASH grátis',
      metaDescription: 'Transcodificador MPEG-DASH online gratuito. Converta MP4, MOV, WebM e MKV em um pacote DASH com vídeo AV1 ou VP9, legendas e storyboards opcionais.',
      ogTitle: 'Transcodificar vídeo para DASH AV1/VP9 online',
      ogDescription: 'Gere um pacote DASH adaptativo (manifest.mpd + segmentos de inicialização e de mídia por rendição) a partir de qualquer vídeo, grátis, no seu navegador.',
      intro: 'O MPEG-DASH é o padrão aberto de streaming adaptativo suportado por todos os navegadores modernos. O Media Manipulator transcodifica seu vídeo de origem em um pacote DASH VOD (manifest.mpd mais init.mp4 e segmentos .m4s por rendição) usando AV1 (arquivos menores, melhor para players web novos) ou VP9 (suporte de reprodução mais amplo). Solte a pasta descompactada em qualquer CDN ou origem e sirva o manifest.mpd aos clientes. O plano gratuito cobre 360p, 480p e 720p.',
      whatItDoes: [
        'Analisa a origem com o ffprobe e mostra resolução, FPS, duração, codec e a presença de áudio.',
        'Deixa você escolher quais níveis de qualidade codificar e se a saída será AV1 ou VP9.',
        'Detecta automaticamente o melhor codificador AV1 disponível (av1_nvenc → libsvtav1 → libaom-av1).',
        'Gera um manifest.mpd MPEG-DASH que referencia cada Representation de vídeo mais uma Representation de áudio AAC quando houver áudio.',
        'Opcionalmente gera legendas WebVTT e miniaturas de storyboard para a barra de progresso.',
        'Empacota o resultado em media-manipulator-dash-<codec>-<jobID>.tar.gz com um report.json e um README.',
        'Envia o tarball para o S3 e devolve a você uma URL GET pré-assinada de curta duração.',
      ],
      flowSteps: [
        {
          title: 'Envie',
          description: 'PUT pré-assinado direto no S3: seu arquivo nunca passa pelo servidor da API.',
        },
        {
          title: 'Analise',
          description: 'O ffprobe lê resolução, FPS, presença de áudio e metadados de codec.',
        },
        {
          title: 'Escolha os níveis e o codec',
          description: 'Escolha AV1 ou VP9 e qualquer combinação de 360p/480p/720p.',
        },
        {
          title: 'Codifique',
          description: 'AV1 (svtav1/libaom/nvenc) ou libvpx-vp9 em segmentos de 2 segundos.',
        },
        {
          title: 'Empacote',
          description: 'manifest.mpd + init/segmentos por rendição, compactados em tar.gz com report.json e README.',
        },
        {
          title: 'Baixe',
          description: 'URL GET pré-assinada do S3 válida por 30 minutos.',
        },
      ],
      advancedDetails: [
        'A seleção do codificador AV1 prefere av1_nvenc (GPU) quando disponível, recorrendo a libsvtav1 e depois a libaom-av1.',
        'O VP9 usa libvpx-vp9 com row-mt, decodificação paralela por quadro e orientação de CRF + taxa de bits.',
        'As variantes DASH são emitidas com -seg_duration 2 -use_template 1 -use_timeline 0 -single_file 0.',
        'O manifest.mpd declara um AdaptationSet por tipo de conteúdo (vídeo + áudio quando presente) com os atributos codecs "av01.0.08M.08" / "vp09.00.51.08" / "mp4a.40.2".',
        'Sem ampliação: níveis mais altos que a resolução da origem ficam desabilitados, com uma dica explicativa.',
      ],
      whyItMatters: [
        'O AV1 normalmente reduz a taxa de bits pela metade com qualidade equivalente em comparação ao H.264.',
        'O DASH é o formato dominante de streaming adaptativo fora do ecossistema Apple.',
        'Um VOD pré-empacotado evita as contas de transcodificação por requisição das plataformas de streaming.',
      ],
      useCases: [
        {
          title: 'Players web modernos',
          description: 'O Shaka Player e o dash.js consomem o manifest.mpd nativamente.',
        },
        {
          title: 'Distribuição sensível à banda',
          description: 'O AV1 entrega quase metade dos bytes de um pacote HLS em H.264.',
        },
        {
          title: 'Biblioteca de mídia interna',
          description: 'Hospede vídeo adaptativo por conta própria sem pagar uma plataforma de streaming SaaS.',
        },
        {
          title: 'Testes de qualidade',
          description: 'Compare lado a lado codificações AV1 e VP9 da mesma origem, em teste A/B.',
        },
      ],
      whyMediaManipulator: [
        'Roda nos nossos próprios servidores: nenhum provedor de transcodificação terceirizado vê o seu vídeo.',
        'O AV1 vem selecionado por padrão, porque o AV1 é o futuro do streaming adaptativo de alta qualidade.',
        'Formato de pacote aberto: basta descompactar o .tar.gz e hospedar o manifest.mpd.',
      ],
      privacyNote: 'Seu vídeo é lido uma vez pelo FFmpeg, codificado em rendições AV1 ou VP9 e dividido em segmentos DASH com um manifesto, tudo nos nossos servidores. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação terceirizado. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo de origem fica intocado, e o resultado é um arquivo novo.',
      faq: [
        {
          question: 'AV1 ou VP9: qual devo escolher?',
          answer: 'O AV1 produz arquivos menores com qualidade equivalente, mas a codificação é mais lenta em hosts só com CPU. O VP9 tem suporte de reprodução mais amplo e codificação mais rápida. O AV1 é o padrão.',
        },
        {
          question: 'Meu servidor diz que o AV1 está indisponível?',
          answer: 'O AV1 precisa de um entre av1_nvenc (GPU NVIDIA), libsvtav1 ou libaom-av1 no FFmpeg. Consulte /api/video-transcode/capabilities para ver o que a sua instalação tem.',
        },
        {
          question: 'O áudio é sempre AAC?',
          answer: 'Sim: o AdaptationSet de áudio do DASH atualmente emite AAC LC a 128 kbps para máxima compatibilidade, independentemente do codec de origem.',
        },
        {
          question: 'Posso servir este manifesto entre origens diferentes (cross-origin)?',
          answer: 'Sim, mas sua CDN ou origem precisa dos cabeçalhos CORS corretos nos arquivos .mpd, init.mp4 e .m4s. O tarball não inclui esses cabeçalhos.',
        },
        {
          question: 'Por quanto tempo a URL de download dura?',
          answer: 'As URLs GET pré-assinadas são válidas por 30 minutos por padrão. Execute a transcodificação de novo se precisar de um link novo.',
        },
      ],
      related: [
        {
          label: 'Transcodificar vídeo para HLS',
          to: '/tools/transcode-to-hls',
          description: 'O mesmo envio, mas gera um pacote Apple HLS com H.264 + AAC.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza um MP4 com o pipeline normal do FFmpeg.',
        },
        {
          label: 'Transcrever vídeo',
          to: '/tools/transcribe-video',
          description: 'Extraia a fala do vídeo em texto pesquisável.',
        },
      ],
      embed: {
        title: 'Transcodificar um vídeo para DASH (AV1 / VP9)',
        description: 'Envie um MP4/MOV/WebM/MKV. Analisamos a origem com o ffprobe, deixamos você escolher os níveis de qualidade gratuitos (360p/480p/720p), depois rodamos uma codificação ffmpeg em AV1 (padrão) ou VP9 e empacotamos um tar.gz com manifest.mpd para download.',
      },
    },
    'convert-webp-to-jpg': {
      name: 'Converter WebP para JPG',
      h1: 'Converter WebP para JPG online',
      tagline: 'Transforme imagens WebP em arquivos JPG amplamente compatíveis, que funcionam em qualquer visualizador ou editor de imagens.',
      metaTitle: 'Converter WebP para JPG online (grátis) | Media Manipulator',
      metaDescription: 'Conversor online gratuito de WebP para JPG. Transforme rapidamente imagens .webp em arquivos JPG compatíveis com tudo, na qualidade que você escolher.',
      ogTitle: 'Converter WebP para JPG online',
      ogDescription: 'Transforme imagens WebP em arquivos JPG compatíveis com tudo, em poucos cliques.',
      intro: 'O WebP é ótimo para a web, mas softwares antigos, ferramentas de apresentação e impressoras muitas vezes não conseguem lê-lo. O Media Manipulator converte o WebP de volta para JPG para você usar a imagem em qualquer lugar. Escolha a qualidade que quiser e nós cuidamos do resto.',
      whatItDoes: [
        'Converte qualquer imagem .webp (estática ou um quadro de animação) em um .jpg padrão.',
        'Permite escolher a qualidade do JPG: qualidade mais alta = arquivo maior.',
        'Achata a transparência sobre uma cor de fundo escolhida (o JPG não tem canal alfa).',
        'Preserva o perfil de cores sempre que possível.',
      ],
      flowSteps: [
        {
          title: 'Envie o WebP',
          description: 'Solte um arquivo .webp do seu computador.',
        },
        {
          title: 'Escolha a qualidade do JPG',
          description: '85 é um bom padrão; diminua para arquivos menores.',
        },
        {
          title: 'Codifique o JPG',
          description: 'O ImageMagick recodifica com a qualidade escolhida.',
        },
        {
          title: 'Baixe o JPG',
          description: 'Salve um arquivo .jpg compatível com tudo.',
        },
      ],
      advancedDetails: [
        'A qualidade 85 é um ponto de equilíbrio consagrado: acima de ~92, você basicamente só aumenta o tamanho do arquivo, com pouca melhora visual.',
        'O JPG não tem transparência, então WebPs transparentes são achatados. Se você precisa de transparência, converta para PNG.',
        'Para uma conversão de imagem sem perdas ou para WebPs animados, prefira PNG (estático) ou GIF animado.',
      ],
      whyItMatters: [
        'Alguns navegadores antigos, editores de imagem e softwares embarcados ainda não suportam WebP.',
        'Muitas impressoras, quiosques de fotos e ferramentas de apresentação exigem JPG ou PNG.',
        'O JPG é o formato de troca padrão de fato para fotos.',
      ],
      useCases: [
        {
          title: 'Enviar fotos para clientes',
          description: 'Garanta que o destinatário consiga abrir o arquivo em qualquer dispositivo.',
        },
        {
          title: 'Inserir em apresentações',
          description: 'Os slides do PowerPoint e do Keynote aceitam JPG em qualquer lugar; com WebP, nem sempre funciona.',
        },
        {
          title: 'Impressão e laboratórios de fotos',
          description: 'A maioria dos laboratórios aceita só JPG.',
        },
        {
          title: 'Envios para bancos de imagens',
          description: 'Muitos sites de banco de imagens exigem envios em JPG.',
        },
      ],
      whyMediaManipulator: [
        'Sem marcas d\'água, sem cadastro, grátis para uso casual.',
        'Ajuste qualidade e compressão com precisão, em vez de uma predefinição única para tudo.',
        'O mesmo modelo de privacidade e retenção do restante das ferramentas.',
      ],
      privacyNote: 'Seu WebP é decodificado e recodificado como JPG no nosso servidor; uma área transparente é achatada porque o JPG não consegue armazená-la. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'E a transparência?',
          answer: 'O JPG não suporta transparência. WebPs transparentes são achatados sobre a cor de fundo escolhida. Se você precisa de transparência, converta para PNG.',
        },
        {
          question: 'Qual qualidade devo usar?',
          answer: '85 é um padrão equilibrado. Use 90 ou mais para fotos em que a qualidade importa mais e 70 para miniaturas ou pré-visualizações.',
        },
        {
          question: 'Funciona com WebP animado?',
          answer: 'Só o primeiro quadro vira um JPG. Para WebP animado, converta para um GIF animado.',
        },
        {
          question: 'Posso converter vários arquivos em lote?',
          answer: 'A ferramenta gratuita processa um arquivo por vez. Por enquanto, converta cada WebP individualmente.',
        },
      ],
      related: [
        {
          label: 'Converter WebP para PNG',
          to: '/tools/convert-webp-to-png',
          description: 'Mantenha a transparência com um PNG sem perdas.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre JPG, PNG, WebP, AVIF e GIF.',
        },
        {
          label: 'Comprimir imagem',
          to: '/tools/compress-image',
          description: 'Reduza ainda mais o tamanho do arquivo JPG.',
        },
        {
          label: 'Remover metadados EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Elimine metadados privados antes de compartilhar o JPG.',
        },
        {
          label: 'Tutorial do conversor de imagens',
          to: '/tutorials/image/getting-started',
          description: 'Passo a passo de todas as opções de imagem.',
        },
      ],
      embed: {
        title: 'Converter WebP para JPG',
        description: 'Envie uma imagem WebP e escolha JPG como formato de saída. Ajuste o controle de qualidade para equilibrar o tamanho do arquivo e a qualidade da imagem. O JPG descarta a transparência, então use PNG se a sua imagem tiver fundo transparente.',
      },
    },
    'convert-png-to-jpg': {
      name: 'Converter PNG para JPG',
      h1: 'Converter PNG para JPG online grátis',
      tagline: 'Transforme capturas de tela e gráficos PNG grandes em fotos JPG pequenas e compatíveis com tudo, em segundos.',
      metaTitle: 'Converter PNG para JPG online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de PNG para JPG. Transforme arquivos .png em imagens JPG menores e compatíveis com tudo, na qualidade que você escolher. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter PNG para JPG online grátis',
      ogDescription: 'Transforme imagens PNG em arquivos JPG menores e compatíveis com tudo. Grátis, rápido e sem cadastro.',
      intro: 'O PNG é um formato sem perdas, o que o torna perfeito para capturas de tela e gráficos, mas muitas vezes bem maior do que precisaria ser para fotos. Converter PNG para JPG pode reduzir um arquivo em 5–10×, sem diferença visível em conteúdo fotográfico. O Media Manipulator converte seu PNG em um JPG limpo, na qualidade que você escolher: grátis, online e sem cadastro.',
      whatItDoes: [
        'Converte qualquer imagem .png em um arquivo .jpg (JPEG) padrão.',
        'Permite escolher a qualidade do JPG para equilibrar o tamanho do arquivo e a fidelidade.',
        'Achata a transparência sobre um fundo sólido, já que o JPG não tem canal alfa.',
        'Os pixels que você vê continuam os mesmos; só o arquivo é recodificado de PNG para JPG.',
      ],
      flowSteps: [
        {
          title: 'Envie o PNG',
          description: 'Solte uma captura de tela, um gráfico ou uma foto em .png.',
        },
        {
          title: 'Escolha a qualidade do JPG',
          description: '85 é um padrão equilibrado; diminua para arquivos menores.',
        },
        {
          title: 'Codifique o JPG',
          description: 'O ImageMagick recodifica sua imagem como JPEG.',
        },
        {
          title: 'Baixe o JPG',
          description: 'Salve um arquivo .jpg menor e compatível com tudo.',
        },
      ],
      advancedDetails: [
        'A qualidade 85 é o ponto ideal consagrado: acima de ~92, você basicamente só aumenta o tamanho do arquivo, com pouco ganho visível.',
        'Um PNG fotográfico costuma cair de vários megabytes para algumas centenas de kilobytes como JPG.',
        'Para gráficos com bordas nítidas ou texto, PNG ou WebP costumam ficar mais limpos que o JPG no mesmo tamanho.',
        'Se o seu PNG tem uma transparência que você quer manter, converta para WebP: o JPG não consegue armazenar um canal alfa.',
      ],
      whyItMatters: [
        'O JPG é o formato de foto mais aceito universalmente: todo dispositivo, editor e formulário de envio o aceita.',
        'JPGs menores carregam mais rápido na web e ficam abaixo dos limites de e-mail e de envio em formulários.',
        'Muitos laboratórios de impressão, marketplaces e bancos de imagens aceitam só JPG.',
      ],
      useCases: [
        {
          title: 'Reduzir capturas de tela',
          description: 'Transforme uma captura de tela pesada em PNG em um JPG leve para e-mail ou chat.',
        },
        {
          title: 'Enviar fotos',
          description: 'Converta um PNG fotográfico em JPG para atender à exigência de formato de um site.',
        },
        {
          title: 'Impressão e laboratórios de fotos',
          description: 'A maioria dos laboratórios exige JPG: converta antes de fazer o pedido.',
        },
        {
          title: 'Páginas web mais rápidas',
          description: 'Substitua fotos grandes em PNG por JPGs compactos para reduzir o peso da página.',
        },
      ],
      whyMediaManipulator: [
        'A saída é travada de verdade em JPG, então não há nada para configurar errado.',
        'Controle preciso de qualidade em vez de uma predefinição única para tudo.',
      ],
      privacyNote: 'Seu PNG é recodificado como JPG na qualidade que você definir, no nosso servidor, e qualquer transparência é achatada sobre um fundo sólido. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Como converto um PNG para JPG de graça?',
          answer: 'Envie seu .png acima, escolha uma qualidade de JPG e clique em converter. O download é um arquivo .jpg padrão.',
        },
        {
          question: 'Converter PNG para JPG reduz a qualidade?',
          answer: 'O JPG tem perdas, então há uma pequena troca de qualidade. Na qualidade 85–90, a diferença é invisível em fotos. Para gráficos com texto nítido, fique com o PNG ou use WebP.',
        },
        {
          question: 'O que acontece com a transparência quando converto PNG para JPG?',
          answer: 'O JPG não suporta transparência, então as áreas transparentes são achatadas sobre um fundo sólido. Se você precisa manter a transparência, converta o PNG para WebP.',
        },
        {
          question: 'Por que meu PNG é tão maior que o JPG?',
          answer: 'O PNG é sem perdas e armazena cada pixel exatamente, o que fica grande para fotos. O JPG usa compressão perceptual, então imagens fotográficas encolhem drasticamente com pouca mudança visível.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'As áreas transparentes do PNG são achatadas sobre um fundo sólido porque o JPG não tem transparência.',
        ],
      },
      related: [
        {
          label: 'Converter JPG para PNG',
          to: '/tools/convert-jpg-to-png',
          description: 'Faça o caminho inverso e obtenha um PNG com suporte a transparência.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre JPG, PNG, WebP, AVIF e mais.',
        },
        {
          label: 'Comprimir imagem',
          to: '/tools/compress-image',
          description: 'Reduza ainda mais o JPG sem mudar o formato.',
        },
        {
          label: 'Tutorial do conversor de imagens',
          to: '/tutorials/image/getting-started',
          description: 'Percorra todas as opções de imagem em detalhes.',
        },
      ],
      embed: {
        title: 'Converter PNG para JPG',
        description: 'Envie uma imagem PNG. Nesta ferramenta, a saída é travada em JPG: basta escolher uma qualidade e converter. As áreas transparentes são achatadas sobre um fundo sólido porque o JPG não tem canal alfa.',
      },
    },
    'convert-jpg-to-png': {
      name: 'Converter JPG para PNG',
      h1: 'Converter JPG para PNG online grátis',
      tagline: 'Transforme fotos JPG em arquivos PNG sem perdas, prontos para edição, transparência e trabalhos gráficos de alta qualidade.',
      metaTitle: 'Converter JPG para PNG online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de JPG para PNG. Transforme fotos .jpg em arquivos PNG sem perdas para edição, transparência e gráficos. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter JPG para PNG online grátis',
      ogDescription: 'Transforme fotos JPG em arquivos PNG sem perdas para edição e gráficos. Grátis, rápido e sem cadastro.',
      intro: 'O PNG é um formato sem perdas que nunca adiciona artefatos de compressão, o que o torna ideal quando você começa a editar uma imagem, adicionar transparência ou sobrepor gráficos. Converter um JPG para PNG congela os pixels atuais, para que as edições seguintes não degradem a qualidade. O Media Manipulator converte seu JPG em um PNG limpo, online, grátis e sem cadastro.',
      whatItDoes: [
        'Converte qualquer imagem .jpg/.jpeg em um arquivo .png sem perdas.',
        'Preserva exatamente os pixels atuais, para que edições repetidas não adicionem artefatos.',
        'Produz um PNG que você pode depois sobrepor, mascarar ou tornar transparente em um editor.',
        'Cada pixel do JPG é mantido exatamente; o PNG os armazena sem nenhuma perda adicional.',
      ],
      flowSteps: [
        {
          title: 'Envie o JPG',
          description: 'Solte uma foto .jpg ou .jpeg.',
        },
        {
          title: 'Converta para PNG',
          description: 'Recodificamos a imagem sem perdas como PNG.',
        },
        {
          title: 'Codifique o PNG',
          description: 'O ImageMagick grava um PNG padrão de 24/32 bits.',
        },
        {
          title: 'Baixe o PNG',
          description: 'Salve um .png sem perdas, pronto para edição.',
        },
      ],
      advancedDetails: [
        'O PNG é sem perdas, então o arquivo convertido normalmente será maior que o JPG de origem: isso é esperado.',
        'Converter JPG para PNG não recupera os detalhes que o JPG já descartou; apenas congela os pixels atuais sem perdas.',
        'O PNG suporta canal alfa, então o resultado está pronto para você adicionar transparência em um editor.',
        'Para os menores arquivos web sem perdas, o WebP (sem perdas) costuma ser menor que o PNG.',
      ],
      whyItMatters: [
        'O PNG sem perdas é o formato de trabalho certo quando uma imagem será editada repetidamente.',
        'Ferramentas de design, recursos de aplicativos e trabalhos de interface esperam PNG pelas bordas nítidas e pelo suporte a transparência.',
        'O PNG evita a perda geracional que acontece quando você salva um JPG de novo várias vezes.',
      ],
      useCases: [
        {
          title: 'Preparação para edição',
          description: 'Converta um JPG para PNG antes de retocar, para que as edições fiquem sem perdas.',
        },
        {
          title: 'Adicionar transparência',
          description: 'Tenha uma tela PNG pronta para recortar um fundo.',
        },
        {
          title: 'Recursos de interface e aplicativos',
          description: 'A maioria dos sistemas de design espera PNG para ícones e gráficos.',
        },
        {
          title: 'Inserção em documentos',
          description: 'Use PNG onde texto e linhas nítidos importam mais que o tamanho do arquivo.',
        },
      ],
      whyMediaManipulator: [
        'A saída é travada de verdade em PNG, então o resultado é sempre sem perdas.',
        'Roda nos nossos próprios servidores, sem processamento da sua imagem por terceiros.',
      ],
      privacyNote: 'Seu JPG é decodificado no nosso servidor e gravado como um PNG sem perdas com exatamente os mesmos pixels. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Como converto um JPG para PNG de graça?',
          answer: 'Envie seu .jpg acima e clique em converter: a saída é um .png sem perdas. É grátis, não exige cadastro e funciona no seu navegador.',
        },
        {
          question: 'Converter JPG para PNG melhora a qualidade?',
          answer: 'Não. A conversão é sem perdas, mas não consegue recuperar os detalhes que o JPG já descartou. Ela congela os pixels atuais para que as edições futuras fiquem livres de artefatos.',
        },
        {
          question: 'O PNG vai ficar maior que meu JPG?',
          answer: 'Normalmente, sim. O PNG armazena cada pixel exatamente, sem compressão com perdas, então um PNG fotográfico costuma ser maior que o JPG equivalente.',
        },
        {
          question: 'Posso adicionar transparência depois de converter para PNG?',
          answer: 'Sim. O PNG suporta canal alfa, então, assim que tiver o PNG, você pode apagar ou recortar um fundo em qualquer editor de imagens.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'O PNG é sem perdas, então a saída normalmente é maior que o JPG de origem.',
        ],
      },
      related: [
        {
          label: 'Converter PNG para JPG',
          to: '/tools/convert-png-to-jpg',
          description: 'Faça o caminho inverso e reduza um PNG a um JPG.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre JPG, PNG, WebP, AVIF e mais.',
        },
        {
          label: 'Remover fundo de imagem',
          to: '/tools/remove-background-from-image',
          description: 'Crie um recorte em PNG transparente automaticamente.',
        },
        {
          label: 'Tutorial do conversor de imagens',
          to: '/tutorials/image/getting-started',
          description: 'Percorra todas as opções de imagem em detalhes.',
        },
      ],
      embed: {
        title: 'Converter JPG para PNG',
        description: 'Envie uma imagem JPG. Nesta ferramenta, a saída é travada em PNG, então você recebe um arquivo sem perdas, pronto para editar ou sobrepor em uma tela transparente.',
      },
    },
    'convert-webp-to-png': {
      name: 'Converter WebP para PNG',
      h1: 'Converter WebP para PNG online grátis',
      tagline: 'Transforme imagens WebP em arquivos PNG sem perdas, que abrem em qualquer lugar e mantêm toda a transparência.',
      metaTitle: 'Converter WebP para PNG online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de WebP para PNG. Transforme imagens .webp em arquivos PNG sem perdas, que mantêm a transparência e abrem em qualquer editor. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter WebP para PNG online grátis',
      ogDescription: 'Transforme imagens WebP em arquivos PNG sem perdas, que preservam a transparência. Grátis, rápido e sem cadastro.',
      intro: 'O WebP é ótimo para a web, mas muitos editores, softwares antigos e ferramentas de design ainda esperam PNG, e, ao contrário do JPG, o PNG mantém toda a transparência. O Media Manipulator converte seu WebP em um PNG limpo e sem perdas, para que ele abra em qualquer lugar e seu canal alfa sobreviva.',
      whatItDoes: [
        'Converte qualquer imagem .webp em um arquivo .png sem perdas.',
        'Preserva o canal alfa, para que WebPs transparentes continuem transparentes.',
        'Produz um PNG que abre em qualquer editor, visualizador ou ferramenta de design.',
        'A imagem não muda; a compressão WebP é trocada pelo armazenamento sem perdas do PNG.',
      ],
      flowSteps: [
        {
          title: 'Envie o WebP',
          description: 'Solte um arquivo .webp, transparente ou sólido.',
        },
        {
          title: 'Converta para PNG',
          description: 'Decodificamos o WebP e o recodificamos como PNG.',
        },
        {
          title: 'Codifique o PNG',
          description: 'O ImageMagick grava um PNG sem perdas de 24/32 bits.',
        },
        {
          title: 'Baixe o PNG',
          description: 'Salve um arquivo .png que preserva a transparência.',
        },
      ],
      advancedDetails: [
        'A transparência do WebP de origem é preservada como canal alfa do PNG.',
        'Só o primeiro quadro de um WebP animado vira um PNG estático; para animação, converta para GIF.',
        'O PNG é sem perdas, então a saída normalmente é maior que o WebP de origem; esse é o custo da compatibilidade universal e do armazenamento sem perdas.',
      ],
      whyItMatters: [
        'Alguns editores, ferramentas de apresentação e softwares antigos ainda não conseguem abrir WebP.',
        'O PNG mantém a transparência, o que o JPG não faz: importante para logos e recortes.',
        'O PNG é um formato de intercâmbio seguro e sem perdas para trabalhos gráficos.',
      ],
      useCases: [
        {
          title: 'Abrir WebP em editores',
          description: 'Converta para PNG para que um editor sem suporte a WebP consiga abri-lo.',
        },
        {
          title: 'Manter a transparência',
          description: 'Preserve um logo WebP transparente como um PNG transparente.',
        },
        {
          title: 'Entregas de design',
          description: 'Entregue um PNG a ferramentas ou colegas que esperam recursos em PNG.',
        },
        {
          title: 'Apresentações',
          description: 'Solte um PNG em um software de slides que não aceita WebP.',
        },
      ],
      whyMediaManipulator: [
        'A saída é travada em PNG, com a transparência preservada automaticamente.',
        'Roda nos nossos próprios servidores, sem processamento da sua imagem por terceiros.',
      ],
      privacyNote: 'Seu WebP é decodificado no nosso servidor e salvo como um PNG sem perdas, mantendo a transparência. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Como converto WebP para PNG de graça?',
          answer: 'Envie seu .webp acima e clique em converter. O download é um .png sem perdas, com a transparência preservada. É grátis e não precisa de cadastro.',
        },
        {
          question: 'A conversão de WebP para PNG mantém a transparência?',
          answer: 'Sim. Se o seu WebP tem fundo transparente, o PNG resultante mantém esse canal alfa intacto.',
        },
        {
          question: 'Por que converter WebP para PNG em vez de JPG?',
          answer: 'O PNG é sem perdas e preserva a transparência, enquanto o JPG achata a transparência e adiciona compressão. Escolha PNG quando precisar de transparência ou gráficos sem perdas; escolha JPG para os menores arquivos de foto.',
        },
        {
          question: 'Posso converter um WebP animado?',
          answer: 'Só o primeiro quadro vira um PNG. Para animação, converta o WebP para um GIF animado.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A transparência é preservada. Só o primeiro quadro de um WebP animado é convertido.',
        ],
      },
      related: [
        {
          label: 'Converter PNG para WebP',
          to: '/tools/convert-png-to-webp',
          description: 'Faça o caminho inverso e reduza um PNG a um WebP.',
        },
        {
          label: 'Converter WebP para JPG',
          to: '/tools/convert-webp-to-jpg',
          description: 'Converta o WebP em um JPG compacto.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre JPG, PNG, WebP, AVIF e mais.',
        },
        {
          label: 'Comprimir imagem',
          to: '/tools/compress-image',
          description: 'Reduza uma imagem sem a complicação de mudar o formato.',
        },
      ],
      embed: {
        title: 'Converter WebP para PNG',
        description: 'Envie uma imagem WebP. Nesta ferramenta, a saída é travada em PNG, então a transparência é preservada e o arquivo abre em qualquer editor ou visualizador de imagens.',
      },
    },
    'convert-png-to-webp': {
      name: 'Converter PNG para WebP',
      h1: 'Converter PNG para WebP online grátis',
      tagline: 'Reduza gráficos PNG a arquivos WebP modernos, que carregam mais rápido na web e mantêm toda a transparência.',
      metaTitle: 'Converter PNG para WebP online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de PNG para WebP. Reduza arquivos .png a imagens WebP menores para sites mais rápidos, mantendo a transparência. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter PNG para WebP online grátis',
      ogDescription: 'Reduza gráficos PNG a arquivos WebP menores, que preservam a transparência, para sites mais rápidos. Grátis e sem cadastro.',
      intro: 'O WebP é o formato de imagem moderno da web: produz arquivos drasticamente menores que o PNG e preserva a transparência, o que significa páginas mais rápidas e melhores Core Web Vitals. O Media Manipulator converte seu PNG para WebP na qualidade que você escolher: grátis, online, com a transparência intacta e sem exigir cadastro.',
      whatItDoes: [
        'Converte qualquer imagem .png em um arquivo .webp moderno.',
        'Preserva o canal alfa, para que PNGs transparentes continuem transparentes.',
        'Permite escolher a qualidade para equilibrar o tamanho do arquivo e a fidelidade.',
        'Normalmente produz arquivos 25–80% menores que o PNG de origem.',
      ],
      flowSteps: [
        {
          title: 'Envie o PNG',
          description: 'Solte um gráfico, ícone ou captura de tela em .png.',
        },
        {
          title: 'Escolha a qualidade do WebP',
          description: '80–85 é um ótimo padrão para uso na web.',
        },
        {
          title: 'Codifique o WebP',
          description: 'O ImageMagick recodifica sua imagem como WebP.',
        },
        {
          title: 'Baixe o WebP',
          description: 'Salve um arquivo .webp menor, que preserva a transparência.',
        },
      ],
      advancedDetails: [
        'O WebP suporta os modos com perdas e sem perdas; na qualidade ~80, ele costuma vencer o PNG em tamanho de arquivo por uma larga margem, mantendo-se visualmente limpo.',
        'A transparência é preservada, então logos e recursos de interface mantêm o canal alfa.',
        'O WebP é suportado por todos os navegadores modernos: sirva-o diretamente para carregar páginas mais rápido.',
        'Para máxima compatibilidade com softwares muito antigos, mantenha um PNG de reserva.',
      ],
      whyItMatters: [
        'Imagens menores são a maior alavanca individual para carregar páginas mais rápido e melhorar o SEO.',
        'O WebP mantém a transparência, então você não precisa trocar o canal alfa por tamanho, como faria com o JPG.',
        'Os Core Web Vitals do Google recompensam páginas mais leves: o WebP ajuda diretamente.',
      ],
      useCases: [
        {
          title: 'Sites mais rápidos',
          description: 'Substitua recursos PNG pesados por WebP para reduzir o peso da página.',
        },
        {
          title: 'Logos transparentes',
          description: 'Reduza um logo PNG transparente mantendo o canal alfa.',
        },
        {
          title: 'Recursos de aplicativos e interface',
          description: 'Entregue gráficos mais leves sem perder a nitidez.',
        },
        {
          title: 'Galerias cheias de imagens',
          description: 'Converta um lote de PNGs para WebP para uma galeria mais ágil.',
        },
      ],
      whyMediaManipulator: [
        'A saída é travada em WebP, com a transparência preservada.',
        'Controle preciso de qualidade, para que você decida a troca entre tamanho e fidelidade.',
      ],
      privacyNote: 'Seu PNG é recodificado como WebP no nosso servidor, na qualidade que você escolher, com a transparência mantida. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Como converto PNG para WebP de graça?',
          answer: 'Envie seu .png acima, escolha uma qualidade e clique em converter. O download é um arquivo .webp. É grátis e não exige cadastro.',
        },
        {
          question: 'A conversão de PNG para WebP mantém a transparência?',
          answer: 'Sim. O WebP suporta canal alfa, então PNGs transparentes continuam transparentes após a conversão.',
        },
        {
          question: 'Quanto menor o WebP vai ficar?',
          answer: 'Depende da imagem, mas o WebP costuma ser 25–80% menor que o PNG de origem com qualidade visual semelhante.',
        },
        {
          question: 'O WebP é suportado em todo lugar?',
          answer: 'Todos os navegadores modernos suportam WebP. Alguns programas antigos ou de nicho não suportam: mantenha um PNG de reserva se precisar atendê-los.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A transparência é preservada na saída WebP.',
        ],
      },
      related: [
        {
          label: 'Converter WebP para PNG',
          to: '/tools/convert-webp-to-png',
          description: 'Faça o caminho inverso, de volta a um PNG sem perdas.',
        },
        {
          label: 'Converter JPG para WebP',
          to: '/tools/convert-jpg-to-webp',
          description: 'Reduza fotos JPG a WebP para a web.',
        },
        {
          label: 'Comprimir imagem',
          to: '/tools/compress-image',
          description: 'Reduza imagens ainda mais sem mudar o formato.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre JPG, PNG, WebP, AVIF e GIF.',
        },
        {
          label: 'Tutorial do conversor de imagens',
          to: '/tutorials/image/getting-started',
          description: 'Percorra todas as opções de imagem em detalhes.',
        },
      ],
      embed: {
        title: 'Converter PNG para WebP',
        description: 'Envie uma imagem PNG. Nesta ferramenta, a saída é travada em WebP: escolha uma qualidade e converta. A transparência é preservada, e os arquivos WebP normalmente são muito menores que o PNG.',
      },
    },
    'convert-jpg-to-webp': {
      name: 'Converter JPG para WebP',
      h1: 'Converter JPG para WebP online grátis',
      tagline: 'Reduza fotos JPG a arquivos WebP modernos, que carregam mais rápido na web com a mesma qualidade visual.',
      metaTitle: 'Converter JPG para WebP online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de JPG para WebP. Reduza fotos .jpg a imagens WebP menores para sites mais rápidos, na qualidade que você escolher. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter JPG para WebP online grátis',
      ogDescription: 'Reduza fotos JPG a arquivos WebP menores para sites mais rápidos, com a mesma qualidade visual. Grátis e sem cadastro.',
      intro: 'O WebP entrega a mesma qualidade visual do JPG em um arquivo visivelmente menor, e é por isso que ele se tornou o formato de imagem padrão de sites rápidos. O Media Manipulator converte seu JPG para WebP na qualidade que você escolher, para que suas fotos pareçam iguais, mas carreguem mais rápido.',
      whatItDoes: [
        'Converte qualquer foto .jpg/.jpeg em um arquivo .webp moderno.',
        'Permite escolher a qualidade do WebP para equilibrar o tamanho do arquivo e a fidelidade.',
        'Normalmente produz arquivos 25–35% menores que o JPG de origem com a mesma qualidade.',
        'A foto parece a mesma; seus bytes são recodificados com WebP para deixar o arquivo menor.',
      ],
      flowSteps: [
        {
          title: 'Envie o JPG',
          description: 'Solte uma foto .jpg ou .jpeg.',
        },
        {
          title: 'Escolha a qualidade do WebP',
          description: '80–85 corresponde de perto à qualidade típica de um JPG.',
        },
        {
          title: 'Codifique o WebP',
          description: 'O ImageMagick recodifica sua foto como WebP.',
        },
        {
          title: 'Baixe o WebP',
          description: 'Salve um .webp menor, pronto para a web.',
        },
      ],
      advancedDetails: [
        'Com qualidade visual equivalente, o WebP costuma ser 25–35% menor que o JPG graças a uma compressão mais moderna.',
        'Evite empilhar compressões pesadas: recodificar um JPG que já tem perdas em uma qualidade WebP muito baixa pode acumular artefatos.',
        'O WebP é suportado por todos os navegadores modernos: sirva-o diretamente para acelerar o carregamento das páginas.',
        'Para máxima compatibilidade com softwares muito antigos, mantenha um JPG de reserva.',
      ],
      whyItMatters: [
        'Imagens mais leves melhoram diretamente o tempo de carregamento da página, a taxa de rejeição e o SEO.',
        'O WebP dá a você qualidade semelhante ao JPG em um tamanho menor, com uma só conversão.',
        'Os Core Web Vitals recompensam imagens menores: o WebP é uma vitória rápida.',
      ],
      useCases: [
        {
          title: 'Sites mais rápidos',
          description: 'Converta JPGs de destaque e de galeria para WebP para reduzir o peso da página.',
        },
        {
          title: 'Catálogos de e-commerce',
          description: 'Reduza fotos de produtos para que os anúncios carreguem na hora.',
        },
        {
          title: 'Blogs e artigos',
          description: 'Sirva imagens incorporadas mais leves, sem perda visível de qualidade.',
        },
        {
          title: 'Fotos para e-mail',
          description: 'Obtenha arquivos menores, que ficam abaixo dos limites de anexo.',
        },
      ],
      whyMediaManipulator: [
        'A saída é travada em WebP, então não há nada para configurar errado.',
        'Controle preciso de qualidade em vez de uma predefinição fixa.',
      ],
      privacyNote: 'Seu JPG é recodificado como um WebP menor no nosso servidor, na qualidade que você escolher. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Como converto JPG para WebP de graça?',
          answer: 'Envie seu .jpg acima, escolha uma qualidade e clique em converter. O download é um arquivo .webp. É grátis e não exige cadastro.',
        },
        {
          question: 'O WebP é melhor que o JPG?',
          answer: 'Para a web, normalmente sim: o WebP entrega qualidade semelhante em um tamanho menor. O JPG ainda vence em compatibilidade universal com softwares muito antigos.',
        },
        {
          question: 'Quanto menor é o WebP em relação ao JPG?',
          answer: 'Com qualidade visual equivalente, o WebP costuma ser 25–35% menor que o JPG, embora a economia exata dependa da imagem.',
        },
        {
          question: 'Converter JPG para WebP perde qualidade?',
          answer: 'Os dois formatos têm perdas. Na qualidade 80–85, o resultado parece igual ao JPG. Evite definir a qualidade do WebP muito baixa para não acumular artefatos.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'O JPG não tem transparência, então a saída WebP é totalmente opaca.',
        ],
      },
      related: [
        {
          label: 'Converter WebP para JPG',
          to: '/tools/convert-webp-to-jpg',
          description: 'Faça o caminho inverso, de volta a um JPG universal.',
        },
        {
          label: 'Converter PNG para WebP',
          to: '/tools/convert-png-to-webp',
          description: 'Reduza gráficos PNG a WebP para a web.',
        },
        {
          label: 'Comprimir imagem',
          to: '/tools/compress-image',
          description: 'Reduza imagens ainda mais sem mudar o formato.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre JPG, PNG, WebP, AVIF e GIF.',
        },
        {
          label: 'Tutorial do conversor de imagens',
          to: '/tutorials/image/getting-started',
          description: 'Percorra todas as opções de imagem em detalhes.',
        },
      ],
      embed: {
        title: 'Converter JPG para WebP',
        description: 'Envie uma imagem JPG. Nesta ferramenta, a saída é travada em WebP: escolha uma qualidade e converta. O WebP normalmente produz um arquivo menor que o JPG com a mesma qualidade visual.',
      },
    },
    'jpg-converter': {
      name: 'Conversor de JPG',
      tagline: 'Converta imagens para JPG: o conversor de imagens com JPG já selecionado.',
    },
    'png-converter': {
      name: 'Conversor de PNG',
      tagline: 'Converta imagens para PNG: o conversor de imagens com PNG já selecionado.',
    },
    'convert-jpg-to-pdf': {
      name: 'Converter JPG para PDF',
      h1: 'Converter JPG para PDF online grátis',
      tagline: 'Transforme fotos e scans JPG em documentos PDF limpos, prontos para compartilhar, imprimir ou enviar.',
      metaTitle: 'Converter JPG para PDF online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de JPG para PDF. Transforme fotos e scans .jpg em documentos PDF limpos, sem perda de qualidade. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter JPG para PDF online grátis',
      ogDescription: 'Transforme fotos e scans JPG em documentos PDF limpos. Sem perdas, grátis, sem cadastro.',
      intro: 'JPG é o formato em que seu celular e sua câmera fotografam, mas um PDF é o que a maioria dos formulários, inscrições e escritórios quer. O Media Manipulator incorpora seu JPG diretamente em um PDF, sem recompressão, então o documento fica exatamente igual à sua foto e continua pequeno.',
      whatItDoes: [
        'Envolve uma foto JPG/JPEG em um documento PDF de uma única página.',
        'Incorpora os bytes originais do JPG sem perdas: zero compressão adicional.',
        'Dimensiona a página conforme a foto, para que nada seja cortado ou esticado.',
        'Produz um PDF padrão que abre e imprime em qualquer lugar.',
      ],
      flowSteps: [
        {
          title: 'Envie o JPG',
          description: 'Solte uma foto ou um scan .jpg ou .jpeg.',
        },
        {
          title: 'Nós incorporamos',
          description: 'O JPG é colocado em uma página do mesmo tamanho, sem compressão.',
        },
        {
          title: 'Gere o PDF',
          description: 'Um PDF padrão de uma única página é montado.',
        },
        {
          title: 'Baixe o PDF',
          description: 'Salve um .pdf limpo, pronto para compartilhar ou enviar.',
        },
      ],
      advancedDetails: [
        'O fluxo JPG é incorporado com o filtro /DCTDecode do PDF, o que significa que a foto é armazenada como está: sem uma segunda rodada de compressão com perdas.',
        'Como não há recodificação, um documento de JPG para PDF normalmente tem mais ou menos o mesmo tamanho da foto original.',
        'A página é dimensionada a partir da imagem a 96 DPI, então uma foto típica de celular gera uma página de tamanho confortável.',
      ],
      whyItMatters: [
        'Formulários, portais e inscrições exigem com frequência PDF, e não JPG.',
        'Um PDF imprime de forma previsível, enquanto um JPG bruto pode ser repetido em mosaico ou redimensionado.',
        'A incorporação sem perdas mantém legível o texto de um documento digitalizado.',
      ],
      useCases: [
        {
          title: 'Candidaturas a vagas',
          description: 'Transforme a foto de um formulário assinado em um PDF que o portal aceite.',
        },
        {
          title: 'Recibos e despesas',
          description: 'Converta fotos de recibos em PDFs para relatórios de despesas.',
        },
        {
          title: 'Documentos digitalizados',
          description: 'Envolva um scan de celular de uma página em um PDF organizado.',
        },
        {
          title: 'Impressão',
          description: 'Obtenha uma impressão previsível a partir de um JPG.',
        },
      ],
      whyMediaManipulator: [
        'Realmente sem perdas: o JPG dentro do PDF é idêntico ao seu original.',
        'A saída é fixada em PDF, então não há nada para configurar errado.',
      ],
      privacyNote: 'Seu JPG é colocado, sem ser recomprimido, em uma única página de PDF que o nosso servidor monta. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Como converto um JPG para PDF de graça?',
          answer: 'Envie seu .jpg acima e clique em converter: a saída é um PDF de uma única página. É grátis e não exige cadastro.',
        },
        {
          question: 'Converter JPG para PDF reduz a qualidade?',
          answer: 'Não. O JPG é incorporado diretamente no PDF sem recompressão, então a qualidade da imagem é idêntica à do seu arquivo original.',
        },
        {
          question: 'O PDF vai ficar muito maior que o meu JPG?',
          answer: 'Não: como não há recodificação, o PDF tem mais ou menos o mesmo tamanho do JPG de origem, mais um invólucro de documento minúsculo.',
        },
        {
          question: 'Posso juntar vários JPGs em um PDF?',
          answer: 'Esta ferramenta gera um PDF por imagem. Converta cada JPG e una os PDFs em uma ferramenta de mesclagem se precisar de várias páginas.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'O JPG é incorporado sem perdas (sem recompressão) em um PDF de uma única página.',
        ],
      },
      related: [
        {
          label: 'Converter PNG para PDF',
          to: '/tools/convert-png-to-pdf',
          description: 'Conversor dedicado de PNG → PDF.',
        },
        {
          label: 'Imagem para PDF',
          to: '/tools/image-to-pdf',
          description: 'Converta qualquer formato de imagem em PDF.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre JPG, PNG, WebP, AVIF e mais.',
        },
        {
          label: 'PDF para JPG',
          to: '/tools/pdf-to-jpg',
          description: 'Faça o caminho inverso: renderize um PDF em JPG.',
        },
        {
          label: 'Conversor de PDF',
          to: '/tools/pdf-converter',
          description: 'A central completa de conversão de PDF.',
        },
      ],
      embed: {
        title: 'Converter JPG para PDF',
        description: 'Envie uma imagem JPG. A saída é fixada em PDF, e seu JPG é incorporado sem perdas: a foto dentro do PDF é idêntica bit a bit ao seu original.',
      },
    },
    'convert-png-to-pdf': {
      name: 'Converter PNG para PDF',
      h1: 'Converter PNG para PDF online grátis',
      tagline: 'Transforme capturas de tela, gráficos e scans PNG em documentos PDF limpos e nítidos.',
      metaTitle: 'Converter PNG para PDF online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de PNG para PDF. Transforme capturas de tela e gráficos .png em documentos PDF nítidos e sem perdas. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter PNG para PDF online grátis',
      ogDescription: 'Transforme capturas de tela e gráficos PNG em documentos PDF nítidos e sem perdas. Grátis, sem cadastro.',
      intro: 'PNG é o formato para capturas de tela, diagramas e gráficos com texto nítido e bordas bem definidas. Quando você precisa enviar ou imprimir um deles como documento, o PDF é o invólucro certo. O Media Manipulator incorpora seu PNG sem perdas em um PDF, para que cada borda continue nítida.',
      whatItDoes: [
        'Envolve uma imagem PNG em um documento PDF de uma única página.',
        'Incorpora a imagem sem perdas, para que texto e desenhos de linha continuem nítidos.',
        'Achata a transparência sobre branco, já que as páginas de PDF são opacas.',
        'Produz um PDF padrão que abre e imprime em qualquer lugar.',
      ],
      flowSteps: [
        {
          title: 'Envie o PNG',
          description: 'Solte uma captura de tela, um diagrama ou um gráfico .png.',
        },
        {
          title: 'Nós incorporamos',
          description: 'O PNG é composto sobre uma página branca e incorporado sem perdas.',
        },
        {
          title: 'Gere o PDF',
          description: 'Um PDF padrão de uma única página é montado.',
        },
        {
          title: 'Baixe o PDF',
          description: 'Salve um .pdf nítido, pronto para compartilhar ou imprimir.',
        },
      ],
      advancedDetails: [
        'Os PNGs são decodificados e incorporados com compressão zlib (Flate) sem perdas, então texto e bordas nítidos são preservados com exatidão: sem artefatos de JPEG.',
        'As áreas transparentes viram brancas porque as páginas de PDF não têm canal alfa.',
        'A página é dimensionada a partir da imagem a 96 DPI, para um tamanho físico padrão razoável.',
      ],
      whyItMatters: [
        'Capturas de tela e diagramas costumam ser enviados como PDF em tickets e relatórios.',
        'A incorporação sem perdas mantém legíveis textos pequenos e linhas finas.',
        'O PDF imprime de forma previsível, enquanto um PNG bruto pode ser redimensionado de forma inesperada.',
      ],
      useCases: [
        {
          title: 'Relatórios de bugs',
          description: 'Transforme uma captura de tela em um PDF para anexar a um ticket.',
        },
        {
          title: 'Diagramas e gráficos',
          description: 'Envolva um gráfico exportado em um PDF fácil de compartilhar.',
        },
        {
          title: 'Formulários digitalizados',
          description: 'Converta um scan em PNG em um documento PDF organizado.',
        },
        {
          title: 'Impressão',
          description: 'Obtenha impressões nítidas e previsíveis a partir de um PNG.',
        },
      ],
      whyMediaManipulator: [
        'A incorporação sem perdas mantém texto e bordas extremamente nítidos.',
        'A saída é fixada em PDF, então não há nada para configurar errado.',
      ],
      privacyNote: 'Seu PNG é incorporado sem perdas em um PDF de uma página no nosso servidor, com a transparência achatada sobre branco. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Como converto um PNG para PDF de graça?',
          answer: 'Envie seu .png acima e clique em converter: a saída é um PDF de uma única página. É grátis e não exige cadastro.',
        },
        {
          question: 'Converter PNG para PDF mantém o texto nítido?',
          answer: 'Sim. O PNG é incorporado sem perdas, então texto e desenhos de linha continuam nítidos, sem artefatos no estilo JPEG.',
        },
        {
          question: 'O que acontece com um PNG transparente?',
          answer: 'As áreas transparentes são achatadas sobre um fundo branco porque as páginas de PDF são opacas. O conteúdo visível não muda.',
        },
        {
          question: 'Posso unir vários PNGs em um PDF?',
          answer: 'Esta ferramenta cria um PDF por imagem. Converta cada PNG e una os PDFs em uma ferramenta de mesclagem para documentos de várias páginas.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'O PNG é incorporado sem perdas. A transparência é achatada sobre branco porque as páginas de PDF são opacas.',
        ],
      },
      related: [
        {
          label: 'Converter JPG para PDF',
          to: '/tools/convert-jpg-to-pdf',
          description: 'Conversor dedicado de JPG → PDF.',
        },
        {
          label: 'Imagem para PDF',
          to: '/tools/image-to-pdf',
          description: 'Converta qualquer formato de imagem em PDF.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre JPG, PNG, WebP, AVIF e mais.',
        },
        {
          label: 'PDF para PNG',
          to: '/tools/pdf-to-png',
          description: 'Faça o caminho inverso: renderize um PDF em PNG.',
        },
        {
          label: 'Conversor de PDF',
          to: '/tools/pdf-converter',
          description: 'A central completa de conversão de PDF.',
        },
      ],
      embed: {
        title: 'Converter PNG para PDF',
        description: 'Envie uma imagem PNG. A saída é fixada em PDF, e seu PNG é incorporado sem perdas, para que texto e bordas bem definidas continuem nítidos na página.',
      },
    },
    'pdf-to-png': {
      name: 'PDF para PNG',
      h1: 'Converter PDF em PNG online grátis',
      tagline: 'Renderize cada página de um PDF em imagens PNG nítidas e sem perdas, ideais para textos, diagramas e edição.',
      metaTitle: 'Converter PDF em PNG online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de PDF para PNG. Renderize todas as páginas de um PDF em imagens PNG nítidas e sem perdas, baixadas em um ZIP. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter PDF em PNG online grátis',
      ogDescription: 'Renderize todas as páginas de um PDF em imagens PNG nítidas e sem perdas. Grátis, rápido, sem cadastro.',
      intro: 'PNG é a melhor escolha quando uma página de PDF tem texto nítido, linhas finas ou diagramas que você quer manter extremamente nítidos. O Media Manipulator renderiza cada página em um PNG sem perdas com o Poppler, então não há artefatos de JPEG ao redor do texto. Escolha todas as páginas ou só a primeira, e defina a resolução.',
      whatItDoes: [
        'Renderiza cada página do PDF em uma imagem PNG sem perdas no DPI que você escolher.',
        'Converte todas as páginas (baixadas como um ZIP) ou só a primeira página (um único PNG).',
        'Nomeia a saída de várias páginas com clareza: page-001.png, page-002.png e assim por diante.',
        'Mantém texto e desenhos de linha nítidos com a codificação PNG sem perdas.',
      ],
      flowSteps: [
        {
          title: 'Envie o PDF',
          description: 'Solte qualquer documento .pdf.',
        },
        {
          title: 'Escolha páginas e DPI',
          description: 'Todas as páginas ou só a primeira; 150 DPI é um bom padrão.',
        },
        {
          title: 'Renderize em PNG',
          description: 'O Poppler rasteriza cada página em um PNG sem perdas.',
        },
        {
          title: 'Baixe',
          description: 'Receba um único PNG ou um ZIP com um PNG por página.',
        },
      ],
      advancedDetails: [
        'A renderização usa o Poppler (pdftoppm) para uma saída de página precisa e fiel.',
        'O PNG é sem perdas, então é a escolha melhor que o JPG quando a página é principalmente texto, diagramas ou gráficos nítidos.',
        'Um DPI maior gera imagens mais nítidas e maiores: 150 DPI serve para telas, 300 DPI serve para impressão.',
        'Os PNGs renderizados têm fundo branco; as páginas de PDF são opacas, então não há transparência a preservar.',
      ],
      whyItMatters: [
        'O PNG sem perdas mantém legíveis textos pequenos e linhas finas, sem artefatos.',
        'Páginas em PNG se encaixam direto em editores, documentos e ferramentas de design.',
        'Uma página renderizada captura o layout visual exato do documento.',
      ],
      useCases: [
        {
          title: 'Diagramas e esquemas',
          description: 'Renderize páginas técnicas sem artefatos.',
        },
        {
          title: 'Anotações e revisão',
          description: 'Abra uma página nítida em um editor para anotar.',
        },
        {
          title: 'Recursos de design',
          description: 'Leve um gráfico de página limpo para uma ferramenta de design.',
        },
        {
          title: 'Miniaturas',
          description: 'Gere uma prévia nítida em PNG da primeira página.',
        },
      ],
      whyMediaManipulator: [
        'A renderização em PNG sem perdas mantém texto e bordas nítidos.',
        'Empacotamento em ZIP claro e organizado, com nomes de arquivo numerados por página e ordenáveis.',
      ],
      privacyNote: 'As páginas do seu PDF são renderizadas em imagens PNG com o Poppler no nosso servidor e, quando há mais de uma página, empacotadas em um ZIP. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Como converto um PDF em PNG de graça?',
          answer: 'Envie seu .pdf acima, escolha todas as páginas ou só a primeira, defina um DPI e clique em converter.',
        },
        {
          question: 'Por que escolher PNG em vez de JPG para um PDF?',
          answer: 'O PNG é sem perdas, então mantém texto, linhas finas e diagramas nítidos, sem artefatos de compressão. O JPG é melhor quando você quer arquivos menores para páginas com muitas fotos.',
        },
        {
          question: 'Vou receber uma imagem ou várias?',
          answer: 'Escolha "todas as páginas" para receber um ZIP com um PNG por página (page-001.png, …) ou "só a primeira página" para um único PNG.',
        },
        {
          question: 'Os PNGs têm fundo transparente?',
          answer: 'Não: as páginas de PDF são opacas, então as páginas renderizadas têm fundo branco. Não há transparência a preservar.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A saída de todas as páginas é entregue como um .zip; a saída da primeira página é um único .png.',
          'As páginas renderizadas têm fundo branco: as páginas de PDF são opacas, então não há transparência.',
        ],
      },
      related: [
        {
          label: 'PDF para JPG',
          to: '/tools/pdf-to-jpg',
          description: 'Renderize páginas de PDF em JPG compacto, em vez de PNG.',
        },
        {
          label: 'Conversor de PDF',
          to: '/tools/pdf-converter',
          description: 'Converta PDFs em imagens e imagens em PDF.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta as imagens renderizadas entre formatos.',
        },
        {
          label: 'Imagem para PDF',
          to: '/tools/image-to-pdf',
          description: 'Faça o caminho inverso: transforme imagens em um PDF.',
        },
      ],
      embed: {
        title: 'Converter PDF em PNG',
        description: 'Envie um PDF. Cada página é renderizada em uma imagem PNG sem perdas. Escolha "todas as páginas" para um ZIP ou "só a primeira página" para um único PNG. Escolha um DPI de renderização para uma saída mais nítida.',
      },
    },
    'pdf-converter': {
      name: 'Conversor de PDF',
      h1: 'Conversor de PDF online grátis',
      tagline: 'Converta PDFs em imagens JPG ou PNG e transforme imagens em PDFs, tudo em um só lugar.',
      metaTitle: 'Conversor de PDF online grátis | Media Manipulator',
      metaDescription: 'Conversor de PDF online gratuito. Converta PDF em imagens JPG ou PNG e converta imagens em PDF. Sem cadastro, sem marcas d\'água. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Conversor de PDF online grátis',
      ogDescription: 'Converta PDF em imagens JPG/PNG e imagens em PDF, tudo em uma única ferramenta gratuita. Sem cadastro.',
      intro: 'O conversor de PDF cuida das duas direções em um só lugar: renderize as páginas de um PDF em imagens JPG ou PNG, ou envolva uma imagem em um documento PDF. Envie um PDF e você recebe os controles de exportação de imagem; envie uma imagem e você recebe imagem para PDF. Tudo roda nos nossos próprios servidores.',
      whatItDoes: [
        'Converte páginas de PDF em JPG ou PNG na resolução que você escolher.',
        'Converte JPG, PNG e outras imagens em PDFs de uma única página.',
        'Empacota exportações de PDFs com várias páginas em um ZIP organizado de imagens numeradas.',
        'Adapta o formulário automaticamente ao arquivo que você envia.',
      ],
      flowSteps: [
        {
          title: 'Envie um arquivo',
          description: 'Solte um PDF ou uma imagem, como JPG ou PNG.',
        },
        {
          title: 'Escolha a saída',
          description: 'Para um PDF, escolha JPG/PNG, páginas e DPI; para uma imagem, a saída é PDF.',
        },
        {
          title: 'Converta',
          description: 'Nós renderizamos ou envolvemos seu arquivo no nosso servidor.',
        },
        {
          title: 'Baixe',
          description: 'Salve um PDF, uma única imagem ou um ZIP com as imagens das páginas.',
        },
      ],
      advancedDetails: [
        'A renderização de PDF → imagem usa o Poppler (pdftoppm); imagem → PDF incorpora JPGs sem perdas e os outros formatos com compressão Flate sem perdas.',
        'Exportações de PDFs com várias páginas são entregues como um .zip com nomes de arquivo ordenáveis page-001/page-002.',
        'Imagem para PDF dimensiona a página conforme a imagem a 96 DPI; PDF para imagem usa 150 DPI por padrão e aceita até 300+ para impressão.',
        'Um limite de contagem de páginas protege contra PDFs grandes demais.',
      ],
      whyItMatters: [
        'Uma única ferramenta cobre as duas direções mais comuns de conversão de PDF.',
        'Não é preciso procurar uma ferramenta separada dependendo da direção em que você está convertendo.',
        'Qualidade consistente, no servidor, independentemente do seu navegador ou dispositivo.',
      ],
      useCases: [
        {
          title: 'Fluxos de trabalho mistos',
          description: 'Alterne entre PDF→imagem e imagem→PDF sem trocar de ferramenta.',
        },
        {
          title: 'Preparação de documentos',
          description: 'Transforme imagens em PDFs para formulários de envio.',
        },
        {
          title: 'Reaproveitamento',
          description: 'Renderize páginas de PDF em imagens para slides ou redes sociais.',
        },
        {
          title: 'Prévias rápidas',
          description: 'Gere uma imagem da primeira página de qualquer PDF.',
        },
      ],
      whyMediaManipulator: [
        'As duas direções de conversão em uma única ferramenta adaptável.',
        'Imagem→PDF sem perdas e renderização PDF→imagem precisa com o Poppler.',
      ],
      privacyNote: 'Seu PDF é renderizado página por página em imagens, ou sua imagem é envolvida em um PDF, pelo Poppler e pelo ImageMagick no nosso servidor. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'O que o conversor de PDF faz?',
          answer: 'Ele converte páginas de PDF em imagens JPG ou PNG e converte imagens (JPG, PNG e mais) em documentos PDF, tudo em uma única ferramenta gratuita.',
        },
        {
          question: 'Como ele sabe em que direção converter?',
          answer: 'Ele se adapta ao seu envio: um PDF mostra os controles de exportação de imagem (formato, páginas, DPI), enquanto uma imagem é convertida em PDF.',
        },
        {
          question: 'Posso converter um PDF de várias páginas em imagens?',
          answer: 'Sim. Escolha "todas as páginas" e você recebe um ZIP contendo uma imagem por página, nomeadas page-001, page-002 e assim por diante.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Envie um PDF para PDF→imagem; envie uma imagem para imagem→PDF. O formulário se adapta automaticamente.',
          'A exportação de todas as páginas de um PDF é entregue como um .zip de imagens numeradas.',
        ],
      },
      related: [
        {
          label: 'PDF para JPG',
          to: '/tools/pdf-to-jpg',
          description: 'Renderize páginas de PDF em imagens JPG.',
        },
        {
          label: 'PDF para PNG',
          to: '/tools/pdf-to-png',
          description: 'Renderize páginas de PDF em imagens PNG sem perdas.',
        },
        {
          label: 'Imagem para PDF',
          to: '/tools/image-to-pdf',
          description: 'Transforme qualquer imagem em um PDF.',
        },
        {
          label: 'Converter JPG para PDF',
          to: '/tools/convert-jpg-to-pdf',
          description: 'Conversor dedicado de JPG → PDF.',
        },
        {
          label: 'Converter PNG para PDF',
          to: '/tools/convert-png-to-pdf',
          description: 'Conversor dedicado de PNG → PDF.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre formatos de imagem.',
        },
      ],
      embed: {
        title: 'Converter um PDF ou uma imagem',
        description: 'Envie um PDF para renderizar suas páginas em imagens JPG ou PNG, ou envie uma imagem para transformá-la em PDF. O formulário se adapta ao arquivo que você escolher.',
      },
    },
    'convert-heic-to-jpg': {
      name: 'Converter HEIC para JPG',
      h1: 'Converter HEIC para JPG online grátis',
      tagline: 'Transforme fotos HEIC do iPhone em arquivos JPG compatíveis com tudo, que abrem e podem ser enviados em qualquer lugar.',
      metaTitle: 'Converter HEIC para JPG online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de HEIC para JPG. Transforme fotos .heic/.heif do iPhone em arquivos JPG compatíveis com tudo. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter HEIC para JPG online grátis',
      ogDescription: 'Transforme fotos HEIC do iPhone em arquivos JPG compatíveis com tudo. Grátis, rápido, sem cadastro.',
      intro: 'HEIC é o formato de alta eficiência que os iPhones usam para economizar espaço, mas ele não abre em muitos PCs com Windows, sites ou apps mais antigos. O Media Manipulator converte suas fotos HEIC em JPG, o formato que funciona em qualquer lugar, com a orientação correta e a qualidade que você escolher.',
      whatItDoes: [
        'Converte fotos HEIC/HEIF da Apple em JPG padrão.',
        'Orienta a imagem automaticamente usando o EXIF, para que os retratos não fiquem de lado.',
        'Permite escolher a qualidade do JPG para equilibrar tamanho de arquivo e fidelidade.',
        'Produz um JPG que abre em qualquer dispositivo, site ou app.',
      ],
      flowSteps: [
        {
          title: 'Envie o HEIC',
          description: 'Solte uma foto .heic ou .heif do seu iPhone.',
        },
        {
          title: 'Orientação automática',
          description: 'Nós lemos a orientação EXIF para que a foto fique na posição certa.',
        },
        {
          title: 'Codifique em JPG',
          description: 'O ImageMagick decodifica o HEIC (libheif) e grava um JPG.',
        },
        {
          title: 'Baixe o JPG',
          description: 'Salve um arquivo .jpg compatível com tudo.',
        },
      ],
      advancedDetails: [
        'A decodificação de HEIC depende de um ImageMagick compilado com o delegado libheif. Se o servidor não tiver suporte a HEIC, a ferramenta devolve um erro claro em vez de um arquivo quebrado.',
        'Qualidade 85–90 é um ótimo padrão: o HEIC já é eficiente, então um JPG de alta qualidade mantém a foto com aparência idêntica.',
        'A orientação EXIF é aplicada antes da codificação, o que corrige o problema comum da foto "girada 90°" quando o HEIC é convertido de forma ingênua.',
      ],
      whyItMatters: [
        'O Windows, muitos formulários de envio na web e softwares mais antigos ainda não conseguem abrir HEIC.',
        'Compartilhar um JPG garante que o destinatário consiga vê-lo em qualquer dispositivo.',
        'A maioria dos laboratórios de impressão e marketplaces exige JPG.',
      ],
      useCases: [
        {
          title: 'Compartilhar fotos do iPhone',
          description: 'Envie fotos que abrem em qualquer celular ou PC.',
        },
        {
          title: 'Envios na web',
          description: 'Atenda formulários e sites que rejeitam HEIC.',
        },
        {
          title: 'Impressão',
          description: 'Converta para JPG antes de encomendar impressões.',
        },
        {
          title: 'Edição em apps mais antigos',
          description: 'Abra sua foto em softwares sem suporte a HEIC.',
        },
      ],
      whyMediaManipulator: [
        'Orientação automática correta: nenhuma foto de lado.',
        'Controle de qualidade em vez de uma predefinição fixa.',
      ],
      privacyNote: 'Sua foto HEIC é decodificada no nosso servidor, colocada na posição certa e salva como JPG. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Como converto HEIC para JPG de graça?',
          answer: 'Envie sua foto .heic acima, escolha uma qualidade e clique em converter. Você recebe de volta um .jpg padrão.',
        },
        {
          question: 'Por que minha foto HEIC não abre no Windows?',
          answer: 'HEIC é um formato preferido pela Apple que versões mais antigas do Windows e muitos apps não conseguem ler. Converter para JPG faz a foto abrir em qualquer lugar.',
        },
        {
          question: 'A foto vai perder qualidade?',
          answer: 'O JPG tem perdas, mas com qualidade 85–90 o resultado fica idêntico ao HEIC original em praticamente todas as fotos.',
        },
        {
          question: 'Por que minha foto convertida ficou girada antes?',
          answer: 'Conversores ingênuos ignoram a orientação EXIF. Nós orientamos a imagem automaticamente, então sua foto sai na posição certa.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A decodificação de HEIC exige o ImageMagick com um delegado libheif no servidor.',
        ],
      },
      related: [
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre JPG, PNG, WebP, AVIF e mais.',
        },
        {
          label: 'Converter AVIF para JPG',
          to: '/tools/convert-avif-to-jpg',
          description: 'Converta fotos AVIF modernas em JPG.',
        },
        {
          label: 'Comprimir imagem',
          to: '/tools/compress-image',
          description: 'Reduza o JPG para a web.',
        },
        {
          label: 'Tutorial do conversor de imagens',
          to: '/tutorials/image/getting-started',
          description: 'Percorra todas as opções de imagem.',
        },
      ],
      embed: {
        title: 'Converter HEIC para JPG',
        description: 'Envie uma foto HEIC ou HEIF do seu iPhone. A saída é fixada em JPG, orientada automaticamente para aparecer na posição certa, na qualidade que você escolher.',
      },
    },
    'convert-avif-to-jpg': {
      name: 'Converter AVIF para JPG',
      h1: 'Converter AVIF para JPG online grátis',
      tagline: 'Transforme imagens AVIF modernas em arquivos JPG compatíveis com tudo, para apps e sites que não aceitam AVIF.',
      metaTitle: 'Converter AVIF para JPG online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de AVIF para JPG. Transforme imagens .avif em arquivos JPG compatíveis com tudo, na qualidade que você escolher. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter AVIF para JPG online grátis',
      ogDescription: 'Transforme imagens AVIF modernas em arquivos JPG compatíveis com tudo. Grátis, rápido e sem cadastro.',
      intro: 'O AVIF é um formato de imagem de última geração que gera arquivos minúsculos, mas muitos apps, editores e formulários de envio ainda não conseguem abri-lo. O Media Manipulator converte AVIF para JPG para que sua imagem funcione em qualquer lugar. Escolha uma qualidade e baixe.',
      whatItDoes: [
        'Converte imagens AVIF para JPG padrão.',
        'Achata qualquer transparência sobre um fundo, já que o JPG não tem canal alfa.',
        'Permite escolher a qualidade do JPG para o equilíbrio entre tamanho e fidelidade que você quiser.',
        'Gera um JPG que abre em qualquer dispositivo ou app.',
      ],
      flowSteps: [
        {
          title: 'Enviar AVIF',
          description: 'Solte uma imagem .avif.',
        },
        {
          title: 'Escolher a qualidade do JPG',
          description: '85 é um padrão equilibrado.',
        },
        {
          title: 'Codificar JPG',
          description: 'O ImageMagick decodifica o AVIF (libaom/libheif) e grava um JPG.',
        },
        {
          title: 'Baixar JPG',
          description: 'Salve um .jpg compatível com tudo.',
        },
      ],
      advancedDetails: [
        'A decodificação de AVIF depende de um ImageMagick compilado com um delegado AVIF (libaom ou libheif). Se o servidor não tiver suporte a AVIF, a ferramenta retorna um erro claro.',
        'O AVIF suporta transparência; ao converter para JPG, as áreas transparentes são achatadas porque o JPG não tem canal alfa. Use AVIF → PNG para manter a transparência.',
        'A qualidade 85–90 mantém o JPG visualmente idêntico ao AVIF na maioria das imagens.',
      ],
      whyItMatters: [
        'Muitos apps e formulários de envio ainda não suportam AVIF.',
        'O JPG garante que o destinatário consiga abrir a imagem.',
        'A conversão permite usar um AVIF baixado em qualquer lugar onde você precise de um JPG.',
      ],
      useCases: [
        {
          title: 'Salvar imagens da web',
          description: 'Converta um AVIF que você baixou em um JPG utilizável.',
        },
        {
          title: 'Compatibilidade com apps',
          description: 'Abra um AVIF em programas sem suporte a AVIF.',
        },
        {
          title: 'Envios',
          description: 'Atenda a um formulário que só aceita JPG.',
        },
        {
          title: 'Impressão',
          description: 'Gere um JPG para um laboratório fotográfico.',
        },
      ],
      whyMediaManipulator: [
        'Controle de qualidade em vez de uma predefinição única para todos os casos.',
        'Roda nos nossos próprios servidores, sem processamento por terceiros.',
      ],
      privacyNote: 'Seu AVIF é decodificado no nosso servidor e recodificado como JPG na qualidade que você definir. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Como converto AVIF para JPG de graça?',
          answer: 'Envie sua imagem .avif acima, escolha uma qualidade e clique em converter. Você recebe de volta um .jpg padrão.',
        },
        {
          question: 'Por que não consigo abrir arquivos AVIF?',
          answer: 'O AVIF é um formato mais novo; muitos apps, editores e sites ainda não adicionaram suporte. Converter para JPG faz a imagem abrir em qualquer lugar.',
        },
        {
          question: 'E a transparência?',
          answer: 'O JPG não tem transparência, então as áreas transparentes do AVIF são achatadas sobre um fundo. Se você precisa manter a transparência, use a ferramenta AVIF → PNG.',
        },
        {
          question: 'Vou perder qualidade?',
          answer: 'Na qualidade 85–90, o JPG fica essencialmente idêntico ao AVIF na maioria das imagens.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A decodificação de AVIF requer o ImageMagick com um delegado AVIF no servidor. A transparência é achatada na saída em JPG.',
        ],
      },
      related: [
        {
          label: 'Converter AVIF para PNG',
          to: '/tools/convert-avif-to-png',
          description: 'Mantenha a transparência com um PNG.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre JPG, PNG, WebP, AVIF e mais.',
        },
        {
          label: 'Converter HEIC para JPG',
          to: '/tools/convert-heic-to-jpg',
          description: 'Converta fotos HEIC do iPhone para JPG.',
        },
        {
          label: 'Comprimir imagem',
          to: '/tools/compress-image',
          description: 'Reduza o JPG para a web.',
        },
      ],
      embed: {
        title: 'Converter AVIF para JPG',
        description: 'Envie uma imagem AVIF. A saída é fixada em JPG, então você recebe um arquivo que todo app, editor e formulário de envio aceita, na qualidade que você escolher.',
      },
    },
    'convert-avif-to-png': {
      name: 'Converter AVIF para PNG',
      h1: 'Converter AVIF para PNG online grátis',
      tagline: 'Transforme imagens AVIF em arquivos PNG sem perdas, que abrem em qualquer lugar e mantêm toda a transparência.',
      metaTitle: 'Converter AVIF para PNG online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de AVIF para PNG. Transforme imagens .avif em arquivos PNG sem perdas, que preservam a transparência e abrem em qualquer editor. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter AVIF para PNG online grátis',
      ogDescription: 'Transforme imagens AVIF em arquivos PNG sem perdas, que preservam a transparência. Grátis, rápido e sem cadastro.',
      intro: 'Quando uma imagem AVIF tem transparência, como um logotipo ou um recorte, converter para JPG a achataria. O PNG mantém o canal alfa e é sem perdas, então é o destino certo para gráficos. O Media Manipulator converte AVIF para PNG com a transparência intacta.',
      whatItDoes: [
        'Converte imagens AVIF para PNG sem perdas.',
        'Preserva o canal alfa para que AVIFs transparentes continuem transparentes.',
        'Gera um PNG que abre em qualquer editor, visualizador ou ferramenta de design.',
        'A imagem é preservada pixel por pixel quando o AVIF vira um PNG.',
      ],
      flowSteps: [
        {
          title: 'Enviar AVIF',
          description: 'Solte uma imagem .avif, transparente ou sólida.',
        },
        {
          title: 'Decodificar AVIF',
          description: 'O ImageMagick decodifica o AVIF com seu delegado AVIF.',
        },
        {
          title: 'Codificar PNG',
          description: 'Um PNG sem perdas é gravado com a transparência preservada.',
        },
        {
          title: 'Baixar PNG',
          description: 'Salve um arquivo .png que preserva a transparência.',
        },
      ],
      advancedDetails: [
        'A decodificação de AVIF depende de um ImageMagick compilado com um delegado AVIF (libaom ou libheif). Se o servidor não tiver suporte a AVIF, a ferramenta retorna um erro claro.',
        'A transparência do AVIF é preservada como canal alfa do PNG.',
        'O PNG é sem perdas, então a saída costuma ser maior que o AVIF de origem: é o preço da compatibilidade universal e da transparência.',
      ],
      whyItMatters: [
        'O PNG mantém a transparência que o JPG destruiria, essencial para logotipos e recortes.',
        'Alguns editores e apps não conseguem abrir AVIF; o PNG abre em qualquer lugar.',
        'O PNG é um formato de intercâmbio seguro e sem perdas para gráficos.',
      ],
      useCases: [
        {
          title: 'Logotipos transparentes',
          description: 'Converta um logotipo AVIF transparente em um PNG utilizável.',
        },
        {
          title: 'Entregas de design',
          description: 'Forneça um PNG para ferramentas que não leem AVIF.',
        },
        {
          title: 'Edição',
          description: 'Abra a imagem sem perdas no seu editor.',
        },
        {
          title: 'Recursos para a web',
          description: 'Mantenha um PNG de reserva para navegadores mais antigos.',
        },
      ],
      whyMediaManipulator: [
        'Transparência preservada automaticamente.',
        'Saída em PNG sem perdas para trabalhos gráficos.',
      ],
      privacyNote: 'Seu AVIF é decodificado no nosso servidor e salvo como um PNG sem perdas, com a transparência intacta. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Como converto AVIF para PNG de graça?',
          answer: 'Envie sua imagem .avif acima e clique em converter: a saída é um .png sem perdas, com a transparência preservada.',
        },
        {
          question: 'A conversão de AVIF para PNG mantém a transparência?',
          answer: 'Sim. O PNG suporta canal alfa, então um AVIF transparente continua transparente depois da conversão.',
        },
        {
          question: 'Devo escolher PNG ou JPG para o meu AVIF?',
          answer: 'Escolha PNG quando precisar de transparência ou de qualidade sem perdas (logotipos, gráficos). Escolha JPG para o menor arquivo quando a imagem for uma foto sem transparência.',
        },
        {
          question: 'Por que o PNG é maior que o AVIF?',
          answer: 'O AVIF é um formato comprimido altamente eficiente, enquanto o PNG é sem perdas, então o PNG costuma ser maior. Isso é esperado.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A decodificação de AVIF requer o ImageMagick com um delegado AVIF. A transparência é preservada na saída em PNG.',
        ],
      },
      related: [
        {
          label: 'Converter AVIF para JPG',
          to: '/tools/convert-avif-to-jpg',
          description: 'Converta o AVIF em um JPG compacto.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre JPG, PNG, WebP, AVIF e mais.',
        },
        {
          label: 'Converter HEIC para JPG',
          to: '/tools/convert-heic-to-jpg',
          description: 'Converta fotos HEIC do iPhone para JPG.',
        },
        {
          label: 'Remover fundo de imagem',
          to: '/tools/remove-background-from-image',
          description: 'Crie um recorte em PNG transparente automaticamente.',
        },
      ],
      embed: {
        title: 'Converter AVIF para PNG',
        description: 'Envie uma imagem AVIF. A saída é fixada em PNG, então a transparência é preservada e o arquivo abre sem perdas em qualquer editor ou visualizador.',
      },
    },
    'convert-svg-to-png': {
      name: 'Converter SVG para PNG',
      h1: 'Converter SVG para PNG online grátis',
      tagline: 'Rasterize ícones e logotipos SVG em imagens PNG de qualquer tamanho, para envios, slides e apps.',
      metaTitle: 'Converter SVG para PNG online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de SVG para PNG. Rasterize ícones e logotipos SVG em imagens PNG no tamanho que você escolher. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter SVG para PNG online grátis',
      ogDescription: 'Rasterize ícones e logotipos SVG em imagens PNG de qualquer tamanho. Grátis, rápido e sem cadastro.',
      intro: 'SVGs são vetores perfeitos, mas muitas plataformas, como redes sociais, marketplaces, ferramentas de slides e apps, só aceitam imagens rasterizadas como PNG. O Media Manipulator rasteriza seu SVG em um PNG nítido, que preserva a transparência, no tamanho que você escolher. Os SVGs são processados como entrada não confiável com um renderizador seguro.',
      whatItDoes: [
        'Rasteriza arquivos vetoriais SVG em imagens PNG.',
        'Permite definir uma largura e/ou altura de destino para a resolução da saída.',
        'Preserva no PNG a transparência do SVG.',
        'Renderiza com um rasterizador seguro, que não busca recursos externos na rede.',
      ],
      flowSteps: [
        {
          title: 'Enviar SVG',
          description: 'Solte um ícone, logotipo ou ilustração .svg.',
        },
        {
          title: 'Definir o tamanho (opcional)',
          description: 'Escolha uma largura/altura ou use o tamanho natural do SVG.',
        },
        {
          title: 'Rasterizar',
          description: 'O SVG é renderizado em uma imagem de pixels no nosso servidor.',
        },
        {
          title: 'Baixar PNG',
          description: 'Salve um .png nítido, que preserva a transparência.',
        },
      ],
      advancedDetails: [
        'A renderização usa o rsvg-convert (librsvg) quando disponível (ele não carrega recursos remotos por padrão), com o ImageMagick como alternativa reforçada.',
        'Como o SVG é vetorial, você pode renderizar em qualquer resolução sem perda de qualidade; escolha uma largura maior para uma saída mais nítida.',
        'Os SVGs enviados são tratados como entrada não confiável e processados com o acesso à rede desativado, para evitar riscos de SSRF e de busca de recursos externos.',
      ],
      whyItMatters: [
        'A maioria dos formulários de envio e das plataformas sociais rejeita SVG, mas aceita PNG.',
        'Rasterizar em um tamanho escolhido garante uma saída nítida para aquele uso.',
        'O PNG mantém a transparência de que ícones e logotipos dependem.',
      ],
      useCases: [
        {
          title: 'Redes sociais e envios',
          description: 'Transforme um logotipo SVG em um PNG que a plataforma aceita.',
        },
        {
          title: 'Apresentações',
          description: 'Coloque um PNG nítido de um ícone em um slide.',
        },
        {
          title: 'Recursos para apps',
          description: 'Exporte um PNG no tamanho exato de que seu app precisa.',
        },
        {
          title: 'E-mail',
          description: 'Use um PNG onde o SVG não é suportado.',
        },
      ],
      whyMediaManipulator: [
        'Renderize em qualquer tamanho sem perda de qualidade: vetores escalam perfeitamente.',
        'Tratamento seguro de SVG, com buscas externas desativadas.',
      ],
      privacyNote: 'Seu SVG é renderizado em PNG pelo librsvg no nosso servidor, sem buscar as imagens e fontes externas que ele referencia. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Como converto SVG para PNG de graça?',
          answer: 'Envie seu .svg acima, defina opcionalmente uma largura ou altura e clique em converter. Você recebe de volta um .png nítido.',
        },
        {
          question: 'Qual será o tamanho do PNG?',
          answer: 'Por padrão, ele usa o tamanho natural do SVG. Defina uma largura e/ou altura para renderizar maior ou menor: vetores escalam sem perda de qualidade.',
        },
        {
          question: 'O PNG mantém a transparência?',
          answer: 'Sim. As áreas transparentes do SVG são preservadas como transparência no PNG.',
        },
        {
          question: 'É seguro enviar um SVG?',
          answer: 'Sim. Tratamos os SVGs como entrada não confiável e os renderizamos com as buscas externas na rede desativadas, então referências remotas embutidas não podem ser carregadas.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Renderizado com o rsvg-convert (preferencial) ou com um ImageMagick reforçado como alternativa. As buscas externas na rede a partir do SVG são desativadas.',
        ],
      },
      related: [
        {
          label: 'Converter PNG para SVG',
          to: '/tools/convert-png-to-svg',
          description: 'Faça o caminho inverso: vetorize um PNG em SVG.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre JPG, PNG, WebP, AVIF e mais.',
        },
        {
          label: 'PNG para ICO',
          to: '/tools/png-to-ico',
          description: 'Transforme o PNG em um favicon.',
        },
      ],
      embed: {
        title: 'Converter SVG para PNG',
        description: 'Envie um SVG. A saída é fixada em PNG. Defina opcionalmente uma largura ou altura para controlar a resolução renderizada; deixe em branco para usar o tamanho natural do SVG.',
      },
    },
    'convert-png-to-svg': {
      name: 'Converter PNG para SVG',
      h1: 'Converter PNG para SVG online grátis',
      tagline: 'Vetorize logotipos, ícones e ilustrações de traço de um PNG em caminhos SVG reais e escaláveis, com o potrace.',
      metaTitle: 'Converter PNG para SVG online grátis | Media Manipulator',
      metaDescription: 'Vetorizador online gratuito de PNG para SVG. Trace logotipos, ícones e ilustrações de traço em caminhos SVG reais e escaláveis. Ideal para gráficos simples, não para fotos. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter PNG para SVG online grátis',
      ogDescription: 'Vetorize logotipos, ícones e ilustrações de traço de um PNG em caminhos SVG reais e escaláveis. Grátis e sem cadastro.',
      intro: 'A verdadeira conversão de PNG para SVG significa traçar sua imagem em caminhos vetoriais reais, que escalam para qualquer tamanho sem pixelização. O Media Manipulator usa o potrace para vetorizar seu PNG, ideal para logotipos, ícones, assinaturas e ilustrações de traço em preto e branco. É vetorização genuína, não um PNG escondido dentro de um SVG. A ferramenta não foi feita para transformar fotografias em arte vetorial limpa.',
      whatItDoes: [
        'Traça um PNG em caminhos vetoriais SVG reais e escaláveis com o potrace.',
        'Reduz a imagem a um bitmap limpo em preto e branco e depois vetoriza as formas.',
        'Permite ajustar o limiar de preto/branco para capturar mais ou menos detalhes.',
        'Gera um .svg de verdade, não uma imagem rasterizada embrulhada em uma tag <image>.',
      ],
      flowSteps: [
        {
          title: 'Enviar PNG',
          description: 'Solte um PNG de logotipo, ícone, assinatura ou ilustração de traço.',
        },
        {
          title: 'Definir o limiar',
          description: 'Escolha o ponto de corte entre preto e branco para controlar os detalhes.',
        },
        {
          title: 'Traçar em vetores',
          description: 'O ImageMagick prepara um bitmap; o potrace traça os caminhos.',
        },
        {
          title: 'Baixar SVG',
          description: 'Salve um arquivo .svg real e escalável.',
        },
      ],
      advancedDetails: [
        'O pipeline achata o PNG em um bitmap de dois níveis (limiar do ImageMagick) e depois executa o potrace para produzir caminhos vetoriais Bézier suaves.',
        'A vetorização funciona melhor em gráficos simples e de alto contraste: logotipos, ícones, monogramas, assinaturas e ilustrações de traço em preto e branco.',
        'Ela não reproduz fielmente fotografias nem gradientes complexos: traçar uma foto gera caminhos grandes e bagunçados, não arte vetorial limpa.',
        'Aumente o limiar para capturar detalhes mais finos e claros; diminua para manter só as formas mais marcantes.',
      ],
      whyItMatters: [
        'Logotipos vetoriais escalam para qualquer tamanho, de um favicon a um outdoor, sem pixelização.',
        'SVGs são minúsculos para gráficos simples e editáveis em ferramentas vetoriais como Illustrator ou Inkscape.',
        'Recuperar um vetor a partir de um logotipo PNG evita ter que recriá-lo do zero.',
      ],
      useCases: [
        {
          title: 'Recuperação de logotipos',
          description: 'Vetorize um logotipo PNG cujo arquivo-fonte você não tem mais.',
        },
        {
          title: 'Ícones e monogramas',
          description: 'Transforme um ícone simples em um SVG escalável.',
        },
        {
          title: 'Assinaturas',
          description: 'Vetorize uma assinatura digitalizada para reutilizá-la com limpeza.',
        },
        {
          title: 'Ilustrações de traço',
          description: 'Trace artes em preto e branco em caminhos editáveis.',
        },
      ],
      whyMediaManipulator: [
        'Vetorização real com o potrace, honesta sobre o que faz bem (e o que não faz).',
        'Controle de limiar para você ajustar o traçado com precisão.',
      ],
      privacyNote: 'Sua imagem é reduzida a preto e branco e traçada em caminhos vetoriais pelo potrace no nosso servidor. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Como converto um PNG para SVG de graça?',
          answer: 'Envie seu .png acima, ajuste o limiar se necessário e clique em converter. Você recebe de volta um .svg vetorial de verdade.',
        },
        {
          question: 'É vetorização real ou só um PNG embrulhado?',
          answer: 'É vetorização real. Traçamos a imagem em caminhos SVG de verdade com o potrace; não embutimos o PNG dentro de um SVG e damos o trabalho por encerrado.',
        },
        {
          question: 'Ele vai vetorizar minha foto?',
          answer: 'Não muito bem. A vetorização foi feita para logotipos, ícones, assinaturas e ilustrações de traço. Fotografias e gradientes complexos geram caminhos grandes e bagunçados em vez de vetores limpos.',
        },
        {
          question: 'O que o controle de limiar faz?',
          answer: 'Ele define o ponto de corte entre preto e branco antes do traçado. Aumente para capturar mais detalhes (mais claros); diminua para manter só as formas mais marcantes.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A vetorização requer o potrace no servidor. Ideal para logotipos, ícones e ilustrações de traço, não para fotografias.',
        ],
      },
      related: [
        {
          label: 'Converter SVG para PNG',
          to: '/tools/convert-svg-to-png',
          description: 'Faça o caminho inverso: rasterize um SVG em PNG.',
        },
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre JPG, PNG, WebP, AVIF e mais.',
        },
        {
          label: 'PNG para ICO',
          to: '/tools/png-to-ico',
          description: 'Transforme um PNG em um favicon.',
        },
      ],
      embed: {
        title: 'Vetorizar PNG em SVG',
        description: 'Envie um PNG. A saída é fixada em SVG e produzida por vetorização real (potrace), não por um raster embrulhado em SVG. Ajuste o limiar de preto/branco para capturar mais ou menos detalhes. Ideal para logotipos, ícones, assinaturas e ilustrações de traço.',
      },
    },
    'png-to-ico': {
      name: 'PNG para ICO',
      h1: 'Converter PNG para ICO online grátis',
      tagline: 'Transforme um PNG em um favicon .ico de verdade, com vários tamanhos, para sites e ícones de apps do Windows.',
      metaTitle: 'Converter PNG para ICO online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de PNG para ICO. Gere um favicon .ico real com vários tamanhos (16–256px) para sites e ícones do Windows. Sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter PNG para ICO online grátis',
      ogDescription: 'Gere um favicon .ico real com vários tamanhos a partir de um PNG. Grátis, rápido e sem cadastro.',
      intro: 'Um favicon precisa ser um arquivo .ico de verdade, com vários tamanhos, para que os navegadores e o Windows possam escolher o certo. O Media Manipulator gera um ICO genuíno com vários tamanhos a partir do seu PNG, não um arquivo renomeado, empacotando a escala padrão de ícones de 16–256 px.',
      whatItDoes: [
        'Gera um contêiner .ico real a partir de uma imagem PNG.',
        'Empacota vários tamanhos (16, 32, 48, 64, 128, 256 px) em um único arquivo.',
        'Preserva a transparência para que o ícone fique limpo sobre qualquer fundo.',
        'Gera um arquivo que os navegadores e o Windows aceitam como favicon ou ícone de app.',
      ],
      flowSteps: [
        {
          title: 'Enviar PNG',
          description: 'Solte um PNG: uma imagem quadrada dá o melhor ícone.',
        },
        {
          title: 'Gerar os tamanhos',
          description: 'Renderizamos cada tamanho padrão de ícone a partir da sua imagem.',
        },
        {
          title: 'Empacotar o ICO',
          description: 'Os tamanhos são empacotados em um único contêiner .ico real.',
        },
        {
          title: 'Baixar ICO',
          description: 'Salve o favicon.ico para seu site ou app.',
        },
      ],
      advancedDetails: [
        'O ICO é criado com o redimensionamento automático de ícones do ImageMagick, produzindo um contêiner real com várias imagens, não um PNG renomeado.',
        'Incluir vários tamanhos permite que os navegadores e o Windows escolham o ícone mais nítido para cada contexto (aba, barra de tarefas, área de trabalho).',
        'Para o resultado mais limpo, comece com um PNG quadrado de 256×256 ou maior, para que todos os tamanhos sejam reduzidos com nitidez.',
      ],
      whyItMatters: [
        'Os navegadores esperam um favicon .ico real; um PNG renomeado pode falhar ou ficar desfocado.',
        'Um ícone com vários tamanhos continua nítido de uma aba de 16px a um atalho de 256px na área de trabalho.',
        'Ícones de apps do Windows exigem o formato .ico.',
      ],
      useCases: [
        {
          title: 'Favicons de sites',
          description: 'Gere o favicon.ico para o ícone da aba do seu site.',
        },
        {
          title: 'Ícones de apps do Windows',
          description: 'Crie um .ico para um aplicativo de desktop.',
        },
        {
          title: 'Atalhos',
          description: 'Crie um ícone nítido para um atalho na área de trabalho.',
        },
        {
          title: 'Identidade visual',
          description: 'Transforme um logotipo PNG em um arquivo de ícone adequado.',
        },
      ],
      whyMediaManipulator: [
        'Um ICO genuíno com vários tamanhos, não um PNG renomeado.',
        'Transparência preservada para ícones limpos.',
      ],
      privacyNote: 'Sua imagem é redimensionada para cada tamanho padrão de ícone e empacotada em um único arquivo .ico pelo ImageMagick no nosso servidor. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Como converto um PNG para ICO de graça?',
          answer: 'Envie seu .png acima e clique em converter: você recebe de volta um .ico real com vários tamanhos.',
        },
        {
          question: 'É um ICO real ou um PNG renomeado?',
          answer: 'Um ICO real. Geramos vários tamanhos de ícone e os empacotamos em um contêiner .ico verdadeiro, que é o que os navegadores e o Windows esperam.',
        },
        {
          question: 'Quais tamanhos estão incluídos?',
          answer: 'A escala padrão de favicons: 16, 32, 48, 64, 128 e 256 px. Os navegadores e o Windows escolhem o melhor tamanho para cada contexto.',
        },
        {
          question: 'Qual imagem funciona melhor?',
          answer: 'Um PNG quadrado de 256×256 ou maior dá o resultado mais nítido, já que todos os tamanhos menores são reduzidos com limpeza a partir dele.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Um ICO com vários tamanhos (16/32/48/64/128/256 px) é gerado. Comece com uma imagem quadrada para o melhor resultado.',
        ],
      },
      related: [
        {
          label: 'Conversor de imagens',
          to: '/tools/image-converter',
          description: 'Converta entre JPG, PNG, WebP, AVIF e mais.',
        },
        {
          label: 'Converter SVG para PNG',
          to: '/tools/convert-svg-to-png',
          description: 'Rasterize um logotipo SVG antes de criar um ícone.',
        },
        {
          label: 'Redimensionar imagem',
          to: '/tools/image-resizer',
          description: 'Crie uma imagem quadrada antes de gerar o ícone.',
        },
        {
          label: 'Remover fundo de imagem',
          to: '/tools/remove-background-from-image',
          description: 'Crie uma origem transparente para o ícone.',
        },
      ],
      embed: {
        title: 'Converter PNG para ICO',
        description: 'Envie um PNG (uma imagem quadrada funciona melhor). A saída é fixada em ICO, e um ícone real com vários tamanhos é gerado, contendo versões de 16, 32, 48, 64, 128 e 256 px.',
      },
    },
    'svg-converter': {
      name: 'Conversor de SVG',
      tagline: 'Rasterize um SVG em PNG ou vetorize um PNG em SVG: o conversor de imagens com ponto de partida em SVG.',
    },
    'convert-wav-to-mp3': {
      name: 'Converter WAV para MP3',
      h1: 'Converter WAV para MP3 online',
      tagline: 'Reduza gravações WAV grandes e sem perdas a arquivos MP3 amplamente compatíveis, para podcasts, compartilhamento e armazenamento.',
      metaTitle: 'Converter WAV para MP3 online (grátis) | Media Manipulator',
      metaDescription: 'Conversor online gratuito de WAV para MP3. Comprima gravações .wav sem perdas em arquivos MP3 menores, na taxa de bits que você escolher.',
      ogTitle: 'Converter WAV para MP3 online',
      ogDescription: 'Comprima gravações WAV em arquivos MP3 amplamente compatíveis, na taxa de bits que você escolher.',
      intro: 'Arquivos WAV são sem perdas e grandes. O MP3 é o formato de áudio comprimido compatível com tudo: todo celular, notebook e app de música o reproduz. O Media Manipulator recodifica seu WAV para MP3 na taxa de bits que você escolher, então você troca só um pouquinho de qualidade por um arquivo 5–10× menor.',
      whatItDoes: [
        'Recodifica gravações WAV para MP3 na taxa de bits que você escolher.',
        'Suporta taxas de amostragem, canais e taxa de bits personalizados (de 128 a 320 kbps).',
        'Preserva o volume e evita reamostragens desnecessárias.',
        'Gera um arquivo .mp3 padrão com tags ID3.',
      ],
      flowSteps: [
        {
          title: 'Enviar WAV',
          description: 'Solte qualquer arquivo .wav do seu computador.',
        },
        {
          title: 'Escolher a taxa de bits',
          description: '192 kbps para voz, 256–320 kbps para música.',
        },
        {
          title: 'Codificar MP3',
          description: 'O FFmpeg codifica um MP3 limpo com as configurações escolhidas.',
        },
        {
          title: 'Baixar MP3',
          description: 'Salve um .mp3 amplamente compatível.',
        },
      ],
      advancedDetails: [
        'Usa codificação no estilo LAME via FFmpeg por baixo dos panos.',
        'O MP3 é um codec com perdas: a qualidade estabiliza por volta de 256 kbps para música. Conteúdo de voz soa ótimo a 128–192 kbps.',
        'Se você precisa de arquivos menores sem perdas, use FLAC ou ALAC. Use Opus (em OGG) para os menores arquivos modernos com perdas quando você controla o player.',
      ],
      whyItMatters: [
        'Arquivos WAV são 5–10× maiores que o MP3 equivalente em taxas de bits razoáveis.',
        'O MP3 toca em qualquer dispositivo, sem problemas de compatibilidade de codec.',
        'Plataformas de podcast, audiolivros e música geralmente exigem ou preferem envios em MP3.',
      ],
      useCases: [
        {
          title: 'Episódios de podcast',
          description: 'Masterize em WAV e publique em MP3 a 96–128 kbps mono.',
        },
        {
          title: 'Memorandos de voz',
          description: 'Reduza gravações do celular antes de compartilhar ou arquivar.',
        },
        {
          title: 'Demos de música',
          description: 'Envie mixagens a 256–320 kbps sem anexos enormes.',
        },
        {
          title: 'Incorporar em um site',
          description: 'Use MP3 pela compatibilidade: todo navegador o reproduz nativamente.',
        },
      ],
      whyMediaManipulator: [
        'Escolha a taxa de bits, a taxa de amostragem e o layout de canais exatos.',
        'Grátis, sem cadastro, sem marcas d\'água; a saída é totalmente sua.',
        'O mesmo modelo de privacidade e retenção do restante das ferramentas.',
      ],
      privacyNote: 'Seu WAV é codificado em MP3 pelo FFmpeg no nosso servidor, na taxa de bits que você escolher. Nenhum serviço de áudio externo está envolvido. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Você recebe um arquivo novo; o upload em si não é alterado.',
      faq: [
        {
          question: 'Qual taxa de bits devo escolher?',
          answer: '192 kbps é um padrão equilibrado. Use 128 kbps para voz e podcast, 256–320 kbps para música.',
        },
        {
          question: 'A qualidade do áudio vai cair?',
          answer: 'Um pouco: o MP3 tem perdas. A 256 kbps ou mais, a maioria dos ouvintes não percebe diferença em relação ao WAV original.',
        },
        {
          question: 'Posso converter outros formatos para MP3?',
          answer: 'Sim: o conversor de áudio aceita FLAC, M4A/AAC, OGG, OPUS e mais. Use a ferramenta geral de conversor de áudio.',
        },
        {
          question: 'Existe limite de tamanho de arquivo?',
          answer: 'Tamanhos razoáveis de arquivo são aceitos. Para gravações muito longas, considere cortar antes.',
        },
      ],
      related: [
        {
          label: 'Conversor de áudio',
          to: '/tools/audio-converter',
          description: 'Converta entre qualquer par de formatos de áudio.',
        },
        {
          label: 'Isolar vocais de uma música',
          to: '/tools/isolate-vocals-from-song',
          description: 'Extraia os vocais de faixas musicais.',
        },
        {
          label: 'Tutorial do conversor de áudio',
          to: '/tutorials/audio/getting-started',
          description: 'Percorra todas as opções de áudio, incluindo as ferramentas de IA.',
        },
      ],
      embed: {
        title: 'Converter WAV para MP3',
        description: 'Envie um arquivo WAV e escolha MP3 como formato de saída. 192 kbps é um bom padrão para voz; use 256–320 kbps para música.',
      },
    },
    'isolate-vocals-from-song': {
      name: 'Isolar vocais de uma música',
      h1: 'Isolar vocais de uma música online',
      tagline: 'Extraia os vocais de faixas musicais para remixes, covers, transcrição e análise. Use apenas em músicas sobre as quais você tenha direitos.',
      metaTitle: 'Isolar vocais de uma música online (grátis) | Media Manipulator',
      metaDescription: 'Isolamento de vocais online e gratuito. Extraia os vocais de uma música em um stem limpo para remixes, covers, transcrição ou análise.',
      ogTitle: 'Isolar vocais de uma música online',
      ogDescription: 'Extraia os vocais de uma música em um stem isolado e limpo, para remixes, covers, transcrição ou análise.',
      intro: 'A separação de fontes com IA consegue extrair a faixa vocal de uma mixagem finalizada, ótimo para remixes, covers, preparação de karaokê ou transcrição de letras. O Media Manipulator roda a separação no nosso próprio servidor com GPU. O resultado é um único stem vocal que você pode baixar e usar em qualquer lugar, desde que tenha o direito de fazer isso com o material de origem.',
      whatItDoes: [
        'Executa separação de fontes com IA para extrair a faixa vocal de uma gravação musical.',
        'Gera um único stem vocal isolado no mesmo formato do seu arquivo (MP3 continua MP3) ou em FLAC, WAV ou MP3, se você preferir.',
        'Combina bem com ferramentas de limpeza de áudio, como redução de ruído e equalização, para um resultado polido.',
        'Aceita entradas em WAV, MP3, FLAC, M4A, OGG, OPUS e mais.',
      ],
      flowSteps: [
        {
          title: 'Enviar a música',
          description: 'Solte qualquer arquivo de áudio comum com vocais e música mixados.',
        },
        {
          title: 'Executar a separação por IA',
          description: 'Um modelo na GPU local separa os vocais do restante da mixagem.',
        },
        {
          title: 'Limpar (opcional)',
          description: 'Aplique redução de ruído, equalização ou ganho para polir o stem.',
        },
        {
          title: 'Baixar o stem vocal',
          description: 'Salve os vocais isolados: no mesmo formato do seu arquivo por padrão, ou em FLAC, WAV ou MP3.',
        },
      ],
      advancedDetails: [
        'A separação de fontes é inerentemente imperfeita: reverb, harmonias e efeitos pesados vazam para a saída.',
        'Um MP3 ou outro arquivo comprimido volta no próprio formato (MP3 a 320 kbps). Arquivos sem perdas (WAV, FLAC, AIFF) voltam como FLAC. FLAC e WAV mantêm o máximo de detalhes para edição posterior em uma DAW; o WAV é o maior.',
        'Para karaokê (só o instrumental), use o modo dedicado “Remover vocais” no conversor de áudio.',
      ],
      whyItMatters: [
        'Produtores e remixers podem construir faixas novas em torno de um vocal existente.',
        'Cantores podem transcrever letras ou melodias com mais precisão.',
        'Educadores e engenheiros de áudio usam stems isolados para estudar técnicas de mixagem.',
      ],
      useCases: [
        {
          title: 'Remixes e covers',
          description: 'Construa um novo instrumental em torno de um vocal isolado.',
        },
        {
          title: 'Transcrição de letra e melodia',
          description: 'Obtenha um sinal mais claro para transcrição manual ou por IA.',
        },
        {
          title: 'Preparação de karaokê',
          description: 'Combine o vocal isolado com uma versão instrumental separada.',
        },
        {
          title: 'Prática de engenharia de áudio',
          description: 'Estude técnicas de mixagem em gravações comerciais.',
        },
      ],
      whyMediaManipulator: [
        'IA em GPU local: nenhum provedor de IA terceirizado vê seu áudio.',
        'Combine com equalização, redução de ruído e corte em um único envio.',
        'Grátis, sem cadastro e sem marcas d\'água na saída.',
      ],
      privacyNote: 'Sua música é separada em stems pelo Demucs no nosso próprio servidor com GPU, e só o stem vocal é devolvido a você. Nenhum serviço de áudio externo está envolvido. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Você recebe um arquivo novo; o upload em si não é alterado.',
      faq: [
        {
          question: 'A separação é totalmente limpa?',
          answer: 'Nenhuma ferramenta de separação de fontes é perfeita. Espere alguns artefatos, principalmente em trechos com muito reverb e harmonias. Escolha a saída em FLAC ou WAV se pretende limpar o stem depois em uma DAW.',
        },
        {
          question: 'Quais formatos de áudio são suportados?',
          answer: 'WAV, MP3, FLAC, M4A/AAC, OGG, OPUS e a maioria dos outros formatos de áudio comuns.',
        },
        {
          question: 'Posso usar isso em músicas protegidas por direitos autorais?',
          answer: 'Só se você detiver os direitos, tiver uma licença ou estiver agindo sob uso justo na sua jurisdição. Você é responsável pelo uso que faz do resultado.',
        },
        {
          question: 'Onde consigo só o instrumental?',
          answer: 'Use o modo de IA “Remover vocais” no conversor de áudio: mesmo envio, saída diferente.',
        },
      ],
      related: [
        {
          label: 'Conversor de áudio',
          to: '/tools/audio-converter',
          description: 'Converta e limpe o stem depois do isolamento.',
        },
        {
          label: 'Converter WAV para MP3',
          to: '/tools/convert-wav-to-mp3',
          description: 'Comprima o stem WAV em MP3 para compartilhar.',
        },
        {
          label: 'Tutorial do conversor de áudio',
          to: '/tutorials/audio/getting-started',
          description: 'Percorra todas as opções de áudio, incluindo as ferramentas de IA.',
        },
      ],
      embed: {
        title: 'Isolar vocais',
        description: 'Envie uma música e aperte o botão: Isolar vocais já está selecionado. Seu resultado volta no mesmo formato do seu arquivo (MP3 continua MP3); escolha FLAC ou WAV em Formato de saída para uma versão sem perdas.',
      },
    },
    'image-converter': {
      name: 'Conversor de imagens',
      h1: 'Conversor de imagens online grátis',
      tagline: 'Converta entre JPG, PNG, WebP, AVIF, GIF e mais, com controle de qualidade, redimensionamento, recorte e metadados.',
      metaTitle: 'Conversor de imagens online grátis | Media Manipulator',
      metaDescription: 'Conversor de imagens online gratuito para JPG, PNG, WebP, AVIF, GIF e HEIC. Redimensione, comprima, recorte e remova metadados em um único envio.',
      ogTitle: 'Conversor de imagens online grátis',
      ogDescription: 'Converta JPG, PNG, WebP, AVIF, GIF e HEIC. Redimensione, comprima e remova metadados em um único envio.',
      intro: 'Uma única imagem muitas vezes precisa viver em vários lugares: no seu site, em uma apresentação, em uma peça impressa, em um anúncio de marketplace. Cada um prefere um formato diferente. O Media Manipulator cuida de todos os formatos de imagem comuns em um só lugar, com controle fino de qualidade, redimensionamento e metadados.',
      whatItDoes: [
        'Converte entre JPG, PNG, WebP, AVIF, GIF, HEIC e mais.',
        'Redimensione, recorte, gire e aplique filtros visuais em uma única passagem.',
        'Remova ou mantenha os metadados EXIF/IPTC/XMP conforme a necessidade.',
        'Ferramentas de IA: desfoque de rostos, remoção de fundo, upscale e censura de texto/dados pessoais.',
      ],
      flowSteps: [
        {
          title: 'Envie a imagem',
          description: 'Solte qualquer arquivo de imagem comum.',
        },
        {
          title: 'Escolha o formato de saída',
          description: 'JPG, PNG, WebP, AVIF, GIF.',
        },
        {
          title: 'Ajuste qualidade e metadados',
          description: 'Redimensione, recorte ou remova o EXIF.',
        },
        {
          title: 'Baixe',
          description: 'Salve a imagem convertida.',
        },
      ],
      advancedDetails: [
        'WebP e AVIF geram os menores arquivos para a web; o AVIF costuma superar o WebP na mesma qualidade visual.',
        'O PNG é sem perdas e suporta transparência; ótimo para elementos de interface e capturas de tela.',
        'O JPG é o formato de troca mais seguro para fotos.',
      ],
      whyItMatters: [
        'Plataformas e ferramentas diferentes aceitam formatos de imagem diferentes.',
        'Arquivos de imagem menores carregam as páginas mais rápido, e o Google classifica melhor as páginas mais rápidas.',
        'Remover os metadados antes de compartilhar protege a sua privacidade.',
      ],
      useCases: [
        {
          title: 'Otimização para a web',
          description: 'Converta fotos em PNG para WebP/AVIF e reduza o peso da página.',
        },
        {
          title: 'Compartilhamento entre plataformas',
          description: 'Converta fotos HEIC do iPhone para JPG.',
        },
        {
          title: 'Anúncios em marketplaces',
          description: 'Remova os metadados e redimensione antes de publicar.',
        },
        {
          title: 'Impressão e apresentações',
          description: 'Gere JPG com uma predefinição de alta qualidade.',
        },
      ],
      whyMediaManipulator: [
        'Um único envio cobre conversão, redimensionamento, recorte, filtros, IA e metadados.',
        'Grátis, sem cadastro, sem marcas d\'água.',
        'As ferramentas de IA rodam no nosso próprio servidor com GPU.',
      ],
      privacyNote: 'Sua imagem é convertida, e redimensionada ou recortada se você pediu, pelo ImageMagick no nosso servidor. Nada é enviado a um serviço externo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. O original nunca é alterado: você baixa um arquivo novo.',
      faq: [
        {
          question: 'Qual é o melhor formato de imagem?',
          answer: 'Depende: WebP/AVIF para a web, PNG para transparência, JPG para compatibilidade.',
        },
        {
          question: 'Posso converter em lote?',
          answer: 'A ferramenta gratuita converte uma imagem por vez. Faça várias conversões em sequência.',
        },
        {
          question: 'Ela remove os metadados?',
          answer: 'Só se você definir o Modo de metadados como "Remover todos os metadados". O padrão é manter os metadados.',
        },
        {
          question: 'Funciona com HEIC?',
          answer: 'Sim: fotos HEIC do iPhone são convertidas sem problemas para JPG, PNG ou WebP.',
        },
      ],
      related: [
        {
          label: 'Redimensionar imagem',
          to: '/tools/image-resizer',
          description: 'Redimensione para dimensões exatas em pixels.',
        },
        {
          label: 'Comprimir imagem',
          to: '/tools/compress-image',
          description: 'Reduza o tamanho do arquivo de imagem para a web.',
        },
        {
          label: 'Imagem para PDF',
          to: '/tools/image-to-pdf',
          description: 'Coloque uma imagem em um documento PDF.',
        },
        {
          label: 'Conversor de PDF',
          to: '/tools/pdf-converter',
          description: 'Converta PDFs em imagens e de volta.',
        },
        {
          label: 'Converter HEIC para JPG',
          to: '/tools/convert-heic-to-jpg',
          description: 'Converta fotos HEIC do iPhone para JPG.',
        },
        {
          label: 'Remover fundo de imagem',
          to: '/tools/remove-background-from-image',
          description: 'Apague o fundo automaticamente e gere um PNG transparente.',
        },
        {
          label: 'Converter WebP para JPG',
          to: '/tools/convert-webp-to-jpg',
          description: 'Conversor dedicado de WebP → JPG.',
        },
        {
          label: 'Tutorial do conversor de imagens',
          to: '/tutorials/image/getting-started',
          description: 'Passo a passo completo de cada opção.',
        },
      ],
      embed: {
        title: 'Converter uma imagem',
        description: 'Envie qualquer imagem e escolha o formato de saída, a qualidade e as configurações de redimensionamento/recorte. O JPG serve para fotos, o PNG mantém a transparência, e WebP/AVIF geram os menores arquivos para a web.',
      },
    },
    'video-converter': {
      name: 'Conversor de vídeo',
      h1: 'Conversor de vídeo online grátis',
      tagline: 'Converta entre MP4, WebM, MOV, AVI, MKV e mais, com controle total de codecs, resolução e áudio.',
      metaTitle: 'Conversor de vídeo online grátis | Media Manipulator',
      metaDescription: 'Conversor de vídeo online gratuito para MP4, WebM, MOV, AVI, MKV e mais. Escolha codecs, bitrate, resolução e configurações de áudio.',
      ogTitle: 'Conversor de vídeo online grátis',
      ogDescription: 'Converta MP4, WebM, MOV, AVI, MKV, FLV, WMV e mais. Escolha codec, bitrate e configurações de áudio.',
      intro: 'Plataformas diferentes querem formatos de vídeo diferentes. Edite em um Mac em MOV, publique na web em MP4 ou WebM, arquive em MKV. O Media Manipulator cuida de todos os contêineres e codecs de vídeo comuns em um só lugar, com controle total de bitrate, resolução e áudio.',
      whatItDoes: [
        'Converte entre MP4, WebM, MOV, AVI, MKV, FLV, WMV e ProRes.',
        'Escolha o codec (H.264, H.265, VP9, ProRes, DNxHD).',
        'Redimensione, mude a taxa de quadros, corte e recodifique o áudio.',
        'Aplique filtros e correção de cor, se quiser.',
      ],
      flowSteps: [
        {
          title: 'Envie o vídeo',
          description: 'Solte qualquer contêiner de vídeo comum.',
        },
        {
          title: 'Escolha o formato de destino',
          description: 'MP4, WebM, MOV, AVI, MKV.',
        },
        {
          title: 'Ajuste codec e qualidade',
          description: 'Bitrate, resolução, áudio.',
        },
        {
          title: 'Baixe',
          description: 'Salve o vídeo convertido.',
        },
      ],
      advancedDetails: [
        'H.264 em MP4 é o padrão seguro que funciona em todo lugar.',
        'H.265 (HEVC) e VP9 geram arquivos ~25–50% menores na mesma qualidade visual, mas exigem um player moderno.',
        'Para entregas a editores, ProRes (em MOV) ou DNxHD (em MOV/MXF) preservam o máximo de qualidade.',
      ],
      whyItMatters: [
        'Aplicativos de edição, navegadores e redes sociais preferem, cada um, formatos diferentes.',
        'Arquivos de vídeo menores melhoram o tempo de carregamento da página e os custos de banda.',
        'A recodificação permite corrigir codecs errados ou arquivos que não tocam.',
      ],
      useCases: [
        {
          title: 'MOV → MP4',
          description: 'Faça as filmagens feitas com aparelhos Apple tocarem em qualquer lugar.',
        },
        {
          title: 'AVI → MP4',
          description: 'Modernize um vídeo antigo de arquivo.',
        },
        {
          title: 'MP4 → WebM',
          description: 'Reduza vídeos para a web em navegadores modernos.',
        },
        {
          title: 'Entregas a editores',
          description: 'Exporte em ProRes ou DNxHD para edição de alta qualidade.',
        },
      ],
      whyMediaManipulator: [
        'Controle total de codec, bitrate e áudio em um único envio.',
        'Transcrição com IA disponível para o mesmo arquivo.',
        'Grátis, sem cadastro, sem marcas d\'água.',
      ],
      privacyNote: 'Seu vídeo é recodificado pelo FFmpeg no nosso servidor para o contêiner e o codec que você escolher. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo de origem fica intocado e o resultado é um arquivo novo.',
      faq: [
        {
          question: 'Qual formato de saída é melhor?',
          answer: 'MP4 com H.264 para compatibilidade, WebM com VP9 para os menores arquivos para a web.',
        },
        {
          question: 'Posso cortar antes de converter?',
          answer: 'Sim: a seção de corte do formulário permite reduzir o clipe antes de recodificar.',
        },
        {
          question: 'Meu áudio vai continuar sincronizado?',
          answer: 'Sim: o FFmpeg mantém a sincronia de áudio e vídeo. Se você mudar a taxa de quadros ou a velocidade, o áudio é reamostrado de acordo.',
        },
        {
          question: 'Existe limite de tamanho de arquivo?',
          answer: 'Arquivos muito grandes podem ser rejeitados no plano gratuito. Tente reduzir a resolução primeiro.',
        },
      ],
      related: [
        {
          label: 'Converter MOV para MP4',
          to: '/tools/convert-mov-to-mp4',
          description: 'Faça filmagens de QuickTime/iPhone tocarem em qualquer lugar.',
        },
        {
          label: 'Converter WebM para MP4',
          to: '/tools/convert-webm-to-mp4',
          description: 'Transforme vídeo da web em um MP4 editável.',
        },
        {
          label: 'Converter MP4 para WebM',
          to: '/tools/convert-mp4-to-webm',
          description: 'Reduza um MP4 para WebM com VP9 para a web.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Compressor dedicado para reduzir arquivos de vídeo.',
        },
        {
          label: 'Converter vídeo em GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Transforme clipes curtos em GIFs animados.',
        },
        {
          label: 'Extrair áudio de vídeo',
          to: '/tools/extract-audio-from-video',
          description: 'Salve a trilha sonora em MP3, WAV ou M4A.',
        },
        {
          label: 'Cortar vídeo',
          to: '/tools/video-trimmer',
          description: 'Corte um clipe para ficar só com a parte que você quer, sem perdas.',
        },
        {
          label: 'Redimensionar vídeo',
          to: '/tools/resize-video',
          description: 'Mude a resolução para 1080p, 720p ou personalizada.',
        },
        {
          label: 'Girar vídeo',
          to: '/tools/rotate-video',
          description: 'Corrija filmagens de lado ou de cabeça para baixo.',
        },
        {
          label: 'Transcrever vídeo',
          to: '/tools/transcribe-video',
          description: 'Extraia a fala do vídeo como texto ou legendas VTT.',
        },
        {
          label: 'Interpolação de quadros com IA',
          to: '/tools/ai-frame-interpolation',
          description: 'Aumente os FPS do vídeo para 48, 60 ou 120 com quadros gerados por IA.',
        },
        {
          label: 'Transcodificar vídeo para HLS',
          to: '/tools/transcode-to-hls',
          description: 'Gere um pacote HLS adaptativo a partir de qualquer vídeo.',
        },
        {
          label: 'Transcodificar vídeo para DASH',
          to: '/tools/transcode-to-dash',
          description: 'Gere um pacote MPEG-DASH AV1/VP9 a partir de qualquer vídeo.',
        },
        {
          label: 'Tutorial do conversor de vídeo',
          to: '/tutorials/video/getting-started',
          description: 'Passo a passo completo de cada opção.',
        },
      ],
      embed: {
        title: 'Converter um vídeo',
        description: 'Envie qualquer vídeo e escolha o contêiner/codec de destino. A predefinição de qualidade "média" é um bom padrão. O MP4 toca em qualquer lugar; o WebM gera arquivos menores em navegadores modernos.',
      },
    },
    'mp4-converter': {
      name: 'Conversor de MP4',
      tagline: 'Converta um vídeo para MP4: o conversor de vídeo com MP4 já selecionado.',
    },
    'convert-mov-to-mp4': {
      name: 'Converter MOV para MP4',
      h1: 'Converter MOV para MP4 online grátis',
      tagline: 'Transforme arquivos .mov do QuickTime e do iPhone em um MP4 universal, que toca e pode ser enviado em qualquer lugar.',
      metaTitle: 'Converter MOV para MP4 online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de MOV para MP4. Converta vídeos .mov do QuickTime e do iPhone em um MP4 que toca em qualquer lugar. Sem marca d\'água e sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter MOV para MP4 online grátis',
      ogDescription: 'Converta arquivos MOV do QuickTime e do iPhone em um MP4 universal, que pode ser enviado e reproduzido em qualquer dispositivo.',
      intro: 'MOV é o contêiner QuickTime da Apple: é o que iPhones, Macs e muitas câmeras gravam por padrão. Funciona muito bem dentro do ecossistema Apple, mas pode se recusar a tocar no Windows, no Android ou em alguns formulários de envio. Converter MOV para MP4 mantém o mesmo vídeo H.264 e o mesmo áudio AAC em um contêiner que o mundo inteiro aceita, geralmente sem nenhuma mudança visível de qualidade.',
      whatItDoes: [
        'Converte arquivos .mov do QuickTime e do iPhone em MP4.',
        'Fixa a saída em MP4 (H.264 + AAC) para que o resultado toque em qualquer lugar.',
        'Adiciona -pix_fmt yuv420p e +faststart para que o MP4 toque em navegadores e comece na hora.',
        'Corte o MOV, redimensione-o ou escolha uma predefinição de qualidade no mesmo envio.',
      ],
      flowSteps: [
        {
          title: 'Envie seu MOV',
          description: 'Solte um arquivo .mov do seu iPhone, Mac ou câmera.',
        },
        {
          title: 'A saída é fixa em MP4',
          description: 'Não precisa escolher formato: o MP4 já está definido para esta ferramenta.',
        },
        {
          title: 'Converta',
          description: 'Reempacotamos ou recodificamos o vídeo em um MP4 limpo.',
        },
        {
          title: 'Baixe',
          description: 'Salve seu MP4, pronto para qualquer dispositivo ou plataforma.',
        },
      ],
      advancedDetails: [
        'A maioria dos arquivos MOV já contém vídeo H.264, então a conversão é rápida e quase sem perdas na qualidade Alta.',
        'Forçamos o croma yuv420p para que o MP4 toque no Safari e em redes sociais que rejeitam vídeo 4:2:2/4:4:4.',
        'Se o seu MOV contém ProRes, o conversor o transcodifica para H.264; escolha a qualidade Alta para manter o máximo de detalhes.',
      ],
      whyItMatters: [
        'MOV muitas vezes não toca no Windows ou no Android sem codecs extras.',
        'Muitos formulários de envio e editores aceitam MP4, mas rejeitam MOV.',
        'MP4 é o formato mais seguro para compartilhar um vídeo do iPhone com qualquer pessoa.',
      ],
      useCases: [
        {
          title: 'Vídeos do iPhone',
          description: 'Converta um .mov gravado em um iPhone para que ele toque em um PC com Windows.',
        },
        {
          title: 'Envio para a web',
          description: 'Transforme uma exportação do QuickTime em um MP4 que um site vai aceitar.',
        },
        {
          title: 'Envio para quem não usa Apple',
          description: 'Compartilhe filmagens com usuários de Android e Windows sem problemas de reprodução.',
        },
        {
          title: 'Compatibilidade com editores',
          description: 'Entregue um MP4 a editores que têm dificuldade com MOV bruto.',
        },
      ],
      whyMediaManipulator: [
        'Saída fixa em um perfil MP4 comprovado: nada de adivinhar configurações.',
        'O FFmpeg no servidor também lida com fontes ProRes em MOV e HEVC em MOV.',
      ],
      privacyNote: 'Seu MOV é recodificado pelo FFmpeg no nosso servidor em um MP4 com H.264 e AAC. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original fica intacto e o resultado é um arquivo novo.',
      faq: [
        {
          question: 'Como converto MOV para MP4?',
          answer: 'Envie seu arquivo .mov e clique em converter: a saída já está definida como MP4, então não há mais nada para escolher.',
        },
        {
          question: 'Converter MOV para MP4 perde qualidade?',
          answer: 'A maioria dos arquivos MOV usa H.264, então na qualidade Alta a recodificação é visualmente quase sem perdas. Predefinições mais baixas trocam um pouco de qualidade por um arquivo menor.',
        },
        {
          question: 'Por que meu MOV do iPhone não toca no Windows?',
          answer: 'O Windows pode não ter os codecs QuickTime/HEVC. MP4 com H.264 + AAC toca sem software extra.',
        },
        {
          question: 'QuickTime para MP4 é a mesma coisa?',
          answer: 'Sim: arquivos QuickTime usam o contêiner .mov, então converter QuickTime para MP4 é exatamente esta ferramenta.',
        },
        {
          question: 'Tem marca d\'água ou cadastro?',
          answer: 'Sem marca d\'água e sem necessidade de conta. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A saída é fixa em MP4 (H.264 + AAC, yuv420p, +faststart).',
        ],
      },
      related: [
        {
          label: 'Conversor de vídeo',
          to: '/tools/video-converter',
          description: 'Converta qualquer vídeo para MP4.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o MP4 para e-mail ou para a web.',
        },
        {
          label: 'Converter vídeo em GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Corte um clipe e exporte um GIF animado.',
        },
        {
          label: 'Tutorial do conversor de vídeo',
          to: '/tutorials/video/getting-started',
          description: 'Conheça as opções de corte, redimensionamento e qualidade.',
        },
      ],
      embed: {
        title: 'Converter MOV para MP4',
        description: 'Envie seu arquivo .mov. A saída é fixa em MP4 (H.264 + AAC) nesta ferramenta, então basta enviar e converter.',
      },
    },
    'convert-webm-to-mp4': {
      name: 'Converter WebM para MP4',
      h1: 'Converter WebM para MP4 online grátis',
      tagline: 'Transforme vídeos .webm otimizados para a web em um MP4 que você pode editar, compartilhar e reproduzir em qualquer dispositivo.',
      metaTitle: 'Converter WebM para MP4 online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de WebM para MP4. Converta vídeo .webm (VP8/VP9) em MP4 (H.264 + AAC) para editores e dispositivos que não abrem WebM. Sem marca d\'água e sem cadastro.',
      ogTitle: 'Converter WebM para MP4 online grátis',
      ogDescription: 'Converta vídeo .webm em um MP4 universal, que editores, celulares e TVs conseguem reproduzir.',
      intro: 'WebM é um contêiner moderno e aberto, criado para a web: arquivos pequenos, ótimos para vídeo no navegador. Mas muitos editores de vídeo, dispositivos mais antigos e aplicativos de mensagens não conseguem abrir WebM. Converter WebM para MP4 recodifica o vídeo VP8/VP9 em H.264 e o áudio em AAC, gerando um arquivo que funciona no Premiere, no Resolve, em celulares e em TVs.',
      whatItDoes: [
        'Converte vídeo .webm (VP8/VP9 + Vorbis/Opus) em MP4.',
        'Fixa a saída em MP4 (H.264 + AAC) para a máxima compatibilidade.',
        'Adiciona yuv420p e +faststart para que o MP4 toque em qualquer navegador e comece na hora.',
        'Uma captura de tela em WebM pode ser cortada ou redimensionada no caminho para o MP4.',
      ],
      flowSteps: [
        {
          title: 'Envie seu WebM',
          description: 'Solte um arquivo .webm baixado da web ou de um gravador de tela.',
        },
        {
          title: 'A saída é fixa em MP4',
          description: 'O MP4 vem predefinido nesta ferramenta: nada para configurar.',
        },
        {
          title: 'Converta',
          description: 'Transcodificamos VP8/VP9 em H.264 + AAC.',
        },
        {
          title: 'Baixe',
          description: 'Salve seu MP4 para editar ou reproduzir em qualquer lugar.',
        },
      ],
      advancedDetails: [
        'WebM usa vídeo VP8/VP9, que a maioria dos editores não consegue importar; MP4/H.264 importa sem problemas em qualquer NLE.',
        'Forçamos yuv420p para que o MP4 toque no Safari e em redes sociais.',
        'Se o que você quer é um arquivo menor para a web, a ferramenta inversa, de MP4 para WebM, produz um WebM VP9.',
      ],
      whyItMatters: [
        'A maioria dos editores de desktop não importa WebM, mas lida com MP4 nativamente.',
        'Alguns celulares, TVs e aplicativos de chat se recusam a tocar WebM.',
        'MP4 é o formato seguro de entrega para um vídeo que você baixou como WebM.',
      ],
      useCases: [
        {
          title: 'Editar vídeo baixado',
          description: 'Leve um clipe .webm para o Premiere ou o Resolve como MP4.',
        },
        {
          title: 'Gravações de tela',
          description: 'Converta uma captura de tela em WebM em um MP4 fácil de compartilhar.',
        },
        {
          title: 'Reproduzir em dispositivos antigos',
          description: 'Faça um arquivo WebM tocar em uma TV ou celular que não o suporta.',
        },
        {
          title: 'Aplicativos de mensagens',
          description: 'Envie vídeo para aplicativos que aceitam MP4, mas não WebM.',
        },
      ],
      whyMediaManipulator: [
        'O FFmpeg no servidor decodifica VP8 e VP9 com confiabilidade.',
        'Saída fixa em um perfil MP4 comprovado.',
      ],
      privacyNote: 'Seu WebM é recodificado pelo FFmpeg no nosso servidor de VP8 ou VP9 em um MP4 H.264. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original fica intacto e o resultado é um arquivo novo.',
      faq: [
        {
          question: 'Como converto WebM para MP4?',
          answer: 'Envie seu arquivo .webm e clique em converter: a saída já está definida como MP4.',
        },
        {
          question: 'Por que meu editor não abre WebM?',
          answer: 'A maioria dos editores não inclui importação de VP8/VP9. Converter para MP4 (H.264) resolve a importação.',
        },
        {
          question: 'O arquivo vai ficar maior?',
          answer: 'MP4/H.264 pode ficar um pouco maior que WebM VP9 na mesma qualidade. Escolha uma predefinição de qualidade mais baixa se o tamanho importar.',
        },
        {
          question: 'O áudio é mantido?',
          answer: 'Sim: o áudio Vorbis/Opus é recodificado em AAC e continua sincronizado.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A saída é fixa em MP4 (H.264 + AAC, yuv420p, +faststart).',
        ],
      },
      related: [
        {
          label: 'Conversor de vídeo',
          to: '/tools/video-converter',
          description: 'Converta qualquer vídeo para MP4.',
        },
        {
          label: 'Converter MP4 para WebM',
          to: '/tools/convert-mp4-to-webm',
          description: 'O caminho inverso: crie um WebM VP9 pequeno.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o MP4 para compartilhar.',
        },
      ],
      embed: {
        title: 'Converter WebM para MP4',
        description: 'Envie seu arquivo .webm. A saída é fixa em MP4 (H.264 + AAC) nesta ferramenta, então basta enviar e converter.',
      },
    },
    'convert-avi-to-mp4': {
      name: 'Converter AVI para MP4',
      h1: 'Converter AVI para MP4 online grátis',
      tagline: 'Modernize vídeos .avi antigos em um MP4 compacto, que toca em qualquer celular, navegador e TV.',
      metaTitle: 'Converter AVI para MP4 online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de AVI para MP4. Converta vídeos .avi antigos (Xvid/DivX) em MP4 (H.264 + AAC) que toca em qualquer lugar. Sem marca d\'água e sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter AVI para MP4 online grátis',
      ogDescription: 'Converta vídeo .avi antigo em um MP4 moderno e compacto, que toca em qualquer dispositivo.',
      intro: 'AVI é um contêiner clássico do Windows, da era DivX/Xvid. Os arquivos costumam ser grandes e usam codecs que celulares, navegadores e TVs modernos já não reproduzem. Converter AVI para MP4 recodifica o vídeo no eficiente H.264 e o áudio em AAC, produzindo um arquivo menor que toca em qualquer aparelho que você tenha hoje.',
      whatItDoes: [
        'Converte arquivos .avi antigos (Xvid, DivX, MJPEG e outros) em MP4.',
        'Fixa a saída em MP4 (H.264 + AAC) para reprodução moderna.',
        'Em geral produz um arquivo visivelmente menor que o AVI original.',
        'Um AVI antigo pode ser cortado e redimensionado enquanto é convertido.',
      ],
      flowSteps: [
        {
          title: 'Envie seu AVI',
          description: 'Solte um arquivo .avi antigo vindo de um acervo ou de uma câmera.',
        },
        {
          title: 'A saída é fixa em MP4',
          description: 'O MP4 vem predefinido: nada para configurar.',
        },
        {
          title: 'Converta',
          description: 'Recodificamos em H.264 + AAC.',
        },
        {
          title: 'Baixe',
          description: 'Salve um MP4 menor e moderno.',
        },
      ],
      advancedDetails: [
        'AVI costuma usar Xvid/DivX (MPEG-4 Part 2); o H.264 é cerca de duas vezes mais eficiente, então o MP4 geralmente fica muito menor.',
        'Forçamos yuv420p para que o resultado toque em navegadores e em redes sociais.',
        'Capturas AVI entrelaçadas podem se beneficiar da opção de desentrelaçar no conversor de vídeo completo.',
      ],
      whyItMatters: [
        'Arquivos AVI são grandes e cada vez mais difíceis de reproduzir em dispositivos modernos.',
        'MP4/H.264 é menor e toca em qualquer lugar.',
        'Converter acervos antigos para MP4 os prepara para o futuro.',
      ],
      useCases: [
        {
          title: 'Acervos de vídeo antigos',
          description: 'Modernize AVIs de filmadora ou de rips de DVD em MP4.',
        },
        {
          title: 'Liberar espaço',
          description: 'Reduza um AVI grande a um MP4 menor.',
        },
        {
          title: 'Reprodução em celular e TV',
          description: 'Faça um AVI tocar em dispositivos que abandonaram o suporte a AVI.',
        },
        {
          title: 'Envio para a web',
          description: 'Transforme um AVI em um MP4 que um site vai aceitar.',
        },
      ],
      whyMediaManipulator: [
        'O FFmpeg no servidor decodifica codecs AVI antigos que travam outras ferramentas.',
        'Saída fixa em um perfil MP4 comprovado.',
      ],
      privacyNote: 'Seu AVI é recodificado pelo FFmpeg no nosso servidor em um MP4 H.264 moderno. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original fica intacto e o resultado é um arquivo novo.',
      faq: [
        {
          question: 'Como converto AVI para MP4?',
          answer: 'Envie seu arquivo .avi e clique em converter: a saída já está definida como MP4.',
        },
        {
          question: 'O MP4 vai ser menor que o AVI?',
          answer: 'Geralmente sim. O H.264 é muito mais eficiente que os codecs Xvid/DivX que a maioria dos AVIs usa.',
        },
        {
          question: 'Suporta AVIs antigos em DivX/Xvid?',
          answer: 'Sim: o FFmpeg decodifica os codecs AVI mais comuns e os recodifica em H.264.',
        },
        {
          question: 'Vou perder qualidade?',
          answer: 'A recodificação tem perdas, mas na qualidade Alta a diferença é mínima e o arquivo ainda fica menor.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A saída é fixa em MP4 (H.264 + AAC, yuv420p, +faststart).',
        ],
      },
      related: [
        {
          label: 'Conversor de vídeo',
          to: '/tools/video-converter',
          description: 'Converta qualquer vídeo para MP4.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o MP4 ainda mais.',
        },
        {
          label: 'Tutorial do conversor de vídeo',
          to: '/tutorials/video/getting-started',
          description: 'Conheça as opções de corte, redimensionamento e desentrelaçamento.',
        },
      ],
      embed: {
        title: 'Converter AVI para MP4',
        description: 'Envie seu arquivo .avi. A saída é fixa em MP4 (H.264 + AAC) nesta ferramenta, então basta enviar e converter.',
      },
    },
    'convert-mkv-to-mp4': {
      name: 'Converter MKV para MP4',
      h1: 'Converter MKV para MP4 online grátis',
      tagline: 'Transforme arquivos .mkv do Matroska em um MP4 que pode ser transmitido, enviado e reproduzido em dispositivos que não aceitam MKV.',
      metaTitle: 'Converter MKV para MP4 online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de MKV para MP4. Converta vídeo .mkv do Matroska em MP4 (H.264 + AAC) para dispositivos e sites que não reproduzem MKV. Sem marca d\'água e sem cadastro.',
      ogTitle: 'Converter MKV para MP4 online grátis',
      ogDescription: 'Converta vídeo .mkv do Matroska em um MP4 universal, que toca e pode ser enviado em qualquer lugar.',
      intro: 'MKV (Matroska) é um contêiner flexível, popular para vídeo de alta qualidade, mas muitos celulares, navegadores, smart TVs e formulários de envio não o reproduzem. Converter MKV para MP4 coloca o vídeo em um contêiner que esses dispositivos entendem. O Media Manipulator recodifica em H.264 + AAC para que o resultado toque e seja enviado sem problemas.',
      whatItDoes: [
        'Converte arquivos .mkv do Matroska em MP4.',
        'Fixa a saída em MP4 (H.264 + AAC) para amplo suporte de dispositivos.',
        'Adiciona yuv420p e +faststart para que o MP4 faça streaming e comece na hora.',
        'Corte um episódio em MKV ou mude o tamanho dele antes de gravar o MP4.',
      ],
      flowSteps: [
        {
          title: 'Envie seu MKV',
          description: 'Solte um arquivo .mkv.',
        },
        {
          title: 'A saída é fixa em MP4',
          description: 'O MP4 vem predefinido nesta ferramenta.',
        },
        {
          title: 'Converta',
          description: 'Movemos ou transcodificamos o vídeo para um MP4.',
        },
        {
          title: 'Baixe',
          description: 'Salve um MP4 que toca em qualquer lugar.',
        },
      ],
      advancedDetails: [
        'Se o MKV já contém H.264 + AAC, a conversão é rápida e visualmente sem perdas.',
        'Forçamos yuv420p para que o MP4 toque no Safari e em redes sociais.',
        'O MKV pode carregar muitas faixas de legenda e áudio; o conversor mantém o vídeo principal e a primeira faixa de áudio.',
      ],
      whyItMatters: [
        'Muitos dispositivos e sites simplesmente não suportam MKV.',
        'MP4 é o contêiner seguro para compartilhar e enviar.',
        'Converter mantém seu vídeo de alta qualidade utilizável em qualquer lugar.',
      ],
      useCases: [
        {
          title: 'Reprodução em celular e TV',
          description: 'Faça um MKV tocar em um dispositivo que o rejeita.',
        },
        {
          title: 'Envio para a web',
          description: 'Transforme um MKV em um MP4 que um site vai aceitar.',
        },
        {
          title: 'Entrega para o editor',
          description: 'Importe um MP4 em editores que têm dificuldade com MKV.',
        },
        {
          title: 'Padronizar uma biblioteca',
          description: 'Alinhe seus downloads em MKV com a sua coleção em MP4.',
        },
      ],
      whyMediaManipulator: [
        'O FFmpeg no servidor lida com MKV de várias faixas.',
        'Saída fixa em um perfil MP4 comprovado.',
      ],
      privacyNote: 'Seu MKV é recodificado pelo FFmpeg no nosso servidor em um MP4 que celulares e navegadores reproduzem. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original fica intacto e o resultado é um arquivo novo.',
      faq: [
        {
          question: 'Como converto MKV para MP4?',
          answer: 'Envie seu arquivo .mkv e clique em converter: a saída já está definida como MP4.',
        },
        {
          question: 'Converter MKV para MP4 perde qualidade?',
          answer: 'Se o MKV já usa H.264, o resultado é visualmente sem perdas na qualidade Alta. Caso contrário, é uma recodificação normal, com perdas.',
        },
        {
          question: 'O que acontece com as faixas extras de áudio ou legenda?',
          answer: 'O conversor mantém o vídeo principal e a primeira faixa de áudio. Se você precisa de várias faixas, fale com a gente e podemos avaliar a seleção de faixas.',
        },
        {
          question: 'Por que meu MKV não toca?',
          answer: 'Muitos celulares, TVs, navegadores e sites não suportam o contêiner MKV, mesmo quando os codecs dentro dele são comuns.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A saída é fixa em MP4 (H.264 + AAC, yuv420p, +faststart). O vídeo principal e a primeira faixa de áudio são mantidos.',
        ],
      },
      related: [
        {
          label: 'Conversor de vídeo',
          to: '/tools/video-converter',
          description: 'Converta qualquer vídeo para MP4.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o MP4 para compartilhar.',
        },
        {
          label: 'Tutorial do conversor de vídeo',
          to: '/tutorials/video/getting-started',
          description: 'Conheça todas as opções.',
        },
      ],
      embed: {
        title: 'Converter MKV para MP4',
        description: 'Envie seu arquivo .mkv. A saída é fixa em MP4 (H.264 + AAC) nesta ferramenta, então basta enviar e converter.',
      },
    },
    'convert-mp4-to-webm': {
      name: 'Converter MP4 para WebM',
      h1: 'Converter MP4 para WebM online grátis',
      tagline: 'Recodifique um MP4 em um WebM VP9 aberto e menor, perfeito para vídeos da web de carregamento rápido.',
      metaTitle: 'Converter MP4 para WebM online grátis | Media Manipulator',
      metaDescription: 'Conversor online gratuito de MP4 para WebM. Recodifique MP4 em WebM VP9 + Opus para vídeos da web menores e mais rápidos. Sem marca d\'água e sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Converter MP4 para WebM online grátis',
      ogDescription: 'Converta MP4 em um WebM VP9 aberto e menor, ideal para incorporar na web moderna.',
      intro: 'WebM é o formato de vídeo aberto criado para a web. Com vídeo VP9 e áudio Opus, ele entrega arquivos menores que o MP4 na mesma qualidade, o que significa páginas com vídeo incorporado carregando mais rápido. Converter seu MP4 para WebM é a escolha certa quando você controla o player: todos os navegadores modernos o suportam nativamente.',
      whatItDoes: [
        'Converte MP4 (H.264) em WebM (VP9 + Opus).',
        'Fixa a saída em WebM para incorporações consistentes na web aberta.',
        'Normalmente produz um arquivo menor que o MP4 na mesma qualidade visual.',
        'Encurte ou reduza o clipe e escolha uma predefinição de qualidade antes de criar o WebM.',
      ],
      flowSteps: [
        {
          title: 'Envie seu MP4',
          description: 'Solte um arquivo .mp4.',
        },
        {
          title: 'A saída é fixa em WebM',
          description: 'WebM (VP9 + Opus) vem predefinido nesta ferramenta.',
        },
        {
          title: 'Converta',
          description: 'Recodificamos H.264 em VP9 e AAC em Opus.',
        },
        {
          title: 'Baixe',
          description: 'Salve um .webm menor para a web.',
        },
      ],
      advancedDetails: [
        'A saída WebM usa vídeo VP9 com áudio Opus quando disponível, recorrendo a VP8 + Vorbis em builds do FFmpeg sem VP9/Opus.',
        'A codificação VP9 é mais lenta que a H.264, mas gera arquivos ~25-50% menores em qualidade comparável.',
        'Use a tag <video> com uma fonte WebM e uma MP4 para que os navegadores escolham a melhor que suportam.',
      ],
      whyItMatters: [
        'Vídeo menor na web significa páginas mais rápidas e contas de banda menores.',
        'WebM é livre de royalties e suportado por todos os navegadores modernos.',
        'Um par WebM + MP4 cobre praticamente todos os navegadores com os menores arquivos possíveis.',
      ],
      useCases: [
        {
          title: 'Vídeo de destaque do site',
          description: 'Sirva um clipe de fundo ou de destaque pequeno e de carregamento rápido.',
        },
        {
          title: 'Incorporações na web aberta',
          description: 'Incorpore vídeo sem preocupações com codecs proprietários.',
        },
        {
          title: 'Economia de banda',
          description: 'Reduza o tamanho de entrega em páginas de alto tráfego.',
        },
        {
          title: 'HTML5 <video>',
          description: 'Forneça uma fonte WebM junto com um MP4 de fallback.',
        },
      ],
      whyMediaManipulator: [
        'Codificação VP9 + Opus com fallback automático para VP8 + Vorbis.',
        'Saída fixa em WebM para que o resultado seja previsível.',
      ],
      privacyNote: 'Seu vídeo é recodificado pelo FFmpeg no nosso servidor em um WebM VP9. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original fica intacto e o resultado é um arquivo novo.',
      faq: [
        {
          question: 'Como converto MP4 para WebM?',
          answer: 'Envie seu arquivo .mp4 e clique em converter: a saída já está definida como WebM.',
        },
        {
          question: 'WebM é menor que MP4?',
          answer: 'Na mesma qualidade visual, o WebM VP9 costuma ser 25-50% menor que o MP4 H.264.',
        },
        {
          question: 'Todos os navegadores suportam WebM?',
          answer: 'Todos os navegadores modernos, sim. Para navegadores mais antigos, forneça um MP4 de fallback na sua tag <video>.',
        },
        {
          question: 'Por que a codificação em WebM é mais lenta?',
          answer: 'O VP9 exige mais processamento que o H.264. A recompensa é um arquivo menor.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A saída é fixa em WebM (VP9 + Opus, ou VP8 + Vorbis se VP9/Opus não estiver disponível).',
        ],
      },
      related: [
        {
          label: 'Converter WebM para MP4',
          to: '/tools/convert-webm-to-mp4',
          description: 'O caminho inverso.',
        },
        {
          label: 'Conversor de vídeo',
          to: '/tools/video-converter',
          description: 'Converta qualquer vídeo para MP4.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o vídeo sem mudar o contêiner.',
        },
      ],
      embed: {
        title: 'Converter MP4 para WebM',
        description: 'Envie seu arquivo .mp4. A saída é fixa em WebM (VP9 + Opus) nesta ferramenta, então basta enviar e converter.',
      },
    },
    'mp4-to-mp3': {
      name: 'Converter MP4 para MP3',
      tagline: 'Obtenha o áudio de um MP4 como MP3: Extrair áudio de vídeo com MP4 na entrada e MP3 na saída.',
    },
    'video-to-mp3': {
      name: 'Converter vídeo para MP3',
      tagline: 'Extraia a trilha sonora de um vídeo como MP3: a mesma ferramenta de Extrair áudio de vídeo.',
    },
    'mp4-to-gif': {
      name: 'Converter MP4 para GIF',
      tagline: 'Crie um GIF em loop a partir de um clipe MP4: o conversor de GIF animado com entrada MP4 fixa.',
    },
    'video-to-gif': {
      name: 'Converter vídeo para GIF',
      tagline: 'Transforme um clipe curto em qualquer formato de vídeo comum em um GIF em loop: a mesma ferramenta do conversor de GIF animado.',
    },
    'gif-converter': {
      name: 'Conversor de GIF',
      tagline: 'Crie e ajuste GIFs animados a partir de clipes de vídeo: o conversor de GIF animado com outro nome.',
    },
    'video-compressor': {
      name: 'Compressor de vídeo',
      tagline: 'Reduza um vídeo com uma predefinição de compressão: a mesma ferramenta de Comprimir vídeo.',
    },
    'compress-mp4': {
      name: 'Comprimir MP4',
      tagline: 'Deixe um MP4 menor e mantenha-o como MP4: Comprimir vídeo com o contêiner fixo.',
    },
    'mp4-trimmer': {
      name: 'Cortador de MP4',
      tagline: 'O cortador de vídeo com MP4 fixo na entrada e na saída.',
    },
    'video-cutter': {
      name: 'Cortador de vídeo',
      tagline: 'Mantenha uma parte de um vídeo e descarte o resto: a mesma ferramenta do cortador de vídeo.',
    },
    'cut-video-online': {
      name: 'Cortar vídeo online',
      tagline: 'Corte um trecho de um vídeo no navegador, sem instalar nada: o cortador de vídeo com outro nome.',
    },
    'crop-video': {
      name: 'Recortar vídeo',
      h1: 'Recortar vídeo online grátis',
      tagline: 'Elimine as bordas de um vídeo e mude o enquadramento ou a proporção sem precisar de um editor.',
      metaTitle: 'Recortar vídeo online grátis | Media Manipulator',
      metaDescription: 'Recortador de vídeo online gratuito. Recorte as bordas de um vídeo para reenquadrá-lo ou mudar a proporção. Saída em MP4, sem marca d\'água e sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Recortar vídeo online grátis',
      ogDescription: 'Recorte as bordas de um vídeo para reenquadrá-lo ou mudar a proporção. Grátis, sem marca d\'água.',
      intro: 'Recortar remove as bordas externas de um vídeo: útil para reenquadrar uma cena, eliminar barras pretas ou uma marca d\'água, ou mudar a proporção para uma plataforma. O recortador de vídeo do Media Manipulator recebe um retângulo em pixels (onde começar e qual o tamanho) e exporta só essa área como um MP4 limpo.',
      whatItDoes: [
        'Recorta um vídeo para um retângulo que você especifica em pixels.',
        'Remove barras pretas, bordas, marcas d\'água ou regiões indesejadas.',
        'Ajuda a reenquadrar para quadrado ou vertical para redes sociais.',
        'Exporta MP4 (H.264 + AAC) por padrão.',
      ],
      flowSteps: [
        {
          title: 'Envie seu vídeo',
          description: 'MP4, MOV, MKV, WebM, AVI ou M4V para recortar.',
        },
        {
          title: 'Informe o retângulo de recorte',
          description: 'Defina o deslocamento X/Y e a largura/altura a manter.',
        },
        {
          title: 'Recorte',
          description: 'O FFmpeg recorta exatamente essa região e recodifica.',
        },
        {
          title: 'Baixe',
          description: 'Salve o vídeo recortado.',
        },
      ],
      advancedDetails: [
        'As coordenadas do recorte são em pixels a partir do canto superior esquerdo: X/Y é onde a área mantida começa, largura/altura é o tamanho dela.',
        'Recortar recodifica o vídeo; a saída MP4 usa H.264 + AAC + yuv420p + faststart.',
        'Para um enquadramento perfeito ao pixel com pré-visualização, o conversor completo na página inicial oferece uma sobreposição visual de recorte.',
      ],
      whyItMatters: [
        'Recortar reenquadra uma cena sem precisar filmar de novo.',
        'Remove barras pretas (letterbox/pillarbox) e bordas indesejadas.',
        'Mudar a proporção (por exemplo, para 9:16) ajuda o vídeo a se encaixar em uma plataforma.',
      ],
      useCases: [
        {
          title: 'Deixar vertical',
          description: 'Recorte um clipe horizontal para 9:16 para Reels, Shorts ou TikTok.',
        },
        {
          title: 'Remover barras pretas',
          description: 'Elimine o letterbox com o recorte.',
        },
        {
          title: 'Esconder uma marca d\'água',
          description: 'Recorte para tirar um logo de canto ou um carimbo de hora.',
        },
        {
          title: 'Reenquadrar um assunto',
          description: 'Feche o plano no que importa.',
        },
      ],
      whyMediaManipulator: [
        'Recorte preciso em pixels no servidor com o FFmpeg.',
        'Saída MP4 limpa, sem marca d\'água.',
      ],
      privacyNote: 'Seu vídeo é recortado no retângulo que você desenhou e recodificado pelo FFmpeg no nosso servidor. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original fica intacto e o resultado é um arquivo novo.',
      faq: [
        {
          question: 'Como recorto um vídeo?',
          answer: 'Envie-o, informe o retângulo a manter (deslocamento X/Y e largura/altura em pixels) e baixe o vídeo recortado.',
        },
        {
          question: 'Posso recortar para uma proporção quadrada ou vertical?',
          answer: 'Sim: defina a largura e a altura na proporção que você quer (por exemplo, valores iguais para quadrado, mais alto que largo para 9:16).',
        },
        {
          question: 'Recortar reduz a qualidade?',
          answer: 'Recortar recodifica, mas na nossa qualidade padrão a perda é mínima.',
        },
        {
          question: 'Posso recortar para tirar uma marca d\'água?',
          answer: 'Sim, se a marca d\'água estiver perto de uma borda: recorte o quadro para excluí-la.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Recortar recodifica; a saída MP4 usa H.264 + AAC + yuv420p + faststart.',
        ],
      },
      related: [
        {
          label: 'Redimensionar vídeo',
          to: '/tools/resize-video',
          description: 'Mude a resolução em vez de recortar.',
        },
        {
          label: 'Girar vídeo',
          to: '/tools/rotate-video',
          description: 'Corrija vídeos de lado ou de cabeça para baixo.',
        },
        {
          label: 'Conversor de vídeo',
          to: '/tools/video-converter',
          description: 'Converta entre formatos de vídeo.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o vídeo recortado.',
        },
      ],
      embed: {
        title: 'Recortar um vídeo',
        description: 'Envie um vídeo e informe o retângulo a manter (deslocamento + largura/altura em pixels). Recortamos exatamente essa área e exportamos em MP4.',
      },
    },
    'resize-video': {
      name: 'Redimensionar vídeo',
      h1: 'Redimensionar vídeo online grátis',
      tagline: 'Altere a resolução de um vídeo: reduza para 1080p, 720p, 480p ou qualquer largura e altura personalizadas.',
      metaTitle: 'Redimensionar vídeo online grátis | Media Manipulator',
      metaDescription: 'Redimensionador de vídeo online gratuito. Altere a resolução de um vídeo para 1080p, 720p, 480p ou um tamanho personalizado. Saída em MP4, sem marca d\'água e sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Redimensionar vídeo online grátis',
      ogDescription: 'Altere a resolução de um vídeo para 1080p, 720p, 480p ou um tamanho personalizado. Grátis, sem marca d\'água.',
      intro: 'Redimensionar altera a resolução de um vídeo: transforme um clipe 4K em 1080p, reduza para 720p para a web ou atinja um tamanho exato em pixels que uma plataforma exige. O redimensionador de vídeo do Media Manipulator escala seu vídeo para as dimensões que você escolher, preservando a proporção por padrão, e exporta um MP4 limpo.',
      whatItDoes: [
        'Escala um vídeo para uma largura e/ou altura de destino.',
        'Preserva a proporção por padrão (deixe uma dimensão em branco para escalar automaticamente).',
        'Reduz a escala para diminuir o arquivo ou aumenta para atingir um tamanho de destino.',
        'Exporta MP4 (H.264 + AAC) por padrão.',
      ],
      flowSteps: [
        {
          title: 'Envie seu vídeo',
          description: 'Escolha o clipe que você quer em outro tamanho.',
        },
        {
          title: 'Defina o tamanho',
          description: 'Informe uma largura e/ou altura em pixels.',
        },
        {
          title: 'Redimensione',
          description: 'O FFmpeg escala o vídeo e o recodifica.',
        },
        {
          title: 'Baixe',
          description: 'Salve o vídeo redimensionado.',
        },
      ],
      advancedDetails: [
        'Deixe uma dimensão em branco para escalar proporcionalmente e manter a proporção original.',
        'Mantenha “Preservar proporção” ativado para caber na caixa sem esticar quando as duas dimensões estiverem definidas.',
        'Redimensionar recodifica; a saída MP4 usa H.264 + AAC + yuv420p + faststart. Máximo de 4096 px por lado.',
      ],
      whyItMatters: [
        'Resolução mais baixa significa arquivos menores e envios mais rápidos.',
        'Algumas plataformas exigem uma resolução exata.',
        'Redimensionar padroniza uma biblioteca com resoluções misturadas.',
      ],
      useCases: [
        {
          title: 'Reduzir para a web',
          description: 'Baixe de 4K para 1080p ou 720p para páginas mais rápidas.',
        },
        {
          title: 'Atingir um tamanho exato',
          description: 'Siga a especificação de uma plataforma à risca.',
        },
        {
          title: 'Reduzir o tamanho do arquivo',
          description: 'Diminua a resolução para cortar bytes.',
        },
        {
          title: 'Padronizar filmagens',
          description: 'Leve os clipes a uma única resolução.',
        },
      ],
      whyMediaManipulator: [
        'Escalonamento que respeita a proporção, no servidor com o FFmpeg.',
        'Saída MP4 limpa, sem marca d\'água.',
      ],
      privacyNote: 'Seu vídeo é escalado para a largura e a altura que você definiu e recodificado pelo FFmpeg no nosso servidor. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original fica intacto e o resultado é um arquivo novo.',
      faq: [
        {
          question: 'Como redimensiono um vídeo?',
          answer: 'Envie-o, defina uma largura e/ou altura de destino e baixe o vídeo redimensionado.',
        },
        {
          question: 'Como mudo a resolução para 720p?',
          answer: 'Defina a altura como 720 e deixe a largura em branco para escalar proporcionalmente.',
        },
        {
          question: 'Redimensionar mantém a proporção?',
          answer: 'Sim: deixe uma dimensão em branco ou mantenha “Preservar proporção” ativado para que o vídeo não fique esticado.',
        },
        {
          question: 'Posso aumentar a resolução de um vídeo?',
          answer: 'Você pode escalar para um tamanho maior, mas aumentar a escala não acrescenta detalhes que não foram capturados.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Redimensionar recodifica; a saída MP4 usa H.264 + AAC + yuv420p + faststart. Máximo de 4096 px por lado.',
        ],
      },
      related: [
        {
          label: 'Recortar vídeo',
          to: '/tools/crop-video',
          description: 'Elimine as bordas em vez de escalar.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o arquivo com predefinições.',
        },
        {
          label: 'Conversor de vídeo',
          to: '/tools/video-converter',
          description: 'Converta para MP4.',
        },
        {
          label: 'Girar vídeo',
          to: '/tools/rotate-video',
          description: 'Corrija a orientação.',
        },
      ],
      embed: {
        title: 'Redimensionar um vídeo',
        description: 'Envie um vídeo e defina uma largura e/ou altura de destino. Deixe uma em branco para escalar proporcionalmente. A saída é MP4 por padrão.',
      },
    },
    'rotate-video': {
      name: 'Girar vídeo',
      h1: 'Girar vídeo online grátis',
      tagline: 'Corrija vídeos deitados ou de cabeça para baixo: gire 90°, 180° ou 270° e vire a imagem com um clique.',
      metaTitle: 'Girar vídeo online grátis | Media Manipulator',
      metaDescription: 'Rotacionador de vídeo online gratuito. Gire um vídeo em 90°, 180° ou 270° e corrija clipes deitados ou de cabeça para baixo. Saída em MP4, sem marca d\'água e sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Girar vídeo online grátis',
      ogDescription: 'Gire um vídeo em 90°, 180° ou 270° para corrigir gravações deitadas ou de cabeça para baixo. Grátis, sem marca d\'água.',
      intro: 'Vídeos de celular muitas vezes são gravados deitados, e alguns clipes acabam de cabeça para baixo. O rotacionador de vídeo do Media Manipulator corrige a orientação de vez: escolha 90°, 180° ou 270° e nós giramos os quadros de verdade (trocando largura e altura em 90°/270°), para que o vídeo seja reproduzido na posição certa em qualquer player, não só nos que leem a flag de rotação.',
      whatItDoes: [
        'Gira um vídeo em 90° no sentido horário, 180° ou 270° (90° no sentido anti-horário).',
        'Opcionalmente, vira o vídeo na horizontal ou na vertical (espelhamento).',
        'Recodifica para que a rotação fique gravada nos quadros, e não só em uma flag de metadados.',
        'Exporta MP4 (H.264 + AAC) por padrão.',
      ],
      flowSteps: [
        {
          title: 'Envie seu vídeo',
          description: 'Um clipe de celular gravado deitado, por exemplo.',
        },
        {
          title: 'Escolha uma rotação',
          description: '90°, 180° ou 270°, e vire a imagem se precisar.',
        },
        {
          title: 'Gire',
          description: 'O FFmpeg gira os quadros (transpose) e recodifica.',
        },
        {
          title: 'Baixe',
          description: 'Salve o vídeo com a orientação correta.',
        },
      ],
      advancedDetails: [
        'Usamos o transpose do FFmpeg para 90°/270° (que troca largura e altura corretamente) e um transpose duplo para 180°.',
        'Gravar a rotação nos pixels corrige players que ignoram a flag de rotação do contêiner.',
        'A rotação recodifica; a saída em MP4 usa H.264 + AAC + yuv420p + faststart.',
      ],
      whyItMatters: [
        'Vídeos de celular deitados são um dos incômodos mais comuns com vídeo.',
        'Uma rotação gravada nos quadros é reproduzida corretamente em qualquer lugar, ao contrário de uma flag de rotação.',
        'Virar a imagem corrige gravações espelhadas de selfie ou webcam.',
      ],
      useCases: [
        {
          title: 'Corrigir um clipe deitado',
          description: 'Gire um vídeo de celular em retrato para que ele seja reproduzido em pé.',
        },
        {
          title: 'Virar um vídeo de selfie',
          description: 'Desfaça o espelhamento de gravações de webcam ou câmera frontal.',
        },
        {
          title: 'Virar em 180°',
          description: 'Corrija uma gravação de cabeça para baixo.',
        },
        {
          title: 'Reorientar para edição',
          description: 'Acerte a orientação antes de importar.',
        },
      ],
      whyMediaManipulator: [
        'Rotação real dos quadros (transpose), não só uma flag de metadados.',
        'Gire e vire em um único painel dedicado.',
      ],
      privacyNote: 'Seu vídeo é girado no ângulo que você escolher e recodificado pelo FFmpeg no nosso servidor. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original fica intocado e o resultado é um arquivo novo.',
      faq: [
        {
          question: 'Como faço para girar um vídeo?',
          answer: 'Envie o vídeo, escolha 90°, 180° ou 270° e baixe o vídeo girado.',
        },
        {
          question: 'Como corrijo um vídeo de celular deitado?',
          answer: 'Gire 90° no sentido horário ou anti-horário até que ele seja reproduzido em pé; a rotação fica gravada nos quadros.',
        },
        {
          question: 'Ele gira os quadros de verdade ou só define uma flag?',
          answer: 'Ele gira os quadros de verdade (transpose do FFmpeg), então o vídeo fica em pé em qualquer player.',
        },
        {
          question: 'Também posso virar / espelhar o vídeo?',
          answer: 'Sim: as opções de virar na horizontal e na vertical estão incluídas.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A rotação recodifica via transpose do FFmpeg; a saída em MP4 usa H.264 + AAC + yuv420p + faststart.',
        ],
      },
      related: [
        {
          label: 'Recortar vídeo',
          to: '/tools/crop-video',
          description: 'Elimine as bordas.',
        },
        {
          label: 'Redimensionar vídeo',
          to: '/tools/resize-video',
          description: 'Altere a resolução.',
        },
        {
          label: 'Conversor de vídeo',
          to: '/tools/video-converter',
          description: 'Converta entre formatos de vídeo.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o tamanho do vídeo girado.',
        },
      ],
      embed: {
        title: 'Girar um vídeo',
        description: 'Envie um vídeo e escolha uma rotação (90°, 180° ou 270°). Você também pode virar a imagem. Nós giramos os quadros de verdade e exportamos em MP4.',
      },
    },
    'remove-audio-from-video': {
      name: 'Remover áudio de vídeo',
      h1: 'Remover áudio de vídeo online grátis',
      tagline: 'Silencie um vídeo de vez: remova a faixa de áudio e baixe um arquivo mudo, só com vídeo.',
      metaTitle: 'Remover áudio de vídeo online grátis | Media Manipulator',
      metaDescription: 'Ferramenta online gratuita para remover o áudio de um vídeo. Elimine o som e baixe um MP4 mudo, só com vídeo. Sem marca d\'água e sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ogTitle: 'Remover áudio de vídeo online grátis',
      ogDescription: 'Elimine a faixa de áudio de um vídeo e baixe um arquivo mudo, só com vídeo. Grátis, sem marca d\'água.',
      intro: 'Remover o áudio de um vídeo gera um arquivo mudo, só com vídeo: útil para silenciar ruído de fundo, tirar música protegida por direitos autorais antes de republicar ou preparar um clipe ao qual você vai adicionar um áudio novo. O Media Manipulator elimina a faixa de áudio e devolve o vídeo, copiando o fluxo de imagem sem recodificar sempre que possível, para que não haja perda de qualidade.',
      whatItDoes: [
        'Remove (silencia) a faixa de áudio e devolve um arquivo só com vídeo.',
        'Copia o fluxo de vídeo sem recodificar sempre que possível: nenhuma recodificação, nenhuma perda de qualidade.',
        'Recorre a uma recodificação quando o contêiner ou o codec exige.',
        'Gera MP4 por padrão (WebM também disponível).',
      ],
      flowSteps: [
        {
          title: 'Envie seu vídeo',
          description: 'O clipe cujo som você quer eliminar.',
        },
        {
          title: 'Escolha o formato de saída',
          description: 'MP4 (padrão) ou WebM.',
        },
        {
          title: 'Remova o áudio',
          description: 'O FFmpeg descarta o áudio e mantém o vídeo.',
        },
        {
          title: 'Baixe',
          description: 'Salve o arquivo mudo, só com vídeo.',
        },
      ],
      advancedDetails: [
        'Copiamos o fluxo de vídeo sem recodificar (`-c:v copy -an`) para que a imagem fique intocada; se o contêiner não aceitar o codec de origem, recodificamos para H.264.',
        'A saída não tem nenhuma faixa de áudio: ela é muda de verdade, não apenas com o volume zerado.',
        'O nome do arquivo baixado recebe o sufixo `_silent` para que você consiga distingui-lo do original.',
      ],
      whyItMatters: [
        'Silenciar elimina de vez ruído de fundo, conversas ou vento.',
        'Tirar música protegida por direitos autorais evita remoções ao republicar.',
        'Um clipe base mudo é o ponto de partida para adicionar um áudio novo ou uma locução.',
      ],
      useCases: [
        {
          title: 'Silenciar ruído de fundo',
          description: 'Remova sons indesejados de um clipe.',
        },
        {
          title: 'Tirar áudio protegido por direitos autorais',
          description: 'Elimine a música antes de republicar.',
        },
        {
          title: 'Preparar para um áudio novo',
          description: 'Obtenha uma base muda para adicionar uma locução.',
        },
        {
          title: 'Privacidade',
          description: 'Remova uma conversa captada ao fundo.',
        },
      ],
      whyMediaManipulator: [
        'Cópia do fluxo de vídeo sem recodificar, preservando a qualidade.',
        'Saída muda de verdade (faixa de áudio removida, não apenas abaixada).',
      ],
      privacyNote: 'A faixa de áudio do seu vídeo é descartada pelo FFmpeg no nosso servidor e a imagem é mantida. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original fica intocado e o resultado é um arquivo novo.',
      faq: [
        {
          question: 'Como faço para remover o áudio de um vídeo?',
          answer: 'Envie o vídeo, escolha um formato de saída e baixe o arquivo mudo, só com vídeo.',
        },
        {
          question: 'Isso silencia o vídeo ou remove a faixa?',
          answer: 'Remove a faixa de áudio por completo, então o resultado é mudo de verdade, e não apenas com o volume zerado.',
        },
        {
          question: 'A qualidade do vídeo vai mudar?',
          answer: 'Não: copiamos o fluxo de vídeo sem recodificar sempre que possível, então a imagem fica intocada.',
        },
        {
          question: 'Por que o arquivo se chama "_silent"?',
          answer: 'Adicionamos o sufixo _silent para que você consiga distinguir a cópia sem áudio do original.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'O vídeo é copiado sem recodificar sempre que possível; a faixa de áudio é removida por completo. Sufixo do download: _silent.',
        ],
      },
      related: [
        {
          label: 'Remover áudio (só vídeo)',
          to: '/tools/extract-video-only-from-video',
          description: 'A mesma ferramenta de vídeo mudo.',
        },
        {
          label: 'Extrair áudio de vídeo',
          to: '/tools/extract-audio-from-video',
          description: 'Salve o áudio em vez de removê-lo.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o tamanho do vídeo mudo.',
        },
        {
          label: 'Adicionar áudio ao vídeo',
          to: '/tools/stitch-audio-to-video',
          description: 'Adicione uma nova trilha sonora ao clipe mudo.',
        },
      ],
      embed: {
        title: 'Remover o áudio de um vídeo',
        description: 'Envie um vídeo e nós eliminamos a faixa de áudio, devolvendo um arquivo mudo, só com vídeo. A saída é MP4 por padrão. Copiamos o fluxo de vídeo sem recodificar sempre que possível (sem perda de qualidade).',
      },
    },
    'audio-converter': {
      name: 'Conversor de áudio',
      h1: 'Conversor de áudio online grátis',
      tagline: 'Converta entre MP3, WAV, M4A, OGG, FLAC, OPUS e mais, com controle total de taxa de bits, taxa de amostragem e canais.',
      metaTitle: 'Conversor de áudio online grátis | Media Manipulator',
      metaDescription: 'Conversor de áudio online gratuito para MP3, WAV, M4A, OGG, FLAC, OPUS e mais. Escolha taxa de bits, taxa de amostragem e canais.',
      ogTitle: 'Conversor de áudio online grátis',
      ogDescription: 'Converta WAV, MP3, M4A, OGG, FLAC, OPUS e mais. Escolha taxa de bits, taxa de amostragem e canais.',
      intro: 'Dispositivos, hospedagens de podcast e editores de áudio diferentes pedem formatos diferentes. O Media Manipulator lida com todos os formatos de áudio comuns em um só lugar, com controle fino de taxa de bits, taxa de amostragem e configuração de canais.',
      whatItDoes: [
        'Converte entre MP3, WAV, M4A/AAC, OGG, FLAC, ALAC, OPUS, AC3 e DTS.',
        'Escolha a taxa de bits, a taxa de amostragem e a configuração de canais.',
        'Corte e aplique equalização, redução de ruído ou limpeza com IA no mesmo envio.',
        'Gera arquivos válidos, com tags ID3 quando aplicável.',
      ],
      flowSteps: [
        {
          title: 'Envie o áudio',
          description: 'MP3, WAV, M4A, FLAC, OGG e mais.',
        },
        {
          title: 'Escolha o formato de saída',
          description: 'MP3, WAV, FLAC, M4A, OGG, OPUS.',
        },
        {
          title: 'Ajuste a taxa de bits e a de amostragem',
          description: 'Corte ou rode a limpeza com IA.',
        },
        {
          title: 'Baixe',
          description: 'Salve o áudio convertido.',
        },
      ],
      advancedDetails: [
        'MP3 é o formato comprimido universal: todo dispositivo reproduz.',
        'FLAC e ALAC são sem perdas: maiores que MP3, menores que WAV.',
        'OPUS (em OGG) é o menor formato moderno com perdas para voz e música, ótimo quando você controla o player.',
      ],
      whyItMatters: [
        'Plataformas de podcast, serviços de música e editores de áudio preferem formatos diferentes.',
        'Arquivos menores significam menos armazenamento e entrega mais rápida.',
        'Formatos sem perdas são essenciais quando o áudio ainda vai ser reeditado.',
      ],
      useCases: [
        {
          title: 'Publicação de podcast',
          description: 'Master em WAV → episódio em MP3.',
        },
        {
          title: 'Compartilhar notas de voz',
          description: 'Corte e comprima para MP3.',
        },
        {
          title: 'Arquivamento de música',
          description: 'Converta MP3 → FLAC (sem ganho de qualidade) ou WAV → FLAC para armazenamento sem perdas.',
        },
        {
          title: 'Recursos para jogos e aplicativos',
          description: 'Converta WAV → OPUS para recursos minúsculos em celulares.',
        },
      ],
      whyMediaManipulator: [
        'Controle total de taxa de bits, taxa de amostragem e canais.',
        'Ferramentas de limpeza com IA (reduzir ruído, isolar vocais, remover vocais) no mesmo envio.',
        'Grátis, sem cadastro e sem marcas d\'água.',
      ],
      privacyNote: 'Seu áudio é decodificado e recodificado pelo FFmpeg no nosso servidor para o formato e a taxa de bits que você escolher. Nenhum serviço de áudio externo participa. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Você recebe um arquivo novo; o envio em si não é alterado.',
      faq: [
        {
          question: 'Qual é o melhor formato para música?',
          answer: 'FLAC para armazenamento sem perdas, MP3 a 256–320 kbps para compartilhar, OPUS para o menor arquivo transmissível.',
        },
        {
          question: 'Qual é o melhor formato para voz?',
          answer: 'MP3 a 96–128 kbps é um ótimo padrão para podcast.',
        },
        {
          question: 'Posso cortar enquanto converto?',
          answer: 'Sim: defina os segundos de início e fim na seção de corte antes de enviar.',
        },
        {
          question: 'O FLAC é realmente sem perdas?',
          answer: 'Sim: o FLAC comprime sem descartar nenhum dado. A decodificação devolve uma cópia bit a bit idêntica à entrada.',
        },
      ],
      related: [
        {
          label: 'Converter WAV para MP3',
          to: '/tools/convert-wav-to-mp3',
          description: 'Conversor dedicado de WAV → MP3.',
        },
        {
          label: 'Isolar vocais de uma música',
          to: '/tools/isolate-vocals-from-song',
          description: 'Extraia os vocais de faixas musicais.',
        },
        {
          label: 'Tutorial do conversor de áudio',
          to: '/tutorials/audio/getting-started',
          description: 'Passo a passo completo de cada opção.',
        },
      ],
      embed: {
        title: 'Converter um arquivo de áudio',
        description: 'Envie qualquer arquivo de áudio e escolha o formato de destino. MP3 a 192 kbps é um padrão sensato. WAV é sem perdas, mas grande; M4A/AAC é uma boa opção comprimida para música.',
      },
    },
    'srt-generator': {
      name: 'Gerador de legendas SRT',
      h1: 'Gerador de SRT grátis',
      tagline: 'Envie um arquivo de vídeo ou áudio e gere um arquivo de legendas .srt para baixar, pronto para YouTube, editores e ferramentas de acessibilidade.',
      metaTitle: 'Gerador de SRT grátis: vídeo e áudio para SRT | Media Manipulator',
      metaDescription: 'Gere arquivos de legenda SRT a partir de MP4, MOV, MP3, WAV e mais. Grátis, sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Funciona com YouTube, Premiere e DaVinci Resolve.',
      ogTitle: 'Gerador de SRT grátis: vídeo e áudio para SRT',
      ogDescription: 'Gere arquivos de legenda SRT precisos a partir de qualquer vídeo ou áudio. Transcrição com IA local, sem provedores de terceiros.',
      intro: 'SRT (SubRip) é o formato de legenda mais amplamente aceito na internet: YouTube, Vimeo, Premiere, DaVinci Resolve, Final Cut e quase todas as redes sociais o aceitam. O Media Manipulator permite gerar um arquivo SRT a partir de qualquer vídeo ou áudio em um único envio. A transcrição roda no nosso próprio servidor GPU com whisper-ctranslate2, então o áudio nunca sai da nossa infraestrutura e nunca passa por um provedor de IA de terceiros.',
      whatItDoes: [
        'Transcreve qualquer arquivo de vídeo ou áudio em um arquivo de legenda .srt com marcações de tempo.',
        'Usa whisper-ctranslate2 no nosso servidor GPU local: nenhum provedor de IA de terceiros vê sua mídia.',
        'Produz arquivos no formato SubRip (marcações HH:MM:SS,mmm, numeração sequencial das legendas) compatíveis com todos os principais editores e players de vídeo.',
        'Suporta detecção automática de idioma ou uma dica opcional de idioma BCP-47 para melhor precisão em clipes curtos.',
      ],
      flowSteps: [
        {
          title: 'Envie sua mídia',
          description: 'Arraste qualquer arquivo MP4, MOV, MP3, WAV ou outro formato suportado.',
        },
        {
          title: 'Extraímos o áudio',
          description: 'O FFmpeg extrai a faixa de áudio e a converte para o formato que o whisper espera.',
        },
        {
          title: 'O Whisper transcreve',
          description: 'Nosso servidor GPU roda o whisper-ctranslate2 para produzir segmentos com tempo.',
        },
        {
          title: 'Baixe o .srt',
          description: 'Um arquivo SubRip limpo é gerado, com legendas sequenciais e tempos precisos.',
        },
      ],
      advancedDetails: [
        'O Whisper roda no nosso próprio servidor com GPU NVIDIA usando ctranslate2: não há nenhuma API externa no processo.',
        'A saída SRT usa marcações de tempo com milissegundos separados por vírgula (00:00:01,234) e numeração sequencial das legendas a partir de 1, o formato que maximiza a compatibilidade com editores.',
        'O pipeline de transcrição suporta detecção automática de idioma ou uma dica opcional BCP-47 no estilo WHISPER_CT2_LANGUAGE pelo campo de idioma.',
        'As saídas passam pelo mesmo sistema de tarefas do resto do aplicativo: você também pode escolher VTT, texto simples ou JSON estruturado no formulário de transcrição.',
      ],
      whyItMatters: [
        'YouTube, Vimeo, Premiere, DaVinci Resolve, Final Cut e a maioria das redes sociais aceitam SRT como formato de legenda padrão.',
        'Legendas tornam os vídeos acessíveis a espectadores surdos e com deficiência auditiva e aumentam o engajamento nas redes sociais, onde a maioria dos vídeos é reproduzida sem som.',
        'Mecanismos de busca conseguem indexar o conteúdo da transcrição dos seus vídeos quando você publica um .srt correspondente junto com eles.',
      ],
      useCases: [
        {
          title: 'Criadores do YouTube',
          description: 'Gere legendas precisas e envie como faixa SRT em todos os vídeos.',
        },
        {
          title: 'Produtores de cursos',
          description: 'Adicione transcrições às aulas em vídeo para que os alunos possam pesquisar, revisar e traduzir depois.',
        },
        {
          title: 'Podcasters republicando em vídeo',
          description: 'Transforme episódios de podcast em clipes de vídeo legendados para as redes sociais.',
        },
        {
          title: 'Equipes de marketing / redes sociais',
          description: 'Legende todos os clipes para que quem assiste com o som desligado ainda receba a mensagem.',
        },
      ],
      whyMediaManipulator: [
        'O Whisper roda na nossa própria infraestrutura GPU: sua mídia nunca passa por um provedor de IA de terceiros.',
        'Sem cadastro e sem marcas d\'água. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
        'O mesmo motor de transcrição que o resto do aplicativo usa, então a precisão é consistente entre as saídas SRT, VTT, texto simples e JSON.',
      ],
      privacyNote: 'A fala do seu arquivo é transcrita pelo Whisper no nosso próprio servidor GPU e sincronizada em um arquivo de legenda SRT. O trabalho de IA roda em hardware que nós operamos, nunca em um provedor de IA de terceiros, e nada do que você envia é usado para treinar um modelo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'O que é um arquivo SRT?',
          answer: 'SRT (SubRip) é um arquivo de legenda em texto simples com marcações de tempo e numeração das legendas. É o formato de legenda padrão aceito pelo YouTube, pela maioria dos editores de vídeo e pela maioria dos players.',
        },
        {
          question: 'Posso gerar legendas a partir de um MP4?',
          answer: 'Sim. Envie qualquer MP4 (ou MOV, MKV, WebM, AVI, M4V) e nós produzimos um arquivo de legenda .srt para baixar.',
        },
        {
          question: 'Posso usar o arquivo SRT no YouTube?',
          answer: 'Sim: o YouTube aceita SRT diretamente. Envie seu vídeo e depois adicione o arquivo de legenda em Legendas → Adicionar idioma → Enviar arquivo.',
        },
        {
          question: 'Quais idiomas são suportados?',
          answer: 'O Whisper suporta dezenas de idiomas e consegue detectar automaticamente o idioma falado. Você também pode passar uma dica BCP-47 (por exemplo, en, es, ja) para melhor precisão em clipes muito curtos.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'A transcrição roda no nosso servidor GPU local: seu arquivo nunca é enviado a um provedor de IA externo.',
          'Para vídeos longos, a tarefa roda de forma assíncrona e você pode manter a aba aberta para acompanhar o progresso.',
        ],
      },
      related: [
        {
          label: 'Tradutor de legendas',
          to: '/tools/caption-translator',
          description: 'Traduza o SRT gerado para outros idiomas.',
        },
        {
          label: 'Extrair áudio de vídeo',
          to: '/tools/extract-audio-from-video',
          description: 'Extraia o áudio antes de transcrever manualmente.',
        },
        {
          label: 'Extrair quadros de vídeo',
          to: '/tools/extract-frames-from-video',
          description: 'Capture imagens estáticas para miniaturas e referência.',
        },
        {
          label: 'Transcodificar vídeo para HLS',
          to: '/tools/transcode-to-hls',
          description: 'Prepare seu vídeo para streaming.',
        },
        {
          label: 'Transcodificar vídeo para DASH',
          to: '/tools/transcode-to-dash',
          description: 'Empacotamento DASH em AV1 / VP9.',
        },
      ],
      embed: {
        title: 'Gerar um arquivo de legenda SRT',
        description: 'Envie um arquivo de vídeo ou áudio. Nós o transcrevemos no nosso próprio servidor GPU com whisper-ctranslate2 e devolvemos um arquivo de legenda .srt que você pode usar em qualquer editor de vídeo.',
      },
    },
    'caption-translator': {
      name: 'Tradutor de legendas',
      h1: 'Tradutor de legendas grátis',
      tagline: 'Traduza arquivos de legendas SRT e VTT preservando os tempos, a ordem e a estrutura das legendas, sem provedor de IA terceirizado.',
      metaTitle: 'Tradutor de legendas grátis (SRT e VTT): preserva os tempos | Media Manipulator',
      metaDescription: 'Traduza legendas SRT e VTT online com os tempos de cada legenda preservados exatamente. Roda no nosso próprio servidor de IA local: suas legendas nunca são enviadas a provedores de terceiros.',
      ogTitle: 'Tradutor de legendas grátis: SRT e VTT',
      ogDescription: 'Traduza legendas SRT ou VTT preservando as marcações de tempo e a ordem das legendas. IA local, sem provedores de terceiros.',
      intro: 'Traduza arquivos de legenda existentes entre idiomas sem nunca mexer nos tempos das legendas. O Media Manipulator analisa as legendas do seu arquivo .srt ou .vtt, traduz só o texto usando nosso modelo de tradução de legendas hospedado localmente e reemite as marcações de tempo originais sem alteração. Nenhuma API de tradução de terceiros vê suas legendas: o modelo roda no nosso próprio servidor GPU.',
      whatItDoes: [
        'Aceita arquivos de legenda .srt ou .vtt e produz uma cópia traduzida no mesmo formato (ou no outro, se você preferir).',
        'Preserva exatamente a numeração, a ordem e as marcações de tempo das legendas: só o texto de cada legenda é traduzido.',
        'Roda a tradução no nosso servidor local de modelos Ollama com um modelo personalizado ajustado para legendas: suas legendas nunca saem da nossa infraestrutura.',
        'Suporta mais de 30 idiomas de destino, incluindo os principais idiomas europeus, asiáticos e do Oriente Médio.',
      ],
      flowSteps: [
        {
          title: 'Envie o .srt ou .vtt',
          description: 'Arraste seu arquivo de legenda existente para a área de envio.',
        },
        {
          title: 'Escolha os idiomas',
          description: 'Detecte automaticamente ou escolha um idioma de origem e depois escolha um idioma de destino.',
        },
        {
          title: 'Traduzimos o texto das legendas',
          description: 'Nossa IA local traduz só o texto das legendas: as marcações de tempo e a ordem ficam congeladas.',
        },
        {
          title: 'Baixe as legendas traduzidas',
          description: 'Receba um .srt ou .vtt limpo, com tempos idênticos e uma cópia traduzida de cada legenda.',
        },
      ],
      advancedDetails: [
        'A tradução roda no nosso próprio servidor Ollama usando um derivado do Translate-Gemma ajustado para legendas (mm-captions-translategemma-12b).',
        'Enviamos ao modelo apenas o texto das legendas + um cabeçalho com um esquema JSON estrito e, ao ler a resposta, fixamos de volta os tempos a partir do arquivo original, então nem mesmo um modelo com comportamento errado consegue corromper os tempos das suas legendas.',
        'Blocos NOTE e STYLE de arquivos VTT são preservados e nunca enviados ao tradutor.',
        'Em faixas de legenda longas, agrupamos as legendas em lotes para que o modelo nunca chegue perto do limite de contexto.',
      ],
      whyItMatters: [
        'Traduzir legendas manualmente é propenso a erros: é muito fácil quebrar a formatação das marcações de tempo ou reordenar legendas sem querer.',
        'Um tradutor feito especificamente para legendas preserva a estrutura de arquivo que editores e players esperam.',
        'Fazer a tradução internamente, em um modelo local, mantém o fluxo de trabalho dos criadores independente dos preços e das políticas de tradução de terceiros.',
      ],
      useCases: [
        {
          title: 'Canais multilíngues no YouTube',
          description: 'Traduza um SRT mestre em inglês para 5 ou mais idiomas no mesmo envio.',
        },
        {
          title: 'Cursos online',
          description: 'Alcance alunos internacionais com legendas no idioma nativo deles.',
        },
        {
          title: 'Documentários / festivais de cinema',
          description: 'Prepare faixas de tradução sem mexer nos tempos das legendas.',
        },
        {
          title: 'Notícias e jornalismo',
          description: 'Traduza faixas de legenda de notícias urgentes mantendo a sincronia precisa.',
        },
      ],
      whyMediaManipulator: [
        'Tradução com IA local: suas legendas nunca vão para um provedor de IA de terceiros.',
        'Análise segura dos tempos, que fixa de volta os tempos originais de início e fim de cada legenda mesmo que o modelo se comporte mal.',
      ],
      privacyNote: 'Só o texto do seu arquivo SRT ou VTT é lido: cada legenda é traduzida por um modelo de linguagem que rodamos no nosso próprio servidor GPU, e os tempos são copiados sem alteração. O trabalho de IA roda em hardware que nós operamos, nunca em um provedor de IA de terceiros, e nada do que você envia é usado para treinar um modelo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'Posso traduzir um arquivo SRT sem quebrar as marcações de tempo?',
          answer: 'Sim: esse é exatamente o propósito desta ferramenta. Analisamos as legendas, traduzimos só o texto e depois fixamos de volta as marcações de tempo originais, exatamente como estavam, antes de gravar a saída.',
        },
        {
          question: 'Quais formatos de legenda são suportados?',
          answer: 'Tanto SubRip (.srt) quanto WebVTT (.vtt) são suportados. Você pode manter o formato de saída igual ao de entrada ou converter entre eles.',
        },
        {
          question: 'Posso traduzir legendas de vídeos do YouTube?',
          answer: 'Sim. Gere (ou exporte) um SRT do seu vídeo, traduza aqui e envie o novo SRT como faixa de idioma adicional no YouTube.',
        },
        {
          question: 'As legendas são traduzidas por um provedor de IA de terceiros?',
          answer: 'Não. A tradução roda no nosso próprio modelo hospedado no Ollama: suas legendas nunca saem da nossa infraestrutura.',
        },
        {
          question: 'O que acontece com os tempos das legendas?',
          answer: 'Os tempos de início e fim de cada legenda são preservados exatamente: nós os fixamos de volta a partir do arquivo original após a tradução, então nem mesmo um modelo com comportamento errado consegue corromper seus tempos.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Tamanho máximo do arquivo de legenda: 2 MB (faixas de legenda reais costumam ficar bem abaixo disso).',
        ],
        processingNotes: [
          'A tradução roda em um modelo Ollama hospedado localmente: nenhuma API de tradução de terceiros é contatada.',
          'Blocos NOTE e STYLE de arquivos WebVTT são preservados como estão.',
        ],
      },
      related: [
        {
          label: 'Gerador de legendas SRT',
          to: '/tools/srt-generator',
          description: 'Gere um SRT novo a partir de um arquivo de vídeo ou áudio.',
        },
        {
          label: 'Extrair áudio de vídeo',
          to: '/tools/extract-audio-from-video',
          description: 'Extraia o áudio para revisão ou nova transcrição.',
        },
        {
          label: 'Adicionar áudio ao vídeo',
          to: '/tools/stitch-audio-to-video',
          description: 'Adicione uma locução traduzida depois de traduzir as legendas.',
        },
        {
          label: 'Transcodificar vídeo para HLS',
          to: '/tools/transcode-to-hls',
          description: 'Empacote seu vídeo para streaming.',
        },
        {
          label: 'Transcodificar vídeo para DASH',
          to: '/tools/transcode-to-dash',
          description: 'Empacotamento DASH em AV1 / VP9.',
        },
      ],
      embed: {
        title: 'Traduzir um arquivo de legenda SRT ou VTT',
        description: 'Envie um arquivo .srt ou .vtt existente, escolha um idioma de destino e receba um arquivo de legenda traduzido com os tempos originais de cada legenda preservados exatamente.',
      },
    },
    'audio-waveform-generator': {
      name: 'Gerador de forma de onda de áudio',
      h1: 'Gerador de forma de onda de áudio grátis',
      tagline: 'Transforme qualquer arquivo de áudio em um vídeo de forma de onda configurável, uma imagem de forma de onda ou os dois, perfeito para podcasts, prévias de músicas e clipes para redes sociais.',
      metaTitle: 'Gerador de forma de onda de áudio: vídeo e imagem | Media Manipulator',
      metaDescription: 'Gere vídeos e imagens de forma de onda a partir de qualquer arquivo de áudio. Faixas largas 10:1 para podcast, prévias quadradas para redes sociais, canais estéreo separados, cores personalizadas e mais.',
      ogTitle: 'Gerador de forma de onda de áudio grátis',
      ogDescription: 'Gere vídeos e imagens de forma de onda a partir de MP3, WAV, M4A, FLAC e mais. Altamente configurável, sem cadastro.',
      intro: 'Uma forma de onda torna o áudio visível: um recurso essencial para podcasts, prévias de músicas, miniaturas de clipes para redes sociais e linhas do tempo de edição. O Media Manipulator renderiza formas de onda com os filtros showwaves / showwavespic do FFmpeg, com padrões sensatos (uma faixa larga 10:1 em 1600×160) e um painel avançado completo para ajustar modo de renderização, cor, escala e separação de canais estéreo.',
      whatItDoes: [
        'Renderiza vídeos animados de forma de onda com o filtro showwaves do FFmpeg, nos modos point / line / p2p / cline.',
        'Renderiza imagens estáticas de forma de onda com o filtro showwavespic do FFmpeg, perfeitas para miniaturas e capas de álbum.',
        'Suporta predefinições recomendadas de proporção (10:1 larga, 8:1, 6:1, 16:9, 1:1), além de largura e altura personalizadas.',
        'Renderização opcional com canais separados, para que os canais esquerdo e direito sejam desenhados em cores diferentes.',
      ],
      flowSteps: [
        {
          title: 'Envie o áudio',
          description: 'Arraste qualquer arquivo MP3, WAV, M4A, AAC, FLAC ou OGG.',
        },
        {
          title: 'Escolha a saída e o tamanho',
          description: 'Escolha vídeo de forma de onda, imagem ou os dois, e escolha uma predefinição de proporção ou um tamanho personalizado.',
        },
        {
          title: 'Ajuste a aparência (opcional)',
          description: 'Ajuste modo de renderização, taxa de quadros, cores, escala e modo de desenho no painel avançado.',
        },
        {
          title: 'Baixe',
          description: 'Salve seu vídeo de forma de onda, a imagem ou um .zip com os dois.',
        },
      ],
      advancedDetails: [
        'Os modos de renderização correspondem diretamente aos modos do showwaves do FFmpeg: point, line, p2p, cline. Cada um tem uma prévia no formulário para você escolher de olho.',
        'Você pode escolher ou a taxa de quadros de saída (rate=) ou as amostras por coluna (n=), nunca as duas, seguindo o parâmetro mutuamente exclusivo do FFmpeg.',
        'As opções de escala (lin, log, sqrt, cbrt) deixam você decidir quão visíveis os trechos silenciosos devem ficar.',
        'Quando vídeo e imagem são solicitados, nós os empacotamos em um único .zip, pelo mesmo sistema de tarefas de todos os outros downloads do Media Manipulator.',
      ],
      whyItMatters: [
        'Visuais de forma de onda tornam o conteúdo de áudio compartilhável: um clipe com uma forma de onda em movimento tem desempenho muito melhor em feeds sociais com reprodução automática sem som do que uma miniatura estática.',
        'Editores e produtores usam formas de onda como recursos de referência ao organizar linhas do tempo ou criar capas de álbum.',
        'Uma forma de onda bem ajustada serve ao mesmo tempo como miniatura, audiograma e teaser de áudio.',
      ],
      useCases: [
        {
          title: 'Podcasts',
          description: 'Crie audiogramas para as redes sociais: clipe + forma de onda + legendas = o formato de divulgação de podcast com melhor desempenho.',
        },
        {
          title: 'Prévias de músicas',
          description: 'Gere um cartão quadrado de forma de onda para o Instagram ou um largo para descrições do YouTube.',
        },
        {
          title: 'Linhas do tempo de edição',
          description: 'Use a imagem estática da forma de onda como quadro de referência no Premiere ou no DaVinci Resolve.',
        },
        {
          title: 'Entrega de locução',
          description: 'Envie aos clientes um cartão de forma de onda junto com o WAV para que eles tenham uma prévia de relance.',
        },
      ],
      whyMediaManipulator: [
        'Os padrões privilegiam o formato mais útil (10:1 largo) em vez do padrão 600×240 do FFmpeg.',
        'Controles avançados do FFmpeg expostos com segurança: cada configuração é validada no servidor antes de ser passada ao grafo de filtros.',
        'Saída em MP4, PNG ou um ZIP com os dois, sem precisar rodar uma segunda tarefa.',
      ],
      privacyNote: 'Seu áudio é desenhado em uma imagem ou vídeo de forma de onda pelo FFmpeg no nosso servidor. Nenhum serviço de áudio externo participa. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Você recebe um arquivo novo; o envio em si não é alterado.',
      faq: [
        {
          question: 'O que é uma forma de onda de áudio?',
          answer: 'Uma forma de onda é uma representação visual da amplitude de um sinal de áudio ao longo do tempo. É a linha em movimento que você vê em editores de vídeo e em plataformas como o SoundCloud.',
        },
        {
          question: 'Posso criar um vídeo de forma de onda a partir de um MP3?',
          answer: 'Sim. Envie o MP3 (ou WAV/M4A/FLAC/OGG/AAC) e a ferramenta renderiza um vídeo de forma de onda com o filtro showwaves do FFmpeg.',
        },
        {
          question: 'Também posso criar uma imagem de forma de onda?',
          answer: 'Sim. Defina a saída como "Imagem" para um PNG/WebP estático ou "Ambos" para receber um ZIP contendo o vídeo e a imagem.',
        },
        {
          question: 'Qual tamanho devo usar para uma forma de onda?',
          answer: 'Para a maioria dos fluxos de trabalho de podcast e música, a predefinição larga 10:1 (1600×160) fica melhor. Use 16:9 ou 1:1 se precisar de um formato adequado para redes sociais.',
        },
        {
          question: 'O que significam os modos point, line, p2p e cline?',
          answer: 'São os modos de renderização do showwaves do FFmpeg. Point desenha um ponto por amostra, line desenha uma barra vertical, p2p conecta cada ponto com uma linha e cline desenha uma barra vertical centralizada. O formulário mostra uma prévia de cada um.',
        },
        {
          question: 'Posso separar os canais de áudio esquerdo e direito?',
          answer: 'Sim: ative "Separar canais estéreo" nas configurações avançadas e escolha uma cor diferente para cada canal.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Padrão recomendado: forma de onda larga 10:1 (1600×160), ótima para podcasts, prévias de músicas e linhas do tempo de edição.',
          'Quando você seleciona "Ambos", o resultado é empacotado em um único ZIP contendo o vídeo e a imagem.',
        ],
      },
      related: [
        {
          label: 'Extrair áudio de vídeo',
          to: '/tools/extract-audio-from-video',
          description: 'Extraia o áudio de um vídeo antes de gerar uma forma de onda.',
        },
        {
          label: 'Gerador de legendas SRT',
          to: '/tools/srt-generator',
          description: 'Combine a forma de onda com legendas para audiogramas nas redes sociais.',
        },
        {
          label: 'Adicionar áudio ao vídeo',
          to: '/tools/stitch-audio-to-video',
          description: 'Combine sua renderização de forma de onda com outro vídeo.',
        },
      ],
      embed: {
        title: 'Gerar uma forma de onda a partir de um arquivo de áudio',
        description: 'Envie um arquivo de áudio e escolha se quer um vídeo de forma de onda, uma imagem de forma de onda ou os dois. Os controles avançados permitem ajustar tamanho, cores, modo de renderização e comportamento estéreo. O padrão é um vídeo de forma de onda largo 10:1, adequado a podcasts e prévias de músicas.',
      },
    },
    'extract-video-only-from-video': {
      name: 'Extrair vídeo sem áudio',
      h1: 'Extrair vídeo sem áudio (só vídeo)',
      tagline: 'Exporte uma cópia muda, só com vídeo, sem nenhuma faixa de áudio, perfeita para prévias silenciosas, B-roll, edições e nova trilha sonora.',
      metaTitle: 'Extrair vídeo sem áudio: exportação só com vídeo | Media Manipulator',
      metaDescription: 'Ferramenta online gratuita para exportar uma cópia muda, só com vídeo, com todas as faixas de áudio removidas. Copia o fluxo de vídeo sem recodificar sempre que possível: sem recodificação, sem perda de qualidade.',
      ogTitle: 'Extrair vídeo sem áudio (só vídeo)',
      ogDescription: 'Exporte uma cópia muda, só com vídeo, do seu vídeo, com todas as faixas de áudio removidas. Grátis, sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      intro: 'Às vezes você quer o vídeo sem o áudio: para uma prévia muda no feed das redes sociais, um recurso de B-roll para inserir em uma nova edição ou um fluxo de trabalho de nova trilha sonora em que você vai adicionar uma música nova. O Media Manipulator elimina todas as faixas de áudio e gera um arquivo limpo, só com vídeo. O fluxo de vídeo é copiado sem recodificar sempre que possível, então não há recodificação nem perda de qualidade.',
      whatItDoes: [
        'Remove todos os fluxos de áudio do seu vídeo.',
        'Copia o fluxo de vídeo sem recodificar sempre que possível: nenhuma recodificação, nenhuma perda de qualidade.',
        'Recodifica para um H.264 baseline compatível só se o contêiner de destino exigir.',
        'Devolve um MP4 (ou WebM) mudo que você pode inserir direto em uma nova edição.',
      ],
      flowSteps: [
        {
          title: 'Envie seu vídeo',
          description: 'Arraste qualquer arquivo MP4, MOV, MKV, WebM, AVI ou M4V.',
        },
        {
          title: 'Escolha o contêiner de saída',
          description: 'MP4 é o padrão seguro. WebM é oferecido para fontes em VP9/AV1.',
        },
        {
          title: 'Eliminamos o áudio',
          description: 'O FFmpeg descarta o fluxo de áudio e copia o fluxo de vídeo quando possível.',
        },
        {
          title: 'Baixe o vídeo mudo',
          description: 'Salve uma cópia limpa e sem áudio do seu vídeo.',
        },
      ],
      advancedDetails: [
        'A tentativa padrão usa `-c:v copy`, então nenhuma recodificação acontece: a qualidade do fluxo de vídeo é preservada bit a bit.',
        'Se o contêiner de destino rejeitar o codec de origem, recorremos a uma recodificação com libx264 + yuv420p em CRF 20.',
        'Sem marcas d\'água, sem sobreposição, sem redimensionamento: por padrão, a saída visual é idêntica à origem.',
      ],
      whyItMatters: [
        'Vídeo mudo é, na prática, o formato de reprodução automática na maioria das redes sociais.',
        'Remover o áudio também é uma medida de privacidade: elimina voz e conversas embutidas em gravações de tela antes de você compartilhá-las.',
        'Editores costumam querer um arquivo limpo, só com vídeo, para uma nova trilha sonora ou para sincronizar com outra gravação de áudio.',
      ],
      useCases: [
        {
          title: 'Prévias mudas para redes sociais',
          description: 'Crie um clipe limpo de reprodução automática para Instagram, X, LinkedIn ou TikTok.',
        },
        {
          title: 'Projetos de nova trilha sonora',
          description: 'Elimine o áudio original antes de adicionar música ou locução.',
        },
        {
          title: 'Compartilhamentos sensíveis à privacidade',
          description: 'Remova conversas de fundo captadas durante uma gravação de tela.',
        },
        {
          title: 'Preparação de B-roll',
          description: 'Insira um clipe sem áudio em uma edição multicâmera ou baseada em B-roll.',
        },
      ],
      whyMediaManipulator: [
        'Cópia do fluxo sem recodificar sempre que possível: preserva a qualidade original do vídeo.',
        'Claro, rápido, sem cadastro e sem marcas d\'água.',
        'Grátis. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'Seu vídeo é copiado sem a faixa de áudio pelo FFmpeg no nosso servidor. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original fica intocado e o resultado é um arquivo novo.',
      faq: [
        {
          question: 'Como faço para remover o áudio de um vídeo?',
          answer: 'Envie seu vídeo e clique em "Remover áudio do vídeo". A ferramenta gera uma cópia só com vídeo no contêiner que você escolher.',
        },
        {
          question: 'A qualidade do vídeo vai mudar?',
          answer: 'Não, no caso padrão. Copiamos o fluxo de vídeo sem recodificar, então a saída é idêntica bit a bit no lado do vídeo. Só recodificamos se o contêiner de destino exigir.',
        },
        {
          question: 'Posso deixar um MP4 mudo?',
          answer: 'Sim: MP4 é o contêiner de saída padrão e o caso de uso mais comum.',
        },
        {
          question: 'O vídeo original é modificado?',
          answer: 'Não. O envio original fica intocado. Produzimos um arquivo novo e mantemos ou excluímos o envio conforme a regra de retenção: os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
        },
        {
          question: 'E se meu vídeo não tiver áudio?',
          answer: 'Sem problema: a ferramenta conclui normalmente e devolve uma cópia limpa e reempacotada.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'O fluxo de vídeo é copiado sem recodificar sempre que o contêiner de destino permite.',
          'Vídeos de entrada sem fluxo de áudio são concluídos normalmente e devolvem uma cópia reempacotada.',
        ],
      },
      related: [
        {
          label: 'Remover áudio de vídeo',
          to: '/tools/remove-audio-from-video',
          description: 'A página mais simples para silenciar / remover o som.',
        },
        {
          label: 'Extrair áudio de vídeo',
          to: '/tools/extract-audio-from-video',
          description: 'Extraia a faixa de áudio como MP3, WAV etc.',
        },
        {
          label: 'Adicionar áudio ao vídeo',
          to: '/tools/stitch-audio-to-video',
          description: 'Adicione uma nova trilha sonora ao seu vídeo mudo.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o tamanho do vídeo mudo.',
        },
        {
          label: 'Extrair quadros de vídeo',
          to: '/tools/extract-frames-from-video',
          description: 'Extraia imagens estáticas do vídeo mudo.',
        },
      ],
      embed: {
        title: 'Remover o áudio de um vídeo',
        description: 'Envie seu vídeo e nós produzimos uma cópia muda, só com vídeo. O fluxo de vídeo é copiado sem recodificar sempre que possível, então não há recodificação nem perda de qualidade.',
      },
    },
    'extract-frames-from-video': {
      name: 'Extrair quadros de vídeo',
      h1: 'Extrair quadros de vídeo',
      tagline: 'Extraia quadros de imagem de qualquer vídeo, a cada N segundos, em uma taxa de quadros definida ou em instantes específicos, e baixe tudo em um ZIP.',
      metaTitle: 'Extrair quadros de vídeo: extrator de quadros grátis | Media Manipulator',
      metaDescription: 'Ferramenta online gratuita para extrair imagens estáticas de qualquer vídeo. Escolha a cada N segundos, quadros por segundo ou marcas de tempo específicas. Saída em um ZIP de quadros JPG, PNG ou WebP.',
      ogTitle: 'Extrair quadros de vídeo',
      ogDescription: 'Extraia quadros de imagem estáticos de MP4, MOV, MKV, WebM, AVI e M4V. Baixe como um ZIP de quadros JPG, PNG ou WebP.',
      intro: 'A extração de quadros transforma um vídeo de volta em uma sequência de imagens estáticas: útil para miniaturas, imagens de referência, mockups de design, conjuntos de dados de ML e prévias de animação e storyboard. O Media Manipulator permite amostrar quadros a cada N segundos, em uma taxa de quadros definida ou em marcas de tempo específicas, e agrupa as imagens resultantes em um único ZIP para download.',
      whatItDoes: [
        'Extrai quadros estáticos como imagens JPG, PNG ou WebP.',
        'Suporta três modos de amostragem: a cada N segundos, quadros por segundo definidos ou marcas de tempo específicas.',
        'Agrupa os quadros em um único ZIP para download com um clique.',
        'Aplica um limite máximo de quadros para que as execuções continuem rápidas e previsíveis.',
      ],
      flowSteps: [
        {
          title: 'Envie seu vídeo',
          description: 'Solte qualquer arquivo MP4, MOV, MKV, WebM, AVI ou M4V.',
        },
        {
          title: 'Escolha um modo de amostragem',
          description: 'A cada N segundos, um FPS definido ou uma lista de marcas de tempo separadas por vírgula.',
        },
        {
          title: 'Escolha o formato de imagem',
          description: 'JPG para miniaturas compactas, PNG para imagens sem perdas, WebP para arquivos modernos e menores.',
        },
        {
          title: 'Baixe o ZIP',
          description: 'Todos os quadros extraídos são agrupados em um único .zip que você pode descompactar em qualquer lugar.',
        },
      ],
      advancedDetails: [
        'Os modos a cada N segundos e FPS usam o filtro fps do FFmpeg para amostrar de forma uniforme ao longo da linha do tempo.',
        'O modo de marcas de tempo executa uma chamada do FFmpeg por marca de tempo solicitada, para que falhas por quadro (pedidos fora dos limites etc.) apareçam com clareza.',
        'O limite máximo de quadros é 300 por padrão e chega no máximo a 1000: mantém os trabalhos rápidos e evita extrações descontroladas.',
      ],
      whyItMatters: [
        'A extração de quadros é o jeito mais simples de obter miniaturas ou quadros de referência de vídeos que você já tem.',
        'Designers e animadores usam quadros amostrados como referência de desenho e como B-roll para storyboards.',
        'Profissionais de ML os usam para montar conjuntos de dados de classificação ou detecção sem precisar de um pipeline personalizado.',
      ],
      useCases: [
        {
          title: 'Miniaturas e prévias',
          description: 'Escolha um único quadro para usar como miniatura no YouTube ou no Vimeo.',
        },
        {
          title: 'Referências de design',
          description: 'Amostre uma sequência de quadros de gameplay ou animação como referência de desenho.',
        },
        {
          title: 'Storyboards',
          description: 'Gere uma sequência de quadros-chave para apresentar um storyboard.',
        },
        {
          title: 'Conjuntos de dados de ML',
          description: 'Monte pequenos conjuntos de dados de imagens a partir de poucos vídeos, rapidamente.',
        },
      ],
      whyMediaManipulator: [
        'Três modos de amostragem cobrem quase toda necessidade real: intervalo, FPS ou marcas de tempo específicas.',
        'A saída em ZIP mantém o download em um clique, não importa quantos quadros você extraiu.',
        'O FFmpeg no servidor garante uma saída consistente, independentemente do navegador ou do suporte a codecs.',
      ],
      privacyNote: 'Os quadros são extraídos do seu vídeo, na frequência que você escolher, pelo FFmpeg no nosso servidor e devolvidos como um ZIP de imagens. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original não é alterado, e o resultado é um arquivo novo.',
      faq: [
        {
          question: 'Como extraio quadros de um vídeo?',
          answer: 'Envie seu vídeo, escolha um modo de amostragem (a cada N segundos é o padrão), escolha um formato de imagem e clique em “Extrair quadros”. O resultado é um ZIP de imagens estáticas.',
        },
        {
          question: 'Posso exportar um quadro a cada poucos segundos?',
          answer: 'Sim, esse é o modo padrão. Defina “Segundos entre quadros” com o intervalo que você quiser.',
        },
        {
          question: 'Quais formatos de imagem são suportados?',
          answer: 'JPG (compacto, ideal para miniaturas), PNG (sem perdas) e WebP (arquivos modernos e menores).',
        },
        {
          question: 'Por que a ferramenta devolve um arquivo ZIP?',
          answer: 'Até vídeos curtos podem gerar dezenas de quadros. Devolver um único ZIP mantém o download em um clique e evita brigar com o navegador por causa de vários downloads de arquivos.',
        },
        {
          question: 'Por que existe um limite máximo de quadros?',
          answer: 'O limite evita trabalhos descontrolados por acidente (por exemplo, extrair dezenas de milhares de quadros de um vídeo longo). O padrão é 300, e o teto absoluto é 1000.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'O limite máximo de quadros padrão é 300; aumente-o até 1000 no formulário se você realmente precisar de mais.',
          'O modo de marcas de tempo aceita uma lista de segundos separados por vírgula (por exemplo, “1, 5.5, 12.25, 30”).',
        ],
      },
      related: [
        {
          label: 'Extrair áudio de vídeo',
          to: '/tools/extract-audio-from-video',
          description: 'Extraia o áudio do mesmo vídeo.',
        },
        {
          label: 'Gerador de legendas SRT',
          to: '/tools/srt-generator',
          description: 'Transcreva o mesmo vídeo em legendas .srt.',
        },
        {
          label: 'Remover áudio de vídeo',
          to: '/tools/extract-video-only-from-video',
          description: 'Remova o áudio para ficar com uma cópia muda do vídeo.',
        },
      ],
      embed: {
        title: 'Extrair quadros de um vídeo',
        description: 'Envie um vídeo, escolha um modo de amostragem (a cada N segundos, em uma taxa de quadros ou em marcas de tempo específicas) e baixe um ZIP de quadros estáticos.',
      },
    },
    'stitch-audio-to-video': {
      name: 'Adicionar áudio ao vídeo',
      h1: 'Adicionar áudio ao vídeo',
      tagline: 'Combine um vídeo base com até três arquivos de áudio extras, como locuções, música e narração, e baixe um novo MP4.',
      metaTitle: 'Adicionar áudio ao vídeo: locução, música, substituição | Media Manipulator',
      metaDescription: 'Ferramenta online gratuita para adicionar locuções, música ou narração a um vídeo, ou substituir o áudio original por completo. Controles de volume e deslocamento por faixa, saída em MP4.',
      ogTitle: 'Adicionar áudio ao vídeo',
      ogDescription: 'Adicione locução, música, narração ou substitua o áudio original. Controles de volume e deslocamento por faixa, saída em MP4, sem cadastro.',
      intro: 'Combinar um vídeo base com um ou mais arquivos de áudio extras é uma das tarefas de edição mais comuns: adicionar uma locução, inserir uma trilha de fundo, narrar uma gravação de tela ou substituir o áudio original por completo. O Media Manipulator oferece controles de volume e deslocamento por faixa, uma opção de mixar ou substituir e uma saída em MP4 que funciona direto em qualquer player.',
      whatItDoes: [
        'Combina um vídeo base com até três faixas de áudio extras.',
        'Controles por faixa: volume (0–4×), deslocamento inicial em segundos e repetição opcional até a duração do vídeo.',
        'Modo geral: “mixar” mantém o áudio original, “substituir” o descarta.',
        'A saída é sempre MP4 com áudio AAC a 192 kbps, o padrão seguro em qualquer lugar.',
      ],
      flowSteps: [
        {
          title: 'Envie o vídeo base',
          description: 'Solte qualquer arquivo MP4, MOV, MKV, WebM, AVI ou M4V.',
        },
        {
          title: 'Adicione faixas de áudio',
          description: 'Adicione até três arquivos de áudio (locução, música, narração) com configurações por faixa.',
        },
        {
          title: 'Escolha mixar ou substituir',
          description: 'Mantenha o áudio original e mixe as novas faixas, ou descarte o original e use só o áudio novo.',
        },
        {
          title: 'Baixe o novo MP4',
          description: 'Unimos tudo no nosso servidor e devolvemos um MP4 limpo.',
        },
      ],
      advancedDetails: [
        'O grafo de filtros é montado por código: nós adelay + volume por faixa e, depois, um único amix para combiná-las.',
        'O fluxo de vídeo é copiado sem recodificação sempre que possível; só o áudio é recodificado (para AAC a 192 kbps).',
        'A repetição é implementada com `-stream_loop -1` na entrada de áudio, para que trilhas de fundo curtas se estendam de forma limpa até a duração do vídeo.',
        'A duração da saída é “cortar na duração do vídeo” por padrão; desmarque se quiser que a saída se estenda até a entrada mais longa.',
      ],
      whyItMatters: [
        'Locução, música e narração são as adições de áudio mais comuns em vídeos curtos.',
        'Os controles de volume e deslocamento por faixa permitem criar uma mixagem de verdade em vez de uma única faixa inserida.',
        'Fazer isso no navegador seria lento e pouco confiável; o FFmpeg no servidor é rápido e preciso.',
      ],
      useCases: [
        {
          title: 'Vídeos de criadores',
          description: 'Adicione uma trilha musical sob um trecho de fala para a câmera, ou substitua o áudio ambiente por uma locução limpa.',
        },
        {
          title: 'Tutoriais',
          description: 'Coloque uma faixa de narração por cima de uma gravação de tela.',
        },
        {
          title: 'Clipes para redes sociais',
          description: 'Adicione uma música em alta em um deslocamento específico a um corte de 15 segundos.',
        },
        {
          title: 'Vídeos de família e pessoais',
          description: 'Adicione música de fundo a uma montagem de férias.',
        },
      ],
      whyMediaManipulator: [
        'Controles de volume e deslocamento por faixa, não só um único arquivo de áudio inserido.',
        'Copia o vídeo sem recodificar sempre que possível, preservando a qualidade original do vídeo.',
        'Grátis, sem cadastro, FFmpeg no servidor. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'Seu vídeo e o arquivo de áudio que você adiciona são unidos em um único MP4 pelo FFmpeg no nosso servidor. O trabalho roda nos nossos próprios servidores, não em um serviço de transcodificação de terceiros. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos. Seu arquivo original não é alterado, e o resultado é um arquivo novo.',
      faq: [
        {
          question: 'Posso adicionar música a um vídeo?',
          answer: 'Sim: adicione o arquivo de música como faixa de áudio, defina o volume e deixe o modo em “mixar” para manter o áudio original por baixo.',
        },
        {
          question: 'Posso adicionar uma locução e manter o áudio original?',
          answer: 'Sim: mantenha o modo em “mixar”, adicione a locução e, se quiser que a locução fique em destaque, abaixe o áudio original definindo um volume baixo nas faixas extras.',
        },
        {
          question: 'Posso substituir a faixa de áudio original?',
          answer: 'Sim: defina o modo como “substituir” e o áudio original é descartado. Só as faixas adicionadas são mixadas na saída.',
        },
        {
          question: 'O que acontece se o áudio for mais longo que o vídeo?',
          answer: 'Por padrão, cortamos na duração do vídeo. Desmarque “Cortar na duração do vídeo” se quiser que a saída se estenda até a entrada mais longa.',
        },
        {
          question: 'Posso ajustar o volume do áudio adicionado?',
          answer: 'Sim: cada faixa adicionada tem o próprio fator de volume (0–4×) e um deslocamento inicial em segundos.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Máximo de 3 faixas de áudio adicionadas por trabalho.',
        ],
        processingNotes: [
          'O fluxo de vídeo é copiado sem recodificação sempre que possível; só o áudio é recodificado (para AAC a 192 kbps).',
          'A caixa de repetição estende trilhas de fundo curtas até a duração do vídeo.',
        ],
      },
      related: [
        {
          label: 'Extrair áudio de vídeo',
          to: '/tools/extract-audio-from-video',
          description: 'Extraia o áudio de um vídeo para reutilizar em outro.',
        },
        {
          label: 'Remover áudio de vídeo',
          to: '/tools/extract-video-only-from-video',
          description: 'Remova o áudio para preparar uma base limpa para uma nova trilha sonora.',
        },
        {
          label: 'Gerador de forma de onda de áudio',
          to: '/tools/audio-waveform-generator',
          description: 'Crie um acompanhamento visual para sua faixa de áudio.',
        },
      ],
      embed: {
        title: 'Adicionar ou substituir a faixa de áudio de um vídeo',
        description: 'Envie um vídeo base, adicione de um a três arquivos de áudio, defina o volume e o deslocamento por faixa e escolha “mixar” ou “substituir”. Devolvemos um MP4 com tudo combinado.',
      },
    },
    'ai-frame-interpolation': {
      name: 'Interpolação de quadros com IA',
      h1: 'Ferramenta de interpolação de quadros com IA',
      tagline: 'Aumente a taxa de quadros de um vídeo para 48, 60 ou 120 FPS com quadros intermediários gerados por IA, para um movimento mais suave.',
      metaTitle: 'Interpolação de quadros com IA: converta vídeo para 60 ou 120 FPS | Media Manipulator',
      metaDescription: 'Ferramenta online gratuita de interpolação de quadros com IA. Use o RIFE para transformar vídeos de 24/30fps em MP4 mais fluidos de 48, 60 ou 120 FPS. Sem API de terceiros: roda na nossa própria GPU.',
      ogTitle: 'Ferramenta de interpolação de quadros com IA: vídeo fluido em 60 ou 120 FPS',
      ogDescription: 'Envie um vídeo, escolha um FPS desejado e baixe um MP4 com quadros intermediários gerados por IA para um movimento mais fluido.',
      intro: 'A interpolação de quadros com IA aumenta a taxa de quadros de um vídeo gerando novos quadros intermediários com uma rede neural (RIFE), em vez de simplesmente duplicar ou mesclar quadros existentes. O resultado é um movimento visivelmente mais fluido: filmagens de 24/30fps começam a parecer 60fps, e clipes de 60fps podem ser levados a 120fps, ideais para telas de alta taxa de atualização. O processamento roda no nosso próprio servidor com GPU, não em uma API de terceiros, e a saída é um MP4 que você pode usar direto em qualquer player.',
      whatItDoes: [
        'Sintetiza novos quadros intermediários com o RIFE (rife-ncnn-vulkan) em vez de duplicar ou mesclar quadros existentes.',
        'Mira em 48, 60 ou 120 FPS, com predefinições de qualidade e altura máxima de processamento que você controla.',
        'Roda no nosso próprio servidor com GPU; nenhum provedor de IA de terceiros vê seu arquivo.',
        'Devolve um MP4 com H.264 + AAC (a faixa de áudio da origem é preservada por padrão).',
        'Limita de antemão origens longas ou muito altas, para que um único trabalho não monopolize a GPU.',
      ],
      flowSteps: [
        {
          title: 'Envie um vídeo',
          description: 'Solte um clipe curto em MP4, MOV, WebM, MKV ou AVI.',
        },
        {
          title: 'Abra as Ferramentas de IA para vídeo',
          description: 'No formulário de vídeo, role até “Ferramentas de IA para vídeo” e selecione Interpolação de quadros com IA.',
        },
        {
          title: 'Escolha o FPS desejado e a qualidade',
          description: 'Escolha 48, 60 ou 120 FPS e uma qualidade de codificação / altura máxima de processamento.',
        },
        {
          title: 'Execute a interpolação',
          description: 'Extraímos os quadros, rodamos o RIFE na nossa GPU e recodificamos um MP4 no novo FPS.',
        },
        {
          title: 'Baixe o MP4',
          description: 'Salve o clipe interpolado e pré-visualize-o ao lado do original.',
        },
      ],
      advancedDetails: [
        'A extração de quadros usa o ffmpeg com vsync=0, para que a contagem de quadros de entrada corresponda exatamente ao FPS da origem.',
        'O RIFE roda por meio do rife-ncnn-vulkan com o diretório de modelo escolhido (rife-v4.6 é o padrão recomendado; rife-v4 e rife-v2.3 também estão disponíveis por compatibilidade).',
        'Após a interpolação, o ffmpeg recodifica para H.264 (libx264) + AAC na qualidade escolhida (CRF 26/20/17 para baixa/média/alta).',
        'O áudio da origem é remapeado para a nova codificação, e a saída usa +faststart para que o arquivo seja transmitido de forma limpa por HTTP.',
        'Uma altura máxima de processamento (720p por padrão) limita a pressão sobre a memória da GPU em origens altas; a proporção original é preservada com o redimensionamento -2:min(ih,N).',
      ],
      whyItMatters: [
        'A fluidez do movimento é uma das maiores diferenças perceptíveis entre vídeo doméstico e vídeo com qualidade de transmissão.',
        'Telas modernas e muitas plataformas sociais favorecem conteúdo em 60fps e 120fps para uma reprodução mais fluida.',
        'Filmagens antigas ou com baixa taxa de quadros podem subir de nível sem refilmar o material original.',
      ],
      useCases: [
        {
          title: '30fps → 60fps para a web',
          description: 'Leve filmagens de fala para a câmera, screencasts ou vlogs para a faixa mais fluida de 60fps, típica dos sites sociais e de vídeo modernos.',
        },
        {
          title: '60fps → 120fps para reprodução em alta taxa de atualização',
          description: 'Prepare filmagens para telas de 120Hz/144Hz ou para edição posterior em câmera lenta.',
        },
        {
          title: 'Clipes curtos mais fluidos',
          description: 'Faça um corte de 5–10 segundos parecer visivelmente mais fluido antes de compartilhar.',
        },
        {
          title: 'Restaurar clipes antigos',
          description: 'Leve clipes legados de 24/30fps para 48 ou 60fps, com uma sensação de reprodução mais moderna.',
        },
        {
          title: 'Preparação para edição',
          description: 'Gere uma linha do tempo de quadros mais densa antes de aplicar câmera lenta ou motion graphics em um editor posterior.',
        },
      ],
      whyMediaManipulator: [
        'Roda na nossa própria infraestrutura de GPU; nenhum provedor de IA de terceiros recebe o arquivo.',
        'Usa o rife-ncnn-vulkan, um binário Vulkan portátil, em vez de uma pilha PyTorch pesada: menos dependências e inicializações a frio mais rápidas.',
        'Grátis, sem cadastro. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      ],
      privacyNote: 'Novos quadros intermediários são gerados para o seu vídeo pelo RIFE no nosso próprio servidor com GPU. O trabalho de IA roda em hardware que nós operamos, nunca em um provedor de IA de terceiros, e nada do que você envia é usado para treinar um modelo. Os arquivos ficam guardados por 24 horas para visitantes; com uma conta gratuita, você escolhe de 24 horas a 2 anos.',
      faq: [
        {
          question: 'A interpolação de quadros com IA realmente melhora a qualidade do vídeo?',
          answer: 'Ela melhora a fluidez do movimento, não a resolução nem a nitidez. Se a origem já estiver em 60fps, ela vai parecer mais fluida em 120fps. Se a origem estiver em 24/30fps, vai parecer mais próxima de 60fps. Ela não recupera magicamente um movimento real que a câmera nunca capturou.',
        },
        {
          question: 'A interpolação de quadros com IA é a mesma coisa que só aumentar o FPS?',
          answer: 'Não. A conversão básica de FPS normalmente duplica, descarta ou mescla quadros existentes. A interpolação com IA sintetiza quadros intermediários totalmente novos com base no movimento estimado, o que costuma parecer muito mais natural que a duplicação.',
        },
        {
          question: 'Posso converter 30fps em 60fps?',
          answer: 'Sim: 30fps para 60fps é um dos alvos mais comuns e um bom primeiro teste.',
        },
        {
          question: 'Posso converter 60fps em 120fps?',
          answer: 'Sim. 120fps dobra o trabalho da GPU em relação a 60fps e produz um arquivo maior, então teste primeiro com um clipe curto.',
        },
        {
          question: 'Por que a interpolação de quadros pode criar artefatos?',
          answer: 'A estimativa de movimento precisa adivinhar o que acontece entre dois quadros reais. Movimentos rápidos, mãos, cabelo, rodas, oclusões e cortes de cena são inerentemente mais difíceis: o quadro sintetizado pode deformar, criar fantasmas ou borrar nessas regiões.',
        },
        {
          question: 'Qual formato de saída a ferramenta cria?',
          answer: 'MP4 com vídeo H.264 e áudio AAC. A v1 só gera MP4 porque esse contêiner é reproduzido em qualquer lugar e suporta as taxas de quadros mais altas que esta ferramenta produz.',
        },
        {
          question: '60fps é sempre melhor que 30fps?',
          answer: 'Para screencasts de interface, esportes, gameplay e clipes com muito movimento, 60fps costuma parecer mais fluido. Para conteúdo cinematográfico, 24/30fps muitas vezes é o visual pretendido. Escolha o FPS que corresponda à sensação que você quer no resultado.',
        },
        {
          question: 'A interpolação de quadros com IA é melhor que o minterpolate do FFmpeg?',
          answer: 'A interpolação com IA (RIFE) geralmente produz um movimento mais limpo que o filtro minterpolate embutido do FFmpeg, especialmente em movimentos não rígidos. O minterpolate é mais rápido, mais simples e continua útil para conversões rápidas de recurso.',
        },
        {
          question: 'Por que os cortes de cena às vezes ficam estranhos depois da interpolação?',
          answer: 'O modelo presume que quadros adjacentes pertencem à mesma sequência de movimento. Um corte de cena seco quebra essa premissa, então o quadro sintetizado na fronteira pode mostrar uma breve deformação. Cortes limpos e clipes curtos ajudam.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'A duração máxima da origem e a altura de processamento são limitadas por AI_FRAME_INTERPOLATION_MAX_DURATION_SECONDS e AI_FRAME_INTERPOLATION_MAX_HEIGHT no servidor.',
        ],
        processingNotes: [
          'A interpolação com IA exige muito da GPU. Reduza a altura máxima de processamento para um retorno mais rápido em origens altas.',
          'A saída é MP4 (H.264 + AAC) na v1. O áudio da origem é preservado por padrão.',
        ],
      },
      related: [
        {
          label: 'Conversor de vídeo',
          to: '/tools/video-converter',
          description: 'Converta MP4, WebM, MOV, AVI, MKV e mais.',
        },
        {
          label: 'Comprimir vídeo',
          to: '/tools/compress-video',
          description: 'Reduza o tamanho do arquivo de vídeo depois da interpolação.',
        },
        {
          label: 'Converter vídeo em GIF animado',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Transforme clipes curtos em GIFs animados fáceis de compartilhar.',
        },
        {
          label: 'Extrair quadros de vídeo',
          to: '/tools/extract-frames-from-video',
          description: 'Extraia quadros individuais como PNGs.',
        },
        {
          label: 'Tutorial de interpolação de quadros com IA',
          to: '/tutorials/ai-frame-interpolation',
          description: 'Aprenda como a interpolação com IA funciona e quando usá-la.',
        },
      ],
      embed: {
        title: 'Interpolação de quadros com IA',
        description: 'Envie um vídeo curto. A Interpolação de quadros com IA já vem selecionada: escolha um FPS desejado (48, 60 ou 120) e a ferramenta sintetiza novos quadros intermediários e devolve um MP4.',
      },
    },
    // MM100: Aperture's page lines (name, tagline, SEO title and description); full bodies come with MM102-<prefix>. Model-written, needs native review.
    'aperture': {
      name: 'Aperture',
      tagline: 'Um editor de fotos em camadas no seu navegador: exposição, curvas, cor, máscaras, retoque e predefinições, exportado em resolução total.',
      metaTitle: 'Aperture, editor de fotos online: camadas e curvas | Media Manipulator',
      metaDescription: 'Edite fotos no navegador com o Aperture: camadas de ajuste não destrutivas, curvas, níveis, HSL, máscaras, retoque de manchas, predefinições e exportação em resolução total.',
    },
    'brighten-image': {
      name: 'Clarear imagem',
      tagline: 'Clareie uma foto escura com um controle de exposição real em luz linear, ou com Brilho e Sombras quando quiser uma mudança mais suave e seletiva.',
      metaTitle: 'Clarear uma imagem online: exposição, brilho e sombras | Aperture',
      metaDescription: 'Clareie uma foto escura no navegador. Exposição em stops EV, um controle de Brilho e recuperação de Sombras, com pré-visualização ao vivo e exportação em resolução total.',
    },
    'adjust-image-contrast': {
      name: 'Ajustar contraste',
      tagline: 'Um controle de Contraste que gira em torno do cinza médio, além de Tom e Curvas para ganhar contraste sem esmagar as pontas.',
      metaTitle: 'Ajustar o contraste de uma imagem online: tom ou curvas | Aperture',
      metaDescription: 'Aumente ou reduza o contraste de uma imagem no navegador. O controle de Contraste gira em torno do cinza médio; Tom e Curvas dão controle sobre a forma. Exporta em tamanho total.',
    },
    'fix-photo-exposure': {
      name: 'Corrigir exposição',
      tagline: 'Defina a exposição em stops, depois recupere realces e sombras separadamente enquanto o histograma mostra o que ainda dá para aproveitar.',
      metaTitle: 'Corrigir fotos super ou subexpostas online | Aperture',
      metaDescription: 'Corrija a exposição de uma foto no navegador: Exposição em stops EV mais recuperação de Realces, Sombras, Brancos e Pretos, com histograma ao vivo e exportação em resolução total.',
    },
    'adjust-image-hue': {
      name: 'Ajustar o matiz da imagem',
      tagline: 'Gire todas as cores de uma foto em até 180 graus, ou mova só os vermelhos, os verdes ou os azuis, com pré-visualização ao vivo e exportação em resolução total.',
      metaTitle: 'Ajustar o matiz de uma imagem online | Media Manipulator',
      metaDescription: 'Desloque o matiz de uma foto inteira de -180 a 180 graus, ou mova só os vermelhos, amarelos, verdes, ciano, azuis ou magentas. Pré-visualização na GPU ao vivo, exportação em resolução total.',
    },
    'change-image-color': {
      name: 'Mudar a cor de um objeto',
      tagline: 'Escolha a cor com um conta-gotas, defina até onde a seleção alcança, gire o matiz e exporte: um carro vermelho vira verde com sombras e reflexos intactos.',
      metaTitle: 'Mudar a cor de um objeto em uma foto online | Media Manipulator',
      metaDescription: 'Selecione um objeto pela cor com uma máscara de Faixa de cores, gire o matiz com os controles de Cor (HSL) e exporte em resolução total. Sombras e brilhos permanecem.',
    },
    'color-pop': {
      name: 'Cor em destaque',
      tagline: 'Mantenha os vermelhos, ou os azuis, ou qualquer uma de seis famílias de cor, e deixe todo o resto cinza com um único look incluído que você pode ajustar depois.',
      metaTitle: 'Foto em preto e branco, exceto uma cor | Media Manipulator',
      metaDescription: 'Cor seletiva no navegador: mantenha vermelho, amarelo, verde, ciano, azul ou magenta e dessature o resto. Seis looks incluídos, controle por faixa, exportação em resolução total.',
    },
    'image-saturation': {
      name: 'Saturação da imagem',
      tagline: 'Vibração para um reforço que protege a pele e as cores já fortes, Saturação para uma escala uniforme, ambas como camadas que você pode mascarar.',
      metaTitle: 'Aumentar ou reduzir a saturação de uma imagem online | Aperture',
      metaDescription: 'Altere a saturação de uma foto no navegador. A Vibração reforça cores apagadas e protege a pele; a Saturação escala todas as cores por igual. Exportação em resolução total.',
    },
    'photo-levels': {
      name: 'Níveis',
      tagline: 'Defina o preto de entrada, o branco de entrada, a gama dos meios-tons e a faixa de saída por canal, com um histograma ao vivo.',
      metaTitle: 'Ajustar os níveis de uma foto online: preto, branco, meios-tons',
      metaDescription: 'Níveis no navegador: pontos de preto e branco de entrada, gama dos meios-tons e limites de saída para RGB, vermelho, verde e azul, com histograma ao vivo.',
    },
    'photo-curves': {
      name: 'Curvas',
      tagline: 'Modele tom e cor com uma curva arrastável para RGB e para cada canal, com até 16 pontos e um conta-gotas.',
      metaTitle: 'Ferramenta de curvas online: curvas RGB e por canal no navegador',
      metaDescription: 'Curvas no navegador: arraste até 16 pontos nas curvas RGB, vermelha, verde e azul, escolha tons com um conta-gotas e exporte em resolução total.',
    },
    'white-balance-photo': {
      name: 'Balanço de branco',
      tagline: 'Remova uma dominante amarela, azul, verde ou magenta com controles de Temperatura e Matiz que atuam em luz linear sobre os meios-tons.',
      metaTitle: 'Corrigir balanço de branco e dominante de cor de uma foto | Aperture',
      metaDescription: 'Corrija uma dominante de cor no navegador. Os controles de Temperatura e Matiz deslocam os meios-tons em luz linear, com pré-visualização ao vivo e exportação em resolução total.',
    },
    'black-and-white-photo': {
      name: 'Foto em preto e branco',
      tagline: 'Uma conversão monocromática ponderada por canal com seis controles de cor, uma curva de filme suave e grão fino, aplicada ao abrir e ajustável antes de exportar.',
      metaTitle: 'Converter uma foto em preto e branco online | Media Manipulator',
      metaDescription: 'Preto e branco com controle por cor: seis controles de canal decidem como vermelho, amarelo, verde, ciano, azul e magenta viram cinza. Visual de filme aplicado, exportação em tamanho total.',
    },
    'tint-photo': {
      name: 'Colorir uma foto',
      tagline: 'Aplique uma cor sobre uma foto como um filtro na lente: escolha quente, frio, sépia ou qualquer cor personalizada, defina a densidade e mantenha o brilho onde estava.',
      metaTitle: 'Colorir uma foto online: quente, sépia ou qualquer cor | Media Manipulator',
      metaDescription: 'Adicione um tom de cor a uma foto com uma camada de Filtro de foto: quente, frio, sépia, vermelho, verde, azul ou uma cor hex personalizada, densidade de 0 a 100, preservar luminosidade. Exportação em tamanho total.',
    },
    'color-balance-photo': {
      name: 'Balanço de cores',
      tagline: 'Empurre vermelho, verde e azul separadamente nas sombras, nos meios-tons e nos realces para remover uma dominante ou criar um look, com a luminosidade preservada.',
      metaTitle: 'Balanço de cores de uma foto online | Media Manipulator',
      metaDescription: 'Nove controles, vermelho, verde e azul para sombras, meios-tons e realces, com preservar luminosidade. Corrija uma dominante azul ou laranja ou gradue uma foto e exporte em tamanho total.',
    },
    'split-toning': {
      name: 'Divisão de tons',
      tagline: 'Empurre um matiz para as sombras e outro para os realces, depois deslize o ponto de equilíbrio entre eles.',
      metaTitle: 'Divisão de tons online: colora sombras e realces separadamente',
      metaDescription: 'Tinja sombras e realces com dois matizes diferentes no navegador: controles de matiz, saturação e equilíbrio, antes e depois ao vivo, exportação em resolução total.',
    },
    'apply-lut-to-photo': {
      name: 'Aplicar um LUT',
      tagline: 'Solte um LUT 3D .cube sobre uma foto, defina a intensidade e exporte a imagem graduada em resolução total.',
      metaTitle: 'Aplicar um LUT a uma foto online: carregue um arquivo .cube no navegador',
      metaDescription: 'Carregue um LUT 3D .cube de até tamanho 65 e 1 MB, veja a gradação na foto na hora, misture-a com um controle de intensidade e exporte em tamanho total.',
    },
    'invert-image-colors': {
      name: 'Inverter cores',
      tagline: 'Transforme cada pixel em seu negativo, como uma camada não destrutiva que você pode mascarar, mesclar ou desfazer.',
      metaTitle: 'Inverter as cores de uma imagem online: negativo de uma foto',
      metaDescription: 'Inverta uma foto para o negativo no navegador com um clique. Cada canal vira 1 menos o seu valor; mascare, empilhe e exporte em resolução total.',
    },
    'posterize-image': {
      name: 'Posterizar',
      tagline: 'Reduza cada canal a um número escolhido de níveis para uma cor chapada, estilo pôster, com degraus tonais marcados.',
      metaTitle: 'Posterizar uma imagem online: de 2 a 255 níveis por canal',
      metaDescription: 'Posterize uma foto no navegador ajustando cada canal para 2 a 255 níveis. Veja as faixas ao vivo, combine com preto e branco e exporte em tamanho total.',
    },
    'reduce-image-noise': {
      name: 'Reduzir ruído da imagem',
      tagline: 'Redução de ruído de luminância e de cor separadas, com pré-visualização ao vivo, e exportação em resolução total.',
      metaTitle: 'Reduzir o ruído de uma foto online: luminância e cor',
      metaDescription: 'Reduza o ruído de uma foto granulada de ISO alto no navegador: um filtro bilateral na luminância e um gaussiano na cor, avaliados em zoom de 100% e exportados em resolução total.',
    },
    'add-vignette': {
      name: 'Adicionar vinheta',
      tagline: 'Escureça ou clareie as bordas de uma foto com ponto médio, arredondamento, suavização e proteção de realces.',
      metaTitle: 'Adicionar ou remover vinheta online: ponto médio, arredondamento',
      metaDescription: 'Adicione uma vinheta escura ou clara a uma foto no navegador, ou cancele a vinheta da lente com um valor positivo. Cinco controles, pré-visualização ao vivo e exportação em resolução total.',
    },
    'sharpen-photo-online': {
      name: 'Aumentar a nitidez da foto',
      tagline: 'Máscara de nitidez com quantidade, raio e limiar na luma, além de Clareza e Textura, avaliada a 100%.',
      metaTitle: 'Aumentar a nitidez de uma foto online: quantidade, raio e limiar',
      metaDescription: 'Aumente a nitidez de uma foto no navegador com uma máscara de nitidez de verdade: quantidade 0-500, raio 0,1-50 px, limiar 0-255, além de Clareza e Textura. Pré-visualização ao vivo e exportação em resolução total.',
    },
    'straighten-photo': {
      name: 'Endireitar foto',
      tagline: 'Corrija um horizonte inclinado por ângulo ou desenhando uma linha, depois corte automaticamente no maior retângulo.',
      metaTitle: 'Endireitar uma foto torta online: corrija um horizonte inclinado',
      metaDescription: 'Nivele um horizonte inclinado no navegador: digite um ângulo ou desenhe uma linha sobre o horizonte, corte automaticamente no maior retângulo interno e exporte em resolução total.',
    },
    'fix-perspective-photo': {
      name: 'Corrigir perspectiva',
      tagline: 'Arraste quatro cantos para corrigir o efeito trapézio e as verticais convergentes, depois corte automaticamente o resultado.',
      metaTitle: 'Corrigir a perspectiva de uma foto online: correção trapezoidal',
      metaDescription: 'Corrija verticais convergentes e distorção trapezoidal no navegador arrastando quatro cantos. Mapa projetivo, reamostragem bilinear, corte automático e exportação em resolução total.',
    },
    'remove-blemishes': {
      name: 'Remover imperfeições',
      tagline: 'Pinte sobre as manchas, toque em Retocar e deixe um modelo de preenchimento da nossa GPU completá-las a partir da pele ao redor.',
      metaTitle: 'Remover imperfeições e manchas de uma foto online: Retocar',
      metaDescription: 'Pinte sobre espinhas, manchas de poeira e marcas soltas, toque em Retocar e um modelo de preenchimento da nossa própria GPU as completa. Uma operação de IA por toque, estornada se falhar, exportação em resolução total.',
    },
    'select-by-color': {
      name: 'Selecionar por cor',
      tagline: 'Escolha uma cor com o conta-gotas, amplie a faixa com a tolerância e ajuste apenas essa seleção.',
      metaTitle: 'Selecionar por cor em uma foto online: máscara de faixa de cores',
      metaDescription: 'Crie uma máscara de faixa de cores no navegador: conta-gotas, Shift + clique para adicionar até 8 cores, tolerância medida em distância de cor Lab, suavização e inversão, e ajuste só a seleção.',
    },
  },
} as const;

export default ptBrToolPages;
