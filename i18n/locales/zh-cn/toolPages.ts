/**
 * Simplified Chinese partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope (MM60, 2026-10-27): only the Motion tool page body, which
 * `i18n/motionTranslations.test.ts` (MM48) requires for every translated
 * locale. The other ~65 tool pages render English until a later session
 * extends this file slug by slug, as the other locales do.
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
      tagline: '绘制或导入SVG，在关键帧时间线上制作动画，然后导出动画SVG、Lottie、React、JavaScript、Flutter或GIF，全部在你的浏览器中完成。',
      intro: 'Motion是内置于Media Manipulator的带动画时间线的SVG编辑器。打开一个SVG文件（或Lottie动画），每个形状都会变成一个可以选择、移动、改色和制作动画的图层；也可以从空白画布开始，用矩形、椭圆、直线、钢笔和文本工具绘制。每个动画属性都有自己的关键帧轨道，配有缓动预设、用于自定义缓动的曲线编辑器，以及用于瞬间跳变的保持关键帧。一键动画器可添加描边绘制、沿路径运动、形状变形、渐变颜色变化、蒙版动画和模糊。当它按你想要的方式运动时，将其导出为动画SVG、Lottie文件、React组件、JavaScript或TypeScript模块、Flutter组件或GIF。编辑和每一次导出都在你的浏览器中运行，因此你的作品绝不会为了导出而被上传。',
      whatItDoes: [
        '将SVG文件导入为可编辑的图层树（组、路径、形状、文本、图片、渐变、蒙版和剪切路径），并连同关键帧一起导入Lottie JSON动画。',
        '用矩形、椭圆、直线、钢笔（贝塞尔）和文本工具绘制新作品，并直接在画布上编辑路径节点。',
        '在关键帧时间线上为位置、缩放、旋转、倾斜、不透明度、填充、描边和描边宽度制作动画，支持线性、缓入、缓出、缓入缓出、自定义三次贝塞尔和保持缓动。',
        '一键添加高级动画：描边绘制、带可选自动旋转的沿路径运动、形状变形、渐变色标颜色、蒙版和剪切路径动画，以及模糊。',
        '导出静态SVG（始终免费）、无需任何库即可播放的动画SVG、Lottie JSON、React组件、JavaScript或TypeScript模块、Flutter组件和动态GIF。',
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
        '只要每种效果都能在Chrome、Firefox和Safari中用CSS表达，动画SVG导出就会使用纯CSS关键帧。形状变形、移动的渐变色标和模糊需要一个小脚本，因此这些文件会嵌入一份精简的anime.js（MIT许可证，压缩后约14 KB），并在顶部附带其许可声明。',
        '形状变形会将两个形状归一化为相同数量的曲线段，并对齐它们的起点和绕向，因此变形不会扭曲。无法匹配的两个形状会保持而不是变形。',
        'Lottie写入器以Lottie 1.0.1规范和LottieFiles的“Basic”功能集为目标。Lottie无法承载的任何内容（如滤镜、文本或高级蒙版）会在下载后列出；不会有任何内容被静默丢弃。',
        'GIF导出使用专为Media Manipulator编写的编码器，用整个动画的帧构建单一全局调色板，因此平面矢量图能保持精确的颜色。',
        '导入的SVG会在导入时被清理：脚本、事件处理程序、外部引用和其他不安全内容会被移除，编辑器会从允许列表重建不支持的标记，而不是将其作为HTML插入。',
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
      whyMediaManipulator: [
        '一个真正的图层与关键帧编辑器，带有保持、自定义曲线和高级动画器，而不是模板画廊。',
        '同时面向设计师和开发者的导出：从一个项目导出动画SVG、Lottie、React、JavaScript或TypeScript、Flutter和GIF。',
        '导出在你的浏览器中生成，导出使用的唯一第三方代码都采用宽松许可（anime.js为MIT；Flutter使用flutter_svg和webview_flutter），其许可声明会保留在文件中。',
      ],
      privacyNote: '编辑和导出在你的浏览器中进行；你的作品不会为了导出而被上传。没有账号时，项目仅保存在此浏览器中。如果你登录并将项目保存到账号，它会像Darkroom项目一样存储在我们的服务器上，遵循你选择的保留期限，并且可以从账号页面删除。对于每次导出，我们只记录其格式、大小、长度和时间，用于执行每日额度。',
      faq: [
        {
          question: 'Motion是免费的吗？',
          answer: '是的。打开Motion、绘制、制作动画、保存和导出静态SVG都是免费且不限次数的，无需账号。动画导出计入取决于你套餐的每日额度；本页的套餐表格显示每个套餐的额度和格式。',
        },
        {
          question: '我可以导出哪些格式？',
          answer: '静态SVG、动画SVG（CSS，或在需要时使用小型内联脚本）、Lottie JSON、React组件（.tsx）、JavaScript或TypeScript模块、Flutter组件（.dart）和动态GIF。你的套餐包含其中哪些，以及每日导出次数，都显示在本页的套餐表格中。',
        },
        {
          question: '有什么限制？',
          answer: '动画导出按天计数，在UTC午夜重置。没有账号的访客只能将项目保存在浏览器中；已登录的套餐可以将一定数量的项目保存到账号。访客还有可导出动画的最大长度限制，GIF导出有尺寸和长度上限。所有当前数值都在本页的套餐表格和价格页面中。',
        },
        {
          question: '我可以为已有的SVG制作动画吗？',
          answer: '可以。导入任何SVG，它的组、路径、形状、文本、渐变、蒙版和剪切路径都会变成可编辑的图层。编辑器无法编辑的部分（如图案或复杂滤镜）会被保留并原样导出，任何不安全的内容（脚本或外部链接）会被移除并在导入后列出。',
        },
        {
          question: '支持Lottie吗？',
          answer: '支持，而且是双向的。你可以导入Lottie JSON文件进行编辑，也可以将你的动画导出为Lottie JSON，供lottie-web以及iOS、Android和Flutter的Lottie播放器使用。任何一方无法表示的功能会在对话框中列出，而不是被静默丢弃。',
        },
        {
          question: '哪些浏览器支持视频导出？',
          answer: 'GIF导出在所有现代浏览器中都可用。MP4和WebM导出依赖浏览器内置的视频编码器WebCodecs，它在Chrome和Edge中可用，在较新版本的Safari和Firefox中视编解码器而定；导出对话框会检查你的浏览器，并在无法编码时告知你。本页的套餐表格显示哪个套餐包含哪种视频格式。',
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
    },
    // 2026-10-28 catalog expansion: name + tagline for the /tools catalog cards (model-written, needs native review).
    'inspect-metadata': {
      name: '元数据检查器',
      tagline: '在分享之前，查看照片、视频、音频文件或PDF中隐藏的所有标签：EXIF、GPS位置、相机、编解码器、ID3、XMP等。',
    },
    'edit-image-metadata': {
      name: '编辑图片元数据',
      tagline: '设置照片的标题、作者、版权、关键词和描述，修改或删除其GPS位置，并重写EXIF和IPTC标签。',
    },
    'change-video-speed': {
      name: '更改视频速度',
      tagline: '以2倍、4倍或更快速度制作延时视频，或将片段减速到0.5倍或0.25倍，音频保持同步。',
    },
    'reverse-video': {
      name: '视频倒放',
      tagline: '倒着播放任意片段，可选择是否同时倒放音频，还可以做成先正放再倒放的往复效果。',
    },
    'flip-video': {
      name: '翻转与镜像视频',
      tagline: '一键将视频水平镜像，修正反向的摄像头或自拍画面，也可以垂直翻转。',
    },
    'stabilize-video': {
      name: '视频防抖',
      tagline: '用双通道防抖算法消除手持抖动和行走时的颠簸，无需三脚架，也无需桌面剪辑软件。',
    },
    'change-video-frame-rate': {
      name: '更改视频帧率',
      tagline: '将视频转换为24、25、30或60 fps，把60 fps的片段降到30 fps以减小文件体积，或匹配项目的帧率。',
    },
    'adjust-video-color': {
      name: '调整视频亮度与色彩',
      tagline: '提亮偏暗的片段，增加对比度和饱和度，调整色相，或应用模糊和艺术效果，带滑块和实时预览。',
    },
    'convert-video-to-hevc': {
      name: '将视频转换为HEVC（H.265）',
      tagline: '将任意视频重新编码为H.265，在相同画质下文件大小约为H.264的一半，适合存储、4K和新款设备。',
    },
    'convert-audio-to-wav': {
      name: '将音频转换为WAV',
      tagline: '将MP3、M4A、WAV、OGG、FLAC等任意音频文件无损转换为WAV。',
    },
    'convert-audio-to-flac': {
      name: '将音频转换为FLAC',
      tagline: '将MP3、M4A、WAV、OGG、FLAC等任意音频文件无损转换为FLAC。',
    },
    'convert-audio-to-ogg': {
      name: '将音频转换为OGG',
      tagline: '将MP3、M4A、WAV、OGG、FLAC等任意音频文件按你选择的比特率转换为OGG。',
    },
    'convert-audio-to-m4a': {
      name: '将音频转换为M4A / AAC',
      tagline: '将MP3、M4A、WAV、OGG、FLAC等任意音频文件按你选择的比特率转换为M4A / AAC。',
    },
    'convert-audio-to-opus': {
      name: '将音频转换为Opus',
      tagline: '将MP3、M4A、WAV、OGG、FLAC等任意音频文件按你选择的比特率转换为Opus。',
    },
    'convert-mp3-to-wav': {
      name: '将MP3转换为WAV',
      tagline: '将MP3转换为未压缩的WAV，用于编辑、采样或刻录CD。',
    },
    'change-audio-speed': {
      name: '更改音频速度',
      tagline: '把讲座或播客加速到1.5倍，或把歌曲或录音减速到0.75倍用于练习，音调保持不变。',
    },
    'change-audio-pitch': {
      name: '更改音频音高',
      tagline: '按半音移调，改变歌曲或录音的调性、降低人声或调整采样音高，节奏保持不变。',
    },
    'normalize-audio': {
      name: '音频标准化',
      tagline: '将音量偏小的录音提升到一致的响度，让播客、语音备忘录和混合播放列表以相同音量播放。',
    },
    'adjust-audio-volume': {
      name: '调整音频音量',
      tagline: '按固定幅度调大或调小音频音量，从10%到两倍，或用放大滑块按分贝调节。',
    },
    'audio-equalizer': {
      name: '音频均衡器',
      tagline: '应用低音增强、高音提升、人声突出或风格预设，或设置低通和高通滤波器，然后下载结果。',
    },
    'add-reverb-to-audio': {
      name: '为音频添加混响',
      tagline: '为干声人声或录音加上房间、大厅、板式或弹簧混响，或添加延迟或回声，然后下载结果。',
    },
    'trim-audio': {
      name: '裁剪音频',
      tagline: '将MP3、WAV或任意录音裁剪到指定的开始和结束时间，借助波形选择时间点，只下载需要的部分。',
    },
    'transcribe-audio': {
      name: '音频转文字',
      tagline: '在我们自己的GPU服务器上，用AI语音识别将MP3、WAV、M4A或任意录音转换为文本、字幕或JSON。',
    },
    'add-text-to-image': {
      name: '为图片添加文字',
      tagline: '在照片上添加说明、标题或水印：选择字体、大小、颜色、描边和位置，然后下载。',
    },
    'crop-image': {
      name: '裁剪图片',
      tagline: '在照片上拖出需要的区域，调整构图，并以任意格式只下载该区域。',
    },
    'grayscale-image': {
      name: '将图片转换为黑白',
      tagline: '将彩色照片转为灰度，或转为复古色调的棕褐色，并以任意格式下载。',
    },
    'image-filters': {
      name: '图片滤镜与特效',
      tagline: '油画、素描、炭笔、浮雕、复古、漩涡、模糊、锐化等效果，一键应用于任意照片。',
    },
    'rotate-image': {
      name: '旋转图片',
      tagline: '将照片旋转90°、180°或270°，修正横置的扫描件或手机照片，并以任意格式下载。',
    },
    'sharpen-image': {
      name: '锐化图片',
      tagline: '一键锐化，让略微模糊的照片或扫描件边缘更清晰，并以任意格式下载。',
    },
    'blur-image': {
      name: '模糊图片',
      tagline: '将整张照片柔化，用作背景、占位图或隐私遮挡，并以任意格式下载。',
    },
    'generate-vtt-captions': {
      name: 'VTT字幕生成器',
      tagline: '在我们自己的GPU服务器上，通过AI转录为HTML5视频、YouTube或播放器生成.vtt字幕文件。',
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
        '语音使用 Whisper 转录；画面帧在场景切换处挑选，数量不超过你的套餐上限（Free 24 帧，Premium 48 帧，Pro 96 帧），并由视觉模型分批描述。',
        '语言模型根据转录文本和画面帧笔记撰写摘要。Pro 账号可在可用时要求由更大的模型生成更深入的摘要。',
        '一次摘要计为每日额度中的 1 次 AI 任务；失败或被拒绝的任务不计入。',
        '转录文本由机器生成，人名和数字可能有误。摘要会在备注中说明这一点。',
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
        '支持下载 Markdown 和 JSON。访客的文件保留 24 小时；使用免费账号，你可以选择保留 24 小时到 2 年。',
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
          answer: '摘要将仅根据画面撰写，并在备注中说明。既没有画面也没有声音的文件会被拒绝，且不计入额度。',
        },
        {
          question: '我的视频会被发送给第三方吗？',
          answer: '不会。所有模型都运行在我们运营的 GPU 服务器上。',
        },
        {
          question: '这会占用我的额度吗？',
          answer: '会，计为 1 次 AI 任务。失败的任务不计入。',
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
          '计为 1 次 AI 任务；失败的任务不计入。',
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
        '带封面图的音频文件会按音频处理，图片会被忽略。',
        '一次摘要计为每日额度中的 1 次 AI 任务；失败或被拒绝的任务不计入。',
        '转录文本由机器生成，人名和数字可能有误。摘要会在备注中说明这一点。',
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
        '支持下载 Markdown 和 JSON。访客的文件保留 24 小时；使用免费账号，你可以选择保留 24 小时到 2 年。',
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
          answer: '会，计为 1 次 AI 任务。失败的任务不计入。',
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
          '计为 1 次 AI 任务；失败的任务不计入。',
        ],
      },
    },
    // MM78 voices: name + tagline (model-written, needs native review).
    'voice-cloning': {
      name: '声音克隆',
      tagline:
        '录制或上传 5 到 60 秒你自己的语音，创建一个声音，让它用 20 多种语言朗读任何文本。',
    },
    'voice-designer': {
      name: '声音设计器',
      tagline:
        '用文字描述一个声音，试听预览，并保留你喜欢的那个，让它用 20 多种语言朗读任何文本。',
    },
    'voice-changer': {
      name: '变声器',
      tagline:
        '即时调整录音的音高和特色，或使用AI将语音转换为已保存或预设的声音。',
    },
    // MM84: name / tagline / metaTitle / metaDescription for the copy-bar tool pages (model-written, needs native review).
    'content-studio': {
      name: 'Darkroom',
      tagline: '在多轨时间线上编辑、叠加和混合视频与音频，然后导出MP4。像Premiere Pro一样的编辑器，直接在浏览器中使用。',
      metaTitle: 'Darkroom：免费在线多轨视频编辑器 | Media Manipulator',
      metaDescription: '在多轨时间线上编辑、叠加和混合视频与音频，然后导出MP4。一款在浏览器中运行的免费Premiere Pro风格视频编辑器，无需注册，无需安装。',
    },
    'remove-exif-metadata': {
      name: '移除图片中的EXIF元数据',
      tagline: '在分享照片之前，清除其中的GPS位置、设备、相机和时间戳数据。',
      metaTitle: '在线移除图片EXIF元数据（免费） | Media Manipulator',
      metaDescription: '免费在线工具，可移除JPG、PNG、WebP和HEIC图片中的EXIF、GPS、IPTC和相机元数据。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
    },
    'compress-image': {
      name: '压缩图片',
      tagline: '缩小JPG、PNG和WebP文件体积，让网站更快、上传更小、分享更轻松。',
      metaTitle: '在线免费压缩图片 | Media Manipulator',
      metaDescription: '免费在线图片压缩工具。在保持良好画质的同时缩小JPG、PNG和WebP文件体积。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
    },
    'image-resizer': {
      name: '图片尺寸调整',
      tagline: '将JPG、PNG、WebP和GIF图片调整为精确的像素尺寸，同时保持宽高比。',
      metaTitle: '在线免费调整图片尺寸 | Media Manipulator',
      metaDescription: '免费在线图片尺寸调整工具。将JPG、PNG、WebP和GIF图片调整为精确的像素尺寸，同时保持宽高比。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
    },
    'remove-background-from-image': {
      name: '移除图片背景',
      tagline: '自动擦除任意照片的背景，下载干净的透明PNG抠图。',
      metaTitle: '在线免费移除图片背景 | Media Manipulator',
      metaDescription: '免费在线背景移除工具。自动擦除任意照片的背景，下载透明PNG。运行在我们自己的GPU上，不使用第三方AI。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
    },
    'image-to-pdf': {
      name: '图片转PDF',
      tagline: '一键将JPG、PNG等图片变成整洁、便于分享的PDF文档。',
      metaTitle: '在线免费将图片转换为PDF | Media Manipulator',
      metaDescription: '免费在线图片转PDF工具。将JPG、PNG等图片变成整洁的PDF文档。无需注册，无水印。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
    },
    'pdf-to-jpg': {
      name: 'PDF转JPG',
      tagline: '将PDF的每一页渲染为高质量JPG图片，方便分享、编辑或发布。',
      metaTitle: '在线免费将PDF转换为JPG | Media Manipulator',
      metaDescription: '免费在线PDF转JPG工具。将PDF的每一页渲染为高质量JPG图片，并以ZIP下载。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
    },
    'compress-video': {
      name: '压缩视频',
      tagline: '缩小MP4、WebM、MOV、MKV和AVI文件体积，适用于网页、电子邮件、社交媒体和云端上传。',
      metaTitle: '在线压缩视频（免费） | Media Manipulator',
      metaDescription: '免费在线视频压缩工具。在保持良好画质的同时缩小MP4、WebM、MOV、MKV和AVI文件体积。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
    },
    'video-trimmer': {
      name: '视频剪辑',
      tagline: '通过快速且保持画质的裁剪，把片段剪成你想要的部分，尽可能不重新编码。',
      metaTitle: '在线免费裁剪视频 | Media Manipulator',
      metaDescription: '免费在线视频裁剪工具。设置开始和结束时间，通过快速无损的裁剪剪出片段。输出MP4，无水印，无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
    },
    'extract-audio-from-video': {
      name: '从视频中提取音频',
      tagline: '将任意视频的音轨保存为干净的MP3、WAV、M4A、AAC、FLAC或OGG文件。',
      metaTitle: '从视频中提取音频：MP3、WAV、M4A等 | Media Manipulator',
      metaDescription: '免费在线工具，可从任意视频文件（MP4、MOV、MKV、WebM、AVI）中提取音频。可输出MP3、WAV、M4A、AAC、FLAC或OGG。无需注册。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
    },
    'convert-video-to-animated-gif': {
      name: '将视频转换为动态GIF',
      tagline: '几秒钟内把短小的MP4、WebM、MOV或MKV片段变成便于分享的动态GIF。',
      metaTitle: '在线将视频转换为动态GIF（免费） | Media Manipulator',
      metaDescription: '免费在线视频转GIF工具。将短小的MP4、WebM、MOV和MKV片段变成动态GIF，并可控制尺寸和帧率。',
    },
    'transcribe-video': {
      name: '视频转录',
      tagline: '把视频或音频文件中的语音提取为WebVTT或SRT字幕、纯文本或带时间戳的JSON。',
      metaTitle: '在线将视频转录为文字（免费） | Media Manipulator',
      metaDescription: '免费在线视频转录工具。将MP4、MOV、WebM、MKV和音频文件转换为可搜索的文本、VTT字幕或JSON转录稿。',
    },
    'transcode-to-hls': {
      name: '将视频转码为HLS',
      tagline: '把任意视频打包成Apple HLS VOD包：master.m3u8和按清晰度划分的.ts分片，可直接用于网页。',
      metaTitle: '在线将视频转码为HLS | 免费自适应流媒体工具',
      metaDescription: '免费在线HLS转码工具。将MP4、MOV、WebM、MKV转换为包含360p/480p/720p清晰度的HLS VOD包，可选字幕和故事板。',
    },
    'ai-video-restoration': {
      name: 'AI视频修复',
      tagline: '使用最多六种AI模型（Real-ESRGAN、SwinIR、HAT、BasicVSR++、RVRT和VRT）放大并修复短视频片段，并将所有结果并排对比。',
      metaTitle: 'AI视频修复工具：在线对比6种放大模型 | Media Manipulator',
      metaDescription: '免费AI视频修复工具。让短片段在我们自己的GPU上通过Real-ESRGAN、SwinIR、HAT、BasicVSR++、RVRT和VRT超分辨率模型处理，并将所有结果打包下载。',
    },
    'ai-image-restoration': {
      name: 'AI图片修复与放大',
      tagline: '使用最多八种AI模型清理、放大并修复照片：保真预清理（FBCNN、SCUNet、NAFNet）、通用放大器（Real-ESRGAN、SwinIR、HAT）以及人脸增强（GFPGAN、CodeFormer），并将每个结果与原图对比。',
      metaTitle: 'AI图片修复与放大器：在线对比8种模型 | Media Manipulator',
      metaDescription: '免费AI照片修复与放大。去除JPEG伪影、降噪并去模糊，然后用Real-ESRGAN、SwinIR或HAT放大到4K/8K，再用GFPGAN/CodeFormer增强人脸，全部在我们自己的GPU上完成，并可并排对比。',
    },
    'ai-document-scan': {
      name: 'AI文档扫描',
      tagline: '将扫描文档和手写笔记变成可搜索的多页PDF和可编辑的Word文档：印刷页面会获得忠实的Tesseract文字层，手写内容由视觉AI转录，并标出不确定之处，绝不凭空编造。',
      metaTitle: 'AI文档扫描：将扫描页面和手写内容转为PDF/Word | Media Manipulator',
      metaDescription: '免费AI文档扫描：将扫描图片转换为可搜索的PDF和图片转Word OCR，并将手写笔记转录为文字。可调整页面顺序，印刷体与手写混合也没问题，全部在我们自己的GPU上完成，忠实原文并标出不确定之处。',
    },
    'ai-image-upscaler': {
      name: 'AI图片放大器',
      tagline: '使用Real-ESRGAN模型放大较小或模糊的照片，它会重建细节，而不是简单地拉伸像素。',
      metaTitle: 'AI图片放大器：将照片放大2倍或4倍 | Media Manipulator',
      metaDescription: '用能还原边缘和纹理的AI将低分辨率照片放大2倍或4倍。运行在我们自己的GPU上，输出PNG。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
    },
    'blur-faces-in-photo': {
      name: '模糊照片中的人脸',
      tagline: '自动检测人脸，然后对全部人脸或你选择的人脸进行模糊、马赛克或涂黑。',
      metaTitle: '在线模糊照片中的人脸 | Media Manipulator',
      metaDescription: '对照片中的人脸进行模糊、马赛克或涂黑。检测每一张人脸，再选择要隐藏的人脸。AI运行在我们自己的GPU上。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
    },
    'redact-text-in-image': {
      name: '遮盖图片中的文字',
      tagline: '在截图或照片中找出可读文字，并用模糊或黑色方框遮盖个人信息或全部文字。',
      metaTitle: '在线遮盖图片中的文字 | Media Manipulator',
      metaDescription: '自动找出图片中的文字，并将姓名、电子邮箱、号码等个人数据涂黑或模糊。AI运行在我们自己的GPU上。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
    },
    'remove-object-from-photo': {
      name: '移除照片中的物体',
      tagline: '在不想出现在画面中的物体周围画一个框，修复模型就会用匹配的背景填补空缺。',
      metaTitle: '在线移除照片中的物体 | Media Manipulator',
      metaDescription: '擦除照片中不需要的物体。画一个矩形，AI修复会按背景填补空白。运行在我们自己的GPU上。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
    },
    'clean-voice-audio': {
      name: '人声音频降噪',
      tagline: '减少播客、访谈和语音备忘录中的嘶嘶声、房间底噪和低频隆隆声，让语音更清晰。',
      metaTitle: '用AI清理人声录音 | Media Manipulator',
      metaDescription: '用AI清理人声录音。减少嘶嘶声、嗡嗡声和房间噪声，让语音更容易听清。运行在我们自己的GPU上。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
    },
    'remove-background-noise': {
      name: '去除背景噪音',
      tagline: '用AI降噪器降低录音中的嘶嘶声、嗡嗡声、交通声和房间噪音，让主要声音更突出。',
      metaTitle: '在线去除音频背景噪音 | Media Manipulator',
      metaDescription: '去除音频中的背景噪音。AI降噪器会降低录音中的嘶嘶声、嗡嗡声和环境声。运行在我们自己的GPU上。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
    },
    'remove-vocals-from-song': {
      name: '去除歌曲人声',
      tagline: '去掉音轨中的歌声并保留音乐，用于卡拉OK、练习和伴奏。请仅用于你拥有权利的音乐。',
      metaTitle: '去除歌曲人声：卡拉OK制作器 | Media Manipulator',
      metaDescription: '用AI去除歌曲中的人声，并以与原文件相同的格式或FLAC、WAV下载伴奏。在我们自己的GPU上制作卡拉OK和练习音轨。访客的文件保留24小时；注册免费账号后，你可以选择保留24小时至2年。',
    },

    // 2026-10-31 (MM92): name + tagline for every remaining tool, so the /tools catalog
    // and the home grid never show an English card in this locale. Model-written; native review pending.
    'transcode-to-dash': {
      name: '将视频转码为DASH（AV1 / VP9）',
      tagline: '把任意视频打包成MPEG-DASH包：manifest.mpd，以及按清晰度划分的初始化分片和媒体分片。',
    },
    'convert-webp-to-jpg': {
      name: '将WebP转换为JPG',
      tagline: '把WebP图片转为兼容性极佳的JPG文件，在任何看图软件或编辑器中都能打开。',
    },
    'convert-png-to-jpg': {
      name: '将PNG转换为JPG',
      tagline: '几秒钟内把体积庞大的PNG截图和图形变成小巧、通用的JPG图片。',
    },
    'convert-jpg-to-png': {
      name: '将JPG转换为PNG',
      tagline: '把JPG照片转为无损PNG文件，适合编辑、透明处理和高质量图形制作。',
    },
    'convert-webp-to-png': {
      name: '将WebP转换为PNG',
      tagline: '把WebP图片转为无损PNG文件，随处可开，并完整保留透明度。',
    },
    'convert-png-to-webp': {
      name: '将PNG转换为WebP',
      tagline: '把PNG图形压缩成新一代WebP文件，网页加载更快，并完整保留透明度。',
    },
    'convert-jpg-to-webp': {
      name: '将JPG转换为WebP',
      tagline: '把JPG照片压缩成新一代WebP文件，画质相同，网页加载更快。',
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
      tagline: '把JPG照片和扫描件变成整洁的PDF文档，可直接分享、打印或上传。',
    },
    'convert-png-to-pdf': {
      name: '将PNG转换为PDF',
      tagline: '把PNG截图、图形和扫描件变成整洁、清晰的PDF文档。',
    },
    'pdf-to-png': {
      name: 'PDF转PNG',
      tagline: '将PDF的每一页渲染为清晰的无损PNG图片，适合文字、图表和编辑。',
    },
    'pdf-converter': {
      name: 'PDF转换器',
      tagline: '把PDF转换为JPG或PNG图片，也可以把图片转为PDF，一站搞定。',
    },
    'convert-heic-to-jpg': {
      name: '将HEIC转换为JPG',
      tagline: '把iPhone的HEIC照片转为通用的JPG文件，随处可开，随处可传。',
    },
    'convert-avif-to-jpg': {
      name: '将AVIF转换为JPG',
      tagline: '把新一代AVIF图片转为通用的JPG文件，适用于不支持AVIF的应用和网站。',
    },
    'convert-avif-to-png': {
      name: '将AVIF转换为PNG',
      tagline: '把AVIF图片转为无损PNG文件，随处可开，并完整保留透明度。',
    },
    'convert-svg-to-png': {
      name: '将SVG转换为PNG',
      tagline: '把SVG图标和徽标栅格化为任意尺寸的PNG图片，用于上传、幻灯片和应用。',
    },
    'convert-png-to-svg': {
      name: '将PNG转换为SVG',
      tagline: '用potrace把PNG中的徽标、图标和线稿矢量化为真正可缩放的SVG路径。',
    },
    'png-to-ico': {
      name: 'PNG转ICO',
      tagline: '把PNG变成真正的多尺寸.ico文件，用作网站图标和Windows应用图标。',
    },
    'svg-converter': {
      name: 'SVG转换器',
      tagline: '将SVG栅格化为PNG，或把PNG描摹为SVG：以SVG为起点的图片转换器。',
    },
    'convert-wav-to-mp3': {
      name: '将WAV转换为MP3',
      tagline: '把体积庞大的无损WAV录音压缩成兼容性极佳的MP3文件，便于播客发布、分享和存储。',
    },
    'isolate-vocals-from-song': {
      name: '提取歌曲人声',
      tagline: '从音乐中提取人声，用于混音、翻唱、转写和分析。请仅用于你拥有权利的音乐。',
    },
    'image-converter': {
      name: '图片转换器',
      tagline: '在JPG、PNG、WebP、AVIF、GIF等格式之间转换，可控制质量、调整尺寸、裁剪和元数据。',
    },
    'video-converter': {
      name: '视频转换器',
      tagline: '在MP4、WebM、MOV、AVI、MKV等格式之间转换，可完全控制编解码器、分辨率和音频。',
    },
    'mp4-converter': {
      name: 'MP4转换器',
      tagline: '将视频转换为MP4：已预选MP4的视频转换器。',
    },
    'convert-mov-to-mp4': {
      name: '将MOV转换为MP4',
      tagline: '把QuickTime和iPhone的.mov文件变成通用的MP4，随处可播，随处可传。',
    },
    'convert-webm-to-mp4': {
      name: '将WebM转换为MP4',
      tagline: '把为网页优化的.webm视频变成MP4，可在任何设备上编辑、分享和播放。',
    },
    'convert-avi-to-mp4': {
      name: '将AVI转换为MP4',
      tagline: '把老旧的.avi视频升级为体积小巧的MP4，手机、浏览器和电视都能播放。',
    },
    'convert-mkv-to-mp4': {
      name: '将MKV转换为MP4',
      tagline: '把Matroska的.mkv文件变成MP4，在不支持MKV的设备上也能串流、上传和播放。',
    },
    'convert-mp4-to-webm': {
      name: '将MP4转换为WebM',
      tagline: '把MP4重新编码为更小的开放格式VP9 WebM，非常适合加载迅速的网页视频。',
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
      tagline: '裁掉视频的边缘，无需剪辑软件即可调整画面构图或宽高比。',
    },
    'resize-video': {
      name: '调整视频尺寸',
      tagline: '更改视频分辨率，可缩放到1080p、720p、480p，或任意自定义宽度和高度。',
    },
    'rotate-video': {
      name: '旋转视频',
      tagline: '修正横置或倒置的视频，一键旋转90°、180°或270°，还可翻转。',
    },
    'remove-audio-from-video': {
      name: '移除视频中的音频',
      tagline: '让视频彻底静音：去掉音轨，下载无声的纯视频文件。',
    },
    'audio-converter': {
      name: '音频转换器',
      tagline: '在MP3、WAV、M4A、OGG、FLAC、OPUS等格式之间转换，可完全控制比特率、采样率和声道。',
    },
    'srt-generator': {
      name: 'SRT字幕生成器',
      tagline: '上传视频或音频文件，生成可下载的.srt字幕文件，可直接用于YouTube、剪辑软件和无障碍工具。',
    },
    'caption-translator': {
      name: '字幕翻译器',
      tagline: '翻译SRT和VTT字幕文件，同时保留字幕的时间点、顺序和结构，不使用任何第三方AI服务商。',
    },
    'audio-waveform-generator': {
      name: '音频波形生成器',
      tagline: '把任意音频文件变成可自定义的波形视频、波形图片，或两者兼得，适合播客、音乐预告和社交媒体短片。',
    },
    'extract-video-only-from-video': {
      name: '提取无音频视频',
      tagline: '导出去掉所有音轨的无声纯视频副本，适合无声预览、B-roll素材、剪辑和重新配乐。',
    },
    'extract-frames-from-video': {
      name: '从视频中提取帧',
      tagline: '从任意视频中提取静态图像帧，可按每N秒、目标帧率或指定时间点提取，并打包为ZIP下载。',
    },
    'stitch-audio-to-video': {
      name: '为视频添加音频',
      tagline: '把一个基础视频与最多三个额外音频文件（配音、音乐、旁白）合成，并下载新的MP4。',
    },
    'ai-frame-interpolation': {
      name: 'AI插帧',
      tagline: '借助AI生成的中间帧，把视频帧率提高到48、60或120 FPS，让动作更流畅。',
    },
  },
} as const;

export default zhCnToolPages;
