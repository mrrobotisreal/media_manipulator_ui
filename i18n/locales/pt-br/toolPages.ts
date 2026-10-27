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
  },
} as const;

export default ptBrToolPages;
