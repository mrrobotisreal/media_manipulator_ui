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
      name: 'Motion',
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
    // MM75: summarize-video / summarize-audio full page bodies (model-written, needs native review).
    'summarize-video': {
      name: '影片摘要',
      h1: '用 AI 摘要影片：章節、主題與畫面文字',
      tagline: '為講座、會議或教學產生文字摘要，附有可點擊的章節、主題與畫面文字，全部在我們自己的 GPU 伺服器上完成。',
      metaTitle: '附章節的 AI 影片摘要工具 | Media Manipulator',
      metaDescription: '上傳影片，即可取得附時間戳記章節、主題與畫面文字的文字摘要。AI 在我們自己的 GPU 伺服器上執行，絕不使用第三方 AI。需要免費帳號。',
      ogTitle: '用 AI 摘要影片',
      ogDescription: '附可點擊章節、主題與畫面文字的文字摘要。需要免費帳號。',
      embed: {
        title: '摘要影片',
        description: '登入後上傳影片（或音訊檔案），並選擇摘要語言。你會得到標題、簡短摘要、可跳至影片對應時刻的章節、主題，以及畫面中出現的文字。',
      },
      intro: '沒有人想為了找出重要的五分鐘，把一小時的會議或講座重看一遍。Media Manipulator 幫你看、幫你聽：先用 Whisper 轉錄語音，再用視覺模型檢視在畫面變化處挑選的影格，並綜合兩者撰寫摘要，全程都在我們營運的 GPU 伺服器上完成。結果是一份簡短的文件：標題、幾句話的概述、附起訖時間的章節、主題，以及畫面中出現的文字。點擊章節即可跳至影片中的對應時刻，也可以將全部內容複製為 Markdown，或下載為 Markdown 或 JSON。摘要需要免費帳號。',
      whatItDoes: [
        '為整部影片撰寫標題與三到六句話的摘要。',
        '將影片分成附起訖時間的章節；點擊章節，播放器就會跳至對應時刻。',
        '列出主題與畫面中出現的文字，並標示其首次出現的時間。',
        '描述畫面與語音，並說明哪些內容無法處理（例如沒有語音）。',
        '以你選擇的語言撰寫摘要，或使用影片中所說的語言。',
      ],
      flowSteps: [
        {
          title: '登入',
          description: '有免費帳號即可。',
        },
        {
          title: '上傳',
          description: '影片或音訊檔案。',
        },
        {
          title: '產生摘要',
          description: '語音與影格在我們的 GPU 伺服器上分析。',
        },
        {
          title: '閱讀',
          description: '點擊章節、複製 Markdown、下載 .md 或 .json。',
        },
      ],
      advancedDetails: [
        '語音使用 Whisper 轉錄；影格在場景切換處挑選，數量不超過你的方案上限（Free 24 個、Premium 48 個、Pro 96 個），並由視覺模型分批描述。',
        '語言模型根據逐字稿與影格筆記撰寫摘要。Pro 帳號可在可用時要求由更大的模型產生更深入的摘要。',
        '一次摘要計為每日額度中的 1 次 AI 工作；失敗或被拒絕的工作不會計入。',
        '逐字稿由機器產生，人名與數字可能有誤。摘要會在備註中說明這一點。',
      ],
      whyItMatters: [
        '附章節的摘要一分鐘就能瀏覽完，影片則不行。',
        '可點擊的時間戳記能直接帶你到需要的部分。',
        '畫面文字能捕捉到簡報標題與字幕，這些內容語音中從來不會唸出來。',
      ],
      useCases: [
        {
          title: '會議紀要',
          description: '決議與議題，並附上時間以便核對細節。',
        },
        {
          title: '講座筆記',
          description: '依單元分章節，並附上簡報文字，方便複習。',
        },
        {
          title: '教學大綱',
          description: '把步驟整理成章節，想看哪一步就跳到哪一步。',
        },
        {
          title: '訪談概覽',
          description: '談了什麼，在哪裡談的。',
        },
      ],
      whyMediaManipulator: [
        'Whisper 以及視覺與語言模型都執行在我們自己營運的硬體上；你的影片絕不會傳送給第三方 AI。',
        '章節可直接在結果檢視器中跳至你自己的影片。',
        '提供 Markdown 與 JSON 下載。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。',
      ],
      privacyNote: '摘要需要免費帳號，因此工作會與該帳號關聯。你的檔案在我們自己的伺服器上處理，AI 模型執行在我們營運的 GPU 伺服器上；不會向任何第三方 AI 供應商傳送資料。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。',
      faq: [
        {
          question: '需要帳號嗎？',
          answer: '需要，一個免費帳號即可。摘要會在我們的 GPU 伺服器上執行多個 AI 模型，因此僅限已登入的使用者使用。',
        },
        {
          question: '我會得到什麼？',
          answer: '標題、簡短摘要、附起訖時間的章節、主題、附時間的畫面文字、對畫面與語音的描述，以及關於無法處理內容的備註。',
        },
        {
          question: '可以選擇摘要的語言嗎？',
          answer: '可以。你可以從本站的 18 種語言中任選一種，或選擇「與語音語言相同」，以影片中所說的語言撰寫。',
        },
        {
          question: '如果影片沒有語音怎麼辦？',
          answer: '摘要將僅根據畫面撰寫，並在備註中說明。既沒有畫面也沒有聲音的檔案會被拒絕，且不會計入額度。',
        },
        {
          question: '我的影片會被傳送給第三方嗎？',
          answer: '不會。所有模型都執行在我們營運的 GPU 伺服器上。',
        },
        {
          question: '這會占用我的額度嗎？',
          answer: '會，計為 1 次 AI 工作。失敗的工作不會計入。',
        },
      ],
      related: [
        {
          label: '音訊摘要',
          to: '/tools/summarize-audio',
          description: '適用於 Podcast 與錄音。',
        },
        {
          label: '影片轉錄',
          to: '/tools/transcribe-video',
          description: '完整的逐字稿。',
        },
        {
          label: '音訊轉錄',
          to: '/tools/transcribe-audio',
          description: '適用於音訊檔案。',
        },
        {
          label: '移除背景雜音',
          to: '/tools/remove-background-noise',
          description: '先清理音訊。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '計為 1 次 AI 工作；失敗的工作不會計入。',
          '長度上限取決於你的方案的影片長度限制。',
        ],
      },
    },
    'summarize-audio': {
      name: '音訊摘要',
      h1: '用 AI 摘要音訊錄音',
      tagline: '把 Podcast、訪談或語音備忘錄變成附章節與主題的文字摘要，全部在我們自己的 GPU 伺服器上完成。',
      metaTitle: '附章節的 AI 音訊摘要工具 | Media Manipulator',
      metaDescription: '上傳 MP3、WAV 或 M4A，即可取得附時間戳記章節與主題的文字摘要。Whisper 與語言模型都執行在我們自己的 GPU 伺服器上。需要免費帳號。',
      ogTitle: '用 AI 摘要音訊錄音',
      ogDescription: '為任何錄音產生附章節與主題的文字摘要。需要免費帳號。',
      embed: {
        title: '摘要音訊檔案',
        description: '登入後上傳錄音，並選擇摘要語言。你會得到標題、簡短摘要、可跳至錄音對應時刻的章節，以及主題。',
      },
      intro: '一集 Podcast、一場訪談或一段很長的語音備忘錄，做成一頁文字比聽一個小時的音訊更好用。Media Manipulator 用 Whisper 轉錄錄音，再由語言模型根據逐字稿撰寫摘要，兩者都在我們營運的 GPU 伺服器上完成。你會得到標題、幾句話的概述、附起訖時間的章節與主題。點擊章節即可跳至錄音中的對應位置，也可以將摘要複製為 Markdown，或下載為 Markdown 或 JSON。摘要需要免費帳號。',
      whatItDoes: [
        '為錄音撰寫標題與簡短摘要。',
        '將錄音分成附時間的章節；點擊章節，播放器就會跳至對應位置。',
        '列出主題，並描述說話者與其語氣。',
        '以你選擇的語言撰寫摘要，或使用錄音中所說的語言。',
      ],
      flowSteps: [
        {
          title: '登入',
          description: '有免費帳號即可。',
        },
        {
          title: '上傳',
          description: 'MP3、WAV、M4A 及其他音訊。',
        },
        {
          title: '產生摘要',
          description: 'Whisper 與語言模型在我們的 GPU 伺服器上執行。',
        },
        {
          title: '閱讀',
          description: '點擊章節、複製 Markdown、下載 .md 或 .json。',
        },
      ],
      advancedDetails: [
        '語音使用 Whisper 轉錄；語言模型根據逐字稿撰寫摘要。',
        '附有封面圖片的音訊檔案會視為音訊處理，圖片會被忽略。',
        '一次摘要計為每日額度中的 1 次 AI 工作；失敗或被拒絕的工作不會計入。',
        '逐字稿由機器產生，人名與數字可能有誤。摘要會在備註中說明這一點。',
      ],
      whyItMatters: [
        '一分鐘就能讀完摘要，再決定要聽哪一段。',
        '附時間的章節讓一段很長的錄音變得便於瀏覽。',
        '主題讓過往的節目庫變得可以搜尋。',
      ],
      useCases: [
        {
          title: 'Podcast 節目筆記',
          description: '為單集頁面準備的章節與主題。',
        },
        {
          title: '訪談回顧',
          description: '談了哪些內容，並附上可引用的時間點。',
        },
        {
          title: '語音備忘錄轉筆記',
          description: '把冗長瑣碎的備忘錄變成簡短的一頁。',
        },
        {
          title: '通話摘要',
          description: '一通錄音通話的重點。',
        },
      ],
      whyMediaManipulator: [
        'Whisper 與語言模型執行在我們自己營運的硬體上；你的錄音絕不會傳送給第三方 AI。',
        '章節可直接在結果檢視器中跳至你自己的錄音。',
        '提供 Markdown 與 JSON 下載。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。',
      ],
      privacyNote: '摘要需要免費帳號，因此工作會與該帳號關聯。你的檔案在我們自己的伺服器上處理，AI 模型執行在我們營運的 GPU 伺服器上；不會向任何第三方 AI 供應商傳送資料。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。',
      faq: [
        {
          question: '需要帳號嗎？',
          answer: '需要，一個免費帳號即可。摘要會在我們的 GPU 伺服器上執行 AI 模型，因此僅限已登入的使用者使用。',
        },
        {
          question: '這與轉錄有什麼不同？',
          answer: '轉錄會給你每一個字。摘要則根據該逐字稿，給你標題、幾句話的概述、章節與主題。',
        },
        {
          question: '可以選擇摘要的語言嗎？',
          answer: '可以。你可以從本站的 18 種語言中任選一種，或選擇「與語音語言相同」。',
        },
        {
          question: '我的錄音會被傳送給第三方嗎？',
          answer: '不會。模型都執行在我們營運的 GPU 伺服器上。',
        },
        {
          question: '這會占用我的額度嗎？',
          answer: '會，計為 1 次 AI 工作。失敗的工作不會計入。',
        },
      ],
      related: [
        {
          label: '音訊轉錄',
          to: '/tools/transcribe-audio',
          description: '每一個字，以文字或字幕呈現。',
        },
        {
          label: '影片摘要',
          to: '/tools/summarize-video',
          description: '額外包含畫面與畫面文字。',
        },
        {
          label: '移除背景雜音',
          to: '/tools/remove-background-noise',
          description: '先清理音訊。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '計為 1 次 AI 工作；失敗的工作不會計入。',
        ],
      },
    },
    // MM78 voices: name + tagline (model-written, needs native review).
    'voice-cloning': {
      name: '語音複製',
      tagline:
        '錄製或上傳 5 到 60 秒你自己的語音，建立一個語音，讓它以 20 多種語言朗讀任何文字。',
    },
    'voice-designer': {
      name: '語音設計器',
      tagline:
        '用文字描述一個語音，試聽預覽，並保留你喜歡的那個，讓它以 20 多種語言朗讀任何文字。',
    },
    'voice-changer': {
      name: '變聲器',
      tagline:
        '即時調整錄音的音高與特色，或使用 AI 將語音轉換為已儲存或預設的語音。',
    },
    // MM84: name / tagline / metaTitle / metaDescription for the copy-bar tool pages (model-written, needs native review).
    'content-studio': {
      name: 'Darkroom',
      tagline: '在多軌時間軸上剪輯、疊加與混合影片和音訊，然後匯出 MP4。Premiere Pro 風格的編輯器，直接在瀏覽器中使用。',
      metaTitle: 'Darkroom：免費線上多軌影片編輯器 | Media Manipulator',
      metaDescription: '在多軌時間軸上剪輯、疊加與混合影片和音訊，然後匯出 MP4。一款在瀏覽器中執行的免費 Premiere Pro 風格影片編輯器，無需註冊，無需安裝。',
    },
    'remove-exif-metadata': {
      name: '移除圖片中的 EXIF 中繼資料',
      tagline: '在分享相片之前，清除其中的 GPS 位置、裝置、相機和時間戳記資料。',
      metaTitle: '線上移除圖片 EXIF 中繼資料（免費） | Media Manipulator',
      metaDescription: '免費線上工具，可移除 JPG、PNG、WebP 和 HEIC 圖片中的 EXIF、GPS、IPTC 和相機中繼資料。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
    },
    'compress-image': {
      name: '壓縮圖片',
      tagline: '縮小 JPG、PNG 和 WebP 檔案大小，讓網站更快、上傳更小、分享更輕鬆。',
      metaTitle: '線上免費壓縮圖片 | Media Manipulator',
      metaDescription: '免費線上圖片壓縮工具。在維持良好畫質的同時縮小 JPG、PNG 和 WebP 檔案大小。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
    },
    'image-resizer': {
      name: '圖片尺寸調整',
      tagline: '將 JPG、PNG、WebP 和 GIF 圖片調整為精確的像素尺寸，同時維持長寬比。',
      metaTitle: '線上免費調整圖片尺寸 | Media Manipulator',
      metaDescription: '免費線上圖片尺寸調整工具。將 JPG、PNG、WebP 和 GIF 圖片調整為精確的像素尺寸，同時維持長寬比。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
    },
    'remove-background-from-image': {
      name: '移除圖片背景',
      tagline: '自動擦除任何相片的背景，下載乾淨的透明 PNG 去背圖。',
      metaTitle: '線上免費移除圖片背景 | Media Manipulator',
      metaDescription: '免費線上背景移除工具。自動擦除任何相片的背景，下載透明 PNG。執行在我們自己的 GPU 上，不使用第三方 AI。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
    },
    'image-to-pdf': {
      name: '圖片轉 PDF',
      tagline: '一鍵將 JPG、PNG 等圖片變成整潔、方便分享的 PDF 文件。',
      metaTitle: '線上免費將圖片轉換為 PDF | Media Manipulator',
      metaDescription: '免費線上圖片轉 PDF 工具。將 JPG、PNG 等圖片變成整潔的 PDF 文件。無需註冊，無浮水印。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
    },
    'pdf-to-jpg': {
      name: 'PDF 轉 JPG',
      tagline: '將 PDF 的每一頁轉為高品質 JPG 圖片，方便分享、編輯或發布。',
      metaTitle: '線上免費將 PDF 轉換為 JPG | Media Manipulator',
      metaDescription: '免費線上 PDF 轉 JPG 工具。將 PDF 的每一頁轉為高品質 JPG 圖片，並以 ZIP 下載。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
    },
    'compress-video': {
      name: '壓縮影片',
      tagline: '縮小 MP4、WebM、MOV、MKV 和 AVI 檔案大小，適用於網頁、電子郵件、社群媒體和雲端上傳。',
      metaTitle: '線上壓縮影片（免費） | Media Manipulator',
      metaDescription: '免費線上影片壓縮工具。在維持良好畫質的同時縮小 MP4、WebM、MOV、MKV 和 AVI 檔案大小。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
    },
    'video-trimmer': {
      name: '影片裁剪',
      tagline: '透過快速且保持畫質的裁剪，把片段剪成你想要的部分，盡可能不重新編碼。',
      metaTitle: '線上免費裁剪影片 | Media Manipulator',
      metaDescription: '免費線上影片裁剪工具。設定開始和結束時間，透過快速無損的裁剪剪出片段。輸出 MP4，無浮水印，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
    },
    'extract-audio-from-video': {
      name: '從影片擷取音訊',
      tagline: '將任何影片的音軌儲存為乾淨的 MP3、WAV、M4A、AAC、FLAC 或 OGG 檔案。',
      metaTitle: '從影片擷取音訊：MP3、WAV、M4A 等 | Media Manipulator',
      metaDescription: '免費線上工具，可從任何影片檔案（MP4、MOV、MKV、WebM、AVI）擷取音訊。可輸出 MP3、WAV、M4A、AAC、FLAC 或 OGG。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
    },
    'convert-video-to-animated-gif': {
      name: '將影片轉換為動態 GIF',
      tagline: '幾秒內把簡短的 MP4、WebM、MOV 或 MKV 片段變成方便分享的動態 GIF。',
      metaTitle: '線上將影片轉換為動態 GIF（免費） | Media Manipulator',
      metaDescription: '免費線上影片轉 GIF 工具。將簡短的 MP4、WebM、MOV 和 MKV 片段變成動態 GIF，並可控制尺寸與影格率。',
    },
    'transcribe-video': {
      name: '影片轉錄',
      tagline: '把影片或音訊檔案中的語音擷取為 WebVTT 或 SRT 字幕、純文字或附時間戳記的 JSON。',
      metaTitle: '線上將影片轉錄為文字（免費） | Media Manipulator',
      metaDescription: '免費線上影片轉錄工具。將 MP4、MOV、WebM、MKV 和音訊檔案轉換為可搜尋的文字、VTT 字幕或 JSON 逐字稿。',
    },
    'transcode-to-hls': {
      name: '將影片轉碼為 HLS',
      tagline: '把任何影片封裝成 Apple HLS VOD 套件：master.m3u8 和依解析度劃分的 .ts 片段，可直接用於網頁。',
      metaTitle: '線上將影片轉碼為 HLS | 免費自適應串流工具',
      metaDescription: '免費線上 HLS 轉碼工具。將 MP4、MOV、WebM、MKV 轉換為包含 360p/480p/720p 解析度的 HLS VOD 套件，可選字幕和分鏡腳本。',
    },
    'ai-video-restoration': {
      name: 'AI 影片修復',
      tagline: '使用最多六種 AI 模型（Real-ESRGAN、SwinIR、HAT、BasicVSR++、RVRT 和 VRT）放大並修復簡短的影片片段，並將所有結果並排比較。',
      metaTitle: 'AI 影片修復工具：線上比較 6 種放大模型 | Media Manipulator',
      metaDescription: '免費 AI 影片修復工具。讓簡短片段在我們自己的 GPU 上通過 Real-ESRGAN、SwinIR、HAT、BasicVSR++、RVRT 和 VRT 超解析度模型處理，並將所有結果打包下載。',
    },
    'ai-image-restoration': {
      name: 'AI 圖片修復與放大',
      tagline: '使用最多八種 AI 模型清理、放大並修復相片：保真預清理（FBCNN、SCUNet、NAFNet）、通用放大器（Real-ESRGAN、SwinIR、HAT）以及人臉增強（GFPGAN、CodeFormer），並將每個結果與原圖比較。',
      metaTitle: 'AI 圖片修復與放大器：線上比較 8 種模型 | Media Manipulator',
      metaDescription: '免費 AI 相片修復與放大。去除 JPEG 壓縮瑕疵、降噪並去模糊，然後用 Real-ESRGAN、SwinIR 或 HAT 放大到 4K/8K，再用 GFPGAN/CodeFormer 增強人臉，全部在我們自己的 GPU 上完成，並可並排比較。',
    },
    'ai-document-scan': {
      name: 'AI 文件掃描',
      tagline: '將掃描文件和手寫筆記變成可搜尋的多頁 PDF 和可編輯的 Word 文件：印刷頁面會取得忠實的 Tesseract 文字層，手寫內容由視覺 AI 轉錄，並標出不確定之處，絕不憑空捏造。',
      metaTitle: 'AI 文件掃描：將掃描頁面和手寫內容轉為 PDF/Word | Media Manipulator',
      metaDescription: '免費 AI 文件掃描：將掃描圖片轉換為可搜尋的 PDF 和圖片轉 Word OCR，並將手寫筆記轉錄為文字。可調整頁面順序，印刷體與手寫混合也沒問題，全部在我們自己的 GPU 上完成，忠於原文並標出不確定之處。',
    },
    'ai-image-upscaler': {
      name: 'AI 圖片放大器',
      tagline: '使用 Real-ESRGAN 模型放大較小或模糊的相片，它會重建細節，而不是單純拉伸像素。',
      metaTitle: 'AI 圖片放大器：將相片放大 2 倍或 4 倍 | Media Manipulator',
      metaDescription: '用能還原邊緣和紋理的 AI 將低解析度相片放大 2 倍或 4 倍。執行在我們自己的 GPU 上，輸出 PNG。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
    },
    'blur-faces-in-photo': {
      name: '模糊相片中的人臉',
      tagline: '自動偵測人臉，然後對全部人臉或你選擇的人臉進行模糊、馬賽克或塗黑。',
      metaTitle: '線上模糊相片中的人臉 | Media Manipulator',
      metaDescription: '對相片中的人臉進行模糊、馬賽克或塗黑。偵測每一張人臉，再選擇要隱藏的人臉。AI 執行在我們自己的 GPU 上。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
    },
    'redact-text-in-image': {
      name: '遮蓋圖片中的文字',
      tagline: '在螢幕截圖或相片中找出可讀文字，並用模糊或黑色方框遮蓋個人資料或全部文字。',
      metaTitle: '線上遮蓋圖片中的文字 | Media Manipulator',
      metaDescription: '自動找出圖片中的文字，並將姓名、電子郵件、號碼等個人資料塗黑或模糊。AI 執行在我們自己的 GPU 上。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
    },
    'remove-object-from-photo': {
      name: '移除相片中的物件',
      tagline: '在不想出現在畫面中的物件周圍畫一個框，修補模型就會用相符的背景填補空缺。',
      metaTitle: '線上移除相片中的物件 | Media Manipulator',
      metaDescription: '擦除相片中不需要的物件。畫一個矩形，AI 修補會依背景填補空白。執行在我們自己的 GPU 上。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
    },
    'clean-voice-audio': {
      name: '人聲音訊降噪',
      tagline: '減少 Podcast、訪談和語音備忘錄中的嘶嘶聲、房間底噪和低頻隆隆聲，讓語音更清晰。',
      metaTitle: '用 AI 清理人聲錄音 | Media Manipulator',
      metaDescription: '用 AI 清理人聲錄音。減少嘶嘶聲、嗡嗡聲和房間雜訊，讓語音更容易聽清。執行在我們自己的 GPU 上。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
    },
    'remove-background-noise': {
      name: '去除背景雜音',
      tagline: '用 AI 降噪器降低錄音中的嘶嘶聲、嗡嗡聲、車流聲和房間雜訊，讓主要聲音更突出。',
      metaTitle: '線上去除音訊背景雜音 | Media Manipulator',
      metaDescription: '去除音訊中的背景雜音。AI 降噪器會降低錄音中的嘶嘶聲、嗡嗡聲和環境音。執行在我們自己的 GPU 上。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
    },
    'remove-vocals-from-song': {
      name: '去除歌曲人聲',
      tagline: '去掉音軌中的歌聲並保留音樂，用於卡拉 OK、練習和伴奏。請僅用於你擁有權利的音樂。',
      metaTitle: '去除歌曲人聲：卡拉 OK 製作器 | Media Manipulator',
      metaDescription: '用 AI 去除歌曲中的人聲，並以與原檔案相同的格式或 FLAC、WAV 下載伴奏。在我們自己的 GPU 上製作卡拉 OK 和練習音軌。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
    },

    // 2026-10-31 (MM92): name + tagline for every remaining tool, so the /tools catalog
    // and the home grid never show an English card in this locale. Model-written; native review pending.
    'transcode-to-dash': {
      name: '將影片轉碼為 DASH（AV1 / VP9）',
      tagline: '把任何影片封裝成 MPEG-DASH 套件，包含 manifest.mpd 和依解析度劃分的初始化與媒體片段。',
    },
    'convert-webp-to-jpg': {
      name: '將 WebP 轉換為 JPG',
      tagline: '把 WebP 圖片變成相容性廣泛的 JPG 檔案，任何看圖軟體或編輯器都能開啟。',
    },
    'convert-png-to-jpg': {
      name: '將 PNG 轉換為 JPG',
      tagline: '幾秒內把容量龐大的 PNG 螢幕截圖和圖形，變成體積小、各處都能使用的 JPG 相片。',
    },
    'convert-jpg-to-png': {
      name: '將 JPG 轉換為 PNG',
      tagline: '把 JPG 相片轉為無損 PNG 檔案，方便編輯、處理透明背景和製作高品質圖形。',
    },
    'convert-webp-to-png': {
      name: '將 WebP 轉換為 PNG',
      tagline: '把 WebP 圖片轉為無損 PNG 檔案，到處都能開啟，並完整保留透明度。',
    },
    'convert-png-to-webp': {
      name: '將 PNG 轉換為 WebP',
      tagline: '把 PNG 圖形壓縮成新式 WebP 檔案，網頁載入更快，並完整保留透明度。',
    },
    'convert-jpg-to-webp': {
      name: '將 JPG 轉換為 WebP',
      tagline: '把 JPG 相片壓縮成新式 WebP 檔案，在相同視覺畫質下網頁載入更快。',
    },
    'jpg-converter': {
      name: 'JPG 轉換器',
      tagline: '將圖片轉換為 JPG：預先選好 JPG 的圖片轉換器。',
    },
    'png-converter': {
      name: 'PNG 轉換器',
      tagline: '將圖片轉換為 PNG：預先選好 PNG 的圖片轉換器。',
    },
    'convert-jpg-to-pdf': {
      name: '將 JPG 轉換為 PDF',
      tagline: '把 JPG 相片和掃描檔變成整潔的 PDF 文件，方便分享、列印或上傳。',
    },
    'convert-png-to-pdf': {
      name: '將 PNG 轉換為 PDF',
      tagline: '把 PNG 螢幕截圖、圖形和掃描檔變成整潔清晰的 PDF 文件。',
    },
    'pdf-to-png': {
      name: 'PDF 轉 PNG',
      tagline: '將 PDF 的每一頁轉為清晰的無損 PNG 圖片，適合處理文字、圖表和編輯。',
    },
    'pdf-converter': {
      name: 'PDF 轉換器',
      tagline: '將 PDF 轉為 JPG 或 PNG 圖片，也能把圖片轉成 PDF，全都在同一個地方完成。',
    },
    'convert-heic-to-jpg': {
      name: '將 HEIC 轉換為 JPG',
      tagline: '把 iPhone 的 HEIC 相片轉為各處都能開啟和上傳的 JPG 檔案。',
    },
    'convert-avif-to-jpg': {
      name: '將 AVIF 轉換為 JPG',
      tagline: '把新式 AVIF 圖片轉為相容性廣泛的 JPG 檔案，供不接受 AVIF 的應用程式和網站使用。',
    },
    'convert-avif-to-png': {
      name: '將 AVIF 轉換為 PNG',
      tagline: '把 AVIF 圖片轉為無損 PNG 檔案，到處都能開啟，並完整保留透明度。',
    },
    'convert-svg-to-png': {
      name: '將 SVG 轉換為 PNG',
      tagline: '把 SVG 圖示和標誌轉為任意尺寸的 PNG 圖片，用於上傳、簡報和應用程式。',
    },
    'convert-png-to-svg': {
      name: '將 PNG 轉換為 SVG',
      tagline: '使用 potrace 把 PNG 標誌、圖示和線稿向量化，變成真正可縮放的 SVG 路徑。',
    },
    'png-to-ico': {
      name: 'PNG 轉 ICO',
      tagline: '把 PNG 轉為真正的多尺寸 .ico 網站圖示，可用於網站 favicon 和 Windows 應用程式圖示。',
    },
    'svg-converter': {
      name: 'SVG 轉換器',
      tagline: '將 SVG 轉為 PNG，或把 PNG 描摹成 SVG：以 SVG 為起點的圖片轉換器。',
    },
    'convert-wav-to-mp3': {
      name: '將 WAV 轉換為 MP3',
      tagline: '把容量龐大的無損 WAV 錄音壓縮成相容性廣泛的 MP3 檔案，適合 Podcast、分享和儲存。',
    },
    'isolate-vocals-from-song': {
      name: '分離歌曲人聲',
      tagline: '從音樂音軌中擷取人聲，用於混音、翻唱、轉錄和分析。請僅用於你擁有權利的音樂。',
    },
    'image-converter': {
      name: '圖片轉換器',
      tagline: '在 JPG、PNG、WebP、AVIF、GIF 等格式之間轉換，並可控制畫質、調整尺寸、裁切和中繼資料。',
    },
    'video-converter': {
      name: '影片轉換器',
      tagline: '在 MP4、WebM、MOV、AVI、MKV 等格式之間轉換，並可完整控制編解碼器、解析度和音訊。',
    },
    'mp4-converter': {
      name: 'MP4 轉換器',
      tagline: '將影片轉換為 MP4：預先選好 MP4 的影片轉換器。',
    },
    'convert-mov-to-mp4': {
      name: '將 MOV 轉換為 MP4',
      tagline: '把 QuickTime 和 iPhone 的 .mov 檔案變成通用的 MP4，各處都能播放和上傳。',
    },
    'convert-webm-to-mp4': {
      name: '將 WebM 轉換為 MP4',
      tagline: '把網頁最佳化的 .webm 影片變成 MP4，可在任何裝置上剪輯、分享和播放。',
    },
    'convert-avi-to-mp4': {
      name: '將 AVI 轉換為 MP4',
      tagline: '把老舊的 .avi 影片升級成小巧的 MP4，在每支手機、瀏覽器和電視上都能播放。',
    },
    'convert-mkv-to-mp4': {
      name: '將 MKV 轉換為 MP4',
      tagline: '把 Matroska .mkv 檔案變成 MP4，在不支援 MKV 的裝置上也能串流、上傳和播放。',
    },
    'convert-mp4-to-webm': {
      name: '將 MP4 轉換為 WebM',
      tagline: '把 MP4 重新編碼為更小的開放式 VP9 WebM，非常適合載入快速的網頁影片。',
    },
    'mp4-to-mp3': {
      name: '將 MP4 轉換為 MP3',
      tagline: '把 MP4 的音訊擷取成 MP3：輸入 MP4、輸出 MP3 的「從影片擷取音訊」。',
    },
    'video-to-mp3': {
      name: '將影片轉換為 MP3',
      tagline: '把影片的配樂擷取成 MP3：與「從影片擷取音訊」是同一個工具。',
    },
    'mp4-to-gif': {
      name: '將 MP4 轉換為 GIF',
      tagline: '把 MP4 片段做成循環播放的 GIF：固定輸入為 MP4 的動態 GIF 轉換器。',
    },
    'video-to-gif': {
      name: '將影片轉換為 GIF',
      tagline: '把任何常見影片格式的簡短片段變成循環播放的 GIF：與動態 GIF 轉換器是同一個工具。',
    },
    'gif-converter': {
      name: 'GIF 轉換器',
      tagline: '從影片片段製作並調整動態 GIF：換個名稱的動態 GIF 轉換器。',
    },
    'video-compressor': {
      name: '影片壓縮器',
      tagline: '用壓縮預設縮小影片：與「壓縮影片」是同一個工具。',
    },
    'compress-mp4': {
      name: '壓縮 MP4',
      tagline: '縮小 MP4 檔案並保持 MP4 格式：固定容器格式的「壓縮影片」。',
    },
    'mp4-trimmer': {
      name: 'MP4 裁剪工具',
      tagline: '輸入與輸出都固定為 MP4 的影片裁剪工具。',
    },
    'video-cutter': {
      name: '影片剪切工具',
      tagline: '保留影片的某一段，捨棄其餘部分：與影片裁剪工具是同一個工具。',
    },
    'cut-video-online': {
      name: '線上剪切影片',
      tagline: '直接在瀏覽器中從影片剪出片段，不必安裝任何軟體：換個名稱的影片裁剪工具。',
    },
    'crop-video': {
      name: '裁切影片',
      tagline: '裁掉影片的邊緣，不需要剪輯軟體就能改變構圖或長寬比。',
    },
    'resize-video': {
      name: '調整影片尺寸',
      tagline: '變更影片解析度，可縮放為 1080p、720p、480p，或任意自訂的寬度與高度。',
    },
    'rotate-video': {
      name: '旋轉影片',
      tagline: '修正橫躺或上下顛倒的影片，一鍵旋轉 90°、180° 或 270°，並可翻轉。',
    },
    'remove-audio-from-video': {
      name: '移除影片中的音訊',
      tagline: '讓影片徹底靜音：移除音軌，下載沒有聲音、只有畫面的檔案。',
    },
    'audio-converter': {
      name: '音訊轉換器',
      tagline: '在 MP3、WAV、M4A、OGG、FLAC、OPUS 等格式之間轉換，並可完整控制位元率、取樣率和聲道。',
    },
    'srt-generator': {
      name: 'SRT 字幕產生器',
      tagline: '上傳影片或音訊檔案，產生可下載的 .srt 字幕檔，可用於 YouTube、剪輯軟體和無障礙工具。',
    },
    'caption-translator': {
      name: '字幕翻譯器',
      tagline: '翻譯 SRT 和 VTT 字幕檔，同時保留字幕的時間點、順序和結構，不使用第三方 AI 供應商。',
    },
    'audio-waveform-generator': {
      name: '音訊波形產生器',
      tagline: '把任何音訊檔案變成可自訂的波形影片、波形圖片，或兩者兼具，適合 Podcast、音樂預覽和社群短片。',
    },
    'extract-video-only-from-video': {
      name: '擷取無音訊影片',
      tagline: '匯出移除所有音軌的靜音、純影像副本，適合靜音預覽、B-roll、剪輯和重新配樂。',
    },
    'extract-frames-from-video': {
      name: '從影片擷取影格',
      tagline: '從任何影片擷取靜態影格：每隔 N 秒、依指定幀率，或在特定時間點擷取，並下載為 ZIP。',
    },
    'stitch-audio-to-video': {
      name: '為影片加入音訊',
      tagline: '將一支基底影片與最多三個額外的音訊檔案（配音、音樂、旁白）合併，並下載新的 MP4。',
    },
    'ai-frame-interpolation': {
      name: 'AI 影格插補',
      tagline: '以 AI 產生的中間影格，將影片幀率提高到 48、60 或 120 FPS，讓動作更流暢。',
    },
  },
} as const;

export default zhTwToolPages;
