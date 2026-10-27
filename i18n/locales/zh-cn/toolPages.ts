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
  },
} as const;

export default zhCnToolPages;
