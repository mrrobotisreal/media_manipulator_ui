/**
 * Simplified Chinese partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope: MM60 (2026-10-27) added Motion's full page body; MM92 (2026-10-31)
 * added `name` + `tagline` for every tool; MM93 (2026-11-04) added the full
 * body of every non-alias tool page (98), model-written by Opus 5.5; native
 * review pending. MM102-zh-cn (2026-11-04) added the bodies of the 25
 * Aperture pages (Opus 5.5, native review pending; editor terms from
 * `panels.photo.*`, luma = 亮度值, the Free plan = 免费账号).
 * Trim is 剪辑 and crop is 裁剪; allowances are 常规任务额度
 * and AI任务额度 (pricing FAQ). Number words the English spells out are
 * written in characters: the body checker matches ASCII digits with English.
 *
 * Register: neutral Mainland Chinese, 你 for the reader; brand names,
 * formats and codecs stay in Latin script; "Motion" and "Darkroom" stay as
 * they are. Model-written, needs native review.
 */

const zhCnToolPages = {
  pages: {
    // MM48: Motion's full page body (model-written, needs native review). The brand stays "Motion".
    motion: {
      name: 'Motion',
      h1: 'Motion',
      tagline: '绘制或导入SVG，在关键帧时间线上制作动画，然后导出动画SVG、Lottie、React、JavaScript、Flutter或GIF，全部在你的浏览器中完成。',
      intro: 'Motion是内置于Media Manipulator的带动画时间线的SVG编辑器。打开一个SVG文件（或Lottie动画），每个形状都会变成一个可以选择、移动、改色和制作动画的图层；也可以从空白画布开始，用矩形、椭圆、直线、钢笔和文本工具绘制。每个动画属性都有自己的关键帧轨道，配有缓动预设、用于自定义缓动的曲线编辑器，以及用于瞬间跳变的保持关键帧。一键动画器可添加描边绘制、沿路径运动、形状变形、渐变颜色变化、蒙版动画和模糊。当它按你想要的方式运动时，将其导出为动画SVG、Lottie文件、React组件、JavaScript或TypeScript模块、Flutter组件或GIF。编辑和每一次导出都在你的浏览器中运行，因此你的作品绝不会为了导出而被上传。',
      whatItDoes: [
        '将SVG文件导入为可编辑的图层树（组、路径、形状、文本、图片、渐变、蒙版和剪切路径），并连同关键帧一起导入Lottie JSON动画，每个文件最大4 MB。',
        '用矩形、椭圆、直线、钢笔（贝塞尔）和文本工具绘制新作品，并直接在画布上编辑路径节点。',
        '在关键帧时间线上为位置、缩放、旋转、倾斜、不透明度、填充、描边和描边宽度制作动画，支持线性、缓入、缓出、缓入缓出、自定义三次贝塞尔和保持缓动。',
        '提供六种一键动画器：描边绘制、沿路径运动（可选自动旋转）、形状变形、渐变色标颜色、蒙版和剪切路径动画，以及模糊。',
        '导出静态SVG（始终免费，且从不计数）、无需任何库即可播放的动画SVG、Lottie JSON、React组件、JavaScript或TypeScript模块、Flutter组件和动态GIF，全部在你的设备上生成。',
      ],
      flowSteps: [
        {
          title: '打开或绘制',
          description: '导入SVG或Lottie文件，或在空白画布上绘制形状和路径。',
        },
        {
          title: '制作动画',
          description: '移动播放头并更改一个属性：时间线会为它记录一个关键帧。',
        },
        {
          title: '塑造节奏',
          description: '选择缓动预设、绘制自定义曲线、添加保持，或应用一键动画器。',
        },
        {
          title: '导出',
          description: '下载在你的浏览器中生成的动画SVG、Lottie、React、JS/TS、Flutter或GIF。',
        },
      ],
      advancedDetails: [
        '只要每种效果都能在Chrome、Firefox和Safari中用CSS表达，动画SVG导出就会使用纯CSS关键帧。形状变形、移动的渐变色标和模糊需要脚本，因此这些文件会嵌入一份精简的anime.js（MIT许可证，脚本约31 KB，gzip后约13 KB），并在顶部附带其许可声明。',
        '形状变形会将两个形状归一化为相同数量的曲线段，并对齐它们的起点和绕向，因此变形不会扭曲。无法匹配的两个形状会保持而不是变形。',
        'Lottie写入器以Lottie 1.0.1规范和LottieFiles的“Basic”功能集为目标。Lottie无法承载的任何内容（如滤镜、文本或高级蒙版）会在下载后列出；不会有任何内容被静默丢弃。读取器在相反方向上使用同一份列表。',
        'GIF导出逐帧渲染，将每一帧传给Worker，并使用专为Media Manipulator编写的编码器进行编码：从分布在整个时长中的五帧采样生成一个全局调色板，默认关闭抖动（平面矢量图颜色很少，抖动只会增加噪点），帧延迟为round(100 / fps)厘秒，并且只有在画布背景透明时才保留透明度。输出上限为2 GB，对话框会在开始前显示大小估算。',
        '导入的SVG会在导入时被清理：脚本、事件处理程序、外部引用和其他不安全内容会被移除，编辑器会从允许列表重建不支持的标记，而不是将其作为HTML插入。无法建模的标记会作为不透明图层保留，并原样往返。',
        '导出计数器是单个数据库事务：先检查格式锁和上限，再同时写入计数器和一条导出记录。被拒绝的导出不写入任何内容，也不消耗额度；而浏览器随后取消或失败的导出已经被计数。',
      ],
      whyItMatters: [
        '动画SVG在任何尺寸下都保持锐利，而且通常比同样动画的视频或GIF小得多，这使它们成为网页上标志、图标、加载动画和插图的理想选择。',
        '开发者需要的是作为代码的动画，而不只是视频：React组件、JavaScript模块、Lottie文件或Flutter组件可以直接放入应用。',
        '在浏览器中导出意味着你的作品留在你的设备上；只有每次导出的计数会发送给我们，用于执行每日额度。',
      ],
      useCases: [
        {
          title: '标志和图标动画',
          description: '用描边动画画出标志，或让图标在悬停时弹跳、旋转或变色。',
        },
        {
          title: '加载动画和UI微动画',
          description: '制作旋转和进度动画，并导出为纯CSS的SVG或React组件。',
        },
        {
          title: '移动应用的Lottie',
          description: '为iOS、Android、网页和Flutter的Lottie播放器导出Lottie JSON，或编辑现有的Lottie文件。',
        },
        {
          title: '动画插图',
          description: '让插图的各部分沿路径移动，让形状相互变形，并导出用于聊天或邮件的GIF。',
        },
      ],
      workedExamples: [
        {
          title: '以动画SVG导出的2秒标志描边绘制',
          body: '由几条路径组成的文字标志，应用持续2,000 ms的“描边绘制”动画器，导出为动画SVG。描边绘制是stroke-dasharray和stroke-dashoffset动画，所有主流浏览器都能用CSS表达，因此导出器会写入一个包含@keyframes的<style>块，完全不需要脚本。文件就是你的SVG加上几百字节的CSS，放入页面即可播放，并计为一次svg_animated导出：没有账号时，这是每天2次中的一次，且在访客10秒的长度上限之内；使用免费账号则是5次中的一次。导出是在你浏览器中进行的字符串转换，瞬间完成。',
        },
        {
          title: '以GIF导出的400 x 400变形循环',
          body: '在400 x 400画布上的2秒形状变形，以Premium套餐导出为25 fps的GIF（GIF默认是Premium格式）。对话框会限制在套餐的高度和帧率预设之内，25 fps对应每帧round(100 / 25) = 4厘秒的延迟，总共50帧。其大小估算为像素数 x 帧数 x 0.25字节 + 1 KB：160,000 x 50 x 0.25约为2 MB，这个估算有意偏高，平面双色作品通常远低于此。帧在主线程上渲染，并在Worker中逐帧编码，因此内存只占几帧加上不断增长的文件；时间主要花在栅格化50帧SVG上，在笔记本电脑上只需几秒。',
        },
      ],
      whenNotToUse: 'Motion用于为矢量作品制作动画；它不能编辑视频或照片。如果你的起点是视频素材，Darkroom才是合适的编辑器，而视频转GIF页面可以把片段变成GIF。它也不是用于复杂位图的矢量化工具：把照片描摹成路径会非常臃肿，结果也无法做出有意义的动画。依赖滤镜、文字效果或高级蒙版的动画无法完整保留到Lottie导出中（对话框会列出被丢弃的内容），因此面向这些目标时，请使用动画SVG、React或JavaScript导出。此外，MP4或WebM输出取决于你浏览器对WebCodecs的支持以及你的套餐，因此在规划视频交付物之前，请先查看套餐表格。',
      whyMediaManipulator: [
        '一个真正的图层与关键帧编辑器，带有保持、自定义曲线和高级动画器，而不是模板画廊。',
        '同时面向设计师和开发者的导出：从一个项目导出动画SVG、Lottie、React、JavaScript或TypeScript、Flutter和GIF。',
        '导出在你的浏览器中生成，导出使用的唯一第三方代码都采用宽松许可（anime.js为MIT；Flutter使用flutter_svg和webview_flutter），其许可声明会保留在文件中。',
      ],
      privacyNote: '编辑和导出在你的浏览器中进行；你的作品不会为了导出而被上传。没有账号时，项目仅保存在此浏览器中。如果你登录并将项目保存到账号，经过清理的文档（最大4 MB）和一张缩略图会像Darkroom项目一样存储在我们的服务器上，遵循你选择的保留期限，并且可以从账号页面删除。对于每次计数的导出，我们只记录其格式、高度、帧率、长度和时间，并以你的账号或会话作为所有者，用于执行每日额度；导出记录中从不包含作品本身。',
      faq: [
        {
          question: 'Motion是免费的吗？',
          answer: '是的。打开Motion、绘制、制作动画、保存在此浏览器中以及导出静态SVG都是免费且不限次数的，无需账号。动画导出计入每日额度，额度取决于你的套餐：默认情况下，没有账号时每天2次（仅限动画SVG），免费账号5次，Premium 30次，Pro 150次。本页的套餐表格显示每个套餐的实时额度和格式。',
        },
        {
          question: '我可以导出哪些格式？',
          answer: '静态SVG、动画SVG（CSS，或在需要时使用小型内联脚本）、Lottie JSON、React组件（.tsx）、JavaScript或TypeScript模块、Flutter组件（.dart）和动态GIF。默认情况下，动画SVG适用于所有套餐，Lottie从免费账号起可用，React、JS/TS、Flutter和GIF从Premium起可用。你的套餐包含其中哪些，以及每日导出次数，都显示在本页的套餐表格中。',
        },
        {
          question: '有什么限制？',
          answer: '动画导出按天计数，在UTC午夜重置；被拒绝的导出不计数，但在计数之后才取消的导出会被计数。没有账号的访客只能将项目保存在浏览器中，可导出的动画最长10秒；免费账号可将3个项目保存到账号，Premium为25个，Pro不限数量。SVG和Lottie导入各最大4 MB，GIF导出上限为50 fps和2 GB输出。所有当前数值都在本页的套餐表格和价格页面中。',
        },
        {
          question: '我可以为已有的SVG制作动画吗？',
          answer: '可以。导入任何SVG，它的组、路径、形状、文本、渐变、蒙版和剪切路径都会变成可编辑的图层。编辑器无法编辑的部分（如图案或复杂滤镜）会被保留并原样导出，任何不安全的内容（脚本、事件处理程序或外部链接）会被移除并在导入后列出。',
        },
        {
          question: '支持Lottie吗？',
          answer: '支持，而且是双向的。你可以导入Lottie JSON文件进行编辑（从免费套餐起，每次导入计为一个单位），也可以将你的动画导出为Lottie JSON，供lottie-web以及iOS、Android和Flutter的Lottie播放器使用。任何一方无法表示的功能会在对话框中列出，而不是被静默丢弃。',
        },
        {
          question: '哪些浏览器支持视频导出？',
          answer: 'GIF导出在所有现代浏览器中都可用。MP4和WebM导出依赖浏览器内置的视频编码器WebCodecs，它在Chrome和Edge中可用，在较新版本的Safari和Firefox中则视编解码器而定；导出对话框会检查你的浏览器，并在无法编码时告知你。本页的套餐表格显示哪个套餐包含哪种视频格式。',
        },
        {
          question: '导出的代码适用什么许可证？',
          answer: '你的动画归你所有。当动画SVG或代码导出需要运行时，它使用MIT许可的anime.js；其版权声明写在文件顶部，必须保留在那里。Flutter导出使用flutter_svg（MIT）或webview_flutter（BSD-3-Clause）包。文件中的其他一切都由你的项目生成。编辑器使用的开源库列在我们的许可证页面上。',
        },
        {
          question: '我的项目存储在哪里？',
          answer: '没有账号时，项目仅保存在此浏览器中，因此清除浏览器数据会将它们移除。登录后，你可以将项目保存到账号；之后它会在设备间同步、在你工作时自动保存、遵循你选择的保留期限，并且可以从账号页面删除。',
        },
      ],
      supportedFormats: {
        supportedInputFormats: [
          'SVG',
          'Lottie JSON',
          'Motion项目（.json）',
        ],
        supportedOutputFormats: [
          '静态SVG',
          '动画SVG',
          'Lottie JSON',
          'React（.tsx）',
          'JavaScript / TypeScript',
          'Flutter（.dart）',
          'GIF',
        ],
        maxFileNotes: [
          'SVG和Lottie导入各最大4 MB。',
          '没有账号的项目仅存在于此浏览器中；已登录的项目遵循你选择的保留期限。',
        ],
        processingNotes: [
          '编辑、预览和所有导出都在你的浏览器中运行。只有每次导出的计数会发送到我们的服务器。',
        ],
      },
      embed: {
        title: '打开Motion',
        description: '开始新绘图或重新打开最近的绘图。编辑器会全屏打开；你的作品保存在此浏览器中，已登录用户可以将其保存到账号。',
      },
      related: [
        {
          label: 'Motion教程',
          to: '/tutorials/motion',
          description: '导入SVG、制作动画、塑造缓动并导出，一步一步来。',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '在多轨时间线上编辑视频并导出MP4。',
        },
        {
          label: '视频转动态GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: '当你的动画源自视频素材时，将视频片段转换为GIF。',
        },
        {
          label: '开源许可证',
          to: '/licenses',
          description: '编辑器运行并写入你导出文件中的库。',
        },
      ],
      metaTitle: 'Motion：免费在线SVG动画编辑器 | Media Manipulator',
      metaDescription: '在浏览器中为SVG制作动画：关键帧、缓动、保持、描边绘制、运动路径和变形。导出动画SVG、Lottie JSON、React、JS、Flutter或GIF。',
      ogTitle: 'Motion：在浏览器中为SVG制作动画',
      ogDescription: '导入或绘制SVG，在关键帧时间线上制作动画，然后导出动画SVG、Lottie JSON、React、JavaScript、Flutter或GIF。导出在你的浏览器中生成。',
      featureList: [
        '将SVG导入为可编辑图层',
        'Lottie JSON导入',
        '矩形、椭圆、直线、钢笔和文本工具',
        '带缓动预设、自定义三次贝塞尔曲线和保持关键帧的关键帧时间线',
        '描边绘制、运动路径、形状变形、渐变、蒙版和模糊动画器',
        '静态SVG导出',
        '动画SVG导出（CSS或内联anime.js运行时）',
        'Lottie JSON导出',
        'React、JavaScript、TypeScript和Flutter代码导出',
        '动态GIF导出',
        '项目保存在浏览器中或你的账号中',
      ],
    },
    // 2026-10-28 catalog expansion: name + tagline for the /tools catalog cards (model-written, needs native review).
    'inspect-metadata': {
      name: '元数据检查器',
      h1: '在线检查文件元数据',
      tagline: '在分享之前，查看照片、视频、音频文件或PDF中隐藏的所有标签：EXIF、GPS位置、相机、编解码器、ID3、XMP等。',
      metaTitle: '在线检查文件元数据：EXIF、GPS、编解码器、ID3 | Media Manipulator',
      metaDescription: '免费在线元数据检查器，适用于图片、视频、音频和PDF。查看EXIF、地图上的GPS坐标、相机和镜头、编解码器和码率、ID3标签、XMP和IPTC。无需注册。',
      ogTitle: '在线检查文件元数据',
      ogDescription: '文件中的每个EXIF、GPS、编解码器、ID3和XMP标签，分组显示、可搜索，并标记隐私条目。',
      intro: '文件携带的不只是像素和采样。手机照片会记录拍摄地点、时间和所用设备；视频会写明编码器和码率；MP3带有ID3标签和专辑封面；PDF会存储作者和生成它的软件。Media Manipulator元数据检查器在我们的服务器上用ExifTool和ffprobe读取所有这些信息，将其分为相机、位置、设备、时间、编解码器和文档几个部分，并突出显示可能暴露你身份的条目，让你在文件离手之前决定要去除哪些内容。',
      whatItDoes: [
        '读取JPG、PNG、WebP、HEIC、AVIF、TIFF和RAW衍生图片中的EXIF、GPS、IPTC、XMP和ICC数据。',
        '读取MP4、MOV、MKV、WebM和其他视频文件中的容器、流、编解码器、码率、帧率和章节数据。',
        '读取MP3、M4A、FLAC、OGG和WAV中的ID3、Vorbis和MP4标签、封面图片以及编码器设置。',
        '读取PDF中的作者、生成者、创建日期和页数。',
        '在地图轮廓上显示GPS坐标，并标记每一个涉及隐私的条目。',
        '提供原始的ExifTool和ffprobe输出，任何区块都可一键复制。',
      ],
      flowSteps: [
        {
          title: '上传文件',
          description: '图片、视频、音频或PDF。',
        },
        {
          title: '我们读取文件',
          description: 'ExifTool和ffprobe在我们的服务器上运行。',
        },
        {
          title: '浏览报告',
          description: '分组显示、可搜索，并标记隐私条目。',
        },
        {
          title: '做出决定',
          description: '如有需要，用EXIF工具去除元数据。',
        },
      ],
      advancedDetails: [
        '图片和PDF会自动检查；超过100 MB的视频和音频需要点击后才开始，以免意外上传大文件。',
        '音频文件中嵌入的封面图片会作为图片条目报告，而不是视频流。',
        '报告使用的元数据目录，与EXIF移除工具以及每次转换的结果检查器所用的目录相同。',
      ],
      whyItMatters: [
        '从手机分享的照片可能通过GPS标签暴露你的家庭住址。',
        '了解视频真实的编解码器、码率和帧率，就能解释它为什么能或不能在某处播放。',
        '文档元数据会写明作者和编辑软件，这对任何匿名发布的内容都很重要。',
      ],
      useCases: [
        {
          title: '发布照片之前',
          description: '检查是否有GPS坐标和设备序列号。',
        },
        {
          title: '调试视频',
          description: '查看真实的编解码器、配置文件、帧率和音频声道布局。',
        },
        {
          title: '检查音乐文件',
          description: '确认标签、码率，以及它是否由较低码率转码而来。',
        },
        {
          title: '审查PDF',
          description: '查看作者字段写的是谁，以及它由哪个软件生成。',
        },
      ],
      whyMediaManipulator: [
        '一个检查器即可处理图片、视频、音频和PDF，而不是四个独立的工具。',
        '涉及隐私的条目会被标记，并提供直接去除它们的途径。',
        '无需转换，无需账号。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ],
      privacyNote: '你的文件由我们服务器上的ExifTool和ffprobe读取，报告返回到你的浏览器，生成报告后临时副本会立即删除。没有任何第三方能看到文件或其标签。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: '检查文件会改变它吗？',
          answer: '不会。文件只会被读取、生成报告，并在分析后删除。不会写回任何内容。',
        },
        {
          question: '可以移除检查器发现的内容吗？',
          answer: '可以。对图片使用“移除EXIF元数据”工具；它会去除所有内容，并显示前后差异对比。',
        },
        {
          question: '为什么大视频需要点击一下？',
          answer: '超过100 MB的视频和音频只会在你要求时上传，因此你永远不会意外发送大文件。',
        },
        {
          question: '这会计入我的每日转换次数吗？',
          answer: '不会。检查是免费的，不会消耗操作次数。',
        },
        {
          question: '数据会发送给第三方吗？',
          answer: '不会。ExifTool和ffprobe在我们自己的服务器上运行，之后文件会被删除。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '检查是只读的，不计为一次转换。',
        ],
      },
      related: [
        {
          label: '移除EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '去除检查器发现的所有内容。',
        },
        {
          label: '编辑图片元数据',
          to: '/tools/edit-image-metadata',
          description: '改写标题、作者、版权和GPS。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '转换时可保留或去除元数据。',
        },
      ],
      embed: {
        title: '检查文件',
        description: '放入图片、视频、音频文件或PDF。报告会按类别对每个标签分组，标记能识别你或你所在位置的标签，并提供原始的ExifTool和ffprobe视图。',
      },
    },
    'edit-image-metadata': {
      name: '编辑图片元数据',
      h1: '在线编辑图片元数据',
      tagline: '设置照片的标题、作者、版权、关键词和描述，修改或删除其GPS位置，并重写EXIF和IPTC标签。',
      metaTitle: '在线编辑图片元数据：EXIF、IPTC、版权、GPS | Media Manipulator',
      metaDescription: '免费在线图片元数据编辑器。设置标题、作者、版权、描述和关键词，替换或移除GPS位置，并编辑JPG、PNG、WebP等格式的EXIF和IPTC标签。',
      ogTitle: '在线编辑图片元数据',
      ogDescription: '写入版权声明、修正位置、设置关键词。免费，无需注册。',
      intro: '摄影师需要在交付的每个文件中加入版权声明和联系方式。图片社需要IPTC关键词和说明文字。任何分享照片的人都可能希望去掉位置信息，或者把位置设为某个城市而不是家门口。Media Manipulator在我们的服务器上用ExifTool原地改写EXIF、IPTC和XMP字段，保持图像数据不变，并向你显示前后差异对比。',
      whatItDoes: [
        '设置标题、作者/艺术家、描述、版权、注释和关键词。',
        '移除GPS位置，或替换为你选择的坐标。',
        '按名称编辑单个EXIF/TIFF、IPTC和高级标签。',
        '保持像素不变；也可选择在同一次处理中转换格式。',
        '任务完成后显示更改内容的差异对比。',
      ],
      flowSteps: [
        {
          title: '上传图片',
          description: 'JPG、PNG、WebP、HEIC、TIFF。',
        },
        {
          title: '填写字段',
          description: '标题、作者、版权、关键词、位置。',
        },
        {
          title: '应用',
          description: 'ExifTool在我们的服务器上改写标签。',
        },
        {
          title: '下载',
          description: '对比前后差异，然后保存。',
        },
      ],
      advancedDetails: [
        '自定义元数据模式会同时写入对应的标准EXIF（Artist、Copyright、ImageDescription）、IPTC（Keywords、Caption）和XMP（dc:title、dc:creator）字段，让所有查看器显示一致。',
        '替换GPS位置会写入GPSLatitude/GPSLongitude以及正确的参考半球；移除位置则会清除所有GPS标签。',
        'PNG和WebP将元数据存放在文本块和XMP中；相同的字段也会写入这些位置。',
      ],
      whyItMatters: [
        '嵌入文件的版权声明会在文件被转发时随之传播。',
        'IPTC中的关键词和说明文字正是图库网站和DAM系统建立索引的依据。',
        '将位置设为城市，既能保护你的住址，又能保留照片的地理标记。',
      ],
      useCases: [
        {
          title: '交付客户照片',
          description: '在每个文件中嵌入你的姓名、版权和联系方式。',
        },
        {
          title: '图库投稿',
          description: '添加IPTC关键词和说明文字。',
        },
        {
          title: '粗略地理标记',
          description: '用城市中心替换精确的GPS定位。',
        },
        {
          title: '修正错误标签',
          description: '更正扫描仪写入的作者或日期。',
        },
      ],
      whyMediaManipulator: [
        '同时写入EXIF、IPTC和XMP，而不只是其中之一。',
        '前后差异对比，让你准确看到更改了什么。',
      ],
      privacyNote: 'ExifTool在我们的服务器上用你输入的值改写图片的标签；像素保持原样。没有任何第三方能看到文件或其标签。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: '编辑元数据会重新编码我的JPG吗？',
          answer: '只有在你更改输出格式或调整尺寸时才会。如果格式不变且不编辑像素，图像数据会被直接复制，只改写标签。',
        },
        {
          question: '可以移除位置但保留其他所有内容吗？',
          answer: '可以。勾选“移除位置数据”，其他字段保持不变即可。',
        },
        {
          question: '可以编辑未列出的标签吗？',
          answer: '可以。展开高级部分，按名称设置任意EXIF或IPTC标签。',
        },
        {
          question: '如何改为移除所有内容？',
          answer: '使用“移除EXIF元数据”工具，一键去除所有标签。',
        },
      ],
      related: [
        {
          label: '检查元数据',
          to: '/tools/inspect-metadata',
          description: '先看看文件里有什么。',
        },
        {
          label: '移除EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '去除所有内容。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在图片格式之间转换。',
        },
        {
          label: '裁剪图片',
          to: '/tools/crop-image',
          description: '裁剪到某个区域。',
        },
        {
          label: '调整图片尺寸',
          to: '/tools/image-resizer',
          description: '更改尺寸。',
        },
        {
          label: '为图片添加文字',
          to: '/tools/add-text-to-image',
          description: '添加说明文字或水印。',
        },
        {
          label: '图片滤镜',
          to: '/tools/image-filters',
          description: '复古棕褐、素描、浮雕等效果。',
        },
      ],
      embed: {
        title: '编辑图片的元数据',
        description: '上传图片。元数据部分会以自定义模式打开：填写标题、作者、版权、关键词，替换或移除GPS位置，如有需要可展开高级标签。除非你同时更改格式，否则图片像素保持原样。',
      },
    },
    'change-video-speed': {
      name: '更改视频速度',
      h1: '在线更改视频速度：加速或减速',
      tagline: '以2倍、4倍或更快速度制作延时视频，或将片段减速到0.5倍或0.25倍，音频保持同步。',
      metaTitle: '在线免费更改视频速度：加速或慢动作 | Media Manipulator',
      metaDescription: '免费在线视频变速工具。将视频加速到1.5倍、2倍或4倍制作延时效果，或减速到0.5倍或0.25倍。音频保持同步。输出MP4，无水印。',
      ogTitle: '在线免费更改视频速度',
      ogDescription: '将任意视频在0.25倍至4倍之间加速或减速。音频保持同步。免费，无需注册。',
      intro: '拖沓冗长的屏幕录像、需要变成十秒延时的日落、值得用慢动作呈现的滑板技巧：更改播放速度是最常见的视频编辑之一，不应该非得打开桌面剪辑软件。Media Manipulator在我们的服务器上用FFmpeg同时重新调整画面和声音的时间，速度可从四分之一到四倍，并导出在任何地方都以新节奏播放的MP4。',
      whatItDoes: [
        '将任意视频加速（1.25倍至4倍）或减速（0.25倍至0.9倍）。',
        '用保持音高的变速算法重新调整音频时间，让人声保持自然。',
        '保持分辨率和画质；默认导出MP4，也可导出任何支持的容器格式。',
        '可在同一次处理中搭配修剪、调整尺寸或色彩调整。',
      ],
      flowSteps: [
        {
          title: '上传你的视频',
          description: '任意常见视频格式。',
        },
        {
          title: '设置速度',
          description: '0.25倍至4倍；默认已选2倍。',
        },
        {
          title: '转换',
          description: 'FFmpeg重新调整视频和音频的时间。',
        },
        {
          title: '下载',
          description: '保存新的MP4。',
        },
      ],
      advancedDetails: [
        '视频使用setpts缩放显示时间戳；音频使用atempo，倍数超出0.5至2.0范围时会串联多个atempo。',
        '减速不会凭空生成帧；如需流畅的慢动作，请在减速后使用AI插帧。',
        '帧率保持不变，因此4倍延时视频只有原始帧数的四分之一。',
      ],
      whyItMatters: [
        '延时视频和回顾在2倍至4倍速度下要耐看得多。',
        '慢动作让体育和动作片段看得更清楚。',
        '教程和屏幕录像通常以1.25倍至1.5倍播放效果更好。',
      ],
      useCases: [
        {
          title: '延时摄影',
          description: '把一小时的搭建、烹饪或绘画过程压缩成几分钟。',
        },
        {
          title: '慢动作',
          description: '将体育或宠物片段减速到一半速度。',
        },
        {
          title: '更快的教程',
          description: '加速屏幕录像，而不会出现花栗鼠般的尖细声音。',
        },
        {
          title: '匹配音乐',
          description: '将片段微调到1.1倍以卡上节拍。',
        },
      ],
      whyMediaManipulator: [
        '音频会在保持音高的前提下重新调整时间，不会脱节，也不会变成尖细的花栗鼠音。',
        '可在同一表单中搭配倒放、修剪和调色。',
      ],
      privacyNote: '你的视频由我们服务器上的FFmpeg加速或减速，音频节奏也会相应调整。处理在我们自己的服务器上进行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '音频会保持同步吗？',
          answer: '会。音频按相同倍数调整节奏，并保持音高不变。',
        },
        {
          question: '最高速度是多少？',
          answer: '单次处理最快4倍、最慢0.25倍。如需更多，可将结果再次通过此工具处理。',
        },
        {
          question: '慢动作看起来会流畅吗？',
          answer: '减速会重复帧。如需真正流畅的慢动作，请先在这里减速，再使用AI插帧。',
        },
        {
          question: '我可以改为将音频静音吗？',
          answer: '可以，先使用“移除视频中的音频”工具，或导出为没有音频的GIF。',
        },
      ],
      related: [
        {
          label: 'AI插帧',
          to: '/tools/ai-frame-interpolation',
          description: '用生成的帧实现流畅的慢动作。',
        },
        {
          label: '视频转换器',
          to: '/tools/video-converter',
          description: '在视频格式之间转换。',
        },
        {
          label: '视频倒放',
          to: '/tools/reverse-video',
          description: '倒着播放片段。',
        },
        {
          label: '翻转视频',
          to: '/tools/flip-video',
          description: '水平或垂直镜像。',
        },
        {
          label: '视频防抖',
          to: '/tools/stabilize-video',
          description: '消除画面抖动。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '缩小文件体积。',
        },
        {
          label: '修剪视频',
          to: '/tools/video-trimmer',
          description: '剪出指定范围。',
        },
      ],
      embed: {
        title: '更改视频速度',
        description: '上传视频并设置速度倍数：大于1为加速，小于1为减速。默认已选2倍。音频会相应重新调整时间，因此加速后的人声依然清晰可懂。',
      },
    },
    'reverse-video': {
      name: '视频倒放',
      h1: '在线免费倒放视频',
      tagline: '倒着播放任意片段，可选择是否同时倒放音频，还可以做成先正放再倒放的往复效果。',
      metaTitle: '在线免费倒放视频：倒着播放、乒乓循环 | Media Manipulator',
      metaDescription: '免费在线视频倒放工具。倒着播放视频，也可同时倒放音频，或制作先正放再倒放的乒乓循环。输出MP4或GIF，无水印，无需注册。',
      ogTitle: '在线免费倒放视频',
      ogDescription: '倒着播放片段，或制作先正放再倒放的循环。免费，无需注册。',
      intro: '倒放效果比互联网还古老，却依然奏效：碎玻璃重新拼合、跳水者从泳池中跃出、四散的人群重新聚拢。Media Manipulator在我们的服务器上用FFmpeg倒放任意片段的画面，并可选择同时倒放音频；乒乓选项会接上正放的副本，让结果无缝循环，这正是大多数社交媒体和GIF用途所需要的。',
      whatItDoes: [
        '倒放任意片段的视频帧。',
        '同时倒放音频，或去掉音频得到无声结果。',
        '乒乓模式先正放再倒放，形成无缝循环。',
        '导出MP4、WebM或动态GIF。',
      ],
      flowSteps: [
        {
          title: '上传片段',
          description: '短片段效果最佳；倒放会将整个片段载入内存。',
        },
        {
          title: '选择倒放或乒乓',
          description: '默认已选倒放。',
        },
        {
          title: '转换',
          description: 'FFmpeg倒放画面和音频。',
        },
        {
          title: '下载',
          description: '视频选MP4，循环选GIF。',
        },
      ],
      advancedDetails: [
        '倒放会缓冲片段的每一帧，因此很长的片段或4K片段需要更长时间和更多内存；先修剪可获得最佳效果。',
        '音频使用areverse滤镜；如需无声的倒放片段，请先移除音频。',
        '乒乓会把正放流和倒放流拼接起来，使时长加倍。',
      ],
      whyItMatters: [
        '倒放和回旋镖片段是短视频社交内容的常见形式。',
        '乒乓循环能隐藏普通循环会暴露的剪切点。',
        '倒放也是制作“倒带”转场的简便方法。',
      ],
      useCases: [
        {
          title: '回旋镖式循环',
          description: '把一段两秒的片段变成无缝的来回循环。',
        },
        {
          title: '倒放揭晓',
          description: '倒着播放开箱或制作过程。',
        },
        {
          title: '倒带转场',
          description: '倒放几秒钟，在场景之间切换。',
        },
        {
          title: '倒放GIF',
          description: '直接导出为GIF，用于聊天和论坛。',
        },
      ],
      whyMediaManipulator: [
        '一个开关即可切换倒放和乒乓，音频也能正确处理。',
        '可在同一表单中先修剪再导出GIF。',
      ],
      privacyNote: '你的片段由我们服务器上的FFmpeg解码，并倒序写入一个新文件。处理在我们自己的服务器上进行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '音频也会倒放吗？',
          answer: '会，默认如此。如果想要无声片段，请先移除音频。',
        },
        {
          question: '什么是乒乓？',
          answer: '片段先正放再倒放，因此循环时不会出现明显的跳跃。',
        },
        {
          question: '有时长限制吗？',
          answer: '倒放会把整个片段保存在内存中。一两分钟的片段没有问题；更长的视频请先修剪。',
        },
        {
          question: '我可以得到GIF吗？',
          answer: '可以。选择GIF作为输出格式；它非常适合乒乓循环。',
        },
      ],
      related: [
        {
          label: '视频转GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: '制作循环GIF。',
        },
        {
          label: '视频转换器',
          to: '/tools/video-converter',
          description: '在视频格式之间转换。',
        },
        {
          label: '更改视频速度',
          to: '/tools/change-video-speed',
          description: '延时或慢动作。',
        },
        {
          label: '翻转视频',
          to: '/tools/flip-video',
          description: '水平或垂直镜像。',
        },
        {
          label: '视频防抖',
          to: '/tools/stabilize-video',
          description: '消除画面抖动。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '缩小文件体积。',
        },
        {
          label: '修剪视频',
          to: '/tools/video-trimmer',
          description: '剪出指定范围。',
        },
      ],
      embed: {
        title: '倒放视频',
        description: '上传片段。“时间类效果”部分已默认开启倒放；如需先正放再倒放的循环，请改为开启乒乓循环。导出MP4或GIF。',
      },
    },
    'flip-video': {
      name: '翻转与镜像视频',
      h1: '在线免费翻转或镜像视频',
      tagline: '一键将视频水平镜像，修正反向的摄像头或自拍画面，也可以垂直翻转。',
      metaTitle: '在线免费翻转或镜像视频 | Media Manipulator',
      metaDescription: '免费在线视频翻转工具。水平镜像视频（修正镜像的自拍和摄像头画面），或将其垂直翻转。输出MP4，无水印，无需注册。',
      ogTitle: '在线免费翻转或镜像视频',
      ogDescription: '取消自拍视频的镜像，或将片段上下翻转。免费，无需注册。',
      intro: '前置摄像头和网络摄像头常常录下镜像画面：文字是反的，头发的分线也跑到了另一边。把片段镜像一次就能恢复正常。Media Manipulator在我们的服务器上用FFmpeg水平或垂直翻转视频，并重新编码，让翻转固化到画面帧中，导出在任何播放器中都能正确播放的MP4。',
      whatItDoes: [
        '将视频水平镜像（左右）或垂直翻转（上下）。',
        '可在同一次处理中搭配90°、180°或270°旋转。',
        '将变换固化到画面帧中，不依赖旋转标记。',
        '默认导出MP4，也可导出任何支持的容器格式。',
      ],
      flowSteps: [
        {
          title: '上传视频',
          description: '任意常见格式。',
        },
        {
          title: '选择翻转方式',
          description: '默认已选水平翻转；可添加垂直翻转或旋转。',
        },
        {
          title: '转换',
          description: 'FFmpeg应用hflip/vflip并重新编码。',
        },
        {
          title: '下载',
          description: '保存修正后的MP4。',
        },
      ],
      advancedDetails: [
        '水平翻转使用hflip滤镜，垂直翻转使用vflip；两者在几何上都是无损的，并会重新编码画面帧。',
        '镜像加180°旋转等于垂直翻转；面板允许你自由组合它们。',
        'MP4输出使用H.264 + AAC + yuv420p + faststart。',
      ],
      whyItMatters: [
        '镜像的自拍视频会让画面中的文字无法阅读。',
        '一些倒装的运动相机需要垂直翻转，而不是旋转。',
        '镜像副本是让舞蹈或健身教程更易跟练的快捷方法。',
      ],
      useCases: [
        {
          title: '取消自拍镜像',
          description: '让文字和标志正确显示。',
        },
        {
          title: '倒装支架',
          description: '翻转倒置相机拍摄的画面。',
        },
        {
          title: '为教程制作镜像',
          description: '镜像示范动作，让观众可以直接照着做。',
        },
        {
          title: '匹配镜头',
          description: '镜像片段，让主体朝向另一侧。',
        },
      ],
      whyMediaManipulator: [
        '翻转和旋转集中在同一个变换部分，并固化到画面帧中。',
        '同一次上传即可修剪、调整尺寸和调色。',
      ],
      privacyNote: '你的视频由我们服务器上的FFmpeg进行水平或垂直镜像。处理在我们自己的服务器上进行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '镜像和翻转有什么区别？',
          answer: '镜像（水平翻转）交换左右。垂直翻转交换上下。',
        },
        {
          question: '翻转是永久的吗？',
          answer: '是的。画面帧在应用翻转后重新编码，因此每个播放器都会显示翻转后的效果。',
        },
        {
          question: '我也可以旋转吗？',
          answer: '可以。旋转位于同一个“变换”部分，你也可以使用专门的“旋转视频”工具。',
        },
        {
          question: '翻转会降低画质吗？',
          answer: '重新编码会有少许损耗；选择高画质即可让损耗微乎其微。',
        },
      ],
      related: [
        {
          label: '旋转视频',
          to: '/tools/rotate-video',
          description: '90°、180°、270°。',
        },
        {
          label: '视频转换器',
          to: '/tools/video-converter',
          description: '在视频格式之间转换。',
        },
        {
          label: '更改视频速度',
          to: '/tools/change-video-speed',
          description: '延时或慢动作。',
        },
        {
          label: '视频倒放',
          to: '/tools/reverse-video',
          description: '倒着播放片段。',
        },
        {
          label: '视频防抖',
          to: '/tools/stabilize-video',
          description: '消除画面抖动。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '缩小文件体积。',
        },
        {
          label: '修剪视频',
          to: '/tools/video-trimmer',
          description: '剪出指定范围。',
        },
      ],
      embed: {
        title: '翻转或镜像视频',
        description: '上传视频。“变换”部分已默认选中水平翻转（镜像）；你可以改为开启垂直翻转，或同时开启两者。同一部分还提供旋转。',
      },
    },
    'stabilize-video': {
      name: '视频防抖',
      h1: '在线免费为抖动视频防抖',
      tagline: '用双通道防抖算法消除手持抖动和行走时的颠簸，无需三脚架，也无需桌面剪辑软件。',
      metaTitle: '在线免费为抖动视频防抖 | Media Manipulator',
      metaDescription: '免费在线视频防抖工具。用FFmpeg运动平滑减少手持抖动和行走颠簸。强度可调，输出MP4，无水印，无需注册。',
      ogTitle: '在线免费为抖动视频防抖',
      ogDescription: '消除任意片段中的相机抖动。免费，无需注册。',
      intro: '手持拍摄的画面会抖，而一点点抖动在大屏幕上会被放大很多。软件防抖会追踪帧与帧之间的运动，平滑相机路径，并从边缘裁掉一点来掩盖修正。Media Manipulator在我们的服务器上运行FFmpeg的运动补偿防抖器，强度可调，让行走vlog或放大拍摄的手机片段明显更稳。',
      whatItDoes: [
        '分析帧间运动并平滑相机路径。',
        '可调节抖动程度（预计会有多少抖动）和精度（搜索有多细致）。',
        '轻微裁切以掩盖修正；缩放会自动应用。',
        '默认导出MP4；可在同一次处理中搭配修剪和调色。',
      ],
      flowSteps: [
        {
          title: '上传抖动的片段',
          description: '任意常见格式。',
        },
        {
          title: '保留或微调强度',
          description: '默认值适合手持手机拍摄的画面。',
        },
        {
          title: '转换',
          description: 'FFmpeg估算并补偿运动。',
        },
        {
          title: '下载',
          description: '对比更稳定的结果。',
        },
      ],
      advancedDetails: [
        '使用FFmpeg的deshake运动补偿滤镜；抖动程度值决定搜索范围，精度决定搜索深度。',
        '防抖无法修复画面帧中已有的运动模糊；它只能消除帧与帧之间的抖动。',
        '边缘会有少量裁切，裁切多少与相机的移动幅度成正比。',
      ],
      whyItMatters: [
        '稳定的画面看起来更专业，也更容易观看。',
        '边走边拍的手机片段是最常见的情况，防抖效果也很好。',
        '防抖后的片段压缩效果更好，因为帧与帧之间变化的画面更少。',
      ],
      useCases: [
        {
          title: '行走vlog',
          description: '消除手持边走边说时的颠簸。',
        },
        {
          title: '放大拍摄的手机视频',
          description: '稳定以最大变焦拍摄的演唱会或野生动物片段。',
        },
        {
          title: '汽车或自行车支架',
          description: '减少仪表盘或车把支架带来的振动。',
        },
        {
          title: '制作GIF之前',
          description: '先防抖，让循环不再抖动。',
        },
      ],
      whyMediaManipulator: [
        '真正的运动补偿，强度参数公开可调，而不是藏起来。',
        '可在同一表单中修剪、变速和调色。',
      ],
      privacyNote: '你的画面由我们服务器上FFmpeg的deshake滤镜分析抖动并进行平滑。处理在我们自己的服务器上进行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '它会裁切我的视频吗？',
          answer: '会稍微裁切。防抖器会移动画面帧以抵消抖动，并略微放大以隐藏移动的边缘。',
        },
        {
          question: '它能修复模糊吗？',
          answer: '不能。帧内的模糊无法消除；防抖只能稳定帧与帧之间的运动。',
        },
        {
          question: '我应该使用什么设置？',
          answer: '先从默认值开始。画面非常颠簸时调高抖动程度；如果结果仍有漂移，就调高精度。',
        },
        {
          question: '它支持4K吗？',
          answer: '支持，但处理时间更长。可以考虑在同一次处理中将尺寸调整为1080p。',
        },
      ],
      related: [
        {
          label: 'AI视频修复',
          to: '/tools/ai-video-restoration',
          description: '用AI降噪、去模糊和放大。',
        },
        {
          label: '视频转换器',
          to: '/tools/video-converter',
          description: '在视频格式之间转换。',
        },
        {
          label: '更改视频速度',
          to: '/tools/change-video-speed',
          description: '延时或慢动作。',
        },
        {
          label: '视频倒放',
          to: '/tools/reverse-video',
          description: '倒着播放片段。',
        },
        {
          label: '翻转视频',
          to: '/tools/flip-video',
          description: '水平或垂直镜像。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '缩小文件体积。',
        },
        {
          label: '修剪视频',
          to: '/tools/video-trimmer',
          description: '剪出指定范围。',
        },
      ],
      embed: {
        title: '视频防抖',
        description: '上传抖动的片段。“时间类效果”部分已默认开启防抖；如果默认效果太弱或裁切太多，请调整抖动程度和精度。',
      },
    },
    'change-video-frame-rate': {
      name: '更改视频帧率',
      h1: '在线更改视频帧率',
      tagline: '将视频转换为24、25、30或60 fps，把60 fps的片段降到30 fps以减小文件体积，或匹配项目的帧率。',
      metaTitle: '在线更改视频帧率（24、30、60 fps） | Media Manipulator',
      metaDescription: '免费在线帧率转换工具。将视频改为24、25、30、50或60 fps，把60 fps降到30以减小文件，或匹配剪辑时间线。输出MP4，无需注册。',
      ogTitle: '在线更改视频帧率',
      ogDescription: '将任意视频转换为24、25、30或60 fps。免费，无需注册。',
      intro: '帧率决定了视频的观感和体积。电影是24 fps，欧洲广播是25，大多数手机是30或60，而在同一条时间线上混用它们会造成画面顿挫。Media Manipulator在我们的服务器上用FFmpeg把任意视频重采样为你需要的帧率，精确地丢弃或重复帧，并导出MP4。当你需要更多帧而不是更少帧时，AI插帧工具会生成中间帧。',
      whatItDoes: [
        '将视频重采样为1至120 fps之间的任意帧率。',
        '把60 fps减半到30，文件体积大幅减小，而大多数内容看不出变化。',
        '在导入剪辑软件前匹配项目帧率（24、25、29.97、30、50、60）。',
        '分辨率、音频和时长保持不变。',
      ],
      flowSteps: [
        {
          title: '上传视频',
          description: '任意常见格式。',
        },
        {
          title: '设置目标fps',
          description: '默认已选30。',
        },
        {
          title: '转换',
          description: 'FFmpeg丢弃或复制帧以匹配目标帧率。',
        },
        {
          title: '下载',
          description: '保存重采样后的MP4。',
        },
      ],
      advancedDetails: [
        '使用fps滤镜：按时间戳丢弃或复制帧，因此时长和音频同步都能精确保持。',
        '提高帧率（30到60）只会复制帧，看起来并不会更流畅；如需真正的新帧，请使用AI插帧。',
        '降低帧率会删除数据且不可逆；请保留原始文件。',
      ],
      whyItMatters: [
        '对大多数内容而言，60 fps的手机片段体积是30 fps的两倍，而可见画质相同。',
        '剪辑时间线中混用帧率会导致卡顿；先统一帧率即可避免。',
        '一些平台和设备会限制或要求特定的帧率。',
      ],
      useCases: [
        {
          title: '缩小60 fps片段',
          description: '降到30 fps，用于电子邮件、聊天或更小的上传。',
        },
        {
          title: '统一帧率以便剪辑',
          description: '让每个片段都匹配项目帧率。',
        },
        {
          title: '电影感',
          description: '转换为24 fps，获得电影般的节奏。',
        },
        {
          title: '广播交付',
          description: '为PAL地区转换为25或50 fps。',
        },
      ],
      whyMediaManipulator: [
        '基于时间戳的精确重采样，时长和音频不受影响。',
        '当你需要更多帧而不是更少帧时，可使用AI插帧。',
      ],
      privacyNote: '你的视频由我们服务器上的FFmpeg按你选择的帧率重新调整时间。处理在我们自己的服务器上进行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '视频会变短或变长吗？',
          answer: '不会。时长保持不变；通过丢弃或重复帧来达到新的帧率。',
        },
        {
          question: '30 fps转60 fps会看起来更流畅吗？',
          answer: '用这个工具不会，因为它只复制帧。请使用AI插帧生成真正的中间帧。',
        },
        {
          question: '我应该选择什么帧率？',
          answer: '大多数网页和手机内容选30 fps，电影感选24，PAL广播选25或50，游戏和体育选60。',
        },
        {
          question: '音频会受影响吗？',
          answer: '不会。音频流会按相同的时间复制或重新编码。',
        },
      ],
      related: [
        {
          label: 'AI插帧',
          to: '/tools/ai-frame-interpolation',
          description: '生成帧，最高可达120 fps。',
        },
        {
          label: '视频转换器',
          to: '/tools/video-converter',
          description: '在视频格式之间转换。',
        },
        {
          label: '更改视频速度',
          to: '/tools/change-video-speed',
          description: '延时或慢动作。',
        },
        {
          label: '视频倒放',
          to: '/tools/reverse-video',
          description: '倒着播放片段。',
        },
        {
          label: '翻转视频',
          to: '/tools/flip-video',
          description: '水平或垂直镜像。',
        },
        {
          label: '视频防抖',
          to: '/tools/stabilize-video',
          description: '消除画面抖动。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '缩小文件体积。',
        },
        {
          label: '修剪视频',
          to: '/tools/video-trimmer',
          description: '剪出指定范围。',
        },
      ],
      embed: {
        title: '更改视频帧率',
        description: '上传视频，并在“时间类效果”部分设置目标帧率；默认已选30 fps。系统会丢弃或复制帧以达到目标帧率。如需更高帧率并生成中间帧，请改用AI插帧。',
      },
    },
    'adjust-video-color': {
      name: '调整视频亮度与色彩',
      h1: '在线调整视频亮度、对比度和色彩',
      tagline: '提亮偏暗的片段，增加对比度和饱和度，调整色相，或应用模糊和艺术效果，带滑块和实时预览。',
      metaTitle: '在线调整视频亮度、对比度和饱和度 | Media Manipulator',
      metaDescription: '免费在线视频调色工具。修正亮度、对比度、饱和度、色相、伽马和曝光，添加模糊或锐化，或应用艺术风格。输出MP4，无水印，无需注册。',
      ogTitle: '在线调整视频亮度和色彩',
      ogDescription: '为任意片段提亮、增加对比度、增强色彩或应用风格。免费，无需注册。',
      intro: '在室内拍摄的片段又暗又偏橙；平淡的手机视频需要更多对比度和色彩；用作缩略图的片段需要风格化的效果。Media Manipulator在我们的服务器上用FFmpeg进行亮度、对比度、饱和度、色相、伽马和曝光校正，同时提供模糊、锐化、颗粒和一系列艺术滤镜，并导出MP4。无需打开剪辑软件，就能完成一次色彩校正。',
      whatItDoes: [
        '亮度、对比度、饱和度和色相滑块，范围从-100到+100。',
        '伽马、曝光、阴影和高光，用于更精细的色调控制。',
        '高斯模糊和运动模糊、USM锐化、胶片颗粒和噪点。',
        '油画、素描和复古等艺术风格。',
        '可在同一次处理中搭配修剪、调整尺寸、变速或翻转。',
      ],
      flowSteps: [
        {
          title: '上传片段',
          description: '任意常见格式。',
        },
        {
          title: '拖动滑块',
          description: '亮度、对比度、饱和度、色相等。',
        },
        {
          title: '转换',
          description: 'FFmpeg应用eq和效果滤镜。',
        },
        {
          title: '下载',
          description: '保存调色后的MP4。',
        },
      ],
      advancedDetails: [
        '亮度、对比度、饱和度和伽马映射到FFmpeg的eq滤镜；色相使用以度为单位的hue滤镜。',
        '锐化使用带半径、强度和阈值的unsharp滤镜；模糊使用gblur或定向运动模糊。',
        '如需3D LUT、色度键或在时间线上逐片段调色，请使用Darkroom。',
      ],
      whyItMatters: [
        '大多数手机拍摄的画面只要稍微提高对比度和饱和度就会更好看。',
        '在上传前修正曝光，可以避免平台的重新编码让画面变得更糟。',
        '片段之间统一的风格让剪辑成品更显完整。',
      ],
      useCases: [
        {
          title: '提亮偏暗的片段',
          description: '提高室内画面的曝光和阴影。',
        },
        {
          title: '让平淡的片段更鲜明',
          description: '为看起来像log的手机视频增加对比度和饱和度。',
        },
        {
          title: '修正偏色',
          description: '调整色相，去除偏橙或偏绿的色调。',
        },
        {
          title: '为社交媒体风格化',
          description: '应用复古、素描或油画风格。',
        },
      ],
      whyMediaManipulator: [
        '色调、色彩和效果控制集中在一个部分，而不是只有一个“增强”按钮。',
        '需要更多功能时，可使用Darkroom在时间线上用LUT调色。',
      ],
      privacyNote: '你的视频的亮度、对比度、饱和度和伽马由我们服务器上的FFmpeg调整。处理在我们自己的服务器上进行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '我可以预览结果吗？',
          answer: '滑块会显示数值；完整的调色效果在转换时应用。先修剪出几秒钟快速测试，再处理整个片段。',
        },
        {
          question: '我可以应用LUT吗？',
          answer: '这里不行。我们的多轨编辑器Darkroom支持3D LUT和逐片段调色。',
        },
        {
          question: '这能修复过曝的画面吗？',
          answer: '它可以压低高光，但已经截断为纯白的细节无法恢复。',
        },
        {
          question: '我可以锐化不够清晰的片段吗？',
          answer: '可以。使用USM锐化控件；如需真正恢复细节，请试试AI视频修复。',
        },
      ],
      related: [
        {
          label: 'Darkroom视频编辑器',
          to: '/tools/content-studio',
          description: '在时间线上用LUT调色。',
        },
        {
          label: 'AI视频修复',
          to: '/tools/ai-video-restoration',
          description: '用AI降噪和放大。',
        },
        {
          label: '视频转换器',
          to: '/tools/video-converter',
          description: '在视频格式之间转换。',
        },
        {
          label: '更改视频速度',
          to: '/tools/change-video-speed',
          description: '延时或慢动作。',
        },
        {
          label: '视频倒放',
          to: '/tools/reverse-video',
          description: '倒着播放片段。',
        },
        {
          label: '翻转视频',
          to: '/tools/flip-video',
          description: '水平或垂直镜像。',
        },
        {
          label: '视频防抖',
          to: '/tools/stabilize-video',
          description: '消除画面抖动。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '缩小文件体积。',
        },
        {
          label: '修剪视频',
          to: '/tools/video-trimmer',
          description: '剪出指定范围。',
        },
      ],
      embed: {
        title: '调整视频色彩',
        description: '上传片段。“视觉效果”部分会显示亮度、对比度、饱和度、色相、伽马和曝光滑块，以及模糊、锐化、噪点和艺术风格。导出MP4。',
      },
    },
    'convert-video-to-hevc': {
      name: '将视频转换为HEVC（H.265）',
      h1: '在线将视频转换为HEVC / H.265',
      tagline: '将任意视频重新编码为H.265，在相同画质下文件大小约为H.264的一半，适合存储、4K和新款设备。',
      metaTitle: '在线免费将视频转换为HEVC（H.265） | Media Manipulator',
      metaDescription: '免费在线H.265 / HEVC转换工具。将MP4、MOV、MKV或WebM重新编码为HEVC，在相同画质下体积约减半。可选择画质预设。无水印，无需注册。',
      ogTitle: '在线将视频转换为HEVC / H.265',
      ogDescription: '用H.265将视频体积减半。免费，无需注册。',
      intro: 'HEVC又称H.265，是H.264的继任者。在相同视觉画质下，它所需的码率大约少40%至50%，这就是手机用它录制4K的原因，也是它成为归档素材首选格式的原因。Media Manipulator在我们的服务器上用FFmpeg的x265编码器，按你选择的画质等级将任意视频重新编码为HEVC，封装在iPhone、Mac、Windows 10+、Android和现代电视都能播放的MP4容器中。',
      whatItDoes: [
        '将任意输入视频重新编码为MP4容器中的H.265。',
        '三种画质预设对应不同的CRF值；与H.264相比，文件大小大约减半。',
        '保持分辨率和帧率；可选择将4K缩小到1080p，让文件小得多。',
        '音频重新编码为AAC。',
      ],
      flowSteps: [
        {
          title: '上传视频',
          description: '任意常见格式，包括H.264 MP4。',
        },
        {
          title: '选择画质',
          description: '最小、均衡或高画质。',
        },
        {
          title: '转换',
          description: 'x265在我们的服务器上编码；比H.264慢。',
        },
        {
          title: '下载',
          description: '保存内含HEVC的.mp4文件。',
        },
      ],
      advancedDetails: [
        '使用libx265编码，CRF为28（均衡）、32（最小）或24（高画质），采用medium预设，并添加hvc1标签以兼容Apple设备。',
        'HEVC编码比H.264慢好几倍；较长的4K文件需要几分钟。',
        '浏览器：Safari和Edge可以播放HEVC；Chrome和Firefox通常不行。网页嵌入请保留H.264。',
      ],
      whyItMatters: [
        '相同画质只需一半存储空间，在整个媒体库中累积起来相当可观。',
        '在大多数设备上，4K和HDR交付都以HEVC为标准。',
        '更小的文件上传和同步更快。',
      ],
      useCases: [
        {
          title: '归档素材',
          description: '将相机胶卷的体积减半，且没有可见损失。',
        },
        {
          title: '分享4K',
          description: '让4K片段小到足以发送。',
        },
        {
          title: 'Apple生态',
          description: '与iPhone本来就录制的HEVC文件保持一致。',
        },
        {
          title: '释放硬盘空间',
          description: '将旧的H.264录像转换为HEVC。',
        },
      ],
      whyMediaManipulator: [
        'x265搭配合理的CRF预设和兼容Apple的标签。',
        '如果你需要H.264、VP9或AV1，同一面板也能压缩为这些格式。',
      ],
      privacyNote: '你的视频由我们服务器上的FFmpeg重新编码为H.265（HEVC）。处理在我们自己的服务器上进行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: 'HEVC在任何地方都能播放吗？',
          answer: 'iPhone、Mac、Windows 10+、Android 5+、现代电视以及Safari/Edge都能播放。Chrome、Firefox和旧设备通常不行；请为它们保留H.264。',
        },
        {
          question: '文件会小多少？',
          answer: '在相同画质下，通常比H.264小40%至50%；内容简单时会更小。',
        },
        {
          question: '画质会变差吗？',
          answer: '使用均衡预设时，大多数内容看不出差别。对于还要再次剪辑的素材，请选择高画质。',
        },
        {
          question: '为什么这么慢？',
          answer: 'x265每帧所做的工作比x264多得多。这是换取更小文件的代价。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'HEVC编码非常消耗CPU；较长或4K的源文件预计需要几分钟。',
        ],
      },
      related: [
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: 'H.264、VP9或AV1压缩。',
        },
        {
          label: '视频转换器',
          to: '/tools/video-converter',
          description: '标准H.264 MP4。',
        },
        {
          label: '视频转换器',
          to: '/tools/video-converter',
          description: '在视频格式之间转换。',
        },
        {
          label: '更改视频速度',
          to: '/tools/change-video-speed',
          description: '延时或慢动作。',
        },
        {
          label: '视频倒放',
          to: '/tools/reverse-video',
          description: '倒着播放片段。',
        },
        {
          label: '翻转视频',
          to: '/tools/flip-video',
          description: '水平或垂直镜像。',
        },
        {
          label: '视频防抖',
          to: '/tools/stabilize-video',
          description: '消除画面抖动。',
        },
        {
          label: '修剪视频',
          to: '/tools/video-trimmer',
          description: '剪出指定范围。',
        },
      ],
      embed: {
        title: '将视频转换为HEVC',
        description: '上传视频。编解码器已设为MP4容器中的H.265，并使用均衡预设；你也可以改选最小或高画质。旧设备和部分浏览器无法播放HEVC；请为它们保留一份H.264副本。',
      },
    },
    'convert-audio-to-wav': {
      name: '将音频转换为WAV',
      h1: '在线免费将音频转换为WAV',
      tagline: '将MP3、M4A、WAV、OGG、FLAC等任意音频文件无损转换为WAV。',
      metaTitle: '在线免费将音频转换为WAV | Media Manipulator',
      metaDescription: '免费在线音频转WAV工具。上传MP3、WAV、M4A、OGG、FLAC或AAC，下载WAV。无损输出。无水印，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将音频转换为WAV',
      ogDescription: '上传任意音频文件并下载WAV。无损。免费，无需注册。',
      intro: 'WAV是未压缩的PCM音频：每个采样都按原样存储，因此不会有任何损失，所有编辑器、DAW和采样器都能立即打开。Media Manipulator一次上传即可将任何常见音频格式转换为WAV，除非你更改，否则保留原有的采样率和声道布局，并在同一表单中提供修剪、标准化、均衡器和AI清理工具。',
      whatItDoes: [
        '将MP3、WAV、M4A/AAC、OGG、Opus、FLAC、ALAC、AC3和WMA转换为WAV。',
        '保留每一个采样：输出解码后与输入完全一致。',
        '写入PCM之前，可以应用修剪、音量、标准化、均衡器和效果。',
        'AI清理也在同一表单中：在保存为WAV之前去除背景噪音、清理语音，或提取或去除人声。',
      ],
      flowSteps: [
        {
          title: '上传音频',
          description: '任意常见音频文件，无论是否压缩。',
        },
        {
          title: '按需调整',
          description: '修剪、标准化或应用效果。',
        },
        {
          title: '转换',
          description: 'FFmpeg在我们的服务器上编码WAV。',
        },
        {
          title: '下载',
          description: '保存WAV文件。',
        },
      ],
      advancedDetails: [
        'WAV输出使用FFmpeg原生的pcm_s16le编码器，以源文件的采样率编码。',
        '将有损的MP3转换为WAV并不能恢复MP3编码器丢弃的细节；它只能防止进一步的损失。',
        'MP3或M4A源文件中的专辑封面会被识别为静态图片，因此验证时不会把文件误认为视频。',
      ],
      whyItMatters: [
        '编辑或母带处理：WAV是音频编辑器需要的格式，无需解码步骤，也不会有代际损失。',
        '归档母带或现场录音。',
        '需要PCM的采样器、游戏引擎和广播系统。',
      ],
      useCases: [
        {
          title: '为设备切换格式',
          description: '为需要WAV的播放器制作一份WAV副本。',
        },
        {
          title: '为编辑做准备',
          description: '将无损文件交给DAW或视频编辑器。',
        },
        {
          title: '一次一个文件',
          description: '把一整个文件夹的语音备忘录逐个转换为WAV，边转换边修剪。',
        },
        {
          title: '顺便清理',
          description: '在制作未压缩母带的过程中，去除现场录音中的嘶嘶声。',
        },
      ],
      whyMediaManipulator: [
        '除非你另行选择，否则保留采样率和声道布局。',
        '在生成WAV的同一次上传中对录音进行标准化和修剪。',
      ],
      privacyNote: '你的音频由我们服务器上的FFmpeg解码，并写出为未压缩的PCM WAV。不涉及任何外部音频服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你会得到一个新文件；上传的文件本身不会被更改。',
      faq: [
        {
          question: '什么是WAV？',
          answer: 'WAV是未压缩的PCM音频：每个采样都按原样存储，因此不会有任何损失，所有编辑器、DAW和采样器都能立即打开。',
        },
        {
          question: '转换为WAV会改善音质吗？',
          answer: '不会。将有损的MP3转换为WAV并不能恢复MP3编码器丢弃的细节；它只能防止进一步的损失。',
        },
        {
          question: '转换为WAV时可以修剪音频吗？',
          answer: '可以。在修剪部分设置开始和结束时间，只有该区间会写入WAV。',
        },
        {
          question: '我的MP3带有专辑封面。它还能转换为WAV吗？',
          answer: '可以。封面会被识别为图片而不是视频轨道，因此上传会被接受，音频也会照常解码为PCM。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '无损输出；文件大小取决于时长和采样率。',
        ],
      },
      related: [
        {
          label: '音频转换器',
          to: '/tools/audio-converter',
          description: '在所有常见音频格式之间转换。',
        },
        {
          label: '更改音频速度',
          to: '/tools/change-audio-speed',
          description: '加速或减速录音。',
        },
        {
          label: '更改音频音高',
          to: '/tools/change-audio-pitch',
          description: '升高或降低音调。',
        },
        {
          label: '音频标准化',
          to: '/tools/normalize-audio',
          description: '使响度保持均衡。',
        },
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: 'AI降噪。',
        },
        {
          label: '去除歌曲人声',
          to: '/tools/remove-vocals-from-song',
          description: '制作伴奏。',
        },
      ],
      embed: {
        title: '将音频转换为WAV',
        description: '上传任意音频文件。输出格式锁定为WAV；除非你更改，否则采样率和声道保持不变，然后点击“转换”。',
      },
    },
    'convert-audio-to-flac': {
      name: '将音频转换为FLAC',
      h1: '在线免费将音频转换为FLAC',
      tagline: '将MP3、M4A、WAV、OGG、FLAC等任意音频文件无损转换为FLAC。',
      metaTitle: '在线免费将音频转换为FLAC | Media Manipulator',
      metaDescription: '免费在线音频转FLAC工具。上传MP3、WAV、M4A、OGG、FLAC或AAC，下载FLAC。无损输出。无水印，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将音频转换为FLAC',
      ogDescription: '上传任意音频文件，下载FLAC。无损。免费，无需注册。',
      intro: 'FLAC能在不损失任何信息的情况下压缩音频，通常可压缩到WAV大小的50%到70%，解码后得到逐位相同的副本。Media Manipulator只需一次上传即可将任意常见音频格式转换为FLAC，除非你更改，否则会保留采样率和声道布局，并在同一表单中提供裁剪、标准化、均衡器和AI清理工具。',
      whatItDoes: [
        '将MP3、WAV、M4A/AAC、OGG、Opus、FLAC、ALAC、AC3和WMA转换为FLAC。',
        '保留每一个采样：输出解码后与输入完全一致。',
        '可在FLAC压缩结果之前调整音量、裁剪、标准化和应用均衡器。',
        '如果你想要一份经过清理的无损副本，降噪、人声清理和人声分离可以在同一次上传中运行。',
      ],
      flowSteps: [
        {
          title: '上传音频',
          description: 'WAV、AIFF类PCM、MP3、M4A等格式。',
        },
        {
          title: '按需调整',
          description: '裁剪、标准化或应用效果。',
        },
        {
          title: '转换',
          description: 'FFmpeg在我们的服务器上编码FLAC。',
        },
        {
          title: '下载',
          description: '保存FLAC文件。',
        },
      ],
      advancedDetails: [
        'FLAC输出由FFmpeg的原生flac编码器按源采样率编码。',
        '由MP3制作的FLAC不会比MP3更好；FLAC只会保留已有的内容。',
        '嵌入封面图的MP3或M4A可以通过验证：封面图会被视为图片，而不是视频流。',
      ],
      whyItMatters: [
        '无损音乐库，只占WAV一半的空间。',
        '把母带发给合作者，无需附上100 MB的附件。',
        '长期归档，校验和内置于格式之中。',
      ],
      useCases: [
        {
          title: '为设备切换格式',
          description: '为需要该格式的播放器制作一份FLAC副本。',
        },
        {
          title: '为编辑做准备',
          description: '把无损文件交给DAW或视频编辑软件。',
        },
        {
          title: '一次一个文件',
          description: '每次上传一个，将一组录音无损归档。',
        },
        {
          title: '顺手清理',
          description: '先去除背景噪音，再将清理后的结果保存为FLAC。',
        },
      ],
      whyMediaManipulator: [
        '选择采样率或声道布局，也可以让两者都与源文件保持一致。',
        '一步完成：把音量偏小的母带调匀，并归档为FLAC。',
      ],
      privacyNote: '你的音频由我们服务器上的FFmpeg无损压缩为FLAC。不涉及任何外部音频服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你会得到一个新文件；上传的文件本身不会被更改。',
      faq: [
        {
          question: '什么是FLAC？',
          answer: 'FLAC能在不损失任何信息的情况下压缩音频，通常可压缩到WAV大小的50%到70%，解码后得到逐位相同的副本。',
        },
        {
          question: '转换为FLAC会改善音质吗？',
          answer: '不会。由MP3制作的FLAC不会比MP3更好；FLAC只会保留已有的内容。',
        },
        {
          question: '转换为FLAC时可以裁剪音频吗？',
          answer: '可以。在裁剪部分设置开始和结束位置，FLAC只会编码这一范围。',
        },
        {
          question: '带封面图的MP3能转换为FLAC吗？',
          answer: '可以。嵌入的封面图会被识别为图片而不是视频，因此能通过验证，音频也会照常编码。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '无损输出；文件大小取决于时长和采样率。',
        ],
      },
      related: [
        {
          label: '音频转换器',
          to: '/tools/audio-converter',
          description: '在所有常见音频格式之间互相转换。',
        },
        {
          label: '更改音频速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢录音。',
        },
        {
          label: '更改音频音高',
          to: '/tools/change-audio-pitch',
          description: '升高或降低调性。',
        },
        {
          label: '音频标准化',
          to: '/tools/normalize-audio',
          description: '让响度保持均衡。',
        },
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: 'AI降噪。',
        },
        {
          label: '去除歌曲人声',
          to: '/tools/remove-vocals-from-song',
          description: '制作伴奏。',
        },
      ],
      embed: {
        title: '将音频转换为FLAC',
        description: '上传任意音频文件。输出格式固定为FLAC；除非你更改，否则会保留采样率和声道，然后点击“转换”。',
      },
    },
    'convert-audio-to-ogg': {
      name: '将音频转换为OGG',
      h1: '在线免费将音频转换为OGG',
      tagline: '将MP3、M4A、WAV、OGG、FLAC等任意音频文件按你选择的比特率转换为OGG。',
      metaTitle: '在线免费将音频转换为OGG | Media Manipulator',
      metaDescription: '免费在线音频转OGG工具。上传MP3、WAV、M4A、OGG、FLAC或AAC，下载OGG。可选择比特率。无水印，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将音频转换为OGG',
      ogDescription: '上传任意音频文件，下载OGG。可选择比特率。免费，无需注册。',
      intro: 'OGG Vorbis是一种免费、不受专利限制的有损格式，在相同比特率下音质优于MP3，并且浏览器、Android和游戏引擎都原生支持。Media Manipulator只需一次上传即可将任意常见音频格式转换为OGG，除非你更改，否则会保留采样率和声道布局，并在同一表单中提供裁剪、标准化、均衡器和AI清理工具。',
      whatItDoes: [
        '将MP3、WAV、M4A/AAC、OGG、Opus、FLAC、ALAC、AC3和WMA转换为OGG。',
        '可选择比特率、采样率和声道布局。',
        '裁剪、音量、响度标准化和均衡器与Vorbis编码在同一次FFmpeg处理中完成。',
        '在Vorbis编码器运行之前，先用AI清理人声或去除背景噪音。',
      ],
      flowSteps: [
        {
          title: '上传音频',
          description: '为你的游戏或网站准备的MP3、WAV、FLAC或其他音频文件。',
        },
        {
          title: '按需调整',
          description: '选择比特率；裁剪或应用效果。',
        },
        {
          title: '转换',
          description: 'FFmpeg在我们的服务器上编码OGG。',
        },
        {
          title: '下载',
          description: '保存OGG文件。',
        },
      ],
      advancedDetails: [
        'OGG输出使用FFmpeg的libvorbis编码器；默认192 kbps，对音乐来说是稳妥的选择。',
        'Apple设备和部分车载音响无法播放OGG；这类设备请使用M4A或MP3。',
        '源文件中的封面图会被识别为图片附件，不会触发视频轨道检查。',
      ],
      whyItMatters: [
        '游戏和应用的音效素材，文件小巧、解码免版税都很重要。',
        '无需许可即可在Firefox和Chrome中播放的网页音频。',
        '供Linux和Android播放器使用的播客或音乐文件。',
      ],
      useCases: [
        {
          title: '为设备切换格式',
          description: '为需要该格式的播放器制作一份OGG副本。',
        },
        {
          title: '为编辑做准备',
          description: '为项目制作一个小巧、兼容的文件。',
        },
        {
          title: '一次一个文件',
          description: '逐个为游戏引擎准备音效。',
        },
        {
          title: '顺手清理',
          description: '在录音作为OGG素材交付之前去除其中的嗡嗡声。',
        },
      ],
      whyMediaManipulator: [
        '每个OGG的比特率、采样率和声道都由你设置。',
        '在音效转为OGG的同时裁掉其中的静音。',
      ],
      privacyNote: '你的音频由我们服务器上的FFmpeg编码为OGG Vorbis。不涉及任何外部音频服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你会得到一个新文件；上传的文件本身不会被更改。',
      faq: [
        {
          question: '什么是OGG？',
          answer: 'OGG Vorbis是一种免费、不受专利限制的有损格式，在相同比特率下音质优于MP3，并且浏览器、Android和游戏引擎都原生支持。',
        },
        {
          question: '转换为OGG会改善音质吗？',
          answer: '不会。Apple设备和部分车载音响无法播放OGG；这类设备请使用M4A或MP3。',
        },
        {
          question: '转换为OGG时可以裁剪音频吗？',
          answer: '可以。标记开始和结束位置，OGG只会包含这一部分。',
        },
        {
          question: '可以将带专辑封面的M4A转换为OGG吗？',
          answer: '可以。封面会被视为图片附件而不是视频轨道，因此任务会继续进行，并生成仅含音频的Vorbis文件。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '有损输出；文件大小由你选择的比特率决定。',
        ],
      },
      related: [
        {
          label: '音频转换器',
          to: '/tools/audio-converter',
          description: '在所有常见音频格式之间互相转换。',
        },
        {
          label: '更改音频速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢录音。',
        },
        {
          label: '更改音频音高',
          to: '/tools/change-audio-pitch',
          description: '升高或降低调性。',
        },
        {
          label: '音频标准化',
          to: '/tools/normalize-audio',
          description: '让响度保持均衡。',
        },
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: 'AI降噪。',
        },
        {
          label: '去除歌曲人声',
          to: '/tools/remove-vocals-from-song',
          description: '制作伴奏。',
        },
      ],
      embed: {
        title: '将音频转换为OGG',
        description: '上传任意音频文件。输出格式固定为OGG；选择比特率、采样率和声道，然后点击“转换”。',
      },
    },
    'convert-audio-to-m4a': {
      name: '将音频转换为M4A / AAC',
      h1: '在线免费将音频转换为M4A / AAC',
      tagline: '将MP3、M4A、WAV、OGG、FLAC等任意音频文件按你选择的比特率转换为M4A / AAC。',
      metaTitle: '在线免费将音频转换为M4A / AAC | Media Manipulator',
      metaDescription: '免费在线音频转M4A / AAC工具。上传MP3、WAV、M4A、OGG、FLAC或AAC，下载M4A / AAC。可选择比特率。无水印，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将音频转换为M4A / AAC',
      ogDescription: '上传任意音频文件，下载M4A / AAC。可选择比特率。免费，无需注册。',
      intro: 'M4A是封装在MP4容器中的AAC音频，也是Apple Music、iPhone、YouTube和大多数流媒体服务使用的格式。按每千字节的音质计算，它胜过MP3。Media Manipulator只需一次上传即可将任意常见音频格式转换为M4A / AAC，除非你更改，否则会保留采样率和声道布局，并在同一表单中提供裁剪、标准化、均衡器和AI清理工具。',
      whatItDoes: [
        '将MP3、WAV、M4A/AAC、OGG、Opus、FLAC、ALAC、AC3和WMA转换为M4A / AAC。',
        '可选择比特率、采样率和声道布局。',
        '裁剪、增益、标准化、均衡器和效果与AAC在同一次编码中完成。',
        '在写入AAC之前，表单中的AI工具可以清理语音备忘录或去除人声。',
      ],
      flowSteps: [
        {
          title: '上传音频',
          description: 'WAV母带、MP3或语音备忘录。',
        },
        {
          title: '按需调整',
          description: '选择比特率；裁剪或应用效果。',
        },
        {
          title: '转换',
          description: 'FFmpeg在我们的服务器上编码M4A / AAC。',
        },
        {
          title: '下载',
          description: '保存M4A / AAC文件。',
        },
      ],
      advancedDetails: [
        'M4A / AAC输出使用FFmpeg的aac编码器；默认192 kbps，对音乐来说是稳妥的选择。',
        '部分只支持MP3的老式播放器和车载主机无法读取AAC。',
        '嵌入的专辑封面会被识别为图片，绝不会被误认为视频轨道。',
      ],
      whyItMatters: [
        '用于iPhone、iPad和Mac的音乐和语音备忘录。',
        '之后要合并进MP4视频的音轨。',
        '播客和有声书：支持章节标记，文件也比MP3更小。',
      ],
      useCases: [
        {
          title: '为设备切换格式',
          description: '为需要该格式的播放器制作一份M4A / AAC副本。',
        },
        {
          title: '为编辑做准备',
          description: '为项目制作一个小巧、兼容的文件。',
        },
        {
          title: '一次一个文件',
          description: '为iPhone资料库转换语音备忘录，同时顺手剪掉空白片段。',
        },
        {
          title: '顺手清理',
          description: '对一段播客录音进行人声清理，并直接保存为M4A。',
        },
      ],
      whyMediaManipulator: [
        'AAC输出的比特率、采样率和声道数均可调整。',
        '将一期节目标准化并转为M4A，无需再次上传。',
      ],
      privacyNote: '你的音频由我们服务器上的FFmpeg编码为M4A文件中的AAC。不涉及任何外部音频服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你会得到一个新文件；上传的文件本身不会被更改。',
      faq: [
        {
          question: '什么是M4A / AAC？',
          answer: 'M4A是封装在MP4容器中的AAC音频，也是Apple Music、iPhone、YouTube和大多数流媒体服务使用的格式。按每千字节的音质计算，它胜过MP3。',
        },
        {
          question: '转换为M4A / AAC会改善音质吗？',
          answer: '不会。部分只支持MP3的老式播放器和车载主机无法读取AAC。',
        },
        {
          question: '转换为M4A / AAC时可以裁剪音频吗？',
          answer: '可以。在裁剪部分设置范围；M4A会在你指定的位置开始和结束。',
        },
        {
          question: '我MP3中的专辑封面会导致转换为M4A失败吗？',
          answer: '不会。封面图流会被识别为图片而不是视频，AAC编码照常进行。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '有损输出；文件大小由你选择的比特率决定。',
        ],
      },
      related: [
        {
          label: '音频转换器',
          to: '/tools/audio-converter',
          description: '在所有常见音频格式之间互相转换。',
        },
        {
          label: '更改音频速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢录音。',
        },
        {
          label: '更改音频音高',
          to: '/tools/change-audio-pitch',
          description: '升高或降低调性。',
        },
        {
          label: '音频标准化',
          to: '/tools/normalize-audio',
          description: '让响度保持均衡。',
        },
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: 'AI降噪。',
        },
        {
          label: '去除歌曲人声',
          to: '/tools/remove-vocals-from-song',
          description: '制作伴奏。',
        },
      ],
      embed: {
        title: '将音频转换为M4A / AAC',
        description: '上传任意音频文件。输出格式固定为M4A / AAC；选择比特率、采样率和声道，然后点击“转换”。',
      },
    },
    'convert-audio-to-opus': {
      name: '将音频转换为Opus',
      h1: '在线免费将音频转换为Opus',
      tagline: '将MP3、M4A、WAV、OGG、FLAC等任意音频文件按你选择的比特率转换为Opus。',
      metaTitle: '在线免费将音频转换为Opus | Media Manipulator',
      metaDescription: '免费在线音频转Opus工具。上传MP3、WAV、M4A、OGG、FLAC或AAC，下载Opus。可选择比特率。无水印，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将音频转换为Opus',
      ogDescription: '上传任意音频文件，下载Opus。可选择比特率。免费，无需注册。',
      intro: 'Opus是最新的开放编解码器，也是低比特率下语音和音乐的最佳有损选择：64 kbps的Opus听起来相当于128 kbps的MP3。WhatsApp、Discord和WebRTC使用的正是它。Media Manipulator只需一次上传即可将任意常见音频格式转换为Opus，除非你更改，否则会保留采样率和声道布局，并在同一表单中提供裁剪、标准化、均衡器和AI清理工具。',
      whatItDoes: [
        '将MP3、WAV、M4A/AAC、OGG、Opus、FLAC、ALAC、AC3和WMA转换为Opus。',
        '可选择比特率、采样率和声道布局。',
        '裁剪、音量、标准化和均衡器与Opus编码在同一次处理中完成。',
        '编码之前，表单可以在我们的GPU上用AI去除背景噪音或清理语音。',
      ],
      flowSteps: [
        {
          title: '上传音频',
          description: '语音消息、播客、音乐或任何常见音频。',
        },
        {
          title: '按需调整',
          description: '选择比特率；裁剪或应用效果。',
        },
        {
          title: '转换',
          description: 'FFmpeg在我们的服务器上编码Opus。',
        },
        {
          title: '下载',
          description: '保存Opus文件。',
        },
      ],
      advancedDetails: [
        'Opus输出使用FFmpeg的libopus编码器；默认192 kbps，对音乐来说是稳妥的选择。',
        'iTunes、较旧的Apple设备和许多硬件播放器不支持Opus；这类设备请选择M4A。',
        '源文件中的专辑封面会被检测为图片，不会中断转换。',
      ],
      whyItMatters: [
        '语音消息、播客和有声书，体积只有原来的一小部分。',
        '在带宽紧张的场景中串流或嵌入音频。',
        '原生支持Opus的Discord、Matrix和消息机器人。',
      ],
      useCases: [
        {
          title: '为设备切换格式',
          description: '为需要该格式的播放器制作一份Opus副本。',
        },
        {
          title: '为编辑做准备',
          description: '为项目制作一个小巧、兼容的文件。',
        },
        {
          title: '一次一个文件',
          description: '将一系列讲座逐个压缩为Opus。',
        },
        {
          title: '顺手清理',
          description: '清理嘈杂的通话录音，并保存为小巧的Opus文件。',
        },
      ],
      whyMediaManipulator: [
        '选择Opus的比特率、采样率和声道，或保留默认值。',
        '在语音消息转为Opus的过程中完成裁剪和标准化。',
      ],
      privacyNote: '你的音频由我们服务器上的FFmpeg编码为Opus。不涉及任何外部音频服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你会得到一个新文件；上传的文件本身不会被更改。',
      faq: [
        {
          question: '什么是Opus？',
          answer: 'Opus是最新的开放编解码器，也是低比特率下语音和音乐的最佳有损选择：64 kbps的Opus听起来相当于128 kbps的MP3。WhatsApp、Discord和WebRTC使用的正是它。',
        },
        {
          question: '转换为Opus会改善音质吗？',
          answer: '不会。iTunes、较旧的Apple设备和许多硬件播放器不支持Opus；这类设备请选择M4A。',
        },
        {
          question: '转换为Opus时可以裁剪音频吗？',
          answer: '可以。只有你设置的开始和结束之间的部分会被编码为Opus。',
        },
        {
          question: '带封面图的音频文件能转换为Opus吗？',
          answer: '可以。封面图会被检测为图片而不是视频流，因此文件会被接受，并且只编码音频。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '有损输出；文件大小由你选择的比特率决定。',
        ],
      },
      related: [
        {
          label: '音频转换器',
          to: '/tools/audio-converter',
          description: '在所有常见音频格式之间互相转换。',
        },
        {
          label: '更改音频速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢录音。',
        },
        {
          label: '更改音频音高',
          to: '/tools/change-audio-pitch',
          description: '升高或降低调性。',
        },
        {
          label: '音频标准化',
          to: '/tools/normalize-audio',
          description: '让响度保持均衡。',
        },
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: 'AI降噪。',
        },
        {
          label: '去除歌曲人声',
          to: '/tools/remove-vocals-from-song',
          description: '制作伴奏。',
        },
      ],
      embed: {
        title: '将音频转换为Opus',
        description: '上传任意音频文件。输出格式固定为Opus；选择比特率、采样率和声道，然后点击“转换”。',
      },
    },
    'convert-mp3-to-wav': {
      name: '将MP3转换为WAV',
      h1: '在线免费将MP3转换为WAV',
      tagline: '将MP3转换为未压缩的WAV，用于编辑、采样或刻录CD。',
      metaTitle: '在线免费将MP3转换为WAV | Media Manipulator',
      metaDescription: '免费在线MP3转WAV工具。上传MP3，下载保持原始采样率的未压缩16位PCM WAV。无水印，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将MP3转换为WAV',
      ogDescription: '输入MP3，输出未压缩的WAV。免费，无需注册。',
      intro: '音频编辑器、采样器和CD刻录软件需要未压缩的PCM，一些较旧的工具则完全不接受MP3。转换为WAV只需将MP3解码一次，之后编辑时就不会再损失音质。Media Manipulator在我们的服务器上用FFmpeg完成转换，保留原始采样率和声道，并会忽略嵌入的专辑封面，而不会把它误认为视频轨道。',
      whatItDoes: [
        '将MP3解码为16位PCM WAV，保持源采样率和声道布局。',
        '可在同一次处理中选择裁剪、标准化、淡入淡出和均衡器。',
        '支持带有嵌入封面图和ID3标签的MP3。',
      ],
      flowSteps: [
        {
          title: '上传MP3',
          description: '任意比特率，有无封面图均可。',
        },
        {
          title: '按需调整',
          description: '裁剪、标准化、均衡器。',
        },
        {
          title: '转换',
          description: 'FFmpeg将其解码为PCM。',
        },
        {
          title: '下载',
          description: '保存WAV。',
        },
      ],
      advancedDetails: [
        'WAV输出为pcm_s16le；44.1 kHz立体声音频每分钟约10 MB。',
        '解码无法找回MP3编码器丢弃的内容；它只能防止进一步的损失。',
      ],
      whyItMatters: [
        '编辑MP3后再次保存为MP3，每次都会损失音质；WAV可以避免这一点。',
        '采样器、DAW和CD刻录软件需要PCM。',
      ],
      useCases: [
        {
          title: '在DAW中编辑',
          description: '导入时无需解码步骤，也没有代际损失。',
        },
        {
          title: '刻录音频CD',
          description: 'CD刻录软件需要44.1 kHz的WAV。',
        },
        {
          title: '采样声音',
          description: '载入采样器或游戏引擎。',
        },
      ],
      whyMediaManipulator: [
        '保留原始采样率和声道。',
        '正确处理MP3中的封面图。',
      ],
      privacyNote: '你的MP3由我们服务器上的FFmpeg一次性解码为16位PCM WAV。不涉及任何外部音频服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你会得到一个新文件；上传的文件本身不会被更改。',
      faq: [
        {
          question: 'WAV听起来会比MP3更好吗？',
          answer: '不会。听起来完全一样；关键在于之后的编辑不会再降低音质。',
        },
        {
          question: '为什么WAV大这么多？',
          answer: 'WAV未经压缩：CD音质的立体声音频每分钟约10 MB。',
        },
        {
          question: '我的MP3带有专辑封面，会有问题吗？',
          answer: '不会。嵌入的封面图会被识别为图片并被忽略。',
        },
      ],
      related: [
        {
          label: '将音频转换为WAV',
          to: '/tools/convert-audio-to-wav',
          description: '任意格式转WAV。',
        },
        {
          label: '将WAV转换为MP3',
          to: '/tools/convert-wav-to-mp3',
          description: '反向转换。',
        },
        {
          label: '音频转换器',
          to: '/tools/audio-converter',
          description: '在所有常见音频格式之间互相转换。',
        },
        {
          label: '更改音频速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢录音。',
        },
        {
          label: '更改音频音高',
          to: '/tools/change-audio-pitch',
          description: '升高或降低调性。',
        },
        {
          label: '音频标准化',
          to: '/tools/normalize-audio',
          description: '让响度保持均衡。',
        },
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: 'AI降噪。',
        },
        {
          label: '去除歌曲人声',
          to: '/tools/remove-vocals-from-song',
          description: '制作伴奏。',
        },
      ],
      embed: {
        title: '将MP3转换为WAV',
        description: '上传MP3。输出格式固定为WAV；如有需要可裁剪或标准化，然后点击“转换”。',
      },
    },
    'change-audio-speed': {
      name: '更改音频速度',
      h1: '在线更改音频速度：加速或减速',
      tagline: '把讲座或播客加速到1.5倍，或把歌曲或录音减速到0.75倍用于练习，音调保持不变。',
      metaTitle: '在线免费更改音频速度（音调不变） | Media Manipulator',
      metaDescription: '免费在线音频变速工具。在0.25倍到4倍之间加快或放慢MP3、WAV、M4A等音频，同时保持音调不变。非常适合讲座、播客和练习音轨。无需注册。',
      ogTitle: '在线免费更改音频速度',
      ogDescription: '加快或放慢，没有花栗鼠效果。免费，无需注册。',
      intro: '两小时的讲座用1.5倍速听只需80分钟。放慢到0.75倍速，吉他独奏就能学会了。更改音频速度每天都用得上，难点在于音调：简单粗暴的加速会把人声变成花栗鼠的声音。Media Manipulator在我们的服务器上用FFmpeg的节奏滤镜对音频进行时间拉伸，从四分之一速度到四倍速，音调都能保持原样。',
      whatItDoes: [
        '加快（1.1倍到4倍）或放慢（0.25倍到0.9倍）任意音频文件。',
        '保持音调，让语音和音乐不跑调。',
        '默认导出MP3，也可导出WAV、FLAC、M4A、OGG、Opus。',
        '可在同一次处理中选择裁剪、标准化和均衡器。',
      ],
      flowSteps: [
        {
          title: '上传音频',
          description: 'MP3、WAV、M4A、OGG、FLAC等。',
        },
        {
          title: '设置速度',
          description: '预选1.5倍；范围为0.25倍到4倍。',
        },
        {
          title: '转换',
          description: 'FFmpeg在保持音调的同时进行时间拉伸。',
        },
        {
          title: '下载',
          description: '保存调整速度后的文件。',
        },
      ],
      advancedDetails: [
        '使用atempo滤镜，对于0.5到2.0范围之外的倍数会自动串联多个滤镜。',
        '在极端倍数下，时间拉伸会引入轻微的瑕疵；对于语音，0.5倍到2倍听不出差别。',
        '如需同时改变速度和音调（磁带效果），请使用音高工具的时间拉伸选项。',
      ],
      whyItMatters: [
        '讲座、有声书和播客通常以1.25倍到2倍速收听最舒服。',
        '音乐人会以50%到75%的速度练习困难段落。',
        '转录人员会放慢录音，以听清每一个字。',
      ],
      useCases: [
        {
          title: '加速听讲座',
          description: '以1.5倍速收听录制的课程。',
        },
        {
          title: '练习音轨',
          description: '将独奏放慢到0.75倍，调性不变。',
        },
        {
          title: '转录',
          description: '将访谈放慢到0.8倍。',
        },
        {
          title: '适配时段',
          description: '将配音微调5%以适配时长。',
        },
      ],
      whyMediaManipulator: [
        '默认保持音调；不会出现花栗鼠声或磁带放慢的声音。',
        '任意输出格式，并可在同一次上传中裁剪和标准化。',
      ],
      privacyNote: '你的录音由我们服务器上的FFmpeg加速或减速，根据你选择的模式使用rubberband或atempo。不涉及任何外部音频服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你会得到一个新文件；上传的文件本身不会被更改。',
      faq: [
        {
          question: '音调会改变吗？',
          answer: '不会。节奏滤镜会让音调完全保持原样。',
        },
        {
          question: '最快能加速到多少？',
          answer: '一次处理最多4倍。如需更快，可再次处理结果。',
        },
        {
          question: '放慢的音频听起来会像机器人吗？',
          answer: '降到0.5倍时仍然干净；低于此值会听到一些相位失真。',
        },
        {
          question: '可以同时改变速度和音调吗？',
          answer: '可以。使用“更改音频音高”工具，它带有时间拉伸控件。',
        },
      ],
      related: [
        {
          label: '音频转换器',
          to: '/tools/audio-converter',
          description: '在所有常见音频格式之间互相转换。',
        },
        {
          label: '更改音频音高',
          to: '/tools/change-audio-pitch',
          description: '升高或降低调性。',
        },
        {
          label: '音频标准化',
          to: '/tools/normalize-audio',
          description: '让响度保持均衡。',
        },
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: 'AI降噪。',
        },
        {
          label: '去除歌曲人声',
          to: '/tools/remove-vocals-from-song',
          description: '制作伴奏。',
        },
      ],
      embed: {
        title: '更改音频文件的速度',
        description: '上传音频文件并设置速度倍数；预选为1.5倍。音调会保持不变，因此人声听起来依然自然。如果还想改变调性，请使用音高工具。',
      },
    },
    'change-audio-pitch': {
      name: '更改音频音高',
      h1: '在线更改音频音高：升调或降调',
      tagline: '按半音移调，改变歌曲或录音的调性、降低人声或调整采样音高，节奏保持不变。',
      metaTitle: '在线免费更改音频音高：按半音移调 | Media Manipulator',
      metaDescription: '免费在线变调工具。将MP3、WAV或任意音频按半音升高或降低以改变调性，速度保持不变。可选时间拉伸。无水印，无需注册。',
      ogTitle: '在线免费更改音频音高',
      ogDescription: '按半音为任意音频移调。免费，无需注册。',
      intro: '伴奏的调不适合你的嗓音，采样需要与歌曲匹配，人声想要再低一个全音：变调可以解决所有这些问题。Media Manipulator在我们的服务器上用FFmpeg按半音为音频移调，时长保持不变；如果你想要的是老式磁带变速效果，也可以将其与时间拉伸结合使用。',
      whatItDoes: [
        '将音频升高或降低最多12个半音（一个八度）。',
        '保持时长不变，因此音轨依然对得上。',
        '可选时间拉伸，独立改变长度。',
        '将变调后的音频输出为MP3、WAV、FLAC、M4A、OGG或Opus。',
      ],
      flowSteps: [
        {
          title: '上传音频',
          description: '任意常见音频格式。',
        },
        {
          title: '设置半音',
          description: '预选+2；范围为-12到+12。',
        },
        {
          title: '转换',
          description: 'FFmpeg进行重采样并重新调整时间。',
        },
        {
          title: '下载',
          description: '保存移调后的文件。',
        },
      ],
      advancedDetails: [
        '变调按2^(半音数/12)进行重采样，并补偿节奏，使长度保持不变。',
        '对完整混音进行大幅变调（超过5个半音）可能听起来不自然；人声和单个乐器的效果更好。',
        '共振峰保持已开启，因此降低后的人声不会变成另一个人的声音。',
      ],
      whyItMatters: [
        '歌手将伴奏移调到舒适的调性。',
        '制作人将采样和人声调到与歌曲一致。',
        '降低一两个半音能让小样中的人声听起来更放松。',
      ],
      useCases: [
        {
          title: '更改伴奏的调',
          description: '将卡拉OK伴奏降低两个半音。',
        },
        {
          title: '调整采样音高',
          description: '让鼓点或人声片段与歌曲匹配。',
        },
        {
          title: '降低配音音高',
          description: '将一段朗读降低一个半音。',
        },
        {
          title: '八度效果',
          description: '变调+12或-12，作为效果层。',
        },
      ],
      whyMediaManipulator: [
        '按半音控制，时长保持不变，需要时还可以时间拉伸。',
        '任意输出格式，并可在同一次上传中裁剪和标准化。',
      ],
      privacyNote: '你的音频由我们服务器上的FFmpeg按你选择的半音数升高或降低。不涉及任何外部音频服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你会得到一个新文件；上传的文件本身不会被更改。',
      faq: [
        {
          question: '速度会改变吗？',
          answer: '不会。时长保持不变。如果你希望改变，请使用时间拉伸控件。',
        },
        {
          question: '最多可以变调多少？',
          answer: '向上或向下最多12个半音（一个八度）。',
        },
        {
          question: '变调后的人声听起来自然吗？',
          answer: '一到三个半音时是自然的。更大幅度的变调会听得出来；共振峰保持可防止它听起来像卡通人物。',
        },
        {
          question: '可以按音分变调吗？',
          answer: '暂时不行；控件以整个半音为单位。',
        },
      ],
      related: [
        {
          label: '音频转换器',
          to: '/tools/audio-converter',
          description: '在所有常见音频格式之间互相转换。',
        },
        {
          label: '更改音频速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢录音。',
        },
        {
          label: '音频标准化',
          to: '/tools/normalize-audio',
          description: '让响度保持均衡。',
        },
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: 'AI降噪。',
        },
        {
          label: '去除歌曲人声',
          to: '/tools/remove-vocals-from-song',
          description: '制作伴奏。',
        },
      ],
      embed: {
        title: '更改音频文件的音高',
        description: '上传音频文件。“高级”部分打开时会显示音高滑块；预选为+2个半音。负值会降低调性。如果你还想改变长度，时间拉伸就在旁边。',
      },
    },
    'normalize-audio': {
      name: '音频标准化',
      h1: '在线标准化音频响度',
      tagline: '将音量偏小的录音提升到一致的响度，让播客、语音备忘录和混合播放列表以相同音量播放。',
      metaTitle: '在线免费音频标准化（响度） | Media Manipulator',
      metaDescription: '免费在线音频标准化工具。使用EBU R128响度标准化，让MP3、WAV、M4A等文件的响度保持均衡。非常适合播客和语音备忘录。无水印，无需注册。',
      ogTitle: '在线免费音频标准化',
      ogDescription: '让任何录音的响度保持一致。免费，无需注册。',
      intro: '隔着一臂距离录下的语音备忘录音量很小；从CD翻录的歌曲音量很大；把它们接连播放，听众就得伸手去调音量。响度标准化会测量整个文件的感知响度，并将其调整到标准目标值，所用的EBU R128测量方法与广播机构和流媒体服务相同。Media Manipulator在我们的服务器上用FFmpeg的loudnorm滤镜进行处理，它还会将真峰值控制在上限以下，因此不会出现削波。',
      whatItDoes: [
        '测量综合响度，并标准化到广播标准的目标值。',
        '限制真峰值，确保输出绝不削波。',
        '可在同一部分选择增益、淡入/淡出和动态范围压缩。',
        '将电平调整后的文件保存为MP3、WAV、FLAC、M4A、OGG或Opus。',
      ],
      flowSteps: [
        {
          title: '上传音频',
          description: '任意常见格式。',
        },
        {
          title: '保持标准化开启',
          description: '如有需要，可添加淡入淡出或压缩。',
        },
        {
          title: '转换',
          description: 'FFmpeg loudnorm进行测量和校正。',
        },
        {
          title: '下载',
          description: '保存电平调整后的文件。',
        },
      ],
      advancedDetails: [
        '使用loudnorm（EBU R128），采用其默认的-24 LUFS综合响度目标和-2 dBTP真峰值上限。',
        '这是响度标准化，而不是峰值标准化：两个峰值都在0 dB的文件，感知音量仍可能相差很大。',
        '如需不经分析、快速进行固定增益调整，请使用放大滑块或“调整音频音量”工具。',
      ],
      whyItMatters: [
        '需要不停调节音量的播客会让听众放弃收听。',
        '播放列表和DJ串烧需要曲目保持一致的电平。',
        '各平台会在上传时进行标准化；提前处理就不会有意外。',
      ],
      useCases: [
        {
          title: '播客节目',
          description: '发布前将录制的对话电平调匀。',
        },
        {
          title: '语音备忘录',
          description: '提升音量偏小的手机录音。',
        },
        {
          title: '讲座录制',
          description: '让离开麦克风走动的讲者音量保持均衡。',
        },
        {
          title: '播放列表准备',
          description: '标准化从不同来源翻录的曲目。',
        },
      ],
      whyMediaManipulator: [
        '真正的EBU R128响度测量，而不只是峰值扫描。',
        '淡入淡出、增益和压缩都在同一部分。',
      ],
      privacyNote: '你的音频响度由我们服务器上的FFmpeg测量并调匀。不涉及任何外部音频服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你会得到一个新文件；上传的文件本身不会被更改。',
      faq: [
        {
          question: '使用的目标响度是多少？',
          answer: '-24 LUFS综合响度，真峰值上限为-2 dBTP，即EBU R128的默认值。播客平台的目标通常为-16到-19 LUFS；如果想要更响，可以增加几dB的放大。',
        },
        {
          question: '它会让文件内的所有内容音量一致吗？',
          answer: '不会。它是对整个文件进行电平调整。同时开启压缩器可以减少文件内部的音量变化。',
        },
        {
          question: '会削波吗？',
          answer: '不会。真峰值限制器会将峰值保持在上限以下。',
        },
        {
          question: '我可以只把音量调大吗？',
          answer: '可以。使用“调整音频音量”工具进行固定增益调整。',
        },
      ],
      related: [
        {
          label: '调整音频音量',
          to: '/tools/adjust-audio-volume',
          description: '按固定增益调大或调小。',
        },
        {
          label: '音频转换器',
          to: '/tools/audio-converter',
          description: '在所有常见音频格式之间互相转换。',
        },
        {
          label: '更改音频速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢录音。',
        },
        {
          label: '更改音频音高',
          to: '/tools/change-audio-pitch',
          description: '升高或降低调性。',
        },
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: 'AI降噪。',
        },
        {
          label: '去除歌曲人声',
          to: '/tools/remove-vocals-from-song',
          description: '制作伴奏。',
        },
      ],
      embed: {
        title: '标准化音频文件',
        description: '上传音频文件。响度标准化已在“基础音频处理”部分开启；如有需要，可添加放大、淡入淡出或压缩。点击“转换”。',
      },
    },
    'adjust-audio-volume': {
      name: '调整音频音量',
      h1: '在线调大或调小音频音量',
      tagline: '按固定幅度调大或调小音频音量，从10%到两倍，或用放大滑块按分贝调节。',
      metaTitle: '免费在线提高音频音量（让MP3更响亮） | Media Manipulator',
      metaDescription: '免费在线音量调节工具。按固定倍数或分贝让MP3、WAV或任意音频文件变响或变轻，并可添加淡入淡出。无水印，无需注册。',
      ogTitle: '在线调大或调小音频音量',
      ogDescription: '让任何音频变响或变轻。免费，无需注册。',
      intro: '有时文件只是太轻，或者比播放列表里的其他曲目响得多，只需固定调整一下增益就够了。Media Manipulator在我们的服务器上用FFmpeg按倍数或分贝缩放音频音量，可按需添加淡入淡出，还能将调整与响度标准化结合，让结果不会削波。',
      whatItDoes: [
        '将音量按0.1倍（非常轻）到2倍（翻倍）的倍数调整。',
        '或用放大滑块，以分贝为单位在-60到+60 dB之间设置精确增益。',
        '以秒为单位设置淡入和淡出。',
        '可选标准化和压缩，避免大幅提升时出现削波。',
      ],
      flowSteps: [
        {
          title: '上传音频',
          description: '任何常见格式。',
        },
        {
          title: '设置音量',
          description: '默认已选1.5倍；也可以使用分贝。',
        },
        {
          title: '转换',
          description: 'FFmpeg应用增益。',
        },
        {
          title: '下载',
          description: '保存调整后的文件。',
        },
      ],
      advancedDetails: [
        '音量调整使用volume滤镜；倍数2相当于+6 dB，0.5相当于-6 dB。',
        '如果文件峰值已接近0 dBFS，再提升就会削波；请启用标准化，它包含真峰值限制器。',
        '如果想要一致的感知响度而不是固定增益，请使用“音频标准化”。',
      ],
      whyItMatters: [
        '音量偏小的录音在手机扬声器上很难听清。',
        '过响的铃声或音效令人不适，而且会削波。',
        '当你确切知道要调整多少时，固定增益是最合适的工具。',
      ],
      useCases: [
        {
          title: '提升轻声备忘录',
          description: '让手机录音能够听清。',
        },
        {
          title: '压低响亮的音效',
          description: '将音效降低10 dB。',
        },
        {
          title: '铃声',
          description: '提升音量并添加淡出。',
        },
        {
          title: '背景音乐',
          description: '降低音轨音量，让它垫在人声之下。',
        },
      ],
      whyMediaManipulator: [
        '倍数或分贝，外加淡入淡出，一处搞定。',
        '在同一次处理中标准化和压缩，防止削波。',
      ],
      privacyNote: '你的音频由我们服务器上的FFmpeg按你设置的幅度调大或调小。不涉及任何外部音频服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你会得到一个新文件；上传的原文件本身不会被更改。',
      faq: [
        {
          question: '最多能提升多少？',
          answer: '使用倍数时为2倍，使用放大滑块时最高+60 dB。除非开启标准化，否则大幅提升会削波。',
        },
        {
          question: '会失真吗？',
          answer: '只有当提升后的信号超过满刻度时才会。请开启标准化，它会限制真峰值。',
        },
        {
          question: '用倍数还是分贝？',
          answer: '两者作用相同。2倍等于+6 dB；0.5倍等于-6 dB。',
        },
        {
          question: '能改为让音量均衡一致吗？',
          answer: '可以。使用“音频标准化”获得一致的感知响度。',
        },
      ],
      related: [
        {
          label: '音频标准化',
          to: '/tools/normalize-audio',
          description: '一致的响度。',
        },
        {
          label: '音频转换器',
          to: '/tools/audio-converter',
          description: '在所有常见音频格式之间转换。',
        },
        {
          label: '更改音频速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢录音。',
        },
        {
          label: '更改音频音高',
          to: '/tools/change-audio-pitch',
          description: '升高或降低调性。',
        },
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: 'AI降噪。',
        },
        {
          label: '去除歌曲人声',
          to: '/tools/remove-vocals-from-song',
          description: '制作伴奏。',
        },
      ],
      embed: {
        title: '调整音频文件的音量',
        description: '上传音频文件并设置音量倍数；默认已选1.5倍。如需按分贝调整，请使用“基础音频处理”中的放大滑块。大幅提升可能会削波；开启标准化即可得到安全的结果。',
      },
    },
    'audio-equalizer': {
      name: '音频均衡器',
      h1: '在线音频均衡：低音增强、高音、预设',
      tagline: '应用低音增强、高音提升、人声突出或风格预设，或设置低通和高通滤波器，然后下载结果。',
      metaTitle: '在线音频均衡器：低音增强、高音、人声 | Media Manipulator',
      metaDescription: '免费在线音频均衡器。为MP3、WAV等文件应用低音增强、高音增强、人声、摇滚、爵士或古典均衡预设，或设置高通和低通滤波器。无需注册。',
      ogTitle: '在线均衡音频',
      ogDescription: '低音增强、高音、人声临场感等。免费，无需注册。',
      intro: '均衡器塑造录音的音色：为单薄的音轨加点低频，为轰鸣的房间减点低频，提升临场感让人声更突出，用高通滤波去除隆隆声。Media Manipulator在我们的服务器上用FFmpeg进行均衡处理，从一键预设到明确的滤波器截止频率都能做到，并可导出为任意音频格式。',
      whatItDoes: [
        '预设：低音增强、高音增强、人声、摇滚、爵士、古典。',
        '截止频率可调的高通和低通滤波器。',
        '可与音量、标准化、压缩和混响结合使用。',
        '均衡后的结果可以是MP3、WAV、FLAC、M4A、OGG或Opus。',
      ],
      flowSteps: [
        {
          title: '上传音频',
          description: '任何常见格式。',
        },
        {
          title: '选择预设或滤波器',
          description: '默认已选低音增强。',
        },
        {
          title: '转换',
          description: 'FFmpeg应用均衡处理链。',
        },
        {
          title: '下载',
          description: '保存调整音色后的文件。',
        },
      ],
      advancedDetails: [
        '预设对应FFmpeg的equalizer、bass和treble滤镜，采用固定的增益和Q值。',
        '在80到120 Hz设置高通可去除人声录音中的手持噪音和隆隆声；在8到10 kHz设置低通可抑制嘶嘶声。',
        '均衡器无法添加从未录到的频率；手机录音在100 Hz以下几乎没有可提升的内容。',
      ],
      whyItMatters: [
        '稍稍提升临场感，就能让语音在小扬声器上清晰得多。',
        '隆隆声和嘶嘶声是最常见的两类问题，二者都只需简单的滤波器就能解决。',
        '风格预设能快速为播放列表赋予一致的听感。',
      ],
      useCases: [
        {
          title: '人声清晰度',
          description: '为播客使用人声预设并加上高通滤波。',
        },
        {
          title: '低音增强',
          description: '让单薄的录音更饱满。',
        },
        {
          title: '去除隆隆声',
          description: '在100 Hz设置高通。',
        },
        {
          title: '抑制嘶嘶声',
          description: '对老磁带转录的音频在10 kHz设置低通。',
        },
      ],
      whyMediaManipulator: [
        '预设和明确的滤波器截止频率集中在同一个区域。',
        '在同一次上传中串联标准化、压缩和混响。',
      ],
      privacyNote: '你的音频的低音、中音和高音由我们服务器上FFmpeg的均衡器重新塑造。不涉及任何外部音频服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你会得到一个新文件；上传的原文件本身不会被更改。',
      faq: [
        {
          question: '能设置自己的频段吗？',
          answer: '目前提供预设以及高通和低通截止频率；逐频段增益已列入路线图。',
        },
        {
          question: '高通滤波器有什么作用？',
          answer: '它会去除截止频率以下的所有内容：隆隆声、手持噪音、爆破音的砰砰声。',
        },
        {
          question: '均衡器能修复发闷的录音吗？',
          answer: '如果高频只是偏弱，提升高音会有帮助。如果高频根本没有录到，均衡器无法凭空创造；可以试试AI人声降噪。',
        },
        {
          question: '均衡会削波吗？',
          answer: '提升可能会。请开启标准化，它包含真峰值限制器。',
        },
      ],
      related: [
        {
          label: '人声音频降噪',
          to: '/tools/clean-voice-audio',
          description: 'AI人声增强。',
        },
        {
          label: '音频转换器',
          to: '/tools/audio-converter',
          description: '在所有常见音频格式之间转换。',
        },
        {
          label: '更改音频速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢录音。',
        },
        {
          label: '更改音频音高',
          to: '/tools/change-audio-pitch',
          description: '升高或降低调性。',
        },
        {
          label: '音频标准化',
          to: '/tools/normalize-audio',
          description: '让响度均衡一致。',
        },
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: 'AI降噪。',
        },
        {
          label: '去除歌曲人声',
          to: '/tools/remove-vocals-from-song',
          description: '制作伴奏。',
        },
      ],
      embed: {
        title: '均衡音频文件',
        description: '上传音频文件。“基础音频处理”中的均衡器已开启并使用低音增强预设；你可以选择其他预设，或设置高通和低通截止频率。然后点击“转换”。',
      },
    },
    'add-reverb-to-audio': {
      name: '为音频添加混响',
      h1: '在线为音频添加混响或回声',
      tagline: '为干声人声或录音加上房间、大厅、板式或弹簧混响，或添加延迟或回声，然后下载结果。',
      metaTitle: '免费在线为音频添加混响或回声 | Media Manipulator',
      metaDescription: '免费在线混响和回声。为MP3、WAV及任意音频文件添加房间、大厅、板式或弹簧混响，或添加延迟，并可控制湿声电平和房间大小。无需注册。',
      ogTitle: '在线为音频添加混响或回声',
      ogDescription: '房间、大厅、板式、弹簧混响和延迟。免费，无需注册。',
      intro: '在经过声学处理的房间里录制的人声听起来很干瘪，直到你把它放进某个空间。混响增加空间感；延迟增加节奏感。Media Manipulator在我们的服务器上用FFmpeg应用房间、大厅、板式和弹簧混响以及回声类延迟，可控制湿声电平和房间大小，并可导出为任意音频格式。',
      whatItDoes: [
        '房间、大厅、板式和弹簧混响类型，可调房间大小、阻尼和干/湿混合。',
        '回声、多重延迟和乒乓延迟，可调时间和反馈。',
        '同一区域还提供合唱、镶边、移相和颤音调制效果。',
        '湿声版本可选MP3、WAV、FLAC、M4A、OGG或Opus格式。',
      ],
      flowSteps: [
        {
          title: '上传音频',
          description: '干声人声或乐器效果最佳。',
        },
        {
          title: '选择混响',
          description: '默认已选大厅；设置大小和混合比例。',
        },
        {
          title: '转换',
          description: 'FFmpeg渲染效果。',
        },
        {
          title: '下载',
          description: '保存结果。',
        },
      ],
      advancedDetails: [
        '混响由FFmpeg的aecho构建，每种类型有各自的延迟和衰减设置；湿声电平决定效果与干声信号的混合比例。',
        '延迟时间以毫秒为单位；反馈超过70%会迅速累积。',
        '效果会被渲染进文件；如果之后可能想更改，请保留原始干声文件。',
      ],
      whyItMatters: [
        '没有一点空间感，干声人声和配音听起来会不自然。',
        '短板式混响是口语内容和歌曲的标准润色手段。',
        '延迟和调制是制作声音设计元素最快的方法。',
      ],
      useCases: [
        {
          title: '人声润色',
          description: '为演唱或朗读录音加上短板式混响。',
        },
        {
          title: '大厅效果',
          description: '把合唱或铺底音色放进大教堂。',
        },
        {
          title: '拍击回声',
          description: '为吉他或人声加上短促的回声。',
        },
        {
          title: '声音设计',
          description: '为音效加上乒乓延迟和镶边。',
        },
      ],
      whyMediaManipulator: [
        '四种混响类型、三种延迟类型和四种调制效果集中在同一个区域。',
        '在同一次上传中结合均衡、标准化和音高调整。',
      ],
      privacyNote: '混响由我们服务器上的FFmpeg添加到你的音频中。不涉及任何外部音频服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你会得到一个新文件；上传的原文件本身不会被更改。',
      faq: [
        {
          question: '人声应该用哪种混响？',
          answer: '板式或小房间混响，湿声比例20%到30%。大厅适合音乐和音效。',
        },
        {
          question: '能去除混响吗？',
          answer: '这里不行。AI人声降噪工具可以减少语音中的房间声。',
        },
        {
          question: '能同时添加混响和延迟吗？',
          answer: '可以。两者位于同一区域，可以同时启用。',
        },
        {
          question: '效果可以撤销吗？',
          answer: '不可以。效果会被渲染进文件；请保留原始干声文件。',
        },
      ],
      related: [
        {
          label: '音频转换器',
          to: '/tools/audio-converter',
          description: '在所有常见音频格式之间转换。',
        },
        {
          label: '更改音频速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢录音。',
        },
        {
          label: '更改音频音高',
          to: '/tools/change-audio-pitch',
          description: '升高或降低调性。',
        },
        {
          label: '音频标准化',
          to: '/tools/normalize-audio',
          description: '让响度均衡一致。',
        },
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: 'AI降噪。',
        },
        {
          label: '去除歌曲人声',
          to: '/tools/remove-vocals-from-song',
          description: '制作伴奏。',
        },
      ],
      embed: {
        title: '为音频文件添加混响',
        description: '上传音频文件。“时间类效果”区域打开时已选中大厅混响；调整房间大小和湿声电平，或选择房间、板式或弹簧混响，也可以添加延迟。然后点击“转换”。',
      },
    },
    'trim-audio': {
      name: '裁剪音频',
      h1: '免费在线裁剪或剪切音频',
      tagline: '将MP3、WAV或任意录音裁剪到指定的开始和结束时间，借助波形选择时间点，只下载需要的部分。',
      metaTitle: '免费在线裁剪音频：剪切MP3、WAV | Media Manipulator',
      metaDescription: '免费在线音频裁剪工具。借助波形将任意音频文件剪到指定范围，添加淡入淡出，并下载MP3、WAV、M4A等格式。制作铃声或片段。无水印，无需注册。',
      ogTitle: '免费在线裁剪或剪切音频',
      ogDescription: '在波形上选择开始和结束点，然后下载片段。免费，无需注册。',
      intro: '用作铃声的副歌、两小时录音里那一分钟精华、去掉开场的金句片段：裁剪是每个人都需要的音频编辑。Media Manipulator显示波形，让你拖动开始和结束点，在我们的服务器上用FFmpeg剪切，并可导出为任意格式，还可选择添加淡入淡出。',
      whatItDoes: [
        '将任意音频文件剪切到在波形上选定的开始和结束时间。',
        '淡入和淡出，避免剪切处出现咔哒声。',
        '剪好的片段以MP3、WAV、FLAC、M4A、OGG或Opus格式返回。',
        '可在同一次处理中结合音量、标准化和均衡。',
      ],
      flowSteps: [
        {
          title: '上传音频',
          description: '任何常见格式。',
        },
        {
          title: '设置范围',
          description: '在波形上拖动标记。',
        },
        {
          title: '转换',
          description: 'FFmpeg剪切并编码。',
        },
        {
          title: '下载',
          description: '保存片段。',
        },
      ],
      advancedDetails: [
        '剪切精确到采样；输出会按你选择的格式重新编码。',
        '0.05到0.2秒的淡入淡出可消除剪切点的咔哒声。',
        '如果是视频，请使用“视频剪辑”；如果想为结果生成波形视频，请使用“音频波形生成器”。',
      ],
      whyItMatters: [
        '铃声和通知音需要20到30秒的片段。',
        '分享一段金句比分享整段录音更方便。',
        '在转录前去掉静音和开场能节省时间。',
      ],
      useCases: [
        {
          title: '铃声',
          description: '剪出副歌并添加淡出。',
        },
        {
          title: '金句片段',
          description: '从访谈中截取一句话。',
        },
        {
          title: '去掉糟糕的开头',
          description: '删掉备忘录的前10秒。',
        },
        {
          title: '采样',
          description: '单独截取一个打击音或一个乐句。',
        },
      ],
      whyMediaManipulator: [
        '用可拖动的标记在波形上编辑，而不是手动输入时间戳。',
        '在同一次上传中完成淡入淡出、标准化和任意输出格式。',
      ],
      privacyNote: '你的音频由我们服务器上的FFmpeg按你设置的开始和结束时间剪切。不涉及任何外部音频服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你会得到一个新文件；上传的原文件本身不会被更改。',
      faq: [
        {
          question: '能输入精确的时间吗？',
          answer: '可以。裁剪对话框除了可拖动的标记，还有开始和结束字段。',
        },
        {
          question: '剪切处会有咔哒声吗？',
          answer: '在“基础音频处理”中添加短暂的淡入和淡出即可避免。',
        },
        {
          question: '能保留原始音质吗？',
          answer: '选择WAV或FLAC输出，避免有损的重新编码。',
        },
        {
          question: '能剪掉中间部分吗？',
          answer: '每次只能处理一个范围；运行该工具两次，然后在Darkroom中拼接各部分。',
        },
      ],
      related: [
        {
          label: '视频剪辑',
          to: '/tools/video-trimmer',
          description: '视频版的同类工具。',
        },
        {
          label: '从视频中提取音频',
          to: '/tools/extract-audio-from-video',
          description: '先提取音频。',
        },
        {
          label: '音频转换器',
          to: '/tools/audio-converter',
          description: '在所有常见音频格式之间转换。',
        },
        {
          label: '更改音频速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢录音。',
        },
        {
          label: '更改音频音高',
          to: '/tools/change-audio-pitch',
          description: '升高或降低调性。',
        },
        {
          label: '音频标准化',
          to: '/tools/normalize-audio',
          description: '让响度均衡一致。',
        },
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: 'AI降噪。',
        },
        {
          label: '去除歌曲人声',
          to: '/tools/remove-vocals-from-song',
          description: '制作伴奏。',
        },
      ],
      embed: {
        title: '裁剪音频文件',
        description: '上传音频文件，点击“裁剪音频”，然后在波形上拖动开始和结束标记。如有需要，可在“基础音频处理”中添加淡入或淡出。然后点击“转换”。',
      },
    },
    'transcribe-audio': {
      name: '音频转文字',
      h1: '在线将音频转录为文字',
      tagline: '在我们自己的GPU服务器上，用AI语音识别将MP3、WAV、M4A或任意录音转换为文本、字幕或JSON。',
      metaTitle: '在线将音频转录为文字（免费AI） | Media Manipulator',
      metaDescription: '免费在线音频转录。将MP3、WAV、M4A、OGG或FLAC录音转换为纯文本、VTT或SRT字幕，或带时间戳的JSON。运行在我们自己的GPU上，不使用第三方AI。',
      ogTitle: '在线将音频转录为文字',
      ogDescription: '将录音、访谈和语音备忘录转为文字。免费，无需注册。',
      intro: '访谈、讲座、语音备忘录和会议录音变成文字后用处大得多：可搜索、可引用、可翻译。Media Manipulator在我们运营的GPU服务器上用Whisper模型转录音频，因此你的录音绝不会离开我们的基础设施，并返回纯文本、VTT或SRT字幕，或带逐词时间戳的JSON转录稿。',
      whatItDoes: [
        '用Whisper转录MP3、WAV、M4A、OGG、FLAC等音频。',
        '输出纯文本、VTT、SRT或带时间戳的JSON。',
        '可在数十种语言中自动检测语言。',
        '运行在我们自己的GPU上；不使用第三方AI服务商。',
      ],
      flowSteps: [
        {
          title: '上传音频',
          description: '任何常见格式。',
        },
        {
          title: '选择输出',
          description: '文本、VTT、SRT或JSON。',
        },
        {
          title: '转录',
          description: 'Whisper在我们的GPU服务器上运行。',
        },
        {
          title: '下载',
          description: '打开转录查看器或保存文件。',
        },
      ],
      advancedDetails: [
        '使用whisper-ctranslate2和大型多语言模型；语音清晰、背景噪音少时准确率最高。',
        '对于嘈杂的录音，先运行“去除背景噪音”工具，可获得更好的转录结果。',
        '一次转录计为一次AI任务，从每日AI额度而不是常规任务额度中扣除；失败的任务不计入。',
      ],
      whyItMatters: [
        '文字可以搜索、可以快速浏览；音频不行。',
        '字幕让音频内容无障碍且可被索引。',
        '转录稿是笔记、文章和翻译的起点。',
      ],
      useCases: [
        {
          title: '访谈笔记',
          description: '获得可以引用的文字。',
        },
        {
          title: '讲座转录稿',
          description: '对照文字学习，搜索术语。',
        },
        {
          title: '播客字幕',
          description: '为视频版本生成SRT或VTT。',
        },
        {
          title: '语音备忘录转文字',
          description: '把想法变成文档。',
        },
      ],
      whyMediaManipulator: [
        'Whisper运行在我们自己的硬件上；你的音频绝不会发送给第三方AI。',
        '四种输出格式，外加内置的转录查看器。',
      ],
      privacyNote: '你的录音由我们自己GPU服务器上的Whisper转录，文字随任务一起保存。AI处理在我们运营的硬件上运行，绝不使用第三方AI服务商，你上传的任何内容都不会被用于训练模型。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: '支持哪些语言？',
          answer: 'Whisper支持数十种语言，并会自动检测语言。',
        },
        {
          question: '准确率如何？',
          answer: '语音清晰时非常好。背景噪音、多人同时说话和浓重口音会降低准确率；如有可能，请先降噪。',
        },
        {
          question: '我的录音会发送给OpenAI吗？',
          answer: '不会。模型运行在我们自己的GPU服务器上。',
        },
        {
          question: '能获得说话人标签吗？',
          answer: '暂时不能。JSON输出包含逐词时间戳，你可以据此分段。',
        },
        {
          question: '这会占用我的额度吗？',
          answer: '会，计为AI任务额度中的一次AI任务，AI任务额度与常规任务额度分开计算。失败的任务不计入。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '计为一次AI任务；失败的任务不计入。',
        ],
      },
      related: [
        {
          label: '视频转录',
          to: '/tools/transcribe-video',
          description: '适用于视频文件。',
        },
        {
          label: 'SRT字幕生成器',
          to: '/tools/srt-generator',
          description: '直接生成字幕。',
        },
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: '先清理音频。',
        },
        {
          label: '字幕翻译器',
          to: '/tools/caption-translator',
          description: '翻译字幕。',
        },
      ],
      embed: {
        title: '转录音频文件',
        description: '上传音频文件并选择输出：纯文本适合文档，VTT或SRT适合字幕，JSON适合时间戳。Whisper在我们的GPU服务器上运行；不会向任何第三方AI发送内容。',
      },
    },
    'add-text-to-image': {
      name: '为图片添加文字',
      h1: '免费在线为图片添加文字',
      tagline: '在照片上添加说明、标题或水印：选择字体、大小、颜色、描边和位置，然后下载。',
      metaTitle: '免费在线为图片添加文字：说明、水印 | Media Manipulator',
      metaDescription: '免费在线为照片添加文字的工具。为JPG、PNG、WebP等图片上的说明文字、表情包或水印选择字体、大小、颜色、描边和位置。无需注册。',
      ogTitle: '免费在线为图片添加文字',
      ogDescription: '为任何照片添加说明、标题或水印。免费，无需注册。',
      intro: '截图上的说明、缩略图上的标题、照片角落的版权声明：添加文字是仅次于裁剪的最常见图片编辑。Media Manipulator在我们的服务器上用ImageMagick将文字渲染到图片上，可设置字体、大小、填充色和描边色，位置可从九个锚点中选择或指定精确像素坐标，并可导出为相同或不同的格式。',
      whatItDoes: [
        '以任意大小渲染一个文字块，可设置填充色和描边色。',
        '六种内置字体（无衬线、衬线、等宽，各有两个字体系列）。',
        '九个锚点位置或精确的x/y定位。',
        '可在同一次处理中结合尺寸调整、裁剪、滤镜和元数据选项。',
      ],
      flowSteps: [
        {
          title: '上传图片',
          description: 'JPG、PNG、WebP、HEIC等格式。',
        },
        {
          title: '输入文字并设置样式',
          description: '大小、颜色、描边、字体、位置。',
        },
        {
          title: '转换',
          description: 'ImageMagick绘制文字。',
        },
        {
          title: '下载',
          description: '保存添加了文字的图片。',
        },
      ],
      advancedDetails: [
        '文字按输出尺寸栅格化；请根据图片宽度以像素为单位设置大小。',
        '2到4 px的对比色描边能让文字在杂乱的照片上保持清晰可读。',
        '选择PNG输出可保留透明背景，用作水印模板。',
      ],
      whyItMatters: [
        '说明文字让截图一目了然。',
        '醒目的版权声明能阻止他人不注明出处就转发。',
        '带标题的缩略图能获得更多点击。',
      ],
      useCases: [
        {
          title: '为截图添加说明',
          description: '标明观看者正在看的内容。',
        },
        {
          title: '为照片加水印',
          description: '在底部角落写上你的名字。',
        },
        {
          title: '缩略图标题',
          description: '为视频缩略图加上醒目的大号粗体文字。',
        },
        {
          title: '表情包',
          description: '顶部文字，底部文字。',
        },
      ],
      whyMediaManipulator: [
        '填充、描边、字体和九点定位，而不只是一个文本框。',
        '在同一次上传中调整尺寸、裁剪和转换格式。',
      ],
      privacyNote: '你输入的文字由我们服务器上的ImageMagick绘制到你的图片上。不会向任何外部服务发送内容。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原图绝不会被更改：你下载的是一个新文件。',
      faq: [
        {
          question: '能添加多行文字吗？',
          answer: '每次处理一个文字块；文字中的换行会渲染为新的一行。如需第二个文字块，请再次运行该工具。',
        },
        {
          question: '能使用我自己的字体吗？',
          answer: '可使用六种内置字体；不支持上传自定义字体。',
        },
        {
          question: '如何精确放置文字？',
          answer: '选择一个锚点，并以像素为单位添加x/y偏移。',
        },
        {
          question: '会降低画质吗？',
          answer: '图片会被重新编码；选择PNG或较高的JPG质量即可保持清晰。',
        },
      ],
      related: [
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在图片格式之间转换。',
        },
        {
          label: '裁剪图片',
          to: '/tools/crop-image',
          description: '裁剪到指定区域。',
        },
        {
          label: '调整图片尺寸',
          to: '/tools/image-resizer',
          description: '更改尺寸。',
        },
        {
          label: '图片滤镜',
          to: '/tools/image-filters',
          description: '棕褐色、素描、浮雕等效果。',
        },
        {
          label: '移除EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '清除位置和设备数据。',
        },
      ],
      embed: {
        title: '为图片添加文字',
        description: '上传图片。“文字叠加”区域会高亮显示：输入文字，设置大小、颜色、描边、字体和位置（九个锚点或精确坐标）。然后点击“转换”。',
      },
    },
    'crop-image': {
      name: '裁剪图片',
      h1: '免费在线裁剪图片',
      tagline: '在照片上拖出需要的区域，调整构图，并以任意格式只下载该区域。',
      metaTitle: '免费在线裁剪图片 | Media Manipulator',
      metaDescription: '免费在线图片裁剪工具。拖动选择JPG、PNG、WebP或HEIC照片中的某个区域并下载。可结合尺寸调整、滤镜和格式转换。无需注册。',
      ogTitle: '免费在线裁剪图片',
      ogDescription: '拖出一个框，下载该区域。免费，无需注册。',
      intro: '裁剪能修正构图、去除边缘的杂物，让一张照片的画面更紧凑。Media Manipulator会在上传的图片上打开可视化裁剪器，在我们的服务器上用ImageMagick执行裁剪，并让你在同一次处理中对结果进行尺寸调整、滤镜处理和格式转换。',
      whatItDoes: [
        '直接在图片上显示带拖动手柄的可视化裁剪框。',
        '显示精确的裁剪坐标，并可编辑。',
        '裁剪后可结合尺寸调整，缩放到目标宽度和高度。',
        '将裁剪区域保存为JPG、PNG、WebP、AVIF或GIF。',
      ],
      flowSteps: [
        {
          title: '上传图片',
          description: '任何常见格式。',
        },
        {
          title: '绘制裁剪框',
          description: '拖动裁剪框和手柄。',
        },
        {
          title: '转换',
          description: 'ImageMagick裁剪并编码。',
        },
        {
          title: '下载',
          description: '保存裁剪后的图片。',
        },
      ],
      advancedDetails: [
        '裁剪在尺寸调整之前执行，因此一张4000 px的照片裁剪到1000 px再调整到500 px时，只会缩小一次。',
        '裁剪会移除像素且无法撤销；请保留原图。',
        '会遵循EXIF方向信息，因此旋转过的手机照片会按你看到的样子裁剪。',
      ],
      whyItMatters: [
        '更紧凑的构图是改善大多数照片最快的方法。',
        '头像和缩略图需要特定的区域和比例。',
        '裁掉路人或车牌是一种隐私保护手段。',
      ],
      useCases: [
        {
          title: '头像',
          description: '裁剪到脸部。',
        },
        {
          title: '去除杂物',
          description: '去掉照片的边缘。',
        },
        {
          title: '截图细节',
          description: '只保留相关部分。',
        },
        {
          title: '产品图',
          description: '紧凑裁剪，再调整尺寸用于商品页面。',
        },
      ],
      whyMediaManipulator: [
        '带精确坐标的可视化裁剪器，并可在同一次处理中调整尺寸和转换格式。',
        '元数据可按你的选择保留或清除。',
      ],
      privacyNote: '你的图片由我们服务器上的ImageMagick裁剪到你选择的区域。不会向任何外部服务发送内容。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原图绝不会被更改：你下载的是一个新文件。',
      faq: [
        {
          question: '能按固定比例裁剪吗？',
          answer: '将裁剪框拖到你需要的比例；拖动时会显示宽度和高度。',
        },
        {
          question: '裁剪会损失画质吗？',
          answer: '保留下来的像素不会被改动。重新编码时请选择PNG或较高的JPG质量。',
        },
        {
          question: '能裁剪视频吗？',
          answer: '可以，使用“裁剪视频”工具。',
        },
        {
          question: '能先旋转吗？',
          answer: '先使用“旋转图片”工具，然后再裁剪。',
        },
      ],
      related: [
        {
          label: '裁剪视频',
          to: '/tools/crop-video',
          description: '视频版的同类工具。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在图片格式之间转换。',
        },
        {
          label: '调整图片尺寸',
          to: '/tools/image-resizer',
          description: '更改尺寸。',
        },
        {
          label: '为图片添加文字',
          to: '/tools/add-text-to-image',
          description: '添加说明文字或水印。',
        },
        {
          label: '图片滤镜',
          to: '/tools/image-filters',
          description: '棕褐色、素描、浮雕等效果。',
        },
        {
          label: '移除EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '清除位置和设备数据。',
        },
      ],
      embed: {
        title: '裁剪图片',
        description: '上传图片并点击“裁剪图片”打开可视化裁剪器。将裁剪框拖到你想要的区域并保存；点击“转换”时会应用裁剪。',
      },
    },
    'grayscale-image': {
      name: '将图片转换为黑白',
      h1: '在线将图片转换为黑白',
      tagline: '将彩色照片转为灰度，或转为复古色调的棕褐色，并以任意格式下载。',
      metaTitle: '免费在线将图片转换为黑白 | Media Manipulator',
      metaDescription: '免费在线黑白照片转换工具。将任意JPG、PNG、WebP或HEIC图片转为灰度或棕褐色并下载。可结合裁剪、尺寸调整和格式转换。无需注册。',
      ogTitle: '在线将图片转换为黑白',
      ogDescription: '一键转为灰度或棕褐色。免费，无需注册。',
      intro: '黑白让照片只剩下光线、形状和质感，能掩盖偏色和混合光源，并让一组照片呈现统一的风格。Media Manipulator在我们的服务器上用ImageMagick通过亮度加权转换为灰度，还提供棕褐色和复古色调，并可导出为任意图片格式。',
      whatItDoes: [
        '用正确的亮度加权将彩色图片转换为灰度。',
        '另有棕褐色和复古效果可选，带来温暖或怀旧的色调。',
        '可结合裁剪、尺寸调整、文字和格式转换。',
        '单色副本可以是JPG、PNG、WebP、AVIF或GIF。',
      ],
      flowSteps: [
        {
          title: '上传图片',
          description: '任何常见格式。',
        },
        {
          title: '保留灰度或选择棕褐色',
          description: '滤镜已预先选好。',
        },
        {
          title: '转换',
          description: 'ImageMagick执行转换。',
        },
        {
          title: '下载',
          description: '保存结果。',
        },
      ],
      advancedDetails: [
        '灰度使用Rec. 709亮度权重，因此绿色会比蓝色显得更亮，符合人眼的预期。',
        '棕褐色在灰度之后叠加色调；复古效果会额外加入轻微褪色和暗角。',
        '除非你选择原生以灰度存储的格式，否则输出会保留三个通道。',
      ],
      whyItMatters: [
        '单色能掩盖糟糕的色彩和混合光源。',
        '风格统一的一组黑白照片看起来像经过精心挑选。',
        '灰度图片压缩后体积更小。',
      ],
      useCases: [
        {
          title: '人像',
          description: '经典的黑白头像照。',
        },
        {
          title: '文档扫描',
          description: '将拍摄的页面转为灰度。',
        },
        {
          title: '复古风格',
          description: '为家庭照片加上棕褐色调。',
        },
        {
          title: '打印',
          description: '为黑白打印机做好准备。',
        },
      ],
      whyMediaManipulator: [
        '亮度准确的灰度，外加棕褐色和复古效果。',
        '在同一次上传中裁剪、调整尺寸和转换格式。',
      ],
      privacyNote: '你的图片由我们服务器上的ImageMagick去除色彩。不会向任何外部服务发送内容。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原图绝不会被更改：你下载的是一个新文件。',
      faq: [
        {
          question: '灰度还是去饱和？',
          answer: '这是亮度加权的灰度，看起来比单纯去除饱和度更自然。',
        },
        {
          question: '能得到棕褐色调吗？',
          answer: '可以。在滤镜选择框中选择棕褐色或复古。',
        },
        {
          question: '能对视频这样处理吗？',
          answer: '可以。使用“调整视频亮度与色彩”，并将饱和度设为-100。',
        },
        {
          question: '原始颜色还能恢复吗？',
          answer: '不能。请保留原始文件。',
        },
      ],
      related: [
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在图片格式之间转换。',
        },
        {
          label: '裁剪图片',
          to: '/tools/crop-image',
          description: '裁剪到指定区域。',
        },
        {
          label: '调整图片尺寸',
          to: '/tools/image-resizer',
          description: '更改尺寸。',
        },
        {
          label: '为图片添加文字',
          to: '/tools/add-text-to-image',
          description: '添加说明文字或水印。',
        },
        {
          label: '图片滤镜',
          to: '/tools/image-filters',
          description: '棕褐色、素描、浮雕等效果。',
        },
        {
          label: '移除EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '清除位置和设备数据。',
        },
      ],
      embed: {
        title: '将图片转换为黑白',
        description: '上传图片。滤镜已预设为灰度；如需更温暖的色调，可切换为棕褐色或复古。然后点击“转换”。',
      },
    },
    'image-filters': {
      name: '图片滤镜与特效',
      h1: '在线为图片添加滤镜和特效',
      tagline: '油画、素描、炭笔、浮雕、复古、漩涡、模糊、锐化等效果，一键应用于任意照片。',
      metaTitle: '免费在线图片滤镜：素描、油画、浮雕 | Media Manipulator',
      metaDescription: '免费在线照片滤镜。为JPG、PNG、WebP等格式的图片应用油画、铅笔素描、炭笔、浮雕、复古、棕褐色、漩涡、模糊或锐化效果，然后下载。无需注册。',
      ogTitle: '在线为图片添加滤镜和特效',
      ogDescription: '素描、油画、浮雕、复古等多种效果。免费，无需注册。',
      intro: '有时候，一张照片想变成别的样子：一幅用于请柬的素描、一幅用于打印的油画、一个浮雕效果的标志、一张漩涡状的抽象画。Media Manipulator在我们的服务器上应用ImageMagick的艺术滤镜和校正滤镜，从铅笔素描到锐化应有尽有，并可导出为任意图片格式，还能在同一次处理中选择裁剪、调整尺寸和添加说明文字。',
      whatItDoes: [
        '艺术效果：油画、素描、炭笔、浮雕、复古、棕褐色、漩涡、桶形畸变。',
        '校正效果：模糊、锐化、灰度。',
        '同一个下拉菜单中还提供45、90、180和270度旋转。',
        '可与裁剪、调整尺寸、文字叠加和格式转换搭配使用。',
      ],
      flowSteps: [
        {
          title: '上传图片',
          description: '任何常见格式。',
        },
        {
          title: '选择滤镜',
          description: '已预选油画。',
        },
        {
          title: '转换',
          description: '由ImageMagick渲染效果。',
        },
        {
          title: '下载',
          description: '保存结果。',
        },
      ],
      advancedDetails: [
        '油画和炭笔基于半径，效果会随图片尺寸变化；将图片调整到1500至2500 px可获得最强的效果。',
        '素描和浮雕最适合边缘清晰、对比度良好的图片。',
        '效果会直接渲染到像素中；请保留原图。',
      ],
      whyItMatters: [
        '在满是照片的信息流中，风格化的图片更加显眼。',
        '素描和绘画风格常用于贺卡、海报和印刷品。',
        '锐化和模糊是日常的校正操作。',
      ],
      useCases: [
        {
          title: '铅笔肖像',
          description: '为照片应用素描滤镜，用于制作贺卡。',
        },
        {
          title: '绘画风格印刷品',
          description: '用油画效果制作画布印刷品。',
        },
        {
          title: '浮雕标志',
          description: '为平面标志添加浮雕效果。',
        },
        {
          title: '锐化扫描件',
          description: '让发软的扫描件边缘更清晰。',
        },
      ],
      whyMediaManipulator: [
        '一个下拉菜单中提供十二种艺术和校正滤镜。',
        '同一次上传即可裁剪、调整尺寸、添加说明文字并转换格式。',
      ],
      privacyNote: '你选择的滤镜由我们服务器上的ImageMagick应用到你的图片上。不会向任何外部服务发送数据。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原图永远不会被修改：你下载的是一个新文件。',
      faq: [
        {
          question: '可以调整强度吗？',
          answer: '滤镜使用经过调校的固定强度。把图片调大或调小，即可改变基于半径的效果看起来有多强。',
        },
        {
          question: '可以叠加多个滤镜吗？',
          answer: '每次处理只应用一种滤镜；如需第二种，请把结果再次交给此工具处理。',
        },
        {
          question: '有AI风格迁移吗？',
          answer: '没有。这些是经典的ImageMagick效果，可以即时完成。',
        },
        {
          question: '哪种滤镜适合标志？',
          answer: '对高对比度的标志使用浮雕或炭笔。',
        },
      ],
      related: [
        {
          label: '转为黑白',
          to: '/tools/grayscale-image',
          description: '灰度和棕褐色。',
        },
        {
          label: '模糊图片',
          to: '/tools/blur-image',
          description: '柔化或遮挡。',
        },
        {
          label: '锐化图片',
          to: '/tools/sharpen-image',
          description: '提升细节。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在不同图片格式之间转换。',
        },
        {
          label: '裁剪图片',
          to: '/tools/crop-image',
          description: '裁出指定区域。',
        },
        {
          label: '调整图片尺寸',
          to: '/tools/image-resizer',
          description: '更改图片尺寸。',
        },
        {
          label: '为图片添加文字',
          to: '/tools/add-text-to-image',
          description: '添加说明文字或水印。',
        },
        {
          label: '移除EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '清除位置和设备数据。',
        },
      ],
      embed: {
        title: '为图片应用滤镜',
        description: '上传图片并选择滤镜；已预选油画。还可选择素描、炭笔、浮雕、复古、棕褐色、漩涡、桶形畸变、模糊和锐化。点击“转换”。',
      },
    },
    'rotate-image': {
      name: '旋转图片',
      h1: '免费在线旋转图片',
      tagline: '将照片旋转90°、180°或270°，修正横置的扫描件或手机照片，并以任意格式下载。',
      metaTitle: '免费在线旋转图片（90°、180°、270°） | Media Manipulator',
      metaDescription: '免费在线图片旋转工具。将JPG、PNG、WebP或HEIC照片旋转90、180或270度，或旋转45度制造倾斜效果，然后下载。旋转会直接写入像素。无需注册。',
      ogTitle: '免费在线旋转图片',
      ogDescription: '一键修正横置的照片。免费，无需注册。',
      intro: '手机把方向记录为一个标签，而有些看图软件会忽略它；扫描仪和老式相机则干脆把方向弄错。直接旋转像素本身，就能一劳永逸地解决问题。Media Manipulator在我们的服务器上用ImageMagick将图片旋转90、180、270或45度，会先应用现有的方向标签，并可导出为任意格式。',
      whatItDoes: [
        '旋转90°（顺时针）、180°、270°（逆时针）或45°。',
        '将旋转写入像素，并清除EXIF方向标签。',
        '可与裁剪、调整尺寸和格式转换搭配使用。',
        '将旋转后的图片保存为JPG、PNG、WebP、AVIF或GIF。',
      ],
      flowSteps: [
        {
          title: '上传图片',
          description: '任何常见格式。',
        },
        {
          title: '选择角度',
          description: '已预选90°。',
        },
        {
          title: '转换',
          description: '由ImageMagick旋转并编码。',
        },
        {
          title: '下载',
          description: '保存摆正后的图片。',
        },
      ],
      advancedDetails: [
        '会先应用现有的EXIF方向，因此你看到的画面就是被旋转的画面。',
        '45°旋转会在四角添加背景填充；如有需要，之后再进行裁剪。',
        '如需水平或垂直镜像，请改用翻转和镜像工具。',
      ],
      whyItMatters: [
        '横置的照片是论坛和表单上最常见的上传问题。',
        '有些应用会忽略方向标签，因此把旋转写入像素是唯一可靠的修复方法。',
        '扫描件和老式相机拍摄的文件常常根本没有方向标签。',
      ],
      useCases: [
        {
          title: '横置的手机照片',
          description: '旋转90°，让它在任何地方都正向显示。',
        },
        {
          title: '倒置的扫描件',
          description: '旋转180°。',
        },
        {
          title: '修正表单上传',
          description: '在提交证件照片之前先将其旋转。',
        },
        {
          title: '倾斜效果',
          description: '旋转45°，用作设计元素。',
        },
      ],
      whyMediaManipulator: [
        '旋转直接应用于像素，并正确处理方向标签。',
        '同一次上传即可裁剪、调整尺寸和转换格式。',
      ],
      privacyNote: '你的图片由我们服务器上的ImageMagick按你选择的角度旋转。不会向任何外部服务发送数据。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原图永远不会被修改：你下载的是一个新文件。',
      faq: [
        {
          question: '为什么我的照片在手机上是正的，在别处却是横的？',
          answer: '你的手机写入了一个方向标签，而另一个应用忽略了它。在这里旋转，会把方向直接写入像素。',
        },
        {
          question: '旋转会损失画质吗？',
          answer: '按90°的倍数旋转在几何上是无损的；唯一的损耗来自重新编码。请使用PNG或较高的JPG质量。',
        },
        {
          question: '可以按任意角度旋转吗？',
          answer: '只提供45°以及90°的倍数。',
        },
        {
          question: '可以改为镜像吗？',
          answer: '这里不行；目前不提供图片镜像功能。',
        },
      ],
      related: [
        {
          label: '旋转视频',
          to: '/tools/rotate-video',
          description: '同样的功能，用于视频。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在不同图片格式之间转换。',
        },
        {
          label: '裁剪图片',
          to: '/tools/crop-image',
          description: '裁出指定区域。',
        },
        {
          label: '调整图片尺寸',
          to: '/tools/image-resizer',
          description: '更改图片尺寸。',
        },
        {
          label: '为图片添加文字',
          to: '/tools/add-text-to-image',
          description: '添加说明文字或水印。',
        },
        {
          label: '图片滤镜',
          to: '/tools/image-filters',
          description: '棕褐色、素描、浮雕等效果。',
        },
        {
          label: '移除EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '清除位置和设备数据。',
        },
      ],
      embed: {
        title: '旋转图片',
        description: '上传图片。滤镜下拉菜单已预设为旋转90°；也可以改选180°、270°或45°。旋转会应用于像素，因此所有看图软件的显示都一致。点击“转换”。',
      },
    },
    'sharpen-image': {
      name: '锐化图片',
      h1: '免费在线锐化图片',
      tagline: '一键锐化，让略微模糊的照片或扫描件边缘更清晰，并以任意格式下载。',
      metaTitle: '免费在线锐化图片 | Media Manipulator',
      metaDescription: '免费在线图片锐化工具。让略显模糊的JPG、PNG、WebP或HEIC照片或扫描件变得清晰，然后下载。如需真正恢复细节，请试试AI图片修复。无需注册。',
      ogTitle: '免费在线锐化图片',
      ogDescription: '一键让发软的照片变清晰。免费，无需注册。',
      intro: '因镜头较慢、调整尺寸或扫描仪而略显模糊的照片，经过一次提高边缘对比度的锐化处理会好看很多。Media Manipulator在我们的服务器上用ImageMagick应用USM锐化，并可导出为任意格式。如果模糊程度不只是略微发软，AI图片修复工具能恢复锐化无法找回的细节。',
      whatItDoes: [
        '对任意图片应用经过调校的USM锐化。',
        '可与调整尺寸搭配：缩小后再锐化，得到清晰的缩略图。',
        '将锐化结果下载为JPG、PNG、WebP、AVIF或GIF。',
        '并排对比原图和结果。',
      ],
      flowSteps: [
        {
          title: '上传图片',
          description: '任何常见格式。',
        },
        {
          title: '保持选择锐化',
          description: '如有需要，可同时调整尺寸。',
        },
        {
          title: '转换',
          description: '由ImageMagick应用USM锐化。',
        },
        {
          title: '下载',
          description: '保存更清晰的图片。',
        },
      ],
      advancedDetails: [
        '锐化会提高边缘处的局部对比度，但不会增加细节。过度锐化会产生光晕。',
        '先缩小尺寸再锐化，是制作清晰网页图片的经典方法。',
        '对于运动模糊、失焦或低分辨率的源图，请使用AI图片修复。',
      ],
      whyItMatters: [
        '缩小后的图片会损失边缘对比度，不经锐化就会显得发软。',
        '文件和印刷品的扫描件往往略显模糊。',
        '清晰的图片给人画质更高的印象。',
      ],
      useCases: [
        {
          title: '缩略图',
          description: '为网页调整尺寸并锐化。',
        },
        {
          title: '发软的扫描件',
          description: '让扫描的印刷品更清晰。',
        },
        {
          title: '商品照片',
          description: '上架前增强边缘清晰度。',
        },
        {
          title: '轻微失焦',
          description: '找回一点视觉上的清晰感。',
        },
      ],
      whyMediaManipulator: [
        '经过调校的USM锐化，可在同一次处理中调整尺寸。',
        '锐化不够时，还可使用AI修复。',
      ],
      privacyNote: '你的图片由我们服务器上的ImageMagick按你设置的强度进行锐化。不会向任何外部服务发送数据。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原图永远不会被修改：你下载的是一个新文件。',
      faq: [
        {
          question: '能修复模糊的照片吗？',
          answer: '它对轻微发软有帮助。对于真正的模糊，请使用AI图片修复，它会重建细节。',
        },
        {
          question: '可以控制强度吗？',
          answer: '强度是经过调校的固定值；运行两次可获得更强的效果，或使用较小的输出尺寸，让效果相对更强。',
        },
        {
          question: '会增加噪点吗？',
          answer: '锐化可能会突显已有的颗粒。请使用较高的JPG质量，以免噪点进一步叠加。',
        },
      ],
      related: [
        {
          label: 'AI图片修复',
          to: '/tools/ai-image-restoration',
          description: '用AI恢复真实细节。',
        },
        {
          label: 'AI图片放大器',
          to: '/tools/ai-image-upscaler',
          description: '放大而不模糊。',
        },
        {
          label: '模糊图片',
          to: '/tools/blur-image',
          description: '效果正好相反。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在不同图片格式之间转换。',
        },
        {
          label: '裁剪图片',
          to: '/tools/crop-image',
          description: '裁出指定区域。',
        },
        {
          label: '调整图片尺寸',
          to: '/tools/image-resizer',
          description: '更改图片尺寸。',
        },
        {
          label: '为图片添加文字',
          to: '/tools/add-text-to-image',
          description: '添加说明文字或水印。',
        },
        {
          label: '图片滤镜',
          to: '/tools/image-filters',
          description: '棕褐色、素描、浮雕等效果。',
        },
        {
          label: '移除EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '清除位置和设备数据。',
        },
      ],
      embed: {
        title: '锐化图片',
        description: '上传图片。滤镜已预设为锐化。点击“转换”，然后在查看器中将结果与原图对比。',
      },
    },
    'blur-image': {
      name: '模糊图片',
      h1: '免费在线模糊图片',
      tagline: '将整张照片柔化，用作背景、占位图或隐私遮挡，并以任意格式下载。',
      metaTitle: '免费在线模糊图片 | Media Manipulator',
      metaDescription: '免费在线图片模糊工具。将整张JPG、PNG、WebP或HEIC照片柔化，用作背景、占位图或隐私遮挡。如只需模糊人脸，请使用人脸模糊工具。无需注册。',
      ogTitle: '免费在线模糊图片',
      ogDescription: '一键柔化照片。免费，无需注册。',
      intro: '模糊后的照片可以成为文字背后的柔和背景、真实图片加载时的低细节占位图，或截图的隐私遮挡。Media Manipulator在我们的服务器上用ImageMagick对整张图片应用高斯模糊，并可导出为任意格式。如只需模糊人脸或车牌，AI人脸模糊和文字遮盖工具可以专门处理这些区域。',
      whatItDoes: [
        '对整张图片应用高斯模糊。',
        '可与调整尺寸搭配，制作小巧的模糊占位图。',
        '柔化后的图片以JPG、PNG、WebP、AVIF或GIF格式返回。',
        '相关工具可有选择地模糊人脸或遮盖文字。',
      ],
      flowSteps: [
        {
          title: '上传图片',
          description: '任何常见格式。',
        },
        {
          title: '保持选择模糊',
          description: '可选择同时调整尺寸。',
        },
        {
          title: '转换',
          description: '由ImageMagick模糊并编码。',
        },
        {
          title: '下载',
          description: '保存柔化后的图片。',
        },
      ],
      advancedDetails: [
        '模糊半径是固定的；如需更强的效果，请先缩小尺寸，模糊后再放大。',
        '模糊后的图片能压缩得非常小，因此很适合用作占位图。',
        '模糊截图并不等于遮盖：文字有时可以被还原。敏感内容请使用文字遮盖。',
      ],
      whyItMatters: [
        '模糊背景能让叠加的文字保持清晰易读。',
        '低画质的图片占位图能提升页面的感知速度。',
        '照片的柔化版本是一种常见的设计元素。',
      ],
      useCases: [
        {
          title: '文字背景',
          description: '模糊一张照片，在上面放置标题。',
        },
        {
          title: '占位图',
          description: '用于懒加载的小型模糊预览图。',
        },
        {
          title: '隐私遮挡',
          description: '分享前先柔化截图，再进行正式遮盖。',
        },
        {
          title: '梦幻效果',
          description: '用于设计的柔和叠加层。',
        },
      ],
      whyMediaManipulator: [
        '这里提供整图模糊；人脸模糊和文字遮盖则由专门的AI工具完成。',
        '同一次上传即可调整尺寸和转换格式。',
      ],
      privacyNote: '你的图片由我们服务器上的ImageMagick按你设置的半径进行模糊。不会向任何外部服务发送数据。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原图永远不会被修改：你下载的是一个新文件。',
      faq: [
        {
          question: '可以只模糊图片的一部分吗？',
          answer: '人脸请使用“模糊照片中的人脸”，文字和车牌请使用“遮盖图片中的文字”。',
        },
        {
          question: '模糊足以隐藏文字吗？',
          answer: '并不可靠。请使用遮盖工具，它会把该区域完全涂盖。',
        },
        {
          question: '可以控制模糊程度吗？',
          answer: '半径是固定的；在模糊之前先缩小尺寸，可获得更强的效果。',
        },
      ],
      related: [
        {
          label: '模糊照片中的人脸',
          to: '/tools/blur-faces-in-photo',
          description: 'AI人脸模糊。',
        },
        {
          label: '遮盖图片中的文字',
          to: '/tools/redact-text-in-image',
          description: '隐藏文字和车牌。',
        },
        {
          label: '锐化图片',
          to: '/tools/sharpen-image',
          description: '效果正好相反。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在不同图片格式之间转换。',
        },
        {
          label: '裁剪图片',
          to: '/tools/crop-image',
          description: '裁出指定区域。',
        },
        {
          label: '调整图片尺寸',
          to: '/tools/image-resizer',
          description: '更改图片尺寸。',
        },
        {
          label: '为图片添加文字',
          to: '/tools/add-text-to-image',
          description: '添加说明文字或水印。',
        },
        {
          label: '图片滤镜',
          to: '/tools/image-filters',
          description: '棕褐色、素描、浮雕等效果。',
        },
        {
          label: '移除EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '清除位置和设备数据。',
        },
      ],
      embed: {
        title: '模糊图片',
        description: '上传图片。滤镜已预设为模糊，会柔化整张图片。如只需模糊人脸，请使用“模糊照片中的人脸”工具。点击“转换”。',
      },
    },
    'generate-vtt-captions': {
      name: 'VTT字幕生成器',
      h1: '从视频或音频生成WebVTT字幕',
      tagline: '在我们自己的GPU服务器上，通过AI转录为HTML5视频、YouTube或播放器生成.vtt字幕文件。',
      metaTitle: '在线VTT字幕生成器（免费AI） | Media Manipulator',
      metaDescription: '免费在线WebVTT字幕生成器。上传视频或音频文件，下载带时间轴字幕的.vtt文件，可用于HTML5视频、YouTube、Vimeo或任何播放器。运行在我们自己的GPU上。',
      ogTitle: '在线生成WebVTT字幕',
      ogDescription: '为任何视频生成由AI标定时间的.vtt字幕。免费，无需注册。',
      intro: 'WebVTT是网页的字幕格式：HTML5的track元素、YouTube、Vimeo、HLS和DASH播放器都能读取它。Media Manipulator在我们运营的GPU服务器上用Whisper模型为任意视频或音频生成带时间轴的VTT字幕，因此你的媒体绝不会发送给第三方AI；结果会在字幕查看器中打开，你可以在下载前检查时间轴。',
      whatItDoes: [
        '转录语音，并将其切分为带时间的字幕条目。',
        '输出符合标准的.vtt文件。',
        '自动检测语言。',
        '运行在我们自己的GPU上；不使用第三方AI服务商。',
      ],
      flowSteps: [
        {
          title: '上传视频或音频',
          description: '任何常见格式。',
        },
        {
          title: '保持选择VTT',
          description: '或切换为SRT、纯文本或JSON。',
        },
        {
          title: '转录',
          description: 'Whisper为每条字幕标定时间。',
        },
        {
          title: '下载',
          description: '将.vtt附加到你的播放器。',
        },
      ],
      advancedDetails: [
        '字幕条目遵循Whisper的分段，通常每条为一句话或一个分句，时长2到7秒。',
        '可使用字幕翻译器将结果翻译成其他语言。',
        '如需烧录字幕，请使用Darkroom的字幕轨道。',
      ],
      whyItMatters: [
        '字幕是无障碍的必要条件，而且大多数观众会在静音状态下看字幕观看视频。',
        'VTT是HTML5视频唯一原生支持的字幕格式。',
        '带时间轴的字幕可以被搜索引擎索引。',
      ],
      useCases: [
        {
          title: 'HTML5视频',
          description: '用track元素附加该文件。',
        },
        {
          title: '上传到YouTube',
          description: '将.vtt作为字幕轨道上传。',
        },
        {
          title: '课程视频',
          description: '为LMS播放器提供字幕。',
        },
        {
          title: '稍后翻译',
          description: '输入VTT，输出翻译后的VTT。',
        },
      ],
      whyMediaManipulator: [
        'Whisper运行在我们自己的硬件上；不会向第三方AI发送任何内容。',
        '可在字幕查看器中检查时间轴，然后再下载。',
      ],
      privacyNote: '你文件中的语音由我们自己GPU服务器上的Whisper转录，并按时间轴生成WebVTT字幕。AI处理在我们运营的硬件上运行，绝不使用第三方AI服务商，你上传的任何内容都不会被用于训练模型。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: 'VTT还是SRT？',
          answer: '网页播放器和YouTube用VTT；视频编辑软件和一些较旧的平台用SRT。两种格式都提供。',
        },
        {
          question: '可以编辑字幕吗？',
          answer: '下载.vtt后，可用任何文本编辑器进行编辑；该格式是纯文本。',
        },
        {
          question: '可以翻译字幕吗？',
          answer: '可以，使用字幕翻译器工具即可。',
        },
        {
          question: '我的视频会被发送给第三方吗？',
          answer: '不会。转录在我们自己的GPU服务器上运行。',
        },
        {
          question: '这会占用我的额度吗？',
          answer: '每个VTT文件计为一次AI任务，从AI任务额度中扣除，绝不占用常规任务额度。失败的任务不计入。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '每个字幕文件计为一次AI任务；失败的任务不计入。',
        ],
      },
      related: [
        {
          label: 'SRT字幕生成器',
          to: '/tools/srt-generator',
          description: 'SubRip格式。',
        },
        {
          label: '视频转录',
          to: '/tools/transcribe-video',
          description: '纯文本或JSON。',
        },
        {
          label: '字幕翻译器',
          to: '/tools/caption-translator',
          description: '翻译字幕。',
        },
        {
          label: 'Darkroom视频编辑器',
          to: '/tools/content-studio',
          description: '将字幕烧录到视频中。',
        },
      ],
      embed: {
        title: '生成VTT字幕',
        description: '上传视频或音频文件。输出已预设为WebVTT；转录文本由我们GPU服务器上的Whisper标定时间，并以.vtt文件返回，你可以用track元素附加它，或将其上传到平台。',
      },
    },
    // MM75: summarize-video / summarize-audio full page bodies (model-written, needs native review).
    'summarize-video': {
      name: '视频摘要',
      h1: '用 AI 总结视频：章节、主题和画面文字',
      tagline: '为讲座、会议或教程生成文字摘要，附带可点击的章节、主题和画面文字，全部在我们自己的 GPU 服务器上完成。',
      metaTitle: '带章节的 AI 视频摘要工具 | Media Manipulator',
      metaDescription: '上传视频，即可获得带时间戳章节、主题和画面文字的文字摘要。AI 在我们自己的 GPU 服务器上运行，绝不使用第三方 AI。需要免费账号。',
      ogTitle: '用 AI 总结视频',
      ogDescription: '带可点击章节、主题和画面文字的文字摘要。需要免费账号。',
      embed: {
        title: '总结视频',
        description: '登录后上传视频（或音频文件），并选择摘要语言。你会得到标题、简短摘要、可跳转到视频对应时刻的章节、主题以及画面中出现的文字。',
      },
      intro: '没人愿意为了找出重要的五分钟，把一小时的会议或讲座重看一遍。Media Manipulator 替你看、替你听：先用 Whisper 转录语音，再用视觉模型查看在画面变化处挑选的帧，并综合两者撰写摘要，全程都在我们运营的 GPU 服务器上完成。结果是一份简短的文档：标题、几句话的概述、带起止时间的章节、主题，以及画面中出现的文字。点击章节即可跳转到视频中的对应时刻，也可以将全部内容复制为 Markdown，或下载为 Markdown 或 JSON。摘要需要免费账号。',
      whatItDoes: [
        '为整个视频撰写标题和三到六句话的摘要。',
        '将视频划分为带起止时间的章节；点击章节，播放器会跳转到对应时刻。',
        '列出主题和画面中出现的文字，并标注其首次出现的时间。',
        '描述画面和语音，并说明哪些内容无法处理（例如没有语音）。',
        '用你选择的语言撰写摘要，或使用视频中所说的语言。',
      ],
      flowSteps: [
        {
          title: '登录',
          description: '有免费账号即可。',
        },
        {
          title: '上传',
          description: '视频或音频文件。',
        },
        {
          title: '生成摘要',
          description: '语音和画面帧在我们的 GPU 服务器上分析。',
        },
        {
          title: '阅读',
          description: '点击章节、复制 Markdown、下载 .md 或 .json。',
        },
      ],
      advancedDetails: [
        '语音使用 Whisper 转录；画面帧在场景切换处挑选，数量不超过你的套餐的帧数预算（Free 24 帧，Premium 48 帧，Pro 96 帧），并由视觉模型分批描述。',
        '语言模型根据转录文本和画面帧笔记撰写摘要。Pro 账号可在可用时要求由更大的模型生成更深入的摘要。',
        '一次摘要计为每日 AI 任务额度中的一次 AI 任务；失败或被拒绝的任务不计入。',
        '转录文本由机器生成，因此人名和数字可能有误。摘要会在备注中说明这一点。',
      ],
      whyItMatters: [
        '带章节的摘要一分钟就能浏览完，视频则不行。',
        '可点击的时间戳能直接带你到需要的部分。',
        '画面文字能捕捉到幻灯片标题和字幕，这些内容语音里从来不会念出来。',
      ],
      useCases: [
        {
          title: '会议纪要',
          description: '决议和议题，并附上时间以便核对细节。',
        },
        {
          title: '讲座笔记',
          description: '按小节划分的章节和幻灯片文字，方便复习。',
        },
        {
          title: '教程大纲',
          description: '把步骤整理成章节，想看哪一步就跳到哪一步。',
        },
        {
          title: '访谈概览',
          description: '聊了什么，在哪里聊的。',
        },
      ],
      whyMediaManipulator: [
        'Whisper 以及视觉和语言模型都运行在我们自己运营的硬件上；你的视频绝不会发送给第三方 AI。',
        '章节可直接在结果查看器中跳转到你自己的视频。',
      ],
      privacyNote: '摘要需要免费账号，因此任务会关联到该账号。你的文件在我们自己的服务器上处理，AI 模型运行在我们运营的 GPU 服务器上；不会向任何第三方 AI 服务商发送数据。访客的文件保留 24 小时；使用免费账号，你可以选择保留 24 小时到 2 年。',
      faq: [
        {
          question: '需要账号吗？',
          answer: '需要，一个免费账号即可。摘要会在我们的 GPU 服务器上运行多个 AI 模型，因此仅限已登录用户使用。',
        },
        {
          question: '我会得到什么？',
          answer: '标题、简短摘要、带起止时间的章节、主题、带时间的画面文字、对画面和语音的描述，以及关于无法处理内容的备注。',
        },
        {
          question: '可以选择摘要的语言吗？',
          answer: '可以。你可以从本站的 18 种语言中任选一种，或选择“与语音语言相同”，用视频中所说的语言撰写。',
        },
        {
          question: '如果视频没有语音怎么办？',
          answer: '摘要将仅根据画面撰写，并在备注中说明这一点。既没有画面也没有声音的文件会被拒绝，且不计入额度。',
        },
        {
          question: '我的视频会被发送给第三方吗？',
          answer: '不会。所有模型都运行在我们运营的 GPU 服务器上。',
        },
        {
          question: '这会占用我的额度吗？',
          answer: '会，计为一次 AI 任务。失败的任务不计入。',
        },
      ],
      related: [
        {
          label: '音频摘要',
          to: '/tools/summarize-audio',
          description: '适用于播客和录音。',
        },
        {
          label: '视频转录',
          to: '/tools/transcribe-video',
          description: '完整的转录文本。',
        },
        {
          label: '音频转录',
          to: '/tools/transcribe-audio',
          description: '适用于音频文件。',
        },
        {
          label: '消除背景噪音',
          to: '/tools/remove-background-noise',
          description: '先清理音频。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '计为一次 AI 任务；失败的任务不计入。',
          '时长上限取决于你的套餐的视频时长限制。',
        ],
      },
    },
    'summarize-audio': {
      name: '音频摘要',
      h1: '用 AI 总结音频录音',
      tagline: '把播客、访谈或语音备忘录变成带章节和主题的文字摘要，全部在我们自己的 GPU 服务器上完成。',
      metaTitle: '带章节的 AI 音频摘要工具 | Media Manipulator',
      metaDescription: '上传 MP3、WAV 或 M4A，即可获得带时间戳章节和主题的文字摘要。Whisper 和语言模型都运行在我们自己的 GPU 服务器上。需要免费账号。',
      ogTitle: '用 AI 总结音频录音',
      ogDescription: '为任何录音生成带章节和主题的文字摘要。需要免费账号。',
      embed: {
        title: '总结音频文件',
        description: '登录后上传录音，并选择摘要语言。你会得到标题、简短摘要、可跳转到录音对应时刻的章节以及主题。',
      },
      intro: '一集播客、一场访谈或一段很长的语音备忘录，做成一页文字比听一个小时的音频更好用。Media Manipulator 用 Whisper 转录录音，再由语言模型根据转录文本撰写摘要，两者都在我们运营的 GPU 服务器上完成。你会得到标题、几句话的概述、带起止时间的章节和主题。点击章节即可跳转到录音中的对应位置，也可以将摘要复制为 Markdown，或下载为 Markdown 或 JSON。摘要需要免费账号。',
      whatItDoes: [
        '为录音撰写标题和简短摘要。',
        '将录音划分为带时间的章节；点击章节，播放器会跳转到对应位置。',
        '列出主题，并描述说话人及其语气。',
        '用你选择的语言撰写摘要，或使用录音中所说的语言。',
      ],
      flowSteps: [
        {
          title: '登录',
          description: '有免费账号即可。',
        },
        {
          title: '上传',
          description: 'MP3、WAV、M4A 及其他音频。',
        },
        {
          title: '生成摘要',
          description: 'Whisper 和语言模型在我们的 GPU 服务器上运行。',
        },
        {
          title: '阅读',
          description: '点击章节、复制 Markdown、下载 .md 或 .json。',
        },
      ],
      advancedDetails: [
        '语音使用 Whisper 转录；语言模型根据转录文本撰写摘要。',
        '带封面图的音频文件会按音频处理：图片会被忽略。',
        '一次摘要计为每日 AI 任务额度中的一次 AI 任务；失败或被拒绝的任务不计入。',
        '转录文本由机器生成，因此人名和数字可能有误。摘要会在备注中说明这一点。',
      ],
      whyItMatters: [
        '一分钟就能读完摘要，再决定要听哪一段。',
        '带时间的章节让一段很长的录音变得便于导航。',
        '主题让往期节目库变得可以搜索。',
      ],
      useCases: [
        {
          title: '播客节目笔记',
          description: '为单集页面准备的章节和主题。',
        },
        {
          title: '访谈回顾',
          description: '谈了哪些内容，并附上可引用的时间点。',
        },
        {
          title: '语音备忘录转笔记',
          description: '把絮絮叨叨的备忘录变成简短的一页。',
        },
        {
          title: '通话摘要',
          description: '一通录音通话的要点。',
        },
      ],
      whyMediaManipulator: [
        'Whisper 和语言模型运行在我们自己运营的硬件上；你的录音绝不会发送给第三方 AI。',
        '章节可直接在结果查看器中跳转到你自己的录音。',
      ],
      privacyNote: '摘要需要免费账号，因此任务会关联到该账号。你的文件在我们自己的服务器上处理，AI 模型运行在我们运营的 GPU 服务器上；不会向任何第三方 AI 服务商发送数据。访客的文件保留 24 小时；使用免费账号，你可以选择保留 24 小时到 2 年。',
      faq: [
        {
          question: '需要账号吗？',
          answer: '需要，一个免费账号即可。摘要会在我们的 GPU 服务器上运行 AI 模型，因此仅限已登录用户使用。',
        },
        {
          question: '这与转录有什么不同？',
          answer: '转录会给出每一个字。摘要则根据该转录文本，给出标题、几句话的概述、章节和主题。',
        },
        {
          question: '可以选择摘要的语言吗？',
          answer: '可以。你可以从本站的 18 种语言中任选一种，或选择“与语音语言相同”。',
        },
        {
          question: '我的录音会被发送给第三方吗？',
          answer: '不会。模型都运行在我们运营的 GPU 服务器上。',
        },
        {
          question: '这会占用我的额度吗？',
          answer: '会，计为一次 AI 任务。失败的任务不计入。',
        },
      ],
      related: [
        {
          label: '音频转录',
          to: '/tools/transcribe-audio',
          description: '每一个字，以文本或字幕呈现。',
        },
        {
          label: '视频摘要',
          to: '/tools/summarize-video',
          description: '额外包含画面和画面文字。',
        },
        {
          label: '消除背景噪音',
          to: '/tools/remove-background-noise',
          description: '先清理音频。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '计为一次 AI 任务；失败的任务不计入。',
        ],
      },
    },
    // MM78 voices: name + tagline (model-written, needs native review).
    'voice-cloning': {
      name: '声音克隆',
      h1: '用一段简短录音克隆你的声音',
      tagline: '录制或上传 5 到 60 秒你自己的语音，创建一个声音，让它用二十多种语言朗读任何文本。',
      metaTitle: '用录音克隆你自己的声音 | Media Manipulator',
      metaDescription: '用 5 到 60 秒你自己的语音创建一个声音，并用它将文本转为 20 多种语言的语音。在我们自己的服务器上运行；输出带有水印。',
      ogTitle: '用一段简短录音克隆你自己的声音',
      ogDescription: '读几句话，确认这是你的声音，然后用它生成 20 多种语言的语音。自托管模型，输出带有水印。',
      intro: '声音克隆会根据你自己的一段简短语音录音，生成一个可重复使用的声音。对着麦克风自然地读几句话，或上传一段 5 到 60 秒的片段，确认这是你的声音（或你已获得说话人的明确许可），然后创建声音。它会出现在“我的声音”中，并附带一段简短的预览。此后，你可以输入任何文本，从二十多种语言中选择一种并设置情感强度，即可获得用这个声音朗读的 MP3 和 WAV 文件。模型运行在我们运营的 GPU 服务器上，每个生成的文件都带有听不见的水印，你录制的任何内容都不会被用于训练任何模型。',
      whatItDoes: [
        '用在浏览器中录制或以音频文件上传的 5 到 60 秒语音，创建一个已保存的声音。',
        '在计入任何额度之前，检查录音是否足够长且确实包含语音。',
        '用已保存的声音以 20 多种语言朗读任何文本，情感控制可从平静调到富有表现力。',
        '以 MP3 格式返回语音，并可在你的浏览器中生成 WAV 下载。',
        '为每个生成的文件加上听不见的水印，以便识别合成语音。',
      ],
      flowSteps: [
        {
          title: '录制或上传',
          description: '在安静的房间里录制 5 到 60 秒清晰的语音。',
        },
        {
          title: '确认同意',
          description: '勾选确认这是你的声音，或你已获得说话人的许可。',
        },
        {
          title: '创建声音',
          description: '系统会渲染一段简短预览，并将声音保存到你的账号。',
        },
        {
          title: '生成语音',
          description: '输入文本，选择语言和情感，然后下载音频。',
        },
      ],
      advancedDetails: [
        '声音引擎是 Chatterbox Multilingual（MIT 许可证），运行在我们自己的 GPU 服务器上。它在你生成语音的那一刻根据参考片段进行克隆；不会用你的声音训练任何模型。',
        '创建声音计为一次 AI 任务（即预览）。每次生成计为一次 AI 任务。失败或被拒绝的请求不计入。',
        '每次请求的文本长度取决于你的套餐，大约按每秒语音 18 个字符计算；文本框下方的计数器会显示你的上限。',
        '每个生成的文件都带有 Resemble AI 的 PerTh 水印，它听不见，并能在常见的编辑和压缩后保留下来。',
        '闲置一段时间后的第一次请求可能需要长达 20 秒，因为引擎需要加载。',
      ],
      whyItMatters: [
        '用你自己的声音配旁白，不必每次修改脚本都预约录音棚。',
        '同一个声音说另一种语言，让视频或课程触达更多人。',
        '自托管引擎意味着你的录音留在我们这里，而不是交给第三方 AI 服务商。',
      ],
      useCases: [
        {
          title: '视频旁白',
          description: '重新朗读脚本中修改过的一句，无需重新录制。',
        },
        {
          title: '课程和教程',
          description: '用多种语言为同一节课配音。',
        },
        {
          title: '无障碍',
          description: '用熟悉的声音朗读长篇文字。',
        },
        {
          title: '原型制作',
          description: '在录制最终版本之前，先听听脚本读出来的效果。',
        },
      ],
      whyMediaManipulator: [
        '在我们运营的硬件上运行开放模型；录音绝不会发送给外部 AI 服务。',
        '创建任何声音之前都需要明确同意，并与声音一同记录。',
        '输出带有水印，每个已保存的声音都可以由你自己删除。',
      ],
      privacyNote: '你录制或上传的 5 到 60 秒语音会成为你账号中的一个已保存声音；每次这个声音说话时，模型读取的都是这段参考录音。语音录音和已保存的声音在我们自己的服务器上处理；不会向第三方 AI 服务商发送任何内容，也不会用于训练任何模型。已保存的声音（其参考录音和预览）存储在你的账号中，遵循你选择的保留期限，并可随时在“账号 > 声音”中删除；删除账号时也会一并删除。生成的音频与其他任何结果一样保留：访客的文件保留 24 小时；使用免费账号，你可以选择保留 24 小时到 2 年。',
      faq: [
        {
          question: '可以克隆别人的声音吗？',
          answer: '只有在获得该人明确许可的情况下才可以。在创建声音之前，你必须确认这是你的声音或你已获得许可，我们会将这份确认与声音一同存储。我们的条款禁止未经许可冒充他人、欺诈以及政治深度伪造。',
        },
        {
          question: '听起来会和我一模一样吗？',
          answer: '通常听起来能明显认出是说话人，但并非完美复制：口音、特殊嗓音和嘈杂的录音更难处理。在安静的房间里自然地读几句话，效果最好。',
        },
        {
          question: '我的录音会被用于训练 AI 模型吗？',
          answer: '不会。你上传或生成的任何内容都不会被用于训练任何模型。每次生成语音时，声音都是根据你的参考片段克隆的。',
        },
        {
          question: '别人能分辨出音频是生成的吗？',
          answer: '用已保存的声音生成的每个文件都带有听不见的水印，检测工具可以读取它。它不会改变音频的听感。',
        },
        {
          question: '如何删除声音？',
          answer: '打开“账号 > 声音”并将其删除。它的参考录音和预览会被移除；你已生成的音频会保留在历史记录中，直到其自身的保留期限结束。',
        },
        {
          question: '可以保留多少个声音？',
          answer: '这取决于你的套餐；页面会显示你已保存的数量和上限。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '参考录音必须为 5 到 60 秒，且包含语音。',
          '保存声音需要账号；预设声音无需账号即可使用。',
        ],
      },
      related: [
        {
          label: '声音设计器',
          to: '/tools/voice-designer',
          description: '描述一个新声音并将其保留。',
        },
        {
          label: '变声器',
          to: '/tools/voice-changer',
          description: '调整录音的音高，或将其转换为某个声音。',
        },
        {
          label: '人声音频降噪',
          to: '/tools/clean-voice-audio',
          description: '使用录音之前先将其清理干净。',
        },
        {
          label: '更改音频音高',
          to: '/tools/change-audio-pitch',
          description: '改变音乐或语音的调性。',
        },
      ],
      embed: {
        title: '创建声音',
        description: '录制或上传一段 5 到 60 秒的干净录音，确认这是你的声音或你已获得说话人的许可，然后创建声音。接着输入文本并生成语音。预设声音无需账号即可使用。',
      },
    },
    'voice-designer': {
      name: '声音设计器',
      h1: '根据描述设计一个新声音',
      tagline: '用文字描述一个声音，试听预览，并保留你喜欢的那个，让它用二十多种语言朗读任何文本。',
      metaTitle: '根据文字描述设计新声音 | Media Manipulator',
      metaDescription: '描述你想要的声音，例如温暖、低沉、平静，免费试听预览，保留它并用它生成语音。模型自托管；输出带水印。',
      ogTitle: '根据描述设计一个新声音',
      ogDescription: '描述一个声音，免费试听预览，保留你喜欢的那个并用它生成语音。自托管，带水印。',
      intro: '声音设计器创建的声音不属于任何人。用几个词描述它，例如性别、年龄、口音、音色和语速，或者用标签组合出描述，然后试听一句示例语句。预览免费，每个描述每小时可预览三次。听到想要的声音后，为它命名并保留：你试听的那个声音会原样保存到你的账号中，之后可以用语音工具支持的任何语言朗读任何文本。设计由 Qwen3-TTS 完成，朗读由 Chatterbox 完成，两者都运行在我们自己的 GPU 服务器上，每个生成的文件都带有听不见的水印。',
      whatItDoes: [
        '把对声音的文字描述变成可试听的语音预览。',
        '保存时保留与预览完全相同的声音（相同的种子）。',
        '用保留的声音以 20 多种语言朗读任何文本。',
        '返回语音的 MP3 文件，并可下载在你的浏览器中生成的 WAV。',
      ],
      flowSteps: [
        {
          title: '描述',
          description: '写下或点选你想要的特征。',
        },
        {
          title: '预览',
          description: '每个描述每小时可免费预览三次。',
        },
        {
          title: '保留',
          description: '为声音命名并保存到你的账号。',
        },
        {
          title: '生成语音',
          description: '输入任意文本并下载音频。',
        },
      ],
      advancedDetails: [
        '设计使用 Qwen3-TTS VoiceDesign（Apache 2.0）。预览语句可以用十种语言生成：中文、英语、日语、韩语、德语、法语、俄语、葡萄牙语、西班牙语和意大利语。',
        '保留的声音以其描述、种子和一段 10 秒的参考片段的形式存储；此后由 Chatterbox 朗读，因此它在任何地方、任何受支持的语言中听起来都一样。',
        '预览不计入额度。保留一个声音计为一次 AI 任务，每次生成也计为一次 AI 任务。',
        '描述用英文效果最好；标签添加的是英文特征。',
      ],
      whyItMatters: [
        '无需为一份草稿聘请配音演员，就能获得独特的旁白或角色声音。',
        '不涉及任何真实人物的声音，因此不会借用任何人的声音特征。',
        '保留的声音在每份脚本、每种语言中都保持一致。',
      ],
      useCases: [
        {
          title: '角色',
          description: '为故事或游戏原型中的每个角色赋予各自的声音。',
        },
        {
          title: '讲解视频',
          description: '为产品视频和培训视频提供平静、清晰的旁白。',
        },
        {
          title: '占位音频',
          description: '在脚本仍在修改时使用的临时配音。',
        },
        {
          title: '无障碍',
          description: '用悦耳的朗读声音朗读长文档。',
        },
      ],
      whyMediaManipulator: [
        '开源模型运行在我们自己的 GPU 服务器上；不使用第三方 AI 服务商。',
        '在计入任何额度之前先免费预览。',
        '输出带水印，每个保留的声音都有删除按钮。',
      ],
      privacyNote: '发送给声音模型的只有你写的文字描述；它生成的预览是我们生成的音频，你保留的那个声音按其种子存储。声音录音和已保存的声音都在我们自己的服务器上处理；不会向任何第三方 AI 服务商发送数据，也不会用于训练任何模型。已保存的声音（其参考录音和预览）存储在你的账号中，遵循你选择的保留期限，并可随时在账号的“声音”中删除；删除账号时它也会一并删除。生成的音频与其他结果一样保留：访客的文件保留 24 小时；使用免费账号，你可以选择保留 24 小时到 2 年。',
      faq: [
        {
          question: '设计出的声音是某个人的真实声音吗？',
          answer: '不是。它由你的描述和一个随机种子生成，并非以任何特定人物为原型。',
        },
        {
          question: '为什么预览会用完？',
          answer: '每个描述每小时可预览三次，这样免费预览才能让所有人都用得上。修改描述即可再次预览，或者保留你喜欢的声音。',
        },
        {
          question: '保留的声音听起来会和预览一样吗？',
          answer: '会。保留时发送的描述和种子与你听到的预览相同，声音就是从那次生成的结果中保存的。',
        },
        {
          question: '它能说哪些语言？',
          answer: '声音会用十种语言之一来设计，保留后它可以说语音工具支持的所有语言，总共二十多种。',
        },
        {
          question: '输出会被标记为 AI 生成吗？',
          answer: '会。每个生成的文件都带有听不见的水印，检测工具可以读取。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '预览：每个描述每小时 3 次，不计入额度。',
          '保留声音需要账号。',
        ],
      },
      related: [
        {
          label: '声音克隆',
          to: '/tools/voice-cloning',
          description: '用你自己的录音创建一个声音。',
        },
        {
          label: '变声器',
          to: '/tools/voice-changer',
          description: '对录音变调，或将其转换为某个声音。',
        },
        {
          label: '人声音频降噪',
          to: '/tools/clean-voice-audio',
          description: '使用录音之前先清理它。',
        },
        {
          label: '更改音频音高',
          to: '/tools/change-audio-pitch',
          description: '改变音乐或语音的调性。',
        },
      ],
      embed: {
        title: '描述一个声音',
        description: '写一段简短的描述或点选特征标签，试听声音（每个描述每小时可免费预览三次），然后保留它来生成语音。保留声音需要账号。',
      },
    },
    'voice-changer': {
      name: '变声器',
      h1: '更改录音中的声音',
      tagline: '即时调整录音的音高和特色，或使用AI将语音转换为已保存或预设的声音。',
      metaTitle: '变声器：对录音变调或转换声音 | Media Manipulator',
      metaDescription: '更改录音中的声音：即时调整音高和共振峰，或用AI将语音转换为已保存或预设的声音。可对比处理前后的效果。',
      ogTitle: '更改录音中的声音',
      ogDescription: '即时调整音高和共振峰，或用 AI 将语音转换为另一个声音，然后对比处理前后的效果。',
      intro: '变声器提供两种更改录音的方式。变调是经典的音高和共振峰调整：可将音高升高或降低最多十二个半音，保留说话者的声音特色或让它随音高一起变化，也可以从预设开始，例如更低沉、更高、童声、年长或电话。它即时完成，无需账号，也不使用 AI。转换则使用 AI 声音转换，让语音听起来像你已保存的某个声音或某个预设声音，同时保留原来的字句、节奏和语调。无论哪种方式，下载之前你都可以用无缝切换的 A/B 播放器对比原始录音和结果。',
      whatItDoes: [
        '将音高升高或降低最多 12 个半音，可保留共振峰或让其一起变化。',
        '提供变调预设：更低沉、更高、童声、年长和电话。',
        '使用 AI 声音转换，将语音转换为已保存的声音或预设声音。',
        '以同步的 A/B 对比播放原始录音和结果。',
        '返回 MP3 文件，并可下载在你的浏览器中生成的 WAV。',
      ],
      flowSteps: [
        {
          title: '录音或上传',
          description: '来自麦克风的语音，或音频、视频文件。',
        },
        {
          title: '选择变调或转换',
          description: '即时调整音高，或用 AI 转换为另一个声音。',
        },
        {
          title: '对比',
          description: '在原始录音和结果之间无缝切换。',
        },
        {
          title: '下载',
          description: 'MP3，或在你的浏览器中生成的 WAV。',
        },
      ],
      advancedDetails: [
        '变调在我们的服务器上通过 ffmpeg 使用 rubberband 变调器。“保留声音的特色”会保留共振峰；“随音高一起变化”会移动共振峰，听起来像体型更小或更大的说话者。电话预设还会应用 300 到 3400 Hz 的带通滤波。',
        '变调计为一次操作，输出不带水印。转换计为一次 AI 任务，输出带有听不见的水印。',
        '转换在我们自己的 GPU 服务器上使用 Chatterbox 声音转换。可转换的录音时长取决于你的套餐。',
        '转换需要账号。与克隆一样，转换为他人的声音需要获得该人的许可。',
      ],
      whyItMatters: [
        '通过简单的变调，为匿名访谈或注重隐私的片段隐藏声音。',
        '修正用错声音录制的一条录音，无需重新录制。',
        '用 A/B 播放器立即听出差别，不必凭猜测。',
      ],
      useCases: [
        {
          title: '匿名音频',
          description: '对声音变调，让说话者更难被认出。',
        },
        {
          title: '角色声音',
          description: '把你自己的朗读变成故事中的另一个声音。',
        },
        {
          title: '统一的旁白',
          description: '将嘉宾的台词转换为旁白者已保存的声音。',
        },
        {
          title: '音效',
          description: '为视频场景添加电话或童声效果。',
        },
      ],
      whyMediaManipulator: [
        '变调器免费，无需账号。',
        'AI 转换运行在我们自己的 GPU 服务器上，而非第三方服务。',
        '内置原始录音与结果的 A/B 对比。',
      ],
      privacyNote: '根据你选择的模式，你上传的录音会用 rubberband 变调，或由 AI 模型转换为另一个声音。声音录音和已保存的声音都在我们自己的服务器上处理；不会向任何第三方 AI 服务商发送数据，也不会用于训练任何模型。已保存的声音（其参考录音和预览）存储在你的账号中，遵循你选择的保留期限，并可随时在账号的“声音”中删除；删除账号时它也会一并删除。生成的音频与其他结果一样保留：访客的文件保留 24 小时；使用免费账号，你可以选择保留 24 小时到 2 年。',
      faq: [
        {
          question: '变调和转换有什么区别？',
          answer: '变调通过信号处理改变同一个声音的音高和特色，即时完成且免费。转换则使用 AI 让语音听起来像另一个声音，即你已保存的某个声音或某个预设声音。',
        },
        {
          question: '变调会添加水印吗？',
          answer: '不会。变调后的音频只是普通的信号处理，不带水印。转换后的音频带有听不见的水印。',
        },
        {
          question: '我能把自己的声音转换成某位名人的声音吗？',
          answer: '不能。你只能转换为你自己已保存的声音或我们的预设声音，而使用真实人物的声音需要获得其明确许可。我们的服务条款禁止未经许可的冒充行为。',
        },
        {
          question: '录音可以有多长？',
          answer: '变调接受的录音时长不超过你的套餐时长上限。转换在每个套餐中有各自的上限，上传时会显示。',
        },
        {
          question: '可以使用视频文件吗？',
          answer: '可以。我们会使用其中的音轨，并丢弃画面。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '变调：计为一次操作，无需账号。',
          '转换：计为一次 AI 任务，需要账号和相应套餐。',
        ],
      },
      related: [
        {
          label: '声音克隆',
          to: '/tools/voice-cloning',
          description: '用你自己的录音创建一个声音。',
        },
        {
          label: '声音设计器',
          to: '/tools/voice-designer',
          description: '描述一个新声音并保留它。',
        },
        {
          label: '人声音频降噪',
          to: '/tools/clean-voice-audio',
          description: '使用录音之前先清理它。',
        },
        {
          label: '更改音频音高',
          to: '/tools/change-audio-pitch',
          description: '改变音乐或语音的调性。',
        },
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: '先清理录音。',
        },
      ],
      embed: {
        title: '更改声音',
        description: '录制或上传语音。变调可即时调整音高和共振峰，所有人都能使用。转换会让录音听起来像你已保存的某个声音或某个预设声音，需要账号，且套餐须包含此功能。',
      },
    },
    // MM84: name / tagline / metaTitle / metaDescription for the copy-bar tool pages (model-written, needs native review).
    'content-studio': {
      name: 'Darkroom',
      h1: 'Darkroom',
      tagline: '在多轨时间线上编辑、叠加和混合视频与音频，然后导出MP4。像Premiere Pro一样的编辑器，直接在浏览器中使用。',
      metaTitle: 'Darkroom：免费在线多轨视频编辑器 | Media Manipulator',
      metaDescription: '在多轨时间线上编辑、叠加和混合视频与音频，然后导出MP4。一款在浏览器中运行的免费Premiere Pro风格视频编辑器，无需注册，无需安装。',
      ogTitle: '🎬 Darkroom——浏览器中的免费多轨视频编辑器',
      ogDescription: '在多轨时间线上编辑、叠加和混合视频与音频，添加标题、转场和调色，然后导出MP4。一款Premiere Pro风格的编辑器——直接在浏览器中使用，无需注册，完全免费。快来试试吧！🎬',
      intro: 'Darkroom是一款在浏览器标签页中运行的多轨视频编辑器。你先创建一个设定好画布和帧率的项目，把视频、图片和音频文件拖入媒体库，在层叠的轨道上排布它们，在帧边界处修剪和拆分，进行调色和抠像，添加标题、转场和字幕，用逐轨混音器混合音频，然后把完成的时间线交给我们的渲染服务器：ffmpeg会将整个剪辑构建为一个滤镜图，并编码为MP4中的H.264或HEVC；如果项目只有音频，则编码为MP3或WAV。你编辑时看到的预览由你的GPU通过WebGL2实时合成；导出结果会与该预览进行比对，所见即所得。',
      whatItDoes: [
        '运行精确到帧的多轨时间线：修剪、拆分、波纹删除、剃刀、滑移、滑动、滚动和波纹编辑，以及标记、编组、轨道锁定、独奏与隐藏，还能将音频从视频中分离。',
        '按层叠顺序合成各轨道，支持裁切、适配、变换、Lumetri风格调色（曝光、对比度、饱和度、色温、色调、自然饱和度）、3D LUT、带吸管的色度键、不透明度和八种混合模式。',
        '用关键帧和五种缓动曲线为位置、缩放、旋转、不透明度、音量、声像和效果参数制作动画；提供十五种转场，以及由文本和形状图层构建的标题片段。',
        '通过逐轨推子、声像、三段均衡器和压缩器混合音频，并配有实时电平表；主总线上还提供自动闪避，以及流媒体、播客和广播响度预设。',
        '在我们的GPU上用Whisper生成字幕，让你在字幕轨道中编辑，并以烧录到画面中的方式或SRT、VTT外挂文件的形式导出。',
        '导出带AAC音频的H.264或HEVC MP4，或MP3、WAV，可使用画布尺寸，也可缩放到720、1080、1440或2160行，并提供带进度显示和重新渲染功能的导出面板。',
      ],
      flowSteps: [
        {
          title: '创建项目',
          description: '选择画布（16:9的1920 x 1080、9:16的1080 x 1920、1:1、4:5或自定义尺寸），以及24、30或60的帧率。',
        },
        {
          title: '导入媒体',
          description: '将视频、图片和音频上传到媒体库。服务器会渲染每秒一个关键帧的预览代理文件，让拖动浏览始终保持轻快。',
        },
        {
          title: '剪切与叠加',
          description: '将片段放到轨道上，在播放头处修剪和拆分，把叠加层和标题堆叠在基础素材之上，并让静态图片保持任意时长。',
        },
        {
          title: '调色、抠像与混音',
          description: '调整颜色、应用LUT、抠除背景、为需要运动的内容设置关键帧，并在混音器上平衡各音轨。',
        },
        {
          title: '导出',
          description: '选择格式、质量、输出高度、字幕模式和响度预设。ffmpeg在我们的服务器上渲染时间线，文件会出现在导出面板中。',
        },
      ],
      advancedDetails: [
        '导出只是一次ffmpeg调用：每个素材都是一个输入，时间线变成一个filter_complex滤镜图（trim、scale、overlay、用于标题的drawtext、eq和颜色滤镜，以及用于音频、带normalize=0的amix），输出一遍编码完成。带关键帧的参数通过滤镜图上的sendcmd附属文件传递，这要求渲染主机上的ffmpeg为4.4或更新版本。',
        '当在渲染GPU上探测编码成功时，H.264使用h264_nvenc硬件编码器，否则使用libx264。质量预设对应NVENC的preset p4配恒定质量23（中）、p5配CQ 19（高）和p4配CQ 28（低）；在libx264上则是preset medium CRF 23、slow CRF 18和veryfast CRF 28。两者都固定使用yuv420p。',
        'HEVC使用hevc_nvenc或libx265，CQ或CRF值高出五个点（NVENC上为28、24、33；libx265上为28、24、32），这是获得同等主观质量的常用偏移量，并将视频流标记为hvc1，使MP4能在Safari和QuickTime中播放。如果两个编码器都不可用，导出会明确报错失败，而不是把冠以HEVC之名的H.264交给你。',
        '音频在滤镜图中重采样为48 kHz立体声，视频导出时编码为192 kb/s的AAC；MP3导出使用192 kb/s的libmp3lame，WAV导出为16位PCM。响度预设基于ffmpeg loudnorm：流媒体I=-14 LUFS TP=-1.5 LRA=11，播客I=-16 TP=-1.5 LRA=11，广播I=-23 TP=-2 LRA=7。',
        '选择输出高度会在最后一个滤镜中缩放合成后的画面（lanczos、方形像素、宽度取整为偶数），这一步在字幕烧录之后进行，因此文字会随画面一起缩放，而不是重新绘制。你的套餐无法渲染的高度会报错拒绝，绝不会被静默降级。',
        'MP4文件使用-movflags +faststart写入，索引位于文件开头，文件在完全下载之前就能开始播放。时间线上的静态图片会成为带-loop 1 -framerate <project fps> -t <hold>的输入，因此一张定格照片的解码开销不会超过其帧本身。',
      ],
      whyItMatters: [
        '转换工具只改变一个文件。剪辑则要组合多个文件：访谈下方的空镜素材、片头上的标题、垫在两者之下的背景音乐，每一样都精确修剪到帧。',
        '在浏览器编辑器中，预览和导出通常会逐渐出现偏差。Darkroom在你的GPU上渲染预览，在我们的GPU上渲染导出，并通过基准图像测试框架将两者控制在文档规定的容差之内。',
        '繁重的工作不会落在你的笔记本电脑上。4K导出、Whisper转录或经过LUT调色的多层合成都在GPU渲染服务器上运行，因此一台轻薄本也能完成任务。',
      ],
      useCases: [
        {
          title: '面向短视频平台的竖屏片段',
          description: '1080 x 1920的画布、对说话人的推近镜头、一张标题卡、在人声下自动压低的音乐，以及烧录到画面中的字幕。',
        },
        {
          title: '教程和录屏',
          description: '剪掉冷场，拼接多次录制，叠加画中画网络摄像头画面，添加标注，并以1080p导出，附带外挂字幕文件。',
        },
        {
          title: '访谈和播客节目',
          description: '两个机位按说话人切换，经过响度标准化的混音，以及从同一条时间线导出的MP3，用于音频订阅源。',
        },
        {
          title: '宣传片和产品视频',
          description: '抠像后叠加在背景板上的素材、用于营造风格的LUT、带关键帧的标志运动，以及一段面向大屏幕的4K 15秒剪辑。',
        },
      ],
      workedExamples: [
        {
          title: '以中等预设导出的90秒1080p30剪辑',
          body: '在30 fps、1920 x 1080的画布上放两个1080p片段、一条音乐轨和一张标题卡，以中等预设导出为H.264。在NVENC可用的渲染服务器上，这对应h264_nvenc preset p4、恒定质量23和yuv420p；如果NVENC不可用，则为libx264 preset medium CRF 23。混音编码为192 kb/s的AAC，90秒就是192,000 x 90 / 8，无论内容如何，音频约为2.2 MB。视频部分以质量而非码率为目标，因此其大小取决于素材：CQ 23下静态的口播画面编码后体积小，手持拍摄的运动画面编码后体积大。渲染时间随时间线长度和同时可见的片段数量增长，因为每个可见片段的每一帧都要先解码和合成，然后才交给编码器。',
        },
        {
          title: '导出为MP3和WAV的20分钟播客',
          body: '纯音频项目（两条人声轨、一段片头提示音、播客响度预设）会完全跳过视频滤镜图。导出为MP3时，文件由libmp3lame以恒定192 kb/s编码：192,000 x 1,200 / 8 = 28.8 MB，即约29 MB。导出为WAV时，它是采用滤镜图48 kHz立体声的16位PCM：48,000 x 2个声道 x 2字节 = 每秒192,000字节，20分钟为230 MB。loudnorm阶段的目标是-16 LUFS综合响度、-1.5 dBTP峰值上限和11 LU的响度范围。由于没有需要合成的帧，任务耗时只受素材解码和音频滤镜的限制，因此完成时间远短于节目本身的时长。',
        },
      ],
      whenNotToUse: 'Darkroom不适合一步就能完成的工作。如果你只需要剪掉片段的开头和结尾、更改格式或缩小体积，单一用途的视频裁剪和压缩页面上传一次即可完成，无需创建项目。它也不适合处理你无法上传的素材：每个素材都会发送到我们的服务器以生成代理文件和进行渲染，因此绝不能离开你电脑的素材应当交给桌面编辑器。访客会话中的项目限一个，且只保留24小时；如果你打算下周继续处理，请在开始前登录。',
      whyMediaManipulator: [
        '真正的剪辑基本功能：剃刀、滑移、滑动、滚动、波纹、标记、编组、带缓动的关键帧、带均衡器和压缩器的混音器，而不是一个带标题输入框的裁剪工具。',
        '诚实的导出：使用硬件还是软件编码由实时探测决定，HEVC宁可拒绝也不会造假，你的套餐无法渲染的分辨率会报错，而不是悄悄降级。',
        '一个账号，一个地方：对你正在剪辑的同一批文件进行转录、压缩或清除元数据，并在同一台GPU服务器上生成配音或字幕。',
      ],
      privacyNote: '只要项目存在，Darkroom就会把你的媒体保存在我们的服务器上：上传的文件作为素材进入媒体库，服务器据此渲染预览代理文件、胶片缩略条和波形峰值，导出文件则由ffmpeg在渲染主机的outputs/<jobId>/中生成。当你请求生成字幕时，音频会发送到我们自己GPU上的Whisper，生成的字幕条目会与项目一起存储。项目文档及其素材、版本和导出文件都可以在编辑器或你的账号页面中删除。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。上传的视频和音频还会在我们自己的服务器上经过一个自动分析步骤。不会向任何第三方AI服务商发送任何内容，也不会将任何文件用于训练。',
      faq: [
        {
          question: 'Darkroom是免费的吗？',
          answer: '是的。没有账号时，你可以保留一个项目，每天渲染5次导出，每个上传文件最大200 MB，输出最高1080行。免费账号可将其提高到5个项目、每天30次导出、1 GB文件和1440行；Premium提供不限数量的项目、每天300次导出、5 GB文件和2160行输出；Pro将导出提高到每天700次。导出有自己独立的每日计数器，不会消耗常规任务额度。以上为默认值；价格页面显示当前数值。',
        },
        {
          question: '我可以导出什么？',
          answer: '带H.264或HEVC视频和AAC音频的MP4，纯音频项目则可导出MP3或WAV。视频可按画布尺寸输出，也可缩放到720、1080、1440或2160行；字幕可烧录到画面中、作为SRT或VTT外挂文件，或者不包含；混音还可应用流媒体、播客或广播响度预设。',
        },
        {
          question: '我应该选择哪个质量预设？',
          answer: '“中”在libx264上为CRF 23，在NVENC上为恒定质量23，对于上传到反正会重新编码的平台来说，它是合理的默认选择。“高”（CRF 18或CQ 19，preset slow或p5）适用于你还要再次剪辑或在大屏幕上播放的母版。“低”（CRF 28或CQ 28，veryfast或p4）适用于发给同事的快速预览。',
        },
        {
          question: '为什么我的HEVC导出失败了？',
          answer: 'HEVC需要渲染GPU上有hevc_nvenc，或ffmpeg构建中有libx265。如果服务器两者都没有，导出会失败并显示不支持该编码器的消息，而不是返回一个标为HEVC的H.264文件。将格式切换为H.264，同一条时间线即可渲染。',
        },
        {
          question: '字幕是如何生成的？',
          answer: '“生成字幕”会将时间线音频发送到我们GPU服务器上的Whisper。识别出的分段会作为字幕条目返回，你可以在字幕轨道中编辑，然后以烧录到画面中的方式导出（一条渲染进帧里的ASS字幕轨），或作为视频旁的SRT或VTT文件导出。生成字幕计为一次AI任务，从AI任务额度中扣除。',
        },
        {
          question: '导出结果与预览一致吗？',
          answer: '这正是这项设计的目的。预览在WebGL2中按照与服务器滤镜图相同的顺序合成（裁切、适配、变换、调色、LUT、抠像、不透明度、混合），基准图像测试框架会在文档规定的容差内比对两者的帧。独奏和隐藏对导出的作用与对预览完全相同。',
        },
        {
          question: '我以后还能回到某个项目吗？',
          answer: '可以。项目保存时带有修订号，因此过期的标签页无法覆盖较新的工作，版本历史会保留可供你返回的检查点。浏览器中还会保留一份草稿，用于崩溃恢复。已登录用户可以在任何设备上打开最近的项目；访客项目只保留在浏览器会话中，并遵循24小时的保留期限。',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '源文件和导出文件都在我们的服务器上处理。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。',
        ],
        processingNotes: [
          '预览在浏览器中合成；最终导出在服务器上编码为H.264或HEVC MP4，或MP3、WAV音频。',
        ],
      },
      related: [
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '为电子邮件或慢速网络进一步缩小导出文件。',
        },
        {
          label: '视频转录',
          to: '/tools/transcribe-video',
          description: '获取完成剪辑的完整转录文本，而不只是字幕。',
        },
        {
          label: '从视频中提取音频',
          to: '/tools/extract-audio-from-video',
          description: '在把片段放入时间线之前，先提取其中的音轨。',
        },
        {
          label: '视频剪辑',
          to: '/tools/video-trimmer',
          description: '当你只需要剪一刀时。',
        },
        {
          label: 'Motion',
          to: '/tools/motion',
          description: '将标志或下方标题条制作成SVG动画，然后导出GIF用于时间线。',
        },
        {
          label: 'Darkroom教程',
          to: '/tutorials/content-studio',
          description: '从空项目到导出MP4，一步一步完成一次剪辑。',
        },
      ],
      embed: {
        title: '编辑视频',
        description: '创建新项目（或重新打开最近的项目），将视频、图片和音频文件拖入媒体库，然后放到多轨时间线上。修剪、拆分和排列片段，叠加覆盖层和标题，混合音频，并导出完成的MP4——全部在你的浏览器中完成。',
      },
    },
    'remove-exif-metadata': {
      name: '移除图片中的EXIF元数据',
      h1: '在线移除图片中的EXIF元数据',
      tagline: '在分享照片之前，清除其中的GPS位置、设备、相机和时间戳数据。',
      metaTitle: '在线移除图片EXIF元数据（免费） | Media Manipulator',
      metaDescription: '免费在线工具，可移除JPG、PNG、WebP和HEIC图片中的EXIF、GPS、IPTC和相机元数据。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线移除图片中的EXIF元数据',
      ogDescription: '在公开分享图片之前，清除其中的GPS位置、相机和时间戳元数据。',
      intro: '一张照片内部还藏着另一份文档。除了像素之外，手机或相机还会写入设备的品牌和型号、通常还有其序列号、镜头、曝光参数、快门按下的精确时刻、最后保存该文件的软件、一张小的预览缩略图，以及在开启定位服务时你所站位置的纬度、经度和海拔。本工具会从JPG、PNG、WebP或HEIC中读出所有这些信息，按其泄露的内容分组展示每一个标签，然后用ExifTool一次性将它们全部移除，让你分享的副本只包含图片本身。',
      whatItDoes: [
        '用ExifTool检查上传的文件，列出找到的每一个标签，按类别分组（相机、镜头、GPS、日期和时间、XMP、IPTC、缩略图、颜色、厂商注释等），并标出位置、身份、设备和历史类标签。',
        '移除EXIF块（IFD0和ExifIFD：品牌、型号、机身序列号、镜头型号、曝光、ISO、焦距、拍摄和修改日期）以及GPS IFD（纬度、经度、海拔、相应的参考标签、GPS时间戳）。',
        '移除IFD1中嵌入的预览缩略图，它是图片单独的一份小副本，在许多编辑器中裁切后依然保留。',
        '移除XMP数据包（创建工具、编辑历史、关键词、评分）、IPTC记录（作者、版权、说明）、Photoshop资源块、各厂商写入的厂商注释和ICC颜色配置文件。',
        '先将EXIF方向应用到像素上，这样依赖旋转标签的手机照片在标签移除后不会横过来。',
        '通过比较前后两份报告统计移除的内容并显示数量，如果其中包含位置标签，还会附上提示。',
      ],
      flowSteps: [
        {
          title: '上传照片',
          description: '拖入JPG、PNG、WebP或HEIC。服务器会运行两次ExifTool（一次生成可读的结果，一次以数值形式读取GPS和曝光值），并返回报告。',
        },
        {
          title: '阅读报告',
          description: '标签按类别分组；GPS坐标会标注在定位地图上，让你清楚看到文件泄露了什么。',
        },
        {
          title: '全部清除',
          description: '点击一下，即可用ImageMagick重新保存图片，并对结果运行exiftool -all=。',
        },
        {
          title: '对比并下载',
          description: '结果页面会报告移除了多少个标签，提供两份报告的并排差异对比，并给你干净的文件。',
        },
      ],
      advancedDetails: [
        '像素处理由ImageMagick完成：convert <input> -auto-orient -quality 85 <output>，对于JPG、PNG、WebP、GIF和AVIF，输出容器与输入一致。HEIC、TIFF和BMP在本页没有保持同一容器的路径，会以JPG返回。',
        '元数据处理是对转换后的文件执行exiftool -overwrite_original -all=。-all=会一次性移除所有可写入的组：EXIF（IFD0、ExifIFD、GPS、InteropIFD）、IFD1缩略图、XMP、IPTC、Photoshop IRB、ICC_Profile、厂商注释，以及ExifTool能够写入的任何APP段。JPEG解码器所需的JFIF和Adobe APP14段会保留；它们描述的是像素布局，而不是你。',
        '由于图片会被重新编码，JPG会以质量85重新写入，PNG则以无损方式重新写入。清除结果不是剪掉元数据后的逐字节副本。',
        '前后两份报告都是检查器所构建的同一种MetadataDocument：以组为键的条目，例如GPS:GPSLatitude或XMP-xmpMM:History，每个条目都按一份约1,800个标签的目录归入22个类别和四个隐私类别（位置、身份、设备、历史）。',
        '移除数量不包括每次转换都会变化的行（文件名、大小、修改日期、MIME类型、图像尺寸），因此它反映的是真正被移除的元数据，而不是记录性信息。',
        '视频和音频容器也可以清除，在视频和音频转换器中进行：ffmpeg以-map_metadata -1 -map_chapters -1运行，而对于MP4、MOV、M4A和M4V，之后还会执行一次exiftool -all=，因为ffmpeg会遗留QuickTime键和XMP。',
      ],
      whyItMatters: [
        'GPS标签可以解析出街道地址。一张在家里发布的待售沙发照片，可能会告诉陌生人这张沙发在哪里。',
        '设备和序列号标签会把照片彼此关联起来，也会关联到你。两张BodySerialNumber相同的图片出自同一台相机，无论发布它们的是哪个账号。',
        'IFD1缩略图是原始画面的一份副本。即使把人脸或文档从图片中裁掉，预览图可能仍会显示它。',
        '许多网站会在上传时清除EXIF，但也有许多不会。即时通讯应用、电子邮件附件、云端共享和交易平台常常原封不动地传递文件。',
      ],
      useCases: [
        {
          title: '二手交易平台和分类广告',
          description: '在买家看到之前，移除在家中拍摄的商品照片里的位置和拍摄时间。',
        },
        {
          title: '文档照片',
          description: '拍下的表格或信件照片也会记录它是何时何地拍摄的；转发之前请先清除这些信息。',
        },
        {
          title: '从敏感地点发布',
          description: '在图片脱离你的掌控之前，去掉其中的设备标识符和坐标，并通过差异对比确认它们已被移除。',
        },
        {
          title: '清理编辑过的图片',
          description: '编辑器会追加XMP历史记录并保留原始缩略图；将两者都移除，让文件只展示你想展示的内容。',
        },
      ],
      workedExamples: [
        {
          title: '带GPS的12 MP iPhone JPEG',
          body: '一张直接来自iPhone 15 Pro的4032 x 3024 JPEG，在典型情况下包含5个IFD0标签（品牌、型号、方向、软件、修改日期）、7个ExifIFD标签（包括机身序列号和镜头型号）、5个GPS标签、4个XMP条目（包括编辑历史）、2个ICC配置文件条目、3个IFD1缩略图条目（约5 KB的预览JPEG），以及一个派生的GPSPosition。结果页面会报告移除了27个标签，其中包括位置信息：这27个是除文件名、大小、日期和类型行以及图像尺寸之外的全部条目，而这些行在任何文件上都存在。输出是以质量85重新编码的JPG，方向已写入像素；最终大小由重新编码决定。该任务只是一次ImageMagick解码和编码加一次ExifTool重写，因此几秒钟就能完成，时间花在像素上，而不是标签上。',
        },
        {
          title: '来自新款手机的HEIC',
          body: 'HEIC在本页没有保持同一容器的路径，因此一张12 MP的HEIC会由ImageMagick解码并以质量85写成JPG，然后用exiftool -all=清除。你会失去HEIC容器及其颜色配置文件，但得到一个所有浏览器和交易平台都接受的文件。预计文件会比你上传的HEIC更大，因为质量85的JPEG重新编码是唯一施加的压缩，它决定了文件大小。报告会在清除前列出Apple厂商注释和GPS块，清除后则只剩文件和图像尺寸行。HEIC解码是最慢的部分；对一张照片来说，也只需几秒钟。',
        },
      ],
      whenNotToUse: '不要清除你仍需编辑或需要证明来源的照片。这里不接受相机RAW文件，而且无论如何也不应该用-all=清除它们，因为其厂商注释中保存着RAW转换器需要的数据。如果你想在去掉GPS和设备标签的同时保留版权声明或标题，请改用图片转换器的“自定义元数据”模式，它会清除所有内容，然后只写回你填写的字段。还要记住，移除元数据并不能移除图片中可见的内容：路牌、倒影或人脸仍然会透露你在哪里；人脸模糊和文字遮盖工具可以处理这些。',
      whyMediaManipulator: [
        '你能看到证据。检查器会在清除前列出每一个标签，并通过差异对比证明清除后移除了什么，而不是只给一个绿色对勾和一句承诺。',
        '一次处理，覆盖所有组。ExifTool -all=会一并移除EXIF、GPS、XMP、IPTC、Photoshop、ICC、厂商注释和预览缩略图；无需一个块一个块地勾选。',
        '方向已妥善处理。旋转标签会在移除之前应用到像素上，因此清除后的手机照片在别处不会侧躺着显示，而在不旋转像素就直接去掉标签时，通常就会出现这种情况。',
      ],
      privacyNote: '本工具会从返回的副本中移除EXIF块（相机品牌、型号、序列号、镜头、曝光、日期）、GPS块、IFD1预览缩略图、XMP和IPTC记录、Photoshop资源、厂商注释和ICC配置文件。为此，服务器必须先读取它们：上传的文件会用ExifTool检查，报告以metadata.json写入任务文件夹；清除之后，还会在旁边保留一份关于结果的第二份报告，以便“Compare”（对比）视图显示差异。两份报告和两个文件都存放在uploads/<jobId>/和outputs/<jobId>/中，并会在保留期结束时一并删除。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。独立的检查器（只读取文件而不转换）会在报告生成后立即删除其临时副本。图片还会在我们自己的服务器上经过一个自动分析步骤；不会向任何第三方发送任何内容。',
      faq: [
        {
          question: '具体会移除哪些元数据组？',
          answer: 'ExifTool能够写入的所有内容：EXIF（IFD0、ExifIFD、InteropIFD）、GPS IFD、IFD1缩略图、所有命名空间中的XMP（xmp、dc、xmpMM、photoshop等）、IPTC IIM记录、Photoshop资源块、来自Apple、Canon、Nikon、Sony及其他厂商的厂商注释，以及ICC颜色配置文件。对于PNG，这包括tEXt、iTXt、zTXt、eXIf和iCCP块；对于WebP，则包括EXIF、XMP和ICCP块。',
        },
        {
          question: '图片会被重新编码吗？',
          answer: '会。文件会先经过ImageMagick（它还会将方向标签应用到像素上），然后再由ExifTool移除标签。JPG以质量85重写，PNG以无损方式重写，WebP以质量85重写。在正常观看尺寸下，JPG重新编码后在视觉上很难与原图区分，但它并不是完全相同的比特流。',
        },
        {
          question: '为什么我的HEIC返回的是JPG？',
          answer: '一键清除对JPG、PNG、WebP、GIF和AVIF会保留原容器。HEIC、TIFF和BMP会被解码并写成JPG，以便结果在任何地方都能打开。如果你需要HEIC格式的结果，请在图片转换器中转换，并将元数据设为“清除所有元数据”。',
        },
        {
          question: '颜色配置文件会被移除吗？这有影响吗？',
          answer: '会，exiftool -all=会移除ICC配置文件。对于标准sRGB照片，不会有任何变化，因为在没有配置文件时，查看器会默认使用sRGB。对于新款手机拍摄的广色域Display P3照片，在支持配置文件的软件中，颜色可能看起来稍微不那么饱和。如果这对你很重要，请使用图片转换器的“自定义元数据”模式，并在其中保留配置文件。',
        },
        {
          question: '我可以保留版权信息或标题吗？',
          answer: '一键清除不行，它会移除所有内容。图片转换器的元数据部分有一个“自定义”模式，它会先清除文件，然后只写回你输入的内容：标题、作者、描述、版权、注释、关键词以及所选的EXIF或GPS字段。当你想要一个干净但仍署有你名字的文件时，请使用它。',
        },
        {
          question: '我怎么知道清除成功了？',
          answer: '结果页面会显示移除的标签数量，并在其中包含位置数据时加以标注。打开“Compare”（对比）即可查看完整的前后对比：它是对输出文件运行的同一份ExifTool报告，因此如果有GPS或序列号行残留，都会显示在那里。',
        },
        {
          question: '免费吗？我可以清除多少张照片？',
          answer: '免费。每次清除都是通过标准转换器进行的一次上传，因此会计入每日常规任务额度：默认情况下，没有账号时每天5次、每个文件最大200 MB；免费账号每天30次、文件最大1 GB；Premium为300次，Pro为700次。失败的任务会退还额度。当前数值请见价格页面。',
        },
      ],
      related: [
        {
          label: '模糊照片中的人脸',
          to: '/tools/blur-faces-in-photo',
          description: '元数据只是问题的一半；还要隐藏图片本身显示的人脸。',
        },
        {
          label: '遮盖图片中的文字',
          to: '/tools/redact-text-in-image',
          description: '涂黑图片中印出的姓名、地址和号码。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '发布之前先缩小清理后的照片。',
        },
        {
          label: '图片转PDF',
          to: '/tools/image-to-pdf',
          description: '将清除过元数据的文档照片合并成一个PDF。',
        },
        {
          label: '隐私政策',
          to: '/privacy-policy',
          description: '上传文件、报告和结果如何存储与删除。',
        },
      ],
      embed: {
        title: '移除图片中的元数据',
        description: '上传JPG、PNG、WebP或HEIC照片。我们会显示它携带的每一个标签，然后按下“Strip everything”（全部清除）即可将它们全部移除，并准确看到移除了什么。',
      },
    },
    'compress-image': {
      name: '压缩图片',
      h1: '在线免费压缩图片',
      tagline: '缩小JPG、PNG和WebP文件体积，让网站更快、上传更小、分享更轻松。',
      metaTitle: '在线免费压缩图片 | Media Manipulator',
      metaDescription: '免费在线图片压缩工具。在保持良好画质的同时缩小JPG、PNG和WebP文件体积。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费压缩图片',
      ogDescription: '缩小JPG、PNG和WebP文件体积，同时保持良好画质。免费、快速，无需注册。',
      intro: '压缩图片，就是重新编码，让同样的画面占用更少的字节。本页会打开图片转换器，质量字段已预设为80，输出格式与你上传的文件一致，因此JPG仍是JPG，WebP仍是WebP。在我们的服务器上，这个任务就是一条ImageMagick命令：先根据EXIF旋转标记自动校正方向，再以-quality 80（或你输入的1到100之间的任意数值）写出文件。对于JPG和WebP，这个数值决定了文件大小。对于PNG，它会被忽略，因为PNG是无损格式，所以要缩小PNG照片，真正有效的办法是把输出切换为JPG或WebP。',
      whatItDoes: [
        '按你选择的质量重新编码JPG和WebP输出；表单初始值为80。',
        '除非你更改，否则保持输入格式；PNG的大幅节省来自把PNG照片转为WebP或JPG。',
        '可在同一次处理中缩小像素尺寸：在尺寸调整字段中输入的宽度或高度会先于质量设置应用，两种节省效果叠加。',
        '除非你把元数据模式设为“清除所有元数据”，否则会把原始的EXIF、IPTC和XMP标签复制回压缩后的文件。',
        '将结果以converted.jpg、converted.webp或converted.png写入任务输出文件夹，下载链接提供的就是这个文件。',
      ],
      flowSteps: [
        {
          title: '上传JPG、PNG或WebP',
          description: '不超过你套餐的单文件上限即可，访客默认为200 MB。',
        },
        {
          title: '选择质量数值',
          description: '预设为80。60到75压缩得更狠；90及以上几乎保留全部细节。',
        },
        {
          title: 'ImageMagick重新编码',
          description: 'convert input -auto-orient -quality N output，随后用exiftool把标签复制过去。',
        },
        {
          title: '下载更小的文件',
          description: '在保留期限结束之前，输出文件都可以从任务文件夹下载。',
        },
      ],
      advancedDetails: [
        '具体命令是ImageMagick convert：先是输入路径，然后是-auto-orient、可选的-crop和-resize，接着是-quality N，最后是输出路径。只有当输出格式为jpg、jpeg或webp时，才会追加-quality参数（见converter.go中的convertImage）。',
        '服务器会把质量限定在1到100之间；超出范围的值会在任何处理开始前被拒绝，任务次数也会退还。',
        'PNG输出从不接收-quality参数，因此在PNG转PNG的任务中调低数值不会有任何变化。转换器不会运行pngquant，也不做任何调色板缩减；要让PNG变小，就得更换格式。',
        '在默认元数据模式下，服务器会对结果运行exiftool -TagsFromFile <original> -all:all -unsafe，因此相机、镜头、日期和GPS标签在压缩后依然保留。选择“清除所有元数据”则会改为对输出运行exiftool -all=。',
        '如果设置了尺寸调整，它会在应用质量之前执行。只填宽度会保持宽高比；同时填宽度和高度会强制输出该精确尺寸框，即使比例不同也是如此。',
        '同一表单中还提供滤镜、色调和文字叠加：滤镜在调整尺寸之后立即应用，色调和文字叠加则在质量设置之后最后添加。',
      ],
      whyItMatters: [
        '图片字节通常是网页或邮件中占比最大的部分，因此把它们减半是成本最低的提速手段。',
        '上传表单、CMS字段和聊天应用的上限都是以兆字节计算的，而不是像素。',
        '按你自己选择的质量重新编码一次，胜过让平台按它自己的方式重新编码。',
      ],
      useCases: [
        {
          title: '博客和商品照片',
          description: '发布前把4到6 MB的相机JPEG压到远低于1 MB。',
        },
        {
          title: '邮件附件',
          description: '让一组照片低于20或25 MB的邮箱限制。',
        },
        {
          title: '申请网站',
          description: '满足2 MB的证件照或文件照片限制，且看不出画质损失。',
        },
        {
          title: '工作副本',
          description: '日常使用较小的副本，原图则保存在你的存档中。',
        },
      ],
      workedExamples: [
        {
          title: '4000 x 3000的手机JPEG，质量80，宽度1600像素',
          body: '输入：一张直接来自手机相机的4.8 MB JPEG，4000 x 3000像素。设置：宽度1600，高度留空，质量80，格式不变。ImageMagick运行-resize 1600x，保持比例，生成1600 x 1200像素：1.92百万像素，而原图为12百万像素，约为原像素数的六分之一。结果以-quality 80写出，并复制回EXIF，因此输出是一张1600 x 1200的JPG，其大小随像素减少而下降，大约是原文件的六分之一，所以4.8 MB的原图预计会变成1 MB左右或更小。转换只需对一张12百万像素的图片执行一次ImageMagick处理，耗时几秒钟；上传这个4.8 MB的文件通常比转换本身还要久。',
        },
        {
          title: '将2.6 MB的PNG截图切换为WebP',
          body: '输入：一张1920 x 1080、2.6 MB、没有透明度的PNG截图。如果格式保持PNG，只把质量调到60，不会有任何变化，因为PNG输出不会传入-quality。把输出切换为WebP并使用预设的80，会运行convert input -auto-orient -quality 80 converted.webp。未压缩时，这2,073,600个像素相当于6.2 MB的RGB数据；质量80的有损WebP只保留其中一小部分，因此结果只有2.6 MB PNG的几分之一，具体数值取决于截图中纯色区域和文字的多少。尺寸仍为1920 x 1080，任务几秒钟即可完成。',
        },
      ],
      whenNotToUse: '以下情况不要使用有损压缩：图片之后还要大量编辑；PNG的透明度需要以PNG形式保留（切换为JPG会合并Alpha通道）；或者是小字截图，质量明显低于85时文字会糊。如果文件大只是因为像素尺寸大，那么第一步更适合用图片尺寸调整工具；如果你的目的是保护隐私而不是缩小体积，EXIF移除工具可以清除标签而不改动像素。另外，一张已经以质量70保存过的JPG，用80重新保存也不会小多少；每次重新保存都会增加损失，却换不来相应的收益。',
      whyMediaManipulator: [
        '实际运行的命令就写在本页上，包括PNG会忽略质量数值这一点，因此你不必猜测文件为什么没有变小。',
        '质量、尺寸调整、格式和元数据控制都在同一个表单里，只需一次上传，而且不会添加水印。',
        '标准工具无需安装，也无需账号。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ],
      privacyNote: '你的图片存储在我们自己服务器的uploads/<jobId>/下，ImageMagick把压缩后的副本写入outputs/<jobId>/，原图的元数据报告也写在旁边。在默认模式下，exiftool会把原始的EXIF、IPTC和XMP标签复制到压缩后的文件上，因此除非你选择“清除所有元数据”，否则位置和相机数据会随结果一起回来。每张上传的图片还会交给同一台服务器上的视觉模型进行自动分析，其JSON摘要会随任务一起保存。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。不会向任何第三方服务发送数据。',
      faq: [
        {
          question: '在这里压缩图片免费吗？',
          answer: '标准工具免费。一次压缩任务消耗当天的一次操作：默认情况下，访客每天5次，单文件上限200 MB；免费账号提高到每天30次、单文件1 GB；Premium和Pro分别为300和700。由于限额可能变化，实时数值请查看/pricing。',
        },
        {
          question: '我应该使用什么质量数值？',
          answer: '80是预设值，也是照片的合理默认值。只有在硬性大小限制逼迫时才调低；对于之后要打印或裁剪的图片，请用90或以上。该数值会直接传给ImageMagick的-quality选项，因此它的含义与其他基于ImageMagick的工具完全相同。',
        },
        {
          question: '为什么我的PNG没有变小？',
          answer: '因为质量字段对PNG输出不起作用：服务器只会为jpg、jpeg和webp添加-quality。请把输出格式改为WebP或JPG。如果需要保留透明度，WebP会保留Alpha通道，而JPG不会。',
        },
        {
          question: '压缩会保留我的EXIF和GPS数据吗？',
          answer: '默认会。ImageMagick写出文件后，exiftool会把原图的每一组标签复制到结果上。如果想全部移除，请在元数据部分选择“清除所有元数据”，或使用专门的EXIF移除工具。',
        },
        {
          question: '图片也会被调整尺寸吗？',
          answer: '除非你输入宽度或高度，否则不会。两个字段都留空时，像素尺寸保持不变，只改变编码。',
        },
        {
          question: '可以一次压缩多张图片吗？',
          answer: '每次上传是一个任务，对应一个输出文件。请每张图片运行一次工具；每个任务都会计为每日额度中的一次操作。',
        },
        {
          question: '在相同质量下，WebP总是比JPG小吗？',
          answer: '对照片来说通常如此，但两种编码器的质量刻度并不完全相同，所以请对比两个输出，而不要想当然。如果文件必须能在早于WebP支持的软件中打开，请保留JPG。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '降低质量只影响JPG和WebP输出。要大幅缩小PNG照片，请将其转换为JPG或WebP。',
        ],
      },
      related: [
        {
          label: '图片尺寸调整',
          to: '/tools/image-resizer',
          description: '先缩小像素尺寸，节省效果最大。',
        },
        {
          label: '移除EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '无需重新编码即可清除位置和相机标签。',
        },
        {
          label: '图片转PDF',
          to: '/tools/image-to-pdf',
          description: '把压缩后的JPG放进单页PDF。',
        },
        {
          label: 'AI图片放大器',
          to: '/tools/ai-image-upscaler',
          description: '反其道而行，把小图放大。',
        },
        {
          label: '图片转换器教程',
          to: '/tutorials/image/getting-started',
          description: '逐步讲解质量、尺寸调整和格式设置。',
        },
      ],
      embed: {
        title: '压缩图片',
        description: '上传图片，并调低质量滑块来缩小文件。默认情况下输出格式保持不变，也可以切换为WebP以获得最小的体积。质量设在75–85左右是很好的平衡。',
      },
    },
    'image-resizer': {
      name: '图片尺寸调整',
      h1: '在线免费调整图片尺寸',
      tagline: '将JPG、PNG、WebP和GIF图片调整为精确的像素尺寸，同时保持宽高比。',
      metaTitle: '在线免费调整图片尺寸 | Media Manipulator',
      metaDescription: '免费在线图片尺寸调整工具。将JPG、PNG、WebP和GIF图片调整为精确的像素尺寸，同时保持宽高比。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费调整图片尺寸',
      ogDescription: '将JPG、PNG、WebP和GIF图片调整为精确的像素尺寸。免费、快速，无需注册。',
      intro: '本页会打开图片转换器，并把尺寸调整字段放在最前面。输入宽度、高度或两者，服务器就会用完全根据你的输入构建的-resize参数运行ImageMagick：只填宽度时为1600x，只填高度时为x900，两者都填时为1600x900!。末尾的感叹号很关键：它告诉ImageMagick即使比例与原图不同，也要生成这个精确的尺寸框，这会拉伸画面。所以规则很简单。只填一个字段会保持比例；两个都填会得到精确尺寸，并默认你已经选好了匹配的比例，或者事先做过裁剪。',
      whatItDoes: [
        '先根据EXIF旋转标记自动校正方向，再把JPG、PNG、WebP和GIF图片缩放到你输入的像素宽度和高度。',
        '只填一个尺寸时保持宽高比；两个都填时强制输出精确的尺寸框。',
        '同一表单中提供裁剪框，并在调整尺寸之前应用，这样就能得到不变形的正方形或横幅。',
        '默认以原始格式输出，JPG和WebP的质量为85，并把原始元数据标签复制到输出文件上。',
        '将请求的高度限制在你套餐的输出上限之内，并将尺寸限制在ImageMagick允许生成的范围内。',
      ],
      flowSteps: [
        {
          title: '上传图片',
          description: 'JPG、PNG、WebP或GIF，不超过你套餐的单文件上限。',
        },
        {
          title: '输入宽度、高度或两者',
          description: '填一个值会保持比例，填两个值会强制尺寸框。如果必须改变比例，请先裁剪。',
        },
        {
          title: 'ImageMagick调整尺寸',
          description: 'convert input -auto-orient [-crop WxH+X+Y] -resize <arg> [-quality 85] output.',
        },
        {
          title: '下载',
          description: '调整尺寸后的文件以converted.<format>的名称从任务输出文件夹提供下载。',
        },
      ],
      advancedDetails: [
        '尺寸调整参数在convertImage（converter.go）中构建：两个值都填时为WxH!（强制精确尺寸），只填宽度时为Wx，只填高度时为xH。使用ImageMagick的默认重采样滤镜，无法选择其他滤镜。',
        '如果设置了裁剪，它会以-crop WxH+X+Y的形式传入，并在-resize之前执行，因此裁剪坐标对应的是自动校正方向后的原图，而不是调整尺寸后的结果。',
        '服务器会拒绝大于10000或小于1的宽度或高度，表单则把两个字段都限制在4096以内。',
        '在接受上传之前，明确填写的高度还会与你套餐的输出高度上限比对：访客默认1080像素，免费账号1440，Premium和Pro为2160。超出上限的请求会被拒绝，并提示两个数值，且不会扣除任何次数。只填宽度时不做此项检查。',
        '除非你修改数值，JPG和WebP输出都会使用-quality 85；PNG和GIF会忽略该值。用此工具放大图片只是在已有像素之间插值，因此放大2倍或4倍后画面会发虚；这种情况请使用AI图片放大器。',
        'ImageMagick完成后，在默认元数据模式下，exiftool会把原始标签复制到结果上，因此调整尺寸后的文件仍然带有拍摄日期、相机型号以及任何GPS位置。',
      ],
      whyItMatters: [
        '头像、封面和缩略图位置都要求特定的像素尺寸，而平台自动调整的尺寸通常质量更低，也不受你控制。',
        '像素数量是决定文件大小的最大因素；一张24百万像素的照片以1920像素宽显示时，携带的数据是屏幕能显示的十倍。',
        '按自己的方式调整尺寸，还能让你自己决定裁剪，而不是让正方形位置把人头裁掉。',
      ],
      useCases: [
        {
          title: '头像和个人资料图片',
          description: '先裁剪成正方形，再调整为服务要求的400或512像素。',
        },
        {
          title: '网页和博客图片',
          description: '把相机照片缩放到它们实际显示时的栏宽。',
        },
        {
          title: '横幅和页眉',
          description: '裁出精确的宽高比，再把宽度调整到要求的像素值，分毫不差。',
        },
        {
          title: '表单上传限制',
          description: '降低尺寸，让图片低于百万像素或兆字节上限。',
        },
      ],
      workedExamples: [
        {
          title: '将6000 x 4000的相机JPEG缩放到1920像素宽',
          body: '输入：一张来自无反相机的8.5 MB、24百万像素的JPEG。设置：宽度1920，高度留空，格式不变，质量85。服务器运行convert input -auto-orient -resize 1920x -quality 85 converted.jpg。比例为3:2，因此输出为1920 x 1280像素，约2.46百万像素，大致是原始像素数的十分之一。文件大小也会按相近比例下降，预计不到1 MB。在服务器上对24百万像素执行一次ImageMagick处理只需几秒钟，之后的exiftool复制会保留镜头和曝光标签。',
        },
        {
          title: '用3024 x 4032的竖拍手机照片制作400 x 400头像',
          body: '输入：一张3.1 MB的竖向JPEG，宽3024、高4032。如果只输入400和400，就会运行-resize 400x400!，把3:4的画面压扁成正方形。正确做法是把裁剪设为3024 x 3024、偏移0,504（取中间的一个正方形），再把宽度设为400、高度设为400。命令变为convert input -auto-orient -crop 3024x3024+0+504 -resize 400x400! -quality 85 converted.jpg，结果是一张不变形的400 x 400 JPG，共160,000像素，只有几十KB。裁剪和调整尺寸在一次处理中完成，几秒钟即可结束。',
        },
      ],
      whenNotToUse: '不要用尺寸调整工具把小图变大：ImageMagick只会在已有像素之间插值，因此一张640像素的照片放大到2560像素后会很模糊，这种情况应交给AI图片放大器。除非你已经先裁剪过，否则不要同时输入与画面比例不一致的宽度和高度，因为精确尺寸框模式会拉伸画面，而不是加黑边。如果文件很大但尺寸已经合适，请改用压缩工具，不要动像素。另外，动态GIF更适合用专门的GIF工具处理，而不是简单地调整尺寸。',
      whyMediaManipulator: [
        '精确尺寸框与保持比例两种行为都在本页用真实的ImageMagick参数写明，因此照片被拉伸时你不会感到意外。',
        '裁剪、尺寸调整、格式和质量只需一次上传，输出不带水印。',
        '标准工具无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ],
      privacyNote: '上传的图片保存在我们服务器的uploads/<jobId>/下，调整尺寸后的副本保存在outputs/<jobId>/下；两个目录都登记在保留期限台账中，并会一起删除。由于默认元数据模式会用exiftool把原始标签复制到调整尺寸后的文件上，除非你在表单的元数据部分选择“清除所有元数据”，否则GPS坐标和相机序列号都会随结果一起保留。为调整尺寸而上传的图片也会经过我们服务器对每张图片运行的自动分析，该分析使用本地视觉模型，摘要保存在任务文件夹中。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。任何第三方都不会收到该文件。',
      faq: [
        {
          question: '调整尺寸要花钱吗？',
          answer: '标准工具无需账号，也无需付费。每次调整尺寸计为一次每日操作：默认情况下，访客每天5次，免费账号每天30次，单文件上限分别为200 MB和1 GB。Premium和Pro将次数提高到300和700。当前生效的数值请查看/pricing。',
        },
        {
          question: '如何保持宽高比？',
          answer: '两个字段只填一个。只填宽度会变成-resize 1600x，高度根据原始比例计算；只填高度会变成x900，宽度随之确定。',
        },
        {
          question: '为什么我的图片被拉伸了？',
          answer: '你同时填写了宽度和高度，而它们的比例与画面不一致。两个值会以WxH!的形式发送，强制输出这个精确的尺寸框。请先在同一表单中裁剪到目标比例，再填写两个值。',
        },
        {
          question: '我最大可以请求多大的尺寸？',
          answer: '表单中任一字段最多可填4096，服务器最多接受10000。明确填写的高度如果超过你套餐的输出上限（访客默认1080像素），会在上传开始前被拒绝，不产生任何消耗。',
        },
        {
          question: '可以用这个工具把小照片放大吗？',
          answer: '你可以输入更大的数值，但ImageMagick只会插值，因此结果会发虚。如需放大2倍或4倍并重建细节，请使用AI图片放大器，它运行的是Real-ESRGAN。',
        },
        {
          question: '输出会保留我的EXIF数据和方向吗？',
          answer: '像素会先自动校正方向，因此结果在任何地方都能正向显示；在默认模式下，exiftool还会把原始标签复制回去。如果想去掉这些标签，请选择“清除所有元数据”。',
        },
        {
          question: '可以调整GIF的尺寸吗？',
          answer: 'GIF可以作为输入和输出，并通过同样的ImageMagick命令处理。此工具专为静态图片设计；对于动态GIF，专门的GIF工具能更好地控制帧和调色板。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '留空其中一个尺寸即可按比例缩放并保持宽高比。',
        ],
      },
      related: [
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '不改变尺寸，只降低质量。',
        },
        {
          label: 'AI图片放大器',
          to: '/tools/ai-image-upscaler',
          description: '用模型而不是插值放大2倍或4倍。',
        },
        {
          label: '移除EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '删除调整尺寸时默认保留的标签。',
        },
        {
          label: '图片转PDF',
          to: '/tools/image-to-pdf',
          description: '把调整尺寸后的图片放进PDF页面。',
        },
        {
          label: '图片转换器教程',
          to: '/tutorials/image/getting-started',
          description: '逐步讲解尺寸调整、裁剪和质量设置。',
        },
      ],
      embed: {
        title: '调整图片尺寸',
        description: '上传图片，并在下方设置目标宽度和/或高度。留空其中一项可按比例缩放并保持原始宽高比。除非你更改，否则输出格式保持不变。',
      },
    },
    'remove-background-from-image': {
      name: '移除图片背景',
      h1: '在线免费移除图片背景',
      tagline: '自动擦除任意照片的背景，下载干净的透明PNG抠图。',
      metaTitle: '在线免费移除图片背景 | Media Manipulator',
      metaDescription: '免费在线背景移除工具。自动擦除任意照片的背景，下载透明PNG。运行在我们自己的GPU上，不使用第三方AI。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费移除图片背景',
      ogDescription: '自动擦除任意照片的背景，下载透明PNG抠图。免费，无需注册。',
      intro: '本页面会打开图片转换器，并将AI操作锁定为“移除背景”、输出锁定为PNG。转换时，服务器会把你的文件交给rembg（一款开源分割工具），它运行在我们自有的GPU上：默认情况下，它会加载BiRefNet General模型，预测哪些像素属于主体，然后写出一个PNG，主体以外的区域在其Alpha通道中全部透明。表单中还可以选择另外六个模型（一个更轻量的BiRefNet、一个人像版本、ISNet，以及三个U2Net版本），以应对通用模型误判头发、玻璃或杂乱背景前人物的情况。',
      whatItDoes: [
        '用你选择的模型运行rembg（除非你更改，否则为BiRefNet General），返回置于透明背景上的主体。',
        '始终输出PNG，因为透明度需要Alpha通道，而且API会为此操作强制使用.png扩展名。',
        '保留上传图片的完整像素尺寸；抠图不会被缩放或裁剪。',
        '通过带CUDA的ONNX Runtime在我们自己的GPU上执行；不会将任何图片发送给外部AI服务。',
        '计为一次日常任务，与普通格式转换的计量单位相同，而不是AI任务。',
      ],
      flowSteps: [
        {
          title: '上传JPG、PNG或WebP',
          description: '单一而清晰的主体能得到最干净的蒙版。',
        },
        {
          title: '选择模型，或保留默认',
          description: '默认已选中BiRefNet General；人像模型和人体分割模型专为人物而设。',
        },
        {
          title: 'rembg在GPU上进行分割',
          description: '在已加载CUDA ONNX Runtime环境的情况下运行rembg i -m <model> input output.png。',
        },
        {
          title: '下载透明PNG',
          description: '结果是任务输出文件夹中的converted.png。',
        },
      ],
      advancedDetails: [
        '调用的是ai_tools.go中的RemoveBackground：一个bash shell会加载ONNX Runtime CUDA环境脚本，将U2NET_HOME设为服务器上的模型目录，然后运行rembg i -m <model> <input> <output>。模型权重缓存在服务器上，因此重启后的第一个任务可能会因加载权重而稍慢一些。',
        '可接受的模型名称为birefnet-general、birefnet-general-lite、isnet-general-use、u2net、u2netp、u2net_human_seg和birefnet-portrait；任何其他值都会在任务开始前被拒绝。空值会被视为birefnet-general。',
        'AI路径完全取代了ImageMagick处理流程，因此表单中的质量数值、滤镜、色调、文字叠加和元数据选项对此操作不起作用；输出就是rembg写出的内容。',
        '由于AI操作不会执行常规的exiftool复制步骤，PNG不会携带原图的任何EXIF。如果你需要在抠图上保留这些标签，可以用元数据编辑器在第二个任务中添加。',
        '输出大小取决于主体：完全透明的区域在PNG中几乎不占空间，所以大画布上的小商品会得到很小的文件，而占满整个画面的主体得到的文件则接近原图的无损PNG。',
      ],
      whyItMatters: [
        '商品列表、缩略图和合成图都从抠图开始，而手工制作蒙版每张图都要花上几分钟。',
        '越来越多的电商平台要求纯色或白色背景，也就是把透明抠图放在白色图层上。',
        '在数百万个蒙版上训练的模型，处理毛发、头发和半透明边缘的效果比魔棒选区更好。',
      ],
      useCases: [
        {
          title: '电商商品',
          description: '单独抠出商品，放在白色或任意品牌色上。',
        },
        {
          title: '头像和团队页面',
          description: '使用人像模型将人物从办公室背景中干净地抠出。',
        },
        {
          title: '从照片中提取标志',
          description: '为只存在于彩色招牌或页面上的标志获取透明版本。',
        },
        {
          title: '缩略图和贴纸',
          description: '在你的编辑器中用多个抠图构建分层设计。',
        },
      ],
      workedExamples: [
        {
          title: '使用默认模型处理一张3000 x 2000的商品JPEG',
          body: '输入：一张2.1 MB、3000 x 2000的JPEG，内容是灰色背景前的一只鞋。模型保留为BiRefNet General。服务器在GPU上运行rembg，写出同为3000 x 2000像素、四通道的converted.png。未压缩时这相当于24 MB的RGBA数据，但透明背景几乎压缩为零，因此PNG的大小取决于鞋子本身；由于PNG是无损格式，通常为几MB。耗时为模型对图像的一次前向推理加上PNG编码，模型预热后只需几秒；空闲一段时间后的首次运行还要加上权重加载时间。',
        },
        {
          title: '使用人像模型处理一张1080 x 1080的头像',
          body: '输入：一张640 KB、1080 x 1080的WebP自拍，背景是书架。将模型切换为专为人物和头发调校的BiRefNet Portrait。输出是一张1080 x 1080的PNG，人物不透明，书架完全透明。在1.17百万像素下，模型推理很快；大部分实际耗时花在上传和写出PNG上。由于AI路径跳过了元数据复制，PNG不含EXIF，这通常正是头像所需要的。',
        },
      ],
      whenNotToUse: '当主体不是单一而明确的对象时，请不要使用此工具：人群、风景、图案或没有明显前景的室内场景，都无法让模型分离出任何东西，蒙版将是随意的。如果你想要的是主体背后的柔和模糊而不是透明，或者需要JPG格式的结果（JPG无法保存Alpha通道，你之后还得把它拼合），又或者输入是截图或线稿（这类图片用ISNet或在编辑器中手动选区，比用照片训练的模型效果更好），它也不是合适的工具。',
      whyMediaManipulator: [
        '七个真正的分割模型按名称开放选择，当边缘效果不对时，你可以从通用模型切换到人像或U2Net版本。',
        '输出是全分辨率的普通透明PNG，无水印，也不会被强制缩小。',
        '模型运行在我们运营的硬件上，标准工具无需账号。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ],
      privacyNote: '你的照片会写入我们服务器上的uploads/<jobId>/，并由同一台机器GPU上运行的rembg读取；抠图会保存到outputs/<jobId>/converted.png。分割过程不调用任何外部API，你的图片内容也不会被用于训练任何东西。和每一次图片上传一样，该文件还会由一个自动分析步骤检查一次，该步骤使用托管在我们服务器上的视觉模型，其摘要会与任务一起存储。由于AI操作不执行元数据复制步骤，PNG不会携带原图的EXIF。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: '移除背景是免费的吗？',
          answer: '是的，在每日额度内免费。移除背景特意计为日常任务，而不是计入单独的AI任务额度：默认情况下，访客每天5次，免费账号每天30次，单个文件上限分别为200 MB和1 GB。Premium和Pro分别为300次和700次。当前数值见/pricing。',
        },
        {
          question: '我应该选择哪个模型？',
          answer: '对于物体、商品和大多数照片，保留BiRefNet General即可。人物请选BiRefNet Portrait或U2Net人像分割；想在大图上更快地处理时，选BiRefNet General Lite或U2Net Lite。',
        },
        {
          question: '为什么输出总是PNG？',
          answer: '因为抠图需要Alpha通道，API会为此操作强制使用.png扩展名；JPG没有Alpha通道，背景会显示为黑色或白色。如果你已把它拼合到某种颜色上，之后可以再转换为其他格式。',
        },
        {
          question: '可以得到白色背景而不是透明背景吗？',
          answer: '此工具无法直接做到。在任意编辑器或Darkroom中把PNG放在白色图层上即可；透明像素会显示出下方图层的颜色。',
        },
        {
          question: '它能处理头发、毛发和玻璃吗？',
          answer: '通常可以，人像模型和BiRefNet模型在训练时就考虑到了这类边缘，但半透明区域是最难处理的情况。如果第一个模型留下了毛边，请换一个模型再试。',
        },
        {
          question: '我的照片会被发送给外部AI公司吗？',
          answer: '不会。rembg及其模型运行在我们自己的GPU服务器上，任务从不调用第三方API。',
        },
        {
          question: '抠图会保留我的EXIF数据吗？',
          answer: '不会。AI操作会绕过常规转换器执行的exiftool复制步骤，因此PNG不含相机、日期或GPS标签。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '输出始终为透明PNG。移除背景在我们本地的GPU服务器上运行，而不是通过第三方API。',
        ],
      },
      related: [
        {
          label: '移除照片中的物体',
          to: '/tools/remove-object-from-photo',
          description: '擦除一个物体，保留场景的其余部分。',
        },
        {
          label: '图片尺寸调整',
          to: '/tools/image-resizer',
          description: '将抠图缩放到版面所需的尺寸。',
        },
        {
          label: 'AI图片放大器',
          to: '/tools/ai-image-upscaler',
          description: '在放置之前先放大较小的抠图。',
        },
        {
          label: '模糊照片中的人脸',
          to: '/tools/blur-faces-in-photo',
          description: '对人物进行匿名处理，而不是把他们抠出来。',
        },
        {
          label: '图片转换器教程',
          to: '/tutorials/image/getting-started',
          description: '逐一了解每个AI和图片选项。',
        },
      ],
      embed: {
        title: '移除图片背景',
        description: '上传一张照片。此工具已预设为AI背景移除器，并输出透明PNG。只需上传并转换——主体会被保留，背景会被擦除。',
      },
    },
    'image-to-pdf': {
      name: '图片转PDF',
      h1: '在线免费将图片转换为PDF',
      tagline: '一键将JPG、PNG等图片变成整洁、便于分享的PDF文档。',
      metaTitle: '在线免费将图片转换为PDF | Media Manipulator',
      metaDescription: '免费在线图片转PDF工具。将JPG、PNG等图片变成整洁的PDF文档。无需注册，无水印。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将图片转换为PDF',
      ogDescription: '将JPG、PNG等图片变成整洁、便于分享的PDF。免费、快速，无需注册。',
      intro: '本页面将输出格式锁定为PDF，这会让你的图片走我们API中的一条专用路径：用纯Go构建文档，而不是通过ImageMagick或Ghostscript。JPEG会借助/DCTDecode过滤器逐字节嵌入，因此PDF中的照片与你上传的压缩数据流完全相同。PNG、GIF或WebP会先被解码、合成到白色背景上，再存储为zlib压缩的8位RGB。单个页面的尺寸按图片每英寸96像素设定：每个像素对应0.75点，从而让图片保持原生分辨率，不做任何重采样。',
      whatItDoes: [
        '把一张图片包装成单页PDF 1.4文档，页面尺寸按96 DPI与图片匹配。',
        '原样嵌入JPEG数据，因此照片不会经历第二代压缩。',
        '将透明的PNG和GIF像素拼合到白色背景上，并用zlib无损存储。',
        '对于Go无法解码的WebP和其他容器格式，先通过ImageMagick栅格化，再无损嵌入结果。',
        '忽略质量、尺寸调整、裁剪、滤镜和AI设置；PDF路径只接收图片本身。',
      ],
      flowSteps: [
        {
          title: '上传任意图片',
          description: '常见输入为JPG、PNG、GIF和WebP；该字段接受任何图片类型。',
        },
        {
          title: '服务器读取像素',
          description: 'JPEG的尺寸取自文件头；其他格式会被解码并拼合为RGB。',
        },
        {
          title: '组装单页PDF',
          description: '目录、页面、图片XObject，以及一个将图片绘制为铺满页面的内容流。',
        },
        {
          title: '下载converted.pdf',
          description: '在保留期限到期前，从任务输出文件夹提供下载。',
        },
      ],
      advancedDetails: [
        '构建器是pdf_tools.go中的imageToPDFBytes。以JPEG标记FF D8 FF开头的文件会以/DCTDecode配合/DeviceRGB或/DeviceGray嵌入；CMYK JPEG则回退到解码并拼合的路径，因此PDF中永远不会出现CMYK数据流。',
        '非JPEG输入使用Go的图片编解码器解码（已注册PNG和GIF）。每个像素都会以Alpha方式合成到白色上并写为三个字节，然后整个缓冲区经zlib压缩，以/FlateDecode、每分量8位的方式存储。',
        'WebP以及其他任何Go无法解码的格式，会先由ImageMagick配合-auto-orient栅格化为内存中的PNG数据流，然后再将该PNG拼合并嵌入。',
        '以点为单位的页面尺寸为宽度 x 72 / 96和高度 x 72 / 96，因此一张1200 x 1600的图片会得到900 x 1200点的页面（12.5 x 16.7英寸）。PDF阅读器会将页面缩放以适应窗口，打印机会缩放到纸张大小，所以大页面在查看时不成问题，但打印时请设置“适合页面”。',
        '快速路径上的JPEG会保留其EXIF，包括方向（Orientation）标记，但PDF阅读器不会应用EXIF方向。以旋转标记横向存储的手机照片在PDF中会显示为横向；请先将其转换为JPG一次（这会自动校正方向），再转换为PDF。',
        '表单发送的质量值会被接受，但在此路径上不会使用；也没有多图模式：一次上传生成一个单页PDF。',
      ],
      whyItMatters: [
        '签证、大学和人事系统的门户网站常常只接受PDF，哪怕只是一张收据的照片。',
        'PDF在每台设备上的打印和预览效果都相同，而单纯的图片可能会被查看器旋转或缩放。',
        '原样嵌入JPEG意味着PDF达到校样级质量：导入过程中没有任何内容被重新编码。',
      ],
      useCases: [
        {
          title: '收据和表格',
          description: '把签名页面的手机照片变成门户网站可接受的PDF。',
        },
        {
          title: '证件和文档上传',
          description: '按表单要求，将扫描的卡片或证书以PDF提交。',
        },
        {
          title: '作品校样',
          description: '将PNG设计稿的透明部分拼合为白色后，以PDF发送给客户。',
        },
        {
          title: '归档',
          description: '把照片与其他文档以同一种格式保存在一起。',
        },
      ],
      workedExamples: [
        {
          title: '一张3024 x 4032的手机JPEG（2.9 MB）',
          body: '输入：一张2.9 MB的JPEG，宽3024、高4032，RGB。读取文件头获取尺寸，JPEG数据流以/DCTDecode原样嵌入。页面宽3024 x 0.75 = 2268点、高4032 x 0.75 = 3024点，即31.5 x 42英寸。生成的PDF约为2.9 MB，外加不足一千字节的PDF结构，因为没有任何内容被重新编码。工作内容就是读取文件再写出，因此任务受限于磁盘和上传速度而非CPU，几秒钟即可完成。',
        },
        {
          title: '一张带透明背景的1920 x 1080 PNG',
          body: '输入：一张1.4 MB的PNG，内容是透明背景上的标志。PNG被解码，每个像素都合成到白色上，1920 x 1080 x 3 = 6,220,800字节的RGB数据经zlib压缩后以/FlateDecode存储。页面为1440 x 810点（20 x 11.25英寸）。由于纯白和纯色在zlib下压缩效果很好，PDF通常与PNG大小相当，有时更大，因为单纯的zlib缺少PNG所用的行过滤器。解码、合成两百万像素并压缩它们属于CPU工作，需要几秒钟；按照设计，结果中的透明度会被去除。',
        },
      ],
      whenNotToUse: '这不是处理多页文档的工具：它只能用一张图片生成一页，所以一组扫描件需要逐页转换，再在PDF编辑器中合并。需要保留透明度时请不要使用它，因为每个像素都会被拼合到白色上。也不要指望得到更小的文件：JPEG会原样嵌入，PNG会变成zlib压缩的RGB，所以如果在意大小，请先压缩图片或调整其尺寸。此外，如果照片的正确方向只记录在EXIF标记中，应先将其转换为JPG一次，否则PDF会按存储时的方向显示它。',
      whyMediaManipulator: [
        'JPEG直通是一项设计决策：你的照片在嵌入时不会被重新编码，这是许多转换器无法保证的。',
        '处理路径上没有Ghostscript，也不涉及ImageMagick的PDF策略，因此转换不依赖于可能拒绝PDF的服务器端安全设置。',
        '标准工具免费，无需账号。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ],
      privacyNote: '图片存储在我们自己服务器上的uploads/<jobId>/下，PDF存储在outputs/<jobId>/converted.pdf；两者会在保留期限结束时一并删除。由于数据流是逐字复制的，JPEG在PDF中会保留其所有内嵌元数据，因此任何提取该图片的人都能读到EXIF位置和相机标签；如果这对你很重要，请先用EXIF移除工具清除它们。PNG和其他输入会被解码为原始像素，因此不会带入任何标签。上传的文件本身是图片，因此也会经过在我们服务器上运行的自动视觉模型分析，其摘要会与任务一起保存。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: '图片转PDF是免费的吗？',
          answer: '标准工具是免费的。每次转换消耗一次每日操作：访客每天5次，文件上限200 MB；免费账号每天30次，上限1 GB；Premium或Pro为300次或700次。以上均为默认值，并列在/pricing上。',
        },
        {
          question: '照片在PDF中会被重新压缩吗？',
          answer: '如果是JPEG就不会：原始字节通过/DCTDecode嵌入。PNG、GIF和WebP在拼合后以zlib压缩的RGB无损存储，因此同样没有任何质量损失。',
        },
        {
          question: 'PDF的页面尺寸是多少？',
          answer: '页面按每英寸96像素与图片匹配，因此以点为单位的宽高是像素尺寸的0.75倍。一张1200 x 1600的图片会得到12.5 x 16.7英寸的页面；阅读器和打印机会将其缩放以适应。',
        },
        {
          question: '可以把多张图片合并成一个PDF吗？',
          answer: '本页面不行。每次上传生成一个单页PDF。请逐张转换图片，再在PDF编辑器中合并生成的PDF。',
        },
        {
          question: '透明度会怎样？',
          answer: '它会被拼合到白色上。此路径上的PDF图片XObject没有Alpha通道，因此透明像素会变成白色像素。',
        },
        {
          question: '为什么我的手机照片在PDF中是横着的？',
          answer: '手机常以横向存储像素，并设置EXIF方向标记。JPEG被原样嵌入，而PDF阅读器会忽略该标记。请先用图片转换器将照片转为JPG（这会自动校正方向），再把结果转换为PDF。',
        },
        {
          question: 'PDF会保留我的EXIF数据吗？',
          answer: '对于JPEG会，因为包括EXIF在内的整个JPEG数据流都在PDF中。如果你不希望这样，请先使用EXIF移除工具。对于PNG和其他输入，只保留像素。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '输出为单页PDF。由于PDF页面不透明，透明区域会被拼合到白色上。',
        ],
      },
      related: [
        {
          label: 'PDF转JPG',
          to: '/tools/pdf-to-jpg',
          description: '将PDF页面渲染回图片。',
        },
        {
          label: '移除图片中的EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '在标签被嵌入PDF之前将其清除。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '先缩小JPEG，因为PDF会原样嵌入它。',
        },
        {
          label: 'AI文档扫描',
          to: '/tools/ai-document-scan',
          description: '对拍摄的页面进行清理和OCR，而不只是简单包装。',
        },
        {
          label: '图片尺寸调整',
          to: '/tools/image-resizer',
          description: '先设定像素尺寸，从而也决定了页面尺寸。',
        },
      ],
      embed: {
        title: '将图片转换为PDF',
        description: '上传任意图片——JPG、PNG等。此工具的输出已锁定为PDF，你会得到一个以原生分辨率包装图片的单页PDF。',
      },
    },
    'pdf-to-jpg': {
      name: 'PDF转JPG',
      h1: '在线免费将PDF转换为JPG',
      tagline: '将PDF的每一页渲染为高质量JPG图片，方便分享、编辑或发布。',
      metaTitle: '在线免费将PDF转换为JPG | Media Manipulator',
      metaDescription: '免费在线PDF转JPG工具。将PDF的每一页渲染为高质量JPG图片，并以ZIP下载。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将PDF转换为JPG',
      ogDescription: '将PDF的每一页渲染为高质量JPG图片。免费、快速，无需注册。',
      intro: '上传PDF后，我们的服务器会用Poppler工具包中的pdftoppm渲染每一页，许多桌面PDF阅读器使用的也是这个栅格化引擎。本页面的表单预设为JPG、所有页面和150 DPI；你可以将DPI改为100、200或300，将任务限制为仅第一页，并设置JPEG质量（默认为90）。选择所有页面时，你会得到一个包含page-001.jpg、page-002.jpg等文件的ZIP；选择仅第一页时，你会得到一张JPG。渲染之前，pdfinfo会统计页数，超过500页的任务会被拒绝。',
      whatItDoes: [
        '按你选择的分辨率，将每一页或仅第一页栅格化为JPG。',
        '将多页输出打包为一个ZIP，文件名以零补位、便于排序。',
        '每一页都使用你设置的JPEG质量（默认为90）。',
        '先读取页数，让超大文档在任何渲染开始之前就失败。',
        'PDF不会进入自动图片分析，该分析只针对图片、视频和音频上传运行。',
      ],
      flowSteps: [
        {
          title: '上传PDF',
          description: '任意.pdf，不超过你的单文件上限；页数不得超过500页。',
        },
        {
          title: '选择页面、DPI和质量',
          description: '所有页面或仅第一页；100、150、200或300 DPI；JPEG质量1到100。',
        },
        {
          title: 'pdftoppm进行渲染',
          description: 'pdftoppm -r <dpi> -jpeg -jpegopt quality=<q> [-f 1 -l 1] input page',
        },
        {
          title: '下载',
          description: '单页为converted.jpg，所有页面为converted.zip。',
        },
      ],
      advancedDetails: [
        '渲染器是pdf_tools.go中的convertPDFToImages。它会调用pdfinfo获取页数，拒绝超过500页的文档，然后运行pdftoppm：用-r指定DPI，用-jpeg和-jpegopt quality=N输出JPG，仅需第一页时加上-f 1 -l 1。',
        '无论表单发送什么，服务器都会将DPI限制在50到400之间，将质量限制在1到100之间；表单本身提供100、150、200和300。',
        'pdftoppm为每页写出一个文件；服务器会将它们重命名为page-001.jpg、page-002.jpg等（三位数，零补位）并打包成ZIP，因此在任何文件管理器中，文件都会按页码顺序排列。',
        '像素尺寸直接由DPI决定：一张US Letter页面（8.5 x 11英寸）在150 DPI下为1275 x 1650像素，在300 DPI下为2550 x 3300；一张A4页面（8.27 x 11.69英寸）在150 DPI下为1240 x 1754，在300 DPI下为2480 x 3508。',
        '本身就是扫描件的PDF会被重新栅格化：如果内嵌扫描为300 DPI，而你以150渲染，每页输出的线性分辨率就只有扫描件的一半。选择300即可保留扫描件原有的清晰度。',
        '本工具的PNG版本使用同一个渲染器，配合-png且没有质量选项；对于照片或扫描页面，JPG是正确的选择，而对于含有锐利文字和平面色彩、JPEG振铃会很明显的页面，则应选择PNG。',
      ],
      whyItMatters: [
        '许多工具和平台接受图片但不接受PDF：幻灯片、社交媒体帖子、聊天应用和图片编辑器都是如此。',
        '渲染出的页面忠实呈现版式、字体和矢量图形，无需嵌入任何内容，也不会重新排版。',
        '自己选择DPI，意味着由你决定是快速预览还是打印分辨率的导出。',
      ],
      useCases: [
        {
          title: '幻灯片和社交媒体帖子',
          description: '把报告页面或海报渲染为图片，用于发布或放入演示文稿。',
        },
        {
          title: '缩略图和预览',
          description: '仅以100 DPI渲染第一页，作为封面图片。',
        },
        {
          title: '在编辑器中标注',
          description: '在图片编辑器中打开页面，进行注释、遮盖或裁剪。',
        },
        {
          title: '提取扫描页',
          description: '将PDF中的每一张扫描页以原始分辨率分别取出为独立的JPG。',
        },
      ],
      workedExamples: [
        {
          title: '一份12页的A4报告，所有页面以150 DPI渲染',
          body: '输入：一份12页、1.8 MB的A4 PDF，包含文字和几张图表。设置保留预设值：JPG、所有页面、150 DPI、质量90。pdfinfo报告12页，未超过500页上限，随后pdftoppm以-r 150 -jpeg -jpegopt quality=90运行。每页的渲染尺寸为宽8.27 x 150、高11.69 x 150，即1240 x 1754像素（2.2百万像素）。这十二个文件被重命名为page-001.jpg到page-012.jpg，并打包为converted.zip。渲染按页进行，耗时主要取决于每页的矢量内容和文字量；十二页文字总共只需几秒钟。每页JPEG的大小取决于内容：以白底文字为主的页面比满版图表压缩得好得多。',
        },
        {
          title: '以300 DPI仅渲染一份US Letter扫描件的第一页',
          body: '输入：一份40页的扫描合同，Letter尺寸，28 MB。选择仅第一页和300 DPI，质量保持90。服务器运行pdftoppm -r 300 -jpeg -jpegopt quality=90 -f 1 -l 1，因此只栅格化一页，尺寸为宽8.5 x 300、高11 x 300 = 2550 x 3300像素（8.4百万像素）。输出是单个converted.jpg，而不是ZIP。渲染一张扫描页很快，因为该页只是一张内嵌图片；上传这28 MB花费的时间比渲染还长。若以150 DPI渲染，同一页将是1275 x 1650，像素只有四分之一，足以在屏幕上阅读，但不足以重新打印该扫描件。',
        },
      ],
      whenNotToUse: '当你需要文字保持可选中或可搜索时，请不要将PDF渲染为JPG：结果只是像素，屏幕阅读器或搜索索引什么也得不到。如果页面以锐利的文字和线稿为主且你会放大查看，也不要使用JPG，因为JPEG压缩会在边缘周围留下淡淡的振铃；PNG版本在这种情况下更干净。超过500页的文档会被直接拒绝，而对长文档使用很高的DPI会生成很大的ZIP，所以只渲染你真正需要的页面。另外，如果目标是编辑PDF内容而不是把它变成图片，PDF编辑器才是合适的工具。',
      whyMediaManipulator: [
        '采用Poppler渲染，并开放真正的DPI和质量控制，而不是固定的预览尺寸。',
        '一个带页码文件名的ZIP，而不是一堆零散的下载。',
        '标准工具无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ],
      privacyNote: '你的PDF存储在我们服务器上的uploads/<jobId>/下，渲染出的JPG或其ZIP存储在outputs/<jobId>/下；页面会被渲染到输出文件夹内的一个临时目录中，ZIP一写完该目录就会被删除。PDF上传会被识别为文档，不会进入图片、视频和音频上传所经过的自动视觉分析。Poppler完全在我们的机器上运行，不会有任何页面被发送到外部服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: 'PDF转JPG是免费的吗？',
          answer: '标准工具是免费的。一个PDF无论有多少页，都计为一次每日操作：访客每天5次，单文件上限200 MB；免费账号每天30次，上限1 GB；Premium每天300次，Pro每天700次。以上均为默认值，并显示在/pricing上。',
        },
        {
          question: '我会得到多少张图片？',
          answer: '选择所有页面时，每页一张，以converted.zip交付，文件名从page-001.jpg开始依次递增。选择仅第一页时，你会得到一个converted.jpg，没有ZIP。',
        },
        {
          question: '我应该选择哪个DPI？',
          answer: '150适合屏幕阅读和分享（A4为1240 x 1754）。300适合打印，或用于以300制作的扫描件（A4为2480 x 3508）。100适合小尺寸预览。服务器接受50到400。',
        },
        {
          question: '质量设置有什么作用？',
          answer: '它会以-jpegopt quality=N的形式传给pdftoppm，使用标准的JPEG质量刻度。默认为90；对于照片较多的页面，调低它可以得到更小的文件。',
        },
        {
          question: '有页数限制吗？',
          answer: '有，500页。pdfinfo会在渲染开始前统计页数，更长的文档会被拒绝，并显示说明页数和上限的消息，该次操作也会退还。',
        },
        {
          question: '图片中的文字可以搜索吗？',
          answer: '不可以。输出是每一页的栅格图片。如果你需要文字，请保留PDF，或使用AI文档扫描工具，它会对拍摄的页面运行OCR。',
        },
        {
          question: '可以输出PNG而不是JPG吗？',
          answer: '本页面将格式锁定为JPG。同一个渲染器可通过PDF转PNG页面生成PNG，该页面使用-png且没有质量设置。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '所有页面的输出以.zip交付；仅第一页的输出为单个.jpg。',
          '默认渲染分辨率为150 DPI；如需打印质量的输出，请调高它。',
        ],
      },
      related: [
        {
          label: '图片转PDF',
          to: '/tools/image-to-pdf',
          description: '反向转换：将图片包装进PDF页面。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '缩小渲染出的JPG，用于网页。',
        },
        {
          label: '图片尺寸调整',
          to: '/tools/image-resizer',
          description: '将渲染出的页面缩放到缩略图或横幅尺寸。',
        },
        {
          label: 'AI文档扫描',
          to: '/tools/ai-document-scan',
          description: '对拍摄的页面进行OCR和清理。',
        },
        {
          label: '遮盖图片中的文字',
          to: '/tools/redact-text-in-image',
          description: '涂黑渲染页面上的姓名或号码。',
        },
      ],
      embed: {
        title: '将PDF转换为JPG',
        description: '上传一个PDF。每一页都会被渲染为JPG图片。选择“所有页面”可得到图片ZIP，选择“仅第一页”可得到单张JPG。选择渲染DPI可获得更清晰的输出。',
      },
    },
    'compress-video': {
      name: '压缩视频',
      h1: '在线压缩视频，不损画质',
      tagline: '缩小MP4、WebM、MOV、MKV和AVI文件体积，适用于网页、电子邮件、社交媒体和云端上传。',
      metaTitle: '在线压缩视频（免费） | Media Manipulator',
      metaDescription: '免费在线视频压缩工具。在保持良好画质的同时缩小MP4、WebM、MOV、MKV和AVI文件体积。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线压缩视频，不损画质',
      ogDescription: '缩小MP4、WebM、MOV和AVI视频文件以用于网页，同时保持可观看的画质。',
      intro: '视频文件之所以大，是因为它的码率，也就是编码器为每秒素材花费了多少比特。手机和录屏软件花得很大方，这就是为什么一段很短的1080p片段可能有几十甚至几百兆字节。本页打开的是一个只有三个控件的压缩器，而不是完整的转换器：压缩级别、输出容器，以及可选的分辨率和编解码器。在我们的服务器上，这项任务就是一条FFmpeg命令：以压缩级别决定的恒定质量设置（CRF）重新编码画面，将音频重新编码为AAC或Opus，并在写入结果时把索引放在文件开头，使其在完全下载之前就能开始播放。',
      whatItDoes: [
        '以固定质量级别而非固定码率重新编码视频：“最小文件”为CRF 31，“均衡”为CRF 26，“高质量”为CRF 22。',
        '输出MP4（默认H.264，也可选择H.265/HEVC）或WebM（VP9视频配Opus音频）。',
        '可选择在同一遍处理中将画面缩小到1080p、720p或480p，同时保持宽高比。',
        '可选择完全去掉音轨，以获得尽可能小的文件。',
        '接受MP4、MOV、M4V、WebM、MKV、AVI、FLV、WMV、MPEG和MPG上传；ProRes和其他剪辑格式请使用完整的转换器页面。',
      ],
      flowSteps: [
        {
          title: '上传视频',
          description: '浏览器会将文件直接放入我们的存储桶，然后请求API开始任务。',
        },
        {
          title: '选择级别',
          description: '默认选中“均衡”。“最小文件”以可见细节换取体积；“高质量”保留更多细节。',
        },
        {
          title: '可选更改格式、分辨率或编解码器',
          description: '采用H.264的MP4随处可播放；在能够解码的设备上，H.265和WebM的文件更小。',
        },
        {
          title: 'FFmpeg重新编码',
          description: '使用对应级别CRF的libx264、libx265或libvpx-vp9，加上AAC或Opus音频，MP4还会启用faststart。',
        },
        {
          title: '下载更小的文件',
          description: '结果会保留在任务文件夹中，直到保留期结束。',
        },
      ],
      advancedDetails: [
        'MP4的完整命令是ffmpeg -i input [-vf scale=-1:H] -c:v libx264 -crf N -pix_fmt yuv420p -movflags +faststart -c:a aac output.mp4，其中N在三个级别下分别为31、26或22（见converter.go中的buildVideoCodecArgs和videoCRF）。命令没有传入编码器速度预设，因此libx264以默认的medium运行。',
        '选择H.265会将编码器换为libx265，并添加-tag:v hvc1，这是QuickTime和Safari识别MP4中的HEVC所需的标签。较旧的Android手机、智能电视和许多网页播放器根本无法解码H.265。',
        'WebM输出使用libvpx-vp9，参数为-b:v 0 -crf N并配Opus音频；如果服务器的FFmpeg构建缺少VP9或Opus，则会回退到VP8和Vorbis。传入的N相同，但VP9的CRF量程为0到63，因此26在那里算是相对较高的质量设置。',
        '分辨率选项会变成scale=-1:1080、scale=-1:720或scale=-1:480：高度固定，宽度根据源宽高比计算。高度会按所选值直接应用，因此为720p的源选择1080p会将其放大，文件会变大而不是变小；请选择不高于源的高度。',
        '“移除音轨”会添加-an。否则，音频会由FFmpeg原生AAC编码器以默认码率重新编码（不传入-b:a；对于立体声通常约为128 kbps），在任何级别下都只占文件的一小部分。',
        '压缩由CRF驱动，因此输出大小取决于内容：静态幻灯片比彩纸或水面压缩得多得多。服务器会在任何编码开始前，验证CRF在0到51之间，且压缩级别为三个名称之一。',
        '上传的文件还会进入每次标准转换都会进行的自动内容分析队列：在我们自己的硬件上，由本地视觉模型对抽样帧进行描述，并转录音频。分析结果与任务一起存储，不会共享。',
      ],
      whyItMatters: [
        '聊天应用、邮件服务器和学习平台都以兆字节为单位设定上限，而以原生码率保存的手机片段会轻易超出。',
        '自动播放60 MB背景视频的页面在移动网络上会卡顿；同一段视频以CRF 26压缩后只有其一小部分。',
        '存储和带宽费用按字节计算，因此为很少打开的原始文件保留压缩副本，节省下来的费用会迅速累积。',
      ],
      useCases: [
        {
          title: '电子邮件和聊天',
          description: '无需单独的分享链接，就能把1分钟的手机录像压到25 MB或100 MB的限制以内。',
        },
        {
          title: '网站主视觉和背景循环视频',
          description: '编码出页面可以自动播放、无需长时间缓冲的WebM或H.264 MP4。',
        },
        {
          title: '课程和会议录像',
          description: '缩小录屏文件，其中静态的幻灯片在任何CRF下都能压缩得非常好。',
        },
        {
          title: '存档副本',
          description: '为较长的原始文件保留一份720p“均衡”副本，并将母版移到冷存储中。',
        },
      ],
      workedExamples: [
        {
          title: '以“均衡”压缩一段48 MB、30秒的1080p手机片段',
          body: '输入：一段来自手机的30秒MP4，1920 x 1080，48 MB，折合约12.8 Mbps。设置：均衡、MP4、H.264、保持分辨率、保留音频。服务器以CRF 26运行libx264，使用yuv420p和faststart，并将音频重新编码为128 kbps的AAC，因此仅音轨就占结果中约0.5 MB（128 kbps x 30 s）。其余部分都由画面决定：CRF 26会优先舍弃细微颗粒和噪点，因此平稳的手持镜头压缩后只有12.8 Mbps源文件的一小部分，而快速动作或严重的相机噪点则缩小得较少。编码是对900帧1080p画面以默认medium预设进行的单遍处理；在我们的服务器上这是一项很短的任务，等待时间通常主要花在上传48 MB上。',
        },
        {
          title: '以“最小文件”将一段160 MB、60秒的4K片段压成720p H.265',
          body: '输入：一段60秒、3840 x 2160、160 MB的MP4，约21 Mbps，在访客200 MB的上限之内。设置：最小文件、MP4、编解码器H.265、分辨率720p、移除音频。FFmpeg应用scale=-1:720，生成1280 x 720：每帧0.92百万像素，而源文件为8.3百万像素，在编解码器开始工作之前，像素数就已降到大约九分之一。然后libx265以CRF 31运行，带-tag:v hvc1，-an则去掉音频。像素减少到九分之一、更高效的编解码器加上较高的CRF，三者结合正是体积缩减最大的来源，因此预计结果只有几兆字节，而不是几十兆字节。时间主要花在解码4K帧和libx265上，在相同预设下它明显比libx264慢，因此尽管输出更小，这项任务仍比1080p示例耗时更长。',
        },
      ],
      whenNotToUse: '不要压缩你仍打算剪辑或调色的文件；每次重新编码都会损失细节，剪辑软件需要的是原始文件，或者用完整转换器生成的ProRes中间文件。如果问题出在容器而不是大小上，不要用它来让片段在特定设备上播放；视频转换器可以在不降低画质的情况下更改格式。如果你唯一的目标是剪出一段内容，裁剪工具会直接复制数据流而不重新编码，既更快又无损。如果文件大是因为它很长，压缩的帮助会比你期望的小；一段20分钟的录像以CRF 26压缩后，仍然是一段20分钟的录像。',
      whyMediaManipulator: [
        '每个级别背后的CRF都写在本页上，因此在等待之前，你就能预判“最小文件”会对细节丰富的素材造成什么影响。',
        'MP4中的H.265会带上Apple播放器所需的hvc1标签，许多在线压缩工具都忘了这一点。',
        '编码使用FFmpeg在我们自己的服务器上运行；不会交给任何外部处理服务，也不会添加水印。',
        '一次压缩计为每日额度中的一次常规任务：默认情况下，没有账号时每天5次，免费账号每天30次。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。',
      ],
      privacyNote: '压缩器使用FFmpeg在我们自己的服务器上重新编码你的视频。上传的文件存储在uploads/<jobId>/下，压缩后的文件存储在outputs/<jobId>/下；两者都登记在保留期登记表中，并在保留期结束时删除。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。由于这是一次标准转换，上传的文件还会在同一硬件上经过我们的自动内容分析（由本地视觉模型描述抽样帧，在本地转录音频）；该报告与任务一起保存，不会与第三方共享。除非你选择清除，否则容器元数据会被保留；不会向任何外部AI或处理服务商发送任何内容。',
      faq: [
        {
          question: '压缩会让我的视频变难看吗？',
          answer: '重新编码总会损失一些细节。在“高质量”（CRF 22）和“均衡”（CRF 26）下，损失主要集中在大多数观众察觉不到的细微颗粒和噪点上；在“最小文件”（CRF 31）下，你能看到细节丰富的素材变得发软。保持分辨率可以避免缩小尺寸带来的模糊。',
        },
        {
          question: '我应该选H.264、H.265还是WebM？',
          answer: 'H.264 MP4在任何设备上都能播放，包括老电视和公司笔记本电脑。在相同CRF下，H.265的文件更小，但需要能够解码HEVC的设备；我们会将其标记为hvc1，让Apple播放器能够接受。WebM（VP9和Opus）适合你能控制播放器的网页。',
        },
        {
          question: '文件会缩小多少？',
          answer: '这取决于源文件的码率和内容。12 Mbps的手机片段有很大的余量，在CRF 26下会大幅缩小；而原本就以适中码率编码的文件则缩小得很少，因为CRF只花费画面所需的比特。降到720p和移除音频总是有帮助的。',
        },
        {
          question: '压缩器会添加水印或更改帧率吗？',
          answer: '不会。帧率、时长和宽高比都会保留，画面上也不会绘制任何内容。只有编解码器、CRF、可选的高度和可选的音频移除会发生变化。',
        },
        {
          question: '压缩视频免费吗？有哪些限制？',
          answer: '默认情况下，访客每天可进行5次常规任务，文件最大200 MB、视频最长5分钟，输出最高1080p；免费账号可将其提高到每天30次、1 GB和20分钟。失败的压缩会退还额度。当前数值请见价格页面。',
        },
        {
          question: '为什么输出没有比原文件小？',
          answer: '源文件很可能已经经过高效压缩，或者相对于其分辨率码率已经很低。不降低级别的话，CRF无法低于画面所需的水平。试试“最小文件”，或者降低分辨率，或者改用H.265。',
        },
        {
          question: '我可以压缩没有音频的视频，或保持原始音频不变吗？',
          answer: '无声的源文件仍然是无声的。在本页，保留的音轨总会被重新编码为AAC（MP4）或Opus（WebM）；如果要设置明确的音频码率，请使用完整的视频转换器。',
        },
      ],
      related: [
        {
          label: '裁剪视频',
          to: '/tools/video-trimmer',
          description: '先剪好片段，这样压缩器需要编码的内容就更少。',
        },
        {
          label: '将视频转换为动态GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: '对于几秒钟的片段，GIF是能够内联播放的格式。',
        },
        {
          label: '将视频转码为HLS',
          to: '/tools/transcode-to-hls',
          description: '将视频打包为自适应流，而不是单个文件。',
        },
        {
          label: '从视频中提取音频',
          to: '/tools/extract-audio-from-video',
          description: '只保留音轨，存为MP3、WAV或FLAC。',
        },
        {
          label: '视频转录',
          to: '/tools/transcribe-video',
          description: '在压缩之前或之后，将语音提取为文字。',
        },
        {
          label: '视频转换器教程',
          to: '/tutorials/video/getting-started',
          description: '逐步讲解每一个视频选项。',
        },
      ],
      embed: {
        title: '压缩视频',
        description: '上传视频，然后选择更低的质量预设或更低的码率。保持相同的编解码器可最快得到结果，或改用WebM/H.265，在现代设备上获得更小的文件。保持相同的分辨率可获得最自然的效果。',
      },
    },
    'video-trimmer': {
      name: '视频剪辑',
      h1: '在线免费剪辑视频',
      tagline: '通过快速且保持画质的剪辑，把片段剪成你想要的部分，尽可能不重新编码。',
      metaTitle: '在线免费剪辑视频 | Media Manipulator',
      metaDescription: '免费在线视频剪辑工具。设置开始和结束时间，通过快速无损的剪辑剪出片段。输出MP4，无水印，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费剪辑视频',
      ogDescription: '以快速且保持画质的剪切，把视频剪成你想要的部分。免费，无水印。',
      intro: '剪辑会保留视频中的一段，丢弃其余部分。大多数在线剪辑工具为此会重新编码整个片段，既慢又损失画质。本页面默认采用更简单的做法：让FFmpeg定位到你的开始时间，然后在不解码的情况下，把所请求时长内的压缩视频和音频数据包复制到新文件中。这就是流复制，它是无损的，速度几乎与读取文件一样快。如果复制无法进行——因为源编解码器不被你选择的容器接受，或者因为你勾选了精确到帧的选项——服务器会改为只重新编码所选的那一段。',
      whatItDoes: [
        '从视频中剪出单个范围，从开始时间到结束时间，可以按秒输入，也可以在可视化时间线上选取。',
        '只要输出容器接受源编解码器，就直接复制流而不重新编码，因此保留的部分与原始文件逐位相同。',
        '复制被拒绝时会自动回退为重新编码，你也可以强制重新编码，以便精确到帧地剪切。',
        '默认输出MP4，也可选择MOV或WebM；MP4和MOV会带有faststart标志，让播放在下载完成前就能开始。',
        '用ffprobe检查文件是否确实包含视频流，并以清晰的提示拒绝纯音频上传。',
      ],
      flowSteps: [
        {
          title: '上传视频',
          description: 'MP4、MOV、M4V、WebM、MKV、AVI、FLV、WMV、MPEG或MPG，直接上传到我们的存储桶。',
        },
        {
          title: '设置开始和结束',
          description: '输入秒数或拖动两个手柄；面板会显示最终的片段长度。',
        },
        {
          title: '选择容器，必要时开启帧精确剪切',
          description: '已预设为MP4。只有在确切的帧很重要时，才勾选“重新编码以实现精确到帧的剪切”。',
        },
        {
          title: 'FFmpeg执行剪切',
          description: '使用-ss、-t和-c copy进行流复制；如果无法复制或你要求重新编码，则使用libx264 CRF 18重新编码。',
        },
        {
          title: '下载片段',
          description: '输出文件带有_trimmed后缀，会保存在任务文件夹中，直到保留期结束。',
        },
      ],
      advancedDetails: [
        '流复制命令为ffmpeg -ss START -i input -t DURATION -map 0 -c copy -avoid_negative_ts make_zero [-movflags +faststart] output（见specialized_tools.go中的runTrimVideo）。-map 0会保留所有流，包括额外的音轨和字幕，时间以毫秒精度写入。',
        '由于-ss放在-i之前且不解码，FFmpeg只能从关键帧开始，因此复制会从你的开始时间处或之前最近的关键帧开始。手机录像的关键帧间隔通常为1到2秒，这就是开头可能偏移的最大幅度；随后-avoid_negative_ts make_zero会重设时间戳，让播放器干净地开始播放。',
        '重新编码路径以高质量设置使用buildVideoCodecArgs：MP4和MOV使用libx264 -crf 18 -pix_fmt yuv420p配合AAC，WebM则使用libvpx-vp9 -b:v 0 -crf 18配合Opus。只映射第一个视频流和第一个音频流（如有），因此在这条路径上额外的轨道会被丢弃。',
        '复制模式以auto发送，即先尝试复制，失败时再重新编码。为H.264源选择WebM总会走重新编码路径，因为WebM只接受VP8、VP9和AV1视频。',
        '服务器端验证：开始时间必须大于或等于0，片段时长至少0.1秒、最多6小时，且结束时间必须晚于开始时间。不符合条件的请求会在FFmpeg启动前被拒绝，操作次数也会退还。',
        '由于剪辑是一种专用模式，上传会跳过标准转换所进行的自动内容分析；服务器只运行ffprobe和剪切。',
      ],
      whyItMatters: [
        '几乎每段录像都有开头的冷场和结尾手忙脚乱的停止，去掉它们是最常见的编辑操作。',
        '无损剪切意味着你可以剪辑母版文件，而不会产生二代副本。',
        '先剪切能让之后的每一步都更省事：压缩、加字幕或把片段转成GIF，都只需处理你保留的部分。',
      ],
      useCases: [
        {
          title: '会议和讲座录像',
          description: '去掉内容开始前大家陆续加入的那几分钟。',
        },
        {
          title: '社交媒体精彩片段',
          description: '保留关键的20秒，只上传这一段。',
        },
        {
          title: '证据和错误报告',
          description: '以完好的原始画质，准确分享问题发生的那一刻。',
        },
        {
          title: '准备GIF或修复片段',
          description: '先剪到几秒钟，再把片段交给最适合处理短输入的工具。',
        },
      ],
      workedExamples: [
        {
          title: '从180 MB、4.5分钟的1080p MP4中流复制剪出30秒',
          body: '输入：一个4分30秒、1920 x 1080的H.264 MP4，大小180 MB，约5.3 Mbps，符合访客默认的200 MB和5分钟上限。设置：开始45.000，结束75.000，输出MP4，未勾选重新编码。服务器以-ss 45.000和-t 30.000运行复制命令。由于数据包是直接复制的，输出大约包含270秒数据中的30秒，约20 MB，画质、编解码器和帧率与原始文件完全一致。剪切从45秒之前的最后一个关键帧开始，因此片段可能会提前一两秒开始。这项任务受限于文件读取而非计算，几秒钟内即可完成。',
        },
        {
          title: '从60 MB的1080p MP4中精确到帧地剪出12秒',
          body: '输入：一个2分钟、1920 x 1080、大小60 MB的MP4。设置：开始30.250，结束42.250，输出MP4，勾选“重新编码以实现精确到帧的剪切”。此时FFmpeg会从30.250处精确解码，使用libx264以CRF 18、yuv420p和faststart编码12秒（30 fps下共360帧），并将音频重新编码为AAC。CRF 18能让画面在视觉上非常接近源文件，因此结果每秒的大小与源文件处于同一量级，12秒约为几兆字节。只编码保留的12秒，绝不会编码完整的2分钟，因此这是一次短暂的编码，而不是几秒钟的复制。',
        },
      ],
      whenNotToUse: '如果要从一个视频中删除多个不相连的部分，请不要使用剪辑工具；它只保留一个范围，因此去掉中间一段需要剪辑两次，再在Darkroom中拼接。不要指望流复制能精确落在某一帧上；如果提前一秒开始的剪切会造成影响，请勾选重新编码选项，并接受一次短暂的编码。如果你的真正目标是更小的文件，剪辑能带来的帮助取决于你剪掉了多少；压缩工具改变的则是码率。另外，如果上传的文件没有视频流，例如重命名为MP4的M4A，剪辑工具会拒绝它；纯音频文件请使用音频工具处理。',
      whyMediaManipulator: [
        '默认采用无损流复制，重新编码的回退方案也写得明明白白，而不是藏在对整个文件又慢又“保险”的重新编码背后。',
        '本页面列出了确切的FFmpeg参数，包括剪切为何可能从前一个关键帧开始，以及如何避免。',
        '每次剪辑消耗每日额度中的一次操作（访客默认每天5次，免费账号每天30次），失败的任务会退还额度。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ],
      privacyNote: '剪辑工具在我们自己的服务器上运行ffprobe和一条FFmpeg命令。在默认路径中，视频和音频数据包只被复制、从不解码，因此服务器不会从你的文件中重建任何一幅画面；在重新编码路径中，FFmpeg只解码你保留的那几秒。上传的文件存放在uploads/<jobId>/，片段存放在outputs/<jobId>/，两者都登记在保留台账中，并在保留期结束时删除。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。剪辑是一种专用模式，因此不会对此次上传进行标准转换所进行的自动内容分析，也不会向任何第三方服务发送内容。',
      faq: [
        {
          question: '剪辑会重新编码我的视频吗？',
          answer: '默认不会。服务器使用-c copy复制压缩流，因此保留的部分与原始文件完全相同。只有在你勾选精确到帧的选项，或你选择的容器无法容纳源编解码器时（例如为H.264文件选择WebM），才会重新编码。',
        },
        {
          question: '为什么我的片段比我输入的时间早一点开始？',
          answer: '流复制只能从关键帧开始，FFmpeg会选择你的开始时间处或之前最近的一个关键帧。在相机拍摄的素材中，关键帧间隔通常为1到2秒。勾选“重新编码以实现精确到帧的剪切”，即可从确切的帧开始。',
        },
        {
          question: '可以选择哪些输出容器？哪些能保留原始画质？',
          answer: 'MP4、MOV和WebM。MP4和MOV接受大多数相机生成的H.264或HEVC视频以及AAC音频，因此能保持无损。WebM只接受VP8、VP9和AV1，因此选择WebM时，H.264源会以CRF 18重新编码为VP9。',
        },
        {
          question: '剪辑后的片段最长和最短可以是多少？',
          answer: '最短0.1秒，最长6小时，且结束时间必须晚于开始时间。实际上，上传上限会先起作用：默认情况下，访客为5分钟视频，免费账号为20分钟，Premium为2小时。',
        },
        {
          question: '会保留所有音轨和字幕吗？',
          answer: '在流复制路径中会：-map 0会复制文件中的每一条流。在重新编码路径中，只保留第一个视频流和第一个音频流。',
        },
        {
          question: '可以一次把视频剪成多个部分吗？',
          answer: '不可以。一次上传只能从一个范围生成一个片段。如需多个片段，请针对每个范围分别运行一次剪辑工具，或在Darkroom的时间线上组装各个部分。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '尽可能使用流复制（无画质损失）；重新编码回退方案对MP4使用H.264 + AAC。',
        ],
      },
      related: [
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '剪辑后再缩小片段。',
        },
        {
          label: '将视频转换为动态GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: '把剪好的几秒变成GIF。',
        },
        {
          label: '从视频中提取音频',
          to: '/tools/extract-audio-from-video',
          description: '只保存片段的声音。',
        },
        {
          label: 'AI视频修复',
          to: '/tools/ai-video-restoration',
          description: '修复适用于15秒及以下的片段；请先剪辑。',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '将多个剪好的片段合并为一个作品。',
        },
      ],
      embed: {
        title: '剪辑视频',
        description: '上传视频，然后设置开始和结束时间（或以可视化方式选择范围）。只要可能，我们会以快速的无损剪切保留原始画质。',
      },
    },
    'extract-audio-from-video': {
      name: '从视频中提取音频',
      h1: '从视频中提取音频',
      tagline: '将任意视频的音轨保存为干净的MP3、WAV、M4A、AAC、FLAC或OGG文件。',
      metaTitle: '从视频中提取音频：MP3、WAV、M4A等 | Media Manipulator',
      metaDescription: '免费在线工具，可从任意视频文件（MP4、MOV、MKV、WebM、AVI）中提取音频。可输出MP3、WAV、M4A、AAC、FLAC或OGG。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '从视频中提取音频',
      ogDescription: '将MP4/MOV/MKV/WebM/AVI的音轨保存为MP3、WAV、M4A、AAC、FLAC或OGG。免费，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      intro: '每个视频容器都把音频作为独立的流来承载，因此取出声音完全不涉及画面。本页让FFmpeg选择第一条音频流、忽略视频，并将该流编码为你选择的格式：MP3适合任何能播放音乐的设备；想让采样原封不动时选择WAV或FLAC；M4A或AAC可得到手机原生支持的小文件；也可以选择OGG Vorbis。开始之前，服务器会用ffprobe检查是否存在音频流，否则FFmpeg会毫无提示地写出一个空文件。',
      whatItDoes: [
        '从MP4、MOV、M4V、WebM、MKV、AVI及其他常见视频容器中选择第一条音频流（-map 0:a:0），并丢弃视频（-vn）。',
        'MP3使用libmp3lame以质量2编码（可变比特率，平均约190 kbps），WAV为16位PCM，M4A或AAC为192 kbps，FLAC为无损编码，OGG使用libvorbis以质量5编码。',
        '保留原始采样率和声道数；不会重新采样或缩混。',
        '没有音频流的视频会被立即拒绝，并提示没有可提取的内容。',
        '返回单个音频文件，以原文件名加上所选扩展名命名。',
      ],
      flowSteps: [
        {
          title: '上传视频',
          description: '任何常见容器均可；文件会直接进入我们的存储桶，由API接手处理。',
        },
        {
          title: '选择音频格式',
          description: '预设为MP3。WAV和FLAC是无损格式；M4A和AAC体积小巧；OGG是开放的有损格式。',
        },
        {
          title: 'ffprobe确认存在音频流',
          description: '无声视频会在这一步停止并给出明确的错误，而不是生成空文件。',
        },
        {
          title: 'FFmpeg编码音频流',
          description: '一条命令，包含-map 0:a:0 -vn和对应格式的编码器。',
        },
        {
          title: '下载音频',
          description: '文件保存在任务文件夹中，直到保留期结束。',
        },
      ],
      advancedDetails: [
        '命令为ffmpeg -y -i input -map 0:a:0 -vn <encoder args> output（位于specialized_tools.go中的runExtractAudio）。-vn表示视频流永远不会被解码，这就是为什么即使是4K源文件，提取也很快。',
        'MP3使用-c:a libmp3lame -q:a 2，即LAME V2可变比特率设置，音乐平均约190 kbps，语音则更低。WAV使用-c:a pcm_s16le，因此44.1 kHz立体声源每分钟约10.1 MB，48 kHz源每分钟约11 MB。',
        'M4A和AAC都使用FFmpeg原生AAC编码器，参数为-b:a 192k。FLAC是无损的，通常为WAV大小的50%到70%。OGG使用-c:a libvorbis -q:a 5，约160 kbps。',
        '不传入-ar或-ac参数，因此输出保留源文件的采样率和声道布局；5.1环绕声在WAV和FLAC中仍为5.1，而MP3最多只能承载两个声道。',
        '只映射流0:a:0。带有解说音轨或第二语言音轨的文件，会保留容器中排在第一位的那条音轨。',
        '提取是一种专用模式：上传的文件不会进入标准转换所经历的自动内容分析队列，视频转换器中的质量、尺寸调整和效果控制也不适用。',
      ],
      whyItMatters: [
        '播客主、转录员和剪辑师通常只需要声音而不需要画面，而视频往往比其中的音频大20到50倍。',
        '正确标记的MP3或M4A可以在每部手机和每个播放器上播放，无需耗电的视频解码。',
        '无损的WAV或FLAC输出是降噪、人声分离或精细转录的理想输入。',
      ],
      useCases: [
        {
          title: '纯音频单集',
          description: '将录制的视频访谈的声音发布为播客MP3。',
        },
        {
          title: '转录准备',
          description: '把一段18分钟的录音以25 MB的MP3交给转录工具，而不是540 MB的MP4。',
        },
        {
          title: '声音设计与采样',
          description: '从片段中提取WAV，在另一个剪辑中重复使用环境音或音乐。',
        },
        {
          title: '课堂笔记',
          description: '保留课堂录像的音频，随时随地收听。',
        },
      ],
      workedExamples: [
        {
          title: '将一段18分钟、540 MB的720p录像提取为MP3',
          body: '输入：一段18分钟、1280 x 720、540 MB的MP4（约4 Mbps），因超出访客默认的200 MB和5分钟限制，使用免费账号上传。设置：MP3。服务器用ffprobe确认存在立体声48 kHz AAC音轨，然后运行libmp3lame -q:a 2。按约190 kbps计算，每分钟约1.4 MB，因此结果约为25 MB，大约是上传文件的二十分之一。由于-vn完全跳过视频，该任务只是一次单纯的音频解码和编码，速度很快；上传540 MB所需的时间远比从中提取音频要长。',
        },
        {
          title: '将一段4分钟、95 MB的1080p音乐视频提取为WAV',
          body: '输入：一段4分钟、1920 x 1080、95 MB的MP4，带有44.1 kHz立体声AAC音轨，在访客限制之内。设置：WAV。FFmpeg对AAC解码一次，然后用pcm_s16le写入16位PCM，保留44.1 kHz和两个声道。该采样率下的PCM为每秒44,100 x 16 x 2比特，约每分钟10.1 MB，因此无论音乐多响亮或多繁复，文件都约为40 MB。如果改选FLAC，同样的采样会被无损压缩到约20到28 MB，具体取决于素材。耗时只是几秒钟的音频解码；视频完全不会被触碰。',
        },
      ],
      whenNotToUse: '不要用本页来改善音质；它只会复制已有的内容，嘈杂或收音较远的录音依然嘈杂。“人声音频降噪”和“去除背景噪音”工具才是为此而设计的。不要指望WAV能找回视频已经损失的音质；源音轨几乎总是有损的AAC，因此WAV只是压缩信号的忠实副本，而不是录音棚母带。如果视频有两条语言音轨，而你需要的是第二条，本工具只会提取第一条。如果你真正想要的是文字，转录工具会读取音频，直接给你文本和字幕。',
      whyMediaManipulator: [
        '编码器设置一目了然：MP3使用LAME V2，AAC为192 kbps，WAV为16位PCM，并全程保留原始采样率。',
        '无声视频会在任何处理开始前被ffprobe发现，因此你绝不会下载到零长度的文件。',
        '一次提取计为每日额度中的一次操作：默认情况下，没有账号每天5次，免费账号每天30次；被拒绝或失败的任务会退还额度。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ],
      privacyNote: '提取在我们自己的服务器上以一条FFmpeg命令运行，只读取你上传文件的第一条音频流；视频帧永远不会被解码。上传的文件位于uploads/<jobId>/，音频位于outputs/<jobId>/，两者都登记在保留台账中，并在保留期结束时删除。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。由于提取是一种专用模式，上传的文件不会经过标准转换所经历的自动内容分析；它不会被转录或描述，也不会有任何内容离开我们的硬件。',
      faq: [
        {
          question: '我可以提取为哪些音频格式？哪些是无损的？',
          answer: 'MP3、WAV、M4A、AAC、FLAC和OGG。WAV和FLAC是解码后音轨的无损副本。MP3（约190 kbps VBR）、M4A和AAC（192 kbps）以及OGG（质量5）是有损格式，但比特率高于大多数视频音轨。',
        },
        {
          question: '提取出的音频会有多大？',
          answer: 'WAV在44.1 kHz立体声下约每分钟10.1 MB，48 kHz下约11 MB。按本页的设置，MP3约每分钟1.4 MB，192 kbps的M4A和AAC约每分钟1.4 MB，OGG约每分钟1.2 MB。FLAC通常为WAV大小的一半到三分之二。',
        },
        {
          question: '提取会改变采样率或立体声声像吗？',
          answer: '不会。FFmpeg运行时不带-ar或-ac，因此输出保留源文件的采样率和声道布局。48 kHz立体声音轨仍为48 kHz立体声。',
        },
        {
          question: '如果我的视频没有音频会怎样？',
          answer: '服务器会先探测文件，然后停止处理，并提示没有可提取的内容。该次操作会被退还，也不会生成空文件。',
        },
        {
          question: '我的视频有两条音轨，我会得到哪一条？',
          answer: '容器中的第一条，即流0:a:0。目前还没有音轨选择器。如果你需要的是第二条，请先用该音轨重新封装或重新导出视频。',
        },
        {
          question: '提取音频是免费的吗？可以上传多长的视频？',
          answer: '是的。默认情况下，访客每天可以运行5次操作，文件最大200 MB、5分钟；免费账号每天30次，最大1 GB、20分钟；Premium支持5 GB和2小时。当前限制列在价格页面上。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '我们提取第一条音频流。没有任何音频流的视频会返回明确的错误，而不是空文件。',
        ],
      },
      related: [
        {
          label: '视频转录',
          to: '/tools/transcribe-video',
          description: '跳过音频文件，直接获取文字。',
        },
        {
          label: '人声音频降噪',
          to: '/tools/clean-voice-audio',
          description: '对提取出的语音降噪并平衡音量。',
        },
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: '去掉提取音轨中的嗡嗡声和嘶嘶声。',
        },
        {
          label: '去除歌曲人声',
          to: '/tools/remove-vocals-from-song',
          description: '把提取出的音乐变成伴奏。',
        },
        {
          label: '视频剪辑',
          to: '/tools/video-trimmer',
          description: '在提取前把视频剪成你想要的部分。',
        },
      ],
      embed: {
        title: '从视频中提取音轨',
        description: '上传任意常见的视频容器。选择MP3以获得广泛兼容性，WAV为无损格式，M4A/AAC为小巧的压缩文件。没有音轨的视频会返回明确的错误。',
      },
    },
    'convert-video-to-animated-gif': {
      name: '将视频转换为动态GIF',
      h1: '在线将视频转换为动态GIF',
      tagline: '几秒钟内把短小的MP4、WebM、MOV或MKV片段变成便于分享的动态GIF。',
      metaTitle: '在线将视频转换为动态GIF（免费） | Media Manipulator',
      metaDescription: '免费在线视频转GIF工具。将短小的MP4、WebM、MOV和MKV片段变成动态GIF，并可控制尺寸和帧率。',
      ogTitle: '在线将视频转换为动态GIF',
      ogDescription: '将短视频片段变成便于分享的动态GIF。可控制帧率、尺寸和循环。',
      intro: '动态GIF是一叠索引色帧，每个调色板最多256种颜色，除了简单的游程编码外没有任何帧间压缩。这就是为什么几秒钟的GIF可能比一分钟的MP4还大，也是为什么做好一个GIF主要在于选择宽度、帧率和调色板大小。本页运行两阶段处理流程：FFmpeg将视频缩放到你设置的宽度，并按你的帧率采样，写出原始GIF；然后gifsicle按你的颜色数重新量化调色板，设置帧延迟并优化各帧，只存储发生变化的像素。默认值针对录屏进行了调校：宽900像素，每秒12帧，128色。',
      whatItDoes: [
        '将片段缩放到所选宽度（16到2000 px），高度根据宽高比计算，并取整为4的倍数。',
        '用FFmpeg按所选帧率（1到50 fps；默认12）对源视频采样。',
        '将每一帧量化为2到256色的调色板（默认128），并用gifsicle以1到3级优化帧间存储。',
        '以百分之一秒为单位设置帧延迟，它决定播放速度，与采样率无关。',
        '遵循转换器表单中的裁剪范围，只有选中的那几秒会变成帧。',
      ],
      flowSteps: [
        {
          title: '上传视频并选择GIF',
          description: '本页已将GIF选为输出格式；“质量”控件已禁用，因为它不适用。',
        },
        {
          title: '裁剪到几秒钟',
          description: '用裁剪控件保留你想要的瞬间；在默认帧率下，每多一秒就多12帧。',
        },
        {
          title: '设置宽度、帧率、颜色数和延迟',
          description: '“动态GIF设置”面板的初始值为900 px、12 fps、128色、延迟3、优化3。',
        },
        {
          title: 'FFmpeg采样，gifsicle优化',
          description: 'ffmpeg scale=W:-4 -pix_fmt rgb8 -r FPS，然后gifsicle --optimize --delay --colors --interlace。',
        },
        {
          title: '下载GIF',
          description: '一个标准的循环GIF，聊天应用和浏览器都能内联播放。',
        },
      ],
      advancedDetails: [
        '第一阶段是ffmpeg -i input [-ss START -t DURATION] -vf scale=W:-4 -pix_fmt rgb8 -r FPS -f gif raw.gif（见converter.go中的convertVideoToGIF）。-4表示要求高度保持宽高比且能被4整除；rgb8是一种8位索引中间格式，由第二阶段重新量化。',
        '第二阶段是gifsicle --optimize=L --delay=D --colors C --interlace raw.gif -o output.gif。优化级别3最慢但文件最小：它只存储帧与帧之间发生变化的像素矩形，这就是为什么带有静态工具栏的录屏比平移的摄像机镜头压缩效果好得多。',
        '延迟在采样之后应用于每一帧，与采样率无关。在默认的12 fps和延迟3（每帧30 ms）下，片段的播放速度约为实时的2.8倍；将延迟设为8（80 ms，12.5 fps）可在12 fps下接近实时播放，10 fps时则设为10。',
        '在转换器主“宽度”字段中输入的宽度会覆盖GIF面板中的宽度，因此高级用户可以只用一个旋钮。颜色数在表单中被限制在2到256之间；GIF调色板永远不能超过256。',
        '这里没有在FFmpeg中进行palettegen处理；调色板质量来自gifsicle --colors，它会为整个动画构建一个优化的调色板。带有平滑渐变的照片类片段适合用256色；扁平的UI素材在64色下看起来完全一样。',
        'gifsicle阶段的超时时间为6小时，而且由于GIF是常规视频转换器的一种格式，上传的文件也会经过标准转换所进行的自动内容分析。',
      ],
      whyItMatters: [
        'GIF可以在问题跟踪器、聊天应用、文档网站和邮件客户端中内联自动播放，而视频附件在这些地方只会显示一个播放按钮，甚至什么都不显示。',
        '一个5秒的bug复现GIF比一段文字说明更快地重现问题，而且不需要视频播放器。',
        '调色板和帧率的选择会让文件大小相差一个数量级，因此开放这些选项胜过单一尺寸的预设。',
      ],
      useCases: [
        {
          title: 'Bug复现',
          description: '录制屏幕，裁剪到出错的那一段，再把GIF放进工单里。',
        },
        {
          title: 'README和文档演示',
          description: '在不允许嵌入视频的地方展示功能的动态效果。',
        },
        {
          title: '反应片段',
          description: '从视频中剪出3秒，分享到任何接受图片的地方。',
        },
        {
          title: '邮件预览',
          description: '在视频本身无法播放的地方，用一个链接到完整视频的小型循环GIF代替。',
        },
      ],
      workedExamples: [
        {
          title: '以默认设置转换一段8秒的1080p录屏',
          body: '输入：一段8秒、1920 x 1080、约15 MB的MP4录屏。设置：GIF、宽度900、12 fps、128色、延迟3、优化3。FFmpeg将其缩放为宽900像素、高约506像素（调整为4的倍数），并采样96帧。未压缩时，这96个索引帧约为43 MB（900 x 504 x 96字节），这是gifsicle向下压缩的起点；在工具栏静止、光标移动的情况下，3级优化只存储变化的矩形，因此录屏文件会远低于这个上限，通常只有几兆字节。在延迟3下，96帧约在2.9秒内播完，大约比8秒的源视频快2.8倍；将延迟设为8，则约在7.7秒内播完。这项任务只是一次简短的编码，加上gifsicle对96帧的一次处理。',
        },
        {
          title: '以480 px、10 fps和64色制作的5秒反应片段',
          body: '输入：一段20秒、40 MB的1080p MP4，在表单中裁剪为5秒的范围。设置：GIF、宽度480、10 fps、64色、延迟10、优化3。FFmpeg剪出这5秒，缩放为宽480像素、高约270像素（取整为4的倍数），并采样50帧。优化前的原始帧数据约为6.5 MB（480 x 268 x 50字节），而64色调色板每像素只需6位，因此即使是整个画面都在运动的摄像机镜头，结果也会远低于这个数值，而平稳的口播画面则会压缩到其一小部分。延迟10即每帧100 ms，因此50帧正好在5秒内播完，与10 fps下的实时速度一致。',
        },
      ],
      whenNotToUse: '不要把任何超过约10秒的内容，或整个画面都有照片级运动的内容做成GIF；这种格式没有真正的帧间压缩，因此这类片段会变成几十兆字节，而同样内容的MP4或WebM只有其十分之一大小。在色彩保真度很重要时不要使用GIF，因为每一帧都被限制在256色调色板内，渐变会出现色带。如果目标平台能内联播放视频，压缩后的MP4在各方面都更好。如果你需要音频，GIF根本无法承载。',
      whyMediaManipulator: [
        '处理流程的两个阶段及其默认值都在这里有说明，包括让默认GIF播放偏快的延迟机制。',
        '宽度、帧率、颜色数、延迟和优化级别全部开放，而不是只有一个尺寸滑块。',
        '一次GIF转换计为一次常规任务（默认访客每天5次，免费账号每天30次），失败的任务会退还额度。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。',
      ],
      privacyNote: 'GIF转换在我们自己的服务器上运行：FFmpeg采样并缩放各帧，然后gifsicle进行量化和优化；临时的原始GIF会在gifsicle完成后立即删除。上传的文件保存在uploads/<jobId>/中，GIF保存在outputs/<jobId>/中，两者都登记在保留期登记表中，并在保留期结束时删除。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。作为标准视频转换器的一种格式，上传的文件还会在同一硬件上经过我们的自动内容分析（由本地视觉模型描述抽样帧，在本地转录任何音频）；该报告与任务一起保存，不会与第三方共享。',
      faq: [
        {
          question: '为什么我的GIF播放得比原视频快？',
          answer: '帧延迟在采样之后设置，默认为3个百分之一秒，对于以每秒12帧采样的帧来说，相当于以每秒约33帧播放。要实时播放，请在12 fps下将延迟设为8，或在10 fps下设为10。',
        },
        {
          question: '如何让GIF更小？',
          answer: '按效果大小排序：裁剪到更少的秒数，降低宽度（聊天用480就足够了），将帧率降到8或10，在扁平的UI素材上将颜色数减少到64。将优化保持在3；级别1和2只是以体积换取速度。',
        },
        {
          question: '我应该用多少种颜色？',
          answer: '默认的128适合大多数录屏。扁平的界面在64色下看起来完全一样，还能节省字节。带渐变的照片类素材需要256色，这是GIF的上限。',
        },
        {
          question: '我可以选择视频的哪一部分变成GIF吗？',
          answer: '可以。使用转换器中的裁剪控件设置开始和结束时间；只有该范围会被采样。越短越好，因为在所选帧率下，每多一秒都会增加帧数。',
        },
        {
          question: 'GIF会循环播放吗？会保留声音吗？',
          answer: '会循环播放，这是所有播放器中GIF的默认行为。它无法承载音频；这种格式没有音轨。如果你需要音频，请单独提取。',
        },
        {
          question: '我能制作的最大GIF是多大？',
          answer: '表单允许最大2000 px宽、50 fps和256色，但在这些设置下，GIF会迅速变得极其庞大。上传文件本身受你的套餐限制，默认访客为200 MB和5分钟视频。',
        },
      ],
      related: [
        {
          label: '裁剪视频',
          to: '/tools/video-trimmer',
          description: '先无损地剪出精确的秒数。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '对于超过几秒的内容，小巧的MP4胜过GIF。',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '在导出片段之前添加字幕或进行裁切。',
        },
        {
          label: '视频转换器教程',
          to: '/tutorials/video/getting-started',
          description: '逐步了解裁剪、调整尺寸和滤镜设置。',
        },
      ],
      embed: {
        title: '将视频片段转换为GIF',
        description: '上传一段短视频，并选择GIF作为输出格式。裁剪到约10秒以内并降低帧率，可获得更小的文件。',
      },
    },
    'transcribe-video': {
      name: '视频转录',
      h1: '在线将视频转录为文字',
      tagline: '把视频或音频文件中的语音提取为WebVTT或SRT字幕、纯文本或带时间戳的JSON。',
      metaTitle: '在线将视频转录为文字（免费） | Media Manipulator',
      metaDescription: '免费在线视频转录工具。将MP4、MOV、WebM、MKV和音频文件转换为可搜索的文本、VTT字幕或JSON转录稿。',
      ogTitle: '在线将视频转录为文字',
      ogDescription: '将视频中的语音提取为文字、字幕或JSON转录稿。运行在本地GPU服务器上。',
      intro: '视频转录工具接收MP4、MOV、WebM、MKV或普通音频文件，分离出音轨，并在我们运营的GPU服务器上用Whisper进行处理。你在上传之前就选择结果的形式：带字幕时间轴的WebVTT或SRT字幕文件、只含文字的纯文本文件，或者包含每个分段及其精确到毫秒的开始和结束时间的JSON文档。语言会自动检测，你也可以输入两个字母的语言代码来指定。',
      whatItDoes: [
        '用ffmpeg将音轨解码为16 kHz单声道WAV（Whisper所需的采样率），并在任务完成后删除该中间文件。',
        '在我们的GPU上以float16运行搭载medium Whisper模型的whisper-ctranslate2，并开启语音活动过滤，从而跳过静音和长段音乐。',
        '根据你选择的格式，写入一个名为transcript.vtt、transcript.srt、transcript.txt或transcript.json的文件。',
        '根据音频本身检测所说的语言；对于很短或多语言混杂的片段，你在表单中输入的语言代码会覆盖自动检测。',
        '在没有可转录内容时如实报告：没有音频流的视频，或没有可识别语音的音频，仍会完成任务并给出一条简短消息，而不是一个空文件。',
      ],
      flowSteps: [
        {
          title: '上传视频或音频',
          description: 'MP4、MOV、WebM、MKV、AVI，或MP3、WAV、M4A、FLAC等音频文件。',
        },
        {
          title: '选择格式',
          description: 'VTT或SRT用于字幕，TXT用于可阅读的转录文本，JSON用于可供程序处理的时间戳。',
        },
        {
          title: 'ffmpeg提取音频',
          description: '音轨会被转换为16 kHz单声道PCM；视频帧从不解码。',
        },
        {
          title: 'Whisper在我们的GPU上转录',
          description: '任务会等待空闲的GPU槽位，然后medium模型一遍处理整个文件。',
        },
        {
          title: '下载转录文本',
          description: '文件会随任务一起出现，只要任务还在保留期内就可以下载。',
        },
      ],
      advancedDetails: [
        '完整的提取命令是ffmpeg -vn -acodec pcm_s16le -ar 16000 -ac 1，因此立体声48 kHz音轨在交给Whisper之前会被混为单声道并重新采样。该中间文件在任务运行期间每秒占用32 KB（约每分钟1.9 MB）磁盘空间，之后会被删除。',
        'whisper-ctranslate2以--model medium --device cuda --compute_type float16 --vad_filter True和--output_format json启动；API解析该JSON，并自行渲染你选择的格式。模型是服务器设置（WHISPER_CT2_MODEL），因此medium是默认值，而非承诺。',
        'VTT输出以WEBVTT标头开头，并为每个字幕条目编号；时间戳格式为HH:MM:SS.mmm。SRT是同样的条目列表，只是毫秒分隔符为逗号。结束时间与开始时间相同的分段会被赋予半秒时长，以便播放器仍能显示它。',
        'JSON输出包含language、hasAudio、hasSpeech、transcript、durationSeconds，以及由{id, start, end, text}组成的segments数组，时间四舍五入到毫秒。此输出中没有逐词时间，也没有置信度分数。',
        '默认情况下一次只运行一个Whisper进程（WHISPER_GPU_CONCURRENCY=1），GPU调度器会在启动前检查空闲显存；float16的medium模型约需3.5 GB，外加512 MB余量。如果显卡繁忙，你的任务会在队列中等待，而不会失败。',
        '开启VAD过滤后，全是音乐或语音非常微弱的文件可能会返回“Audio was detected but no recognizable speech was found.”（意为：检测到音频，但未发现可识别的语音）。该消息会写入转录文件，因此下载的文件永远不会为空。',
      ],
      whyItMatters: [
        '有没有字幕文件，决定了一个视频能否在静音时观看、能否被搜索或引用。',
        '带时间戳的分段让你可以跳到某句话被说出的时刻，这正是让一段两小时的录音真正变得可用的关键。',
        '在我们自己运行的硬件上进行转录，意味着音频不会交给外部语音API。',
      ],
      useCases: [
        {
          title: '为已发布的视频制作字幕',
          description: '导出VTT用于HTML视频和大多数网页播放器，或导出SRT用于剪辑软件和电视风格的字幕工作流。',
        },
        {
          title: '会议和访谈笔记',
          description: '将TXT输出导入文档，在此基础上编辑，而不必从零开始打字。',
        },
        {
          title: '为录音档案建立索引',
          description: '使用JSON分段构建搜索索引，指向某个词被说出的确切秒数。',
        },
        {
          title: '文章初稿',
          description: '转录演讲或录屏，然后将纯文本改写成文章。',
        },
      ],
      workedExamples: [
        {
          title: '一段9分钟、120 MB的1080p MP4，转为VTT字幕',
          body: '120 MB低于访客200 MB的上限，但9分钟超过了访客5分钟的限制，因此需要免费账号，其默认允许20分钟。ffmpeg会写出一个约17 MB的16 kHz单声道WAV（每秒32,000字节，共540秒），运行结束后删除。随后Whisper medium生成带编号、采用HH:MM:SS.mmm时间格式的字幕条目，生成的transcript.vtt只有几KB，因为它只包含文字和时间戳。在家庭网络上上传120 MB通常比提取音频（只需几秒）耗时更长；其余时间都花在Whisper处理上，它随语音长度而非视频大小增长。',
        },
        {
          title: '一段约26 MB的18分钟播客MP3，转为JSON',
          body: '192 kbps的MP3每秒为24 KB，因此1,080秒约为26 MB。纯音频文件与视频受同样的时长限制，因此18分钟需要免费账号（上限20分钟），而不是访客会话（5分钟）。虽然没有视频可以跳过，但文件仍会先转换为16 kHz单声道PCM（磁盘上约35 MB，之后删除）。语言根据音频检测，并以两个字母的代码写入JSON，每个分段都带有自己的开始和结束时间。同一段录音的JSON比TXT大，因为每个分段都包装在自己的对象中，但仍远小于一兆字节。',
        },
      ],
      whenNotToUse: '当你需要逐词时间、说话人标签或置信度分数时，不要使用本工具：输出中都没有这些，只有分段级的时间戳。对于音频是没有语音的音乐的文件，它也不是合适的工具，因为语音活动过滤器会跳过它，你会得到一条简短消息，而不是歌词。如果你只是需要听这个文件，或者想把字幕翻译成另一种语言，那么你需要的是另一个步骤。如果录音长于你的套餐允许的时长（默认访客5分钟，免费账号20分钟），请先裁剪或登录。',
      whyMediaManipulator: [
        '你在上传前就选择VTT、SRT、TXT或JSON，因此转录文本生成后无需再转换一次。',
        'Whisper在我们自己的GPU上运行，模型缓存设为离线模式；不会有任何外部语音服务接收到音频。',
        '转录计为一次AI任务，从AI任务额度中扣除，它与常规任务额度相互独立：默认访客每天3次，免费账号每天10次，你的常规任务额度不受影响（见/pricing）。',
      ],
      privacyNote: '你的视频或音频文件存储在我们服务器上对应的任务文件夹中。ffmpeg会写出一个临时的16 kHz单声道WAV，由Whisper在我们的GPU上读取，该WAV会在任务完成时删除。转录文件和一份包含分段的transcribe_result.json副本会随任务保留，转录文本还会交给在我们自己硬件上运行的语言模型，用于自动摘要和安全审阅，其结果也随任务保存。不会向任何第三方AI服务商发送任何内容。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。',
      faq: [
        {
          question: '我应该选择哪种字幕格式，VTT还是SRT？',
          answer: '如果字幕用于网页（HTML视频、大多数播放器），选VTT；如果要导入视频剪辑软件或广播风格的工作流，选SRT。两者包含相同的字幕条目；只有标头和毫秒分隔符不同，VTT用句点，SRT用逗号。',
        },
        {
          question: 'JSON转录文本包含置信度分数或逐词时间吗？',
          answer: '不包含。每个分段都有id、以秒为单位的开始和结束时间（四舍五入到毫秒）及其文本。文件还会记录检测到的语言、时长以及是否发现了语音，但没有逐词时间，也没有概率。',
        },
        {
          question: '我可以转录多长的文件？',
          answer: '纯音频上传与视频受同样的时长上限：默认访客5分钟，免费账号20分钟，Premium和Pro为2小时；每个文件分别为200 MB、1 GB或5 GB。表单会显示适用于你的限制，/pricing列出了当前数值。',
        },
        {
          question: '为什么我收到了“no recognizable speech was found”（未发现可识别的语音）？',
          answer: 'Whisper在运行时开启了语音活动检测，因此音乐、环境声、静音或非常微弱的语音文件可能会被裁剪得什么都不剩。该消息会写入转录文件本身，因此下载仍然有效。请提高音量重新录制，或裁剪到有说话的部分后重试。',
        },
        {
          question: '我可以强制指定语言而不让它自动检测吗？',
          answer: '可以。在语言字段中输入两个字母的语言代码，例如en、de或es，Whisper就会以该语言转录。留空则自动检测，对于长于几秒的片段效果很好。',
        },
        {
          question: '转录会占用我的AI任务额度吗？',
          answer: '会。每次转录计为一次AI任务：默认访客每天3次，免费账号10次，Premium 100次，Pro 200次。AI任务额度有自己的计数器，因此转录永远不会消耗用于转换的常规任务额度。失败的任务会退还额度。',
        },
        {
          question: '使用的是什么模型？我可以选择更大的模型吗？',
          answer: '默认情况下，该服务在CUDA GPU上以float16运行搭载medium模型的whisper-ctranslate2。表单中没有模型选择器；模型在服务器上设置，因此你无法按任务请求速度极快或规模极大的变体。',
        },
      ],
      related: [
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '在上传以获取转录文本之前，先缩小大型录像。',
        },
        {
          label: '从视频中提取音频',
          to: '/tools/extract-audio-from-video',
          description: '如果你还想保留一份音轨副本，可以将其提取出来。',
        },
        {
          label: '人声音频降噪',
          to: '/tools/clean-voice-audio',
          description: '在转录之前，先改善嘈杂的录音。',
        },
        {
          label: '视频剪辑',
          to: '/tools/video-trimmer',
          description: '先把文件剪到只剩说话的部分。',
        },
        {
          label: '视频转换器教程',
          to: '/tutorials/video/getting-started',
          description: '在转录之前准备并转换视频。',
        },
      ],
      embed: {
        title: '转录视频',
        description: '上传视频。AI转录模型在我们的本地GPU服务器上运行，可导出为VTT字幕、纯文本或JSON：VTT用于字幕，纯文本用于文章，JSON用于下游工具。',
      },
    },
    'transcode-to-hls': {
      name: '将视频转码为HLS',
      h1: '在线将视频转码为HLS',
      tagline: '把任意视频打包成Apple HLS VOD包：master.m3u8和按清晰度划分的.ts分片，可直接用于网页。',
      metaTitle: '在线将视频转码为HLS | 免费自适应流媒体工具 | Media Manipulator',
      metaDescription: '免费在线HLS转码工具。将MP4、MOV、WebM、MKV转换为包含360p/480p/720p清晰度的HLS VOD包，可选字幕和故事板。',
      ogTitle: '在线将视频转码为HLS',
      ogDescription: '从任意视频生成自适应HLS包（master.m3u8 + 变体播放列表 + .ts分片）——免费，在你的浏览器中完成。',
      intro: 'HTTP Live Streaming将视频以由多个质量级别的短分片组成的播放列表形式提供，让播放器可以快速起播，并随网络状况变化切换档位。手动制作这样的包，意味着要以对齐的关键帧编码每个清晰度版本、对它们进行分片，再编写一个正确描述每个变体的主播放列表。本页包办全部工作：它会探测你上传的文件，列出你的源文件和套餐允许的档位，用libx264和AAC将每个档位编码为2秒的MPEG-TS分片，还可选择添加由我们自己的Whisper转录器生成的字幕、故事板精灵图和用于拖动浏览的I帧播放列表，并将所有内容打包为tar.gz或zip，你可以将其解压到任何静态主机上。',
      whatItDoes: [
        '用ffprobe探测源文件并列出各档位：144p、240p、360p、480p、720p、1080p和2160p，每个档位只有在源文件高度足够且你的套餐允许时才会启用。',
        '用libx264 High配置文件4.1级别和48 kHz的AAC立体声编码每个选中的档位，生成2秒的.ts分片，每个分片边界都有一个关键帧。',
        '写入hls/master.m3u8，其中为每个变体标明BANDWIDTH、RESOLUTION、FRAME-RATE和CODECS，并为每个档位写入一个index.m3u8。',
        '可选择用Whisper将音频转录为WebVTT字幕轨，用本地模型将其翻译为最多3种其他语言，并将每种语言作为字幕版本链接到主播放列表中。',
        '可选择渲染带WebVTT索引的故事板精灵图，用作拖动条缩略图，并始终尝试添加一个240p的纯I帧播放列表。',
        '将该文件夹连同README.txt和report.json打包为tar.gz（或zip），并给你一个预签名下载链接。',
      ],
      flowSteps: [
        {
          title: '上传',
          description: '浏览器通过预签名PUT直接上传到我们的存储桶；然后API将其下载下来进行处理。',
        },
        {
          title: '探测',
          description: 'ffprobe读取宽度、高度、帧率、时长以及是否有音频；高于源文件的档位会显示为灰色。',
        },
        {
          title: '选择档位和附加项',
          description: '默认选中360p、480p和720p。勾选字幕、额外的字幕语言、故事板，以及tar.gz或zip。',
        },
        {
          title: '编码每个档位',
          description: 'libx264使用该档位的CRF和码率，GOP为2秒，AAC使用该档位的音频码率，输出HLS VOD。',
        },
        {
          title: '添加附加项并写入主播放列表',
          description: '生成字幕、故事板和I帧播放列表，然后重写master.m3u8以引用它们。',
        },
        {
          title: '下载包',
          description: '预签名链接默认有效30分钟；在有效期内，你可以在任务页面获取它。',
        },
      ],
      advancedDetails: [
        '档位表（transcode_profiles.go）为：144p，视频200 kbps、音频64 kbps，CRF 26；240p，400/64，CRF 25；360p，800/96，CRF 23；480p，1200/128，CRF 23；720p，2800/128，CRF 22；1080p，5000/192，CRF 22；2160p，12000/256，CRF 21。除2160p使用slow外，所有档位都使用veryfast预设。',
        '每个档位的编码命令为ffmpeg -i input -map 0:v:0 -vf scale=-2:H -r FPS -c:v libx264 -profile:v high -level 4.1 -preset P -crf N -sc_threshold 0 -g GOP -keyint_min GOP -b:v B -maxrate 1.2B -bufsize 2B -force_key_frames expr:gte(t,n_forced*2) -map 0:a:0? -c:a aac -b:a A -ac 2 -ar 48000 -hls_time 2 -hls_playlist_type vod -hls_flags independent_segments。GOP为帧率乘以2，因此每个档位中的分片都从关键帧开始。',
        '由于编码以CRF驱动并以-maxrate作为上限，每个档位的平均码率最多约等于其列出的码率（上限为其1.2倍），在简单内容上会更低。主播放列表将BANDWIDTH标为列出的视频码率加音频码率，CODECS标为avc1.640028，有音频时还会附加mp4a.40.2。',
        '默认情况下，访客可选择360p到720p，免费账号可选择360p到1080p，Premium或Pro可使用完整的144p到2160p档位；低于360p的源文件在Premium以下的套餐中会被拒绝。服务器会在开始时重新验证档位，因此客户端无法请求未向其提供的档位。',
        '字幕使用与转录工具相同的Whisper模型（whisper-ctranslate2，medium）；主字幕轨写入captions/<lang>/auto.vtt，并附带一个只含单个分片的subs.m3u8包装文件，在主播放列表中以EXT-X-MEDIA TYPE=SUBTITLES引用。从37种语言的列表中最多可选3种额外语言，由本地Ollama模型（translategemma 12b构建）逐段翻译；翻译失败会记录为警告，绝不会导致任务失败。',
        '故事板是一次ffmpeg处理：fps=1/N，N根据时长取5、10或15秒（短于10分钟、短于30分钟、更长），每张JPEG精灵图中以10 x 10网格排列填充为16:9的160 x 90图块，并附带含#xywh条目的storyboard.vtt。I帧播放列表只以240p重新编码关键帧（select=eq(pict_type,I)，libx264 CRF 30，4秒分片），并以EXT-X-I-FRAME-STREAM-INF列出。',
        '主播放列表包含EXT-X-VERSION:6、EXT-X-INDEPENDENT-SEGMENTS，以及三条EXT-X-SESSION-DATA条目，分别注明制作方、网站和版权所有者。report.json记录探测结果、各变体及其分片数量和字节大小、警告和时间戳。',
      ],
      whyItMatters: [
        'HLS是iOS、Safari和所有CDN的原生流媒体格式，借助hls.js，它在其他所有浏览器中也能播放。',
        '自适应档位让网络较差的观众能以360p继续观看，而不是在1080p下不停缓冲。',
        '预先分片的VOD包就是一组静态文件，因此可以托管在对象存储上，背后不需要任何转码服务器。',
      ],
      useCases: [
        {
          title: '课程平台',
          description: '从存储桶提供课程视频，支持自适应码率和多种语言的字幕。',
        },
        {
          title: '产品和营销页面',
          description: '无需第三方视频托管服务及其带品牌标识的播放器，即可流式播放演示视频。',
        },
        {
          title: '内部门户',
          description: '在你自己的CDN上托管培训视频，并带有拖动条缩略图。',
        },
        {
          title: '存档',
          description: '将过往的视频库转换为你可以掌控并镜像的可流式播放结构。',
        },
      ],
      workedExamples: [
        {
          title: '以三个默认档位处理一段3分钟的1080p片段',
          body: '输入：一段3分钟、1920 x 1080、30 fps、140 MB的MP4，带立体声音频，在访客上限之内。设置：360p、480p和720p（默认选择，也是访客最多能选的档位），不含字幕或故事板，tar.gz。每个档位被切成2秒的分片，每个档位90个，GOP为60帧，因此每个分片都从关键帧开始。按列出的码率计算，各档位的大小上限约为：360p 20 MB（800 + 96 kbps x 180 s）、480p 30 MB（1200 + 128 kbps）和720p 66 MB（2800 + 128 kbps），合计约116 MB，还不包括小小的240p I帧播放列表；由于编码以CRF驱动、码率仅作为上限，简单内容会更小。生成的包含有270个.ts分片、三个index.m3u8文件和主播放列表。耗时来自依次运行的三次libx264 veryfast编码，每次5400帧；720p档位耗时最长。',
        },
        {
          title: '带英文字幕、西班牙语翻译和故事板的12分钟720p网络研讨会',
          body: '输入：一段12分钟、1280 x 720、25 fps、380 MB的MP4，因为超出了访客默认的5分钟限制，所以使用免费账号上传。设置：360p和720p（由于源文件是720p，1080p显示为灰色），开启字幕并将西班牙语设为额外语言，开启故事板，zip。Whisper先转录这12分钟，写入captions/en/auto.vtt；西班牙语字幕轨以每批30个分段翻译，写入captions/es/auto.vtt，两者都在主播放列表中列为字幕版本。对于超过10分钟的源文件，故事板使用10秒间隔：72张160 x 90的缩略图正好放进一张1600 x 900的sprite_001.jpg中，并由storyboard.vtt指向每个图块。两个档位各有360个2秒分片，在25 fps下GOP为50帧，按列出的码率计算，大小上限约为81 MB（360p）和264 MB（720p）。任务的大部分时间花在Whisper和两次编码上；翻译只是一个简短的额外步骤。',
        },
      ],
      whenNotToUse: '如果你只是想要一个更小的单一文件用于发送或嵌入，不要转码为HLS；压缩器一遍就能完成，无需分片和播放列表。不要将它用于直播活动，因为输出是一个已完成的VOD播放列表，而不是直播源站。如果你的源文件低于360p，没有Premium就无法构建档位。如果你的播放器只是一个不支持HLS的普通video标签，你需要先准备MP4或hls.js类的播放器；单独的master.m3u8只能在Safari和Apple设备上原生播放。',
      whyMediaManipulator: [
        '每个档位的码率、CRF、预设和FFmpeg参数都列在本页上，因此包里有什么不会让你意外。',
        '字幕来自我们自己的Whisper转录器，翻译来自我们自己硬件上的模型，两者都在主播放列表中被正确引用。',
        '这个包就是普通文件，附带README和report.json；将其解压到任何静态主机上，再把播放器指向master.m3u8即可。',
        '一次转码消耗每日额度中的一次常规任务（默认访客每天5次，免费账号每天30次），并且每个会话每小时最多开始10次；失败的任务会退还额度。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。',
      ],
      privacyNote: '你上传的文件会从浏览器直接进入我们的存储桶，然后下载到我们自己的服务器上，在那里运行ffprobe、FFmpeg，如果你勾选了字幕，还会运行我们的Whisper转录器和本地Ollama翻译模型；不涉及任何第三方转码或AI服务。源对象、工作目录和完成的包都登记在保留期登记表中，并在保留期结束时删除，下载链接本身默认在30分钟后失效。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。转码不会运行标准转换所进行的自动内容分析。生成的主播放列表包含将Media Manipulator注明为制作方的会话数据行；它们不包含任何关于你的信息。',
      faq: [
        {
          question: '我的套餐可以选择哪些档位？',
          answer: '默认情况下，访客可选择360p、480p和720p；免费账号增加1080p；Premium和Pro还会解锁144p、240p和2160p。高于源文件的档位始终会被禁用，因为不会进行任何放大。将鼠标悬停在档位标签上即可看到原因。',
        },
        {
          question: '分片有多长？为什么是2秒？',
          answer: '每个档位都被切成2秒的MPEG-TS分片，并在每个边界强制插入关键帧，因此播放器可以在任何分片处切换档位而不会出现画面故障。I帧播放列表使用4秒分片，因为它只包含关键帧。',
        },
        {
          question: '字幕会链接到主播放列表中吗？',
          answer: '会。每种语言都写为captions/<lang>/auto.vtt并附带subs.m3u8包装文件，在master.m3u8中声明为subs组里的EXT-X-MEDIA TYPE=SUBTITLES，源语言标记为DEFAULT。你最多可以从37种语言的列表中添加3种翻译语言。',
        },
        {
          question: '如果我的视频没有音频怎么办？',
          answer: '各档位会用-an编码为纯视频，CODECS属性会省略mp4a.40.2，字幕步骤会被跳过，并在report.json中留下警告，因为没有可转录的内容。',
        },
        {
          question: '包里有什么？我该如何托管它？',
          answer: 'hls/master.m3u8、每个档位一个包含index.m3u8和分片的文件夹、hls/iframes/、可选的captions/和storyboards/、README.txt和report.json。将其解压到任何能以正确MIME类型提供.m3u8和.ts的静态主机或存储桶上，再把播放器指向master.m3u8即可。',
        },
        {
          question: '下载链接有效多久？可以选择tar.gz或zip吗？',
          answer: '预签名链接默认有效30分钟；如果已过期，请重新运行任务。开始之前，在表单中选择tar.gz（默认）或zip。',
        },
        {
          question: 'HLS转码需要多长时间？',
          answer: '每个选中的档位都是一次完整的libx264 veryfast编码，依次运行，因此耗时随时长乘以档位数量增长；在三个默认档位中，720p耗时最多。字幕会增加一次对整段音频的Whisper处理。任务页面会在每个阶段完成时显示出来。',
        },
      ],
      related: [
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '一个更小的MP4，而不是流媒体包。',
        },
        {
          label: '视频转录',
          to: '/tools/transcribe-video',
          description: '以独立的VTT或SRT文件获取同样的Whisper字幕。',
        },
        {
          label: '裁剪视频',
          to: '/tools/video-trimmer',
          description: '转码前先去掉开头和结尾的无用部分。',
        },
        {
          label: 'AI视频修复',
          to: '/tools/ai-video-restoration',
          description: '在用低分辨率片段构建档位之前，先将其放大。',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '剪辑视频并添加字幕，然后对导出的文件进行转码。',
        },
      ],
      embed: {
        title: '将视频转码为HLS',
        description: '上传MP4/MOV/WebM/MKV。我们会用ffprobe探测源文件，让你选择免费的质量档位（360p/480p/720p），然后用ffmpeg进行H.264 + AAC编码，并将HLS包打包为可下载的tar.gz。',
      },
    },
    'ai-video-restoration': {
      name: 'AI视频修复',
      h1: 'AI视频修复工具',
      tagline: '使用最多六种AI模型（Real-ESRGAN、SwinIR、HAT、BasicVSR++、RVRT和VRT）放大并修复短视频片段，并将所有结果并排对比。',
      metaTitle: 'AI视频修复工具：在线对比6种放大模型 | Media Manipulator',
      metaDescription: '免费AI视频修复工具。让短片段在我们自己的GPU上通过Real-ESRGAN、SwinIR、HAT、BasicVSR++、RVRT和VRT超分辨率模型处理，并将所有结果打包下载。',
      ogTitle: 'AI视频修复——对比Real-ESRGAN、SwinIR、HAT、BasicVSR++、RVRT和VRT',
      ogDescription: '从视频中挑选一段片段，选择修复模型，然后下载一个包含所有增强版本和原片的包，用于A/B对比。',
      intro: '各个视频修复模型之间的结论并不一致。Real-ESRGAN这样的GAN放大器能给出清晰的单帧画面，但在运动中可能闪烁；VRT这样的视频Transformer能保持序列稳定，却可能让细节变软。唯一诚实的选择方式，是把同一段素材交给所有模型处理，然后亲眼看看。本页正是这样做的：针对最长15秒的片段，它会提取帧，在我们自己的GPU上运行你从六个模型中选择的模型，将每个结果按源帧率并带上原始音频重新拼接为MP4，然后把所有内容（包括未经处理的片段）打包成一个压缩包，供你并排对比。下面的每个数字都来自当前实际运行的处理流程。',
      whatItDoes: [
        '以帧精度裁剪你选定的片段（0.5到15秒，按你的帧率最多450帧），并保留其音频。',
        '可运行Real-ESRGAN、SwinIR、HAT、BasicVSR++、RVRT和VRT的任意组合；前三个逐帧增强，后三个将整个序列作为整体修复。',
        '源视频为540p及以下时选择4x，高于此分辨率时选择2x，因为每个模型都运行其原生4x网络，2x结果是在拼接时用Lanczos缩小得到的。',
        '使用libx264以CRF 16、按精确的源帧率分数拼接每个结果，并重新附加音频。',
        '将original/clip.mp4、每个模型一个文件夹、逐帧模型可选的增强PNG帧、manifest.json和README.txt打包成一个tar.gz。',
        '某个模型失败时继续运行：它的文件夹中会有FAILED.txt，清单会记录原因，其他所有结果照常交付。',
      ],
      flowSteps: [
        {
          title: '上传视频',
          description: '最高1920 x 1080；较长的源视频也没问题，因为只处理所选片段。',
        },
        {
          title: '选择片段',
          description: '拖动手柄选取最长15秒；建议不超过10秒，超过时选择器会发出提醒。',
        },
        {
          title: '选择模型以及是否包含帧',
          description: '六个模型任选；选择器会根据服务器公布的每帧秒数，显示每个模型的预计用时。',
        },
        {
          title: '查看各阶段',
          description: '下载、探测、提取片段、提取帧，然后按从快到慢依次运行每个模型，最后打包。',
        },
        {
          title: '对比并下载',
          description: '在查看器中将每个模型的MP4与原片并排播放，然后在6小时链接有效期内获取压缩包。',
        },
      ],
      advancedDetails: [
        '参考片段使用ffmpeg -ss START -i source -t WINDOW -c:v libx264 -crf 10 -preset medium -pix_fmt yuv420p -c:a aac裁切，然后用-vsync 0将帧提取为编号的PNG；如果数量超过450，多余的帧会被丢弃。',
        'Real-ESRGAN运行realesrgan-ncnn-vulkan，使用realesrgan-x4plus模型、缩放倍数4和256 px分块。SwinIR使用003_realSR_BSRGAN SwinIR-L x4 GAN权重，HAT使用Real_HAT_GAN_SRx4，两者都通过分块推理（320 px分块、32 px重叠）运行，使1080p帧能放入显存。',
        'BasicVSR++通过mmagic以16帧为一个窗口运行REDS4 c64n7生成器；RVRT（001_RVRT_videosr_bi_REDS_30frames）和VRT（001_VRT_videosr_bi_REDS_6frames）通过各自的KAIR测试脚本运行，时间分块分别为30帧和12帧，空间分块为128 x 128。',
        '拼接方式统一：ffmpeg -framerate FPS_FRACTION -i frames/%06d.png [-i clip.mp4 -map 0:v -map 1:a -c:a aac] [-vf scale=iw/2:ih/2:flags=lanczos] -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -movflags +faststart -shortest。帧率分数（例如30000/1001）原样取自ffprobe，因此音频能保持同步。',
        '模型按固定顺序运行：Real-ESRGAN、BasicVSR++、SwinIR、RVRT、HAT、VRT，在GPU调度器租约下运行，显存预算分别为3、11、9、12、10和14 GB；整个服务器同一时间只运行一个修复任务，每个模型的超时时间为75分钟。',
        '选择器用你的帧数乘以的公布每帧估算值为：0.8秒（Real-ESRGAN）、1.0秒（BasicVSR++）、3.0秒（RVRT）、3.5秒（SwinIR）、5.0秒（HAT）和7.0秒（VRT）；它们是可能变化的服务器端默认值，而不是对你片段的实测。',
        '对于高于1080p的源视频，明确指定4x会被拒绝，因为输出会超过4K；自动模式对541p到1080p选择2x，对540p及以下选择4x。即使在2x路径上，包含的帧也是原生4x PNG，因此1080p源视频会得到7680 x 4320的帧。',
      ],
      whyItMatters: [
        '没有哪个修复模型能在所有素材上胜出，而静帧对比会掩盖只有播放时才会显现的闪烁。',
        '让一个10秒片段经过所有模型只需几分钟的GPU时间，就能告诉你哪个模型值得在别处进行全长处理。',
        '数字化的录像带、早期数码相机片段和压缩过的社交平台导出视频，各自的退化方式不同，适合的模型家族也不同。',
      ],
      useCases: [
        {
          title: '老家庭录像',
          description: '在修复整卷录像之前，先看看哪个模型能在480p录像带转录素材上还原人脸和衣料。',
        },
        {
          title: '档案素材',
          description: '在360p和480p素材上测试4x，并在你自己的显示器上评判4K级的输出。',
        },
        {
          title: '长时间渲染前的模型选择',
          description: '用一段有代表性的10秒测试，为长达数小时的任务挑选模型。',
        },
        {
          title: '压缩过的下载视频',
          description: '在块状失真的社交媒体导出视频上，对比GAN锐化与Transformer的稳定性。',
        },
        {
          title: '时间稳定性检查',
          description: '并排播放各模型的MP4，找出静帧会掩盖的闪烁和频闪。',
        },
      ],
      workedExamples: [
        {
          title: '一段8秒640 x 480家庭录像经过全部六个模型',
          body: '输入：一段来自数字化录像带、29.97 fps、带音频的640 x 480 MP4。设置：8秒片段、全部六个模型、包含增强帧、缩放为自动。处理流程裁切出8秒参考片段并提取240帧（8 x 29.97，取整）。在480p下，自动规则选择4x，因此每个模型都输出2560 x 1920的帧，拼接后的MP4为2560 x 1920、30000/1001 fps，并带有原始音频。选择器的估算是帧数乘以公布的每帧秒数：Real-ESRGAN约3.2分钟，BasicVSR++ 4分钟，RVRT 12分钟，SwinIR 14分钟，HAT 20分钟，VRT 28分钟，由于模型依次运行，总计约81分钟。包含帧会在压缩包中加入3 x 240张2560 x 1920的PNG，这就是下载大小以GB而不是MB计的原因。',
        },
        {
          title: '一段10秒1080p片段，自动缩放，使用Real-ESRGAN和BasicVSR++',
          body: '输入：一段90 MB、30 fps的1920 x 1080 MP4，这是本工具接受的最大源分辨率。设置：10秒片段、Real-ESRGAN和BasicVSR++、不含帧、缩放为自动。提取得到300帧，在450帧上限之内（若为60 fps，同样的上限会把片段限制在7.5秒）。高于540p时自动选择2x，因此每个模型仍运行其原生4x网络，生成7680 x 4320的帧，拼接时应用scale=iw/2:ih/2:flags=lanczos，以CRF 16输出3840 x 2160的MP4。按公布的估算值，Real-ESRGAN约4分钟（0.8秒 x 300），BasicVSR++约5分钟（1.0秒 x 300），因此任务远在每个模型75分钟的超时之前完成，压缩包内包含两个4K MP4、原始片段、manifest.json和README.txt。',
        },
      ],
      whenNotToUse: '不要用本页修复整部影片；它是一个对比工具，上限为15秒和450帧，即便如此，压缩包也可能达到数GB。不要指望它凭空创造从未记录下来的内容：严重的运动模糊、极端的压缩块状失真和非常暗的素材会有所改善，但不会变得完美无瑕。高于1920 x 1080的源视频会被拒绝，因为修复面向的是低分辨率素材，而1080p的2x已经是4K。如果你的片段只需要更小的文件、换个格式或剪一刀，压缩、转换和剪辑工具几秒钟就能完成，无需GPU。',
      whyMediaManipulator: [
        '一次上传即可使用六个研究级模型，权重、分块大小和拼接命令都写在本页上，而不是藏在品牌名称背后。',
        '一切都在我们自己的GPU上运行；你的素材绝不会发送给第三方AI服务商，也不会被用于训练。',
        '一次修复会消耗每日AI额度中的一次AI任务，默认情况下，没有账号时每天3次，使用免费账号每天10次，并且每个会话每小时最多启动2次；失败的任务会返还额度。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ],
      privacyNote: '你上传的文件从浏览器进入我们的存储桶，再下载到我们自己的GPU服务器，由FFmpeg在那里裁切片段，六个模型以本地进程运行；不涉及任何外部AI服务商，也不会用于训练。只有选定的片段会被解码为帧；源文件的其余部分从不处理。源对象、工作帧、为对比查看器保留的各模型MP4以及结果压缩包都会登记在保留台账中，并在保留期结束时删除，压缩包链接会在6小时后过期。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。修复任务不会运行标准转换所进行的自动内容分析。',
      faq: [
        {
          question: '哪个AI视频放大模型最好？',
          answer: '这取决于素材，这也正是本工具存在的原因。Real-ESRGAN和HAT这样的GAN放大器能生成清晰的帧，但在运动中可能闪烁；BasicVSR++、RVRT和VRT这样的序列模型利用相邻帧保持稳定，看起来可能偏软。用你自己的片段跑一遍，在播放中评判。',
        },
        {
          question: '为什么片段限制在15秒和450帧？',
          answer: '修复的单帧成本很高：仅VRT一个模型在4x下的公布估算值就是每帧7秒。帧数上限按你的实际帧率检查，因此60 fps的源视频会被限制在7.5秒。一段简短的片段就足以在别处进行更长的修复之前判断质量。',
        },
        {
          question: '2x和4x是如何选择的？',
          answer: '自动模式对540p及以下的源视频选择4x，高于此分辨率则选择2x。无论如何，每个模型都运行其原生4x网络；在2x路径上，拼接时会用Lanczos滤镜把帧缩小一半。高于1080p时明确指定4x会被拒绝，因为输出会超过4K。',
        },
        {
          question: '修复后的视频会保留我的音频和帧率吗？',
          answer: '会。片段连同音频一起裁切，每次拼接都使用来自ffprobe的精确帧率分数（例如30000/1001），并将音频重新以AAC附加，因此所有结果在A/B播放时都能对齐。',
        },
        {
          question: '结果压缩包里有什么，有多大？',
          answer: 'original/clip.mp4、每个模型一个文件夹，内含其MP4（对于包含帧的Real-ESRGAN、SwinIR和HAT，还有原生4x的每张增强PNG）、带用时和尺寸的manifest.json，以及README.txt。开启帧后，一段10秒的片段每个模型会增加数百张大尺寸PNG，因此预计会达到数GB。',
        },
        {
          question: '如果某个模型失败或超时会怎样？',
          answer: '任务会继续。该模型的文件夹中会有写明原因的FAILED.txt，manifest.json会记录下来，其他所有选定模型的结果仍会放入压缩包。只有所有选定模型都失败时，任务才会失败。',
        },
        {
          question: '一次修复需要多长时间？',
          answer: '帧数乘以每个模型的估算值，再对你选择的模型求和，因为它们依次运行：Real-ESRGAN、BasicVSR++、RVRT、SwinIR、HAT和VRT分别为每帧0.8、1.0、3.0、3.5、5.0和7.0秒。一段300帧的片段经过全部六个模型大约需要100分钟；只用Real-ESRGAN约需4分钟。',
        },
        {
          question: '我可以运行多少次修复，会消耗AI任务吗？',
          answer: '启动一次修复会消耗一次AI任务：默认情况下，没有账号每天3次，免费账号10次，Premium 100次，Pro 200次，此外每个会话每小时最多启动2次。彻底失败的任务会返还额度。实时数值请参见价格页面。',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '片段上限为15秒或450帧（以你视频帧率下较小者为准）；建议不超过10秒。',
          '源分辨率上限为1920×1080——修复面向低分辨率素材，而1080p的4x输出已达4K以上。',
        ],
        processingNotes: [
          '模型按从快到慢的顺序运行（Real-ESRGAN最先，VRT最后），因此能尽早得到部分结果。',
          '失败的模型绝不会拖垮整个任务——它的文件夹中有FAILED.txt，其他结果仍可下载。',
          '下载链接在6小时内有效；包含增强帧时，压缩包可能很大。',
        ],
      },
      related: [
        {
          label: '视频剪辑',
          to: '/tools/video-trimmer',
          description: '上传前剪出你想修复的片段。',
        },
        {
          label: 'AI图片修复',
          to: '/tools/ai-image-restoration',
          description: '针对单张照片或单帧的同类模型家族。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '缩小修复后的4K结果以便分享。',
        },
        {
          label: '转码为HLS',
          to: '/tools/transcode-to-hls',
          description: '将修复后的片段打包用于自适应流媒体。',
        },
        {
          label: '视频转录',
          to: '/tools/transcribe-video',
          description: '为修复后的素材添加字幕。',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '把修复后的片段剪辑进更长的作品中。',
        },
      ],
      embed: {
        title: 'AI视频修复',
        description: '上传视频，拖动选择一段短片段（10秒或更短效果最佳），选择想要对比的修复模型，然后下载包含所有增强结果的单个包。',
      },
    },
    'ai-image-restoration': {
      name: 'AI图片修复与放大',
      h1: 'AI图片修复与放大工具',
      tagline: '使用最多八种AI模型清理、放大并修复照片：保真预清理（FBCNN、SCUNet、NAFNet）、通用放大器（Real-ESRGAN、SwinIR、HAT）以及人脸增强（GFPGAN、CodeFormer），并将每个结果与原图对比。',
      metaTitle: 'AI图片修复与放大器：在线对比8种模型 | Media Manipulator',
      metaDescription: '免费AI照片修复与放大。去除JPEG伪影、降噪并去模糊，然后用Real-ESRGAN、SwinIR或HAT放大到4K/8K，再用GFPGAN/CodeFormer增强人脸，全部在我们自己的GPU上完成，并可并排对比。',
      ogTitle: 'AI图片修复与放大——预清理、放大并增强人脸',
      ogDescription: '上传一张图片，可选裁剪和预清理，然后运行多个放大和人脸模型，并将每个结果与原图内嵌对比。',
      intro: 'AI图片修复让一张照片经过最多八个模型组成的可配置处理流程，并将每个结果与原图并排展示。保真的预清理阶段（FBCNN处理JPEG伪影，SCUNet处理噪点，NAFNet处理运动模糊）会去除退化而不凭空创造细节；随后通用放大器（Real-ESRGAN、SwinIR、HAT）将图片放大2x或4x；可选的人脸增强（GFPGAN、CodeFormer）则会重建人脸。预清理是非生成式的：它过滤的是已有的信号。人脸增强是生成式的：它会合成看似合理的细节，不能被视为对原图的忠实还原。每个模型都在我们自己的GPU服务器上运行。',
      whatItDoes: [
        '可以拖动选择裁剪区域，把像素预算和GPU时间用在你关心的区域；裁剪在服务器端对自动校正方向后的原图进行，因此不会在浏览器中损失任何画质。',
        '可选择先进行预清理，始终按FBCNN、SCUNet、NAFNet的顺序，每个模型处理前一个模型的输出；清理后的图像会成为之后所有模型的起点。',
        '以2x或4x运行Real-ESRGAN、SwinIR和HAT的任意组合。三者都是原生x4网络；2x结果是用Lanczos滤镜将x4输出缩小到50%得到的。',
        '可选择运行GFPGAN v1.4，以及在服务器启用时带保真度权重的CodeFormer，作用于源图；开启“链式处理”时，还会作用于每个放大器的结果。',
        '将预处理后的原图、每张输出PNG、一个manifest.json和一个README打包成一个.tar.gz，并在压缩包由任务提供下载期间显示内嵌的对比网格。',
        '将失败的模型记录为失败条目，附带可安全展示给用户的原因，并仍会打包所有成功的结果。',
      ],
      flowSteps: [
        {
          title: '上传图片',
          description: 'PNG、JPEG、WebP、TIFF或BMP，每边最多12,000像素；主要面向老旧、尺寸小和过度压缩的照片。',
        },
        {
          title: '裁剪或保留整个画面',
          description: '拖选一个区域（一张脸、一块车牌、一个标志），或不裁剪以修复整张图。',
        },
        {
          title: '选择预清理、放大器、人脸和倍数',
          description: '勾选你想要的模型；选择器会显示当前选择将生成多少个输出（上限为12个）。',
        },
        {
          title: '查看各阶段',
          description: '任务排队等待唯一的修复名额，预处理图片，然后运行每个单元，各自显示进度和失败标记。',
        },
        {
          title: '对比并下载',
          description: '每个结果都在网格中与原图并排；确定哪条处理流程胜出后，下载压缩包。',
        },
      ],
      advancedDetails: [
        '预处理阶段运行ImageMagick -auto-orient生成规范化的PNG，读取其尺寸，拒绝任何超过12,000 x 12,000的图像，将规范化的裁剪矩形转换为整数像素，并写入working_source.png。该文件也会以original.png保存在结果中，因此你对比的正是模型接收到的图像。',
        '当裁剪区域高度不超过540像素时，自动缩放选择4x，否则选择2x。无论倍数如何，输出都会对照67,108,864像素（约64百万像素）的预算进行检查：6,000 x 4,000的整张图像在2x下为96百万像素，会被拒绝，并提示你选择2x或更小的裁剪区域。',
        'Real-ESRGAN通过realesrgan-ncnn-vulkan以256像素分块运行realesrgan-x4plus网络。SwinIR使用003_realSR_BSRGAN SwinIR-L x4 GAN权重，HAT使用Real_HAT_GAN_SRx4权重，两者都通过与AI视频修复相同的逐帧脚本运行，采用320像素分块和32像素重叠，因此大尺寸裁剪也不会超出GPU显存。',
        '预清理权重为fbcnn_color.pth、scunet_color_real_psnr.pth（以PSNR训练的真实噪点模型，而非会凭空生成纹理的GAN变体）和NAFNet-GoPro-width64.pth（运动去模糊，而非失焦去模糊）。它们以512像素分块、32像素重叠运行，从不改变尺寸。FBCNN会盲估JPEG质量因子，除非你设置一个1到100之间的值；数值越低，表示假设压缩越严重。',
        'GFPGAN使用干净的v1.4架构并禁用背景上采样，因此人脸以外的部分只是按缩放倍数简单调整大小，而不经模型增强；这让对比保持诚实。CodeFormer接受0到1之间的保真度权重w（默认0.7）：越低越好看，越高越贴近输入。CodeFormer采用非商业许可证发布，受一个默认关闭的服务器开关控制。',
        '“链式处理”除了在源图上运行外，还会在每个放大器的输出上以1x重新运行每个人脸模型，因此输出数量 = 预清理 + 通用 + 人脸 + 人脸 x 通用。服务器将每个任务限制为12个输出，同一时间只运行一个修复任务，并给每个模型1,800秒时间，超时则标记为超时。',
        '服务器根据自己的每百万像素秒数默认值估算每个模型的运行时间：FBCNN 3、SCUNet 8、NAFNet 6、Real-ESRGAN 2、SwinIR 12、HAT 18、GFPGAN 6、CodeFormer 8。这些值用于进度权重和界面估算；它们是调优值，而非保证。',
        '结果不会上传到对象存储：.tar.gz和结果PNG保留在任务的输出文件夹中，在保留期内由任务提供。',
      ],
      whyItMatters: [
        '没有哪个模型能在每张照片上都胜出：去伪影、降噪、放大和人脸重建各自修复不同的损伤，正确的顺序取决于图像是如何退化的。',
        '在一次上传上运行多个模型并并排查看，能在你投入更大批量之前回答“用哪个模型、用什么倍数？”这个问题。',
        '非生成式与生成式的区别很重要：预清理后的图像是对证据的过滤副本，人脸增强后的图像是看似合理的重建，页面会标明哪个是哪个。',
      ],
      useCases: [
        {
          title: '修复老照片或扫描照片',
          description: '先预清理扫描仪噪点和压缩痕迹，然后放大，如果你愿意，再重建人脸。',
        },
        {
          title: '增强低分辨率静态图像',
          description: '裁剪到感兴趣的区域，去除伪影并放大；可链式添加人脸增强以提升清晰度，但绝不能作为身份识别证据。',
        },
        {
          title: '修复压缩过的下载图片',
          description: '经过大量重复压缩的社交平台导出图片，先用FBCNN再用SCUNet处理，然后接一个GAN放大器，效果很好。',
        },
        {
          title: '批量处理前对比放大器',
          description: '让一张有代表性的图像经过Real-ESRGAN、SwinIR和HAT，为更大的图集选定模型。',
        },
        {
          title: '把预算花在一个区域上',
          description: '只拖选一张脸或一个标志，让64百万像素的预算和GPU时间用在关键之处。',
        },
      ],
      workedExamples: [
        {
          title: '一张1,200 x 800的JPEG（约350 KB），整个画面，自动缩放，FBCNN + Real-ESRGAN + GFPGAN',
          body: '裁剪区域是完整的0.96百万像素画面，其高度800像素超过540，因此自动缩放确定为2x。FBCNN首先以1x运行，其输出成为工作源图。Real-ESRGAN使用realesrgan-x4plus将其放大到4,800 x 3,200，然后ImageMagick用Lanczos将其缩小到50%，得到2,400 x 1,600的PNG。GFPGAN以放大倍数2在预清理后的源图上运行，又得到一张2,400 x 1,600的PNG，其中人脸经过重建，其余部分只是简单调整大小。这就是12个允许输出中的三个。按服务器自己的每百万像素估算，模型用时约为0.96 x (3 + 2 + 6)，大约11秒，外加几秒的预处理和打包；等待唯一的修复名额可能还会增加时间。一个任务消耗一次AI任务。',
        },
        {
          title: '从640 x 480静帧中裁出的300 x 400人脸，预清理，三个放大器，带链式处理的GFPGAN',
          body: '裁剪区域为0.12百万像素、高400像素，因此自动缩放选择4x，每个放大结果都是1,200 x 1,600（1.92百万像素），远在64百万像素预算之内。使用FBCNN和SCUNet预清理，Real-ESRGAN、SwinIR和HAT放大，并链式运行GFPGAN，该任务生成2 + 3 + 1 + 1 x 3 = 9个输出：两个预清理步骤、三个放大结果、在清理后源图上运行的GFPGAN，以及在每个放大结果上以1x运行的GFPGAN。按服务器的估算，在0.12百万像素上进行的预清理和放大每一步都只需几秒，而三次链式人脸处理在1.92百万像素的结果上运行，用时会按比例更长。每个人脸输出都在清单中附带生成式说明，因为你在这些人脸中看到的是重建，而非还原。',
        },
      ],
      whenNotToUse: '不要将人脸增强用于身份识别：GFPGAN和CodeFormer根据学到的先验绘制看似合理的人脸，因此重建后的人脸至多只是一条线索，绝不能证明照片中是谁。对于已经很大且清晰的图像，不必使用本工具，此时2x处理大多只会增加GAN纹理；任何一边超过12,000像素的照片也会被拒绝。如果你只需要一张干净图像的放大副本，而不需要预清理、人脸模型或对比网格，AI图片放大器更省时间。此外，如果你的损伤是失焦模糊而不是运动模糊，NAFNet的GoPro权重就不是合适的模型。',
      whyMediaManipulator: [
        '一次上传即可使用八个研究级模型，无需管理notebook、CUDA配置或权重文件。',
        '每个模型都在我们运营的GPU服务器上运行；图片不会发送给第三方AI服务。',
        '页面让这种区别保持诚实：预清理输出附带保真说明，人脸输出附带生成式说明，预处理后的原图始终在网格中。',
      ],
      privacyNote: '你的图片保存在其任务文件夹中，由ImageMagick自动校正方向并裁剪为工作PNG，然后在我们自己的GPU上由所选模型处理。任务结束时，上传文件夹和工作目录会被删除；随任务保留的是预处理后的原图、每张结果PNG、清单和打包的.tar.gz，由任务提供下载并用于对比网格。人脸模型的输出在该清单中被标注为生成式重建。没有任何第三方AI服务商会收到图片。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: '预清理与放大或人脸模型有什么区别？',
          answer: '预清理模型（FBCNN、SCUNet、NAFNet）是非生成式的：它们以1x过滤现有信号，去除压缩伪影、噪点和运动模糊。放大器增加分辨率，而人脸模型（GFPGAN、CodeFormer）是生成式的，会合成看似合理的面部细节。预清理输出是忠实的过滤图像；人脸输出则是重建。',
        },
        {
          question: '增强后的人脸可以作为身份识别证据吗？',
          answer: '不可以。GFPGAN和CodeFormer根据学到的先验生成看似合理的人脸；它们并不能还原真实的面孔。正因如此，清单会为每个人脸输出标注生成式说明。仅将其用于提升视觉清晰度和作为线索。',
        },
        {
          question: '为什么无论我勾选什么，预清理模型都按固定顺序运行？',
          answer: '压缩伪影必须在降噪之前去除，否则降噪器会把块状失真当作信号；而去模糊在最干净的输入上效果最好，因此服务器始终先运行FBCNN，再运行SCUNet，然后是NAFNet，每个模型都处理前一个的结果。如果其中一个失败，下一个会从最后一个成功的步骤继续。',
        },
        {
          question: '自动模式如何在2x和4x之间选择，尺寸限制是多少？',
          answer: '当裁剪区域高度不超过540像素时，自动选择4x，否则选择2x。然后输出会对照约64百万像素（67,108,864像素）的预算进行检查；超出的请求会被拒绝，并显示百万像素数，建议你选择2x或更小的裁剪区域。在此之前，任何一边超过12,000像素的源图就会被拒绝。',
        },
        {
          question: '链式处理会如何影响输出数量？',
          answer: '开启链式处理后，每个人脸模型还会在每个放大器的结果上以1x运行，因此输出数 = 预清理 + 通用 + 人脸 + 人脸 x 通用。两个放大器和两个人脸模型加上链式处理，在不计预清理的情况下为2 + 2 + 4 = 8个输出；服务器每个任务允许12个。',
        },
        {
          question: '如果某个图像模型失败或超时会怎样？',
          answer: '任务会继续进行。该单元会被标记为失败，并附带可安全展示给用户的原因（例如1,800秒后超时，建议使用更小的裁剪区域或2x），清单会记录下来，其他所有结果仍会打包并显示。只有所有选定模型都失败时任务才会失败，此时会返还这次AI任务的额度。',
        },
        {
          question: '为什么CodeFormer是灰色的？',
          answer: 'CodeFormer仅许可用于非商业用途，因此受一个默认关闭的服务器开关控制；此时功能列表会显示它当前已禁用。GFPGAN和三个预清理模型采用宽松许可证，只要安装了权重就可以使用。',
        },
        {
          question: '我可以运行多少次修复，免费吗？',
          answer: '启动一次修复会消耗一次AI任务：默认情况下，访客每天3次，免费账号10次，Premium 100次，Pro 200次，无论你在该任务中勾选多少个模型。此外还有每个会话每小时6次启动的专门限制。上传上限为访客200 MB，免费账号1 GB；/pricing显示当前数值。',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '输出受像素预算（约64百万像素）限制，远超8K——如果裁剪区域和倍数会超出预算，请选择2x或更小的裁剪区域。',
          '预清理模型从不改变尺寸（1x）；只有通用放大器会改变分辨率。',
        ],
        processingNotes: [
          '预清理始终按固定顺序最先运行（FBCNN → SCUNet → NAFNet）；清理后的图像会成为其他所有模型的基础。',
          '失败的模型绝不会拖垮整个任务——它的条目会显示原因，其他结果仍可下载。',
          '人脸增强是生成式重建——用于提升清晰度和作为线索，而不是身份识别证据。',
        ],
      },
      related: [
        {
          label: 'AI视频修复',
          to: '/tools/ai-video-restoration',
          description: '面向动态影像的姊妹工具：在短片段上使用同样的放大器。',
        },
        {
          label: 'AI图片放大器',
          to: '/tools/ai-image-upscaler',
          description: '只需要更大的图片时，进行一次Real-ESRGAN处理即可。',
        },
        {
          label: '移除背景',
          to: '/tools/remove-background-from-image',
          description: '修复后抠出主体。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '缩小修复后的PNG以便分享。',
        },
        {
          label: '图片尺寸调整',
          to: '/tools/image-resizer',
          description: '将修复后的图片调整为精确尺寸。',
        },
        {
          label: '移除EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '发布前去除结果中的元数据。',
        },
      ],
      embed: {
        title: 'AI图片修复与放大',
        description: '上传图片，可选择裁剪到某个区域、进行预清理，挑选想要对比的放大和人脸增强模型，然后下载包含所有结果的单个包。',
      },
    },
    'ai-document-scan': {
      name: 'AI文档扫描',
      h1: 'AI文档扫描——将扫描页面和手写内容转为可搜索的PDF/Word',
      tagline: '将扫描文档和手写笔记变成可搜索的多页PDF和可编辑的Word文档：印刷页面会获得忠实的Tesseract文字层，手写内容由视觉AI转录，并标出不确定之处，绝不凭空编造。',
      metaTitle: 'AI文档扫描：将扫描页面和手写内容转为PDF/Word | Media Manipulator',
      metaDescription: '免费AI文档扫描：将扫描图片转换为可搜索的PDF和图片转Word OCR，并将手写笔记转录为文字。可调整页面顺序，印刷体与手写混合也没问题，全部在我们自己的GPU上完成，忠实原文并标出不确定之处。',
      ogTitle: 'AI文档扫描——从扫描件和手写内容生成可搜索的PDF + Word',
      ogDescription: '上传一张或多张扫描页面（印刷或手写），重新排序，即可获得可搜索的PDF和可编辑的DOCX。印刷页面保持忠实；手写内容逐字转录，并保留[illegible]/[?]标记。',
      intro: 'AI文档扫描会把一张或多张拍摄或扫描的页面变成可搜索的多页PDF，如果你需要，还会生成可编辑的Word文档。它对两类页面区别处理，并告诉你哪页属于哪类。印刷或打字的页面经过OCRmyPDF和Tesseract处理：输出页面就是你的扫描件，原封不动，下方有一层不可见的文字层，便于搜索、选择和复制。手写页面由在我们自己的GPU上运行的视觉语言模型读取，它会逐字转录手写内容，把无法辨认的部分标记为[illegible]（无法辨认），把存疑的词包裹为[?: best guess]（最佳猜测），并被要求绝不补全、更正或整理任何内容。一个任务可以逐页混合这两类页面，按你设定的顺序排列，结果会注明每一页使用的引擎和置信度。',
      whatItDoes: [
        '每个任务最多接受50张页面图像（PNG、JPEG、WebP、TIFF、BMP或HEIC，默认每张25 MB），将每张规范化为方向正确的PNG，并让你先把它们拖成阅读顺序。',
        '在自动模式下，对每页向视觉模型提一个问题（印刷还是手写？）并据此分流；“印刷”和“手写”模式则强制指定答案。',
        '生成PDF/A，其中每个印刷页面都是原始扫描件加上Tesseract文字层，每个手写页面都是扫描件加上逐行放置的不可见机器转录层，并带有说明这一点的可见页脚。',
        '可选择生成Word文档：印刷页面由PaddleOCR-VL（或Docling）重建为标题、列表和表格，手写页面则是逐字转录内容，置于加粗的“请对照扫描件核对”提示之下，由Pandoc渲染。',
        '逐页报告所用引擎、高/中/低置信度以及不确定标记的数量，让你知道该看哪里。',
        '当服务器启用相应引擎时，可以运行只重新读取被标记词元的校验流程、将分歧标记为[?: vlm | other]的独立第二意见，以及单独标注的AI摘要。',
      ],
      flowSteps: [
        {
          title: '添加页面',
          description: '每个文件放入一张页面图像，可以是印刷、手写或两者混合，并拖动排序。',
        },
        {
          title: '选择模式和输出',
          description: '自动、印刷或手写；PDF始终生成，Word可选；印刷页面的Tesseract语言；印刷OCR的纠偏和自动旋转。',
        },
        {
          title: '预处理并读取',
          description: '页面会自动校正方向；手写页面会在模型读取前用Real-ESRGAN放大2x；印刷页面则在PDF步骤中等待Tesseract处理。',
        },
        {
          title: '生成文件',
          description: 'OCRmyPDF和reportlab生成逐页PDF，pikepdf将它们合并；Word文档由Pandoc从Markdown组装而成。',
        },
        {
          title: '检查并下载',
          description: '查看器会打开PDF；下载PDF、按需生成的Word文件，以及记录每页引擎和置信度的清单。',
        },
      ],
      advancedDetails: [
        '印刷页面：规范化的PNG先用img2pdf无损封装，然后OCRmyPDF使用你的语言代码运行Tesseract，在勾选时启用deskew和rotate_pages，并设置output_type pdfa和force_ocr，将文字层写在图像下方。如果OCRmyPDF在某页失败，会保留仅含图像的页面，因此PDF仍然完整。',
        '手写页面：模型为qwen3-vl（8B、instruct、q8_0量化），由Ollama以temperature 0.1提供服务，提示词要求逐字转录、保留换行、标记[illegible]和[?: guess]、注明(arrow)或(circled)之类的符号，并返回包含全文和每行一个边界框的JSON。',
        '手写PDF页面由reportlab按图像的像素尺寸绘制：扫描件是可见页面，每一行转录文本以文本渲染模式3（可搜索、从不绘制）放置在其边界框处，字体为Helvetica，字号按行高在6到48磅之间调整；若没有返回边界框，则以整页不可见文本块作为后备，并添加一行灰色8磅页脚，内容为“Machine transcription, verify against original”（机器转录，请对照原件核对）。',
        '置信度是计算出来的，而不是猜的：页面没有标记时为高，带标记的行少于15%时为中，其余为低。校验流程（默认开启）会把页面和草稿发回模型，指示它只解决被标记的词元，不更改其他任何内容；如果校验失败，则保留草稿。',
        '手写内容的预清理使用Vulkan GPU上的realesrgan-x4plus，倍数为2，在自动和手写模式下默认开启，在印刷模式下关闭；它是尽力而为的，失败时会保留原图。Word文档由Pandoc从GitHub风格的Markdown生成；可选的摘要使用单独的文本模型，写入单独的文件，并带有AI生成标签。',
        '默认情况下，服务器同一时间只运行一个文档任务，每次模型调用最长40分钟，任务一结束，上传文件和工作文件夹就会被删除；只有结果文件夹（PDF、DOCX、manifest.json、README.txt）会在保留期内保留。',
      ],
      whyItMatters: [
        '页面的照片在能被搜索和引用之前，还算不上文档。PDF在不改动像素的情况下添加了这一能力，因此扫描件仍是权威依据。',
        '自信地乱猜的手写识别比没有还糟。明确的[illegible]和[?: guess]标记、逐页置信度和可见的标签，让转录内容可以作为草稿使用，且绝不会被误认为原件。',
        '印刷页面和手写页面需要不同的引擎。在一个有序的任务中把每页交给合适的引擎，正是让一本含有印刷表格和手写答案的笔记本最终成为单个文件的关键。',
      ],
      useCases: [
        {
          title: '可搜索的文书',
          description: '扫描的合同、收据和表格变成一个可搜索、可复制的PDF/A，页面图像保持原样。',
        },
        {
          title: '野外和实验室笔记本',
          description: '手写笔记变成可搜索的PDF和Word草稿，每个不确定的词都已标出供你核对。',
        },
        {
          title: '图片转Word',
          description: '用手机拍摄的印刷页面变成可编辑的.docx，标题、列表和表格都会被重建。',
        },
        {
          title: '混合文档',
          description: '带手写答案的印刷问卷会经过两种引擎处理，返回一个有序的单一文件。',
        },
        {
          title: '档案',
          description: '老旧的打字信件和会议记录获得用于索引的文字层，而扫描件保持原样。',
        },
      ],
      workedExamples: [
        {
          title: '三张300 dpi的印刷A4页面',
          body: '三张2480 x 3508的JPEG扫描件，印刷模式，仅PDF，语言eng，开启纠偏和自动旋转。不涉及任何模型：每页先由img2pdf封装，然后OCRmyPDF运行Tesseract并写入不可见的文字层，输出PDF/A，pikepdf再将三页合并为document.pdf。文字层每页只增加几KB，因此PDF的大小与三张页面图像大致相当（经过拉直的页面会重新渲染，未改动的页面则原样嵌入）。该任务消耗一次AI任务（失败则返还），用时为Tesseract在CPU上逐页处理的时间，加上排队等待的时间，因为默认同一时间只运行一个文档任务。',
        },
        {
          title: '两张手机拍摄的手写页面，含Word',
          body: '两张4032 x 3024的手机照片，内容为笔记本页面，使用自动模式，输出PDF和DOCX。预处理会把两张都自动校正方向为PNG，并且由于模式不是印刷，会用realesrgan-x4plus放大2x到8064 x 6048。分类步骤对每页向qwen3-vl提一个问题，识别步骤返回带每行边界框的转录内容，校验步骤只重新读取被标记的词元。如果一页有30行，其中2行带有[?: ...]标记，2 / 30低于15%，该页就会被标记为中等置信度，illegibleCount为2。PDF页面是处理后的图像，在这些边界框处放置不可见的Helvetica文本行，并带有页脚印记；Word文件在加粗的核对提示下包含逐字文本。用时为每页在我们GPU上依次进行的三次视觉模型处理；没有任何处理在别处运行。',
        },
      ],
      whenNotToUse: '如果你需要无需核对就具有权威性的文本，请不要使用本工具：手写输出是带有已标记缺漏的机器读取结果，Word文档和摘要都是重建，因此在引用之前请对照扫描件核对。它不是PDF到PDF的OCR工具：输入是页面图像，所以请先把现有PDF渲染为图像；它也不是翻译工具。如果你只需要把页面装订成没有文字层的PDF，普通的图片转PDF工具会把它作为日常任务而不是AI任务来完成，从而把访客每天三次的AI任务额度留给需要模型的工作。',
      whyMediaManipulator: [
        '印刷PDF从构造上就是忠实的：OCRmyPDF把文字放在原封不动的页面图像之下并输出PDF/A，没有任何内容被重新绘制。',
        '手写转录逐字且有据可查：提示词禁止编造，不确定之处在文本中标出，置信度根据这些标记统计，页面也会注明这是机器转录。',
        '每个引擎都是我们自己的：CPU上的Tesseract，通过Ollama运行的qwen3-vl和文本模型，以及我们GPU上的PaddleOCR-VL和Real-ESRGAN。没有任何页面会发送给第三方AI服务。',
      ],
      privacyNote: '你的页面图像保存在uploads/<jobId>/src/，规范化副本保存在工作文件夹中；手写页面会发送给在我们自己的GPU上由Ollama提供服务的qwen3-vl模型，印刷页面由CPU上的Tesseract读取，任务运行期间，逐页转录草稿以JSON形式保存在该工作文件夹中。任务结束时，上传文件和工作文件夹都会立即删除；剩下的是outputs/<jobId>/中的结果文件夹，内含PDF、按需生成的Word文件、清单（逐页引擎、置信度和标记数量）以及README，该文件夹会在保留期结束时删除。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。转录的文本存在于你下载的PDF文字层和DOCX中。不会向任何第三方AI服务商发送任何内容，也不会将任何内容用于训练。',
      faq: [
        {
          question: 'PDF和Word文档有什么区别？',
          answer: 'PDF是带可搜索文字层的扫描件：印刷页面下方是Tesseract文字层，手写页面下方是不可见的机器转录，两种情况下可见页面都是原始图像。Word文档则是单独的重建：印刷页面是由PaddleOCR-VL或Docling生成的标题、列表和表格，手写页面是逐字转录内容，上方有加粗提示让你核对。请以PDF中的图像为准，把DOCX当作草稿。',
        },
        {
          question: '手写转录的可靠性如何？',
          answer: '它是一次细致的机器读取，而不是经过认证的转录稿。模型被要求准确照抄所写内容，把任何无法读取的部分标记为[illegible]，把任何存疑的词标记为[?: best guess]，并且绝不编造或更正。每页都会得到一个置信度（没有标记为高，被标记的行低于15%为中，高于则为低）和一个标记数量，PDF页面还带有可见的机器转录页脚。请对照扫描件阅读被标记的词。',
        },
        {
          question: '可以混合印刷页面和手写页面吗？',
          answer: '可以。在自动模式下，视觉模型会对每一页判断它主要是印刷还是手写，页面随之交给Tesseract或手写模型处理。清单会逐页记录判断结果，最终的PDF和Word文件会保持你开始前设定的顺序。',
        },
        {
          question: '印刷OCR支持哪些语言？',
          answer: '支持Tesseract语言代码，混合语言页面用加号连接（例如eng+fra）。服务器提供的代码列在表单中；默认安装英语，其他语言会随着添加而出现。手写内容由视觉模型读取，不使用这些代码。',
        },
        {
          question: '每个任务有哪些限制？',
          answer: '默认情况下，每个任务最多50张页面图像（每张图像为一页，因此实际上50也是页数上限），每张图像25 MB，每台服务器同一时间运行一个任务（其他任务排队等待），每个模型阶段最长40分钟。每个任务消耗一次AI任务：没有账号每天3次，免费账号10次，Premium 100次，Pro 200次，任务失败时返还额度。实时数值见价格页面。',
        },
        {
          question: '为什么我的手写PDF有页脚，可以去掉吗？',
          answer: '每个手写页面都带有一行灰色小字“Machine transcription, verify against original”（机器转录，请对照原件核对），Word部分也有对应的加粗提示，因为手写内容的可搜索副本可能被误认为已核实的版本。它们是有意设计的输出组成部分，无法关闭。印刷页面的文字层是确定性的Tesseract输出，不带此印记。',
        },
        {
          question: '我的页面会离开你们的服务器吗？',
          answer: '不会。Tesseract在CPU上运行，手写和分类模型通过Ollama在我们的GPU上运行，结构引擎和放大器在同一台机器的第二块GPU上运行。任务一完成，上传文件和工作文件就会被删除。',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '默认每个任务最多添加50张页面图像；每张页面图像都有单独的大小上限（约25 MB）。',
          '始终生成可搜索的PDF；可编辑的Word文档是可选的。',
        ],
        processingNotes: [
          '印刷页面使用确定性OCR（OCRmyPDF + Tesseract），生成忠实、可搜索的文字层。',
          '手写内容由视觉AI逐字转录，并保留[illegible]/[?]标记——这是机器转录，而非权威页面。',
          'Word文档和任何AI摘要都是重建——请对照原始扫描件核对。',
        ],
      },
      related: [
        {
          label: '图片转PDF',
          to: '/tools/image-to-pdf',
          description: '把页面图像装订成没有文字层的PDF，作为日常任务处理。',
        },
        {
          label: 'PDF转JPG',
          to: '/tools/pdf-to-jpg',
          description: '把现有PDF渲染为页面图像，再交给扫描处理。',
        },
        {
          label: 'AI图片修复',
          to: '/tools/ai-image-restoration',
          description: '在转录之前修复褪色或模糊的扫描件。',
        },
        {
          label: '移除EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '去除手机拍摄的文档照片中的位置和设备标签。',
        },
        {
          label: '遮盖图片中的文字',
          to: '/tools/redact-text-in-image',
          description: '分享扫描件之前，涂黑页面上的姓名或号码。',
        },
      ],
      embed: {
        title: 'AI文档扫描',
        description: '添加一张或多张扫描页面图像（印刷文档或手写笔记），按需重新排序，选择内容模式和输出，即可获得可搜索的PDF以及可选的Word文档。',
      },
    },
    'ai-image-upscaler': {
      name: 'AI图片放大器',
      h1: 'AI图片放大器：在线将照片放大2倍或4倍',
      tagline: '使用Real-ESRGAN模型放大较小或模糊的照片，它会重建细节，而不是简单地拉伸像素。',
      metaTitle: 'AI图片放大器：将照片放大2倍或4倍 | Media Manipulator',
      metaDescription: '用能还原边缘和纹理的AI将低分辨率照片放大2倍或4倍。运行在我们自己的GPU上，输出PNG。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: 'AI图片放大器：将照片放大2倍或4倍',
      ogDescription: '用Real-ESRGAN AI模型放大较小或模糊的照片，它会重建细节，而不是拉伸像素。',
      intro: '本页会打开图片转换器，锁定“AI超分辨率”，并将输出设为PNG。服务器在我们自有的GPU上运行realesrgan-ncnn-vulkan（Real-ESRGAN的Vulkan版本）：默认模型为realesrgan-x4plus，放大4倍；针对绘画和动画帧还提供realesrgan-x4plus-anime和realesr-animevideov3，并可选择2倍作为替代倍数。该网络不是在现有像素之间插值，而是预测边缘、皮肤、织物和树叶在更大尺寸下的样子，并把这些细节绘制出来。结果以无损PNG写出，因此不会在合成的细节之上再叠加新的压缩伪影。',
      whatItDoes: [
        '在我们的GPU上用Real-ESRGAN模型将图片的宽度和高度放大到2倍或4倍。',
        '可在表单中选择一个照片模型或两个动漫风格模型；默认预选4倍和照片模型。',
        '始终输出PNG；此操作中API会强制使用.png扩展名。',
        '在GPU上自动对图片分块处理，因此大尺寸输入不会耗尽显存。',
        '消耗每日AI额度中的一次AI任务，该额度单独计数；日常转换额度不受影响。',
      ],
      flowSteps: [
        {
          title: '上传较小或模糊的图片',
          description: 'JPG、PNG或WebP。输入越小，模型需要“创造”的内容就越多。',
        },
        {
          title: '选择4倍或2倍以及模型',
          description: 'realesrgan-x4plus用于照片，动漫模型用于线稿和卡通帧。',
        },
        {
          title: 'Real-ESRGAN在GPU上运行',
          description: 'realesrgan-ncnn-vulkan -i in -o out -n <model> -s <2|4> -t 0 -g <gpu> -f png',
        },
        {
          title: '下载PNG',
          description: 'converted.png，像素尺寸为原图的2倍或4倍。',
        },
      ],
      advancedDetails: [
        '调用的函数是ai_tools.go中的UpscaleImage。它启动realesrgan-ncnn-vulkan，用-n指定模型、-s指定倍数、-t 0表示自动分块大小、-g指定GPU索引，并使用-f png；Vulkan ICD通过环境变量固定，确保加载器始终能找到NVIDIA驱动。',
        '倍数只接受2和4，模型名也只接受realesrgan-x4plus、realesrgan-x4plus-anime和realesr-animevideov3这三个；其他任何值都会在任务开始前被拒绝。',
        '2倍是以一半的比例运行同一个x4网络。表单中附有说明：2倍在某些图片上可能看起来略有裁切或放大，这是在服务器上用一张640 x 360的照片观察到的；API刻意不通过先运行4倍再缩小的方式来掩盖这一点。',
        '由于AI路径绕过了ImageMagick和exiftool复制，表单中的质量、尺寸调整、滤镜和元数据设置在这里都不起作用，PNG也不包含原图的EXIF。',
        '像素数量随倍数的平方增长：4倍意味着像素数量变为16倍，2倍则为4倍。输出的未压缩RGB数据为宽 x 高 x 3字节，这决定了PNG大小的上限。',
        '除了你套餐的单文件大小限制外，服务器没有针对此操作设置专门的输入尺寸上限；非常大的输入只是会逐块处理，耗时更长。',
      ],
      whyItMatters: [
        '旧的数码照片、低分辨率下载图片和网页小图，常常需要以远大于拍摄时的尺寸打印或展示。',
        '普通插值只会让图片变大，而不会变清晰；超分辨率模型决定了图片是模糊还是可用。',
        '从无损PNG开始，你之后可以自由压缩或调整结果尺寸，而不会叠加伪影。',
      ],
      useCases: [
        {
          title: '打印老照片',
          description: '将早期相机拍摄的1百万像素照片放大到适合打印的尺寸。',
        },
        {
          title: '挽救小尺寸下载图片',
          description: '将400 px的产品图或参考图放大到可用的尺寸。',
        },
        {
          title: '动漫和插画',
          description: '用realesrgan-x4plus-anime放大线稿，边缘不会变得浑浊。',
        },
        {
          title: '游戏和视频帧',
          description: '对截取的动画帧使用realesr-animevideov3。',
        },
      ],
      workedExamples: [
        {
          title: '用realesrgan-x4plus将640 x 360的JPEG放大4倍',
          body: '输入：一张92 KB、640 x 360的风景JPEG缩略图。设置保持预设：4倍、照片模型、PNG输出。服务器运行realesrgan-ncnn-vulkan -n realesrgan-x4plus -s 4 -t 0 -f png，并写出2560 x 1440像素的converted.png，像素数是原来230,400像素的16倍。未压缩输出为2560 x 1440 x 3 = 11 MB的RGB数据，PNG会低于这个值，具体取决于其中天空和平涂色块的多少，因此92 KB的输入预计会得到几兆字节的输出。对于这个尺寸的输出，GPU处理自动选择的分块只需几秒钟；而PNG编码和下载数兆字节的文件会占据总耗时中相当可观的一部分。',
        },
        {
          title: '将1200 x 800的照片放大2倍',
          body: '输入：一张480 KB、1200 x 800的人物JPEG。选择2倍并保留照片模型。输出为2400 x 1600的PNG，3.84百万像素，是原来0.96百万像素的四倍。未压缩时为11.5 MB的RGB数据，PNG会是其中的一部分。由于2倍是以一半的比例运行x4网络，请检查边缘是否出现表单所警告的轻微裁切或放大；如果出现，请改用4倍运行，再用图片尺寸调整工具将4800 x 3200的结果缩小到2400 x 1600，这会多消耗一次操作。',
        },
      ],
      whenNotToUse: '不要放大本身已经很大且清晰的图片：一张12百万像素的照片放大4倍后会变成192百万像素的PNG，生成速度慢，未压缩时达数百兆字节，而且看不出任何改善。不要依赖它处理人脸、文字、徽标或任何必须完整保留原貌的内容，因为新增的细节是预测出来的，而不是还原出来的，小字可能会变成看似合理但实际错误的字母。严重的运动模糊和失焦无法通过提高分辨率来修复。如果你只需要从更大的原图得到特定的像素尺寸，普通的尺寸调整工具更快，成本也更低。',
      whyMediaManipulator: [
        '这里写明了真实的程序、模型和参数，让你知道它是带自动分块的Real-ESRGAN，而不是泛泛的“增强”。',
        '2倍的局限被如实说明而不是隐藏，并且操作已锁定，无需在菜单中翻找。',
        '运行在我们自有的硬件上；标准工具无需账号。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ],
      privacyNote: '你的图片存储在我们服务器上的uploads/<jobId>/下，由同一台机器GPU上的realesrgan-ncnn-vulkan程序直接读取；它生成的PNG会存放到outputs/<jobId>/converted.png。不涉及任何外部AI提供商，你的图片也不会被用于训练任何模型。与每次图片上传一样，我们服务器上的自动分析步骤会用本地视觉模型对文件运行一次，并将其摘要与任务一起存储。结果不包含原图的EXIF，因为AI操作会跳过元数据复制。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: 'AI图片放大器可以免费使用吗？',
          answer: '可以，在每日AI额度内免费。每次放大消耗一次AI任务：默认情况下，访客每天3次，免费账号每天10次，单文件上限分别为200 MB和1 GB；Premium和Pro分别为100次和200次。该额度与常规任务额度分开计算，因此你的转换不受影响。实时数值见/pricing。',
        },
        {
          question: '这和图片尺寸调整工具有什么不同？',
          answer: '尺寸调整工具运行ImageMagick，它会对现有像素进行插值，生成更大但更柔和的图片。本工具运行经过训练的Real-ESRGAN网络，在更大尺寸下合成边缘和纹理。这是推断出来的结果，而不是还原的数据。',
        },
        {
          question: '应该选择2倍还是4倍？',
          answer: '4倍是默认值，输出效果最稳定。2倍以一半的比例运行同一网络，在某些图片上可能看起来略有裁切，所以如果4倍超出了你的需要，可以考虑先放大4倍再缩小。',
        },
        {
          question: '哪个模型适合绘画作品？',
          answer: '插画和平涂风格作品用realesrgan-x4plus-anime；从动画中截取的帧用realesr-animevideov3。照片模型会添加类似皮肤的纹理，用在线稿上效果不对。',
        },
        {
          question: '为什么输出是PNG，而且这么大？',
          answer: '强制使用PNG，是为了让合成的细节不会立即被JPEG压缩破坏。4倍的结果有16倍的像素，因此文件很大；分享前可以再将其压缩为JPG或WebP。',
        },
        {
          question: '它能修复模糊或失焦的照片吗？',
          answer: '它可以改善因分辨率低而产生的柔和感。它无法消除运动模糊或失焦，还可能平滑或改变人脸和细小文字。使用前请将结果与原图进行对比。',
        },
        {
          question: '我的照片会被发送到第三方AI服务吗？',
          answer: '不会。Real-ESRGAN运行在我们自己运营的GPU服务器上，任务从不调用外部API。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '输出为PNG。大小限制和每日AI额度取决于你的套餐，会显示在表单中，而不是固定在本页上。',
        ],
      },
      related: [
        {
          label: 'AI图片修复',
          to: '/tools/ai-image-restoration',
          description: '在放大之前或之后清除压缩伪影和噪点。',
        },
        {
          label: '图片尺寸调整',
          to: '/tools/image-resizer',
          description: '将4倍的结果缩小到你需要的精确尺寸。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '将大尺寸PNG变成便于分享的JPG或WebP。',
        },
        {
          label: '移除图片背景',
          to: '/tools/remove-background-from-image',
          description: '将放大后的主体抠出到透明背景上。',
        },
        {
          label: 'AI视频修复',
          to: '/tools/ai-video-restoration',
          description: '适用于视频帧的同类工具。',
        },
      ],
      embed: {
        title: '用AI放大图片',
        description: '上传照片。已预选并锁定“AI超分辨率”，输出设为PNG。选择2倍或4倍以及模型（照片或动漫），然后转换。',
      },
    },
    'blur-faces-in-photo': {
      name: '模糊照片中的人脸',
      h1: '在线模糊照片中的人脸',
      tagline: '自动检测人脸，然后对全部人脸或你选择的人脸进行模糊、马赛克或涂黑。',
      metaTitle: '在线模糊照片中的人脸 | Media Manipulator',
      metaDescription: '对照片中的人脸进行模糊、马赛克或涂黑。检测每一张人脸，再选择要隐藏的人脸。AI运行在我们自己的GPU上。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线模糊照片中的人脸',
      ogDescription: '自动找出照片中的人脸，对全部人脸或仅你选择的人脸进行模糊、像素化或涂黑。',
      intro: '发布人群、课堂或街拍照片时，通常需要隐藏那些从未同意出镜的人。本页面在我们自己的服务器上使用OpenCV中运行的YuNet检测器查找人脸，并用高斯模糊、像素马赛克或纯黑矩形遮盖每一张人脸。你可以一步遮盖所有检测到的人脸，也可以先运行检测，查看照片上绘制的人脸框，然后只选择要隐藏的人脸，或只选择要保留的人脸。下文说明了检测器、其置信度阈值以及每种效果的确切大小，让你清楚输出能保护什么、不能保护什么。',
      whatItDoes: [
        '使用OpenCV FaceDetectorYN和YuNet 2023模型以0.85的置信度阈值检测人脸，然后将每个人脸框的四边各向外扩展18%，让头发和下颌线也被覆盖。',
        '用以下方式隐藏每张选中的人脸：卷积核为人脸框尺寸三分之一的高斯模糊、横跨人脸框14个色块的马赛克，或黑色填充。',
        '提供三种选择模式：所有检测到的人脸、仅你勾选的人脸，或除你勾选之外的所有人脸。',
        '将检测结果存储在一个与文件SHA-256绑定的30分钟会话中，因此实际应用的人脸框与你看到的完全一致。',
        '写出一张像素尺寸相同的新JPG、PNG或WebP；原始上传文件不会被修改。',
      ],
      flowSteps: [
        {
          title: '上传照片',
          description: 'JPG、PNG或WebP。本页面已预选并锁定“人脸模糊/像素化”。',
        },
        {
          title: '选择模糊、像素化或黑色遮挡',
          description: '默认预设为模糊；黑色遮挡会彻底移除像素。',
        },
        {
          title: '可选：检测并选择',
          description: '点击“检测人脸”查看带编号的人脸框，然后勾选要隐藏或要保留的人脸。',
        },
        {
          title: '运行任务',
          description: '服务器在每个选中的人脸框内应用效果，并保存一张新图片。',
        },
        {
          title: '检查并下载',
          description: '发布之前，放大到原始尺寸，检查是否有遗漏的人脸。',
        },
      ],
      advancedDetails: [
        '检测会运行face_privacy.py，在完整图像分辨率下使用OpenCV FaceDetectorYN加载face_detection_yunet_2023mar.onnx，得分阈值为0.85，NMS阈值为0.3，候选框最多5000个。人脸框的每一边按其宽度和高度的0.18向外填充，并限制在图像范围内。',
        '模糊使用cv2.GaussianBlur，卷积核为奇数，大小为max(3, 人脸框最长边 / 3)像素，因此300 px的人脸会得到101 px的卷积核；人脸越大，模糊越强。像素化先以线性过滤把人脸框缩小到横向14个色块，再用最近邻插值放大回去，形成明显的方形色块。黑色遮挡会把(0, 0, 0)写入该区域。',
        '如果你先进行检测，服务器会计算上传文件的SHA-256，把归一化后的人脸框存入一个30分钟后过期的会话；如果你之后提交的文件哈希不匹配，服务器会拒绝应用该会话，因此人脸框无法被移植到另一张图片上。',
        '如果没有检测会话，脚本会在运行时重新检测，并遮盖找到的每一张人脸；结果与运行“检测人脸”后将模式保持为全部完全相同。',
        '输出由OpenCV写入，而转换器的exiftool回写步骤不会对AI输出运行，因此结果不包含原始的任何EXIF、GPS或相机标签。但它仍不能替代EXIF工具，后者可以让你查看并选择要移除的内容。',
        '对大而清晰的人脸施加轻度模糊，可能会被反卷积工具部分还原；黑色遮挡是唯一能销毁信息的选项，粗马赛克则介于两者之间。',
      ],
      whyItMatters: [
        '他人的照片，尤其是儿童的照片，涉及同意问题，有时还涉及法律义务，这不是一句说明文字能解决的。',
        '手动编辑一张有20张人脸的照片既慢又不一致；检测能找出后排那些很小的人脸。',
        '先检测再选择，可以让你自己的同伴保持可见，同时将路人匿名化。',
      ],
      useCases: [
        {
          title: '活动与人群照片',
          description: '发布公共活动的照片之前，隐藏旁观者。',
        },
        {
          title: '学校与社团帖子',
          description: '遮盖家人未表示同意的特定儿童。',
        },
        {
          title: '新闻与报道',
          description: '保护纪实照片中的消息来源或参与者。',
        },
        {
          title: '视频通话截图',
          description: '将会议截图分享到团队之外之前，将同事匿名化。',
        },
      ],
      workedExamples: [
        {
          title: '一张4000 x 3000、有14张人脸的合影，全部模糊',
          body: '输入：一张手机拍摄的3.5 MB JPEG，4000 x 3000像素，画面中有14个人。设置：模糊，选择模式为全部，未预先检测。脚本在完整的12百万像素画面上运行YuNet；一张人脸框为300 x 360像素的人脸会向外填充18%，变为约408 x 490，并使用163 px的高斯卷积核（490 / 3，取整为奇数）进行模糊，使其变成一块毫无特征的色斑。后排一张60 px的人脸会得到27 px的卷积核，足以在该尺寸下抹去五官特征。输出是一张由OpenCV写入的4000 x 3000 JPG，大小通常与原图相差几百KB以内。检测和模糊只需几秒钟；上传这3.5 MB通常还要更久。',
        },
        {
          title: '一张1920 x 1080的视频通话截图，六张人脸中的两张做像素化',
          body: '输入：一张1.1 MB的PNG截图，1920 x 1080，显示六位参与者。设置：先检测人脸，选择模式为仅所选，勾选两张人脸，像素化。检测返回六个人脸框，并将其存入与文件哈希绑定的30分钟会话。提交时，服务器验证哈希，将两个所选人脸框的id传给脚本；每个所选人脸框在填充后约为140 x 180像素，被缩小到横向14个色块，因此每个色块约为10 x 13像素，然后以硬边方块写回。其他四张人脸保持不变。输出是一张1920 x 1080的PNG，由于无需重新检测，任务只需几秒钟。',
        },
      ],
      whenNotToUse: '如果漏掉一张人脸就不可接受，例如依法必须进行的遮盖，请不要依赖本工具；YuNet在0.85的阈值下会漏掉很小、背对镜头、戴口罩或处于深重阴影中的人脸，你必须亲自检查输出。如果某人必须保持无法辨认，不要对大尺寸人脸使用轻度模糊，请使用黑色遮挡。姓名牌、车牌和屏幕不是人脸，对于这些内容，文字遮盖工具或物体移除工具才是正确选择。另外，如果你的目标是把某个人从画面中完全移除，而不只是隐藏其面部，物体移除工具可以做到。',
      whyMediaManipulator: [
        '检测器、阈值、填充和卷积核的计算方式都写得清清楚楚，你可以判断每种样式能提供多少保护。',
        '检测框与文件哈希绑定并在30分钟后过期，因此你是在实际被处理的那张图片上进行选择。',
        '人脸模糊会从每日AI任务额度中消耗一次AI任务（默认情况下，无账号每天3次，免费账号每天10次），该额度与常规任务额度分开计算，而“检测人脸”预览完全不计入。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ],
      privacyNote: '人脸检测和模糊作为本地OpenCV进程在我们自己的硬件上运行；没有任何外部AI服务会收到你的照片，也不会有任何内容被用于训练。“检测人脸”预览会保存一份临时副本，计算其哈希、进行检测，并在响应之前删除该副本；只有人脸框坐标会被保留30分钟。上传的照片存放在uploads/<jobId>/，结果存放在outputs/<jobId>/，两者都登记在保留台账中，并在保留期结束时删除。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。作为一次标准图片上传，照片还会在同一台服务器上经过我们的自动内容分析，由本地视觉模型撰写一段简短描述，该描述随任务保存，不会与第三方共享。',
      faq: [
        {
          question: '检测器会漏掉哪些人脸？',
          answer: 'YuNet以0.85的置信度阈值运行，因此会跳过低置信度的候选：非常小的人脸、背对镜头的侧脸、被口罩或手遮住的人脸，以及处于深重阴影中的人脸。分享之前，请以原始尺寸检查结果。',
        },
        {
          question: '如何只模糊部分人脸？',
          answer: '点击“检测人脸”，勾选带编号的人脸框，并将选择模式设为“仅所选人脸”或“除所选人脸外的全部”。人脸框会按文件哈希保存30分钟，因此如果更换了图片，请重新检测。',
        },
        {
          question: '模糊有多强？能被还原吗？',
          answer: '高斯卷积核为人脸框尺寸的三分之一，因此300 px的人脸会得到101 px的卷积核。强模糊很难还原，但面对一张清晰的大尺寸人脸，执意破解的攻击者仍有机会；黑色遮挡会移除像素，无法还原。',
        },
        {
          question: '输出会保留照片的EXIF和GPS数据吗？',
          answer: '不会。结果由OpenCV全新写入，且AI输出会跳过元数据回写步骤，因此相机和位置标签不会被带过去。如果你想检查或有选择地清除标签，请使用EXIF工具。',
        },
        {
          question: '我的照片会被发送给外部AI公司吗？',
          answer: '不会。检测和效果处理在我们自己服务器上的本地OpenCV进程中运行，文件不会与第三方AI服务商共享。',
        },
        {
          question: '人脸模糊会占用我的每日AI任务额度吗？',
          answer: '会。每张模糊处理的照片计为一次AI任务：默认情况下访客每天3次，免费账号每天10次。它从不占用常规任务额度。“检测人脸”预览有频率限制，但不计入额度。失败的任务会返还额度。',
        },
        {
          question: '车牌、姓名牌或屏幕上的文字怎么办？',
          answer: '这些不是人脸，本页面不会检测。对于任何可读内容，请使用文字遮盖工具；要从图片中擦除车牌或标牌，请使用物体移除工具。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '每个任务会从你的每日AI任务额度中消耗一次AI任务；你所在套餐的单文件大小限制显示在表单中。',
        ],
      },
      related: [
        {
          label: '遮盖图片中的文字',
          to: '/tools/redact-text-in-image',
          description: '隐藏电子邮箱、电话号码和其他可读文字。',
        },
        {
          label: '移除照片中的物体',
          to: '/tools/remove-object-from-photo',
          description: '彻底擦除人物、车牌或标牌。',
        },
        {
          label: '移除EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '清除同一张照片中的GPS和相机数据。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '发布之前缩小匿名化后的照片。',
        },
        {
          label: '图片尺寸调整',
          to: '/tools/image-resizer',
          description: '将结果缩放到平台要求的尺寸。',
        },
      ],
      embed: {
        title: '模糊照片中的人脸',
        description: '上传照片。“人脸模糊/像素化”已选中并锁定。选择样式，也可以先检测人脸并选择要隐藏的人脸，然后转换。',
      },
    },
    'redact-text-in-image': {
      name: '遮盖图片中的文字',
      h1: '遮盖图片中的文字和个人数据',
      tagline: '在截图或照片中找出可读文字，并用模糊或黑色方框遮盖个人信息或全部文字。',
      metaTitle: '在线遮盖图片中的文字 | Media Manipulator',
      metaDescription: '自动找出图片中的文字，并将姓名、电子邮箱、号码等个人数据涂黑或模糊。AI运行在我们自己的GPU上。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '遮盖图片中的文字和个人数据',
      ogDescription: '找出截图和照片中的文字，用模糊或黑色方框遮盖个人数据或全部文字。',
      intro: '截图会泄露其主人早已视而不见的内容：页眉中的电子邮箱地址、表格中的账号、聊天气泡中的电话号码。本页面在我们自己的服务器上使用EasyOCR读取图片中的每一段文字，并用黑色矩形、模糊或像素马赛克遮盖匹配的内容。在默认模式下，它只遮盖符合个人数据模式的文字：电子邮箱地址、电话号码、类似社会保障号的号码、类似银行卡号的长串数字以及街道地址。在所有文本模式下，它会遮盖能读出的每一个词；当你无法预料页面上有什么内容时，这是更安全的选择。',
      whatItDoes: [
        '使用我们服务器的GPU，在整张图片上运行EasyOCR，找出文本框及其中的文字。',
        '在个人信息模式下，遮盖文字符合以下五种模式之一的文本框：电子邮箱、电话号码、3-2-4位数字标识符、13到19位类似卡号的数字串，或以Street、Avenue、Road、Drive、Lane、Boulevard、Way、Court、Circle或Place结尾的街道地址。',
        '在所有文本模式下，遮盖每一个识别出的文本框，无论内容如何。',
        '将每个文本框按其较长边的8%向外填充（至少3像素），然后用黑色填充、用尺寸三分之一的卷积核模糊，或像素化为12个色块。',
        '以相同尺寸写出一张新的JPG、PNG或WebP，并报告遮盖的数量。',
      ],
      flowSteps: [
        {
          title: '上传图片',
          description: '带可读文字的截图、扫描表格或照片，格式为JPG、PNG或WebP。',
        },
        {
          title: '选择仅个人信息或所有文本',
          description: '本页面已预选并锁定“涂抹文本/个人信息”；默认检测模式为“仅个人信息”。',
        },
        {
          title: '选择黑色遮挡、模糊或像素化',
          description: '黑色遮挡是默认选项，也是唯一不可逆的选项。',
        },
        {
          title: '运行OCR和遮盖',
          description: 'EasyOCR读取图片，每个匹配的文本框经填充后被遮盖，然后保存结果。',
        },
        {
          title: '仔细查看后下载',
          description: '检查是否有OCR未读出的文字，尤其是很小、旋转或手写的文字。',
        },
      ],
      advancedDetails: [
        '服务器运行redact_text_pii.py，参数为--detect pii或all-text、--redaction blackbox、blur或pixelate，以及--gpu。脚本为英语（目前唯一传入的语言）创建一个EasyOCR Reader，并对文件调用readtext，它会为每一行返回文本框、文字和置信度。',
        '个人信息模式是一组正则表达式：电子邮箱（本地部分、@、包含点且顶级域名至少2个字母的域名）；10位数字的北美电话号码，可带+1、括号、点、空格或短横线；由短横线或空格分隔的三位、两位和四位数字；13到19位数字，可由空格或短横线分隔（卡号）；以及门牌号后跟名称和街道类型词。没有针对人名、出生日期或非美国标识符的模式。',
        '每个匹配的文本框四边各扩大max(3, 0.08 x 宽高中较大者)像素，并限制在图像范围内。黑色遮挡使用cv2.rectangle绘制黑色实心矩形；像素化将区域缩小到横向12个色块，再用最近邻插值放大回去；模糊使用max(11, 最长边 / 3)的高斯卷积核，并取为奇数。',
        'OCR最擅长读取清晰的横排印刷文字。手写、装饰字体、很小的文字、严重倾斜和低对比度都会降低置信度，甚至可能被完全漏掉。所有文本模式无法弥补OCR根本没看到的行。',
        '输出由OpenCV写入，且AI输出会跳过转换器的exiftool回写，因此原始的EXIF、GPS和相机标签不会被带到结果中；本工具处理的是像素，而不是元数据。',
        '脚本完成时会输出redactions=N；结果为零表示OCR没有找到匹配的文字，而不代表图片是干净的。',
      ],
      whyItMatters: [
        '工单、错误报告和社交帖子经常附带含有真实客户或账户数据的截图。',
        '用绘图工具手动遮盖文字会漏行，结果也参差不齐；模式搜索能找到你已经视而不见的第三个电子邮箱。',
        '不透明矩形是唯一经得起锐化、对比度拉伸和放大的遮盖方式。',
      ],
      useCases: [
        {
          title: '错误报告与支持',
          description: '分享截图，而不暴露电子邮箱、电话号码或卡号。',
        },
        {
          title: '扫描表格',
          description: '转发页面之前，隐藏其中的标识符和地址。',
        },
        {
          title: '聊天截图',
          description: '发布对话之前，移除其中的电话号码和电子邮箱。',
        },
        {
          title: '培训材料',
          description: '把真实的屏幕截图变成所有文字都被遮盖的安全示例。',
        },
      ],
      workedExamples: [
        {
          title: '一张1440 x 900的工单截图，使用个人信息模式',
          body: '输入：一张400 KB的PNG，1440 x 900，显示一条客户记录，其中有两个电子邮箱地址、一个写作(555) 123-4567的电话号码和一个客户姓名。设置：仅个人信息，黑色遮挡。EasyOCR返回约40行文字；其中三行符合电子邮箱和电话模式，姓名不符合任何模式。三个文本框中，例如一个电子邮箱的文本框为260 x 22像素，四边各填充260的8%，约21像素，并以黑色填充，形成302 x 64的矩形。由于没有姓名模式，姓名仍然可见；如果姓名也必须遮盖，请切换到所有文本。输出是一张1440 x 900的PNG，任务只需几秒钟，大部分时间用于加载OCR模型和读取页面。',
        },
        {
          title: '一张3024 x 4032、手机拍摄的已填写表格照片，使用所有文本模式和模糊',
          body: '输入：一张2.1 MB的JPEG照片，拍摄的是一份印刷表格，3024 x 4032像素，略有倾斜。设置：所有文本，模糊。EasyOCR读出的每一行都会被遮盖：一个600 x 40像素的打字字段值四边各填充48像素，并用201 px的卷积核（600 / 3，取为奇数）模糊，在这个尺度下文字被完全抹去；一个120 x 30的标签只得到最小的11 px卷积核，在这个尺寸下字母形状仍可能被猜出，因此任何敏感内容都请选择黑色遮挡。OCR无法读取的手写内容保持原样，必须用肉眼检查。输出是一张3024 x 4032的JPG；对12百万像素的照片运行OCR是最慢的一步，比处理截图耗时更长。',
        },
      ],
      whenNotToUse: '对于必须完全遮盖的文档，不要把本工具当作唯一的保障；OCR只是尽力而为，目前只能读取英文印刷体，个人信息模式也完全不认识人名、出生日期或北美以外的标识符。不要对将要公开发布的文字使用模糊，因为文字模糊是最容易被还原的遮盖方式；请使用黑色遮挡。人脸、标志和照片不是文字，不会被处理；这些内容可交给人脸模糊工具和物体移除工具。另外，如果敏感数据位于文件元数据而不是像素中，EXIF工具才是正确的选择。',
      whyMediaManipulator: [
        '五种个人信息模式、填充和卷积核尺寸都明确写出，你可以确切知道哪些文字会被捕获，以及会如何被遮盖。',
        'OCR和遮盖在我们自己GPU上的本地进程中运行；满是客户数据的截图绝不会离开我们的硬件。',
        '文字遮盖会消耗一次AI任务（默认情况下，无账号每天3次，免费账号每天10次），计入AI任务额度而非常规任务额度，失败的任务会返还额度。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ],
      privacyNote: '文字识别和遮盖作为本地EasyOCR和OpenCV进程，在我们自己的GPU服务器上运行；没有任何外部OCR或AI服务会收到图片，识别出的文字仅用于决定遮盖哪些文本框，不会被存储。上传文件存放在uploads/<jobId>/，遮盖后的图片存放在outputs/<jobId>/，两者都登记在保留台账中，并在保留期结束时删除。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。与所有标准图片上传一样，文件还会在同一台服务器上经过我们的自动内容分析，由本地视觉模型撰写一段简短描述，该描述随任务保存，不会与第三方共享。',
      faq: [
        {
          question: '个人信息模式会检测哪些个人数据？',
          answer: '符合五种模式的文字：电子邮箱地址、北美电话号码、3-2-4位数字标识符、13到19位类似卡号的数字串，以及以Street、Avenue或Road等词结尾的街道地址。人名、日期和非美国标识符不会被匹配；这些内容请使用所有文本模式。',
        },
        {
          question: '什么时候应该用所有文本而不是仅个人信息？',
          answer: '只要你无法事先列出哪些内容是敏感的：表单、表格、带有人名的聊天记录。所有文本会遮盖OCR读出的每一行，因此唯一剩下的风险是OCR未能读出的文字。',
        },
        {
          question: '这个工具能读取英语以外的语言吗？',
          answer: '目前不能。OCR读取器只以英语启动，因此拉丁字母文字能被较好地读取，但其他文字可能被漏读或误读。页面不是英文时，请检查输出。',
        },
        {
          question: '在这里，黑色遮挡比模糊或像素化更安全吗？',
          answer: '是的。方框以纯黑填充，因此什么都不会留下。模糊使用文本框尺寸三分之一的卷积核，最小为11 px；像素化横向保留12个色块；两者都可能让短文字被猜出。任何要公开发布的内容，请选择黑色遮挡。',
        },
        {
          question: '遮盖会移除照片中隐藏的元数据吗？',
          answer: '结果由OpenCV全新写入，不会复制原始标签，因此EXIF和GPS数据不会被带过去。如果要对一个不做其他编辑的文件进行有意的、可检查的清除，请使用EXIF元数据工具。',
        },
        {
          question: '为什么有些文字仍然可见？',
          answer: '要么是OCR没有读出它（手写、极小字号、倾斜、低对比度），要么是在个人信息模式下它不符合任何模式。服务器会报告遮盖了多少个文本框；零表示没有匹配项，而不代表那里什么都没有。',
        },
        {
          question: '遮盖文字免费吗？什么会计入我的额度？',
          answer: '免费。它是一项AI任务，默认情况下无账号每天3次，免费账号每天10次，图片上限分别为200 MB和1 GB。它只占用AI任务额度，从不占用常规任务额度。价格页面提供实时数值。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '每个任务会从你的每日AI任务额度中消耗一次AI任务；你所在套餐的单文件大小限制显示在表单中。',
        ],
      },
      related: [
        {
          label: '模糊照片中的人脸',
          to: '/tools/blur-faces-in-photo',
          description: '隐藏同一张图片中的人物。',
        },
        {
          label: '移除EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '清除隐藏的位置和设备数据。',
        },
        {
          label: 'AI文档扫描',
          to: '/tools/ai-document-scan',
          description: '将拍摄的页面变成干净、可搜索的PDF。',
        },
        {
          label: '移除照片中的物体',
          to: '/tools/remove-object-from-photo',
          description: '擦除不属于文字的标志、车牌或徽章。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '附加之前缩小遮盖后的截图。',
        },
      ],
      embed: {
        title: '遮盖图片中的文字',
        description: '上传截图或照片。“涂抹文本/个人信息”已选中并锁定。选择遮盖个人数据还是所有文本，以及遮盖样式，然后转换。',
      },
    },
    'remove-object-from-photo': {
      name: '移除照片中的物体',
      h1: '在线移除照片中的物体',
      tagline: '在不想出现在画面中的物体周围画一个框，修复模型就会用匹配的背景填补空缺。',
      metaTitle: '在线移除照片中的物体 | Media Manipulator',
      metaDescription: '擦除照片中不需要的物体。画一个矩形，AI修复会按背景填补空白。运行在我们自己的GPU上。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线移除照片中的物体',
      ogDescription: '在不需要的物体上画一个框，AI修复会用匹配的背景填补空白。',
      intro: '上传照片，在想去掉的东西上拖出一个或多个矩形，然后转换。表单会以图片比例的形式发送每个矩形（左、上、宽度和高度，取值介于0和1之间），我们的API将它们转换为蒙版：一张与照片尺寸相同的灰度PNG，矩形内为白色，其余地方为黑色。随后，一个Python脚本打开图片和蒙版，在我们的GPU上运行simple_lama_inpainting包中的LaMa修复模型，利用周围的场景重新绘制白色区域。你会得到原始尺寸、所选格式的照片，标记的区域已被填补。',
      whatItDoes: [
        '接受在预览上绘制的一个或多个矩形，并移除其中的内容。',
        '根据归一化的矩形坐标在服务器上构建像素级精确的蒙版，因此蒙版不受你的屏幕尺寸影响。',
        '在我们运营的GPU上运行LaMa修复，用延续背景的内容填补蒙版区域。',
        '按表单中的选择，以JPG、PNG、WebP或GIF返回全分辨率图片。',
        '计为每日AI任务额度中的一次AI任务；普通转换使用另一项独立的额度。',
      ],
      flowSteps: [
        {
          title: '上传照片',
          description: 'JPG、PNG或WebP。预览会连同绘图层一起出现。',
        },
        {
          title: '绘制矩形',
          description: '每个物体一个框，略大于物体本身。至少需要一个框。',
        },
        {
          title: '生成蒙版并修复',
          description: '服务器写出一张尺寸相同的蒙版PNG，然后用图片和蒙版运行remove_object_lama.py。',
        },
        {
          title: '下载并检查',
          description: '使用图片之前，放大填补区域，检查接缝。',
        },
      ],
      advancedDetails: [
        '处理程序是ai_tools.go中的RemoveObject。它用ImageMagick identify读取图片尺寸，在服务器临时目录中把矩形栅格化为灰度PNG蒙版（内部白色、外部黑色，坐标取整到整数像素并限制在图像范围内），运行脚本，之后删除蒙版。',
        'remove_object_lama.py用Pillow打开图片并转换为RGB，以灰度加载蒙版，如果尺寸不同就把蒙版缩放到图片尺寸，调用SimpleLama(image, mask)，并将结果保存到输出路径。由于经过RGB转换，透明PNG输入会丢失Alpha通道。',
        '每个矩形都会在服务器端验证：宽度和高度必须为正，且方框在两个轴上都必须位于0到1之间，否则任务会在开始前被拒绝，该操作的额度也会返还。',
        'AI路径会跳过ImageMagick阶段，因此滤镜、色调、文字叠加、质量和尺寸调整设置都不适用，exiftool元数据复制也不会运行；结果不包含原图的任何EXIF。Pillow会以所选格式自身的默认编码器设置保存文件。',
        'LaMa根据上下文进行填补，因此填补质量取决于方框周围的内容。天空、草地、沙滩、水面、墙壁和地板能得到令人信服的结果；横穿人脸、文字或规则图案的方框，则会迫使模型凭空构造它无从知晓的结构。',
      ],
      whyItMatters: [
        '在有纹理的背景上用仿制图章修图需要练习和时间；画一个矩形只要两秒钟。',
        '一个误入画面的路人、一根电线或一块标牌，可能就是一张可用照片与重拍之间的唯一障碍。',
        '它还可以兼作隐私工具，处理不应出现在分享照片中的门牌号、车牌和屏幕。',
      ],
      useCases: [
        {
          title: '旅行与风景',
          description: '从原本干净的景色中移除游客、电线或垃圾桶。',
        },
        {
          title: '商品照片',
          description: '从商品图中擦除价签、支架或灰尘斑点。',
        },
        {
          title: '房地产',
          description: '清除画面边缘的汽车、垃圾桶或杂物。',
        },
        {
          title: '隐私',
          description: '抹掉门牌号、车牌或画面中可见的显示器。',
        },
      ],
      workedExamples: [
        {
          title: '在一张4000 x 3000的海滩照片上画一个矩形',
          body: '输入：一张5.2 MB、4000 x 3000的JPEG，水边有一个人。画一个从横向60%、纵向40%处开始，宽10%、高15%的方框，输出保持JPG。API将这些比例乘以图片尺寸，写出一张4000 x 3000的蒙版，其中(2400, 1200)处有一个400 x 450像素的白色块。LaMa在GPU上对图片和蒙版运行一次，脚本保存一张4000 x 3000的JPG，其中180,000个被遮罩的像素已根据周围的沙滩和海水填补。在GPU上，对12百万像素图片运行一次模型只需几秒钟；写出并下载一个数MB的JPG在总耗时中占比相当。',
        },
        {
          title: '在一张1920 x 1080的PNG商品照上画两个矩形',
          body: '输入：一张2.3 MB、1920 x 1080的PNG，画面是桌上的一盏台灯，带有一根电线和一张价格贴纸。画两个方框：一个盖住电线（约5% × 30%），一个盖住贴纸（约8% × 6%）。两者被栅格化到同一张1920 x 1080的蒙版中，因此一次修复即可处理两个区域。选择PNG作为输出，可避免填补区域出现JPEG伪影；结果是一张1920 x 1080的PNG，由于Pillow在修复前把输入转换为RGB，它是不透明的RGB图片。在2百万像素下，GPU处理很快，大部分实际耗时花在上传和写出PNG上。',
        },
      ],
      whenNotToUse: '如果物体占据画面的很大一部分、挡在人脸前面、与可读文字重叠，或打断了砖墙、瓷砖或键盘这类规则图案，请不要使用修复：模型不得不编造结构，结果会显得模糊或重复。如果你想让透明PNG保持不变，它也不是合适的工具，因为脚本会把输入压平为RGB；如果编辑必须在取证上保持真实，它同样不合适，因为填补区域是生成的内容。要替换整个背景，请使用背景移除工具；对于只需隐藏的人脸，人脸模糊工具更合适。',
      whyMediaManipulator: [
        '蒙版根据精确比例在服务器上构建，因此你在手机预览上画的内容，与在桌面上画的对应相同的像素。',
        '模型有明确名称（通过simple_lama_inpainting调用LaMa），格式和Alpha通道的行为都有文档说明，而不是让你去猜。',
        '运行在我们自己的GPU上；标准工具无需账号。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ],
      privacyNote: '你的照片存储在我们服务器的uploads/<jobId>/下；矩形蒙版作为临时PNG写入服务器临时目录，修复脚本一结束就会删除；填补后的图片存入outputs/<jobId>/。矩形坐标保存在任务选项中，以便对任务进行报告。LaMa运行在同一台机器的GPU上，图片的任何部分都不会发送给外部服务商。包括这次上传在内的每次图片上传，还会由我们服务器上的自动分析步骤使用本地视觉模型总结一次，该摘要随任务保存。由于AI操作会跳过元数据复制，输出不包含EXIF。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: '移除物体免费吗？',
          answer: '免费，在每日AI任务额度内即可。每次移除消耗一次AI任务：默认情况下访客每天3次，免费账号每天10次，单文件上限分别为200 MB和1 GB；Premium和Pro分别为每天100次和200次。你用于转换的常规任务额度是分开的，保持不变。现行数值见/pricing。',
        },
        {
          question: '矩形需要画得多精确？',
          answer: '不需要很精确。蒙版就是你画的矩形，取整到整数像素，因此请在物体及其阴影周围多留一点背景。模型会融合多出的边缘。',
        },
        {
          question: '可以一次移除多个物体吗？',
          answer: '可以。你画的每个矩形都会绘入同一张蒙版，所有区域在一次处理中全部填补。至少需要一个矩形，否则任务会被拒绝。',
        },
        {
          question: '为什么填补区域看起来模糊或重复？',
          answer: 'LaMa根据方框周围的像素进行填补。盖住精细细节或规则图案的方框会让它只能靠猜。可以试试更紧凑的方框、一次只移除一个物体，或选择物体背后背景更简单的照片。',
        },
        {
          question: '结果是什么格式？',
          answer: '就是你在表单中选择的格式：JPG、PNG、WebP或GIF。输入会在修复前转换为RGB，因此不会保留透明度。PNG可避免填补区域出现JPEG伪影。',
        },
        {
          question: '结果会保留我的EXIF数据吗？',
          answer: '不会。AI路径会跳过普通转换器执行的exiftool复制，且Pillow会写出一个全新的文件，因此不会带过去任何相机、日期或GPS标签。',
        },
        {
          question: '蒙版或我的照片会被发送到其他地方吗？',
          answer: '不会。蒙版是我们服务器上的临时文件，运行后即被删除，修复模型运行在我们自己的GPU上。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '每个任务会从你的每日AI任务额度中消耗一次AI任务；你所在套餐的单文件大小限制显示在表单中。',
        ],
      },
      related: [
        {
          label: '移除图片背景',
          to: '/tools/remove-background-from-image',
          description: '把主体整个抠出来，而不是修补某一块区域。',
        },
        {
          label: '模糊照片中的人脸',
          to: '/tools/blur-faces-in-photo',
          description: '隐藏人物，而不凭空生成背景。',
        },
        {
          label: '遮盖图片中的文字',
          to: '/tools/redact-text-in-image',
          description: '涂黑OCR能找到的文字，而不是对其进行修复。',
        },
        {
          label: 'AI图片修复',
          to: '/tools/ai-image-restoration',
          description: '清理修补处周围的噪点和压缩痕迹。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '缩小完成的照片以便分享。',
        },
      ],
      embed: {
        title: '移除照片中的物体',
        description: '上传照片。“移除物体”已选中并锁定。在想去掉的内容上画一个或多个矩形，然后转换。',
      },
    },
    'clean-voice-audio': {
      name: '人声音频降噪',
      h1: '用AI清理人声录音',
      tagline: '减少播客、访谈和语音备忘录中的嘶嘶声、房间底噪和低频隆隆声，让语音更清晰。',
      metaTitle: '用AI清理人声录音 | Media Manipulator',
      metaDescription: '用AI清理人声录音。减少嘶嘶声、嗡嗡声和房间噪声，让语音更容易听清。运行在我们自己的GPU上。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '用AI清理人声录音',
      ogDescription: '减少嘶嘶声、嗡嗡声和房间噪声，让播客、访谈和语音备忘录中的语音更清晰。',
      intro: '在有回声的厨房里录的手机语音备忘录、用笔记本电脑麦克风录音的播客嘉宾、在教室后排录下的讲座：话都录到了，却被嘶嘶声和房间声盖住。人声清理会先在我们的GPU上用DeepFilterNet处理录音，再让它经过一条固定的广播级润色链：削减低频隆隆声、限制高频、将电平调整到一致的响度，并防止峰值削波。它专为说话而设计，不适用于音乐。',
      whatItDoes: [
        '用ffmpeg将上传文件转换为48 kHz单声道，这正是DeepFilterNet要求的输入，然后将该WAV交给我们GPU上的模型。',
        '使用DeepFilterNet增强网络，在保留语音的同时抑制稳定的背景声（嘶嘶声、风扇声、嗡嗡声、房间底噪）。',
        '降噪后应用润色链：80 Hz高通、14 kHz低通、响度标准化到-16 LUFS且真峰值上限为-1.5 dBTP，以及0.95的限制器。',
        '按你选择的格式编码结果：192 kbps的MP3、AAC或OGG，128 kbps的Opus，FLAC，或16位WAV。',
        '跳过标准的比特率、均衡器、效果和裁剪控件，因为AI路径取代了常规的ffmpeg滤镜处理流程。',
      ],
      flowSteps: [
        {
          title: '上传录音',
          description: 'MP3、WAV、FLAC、M4A、AAC、OGG或Opus格式的语音备忘录、访谈音频、播客录音或讲座录音。',
        },
        {
          title: '已预设人声清理',
          description: '本页面的操作是固定的；唯一需要选择的是输出格式。',
        },
        {
          title: '标准化、降噪、润色',
          description: 'ffmpeg生成48 kHz单声道WAV，DeepFilterNet对其降噪，润色滤镜再设定音色和响度。',
        },
        {
          title: '下载并试听',
          description: '发布之前，戴上耳机与原始录音对比。',
        },
      ],
      advancedDetails: [
        '润色链完全是highpass=f=80,lowpass=f=14000,loudnorm=I=-16:TP=-1.5:LRA=11,alimiter=limit=0.95，对降噪后的WAV应用一次。高通滤除手持摩擦的隆隆声和爆破音的砰声，低通抑制14 kHz以上的嘶嘶声，loudnorm将综合响度调整到-16 LUFS，这是口播播客的常见目标。',
        '由于模型在单声道上运行，输出始终为48 kHz单声道。立体声访谈仍然清晰可懂，但会失去左右声像定位；如果你需要立体声，这不是合适的工具。',
        '编码器设置取决于输出扩展名：MP3使用libmp3lame 192 kbps，AAC或M4A使用aac 192 kbps，OGG使用libvorbis 192 kbps，Opus使用libopus 128 kbps，FLAC使用flac，WAV使用pcm_s16le。AI路径没有比特率选择器。',
        '选择AI操作后，裁剪范围和常用效果都会被忽略；转换器会把文件直接交给模型并返回结果。如果你只想清理录音的一部分，请先裁剪。',
        '对已经处于-16 LUFS的音频再运行一次人声清理，会重新进行标准化，并可能让辅音带上水声般的质感。只运行一次即可。',
        '模型难以处理相互竞争的人声、音乐垫底和突发的响亮声音；这些都不是“稳定的背景声”，大多会被保留。',
      ],
      whyItMatters: [
        '即使内容值得一听，听众也会停掉听起来令人疲惫的录音。',
        '一致的-16 LUFS电平意味着一集节目无需手动调整增益，就能与前后各集以相同音量播放。',
        '从噪声中提取出来的语音转录也更准确，因此先清理还能改善字幕。',
      ],
      useCases: [
        {
          title: '播客与访谈',
          description: '整理用普通麦克风录制的远程嘉宾音频，并使其响度与主持人一致。',
        },
        {
          title: '语音备忘录与口述',
          description: '让手机录音日后仍能听懂，而且不戴耳机也足够响亮。',
        },
        {
          title: '讲座与会议',
          description: '降低在房间后排录制的录音中的空调嗡嗡声和投影仪风扇声。',
        },
        {
          title: '视频旁白',
          description: '放入Darkroom编辑器之前，先润色画外音。',
        },
      ],
      workedExamples: [
        {
          title: '一段12分钟的手机备忘录（M4A，128 kbps，约11 MB）转为MP3',
          body: '128 kbps的AAC文件每秒16 KB，因此720秒约为11.5 MB。十二分钟超过了访客5分钟的限制，因此需要免费账号（20分钟）。ffmpeg首先在临时文件夹中写出一个约69 MB的48 kHz单声道WAV（每秒96,000字节），任务结束时该文件夹会被删除。DeepFilterNet和润色链在此基础上运行，MP3编码器以192 kbps写出结果：约17 MB，比输入更大，因为192 kbps高于备忘录录制时的码率。两个ffmpeg步骤只需几秒钟；DeepFilterNet处理占用了大部分时间，并随录音长度增长。',
        },
        {
          title: '一段4分钟的立体声WAV访谈（44.1 kHz，16位，约42 MB）转为WAV',
          body: '16位44.1 kHz立体声PCM每秒176,400字节，因此240秒约为42 MB，处于访客200 MB和5分钟的限制之内。模型运行前，文件会被混为单声道并重采样到48 kHz，清理后的WAV以16位48 kHz单声道返回：每秒96,000字节，约23 MB。它比输入小，只是因为它只有一个声道而不是两个。改选FLAC会以更小的空间无损保存相同的采样；选择MP3则在192 kbps下约为5.8 MB。',
        },
      ],
      whenNotToUse: '对于音乐、歌唱，或背景本身就是你想保留的声音的一部分的情况，请跳过本工具：模型会把所有非语音的内容当作噪声，而润色链会切掉80 Hz以下和14 kHz以上的频率，让乐器听起来空洞。当你需要保留立体声、录音已经削波或失真（这种损伤不是噪声，无法滤除），或者你只想降低噪声而不改变电平或音色时，它也不是正确的选择；后一种需求正是“去除背景噪音”页面的用途。',
      whyMediaManipulator: [
        'DeepFilterNet和润色链运行在我们运营的GPU上；录音不会被发送到外部的语音增强服务。',
        '页面打开时已选中人声清理并隐藏操作菜单，因此你唯一要决定的是输出格式。',
        '一次清理任务计为每日额度中的一次常规任务（默认情况下访客5次，免费账号30次），而不是AI任务，失败的任务会返还额度。',
      ],
      privacyNote: '你的录音保存在其任务文件夹中，由ffmpeg在临时目录中转换为48 kHz单声道的临时WAV，然后交给我们自己GPU上的DeepFilterNet；清理后的文件编码完成后，该临时目录会立即删除。清理后的输出随任务保留以供下载。音频上传还会经过我们服务器上的自动分析，该分析用Whisper转录录音以进行内部内容审核，并将结果随任务保存。没有任何第三方AI服务商会收到该文件。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: '为什么清理后的文件是单声道？',
          answer: '处理流程会在DeepFilterNet运行前把每个输入转换为48 kHz单声道，并按原样编码模型输出。因此，立体声录音会以单声道返回。对于双麦克风访谈，如果需要保留分离效果，请先拆分声道，再分别清理每个声道。',
        },
        {
          question: '人声清理会标准化到什么响度？',
          answer: '润色链使用ffmpeg loudnorm，综合响度目标为-16 LUFS，真峰值上限为-1.5 dBTP，响度范围为11 LU，随后是0.95的限制器。这符合常见的口播交付标准，因此在这里清理的节目，电平会与专业母带处理的播客相近。',
        },
        {
          question: '可以在本页面设置比特率或裁剪文件吗？',
          answer: '不可以。AI操作启用时，转换器会直接交给模型，并忽略比特率、均衡器、效果和裁剪设置。输出码率由格式决定：MP3、AAC和OGG为192 kbps，Opus为128 kbps。如果只需要其中一部分，请先用其他工具裁剪录音。',
        },
        {
          question: '它和“去除背景噪音”有什么区别？',
          answer: '两者运行相同的DeepFilterNet模型。人声清理会在之后加上高通、低通、响度标准化和限制器；“去除背景噪音”止步于降噪后的信号，不改动你的电平和音色。成品口播文件请选人声清理；如果你打算自己混音或做母带，请选另一个页面。',
        },
        {
          question: '它能修复削波或失真的录音吗？',
          answer: '不能。削波是波形缺失，而不是附加的噪声，模型没有可以减去的东西。它仍然可以降低失真录音周围的嘶嘶声，但响亮音节上的破音会保留。',
        },
        {
          question: '每天能清理多少段录音？免费吗？',
          answer: '人声清理被特意计为常规任务，因此它消耗常规任务额度：默认情况下访客每天5次，免费账号30次，Premium 300次，Pro 700次；文件上限为200 MB、1 GB和5 GB，时长上限为5分钟、20分钟和2小时。最新表格见/pricing。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '人声清理使用常规任务额度；时长限制取决于你的套餐，并实时显示在表单中。',
        ],
      },
      related: [
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: '相同的降噪器，但不含响度和音色润色。',
        },
        {
          label: '视频转录',
          to: '/tools/transcribe-video',
          description: '将清理后的语音转换为字幕或文本。',
        },
        {
          label: '从视频中提取音频',
          to: '/tools/extract-audio-from-video',
          description: '清理之前，先从视频中提取人声音轨。',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '将润色后的旁白放到视频时间线上。',
        },
        {
          label: '去除歌曲人声',
          to: '/tools/remove-vocals-from-song',
          description: '针对音乐而非语音，改为分离歌手的人声。',
        },
      ],
      embed: {
        title: '清理人声录音',
        description: '上传录音。人声清理已自动应用，因此无需设置操作菜单。如果需要默认格式以外的格式，请选择输出格式，然后转换。',
      },
    },
    'remove-background-noise': {
      name: '去除背景噪音',
      h1: '在线去除音频背景噪音',
      tagline: '用AI降噪器降低录音中的嘶嘶声、嗡嗡声、交通声和房间噪音，让主要声音更突出。',
      metaTitle: '在线去除音频背景噪音 | Media Manipulator',
      metaDescription: '去除音频中的背景噪音。AI降噪器会降低录音中的嘶嘶声、嗡嗡声和环境声。运行在我们自己的GPU上。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线去除音频背景噪音',
      ogDescription: '一款AI降噪器，可降低音频录音中的嘶嘶声、嗡嗡声、交通噪音和房间噪音。',
      intro: '空调、电脑风扇、街道车流和电气嗡嗡声都是稳定的声音，压在你真正想录的内容之下。本页面在我们的GPU上用深度学习降噪器DeepFilterNet处理文件，返回仅经过降噪的信号，其他一概不变：没有响度标准化，没有均衡，也没有限制器。因此，当你打算自己对结果进行混音或母带处理，或者想保留原始录音的特质时，它是正确的选择。',
      whatItDoes: [
        '用ffmpeg将上传文件重采样为48 kHz单声道，并将该WAV交给我们GPU上的DeepFilterNet程序。',
        '估算稳定的底噪并将其减去，降低嘶嘶声、嗡嗡声、风扇声、通风声和持续的车流声。',
        '按你选择的格式编码并返回模型的原始输出，峰值电平和音色平衡与模型生成的一致；本页面没有后期处理阶段。',
        '操作菜单保持可见，因此你可以在同一个表单中切换到人声清理或人声工具。',
      ],
      flowSteps: [
        {
          title: '上传音频',
          description: '任何常见的音频文件，包括从视频中提取的音轨。',
        },
        {
          title: '已预选降噪',
          description: '已选好“移除背景噪音”；如果你想要MP3以外的格式，请更改输出格式。',
        },
        {
          title: 'DeepFilterNet在我们的GPU上运行',
          description: '模型将稳定噪声与前景分离，并写出增强后的WAV。',
        },
        {
          title: '编码并下载',
          description: 'ffmpeg按你选择的格式写出增强后的WAV；请与原始录音对照试听。',
        },
      ],
      advancedDetails: [
        '在API中，本页面与人声清理之间唯一的区别是一个标志：polish=false。ffmpeg编码步骤不接收任何-af滤镜，因此增强后的WAV会按DeepFilterNet写出的原样编码。',
        '输入标准化为ffmpeg -ac 1 -ar 48000：模型在单个48 kHz声道上运行，因此无论输入的声道布局或采样率如何，输出都是48 kHz单声道。',
        '编码器取决于扩展名：MP3通过libmp3lame以192 kbps编码，AAC为192 kbps，OGG通过libvorbis以192 kbps编码，Opus通过libopus以128 kbps编码，FLAC为无损，WAV为pcm_s16le。如果还要进一步编辑，请选择WAV或FLAC，这样有损编码只发生一次。',
        '由于不进行响度标准化，安静的录音仍然安静。降噪会去除能量，因此结果的电平可能比输入略低；如有需要，之后请在编辑器中提高增益。',
        'DeepFilterNet针对稳定和缓慢变化的噪声训练。键盘敲击声、关门声、第二个说话人或音乐垫底大多会被保留，因为在模型看来它们都像信号。',
        '存放标准化WAV和增强WAV的临时目录会在任务结束时删除；只有编码后的输出随任务保留。',
      ],
      whyItMatters: [
        '持续的噪声会掩盖轻柔的辅音，让听众在察觉原因之前就早早感到疲惫。',
        '很多录音无法重录：婚礼致辞、讲座、对一位再也联系不上的人的访谈。',
        '未经标准化或限制的降噪音轨，为你自己的混音提供了干净的起点，而不是一个听起来已经完成、你还得再去撤销处理的文件。',
      ],
      useCases: [
        {
          title: '从视频中提取的音频',
          description: '提取音轨，去除相机风扇声或风声，然后在Darkroom中把它放回画面下方。',
        },
        {
          title: '现场录音',
          description: '降低户外访谈中道路或发电机的持续轰鸣声。',
        },
        {
          title: '通话和会议导出',
          description: '分享或转录之前，降低通话录音中的线路嘶嘶声。',
        },
        {
          title: '数字化磁带',
          description: '在不改变电平的情况下，降低转换录音中的磁带嘶嘶声。',
        },
      ],
      workedExamples: [
        {
          title: '一段18分钟、128 kbps的MP3通话录音（约17 MB）转为FLAC',
          body: '128 kbps的MP3每秒16 KB，因此1,080秒约为17 MB。十八分钟在免费账号20分钟的上限之内，但超过了访客5分钟的上限，因此请先登录。ffmpeg为模型写出一个约104 MB的48 kHz单声道WAV（每秒96,000字节），编码完成后该WAV会被丢弃。选择FLAC会无损返回增强后的48 kHz单声道采样；FLAC比104 MB的WAV小多少，取决于去除了多少静音和嘶嘶声，而降噪本身通常会让FLAC压缩得更好。若改选MP3，在192 kbps下约为26 MB。',
        },
        {
          title: '一段4分30秒的立体声FLAC现场录音（约30 MB）转为WAV',
          body: '四分半钟和30 MB都在访客5分钟和200 MB的限制之内，因此无需账号。立体声文件被混为单声道并重采样到48 kHz，DeepFilterNet降低车流底噪，WAV输出为16位48 kHz单声道：每秒96,000字节，共270秒，约26 MB。电平就是模型处理后留下的样子，不做任何标准化，因此如果原始录音较安静，请在编辑器中提高电平。两次ffmpeg转换各需几秒钟；GPU处理时间随时长增加。',
        },
      ],
      whenNotToUse: '如果噪声是间歇性的，或者噪声本身就是人声，本工具并不适用：重叠的说话人、隔壁房间的电视、拖椅子声和键盘敲击声大多会被保留，因为该模型是为稳定噪声而构建的。不要把它用在成品音乐上，因为它去除的“噪声”可能正是你花钱得来的混响和房间氛围。如果你需要立体声输出，它也不是正确的选择，因为处理流程是单声道的。另外，如果你想要一个达到标准响度、可直接发布的口播文件，人声清理会加上这种润色；本页面刻意不这样做。',
      whyMediaManipulator: [
        '降噪器运行在我们运营的GPU上；你的音频不会上传到第三方降噪服务。',
        '模型之后不添加任何处理：不改变响度，不加均衡，因此你听到的就是降噪，而且只有降噪。',
        '一次降噪任务计为每日额度中的一次常规任务，而不是AI任务；如果任务失败，额度会返还。',
      ],
      privacyNote: '你上传的文件会写入其任务文件夹，由ffmpeg在临时目录中重采样为48 kHz单声道的临时WAV，再由我们自己GPU上的DeepFilterNet降噪；输出编码完成后，临时目录会被删除。编码后的结果随任务保留以供下载。与所有音频上传一样，它还会经过我们服务器上的自动分析步骤，该步骤用Whisper转录文件以进行内部审核，审核结果随任务保存。不会有任何内容发送给外部AI服务商。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: 'DeepFilterNet擅长处理哪些噪声，不擅长处理哪些？',
          answer: '擅长稳定、缓慢变化的声音：嘶嘶声、电源嗡嗡声、风扇声、空调声、房间底噪、持续的道路声。短促的声音和任何类似语音的声音（第二个人、电视、咔嗒声、砰砰声）在模型看来都是前景，大多会被保留。',
        },
        {
          question: '我的录音电平或音色会改变吗？',
          answer: '只会作为去除噪声能量的副作用而改变；本页面不应用任何标准化、均衡或限制。如果你想要一致的-16 LUFS口播电平，并同时进行高通和低通处理，请使用人声清理，它运行相同的模型并加上了这条润色链。',
        },
        {
          question: '为什么降噪后的文件是单声道？',
          answer: '模型只接受单个48 kHz声道，因此ffmpeg会先将任何立体声输入混为单声道，输出也按此写出。如果立体声录音的每个声道噪声不同，且你需要保留立体声，请拆分声道后逐个降噪。',
        },
        {
          question: '可以直接为视频的音频降噪吗？',
          answer: '请上传音轨而不是视频：先用“从视频中提取音频”工具提取，在这里降噪，然后在Darkroom中把清理后的音轨与视频合并。',
        },
        {
          question: '哪种输出格式最适合进一步编辑？',
          answer: 'WAV（16位48 kHz单声道，每秒96 KB），或以更小空间保存相同采样的FLAC。MP3、AAC和OGG以192 kbps写出，Opus以128 kbps写出；只在最终分享时选择这些格式，这样有损编码只发生一次。',
        },
        {
          question: '降噪会计入AI任务额度吗？',
          answer: '不会。去除背景噪音被特意计为常规任务，与人声清理相同：默认情况下访客每天5次，免费账号30次，Premium 300次，Pro 700次。（分离或去除人声则不同：每次都计为一次AI任务。）时长上限为访客5分钟、免费账号20分钟；最新限制见/pricing。',
        },
        {
          question: '如果录音已经相当干净怎么办？',
          answer: '模型仍会运行，并去除它找到的任何残余底噪，但听感上的差别会很小，你可能更喜欢未经处理的原始录音。替换任何文件之前，请先对比两者。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '降噪使用常规任务额度；时长限制取决于你的套餐，并实时显示在表单中。',
        ],
      },
      related: [
        {
          label: '人声音频降噪',
          to: '/tools/clean-voice-audio',
          description: '相同的降噪器，外加针对语音的响度和音色润色。',
        },
        {
          label: '从视频中提取音频',
          to: '/tools/extract-audio-from-video',
          description: '先从视频中提取音轨。',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '把降噪后的音轨放回视频下方。',
        },
        {
          label: '视频转录',
          to: '/tools/transcribe-video',
          description: '转录更干净的音频以生成字幕。',
        },
        {
          label: '去除歌曲人声',
          to: '/tools/remove-vocals-from-song',
          description: '用另一个模型把歌声从音乐中分离出来。',
        },
      ],
      embed: {
        title: '去除背景噪音',
        description: '上传录音。已为你选好“移除背景噪音”。你仍然可以更改输出格式，然后转换。',
      },
    },
    'remove-vocals-from-song': {
      name: '去除歌曲人声',
      h1: '去除歌曲人声，制作伴奏或卡拉OK音轨',
      tagline: '去掉音轨中的歌声并保留音乐，用于卡拉OK、练习和伴奏。请仅用于你拥有权利的音乐。',
      metaTitle: '去除歌曲人声：卡拉OK制作器 | Media Manipulator',
      metaDescription: '用AI去除歌曲中的人声，并以与原文件相同的格式或FLAC、WAV下载伴奏。在我们自己的GPU上制作卡拉OK和练习音轨。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '去除歌曲人声，制作卡拉OK',
      ogDescription: '用AI去除歌曲中的歌声，并以MP3、FLAC或WAV格式下载伴奏。',
      intro: '卡拉OK之夜、歌唱练习和翻唱录音，都需要没有歌手的乐队演奏。本页面在我们的GPU上以双音轨模式用Demucs（htdemucs模型）处理歌曲，将混音拆分为“人声”和“其他所有声音”，并返回“其他所有声音”这一音轨。默认情况下，伴奏会以与你的文件相同的格式返回，因此320 kbps的MP3仍是320 kbps的MP3，而不会膨胀成WAV；需要用于编辑的无损文件时，也可以选择FLAC和WAV。',
      whatItDoes: [
        '以--two-stems=vocals运行Demucs htdemucs，因此模型只估算两个部分：主唱人声和伴奏。',
        '保留no_vocals音轨并丢弃人声音轨；结果是一个去除了歌声的立体声文件。',
        '上传时将“与输入相同”解析为具体格式：MP3仍为MP3，AAC/M4A仍为AAC/M4A，OGG和Opus保持不变，WAV、FLAC、AIFF或ALAC输入则以FLAC返回。',
        '以320 kbps写出MP3和AAC音轨，而不是其他音频工具使用的192 kbps，因此编码不会在分离之外再增加可闻的损失。',
        '开始之前，根据文件时长显示每种格式选项的预估输出大小。',
      ],
      flowSteps: [
        {
          title: '上传歌曲',
          description: '你拥有或获得授权使用的音轨，格式为MP3、WAV、FLAC、M4A、AAC、OGG或Opus。',
        },
        {
          title: '已预设消除人声',
          description: '操作是固定的；“输出格式”默认为“与输入相同”，也可选择MP3、FLAC和WAV。',
        },
        {
          title: 'Demucs分离混音',
          description: '模型在我们的GPU上以7秒为一段处理歌曲，并写出vocals.wav和no_vocals.wav。',
        },
        {
          title: '编码并下载',
          description: 'no_vocals音轨按解析出的格式编码，并提供下载。',
        },
      ],
      advancedDetails: [
        '确切的调用命令是demucs -n htdemucs --two-stems=vocals --segment 7；分段长度限制了GPU显存占用，让长音轨也能在单张显卡上运行。无论输入的采样率或声道数如何，Demucs都会写出44.1 kHz立体声音轨，因此单声道或48 kHz的音源会以44.1 kHz立体声返回。',
        '音轨编码方面，MP3为libmp3lame -b:a 320k，AAC或M4A为aac -b:a 320k；OGG保持192 kbps，Opus为128 kbps，FLAC和WAV为无损。其他所有AI音频操作都使用192 kbps，320 kbps是音轨专用的码率。',
        '“与输入相同”的规则是：有损输入返回相同的容器，无损输入返回FLAC，视频文件或服务器无法归类的任何文件则返回320 kbps的MP3。.m4a文件在决定之前会先用ffprobe探测，因为其中可能是无损ALAC而不是AAC。',
        '这条规则源于一个真实任务：一个87分钟、68 MB的MP3曾经以880 MB的WAV返回。PCM无法增加有损音源原本就没有的保真度，因此默认设置现在绝不会把有损音频放大成WAV；明确选择WAV时仍会照办。',
        '分离从来不是完美的。人声的混响尾音、和声伴唱，以及模型听起来“像人声”的任何声音（某些合成器主旋律、口哨），都可能渗入伴奏，而且密集的混音比现代的、层次分明的制作分离效果更差。',
        '当所选WAV超过500 MB时，表单会发出警告，因为44.1 kHz立体声16位WAV每秒176,400字节，约每分钟10.6 MB。',
      ],
      whyItMatters: [
        '大多数歌曲都没有官方伴奏版本，而授权的伴奏音轨往往是重新录制的，并非原始编曲。',
        '歌手跟着真实编曲排练，比跟着MIDI近似版本排练更有帮助。',
        '以输入格式返回音轨，能让手机大小的文件保持手机大小；一个10 MB的MP3不应意外变成50 MB的下载。',
      ],
      useCases: [
        {
          title: '在家唱卡拉OK',
          description: '为你已拥有的歌曲制作跟唱版本。',
        },
        {
          title: '声乐练习',
          description: '跟着原版乐队排练你的部分，耳边不会有主唱的声音。',
        },
        {
          title: '翻唱与混音',
          description: '把伴奏用作你自己人声录音的底轨。',
        },
        {
          title: '视频背景音乐',
          description: '从你获得授权的音乐中提取不含人声的底轨，用于Darkroom项目。',
        },
      ],
      workedExamples: [
        {
          title: '一段4分钟、320 kbps的MP3（约9.6 MB），选择“与输入相同”',
          body: '320 kbps的MP3每秒40 KB，因此240秒约为9.6 MB，完全在访客5分钟和200 MB的限制之内。由于输入是MP3，格式解析为MP3。Demucs在我们的GPU上以7秒为窗口处理歌曲，在临时文件夹中写出一个约42 MB的44.1 kHz立体声no_vocals.wav，随后ffmpeg用libmp3lame以320 kbps对其编码：伴奏同样约为9.6 MB。临时WAV会被删除。分离处理占用了大部分运行时间，并随音轨长度增加。',
        },
        {
          title: '一段4分50秒的CD音质WAV（约51 MB），默认FLAC或明确选择WAV',
          body: '44.1 kHz立体声16位WAV每秒176,400字节，因此290秒约为51 MB，仍在访客5分钟的上限之内。由于输入是无损的，“与输入相同”解析为FLAC：表单估计FLAC约为PCM大小的55%，即约28 MB，实际大小取决于音乐。若改选WAV，音轨会以16位PCM返回，约51 MB，与输入大小相同；选择MP3则在320 kbps下约为11.6 MB。三者都来自同一个no_vocals音轨，只是编码器不同。',
        },
      ],
      whenNotToUse: '不要用它处理你不拥有或未获得授权的音乐；你需要对结果的使用方式负责。如果你想要的是歌手而不是乐队（那是同一表单中的人声分离操作），如果你需要拆分为鼓、贝斯和其他乐器的四轨分离（本页面只生成人声和伴奏），或者录音是说话而不是歌唱（人声清理和背景噪音页面处理得更好），它也不是合适的工具。非常老的单声道录音，以及人声渗入每一支麦克风的现场私录，分离效果很差，预计会听到明显的残影。',
      whyMediaManipulator: [
        '分离在我们运营的GPU上用Demucs htdemucs模型运行；你的音乐不会被发送到外部的音轨分离服务。',
        '输出默认跟随你的文件格式，编码后的MP3或AAC音轨为320 kbps，FLAC或WAV只需一键即可选择。',
        '开始之前会显示每种格式的预估大小，因此体积过大的WAV是你的选择，而不是意外。',
      ],
      privacyNote: '你的歌曲存储在其任务文件夹中，并交给我们自己GPU上的Demucs处理，Demucs会把人声和伴奏音轨写入临时目录；只有伴奏会被编码进你的下载文件，临时目录（包括被丢弃的人声音轨）会在任务结束时删除。编码后的伴奏随任务保留。音频上传还会经过我们服务器上的自动分析步骤，该步骤用Whisper转录文件以进行内部审核，审核结果随任务保存。不涉及任何第三方AI服务商。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: '歌手的声音会完全消失吗？',
          answer: '大部分主唱人声会消失，但很少能完全去除。混响尾音、叠录和和声人声，以及模型听起来像人声的声音，都可能以较低的音量残留。现代立体声制作分离效果最好；单声道或串音严重的现场录音最差。',
        },
        {
          question: '伴奏是什么格式和采样率？',
          answer: 'Demucs写出44.1 kHz立体声音轨，因此所有输出都是这个采样率。容器默认跟随你的文件：输入MP3，输出320 kbps的MP3；输入AAC或M4A，输出相同格式，码率为320 kbps；输入WAV、FLAC、AIFF或ALAC，输出FLAC。你也可以明确选择MP3、FLAC或WAV。',
        },
        {
          question: '为什么默认格式不再是WAV？',
          answer: '因为一个68 MB、87分钟的MP3过去会以880 MB的WAV返回，而PCM无法恢复有损音源原本就没有的细节。现在音轨会保持输入格式，有损音轨以320 kbps写出，因此额外的编码听不出来。如果你需要，仍然可以选择WAV。',
        },
        {
          question: '可以只要人声而不要伴奏吗？',
          answer: '可以，在音频转换器的操作菜单中选择“人声分离”；它会保留同一次Demucs双音轨运行中的vocals.wav音轨，并丢弃伴奏。',
        },
        {
          question: '可以上传音乐视频而不是音频文件吗？',
          answer: '请上传音频：先从视频中提取音轨。如果视频文件确实进入了这个操作，服务器会把“与输入相同”解析为320 kbps的MP3，因为视频容器不是音频格式。',
        },
        {
          question: '每天可以免费分离多少首歌曲？',
          answer: '每首歌曲计为一次AI任务：默认情况下无账号每天3次，免费账号10次，Premium 100次，Pro 200次。AI任务额度单独计算，因此分离歌曲不会占用你的常规任务额度。歌曲时长上限为访客5分钟、免费账号20分钟，付费套餐为2小时；/pricing有最新表格。',
        },
        {
          question: '用这种方式制作卡拉OK音轨合法吗？',
          answer: '只有在你拥有、获得授权使用，或依据你所在地的例外规定可以使用该音乐时才合法。本工具不检查权利；你需要对结果及其传播方式负责。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '消除人声使用AI任务额度；额度和时长限制取决于你的套餐，并实时显示在表单中。',
        ],
      },
      related: [
        {
          label: '从视频中提取音频',
          to: '/tools/extract-audio-from-video',
          description: '分离之前，先从音乐视频中提取音频。',
        },
        {
          label: '人声音频降噪',
          to: '/tools/clean-voice-audio',
          description: '对于语音录音，请改用语音增强模型。',
        },
        {
          label: '去除背景噪音',
          to: '/tools/remove-background-noise',
          description: '降低录音中的稳定噪声，而不进行分离。',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '在视频剪辑中把伴奏用作背景音乐。',
        },
        {
          label: '视频转录',
          to: '/tools/transcribe-video',
          description: '从原始混音中获取歌词文本。',
        },
      ],
      embed: {
        title: '去除歌曲人声',
        description: '上传歌曲。“消除人声/卡拉OK”已选中，伴奏会以与你的文件相同的格式返回（MP3仍为MP3）；如需无损，请在“输出格式”中选择FLAC或WAV。点击转换。',
      },
    },

    // 2026-10-31 (MM92): name + tagline for every remaining tool, so the /tools catalog
    // and the home grid never show an English card in this locale. Model-written; native review pending.
    'transcode-to-dash': {
      name: '将视频转码为DASH（AV1 / VP9）',
      h1: '在线将视频转码为DASH AV1或VP9',
      tagline: '把任意视频打包成MPEG-DASH包：manifest.mpd，以及按清晰度划分的初始化分片和媒体分片。',
      metaTitle: '在线将视频转码为DASH AV1/VP9 | 免费MPEG-DASH工具',
      metaDescription: '免费在线MPEG-DASH转码工具。将MP4、MOV、WebM、MKV转换为采用AV1或VP9视频的DASH包，可选字幕和故事板。',
      ogTitle: '在线将视频转码为DASH AV1/VP9',
      ogDescription: '从任意视频生成自适应DASH包（manifest.mpd + 各清晰度版本的初始化分片/媒体分片）——免费，在你的浏览器中完成。',
      intro: 'MPEG-DASH是所有现代浏览器都支持的开放式自适应流媒体标准。Media Manipulator会将你的源视频转码为DASH VOD包——manifest.mpd，加上每个清晰度版本的init.mp4和.m4s分片——视频编码可选AV1（文件更小，最适合新型网页播放器）或VP9（播放支持更广泛）。将解压后的文件夹放到任何CDN或源站上，向客户端提供manifest.mpd即可。免费套餐包含360p、480p和720p。',
      whatItDoes: [
        '用ffprobe探测你的源文件，并显示分辨率、FPS、时长、编解码器和音频状态。',
        '让你选择要编码哪些质量档位，以及输出AV1还是VP9。',
        '自动检测可用的最佳AV1编码器（av1_nvenc → libsvtav1 → libaom-av1）。',
        '生成MPEG-DASH manifest.mpd，引用每个视频Representation，有音频时还会引用一个AAC音频Representation。',
        '可选生成WebVTT字幕和故事板拖动条缩略图。',
        '将结果打包为media-manipulator-dash-<codec>-<jobID>.tar.gz，附带report.json和README。',
        '将压缩包上传到S3，并返回一个短时有效的预签名GET URL。',
      ],
      flowSteps: [
        {
          title: '上传',
          description: '直接通过S3预签名PUT上传——你的文件绝不会经过API服务器。',
        },
        {
          title: '探测',
          description: 'ffprobe读取分辨率、FPS、是否有音频以及编解码器元数据。',
        },
        {
          title: '选择档位和编解码器',
          description: '选择AV1或VP9，以及360p/480p/720p的任意组合。',
        },
        {
          title: '编码',
          description: '使用AV1（svtav1/libaom/nvenc）或libvpx-vp9，生成2秒分片。',
        },
        {
          title: '打包',
          description: 'manifest.mpd + 各清晰度版本的初始化分片/媒体分片，与report.json和README一起打包为tar.gz。',
        },
        {
          title: '下载',
          description: '预签名S3 GET URL，有效期30分钟。',
        },
      ],
      advancedDetails: [
        '选择AV1编码器时，在可用的情况下优先使用av1_nvenc（GPU），否则回退到libsvtav1，再回退到libaom-av1。',
        'VP9使用libvpx-vp9，启用row-mt、帧并行解码，并结合CRF和码率控制。',
        'DASH变体使用-seg_duration 2 -use_template 1 -use_timeline 0 -single_file 0输出。',
        'manifest.mpd为每种内容类型声明一个AdaptationSet（视频，有音频时加上音频），codecs属性为“av01.0.08M.08”/“vp09.00.51.08”/“mp4a.40.2”。',
        '不进行放大：高于源分辨率的档位会被禁用，并显示提示。',
      ],
      whyItMatters: [
        '在同等画质下，AV1的码率通常只有H.264的一半。',
        '在Apple生态系统之外，DASH是占主导地位的自适应流媒体格式。',
        '预先打包的VOD可以避免流媒体平台按请求计费的转码费用。',
      ],
      useCases: [
        {
          title: '现代网页播放器',
          description: 'Shaka Player和dash.js原生支持manifest.mpd。',
        },
        {
          title: '对带宽敏感的分发',
          description: 'AV1的字节数接近H.264 HLS包的一半。',
        },
        {
          title: '内部媒体库',
          description: '自行托管自适应视频，无需付费使用SaaS流媒体平台。',
        },
        {
          title: '质量测试',
          description: '用同一源文件对AV1与VP9编码进行并排A/B对比。',
        },
      ],
      whyMediaManipulator: [
        '在我们自己的服务器上运行——没有任何第三方转码服务商能看到你的视频。',
        '默认选择AV1，因为AV1是高质量自适应流媒体的未来。',
        '开放的包格式：只需解压.tar.gz并托管manifest.mpd。',
      ],
      privacyNote: '你的视频由FFmpeg读取一次，编码为AV1或VP9清晰度版本，并连同清单一起切分为DASH分片，全部在我们的服务器上完成。这项工作在我们自己的服务器上运行，而不是第三方转码服务。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: 'AV1还是VP9——我该选哪个？',
          answer: '在同等画质下，AV1生成的文件更小，但在仅有CPU的主机上编码较慢。VP9的播放支持更广，编码也更快。AV1是默认选项。',
        },
        {
          question: '我的服务器提示AV1不可用？',
          answer: 'AV1需要FFmpeg中具备av1_nvenc（NVIDIA GPU）、libsvtav1或libaom-av1之一。查看/api/video-transcode/capabilities，了解你的安装中有哪些编码器。',
        },
        {
          question: '音频总是AAC吗？',
          answer: '是的——无论源文件采用什么编解码器，DASH音频AdaptationSet目前都输出128 kbps的AAC LC，以获得最大的兼容性。',
        },
        {
          question: '我可以跨域提供这个清单吗？',
          answer: '可以，但你的CDN/源站需要为.mpd、init.mp4和.m4s文件设置正确的CORS标头。压缩包中不包含这些标头。',
        },
        {
          question: '下载URL有效多久？',
          answer: '预签名GET URL默认有效30分钟。如果需要新的链接，请重新运行转码。',
        },
      ],
      related: [
        {
          label: '将视频转码为HLS',
          to: '/tools/transcode-to-hls',
          description: '同样的上传方式，但输出采用H.264 + AAC的Apple HLS包。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '用常规的FFmpeg流程缩小MP4。',
        },
        {
          label: '视频转录',
          to: '/tools/transcribe-video',
          description: '将视频中的语音提取为可搜索的文字。',
        },
      ],
      embed: {
        title: '将视频转码为DASH（AV1 / VP9）',
        description: '上传MP4/MOV/WebM/MKV。我们会用ffprobe探测源文件，让你选择免费的质量档位（360p/480p/720p），然后用ffmpeg进行AV1（默认）或VP9编码，并打包为包含manifest.mpd的可下载tar.gz。',
      },
    },
    'convert-webp-to-jpg': {
      name: '将WebP转换为JPG',
      h1: '在线将WebP转换为JPG',
      tagline: '把WebP图片转为兼容性极佳的JPG文件，在任何看图软件或编辑器中都能打开。',
      metaTitle: '在线将WebP转换为JPG（免费） | Media Manipulator',
      metaDescription: '免费在线WebP转JPG工具。按你选择的质量，快速把.webp图片转换为兼容性极佳的JPG文件。',
      ogTitle: '在线将WebP转换为JPG',
      ogDescription: '点几下即可把WebP图片转换为兼容性极佳的JPG文件。',
      intro: 'WebP非常适合网页，但较旧的软件、演示工具和打印机往往无法读取它。Media Manipulator会把WebP转换回JPG，让你在任何地方都能使用这张图片。选好你想要的质量，其余的交给我们。',
      whatItDoes: [
        '将任意.webp图片（静态图或动画中的一帧）转换为标准的.jpg文件。',
        '让你自行选择JPG质量：质量越高，文件越大。',
        '将透明区域合并到你选择的背景色上（JPG没有Alpha通道）。',
        '尽可能保留色彩配置文件。',
      ],
      flowSteps: [
        {
          title: '上传WebP',
          description: '从电脑中拖入一个.webp文件。',
        },
        {
          title: '选择JPG质量',
          description: '85是不错的默认值；想要更小的文件就调低一些。',
        },
        {
          title: '编码JPG',
          description: 'ImageMagick按所选质量重新编码。',
        },
        {
          title: '下载JPG',
          description: '保存一个兼容性极佳的.jpg文件。',
        },
      ],
      advancedDetails: [
        '质量85是由来已久的平衡点：高于约92时，多半只会让文件变大，画面几乎看不出改善。',
        'JPG不支持透明，因此透明的WebP会被合并到背景上。如果需要保留透明，请改为转换成PNG。',
        '如需无损转换图片或处理动画WebP，建议选择PNG（静态）或动态GIF。',
      ],
      whyItMatters: [
        '一些较旧的浏览器、图片编辑器和嵌入式软件仍然不支持WebP。',
        '许多打印机、照片自助冲印机和演示工具要求使用JPG或PNG。',
        'JPG是事实上通用的照片交换格式。',
      ],
      useCases: [
        {
          title: '向客户发送照片',
          description: '确保对方在任何设备上都能打开文件。',
        },
        {
          title: '插入演示文稿',
          description: 'PowerPoint/Keynote幻灯片处处都能接受JPG；WebP则时灵时不灵。',
        },
        {
          title: '打印和冲印店',
          description: '大多数冲印店只接受JPG。',
        },
        {
          title: '投稿图库网站',
          description: '许多图库网站要求上传JPG。',
        },
      ],
      whyMediaManipulator: [
        '无水印、无需注册，日常使用免费。',
        '可精确调节质量和压缩程度，而不是套用一刀切的预设。',
        '隐私与保留策略和整套工具中的其他工具相同。',
      ],
      privacyNote: '你的WebP会在我们的服务器上解码，并重新编码为JPG；由于JPG无法存储透明区域，透明部分会被合并到背景上。不会向任何外部服务发送数据。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原始文件绝不会被改动：你下载的是一个新文件。',
      faq: [
        {
          question: '透明区域会怎样？',
          answer: 'JPG不支持透明。透明的WebP会被合并到所选的背景色上。如果需要保留透明，请改为转换成PNG。',
        },
        {
          question: '我应该使用什么质量？',
          answer: '85是兼顾各方面的默认值。对画质要求最高的照片用90以上，缩略图或预览图用70。',
        },
        {
          question: '支持动画WebP吗？',
          answer: '只有第一帧会变成JPG。对于动画WebP，请改为转换成动态GIF。',
        },
        {
          question: '可以批量转换多个文件吗？',
          answer: '免费工具一次处理一个文件。目前请逐个转换每个WebP。',
        },
      ],
      related: [
        {
          label: '将WebP转换为PNG',
          to: '/tools/convert-webp-to-png',
          description: '改用无损PNG来保留透明度。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在JPG、PNG、WebP、AVIF和GIF之间转换。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '进一步缩小JPG文件体积。',
        },
        {
          label: '移除EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '分享JPG之前清除私密元数据。',
        },
        {
          label: '图片转换器教程',
          to: '/tutorials/image/getting-started',
          description: '逐步讲解每一个图片选项。',
        },
      ],
      embed: {
        title: '将WebP转换为JPG',
        description: '上传WebP图片，并选择JPG作为输出格式。拖动质量滑块，在文件大小和画质之间取得平衡。JPG会丢弃透明度，因此如果你的图片带有透明背景，请改用PNG。',
      },
    },
    'convert-png-to-jpg': {
      name: '将PNG转换为JPG',
      h1: '在线免费将PNG转换为JPG',
      tagline: '几秒钟内把体积庞大的PNG截图和图形变成小巧、通用的JPG图片。',
      metaTitle: '在线免费将PNG转换为JPG | Media Manipulator',
      metaDescription: '免费在线PNG转JPG工具。按你选择的质量，把.png文件转换为更小、兼容性极佳的JPG图片。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将PNG转换为JPG',
      ogDescription: '把PNG图片转换为更小、兼容性极佳的JPG文件。免费、快速，无需注册。',
      intro: 'PNG是无损格式，非常适合截图和图形，但用来存照片时，文件往往远比实际需要的大。把PNG转换为JPG，可以让文件缩小5–10倍，而照片类内容看不出任何差别。Media Manipulator会按你选择的质量，把PNG转换为干净的JPG：免费、在线完成，而且无需注册。',
      whatItDoes: [
        '将任意.png图片转换为标准的.jpg（JPEG）文件。',
        '让你选择JPG质量，在文件大小和保真度之间取得平衡。',
        '由于JPG没有Alpha通道，透明区域会被合并到纯色背景上。',
        '你看到的像素保持不变；只是文件从PNG重新编码为JPG。',
      ],
      flowSteps: [
        {
          title: '上传PNG',
          description: '拖入一张.png截图、图形或照片。',
        },
        {
          title: '选择JPG质量',
          description: '85是兼顾各方面的默认值；想要更小的文件就调低一些。',
        },
        {
          title: '编码JPG',
          description: 'ImageMagick将你的图片重新编码为JPEG。',
        },
        {
          title: '下载JPG',
          description: '保存一个更小、兼容性极佳的.jpg文件。',
        },
      ],
      advancedDetails: [
        '质量85是由来已久的最佳平衡点：高于约92后，多半只是增加文件大小，肉眼几乎看不出提升。',
        '一张照片类PNG转为JPG后，常常会从几兆字节降到几百千字节。',
        '对于边缘锐利或带文字的图形，在相同大小下，PNG或WebP通常比JPG看起来更干净。',
        '如果你的PNG带有需要保留的透明度，请改为转换成WebP，因为JPG无法存储Alpha通道。',
      ],
      whyItMatters: [
        'JPG是接受度最高的照片格式：每台设备、每个编辑器和每个上传表单都支持它。',
        '更小的JPG在网页上加载更快，也不会超出邮件和表单的上传限制。',
        '许多冲印店、电商平台和图库网站只接受JPG。',
      ],
      useCases: [
        {
          title: '缩小截图',
          description: '把体积庞大的PNG截图变成轻巧的JPG，方便通过邮件或聊天发送。',
        },
        {
          title: '上传照片',
          description: '把照片类PNG转换为JPG，以满足网站的格式要求。',
        },
        {
          title: '打印和冲印店',
          description: '大多数冲印店要求JPG，下单前先转换好。',
        },
        {
          title: '让网页更快',
          description: '用小巧的JPG替换大尺寸的PNG照片，减轻页面体积。',
        },
      ],
      whyMediaManipulator: [
        '输出确实锁定为JPG，因此不会出现设置错误。',
        '可精确控制质量，而不是套用一刀切的预设。',
      ],
      privacyNote: '你的PNG会在我们的服务器上按你设定的质量重新编码为JPG，任何透明区域都会被合并到纯色背景上。不会向任何外部服务发送数据。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原始文件绝不会被改动：你下载的是一个新文件。',
      faq: [
        {
          question: '如何免费将PNG转换为JPG？',
          answer: '在上方上传你的.png，选择JPG质量，然后点击转换。下载得到的是一个标准的.jpg文件。',
        },
        {
          question: '把PNG转换为JPG会降低画质吗？',
          answer: 'JPG是有损格式，因此会有轻微的画质取舍。在质量85–90下，照片几乎看不出差别。对于带有锐利文字的图形，请保留PNG或使用WebP。',
        },
        {
          question: '把PNG转换为JPG时，透明区域会怎样？',
          answer: 'JPG不支持透明，因此透明区域会被合并到纯色背景上。如果需要保留透明度，请改为把PNG转换为WebP。',
        },
        {
          question: '为什么我的PNG比JPG大这么多？',
          answer: 'PNG是无损格式，会精确存储每一个像素，用于照片时体积很大。JPG采用基于人眼感知的压缩，因此照片类图片能大幅缩小，肉眼几乎看不出变化。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '由于JPG不支持透明，PNG中的透明区域会被合并到纯色背景上。',
        ],
      },
      related: [
        {
          label: '将JPG转换为PNG',
          to: '/tools/convert-jpg-to-png',
          description: '反向转换，得到支持透明的PNG。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在JPG、PNG、WebP、AVIF等格式之间转换。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '不改变格式，进一步缩小JPG。',
        },
        {
          label: '图片转换器教程',
          to: '/tutorials/image/getting-started',
          description: '详细讲解每一个图片选项。',
        },
      ],
      embed: {
        title: '将PNG转换为JPG',
        description: '上传PNG图片。此工具的输出锁定为JPG，只需选择质量并转换即可。由于JPG没有Alpha通道，透明区域会被合并到纯色背景上。',
      },
    },
    'convert-jpg-to-png': {
      name: '将JPG转换为PNG',
      h1: '在线免费将JPG转换为PNG',
      tagline: '把JPG照片转为无损PNG文件，适合编辑、透明处理和高质量图形制作。',
      metaTitle: '在线免费将JPG转换为PNG | Media Manipulator',
      metaDescription: '免费在线JPG转PNG工具。把.jpg照片转换为无损PNG文件，适合编辑、透明处理和图形制作。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将JPG转换为PNG',
      ogDescription: '把JPG照片转换为适合编辑和图形制作的无损PNG文件。免费、快速，无需注册。',
      intro: 'PNG是无损格式，绝不会增加压缩伪影，因此一旦你开始编辑图片、添加透明效果或叠加图形，它就是理想之选。把JPG转换为PNG可以锁定当前的像素，之后的编辑就不会降低画质。Media Manipulator可在线把你的JPG转换为干净的PNG，免费且无需注册。',
      whatItDoes: [
        '将任意.jpg/.jpeg图片转换为无损的.png文件。',
        '精确保留当前像素，反复编辑也不会增加伪影。',
        '生成的PNG之后可以在编辑器中进行叠加、蒙版或透明处理。',
        'JPG的每一个像素都会被原样保留；PNG存储它们时不会再有任何损失。',
      ],
      flowSteps: [
        {
          title: '上传JPG',
          description: '拖入一张.jpg或.jpeg照片。',
        },
        {
          title: '转换为PNG',
          description: '我们将图片无损地重新编码为PNG。',
        },
        {
          title: '编码PNG',
          description: 'ImageMagick写出标准的24/32位PNG。',
        },
        {
          title: '下载PNG',
          description: '保存一个可直接编辑的无损.png文件。',
        },
      ],
      advancedDetails: [
        'PNG是无损格式，因此转换后的文件通常比源JPG更大，这是正常现象。',
        '把JPG转换为PNG无法找回JPG已经丢弃的细节；它只是把当前像素无损地固定下来。',
        'PNG支持Alpha通道，因此转换结果可以直接在编辑器中添加透明效果。',
        '如果想要体积最小的无损网页文件，WebP（无损模式）往往比PNG更小。',
      ],
      whyItMatters: [
        '一旦图片需要反复编辑，无损的PNG就是合适的工作格式。',
        '设计工具、应用素材和UI工作都需要PNG，以获得清晰的边缘和透明支持。',
        'PNG可以避免JPG反复另存时产生的代际损失。',
      ],
      useCases: [
        {
          title: '编辑前准备',
          description: '修图前先把JPG转换为PNG，让后续编辑保持无损。',
        },
        {
          title: '添加透明效果',
          description: '准备好一张PNG画布，用来抠除背景。',
        },
        {
          title: 'UI和应用素材',
          description: '大多数设计系统要求图标和图形使用PNG。',
        },
        {
          title: '嵌入文档',
          description: '在清晰的文字和线条比文件大小更重要的地方使用PNG。',
        },
      ],
      whyMediaManipulator: [
        '输出确实锁定为PNG，因此结果始终是无损的。',
        '在我们自己的服务器上运行，你的图片不会交给第三方处理。',
      ],
      privacyNote: '你的JPG会在我们的服务器上解码，并写出为像素完全相同的无损PNG。不会向任何外部服务发送数据。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原始文件绝不会被改动：你下载的是一个新文件。',
      faq: [
        {
          question: '如何免费将JPG转换为PNG？',
          answer: '在上方上传你的.jpg并点击转换，输出就是无损的.png。免费、无需注册，在浏览器中即可使用。',
        },
        {
          question: '把JPG转换为PNG能提升画质吗？',
          answer: '不能。转换过程是无损的，但无法找回JPG已经丢弃的细节。它会固定当前的像素，让之后的编辑不再产生伪影。',
        },
        {
          question: 'PNG会比我的JPG更大吗？',
          answer: '通常会。PNG精确存储每一个像素，不使用有损压缩，因此照片类PNG一般比同等的JPG更大。',
        },
        {
          question: '转换为PNG后可以添加透明效果吗？',
          answer: '可以。PNG支持Alpha通道，因此拿到PNG后，你可以在任何图片编辑器中擦除或抠除背景。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'PNG是无损格式，因此输出通常比源JPG更大。',
        ],
      },
      related: [
        {
          label: '将PNG转换为JPG',
          to: '/tools/convert-png-to-jpg',
          description: '反向转换，把PNG缩小为JPG。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在JPG、PNG、WebP、AVIF等格式之间转换。',
        },
        {
          label: '移除图片背景',
          to: '/tools/remove-background-from-image',
          description: '自动生成透明的PNG抠图。',
        },
        {
          label: '图片转换器教程',
          to: '/tutorials/image/getting-started',
          description: '详细讲解每一个图片选项。',
        },
      ],
      embed: {
        title: '将JPG转换为PNG',
        description: '上传JPG图片。此工具的输出锁定为PNG，因此你会得到一个无损文件，可直接用于编辑或在透明画布上叠加。',
      },
    },
    'convert-webp-to-png': {
      name: '将WebP转换为PNG',
      h1: '在线免费将WebP转换为PNG',
      tagline: '把WebP图片转为无损PNG文件，随处可开，并完整保留透明度。',
      metaTitle: '在线免费将WebP转换为PNG | Media Manipulator',
      metaDescription: '免费在线WebP转PNG工具。把.webp图片转换为保留透明度、任何编辑器都能打开的无损PNG文件。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将WebP转换为PNG',
      ogDescription: '把WebP图片转换为保留透明度的无损PNG文件。免费、快速，无需注册。',
      intro: 'WebP非常适合网页，但许多编辑器、较旧的软件和设计工具仍然需要PNG；而且与JPG不同，PNG能完整保留透明度。Media Manipulator会把你的WebP转换为干净的无损PNG，让它随处都能打开，Alpha通道也完好无损。',
      whatItDoes: [
        '将任意.webp图片转换为无损的.png文件。',
        '保留Alpha通道，透明的WebP转换后依然透明。',
        '生成的PNG可在任何编辑器、看图软件或设计工具中打开。',
        '画面保持不变；WebP压缩被替换为无损的PNG存储。',
      ],
      flowSteps: [
        {
          title: '上传WebP',
          description: '拖入一个.webp文件，透明或不透明均可。',
        },
        {
          title: '转换为PNG',
          description: '我们解码WebP，并将其重新编码为PNG。',
        },
        {
          title: '编码PNG',
          description: 'ImageMagick写出无损的24/32位PNG。',
        },
        {
          title: '下载PNG',
          description: '保存一个保留透明度的.png文件。',
        },
      ],
      advancedDetails: [
        '源WebP中的透明度会作为PNG的Alpha通道保留下来。',
        '动画WebP只有第一帧会变成静态PNG；如需保留动画，请改为转换成GIF。',
        'PNG是无损格式，因此输出通常比源WebP更大；这是换取通用兼容性和无损存储的代价。',
      ],
      whyItMatters: [
        '一些编辑器、演示工具和较旧的软件仍然无法打开WebP。',
        'PNG能保留透明度，而JPG做不到，这对标志和抠图非常重要。',
        'PNG是一种安全、无损的图形交换格式。',
      ],
      useCases: [
        {
          title: '在编辑器中打开WebP',
          description: '转换为PNG，让不支持WebP的编辑器也能打开。',
        },
        {
          title: '保留透明度',
          description: '把透明的WebP标志保存为透明的PNG。',
        },
        {
          title: '设计交付',
          description: '把PNG交给需要PNG素材的工具或团队成员。',
        },
        {
          title: '演示文稿',
          description: '把PNG放进不接受WebP的幻灯片软件。',
        },
      ],
      whyMediaManipulator: [
        '输出锁定为PNG，并自动保留透明度。',
        '在我们自己的服务器上运行，你的图片不会交给第三方处理。',
      ],
      privacyNote: '你的WebP会在我们的服务器上解码，并保存为保留透明度的无损PNG。不会向任何外部服务发送数据。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原始文件绝不会被改动：你下载的是一个新文件。',
      faq: [
        {
          question: '如何免费将WebP转换为PNG？',
          answer: '在上方上传你的.webp并点击转换。下载得到的是保留透明度的无损.png。免费且无需注册。',
        },
        {
          question: 'WebP转PNG会保留透明度吗？',
          answer: '会。如果你的WebP带有透明背景，生成的PNG会完整保留该Alpha通道。',
        },
        {
          question: '为什么要把WebP转换为PNG而不是JPG？',
          answer: 'PNG是无损格式并保留透明度，而JPG会合并透明区域并引入压缩。需要透明度或无损图形时选择PNG；想要体积最小的照片文件时选择JPG。',
        },
        {
          question: '可以转换动画WebP吗？',
          answer: '只有第一帧会变成PNG。如需保留动画，请改为把WebP转换为动态GIF。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '透明度会被保留。动画WebP只转换第一帧。',
        ],
      },
      related: [
        {
          label: '将PNG转换为WebP',
          to: '/tools/convert-png-to-webp',
          description: '反向转换，把PNG缩小为WebP。',
        },
        {
          label: '将WebP转换为JPG',
          to: '/tools/convert-webp-to-jpg',
          description: '改为把WebP转换为小巧的JPG。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在JPG、PNG、WebP、AVIF等格式之间转换。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '缩小图片，免去更换格式的麻烦。',
        },
      ],
      embed: {
        title: '将WebP转换为PNG',
        description: '上传WebP图片。此工具的输出锁定为PNG，因此透明度会被保留，文件也能在任何图片编辑器或看图软件中打开。',
      },
    },
    'convert-png-to-webp': {
      name: '将PNG转换为WebP',
      h1: '在线免费将PNG转换为WebP',
      tagline: '把PNG图形压缩成新一代WebP文件，网页加载更快，并完整保留透明度。',
      metaTitle: '在线免费将PNG转换为WebP | Media Manipulator',
      metaDescription: '免费在线PNG转WebP工具。把.png文件压缩成更小的WebP图片，让网站加载更快，同时保留透明度。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将PNG转换为WebP',
      ogDescription: '把PNG图形压缩成更小、保留透明度的WebP文件，让网站更快。免费，无需注册。',
      intro: 'WebP是现代网页图片格式：它生成的文件比PNG小得多，同时保留透明度，这意味着页面更快、Core Web Vitals表现更好。Media Manipulator会按你选择的质量把PNG转换为WebP：免费、在线完成，完整保留透明度，而且无需注册。',
      whatItDoes: [
        '将任意.png图片转换为新一代.webp文件。',
        '保留Alpha通道，透明的PNG转换后依然透明。',
        '让你选择质量，在文件大小和保真度之间取得平衡。',
        '生成的文件通常比源PNG小25–80%。',
      ],
      flowSteps: [
        {
          title: '上传PNG',
          description: '拖入一张.png图形、图标或截图。',
        },
        {
          title: '选择WebP质量',
          description: '用于网页时，80–85是很好的默认值。',
        },
        {
          title: '编码WebP',
          description: 'ImageMagick将你的图片重新编码为WebP。',
        },
        {
          title: '下载WebP',
          description: '保存一个更小、保留透明度的.webp文件。',
        },
      ],
      advancedDetails: [
        'WebP同时支持有损和无损模式；在约80的质量下，它的文件大小通常远小于PNG，画面依然干净。',
        '透明度会被保留，因此标志和UI素材的Alpha通道完好无损。',
        '所有现代浏览器都支持WebP，可直接使用它来加快页面加载。',
        '如需最大程度兼容非常老旧的软件，请保留一份PNG作为备用。',
      ],
      whyItMatters: [
        '缩小图片是加快页面加载、改善SEO最有效的手段。',
        'WebP保留透明度，因此你不必像使用JPG那样，为了体积而牺牲Alpha通道。',
        'Google的Core Web Vitals青睐更轻的页面，WebP能直接带来帮助。',
      ],
      useCases: [
        {
          title: '让网站更快',
          description: '用WebP替换体积庞大的PNG素材，减轻页面体积。',
        },
        {
          title: '透明标志',
          description: '缩小透明的PNG标志，同时保留其Alpha通道。',
        },
        {
          title: '应用和UI素材',
          description: '交付更轻的图形，清晰度丝毫不减。',
        },
        {
          title: '图片密集的图库',
          description: '把一批PNG转换为WebP，让图库更加流畅。',
        },
      ],
      whyMediaManipulator: [
        '输出锁定为WebP，并保留透明度。',
        '可精确控制质量，由你决定大小与保真度之间的取舍。',
      ],
      privacyNote: '你的PNG会在我们的服务器上按你选择的质量重新编码为WebP，并保留其透明度。不会向任何外部服务发送数据。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原始文件绝不会被改动：你下载的是一个新文件。',
      faq: [
        {
          question: '如何免费将PNG转换为WebP？',
          answer: '在上方上传你的.png，选择质量，然后点击转换。下载得到的是一个.webp文件。免费且无需注册。',
        },
        {
          question: 'PNG转WebP会保留透明度吗？',
          answer: '会。WebP支持Alpha通道，因此透明的PNG转换后依然透明。',
        },
        {
          question: 'WebP会小多少？',
          answer: '这取决于具体图片，但在视觉质量相近时，WebP通常比源PNG小25–80%。',
        },
        {
          question: 'WebP在所有地方都受支持吗？',
          answer: '所有现代浏览器都支持WebP。少数较旧或小众的程序不支持；如需兼容它们，请保留一份PNG作为备用。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'WebP输出会保留透明度。',
        ],
      },
      related: [
        {
          label: '将WebP转换为PNG',
          to: '/tools/convert-webp-to-png',
          description: '反向转换，回到无损的PNG。',
        },
        {
          label: '将JPG转换为WebP',
          to: '/tools/convert-jpg-to-webp',
          description: '把JPG照片压缩成适合网页的WebP。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '不改变格式，进一步缩小图片。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在JPG、PNG、WebP、AVIF和GIF之间转换。',
        },
        {
          label: '图片转换器教程',
          to: '/tutorials/image/getting-started',
          description: '详细讲解每一个图片选项。',
        },
      ],
      embed: {
        title: '将PNG转换为WebP',
        description: '上传PNG图片。此工具的输出锁定为WebP，选择质量并转换即可。透明度会被保留，而且WebP文件通常比PNG小得多。',
      },
    },
    'convert-jpg-to-webp': {
      name: '将JPG转换为WebP',
      h1: '在线免费将JPG转换为WebP',
      tagline: '把JPG照片压缩成新一代WebP文件，画质相同，网页加载更快。',
      metaTitle: '在线免费将JPG转换为WebP | Media Manipulator',
      metaDescription: '免费在线JPG转WebP工具。按你选择的质量，把.jpg照片压缩成更小的WebP图片，让网站加载更快。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将JPG转换为WebP',
      ogDescription: '把JPG照片压缩成更小的WebP文件，视觉质量不变，网站更快。免费，无需注册。',
      intro: 'WebP能以明显更小的文件提供与JPG相同的视觉质量，因此已成为快速网站的默认图片格式。Media Manipulator会按你选择的质量把JPG转换为WebP，让你的照片看起来不变，加载却更快。',
      whatItDoes: [
        '将任意.jpg/.jpeg照片转换为新一代.webp文件。',
        '让你选择WebP质量，在文件大小和保真度之间取得平衡。',
        '在同等质量下，生成的文件通常比源JPG小25–35%。',
        '照片看起来完全一样；只是用WebP重新编码数据，让文件变小。',
      ],
      flowSteps: [
        {
          title: '上传JPG',
          description: '拖入一张.jpg或.jpeg照片。',
        },
        {
          title: '选择WebP质量',
          description: '80–85与常见的JPG质量非常接近。',
        },
        {
          title: '编码WebP',
          description: 'ImageMagick将你的照片重新编码为WebP。',
        },
        {
          title: '下载WebP',
          description: '保存一个更小、可直接用于网页的.webp文件。',
        },
      ],
      advancedDetails: [
        '得益于更现代的压缩技术，在同等视觉质量下，WebP通常比JPG小25–35%。',
        '避免叠加高强度压缩：把本已有损的JPG以极低的WebP质量重新编码，可能会让伪影越积越多。',
        '所有现代浏览器都支持WebP，可直接使用它来加快页面加载。',
        '如需最大程度兼容非常老旧的软件，请保留一份JPG作为备用。',
      ],
      whyItMatters: [
        '更轻的图片能直接改善页面加载时间、跳出率和SEO。',
        '只需一次转换，WebP就能以更小的体积提供接近JPG的画质。',
        'Core Web Vitals青睐更小的图片，WebP是立竿见影的改进。',
      ],
      useCases: [
        {
          title: '让网站更快',
          description: '把首屏大图和图库中的JPG转换为WebP，减轻页面体积。',
        },
        {
          title: '电商商品目录',
          description: '缩小商品照片，让商品列表瞬间加载。',
        },
        {
          title: '博客和文章',
          description: '使用更轻的正文配图，画质却看不出损失。',
        },
        {
          title: '适合邮件发送的照片',
          description: '得到更小的文件，不超出附件大小限制。',
        },
      ],
      whyMediaManipulator: [
        '输出锁定为WebP，因此不会出现设置错误。',
        '可精确控制质量，而不是使用固定预设。',
      ],
      privacyNote: '你的JPG会在我们的服务器上按你选择的质量重新编码为更小的WebP。不会向任何外部服务发送数据。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原始文件绝不会被改动：你下载的是一个新文件。',
      faq: [
        {
          question: '如何免费将JPG转换为WebP？',
          answer: '在上方上传你的.jpg，选择质量，然后点击转换。下载得到的是一个.webp文件。免费且无需注册。',
        },
        {
          question: 'WebP比JPG更好吗？',
          answer: '用于网页时，通常是的：WebP能以更小的体积提供相近的画质。但在兼容非常老旧的软件方面，JPG依然更胜一筹。',
        },
        {
          question: 'WebP比JPG小多少？',
          answer: '在同等视觉质量下，WebP通常比JPG小25–35%，不过具体节省多少取决于图片本身。',
        },
        {
          question: '把JPG转换为WebP会损失画质吗？',
          answer: '两种格式都是有损的。在质量80–85下，结果看起来与JPG一样。请避免把WebP质量设得过低，以免伪影叠加。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'JPG没有透明度，因此WebP输出完全不透明。',
        ],
      },
      related: [
        {
          label: '将WebP转换为JPG',
          to: '/tools/convert-webp-to-jpg',
          description: '反向转换，回到通用的JPG。',
        },
        {
          label: '将PNG转换为WebP',
          to: '/tools/convert-png-to-webp',
          description: '把PNG图形压缩成适合网页的WebP。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '不改变格式，进一步缩小图片。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在JPG、PNG、WebP、AVIF和GIF之间转换。',
        },
        {
          label: '图片转换器教程',
          to: '/tutorials/image/getting-started',
          description: '详细讲解每一个图片选项。',
        },
      ],
      embed: {
        title: '将JPG转换为WebP',
        description: '上传JPG图片。此工具的输出锁定为WebP，选择质量并转换即可。在相同视觉质量下，WebP文件通常比JPG更小。',
      },
    },
    'jpg-converter': {
      name: 'JPG转换器',
      tagline: '将图片转换为JPG：已预选JPG的图片转换器。',
    },
    'png-converter': {
      name: 'PNG转换器',
      tagline: '将图片转换为PNG：已预选PNG的图片转换器。',
    },
    'convert-jpg-to-pdf': {
      name: '将JPG转换为PDF',
      h1: '在线免费将JPG转换为PDF',
      tagline: '把JPG照片和扫描件变成整洁的PDF文档，可直接分享、打印或上传。',
      metaTitle: '在线免费将JPG转换为PDF | Media Manipulator',
      metaDescription: '免费在线JPG转PDF工具。将.jpg照片和扫描件变成整洁的PDF文档，画质零损失。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将JPG转换为PDF',
      ogDescription: '将JPG照片和扫描件变成整洁的PDF文档。无损、免费，无需注册。',
      intro: 'JPG是手机和相机拍摄所用的格式，但大多数表格、申请和办公场合需要的是PDF。Media Manipulator会将你的JPG直接嵌入PDF，不做重新压缩，因此文档看起来与你的照片完全一样，体积也很小。',
      whatItDoes: [
        '将JPG/JPEG照片包装为单页PDF文档。',
        '无损嵌入原始JPG字节——不增加任何压缩。',
        '按照片设定页面尺寸，不会裁剪或拉伸任何内容。',
        '生成在任何地方都能打开和打印的标准PDF。',
      ],
      flowSteps: [
        {
          title: '上传JPG',
          description: '拖入.jpg或.jpeg照片或扫描件。',
        },
        {
          title: '我们将其嵌入',
          description: 'JPG会被放置在尺寸匹配的页面上，不做额外压缩。',
        },
        {
          title: '生成PDF',
          description: '组装一个标准的单页PDF。',
        },
        {
          title: '下载PDF',
          description: '保存一个整洁的.pdf，可直接分享或上传。',
        },
      ],
      advancedDetails: [
        'JPG数据流通过PDF的/DCTDecode过滤器嵌入，这意味着照片按原样存储——不会经历第二轮有损压缩。',
        '由于不重新编码，JPG转PDF生成的文档通常与原照片大小相近。',
        '页面尺寸按图片以96 DPI计算，因此一张普通的手机照片会生成大小适中的页面。',
      ],
      whyItMatters: [
        '表格、门户网站和申请常常要求PDF，而不是JPG。',
        'PDF的打印效果可预期，而原始JPG可能会被平铺或重新缩放。',
        '无损嵌入能让扫描文档中的文字保持清晰可读。',
      ],
      useCases: [
        {
          title: '求职申请',
          description: '把签名表格的照片变成门户网站可接受的PDF。',
        },
        {
          title: '收据和报销',
          description: '将收据照片转换为PDF，用于报销报告。',
        },
        {
          title: '扫描文档',
          description: '把用手机扫描的页面包装成整洁的PDF。',
        },
        {
          title: '打印',
          description: '从JPG获得可预期的打印效果。',
        },
      ],
      whyMediaManipulator: [
        '真正的无损——PDF中的JPG与你的原图完全相同。',
        '输出已锁定为PDF，因此不存在设置出错的可能。',
      ],
      privacyNote: '你的JPG会在不重新压缩的情况下，被放置到我们服务器构建的单个PDF页面上。不会向任何外部服务发送数据。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原文件绝不会被修改：你下载的是一个新文件。',
      faq: [
        {
          question: '如何免费将JPG转换为PDF？',
          answer: '在上方上传你的.jpg并点击转换——输出是一个单页PDF。完全免费，无需注册。',
        },
        {
          question: '将JPG转换为PDF会降低画质吗？',
          answer: '不会。JPG会直接嵌入PDF而不重新压缩，因此画质与你的原文件完全相同。',
        },
        {
          question: 'PDF会比我的JPG大很多吗？',
          answer: '不会——由于没有重新编码，PDF与源JPG大小基本相同，只多出一个很小的文档外壳。',
        },
        {
          question: '可以把多张JPG合并成一个PDF吗？',
          answer: '此工具每张图片生成一个PDF。如果需要多页，请逐张转换JPG，再用合并工具合并这些PDF。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'JPG会以无损方式（不重新压缩）嵌入单页PDF。',
        ],
      },
      related: [
        {
          label: '将PNG转换为PDF',
          to: '/tools/convert-png-to-pdf',
          description: '专门的PNG → PDF转换器。',
        },
        {
          label: '图片转PDF',
          to: '/tools/image-to-pdf',
          description: '将任意图片格式转换为PDF。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在JPG、PNG、WebP、AVIF等格式之间转换。',
        },
        {
          label: 'PDF转JPG',
          to: '/tools/pdf-to-jpg',
          description: '反向转换：将PDF渲染为JPG。',
        },
        {
          label: 'PDF转换器',
          to: '/tools/pdf-converter',
          description: '完整的PDF转换中心。',
        },
      ],
      embed: {
        title: '将JPG转换为PDF',
        description: '上传一张JPG图片。输出已锁定为PDF，你的JPG会以无损方式嵌入——PDF中的照片与原图逐位完全相同。',
      },
    },
    'convert-png-to-pdf': {
      name: '将PNG转换为PDF',
      h1: '在线免费将PNG转换为PDF',
      tagline: '把PNG截图、图形和扫描件变成整洁、清晰的PDF文档。',
      metaTitle: '在线免费将PNG转换为PDF | Media Manipulator',
      metaDescription: '免费在线PNG转PDF工具。将.png截图和图形变成清晰的无损PDF文档。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将PNG转换为PDF',
      ogDescription: '将PNG截图和图形变成清晰的无损PDF文档。免费，无需注册。',
      intro: 'PNG是截图、示意图以及带有清晰文字和锐利边缘的图形所用的格式。当你需要把它作为文档发送或打印时，PDF是合适的封装。Media Manipulator会将你的PNG无损嵌入PDF，让每一条边缘都保持锐利。',
      whatItDoes: [
        '将PNG图片包装为单页PDF文档。',
        '无损嵌入图片，让文字和线稿保持清晰。',
        '由于PDF页面不透明，透明区域会被拼合到白色上。',
        '生成在任何地方都能打开和打印的标准PDF。',
      ],
      flowSteps: [
        {
          title: '上传PNG',
          description: '拖入.png截图、示意图或图形。',
        },
        {
          title: '我们将其嵌入',
          description: 'PNG会被合成到白色页面上并无损嵌入。',
        },
        {
          title: '生成PDF',
          description: '组装一个标准的单页PDF。',
        },
        {
          title: '下载PDF',
          description: '保存一个清晰的.pdf，可直接分享或打印。',
        },
      ],
      advancedDetails: [
        'PNG会被解码，并以无损的zlib（Flate）压缩嵌入，因此清晰的文字和边缘会被精确保留——没有JPEG伪影。',
        '透明区域会变成白色，因为PDF页面没有Alpha通道。',
        '页面尺寸按图片以96 DPI计算，得到合理的默认物理尺寸。',
      ],
      whyItMatters: [
        '截图和示意图常常需要以PDF形式提交到工单和报告中。',
        '无损嵌入让小字号文字和细线保持清晰可读。',
        'PDF的打印效果可预期，而原始PNG可能会被意外缩放。',
      ],
      useCases: [
        {
          title: '错误报告',
          description: '把截图变成PDF，附加到工单中。',
        },
        {
          title: '示意图和图表',
          description: '把导出的图形包装成便于分享的PDF。',
        },
        {
          title: '扫描表格',
          description: '将PNG扫描件转换为整洁的PDF文档。',
        },
        {
          title: '打印',
          description: '从PNG获得清晰、可预期的打印效果。',
        },
      ],
      whyMediaManipulator: [
        '无损嵌入让文字和边缘锐利无比。',
        '输出已锁定为PDF，因此不存在设置出错的可能。',
      ],
      privacyNote: '你的PNG会在我们的服务器上无损嵌入单页PDF，透明区域会被拼合到白色上。不会向任何外部服务发送数据。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原文件绝不会被修改：你下载的是一个新文件。',
      faq: [
        {
          question: '如何免费将PNG转换为PDF？',
          answer: '在上方上传你的.png并点击转换——输出是一个单页PDF。完全免费，无需注册。',
        },
        {
          question: 'PNG转PDF能保持文字清晰吗？',
          answer: '能。PNG以无损方式嵌入，因此清晰的文字和线稿会保持锐利，没有JPEG式的伪影。',
        },
        {
          question: '透明PNG会怎样？',
          answer: '由于PDF页面不透明，透明区域会被拼合到白色背景上。可见内容保持不变。',
        },
        {
          question: '可以把多张PNG合并成一个PDF吗？',
          answer: '此工具每张图片生成一个PDF。如需多页文档，请逐张转换PNG，再用合并工具合并这些PDF。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'PNG以无损方式嵌入。由于PDF页面不透明，透明区域会被拼合到白色上。',
        ],
      },
      related: [
        {
          label: '将JPG转换为PDF',
          to: '/tools/convert-jpg-to-pdf',
          description: '专门的JPG → PDF转换器。',
        },
        {
          label: '图片转PDF',
          to: '/tools/image-to-pdf',
          description: '将任意图片格式转换为PDF。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在JPG、PNG、WebP、AVIF等格式之间转换。',
        },
        {
          label: 'PDF转PNG',
          to: '/tools/pdf-to-png',
          description: '反向转换：将PDF渲染为PNG。',
        },
        {
          label: 'PDF转换器',
          to: '/tools/pdf-converter',
          description: '完整的PDF转换中心。',
        },
      ],
      embed: {
        title: '将PNG转换为PDF',
        description: '上传一张PNG图片。输出已锁定为PDF，你的PNG会以无损方式嵌入，让文字和锐利边缘在页面上保持清晰。',
      },
    },
    'pdf-to-png': {
      name: 'PDF转PNG',
      h1: '在线免费将PDF转换为PNG',
      tagline: '将PDF的每一页渲染为清晰的无损PNG图片，适合文字、图表和编辑。',
      metaTitle: '在线免费将PDF转换为PNG | Media Manipulator',
      metaDescription: '免费在线PDF转PNG工具。将PDF的每一页渲染为清晰的无损PNG图片，并以ZIP下载。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将PDF转换为PNG',
      ogDescription: '将PDF的每一页渲染为清晰的无损PNG图片。免费、快速，无需注册。',
      intro: '当PDF页面包含清晰的文字、细线或你希望保持锐利的示意图时，PNG是最佳选择。Media Manipulator使用Poppler将每一页渲染为无损PNG，因此文字周围不会出现JPEG伪影。你可以选择所有页面或仅第一页，并设定分辨率。',
      whatItDoes: [
        '按你选择的DPI，将每一页PDF渲染为无损PNG图片。',
        '转换所有页面（以ZIP下载）或仅第一页（单张PNG）。',
        '多页输出的命名清晰明了：page-001.png、page-002.png，依此类推。',
        '借助无损PNG编码，让文字和线稿保持清晰。',
      ],
      flowSteps: [
        {
          title: '上传PDF',
          description: '拖入任意.pdf文档。',
        },
        {
          title: '选择页面和DPI',
          description: '所有页面或仅第一页；150 DPI是不错的默认值。',
        },
        {
          title: '渲染为PNG',
          description: 'Poppler将每一页栅格化为无损PNG。',
        },
        {
          title: '下载',
          description: '获取单张PNG，或每页一张PNG的ZIP。',
        },
      ],
      advancedDetails: [
        '渲染使用Poppler（pdftoppm），页面输出准确而忠实。',
        'PNG是无损的，因此当页面以文字、示意图或锐利图形为主时，它是比JPG更好的选择。',
        'DPI越高，图片越清晰、越大——150 DPI适合屏幕，300 DPI适合打印。',
        '渲染出的PNG为白色背景；PDF页面不透明，因此没有需要保留的透明度。',
      ],
      whyItMatters: [
        '无损PNG让小字号文字和细线保持清晰可读，没有任何伪影。',
        'PNG页面可以干净地放入编辑器、文档和设计工具。',
        '渲染出的页面能精确还原文档的视觉版式。',
      ],
      useCases: [
        {
          title: '示意图和原理图',
          description: '渲染技术页面，不产生伪影。',
        },
        {
          title: '标注和审阅',
          description: '在编辑器中打开清晰的页面进行注释。',
        },
        {
          title: '设计素材',
          description: '将干净的页面图形导入设计工具。',
        },
        {
          title: '缩略图',
          description: '为第一页生成清晰的PNG预览。',
        },
      ],
      whyMediaManipulator: [
        '无损PNG渲染让文字和边缘保持锐利。',
        '清晰整洁的ZIP打包，文件名带页码，便于排序。',
      ],
      privacyNote: '你的PDF页面会在我们的服务器上由Poppler渲染为PNG图片；多于一页时会打包成ZIP。不会向任何外部服务发送数据。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原文件绝不会被修改：你下载的是一个新文件。',
      faq: [
        {
          question: '如何免费将PDF转换为PNG？',
          answer: '在上方上传你的.pdf，选择所有页面或仅第一页，选择DPI，然后点击转换。',
        },
        {
          question: '为什么PDF要选PNG而不是JPG？',
          answer: 'PNG是无损的，能让文字、细线和示意图保持清晰，没有压缩伪影。如果你想让照片较多的页面文件更小，JPG更合适。',
        },
        {
          question: '我会得到一张图片还是多张？',
          answer: '选择“所有页面”可得到每页一张PNG的ZIP（page-001.png、…），选择“仅第一页”则得到单张PNG。',
        },
        {
          question: 'PNG有透明背景吗？',
          answer: '没有——PDF页面不透明，因此渲染出的页面为白色背景。没有需要保留的透明度。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '所有页面的输出以.zip交付；仅第一页的输出为单个.png。',
          '渲染出的页面为白色背景——PDF页面不透明，因此没有透明度。',
        ],
      },
      related: [
        {
          label: 'PDF转JPG',
          to: '/tools/pdf-to-jpg',
          description: '改为将PDF页面渲染为体积更小的JPG。',
        },
        {
          label: 'PDF转换器',
          to: '/tools/pdf-converter',
          description: '将PDF转换为图片，或将图片转换为PDF。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在不同格式之间转换渲染出的图片。',
        },
        {
          label: '图片转PDF',
          to: '/tools/image-to-pdf',
          description: '反向转换：把图片变成PDF。',
        },
      ],
      embed: {
        title: '将PDF转换为PNG',
        description: '上传一个PDF。每一页都会被渲染为无损PNG图片。选择“所有页面”可得到ZIP，选择“仅第一页”可得到单张PNG。选择渲染DPI可获得更清晰的输出。',
      },
    },
    'pdf-converter': {
      name: 'PDF转换器',
      h1: '免费在线PDF转换器',
      tagline: '把PDF转换为JPG或PNG图片，也可以把图片转为PDF，一站搞定。',
      metaTitle: '免费在线PDF转换器 | Media Manipulator',
      metaDescription: '免费在线PDF转换器。将PDF转换为JPG或PNG图片，或将图片转换为PDF。无需注册，无水印。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '免费在线PDF转换器',
      ogDescription: '将PDF转换为JPG/PNG图片，或将图片转换为PDF——全部集于一个免费工具。无需注册。',
      intro: 'PDF转换器在一处同时处理两个方向：将PDF的页面渲染为JPG或PNG图片，或将图片包装成PDF文档。上传PDF，你会看到图片导出选项；上传图片，你会得到图片转PDF。一切都在我们自己的服务器上运行。',
      whatItDoes: [
        '按你选择的分辨率，将PDF页面转换为JPG或PNG。',
        '将JPG、PNG及其他图片转换为单页PDF。',
        '将多页PDF导出打包为一个整洁的ZIP，内含编号图片。',
        '根据你上传的文件自动调整表单。',
      ],
      flowSteps: [
        {
          title: '上传文件',
          description: '拖入PDF，或JPG、PNG等图片。',
        },
        {
          title: '选择输出',
          description: '对于PDF，选择JPG/PNG、页面和DPI；对于图片，输出为PDF。',
        },
        {
          title: '转换',
          description: '我们在服务器上渲染或包装你的文件。',
        },
        {
          title: '下载',
          description: '保存PDF、单张图片，或页面图片的ZIP。',
        },
      ],
      advancedDetails: [
        'PDF → 图片的渲染使用Poppler（pdftoppm）；图片 → PDF会无损嵌入JPG，其他格式则使用无损Flate压缩。',
        '多页PDF导出以.zip交付，文件名为page-001/page-002，便于排序。',
        '图片转PDF按图片以96 DPI设定页面尺寸；PDF转图片默认为150 DPI，打印时最高支持300+。',
        '页数限制可防止处理超大PDF。',
      ],
      whyItMatters: [
        '一个工具涵盖两个最常见的PDF转换方向。',
        '无需根据转换方向去寻找另一个工具。',
        '在服务器端处理，无论你使用什么浏览器或设备，质量都始终如一。',
      ],
      useCases: [
        {
          title: '混合工作流',
          description: '在PDF→图片和图片→PDF之间切换，无需更换工具。',
        },
        {
          title: '文档准备',
          description: '把图片变成PDF，用于上传表单。',
        },
        {
          title: '内容再利用',
          description: '将PDF页面渲染为图片，用于幻灯片或社交媒体。',
        },
        {
          title: '快速预览',
          description: '从任意PDF生成第一页图片。',
        },
      ],
      whyMediaManipulator: [
        '两种转换方向集于一个自适应工具。',
        '无损的图片→PDF，以及准确的Poppler PDF→图片渲染。',
      ],
      privacyNote: '你的PDF会被逐页渲染为图片，或你的图片会被包装成PDF，均由我们服务器上的Poppler和ImageMagick完成。不会向任何外部服务发送数据。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原文件绝不会被修改：你下载的是一个新文件。',
      faq: [
        {
          question: 'PDF转换器能做什么？',
          answer: '它能将PDF页面转换为JPG或PNG图片，也能将图片（JPG、PNG等）转换为PDF文档——全部集于一个免费工具。',
        },
        {
          question: '它如何知道该往哪个方向转换？',
          answer: '它会根据你的上传自动调整：PDF会显示图片导出选项（格式、页面、DPI），而图片会被转换为PDF。',
        },
        {
          question: '可以将多页PDF转换为图片吗？',
          answer: '可以。选择“所有页面”，你会得到一个ZIP，每页一张图片，命名为page-001、page-002，依此类推。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '上传PDF即为PDF→图片；上传图片即为图片→PDF。表单会自动调整。',
          '所有页面的PDF导出以.zip交付，内含编号图片。',
        ],
      },
      related: [
        {
          label: 'PDF转JPG',
          to: '/tools/pdf-to-jpg',
          description: '将PDF页面渲染为JPG图片。',
        },
        {
          label: 'PDF转PNG',
          to: '/tools/pdf-to-png',
          description: '将PDF页面渲染为无损PNG图片。',
        },
        {
          label: '图片转PDF',
          to: '/tools/image-to-pdf',
          description: '把任意图片变成PDF。',
        },
        {
          label: '将JPG转换为PDF',
          to: '/tools/convert-jpg-to-pdf',
          description: '专门的JPG → PDF转换器。',
        },
        {
          label: '将PNG转换为PDF',
          to: '/tools/convert-png-to-pdf',
          description: '专门的PNG → PDF转换器。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在图片格式之间转换。',
        },
      ],
      embed: {
        title: '转换PDF或图片',
        description: '上传PDF可将其页面渲染为JPG或PNG图片，上传图片则可将其变成PDF。表单会根据你选择的文件自动调整。',
      },
    },
    'convert-heic-to-jpg': {
      name: '将HEIC转换为JPG',
      h1: '在线免费将HEIC转换为JPG',
      tagline: '把iPhone的HEIC照片转为通用的JPG文件，随处可开，随处可传。',
      metaTitle: '在线免费将HEIC转换为JPG | Media Manipulator',
      metaDescription: '免费在线HEIC转JPG工具。将iPhone的.heic/.heif照片转为兼容性极佳的JPG文件。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将HEIC转换为JPG',
      ogDescription: '将iPhone的HEIC照片转为兼容性极佳的JPG文件。免费、快速，无需注册。',
      intro: 'HEIC是iPhone为节省空间而使用的高效格式，但它在许多Windows电脑、网站或旧版应用上无法打开。Media Manipulator会将你的HEIC照片转换为JPG（一种在任何地方都能用的格式），并校正方向，采用你选择的质量。',
      whatItDoes: [
        '将Apple HEIC/HEIF照片转换为标准JPG。',
        '根据EXIF自动校正图片方向，竖拍照片不会横过来。',
        '让你选择JPG质量，在文件大小和保真度之间取得平衡。',
        '生成在任何设备、网站或应用上都能打开的JPG。',
      ],
      flowSteps: [
        {
          title: '上传HEIC',
          description: '拖入来自iPhone的.heic或.heif照片。',
        },
        {
          title: '自动校正方向',
          description: '我们读取EXIF方向信息，让照片保持正向。',
        },
        {
          title: '编码JPG',
          description: 'ImageMagick解码HEIC（libheif）并写出JPG。',
        },
        {
          title: '下载JPG',
          description: '保存一个兼容性极佳的.jpg文件。',
        },
      ],
      advancedDetails: [
        'HEIC解码依赖于带libheif委托库构建的ImageMagick。如果服务器不支持HEIC，工具会返回明确的错误，而不是损坏的文件。',
        '质量85–90是很好的默认值——HEIC本身已经很高效，因此高质量的JPG能让照片看起来完全一样。',
        'EXIF方向会在编码前应用，这解决了简单粗暴地转换HEIC时常见的“旋转了90°”问题。',
      ],
      whyItMatters: [
        'Windows、许多网页上传表单和旧版软件仍然无法打开HEIC。',
        '分享JPG可以确保接收者在任何设备上都能查看。',
        '大多数冲印店和电商平台要求JPG。',
      ],
      useCases: [
        {
          title: '分享iPhone照片',
          description: '发送在任何手机或电脑上都能打开的照片。',
        },
        {
          title: '网页上传',
          description: '满足拒绝HEIC的表单和网站。',
        },
        {
          title: '打印',
          description: '在下单冲印前先转换为JPG。',
        },
        {
          title: '在旧版应用中编辑',
          description: '在不支持HEIC的软件中打开你的照片。',
        },
      ],
      whyMediaManipulator: [
        '正确的自动方向校正——照片不会横过来。',
        '可控的质量，而不是固定的预设。',
      ],
      privacyNote: '你的HEIC照片会在我们的服务器上解码、转正，并保存为JPG。不会向任何外部服务发送数据。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原文件绝不会被修改：你下载的是一个新文件。',
      faq: [
        {
          question: '如何免费将HEIC转换为JPG？',
          answer: '在上方上传你的.heic照片，选择质量，然后点击转换。你会得到一个标准的.jpg。',
        },
        {
          question: '为什么我的HEIC照片在Windows上打不开？',
          answer: 'HEIC是Apple偏爱的格式，旧版Windows和许多应用都无法读取。转换为JPG后，照片在任何地方都能打开。',
        },
        {
          question: '照片会损失画质吗？',
          answer: 'JPG是有损格式，但在质量85–90下，几乎所有照片的转换结果看起来都与HEIC原图完全相同。',
        },
        {
          question: '为什么我以前转换的照片是旋转的？',
          answer: '简单粗暴的转换器会忽略EXIF方向。我们会自动校正图片方向，因此你的照片会以正确的朝向输出。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'HEIC解码需要服务器上带有libheif委托库的ImageMagick。',
        ],
      },
      related: [
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在JPG、PNG、WebP、AVIF等格式之间转换。',
        },
        {
          label: '将AVIF转换为JPG',
          to: '/tools/convert-avif-to-jpg',
          description: '将新一代AVIF照片转换为JPG。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '缩小JPG，用于网页。',
        },
        {
          label: '图片转换器教程',
          to: '/tutorials/image/getting-started',
          description: '逐一了解每个图片选项。',
        },
      ],
      embed: {
        title: '将HEIC转换为JPG',
        description: '上传来自iPhone的HEIC或HEIF照片。输出已锁定为JPG，并会自动校正方向以正向显示，质量由你选择。',
      },
    },
    'convert-avif-to-jpg': {
      name: '将AVIF转换为JPG',
      h1: '在线免费将AVIF转换为JPG',
      tagline: '把新一代AVIF图片转为通用的JPG文件，适用于不支持AVIF的应用和网站。',
      metaTitle: '在线免费将AVIF转换为JPG | Media Manipulator',
      metaDescription: '免费在线AVIF转JPG工具。将.avif图片转换为兼容性极佳的JPG文件，质量由你决定。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将AVIF转换为JPG',
      ogDescription: '将新一代AVIF图片转换为兼容性极佳的JPG文件。免费、快速、无需注册。',
      intro: 'AVIF是一种前沿的图片格式，文件体积非常小，但仍有许多应用、编辑器和上传表单无法打开它。Media Manipulator会将AVIF转换为JPG，让你的图片在任何地方都能使用。选择质量，然后下载即可。',
      whatItDoes: [
        '将AVIF图片转换为标准JPG。',
        '将所有透明区域拼合到背景上，因为JPG没有Alpha通道。',
        '可选择JPG质量，在文件大小与保真度之间取得你想要的平衡。',
        '生成可在任何设备或应用中打开的JPG。',
      ],
      flowSteps: [
        {
          title: '上传AVIF',
          description: '拖入一张.avif图片。',
        },
        {
          title: '选择JPG质量',
          description: '85是一个均衡的默认值。',
        },
        {
          title: '编码JPG',
          description: 'ImageMagick解码AVIF（libaom/libheif）并写出JPG。',
        },
        {
          title: '下载JPG',
          description: '保存兼容性极佳的.jpg文件。',
        },
      ],
      advancedDetails: [
        'AVIF解码依赖于带有AVIF委托库（libaom或libheif）的ImageMagick构建版本。如果服务器不支持AVIF，工具会返回明确的错误信息。',
        'AVIF支持透明度；转换为JPG时，透明区域会被拼合，因为JPG没有Alpha通道。如需保留透明度，请使用AVIF → PNG。',
        '对大多数图片而言，质量设为85–90时，JPG在视觉上与AVIF完全相同。',
      ],
      whyItMatters: [
        '许多应用和上传表单仍不支持AVIF。',
        'JPG能确保收件人打开这张图片。',
        '转换后，你下载的AVIF可以用在任何需要JPG的地方。',
      ],
      useCases: [
        {
          title: '保存网页图片',
          description: '将你下载的AVIF转换为可用的JPG。',
        },
        {
          title: '应用兼容性',
          description: '在不支持AVIF的软件中打开AVIF图片。',
        },
        {
          title: '上传',
          description: '满足只接受JPG的表单要求。',
        },
        {
          title: '打印',
          description: '为照片冲印店制作JPG。',
        },
      ],
      whyMediaManipulator: [
        '可自行控制质量，而不是千篇一律的预设。',
        '在我们自己的服务器上运行，不经第三方处理。',
      ],
      privacyNote: '你的AVIF会在我们的服务器上解码，并按你设定的质量重新编码为JPG。不会发送给任何外部服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原文件绝不会被修改：你下载的是一个新文件。',
      faq: [
        {
          question: '如何免费将AVIF转换为JPG？',
          answer: '在上方上传你的.avif图片，选择质量，然后点击转换。你会得到一个标准的.jpg文件。',
        },
        {
          question: '为什么我打不开AVIF文件？',
          answer: 'AVIF是较新的格式；许多应用、编辑器和网站尚未支持。转换为JPG后，图片在任何地方都能打开。',
        },
        {
          question: '透明度怎么办？',
          answer: 'JPG不支持透明度，因此AVIF中的透明区域会被拼合到背景上。如果需要保留透明度，请使用AVIF → PNG工具。',
        },
        {
          question: '会损失画质吗？',
          answer: '对大多数图片而言，质量设为85–90时，JPG看起来与AVIF基本相同。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'AVIF解码需要服务器上装有带AVIF委托库的ImageMagick。JPG输出中的透明度会被拼合。',
        ],
      },
      related: [
        {
          label: '将AVIF转换为PNG',
          to: '/tools/convert-avif-to-png',
          description: '改用PNG以保留透明度。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在JPG、PNG、WebP、AVIF等格式之间转换。',
        },
        {
          label: '将HEIC转换为JPG',
          to: '/tools/convert-heic-to-jpg',
          description: '将iPhone的HEIC照片转换为JPG。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '为网页缩小JPG体积。',
        },
      ],
      embed: {
        title: '将AVIF转换为JPG',
        description: '上传AVIF图片。输出格式锁定为JPG，因此你会得到一个所有应用、编辑器和上传表单都接受的文件，质量由你决定。',
      },
    },
    'convert-avif-to-png': {
      name: '将AVIF转换为PNG',
      h1: '在线免费将AVIF转换为PNG',
      tagline: '把AVIF图片转为无损PNG文件，随处可开，并完整保留透明度。',
      metaTitle: '在线免费将AVIF转换为PNG | Media Manipulator',
      metaDescription: '免费在线AVIF转PNG工具。将.avif图片转换为无损PNG文件，保留透明度，并可在任何编辑器中打开。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将AVIF转换为PNG',
      ogDescription: '将AVIF图片转换为保留透明度的无损PNG文件。免费、快速、无需注册。',
      intro: '当AVIF图片带有透明区域时（例如徽标或抠图），转换为JPG会将其拼合。PNG会保留Alpha通道且无损，因此是图形的理想目标格式。Media Manipulator将AVIF转换为PNG，并完整保留透明度。',
      whatItDoes: [
        '将AVIF图片转换为无损PNG。',
        '保留Alpha通道，透明的AVIF转换后依然透明。',
        '生成可在任何编辑器、看图软件或设计工具中打开的PNG。',
        'AVIF变为PNG时，图片会逐像素保留。',
      ],
      flowSteps: [
        {
          title: '上传AVIF',
          description: '拖入一张.avif图片，透明或不透明均可。',
        },
        {
          title: '解码AVIF',
          description: 'ImageMagick通过其AVIF委托库解码AVIF。',
        },
        {
          title: '编码PNG',
          description: '写出保留透明度的无损PNG。',
        },
        {
          title: '下载PNG',
          description: '保存保留透明度的.png文件。',
        },
      ],
      advancedDetails: [
        'AVIF解码依赖于带有AVIF委托库（libaom或libheif）的ImageMagick构建版本。如果服务器不支持AVIF，工具会返回明确的错误信息。',
        'AVIF中的透明度会保留为PNG的Alpha通道。',
        'PNG是无损格式，因此输出通常比源AVIF更大，这是换取通用兼容性和透明度的代价。',
      ],
      whyItMatters: [
        'PNG能保留JPG会破坏的透明度，这对徽标和抠图至关重要。',
        '有些编辑器和应用无法打开AVIF；PNG则随处可开。',
        'PNG是安全、无损的图形交换格式。',
      ],
      useCases: [
        {
          title: '透明徽标',
          description: '将透明的AVIF徽标转换为可用的PNG。',
        },
        {
          title: '设计交付',
          description: '为无法读取AVIF的工具提供PNG。',
        },
        {
          title: '编辑',
          description: '在编辑器中无损打开图片。',
        },
        {
          title: '网页素材',
          description: '为旧版浏览器保留PNG备用图片。',
        },
      ],
      whyMediaManipulator: [
        '自动保留透明度。',
        '无损PNG输出，适合图形工作。',
      ],
      privacyNote: '你的AVIF会在我们的服务器上解码，并保存为完整保留透明度的无损PNG。不会发送给任何外部服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原文件绝不会被修改：你下载的是一个新文件。',
      faq: [
        {
          question: '如何免费将AVIF转换为PNG？',
          answer: '在上方上传你的.avif图片并点击转换，输出为保留透明度的无损.png。',
        },
        {
          question: 'AVIF转PNG会保留透明度吗？',
          answer: '会。PNG支持Alpha通道，因此透明的AVIF在转换后依然透明。',
        },
        {
          question: '我的AVIF应该转成PNG还是JPG？',
          answer: '需要透明度或无损画质时（徽标、图形），选择PNG。如果图片是不含透明区域的照片，想要最小的文件就选择JPG。',
        },
        {
          question: '为什么PNG比AVIF大？',
          answer: 'AVIF是一种高效的压缩格式，而PNG是无损的，因此PNG通常更大。这是正常现象。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'AVIF解码需要带AVIF委托库的ImageMagick。PNG输出会保留透明度。',
        ],
      },
      related: [
        {
          label: '将AVIF转换为JPG',
          to: '/tools/convert-avif-to-jpg',
          description: '改为将AVIF转换为小巧的JPG。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在JPG、PNG、WebP、AVIF等格式之间转换。',
        },
        {
          label: '将HEIC转换为JPG',
          to: '/tools/convert-heic-to-jpg',
          description: '将iPhone的HEIC照片转换为JPG。',
        },
        {
          label: '移除图片背景',
          to: '/tools/remove-background-from-image',
          description: '自动制作透明PNG抠图。',
        },
      ],
      embed: {
        title: '将AVIF转换为PNG',
        description: '上传AVIF图片。输出格式锁定为PNG，因此透明度会被保留，文件可在任何编辑器或看图软件中无损打开。',
      },
    },
    'convert-svg-to-png': {
      name: '将SVG转换为PNG',
      h1: '在线免费将SVG转换为PNG',
      tagline: '把SVG图标和徽标栅格化为任意尺寸的PNG图片，用于上传、幻灯片和应用。',
      metaTitle: '在线免费将SVG转换为PNG | Media Manipulator',
      metaDescription: '免费在线SVG转PNG工具。将SVG图标和徽标栅格化为你所选尺寸的PNG图片。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将SVG转换为PNG',
      ogDescription: '将SVG图标和徽标栅格化为任意尺寸的PNG图片。免费、快速、无需注册。',
      intro: 'SVG是完美的矢量图，但许多平台（社交网络、电商平台、幻灯片工具和应用）只接受PNG等位图。Media Manipulator会将你的SVG栅格化为清晰、保留透明度的PNG，尺寸由你选择。SVG会被视为不受信任的输入，由安全的渲染器处理。',
      whatItDoes: [
        '将SVG矢量文件栅格化为PNG图片。',
        '可设置目标宽度和/或高度，以控制输出分辨率。',
        '在PNG中保留SVG的透明度。',
        '使用不会获取外部网络资源的安全栅格化器进行渲染。',
      ],
      flowSteps: [
        {
          title: '上传SVG',
          description: '拖入一个.svg图标、徽标或插图。',
        },
        {
          title: '设置尺寸（可选）',
          description: '选择宽度/高度，或使用SVG的原始尺寸。',
        },
        {
          title: '栅格化',
          description: 'SVG会在我们的服务器上渲染为像素图像。',
        },
        {
          title: '下载PNG',
          description: '保存清晰、保留透明度的.png。',
        },
      ],
      advancedDetails: [
        '渲染时优先使用rsvg-convert（librsvg），它默认不加载远程资源；ImageMagick则作为经过加固的备用方案。',
        '由于SVG是矢量格式，你可以在任何分辨率下渲染而不损失画质；选择更大的宽度可获得更清晰的输出。',
        '上传的SVG被视为不受信任的输入，并在禁用网络访问的情况下处理，以避免SSRF/外部请求风险。',
      ],
      whyItMatters: [
        '大多数上传表单和社交平台拒绝SVG，但接受PNG。',
        '按所选尺寸栅格化，可确保该用途下的输出清晰锐利。',
        'PNG保留了图标和徽标所依赖的透明度。',
      ],
      useCases: [
        {
          title: '社交平台与上传',
          description: '将SVG徽标变成平台接受的PNG。',
        },
        {
          title: '演示文稿',
          description: '将清晰的图标PNG放入幻灯片。',
        },
        {
          title: '应用素材',
          description: '按应用所需的精确尺寸导出PNG。',
        },
        {
          title: '电子邮件',
          description: '在不支持SVG的地方使用PNG。',
        },
      ],
      whyMediaManipulator: [
        '以任意尺寸渲染且不损失画质：矢量图可以完美缩放。',
        '安全处理SVG，禁用外部请求。',
      ],
      privacyNote: '你的SVG由我们服务器上的librsvg渲染为PNG，其中引用的外部图片和字体不会被获取。不会发送给任何外部服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原文件绝不会被修改：你下载的是一个新文件。',
      faq: [
        {
          question: '如何免费将SVG转换为PNG？',
          answer: '在上方上传你的.svg，可选择设置宽度或高度，然后点击转换。你会得到一个清晰的.png。',
        },
        {
          question: 'PNG会是多大尺寸？',
          answer: '默认使用SVG的原始尺寸。设置宽度和/或高度可渲染得更大或更小，矢量图缩放不会损失画质。',
        },
        {
          question: 'PNG会保留透明度吗？',
          answer: '会。SVG中的透明区域会在PNG中保留为透明。',
        },
        {
          question: '上传SVG安全吗？',
          answer: '安全。我们将SVG视为不受信任的输入，并在禁用外部网络请求的情况下渲染，因此其中嵌入的远程引用无法被加载。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '使用rsvg-convert（首选）或经过加固的ImageMagick备用方案渲染。SVG中的外部网络请求已被禁用。',
        ],
      },
      related: [
        {
          label: '将PNG转换为SVG',
          to: '/tools/convert-png-to-svg',
          description: '反向操作：将PNG矢量化为SVG。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在JPG、PNG、WebP、AVIF等格式之间转换。',
        },
        {
          label: 'PNG转ICO',
          to: '/tools/png-to-ico',
          description: '将PNG变成网站图标。',
        },
      ],
      embed: {
        title: '将SVG转换为PNG',
        description: '上传SVG。输出格式锁定为PNG。可选择设置宽度或高度来控制渲染分辨率；留空则使用SVG的原始尺寸。',
      },
    },
    'convert-png-to-svg': {
      name: '将PNG转换为SVG',
      h1: '在线免费将PNG转换为SVG',
      tagline: '用potrace把PNG中的徽标、图标和线稿矢量化为真正可缩放的SVG路径。',
      metaTitle: '在线免费将PNG转换为SVG | Media Manipulator',
      metaDescription: '免费在线PNG转SVG矢量化工具。将徽标、图标和线稿描摹为真正可缩放的SVG路径。最适合简单图形，不适合照片。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将PNG转换为SVG',
      ogDescription: '将PNG中的徽标、图标和线稿矢量化为真正可缩放的SVG路径。免费、无需注册。',
      intro: '真正的PNG转SVG意味着将图片描摹为真实的矢量路径，可缩放到任意尺寸而不出现像素化。Media Manipulator使用potrace矢量化你的PNG，非常适合徽标、图标、签名和黑白线稿。这是真正的矢量化，而不是把PNG藏在SVG里。它并非为将照片转换为干净的矢量图而设计。',
      whatItDoes: [
        '使用potrace将PNG描摹为真实、可缩放的SVG矢量路径。',
        '先将图片简化为干净的黑白位图，再对形状进行矢量化。',
        '可调整黑白阈值，捕捉更多或更少的细节。',
        '输出真正的.svg，而不是包在<image>标签里的位图。',
      ],
      flowSteps: [
        {
          title: '上传PNG',
          description: '拖入徽标、图标、签名或线稿PNG。',
        },
        {
          title: '设置阈值',
          description: '选择黑白分界点来控制细节。',
        },
        {
          title: '描摹为矢量',
          description: 'ImageMagick准备位图；potrace描摹路径。',
        },
        {
          title: '下载SVG',
          description: '保存真正可缩放的.svg文件。',
        },
      ],
      advancedDetails: [
        '处理流程会先将PNG拼合为二值位图（ImageMagick阈值），然后运行potrace生成平滑的贝塞尔矢量路径。',
        '矢量化最适合高对比度的简单图形：徽标、图标、字母组合标志、签名和黑白线稿。',
        '它无法忠实还原照片或复杂渐变：描摹照片会产生庞大、杂乱的路径，而不是干净的矢量图。',
        '提高阈值可捕捉更精细/更浅的细节；降低阈值则只保留最粗重的形状。',
      ],
      whyItMatters: [
        '矢量徽标可缩放到任意尺寸，从网站图标到广告牌，都不会像素化。',
        '对于简单图形，SVG体积很小，并可在Illustrator或Inkscape等矢量工具中编辑。',
        '从PNG徽标恢复出矢量图，省去了从头重新制作的麻烦。',
      ],
      useCases: [
        {
          title: '恢复徽标',
          description: '将已没有源文件的PNG徽标矢量化。',
        },
        {
          title: '图标和字母组合标志',
          description: '将简单图标变成可缩放的SVG。',
        },
        {
          title: '签名',
          description: '将扫描的签名矢量化，方便干净地重复使用。',
        },
        {
          title: '线稿',
          description: '将黑白作品描摹为可编辑的路径。',
        },
      ],
      whyMediaManipulator: [
        '真正的potrace矢量化，坦诚说明它擅长什么（以及不擅长什么）。',
        '阈值控制，让你精确调整描摹效果。',
      ],
      privacyNote: '你的图片会在我们的服务器上被简化为黑白，并由potrace描摹为矢量路径。不会发送给任何外部服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原文件绝不会被修改：你下载的是一个新文件。',
      faq: [
        {
          question: '如何免费将PNG转换为SVG？',
          answer: '在上方上传你的.png，根据需要调整阈值，然后点击转换。你会得到一个真正的矢量.svg。',
        },
        {
          question: '这是真正的矢量化，还是只是包装过的PNG？',
          answer: '是真正的矢量化。我们用potrace将图片描摹为实际的SVG路径，而不是把PNG嵌入SVG就草草了事。',
        },
        {
          question: '它能矢量化我的照片吗？',
          answer: '效果不好。矢量化是为徽标、图标、签名和线稿设计的。照片和复杂渐变会产生庞大、杂乱的路径，而不是干净的矢量图。',
        },
        {
          question: '阈值控制有什么作用？',
          answer: '它设置描摹前的黑白分界点。提高阈值可捕捉更多（更浅的）细节；降低阈值则只保留最粗重的形状。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '矢量化需要服务器上装有potrace。最适合徽标/图标/线稿，不适合照片。',
        ],
      },
      related: [
        {
          label: '将SVG转换为PNG',
          to: '/tools/convert-svg-to-png',
          description: '反向操作：将SVG栅格化为PNG。',
        },
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在JPG、PNG、WebP、AVIF等格式之间转换。',
        },
        {
          label: 'PNG转ICO',
          to: '/tools/png-to-ico',
          description: '将PNG变成网站图标。',
        },
      ],
      embed: {
        title: '将PNG矢量化为SVG',
        description: '上传PNG。输出格式锁定为SVG，由真正的矢量化（potrace）生成，而不是包在SVG里的位图。调整黑白阈值可捕捉更多或更少的细节。最适合徽标、图标、签名和线稿。',
      },
    },
    'png-to-ico': {
      name: 'PNG转ICO',
      h1: '在线免费将PNG转换为ICO',
      tagline: '把PNG变成真正的多尺寸.ico文件，用作网站图标和Windows应用图标。',
      metaTitle: '在线免费将PNG转换为ICO | Media Manipulator',
      metaDescription: '免费在线PNG转ICO工具。为网站和Windows图标生成真正的多尺寸.ico网站图标（16–256px）。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将PNG转换为ICO',
      ogDescription: '根据PNG生成真正的多尺寸.ico网站图标。免费、快速、无需注册。',
      intro: '网站图标必须是包含多种尺寸的真正.ico文件，这样浏览器和Windows才能挑选合适的尺寸。Media Manipulator会根据你的PNG生成真正的多尺寸ICO（而不是改了扩展名的文件），打包从16到256 px的标准图标尺寸。',
      whatItDoes: [
        '根据PNG图片生成真正的.ico容器。',
        '将多种尺寸（16、32、48、64、128、256 px）打包进一个文件。',
        '保留透明度，让图标在任何背景上都干净利落。',
        '生成浏览器和Windows认可的网站图标/应用图标文件。',
      ],
      flowSteps: [
        {
          title: '上传PNG',
          description: '拖入PNG：正方形图片能得到最好的图标。',
        },
        {
          title: '生成尺寸',
          description: '我们会根据你的图片渲染每种标准图标尺寸。',
        },
        {
          title: '打包ICO',
          description: '各尺寸会被打包进一个真正的.ico容器。',
        },
        {
          title: '下载ICO',
          description: '保存favicon.ico，用于你的网站或应用。',
        },
      ],
      advancedDetails: [
        'ICO使用ImageMagick的图标自动缩放功能构建，生成真正的多图像容器，而不是改了扩展名的PNG。',
        '包含多种尺寸，浏览器和Windows就能为每种场景（标签页、任务栏、桌面）挑选最清晰的图标。',
        '为获得最干净的效果，请从256×256或更大的正方形PNG开始，这样每种尺寸都能清晰地缩小。',
      ],
      whyItMatters: [
        '浏览器期望的是真正的.ico网站图标；改了扩展名的PNG可能无法使用或显得模糊。',
        '多尺寸图标从16px的标签页到256px的桌面快捷方式都保持清晰。',
        'Windows应用图标必须使用.ico格式。',
      ],
      useCases: [
        {
          title: '网站图标',
          description: '为网站的标签页图标生成favicon.ico。',
        },
        {
          title: 'Windows应用图标',
          description: '为桌面应用程序创建.ico。',
        },
        {
          title: '快捷方式',
          description: '为桌面快捷方式制作清晰的图标。',
        },
        {
          title: '品牌',
          description: '将徽标PNG变成规范的图标文件。',
        },
      ],
      whyMediaManipulator: [
        '真正的多尺寸ICO，而不是改了扩展名的PNG。',
        '保留透明度，图标干净利落。',
      ],
      privacyNote: '你的图片会在我们的服务器上由ImageMagick缩放为每种标准图标尺寸，并打包成一个.ico文件。不会发送给任何外部服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原文件绝不会被修改：你下载的是一个新文件。',
      faq: [
        {
          question: '如何免费将PNG转换为ICO？',
          answer: '在上方上传你的.png并点击转换，你会得到一个真正的多尺寸.ico。',
        },
        {
          question: '这是真正的ICO，还是改了扩展名的PNG？',
          answer: '是真正的ICO。我们会生成多种图标尺寸，并将它们打包进真正的.ico容器，这正是浏览器和Windows所期望的。',
        },
        {
          question: '包含哪些尺寸？',
          answer: '标准的网站图标尺寸：16、32、48、64、128和256 px。浏览器和Windows会为每种场景挑选最合适的尺寸。',
        },
        {
          question: '什么样的图片效果最好？',
          answer: '256×256或更大的正方形PNG效果最清晰，因为每个较小的尺寸都能从它干净地缩小。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '会生成多尺寸ICO（16/32/48/64/128/256 px）。从正方形图片开始可获得最佳效果。',
        ],
      },
      related: [
        {
          label: '图片转换器',
          to: '/tools/image-converter',
          description: '在JPG、PNG、WebP、AVIF等格式之间转换。',
        },
        {
          label: '将SVG转换为PNG',
          to: '/tools/convert-svg-to-png',
          description: '在制作图标之前先栅格化SVG徽标。',
        },
        {
          label: '图片尺寸调整',
          to: '/tools/image-resizer',
          description: '在生成图标之前先把图片调整为正方形。',
        },
        {
          label: '移除图片背景',
          to: '/tools/remove-background-from-image',
          description: '制作透明的图标源图。',
        },
      ],
      embed: {
        title: '将PNG转换为ICO',
        description: '上传PNG（正方形图片效果最好）。输出格式锁定为ICO，并生成包含16、32、48、64、128和256 px版本的真正多尺寸图标。',
      },
    },
    'svg-converter': {
      name: 'SVG转换器',
      tagline: '将SVG栅格化为PNG，或把PNG描摹为SVG：以SVG为起点的图片转换器。',
    },
    'convert-wav-to-mp3': {
      name: '将WAV转换为MP3',
      h1: '在线将WAV转换为MP3',
      tagline: '把体积庞大的无损WAV录音压缩成兼容性极佳的MP3文件，便于播客发布、分享和存储。',
      metaTitle: '在线将WAV转换为MP3（免费） | Media Manipulator',
      metaDescription: '免费在线WAV转MP3工具。将无损.wav录音压缩为更小的MP3文件，比特率由你选择。',
      ogTitle: '在线将WAV转换为MP3',
      ogDescription: '将WAV录音压缩为兼容性广泛的MP3文件，比特率由你选择。',
      intro: 'WAV文件无损但体积庞大。MP3是兼容性极佳的压缩音频格式：每部手机、笔记本电脑和音乐应用都能播放。Media Manipulator会按你选择的比特率将WAV重新编码为MP3，你只需牺牲一点点音质，就能换来小5–10倍的文件。',
      whatItDoes: [
        '按你选择的比特率将WAV录音重新编码为MP3。',
        '支持自定义采样率、声道和比特率（128至320 kbps）。',
        '保留响度，并避免不必要的重复重采样。',
        '输出带ID3标签的标准.mp3文件。',
      ],
      flowSteps: [
        {
          title: '上传WAV',
          description: '从电脑中拖入任意.wav文件。',
        },
        {
          title: '选择比特率',
          description: '人声用192 kbps，音乐用256–320 kbps。',
        },
        {
          title: '编码MP3',
          description: 'FFmpeg按所选设置编码出干净的MP3。',
        },
        {
          title: '下载MP3',
          description: '保存兼容性广泛的.mp3。',
        },
      ],
      advancedDetails: [
        '底层通过FFmpeg使用LAME式编码。',
        'MP3是有损编解码器：音乐的音质在256 kbps左右就达到顶峰。语音内容在128–192 kbps下听起来就很好。',
        '如果需要更小的无损文件，请改用FLAC或ALAC。如果播放器由你掌控，可使用Opus（封装在OGG中）获得最小的现代有损文件。',
      ],
      whyItMatters: [
        '在合理的比特率下，WAV文件比同等的MP3大5–10倍。',
        'MP3可在所有设备上播放，没有编解码器兼容性问题。',
        '播客、有声书和音乐平台通常要求或更倾向于上传MP3。',
      ],
      useCases: [
        {
          title: '播客节目',
          description: '用WAV制作母带，以96–128 kbps单声道MP3发布。',
        },
        {
          title: '语音备忘录',
          description: '在分享或归档前缩小手机录音。',
        },
        {
          title: '音乐小样',
          description: '以256–320 kbps发送混音，附件体积不会过大。',
        },
        {
          title: '嵌入网站',
          description: '使用MP3确保兼容性：所有浏览器都能原生播放。',
        },
      ],
      whyMediaManipulator: [
        '精确选择比特率、采样率和声道布局。',
        '免费、无需注册、无水印，输出完全归你所有。',
        '与整套工具相同的保留期限隐私模式。',
      ],
      privacyNote: '你的WAV会在我们的服务器上由FFmpeg按你选择的比特率编码为MP3。不涉及任何外部音频服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你会得到一个新文件；上传的文件本身不会被更改。',
      faq: [
        {
          question: '我应该选择什么比特率？',
          answer: '192 kbps是均衡的默认值。语音/播客使用128 kbps，音乐使用256–320 kbps。',
        },
        {
          question: '音质会下降吗？',
          answer: '会略有下降，因为MP3是有损格式。在256+ kbps下，大多数听众无法分辨它与WAV原文件的区别。',
        },
        {
          question: '我可以将其他格式转换为MP3吗？',
          answer: '可以，音频转换器支持FLAC、M4A/AAC、OGG、OPUS等格式。请使用通用的音频转换器工具。',
        },
        {
          question: '有文件大小限制吗？',
          answer: '接受合理的文件大小。对于很长的录音，建议先进行裁剪。',
        },
      ],
      related: [
        {
          label: '音频转换器',
          to: '/tools/audio-converter',
          description: '在任意两种音频格式之间转换。',
        },
        {
          label: '提取歌曲人声',
          to: '/tools/isolate-vocals-from-song',
          description: '从音乐音轨中提取人声。',
        },
        {
          label: '音频转换器教程',
          to: '/tutorials/audio/getting-started',
          description: '逐一了解每个音频选项，包括AI工具。',
        },
      ],
      embed: {
        title: '将WAV转换为MP3',
        description: '上传WAV文件并选择MP3作为输出格式。192 kbps是适合人声的默认值；音乐请使用256–320 kbps。',
      },
    },
    'isolate-vocals-from-song': {
      name: '提取歌曲人声',
      h1: '在线提取歌曲人声',
      tagline: '从音乐中提取人声，用于混音、翻唱、转写和分析。请仅用于你拥有权利的音乐。',
      metaTitle: '在线提取歌曲人声（免费） | Media Manipulator',
      metaDescription: '免费在线人声分离。将歌曲中的人声提取为干净的分轨，用于混音、翻唱、转写或分析。',
      ogTitle: '在线提取歌曲人声',
      ogDescription: '将歌曲中的人声提取为干净的独立分轨，用于混音、翻唱、转写或分析。',
      intro: '基于AI的音源分离可以从成品混音中提取出人声音轨，非常适合混音、翻唱、卡拉OK准备或歌词转写。Media Manipulator在我们自己的GPU服务器上运行分离。结果是一个单独的人声分轨，你可以下载并在任何地方使用，前提是你对源素材拥有相应的权利。',
      whatItDoes: [
        '运行基于AI的音源分离，从音乐录音中提取人声音轨。',
        '输出单个分离出的人声分轨，格式与你的文件相同（MP3仍为MP3），也可以选择FLAC、WAV或MP3。',
        '可与降噪和均衡器等音频清理工具搭配使用，获得精致的效果。',
        '支持WAV、MP3、FLAC、M4A、OGG、OPUS等多种输入格式。',
      ],
      flowSteps: [
        {
          title: '上传歌曲',
          description: '拖入任意常见的音频文件，其中人声与音乐混在一起。',
        },
        {
          title: '运行AI分离',
          description: '本地GPU模型将人声从混音的其余部分中分离出来。',
        },
        {
          title: '清理（可选）',
          description: '应用降噪、均衡器或增益来润色分轨。',
        },
        {
          title: '下载人声分轨',
          description: '保存分离出的人声：默认与你的文件格式相同，也可选择FLAC、WAV或MP3。',
        },
      ],
      advancedDetails: [
        '音源分离本身就不完美：混响、和声和重度效果会渗入输出。',
        'MP3或其他压缩文件会以原格式返回（MP3为320 kbps）。无损文件（WAV、FLAC、AIFF）会以FLAC返回。FLAC和WAV保留的细节最多，便于在DAW中进一步编辑；WAV体积最大。',
        '如果只需要伴奏（卡拉OK），请改用音频转换器中专门的“消除人声/卡拉OK”模式。',
      ],
      whyItMatters: [
        '制作人和混音师可以围绕现有人声创作新曲目。',
        '歌手可以更准确地转写歌词或旋律。',
        '教育工作者和音频工程师利用分离出的分轨研究混音技巧。',
      ],
      useCases: [
        {
          title: '混音和翻唱',
          description: '围绕分离出的人声制作新的伴奏。',
        },
        {
          title: '歌词和旋律转写',
          description: '为人工或AI转写提供更清晰的信号。',
        },
        {
          title: '卡拉OK准备',
          description: '将分离出的人声与单独的伴奏版本搭配使用。',
        },
        {
          title: '音频工程练习',
          description: '在商业录音上研究混音技巧。',
        },
      ],
      whyMediaManipulator: [
        '本地GPU运行的AI：没有任何第三方AI提供商会接触你的音频。',
        '一次上传即可同时进行均衡器、降噪和裁剪。',
        '免费、无需注册，输出无水印。',
      ],
      privacyNote: '你的歌曲会在我们自己的GPU服务器上由Demucs拆分为分轨，只有人声分轨会返回给你。不涉及任何外部音频服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你会得到一个新文件；上传的文件本身不会被更改。',
      faq: [
        {
          question: '分离结果完全干净吗？',
          answer: '没有任何音源分离工具是完美的。可能会出现一些瑕疵，尤其是在混响较重和有和声的部分。如果你打算之后在DAW中清理分轨，请选择FLAC或WAV输出。',
        },
        {
          question: '支持哪些音频格式？',
          answer: 'WAV、MP3、FLAC、M4A/AAC、OGG、OPUS以及大多数其他常见音频格式。',
        },
        {
          question: '我可以对受版权保护的音乐使用这个工具吗？',
          answer: '只有在你拥有权利、获得许可，或在你所在司法管辖区的合理使用范围内时才可以。你需要对输出的使用方式负责。',
        },
        {
          question: '在哪里可以只获取伴奏？',
          answer: '使用音频转换器中的“消除人声/卡拉OK”AI模式：上传方式相同，输出不同。',
        },
      ],
      related: [
        {
          label: '音频转换器',
          to: '/tools/audio-converter',
          description: '分离后转换并清理分轨。',
        },
        {
          label: '将WAV转换为MP3',
          to: '/tools/convert-wav-to-mp3',
          description: '将WAV分轨压缩为MP3以便分享。',
        },
        {
          label: '音频转换器教程',
          to: '/tutorials/audio/getting-started',
          description: '逐一了解每个音频选项，包括AI工具。',
        },
      ],
      embed: {
        title: '提取人声',
        description: '上传歌曲并点击按钮：已预选“人声分离”。结果会以与你的文件相同的格式返回（MP3仍为MP3）；如需无损，请在“输出格式”下选择FLAC或WAV。',
      },
    },
    'image-converter': {
      name: '图片转换器',
      h1: '在线免费图片转换器',
      tagline: '在JPG、PNG、WebP、AVIF、GIF等格式之间转换，可控制质量、调整尺寸、裁剪和元数据。',
      metaTitle: '在线免费图片转换器 | Media Manipulator',
      metaDescription: '免费在线图片转换器，支持JPG、PNG、WebP、AVIF、GIF和HEIC。一次上传即可调整尺寸、压缩、裁剪和清除元数据。',
      ogTitle: '在线免费图片转换器',
      ogDescription: '转换JPG、PNG、WebP、AVIF、GIF和HEIC。一次上传即可调整尺寸、压缩和清除元数据。',
      intro: '同一张图片往往需要用在多个地方：你的网站、演示文稿、印刷品、电商商品页。每个地方偏好的格式都不同。Media Manipulator在一处处理所有常见图片格式，并可精细控制质量、尺寸调整和元数据。',
      whatItDoes: [
        '在JPG、PNG、WebP、AVIF、GIF、HEIC等格式之间转换。',
        '一次完成调整尺寸、裁剪、旋转和应用视觉滤镜。',
        '按需清除或保留EXIF/IPTC/XMP元数据。',
        'AI工具：人脸模糊、背景移除、放大以及文字/个人信息遮盖。',
      ],
      flowSteps: [
        {
          title: '上传图片',
          description: '拖入任何常见图片文件。',
        },
        {
          title: '选择输出格式',
          description: 'JPG、PNG、WebP、AVIF、GIF。',
        },
        {
          title: '调整质量和元数据',
          description: '调整尺寸、裁剪或清除EXIF。',
        },
        {
          title: '下载',
          description: '保存转换后的图片。',
        },
      ],
      advancedDetails: [
        'WebP和AVIF生成的网页文件最小；在相同视觉质量下，AVIF往往比WebP更小。',
        'PNG是无损格式，支持透明度，非常适合UI素材和截图。',
        'JPG是照片最稳妥的交换格式。',
      ],
      whyItMatters: [
        '不同的平台和工具接受不同的图片格式。',
        '更小的图片文件能让页面加载更快，而Google会给加载更快的页面更高的排名。',
        '分享之前清除元数据可以保护你的隐私。',
      ],
      useCases: [
        {
          title: '网页优化',
          description: '将PNG照片转换为WebP/AVIF，以减轻页面体积。',
        },
        {
          title: '跨平台分享',
          description: '将iPhone的HEIC照片转换为JPG。',
        },
        {
          title: '电商商品页',
          description: '发布之前清除元数据并调整尺寸。',
        },
        {
          title: '印刷与演示',
          description: '以高质量预设输出JPG。',
        },
      ],
      whyMediaManipulator: [
        '一次上传即可完成转换、调整尺寸、裁剪、滤镜、AI和元数据处理。',
        '免费，无需注册，无水印。',
        'AI工具运行在我们自己的GPU服务器上。',
      ],
      privacyNote: '你的图片在我们的服务器上由ImageMagick转换，并按你的要求调整尺寸或裁剪。不会有任何内容发送到外部服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。原始文件绝不会被修改：你下载的是一个新文件。',
      faq: [
        {
          question: '哪种图片格式最好？',
          answer: '视情况而定：网页用WebP/AVIF，需要透明度用PNG，追求兼容性用JPG。',
        },
        {
          question: '可以批量转换吗？',
          answer: '免费工具一次转换一张图片。请依次运行多次转换。',
        },
        {
          question: '它会清除元数据吗？',
          answer: '只有当你把“元数据模式”设为“清除所有元数据”时才会。默认会保留元数据。',
        },
        {
          question: '支持HEIC吗？',
          answer: '支持。iPhone的HEIC照片可以顺利转换为JPG、PNG或WebP。',
        },
      ],
      related: [
        {
          label: '图片尺寸调整',
          to: '/tools/image-resizer',
          description: '调整为精确的像素尺寸。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '为网页缩小图片文件体积。',
        },
        {
          label: '图片转PDF',
          to: '/tools/image-to-pdf',
          description: '将图片封装为PDF文档。',
        },
        {
          label: 'PDF转换器',
          to: '/tools/pdf-converter',
          description: '将PDF转换为图片，或反向转换。',
        },
        {
          label: '将HEIC转换为JPG',
          to: '/tools/convert-heic-to-jpg',
          description: '将iPhone的HEIC照片转换为JPG。',
        },
        {
          label: '移除图片背景',
          to: '/tools/remove-background-from-image',
          description: '自动擦除背景，生成透明PNG。',
        },
        {
          label: '将WebP转换为JPG',
          to: '/tools/convert-webp-to-jpg',
          description: '专门的WebP → JPG转换器。',
        },
        {
          label: '图片转换器教程',
          to: '/tutorials/image/getting-started',
          description: '逐一讲解每个选项的完整教程。',
        },
      ],
      embed: {
        title: '转换图片',
        description: '上传任意图片，然后选择输出格式、质量以及调整尺寸/裁剪设置。JPG适合照片，PNG保留透明度，WebP/AVIF生成的网页文件最小。',
      },
    },
    'video-converter': {
      name: '视频转换器',
      h1: '在线免费视频转换器',
      tagline: '在MP4、WebM、MOV、AVI、MKV等格式之间转换，可完全控制编解码器、分辨率和音频。',
      metaTitle: '在线免费视频转换器 | Media Manipulator',
      metaDescription: '免费在线视频转换器，支持MP4、WebM、MOV、AVI、MKV等格式。可选择编解码器、比特率、分辨率和音频设置。',
      ogTitle: '在线免费视频转换器',
      ogDescription: '转换MP4、WebM、MOV、AVI、MKV、FLV、WMV等格式。可选择编解码器、比特率和音频设置。',
      intro: '不同的平台需要不同的视频格式。在Mac上用MOV剪辑，以MP4或WebM发布到网上，用MKV归档。Media Manipulator在一处处理所有常见的视频容器和编解码器，并可完全控制比特率、分辨率和音频。',
      whatItDoes: [
        '在MP4、WebM、MOV、AVI、MKV、FLV、WMV和ProRes之间转换。',
        '选择编解码器（H.264、H.265、VP9、ProRes、DNxHD）。',
        '调整尺寸、更改帧率、裁剪并重新编码音频。',
        '可选应用滤镜和调色。',
      ],
      flowSteps: [
        {
          title: '上传视频',
          description: '拖入任何常见容器格式的视频。',
        },
        {
          title: '选择目标格式',
          description: 'MP4、WebM、MOV、AVI、MKV。',
        },
        {
          title: '调整编解码器和质量',
          description: '比特率、分辨率、音频。',
        },
        {
          title: '下载',
          description: '保存转换后的视频。',
        },
      ],
      advancedDetails: [
        'MP4中的H.264是到处都能播放的稳妥默认选择。',
        'H.265（HEVC）和VP9在相同视觉质量下文件小约25–50%，但需要较新的播放器。',
        '用于剪辑交接时，ProRes（MOV封装）或DNxHD（MOV/MXF封装）能保留最多的画质。',
      ],
      whyItMatters: [
        '剪辑软件、浏览器和社交平台各自偏好不同的格式。',
        '更小的视频文件能缩短页面加载时间并降低带宽成本。',
        '重新编码可以修正错误的编解码器或无法播放的文件。',
      ],
      useCases: [
        {
          title: 'MOV → MP4',
          description: '让苹果设备拍摄的素材在任何地方都能播放。',
        },
        {
          title: 'AVI → MP4',
          description: '让旧的存档视频焕然一新。',
        },
        {
          title: 'MP4 → WebM',
          description: '为现代浏览器缩小网页视频。',
        },
        {
          title: '剪辑交接',
          description: '导出ProRes或DNxHD，用于高质量剪辑。',
        },
      ],
      whyMediaManipulator: [
        '一次上传即可完全控制编解码器、比特率和音频。',
        '同一个文件还可以进行AI转录。',
        '免费，无需注册，无水印。',
      ],
      privacyNote: '你的视频在我们的服务器上由FFmpeg重新编码为你选择的容器和编解码器。处理在我们自己的服务器上运行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '哪种输出格式最好？',
          answer: '追求兼容性选择H.264编码的MP4，想要最小的网页文件选择VP9编码的WebM。',
        },
        {
          question: '可以在转换前裁剪吗？',
          answer: '可以，表单中的裁剪部分可以让你在重新编码前把片段剪短。',
        },
        {
          question: '音频会保持同步吗？',
          answer: '会。FFmpeg会保持音画同步。如果你更改帧率或速度，音频会相应地重新采样。',
        },
        {
          question: '有文件大小限制吗？',
          answer: '免费版可能会拒绝非常大的文件。请先尝试降低分辨率。',
        },
      ],
      related: [
        {
          label: '将MOV转换为MP4',
          to: '/tools/convert-mov-to-mp4',
          description: '让QuickTime/iPhone素材在任何地方都能播放。',
        },
        {
          label: '将WebM转换为MP4',
          to: '/tools/convert-webm-to-mp4',
          description: '把网页视频变成可编辑的MP4。',
        },
        {
          label: '将MP4转换为WebM',
          to: '/tools/convert-mp4-to-webm',
          description: '把MP4压缩为适合网页的VP9 WebM。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '专门用于缩小视频文件的压缩工具。',
        },
        {
          label: '将视频转换为GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: '把短片段变成动态GIF。',
        },
        {
          label: '从视频中提取音频',
          to: '/tools/extract-audio-from-video',
          description: '将音轨保存为MP3、WAV或M4A。',
        },
        {
          label: '视频剪辑',
          to: '/tools/video-trimmer',
          description: '无损地把片段剪成你想要的部分。',
        },
        {
          label: '调整视频尺寸',
          to: '/tools/resize-video',
          description: '将分辨率改为1080p、720p或自定义尺寸。',
        },
        {
          label: '旋转视频',
          to: '/tools/rotate-video',
          description: '修正横置或上下颠倒的素材。',
        },
        {
          label: '视频转录',
          to: '/tools/transcribe-video',
          description: '将视频中的语音提取为文本或VTT字幕。',
        },
        {
          label: 'AI插帧',
          to: '/tools/ai-frame-interpolation',
          description: '用AI生成的帧把视频帧率提升到48、60或120 FPS。',
        },
        {
          label: '将视频转码为HLS',
          to: '/tools/transcode-to-hls',
          description: '从任意视频生成自适应HLS包。',
        },
        {
          label: '将视频转码为DASH',
          to: '/tools/transcode-to-dash',
          description: '从任意视频生成MPEG-DASH AV1/VP9包。',
        },
        {
          label: '视频转换器教程',
          to: '/tutorials/video/getting-started',
          description: '逐一讲解每个选项的完整教程。',
        },
      ],
      embed: {
        title: '转换视频',
        description: '上传任意视频，然后选择目标容器/编解码器。“中”质量预设是不错的默认选择。MP4到处都能播放；WebM在现代浏览器中文件更小。',
      },
    },
    'mp4-converter': {
      name: 'MP4转换器',
      tagline: '将视频转换为MP4：已预选MP4的视频转换器。',
    },
    'convert-mov-to-mp4': {
      name: '将MOV转换为MP4',
      h1: '在线免费将MOV转换为MP4',
      tagline: '把QuickTime和iPhone的.mov文件变成通用的MP4，随处可播，随处可传。',
      metaTitle: '在线免费将MOV转换为MP4 | Media Manipulator',
      metaDescription: '免费在线MOV转MP4工具。将QuickTime和iPhone的.mov视频转换为随处可播的MP4。无水印，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将MOV转换为MP4',
      ogDescription: '将QuickTime / iPhone的MOV文件转换为通用的MP4，可在任何设备上上传和播放。',
      intro: 'MOV是Apple的QuickTime容器格式，iPhone、Mac和许多相机默认都用它录制。它在Apple生态内表现出色，但在Windows、Android或某些上传表单中可能无法播放。将MOV转换为MP4会把同样的H.264视频和AAC音频放进一个全世界通用的容器中，通常看不出任何画质变化。',
      whatItDoes: [
        '将QuickTime / iPhone的.mov文件转换为MP4。',
        '输出锁定为MP4（H.264 + AAC），确保结果随处可播。',
        '添加-pix_fmt yuv420p和+faststart，让MP4能在浏览器中播放并即时开始。',
        '在同一次上传中即可剪辑MOV、调整其尺寸或选择质量预设。',
      ],
      flowSteps: [
        {
          title: '上传你的MOV',
          description: '放入来自iPhone、Mac或相机的.mov文件。',
        },
        {
          title: '输出锁定为MP4',
          description: '无需选择格式——此工具已设定为MP4。',
        },
        {
          title: '转换',
          description: '我们将视频重新封装或重新编码为干净的MP4。',
        },
        {
          title: '下载',
          description: '保存你的MP4，可用于任何设备或平台。',
        },
      ],
      advancedDetails: [
        '大多数MOV文件本身就包含H.264视频，因此转换速度很快，在高质量设置下几乎无损。',
        '我们强制使用yuv420p色度，让MP4能在Safari以及拒绝4:2:2/4:4:4视频的社交平台上播放。',
        '如果你的MOV包含ProRes，转换器会将其转码为H.264——选择高质量可保留最多细节。',
      ],
      whyItMatters: [
        '在Windows或Android上，MOV往往需要额外的编解码器才能播放。',
        '许多上传表单和编辑器接受MP4，却拒绝MOV。',
        '要把iPhone视频分享给任何人，MP4是最稳妥的格式。',
      ],
      useCases: [
        {
          title: 'iPhone视频',
          description: '转换iPhone录制的.mov，使其能在Windows电脑上播放。',
        },
        {
          title: '上传到网页',
          description: '把QuickTime导出的文件变成网站可接受的MP4。',
        },
        {
          title: '发送给非Apple用户',
          description: '与Android和Windows用户分享视频，不会出现播放问题。',
        },
        {
          title: '编辑器兼容',
          description: '为难以处理原始MOV的编辑器提供MP4。',
        },
      ],
      whyMediaManipulator: [
        '输出锁定为经过验证的MP4配置——无需猜测设置。',
        '服务器端FFmpeg同样能处理封装在MOV中的ProRes和HEVC源文件。',
      ],
      privacyNote: '你的MOV由我们服务器上的FFmpeg重新编码为H.264和AAC的MP4。处理在我们自己的服务器上运行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '如何将MOV转换为MP4？',
          answer: '上传你的.mov文件并点击转换——输出已设定为MP4，无需再做其他选择。',
        },
        {
          question: '将MOV转换为MP4会损失画质吗？',
          answer: '大多数MOV文件使用H.264，因此在高质量设置下，重新编码在视觉上几乎无损。较低的预设会牺牲一些画质以换取更小的文件。',
        },
        {
          question: '为什么我的iPhone MOV无法在Windows上播放？',
          answer: 'Windows可能缺少QuickTime/HEVC编解码器。采用H.264 + AAC的MP4无需额外软件即可播放。',
        },
        {
          question: 'QuickTime转MP4是一回事吗？',
          answer: '是的——QuickTime文件使用.mov容器，因此将QuickTime转换为MP4正是这个工具的用途。',
        },
        {
          question: '有水印或需要注册吗？',
          answer: '没有水印，也无需账号。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '输出锁定为MP4（H.264 + AAC、yuv420p、+faststart）。',
        ],
      },
      related: [
        {
          label: '视频转换器',
          to: '/tools/video-converter',
          description: '将任意视频转换为MP4。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '缩小MP4，便于通过电子邮件发送或用于网页。',
        },
        {
          label: '将视频转换为GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: '剪出片段并导出动态GIF。',
        },
        {
          label: '视频转换器教程',
          to: '/tutorials/video/getting-started',
          description: '逐步了解剪辑、尺寸调整和质量选项。',
        },
      ],
      embed: {
        title: '将MOV转换为MP4',
        description: '上传你的.mov文件。此工具的输出已锁定为MP4（H.264 + AAC），只需上传并转换。',
      },
    },
    'convert-webm-to-mp4': {
      name: '将WebM转换为MP4',
      h1: '在线免费将WebM转换为MP4',
      tagline: '把为网页优化的.webm视频变成MP4，可在任何设备上编辑、分享和播放。',
      metaTitle: '在线免费将WebM转换为MP4 | Media Manipulator',
      metaDescription: '免费在线WebM转MP4工具。将.webm（VP8/VP9）视频转换为MP4（H.264 + AAC），供无法打开WebM的编辑器和设备使用。无水印，无需注册。',
      ogTitle: '在线免费将WebM转换为MP4',
      ogDescription: '将.webm视频转换为编辑器、手机和电视都能播放的通用MP4。',
      intro: 'WebM是为网页打造的现代开放容器格式——文件小巧，非常适合浏览器视频。但许多视频编辑器、旧设备和即时通讯应用无法打开WebM。将WebM转换为MP4会把VP8/VP9视频重新编码为H.264，把音频重新编码为AAC，得到一个可在Premiere、Resolve、手机和电视上使用的文件。',
      whatItDoes: [
        '将.webm（VP8/VP9 + Vorbis/Opus）视频转换为MP4。',
        '输出锁定为MP4（H.264 + AAC），兼容性最大化。',
        '添加yuv420p和+faststart，让MP4能在所有浏览器中播放并即时开始。',
        'WebM屏幕录像在转换为MP4的过程中可以剪辑或调整尺寸。',
      ],
      flowSteps: [
        {
          title: '上传你的WebM',
          description: '放入从网上下载或由录屏软件生成的.webm文件。',
        },
        {
          title: '输出锁定为MP4',
          description: '此工具已预设为MP4——无需任何配置。',
        },
        {
          title: '转换',
          description: '我们将VP8/VP9转码为H.264 + AAC。',
        },
        {
          title: '下载',
          description: '保存MP4，可在任何地方编辑或播放。',
        },
      ],
      advancedDetails: [
        'WebM使用VP8/VP9视频，大多数编辑器无法导入；MP4/H.264则能顺利导入所有非线性编辑软件。',
        '我们强制使用yuv420p，让MP4能在Safari和社交平台上播放。',
        '如果你其实想要更小的网页文件，可以使用反向的MP4转WebM工具，它会生成VP9 WebM。',
      ],
      whyItMatters: [
        '大多数桌面编辑器无法导入WebM，却原生支持MP4。',
        '一些手机、电视和聊天应用拒绝播放WebM。',
        '对于以WebM格式下载的视频，MP4是稳妥的交付格式。',
      ],
      useCases: [
        {
          title: '编辑下载的视频',
          description: '将.webm片段以MP4形式导入Premiere或Resolve。',
        },
        {
          title: '屏幕录像',
          description: '将WebM屏幕录像转换为便于分享的MP4。',
        },
        {
          title: '在旧设备上播放',
          description: '让WebM文件能在不支持它的电视或手机上播放。',
        },
        {
          title: '即时通讯应用',
          description: '向只接受MP4、不接受WebM的应用发送视频。',
        },
      ],
      whyMediaManipulator: [
        '服务器端FFmpeg能可靠地解码VP8和VP9。',
        '输出锁定为经过验证的MP4配置。',
      ],
      privacyNote: '你的WebM由我们服务器上的FFmpeg从VP8或VP9重新编码为H.264 MP4。处理在我们自己的服务器上运行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '如何将WebM转换为MP4？',
          answer: '上传你的.webm文件并点击转换——输出已设定为MP4。',
        },
        {
          question: '为什么我的编辑器打不开WebM？',
          answer: '大多数编辑器不支持导入VP8/VP9。转换为MP4（H.264）即可解决导入问题。',
        },
        {
          question: '文件会变大吗？',
          answer: '在相同画质下，MP4/H.264可能比VP9 WebM略大。如果在意文件大小，请选择较低的质量预设。',
        },
        {
          question: '会保留音频吗？',
          answer: '会——Vorbis/Opus音频会重新编码为AAC，并保持同步。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '输出锁定为MP4（H.264 + AAC、yuv420p、+faststart）。',
        ],
      },
      related: [
        {
          label: '视频转换器',
          to: '/tools/video-converter',
          description: '将任意视频转换为MP4。',
        },
        {
          label: '将MP4转换为WebM',
          to: '/tools/convert-mp4-to-webm',
          description: '反向转换——生成小巧的VP9 WebM。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '缩小MP4，便于分享。',
        },
      ],
      embed: {
        title: '将WebM转换为MP4',
        description: '上传你的.webm文件。此工具的输出已锁定为MP4（H.264 + AAC），只需上传并转换。',
      },
    },
    'convert-avi-to-mp4': {
      name: '将AVI转换为MP4',
      h1: '在线免费将AVI转换为MP4',
      tagline: '把老旧的.avi视频升级为体积小巧的MP4，手机、浏览器和电视都能播放。',
      metaTitle: '在线免费将AVI转换为MP4 | Media Manipulator',
      metaDescription: '免费在线AVI转MP4工具。将老旧的.avi（Xvid/DivX）视频转换为随处可播的MP4（H.264 + AAC）。无水印，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将AVI转换为MP4',
      ogDescription: '将老旧的.avi视频转换为现代、紧凑的MP4，可在任何设备上播放。',
      intro: 'AVI是DivX/Xvid时代的经典Windows容器格式。这类文件往往体积庞大，所用的编解码器在现代手机、浏览器和电视上已不再支持。将AVI转换为MP4会把视频重新编码为高效的H.264，把音频重新编码为AAC，生成一个更小的文件，可在你如今拥有的任何设备上播放。',
      whatItDoes: [
        '将老旧的.avi（Xvid、DivX、MJPEG等）转换为MP4。',
        '输出锁定为MP4（H.264 + AAC），适合现代播放。',
        '生成的文件通常明显小于AVI源文件。',
        '老旧的AVI可以在转换的同时剪短并缩放。',
      ],
      flowSteps: [
        {
          title: '上传你的AVI',
          description: '放入来自存档或相机的老旧.avi文件。',
        },
        {
          title: '输出锁定为MP4',
          description: '已预设为MP4——无需任何配置。',
        },
        {
          title: '转换',
          description: '我们将其重新编码为H.264 + AAC。',
        },
        {
          title: '下载',
          description: '保存更小、更现代的MP4。',
        },
      ],
      advancedDetails: [
        'AVI通常使用Xvid/DivX（MPEG-4 Part 2）；H.264的效率大约是其两倍，因此MP4通常小得多。',
        '我们强制使用yuv420p，让结果能在浏览器和社交平台上播放。',
        '隔行扫描的AVI采集素材可借助完整视频转换器中的去隔行选项获得更好的效果。',
      ],
      whyItMatters: [
        'AVI文件体积大，而且在现代设备上越来越难以播放。',
        'MP4/H.264体积更小，随处可播。',
        '将旧存档转换为MP4，可让它们在未来依然可用。',
      ],
      useCases: [
        {
          title: '旧视频存档',
          description: '将摄像机录像或DVD翻录的AVI升级为MP4。',
        },
        {
          title: '释放空间',
          description: '将庞大的AVI缩小为更小的MP4。',
        },
        {
          title: '手机和电视播放',
          description: '让AVI能在已不再支持AVI的设备上播放。',
        },
        {
          title: '上传到网页',
          description: '把AVI变成网站可接受的MP4。',
        },
      ],
      whyMediaManipulator: [
        '服务器端FFmpeg能解码其他工具无法处理的老旧AVI编解码器。',
        '输出锁定为经过验证的MP4配置。',
      ],
      privacyNote: '你的AVI由我们服务器上的FFmpeg重新编码为现代的H.264 MP4。处理在我们自己的服务器上运行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '如何将AVI转换为MP4？',
          answer: '上传你的.avi文件并点击转换——输出已设定为MP4。',
        },
        {
          question: 'MP4会比AVI小吗？',
          answer: '通常会。H.264比大多数AVI所用的Xvid/DivX编解码器高效得多。',
        },
        {
          question: '支持老旧的DivX/Xvid AVI吗？',
          answer: '支持——FFmpeg能解码常见的AVI编解码器，并将其重新编码为H.264。',
        },
        {
          question: '会损失画质吗？',
          answer: '重新编码是有损的，但在高质量设置下差异极小，而且文件依然更小。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '输出锁定为MP4（H.264 + AAC、yuv420p、+faststart）。',
        ],
      },
      related: [
        {
          label: '视频转换器',
          to: '/tools/video-converter',
          description: '将任意视频转换为MP4。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '进一步缩小MP4。',
        },
        {
          label: '视频转换器教程',
          to: '/tutorials/video/getting-started',
          description: '逐步了解剪辑、尺寸调整和去隔行。',
        },
      ],
      embed: {
        title: '将AVI转换为MP4',
        description: '上传你的.avi文件。此工具的输出已锁定为MP4（H.264 + AAC），只需上传并转换。',
      },
    },
    'convert-mkv-to-mp4': {
      name: '将MKV转换为MP4',
      h1: '在线免费将MKV转换为MP4',
      tagline: '把Matroska的.mkv文件变成MP4，在不支持MKV的设备上也能串流、上传和播放。',
      metaTitle: '在线免费将MKV转换为MP4 | Media Manipulator',
      metaDescription: '免费在线MKV转MP4工具。将Matroska .mkv视频转换为MP4（H.264 + AAC），供无法播放MKV的设备和网站使用。无水印，无需注册。',
      ogTitle: '在线免费将MKV转换为MP4',
      ogDescription: '将Matroska .mkv视频转换为随处可播放、可上传的通用MP4。',
      intro: 'MKV（Matroska）是一种灵活的容器格式，常用于高质量视频，但许多手机、浏览器、智能电视和上传表单都无法播放它。将MKV转换为MP4会把视频放进这些设备能识别的容器中。Media Manipulator会重新编码为H.264 + AAC，让结果能顺利播放和上传。',
      whatItDoes: [
        '将Matroska .mkv文件转换为MP4。',
        '输出锁定为MP4（H.264 + AAC），广泛支持各类设备。',
        '添加yuv420p和+faststart，让MP4能流式播放并即时开始。',
        '在写入MP4之前，可以剪辑MKV剧集或更改其尺寸。',
      ],
      flowSteps: [
        {
          title: '上传你的MKV',
          description: '放入.mkv文件。',
        },
        {
          title: '输出锁定为MP4',
          description: '此工具已预设为MP4。',
        },
        {
          title: '转换',
          description: '我们将视频转封装或转码为MP4。',
        },
        {
          title: '下载',
          description: '保存随处可播的MP4。',
        },
      ],
      advancedDetails: [
        '如果MKV本身已包含H.264 + AAC，转换速度很快，且在视觉上无损。',
        '我们强制使用yuv420p，让MP4能在Safari和社交平台上播放。',
        'MKV可以携带多条字幕轨和音轨；转换器会保留主视频和第一条音轨。',
      ],
      whyItMatters: [
        '许多设备和网站根本不支持MKV。',
        'MP4是分享和上传的稳妥容器。',
        '转换后，你的高质量视频在任何地方都能使用。',
      ],
      useCases: [
        {
          title: '手机和电视播放',
          description: '让MKV能在拒绝它的设备上播放。',
        },
        {
          title: '上传到网页',
          description: '把MKV变成网站可接受的MP4。',
        },
        {
          title: '交给编辑器',
          description: '将MP4导入难以处理MKV的编辑器。',
        },
        {
          title: '统一片库',
          description: '让下载的MKV与你的MP4收藏保持一致。',
        },
      ],
      whyMediaManipulator: [
        '服务器端FFmpeg能处理包含多条轨道的MKV。',
        '输出锁定为经过验证的MP4配置。',
      ],
      privacyNote: '你的MKV由我们服务器上的FFmpeg重新编码为手机和浏览器都能播放的MP4。处理在我们自己的服务器上运行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '如何将MKV转换为MP4？',
          answer: '上传你的.mkv文件并点击转换——输出已设定为MP4。',
        },
        {
          question: '将MKV转换为MP4会损失画质吗？',
          answer: '如果MKV本身使用H.264，在高质量设置下结果在视觉上无损。否则就是一次正常的有损重新编码。',
        },
        {
          question: '额外的音轨或字幕轨会怎样？',
          answer: '转换器会保留主视频和第一条音轨。如需多轨道处理，请联系我们，我们可以研究轨道选择功能。',
        },
        {
          question: '为什么我的MKV无法播放？',
          answer: '许多手机、电视、浏览器和网站不支持MKV容器，即使其中的编解码器很常见。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '输出锁定为MP4（H.264 + AAC、yuv420p、+faststart）。保留主视频和第一条音轨。',
        ],
      },
      related: [
        {
          label: '视频转换器',
          to: '/tools/video-converter',
          description: '将任意视频转换为MP4。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '缩小MP4，便于分享。',
        },
        {
          label: '视频转换器教程',
          to: '/tutorials/video/getting-started',
          description: '逐一了解每个选项。',
        },
      ],
      embed: {
        title: '将MKV转换为MP4',
        description: '上传你的.mkv文件。此工具的输出已锁定为MP4（H.264 + AAC），只需上传并转换。',
      },
    },
    'convert-mp4-to-webm': {
      name: '将MP4转换为WebM',
      h1: '在线免费将MP4转换为WebM',
      tagline: '把MP4重新编码为更小的开放格式VP9 WebM，非常适合加载迅速的网页视频。',
      metaTitle: '在线免费将MP4转换为WebM | Media Manipulator',
      metaDescription: '免费在线MP4转WebM工具。将MP4重新编码为VP9 + Opus的WebM，让网页视频更小、更快。无水印，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费将MP4转换为WebM',
      ogDescription: '将MP4转换为更小的开放格式VP9 WebM，非常适合嵌入现代网页。',
      intro: 'WebM是为网页打造的开放视频格式。借助VP9视频和Opus音频，它能在相同画质下提供比MP4更小的文件，这意味着嵌入视频的页面加载更快。如果播放器由你掌控，将MP4转换为WebM就是正确的选择——所有现代浏览器都原生支持它。',
      whatItDoes: [
        '将MP4（H.264）转换为WebM（VP9 + Opus）。',
        '输出锁定为WebM，确保开放网页嵌入的一致性。',
        '在相同视觉质量下，生成的文件通常比MP4更小。',
        '在生成WebM之前，可以缩短或缩小片段，并选择质量预设。',
      ],
      flowSteps: [
        {
          title: '上传你的MP4',
          description: '放入.mp4文件。',
        },
        {
          title: '输出锁定为WebM',
          description: '此工具已预设为WebM（VP9 + Opus）。',
        },
        {
          title: '转换',
          description: '我们将H.264重新编码为VP9，将AAC重新编码为Opus。',
        },
        {
          title: '下载',
          description: '保存更小的.webm，用于网页。',
        },
      ],
      advancedDetails: [
        'WebM输出在可用时使用VP9视频和Opus音频；在不支持VP9/Opus的FFmpeg版本上则回退为VP8 + Vorbis。',
        'VP9编码比H.264慢，但在画质相当时文件可小约25-50%。',
        '在<video>标签中同时提供WebM和MP4两个源，让浏览器选择它支持的最佳格式。',
      ],
      whyItMatters: [
        '网页视频更小，意味着页面更快、带宽费用更低。',
        'WebM免版税，所有现代浏览器都支持。',
        'WebM + MP4组合几乎覆盖所有浏览器，且文件尽可能小。',
      ],
      useCases: [
        {
          title: '网站首屏视频',
          description: '提供小巧、加载迅速的背景或首屏片段。',
        },
        {
          title: '开放网页嵌入',
          description: '嵌入视频，无需担心专有编解码器问题。',
        },
        {
          title: '节省带宽',
          description: '为高流量页面减小传输体积。',
        },
        {
          title: 'HTML5 <video>',
          description: '提供WebM源，并以MP4作为备用。',
        },
      ],
      whyMediaManipulator: [
        'VP9 + Opus编码，并可自动回退为VP8 + Vorbis。',
        '输出锁定为WebM，结果可预期。',
      ],
      privacyNote: '你的视频由我们服务器上的FFmpeg重新编码为VP9 WebM。处理在我们自己的服务器上运行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '如何将MP4转换为WebM？',
          answer: '上传你的.mp4文件并点击转换——输出已设定为WebM。',
        },
        {
          question: 'WebM比MP4小吗？',
          answer: '在相同视觉质量下，VP9 WebM通常比H.264 MP4小25-50%。',
        },
        {
          question: '所有浏览器都支持WebM吗？',
          answer: '所有现代浏览器都支持。对于旧版浏览器，请在<video>标签中提供MP4备用源。',
        },
        {
          question: '为什么WebM编码更慢？',
          answer: 'VP9的计算量比H.264更大。回报是更小的文件。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '输出锁定为WebM（VP9 + Opus；如果VP9/Opus不可用，则为VP8 + Vorbis）。',
        ],
      },
      related: [
        {
          label: '将WebM转换为MP4',
          to: '/tools/convert-webm-to-mp4',
          description: '反向转换。',
        },
        {
          label: '视频转换器',
          to: '/tools/video-converter',
          description: '将任意视频转换为MP4。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '在不更改容器的情况下缩小视频。',
        },
      ],
      embed: {
        title: '将MP4转换为WebM',
        description: '上传你的.mp4文件。此工具的输出已锁定为WebM（VP9 + Opus），只需上传并转换。',
      },
    },
    'mp4-to-mp3': {
      name: '将MP4转换为MP3',
      tagline: '把MP4中的音频保存为MP3：输入MP4、输出MP3的“从视频中提取音频”。',
    },
    'video-to-mp3': {
      name: '将视频转换为MP3',
      tagline: '把视频中的音轨提取为MP3：与“从视频中提取音频”是同一个工具。',
    },
    'mp4-to-gif': {
      name: '将MP4转换为GIF',
      tagline: '把MP4片段做成循环播放的GIF：输入固定为MP4的动态GIF转换器。',
    },
    'video-to-gif': {
      name: '将视频转换为GIF',
      tagline: '把任意常见格式的短片变成循环播放的GIF：与动态GIF转换器是同一个工具。',
    },
    'gif-converter': {
      name: 'GIF转换器',
      tagline: '用视频片段制作并微调动态GIF：换了个名字的动态GIF转换器。',
    },
    'video-compressor': {
      name: '视频压缩器',
      tagline: '用压缩预设缩小视频：与“压缩视频”是同一个工具。',
    },
    'compress-mp4': {
      name: '压缩MP4',
      tagline: '让MP4变得更小，并仍保持MP4格式：容器固定的“压缩视频”。',
    },
    'mp4-trimmer': {
      name: 'MP4剪辑工具',
      tagline: '输入和输出都固定为MP4的视频剪辑工具。',
    },
    'video-cutter': {
      name: '视频裁切器',
      tagline: '保留视频中的一段，去掉其余部分：与视频剪辑工具是同一个工具。',
    },
    'cut-video-online': {
      name: '在线剪切视频',
      tagline: '直接在浏览器中从视频里剪出一段，无需安装任何软件：换了个名字的视频剪辑工具。',
    },
    'crop-video': {
      name: '裁剪视频',
      h1: '在线免费裁剪视频',
      tagline: '裁掉视频的边缘，无需剪辑软件即可调整画面构图或宽高比。',
      metaTitle: '在线免费裁剪视频 | Media Manipulator',
      metaDescription: '免费在线视频裁剪工具。裁掉视频边缘以重新构图或更改宽高比。输出MP4，无水印，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费裁剪视频',
      ogDescription: '裁掉视频边缘以重新构图或更改宽高比。免费，无水印。',
      intro: '裁剪会去掉视频的外围边缘——适用于重新构图、去除黑边或水印，或为某个平台更改宽高比。Media Manipulator视频裁剪工具接受一个像素矩形（从哪里开始、范围多大），并只将该区域导出为干净的MP4。',
      whatItDoes: [
        '将视频裁剪为你以像素指定的矩形。',
        '去除黑边、边缘、水印或不需要的区域。',
        '帮助你为社交平台重新构图为方形或竖屏。',
        '默认导出MP4（H.264 + AAC）。',
      ],
      flowSteps: [
        {
          title: '上传你的视频',
          description: '要裁剪的MP4、MOV、MKV、WebM、AVI或M4V。',
        },
        {
          title: '输入裁剪矩形',
          description: '设置要保留区域的X/Y偏移以及宽度/高度。',
        },
        {
          title: '裁剪',
          description: 'FFmpeg精确裁剪到该区域并重新编码。',
        },
        {
          title: '下载',
          description: '保存裁剪后的视频。',
        },
      ],
      advancedDetails: [
        '裁剪坐标以像素为单位，从左上角算起：X/Y是保留区域的起点，宽度/高度是它的尺寸。',
        '裁剪会重新编码视频；MP4输出使用H.264 + AAC + yuv420p + faststart。',
        '如需在预览上进行像素级精确构图，首页上的完整转换器提供可视化裁剪叠加层。',
      ],
      whyItMatters: [
        '裁剪无需重拍即可重新构图。',
        '它能去除黑边（上下黑边/左右黑边）和不需要的边缘。',
        '更改宽高比（例如改为9:16）有助于视频适配平台。',
      ],
      useCases: [
        {
          title: '改为竖屏',
          description: '将横屏片段裁剪为9:16，用于Reels/Shorts/TikTok。',
        },
        {
          title: '去除黑边',
          description: '裁掉上下黑边。',
        },
        {
          title: '隐藏水印',
          description: '裁掉角落的徽标或时间戳。',
        },
        {
          title: '重新构图主体',
          description: '收紧画面，聚焦重要内容。',
        },
      ],
      whyMediaManipulator: [
        '在服务器端用FFmpeg进行精确的像素裁剪。',
        '干净的MP4输出，无水印。',
      ],
      privacyNote: '你的视频会被裁剪为你绘制的矩形，并由我们服务器上的FFmpeg重新编码。处理在我们自己的服务器上运行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '如何裁剪视频？',
          answer: '上传视频，输入要保留的矩形（以像素为单位的X/Y偏移和宽度/高度），然后下载裁剪后的视频。',
        },
        {
          question: '可以裁剪为方形或竖屏宽高比吗？',
          answer: '可以——将宽度和高度设置为你想要的比例（例如方形设为相等的值，9:16则让高度大于宽度）。',
        },
        {
          question: '裁剪会降低画质吗？',
          answer: '裁剪会重新编码，但在我们的默认质量下损失极小。',
        },
        {
          question: '可以裁掉水印吗？',
          answer: '可以，前提是水印靠近边缘——裁剪画面将其排除即可。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '裁剪会重新编码；MP4输出使用H.264 + AAC + yuv420p + faststart。',
        ],
      },
      related: [
        {
          label: '调整视频尺寸',
          to: '/tools/resize-video',
          description: '更改分辨率，而不是裁剪。',
        },
        {
          label: '旋转视频',
          to: '/tools/rotate-video',
          description: '修正横置或倒置的视频。',
        },
        {
          label: '视频转换器',
          to: '/tools/video-converter',
          description: '在不同视频格式之间转换。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '缩小裁剪后的视频。',
        },
      ],
      embed: {
        title: '裁剪视频',
        description: '上传视频并输入要保留的矩形（以像素为单位的偏移 + 宽度/高度）。我们会精确裁剪到该区域并导出MP4。',
      },
    },
    'resize-video': {
      name: '调整视频尺寸',
      h1: '在线免费调整视频尺寸',
      tagline: '更改视频分辨率，可缩放到1080p、720p、480p，或任意自定义宽度和高度。',
      metaTitle: '在线免费调整视频尺寸 | Media Manipulator',
      metaDescription: '免费在线视频尺寸调整工具。将视频分辨率更改为1080p、720p、480p或自定义尺寸。输出MP4，无水印，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费调整视频尺寸',
      ogDescription: '将视频分辨率更改为1080p、720p、480p或自定义尺寸。免费，无水印。',
      intro: '调整尺寸会改变视频的分辨率——把4K片段变成1080p，缩小到720p用于网页，或达到某个平台要求的精确像素尺寸。Media Manipulator视频尺寸调整工具会将视频缩放到你选择的尺寸，默认保持宽高比，并导出干净的MP4。',
      whatItDoes: [
        '将视频缩放到目标宽度和/或高度。',
        '默认保持宽高比（留空其中一项即可自动缩放）。',
        '缩小以减小文件，或放大以适配目标尺寸。',
        '默认导出MP4（H.264 + AAC）。',
      ],
      flowSteps: [
        {
          title: '上传你的视频',
          description: '选择你想改变尺寸的片段。',
        },
        {
          title: '设置尺寸',
          description: '以像素为单位输入宽度和/或高度。',
        },
        {
          title: '调整尺寸',
          description: 'FFmpeg缩放视频并重新编码。',
        },
        {
          title: '下载',
          description: '保存调整尺寸后的视频。',
        },
      ],
      advancedDetails: [
        '留空其中一项即可按比例缩放，保持原始宽高比。',
        '同时设置两项时，保持开启“保持宽高比”，即可在不拉伸的情况下适应边框。',
        '调整尺寸会重新编码；MP4输出使用H.264 + AAC + yuv420p + faststart。每边最大4096 px。',
      ],
      whyItMatters: [
        '分辨率越低，文件越小，上传越快。',
        '一些平台要求精确的分辨率。',
        '调整尺寸可以统一分辨率不一的片库。',
      ],
      useCases: [
        {
          title: '为网页缩小',
          description: '将4K降到1080p或720p，让页面更快。',
        },
        {
          title: '达到目标尺寸',
          description: '精确匹配平台规格。',
        },
        {
          title: '减小文件大小',
          description: '降低分辨率以减少字节数。',
        },
        {
          title: '统一素材',
          description: '让各个片段使用同一分辨率。',
        },
      ],
      whyMediaManipulator: [
        '在服务器端用FFmpeg进行兼顾宽高比的缩放。',
        '干净的MP4输出，无水印。',
      ],
      privacyNote: '你的视频会被缩放到你设置的宽度和高度，并由我们服务器上的FFmpeg重新编码。处理在我们自己的服务器上运行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '如何调整视频尺寸？',
          answer: '上传视频，设置目标宽度和/或高度，然后下载调整尺寸后的视频。',
        },
        {
          question: '如何将分辨率更改为720p？',
          answer: '将高度设为720，宽度留空即可按比例缩放。',
        },
        {
          question: '调整尺寸会保持宽高比吗？',
          answer: '会——留空其中一项，或保持开启“保持宽高比”，视频就不会被拉伸。',
        },
        {
          question: '可以放大视频吗？',
          answer: '你可以放大到更大的尺寸，但放大无法添加拍摄时未捕捉到的细节。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '调整尺寸会重新编码；MP4输出使用H.264 + AAC + yuv420p + faststart。每边最大4096 px。',
        ],
      },
      related: [
        {
          label: '裁剪视频',
          to: '/tools/crop-video',
          description: '裁掉边缘，而不是缩放。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '使用预设缩小文件。',
        },
        {
          label: '视频转换器',
          to: '/tools/video-converter',
          description: '转换为MP4。',
        },
        {
          label: '旋转视频',
          to: '/tools/rotate-video',
          description: '修正方向。',
        },
      ],
      embed: {
        title: '调整视频尺寸',
        description: '上传视频并设置目标宽度和/或高度。留空其中一项即可按比例缩放。默认输出MP4。',
      },
    },
    'rotate-video': {
      name: '旋转视频',
      h1: '在线免费旋转视频',
      tagline: '修正横置或倒置的视频，一键旋转90°、180°或270°，还可翻转。',
      metaTitle: '在线免费旋转视频 | Media Manipulator',
      metaDescription: '免费在线视频旋转工具。将视频旋转90°、180°或270°，修正横置或倒置的片段。输出MP4，无水印，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费旋转视频',
      ogDescription: '将视频旋转90°、180°或270°，修正横置或倒置的画面。免费，无水印。',
      intro: '手机视频经常被录成横向，有些片段甚至上下颠倒。Media Manipulator视频旋转工具能彻底修正方向：选择90°、180°或270°，我们会旋转实际的画面帧（90°/270°时会互换宽度和高度），因此视频在每一个播放器中都能正向播放，而不只是在能读取旋转标记的播放器中。',
      whatItDoes: [
        '将视频顺时针旋转90°、180°或270°（即逆时针90°）。',
        '可选择将视频水平或垂直翻转（镜像）。',
        '重新编码，让旋转真正写入画面帧，而不只是一个元数据标记。',
        '默认导出MP4（H.264 + AAC）。',
      ],
      flowSteps: [
        {
          title: '上传视频',
          description: '例如一段横置的手机片段。',
        },
        {
          title: '选择旋转角度',
          description: '90°、180°或270°，如有需要还可以翻转。',
        },
        {
          title: '旋转',
          description: 'FFmpeg旋转画面帧（transpose）并重新编码。',
        },
        {
          title: '下载',
          description: '保存方向正确的视频。',
        },
      ],
      advancedDetails: [
        '90°/270°使用FFmpeg transpose（会正确互换宽度和高度），180°则使用两次transpose。',
        '将旋转写入像素，可以修正那些忽略容器旋转标记的播放器。',
        '旋转需要重新编码；MP4输出使用H.264 + AAC + yuv420p + faststart。',
      ],
      whyItMatters: [
        '横置的手机视频是最常见的视频烦恼之一。',
        '写入画面的旋转在任何地方都能正确播放，旋转标记则做不到。',
        '翻转可以修正镜像的自拍/摄像头画面。',
      ],
      useCases: [
        {
          title: '修正横置片段',
          description: '旋转竖拍的手机视频，使其正向播放。',
        },
        {
          title: '翻转自拍视频',
          description: '取消摄像头或前置摄像头画面的镜像。',
        },
        {
          title: '旋转180°',
          description: '修正上下颠倒的录像。',
        },
        {
          title: '为剪辑调整方向',
          description: '在导入之前先把方向调整正确。',
        },
      ],
      whyMediaManipulator: [
        '真正的画面帧旋转（transpose），而不只是元数据标记。',
        '在一个简洁的面板中完成旋转和翻转。',
      ],
      privacyNote: '你的视频会在我们的服务器上按你选择的角度旋转，并由FFmpeg重新编码。处理在我们自己的服务器上运行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '如何旋转视频？',
          answer: '上传视频，选择90°、180°或270°，然后下载旋转后的视频。',
        },
        {
          question: '如何修正横置的手机视频？',
          answer: '顺时针或逆时针旋转90°，直到它正向播放；旋转会写入画面帧。',
        },
        {
          question: '它真的会旋转画面帧，还是只设置一个标记？',
          answer: '它会旋转实际的画面帧（FFmpeg transpose），因此视频在每个播放器中都是正向的。',
        },
        {
          question: '我也可以翻转/镜像视频吗？',
          answer: '可以，工具提供水平翻转和垂直翻转选项。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '旋转通过FFmpeg transpose重新编码；MP4输出使用H.264 + AAC + yuv420p + faststart。',
        ],
      },
      related: [
        {
          label: '裁剪视频',
          to: '/tools/crop-video',
          description: '裁掉画面边缘。',
        },
        {
          label: '调整视频尺寸',
          to: '/tools/resize-video',
          description: '更改分辨率。',
        },
        {
          label: '视频转换器',
          to: '/tools/video-converter',
          description: '在各种视频格式之间转换。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '缩小旋转后的视频。',
        },
      ],
      embed: {
        title: '旋转视频',
        description: '上传视频并选择旋转角度（90°、180°或270°）。你也可以翻转它。我们会旋转实际的画面帧并导出MP4。',
      },
    },
    'remove-audio-from-video': {
      name: '移除视频中的音频',
      h1: '在线免费移除视频中的音频',
      tagline: '让视频彻底静音：去掉音轨，下载无声的纯视频文件。',
      metaTitle: '在线免费移除视频中的音频 | Media Manipulator',
      metaDescription: '免费在线工具，可移除视频中的音频。去掉声音，下载无声的纯视频MP4。无水印，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ogTitle: '在线免费移除视频中的音频',
      ogDescription: '去掉视频中的音轨，下载无声的纯视频文件。免费，无水印。',
      intro: '移除视频中的音频会得到一个无声的纯视频文件，适合消除背景噪音、在重新上传前去掉受版权保护的音乐，或准备一段之后要配上新音频的片段。Media Manipulator会去掉音轨并返回视频，并尽可能对画面进行流复制，因此不会有画质损失。',
      whatItDoes: [
        '移除（静音）音轨，返回纯视频文件。',
        '尽可能对视频流进行流复制：不重新编码，没有画质损失。',
        '当容器/编解码器要求时，改为重新编码。',
        '默认输出MP4（也可选择WebM）。',
      ],
      flowSteps: [
        {
          title: '上传视频',
          description: '你想去掉声音的片段。',
        },
        {
          title: '选择输出格式',
          description: 'MP4（默认）或WebM。',
        },
        {
          title: '移除音频',
          description: 'FFmpeg丢弃音频，保留视频。',
        },
        {
          title: '下载',
          description: '保存无声的纯视频文件。',
        },
      ],
      advancedDetails: [
        '我们对视频流进行流复制（`-c:v copy -an`），因此画面不受任何影响；如果容器不接受源编解码器，我们会重新编码为H.264。',
        '输出完全没有音轨：它是真正无声的，而不只是把音量调到零。',
        '下载的文件名会加上`_silent`后缀，方便你与原文件区分。',
      ],
      whyItMatters: [
        '静音能彻底去除背景噪音、交谈声或风声。',
        '去掉受版权保护的音乐，可以避免重新上传时被下架。',
        '无声的基础片段是添加新音频或配音的起点。',
      ],
      useCases: [
        {
          title: '消除背景噪音',
          description: '移除片段中不需要的声音。',
        },
        {
          title: '去掉受版权保护的音频',
          description: '在重新发布前去掉音乐。',
        },
        {
          title: '为新音频做准备',
          description: '得到一个可以添加配音的无声底片。',
        },
        {
          title: '隐私',
          description: '移除背景中录到的对话。',
        },
      ],
      whyMediaManipulator: [
        '对视频流进行保持画质的流复制。',
        '真正无声的输出（音轨被移除，而不只是调低音量）。',
      ],
      privacyNote: '你的视频的音轨会由FFmpeg在我们的服务器上丢弃，画面保持不变。处理在我们自己的服务器上运行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '如何移除视频中的音频？',
          answer: '上传视频，选择输出格式，然后下载无声的纯视频文件。',
        },
        {
          question: '这是把视频静音，还是移除音轨？',
          answer: '它会完全移除音轨，因此结果是真正无声的，而不只是音量为零。',
        },
        {
          question: '视频画质会改变吗？',
          answer: '不会。我们会尽可能对视频流进行流复制，因此画面不受任何影响。',
        },
        {
          question: '为什么文件名带有“_silent”？',
          answer: '我们会加上_silent后缀，方便你区分无音频的副本和原文件。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '尽可能对视频进行流复制；音轨会被完全移除。下载文件后缀：_silent。',
        ],
      },
      related: [
        {
          label: '移除音频（纯视频）',
          to: '/tools/extract-video-only-from-video',
          description: '同一个无声视频工具。',
        },
        {
          label: '从视频中提取音频',
          to: '/tools/extract-audio-from-video',
          description: '保存音频，而不是移除它。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '缩小无声视频。',
        },
        {
          label: '为视频添加音频',
          to: '/tools/stitch-audio-to-video',
          description: '为无声片段添加新的配乐。',
        },
      ],
      embed: {
        title: '移除视频中的音频',
        description: '上传视频，我们会去掉音轨，返回无声的纯视频文件。默认输出MP4。我们会尽可能对视频进行流复制（没有画质损失）。',
      },
    },
    'audio-converter': {
      name: '音频转换器',
      h1: '免费在线音频转换器',
      tagline: '在MP3、WAV、M4A、OGG、FLAC、OPUS等格式之间转换，可完全控制比特率、采样率和声道。',
      metaTitle: '免费在线音频转换器 | Media Manipulator',
      metaDescription: '免费在线音频转换器，支持MP3、WAV、M4A、OGG、FLAC、OPUS等格式。可选择比特率、采样率和声道。',
      ogTitle: '免费在线音频转换器',
      ogDescription: '转换WAV、MP3、M4A、OGG、FLAC、OPUS等格式。可选择比特率、采样率和声道。',
      intro: '不同的设备、播客托管平台和音频编辑器需要不同的格式。Media Manipulator在一个地方处理所有常见音频格式，并可精细控制比特率、采样率和声道布局。',
      whatItDoes: [
        '在MP3、WAV、M4A/AAC、OGG、FLAC、ALAC、OPUS、AC3、DTS之间转换。',
        '选择比特率、采样率和声道布局。',
        '在同一次上传中进行裁剪，并应用均衡器、降噪或AI清理。',
        '输出有效的文件，并在适用时写入ID3标签。',
      ],
      flowSteps: [
        {
          title: '上传音频',
          description: 'MP3、WAV、M4A、FLAC、OGG等。',
        },
        {
          title: '选择输出格式',
          description: 'MP3、WAV、FLAC、M4A、OGG、OPUS。',
        },
        {
          title: '调整比特率和采样率',
          description: '裁剪或运行AI清理。',
        },
        {
          title: '下载',
          description: '保存转换后的音频。',
        },
      ],
      advancedDetails: [
        'MP3是通用的压缩格式，所有设备都能播放。',
        'FLAC和ALAC是无损格式：比MP3大，比WAV小。',
        'OPUS（封装在OGG中）是适用于语音和音乐的最小的现代有损格式；当播放器由你掌控时非常合适。',
      ],
      whyItMatters: [
        '播客平台、音乐服务和音频编辑器各自偏好不同的格式。',
        '文件更小意味着占用的存储更少、传输更快。',
        '当音频还要再次编辑时，无损格式至关重要。',
      ],
      useCases: [
        {
          title: '播客发布',
          description: 'WAV母带 → MP3单集。',
        },
        {
          title: '分享语音备忘录',
          description: '裁剪并压缩为MP3。',
        },
        {
          title: '音乐归档',
          description: '转换MP3 → FLAC（音质不会提升），或WAV → FLAC，以无损方式存储。',
        },
        {
          title: '游戏和应用素材',
          description: '转换WAV → OPUS，得到体积极小的移动端素材。',
        },
      ],
      whyMediaManipulator: [
        '完全控制比特率、采样率和声道。',
        '在同一次上传中使用AI清理工具（降噪、提取人声、去除人声）。',
        '免费，无需注册，无水印。',
      ],
      privacyNote: '你的音频会由FFmpeg在我们的服务器上解码，并按你选择的格式和比特率重新编码。不涉及任何外部音频服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你会得到一个新文件；上传的文件本身不会被更改。',
      faq: [
        {
          question: '哪种格式最适合音乐？',
          answer: '无损存储用FLAC，分享用256–320 kbps的MP3，想要最小的可串流文件则用OPUS。',
        },
        {
          question: '哪种格式最适合语音？',
          answer: '96–128 kbps的MP3是很好的播客默认设置。',
        },
        {
          question: '可以在转换时裁剪吗？',
          answer: '可以。提交前在裁剪部分设置开始/结束秒数即可。',
        },
        {
          question: 'FLAC真的是无损的吗？',
          answer: '是的。FLAC在压缩时不会丢弃任何数据。解码后会得到与输入逐位一致的副本。',
        },
      ],
      related: [
        {
          label: '将WAV转换为MP3',
          to: '/tools/convert-wav-to-mp3',
          description: '专注于WAV → MP3的转换器。',
        },
        {
          label: '提取歌曲人声',
          to: '/tools/isolate-vocals-from-song',
          description: '从音乐音轨中提取人声。',
        },
        {
          label: '音频转换器教程',
          to: '/tutorials/audio/getting-started',
          description: '逐一讲解每个选项的完整教程。',
        },
      ],
      embed: {
        title: '转换音频文件',
        description: '上传任意音频文件并选择目标格式。192 kbps的MP3是稳妥的默认选择。WAV是无损的，但体积较大；M4A/AAC是适合音乐的压缩格式。',
      },
    },
    'srt-generator': {
      name: 'SRT字幕生成器',
      h1: '免费SRT字幕生成器',
      tagline: '上传视频或音频文件，生成可下载的.srt字幕文件，可直接用于YouTube、剪辑软件和无障碍工具。',
      metaTitle: '免费在线SRT字幕生成器：视频和音频转SRT | Media Manipulator',
      metaDescription: '从MP4、MOV、MP3、WAV等文件生成SRT字幕文件。免费，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。适用于YouTube、Premiere、DaVinci Resolve。',
      ogTitle: '免费SRT字幕生成器：视频和音频转SRT',
      ogDescription: '从任意视频或音频生成准确的SRT字幕文件。本地AI转录，不使用第三方服务商。',
      intro: 'SRT（SubRip）是互联网上支持最广泛的字幕格式：YouTube、Vimeo、Premiere、DaVinci Resolve、Final Cut以及几乎所有社交平台都接受它。Media Manipulator让你一次上传即可从任意视频或音频生成SRT文件。转录在我们自己的GPU服务器上用whisper-ctranslate2运行，因此音频绝不会离开我们的基础设施，也绝不会经过第三方AI服务商。',
      whatItDoes: [
        '将任意视频或音频文件转录为带时间码的.srt字幕文件。',
        '在我们本地的GPU服务器上使用whisper-ctranslate2，没有任何第三方AI服务商能看到你的媒体。',
        '生成SubRip格式文件（HH:MM:SS,mmm时间戳、连续的字幕序号），兼容所有主流视频编辑器和播放器。',
        '支持自动语言检测，也可提供可选的BCP-47语言提示，以提高短片段的准确度。',
      ],
      flowSteps: [
        {
          title: '上传媒体',
          description: '拖入任意MP4、MOV、MP3、WAV或其他支持的文件。',
        },
        {
          title: '我们提取音频',
          description: 'FFmpeg提取音轨，并将其转换为whisper所需的格式。',
        },
        {
          title: 'Whisper转录',
          description: '我们的GPU服务器运行whisper-ctranslate2，生成带时间的片段。',
        },
        {
          title: '下载.srt',
          description: '生成干净的SubRip文件，字幕序号连续，时间准确。',
        },
      ],
      advancedDetails: [
        'Whisper通过ctranslate2在我们自己的NVIDIA GPU服务器上运行，整个流程中没有任何外部API。',
        'SRT输出使用逗号分隔毫秒的时间戳（00:00:01,234）和从1开始的连续字幕序号，这是兼容剪辑软件最多的格式。',
        '转录流程支持自动语言检测，也可通过语言字段提供可选的WHISPER_CT2_LANGUAGE式BCP-47提示。',
        '输出与应用其他部分使用同一个任务系统：你也可以在转录表单中选择VTT、纯文本或结构化JSON。',
      ],
      whyItMatters: [
        'YouTube、Vimeo、Premiere、DaVinci Resolve、Final Cut和大多数社交平台都把SRT作为默认字幕格式。',
        '字幕让聋人和听障观众也能观看视频，并能在大多数视频静音播放的社交平台上提升互动。',
        '当你在视频旁发布对应的.srt时，搜索引擎可以索引视频中的转录内容。',
      ],
      useCases: [
        {
          title: 'YouTube创作者',
          description: '生成准确的字幕，并为每个视频上传SRT字幕轨。',
        },
        {
          title: '课程制作者',
          description: '为讲座视频添加转录稿，方便学生之后搜索、复习和翻译。',
        },
        {
          title: '把播客转发为视频的播客主',
          description: '把播客单集变成带字幕的视频片段，发布到社交平台。',
        },
        {
          title: '营销/社交媒体团队',
          description: '为每个片段加上字幕，让静音自动播放的观众也能收到信息。',
        },
      ],
      whyMediaManipulator: [
        'Whisper运行在我们自己的GPU基础设施上：你的媒体绝不会接触第三方AI服务商。',
        '无需注册，无水印。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
        '与应用其他部分使用相同的转录引擎，因此SRT、VTT、纯文本和JSON输出的准确度保持一致。',
      ],
      privacyNote: '你文件中的语音会由Whisper在我们自己的GPU服务器上转录，并按时间编排成SRT字幕文件。AI处理在我们运营的硬件上运行，绝不使用第三方AI服务商，你上传的任何内容都不会用于训练模型。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: '什么是SRT文件？',
          answer: 'SRT（SubRip）是一种带有时间戳和字幕序号的纯文本字幕文件。它是YouTube、大多数视频编辑器和大多数视频播放器都接受的默认字幕格式。',
        },
        {
          question: '可以从MP4生成字幕吗？',
          answer: '可以。上传任意MP4（或MOV、MKV、WebM、AVI、M4V），我们会生成可下载的.srt字幕文件。',
        },
        {
          question: '可以在YouTube上使用SRT文件吗？',
          answer: '可以，YouTube直接接受SRT。上传视频后，在“字幕 → 添加语言 → 上传文件”中添加字幕文件。',
        },
        {
          question: '支持哪些语言？',
          answer: 'Whisper支持数十种语言，并能自动检测所说的语言。你也可以传入BCP-47提示（例如en、es、ja），以提高极短片段的准确度。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '转录在我们本地的GPU服务器上运行：你的文件绝不会发送给外部AI服务商。',
          '对于较长的视频，任务会异步运行，你可以保持标签页打开以查看进度。',
        ],
      },
      related: [
        {
          label: '字幕翻译器',
          to: '/tools/caption-translator',
          description: '将生成的SRT翻译成其他语言。',
        },
        {
          label: '从视频中提取音频',
          to: '/tools/extract-audio-from-video',
          description: '在手动转录前先提取音频。',
        },
        {
          label: '从视频中提取帧',
          to: '/tools/extract-frames-from-video',
          description: '截取静帧，用作缩略图和参考。',
        },
        {
          label: '将视频转码为HLS',
          to: '/tools/transcode-to-hls',
          description: '为流媒体播放准备视频。',
        },
        {
          label: '将视频转码为DASH',
          to: '/tools/transcode-to-dash',
          description: 'AV1 / VP9 DASH打包。',
        },
      ],
      embed: {
        title: '生成SRT字幕文件',
        description: '上传视频或音频文件。我们会在自己的GPU服务器上用whisper-ctranslate2转录，并返回可直接放入任何视频编辑器的.srt字幕文件。',
      },
    },
    'caption-translator': {
      name: '字幕翻译器',
      h1: '免费字幕翻译器',
      tagline: '翻译SRT和VTT字幕文件，同时保留字幕的时间点、顺序和结构，不使用任何第三方AI服务商。',
      metaTitle: '免费字幕翻译器（SRT和VTT）：保留时间戳 | Media Manipulator',
      metaDescription: '在线翻译SRT和VTT字幕，精确保留每条字幕的时间点。运行在我们自己的本地AI服务器上：你的字幕绝不会发送给第三方服务商。',
      ogTitle: '免费字幕翻译器：SRT和VTT',
      ogDescription: '翻译SRT或VTT字幕，同时保留时间戳和字幕顺序。本地AI，不使用第三方服务商。',
      intro: '在不同语言之间翻译现有的字幕文件，完全不触碰字幕时间点。Media Manipulator会解析.srt或.vtt文件中的字幕条目，使用我们本地托管的字幕翻译模型只翻译文本，然后原样写回原始时间戳。没有任何第三方翻译API能看到你的字幕：模型运行在我们自己的GPU服务器上。',
      whatItDoes: [
        '接受.srt或.vtt字幕文件，并生成相同格式（如果你愿意，也可以是另一种格式）的翻译副本。',
        '精确保留字幕序号、字幕顺序和时间戳：只翻译字幕文本。',
        '在我们本地的Ollama模型服务器上，使用专为字幕调优的自定义模型进行翻译：你的字幕绝不会离开我们的基础设施。',
        '支持30多种目标语言，包括主要的欧洲、亚洲和中东语言。',
      ],
      flowSteps: [
        {
          title: '上传.srt或.vtt',
          description: '将现有的字幕文件拖入上传区。',
        },
        {
          title: '选择语言',
          description: '自动检测或选择源语言，然后选择目标语言。',
        },
        {
          title: '我们翻译字幕文本',
          description: '我们的本地AI只翻译字幕文本：时间戳和顺序保持不变。',
        },
        {
          title: '下载翻译后的字幕',
          description: '获得干净的.srt或.vtt，时间完全相同，每条字幕都有译文。',
        },
      ],
      advancedDetails: [
        '翻译在我们自己的Ollama服务器上运行，使用基于Translate-Gemma、专为字幕调优的衍生模型（mm-captions-translategemma-12b）。',
        '我们只向模型发送字幕文本和严格的JSON schema头部，并在读取响应时从原文件重新固定时间，因此即使模型出现异常，也无法破坏你的字幕时间。',
        'VTT文件中的NOTE和STYLE块会被保留，绝不会发送给翻译器。',
        '对于较长的字幕轨，我们会分批处理字幕条目，使模型永远不会接近其上下文上限。',
      ],
      whyItMatters: [
        '手动翻译字幕容易出错：很容易破坏时间戳格式，或不小心打乱字幕顺序。',
        '专门打造的字幕翻译器能保留剪辑软件和播放器所需的文件结构。',
        '在本地模型上自行完成翻译，让创作者的工作流程不受第三方翻译定价和政策的影响。',
      ],
      useCases: [
        {
          title: '多语言YouTube频道',
          description: '将一份英文SRT主文件翻译成5种以上语言，用于同一次上传。',
        },
        {
          title: '在线课程',
          description: '用学生母语的字幕触达国际学生。',
        },
        {
          title: '纪录片/电影节',
          description: '在不触碰字幕时间的情况下准备翻译字幕轨。',
        },
        {
          title: '新闻与新闻报道',
          description: '翻译突发新闻的字幕轨，同时保持精确同步。',
        },
      ],
      whyMediaManipulator: [
        '本地AI翻译：你的字幕绝不会交给第三方AI服务商。',
        '能安全处理时间的解析：即使模型出现异常，也会重新固定原始字幕的开始/结束时间。',
      ],
      privacyNote: '只读取你的SRT或VTT文件中的文本：每条字幕都由我们在自己的GPU服务器上运行的语言模型翻译，时间点则原样复制过去。AI处理在我们运营的硬件上运行，绝不使用第三方AI服务商，你上传的任何内容都不会用于训练模型。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: '可以在不破坏时间戳的情况下翻译SRT文件吗？',
          answer: '可以，这正是这个工具的意义所在。我们解析字幕条目，只翻译文本，然后在写入输出前精确地重新固定原始时间戳。',
        },
        {
          question: '支持哪些字幕格式？',
          answer: '同时支持SubRip（.srt）和WebVTT（.vtt）。你可以让输出格式与输入相同，也可以在两者之间转换。',
        },
        {
          question: '可以为YouTube视频翻译字幕吗？',
          answer: '可以。从你的视频生成（或导出）SRT，在这里翻译，然后将新的SRT作为额外的语言字幕轨上传到YouTube。',
        },
        {
          question: '字幕会通过第三方AI服务商翻译吗？',
          answer: '不会。翻译在我们自己托管于Ollama的模型上运行：你的字幕绝不会离开我们的基础设施。',
        },
        {
          question: '字幕时间会怎样？',
          answer: '字幕的开始和结束时间会被精确保留：翻译后我们会从原文件重新固定时间，因此即使模型出现异常，也无法破坏你的时间。',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '字幕文件最大2 MB（实际的字幕轨通常远小于此）。',
        ],
        processingNotes: [
          '翻译在本地托管的Ollama模型上运行：不会联系任何第三方翻译API。',
          'WebVTT文件中的NOTE和STYLE块会原样保留。',
        ],
      },
      related: [
        {
          label: 'SRT字幕生成器',
          to: '/tools/srt-generator',
          description: '从视频或音频文件生成新的SRT。',
        },
        {
          label: '从视频中提取音频',
          to: '/tools/extract-audio-from-video',
          description: '提取音频，用于审听或重新转录。',
        },
        {
          label: '为视频添加音频',
          to: '/tools/stitch-audio-to-video',
          description: '翻译字幕后，再添加翻译后的配音。',
        },
        {
          label: '将视频转码为HLS',
          to: '/tools/transcode-to-hls',
          description: '打包视频，用于流媒体播放。',
        },
        {
          label: '将视频转码为DASH',
          to: '/tools/transcode-to-dash',
          description: 'AV1 / VP9 DASH打包。',
        },
      ],
      embed: {
        title: '翻译SRT或VTT字幕文件',
        description: '上传现有的.srt或.vtt文件，选择目标语言，即可获得翻译后的字幕文件，原始字幕时间精确保留。',
      },
    },
    'audio-waveform-generator': {
      name: '音频波形生成器',
      h1: '免费音频波形生成器',
      tagline: '把任意音频文件变成可自定义的波形视频、波形图片，或两者兼得，适合播客、音乐预告和社交媒体短片。',
      metaTitle: '免费音频波形生成器：波形视频与图片 | Media Manipulator',
      metaDescription: '从任意音频文件生成波形视频和图片。宽幅10:1播客波形条、方形社交预览、分离立体声声道、自定义颜色等。',
      ogTitle: '免费音频波形生成器',
      ogDescription: '从MP3、WAV、M4A、FLAC等生成波形视频和图片。高度可配置，无需注册。',
      intro: '波形让音频变得可见，是播客、音乐预览、社交短片缩略图和剪辑时间线的重要素材。Media Manipulator使用FFmpeg的showwaves / showwavespic滤镜渲染波形，提供合理的默认设置（1600×160的10:1宽幅波形条），以及完整的高级面板，用于调整渲染模式、颜色、刻度和立体声分离。',
      whatItDoes: [
        '使用FFmpeg的showwaves滤镜渲染动态波形视频，支持point / line / p2p / cline模式。',
        '使用FFmpeg的showwavespic滤镜渲染静态波形图片，非常适合缩略图和专辑封面。',
        '支持推荐的宽高比预设（10:1宽幅、8:1、6:1、16:9、1:1），以及自定义宽度和高度。',
        '可选分离声道渲染，用不同颜色分别绘制左右声道。',
      ],
      flowSteps: [
        {
          title: '上传音频',
          description: '拖入任意MP3、WAV、M4A、AAC、FLAC或OGG文件。',
        },
        {
          title: '选择输出和尺寸',
          description: '选择波形视频、图片或两者，并选择宽高比预设或自定义尺寸。',
        },
        {
          title: '调整外观（可选）',
          description: '在高级面板中调整渲染模式、帧率、颜色、刻度和绘制模式。',
        },
        {
          title: '下载',
          description: '保存波形视频、图片，或包含两者的.zip。',
        },
      ],
      advancedDetails: [
        '渲染模式直接对应FFmpeg showwaves的模式：point、line、p2p、cline。每种模式都会在表单中预览，你可以直接凭眼睛挑选。',
        '你可以选择输出帧率（rate=）或每列采样数（n=），但不能同时选择，这与FFmpeg中这两个互斥的参数一致。',
        '刻度选项（lin、log、sqrt、cbrt）让你决定安静部分的可见程度。',
        '当同时请求视频和图片时，我们会将它们打包成单个.zip，与Media Manipulator的其他所有下载使用同一个任务系统。',
      ],
      whyItMatters: [
        '波形画面让音频内容便于分享：在静音自动播放的社交信息流中，带有动态波形的片段远比静态缩略图表现更好。',
        '剪辑师和制作人在编排时间线或设计专辑封面时，会把波形用作参考素材。',
        '调校得当的波形可以同时充当缩略图、音频图和音频预告。',
      ],
      useCases: [
        {
          title: '播客',
          description: '为社交媒体制作音频图：片段 + 波形 + 字幕 = 表现最好的播客推广形式。',
        },
        {
          title: '音乐预览',
          description: '为Instagram生成方形波形卡片，或为YouTube描述生成宽幅波形卡片。',
        },
        {
          title: '剪辑时间线',
          description: '在Premiere或DaVinci Resolve中把静态波形图片用作参考帧。',
        },
        {
          title: '配音交付',
          description: '随WAV一起发给客户一张波形卡片，方便他们一眼预览。',
        },
      ],
      whyMediaManipulator: [
        '默认设置偏向最实用的形状（10:1宽幅），而不是FFmpeg默认的600×240。',
        '安全地开放高级FFmpeg控制：每项设置在传入滤镜图之前都会在服务器端验证。',
        '输出MP4、PNG或包含两者的ZIP，无需再运行第二个任务。',
      ],
      privacyNote: '你的音频会由FFmpeg在我们的服务器上绘制成波形图片或视频。不涉及任何外部音频服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你会得到一个新文件；上传的文件本身不会被更改。',
      faq: [
        {
          question: '什么是音频波形？',
          answer: '波形是音频信号振幅随时间变化的可视化表示。它就是你在视频编辑器和SoundCloud等平台上看到的那条起伏的线。',
        },
        {
          question: '可以用MP3制作波形视频吗？',
          answer: '可以。上传MP3（或WAV/M4A/FLAC/OGG/AAC），工具会使用FFmpeg的showwaves滤镜渲染波形视频。',
        },
        {
          question: '也可以制作波形图片吗？',
          answer: '可以。将输出设为“波形图片”可获得静态PNG/WebP，设为“两者”则会得到包含视频和图片的ZIP。',
        },
        {
          question: '波形应该用什么尺寸？',
          answer: '对于大多数播客和音乐工作流程，10:1宽幅预设（1600×160）效果最好。如果需要适合社交媒体的形状，请使用16:9或1:1。',
        },
        {
          question: 'point、line、p2p和cline模式是什么意思？',
          answer: '它们是FFmpeg showwaves的渲染模式。point为每个采样绘制一个点，line绘制一条竖线，p2p用线连接各个点，cline绘制一条居中的竖线。表单会预览每一种模式。',
        },
        {
          question: '可以分离左右声道吗？',
          answer: '可以。在高级设置中启用“分离立体声声道”，并为每个声道选择不同的颜色。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '推荐默认值：10:1宽幅波形（1600×160），非常适合播客、音乐预览和剪辑时间线。',
          '选择“两者”时，结果会打包成单个ZIP，其中包含视频和图片。',
        ],
      },
      related: [
        {
          label: '从视频中提取音频',
          to: '/tools/extract-audio-from-video',
          description: '在生成波形之前，先从视频中提取音频。',
        },
        {
          label: 'SRT字幕生成器',
          to: '/tools/srt-generator',
          description: '将波形与字幕搭配，制作社交媒体音频图。',
        },
        {
          label: '为视频添加音频',
          to: '/tools/stitch-audio-to-video',
          description: '将你的波形渲染与另一段视频合成。',
        },
      ],
      embed: {
        title: '从音频文件生成波形',
        description: '上传音频文件，选择想要波形视频、波形图片还是两者。高级控制可调整尺寸、颜色、渲染模式和立体声行为。默认是10:1宽幅波形视频，适合播客和音乐预览。',
      },
    },
    'extract-video-only-from-video': {
      name: '提取无音频视频',
      h1: '提取无音频视频（纯视频）',
      tagline: '导出去掉所有音轨的无声纯视频副本，适合无声预览、B-roll素材、剪辑和重新配乐。',
      metaTitle: '提取无音频视频：纯视频导出 | Media Manipulator',
      metaDescription: '免费在线工具，导出移除所有音轨的纯视频（无声）副本。尽可能对视频进行流复制：不重新编码，没有画质损失。',
      ogTitle: '提取无音频视频（纯视频）',
      ogDescription: '导出移除所有音轨的纯视频（无声）副本。免费，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      intro: '有时你只想要视频而不要音频：用于社交信息流的无声预览、放入新剪辑的B-roll素材，或要配上新音乐的重新配乐工作流程。Media Manipulator会去掉所有音轨，输出干净的纯视频文件。视频流会尽可能进行流复制，因此不会重新编码，也没有画质损失。',
      whatItDoes: [
        '移除视频中的所有音频流。',
        '尽可能对视频流进行流复制：不重新编码，没有画质损失。',
        '仅当目标容器需要时，才重新编码为兼容的H.264 baseline。',
        '返回无声的MP4（或WebM），可直接放入新的剪辑。',
      ],
      flowSteps: [
        {
          title: '上传视频',
          description: '拖入任意MP4、MOV、MKV、WebM、AVI或M4V文件。',
        },
        {
          title: '选择输出容器',
          description: 'MP4是稳妥的默认选项。WebM适用于VP9/AV1源文件。',
        },
        {
          title: '我们去掉音频',
          description: 'FFmpeg丢弃音频流，并尽可能直接复制视频流。',
        },
        {
          title: '下载无声视频',
          description: '保存一份干净、无音频的视频副本。',
        },
      ],
      advancedDetails: [
        '默认尝试使用`-c:v copy`，因此不会重新编码：视频流的质量逐位保留。',
        '如果目标容器拒绝源编解码器，我们会改用libx264 + yuv420p以CRF 20重新编码。',
        '无水印、无叠加、无缩放：默认情况下，视觉输出与源文件完全相同。',
      ],
      whyItMatters: [
        '在大多数社交平台上，无声视频实际上就是自动播放的标准格式。',
        '移除音频也是一种隐私保护措施：在分享屏幕录像之前，去掉其中嵌入的语音/对话内容。',
        '剪辑师经常需要干净的纯视频文件，用于重新配乐，或与另一段音频录音同步。',
      ],
      useCases: [
        {
          title: '无声社交预览',
          description: '为Instagram、X、LinkedIn或TikTok制作干净的自动播放片段。',
        },
        {
          title: '重新配乐项目',
          description: '在添加音乐或配音之前去掉原始音频。',
        },
        {
          title: '涉及隐私的分享',
          description: '移除屏幕录像时录到的背景对话。',
        },
        {
          title: 'B-roll准备',
          description: '把无音频的片段放入多机位或以B-roll为主的剪辑中。',
        },
      ],
      whyMediaManipulator: [
        '尽可能流复制：保留原始视频画质。',
        '清晰、快速，无需注册，无水印。',
        '免费。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ],
      privacyNote: '你的视频会由FFmpeg在我们的服务器上复制为一份不含音轨的副本。处理在我们自己的服务器上运行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '如何移除视频中的音频？',
          answer: '上传视频并点击“从视频中移除音频”。工具会以你选择的容器输出纯视频副本。',
        },
        {
          question: '视频画质会改变吗？',
          answer: '默认情况下不会。我们对视频流进行流复制，因此输出在视频部分与原文件逐位一致。只有在目标容器需要时，我们才会重新编码。',
        },
        {
          question: '可以把MP4变成无声的吗？',
          answer: '可以。MP4是默认输出容器，也是最常见的用法。',
        },
        {
          question: '原始视频会被修改吗？',
          answer: '不会。原始上传文件保持不变。我们会生成一个新文件，并按照保留规则保留或删除上传文件：访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
        },
        {
          question: '如果我的视频没有音频怎么办？',
          answer: '没问题，工具会正常完成，并返回一份干净的重新封装副本。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '只要目标容器支持，视频流就会直接复制，不重新编码。',
          '没有音频流的输入视频会正常完成，并返回重新封装的副本。',
        ],
      },
      related: [
        {
          label: '移除视频中的音频',
          to: '/tools/remove-audio-from-video',
          description: '面向普通用户的静音/去除声音页面。',
        },
        {
          label: '从视频中提取音频',
          to: '/tools/extract-audio-from-video',
          description: '将音轨提取为MP3、WAV等格式。',
        },
        {
          label: '为视频添加音频',
          to: '/tools/stitch-audio-to-video',
          description: '为你的无声视频添加新的配乐。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '缩小无声视频。',
        },
        {
          label: '从视频中提取帧',
          to: '/tools/extract-frames-from-video',
          description: '从无声视频中提取静态图像。',
        },
      ],
      embed: {
        title: '移除视频中的音频',
        description: '上传视频，我们会生成一份无声/纯视频副本。视频流会尽可能进行流复制，因此不会重新编码，也没有画质损失。',
      },
    },
    'extract-frames-from-video': {
      name: '从视频中提取帧',
      h1: '从视频中提取帧',
      tagline: '从任意视频中提取静态图像帧，可按每N秒、目标帧率或指定时间点提取，并打包为ZIP下载。',
      metaTitle: '从视频中提取帧——免费视频帧提取工具 | Media Manipulator',
      metaDescription: '免费在线工具，可从任意视频中提取静态图像。可选择每N秒一帧、每秒帧数或指定时间点。输出为包含JPG、PNG或WebP帧的ZIP。',
      ogTitle: '从视频中提取帧',
      ogDescription: '从MP4、MOV、MKV、WebM、AVI和M4V中提取静态图像帧。以包含JPG、PNG或WebP帧的ZIP下载。',
      intro: '帧提取会把视频还原为一系列静态图像——可用于缩略图、参考画面、设计样机、机器学习数据集以及动画/分镜预览。Media Manipulator可让你每N秒采样一帧、按目标帧率采样或在指定时间点采样，并将得到的图像打包成一个ZIP供下载。',
      whatItDoes: [
        '将静态帧提取为JPG、PNG或WebP图像。',
        '支持三种采样模式：每N秒一帧、目标每秒帧数或指定时间点。',
        '将所有帧打包成一个ZIP，一键即可下载。',
        '强制执行最大帧数保护上限，让任务保持快速且可预期。',
      ],
      flowSteps: [
        {
          title: '上传视频',
          description: '拖入任意MP4、MOV、MKV、WebM、AVI或M4V文件。',
        },
        {
          title: '选择采样模式',
          description: '每N秒一帧、目标FPS，或用逗号分隔的时间点列表。',
        },
        {
          title: '选择图像格式',
          description: 'JPG适合小巧的缩略图，PNG适合无损静帧，WebP适合更小的现代文件。',
        },
        {
          title: '下载ZIP',
          description: '所有提取的帧都会打包成一个.zip，可以在任何地方解压。',
        },
      ],
      advancedDetails: [
        '“每N秒”和FPS模式使用FFmpeg的fps滤镜，在整条时间线上均匀采样。',
        '时间点模式为每个请求的时间点单独调用一次FFmpeg，因此单帧失败（如超出范围的请求等）会清楚地显示出来。',
        '最大帧数保护上限默认为300，最高为1000——让任务保持快速，并避免失控的提取。',
      ],
      whyItMatters: [
        '帧提取是从现有视频素材中获取缩略图或参考帧最简单的方法。',
        '设计师和动画师把采样帧用作绘画参考，以及分镜的B-roll素材。',
        '机器学习从业者用它们构建分类或检测数据集，而无需搭建自定义处理流水线。',
      ],
      useCases: [
        {
          title: '缩略图和预览',
          description: '挑选一帧用作YouTube/Vimeo缩略图。',
        },
        {
          title: '设计参考',
          description: '从游戏实况或动画中采样一系列帧作为绘画参考。',
        },
        {
          title: '分镜',
          description: '为分镜提案生成一系列关键帧。',
        },
        {
          title: '机器学习数据集',
          description: '从少量视频中快速构建小型图像数据集。',
        },
      ],
      whyMediaManipulator: [
        '三种采样模式几乎涵盖所有实际需求——按间隔、按FPS或按指定时间点。',
        'ZIP输出让下载始终只需一次点击，无论你提取了多少帧。',
        '服务器端FFmpeg意味着输出始终一致，不受浏览器或编解码器支持情况的影响。',
      ],
      privacyNote: 'FFmpeg在我们的服务器上按你选择的频率从视频中提取帧，并以图像ZIP的形式返回。处理在我们自己的服务器上进行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '如何从视频中提取帧？',
          answer: '上传视频，选择采样模式（默认是每N秒一帧），选择图像格式，然后点击“提取帧”。结果是一个包含静态图像的ZIP。',
        },
        {
          question: '可以每隔几秒导出一帧吗？',
          answer: '可以——这就是默认模式。把“帧间隔秒数”设为你想要的任意间隔即可。',
        },
        {
          question: '支持哪些图像格式？',
          answer: 'JPG（体积小，适合缩略图）、PNG（无损）和WebP（更小的现代文件）。',
        },
        {
          question: '为什么工具返回的是ZIP文件？',
          answer: '即使是很短的视频也可能产生几十帧。返回单个ZIP让下载只需一次点击，也免得与浏览器的多文件下载限制周旋。',
        },
        {
          question: '为什么有最大帧数限制？',
          answer: '该限制可防止意外的失控任务（例如从长视频中提取数万帧）。默认值为300，绝对上限为1000。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '默认最大帧数上限为300——如果确实需要更多，可以在表单中将其提高到1000。',
          '时间点模式接受用逗号分隔的秒数列表（例如“1, 5.5, 12.25, 30”）。',
        ],
      },
      related: [
        {
          label: '从视频中提取音频',
          to: '/tools/extract-audio-from-video',
          description: '从同一个视频中提取音频。',
        },
        {
          label: 'SRT字幕生成器',
          to: '/tools/srt-generator',
          description: '把同一个视频转录为.srt字幕。',
        },
        {
          label: '移除视频中的音频',
          to: '/tools/extract-video-only-from-video',
          description: '去除音频，保留视频的无声副本。',
        },
      ],
      embed: {
        title: '从视频中提取帧',
        description: '上传视频，选择采样模式（每N秒一帧、按帧率或在指定时间点），然后下载包含静态帧的ZIP。',
      },
    },
    'stitch-audio-to-video': {
      name: '为视频添加音频',
      h1: '为视频添加音频',
      tagline: '把一个基础视频与最多三个额外音频文件（配音、音乐、旁白）合成，并下载新的MP4。',
      metaTitle: '为视频添加音频——配音、音乐、替换、混音 | Media Manipulator',
      metaDescription: '免费在线工具，可为视频添加配音、音乐或旁白，或完全替换原始音频。支持逐轨音量和偏移控制，输出MP4。',
      ogTitle: '为视频添加音频',
      ogDescription: '添加配音、音乐、旁白，或替换原始音频。逐轨音量和偏移控制，输出MP4，无需注册。',
      intro: '把一个基础视频与一个或多个额外音频文件合成，是最常见的剪辑任务之一——添加配音、加入背景音乐、为屏幕录制配上旁白，或完全替换原始音频。Media Manipulator提供逐轨音量和偏移控制、“混合/替换”切换，以及可直接放入任何播放器的MP4输出。',
      whatItDoes: [
        '把一个基础视频与最多三条额外音轨合成。',
        '逐轨控制：音量（0–4×）、以秒为单位的起始偏移，以及可选的循环至视频长度。',
        '顶层模式切换：“混合”保留原始音频，“替换”则将其舍弃。',
        '输出始终是带192 kbps AAC音频的MP4——在任何地方都稳妥的默认选择。',
      ],
      flowSteps: [
        {
          title: '上传基础视频',
          description: '拖入任意MP4、MOV、MKV、WebM、AVI或M4V文件。',
        },
        {
          title: '添加音轨',
          description: '最多添加三个音频文件（配音、音乐、旁白），每条音轨可单独设置。',
        },
        {
          title: '选择混合或替换',
          description: '保留原始音频并混入新音轨，或舍弃原始音频、只使用新音频。',
        },
        {
          title: '下载新的MP4',
          description: '我们在服务器上完成合成，并返回干净的MP4。',
        },
      ],
      advancedDetails: [
        '滤镜图以程序方式构建：每条音轨一个adelay + volume节点，再用单个amix将它们合并。',
        '视频流会尽可能直接复制——只有音频会被重新编码（为192 kbps的AAC）。',
        '循环通过在音频输入上使用`-stream_loop -1`实现，因此较短的背景音乐可以干净地延长到视频时长。',
        '输出时长默认为“裁剪至视频时长”——如果你希望输出延长到最长的输入，请取消勾选。',
      ],
      whyItMatters: [
        '配音、音乐和旁白是短视频中最常添加的音频内容。',
        '逐轨音量和偏移控制让你可以做出真正的混音，而不只是放入一条音轨。',
        '在浏览器中完成这项工作会又慢又不可靠——服务器端FFmpeg既快速又准确。',
      ],
      useCases: [
        {
          title: '创作者视频',
          description: '在口播片段下铺一层背景音乐，或用干净的配音替换现场收音。',
        },
        {
          title: '教程',
          description: '在屏幕录制上叠加一条旁白音轨。',
        },
        {
          title: '社交短片',
          description: '在15秒剪辑的指定偏移处加入热门音乐。',
        },
        {
          title: '家庭/个人视频',
          description: '为旅行集锦添加背景音乐。',
        },
      ],
      whyMediaManipulator: [
        '逐轨音量和偏移控制——而不只是放入单个音频文件。',
        '尽可能直接复制视频流——保留原始视频画质。',
        '免费、无需注册、服务器端FFmpeg。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ],
      privacyNote: 'FFmpeg在我们的服务器上将你的视频和你添加的音频文件合并为一个MP4。处理在我们自己的服务器上进行，而不是第三方转码服务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。你的源文件保持不变，结果是一个新文件。',
      faq: [
        {
          question: '可以为视频添加音乐吗？',
          answer: '可以——把音乐文件添加为音轨，设置其音量，并将模式保持为“混合”，以在下方保留原始音频。',
        },
        {
          question: '可以添加配音并保留原始音频吗？',
          answer: '可以——将模式保持为“混合”，添加配音；如果希望配音更突出，可以通过为额外音轨设置较低的音量来压低原始音频。',
        },
        {
          question: '可以替换原始音轨吗？',
          answer: '可以——将模式设为“替换”，原始音频就会被舍弃。输出中只混入你添加的音轨。',
        },
        {
          question: '如果音频比视频长怎么办？',
          answer: '默认情况下，我们会裁剪至视频时长。如果希望输出延长到最长的输入，请取消勾选“裁剪至视频时长”。',
        },
        {
          question: '可以调整添加的音频的音量吗？',
          answer: '可以——每条添加的音轨都有自己的音量系数（0–4×）和以秒为单位的起始偏移。',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '每个任务最多添加3条音轨。',
        ],
        processingNotes: [
          '视频流会尽可能直接复制——只有音频会被重新编码（为AAC 192 kbps）。',
          '勾选“循环”可将较短的背景音乐延长到视频长度。',
        ],
      },
      related: [
        {
          label: '从视频中提取音频',
          to: '/tools/extract-audio-from-video',
          description: '从一个视频中提取音频，以便在另一个视频中复用。',
        },
        {
          label: '移除视频中的音频',
          to: '/tools/extract-video-only-from-video',
          description: '去除音频，准备一个干净的重新配乐底版。',
        },
        {
          label: '音频波形生成器',
          to: '/tools/audio-waveform-generator',
          description: '为你的音轨制作配套的可视化画面。',
        },
      ],
      embed: {
        title: '添加或替换视频的音轨',
        description: '上传基础视频，添加一到三个音频文件，设置每条音轨的音量和偏移，并选择“混合”或“替换”。我们会返回合成了全部内容的MP4。',
      },
    },
    'ai-frame-interpolation': {
      name: 'AI插帧',
      h1: 'AI插帧工具',
      tagline: '借助AI生成的中间帧，把视频帧率提高到48、60或120 FPS，让动作更流畅。',
      metaTitle: 'AI插帧工具——将视频转换为60或120 FPS | Media Manipulator',
      metaDescription: '免费在线AI插帧工具。使用RIFE将24/30fps视频变成更流畅的48、60或120 FPS MP4。不使用第三方API——在我们自己的GPU上运行。',
      ogTitle: 'AI插帧工具——将视频平滑到60或120 FPS',
      ogDescription: '上传视频，选择目标FPS，然后下载带有AI生成中间帧、动作更流畅的MP4。',
      intro: 'AI插帧通过神经网络（RIFE）生成新的中间帧来提高视频帧率，而不是简单地复制或混合现有帧。结果是明显更流畅的动作——24/30fps的素材开始有60fps的观感，60fps的片段则可以提升到适合高刷新率屏幕的120fps。处理在我们自己的GPU服务器上运行，而不是第三方API，输出的MP4可以直接放入任何播放器。',
      whatItDoes: [
        '使用RIFE（rife-ncnn-vulkan）合成新的中间帧，而不是复制或混合现有帧。',
        '目标为48、60或120 FPS，质量和最大处理高度预设由你控制。',
        '在我们自己的GPU服务器上运行——没有任何第三方AI服务商能看到你的文件。',
        '返回H.264 + AAC的MP4（默认保留源文件的音轨）。',
        '预先限制过长或过高的源文件，避免单个任务独占GPU。',
      ],
      flowSteps: [
        {
          title: '上传视频',
          description: '拖入一段简短的MP4、MOV、WebM、MKV或AVI片段。',
        },
        {
          title: '打开AI视频工具',
          description: '在视频表单中，滚动到“AI视频工具”并选择“AI帧插值”。',
        },
        {
          title: '选择目标FPS和质量',
          description: '选择48、60或120 FPS，以及编码质量/最大处理高度。',
        },
        {
          title: '运行插帧',
          description: '我们提取帧，在GPU上运行RIFE，并以新的FPS重新编码为MP4。',
        },
        {
          title: '下载MP4',
          description: '保存插帧后的片段，并与原片对照预览。',
        },
      ],
      advancedDetails: [
        '帧提取使用带vsync=0的ffmpeg，使输入帧数与源FPS完全一致。',
        'RIFE通过rife-ncnn-vulkan使用所选的模型目录运行（推荐默认使用rife-v4.6；为了兼容，也提供rife-v4和rife-v2.3）。',
        '插帧完成后，ffmpeg以所选质量重新编码为H.264（libx264）+ AAC（低/中/高分别对应CRF 26/20/17）。',
        '源音频会重新映射到新的编码中，输出使用+faststart，使文件能通过HTTP顺畅地流式播放。',
        '最大处理高度（默认720p）限制了较高源文件带来的GPU显存压力；通过-2:min(ih,N)缩放保留原始宽高比。',
      ],
      whyItMatters: [
        '动作流畅度是消费级视频与广播级视频之间最明显的观感差异之一。',
        '现代显示器和许多社交平台都更青睐60fps和120fps内容，以获得更流畅的播放效果。',
        '较旧或低帧率的素材可以提升一个档次，而无需重新拍摄源素材。',
      ],
      useCases: [
        {
          title: '30fps → 60fps，用于网页',
          description: '把口播、录屏或vlog素材提升到现代社交和视频网站常见的更流畅的60fps区间。',
        },
        {
          title: '60fps → 120fps，用于高刷新率播放',
          description: '为120Hz/144Hz显示器或后续的慢动作剪辑准备素材。',
        },
        {
          title: '更流畅的短片',
          description: '在分享前让5–10秒的剪辑看起来明显更流畅。',
        },
        {
          title: '修复较旧的片段',
          description: '把老旧的24/30fps片段提升到48或60fps，获得更现代的播放观感。',
        },
        {
          title: '剪辑准备',
          description: '在下游编辑器中应用慢动作或动态图形之前，先生成更密集的帧时间线。',
        },
      ],
      whyMediaManipulator: [
        '在我们自己的GPU基础设施上运行——没有任何第三方AI服务商会收到文件。',
        '使用便携的Vulkan二进制程序rife-ncnn-vulkan，而不是庞大的PyTorch技术栈——依赖更少，冷启动更快。',
        '免费、无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      ],
      privacyNote: 'RIFE在我们自己的GPU服务器上为你的视频生成新的中间帧。AI处理在我们运营的硬件上运行，绝不使用第三方AI服务商，你上传的任何内容都不会用于训练模型。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: 'AI插帧真的能提高视频质量吗？',
          answer: '它提高的是动作流畅度，而不是分辨率或清晰度。如果源视频已经是60fps，提升到120fps后会感觉更流畅。如果源视频是24/30fps，它会更接近60fps的观感。它无法神奇地还原摄像机从未捕捉到的真实动作。',
        },
        {
          question: 'AI插帧和单纯提高FPS是一回事吗？',
          answer: '不是。基础的FPS转换通常会复制、丢弃或混合现有帧。AI插帧则根据估算的运动合成全新的中间帧，通常比复制帧看起来自然得多。',
        },
        {
          question: '可以把30fps转换为60fps吗？',
          answer: '可以——30fps转60fps是最常见的目标之一，也很适合作为第一次测试。',
        },
        {
          question: '可以把60fps转换为120fps吗？',
          answer: '可以。与60fps相比，120fps的GPU工作量翻倍，生成的文件也更大，所以请先用短片段试试。',
        },
        {
          question: '为什么插帧可能产生伪影？',
          answer: '运动估算必须猜测两个真实帧之间发生了什么。快速运动、手、头发、车轮、遮挡和场景切换本身就更难处理——合成的帧在这些区域可能出现扭曲、重影或拖影。',
        },
        {
          question: '工具会生成什么输出格式？',
          answer: '带H.264视频和AAC音频的MP4。v1只输出MP4，因为这种容器在任何地方都能播放，并且支持本工具生成的更高帧率。',
        },
        {
          question: '60fps总是比30fps好吗？',
          answer: '对于UI录屏、体育、游戏实况和动作较多的片段，60fps通常感觉更流畅。对于电影感内容，24/30fps往往正是想要的效果。请选择与你期望的观感相符的FPS。',
        },
        {
          question: 'AI插帧比FFmpeg minterpolate更好吗？',
          answer: 'AI插帧（RIFE）通常能比FFmpeg内置的minterpolate滤镜产生更干净的运动效果，尤其是非刚性运动。minterpolate更快、更简单，仍然适合作为快速的备用转换方式。',
        },
        {
          question: '为什么插帧后场景切换处有时看起来很奇怪？',
          answer: '模型假定相邻帧属于同一个运动序列。硬切会打破这一假设，因此边界处合成的帧可能出现短暂的扭曲。干净的剪切和较短的片段会有所帮助。',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '最长源时长和处理高度受服务器上的AI_FRAME_INTERPOLATION_MAX_DURATION_SECONDS和AI_FRAME_INTERPOLATION_MAX_HEIGHT限制。',
        ],
        processingNotes: [
          'AI插帧非常依赖GPU。对于较高的源文件，降低最大处理高度可以更快得到结果。',
          'v1的输出为MP4（H.264 + AAC）。默认保留源文件的音频。',
        ],
      },
      related: [
        {
          label: '视频转换器',
          to: '/tools/video-converter',
          description: '转换MP4、WebM、MOV、AVI、MKV等格式。',
        },
        {
          label: '压缩视频',
          to: '/tools/compress-video',
          description: '插帧后缩小视频文件体积。',
        },
        {
          label: '将视频转换为动态GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: '把短片段变成便于分享的动态GIF。',
        },
        {
          label: '从视频中提取帧',
          to: '/tools/extract-frames-from-video',
          description: '将单独的帧提取为PNG。',
        },
        {
          label: 'AI插帧教程',
          to: '/tutorials/ai-frame-interpolation',
          description: '了解AI插帧的工作原理及使用时机。',
        },
      ],
      embed: {
        title: 'AI插帧',
        description: '上传一段短视频。“AI帧插值”已预先选中：选择目标FPS（48、60或120），工具会合成新的中间帧并返回MP4。',
      },
    },
    // MM100: Aperture's page lines (name, tagline, SEO title and description); full bodies come with MM102-<prefix>. Model-written, needs native review.
    'aperture': {
      name: 'Aperture',
      h1: 'Aperture：在线照片编辑器',
      tagline: '浏览器中基于图层的照片编辑器：曝光度、曲线、颜色、蒙版、修复和预设，以完整分辨率导出。',
      metaTitle: 'Aperture在线照片编辑器：图层、曲线、蒙版 | Media Manipulator',
      metaDescription: '在浏览器中用Aperture编辑照片：非破坏性调整图层、曲线、色阶、HSL、蒙版、污点修复、预设和完整分辨率导出。',
      ogTitle: 'Aperture：在线照片编辑器',
      ogDescription: '在浏览器中进行非破坏性照片编辑。叠加调整图层、添加蒙版、修复斑点，并以完整分辨率导出JPG、PNG、WebP、AVIF或TIFF。',
      intro: 'Aperture是Media Manipulator内置的照片编辑器。它以全屏、无广告的方式打开单张照片，让你在未经改动的原图之上，用一叠调整图层完成整个修图：一个曝光度图层、一条曲线、一个只作用于某个颜色范围的HSL图层、一个晕影、一次锐化，每一层都有各自的不透明度、混合模式和可选的蒙版。预览由你的显卡根据1920 px的副本绘制，所以每个滑块都能即时响应；导出则由我们的服务器根据原始文件以完整分辨率渲染，使用的是同一套数学公式。你在这里做的任何操作都不会改写你打开的文件；结果始终是一个新文件，文件名为原文件名加上retouched一词。',
      whatItDoes: [
        '每次编辑都保存为独立的调整图层，每张照片最多64个，因此以后可以随时隐藏、重新排序、复制、重新微调或删除任意图层，而不影响图层堆栈中的其他部分。',
        '在“基本”、“曲线”、“色阶”、“颜色（HSL）”、“色彩平衡”、“黑白”、“通道混合器”、“照片滤镜”、“分离色调”、“LUT”和“效果”面板中处理全局影调和颜色，滑块范围与桌面编辑器一致。',
        '可用线性渐变、径向、手绘画笔、明亮度范围、用吸管拾取的颜色范围或AI主体蒙版，把任意图层限定在画面的局部，各组件之间以添加、减去或相交的方式组合。',
        '用“修复”工具修补像素（涂抹斑点后点按“修复”，图像补全模型就会在我们的GPU上把它们填好），还有红眼修正，以及用于裁剪、拉直、旋转、翻转和四角透视校正的“几何”面板。',
        '保存并重复使用风格：18种内置预设外加“自动”；你自己的预设可以保存在此浏览器中或导出为JSON；在付费套餐中，还能把同一组图层应用到一批其他照片上。',
      ],
      flowSteps: [
        {
          title: '打开照片',
          description: '将文件拖放到此页面。浏览器完成解码后编辑器随即打开，实时直方图显示在面板下方。',
        },
        {
          title: '叠加调整',
          description: '在任意面板中移动一个滑块，“图层”列表中就会出现一个图层。你可以给它添加蒙版、降低不透明度，或把混合模式切换为“明度”或“颜色”。',
        },
        {
          title: '对比并微调',
          description: '按住反斜杠键查看原图，或用“分屏对比”并排比较。撤销、重做和“历史记录”面板可以让你回退到任意一步。',
        },
        {
          title: '以完整尺寸导出',
          description: '选择JPG、PNG、WebP、AVIF或TIFF格式，设置1到100的质量、是否保留元数据以及尺寸上限。服务器渲染原图后，文件随即下载。',
        },
      ],
      advancedDetails: [
        '工作数值是0到1之间的sRGB浮点数，每个处理阶段都会把它限制在这个范围内；只有“曝光度”和“白平衡”图层会先转换到线性光（sRGB解码：低于0.04045时为v / 12.92，否则为((v + 0.055) / 1.055)的2.4次方），处理完再编码回去。',
        '图层按堆栈顺序自下而上应用。每个图层先算出调整后的颜色，再由混合模式决定取用哪一部分：整个结果（“正常”）、仅取权重为0.2126、0.7152和0.0722的BT.709亮度值变化（“明度”），或仅取色度变化（“颜色”）；最后，用图层不透明度乘以0到1之间的蒙版值，把结果与输入混合。',
        '预览由你的GPU通过WebGL2根据照片的1920 px副本绘制；导出的文件则由我们的服务器根据原图以完整分辨率、用同样的公式渲染，两者的差异在一个已记录的小容差之内：颜色运算的平均差异最多为8位精度下的一级，最大不超过四级；卷积运算最多相差八级；颗粒则完全一致，因为两端共用同一个哈希函数。',
        '蒙版由各个组件按顺序从0开始依次合成：“添加”取当前值与组件值中的较大者；“减去”取当前值与“一减组件值”中的较小者；“相交”取两者中的较小者。蒙版羽化是一次高斯模糊，其sigma等于羽化百分比乘以0.05再乘以图像长边；反相和蒙版强度在模糊之后应用。',
        '几何变换是一次逆映射：旋转、拉直角度、翻转、四角透视控制框和裁剪被合成为单个变换，输出像素从源图中双线性采样，因此叠加多项几何调整也只会对照片重采样一次。',
        '不超过4 MP的图片在服务器上以float64渲染，与TypeScript参考实现逐位一致；更大的图片使用float32。部署时运行的自检会比对126张基准渲染图，目前测得的最大误差为8位精度下的一级。',
      ],
      whyItMatters: [
        '单次处理的滤镜工具只给你一次机会；图层堆栈则让你一周后回来，把晕影降到40%不透明度，其余一切保持原样。',
        '在缩小的副本上预览，是所有专业编辑器保持流畅的办法，但前提是导出结果保证一致。这正是服务器渲染与预览共用同一套公式、并有实测容差的原因。',
        '蒙版让全局滑块变成局部工具：同一个“曝光度”滑块，可以只提亮一张脸、只提亮天空，或只提亮明亮度低于0.3的所有区域，全看你附加的是哪种蒙版。',
      ],
      useCases: [
        {
          title: '挽救手机照片',
          description: '提亮阴影，用带渐变蒙版的“曝光度”图层压回过曝的天空，把白平衡调暖，然后导出12 MP的JPG，无需安装任何软件。',
        },
        {
          title: '商品上架用的产品图',
          description: '拉直、裁剪为1:1或4:5，用吸管设定干净的白平衡，修复灰尘，以1 px半径锐化，再把同一组图层应用到这一批中的其他9张照片。',
        },
        {
          title: '整组照片风格统一',
          description: '只需构建一次风格，保存为预设，然后重复应用。预设会把它的图层作为一个组添加进来，所以你仍然可以在它下方逐张调整曝光度。',
        },
        {
          title: '人像与皮肤',
          description: '修复瑕疵，在画笔蒙版下用-20的“清晰度”柔化皮肤，在HSL中把“红色”的饱和度降低几点，再在“锐化”图层上用径向蒙版让眼睛保持清晰。',
        },
      ],
      workedExamples: [
        {
          title: '四个图层处理的24 MP风景照',
          body: '一张6000 x 4000的JPEG（24 MP，9.6 MB）依次添加：+0.5 EV的“曝光度”图层；“高光”-60、“阴影”+30的“影调”图层；放在天空线性渐变蒙版下、“蓝色”饱和度+20的HSL图层；以及数量120、半径1.0、阈值4的“锐化”图层。预览基于1920 x 1280的副本运行；导出时，服务器会渲染全部像素，共24 MP。以质量92导出为JPG后，文件约10.8 MB，消耗一次常规任务；如果使用免费账号，12 MP的上限会把它缩小到4243 x 2828，约5.4 MB。',
        },
        {
          title: '访客编辑一张12 MP手机照片',
          body: '不登录的情况下，一张来自手机的4032 x 3024 JPEG（12.2 MP，3.1 MB）先把“白平衡”的“色温”设为-30，再在脸部添加一个带画笔蒙版、+0.8 EV的“曝光度”图层，然后涂抹两处灰尘斑点，点按一次“修复”就全部修好（一次AI任务）。以质量85导出为WebP时，图片会缩小到访客的12 MP上限，约4000 x 3000，按每MP 0.3 MB计算约3.6 MB。在点按“修复”之前，项目一直保存在IndexedDB中；点按时，照片会作为访客任务上传。',
        },
      ],
      whenNotToUse: 'Aperture使用参数化图层逐张编辑照片，因此不适合逐像素绘画、添加文字和形状叠加、合成两张照片或绘图。如果你只需要更小的文件，图片压缩工具一步就能完成，无需打开编辑器；如果你需要透明背景的抠图，背景移除工具会直接返回PNG；如果你想在发布前去除位置数据，EXIF移除工具比导出时把元数据设为“移除”更快。超过25张照片的批量编辑也超出了它的限制。',
      whyMediaManipulator: [
        'Aperture是Media Manipulator的一部分，因此图片转换、压缩、背景移除和这个编辑器共用同一个账号、历史记录和套餐限制。',
        '编辑器以全屏打开，画布内没有广告、没有水印，也没有升级推销；套餐限制只决定导出尺寸、可保存的项目数和批量处理的数量。',
        '计算方法毫无保留：本网站的每个工具页面都写明了其滑块运行的确切公式，并附有实际数字演算，让你清楚数值40到底做了什么。',
      ],
      privacyNote: '没有账号时，整个编辑器都在此浏览器中运行：照片及其图层堆栈保存在你设备上的IndexedDB中，在你导出、点按“选择主体”或点按“修复”之前不会上传任何内容；这几种操作都会把照片作为普通访客任务发送到我们的服务器。登录后，原图、它的1920 px预览图和缩略图会随项目一起按你的保留期限设置存储，并在删除项目或账号时一并删除。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。主体蒙版和修复在我们自己运营的GPU上运行；不会把任何照片发送给第三方。',
      faq: [
        {
          question: 'Aperture是破坏性编辑器吗？',
          answer: '不是。原始文件永远不会被修改。每处更改都是图层上的一个参数，图层堆栈以一个小型JSON文档的形式保存在照片旁边，导出时会写入一个新文件，在扩展名前加上retouched一词。',
        },
        {
          question: '一张照片最多可以有多少个图层和蒙版？',
          answer: '最多64个调整图层，每个图层都有各自0到100%的不透明度、“正常”、“明度”或“颜色”混合模式，以及一个可选蒙版；蒙版可以由任意数量的渐变、径向、画笔、明亮度、颜色范围或主体组件构成。',
        },
        {
          question: '我能导出的最大照片是多少？',
          answer: '访客和免费账号最高可导出12 MP；更大的原图会被缩小以符合上限。Premium和Pro最高可导出120 MP，导出对话框提供“原始”、12、24、64或120 MP作为上限选项。',
        },
        {
          question: '哪些操作会计入我的每日额度？',
          answer: '每次导出计为一次常规任务；对某张照片首次使用“选择主体”计为一次常规任务（完全相同的重复操作会命中缓存，不计次数）；每次点按“修复”计为一次AI任务。滑块、撤销、预设以及其他五种蒙版类型都不消耗额度。具体的每日数量见价格页面。',
        },
        {
          question: '可以打开iPhone拍的HEIC照片吗？',
          answer: '登录后可以。浏览器本身无法解码HEIC、HEIF、TIFF或BMP，因此由服务器为编辑器生成一份预览副本；JPG、PNG、WebP、GIF和AVIF无需账号即可直接打开。',
        },
        {
          question: '导出的照片会和预览完全一样吗？',
          answer: '在已记录的容差范围内一致。颜色调整在最坏情况下相差几个8位色级，通常完全相同；颗粒逐位一致。预览基于1920 px副本计算，因此在完整尺寸下，非常精细的锐化或降噪效果可能略有不同，这也是为什么以导出结果为准。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'HEIC、HEIF、TIFF和BMP需要账号：浏览器无法解码这些格式，所以由服务器把它们解码成预览副本。其他格式在本地打开。',
          '对话框中显示的每MP近似导出大小：质量92的JPG约0.45 MB，WebP约0.3 MB，AVIF约0.2 MB，照片存为PNG约2.5 MB，TIFF约3.0 MB。',
        ],
      },
      related: [
        {
          label: '提亮图片',
          to: '/tools/brighten-image',
          description: '线性光下的曝光度与“亮度”、“阴影”滑块之间的区别，并附上背后的数字。',
        },
        {
          label: '曲线',
          to: '/tools/photo-curves',
          description: '每个通道最多16个控制点，构成单调三次曲线，并采样为256项的查找表。',
        },
        {
          label: '去除瑕疵',
          to: '/tools/remove-blemishes',
          description: '涂抹斑点，点按“修复”，图像补全模型就会在我们的GPU上把它们填好。',
        },
        {
          label: '按颜色选择',
          to: '/tools/select-by-color',
          description: '用吸管拾取一种颜色，把任意图层限定在与它的Lab距离以内的像素上。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '如果你只需要更小的文件而不需要修图，压缩工具更快。',
        },
        {
          label: 'Aperture教程',
          to: '/tutorials/aperture',
          description: '从打开照片到完成导出，带你完成第一次编辑。',
        },
      ],
      embed: {
        title: '打开编辑器',
        description: '将JPG、PNG、WebP、GIF、HEIC、AVIF、TIFF或BMP照片拖放到此处，或从设备中选择，编辑器会以全屏打开，最前面是“基本”面板。',
      },
    },
    'brighten-image': {
      name: '提亮图片',
      h1: '在线提亮图片',
      tagline: '用线性光下真正的曝光度控制提亮偏暗的照片，或用亮度和阴影做更温和、更有针对性的调整。',
      metaTitle: '在线提亮图片：曝光度、亮度、阴影 | Aperture',
      metaDescription: '在浏览器中提亮偏暗的照片。以EV档为单位的曝光度、亮度滑块和阴影恢复，实时预览并以完整分辨率导出。',
      ogTitle: '在线提亮图片',
      ogDescription: '提亮暗照片的三种方法：线性光下以EV档为单位的曝光度、亮度和阴影恢复。实时预览，完整分辨率导出。',
      intro: '提亮一张偏暗的照片有三种不同的方法，效果并不一样。Aperture“基本”面板中的“曝光度（EV）”滑块在线性光下工作，与相机的一档曝光相同：+1 EV会让每个像素的光量加倍，因此阴影和中间调按比例上升，而本来就亮的区域会更早溢出成纯白。“亮度”滑块则是在sRGB值上加一个固定量，对黑色的提升最大，画面看起来更平。“影调”组中的“阴影”滑块只提升暗部，按明亮度加权，高光保持不动。本页用具体数字讲解每种方法背后的数学原理，帮你为眼前这张照片选对工具。',
      whatItDoes: [
        '“曝光度（EV）”范围为-5到+5：把每个通道从sRGB解码到线性光，乘以2的EV次方，加上“偏移”，重新编码，然后应用“灰度系数”。一档就是加倍，与相机上完全一样。',
        '“光线”组中的“亮度”范围为-100到+100：在对比度步骤之前，把数值除以200后加到sRGB通道上，因此+50会给每个还有余量的像素加上0.25，在8位刻度上约为64级。',
        '“影调”组中的“阴影”范围为-100到+100：一种按明亮度加权的提亮，在纯黑处最强，到亮度值为0.6时减弱为零，并且三个通道一起缩放，所以颜色的色相保持不变。',
        '每个控件都是独立的调整图层，因此+1 EV的图层和“阴影”+40的图层可以分别添加蒙版、设置混合模式和关闭。',
        '面板下方的直方图会随拖动实时更新，你可以看到右边缘何时开始在纯白处堆积，在任何像素溢出之前及时回调。',
      ],
      flowSteps: [
        {
          title: '打开偏暗的照片',
          description: '拖放JPG、PNG、WebP或AVIF文件；登录后还可打开HEIC和TIFF。最前面是“基本”面板。',
        },
        {
          title: '设置曝光度',
          description: '一边观察直方图，一边把“曝光度（EV）”向+1拖动。当中间调落到你想要的位置时就停下，即使最暗的角落仍然发闷也没关系。',
        },
        {
          title: '打开阴影',
          description: '用“影调”组中的“阴影”处理剩下的暗部。它只作用于亮度值低于0.6的像素，因此天空和皮肤高光保持不动。',
        },
        {
          title: '检查并导出',
          description: '按住反斜杠键与原图对比，然后导出。服务器会用同样的两个公式，以完整尺寸重新渲染原图。',
        },
      ],
      advancedDetails: [
        '每个通道的曝光度计算：linear = 对v进行sRGB解码，然后把linear乘以2的EV次方、再加上“偏移”，用clamp限制在0到1之间，编码回sRGB，再取1 / Gamma次方。解码时，低于0.04045用v / 12.92，高于此值用((v + 0.055) / 1.055)的2.4次方。',
        '因为乘法是在线性光下进行的，0.5（255级中的128）的中灰在+1 EV时变为0.686（175），+1.5 EV时变为0.801（204），+2 EV时变为0.934（238）；而0.8（204）在+1 EV时就已经溢出到1.0。',
        '“亮度”和“对比度”共用一个图层：v = clamp(v + brightness / 200)，然后计算(v - 0.5)乘以2的(contrast / 50)次方再加0.5。“对比度”为0时第二步是恒等变换，因此“亮度”+25会给每个还有余量的通道精确加上0.125。',
        '“阴影”：设L为BT.709亮度值，权重为1 - smoothstep(0, 0.6, L)，亮度值变化量为0.25乘以shadows / 100再乘以该权重。新亮度值除以旧亮度值（下限为0.0001）的比值用来缩放三个通道，因此亮度值为0.1的像素权重为0.926，在“阴影”+50时升至0.216。',
        '预览由你的GPU（WebGL2）根据1920 px副本绘制；导出的文件则由我们的服务器根据原图以完整分辨率、用同样的公式渲染，两者的差异在一个已记录的小容差之内，最多几个8位色级（颗粒完全一致）。单独的曝光度调整通常可以精确到同一级。',
        '“偏移”（-0.5到+0.5）在乘法之后于线性光下相加，这就是为什么0.05这样的小数值会把纯黑0变成0.248（63）：它抬高的是黑色下限，而不是整体提亮，主要用于哑光风格。',
      ],
      whyItMatters: [
        '在sRGB空间中提亮（许多快速工具就是这样做的）会压缩高光，让偏暗的照片显得发灰；线性光下的曝光度调整则能保留相机记录下的影调关系。',
        '曝光不足的手机照片，阴影里通常还有可用的数据；先把曝光提高一档，再打开阴影，就能找回细节，而简单粗暴地整体加亮度只会把这些细节变成一团糊。',
        '弄清其中的区别能节省时间：如果中间调合适、只有角落偏暗，只需调“阴影”这一个滑块；如果整张都暗，就调“曝光度”。',
      ],
      useCases: [
        {
          title: '拍暗了的室内照片',
          description: '“曝光度”+1.2 EV加上“阴影”+40，就能救回一张昏暗的客厅照片；台灯的高光会溢出，所以在台灯周围添加一个径向蒙版，把“曝光度”图层在蒙版内减去。',
        },
        {
          title: '逆光人像',
          description: '把“曝光度”保持为0，让窗户保持白色而不是过曝，再为脸部添加一个“阴影”+60的“影调”图层；或者在“曝光度”+1的图层上，用画笔蒙版涂抹脸部。',
        },
        {
          title: '扫描出来发灰的照片',
          description: '如果扫描件整体偏暗却没有真正的黑色，用“亮度”-10配合“对比度”+20比调曝光效果更好，因为问题出在黑色下限被抬高，而不是光线不足。',
        },
        {
          title: '截图或扁平图形',
          description: '对于纯色填充的图形，“亮度”+15会给每种颜色加上相同的0.075，让填充保持均匀；而改曝光度会让它们变化得不均匀。',
        },
      ],
      workedExamples: [
        {
          title: '一张昏暗的12 MP餐厅照片：+1 EV加阴影',
          body: '一张4000 x 3000的JPEG（12 MP，4.2 MB），在最暗的角落、一件夹克、一块桌布和一支蜡烛上取样，数值分别为20、60、128和200。单独使用“曝光度”+1 EV会把它们映射为31、85、176和255：蜡烛溢出了。在其上方添加一个“阴影”+30的“影调”图层，三个暗部被提升到48、93和176，蜡烛仍为255。如果改为把曝光度回调到+0.7 EV，得到的是28、77、160和248，蜡烛完好无损。以质量92导出为JPG：约5.4 MB，消耗一次常规任务，12 MP恰好符合访客上限。',
        },
        {
          title: '同一张6 MP扫描件：亮度与曝光度对比',
          body: '一张3000 x 2000的TIFF扫描件（6 MP，36 MB，需登录打开），影调分别为20、60、128和200。“亮度”+30把它们变为58、98、166和238，处处大致加了相同的38级，所以黑色边框变成了灰色。“曝光度”+1.2 EV则把它们变为34、91、187和255，边框保持接近黑色，但最亮的影调溢出了。折中的做法是“曝光度”+1 EV加“影调”的“黑色色阶”+20，从20、60、128和200得到35、85、176和255。6 MP的结果导出为PNG约15 MB；以质量90导出为WebP约1.8 MB。',
        },
      ],
      whenNotToUse: '如果照片已经足够亮，只是看起来发闷，那根本不需要提亮；对比度页面或一条曲线才是正确的解决办法，增加曝光只会把高光推成纯白。阴影是一片死黑、没有任何纹理的照片，任何滑块都救不回来，因为8位JPEG不会存储低于零的数据。如果照片只是四角偏暗，用负数量的“晕影”滑块进行按边缘加权的提亮，比全局调整曝光更干净。',
      whyMediaManipulator: [
        'Aperture把三种提亮控件都作为独立图层提供，而不是只有一个亮度滑块，并且每个图层都可以用蒙版限定范围。',
        '预览、导出和移动应用使用相同的公式，每次部署时服务器都会与基准渲染图进行比对。',
        '直方图和按住对比的按键始终在屏幕上，因此你是对照原图判断提亮效果，而不是凭记忆。',
      ],
      privacyNote: '提亮是逐像素的算术运算，因此在你导出之前完全在浏览器中运行：除非你登录或使用“选择主体”或“修复”，否则偏暗的照片及其“曝光度”、“光线”和“影调”图层都保存在你设备上的IndexedDB中。导出时，原图只上传一次，由我们的服务器用相同的公式渲染，结果像其他任务一样保留。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。不会有任何第三方收到这张图片。',
      faq: [
        {
          question: '+1 EV对一个像素做了什么？',
          answer: '它让像素在线性光下加倍。在sRGB刻度上这并不是加倍：0.5变为0.686，0.2变为0.285，0.8则溢出到1.0。乘法之后数值会被限制在0到1之间，因此任何超过白色的部分都会丢失，除非你降低曝光或给该区域加蒙版。',
        },
        {
          question: '为什么“亮度”看起来比“曝光度”更平？',
          answer: '“亮度”在sRGB中给每个通道加上相同的量：+25会给0的黑色和0.5的灰色同样加上0.125，于是黑色下限上升，画面失去对比度。“曝光度”在线性光下做乘法，暗部相对于亮部依然保持暗。',
        },
        {
          question: '提亮到什么程度会开始崩坏？',
          answer: '大约+1.5 EV以内，8位JPEG通常还能撑住，不过阴影噪点会变得明显。超过+2 EV后，平滑的渐变中会出现色带，因为文件本来就只有256个色级。“细节”面板中的“降噪”和“颗粒”图层可以掩盖其中一部分。',
        },
        {
          question: '可以只提亮照片的一部分吗？',
          answer: '可以。添加“曝光度”图层，然后给它加一个蒙版：线性渐变用于偏暗的前景，画笔用于脸部，明亮度范围用于低于所选亮度的所有区域，“选择主体”用于主要对象。调整只会作用在蒙版为白色的地方。',
        },
        {
          question: '提亮会改变颜色吗？',
          answer: '“曝光度”和“阴影”会同时缩放红、绿、蓝三个通道，因此在某个通道溢出之前色相都能保持。“亮度”也是给三个通道加上相同的量，这会让鲜艳的颜色在接近白色时略微变淡。如果看到色偏，降低数量，或把图层混合模式切换为“明度”。',
        },
        {
          question: '导出的照片提亮幅度和预览完全一样吗？',
          answer: '是的，相差在一两个8位色级之内。服务器在完整分辨率的原图上运行完全相同的曝光度解码、乘法和编码，不超过4 MP的照片使用float64，部署时的自检会将其与存储的基准渲染图进行核对。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '“曝光度”和“影调”都是不涉及邻域的逐像素运算，因此无论尺寸多大，预览都能即时呈现，导出时间主要花在文件的解码和编码上。',
          '提亮8位源文件无法凭空生成在相机中已被压成死黑的细节；记录为0, 0, 0的区域保持中性，只有用“偏移”或“亮度”才能把它抬起来。',
        ],
      },
      related: [
        {
          label: '修正曝光',
          to: '/tools/fix-photo-exposure',
          description: '同样的“曝光度”和“影调”控件，用于处理过曝和欠曝的照片，并可恢复高光。',
        },
        {
          label: '调整对比度',
          to: '/tools/adjust-image-contrast',
          description: '提亮后画面发平怎么办：“对比度”滑块、“影调”和“曲线”。',
        },
        {
          label: '色阶',
          to: '/tools/photo-levels',
          description: '当直方图没有延伸到两端时，设置输入黑场和白场。',
        },
        {
          label: '曲线',
          to: '/tools/photo-curves',
          description: '在曲线上用一个控制点提亮阴影，完全掌控提亮的形状。',
        },
        {
          label: '降低图片噪点',
          to: '/tools/reduce-image-noise',
          description: '清除大幅提高曝光后显露出来的阴影噪点。',
        },
      ],
      embed: {
        title: '提亮照片',
        description: '将偏暗的照片拖放到此处。编辑器打开后，最前面是“基本”面板，“曝光度（EV）”滑块已准备就绪。',
      },
    },
    'adjust-image-contrast': {
      name: '调整对比度',
      h1: '在线调整图片对比度',
      tagline: '围绕中间灰度的对比度滑块，加上影调和曲线，让你在增加对比度的同时不压死两端。',
      metaTitle: '在线调整图片对比度：滑块、影调或曲线 | Aperture',
      metaDescription: '在浏览器中增加或降低图片对比度。对比度滑块围绕中间灰度调整；影调和曲线让你控制形状。以完整尺寸导出。',
      ogTitle: '在线调整图片对比度',
      ogDescription: '用一个滑块围绕中灰调整对比度，或用“影调”和“曲线”塑造对比度的形状。实时预览，完整分辨率导出。',
      intro: '对比度是照片中暗部与亮部影调之间的距离。在Aperture中，“基本”面板“光线”组里的“对比度”滑块会把每个通道相对于中灰的距离拉伸2的(contrast / 50)次方倍：+50让与0.5的距离加倍，-50让它减半，而0.5本身永远不动。这是一件粗放的工具，处理发平的扫描件或雾蒙蒙的手机照片时正合适，而当高光已经接近白色时却恰恰不合适。针对这些情况，本页还会介绍“影调”组和“曲线”面板：前者用明亮度权重把“高光”和“阴影”向两侧推开来增加对比度，后者让你用最多16个控制点画出任意陡度的S形曲线。三者都是独立的图层，都可以添加蒙版。',
      whatItDoes: [
        '“光线”组中的“对比度”范围为-100到+100：把每个通道与0.5的距离乘以2的(contrast / 50)次方，因此+50的系数是2，+100是4，-50是0.5。',
        '与“亮度”共用一个图层，且“亮度”先加上；把“亮度”微调几点，实际上就移动了支点，这样在提高对比度时就能避免中间调变暗。',
        '用“影调”调对比度是另一种选择：“高光”调正、“阴影”调负，用平滑的明亮度权重把两端推开；由于它同时缩放三个通道，每个像素的色相都得以保持。',
        '用“曲线”是更精确的选择：经过(0.25, 0.2)和(0.75, 0.8)的S形曲线是一种温和的对比度提升，而且仍然能到达范围的两端，因为曲线固定了0和1两个端点。',
        '降低对比度（负值）是真正的褪色效果：-50把黑色映射到0.25、白色映射到0.75，呈现哑光相纸的观感，而且不会有任何溢出。',
      ],
      flowSteps: [
        {
          title: '打开照片',
          description: '拖放图片，留意直方图：发平的照片中间有一个隆起，两端都是空的。',
        },
        {
          title: '先试滑块',
          description: '把“对比度”提高到+30左右。如果画面还没调好，直方图就已经溢出了任意一端，就停下来，进入下一步。',
        },
        {
          title: '用影调或曲线塑形',
          description: '把“对比度”调回0，改用“高光”+30配合“阴影”-30，或在RGB曲线上拖出一条S形。两种方法都会让最两端保持原位。',
        },
        {
          title: '导出',
          description: '与原图对比后，以完整分辨率导出。服务器会在原始像素上执行同样的乘法、同样的权重或同样的曲线查找表。',
        },
      ],
      advancedDetails: [
        '“光线”图层先计算v = clamp(v + brightness / 200)，再计算v = clamp((v - 0.5)乘以2的(contrast / 50)次方 + 0.5)，按通道在sRGB空间中进行，没有明亮度加权。',
        '常用数值对应的系数：+20为1.32，+25为1.41，+30为1.52，+40为1.74，+50为2.0，+100为4.0；-25为0.71，-30为0.66，-50为0.5。在+50及以上，任何与中灰的距离超过0.5 / 系数的像素都会溢出，因此在+50时，低于0.25的一切都变成黑色，高于0.75的一切都变成白色。',
        '“影调”对比度：设L为BT.709亮度值，“高光”对亮度值的贡献为0.25乘以highlights / 100再乘以smoothstep(0.4, 1, L)，“阴影”的贡献为0.25乘以shadows / 100再乘以(1 - smoothstep(0, 0.6, L))；新亮度值与旧亮度值之比用来缩放R、G和B，因此单个滑块在最大强度下的最大偏移量为整个范围的四分之一。',
        '“曲线”通过你设置的控制点构建一条单调三次曲线，生成256项的查找表，因此S形曲线永远不会让影调反转。查找表先按通道采样（红、绿、蓝曲线），再经过RGB主曲线。',
        '预览由你的GPU（WebGL2）根据1920 px副本绘制；导出的文件则由我们的服务器根据原图以完整分辨率、用同样的公式渲染，两者的差异在一个已记录的小容差之内（最多几个8位色级；颗粒完全一致）。“对比度”、“影调”和“曲线”都是逐像素运算，属于能精确到同一级的运算。',
        '把“光线”图层的混合模式切换为“明度”，就只应用亮度值变化而不改变色度，这样当某个通道先于其他通道溢出时，高饱和的像素就不会发生色相偏移。',
      ],
      whyItMatters: [
        '用简单的乘法提高对比度，是让雾蒙蒙的照片变清透最快的方法，也是让天空或白衬衫丢失细节最快的方法；知道溢出的临界点在哪里，你就能在那之前停下。',
        '降低对比度本身就是一种正当的风格，而不只是需要撤销的失误；用把黑色映射到0.25、白色映射到0.75的公式来实现，就能得到可重复的哑光效果。',
        '在sRGB空间中按通道调整对比度会改变饱和度：增加对比度时，饱和的颜色更饱和；降低对比度时，它们会变暗淡。按明亮度加权的“影调”图层则可以避免这一点。',
      ],
      useCases: [
        {
          title: '雾蒙蒙的风景照',
          description: '“对比度”+30配合“亮度”-5即可找回层次感；如果天空溢出，改用“细节”面板中的“去朦胧”+40，它基于每个15 x 15邻域中最暗的通道工作，而不是把所有影调一起拉伸。',
        },
        {
          title: '发平的扫描文档或照片',
          description: '先用“对比度”+40，再用“色阶”把“输入黑场”设为0.08、“输入白场”设为0.92，纸张立刻变白，墨迹立刻变黑。',
        },
        {
          title: '正午强光下的人像',
          description: '在脸部用画笔蒙版限定的图层上设置“对比度”-20，柔化皮肤上的光线，背景则保持原有的冲击力。',
        },
        {
          title: '哑光胶片风格',
          description: '“对比度”-35把黑色抬到0.19、白色降到0.81，再用“分离色调”为高光添加暖色、为阴影添加冷色，完成整体风格。',
        },
      ],
      workedExamples: [
        {
          title: '“对比度”+25处理一张发平的20 MP阴天照片',
          body: '一张5472 x 3648的JPEG（20 MP，7.1 MB），影调为40、90、128、166和215，都远在范围之内。“对比度”+25对应系数1.414，把它们映射为4、74、128、182和251：两端现在几乎碰到黑白，中间调保持不变。在+40（系数1.74）时，同样的影调变为0、62、128、195和255，因此最暗和最亮的区域会溢出。在付费套餐中，以质量92导出为JPG，完整的20 MP文件约9 MB；访客12 MP的上限会把它缩小到约4243 x 2828，约5.4 MB。',
        },
        {
          title: '“对比度”-35为一张8 MP人像做哑光褪色',
          body: '一张3264 x 2448的JPEG（8 MP，2.9 MB）。“对比度”-35对应系数0.616。纯黑0变为49，40的阴影变为74，中灰保持128，215的高光变为181，纯白变为206。整张照片现在都位于49到206之间。再添加一个“黑色色阶”-30的“影调”图层，把最深的影调拉回接近0（10变为0，30变为24，60和128保持不变），让褪色效果仍有扎实的暗部基础。以质量85导出为WebP，8 MP的结果约2.4 MB，消耗一次常规任务。',
        },
      ],
      whenNotToUse: '如果照片发平是因为雾气或眩光，而不是影调范围太窄，那么“细节”面板中的“去朦胧”更合适，因为它会根据局部暗通道估算并减去一层雾幕，而不是拉伸所有影调。如果照片发平只是因为太暗，请先提高曝光；在偏暗的画面上再加对比度，只会让阴影更加死板成块。如果直方图的一侧已经溢出，任何对比度滑块都无法挽回，所以在动“对比度”之前，先降低“高光”或“白色色阶”。',
      whyMediaManipulator: [
        '三种增加对比度的方法都在同一个编辑器中，你可以先用滑块，再转到“影调”或“曲线”，无需重新上传。',
        '在Aperture中，每次对比度调整都是一个带不透明度的图层，因此略显过头的+50只需拖动一下，就能变成70%不透明度的+50，而不必去猜一个新数值。',
        'Media Manipulator记录了每个滑块数值对应的实际倍数，因此同一个对比度设置在每张照片上的含义都相同。',
      ],
      privacyNote: '对比度调整会把每个像素与中灰的距离乘以一个系数，在你导出之前，这个乘法都在你自己的显卡上完成；作为访客，照片一直保留在此浏览器中，在此之前不会发送到任何地方。完整分辨率的渲染是在我们自己运营的硬件上运行的服务器任务。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。任何内容都不会发送给第三方服务。',
      faq: [
        {
          question: '为什么移动“对比度”时中灰不变？',
          answer: '因为公式以0.5为支点：先减去这个值，乘以系数，再加回来，而(0.5 - 0.5)乘以任何系数都仍然是0。比它亮的一切按相同比例向白色移动，比它暗的一切按相同比例向黑色移动。',
        },
        {
          question: '“对比度”滑块调到多少会开始溢出？',
          answer: '如果照片已经覆盖到两端，任何正值都会让一部分溢出。在+25（系数1.41）时，低于0.146或高于0.854的影调会溢出；在+50（系数2）时，临界值是0.25和0.75；在+100（系数4）时，只有0.375到0.625之间的影调能保留下来。如果直方图碰到了边缘，请改用“影调”或“曲线”。',
        },
        {
          question: '该用“对比度”还是“清晰度”？',
          answer: '“对比度”是全局的影调调整。“细节”面板中的“清晰度”是局部对比度：它把像素与其邻域模糊副本之间的差值加回去，并偏重中间调。“清晰度”让纹理更突出，而不会移动直方图的两端；“对比度”则会移动整个分布。',
        },
        {
          question: '如何降低对比度又不让照片显得发白褪色？',
          answer: '使用较小的负对比度，比如-15，然后用“影调”的“黑色色阶”-20把黑色找回来，让最暗的影调回到底部。这样既保留了扎实的黑场，又压缩了中间调，看起来是柔和而不是雾蒙蒙的。',
        },
        {
          question: '这个滑块会改变饱和度吗？',
          answer: '会，略有改变，因为它在sRGB中按通道工作：通道值为200, 120, 80的颜色在+30时变为237, 116, 56，各通道之间的差距变大了。如果你只想改变影调而不改变颜色，把图层混合模式设为“明度”。',
        },
        {
          question: '“对比度”和“色阶”有什么区别？',
          answer: '“色阶”会明确指定输入黑场、白场和中间调的gamma，因此由你精确决定哪些影调变成0和1。“对比度”则围绕0.5应用一个对称的系数。直方图偏向一侧时，“色阶”更合适；直方图居中时，“对比度”更快捷。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '对比度乘法以浮点数逐像素计算，因此除了源文件本身和所选输出质量带来的色带之外，导出结果不会产生额外的色带。',
          '对8位源文件施加很高的正对比度，会把现有的色级拉开；在+100时，保留下来的0.375到0.625范围内只有64个源色级，因此渐变可能出现色带。',
        ],
      },
      related: [
        {
          label: '曲线',
          to: '/tools/photo-curves',
          description: '每个通道最多用16个控制点，精确画出对比度的形状。',
        },
        {
          label: '色阶',
          to: '/tools/photo-levels',
          description: '对照直方图按通道设置黑场和白场，是处理影调范围偏向一侧的合适工具。',
        },
        {
          label: '修正曝光',
          to: '/tools/fix-photo-exposure',
          description: '如果问题在于整体亮度而不是影调范围，请从这里开始。',
        },
        {
          label: '黑白照片',
          to: '/tools/black-and-white-photo',
          description: '用通道滑块转换为单色，这时对比度的取舍最为关键。',
        },
        {
          label: '锐化照片',
          to: '/tools/sharpen-photo-online',
          description: '通过USM锐化（非锐化蒙版）提升边缘对比度，而不是影调对比度。',
        },
      ],
      embed: {
        title: '更改对比度',
        description: '将发平或反差过强的照片拖放到此处。“基本”面板会打开到“光线”组，“对比度”滑块就在那里。',
      },
    },
    'fix-photo-exposure': {
      name: '修正曝光',
      h1: '修正曝光过度或不足的照片',
      tagline: '以档为单位设置曝光度，再分别找回高光和阴影，同时用直方图查看还剩下多少可用信息。',
      metaTitle: '在线修正曝光过度或不足的照片 | Aperture',
      metaDescription: '在浏览器中校正照片曝光：以EV档为单位的曝光度，加上高光、阴影、白色色阶和黑色色阶恢复，配有实时直方图和完整分辨率导出。',
      ogTitle: '在线修正曝光过度或不足的照片',
      ogDescription: '以档为单位的曝光度，加上“高光”、“阴影”、“白色色阶”和“黑色色阶”恢复，配有实时RGB直方图。以完整分辨率导出。',
      intro: '曝光问题就是直方图问题：数据堆积在右边缘（曝光过度）或左边缘（曝光不足），解决办法是把它挪回中间，同时不丢掉仍然保留着的信息。在Aperture中，这需要“基本”面板里的两个图层。“曝光度（EV）”在线性光下以整档或零点几档为单位整体移动画面，从而重新定位那堆数据。“影调”组再分别处理两端：“高光”和“白色色阶”压缩或扩展亮部，“阴影”和“黑色色阶”处理暗部，每一项都带有明亮度权重，因此中间调几乎不受影响。面板下方的实时RGB和亮度直方图会告诉你数据堆何时不再贴着边缘，而按住对比的按键会告诉你是否调过头了。',
      whatItDoes: [
        '“曝光度（EV）”范围为-5到+5，在线性光下以档为单位移动整张照片，与相机使用的单位相同：-1 EV让光量减半，会把255的溢出白色变成188的平板灰色，其中没有任何细节，并把230变成168。',
        '“高光”范围为-100到+100，压缩或打开亮度值高于0.4的影调，在白色处达到最大强度；-100把纯白降到0.75，中灰则保持在0.48。',
        '“阴影”范围为-100到+100，对从黑色到亮度值为0.6的范围做同样的处理；+100把0.05的近黑提升到0.295，而0.5只移动到0.519。',
        '“白色色阶”和“黑色色阶”是作用范围更窄、强度更弱的版本，分别针对两端的最后四分之一：“白色色阶”作用于亮度值高于0.75的部分，“黑色色阶”作用于低于0.25的部分，最大偏移量都是0.15。',
        '直方图显示当前预览的红、绿、蓝和亮度计数，因此即使整体画面看起来没问题，单个通道的溢出（一朵红花、一片蓝天）也一目了然。',
      ],
      flowSteps: [
        {
          title: '读懂直方图',
          description: '打开照片，看数据集中在哪里。最右端的尖峰表示高光溢出；最左端的尖峰表示暗部死黑。',
        },
        {
          title: '调整曝光度',
          description: '以半档为步长拖动“曝光度（EV）”，直到中间调看起来合适。暂时不用管两端，那是下一步的事。',
        },
        {
          title: '找回两端',
          description: '对于曝光过度的照片，把“高光”调为负值；如果最亮的区域仍然发平，再把“白色色阶”调为负值。对于曝光不足的照片，提高“阴影”，必要时再提高“黑色色阶”。',
        },
        {
          title: '检查并导出',
          description: '确认直方图不再碰到边缘，按住反斜杠键与原图对比，然后以完整分辨率导出。',
        },
      ],
      advancedDetails: [
        '“曝光度”先把sRGB解码为线性值（低于0.04045时为v / 12.92，否则为((v + 0.055) / 1.055)的2.4次方），乘以2的EV次方，加上“偏移”，限制在0到1之间，重新编码，再应用1 / Gamma。溢出是不可逆的：文件中已经是1.0的通道不含任何隐藏数据，因此-1 EV会把它变成平板的0.735（188）。',
        '“影调”把L计算为BT.709亮度值（0.2126 R + 0.7152 G + 0.0722 B），并计算四个权重：“阴影”为1 - smoothstep(0, 0.6, L)，“高光”为smoothstep(0.4, 1, L)，“黑色色阶”为1 - smoothstep(0, 0.25, L)，“白色色阶”为smoothstep(0.75, 1, L)；其中smoothstep(a, b, x)等于t的平方乘以(3 - 2t)，t = (x - a) / (b - a)并经过限制。',
        '亮度值变化量为：0.25乘以(shadows / 100)乘以其权重，加0.25乘以(highlights / 100)乘以其权重，加0.15乘以(blacks / 100)乘以其权重，再加0.15乘以(whites / 100)乘以其权重。经过限制的新亮度值除以旧亮度值（下限为0.0001），用这个比值同时缩放R、G和B，因此“影调”永远不会改变色相。',
        '几个亮度值值处的权重：L = 0.1时，“阴影”为0.926，“黑色色阶”为0.648；L = 0.5时，“阴影”和“高光”都是0.074；L = 0.8时，“高光”为0.741，“白色色阶”为0.104；L = 0.9时，“高光”为0.926，“白色色阶”为0.648。',
        '预览由你的GPU（WebGL2）根据1920 px副本绘制；导出的文件则由我们的服务器根据原图以完整分辨率、用同样的公式渲染，两者的差异在一个已记录的小容差之内，最多几个8位色级（颗粒完全一致）。“曝光度”和“影调”是纯粹的逐像素运算，因此处在该容差中完全一致的那一端。',
        '直方图根据预览计算，因此反映的是1920 px副本；完整分辨率的导出具有相同的分布，因为这些公式是逐像素的，与图像尺寸无关。',
      ],
      whyItMatters: [
        '降低曝光过度照片的曝光，与恢复高光并不是一回事：乘法会把溢出的白色变成均匀的灰色，而“高光”压缩的是仍有纹理的明亮影调，并让溢出的色块保持原样，留待你用蒙版处理或直接接受。',
        '曝光不足的照片阴影里带有噪点；把“阴影”提升限定在亮度值低于0.6的范围内，就不会影响干净的中间调，而全局提高曝光则会把各处的噪点都放大。',
        '由于每项更改都是独立的图层，你可以给“曝光度”图层在过曝的窗户上加一个径向蒙版，同时让“影调”图层保持全局，真正的曝光修正通常就是这样完成的。',
      ],
      useCases: [
        {
          title: '过曝的海滩或雪景',
          description: '先“曝光度”-0.7 EV，再“高光”-50、“白色色阶”-20，把沙滩或雪地从纯白拉回到有纹理的0.7左右；真正纯白的镜面反光点保持白色。',
        },
        {
          title: '偏暗的演唱会或夜景照片',
          description: '先“曝光度”+1.5 EV，然后“高光”-40，保护被曝光推到边缘的舞台灯光，再用“阴影”+20提亮人群。',
        },
        {
          title: '背景中的窗户',
          description: '全局曝光保持不动，再添加第二个-1.5 EV的“曝光度”图层，用只覆盖窗户的线性渐变或画笔蒙版限定范围。',
        },
        {
          title: '相机测光测错了主体',
          description: '在明亮墙面前显得过暗的脸，用“曝光度”+0.5 EV配合“选择主体”蒙版，墙面就不会跟着变亮。',
        },
      ],
      workedExamples: [
        {
          title: '-0.7 EV加“高光”-50处理一张过曝的16 MP海滩照片',
          body: '一张4608 x 3456的JPEG（16 MP，6.0 MB），沙滩为245, 235, 220，中间调为128，阴影为30。“曝光度”-0.7 EV把沙滩映射为198, 189, 177，中间调为102，阴影为22。在其上方添加一个“高光”-50的“影调”图层，把沙滩进一步降到177, 170, 159，而中间调保持102，因为它在该亮度值处的权重低于0.1。文件中原本是纯255的区域，经过曝光这一步后会变成平板的188，因此用一个径向蒙版把太阳排除在外。以质量92导出为JPG，完整的16 MP文件约7.2 MB（付费套餐），在12 MP上限下约5.4 MB。',
        },
        {
          title: '+1.5 EV加“高光”-40处理一张欠曝的12 MP演唱会照片',
          body: '一张4000 x 3000的JPEG（12 MP，3.8 MB），人群影调为20和60，脸部为128，舞台灯光为180和200。“曝光度”+1.5 EV得到38、100、205、255和255：两盏灯都溢出了。在上面添加“高光”-40后得到38、100、186、229和229，灯光回到了白色以下，但由于在曝光这一步已经溢出，两盏灯最终完全一样。如果改为把曝光降到+1.2 EV，再加一个“阴影”+40的“影调”图层，三个暗部影调分别为56、100和187，而灯光仍然能区分开。以质量80导出为AVIF：约2.4 MB，消耗一次常规任务。',
        },
      ],
      whenNotToUse: '如果唯一的问题只是照片略显发平或发闷，既不太亮也不太暗，那你来错了页面：对比度工具或一条曲线能事半功倍。如果照片过曝到脸部或天空是一片纯白，任何滑块都无法找回纹理，因为JPEG根本没有存储这些信息；“修复”工具可以修补小块的过曝斑点，但过曝的天空只能换一张照片。如果曝光问题只出现在边缘，负数量的晕影比带蒙版的曝光度图层更简单。',
      whyMediaManipulator: [
        '曝光和恢复是各自带独立蒙版的独立图层，这是快速修图工具里的单个亮度滑块做不到的。',
        'Aperture始终显示RGB直方图，而不只是在导出对话框中显示，因此你是对照数据而不是对照显示器来修正曝光。',
        '同样的校正可以保存为预设，应用到同一次拍摄中以同样错误方式测光的其他照片上：免费账号每次3张，Pro每次25张。',
      ],
      privacyNote: '修正曝光时，“曝光度”和“影调”的运算在你自己的GPU上运行，因此你拖放到这里的照片会一直保留在浏览器中，直到你选择导出、选择主体或修复。导出时原图只上传一次，以便我们的服务器对每个像素应用相同的曝光档位和恢复权重，然后文件会像其他访客任务或账号任务一样保留。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。直方图在本地计算，永远不会发送到任何地方。',
      faq: [
        {
          question: 'JPEG中溢出的高光能恢复吗？',
          answer: '如果是真正溢出就不能。存储为255, 255, 255的像素已经没有任何信息，降低曝光只会把它变成平板的灰色（-1 EV时为188）。通常能恢复的是接近白色的区域，比如240到254，“高光”-60会把它们压缩到约205到217，同时保留纹理。RAW文件能保留更多信息，但编辑器处理的是浏览器能够解码的图像。',
        },
        {
          question: '“曝光度”和“影调”应该按什么顺序应用？',
          answer: '先“曝光度”，“影调”放在它上面。“影调”的权重取决于它接收到的亮度值，所以如果先恢复高光再提高曝光，恢复就不再针对正确的像素。图层自下而上应用，“基本”面板也是按这个顺序创建它们的。',
        },
        {
          question: '“高光”和“白色色阶”有什么区别？',
          answer: '“高光”从亮度值为0.4处开始，在1.0处达到最大强度，最大偏移量为0.25；“白色色阶”从0.75开始，最大偏移量为0.15。明亮的天空或皮肤用“高光”；当最亮的影调仍然发平时，用“白色色阶”做到达纯白之前的最后一步。',
        },
        {
          question: '为什么-1 EV不是简单地把像素值减半？',
          answer: '因为减半发生在线性光下，而文件是经过sRGB编码的。128的中灰变为92而不是64，230的亮部变为168。sRGB曲线会压缩亮部影调，因此一档的变化在范围上半部分看起来比下半部分小。',
        },
        {
          question: '这和自动曝光修正有什么不同？',
          answer: '“预设”面板中的“自动”风格会添加一组合理的起始图层，一步撤销即可移除。本页的滑块是手动版本，配有直方图和对比键，适用于自动猜测把主体判断错了的照片。',
        },
        {
          question: '修正曝光会改变照片的颜色吗？',
          answer: '“曝光度”在线性光下对三个通道做相同的缩放，“影调”按亮度值比值对它们做相同的缩放，因此在某个通道溢出之前，色相都能保持。如果提高曝光时夕阳失去了红色，说明红色通道溢出了，RGB直方图会在右边缘显示一个红色尖峰。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '恢复只对文件中仍然保留的影调有效；登录后打开的16位TIFF源文件，在压暗时比8位JPEG保留更多的高光层次。',
          '对JPEG大幅降低曝光，会暴露出原本隐藏在亮部的压缩块；以质量92或更高导出为JPG，可以避免再增加新的压缩痕迹。',
        ],
      },
      related: [
        {
          label: '提亮图片',
          to: '/tools/brighten-image',
          description: '更深入地讲解本页中曝光不足的那一半，包括“亮度”与“曝光度”的对比。',
        },
        {
          label: '色阶',
          to: '/tools/photo-levels',
          description: '直接对照直方图设置黑色和白色输入点。',
        },
        {
          label: '曲线',
          to: '/tools/photo-curves',
          description: '手动把曲线的高光端往下拉，得到更柔和的恢复形状。',
        },
        {
          label: '调整对比度',
          to: '/tools/adjust-image-contrast',
          description: '在恢复压缩了影调范围之后，重新找回冲击力。',
        },
        {
          label: '降低图片噪点',
          to: '/tools/reduce-image-noise',
          description: '清除大幅正向曝光后显露出来的阴影噪点。',
        },
        {
          label: '添加晕影',
          to: '/tools/add-vignette',
          description: '当只有边缘偏暗时，负数量的晕影可以提亮四角。',
        },
      ],
      embed: {
        title: '校正曝光',
        description: '将过亮或过暗的照片拖放到此处。“基本”面板打开后会显示“曝光度”和“影调”组，直方图就在下方。',
      },
    },
    'adjust-image-hue': {
      name: '调整图片色相',
      h1: '在线调整图片色相',
      tagline: '将照片中的每种颜色旋转最多180度，或只移动红色、绿色或蓝色，实时预览并以完整分辨率导出。',
      metaTitle: '在线调整图片色相：移动所有颜色或单个范围 | Media Manipulator',
      metaDescription: '将整张照片的色相移动-180到180度，或只移动红色、黄色、绿色、青色、蓝色或洋红。实时GPU预览，完整分辨率导出。',
      ogTitle: '在线调整图片色相 | Media Manipulator',
      ogDescription: '一次旋转所有色相，或把一个颜色范围微调几度。宽度和羽化控制每个范围覆盖多远；灰色保持不变。',
      intro: '色相是颜色在色轮上的角度。本页会打开Media Manipulator的照片编辑器Aperture，并把“颜色（HSL）”面板放在最前面，让你转动这个角度。这项调整是图层堆栈中的一个图层：每个像素先从sRGB转换为HSL，色相按“所有颜色”滑块旋转，再加上六个范围滑块针对该色相增加的量，结果转换回来并截断到有效范围。没有任何改动被烘焙进原图。你可以把“色相”拖到+30，让青绿色的海水偏向蓝色，在GPU预览中立即看到变化，然后导出一个由我们服务器基于原始像素渲染的文件。整体偏移180度会把每种颜色换成它的补色；范围偏移20度只移动一个色系，其余保持原样。',
      whatItDoes: [
        '“所有颜色”的“色相”滑块范围为-180到180度，把每个像素旋转相同的角度：+120把红色变成绿色，-120把红色变成蓝色，180或-180都会落到色轮的另一侧。',
        '六个命名范围，即0度的“红色”、60度的“黄色”、120度的“绿色”、180度的“青色”、240度的“蓝色”和300度的“洋红”，各有自己的“色相”“饱和度”和“明度”滑块，另有“宽度”和“羽化”决定范围覆盖多远。',
        '吸管会以你在照片中点击的任意颜色为中心添加一个自定义范围，一个图层最多32个范围，用它可以精确选中落在两个命名范围之间的某种橙色或紫色。',
        '范围调整在灰色上会逐渐淡出：HSL饱和度低于10%的像素只得到按比例缩小的偏移，因此移动“红色”时，水泥、白墙和阴影不会染上色偏。',
        '这个图层是非破坏性的，带不透明度、混合模式、可选蒙版和无限次撤销；你可以再叠加一个“颜色（HSL）”图层来处理第二个色系，预览满意后再导出。',
      ],
      flowSteps: [
        {
          title: '打开照片',
          description: '把JPG、PNG、WebP、GIF、HEIC、AVIF或TIFF拖放到上方的框中。编辑器会全屏打开，并选中“颜色（HSL）”。',
        },
        {
          title: '选择整体或范围',
          description: '拖动“所有颜色”的“色相”滑块做全局旋转，或者选择“红色”“黄色”“绿色”“青色”“蓝色”或“洋红”，只移动该范围。',
        },
        {
          title: '调整宽度和羽化',
          description: '加宽范围以覆盖相邻色相，或收窄范围以单独选中一种，再设置羽化，让偏移的边缘不露痕迹。',
        },
        {
          title: '导出',
          description: '选择JPG、PNG、WebP、AVIF或TIFF及质量；服务器会用同样的色相算法以完整尺寸重新渲染原图，并在文件名中加上(retouched)。',
        },
      ],
      advancedDetails: [
        '对每个像素，先取其HSL中的色相h、饱和度s和明度l。输出色相为h加上整体“色相”，再加上各范围的权重乘以该范围“色相”之和；饱和度为s乘以1 + 整体“饱和度”/100，再乘以各范围1 + 权重×范围“饱和度”/100的乘积；“明度”为正值时，l按数量×(1 - l)向1移动，为负值时按数量×l向0移动。结果转回RGB，并截断到0..1。',
        '当像素色相与范围中心之间的环形距离不超过“宽度”/2时，范围权重为1；在“羽化”区间内线性降到0；超过“宽度”/2 + “羽化”后为0。使用默认的“宽度”30和“羽化”30时，范围在中心两侧各15度以内为完全选中，向外渐变到45度：色相20的“红色”权重为0.833，色相30从“红色”得0.5、从“黄色”也得0.5，色相45则完全属于“黄色”。“宽度”可设为10到120，“羽化”为0到90。',
        '每个范围权重都会乘以min(1, s / 0.1)，即中性色淡出。HSL饱和度为0.04的像素只得到范围偏移的40%；饱和度为0.1或以上的像素得到全部偏移。整体“色相”不会淡出，但真正的灰色饱和度为零，无论加多少角度都还是原来的灰色；饱和度4%的近灰色也只改变几个色阶。',
        '色相是环形的，所以中心为0的“红色”覆盖接缝两侧：色相350的像素距“红色”中心10度，得到完整的“红色”权重；把色相推过360的偏移会绕回色轮的起点。',
        '预览由你的显卡用WebGL2基于照片的1920 px代理绘制；你下载的文件由我们的服务器基于原始像素、用同样的HSL公式渲染。两者的差异在颜色运算的记录容差之内：平均误差最多1个色阶，最大误差4个色阶（共255级）。',
      ],
      whyItMatters: [
        '色相是亮度和对比度工具唯一碰不到的颜色维度：本该是黄色的绿色，不管怎么调曝光都还是绿色，只有旋转色相才能修正。',
        '相机和手机的成像流程常常把树叶渲染得太偏蓝绿，把日落渲染得太偏洋红；在单个范围上偏移10到20度就能纠正，而画面中其他东西都不会变。',
        '产品和品牌工作经常需要同一件物品的另一种颜色；带羽化的分范围色相偏移，是保留明暗和高光的最快办法。',
      ],
      useCases: [
        {
          title: '校正海水和天空',
          description: '拍成青绿色的热带海水，用“青色”的“色相”+20到+30就能偏向蓝色，而几乎不含青色的沙滩保持不动。',
        },
        {
          title: '让树叶变暖或变冷',
          description: '负的“绿色”“色相”把树叶推向黄色，营造秋意；正值则推向青色，显得更清冷、更湿润。',
        },
        {
          title: '为产品换色',
          description: '用吸管拾取产品的颜色，把自定义范围的“色相”设为所需角度，并把“宽度”和“羽化”保持在较小值，这样其他东西都不会动。',
        },
        {
          title: '创意换色',
          description: '整体偏移180度，一步就能得到补色互换的画面；较小的整体偏移则能做出胶片交叉冲印般的偏色效果。',
        },
      ],
      workedExamples: [
        {
          title: '青绿海水变蓝：在12 MP的JPEG上将“所有颜色”的“色相”设为+30',
          body: '一张4000 x 3000的潟湖照片（12 MP，4.8 MB），渲染得太绿。一个(26, 153, 166)的水面像素，色相185.5度，饱和度0.73，明度0.375。把“所有颜色”的“色相”设为+30、所有范围保持0时，色相变为215.5，饱和度和明度不变，像素导出为(25, 83, 166)，一种清澈的蓝色。饱和度约0.2的沙滩也会旋转30度，因为整体滑块不会在低饱和度上淡出，所以对这张照片来说，“青色”范围偏移+30（在色相185.5处权重为1，在色相35的沙滩上权重为0）是更好的做法。按对话框中每MP 0.45 MB的估算，以JPG、质量92导出的文件约为5.4 MB，这次导出计为一次常规任务。',
        },
        {
          title: '秋叶：在24 MP、由RAW导出的JPEG上将“绿色”的“色相”设为-30',
          body: '一张来自相机的6000 x 4000导出文件（24 MP，11 MB）。一个(77, 140, 46)的树叶像素，色相100.5度。在默认“宽度”30和“羽化”30下，它距“绿色”中心19.5度，因此“绿色”权重为1 - (19.5 - 15) / 30 = 0.85；它距“黄色”中心40.5度，“黄色”权重为0.15。把“绿色”的“色相”设为-30，树叶旋转0.85 x -30 = -25.5度，到色相75，导出为(117, 140, 46)，一种橄榄黄；如果改为把“黄色”的“色相”设为-30，它只移动0.15 x -30 = -4.5度，变为(84, 140, 46)，几乎没有区别。一块(125, 133, 122)的偏绿灰色岩石，色相105、饱和度0.04，其“绿色”权重乘以0.4，只偏移12度，变为(127, 133, 122)，仅变化2个色阶。导出完整的24 MP需要Premium或Pro；质量92时JPG约为10.8 MB。',
        },
      ],
      whenNotToUse: '如果整张照片被拍摄时的光线染了色，色相滑块就不是合适的工具：这是白平衡问题，我们白平衡页面上的色温和色调滑块会在线性光下修正它，而不会把色相互相推挤。如果要改变一个物体，而别处另一个同色物体必须保持不变，它也不合适：色相范围按颜色而不是按位置选择，所以请添加“画笔”或“径向”蒙版，或使用更改物体颜色页面。单纯降低饱和度属于饱和度页面，转为单色则属于黑白页面，那里的六个通道滑块决定每种色相变成多深的灰。',
      whyMediaManipulator: [
        'Aperture在你拖动时就在GPU上显示旋转效果，导出文件则基于原始像素、用相同的分范围权重计算，所见色相即所得。',
        '每个范围都有宽度和羽化，还有针对灰色的中性色淡出和吸管范围，这些都是桌面编辑器才有的控件，在这里只需一个浏览器标签页，无需安装。',
        '所有调整、除主体选择外的所有蒙版类型、所有风格和所有撤销都是免费的；只有最终导出计为一次常规任务，价格页面列出了每日额度。',
      ],
      privacyNote: '没有账号时，你拖放到这里的照片在浏览器中解码，色相偏移从不离开浏览器；项目保存在此浏览器的IndexedDB中，直到你导出，而导出是一次普通的访客上传，在我们自己的服务器上渲染。登录后，原图、其1920 px预览和一张缩略图会随项目按你的保留设置存储，并在删除项目或账号时一并删除。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。文件绝不会提供给任何第三方。',
      faq: [
        {
          question: '“所有颜色”的“色相”和范围“色相”有什么区别？',
          answer: '“所有颜色”给每个像素加上相同的角度，不管它是什么颜色。范围“色相”只给色相落在该范围内的像素加上角度，并按范围权重缩放、在近灰色像素上淡出，因此它只移动一个色系，其他色系不受影响。',
        },
        {
          question: '为什么某些颜色上很小的色相变化看起来很大？',
          answer: '色相是一个角度，而每度在色轮各处带来的感知变化并不均匀。在黄色和绿色之间，几度就很明显；在蓝色和紫色之间，同样的幅度却很细微。请看着预览并参考直方图，而不是追求某个特定数值。',
        },
        {
          question: '移动“红色”会影响皮肤吗？',
          answer: '通常会。肤色大约在色相15到30之间，位于“红色”范围内，并有一部分落在“黄色”中，所以改变“红色”的“色相”也会移动皮肤。给图层添加“颜色范围”或“画笔”蒙版把脸排除在外，或者收窄“红色”的“宽度”，让范围在橙色肤色之前截止。',
        },
        {
          question: '为什么我旋转“红色”时灰色背景没有变化？',
          answer: '范围偏移会乘以min(1, saturation / 0.1)。灰色背景的饱和度接近零，权重随之降为零，因此保持原有色调。这是有意为之：在中性色上调整色相，会添加你根本没要的色偏。',
        },
        {
          question: '能旋转落在两个命名范围之间的颜色吗？',
          answer: '用吸管点击它，创建一个以其精确色相为中心的自定义范围，然后为这个范围单独设置“色相”“宽度”和“羽化”。一个“颜色（HSL）”图层最多可容纳32个范围。',
        },
        {
          question: '色相偏移会改变照片的亮度吗？',
          answer: '在编辑器使用的HSL模型中不会：角度旋转时明度保持不变。但不同色相的感知亮度仍有差异，所以黄色旋转成蓝色后会显得更暗，尽管其HSL明度完全相同。如果想用“明度”滑块补偿，实时直方图会显示亮度的变化。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '色相旋转是在伽马空间HSL中的逐像素运算；导出24 MP的原图在服务器上需要几秒钟，耗时取决于编码，而不是计算。',
          'HEIC、TIFF和BMP原图需要账号，因为服务器要准备浏览器无法解码的预览副本。',
        ],
      },
      related: [
        {
          label: '更改物体颜色',
          to: '/tools/change-image-color',
          description: '把色相旋转与“颜色范围”蒙版结合，只改变一个物体。',
        },
        {
          label: '图片饱和度',
          to: '/tools/image-saturation',
          description: '作用于整张照片的“自然饱和度”和“饱和度”，即同一个“颜色（HSL）”面板的另外两个维度。',
        },
        {
          label: '色彩突出',
          to: '/tools/color-pop',
          description: '用一种内置风格保留一种颜色，并降低其他所有颜色的饱和度。',
        },
        {
          label: '白平衡',
          to: '/tools/white-balance-photo',
          description: '如果整个画面偏蓝或偏橙，正确的修正方法是色温和色调，而不是色相。',
        },
        {
          label: '分离色调',
          to: '/tools/split-toning',
          description: '为阴影添加一种色相、为高光添加另一种，而不是旋转现有颜色。',
        },
        {
          label: '照片编辑器教程',
          to: '/tutorials/aperture',
          description: '图层、蒙版、风格和导出，按第一次修图时遇到的顺序讲解。',
        },
      ],
      embed: {
        title: '调整图片的色相',
        description: '拖放一张照片，在“颜色（HSL）”面板上打开Aperture：将所有颜色或一个范围旋转-180到180度，并以完整分辨率导出。',
      },
    },
    'change-image-color': {
      name: '更改物体颜色',
      h1: '更改照片中物体的颜色',
      tagline: '用吸管拾取颜色，设置选区的范围，旋转色相，然后导出：红色的汽车变成绿色，明暗和反光都保持不变。',
      metaTitle: '在线更改照片中物体的颜色 | Media Manipulator',
      metaDescription: '用“颜色范围”蒙版按颜色选择物体，用“颜色（HSL）”滑块旋转其色相，并以完整分辨率导出。明暗和高光保持不变。',
      ogTitle: '更改照片中物体的颜色 | Media Manipulator',
      ogDescription: '吸管、颜色容差、色相旋转。在浏览器中为汽车、衬衫或墙面换色，并下载由我们服务器渲染的完整尺寸文件。',
      intro: '本页会在“颜色（HSL）”面板上打开Media Manipulator的照片编辑器Aperture，“颜色范围”蒙版只需一次点击即可添加，这两样工具配合起来就能为物体换色。蒙版负责选择：你用吸管点击物体，每个像素都会按其颜色与所选颜色在CIE Lab中的距离打分，“颜色容差”滑块决定选择范围有多大。“颜色（HSL）”图层负责改变：在这个蒙版内旋转色相，物体就会变成另一种颜色，而它的明度和饱和度，也就是它的明暗、反光和纹理，都保持原样。两者是堆栈中各自独立的图层，所以选好颜色之后仍可细化选区，也可以撤销其中任何一个。',
      whatItDoes: [
        '“颜色范围”蒙版组件按像素与你在照片中拾取的目标颜色之间的距离来选择像素；按住Shift点击最多可添加8个目标，因此一辆有两种红色的汽车也只需一个选区。',
        '“颜色容差”范围为0到100，以Lab单位设定选区半径，满值时最大为60，半径的外半部分是柔和边缘，这样物体的边界不会被生硬切断。',
        '在“颜色（HSL）”图层上做色相旋转（整体或按范围），让选中的像素沿色轮移动，而HSL饱和度和明度完全保持不变。',
        '蒙版组件可以组合：当同一种颜色在画面别处也出现时，把颜色选区与“径向”“线性渐变”或“画笔”组件相交，即可把它限定在一个物体上；“反相”可将其翻转；“蒙版羽化”可使其变柔和。',
        '蒙版可以以叠加方式查看，也可以单独查看；图层保留自己的不透明度和混合模式；导出时会用同样的蒙版算法以完整分辨率渲染原图。',
      ],
      flowSteps: [
        {
          title: '拖放照片',
          description: '任意JPG、PNG、WebP、GIF、HEIC、AVIF或TIFF。编辑器打开时“颜色（HSL）”在最前，该图层上已备好一个空蒙版。',
        },
        {
          title: '拾取颜色',
          description: '在“蒙版”面板中添加“颜色范围”组件，用吸管点击物体，然后提高“颜色容差”，直到蒙版叠加层覆盖整个物体。',
        },
        {
          title: '旋转色相',
          description: '移动“所有颜色”的“色相”滑块，直到物体变成你想要的颜色；只有蒙版内的像素会改变。',
        },
        {
          title: '细化并导出',
          description: '如果这种颜色在别处也出现，就以“相交”方式添加“画笔”或“径向”组件，羽化蒙版，然后导出为JPG、PNG、WebP、AVIF或TIFF。',
        },
      ],
      advancedDetails: [
        '“颜色范围”蒙版把像素和每个目标都转换到CIE Lab（D65，由线性sRGB转换），并计算两者之间的欧几里得距离dE，即1976年定义的色差ΔE。半径R = “颜色容差” / 100 x 60，蒙版值为1 - smoothstep(0.5 R, R, dE)：在半径一半以内完全选中，到完整半径处平滑衰减为零，多个目标中取最大值。“颜色容差”为40时R = 24，因此dE不超过12的像素完全选中，dE达到24或以上的像素完全不选。',
        '组件从左到右依次合并：“添加”取最大值，“减去”取min(m, 1 - component)，“相交”取最小值。合并后的蒙版再用高斯模糊处理，sigma = “蒙版羽化” / 100 x 0.05 x L（L为照片长边），可选反相，再乘以“蒙版强度”。图层的逐像素输出为lerp(input, adjusted, m)。',
        '换色本身用的就是“颜色（HSL）”公式：色相h + 整体“色相” + 加权的范围“色相”，饱和度和明度在其滑块为0时保持不变，然后转换回RGB。由于蒙版在调整之后应用，蒙版值为0.9的像素会从原值向换色后的值移动90%，边缘正是这样融合的。',
        'Lab距离包含明度，因此红色物体上的深阴影与所选红色的距离，可能比一面砖墙还要远。与其不断提高“颜色容差”直到把墙也选进来，不如按住Shift点击，在物体的明暗过渡上拾取两三个目标。',
        '你看到的是GPU上用WebGL2对1920 px副本的渲染；你下载的是我们服务器基于完整尺寸原图、用完全相同的Lab、smoothstep和HSL代码渲染的结果，两者在记录的容差之内一致：颜色运算的8位平均误差为1，最大误差为4个色阶。',
      ],
      whyItMatters: [
        '按颜色选择会保留每一个明暗、镜面高光和纹理像素，而平涂覆盖会把这些全部丢掉；换色之后，物体看起来仍处在同样的光线下。',
        '比起RGB距离，Lab距离更符合人眼对两种颜色差异的感受，所以选区边缘会落在你自己会画的位置上。',
        '由于选区和颜色是独立的图层，之后改变主意想换颜色，只需动一个滑块，而不必重新选择。',
      ],
      useCases: [
        {
          title: '产品颜色款式',
          description: '只拍一个配色，拾取它，再通过旋转色相生成其余配色；每个款式的缝线和阴影都完全相同。',
        },
        {
          title: '汽车和自行车展示图',
          description: '按买家询问的颜色展示车辆；两个目标，一个在明亮的车身面板上、一个在阴影中，就能覆盖整个车身。',
        },
        {
          title: '人像中的服装',
          description: '把衬衫从黄色换成蓝色；将颜色选区与“画笔”组件相交，背景里的黄色招牌就不会受影响。',
        },
        {
          title: '墙面和房间',
          description: '在房间照片上试刷不同的墙漆颜色；颜色选区会选中墙面而留下白色踢脚线和门框，因为它们在Lab中距离太远。',
        },
      ],
      workedExamples: [
        {
          title: '红色汽车变绿：在20 MP的JPEG上将“颜色容差”设为60、“所有颜色”的“色相”设为+120',
          body: '一张5472 x 3648的车辆展示照片（20 MP，9 MB）。点击车门拾取到(204, 26, 31)，Lab为(43.8, 64.9, 45.5)。处于阴影中的车身面板(153, 20, 26)与它的dE为20.6，阳光照射的高光(242, 89, 84)为dE 19.6。“颜色容差”为40时半径为24，这两处只分别得到0.199和0.303，汽车会斑驳不全；“颜色容差”为60时半径为36，它们分别得到0.945和0.977。车后(166, 77, 56)的砖墙dE为33.8，得分0.043；(89, 89, 92)的沥青路面dE为79.9，得分0。“所有颜色”的“色相”设为+120时，阴影像素换色为(26, 153, 20)，按0.945混合后为(33, 146, 21)；高光变为(84, 242, 89)，按0.977混合后为(88, 239, 89)。按每MP 0.45 MB的估算，以JPG、质量92导出约为9 MB，导出完整的20 MP需要Premium或Pro；免费账号的上限是12。',
        },
        {
          title: '黄色夹克变蓝：在12 MP的手机照片上比较“黄色”范围偏移与蒙版',
          body: '一张来自手机的4032 x 3024 HEIC（12.2 MP）。夹克像素(242, 204, 38)的色相为48.75，饱和度0.89，明度0.55。两种做法得到的夹克相同。做法一：不加蒙版，把“黄色”的“色相”设为+190；该像素距“黄色”中心11.25度，权重为1，色相变为238.75，像素导出为(38, 43, 242)，但背景中一块黄色路牌也会变蓝。做法二：在夹克上以“颜色容差”50（半径30）拾取一个“颜色范围”组件，与涂满夹克的“画笔”组件相交，并把“所有颜色”的“色相”设为+190；路牌因被画笔排除而得分0，夹克像素导出为同样的(38, 43, 242)。质量92时导出约5.5 MB；HEIC原图本身需要账号，这样服务器才能解码它来生成预览。',
        },
      ],
      whenNotToUse: '在同样光线下的两个同色物体，颜色选区无法把它们区分开；这时要用“画笔”或“径向”蒙版，或者当该物体是画面主体时使用“选择主体”。它也无法创造一种不属于色相的颜色，所以白色、黑色和金属质感需要调整饱和度和明度，而不是旋转色相；它也不能改变表面的图案或材质。如果整张照片有色偏而不是单个物体，请改用白平衡或色彩平衡页面；如果你想把物体抠到透明背景上，请使用背景移除工具。',
      whyMediaManipulator: [
        'Aperture中的“颜色范围”蒙版是真正基于Lab距离的选区，带颜色容差、多个目标和羽化，而且完全免费：只有导出计为一次常规任务。',
        '蒙版可以与渐变、径向、画笔和明亮度范围以“添加”“减去”“相交”方式叠加，因此不必把物体整个涂一遍，就能把颜色选区锁定在一个物体上。',
        '预览在你自己的GPU上运行；最终文件由我们的服务器基于原始像素渲染，与预览一致，因此24 MP的展示照片导出后仍是24 MP。',
      ],
      privacyNote: '“颜色范围”选区和色相旋转都在你的浏览器中运行，不会为此上传照片的像素。未登录时，项目保存在此浏览器的IndexedDB中，只有在你导出、选择主体或修复时才会离开浏览器，作为一次普通的访客任务。登录后，原图、一张1920 px预览和一张缩略图会随项目按你的保留设置保存，并在删除项目或账号时一并删除。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。不会与任何第三方共享。',
      faq: [
        {
          question: '同一种颜色出现两次时，如何只改变其中一个物体的颜色？',
          answer: '添加第二个蒙版组件，即“径向”或“画笔”，画在你要改的物体上，并设为“相交”。这样蒙版就是颜色选区和该形状的最小值，位于形状之外的另一个物体保持为零。',
        },
        {
          question: '“颜色容差”滑块到底控制什么？',
          answer: '选区的Lab半径：“颜色容差”除以100再乘以60。与所选颜色的距离小于半径一半的像素完全选中，超出半径的像素不选，介于两者之间的像素沿smoothstep曲线衰减。',
        },
        {
          question: '能把红色物体变成白色或黑色吗？',
          answer: '色相旋转做不到，因为白色和黑色没有色相。保留同一个蒙版，在“颜色（HSL）”图层上把“饱和度”滑块设为-100，然后用“明度”或一个加了蒙版的“曲线”图层把灰色推向白色或黑色。',
        },
        {
          question: '为什么物体最暗的部分没有被选中？',
          answer: 'Lab距离包含明度，所以红色汽车背光的一面，可能比另一个物体离你点击的颜色还要远。按住Shift在阴影中点击第二个目标，而不是整体提高“颜色容差”。',
        },
        {
          question: '为物体换色会消耗AI任务吗？',
          answer: '不会。“颜色范围”蒙版和色相旋转都是根据像素计算的普通调整。只有“选择主体”和“修复”会使用AI模型；颜色选区是免费的，导出计为一次常规任务。',
        },
        {
          question: '新颜色会保留原来的明暗吗？',
          answer: '会。旋转只改变色相角度；每个像素的HSL饱和度和明度都保持不变，因此高光、反光和阴影的形状都不变。不同色相之间的感知亮度确实会有变化，实时直方图会显示出来。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '导出时，Lab转换和蒙版模糊会在原图的每个像素上运行；20 MP的文件在服务器上几秒钟即可渲染完成。',
          '透明PNG原图会保留其Alpha通道：蒙版和换色从不触及Alpha通道。',
        ],
      },
      related: [
        {
          label: '调整图片色相',
          to: '/tools/adjust-image-hue',
          description: '同样的色相滑块，不加蒙版，作用于整张照片或一个命名范围。',
        },
        {
          label: '按颜色选择',
          to: '/tools/select-by-color',
          description: '单独使用“颜色范围”蒙版，可把任何调整限定在一种颜色上。',
        },
        {
          label: '色彩突出',
          to: '/tools/color-pop',
          description: '保留物体的颜色，把画面其余部分变成灰色。',
        },
        {
          label: '移除图片背景',
          to: '/tools/remove-background-from-image',
          description: '目的是把物体完全分离出来，而不是为它换色时使用。',
        },
        {
          label: '图片饱和度',
          to: '/tools/image-saturation',
          description: '在整张图片上让新颜色更浓或更淡。',
        },
      ],
      embed: {
        title: '更改物体的颜色',
        description: '拖放一张照片打开Aperture：用吸管拾取物体颜色，设置颜色容差，旋转色相，然后以完整尺寸导出。',
      },
    },
    'color-pop': {
      name: '色彩突出',
      h1: '把照片变成黑白，只保留一种颜色',
      tagline: '保留红色、蓝色或六个色系中的任意一种，用一个之后还能调整的内置风格把其余部分变成灰色。',
      metaTitle: '把照片变成黑白、只保留一种颜色 | Media Manipulator',
      metaDescription: '浏览器中的选择性色彩：保留红色、黄色、绿色、青色、蓝色或洋红，其余去除饱和度。六种内置风格，可逐范围控制，完整分辨率导出。',
      ogTitle: '黑白照片只保留一种颜色 | Media Manipulator',
      ogDescription: '“色彩突出”风格会降低六个色相范围中五个的饱和度，并略微增强保留的那一个。调整保留范围的宽度，添加蒙版，然后导出。',
      intro: '本页会打开Media Manipulator的照片编辑器Aperture，“颜色（HSL）”面板在最前，并且已经应用了名为“色彩突出：红色”的风格。风格会以组的形式把调整添加到堆栈中，这一个是单个“颜色（HSL）”图层，其六个范围的设置为：“红色”的“饱和度”+10，“黄色”“绿色”“青色”“蓝色”和“洋红”的“饱和度”均为-100。效果就是经典的选择性色彩照片：一个色系保留下来，其余全部变为灰色。另外五种同系列风格分别保留黄色、绿色、青色、蓝色或洋红；面板中的“除此之外变灰”按钮也能一键对任意范围实现同样的效果，包括你用吸管拾取的自定义范围。',
      whatItDoes: [
        '打开时应用“色彩突出：红色”，即一个“红色”的“饱和度”为+10、其他五个范围的“饱和度”为-100的“颜色（HSL）”图层；“风格”面板中还列出了“色彩突出：黄色”“绿色”“青色”“蓝色”和“洋红色”，用于其他色系。',
        '任意范围旁的“除此之外变灰”按钮（包括用吸管创建的自定义范围）可一键把其他所有范围的饱和度设为-100，因此某种特定的橙色或紫色也可以成为保留的颜色。',
        '每个保留的范围都有“宽度”（10到120度）和“羽化”（0到90）滑块，决定相邻色相保留多少，你就是靠它们把橙色和红色一起保留，或者把橙色排除在外。',
        '中性色淡出会让灰色保持不变，保留的范围可以用它自己的“色相”和“明度”滑块微调，整个风格可以加蒙版、降低不透明度，或一键撤销。',
        '导出时会用同样的六范围公式以完整分辨率渲染原图，并在文件名中加上(retouched)。',
      ],
      flowSteps: [
        {
          title: '拖放照片',
          description: '编辑器全屏打开，停在“颜色（HSL）”面板上，“色彩突出：红色”已作为一个只含一个图层的组应用。',
        },
        {
          title: '选择要保留的颜色',
          description: '在“风格”中切换到“色彩突出：蓝色”“绿色”“黄色”“青色”或“洋红色”，或者在任意范围上点按“除此之外变灰”，包括你从照片中拾取的范围。',
        },
        {
          title: '加宽或收窄保留的范围',
          description: '提高“宽度”以包含相邻色相，降低它以只留下一种；用蒙版叠加层或直方图检查保留下来的部分。',
        },
        {
          title: '导出',
          description: '以你选择的质量导出为JPG、PNG、WebP、AVIF或TIFF，由服务器基于原始像素渲染。',
        },
      ],
      advancedDetails: [
        '每个像素的饱和度为s乘以各范围1 + 权重×“饱和度”/100的乘积。在-100的范围内，该系数为1 - 权重，因此完全位于“蓝色”内的像素系数为0，变为灰色；在保留的+10“红色”范围内，系数为1.1，即提升百分之十。风格从不改变色相和明度。',
        '范围权重由与范围中心的环形距离决定，默认“宽度”30、“羽化”30：15度以内为完全，45度或以上为零，中间线性变化。恰好位于两个范围之间的像素，比如色相30的橙色，在两个范围中的权重都是0.5，因此保留“红色”时，其饱和度乘以1.05 x 0.5 = 0.525。',
        '在两个被去饱和的范围之间，两个系数的乘积才是关键：在“青色”和“蓝色”正中间的色相210处，每个权重为0.5，饱和度系数为0.5 x 0.5 = 0.25，而不是0，所以那里的天空会保留四分之一的颜色。把两个范围的“宽度”都提高到60，它们的核心就会在210处相接，系数降为0。',
        '每个范围权重都会乘以min(1, s / 0.1)，因此HSL饱和度低于0.1的像素在保留范围中得到的提升会按比例缩小；它本来就近乎灰色，-100的范围也没什么可去除的。',
        '风格在项目中以普通图层组的形式保存：风格是叠加的，“撤销”会移除整个组，你自己的变体可以作为预设保存在此浏览器中，或导出为JSON。',
        '你屏幕上显示的是基于1920 px副本的WebGL2渲染；导出文件由我们的服务器基于原图、用同样的范围算法生成，差异在颜色运算的记录容差之内：8位下平均误差最多1，最大误差4个色阶。',
      ],
      whyItMatters: [
        '选择性色彩把视线引向一个元素，比如灰色街道上的一把红伞、石墙中的一扇蓝门，而且保留了原有的明暗，而不是靠一个涂出来的蒙版。',
        '按色相范围而不是手工来做，画面中每一个红色物体都会被选中，包括画笔容易漏掉的倒影和小细节。',
        '由于保留的范围是一个参数，登录后，你的套餐可以通过“应用到更多照片”把同一个风格用到整组照片上。',
      ],
      useCases: [
        {
          title: '街头摄影的点睛之色',
          description: '在单色街景中保留一件外套、一辆公交车或一块招牌的红色；“红色”范围会一次把它们全部选中。',
        },
        {
          title: '灰色中的产品',
          description: '保留产品的品牌色，让布景、双手和道具在它周围变成灰色。',
        },
        {
          title: '婚礼和活动细节',
          description: '在灰色的房间中保留鲜花或礼服的颜色；如果地毯也是同一色相，可以给风格加蒙版，把效果限定在桌面上。',
        },
        {
          title: '门、船和汽车',
          description: '对单个上了漆的物体使用“色彩突出：蓝色”或“色彩突出：黄色”；如果油漆在阴影中偏向青色或橙色，就加宽保留的范围。',
        },
      ],
      workedExamples: [
        {
          title: '灰色街道上的红伞：在12 MP的手机JPEG上使用“色彩突出：红色”',
          body: '一张4032 x 3024的JPEG（12.2 MP，3.9 MB）。雨伞像素(204, 51, 51)的色相为0，HSL饱和度为0.6；它完全位于“红色”之内，饱和度变为0.6 x 1.1 = 0.66，导出为(212, 43, 43)。一件(51, 77, 204)的蓝色外套，色相230，完全位于“蓝色”之内：0.6 x 0 = 0，导出为(128, 128, 128)，明度与之前一样是0.5。(140, 191, 242)的天空，色相210，从“青色”得到0.5的权重，从“蓝色”也得到0.5，因此饱和度0.8变为0.8 x 0.5 x 0.5 = 0.2，导出为(179, 191, 204)，一种淡淡的蓝；把两个“宽度”都提高到60，它就会变成完全的灰色。一个(230, 128, 26)的橙色店面，色相30，保留0.8 x 1.05 x 0.5 = 0.42，导出为(181, 128, 74)。质量92的JPG导出约为5.5 MB，计为一次常规任务。',
        },
        {
          title: '石墙中的蓝门：在24 MP的相机JPEG上使用“色彩突出：蓝色”',
          body: '一个6000 x 4000的文件（24 MP，12 MB）。切换到“色彩突出：蓝色”后，“蓝色”的“饱和度”为+10，其他五个范围为-100。(51, 77, 204)的门变为(43, 71, 212)；(204, 51, 51)的红色自行车变为(128, 128, 128)；(140, 191, 242)的天空通过与“青色”共享的边缘保留了0.8 x 0.5 x 1.05 = 0.42的饱和度，导出为(164, 191, 218)。(133, 128, 122)的石墙饱和度为0.04，低于0.1的中性阈值，因此每个范围权重都乘以0.4，墙面向任一方向最多只移动一两个色阶。导出完整的24 MP需要Premium或Pro；没有账号时，对话框上限为12，而24 MP、质量92的JPG约为10.8 MB。',
        },
      ],
      whenNotToUse: '选择性色彩会在一个色相出现的所有地方都保留它，因此当两个物体颜色相同、而只有一个应保留颜色时，你需要给风格加上“画笔”或“径向”蒙版，或使用“选择主体”，而不是把范围调宽或调窄。它也不是得到干净单色的方法，因为一个+10的保留范围加五个-100的范围，在接缝处仍会留下四分之一强度的颜色；这时请使用黑白页面。如果你想要的是让所有颜色都更浓或更淡，饱和度页面用一个滑块就能做到；如果目标是改变保留的颜色而不是保留它，请前往更改物体颜色页面。',
      whyMediaManipulator: [
        'Aperture自带六种“色彩突出”风格，并为任何自定义范围提供“除此之外变灰”按钮，所以你能保留的颜色不限于这六个名称。',
        '保留的范围有宽度和羽化，蒙版可以把效果限定在一个物体上，而风格本身是一个图层，你可以把它降到60%来获得部分效果，而不是非此即彼。',
        '应用风格、调整风格和撤销风格都是免费的；导出最终画面计为一次常规任务，每日次数见价格页面。',
      ],
      privacyNote: '应用“色彩突出：红色”以及更改保留哪个范围，完全在你的浏览器中进行；不会为了这个风格把照片发送到任何地方。未登录时，项目保存在此浏览器的IndexedDB中，只有在你导出、选择主体或修复时才会作为一次普通的访客任务上传。登录后，原图及其1920 px预览和缩略图会按你的保留设置留在我们的服务器上，直到项目或账号被删除。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。任何第三方都看不到你的照片。',
      faq: [
        {
          question: '我能保留哪些颜色？',
          answer: '通过“色彩突出”风格可以保留六个命名范围中的任意一个，即“红色”“黄色”“绿色”“青色”“蓝色”和“洋红”；对于其他任何色相，用吸管在照片中点击它，再在新的自定义范围上点按“除此之外变灰”即可。',
        },
        {
          question: '为什么用了“色彩突出：红色”后天空还是有点蓝？',
          answer: '色相210的天空恰好位于“青色”和“蓝色”正中间，因此每个范围给它的权重都是0.5，两个-100的系数相乘得到0.25，保留了四分之一的饱和度。把两个范围的“宽度”都提高到60，让它们的核心在210处重叠，系数就会降为零。',
        },
        {
          question: '为什么保留红色时人脸还有些颜色？',
          answer: '皮肤大约在色相20，位于“红色”范围之内，所以风格会按设计保留它。一个(217, 158, 128)的像素只损失约12%的饱和度。如果你希望皮肤变灰，可以收窄“红色”的“宽度”，或者添加一个以“减去”方式覆盖面部的“画笔”蒙版。',
        },
        {
          question: '能同时保留两种颜色吗？',
          answer: '能。这个风格就是一个普通的“颜色（HSL）”图层，所以应用之后，可以把第二个范围（例如“黄色”）从-100调回0；或者在一个自定义范围上点按“除此之外变灰”，再恢复你也想保留的任何命名范围。',
        },
        {
          question: '导出之后效果还能撤回吗？',
          answer: '导出的是一个文件名带(retouched)的新文件，你的原图永远不会被修改。在项目中，这个风格是一个图层组：“撤销”可以移除它，图层也可以随时隐藏或删除。',
        },
        {
          question: '保留范围上的+10有什么作用？',
          answer: '它把完全位于保留范围内的像素饱和度乘以1.1，让保留的颜色在周围的灰色中显得更突出一些。如果你想让保留的颜色与拍摄时完全一致，就把它调回0。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '这个风格是一个逐像素HSL运算的图层；导出时间由编码器和像素数量决定，12 MP的JPG只需几秒钟。',
          '通过本页应用的风格是一个图层组，可以像其他任何图层一样重命名、加蒙版或删除。',
        ],
      },
      related: [
        {
          label: '黑白照片',
          to: '/tools/black-and-white-photo',
          description: '带六个通道滑块的完整单色转换，适用于什么颜色都不保留的情况。',
        },
        {
          label: '图片饱和度',
          to: '/tools/image-saturation',
          description: '作用于所有颜色的自然饱和度和饱和度，不做分范围选择。',
        },
        {
          label: '更改物体颜色',
          to: '/tools/change-image-color',
          description: '为保留的物体换色，而不是按拍摄时的样子保留它。',
        },
        {
          label: '按颜色选择',
          to: '/tools/select-by-color',
          description: '一个“颜色范围”蒙版，可把任何其他调整限定在一种色相上。',
        },
        {
          label: '添加晕影',
          to: '/tools/add-vignette',
          description: '压暗四角，让保留的颜色更加吸引目光。',
        },
      ],
      embed: {
        title: '保留一种颜色，其余变灰',
        description: '拖放一张照片，打开已应用“色彩突出：红色”风格的Aperture；在“风格”中或用“除此之外变灰”切换保留的颜色。',
      },
    },
    'image-saturation': {
      name: '图片饱和度',
      h1: '在线增加或降低图片饱和度',
      tagline: '自然饱和度可提升色彩，同时保护肤色和本已强烈的颜色；饱和度则统一缩放，两者都是可以加蒙版的图层。',
      metaTitle: '在线增加或降低图片饱和度 | Aperture',
      metaDescription: '在浏览器中更改照片的饱和度。自然饱和度提升暗淡的颜色并保护肤色；饱和度均匀缩放所有颜色。完整分辨率导出。',
      ogTitle: '在线增加或降低图片饱和度',
      ogDescription: '用公式和真实数字讲解自然饱和度与饱和度的区别。在你的GPU上实时预览，以完整分辨率导出。',
      intro: '饱和度是指一种颜色与同等亮度的灰色相差多远。Aperture“基本”面板中的“颜色”组为此提供了两个滑块，而本页要讲的正是两者的区别。“饱和度”把每个像素与其亮度值之间的距离乘以同一个系数1 + saturation / 100，因此+50会让淡雅的粉彩和霓虹灯招牌按相同比例变化，而霓虹灯会先溢出。“自然饱和度”则用一个随颜色越饱和而越小的系数来缩放这段距离：1 + v乘以(1 - range)，其中range是最大通道与最小通道之间的差值。因此暗淡的颜色变化很大，强烈的颜色变化很小，中性灰则完全不动。同一个图层中先运行“自然饱和度”，再运行“饱和度”，这个图层可以用蒙版限定到某个颜色范围或主体。',
      whatItDoes: [
        '“自然饱和度”范围为-100到+100：一种能感知饱和度的增强或减弱。正值时系数为1 + v乘以(1 - range)，因此通道差为0.08的暗淡颜色几乎得到全部增强，而通道差为0.63的鲜艳颜色只得到约三分之一。',
        '“饱和度”范围为-100到+100：每个通道按系数1 + saturation / 100远离（或靠近）该像素的BT.709亮度值；-100就是使用权重0.2126、0.7152、0.0722的完美灰度转换。',
        '两个滑块位于同一个“自然饱和度/饱和度”图层中，因此一个不透明度、一个混合模式和一个蒙版同时作用于两者；如果想给它们设置不同的蒙版，再添加一个图层即可。',
        '自然饱和度公式天然就能保护肤色：典型肤色的通道差接近0.3，因此“自然饱和度”+50给它增加的饱和度，约为同一数值给接近灰色的颜色所增加的35%。',
        '如果需要针对特定颜色进行控制，本页会引导你使用“颜色（HSL）”面板，其中六个色相范围各有自己的“饱和度”滑块，并可设置宽度和羽化。',
      ],
      flowSteps: [
        {
          title: '打开图片',
          description: '拖放文件。“颜色”组中的“自然饱和度”和“饱和度”都为0，直方图显示RGB各通道。',
        },
        {
          title: '先调自然饱和度',
          description: '把它提高到+40或+60。树叶、水面、布料等暗淡区域会最先鲜活起来；脸部和本已鲜艳的颜色几乎不变。',
        },
        {
          title: '增加或降低饱和度',
          description: '在“自然饱和度”平衡了各种颜色之后，用小幅度的“饱和度”调整（+10到+20，或-20到-40得到低饱和的效果）来设定整体水平。',
        },
        {
          title: '需要时添加蒙版，然后导出',
          description: '给图层添加“颜色范围”或“选择主体”蒙版，让调整避开某个区域，然后以完整分辨率导出。',
        },
      ],
      advancedDetails: [
        '“自然饱和度”：range = max(R, G, B) - min(R, G, B)，l = 像素的自然饱和度亮度值（权重为红0.072、绿0.715、蓝0.213，这是底层滤镜使用的顺序），系数f = 1 + v乘以(1 - sign(v)乘以range)，其中v = vibrance / 100；每个通道变为l + (channel - l)乘以f，并经过限制。',
        '“饱和度”：l = BT.709亮度值（0.2126、0.7152、0.0722）；每个通道变为l + (channel - l)乘以(1 + saturation / 100)，并经过限制。在-100时，每个通道都等于l，因此结果与按亮度值加权的黑白转换得到的灰色相同。',
        '符号项让负的自然饱和度对饱和颜色作用更强：在-40时，255, 40, 180的霓虹粉（通道差0.84）系数为0.26，降到130, 73, 110；而160, 120, 80的木棕色（通道差0.31）系数为0.47，只降到136, 117, 98。',
        '两个滑块都不会改变中性像素：当R = G = B时，与亮度值的距离为0，任何系数都让它保持为0，因此在任何设置下，灰色、黑色和白色都不受影响。',
        '编辑时，预览由你的GPU（WebGL2）根据照片的1920 px副本绘制；导出时，文件由我们的服务器根据原图以完整分辨率、用同样的公式渲染，两者的差异在一个已记录的小容差之内，最多几个8位色级，颗粒完全一致。“自然饱和度”和“饱和度”都是逐像素运算，因此实际上能精确到同一级。',
        '由于两个步骤都把结果限制在0到1之间，对强烈的颜色大幅增强会让某个通道溢出，色相随之略微偏移；把图层混合模式切换为“颜色”，可以保留原始亮度值、只移动色度，从而减少这种偏移。',
      ],
      whyItMatters: [
        '单一的饱和度滑块对晒伤的脸和灰色墙面一视同仁；正因为有了自然饱和度，现代编辑器才能在增强风景色彩的同时，不把画面里的人变成橙色。',
        '降低饱和度本身就是一种风格，而-40“饱和度”（一切都变平淡）与-40“自然饱和度”（强烈的颜色被压住，暗淡的颜色得以保留）之间的区别，就是褪色照片与克制照片之间的区别。',
        '知道灰色不会移动，你就可以在中性背景的产品图上大胆推高自然饱和度，背景会完全保持原样。',
      ],
      useCases: [
        {
          title: '平淡的阴天风景',
          description: '先“自然饱和度”+60，再“饱和度”+10：70, 110, 50的树叶和水面鲜活起来，灰色的天空仍然是灰色，穿红色夹克的徒步者也不会变成一座信号灯。',
        },
        {
          title: '颜色过于浓重的人像',
          description: '“自然饱和度”-30让红色夹克和蓝色背景平静下来，而通道差适中的皮肤则保留了大部分暖意。',
        },
        {
          title: '低饱和胶片风格',
          description: '“饱和度”-35配合“光线”组中的“对比度”-20，再加一个“分离色调”图层，无需预设就能得到褪色的色调。',
        },
        {
          title: '白底产品图',
          description: '在“选择主体”蒙版下设置“饱和度”+20，只增强商品本身；白色背景是中性的，本来就不会变化，但蒙版能让背景上的阴影保持干净。',
        },
      ],
      workedExamples: [
        {
          title: '“自然饱和度”+60处理一张24 MP阴天风景照',
          body: '一张6000 x 4000的JPEG（24 MP，10.1 MB）。130, 120, 110的暗淡地面色调通道差为0.078，因此“自然饱和度”+60应用的系数为1.55，把它提升到136, 121, 105。60, 140, 150的青绿色湖面（通道差0.35）系数为1.39，变为30, 141, 155。200, 40, 40的饱和红色夹克（通道差0.63）系数只有1.22，变为233, 37, 37；220, 170, 140的肤色变为242, 171, 129。如果改用“饱和度”+35，同样的地面色调会变为133, 120, 106，但夹克会被推到244, 28, 28。以质量92导出为JPG：Premium下约10.8 MB；访客会缩小到12 MP，约5.4 MB。',
        },
        {
          title: '用两种方法为一张12 MP街景照片降低饱和度',
          body: '一张4000 x 3000的JPEG（12 MP，4.5 MB），其中有255, 40, 180的霓虹粉招牌、160, 120, 80的木门和90, 150, 230的蓝色汽车。“饱和度”-30依次得到207, 57, 155、150, 122, 94和132, 150, 186：每种颜色与灰色的距离都缩短了30%。改用“自然饱和度”-40，招牌得到130, 73, 110（系数0.26），木门得到136, 117, 98（系数0.47），汽车介于两者之间，结果是最刺眼的颜色被压得最多。“饱和度”-100会把三者全部变成100、125和143的平板灰色。以质量88导出为WebP，约3.6 MB。',
        },
      ],
      whenNotToUse: '本页会同时改变所有颜色的强度，因此当问题只出在某一种颜色上时，它就不是合适的工具：天空需要更蓝，或者脸部需要少一点红，这些都应该在“颜色（HSL）”面板中处理，那里每个色相范围都有自己的饱和度。如果你想要一张除了某个物体之外全是灰色的照片，色彩突出预设已经能做到。如果颜色看起来是不对而不是不够浓，请先从白平衡入手；给有色偏的照片增加饱和度，只会让色偏更严重。',
      whyMediaManipulator: [
        'Aperture与本网站的Darkroom视频编辑器使用相同的自然饱和度和饱和度算法，因此你在照片上调出的风格可以直接用到视频片段上。',
        '两个滑块都可以用吸管限定到某个颜色范围，无需打开其他面板，就能把全局饱和度调整变成针对单一颜色的调整。',
        'Media Manipulator公布了每个滑块数值产生的系数，因此+50是一个确定的量，而不是一种感觉。',
      ],
      privacyNote: '改变饱和度会让每个像素靠近或远离它自身的灰度值，这项计算由你的浏览器在照片的本地副本上完成；作为访客，在你导出、点按“选择主体”或点按“修复”之前，不会上传任何内容。导出时，原图只发送到我们的服务器一次，用于完整分辨率渲染，结果像其他任务一样保留。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。我们不会把图片交给外部服务。',
      faq: [
        {
          question: '什么时候该用“自然饱和度”而不是“饱和度”？',
          answer: '照片中有人物，或者已经有一种强烈的颜色时，用“自然饱和度”：颜色越饱和，它的增强就越小，因此通道差约0.3的皮肤得到的增强比暗淡的灰绿色大约少三分之一。当你希望每种颜色都按相同比例变化时，比如为了低饱和风格而统一降低饱和度，就用“饱和度”。',
        },
        {
          question: '“饱和度”-100能得到合格的黑白照片吗？',
          answer: '它会使用BT.709权重得到按亮度值加权的灰色，作为默认效果是合理的。如果你想控制每种颜色如何转换，“黑白”面板更合适：它的六个通道滑块默认值为40、60、40、60、20和80，可以在转换时压暗蓝天或提亮树叶。',
        },
        {
          question: '为什么推高饱和度时，强烈的颜色会改变色相？',
          answer: '因为结果会按通道被限制在0和1之间。200, 40, 40的红色在“饱和度”+50时变为255, 23, 23：红色通道触顶了，其他通道却继续下降，于是通道之间的比例发生了变化。把图层混合模式切换为“颜色”，或使用较小的数值，可以减轻这种情况。',
        },
        {
          question: '灰色或白色区域会出现色偏吗？',
          answer: '不会。各通道相等的像素本来就位于其亮度值上，零距离乘以任何系数仍然是零，因此无论滑块往哪个方向调到什么位置，中性色都保持中性。',
        },
        {
          question: '能只增加一种颜色（比如天空）的饱和度吗？',
          answer: '有两种方法。给这个图层添加“颜色范围”蒙版，用吸管点选天空；或者打开“颜色（HSL）”面板，只提高“蓝色”范围的“饱和度”。HSL的方法还能设置该范围的宽度和羽化。',
        },
        {
          question: '饱和度调整在完整尺寸的导出文件中看得出来吗？',
          answer: '看得出来，而且完全一致：服务器在原图上逐像素应用同样的两个公式，由于其中不含模糊或邻域步骤，导出结果与预览的差异在一个8位色级之内。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '对JPEG大幅增强饱和度，会放大红色和蓝色边缘周围的色度抽样瑕疵；以质量95或更高导出为PNG或WebP，可以避免再增加新的瑕疵。',
          '饱和度运算是不涉及邻域的逐像素运算，因此导出时间主要花在解码和编码上，而不是调整本身。',
        ],
      },
      related: [
        {
          label: '色彩突出',
          to: '/tools/color-pop',
          description: '保留一种颜色，把其余一切变成灰色，这是基于HSL面板构建的预设。',
        },
        {
          label: '更改物体颜色',
          to: '/tools/change-image-color',
          description: '改变某个颜色范围的色相，而不是它的强度。',
        },
        {
          label: '调整图片色相',
          to: '/tools/adjust-image-hue',
          description: '“颜色（HSL）”面板中的主“色相”滑块和按范围的色相偏移。',
        },
        {
          label: '黑白照片',
          to: '/tools/black-and-white-photo',
          description: '当-100的“饱和度”效果过于平淡时，可以用按通道加权的转换。',
        },
        {
          label: '按颜色选择',
          to: '/tools/select-by-color',
          description: '把任意图层（包括这个图层）用蒙版限定到拾取的颜色，并可调节颜色容差。',
        },
      ],
      embed: {
        title: '更改饱和度',
        description: '将照片拖放到此处。“基本”面板会打开到“颜色”组，“自然饱和度”和“饱和度”并排显示。',
      },
    },
    'photo-levels': {
      name: '色阶',
      h1: '在线调整照片色阶',
      tagline: '针对实时直方图，按通道设置输入黑场、输入白场、中间调灰度系数和输出范围。',
      metaTitle: '在线调整照片色阶：黑场、白场、中间调',
      metaDescription: '浏览器中的色阶：RGB、红、绿、蓝的输入黑场和白场、中间调灰度系数及输出限制，配有实时直方图。',
      ogTitle: '在线调整照片色阶',
      ogDescription: '用“色阶”图层和直方图逐通道拉伸或压缩照片的影调范围，然后从原始像素导出。',
      intro: '要修正一张发灰的照片，色阶是最直接的办法：把输入黑场拉到直方图开始的位置，把输入白场拉到直方图结束的位置，画面就能用满整个范围。Aperture把它实现为伽马空间影调阶段中的一个图层，四个通道（RGB、红、绿、蓝）各有五个控件：“输入黑场”、“输入白场”、“中间调”（灰度系数，范围0.1到10）、“输出黑场”和“输出白场”。三个颜色通道先应用，RGB通道最后应用，因此逐通道的色偏校正和整体的对比度拉伸可以放在同一个图层里。滑块上方是当前结果的直方图，每次改动都会随之更新；和其他图层一样，这个图层也可以加蒙版、设置不透明度和混合模式。',
      whatItDoes: [
        '添加一个“色阶”图层，RGB主通道以及红、绿、蓝通道各自拥有“输入黑场”、“输入白场”、“中间调”、“输出黑场”和“输出白场”。',
        '把选定的输入范围拉伸到选定的输出范围，并对中间调施加灰度系数；超出输入端点的值会被截断到两端。',
        '先应用红、绿、蓝通道，再应用RGB通道，因此色偏修正和对比度修正可以在同一个面板中完成。',
        '绘制实时的RGB和亮度直方图，让黑场和白场可以设在数据真正的两端。',
        '以相同的逐通道映射，从完整分辨率的原图导出校正后的照片。',
      ],
      flowSteps: [
        {
          title: '拖入照片',
          description: '编辑器打开后，“色阶”面板及其直方图位于最前面。',
        },
        {
          title: '设置端点',
          description: '在RGB通道上，把“输入黑场”拖到直方图开始的位置，把“输入白场”拖到直方图结束的位置。',
        },
        {
          title: '修正色偏和中间调',
          description: '切换到红、绿或蓝通道，移动该通道的端点，然后把“中间调”设为小于1来压暗，或设为大于1来提亮。',
        },
        {
          title: '导出',
          description: '选择格式、质量和尺寸；服务器会用相同的色阶渲染原图。',
        },
      ],
      advancedDetails: [
        '每个通道的映射为t = clamp((v - inBlack) / (inWhite - inBlack), 0, 1)，然后out = clamp(t ^ (1 / gamma) x (outWhite - outBlack) + outBlack, 0, 1)；输入跨度的下限为百万分之一，因此黑场和白场相等时也不会除以零。五个值都是0..1之间的小数，所以8位下的黑场26对应0.102。',
        '“中间调”就是灰度系数：大于1会提亮中间部分（输入0.5在灰度系数1.2下变为0.5612，约为255中的143），小于1则压暗（灰度系数0.85把0.5变为0.4424，约113），而0和1保持不变。它与“效果”面板中的“灰度系数”项和“曝光度”部分的“灰度系数”滑块遵循同一条幂律。',
        '图层内部的顺序是固定的：红、绿、蓝各自用自己的五个值映射，然后主映射作用于这三个结果。因此，蓝色通道“中间调”设为0.85之后再做主通道拉伸，拉伸看到的是已经被压暗的蓝色。',
        '“输出黑场”大于0、“输出白场”小于1时，会压缩而不是拉伸范围，哑光效果就是这样做出来的：“输出黑场”0.08、“输出白场”0.97会把纯黑变为0.08（约20），把纯白变为0.97（约247），而0.5则落在0.525。',
        '直方图和预览来自你的GPU（WebGL2），基于照片的1920 px副本；导出文件由我们的服务器用相同的色阶公式，从原图以完整分辨率渲染。预览与导出的差异在一个有文档记录的小容差之内，最多几个8位色阶，颗粒完全一致。',
      ],
      whyItMatters: [
        '扫描件、视频截图以及在雾霾中拍摄的照片很少能达到真正的黑或白；按直方图设置端点，就能恢复对比度，而不改变中间的颜色。',
        '逐通道的端点是最直接的色偏校正：一张蓝色通道从40而不是0开始的扫描件，只需一个滑块就能修好。',
        '输出限制可以为印刷或哑光风格提供可控的褪色效果，而且这些数值可以在下一张照片上照搬。',
      ],
      useCases: [
        {
          title: '挽救发灰的扫描件',
          description: '在RGB上设“输入黑场”0.1、“输入白场”0.9，可把直方图位于26到230之间的扫描件拉伸到全范围。',
        },
        {
          title: '去除通道色偏',
          description: '打开蓝色通道，提高“输入黑场”，直到蓝色直方图的起点与红、绿对齐。',
        },
        {
          title: '哑光胶片效果',
          description: '“输出黑场”0.08、“输出白场”0.97，还可以把蓝色“中间调”稍微调低，让阴影偏暖。',
        },
        {
          title: '为印刷准备图片',
          description: '“输出黑场”0.04、“输出白场”0.96，让影调保持在印刷机能够还原的范围内。',
        },
      ],
      workedExamples: [
        {
          title: '拉伸一张发灰的20 MP扫描件',
          body: '一张5400 x 3600的JPEG扫描件（19.4 MP，7.2 MB），直方图大约从26延伸到230。RGB通道设置：“输入黑场”0.1、“输入白场”0.9、“中间调”1.2、“输出黑场”0、“输出白场”1。像素0.3变为((0.3 - 0.1) / 0.8) ^ (1 / 1.2) = 0.315，约80；0.5的像素变为0.5612，约143；0.7的像素变为0.7868，约201；0.1和0.9分别落在0和1。所有等于或低于0.1的值都被截断为黑色。以质量92导出为JPG时，在Premium或Pro上这个19.4 MP的文件约8.7 MB；访客导出会缩小到12 MP，约5.4 MB。',
        },
        {
          title: '蓝色通道单独修正，再加上适合印刷的主通道',
          body: '一张4000 x 3000的JPEG（12 MP，4.4 MB），阴影偏蓝。蓝色通道：“中间调”0.85，其余保持默认。RGB通道：“输入黑场”0.05、“输入白场”0.95、“输出黑场”0.04、“输出白场”0.96。中性的0.5灰会变为(0.5, 0.5, 0.4412)，约(128, 128, 112)，因为只有蓝色通道经过了灰度系数，而主通道拉伸会把0.5映射回0.5。阴影(0.3, 0.25, 0.2)变为(75, 62, 36)。纯黑落在0.04（10），纯白落在0.96（245），这正是印刷能够还原的输出范围。PNG导出约30 MB；质量92的JPG约5.4 MB。',
        },
      ],
      whenNotToUse: '色阶无法在多个位置弯曲影调曲线，所以要做S形曲线，或只提亮四分之三调，请使用“曲线”面板。如果照片是曝光不足而不是发灰，“曝光度”滑块在线性光下工作，会像相机那样缩放画面，而伽马空间中的色阶做不到这一点。对于由光线造成的色偏，白平衡滑块用两个值而不是三个通道就能修正；如果只需一个滑块就能解决，调整对比度页面更快。',
      whyMediaManipulator: [
        'Aperture在GPU预览、导出服务器和手机应用中用同一个公式应用色阶；你据以设置端点的直方图来自实际渲染结果，而不只是源图。',
        '色阶位于最多64个图层的非破坏性堆栈中，并支持蒙版，所以可以用明亮度范围把影调拉伸限定在天空或阴影。',
        '登录后项目会保存到你的账号，导出则从原始文件渲染，所以在1920 px预览尺寸下校正的扫描件，会以真实的6000 px宽度导出。',
      ],
      privacyNote: '色阶滑块在你的浏览器中针对解码后的照片和结果的直方图计算；只有在导出、生成主体蒙版或修复时才会上传文件，服务器会用相同的端点和灰度系数映射原图。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。登录后，原图及其预览会按你的保留期限设置保存，直到项目被删除。',
      faq: [
        {
          question: '色阶和曲线有什么区别？',
          answer: '色阶是带一处灰度系数弯曲的直线拉伸：每个通道五个数值。曲线可以放置最多16个点，形成任意单调形状。设置黑白场和修正色偏时，色阶更快；曲线则用于在特定影调区间塑造对比度。',
        },
        {
          question: '哪个通道先应用？',
          answer: '先应用红、绿、蓝，各用自己的五个值；最后在已校正的通道上应用RGB主通道。',
        },
        {
          question: '比输入黑场更暗的像素会怎样？',
          answer: '它们会被截断为输出黑场的值，因为归一化值在应用灰度系数之前就被限制到0。直方图会在最左端把它们显示为一个尖峰；如果尖峰变大，就把“输入黑场”往回拉。',
        },
        {
          question: '“中间调”和“曝光度”里的“灰度系数”滑块是一回事吗？',
          answer: '数学上是同一条幂律，out = in ^ (1 / gamma)；但在色阶中，它在每个通道的输入拉伸和输出范围之间运行，并且可以逐通道设置，而“曝光度”的灰度系数做不到。',
        },
        {
          question: '滑块数值能读成8位数值吗？',
          answer: '滑块范围是0到1；乘以255就得到熟悉的0-255数值。“输入黑场”0.1对应色阶26，“输入白场”0.9对应色阶230。',
        },
        {
          question: '色阶拉伸会产生色带断层吗？',
          answer: '拉伸8位源图会把它的数值拉开，所以对发灰的JPEG做强烈拉伸，平滑渐变中可能出现断层。拉伸要适度，或导出为PNG，以免压缩让断层更严重。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '直方图根据渲染后的预览计算；对8位源图做强烈拉伸，可能会让直方图出现断口。',
          'TIFF和BMP扫描件需要账号才能生成可编辑的预览；超过12 MP的导出需要Premium或Pro。',
        ],
      },
      related: [
        {
          label: '曲线',
          to: '/tools/photo-curves',
          description: '自由塑造影调，每个通道最多16个点。',
        },
        {
          label: '调整对比度',
          to: '/tools/adjust-image-contrast',
          description: '端点已经合适时，用单个对比度滑块即可。',
        },
        {
          label: '修正曝光',
          to: '/tools/fix-photo-exposure',
          description: '针对曝光不足的照片，在线性光下调整EV、偏移和灰度系数。',
        },
        {
          label: '白平衡',
          to: '/tools/white-balance-photo',
          description: '用色温和色调修正来自光线而非扫描的色偏。',
        },
        {
          label: '反相颜色',
          to: '/tools/invert-image-colors',
          description: '先把负片反相，再用逐通道色阶去除片基色。',
        },
        {
          label: 'Aperture教程',
          to: '/tutorials/aperture',
          description: '图层、直方图和导出的完整讲解。',
        },
      ],
      embed: {
        title: '调整照片色阶',
        description: '拖入照片即可打开“色阶”面板及其直方图；设置黑场、白场和中间调后导出。',
      },
    },
    'photo-curves': {
      name: '曲线',
      h1: '在线照片曲线工具',
      tagline: '用可拖动的曲线为RGB和每个通道塑造影调与色彩，最多16个点，并带吸管。',
      metaTitle: '在线照片曲线工具：浏览器中的RGB和单通道曲线',
      metaDescription: '浏览器中的曲线：在RGB、红、绿、蓝曲线上拖动最多16个点，用吸管拾取影调，并以完整分辨率导出。',
      ogTitle: '在线照片曲线工具',
      ogDescription: '真正的曲线面板：穿过你所设控制点的单调三次曲线、逐通道控制、吸管、直方图，并从原图以完整尺寸导出。',
      intro: '曲线沿着你画的线，把每个输入影调映射为一个输出影调，是所有编辑器里最灵活的影调与色彩工具。Aperture提供四条曲线：RGB、红、绿、蓝，每条有2到16个可拖动的点，还有一个“从照片中取点”吸管，可按光标下方照片的数值添加一个点。穿过这些点的曲线是单调三次曲线，所以在点与点之间不会过冲或反转；它会被采样为一张256项的表，GPU和导出服务器都用线性插值读取这张表。三条颜色曲线先应用，RGB曲线最后应用，位于图层堆栈的伽马空间影调阶段，配有实时直方图，图层上也有常规的蒙版、不透明度和混合模式控件。',
      whatItDoes: [
        '添加一个“曲线”图层，含RGB、红、绿、蓝四张曲线图；在图上拖动点，每条曲线最多添加16个点，除端点外任何点都可删除。',
        '用单调三次埃尔米特曲线穿过各点，让S形曲线保持平滑，陡峭的台阶也不会产生反转。',
        '把每条曲线采样为256项，先应用颜色曲线，再对结果应用RGB曲线。',
        '用吸管从照片中取点，让特定的肤色或天空数值成为曲线图上的一个控制点。',
        '在实时直方图上显示结果，并从完整分辨率的原图导出。',
      ],
      flowSteps: [
        {
          title: '拖入照片',
          description: '编辑器打开后，“曲线”面板和RGB曲线图位于最前面。',
        },
        {
          title: '放置控制点',
          description: '点击曲线图，或在照片上使用吸管添加点，然后拖动它们来塑造曲线。',
        },
        {
          title: '调整各通道',
          description: '切换到红、绿或蓝，修正色偏，或用方向相反的曲线来调色。',
        },
        {
          title: '导出',
          description: '选择格式和尺寸；服务器会构建相同的表并渲染原图。',
        },
      ],
      advancedDetails: [
        '各点的x必须从0到1严格递增。各点的斜率采用Fritsch-Carlson方法：相邻点之间的割线斜率为d；端点斜率等于第一条或最后一条割线的斜率；内部点的斜率等于两侧割线斜率的平均值（若两条割线符号相反则为0）；任何一对斜率，只要与割线斜率之比的平方超过9，就会按比例缩小，使该段不会过冲。',
        '每条曲线用三次埃尔米特基函数（2t³ - 3t² + 1、t³ - 2t² + t及其互补项）在x = i / 255处采样256个值，并限制到0..1；第一个点之前的x取第一个点的y，最后一个点之后的x取最后一个点的y。之后读取像素值时，在最近的两个表项之间做线性插值，这正是GPU线性采样器的做法。',
        '穿过(0.25, 0.2)和(0.75, 0.8)的对称S形曲线会把0.4变为0.3716，把0.6变为0.6284，并让0.5精确保持为0.5；它的第127和128个表项为0.4975和0.5025，采样0.5时正好落在两者中间。',
        '图层内部的顺序：红、绿、蓝曲线各自映射自己的通道，然后RGB曲线映射这三个结果。由于拟合是单调的，从(0.4, 0.1)到(0.5, 0.9)的陡峭三点台阶会精确地在1处达到峰值，没有振铃；而普通三次样条会在台阶旁冲到1以上和0以下。',
        '你拖动曲线时对照的预览由你的GPU（WebGL2）基于1920 px副本绘制；导出文件由我们的服务器用相同的表和插值方式，从原图以完整分辨率渲染，两者的差异在一个有文档记录的小容差之内，最多几个8位色阶（颗粒完全一致）。',
      ],
      whyItMatters: [
        'S形曲线在需要的地方增加对比度，同时保护两端，而以中灰为支点的对比度滑块做不到这一点。',
        '逐通道曲线是调色最精确的形式：抬高蓝色阴影、压低蓝色高光，就是经典的冷阴影暖高光分离，而且是精确画出来的，不是近似出来的。',
        '吸管把曲线图和真实像素联系起来，所以你校正的正是你点击的那个影调，而不用去猜它在坐标轴上的位置。',
      ],
      useCases: [
        {
          title: '用柔和的S形曲线增加冲击力',
          description: '在RGB上放置(0.25, 0.2)和(0.75, 0.8)：阴影在0.25处压暗约13个色阶，高光在0.75处提亮相同幅度，中灰不变。',
        },
        {
          title: '哑光褪色',
          description: '把RGB的第一个点抬高到y = 0.08，让纯黑变为255中的20，并添加(0.3, 0.3)让中间调保持原位。',
        },
        {
          title: '冷化阴影',
          description: '在蓝色曲线上添加(0.25, 0.3)；在红色曲线上添加(0.25, 0.22)。阴影偏向蓝色，而高光保持中性。',
        },
        {
          title: '修正特定影调',
          description: '在脸上使用“从照片中取点”，然后把该点向上或向下拖动几个百分点；只有附近的影调会变化。',
        },
      ],
      workedExamples: [
        {
          title: '24 MP风景照：S形曲线加蓝色通道下压',
          body: '一张6000 x 4000的JPEG（24 MP，10.2 MB）。RGB曲线的点：(0, 0)、(0.25, 0.2)、(0.75, 0.8)、(1, 1)。蓝色曲线的点：(0, 0)、(0.5, 0.45)、(1, 1)。以天空像素(0.35, 0.55, 0.85)，即(89, 140, 217)为例：蓝色曲线先把0.85映射为0.8729，然后RGB的S形曲线把三个通道映射为(0.3104, 0.5648, 0.8729)，即(79, 144, 223)，天空因此对比度增加，中间调里的蓝色略有减少。仅看S形曲线，0.1变为0.0752（19），0.4变为0.3716（95），0.6变为0.6284（160），0.9变为0.9248（236）。以质量92导出JPG时，在Premium或Pro上约10.8 MB；访客则为12 MP，约5.4 MB。',
        },
        {
          title: '12 MP人像：提亮加哑光',
          body: '一张3000 x 4000的JPEG（12 MP，4.6 MB）。第一个图层，RGB点为(0, 0)、(0.5, 0.6)、(1, 1)：单个抬高的中点把0.25变为0.3125（80），0.5变为0.6（153），0.75变为0.8125（207），0.9变为0.9232（235），平滑地提亮画面，同时两端保持不变。第二个图层，RGB点为(0, 0.08)、(0.3, 0.3)、(1, 1)：纯黑变为0.08（20），0.1变为0.1504（38），0.3保持0.3，而0.5略微下降到0.4864（124），因为单调拟合在固定点之后会变平。两个图层都可以分别撤销。以质量85导出WebP约3.6 MB。',
        },
      ],
      whenNotToUse: '如果照片只需要设置黑场和白场，用曲线就大材小用了，“色阶”面板用两个滑块和一个直方图就能完成；如果一次整体的对比度或亮度调整就够了，“基本”面板一步即可搞定。曝光问题应交给“曝光度”滑块，因为它们在线性光下工作，而曲线不是。如果某种调色已经有现成的CUBE文件（.cube），应用LUT页面会套用精确的表，而不是手绘的近似。',
      whyMediaManipulator: [
        'Aperture在GPU预览、导出服务器和手机应用中统一使用公开的单调样条和256项的表，所以你画一次的曲线，在Media Manipulator任何显示它的地方都渲染一致。',
        '“曲线”图层可以与蒙版叠加，所以S形曲线可以限定在某个明亮度范围或画笔涂抹的区域内，逐通道调色也可以借助主体蒙版只作用于背景。',
        '曲线以控制点的形式存储在项目文档中，因此保存的项目以后仍可编辑，导出也不受预览分辨率影响。',
      ],
      privacyNote: '曲线控制点会在你的浏览器中转换为查找表，并在那里应用到解码后的照片上；只有在你导出、选择主体或修复时才会上传文件，服务器会为原图重建相同的表。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。有账号时，原图及其1920 px预览会按你的保留期限设置保存，直到你删除项目。',
      faq: [
        {
          question: '一条曲线可以有多少个点？',
          answer: '每条曲线2到16个，x值必须严格递增。两个端点可以上下移动但不能删除；中间的任何点都可以拖动或删除。',
        },
        {
          question: '为什么曲线在点与点之间从不过冲？',
          answer: '它是Fritsch-Carlson单调三次曲线：每个点的斜率都受到限制，使两点之间的线段始终位于它们的y值之间。陡峭的上升仍会精确到达顶点，但不会像自由三次样条那样鼓出越过它。',
        },
        {
          question: '哪条曲线先应用，RGB还是颜色通道？',
          answer: '先应用红、绿、蓝曲线，各自作用于自己的通道，然后RGB曲线作用于这三个输出。所以RGB的S形曲线是在已经完成颜色校正的通道上增加对比度。',
        },
        {
          question: '256项的表有多精确？',
          answer: '每个表项都是在i / 255处采样的浮点数，两个表项之间的像素值通过线性插值得到，所以对任何平滑曲线，与精确样条的误差都远小于一个8位色阶。',
        },
        {
          question: '吸管有什么作用？',
          answer: '“从照片中取点”会在当前曲线上、光标下方数值对应的x位置添加一个点（RGB曲线取亮度值，其他曲线取该通道的值），并令y等于x，所以在你拖动它之前什么都不会改变。',
        },
        {
          question: '曲线能修正色偏吗？',
          answer: '能。用吸管在每个通道上找到一个中性灰，拖动得到的点直到三个输出一致；或者提高偏弱的那个通道的输入端。对于光线造成的色偏，白平衡通常更快。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '每条曲线都会变成一张256项的表；在8位源图上使用陡峭曲线可能让直方图出现断口，在意这一点时请导出PNG。',
          'HEIC、HEIF、TIFF和BMP需要账号才能生成可编辑的预览；超过12 MP的导出需要Premium或Pro。',
        ],
      },
      related: [
        {
          label: '色阶',
          to: '/tools/photo-levels',
          description: '每个通道五个数值的端点和灰度系数，适合快速拉伸。',
        },
        {
          label: '调整对比度',
          to: '/tools/adjust-image-contrast',
          description: '用不着完整曲线时的单滑块版本。',
        },
        {
          label: '分离色调',
          to: '/tools/split-toning',
          description: '两种色相加一个平衡滑块，是相反颜色曲线的快捷方式。',
        },
        {
          label: '应用LUT',
          to: '/tools/apply-lut-to-photo',
          description: '调色已经保存为CUBE文件（.cube）时，载入3D表即可。',
        },
        {
          label: '色彩平衡',
          to: '/tools/color-balance-photo',
          description: '用保持明度的三段RGB偏移代替手绘曲线。',
        },
        {
          label: 'Aperture教程',
          to: '/tutorials/aperture',
          description: '图层堆栈、蒙版和历史记录如何协同工作。',
        },
      ],
      embed: {
        title: '调整照片曲线',
        description: '拖入照片即可打开“曲线”面板；在RGB或各通道曲线图上拖动点，用吸管拾取影调，然后导出。',
      },
    },
    'white-balance-photo': {
      name: '白平衡',
      h1: '在线修正照片的白平衡',
      tagline: '用在线性光下作用于中间调的色温和色调滑块，去除偏黄、偏蓝、偏绿或偏洋红的色偏。',
      metaTitle: '在线修正照片的白平衡和色偏 | Aperture',
      metaDescription: '在浏览器中校正色偏。色温和色调滑块在线性光下移动中间调，配有实时预览和完整分辨率导出。',
      ogTitle: '在线修正照片的白平衡',
      ogDescription: '在线性光下调整色温和色调，并向中间调加权，让黑色和白色保持中性。实时预览，完整分辨率导出。',
      intro: '色偏是相机把光线判断错了的结果：钨丝灯下一切发橙，背阴处一切发蓝，日光灯管和某些LED面板则让画面发绿。Aperture“基本”面板中的“白平衡”组提供两个滑块，分别抵消这些色偏：“色温”让照片在蓝色（负值）和琥珀色（正值）之间移动，“色调”让照片在绿色（负值）和洋红（正值）之间移动。两者都在sRGB解码之后、在线性光下工作，并按明度向中间调加权，因此灰墙、皮肤和桌布上的色偏会被去掉，而最深的阴影和最亮的白色基本不受影响。开始之前，可以先用“颜色（HSL）”和“蒙版”面板中的吸管看看本应是中性色的表面实际读数是多少。',
      whatItDoes: [
        '“色温”范围为-100到+100：在线性光下，给红通道加上temperature / 100乘以中间调权重，并从蓝通道减去同样的量。负值让偏橙的钨丝灯照片变冷，正值让偏蓝的背阴照片变暖。',
        '“色调”范围为-100到+100：从绿通道减去tint / 100乘以同一权重，因此正值去除日光灯的绿色色偏，负值去除洋红色偏。',
        '中间调权重在线性明度为0.5（sRGB值约188）时达到峰值0.7，在线性明度低于0.208（sRGB 126）或高于0.792（sRGB 230）时降为零，因此深阴影和接近白色的区域不会偏移。',
        '结果会重新编码为sRGB并截断到有效范围，而且这个图层可以加蒙版：日光房间里的一盏钨丝灯，应当在降温图层上加径向蒙版来处理，而不是做全局调整。',
        '如果阴影和高光的色偏不同，本页会引导你使用“色彩平衡”面板，它为阴影、中间调和高光分别提供红、绿、蓝滑块。',
      ],
      flowSteps: [
        {
          title: '找一个中性色',
          description: '打开照片，找一样本应是灰色或白色的东西：纸、墙、衬衫。它的通道数值会告诉你色偏偏向哪一边。',
        },
        {
          title: '设置色温',
          description: '如果这个中性色上红色高于蓝色，就把“色温”往负值拖，直到两者相等；如果蓝色更高，就往正值拖。对于数值在150到220左右的表面，中间调权重承担了大部分工作。',
        },
        {
          title: '设置色调',
          description: '如果绿色仍高于红色和蓝色，就提高“色调”；如果低于它们，就降低“色调”。通常10到20的小数值就够了。',
        },
        {
          title: '对比并导出',
          description: '按住反斜杠键与原图对比，然后导出。服务器会对完整分辨率的文件应用同样的线性光偏移。',
        },
      ],
      advancedDetails: [
        '逐像素处理：先把R、G、B从sRGB解码为线性值（低于0.04045时为v / 12.92，否则为((v + 0.055) / 1.055)的2.4次方）。明度l取线性通道的(max + min) / 2。权重w = clamp((l - 0.333) x 4 + 0.5) x clamp((1 - l - 0.333) x 4 + 0.5) x 0.7。',
        '然后R += (temperature / 100) x w，G += (-tint / 100) x w，B += (-temperature / 100) x w，每个值截断到0到1之间，再把三个通道编码回sRGB。这里原样复用了Darkroom视频编辑器的中间调色彩平衡。',
        '权重取值：线性明度0.1时为0，0.25时为0.118，0.333时为0.342，0.5时为0.7，0.6时为0.538，0.75时为0.118，0.9时为0。换算成sRGB，效果大致局限在126到230之间，在188附近最强。',
        '灰色示例：sRGB灰度188在“色温”+40时变为229, 188, 130；在-40时变为130, 188, 229。同一滑块作用于灰度128时得到129, 128, 126，作用于230时得到230, 230, 229：按设计，中间调之外的偏移很小。',
        '同样作用于灰度188的“色调”：+30得到188, 147, 188（绿色被去除，所以像素看起来偏洋红），-30得到188, 220, 188。',
        '预览由你的GPU（WebGL2）基于1920 px副本绘制；导出文件则由我们的服务器基于原图、用同样的公式以完整分辨率渲染。两者的差异在有记录的小容差之内，最多只有几个8位色阶（颗粒完全一致）；白平衡是逐像素运算，能精确到每一个色阶。',
      ],
      whyItMatters: [
        '色偏是观看者最先注意到、却最说不出来的东西；先修正它，再做其他调整，后面的饱和度、对比度和曲线调整就都是在真实的颜色上进行的。',
        '这里之所以要在线性光下工作，是因为光是加性混合的；直接移动sRGB数值，同一个色偏会让暗部和亮部移动不同的量。',
        '向中间调加权能让黑色保持黑色、白色保持白色，这正是正确白平衡应有的样子：色偏存在于受光的表面，而不在两端。',
      ],
      useCases: [
        {
          title: '灯泡下偏橙的室内照片',
          description: '“色温”-35能把读数为210, 170, 120的墙面变成177, 170, 168，接近中性；而90, 70, 50的阴影不受影响，因为它的明度低于权重阈值。',
        },
        {
          title: '背阴处或雪地里偏蓝的照片',
          description: '“色温”+25能把背阴处150, 160, 180的灰色暖化为174, 160, 157；对于200, 210, 235的雪，要用+50才能达到218, 210, 219，因为接近白色时权重已经在下降。',
        },
        {
          title: '办公室或健身房的绿色灯光',
          description: '“色调”+15能把185, 200, 180的墙面变为185, 183, 180，去除日光灯的绿色，而不碰红、蓝通道。',
        },
        {
          title: '混合光',
          description: '日光房间里有一盏钨丝灯：先全局修正房间，再添加第二个“白平衡”图层，把“色温”设为-40，并加上以灯为中心的径向蒙版。',
        },
      ],
      workedExamples: [
        {
          title: '钨丝灯下的晚餐照片，12 MP，“色温”-35',
          body: '一张由暖色灯泡照明的4000 x 3000 JPEG（12 MP，3.9 MB）。白色桌布读数为210, 170, 120，一处中间调为160, 130, 95，一个暗角为90, 70, 50，一张明亮的餐巾为250, 235, 200。“色温”-35把桌布映射为177, 170, 168，中间调映射为155, 130, 104，暗角保持90, 70, 50不变（其线性明度低于0.208的阈值），餐巾只移动到247, 235, 204。桌布现在与中性相差不超过9个色阶；如有需要，“色调”+5可以用少许绿色换来一点洋红。以JPG、质量92导出，约5.4 MB，计为一次常规任务，在访客上限之内。',
        },
        {
          title: '背阴处偏蓝的人像，20 MP，“色温”+20',
          body: '一张在背阴处拍摄的5472 x 3648 JPEG（20 MP，7.4 MB）。灰色夹克读数为150, 160, 180，脸颊为190, 165, 160。“色温”+20把夹克变为170, 160, 162，把脸颊变为210, 165, 131：夹克几乎成了中性色，而皮肤明显变暖，因为它的明度正好靠近权重峰值。如果脸上效果太强，把同一图层的不透明度设为60%，结果就会向原图回退40%。以WebP、质量90导出时，这个20 MP的文件在付费套餐上约为6 MB，在12 MP上限下约为3.6 MB。',
        },
      ],
      whenNotToUse: '“色温”和“色调”只移动中间调，所以当色偏在阴影或高光中最强时，比如某些水下照片中偏青的阴影，就需要使用分行控制的“色彩平衡”面板。如果目的是增添氛围而不是去除色偏，“照片滤镜”和“分离色调”面板正是为此设计的，而且会保持明度。另外，如果原图某个通道已经溢出，比如红色舞台灯下红通道被钉死在255，任何白平衡都无法在那里还原出中性色，因为信息已经丢失了。',
      whyMediaManipulator: [
        'Aperture在线性光下应用白平衡，并使用有据可查的中间调权重，而不像许多快捷滤镜那样把整张图片均匀染色。',
        '这个图层可以用画笔、径向、渐变、明亮度、颜色范围或主体来加蒙版，混合光照正是这样才能被正确修正。',
        '同样的“色温”和“色调”算法也运行在本站的Darkroom视频编辑器中，因此同一次拍摄的照片和视频可以按数值相互匹配。',
      ],
      privacyNote: '白平衡校正会在线性光下移动中间调的红、绿、蓝，这一偏移在你编辑时由你的显卡完成；作为访客，照片会一直留在此浏览器中，直到你导出、选择主体或修复。导出时会上传一次原图，好让服务器在每个完整分辨率像素上重复同样的偏移，结果会像其他任务一样保留。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。不会与任何第三方共享。',
      faq: [
        {
          question: '为什么非常暗和非常亮的区域仍有色偏？',
          answer: '线性明度低于约0.21或高于约0.79时，中间调权重为零。色偏通常存在于受光的中间调，所以这样处理一般是对的；当色偏延伸到阴影中时，请使用“色彩平衡”面板，它的“阴影”一行有独立的红、绿、蓝滑块。',
        },
        {
          question: '去除黄色或橙色色偏要往哪个方向调？',
          answer: '把“色温”调为负值。它在线性光下减少红色、增加蓝色，因此210, 170, 120的钨丝灯墙面在-35时变为177, 170, 168。如果结果略微偏绿，就加几点正的“色调”。',
        },
        {
          question: '有自动白平衡或用于中性色的吸管吗？',
          answer: '“预设”面板中的“自动”风格会添加一组起始调整，你可以继续调整或撤销。“白平衡”组本身只有两个滑块；“颜色（HSL）”和“蒙版”面板中的吸管可以从照片中读取颜色，适合用来检查一个所谓的中性色实际包含什么。',
        },
        {
          question: '多大的“色温”数值算正常？',
          answer: '大多数色偏在15到40之间。在40时，188的中灰在红色上移动41个色阶，在蓝色上移动58个，这已是很强的校正；接近100的数值适合创意性着色，而不是修正。',
        },
        {
          question: '白平衡会改变亮度吗？',
          answer: '会略微改变，因为一个通道上升、另一个通道以相同的线性量下降，而红色和蓝色的亮度权重不同：把188的灰色以-40冷却，得到130, 188, 229，其亮度略低于原值。变化最多只有几个色阶，除非某个通道本已接近边缘，否则不会溢出。',
        },
        {
          question: '天空和地面的色偏不同，能修正吗？',
          answer: '可以，用两个图层：一个“白平衡”图层加上覆盖天空的线性渐变蒙版，另一个用于地面；或者用一个分别处理高光和阴影的“色彩平衡”图层。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '白平衡作用于解码后的图像，而不是原始传感器数据，因此已经烘焙进JPEG、且有通道溢出的色偏，无法在该通道上完全中和。',
          '线性光的解码和编码以浮点逐像素运行，不涉及邻域，因此导出时间取决于文件大小，而不是滑块数值。',
        ],
      },
      related: [
        {
          label: '色彩平衡',
          to: '/tools/color-balance-photo',
          description: '当一次偏移不够时，可分别控制阴影、中间调和高光的红、绿、蓝。',
        },
        {
          label: '为照片着色',
          to: '/tools/tint-photo',
          description: '“照片滤镜”面板，用于有意添加一种颜色，而不是去除颜色。',
        },
        {
          label: '色阶',
          to: '/tools/photo-levels',
          description: '按通道设置输入点，这是在黑端和白端中和色偏的另一种方式。',
        },
        {
          label: '曲线',
          to: '/tools/photo-curves',
          description: '红、绿、蓝曲线，用于随亮度变化的色偏。',
        },
        {
          label: '图片饱和度',
          to: '/tools/image-saturation',
          description: '在去除色偏之后再增强色彩，而不是之前。',
        },
      ],
      embed: {
        title: '修正色偏',
        description: '把偏黄、偏蓝或偏绿的照片拖放到这里。“基本”面板会在“白平衡”组上打开。',
      },
    },
    'black-and-white-photo': {
      name: '黑白照片',
      h1: '在线将照片转换为黑白',
      tagline: '按通道加权的单色转换，带六个颜色滑块、柔和的胶片曲线和细腻的颗粒，打开时即应用，导出前仍可调整。',
      metaTitle: '在线将照片转换为黑白 | Media Manipulator',
      metaDescription: '可逐色控制的黑白：六个通道滑块决定红、黄、绿、青、蓝和洋红如何变为灰色。已应用胶片风格，完整尺寸导出。',
      ogTitle: '黑白照片转换器 | Media Manipulator',
      ogDescription: '六个通道滑块、可选着色、胶片曲线和颗粒。在你的GPU上实时预览，导出由我们的服务器基于原图渲染。',
      intro: '本页会在“黑白”面板上打开Media Manipulator的照片编辑器Aperture，并已应用名为“黑白胶片”的风格，它是一个包含三个图层的组：一个使用默认通道权重的“黑白”图层，一个经过(0.25, 0.22)和(0.75, 0.78)的柔和S形“曲线”图层，以及一个数量为20的“颗粒”图层。“黑白”图层是按色相工作的通道混合，而不是简单的去饱和：每个像素的灰度是其亮度与一个加权值之间的混合，权重来自六个滑块，默认为“红色”40、“黄色”60、“绿色”40、“青色”60、“蓝色”20和“洋红”80。把“蓝色”往下拖，天空就会变暗；把“红色”往上拖，嘴唇和砖墙就会变亮。曲线和颗粒是独立的图层，可以调整或删除。',
      whatItDoes: [
        '用六个范围为-200到300的通道滑块把每个像素转换为灰色，决定每个色系变得多亮，这正是胶片时代暗房滤镜、如今桌面编辑器的黑白面板所提供的控制。',
        '打开时应用“黑白胶片”：默认通道权重；一个控制点为(0, 0)、(0.25, 0.22)、(0.75, 0.78)、(1, 1)的“曲线”图层，略微压低阴影、提亮高光；以及一个数量20、大小1、粗糙度50的“颗粒”图层。',
        '“风格”面板中还提供“高对比度黑白”作为替代：“红色”40、“黄色”40、“蓝色”-40，加上“对比度”+40和“清晰度”25，效果更硬朗，天空更暗。',
        '可选的“色调”带有色相和强度，能让灰色偏向棕褐、硒调蓝或任何其他单一颜色，而无需第二个图层。',
        '转换以图层形式保留：可以加蒙版让某个区域保持彩色，降低不透明度实现部分去饱和，把它重新排到“曲线”图层之下，并以完整分辨率导出。',
      ],
      flowSteps: [
        {
          title: '拖放照片',
          description: 'JPG、PNG、WebP、GIF、HEIC、AVIF或TIFF。编辑器在“黑白”面板上打开，胶片风格已在堆栈中。',
        },
        {
          title: '设置通道滑块',
          description: '降低“蓝色”让天空变暗，提高“红色”或“黄色”让皮肤变亮，提高“绿色”让树叶更亮；直方图会跟随每一次调整。',
        },
        {
          title: '调整曲线和颗粒',
          description: '编辑风格添加的“曲线”图层，在“细节”面板中更改“颗粒”的数量或大小，或者从组中删除其中任一图层。',
        },
        {
          title: '导出',
          description: '以你选择的质量导出为JPG、PNG、WebP、AVIF或TIFF；服务器会用相同的种子精确重现颗粒。',
        },
      ],
      advancedDetails: [
        '对每个像素，编辑器取其HSV饱和度S和明度值V、BT.709亮度L = 0.2126 R + 0.7152 G + 0.0722 B，以及色相h。灰度为(1 - S) x L + S x (六个范围上w_i(h) x k_i / 100之和) x V，其中k_i是通道滑块，w_i是标准的色相范围权重：在默认“宽度”30和“羽化”30下，距范围中心15度以内为1，到45度线性降为0。灰色像素的S = 0，其亮度完全保持不变；完全饱和的纯红色S = 1，变为“红色”/100 x V，默认值下为0.4，即色阶102。',
        '滑块可以超出自然范围：通道设为300时，饱和的色相会变成其值的三倍，然后再截断；通道为负值时会把它拉到零以下并截断为黑色，“高对比度黑白”正是这样把深蓝的天空变成纯黑的。',
        '可选的着色会在灰度的每个通道上加上“着色强度” / 100 x 0.25 x (hueToRGB(h) - 0.5)，其中h为“着色色相”，hueToRGB给出该色相的完全饱和颜色。在中灰128上使用色相40、强度30的暖色着色，得到(137, 131, 118)。',
        '风格中的“曲线”图层是一条经过四个点的Fritsch-Carlson单调三次曲线，采样成256项查找表，因此0.25精确映射为0.22，0.75映射为0.78，0.5映射为0.5。“颗粒”图层每像素加上amount / 100 x 0.2 x (noise - 0.5)，数量为20时最多为0.02，约5个色阶，噪声来自像素位置与种子的哈希。',
        '你屏幕上的预览是你自己的GPU用WebGL2对1920 px副本的渲染；下载的文件由我们的服务器基于完整分辨率原图、用相同的通道、曲线和颗粒代码渲染。颜色阶段的平均误差在1以内、最大误差在4个色阶以内；颗粒哈希是共享的，因此颗粒完全一致。',
      ],
      whyItMatters: [
        '简单的去饱和会把亮度相同的红色和绿色映射为同一种灰，于是一朵红花会消失在它的叶子里；通道权重正是把它们区分开的关键。',
        '天空、皮肤和树叶各有自己的色系，所以三个滑块就足以确定大多数照片的影调关系。',
        '颗粒和柔和的曲线能让数码转换看起来像一张印放的照片，而不是一张灰色的JPEG；在这里它们是两个可以关闭的图层。',
      ],
      useCases: [
        {
          title: '人像',
          description: '稍微提高“红色”和“黄色”让皮肤透亮，降低“蓝色”让背景退后，保留颗粒以增加质感。',
        },
        {
          title: '带天空的风光',
          description: '“蓝色”-40、“青色”20可以得到胶片上加红色滤镜时的暗色天空；提高“绿色”能让草地和树木在天空映衬下更亮。',
        },
        {
          title: '建筑和街头',
          description: '带“清晰度”25的“高对比度黑白”能凸显石材、混凝土和玻璃的边缘。',
        },
        {
          title: '档案和文件',
          description: '使用默认权重并移除曲线，可为扫描件和翻拍件得到中性的转换。',
        },
      ],
      workedExamples: [
        {
          title: '带蓝天的人像：在24 MP的JPEG上使用“黑白胶片”',
          body: '一张6000 x 4000的JPEG（24 MP，11 MB），使用默认通道权重。皮肤像素(217, 158, 128)的HSV饱和度为0.412，明度值0.85，亮度0.660；它的色相为20.6度，使“红色”权重为0.814、“黄色”为0.186，因此加权项为0.814 x 0.4 + 0.186 x 0.6 = 0.437，灰度为0.588 x 0.660 + 0.412 x 0.437 x 0.85 = 0.541，即色阶138。天空像素(140, 191, 242)，色相210，饱和度0.421，明度值0.95，亮度0.722，从值为0.6的“青色”得到0.5的权重，从值为0.2的“蓝色”也得到0.5，因此灰度为0.579 x 0.722 + 0.421 x 0.4 x 0.95 = 0.578，即色阶147。随后曲线把0.541映射为0.549（140），把0.578映射为0.592（151），颗粒再向任一方向增减最多5个色阶。128的灰卡经过两者后仍为128。导出完整的24 MP需要Premium或Pro；质量92的JPG约为10.8 MB。',
        },
        {
          title: '压暗天空：在12 MP的照片上使用“蓝色”-40和“高对比度黑白”',
          body: '一张4000 x 3000的JPEG（12 MP，5 MB）。切换到“高对比度黑白”会把“红色”设为40、“黄色”40、“蓝色”-40，并保留“绿色”40、“青色”60、“洋红”80。同一个天空像素(140, 191, 242)现在的加权项为0.5 x 0.6 + 0.5 x -0.4 = 0.1，因此灰度为0.579 x 0.722 + 0.421 x 0.1 x 0.95 = 0.458，即色阶117，而不是147。一件(51, 77, 204)的深蓝夹克，色相230，饱和度0.75，明度值0.8：0.25 x 0.315 + 0.75 x -0.4 x 0.8 = -0.161，截断为0，即纯黑。(204, 51, 51)的红门在切换后不变，为0.25 x 0.328 + 0.75 x 0.4 x 0.8 = 0.322，即色阶82，因为“红色”仍是40。随后这个风格还会以两个额外图层添加“对比度”+40和“清晰度”25。这个12 MP的导出在免费账号的上限之内，以JPG、质量92导出约为5.4 MB。',
        },
      ],
      whenNotToUse: '黑白转换会丢弃色相，所以当目标是保留一种颜色、其余变灰时，色彩突出页面会保留色相信息，只降低其他范围的饱和度。如果照片本来就是单色、只是发灰，曲线、色阶或对比度页面可以直接改变它的影调，而不必插入一个转换图层。褪色的彩色照片需要找回颜色，那是饱和度或自然饱和度的工作。至于棕褐色调或蓝晒效果，应在这次转换之上叠加“照片滤镜”或分离色调图层，而不是用它们来替代转换。',
      whyMediaManipulator: [
        'Aperture用六个色相通道、一个着色以及范围从-200到300的滑块进行转换，因此转换是针对每种颜色的决定，而不是一个去饱和按钮。',
        '胶片风格是由三个普通图层组成的组：曲线和颗粒仍可编辑，“撤销”会把三者一起移除。',
        '每个滑块、所有风格和撤销历史都是免费的，完整尺寸的导出计为一次常规任务；服务器会用相同的种子精确重现颗粒。',
      ],
      privacyNote: '转换为黑白、更改通道滑块和添加颗粒，都在你的浏览器中基于你拖放的照片计算；不会为此上传任何内容。未登录时，项目保存在此浏览器的IndexedDB中，直到你导出，而导出是一次普通的访客任务。登录后，原图及其1920 px预览和缩略图会随项目按你的保留设置保存，并在删除项目或账号时一并删除。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。渲染由我们自己的服务器完成，不涉及任何第三方。',
      faq: [
        {
          question: '为什么不直接把饱和度设为-100？',
          answer: '“饱和度”-100会把每个像素映射为它的亮度，于是亮度相同的颜色会混在一起。“黑白”图层让你决定蓝色比红色更暗、黄色比绿色更亮，从而把天空和云朵、嘴唇和脸颊区分开。',
        },
        {
          question: '默认数值40、60、40、60、20、80是什么意思？',
          answer: '它们是每个色系保留饱和颜色值的百分比：纯红色变为其值的40%，纯黄色为60%，纯蓝色为20%。它们与大多数桌面编辑器的默认值一致，因此在别处用相同数值做的转换，在这里看起来也一样。',
        },
        {
          question: '能让照片的一部分保持彩色吗？',
          answer: '给“黑白”图层加一个蒙版：在要保持彩色的区域涂一个“画笔”组件并打开“反相”，或者添加一个设为“减去”的“颜色范围”组件。除非你也给风格中的曲线和颗粒图层加蒙版，否则它们照样会生效。',
        },
        {
          question: '导出文件中的颗粒和屏幕上看到的一样吗？',
          answer: '是的，完全一样。颗粒是像素位置与种子的哈希，不使用随机数，服务器在原始像素上使用同样的哈希。由于预览是1920 px副本，屏幕上的颗粒是缩放过的，而导出的颗粒对应每个原始像素。',
        },
        {
          question: '能导出真正的灰度文件吗？',
          answer: '导出会以你选择的格式写入一个三通道相等的RGB文件。黑白图像的JPG或WebP压缩效果很好，因为色度是空的，所以在相同质量下，文件比彩色原图更小。',
        },
        {
          question: '怎样得到棕褐色调的照片，而不是中性灰？',
          answer: '在“黑白”面板中打开“色调”，把“着色色相”设为约35到40，强度设为20到30。灰色会被推向该色相，推动量为色相颜色与中灰之间距离的strength / 100 x 0.25，因此效果依然含蓄。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '转换、曲线和颗粒都是逐像素的处理阶段；导出的颗粒由服务器用相同的种子生成，与参考结果逐位一致。',
          '在相同质量下，黑白的JPG和WebP导出通常比彩色原图小三分之一，因为色度平面不携带任何信息。',
        ],
      },
      related: [
        {
          label: '色彩突出',
          to: '/tools/color-pop',
          description: '除一个色系外全部变为单色。',
        },
        {
          label: '为照片着色',
          to: '/tools/tint-photo',
          description: '一个“照片滤镜”图层，可在灰色上叠加更浓的棕褐色或任意颜色。',
        },
        {
          label: '曲线',
          to: '/tools/photo-curves',
          description: '用每个通道最多16个点塑造转换后的影调。',
        },
        {
          label: '添加晕影',
          to: '/tools/add-vignette',
          description: '压暗的边缘是黑白照片常见的搭配。',
        },
        {
          label: '分离色调',
          to: '/tools/split-toning',
          description: '在灰色上叠加两种着色，一种用于阴影，一种用于高光。',
        },
        {
          label: '锐化照片',
          to: '/tools/sharpen-photo-online',
          description: '带阈值、作用于亮度的USM锐化，让单色细节更清晰。',
        },
      ],
      embed: {
        title: '将照片转换为黑白',
        description: '拖放一张照片，打开已应用“黑白胶片”风格的Aperture；调整六个通道滑块、曲线和颗粒，然后导出。',
      },
    },
    'tint-photo': {
      name: '为照片着色',
      h1: '在线为照片着色',
      tagline: '像镜头前的滤镜一样给照片罩上一层颜色：选择加温、冷却、棕褐色或任意自定义颜色，设置浓度，并保持亮度不变。',
      metaTitle: '在线为照片着色：加温、棕褐色或任意颜色 | Media Manipulator',
      metaDescription: '用照片滤镜图层为照片添加色调：加温、冷却、棕褐色、红、绿、蓝或自定义十六进制颜色，浓度0到100，保持明度。完整尺寸导出。',
      ogTitle: '在线为照片着色 | Media Manipulator',
      ogDescription: '“照片滤镜”图层把图像乘以一种颜色并按浓度混合，还可以选择让明亮度保持不变。在你的GPU上预览，基于原图导出。',
      intro: '本页会打开Media Manipulator的照片编辑器Aperture，并直接显示“照片滤镜”面板：已载入“加温”滤镜，“浓度”为25，“保持明度”已开启。这里的照片滤镜和镜头前的玻璃滤镜作用相同：每个像素都与滤镜颜色相乘，“浓度”滑块决定像素从原值向相乘后的值移动多远。开启“保持明度”后，结果还会按比例缩放回去，使它的BT.709亮度与原图相等，因此只着色、不变暗。六个滤镜按钮（“加温”、“冷却”、“棕褐色”、“红”、“绿”、“蓝”）用来设定颜色，“自定义颜色”则接受任意十六进制颜色值。想做棕褐色老照片，就把它叠在“黑白”图层之上。',
      whatItDoes: [
        '打开时即载入一个“照片滤镜”图层，使用“加温”颜色#ec8a00，“浓度”为25；另有“冷却”#0a5dc8、“棕褐色”#ac7a33、“红”#e81c1c、“绿”#1fb52f、“蓝”#1c3ee8，以及“自定义颜色”拾色器。',
        '“浓度”范围为0到100：为0时图层不起作用，为100时每个像素都完全乘以滤镜颜色，介于两者之间则是直接的线性混合。',
        '“保持明度”默认开启，它会重新缩放每个着色后的像素，使其亮度与着色前一致，从而保留照片的曝光，让滤镜只改变颜色。',
        '和其他调整一样以图层方式工作：可以加蒙版只为天空着色，可以降低不透明度，也可以把混合模式设为“颜色”，让它完全不触及明亮度，而且随时可以撤销。',
        '基于原始像素以完整分辨率导出着色后的照片，格式可选JPG、PNG、WebP、AVIF或TIFF。',
      ],
      flowSteps: [
        {
          title: '拖入照片',
          description: '编辑器会打开“照片滤镜”面板，“加温”已按25%的浓度作为图层应用。',
        },
        {
          title: '选择颜色',
          description: '选择“加温”、“冷却”、“棕褐色”、“红”、“绿”或“蓝”，或者输入自定义十六进制颜色，做出品牌色调。',
        },
        {
          title: '设置浓度',
          description: '拖动“浓度”，直到色调强度合适；只有当你希望滤镜像真正的玻璃滤镜那样让画面变暗时，才关闭“保持明度”。',
        },
        {
          title: '导出',
          description: '选择格式和质量；服务器会在原图上渲染着色效果，并在文件名后加上(retouched)。',
        },
      ],
      advancedDetails: [
        '每个通道的公式为lerp(c, c x f, Density / 100)，其中c是sRGB下0..1范围内的像素值，f是同一尺度下的滤镜颜色；“加温”#ec8a00即f = (0.9255, 0.5412, 0)。由于滤镜做的是乘法，它只能降低通道值；滤镜值为0的通道（例如“加温”下的蓝通道）会被精确缩放为1 - Density / 100。',
        '开启“保持明度”时，编辑器会分别计算原像素与着色后像素的BT.709亮度L = 0.2126 R + 0.7152 G + 0.0722 B，用两者之比乘以着色后的像素，再截断到0..1。中灰0.5在“加温”、“浓度”25下，缩放前变为(0.4907, 0.4427, 0.375)，亮度为0.448；比值1.116把它提升到(0.5477, 0.4941, 0.4185)，折合色阶值为(140, 126, 107)。',
        '截断会限制白色附近的明度保持：纯白在“加温”25%浓度下，红通道需要超过1才能保住亮度，因此被截断，导出为(255, 252, 213)，比原图略暗。所以即使开启该选项，高浓度下的高光仍会损失一点亮度。',
        '浓度100%并开启“保持明度”时，滤镜是向滤镜颜色的纯色度偏移，而不是平涂填充：像素保留原有亮度，因此100的“棕褐色”作用于中灰会得到(172, 122, 51)，仍然是中间调。',
        '你调整时看到的预览由WebGL2在你的GPU上基于1920 px的照片副本绘制；下载的文件则由我们的服务器基于原图，用同样的乘法、混合和亮度缩放渲染，误差在颜色处理阶段的文档容差之内：在255级中，平均误差不超过1，最大误差不超过4级。',
      ],
      whyItMatters: [
        '相乘式着色就像光线穿过有色玻璃，高光和阴影会按各自的亮度成比例地染上颜色，而不是被一层颜色盖住。',
        '“保持明度”把颜色和曝光拆成两个问题，所以你可以让画面变暖，而不必事后再去提亮。',
        '单个着色图层就能统一一组在不同光线下拍摄的照片，这也是让一个图集或信息流看起来像同一系列的常用做法。',
      ],
      useCases: [
        {
          title: '为偏冷的画面加温',
          description: '阴天和背阴处会让照片偏蓝；20%到35%的“加温”能找回阳光的颜色，而不改变曝光。',
        },
        {
          title: '棕褐色老照片',
          description: '先加“黑白”图层，再加50%到70%的“棕褐色”并开启“保持明度”，就是经典的棕色老照片。',
        },
        {
          title: '品牌色罩染',
          description: '把品牌的十六进制颜色值填入自定义颜色，并把浓度保持在较低水平，让同一页面上的产品图带有统一的色调。',
        },
        {
          title: '为夜景降温',
          description: '30%到40%的“冷却”让夜晚的街景偏蓝，而钠灯仍保留相对的暖色。',
        },
      ],
      workedExamples: [
        {
          title: '为背阴处的人像加温：在12 MP的HEIC上使用浓度25的“加温”',
          body: '一张来自手机的4032 x 3024 HEIC（12.2 MP），需要登录账号，服务器才能为预览解码。使用“加温”#ec8a00、“浓度”25并开启“保持明度”，中灰(128, 128, 128)导出为(140, 126, 107)：缩放前蓝通道降到0.5 x 0.75 = 0.375，亮度比1.116把其他通道提起来，结果的亮度仍为0.5。肤色像素(217, 158, 128)变为(235, 155, 106)；一块天空(140, 191, 242)变为(155, 191, 205)。关闭“保持明度”后，这三个像素分别导出为(125, 113, 96)、(213, 140, 96)和(138, 169, 182)，每个都更暗。以质量92导出为JPG，文件约5.5 MB，计为一次常规任务。',
        },
        {
          title: '棕褐色老照片：在45 MP扫描件上先“黑白”再“棕褐色”（浓度50）',
          body: '一张8256 x 5504的TIFF扫描件（45 MP，136 MB），需要账号才能打开，导出超过12 MP还需要Premium或Pro套餐。默认权重的“黑白”图层之上，是一个设为“棕褐色”#ac7a33、“浓度”50并开启“保持明度”的“照片滤镜”。中灰128变为(142, 126, 102)：缩放前它是(0.4186, 0.3696, 0.3)，亮度0.375，比值1.333把亮度拉回0.5。白色255在“浓度”60下导出为(255, 250, 189)，红通道被截断。不开启“保持明度”时，中灰会变成(107, 94, 77)，照片明显更暗。把“最大尺寸”设为64 MP导出时，文件就是完整的45 MP；导出为质量92的JPG约20 MB，按每MP 0.3 MB估算，导出为WebP约13.6 MB。',
        },
      ],
      whenNotToUse: '照片滤镜会添加色偏，却不能去除色偏：乘以一种颜色，无法恢复被光线夺走的通道。去除色偏请用白平衡页面，它在线性光下用色温和色调这一对滑块完成。如果想让阴影是一种颜色、高光是另一种颜色，分离色调为两端各提供一个滑块，外加一个在两者之间调节的平衡滑块。如果要依照参考文件还原一整套调色，“LUT”面板中的.cube LUT只用一个图层就能重现。照片如果同时欠曝，应先修正曝光再着色，因为亮度缩放会保留现有的亮度。',
      whyMediaManipulator: [
        'Aperture把着色作为图层应用，带浓度、明度保持、蒙版和混合模式，远不止一个一键棕褐色按钮，而且仍然只需一个浏览器标签页。',
        '“自定义颜色”字段接受任意十六进制颜色值，因此着色可以匹配品牌色或参考图片，而不局限于六种固定效果。',
        '着色、加蒙版和撤销都不收费；完整尺寸导出计为一次常规任务，每日额度见价格页面。',
      ],
      privacyNote: '照片滤镜直接在你的浏览器中、基于你拖入的照片计算，在你导出之前，着色结果不会发送到任何服务器。未登录时，项目保存在此浏览器的IndexedDB中；导出则按一般访客任务处理，由我们自己的服务器渲染。登录后，原图、1920 px预览和缩略图会随项目按你的保留设置保存，并在删除项目或账号时一并删除。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。任何第三方都不会收到该文件。',
      faq: [
        {
          question: '着色和调整白平衡有什么区别？',
          answer: '白平衡在线性光下工作，沿蓝—黄和绿—洋红两条轴移动中间调，用来校正拍摄时的光线。照片滤镜则在伽马空间中按一定浓度乘以任意颜色，是一种创意性的罩色，而不是校正。修正色偏用白平衡，添加色偏用滤镜。',
        },
        {
          question: '为什么关闭“保持明度”后照片会变暗？',
          answer: '滤镜把每个通道乘以滤镜颜色，而每个滤镜值都不超过1，所以不重新缩放的话，着色后的像素只会同样亮或更暗。“加温”的蓝色值为0，因此在满浓度下蓝通道会被完全去掉。',
        },
        {
          question: '怎样制作棕褐色照片？',
          answer: '先添加“黑白”图层，再添加“照片滤镜”，选择“棕褐色”按钮，浓度设为50%到70%，并开启“保持明度”。中灰128在50%时变为(142, 126, 102)；在100%时变为(172, 122, 51)。',
        },
        {
          question: '可以只为天空或只为阴影着色吗？',
          answer: '可以。给“照片滤镜”图层加一个蒙版：天空用从顶部开始的“线性渐变”，阴影用0到约0.3的“明亮度范围”。之后着色会按每个像素的蒙版值混合。',
        },
        {
          question: '复古效果该用什么十六进制颜色？',
          answer: '“棕褐色”按钮是#ac7a33。更暖、更浅的#d9a66b在30%到40%时像一张褪色的老照片；冷调复古则是在“风格”面板的“褪色”风格之上叠加15%的“冷却”#0a5dc8。',
        },
        {
          question: '着色会改变透明PNG吗？',
          answer: '只改变颜色通道。任何调整都不会触碰Alpha通道，因此产品抠图会保留透明背景，着色只出现在可见像素上。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '照片滤镜对每个像素只做三次乘法和一次混合；45 MP的导出几秒钟就能渲染完，时间主要花在编码上。',
          'TIFF输出保持每通道8位；着色在编码之前应用，因此TIFF是渲染后的结果，而不是原图加一个图层。',
        ],
      },
      related: [
        {
          label: '黑白照片',
          to: '/tools/black-and-white-photo',
          description: '放在棕褐色滤镜下方的黑白转换。',
        },
        {
          label: '分离色调',
          to: '/tools/split-toning',
          description: '同时使用两种色相，一种给阴影，一种给高光。',
        },
        {
          label: '白平衡',
          to: '/tools/white-balance-photo',
          description: '在线性光下校正色偏，而不是添加色偏。',
        },
        {
          label: '色彩平衡',
          to: '/tools/color-balance-photo',
          description: '在阴影、中间调和高光中分别推动红、绿、蓝。',
        },
        {
          label: '应用LUT',
          to: '/tools/apply-lut-to-photo',
          description: '载入.cube文件，用一个图层完成整套调色。',
        },
      ],
      embed: {
        title: '为照片着色',
        description: '拖入照片，即可在“照片滤镜”面板上打开Aperture，“加温”已设为25%；可以改选其他颜色或自定义十六进制颜色，设置浓度后导出。',
      },
    },
    'color-balance-photo': {
      name: '色彩平衡',
      h1: '在线调整照片色彩平衡',
      tagline: '在阴影、中间调和高光中分别推动红、绿、蓝，以去除色偏或打造风格，并保持明度不变。',
      metaTitle: '在线照片色彩平衡：修正色偏 | Media Manipulator',
      metaDescription: '九个滑块，即阴影、中间调和高光各自的红、绿、蓝，并可保持明度。修正偏蓝或偏橙的色偏，或为照片调色，然后以完整尺寸导出。',
      ogTitle: '在线调整照片色彩平衡 | Media Manipulator',
      ogDescription: '阴影、中间调和高光各有红、绿、蓝滑块。按亮度加权，保持明度，在你的GPU上预览，基于原图导出。',
      intro: '本页会打开Media Manipulator的照片编辑器Aperture，并直接显示“色彩平衡”面板。“色彩平衡”是一个在伽马空间中工作的调整图层，共有三组、每组三个滑块：“阴影”、“中间调”和“高光”各有“红”、“绿”、“蓝”，范围都是-100到100。对每个像素，编辑器根据它的亮度算出它属于各个影调区间的程度，把三组加权偏移按0.3的增益加到每个通道上；开启“保持明度”时，还会重新缩放像素，使其亮度恢复原值。这样你就能把背阴处拍摄的照片阴影里的蓝色去掉，或者给日落的高光加一点暖意，而不改变曝光。当色偏在不同影调中分布不均、单一的白平衡校正无法顾及时，它就是合适的工具。',
      whatItDoes: [
        '九个滑块，即“阴影”、“中间调”和“高光”各自的“红”、“绿”、“蓝”，范围为-100到100，外加一个默认开启的“保持明度”开关。',
        '阴影和高光的权重来自BT.709亮度，中间调权重来自HSL明度，因此每个像素得到的是三组的混合，而不是按某个阈值硬性一刀切。',
        '满权重时，一个通道上100的偏移会使它移动0.3，即255级中的77级，所以这些滑块既精细到足以校正几级的色偏，又强到足以做出青橙色调。',
        '“保持明度”会在偏移之后把每个像素缩放回原始亮度，于是颜色在变，直方图却保持不动；关闭它，滑块也会让画面变亮或变暗。',
        '这个图层和其他图层一样支持蒙版、不透明度和混合模式，导出时会用同样的权重以完整分辨率渲染原图。',
      ],
      flowSteps: [
        {
          title: '拖入照片',
          description: '支持JPG、PNG、WebP、GIF、HEIC、AVIF或TIFF。编辑器会打开“色彩平衡”面板，九个滑块都为0。',
        },
        {
          title: '找出色偏',
          description: '按住反斜杠键与原图对比，并查看RGB直方图：偏蓝时，蓝通道会位于红、绿通道的右侧。',
        },
        {
          title: '调整各影调区间',
          description: '在色偏所在的区间调低“蓝”：背阴通常在“阴影”，混合光通常在“中间调”；如果画面需要暖一些，再加一点“红”。',
        },
        {
          title: '导出',
          description: '选择格式和质量；服务器会在原图上渲染校正效果，并在文件名后加上(retouched)。',
        },
      ],
      advancedDetails: [
        '阴影权重为1 - smoothstep(0, 0.5, L)，高光权重为smoothstep(0.5, 1, L)，其中L是BT.709亮度0.2126 R + 0.7152 G + 0.0722 B。亮度为0.122的像素，阴影权重为0.851，高光权重为零；亮度为0.897的像素，高光权重为0.889，阴影权重为零；亮度为0.5时两者都是0。',
        '中间调权重就是Darkroom的色彩平衡权重：设l为HSL明度(max + min) / 2，权重为clamp((l - 0.333) x 4 + 0.5) x clamp((1 - l - 0.333) x 4 + 0.5) x 0.7，在l = 0.5时达到峰值0.7，在l低于约0.21或高于约0.79时降为0。三个权重之和并不强制为一；中灰从“中间调”得到0.7，从另外两组什么也得不到。',
        '每个通道的偏移量这样计算：阴影权重乘以“阴影”滑块值，加上中间调权重乘以“中间调”滑块值，再加上高光权重乘以“高光”滑块值，三者之和乘以0.3再除以100；所得结果加到通道上，并截断到0..1。中灰0.5上的“中间调”红+20为0.3 x 0.7 x 0.2 = 0.042，把红通道提到0.542，即色阶值138。',
        '开启“保持明度”时，偏移后的像素会乘以原始亮度与偏移后亮度之比，再截断。于是同样是中灰上的“中间调”红+20，导出为(136, 125, 125)：红色升高，绿色和蓝色降低，亮度精确保持在0.5。',
        '“色彩平衡”和“白平衡”是不同的运算：“白平衡”在线性光下沿固定的色温和色调两条轴移动中间调，而这个图层用九个自由滑块处理伽马编码后的值。场景中有混合光时，可以把两者叠加使用。',
        '屏幕上的预览由WebGL2在你的GPU上基于1920 px副本渲染；导出文件则由我们的服务器基于原图，用同样的权重、增益和亮度缩放渲染，两者的差异在文档规定的容差之内：8位下平均误差不超过1，最大误差不超过4级。',
      ],
      whyItMatters: [
        '色偏很少是均匀的：背阴处的阴影发蓝，受阳光照射的高光却是中性的，只有按区间校正才能修好一处而不损伤另一处。',
        '明度保持意味着修颜色不会变成曝光问题，所以你可以在影调定好之后再调色，直方图不会跟着移动。',
        '在阴影和高光中做相反方向的偏移，是大多数胶片和电影风格的基础，九个滑块可以直接表达这种做法。',
      ],
      useCases: [
        {
          title: '去除背阴处的偏蓝',
          description: '“阴影”蓝-15，“中间调”蓝-20、红+5，“高光”蓝-10，就能让在开阔背阴处拍的人像回到中性。',
        },
        {
          title: '去除钨丝灯的偏橙',
          description: '“中间调”红-15、蓝+10，再在“阴影”中做一个幅度更小的同类调整，室内场景就能恢复中性。',
        },
        {
          title: '青橙色调',
          description: '“阴影”红-10、蓝+15，“高光”红+15、绿+5、蓝-10，“中间调”保持0，就能得到电影里那种肤色与背景分离的效果。',
        },
        {
          title: '匹配两张照片',
          description: '读取两张照片的直方图，调整其中一张的各个区间，直到它的通道峰值与另一张对齐。',
        },
      ],
      workedExamples: [
        {
          title: '开阔背阴处的人像：在24 MP的JPEG上从三个区间去掉蓝色',
          body: '一张6000 x 4000的JPEG（24 MP，11 MB），在建筑物的阴影里拍摄。设置：“阴影”蓝-15，“中间调”红+5、蓝-20，“高光”蓝-10，开启“保持明度”。画面中的灰卡读数为(115, 122, 143)，亮度0.479，阴影权重0.005，中间调权重0.7，高光权重0：红色增加0.3 x 0.7 x 0.05 = 0.0105，蓝色减少0.3 x (0.005 x 0.15 + 0.7 x 0.20) = 0.0422，经过亮度缩放后，灰卡导出为(118, 123, 132)，几乎是中性色。一件(219, 230, 247)的白衬衫，亮度0.897，处于高光区间，权重0.889，于是蓝色降低0.3 x 0.889 x 0.1 = 0.0267，导出为(220, 230, 241)。一件(26, 31, 51)的深色外套，亮度0.122，以0.851的权重受“阴影”滑块影响，蓝色降低0.0383，导出为(26, 31, 42)。导出24 MP需要Premium或Pro；以JPG质量92导出约10.8 MB。',
        },
        {
          title: '灰卡上的“中间调”红+20，开启与关闭“保持明度”，6 MP',
          body: '一张3000 x 2000的JPEG（6 MP，2.4 MB），其中有一块(128, 128, 128)的中灰，亮度0.5，HSL明度0.5，因此中间调权重是峰值0.7，阴影和高光权重都是0。“中间调”红+20给红通道加上0.3 x 0.7 x 0.2 = 0.042。关闭“保持明度”时，灰卡导出为(138, 128, 128)，亮度0.509，略亮一点。开启后，像素被乘以0.5 / 0.509 = 0.982，导出为(136, 125, 125)，亮度正好0.5。把同样的+20放到“阴影”或“高光”中，对这个像素毫无作用，因为在亮度0.5处这两个权重都是0。6 MP的导出在免费账号的上限之内；以质量92导出为JPG约2.7 MB，导出为WebP约1.8 MB。',
        },
      ],
      whenNotToUse: '如果整张照片均匀地偏蓝或偏橙，白平衡页面用两个滑块在线性光下就能校正，更快也更准确；只有当阴影和高光的色偏不同时，才需要用色彩平衡。如果目的是给阴影一种创意色、给高光另一种，分离色调为两端各提供色相和饱和度，外加一个平衡滑块，比九个滑块更简单。随位置而非亮度变化的色偏，例如房间一侧的台灯，需要单独加蒙版的图层，或者给这个图层加渐变蒙版。另外，在0或255处溢出的通道无法通过平衡恢复。',
      whyMediaManipulator: [
        'Aperture提供九个按亮度加权的滑块，带明度保持和实时RGB直方图，和桌面编辑器的控制方式相同，却只是浏览器中的一个图层。',
        '“色彩平衡”可以叠在“白平衡”、“曲线”和“色阶”之下或之上，因此混合光场景可以在同一个项目里同时做线性光校正和伽马空间调色。',
        '调整和预览都不收费；完整分辨率导出计为一次常规任务，每日额度见价格页面。',
      ],
      privacyNote: '色彩平衡在你的浏览器中、基于你拖入的照片计算，校正过程本身从不离开你的电脑。未登录时，项目保存在此浏览器的IndexedDB中，只有在你导出时才会上传，作为一般访客任务由我们自己的服务器渲染。登录后，原图、1920 px预览和缩略图会随项目按你的保留设置保存，并在删除项目或账号时一并删除。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。我们不会把文件交给任何第三方。',
      faq: [
        {
          question: '修正色偏该用色彩平衡还是白平衡？',
          answer: '如果整个画面都偏向同一个方向，先用“白平衡”，它用两个滑块在线性光下校正。如果阴影和高光的色偏不同，或者白平衡已经修好了中间调而阴影仍然偏蓝，就用“色彩平衡”。',
        },
        {
          question: '这里的阴影、中间调和高光具体怎么界定？',
          answer: '阴影权重沿smoothstep曲线从黑色处的1降到亮度0.5处的0；高光权重从0.5处的0升到白色处的1；中间调权重在明度0.5处达到峰值0.7，在0.21和0.79附近降为0。每个像素都是混合的结果，所以各区间之间没有硬边界。',
        },
        {
          question: '滑块值20会带来多大的变化？',
          answer: '在所属区间满权重时，20会让通道移动0.3 x 0.2 = 0.06，约15级。在“中间调”中，峰值权重是0.7，同样的20只带来0.042，约11级，之后明度缩放还会把这个变化分摊到三个通道上。',
        },
        {
          question: '为什么降低“蓝”也会让红和绿略微升高？',
          answer: '这是“保持明度”在起作用。降低蓝色会让亮度下降，于是像素被重新放大，直到亮度与原图一致，而三个通道共用同一个缩放比例。关闭该选项就能看到原始的偏移。',
        },
        {
          question: '能把校正限制在画面的某一部分吗？',
          answer: '给图层加一个蒙版：天空用“线性渐变”，想进一步收窄影调区间就用“明亮度范围”，也可以用“画笔”。蒙版值决定在原像素和校正后的像素之间如何混合。',
        },
        {
          question: '这和Darkroom里的“色彩平衡”一样吗？',
          answer: '中间调权重函数与我们的视频编辑器Darkroom共用，因此中间调偏移在静态照片和视频帧上效果一致。照片图层另外增加了阴影和高光区间，以及明度选项。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '色彩平衡是一个逐像素的处理阶段，只有三个权重和一次缩放；导出时间取决于编码器，24 MP的JPG只需几秒钟。',
          '导出时可以移除或保留元数据；无论哪种，相机原有的白平衡标签都不会改变，因为校正的是像素，而不是标签。',
        ],
      },
      related: [
        {
          label: '白平衡',
          to: '/tools/white-balance-photo',
          description: '在线性光下用色温和色调处理均匀的色偏。',
        },
        {
          label: '分离色调',
          to: '/tools/split-toning',
          description: '为阴影和高光各设一组色相和饱和度，代替九个通道滑块。',
        },
        {
          label: '曲线',
          to: '/tools/photo-curves',
          description: '色偏的变化方式三个区间跟不上时，用单通道曲线。',
        },
        {
          label: '色阶',
          to: '/tools/photo-levels',
          description: '在平衡中间调之前，先按通道设置黑场和白场。',
        },
        {
          label: '为照片着色',
          to: '/tools/tint-photo',
          description: '按浓度添加单一颜色的罩染，而不是平衡三个通道。',
        },
        {
          label: '照片编辑器教程',
          to: '/tutorials/aperture',
          description: '了解编辑器中的图层、蒙版和风格如何配合使用。',
        },
      ],
      embed: {
        title: '调整照片色彩平衡',
        description: '拖入照片，即可在“色彩平衡”面板上打开Aperture：阴影、中间调和高光中的红、绿、蓝共九个滑块，并保持明度。',
      },
    },
    'split-toning': {
      name: '分离色调',
      h1: '在线分离色调',
      tagline: '把一种色相推入阴影，另一种推入高光，再在两者之间滑动平衡点。',
      metaTitle: '在线分离色调：分别为阴影和高光上色',
      metaDescription: '在浏览器中用两种不同的色相为阴影和高光着色：色相、饱和度和平衡滑块，实时前后对比，完整分辨率导出。',
      ogTitle: '在线分离色调',
      ogDescription: '让照片的暗部呈现一种颜色，亮部呈现另一种颜色，再用平衡滑块决定两者在哪里相接。非破坏性编辑，以完整尺寸导出。',
      intro: '分离色调给照片的暗部加一种色偏，给亮部加另一种色偏，青橙色调、高光偏暖的胶片风格以及蓝晒风格的单色照片都是这样做出来的。在Aperture中，它是图层堆栈里一个在伽马空间中工作的颜色处理阶段，位于曝光、影调和白平衡之后：每个像素的BT.709亮度决定它分别接受多少阴影色相和多少高光色相，“平衡”滑块则移动一种权重淡出、另一种权重淡入的那个点。这项调整只是最多64个图层中的一个，因此你可以降低它的不透明度，用蒙版限定范围，或者把混合模式切换为“颜色”，让画面的明亮度完全不受影响。',
      whatItDoes: [
        '添加一个“分离色调”图层：“阴影”有“色相”（0-360）和“饱和度”（0-100）滑块，“高光”有另一对同样的滑块，另外还有范围为-100到100的“平衡”滑块。',
        '按亮度为每个像素加权：暗像素接受阴影色，亮像素接受高光色，分界点附近的中灰则保持原样。',
        '按设计把最大偏移控制在适度范围内，饱和度为满值时增益为0.25，因此即便是极端设置也只是着色，而不会重新上色。',
        '在预览中实时显示结果，可以用前后分屏对比，也可以按住反斜杠键查看原图，每一次滑块改动都会记录在历史记录列表中。',
        '由服务器基于原始像素导出调色后的照片，格式可选JPG、PNG、WebP、AVIF或TIFF，文件名带有retouched后缀。',
      ],
      flowSteps: [
        {
          title: '拖入照片',
          description: '编辑器会打开并直接显示“分离色调”面板，图片在浏览器中解码。',
        },
        {
          title: '选择两种色相',
          description: '设置“阴影”色相和“高光”色相，然后逐个提高“饱和度”滑块，直到色调清晰可见。',
        },
        {
          title: '移动平衡点',
          description: '把“平衡”往负值拖，让高光色占据更多中间调；往正值拖，让阴影色向上延伸得更高。',
        },
        {
          title: '导出',
          description: '选择格式和质量；服务器会以完整分辨率渲染原图，随后开始下载。',
        },
      ],
      advancedDetails: [
        '每个像素的亮度L为基于sRGB编码值计算的0.2126 R + 0.7152 G + 0.0722 B。分界点为e = 0.5 + balance / 100 x 0.25，因此“平衡”-100把分界点放在0.25，“平衡”+100把它放在0.75。阴影权重为1 - smoothstep(0, e, L)，高光权重为smoothstep(e, 1, L)，其中smoothstep就是常见的t x t x (3 - 2t)过渡曲线。',
        '每种色相都通过标准的色相转RGB方式变为一个完全饱和的颜色（色相220得到红0、绿0.333、蓝1；色相40得到1、0.667、0）。然后，该图层对两端分别给每个通道加上0.25 x (saturation / 100) x weight x (hueColor - 0.5)，并截断到0..1，因此每一端最多让一个通道移动0.125（255级中约32级），而且只在权重为1的地方才会如此。',
        '由于偏移量是hueColor减去0.5，一种色调总会在推高某些通道的同时压低另一些通道：蓝色阴影色调在提高蓝色的同时，会略微降低红色和绿色，所以着色后的阴影看起来带有颜色，却不会变脏或变亮。',
        '“平衡”为0时，亮度为0.5的像素两种权重都是0，因此无论饱和度多高，真正的中灰都不会改变；两种色调在分界点处相接而不重叠，只通过分界点两侧的平滑过渡相互交叠。',
        '调整色调时，预览由你的GPU（WebGL2）基于1920 px副本绘制；导出文件则由我们的服务器基于原图，用同样的分离色调公式以完整分辨率渲染。预览与导出的差异在文档规定的小容差之内：颜色处理阶段最多只差几个8位色阶，颗粒则完全一致。',
      ],
      whyItMatters: [
        '单一的全局着色会把一切推向同一个方向，而分离色调让阴影和高光互补，这正是调色后的照片有层次感、而不只是偏色的原因。',
        '胶片冲印、交叉冲印的反转片和大多数电影风格，本质上都是双色相调色；用两个色相滑块和一个平衡滑块重现它们，比绘制蒙版快得多。',
        '以带不透明度和混合模式的图层方式运行，意味着几个月后仍可以把一套浓重的调色按口味调淡，而不必从头再修一遍。',
      ],
      useCases: [
        {
          title: '青橙色调人像',
          description: '阴影色相200、“饱和度”50，高光色相40、“饱和度”30，肤色保持温暖，背景则变冷。',
        },
        {
          title: '为黑白照片加上暖调胶片感',
          description: '先添加“黑白”图层，再把阴影调向棕色、高光调向奶油色，就能得到影调分明的棕褐色老照片。',
        },
        {
          title: '冷调夜景',
          description: '蓝色阴影配合+30的“平衡”，把冷色推高到中间调，而路灯仍保留一点淡淡的琥珀色高光。',
        },
        {
          title: '统一一组照片',
          description: '把这套色调保存为一种风格，应用到一组照片的每一张上，让图集或产品网格中的颜色保持一致。',
        },
      ],
      workedExamples: [
        {
          title: '24 MP人像：蓝色阴影、琥珀色高光',
          body: '一张6000 x 4000的JPEG（24 MP，9.6 MB）。阴影：“色相”220，“饱和度”40。高光：“色相”40，“饱和度”30。“平衡”为0，所以分界点位于亮度0.5。0.2的阴影灰阴影权重为0.648，变为红0.1676、绿0.1892、蓝0.2324，换算成8位即(43, 48, 59)，而不是(51, 51, 51)。0.85的高光灰高光权重为0.784，变为(224, 219, 209)，而不是(217, 217, 217)。0.5的灰保持(128, 128, 128)。以质量92导出为JPG，文件约10.8 MB，要导出完整的24 MP需要Premium或Pro套餐；访客导出会缩小到12 MP，约5.4 MB。计为一次常规任务。',
        },
        {
          title: '调高平衡点的青橙色调',
          body: '一张4000 x 3000的手机JPEG（12 MP，4.1 MB）。阴影：“色相”200，“饱和度”60。高光：“色相”50，“饱和度”50。“平衡”+20把分界点移到0.55。此时0.2的灰阴影权重为0.6995，变为(38, 55, 64)；0.5的灰获得0.0233的阴影权重，偏移不到一级，变为(127, 128, 128)；0.85的灰高光权重为0.7407，变为(229, 225, 205)。一个(0.3, 0.25, 0.2)的棕色阴影像素落在(66, 67, 61)，明显变冷。以质量85导出为WebP约3.6 MB，在访客12 MP的上限内可以完整尺寸导出。',
        },
      ],
      whenNotToUse: '如果照片只是有一个你想去除而不是添加的色偏，就不要用分离色调：用“色温”和“色调”滑块修正白平衡，或者在“色彩平衡”面板中开启保持明度，都能校正色偏，而不会凭空加入第二种色相。如果你需要在整张照片上以选定的强度加一种特定颜色，着色页面上的“照片滤镜”更简单；如果你想要的风格已经是一个.cube文件，LUT页面会精确应用它，而不是用两种色相去近似。',
      whyMediaManipulator: [
        'Aperture的分离色调是一个公开了常数的成文公式，因此同样的滑块在浏览器预览、导出服务器和手机应用中得到相同的像素。',
        '调整色相时，照片的任何信息都不会离开你的浏览器；只有导出、主体蒙版或修复才会发送文件，访客导出就是一次常规任务，按访客的保留期限处理。',
        '分离色调这一处理阶段与蒙版、曲线和色阶位于同一个堆栈中，因此双色相调色可以只限于天空或某个明亮度范围，而不必作用于整个画面。',
      ],
      privacyNote: '分离色调在你的浏览器中基于解码后的照片计算；只有在你导出、选择主体或修复时，文件才会发送到我们的服务器，届时服务器会用同样的阴影和高光权重渲染原图。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。登录后，原图及其1920 px预览按你的保留设置保存，并在删除项目时一并删除。',
      faq: [
        {
          question: '“平衡”滑块到底移动的是什么？',
          answer: '它移动的是一个亮度值：在这一点上阴影权重已降到零，高光权重开始上升。“平衡”为0时，这个点位于亮度0.5；“平衡”每变化100，它就移动0.25，所以+40把它移到0.6，-40移到0.4。',
        },
        {
          question: '为什么中灰像素完全不变？',
          answer: '“平衡”为0时，阴影权重为1 - smoothstep(0, 0.5, L)，高光权重为smoothstep(0.5, 1, L)。在L = 0.5处，两条过渡曲线都处在为零的一端，因此亮度恰好居中的像素不会被加上任何颜色。',
        },
        {
          question: '着色最强能到什么程度？',
          answer: '增益常数是0.25，所以“饱和度”为100时，单个通道的最大偏移是0.25 x 0.5 = 0.125，约为255级中的32级，而且只出现在权重完全为1的地方。如果需要更强的效果，可以叠加两个“分离色调”图层。',
        },
        {
          question: '分离色调会改变亮度吗？',
          answer: '会略微改变，因为经过亮度加权后，各通道的偏移量之和不为零。如果想精确保留原有的明亮度、只移动色度，把图层的混合模式设为“颜色”。',
        },
        {
          question: '可以只为阴影着色吗？',
          answer: '可以。把高光的“饱和度”保持为0，就只有阴影项起作用，此时高光的色相值会被完全忽略。',
        },
        {
          question: '黑白照片能用吗？',
          answer: '这正是它最好的用法之一。把“黑白”图层放在“分离色调”图层下方；灰度值提供亮度权重，两种色相就成了画面中仅有的颜色。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'HEIC、HEIF、TIFF和BMP需要登录账号，服务器才能生成可编辑的预览副本；其他格式在浏览器中解码。',
          '未登录和免费账号的导出上限为12 MP；Premium和Pro最高可导出120 MP。',
        ],
      },
      related: [
        {
          label: '色彩平衡',
          to: '/tools/color-balance-photo',
          description: '想按通道控制、而不是用色相时，可在阴影、中间调和高光三个区间分别调整RGB。',
        },
        {
          label: '为照片着色',
          to: '/tools/tint-photo',
          description: '以选定浓度在整张图像上叠加单一的照片滤镜颜色。',
        },
        {
          label: '黑白照片',
          to: '/tools/black-and-white-photo',
          description: '先用六个通道滑块转换为单色，再添加色调。',
        },
        {
          label: '应用LUT',
          to: '/tools/apply-lut-to-photo',
          description: '当一种风格已经保存为3D表时，载入.cube调色文件。',
        },
        {
          label: '曲线',
          to: '/tools/photo-curves',
          description: '用单通道曲线塑造对比度，与分离色调搭配使用。',
        },
        {
          label: 'Aperture教程',
          to: '/tutorials/aperture',
          description: '编辑器入门：图层、蒙版、历史记录和导出。',
        },
      ],
      embed: {
        title: '为照片分离色调',
        description: '拖入照片，即可在“分离色调”面板上打开编辑器；设置两种色相和平衡，然后以完整尺寸导出。',
      },
    },
    'apply-lut-to-photo': {
      name: '应用LUT',
      h1: '在线为照片应用LUT（.cube）',
      tagline: '将.cube 3D LUT拖放到照片上，设置强度，并以完整分辨率导出调色后的图像。',
      metaTitle: '在线为照片应用LUT：在浏览器中加载.cube文件',
      metaDescription: '加载最大尺寸为65、不超过1 MB的.cube 3D LUT，立即在照片上查看调色效果，用强度滑块混合，并以完整尺寸导出。',
      ogTitle: '在线为照片应用LUT',
      ogDescription: '在静态照片上使用.cube颜色查找表。三线性查找、强度混合、蒙版和图层，基于原始像素导出。',
      intro: 'LUT是一张查找表，把每一种输入颜色映射为一种输出颜色，大多数相机配置文件、胶片模拟和视频调色都以.cube格式分享。Aperture把.cube文件作为LUT图层载入：表格在浏览器中解析，量化为字节，作为3D纹理上传到GPU，再对1920 px预览的每个像素做三线性采样，作用于堆栈中位于它下方的曝光、曲线或颜色图层之后。“强度”滑块在原像素和查表后的像素之间混合。由于LUT文本保存在项目文档中，导出服务器读取的是同一张表，并以同样的插值方式作用于完整尺寸的原图，因此为视频素材制作的调色，用在24 MP的静态照片上也能分毫不差。',
      whatItDoes: [
        '添加一个LUT图层：拖入或选择一个.cube文件，表格解析完成后，面板会显示LUT的尺寸。',
        '支持每轴2到65个点、任意尺寸的3D LUT，文本最大1 MB，在最近的八个表项之间做三线性插值。',
        '通过范围为0到1的“强度”滑块，把查表得到的颜色与输入颜色混合，因此浓重的电影感调色也可以只用一半强度。',
        '可以与其他所有调整叠加：把曝光或白平衡放在LUT下方，让表格接收到经过标准化的图像，把曲线或颗粒放在它上方。',
        '一键移除表格并保留图层位置，载入操作和每一次强度改动都会记录在可撤销的历史记录中。',
      ],
      flowSteps: [
        {
          title: '拖入照片',
          description: '编辑器会打开LUT面板，图片在本地解码。',
        },
        {
          title: '载入.cube文件',
          description: '把LUT拖到面板上或选择它；大小检查和解析都在浏览器中进行。',
        },
        {
          title: '设置强度',
          description: '如果完整的表格效果太强，就把“强度”从1往下调；可以用前后分屏对比。',
        },
        {
          title: '导出',
          description: '选择格式、质量和尺寸；服务器会用同一张表渲染原图。',
        },
      ],
      advancedDetails: [
        '.cube文件是纯文本。LUT_3D_SIZE N一行声明网格大小，可选的TITLE、DOMAIN_MIN、DOMAIN_MAX和LUT_3D_INPUT_RANGE行会被跳过，注释行以#开头，之后是N x N x N行，每行三个浮点数，红色变化最快，其次是绿色，最后是蓝色。因此尺寸为33的LUT有35,937行，尺寸为65的有274,625行。',
        '解析器接受2到65的表头；声明LUT_1D_SIZE的文件会被拒绝，因为只支持3D表。文本上限为1 MB（1,048,576字节），而尺寸为33、数值保留六位小数的表格就已经约970 KB，所以33是能放得下的最大常见网格；尺寸为65的文件约7 MB，会在解析之前就因过大而被拒绝。',
        '每个表值都会量化为一个字节，即round(value x 255)并截断到0..255，这样表格才能作为RGB8 3D纹理上传。值0.5会变成128/255 = 0.50196；这是唯一的精度损失，而且低于8位导出的容差。',
        '查找采用三线性插值：输入颜色在每个轴上缩放到0..N-1，较低的单元格索引为floor(value)，上限为N-2，结果是在周围八个表项之间依次沿红、绿、蓝做lerp。随后输出为lerp(input, lookup, intensity)，所以“强度”0.6会带来表格偏移量的60%。',
        '调色后的预览由你的GPU（WebGL2）基于1920 px的照片副本绘制，导出文件则由我们的服务器基于原图，用同一张表和同样的三线性公式以完整分辨率渲染；两者的差异在文档规定的小容差之内，最多只差几个8位色阶，颗粒则完全一致。',
      ],
      whyItMatters: [
        'LUT是调色领域的交换格式：在视频编辑器中做好的风格、相机厂商提供的Log转显示转换，或者购买的胶片包，都可以直接用在照片上，而不必一个滑块一个滑块地重建。',
        '3D表能表达任何简单滑块组合都无法重现的颜色变换，例如只影响橙色、随色相而变的饱和度变化。',
        '强度混合和蒙版把一张固定的表变成可调的，这正是滤镜和真正修图的区别。',
      ],
      useCases: [
        {
          title: '让照片与调色后的视频一致',
          description: '把视频项目用过的同一个.cube应用到幕后花絮照片上，让缩略图和照片的调色保持一致。',
        },
        {
          title: '胶片模拟包',
          description: '载入购买或免费的胶片模拟LUT，把“强度”设为0.6，得到比完整表格更含蓄的效果。',
        },
        {
          title: '相机配置文件转换',
          description: '把厂商提供的显示LUT用在相机中性配置文件导出的平淡、低对比度照片上。',
        },
        {
          title: '客户照片风格统一',
          description: '把LUT图层保存为一种风格，批量应用到同一次拍摄的其余照片上，免费账号每次3张，Pro最多25张。',
        },
      ],
      workedExamples: [
        {
          title: '尺寸为33的暖调LUT，完整强度与0.6强度',
          body: '一张5472 x 3648的JPEG（20 MP，8.3 MB），配一个约970 KB、尺寸为33的.cube，其表格把红色乘以1.08、蓝色乘以0.92。中灰0.5查表后为红0.5412、绿0.502、蓝0.4588，即(138, 128, 117)；绿通道读数是0.502而不是0.5，因为0.5被存储为字节128。“强度”为0.6时，同一个灰落在(134, 128, 121)。肤色(0.75, 0.6, 0.45)在完整强度下变为(207, 153, 106)，在0.6时变为(201, 153, 109)。导出为PNG时，20 MP的文件约50 MB；以质量90导出为WebP约6 MB；两者都超过12 MP的上限，需要Premium或Pro。',
        },
        {
          title: '天空像素上尺寸为2的恒等LUT',
          body: '最小的有效LUT是LUT_3D_SIZE 2，共8行；按红色变化最快的顺序写入各个角点颜色（0 0 0、1 0 0、0 1 0、1 1 0、0 0 1、1 0 1、0 1 1、1 1 1），它就是一张恒等表。天空像素(0.3, 0.6, 0.9)会精确地返回(0.3, 0.6, 0.9)，因为在8个角点之间的三线性插值在每个通道上都是线性的，而角点的字节值0和255都是精确的。交换第二行和第五行，它就变成了红蓝通道互换。一张4000 x 3000的JPEG（12 MP）在访客上限之内可以完整尺寸导出，质量92时约5.4 MB，计为一次常规任务。',
        },
      ],
      whenNotToUse: '如果问题是按通道映射亮度，就不必用LUT，因为“曲线”面板最多用16个可编辑的点就能做到，还不用管理文件；如果你只想为阴影和高光着色，分离色调页面用两个色相滑块就能完成。把Log转显示的LUT用在本来就面向显示的JPEG上会毁掉对比度；这时应改用“基本”面板。另外，如果你的表格大于1 MB或是1D LUT，必须先在别处转换。',
      whyMediaManipulator: [
        'Aperture复用了Darkroom处理视频时所用的同一个.cube解析器和三线性查找，因此在Media Manipulator里为视频素材匹配好的调色，用到这里的照片上会得到相同的颜色。',
        'LUT在带蒙版的非破坏性堆栈中应用，因此电影感的调色表可以只作用于背景，同时用主体蒙版让肤色不受影响。',
        '表格文本随项目文档保存，这意味着已保存的项目重新打开时调色完好无损，导出也从不依赖于该文件是否还在你的磁盘上。',
      ],
      privacyNote: '.cube文本在你的浏览器中解析，并保存在项目文档中；照片本身只有在你导出、选择主体或修复时才会上传，服务器会把同一张表应用到原图上。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。登录后的项目会按你的保留设置保存原图及其1920 px预览，直到项目或账号被删除。',
      faq: [
        {
          question: '什么是.cube文件？',
          answer: '一种Adobe Cube格式的文本文件：先是一行LUT_3D_SIZE，给出网格大小N，之后是N的立方行，每行三个介于0和1之间的输出值，按红色变化最快的顺序排列。每一行是网格上某个输入颜色对应的输出颜色；网格点之间的颜色通过插值得出。',
        },
        {
          question: '支持哪些LUT尺寸和文件大小？',
          answer: 'LUT_3D_SIZE为2到65，文件不超过1 MB。实际上，1 MB的上限意味着尺寸为33的LUT（35,937行）是能载入的最大常见网格；尺寸17（约130 KB）和尺寸25都能轻松载入。',
        },
        {
          question: '为什么1D LUT无法载入？',
          answer: '只支持3D表。声明了LUT_1D_SIZE的文件会被拒绝，并显示文件无效的提示；请在制作它的工具中把它转换为3D LUT，或者用“曲线”面板重建这个逐通道变换，它能完成1D表的同样工作。',
        },
        {
          question: 'LUT需要Log图像还是普通图像？',
          answer: '这取决于LUT本身。相机的Log转显示表格需要平淡的Log素材，把它用在普通JPEG上会压垮对比度。为显示图像制作的风格类表格才适合普通照片。“强度”滑块无法挽救输入色彩空间不对的LUT。',
        },
        {
          question: '颜色是插值得出的，还是对齐到网格上？',
          answer: '是插值得出的。输出的每个通道都是输入颜色周围八个网格表项的三线性混合，因此即使是尺寸17的表格，也能产生平滑的渐变，而不会出现明显的色阶断层。',
        },
        {
          question: 'LUT会发送给第三方吗？',
          answer: '不会。表格保存在项目文档中，在浏览器中解析，并由我们自己的导出服务器读取；无论是该文件还是照片，都不会与任何其他人共享。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '.cube表格的每个表项都量化为8位并做三线性采样；1D LUT和大于1 MB的表格会被拒绝。',
          'HEIC、HEIF、TIFF和BMP照片需要账号才能生成可编辑的预览；导出超过12 MP需要Premium或Pro。',
        ],
      },
      related: [
        {
          label: '曲线',
          to: '/tools/photo-curves',
          description: '单通道曲线最多16个点，能完成1D LUT所做的一切。',
        },
        {
          label: '分离色调',
          to: '/tools/split-toning',
          description: '手头没有表格时，用滑块打造双色相调色。',
        },
        {
          label: '更改物体颜色',
          to: '/tools/change-image-color',
          description: '按颜色范围分别调整色相、饱和度和明度，做针对性的偏移。',
        },
        {
          label: '修正曝光',
          to: '/tools/fix-photo-exposure',
          description: '在LUT下方把曝光标准化，让表格接收到它预期的亮度。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '调色完成后，为网页进一步缩小导出的文件。',
        },
      ],
      embed: {
        title: '应用.cube LUT',
        description: '拖入照片，打开LUT面板，再把.cube文件拖到面板上；设置强度后导出。',
      },
    },
    'invert-image-colors': {
      name: '反相颜色',
      h1: '在线反相图片颜色',
      tagline: '把每个像素翻转为其负片，作为可以加蒙版、混合或撤销的非破坏性图层。',
      metaTitle: '在线反相图片颜色：制作照片的负片',
      metaDescription: '在浏览器中一键将照片反相为负片。每个通道变为1减去其值；可加蒙版、叠加，并以完整分辨率导出。',
      ogTitle: '在线反相图片颜色',
      ogDescription: '用可加蒙版、可混合的反相图层，把照片变成负片，或把扫描的负片变成正片。完整尺寸导出。',
      intro: '反相会把每种颜色替换为它的对立色：黑变白，深蓝的天空变成暖橙色，扫描的胶片底片则变成可以正常观看的正片。在Aperture中，这就是“效果”面板里的“反相”项，它是位于堆栈伽马空间处理阶段的一个调整图层，用1减去sRGB编码像素的每个通道。因为它是图层而不是破坏性的滤镜，你可以给它加蒙版只作用于某个区域，把不透明度降到50%做出中途曝光式的半反相，把混合模式设为“明度”只翻转影调而保留色相，或者把它放在“色阶”和“曲线”下方，完成一次底片转换。同一个面板中还有“色调分离”、“阈值”和“灰度系数”，它们与反相搭配起来十分自然。',
      whatItDoes: [
        '从“效果”面板添加一个“反相”图层，把每个通道映射为1减去其值，让照片变成精确的负片。',
        '支持蒙版，因此可以只反相选定的区域、某个明亮度范围或某个颜色范围，其余部分保持原样。',
        '支持不透明度以及“正常”、“明度”和“颜色”三种混合模式，可以做出部分反相、只反相影调或只反相色相的效果。',
        '可以与“色阶”、“曲线”及“效果”中的其他项叠加，因此反相后的胶片扫描可以在同一个项目中完成色彩校正。',
        '基于原图以完整分辨率导出反相结果，格式可选JPG、PNG、WebP、AVIF或TIFF，元数据可保留也可移除。',
      ],
      flowSteps: [
        {
          title: '拖入照片',
          description: '编辑器会打开“效果”面板，图片在浏览器中解码。',
        },
        {
          title: '添加“反相”',
          description: '在“效果”面板中选择“反相”；预览会立即翻转为负片。',
        },
        {
          title: '细调',
          description: '可以添加蒙版、降低不透明度，或在上方叠加“色阶”和“曲线”来校正胶片扫描件。',
        },
        {
          title: '导出',
          description: '选择格式和尺寸；服务器会用同样的反相渲染原图。',
        },
      ],
      advancedDetails: [
        '公式为out = 1 - c，对红、绿、蓝分别计算，作用于0到1之间的sRGB编码值；没有亮度项，不改变伽马，也无需截断，因为输入本来就在有效范围内。换成8位来说，值v会变成255 - v。',
        '在浮点管线中反相两次会精确地回到原图，因为1 - (1 - c) = c；导出文件则在舍入误差之内一致：服务器对不超过4 MP的图像用float64渲染，超过的用float32，因此编码后两次反相的结果与原图最多相差一个8位色阶。',
        '图层不透明度低于100%时，会把输入和负片混合，所以50%的不透明度会把每个像素都拉向0.5的灰：0.2变成0.5，0.8也一样。“明度”混合保留原有的色相和色度，只采用反相后的亮度；“颜色”混合则正好相反。',
        '处理胶片扫描时顺序很重要：彩色负片的橙色片基是一种全局色偏，所以先加“反相”图层，再加“色阶”，按直方图逐通道设置输入黑场和白场，最后加“曲线”，就是一次完成、无需返工的标准转换流程。',
        '反相后的预览由你的GPU（WebGL2）基于1920 px的照片副本绘制；导出时，我们的服务器以完整分辨率对原图做同样的减法，两者的差异在文档规定的小容差之内，颜色处理阶段最多只差几个8位色阶，颗粒则完全一致。',
      ],
      whyItMatters: [
        '扫描或翻拍的彩色负片在反相之前根本无法看清；用图层来做，色偏校正和反相可以分别保持可编辑。',
        '反相后的线稿、蓝图和图表在深色背景上更容易阅读，一键负片就是制作黑底白线版本的第一步。',
        '局部反相和加蒙版的反相是一种设计手段：中途曝光式的边缘、在原样背景上反相的主体，或者只翻转影调而保留颜色。',
      ],
      useCases: [
        {
          title: '转换翻拍的胶片负片',
          description: '先反相画面，再在“色阶”中逐通道设置输入黑场和白场，去掉橙色片基，最后用一条曲线收尾。',
        },
        {
          title: '图表的深色模式版本',
          description: '把白底的图表或草图反相，放到深色幻灯片上；如果扫描件是灰色而不是黑色，再用阈值处理。',
        },
        {
          title: '中途曝光效果',
          description: '以50%的不透明度反相，或者加一个明亮度蒙版只让高光翻转，做出萨巴蒂埃效应式的风格。',
        },
        {
          title: '检查合成图的接缝',
          description: '临时加一个反相图层，粘贴边缘处的亮度不匹配会更容易看出来；导出前把它删掉。',
        },
      ],
      workedExamples: [
        {
          title: '把3000 x 2000的负片扫描件转为正片',
          body: '一张3000 x 2000的TIFF扫描件（6 MP，约18 MB），登录账号后打开。“反相”把片基像素(0.93, 0.08, 0.12)变为(0.07, 0.92, 0.88)，即(18, 235, 224)，这正是所有反相后的彩色负片都会出现的蓝青色偏。在它上方加一个“色阶”图层，在主通道上设置输入黑场0.06、输入白场0.86，会把0.3的值拉伸为0.3、0.7的值拉伸为0.8；因此，按直方图分别设置红、绿、蓝的输入黑白场，就能去除色偏。导出为PNG约15 MB；以质量92导出为JPG约2.7 MB。整个画面都在12 MP的上限之内。',
        },
        {
          title: '用半强度反相做中途曝光风格的海报',
          body: '一张4000 x 3000的JPEG（12 MP，4.5 MB）。“反相”图层不透明度为50%：0.2的值与其负片0.8混合为0.5，0.8的值与0.2混合也为0.5，整张照片都收拢到中灰附近，这就是经典的中途曝光式压平效果。在100%时，深灰(51, 51, 51)变为(204, 204, 204)。在其上方加一个“级别”为0.5的“阈值”图层：反相前亮度为0.529的天空像素变成白色，比它暗的一切都变成黑色。以质量85导出为WebP约3.6 MB，计为一次常规任务。',
        },
      ],
      whenNotToUse: '如果照片只是太暗或有色偏，反相就不是合适的工具；曝光用“基本”面板修正，色偏用白平衡或色彩平衡修正。用通道滑块做黑白转换，对影调的控制远胜于反相一张去色的图像；而对于需要边缘清晰的黑底白线图表，反相之后加一个“阈值”图层，起的作用通常比反相本身还大。',
      whyMediaManipulator: [
        'Aperture让反相保持非破坏性，提供撤销、历史记录和按住查看原图，因此一次负片转换可以在已保存的项目上分几次慢慢完善。',
        '“效果”面板与“色阶”和“曲线”位于同一个堆栈中，这正是胶片扫描转换所需要的组合，无需在不同工具之间来回折腾。',
        '反相后的导出由我们自己的服务器基于原始像素渲染，从不经过第三方服务；访客导出只消耗一次常规任务。',
      ],
      privacyNote: '反相只是在你的浏览器中对每个通道做一次减法；照片只有在你导出、选择主体或修复时才会上传，届时我们的服务器以同样的方式反相原图。访客的文件保留24小时；使用免费账号，你可以选择保留24小时到2年。登录后，原图、预览和缩略图会按你的保留设置保存，直到你删除项目。',
      faq: [
        {
          question: '反相就是制作负片吗？',
          answer: '是的。每个通道都变为1减去其值，这正是负片的含义：8位的(51, 51, 51)变为(204, 204, 204)，天空色(89, 140, 217)变为偏暖的(166, 115, 38)。',
        },
        {
          question: '反相两次能得到原图吗？',
          answer: '在预览和浮点渲染中可以精确还原，因为1 - (1 - c)就是c。导出文件经过重新编码后，与原图最多相差一个8位色阶；而有损的JPG导出还会在此基础上加入自身的压缩噪点。',
        },
        {
          question: '可以只反相照片的一部分吗？',
          answer: '给“反相”图层加一个蒙版：画笔、渐变、径向、明亮度范围、颜色范围或主体蒙版都可以，蒙版本身也可以羽化和反相。',
        },
        {
          question: '为什么反相后的负片仍然偏橙或偏蓝？',
          answer: '彩色负片有橙色片基，反相后会变成蓝色色偏。在反相图层上方加一个“色阶”图层，按直方图逐通道设置输入黑场和白场；这样就能中和片基，而不影响反相本身。',
        },
        {
          question: '“效果”面板里还有什么？',
          answer: '“色调分离”（每个通道2到255级）、“阈值”（按亮度在选定的级别处分为黑或白）和“灰度系数”（0.1到10的幂曲线）。它们都是独立的图层，可以按任意顺序与“反相”叠加。',
        },
        {
          question: '反相会改变透明度吗？',
          answer: '不会。PNG或WebP的Alpha通道不受影响；只有红、绿、蓝被翻转，因此透明背景仍然是透明的。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Alpha通道保持不变；只反相三个颜色通道。',
          'TIFF扫描件和BMP文件需要账号才能生成可编辑的预览副本；JPG和PNG扫描件在浏览器中解码。',
        ],
      },
      related: [
        {
          label: '色调分离',
          to: '/tools/posterize-image',
          description: '在同一个“效果”面板中把每个通道减少到寥寥几级。',
        },
        {
          label: '色阶',
          to: '/tools/photo-levels',
          description: '反相胶片扫描件后，逐通道设置黑场和白场。',
        },
        {
          label: '曲线',
          to: '/tools/photo-curves',
          description: '用一条对比度曲线完成负片转换。',
        },
        {
          label: '黑白照片',
          to: '/tools/black-and-white-photo',
          description: '在反相之前或之后转换为单色，得到灰度负片。',
        },
        {
          label: '移除图片中的EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '如果导出的文件要分享出去，先去掉其中的相机数据。',
        },
      ],
      embed: {
        title: '反相照片',
        description: '拖入照片，打开“效果”面板；添加“反相”即可立刻得到负片，然后导出。',
      },
    },
    'posterize-image': {
      name: '色调分离',
      h1: '在线为图片做色调分离',
      tagline: '将每个通道压缩为选定数量的色阶，得到带有明显色调层次的平面海报风格色彩。',
      metaTitle: '在线色调分离图片：每通道2到255个色阶',
      metaDescription: '在浏览器中把每个通道吸附到2至255个色阶来对照片做色调分离。实时查看色带，可与黑白叠加，并以完整尺寸导出。',
      ogTitle: '在线为图片做色调分离',
      ogDescription: '用色调分离图层把照片简化为平坦的色带。精确的色阶算法、蒙版、撤销，并以完整分辨率导出。',
      intro: '色调分离会把每个颜色通道量化为少数几个等间距的值，平滑的渐变因此变成平坦的色带，照片也开始带上丝网印刷的味道。在Aperture中，它是“效果”面板里的“色调分离”项，只有一个“色阶”滑块，范围2到255（默认4），作为伽马空间中的图层，在图层堆栈的影调和色彩阶段之后应用。色阶数就是每个通道可以取的不同值的个数：设为2时，每个通道只能取纯黑或纯白，合计八种可能的颜色；设为4时则有64种。由于它是调整图层，你可以只对蒙版区域做色调分离，用“颜色”混合模式保留原有色相，或在它下方放一个“黑白”图层，做出经典的双色调或三色调海报。',
      whatItDoes: [
        '添加一个“色调分离”图层，只有一个“色阶”滑块；2产生8种可能的颜色，4产生64种，8产生512种，各级间距相等。',
        '每个通道独立吸附到最近的允许色阶，因此同一像素的红、绿、蓝可能落在不同的级上。',
        '在1920 px代理图和直方图上即时预览色带，直方图上的尖峰会准确显示正在使用哪些色阶。',
        '支持蒙版、不透明度和混合模式，并可与“黑白”、“阈值”、“曲线”等其他图层叠加。',
        '从原始分辨率导出量化后的图片：PNG可保留精确的平坦色彩，也可导出JPG、WebP、AVIF和TIFF。',
      ],
      flowSteps: [
        {
          title: '拖入照片',
          description: '编辑器会在本地解码图片，并打开“效果”面板。',
        },
        {
          title: '添加色调分离',
          description: '选择“色调分离”并设置“色阶”滑块；3到6的海报效果最强。',
        },
        {
          title: '先塑造影调',
          description: '在“色调分离”图层下方添加“黑白”或“曲线”，决定色带边缘落在哪里。',
        },
        {
          title: '导出',
          description: 'PNG能让平坦色彩逐字节精确；高质量的JPG文件更小。',
        },
      ],
      advancedDetails: [
        '色调分离的“色阶”设为某个滑块值时，代码以n = levels - 1作为级数，并对每个通道计算floor(clamp(v, 0, 1) x n + 0.5) / n。允许的输出值为0、1/n、2/n……1，所以每个通道恰好有levels个不同的取值，黑和白都包括在内。',
        'floor前面的+ 0.5让它成为四舍五入到最近值：色阶数为4（n = 3）时，0.45映射为floor(1.85) / 3 = 0.3333，0.5映射为floor(2.0) / 3 = 0.6667，所以在输入值中，第一与第二色带的分界在0.5，第二与第三色带的分界在0.8333。',
        '色阶数为2时，是在每个通道的0.5处分别做阈值，而不是按亮度做阈值：像素(0.35, 0.55, 0.85)会变成(0, 1, 1)，即青色；而“阈值”图层使用BT.709亮度，同一像素会输出白色。色阶数为255时，对8位输入不产生任何变化。',
        '每个通道各自量化，所以灰色渐变会产生灰色色带；而彩色渐变中，凡是只有一个通道越过分界的那一级，色带的色相都会偏移。要避免这一点，可在下方添加“黑白”图层，或使用“颜色”混合模式保留原有色相。',
        '带色带的预览由你的GPU（WebGL2）基于1920 px副本绘制；导出文件由我们的服务器用同样的取整公式，从原图以完整分辨率渲染。两者的差异在一个有文档记录的小容差之内，最多几个8位色阶（颗粒完全一致）。',
      ],
      whyItMatters: [
        '色调分离是丝网印刷、孔版印刷和波普艺术风格的基础；知道色带的精确分界，你就能用曲线去安排它们，不必靠猜。',
        '把图片简化为寥寥几种平坦色彩，也是矢量描摹或制作镂空模板前的一个实用步骤。',
        '作为图层，它可以随时撤回、可以加蒙版，所以能只对背景做海报化处理，而主体保留完整的影调。',
      ],
      useCases: [
        {
          title: '波普艺术肖像',
          description: '下方放“黑白”，上方放色阶数为3的“色调分离”，再用“分离色调”为得到的两到三条色带上色。',
        },
        {
          title: '镂空模板和丝网印刷制版',
          description: '在单色图片上把色阶数设为2，可得到干净的黑白分离，每个通道都在0.5处切分。',
        },
        {
          title: '复古游戏或像素画配色',
          description: '对缩小后的照片使用4到6的色阶数，可模拟有限的调色板，同时保留原图的色相。',
        },
        {
          title: '凸显影调结构',
          description: '调整“曲线”时，临时加一个色阶数为6的图层，风景照的影调分区便一目了然；导出前把它删掉。',
        },
      ],
      workedExamples: [
        {
          title: '12 MP风景照上的四个色阶',
          body: '一张4000 x 3000的JPEG（12 MP，4.8 MB），“色调分离”的色阶数为4，即n = 3。天空像素(0.35, 0.55, 0.85)，即(89, 140, 217)，变为(0.333, 0.667, 1)，即(85, 170, 255)。0.5的中灰会向上取到0.667，因为floor(1.5 + 0.5) = 2；而0.45则向下取到0.333。阴影值0.1变为0，高光值0.9变为1。直方图上每个通道显示四个尖峰。导出为PNG时，这张平坦的图片约12到15 MB，而同尺寸的普通照片约为30 MB；导出为质量100的WebP约2 MB。消耗一次常规任务，在访客上限之内。',
        },
        {
          title: '肤色上先用六个色阶，再用两个',
          body: '一张3000 x 4000的人像（12 MP，5.1 MB）。色阶数为6（n = 5）时，肤色(0.78, 0.6, 0.5)变为(0.8, 0.6, 0.6)，即(204, 153, 153)；蓝色通道从128升到153，因为0.5 x 5 + 0.5 = 3.0，向下取整为3。把滑块改为色阶数2（n = 1）后得到(1, 1, 1)，即白色，因为每个通道都高于0.5；而阴影(0.3, 0.25, 0.2)变为(0, 0, 0)。在下方加一个采用默认通道混合的“黑白”图层后，同样在色阶数2处切分，就能得到干净的双色调镂空图。PNG导出约8 MB。',
        },
      ],
      whenNotToUse: '色调分离是一种图形效果，不是校正：如果照片里已有你想去掉的色带，它只会带来更多色带，正确的方向是降噪或轻柔的“曲线”调整。如果想按亮度抠出纯黑白效果，请使用“阈值”图层，它判断的是亮度，而不是每个通道。如果目的是减少颜色来缩小文件，压缩图片工具能在没有可见断层的情况下缩小体积；对缩略图来说，调整尺寸也比削减调色板更有效。',
      whyMediaManipulator: [
        'Aperture公开了精确的量化公式，所以你在预览中看到的色带，正是导出服务器从完整分辨率原图生成的色带。',
        '色调分离图层可以使用六种蒙版，包括由我们自己的GPU生成的主体蒙版，因此海报效果可以围绕人物展开，而不触及其脸部。',
        'PNG导出能精确保留平坦色彩，项目也保持可编辑，所以之后把4个色阶改成5个只需挪一下滑块，不必重做。',
      ],
      privacyNote: '色调分离是在你的浏览器中对解码后的照片做逐通道取整；在你导出、选择主体或修复之前，不会上传任何内容，到那时服务器会用相同的级数对原图做量化。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。登录后，原图及其1920 px预览会按你的保留期限设置保存，直到项目被删除。',
      faq: [
        {
          question: '色调分离的“色阶”数值到底是什么意思？',
          answer: '它是每个通道可以取的不同值的个数，包括0和1。色阶数为4时，每个通道可取0、0.333、0.667和1，所以一个像素可以是4 x 4 x 4 = 64种颜色之一。',
        },
        {
          question: '色带的分界落在哪里？',
          answer: '落在相邻色阶的正中间，因为取整公式是floor(v x n + 0.5) / n，其中n = levels - 1。色阶数为4时，输入分界点为0.1667、0.5和0.8333；色阶数为3时为0.25和0.75。',
        },
        {
          question: '为什么色带边缘的颜色会偏移？',
          answer: '每个通道分别取整，所以沿着渐变，红色通道可能比绿色通道先跳一级，色相会短暂改变。把“黑白”图层放在“色调分离”图层下方，或把它的混合模式设为“明度”，即可让色相保持稳定。',
        },
        {
          question: '色阶数为2的色调分离和“阈值”有什么区别？',
          answer: '色阶数为2的色调分离在0.5处切分每个通道，可输出8种颜色中的任意一种；“阈值”则把亮度与所选级别比较，只输出黑或白。',
        },
        {
          question: '255个色阶会改变什么吗？',
          answer: '对8位照片不会：n = 254时，允许的各级相隔1/254，取整后会回到同一个8位值，误差在一个色阶以内，所以实际上等于没有操作，只适合作为滑块的起点。',
        },
        {
          question: '哪种导出格式能精确保留色带？',
          answer: 'PNG，因为它是无损格式；质量较低时，JPG的压缩振铃会把生硬的色带边缘抹平。在乎文件大小时，质量100的WebP或高质量的AVIF是不错的折中。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '色调分离后的平坦色彩用PNG压缩效果很好；照片按每MP 2.5 MB的估算，会降向平面图形每MP 1.0 MB的水平。',
          '访客和免费账号的导出上限为12 MP；HEIC、TIFF和BMP需要账号才能生成可编辑的预览。',
        ],
      },
      related: [
        {
          label: '反相颜色',
          to: '/tools/invert-image-colors',
          description: '“效果”面板中的另一项：把照片翻转成负片。',
        },
        {
          label: '黑白照片',
          to: '/tools/black-and-white-photo',
          description: '先转换为黑白，色调分离就能产生干净的灰色色带。',
        },
        {
          label: '曲线',
          to: '/tools/photo-curves',
          description: '在量化之前，把影调移过色带分界。',
        },
        {
          label: '色彩突出',
          to: '/tools/color-pop',
          description: '保留一种颜色、其余变灰，得到另一种图形化风格。',
        },
        {
          label: '图片尺寸调整',
          to: '/tools/image-resizer',
          description: '把色调分离后的图片缩小到缩略图或图标尺寸。',
        },
      ],
      embed: {
        title: '为照片做色调分离',
        description: '拖入照片即可打开“效果”面板；添加“色调分离”，设置色阶数后导出。',
      },
    },
    'reduce-image-noise': {
      name: '降低图片噪点',
      h1: '在线降低照片噪点',
      tagline: '分别降低亮度噪点和颜色噪点，带实时预览，然后以完整分辨率导出。',
      metaTitle: '在线降低照片噪点：亮度和颜色降噪',
      metaDescription: '在浏览器中为颗粒明显的高ISO照片降噪：对亮度使用双边滤波，对颜色使用高斯滤波，在100%缩放下判断，并以完整分辨率导出。',
      ogTitle: '在线降低照片噪点',
      ogDescription: '“明亮度”和“颜色”两个滑块，去除高ISO照片上的斑点，又不会让画面变得像塑料。实时预览，完整分辨率导出，不经过第三方AI。',
      intro: 'Aperture中的降噪是一个“细节”图层，有两个滑块：“明亮度”和“颜色”，范围都是0到100。两者都在Lab颜色空间中运行：明亮度噪点在L通道上用保边的双边滤波平滑，而彩色斑块在a和b通道上用普通的高斯模糊平滑，所以“颜色”可以比“明亮度”激进得多，画面也不会显得发软。该图层与其他所有调整位于同一个非破坏性堆栈中，所以你可以用明亮度范围把它限定在阴影，降低它的不透明度，或之后把它删掉。拖动时预览会实时更新；导出文件用相同的运算从原始像素渲染。做决定前先点“按100%查看”，因为在适应屏幕的缩放下根本看不到噪点。',
      whatItDoes: [
        '在Lab明度通道上用9 x 9的双边滤波平滑明亮度噪点，差异超过范围阈值的边缘得以保留，平坦区域则被平均。',
        '在Lab的a、b通道上用可分离高斯滤波平滑颜色噪点，去除高ISO在阴影中留下的紫色和绿色斑点。',
        '两种噪点独立处理：“颜色”设为60、“明亮度”设为0时，可清除色度斑块，同时完整保留类似颗粒的每一分纹理。',
        '位于带不透明度、混合模式和可选蒙版的调整图层上，所以你可以只对天空或只对阴影降噪。',
        '由我们的服务器用相同公式从原始文件渲染导出，采用完整分辨率，而不是来自屏幕预览。',
      ],
      flowSteps: [
        {
          title: '拖入照片',
          description: 'JPG、PNG、WebP、GIF、HEIC、HEIF、AVIF、TIFF或BMP。“细节”面板会在最前面打开，“降噪”清晰可见。',
        },
        {
          title: '缩放到100%',
          description: '点击“按100%查看”，让每个图片像素对应一个屏幕像素。适应窗口时，噪点被平均掉了，任何设置看起来都没问题。',
        },
        {
          title: '先调“颜色”，再调“明亮度”',
          description: '提高“颜色”直到彩色斑点消失，通常为40到70。然后提高“明亮度”，只到颗粒不再让你困扰为止；20到40能保留纹理。',
        },
        {
          title: '导出',
          description: '选择JPG、PNG、WebP、AVIF或TIFF以及质量。服务器对原图降噪并编码文件；原图永远不会被修改。',
        },
      ],
      advancedDetails: [
        '明亮度：图片被转换为CIE Lab (D65)，L缩放到0..1。应用一个固定9 x 9窗口的双边滤波（半径4像素，边缘像素复制），空间sigma为2 + 6 l，范围sigma为max(0.2 l, 0.001)，其中l是“明亮度”滑块值除以100。“明亮度”为50时，空间sigma为5 px，范围sigma为0.1，即10个Lab明度单位；为100时，空间sigma为8 px，范围sigma为0.2。',
        '颜色：Lab的a和b通道用可分离高斯模糊处理，sigma为6 c像素，c为“颜色”滑块值除以100，所以“颜色”50对应3 px的sigma，“颜色”100对应6 px的sigma。卷积核从-ceil(3 sigma)延伸到+ceil(3 sigma)，以float64归一化，边缘像素复制。',
        '滤波后的L、a、b用标准逆矩阵转换回sRGB，结果限制到0..1。由于窗口和sigma都以像素为单位，同样的滑块值在1920 px预览上平滑的画面比例，要大于在6000 px原图上；请在100%缩放下判断结果，并预期导出看起来比适应屏幕的预览略少一些平滑。',
        '“明亮度”为0时会完全跳过双边滤波，“颜色”为0时会跳过高斯滤波，所以两者都为0的图层是真正的恒等变换，而不是非常弱的模糊。',
        '预览由你的GPU以WebGL2基于照片的1920 px副本绘制，导出文件由我们的服务器用相同公式从原图以完整分辨率渲染，两者的差异在有文档记录的容差之内：在Aperture的一致性策略中，降噪的容差最宽松，平均误差最多3个8位色阶、最大12个；而颜色调整的平均误差要求为1，颗粒则逐位一致。',
      ],
      whyItMatters: [
        '高ISO噪点主要是色度斑点，而色度可以大力模糊却看不出变软，所以把两个通道分开处理，比一个合并的滑块效果更干净。',
        '双边滤波会保留明度差超过范围sigma的边缘，正是这一点防止了降噪后的脸变成蜡状的一团。',
        '由于图层是非破坏性的，你可以按住反斜杠键对比100%放大的局部，在任何效果写入文件之前及时收手。',
      ],
      useCases: [
        {
          title: 'ISO 6400的演唱会和夜景',
          description: '“颜色”60去除黑色区域中的洋红和绿色斑块；“明亮度”30压住颗粒，又不会抹掉舞台烟雾。',
        },
        {
          title: '大幅提高曝光后的阴影恢复',
          description: '把阴影提亮2 EV会放大原本隐藏的噪点。在曝光图层上方添加降噪，并用暗部的明亮度范围作为蒙版。',
        },
        {
          title: '老旧的扫描照片',
          description: '扫描仪噪点细碎，且主要是明亮度噪点。“明亮度”40加上无需设半径的“颜色”20通常就够了；之后把“纹理”保持为0。',
        },
        {
          title: '深色背景上的产品照',
          description: '在背景上用颜色范围蒙版，只对背景降噪，让产品边缘保留每一个像素的细节。',
        },
      ],
      workedExamples: [
        {
          title: 'ISO 6400演唱会JPG，6000 x 4000，24 MP，11.4 MB',
          body: '“颜色”50，“明亮度”50。在一块平坦的灰色区域上，明度和色度的噪点标准差都约为6个色阶；“明亮度”处理（空间sigma 5 px，范围sigma 10个L单位）把明度偏差降到约0.7个色阶，“颜色”处理（sigma 3 px）把色度偏差降到约0.4个色阶。在访客12 MP的上限下以质量92导出为JPG，文件约5.4 MB；登录Premium后以完整的24 MP导出约10.8 MB。消耗一次常规任务。',
        },
        {
          title: '提亮阴影的4032 x 3024手机照片，12.2 MP，4.6 MB',
          body: '“曝光度”+1.5 EV，然后用“明亮度”30、“颜色”60降噪，并以0到0.3的明亮度范围作为蒙版。“明亮度”30时，双边滤波的空间sigma为3.8 px，范围sigma为0.06（6个L单位）；同一块噪点区域的明度偏差从约6个色阶降到约1.1，而一条20个色阶的边缘保持不变，因为它超过范围sigma的3倍以上。“颜色”60是在a和b上的3.6 px高斯模糊。以质量85导出WebP约3.7 MB。',
        },
      ],
      whenNotToUse: '如果照片本身是清晰的，只是以很低的JPG质量保存，就不要用降噪：块状的8 x 8压缩伪影不是噪点，双边滤波会保留而不是去除它们的边缘。如果你还有原图，请从原图重新编码。如果问题是运动模糊或失焦，再怎么平滑也无济于事；轻微发软可以试试锐化照片页面。如果想要刻意的颗粒胶片感，你需要的是添加颗粒而不是去除它，同一个“细节”面板中的“颗粒”滑块就能做到，而且导出逐位一致。',
      whyMediaManipulator: [
        '两道处理都是公开的公式，带有真实的常数，而不是黑箱，所以每张照片的结果都可预测。',
        '降噪的预览在你的GPU上运行，导出在我们自己的服务器上运行；任何第三方AI服务都不会看到你的照片。',
        '降噪图层可以在同一个项目中与蒙版、锐化和颗粒叠加，你不必在三个不同的单一用途工具之间来回折腾。',
      ],
      privacyNote: '降噪是纯粹的像素滤波，不需要任何AI服务：未登录时，照片在导出前一直留在你的浏览器中，导出后会像任何访客任务一样保存。登录后，原图及其1920 px预览会按你的保留期限设置保存，并随项目一起删除。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。不会向任何第三方发送任何内容。',
      faq: [
        {
          question: '为什么照片在预览中很干净，导出后却仍有一点噪点？',
          answer: '滤波窗口以像素为单位。在1920 px预览上，9 x 9窗口覆盖的画面比例比在完整尺寸原图上更大，所以导出的平滑程度相对较低。请在100%缩放下判断，那里显示的是真实的像素比例。',
        },
        {
          question: '“明亮度”和“颜色”滑块有什么区别？',
          answer: '“明亮度”在Lab明度通道上运行双边滤波，并保留边缘；“颜色”在Lab的a和b通道上运行高斯滤波，只影响色相和饱和度上的斑点。“颜色”通常可以比“明亮度”设得高得多。',
        },
        {
          question: '这是AI降噪吗？',
          answer: '不是。它是一对确定性的双边滤波和高斯滤波，每次使用都不产生费用，并在预览中即时运行。编辑器中仅有的AI任务是“选择主体”和“修复”。',
        },
        {
          question: '我能只对阴影降噪吗？',
          answer: '可以。给降噪图层加一个“明亮度范围”蒙版，把“起始亮度”设为0，“结束亮度”设为0.35左右并加上羽化，中间调和高光就会保留全部细节。',
        },
        {
          question: '降噪会改变颜色吗？',
          answer: '在平坦区域，Lab往返转换的精度远在一个8位色阶以内。较高的“颜色”值可能会让远处的串灯这类细小的彩色细节变淡，因为它们会与周围一起被平均。',
        },
        {
          question: '应该在降噪之前还是之后锐化？',
          answer: '把锐化图层放在降噪图层上方，让USM锐化处理的是已经平滑过的图像；先锐化会放大颗粒，降噪随后还得把它去掉。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'HEIC、HEIF、TIFF和BMP需要账号，以便服务器生成可解码的预览副本；其他格式可直接在浏览器中打开。',
          '没有账号时，导出上限为12 MP；Premium和Pro最高可导出120 MP。',
        ],
      },
      related: [
        {
          label: '锐化照片',
          to: '/tools/sharpen-photo-online',
          description: '降噪之后，用亮度通道上的数量、半径和阈值找回清晰度。',
        },
        {
          label: '修正曝光',
          to: '/tools/fix-photo-exposure',
          description: '提亮阴影会暴露本页要去除的噪点；两个图层可以叠加。',
        },
        {
          label: '添加晕影',
          to: '/tools/add-vignette',
          description: '压暗夜景照片中噪点较多的角落，而不是把它们平滑掉。',
        },
        {
          label: '按颜色选择',
          to: '/tools/select-by-color',
          description: '把降噪图层的蒙版限定在背景颜色上，让主体保持清晰。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '噪点会占用字节；降噪后的JPG压缩后明显更小。',
        },
        {
          label: '编辑器指南',
          to: '/tutorials/aperture',
          description: '图层、蒙版和“历史记录”面板如何协同工作。',
        },
      ],
      embed: {
        title: '为照片降噪',
        description: '拖入照片即可打开，“细节”面板位于最前面；缩放到100%后设置“颜色”和“明亮度”。',
      },
    },
    'add-vignette': {
      name: '添加晕影',
      h1: '在线添加或移除晕影',
      tagline: '通过中点、圆度、羽化和高光保护，压暗或提亮照片的边缘。',
      metaTitle: '在线添加或移除晕影：中点、圆度、羽化',
      metaDescription: '在浏览器中为照片添加暗角或亮角晕影，或用正值抵消镜头暗角。五个滑块、实时预览和完整分辨率导出。',
      ogTitle: '在线添加或移除晕影',
      ogDescription: '负的数量压暗角落，正的数量提亮角落，以消除镜头边缘失光。用中点、圆度和羽化塑造形状，保护高光，以完整尺寸导出。',
      intro: 'Aperture“细节”面板中的“晕影”部分，会把每个像素乘以一个系数，系数取决于像素与画面中心的距离。“数量”范围从-100到100：负值压暗边缘，形成把视线引向中心的经典效果；正值提亮边缘，可以抵消大光圈镜头自然的边缘失光。“中点”设定效果从哪里开始，“羽化”设定过渡有多平缓，“圆度”决定形状跟随矩形画面还是圆形，“高光”则保护明亮像素不被压暗。它和其他细节图层一样，可以加蒙版、用不透明度减弱，也可以撤销。你GPU上的预览和服务器导出使用相同的距离度量和相同的smoothstep渐变。',
      whatItDoes: [
        '用负的“数量”压暗边缘，或用正的“数量”提亮边缘：每个像素乘以“1加上amount/100与画面距离系数的乘积”。',
        '从“中点”开始生效，并用smoothstep在“羽化”宽度内过渡，所以永远不会出现可见的圆环。',
        '用“圆度”塑造衰减形状：-100跟随画面的矩形，0介于两者之间，100是内切于画面的真正椭圆。',
        '压暗时保护明亮像素：“高光”设为50时，亮度0.9的像素被压暗的幅度只有黑色像素的55%。',
        '以归一化的画面坐标从完整分辨率的原图导出，所以晕影在24 MP文件上的位置与预览中完全相同。',
      ],
      flowSteps: [
        {
          title: '打开照片',
          description: '拖入JPG、PNG、WebP、HEIC或其他照片；“细节”面板会打开，并显示“晕影”滑块。',
        },
        {
          title: '选择方向',
          description: '把“数量”拖到约-30得到轻微压暗，或拖到+20至+40，提亮被镜头压暗的角落。',
        },
        {
          title: '塑造形状',
          description: '降低“中点”让效果向内收，提高“羽化”让过渡更柔和；在宽画幅上把“圆度”设为100可得到圆形。',
        },
        {
          title: '保护并导出',
          description: '提高“高光”让明亮的天空保持亮度，按反斜杠键检查，然后导出JPG、PNG、WebP、AVIF或TIFF。',
        },
      ],
      advancedDetails: [
        '每个像素在画面上得到从-1到1的归一化坐标nx和ny（像素中心在+0.5处）。计算两种距离：矩形度量max(|nx|, |ny|)，以及圆形度量，即到中心的欧氏距离（以像素计）除以半对角线长度。两者按圆形权重(roundness + 100)/200混合，所以“圆度”-100是纯矩形，0是50/50混合，100是纯圆形。每种度量在中心都为0，在四个角上都恰好为1。',
        '系数v为smoothstep(midpoint/100, midpoint/100 + feather/100, d)：距离达到中点之前为0，达到中点加羽化之后为1，中间用三次缓动3t² - 2t³过渡。在默认的“中点”50和“羽化”50下，到角落一半处的像素v = 0，四分之三处的像素v = 0.5，d = 0.9处的像素v = 0.896。',
        '像素乘以k = 1 + amount/100 x v x prot，其中“数量”为负时prot等于1减去highlights/100与像素BT.709亮度的乘积，为正时prot等于1，结果再限制到0..1。因此提亮会产生裁切：“数量”为+30时，角落里0.8（204）的像素会变为1.0（255）。',
        '在6000 x 4000的画面上，“圆度”为0时长边中点位于d = 0.916，短边中点位于d = 0.777；“圆度”为100时，这两个值变为0.832和0.555，所以在3:2画面上，圆形晕影会让上下边缘明显比左右两侧更亮。',
        'Aperture的预览由你的GPU（WebGL2）基于1920 px副本绘制，导出由我们的服务器用相同公式从原图以完整分辨率渲染，两者的差异在一个有文档记录的小容差之内；对晕影来说，平均误差最多一个8位色阶，因为距离以归一化的画面单位计算，与像素数量无关。',
      ],
      whyItMatters: [
        '从合适的中点开始的晕影看起来像光线，而不像特效；起点离中心太近，就会像在隧道里。',
        '大光圈定焦镜头的边缘失光在角落可能多达整整一档，正的“数量”配合较宽的“羽化”就能消除它，同时不影响中心。',
        '高光保护能防止压暗型晕影把角落里明亮的天空或白色裙子弄得浑浊。',
      ],
      useCases: [
        {
          title: '背景杂乱的人像',
          description: '“数量”-35、“中点”40、“羽化”60、“圆度”60，可把注意力引向脸部，又不会出现明显的暗圈。',
        },
        {
          title: '校正全开光圈的35mm镜头',
          description: '“数量”+25、“中点”30、“羽化”70、“圆度”100，可把角落提亮约三分之一档，并让天空更均匀。',
        },
        {
          title: '白底产品照',
          description: '轻微的负向晕影配合“高光”80，让白色背景保持纯白，同时不着痕迹地让物体显得更稳。',
        },
        {
          title: '方形社交媒体裁剪',
          description: '先在“几何”中设置裁剪；晕影基于裁剪后的画面计算，所以角落始终落在角落。',
        },
      ],
      workedExamples: [
        {
          title: '压暗一张6000 x 4000的人像，24 MP JPG，9.8 MB',
          body: '“数量”-40、“中点”50、“羽化”50、“圆度”0、“高光”0。在角落（d = 1，v = 1），系数为1 - 0.40 = 0.60，所以128的中灰变为77。在长边中点，d = 0.916，v = 0.925，128变为约81。在四分之三处，v = 0.5，128变为102；d = 0.5以内没有任何变化。在访客12 MP的上限下以质量92导出为JPG：约5.4 MB，消耗一次常规任务。',
        },
        {
          title: '消除4000 x 6000风景照的镜头边缘失光，24 MP，Premium账号',
          body: '“数量”+30、“中点”30、“羽化”70、“圆度”100。在角落，v = 1，系数为1.30，所以角落里160的天空变为208，高于196的值都会裁切到255。到角落一半处d = 0.5，v = smoothstep(0.3, 1.0, 0.5) = 0.198，160变为约170。以质量90导出24 MP的WebP，文件约7.2 MB。',
        },
      ],
      whenNotToUse: '当主体位于画面边缘时，不要用晕影，因为任何居中的压暗都会让它变暗；请改用“局部调整”，把径向蒙版放在主体上。不要用正的“数量”来提亮整张曝光不足的照片：它只会提亮角落，并让明亮像素在255处裁切，而“曝光度”滑块会均匀提亮所有内容。如果想要实色边框或给画面加框，晕影完全是错误的工具，因为它的过渡总是柔和的；请裁剪到你想要的比例，再用排版软件添加边框。',
      whyMediaManipulator: [
        '形状、过渡和保护都连同精确常数一起公开，所以你喜欢的设置可以保存为一种风格，并在下一张照片上得到完全相同的效果。',
        '因为晕影是一个图层，可以用“明度”模式混合，避免压暗的边缘出现任何色偏。',
        '导出从原图渲染，Pro上最高120 MP，并使用相同的归一化坐标，而不是从屏幕预览拉伸而来。',
      ],
      privacyNote: '晕影只根据画面坐标和像素值计算，没有任何AI步骤。没有账号时，照片及其边缘压暗在你导出之前不会离开你的浏览器，导出则是一次普通的访客任务。有账号时，原图及其1920 px预览会按你的保留期限设置保存在我们的服务器上。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。不涉及任何第三方。',
      faq: [
        {
          question: '如何去除镜头在照片中留下的晕影？',
          answer: '使用正的“数量”。镜头的边缘失光大致呈圆形，并一直延伸到角落，所以“圆度”100、“中点”20到35、“羽化”60到80，再加上+15到+40的“数量”，通常就能抵消它。注意明亮的角落，因为提亮会在255处裁切。',
        },
        {
          question: '为什么晕影在预览中是圆的，导出后却先到达两侧？',
          answer: '并不会；两者的距离都按画面归一化。真正改变形状的是“圆度”：-100时跟随矩形，侧边先变暗；100时是内切椭圆。',
        },
        {
          question: '“高光”到底有什么作用？',
          answer: '当“数量”为负时，每个像素的压暗幅度会乘以“1减去highlights/100与其亮度的乘积”。“高光”为100时，纯白像素完全不会被压暗，中灰只被压暗一半。“数量”为正时它不起作用。',
        },
        {
          question: '晕影会跟随裁剪吗？',
          answer: '会。包括裁剪和拉直在内的“几何”调整会在所有图层之前应用，所以中心和角落是裁剪后画面的，而不是原始文件的。',
        },
        {
          question: '晕影可以偏离中心吗？',
          answer: '用晕影滑块不行，它们始终居中。要做偏离中心的压暗，请添加带“径向”蒙版的“局部调整”，把蒙版反相并降低“曝光度”；径向蒙版的中心、大小和旋转都可以拖动调整。',
        },
        {
          question: '深色晕影会让角落偏色吗？',
          answer: '乘法对R、G、B等比例缩放，所以色相不变，不过暗角看起来可能略微更饱和。如果你想让色度完全保持原样，请把图层的混合模式设为“明度”。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '晕影在归一化的画面坐标中计算，所以在12到120 MP之间的任何导出尺寸下都完全相同。',
          'PNG导出会保留透明度；旋转留下的透明角落会像其他像素一样被相乘，但仍保持透明。',
        ],
      },
      related: [
        {
          label: '修正曝光',
          to: '/tools/fix-photo-exposure',
          description: '先平衡整体亮度，再决定边缘要压得多暗。',
        },
        {
          label: '拉直照片',
          to: '/tools/straighten-photo',
          description: '先拉直和裁剪；晕影基于最终画面计算。',
        },
        {
          label: '分离色调',
          to: '/tools/split-toning',
          description: '暖色高光加冷色阴影的色调，与柔和的边缘压暗很搭。',
        },
        {
          label: '黑白照片',
          to: '/tools/black-and-white-photo',
          description: '经典的黑白印相几乎总带有这样的边缘加深。',
        },
        {
          label: '图片尺寸调整',
          to: '/tools/image-resizer',
          description: '需要为网站准备特定像素尺寸时，在导出后调整尺寸。',
        },
      ],
      embed: {
        title: '添加或移除晕影',
        description: '拖入照片即可打开“细节”面板；把“数量”拖向负值压暗边缘，或拖向正值提亮边缘。',
      },
    },
    'sharpen-photo-online': {
      name: '锐化照片',
      h1: '在线锐化照片',
      tagline: '对亮度使用的USM锐化，带数量、半径和阈值，另有清晰度和纹理，在100%下判断。',
      metaTitle: '在线锐化照片：数量、半径和阈值',
      metaDescription: '在浏览器中用真正的USM锐化来锐化照片：数量0-500、半径0.1-50 px、阈值0-255，另有清晰度和纹理。实时预览，完整分辨率导出。',
      ogTitle: '在线锐化照片',
      ogDescription: '像桌面编辑器一样提供数量、半径和阈值，还有“按100%查看”按钮，以及针对中间调和细微细节的清晰度与纹理。导出时以完整分辨率渲染。',
      intro: 'Aperture“细节”面板中的“锐化”部分是经典的USM锐化，只在亮度上计算：把每个像素的亮度与一份高斯模糊后的副本相比较，二者之差乘以“数量”后加回全部三个通道。“半径”设定模糊的sigma（以像素计），决定你是在强化细微纹理，还是在增强大范围的边缘；“阈值”会忽略小于若干个8位色阶的差值，让平滑的皮肤和天空不至于变粗糙。另有两个配套滑块使用同一引擎，但半径固定：“清晰度”取长边的2%，偏重中间调；“纹理”取0.3%，针对细微细节。所有效果都在你的GPU上实时预览，导出时则从原图以完整分辨率渲染。',
      whatItDoes: [
        '在亮度上执行USM锐化：像素亮度减去其高斯模糊（模糊半径为“半径”设定的像素数），差值乘以Amount/100后加到R、G、B上。',
        '用“阈值”让平坦区域保持不变：阈值为8时，8个色阶及以下的差值都会被忽略，因此天空中的噪点不会被锐化。',
        '提供“清晰度”：以大半径（长边的2%）进行偏重中间调的锐化，增强画面力度；以及“纹理”：以细半径（0.3%，至少1.5 px）锐化表面细节。两者的范围都是-100到100，负值会柔化画面。',
        '提供“按100%查看”按钮，把画布设为一个图像像素对应一个屏幕像素，这是唯一能准确判断锐化效果的缩放比例。',
        '在我们的服务器上从原图导出，使用相同的高斯核系数和增益，因此1 px的半径就是全尺寸文件中的1 px。',
      ],
      flowSteps: [
        {
          title: '拖入照片',
          description: '“细节”面板会显示在最前面。请立即按下“按100%查看”。',
        },
        {
          title: '选择半径',
          description: '对24 MP文件的细微细节，用0.6到1.0 px；对偏软的镜头或较小的网页导出，用1.5到2.5。半径越大，越会产生明显的光晕。',
        },
        {
          title: '提高数量，设置阈值',
          description: '“数量”通常设为80到150。如果皮肤或天空开始显得粗糙，就把“阈值”提高到4到10。',
        },
        {
          title: '导出',
          description: '选择格式和尺寸。服务器以完整分辨率锐化原图；之后再缩小尺寸会让画面略微变软，所以输出尺寸较小时要多锐化一点。',
        },
      ],
      advancedDetails: [
        '亮度L采用BT.709，对sRGB编码值计算0.2126 R + 0.7152 G + 0.0722 B。模糊是可分离的高斯模糊，sigma等于“半径”，采样范围从-ceil(3 sigma)到+ceil(3 sigma)，以float64归一化，边缘像素采用复制延拓。差值d = L - blur(L)在|d|不大于Threshold/255时置零，然后把shift = Amount/100 × d加到R、G、B各通道上，结果限定在0..1之间。',
        '在从0.3（77）到0.7（179）的阶跃边缘上，数量100、半径1会把最靠近边缘的两个像素变为46和209，下一对变为71和184。同样的数量下，半径2得到36和219，并在暗侧产生三个像素宽的光晕（66、54、36）。数量150、半径1则得到31和224。',
        '“清晰度”是同一种USM锐化，sigma为长边的0.02倍（6000 px的文件上为120 px），增益为Amount/100 × 0.6，并带有中间调权重W = 1 - |2L - 1|：中灰处为1，纯黑和纯白处为0。“纹理”的sigma取1.5与长边的0.003倍两者中的较大值，在6000 px的文件上为18 px；增益为Amount/100 × 0.5，既没有权重，也没有阈值。',
        '由于“清晰度”和“纹理”的半径是长边的一个比例，它们会随图像缩放，因此1920 px预览与全尺寸导出一致；“锐化”的半径则以绝对像素计，预览按代理图的比例显示，这正是设置“按100%查看”按钮的原因。',
        'Aperture在你的GPU上（WebGL2）基于1920 px的副本绘制预览，在我们的服务器上用相同公式从原图以完整分辨率渲染导出，并把两者的差异控制在有文档说明的小容差内：锐化及其他卷积操作的平均误差不超过1.5个8位色阶，最大为8；颜色操作的平均误差为1，颗粒则完全一致。',
      ],
      whyItMatters: [
        '只有一个旋钮的锐化无法区分细微细节和边缘对比度；正是半径和阈值，让头发保持清晰，皮肤依然平滑。',
        '只在亮度上锐化，可以避免RGB USM锐化在高对比度边缘产生的彩色镶边。',
        '在100%下判断，可以避免最常见的错误：对适应屏幕的预览过度锐化，而那个预览本身已经被浏览器缩小采样过了。',
      ],
      useCases: [
        {
          title: '网页输出锐化',
          description: '以2048 px宽度导出，然后设数量120、半径0.7、阈值2，抵消缩小带来的发软。',
        },
        {
          title: '镜头略软或轻微失焦',
          description: '在24 MP的文件上，半径1.8、数量90可以找回观感上的边缘对比度；半径超过2.5，光晕就会露馅。',
        },
        {
          title: '人像',
          description: '阈值10，配合数量100和半径1，可以锐化眼睛、睫毛和头发，同时让肤色中10个色阶的细微起伏保持原样。',
        },
        {
          title: '建筑与风景',
          description: '清晰度25增强中间调力度，纹理30强化石材和树叶，最后用半径0.8轻度锐化。',
        },
      ],
      workedExamples: [
        {
          title: '对6000 x 4000的风景照做输出锐化，24 MP，10.8 MB JPG',
          body: '锐化数量100、半径1、阈值0，在Premium账号上以24 MP导出。在一条77/179的边缘上，最近的两个像素变为46和209，下一对变为71和184，距边缘三个像素处的变化不到一个色阶。再加上清晰度25，会应用一个sigma为120 px、增益0.15、按中间调加权的USM锐化；一个比周围大范围区域亮0.1的中灰像素会上移0.015，约4个色阶。质量92的JPG约为11.3 MB，比未锐化的文件大5%。',
        },
        {
          title: '4032 x 3024的手机人像，12.2 MP，3.9 MB HEIC，已登录',
          body: '数量120、半径0.8、阈值8。脸颊上2个色阶的起伏（130、126、130、126）低于阈值，完全保持原样；若阈值为0，这些像素会变成约131和124。一条89对149的睫毛边缘，最近的两个像素被推到71和167，两侧各变化18个色阶。导出为质量90的WebP消耗一次常规任务，约3.1 MB。',
        },
      ],
      whenNotToUse: '照片本身已有噪点或经过重度JPG压缩时，不要在不设阈值的情况下锐化，因为USM锐化会先放大颗粒和压缩块边缘，然后才轮到真实细节；请先降噪，或提高阈值。真正的运动模糊或严重失焦，任何USM锐化都无法挽回，它只能提高已有边缘的对比度；半径超过3 px只会画出光晕。如果你只需要对一张小图做一次快速、均匀的锐化，Media Manipulator上的一键式“锐化图片”工具更快，也不需要打开编辑器。',
      whyMediaManipulator: [
        'Aperture提供USM锐化真正的三个控制项，并公开其公式，而不是只给一个藏起各项设置的强度滑块。',
        '锐化图层叠在降噪之上，可按需配上蒙版，结果在你自己的GPU上即时预览。',
        'Pro套餐最高可以完整分辨率导出120 MP，因此你在100%下调好的半径，就是交付文件中的半径。',
      ],
      privacyNote: '锐化是本地卷积运算，从不调用AI服务。未登录时，你的照片及其锐化设置一直留在此浏览器中；导出时，文件才会以访客任务的形式上传，仅用于那一次渲染。登录后，原图、1920 px预览和缩略图按你的保留设置存放在我们的服务器上，项目删除时一并删除。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。不会与任何第三方共享。',
      faq: [
        {
          question: '锐化24 MP的照片应该用多大的半径？',
          answer: '如果要以全尺寸查看细微细节，用0.6到1.0 px。如果图像会缩小到几千像素，就应针对输出来锐化：按该尺寸导出，用0.5到0.8 px并提高数量。',
        },
        {
          question: '锐化中的阈值有什么作用？',
          answer: '凡是|L - blur(L)|不大于threshold/255的地方，它都会把亮度差置零。阈值为8时，天空中2个色阶的起伏保持130/126，不会变成131/124，而100个色阶的边缘则会被完整锐化。',
        },
        {
          question: '这和Media Manipulator上的“锐化图片”工具有什么不同？',
          answer: '那个页面是强度固定的一次性ImageMagick滤镜。这里则是一个图层，带有数量、半径和阈值，可在100%下实时预览，旁边还有清晰度和纹理，并支持蒙版，让你只锐化眼睛。',
        },
        {
          question: '为什么在某些编辑器里锐化会产生彩色边缘，这里却不会？',
          answer: 'RGB USM锐化会分别增强每个通道，从而夸大色差。这里的差值在BT.709亮度上计算，同样的偏移量加到R、G、B上，因此边缘处的色相得以保持。',
        },
        {
          question: '清晰度还是锐化：用哪一个？',
          answer: '“锐化”以几个像素的半径作用于边缘；“清晰度”的半径为长边的2%，偏重中间调，提升整个形体范围内的局部对比度。大多数照片两者都需要一点，再用“纹理”处理细腻的表面。',
        },
        {
          question: '锐化会让文件变大吗？',
          answer: '会，大一点。锐化后的边缘含有更多高频信息，JPG编码器需要保留它们；在相同质量下，预计字节数会增加约5%到10%。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '半径以导出文件的像素为单位；当你把导出上限设为12 MP时，服务器会在锐化之后再缩小结果。',
          'TIFF导出每MP约3 MB，保留锐化后的每一个色阶，也不会出现JPG的振铃效应。',
        ],
      },
      related: [
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '锐化后的边缘会占用字节；导出后请重新检查文件大小。',
        },
        {
          label: '降低图片噪点',
          to: '/tools/reduce-image-noise',
          description: '先降噪，再在其上方锐化，避免放大颗粒。',
        },
        {
          label: '调整对比度',
          to: '/tools/adjust-image-contrast',
          description: '全局对比度和清晰度解决的是不同的问题；把它们放在一起比较。',
        },
        {
          label: '图片尺寸调整',
          to: '/tools/image-resizer',
          description: '缩小会让画面变软；目标尺寸较小时，多锐化一点。',
        },
        {
          label: '去除瑕疵',
          to: '/tools/remove-blemishes',
          description: '先修复斑点再锐化，免得把它们强调出来。',
        },
        {
          label: '编辑器指南',
          to: '/tutorials/aperture',
          description: '面板、图层、蒙版和键盘快捷键，集中在一处说明。',
        },
      ],
      embed: {
        title: '锐化照片',
        description: '拖入照片即可打开“细节”面板；按“按100%查看”，然后设置“数量”“半径”和“阈值”。',
      },
    },
    'straighten-photo': {
      name: '拉直照片',
      h1: '在线拉直歪斜的照片',
      tagline: '按角度或画一条线来修正倾斜的地平线，然后自动裁剪为最大的矩形。',
      metaTitle: '在线拉直歪斜的照片：修正倾斜的地平线',
      metaDescription: '在浏览器中校平倾斜的地平线：输入角度或沿地平线画一条线，自动裁剪为最大的内接矩形，并以完整分辨率导出。',
      ogTitle: '在线拉直歪斜的照片',
      ogDescription: '沿地平线画一条线，旋转就会自动设好。自动裁剪保留最大的矩形，也可以用透明、边缘或颜色填充角落。',
      intro: '“拉直”位于Aperture的“几何”面板中，作用于源像素，先于任何调整图层。你可以输入以度为单位的角度，也可以按“画线”，沿着应当水平或竖直的物体拖动；编辑器会计算这条线的倾角，把它折算到-45到45度的范围内，并设置相应的旋转来抵消它。旋转是一次逆向映射的双线性重采样，所以每个像素只采样一次。默认情况下，画面会自动裁剪为保持原始宽高比、只包含真实像素的最大矩形；关闭这一选项，角落就用透明、拉伸的边缘或你选定的颜色填充。裁剪、翻转和透视共用这同一次重采样。',
      whatItDoes: [
        '按-360到360度之间的任意角度旋转，对原始像素只做一次双线性重采样；90度和180度的旋转则是精确复制。',
        '根据你画的线设置角度：线的倾角被折算到(-45, 45]度区间后取反抵消，因此沿地平线或门框画线都可以。',
        '自动裁剪为保持原始宽高比、居中、且整条边界都落在旋转后源图之内的最大矩形，通过30步二分查找求得。',
        '如果你想保留整个旋转后的画面，可以用透明、钳制到边缘的像素或纯色来填充空白角落。',
        '让蒙版保持对齐：每个蒙版都存储在拉直、裁剪后的空间中，导出时在原图上渲染相同的几何变换。',
      ],
      flowSteps: [
        {
          title: '拖入照片',
          description: '“几何”面板会显示在最前面，其中有“拉直”部分和“画线”按钮。',
        },
        {
          title: '沿地平线画线',
          description: '点击“画线”，从地平线的一端拖到另一端；短于8 px的拖动会被忽略。角度字段随之更新。',
        },
        {
          title: '检查裁剪',
          description: '“自动裁剪为最大矩形”默认开启。如果你想保留角落，就关闭它并选择一种填充方式。',
        },
        {
          title: '导出',
          description: '服务器以完整分辨率旋转并裁剪原图，编码为JPG、PNG、WebP、AVIF或TIFF。',
        },
      ],
      advancedDetails: [
        '旋转后的画布会扩大到旋转后源图的外接矩形：宽度为|w cos| + |h sin|，高度为|w sin| + |h cos|，再取整。一张6000 x 4000的照片旋转2.5度后，画布为6169 x 4258。每个输出像素中心都会依次经过裁剪、透视单应性、翻转和逆旋转，映射回连续的源坐标，并从其四个相邻像素双线性采样；落在源图之外的坐标使用填充。',
        '自动裁剪对s做30次迭代的二分查找，寻找所需宽高比的居中矩形的最大缩放比例s，使其边界上全部100个采样点（每边25个）都映射到源图之内。在6000 x 4000上旋转2.5度时，裁剪框在每个方向上都是画布的88.44%，即5456 x 3766像素、20.55 MP，保留原始像素的85.6%。1.2度时保留92.5%，5度时约为79%。',
        '“画线”：这条线在屏幕坐标（y轴向下）中的角度为atan2(dy, dx)换算成的度数，按90的倍数折算到(-45, 45]区间，再把它的相反数加到当前旋转上，取整到0.01度。在1920 px的预览上，从(200, 1080)到(1800, 1020)的一条线倾斜2.15度，会把旋转设为+2.15。',
        '填充：“透明”在源图之外写入RGBA 0（PNG和WebP会保留，JPG则显示为黑色）；“拉伸边缘”把采样点钳制到最近的边缘纹素；“颜色”写入不透明的#rrggbb。双线性插值同样作用于Alpha通道，因此透明填充会带一像素宽的柔和边界。',
        'Aperture在你的GPU上（WebGL2）基于1920 px的副本预览，在我们的服务器上用相同公式从原图以完整分辨率渲染导出，两者在有文档说明的小容差内保持一致：几何变换在排除2 px边框后的内部区域最大相差2个8位色阶，因为两种尺度下的双线性采样位置略有不同；颜色操作的平均误差控制在1个色阶，颗粒则完全一致。',
      ],
      whyItMatters: [
        '地平线哪怕只倾斜一度，在海景或湖景中也能看出来，而且是观者最先注意到的地方。',
        '画线比微调滑块更快也更准确，因为倾角是编辑器测量出来的，而不是靠你估计。',
        '事先知道裁剪会损失多少像素，你就能在导出前，在紧凑的自动裁剪和填充角落之间做出选择。',
      ],
      useCases: [
        {
          title: '海景与日落',
          description: '沿水面线画线。在24 MP的画面上校正1.5度，可保留92.6%的像素。',
        },
        {
          title: '建筑与门廊',
          description: '改为沿竖直边缘画线；角度会折算到同样的-45到45范围，所以竖直线和地平线一样好用。',
        },
        {
          title: '扫描的文档与照片',
          description: '沿纸张边缘画线，填充选“拉伸边缘”，并导出为PNG，避免再次压缩。',
        },
        {
          title: '匆忙拍下的手机照片',
          description: '对4032 x 3024的照片做2度校正，约损失9%的像素，仍剩11 MP。',
        },
      ],
      workedExamples: [
        {
          title: '一张倾斜2.5度的6000 x 4000海景，24 MP，10.8 MB JPG',
          body: '沿地平线画一条线，旋转被设为2.5度。旋转后的画布为6169 x 4258；自动裁剪保留一个居中矩形，每边为画布的88.44%，即5456 x 3766像素、20.55 MP，相当于原始像素的85.6%。在Premium账号上以全尺寸导出为质量92的JPG，文件约9.2 MB；按访客的12 MP上限导出会被缩小，约5.4 MB。消耗一次常规任务。',
        },
        {
          title: '一张倾斜1.8度的4032 x 3024手机照片，12.2 MP，4.4 MB',
          body: '输入角度1.8。画布为4125 x 3149；自动裁剪每边保留92.28%，即3807 x 2906像素、11.06 MP，为原图的90.7%。关闭自动裁剪并把“填充”设为“透明”后，导出的是完整的4125 x 3149画布，四角各有一个小小的透明三角形，最宽处约130 px高；要保留它们，必须导出为PNG（约28 MB）或WebP（质量90时约3.9 MB）。',
        },
      ],
      whenNotToUse: '如果照片中的线条是汇聚而不是倾斜，就不要用拉直：相机朝上拍摄导致建筑向后仰，需要用四角透视工具，旋转只会把一面倾斜的墙换成另一面倾斜的墙。单纯转90度，请使用“向左/向右旋转90度”按钮，它们精确复制像素，不做重采样。如果你只需要应用EXIF方向标记，让文件以正确的方向显示，尺寸调整或元数据工具不用打开编辑器项目就能完成。',
      whyMediaManipulator: [
        '拉直、裁剪、翻转和透视合并为一次重采样，拉直后的照片不会被柔化两次。',
        '裁剪比例由几何计算得出而不是估算，在你花掉一次常规任务之前，导出尺寸就会显示出来。',
        '蒙版和修复会随几何变换一起移动，所以修图之后再拉直，也不必重做蒙版。',
      ],
      privacyNote: '拉直纯粹是对你自己像素的几何运算，不用任何模型，也不涉及第三方服务。未登录时，旋转后的预览在你的浏览器中计算，导出之前不会上传任何内容，导出则是一次普通的访客任务。登录后，原图及其1920 px预览按你的保留设置存放在我们的服务器上，并随项目一起删除。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: '拉直时会损失多少画面？',
          answer: '取决于角度和宽高比。在3:2的画面上，自动裁剪保持原始宽高比时，1度约保留95%的像素，2.5度约86%，5度约79%。',
        },
        {
          question: '可以保留角落而不裁剪吗？',
          answer: '可以。关闭“自动裁剪为最大矩形”，再选择一种填充：“透明”用于PNG或WebP输出，“拉伸边缘”把边界像素向外拉伸涂抹，“颜色”则用纯色填充。',
        },
        {
          question: '小角度旋转会让照片变模糊吗？',
          answer: '一次双线性重采样会让画面略微变软，程度大约相当于半个像素的位移。拉直加裁剪时，编辑器从不重采样两次；90度和180度的旋转则是精确的。',
        },
        {
          question: '正向旋转是哪个方向？',
          answer: '正角度在屏幕上顺时针旋转。画一条向右下倾斜的线，会产生正向校正，把右侧抬起。',
        },
        {
          question: '可以沿竖直线而不是地平线来拉直吗？',
          answer: '可以。任何与竖直方向夹角在45度以内的线，都会被视为应当竖直的物体，所以沿路灯杆或门边画线，设置的旋转与沿地平线相同。',
        },
        {
          question: '拉直之前画好的蒙版会怎样？',
          answer: '蒙版存在于校正后的画面中。修改裁剪时，每个蒙版坐标都会被重新映射，画笔笔触也会在同一次编辑中重新采样到新的空间，因此调整始终作用于同样的画面内容。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '透明的角落填充只能在PNG、WebP、AVIF和TIFF中保留；JPG没有Alpha通道，会把填充显示为黑色。',
          '导出对话框显示的是裁剪后的尺寸；访客的12 MP上限针对的是这个尺寸，而不是原图。',
        ],
      },
      related: [
        {
          label: '修正透视',
          to: '/tools/fix-perspective-photo',
          description: '汇聚的竖直线需要用四角工具，而不是旋转。',
        },
        {
          label: '添加晕影',
          to: '/tools/add-vignette',
          description: '晕影基于拉直、裁剪后的画面计算。',
        },
        {
          label: '图片尺寸调整',
          to: '/tools/image-resizer',
          description: '之后把裁剪结果调整到精确的像素尺寸。',
        },
        {
          label: '移除图片中的EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '从导出的文件中移除方向标签和位置数据。',
        },
        {
          label: '编辑器指南',
          to: '/tutorials/aperture',
          description: '“几何”在处理流程中的位置，以及蒙版如何随之变化。',
        },
      ],
      embed: {
        title: '拉直歪斜的照片',
        description: '拖入照片即可打开“几何”面板；输入角度，或沿地平线画一条线。',
      },
    },
    'fix-perspective-photo': {
      name: '修正透视',
      h1: '在线修正照片透视',
      tagline: '拖动四个角来校正梯形失真和汇聚的垂直线，然后自动裁剪结果。',
      metaTitle: '在线修正照片透视：梯形校正',
      metaDescription: '在浏览器中通过拖动四个角校正汇聚的垂直线和梯形畸变。射影映射、双线性重采样、自动裁剪和完整分辨率导出。',
      ogTitle: '在线修正照片透视',
      ogDescription: '用四角透视工具拉直后仰的建筑、摆正歪斜的文档，只做一次双线性重采样，并自动裁剪为最大的干净矩形。',
      intro: 'Aperture“几何”面板中的透视校正是一种四角射影变换。按“拖动角点”，把画面的每个角向外或向内拖；编辑器会构建把单位正方形映射到你的四边形上的单应性矩阵（Heckbert的构造方法），让每个输出像素经由它做逆向映射，并对源图做双线性采样。由于这是真正的射影映射而不是拉伸，从街面拍摄的建筑中汇聚的竖直线会变得平行，直线依然保持笔直。透视、旋转、翻转和裁剪都在同一次重采样中完成，先于任何调整图层。开启“自动裁剪为最大矩形”时，画面会裁成保持原始宽高比的最大干净矩形；关闭时，拉伸出的角落用透明、边缘或颜色填充。',
      whatItDoes: [
        '通过由四个角点偏移量定义的射影变换映射画面，每个偏移量都限定在画面尺寸的一半以内，因此角点永远不会越过中线。',
        '可校正任一方向的梯形失真：把顶部两个角向外拉，修正向上汇聚的竖直线；拉动侧边的角，则能把斜着拍的文档摆正。',
        '裁剪、透视、翻转和旋转一起从原始像素做一次双线性重采样，校正后的图像不会因多次处理而变软。',
        '自动裁剪为整条边界都采样到真实像素的最大居中矩形，或保留完整画布并使用你选择的填充。',
        '在我们的服务器上以完整分辨率导出校正后的原图，使用与预览完全相同的单应性系数。',
      ],
      flowSteps: [
        {
          title: '拖入照片',
          description: '“几何”面板打开，其中有“透视”部分；按“拖动角点”。',
        },
        {
          title: '拖动角点',
          description: '对于向后仰的建筑，把左上角向左拖、右上角向右拖，直到竖直线看起来平行。每次只拖几个百分点。',
        },
        {
          title: '决定裁剪方式',
          description: '自动裁剪会裁成最大的矩形。关闭它，并选择“透明”“拉伸边缘”或“颜色”，即可保留整个画布。',
        },
        {
          title: '导出',
          description: 'JPG、PNG、WebP、AVIF或TIFF，均从原图渲染。随时可以按“重置透视”，让偏移量归零。',
        },
      ],
      advancedDetails: [
        '每个角点存储一个偏移量(x, y)，单位是旋转后画布的尺寸，因此tl = (-0.06, 0)表示左上角向外移动了宽度的6%。四个目标点tl、tr = (1 + x, y)、br = (1 + x, 1 + y)和bl = (x, 1 + y)定义一个四边形，单位正方形通过八系数单应性x = (a u + b v + c) / (g u + h v + 1)、y = (d u + e v + f) / (g u + h v + 1)映射到这个四边形上，系数用Heckbert的闭式解计算；平行四边形（射影项为零）则退化为仿射情形。',
        '对于tl.x = -0.06、tr.x = +0.06的4000 x 6000竖幅照片，系数为a = 1.12、b = 0.06、c = -0.06、e = 1.12、h = 0.12，其余为0：输出的顶行采样的源图行比它自身宽12%，因此原本汇聚了画面宽度12%的竖直线会变得平行。',
        '每个输出像素中心先经过单应性变换，再经过翻转和逆旋转，得到连续的源坐标，并从其四个相邻像素双线性插值；落在源图之外的采样使用填充，Alpha通道也以同样方式插值，因此透明填充会带一像素宽的柔和边界。',
        '自动裁剪执行30步二分查找，寻找画布宽高比下最大的居中矩形，要求其边界上的100个采样点全部落在源图之内。对上面6%的校正，每边保留89.83%，即3593 x 5390像素，为24 MP原图的80.7%；10%的校正则保留71.6%。如果改为向内拉角点，就完全不需要裁剪，因为每个输出像素都映射在源图之内。',
        'Aperture的预览在你的GPU上（WebGL2）基于1920 px的副本绘制，导出则在我们的服务器上用相同公式从原图以完整分辨率渲染，两者在有文档说明的小容差内保持一致；几何变换在排除2 px边框后的内部区域最大相差2个8位色阶，颜色操作的平均误差控制在1个色阶，颗粒则完全一致。',
      ],
      whyItMatters: [
        '汇聚的竖直线会让建筑看起来像在向后倒；射影校正是唯一既能修正它们、又能保持直线笔直的变换。',
        '从侧面拍摄的文档或白板，只要把四个角映射回正方形，就会变成便于阅读的矩形。',
        '事先看到裁剪的代价，你就能在拍摄或裁剪时留足余量，而不是在导出后才发现屋顶线被切掉了。',
      ],
      useCases: [
        {
          title: '从街面拍摄的建筑',
          description: '把顶部两个角向外拉4%到8%，直到窗户的竖列平行；预计可保留80%到90%的像素。',
        },
        {
          title: '白板与海报',
          description: '把画面的每个角拖到板子的角上；关闭自动裁剪，之后再手动裁剪到板子边缘。',
        },
        {
          title: '广角镜头拍摄的室内',
          description: '在顶部两个角做2%到3%的小幅校正，就能把门框摆正，又不会像大幅校正那样显得被拉伸。',
        },
        {
          title: '产品静物照',
          description: '把略微从上方拍摄的盒子摆正，让它的正面成为真正的矩形，再抠出背景。',
        },
      ],
      workedExamples: [
        {
          title: '一栋后仰的办公楼，4000 x 6000竖幅，24 MP，12.1 MB JPG',
          body: '左上角拖到x = -0.06，右上角拖到x = +0.06，底部两个角不动。单应性为a = 1.12、b = 0.06、c = -0.06、e = 1.12、h = 0.12。自动裁剪每边保留89.83%：3593 x 5390像素、19.4 MP，为原图的80.7%。在Premium账号上导出质量92的JPG约为8.7 MB；访客导出会缩小到12 MP，约5.4 MB。消耗一次常规任务。',
        },
        {
          title: '从左侧拍摄的白板，4032 x 3024手机JPG，12.2 MP',
          body: '左上x = -0.05，右上x = +0.05，左下y = +0.02，右下y = -0.02，把白板摆正。系数为a = 1.10、b = 0.073、c = -0.05、e = 1.146、h = 0.146。自动裁剪每边保留90.95%，即3667 x 2750像素、10.1 MP，为画面的82.7%。为了让马克笔字迹清晰而导出为PNG，每MP约2.5 MB，总计约25 MB；导出为质量90的WebP则约3.1 MB。',
        },
      ],
      whenNotToUse: '如果线条是弯曲而不是汇聚，就不要用透视工具：广角镜头造成的桶形畸变需要径向校正，而本编辑器不提供这项功能，射影映射也会让弯曲原样保留。单纯的倾斜属于旋转，应交给“拉直”，损失的像素更少。超过画面约15%的大幅校正，会把远端边缘拉伸得过多，细节变软，裁剪还会切掉三分之一的画面；条件允许时，请退后一些、用更长的焦距重拍。',
      whyMediaManipulator: [
        '这种映射是有文档说明的射影单应性，因此结果是精确的几何变换，而不是用网格近似的变形。',
        '透视与拉直、翻转和裁剪共用一次双线性重采样，当一张照片既要修正倾斜、又要做梯形校正时，这一点很重要。',
        '校正后的原图以完整分辨率导出，Pro最高可达120 MP，预览与导出的差异控制在有文档说明的容差内。',
      ],
      privacyNote: '透视修正是对坐标的算术运算，不使用AI模型，也不调用外部服务。未登录时，校正后的预览只存在于你的浏览器中，直到导出；那次上传会像任何访客任务一样保存。登录后，原图、1920 px预览和缩略图按你的保留设置保留在我们的服务器上，并随项目一起删除。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
      faq: [
        {
          question: '角点最多能拖多远？',
          answer: '每个角点的偏移量在各个方向上都限定在画布尺寸的正负一半以内，因此角点可以接近画面中线，但永远不会越过。超过约15%的校正，通常看起来也已经被拉伸了。',
        },
        {
          question: '修正高楼时，自动裁剪为什么会切掉这么多？',
          answer: '把顶部两个角向外拉，意味着输出的顶部需要采样一条比源图实际更宽的区域，所以必须裁掉两侧，直到整条边界都是真实像素。在3:2的竖幅照片上拉6%，约保留81%的像素。',
        },
        {
          question: '透视可以和拉直结合使用吗？',
          answer: '可以。先应用旋转，再在旋转后的画布上解释透视偏移量，两者经过同一次双线性重采样，所以先画地平线，再把竖直线摆正。',
        },
        {
          question: '这和镜头畸变校正一样吗？',
          answer: '不一样。桶形和枕形畸变会让直线弯曲，需要径向模型。透视工具只处理汇聚的线条；弯曲的线经过它之后依然弯曲。',
        },
        {
          question: '“重置透视”有什么作用？',
          answer: '它把四个角点偏移量全部归零并移除单应性，你设置的旋转、翻转和裁剪保持不变。偏移量已经为零时，该按钮不可用。',
        },
        {
          question: '校正后的照片会变模糊吗？',
          answer: '被拉伸的区域经过插值，会损失一点锐度，大致与拉伸程度成正比；6%的校正在100%缩放下几乎看不出来。在上方加一个轻度的“锐化”图层，即可恢复边缘对比度。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '透明的角落填充需要PNG、WebP、AVIF或TIFF；导出JPG时，填充会显示为黑色。',
          '访客的12 MP上限以及各套餐24、64和120 MP的上限，都以自动裁剪后的输出尺寸来衡量。',
        ],
      },
      related: [
        {
          label: '拉直照片',
          to: '/tools/straighten-photo',
          description: '地平线倾斜是旋转问题，不是透视问题。',
        },
        {
          label: '锐化照片',
          to: '/tools/sharpen-photo-online',
          description: '恢复校正后画面中被拉伸部分的边缘对比度。',
        },
        {
          label: '移除图片背景',
          to: '/tools/remove-background-from-image',
          description: '先把产品照摆正，再抠图。',
        },
        {
          label: '压缩图片',
          to: '/tools/compress-image',
          description: '为商品页面或幻灯片缩小导出的文件。',
        },
        {
          label: '编辑器指南',
          to: '/tutorials/aperture',
          description: '几何、蒙版和图层在处理流程中的先后顺序。',
        },
      ],
      embed: {
        title: '修正照片透视',
        description: '拖入照片即可打开“几何”面板；按“拖动角点”，把线条摆正。',
      },
    },
    'remove-blemishes': {
      name: '去除瑕疵',
      h1: '在线去除照片中的瑕疵和斑点',
      tagline: '涂抹斑点，按“修复”，让我们GPU上的修复模型根据周围的皮肤将其填充。',
      metaTitle: '在线去除照片中的瑕疵和斑点：修复工具',
      metaDescription: '涂抹痘痘、灰尘斑点和多余的痕迹，按“修复”，由我们自己GPU上的修复模型填充。每按一次计一次AI任务，失败时退还，完整分辨率导出。',
      ogTitle: '在线去除照片中的瑕疵',
      ogDescription: '用画笔标记斑点，按一次“修复”，我们GPU上的LaMa修复模型就会根据周围内容填充每个斑点。非破坏性编辑，原始文件保持不变。',
      intro: 'Aperture的“修复”面板是本页唯一用到模型的工具：你用“污点画笔”涂抹每个斑点，按“修复”，涂抹出的蒙版连同当前图像会被发送到我们自己的GPU服务器，由LaMa修复模型根据周围内容重建被覆盖的像素。按一次（无论标记了多少斑点）计一次AI任务；任务失败会退还，而在已保存的项目中，对同一底图重复同一蒙版会直接从缓存返回，不计费。修复后的图像成为新的底图，之后的每个调整图层、蒙版和导出都从它开始，而你的原始文件从不会被修改。皮肤、传感器灰尘、背景布上的一根杂发和小标牌，修复方式都一样。',
      whatItDoes: [
        '用硬度80的画笔以任意大小涂抹斑点蒙版；点按和短笔触都可以，按“修复”之前，可以用“清除斑点”清空蒙版。',
        '把蒙版和当前图像发送到我们的GPU，LaMa修复模型根据周围纹理填充每个蒙版区域，所有标记的斑点在一个任务中完成。',
        '无论标记了多少斑点，每按一次“修复”计一次AI任务；任务失败时退还，在已保存的项目中重复完全相同的修复，会免费返回缓存结果。',
        '让修复结果成为整个图层堆叠的新底图，之后应用的锐化、颜色和蒙版看到的都是干净的皮肤，“历史记录”面板也能退回到修复之前。',
        '原始文件保持不变：导出时以完整分辨率渲染修复后的底图，写出一个文件名带(retouched)后缀的新文件。',
      ],
      flowSteps: [
        {
          title: '拖入照片',
          description: '“修复”面板打开，“污点画笔”已激活。放大画面，让每个瑕疵在屏幕上都有几十个像素宽。',
        },
        {
          title: '标记斑点',
          description: '用比斑点略大的画笔点按或拖过每个瑕疵。面板会随时统计“已标记斑点”。',
        },
        {
          title: '按“修复”',
          description: '蒙版随图像一起上传，任务在我们的GPU上运行，最多可能需要一分钟。返回后，“已应用修复”的计数会增加。',
        },
        {
          title: '继续编辑并导出',
          description: '如有需要，可以再修复几遍，然后调整影调、锐化并导出。用撤销或“历史记录”面板即可撤回一次修复。',
        },
      ],
      advancedDetails: [
        '画笔在你所看到的、经过几何校正的空间中绘制栅格，并把每一笔经由裁剪、透视、翻转和旋转映射回源像素坐标，因此即使照片已经拉直和裁剪，蒙版也能与底图像素对齐。每一笔都以硬度80、流量100盖印；上传的蒙版在Alpha大于0.05处为白色，其余为黑色，尺寸与当前底图相同。',
        '按一次“修复”就是一个任务：在已保存的项目中，它是携带蒙版和当前底图哈希的POST /api/photo/projects/:id/heal；未登录时，则是无状态的/api/photo/heal路由，照片和蒙版只为这个任务上传。服务器在当前底图上运行LaMa模型，把结果存为新的底图，其名称是上一个底图哈希与蒙版摘要的SHA-256，因此同一底图上的同一蒙版会被识别出来，并从缓存返回，不再消耗AI任务。',
        '文档把每次修复记录为一个条目，包含蒙版引用和新底图引用；每个渲染器，包括WebGL预览、服务器导出和批量应用，都从最新的底图而不是原图开始。在历史记录中删除该条目，就会恢复上一个底图。',
        '红眼是单独的面板：点击一只眼睛，会放置一个小圆形蒙版（默认半径为长边的2%），蒙版内的红色通道被替换为min(r, (g + b)/2)，因此(200, 40, 40)的瞳孔会变成(40, 40, 40)。这是普通的逐像素颜色运算，不消耗AI任务。',
        '除修复本身之外，其余一切都遵循Aperture的一致性策略：预览在你的GPU上（WebGL2）基于1920 px的副本绘制，导出文件在我们的服务器上用相同公式从原图（这里是修复后的底图）以完整分辨率渲染，两者在有文档说明的小容差内保持一致，最多相差几个8位色阶，颗粒则完全一致。修复后的像素本身只在服务器上生成一次，预览显示的是同一结果的代理图。',
      ],
      whyItMatters: [
        '内容修复会用邻近区域中合理的纹理填补斑点，在皮肤和织物上显得自然，而模糊或仿制图章往往会留下一块发虚的痕迹。',
        '先标记好许多斑点再按一次，成本只有一次AI任务，也只需等待一次。',
        '由于修复成为一张底图而不是破坏性编辑，按错了只需撤销一步，原始文件也完好无损。',
      ],
      useCases: [
        {
          title: '人像皮肤清理',
          description: '用大约为斑点1.5倍大小的画笔标记痘痘、小疤痕和杂发，整张脸只需按一次“修复”。',
        },
        {
          title: '天空中的传感器灰尘',
          description: '放大到100%，在每个灰尘阴影上点一下，修复一次，平滑的天空渐变就会重建，不会出现色带。',
        },
        {
          title: '产品照片',
          description: '抠出主体之前，先去掉背景布上的绒毛和指纹，让边缘干净。',
        },
        {
          title: '扫描的照片',
          description: '涂抹扫描玻璃留下的划痕和斑点；只要画笔覆盖细线时留出一点余量，细线也能修复得很好。',
        },
      ],
      workedExamples: [
        {
          title: '头像照，6000 x 4000，24 MP，10.8 MB JPG，未登录',
          body: '用40 px画笔标记7个瑕疵，用12 px笔触标记2根杂发，然后按一次“修复”：1次AI任务，照片和蒙版只为这个任务上传，不到一分钟就返回。在本次会话余下的时间里，修复后的底图取代原图。按访客的12 MP上限导出为质量92的JPG，约5.4 MB，1次常规任务。不改蒙版再按一次“修复”，作为访客会重新运行任务；在已保存的项目中，同样的操作会免费命中缓存。',
        },
        {
          title: '带传感器灰尘的天空，4032 x 3024，12.2 MP，Premium账号',
          body: '第1遍：在100%缩放下点出11个灰尘阴影，按“修复”，1次AI任务。第2遍：把“曝光度”降低0.5 EV后又发现3个，再按“修复”，在新底图上消耗第二次AI任务。撤销第2遍后，用完全相同的3点蒙版再按“修复”，会从缓存返回，不计费。以完整的12.2 MP导出为质量90的WebP，约3.7 MB，1次常规任务。',
        },
      ],
      whenNotToUse: '“修复”适用于斑点和小痕迹，而不是移除整个人或大型物体：蒙版覆盖的面积太大，模型能参考的上下文就太少，填充会变得模糊或重复；Media Manipulator上专门的“移除照片中的物体”工具才是为这类工作打造的。不要用它来整体平滑皮肤纹理；请使用降噪或负值的“纹理”，它们免费且可逆。图案明显的大片皮肤（如雀斑）修复效果不均匀，因此只标记瑕疵本身，并留一点余量。',
      whyMediaManipulator: [
        'Aperture在我们自己运营的硬件上运行修复模型，你的照片从不会交给外部AI服务商。',
        '修复失败会退还，重复完全相同的修复是免费的，所以反复试验蒙版不会白白消耗额度。',
        '修复后的底图进入与其他所有调整相同的非破坏性堆叠，支持历史记录、蒙版和完整分辨率导出。',
      ],
      privacyNote: '“修复”是本页唯一会在导出前离开浏览器的步骤：按下“修复”时，当前图像和涂抹出的蒙版会被上传，LaMa模型在我们自己的GPU上运行。未登录时，这次上传只为该任务存在，并像任何访客任务一样保存；项目本身留在此浏览器中。登录后，修复后的底图按你的保留设置与项目一起存储，并随项目一起删除。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。不涉及任何第三方AI服务。',
      faq: [
        {
          question: '每个斑点都单独计一次AI任务吗？',
          answer: '不是。无论你涂了多少斑点，按一次“修复”就是一次AI任务，所以面板会统计斑点数，让你先把所有斑点都标记好。',
        },
        {
          question: '修复失败会怎样？',
          answer: '照片不会有任何变化，面板会提示修复未完成，AI任务也会退还。你可以用同一个蒙版再按一次“修复”。',
        },
        {
          question: '照片已经拉直或裁剪过，还能修复瑕疵吗？',
          answer: '可以。笔触画在校正后的视图上，再经由几何变换映射回源坐标，所以蒙版会落在底图的正确像素上。',
        },
        {
          question: '修复会改动原始文件吗？',
          answer: '绝不会。结果作为新的底图存储在项目内，导出时写出一个带(retouched)后缀的独立文件。在历史记录中删除这次修复，就会回到上一个底图。',
        },
        {
          question: '画笔应该多大？',
          answer: '比斑点略大，留出几个像素的余量，这样模型就不会采样到瑕疵本身的边缘。在有纹理的区域，过大的蒙版要多费些工夫才能显得自然。',
        },
        {
          question: '去红眼属于“修复”吗？',
          answer: '它有自己的面板，也不需要AI。点击眼睛会放置一个小圆形蒙版，并在蒙版内把红色值设为它本身与绿、蓝平均值中较小的那个。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '修复蒙版必须与当前底图尺寸一致；编辑器会自动按该尺寸生成。',
          '每按一次“修复”计一次AI任务；导出计为常规任务。每日额度见价格页面。',
        ],
      },
      related: [
        {
          label: '锐化照片',
          to: '/tools/sharpen-photo-online',
          description: '先修复再锐化，免得斑点先被强调出来。',
        },
        {
          label: '降低图片噪点',
          to: '/tools/reduce-image-noise',
          description: '斑点去除后，再平滑皮肤上的颗粒。',
        },
        {
          label: '按颜色选择',
          to: '/tools/select-by-color',
          description: '修复完瑕疵后，在颜色范围选区上均匀肤色。',
        },
        {
          label: '移除图片背景',
          to: '/tools/remove-background-from-image',
          description: '背景布清理干净后，再抠出主体。',
        },
        {
          label: '移除图片中的EXIF元数据',
          to: '/tools/remove-exif-metadata',
          description: '分享修好的人像之前，先移除位置数据。',
        },
        {
          label: '编辑器指南',
          to: '/tutorials/aperture',
          description: '修复、历史记录和底图，与编辑器的其他功能一并讲解。',
        },
      ],
      embed: {
        title: '去除瑕疵和斑点',
        description: '拖入照片即可打开“修复”面板；涂抹每个斑点，然后按一次“修复”。',
      },
    },
    'select-by-color': {
      name: '按颜色选择',
      h1: '在线按颜色选择照片区域',
      tagline: '用吸管拾取颜色，用颜色容差扩大范围，并只调整该选区。',
      metaTitle: '在线按颜色选择照片：颜色范围蒙版',
      metaDescription: '在浏览器中创建颜色范围蒙版：吸管、按住Shift点击最多添加8种颜色、以Lab色差度量的颜色容差、羽化和反相，然后只调整选区。',
      ogTitle: '在线按颜色选择照片区域',
      ogDescription: '颜色范围蒙版，用法类似桌面软件的“色彩范围”命令：吸管、最多8种取样颜色、基于Lab距离的颜色容差、羽化、反相和叠加视图。然后只调整你选中的部分。',
      intro: '“颜色范围”是Aperture“蒙版”面板中的六种蒙版之一，也是按颜色选择的方法：给任意调整图层添加蒙版，加入一个“颜色范围”组件，用吸管点击照片中的某种颜色，颜色与之接近的每个像素都会被选中。接近程度以像素与所取颜色之间的CIE Lab距离来衡量，“颜色容差”决定这个距离能延伸多远。按住Shift点击可以添加更多取样颜色，最多8种，选区取其中最强的匹配。“羽化”柔化边缘，“反相”翻转选区，“蒙版强度”缩放选区强度，“蒙版视图”可以把它显示为红色叠加，或单独显示。蒙版根据源照片计算并即时预览；导出时在原图上渲染相同的蒙版。',
      whatItDoes: [
        '用吸管从照片中取色，并按像素与它的Lab色差来选择，衡量的是颜色看起来差多少，而不是RGB数值差多少。',
        '按住Shift点击可添加最多8种目标颜色，取所有目标中的最大权重，因此有两种蓝色的天空，或兼有高光和阴影的夹克，都能作为一个整体选中。',
        '用“颜色容差”（0到100）调节选择半径，对应0到60的Lab距离，并在半径外侧的一半范围内平滑衰减。',
        '通过“添加”“减去”或“相交”与其他蒙版组件组合，再对合并结果应用“蒙版羽化”“反相”和“蒙版强度”。',
        '可驱动任何调整：调整曝光、影调和饱和度的“局部调整”，用于色相偏移的HSL图层，以及仅作用于选区的“色阶”“曲线”或黑白转换。',
      ],
      flowSteps: [
        {
          title: '拖入照片并选择调整',
          description: '“蒙版”面板打开。添加一个“局部调整”，或选中现有图层并为它添加蒙版。',
        },
        {
          title: '添加“颜色范围”并点击',
          description: '选择“颜色范围”，按“拾取颜色”，再点击你想要的颜色。按住Shift点击最多可添加8种颜色。',
        },
        {
          title: '调节颜色容差并查看蒙版',
          description: '把“蒙版视图”切换为“叠加”，提高“颜色容差”，直到整个区域都变红；如果选区溢出，就添加一个“减去”组件。',
        },
        {
          title: '调整并导出',
          description: '设置图层的滑块，只有选区会改变。导出为JPG、PNG、WebP、AVIF或TIFF，均从原图渲染。',
        },
      ],
      advancedDetails: [
        '每个目标颜色和每个源像素都从sRGB转换到CIE Lab（D65，标准矩阵，带216/24389线性段）。距离采用Delta E 76，即L、a、b上的欧几里得距离。设“颜色容差”为f，半径R = f/100 × 60个Lab单位，权重为1 - smoothstep(0.5 R, R, Delta E)：半径一半以内完全选中，到半径处以三次曲线淡出为零。有多个目标时，像素取最大权重；没有目标时，该组件为0。',
        '以sRGB (92, 150, 214)、即Lab (60.7, -0.2, -38.4)取样的天空，在颜色容差20（R = 12）时，会以0.91的权重选中同一片天空中较亮的区域(110, 165, 222)，其Delta E为7.1；而Delta E为15.6的较深蓝色(60, 120, 200)则被完全排除。颜色容差为40（R = 24）时，较深的蓝色以0.78的权重被纳入，而Delta E为49.8的云(235, 238, 240)和Delta E为83.8的树叶绿色，即使在颜色容差60时也仍为0。',
        '组件从左到右依次合并：“添加”为max(m, value)，“减去”为min(m, 1 - value)，“相交”为min(m, value)。合并后的蒙版再做高斯模糊，sigma为feather/100 × 0.05 × 长边（6000 px的照片在蒙版羽化为10时为30 px），开启“反相”时再反转，然后乘以“蒙版强度”，限定在0..1之间。图层输出为lerp(input, adjusted, mask)。',
        '颜色范围读取的是经过几何校正的源照片，而不是前面图层的输出，所以编辑下方的图层时选区不会改变，同样的取样颜色在预览和服务器渲染中选中的像素也相同。',
        'Aperture的预览在你的GPU上（WebGL2）基于1920 px的副本绘制，导出文件在我们的服务器上用相同公式从原图以完整分辨率渲染，两者在有文档说明的小容差内保持一致：颜色操作（例如此蒙版下的调整）的平均误差不超过一个8位色阶，第99百分位为2，最大为4，颗粒则逐位一致。',
      ],
      whyItMatters: [
        '按感知色差选择，可以把整片天空或整件衣服连同其中较亮和较暗的部分一起选中，而RGB容差遇到第一处明暗变化就会停下。',
        '它以蒙版而不是一次性选区的形式工作，因此应用调整之后仍可细化选区，还能给其他图层复用。',
        '叠加视图让溢出一目了然，你在确定之前就能看到，不必从结果去猜。',
      ],
      useCases: [
        {
          title: '加深天空而不影响云',
          description: '取样蓝色，颜色容差35，然后用“局部调整”设置曝光度-0.4、饱和度+15；Delta E接近50的云不会被选中。',
        },
        {
          title: '更改产品颜色',
          description: '取样衬衫，按住Shift点击它的阴影和高光，然后用一个偏移了色相的HSL图层；背景不受影响。',
        },
        {
          title: '均匀肤色',
          description: '以颜色容差25、蒙版羽化6取样中等肤色，然后在选区上略微降低饱和度、提亮阴影。',
        },
        {
          title: '除一种颜色外全部变灰',
          description: '选中该颜色，反相蒙版，再添加一个使用该蒙版的“黑白”图层，只有所选颜色保留下来。',
        },
      ],
      workedExamples: [
        {
          title: '加深天空，6000 x 4000风景照，24 MP，10.4 MB JPG',
          body: '取样天空(92, 150, 214)，颜色容差40，R = 24个Lab单位。Delta E为7.1的较亮区域权重为1.0，Delta E为15.6的较深蓝色为0.78，Delta E为49.8的云为0。蒙版羽化5在6000 px的边上相当于15 px的高斯模糊。使用曝光度-0.5 EV的“局部调整”，把完全选中的天空从(92, 150, 214)压暗到(78, 128, 183)，权重0.78的较深蓝色得到这一变化的78%。以访客身份按12 MP导出质量92的JPG，约为5.4 MB。',
        },
        {
          title: '为夹克重新着色，4000 x 6000竖幅，24 MP，Pro账号',
          body: '按住Shift点击取三个样：受光的红色(190, 40, 50)、阴影(120, 20, 30)和高光(230, 110, 115)，颜色容差30，R = 18。蒙版取三者中的最大权重，因此整件夹克读数为1.0，而(214, 170, 140)的皮肤与最近的取样点相差Delta E 37，保持为0。(200, 90, 100)的嘴唇与高光取样仅差Delta E 9.6，会被选进来，所以在嘴部添加一个“减去”画笔组件把它去掉。随后，带此蒙版的HSL图层把红色的色相偏移+150度，夹克变成青绿色。以完整的24 MP导出为PNG约60 MB，导出为AVIF约4.8 MB。',
        },
      ],
      whenNotToUse: '如果主体与背景颜色相同，例如草地上穿绿衬衫的人，颜色范围选择就不是合适的工具；请改用“选择主体”（AI蒙版）或画笔。它在灰度或饱和度很低的照片上也很吃力，因为每个像素与其他像素都只相差几个Lab单位，颜色容差无法把它们区分开；这时用“明亮度范围”蒙版效果更好。如果你想在整张照片中统一偏移某一种色相，“更改物体颜色”页面上的HSL范围不用任何蒙版就能做到。',
      whyMediaManipulator: [
        '蒙版是有文档说明的Lab距离，半径和衰减方式都明确给出，所以同样的颜色容差在下一张照片上意味着同样的选区。',
        '颜色范围蒙版的计算免费，并在你的GPU上实时预览；只有主体蒙版会消耗AI任务。',
        '蒙版可以在图层之间共享，并与渐变、画笔和明亮度范围在同一个堆叠中组合，再以完整分辨率导出。',
      ],
      privacyNote: '颜色范围蒙版在Lab空间中根据你自己的像素计算，不需要调用服务器。未登录时，照片、取样颜色和所有蒙版都留在此浏览器中；导出时，文件才会以访客任务的形式上传，仅用于那一次渲染。登录后，原图及其1920 px预览和缩略图按你的保留设置与项目一起存储，并随项目一起删除。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。不会向任何第三方发送任何内容。',
      faq: [
        {
          question: '颜色容差是如何衡量的？',
          answer: '以CIE Lab的Delta E 76距离衡量。颜色容差100对应60个Lab单位的半径；半径一半以内的像素被完全选中，选区按smoothstep曲线在完整半径处淡出为零。',
        },
        {
          question: '一个选区最多能取样几种颜色？',
          answer: '每个“颜色范围”组件最多8种，按住Shift点击添加。每个像素取其中最强的匹配；如果需要更多，可以再添加一个组件。',
        },
        {
          question: '可以去掉选区的一部分吗？',
          answer: '可以。以“减去”模式添加另一个组件，例如在溢出处涂一个画笔，或在不想要的颜色上再取样一个颜色范围，它会按min(m, 1 - value)被去除。',
        },
        {
          question: '为什么选区会包含亮度不同的阴影？',
          answer: 'Lab距离既计算色相也计算明度，所以色相相同、L暗20个单位的阴影，距离约为Delta E 20。可以降低颜色容差，或与“明亮度范围”相交来限制亮度。',
        },
        {
          question: '可以单独查看蒙版吗？',
          answer: '把“蒙版视图”设为“仅蒙版”可看到灰度视图，设为“叠加”则以红色叠加在照片上显示。选中蒙版时，按M键可以循环切换各种视图。',
        },
        {
          question: '编辑其他图层时选区会变吗？',
          answer: '不会。“颜色范围”读取的是几何变换之后的源照片，从不读取下方图层的输出，所以在下面调整曝光不会让蒙版移动。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '蒙版是参数化的（取样颜色、颜色容差、羽化），导出时会在原图上重新渲染，因此不占用项目体积。',
          '高度压缩的JPG色度呈块状，可能让选区边缘参差不齐；加一点蒙版羽化就能掩盖。',
        ],
      },
      related: [
        {
          label: '更改物体颜色',
          to: '/tools/change-image-color',
          description: '按颜色范围调整色相、饱和度和明度，可带蒙版，也可不带。',
        },
        {
          label: '色彩突出',
          to: '/tools/color-pop',
          description: '用内置风格保留一种颜色，其余变灰。',
        },
        {
          label: '图片饱和度',
          to: '/tools/image-saturation',
          description: '自然饱和度和饱和度，可以只作用于选区。',
        },
        {
          label: '移除图片背景',
          to: '/tools/remove-background-from-image',
          description: '要抠出主体，AI主体蒙版比按颜色选择更好用。',
        },
        {
          label: '去除瑕疵',
          to: '/tools/remove-blemishes',
          description: '先修复斑点，再均匀肤色选区。',
        },
        {
          label: '编辑器指南',
          to: '/tutorials/aperture',
          description: '全部六种蒙版及其组合方式。',
        },
      ],
      embed: {
        title: '按颜色选择',
        description: '拖入照片即可打开“蒙版”面板；添加“颜色范围”，点击一种颜色，然后只调整选区。',
      },
    },
  },
} as const;

export default zhCnToolPages;
