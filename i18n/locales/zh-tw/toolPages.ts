/**
 * Traditional Chinese (Taiwan) partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope (MM61, 2026-10-27): only the Motion tool page body, which
 * `i18n/motionTranslations.test.ts` (MM48) requires for every translated
 * locale. The other ~65 tool pages render English until a later session
 * extends this file slug by slug, as the other locales do.
 *
 * Register: neutral Taiwan Traditional Chinese, 你 for the UI; brand names,
 * formats and codecs stay in Latin script; "Motion" and "Darkroom" stay as
 * they are. Model-written, needs native review.
 */

const zhTwToolPages = {
  pages: {
    // MM48: Motion's full page body (model-written, needs native review). The brand stays "Motion".
    motion: {
      tagline: '繪製或匯入 SVG，在關鍵影格時間軸上製作動畫，然後匯出為動態 SVG、Lottie、React、JavaScript、Flutter 或 GIF，全部在你的瀏覽器中完成。',
      intro: 'Motion 是內建於 Media Manipulator 的 SVG 編輯器，附有動畫時間軸。開啟一個 SVG 檔案（或 Lottie 動畫），其中的每個形狀都會成為可選取、移動、變色與製作動畫的圖層；你也可以從空白畫布開始，用矩形、橢圓、線條、鋼筆與文字工具繪圖。你製作動畫的每個屬性都有自己的關鍵影格軌道，並提供緩動預設組、用於自訂緩動的曲線編輯器，以及瞬間切換的保持關鍵影格。一鍵動畫器可加入線條描繪動畫、沿路徑移動、形狀變形、漸層變色、遮罩動畫與模糊。當動態符合你的想法後，就能匯出為動態 SVG、Lottie 檔案、React 元件、JavaScript 或 TypeScript 模組、Flutter 小工具或 GIF。編輯與所有匯出都在瀏覽器中執行，所以你的作品絕不會為了匯出而被上傳。',
      whatItDoes: [
        '將 SVG 檔案匯入為可編輯的圖層樹（群組、路徑、形狀、文字、圖片、漸層、遮罩、剪裁路徑），並將 Lottie JSON 動畫連同關鍵影格一起匯入。',
        '使用矩形、橢圓、線條、鋼筆（貝茲曲線）與文字工具繪製新作品，並直接在畫布上編輯路徑節點。',
        '在關鍵影格時間軸上為位置、縮放、旋轉、傾斜、不透明度、填色、線條與線條寬度製作動畫，提供線性、緩入、緩出、緩入緩出、自訂三次貝茲曲線與保持等緩動。',
        '一鍵加入進階動畫：線條描繪動畫、帶自動旋轉的沿路徑移動、形狀變形、漸層色標顏色、遮罩與剪裁路徑動畫，以及模糊。',
        '匯出靜態 SVG（一律免費）、不需任何函式庫即可播放的動態 SVG、Lottie JSON、React 元件、JavaScript 或 TypeScript 模組、Flutter 小工具與動態 GIF。',
      ],
      flowSteps: [
        {
          title: '開啟或繪製',
          description: '匯入 SVG 或 Lottie 檔案，或在空白畫布上繪製形狀與路徑。',
        },
        {
          title: '製作動畫',
          description: '移動播放指標並變更屬性，時間軸會記錄該關鍵影格。',
        },
        {
          title: '調整節奏',
          description: '選擇緩動預設組、繪製自訂曲線、加入保持，或套用一鍵動畫器。',
        },
        {
          title: '匯出',
          description: '下載在瀏覽器中製作的動態 SVG、Lottie、React、JS/TS、Flutter 或 GIF。',
        },
      ],
      advancedDetails: [
        '只有當每一個效果都能在 Chrome、Firefox 與 Safari 中以 CSS 表現時，動態 SVG 匯出才會使用純 CSS 關鍵影格。形狀變形、漸層色標移動與模糊需要一小段指令碼，因此這些檔案會在開頭嵌入精簡版的 anime.js（MIT 授權，壓縮後約 14 KB）及其授權聲明。',
        '形狀變形會將兩個形狀正規化為相同數量的曲線段，並對齊起點與繞行方向，所以變形不會扭曲。兩個無法對應的形狀會以保持取代變形。',
        'Lottie 寫入器以 Lottie 1.0.1 規範與 LottieFiles 的「Basic」功能集為目標。Lottie 無法表現的內容（例如濾鏡、文字、進階遮罩）會在下載後列出，絕不會默默捨棄。',
        'GIF 匯出使用為 Media Manipulator 撰寫的編碼器，從整段動畫的影格建構單一全域調色盤，所以平面向量作品的顏色能保持精確。',
        '匯入的 SVG 會在載入時清理：指令碼、事件處理常式、外部參照及其他不安全的內容會被移除，不支援的標記會依允許清單重建，而不是以 HTML 插入。',
      ],
      whyItMatters: [
        '動態 SVG 在任何尺寸下都保持清晰，而且通常比同樣動畫的影片或 GIF 小得多，非常適合網頁上的標誌、圖示、載入動畫與插圖。',
        '開發者需要的是程式碼形式的動畫，而不只是影片。React 元件、JavaScript 模組、Lottie 檔案與 Flutter 小工具可以直接放進應用程式。',
        '匯出在瀏覽器中進行，所以你的作品留在你的裝置上。為了執行每日額度，只有每次匯出的計數會送到我們這裡。',
      ],
      useCases: [
        {
          title: '標誌與圖示動畫',
          description: '用線條動畫描繪標誌，或讓圖示在滑鼠懸停時彈跳、旋轉或變色。',
        },
        {
          title: '載入動畫與 UI 微動畫',
          description: '製作轉圈與進度動畫，並匯出為純 CSS 的 SVG 或 React 元件。',
        },
        {
          title: '行動應用程式的 Lottie',
          description: '為 iOS、Android、網頁與 Flutter 的 Lottie 播放器匯出 Lottie JSON，或編輯現有的 Lottie 檔案。',
        },
        {
          title: '動態插圖',
          description: '讓插圖的某些部分沿路徑移動、讓形狀互相變形，並匯出聊天或電子郵件用的 GIF。',
        },
      ],
      whyMediaManipulator: [
        '這是真正的圖層與關鍵影格編輯器，具備保持、自訂曲線與進階動畫器，而不是範本圖庫。',
        '同時面向設計師與開發者的匯出：從同一個專案輸出動態 SVG、Lottie、React、JavaScript 或 TypeScript、Flutter 與 GIF。',
        '匯出在瀏覽器中製作，匯出所使用的唯一第三方程式碼都採用寬鬆授權（MIT 的 anime.js、Flutter 用的 flutter_svg 與 webview_flutter），其授權聲明會保留在檔案中。',
      ],
      privacyNote: '編輯與匯出在瀏覽器中進行，你的作品絕不會為了匯出而被上傳。沒有帳號時，專案只會保留在此瀏覽器中。登入並將專案儲存到帳號後，它會像 Darkroom 專案一樣儲存在我們的伺服器上，遵循你選擇的保留期限，並可從帳號頁面刪除。對於每次匯出，我們只會記錄格式、大小、長度與時間，以執行每日額度。',
      faq: [
        {
          question: 'Motion 是免費的嗎？',
          answer: '是的。開啟 Motion、繪圖、製作動畫、儲存與匯出靜態 SVG 都是免費且無限制的，不需要帳號。動畫匯出會計入你方案的每日額度。本頁的方案表格列出了每個方案的額度與格式。',
        },
        {
          question: '可以匯出哪些格式？',
          answer: '靜態 SVG、動態 SVG（CSS，或在需要時加上一小段內嵌指令碼）、Lottie JSON、React 元件（.tsx）、JavaScript 或 TypeScript 模組、Flutter 小工具（.dart）與動態 GIF。你的方案包含哪些格式、每天可以匯出幾次，都列在本頁的方案表格中。',
        },
        {
          question: '有什麼限制？',
          answer: '動畫匯出按日計算，在 UTC 午夜重設。沒有帳號的訪客只能將專案儲存在瀏覽器中，已登入的方案則可將一定數量的專案儲存到帳號。訪客可匯出的動畫也有長度上限，GIF 匯出則有大小與長度上限。所有目前的數字都列在本頁的方案表格與價格頁面上。',
        },
        {
          question: '我可以為自己現有的 SVG 製作動畫嗎？',
          answer: '可以。匯入任何 SVG，其中的群組、路徑、形狀、文字、漸層、遮罩與剪裁路徑都會成為可編輯的圖層。編輯器無法編輯的部分（例如圖樣或複雜濾鏡）會原樣保留並原樣匯出，而不安全的內容（指令碼、外部連結）會被移除並在匯入後列出。',
        },
        {
          question: '支援 Lottie 嗎？',
          answer: '支援，而且是雙向的。你可以匯入並編輯 Lottie JSON 檔案，也可以將動畫匯出為適用於 lottie-web 以及 iOS、Android 與 Flutter Lottie 播放器的 Lottie JSON。任一方向無法表現的功能都會列在對話方塊中，而不是默默捨棄。',
        },
        {
          question: '哪些瀏覽器支援影片匯出？',
          answer: 'GIF 匯出在所有現代瀏覽器中都能運作。MP4 與 WebM 匯出依賴瀏覽器內建的影片編碼器 WebCodecs，可在 Chrome 與 Edge 使用，依編解碼器而定，近期版本的 Safari 與 Firefox 也可以。匯出對話方塊會檢查你的瀏覽器，並在無法編碼時告知你。本頁的方案表格列出了哪些方案包含哪些影片格式。',
        },
        {
          question: '匯出的程式碼適用什麼授權？',
          answer: '動畫是你的。當動態 SVG 或程式碼匯出需要執行環境時，它會使用 MIT 授權的 anime.js；其著作權聲明寫在檔案頂端，必須保留在那裡。Flutter 匯出使用 flutter_svg（MIT）或 webview_flutter（BSD-3-Clause）套件。檔案中的其他一切都由你的專案產生。編輯器使用的開源函式庫列在我們的授權頁面上。',
        },
        {
          question: '我的專案儲存在哪裡？',
          answer: '沒有帳號時，專案只儲存在此瀏覽器中，所以清除瀏覽器資料會刪除它們。登入後，你可以將專案儲存到帳號：它會在裝置之間同步、在你工作時自動儲存、遵循你選擇的保留期限，並可從帳號頁面刪除。',
        },
      ],
      supportedFormats: {
        supportedInputFormats: [
          'SVG',
          'Lottie JSON',
          'Motion 專案（.json）',
        ],
        supportedOutputFormats: [
          '靜態 SVG',
          '動態 SVG',
          'Lottie JSON',
          'React（.tsx）',
          'JavaScript / TypeScript',
          'Flutter（.dart）',
          'GIF',
        ],
        maxFileNotes: [
          'SVG 與 Lottie 匯入各最大 4 MB。',
          '沒有帳號的專案只存在於此瀏覽器中，已登入的專案則遵循你選擇的保留期限。',
        ],
        processingNotes: [
          '編輯、預覽與所有匯出都在瀏覽器中執行。只有每次匯出的計數會送到我們的伺服器。',
        ],
      },
      embed: {
        title: '開啟 Motion',
        description: '開始新的繪圖或重新開啟最近的繪圖。編輯器以全螢幕開啟；你的工作會保留在此瀏覽器中，已登入的使用者也可以儲存到帳號。',
      },
      related: [
        {
          label: 'Motion 教學',
          to: '/tutorials/motion',
          description: '從匯入 SVG、製作動畫、調整緩動到匯出的逐步說明。',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '在多軌時間軸上剪輯影片並匯出 MP4。',
        },
        {
          label: '將影片轉換為動態 GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: '如果你的動畫來自實拍畫面，可將影片片段轉成 GIF。',
        },
        {
          label: '開源授權',
          to: '/licenses',
          description: '編輯器執行並寫入你匯出檔案中的函式庫。',
        },
      ],
      metaTitle: 'Motion：免費線上 SVG 動畫編輯器 | Media Manipulator',
      metaDescription: '在瀏覽器中為 SVG 製作動畫：關鍵影格、緩動、保持、線條描繪、動態路徑與變形。匯出為動態 SVG、Lottie JSON、React、JS、Flutter 或 GIF。',
      ogTitle: 'Motion：在瀏覽器中為 SVG 製作動畫',
      ogDescription: '匯入或繪製 SVG，在關鍵影格時間軸上製作動畫，然後匯出為動態 SVG、Lottie JSON、React、JavaScript、Flutter 或 GIF。匯出在你的瀏覽器中製作。',
    },
    // 2026-10-28 catalog expansion: name + tagline for the /tools catalog cards (model-written, needs native review).
    'inspect-metadata': {
      name: '中繼資料檢視器',
      tagline: '在分享之前，查看照片、影片、音訊檔案或 PDF 中隱藏的所有標籤：EXIF、GPS 位置、相機、編解碼器、ID3、XMP 等。',
    },
    'edit-image-metadata': {
      name: '編輯圖片中繼資料',
      tagline: '設定相片的標題、作者、著作權、關鍵字和說明，修正或移除其 GPS 位置，並重寫 EXIF 與 IPTC 標籤。',
    },
    'change-video-speed': {
      name: '變更影片速度',
      tagline: '以 2 倍、4 倍或更快的速度製作縮時影片，或將片段減速到 0.5 倍或 0.25 倍，音訊保持同步。',
    },
    'reverse-video': {
      name: '影片倒轉',
      tagline: '倒著播放任何片段，可選擇是否一併倒轉音訊，也可以做成先正播再倒播的往返效果。',
    },
    'flip-video': {
      name: '翻轉與鏡像影片',
      tagline: '一鍵將影片水平鏡像，修正反向的網路攝影機或自拍畫面，也可以垂直翻轉。',
    },
    'stabilize-video': {
      name: '影片穩定',
      tagline: '以雙遍穩定演算法消除手持晃動和走路時的彈跳，不需要腳架，也不需要桌面剪輯軟體。',
    },
    'change-video-frame-rate': {
      name: '變更影片幀率',
      tagline: '將影片轉換為 24、25、30 或 60 fps，把 60 fps 的片段降到 30 fps 以縮小檔案，或配合專案的幀率。',
    },
    'adjust-video-color': {
      name: '調整影片亮度與色彩',
      tagline: '提亮偏暗的片段，增加對比與飽和度，調整色相，或套用模糊與藝術效果，附滑桿與即時預覽。',
    },
    'convert-video-to-hevc': {
      name: '將影片轉換為 HEVC（H.265）',
      tagline: '將任何影片重新編碼為 H.265，在相同畫質下檔案大小約為 H.264 的一半，適合儲存、4K 與新款裝置。',
    },
    'convert-audio-to-wav': {
      name: '將音訊轉換為 WAV',
      tagline: '將 MP3、M4A、WAV、OGG、FLAC 等任何音訊檔案無損轉換為 WAV。',
    },
    'convert-audio-to-flac': {
      name: '將音訊轉換為 FLAC',
      tagline: '將 MP3、M4A、WAV、OGG、FLAC 等任何音訊檔案無損轉換為 FLAC。',
    },
    'convert-audio-to-ogg': {
      name: '將音訊轉換為 OGG',
      tagline: '將 MP3、M4A、WAV、OGG、FLAC 等任何音訊檔案依你選擇的位元率轉換為 OGG。',
    },
    'convert-audio-to-m4a': {
      name: '將音訊轉換為 M4A / AAC',
      tagline: '將 MP3、M4A、WAV、OGG、FLAC 等任何音訊檔案依你選擇的位元率轉換為 M4A / AAC。',
    },
    'convert-audio-to-opus': {
      name: '將音訊轉換為 Opus',
      tagline: '將 MP3、M4A、WAV、OGG、FLAC 等任何音訊檔案依你選擇的位元率轉換為 Opus。',
    },
    'convert-mp3-to-wav': {
      name: '將 MP3 轉換為 WAV',
      tagline: '將 MP3 轉換為未壓縮的 WAV，用於剪輯、取樣或燒錄 CD。',
    },
    'change-audio-speed': {
      name: '變更音訊速度',
      tagline: '把講座或 Podcast 加速到 1.5 倍，或把歌曲或錄音減速到 0.75 倍用於練習，音高保持不變。',
    },
    'change-audio-pitch': {
      name: '變更音訊音高',
      tagline: '以半音為單位移調，改變歌曲或錄音的調性、降低人聲或調整取樣音高，節奏保持不變。',
    },
    'normalize-audio': {
      name: '音訊標準化',
      tagline: '將音量偏小的錄音提升到一致的響度，讓 Podcast、語音備忘錄和混合播放清單以相同音量播放。',
    },
    'adjust-audio-volume': {
      name: '調整音訊音量',
      tagline: '依固定幅度調大或調小音訊音量，從 10% 到兩倍，或用放大滑桿以分貝調整。',
    },
    'audio-equalizer': {
      name: '音訊等化器',
      tagline: '套用低音增強、高音提升、人聲突顯或曲風預設，或設定低通與高通濾波器，然後下載結果。',
    },
    'add-reverb-to-audio': {
      name: '為音訊加入殘響',
      tagline: '為乾聲人聲或錄音加上房間、大廳、板式或彈簧殘響，或加入延遲或回音，然後下載結果。',
    },
    'trim-audio': {
      name: '裁剪音訊',
      tagline: '將 MP3、WAV 或任何錄音裁剪到指定的開始與結束時間，藉由波形選取時間點，只下載需要的部分。',
    },
    'transcribe-audio': {
      name: '音訊轉文字',
      tagline: '在我們自己的 GPU 伺服器上，以 AI 語音辨識將 MP3、WAV、M4A 或任何錄音轉換為文字、字幕或 JSON。',
    },
    'add-text-to-image': {
      name: '為圖片加入文字',
      tagline: '在相片上加入說明、標題或浮水印：選擇字型、大小、顏色、外框與位置，然後下載。',
    },
    'crop-image': {
      name: '裁切圖片',
      tagline: '在相片上拖曳出需要的區域，調整構圖，並以任何格式只下載該區域。',
    },
    'grayscale-image': {
      name: '將圖片轉換為黑白',
      tagline: '將彩色相片轉為灰階，或轉為復古色調的棕褐色，並以任何格式下載。',
    },
    'image-filters': {
      name: '圖片濾鏡與特效',
      tagline: '油畫、素描、炭筆、浮雕、復古、漩渦、模糊、銳利化等效果，一鍵套用到任何相片。',
    },
    'rotate-image': {
      name: '旋轉圖片',
      tagline: '將相片旋轉 90°、180° 或 270°，修正橫放的掃描檔或手機照片，並以任何格式下載。',
    },
    'sharpen-image': {
      name: '銳利化圖片',
      tagline: '一鍵銳利化，讓略微模糊的相片或掃描檔邊緣更清晰，並以任何格式下載。',
    },
    'blur-image': {
      name: '模糊圖片',
      tagline: '將整張相片柔化，用作背景、預留圖或隱私遮蔽，並以任何格式下載。',
    },
    'generate-vtt-captions': {
      name: 'VTT 字幕產生器',
      tagline: '在我們自己的 GPU 伺服器上，透過 AI 轉錄為 HTML5 影片、YouTube 或播放器建立 .vtt 字幕檔。',
    },
    'summarize-video': {
      name: '影片摘要',
      tagline: '在我們自己的 GPU 伺服器上，取得講座、會議或訪談的逐字稿和附時間戳記的結構化 JSON 分析。',
    },
  },
} as const;

export default zhTwToolPages;
