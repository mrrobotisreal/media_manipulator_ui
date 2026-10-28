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
    'summarize-video': {
      name: '视频摘要',
      tagline: '在我们自己的GPU服务器上，获取讲座、会议或访谈的文字稿和带时间戳的结构化JSON分析。',
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
  },
} as const;

export default zhCnToolPages;
