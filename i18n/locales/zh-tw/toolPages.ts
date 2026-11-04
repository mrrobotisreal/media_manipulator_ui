/**
 * Traditional Chinese (Taiwan) partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope: MM61 (2026-10-27) added Motion's full page body; MM92 (2026-10-31)
 * added `name` + `tagline` for every tool; MM93 (2026-11-04) added the full
 * body of every non-alias tool page (98), model-written by Opus 5.5; native
 * review pending. Trim is 裁剪 and crop is 裁切; frame rate is 影格率;
 * allowances are 一般工作 and AI 工作 (pricing FAQ). Number words the English
 * spells out are written in characters: the body checker matches ASCII
 * digits with English.
 *
 * Register: neutral Taiwan Traditional Chinese, 你 for the reader; brand names,
 * formats and codecs stay in Latin script; "Motion" and "Darkroom" stay as
 * they are. Model-written, needs native review.
 */

const zhTwToolPages = {
  pages: {
    // MM48: Motion's full page body (model-written, needs native review). The brand stays "Motion".
    motion: {
      name: 'Motion',
      h1: 'Motion',
      tagline: '繪製或匯入 SVG，在關鍵影格時間軸上製作動畫，然後匯出為動態 SVG、Lottie、React、JavaScript、Flutter 或 GIF，全部在你的瀏覽器中完成。',
      intro: 'Motion 是內建於 Media Manipulator 的 SVG 編輯器，附有動畫時間軸。開啟一個 SVG 檔案（或 Lottie 動畫），其中的每個形狀都會成為可選取、移動、變色與製作動畫的圖層；你也可以從空白畫布開始，用矩形、橢圓、線條、鋼筆與文字工具繪圖。你製作動畫的每個屬性都有自己的關鍵影格軌道，並提供緩動預設組、用於自訂緩動的曲線編輯器，以及瞬間切換的保持關鍵影格。一鍵動畫器可加入線條描繪動畫、沿路徑移動、形狀變形、漸層變色、遮罩動畫與模糊。當動態符合你的想法後，就能匯出為動態 SVG、Lottie 檔案、React 元件、JavaScript 或 TypeScript 模組、Flutter 小工具或 GIF。編輯與所有匯出都在瀏覽器中執行，所以你的作品絕不會為了匯出而被上傳。',
      whatItDoes: [
        '將 SVG 檔案匯入為可編輯的圖層樹（群組、路徑、形狀、文字、圖片、漸層、遮罩與剪裁路徑），並將 Lottie JSON 動畫連同關鍵影格一起匯入，每個檔案最大 4 MB。',
        '使用矩形、橢圓、線條、鋼筆（貝茲曲線）與文字工具繪製新作品，並直接在畫布上編輯路徑節點。',
        '在關鍵影格時間軸上為位置、縮放、旋轉、傾斜、不透明度、填色、線條與線條寬度製作動畫，提供線性、緩入、緩出、緩入緩出、自訂三次貝茲曲線與保持等緩動。',
        '提供六種一鍵動畫器：線條描繪動畫、可選擇自動旋轉的沿路徑移動、形狀變形、漸層色標顏色、遮罩與剪裁路徑動畫，以及模糊。',
        '匯出靜態 SVG（一律免費，且絕不計入額度）、不需任何函式庫即可播放的動態 SVG、Lottie JSON、React 元件、JavaScript 或 TypeScript 模組、Flutter 小工具與動態 GIF，全部在你的電腦上產生。',
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
        '只要每個效果都能在 Chrome、Firefox 與 Safari 中以 CSS 表現，動態 SVG 匯出就會使用純 CSS 關鍵影格。形狀變形、移動的漸層色標與模糊需要指令碼，因此這些檔案會在開頭嵌入精簡版的 anime.js（MIT 授權，指令碼約 31 KB，gzip 後約 13 KB）及其授權聲明。',
        '形狀變形會將兩個形狀正規化為相同數量的曲線段，並對齊起點與繞行方向，所以變形不會扭曲。兩個無法對應的形狀會以保持取代變形。',
        'Lottie 寫入器以 Lottie 1.0.1 規範與 LottieFiles 的「Basic」功能集為目標。Lottie 無法承載的內容（例如濾鏡、文字或進階遮罩）會在下載後列出，不會默默捨棄任何東西。讀取器則以同一份清單處理反方向。',
        'GIF 匯出會逐一轉譯影格、將每個影格傳給 Worker，並以為 Media Manipulator 撰寫的編碼器編碼：從分布在整段動畫中的五個影格取樣出單一全域調色盤；預設關閉遞色（平面向量作品顏色很少，遞色只會增加雜訊）；影格延遲為 round(100 / fps) 個百分之一秒；只有在畫布背景透明時才保留透明度。輸出上限為 2 GB，對話方塊會在開始前顯示預估大小。',
        '匯入的 SVG 會在載入時清理：指令碼、事件處理常式、外部參照及其他不安全的內容會被移除，編輯器會依允許清單重建不支援的標記，而不是以 HTML 插入。無法建模的標記會保留為不透明圖層，來回轉換時保持不變。',
        '匯出計數器是單一資料庫交易：先檢查格式鎖定與上限，然後同時寫入計數器與一筆匯出紀錄。被拒絕的匯出不寫入任何資料，也不消耗任何額度；而之後被瀏覽器取消或失敗的匯出，則已經計入。',
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
      workedExamples: [
        {
          title: '以動態 SVG 匯出 2 秒的標誌描繪動畫',
          body: '由幾條路徑組成的文字標誌，套用跨越 2,000 ms 的「描繪」動畫器，匯出為動態 SVG。描繪是 stroke-dasharray 與 stroke-dashoffset 動畫，所有主要瀏覽器都能以 CSS 表現，因此匯出器會寫入一個由 @keyframes 組成的 <style> 區塊，完全不需要指令碼。檔案就是你的 SVG 加上幾百位元組的 CSS，一放進頁面就能播放，並計為一次 svg_animated 匯出：沒有帳號時，這是每天 2 次中的一次，且在訪客 10 秒的長度上限之內；使用免費帳號時，則是 5 次中的一次。匯出是在你瀏覽器中進行的字串轉換，會立即完成。',
        },
        {
          title: '以 GIF 匯出 400 x 400 的變形循環',
          body: '在 400 x 400 畫布上的 2 秒形狀變形，在 Premium 方案上以 25 fps 匯出為 GIF（GIF 預設為 Premium 格式）。對話方塊會限制在方案的高度與影格率預設組內，25 fps 的每格延遲為 round(100 / 25) = 4 個百分之一秒，總共 50 格。預估大小的算法是 像素 x 影格數 x 0.25 位元組 + 1 KB：160,000 x 50 x 0.25 約為 2 MB，刻意偏高估計，而平面的雙色作品通常遠低於此。影格在主執行緒上轉譯，並在 Worker 中逐一編碼，因此記憶體只需容納幾個影格加上逐漸增大的檔案；時間主要花在將 50 格 SVG 點陣化，在筆電上只需幾秒。',
        },
      ],
      whenNotToUse: 'Motion 為向量作品製作動畫，不能編輯影片或相片。如果你的起點是實拍畫面，Darkroom 才是適合的編輯器，而影片轉 GIF 頁面可以把片段變成 GIF。它也不是處理複雜點陣圖的向量化工具：把相片描繪成路徑會非常笨重，結果也做不出有意義的動畫。依賴濾鏡、文字效果或進階遮罩的動畫，無法在 Lottie 匯出中完整保留（對話方塊會列出被捨棄的內容），所以針對這類目標，請使用動態 SVG、React 或 JavaScript 匯出。此外，MP4 或 WebM 輸出取決於瀏覽器的 WebCodecs 支援與你的方案，所以在規劃影片成品之前，請先查看方案表格。',
      whyMediaManipulator: [
        '這是真正的圖層與關鍵影格編輯器，具備保持、自訂曲線與進階動畫器，而不是範本圖庫。',
        '同時面向設計師與開發者的匯出：從同一個專案輸出動態 SVG、Lottie、React、JavaScript 或 TypeScript、Flutter 與 GIF。',
        '匯出在瀏覽器中製作，匯出所使用的唯一第三方程式碼都採用寬鬆授權（MIT 的 anime.js、Flutter 用的 flutter_svg 與 webview_flutter），其授權聲明會保留在檔案中。',
      ],
      privacyNote: '編輯與匯出都在你的瀏覽器中進行；你的作品不會為了匯出而被上傳。沒有帳號時，專案只會保留在此瀏覽器中。如果你登入並將專案儲存到帳號，經過清理的文件（最大 4 MB）與一張縮圖會像 Darkroom 專案一樣儲存在我們的伺服器上，遵循你選擇的保留期限，並可從帳號頁面刪除。對於每次計入額度的匯出，我們只會記錄其格式、高度、影格率、長度與時間，並以你的帳號或工作階段作為擁有者，用來執行每日額度；匯出紀錄中絕不包含作品本身。',
      faq: [
        {
          question: 'Motion 是免費的嗎？',
          answer: '是的。開啟 Motion、繪圖、製作動畫、儲存在此瀏覽器中，以及匯出靜態 SVG，都是免費且無限制的，也不需要帳號。動畫匯出會計入每日額度，額度依你的方案而定：預設為沒有帳號時每天 2 次（僅限動態 SVG）、免費帳號 5 次、Premium 30 次、Pro 150 次。本頁的方案表格列出了每個方案即時的額度與格式。',
        },
        {
          question: '可以匯出哪些格式？',
          answer: '靜態 SVG、動態 SVG（CSS，或在需要時加上一小段內嵌指令碼）、Lottie JSON、React 元件（.tsx）、JavaScript 或 TypeScript 模組、Flutter 小工具（.dart）與動態 GIF。預設情況下，動態 SVG 適用於所有方案，Lottie 從免費帳號起提供，React、JS/TS、Flutter 與 GIF 則從 Premium 起提供。你的方案包含其中哪些格式，以及每天可以匯出幾次，都列在本頁的方案表格中。',
        },
        {
          question: '有什麼限制？',
          answer: '動畫匯出按日計算，並在 UTC 午夜重設；被拒絕的匯出不會計入，但在計數之後才取消的匯出則會計入。沒有帳號的訪客只能將專案儲存在瀏覽器中，且可匯出最長 10 秒的動畫；免費帳號可將 3 個專案儲存到帳號，Premium 可儲存 25 個，Pro 則沒有限制。SVG 與 Lottie 匯入各以 4 MB 為上限，GIF 匯出則以 50 fps 與 2 GB 輸出為上限。所有目前的數字都列在本頁的方案表格與價格頁面上。',
        },
        {
          question: '我可以為自己現有的 SVG 製作動畫嗎？',
          answer: '可以。匯入任何 SVG，其中的群組、路徑、形狀、文字、漸層、遮罩與剪裁路徑都會成為可編輯的圖層。編輯器無法編輯的部分（例如圖樣或複雜濾鏡）會保留下來並原樣匯出，而任何不安全的內容（指令碼、事件處理常式或外部連結）都會被移除，並在匯入後列出。',
        },
        {
          question: '支援 Lottie 嗎？',
          answer: '支援，而且是雙向的。你可以匯入 Lottie JSON 檔案來編輯（在免費方案及以上方案中，匯入計為一個單位），也可以將動畫匯出為 Lottie JSON，供 lottie-web 以及 iOS、Android 與 Flutter 的 Lottie 播放器使用。任一方無法表現的功能都會列在對話方塊中，而不是默默捨棄。',
        },
        {
          question: '哪些瀏覽器支援影片匯出？',
          answer: 'GIF 匯出在所有現代瀏覽器中都能運作。MP4 與 WebM 匯出依賴瀏覽器內建的影片編碼器 WebCodecs，可在 Chrome 與 Edge 中使用，近期版本的 Safari 與 Firefox 則視編解碼器而定；匯出對話方塊會檢查你的瀏覽器，並在無法編碼時告知你。本頁的方案表格列出了每種影片格式包含在哪個方案中。',
        },
        {
          question: '匯出的程式碼適用什麼授權？',
          answer: '你的動畫屬於你。當動態 SVG 或程式碼匯出需要執行環境時，會使用採用 MIT 授權的 anime.js；其著作權聲明寫在檔案頂端，必須保留在那裡。Flutter 匯出使用 flutter_svg（MIT）或 webview_flutter（BSD-3-Clause）套件。檔案中的其他所有內容都由你的專案產生。編輯器使用的開源函式庫列在我們的授權頁面上。',
        },
        {
          question: '我的專案儲存在哪裡？',
          answer: '沒有帳號時，專案只會保留在此瀏覽器中，所以清除瀏覽器資料會將它們刪除。登入後，你可以將專案儲存到帳號；之後它會在裝置之間同步、在你工作時自動儲存、遵循你選擇的保留期限，並可從帳號頁面刪除。',
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
      featureList: [
        '將 SVG 匯入為可編輯圖層',
        'Lottie JSON 匯入',
        '矩形、橢圓、線條、鋼筆與文字工具',
        '附緩動預設組、自訂三次貝茲曲線與保持關鍵影格的關鍵影格時間軸',
        '線條描繪、沿路徑移動、形狀變形、漸層、遮罩與模糊動畫器',
        '靜態 SVG 匯出',
        '動態 SVG 匯出（CSS 或內嵌 anime.js 執行環境）',
        'Lottie JSON 匯出',
        'React、JavaScript、TypeScript 與 Flutter 程式碼匯出',
        '動態 GIF 匯出',
        '專案可儲存在瀏覽器或你的帳號中',
      ],
    },
    // 2026-10-28 catalog expansion: name + tagline for the /tools catalog cards (model-written, needs native review).
    'inspect-metadata': {
      name: '中繼資料檢視器',
      h1: '線上檢視檔案中繼資料',
      tagline: '在分享之前，查看照片、影片、音訊檔案或 PDF 中隱藏的所有標籤：EXIF、GPS 位置、相機、編解碼器、ID3、XMP 等。',
      metaTitle: '線上檢視檔案中繼資料：EXIF、GPS、編解碼器、ID3 | Media Manipulator',
      metaDescription: '免費線上中繼資料檢視器，適用於圖片、影片、音訊與 PDF。查看 EXIF、地圖上的 GPS 座標、相機與鏡頭、編解碼器與位元率、ID3 標籤、XMP 和 IPTC。無需註冊。',
      ogTitle: '線上檢視檔案中繼資料',
      ogDescription: '你檔案中的每個 EXIF、GPS、編解碼器、ID3 與 XMP 標籤，分組且可搜尋，並標出私密的標籤。',
      intro: '檔案承載的不只是像素與取樣資料。手機相片會記錄拍攝的地點、時間與裝置；影片會註明其編碼器與位元率；MP3 帶有 ID3 標籤與專輯封面；PDF 則儲存作者與製作它的軟體。Media Manipulator 中繼資料檢視器會在我們的伺服器上以 ExifTool 與 ffprobe 讀取這一切，將其分為相機、位置、裝置、時間、編解碼器與文件等區段，並標出可能識別出你身分的項目，讓你在檔案離手之前決定要移除什麼。',
      whatItDoes: [
        '讀取 JPG、PNG、WebP、HEIC、AVIF、TIFF 與 RAW 衍生圖片中的 EXIF、GPS、IPTC、XMP 與 ICC 資料。',
        '讀取 MP4、MOV、MKV、WebM 與其他影片檔案中的容器、串流、編解碼器、位元率、影格率與章節資料。',
        '讀取 MP3、M4A、FLAC、OGG 與 WAV 中的 ID3、Vorbis 與 MP4 標籤、封面圖片與編碼器設定。',
        '讀取 PDF 中的作者、製作程式、建立日期與頁數。',
        '在地圖輪廓上顯示 GPS 座標，並標出每個涉及隱私的項目。',
        '提供 ExifTool 與 ffprobe 的原始輸出，任何區塊都能一鍵複製。',
      ],
      flowSteps: [
        {
          title: '上傳檔案',
          description: '圖片、影片、音訊或 PDF。',
        },
        {
          title: '我們讀取檔案',
          description: 'ExifTool 與 ffprobe 在我們的伺服器上執行。',
        },
        {
          title: '瀏覽報告',
          description: '分組、可搜尋，並標出私密項目。',
        },
        {
          title: '做決定',
          description: '如有需要，用 EXIF 工具移除中繼資料。',
        },
      ],
      advancedDetails: [
        '圖片與 PDF 會自動檢視；超過 100 MB 的影片與音訊會等你點選後才處理，避免意外上傳大型檔案。',
        '音訊檔案中嵌入的封面圖片會以圖片項目回報，而不是視訊串流。',
        '報告使用的中繼資料目錄，與 EXIF 移除工具以及每次轉換的結果檢視器所使用的相同。',
      ],
      whyItMatters: [
        '從手機分享的相片可能透過其 GPS 標籤洩露你的住家地址。',
        '了解影片真正的編解碼器、位元率與影格率，就能解釋它為什麼能或不能在某處播放。',
        '文件中繼資料會列出作者與編輯軟體，這對你匿名發布的任何內容都很重要。',
      ],
      useCases: [
        {
          title: '發布相片之前',
          description: '檢查是否有 GPS 座標與裝置序號。',
        },
        {
          title: '排查影片問題',
          description: '查看真正的編解碼器、設定檔、影格率與音訊聲道配置。',
        },
        {
          title: '檢查音樂檔案',
          description: '確認標籤、位元率，以及它是否由較低位元率轉碼而來。',
        },
        {
          title: '檢閱 PDF',
          description: '查看作者欄位列出的是誰，以及是哪個軟體產生的。',
        },
      ],
      whyMediaManipulator: [
        '一個檢視器就能處理圖片、影片、音訊與 PDF，不必使用四個不同的工具。',
        '涉及隱私的項目會被標出，並可直接前往移除。',
        '不轉換、不需帳號。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ],
      privacyNote: '你的檔案由我們伺服器上的 ExifTool 與 ffprobe 讀取，報告會傳回你的瀏覽器，暫存副本則在報告完成後立即刪除。沒有任何第三方會看到檔案或其標籤。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      faq: [
        {
          question: '檢視檔案會更動它嗎？',
          answer: '不會。檔案被讀取、產生報告，並在分析後刪除。不會寫回任何內容。',
        },
        {
          question: '可以移除檢視器找到的內容嗎？',
          answer: '可以。圖片請使用「移除 EXIF 中繼資料」工具；它會移除所有內容，並顯示前後差異比較。',
        },
        {
          question: '為什麼大型影片需要點選？',
          answer: '超過 100 MB 的影片與音訊只會在你要求時上傳，所以你絕不會意外送出大型檔案。',
        },
        {
          question: '這會計入我的每日轉換次數嗎？',
          answer: '不會。檢視是免費的，不會消耗一般工作次數。',
        },
        {
          question: '資料會傳送給第三方嗎？',
          answer: '不會。ExifTool 與 ffprobe 在我們自己的伺服器上執行，檔案事後會被刪除。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '檢視是唯讀的，不算作一次轉換。',
        ],
      },
      related: [
        {
          label: '移除 EXIF 中繼資料',
          to: '/tools/remove-exif-metadata',
          description: '移除檢視器找到的所有內容。',
        },
        {
          label: '編輯圖片中繼資料',
          to: '/tools/edit-image-metadata',
          description: '重寫標題、作者、著作權與 GPS。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '保留或不保留中繼資料進行轉換。',
        },
      ],
      embed: {
        title: '檢視檔案',
        description: '放入圖片、影片、音訊檔案或 PDF。報告會依類別將每個標籤分組，標出可識別你或你所在位置的標籤，並提供 ExifTool 與 ffprobe 的原始檢視。',
      },
    },
    'edit-image-metadata': {
      name: '編輯圖片中繼資料',
      h1: '線上編輯圖片中繼資料',
      tagline: '設定相片的標題、作者、著作權、關鍵字和說明，修正或移除其 GPS 位置，並重寫 EXIF 與 IPTC 標籤。',
      metaTitle: '線上編輯圖片中繼資料：EXIF、IPTC、著作權、GPS | Media Manipulator',
      metaDescription: '免費線上圖片中繼資料編輯器。設定標題、作者、著作權、說明與關鍵字，取代或移除 GPS 位置，並編輯 JPG、PNG、WebP 等格式的 EXIF 與 IPTC 標籤。',
      ogTitle: '線上編輯圖片中繼資料',
      ogDescription: '寫入著作權聲明、修正位置、設定關鍵字。免費，無需註冊。',
      intro: '攝影師需要在交付的每個檔案中加入著作權聲明與聯絡資訊。圖庫機構需要 IPTC 關鍵字與圖說。任何分享相片的人都可能想移除位置，或把位置設為某個城市，而不是精確到家門口。Media Manipulator 會在我們的伺服器上以 ExifTool 直接改寫 EXIF、IPTC 與 XMP 欄位，保持影像資料不變，並向你顯示前後差異比較。',
      whatItDoes: [
        '設定標題、作者／藝術家、說明、著作權、註解與關鍵字。',
        '移除 GPS 位置，或以你選擇的座標取代。',
        '依名稱編輯個別的 EXIF/TIFF、IPTC 與進階標籤。',
        '保持像素不變；也可選擇在同一次處理中轉換格式。',
        '在工作完成後顯示變更內容的差異比較。',
      ],
      flowSteps: [
        {
          title: '上傳圖片',
          description: 'JPG、PNG、WebP、HEIC、TIFF。',
        },
        {
          title: '填寫欄位',
          description: '標題、作者、著作權、關鍵字、位置。',
        },
        {
          title: '套用',
          description: 'ExifTool 在我們的伺服器上重寫標籤。',
        },
        {
          title: '下載',
          description: '比較前後差異，然後儲存。',
        },
      ],
      advancedDetails: [
        '自訂中繼資料模式會同時寫入標準 EXIF（Artist、Copyright、ImageDescription）、IPTC（Keywords、Caption）與 XMP（dc:title、dc:creator）的對應欄位，讓每個檢視器顯示一致的內容。',
        '取代 GPS 位置時，會寫入 GPSLatitude/GPSLongitude 並附上正確的參考半球；移除位置則會清除每個 GPS 標籤。',
        'PNG 與 WebP 的中繼資料存放在文字區塊與 XMP 中；相同的欄位也會寫入那裡。',
      ],
      whyItMatters: [
        '嵌入檔案的著作權聲明會在檔案被轉貼時隨之傳遞。',
        'IPTC 中的關鍵字與圖說，正是圖庫機構與 DAM 系統建立索引的依據。',
        '將位置設為城市，能在保留相片地理標記的同時保護你的住家。',
      ],
      useCases: [
        {
          title: '交付客戶相片',
          description: '在每個檔案中嵌入你的姓名、著作權與聯絡方式。',
        },
        {
          title: '圖庫投稿',
          description: '加入 IPTC 關鍵字與圖說。',
        },
        {
          title: '粗略地理標記',
          description: '將精確的 GPS 定位改為市中心。',
        },
        {
          title: '修正錯誤的標籤',
          description: '更正掃描器寫入的作者或日期。',
        },
      ],
      whyMediaManipulator: [
        '同時寫入 EXIF、IPTC 與 XMP，而不只是其中之一。',
        '前後差異比較，讓你清楚看到變更了什麼。',
      ],
      privacyNote: '你圖片的標籤會由我們伺服器上的 ExifTool 以你輸入的值重寫；像素維持原樣。沒有任何第三方會看到檔案或其標籤。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      faq: [
        {
          question: '編輯中繼資料會重新編碼我的 JPG 嗎？',
          answer: '只有在你變更輸出格式或調整尺寸時才會。若格式相同且未編輯像素，影像資料會直接複製，只有標籤會被重寫。',
        },
        {
          question: '可以移除位置、保留其他所有內容嗎？',
          answer: '可以。勾選「移除位置資料」，其他欄位保持不動即可。',
        },
        {
          question: '可以編輯未列出的標籤嗎？',
          answer: '可以。展開進階區段，即可依名稱設定任何 EXIF 或 IPTC 標籤。',
        },
        {
          question: '如何改為移除所有內容？',
          answer: '使用「移除 EXIF 中繼資料」工具，一鍵移除每個標籤。',
        },
      ],
      related: [
        {
          label: '檢視中繼資料',
          to: '/tools/inspect-metadata',
          description: '先查看檔案中有什麼。',
        },
        {
          label: '移除 EXIF 中繼資料',
          to: '/tools/remove-exif-metadata',
          description: '移除所有內容。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在圖片格式之間轉換。',
        },
        {
          label: '裁切圖片',
          to: '/tools/crop-image',
          description: '裁切到某個區域。',
        },
        {
          label: '調整圖片尺寸',
          to: '/tools/image-resizer',
          description: '變更尺寸。',
        },
        {
          label: '為圖片加入文字',
          to: '/tools/add-text-to-image',
          description: '加上圖說或浮水印。',
        },
        {
          label: '圖片濾鏡',
          to: '/tools/image-filters',
          description: '懷舊、素描、浮雕等效果。',
        },
      ],
      embed: {
        title: '編輯圖片的中繼資料',
        description: '上傳圖片。中繼資料區段會以自訂模式開啟：填寫標題、作者、著作權、關鍵字，取代或移除 GPS 位置，需要時再展開進階標籤。除非你同時變更格式，否則圖片像素會維持原樣。',
      },
    },
    'change-video-speed': {
      name: '變更影片速度',
      h1: '線上變更影片速度：加速或減速',
      tagline: '以 2 倍、4 倍或更快的速度製作縮時影片，或將片段減速到 0.5 倍或 0.25 倍，音訊保持同步。',
      metaTitle: '線上免費變更影片速度：加速或慢動作 | Media Manipulator',
      metaDescription: '免費線上影片變速工具。將影片加速到 1.5 倍、2 倍或 4 倍做成縮時影片，或減速到 0.5 倍或 0.25 倍。音訊保持同步。輸出 MP4，無浮水印。',
      ogTitle: '線上免費變更影片速度',
      ogDescription: '將任何影片加速或減速，範圍從 0.25 倍到 4 倍。音訊保持同步。免費，無需註冊。',
      intro: '拖沓冗長的螢幕錄影、需要濃縮成十秒縮時的夕陽、值得用慢動作呈現的滑板招式：變更播放速度是最常見的影片編輯之一，不應該非得開啟桌面剪輯軟體。Media Manipulator 在我們的伺服器上用 FFmpeg 同時重新調整畫面與聲音的時間，速度範圍從四分之一到四倍，並匯出在任何地方都以新速度播放的 MP4。',
      whatItDoes: [
        '將任何影片加速（1.25 倍到 4 倍）或減速（0.25 倍到 0.9 倍）。',
        '以保留音高的節奏縮放重新調整音訊時間，讓人聲聽起來依然自然。',
        '保留解析度與畫質；預設匯出 MP4，也可選擇任何支援的容器格式。',
        '可在同一次處理中搭配裁剪、調整尺寸或色彩調整。',
      ],
      flowSteps: [
        {
          title: '上傳影片',
          description: '任何常見的影片格式。',
        },
        {
          title: '設定速度',
          description: '0.25 倍到 4 倍；預設為 2 倍。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 重新調整影片與音訊的時間。',
        },
        {
          title: '下載',
          description: '儲存新的 MP4。',
        },
      ],
      advancedDetails: [
        '影片使用 setpts 縮放顯示時間戳記；音訊使用 atempo，倍率超出 0.5 到 2.0 時會串接多個 atempo。',
        '減速不會憑空產生影格；若要流暢的慢動作，請在減速後使用 AI 影格插補。',
        '影格率保持不變，因此 4 倍速的縮時影片只有原始影格的四分之一。',
      ],
      whyItMatters: [
        '縮時影片與精華回顧以 2 倍到 4 倍速播放時好看得多。',
        '慢動作讓運動與動作片段看得一清二楚。',
        '教學影片與螢幕錄影通常以 1.25 倍到 1.5 倍速觀看效果更好。',
      ],
      useCases: [
        {
          title: '縮時影片',
          description: '把一小時的組裝、烹飪或繪畫過程壓縮成幾分鐘。',
        },
        {
          title: '慢動作',
          description: '把運動或寵物片段減速到一半速度。',
        },
        {
          title: '更快的教學影片',
          description: '加速螢幕錄影，聲音也不會變成花栗鼠般的尖細嗓音。',
        },
        {
          title: '配合音樂節奏',
          description: '把片段微調到 1.1 倍，讓它對上節拍。',
        },
      ],
      whyMediaManipulator: [
        '音訊會在保留音高的情況下重新調整時間，不會脫節，也不會變成花栗鼠聲。',
        '可在同一個表單中搭配倒轉、裁剪與色彩調整。',
      ],
      privacyNote: '你的影片由我們伺服器上的 FFmpeg 加速或減速，音訊節奏也會隨之調整。處理在我們自己的伺服器上進行，不使用第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的原始檔案不會被變更，結果會是一個新檔案。',
      faq: [
        {
          question: '音訊會保持同步嗎？',
          answer: '會。音訊會以相同的倍率縮放節奏，並保留音高。',
        },
        {
          question: '最高速度是多少？',
          answer: '單次處理最快 4 倍、最慢 0.25 倍。若需要更多，請將結果再次交給這個工具處理。',
        },
        {
          question: '慢動作看起來會流暢嗎？',
          answer: '減速會重複影格。若要真正流暢的慢動作，請先在這裡將片段減速，再使用 AI 影格插補。',
        },
        {
          question: '我可以改成把音訊靜音嗎？',
          answer: '可以。請先使用「移除影片中的音訊」工具，或匯出為本身沒有音訊的 GIF。',
        },
      ],
      related: [
        {
          label: 'AI 影格插補',
          to: '/tools/ai-frame-interpolation',
          description: '以產生的影格做出流暢的慢動作。',
        },
        {
          label: '影片轉換器',
          to: '/tools/video-converter',
          description: '在各種影片格式之間轉換。',
        },
        {
          label: '影片倒轉',
          to: '/tools/reverse-video',
          description: '倒著播放片段。',
        },
        {
          label: '翻轉影片',
          to: '/tools/flip-video',
          description: '水平或垂直鏡像。',
        },
        {
          label: '影片穩定',
          to: '/tools/stabilize-video',
          description: '消除畫面晃動。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '縮小檔案。',
        },
        {
          label: '影片裁剪',
          to: '/tools/video-trimmer',
          description: '剪出指定範圍。',
        },
      ],
      embed: {
        title: '變更影片的速度',
        description: '上傳影片並設定速度倍率：大於 1 為加速，小於 1 為減速。預設為 2 倍。音訊會重新調整時間以配合，因此加速後的人聲依然聽得清楚。',
      },
    },
    'reverse-video': {
      name: '影片倒轉',
      h1: '線上免費倒轉影片',
      tagline: '倒著播放任何片段，可選擇是否一併倒轉音訊，也可以做成先正播再倒播的往返效果。',
      metaTitle: '線上免費倒轉影片：倒著播放、乒乓循環 | Media Manipulator',
      metaDescription: '免費線上影片倒轉工具。倒著播放影片，也可一併倒轉音訊，或製作先正播再倒播的乒乓循環。輸出 MP4 或 GIF，無浮水印，無需註冊。',
      ogTitle: '線上免費倒轉影片',
      ogDescription: '倒著播放片段，或製作先正播再倒播的循環。免費，無需註冊。',
      intro: '倒轉影片的效果比網際網路還古老，至今依然有效：碎裂的玻璃重新拼合、跳水者從泳池中躍出、四散的人群重新聚攏。Media Manipulator 在我們的伺服器上用 FFmpeg 倒轉任何片段的影格，也可選擇一併倒轉音訊；乒乓選項會接上正向的副本，讓結果無縫循環，這正是大多數社群與 GIF 用途所需要的。',
      whatItDoes: [
        '倒轉任何片段的影片影格。',
        '一併倒轉音訊，或捨棄音訊得到無聲的結果。',
        '乒乓模式先正播再倒播，形成無縫循環。',
        '匯出 MP4、WebM 或動態 GIF。',
      ],
      flowSteps: [
        {
          title: '上傳片段',
          description: '短片效果最好；倒轉時會將整個片段載入記憶體。',
        },
        {
          title: '選擇倒轉或乒乓',
          description: '預設為倒轉。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 倒轉影格與音訊。',
        },
        {
          title: '下載',
          description: '影片選 MP4，循環選 GIF。',
        },
      ],
      advancedDetails: [
        '倒轉會緩衝片段的每一個影格，因此很長的片段或 4K 片段需要更多時間與記憶體；先裁剪可獲得最佳效果。',
        '音訊使用 areverse 濾鏡；若要無聲的倒轉片段，請先移除音訊。',
        '乒乓會串接正向與倒轉的串流，長度因此加倍。',
      ],
      whyItMatters: [
        '倒轉與回力鏢片段是社群短影音的常見手法。',
        '乒乓循環能隱藏一般循環會露出的剪接點。',
        '倒轉也是製作「倒帶」轉場的簡便方法。',
      ],
      useCases: [
        {
          title: '回力鏢式循環',
          description: '把兩秒的片段變成無縫的來回播放。',
        },
        {
          title: '倒轉揭曉',
          description: '倒著播放開箱或組裝過程。',
        },
        {
          title: '倒帶轉場',
          description: '倒轉幾秒鐘，用來在場景之間切換。',
        },
        {
          title: '倒轉 GIF',
          description: '直接匯出為 GIF，用於聊天與論壇。',
        },
      ],
      whyMediaManipulator: [
        '一個開關即可切換倒轉與乒乓，音訊也會正確處理。',
        '可在同一個表單中先裁剪，再匯出 GIF。',
      ],
      privacyNote: '你的片段由我們伺服器上的 FFmpeg 解碼，並倒著寫入一個新檔案。處理在我們自己的伺服器上進行，不使用第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的原始檔案不會被變更，結果會是一個新檔案。',
      faq: [
        {
          question: '音訊也會倒轉嗎？',
          answer: '會，這是預設行為。如果想要無聲的片段，請先移除音訊。',
        },
        {
          question: '什麼是乒乓？',
          answer: '片段先正向播放，再反向播放，因此循環時不會出現明顯的跳接。',
        },
        {
          question: '有長度限制嗎？',
          answer: '倒轉時會將整個片段保留在記憶體中。一兩分鐘的片段沒有問題；較長的影片請先裁剪。',
        },
        {
          question: '可以輸出 GIF 嗎？',
          answer: '可以。選擇 GIF 作為輸出格式即可；它非常適合乒乓循環。',
        },
      ],
      related: [
        {
          label: '影片轉 GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: '製作循環播放的 GIF。',
        },
        {
          label: '影片轉換器',
          to: '/tools/video-converter',
          description: '在各種影片格式之間轉換。',
        },
        {
          label: '變更影片速度',
          to: '/tools/change-video-speed',
          description: '縮時或慢動作。',
        },
        {
          label: '翻轉影片',
          to: '/tools/flip-video',
          description: '水平或垂直鏡像。',
        },
        {
          label: '影片穩定',
          to: '/tools/stabilize-video',
          description: '消除畫面晃動。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '縮小檔案。',
        },
        {
          label: '影片裁剪',
          to: '/tools/video-trimmer',
          description: '剪出指定範圍。',
        },
      ],
      embed: {
        title: '倒轉影片',
        description: '上傳片段。「時間類效果」區段中已開啟倒轉；若要先正播再倒播的循環，請改為開啟乒乓。匯出 MP4 或 GIF。',
      },
    },
    'flip-video': {
      name: '翻轉與鏡像影片',
      h1: '線上免費翻轉或鏡像影片',
      tagline: '一鍵將影片水平鏡像，修正反向的網路攝影機或自拍畫面，也可以垂直翻轉。',
      metaTitle: '線上免費翻轉或鏡像影片 | Media Manipulator',
      metaDescription: '免費線上影片翻轉工具。將影片水平鏡像（修正左右相反的自拍與網路攝影機畫面），或垂直翻轉。輸出 MP4，無浮水印，無需註冊。',
      ogTitle: '線上免費翻轉或鏡像影片',
      ogDescription: '修正鏡像的自拍影片，或將片段上下翻轉。免費，無需註冊。',
      intro: '前鏡頭與網路攝影機常常錄下鏡像畫面：文字變成反的，頭髮分線也跑到另一邊。只要將片段鏡像一次就能恢復正常。Media Manipulator 在我們的伺服器上用 FFmpeg 水平或垂直翻轉影片，並重新編碼，讓翻轉直接寫入影格，匯出的 MP4 在每個播放器中都能正確播放。',
      whatItDoes: [
        '將影片水平鏡像（左右）或垂直翻轉（上下）。',
        '可在同一次處理中搭配 90°、180° 或 270° 旋轉。',
        '將變形直接寫入影格，不依賴旋轉標記。',
        '預設匯出 MP4，也可選擇任何支援的容器格式。',
      ],
      flowSteps: [
        {
          title: '上傳影片',
          description: '任何常見格式。',
        },
        {
          title: '選擇翻轉方式',
          description: '預設為水平翻轉；可加上垂直翻轉或旋轉。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 套用 hflip/vflip 並重新編碼。',
        },
        {
          title: '下載',
          description: '儲存修正後的 MP4。',
        },
      ],
      advancedDetails: [
        '水平翻轉使用 hflip 濾鏡，垂直翻轉使用 vflip；兩者在幾何上都是無損的，並會重新編碼影格。',
        '鏡像加上 180° 旋轉等同於垂直翻轉；面板讓你自由組合兩者。',
        'MP4 輸出使用 H.264 + AAC + yuv420p + faststart。',
      ],
      whyItMatters: [
        '鏡像的自拍影片會讓畫面上的文字無法閱讀。',
        '有些上下顛倒安裝的運動攝影機需要垂直翻轉，而不是旋轉。',
        '鏡像副本是讓舞蹈或運動教學更容易跟著做的快速方法。',
      ],
      useCases: [
        {
          title: '修正鏡像自拍',
          description: '讓文字與標誌正確顯示。',
        },
        {
          title: '倒裝的攝影機',
          description: '翻轉倒裝攝影機拍下的畫面。',
        },
        {
          title: '教學用鏡像',
          description: '將示範動作鏡像，讓觀眾可以直接跟著做。',
        },
        {
          title: '配合鏡頭',
          description: '將片段鏡像，讓主體朝向另一邊。',
        },
      ],
      whyMediaManipulator: [
        '在同一個變形區段中翻轉與旋轉，並直接寫入影格。',
        '可在同一次上傳中裁剪、調整尺寸與調整色彩。',
      ],
      privacyNote: '你的影片由我們伺服器上的 FFmpeg 水平或垂直鏡像。處理在我們自己的伺服器上進行，不使用第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的原始檔案不會被變更，結果會是一個新檔案。',
      faq: [
        {
          question: '鏡像和翻轉有什麼不同？',
          answer: '鏡像（水平翻轉）會左右對調。垂直翻轉會上下對調。',
        },
        {
          question: '翻轉是永久的嗎？',
          answer: '是的。影格會在套用翻轉後重新編碼，因此每個播放器都會顯示翻轉後的畫面。',
        },
        {
          question: '也可以旋轉嗎？',
          answer: '可以。旋轉位於同一個「幾何變形」區段，你也可以使用專門的「旋轉影片」工具。',
        },
        {
          question: '翻轉會降低畫質嗎？',
          answer: '重新編碼會有些微損失；選擇高畫質即可讓損失小到可以忽略。',
        },
      ],
      related: [
        {
          label: '旋轉影片',
          to: '/tools/rotate-video',
          description: '90°、180°、270°。',
        },
        {
          label: '影片轉換器',
          to: '/tools/video-converter',
          description: '在各種影片格式之間轉換。',
        },
        {
          label: '變更影片速度',
          to: '/tools/change-video-speed',
          description: '縮時或慢動作。',
        },
        {
          label: '影片倒轉',
          to: '/tools/reverse-video',
          description: '倒著播放片段。',
        },
        {
          label: '影片穩定',
          to: '/tools/stabilize-video',
          description: '消除畫面晃動。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '縮小檔案。',
        },
        {
          label: '影片裁剪',
          to: '/tools/video-trimmer',
          description: '剪出指定範圍。',
        },
      ],
      embed: {
        title: '翻轉或鏡像影片',
        description: '上傳影片。「幾何變形」區段中已預先選取水平翻轉（鏡像）；你可以改為開啟垂直翻轉，或兩者同時開啟。旋轉也在同一個區段中。',
      },
    },
    'stabilize-video': {
      name: '影片穩定',
      h1: '線上免費穩定晃動的影片',
      tagline: '以雙遍穩定演算法消除手持晃動和走路時的彈跳，不需要腳架，也不需要桌面剪輯軟體。',
      metaTitle: '線上免費穩定晃動的影片 | Media Manipulator',
      metaDescription: '免費線上影片穩定工具。以 FFmpeg 的動態平滑減少手持晃動與走路時的彈跳。強度可調整，輸出 MP4，無浮水印，無需註冊。',
      ogTitle: '線上免費穩定晃動的影片',
      ogDescription: '消除任何片段中的攝影機晃動。免費，無需註冊。',
      intro: '手持拍攝的畫面會晃動，而一點點晃動在大螢幕上會被放大很多。軟體穩定會追蹤影格之間的移動、平滑攝影機的運動路徑，並從邊緣裁掉一些畫面來隱藏修正的痕跡。Media Manipulator 在我們的伺服器上執行 FFmpeg 的動態補償穩定器，強度可調整，讓走路拍攝的 Vlog 或放大拍攝的手機片段明顯變得更穩。',
      whatItDoes: [
        '分析影格之間的移動，並平滑攝影機的運動路徑。',
        '可調整晃動程度（預期有多少晃動）與精確度（搜尋得多仔細）。',
        '稍微裁切以隱藏修正痕跡；縮放會自動套用。',
        '預設匯出 MP4；可在同一次處理中搭配裁剪與色彩調整。',
      ],
      flowSteps: [
        {
          title: '上傳晃動的片段',
          description: '任何常見格式。',
        },
        {
          title: '保留或微調強度',
          description: '預設值適合手持手機拍攝的畫面。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 估算並補償移動。',
        },
        {
          title: '下載',
          description: '比較更穩定的結果。',
        },
      ],
      advancedDetails: [
        '使用 FFmpeg 的 deshake 動態補償濾鏡；晃動程度設定搜尋範圍，精確度設定搜尋深度。',
        '穩定無法修正影格中已存在的動態模糊；它只會消除影格之間的抖動。',
        '邊緣會有少量裁切，裁切多寡與攝影機移動的幅度成正比。',
      ],
      whyItMatters: [
        '穩定的畫面看起來更專業，也更容易觀看。',
        '邊走邊用手機拍攝的片段是最常見的情況，而且穩定效果很好。',
        '穩定後的片段壓縮效果更好，因為影格之間變化的畫面較少。',
      ],
      useCases: [
        {
          title: '走路 Vlog',
          description: '去除手持邊走邊說時的彈跳。',
        },
        {
          title: '放大拍攝的手機影片',
          description: '穩定以最大變焦拍攝的演唱會或野生動物片段。',
        },
        {
          title: '汽車或自行車支架',
          description: '減少儀表板或車把支架帶來的震動。',
        },
        {
          title: '製作 GIF 之前',
          description: '先穩定畫面，讓循環不會抖動。',
        },
      ],
      whyMediaManipulator: [
        '真正的動態補償，強度設定公開可調，而不是藏起來。',
        '可在同一個表單中裁剪、變速與調整色彩。',
      ],
      privacyNote: '你的畫面由我們伺服器上 FFmpeg 的 deshake 濾鏡分析晃動並加以平滑。處理在我們自己的伺服器上進行，不使用第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的原始檔案不會被變更，結果會是一個新檔案。',
      faq: [
        {
          question: '會裁切我的影片嗎？',
          answer: '會稍微裁切。穩定器會移動影格以抵消晃動，並稍微放大以隱藏移動的邊緣。',
        },
        {
          question: '可以修正模糊嗎？',
          answer: '不行。影格內的模糊無法還原；穩定只會讓影格之間的移動變得平穩。',
        },
        {
          question: '應該使用什麼設定？',
          answer: '從預設值開始。畫面非常晃時提高晃動程度；結果仍有漂移時提高精確度。',
        },
        {
          question: '支援 4K 嗎？',
          answer: '支援，但處理時間較長。可以考慮在同一次處理中將尺寸調整為 1080p。',
        },
      ],
      related: [
        {
          label: 'AI 影片修復',
          to: '/tools/ai-video-restoration',
          description: '用 AI 降噪、去模糊並放大。',
        },
        {
          label: '影片轉換器',
          to: '/tools/video-converter',
          description: '在各種影片格式之間轉換。',
        },
        {
          label: '變更影片速度',
          to: '/tools/change-video-speed',
          description: '縮時或慢動作。',
        },
        {
          label: '影片倒轉',
          to: '/tools/reverse-video',
          description: '倒著播放片段。',
        },
        {
          label: '翻轉影片',
          to: '/tools/flip-video',
          description: '水平或垂直鏡像。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '縮小檔案。',
        },
        {
          label: '影片裁剪',
          to: '/tools/video-trimmer',
          description: '剪出指定範圍。',
        },
      ],
      embed: {
        title: '穩定影片',
        description: '上傳晃動的片段。「時間類效果」區段中已開啟影片穩定；如果預設效果太弱或裁切太多，請調整晃動程度與精確度。',
      },
    },
    'change-video-frame-rate': {
      name: '變更影片影格率',
      h1: '線上變更影片影格率',
      tagline: '將影片轉換為 24、25、30 或 60 fps，把 60 fps 的片段降到 30 fps 以縮小檔案，或配合專案的影格率。',
      metaTitle: '線上變更影片影格率（24、30、60 fps） | Media Manipulator',
      metaDescription: '免費線上影格率轉換工具。將影片轉換為 24、25、30、50 或 60 fps，把 60 fps 降到 30 以縮小檔案，或配合剪輯時間軸。輸出 MP4，無需註冊。',
      ogTitle: '線上變更影片影格率',
      ogDescription: '將任何影片轉換為 24、25、30 或 60 fps。免費，無需註冊。',
      intro: '影格率決定了影片的觀感與檔案大小。電影是 24 fps，歐洲廣播是 25，大多數手機是 30 或 60，而在同一條時間軸中混用這些影格率會造成畫面頓挫。Media Manipulator 在我們的伺服器上用 FFmpeg 將任何影片重新取樣為你需要的影格率，精確地捨棄或重複影格，並匯出 MP4。當你需要更多而不是更少的影格時，AI 影格插補工具會產生中間影格。',
      whatItDoes: [
        '將影片重新取樣為 1 到 120 fps 之間的任何影格率。',
        '將 60 fps 減半為 30，檔案大幅縮小，而大多數內容看不出差異。',
        '在匯入剪輯軟體前配合專案影格率（24、25、29.97、30、50、60）。',
        '解析度、音訊與長度保持不變。',
      ],
      flowSteps: [
        {
          title: '上傳影片',
          description: '任何常見格式。',
        },
        {
          title: '設定目標 fps',
          description: '預設為 30。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 捨棄或複製影格以符合目標。',
        },
        {
          title: '下載',
          description: '儲存重新取樣的 MP4。',
        },
      ],
      advancedDetails: [
        '使用 fps 濾鏡：依時間戳記捨棄或複製影格，因此長度與音訊同步都能精確保留。',
        '提高影格率（30 到 60）會複製影格，看起來並不會更流暢；若要真正的新影格，請使用 AI 影格插補。',
        '降低影格率會移除資料，而且無法復原；請保留原始檔案。',
      ],
      whyItMatters: [
        '對大多數內容而言，60 fps 的手機片段在可見畫質相同的情況下，檔案大小是 30 fps 的兩倍。',
        '剪輯時間軸中混用不同影格率會造成卡頓；事先統一影格率即可避免。',
        '有些平台與裝置會限制或要求特定的影格率。',
      ],
      useCases: [
        {
          title: '縮小 60 fps 的片段',
          description: '降到 30 fps，用於電子郵件、聊天或較小的上傳。',
        },
        {
          title: '為剪輯統一影格率',
          description: '讓每個片段都符合專案影格率。',
        },
        {
          title: '電影感',
          description: '轉換為 24 fps，獲得電影般的節奏。',
        },
        {
          title: '廣播交付',
          description: '為 PAL 地區轉換為 25 或 50 fps。',
        },
      ],
      whyMediaManipulator: [
        '以時間戳記為基礎的精確重新取樣，長度與音訊完全不受影響。',
        '需要更多而不是更少的影格時，可以使用 AI 插補。',
      ],
      privacyNote: '你的影片由我們伺服器上的 FFmpeg 重新調整為你選擇的影格率。處理在我們自己的伺服器上進行，不使用第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的原始檔案不會被變更，結果會是一個新檔案。',
      faq: [
        {
          question: '影片會變短或變長嗎？',
          answer: '不會。長度保持不變；影格會被捨棄或重複，以達到新的影格率。',
        },
        {
          question: '30 到 60 fps 看起來會更流暢嗎？',
          answer: '使用這個工具不會，因為它只是複製影格。請使用 AI 影格插補來產生真正的中間影格。',
        },
        {
          question: '我應該選擇哪個影格率？',
          answer: '大多數網路與手機內容選 30 fps，電影感選 24，PAL 廣播選 25 或 50，遊戲與運動選 60。',
        },
        {
          question: '音訊會受影響嗎？',
          answer: '不會。音訊串流會以相同的時間直接複製或重新編碼。',
        },
      ],
      related: [
        {
          label: 'AI 影格插補',
          to: '/tools/ai-frame-interpolation',
          description: '產生影格，最高可達 120 fps。',
        },
        {
          label: '影片轉換器',
          to: '/tools/video-converter',
          description: '在各種影片格式之間轉換。',
        },
        {
          label: '變更影片速度',
          to: '/tools/change-video-speed',
          description: '縮時或慢動作。',
        },
        {
          label: '影片倒轉',
          to: '/tools/reverse-video',
          description: '倒著播放片段。',
        },
        {
          label: '翻轉影片',
          to: '/tools/flip-video',
          description: '水平或垂直鏡像。',
        },
        {
          label: '影片穩定',
          to: '/tools/stabilize-video',
          description: '消除畫面晃動。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '縮小檔案。',
        },
        {
          label: '影片裁剪',
          to: '/tools/video-trimmer',
          description: '剪出指定範圍。',
        },
      ],
      embed: {
        title: '變更影片的影格率',
        description: '上傳影片，並在「時間類效果」區段中設定目標影格率；預設為 30 fps。影格會被捨棄或複製以達到目標。若要以產生的中間影格提高影格率，請改用 AI 影格插補。',
      },
    },
    'adjust-video-color': {
      name: '調整影片亮度與色彩',
      h1: '線上調整影片亮度、對比與色彩',
      tagline: '提亮偏暗的片段，增加對比與飽和度，調整色相，或套用模糊與藝術效果，附滑桿與即時預覽。',
      metaTitle: '線上調整影片亮度、對比與飽和度 | Media Manipulator',
      metaDescription: '免費線上影片色彩調整工具。修正亮度、對比、飽和度、色相、Gamma 與曝光，加入模糊或銳利化，或套用藝術風格。輸出 MP4，無浮水印，無需註冊。',
      ogTitle: '線上調整影片亮度與色彩',
      ogDescription: '為任何片段提亮、增加對比、加強色彩或套用風格。免費，無需註冊。',
      intro: '在室內拍攝的片段又暗又偏橘；平淡的手機影片需要更多對比與色彩；用於縮圖的片段需要風格化的外觀。Media Manipulator 在我們的伺服器上用 FFmpeg 套用亮度、對比、飽和度、色相、Gamma 與曝光校正，並提供模糊、銳利化、顆粒與一系列藝術濾鏡，最後匯出 MP4。不必開啟剪輯軟體，就能完成一次色彩校正。',
      whatItDoes: [
        '亮度、對比、飽和度與色相滑桿，範圍從 -100 到 +100。',
        'Gamma、曝光、陰影與亮部，提供更細緻的影調控制。',
        '高斯模糊與動態模糊、遮色片銳利化、底片顆粒與雜訊。',
        '油畫、素描與復古等藝術風格。',
        '可在同一次處理中搭配裁剪、調整尺寸、變速或翻轉。',
      ],
      flowSteps: [
        {
          title: '上傳片段',
          description: '任何常見格式。',
        },
        {
          title: '移動滑桿',
          description: '亮度、對比、飽和度、色相等。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 套用 eq 與效果濾鏡。',
        },
        {
          title: '下載',
          description: '儲存調色後的 MP4。',
        },
      ],
      advancedDetails: [
        '亮度、對比、飽和度與 Gamma 對應到 FFmpeg 的 eq 濾鏡；色相使用以度為單位的 hue 濾鏡。',
        '銳利化使用帶半徑、強度與閾值的 unsharp；模糊使用 gblur 或帶方向的動態模糊。',
        '若需要 3D LUT、色度鍵去背或在時間軸上逐片段調色，請使用 Darkroom。',
      ],
      whyItMatters: [
        '大多數手機畫面只要稍微提高對比與飽和度，效果就會更好。',
        '在上傳前修正曝光，可避免平台重新編碼後讓問題更嚴重。',
        '各片段之間一致的風格，讓剪輯成品更完整。',
      ],
      useCases: [
        {
          title: '提亮偏暗的片段',
          description: '提高室內畫面的曝光與陰影。',
        },
        {
          title: '讓平淡的片段更鮮明',
          description: '為看起來像 log 的手機影片增加對比與飽和度。',
        },
        {
          title: '修正偏色',
          description: '移動色相，去除偏橘或偏綠的色調。',
        },
        {
          title: '社群風格化',
          description: '套用復古、素描或油畫風格。',
        },
      ],
      whyMediaManipulator: [
        '影調、色彩與效果控制集中在同一個區段，而不是只有一個「增強」按鈕。',
        '需要更多功能時，可使用 Darkroom 在時間軸上以 LUT 調色。',
      ],
      privacyNote: '你的影片的亮度、對比、飽和度與 Gamma 由我們伺服器上的 FFmpeg 調整。處理在我們自己的伺服器上進行，不使用第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的原始檔案不會被變更，結果會是一個新檔案。',
      faq: [
        {
          question: '可以預覽結果嗎？',
          answer: '滑桿會顯示數值；完整的調色會在轉換時套用。可以先裁剪成幾秒鐘快速測試，再處理整個片段。',
        },
        {
          question: '可以套用 LUT 嗎？',
          answer: '這裡不行。我們的多軌剪輯器 Darkroom 支援 3D LUT 與逐片段調色。',
        },
        {
          question: '可以修正過度曝光的畫面嗎？',
          answer: '可以壓低亮部，但已經過曝成純白的細節無法還原。',
        },
        {
          question: '可以銳利化模糊的片段嗎？',
          answer: '可以。請使用遮色片銳利化控制項；若要真正還原細節，請試試 AI 影片修復。',
        },
      ],
      related: [
        {
          label: 'Darkroom 影片剪輯器',
          to: '/tools/content-studio',
          description: '在時間軸上以 LUT 調色。',
        },
        {
          label: 'AI 影片修復',
          to: '/tools/ai-video-restoration',
          description: '用 AI 降噪並放大。',
        },
        {
          label: '影片轉換器',
          to: '/tools/video-converter',
          description: '在各種影片格式之間轉換。',
        },
        {
          label: '變更影片速度',
          to: '/tools/change-video-speed',
          description: '縮時或慢動作。',
        },
        {
          label: '影片倒轉',
          to: '/tools/reverse-video',
          description: '倒著播放片段。',
        },
        {
          label: '翻轉影片',
          to: '/tools/flip-video',
          description: '水平或垂直鏡像。',
        },
        {
          label: '影片穩定',
          to: '/tools/stabilize-video',
          description: '消除畫面晃動。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '縮小檔案。',
        },
        {
          label: '影片裁剪',
          to: '/tools/video-trimmer',
          description: '剪出指定範圍。',
        },
      ],
      embed: {
        title: '調整影片的色彩',
        description: '上傳片段。「視覺效果」區段會開啟亮度、對比、飽和度、色相、Gamma 與曝光滑桿，另有模糊、銳利化、雜訊與藝術風格。匯出 MP4。',
      },
    },
    'convert-video-to-hevc': {
      name: '將影片轉換為 HEVC（H.265）',
      h1: '線上將影片轉換為 HEVC／H.265',
      tagline: '將任何影片重新編碼為 H.265，在相同畫質下檔案大小約為 H.264 的一半，適合儲存、4K 與新款裝置。',
      metaTitle: '線上免費將影片轉換為 HEVC（H.265） | Media Manipulator',
      metaDescription: '免費線上 H.265／HEVC 轉換工具。將 MP4、MOV、MKV 或 WebM 重新編碼為 HEVC，在相同畫質下檔案約小一半。可選擇畫質預設。無浮水印，無需註冊。',
      ogTitle: '線上將影片轉換為 HEVC／H.265',
      ogDescription: '用 H.265 將影片大小減半。免費，無需註冊。',
      intro: 'HEVC 又稱 H.265，是 H.264 的後繼者。在相同的視覺畫質下，它所需的位元數約少 40% 到 50%，這就是手機用它錄製 4K、也是它成為封存影片首選格式的原因。Media Manipulator 在我們的伺服器上用 FFmpeg 的 x265 編碼器，以你選擇的畫質等級將任何影片重新編碼為 HEVC，並放入 iPhone、Mac、Windows 10+、Android 與新款電視都能播放的 MP4 容器。',
      whatItDoes: [
        '將任何輸入影片重新編碼為 MP4 容器中的 H.265。',
        '三種畫質預設對應到不同的 CRF 值；與 H.264 相比，檔案大小約減半。',
        '保留解析度與影格率；也可選擇將 4K 縮小為 1080p，讓檔案小得多。',
        '音訊會重新編碼為 AAC。',
      ],
      flowSteps: [
        {
          title: '上傳影片',
          description: '任何常見格式，包括 H.264 MP4。',
        },
        {
          title: '選擇畫質',
          description: '最小檔案、平衡或高畫質。',
        },
        {
          title: '轉換',
          description: 'x265 在我們的伺服器上編碼；速度比 H.264 慢。',
        },
        {
          title: '下載',
          description: '儲存內含 HEVC 的 .mp4 檔案。',
        },
      ],
      advancedDetails: [
        '以 libx265 編碼，CRF 為 28（平衡）、32（最小檔案）或 24（高畫質），使用 medium 預設，並加上 hvc1 標記以相容於 Apple 裝置。',
        'HEVC 編碼比 H.264 慢好幾倍；較長的 4K 檔案需要數分鐘。',
        '瀏覽器：Safari 與 Edge 可播放 HEVC；Chrome 與 Firefox 通常不行。網頁嵌入請保留 H.264。',
      ],
      whyItMatters: [
        '相同畫質只需一半的儲存空間，整個影片庫累積下來相當可觀。',
        '大多數裝置的 4K 與 HDR 播放都以 HEVC 為標準。',
        '較小的檔案上傳與同步都更快。',
      ],
      useCases: [
        {
          title: '封存影片',
          description: '在看不出損失的情況下，將相機膠卷的大小減半。',
        },
        {
          title: '分享 4K',
          description: '讓 4K 片段小到可以傳送。',
        },
        {
          title: 'Apple 生態系',
          description: '與 iPhone 本來就錄製的 HEVC 檔案一致。',
        },
        {
          title: '釋放磁碟空間',
          description: '將舊的 H.264 錄影轉換為 HEVC。',
        },
      ],
      whyMediaManipulator: [
        'x265 搭配合理的 CRF 預設與相容 Apple 的標記。',
        '如果你需要的是 H.264、VP9 或 AV1，同一個面板也能壓縮成這些格式。',
      ],
      privacyNote: '你的影片由我們伺服器上的 FFmpeg 重新編碼為 H.265（HEVC）。處理在我們自己的伺服器上進行，不使用第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的原始檔案不會被變更，結果會是一個新檔案。',
      faq: [
        {
          question: 'HEVC 在任何地方都能播放嗎？',
          answer: 'iPhone、Mac、Windows 10+、Android 5+、新款電視以及 Safari／Edge 都能播放。Chrome、Firefox 與舊裝置通常不行；請為這些情況保留 H.264。',
        },
        {
          question: '檔案會小多少？',
          answer: '在相同畫質下，通常比 H.264 小 40% 到 50%；內容簡單時會小更多。',
        },
        {
          question: '畫質會變差嗎？',
          answer: '使用平衡預設時，大多數內容看不出差異。若是之後還要再剪輯的畫面，請選擇高畫質。',
        },
        {
          question: '為什麼這麼慢？',
          answer: 'x265 每個影格要做的運算遠多於 x264。這是換取更小檔案的代價。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'HEVC 編碼非常吃 CPU；較長或 4K 的來源預計需要數分鐘。',
        ],
      },
      related: [
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: 'H.264、VP9 或 AV1 壓縮。',
        },
        {
          label: '影片轉換器',
          to: '/tools/video-converter',
          description: '標準 H.264 MP4。',
        },
        {
          label: '影片轉換器',
          to: '/tools/video-converter',
          description: '在各種影片格式之間轉換。',
        },
        {
          label: '變更影片速度',
          to: '/tools/change-video-speed',
          description: '縮時或慢動作。',
        },
        {
          label: '影片倒轉',
          to: '/tools/reverse-video',
          description: '倒著播放片段。',
        },
        {
          label: '翻轉影片',
          to: '/tools/flip-video',
          description: '水平或垂直鏡像。',
        },
        {
          label: '影片穩定',
          to: '/tools/stabilize-video',
          description: '消除畫面晃動。',
        },
        {
          label: '影片裁剪',
          to: '/tools/video-trimmer',
          description: '剪出指定範圍。',
        },
      ],
      embed: {
        title: '將影片轉換為 HEVC',
        description: '上傳影片。編解碼器已設為 MP4 容器中的 H.265，並使用平衡預設；你可以改選最小檔案或高畫質。舊裝置與部分瀏覽器無法播放 HEVC；請為這些情況保留一份 H.264 副本。',
      },
    },
    'convert-audio-to-wav': {
      name: '將音訊轉換為 WAV',
      h1: '線上免費將音訊轉換為 WAV',
      tagline: '將 MP3、M4A、WAV、OGG、FLAC 等任何音訊檔案無損轉換為 WAV。',
      metaTitle: '線上免費將音訊轉換為 WAV | Media Manipulator',
      metaDescription: '免費線上音訊轉 WAV 工具。上傳 MP3、WAV、M4A、OGG、FLAC 或 AAC，下載 WAV。無損輸出。無浮水印，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將音訊轉換為 WAV',
      ogDescription: '上傳任何音訊檔案，下載 WAV。無損。免費，無需註冊。',
      intro: 'WAV 是未壓縮的 PCM 音訊：每個取樣都原樣儲存，因此不會有任何損失，所有剪輯軟體、DAW 與取樣器都能立即開啟。Media Manipulator 只要上傳一次，就能將任何常見音訊格式轉換為 WAV，除非你另行變更，否則會保留取樣率與聲道配置，並在同一個表單中提供裁剪、音量標準化、EQ 與 AI 清理工具。',
      whatItDoes: [
        '將 MP3、WAV、M4A/AAC、OGG、Opus、FLAC、ALAC、AC3 與 WMA 轉換為 WAV。',
        '保留每一個取樣：輸出解碼後與輸入完全相同。',
        '可在寫入 PCM 前套用裁剪、音量、標準化、EQ 與效果。',
        'AI 清理就在同一個表單中：在儲存為 WAV 前去除背景雜音、清理人聲，或分離或去除人聲。',
      ],
      flowSteps: [
        {
          title: '上傳音訊',
          description: '任何常見音訊檔案，壓縮與否皆可。',
        },
        {
          title: '視需要調整',
          description: '裁剪、標準化或套用效果。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 在我們的伺服器上編碼 WAV。',
        },
        {
          title: '下載',
          description: '儲存 WAV 檔案。',
        },
      ],
      advancedDetails: [
        'WAV 輸出使用 FFmpeg 原生的 pcm_s16le 編碼器，以來源的取樣率編碼。',
        '將有損的 MP3 轉換為 WAV 無法還原 MP3 編碼器捨棄的細節；只能避免進一步的損失。',
        'MP3 或 M4A 來源中的專輯封面會被識別為靜態圖片，因此驗證時不會把檔案誤認為影片。',
      ],
      whyItMatters: [
        '剪輯或母帶處理：WAV 是音訊剪輯軟體需要的格式，不需要解碼步驟，也沒有世代損失。',
        '封存母帶或現場錄音。',
        '需要 PCM 的取樣器、遊戲引擎與廣播系統。',
      ],
      useCases: [
        {
          title: '為裝置切換格式',
          description: '為需要 WAV 的播放器製作一份 WAV 副本。',
        },
        {
          title: '為剪輯做準備',
          description: '將無損檔案交給 DAW 或影片剪輯軟體。',
        },
        {
          title: '一次一個檔案',
          description: '把一整個資料夾的語音備忘錄逐一轉換為 WAV，並順便裁剪每一個。',
        },
        {
          title: '轉換時順便清理',
          description: '在將現場錄音製作成未壓縮母帶的過程中去除嘶嘶聲。',
        },
      ],
      whyMediaManipulator: [
        '除非你另行選擇，否則會保留取樣率與聲道配置。',
        '在製作 WAV 的同一次上傳中，將錄音標準化並裁剪。',
      ],
      privacyNote: '你的音訊由我們伺服器上的 FFmpeg 解碼，並寫出為未壓縮的 PCM WAV。不會使用任何外部音訊服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你會得到一個新檔案；上傳的檔案本身不會被變更。',
      faq: [
        {
          question: '什麼是 WAV？',
          answer: 'WAV 是未壓縮的 PCM 音訊：每個取樣都原樣儲存，因此不會有任何損失，所有剪輯軟體、DAW 與取樣器都能立即開啟。',
        },
        {
          question: '轉換為 WAV 會讓音質變好嗎？',
          answer: '不會。將有損的 MP3 轉換為 WAV 無法還原 MP3 編碼器捨棄的細節；只能避免進一步的損失。',
        },
        {
          question: '轉換為 WAV 時可以裁剪音訊嗎？',
          answer: '可以。在裁剪區段設定開始與結束時間，就只有該範圍會寫入 WAV。',
        },
        {
          question: '我的 MP3 有專輯封面，還能轉成 WAV 嗎？',
          answer: '可以。封面會被識別為圖片，而不是影片軌，因此上傳會被接受，音訊也會照常解碼為 PCM。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '無損輸出；檔案大小取決於長度與取樣率。',
        ],
      },
      related: [
        {
          label: '音訊轉換器',
          to: '/tools/audio-converter',
          description: '在所有常見音訊格式之間轉換。',
        },
        {
          label: '變更音訊速度',
          to: '/tools/change-audio-speed',
          description: '將錄音加速或減速。',
        },
        {
          label: '變更音訊音高',
          to: '/tools/change-audio-pitch',
          description: '將音調升高或降低。',
        },
        {
          label: '音訊標準化',
          to: '/tools/normalize-audio',
          description: '讓響度保持一致。',
        },
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: 'AI 降噪。',
        },
        {
          label: '去除歌曲人聲',
          to: '/tools/remove-vocals-from-song',
          description: '製作伴奏。',
        },
      ],
      embed: {
        title: '將音訊轉換為 WAV',
        description: '上傳任何音訊檔案。輸出固定為 WAV；除非你另行變更，否則會保留取樣率與聲道，然後按下「轉換」。',
      },
    },
    'convert-audio-to-flac': {
      name: '將音訊轉換為 FLAC',
      h1: '線上免費將音訊轉換為 FLAC',
      tagline: '將 MP3、M4A、WAV、OGG、FLAC 等任何音訊檔案無損轉換為 FLAC。',
      metaTitle: '線上免費將音訊轉換為 FLAC | Media Manipulator',
      metaDescription: '免費線上音訊轉 FLAC 工具。上傳 MP3、WAV、M4A、OGG、FLAC 或 AAC，下載 FLAC。無損輸出。無浮水印，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將音訊轉換為 FLAC',
      ogDescription: '上傳任何音訊檔案並下載 FLAC。無損。免費，無需註冊。',
      intro: 'FLAC 能在不損失任何內容的情況下壓縮音訊，通常可縮小到 WAV 大小的 50% 到 70%，解碼後與原始資料逐位元完全相同。Media Manipulator 只需一次上傳，就能把任何常見音訊格式轉換為 FLAC；除非你自行變更，否則會保留原本的取樣率與聲道配置，同一個表單上也提供裁剪、標準化、EQ 與 AI 清理工具。',
      whatItDoes: [
        '將 MP3、WAV、M4A/AAC、OGG、Opus、FLAC、ALAC、AC3 與 WMA 轉換為 FLAC。',
        '保留每一個取樣：輸出解碼後與輸入完全相同。',
        '可在 FLAC 壓縮結果之前套用音量、裁剪、標準化與 EQ。',
        '如果你想要一份清理過的無損副本，降噪、人聲清理與人聲分離都能在同一次上傳中執行。',
      ],
      flowSteps: [
        {
          title: '上傳音訊',
          description: 'WAV、AIFF 類型的 PCM、MP3、M4A 等格式。',
        },
        {
          title: '視需要調整',
          description: '裁剪、標準化或套用效果。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 在我們的伺服器上編碼 FLAC。',
        },
        {
          title: '下載',
          description: '儲存 FLAC 檔案。',
        },
      ],
      advancedDetails: [
        'FLAC 輸出以 FFmpeg 內建的 flac 編碼器、依來源取樣率編碼。',
        '由 MP3 製作的 FLAC 不會比該 MP3 更好；FLAC 只會保留原本就有的內容。',
        '內嵌封面圖片的 MP3 或 M4A 可以通過驗證：封面會被視為圖片，而不是影片串流。',
      ],
      whyItMatters: [
        '只佔 WAV 一半空間的無損音樂資料庫。',
        '把母帶傳給合作夥伴，不必附上 100 MB 的附件。',
        '長期封存，格式本身就內建校驗碼。',
      ],
      useCases: [
        {
          title: '為裝置切換格式',
          description: '為需要 FLAC 的播放器製作一份 FLAC 副本。',
        },
        {
          title: '為剪輯做準備',
          description: '把無損檔案交給 DAW 或影片剪輯軟體。',
        },
        {
          title: '一次一個檔案',
          description: '以無損方式封存一組錄音，每個檔案各上傳一次。',
        },
        {
          title: '順便清理',
          description: '先移除背景雜音，再將清理後的結果保留為 FLAC。',
        },
      ],
      whyMediaManipulator: [
        '選擇取樣率或聲道配置，或兩者都維持來源的設定。',
        '把音量偏小的母帶調整到位並封存為 FLAC，一個步驟就完成。',
      ],
      privacyNote: '你的音訊由我們伺服器上的 FFmpeg 無損壓縮為 FLAC。不會用到任何外部音訊服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。你會得到一個新檔案；上傳的檔案本身不會被更改。',
      faq: [
        {
          question: '什麼是 FLAC？',
          answer: 'FLAC 能在不損失任何內容的情況下壓縮音訊，通常可縮小到 WAV 大小的 50% 到 70%，解碼後與原始資料逐位元完全相同。',
        },
        {
          question: '轉換為 FLAC 會讓聲音變好嗎？',
          answer: '不會。由 MP3 製作的 FLAC 不會比該 MP3 更好；FLAC 只會保留原本就有的內容。',
        },
        {
          question: '轉換為 FLAC 時可以裁剪音訊嗎？',
          answer: '可以。在裁剪區段設定開始與結束時間，FLAC 就只會編碼該範圍。',
        },
        {
          question: '有封面圖片的 MP3 能轉換為 FLAC 嗎？',
          answer: '可以。內嵌的封面會被讀取為圖片而不是影片，因此能通過驗證，音訊也會照常編碼。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '無損輸出；檔案大小取決於長度與取樣率。',
        ],
      },
      related: [
        {
          label: '音訊轉換器',
          to: '/tools/audio-converter',
          description: '在所有常見音訊格式之間轉換。',
        },
        {
          label: '變更音訊速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢錄音。',
        },
        {
          label: '變更音訊音高',
          to: '/tools/change-audio-pitch',
          description: '將調性升高或降低。',
        },
        {
          label: '音訊標準化',
          to: '/tools/normalize-audio',
          description: '讓響度保持一致。',
        },
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: 'AI 降噪。',
        },
        {
          label: '去除歌曲人聲',
          to: '/tools/remove-vocals-from-song',
          description: '製作伴奏。',
        },
      ],
      embed: {
        title: '將音訊轉換為 FLAC',
        description: '上傳任何音訊檔案。輸出固定為 FLAC；除非你自行變更，否則會保留取樣率與聲道，然後按下「轉換檔案」。',
      },
    },
    'convert-audio-to-ogg': {
      name: '將音訊轉換為 OGG',
      h1: '線上免費將音訊轉換為 OGG',
      tagline: '將 MP3、M4A、WAV、OGG、FLAC 等任何音訊檔案依你選擇的位元率轉換為 OGG。',
      metaTitle: '線上免費將音訊轉換為 OGG | Media Manipulator',
      metaDescription: '免費線上音訊轉 OGG 工具。上傳 MP3、WAV、M4A、OGG、FLAC 或 AAC，下載 OGG。可選擇位元率。無浮水印，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將音訊轉換為 OGG',
      ogDescription: '上傳任何音訊檔案並下載 OGG。可選擇位元率。免費，無需註冊。',
      intro: 'OGG Vorbis 是一種免費、不受專利限制的有損格式，在相同位元率下音質優於 MP3，並受到瀏覽器、Android 與遊戲引擎的原生支援。Media Manipulator 只需一次上傳，就能把任何常見音訊格式轉換為 OGG；除非你自行變更，否則會保留原本的取樣率與聲道配置，同一個表單上也提供裁剪、標準化、EQ 與 AI 清理工具。',
      whatItDoes: [
        '將 MP3、WAV、M4A/AAC、OGG、Opus、FLAC、ALAC、AC3 與 WMA 轉換為 OGG。',
        '讓你選擇位元率、取樣率與聲道配置。',
        '裁剪、音量、響度標準化與 EQ 會與 Vorbis 編碼在同一次 FFmpeg 處理中完成。',
        '在 Vorbis 編碼器執行之前，先用 AI 清理人聲或移除背景雜音。',
      ],
      flowSteps: [
        {
          title: '上傳音訊',
          description: '要用在你的遊戲或網站上的 MP3、WAV、FLAC 或其他音訊檔案。',
        },
        {
          title: '視需要調整',
          description: '選擇位元率；裁剪或套用效果。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 在我們的伺服器上編碼 OGG。',
        },
        {
          title: '下載',
          description: '儲存 OGG 檔案。',
        },
      ],
      advancedDetails: [
        'OGG 輸出使用 FFmpeg 的 libvorbis 編碼器；預設為 192 kbps，對音樂來說是穩妥的選擇。',
        'Apple 裝置和部分汽車音響無法播放 OGG；這些情況請使用 M4A 或 MP3。',
        '來源中的封面圖片會被識別為圖片附件，不會觸發影片軌檢查。',
      ],
      whyItMatters: [
        '重視小檔案與免授權費解碼的遊戲與 App 音效素材。',
        '必須在 Firefox 與 Chrome 中播放、且不需要授權的網頁音訊。',
        '供 Linux 與 Android 播放器使用的 Podcast 或音樂檔案。',
      ],
      useCases: [
        {
          title: '為裝置切換格式',
          description: '為需要 OGG 的播放器製作一份 OGG 副本。',
        },
        {
          title: '為剪輯做準備',
          description: '為專案製作小巧且相容的檔案。',
        },
        {
          title: '一次一個檔案',
          description: '一次一個檔案，為遊戲引擎準備音效。',
        },
        {
          title: '順便清理',
          description: '在錄音以 OGG 素材交付之前，先去除其中的嗡嗡聲。',
        },
      ],
      whyMediaManipulator: [
        '每個 OGG 的位元率、取樣率與聲道都由你決定。',
        '在轉為 OGG 的同時，裁掉音效前後的靜音。',
      ],
      privacyNote: '你的音訊由我們伺服器上的 FFmpeg 編碼為 OGG Vorbis。不會用到任何外部音訊服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。你會得到一個新檔案；上傳的檔案本身不會被更改。',
      faq: [
        {
          question: '什麼是 OGG？',
          answer: 'OGG Vorbis 是一種免費、不受專利限制的有損格式，在相同位元率下音質優於 MP3，並受到瀏覽器、Android 與遊戲引擎的原生支援。',
        },
        {
          question: '轉換為 OGG 會讓聲音變好嗎？',
          answer: '不會。Apple 裝置和部分汽車音響無法播放 OGG；這些情況請使用 M4A 或 MP3。',
        },
        {
          question: '轉換為 OGG 時可以裁剪音訊嗎？',
          answer: '可以。標記開始與結束位置，OGG 就只會包含那一段。',
        },
        {
          question: '可以把含有專輯封面的 M4A 轉換為 OGG 嗎？',
          answer: '可以。封面會被視為圖片附件而不是影片軌，因此工作會繼續進行，並產生純音訊的 Vorbis。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '有損輸出；檔案大小由你選擇的位元率決定。',
        ],
      },
      related: [
        {
          label: '音訊轉換器',
          to: '/tools/audio-converter',
          description: '在所有常見音訊格式之間轉換。',
        },
        {
          label: '變更音訊速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢錄音。',
        },
        {
          label: '變更音訊音高',
          to: '/tools/change-audio-pitch',
          description: '將調性升高或降低。',
        },
        {
          label: '音訊標準化',
          to: '/tools/normalize-audio',
          description: '讓響度保持一致。',
        },
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: 'AI 降噪。',
        },
        {
          label: '去除歌曲人聲',
          to: '/tools/remove-vocals-from-song',
          description: '製作伴奏。',
        },
      ],
      embed: {
        title: '將音訊轉換為 OGG',
        description: '上傳任何音訊檔案。輸出固定為 OGG；選擇位元率、取樣率與聲道，然後按下「轉換檔案」。',
      },
    },
    'convert-audio-to-m4a': {
      name: '將音訊轉換為 M4A / AAC',
      h1: '線上免費將音訊轉換為 M4A / AAC',
      tagline: '將 MP3、M4A、WAV、OGG、FLAC 等任何音訊檔案依你選擇的位元率轉換為 M4A / AAC。',
      metaTitle: '線上免費將音訊轉換為 M4A / AAC | Media Manipulator',
      metaDescription: '免費線上音訊轉 M4A / AAC 工具。上傳 MP3、WAV、M4A、OGG、FLAC 或 AAC，下載 M4A / AAC。可選擇位元率。無浮水印，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將音訊轉換為 M4A / AAC',
      ogDescription: '上傳任何音訊檔案並下載 M4A / AAC。可選擇位元率。免費，無需註冊。',
      intro: 'M4A 是裝在 MP4 容器中的 AAC 音訊，也是 Apple Music、iPhone、YouTube 與大多數串流服務使用的格式。以每 KB 的音質而言，它勝過 MP3。Media Manipulator 只需一次上傳，就能把任何常見音訊格式轉換為 M4A / AAC；除非你自行變更，否則會保留原本的取樣率與聲道配置，同一個表單上也提供裁剪、標準化、EQ 與 AI 清理工具。',
      whatItDoes: [
        '將 MP3、WAV、M4A/AAC、OGG、Opus、FLAC、ALAC、AC3 與 WMA 轉換為 M4A / AAC。',
        '讓你選擇位元率、取樣率與聲道配置。',
        '裁剪、增益、標準化、EQ 與效果都會和 AAC 在同一次編碼中完成。',
        '表單上的 AI 工具可以在寫入 AAC 之前清理語音備忘錄或移除人聲。',
      ],
      flowSteps: [
        {
          title: '上傳音訊',
          description: 'WAV 母帶、MP3 或語音備忘錄。',
        },
        {
          title: '視需要調整',
          description: '選擇位元率；裁剪或套用效果。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 在我們的伺服器上編碼 M4A / AAC。',
        },
        {
          title: '下載',
          description: '儲存 M4A / AAC 檔案。',
        },
      ],
      advancedDetails: [
        'M4A / AAC 輸出使用 FFmpeg 的 aac 編碼器；預設為 192 kbps，對音樂來說是穩妥的選擇。',
        '部分只支援 MP3 的舊型播放器和汽車音響主機無法讀取 AAC。',
        '內嵌的專輯封面會被識別為圖片，絕不會被誤認為影片軌。',
      ],
      whyItMatters: [
        '用於 iPhone、iPad 與 Mac 的音樂和語音備忘錄。',
        '之後要合併到 MP4 影片中的音軌。',
        'Podcast 與有聲書：支援章節標記，檔案也比 MP3 小。',
      ],
      useCases: [
        {
          title: '為裝置切換格式',
          description: '為需要此格式的播放器製作一份 M4A / AAC 副本。',
        },
        {
          title: '為剪輯做準備',
          description: '為專案製作小巧且相容的檔案。',
        },
        {
          title: '一次一個檔案',
          description: '為 iPhone 資料庫轉換語音備忘錄，同時順手裁掉空白片段。',
        },
        {
          title: '順便清理',
          description: '對 Podcast 錄音執行人聲清理，並直接儲存為 M4A。',
        },
      ],
      whyMediaManipulator: [
        'AAC 輸出的位元率、取樣率與聲道數都可以調整。',
        '將一集節目標準化並轉為 M4A，不必再上傳第二次。',
      ],
      privacyNote: '你的音訊由我們伺服器上的 FFmpeg 編碼為 M4A 檔案中的 AAC。不會用到任何外部音訊服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。你會得到一個新檔案；上傳的檔案本身不會被更改。',
      faq: [
        {
          question: '什麼是 M4A / AAC？',
          answer: 'M4A 是裝在 MP4 容器中的 AAC 音訊，也是 Apple Music、iPhone、YouTube 與大多數串流服務使用的格式。以每 KB 的音質而言，它勝過 MP3。',
        },
        {
          question: '轉換為 M4A / AAC 會讓聲音變好嗎？',
          answer: '不會。部分只支援 MP3 的舊型播放器和汽車音響主機無法讀取 AAC。',
        },
        {
          question: '轉換為 M4A / AAC 時可以裁剪音訊嗎？',
          answer: '可以。在裁剪區段設定範圍；M4A 會在你指定的位置開始與結束。',
        },
        {
          question: 'MP3 中的專輯封面會讓轉換為 M4A 失敗嗎？',
          answer: '不會。封面串流會被識別為圖片而不是影片，AAC 編碼會正常執行。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '有損輸出；檔案大小由你選擇的位元率決定。',
        ],
      },
      related: [
        {
          label: '音訊轉換器',
          to: '/tools/audio-converter',
          description: '在所有常見音訊格式之間轉換。',
        },
        {
          label: '變更音訊速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢錄音。',
        },
        {
          label: '變更音訊音高',
          to: '/tools/change-audio-pitch',
          description: '將調性升高或降低。',
        },
        {
          label: '音訊標準化',
          to: '/tools/normalize-audio',
          description: '讓響度保持一致。',
        },
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: 'AI 降噪。',
        },
        {
          label: '去除歌曲人聲',
          to: '/tools/remove-vocals-from-song',
          description: '製作伴奏。',
        },
      ],
      embed: {
        title: '將音訊轉換為 M4A / AAC',
        description: '上傳任何音訊檔案。輸出固定為 M4A / AAC；選擇位元率、取樣率與聲道，然後按下「轉換檔案」。',
      },
    },
    'convert-audio-to-opus': {
      name: '將音訊轉換為 Opus',
      h1: '線上免費將音訊轉換為 Opus',
      tagline: '將 MP3、M4A、WAV、OGG、FLAC 等任何音訊檔案依你選擇的位元率轉換為 Opus。',
      metaTitle: '線上免費將音訊轉換為 Opus | Media Manipulator',
      metaDescription: '免費線上音訊轉 Opus 工具。上傳 MP3、WAV、M4A、OGG、FLAC 或 AAC，下載 Opus。可選擇位元率。無浮水印，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將音訊轉換為 Opus',
      ogDescription: '上傳任何音訊檔案並下載 Opus。可選擇位元率。免費，無需註冊。',
      intro: 'Opus 是最新的開放式編解碼器，也是低位元率下語音與音樂的最佳有損選擇：64 kbps 的 Opus 聽起來就像 128 kbps 的 MP3。WhatsApp、Discord 與 WebRTC 使用的就是它。Media Manipulator 只需一次上傳，就能把任何常見音訊格式轉換為 Opus；除非你自行變更，否則會保留原本的取樣率與聲道配置，同一個表單上也提供裁剪、標準化、EQ 與 AI 清理工具。',
      whatItDoes: [
        '將 MP3、WAV、M4A/AAC、OGG、Opus、FLAC、ALAC、AC3 與 WMA 轉換為 Opus。',
        '讓你選擇位元率、取樣率與聲道配置。',
        '裁剪、音量、標準化與 EQ 會與 Opus 編碼在同一次處理中套用。',
        '編碼之前，表單可以在我們的 GPU 上用 AI 移除背景雜音或清理語音。',
      ],
      flowSteps: [
        {
          title: '上傳音訊',
          description: '語音訊息、Podcast、音樂或任何常見音訊。',
        },
        {
          title: '視需要調整',
          description: '選擇位元率；裁剪或套用效果。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 在我們的伺服器上編碼 Opus。',
        },
        {
          title: '下載',
          description: '儲存 Opus 檔案。',
        },
      ],
      advancedDetails: [
        'Opus 輸出使用 FFmpeg 的 libopus 編碼器；預設為 192 kbps，對音樂來說是穩妥的選擇。',
        'iTunes、舊款 Apple 裝置與許多硬體播放器不支援 Opus；這些情況請選擇 M4A。',
        '來源檔案中的專輯封面會被偵測為圖片，不會中斷轉換。',
      ],
      whyItMatters: [
        '只需一小部分檔案大小的語音訊息、Podcast 與有聲書。',
        '在頻寬很重要的場合串流或嵌入音訊。',
        '原生接受 Opus 的 Discord、Matrix 與訊息機器人。',
      ],
      useCases: [
        {
          title: '為裝置切換格式',
          description: '為需要 Opus 的播放器製作一份 Opus 副本。',
        },
        {
          title: '為剪輯做準備',
          description: '為專案製作小巧且相容的檔案。',
        },
        {
          title: '一次一個檔案',
          description: '逐一把一系列講座縮小為 Opus。',
        },
        {
          title: '順便清理',
          description: '清理充滿雜音的通話錄音，並保留為小巧的 Opus 檔案。',
        },
      ],
      whyMediaManipulator: [
        '選擇 Opus 的位元率、取樣率與聲道，或保留預設值。',
        '在轉為 Opus 的過程中裁剪語音訊息並將其標準化。',
      ],
      privacyNote: '你的音訊由我們伺服器上的 FFmpeg 編碼為 Opus。不會用到任何外部音訊服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。你會得到一個新檔案；上傳的檔案本身不會被更改。',
      faq: [
        {
          question: '什麼是 Opus？',
          answer: 'Opus 是最新的開放式編解碼器，也是低位元率下語音與音樂的最佳有損選擇：64 kbps 的 Opus 聽起來就像 128 kbps 的 MP3。WhatsApp、Discord 與 WebRTC 使用的就是它。',
        },
        {
          question: '轉換為 Opus 會讓聲音變好嗎？',
          answer: '不會。iTunes、舊款 Apple 裝置與許多硬體播放器不支援 Opus；這些情況請選擇 M4A。',
        },
        {
          question: '轉換為 Opus 時可以裁剪音訊嗎？',
          answer: '可以。只有你設定的開始與結束之間的範圍會被編碼為 Opus。',
        },
        {
          question: '含有封面圖片的音訊檔案能轉換為 Opus 嗎？',
          answer: '可以。封面圖片會被偵測為圖片而不是影片串流，因此檔案會被接受，且只有音訊會被編碼。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '有損輸出；檔案大小由你選擇的位元率決定。',
        ],
      },
      related: [
        {
          label: '音訊轉換器',
          to: '/tools/audio-converter',
          description: '在所有常見音訊格式之間轉換。',
        },
        {
          label: '變更音訊速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢錄音。',
        },
        {
          label: '變更音訊音高',
          to: '/tools/change-audio-pitch',
          description: '將調性升高或降低。',
        },
        {
          label: '音訊標準化',
          to: '/tools/normalize-audio',
          description: '讓響度保持一致。',
        },
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: 'AI 降噪。',
        },
        {
          label: '去除歌曲人聲',
          to: '/tools/remove-vocals-from-song',
          description: '製作伴奏。',
        },
      ],
      embed: {
        title: '將音訊轉換為 Opus',
        description: '上傳任何音訊檔案。輸出固定為 Opus；選擇位元率、取樣率與聲道，然後按下「轉換檔案」。',
      },
    },
    'convert-mp3-to-wav': {
      name: '將 MP3 轉換為 WAV',
      h1: '線上免費將 MP3 轉換為 WAV',
      tagline: '將 MP3 轉換為未壓縮的 WAV，用於剪輯、取樣或燒錄 CD。',
      metaTitle: '線上免費將 MP3 轉換為 WAV | Media Manipulator',
      metaDescription: '免費線上 MP3 轉 WAV 工具。上傳 MP3，下載依原始取樣率輸出的未壓縮 16 位元 PCM WAV。無浮水印，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 MP3 轉換為 WAV',
      ogDescription: '輸入 MP3，輸出未壓縮的 WAV。免費，無需註冊。',
      intro: '音訊剪輯軟體、取樣器與 CD 燒錄程式都需要未壓縮的 PCM，有些較舊的工具甚至完全不接受 MP3。轉換為 WAV 會將 MP3 解碼一次，之後剪輯時就不會再損失任何品質。Media Manipulator 在我們的伺服器上以 FFmpeg 完成轉換，保留原始的取樣率與聲道，並會略過內嵌的專輯封面，而不會將其誤認為影片軌。',
      whatItDoes: [
        '將 MP3 解碼為 16 位元 PCM WAV，並維持來源的取樣率與聲道配置。',
        '可選擇在同一次處理中裁剪、標準化、淡入淡出與套用 EQ。',
        '可處理內嵌封面圖片與 ID3 標籤的 MP3。',
      ],
      flowSteps: [
        {
          title: '上傳 MP3',
          description: '任何位元率，有無封面圖片皆可。',
        },
        {
          title: '視需要調整',
          description: '裁剪、標準化、EQ。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 解碼為 PCM。',
        },
        {
          title: '下載',
          description: '儲存 WAV。',
        },
      ],
      advancedDetails: [
        'WAV 輸出為 pcm_s16le；立體聲 44.1 kHz 音訊每分鐘約 10 MB。',
        '解碼無法找回 MP3 編碼器捨棄的任何內容；它只能防止進一步的損失。',
      ],
      whyItMatters: [
        '剪輯 MP3 後再存回 MP3，每次都會損失品質；WAV 可以避免這種情況。',
        '取樣器、DAW 與 CD 燒錄程式都需要 PCM。',
      ],
      useCases: [
        {
          title: '在 DAW 中剪輯',
          description: '匯入時不需要解碼步驟，也不會有世代損失。',
        },
        {
          title: '燒錄音樂 CD',
          description: 'CD 燒錄程式需要 44.1 kHz 的 WAV。',
        },
        {
          title: '取樣聲音',
          description: '載入取樣器或遊戲引擎。',
        },
      ],
      whyMediaManipulator: [
        '保留原始的取樣率與聲道。',
        '正確處理 MP3 中的封面圖片。',
      ],
      privacyNote: '你的 MP3 由我們伺服器上的 FFmpeg 解碼一次，轉為 16 位元 PCM WAV。不會用到任何外部音訊服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。你會得到一個新檔案；上傳的檔案本身不會被更改。',
      faq: [
        {
          question: 'WAV 聽起來會比 MP3 更好嗎？',
          answer: '不會。聽起來完全相同；重點在於之後的剪輯不會再降低品質。',
        },
        {
          question: '為什麼 WAV 大這麼多？',
          answer: 'WAV 未經壓縮：立體聲 CD 音質的音訊每分鐘約 10 MB。',
        },
        {
          question: '我的 MP3 有專輯封面，會有問題嗎？',
          answer: '不會。內嵌的封面圖片會被識別為圖片並略過。',
        },
      ],
      related: [
        {
          label: '將音訊轉換為 WAV',
          to: '/tools/convert-audio-to-wav',
          description: '將任何格式轉換為 WAV。',
        },
        {
          label: '將 WAV 轉換為 MP3',
          to: '/tools/convert-wav-to-mp3',
          description: '反方向的轉換。',
        },
        {
          label: '音訊轉換器',
          to: '/tools/audio-converter',
          description: '在所有常見音訊格式之間轉換。',
        },
        {
          label: '變更音訊速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢錄音。',
        },
        {
          label: '變更音訊音高',
          to: '/tools/change-audio-pitch',
          description: '將調性升高或降低。',
        },
        {
          label: '音訊標準化',
          to: '/tools/normalize-audio',
          description: '讓響度保持一致。',
        },
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: 'AI 降噪。',
        },
        {
          label: '去除歌曲人聲',
          to: '/tools/remove-vocals-from-song',
          description: '製作伴奏。',
        },
      ],
      embed: {
        title: '將 MP3 轉換為 WAV',
        description: '上傳 MP3。輸出固定為 WAV；你可以視需要裁剪或標準化，然後按下「轉換檔案」。',
      },
    },
    'change-audio-speed': {
      name: '變更音訊速度',
      h1: '線上變更音訊速度：加快或放慢',
      tagline: '把講座或 Podcast 加速到 1.5 倍，或把歌曲或錄音減速到 0.75 倍用於練習，音高保持不變。',
      metaTitle: '線上免費變更音訊速度（音高不變） | Media Manipulator',
      metaDescription: '免費線上音訊變速工具。在 0.25 倍到 4 倍之間加快或放慢 MP3、WAV、M4A 等檔案，並保留音高。非常適合講座、Podcast 與練習音軌。無需註冊。',
      ogTitle: '線上免費變更音訊速度',
      ogDescription: '加快或放慢，卻不會出現花栗鼠效果。免費，無需註冊。',
      intro: '兩小時的講座以 1.5 倍速播放只需 80 分鐘。吉他獨奏放慢到 0.75 倍，就能學得起來。變更音訊速度每天都用得到，問題在於音高：單純加速會讓人聲變成花栗鼠的聲音。Media Manipulator 在我們的伺服器上以 FFmpeg 的節奏濾鏡對音訊進行時間伸縮，讓音高完全維持原樣，速度範圍從四分之一到四倍。',
      whatItDoes: [
        '將任何音訊檔案加快（1.1 倍到 4 倍）或放慢（0.25 倍到 0.9 倍）。',
        '保留音高，讓語音和音樂維持原本的調性。',
        '預設匯出為 MP3，也可匯出為 WAV、FLAC、M4A、OGG、Opus。',
        '可選擇在同一次處理中裁剪、標準化與套用 EQ。',
      ],
      flowSteps: [
        {
          title: '上傳音訊',
          description: 'MP3、WAV、M4A、OGG、FLAC 等格式。',
        },
        {
          title: '設定速度',
          description: '預設選取 1.5 倍；範圍為 0.25 倍到 4 倍。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 在保留音高的情況下進行時間伸縮。',
        },
        {
          title: '下載',
          description: '儲存調整速度後的檔案。',
        },
      ],
      advancedDetails: [
        '使用 atempo 濾鏡，超出 0.5 到 2.0 範圍的倍率會自動串接處理。',
        '在極端倍率下，時間伸縮會產生輕微的瑕疵；對語音而言，0.5 倍到 2 倍幾乎聽不出差異。',
        '若要同時變更速度「和」音高（磁帶效果），請使用音高工具的時間伸縮選項。',
      ],
      whyItMatters: [
        '講座、有聲書與 Podcast 通常以 1.25 倍到 2 倍播放最為舒適。',
        '音樂人會以 50% 到 75% 的速度練習困難的段落。',
        '整理逐字稿的人會放慢錄音，以聽清楚每一個字。',
      ],
      useCases: [
        {
          title: '加速講座',
          description: '以 1.5 倍速聆聽錄製的課程。',
        },
        {
          title: '練習音軌',
          description: '將獨奏放慢到 0.75 倍，調性維持不變。',
        },
        {
          title: '整理逐字稿',
          description: '將訪談放慢到 0.8 倍。',
        },
        {
          title: '配合時段',
          description: '將旁白微調 5%，讓它剛好放得進去。',
        },
      ],
      whyMediaManipulator: [
        '預設保留音高；不會出現花栗鼠聲或磁帶放慢般的聲音。',
        '任何輸出格式都可選擇，還能在同一次上傳中裁剪與標準化。',
      ],
      privacyNote: '你的錄音由我們伺服器上的 FFmpeg 加快或放慢，依你選擇的模式使用 rubberband 或 atempo。不會用到任何外部音訊服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。你會得到一個新檔案；上傳的檔案本身不會被更改。',
      faq: [
        {
          question: '音高會改變嗎？',
          answer: '不會。節奏濾鏡會讓音高完全維持原樣。',
        },
        {
          question: '最快可以加速到多少？',
          answer: '單次處理最高 4 倍。若要更快，可將結果再處理一次。',
        },
        {
          question: '放慢後的音訊聽起來會像機器人嗎？',
          answer: '放慢到 0.5 倍時仍然很乾淨；低於這個值就會聽到一些相位效應。',
        },
        {
          question: '可以同時變更速度與音高嗎？',
          answer: '可以。請使用「變更音訊音高」工具，它有時間伸縮控制項。',
        },
      ],
      related: [
        {
          label: '音訊轉換器',
          to: '/tools/audio-converter',
          description: '在所有常見音訊格式之間轉換。',
        },
        {
          label: '變更音訊音高',
          to: '/tools/change-audio-pitch',
          description: '將調性升高或降低。',
        },
        {
          label: '音訊標準化',
          to: '/tools/normalize-audio',
          description: '讓響度保持一致。',
        },
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: 'AI 降噪。',
        },
        {
          label: '去除歌曲人聲',
          to: '/tools/remove-vocals-from-song',
          description: '製作伴奏。',
        },
      ],
      embed: {
        title: '變更音訊檔案的速度',
        description: '上傳音訊檔案並設定速度倍率；預設選取 1.5 倍。音高會被保留，因此人聲聽起來依然自然。若也要改變調性，請使用音高工具。',
      },
    },
    'change-audio-pitch': {
      name: '變更音訊音高',
      h1: '線上變更音訊音高：升調或降調',
      tagline: '以半音為單位移調，改變歌曲或錄音的調性、降低人聲或調整取樣音高，節奏保持不變。',
      metaTitle: '線上免費變更音訊音高：以半音移調 | Media Manipulator',
      metaDescription: '免費線上音高變換工具。將 MP3、WAV 或任何音訊以半音為單位升高或降低以改變調性，速度保持不變。可選擇時間伸縮。無浮水印，無需註冊。',
      ogTitle: '線上免費變更音訊音高',
      ogDescription: '以半音為單位為任何音訊移調。免費，無需註冊。',
      intro: '伴奏的調性不適合你的嗓音、取樣需要配合一首歌、人聲想要再低一個全音：音高變換都能解決。Media Manipulator 在我們的伺服器上以 FFmpeg 依半音移調，長度保持不變；如果你想要的是老式的磁帶變速效果，也可以搭配時間伸縮使用。',
      whatItDoes: [
        '將音訊升高或降低最多 12 個半音（一個八度）。',
        '長度維持不變，讓音軌依然吻合。',
        '可選擇以時間伸縮獨立改變長度。',
        '將變換後的音訊輸出為 MP3、WAV、FLAC、M4A、OGG 或 Opus。',
      ],
      flowSteps: [
        {
          title: '上傳音訊',
          description: '任何常見的音訊格式。',
        },
        {
          title: '設定半音',
          description: '預設選取 +2；範圍為 -12 到 +12。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 重新取樣並調整時間。',
        },
        {
          title: '下載',
          description: '儲存移調後的檔案。',
        },
      ],
      advancedDetails: [
        '變換會以 2^(半音數/12) 的比例重新取樣，並補償節奏，讓長度保持不變。',
        '對完整混音做大幅變換（超過 5 個半音）可能聽起來不自然；人聲和單一樂器的效果較好。',
        '共振峰保留已開啟，因此降低後的人聲不會變成另一個人。',
      ],
      whyItMatters: [
        '歌手會把伴奏移到舒適的調性。',
        '製作人會讓取樣和人聲配合歌曲的音高。',
        '降低一兩個半音，可以讓試唱人聲聽起來更放鬆。',
      ],
      useCases: [
        {
          title: '變更伴奏調性',
          description: '把卡拉 OK 音軌降低兩個半音。',
        },
        {
          title: '調整取樣音高',
          description: '讓鼓聲或人聲取樣配合歌曲。',
        },
        {
          title: '降低旁白',
          description: '將一段朗讀降低一個半音。',
        },
        {
          title: '八度效果',
          description: '變換 +12 或 -12，作為效果層。',
        },
      ],
      whyMediaManipulator: [
        '以半音控制且長度不變，需要時還能使用時間伸縮。',
        '任何輸出格式都可選擇，還能在同一次上傳中裁剪與標準化。',
      ],
      privacyNote: '你的音訊由我們伺服器上的 FFmpeg 依你選擇的半音數升高或降低。不會用到任何外部音訊服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。你會得到一個新檔案；上傳的檔案本身不會被更改。',
      faq: [
        {
          question: '速度會改變嗎？',
          answer: '不會。長度會被保留。如果你想改變速度，請使用時間伸縮控制項。',
        },
        {
          question: '最多可以變換多少？',
          answer: '向上或向下最多 12 個半音（一個八度）。',
        },
        {
          question: '變換後的人聲聽起來會自然嗎？',
          answer: '一到三個半音的話，會。較大的變換就會聽得出來；共振峰保留可避免聽起來像卡通人物。',
        },
        {
          question: '可以以音分為單位變換嗎？',
          answer: '目前還不行；控制項以整數半音為單位。',
        },
      ],
      related: [
        {
          label: '音訊轉換器',
          to: '/tools/audio-converter',
          description: '在所有常見音訊格式之間轉換。',
        },
        {
          label: '變更音訊速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢錄音。',
        },
        {
          label: '音訊標準化',
          to: '/tools/normalize-audio',
          description: '讓響度保持一致。',
        },
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: 'AI 降噪。',
        },
        {
          label: '去除歌曲人聲',
          to: '/tools/remove-vocals-from-song',
          description: '製作伴奏。',
        },
      ],
      embed: {
        title: '變更音訊檔案的音高',
        description: '上傳音訊檔案。「進階處理」區段會展開並顯示音高滑桿；預設選取 +2 個半音。負值會降低調性。如果你也想改變長度，時間伸縮就在旁邊。',
      },
    },
    'normalize-audio': {
      name: '音訊標準化',
      h1: '線上音訊響度標準化',
      tagline: '將音量偏小的錄音提升到一致的響度，讓 Podcast、語音備忘錄和混合播放清單以相同音量播放。',
      metaTitle: '線上免費音訊標準化（響度） | Media Manipulator',
      metaDescription: '免費線上音訊標準化工具。以 EBU R128 響度標準化，讓 MP3、WAV、M4A 等檔案的響度保持一致。非常適合 Podcast 與語音備忘錄。無浮水印，無需註冊。',
      ogTitle: '線上免費音訊標準化',
      ogDescription: '讓任何錄音的響度保持一致。免費，無需註冊。',
      intro: '把手機拿得遠遠錄下的語音備忘錄音量很小；從 CD 擷取的歌曲音量很大；兩者接連播放時，聽眾就得伸手去調音量。響度標準化會測量整個檔案的感知響度，並將其調整到標準目標值，使用的正是廣播業者與串流服務所採用的 EBU R128 測量方式。Media Manipulator 在我們的伺服器上以 FFmpeg 的 loudnorm 濾鏡執行這項處理，同時讓真實峰值保持在上限以下，因此不會產生削波。',
      whatItDoes: [
        '測量整合響度，並標準化至廣播標準的目標值。',
        '限制真實峰值，讓輸出絕不削波。',
        '可在同一個區段中選擇加入增益、淡入／淡出與動態範圍壓縮。',
        '將調整後的檔案儲存為 MP3、WAV、FLAC、M4A、OGG 或 Opus。',
      ],
      flowSteps: [
        {
          title: '上傳音訊',
          description: '任何常見格式。',
        },
        {
          title: '保持標準化開啟',
          description: '視需要加入淡入淡出或壓縮。',
        },
        {
          title: '轉換',
          description: 'FFmpeg loudnorm 測量並校正。',
        },
        {
          title: '下載',
          description: '儲存調整後的檔案。',
        },
      ],
      advancedDetails: [
        '使用 loudnorm（EBU R128），預設整合響度目標為 -24 LUFS，真實峰值上限為 -2 dBTP。',
        '這是響度標準化，而非峰值標準化：兩個峰值都在 0 dB 的檔案，感知音量仍可能相差很大。',
        '若只想快速套用固定增益而不做分析，請使用「放大」滑桿或「調整音量」工具。',
      ],
      whyItMatters: [
        '需要不斷調整音量的 Podcast 會讓聽眾放棄收聽。',
        '播放清單與 DJ 組曲需要各音軌維持一致的音量。',
        '各平台在上傳時都會進行標準化；先自己處理，就不會有意外。',
      ],
      useCases: [
        {
          title: 'Podcast 單集',
          description: '在發布前調整錄製對談的音量。',
        },
        {
          title: '語音備忘錄',
          description: '提高音量偏小的手機錄音。',
        },
        {
          title: '講座錄音',
          description: '讓離麥克風忽近忽遠的講者音量保持一致。',
        },
        {
          title: '準備播放清單',
          description: '將從不同來源擷取的音軌標準化。',
        },
      ],
      whyMediaManipulator: [
        '真正的 EBU R128 響度測量，而不只是峰值掃描。',
        '淡入淡出、增益與壓縮都在同一個區段中。',
      ],
      privacyNote: '你的音訊響度由我們伺服器上的 FFmpeg 測量並調整一致。不會用到任何外部音訊服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。你會得到一個新檔案；上傳的檔案本身不會被更改。',
      faq: [
        {
          question: '使用的目標響度是多少？',
          answer: '整合響度 -24 LUFS，真實峰值上限 -2 dBTP，這是 EBU R128 的預設值。Podcast 平台的目標通常是 -16 到 -19 LUFS；如果你想要更大聲，可以再加上幾 dB 的放大。',
        },
        {
          question: '它會讓檔案內的所有內容都變成相同音量嗎？',
          answer: '不會。它是以整個檔案為單位調整。若要減少檔案內部的音量起伏，請同時開啟壓縮器。',
        },
        {
          question: '會產生削波嗎？',
          answer: '不會。真實峰值限幅器會讓峰值保持在上限以下。',
        },
        {
          question: '我可以只把音量調大嗎？',
          answer: '可以。請使用「調整音量」工具進行固定增益調整。',
        },
      ],
      related: [
        {
          label: '調整音量',
          to: '/tools/adjust-audio-volume',
          description: '以固定增益調大或調小。',
        },
        {
          label: '音訊轉換器',
          to: '/tools/audio-converter',
          description: '在所有常見音訊格式之間轉換。',
        },
        {
          label: '變更音訊速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢錄音。',
        },
        {
          label: '變更音訊音高',
          to: '/tools/change-audio-pitch',
          description: '將調性升高或降低。',
        },
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: 'AI 降噪。',
        },
        {
          label: '去除歌曲人聲',
          to: '/tools/remove-vocals-from-song',
          description: '製作伴奏。',
        },
      ],
      embed: {
        title: '將音訊檔案標準化',
        description: '上傳音訊檔案。「基本音訊處理」區段中已開啟響度標準化；如有需要，可加入放大、淡入淡出或壓縮。按下「轉換檔案」。',
      },
    },
    'adjust-audio-volume': {
      name: '調整音訊音量',
      h1: '線上調大或調小音訊音量',
      tagline: '依固定幅度調大或調小音訊音量，從 10% 到兩倍，或用放大滑桿以分貝調整。',
      metaTitle: '線上免費調大音訊音量（讓 MP3 更大聲） | Media Manipulator',
      metaDescription: '免費線上音量調整工具。依固定倍率或以分貝讓 MP3、WAV 或任何音訊檔案變大聲或變小聲，並可加入淡入淡出。無浮水印，無需註冊。',
      ogTitle: '線上調大或調小音訊音量',
      ogDescription: '讓任何音訊變大聲或變小聲。免費，無需註冊。',
      intro: '有時檔案就是太小聲，或比播放清單中的其他曲目大聲太多，只需要固定的增益調整就能解決。Media Manipulator 在我們的伺服器上以 FFmpeg 依倍率或以分貝調整音訊音量，可視需要加入淡入淡出，也能搭配響度正規化，讓結果不會削波。',
      whatItDoes: [
        '將音量乘以 0.1 倍（非常小聲）到 2 倍（加倍）。',
        '或用放大滑桿，以分貝精確設定 -60 到 +60 dB 的增益。',
        '以秒為單位設定淡入與淡出。',
        '可選擇正規化與壓縮，避免大幅提升音量時削波。',
      ],
      flowSteps: [
        {
          title: '上傳音訊',
          description: '任何常見格式皆可。',
        },
        {
          title: '設定音量',
          description: '預設為 1.5 倍；也可以改用分貝。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 套用增益。',
        },
        {
          title: '下載',
          description: '儲存調整後的檔案。',
        },
      ],
      advancedDetails: [
        '音量調整使用 volume 濾鏡；倍率 2 等於 +6 dB，0.5 等於 -6 dB。',
        '提升峰值已接近 0 dBFS 的檔案會造成削波；請啟用正規化，其中包含真峰值限制器。',
        '若要一致的感知響度而非固定增益，請使用「音訊標準化」。',
      ],
      whyItMatters: [
        '音量小的錄音在手機喇叭上很難聽清楚。',
        '太大聲的鈴聲或音效不但刺耳，還會削波。',
        '當你確切知道要調整多少時，固定增益就是合適的工具。',
      ],
      useCases: [
        {
          title: '提升小聲的備忘錄',
          description: '讓手機錄音聽得清楚。',
        },
        {
          title: '壓低過大的音效',
          description: '將音效降低 10 dB。',
        },
        {
          title: '鈴聲',
          description: '提升音量並加入淡出。',
        },
        {
          title: '背景音樂',
          description: '降低音軌音量，讓它襯在人聲底下。',
        },
      ],
      whyMediaManipulator: [
        '倍率或分貝，加上淡入淡出，全在同一處完成。',
        '在同一次處理中進行正規化與壓縮，防止削波。',
      ],
      privacyNote: '你的音訊會由我們伺服器上的 FFmpeg 依你設定的幅度調大或調小。過程不涉及任何外部音訊服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。你會得到一個新檔案；上傳的檔案本身不會被變更。',
      faq: [
        {
          question: '最多可以提升多少？',
          answer: '使用倍率最多 2 倍，使用放大滑桿最多 +60 dB。除非開啟正規化，否則大幅提升會削波。',
        },
        {
          question: '會失真嗎？',
          answer: '只有在提升後的訊號超過滿刻度時才會。請開啟正規化，它會限制真峰值。',
        },
        {
          question: '用倍率還是分貝？',
          answer: '兩者作用相同。2 倍等於 +6 dB；0.5 倍等於 -6 dB。',
        },
        {
          question: '可以改為讓音量平均一致嗎？',
          answer: '可以。使用「音訊標準化」即可取得一致的感知響度。',
        },
      ],
      related: [
        {
          label: '音訊標準化',
          to: '/tools/normalize-audio',
          description: '一致的響度。',
        },
        {
          label: '音訊轉換器',
          to: '/tools/audio-converter',
          description: '在所有常見音訊格式之間轉換。',
        },
        {
          label: '變更音訊速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢錄音。',
        },
        {
          label: '變更音訊音高',
          to: '/tools/change-audio-pitch',
          description: '將調性升高或降低。',
        },
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: 'AI 降噪。',
        },
        {
          label: '去除歌曲人聲',
          to: '/tools/remove-vocals-from-song',
          description: '製作伴奏。',
        },
      ],
      embed: {
        title: '調整音訊檔案的音量',
        description: '上傳音訊檔案並設定音量倍率；預設為 1.5 倍。若要以分貝調整，請使用「基本音訊處理」中的放大滑桿。大幅提升可能會削波；開啟正規化即可得到安全的結果。',
      },
    },
    'audio-equalizer': {
      name: '音訊等化器',
      h1: '線上音訊等化：低音增強、高音、預設組',
      tagline: '套用低音增強、高音提升、人聲突顯或曲風預設，或設定低通與高通濾波器，然後下載結果。',
      metaTitle: '線上音訊等化器：低音增強、高音、人聲 | Media Manipulator',
      metaDescription: '免費線上音訊等化器。為 MP3、WAV 等檔案套用低音增強、高音增強、人聲、搖滾、爵士或古典 EQ 預設組，或設定高通與低通濾波器。無需註冊。',
      ogTitle: '線上音訊等化',
      ogDescription: '低音增強、高音、人聲臨場感等效果。免費，無需註冊。',
      intro: 'EQ 塑造錄音的音色：為單薄的音軌補足低頻，為聲音轟隆的房間減少低頻，提升臨場感讓人聲更突出，或用高通濾除隆隆聲。Media Manipulator 在我們的伺服器上以 FFmpeg 進行等化，從一鍵預設組到明確的濾波截止頻率都有，並可匯出為任何音訊格式。',
      whatItDoes: [
        '預設組：低音增強、高音增強、人聲、搖滾、爵士、古典。',
        '可調整截止頻率的高通與低通濾波器。',
        '可搭配音量、正規化、壓縮與殘響。',
        '等化後的結果可輸出為 MP3、WAV、FLAC、M4A、OGG 或 Opus。',
      ],
      flowSteps: [
        {
          title: '上傳音訊',
          description: '任何常見格式皆可。',
        },
        {
          title: '選擇預設組或濾波器',
          description: '預設已選擇低音增強。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 套用 EQ 處理鏈。',
        },
        {
          title: '下載',
          description: '儲存調整好音色的檔案。',
        },
      ],
      advancedDetails: [
        '預設組對應到 FFmpeg 的 equalizer、bass 與 treble 濾鏡，使用固定的增益與 Q 值。',
        '高通設在 80 到 120 Hz 可去除人聲錄音中的手持雜音與隆隆聲；低通設在 8 到 10 kHz 可抑制嘶嘶聲。',
        'EQ 無法加入從未錄到的頻率；手機錄音在 100 Hz 以下幾乎沒有可提升的內容。',
      ],
      whyItMatters: [
        '稍微提升臨場感，就能讓語音在小喇叭上清楚許多。',
        '隆隆聲與嘶嘶聲是最常見的兩種修正，而且都只需要簡單的濾波器。',
        '曲風預設組能快速為播放清單帶來一致的風格。',
      ],
      useCases: [
        {
          title: '人聲清晰度',
          description: '為 Podcast 套用人聲預設組並加上高通。',
        },
        {
          title: '低音增強',
          description: '讓單薄的錄音更飽滿。',
        },
        {
          title: '去除隆隆聲',
          description: '高通設在 100 Hz。',
        },
        {
          title: '抑制嘶嘶聲',
          description: '為舊錄音帶的轉錄檔套用 10 kHz 低通。',
        },
      ],
      whyMediaManipulator: [
        '預設組與明確的濾波截止頻率集中在同一個區塊。',
        '在同一次上傳中串接正規化、壓縮與殘響。',
      ],
      privacyNote: '你的音訊的低音、中音與高音由我們伺服器上的 FFmpeg 等化器重新調整。過程不涉及任何外部音訊服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。你會得到一個新檔案；上傳的檔案本身不會被變更。',
      faq: [
        {
          question: '可以自訂頻段嗎？',
          answer: '目前提供預設組以及高通與低通截止頻率；逐頻段增益已列入開發規劃。',
        },
        {
          question: '高通濾波器有什麼作用？',
          answer: '它會去除截止頻率以下的所有聲音：隆隆聲、手持雜音、爆破音的低頻撞擊聲。',
        },
        {
          question: 'EQ 能修正悶悶的錄音嗎？',
          answer: '如果高頻只是偏小聲，高音增強會有幫助。如果高頻根本沒有錄到，EQ 無法憑空產生；請試試 AI 人聲降噪。',
        },
        {
          question: 'EQ 會削波嗎？',
          answer: '提升可能會。請開啟正規化，其中包含真峰值限制器。',
        },
      ],
      related: [
        {
          label: '人聲音訊降噪',
          to: '/tools/clean-voice-audio',
          description: 'AI 人聲增強。',
        },
        {
          label: '音訊轉換器',
          to: '/tools/audio-converter',
          description: '在所有常見音訊格式之間轉換。',
        },
        {
          label: '變更音訊速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢錄音。',
        },
        {
          label: '變更音訊音高',
          to: '/tools/change-audio-pitch',
          description: '將調性升高或降低。',
        },
        {
          label: '音訊標準化',
          to: '/tools/normalize-audio',
          description: '讓響度平均一致。',
        },
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: 'AI 降噪。',
        },
        {
          label: '去除歌曲人聲',
          to: '/tools/remove-vocals-from-song',
          description: '製作伴奏。',
        },
      ],
      embed: {
        title: '等化音訊檔案',
        description: '上傳音訊檔案。「基本音訊處理」中的等化器已開啟並選用低音增強預設組；你可以選擇其他預設組，或設定高通與低通截止頻率。按下「轉換」。',
      },
    },
    'add-reverb-to-audio': {
      name: '為音訊加入殘響',
      h1: '線上為音訊加入殘響或回音',
      tagline: '為乾聲人聲或錄音加上房間、大廳、板式或彈簧殘響，或加入延遲或回音，然後下載結果。',
      metaTitle: '線上免費為音訊加入殘響或回音 | Media Manipulator',
      metaDescription: '免費線上殘響與回音工具。為 MP3、WAV 及任何音訊檔案加入房間、大廳、板式或彈簧殘響，或加入延遲，並可控制濕聲比例與房間大小。無需註冊。',
      ogTitle: '線上為音訊加入殘響或回音',
      ogDescription: '房間、大廳、板式、彈簧與延遲。免費，無需註冊。',
      intro: '在經過聲學處理的房間裡錄下的人聲，在被放進某個空間之前，聽起來都很死板。殘響能加入空間感；延遲能加入節奏感。Media Manipulator 在我們的伺服器上以 FFmpeg 套用房間、大廳、板式與彈簧殘響，以及回音式延遲，可控制濕聲比例與房間大小，並匯出為任何音訊格式。',
      whatItDoes: [
        '房間、大廳、板式與彈簧殘響類型，可調整房間大小、阻尼與乾濕比例。',
        '簡單回音、多拍點與乒乓延遲，可調整時間與回授。',
        '同一區塊中還有合唱、鑲邊、相位與顫音等調變效果。',
        '加入效果後的版本可選擇 MP3、WAV、FLAC、M4A、OGG 或 Opus。',
      ],
      flowSteps: [
        {
          title: '上傳音訊',
          description: '乾聲人聲或樂器的效果最好。',
        },
        {
          title: '選擇殘響',
          description: '預設已選擇大廳；設定大小與比例。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 算繪效果。',
        },
        {
          title: '下載',
          description: '儲存結果。',
        },
      ],
      advancedDetails: [
        '殘響以 FFmpeg 的 aecho 建構，每種類型各有一組延遲與衰減設定；濕聲比例決定效果與乾聲訊號的混合程度。',
        '延遲時間以毫秒為單位；回授超過 70% 會迅速累積。',
        '效果會算繪進檔案；如果之後可能想更改，請保留原始乾聲檔。',
      ],
      whyItMatters: [
        '乾聲人聲與旁白如果沒有一點空間感，聽起來會不自然。',
        '短的板式殘響是口語與歌曲的標準潤飾手法。',
        '延遲與調變是製作音效設計元素最快的方法。',
      ],
      useCases: [
        {
          title: '人聲潤飾',
          description: '為演唱或口說錄音加上短的板式殘響。',
        },
        {
          title: '大型廳堂',
          description: '把合唱或鋪底音色放進大教堂裡。',
        },
        {
          title: '拍擊回音',
          description: '為吉他或人聲加上快速的回音。',
        },
        {
          title: '音效設計',
          description: '為音效加上乒乓延遲與鑲邊。',
        },
      ],
      whyMediaManipulator: [
        '四種殘響類型、三種延遲類型與四種調變效果，集中在同一個區塊。',
        '在同一次上傳中搭配 EQ、正規化與音高調整。',
      ],
      privacyNote: '殘響由我們伺服器上的 FFmpeg 加入你的音訊。過程不涉及任何外部音訊服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。你會得到一個新檔案；上傳的檔案本身不會被變更。',
      faq: [
        {
          question: '人聲該用哪種殘響？',
          answer: '板式或小房間，濕聲比例 20% 到 30%。大廳適合音樂與音效。',
        },
        {
          question: '可以去除殘響嗎？',
          answer: '這裡不行。AI 人聲降噪工具可以減少語音中的房間聲。',
        },
        {
          question: '可以同時加入殘響與延遲嗎？',
          answer: '可以。兩者在同一個區塊中，可以一起啟用。',
        },
        {
          question: '效果可以還原嗎？',
          answer: '不行。效果會算繪進檔案；請保留你的原始乾聲檔。',
        },
      ],
      related: [
        {
          label: '音訊轉換器',
          to: '/tools/audio-converter',
          description: '在所有常見音訊格式之間轉換。',
        },
        {
          label: '變更音訊速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢錄音。',
        },
        {
          label: '變更音訊音高',
          to: '/tools/change-audio-pitch',
          description: '將調性升高或降低。',
        },
        {
          label: '音訊標準化',
          to: '/tools/normalize-audio',
          description: '讓響度平均一致。',
        },
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: 'AI 降噪。',
        },
        {
          label: '去除歌曲人聲',
          to: '/tools/remove-vocals-from-song',
          description: '製作伴奏。',
        },
      ],
      embed: {
        title: '為音訊檔案加入殘響',
        description: '上傳音訊檔案。「時間類效果」區塊開啟時已選擇大廳殘響；你可以調整房間大小與濕聲比例，或改選房間、板式或彈簧，也可以加入延遲。按下「轉換」。',
      },
    },
    'trim-audio': {
      name: '裁剪音訊',
      h1: '線上免費裁剪或剪下音訊',
      tagline: '將 MP3、WAV 或任何錄音裁剪到指定的開始與結束時間，藉由波形選取時間點，只下載需要的部分。',
      metaTitle: '線上免費裁剪音訊：剪輯 MP3、WAV | Media Manipulator',
      metaDescription: '免費線上音訊裁剪工具。藉由波形將任何音訊檔案剪成指定範圍，加入淡入淡出，並下載 MP3、WAV、M4A 等格式。可製作鈴聲或片段。無浮水印，無需註冊。',
      ogTitle: '線上免費裁剪或剪下音訊',
      ogDescription: '在波形上選擇開始與結束點，然後下載片段。免費，無需註冊。',
      intro: '拿來當鈴聲的副歌、兩小時錄音中最精彩的那一分鐘、去掉開場的金句片段：裁剪是每個人都需要的音訊編輯。Media Manipulator 會顯示波形，讓你拖曳開始與結束點，在我們的伺服器上以 FFmpeg 剪輯，並可加入淡入淡出後匯出為任何格式。',
      whatItDoes: [
        '將任何音訊檔案剪到在波形上選定的開始與結束時間。',
        '淡入與淡出，讓剪輯點不會出現喀聲。',
        '剪好的片段會以 MP3、WAV、FLAC、M4A、OGG 或 Opus 格式提供。',
        '在同一次處理中搭配音量、正規化與 EQ。',
      ],
      flowSteps: [
        {
          title: '上傳音訊',
          description: '任何常見格式皆可。',
        },
        {
          title: '設定範圍',
          description: '在波形上拖曳標記。',
        },
        {
          title: '轉換',
          description: 'FFmpeg 剪輯並編碼。',
        },
        {
          title: '下載',
          description: '儲存片段。',
        },
      ],
      advancedDetails: [
        '剪輯精確到取樣點；輸出會以你選擇的格式重新編碼。',
        '0.05 到 0.2 秒的淡入淡出可消除剪輯點的喀聲。',
        '若是影片，請使用「影片裁剪」；若要為結果製作波形影片，請使用「音訊波形產生器」。',
      ],
      whyItMatters: [
        '鈴聲與通知音效需要 20 到 30 秒的片段。',
        '分享金句片段比分享整段錄音更方便。',
        '轉錄前先去除靜音與開場，可以節省時間。',
      ],
      useCases: [
        {
          title: '鈴聲',
          description: '剪下副歌並加入淡出。',
        },
        {
          title: '金句片段',
          description: '從訪談中擷取一句話。',
        },
        {
          title: '去除不佳的開頭',
          description: '刪掉備忘錄的前 10 秒。',
        },
        {
          title: '取樣',
          description: '單獨擷取一個擊打聲或一段樂句。',
        },
      ],
      whyMediaManipulator: [
        '以可拖曳的標記在波形上編輯，而不是手動輸入時間碼。',
        '在同一次上傳中完成淡入淡出、正規化，並選擇任何輸出格式。',
      ],
      privacyNote: '你的音訊由我們伺服器上的 FFmpeg 剪到你設定的開始與結束點。過程不涉及任何外部音訊服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。你會得到一個新檔案；上傳的檔案本身不會被變更。',
      faq: [
        {
          question: '可以輸入精確時間嗎？',
          answer: '可以。裁剪對話方塊除了可拖曳的標記，還有開始與結束欄位。',
        },
        {
          question: '剪輯點會有喀聲嗎？',
          answer: '在「基本音訊處理」中加入短暫的淡入與淡出即可避免。',
        },
        {
          question: '可以保留原始品質嗎？',
          answer: '選擇 WAV 或 FLAC 輸出，即可避免有損的重新編碼。',
        },
        {
          question: '可以剪掉中間的部分嗎？',
          answer: '每次處理只能設定一個範圍；請執行工具兩次，再到 Darkroom 中把各段接起來。',
        },
      ],
      related: [
        {
          label: '影片裁剪',
          to: '/tools/video-trimmer',
          description: '適用於影片的同類工具。',
        },
        {
          label: '從影片擷取音訊',
          to: '/tools/extract-audio-from-video',
          description: '先取得音訊。',
        },
        {
          label: '音訊轉換器',
          to: '/tools/audio-converter',
          description: '在所有常見音訊格式之間轉換。',
        },
        {
          label: '變更音訊速度',
          to: '/tools/change-audio-speed',
          description: '加快或放慢錄音。',
        },
        {
          label: '變更音訊音高',
          to: '/tools/change-audio-pitch',
          description: '將調性升高或降低。',
        },
        {
          label: '音訊標準化',
          to: '/tools/normalize-audio',
          description: '讓響度平均一致。',
        },
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: 'AI 降噪。',
        },
        {
          label: '去除歌曲人聲',
          to: '/tools/remove-vocals-from-song',
          description: '製作伴奏。',
        },
      ],
      embed: {
        title: '裁剪音訊檔案',
        description: '上傳音訊檔案，按下「剪輯音訊」，然後在波形上拖曳開始與結束標記。需要的話，可在「基本音訊處理」中加入淡入或淡出。按下「轉換」。',
      },
    },
    'transcribe-audio': {
      name: '音訊轉文字',
      h1: '線上將音訊轉錄為文字',
      tagline: '在我們自己的 GPU 伺服器上，以 AI 語音辨識將 MP3、WAV、M4A 或任何錄音轉換為文字、字幕或 JSON。',
      metaTitle: '線上將音訊轉錄為文字（免費 AI） | Media Manipulator',
      metaDescription: '免費線上音訊轉錄。將 MP3、WAV、M4A、OGG 或 FLAC 錄音轉換為純文字、VTT 或 SRT 字幕，或附時間戳記的 JSON。在我們自己的 GPU 上執行，不使用第三方 AI。',
      ogTitle: '線上將音訊轉錄為文字',
      ogDescription: '將錄音、訪談與語音備忘錄轉為文字。免費，無需註冊。',
      intro: '訪談、講座、語音備忘錄與會議錄音轉成文字後實用得多：可以搜尋、引用、翻譯。Media Manipulator 在我們營運的 GPU 伺服器上以 Whisper 模型轉錄音訊，所以你的錄音絕不會離開我們的基礎設施，並提供純文字、VTT 或 SRT 字幕，或附逐字時間戳記的 JSON 逐字稿。',
      whatItDoes: [
        '以 Whisper 轉錄 MP3、WAV、M4A、OGG、FLAC 等音訊。',
        '輸出純文字、VTT、SRT 或附時間戳記的 JSON。',
        '在數十種語言中自動偵測語言。',
        '在我們自己的 GPU 上執行；不使用第三方 AI 供應商。',
      ],
      flowSteps: [
        {
          title: '上傳音訊',
          description: '任何常見格式皆可。',
        },
        {
          title: '選擇輸出',
          description: '文字、VTT、SRT 或 JSON。',
        },
        {
          title: '轉錄',
          description: 'Whisper 在我們的 GPU 伺服器上執行。',
        },
        {
          title: '下載',
          description: '開啟逐字稿檢視器或儲存檔案。',
        },
      ],
      advancedDetails: [
        '使用 whisper-ctranslate2 搭配大型多語言模型；語音清晰、背景雜音少時準確度最高。',
        '錄音雜音較多時，請先執行「去除背景雜音」工具，以取得更好的逐字稿。',
        '轉錄計為一次 AI 工作，從每日 AI 工作次數扣除，而不是每日一般工作次數；失敗的工作不會計入。',
      ],
      whyItMatters: [
        '文字可以搜尋與快速瀏覽；音訊則不行。',
        '字幕讓音訊內容更易於取用，也能被搜尋引擎索引。',
        '逐字稿是筆記、文章與翻譯的起點。',
      ],
      useCases: [
        {
          title: '訪談筆記',
          description: '取得可以直接引用的文字。',
        },
        {
          title: '講座逐字稿',
          description: '讀文字複習，並搜尋專有名詞。',
        },
        {
          title: 'Podcast 字幕',
          description: '為影片版本製作 SRT 或 VTT。',
        },
        {
          title: '語音備忘錄轉文字',
          description: '把想法變成文件。',
        },
      ],
      whyMediaManipulator: [
        'Whisper 執行在我們自己營運的硬體上；你的音訊絕不會傳送給第三方 AI。',
        '四種輸出格式，加上內建的逐字稿檢視器。',
      ],
      privacyNote: '你的錄音由我們自己 GPU 伺服器上的 Whisper 轉錄，文字會隨工作一起保存。AI 工作在我們營運的硬體上執行，絕不使用第三方 AI 供應商，你上傳的任何內容都不會被用來訓練模型。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。',
      faq: [
        {
          question: '支援哪些語言？',
          answer: 'Whisper 可處理數十種語言，並會自動偵測語言。',
        },
        {
          question: '準確度如何？',
          answer: '語音清晰時非常好。背景雜音、多人同時說話與濃重口音會降低準確度；可以的話請先降噪。',
        },
        {
          question: '我的錄音會傳送給 OpenAI 嗎？',
          answer: '不會。模型在我們自己的 GPU 伺服器上執行。',
        },
        {
          question: '可以取得說話者標籤嗎？',
          answer: '目前還不行。JSON 輸出包含逐字層級的時間戳記，可用來分段。',
        },
        {
          question: '這會占用我的額度嗎？',
          answer: '會，計為一次 AI 工作，從每日 AI 工作次數扣除，與每日一般工作次數分開計算。失敗的工作不會計入。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '計為一次 AI 工作；失敗的工作不會計入。',
        ],
      },
      related: [
        {
          label: '影片轉錄',
          to: '/tools/transcribe-video',
          description: '適用於影片檔案。',
        },
        {
          label: 'SRT 字幕產生器',
          to: '/tools/srt-generator',
          description: '直接產生字幕。',
        },
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: '先清理音訊。',
        },
        {
          label: '字幕翻譯器',
          to: '/tools/caption-translator',
          description: '翻譯字幕。',
        },
      ],
      embed: {
        title: '轉錄音訊檔案',
        description: '上傳音訊檔案並選擇輸出：純文字適合文件，VTT 或 SRT 適合字幕，JSON 則提供時間戳記。Whisper 在我們的 GPU 伺服器上執行；不會有任何內容傳送給第三方 AI。',
      },
    },
    'add-text-to-image': {
      name: '為圖片加入文字',
      h1: '線上免費為圖片加入文字',
      tagline: '在相片上加入說明、標題或浮水印：選擇字型、大小、顏色、外框與位置，然後下載。',
      metaTitle: '線上免費為圖片加入文字：說明文字、浮水印 | Media Manipulator',
      metaDescription: '免費線上工具，可在相片上加入文字。為 JPG、PNG、WebP 等格式圖片上的說明文字、迷因或浮水印選擇字型、大小、顏色、外框與位置。無需註冊。',
      ogTitle: '線上免費為圖片加入文字',
      ogDescription: '在任何相片上加入說明、標題或浮水印。免費，無需註冊。',
      intro: '螢幕截圖上的說明、縮圖上的標題、相片角落的著作權聲明：加入文字是僅次於裁切的最常見圖片編輯。Media Manipulator 在我們的伺服器上以 ImageMagick 將文字繪製到圖片上，可設定字型、大小、填色與外框顏色，位置可從九個錨點中選擇或指定精確的像素座標，並匯出為相同或不同的格式。',
      whatItDoes: [
        '以任意大小繪製一個文字區塊，並可設定填色與外框顏色。',
        '內建六種字型（無襯線、襯線、等寬，各有兩種字族）。',
        '九個錨點位置，或精確的 x/y 定位。',
        '在同一次處理中搭配調整尺寸、裁切、濾鏡與中繼資料選項。',
      ],
      flowSteps: [
        {
          title: '上傳圖片',
          description: 'JPG、PNG、WebP、HEIC 等格式。',
        },
        {
          title: '輸入文字並設定樣式',
          description: '大小、顏色、外框、字型、位置。',
        },
        {
          title: '轉換',
          description: 'ImageMagick 繪製文字。',
        },
        {
          title: '下載',
          description: '儲存加上文字的圖片。',
        },
      ],
      advancedDetails: [
        '文字會依輸出尺寸點陣化；請依圖片寬度以像素設定文字大小。',
        '2 到 4 px、顏色對比鮮明的外框，能讓文字在雜亂的相片上依然清楚可讀。',
        '選擇 PNG 輸出，可為浮水印範本保留透明背景。',
      ],
      whyItMatters: [
        '說明文字讓螢幕截圖一看就懂。',
        '明顯的著作權聲明能阻止他人未標註出處就轉貼。',
        '有標題的縮圖會獲得更多點擊。',
      ],
      useCases: [
        {
          title: '為螢幕截圖加上說明',
          description: '標出觀看者正在看的內容。',
        },
        {
          title: '為相片加上浮水印',
          description: '在下方角落放上你的名字。',
        },
        {
          title: '縮圖標題',
          description: '為影片縮圖加上醒目的粗體大字。',
        },
        {
          title: '迷因',
          description: '上方文字、下方文字。',
        },
      ],
      whyMediaManipulator: [
        '填色、外框、字型與九點定位，不只是一個文字方塊。',
        '在同一次上傳中調整尺寸、裁切與轉換。',
      ],
      privacyNote: '你輸入的文字由我們伺服器上的 ImageMagick 繪製到你的圖片上。不會有任何內容傳送到外部服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。原始檔案絕不會被修改：你下載的是一個新檔案。',
      faq: [
        {
          question: '可以加入多行文字嗎？',
          answer: '每次處理一個文字區塊；文字中的換行會顯示為新的一行。如需第二個區塊，請再執行一次工具。',
        },
        {
          question: '可以使用自己的字型嗎？',
          answer: '提供六種內建字型；不支援上傳自訂字型。',
        },
        {
          question: '如何精確放置文字？',
          answer: '選擇一個錨點，再加上以像素為單位的 x/y 偏移。',
        },
        {
          question: '會降低畫質嗎？',
          answer: '圖片會重新編碼；選擇 PNG 或較高的 JPG 品質即可保持清晰。',
        },
      ],
      related: [
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在圖片格式之間轉換。',
        },
        {
          label: '裁切圖片',
          to: '/tools/crop-image',
          description: '裁切到指定區域。',
        },
        {
          label: '圖片尺寸調整',
          to: '/tools/image-resizer',
          description: '變更尺寸。',
        },
        {
          label: '圖片濾鏡與特效',
          to: '/tools/image-filters',
          description: '復古褐色、素描、浮雕等效果。',
        },
        {
          label: '移除圖片中的 EXIF 中繼資料',
          to: '/tools/remove-exif-metadata',
          description: '清除位置與裝置資料。',
        },
      ],
      embed: {
        title: '為圖片加入文字',
        description: '上傳圖片。「文字疊加」區塊會醒目標示：輸入文字，設定大小、顏色、外框、字型與位置（九個錨點或精確座標）。按下「轉換」。',
      },
    },
    'crop-image': {
      name: '裁切圖片',
      h1: '線上免費裁切圖片',
      tagline: '在相片上拖曳出需要的區域，調整構圖，並以任何格式只下載該區域。',
      metaTitle: '線上免費裁切圖片 | Media Manipulator',
      metaDescription: '免費線上圖片裁切工具。拖曳選取 JPG、PNG、WebP 或 HEIC 相片中的區域並下載。可搭配調整尺寸、濾鏡與格式轉換。無需註冊。',
      ogTitle: '線上免費裁切圖片',
      ogDescription: '拖曳一個框，下載該區域。免費，無需註冊。',
      intro: '裁切能修正構圖、去除邊緣的雜物，讓一張相片的構圖更緊湊。Media Manipulator 會在上傳的圖片上開啟視覺化裁切工具，在我們的伺服器上以 ImageMagick 套用裁切，並讓你在同一次處理中調整結果的尺寸、套用濾鏡並轉換格式。',
      whatItDoes: [
        '在實際圖片上以拖曳控點操作的視覺化裁切框。',
        '顯示精確的裁切座標，並可直接編輯。',
        '裁切後可搭配調整為目標寬度與高度。',
        '將裁切區域儲存為 JPG、PNG、WebP、AVIF 或 GIF。',
      ],
      flowSteps: [
        {
          title: '上傳圖片',
          description: '任何常見格式皆可。',
        },
        {
          title: '框選裁切範圍',
          description: '拖曳裁切框與控點。',
        },
        {
          title: '轉換',
          description: 'ImageMagick 裁切並編碼。',
        },
        {
          title: '下載',
          description: '儲存裁切後的圖片。',
        },
      ],
      advancedDetails: [
        '裁切會在調整尺寸之前套用，所以一張 4000 px 的相片裁切為 1000 px 再調整為 500 px 時，只會縮小一次。',
        '裁切會移除像素，而且無法還原；請保留原始檔案。',
        '會遵循 EXIF 方向資訊，所以旋轉過的手機照片會依你看到的樣子裁切。',
      ],
      whyItMatters: [
        '更緊湊的構圖是改善大多數相片最快的方法。',
        '大頭貼與縮圖需要特定的區域與比例。',
        '裁掉路人或車牌是一種保護隱私的做法。',
      ],
      useCases: [
        {
          title: '大頭貼',
          description: '裁切到臉部。',
        },
        {
          title: '去除雜物',
          description: '去掉相片的邊緣。',
        },
        {
          title: '螢幕截圖細節',
          description: '只保留相關的部分。',
        },
        {
          title: '商品照',
          description: '緊密裁切，再為商品頁調整尺寸。',
        },
      ],
      whyMediaManipulator: [
        '附精確座標的視覺化裁切工具，並可在同一次處理中調整尺寸與轉換。',
        '中繼資料依你的選擇保留或移除。',
      ],
      privacyNote: '你的圖片由我們伺服器上的 ImageMagick 裁切到你選取的區域。不會有任何內容傳送到外部服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。原始檔案絕不會被修改：你下載的是一個新檔案。',
      faq: [
        {
          question: '可以依固定比例裁切嗎？',
          answer: '將裁切框拖曳到你需要的比例；拖曳時會顯示寬度與高度。',
        },
        {
          question: '裁切會降低畫質嗎？',
          answer: '保留下來的像素不會受到影響。重新編碼時請選擇 PNG 或較高的 JPG 品質。',
        },
        {
          question: '可以裁切影片嗎？',
          answer: '可以，請使用「裁切影片」工具。',
        },
        {
          question: '可以先旋轉嗎？',
          answer: '請先使用「旋轉圖片」工具，再進行裁切。',
        },
      ],
      related: [
        {
          label: '裁切影片',
          to: '/tools/crop-video',
          description: '適用於影片的同類工具。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在圖片格式之間轉換。',
        },
        {
          label: '圖片尺寸調整',
          to: '/tools/image-resizer',
          description: '變更尺寸。',
        },
        {
          label: '為圖片加入文字',
          to: '/tools/add-text-to-image',
          description: '加上說明文字或浮水印。',
        },
        {
          label: '圖片濾鏡與特效',
          to: '/tools/image-filters',
          description: '復古褐色、素描、浮雕等效果。',
        },
        {
          label: '移除圖片中的 EXIF 中繼資料',
          to: '/tools/remove-exif-metadata',
          description: '清除位置與裝置資料。',
        },
      ],
      embed: {
        title: '裁切圖片',
        description: '上傳圖片並按下「裁切圖片」，開啟視覺化裁切工具。將裁切框拖曳到你要的區域並儲存；按下「轉換」時就會套用裁切。',
      },
    },
    'grayscale-image': {
      name: '將圖片轉換為黑白',
      h1: '線上將圖片轉換為黑白',
      tagline: '將彩色相片轉為灰階，或轉為復古色調的棕褐色，並以任何格式下載。',
      metaTitle: '線上免費將圖片轉換為黑白 | Media Manipulator',
      metaDescription: '免費線上黑白相片轉換工具。將任何 JPG、PNG、WebP 或 HEIC 圖片轉為灰階或復古褐色並下載。可搭配裁切、調整尺寸與格式轉換。無需註冊。',
      ogTitle: '線上將圖片轉換為黑白',
      ogDescription: '一鍵轉為灰階或復古褐色。免費，無需註冊。',
      intro: '黑白讓相片只剩下光線、形狀與質感，隱藏色偏與混合光源，並讓一組相片呈現一致的風格。Media Manipulator 在我們的伺服器上以 ImageMagick 依亮度加權轉換為灰階，提供復古褐色與復古色調，並可匯出為任何圖片格式。',
      whatItDoes: [
        '以正確的亮度加權將彩色圖片轉換為灰階。',
        '提供復古褐色與復古兩種替代選項，呈現溫暖或懷舊的色調。',
        '可搭配裁切、調整尺寸、文字與格式轉換。',
        '單色版本可輸出為 JPG、PNG、WebP、AVIF 或 GIF。',
      ],
      flowSteps: [
        {
          title: '上傳圖片',
          description: '任何常見格式皆可。',
        },
        {
          title: '保留灰階或選擇復古褐色',
          description: '濾鏡已預先選好。',
        },
        {
          title: '轉換',
          description: 'ImageMagick 套用轉換。',
        },
        {
          title: '下載',
          description: '儲存結果。',
        },
      ],
      advancedDetails: [
        '灰階使用 Rec. 709 亮度權重，所以綠色會比藍色顯得更亮，符合人眼的預期。',
        '復古褐色會在灰階之後套用色調；復古則會額外加上輕微的褪色與暗角。',
        '除非你選擇能原生儲存灰階的格式，否則輸出會保留三個色彩通道。',
      ],
      whyItMatters: [
        '單色能隱藏不佳的色彩與混合光源。',
        '風格一致的黑白相片組看起來像經過精心挑選。',
        '灰階圖片壓縮後檔案更小。',
      ],
      useCases: [
        {
          title: '人像',
          description: '經典的黑白大頭照。',
        },
        {
          title: '文件掃描',
          description: '將拍攝的頁面轉為灰階。',
        },
        {
          title: '復古風格',
          description: '為家族照片套用復古褐色。',
        },
        {
          title: '列印',
          description: '為黑白印表機做好準備。',
        },
      ],
      whyMediaManipulator: [
        '亮度正確的灰階，加上復古褐色與復古。',
        '在同一次上傳中裁切、調整尺寸與轉換。',
      ],
      privacyNote: '你的圖片色彩由我們伺服器上的 ImageMagick 移除。不會有任何內容傳送到外部服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。原始檔案絕不會被修改：你下載的是一個新檔案。',
      faq: [
        {
          question: '灰階還是去飽和？',
          answer: '這是依亮度加權的灰階，看起來比單純去除飽和度更自然。',
        },
        {
          question: '可以做出復古褐色調嗎？',
          answer: '可以。在濾鏡選單中選擇復古褐色或復古。',
        },
        {
          question: '可以對影片這樣做嗎？',
          answer: '可以。使用「調整影片亮度與色彩」，並將飽和度設為 -100。',
        },
        {
          question: '原本的色彩能復原嗎？',
          answer: '不能。請保留原始檔案。',
        },
      ],
      related: [
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在圖片格式之間轉換。',
        },
        {
          label: '裁切圖片',
          to: '/tools/crop-image',
          description: '裁切到指定區域。',
        },
        {
          label: '圖片尺寸調整',
          to: '/tools/image-resizer',
          description: '變更尺寸。',
        },
        {
          label: '為圖片加入文字',
          to: '/tools/add-text-to-image',
          description: '加上說明文字或浮水印。',
        },
        {
          label: '圖片濾鏡與特效',
          to: '/tools/image-filters',
          description: '復古褐色、素描、浮雕等效果。',
        },
        {
          label: '移除圖片中的 EXIF 中繼資料',
          to: '/tools/remove-exif-metadata',
          description: '清除位置與裝置資料。',
        },
      ],
      embed: {
        title: '將圖片轉換為黑白',
        description: '上傳圖片。濾鏡已預設為灰階；若想要較溫暖的色調，可切換為復古褐色或復古。按下「轉換」。',
      },
    },
    'image-filters': {
      name: '圖片濾鏡與特效',
      h1: '線上為圖片套用濾鏡與特效',
      tagline: '油畫、素描、炭筆、浮雕、復古、漩渦、模糊、銳利化等效果，一鍵套用到任何相片。',
      metaTitle: '免費線上圖片濾鏡：素描、油畫、浮雕 | Media Manipulator',
      metaDescription: '免費線上相片濾鏡。為 JPG、PNG、WebP 等格式套用油畫、鉛筆素描、炭筆、浮雕、復古、復古褐色、漩渦、模糊或銳利化效果，然後下載。無需註冊。',
      ogTitle: '線上為圖片套用濾鏡與特效',
      ogDescription: '素描、油畫、浮雕、復古等效果。免費，無需註冊。',
      intro: '有時候，一張相片想變成別的樣子：邀請卡上的素描、用來印刷的油畫、浮雕效果的標誌、漩渦狀的抽象圖。Media Manipulator 在我們的伺服器上套用 ImageMagick 的藝術與修正濾鏡，從鉛筆素描到銳利化一應俱全，並以任何圖片格式匯出，還可在同一次處理中一併裁切、調整尺寸並加上說明文字。',
      whatItDoes: [
        '藝術效果：油畫、素描、炭筆、浮雕、復古、復古褐色、漩渦、桶狀變形。',
        '修正效果：模糊、銳利化、灰階。',
        '同一個選單中也提供 45、90、180 和 270 度旋轉。',
        '可與裁切、調整尺寸、文字疊加和格式轉換搭配使用。',
      ],
      flowSteps: [
        {
          title: '上傳圖片',
          description: '任何常見格式皆可。',
        },
        {
          title: '選擇濾鏡',
          description: '預設已選取油畫。',
        },
        {
          title: '轉換',
          description: 'ImageMagick 算繪效果。',
        },
        {
          title: '下載',
          description: '儲存結果。',
        },
      ],
      advancedDetails: [
        '油畫與炭筆以半徑為基礎，效果會隨圖片尺寸縮放；將圖片調整為 1500 到 2500 px 可獲得最強烈的效果。',
        '素描與浮雕最適合邊緣清晰、對比良好的圖片。',
        '效果會直接寫入像素；請保留原圖。',
      ],
      whyItMatters: [
        '風格化的圖片在滿是相片的動態消息中格外醒目。',
        '素描與繪畫風格常用於卡片、海報和印刷品。',
        '銳利化與模糊是日常的修正手段。',
      ],
      useCases: [
        {
          title: '鉛筆肖像',
          description: '為相片套用素描濾鏡，做成卡片。',
        },
        {
          title: '繪畫風格印刷',
          description: '用油畫效果製作畫布印刷。',
        },
        {
          title: '浮雕標誌',
          description: '為平面標誌加上浮雕效果。',
        },
        {
          title: '銳利化掃描檔',
          description: '讓略顯模糊的掃描檔邊緣更清晰。',
        },
      ],
      whyMediaManipulator: [
        '十二種藝術與修正濾鏡，集中在一個選單中。',
        '在同一次上傳中裁切、調整尺寸、加上說明文字並轉換格式。',
      ],
      privacyNote: '你選擇的濾鏡由我們伺服器上的 ImageMagick 套用到你的圖片。不會傳送任何內容給外部服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。原始檔案絕不會被變更：你下載的是一個新檔案。',
      faq: [
        {
          question: '可以調整強度嗎？',
          answer: '濾鏡使用固定且經過調校的強度。將圖片放大或縮小，即可改變以半徑為基礎的效果看起來的強弱。',
        },
        {
          question: '可以疊加多個濾鏡嗎？',
          answer: '每次處理只能套用一個濾鏡；若要再套用一個，請將結果再次送入此工具。',
        },
        {
          question: '有 AI 風格轉換嗎？',
          answer: '沒有。這些都是經典的 ImageMagick 效果，能立即完成。',
        },
        {
          question: '哪種濾鏡適合標誌？',
          answer: '對高對比的標誌使用浮雕或炭筆。',
        },
      ],
      related: [
        {
          label: '黑白',
          to: '/tools/grayscale-image',
          description: '灰階與復古褐色。',
        },
        {
          label: '模糊圖片',
          to: '/tools/blur-image',
          description: '柔化或遮蔽。',
        },
        {
          label: '銳利化圖片',
          to: '/tools/sharpen-image',
          description: '突顯細節。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在圖片格式之間轉換。',
        },
        {
          label: '裁切圖片',
          to: '/tools/crop-image',
          description: '裁切出特定區域。',
        },
        {
          label: '調整圖片尺寸',
          to: '/tools/image-resizer',
          description: '變更尺寸。',
        },
        {
          label: '為圖片加入文字',
          to: '/tools/add-text-to-image',
          description: '說明文字或浮水印。',
        },
        {
          label: '移除 EXIF 中繼資料',
          to: '/tools/remove-exif-metadata',
          description: '清除位置與裝置資料。',
        },
      ],
      embed: {
        title: '為圖片套用濾鏡',
        description: '上傳圖片並選擇濾鏡；預設已選取油畫。另外也提供素描、炭筆、浮雕、復古、復古褐色、漩渦、桶狀變形、模糊和銳利化。按下「轉換」。',
      },
    },
    'rotate-image': {
      name: '旋轉圖片',
      h1: '免費線上旋轉圖片',
      tagline: '將相片旋轉 90°、180° 或 270°，修正橫放的掃描檔或手機照片，並以任何格式下載。',
      metaTitle: '免費線上旋轉圖片（90°、180°、270°） | Media Manipulator',
      metaDescription: '免費線上圖片旋轉工具。將 JPG、PNG、WebP 或 HEIC 相片旋轉 90、180 或 270 度，或旋轉 45 度做出傾斜效果，然後下載。旋轉會直接寫入像素。無需註冊。',
      ogTitle: '免費線上旋轉圖片',
      ogDescription: '一鍵修正橫躺的相片。免費，無需註冊。',
      intro: '手機會把方向記錄成一個標籤，但有些檢視器會忽略它，而掃描器和舊相機更是乾脆記錯。旋轉像素本身才能一勞永逸地解決問題。Media Manipulator 在我們的伺服器上使用 ImageMagick 將圖片旋轉 90、180、270 或 45 度，會先套用既有的方向標籤，並以任何格式匯出。',
      whatItDoes: [
        '旋轉 90°（順時針）、180°、270°（逆時針）或 45°。',
        '將旋轉寫入像素，並清除 EXIF 方向標籤。',
        '可與裁切、調整尺寸和格式轉換搭配使用。',
        '將轉正的圖片輸出為 JPG、PNG、WebP、AVIF 或 GIF。',
      ],
      flowSteps: [
        {
          title: '上傳圖片',
          description: '任何常見格式皆可。',
        },
        {
          title: '選擇角度',
          description: '預設已選取 90°。',
        },
        {
          title: '轉換',
          description: 'ImageMagick 旋轉並編碼。',
        },
        {
          title: '下載',
          description: '儲存轉正的圖片。',
        },
      ],
      advancedDetails: [
        '會先套用既有的 EXIF 方向，因此你看到的畫面就是被旋轉的畫面。',
        '旋轉 45° 會在角落加上背景填色；如有需要，之後再裁切。',
        '若要水平或垂直鏡像，請改用翻轉與鏡像工具。',
      ],
      whyItMatters: [
        '橫躺的相片是論壇和表單上最常見的上傳問題。',
        '有些應用程式會忽略方向標籤，因此將旋轉寫入像素是唯一可靠的修正方法。',
        '掃描檔和舊相機的檔案通常根本沒有這個標籤。',
      ],
      useCases: [
        {
          title: '橫躺的手機相片',
          description: '旋轉 90°，讓它在任何地方都是正的。',
        },
        {
          title: '上下顛倒的掃描檔',
          description: '旋轉 180°。',
        },
        {
          title: '修正表單上傳',
          description: '在提交文件相片之前先旋轉。',
        },
        {
          title: '傾斜效果',
          description: '旋轉 45°，做為設計元素。',
        },
      ],
      whyMediaManipulator: [
        '旋轉直接套用到像素上，並正確處理方向標籤。',
        '在同一次上傳中裁切、調整尺寸並轉換格式。',
      ],
      privacyNote: '你的圖片由我們伺服器上的 ImageMagick 依你選擇的角度旋轉。不會傳送任何內容給外部服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。原始檔案絕不會被變更：你下載的是一個新檔案。',
      faq: [
        {
          question: '為什麼我的相片在手機上是正的，在其他地方卻是橫的？',
          answer: '你的手機寫入了一個方向標籤，但其他應用程式忽略了它。在這裡旋轉，會將方向寫入像素。',
        },
        {
          question: '旋轉會降低畫質嗎？',
          answer: '以 90° 的倍數旋轉，在幾何上是無損的；唯一的代價是重新編碼。請使用 PNG 或高 JPG 畫質。',
        },
        {
          question: '可以旋轉任意角度嗎？',
          answer: '只提供 45° 以及 90° 的倍數。',
        },
        {
          question: '可以改成鏡像嗎？',
          answer: '這裡不行；目前不提供圖片鏡像。',
        },
      ],
      related: [
        {
          label: '旋轉影片',
          to: '/tools/rotate-video',
          description: '影片版的同類工具。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在圖片格式之間轉換。',
        },
        {
          label: '裁切圖片',
          to: '/tools/crop-image',
          description: '裁切出特定區域。',
        },
        {
          label: '調整圖片尺寸',
          to: '/tools/image-resizer',
          description: '變更尺寸。',
        },
        {
          label: '為圖片加入文字',
          to: '/tools/add-text-to-image',
          description: '說明文字或浮水印。',
        },
        {
          label: '圖片濾鏡',
          to: '/tools/image-filters',
          description: '復古褐色、素描、浮雕等效果。',
        },
        {
          label: '移除 EXIF 中繼資料',
          to: '/tools/remove-exif-metadata',
          description: '清除位置與裝置資料。',
        },
      ],
      embed: {
        title: '旋轉圖片',
        description: '上傳圖片。濾鏡選單預設為旋轉 90°；也可以改選 180°、270° 或 45°。旋轉會套用到像素上，因此每個檢視器顯示的方向都一致。按下「轉換」。',
      },
    },
    'sharpen-image': {
      name: '銳利化圖片',
      h1: '免費線上銳利化圖片',
      tagline: '一鍵銳利化，讓略微模糊的相片或掃描檔邊緣更清晰，並以任何格式下載。',
      metaTitle: '免費線上銳利化圖片 | Media Manipulator',
      metaDescription: '免費線上圖片銳利化工具。讓略顯模糊的 JPG、PNG、WebP 或 HEIC 相片或掃描檔變得更清晰，然後下載。若要真正還原細節，請試試 AI 圖片修復。無需註冊。',
      ogTitle: '免費線上銳利化圖片',
      ogDescription: '一鍵讓略顯模糊的相片更清晰。免費，無需註冊。',
      intro: '因鏡頭較慢、調整尺寸或掃描器而略顯模糊的相片，只要經過一次提高邊緣對比的銳利化處理，就會清晰許多。Media Manipulator 在我們的伺服器上使用 ImageMagick 套用遮色片銳利化，並以任何格式匯出。若模糊程度不只是略顯柔和，AI 圖片修復工具能還原銳利化無法找回的細節。',
      whatItDoes: [
        '對任何圖片套用經過調校的遮色片銳利化。',
        '可與調整尺寸搭配：縮小後再銳利化，得到清晰的縮圖。',
        '將銳利化後的結果下載為 JPG、PNG、WebP、AVIF 或 GIF。',
        '並排比較原圖與結果。',
      ],
      flowSteps: [
        {
          title: '上傳圖片',
          description: '任何常見格式皆可。',
        },
        {
          title: '保持選取銳利化',
          description: '如有需要，可再加上調整尺寸。',
        },
        {
          title: '轉換',
          description: 'ImageMagick 套用遮色片銳利化。',
        },
        {
          title: '下載',
          description: '儲存更清晰的圖片。',
        },
      ],
      advancedDetails: [
        '銳利化會提高邊緣的局部對比，但不會增加細節。過度銳利化會出現光暈。',
        '先縮小再銳利化，是製作清晰網頁圖片的經典做法。',
        '若是動態模糊、失焦或低解析度的來源，請使用 AI 圖片修復。',
      ],
      whyItMatters: [
        '縮小後的圖片會失去邊緣對比，不經銳利化就會顯得模糊。',
        '文件與印刷品的掃描檔常常略顯模糊。',
        '清晰的圖片看起來品質更高。',
      ],
      useCases: [
        {
          title: '縮圖',
          description: '調整尺寸並銳利化，用於網頁。',
        },
        {
          title: '模糊的掃描檔',
          description: '讓掃描的印刷品更清晰。',
        },
        {
          title: '商品相片',
          description: '上架前加強邊緣輪廓。',
        },
        {
          title: '略微失焦',
          description: '找回些許視覺上的銳利度。',
        },
      ],
      whyMediaManipulator: [
        '經過調校的遮色片銳利化，可在同一次處理中調整尺寸。',
        '銳利化不夠時，還有 AI 修復可用。',
      ],
      privacyNote: '你的圖片由我們伺服器上的 ImageMagick 依你設定的強度銳利化。不會傳送任何內容給外部服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。原始檔案絕不會被變更：你下載的是一個新檔案。',
      faq: [
        {
          question: '能修正模糊的相片嗎？',
          answer: '它對輕微的模糊有幫助。若是真正的模糊，請使用 AI 圖片修復，它會重建細節。',
        },
        {
          question: '可以控制強度嗎？',
          answer: '強度是固定且經過調校的；若要更強，可以執行兩次，或使用較小的輸出尺寸，讓相對效果更強。',
        },
        {
          question: '會增加雜訊嗎？',
          answer: '銳利化可能會突顯原有的顆粒。請使用高 JPG 畫質，以免雜訊進一步累積。',
        },
      ],
      related: [
        {
          label: 'AI 圖片修復',
          to: '/tools/ai-image-restoration',
          description: '用 AI 還原真正的細節。',
        },
        {
          label: 'AI 圖片放大器',
          to: '/tools/ai-image-upscaler',
          description: '放大而不模糊。',
        },
        {
          label: '模糊圖片',
          to: '/tools/blur-image',
          description: '相反的效果。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在圖片格式之間轉換。',
        },
        {
          label: '裁切圖片',
          to: '/tools/crop-image',
          description: '裁切出特定區域。',
        },
        {
          label: '調整圖片尺寸',
          to: '/tools/image-resizer',
          description: '變更尺寸。',
        },
        {
          label: '為圖片加入文字',
          to: '/tools/add-text-to-image',
          description: '說明文字或浮水印。',
        },
        {
          label: '圖片濾鏡',
          to: '/tools/image-filters',
          description: '復古褐色、素描、浮雕等效果。',
        },
        {
          label: '移除 EXIF 中繼資料',
          to: '/tools/remove-exif-metadata',
          description: '清除位置與裝置資料。',
        },
      ],
      embed: {
        title: '銳利化圖片',
        description: '上傳圖片。濾鏡預設為銳利化。按下「轉換」，然後在檢視器中將結果與原圖比較。',
      },
    },
    'blur-image': {
      name: '模糊圖片',
      h1: '免費線上模糊圖片',
      tagline: '將整張相片柔化，用作背景、預留圖或隱私遮蔽，並以任何格式下載。',
      metaTitle: '免費線上模糊圖片 | Media Manipulator',
      metaDescription: '免費線上圖片模糊工具。柔化整張 JPG、PNG、WebP 或 HEIC 相片，用作背景、預留圖或隱私遮蔽。若只想模糊人臉，請使用人臉模糊工具。無需註冊。',
      ogTitle: '免費線上模糊圖片',
      ogDescription: '一鍵柔化相片。免費，無需註冊。',
      intro: '模糊的相片可以成為文字後方沉穩的背景、真正圖片載入前的低細節預留圖，或螢幕截圖的隱私遮蔽。Media Manipulator 在我們的伺服器上使用 ImageMagick 對整張圖片套用高斯模糊，並以任何格式匯出。若只想模糊人臉或車牌，AI 人臉模糊與文字遮蓋工具可以鎖定這些區域。',
      whatItDoes: [
        '對整張圖片套用高斯模糊。',
        '可與調整尺寸搭配，製作極小的模糊預留圖。',
        '柔化後的圖片會以 JPG、PNG、WebP、AVIF 或 GIF 回傳。',
        '相關工具可以選擇性地模糊人臉或遮蓋文字。',
      ],
      flowSteps: [
        {
          title: '上傳圖片',
          description: '任何常見格式皆可。',
        },
        {
          title: '保持選取模糊',
          description: '可選擇是否調整尺寸。',
        },
        {
          title: '轉換',
          description: 'ImageMagick 模糊並編碼。',
        },
        {
          title: '下載',
          description: '儲存柔化後的圖片。',
        },
      ],
      advancedDetails: [
        '模糊半徑是固定的；若要更強的效果，請先縮小、再模糊，然後放大。',
        '模糊的圖片可以壓縮得非常小，這正是它們適合當預留圖的原因。',
        '模糊的螢幕截圖並不等於遮蓋：文字有時可以被還原。敏感內容請使用文字遮蓋。',
      ],
      whyItMatters: [
        '模糊的背景能讓疊加的文字保持易讀。',
        '低畫質的預留圖能提升頁面的體感速度。',
        '相片的柔和版本是常見的設計元素。',
      ],
      useCases: [
        {
          title: '文字背景',
          description: '將相片模糊，用來放置標題。',
        },
        {
          title: '預留圖',
          description: '用於延遲載入的極小模糊預覽。',
        },
        {
          title: '隱私遮蔽',
          description: '分享前先柔化螢幕截圖，再進行確實的遮蓋。',
        },
        {
          title: '夢幻效果',
          description: '為設計加上柔和的疊加層。',
        },
      ],
      whyMediaManipulator: [
        '這裡是整張圖片的模糊；人臉模糊與文字遮蓋則是專門的 AI 工具。',
        '在同一次上傳中調整尺寸並轉換格式。',
      ],
      privacyNote: '你的圖片由我們伺服器上的 ImageMagick 依你設定的半徑模糊。不會傳送任何內容給外部服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。原始檔案絕不會被變更：你下載的是一個新檔案。',
      faq: [
        {
          question: '可以只模糊圖片的一部分嗎？',
          answer: '人臉請使用「模糊相片中的人臉」，文字與車牌請使用「遮蓋圖片中的文字」。',
        },
        {
          question: '模糊足以隱藏文字嗎？',
          answer: '並不可靠。請使用遮蓋工具，它會將該區域塗蓋掉。',
        },
        {
          question: '可以控制模糊程度嗎？',
          answer: '半徑是固定的；模糊前先縮小圖片，效果會更強。',
        },
      ],
      related: [
        {
          label: '模糊相片中的人臉',
          to: '/tools/blur-faces-in-photo',
          description: 'AI 人臉模糊。',
        },
        {
          label: '遮蓋圖片中的文字',
          to: '/tools/redact-text-in-image',
          description: '隱藏文字與車牌。',
        },
        {
          label: '銳利化圖片',
          to: '/tools/sharpen-image',
          description: '相反的效果。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在圖片格式之間轉換。',
        },
        {
          label: '裁切圖片',
          to: '/tools/crop-image',
          description: '裁切出特定區域。',
        },
        {
          label: '調整圖片尺寸',
          to: '/tools/image-resizer',
          description: '變更尺寸。',
        },
        {
          label: '為圖片加入文字',
          to: '/tools/add-text-to-image',
          description: '說明文字或浮水印。',
        },
        {
          label: '圖片濾鏡',
          to: '/tools/image-filters',
          description: '復古褐色、素描、浮雕等效果。',
        },
        {
          label: '移除 EXIF 中繼資料',
          to: '/tools/remove-exif-metadata',
          description: '清除位置與裝置資料。',
        },
      ],
      embed: {
        title: '模糊圖片',
        description: '上傳圖片。濾鏡預設為模糊，會柔化整張圖片。若只想模糊人臉，請使用「模糊相片中的人臉」工具。按下「轉換」。',
      },
    },
    'generate-vtt-captions': {
      name: 'VTT 字幕產生器',
      h1: '從影片或音訊產生 WebVTT 字幕',
      tagline: '在我們自己的 GPU 伺服器上，透過 AI 轉錄為 HTML5 影片、YouTube 或播放器建立 .vtt 字幕檔。',
      metaTitle: '線上 VTT 字幕產生器（免費 AI） | Media Manipulator',
      metaDescription: '免費線上 WebVTT 字幕產生器。上傳影片或音訊檔案，即可下載附時間點字幕的 .vtt 檔，可用於 HTML5 影片、YouTube、Vimeo 或任何播放器。執行在我們自己的 GPU 上。',
      ogTitle: '線上產生 WebVTT 字幕',
      ogDescription: '為任何影片產生由 AI 標定時間點的 .vtt 字幕。免費，無需註冊。',
      intro: 'WebVTT 是網頁的字幕格式：HTML5 的 track 元素、YouTube、Vimeo、HLS 與 DASH 播放器都能讀取。Media Manipulator 在我們營運的 GPU 伺服器上使用 Whisper 模型，從任何影片或音訊產生附時間點的 VTT 字幕，因此你的媒體絕不會傳送給第三方 AI；結果會在字幕檢視器中開啟，讓你在下載前檢查時間點。',
      whatItDoes: [
        '轉錄語音，並將其切分為附時間點的字幕段落。',
        '輸出符合標準的 .vtt 檔案。',
        '自動偵測語言。',
        '執行在我們自己的 GPU 上；不使用第三方 AI 供應商。',
      ],
      flowSteps: [
        {
          title: '上傳影片或音訊',
          description: '任何常見格式皆可。',
        },
        {
          title: '保持選取 VTT',
          description: '或改選 SRT、文字或 JSON。',
        },
        {
          title: '轉錄',
          description: 'Whisper 為每段字幕標上時間點。',
        },
        {
          title: '下載',
          description: '將 .vtt 掛到你的播放器上。',
        },
      ],
      advancedDetails: [
        '字幕段落依照 Whisper 的切分方式，通常每段是一個句子或子句，長度為 2 到 7 秒。',
        '可使用字幕翻譯器將結果翻譯成其他語言。',
        '若需要燒錄進畫面的字幕，請使用 Darkroom 的字幕軌。',
      ],
      whyItMatters: [
        '字幕是無障礙的必要條件，而且大多數觀眾都在靜音狀態下觀看。',
        'VTT 是 HTML5 影片唯一原生支援的格式。',
        '附時間點的字幕可以被搜尋引擎索引。',
      ],
      useCases: [
        {
          title: 'HTML5 影片',
          description: '用 track 元素掛上檔案。',
        },
        {
          title: '上傳到 YouTube',
          description: '將 .vtt 上傳為字幕軌。',
        },
        {
          title: '課程影片',
          description: '為 LMS 播放器提供字幕。',
        },
        {
          title: '之後再翻譯',
          description: '輸入 VTT，輸出翻譯後的 VTT。',
        },
      ],
      whyMediaManipulator: [
        'Whisper 執行在我們自己的硬體上；不會傳送任何內容給第三方 AI。',
        '提供字幕檢視器，可在下載前檢查時間點。',
      ],
      privacyNote: '你的檔案中的語音由我們自己 GPU 伺服器上的 Whisper 轉錄，並標上時間點製成 WebVTT 字幕。AI 工作在我們營運的硬體上執行，絕不使用第三方 AI 供應商，你上傳的任何內容都不會被用來訓練模型。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。',
      faq: [
        {
          question: 'VTT 還是 SRT？',
          answer: '網頁播放器與 YouTube 用 VTT；影片剪輯軟體和部分較舊的平台用 SRT。兩者都有提供。',
        },
        {
          question: '可以編輯字幕嗎？',
          answer: '下載 .vtt 後，用任何文字編輯器編輯即可；這種格式是純文字。',
        },
        {
          question: '可以翻譯字幕嗎？',
          answer: '可以，使用字幕翻譯器工具即可。',
        },
        {
          question: '我的影片會被傳送給第三方嗎？',
          answer: '不會。轉錄在我們自己的 GPU 伺服器上執行。',
        },
        {
          question: '這會占用我的額度嗎？',
          answer: '每個 VTT 檔案計為一次 AI 工作，從 AI 工作額度中扣除，絕不會占用一般工作額度。失敗的工作不會計入。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '每個字幕檔計為一次 AI 工作；失敗的工作不會計入。',
        ],
      },
      related: [
        {
          label: 'SRT 字幕產生器',
          to: '/tools/srt-generator',
          description: 'SubRip 格式。',
        },
        {
          label: '影片轉錄',
          to: '/tools/transcribe-video',
          description: '純文字或 JSON。',
        },
        {
          label: '字幕翻譯器',
          to: '/tools/caption-translator',
          description: '翻譯字幕。',
        },
        {
          label: 'Darkroom 影片編輯器',
          to: '/tools/content-studio',
          description: '將字幕燒錄進畫面。',
        },
      ],
      embed: {
        title: '產生 VTT 字幕',
        description: '上傳影片或音訊檔案。輸出預設為 WebVTT；逐字稿由我們 GPU 伺服器上的 Whisper 標上時間點，並以 .vtt 檔案回傳，你可以用 track 元素掛上，或上傳到平台。',
      },
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
        '語音使用 Whisper 轉錄；影格在場景切換處挑選，數量不超過你方案的影格上限（Free 24 個、Premium 48 個、Pro 96 個），並由視覺模型分批描述。',
        '語言模型根據逐字稿與影格筆記撰寫摘要。Pro 帳號可在有提供時，要求由更大的模型產生更深入的摘要。',
        '每份摘要計為每日額度中的一次 AI 工作；失敗或被拒絕的工作不會計入。',
        '逐字稿由機器產生，因此人名與數字可能有誤。摘要會在備註中說明這一點。',
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
          answer: '可以。從本站的 18 種語言中任選一種，或選擇「與語音相同」，以影片中所說的語言撰寫。',
        },
        {
          question: '如果影片沒有語音怎麼辦？',
          answer: '摘要會僅根據畫面撰寫，並在備註中說明。既沒有畫面也沒有聲音的檔案會被拒絕，且不會計入。',
        },
        {
          question: '我的影片會被傳送給第三方嗎？',
          answer: '不會。所有模型都執行在我們營運的 GPU 伺服器上。',
        },
        {
          question: '這會計入我的額度嗎？',
          answer: '會，計為一次 AI 工作。失敗的工作不會計入。',
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
          '計為一次 AI 工作；失敗的工作不會計入。',
          '長度上限為你方案的影片長度限制。',
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
        '附有封面圖片的音訊檔案會視為音訊處理：圖片會被忽略。',
        '每份摘要計為每日額度中的一次 AI 工作；失敗或被拒絕的工作不會計入。',
        '逐字稿由機器產生，因此人名與數字可能有誤。摘要會在備註中說明這一點。',
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
          answer: '可以。從本站的 18 種語言中任選一種，或選擇「與語音相同」。',
        },
        {
          question: '我的錄音會被傳送給第三方嗎？',
          answer: '不會。模型都執行在我們營運的 GPU 伺服器上。',
        },
        {
          question: '這會計入我的額度嗎？',
          answer: '會，計為一次 AI 工作。失敗的工作不會計入。',
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
          '計為一次 AI 工作；失敗的工作不會計入。',
        ],
      },
    },
    // MM78 voices: name + tagline (model-written, needs native review).
    'voice-cloning': {
      name: '語音複製',
      h1: '用一段簡短的錄音複製你的聲音',
      tagline: '錄製或上傳 5 到 60 秒你自己的語音，建立一個語音，讓它以二十多種語言朗讀任何文字。',
      metaTitle: '用錄音複製你自己的聲音 | Media Manipulator',
      metaDescription: '用 5 到 60 秒你自己的語音建立一個語音，並用它以 20 多種語言將文字轉為語音。執行在我們自己的伺服器上；輸出帶有浮水印。',
      ogTitle: '用一段簡短的錄音複製你自己的聲音',
      ogDescription: '唸幾句話，確認這是你的聲音，就能用它以 20 多種語言產生語音。自行託管的模型，輸出帶有浮水印。',
      intro: '語音複製會用一段你自己的簡短錄音，製作出可重複使用的語音。對著麥克風自然地唸幾句話，或上傳一段 5 到 60 秒的片段，確認這是你的聲音（或你已取得說話者的明確許可），然後建立語音。它會出現在「我的語音」中，並附有簡短的預覽。之後，你可以輸入任何文字，從二十多種語言中選擇一種並設定情緒程度，就能取得以該語音朗讀的 MP3 與 WAV。模型執行在我們營運的 GPU 伺服器上，每個產生的檔案都帶有聽不見的浮水印，你錄製的任何內容都不會被用來訓練任何東西。',
      whatItDoes: [
        '用 5 到 60 秒在瀏覽器中錄製或以音訊檔案上傳的語音，建立一個已儲存的語音。',
        '在計入任何額度之前，先檢查錄音是否夠長，且確實包含語音。',
        '以 20 多種語言用已儲存的語音朗讀任何文字，並可在平靜到富有表現力之間調整情緒。',
        '以 MP3 回傳語音，並在你的瀏覽器中製作 WAV 下載檔。',
        '為每個產生的檔案加上聽不見的浮水印，以便辨識合成語音。',
      ],
      flowSteps: [
        {
          title: '錄音或上傳',
          description: '在安靜的房間裡錄製 5 到 60 秒清晰的語音。',
        },
        {
          title: '確認同意',
          description: '勾選表示這是你的聲音，或你已取得說話者的許可。',
        },
        {
          title: '建立語音',
          description: '系統會產生簡短的預覽，並將語音儲存到你的帳號。',
        },
        {
          title: '產生語音',
          description: '輸入文字，選擇語言與情緒，然後下載音訊。',
        },
      ],
      advancedDetails: [
        '語音引擎是 Chatterbox Multilingual（MIT 授權），執行在我們自己的 GPU 伺服器上。它會在你產生語音的當下，根據參考片段進行複製；不會用你的聲音訓練任何模型。',
        '建立語音計為一次 AI 工作（即預覽）。每次產生計為一次 AI 工作。失敗或被拒絕的請求不會計入。',
        '每次請求的文字長度取決於你的方案，大約是每秒語音 18 個字元；文字方塊下方的計數器會顯示你的上限。',
        '每個產生的檔案都帶有 Resemble AI 的 PerTh 浮水印，它聽不見，而且在常見的編輯與壓縮後仍會保留。',
        '閒置一段時間後的第一次請求，可能需要最多 20 秒讓引擎載入。',
      ],
      whyItMatters: [
        '用你自己的聲音旁白，不必每次修改腳本都預約錄音室。',
        '用同一個聲音說另一種語言，讓影片或課程觸及更多人。',
        '自行託管的引擎代表你的錄音留在我們這裡，而不會交給第三方 AI 供應商。',
      ],
      useCases: [
        {
          title: '影片旁白',
          description: '重新唸出腳本中修改過的一句話，不必重新錄音。',
        },
        {
          title: '課程與教學',
          description: '用多種語言為同一堂課配音。',
        },
        {
          title: '無障礙',
          description: '讓熟悉的聲音朗讀長篇文字。',
        },
        {
          title: '原型製作',
          description: '在錄製最終版本之前，先聽聽腳本唸出來的效果。',
        },
      ],
      whyMediaManipulator: [
        '開放模型執行在我們營運的硬體上；錄音絕不會傳送給外部 AI 服務。',
        '建立任何語音之前都需要明確同意，並將同意記錄與語音一起保存。',
        '輸出帶有浮水印，而且每個已儲存的語音都有你專屬的刪除按鈕。',
      ],
      privacyNote: '你錄製或上傳的 5 到 60 秒語音，會成為你帳號中的已儲存語音；每次該語音說話時，模型讀取的都是這段參考錄音。語音錄音與已儲存的語音都在我們自己的伺服器上處理；不會傳送任何內容給第三方 AI 供應商，也不會用於訓練任何模型。已儲存的語音（其參考錄音與預覽）儲存在你的帳號中，遵循你選擇的保留期限，並可隨時在帳號的「語音」中刪除；刪除帳號時也會一併刪除。產生的音訊與其他結果一樣保留：訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。',
      faq: [
        {
          question: '可以複製別人的聲音嗎？',
          answer: '只有在取得對方明確許可的情況下才可以。建立語音之前，你必須確認這是你的聲音或你已取得許可，我們會將該確認與語音一起保存。我們的服務條款禁止未經許可冒充他人、詐欺與政治深偽。',
        },
        {
          question: '聽起來會跟我一模一樣嗎？',
          answer: '通常聽得出是說話者本人，但並非完美的複製：口音、特殊的嗓音與嘈雜的錄音會比較困難。在安靜的房間裡自然地唸幾句話，效果最好。',
        },
        {
          question: '我的錄音會被用來訓練 AI 模型嗎？',
          answer: '不會。你上傳或產生的任何內容都不會被用來訓練任何模型。每次你產生語音時，都是根據你的參考片段複製聲音。',
        },
        {
          question: '別人聽得出音訊是產生的嗎？',
          answer: '每個用已儲存語音產生的檔案，都帶有偵測工具可讀取的聽不見浮水印。它不會改變音訊的聲音。',
        },
        {
          question: '如何刪除語音？',
          answer: '開啟帳號的「語音」並將其刪除。它的參考錄音與預覽會被移除；你已產生的音訊會保留在你的記錄中，直到其自身的保留期限結束。',
        },
        {
          question: '我可以保留多少個語音？',
          answer: '取決於你的方案；頁面會顯示你已儲存的數量與上限。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '參考錄音的長度必須為 5 到 60 秒，且包含語音。',
          '儲存語音需要帳號；預設語音不需要帳號即可使用。',
        ],
      },
      related: [
        {
          label: '語音設計器',
          to: '/tools/voice-designer',
          description: '描述一個新語音並保留它。',
        },
        {
          label: '變聲器',
          to: '/tools/voice-changer',
          description: '調整錄音的聲音，或將其轉換為某個語音。',
        },
        {
          label: '人聲音訊降噪',
          to: '/tools/clean-voice-audio',
          description: '使用錄音前先將其清理乾淨。',
        },
        {
          label: '變更音訊音高',
          to: '/tools/change-audio-pitch',
          description: '調整音樂或語音的調性。',
        },
      ],
      embed: {
        title: '建立語音',
        description: '錄製或上傳一段 5 到 60 秒的乾淨錄音，確認這是你的聲音或你已取得說話者的許可，然後建立語音。接著輸入文字並產生語音。預設語音不需要帳號即可使用。',
      },
    },
    'voice-designer': {
      name: '語音設計器',
      h1: '根據描述設計全新語音',
      tagline: '用文字描述一個語音，試聽預覽，並保留你喜歡的那個，讓它以二十多種語言朗讀任何文字。',
      metaTitle: '用文字描述設計全新語音 | Media Manipulator',
      metaDescription: '描述你想要的語音，例如溫暖、低沉而平靜，免費試聽預覽，保留它，再用它產生語音。自行託管的模型；輸出帶有浮水印。',
      ogTitle: '根據描述設計全新語音',
      ogDescription: '描述一個語音，免費試聽預覽，保留你喜歡的那個並用它產生語音。自行託管，附浮水印。',
      intro: '語音設計器會建立一個不屬於任何人的語音。用幾個詞描述它，例如性別、年齡、口音、音色和語速，或用標籤組合出描述，然後試聽一句範例句子的預覽。預覽免費，每個描述每小時可預覽三次。聽到想要的語音時，為它取個名字並保留：你預覽的那個語音會原封不動地儲存到你的帳號，之後就能以語音工具支援的任何語言朗讀任何文字。設計在 Qwen3-TTS 上執行，朗讀則在 Chatterbox 上執行，兩者都位於我們自己的 GPU 伺服器上，而且每個產生的檔案都帶有聽不見的浮水印。',
      whatItDoes: [
        '將語音的文字描述變成可試聽的語音預覽。',
        '儲存時會保留你預覽的那個語音（相同的種子）。',
        '以保留的語音用 20 多種語言朗讀任何文字。',
        '傳回語音的 MP3，並提供在你的瀏覽器中產生的 WAV 下載。',
      ],
      flowSteps: [
        {
          title: '描述',
          description: '寫下或點選你想要的特徵。',
        },
        {
          title: '預覽',
          description: '每個描述每小時可免費預覽三次。',
        },
        {
          title: '保留',
          description: '為語音命名並儲存到你的帳號。',
        },
        {
          title: '產生語音',
          description: '輸入任何文字並下載音訊。',
        },
      ],
      advancedDetails: [
        '設計使用 Qwen3-TTS VoiceDesign（Apache 2.0）。預覽句子可用十種語言呈現：中文、英文、日文、韓文、德文、法文、俄文、葡萄牙文、西班牙文和義大利文。',
        '保留的語音會以其描述、種子和一段 10 秒的參考片段儲存；此後由 Chatterbox 朗讀，因此無論在哪裡、使用哪種支援的語言，聽起來都一樣。',
        '預覽不計入額度。保留一個語音計為一次 AI 工作，每次產生也各計為一次 AI 工作。',
        '描述以英文撰寫效果最好；標籤加入的是英文特徵。',
      ],
      whyItMatters: [
        '不必為草稿聘請配音員，就能擁有獨特的旁白或角色語音。',
        '不涉及任何真人的聲音，因此不會借用任何人的聲音特徵。',
        '保留的語音在每份腳本、每種語言中都保持一致。',
      ],
      useCases: [
        {
          title: '角色',
          description: '為故事或遊戲原型中的每個角色賦予專屬的語音。',
        },
        {
          title: '解說影片',
          description: '為產品與教育訓練影片提供平靜、清晰的旁白。',
        },
        {
          title: '暫用音訊',
          description: '腳本仍在修改時使用的臨時旁白。',
        },
        {
          title: '無障礙',
          description: '適合朗讀長篇文件的悅耳語音。',
        },
      ],
      whyMediaManipulator: [
        '開放模型執行在我們自己的 GPU 伺服器上；不使用第三方 AI 供應商。',
        '在計入任何額度之前，可以先免費預覽。',
        '輸出帶有浮水印，每個保留的語音都有刪除按鈕。',
      ],
      privacyNote: '只有你寫的文字描述會傳送給語音模型；它產生的預覽是我們生成的音訊，而你保留的那個語音會依其種子儲存。語音錄音與已儲存的語音都在我們自己的伺服器上處理；不會將任何內容傳送給第三方 AI 供應商，也不會用於訓練任何模型。已儲存的語音（其參考錄音與預覽）儲存在你的帳號中，遵循你選擇的保留期限，並可隨時在帳號的「語音」中刪除；刪除帳號時也會一併刪除。產生的音訊與其他結果一樣保留：訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。',
      faq: [
        {
          question: '設計出的語音是某個真人的聲音嗎？',
          answer: '不是。它是根據你的描述和一個隨機種子產生的，並非以任何特定人物為範本。',
        },
        {
          question: '為什麼預覽會用完？',
          answer: '每個描述每小時可預覽三次，讓免費預覽能持續供所有人使用。修改描述即可再次預覽，或直接保留你喜歡的語音。',
        },
        {
          question: '保留的語音聽起來會和預覽一樣嗎？',
          answer: '會。保留時會送出與你聽到的預覽相同的描述和種子，語音就是從那次產生的結果儲存下來的。',
        },
        {
          question: '它能說哪些語言？',
          answer: '語音會以十種語言之一設計，保留後就能說語音工具支援的所有語言，總共二十多種。',
        },
        {
          question: '輸出會標示為生成內容嗎？',
          answer: '會。每個產生的檔案都帶有聽不見的浮水印，偵測工具可以讀取。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '預覽：每個描述每小時 3 次，不計入額度。',
          '保留語音需要帳號。',
        ],
      },
      related: [
        {
          label: '語音複製',
          to: '/tools/voice-cloning',
          description: '用你自己的錄音建立語音。',
        },
        {
          label: '變聲器',
          to: '/tools/voice-changer',
          description: '為錄音變調，或將其轉換為某個語音。',
        },
        {
          label: '人聲音訊降噪',
          to: '/tools/clean-voice-audio',
          description: '使用前先清理錄音。',
        },
        {
          label: '變更音訊音高',
          to: '/tools/change-audio-pitch',
          description: '改變音樂或語音的調性。',
        },
      ],
      embed: {
        title: '描述一個語音',
        description: '寫下簡短描述或點選特徵標籤，試聽語音預覽（每個描述每小時可免費預覽三次），然後保留它以產生語音。保留語音需要帳號。',
      },
    },
    'voice-changer': {
      name: '變聲器',
      h1: '變更錄音中的聲音',
      tagline: '即時調整錄音的音高與特色，或使用 AI 將語音轉換為已儲存或預設的語音。',
      metaTitle: '變聲器：為錄音變調或轉換聲音 | Media Manipulator',
      metaDescription: '變更錄音中的聲音：即時調整音高與共振峰，或用 AI 將語音轉換為已儲存或預設的語音。可比較變更前後的差異。',
      ogTitle: '變更錄音中的聲音',
      ogDescription: '即時調整音高與共振峰，或用 AI 將語音轉換為另一個聲音，然後比較變更前後的差異。',
      intro: '變聲器提供兩種變更錄音的方式。「變調」是傳統的音高與共振峰調整：將音高向上或向下移動最多十二個半音，保留說話者的特色或讓它隨音高一起變化，也可以從「更低沉」、「更高」、「童聲」、「年長」或「電話」等預設開始。它即時完成、不需要帳號，也不使用 AI。「轉換」使用 AI 語音轉換，讓語音聽起來像你已儲存的某個語音或某個預設語音，同時保留字句、節奏與語調。無論哪種方式，下載前都可以用無縫切換的 A/B 播放器比較原始錄音與結果。',
      whatItDoes: [
        '將音高向上或向下調整最多 12 個半音，共振峰可保留或隨之變化。',
        '提供變調預設：更低沉、更高、童聲、年長和電話。',
        '透過 AI 語音轉換，將語音轉換為已儲存的語音或預設語音。',
        '以同步的 A/B 比較播放原始錄音與結果。',
        '傳回 MP3，並提供在你的瀏覽器中產生的 WAV 下載。',
      ],
      flowSteps: [
        {
          title: '錄音或上傳',
          description: '來自麥克風的語音，或音訊、影片檔案。',
        },
        {
          title: '選擇變調或轉換',
          description: '即時變更音高，或用 AI 轉換為另一個語音。',
        },
        {
          title: '比較',
          description: '在原始錄音與結果之間無縫切換。',
        },
        {
          title: '下載',
          description: 'MP3，或在你的瀏覽器中產生的 WAV。',
        },
      ],
      advancedDetails: [
        '「變調」透過我們伺服器上的 ffmpeg 使用 rubberband 音高位移器。「保留語音的特色」會保留共振峰；「隨音高一起變化」則會移動共振峰，聽起來像是體型較小或較大的說話者。「電話」還會套用 300 到 3400 Hz 的帶通濾波。',
        '「變調」計為一次操作，輸出不帶浮水印。「轉換」計為一次 AI 工作，輸出帶有聽不見的浮水印。',
        '「轉換」在我們自己的 GPU 伺服器上使用 Chatterbox 語音轉換。可轉換的錄音長度取決於你的方案。',
        '轉換需要帳號。轉換為他人的聲音需要取得對方的許可，與語音複製相同。',
      ],
      whyItMatters: [
        '只需簡單變調，就能為匿名訪談或注重隱私的片段隱藏聲音。',
        '修正以錯誤聲音錄製的片段，不必重新錄製。',
        '透過 A/B 播放器立即聽出差異，不必憑空猜測。',
      ],
      useCases: [
        {
          title: '匿名音訊',
          description: '改變聲音，讓說話者更難被認出。',
        },
        {
          title: '角色語音',
          description: '將你自己的朗讀變成另一個聲音，用於故事中。',
        },
        {
          title: '一致的旁白',
          description: '將來賓的台詞轉換為旁白者已儲存的語音。',
        },
        {
          title: '特效',
          description: '為影片場景加上電話或童聲效果。',
        },
      ],
      whyMediaManipulator: [
        '變調器免費，且不需要帳號。',
        'AI 轉換在我們自己的 GPU 伺服器上執行，而非第三方服務。',
        '內建原始錄音與結果的 A/B 比較。',
      ],
      privacyNote: '你上傳的錄音會依你選擇的模式，以 rubberband 變調，或由 AI 模型轉換為另一個語音。語音錄音與已儲存的語音都在我們自己的伺服器上處理；不會將任何內容傳送給第三方 AI 供應商，也不會用於訓練任何模型。已儲存的語音（其參考錄音與預覽）儲存在你的帳號中，遵循你選擇的保留期限，並可隨時在帳號的「語音」中刪除；刪除帳號時也會一併刪除。產生的音訊與其他結果一樣保留：訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。',
      faq: [
        {
          question: '「變調」和「轉換」有什麼不同？',
          answer: '「變調」以訊號處理改變同一個聲音的音高與特色，即時且免費。「轉換」則使用 AI 讓語音聽起來像另一個聲音，也就是你已儲存的某個語音或某個預設語音。',
        },
        {
          question: '變調會加上浮水印嗎？',
          answer: '不會。變調後的音訊只是一般的訊號處理，不帶浮水印。轉換後的音訊則帶有聽不見的浮水印。',
        },
        {
          question: '我可以把自己的聲音轉換成名人的聲音嗎？',
          answer: '不行。你只能轉換為自己已儲存的語音或我們的預設語音，而使用真人的聲音需要對方的明確許可。我們的服務條款禁止未經許可的冒充行為。',
        },
        {
          question: '錄音可以多長？',
          answer: '「變調」接受的錄音長度上限為你方案的長度限制。「轉換」在每個方案中有各自的限制，上傳時會顯示。',
        },
        {
          question: '可以使用影片檔案嗎？',
          answer: '可以。會使用其中的音軌，畫面則會捨棄。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '變調：計為一次操作，不需要帳號。',
          '轉換：計為一次 AI 工作，需要帳號與方案。',
        ],
      },
      related: [
        {
          label: '語音複製',
          to: '/tools/voice-cloning',
          description: '用你自己的錄音建立語音。',
        },
        {
          label: '語音設計器',
          to: '/tools/voice-designer',
          description: '描述一個新語音並保留它。',
        },
        {
          label: '人聲音訊降噪',
          to: '/tools/clean-voice-audio',
          description: '使用前先清理錄音。',
        },
        {
          label: '變更音訊音高',
          to: '/tools/change-audio-pitch',
          description: '改變音樂或語音的調性。',
        },
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: '先清理錄音。',
        },
      ],
      embed: {
        title: '變更聲音',
        description: '錄製或上傳語音。「變調」可即時變更音高與共振峰，所有人都能使用。「轉換」讓錄音聽起來像你已儲存的某個語音或某個預設語音，需要帳號以及包含此功能的方案。',
      },
    },
    // MM84: name / tagline / metaTitle / metaDescription for the copy-bar tool pages (model-written, needs native review).
    'content-studio': {
      name: 'Darkroom',
      h1: 'Darkroom',
      tagline: '在多軌時間軸上剪輯、疊加與混合影片和音訊，然後匯出 MP4。Premiere Pro 風格的編輯器，直接在瀏覽器中使用。',
      metaTitle: 'Darkroom：免費線上多軌影片編輯器 | Media Manipulator',
      metaDescription: '在多軌時間軸上剪輯、疊加與混合影片和音訊，然後匯出 MP4。一款在瀏覽器中執行的免費 Premiere Pro 風格影片編輯器，無需註冊，無需安裝。',
      ogTitle: '🎬 Darkroom：在瀏覽器中使用的免費多軌影片編輯器',
      ogDescription: '在多軌時間軸上剪輯、疊加與混合影片和音訊，加入標題、轉場與色彩，然後匯出 MP4。Premiere Pro 風格的編輯器，直接在瀏覽器中使用，無需註冊，完全免費。快來試試！🎬',
      intro: 'Darkroom 是在瀏覽器分頁中執行的多軌影片編輯器。你先建立一個設定好畫布與影格率的專案，把影片、圖片與音訊檔案拖進媒體庫，排列在堆疊的軌道上，在影格邊界進行修剪與分割，進行調色與去背，加入標題、轉場與字幕，用逐軌混音器混合音訊，然後把完成的時間軸交給我們的轉譯伺服器：ffmpeg 會將整段剪輯建構成單一濾鏡圖，編碼為 MP4 中的 H.264 或 HEVC；若專案只有音訊，則編碼為 MP3 或 WAV。你編輯時看到的預覽，是在你的 GPU 上以 WebGL2 即時合成的；匯出結果會與該預覽比對，確保所見即所得。',
      whatItDoes: [
        '執行精確到影格的多軌時間軸：修剪、分割、漣漪刪除、剃刀、滑移、滑動、捲動與漣漪編輯、標記、群組、軌道鎖定、獨奏與隱藏，以及將音訊從影片分離。',
        '依堆疊順序合成各軌道，支援裁切、適應、變形、Lumetri 風格調色（曝光、對比、飽和度、色溫、色調、自然飽和度）、3D LUT、附滴管的色度去背、不透明度與八種混合模式。',
        '以關鍵影格與五種緩動曲線，為位置、縮放、旋轉、不透明度、音量、聲道平衡與效果參數製作動畫；並提供十五種轉場，以及由文字與形狀圖層構成的標題素材。',
        '透過逐軌推桿、聲道平衡、三段等化器與壓縮器混合音訊，附即時音量表；主匯流排上還有閃避，以及串流、Podcast 與廣播響度預設組。',
        '在我們的 GPU 上用 Whisper 產生字幕，讓你在字幕軌中編輯，並可燒錄到畫面中，或匯出為 SRT 或 VTT 外掛字幕檔。',
        '匯出搭配 AAC 音訊的 H.264 或 HEVC MP4，或匯出 MP3 或 WAV，尺寸可為畫布大小，或縮放為 720、1080、1440 或 2160 行，並提供含進度與重新轉譯功能的匯出面板。',
      ],
      flowSteps: [
        {
          title: '建立專案',
          description: '選擇畫布（16:9 的 1920 x 1080、9:16 的 1080 x 1920、1:1、4:5 或自訂尺寸），以及 24、30 或 60 的影格率。',
        },
        {
          title: '匯入媒體',
          description: '將影片、圖片與音訊上傳到媒體庫。伺服器會轉譯一個每秒一個關鍵影格的預覽代理檔，讓拖曳瀏覽保持輕快。',
        },
        {
          title: '剪輯與疊層',
          description: '把素材放到軌道上，在播放指標處修剪與分割，將疊加畫面與標題堆疊在基礎畫面之上，並讓靜態圖片停留任意長度。',
        },
        {
          title: '調色、去背與混音',
          description: '調整色彩、套用 LUT、去除背景、為需要移動的元素設定關鍵影格，並在混音器上平衡各音軌。',
        },
        {
          title: '匯出',
          description: '選擇格式、品質、輸出高度、字幕模式與響度預設組。ffmpeg 會在我們的伺服器上轉譯時間軸，檔案隨後出現在匯出面板中。',
        },
      ],
      advancedDetails: [
        '匯出是一次 ffmpeg 呼叫：每個來源都是一個輸入，時間軸會成為一個 filter_complex 濾鏡圖（trim、scale、overlay、用於標題的 drawtext、eq 與色彩濾鏡，以及用於音訊、設定 normalize=0 的 amix），輸出則以單次處理完成編碼。關鍵影格參數透過濾鏡圖上的 sendcmd 附屬檔傳遞，因此轉譯主機需要 ffmpeg 4.4 或更新版本。',
        '當轉譯 GPU 上的試探編碼成功時，H.264 會使用 h264_nvenc 硬體編碼器，否則使用 libx264。品質預設組在 NVENC 上對應 preset p4、固定品質 23（中）、p5、CQ 19（高）與 p4、CQ 28（低）；在 libx264 上則是 preset medium CRF 23、slow CRF 18 與 veryfast CRF 28。兩者都固定使用 yuv420p。',
        'HEVC 使用 hevc_nvenc 或 libx265，CQ 或 CRF 值高五點（NVENC 上為 28、24、33；libx265 上為 28、24、32），這是達到相同感知品質的常用偏移量；串流會標記為 hvc1，讓 MP4 能在 Safari 與 QuickTime 中播放。如果兩種編碼器都無法使用，匯出會明確失敗，而不是以 HEVC 之名交回 H.264。',
        '音訊會在濾鏡圖內重新取樣為 48 kHz 立體聲，影片匯出時編碼為 192 kb/s 的 AAC；MP3 匯出使用 192 kb/s 的 libmp3lame，WAV 匯出則是 16 位元 PCM。響度預設組使用 ffmpeg loudnorm：串流為 I=-14 LUFS TP=-1.5 LRA=11，Podcast 為 I=-16 TP=-1.5 LRA=11，廣播為 I=-23 TP=-2 LRA=7。',
        '選擇輸出高度時，合成後的畫面會在最後一個濾鏡中縮放（lanczos、正方形像素、寬度取整為偶數），且在字幕燒錄之後進行，因此文字會隨畫面一起縮放，而不是重新繪製。你的方案無法轉譯的高度會以錯誤拒絕，絕不會默默降級。',
        'MP4 檔案以 -movflags +faststart 寫入，讓索引位於檔案開頭，檔案在完全下載前就能開始播放。時間軸上的靜態圖片會成為帶有 -loop 1 -framerate <project fps> -t <hold> 的輸入，因此停留的相片解碼成本不會超過其影格本身。',
      ],
      whyItMatters: [
        '轉換工具只改變一個檔案。剪輯則會組合多個檔案：訪談下方的 B-roll、開場上方的標題、墊在兩者之下的配樂，每一個都精確修剪到影格。',
        '在瀏覽器編輯器中，預覽與匯出通常會逐漸不一致。Darkroom 在你的 GPU 上轉譯預覽、在我們的 GPU 上轉譯匯出，並以黃金影像測試框架讓兩者保持在明文記載的容許誤差內。',
        '繁重的工作不在你的筆電上進行。4K 匯出、Whisper 轉錄或經 LUT 調色的多圖層合成，都在 GPU 轉譯伺服器上執行，所以輕薄筆電也能完成工作。',
      ],
      useCases: [
        {
          title: '短影音平台的直式片段',
          description: '1080 x 1920 畫布、推近講者的鏡頭、標題卡、在人聲下方自動閃避的音樂，以及燒錄的字幕。',
        },
        {
          title: '教學與螢幕錄影',
          description: '剪掉冷場、拼接多個鏡次、以子母畫面疊加網路攝影機畫面、加入標註，並以 1080p 匯出，附外掛字幕檔。',
        },
        {
          title: '訪談與 Podcast 節目',
          description: '兩個機位依講者切換、經響度標準化的混音，以及將同一條時間軸匯出為 MP3 供音訊訂閱使用。',
        },
        {
          title: '宣傳與產品影片',
          description: '疊在背景畫面上的色度去背畫面、營造風格的 LUT、以關鍵影格移動的標誌，以及為牆面螢幕製作的 15 秒 4K 剪輯。',
        },
      ],
      workedExamples: [
        {
          title: '以「中」預設組匯出 90 秒 1080p30 剪輯',
          body: '在 30 fps 的 1920 x 1080 畫布上放兩段 1080p 素材、一條音樂軌與一張標題卡，以 H.264「中」品質匯出。在 NVENC 可正常運作的轉譯伺服器上，這是 h264_nvenc preset p4、固定品質 23、yuv420p；若無 NVENC，則是 libx264 preset medium CRF 23。混音以 192 kb/s 的 AAC 編碼，90 秒即 192,000 x 90 / 8，不論內容為何，音訊約為 2.2 MB。影片部分以品質為目標而非以位元率為目標，因此大小取決於畫面：在 CQ 23 下，靜態的人物講話畫面編碼後很小，手持晃動的畫面則很大。轉譯時間隨時間軸長度與同時可見的素材數量增加，因為每個可見素材的每一格都要先解碼與合成，才會送進編碼器。',
        },
        {
          title: '匯出為 MP3 與 WAV 的 20 分鐘 Podcast',
          body: '純音訊專案（兩條人聲軌、一段片頭音效、Podcast 響度預設組）會完全略過影片濾鏡圖。匯出為 MP3 時，檔案是固定 192 kb/s 的 libmp3lame：192,000 x 1,200 / 8 = 28.8 MB，約 29 MB。匯出為 WAV 時，是濾鏡圖 48 kHz 立體聲的 16 位元 PCM：48,000 x 2 個聲道 x 2 位元組 = 每秒 192,000 位元組，20 分鐘為 230 MB。loudnorm 階段的目標是 -16 LUFS 整合響度、-1.5 dBTP 上限與 11 LU 的響度範圍。由於沒有影格需要合成，這項工作只受限於來源解碼與音訊濾鏡，因此完成時間遠短於節目本身的長度。',
        },
      ],
      whenNotToUse: 'Darkroom 不適合只需一個步驟的工作。如果你只需要剪掉片段的開頭與結尾、變更格式或縮小檔案，單一用途的影片裁剪與壓縮頁面只需上傳一次、不必建立專案就能完成。它也不適合處理無法上傳的素材：每個來源都會送到我們的伺服器製作代理檔與轉譯，所以絕不能離開你電腦的素材應該交給桌面編輯器。訪客工作階段的專案限一個，保留 24 小時；若想下週再回來繼續，請在開始前先登入。',
      whyMediaManipulator: [
        '真正的剪輯基本功能：剃刀、滑移、滑動、捲動、漣漪、標記、群組、附緩動的關鍵影格、具等化器與壓縮器的混音器，而不是只附一個標題欄位的裁剪工具。',
        '誠實的匯出：硬體或軟體編碼由即時試探決定，HEVC 寧可拒絕也不造假，你的方案無法轉譯的解析度會回報錯誤，而不是悄悄降級。',
        '一個帳號，一個地方：對你正在剪輯的同一批檔案進行轉錄、壓縮或移除中繼資料，並在同一台 GPU 伺服器上產生旁白或字幕。',
      ],
      privacyNote: '只要專案存在，Darkroom 就會把你的媒體保留在我們的伺服器上：上傳的檔案會以素材形式進入媒體庫，伺服器會據此轉譯預覽代理檔、縮圖膠捲與波形峰值，匯出則由 ffmpeg 在轉譯主機上建立到 outputs/<jobId>/ 中。當你要求產生字幕時，音訊會送到我們自己 GPU 上的 Whisper，產生的字幕段落會與專案一起儲存。專案文件、其素材、版本與匯出檔都可以從編輯器或你的帳號頁面刪除。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。上傳的影片與音訊也會經過我們自己伺服器上的自動分析步驟。不會傳送任何資料給第三方 AI 供應商，也不會用任何檔案訓練任何模型。',
      faq: [
        {
          question: 'Darkroom 是免費的嗎？',
          answer: '是的。沒有帳號時，你可以保留一個專案，每天轉譯 5 次匯出，每個上傳檔案最大 200 MB，輸出最高 1080 行。免費帳號可提高到 5 個專案、每天 30 次匯出、1 GB 檔案與 1440 行；Premium 提供無限專案、每天 300 次匯出、5 GB 檔案與 2160 行輸出；Pro 則將匯出提高到每天 700 次。匯出有自己的每日計數器，不會消耗一般工作的額度。以上為預設值，價格頁面會顯示即時數字。',
        },
        {
          question: '可以匯出什麼？',
          answer: '搭配 H.264 或 HEVC 影片與 AAC 音訊的 MP4；純音訊專案則可匯出 MP3 或 WAV。影片可以用畫布大小輸出，或縮放為 720、1080、1440 或 2160 行；字幕可燒錄到畫面中、作為 SRT 或 VTT 外掛字幕檔，或省略；混音還可套用串流、Podcast 或廣播響度預設組。',
        },
        {
          question: '我該選哪個品質預設組？',
          answer: '「中」是 libx264 上的 CRF 23 或 NVENC 上的固定品質 23，若要上傳到本來就會重新編碼的平台，這是合理的預設值。「高」（CRF 18 或 CQ 19，preset slow 或 p5）適用於你會再次編輯或要在大螢幕上播放的母帶。「低」（CRF 28 或 CQ 28，veryfast 或 p4）適用於寄給同事的快速預覽。',
        },
        {
          question: '為什麼我的 HEVC 匯出失敗？',
          answer: 'HEVC 需要轉譯 GPU 上的 hevc_nvenc，或 ffmpeg 建置中的 libx265。如果伺服器兩者都沒有，匯出會失敗並顯示不支援編碼器的訊息，而不是交回一個標示為 HEVC 的 H.264 檔案。將格式切換為 H.264，同一條時間軸就能轉譯。',
        },
        {
          question: '字幕是如何製作的？',
          answer: '「產生字幕」會將時間軸的音訊送到我們 GPU 伺服器上的 Whisper。分段結果會以字幕段落的形式傳回，你可以在字幕軌中編輯，然後燒錄到畫面中匯出（將 ASS 字幕軌轉譯進影格），或作為影片旁的 SRT 或 VTT 檔案匯出。產生字幕計為一次 AI 工作，從 AI 工作額度中扣除。',
        },
        {
          question: '匯出結果與預覽一致嗎？',
          answer: '這正是設計的重點。預覽以 WebGL2 依照伺服器濾鏡圖相同的順序合成（裁切、適應、變形、調色、LUT、去背、不透明度、混合），黃金影像測試框架會在明文記載的容許誤差內比較兩者的影格。獨奏與隱藏套用到匯出的方式，與套用到預覽完全相同。',
        },
        {
          question: '之後可以再回到專案嗎？',
          answer: '可以。專案會連同修訂編號一起儲存，所以過時的分頁無法覆寫較新的作品，版本記錄也會保留可供返回的檢查點。瀏覽器中也會保留一份草稿，以便在當機後復原。已登入的使用者可從任何裝置開啟最近的專案；訪客專案則跟隨瀏覽器工作階段，並遵循 24 小時的保留期限。',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '來源與匯出檔案都在我們的伺服器上處理。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。',
        ],
        processingNotes: [
          '預覽在瀏覽器中合成；最終匯出在伺服器上編碼為 H.264 或 HEVC MP4，或 MP3 或 WAV 音訊。',
        ],
      },
      related: [
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '進一步縮小匯出檔，方便透過電子郵件或慢速連線傳送。',
        },
        {
          label: '影片轉錄',
          to: '/tools/transcribe-video',
          description: '取得完成剪輯的完整逐字稿，而不只是字幕。',
        },
        {
          label: '從影片擷取音訊',
          to: '/tools/extract-audio-from-video',
          description: '在帶進時間軸之前，先把片段的聲音抽出來。',
        },
        {
          label: '影片裁剪',
          to: '/tools/video-trimmer',
          description: '當你只需要剪一刀時。',
        },
        {
          label: 'Motion',
          to: '/tools/motion',
          description: '將標誌或下方字幕條製作成 SVG 動畫，再匯出 GIF 放進時間軸。',
        },
        {
          label: 'Darkroom 教學',
          to: '/tutorials/content-studio',
          description: '從空白專案到匯出 MP4，逐步完成一段剪輯。',
        },
      ],
      embed: {
        title: '剪輯影片',
        description: '建立新專案（或重新開啟最近的專案），把影片、圖片與音訊檔案拖進媒體庫，再放到多軌時間軸上。修剪、分割與排列素材，疊加畫面與標題，混合音訊，並匯出完成的 MP4，全部在你的瀏覽器中完成。',
      },
    },
    'remove-exif-metadata': {
      name: '移除圖片中的 EXIF 中繼資料',
      h1: '線上移除圖片中的 EXIF 中繼資料',
      tagline: '在分享相片之前，清除其中的 GPS 位置、裝置、相機和時間戳記資料。',
      metaTitle: '線上移除圖片 EXIF 中繼資料（免費） | Media Manipulator',
      metaDescription: '免費線上工具，可移除 JPG、PNG、WebP 和 HEIC 圖片中的 EXIF、GPS、IPTC 和相機中繼資料。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上移除圖片中的 EXIF 中繼資料',
      ogDescription: '在公開分享圖片之前，移除其中的 GPS 位置、相機與時間戳記中繼資料。',
      intro: '一張相片裡還藏著另一份文件。除了像素之外，手機或相機還會寫入裝置的品牌與型號，常常還有序號、鏡頭、曝光、快門按下的精確秒數、最後儲存檔案的軟體、一張小型預覽縮圖；如果當時開啟了定位服務，還會寫入你所站位置的緯度、經度與海拔。這個工具會從 JPG、PNG、WebP 或 HEIC 中讀出這一切，依各標籤透露的內容分組顯示給你看，然後用 ExifTool 一次全部移除，讓你分享的副本只包含畫面本身。',
      whatItDoes: [
        '以 ExifTool 檢查上傳的檔案，列出找到的每個標籤，並依類別分組（相機、鏡頭、GPS、日期與時間、XMP、IPTC、縮圖、色彩、製造商備註等），同時標示出與位置、身分、裝置與歷程有關的標籤。',
        '移除 EXIF 區塊（IFD0 與 ExifIFD：品牌、型號、機身序號、鏡頭型號、曝光、ISO、焦距、拍攝與修改日期）以及 GPS IFD（緯度、經度、海拔、其參考標籤與 GPS 時間戳記）。',
        '移除 IFD1 內嵌的預覽縮圖，這是圖片另外存放的一份小型副本，在許多編輯器中裁切後依然存在。',
        '移除 XMP 封包（建立工具、編輯歷程、關鍵字、評分）、IPTC 記錄（作者、著作權、說明）、Photoshop 資源區塊、廠商製造商備註與 ICC 色彩描述檔。',
        '先將 EXIF 方向套用到像素上，讓依賴旋轉標籤的手機相片在標籤移除後不會變成側躺。',
        '比較前後兩份報告，計算移除了多少項目並顯示數量；若其中包含位置標籤，會另外註明。',
      ],
      flowSteps: [
        {
          title: '上傳相片',
          description: '放入 JPG、PNG、WebP 或 HEIC。伺服器會執行 ExifTool 兩次（一次產生易讀的結果，一次以數值讀取 GPS 與曝光值），並傳回報告。',
        },
        {
          title: '閱讀報告',
          description: '標籤依類別分組；GPS 座標會標示在定位地圖上，讓你清楚看到檔案洩露了什麼。',
        },
        {
          title: '全部移除',
          description: '按一下，就會以 ImageMagick 重新儲存圖片，並對結果執行 exiftool -all=。',
        },
        {
          title: '比較並下載',
          description: '結果畫面會報告移除了多少標籤，提供兩份報告的並排差異比較，並交給你乾淨的檔案。',
        },
      ],
      advancedDetails: [
        '像素處理由 ImageMagick 執行：convert <input> -auto-orient -quality 85 <output>；對於 JPG、PNG、WebP、GIF 與 AVIF，輸出容器與輸入相同。HEIC、TIFF 與 BMP 在本頁沒有保留相同容器的路徑，會以 JPG 傳回。',
        '中繼資料處理是對轉換後的檔案執行 exiftool -overwrite_original -all=。-all= 會一次移除所有可寫入的群組：EXIF（IFD0、ExifIFD、GPS、InteropIFD）、IFD1 縮圖、XMP、IPTC、Photoshop IRB、ICC_Profile、製造商備註，以及 ExifTool 知道如何寫入的任何 APP 區段。JPEG 解碼器需要的 JFIF 與 Adobe APP14 區段會保留下來；它們描述的是像素配置，而不是你。',
        '由於圖片會重新編碼，JPG 會以品質 85 重新寫入，PNG 則以無損方式重新寫入。移除結果並不是剪掉中繼資料後逐位元組相同的副本。',
        '前後兩份報告與檢查器建立的 MetadataDocument 相同：以群組為鍵的項目，例如 GPS:GPSLatitude 或 XMP-xmpMM:History，每一項都依約 1,800 個標籤的目錄分類為 22 個類別與四種隱私類型（位置、身分、裝置、歷程）。',
        '移除數量不包含每次轉換都會改變的列（檔名、大小、修改日期、MIME 類型、圖片尺寸），因此反映的是實際被移除的中繼資料，而非檔案記錄資訊。',
        '影片與音訊容器也可以從影片與音訊轉換器中移除中繼資料：ffmpeg 會以 -map_metadata -1 -map_chapters -1 執行；對於 MP4、MOV、M4A 與 M4V，之後還會再執行一次 exiftool -all=，因為 ffmpeg 會留下 QuickTime 鍵值與 XMP。',
      ],
      whyItMatters: [
        'GPS 標籤可以對應到街道地址。一張在家拍攝、張貼出售沙發的相片，可能會讓陌生人知道沙發在哪裡。',
        '裝置與序號標籤會把相片彼此連結，也連結到你。兩張 BodySerialNumber 相同的圖片是同一台相機拍的，不論是哪個帳號張貼。',
        'IFD1 縮圖是原始畫面的副本。即使把臉或文件從畫面中裁掉，預覽可能仍會顯示出來。',
        '許多網站會在上傳時移除 EXIF，但也有許多不會。通訊軟體、電子郵件附件、雲端分享與拍賣平台經常原封不動地傳遞檔案。',
      ],
      useCases: [
        {
          title: '拍賣平台與分類廣告',
          description: '在買家看到之前，移除在家中拍攝的商品相片裡的位置與拍攝時間。',
        },
        {
          title: '文件相片',
          description: '拍下的表格或信件也會記錄拍攝時間與地點；轉寄之前先移除這些資訊。',
        },
        {
          title: '從敏感地點發布內容',
          description: '在圖片離開你的掌控之前，移除裝置識別碼與座標，並透過差異比較確認它們已經消失。',
        },
        {
          title: '清理編輯過的圖片',
          description: '編輯器會附加 XMP 歷程並保留原始縮圖；將兩者都移除，讓檔案只呈現你想呈現的內容。',
        },
      ],
      workedExamples: [
        {
          title: '附 GPS 的 12 MP iPhone JPEG',
          body: '一張直接來自 iPhone 15 Pro 的 4032 x 3024 JPEG，一般情況下包含 5 個 IFD0 標籤（品牌、型號、方向、軟體、修改日期）、7 個 ExifIFD 標籤（包括機身序號與鏡頭型號）、5 個 GPS 標籤、4 個 XMP 項目（包括編輯歷程）、2 個 ICC 描述檔項目、3 個 IFD1 縮圖項目（約 5 KB 的預覽 JPEG），以及一個衍生的 GPSPosition。結果畫面會報告移除了 27 個標籤，其中包含位置：這 27 個就是除了檔名、大小、日期與類型列以及圖片尺寸之外的所有項目，而後者任何檔案都有。輸出是以品質 85 重新編碼、方向已寫入像素的 JPG；最終大小由重新編碼決定。這項工作只有一次 ImageMagick 解碼與編碼，加上一次 ExifTool 改寫，所以幾秒內就能完成，時間主要花在像素上，而不是標籤上。',
        },
        {
          title: '來自近期手機的 HEIC',
          body: 'HEIC 在本頁沒有保留相同容器的路徑，所以 12 MP 的 HEIC 會由 ImageMagick 解碼，以品質 85 寫成 JPG，再以 exiftool -all= 移除中繼資料。你會失去 HEIC 容器與其色彩描述檔，換來一個所有瀏覽器與拍賣平台都接受的檔案。預期檔案會比你上傳的 HEIC 更大，因為品質 85 的 JPEG 重新編碼是唯一套用的壓縮，並決定了檔案大小。報告在處理前會列出 Apple 製造商備註與 GPS 區塊，處理後則只剩下檔案與圖片尺寸的列。HEIC 解碼是最慢的部分；即便如此，一張相片也只需要幾秒。',
        },
      ],
      whenNotToUse: '不要移除你還需要編輯、或需要證明來源的相片的中繼資料。這裡不接受相機 RAW 檔，而且無論如何都不應以 -all= 處理 RAW 檔，因為其中的製造商備註保存著 RAW 轉換器需要的資料。如果你想在移除 GPS 與裝置標籤的同時保留著作權聲明或標題，請改用圖片轉換器的「自訂中繼資料」模式，它會移除所有內容，再只寫回你填寫的欄位。也請記得，移除中繼資料並不會移除畫面中看得見的東西：路標、倒影或臉孔依然會透露你去過哪裡；臉部模糊與文字遮蔽工具可以處理這些。',
      whyMediaManipulator: [
        '你能看到證據。檢查器會在移除前列出每一個標籤，事後再以差異比較證明移除了什麼，而不是只給你一個綠色勾勾和一句保證。',
        '一次處理，涵蓋所有群組。ExifTool -all= 會一併移除 EXIF、GPS、XMP、IPTC、Photoshop、ICC、製造商備註與預覽縮圖；不需要一個區塊一個區塊地勾選。',
        '方向問題已處理。旋轉標籤會在移除前先套用到像素上，所以移除中繼資料後的手機相片在其他地方不會變成側躺；若只刪除標籤而不旋轉像素，通常就會發生這種情況。',
      ],
      privacyNote: '這個工具會從它傳回的副本中移除 EXIF 區塊（相機品牌、型號、序號、鏡頭、曝光、日期）、GPS 區塊、IFD1 預覽縮圖、XMP 與 IPTC 記錄、Photoshop 資源、製造商備註以及 ICC 描述檔。為此，伺服器必須先讀取它們：上傳的檔案會以 ExifTool 檢查，報告會以 metadata.json 寫入工作資料夾；移除之後，結果的第二份報告會保存在旁邊，讓「比較」檢視可以顯示兩者的差異。兩份報告與兩個檔案都存放在 uploads/<jobId>/ 與 outputs/<jobId>/ 中，並在保留期限結束時一起刪除。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。獨立的檢查器（只讀取檔案而不轉換）會在報告產生後立即刪除其暫存副本。圖片也會經過我們自己伺服器上的自動分析步驟；不會傳送任何資料給第三方。',
      faq: [
        {
          question: '到底會移除哪些中繼資料群組？',
          answer: 'ExifTool 能寫入的一切：EXIF（IFD0、ExifIFD、InteropIFD）、GPS IFD、IFD1 縮圖、所有命名空間中的 XMP（xmp、dc、xmpMM、photoshop 等）、IPTC IIM 記錄、Photoshop 資源區塊、Apple、Canon、Nikon、Sony 及其他廠商的製造商備註，以及 ICC 色彩描述檔。對 PNG 而言，這包括 tEXt、iTXt、zTXt、eXIf 與 iCCP 區塊；對 WebP 而言，則包括 EXIF、XMP 與 ICCP 區塊。',
        },
        {
          question: '圖片會被重新編碼嗎？',
          answer: '會。檔案會先經過 ImageMagick（同時把方向標籤套用到像素上），再由 ExifTool 移除標籤。JPG 會以品質 85 重新寫入，PNG 以無損方式重新寫入，WebP 則以品質 85 重新寫入。在一般檢視尺寸下，JPG 重新編碼後肉眼很難與原圖區分，但它並不是完全相同的位元流。',
        },
        {
          question: '為什麼我的 HEIC 變成了 JPG？',
          answer: '一鍵移除會為 JPG、PNG、WebP、GIF 與 AVIF 保留原本的容器。HEIC、TIFF 與 BMP 會被解碼並寫成 JPG，讓結果在任何地方都能開啟。如果你需要 HEIC，請在圖片轉換器中轉換，並將中繼資料設為「移除所有中繼資料」。',
        },
        {
          question: '色彩描述檔會被移除嗎？這有影響嗎？',
          answer: '會，exiftool -all= 會移除 ICC 描述檔。對一般的 sRGB 相片來說沒有任何改變，因為在沒有描述檔時，檢視器會假設為 sRGB。對近期手機拍攝的廣色域 Display P3 相片而言，在支援色彩描述檔的軟體中，顏色可能看起來稍微不那麼飽和。如果這對你很重要，請使用圖片轉換器的「自訂中繼資料」模式，並在那裡保留描述檔。',
        },
        {
          question: '我可以保留著作權字樣或標題嗎？',
          answer: '一鍵移除不行，它會移除所有內容。圖片轉換器的中繼資料區有「自訂」模式，會先移除檔案中的中繼資料，再只寫回你輸入的內容：標題、作者、說明、著作權、註解、關鍵字，以及選定的 EXIF 或 GPS 欄位。當你想要一個乾淨、但仍標示你名字的檔案時，請使用它。',
        },
        {
          question: '我怎麼知道成功了？',
          answer: '結果畫面會列出移除的標籤數量，並在其中包含位置資料時特別標示。開啟「比較」即可看到完整的前後對照：那是對輸出檔案執行的同一份 ExifTool 報告，所以任何殘留的 GPS 或序號列都會出現在那裡。',
        },
        {
          question: '這是免費的嗎？我可以處理多少張相片？',
          answer: '是免費的。每次移除都是透過標準轉換器的一次上傳，因此會計入每日一般工作次數：預設情況下，沒有帳號每天 5 次、每個檔案最大 200 MB；免費帳號每天 30 次、檔案最大 1 GB；Premium 每天 300 次；Pro 每天 700 次。失敗的工作會退還該次額度。即時數字列在價格頁面上。',
        },
      ],
      related: [
        {
          label: '模糊相片中的臉孔',
          to: '/tools/blur-faces-in-photo',
          description: '中繼資料只是問題的一半；也要隱藏畫面本身顯示的臉孔。',
        },
        {
          label: '遮蔽圖片中的文字',
          to: '/tools/redact-text-in-image',
          description: '塗黑畫面中印出的姓名、地址與號碼。',
        },
        {
          label: '壓縮圖片',
          to: '/tools/compress-image',
          description: '在張貼之前縮小清理過的相片。',
        },
        {
          label: '圖片轉 PDF',
          to: '/tools/image-to-pdf',
          description: '將移除中繼資料後的文件相片合併成一個 PDF。',
        },
        {
          label: '隱私權政策',
          to: '/privacy-policy',
          description: '上傳檔案、報告與結果如何儲存及刪除。',
        },
      ],
      embed: {
        title: '移除圖片的中繼資料',
        description: '上傳 JPG、PNG、WebP 或 HEIC 相片。我們會顯示其中的每一個標籤，接著按下「全部移除」即可將它們全部清除，並清楚看到移除了哪些內容。',
      },
    },
    'compress-image': {
      name: '壓縮圖片',
      h1: '線上免費壓縮圖片',
      tagline: '縮小 JPG、PNG 和 WebP 檔案大小，讓網站更快、上傳更小、分享更輕鬆。',
      metaTitle: '線上免費壓縮圖片 | Media Manipulator',
      metaDescription: '免費線上圖片壓縮工具。在維持良好畫質的同時縮小 JPG、PNG 和 WebP 檔案大小。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費壓縮圖片',
      ogDescription: '在維持良好品質的同時，縮小 JPG、PNG 和 WebP 的檔案大小。免費、快速、無需註冊。',
      intro: '壓縮圖片的意思是重新編碼，讓同一張圖片占用更少的位元組。這個頁面會開啟圖片轉換器，品質欄位已預設為 80，輸出格式也與你上傳的檔案相同，所以 JPG 仍是 JPG，WebP 仍是 WebP。在我們的伺服器上，這個工作就是一個 ImageMagick 指令：先依 EXIF 旋轉標記自動調整檔案方向，再以 -quality 80 寫出，或使用你輸入的 1 到 100 之間的任何數字。對 JPG 和 WebP 來說，這個數字決定了檔案大小。PNG 則會忽略它，因為 PNG 是無損格式，所以要縮小 PNG 相片，真正有效的做法是將輸出切換為 JPG 或 WebP。',
      whatItDoes: [
        '以你選擇的品質重新編碼 JPG 和 WebP 輸出；表單預設為 80。',
        '除非你更改，否則會維持輸入格式；將 PNG 相片改為 WebP 或 JPG，才是 PNG 大幅節省容量的關鍵。',
        '可在同一次處理中縮小像素尺寸：在調整尺寸欄位輸入的寬度或高度會在品質設定之前套用，讓兩種節省效果相乘。',
        '除非你將中繼資料模式設為移除，否則會將原始的 EXIF、IPTC 和 XMP 標籤複製回壓縮後的檔案。',
        '將結果寫入工作輸出資料夾，檔名為 converted.jpg、converted.webp 或 converted.png，下載連結提供的就是這個檔案。',
      ],
      flowSteps: [
        {
          title: '上傳 JPG、PNG 或 WebP',
          description: '不超過你方案的單檔上限即可，訪客預設為 200 MB。',
        },
        {
          title: '選擇品質數字',
          description: '預設為 80。60 到 75 壓縮得更多；90 以上則幾乎保留所有細節。',
        },
        {
          title: 'ImageMagick 重新編碼',
          description: 'convert input -auto-orient -quality N output，接著執行 exiftool，將標籤複製過去。',
        },
        {
          title: '下載較小的檔案',
          description: '在保留期限結束之前，輸出都會從工作資料夾提供下載。',
        },
      ],
      advancedDetails: [
        '確切的指令是 ImageMagick convert：先是輸入路徑，接著是 -auto-orient、可選的 -crop 和 -resize，然後是 -quality N，最後是輸出路徑。只有在輸出格式為 jpg、jpeg 或 webp 時，才會加上 -quality 參數（converter.go 中的 convertImage）。',
        '伺服器會驗證品質是否在 1 到 100 的範圍內；超出範圍的值會在任何處理開始前被拒絕，並退還該次工作額度。',
        'PNG 輸出永遠不會收到 -quality 參數，所以在 PNG 轉 PNG 的工作中調低數字不會有任何改變。轉換器不會執行 pngquant 或任何調色盤縮減；要讓 PNG 變小，就必須變更其格式。',
        '在預設的中繼資料模式下，伺服器會對結果執行 exiftool -TagsFromFile <original> -all:all -unsafe，因此相機、鏡頭、日期和 GPS 標籤在壓縮後都會保留。選擇移除時，則會改為對輸出執行 exiftool -all=。',
        '若你設定了調整尺寸，會在套用品質之前進行。只填寬度會維持長寬比；同時填寫寬度和高度則會強制使用那個精確的方框，即使比例不同也一樣。',
        '同一個表單也提供濾鏡、色調和文字疊加：濾鏡會在調整尺寸後立即套用，色調和文字疊加則在品質設定之後，最後才加上。',
      ],
      whyItMatters: [
        '圖片的位元組通常是網頁或電子郵件中占比最大的部分，因此將它減半是成本最低的提速方法。',
        '上傳表單、CMS 欄位和通訊應用程式的上限是以 MB 計算，而不是以像素計算。',
        '以你自己選擇的品質重新編碼一次，勝過讓平台依它自己的條件重新編碼。',
      ],
      useCases: [
        {
          title: '部落格與商品相片',
          description: '發布前將 4 到 6 MB 的相機 JPEG 壓到遠低於 1 MB。',
        },
        {
          title: '電子郵件附件',
          description: '讓一組相片符合 20 或 25 MB 的信箱限制。',
        },
        {
          title: '申請入口網站',
          description: '符合 2 MB 的大頭照或證件照限制，且看不出畫質損失。',
        },
        {
          title: '工作用副本',
          description: '保留較小的副本供日常使用，原始檔則留在你的封存中。',
        },
      ],
      workedExamples: [
        {
          title: '一張 4000 x 3000 的手機 JPEG，以品質 80、寬度 1600 px 處理',
          body: '輸入：一張直接來自手機相機、4.8 MB、4000 x 3000 像素的 JPEG。設定：寬度 1600，高度留空，品質 80，格式不變。ImageMagick 會執行 -resize 1600x，維持比例並產生 1600 x 1200 像素：1.92 百萬像素，相較於原本的 12 百萬像素，大約是像素數量的六分之一。結果以 -quality 80 寫出，並複製回 EXIF，因此輸出是一張 1600 x 1200 的 JPG，其大小隨像素減少而下降，大約是原檔的六分之一，所以從 4.8 MB 預期會降到約 1 MB 或更小。轉換是 ImageMagick 對一張 12 百萬像素圖片的單次處理，只需幾秒鐘；上傳這個 4.8 MB 的檔案通常比轉換它還要久。',
        },
        {
          title: '一張 2.6 MB 的 PNG 螢幕截圖改為 WebP',
          body: '輸入：一張 1920 x 1080、2.6 MB、沒有透明度的 PNG 螢幕截圖。若格式維持 PNG 並將品質調到 60，不會有任何改變，因為 PNG 輸出不會傳入 -quality。將輸出切換為 WebP 並使用預設的 80，會執行 convert input -auto-orient -quality 80 converted.webp。未壓縮時，這 2,073,600 個像素相當於 6.2 MB 的 RGB 資料；品質 80 的有損 WebP 只會保留其中一小部分，因此結果只有原本 2.6 MB PNG 的一小部分，確切數字取決於螢幕截圖中含有多少平面色塊和文字。尺寸維持 1920 x 1080，工作在幾秒內就能完成。',
        },
      ],
      whenNotToUse: '不要對仍打算大幅編輯的圖片使用有損壓縮，也不要用在需要以 PNG 保留透明度的 PNG 上（切換為 JPG 會將 Alpha 色版平面化），或是含有小字的螢幕截圖上，因為品質遠低於 85 時，文字會糊掉。如果檔案大只是因為像素尺寸大，先使用圖片尺寸調整工具會更好；如果你的目標是隱私而不是檔案大小，EXIF 移除工具能在不更動像素的情況下移除標籤。此外，已經以品質 70 儲存的 JPG，以 80 重新儲存也不會小多少；每次重新儲存都會增加損失，卻沒有相應的好處。',
      whyMediaManipulator: [
        '實際執行的指令就寫在本頁上，包括 PNG 會忽略品質數字這件事，所以你不必猜測檔案為什麼沒有變小。',
        '品質、調整尺寸、格式和中繼資料控制都在同一個表單、同一次上傳中完成，而且不會加上浮水印。',
        '標準工具無需安裝，也不需要帳號。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ],
      privacyNote: '你的圖片會儲存在我們自己伺服器的 uploads/<jobId>/ 下，ImageMagick 會將壓縮後的副本寫入 outputs/<jobId>/，並在旁邊寫入一份原圖的中繼資料報告。在預設模式下，exiftool 會將原始的 EXIF、IPTC 和 XMP 標籤複製到壓縮後的檔案上，因此除非你選擇移除選項，否則位置和相機資料會隨結果一起保留。每張上傳的圖片也會交由同一台伺服器上的視覺模型進行自動分析，其 JSON 摘要會與工作一起保存。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。不會傳送任何內容給第三方服務。',
      faq: [
        {
          question: '在這裡壓縮圖片是免費的嗎？',
          answer: '標準工具是免費的。一次壓縮工作會消耗當天的一次一般工作：預設訪客每天 5 次，單檔上限 200 MB；免費帳號提高到每天 30 次、單檔 1 GB；Premium 和 Pro 則分別為 300 和 700。即時的數字請見 /pricing，因為上限可能會變動。',
        },
        {
          question: '我應該使用什麼品質數字？',
          answer: '80 是預設值，也是相片合理的預設選擇。只有在硬性的大小限制逼得你不得不時才調低；會被列印或之後要裁切的圖片則用 90 以上。這個數字會直接傳給 ImageMagick 的 -quality 選項，因此與其他以 ImageMagick 打造的工具中的意義相同。',
        },
        {
          question: '為什麼我的 PNG 沒有變小？',
          answer: '因為品質欄位對 PNG 輸出沒有作用：伺服器只會對 jpg、jpeg 和 webp 加上 -quality。請將輸出格式改為 WebP 或 JPG。如果你需要保留透明度，WebP 會保留 Alpha 色版，JPG 則不會。',
        },
        {
          question: '壓縮會保留我的 EXIF 和 GPS 資料嗎？',
          answer: '預設會。ImageMagick 寫出檔案後，exiftool 會將原圖的每一組標籤複製到結果上。若要全部移除，請在中繼資料區段選擇移除，或使用專門的 EXIF 移除工具。',
        },
        {
          question: '圖片也會被調整尺寸嗎？',
          answer: '除非你輸入寬度或高度，否則不會。兩個欄位都留空時，像素尺寸維持不變，只有編碼會改變。',
        },
        {
          question: '可以一次壓縮多張圖片嗎？',
          answer: '每次上傳是一個工作，只會產生一個輸出檔案。請每張圖片各執行一次工具；每個工作都會計為每日額度中的一次一般工作。',
        },
        {
          question: '在相同品質下，WebP 一定比 JPG 小嗎？',
          answer: '對相片來說通常如此，但兩種編碼器的品質刻度並不相同，所以請實際比較兩者的輸出，而不要直接假設。當檔案必須在早於 WebP 支援的軟體中開啟時，請保留 JPG。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '降低品質會影響 JPG 和 WebP 輸出。若要大幅縮小 PNG 相片，請將它轉換為 JPG 或 WebP。',
        ],
      },
      related: [
        {
          label: '圖片尺寸調整',
          to: '/tools/image-resizer',
          description: '先縮小像素尺寸，節省最多容量。',
        },
        {
          label: '移除 EXIF 中繼資料',
          to: '/tools/remove-exif-metadata',
          description: '不重新編碼，即可移除位置和相機標籤。',
        },
        {
          label: '圖片轉 PDF',
          to: '/tools/image-to-pdf',
          description: '將壓縮後的 JPG 放進單頁 PDF。',
        },
        {
          label: 'AI 圖片放大器',
          to: '/tools/ai-image-upscaler',
          description: '反向操作，將小圖片放大。',
        },
        {
          label: '圖片轉換器教學',
          to: '/tutorials/image/getting-started',
          description: '逐一說明品質、調整尺寸和格式設定。',
        },
      ],
      embed: {
        title: '壓縮圖片',
        description: '上傳圖片並調低品質滑桿，即可縮小檔案。輸出格式預設維持不變，也可以切換為 WebP，以取得最小的檔案。品質約 75–85 是不錯的平衡。',
      },
    },
    'image-resizer': {
      name: '圖片尺寸調整',
      h1: '線上免費調整圖片尺寸',
      tagline: '將 JPG、PNG、WebP 和 GIF 圖片調整為精確的像素尺寸，同時維持長寬比。',
      metaTitle: '線上免費調整圖片尺寸 | Media Manipulator',
      metaDescription: '免費線上圖片尺寸調整工具。將 JPG、PNG、WebP 和 GIF 圖片調整為精確的像素尺寸，同時維持長寬比。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費調整圖片尺寸',
      ogDescription: '將 JPG、PNG、WebP 和 GIF 圖片調整為精確的像素尺寸。免費、快速、無需註冊。',
      intro: '這個頁面會開啟圖片轉換器，並把調整尺寸的欄位放在最前面。輸入寬度、高度或兩者，伺服器就會以完全依照你輸入內容所建立的 -resize 參數執行 ImageMagick：只填寬度時為 1600x，只填高度時為 x900，兩者都填時為 1600x900!。結尾的驚嘆號很重要：它會讓 ImageMagick 產生那個精確的方框，即使比例與原圖不同也一樣，而這會拉伸畫面。所以規則很簡單：填一個欄位會維持比例；填兩個欄位會給你精確的尺寸，並相信你已選好相符的比例，或已經先行裁切。',
      whatItDoes: [
        '先依 EXIF 旋轉標記自動調整方向，再將 JPG、PNG、WebP 和 GIF 圖片縮放為你輸入的像素寬度和高度。',
        '只填一個維度時維持長寬比；兩個都填時強制使用精確的方框。',
        '在同一個表單中提供裁切框，會在調整尺寸之前套用，這樣就能取得精確的正方形或橫幅，而不會變形。',
        '預設以原始格式寫出輸出，JPG 和 WebP 的品質為 85，並將原始的中繼資料標籤複製到輸出上。',
        '將要求的高度限制在你方案的輸出上限內，並將尺寸限制在 ImageMagick 允許產生的範圍內。',
      ],
      flowSteps: [
        {
          title: '上傳圖片',
          description: 'JPG、PNG、WebP 或 GIF，不超過你方案的單檔上限。',
        },
        {
          title: '輸入寬度、高度或兩者',
          description: '一個值會維持比例，兩個值會強制使用該方框。如果必須改變比例，請先裁切。',
        },
        {
          title: 'ImageMagick 調整尺寸',
          description: 'convert input -auto-orient [-crop WxH+X+Y] -resize <arg> [-quality 85] output.',
        },
        {
          title: '下載',
          description: '調整尺寸後的檔案會以 converted.<format> 的名稱，從工作輸出資料夾提供下載。',
        },
      ],
      advancedDetails: [
        '調整尺寸的參數在 convertImage（converter.go）中建立：兩個值都填時為 WxH!（強制精確尺寸），只填寬度時為 Wx，只填高度時為 xH。使用的是 ImageMagick 預設的重新取樣濾鏡，沒有選項可以改選其他濾鏡。',
        '設定裁切時，它會以 -crop WxH+X+Y 傳入，並在 -resize 之前執行，因此裁切座標是相對於自動調整方向後的原圖，而不是調整尺寸後的結果。',
        '伺服器會拒絕大於 10000 或小於 1 的寬度或高度，而表單會將兩個欄位的上限設為 4096。',
        '明確指定的高度也會在接受上傳之前，與你方案的輸出高度上限比對：訪客預設為 1080 px，免費帳號為 1440，Premium 和 Pro 為 2160。超過上限的要求會被拒絕，訊息中會列出這兩個數字，且不會消耗任何額度。只填寬度時則不會檢查。',
        '除非你更改數字，否則 JPG 和 WebP 輸出會收到 -quality 85；PNG 和 GIF 則會忽略它。用這個工具放大只會內插現有的像素，因此 2 倍或 4 倍的放大會看起來偏軟；這種情況請使用 AI 放大器。',
        'ImageMagick 完成後，在預設的中繼資料模式下，exiftool 會將原始標籤複製到結果上，因此調整尺寸後的檔案仍帶有拍攝日期、相機型號和任何 GPS 位置。',
      ],
      whyItMatters: [
        '頭像、封面和縮圖欄位都需要特定的像素尺寸，而由平台自行調整尺寸，通常品質較差，也無法控制。',
        '像素數量是決定檔案大小的最大單一因素；一張 24 百萬像素的相片以 1920 px 寬顯示時，攜帶的資料是螢幕所能顯示的十倍。',
        '依你自己的條件調整尺寸，也能讓你自行選擇裁切範圍，而不是讓正方形欄位把頭切掉。',
      ],
      useCases: [
        {
          title: '大頭照與頭像',
          description: '先裁切成正方形，再調整為服務要求的 400 或 512 px。',
        },
        {
          title: '網頁與部落格圖片',
          description: '將相機拍攝的相片縮放為實際顯示時的欄寬。',
        },
        {
          title: '橫幅與頁首',
          description: '裁出精確的長寬比，再精準達到所需的寬度，分毫不差。',
        },
        {
          title: '表單上傳限制',
          description: '降低尺寸，以符合百萬像素或 MB 的上限。',
        },
      ],
      workedExamples: [
        {
          title: '一張 6000 x 4000 的相機 JPEG 縮放為 1920 px 寬',
          body: '輸入：一張來自無反光鏡相機、8.5 MB、24 百萬像素的 JPEG。設定：寬度 1920，高度留空，格式不變，品質 85。伺服器會執行 convert input -auto-orient -resize 1920x -quality 85 converted.jpg。比例為 3:2，因此輸出為 1920 x 1280 像素，約 2.46 百萬像素，大約是原始像素數量的十分之一。檔案大小也會以相近的比例下降，所以預期會小於 1 MB。ImageMagick 對 24 百萬像素進行一次處理，在伺服器上只需幾秒鐘，之後的 exiftool 複製會保留鏡頭和曝光標籤。',
        },
        {
          title: '用 3024 x 4032 的直式手機相片製作 400 x 400 頭像',
          body: '輸入：一張 3.1 MB 的直式 JPEG，寬 3024、高 4032。只輸入 400 和 400 會執行 -resize 400x400!，把 3:4 的畫面壓扁成正方形。正確做法是將裁切設為 3024 x 3024、偏移 0,504（取中間的正方形），然後將寬度設為 400、高度設為 400。指令會變成 convert input -auto-orient -crop 3024x3024+0+504 -resize 400x400! -quality 85 converted.jpg，結果是一張不變形、共 160,000 像素的 400 x 400 JPG，大小只有幾十 KB。裁切與調整尺寸在同一次處理中完成，幾秒鐘就能結束。',
        },
      ],
      whenNotToUse: '不要用圖片尺寸調整工具把小圖變大：ImageMagick 只會內插現有的像素，所以一張 640 px 的相片拉大到 2560 px 會變得模糊，這種情況應該交給 AI 放大器。除非你已經先裁切，否則不要輸入比例與圖片不同的寬度和高度，因為精確方框模式會拉伸畫面，而不是加上黑邊。如果檔案很大，但尺寸已經正確，請改用壓縮工具，不要更動像素。另外，動態 GIF 更適合交給專門的 GIF 工具處理，而不是單純調整尺寸。',
      whyMediaManipulator: [
        '本頁以實際的 ImageMagick 參數說明「精確方框」與「維持比例」兩種行為，所以相片被拉伸時不會讓你感到意外。',
        '裁切、調整尺寸、格式和品質只需一次上傳，輸出也不會加上浮水印。',
        '標準工具無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ],
      privacyNote: '上傳的圖片會儲存在我們伺服器的 uploads/<jobId>/ 下，調整尺寸後的副本則儲存在 outputs/<jobId>/ 下；兩個目錄都登記在保留期限紀錄中，並會一起移除。由於預設的中繼資料模式會用 exiftool 將原始標籤複製到調整尺寸後的檔案上，除非你在表單的中繼資料區段選擇「移除所有中繼資料」，否則 GPS 座標和相機序號會隨結果一起保留。上傳來調整尺寸的圖片，也會經過我們伺服器對每張圖片執行的自動分析；該分析使用本機的視覺模型，摘要會儲存在工作資料夾中。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。不會有任何第三方收到該檔案。',
      faq: [
        {
          question: '調整尺寸需要付費嗎？',
          answer: '標準工具無需帳號，也無需付費。每次調整尺寸計為一次每日一般工作：預設訪客每天 5 次、免費帳號每天 30 次，單檔上限分別為 200 MB 和 1 GB。Premium 和 Pro 會將次數提高到 300 和 700。目前生效的數字請見 /pricing。',
        },
        {
          question: '如何維持長寬比？',
          answer: '兩個欄位只填其中一個。只填寬度會變成 -resize 1600x，高度會依原始比例計算；只填高度會變成 x900，寬度隨之調整。',
        },
        {
          question: '為什麼我的圖片被拉伸了？',
          answer: '你同時填了寬度和高度，而比例與圖片不符。兩個值會以 WxH! 送出，強制使用那個精確的方框。請先在同一個表單中裁切成目標比例，再設定兩個值。',
        },
        {
          question: '我最大可以要求多大的尺寸？',
          answer: '表單的任一欄位最多接受 4096，伺服器最多接受 10000。明確指定的高度若超過你方案的輸出上限（訪客預設為 1080 px），會在上傳開始前被拒絕，不會消耗任何額度。',
        },
        {
          question: '可以用這個工具把小相片放大嗎？',
          answer: '你可以輸入較大的數字，但 ImageMagick 只會內插像素，所以結果會偏軟。若要進行能重建細節的 2 倍或 4 倍放大，請使用 AI 放大器，它改用 Real-ESRGAN 處理。',
        },
        {
          question: '輸出會保留我的 EXIF 資料和方向嗎？',
          answer: '像素會先自動調整方向，因此結果在任何地方都會正向顯示；在預設模式下，exiftool 會將原始標籤複製回去。如果你想移除這些標籤，請選擇「移除所有中繼資料」。',
        },
        {
          question: '可以調整 GIF 的尺寸嗎？',
          answer: 'GIF 可作為輸入和輸出，並經過相同的 ImageMagick 指令處理。這個工具是為靜態圖片打造的；若是動態 GIF，專門的 GIF 工具能讓你更精細地控制影格和調色盤。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '將其中一個維度留空，即可等比例縮放並維持長寬比。',
        ],
      },
      related: [
        {
          label: '壓縮圖片',
          to: '/tools/compress-image',
          description: '在不改變尺寸的情況下降低品質。',
        },
        {
          label: 'AI 圖片放大器',
          to: '/tools/ai-image-upscaler',
          description: '用模型而不是內插，放大 2 倍或 4 倍。',
        },
        {
          label: '移除 EXIF 中繼資料',
          to: '/tools/remove-exif-metadata',
          description: '移除調整尺寸時預設會保留的標籤。',
        },
        {
          label: '圖片轉 PDF',
          to: '/tools/image-to-pdf',
          description: '將調整尺寸後的圖片放進 PDF 頁面。',
        },
        {
          label: '圖片轉換器教學',
          to: '/tutorials/image/getting-started',
          description: '逐一說明調整尺寸、裁切和品質設定。',
        },
      ],
      embed: {
        title: '調整圖片尺寸',
        description: '上傳圖片，並在下方設定目標寬度和／或高度。留空其中一個，即可等比例縮放並維持原始長寬比。除非你更改，否則輸出格式維持不變。',
      },
    },
    'remove-background-from-image': {
      name: '移除圖片背景',
      h1: '線上免費移除圖片背景',
      tagline: '自動擦除任何相片的背景，下載乾淨的透明 PNG 去背圖。',
      metaTitle: '線上免費移除圖片背景 | Media Manipulator',
      metaDescription: '免費線上背景移除工具。自動擦除任何相片的背景，下載透明 PNG。執行在我們自己的 GPU 上，不使用第三方 AI。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費移除圖片背景',
      ogDescription: '自動擦除任何相片的背景，下載透明 PNG 去背圖。免費，無需註冊。',
      intro: '本頁會開啟圖片轉換器，並將 AI 操作鎖定為「移除背景」、輸出鎖定為 PNG。轉換時，伺服器會把你的檔案交給開源分割工具 rembg，在我們自有的 GPU 上執行：預設會載入 BiRefNet General 模型，預測哪些像素屬於主體，並寫出一張除主體外 Alpha 通道全為透明的 PNG。表單中還可選擇另外六種模型（較輕量的 BiRefNet、人像變體、ISNet，以及三種 U2Net 版本），適用於通用模型誤判頭髮、玻璃或雜亂背景前人物的情況。',
      whatItDoes: [
        '以你選擇的模型（若未變更則為 BiRefNet General）執行 rembg，並傳回置於透明背景上的主體。',
        '一律輸出 PNG，因為透明度需要 Alpha 通道，而 API 會為此操作強制使用 .png 副檔名。',
        '保留你上傳圖片的完整像素尺寸；去背結果不會被縮放或裁切。',
        '透過搭配 CUDA 的 ONNX Runtime 在我們自己的 GPU 上執行；任何圖片都不會傳送到外部 AI 服務。',
        '計為一次一般工作，與單純的格式轉換計算單位相同，而不是 AI 工作。',
      ],
      flowSteps: [
        {
          title: '上傳 JPG、PNG 或 WebP',
          description: '單一且清楚的主體能產生最乾淨的遮罩。',
        },
        {
          title: '選擇模型，或保留預設值',
          description: '已預先選取 BiRefNet General；人像與人體分割模型是專為人物準備的。',
        },
        {
          title: 'rembg 在 GPU 上進行分割',
          description: '在載入 CUDA ONNX Runtime 環境後執行 rembg i -m <model> input output.png。',
        },
        {
          title: '下載透明 PNG',
          description: '結果是工作輸出資料夾中的 converted.png。',
        },
      ],
      advancedDetails: [
        '呼叫的是 ai_tools.go 中的 RemoveBackground：一個 bash shell 會載入 ONNX Runtime CUDA 環境指令碼，將 U2NET_HOME 設為伺服器的模型目錄，然後執行 rembg i -m <model> <input> <output>。模型權重會快取在伺服器上，因此重新啟動後的第一個工作可能會因載入權重而稍微久一點。',
        '可接受的模型名稱為 birefnet-general、birefnet-general-lite、isnet-general-use、u2net、u2netp、u2net_human_seg 與 birefnet-portrait；其他任何值都會在工作開始前被拒絕。空值會被視為 birefnet-general。',
        'AI 路徑會完全取代 ImageMagick 處理流程，因此表單中的品質數值、濾鏡、色調、文字疊加與中繼資料選項對此操作都沒有作用；輸出就是 rembg 寫出的結果。',
        '由於 AI 操作不會執行一般的 exiftool 複製步驟，PNG 不會帶有原圖的任何 EXIF。如果你需要在去背圖上保留這些標籤，可以用中繼資料編輯器在第二個工作中加入。',
        '輸出大小取決於主體：完全透明的區域在 PNG 中幾乎不占空間，因此大畫布上的小商品會產生小檔案，而占滿畫面的主體則會產生接近原圖無損 PNG 大小的檔案。',
      ],
      whyItMatters: [
        '商品刊登、縮圖與合成圖都從去背開始，而手動製作遮罩每張圖都要花上好幾分鐘。',
        '越來越多電商平台要求純色或白色背景，也就是把透明去背圖放在白色圖層上。',
        '以數百萬張遮罩訓練的模型，處理毛皮、頭髮與半透明邊緣的效果比魔術棒選取更好。',
      ],
      useCases: [
        {
          title: '電商商品',
          description: '分離出商品，並放在白色或任何品牌色上。',
        },
        {
          title: '大頭照與團隊頁面',
          description: '使用人像模型，把人物從辦公室背景中乾淨地去背。',
        },
        {
          title: '從相片中擷取標誌',
          description: '為只存在於彩色招牌或頁面上的標誌取得透明版本。',
        },
        {
          title: '縮圖與貼圖',
          description: '在你的編輯器中用多張去背圖組合出分層設計。',
        },
      ],
      workedExamples: [
        {
          title: '一張 3000 × 2000 的商品 JPEG，使用預設模型',
          body: '輸入：一張 2.1 MB、3000 × 2000 的 JPEG，內容是灰色背景前的一隻鞋。模型維持 BiRefNet General。伺服器在 GPU 上執行 rembg，並以相同的 3000 × 2000 像素、四個通道寫出 converted.png。未壓縮時這是 24 MB 的 RGBA 資料，但透明背景幾乎壓縮到不占空間，因此 PNG 大小取決於鞋子本身；由於 PNG 是無損格式，通常為數 MB。所需時間是模型對圖片進行一次前向傳遞再加上 PNG 編碼，模型預熱後只需幾秒；閒置一段時間後的第一次執行則會再加上載入權重的時間。',
        },
        {
          title: '一張 1080 × 1080 的大頭照，使用人像模型',
          body: '輸入：一張 640 KB、1080 × 1080 的 WebP 自拍照，背景是書架。將模型切換為專為人物與頭髮調校的 BiRefNet Portrait。輸出是一張 1080 × 1080 的 PNG，人物不透明，書架則完全透明。在 1.17 百萬像素下，模型處理很快；大部分實際耗時花在上傳與寫入 PNG。由於 AI 路徑會略過中繼資料複製，PNG 不含 EXIF，而這通常正是個人頭像所需要的。',
        },
      ],
      whenNotToUse: '當主體不是單一明確的物體時，請不要使用這個工具：人群、風景、圖樣，或沒有明顯前景的室內場景，都讓模型無從分離，遮罩會變得很隨意。如果你想要的是主體背後的柔和模糊而不是透明、需要 JPG 格式的結果（JPG 無法保存 Alpha 通道，因此你之後還得將它平面化），或輸入是螢幕截圖或線稿（此時 ISNet 或在編輯器中手動選取，效果會比以相片訓練的模型更好），這個工具也不適合。',
      whyMediaManipulator: [
        '以名稱提供七種真正的分割模型，當邊緣處理不對時，你可以從通用模型切換到人像或 U2Net 版本。',
        '輸出是全解析度的一般透明 PNG，沒有浮水印，也不會被強制縮小。',
        '模型在我們營運的硬體上執行，標準工具無需帳號。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ],
      privacyNote: '你的相片會寫入我們伺服器上的 uploads/<jobId>/，並由同一台機器上以 GPU 執行的 rembg 讀取；去背結果則存放在 outputs/<jobId>/converted.png。分割過程不會呼叫任何外部 API，你圖片中的任何內容也不會被用來訓練任何東西。與所有圖片上傳一樣，檔案也會經過一次自動分析步驟，由託管在我們伺服器上的視覺模型檢視，該摘要會與工作一起儲存。由於 AI 操作不會執行中繼資料複製步驟，PNG 不會帶有原圖的 EXIF。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      faq: [
        {
          question: '移除背景是免費的嗎？',
          answer: '是的，在每日額度內免費。移除背景特意計為一般工作，而不是從獨立的 AI 工作額度中扣除：預設訪客每天 5 次、免費帳號每天 30 次，單一檔案上限分別為 200 MB 與 1 GB。Premium 與 Pro 分別為 300 與 700 次。目前的數字請見 /pricing。',
        },
        {
          question: '我該選擇哪個模型？',
          answer: '物體、商品與大多數相片請保留 BiRefNet General。人物請選擇 BiRefNet Portrait 或 U2Net Human Segmentation；若想在大圖上更快完成處理，請選擇 BiRefNet General Lite 或 U2Net Lite。',
        },
        {
          question: '為什麼輸出一律是 PNG？',
          answer: '因為去背結果需要 Alpha 通道，API 會為此操作強制使用 .png 副檔名；JPG 沒有 Alpha 通道，背景會顯示為黑色或白色。如果你已將它平面化到某個顏色上，之後可以再轉換成其他格式。',
        },
        {
          question: '可以改用白色背景而不是透明嗎？',
          answer: '這個工具無法直接做到。請在任何編輯器或 Darkroom 中把 PNG 放在白色圖層上；透明像素會呈現下方圖層的顏色。',
        },
        {
          question: '頭髮、毛皮和玻璃也能處理嗎？',
          answer: '通常可以，人像與 BiRefNet 模型在訓練時就考慮到了這些邊緣，但半透明區域是最困難的情況。如果第一個模型留下了毛邊，請換另一個模型試試。',
        },
        {
          question: '我的相片會被傳送給外部 AI 公司嗎？',
          answer: '不會。rembg 及其模型都在我們自己的 GPU 伺服器上執行，工作從不呼叫任何第三方 API。',
        },
        {
          question: '去背結果會保留我的 EXIF 資料嗎？',
          answer: '不會。AI 操作會略過一般轉換器執行的 exiftool 複製步驟，因此 PNG 不含相機、日期或 GPS 標籤。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '輸出一律為透明 PNG。移除背景在我們本地的 GPU 伺服器上執行，而不是透過第三方 API。',
        ],
      },
      related: [
        {
          label: '移除相片中的物件',
          to: '/tools/remove-object-from-photo',
          description: '擦除單一物件，保留場景的其餘部分。',
        },
        {
          label: '圖片尺寸調整',
          to: '/tools/image-resizer',
          description: '將去背圖縮放到版面所需的尺寸。',
        },
        {
          label: 'AI 圖片放大器',
          to: '/tools/ai-image-upscaler',
          description: '在放置之前先放大較小的去背圖。',
        },
        {
          label: '模糊相片中的人臉',
          to: '/tools/blur-faces-in-photo',
          description: '將人物匿名化，而不是把他們分離出來。',
        },
        {
          label: '圖片轉換器教學',
          to: '/tutorials/image/getting-started',
          description: '逐一了解每個 AI 與圖片選項。',
        },
      ],
      embed: {
        title: '移除圖片背景',
        description: '上傳一張相片。這個工具已預設為 AI 背景移除工具，並輸出透明 PNG。只要上傳並轉換即可：主體會被保留，背景則會被擦除。',
      },
    },
    'image-to-pdf': {
      name: '圖片轉 PDF',
      h1: '線上免費將圖片轉換為 PDF',
      tagline: '一鍵將 JPG、PNG 等圖片變成整潔、方便分享的 PDF 文件。',
      metaTitle: '線上免費將圖片轉換為 PDF | Media Manipulator',
      metaDescription: '免費線上圖片轉 PDF 工具。將 JPG、PNG 等圖片變成整潔的 PDF 文件。無需註冊，無浮水印。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將圖片轉換為 PDF',
      ogDescription: '將 JPG、PNG 等圖片變成整潔、方便分享的 PDF。免費、快速，無需註冊。',
      intro: '本頁將輸出格式鎖定為 PDF，讓你的圖片走 API 中的專屬路徑，以純 Go 建構文件，而不經過 ImageMagick 或 Ghostscript。JPEG 會透過 /DCTDecode 濾鏡逐位元組原樣嵌入，因此 PDF 中的相片就是你上傳的同一個壓縮資料流。PNG、GIF 或 WebP 則會先解碼、合成到白色背景上，再以 zlib 壓縮的 8 位元 RGB 儲存。這單一頁面的尺寸會讓圖片以每英吋 96 像素呈現：每個像素對應 0.75 點，讓圖片保持原生解析度，不經任何重新取樣。',
      whatItDoes: [
        '將一張圖片包裝成一頁的 PDF 1.4 文件，頁面尺寸依 96 DPI 對應圖片大小。',
        '原封不動地嵌入 JPEG 資料，因此相片不會經歷第二次壓縮。',
        '將透明 PNG 與 GIF 的像素平面化到白色背景上，並以 zlib 無損儲存。',
        'WebP 及其他 Go 無法解碼的封裝格式會先透過 ImageMagick 點陣化，再以無損方式嵌入結果。',
        '忽略品質、尺寸調整、裁切、濾鏡與 AI 設定；PDF 路徑只接收圖片本身。',
      ],
      flowSteps: [
        {
          title: '上傳任何圖片',
          description: 'JPG、PNG、GIF 與 WebP 是常見的輸入；此欄位接受任何圖片類型。',
        },
        {
          title: '伺服器讀取像素',
          description: 'JPEG 的尺寸取自檔頭；其他格式會被解碼並平面化為 RGB。',
        },
        {
          title: '組合出一頁 PDF',
          description: '目錄、頁面、圖片 XObject，以及一個將圖片繪製為填滿整頁的內容資料流。',
        },
        {
          title: '下載 converted.pdf',
          description: '在保留期限到期前，從工作輸出資料夾提供下載。',
        },
      ],
      advancedDetails: [
        '建構器是 pdf_tools.go 中的 imageToPDFBytes。以 JPEG 標記 FF D8 FF 開頭的檔案會以 /DCTDecode 搭配 /DeviceRGB 或 /DeviceGray 嵌入；CMYK JPEG 則會改走解碼並平面化的路徑，因此 PDF 絕不會帶有 CMYK 資料流。',
        '非 JPEG 的輸入會以 Go 的圖片編解碼器解碼（已註冊 PNG 與 GIF）。每個像素都會以 Alpha 合成到白色上並寫成三個位元組，接著整個緩衝區以 zlib 壓縮，並以每個色彩分量 8 位元的 /FlateDecode 儲存。',
        'WebP 及其他 Go 無法解碼的格式，會先由 ImageMagick 以 -auto-orient 點陣化為記憶體中的 PNG 資料流，再將該 PNG 平面化並嵌入。',
        '以點為單位的頁面尺寸為寬度 × 72 / 96 與高度 × 72 / 96，因此 1200 × 1600 的圖片會產生 900 × 1200 點的頁面（12.5 × 16.7 英吋）。PDF 檢視器會縮放頁面以符合視窗，印表機則會縮放以符合紙張，所以大頁面在檢視時不成問題，但列印時請設定「符合頁面大小」。',
        '快速路徑上的 JPEG 會保留其 EXIF，包括 Orientation 旗標，但 PDF 檢視器不會套用 EXIF 方向。以旋轉旗標橫向儲存的手機相片，在 PDF 中會顯示為橫躺；請先將它轉換為 JPG 一次（會自動轉正），再轉換為 PDF。',
        '表單送出的品質值會被接受，但在此路徑上不會使用；也沒有多圖模式：一次上傳只會產生一份單頁 PDF。',
      ],
      whyItMatters: [
        '簽證、大學與人資系統的入口網站常常只接受 PDF，即使只是一張收據的相片。',
        'PDF 在每台裝置上列印與預覽的效果都一樣，而單純的圖片可能會被檢視器旋轉或縮放。',
        '原封不動地嵌入 JPEG，代表這份 PDF 具有校樣等級的品質：轉入過程中沒有任何內容被重新編碼。',
      ],
      useCases: [
        {
          title: '收據與表單',
          description: '把已簽名頁面的手機相片變成入口網站會接受的 PDF。',
        },
        {
          title: '身分證件與文件上傳',
          description: '以表單要求的 PDF 格式提交掃描的卡片或證書。',
        },
        {
          title: '作品校樣',
          description: '寄給客戶一份由 PNG 設計稿製成、透明部分已平面化為白色的 PDF。',
        },
        {
          title: '封存',
          description: '將相片與其他文件以同一種格式保存在一起。',
        },
      ],
      workedExamples: [
        {
          title: '一張 3024 × 4032 的手機 JPEG（2.9 MB）',
          body: '輸入：一張 2.9 MB 的 JPEG，寬 3024、高 4032，RGB。系統讀取檔頭取得尺寸，並以 /DCTDecode 將 JPEG 資料流原樣嵌入。頁面寬 3024 × 0.75 = 2268 點、高 4032 × 0.75 = 3024 點，也就是 31.5 × 42 英吋。由於沒有任何重新編碼，PDF 大小約為 2.9 MB，再加上不到一 KB 的 PDF 結構。工作內容只是讀取檔案再寫出，因此速度受限於磁碟與上傳速度而非 CPU，幾秒內就能完成。',
        },
        {
          title: '一張透明背景的 1920 × 1080 PNG',
          body: '輸入：一張 1.4 MB 的 PNG，內容是透明背景上的標誌。PNG 會被解碼，每個像素都合成到白色上，接著 1920 × 1080 × 3 = 6,220,800 位元組的 RGB 資料以 zlib 壓縮，並以 /FlateDecode 儲存。頁面為 1440 × 810 點（20 × 11.25 英吋）。由於純白與單色在 zlib 下壓縮效果很好，PDF 大小通常與 PNG 相近，有時會更大，因為單純的 zlib 缺少 PNG 所用的列篩選器。解碼、合成兩百萬個像素並加以壓縮屬於 CPU 工作，需要幾秒鐘；結果中的透明度是依設計被移除的。',
        },
      ],
      whenNotToUse: '這個工具不適合多頁文件：它只會用一張圖片製作恰好一頁，因此一組掃描檔需要逐頁轉換，再於 PDF 編輯器中合併。當透明度必須保留時請不要使用，因為每個像素都會被平面化到白色上。也別期待檔案會變小：JPEG 會原封不動地嵌入，PNG 則會變成 zlib 壓縮的 RGB，所以如果在意大小，請先壓縮或調整圖片尺寸。此外，如果相片的正確方向只記錄在 EXIF 旗標中，請事先將它轉換為 JPG 一次，否則 PDF 會依儲存時的方向顯示。',
      whyMediaManipulator: [
        'JPEG 直通是刻意的設計：你的相片不經重新編碼就會嵌入，這是許多轉換器無法保證的。',
        '處理路徑上沒有 Ghostscript，也沒有 ImageMagick 的 PDF 政策，因此轉換不依賴可能拒絕 PDF 的伺服器端安全性設定。',
        '標準工具免費，無需帳號。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ],
      privacyNote: '圖片儲存在我們自己伺服器上的 uploads/<jobId>/ 之下，PDF 則儲存在 outputs/<jobId>/converted.pdf；兩者會在保留期限結束時一起刪除。由於資料流是逐字複製的，JPEG 會在 PDF 中保留其所有內嵌中繼資料，因此任何擷取出圖片的人都能讀取 EXIF 位置與相機標籤；如果這對你很重要，請先用 EXIF 移除工具清除。PNG 及其他輸入會被解碼為原始像素，因此不會帶入任何標籤。上傳的檔案本身是圖片，所以也會經過在我們伺服器上執行的自動視覺模型分析，其摘要會與工作一起保存。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      faq: [
        {
          question: '圖片轉 PDF 是免費的嗎？',
          answer: '標準工具是免費的。每次轉換會消耗一次每日一般工作額度：訪客每天 5 次、單檔上限 200 MB；免費帳號每天 30 次、上限 1 GB；Premium 或 Pro 則為 300 或 700 次。以上皆為預設值，並列在 /pricing。',
        },
        {
          question: '相片在 PDF 中會被重新壓縮嗎？',
          answer: '如果是 JPEG 就不會：原始位元組會以 /DCTDecode 嵌入。PNG、GIF 與 WebP 會在平面化後以 zlib 壓縮的 RGB 無損儲存，所以同樣不會損失任何品質。',
        },
        {
          question: 'PDF 的頁面尺寸是多少？',
          answer: '頁面依每英吋 96 像素對應圖片，因此以點為單位的寬度與高度是像素尺寸的 0.75 倍。1200 × 1600 的圖片會產生 12.5 × 16.7 英吋的頁面；檢視器與印表機會將它縮放以符合尺寸。',
        },
        {
          question: '可以把多張圖片合併成一份 PDF 嗎？',
          answer: '本頁無法。每次上傳都會產生一份單頁 PDF。請逐一轉換每張圖片，再於 PDF 編輯器中合併產生的 PDF。',
        },
        {
          question: '透明度會怎樣？',
          answer: '會被平面化到白色上。此路徑上的 PDF 圖片 XObject 沒有 Alpha，因此透明像素會變成白色像素。',
        },
        {
          question: '為什麼我的手機相片在 PDF 中是橫躺的？',
          answer: '手機常以橫向儲存像素，並設定 EXIF Orientation 旗標。JPEG 會原封不動地嵌入，而 PDF 檢視器會忽略這個旗標。請先用圖片轉換器將相片轉為 JPG（會套用自動轉正），再將結果轉換為 PDF。',
        },
        {
          question: 'PDF 會保留我的 EXIF 資料嗎？',
          answer: '若是 JPEG，會保留，因為包含 EXIF 的整個 JPEG 資料流都在 PDF 內。如果你不想保留，請先使用 EXIF 移除工具。若是 PNG 及其他輸入，則只會保留像素。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '輸出為單頁 PDF。由於 PDF 頁面不透明，透明部分會被平面化到白色上。',
        ],
      },
      related: [
        {
          label: 'PDF 轉 JPG',
          to: '/tools/pdf-to-jpg',
          description: '將 PDF 頁面轉譯回圖片。',
        },
        {
          label: '移除 EXIF 中繼資料',
          to: '/tools/remove-exif-metadata',
          description: '在標籤嵌入 PDF 之前先清除。',
        },
        {
          label: '壓縮圖片',
          to: '/tools/compress-image',
          description: '先縮小 JPEG，因為 PDF 會原樣嵌入它。',
        },
        {
          label: 'AI 文件掃描',
          to: '/tools/ai-document-scan',
          description: '對拍攝的頁面進行清理與 OCR，而不只是包裝起來。',
        },
        {
          label: '圖片尺寸調整',
          to: '/tools/image-resizer',
          description: '先設定像素尺寸，也就連帶決定了頁面尺寸。',
        },
      ],
      embed: {
        title: '將圖片轉換為 PDF',
        description: '上傳任何圖片，例如 JPG、PNG 等。此工具的輸出已鎖定為 PDF，你會得到一份以原生解析度包裝圖片的單頁 PDF。',
      },
    },
    'pdf-to-jpg': {
      name: 'PDF 轉 JPG',
      h1: '線上免費將 PDF 轉換為 JPG',
      tagline: '將 PDF 的每一頁轉為高品質 JPG 圖片，方便分享、編輯或發布。',
      metaTitle: '線上免費將 PDF 轉換為 JPG | Media Manipulator',
      metaDescription: '免費線上 PDF 轉 JPG 工具。將 PDF 的每一頁轉為高品質 JPG 圖片，並以 ZIP 下載。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 PDF 轉換為 JPG',
      ogDescription: '將 PDF 的每一頁轉譯為高品質 JPG 圖片。免費、快速，無需註冊。',
      intro: '上傳 PDF 後，我們的伺服器會使用 Poppler 工具組中的 pdftoppm 轉譯每一頁，許多桌面 PDF 檢視器也使用同樣的點陣化引擎。本頁的表單預設為 JPG、所有頁面與 150 DPI；你可以將 DPI 改為 100、200 或 300，將工作限制為只處理第一頁，並設定 JPEG 品質（預設為 90）。選擇所有頁面時，你會得到一個包含 page-001.jpg、page-002.jpg 等檔案的 ZIP；選擇僅第一頁時，你會得到單一 JPG。轉譯前，pdfinfo 會先計算頁數，若超過 500 頁，工作就會被拒絕。',
      whatItDoes: [
        '以你選擇的解析度，將每一頁（或僅第一頁）點陣化為 JPG。',
        '將多頁輸出打包成一個 ZIP，檔名補零、可依序排列。',
        '每一頁都使用你設定的 JPEG 品質（預設為 90）。',
        '先讀取頁數，讓過大的文件在任何轉譯開始前就失敗。',
        'PDF 不會送進自動圖片分析，該分析只會對圖片、影片與音訊上傳執行。',
      ],
      flowSteps: [
        {
          title: '上傳 PDF',
          description: '任何不超過你單檔上限的 .pdf；頁數必須在 500 頁以內。',
        },
        {
          title: '選擇頁面、DPI 與品質',
          description: '所有頁面或僅第一頁；100、150、200 或 300 DPI；JPEG 品質 1 到 100。',
        },
        {
          title: 'pdftoppm 轉譯',
          description: 'pdftoppm -r <dpi> -jpeg -jpegopt quality=<q> [-f 1 -l 1] input page',
        },
        {
          title: '下載',
          description: '單頁為 converted.jpg，所有頁面則為 converted.zip。',
        },
      ],
      advancedDetails: [
        '轉譯器是 pdf_tools.go 中的 convertPDFToImages。它會呼叫 pdfinfo 取得頁數，拒絕超過 500 頁的文件，然後執行 pdftoppm：以 -r 指定 DPI，以 -jpeg 與 -jpegopt quality=N 輸出 JPG，只需要第一頁時再加上 -f 1 -l 1。',
        '無論表單送出什麼值，伺服器都會將 DPI 限制在 50 到 400 之間，品質限制在 1 到 100 之間；表單本身提供 100、150、200 與 300。',
        'pdftoppm 每頁寫出一個檔案；伺服器會將它們重新命名為 page-001.jpg、page-002.jpg 等（三位數、補零）並壓縮成 ZIP，因此在任何檔案管理員中都會依頁碼順序排列。',
        '像素尺寸直接由 DPI 決定：US Letter 頁面（8.5 × 11 英吋）在 150 DPI 下為 1275 × 1650 像素，在 300 DPI 下為 2550 × 3300；A4 頁面（8.27 × 11.69 英吋）在 150 DPI 下為 1240 × 1754，在 300 DPI 下為 2480 × 3508。',
        '本身就是掃描檔的 PDF 會被重新點陣化：如果嵌入的掃描檔是 300 DPI，而你以 150 轉譯，每頁輸出的線性解析度就只有掃描檔的一半。選擇 300 即可保留掃描檔原有的解析度。',
        '這個工具的 PNG 版本使用相同的轉譯器，搭配 -png 且沒有品質選項；相片或掃描頁面適合用 JPG，而文字銳利、色塊平坦、容易顯露 JPEG 振鈴瑕疵的頁面則適合用 PNG。',
      ],
      whyItMatters: [
        '許多工具與平台接受圖片卻不接受 PDF：簡報、社群貼文、聊天應用程式與圖片編輯器都是如此。',
        '轉譯出的頁面忠實呈現版面、字型與向量圖形，不需要嵌入或重新排版任何內容。',
        '自行選擇 DPI，代表由你決定要快速預覽還是列印解析度的匯出。',
      ],
      useCases: [
        {
          title: '簡報與社群貼文',
          description: '將報告頁面或海報轉譯為可以發布或放進簡報的圖片。',
        },
        {
          title: '縮圖與預覽',
          description: '只以 100 DPI 轉譯第一頁作為封面圖。',
        },
        {
          title: '在編輯器中標註',
          description: '在圖片編輯器中開啟頁面，進行註解、遮蓋或裁切。',
        },
        {
          title: '擷取掃描頁',
          description: '以原始解析度將 PDF 中的每一頁掃描檔重新取出為獨立的 JPG。',
        },
      ],
      workedExamples: [
        {
          title: '一份 12 頁的 A4 報告，所有頁面以 150 DPI 轉譯',
          body: '輸入：一份 12 頁、1.8 MB 的 A4 PDF，包含文字與幾張圖表。設定維持預設：JPG、所有頁面、150 DPI、品質 90。pdfinfo 回報 12 頁，低於 500 頁的上限，pdftoppm 以 -r 150 -jpeg -jpegopt quality=90 執行。每頁以寬 8.27 × 150、高 11.69 × 150 轉譯，也就是 1240 × 1754 像素（2.2 百萬像素）。這十二個檔案會重新命名為 page-001.jpg 到 page-012.jpg，並壓縮成 converted.zip。轉譯以頁為單位，耗時主要取決於每頁有多少向量內容與文字；十來頁的文字頁面總共只需要幾秒。每頁 JPEG 的大小取決於內容：以白底文字為主的頁面，壓縮效果遠優於滿版圖表。',
        },
        {
          title: '一份 US Letter 掃描檔，僅第一頁以 300 DPI 轉譯',
          body: '輸入：一份 40 頁、Letter 尺寸、28 MB 的掃描合約。選擇僅第一頁與 300 DPI，品質維持 90。伺服器執行 pdftoppm -r 300 -jpeg -jpegopt quality=90 -f 1 -l 1，因此只會點陣化一頁，尺寸為寬 8.5 × 300、高 11 × 300 = 2550 × 3300 像素（8.4 百萬像素）。輸出是單一的 converted.jpg，而不是 ZIP。轉譯一頁掃描頁很快，因為該頁只是一張嵌入的圖片；上傳 28 MB 所花的時間比轉譯還長。若以 150 DPI 轉譯，同一頁會是 1275 × 1650，像素只有四分之一，足以在螢幕上閱讀，但不足以重新列印掃描檔。',
        },
      ],
      whenNotToUse: '當你需要文字保持可選取或可搜尋時，請不要將 PDF 轉譯為 JPG：結果只是像素，螢幕閱讀器或搜尋索引什麼也讀不到。如果頁面以銳利文字與線條圖為主，而你又會放大檢視，請不要使用 JPG，因為 JPEG 壓縮會在邊緣周圍留下淡淡的振鈴瑕疵；PNG 版本在這方面更乾淨。超過 500 頁的文件會直接被拒絕，而在長文件上使用很高的 DPI 會產生很大的 ZIP，所以請只轉譯你真正需要的頁面。此外，如果目標是編輯 PDF 內容而不是把它轉成圖片，PDF 編輯器才是合適的工具。',
      whyMediaManipulator: [
        '以 Poppler 轉譯，並開放真正的 DPI 與品質控制，而不是固定的預覽尺寸。',
        '單一 ZIP，檔名附頁碼，不必下載一大堆檔案。',
        '標準工具無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ],
      privacyNote: '你的 PDF 會儲存在我們伺服器上的 uploads/<jobId>/ 之下，轉譯出的 JPG 或其 ZIP 則儲存在 outputs/<jobId>/ 之下；頁面會先轉譯到輸出資料夾內的暫存目錄，ZIP 一寫入完成就會將其移除。PDF 上傳會被偵測為文件，不會送進圖片、影片與音訊上傳所經過的自動視覺分析。Poppler 完全在我們的機器上執行，不會將任何頁面傳送到外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      faq: [
        {
          question: 'PDF 轉 JPG 是免費的嗎？',
          answer: '標準工具是免費的。一份 PDF 無論有多少頁，都只算一次一般工作：訪客每天 5 次、單檔上限 200 MB；免費帳號每天 30 次、上限 1 GB；Premium 為 300 次，Pro 為 700 次。以上皆為預設值，並顯示在 /pricing。',
        },
        {
          question: '我會得到幾張圖片？',
          answer: '選擇所有頁面時，每頁一張，以 converted.zip 提供，檔名從 page-001.jpg 開始依序編號。選擇僅第一頁時，你會得到一個 converted.jpg，沒有 ZIP。',
        },
        {
          question: '我該選擇哪個 DPI？',
          answer: '在螢幕上閱讀與分享請選 150（A4 為 1240 × 1754）。列印或以 300 製作的掃描檔請選 300（A4 為 2480 × 3508）。小型預覽請選 100。伺服器接受 50 到 400。',
        },
        {
          question: '品質設定有什麼作用？',
          answer: '它會以 -jpegopt quality=N 的形式傳給 pdftoppm，採用標準的 JPEG 品質刻度。預設為 90；若相片較多的頁面想要更小的檔案，可以調低。',
        },
        {
          question: '有頁數限制嗎？',
          answer: '有，500 頁。pdfinfo 會在轉譯開始前計算頁數，較長的文件會被拒絕，並顯示說明頁數與上限的訊息，同時退還該次操作的額度。',
        },
        {
          question: '圖片中的文字可以搜尋嗎？',
          answer: '不行。輸出是每一頁的點陣圖片。如果你需要文字，請保留 PDF，或使用 AI 文件掃描工具，它會對拍攝的頁面執行 OCR。',
        },
        {
          question: '可以改輸出 PNG 而不是 JPG 嗎？',
          answer: '本頁將格式鎖定為 JPG。同一個轉譯器可透過「PDF 轉 PNG」頁面產生 PNG，該頁使用 -png，且沒有品質設定。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '所有頁面的輸出以 .zip 提供；僅第一頁的輸出則是單一 .jpg。',
          '預設轉譯解析度為 150 DPI；若需要列印品質的輸出，請調高。',
        ],
      },
      related: [
        {
          label: '圖片轉 PDF',
          to: '/tools/image-to-pdf',
          description: '反向轉換：將圖片包裝成 PDF 頁面。',
        },
        {
          label: '壓縮圖片',
          to: '/tools/compress-image',
          description: '為網頁縮小轉譯出的 JPG。',
        },
        {
          label: '圖片尺寸調整',
          to: '/tools/image-resizer',
          description: '將轉譯出的頁面縮放為縮圖或橫幅尺寸。',
        },
        {
          label: 'AI 文件掃描',
          to: '/tools/ai-document-scan',
          description: '對拍攝的頁面進行 OCR 與清理。',
        },
        {
          label: '遮蓋圖片中的文字',
          to: '/tools/redact-text-in-image',
          description: '塗黑轉譯頁面上的姓名或號碼。',
        },
      ],
      embed: {
        title: '將 PDF 轉換為 JPG',
        description: '上傳 PDF，每一頁都會轉譯為 JPG 圖片。選擇「所有頁面」可取得圖片 ZIP，選擇「僅第一頁」則取得單一 JPG。選擇轉譯 DPI 可獲得更清晰的輸出。',
      },
    },
    'compress-video': {
      name: '壓縮影片',
      h1: '線上壓縮影片，不犧牲畫質',
      tagline: '縮小 MP4、WebM、MOV、MKV 和 AVI 檔案大小，適用於網頁、電子郵件、社群媒體和雲端上傳。',
      metaTitle: '線上壓縮影片（免費） | Media Manipulator',
      metaDescription: '免費線上影片壓縮工具。在維持良好畫質的同時縮小 MP4、WebM、MOV、MKV 和 AVI 檔案大小。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上壓縮影片，不犧牲畫質',
      ogDescription: '縮小 MP4、WebM、MOV 與 AVI 影片檔案以用於網頁，同時保有值得觀看的畫質。',
      intro: '影片檔案之所以龐大，是因為它的位元率：編碼器為每秒畫面花了多少位元。手機與螢幕錄影軟體花得很大方，這就是為什麼一段短短的 1080p 片段可能有數十甚至數百 MB。本頁開啟的是只有三個控制項的壓縮器，而不是完整的轉換器：壓縮等級、輸出容器，以及可選的解析度與編解碼器。在我們的伺服器上，這項工作就是一條 FFmpeg 指令：以等級對應的固定品質設定（CRF）重新編碼畫面，將音訊重新編碼為 AAC 或 Opus，並把索引寫在檔案開頭，讓檔案在完全下載前就能開始播放。',
      whatItDoes: [
        '以固定品質等級而非固定位元率重新編碼影片：「最小檔案」為 CRF 31，「均衡」為 CRF 26，「高品質」為 CRF 22。',
        '輸出 MP4（預設為 H.264，或在你選擇時使用 H.265/HEVC）或 WebM（VP9 搭配 Opus 音訊）。',
        '可選擇在同一次處理中將畫面縮小到 1080p、720p 或 480p，同時維持長寬比。',
        '可選擇完全移除音軌，以取得最小的檔案。',
        '接受 MP4、MOV、M4V、WebM、MKV、AVI、FLV、WMV、MPEG 與 MPG 上傳；ProRes 及其他剪輯用格式則由完整轉換器頁面處理。',
      ],
      flowSteps: [
        {
          title: '上傳影片',
          description: '瀏覽器會將檔案直接放進我們的儲存空間，再請 API 開始工作。',
        },
        {
          title: '選擇等級',
          description: '預設選取「均衡」。「最小檔案」以可見的細節換取更小的檔案；「高品質」則保留更多細節。',
        },
        {
          title: '視需要變更格式、解析度或編解碼器',
          description: '使用 H.264 的 MP4 到處都能播放；在能解碼的裝置上，H.265 與 WebM 的檔案更小。',
        },
        {
          title: 'FFmpeg 重新編碼',
          description: '以你所選等級的 CRF 執行 libx264、libx265 或 libvpx-vp9，再加上 AAC 或 Opus 音訊，MP4 還會套用 faststart。',
        },
        {
          title: '下載較小的檔案',
          description: '結果會保留在工作資料夾中，直到保留期限結束。',
        },
      ],
      advancedDetails: [
        'MP4 的確切指令是 ffmpeg -i input [-vf scale=-1:H] -c:v libx264 -crf N -pix_fmt yuv420p -movflags +faststart -c:a aac output.mp4，其中 N 對應三個等級分別為 31、26 或 22（見 converter.go 中的 buildVideoCodecArgs 與 videoCRF）。由於沒有傳入編碼器速度預設組，libx264 會以其預設值 medium 執行。',
        '選擇 H.265 時，編碼器會換成 libx265，並加上 -tag:v hvc1，這是 QuickTime 與 Safari 辨識 MP4 中 HEVC 所需的標籤。較舊的 Android 手機、智慧電視與許多網頁播放器完全無法解碼 H.265。',
        'WebM 輸出會以 -b:v 0 -crf N 執行 libvpx-vp9，並搭配 Opus 音訊；如果伺服器的 FFmpeg 建置缺少 VP9 或 Opus，會退回使用 VP8 與 Vorbis。傳入的 N 相同，但 VP9 的 CRF 範圍是 0 到 63，所以 26 在那裡是相對較高的品質設定。',
        '解析度選項會變成 scale=-1:1080、scale=-1:720 或 scale=-1:480：高度固定，寬度依來源長寬比計算。高度會照原樣套用，因此對 720p 來源選擇 1080p 會將其放大，使檔案變大而不是變小；請選擇等於或低於來源的高度。',
        '「移除音軌」會加上 -an。否則，音訊會由 FFmpeg 內建的 AAC 編碼器以預設位元率重新編碼（未傳入 -b:a；立體聲通常約 128 kbps），在任何等級下都只占檔案的一小部分。',
        '壓縮以 CRF 驅動，因此輸出大小取決於內容：靜態投影片比彩帶或水面更容易壓縮。在開始任何編碼之前，伺服器會驗證 CRF 介於 0 到 51 之間，且壓縮等級是三個名稱之一。',
        '上傳的檔案也會排入每次標準轉換都會進行的自動內容分析：取樣影格由本機視覺模型描述，音訊則在我們自己的硬體上轉錄。分析結果與工作一起儲存，不會分享。',
      ],
      whyItMatters: [
        '聊天應用程式、郵件伺服器與學習平台都會以 MB 為單位設定上限，而以原生位元率錄製的手機片段很容易超過。',
        '自動播放 60 MB 背景影片的頁面，在行動網路上會卡住；同一段片段以 CRF 26 壓縮後只剩一小部分。',
        '儲存與頻寬費用隨位元組數增加，所以為很少開啟的原始檔保留壓縮副本，能很快省下可觀的費用。',
      ],
      useCases: [
        {
          title: '電子郵件與聊天',
          description: '讓 1 分鐘的手機錄影低於 25 MB 或 100 MB 的限制，不必另外建立分享連結。',
        },
        {
          title: '網站主視覺與背景循環影片',
          description: '編碼出頁面可自動播放、不需長時間緩衝的 WebM 或 H.264 MP4。',
        },
        {
          title: '課程與會議錄影',
          description: '縮小螢幕錄影；其中靜態的投影片在任何 CRF 下都能壓縮得非常好。',
        },
        {
          title: '封存副本',
          description: '為長篇原始檔保留一份 720p「均衡」副本，並把母帶移到冷儲存。',
        },
      ],
      workedExamples: [
        {
          title: '以「均衡」壓縮 48 MB、30 秒的 1080p 手機片段',
          body: '輸入：手機拍攝的 30 秒 MP4，1920 x 1080，48 MB，換算約 12.8 Mbps。設定：「均衡」、MP4、H.264、保留解析度、保留音訊。伺服器以 CRF 26 搭配 yuv420p 與 faststart 執行 libx264，並將音訊重新編碼為 128 kbps 的 AAC，因此光是音軌就占結果中的約 0.5 MB（128 kbps x 30 s）。其餘全由畫面決定：CRF 26 會先捨棄細微顆粒與雜訊，所以穩定的手持鏡頭輸出後只有 12.8 Mbps 來源的一小部分，而快速動作或大量相機雜訊則縮小得較少。編碼是以預設 medium 預設組對 900 格 1080p 畫面進行單次處理；在我們的伺服器上這是很短的工作，等待時間通常主要花在上傳 48 MB 上。',
        },
        {
          title: '以「最小檔案」將 160 MB、60 秒的 4K 片段壓縮為 720p H.265',
          body: '輸入：60 秒、3840 x 2160、160 MB 的 MP4，約 21 Mbps，在訪客 200 MB 的上限之內。設定：「最小檔案」、MP4、編解碼器 H.265、解析度 720p、移除音訊。FFmpeg 套用 scale=-1:720，產生 1280 x 720：每格 0.92 百萬像素，而來源為 8.3，在編解碼器開始工作前像素就只剩約九分之一。接著 libx265 以 CRF 31 搭配 -tag:v hvc1 執行，-an 則移除音訊。像素少了九倍、更有效率的編解碼器，加上較高的 CRF，三者結合正是最大縮減幅度的來源，所以預期結果只有幾 MB，而不是數十 MB。時間主要花在解碼 4K 影格與 libx265 上，在相同預設組下它明顯比 libx264 慢，因此即使輸出較小，這項工作也比 1080p 的範例花更久。',
        },
      ],
      whenNotToUse: '不要壓縮你還打算剪輯或調色的檔案；每次重新編碼都會損失細節，剪輯軟體需要的是原始檔，或是由完整轉換器產生的 ProRes 中介檔。如果片段無法在某個裝置上播放的原因是容器而不是大小，也不要用它來解決；影片轉換器可以在不降低畫質的情況下轉換格式。如果你唯一的目標是剪出一段，裁剪工具會直接複製串流而不重新編碼，既更快又無損。另外，如果檔案大是因為片長很長，壓縮的效果會不如你預期；以 CRF 26 壓縮的 20 分鐘錄影，依然是 20 分鐘的錄影。',
      whyMediaManipulator: [
        '每個等級背後的 CRF 都寫在本頁上，所以在等待之前，你就能預測「最小檔案」會對細節豐富的畫面造成什麼影響。',
        'MP4 中的 H.265 會加上 Apple 播放器所需的 hvc1 標籤，許多線上壓縮工具都忘了這一點。',
        '編碼在我們自己的伺服器上以 FFmpeg 執行；不會交給任何外部處理服務，也不會加上浮水印。',
        '一次壓縮計為每日一般工作次數中的一次：預設情況下，沒有帳號每天 5 次，免費帳號每天 30 次。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。',
      ],
      privacyNote: '壓縮器會在我們自己的伺服器上以 FFmpeg 重新編碼你的影片。上傳的檔案儲存在 uploads/<jobId>/ 下，壓縮後的檔案則在 outputs/<jobId>/ 下；兩者都登記在保留記錄中，並在期限結束時刪除。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。由於這是標準轉換，上傳的檔案也會在同一套硬體上經過我們的自動內容分析（取樣影格由本機視覺模型描述，音訊在本機轉錄）；該報告與工作一起保存，不會分享給第三方。除非你選擇移除，容器中繼資料會保留；不會傳送任何資料給外部 AI 或處理服務供應商。',
      faq: [
        {
          question: '壓縮會讓我的影片變難看嗎？',
          answer: '重新編碼一定會損失一些細節。在「高品質」（CRF 22）與「均衡」（CRF 26）下，損失主要是大多數觀眾不會注意到的細微顆粒與雜訊；在「最小檔案」（CRF 31）下，細節豐富的畫面會出現看得見的模糊。保留原解析度可以避免縮小所帶來的模糊。',
        },
        {
          question: '我該選 H.264、H.265 還是 WebM？',
          answer: 'H.264 MP4 在任何裝置上都能播放，包括舊電視與公司筆電。H.265 在相同 CRF 下檔案更小，但需要能解碼 HEVC 的裝置；我們會標記 hvc1，讓 Apple 播放器接受它。WebM（VP9 與 Opus）則適合由你掌控播放器的網頁。',
        },
        {
          question: '檔案會變小多少？',
          answer: '取決於來源位元率與內容。12 Mbps 的手機片段有很大的空間，在 CRF 26 下會大幅縮小；本來就以適中位元率編碼的檔案則縮小得不多，因為 CRF 只花畫面需要的位元。降到 720p 與移除音訊一定有幫助。',
        },
        {
          question: '壓縮器會加浮水印或改變影格率嗎？',
          answer: '不會。影格率、長度與長寬比都會保留，畫面上也不會加上任何東西。只有編解碼器、CRF、可選的高度與可選的音訊移除會改變。',
        },
        {
          question: '壓縮影片免費嗎？有哪些限制？',
          answer: '預設情況下，訪客每天有 5 次一般工作，檔案最大 200 MB、影片最長 5 分鐘，輸出最高 1080p；免費帳號可提高到每天 30 次、1 GB 與 20 分鐘。失敗的壓縮會退還額度。目前的數字列在價格頁面上。',
        },
        {
          question: '為什麼輸出沒有比原檔小？',
          answer: '來源可能已經壓縮得很有效率，或者以其解析度而言位元率已經很低。若不降低等級，CRF 無法低於畫面所需。請試試「最小檔案」、降低解析度，或切換為 H.265。',
        },
        {
          question: '我可以壓縮沒有音訊的影片，或讓原本的音訊保持不變嗎？',
          answer: '沒有聲音的來源會維持沒有聲音。在本頁，保留的音軌一律會重新編碼為 AAC（MP4）或 Opus（WebM）；要設定明確的音訊位元率，請使用完整的影片轉換器。',
        },
      ],
      related: [
        {
          label: '裁剪影片',
          to: '/tools/video-trimmer',
          description: '先剪短片段，壓縮器要編碼的內容就更少。',
        },
        {
          label: '將影片轉換為動態 GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: '對只有幾秒的片段來說，GIF 是能直接內嵌播放的格式。',
        },
        {
          label: '轉碼為 HLS',
          to: '/tools/transcode-to-hls',
          description: '將影片封裝成自適應串流，而不是單一檔案。',
        },
        {
          label: '從影片擷取音訊',
          to: '/tools/extract-audio-from-video',
          description: '只保留音軌，存成 MP3、WAV 或 FLAC。',
        },
        {
          label: '影片轉錄',
          to: '/tools/transcribe-video',
          description: '在壓縮之前或之後，將語音轉為文字。',
        },
        {
          label: '影片轉換器教學',
          to: '/tutorials/video/getting-started',
          description: '逐步說明每一個影片選項。',
        },
      ],
      embed: {
        title: '壓縮影片',
        description: '上傳影片，並選擇較小的品質預設組或較低的位元率。保留相同的編解碼器可最快得到結果，或切換為 WebM/H.265，在新型裝置上取得更小的檔案。保留相同的解析度可得到最自然的效果。',
      },
    },
    'video-trimmer': {
      name: '影片裁剪',
      h1: '線上免費裁剪影片',
      tagline: '透過快速且保持畫質的裁剪，把片段剪成你想要的部分，盡可能不重新編碼。',
      metaTitle: '線上免費裁剪影片 | Media Manipulator',
      metaDescription: '免費線上影片裁剪工具。設定開始和結束時間，透過快速無損的裁剪剪出片段。輸出 MP4，無浮水印，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費裁剪影片',
      ogDescription: '透過快速且保持畫質的切割，把影片裁剪成你想要的部分。免費，無浮水印。',
      intro: '裁剪會保留影片中的一段，並捨棄其餘部分。大多數線上裁剪工具會為此重新編碼整個片段，既慢又損失畫質。本頁預設採用更簡單的做法：讓 FFmpeg 跳到你的開始時間，並在不解碼的情況下，將所要求長度內的壓縮影片與音訊封包複製到新檔案。這就是串流複製，它是無損的，速度幾乎和讀取檔案一樣快。如果無法複製，例如你選擇的容器不允許來源編解碼器，或是你勾選了精確到影格的選項，伺服器就會改為只重新編碼選取的那一段。',
      whatItDoes: [
        '從影片中剪出單一範圍，從開始時間到結束時間，可以用秒數輸入，或在視覺化時間軸上選取。',
        '只要輸出容器接受來源編解碼器，就直接複製串流而不重新編碼，所以保留的部分與原始檔逐位元完全相同。',
        '當複製遭拒時會自動退回重新編碼，你也可以強制重新編碼，以便精確地在指定影格切割。',
        '預設輸出 MP4，也可選擇 MOV 或 WebM；MP4 和 MOV 會加上 faststart 旗標，讓播放在下載完成前就能開始。',
        '使用 ffprobe 檢查檔案是否確實含有影片串流，並以清楚的訊息拒絕只有音訊的上傳。',
      ],
      flowSteps: [
        {
          title: '上傳影片',
          description: 'MP4、MOV、M4V、WebM、MKV、AVI、FLV、WMV、MPEG 或 MPG，直接上傳到我們的儲存貯體。',
        },
        {
          title: '設定開始與結束',
          description: '輸入秒數或拖曳兩個控點；面板會顯示產生的片段長度。',
        },
        {
          title: '選擇容器，必要時選擇精確到影格',
          description: '已預設為 MP4。只有在精確影格很重要時，才勾選「重新編碼以精確到影格」。',
        },
        {
          title: 'FFmpeg 進行切割',
          description: '使用 -ss、-t 和 -c copy 進行串流複製；當無法複製或你要求時，則以 libx264 CRF 18 重新編碼。',
        },
        {
          title: '下載片段',
          description: '輸出檔案帶有 _trimmed 後綴，並保存在工作資料夾中，直到保留期限結束。',
        },
      ],
      advancedDetails: [
        '串流複製的指令是 ffmpeg -ss START -i input -t DURATION -map 0 -c copy -avoid_negative_ts make_zero [-movflags +faststart] output（位於 specialized_tools.go 的 runTrimVideo）。-map 0 會保留每一條串流，包括額外的音軌和字幕，時間以毫秒精度寫入。',
        '由於 -ss 放在 -i 之前且不進行解碼，FFmpeg 只能從關鍵影格開始，所以複製會從你的開始時間當下或之前最近的關鍵影格開始。在手機錄影中，關鍵影格通常相隔 1 到 2 秒，這就是開頭最多可能偏移的幅度；接著 -avoid_negative_ts make_zero 會重新設定時間戳記的基準，讓播放器能乾淨地開始播放。',
        '重新編碼路徑使用 buildVideoCodecArgs 的高品質設定：MP4 和 MOV 使用 libx264 -crf 18 -pix_fmt yuv420p 搭配 AAC，WebM 則使用 libvpx-vp9 -b:v 0 -crf 18 搭配 Opus。只會對應第一條影片串流和第一條音訊串流（如果有），所以在這條路徑上，額外的軌道會被捨棄。',
        '複製模式以 auto 傳送，會先嘗試複製，失敗時再重新編碼。對 H.264 來源選擇 WebM 一定會走重新編碼路徑，因為 WebM 只接受 VP8、VP9 和 AV1 影片。',
        '伺服器端的驗證：開始時間必須為 0 或更晚，片段長度至少 0.1 秒、最多 6 小時，且結束時間必須在開始時間之後。其他任何情況都會在 FFmpeg 啟動前被拒絕，該次工作也會退還。',
        '由於裁剪是一種專門模式，上傳會略過標準轉換會進行的自動內容分析；伺服器只會執行 ffprobe 和切割。',
      ],
      whyItMatters: [
        '開頭的空白和結尾手忙腳亂的停止，幾乎出現在每一段錄影中，而移除它們是最常見的一種編輯。',
        '無損切割意味著你可以裁剪母帶檔案，而不會產生第二代副本。',
        '先切割會讓後續每個步驟都更省力：壓縮、加上字幕或把片段轉成 GIF，都只需要處理你保留的部分。',
      ],
      useCases: [
        {
          title: '會議與講座錄影',
          description: '去掉內容開始前大家陸續加入的那幾分鐘。',
        },
        {
          title: '社群貼文精華',
          description: '保留重要的 20 秒，只上傳那一段。',
        },
        {
          title: '證據與錯誤回報',
          description: '精確分享問題發生的那一刻，原始畫質完整保留。',
        },
        {
          title: '準備 GIF 或修復用的片段',
          description: '先剪到只剩幾秒鐘，再交給最適合處理短輸入的工具。',
        },
      ],
      workedExamples: [
        {
          title: '從 180 MB、4.5 分鐘的 1080p MP4 中以串流複製剪出 30 秒',
          body: '輸入：一個 4 分 30 秒、1920 x 1080 的 H.264 MP4，大小 180 MB，約 5.3 Mbps，符合訪客預設的 200 MB 和 5 分鐘上限。設定：開始 45.000、結束 75.000、輸出 MP4、未勾選重新編碼。伺服器以 -ss 45.000 和 -t 30.000 執行複製指令。由於封包是直接複製的，輸出大約包含 270 秒資料中的 30 秒，約 20 MB，品質、編解碼器和影格率都與原始檔完全相同。切割會從 45 秒之前的最後一個關鍵影格開始，所以片段可能會提早一到兩秒開始。這個工作的瓶頸在於讀取檔案，而不是運算，幾秒鐘內就能完成。',
        },
        {
          title: '從 60 MB 的 1080p MP4 中精確到影格地剪出 12 秒',
          body: '輸入：一個 2 分鐘、1920 x 1080、大小 60 MB 的 MP4。設定：開始 30.250、結束 42.250、輸出 MP4、勾選「重新編碼以精確到影格」。FFmpeg 這時會從 30.250 精確地開始解碼，以 libx264 的 CRF 18、yuv420p 和 faststart 編碼 12 秒（30 fps 下的 360 個影格），並將音訊重新編碼為 AAC。CRF 18 讓畫面在視覺上非常接近原始檔，所以結果每秒的大小與原始檔屬於同一個量級，12 秒約為幾 MB。只會編碼保留的 12 秒，絕不會編碼完整的 2 分鐘，所以這是一次短暫的編碼，而不是幾秒鐘就完成的複製。',
        },
      ],
      whenNotToUse: '不要用裁剪工具從同一部影片中移除好幾段不相連的部分；它只會保留恰好一個範圍，所以要剪掉中間的一段，需要裁剪兩次，再到 Darkroom 中合併。不要期待串流複製會精確落在指定影格上；如果提早一秒的切割會造成問題，請勾選重新編碼選項，並接受一次短暫的編碼。如果你真正的目標是更小的檔案，裁剪的幫助僅限於你剪掉的部分；壓縮工具才會改變位元率。另外，如果上傳的檔案沒有影片串流，例如被改名為 MP4 的 M4A，裁剪工具會拒絕它；只有音訊的檔案請交給音訊工具處理。',
      whyMediaManipulator: [
        '預設採用無損的串流複製，並把重新編碼的退回機制寫清楚，而不是藏在一次又慢又求保險、把全部內容都重新編碼的處理背後。',
        '本頁列出了確切的 FFmpeg 旗標，包括切割為什麼可能從前一個關鍵影格開始，以及如何避免。',
        '一次裁剪會消耗每日額度中的一次一般工作（訪客預設每天 5 次，免費帳號 30 次），失敗的工作會退還。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ],
      privacyNote: '裁剪工具會在我們自己的伺服器上執行 ffprobe 和一個 FFmpeg 指令。在預設路徑中，影片和音訊封包只會被複製，從不解碼，所以伺服器不會從你的檔案重建任何一張畫面；在重新編碼路徑中，FFmpeg 只會解碼你保留的那幾秒。上傳的檔案存放在 uploads/<jobId>/，片段存放在 outputs/<jobId>/，兩者都登記在保留紀錄中，並在期限結束時刪除。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。裁剪是一種專門模式，所以這次上傳不會進行標準轉換會進行的自動內容分析，也不會將任何內容傳送給第三方服務。',
      faq: [
        {
          question: '裁剪會重新編碼我的影片嗎？',
          answer: '預設不會。伺服器使用 -c copy 複製壓縮後的串流，所以保留的部分與原始檔完全相同。只有在你勾選精確到影格的選項，或你選擇的容器無法容納來源編解碼器時（例如為 H.264 檔案選擇 WebM），才會重新編碼。',
        },
        {
          question: '為什麼我的片段比我輸入的時間早一點開始？',
          answer: '串流複製只能從關鍵影格開始，FFmpeg 會挑選你的開始時間當下或之前最近的那一個。在攝影機拍攝的畫面中，關鍵影格通常相隔 1 到 2 秒。勾選「重新編碼以精確到影格」，即可從確切的影格開始。',
        },
        {
          question: '我可以選擇哪些輸出容器？哪些能保留原始畫質？',
          answer: 'MP4、MOV 和 WebM。MP4 和 MOV 接受大多數相機產生的 H.264 或 HEVC 影片和 AAC 音訊，所以能保持無損。WebM 只接受 VP8、VP9 和 AV1，所以選擇它時，H.264 來源會以 CRF 18 重新編碼為 VP9。',
        },
        {
          question: '裁剪後的片段最長或最短可以是多少？',
          answer: '至少 0.1 秒、最多 6 小時，且結束時間要在開始時間之後。實際上，上傳上限會先限制你：預設情況下，訪客為 5 分鐘影片，免費帳號為 20 分鐘，Premium 為 2 小時。',
        },
        {
          question: '會保留所有音軌和字幕嗎？',
          answer: '在串流複製路徑中會：-map 0 會複製檔案中的每一條串流。在重新編碼路徑中，只會保留第一條影片串流和第一條音訊串流。',
        },
        {
          question: '我可以一次把影片裁剪成多個部分嗎？',
          answer: '不行。一次上傳只會從一個範圍產生一個片段。如果需要好幾段，請針對每個範圍各執行一次裁剪工具，或在 Darkroom 的時間軸上組合這些片段。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '盡可能使用串流複製（不損失畫質）；重新編碼的退回機制對 MP4 使用 H.264 + AAC。',
        ],
      },
      related: [
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '裁剪後再縮小片段。',
        },
        {
          label: '將影片轉換為動態 GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: '把裁剪出的幾秒鐘變成 GIF。',
        },
        {
          label: '從影片擷取音訊',
          to: '/tools/extract-audio-from-video',
          description: '只儲存片段的聲音。',
        },
        {
          label: 'AI 影片修復',
          to: '/tools/ai-video-restoration',
          description: '修復功能適用於 15 秒以內的片段；請先裁剪。',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '將多段裁剪出的片段合併成一個剪輯作品。',
        },
      ],
      embed: {
        title: '裁剪影片',
        description: '上傳影片，然後設定開始和結束時間（或以視覺方式選取範圍）。只要可能，我們會以快速的無損切割保留原始畫質。',
      },
    },
    'extract-audio-from-video': {
      name: '從影片擷取音訊',
      h1: '從影片擷取音訊',
      tagline: '將任何影片的音軌儲存為乾淨的 MP3、WAV、M4A、AAC、FLAC 或 OGG 檔案。',
      metaTitle: '從影片擷取音訊：MP3、WAV、M4A 等 | Media Manipulator',
      metaDescription: '免費線上工具，可從任何影片檔案（MP4、MOV、MKV、WebM、AVI）擷取音訊。可輸出 MP3、WAV、M4A、AAC、FLAC 或 OGG。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '從影片擷取音訊',
      ogDescription: '將 MP4/MOV/MKV/WebM/AVI 的音軌儲存為 MP3、WAV、M4A、AAC、FLAC 或 OGG。免費，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      intro: '每種影片容器格式都把音訊存成獨立的串流，所以取出聲音完全不需要處理畫面。這個頁面會請 FFmpeg 選取第一條音訊串流、忽略影片，並將該串流編碼成你選擇的格式：任何能播放音樂的裝置都適用 MP3；想讓取樣完全不受改動時用 WAV 或 FLAC；想要手機原生支援的小檔案時用 M4A 或 AAC；也可以選 OGG Vorbis。開始之前，伺服器會先用 ffprobe 確認音訊串流存在，否則 FFmpeg 會毫無提示地寫出一個空檔案。',
      whatItDoes: [
        '從 MP4、MOV、M4V、WebM、MKV、AVI 及其他常見影片容器中選取第一條音訊串流（-map 0:a:0），並捨棄影片（-vn）。',
        'MP3 以 libmp3lame 品質 2 編碼（可變位元率，平均約 190 kbps），WAV 為 16 位元 PCM，M4A 或 AAC 為 192 kbps，FLAC 為無損，OGG 則以 libvorbis 品質 5 編碼。',
        '保留原始取樣率和聲道數；不會重新取樣，也不會降混。',
        '沒有音訊串流的影片會在一開始就被拒絕，並告知沒有可擷取的內容。',
        '傳回單一音訊檔案，以原始檔名加上所選的副檔名命名。',
      ],
      flowSteps: [
        {
          title: '上傳影片',
          description: '任何常見的容器格式皆可；檔案會直接進入我們的儲存貯體，再由 API 取用。',
        },
        {
          title: '選擇音訊格式',
          description: '預設為 MP3。WAV 和 FLAC 是無損格式；M4A 和 AAC 體積小巧；OGG 是開放的有損選項。',
        },
        {
          title: 'ffprobe 確認音訊串流存在',
          description: '無聲影片會在這一步停止，並顯示明確的錯誤，而不是產生空檔案。',
        },
        {
          title: 'FFmpeg 編碼串流',
          description: '一道指令，包含 -map 0:a:0 -vn 以及對應你所選格式的編碼器。',
        },
        {
          title: '下載音訊',
          description: '檔案會存放在工作資料夾中，直到保留期限結束。',
        },
      ],
      advancedDetails: [
        '指令為 ffmpeg -y -i input -map 0:a:0 -vn <encoder args> output（位於 specialized_tools.go 的 runExtractAudio）。-vn 表示影片串流從不解碼，這就是為什麼即使來源是 4K，擷取速度依然很快。',
        'MP3 使用 -c:a libmp3lame -q:a 2，也就是 LAME V2 可變位元率設定，音樂平均約 190 kbps，語音則更低。WAV 使用 -c:a pcm_s16le，因此 44.1 kHz 立體聲來源每分鐘約 10.1 MB，48 kHz 來源每分鐘約 11 MB。',
        'M4A 和 AAC 都使用 FFmpeg 原生的 AAC 編碼器，並設定 -b:a 192k。FLAC 是無損格式，通常約為 WAV 大小的 50% 到 70%。OGG 使用 -c:a libvorbis -q:a 5，約 160 kbps。',
        '沒有傳入 -ar 或 -ac 旗標，所以輸出會保留來源的取樣率和聲道配置；5.1 環繞聲在 WAV 和 FLAC 中仍是 5.1，而 MP3 最多只能承載兩個聲道。',
        '只會對應串流 0:a:0。含有評論音軌或第二語言音軌的檔案，會保留容器中列在第一位的那條音軌。',
        '擷取是一種專門模式：上傳的檔案不會排入標準轉換所接受的自動內容分析，影片轉換器的畫質、尺寸調整和效果控制項也不適用。',
      ],
      whyItMatters: [
        'Podcaster、聽打人員和剪輯師通常只需要聲音而不需要畫面，而影片往往比其中的音訊大上 20 到 50 倍。',
        '標籤正確的 MP3 或 M4A 可以在每支手機、每種播放器上播放，不需要耗電的影片解碼。',
        '無損的 WAV 或 FLAC 輸出，最適合作為降噪、人聲分離或仔細轉錄的輸入。',
      ],
      useCases: [
        {
          title: '純音訊單集',
          description: '將錄製的影片訪談聲音發布為 Podcast MP3。',
        },
        {
          title: '轉錄準備',
          description: '把一段 18 分鐘的錄音以 25 MB 的 MP3 交給轉錄工具，而不是 540 MB 的 MP4。',
        },
        {
          title: '音效設計與取樣',
          description: '從片段中取出 WAV，在另一個剪輯中重複使用環境音或音樂。',
        },
        {
          title: '課堂筆記',
          description: '保留課程錄影的音訊，方便隨時隨地聆聽。',
        },
      ],
      workedExamples: [
        {
          title: '將 18 分鐘、540 MB 的 720p 錄影轉為 MP3',
          body: '輸入：一支 18 分鐘、1280 x 720、540 MB 的 MP4（約 4 Mbps），因為超出訪客預設的 200 MB 與 5 分鐘上限，所以使用免費帳號上傳。設定：MP3。伺服器以 ffprobe 確認這條立體聲 48 kHz AAC 音軌，並執行 libmp3lame -q:a 2。以約 190 kbps 計算，每分鐘約 1.4 MB，所以結果約為 25 MB，大約是上傳檔案的二十分之一。由於 -vn 完全跳過影片，這項工作只是單純的音訊解碼與編碼，速度很快；上傳 540 MB 所花的時間遠比從中擷取音訊還長。',
        },
        {
          title: '將 4 分鐘、95 MB 的 1080p 音樂錄影帶轉為 WAV',
          body: '輸入：一支 4 分鐘、1920 x 1080、95 MB 的 MP4，含 44.1 kHz 立體聲 AAC 音軌，在訪客上限之內。設定：WAV。FFmpeg 將 AAC 解碼一次，並以 pcm_s16le 寫出 16 位元 PCM，保留 44.1 kHz 和兩個聲道。該取樣率的 PCM 為每秒 44,100 x 16 x 2 位元，約每分鐘 10.1 MB，所以無論音樂多大聲或多繁雜，檔案都約為 40 MB。若改選 FLAC，同樣的取樣會以無損方式壓縮到大約 20 到 28 MB，視內容而定。所需時間只是幾秒鐘的音訊解碼；影片完全不會被處理。',
        },
      ],
      whenNotToUse: '不要用這個頁面來改善音質；它只會複製原有的內容，嘈雜或收音距離太遠的錄音依然會是嘈雜的。人聲音訊降噪和去除背景雜音工具才是為此而設計的。也不要期待 WAV 能找回影片已經損失的品質；來源音軌幾乎都是有損的 AAC，所以 WAV 只是壓縮訊號的忠實副本，而不是錄音室母帶。如果影片有兩條語言音軌，而你需要的是第二條，這個工具只會取第一條。如果你真正想要的是文字內容，轉錄工具會讀取音訊，直接提供文字和字幕。',
      whyMediaManipulator: [
        '編碼器設定公開透明：MP3 使用 LAME V2，AAC 為 192 kbps，WAV 為 16 位元 PCM，並全程保留原始取樣率。',
        '無聲影片會在任何處理開始之前被 ffprobe 攔下，所以你絕不會下載到長度為零的檔案。',
        '每次擷取計為每日額度中的一次一般工作：預設沒有帳號時每天 5 次，使用免費帳號每天 30 次；被拒絕或失敗的工作會退還額度。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ],
      privacyNote: '擷取在我們自己的伺服器上以單一 FFmpeg 指令執行，只會讀取你上傳檔案的第一條音訊串流；影片影格從不解碼。上傳的檔案存放在 uploads/<jobId>/，音訊存放在 outputs/<jobId>/，兩者都登記在保留紀錄中，並在期限結束時移除。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。由於擷取是一種專門模式，上傳的檔案不會經過標準轉換所接受的自動內容分析；它不會被轉錄或描述，也沒有任何內容會離開我們的硬體。',
      faq: [
        {
          question: '可以擷取成哪些音訊格式？哪些是無損的？',
          answer: 'MP3、WAV、M4A、AAC、FLAC 和 OGG。WAV 和 FLAC 是解碼後音軌的無損副本。MP3（約 190 kbps VBR）、M4A 和 AAC（192 kbps）以及 OGG（品質 5）屬於有損格式，但位元率高於大多數影片音軌。',
        },
        {
          question: '擷取出的音訊會有多大？',
          answer: '44.1 kHz 立體聲的 WAV 每分鐘約 10.1 MB，48 kHz 則約 11 MB。以本頁設定輸出的 MP3 每分鐘約 1.4 MB，192 kbps 的 M4A 和 AAC 每分鐘約 1.4 MB，OGG 每分鐘約 1.2 MB。FLAC 通常介於 WAV 大小的一半到三分之二之間。',
        },
        {
          question: '擷取會改變取樣率或立體聲聲像嗎？',
          answer: '不會。FFmpeg 執行時沒有加上 -ar 或 -ac，所以輸出會保留來源的取樣率和聲道配置。48 kHz 立體聲音軌仍會是 48 kHz 立體聲。',
        },
        {
          question: '如果我的影片沒有音訊會怎樣？',
          answer: '伺服器會先探測檔案，並停止處理，告知沒有可擷取的內容。這次一般工作會退還額度，也不會產生空檔案。',
        },
        {
          question: '我的影片有兩條音軌，我會拿到哪一條？',
          answer: '容器中的第一條，也就是串流 0:a:0。目前還沒有音軌選擇器。如果你需要的是第二條，請先以該音軌重新封裝或重新匯出影片。',
        },
        {
          question: '擷取音訊是免費的嗎？可以上傳多長的影片？',
          answer: '是的。預設情況下，訪客每天可執行 5 次一般工作，檔案上限為 200 MB 和 5 分鐘；免費帳號每天 30 次、1 GB 和 20 分鐘；Premium 可處理 5 GB 和 2 小時。目前的限制列在價格頁面上。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '我們會擷取第一條音訊串流。沒有任何音訊串流的影片會傳回明確的錯誤，而不是空檔案。',
        ],
      },
      related: [
        {
          label: '影片轉錄',
          to: '/tools/transcribe-video',
          description: '跳過音訊檔案，直接取得文字。',
        },
        {
          label: '人聲音訊降噪',
          to: '/tools/clean-voice-audio',
          description: '為擷取出的語音降噪並平衡音量。',
        },
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: '去掉擷取音軌中的嗡嗡聲和嘶嘶聲。',
        },
        {
          label: '去除歌曲人聲',
          to: '/tools/remove-vocals-from-song',
          description: '把擷取出的音樂變成伴奏。',
        },
        {
          label: '裁剪影片',
          to: '/tools/video-trimmer',
          description: '擷取之前，先把影片剪成你想要的部分。',
        },
      ],
      embed: {
        title: '擷取影片的音軌',
        description: '上傳任何常見的影片容器格式。選擇 MP3 以獲得廣泛相容性、WAV 以保持無損，或 M4A/AAC 取得小巧的壓縮檔案。沒有音軌的影片會傳回明確的錯誤。',
      },
    },
    'convert-video-to-animated-gif': {
      name: '將影片轉換為動態 GIF',
      h1: '線上將影片轉換為動態 GIF',
      tagline: '幾秒內把簡短的 MP4、WebM、MOV 或 MKV 片段變成方便分享的動態 GIF。',
      metaTitle: '線上將影片轉換為動態 GIF（免費） | Media Manipulator',
      metaDescription: '免費線上影片轉 GIF 工具。將簡短的 MP4、WebM、MOV 和 MKV 片段變成動態 GIF，並可控制尺寸與影格率。',
      ogTitle: '線上將影片轉換為動態 GIF',
      ogDescription: '把簡短的影片片段變成方便分享的動態 GIF。可控制影格率、尺寸與循環播放。',
      intro: '動態 GIF 是一疊索引色影格，每個調色盤最多 256 色，除了簡單的連續長度編碼之外，沒有任何影格間壓縮。這就是為什麼幾秒鐘的 GIF 可能比一分鐘的 MP4 還大，也是為什麼做出好 GIF 的關鍵主要在於選擇寬度、影格率與調色盤大小。本頁執行兩階段流程：FFmpeg 先將影片縮放到你設定的寬度，並以你的影格率取樣，寫出原始 GIF；接著 gifsicle 依你的顏色數量重新量化調色盤、設定影格延遲，並最佳化影格，只儲存有變化的像素。預設值針對螢幕錄影調校：寬 900 像素、每秒 12 格、128 色。',
      whatItDoes: [
        '將片段縮放到選定的寬度（16 到 2000 px），高度依長寬比計算，並取整為 4 的倍數。',
        '以 FFmpeg 依選定的影格率（1 到 50 fps；預設 12）對來源取樣。',
        '將每個影格量化為 2 到 256 色（預設 128）的調色盤，並以 gifsicle 在等級 1 到 3 最佳化影格間的儲存。',
        '以百分之一秒為單位設定影格延遲，它決定播放速度，與取樣率無關。',
        '遵循轉換器表單中的裁剪範圍，只有選取的秒數會變成影格。',
      ],
      flowSteps: [
        {
          title: '上傳影片並選擇 GIF',
          description: '本頁已預先選取 GIF 作為輸出；「品質」控制項會停用，因為它不適用。',
        },
        {
          title: '裁剪到幾秒鐘',
          description: '用裁剪控制項保留你想要的片刻；以預設影格率計算，每多一秒就多 12 格。',
        },
        {
          title: '設定寬度、影格率、顏色與延遲',
          description: '「動態 GIF 設定」面板的初始值為 900 px、12 fps、128 色、延遲 3、最佳化 3。',
        },
        {
          title: 'FFmpeg 取樣，gifsicle 最佳化',
          description: 'ffmpeg scale=W:-4 -pix_fmt rgb8 -r FPS，接著執行 gifsicle --optimize --delay --colors --interlace。',
        },
        {
          title: '下載 GIF',
          description: '標準的循環 GIF，聊天應用程式與瀏覽器都能直接內嵌播放。',
        },
      ],
      advancedDetails: [
        '第一階段是 ffmpeg -i input [-ss START -t DURATION] -vf scale=W:-4 -pix_fmt rgb8 -r FPS -f gif raw.gif（見 converter.go 中的 convertVideoToGIF）。-4 代表要求一個維持長寬比、且可被 4 整除的高度；rgb8 是 8 位元索引色中介格式，會在第二階段重新量化。',
        '第二階段是 gifsicle --optimize=L --delay=D --colors C --interlace raw.gif -o output.gif。最佳化等級 3 最慢、檔案最小：它只儲存影格之間有變化的像素矩形，這就是為什麼工具列靜止的螢幕錄影，壓縮效果遠比搖攝的攝影機畫面好。',
        '延遲會在取樣後套用到每一格，與取樣率無關。以預設的 12 fps 與延遲 3（每格 30 ms）計算，片段的播放速度約為實際的 2.8 倍；將延遲設為 8（80 ms，12.5 fps）可在 12 fps 下接近實際速度播放，10 fps 時則設為 10。',
        '在轉換器主要的「寬度」欄位中輸入的寬度，會覆寫 GIF 面板的寬度，讓進階使用者只需調整一個控制項。表單會將顏色限制在 2 到 256；GIF 調色盤永遠不能超過 256。',
        '這裡的 FFmpeg 沒有 palettegen 步驟；調色盤品質來自 gifsicle --colors，它會為整段動畫建立單一最佳化調色盤。帶有平滑漸層的實拍片段適合 256 色；平面的 UI 畫面在 64 色下看起來完全一樣。',
        'gifsicle 階段的逾時為 6 小時；由於 GIF 是一般影片轉換器的一種格式，上傳的檔案也會經過標準轉換都會進行的自動內容分析。',
      ],
      whyItMatters: [
        'GIF 能在問題追蹤系統、聊天應用程式、文件網站與電子郵件用戶端中直接自動播放，而影片附件在這些地方只會顯示播放按鈕，甚至什麼都不顯示。',
        '一段 5 秒的錯誤重現 GIF，比一整段文字更快說明問題，而且不需要影片播放器。',
        '調色盤與影格率的選擇會讓檔案大小相差一個數量級，因此把它們開放給你調整，勝過單一尺寸的預設組。',
      ],
      useCases: [
        {
          title: '錯誤重現',
          description: '錄下螢幕、裁剪到出錯的那一刻，再把 GIF 放進問題單。',
        },
        {
          title: 'README 與文件示範',
          description: '在不允許嵌入影片的地方，以動態方式展示功能。',
        },
        {
          title: '反應片段',
          description: '從影片中剪出 3 秒，分享到任何接受圖片的地方。',
        },
        {
          title: '電子郵件預覽',
          description: '在影片本身無法播放的地方，用一個連到完整影片的小型循環 GIF。',
        },
      ],
      workedExamples: [
        {
          title: '以預設值處理 8 秒的 1080p 螢幕錄影',
          body: '輸入：8 秒、1920 x 1080、約 15 MB 的 MP4 螢幕錄影。設定：GIF、寬度 900、12 fps、128 色、延遲 3、最佳化 3。FFmpeg 會縮放為寬 900 像素、高約 506（調整為 4 的倍數），並取樣 96 格。未壓縮時，這 96 個索引色影格約為 43 MB（900 x 504 x 96 位元組），這就是 gifsicle 開始往下壓縮的上限；在工具列靜止、只有游標移動的情況下，等級 3 最佳化只會儲存變化的矩形，因此螢幕錄影的結果會遠低於這個上限，通常只有幾 MB。延遲 3 時，96 格約在 2.9 秒內播完，速度約為 8 秒來源的 2.8 倍；將延遲設為 8，則約在 7.7 秒內播完。這項工作只是一次短暫的編碼，加上 gifsicle 對 96 格的一次處理。',
        },
        {
          title: '以 480 px、10 fps 與 64 色製作 5 秒反應片段',
          body: '輸入：20 秒、40 MB 的 1080p MP4，在表單中裁剪為 5 秒範圍。設定：GIF、寬度 480、10 fps、64 色、延遲 10、最佳化 3。FFmpeg 剪出這 5 秒，縮放為寬 480 像素、高約 270（取整為 4 的倍數），並取樣 50 格。最佳化前的原始影格資料約為 6.5 MB（480 x 268 x 50 位元組），而 64 色調色盤每個像素只需 6 位元，所以即使是整個畫面都在動的攝影機鏡頭，結果仍會遠低於此，穩定的人物講話畫面更能壓縮到其中一小部分。延遲 10 即每格 100 ms，因此 50 格剛好在 5 秒內播完，與 10 fps 的實際速度一致。',
        },
      ],
      whenNotToUse: '不要把超過約 10 秒、或整個畫面都有實拍動態的內容做成 GIF；這個格式沒有真正的影格間壓縮，所以這類片段會變成數十 MB，而同樣內容的 MP4 或 WebM 只有其十分之一大小。在色彩準確度很重要時，也不要使用 GIF，因為每一格都受限於 256 色調色盤，漸層會出現色帶。如果目的地能直接內嵌播放影片，壓縮過的 MP4 在各方面都更好。此外，如果你需要聲音，GIF 完全無法攜帶音訊。',
      whyMediaManipulator: [
        '流程的兩個階段及其預設值都記錄在這裡，包括讓預設 GIF 播放得比較快的延遲行為。',
        '寬度、影格率、顏色數量、延遲與最佳化等級全都開放調整，而不是只有一個大小滑桿。',
        '一次 GIF 轉換計為一次一般工作（訪客預設每天 5 次，免費帳號每天 30 次），失敗的工作會退還額度。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。',
      ],
      privacyNote: 'GIF 轉換在我們自己的伺服器上執行：FFmpeg 取樣並縮放影格，接著 gifsicle 進行量化與最佳化；暫存的原始 GIF 會在 gifsicle 完成後立即刪除。上傳的檔案保存在 uploads/<jobId>/ 中，GIF 則在 outputs/<jobId>/ 中，兩者都登記在保留記錄中，並在期限結束時刪除。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。由於 GIF 是標準影片轉換器的一種格式，上傳的檔案也會在同一套硬體上經過我們的自動內容分析（取樣影格由本機視覺模型描述，任何音訊都在本機轉錄）；該報告與工作一起保存，不會分享給第三方。',
      faq: [
        {
          question: '為什麼我的 GIF 播放得比原始影片快？',
          answer: '影格延遲在取樣之後設定，預設為 3 個百分之一秒，對以每秒 12 格取樣的影格而言，播放速度約為每秒 33 格。若要以實際速度播放，12 fps 時請將延遲設為 8，10 fps 時則設為 10。',
        },
        {
          question: '如何讓 GIF 變小？',
          answer: '依效果大小排序：裁剪到更少秒數、降低寬度（聊天用 480 就很夠）、將影格率降到 8 或 10，以及對平面的 UI 畫面將顏色減少到 64。最佳化請保持在 3；等級 1 與 2 只是以檔案大小換取速度。',
        },
        {
          question: '我應該使用多少種顏色？',
          answer: '預設的 128 色適合大多數螢幕錄影。平面的介面在 64 色下看起來完全一樣，還能節省位元組。帶有漸層的實拍畫面需要 256 色，這是 GIF 的上限。',
        },
        {
          question: '我可以選擇影片的哪一部分變成 GIF 嗎？',
          answer: '可以。使用轉換器中的裁剪控制項設定開始與結束時間；只有該範圍會被取樣。越短越好，因為每多一秒，就會依選定的影格率增加更多影格。',
        },
        {
          question: 'GIF 會循環播放嗎？會保留聲音嗎？',
          answer: '會循環播放，這是 GIF 在所有播放器中的預設行為。它無法攜帶音訊；這個格式沒有音軌。如果需要聲音，請另外擷取音訊。',
        },
        {
          question: '我能製作的最大 GIF 是多大？',
          answer: '表單最多允許寬 2000 px、50 fps 與 256 色，但在這些設定下，GIF 很快就會變得非常龐大。上傳本身受你的方案限制，訪客預設為 200 MB 與 5 分鐘的影片。',
        },
      ],
      related: [
        {
          label: '裁剪影片',
          to: '/tools/video-trimmer',
          description: '先以無損方式剪出精確的秒數。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '對超過幾秒的內容來說，小巧的 MP4 勝過 GIF。',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '在匯出片段之前加上字幕或進行裁切。',
        },
        {
          label: '影片轉換器教學',
          to: '/tutorials/video/getting-started',
          description: '逐步了解裁剪、尺寸調整與濾鏡設定。',
        },
      ],
      embed: {
        title: '將影片片段轉換為 GIF',
        description: '上傳一段短影片，並選擇 GIF 作為輸出格式。裁剪到約 10 秒以內並降低影格率，即可得到更小的檔案。',
      },
    },
    'transcribe-video': {
      name: '影片轉錄',
      h1: '線上將影片轉錄為文字',
      tagline: '把影片或音訊檔案中的語音擷取為 WebVTT 或 SRT 字幕、純文字或附時間戳記的 JSON。',
      metaTitle: '線上將影片轉錄為文字（免費） | Media Manipulator',
      metaDescription: '免費線上影片轉錄工具。將 MP4、MOV、WebM、MKV 和音訊檔案轉換為可搜尋的文字、VTT 字幕或 JSON 逐字稿。',
      ogTitle: '線上將影片轉錄為文字',
      ogDescription: '將影片中的語音擷取為文字、字幕或 JSON 逐字稿。在本機 GPU 伺服器上執行。',
      intro: '影片轉錄可處理 MP4、MOV、WebM、MKV 或一般的音訊檔案：分離出音軌，並在我們營運的 GPU 伺服器上以 Whisper 處理。你在上傳前就選好結果的形式：附字幕段落時間的 WebVTT 或 SRT 字幕檔、只有文字的純文字檔，或是包含每個片段及其起訖時間（精確到毫秒）的 JSON 文件。語言會自動偵測，你也可以輸入兩個字母的代碼來指定。',
      whatItDoes: [
        '以 ffmpeg 將音軌解碼為 16 kHz 單聲道 WAV（Whisper 預期的取樣率），並在工作完成時刪除這個中介檔。',
        '在我們的 GPU 上以 float16 執行搭配 medium Whisper 模型的 whisper-ctranslate2，並開啟語音活動過濾，略過靜音與長段音樂。',
        '依你選擇的格式，寫出一個名為 transcript.vtt、transcript.srt、transcript.txt 或 transcript.json 的檔案。',
        '從音訊本身偵測所說的語言；對於很短或混合語言的片段，你在表單中輸入的語言代碼會覆寫偵測結果。',
        '在沒有內容可轉錄時如實回報：沒有音訊串流的影片，或沒有可辨識語音的音訊，仍會完成工作並附上一則簡短訊息，而不是給你一個空檔案。',
      ],
      flowSteps: [
        {
          title: '上傳影片或音訊',
          description: 'MP4、MOV、WebM、MKV、AVI，或 MP3、WAV、M4A、FLAC 等音訊檔案。',
        },
        {
          title: '選擇格式',
          description: 'VTT 或 SRT 用於字幕，TXT 用於易讀的逐字稿，JSON 用於可供處理的時間戳記。',
        },
        {
          title: 'ffmpeg 擷取音訊',
          description: '音軌會轉換為 16 kHz 單聲道 PCM；影片影格完全不會被解碼。',
        },
        {
          title: 'Whisper 在我們的 GPU 上轉錄',
          description: '工作會等待空出的 GPU 位置，接著 medium 模型會一次處理整個檔案。',
        },
        {
          title: '下載逐字稿',
          description: '檔案會隨工作一起出現，只要工作仍被保留就能下載。',
        },
      ],
      advancedDetails: [
        '確切的擷取指令是 ffmpeg -vn -acodec pcm_s16le -ar 16000 -ac 1，因此立體聲 48 kHz 音軌會在 Whisper 讀取前混為單聲道並重新取樣。工作執行期間，這個中介檔每秒占用 32 KB 磁碟空間（每分鐘約 1.9 MB），之後就會刪除。',
        'whisper-ctranslate2 以 --model medium --device cuda --compute_type float16 --vad_filter True 與 --output_format json 啟動；API 會解析該 JSON，再自行轉譯為你選擇的格式。模型是伺服器設定（WHISPER_CT2_MODEL），所以 medium 是預設值，而不是保證。',
        'VTT 輸出以 WEBVTT 標頭開始，並為每個字幕段落編號；時間戳記格式為 HH:MM:SS.mmm。SRT 是同一份字幕段落清單，但毫秒以逗號分隔。結束時間等於開始時間的片段會被給予半秒，讓播放器仍能顯示。',
        'JSON 輸出包含 language、hasAudio、hasSpeech、transcript、durationSeconds，以及由 {id, start, end, text} 組成的 segments 陣列，時間取整到毫秒。這份輸出中沒有逐字時間，也沒有信賴分數。',
        '預設一次只執行一個 Whisper 程序（WHISPER_GPU_CONCURRENCY=1），GPU 排程器會在開始前檢查可用 VRAM；float16 的 medium 模型約需 3.5 GB，再加上 512 MB 的餘裕。如果顯示卡忙碌中，你的工作會在佇列中等待，而不會失敗。',
        '開啟 VAD 過濾時，全是音樂或語音非常微弱的檔案，可能會傳回 "Audio was detected but no recognizable speech was found."（偵測到音訊，但未找到可辨識的語音）。這則訊息會寫入逐字稿檔案，所以下載的檔案絕不會是空的。',
      ],
      whyItMatters: [
        '有沒有字幕檔，決定了一部影片能否在靜音下觀看、被搜尋或被引用。',
        '附時間戳記的片段讓你能跳到某句話被說出的那一刻，這正是讓兩小時錄音真正派上用場的關鍵。',
        '在我們營運的硬體上進行轉錄，代表音訊不會交給外部語音 API。',
      ],
      useCases: [
        {
          title: '已發布影片的字幕',
          description: '匯出 VTT 供 HTML 影片與大多數網頁播放器使用，或匯出 SRT 供剪輯軟體與電視風格的字幕流程使用。',
        },
        {
          title: '會議與訪談筆記',
          description: '把 TXT 輸出放進文件裡從那裡開始編輯，不必從頭打字。',
        },
        {
          title: '為錄音封存庫建立索引',
          description: '使用 JSON 片段建立搜尋索引，精確指向某個詞被說出的那一秒。',
        },
        {
          title: '文章初稿',
          description: '轉錄演講或螢幕錄影，再把純文字改寫成文章。',
        },
      ],
      workedExamples: [
        {
          title: '將 9 分鐘、120 MB 的 1080p MP4 轉成 VTT 字幕',
          body: '120 MB 低於訪客 200 MB 的上限，但 9 分鐘超過訪客 5 分鐘的限制，所以需要免費帳號，其預設允許 20 分鐘。ffmpeg 會寫出約 17 MB 的 16 kHz 單聲道 WAV（每秒 32,000 位元組，共 540 秒），執行後即刪除。接著 Whisper medium 會產生附 HH:MM:SS.mmm 時間的編號字幕段落，產生的 transcript.vtt 只有幾 KB，因為裡面只有文字與時間戳記。在家用網路上上傳 120 MB 通常比只需幾秒的擷取更花時間；其餘時間花在 Whisper 處理上，所需時間取決於語音長度，而不是影片大小。',
        },
        {
          title: '將約 26 MB 的 18 分鐘 Podcast MP3 轉成 JSON',
          body: '192 kbps 的 MP3 每秒 24 KB，所以 1,080 秒約為 26 MB。純音訊檔案的長度限制與影片相同，因此 18 分鐘需要免費帳號（上限 20 分鐘），而不是訪客工作階段（5 分鐘）。雖然沒有影片需要略過，檔案仍會先轉換為 16 kHz 單聲道 PCM（磁碟上約 35 MB，之後刪除）。語言會從音訊中偵測，並以兩個字母的代碼寫入 JSON，每個片段都帶有自己的起訖時間。JSON 會比同一段錄音的 TXT 大，因為每個片段都包在自己的物件中，但仍遠不到一 MB。',
        },
      ],
      whenNotToUse: '如果你需要逐字時間、說話者標籤或信賴分數，就不要使用這個工具：輸出中這些都沒有，只有片段層級的時間戳記。對於只有音樂、沒有語音的檔案，它也不是合適的工具，因為語音活動過濾會略過它，你只會得到一則簡短訊息，而不是歌詞。如果你只需要聆聽檔案，或想把字幕翻譯成另一種語言，你需要的是其他步驟。另外，如果錄音長度超過你的方案允許的範圍（預設訪客 5 分鐘，免費帳號 20 分鐘），請先裁剪或登入。',
      whyMediaManipulator: [
        '你在上傳前就選擇 VTT、SRT、TXT 或 JSON，所以逐字稿產生後不需要再轉換一次。',
        'Whisper 在我們自己的 GPU 上執行，模型快取設為離線模式；沒有任何外部語音服務會收到你的音訊。',
        '轉錄計為一次 AI 工作，從每日 AI 工作次數中扣除，與一般工作的額度分開計算：預設訪客每天 3 次，免費帳號每天 10 次，你的一般工作次數完全不受影響（見 /pricing）。',
      ],
      privacyNote: '你的影片或音訊檔案儲存在我們伺服器上該工作的資料夾中。ffmpeg 會寫出暫存的 16 kHz 單聲道 WAV，由 Whisper 在我們的 GPU 上讀取，並在工作完成時刪除。逐字稿檔案與片段的 transcribe_result.json 副本會隨工作保留，逐字稿文字也會交給在我們自己硬體上執行的語言模型，進行自動摘要與安全審查，其結果會隨工作保存。不會傳送任何資料給第三方 AI 供應商。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。',
      faq: [
        {
          question: '我該選哪種字幕格式，VTT 還是 SRT？',
          answer: '字幕要用在網頁上（HTML 影片、大多數播放器）就選 VTT，要放進影片剪輯軟體或廣播風格的流程就選 SRT。兩者包含相同的字幕段落；只有標頭與毫秒分隔符號不同，VTT 用句點，SRT 用逗號。',
        },
        {
          question: 'JSON 逐字稿包含信賴分數或逐字時間嗎？',
          answer: '不包含。每個片段有一個 id、以秒為單位的起訖時間（取整到毫秒）以及其文字。檔案也會記錄偵測到的語言、長度以及是否找到語音，但沒有逐字時間，也沒有機率值。',
        },
        {
          question: '我可以轉錄多長的檔案？',
          answer: '純音訊上傳的長度上限與影片相同：預設訪客 5 分鐘，免費帳號 20 分鐘，Premium 與 Pro 為 2 小時；每個檔案的大小上限則分別為 200 MB、1 GB 或 5 GB。表單會顯示適用於你的限制，/pricing 則列出目前的數字。',
        },
        {
          question: '為什麼我收到「no recognizable speech was found」？',
          answer: 'Whisper 在開啟語音活動偵測的情況下執行，因此音樂、環境音、靜音或非常微弱的語音，可能會被修剪到什麼都不剩。這則訊息會寫入逐字稿檔案本身，所以下載仍能正常運作。請用更大的音量重新錄製，或裁剪到有說話的部分後再試一次。',
        },
        {
          question: '我可以指定語言，而不是讓它自動偵測嗎？',
          answer: '可以。在語言欄位中輸入兩個字母的語言代碼，例如 en、de 或 es，Whisper 就會以該語言轉錄。留空則自動偵測，對超過幾秒的片段效果很好。',
        },
        {
          question: '轉錄會使用我的 AI 工作額度嗎？',
          answer: '會。每次轉錄計為一次 AI 工作：預設訪客每天 3 次，免費帳號 10 次，Premium 100 次，Pro 200 次。AI 工作額度有自己的計數器，所以轉錄絕不會用掉轉換所用的一般工作額度。失敗的工作會退還該次額度。',
        },
        {
          question: '使用的是什麼模型？我可以選更大的模型嗎？',
          answer: '服務預設在 CUDA GPU 上以 float16 執行搭配 medium 模型的 whisper-ctranslate2。表單中沒有模型選擇器；模型是在伺服器上設定的，所以無法針對單一工作要求速度極快或規模極大的版本。',
        },
      ],
      related: [
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '在上傳取得逐字稿之前，先縮小大型錄影檔。',
        },
        {
          label: '從影片擷取音訊',
          to: '/tools/extract-audio-from-video',
          description: '如果你也想保留一份音軌副本，可以將它擷取出來。',
        },
        {
          label: '人聲音訊降噪',
          to: '/tools/clean-voice-audio',
          description: '在轉錄之前，先改善雜音多的錄音。',
        },
        {
          label: '影片裁剪',
          to: '/tools/video-trimmer',
          description: '先把檔案剪到有說話的部分。',
        },
        {
          label: '影片轉換器教學',
          to: '/tutorials/video/getting-started',
          description: '在轉錄之前準備並轉換影片。',
        },
      ],
      embed: {
        title: '轉錄影片',
        description: '上傳影片。AI 轉錄模型在我們的本機 GPU 伺服器上執行，可匯出為 VTT 字幕、純文字或 JSON：VTT 用於字幕，純文字用於文章，JSON 則供後續工具處理。',
      },
    },
    'transcode-to-hls': {
      name: '將影片轉碼為 HLS',
      h1: '線上將影片轉碼為 HLS',
      tagline: '把任何影片封裝成 Apple HLS VOD 套件：master.m3u8 和依解析度劃分的 .ts 片段，可直接用於網頁。',
      metaTitle: '線上將影片轉碼為 HLS | 免費自適應串流工具 | Media Manipulator',
      metaDescription: '免費線上 HLS 轉碼工具。將 MP4、MOV、WebM、MKV 轉換為包含 360p/480p/720p 解析度的 HLS VOD 套件，可選字幕和分鏡腳本。',
      ogTitle: '線上將影片轉碼為 HLS',
      ogDescription: '從任何影片產生自適應 HLS 套件（master.m3u8 + 各變體播放清單 + .ts 片段），免費，直接在你的瀏覽器中使用。',
      intro: 'HTTP Live Streaming 會把影片以多個品質等級的短片段播放清單提供，讓播放器能快速開始播放，並隨著連線狀況切換等級。手動製作這樣的套件，代表要以對齊的關鍵影格編碼每個版本、加以分段，並寫出正確描述每個變體的主播放清單。本頁會完成整個工作：探測你上傳的檔案，提供你的來源與方案允許的階梯等級，以 libx264 與 AAC 將每個等級編碼為 2 秒的 MPEG-TS 片段，並可選擇加入由我們自己的 Whisper 轉錄器產生的字幕、分鏡腳本拼貼圖，以及用於拖曳瀏覽的 I-frame 播放清單，最後將一切打包成 tar.gz 或 zip，讓你解壓縮到任何靜態主機上。',
      whatItDoes: [
        '以 ffprobe 探測來源並列出階梯等級：144p、240p、360p、480p、720p、1080p 與 2160p，只有在來源夠高且你的方案允許時才會啟用。',
        '以 libx264 High profile level 4.1 與 48 kHz 的 AAC 立體聲編碼每個選取的等級，產生 2 秒的 .ts 片段，並在每個片段邊界放置一個關鍵影格。',
        '寫出 hls/master.m3u8，為每個變體標示 BANDWIDTH、RESOLUTION、FRAME-RATE 與 CODECS，並為每個等級各寫一個 index.m3u8。',
        '可選擇以 Whisper 將音訊轉錄為 WebVTT 字幕軌，以本機模型翻譯成最多 3 種其他語言，並在主播放清單中將每一種連結為字幕版本。',
        '可選擇轉譯分鏡腳本拼貼圖並附上 WebVTT 索引，用作拖曳列縮圖；並一律嘗試加入 240p 的純 I-frame 播放清單。',
        '將資料夾連同 README.txt 與 report.json 打包成 tar.gz（或 zip），並提供預先簽署的下載連結。',
      ],
      flowSteps: [
        {
          title: '上傳',
          description: '瀏覽器以預先簽署的 PUT 直接上傳到我們的儲存空間；接著 API 會下載檔案進行處理。',
        },
        {
          title: '探測',
          description: 'ffprobe 讀取寬度、高度、影格率、長度以及是否有音訊；高於來源的等級會變成灰色。',
        },
        {
          title: '選擇等級與附加項目',
          description: '預設選取 360p、480p 與 720p。勾選字幕、額外的字幕語言、分鏡腳本，以及 tar.gz 或 zip。',
        },
        {
          title: '編碼每個等級',
          description: '以該等級的 CRF 與位元率、2 秒 GOP 執行 libx264，音訊以該等級的音訊位元率編碼為 AAC，輸出 HLS VOD。',
        },
        {
          title: '加入附加項目並寫出主播放清單',
          description: '產生字幕、分鏡腳本與 I-frame 播放清單，接著重寫 master.m3u8 以參照它們。',
        },
        {
          title: '下載套件',
          description: '預先簽署的連結預設有效 30 分鐘；在有效期間內，你可以從工作頁面取得它。',
        },
      ],
      advancedDetails: [
        '階梯（transcode_profiles.go）如下：144p 影片 200 kbps、音訊 64 kbps，CRF 26；240p 400/64，CRF 25；360p 800/96，CRF 23；480p 1200/128，CRF 23；720p 2800/128，CRF 22；1080p 5000/192，CRF 22；2160p 12000/256，CRF 21。除了 2160p 使用 slow 之外，所有等級都使用 veryfast 預設組。',
        '每個等級的編碼指令為 ffmpeg -i input -map 0:v:0 -vf scale=-2:H -r FPS -c:v libx264 -profile:v high -level 4.1 -preset P -crf N -sc_threshold 0 -g GOP -keyint_min GOP -b:v B -maxrate 1.2B -bufsize 2B -force_key_frames expr:gte(t,n_forced*2) -map 0:a:0? -c:a aac -b:a A -ac 2 -ar 48000 -hls_time 2 -hls_playlist_type vod -hls_flags independent_segments。GOP 為影格率乘以 2，因此每個等級的片段都從關鍵影格開始。',
        '由於編碼以 CRF 驅動、並以 -maxrate 作為上限，每個等級的平均位元率最多約為其列出的位元率（上限為其 1.2 倍），內容簡單時則更低。主播放清單以列出的影片加音訊位元率作為 BANDWIDTH，CODECS 則為 avc1.640028，有音訊時再附加 mp4a.40.2。',
        '預設情況下，訪客可選擇 360p 到 720p，免費帳號可選擇 360p 到 1080p，Premium 或 Pro 則可使用完整的 144p 到 2160p 階梯；低於 360p 的來源在 Premium 以下會被拒絕。伺服器在開始時會重新驗證等級，所以用戶端無法要求未提供給它的等級。',
        '字幕使用與轉錄工具相同的 Whisper 模型（whisper-ctranslate2，medium）；主要字幕軌會寫入 captions/<lang>/auto.vtt，並附上只有一個片段的 subs.m3u8 包裝，在主播放清單中以 EXT-X-MEDIA TYPE=SUBTITLES 參照。從 37 種語言的清單中，最多 3 種額外語言會由本機 Ollama 模型（translategemma 12b 建置）逐段翻譯；翻譯失敗只會記錄為警告，絕不會讓工作失敗。',
        '分鏡腳本以一次 ffmpeg 處理產生：fps=1/N，N 依長度為 5、10 或 15 秒（不到 10 分鐘、不到 30 分鐘、更長），每張 JPEG 拼貼圖是 10 x 10 的格狀排列，每格為填補成 16:9 的 160 x 90 縮圖，並附上帶有 #xywh 段落的 storyboard.vtt。I-frame 播放清單只以 240p 重新編碼關鍵影格（select=eq(pict_type,I)、libx264 CRF 30、4 秒片段），並以 EXT-X-I-FRAME-STREAM-INF 列出。',
        '主播放清單包含 EXT-X-VERSION:6、EXT-X-INDEPENDENT-SEGMENTS，以及三個 EXT-X-SESSION-DATA 項目，分別標示製作者、網站與著作權人。report.json 會記錄探測結果、附片段數與位元組大小的各變體、警告與時間戳記。',
      ],
      whyItMatters: [
        'HLS 是 iOS、Safari 與所有 CDN 的原生串流格式，搭配 hls.js 也能在其他所有瀏覽器中播放。',
        '自適應等級讓連線較弱的觀眾能以 360p 繼續觀看，而不是卡在 1080p 緩衝。',
        '預先分段的 VOD 套件只是靜態檔案，因此可以放在物件儲存上，背後不需要任何轉碼伺服器。',
      ],
      useCases: [
        {
          title: '課程平台',
          description: '從儲存空間提供課程影片，附自適應位元率與多種語言的字幕。',
        },
        {
          title: '產品與行銷頁面',
          description: '串流示範影片，不必使用第三方影片平台及其播放器品牌標誌。',
        },
        {
          title: '內部入口網站',
          description: '在你自己的 CDN 上託管訓練影片，附拖曳列縮圖。',
        },
        {
          title: '封存庫',
          description: '將過往的影片庫轉換成由你掌控、可鏡像備份的串流結構。',
        },
      ],
      workedExamples: [
        {
          title: '以三個預設等級處理 3 分鐘的 1080p 片段',
          body: '輸入：3 分鐘、1920 x 1080、30 fps、140 MB、立體聲音訊的 MP4，在訪客上限之內。設定：360p、480p 與 720p（預設選擇，也是訪客最多能選的範圍），不加字幕或分鏡腳本，tar.gz。每個等級切成 2 秒片段，每個等級 90 個，GOP 為 60 格，因此每個片段都從關鍵影格開始。以列出的位元率計算，360p 最多約 20 MB（800 + 96 kbps x 180 s），480p 約 30 MB（1200 + 128 kbps），720p 約 66 MB（2800 + 128 kbps），在加上小小的 240p I-frame 播放清單之前合計約 116 MB；由於編碼以 CRF 驅動、位元率只是上限，內容簡單時會更小。產生的套件包含 270 個 .ts 片段、三個 index.m3u8 檔案與主播放清單。時間花在依序執行的三次 libx264 veryfast 編碼上，每次 5400 格；720p 等級最耗時。',
        },
        {
          title: '附英文字幕、西班牙文翻譯與分鏡腳本的 12 分鐘 720p 網路研討會',
          body: '輸入：12 分鐘、1280 x 720、25 fps、380 MB 的 MP4，因超過訪客預設的 5 分鐘而以免費帳號上傳。設定：360p 與 720p（因來源為 720p，1080p 呈灰色），開啟字幕並加入西班牙文作為額外語言，開啟分鏡腳本，zip。Whisper 會先轉錄這 12 分鐘並寫入 captions/en/auto.vtt；西班牙文字幕軌以每批 30 個片段翻譯，寫入 captions/es/auto.vtt，兩者都在主播放清單中列為字幕版本。來源超過 10 分鐘，因此分鏡腳本使用 10 秒間隔：72 張 160 x 90 的縮圖剛好放進一張 1600 x 900 的 sprite_001.jpg，並由 storyboard.vtt 指向每一格。兩個等級各有 360 個 2 秒片段，25 fps 下 GOP 為 50 格，以列出的位元率計算，最多分別約 81 MB（360p）與 264 MB（720p）。這項工作花在 Whisper 與兩次編碼上的時間最多；翻譯只是很短的額外步驟。',
        },
      ],
      whenNotToUse: '如果你只是想要一個較小的單一檔案來傳送或嵌入，就不要轉碼為 HLS；壓縮工具只需一次處理就能做到，不需要片段與播放清單。也不要用於直播活動，因為輸出是完成的 VOD 播放清單，而不是直播來源伺服器。如果你的來源低於 360p，沒有 Premium 就無法建立階梯。另外，如果你的播放器只是不支援 HLS 的一般 video 標籤，你得先準備 MP4 或 hls.js 類型的播放器；單獨的 master.m3u8 只能在 Safari 與 Apple 裝置上原生播放。',
      whyMediaManipulator: [
        '每個等級的位元率、CRF、預設組與 FFmpeg 旗標都列在本頁上，所以套件的內容不會讓你意外。',
        '字幕來自我們自己的 Whisper 轉錄器，翻譯則來自我們自己硬體上的模型，兩者都在主播放清單中被正確參照。',
        '套件是附 README 與 report.json 的一般檔案；解壓縮到任何靜態主機上，再讓播放器指向 master.m3u8 即可。',
        '一次轉碼會使用每日一般工作次數中的一次（訪客預設每天 5 次，免費帳號每天 30 次），且每個工作階段每小時最多啟動 10 次；失敗的工作會退還額度。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。',
      ],
      privacyNote: '你上傳的檔案會直接從瀏覽器送進我們的儲存空間，再下載到我們自己的伺服器上，在那裡執行 ffprobe、FFmpeg，以及（若你勾選字幕）我們的 Whisper 轉錄器與本機 Ollama 翻譯模型；不涉及任何第三方轉碼或 AI 服務。來源物件、工作目錄與完成的套件都登記在保留記錄中，並在期限結束時刪除，下載連結本身預設也會在 30 分鐘後失效。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。轉碼不會執行標準轉換所進行的自動內容分析。產生的主播放清單包含將 Media Manipulator 標示為製作者的 session-data 行；其中不含任何關於你的資訊。',
      faq: [
        {
          question: '我的方案可以選擇哪些等級？',
          answer: '預設情況下，訪客可使用 360p、480p 與 720p；免費帳號再加上 1080p；Premium 與 Pro 還會解鎖 144p、240p 與 2160p。高於來源的等級一律停用，因為不會進行任何放大。將滑鼠停在選項上即可看到原因。',
        },
        {
          question: '片段有多長？為什麼是 2 秒？',
          answer: '每個等級都切成 2 秒的 MPEG-TS 片段，並在每個邊界強制放置關鍵影格，讓播放器可以在任何片段切換等級而不產生畫面瑕疵。I-frame 播放清單使用 4 秒片段，因為它只包含關鍵影格。',
        },
        {
          question: '字幕會連結到主播放清單中嗎？',
          answer: '會。每種語言都寫成 captions/<lang>/auto.vtt 並附 subs.m3u8 包裝，在 master.m3u8 中以 EXT-X-MEDIA TYPE=SUBTITLES 宣告於 subs 群組，來源語言會標記為 DEFAULT。你可以從 37 種語言的清單中加入最多 3 種翻譯語言。',
        },
        {
          question: '如果我的影片沒有音訊怎麼辦？',
          answer: '各等級會以 -an 只編碼影片，CODECS 屬性會省略 mp4a.40.2，字幕步驟會被略過，並在 report.json 中留下警告，因為沒有內容可以轉錄。',
        },
        {
          question: '套件裡有什麼？要如何託管？',
          answer: 'hls/master.m3u8、每個等級一個資料夾（內含 index.m3u8 與片段）、hls/iframes/、可選的 captions/ 與 storyboards/、README.txt 與 report.json。將它解壓縮到任何能以正確 MIME 類型提供 .m3u8 與 .ts 的靜態主機或儲存空間，再讓播放器指向 master.m3u8。',
        },
        {
          question: '下載連結有效多久？可以選 tar.gz 或 zip 嗎？',
          answer: '預先簽署的連結預設有效 30 分鐘；若已失效，請重新執行工作。開始前在表單中選擇 tar.gz（預設）或 zip。',
        },
        {
          question: 'HLS 轉碼需要多久？',
          answer: '每個選取的等級都是一次以 veryfast 預設組完整執行的 libx264 編碼，並依序進行，因此時間會隨長度乘以等級數量增加；在三個預設等級中，720p 最耗時。字幕會對整段音訊多執行一次 Whisper。工作頁面會在每個階段完成時顯示出來。',
        },
      ],
      related: [
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '產生一個較小的 MP4，而不是串流套件。',
        },
        {
          label: '影片轉錄',
          to: '/tools/transcribe-video',
          description: '取得同樣由 Whisper 產生的字幕，作為獨立的 VTT 或 SRT。',
        },
        {
          label: '裁剪影片',
          to: '/tools/video-trimmer',
          description: '在轉碼之前，剪掉開頭與結尾的空白段落。',
        },
        {
          label: 'AI 影片修復',
          to: '/tools/ai-video-restoration',
          description: '在用低解析度片段建立階梯之前，先將其放大。',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '剪輯影片並加上字幕，再將匯出檔轉碼。',
        },
      ],
      embed: {
        title: '將影片轉碼為 HLS',
        description: '上傳 MP4/MOV/WebM/MKV。我們會以 ffprobe 探測來源，讓你選擇免費的品質等級（360p/480p/720p），接著以 ffmpeg 執行 H.264 + AAC 編碼，並將 HLS 套件打包成可下載的 tar.gz。',
      },
    },
    'ai-video-restoration': {
      name: 'AI 影片修復',
      h1: 'AI 影片修復工具',
      tagline: '使用最多六種 AI 模型（Real-ESRGAN、SwinIR、HAT、BasicVSR++、RVRT 和 VRT）放大並修復簡短的影片片段，並將所有結果並排比較。',
      metaTitle: 'AI 影片修復工具：線上比較 6 種放大模型 | Media Manipulator',
      metaDescription: '免費 AI 影片修復工具。讓簡短片段在我們自己的 GPU 上通過 Real-ESRGAN、SwinIR、HAT、BasicVSR++、RVRT 和 VRT 超解析度模型處理，並將所有結果打包下載。',
      ogTitle: 'AI 影片修復：比較 Real-ESRGAN、SwinIR、HAT、BasicVSR++、RVRT 與 VRT',
      ogDescription: '從你的影片選取片段、選擇修復模型，然後下載包含每個增強版本與原始影片的單一套件，進行 A/B 比較。',
      intro: '影片修復模型彼此的結果並不一致。像 Real-ESRGAN 這樣的 GAN 放大器能給你清晰的單一影格，但在動態中可能出現閃爍；像 VRT 這樣的影片 Transformer 能讓序列保持穩定，卻可能讓細節變柔。唯一誠實的選擇方法，就是讓同一段畫面通過所有模型，然後親眼比較。本頁正是對最長 15 秒的片段這麼做：擷取影格，在我們自己的 GPU 上執行你從六種模型中選出的模型，將每個結果以來源影格率連同原始音訊重新合成為 MP4，並把所有內容（包括未經處理的片段）打包成一個封存檔，供你並排比較。下方的每個數字都來自目前實際運作的處理流程。',
      whatItDoes: [
        '以影格精確度裁剪你選取的片段（0.5 到 15 秒，依你的影格率最多 450 個影格），並連同其音訊。',
        '執行 Real-ESRGAN、SwinIR、HAT、BasicVSR++、RVRT 與 VRT 的任意組合；前三者逐格增強，後三者將序列作為整體修復。',
        '來源在 540p 以下時選擇 4x，高於此則選擇 2x，因為每個模型都執行其原生 4x 網路，2x 結果是在合成時以 Lanczos 縮小而成。',
        '以 libx264、CRF 16 及精確的來源影格率分數合成每個結果，並重新附加音訊。',
        '將 original/clip.mp4、每個模型各一個資料夾、逐格模型可選的增強 PNG 影格、manifest.json 與 README.txt 打包成一個 tar.gz。',
        '某個模型失敗時會繼續執行：它的資料夾會有 FAILED.txt，清單檔會記錄原因，其他所有結果仍會交付。',
      ],
      flowSteps: [
        {
          title: '上傳影片',
          description: '最大 1920 x 1080；較長的來源也沒問題，因為只有片段會被處理。',
        },
        {
          title: '選取片段',
          description: '拖曳控點選取最長 15 秒；建議 10 秒以內，超過時選取器會提出警告。',
        },
        {
          title: '選擇模型以及是否包含影格',
          description: '六種模型任選；選取器會根據伺服器公布的每影格秒數，顯示每個模型的預估時間。',
        },
        {
          title: '查看各個階段',
          description: '下載、探測、擷取片段、擷取影格，然後由快到慢依序執行每個模型，最後打包。',
        },
        {
          title: '比較並下載',
          description: '在檢視器中將每個模型的 MP4 與原始影片並排播放，然後趁 6 小時的連結仍有效時取得封存檔。',
        },
      ],
      advancedDetails: [
        '參考片段以 ffmpeg -ss START -i source -t WINDOW -c:v libx264 -crf 10 -preset medium -pix_fmt yuv420p -c:a aac 裁切，接著以 -vsync 0 將影格擷取為編號的 PNG；如果數量超過 450，多出的影格會被捨棄。',
        'Real-ESRGAN 以 realesrgan-x4plus 模型、縮放倍率 4 與 256 px 圖塊執行 realesrgan-ncnn-vulkan。SwinIR 使用 003_realSR_BSRGAN SwinIR-L x4 GAN 權重，HAT 使用 Real_HAT_GAN_SRx4，兩者都透過分塊推論（320 px 圖塊、32 px 重疊）執行，讓 1080p 影格能放進記憶體。',
        'BasicVSR++ 透過 mmagic 以每 16 個影格為一個視窗執行 REDS4 c64n7 生成器；RVRT（001_RVRT_videosr_bi_REDS_30frames）與 VRT（001_VRT_videosr_bi_REDS_6frames）透過各自的 KAIR 測試指令碼執行，時間分塊分別為 30 與 12 個影格，空間圖塊為 128 x 128。',
        '合成方式一致：ffmpeg -framerate FPS_FRACTION -i frames/%06d.png [-i clip.mp4 -map 0:v -map 1:a -c:a aac] [-vf scale=iw/2:ih/2:flags=lanczos] -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -movflags +faststart -shortest。影格率分數（例如 30000/1001）直接取自 ffprobe，讓音訊保持同步。',
        '模型以固定順序執行：Real-ESRGAN、BasicVSR++、SwinIR、RVRT、HAT、VRT，在 GPU 排程器租約下運作，VRAM 預算分別為 3、11、9、12、10 與 14 GB；全伺服器一次只執行一個修復工作，每個模型的逾時為 75 分鐘。',
        '選取器拿來乘以你影格數的公布每影格預估值為 0.8 秒（Real-ESRGAN）、1.0 秒（BasicVSR++）、3.0 秒（RVRT）、3.5 秒（SwinIR）、5.0 秒（HAT）與 7.0 秒（VRT）；這些是可能變動的伺服器端預設值，而不是對你片段的實測。',
        '高於 1080p 的來源會拒絕明確指定的 4x，因為輸出會超過 4K；自動模式在 541p 到 1080p 時選擇 2x，在 540p 以下時選擇 4x。即使在 2x 路徑上，包含的影格也是原生 4x PNG，所以 1080p 來源會產生 7680 x 4320 的影格。',
      ],
      whyItMatters: [
        '沒有任何單一修復模型能在所有畫面上勝出，而靜態影格比較會掩蓋只有播放時才會顯現的閃爍。',
        '讓 10 秒片段通過每個模型只需要幾分鐘的 GPU 時間，就能告訴你哪個模型值得在其他地方進行完整長度的處理。',
        '數位化的錄影帶、早期數位相機片段與壓縮過的社群匯出檔各有不同的劣化方式，適合的模型家族也不同。',
      ],
      useCases: [
        {
          title: '老家庭影片',
          description: '在修復整卷影片之前，先看看哪個模型能在 480p 的錄影帶轉檔上還原臉部與布料。',
        },
        {
          title: '檔案影片',
          description: '在 360p 和 480p 素材上測試 4x，並在你自己的螢幕上評判 4K 等級的輸出。',
        },
        {
          title: '長時間算繪前的模型選擇',
          description: '透過具代表性的 10 秒測試，為長達數小時的工作挑選模型。',
        },
        {
          title: '壓縮過的下載檔',
          description: '在充滿區塊雜訊的社群媒體匯出檔上，比較 GAN 銳化與 Transformer 的穩定性。',
        },
        {
          title: '時間穩定性檢查',
          description: '並排播放各模型的 MP4，找出靜態影格會掩蓋的閃爍與忽明忽暗。',
        },
      ],
      workedExamples: [
        {
          title: '一段 8 秒、640 x 480 的家庭影片通過全部六種模型',
          body: '輸入：一個來自數位化錄影帶、29.97 fps、附音訊的 640 x 480 MP4。設定：8 秒片段、全部六種模型、包含增強影格、自動縮放。處理流程會裁切出 8 秒的參考片段並擷取 240 個影格（8 x 29.97，四捨五入）。在 480p 下自動規則會選擇 4x，所以每個模型都會寫出 2560 x 1920 的影格，合成後的 MP4 為 2560 x 1920、30000/1001 fps，並保留原始音訊。選取器的預估值是影格數乘以公布的每影格秒數：Real-ESRGAN 約 3.2 分鐘、BasicVSR++ 4 分鐘、RVRT 12 分鐘、SwinIR 14 分鐘、HAT 20 分鐘、VRT 28 分鐘；由於模型依序執行，總計約 81 分鐘。包含影格會在封存檔中加入 3 x 240 張 2560 x 1920 的 PNG，這就是下載量以 GB 而非 MB 計算的原因。',
        },
        {
          title: '一段 10 秒的 1080p 片段，以自動縮放搭配 Real-ESRGAN 與 BasicVSR++',
          body: '輸入：一個 90 MB、30 fps 的 1920 x 1080 MP4，這是本工具接受的最大來源解析度。設定：10 秒片段、Real-ESRGAN 與 BasicVSR++、不包含影格、自動縮放。擷取會產生 300 個影格，在 450 的上限之內（若為 60 fps，同樣的上限會將片段限制為 7.5 秒）。高於 540p 時自動模式選擇 2x，所以每個模型仍會執行其原生 4x 網路，產生 7680 x 4320 的影格，合成時則套用 scale=iw/2:ih/2:flags=lanczos，輸出 CRF 16 的 3840 x 2160 MP4。根據公布的預估值，Real-ESRGAN 約 4 分鐘（0.8 秒 x 300），BasicVSR++ 約 5 分鐘（1.0 秒 x 300），因此這個工作會遠在每個模型 75 分鐘的逾時之前完成，封存檔中包含兩個 4K MP4、原始片段、manifest.json 與 README.txt。',
        },
      ],
      whenNotToUse: '不要用本頁修復整部影片；這是一個上限為 15 秒與 450 個影格的比較工具，即使只是這樣，封存檔也可能達到數 GB。不要期望它能憑空創造從未錄下的內容：嚴重的動態模糊、極端的壓縮區塊與非常暗的畫面會有所改善，但不會變得完美無瑕。高於 1920 x 1080 的來源會被拒絕，因為修復的目標是低解析度素材，而 1080p 的 2x 已經是 4K。如果你的片段只需要更小的檔案、轉換格式或裁剪，壓縮器、轉換器與裁剪工具幾秒內就能完成，不需要 GPU。',
      whyMediaManipulator: [
        '一次上傳就能使用六種研究級模型，權重、圖塊大小與合成指令都直接寫在本頁上，而不是藏在品牌名稱背後。',
        '一切都在我們自己的 GPU 上執行；你的畫面絕不會送到第三方 AI 供應商，也不會用於任何訓練。',
        '一次修復會消耗你每日 AI 工作額度中的一次 AI 工作，預設沒有帳號時每天 3 次，使用免費帳號則為 10 次，且每個工作階段每小時最多啟動 2 次；失敗的工作會退還額度。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ],
      privacyNote: '你上傳的檔案會從瀏覽器送到我們的儲存貯體，再下載到我們自己的 GPU 伺服器，由 FFmpeg 裁切片段，六種模型則以本機處理程序執行；過程中沒有任何外部 AI 供應商參與，也不會用於任何訓練。只有選取的片段會被解碼為影格，來源的其餘部分從不處理。來源物件、工作用影格、為比較檢視器保留的各模型 MP4，以及結果封存檔，全都登記在保留記錄中，並在保留期限結束時刪除，封存檔連結則會在 6 小時後到期。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。修復工作不會執行標準轉換所進行的自動內容分析。',
      faq: [
        {
          question: '哪個 AI 影片放大模型最好？',
          answer: '這取決於畫面，這正是本工具存在的原因。Real-ESRGAN 和 HAT 等 GAN 放大器能產生清晰的影格，但在動態中可能閃爍；BasicVSR++、RVRT 和 VRT 等序列模型會利用相鄰影格維持穩定，看起來可能較柔和。讓你自己的片段通過這些模型，並在播放中評判。',
        },
        {
          question: '為什麼片段限制為 15 秒與 450 個影格？',
          answer: '修復的每影格成本很高：光是 VRT 在 4x 下公布的預估值就是每影格 7 秒。影格上限會依你實際的影格率檢查，所以 60 fps 的來源會限制為 7.5 秒。在其他地方進行較長的修復之前，短片段就足以評判品質。',
        },
        {
          question: '2x 與 4x 的選擇如何運作？',
          answer: '自動模式在來源為 540p 以下時選擇 4x，高於此則選擇 2x。無論如何，每個模型都會執行其原生 4x 網路；在 2x 路徑上，合成時會以 Lanczos 濾鏡將影格縮小一半。高於 1080p 時會拒絕明確指定的 4x，因為輸出會超過 4K。',
        },
        {
          question: '修復後的影片會保留我的音訊與影格率嗎？',
          answer: '會。片段連同音訊一起裁切，每次合成都使用 ffprobe 提供的精確影格率分數（例如 30000/1001），並將該音訊重新附加為 AAC，所以所有結果都能對齊，方便 A/B 播放比較。',
        },
        {
          question: '結果封存檔包含什麼？有多大？',
          answer: 'original/clip.mp4、每個模型各一個內含其 MP4 的資料夾（若選擇包含影格，Real-ESRGAN、SwinIR 和 HAT 的資料夾還會包含每張原生 4x 的增強 PNG）、含有耗時與尺寸的 manifest.json，以及 README.txt。開啟影格時，10 秒片段的每個模型會增加數百張大型 PNG，所以預計會有數 GB。',
        },
        {
          question: '如果某個模型失敗或逾時會怎樣？',
          answer: '工作會繼續。該模型的資料夾會有記載原因的 FAILED.txt，manifest.json 也會記錄下來，其他每個選取的模型仍會包含在封存檔中。只有所有選取的模型都失敗時，工作才會失敗。',
        },
        {
          question: '一次修復需要多久？',
          answer: '影格數乘以每個模型的預估值，再加總你選取的模型，因為它們依序執行：Real-ESRGAN、BasicVSR++、RVRT、SwinIR、HAT 和 VRT 分別為每影格 0.8、1.0、3.0、3.5、5.0 和 7.0 秒。一段 300 個影格的片段通過全部六種模型約需 100 分鐘；只用 Real-ESRGAN 則約 4 分鐘。',
        },
        {
          question: '我可以執行多少次修復？會消耗 AI 工作嗎？',
          answer: '開始一次修復會消耗一次 AI 工作：預設沒有帳號時每天 3 次、免費帳號 10 次、Premium 100 次、Pro 200 次，另外每個工作階段每小時最多啟動 2 次。完全失敗的工作會退還額度。即時數字請見價格頁面。',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '片段上限為 15 秒或 450 個影格（依你影片的影格率取較小者）；建議 10 秒以內。',
          '來源解析度上限為 1920×1080：修復的目標是低解析度畫面，而 1080p 的 4x 輸出已經超過 4K。',
        ],
        processingNotes: [
          '模型由快到慢執行（Real-ESRGAN 最先，VRT 最後），讓部分結果能及早產生。',
          '單一模型失敗絕不會拖垮整個工作：它的資料夾會包含 FAILED.txt，其他結果仍可下載。',
          '下載連結的有效期為 6 小時；包含增強影格時，封存檔可能很大。',
        ],
      },
      related: [
        {
          label: '裁剪影片',
          to: '/tools/video-trimmer',
          description: '在上傳前裁出你想修復的片段。',
        },
        {
          label: 'AI 圖片修復',
          to: '/tools/ai-image-restoration',
          description: '針對單張相片或影格的相同模型家族。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '縮小修復後的 4K 結果以便分享。',
        },
        {
          label: '轉碼為 HLS',
          to: '/tools/transcode-to-hls',
          description: '將修復後的片段封裝為自適應串流。',
        },
        {
          label: '影片轉錄',
          to: '/tools/transcribe-video',
          description: '為修復後的畫面加上字幕。',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '將修復後的片段剪輯成更長的作品。',
        },
      ],
      embed: {
        title: 'AI 影片修復',
        description: '上傳影片，拖曳選取一段簡短的片段（10 秒以內效果最好），選擇你想比較的修復模型，然後下載包含每個增強結果的單一套件。',
      },
    },
    'ai-image-restoration': {
      name: 'AI 圖片修復與放大',
      h1: 'AI 圖片修復與放大工具',
      tagline: '使用最多八種 AI 模型清理、放大並修復相片：保真預清理（FBCNN、SCUNet、NAFNet）、通用放大器（Real-ESRGAN、SwinIR、HAT）以及人臉增強（GFPGAN、CodeFormer），並將每個結果與原圖比較。',
      metaTitle: 'AI 圖片修復與放大器：線上比較 8 種模型 | Media Manipulator',
      metaDescription: '免費 AI 相片修復與放大。去除 JPEG 壓縮瑕疵、降噪並去模糊，然後用 Real-ESRGAN、SwinIR 或 HAT 放大到 4K/8K，再用 GFPGAN/CodeFormer 增強人臉，全部在我們自己的 GPU 上完成，並可並排比較。',
      ogTitle: 'AI 圖片修復與放大：預先清理、放大並增強臉部',
      ogDescription: '上傳一張圖片，可選擇裁切、可選擇預先清理，然後執行多個放大與臉部模型，並將每個結果與原圖內嵌比較。',
      intro: 'AI 圖片修復會讓一張相片通過最多八種模型組成的可設定處理流程，並將每個結果與原圖並排顯示。保真的預先清理階段（FBCNN 處理 JPEG 瑕疵、SCUNet 處理雜訊、NAFNet 處理動態模糊）會去除劣化而不捏造細節；接著通用放大器（Real-ESRGAN、SwinIR、HAT）將圖片放大 2x 或 4x；可選的臉部增強（GFPGAN、CodeFormer）則會重建臉部。預先清理是非生成式的：它過濾的是原本就存在的訊號。臉部增強是生成式的：它會合成看似合理的細節，絕不能視為對來源的忠實還原。每個模型都在我們自己的 GPU 伺服器上執行。',
      whatItDoes: [
        '讓你拖曳選取裁切範圍，把像素預算與 GPU 時間用在你在意的區域；裁切在伺服器端套用於自動轉正後的原圖，因此不會在瀏覽器中損失任何畫質。',
        '可選擇先進行預先清理，順序一律為 FBCNN、SCUNet、NAFNet，每個模型都處理前一個模型的輸出；清理後的圖片會成為之後每個模型的起點。',
        '以 2x 或 4x 執行 Real-ESRGAN、SwinIR 與 HAT 的任意組合。這三者都是原生 x4 網路；2x 結果是將 x4 輸出以 Lanczos 濾鏡縮小到 50%。',
        '可選擇執行 GFPGAN v1.4，並在伺服器啟用時執行帶有保真度權重的 CodeFormer，處理對象是來源圖片；開啟「串接」時，也會處理每個放大器的結果。',
        '將處理過的原圖、每張輸出 PNG、manifest.json 與 README 打包成一個 .tar.gz，並在從工作提供封存檔的同時顯示內嵌比較網格。',
        '將失敗的模型記錄為失敗項目，並附上可安全顯示給使用者的原因，同時仍打包每個成功的結果。',
      ],
      flowSteps: [
        {
          title: '上傳圖片',
          description: 'PNG、JPEG、WebP、TIFF 或 BMP，每邊最多 12,000 像素；主要對象是老舊、尺寸小與過度壓縮的相片。',
        },
        {
          title: '裁切或保留整個畫面',
          description: '拖曳選取一個區域（一張臉、一塊車牌、一個招牌），或不裁切以修復整張圖。',
        },
        {
          title: '選擇預先清理、放大器、臉部與縮放倍率',
          description: '勾選你想要的模型；選取器會顯示這些選擇將產生幾個輸出（上限為 12 個）。',
        },
        {
          title: '查看各個階段',
          description: '工作會排隊等待唯一的修復槽位，處理圖片，然後執行每個單元，各自顯示進度與失敗標記。',
        },
        {
          title: '比較並下載',
          description: '每個結果都在網格中與原圖並排；決定哪個處理流程勝出後，就下載封存檔。',
        },
      ],
      advancedDetails: [
        '處理階段會以 ImageMagick -auto-orient 轉為正規化的 PNG，讀取其尺寸，拒絕任何超過 12,000 x 12,000 的圖片，將你正規化的裁切矩形轉換為整數像素，並寫出 working_source.png。該檔案也會在結果中儲存為 original.png，所以你用來比較的正是模型實際收到的內容。',
        '當裁切範圍高度為 540 像素以下時，自動縮放選擇 4x，否則選擇 2x。無論縮放倍率為何，輸出都會對照 67,108,864 像素（約 64 百萬像素）的預算檢查：一張 6,000 x 4,000 的完整圖片在 2x 下為 96 百萬像素，會被拒絕，並提示你選擇 2x 或較小的裁切範圍。',
        'Real-ESRGAN 透過 realesrgan-ncnn-vulkan 以 256 像素圖塊執行 realesrgan-x4plus 網路。SwinIR 使用 003_realSR_BSRGAN SwinIR-L x4 GAN 權重，HAT 使用 Real_HAT_GAN_SRx4 權重，兩者都透過與 AI 影片修復相同的逐影格指令碼執行，使用 320 像素圖塊與 32 像素重疊，所以大型裁切範圍絕不會超出 GPU 記憶體。',
        '預先清理權重為 fbcnn_color.pth、scunet_color_real_psnr.pth（以 PSNR 訓練的真實雜訊模型，而非會捏造紋理的 GAN 版本）與 NAFNet-GoPro-width64.pth（動態去模糊，而非失焦）。它們以 512 像素圖塊與 32 像素重疊執行，絕不改變尺寸。除非你設定 1 到 100 的值，否則 FBCNN 會盲目預測 JPEG 品質係數；數字越低，表示假設壓縮越嚴重。',
        'GFPGAN 使用乾淨的 v1.4 架構，並停用背景放大，所以臉部以外的區域只會依縮放倍率單純調整大小，而不經模型增強；這讓比較保持誠實。CodeFormer 接受 0 到 1 的保真度權重 w（預設 0.7）：越低越美化，越高越接近輸入。CodeFormer 採用非商業授權，並受一個預設關閉的伺服器旗標控制。',
        '「串接」除了處理來源之外，還會以 1x 對每個放大器的輸出重新執行每個臉部模型，所以輸出數量為：預先清理 + 通用 + 臉部 + 臉部 x 通用。伺服器將每個工作限制為 12 個輸出，一次執行一個修復工作，並給每個模型 1,800 秒，超過即標示為逾時。',
        '伺服器根據自己的每百萬像素秒數預設值估算每個模型的執行時間：FBCNN 3、SCUNet 8、NAFNet 6、Real-ESRGAN 2、SwinIR 12、HAT 18、GFPGAN 6、CodeFormer 8。這些數值用於進度權重與 UI 預估；它們是調校值，不是保證。',
        '結果不會上傳到物件儲存空間：.tar.gz 與結果 PNG 會保留在工作的輸出資料夾中，並在保留期限內從工作提供。',
      ],
      whyItMatters: [
        '沒有任何單一模型能在每張相片上勝出：去除瑕疵、降噪、放大與臉部重建各自修復不同的損傷，正確的順序取決於圖片是如何劣化的。',
        '對一次上傳執行多個模型並並排檢視，能在你投入更大批次之前，回答「該用哪一個、用多少倍？」這個問題。',
        '非生成式與生成式的區別很重要：預先清理的圖片是證據經過濾波的副本，臉部增強的圖片則是看似合理的重建，而本頁會標示哪個是哪個。',
      ],
      useCases: [
        {
          title: '修復老舊或掃描的相片',
          description: '先清除掃描器雜訊與壓縮瑕疵，然後放大，並可依你的選擇重建臉部。',
        },
        {
          title: '增強低解析度靜態圖片',
          description: '裁切到感興趣的區域、去除瑕疵並放大；串接臉部增強可提升清晰度，但絕不能作為身分辨識證據。',
        },
        {
          title: '修正壓縮過的下載檔',
          description: '經過大量重複壓縮的社群匯出檔，先用 FBCNN 再用 SCUNet，接著用 GAN 放大器，效果很好。',
        },
        {
          title: '在批次處理前比較放大器',
          description: '讓一張具代表性的圖片通過 Real-ESRGAN、SwinIR 與 HAT，為更大的圖片集選擇模型。',
        },
        {
          title: '把預算用在一個區域',
          description: '只拖曳選取一張臉或一個招牌，讓 64 百萬像素的預算與 GPU 時間用在刀口上。',
        },
      ],
      workedExamples: [
        {
          title: '一張 1,200 x 800 的 JPEG（約 350 KB），完整畫面、自動縮放、FBCNN + Real-ESRGAN + GFPGAN',
          body: '裁切範圍是完整的 0.96 百萬像素畫面，高度 800 像素超過 540，所以自動縮放決定為 2x。FBCNN 先以 1x 執行，其輸出成為工作來源。Real-ESRGAN 以 realesrgan-x4plus 將其放大到 4,800 x 3,200，接著 ImageMagick 以 Lanczos 縮小到 50%，得到 2,400 x 1,600 的 PNG。GFPGAN 以放大倍率 2 在預先清理後的來源上執行，產生另一張 2,400 x 1,600 的 PNG，臉部經過重建，其餘部分則單純調整大小。這是允許的 12 個輸出中的三個。根據伺服器自己的每百萬像素預估值，模型時間約為 0.96 x (3 + 2 + 6)，大約 11 秒，再加上幾秒的處理與打包；等待唯一的修復槽位可能會更久。一個工作消耗一次 AI 工作。',
        },
        {
          title: '從一張 640 x 480 靜態圖片裁切出 300 x 400 的臉部，預先清理、三種放大器、GFPGAN 搭配串接',
          body: '裁切範圍為 0.12 百萬像素、高 400 像素，所以自動縮放選擇 4x，每個放大結果都是 1,200 x 1,600（1.92 百萬像素），遠在 64 百萬像素的預算之內。使用 FBCNN 與 SCUNet 預先清理、Real-ESRGAN、SwinIR 與 HAT，以及串接的 GFPGAN，這個工作會產生 2 + 3 + 1 + 1 x 3 = 9 個輸出：兩個預先清理步驟、三個放大結果、在清理後的來源上執行的 GFPGAN，以及以 1x 在每個放大結果上執行的 GFPGAN。根據伺服器的預估值，在 0.12 百萬像素上的預先清理與放大處理各只需幾秒，而三次串接的臉部處理在 1.92 百萬像素的結果上執行，所需時間也按比例更長。每個臉部輸出在清單檔中都帶有生成式註記，因為你在那些臉上看到的是重建，而不是還原。',
        },
      ],
      whenNotToUse: '不要將臉部增強用於身分辨識：GFPGAN 和 CodeFormer 根據學習到的先驗繪製看似合理的臉部，所以重建出的臉頂多是一條線索，絕不能證明照片中是誰。已經很大且清晰的圖片不適合使用本工具，因為 2x 處理大多只會增加 GAN 紋理；每邊超過 12,000 像素的相片也會被拒絕。如果你只需要把乾淨的圖片放大，不需要預先清理、臉部模型或比較網格，AI 圖片放大器更省時間。如果你的損傷是失焦模糊而不是動態模糊，NAFNet 的 GoPro 權重並不是適合的模型。',
      whyMediaManipulator: [
        '一次上傳就能使用八種研究模型，不需要管理筆記本、CUDA 設定或權重檔案。',
        '每個模型都在我們營運的 GPU 伺服器上執行；圖片不會傳送到第三方 AI 服務。',
        '本頁誠實地保持區別：預先清理的輸出帶有保真註記，臉部輸出帶有生成式註記，而處理過的原圖一律顯示在網格中。',
      ],
      privacyNote: '你的圖片會儲存在其工作資料夾中，由 ImageMagick 自動轉正並裁切為工作用 PNG，再由選取的模型在我們自己的 GPU 上處理。工作結束時，上傳資料夾與工作目錄樹會被刪除；隨工作保留的是處理過的原圖、每張結果 PNG、清單檔與打包好的 .tar.gz，從工作提供下載並供比較網格使用。臉部模型的輸出在該清單檔中標示為生成式重建。沒有任何第三方 AI 供應商會收到圖片。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      faq: [
        {
          question: '預先清理與放大或臉部模型有什麼不同？',
          answer: '預先清理模型（FBCNN、SCUNet、NAFNet）是非生成式的：它們以 1x 過濾既有訊號，去除壓縮瑕疵、雜訊與動態模糊。放大器提高解析度，而臉部模型（GFPGAN、CodeFormer）是生成式的，會合成看似合理的臉部細節。預先清理的輸出是忠實的過濾圖片；臉部輸出則是重建。',
        },
        {
          question: '增強後的臉可以作為身分辨識證據嗎？',
          answer: '不可以。GFPGAN 和 CodeFormer 根據學習到的先驗產生看似合理的臉，它們不會還原真實的臉。正因如此，清單檔會為每個臉部輸出加上生成式註記。請只將它們用於提升視覺清晰度與作為線索。',
        },
        {
          question: '為什麼無論我勾選什麼，預先清理模型都以固定順序執行？',
          answer: '壓縮瑕疵必須在降噪之前去除，否則降噪器會把區塊雜訊當成訊號；而去模糊在最乾淨的輸入上效果最好，所以伺服器一律先執行 FBCNN，再執行 SCUNet，然後是 NAFNet，每個都處理前一個結果。如果其中一個失敗，下一個會從最後一個成功的步驟繼續。',
        },
        {
          question: '自動模式如何決定 2x 或 4x？尺寸上限是多少？',
          answer: '當裁切範圍高度最多 540 像素時，自動模式選擇 4x，否則選擇 2x。接著輸出會對照約 64 百萬像素（67,108,864 像素）的預算檢查；超過的要求會被拒絕，並顯示百萬像素數，建議你選擇 2x 或較小的裁切範圍。任一邊超過 12,000 像素的來源會在此之前就被拒絕。',
        },
        {
          question: '「串接」對輸出數量有什麼影響？',
          answer: '開啟「串接」時，每個臉部模型也會以 1x 在每個放大器的結果上執行，所以輸出數 = 預先清理 + 通用 + 臉部 + 臉部 x 通用。兩個放大器與兩個臉部模型加上串接，在任何預先清理之前就是 2 + 2 + 4 = 8 個輸出；伺服器每個工作允許 12 個。',
        },
        {
          question: '如果某個圖片模型失敗或逾時會怎樣？',
          answer: '工作會繼續。該單元會被標示為失敗，並附上可安全顯示給使用者的原因（例如 1,800 秒後逾時，建議使用較小的裁切範圍或 2x），清單檔會記錄下來，其他每個結果仍會打包並顯示。只有每個選取的模型都失敗時，工作才會失敗，屆時會退還該次 AI 工作。',
        },
        {
          question: '為什麼 CodeFormer 呈現灰色？',
          answer: 'CodeFormer 的授權僅限非商業用途，所以它受一個預設關閉的伺服器旗標控制；此時功能資訊會回報它目前已停用。GFPGAN 與三種預先清理模型都採用寬鬆授權，只要安裝了權重就能使用。',
        },
        {
          question: '我可以執行多少次修復？是免費的嗎？',
          answer: '開始一次修復會消耗一次 AI 工作：預設訪客每天 3 次、免費帳號 10 次、Premium 100 次、Pro 200 次，無論你在該工作中勾選多少模型。另外還有每個工作階段每小時最多啟動 6 次的專屬限制。上傳上限為訪客 200 MB、免費帳號 1 GB；/pricing 會顯示目前的數字。',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '輸出受像素預算（約 64 百萬像素）限制，遠超過 8K；如果裁切範圍與縮放倍率會超出預算，請選擇 2x 或較小的裁切範圍。',
          '預先清理模型絕不改變尺寸（1x）；只有通用放大器會改變解析度。',
        ],
        processingNotes: [
          '預先清理一律最先以固定順序執行（FBCNN → SCUNet → NAFNet）；清理後的圖片會成為其他每個模型的基底。',
          '單一模型失敗絕不會拖垮整個工作：它的項目會顯示原因，其他結果仍可下載。',
          '臉部增強是生成式重建：請將它用於提升清晰度與作為線索，而非身分辨識證據。',
        ],
      },
      related: [
        {
          label: 'AI 影片修復',
          to: '/tools/ai-video-restoration',
          description: '動態影像的姊妹工具：在短片段上使用相同的放大器。',
        },
        {
          label: 'AI 圖片放大器',
          to: '/tools/ai-image-upscaler',
          description: '只需要更大的圖片時，進行單次 Real-ESRGAN 處理。',
        },
        {
          label: '移除背景',
          to: '/tools/remove-background-from-image',
          description: '修復後將主體去背。',
        },
        {
          label: '壓縮圖片',
          to: '/tools/compress-image',
          description: '縮小修復後的 PNG 以便分享。',
        },
        {
          label: '圖片尺寸調整',
          to: '/tools/image-resizer',
          description: '將修復後的圖片調整為精確尺寸。',
        },
        {
          label: '移除 EXIF 中繼資料',
          to: '/tools/remove-exif-metadata',
          description: '在發布前移除結果中的中繼資料。',
        },
      ],
      embed: {
        title: 'AI 圖片修復與放大',
        description: '上傳圖片，可選擇裁切到某個區域、可選擇先進行預先清理，挑選你想比較的放大與臉部增強模型，然後下載包含每個結果的單一套件。',
      },
    },
    'ai-document-scan': {
      name: 'AI 文件掃描',
      h1: 'AI 文件掃描：將掃描頁面與手寫內容轉為可搜尋的 PDF／Word',
      tagline: '將掃描文件和手寫筆記變成可搜尋的多頁 PDF 和可編輯的 Word 文件：印刷頁面會取得忠實的 Tesseract 文字層，手寫內容由視覺 AI 轉錄，並標出不確定之處，絕不憑空捏造。',
      metaTitle: 'AI 文件掃描：將掃描頁面和手寫內容轉為 PDF/Word | Media Manipulator',
      metaDescription: '免費 AI 文件掃描：將掃描圖片轉換為可搜尋的 PDF 和圖片轉 Word OCR，並將手寫筆記轉錄為文字。可調整頁面順序，印刷體與手寫混合也沒問題，全部在我們自己的 GPU 上完成，忠於原文並標出不確定之處。',
      ogTitle: 'AI 文件掃描：從掃描影像與手寫內容產生可搜尋的 PDF + Word',
      ogDescription: '上傳一張或多張掃描頁面（印刷或手寫），調整順序，即可取得可搜尋的 PDF 與可編輯的 DOCX。印刷頁面保持忠實；手寫內容逐字轉錄，並保留 [illegible]/[?] 標記。',
      intro: 'AI 文件掃描能將一張或多張拍攝或掃描的頁面變成可搜尋的多頁 PDF，並可依你的要求產生可編輯的 Word 文件。它以不同方式處理兩種頁面，並告訴你哪一頁屬於哪一種。印刷或打字的頁面會經過 OCRmyPDF 與 Tesseract：輸出頁面就是你未經更動的掃描影像，下方有一層隱形文字層，讓你能搜尋、選取與複製。手寫頁面則由在我們自己的 GPU 上執行的視覺語言模型讀取，它會逐字轉錄筆跡，將無法辨識的部分標記為 [illegible]（無法辨識），將有疑問的字包成 [?: best guess]（括號內為最可能的讀法），並被指示絕不補完、修正或整理任何內容。單一工作可以逐頁混合兩種頁面，並依你設定的順序排列，結果會列出每一頁使用的引擎與信心度。',
      whatItDoes: [
        '每個工作最多接受 50 張頁面圖片（PNG、JPEG、WebP、TIFF、BMP 或 HEIC，預設每張 25 MB），將每張正規化為直立的 PNG，並讓你先拖曳排列閱讀順序。',
        '在自動模式下，會針對每一頁向視覺模型詢問一個問題（印刷還是手寫？），並據此分派頁面；印刷模式與手寫模式則直接指定答案。',
        '建立 PDF/A：每個印刷頁面都是原始掃描影像加上 Tesseract 文字層，每個手寫頁面則是掃描影像加上逐行放置的隱形機器轉錄層，並附有說明此事的可見頁尾。',
        '可選擇建立 Word 文件：印刷頁面由 PaddleOCR-VL（或 Docling）重建為標題、清單與表格，手寫頁面則是置於粗體「請對照掃描影像核對」註記之下的逐字轉錄，最後由 Pandoc 產生檔案。',
        '逐頁回報使用的引擎、高、中或低的信心度，以及不確定標記的數量，讓你知道該檢查哪裡。',
        '當伺服器啟用相關引擎時，可執行只重新讀取被標記字詞的驗證處理、將分歧標記為 [?: vlm | other] 的獨立第二意見，以及另外標示的 AI 摘要。',
      ],
      flowSteps: [
        {
          title: '加入你的頁面',
          description: '每個檔案放入一張頁面圖片，可以是印刷、手寫或兩者混合，並拖曳排列順序。',
        },
        {
          title: '選擇模式與輸出',
          description: '自動、印刷或手寫；一律產生 PDF，Word 為選用；印刷頁面的 Tesseract 語言；印刷文字 OCR 的校正歪斜與自動旋轉。',
        },
        {
          title: '準備與讀取',
          description: '頁面會自動轉正；手寫頁面在模型讀取前會先以 Real-ESRGAN 放大 2x；印刷頁面則在 PDF 步驟中等待 Tesseract 處理。',
        },
        {
          title: '建立檔案',
          description: 'OCRmyPDF 與 reportlab 製作每一頁的 PDF，pikepdf 將它們合併；Word 文件則由 Pandoc 從 Markdown 組合而成。',
        },
        {
          title: '檢閱並下載',
          description: '檢視器會開啟 PDF；下載 PDF、你要求的 Word 檔案，以及記錄每一頁引擎與信心度的清單檔。',
        },
      ],
      advancedDetails: [
        '印刷頁面：正規化的 PNG 會以 img2pdf 無損封裝，接著 OCRmyPDF 以你的語言代碼執行 Tesseract，勾選時啟用 deskew 與 rotate_pages，並使用 output_type pdfa 與 force_ocr，將文字層寫在影像下方。如果 OCRmyPDF 在某一頁失敗，會保留只有影像的頁面，所以 PDF 仍然完整。',
        '手寫頁面：模型是由 Ollama 以溫度 0.1 提供的 qwen3-vl（8B、instruct、q8_0 量化），提示詞要求它逐字轉錄、保留換行、標記 [illegible] 與 [?: guess]、註明 (arrow)（箭頭）或 (circled)（圈起）等記號，並傳回包含完整文字與每行一個邊界框的 JSON。',
        '手寫 PDF 頁面以 reportlab 依影像的像素尺寸繪製：掃描影像是可見頁面，每行轉錄文字以文字算繪模式 3（可搜尋、從不繪出）放置在其邊界框中，字型為 Helvetica，大小依行高介於 6 到 48 點之間；若沒有傳回任何邊界框，則以整頁的隱形文字區塊作為備用；另有一行 8 點的灰色頁尾，內容為「Machine transcription, verify against original」（機器轉錄，請對照原件核對）。',
        '信心度是計算出來的，而非猜測：頁面沒有任何標記時為高，帶標記的行少於 15% 時為中，其他情況為低。驗證處理（預設開啟）會將頁面與草稿送回模型，指示它只解決被標記的字詞、不更動其他任何內容；如果驗證失敗，會保留草稿。',
        '手寫的預先清理是在 Vulkan GPU 上以縮放倍率 2 執行 realesrgan-x4plus，在自動與手寫模式下預設開啟，在印刷模式下關閉；這是盡力而為的處理，若失敗會保留原始圖片。Word 文件由 Pandoc 從 GitHub 風格的 Markdown 建立；可選的摘要使用另一個文字模型，並寫入它自己的檔案，附有 AI 產生的標示。',
        '預設情況下，伺服器一次執行一個文件工作，每次模型呼叫的上限為 40 分鐘，上傳檔案與工作資料夾會在工作結束的那一刻刪除；只有結果資料夾（PDF、DOCX、manifest.json、README.txt）會在保留期限內保留。',
      ],
      whyItMatters: [
        '頁面的照片在能被搜尋與引用之前，還稱不上文件。PDF 在不更動任何像素的情況下加入這項能力，所以掃描影像仍然是權威依據。',
        '自信地亂猜的手寫辨識比沒有還糟。明確的 [illegible] 與 [?: guess] 標記、逐頁信心度與可見標示，讓轉錄內容可以作為草稿使用，且絕不會被誤認為原件。',
        '印刷頁面與手寫頁面需要不同的引擎。在一個有順序的工作中，把每一頁分派到正確的引擎，才能讓一本含有印刷表格與手寫答案的筆記本輸出為單一檔案。',
      ],
      useCases: [
        {
          title: '可搜尋的文書',
          description: '掃描的合約、收據與表單會成為一份可搜尋、可複製文字的 PDF/A，頁面影像保持不變。',
        },
        {
          title: '田野與實驗筆記',
          description: '手寫筆記會成為可搜尋的 PDF 與 Word 草稿，每個不確定的字都會標記出來供你檢查。',
        },
        {
          title: '圖片轉 Word',
          description: '用手機拍攝的印刷頁面會成為可編輯的 .docx，並重建其標題、清單與表格。',
        },
        {
          title: '混合文件',
          description: '附有手寫答案的印刷問卷會經過兩種引擎，並以單一有序檔案傳回。',
        },
        {
          title: '檔案典藏',
          description: '舊的打字信件與會議記錄會加上文字層以便建立索引，而掃描影像維持原樣。',
        },
      ],
      workedExamples: [
        {
          title: '三張 300 dpi 的 A4 印刷頁面',
          body: '以印刷模式處理三張 2480 x 3508 的 JPEG 掃描影像，只輸出 PDF，語言為 eng，開啟校正歪斜與自動旋轉。過程中不涉及任何模型：每一頁先以 img2pdf 封裝，接著 OCRmyPDF 執行 Tesseract 並寫入隱形文字層、輸出 PDF/A，再由 pikepdf 將三頁合併為 document.pdf。文字層每頁只增加幾 KB，所以 PDF 大約與三張頁面圖片的大小相同（校正過的頁面會重新算繪，未更動的頁面則原樣嵌入）。這個工作會消耗一次 AI 工作（失敗時退還），耗時為 Tesseract 在 CPU 上逐頁處理的時間，再加上排隊等待的時間，因為預設一次只執行一個文件工作。',
        },
        {
          title: '兩張手機拍攝的手寫頁面，含 Word',
          body: '以自動模式處理兩張 4032 x 3024 的筆記本頁面手機照片，輸出 PDF 與 DOCX。準備階段將兩張照片自動轉正為 PNG，由於模式不是印刷，會以 realesrgan-x4plus 將它們放大 2x 至 8064 x 6048。分類階段針對每一頁向 qwen3-vl 詢問一個問題，辨識階段傳回逐行附邊界框的轉錄內容，驗證階段只重新讀取被標記的字詞。如果某一頁有 30 行，其中 2 行帶有 [?: ...] 標記，2 / 30 低於 15%，該頁就會被標示為中等信心度，illegibleCount 為 2。PDF 頁面是處理過的影像，在那些邊界框上放置隱形的 Helvetica 文字行，並附有頁尾標記；Word 檔案則在粗體驗證註記之下保存逐字文字。耗時為每頁在我們的 GPU 上依序進行三次視覺模型處理；沒有任何處理在其他地方執行。',
        },
      ],
      whenNotToUse: '當你需要不經檢查就具權威性的文字時，請不要使用本工具：手寫輸出是帶有標記缺漏的機器判讀，Word 文件與摘要都是重建內容，所以引用之前請對照掃描影像核對。它不是 PDF 對 PDF 的 OCR 工具：輸入是頁面圖片，所以請先將現有的 PDF 算繪為圖片；它也不是翻譯工具。如果你只需要把頁面裝訂成沒有文字層的 PDF，一般的圖片轉 PDF 工具會以一般工作而非 AI 工作完成，讓訪客每天三次的 AI 工作額度留給需要模型的工作。',
      whyMediaManipulator: [
        '印刷 PDF 在結構上就是忠實的：OCRmyPDF 將文字放在未經更動的頁面影像下方並輸出 PDF/A，沒有任何內容被重新繪製。',
        '手寫內容逐字轉錄並附有依據：提示詞禁止捏造，不確定之處會在文字中標記，信心度根據這些標記計算，而頁面會註明這是機器轉錄。',
        '每個引擎都是我們自己的：CPU 上的 Tesseract、透過 Ollama 執行的 qwen3-vl 與文字模型，以及在我們 GPU 上執行的 PaddleOCR-VL 與 Real-ESRGAN。沒有任何頁面會送到第三方 AI 服務。',
      ],
      privacyNote: '你的頁面圖片會儲存到 uploads/<jobId>/src/，正規化的副本則儲存到工作資料夾；手寫頁面會送到由 Ollama 在我們自己的 GPU 上提供的 qwen3-vl 模型，印刷頁面由 CPU 上的 Tesseract 讀取，而逐頁的轉錄草稿在工作執行期間會以 JSON 保存在該工作資料夾中。工作結束時，上傳檔案與工作資料夾都會立即刪除；保留下來的是 outputs/<jobId>/ 中的結果資料夾，內含 PDF、你要求的 Word 檔案、清單檔（逐頁的引擎、信心度與標記數量）以及 README，該資料夾會在保留期限結束時移除。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。轉錄文字存在於你下載的 PDF 文字層與 DOCX 中。不會傳送任何內容給第三方 AI 供應商，也不會用於任何訓練。',
      faq: [
        {
          question: 'PDF 與 Word 文件有什麼不同？',
          answer: 'PDF 是附有可搜尋文字層的掃描影像：印刷頁面下方是 Tesseract 文字層，手寫頁面下方是隱形的機器轉錄，兩種情況都以原始影像作為可見頁面。Word 文件則是另外的重建：印刷頁面是由 PaddleOCR-VL 或 Docling 產生的標題、清單與表格，手寫頁面則是置於提醒你核對的粗體註記之下的逐字轉錄。請以 PDF 影像為權威依據，將 DOCX 視為草稿。',
        },
        {
          question: '手寫轉錄有多可靠？',
          answer: '這是審慎的機器判讀，而不是經過認證的逐字稿。模型被指示完全照抄所寫的內容，將任何無法辨識的部分標記為 [illegible]、任何有疑問的字標記為 [?: best guess]，且絕不捏造或修正。每一頁都有信心度（沒有標記為高，標記行少於 15% 為中，高於此為低）與標記數量，PDF 頁面也帶有可見的機器轉錄頁尾。請對照掃描影像閱讀被標記的字。',
        },
        {
          question: '可以混合印刷頁面與手寫頁面嗎？',
          answer: '可以。在自動模式下，視覺模型會針對每一頁判斷它主要是印刷還是手寫，頁面再據此送往 Tesseract 或手寫模型。清單檔會逐頁記錄答案，最終的 PDF 與 Word 檔案會保留你在開始前設定的順序。',
        },
        {
          question: '印刷文字 OCR 支援哪些語言？',
          answer: '支援 Tesseract 語言代碼，混合語言的頁面以加號連接（例如 eng+fra）。伺服器提供的代碼會列在表單中；預設安裝英文，其他語言會在加入後出現。手寫內容由視覺模型讀取，不使用這些代碼。',
        },
        {
          question: '每個工作有哪些限制？',
          answer: '預設每個工作最多 50 張頁面圖片（每張圖片就是一頁，所以 50 實際上也是頁數上限）、每張圖片 25 MB、每台伺服器一次執行一個工作（其他工作在佇列中等待），以及每個模型階段 40 分鐘的上限。每個工作會消耗一次 AI 工作：沒有帳號時每天 3 次、免費帳號 10 次、Premium 100 次、Pro 200 次，工作失敗時會退還該次額度。即時數字請見價格頁面。',
        },
        {
          question: '為什麼我的手寫 PDF 有頁尾？可以移除嗎？',
          answer: '每個手寫頁面都帶有一行灰色小字「Machine transcription, verify against original」（機器轉錄，請對照原件核對），Word 段落中也有對應的粗體註記，因為手寫內容的可搜尋副本可能被誤認為已驗證的版本。它們是刻意設計的輸出內容，無法關閉。印刷頁面的文字層是確定性的 Tesseract 輸出，因此不帶這項標記。',
        },
        {
          question: '我的頁面會離開你們的伺服器嗎？',
          answer: '不會。Tesseract 在 CPU 上執行，手寫與分類模型透過 Ollama 在我們的 GPU 上執行，結構引擎與放大器則在同一台機器的第二張 GPU 上執行。上傳檔案與工作檔案會在工作完成後立即刪除。',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '預設每個工作最多可加入 50 張頁面圖片；每張頁面圖片各有大小上限（約 25 MB）。',
          '一律會產生可搜尋的 PDF；可編輯的 Word 文件為選用。',
        ],
        processingNotes: [
          '印刷頁面使用確定性 OCR（OCRmyPDF + Tesseract），產生忠實、可搜尋的文字層。',
          '手寫內容由視覺 AI 逐字轉錄，並保留 [illegible]/[?] 標記：這是機器轉錄，而不是具權威性的頁面。',
          'Word 文件與任何 AI 摘要都是重建內容，請對照原始掃描影像核對。',
        ],
      },
      related: [
        {
          label: '圖片轉 PDF',
          to: '/tools/image-to-pdf',
          description: '將頁面圖片裝訂成沒有文字層的 PDF，以一般工作處理。',
        },
        {
          label: 'PDF 轉 JPG',
          to: '/tools/pdf-to-jpg',
          description: '將現有的 PDF 算繪為頁面圖片，再送入掃描。',
        },
        {
          label: 'AI 圖片修復',
          to: '/tools/ai-image-restoration',
          description: '在轉錄前修復褪色或模糊的掃描影像。',
        },
        {
          label: '移除 EXIF 中繼資料',
          to: '/tools/remove-exif-metadata',
          description: '從文件的手機照片中移除位置與裝置標籤。',
        },
        {
          label: '遮蓋圖片中的文字',
          to: '/tools/redact-text-in-image',
          description: '在分享掃描影像前塗黑頁面上的姓名或號碼。',
        },
      ],
      embed: {
        title: 'AI 文件掃描',
        description: '加入一張或多張掃描的頁面圖片（印刷文件或手寫筆記），視需要調整順序，選擇內容模式與輸出，即可取得可搜尋的 PDF 與選用的 Word 文件。',
      },
    },
    'ai-image-upscaler': {
      name: 'AI 圖片放大器',
      h1: 'AI 圖片放大器：線上將相片放大 2 倍或 4 倍',
      tagline: '使用 Real-ESRGAN 模型放大較小或模糊的相片，它會重建細節，而不是單純拉伸像素。',
      metaTitle: 'AI 圖片放大器：將相片放大 2 倍或 4 倍 | Media Manipulator',
      metaDescription: '用能還原邊緣和紋理的 AI 將低解析度相片放大 2 倍或 4 倍。執行在我們自己的 GPU 上，輸出 PNG。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: 'AI 圖片放大器：將相片放大 2 倍或 4 倍',
      ogDescription: '使用 Real-ESRGAN AI 模型放大較小或模糊的相片，它會重建細節，而不是單純拉伸像素。',
      intro: '本頁會開啟圖片轉換器，並鎖定「AI 放大」、將輸出設為 PNG。伺服器在我們擁有的 GPU 上執行 realesrgan-ncnn-vulkan，也就是 Real-ESRGAN 的 Vulkan 版本：預設模型是 4 倍的 realesrgan-x4plus，另有 realesrgan-x4plus-anime 和 realesr-animevideov3 可用於繪圖與動畫影格，並可改選 2 倍作為替代倍率。神經網路不是在現有像素之間插值，而是預測邊緣、皮膚、布料和枝葉在更大尺寸下的樣子，並把這些細節畫上去。結果會寫成無損 PNG，因此不會在合成的細節上再疊加新的壓縮瑕疵。',
      whatItDoes: [
        '使用在我們 GPU 上執行的 Real-ESRGAN 模型，將圖片的寬度和高度放大為 2 倍或 4 倍。',
        '讓你在表單中選擇一個相片模型或兩個動漫風格模型；預先選好的是 4 倍和相片模型。',
        '一律輸出 PNG；此操作的 API 會強制使用 .png 副檔名。',
        '在 GPU 上自動將圖片分塊處理，讓大型輸入不會耗盡顯示記憶體。',
        '消耗每日 AI 工作額度中的一次 AI 工作，這是一個獨立的計數器；轉換所用的一般工作額度不受影響。',
      ],
      flowSteps: [
        {
          title: '上傳較小或模糊的圖片',
          description: 'JPG、PNG 或 WebP。輸入越小，模型需要自行生成的內容就越多。',
        },
        {
          title: '選擇 4 倍或 2 倍以及模型',
          description: '相片用 realesrgan-x4plus，線稿和卡通影格用動漫模型。',
        },
        {
          title: 'Real-ESRGAN 在 GPU 上執行',
          description: 'realesrgan-ncnn-vulkan -i in -o out -n <model> -s <2|4> -t 0 -g <gpu> -f png',
        },
        {
          title: '下載 PNG',
          description: 'converted.png，像素尺寸為原圖的 2 倍或 4 倍。',
        },
      ],
      advancedDetails: [
        '呼叫的是 ai_tools.go 中的 UpscaleImage。它會啟動 realesrgan-ncnn-vulkan，以 -n 指定模型、-s 指定倍率、-t 0 自動決定分塊大小、-g 指定 GPU 索引，並加上 -f png；Vulkan ICD 由環境變數固定，讓載入器一定能找到 NVIDIA 驅動程式。',
        '只接受倍率 2 和 4，以及 realesrgan-x4plus、realesrgan-x4plus-anime 和 realesr-animevideov3 這三個模型名稱；其他任何值都會在工作開始前被拒絕。',
        '2 倍是以一半的倍率執行同一個 x4 網路。表單附有一則說明，指出 2 倍在某些圖片上可能看起來稍微被裁切或拉近，這是在伺服器上用一張 640 x 360 的相片觀察到的；API 刻意不以先執行 4 倍再縮小的方式掩蓋這一點。',
        '由於 AI 路徑會略過 ImageMagick 和 exiftool 複製步驟，表單中的畫質、調整尺寸、濾鏡和中繼資料設定在這裡都沒有作用，PNG 也不會帶有原圖的任何 EXIF。',
        '像素數量隨倍率的平方增加：4 倍代表像素多 16 倍，2 倍則代表 4 倍。輸出的未壓縮 RGB 為寬 x 高 x 3 位元組，這決定了 PNG 可能的最大大小。',
        '除了你的方案的單一檔案大小限制之外，伺服器並未針對此操作設定輸入尺寸上限；非常大的輸入只是會花更久的時間，一塊一塊地處理。',
      ],
      whyItMatters: [
        '舊的數位相片、低解析度的下載檔案和網頁上的小圖片，常常需要以遠大於拍攝時的尺寸列印或顯示。',
        '單純的插值只會讓圖片變大，不會變清晰；超解析度模型決定了結果是模糊還是可用。',
        '從無損 PNG 開始，之後就能自由壓縮或調整結果的尺寸，而不會讓瑕疵層層累積。',
      ],
      useCases: [
        {
          title: '列印舊相片',
          description: '將早期相機拍攝的 1 百萬像素相片放大到適合列印的尺寸。',
        },
        {
          title: '拯救小型下載圖片',
          description: '將 400 px 的產品圖或參考圖放大到可用的程度。',
        },
        {
          title: '動漫與插圖',
          description: '用 realesrgan-x4plus-anime 放大線稿，邊緣不會變得混濁。',
        },
        {
          title: '遊戲與影片影格',
          description: '對擷取的動畫影格使用 realesr-animevideov3。',
        },
      ],
      workedExamples: [
        {
          title: '以 realesrgan-x4plus 將 640 x 360 的 JPEG 放大 4 倍',
          body: '輸入：一張 92 KB、640 x 360 的風景 JPEG 縮圖。設定維持預設組：4 倍、相片模型、PNG 輸出。伺服器執行 realesrgan-ncnn-vulkan -n realesrgan-x4plus -s 4 -t 0 -f png，寫出 2560 x 1440 像素的 converted.png，像素數為原本 230,400 像素的 16 倍。未壓縮的輸出為 2560 x 1440 x 3 = 11 MB 的 RGB，PNG 會低於這個大小，實際多少取決於其中有多少天空和平坦色塊，所以從 92 KB 的輸入預期會得到數 MB 的檔案。對於這個大小的輸出，GPU 處理自動選定的分塊只需幾秒鐘；數 MB 檔案的 PNG 編碼和下載則占了總時間中明顯的一部分。',
        },
        {
          title: '將 1200 x 800 的相片放大 2 倍',
          body: '輸入：一張 480 KB、1200 x 800 的人物 JPEG。選擇 2 倍並保留相片模型。輸出是 2400 x 1600 的 PNG，共 3.84 百萬像素，是原本 0.96 百萬像素的四倍。未壓縮時為 11.5 MB 的 RGB，PNG 則是其中的一部分。由於 2 倍是以一半的倍率執行 x4 網路，請檢查邊緣是否有表單所警告的輕微裁切或拉近；如果出現，請改為執行 4 倍，再用圖片尺寸調整工具將 4800 x 3200 的結果縮小到 2400 x 1600，這會多消耗一次操作。',
        },
      ],
      whenNotToUse: '不要放大本來就很大又清晰的圖片：一張 12 百萬像素的相片放大 4 倍會變成 192 百萬像素的 PNG，產生速度慢、未壓縮時達數百 MB，而且看不出任何改善。對於人臉、文字、標誌或任何必須保留確切原貌的內容，請不要依賴它，因為加入的細節是預測出來的，而不是還原出來的，小字可能會變成看似合理但錯誤的字母。嚴重的動態模糊和失焦無法靠解析度修正。如果你只需要從較大的原圖得到特定的像素尺寸，一般的尺寸調整工具更快也更划算。',
      whyMediaManipulator: [
        '這裡寫明了實際使用的執行檔、模型和參數，讓你知道這是具備自動分塊的 Real-ESRGAN，而不是籠統的「增強」。',
        '2 倍的注意事項會明白說出而不是隱藏，而且操作已鎖定，不必在選單中翻找。',
        '在我們擁有的硬體上執行；標準工具不需要帳號。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ],
      privacyNote: '你的圖片會儲存在我們伺服器上的 uploads/<jobId>/ 中，並由同一台機器上 GPU 執行的 realesrgan-ncnn-vulkan 執行檔直接讀取；它產生的 PNG 會存到 outputs/<jobId>/converted.png。不涉及任何外部 AI 供應商，你的圖片也不會被用來訓練任何東西。與所有圖片上傳一樣，我們伺服器上的自動分析步驟會以本機視覺模型對檔案執行一次分析，並將摘要與工作一起儲存。結果不會帶有原圖的 EXIF，因為 AI 操作會略過中繼資料複製。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      faq: [
        {
          question: 'AI 放大器可以免費使用嗎？',
          answer: '可以，在每日 AI 工作額度內免費。每次放大消耗一次 AI 工作：預設訪客每天 3 次、免費帳號每天 10 次，單一檔案上限分別為 200 MB 和 1 GB；Premium 和 Pro 則為 100 次和 200 次。這個額度與一般工作額度分開，所以你的轉換不受影響。即時數字列在 /pricing 上。',
        },
        {
          question: '這和圖片尺寸調整工具有什麼不同？',
          answer: '尺寸調整工具執行的是 ImageMagick，它會對現有像素進行插值，讓圖片變大但也變得較柔和。這個工具執行的是經過訓練的 Real-ESRGAN 網路，會在更大的尺寸下合成邊緣和紋理。這是推論出來的結果，而不是還原的資料。',
        },
        {
          question: '我應該選 2 倍還是 4 倍？',
          answer: '4 倍是預設值，輸出最穩定。2 倍是以一半的倍率執行同一個網路，在某些圖片上可能看起來稍微被裁切，所以如果 4 倍超出你的需要，可以考慮先放大 4 倍再縮小尺寸。',
        },
        {
          question: '哪個模型適合繪圖？',
          answer: '插圖和平塗色彩的作品用 realesrgan-x4plus-anime；從動畫擷取的影格用 realesr-animevideov3。相片模型會加入類似皮膚的紋理，用在線稿上會顯得不對勁。',
        },
        {
          question: '為什麼輸出是 PNG，而且這麼大？',
          answer: '強制使用 PNG，是為了讓合成的細節不會立刻被 JPEG 壓縮破壞。4 倍的結果有 16 倍的像素，所以檔案很大；分享前可以再將它壓縮成 JPG 或 WebP。',
        },
        {
          question: '它能修復模糊或失焦的相片嗎？',
          answer: '它對低解析度造成的柔和有幫助。它無法消除動態模糊或失焦，也可能使人臉和細小文字變得平滑或走樣。使用前請將結果與原圖比較。',
        },
        {
          question: '我的相片會傳送到第三方 AI 服務嗎？',
          answer: '不會。Real-ESRGAN 在我們營運的 GPU 伺服器上執行，工作絕不會呼叫外部 API。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '輸出為 PNG。大小限制和每日 AI 工作額度取決於你的方案，並顯示在表單中，而不是固定寫在本頁。',
        ],
      },
      related: [
        {
          label: 'AI 圖片修復',
          to: '/tools/ai-image-restoration',
          description: '在放大前或放大後清除壓縮瑕疵和雜訊。',
        },
        {
          label: '圖片尺寸調整',
          to: '/tools/image-resizer',
          description: '將 4 倍的結果縮小到你需要的確切尺寸。',
        },
        {
          label: '壓縮圖片',
          to: '/tools/compress-image',
          description: '將大型 PNG 轉為方便分享的 JPG 或 WebP。',
        },
        {
          label: '移除圖片背景',
          to: '/tools/remove-background-from-image',
          description: '將放大後的主體去背到透明背景上。',
        },
        {
          label: 'AI 影片修復',
          to: '/tools/ai-video-restoration',
          description: '適用於影片影格的同類工具。',
        },
      ],
      embed: {
        title: '用 AI 放大圖片',
        description: '上傳相片。「AI 放大」已預先選好並鎖定，輸出設為 PNG。選擇 2 倍或 4 倍以及模型（相片或動漫），然後轉換。',
      },
    },
    'blur-faces-in-photo': {
      name: '模糊相片中的人臉',
      h1: '線上模糊相片中的人臉',
      tagline: '自動偵測人臉，然後對全部人臉或你選擇的人臉進行模糊、馬賽克或塗黑。',
      metaTitle: '線上模糊相片中的人臉 | Media Manipulator',
      metaDescription: '對相片中的人臉進行模糊、馬賽克或塗黑。偵測每一張人臉，再選擇要隱藏的人臉。AI 執行在我們自己的 GPU 上。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上模糊相片中的人臉',
      ogDescription: '自動找出相片中的人臉，並對全部人臉或只對你選擇的人臉進行模糊、像素化或塗黑。',
      intro: '發布人群、教室或街頭的相片時，通常需要隱藏那些從未同意入鏡的人。本頁使用在我們自己伺服器上以 OpenCV 執行的 YuNet 偵測器找出人臉，並以高斯模糊、像素馬賽克或純黑矩形遮蓋每一張臉。你可以一步遮蓋所有偵測到的人臉，也可以先執行偵測，查看畫在相片上的方框，再只選擇要隱藏的人臉，或只選擇要保留的人臉。下方說明了偵測器、其信賴度閾值以及每種效果的確切大小，讓你清楚知道輸出能保護什麼、不能保護什麼。',
      whatItDoes: [
        '使用 OpenCV FaceDetectorYN 與 YuNet 2023 模型，以 0.85 的信賴度閾值偵測人臉，然後將每個方框的每一邊各擴大 18%，讓頭髮與下顎線也被涵蓋。',
        '以高斯模糊（核心大小為方框尺寸的三分之一）、橫跨方框 14 個色塊的馬賽克，或黑色填滿，隱藏每一張選定的人臉。',
        '提供三種選取模式：所有偵測到的人臉、只有你勾選的人臉，或除了你勾選的人臉以外的全部。',
        '將偵測結果儲存在一個與檔案 SHA-256 綁定、為時 30 分鐘的工作階段中，因此套用的方框正是你看到的方框。',
        '輸出像素尺寸相同的全新 JPG、PNG 或 WebP；原始上傳檔案不會被更動。',
      ],
      flowSteps: [
        {
          title: '上傳相片',
          description: 'JPG、PNG 或 WebP。本頁已預先選取並鎖定「臉部模糊／像素化」。',
        },
        {
          title: '選擇模糊、像素化或黑色方塊',
          description: '預設為模糊；黑色方塊會完全移除該區域的像素。',
        },
        {
          title: '視需要偵測並選取',
          description: '按下「偵測臉部」查看編號方框，再勾選要隱藏或要保留的人臉。',
        },
        {
          title: '執行工作',
          description: '伺服器會在每個選定的方框內套用效果，並儲存一張新圖片。',
        },
        {
          title: '檢查並下載',
          description: '發布之前，請放大到原尺寸，檢查是否有遺漏的人臉。',
        },
      ],
      advancedDetails: [
        '偵測會執行 face_privacy.py，以 OpenCV FaceDetectorYN 搭配 face_detection_yunet_2023mar.onnx，在完整圖片解析度下運作：分數閾值 0.85、NMS 閾值 0.3，最多 5000 個候選。每個方框的每一邊會擴大其寬度與高度的 0.18，並限制在圖片範圍內。',
        '模糊套用 cv2.GaussianBlur，使用 max(3, 方框最長邊 / 3) 像素並取奇數的核心，所以 300 px 的人臉會得到 101 px 的核心；人臉越大，模糊越強。像素化會以線性濾波將方框縮小為橫跨 14 個色塊，再以最近鄰插值放大回來，形成明顯的方形色塊。黑色方塊則會在該區域寫入 (0, 0, 0)。',
        '如果你先執行偵測，伺服器會計算上傳檔案的 SHA-256，將正規化後的方框儲存在 30 分鐘後到期的工作階段中；若你之後送出的檔案雜湊值不符，伺服器會拒絕套用該工作階段，因此方框無法被移植到另一張圖片上。',
        '沒有偵測工作階段時，指令碼會在執行時重新偵測，並遮蓋找到的每一張人臉；結果與執行「偵測臉部」並將模式保留為全部完全相同。',
        '輸出由 OpenCV 寫入，而轉換器的 exiftool 回寫步驟不會在 AI 輸出上執行，因此結果不帶有任何原始的 EXIF、GPS 或相機標籤。不過，它仍無法取代 EXIF 工具，後者能讓你查看並選擇要移除的內容。',
        '對大而清晰的人臉套用輕度模糊，可能會被反卷積工具部分還原；黑色方塊是唯一會徹底銷毀資訊的選擇，粗糙的馬賽克則介於兩者之間。',
      ],
      whyItMatters: [
        '他人的相片，尤其是兒童的相片，涉及同意問題，有時還有法律義務，這不是加一句說明文字就能解決的。',
        '手動編輯一張有 20 張人臉的相片既慢又不一致；偵測能找出後排的小臉。',
        '先偵測再選取，讓你能保留自己同伴的清晰樣貌，同時將路人匿名化。',
      ],
      useCases: [
        {
          title: '活動與人群相片',
          description: '在發布公開活動的相片前，隱藏旁觀者。',
        },
        {
          title: '學校與社團貼文',
          description: '遮蓋家長尚未同意的特定兒童。',
        },
        {
          title: '新聞與報導',
          description: '在紀實照片中保護消息來源或參與者。',
        },
        {
          title: '視訊通話的螢幕截圖',
          description: '在分享到團隊以外之前，將會議截圖中的同事匿名化。',
        },
      ],
      workedExamples: [
        {
          title: '一張 4000 x 3000、含 14 張人臉的團體照，全部模糊',
          body: '輸入：手機拍攝的 3.5 MB JPEG，4000 x 3000 像素，有 14 個人。設定：模糊、選取模式為全部、未事先偵測。指令碼會在完整的 12 MP 畫面上執行 YuNet；方框為 300 x 360 像素的人臉會擴大 18%，約為 408 x 490，並以 163 px 的高斯核心（490 / 3，取奇數）模糊，使其變成毫無特徵的色塊。後排 60 px 的人臉會得到 27 px 的核心，在該尺寸下足以抹除五官。輸出是由 OpenCV 寫入的 4000 x 3000 JPG，大小通常與原檔相差幾百 KB 以內。偵測與模糊只需幾秒鐘；上傳 3.5 MB 的檔案通常花費更久。',
        },
        {
          title: '一張 1920 x 1080 的視訊通話螢幕截圖，六張人臉中的兩張像素化',
          body: '輸入：一張 1.1 MB、1920 x 1080 的 PNG 螢幕截圖，畫面中有六位參與者。設定：先執行「偵測臉部」、選取模式為「僅選取的臉」、勾選兩張人臉、像素化。偵測會傳回六個方框，並將其儲存在與檔案雜湊值綁定、為時 30 分鐘的工作階段中。送出時，伺服器會驗證雜湊值，並將選定的兩個方框 ID 傳給指令碼；每個選定的方框擴大後約為 140 x 180 像素，會被縮小為橫跨 14 個色塊，因此每個色塊大約是 10 x 13 像素，再以邊緣銳利的方塊寫回。其他四張人臉不受影響。輸出是 1920 x 1080 的 PNG，由於不需要重新偵測，工作只需幾秒鐘。',
        },
      ],
      whenNotToUse: '只要遺漏一張人臉就無法接受的情況（例如法律規定的遮蔽），請不要依賴此工具；YuNet 在 0.85 閾值下會略過非常小、轉向別處、戴口罩或處於深色陰影中的人臉，你必須自行檢查輸出。如果當事人必須保持無法辨識，請不要對大的人臉使用輕度模糊，而應使用黑色方塊。名牌、車牌與螢幕都不是人臉，處理這些應選擇文字遮蔽工具或物件移除工具。如果你的目的是將某人從畫面中完全移除，而不只是隱藏其臉部，物件移除工具可以做到。',
      whyMediaManipulator: [
        '偵測器、其閾值、擴大幅度與核心計算方式都已明確列出，讓你能判斷每種樣式提供多少保護。',
        '偵測方框與檔案雜湊值綁定，並在 30 分鐘後到期，因此你是在實際被處理的那張圖片上進行選取。',
        '人臉模糊會消耗每日 AI 工作額度中的一次 AI 工作（預設情況下，沒有帳號每天 3 次，免費帳號每天 10 次），這與一般工作額度分開計算，而「偵測臉部」預覽完全不計入。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ],
      privacyNote: '人臉偵測與模糊在我們自己的硬體上以本機 OpenCV 程序執行；沒有任何外部 AI 服務會收到你的相片，也不會用於訓練。「偵測臉部」預覽會儲存一份暫存副本、計算其雜湊值、執行偵測，並在回應前刪除該副本；只有方框座標會被保留 30 分鐘。上傳的相片存放在 uploads/<jobId>/，結果存放在 outputs/<jobId>/，兩者都登記在保留記錄中，並在期限結束時刪除。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。作為一般的圖片上傳，相片也會在同一台伺服器上經過我們的自動內容分析，由本機視覺模型撰寫一段簡短描述，該描述會隨工作保存，不會與第三方分享。',
      faq: [
        {
          question: '偵測器會漏掉哪些人臉？',
          answer: 'YuNet 以 0.85 的信賴度閾值執行，因此會略過信賴度低的候選：非常小的人臉、背向鏡頭的側臉、被口罩或手遮住的人臉，以及處於深色陰影中的人臉。分享前請以原尺寸檢查結果。',
        },
        {
          question: '如何只模糊部分人臉？',
          answer: '按下「偵測臉部」，勾選編號方框，並將選取模式設為「僅選取的臉」或「選取以外的所有臉」。方框會依檔案雜湊值儲存 30 分鐘，所以如果換了相片，請重新偵測。',
        },
        {
          question: '模糊有多強？可以還原嗎？',
          answer: '高斯核心為方框大小的三分之一，所以 300 px 的人臉會得到 101 px 的核心。強烈的模糊很難還原，但面對大而清晰的人臉，有決心的攻擊者仍有機會；黑色方塊會移除像素，無法還原。',
        },
        {
          question: '輸出會保留相片的 EXIF 與 GPS 資料嗎？',
          answer: '不會。結果由 OpenCV 全新寫入，且 AI 輸出會略過中繼資料回寫步驟，因此相機與位置標籤不會被帶過去。如果你想檢視或選擇性移除標籤，請使用 EXIF 工具。',
        },
        {
          question: '我的相片會被傳送給外部 AI 公司嗎？',
          answer: '不會。偵測與效果都在我們自己伺服器上的本機 OpenCV 程序中執行，檔案不會與第三方 AI 供應商分享。',
        },
        {
          question: '人臉模糊會使用我的每日 AI 工作額度嗎？',
          answer: '會。每張模糊的相片計為一次 AI 工作：訪客預設每天 3 次，免費帳號每天 10 次。它絕不會動用一般工作額度。「偵測臉部」預覽有頻率限制，但不計入額度。失敗的工作會退還額度。',
        },
        {
          question: '車牌、名牌或螢幕上的文字怎麼辦？',
          answer: '這些不是人臉，不會在這裡被偵測。任何可讀的內容請使用文字遮蔽工具；要從相片中抹除車牌或招牌，請使用物件移除工具。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '每個工作會消耗每日 AI 工作額度中的一次 AI 工作；你的方案的單一檔案大小上限會顯示在表單中。',
        ],
      },
      related: [
        {
          label: '遮蓋圖片中的文字',
          to: '/tools/redact-text-in-image',
          description: '隱藏電子郵件、電話號碼及其他可讀文字。',
        },
        {
          label: '移除相片中的物件',
          to: '/tools/remove-object-from-photo',
          description: '完全抹除人物、車牌或招牌。',
        },
        {
          label: '移除圖片中的 EXIF 中繼資料',
          to: '/tools/remove-exif-metadata',
          description: '移除同一張相片中的 GPS 與相機資料。',
        },
        {
          label: '壓縮圖片',
          to: '/tools/compress-image',
          description: '在發布前縮小匿名化後的相片。',
        },
        {
          label: '圖片尺寸調整',
          to: '/tools/image-resizer',
          description: '將結果縮放為平台要求的尺寸。',
        },
      ],
      embed: {
        title: '模糊相片中的人臉',
        description: '上傳相片。「臉部模糊／像素化」已預先選取並鎖定。選擇樣式，也可以先偵測人臉並選擇要隱藏哪些，然後轉換。',
      },
    },
    'redact-text-in-image': {
      name: '遮蓋圖片中的文字',
      h1: '遮蓋圖片中的文字與個人資料',
      tagline: '在螢幕截圖或相片中找出可讀文字，並用模糊或黑色方框遮蓋個人資料或全部文字。',
      metaTitle: '線上遮蓋圖片中的文字 | Media Manipulator',
      metaDescription: '自動找出圖片中的文字，並將姓名、電子郵件、號碼等個人資料塗黑或模糊。AI 執行在我們自己的 GPU 上。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '遮蓋圖片中的文字與個人資料',
      ogDescription: '找出螢幕截圖與相片中的文字，並以模糊或黑色方塊遮蓋個人資料或所有文字。',
      intro: '螢幕截圖會洩漏擁有者早已視而不見的東西：頁首的電子郵件地址、表格中的帳號、聊天泡泡裡的電話號碼。本頁在我們自己的伺服器上使用 EasyOCR 讀取圖片中的每一段文字，並以黑色矩形、模糊或像素馬賽克遮蓋符合的內容。在預設模式下，它只會遮蓋符合個人資料模式的文字：電子郵件地址、電話號碼、類似社會安全號碼的號碼、類似卡號的長串數字，以及街道地址。在「所有文字」模式下，它會遮蓋所有能讀到的文字；當你無法預測頁面上有什麼內容時，這是較安全的選擇。',
      whatItDoes: [
        '使用我們伺服器的 GPU，以 EasyOCR 掃描整張圖片，找出文字方框及其中的文字。',
        '在個資模式下，遮蓋文字符合以下五種模式之一的方框：電子郵件、電話號碼、3-2-4 位數識別碼、13 到 19 位數的類卡號數字串，或以 Street、Avenue、Road、Drive、Lane、Boulevard、Way、Court、Circle 或 Place 結尾的街道地址。',
        '在「所有文字」模式下，無論內容為何，都會遮蓋每一個辨識出的文字方框。',
        '將每個方框擴大其較長邊的 8%（至少 3 像素），然後以黑色填滿、以方框大小三分之一的核心模糊，或像素化為 12 個色塊。',
        '輸出尺寸相同的全新 JPG、PNG 或 WebP，並回報遮蔽了幾處。',
      ],
      flowSteps: [
        {
          title: '上傳圖片',
          description: '含有可讀文字的螢幕截圖、掃描表單或相片，格式為 JPG、PNG 或 WebP。',
        },
        {
          title: '選擇僅個資或所有文字',
          description: '本頁已預先選取並鎖定「遮蔽文字／個資」；預設的偵測模式為「僅個資」。',
        },
        {
          title: '選擇黑色方塊、模糊或像素化',
          description: '黑色方塊是預設值，也是唯一不可逆的選項。',
        },
        {
          title: '執行 OCR 與遮蔽',
          description: 'EasyOCR 讀取圖片，每個符合的方框都會被擴大並遮蓋，然後儲存結果。',
        },
        {
          title: '仔細檢查並下載',
          description: '檢查是否有 OCR 沒讀到的文字，特別是小字、旋轉或手寫的文字。',
        },
      ],
      advancedDetails: [
        '伺服器會以 --detect pii 或 all-text、--redaction blackbox、blur 或 pixelate 以及 --gpu 執行 redact_text_pii.py。指令碼會建立一個英文（目前唯一傳入的語言）的 EasyOCR Reader，並對檔案呼叫 readtext，為每一行傳回方框、文字與信賴度。',
        '個資模式是正規表示式：電子郵件（本機部分、@、含點的網域，以及 2 個以上字母的頂層網域）；10 位數的北美電話號碼，可帶 +1、括號、點、空格或破折號；以破折號或空格分隔的三位、兩位與四位數字；13 到 19 位數字，可用空格或破折號分隔（卡號）；以及門牌號碼後接名稱與街道類型詞。沒有針對人名、出生日期或美國以外識別碼的模式。',
        '每個符合的方框會在每一邊擴大 max(3, 0.08 x 其寬度與高度中較大者) 像素，並限制在圖片範圍內。黑色方塊使用 cv2.rectangle 並以黑色填滿內部；像素化會將區域縮小為橫跨 12 個色塊，再以最近鄰插值放大回來；模糊使用 max(11, 最長邊 / 3) 的高斯核心，並取奇數。',
        'OCR 最擅長讀取清晰的水平印刷文字。手寫、裝飾字型、極小的文字、嚴重歪斜與低對比都會降低信賴度，甚至可能完全漏掉。「所有文字」模式無法補救 OCR 從未看到的行。',
        '輸出由 OpenCV 寫入，且 AI 輸出會略過轉換器的 exiftool 回寫，因此原始的 EXIF、GPS 與相機標籤不會帶到結果中；這個工具處理的是像素，而不是中繼資料。',
        '指令碼完成時會輸出 redactions=N；結果為零表示 OCR 沒有找到符合的文字，而不是圖片很乾淨。',
      ],
      whyItMatters: [
        '支援工單、錯誤回報與社群貼文經常附上含有真實客戶或帳戶資料的螢幕截圖。',
        '用繪圖工具手動遮蓋文字會漏掉某些行，結果也參差不齊；模式搜尋能找出你早已沒注意到的第三個電子郵件地址。',
        '不透明的矩形是唯一經得起銳利化、對比拉伸與放大檢視的遮蔽方式。',
      ],
      useCases: [
        {
          title: '錯誤回報與客服',
          description: '分享螢幕截圖，而不暴露電子郵件、電話號碼或卡號數字。',
        },
        {
          title: '掃描表單',
          description: '在轉寄頁面前隱藏識別碼與地址。',
        },
        {
          title: '聊天螢幕截圖',
          description: '在發布對話前移除電話號碼與電子郵件。',
        },
        {
          title: '教學素材',
          description: '將真實的螢幕擷取畫面變成所有文字都被遮蓋的安全範例。',
        },
      ],
      workedExamples: [
        {
          title: '以個資模式處理一張 1440 x 900 的客服工單螢幕截圖',
          body: '輸入：一張 400 KB、1440 x 900 的 PNG，顯示一筆客戶記錄，內含兩個電子郵件地址、一個寫成 (555) 123-4567 的電話號碼，以及一個客戶姓名。設定：僅個資、黑色方塊。EasyOCR 傳回約 40 行文字，其中三行符合電子郵件與電話模式，姓名則不符合任何模式。這三個方框（例如一個電子郵件為 260 x 22 像素）會在每一邊擴大 260 的 8%，約 21 像素，並以黑色填滿，形成 302 x 64 的矩形。姓名仍然可見，因為沒有姓名模式；如果姓名也必須遮蓋，請改用「所有文字」。輸出是 1440 x 900 的 PNG，工作需要幾秒鐘，大部分時間花在載入 OCR 模型與讀取頁面。',
        },
        {
          title: '以「所有文字」模式加模糊處理一張 3024 x 4032 的手機表單相片',
          body: '輸入：一張 2.1 MB 的 JPEG 相片，拍的是一份印刷表單，3024 x 4032 像素，略為歪斜。設定：所有文字、模糊。EasyOCR 讀到的每一行都會被遮蓋：一個 600 x 40 像素的打字欄位值，每一邊擴大 48 像素，並以 201 px 的核心（600 / 3，取奇數）模糊，在這個尺度下能完全抹除字跡；一個 120 x 30 的標籤會得到最小值 11 px 的核心，在這個尺寸下仍可能猜出字形，因此任何敏感內容請選擇黑色方塊。OCR 無法讀取的手寫內容會保持原樣，必須用肉眼檢查。輸出是 3024 x 4032 的 JPG；對 12 MP 相片執行 OCR 是最慢的步驟，耗時比處理螢幕截圖更長。',
        },
      ],
      whenNotToUse: '對於必須完全遮蔽的文件，請不要把此工具當作唯一的防護措施；OCR 只是盡力而為，目前只能讀取英文印刷字，而個資模式對人名、出生日期或北美以外的識別碼一無所知。對要公開的文字請不要使用模糊，因為文字模糊是最容易被還原的遮蔽方式；請使用黑色方塊。人臉、標誌與相片都不是文字，不會受到處理；這些請交給人臉模糊工具與物件移除工具。如果敏感資料位於檔案的中繼資料而不是像素中，EXIF 工具才是正確的選擇。',
      whyMediaManipulator: [
        '五種個資模式、擴大幅度與核心大小都已明確寫出，讓你確切知道哪些文字會被抓到、又會如何被遮蓋。',
        'OCR 與遮蔽在我們自己的 GPU 上以本機程序執行；滿是客戶資料的螢幕截圖絕不會離開我們的硬體。',
        '文字遮蔽會消耗一次 AI 工作（預設情況下，沒有帳號每天 3 次，免費帳號每天 10 次），計入 AI 工作額度而非一般工作額度，失敗的工作會退還額度。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ],
      privacyNote: '文字辨識與遮蔽在我們自己的 GPU 伺服器上以本機 EasyOCR 與 OpenCV 程序執行；沒有任何外部 OCR 或 AI 服務會收到這張圖片，辨識出的文字只用來決定要遮蓋哪些方框，不會被儲存。上傳檔案存放在 uploads/<jobId>/，遮蔽後的圖片存放在 outputs/<jobId>/，兩者都登記在保留記錄中，並在期限結束時刪除。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。與所有一般圖片上傳一樣，這個檔案也會在同一台伺服器上經過我們的自動內容分析，由本機視覺模型撰寫一段簡短描述，該描述會隨工作保存，不會與第三方分享。',
      faq: [
        {
          question: '個資模式會偵測哪些個人資料？',
          answer: '符合五種模式的文字：電子郵件地址、北美電話號碼、3-2-4 位數識別碼、13 到 19 位數的類卡號數字串，以及以 Street、Avenue 或 Road 等詞結尾的街道地址。人名、日期與美國以外的識別碼不會被比對到；這些請使用「所有文字」。',
        },
        {
          question: '什麼時候該用「所有文字」而不是「僅個資」？',
          answer: '只要你無法事先列出哪些內容是敏感的就該使用：表單、表格、含有人名的聊天記錄。「所有文字」會遮蓋 OCR 讀到的每一行，因此唯一剩下的風險是 OCR 讀不到的文字。',
        },
        {
          question: '這個工具能讀取英文以外的語言嗎？',
          answer: '目前不行。OCR 讀取器只以英文啟動，因此拉丁字母的文字能大致正確讀取，但其他文字系統可能會被漏掉或誤讀。頁面不是英文時，請檢查輸出。',
        },
        {
          question: '在這裡，黑色方塊比模糊或像素化更安全嗎？',
          answer: '是的。方框會以純黑填滿，因此什麼都不會留下。模糊使用方框大小三分之一的核心，最小 11 px，像素化則保留橫跨 12 個色塊；兩者都可能讓簡短的文字被猜出。任何要公開的內容請選擇黑色方塊。',
        },
        {
          question: '遮蔽會移除相片中隱藏的中繼資料嗎？',
          answer: '結果由 OpenCV 全新寫入，不會複製原始標籤，因此 EXIF 與 GPS 資料不會被帶過去。如果要對一個你不打算做其他編輯的檔案進行刻意、可檢視的移除，請使用 EXIF 中繼資料工具。',
        },
        {
          question: '為什麼有些文字仍然可見？',
          answer: '可能是 OCR 沒有讀到（手寫、極小的字、歪斜、低對比），或在個資模式下不符合任何模式。伺服器會回報遮蓋了多少個方框；零表示沒有符合的內容，而不是那裡什麼都沒有。',
        },
        {
          question: '遮蔽文字是免費的嗎？哪些會計入我的額度？',
          answer: '是的。這是一次 AI 工作，預設情況下，沒有帳號每天 3 次，免費帳號每天 10 次，圖片大小上限分別為 200 MB 與 1 GB。它只使用 AI 工作額度，絕不會動用一般工作額度。價格頁面列有即時數字。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '每個工作會消耗每日 AI 工作額度中的一次 AI 工作；你的方案的單一檔案大小上限會顯示在表單中。',
        ],
      },
      related: [
        {
          label: '模糊相片中的人臉',
          to: '/tools/blur-faces-in-photo',
          description: '隱藏同一張相片中的人物。',
        },
        {
          label: '移除圖片中的 EXIF 中繼資料',
          to: '/tools/remove-exif-metadata',
          description: '移除隱藏的位置與裝置資料。',
        },
        {
          label: 'AI 文件掃描',
          to: '/tools/ai-document-scan',
          description: '將拍攝的頁面變成乾淨、可搜尋的 PDF。',
        },
        {
          label: '移除相片中的物件',
          to: '/tools/remove-object-from-photo',
          description: '抹除不是文字的標誌、車牌或徽章。',
        },
        {
          label: '壓縮圖片',
          to: '/tools/compress-image',
          description: '在附加前縮小遮蔽後的螢幕截圖。',
        },
      ],
      embed: {
        title: '遮蓋圖片中的文字',
        description: '上傳螢幕截圖或相片。「遮蔽文字／個資」已預先選取並鎖定。選擇要遮蓋個人資料還是所有文字，以及遮蔽樣式，然後轉換。',
      },
    },
    'remove-object-from-photo': {
      name: '移除相片中的物件',
      h1: '線上移除相片中的物件',
      tagline: '在不想出現在畫面中的物件周圍畫一個框，修補模型就會用相符的背景填補空缺。',
      metaTitle: '線上移除相片中的物件 | Media Manipulator',
      metaDescription: '擦除相片中不需要的物件。畫一個矩形，AI 修補會依背景填補空白。執行在我們自己的 GPU 上。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上移除相片中的物件',
      ogDescription: '在不需要的物件上畫一個方框，AI 修補就會以相符的背景填補空白。',
      intro: '上傳相片，在想要移除的東西上拖曳出一個或多個矩形，然後轉換。表單會將每個矩形以圖片的比例傳送（左、上、寬與高，數值介於 0 到 1），我們的 API 會將其轉為遮罩：一張與相片同尺寸的灰階 PNG，矩形內為白色，其他地方全為黑色。接著，Python 指令碼會開啟圖片與遮罩，並在我們的 GPU 上執行 simple_lama_inpainting 套件中的 LaMa 修補模型，利用周圍的場景重新繪製白色區域。你會取回原尺寸、採用你所選格式的相片，標記的區域都已填補。',
      whatItDoes: [
        '接受在預覽上繪製的一個或多個矩形，並移除其中的任何東西。',
        '在伺服器上根據正規化的矩形座標建立像素精確的遮罩，因此遮罩不受你的螢幕尺寸影響。',
        '在我們營運的 GPU 上執行 LaMa 修補，以延續背景的內容填補遮罩區域。',
        '依表單中的選擇，以 JPG、PNG、WebP 或 GIF 傳回完整解析度的圖片。',
        '計為每日 AI 工作額度中的一次 AI 工作；一般轉換使用另一個獨立的額度。',
      ],
      flowSteps: [
        {
          title: '上傳相片',
          description: 'JPG、PNG 或 WebP。預覽會顯示出來，並附有繪圖圖層。',
        },
        {
          title: '繪製矩形',
          description: '每個物件一個方框，略大於物件本身。至少需要一個方框。',
        },
        {
          title: '遮罩與修補',
          description: '伺服器會寫入一張同尺寸的遮罩 PNG，然後以圖片與遮罩執行 remove_object_lama.py。',
        },
        {
          title: '下載並檢查',
          description: '使用圖片前，請放大檢查填補區域的接縫。',
        },
      ],
      advancedDetails: [
        '處理常式是 ai_tools.go 中的 RemoveObject。它會用 ImageMagick identify 讀取圖片尺寸，在伺服器暫存目錄中將矩形點陣化為灰階 PNG 遮罩（內部白色、外部黑色，座標四捨五入為整數像素並限制在圖片範圍內），執行指令碼，之後刪除遮罩。',
        'remove_object_lama.py 會用 Pillow 開啟圖片並轉換為 RGB，以灰階載入遮罩，若尺寸不同則將遮罩調整為圖片尺寸，呼叫 SimpleLama(image, mask)，並將結果儲存到輸出路徑。由於轉換為 RGB，透明 PNG 輸入會失去 Alpha 通道。',
        '每個矩形都會在伺服器端驗證：寬度與高度必須為正數，且方框在兩個軸上都必須位於 0 到 1 之間，否則工作會在開始前被拒絕，操作額度也會退還。',
        'AI 路徑會略過 ImageMagick 階段，因此濾鏡、色調、文字疊加、畫質與尺寸調整設定都不適用，exiftool 中繼資料複製也不會執行；結果不帶有原始檔的任何 EXIF。Pillow 會以所選格式的預設編碼器設定儲存檔案。',
        'LaMa 依據周圍內容進行填補，因此填補品質取決於方框周圍的內容。天空、草地、沙灘、水面、牆壁與地板能產生令人信服的結果；橫跨人臉、文字或規則圖樣的方框，則會迫使模型憑空捏造它無從得知的結構。',
      ],
      whyItMatters: [
        '在有紋理的背景上用仿製印章修圖需要練習與時間；畫一個矩形只要兩秒鐘。',
        '一個闖入畫面的路人、一條電線或一塊招牌，可能就是一張能用的照片與必須重拍之間唯一的差別。',
        '它也能作為隱私工具，用來處理不該出現在分享相片中的門牌號碼、車牌與螢幕。',
      ],
      useCases: [
        {
          title: '旅遊與風景',
          description: '從原本乾淨的景色中移除遊客、電線或垃圾桶。',
        },
        {
          title: '商品相片',
          description: '抹除商品圖片中的價格標籤、支架或灰塵。',
        },
        {
          title: '房地產',
          description: '清除畫面邊緣的汽車、垃圾桶或雜物。',
        },
        {
          title: '隱私',
          description: '塗掉門牌號碼、車牌或入鏡的螢幕。',
        },
      ],
      workedExamples: [
        {
          title: '在一張 4000 x 3000 的海灘相片上畫一個矩形',
          body: '輸入：一張 5.2 MB、4000 x 3000 的 JPEG，水邊有一個人。從橫向 60%、縱向 40% 的位置開始，畫一個寬 10%、高 15% 的方框，並保留 JPG 作為輸出。API 會將這些比例乘以圖片尺寸，寫入一張 4000 x 3000 的遮罩，其中在 (2400, 1200) 處有一塊 400 x 450 像素的白色區塊。LaMa 在 GPU 上對圖片與遮罩執行一次，指令碼會儲存一張 4000 x 3000 的 JPG，其中 180,000 個遮罩像素已依周圍的沙灘與海水填補。在 GPU 上對 12 MP 圖片執行模型只需幾秒；寫入與下載數 MB 的 JPG 所花的時間也占了總時間相當的比例。',
        },
        {
          title: '在一張 1920 x 1080 的 PNG 商品照上畫兩個矩形',
          body: '輸入：一張 2.3 MB、1920 x 1080 的 PNG，內容是桌上的一盞燈，還有一條電線與一張價格貼紙。畫兩個方框：一個蓋住電線（約 5% x 30%），一個蓋住貼紙（約 8% x 6%）。兩者都會點陣化到同一張 1920 x 1080 的遮罩中，因此一次修補就能處理兩個區域。選擇 PNG 作為輸出，以避免填補區域出現 JPEG 瑕疵；結果是 1920 x 1080 的 PNG，由於 Pillow 會在修補前將輸入轉換為 RGB，所以是不透明的 RGB。在 2 MP 的尺寸下，GPU 處理很快，大部分實際耗時花在上傳與寫入 PNG。',
        },
      ],
      whenNotToUse: '如果物件占據畫面的大部分、位於人臉前方、與可讀文字重疊，或打斷磚牆、磁磚或鍵盤等規則圖樣，請不要使用修補：模型必須捏造結構，結果會看起來糊成一片或不斷重複。如果你想保持透明 PNG 完整，這也不是合適的工具，因為指令碼會將輸入平面化為 RGB；當編輯必須在鑑識上完全誠實時也不適用，因為填補的區域是生成的內容。要替換整個背景，請使用背景移除工具；只需要隱藏的人臉，則更適合使用人臉模糊工具。',
      whyMediaManipulator: [
        '遮罩由伺服器根據精確的比例建立，因此你在手機預覽上畫的內容，會對應到與桌面電腦上相同的像素。',
        '模型名稱已明確列出（透過 simple_lama_inpainting 使用 LaMa），格式與 Alpha 通道的處理方式也都有記載，而不是讓你自行猜測。',
        '在我們自己的 GPU 上執行；標準工具不需要帳號。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ],
      privacyNote: '你的相片儲存在我們伺服器上的 uploads/<jobId>/；矩形遮罩會以暫存 PNG 寫入伺服器暫存目錄，並在修補指令碼完成後立即刪除；填補後的圖片則存放在 outputs/<jobId>/。矩形座標會保留在工作選項中，以便產生工作報告。LaMa 在同一台機器的 GPU 上執行，圖片的任何部分都不會傳送給外部供應商。每一次圖片上傳（包括這一次）也會由我們伺服器上的自動分析步驟，使用本機視覺模型摘要一次，該摘要會隨工作保存。由於 AI 操作會略過中繼資料複製，輸出不帶有任何 EXIF。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      faq: [
        {
          question: '移除物件是免費的嗎？',
          answer: '是的，在每日 AI 工作額度內免費。每次移除會消耗一次 AI 工作：預設訪客每天 3 次、免費帳號每天 10 次，單一檔案上限分別為 200 MB 與 1 GB；Premium 與 Pro 則分別為每天 100 次與 200 次。你用於轉換的一般工作額度是分開計算的，不受影響。目前生效的數字列在 /pricing。',
        },
        {
          question: '矩形需要多精確？',
          answer: '不需要很精確。遮罩就是你畫的矩形，四捨五入為整數像素，所以請在物件及其陰影周圍多包含一點背景。模型會融合多出來的邊緣。',
        },
        {
          question: '可以一次移除多個物件嗎？',
          answer: '可以。你畫的每個矩形都會繪入同一張遮罩，並在一次處理中全部填補。至少需要一個矩形，否則工作會被拒絕。',
        },
        {
          question: '為什麼填補區域看起來模糊或重複？',
          answer: 'LaMa 依據方框周圍的像素進行填補。蓋住細節或規則圖樣的方框會讓它只能猜測。試著把方框畫得更貼合、一次移除一個物件，或選擇物件後方背景較單純的照片。',
        },
        {
          question: '結果會是什麼格式？',
          answer: '就是你在表單中選擇的格式：JPG、PNG、WebP 或 GIF。輸入會在修補前轉換為 RGB，因此不會保留透明度。PNG 可避免填補區域出現 JPEG 瑕疵。',
        },
        {
          question: '結果會保留我的 EXIF 資料嗎？',
          answer: '不會。AI 路徑會略過一般轉換器會執行的 exiftool 複製，而 Pillow 會寫入全新的檔案，因此不會帶過任何相機、日期或 GPS 標籤。',
        },
        {
          question: '遮罩或我的相片會被傳送到其他地方嗎？',
          answer: '不會。遮罩是我們伺服器上的暫存檔案，執行後即會刪除，修補模型則在我們自己的 GPU 上執行。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '每個工作會消耗每日 AI 工作額度中的一次 AI 工作；你的方案的單一檔案大小上限會顯示在表單中。',
        ],
      },
      related: [
        {
          label: '移除圖片背景',
          to: '/tools/remove-background-from-image',
          description: '直接把主體完整去背，而不是修補單一區域。',
        },
        {
          label: '模糊相片中的人臉',
          to: '/tools/blur-faces-in-photo',
          description: '隱藏人物，而不必憑空生成背景。',
        },
        {
          label: '遮蓋圖片中的文字',
          to: '/tools/redact-text-in-image',
          description: '將 OCR 能找到的文字塗黑，而不是修補掉。',
        },
        {
          label: 'AI 圖片修復',
          to: '/tools/ai-image-restoration',
          description: '清理修補處周圍的雜訊與壓縮瑕疵。',
        },
        {
          label: '壓縮圖片',
          to: '/tools/compress-image',
          description: '縮小完成的相片以便分享。',
        },
      ],
      embed: {
        title: '移除相片中的物件',
        description: '上傳相片。「移除物件」已預先選取並鎖定。在想要移除的內容上畫出一個或多個矩形，然後轉換。',
      },
    },
    'clean-voice-audio': {
      name: '人聲音訊降噪',
      h1: '用 AI 清理人聲錄音',
      tagline: '減少 Podcast、訪談和語音備忘錄中的嘶嘶聲、房間底噪和低頻隆隆聲，讓語音更清晰。',
      metaTitle: '用 AI 清理人聲錄音 | Media Manipulator',
      metaDescription: '用 AI 清理人聲錄音。減少嘶嘶聲、嗡嗡聲和房間雜訊，讓語音更容易聽清。執行在我們自己的 GPU 上。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '用 AI 清理人聲錄音',
      ogDescription: '減少嘶嘶聲、嗡嗡聲與房間雜音，讓 Podcast、訪談與語音備忘錄中的語音更清晰。',
      intro: '在有回音的廚房裡用手機錄的語音備忘錄、用筆電麥克風錄音的 Podcast 來賓、從教室後方錄下的講座：話都錄到了，卻埋在嘶嘶聲與房間雜音之下。「清理人聲」會先在我們的 GPU 上用 DeepFilterNet 處理錄音，再經過一條固定的廣播級潤飾鏈，去除低頻隆隆聲、限制高頻、將音量調整到一致的響度，並防止峰值削波。它是為說話而設計的，不適用於音樂。',
      whatItDoes: [
        '用 ffmpeg 將你上傳的檔案轉換為 48 kHz 單聲道（這是 DeepFilterNet 所需的輸入），並將該 WAV 交給我們 GPU 上的模型。',
        '使用 DeepFilterNet 增強網路，在保留語音的同時抑制穩定的背景聲音（嘶嘶聲、風扇聲、嗡嗡聲、房間底噪）。',
        '降噪後套用潤飾鏈：80 Hz 高通、14 kHz 低通、以 -1.5 dBTP 真實峰值上限將響度標準化至 -16 LUFS，以及 0.95 的限幅器。',
        '以你選擇的格式編碼結果：MP3、AAC 或 OGG 為 192 kbps，Opus 為 128 kbps，或 FLAC、16 位元 WAV。',
        '略過標準的位元率、EQ、效果與剪輯控制項，因為 AI 路徑會取代一般的 ffmpeg 濾鏡流程。',
      ],
      flowSteps: [
        {
          title: '上傳錄音',
          description: 'MP3、WAV、FLAC、M4A、AAC、OGG 或 Opus 格式的語音備忘錄、訪談音訊、Podcast 錄音或講座錄音。',
        },
        {
          title: '已預設「清理人聲」',
          description: '本頁的操作已固定，唯一剩下的選擇是輸出格式。',
        },
        {
          title: '標準化、降噪、潤飾',
          description: 'ffmpeg 產生 48 kHz 單聲道 WAV，DeepFilterNet 進行降噪，潤飾濾鏡再設定音色與響度。',
        },
        {
          title: '下載並試聽',
          description: '發布前，請戴上耳機與原始檔比較。',
        },
      ],
      advancedDetails: [
        '潤飾鏈完全就是 highpass=f=80,lowpass=f=14000,loudnorm=I=-16:TP=-1.5:LRA=11,alimiter=limit=0.95，對降噪後的 WAV 套用一次。高通會去除手持操作的隆隆聲與爆破音的悶響，低通會壓低 14 kHz 以上的嘶嘶聲，loudnorm 則將整合響度調整到 -16 LUFS，這是口語 Podcast 的常見目標。',
        '由於模型只在單一聲道上執行，輸出一律為 48 kHz 單聲道。立體聲訪談仍然聽得清楚，但會失去左右定位；如果你需要立體聲，這不是合適的工具。',
        '編碼器設定取決於輸出副檔名：MP3 使用 libmp3lame 192 kbps，AAC 或 M4A 使用 aac 192 kbps，OGG 使用 libvorbis 192 kbps，Opus 使用 libopus 128 kbps，FLAC 使用 flac，WAV 使用 pcm_s16le。AI 路徑沒有位元率選擇器。',
        '選擇 AI 操作時，剪輯範圍與一般效果都會被忽略；轉換器會將檔案直接送往模型並傳回結果。如果你只想清理部分內容，請先剪輯錄音。',
        '再次以「清理人聲」處理會將已在 -16 LUFS 的音訊重新標準化，並可能讓子音帶有水聲般的質感。請只執行一次。',
        '模型難以處理互相競爭的人聲、背景音樂與突然的巨大聲響；這些並不屬於「穩定的背景聲音」，大部分會被保留。',
      ],
      whyItMatters: [
        '即使說話內容值得一聽，聽眾也會關掉聽起來很累的錄音。',
        '一致的 -16 LUFS 音量代表一集節目播放時的音量與前後集相同，無需手動調整增益。',
        '從雜音中凸顯出來的語音也能更準確地轉錄，所以先清理也能改善字幕。',
      ],
      useCases: [
        {
          title: 'Podcast 與訪談',
          description: '整理用基本麥克風錄音的遠端來賓，並讓其響度與主持人一致。',
        },
        {
          title: '語音備忘錄與聽寫',
          description: '讓手機錄音日後也聽得懂，而且不戴耳機也夠大聲。',
        },
        {
          title: '講座與會議',
          description: '降低從房間後方錄下的錄音中冷氣的嗡嗡聲與投影機風扇聲。',
        },
        {
          title: '影片旁白',
          description: '在放進 Darkroom 編輯器之前先潤飾旁白。',
        },
      ],
      workedExamples: [
        {
          title: '一段 12 分鐘的手機備忘錄（M4A，128 kbps，約 11 MB）轉為 MP3',
          body: '128 kbps 的 AAC 檔案每秒 16 KB，因此 720 秒約為 11.5 MB。十二分鐘超過訪客的 5 分鐘上限，所以需要免費帳號（20 分鐘）。ffmpeg 會先在暫存資料夾中寫入一個約 69 MB 的 48 kHz 單聲道 WAV（每秒 96,000 位元組），該資料夾會在工作結束時移除。DeepFilterNet 與潤飾鏈在其上執行，MP3 編碼器則以 192 kbps 寫入結果：約 17 MB，比輸入還大，因為 192 kbps 的位元率高於備忘錄原本的錄製位元率。兩個 ffmpeg 步驟只需幾秒；DeepFilterNet 處理占用大部分時間，並隨錄音長度增加。',
        },
        {
          title: '一段 4 分鐘的立體聲 WAV 訪談（44.1 kHz，16 位元，約 42 MB）轉為 WAV',
          body: '立體聲 16 位元 44.1 kHz PCM 每秒 176,400 位元組，因此 240 秒約為 42 MB，在訪客的 200 MB 與 5 分鐘限制之內。模型執行前，檔案會被混為單聲道並重新取樣至 48 kHz，清理後的 WAV 會以 16 位元單聲道 48 kHz 傳回：每秒 96,000 位元組，約 23 MB。它比輸入小，只是因為它只有一個聲道而不是兩個。改選 FLAC 能以更小的空間無損保留相同的取樣；選擇 MP3 則在 192 kbps 下約為 5.8 MB。',
        },
      ],
      whenNotToUse: '處理音樂、歌唱，或任何背景本身就是你想保留之聲音一部分的內容時，請略過此工具：模型會把所有非語音的內容都當成雜音，而潤飾鏈會切掉 80 Hz 以下與 14 kHz 以上的頻率，讓樂器聽起來空洞。當你需要保留立體聲、錄音已經削波或失真（那種損傷不是雜音，無法濾除），或你只想降低雜音而不改變音量或音色時，它也不是正確的選擇；後者正是「去除背景雜音」頁面的用途。',
      whyMediaManipulator: [
        'DeepFilterNet 與潤飾鏈在我們營運的 GPU 上執行；錄音不會傳送給外部的語音增強服務。',
        '本頁開啟時已選好「清理人聲」，操作選單也已隱藏，因此你唯一要決定的是輸出格式。',
        '一次清理工作計為每日額度中的一次一般工作（預設訪客 5 次，免費帳號 30 次），而不是 AI 工作，失敗的工作會退還額度。',
      ],
      privacyNote: '你的錄音會儲存在其工作資料夾中，由 ffmpeg 在暫存目錄中轉換為 48 kHz 單聲道的暫存 WAV，再交給我們自己 GPU 上的 DeepFilterNet；清理後的檔案編碼完成後，該暫存目錄會立即刪除。清理後的輸出會隨工作保存以供下載。音訊上傳也會經過我們伺服器上的自動分析，以 Whisper 轉錄錄音以進行內部內容審查，並將結果隨工作保存。沒有任何第三方 AI 供應商會收到這個檔案。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      faq: [
        {
          question: '為什麼清理後的檔案是單聲道？',
          answer: '處理流程會在 DeepFilterNet 執行前，將每個輸入轉換為 48 kHz 的單一聲道，並將模型的輸出原樣編碼。因此立體聲錄音會以單聲道傳回。對於雙麥克風的訪談，如果需要保留分離，請先拆開聲道，再分別清理每一個聲道。',
        },
        {
          question: '「清理人聲」會標準化到什麼響度？',
          answer: '潤飾鏈使用 ffmpeg loudnorm，整合目標為 -16 LUFS、真實峰值上限為 -1.5 dBTP、響度範圍為 11 LU，之後再接 0.95 的限幅器。這符合常見的口語內容交付目標，因此在這裡清理過的節目，音量會與經過專業母帶處理的 Podcast 相近。',
        },
        {
          question: '可以在本頁設定位元率或剪輯檔案嗎？',
          answer: '不行。AI 操作啟用時，轉換器會直接送往模型，並忽略位元率、EQ、效果與剪輯設定。輸出位元率由格式決定：MP3、AAC 與 OGG 為 192 kbps，Opus 為 128 kbps。如果只想處理部分內容，請先用其他工具剪輯錄音。',
        },
        {
          question: '這與「去除背景雜音」有什麼不同？',
          answer: '兩者執行相同的 DeepFilterNet 模型。「清理人聲」之後會再加上高通、低通、響度標準化與限幅器；「去除背景雜音」則在降噪後的訊號就停止，不更動你的音量與音色。完成版的口語檔案請選擇「清理人聲」，如果你打算自己混音或做母帶處理，則使用另一個頁面。',
        },
        {
          question: '它能修復削波或失真的錄音嗎？',
          answer: '不能。削波是波形缺失，而不是額外的雜音，模型沒有東西可以扣除。它仍能降低失真錄音周圍的嘶嘶聲，但響亮音節上的破音會保留下來。',
        },
        {
          question: '每天可以清理幾段錄音？是免費的嗎？',
          answer: '「清理人聲」刻意計為一般工作，因此會消耗一般工作額度中的一次：預設訪客每天 5 次、免費帳號 30 次、Premium 300 次、Pro 700 次，檔案上限為 200 MB、1 GB 與 5 GB，長度上限為 5 分鐘、20 分鐘與 2 小時。最新的表格列在 /pricing。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '「清理人聲」使用一般工作額度；長度限制取決於你的方案，並會即時顯示在表單中。',
        ],
      },
      related: [
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: '相同的降噪器，但不含響度與音色潤飾。',
        },
        {
          label: '影片轉錄',
          to: '/tools/transcribe-video',
          description: '把清理後的語音變成字幕或文字。',
        },
        {
          label: '從影片擷取音訊',
          to: '/tools/extract-audio-from-video',
          description: '清理前先從影片中取出人聲音軌。',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '將潤飾後的旁白放到影片時間軸上。',
        },
        {
          label: '去除歌曲人聲',
          to: '/tools/remove-vocals-from-song',
          description: '處理音樂而非語音時，改為分離歌手的聲音。',
        },
      ],
      embed: {
        title: '清理人聲錄音',
        description: '上傳錄音。「清理人聲」已自動套用，因此沒有需要設定的操作選單。如果需要預設以外的格式，請選擇輸出格式，然後轉換。',
      },
    },
    'remove-background-noise': {
      name: '去除背景雜音',
      h1: '線上去除音訊背景雜音',
      tagline: '用 AI 降噪器降低錄音中的嘶嘶聲、嗡嗡聲、車流聲和房間雜訊，讓主要聲音更突出。',
      metaTitle: '線上去除音訊背景雜音 | Media Manipulator',
      metaDescription: '去除音訊中的背景雜音。AI 降噪器會降低錄音中的嘶嘶聲、嗡嗡聲和環境音。執行在我們自己的 GPU 上。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上去除音訊背景雜音',
      ogDescription: 'AI 降噪器，可降低錄音中的嘶嘶聲、嗡嗡聲、車流聲與房間雜音。',
      intro: '冷氣、電腦風扇、街道車流與電流嗡嗡聲，都是藏在你真正想錄的內容底下的穩定聲音。本頁在我們的 GPU 上用深度學習降噪器 DeepFilterNet 處理檔案，並傳回降噪後的訊號，其他一切都不變：沒有響度標準化、沒有等化、沒有限幅器。因此，當你打算自己混音或做母帶處理，或想保留原始錄音的特色時，這是正確的選擇。',
      whatItDoes: [
        '用 ffmpeg 將上傳檔案重新取樣為 48 kHz 單聲道，並將該 WAV 交給我們 GPU 上的 DeepFilterNet 執行檔。',
        '估算穩定的底噪並將其扣除，降低嘶嘶聲、嗡嗡聲、風扇、空調送風與持續的車流聲。',
        '以你選擇的格式編碼並傳回模型的原始輸出，峰值音量與音色平衡都維持模型產生的樣子；本頁沒有任何後製處理階段。',
        '操作選單保持可見，因此你可以在同一個表單中切換到「清理人聲」或人聲工具。',
      ],
      flowSteps: [
        {
          title: '上傳音訊',
          description: '任何常見的音訊檔案，包括從影片中擷取的音軌。',
        },
        {
          title: '已預先選取降噪',
          description: '「移除背景噪音」已經選好；如果你想要 MP3 以外的格式，請變更輸出格式。',
        },
        {
          title: 'DeepFilterNet 在我們的 GPU 上執行',
          description: '模型會將穩定的雜音與前景分離，並寫入增強後的 WAV。',
        },
        {
          title: '編碼並下載',
          description: 'ffmpeg 會以你選擇的格式寫入增強後的 WAV；請與原始檔對照試聽。',
        },
      ],
      advancedDetails: [
        '在 API 中，本頁與「清理人聲」唯一的差別是一個旗標：polish=false。ffmpeg 編碼步驟不會收到任何 -af 濾鏡，因此增強後的 WAV 會照 DeepFilterNet 寫出的樣子編碼。',
        '輸入標準化為 ffmpeg -ac 1 -ar 48000：模型在單一 48 kHz 聲道上執行，因此無論輸入的聲道配置或取樣率為何，輸出都是 48 kHz 單聲道。',
        '編碼器依副檔名而定：MP3 透過 libmp3lame 以 192 kbps 編碼、AAC 為 192 kbps、OGG 透過 libvorbis 以 192 kbps 編碼、Opus 透過 libopus 以 128 kbps 編碼、FLAC 為無損、WAV 為 pcm_s16le。如果你還要進一步編輯，請選擇 WAV 或 FLAC，這樣只需承受一次有損編碼。',
        '由於沒有執行響度標準化，小聲的錄音仍會很小聲。降噪會移除能量，因此結果的音量可能比輸入略低；如有需要，之後請在編輯器中提高增益。',
        'DeepFilterNet 是以穩定與緩慢變化的雜音訓練的。鍵盤敲擊聲、關門聲、第二位說話者或背景音樂大多會被保留，因為在模型看來它們都像是訊號。',
        '存放標準化與增強後 WAV 的暫存目錄會在工作結束時刪除；只有編碼後的輸出會隨工作保存。',
      ],
      whyItMatters: [
        '持續的雜音會掩蓋輕柔的子音，在聽眾察覺原因之前就讓他們感到疲累。',
        '許多錄音無法重錄：婚禮致詞、講座、與已無法再聯絡之人的訪談。',
        '未經標準化或限幅的降噪音軌，能為你自己的混音提供乾淨的起點，而不是一個聽起來已經完成、你還得想辦法復原的檔案。',
      ],
      useCases: [
        {
          title: '從影片中取出的音訊',
          description: '擷取音軌，去除攝影機風扇聲或風聲，再於 Darkroom 中將其放回畫面底下。',
        },
        {
          title: '現場錄音',
          description: '降低戶外訪談底下的道路或發電機低鳴聲。',
        },
        {
          title: '通話與會議匯出檔',
          description: '在分享或轉錄錄下的通話之前，降低線路的嘶嘶聲。',
        },
        {
          title: '數位化的錄音帶',
          description: '降低轉檔錄音中的磁帶嘶聲，而不改變其音量。',
        },
      ],
      workedExamples: [
        {
          title: '一段 18 分鐘、128 kbps 的 MP3 通話錄音（約 17 MB）轉為 FLAC',
          body: '128 kbps 的 MP3 每秒 16 KB，因此 1,080 秒約為 17 MB。十八分鐘在免費帳號的 20 分鐘上限之內，但超過訪客的 5 分鐘上限，所以請先登入。ffmpeg 會為模型寫入一個約 104 MB 的 48 kHz 單聲道 WAV（每秒 96,000 位元組），該 WAV 會在編碼後捨棄。選擇 FLAC 會無損傳回增強後的 48 kHz 單聲道取樣；FLAC 會比 104 MB 的 WAV 小，小多少取決於移除了多少靜音與嘶嘶聲，而降噪本身通常也會讓 FLAC 壓縮得更好。若改選 MP3，在 192 kbps 下約為 26 MB。',
        },
        {
          title: '一段 4 分 30 秒、約 30 MB 的立體聲 FLAC 現場錄音轉為 WAV',
          body: '四分半鐘與 30 MB 都在訪客的 5 分鐘與 200 MB 限制之內，因此不需要帳號。立體聲檔案會被混為單聲道並重新取樣至 48 kHz，DeepFilterNet 會降低車流底噪，WAV 輸出為 16 位元單聲道 48 kHz：270 秒、每秒 96,000 位元組，約 26 MB。音量就是模型留下的樣子，沒有套用任何標準化，因此如果原始錄音較小聲，請在編輯器中提高音量。兩次 ffmpeg 轉換各需幾秒；GPU 處理時間則隨長度增加。',
        },
      ],
      whenNotToUse: '如果雜音是斷斷續續的，或本身就是人聲，這不是適合的工具：重疊的說話者、隔壁房間的電視、椅子拖動聲與鍵盤敲擊聲大多會被保留，因為模型是為穩定雜音而設計的。請不要用在完成的音樂上，它移除的「雜音」可能正是你花錢錄下的殘響與空間氛圍。如果你需要立體聲輸出，這也不是正確的選擇，因為處理流程是單聲道的。如果你想要一個達到標準響度、可直接發布的口語檔案，「清理人聲」會加上那層潤飾；本頁則刻意不這麼做。',
      whyMediaManipulator: [
        '降噪器在我們營運的 GPU 上執行；你的音訊不會上傳到第三方的除噪服務。',
        '模型之後不會再加上任何處理：不改變響度、不做 EQ，所以你聽到的就是降噪，而且只有降噪。',
        '一次降噪工作計為每日額度中的一次一般工作，而不是 AI 工作，工作失敗時會退還額度。',
      ],
      privacyNote: '你上傳的檔案會寫入其工作資料夾，由 ffmpeg 在暫存目錄中重新取樣為 48 kHz 單聲道的暫存 WAV，再由我們自己 GPU 上的 DeepFilterNet 降噪；輸出編碼完成後，暫存目錄就會移除。編碼後的結果會隨工作保存以供下載。與所有音訊上傳一樣，它也會經過我們伺服器上的自動分析步驟，以 Whisper 轉錄以進行內部審查，結果會隨工作保存。不會有任何內容傳送給外部 AI 供應商。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      faq: [
        {
          question: 'DeepFilterNet 擅長處理哪些雜音？哪些不擅長？',
          answer: '穩定、緩慢變化的聲音：嘶嘶聲、市電嗡嗡聲、風扇、冷氣、房間底噪、持續的道路聲。短暫的聲響與任何類似語音的聲音（第二個人、電視、喀噠聲、碰撞聲）在模型看來都像前景，大多會被保留。',
        },
        {
          question: '錄音的音量或音色會改變嗎？',
          answer: '只會因為移除雜音能量而附帶改變；本頁不會套用任何標準化、EQ 或限幅。如果你想要一致的 -16 LUFS 口語音量，再加上高通與低通處理，請使用「清理人聲」，它執行相同的模型並加上那條潤飾鏈。',
        },
        {
          question: '為什麼降噪後的檔案是單聲道？',
          answer: '模型只接受單一 48 kHz 聲道，因此 ffmpeg 會先將任何立體聲輸入混為單聲道，輸出也以單聲道寫入。如果立體聲錄音的每個聲道雜音不同，而你需要保留立體聲，請先拆開聲道，再一次處理一個聲道。',
        },
        {
          question: '可以直接對影片的音訊降噪嗎？',
          answer: '請上傳音軌而不是影片：先用「從影片擷取音訊」工具擷取音軌，在這裡降噪，再於 Darkroom 中將清理後的音軌與影片合併。',
        },
        {
          question: '哪種輸出格式最適合進一步編輯？',
          answer: 'WAV（16 位元單聲道 48 kHz，每秒 96 KB）或 FLAC，後者以更小的空間保存相同的取樣。MP3、AAC 與 OGG 以 192 kbps 寫入，Opus 則為 128 kbps；只在最終分享時才選擇這些格式，讓有損編碼只發生一次。',
        },
        {
          question: '降噪會計入 AI 工作額度嗎？',
          answer: '不會。去除背景雜音與「清理人聲」一樣，刻意計為一般工作：預設訪客每天 5 次、免費帳號 30 次、Premium 300 次、Pro 700 次。（分離或移除人聲則不同：每次都計為一次 AI 工作。）長度上限為訪客 5 分鐘、免費帳號 20 分鐘；目前的限制列在 /pricing。',
        },
        {
          question: '如果錄音本來就相當乾淨呢？',
          answer: '模型仍會執行，並移除它找到的任何殘餘底噪，但聽得出的差異會很小，你可能會比較喜歡未經處理的原始檔。替換任何檔案之前，請先比較兩者。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '降噪使用一般工作額度；長度限制取決於你的方案，並會即時顯示在表單中。',
        ],
      },
      related: [
        {
          label: '人聲音訊降噪',
          to: '/tools/clean-voice-audio',
          description: '相同的降噪器，再加上針對語音的響度與音色潤飾。',
        },
        {
          label: '從影片擷取音訊',
          to: '/tools/extract-audio-from-video',
          description: '先從影片中取出音軌。',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '將降噪後的音軌放回影片底下。',
        },
        {
          label: '影片轉錄',
          to: '/tools/transcribe-video',
          description: '轉錄更乾淨的音訊來製作字幕。',
        },
        {
          label: '去除歌曲人聲',
          to: '/tools/remove-vocals-from-song',
          description: '用另一個模型將歌聲與音樂分離。',
        },
      ],
      embed: {
        title: '去除背景雜音',
        description: '上傳錄音。「移除背景噪音」已為你選好。你仍然可以變更輸出格式，然後轉換。',
      },
    },
    'remove-vocals-from-song': {
      name: '去除歌曲人聲',
      h1: '去除歌曲人聲，製作伴奏或卡拉 OK 音軌',
      tagline: '去掉音軌中的歌聲並保留音樂，用於卡拉 OK、練習和伴奏。請僅用於你擁有權利的音樂。',
      metaTitle: '去除歌曲人聲：卡拉 OK 製作器 | Media Manipulator',
      metaDescription: '用 AI 去除歌曲中的人聲，並以與原檔案相同的格式或 FLAC、WAV 下載伴奏。在我們自己的 GPU 上製作卡拉 OK 和練習音軌。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '去除歌曲人聲，製作卡拉 OK',
      ogDescription: '用 AI 去除歌曲中的歌聲，並將伴奏下載為 MP3、FLAC 或 WAV。',
      intro: '卡拉 OK 之夜、歌唱練習與翻唱錄音，都需要沒有歌手的樂團伴奏。本頁在我們的 GPU 上以雙分軌模式用 Demucs（htdemucs 模型）處理歌曲，將混音分成「人聲」與「其他所有聲音」，並傳回「其他所有聲音」分軌。伴奏預設會以與你的檔案相同的格式傳回，因此 320 kbps 的 MP3 仍是 320 kbps 的 MP3，而不會膨脹成 WAV；需要可供編輯的無損檔案時，也可以選擇 FLAC 與 WAV。',
      whatItDoes: [
        '以 --two-stems=vocals 執行 Demucs htdemucs，因此模型只估算兩個部分：主唱與伴奏。',
        '保留 no_vocals 分軌並捨棄人聲分軌；結果是一個去除歌聲的立體聲檔案。',
        '上傳時將「與輸入相同」解析為具體格式：MP3 維持 MP3、AAC/M4A 維持 AAC/M4A、OGG 與 Opus 維持原樣，而 WAV、FLAC、AIFF 或 ALAC 輸入則以 FLAC 傳回。',
        '以 320 kbps 寫入 MP3 與 AAC 分軌，而不是其他音訊工具使用的 192 kbps，因此編碼不會在分離之外再造成可聽見的損失。',
        '開始之前，會根據檔案長度顯示每種格式選項的預估輸出大小。',
      ],
      flowSteps: [
        {
          title: '上傳歌曲',
          description: '你擁有或獲得授權使用的音軌，格式為 MP3、WAV、FLAC、M4A、AAC、OGG 或 Opus。',
        },
        {
          title: '已預設「移除人聲」',
          description: '操作已固定；「輸出格式」預設為「與輸入相同」，也可選擇 MP3、FLAC 與 WAV。',
        },
        {
          title: 'Demucs 分離混音',
          description: '模型在我們的 GPU 上以 7 秒為一段處理整首歌，並寫入 vocals.wav 與 no_vocals.wav。',
        },
        {
          title: '編碼並下載',
          description: 'no_vocals 分軌會以解析出的格式編碼，並提供下載。',
        },
      ],
      advancedDetails: [
        '實際的指令是 demucs -n htdemucs --two-stems=vocals --segment 7；分段長度限制了 GPU 記憶體用量，讓長曲目也能在單張顯示卡上執行。無論輸入的取樣率或聲道數為何，Demucs 都會寫出 44.1 kHz 立體聲分軌，因此單聲道或 48 kHz 的來源會以 44.1 kHz 立體聲傳回。',
        '分軌編碼方面，MP3 為 libmp3lame -b:a 320k，AAC 或 M4A 為 aac -b:a 320k；OGG 維持 192 kbps、Opus 為 128 kbps，FLAC 與 WAV 則為無損。其他所有 AI 音訊操作都使用 192 kbps，320 kbps 是分軌專用的位元率。',
        '「與輸入相同」的規則是：有損輸入會傳回相同的容器，無損輸入會傳回 FLAC，而影片檔案或伺服器無法判斷的任何檔案則傳回 320 kbps 的 MP3。.m4a 會先用 ffprobe 探測再決定，因為它可能包含無損的 ALAC 而不是 AAC。',
        '這條規則源自一個真實的工作：一個 87 分鐘、68 MB 的 MP3 曾經以 880 MB 的 WAV 傳回。PCM 無法增加有損來源原本就沒有的保真度，因此現在預設絕不會將有損音訊放大成 WAV；明確選擇 WAV 時仍會照辦。',
        '分離永遠不會完美。人聲的殘響尾音、背景和聲，以及任何模型聽起來「像人聲」的聲音（某些合成器主奏、口哨）都可能滲入伴奏中，而且密集的混音分離效果會比現代、空間感良好的製作更差。',
        '當選擇 WAV 會超過 500 MB 時，表單會發出警告，因為 44.1 kHz 立體聲 16 位元的 WAV 每秒 176,400 位元組，約為每分鐘 10.6 MB。',
      ],
      whyItMatters: [
        '大多數歌曲都沒有官方伴奏版本，而有授權的伴奏音軌通常是重新錄製的，而不是原始編曲。',
        '歌手跟著真實編曲排練，比跟著 MIDI 近似版本更有幫助。',
        '以輸入格式傳回分軌，能讓手機大小的檔案維持手機大小；一個 10 MB 的 MP3 不該意外變成 50 MB 的下載檔。',
      ],
      useCases: [
        {
          title: '在家唱卡拉 OK',
          description: '為你已經擁有的歌曲製作跟唱版本。',
        },
        {
          title: '歌唱練習',
          description: '跟著原始樂團排練你的部分，耳邊不會有主唱的聲音。',
        },
        {
          title: '翻唱與混音',
          description: '用伴奏作為你自己人聲錄音的底軌。',
        },
        {
          title: '影片背景音樂',
          description: '從你獲得授權的音樂中取出無人聲的底軌，用於 Darkroom 專案。',
        },
      ],
      workedExamples: [
        {
          title: '一首 4 分鐘、320 kbps 的 MP3（約 9.6 MB），使用「與輸入相同」',
          body: '320 kbps 的 MP3 每秒 40 KB，因此 240 秒約為 9.6 MB，遠在訪客的 5 分鐘與 200 MB 限制之內。由於輸入是 MP3，格式會解析為 MP3。Demucs 在我們的 GPU 上以 7 秒為一個視窗處理整首歌，並在暫存資料夾中寫入一個約 42 MB 的 44.1 kHz 立體聲 no_vocals.wav，再由 ffmpeg 以 libmp3lame 320 kbps 編碼：伴奏同樣約為 9.6 MB。暫存的 WAV 會被刪除。分離處理占用大部分執行時間，並隨曲目長度增加。',
        },
        {
          title: '一首 4 分 50 秒的 CD 音質 WAV（約 51 MB），預設 FLAC 或明確選擇 WAV',
          body: '44.1 kHz 立體聲 16 位元 WAV 每秒 176,400 位元組，因此 290 秒約為 51 MB，仍在訪客的 5 分鐘上限之內。由於輸入是無損的，「與輸入相同」會解析為 FLAC：表單估計 FLAC 約為 PCM 大小的 55%，約 28 MB，實際數字取決於音樂內容。改選 WAV 則會以 16 位元 PCM 傳回分軌，約 51 MB，與輸入大小相同；選擇 MP3 則在 320 kbps 下約為 11.6 MB。三者都來自同一個 no_vocals 分軌，只有編碼器不同。',
        },
      ],
      whenNotToUse: '請不要對你未擁有或未取得授權的音樂執行此工具；你需要對結果的使用方式負責。當你想要的是歌手而不是樂團（那是同一個表單中的「分離人聲」操作）、需要拆成鼓、貝斯與其他樂器的四軌分離（本頁只會產生人聲與伴奏），或錄音是說話而不是歌唱時（「清理人聲」與背景雜音頁面處理得更好），它也不是正確的工具。非常老舊的單聲道錄音，以及人聲滲入每支麥克風的現場私錄版本分離效果很差，請預期會聽到明顯的殘影。',
      whyMediaManipulator: [
        '分離在我們營運的 GPU 上以 Demucs htdemucs 模型執行；你的音樂不會傳送給外部的分軌服務。',
        '輸出預設跟隨你的檔案格式，MP3 或 AAC 分軌以 320 kbps 編碼，FLAC 或 WAV 只需點一下即可選擇。',
        '開始之前就會顯示每種格式的預估大小，因此過大的 WAV 是你的選擇，而不是意外。',
      ],
      privacyNote: '你的歌曲會儲存在其工作資料夾中，並交給我們自己 GPU 上的 Demucs，由它將人聲與伴奏分軌寫入暫存目錄；只有伴奏會被編碼成你的下載檔，暫存目錄（包括被捨棄的人聲分軌）會在工作結束時刪除。編碼後的伴奏會隨工作保存。音訊上傳也會經過我們伺服器上的自動分析步驟，以 Whisper 轉錄檔案以進行內部審查，結果會隨工作保存。不涉及任何第三方 AI 供應商。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      faq: [
        {
          question: '歌手的聲音會被完全去除嗎？',
          answer: '主唱的大部分會被去除，但很少能完全去除。殘響尾音、疊錄與和聲人聲，以及模型聽起來像人聲的聲音，可能會以低音量殘留。現代立體聲製作的分離效果最好；單聲道或嚴重串音的現場錄音最差。',
        },
        {
          question: '伴奏會是什麼格式與取樣率？',
          answer: 'Demucs 寫出 44.1 kHz 立體聲分軌，所以每個輸出都是這個取樣率。容器預設跟隨你的檔案：輸入 MP3，輸出 320 kbps 的 MP3；輸入 AAC 或 M4A，輸出相同格式、320 kbps；輸入 WAV、FLAC、AIFF 或 ALAC，輸出 FLAC。你也可以明確選擇 MP3、FLAC 或 WAV。',
        },
        {
          question: '為什麼預設不再是 WAV？',
          answer: '因為一個 87 分鐘、68 MB 的 MP3 以前會以 880 MB 的 WAV 傳回，而 PCM 無法還原有損來源原本就沒有的細節。現在分軌會維持輸入格式，有損分軌以 320 kbps 寫入，因此額外的編碼聽不出來。如果你需要，仍然可以選擇 WAV。',
        },
        {
          question: '可以只取得人聲而不要伴奏嗎？',
          answer: '可以，在音訊轉換器的操作選單中選擇「分離人聲」；它會保留同一次 Demucs 雙分軌處理中的 vocals.wav 分軌，並捨棄伴奏。',
        },
        {
          question: '可以上傳音樂影片而不是音訊檔案嗎？',
          answer: '請上傳音訊：先從影片中擷取音軌。如果影片檔案真的進入這個操作，伺服器會將「與輸入相同」解析為 320 kbps 的 MP3，因為影片容器不是音訊格式。',
        },
        {
          question: '每天可以免費分離幾首歌？',
          answer: '每首歌計為一次 AI 工作：預設沒有帳號每天 3 次、免費帳號 10 次、Premium 100 次、Pro 200 次。AI 工作額度是分開計算的，因此分離歌曲不會動用你的一般工作額度。歌曲長度上限為訪客 5 分鐘、免費帳號 20 分鐘、付費方案 2 小時；/pricing 列有目前的表格。',
        },
        {
          question: '用這種方式製作卡拉 OK 音軌合法嗎？',
          answer: '只有在使用你擁有、獲得授權，或依你所在地的例外規定可使用的音樂時才合法。這個工具不會檢查權利；你需要對結果及其散布方式負責。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '去除人聲使用 AI 工作額度；額度與長度限制取決於你的方案，並會即時顯示在表單中。',
        ],
      },
      related: [
        {
          label: '從影片擷取音訊',
          to: '/tools/extract-audio-from-video',
          description: '分離前先從音樂影片中取出音訊。',
        },
        {
          label: '人聲音訊降噪',
          to: '/tools/clean-voice-audio',
          description: '處理語音錄音時，改用語音增強模型。',
        },
        {
          label: '去除背景雜音',
          to: '/tools/remove-background-noise',
          description: '降低錄音中的穩定雜音，而不進行分離。',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '在影片剪輯中把伴奏當作背景音樂。',
        },
        {
          label: '影片轉錄',
          to: '/tools/transcribe-video',
          description: '從原始混音中取得歌詞文字。',
        },
      ],
      embed: {
        title: '去除歌曲人聲',
        description: '上傳歌曲。「移除人聲」已預先選取，伴奏會以與你的檔案相同的格式傳回（MP3 仍是 MP3）；如需無損，請在「輸出格式」下選擇 FLAC 或 WAV。然後按下轉換。',
      },
    },

    // 2026-10-31 (MM92): name + tagline for every remaining tool, so the /tools catalog
    // and the home grid never show an English card in this locale. Model-written; native review pending.
    'transcode-to-dash': {
      name: '將影片轉碼為 DASH（AV1 / VP9）',
      h1: '線上將影片轉碼為 DASH AV1 或 VP9',
      tagline: '把任何影片封裝成 MPEG-DASH 套件，包含 manifest.mpd 和依解析度劃分的初始化與媒體片段。',
      metaTitle: '線上將影片轉碼為 DASH AV1/VP9 | 免費 MPEG-DASH 工具',
      metaDescription: '免費線上 MPEG-DASH 轉碼工具。將 MP4、MOV、WebM、MKV 轉換為使用 AV1 或 VP9 影片的 DASH 套件，可選字幕與分鏡腳本。',
      ogTitle: '線上將影片轉碼為 DASH AV1/VP9',
      ogDescription: '從任何影片產生自適應 DASH 套件（manifest.mpd + 各版本的初始化與媒體片段），免費，直接在你的瀏覽器中使用。',
      intro: 'MPEG-DASH 是所有現代瀏覽器都支援的開放式自適應串流標準。Media Manipulator 會將你的來源影片轉碼為 DASH VOD 套件（manifest.mpd 加上每個版本各自的 init.mp4 與 .m4s 片段），使用 AV1（檔案更小，最適合新式網頁播放器）或 VP9（播放支援更廣）。將解壓縮後的資料夾放到任何 CDN 或來源伺服器，再向用戶端提供 manifest.mpd 即可。免費方案涵蓋 360p、480p 與 720p。',
      whatItDoes: [
        '以 ffprobe 探測你的來源，顯示解析度、FPS、長度、編解碼器與音訊狀態。',
        '讓你選擇要編碼哪些品質等級，以及要輸出 AV1 或 VP9。',
        '自動偵測可用的最佳 AV1 編碼器（av1_nvenc → libsvtav1 → libaom-av1）。',
        '產生 MPEG-DASH manifest.mpd，參照每個影片 Representation，有音訊時再加上一個 AAC 音訊 Representation。',
        '可選擇產生 WebVTT 字幕與分鏡腳本拖曳列縮圖。',
        '將結果打包成 media-manipulator-dash-<codec>-<jobID>.tar.gz，附上 report.json 與 README。',
        '將壓縮檔上傳到 S3，並交給你一個短期有效、預先簽署的 GET URL。',
      ],
      flowSteps: [
        {
          title: '上傳',
          description: '直接以預先簽署的 S3 PUT 上傳，你的檔案絕不會經過 API 伺服器。',
        },
        {
          title: '探測',
          description: 'ffprobe 讀取解析度、FPS、是否有音訊，以及編解碼器中繼資料。',
        },
        {
          title: '選擇等級與編解碼器',
          description: '選擇 AV1 或 VP9，以及 360p/480p/720p 的任意組合。',
        },
        {
          title: '編碼',
          description: '以 AV1（svtav1/libaom/nvenc）或 libvpx-vp9 編碼，片段長 2 秒。',
        },
        {
          title: '打包',
          description: '將 manifest.mpd 與各版本的初始化檔／片段連同 report.json 與 README 打包成 tar.gz。',
        },
        {
          title: '下載',
          description: '預先簽署的 S3 GET URL，有效期 30 分鐘。',
        },
      ],
      advancedDetails: [
        'AV1 編碼器的選擇會優先使用 av1_nvenc（GPU，若可用），其次退回 libsvtav1，再來是 libaom-av1。',
        'VP9 使用 libvpx-vp9，搭配 row-mt、frame-parallel 解碼，以及 CRF + 位元率引導。',
        'DASH 變體以 -seg_duration 2 -use_template 1 -use_timeline 0 -single_file 0 輸出。',
        'manifest.mpd 為每種內容類型宣告一個 AdaptationSet（影片，以及有音訊時的音訊），codecs 屬性為「av01.0.08M.08」／「vp09.00.51.08」／「mp4a.40.2」。',
        '不會放大：高於來源解析度的等級會被停用，並附上工具提示。',
      ],
      whyItMatters: [
        '在同等品質下，AV1 的位元率通常只有 H.264 的一半。',
        '在 Apple 生態系之外，DASH 是最主流的自適應串流格式。',
        '預先打包的 VOD 可避免串流平台上按請求計費的轉碼費用。',
      ],
      useCases: [
        {
          title: '現代網頁播放器',
          description: 'Shaka Player 與 dash.js 都能原生讀取 manifest.mpd。',
        },
        {
          title: '對頻寬敏感的發布',
          description: 'AV1 的位元組數接近 H.264 HLS 套件的一半。',
        },
        {
          title: '內部媒體庫',
          description: '自行託管自適應影片，不必付費使用 SaaS 串流平台。',
        },
        {
          title: '品質測試',
          description: '從同一個來源並排進行 AV1 與 VP9 編碼的 A/B 比較。',
        },
      ],
      whyMediaManipulator: [
        '在我們自己的伺服器上執行，沒有任何第三方轉碼供應商會看到你的影片。',
        '預設選擇 AV1，因為 AV1 是高品質自適應串流的未來。',
        '開放的套件格式：只要解壓縮 .tar.gz 並託管 manifest.mpd 即可。',
      ],
      privacyNote: '你的影片會由 FFmpeg 讀取一次，編碼成 AV1 或 VP9 版本，並分割為附資訊清單的 DASH 片段，全部在我們的伺服器上完成。這項工作在我們自己的伺服器上執行，而不是第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號，你可以選擇保留 24 小時到 2 年。你的來源檔案不會被更動，結果是一個新檔案。',
      faq: [
        {
          question: 'AV1 還是 VP9，我該選哪一個？',
          answer: 'AV1 在同等品質下產生的檔案更小，但在只有 CPU 的主機上編碼較慢。VP9 的播放支援更廣，編碼也更快。預設為 AV1。',
        },
        {
          question: '我的伺服器顯示 AV1 無法使用？',
          answer: 'AV1 需要 FFmpeg 中具備 av1_nvenc（NVIDIA GPU）、libsvtav1 或 libaom-av1 其中之一。請查看 /api/video-transcode/capabilities，了解你的安裝具備哪些功能。',
        },
        {
          question: '音訊一律是 AAC 嗎？',
          answer: '是的。為了最大相容性，不論來源編解碼器為何，DASH 音訊 AdaptationSet 目前一律輸出 128 kbps 的 AAC LC。',
        },
        {
          question: '我可以跨來源提供這個資訊清單嗎？',
          answer: '可以，但你的 CDN／來源伺服器需要在 .mpd、init.mp4 與 .m4s 檔案上設定正確的 CORS 標頭。壓縮檔中不包含這些標頭。',
        },
        {
          question: '下載 URL 有效多久？',
          answer: '預先簽署的 GET URL 預設有效 30 分鐘。如果需要新的連結，請重新執行轉碼。',
        },
      ],
      related: [
        {
          label: '將影片轉碼為 HLS',
          to: '/tools/transcode-to-hls',
          description: '同樣的上傳方式，但輸出使用 H.264 + AAC 的 Apple HLS 套件。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '以一般的 FFmpeg 流程縮小 MP4。',
        },
        {
          label: '影片轉錄',
          to: '/tools/transcribe-video',
          description: '將影片中的語音擷取為可搜尋的文字。',
        },
      ],
      embed: {
        title: '將影片轉碼為 DASH（AV1 / VP9）',
        description: '上傳 MP4/MOV/WebM/MKV。我們會以 ffprobe 探測來源，讓你選擇免費的品質等級（360p/480p/720p），接著以 ffmpeg 執行 AV1（預設）或 VP9 編碼，並打包成附 manifest.mpd 的可下載 tar.gz。',
      },
    },
    'convert-webp-to-jpg': {
      name: '將 WebP 轉換為 JPG',
      h1: '線上將 WebP 轉換為 JPG',
      tagline: '把 WebP 圖片變成相容性廣泛的 JPG 檔案，任何看圖軟體或編輯器都能開啟。',
      metaTitle: '線上將 WebP 轉換為 JPG（免費） | Media Manipulator',
      metaDescription: '免費線上 WebP 轉 JPG 工具。依你選擇的品質，快速將 .webp 圖片變成相容性廣泛的 JPG 檔案。',
      ogTitle: '線上將 WebP 轉換為 JPG',
      ogDescription: '點幾下就能把 WebP 圖片變成相容性廣泛的 JPG 檔案。',
      intro: 'WebP 很適合網頁使用，但較舊的軟體、簡報工具和印表機常常無法讀取。Media Manipulator 會將 WebP 轉回 JPG，讓你在任何地方都能使用這張圖片。選擇你想要的品質，其餘交給我們處理。',
      whatItDoes: [
        '將任何 .webp 圖片（靜態圖片或動畫中的影格）轉換為標準的 .jpg。',
        '讓你選擇 JPG 品質：品質越高，檔案越大。',
        '將透明區域平面化到你選擇的背景色上（JPG 沒有 Alpha 色版）。',
        '盡可能保留色彩描述檔。',
      ],
      flowSteps: [
        {
          title: '上傳 WebP',
          description: '從電腦拖放 .webp 檔案。',
        },
        {
          title: '選擇 JPG 品質',
          description: '85 是不錯的預設值；想要更小的檔案就調低。',
        },
        {
          title: '編碼 JPG',
          description: 'ImageMagick 以所選的品質重新編碼。',
        },
        {
          title: '下載 JPG',
          description: '儲存相容性廣泛的 .jpg 檔案。',
        },
      ],
      advancedDetails: [
        '品質 85 是長久以來公認的平衡點：超過約 92 之後，大多只會增加檔案大小，畫面幾乎看不出改善。',
        'JPG 沒有透明度，因此透明的 WebP 會被平面化。如果你需要透明度，請改為轉換成 PNG。',
        '若需要無損的圖片轉換或處理動態 WebP，建議改用 PNG（靜態圖片）或動態 GIF。',
      ],
      whyItMatters: [
        '部分較舊的瀏覽器、圖片編輯器和嵌入式軟體仍不支援 WebP。',
        '許多印表機、相片自助沖印機和簡報工具都要求 JPG 或 PNG。',
        'JPG 是交換相片時實際上的標準格式。',
      ],
      useCases: [
        {
          title: '傳送相片給客戶',
          description: '確保收件人在任何裝置上都能開啟檔案。',
        },
        {
          title: '嵌入簡報',
          description: 'PowerPoint/Keynote 投影片在任何環境都接受 JPG；WebP 則不一定能用。',
        },
        {
          title: '列印與相片沖印店',
          description: '大多數沖印店只接受 JPG。',
        },
        {
          title: '投稿圖庫相片',
          description: '許多圖庫網站都要求上傳 JPG。',
        },
      ],
      whyMediaManipulator: [
        '無浮水印、無需註冊，一般使用完全免費。',
        '精確調整品質與壓縮，而不是套用一體適用的預設組。',
        '與整套工具的其他部分採用相同的隱私與保留模式。',
      ],
      privacyNote: '你的 WebP 會在我們的伺服器上解碼，並重新編碼為 JPG；透明區域會被平面化，因為 JPG 無法儲存透明度。不會傳送任何內容給外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。原始檔案絕不會被更改：你下載的是一個新檔案。',
      faq: [
        {
          question: '透明度會怎麼處理？',
          answer: 'JPG 不支援透明度。透明的 WebP 會以所選的背景色平面化。如果你需要透明度，請改為轉換成 PNG。',
        },
        {
          question: '我應該使用什麼品質？',
          answer: '85 是均衡的預設值。畫質最重要的相片請用 90 以上，縮圖或預覽則用 70。',
        },
        {
          question: '動態 WebP 也能轉換嗎？',
          answer: '只有第一個影格會變成 JPG。若是動態 WebP，請改為轉換成動態 GIF。',
        },
        {
          question: '可以批次轉換多個檔案嗎？',
          answer: '免費工具一次處理一個檔案。目前請逐一轉換每個 WebP。',
        },
      ],
      related: [
        {
          label: '將 WebP 轉換為 PNG',
          to: '/tools/convert-webp-to-png',
          description: '改用無損 PNG 來保留透明度。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在 JPG、PNG、WebP、AVIF 和 GIF 之間轉換。',
        },
        {
          label: '壓縮圖片',
          to: '/tools/compress-image',
          description: '進一步縮小 JPG 的檔案大小。',
        },
        {
          label: '移除 EXIF 中繼資料',
          to: '/tools/remove-exif-metadata',
          description: '分享 JPG 之前，先清除私人的中繼資料。',
        },
        {
          label: '圖片轉換器教學',
          to: '/tutorials/image/getting-started',
          description: '逐步說明每一個圖片選項。',
        },
      ],
      embed: {
        title: '將 WebP 轉換為 JPG',
        description: '上傳 WebP 圖片，並選擇 JPG 作為輸出格式。調整品質滑桿，在檔案大小與圖片品質之間取得平衡。JPG 會捨棄透明度，所以如果你的圖片有透明背景，請改用 PNG。',
      },
    },
    'convert-png-to-jpg': {
      name: '將 PNG 轉換為 JPG',
      h1: '線上免費將 PNG 轉換為 JPG',
      tagline: '幾秒內把容量龐大的 PNG 螢幕截圖和圖形，變成體積小、各處都能使用的 JPG 相片。',
      metaTitle: '線上免費將 PNG 轉換為 JPG | Media Manipulator',
      metaDescription: '免費線上 PNG 轉 JPG 工具。依你選擇的品質，將 .png 檔案變成體積更小、相容性廣泛的 JPG 圖片。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 PNG 轉換為 JPG',
      ogDescription: '將 PNG 圖片變成體積更小、相容性廣泛的 JPG 檔案。免費、快速、無需註冊。',
      intro: 'PNG 是無損格式，非常適合螢幕截圖和圖形，但用於相片時，檔案往往比實際需要的大得多。將 PNG 轉換為 JPG，可以讓檔案縮小 5–10 倍，而相片類內容看不出任何差異。Media Manipulator 會依你選擇的品質，將 PNG 轉換為乾淨的 JPG：免費、線上完成，而且無需註冊。',
      whatItDoes: [
        '將任何 .png 圖片轉換為標準的 .jpg（JPEG）檔案。',
        '讓你選擇 JPG 品質，在檔案大小與保真度之間取得平衡。',
        '將透明區域平面化到純色背景上，因為 JPG 沒有 Alpha 色版。',
        '你看到的像素維持不變；只有檔案從 PNG 重新編碼為 JPG。',
      ],
      flowSteps: [
        {
          title: '上傳 PNG',
          description: '拖放 .png 螢幕截圖、圖形或相片。',
        },
        {
          title: '選擇 JPG 品質',
          description: '85 是均衡的預設值；想要更小的檔案就調低。',
        },
        {
          title: '編碼 JPG',
          description: 'ImageMagick 將你的圖片重新編碼為 JPEG。',
        },
        {
          title: '下載 JPG',
          description: '儲存體積更小、相容性廣泛的 .jpg 檔案。',
        },
      ],
      advancedDetails: [
        '品質 85 是長久以來的最佳平衡點：超過約 92 之後，大多只是增加檔案大小，肉眼幾乎看不出改善。',
        '相片類 PNG 轉成 JPG 後，常常會從數 MB 降到數百 KB。',
        '對於邊緣銳利或含有文字的圖形，在相同大小下，PNG 或 WebP 通常比 JPG 看起來更乾淨。',
        '如果你的 PNG 有想要保留的透明度，請改為轉換成 WebP，因為 JPG 無法儲存 Alpha 色版。',
      ],
      whyItMatters: [
        'JPG 是接受度最廣的相片格式：每一種裝置、編輯器和上傳表單都支援。',
        '較小的 JPG 在網頁上載入更快，也能符合電子郵件和表單的上傳限制。',
        '許多沖印店、電商平台和圖庫網站只接受 JPG。',
      ],
      useCases: [
        {
          title: '縮小螢幕截圖',
          description: '將容量龐大的 PNG 螢幕截圖變成輕巧的 JPG，方便透過電子郵件或聊天傳送。',
        },
        {
          title: '上傳相片',
          description: '將相片類 PNG 轉換為 JPG，以符合網站的格式要求。',
        },
        {
          title: '列印與相片沖印店',
          description: '大多數沖印店都要求 JPG，下單前先轉換。',
        },
        {
          title: '更快的網頁',
          description: '用精簡的 JPG 取代大型 PNG 相片，降低網頁容量。',
        },
      ],
      whyMediaManipulator: [
        '輸出確實鎖定為 JPG，因此不會有設定錯誤的問題。',
        '精確的品質控制，而不是一體適用的預設組。',
      ],
      privacyNote: '你的 PNG 會在我們的伺服器上，依你設定的品質重新編碼為 JPG，任何透明區域都會平面化到純色背景上。不會傳送任何內容給外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。原始檔案絕不會被更改：你下載的是一個新檔案。',
      faq: [
        {
          question: '如何免費將 PNG 轉換為 JPG？',
          answer: '在上方上傳你的 .png，選擇 JPG 品質，然後點選轉換。下載的是標準的 .jpg 檔案。',
        },
        {
          question: '將 PNG 轉換為 JPG 會降低品質嗎？',
          answer: 'JPG 是有損格式，因此品質上會有些許取捨。在品質 85–90 時，相片看不出差異。對於含有銳利文字的圖形，請保留 PNG 或改用 WebP。',
        },
        {
          question: '將 PNG 轉換為 JPG 時，透明度會怎樣？',
          answer: 'JPG 不支援透明度，因此透明區域會平面化到純色背景上。如果你需要保留透明度，請改為將 PNG 轉換為 WebP。',
        },
        {
          question: '為什麼我的 PNG 比 JPG 大這麼多？',
          answer: 'PNG 是無損格式，會精確儲存每一個像素，用於相片時檔案就會很大。JPG 採用感知壓縮，因此相片類圖片能大幅縮小，外觀卻幾乎沒有變化。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '由於 JPG 沒有透明度，PNG 的透明區域會平面化到純色背景上。',
        ],
      },
      related: [
        {
          label: '將 JPG 轉換為 PNG',
          to: '/tools/convert-jpg-to-png',
          description: '反向轉換，取得可支援透明度的 PNG。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在 JPG、PNG、WebP、AVIF 等格式之間轉換。',
        },
        {
          label: '壓縮圖片',
          to: '/tools/compress-image',
          description: '在不變更格式的情況下進一步縮小 JPG。',
        },
        {
          label: '圖片轉換器教學',
          to: '/tutorials/image/getting-started',
          description: '詳細說明每一個圖片選項。',
        },
      ],
      embed: {
        title: '將 PNG 轉換為 JPG',
        description: '上傳 PNG 圖片。此工具的輸出鎖定為 JPG，只要選擇品質並轉換即可。由於 JPG 沒有 Alpha 色版，透明區域會平面化到純色背景上。',
      },
    },
    'convert-jpg-to-png': {
      name: '將 JPG 轉換為 PNG',
      h1: '線上免費將 JPG 轉換為 PNG',
      tagline: '把 JPG 相片轉為無損 PNG 檔案，方便編輯、處理透明背景和製作高品質圖形。',
      metaTitle: '線上免費將 JPG 轉換為 PNG | Media Manipulator',
      metaDescription: '免費線上 JPG 轉 PNG 工具。將 .jpg 相片變成無損 PNG 檔案，方便編輯、處理透明度和製作圖形。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 JPG 轉換為 PNG',
      ogDescription: '將 JPG 相片變成無損 PNG 檔案，方便編輯和製作圖形。免費、快速、無需註冊。',
      intro: 'PNG 是無損格式，絕不會增加壓縮瑕疵，因此一旦你開始編輯圖片、加入透明度或疊加圖形，它就是理想的選擇。將 JPG 轉換為 PNG 會鎖定目前的像素，讓後續編輯不會降低品質。Media Manipulator 可線上免費將你的 JPG 轉換為乾淨的 PNG，無需註冊。',
      whatItDoes: [
        '將任何 .jpg/.jpeg 圖片轉換為無損的 .png 檔案。',
        '精確保留目前的像素，反覆編輯也不會增加瑕疵。',
        '產生的 PNG 之後可以在編輯器中疊加、加上遮色片或設為透明。',
        'JPG 的每一個像素都會被精確保留；PNG 會儲存這些像素，不再有任何損失。',
      ],
      flowSteps: [
        {
          title: '上傳 JPG',
          description: '拖放 .jpg 或 .jpeg 相片。',
        },
        {
          title: '轉換為 PNG',
          description: '我們以無損方式將圖片重新編碼為 PNG。',
        },
        {
          title: '編碼 PNG',
          description: 'ImageMagick 寫出標準的 24/32 位元 PNG。',
        },
        {
          title: '下載 PNG',
          description: '儲存可直接編輯的無損 .png。',
        },
      ],
      advancedDetails: [
        'PNG 是無損格式，因此轉換後的檔案通常會比來源 JPG 大，這是正常現象。',
        '將 JPG 轉換為 PNG 無法找回 JPG 已經捨棄的細節；它只是以無損方式凍結目前的像素。',
        'PNG 支援 Alpha 色版，因此你可以直接在編輯器中為結果加入透明度。',
        '若要取得最小的無損網頁檔案，WebP（無損）通常比 PNG 更小。',
      ],
      whyItMatters: [
        '當圖片會被反覆編輯時，無損的 PNG 才是正確的工作格式。',
        '設計工具、應用程式素材和 UI 工作都需要 PNG，以取得銳利的邊緣並支援透明度。',
        'PNG 能避免 JPG 一再重新儲存時發生的世代損失。',
      ],
      useCases: [
        {
          title: '編輯前準備',
          description: '修圖前先將 JPG 轉換為 PNG，讓編輯維持無損。',
        },
        {
          title: '加入透明度',
          description: '準備好 PNG 畫布，以便去除背景。',
        },
        {
          title: 'UI 與應用程式素材',
          description: '大多數設計系統都要求圖示和圖形使用 PNG。',
        },
        {
          title: '嵌入文件',
          description: '當清晰的文字和線條比檔案大小更重要時，請使用 PNG。',
        },
      ],
      whyMediaManipulator: [
        '輸出確實鎖定為 PNG，因此結果一律無損。',
        '在我們自己的伺服器上執行，你的圖片不會經過第三方處理。',
      ],
      privacyNote: '你的 JPG 會在我們的伺服器上解碼，並寫出像素完全相同的無損 PNG。不會傳送任何內容給外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。原始檔案絕不會被更改：你下載的是一個新檔案。',
      faq: [
        {
          question: '如何免費將 JPG 轉換為 PNG？',
          answer: '在上方上傳你的 .jpg 並點選轉換，輸出就是無損的 .png。完全免費、無需註冊，在你的瀏覽器中即可使用。',
        },
        {
          question: '將 JPG 轉換為 PNG 會提升品質嗎？',
          answer: '不會。轉換本身是無損的，但無法找回 JPG 已經捨棄的細節。它會凍結目前的像素，讓後續編輯不會產生瑕疵。',
        },
        {
          question: 'PNG 會比我的 JPG 大嗎？',
          answer: '通常會。PNG 會精確儲存每一個像素，不使用有損壓縮，因此相片類 PNG 通常比同等的 JPG 大。',
        },
        {
          question: '轉換為 PNG 之後可以加入透明度嗎？',
          answer: '可以。PNG 支援 Alpha 色版，所以取得 PNG 之後，你可以在任何圖片編輯器中擦除或去除背景。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'PNG 是無損格式，因此輸出通常比來源 JPG 大。',
        ],
      },
      related: [
        {
          label: '將 PNG 轉換為 JPG',
          to: '/tools/convert-png-to-jpg',
          description: '反向轉換，將 PNG 縮小成 JPG。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在 JPG、PNG、WebP、AVIF 等格式之間轉換。',
        },
        {
          label: '移除圖片背景',
          to: '/tools/remove-background-from-image',
          description: '自動製作透明的 PNG 去背圖。',
        },
        {
          label: '圖片轉換器教學',
          to: '/tutorials/image/getting-started',
          description: '詳細說明每一個圖片選項。',
        },
      ],
      embed: {
        title: '將 JPG 轉換為 PNG',
        description: '上傳 JPG 圖片。此工具的輸出鎖定為 PNG，因此你會得到一個無損檔案，可直接用於編輯，或疊加在透明畫布上。',
      },
    },
    'convert-webp-to-png': {
      name: '將 WebP 轉換為 PNG',
      h1: '線上免費將 WebP 轉換為 PNG',
      tagline: '把 WebP 圖片轉為無損 PNG 檔案，到處都能開啟，並完整保留透明度。',
      metaTitle: '線上免費將 WebP 轉換為 PNG | Media Manipulator',
      metaDescription: '免費線上 WebP 轉 PNG 工具。將 .webp 圖片變成保留透明度、可在任何編輯器中開啟的無損 PNG 檔案。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 WebP 轉換為 PNG',
      ogDescription: '將 WebP 圖片變成保留透明度的無損 PNG 檔案。免費、快速、無需註冊。',
      intro: 'WebP 很適合網頁使用，但許多編輯器、較舊的軟體和設計工具仍然需要 PNG；而且與 JPG 不同，PNG 能完整保留透明度。Media Manipulator 會將你的 WebP 轉換為乾淨的無損 PNG，讓它在任何地方都能開啟，Alpha 色版也能完整保留。',
      whatItDoes: [
        '將任何 .webp 圖片轉換為無損的 .png 檔案。',
        '保留 Alpha 色版，讓透明的 WebP 維持透明。',
        '產生可在任何編輯器、看圖軟體或設計工具中開啟的 PNG。',
        '圖片本身不變；WebP 壓縮會換成無損的 PNG 儲存方式。',
      ],
      flowSteps: [
        {
          title: '上傳 WebP',
          description: '拖放 .webp 檔案，透明或不透明皆可。',
        },
        {
          title: '轉換為 PNG',
          description: '我們會解碼 WebP，再重新編碼為 PNG。',
        },
        {
          title: '編碼 PNG',
          description: 'ImageMagick 寫出無損的 24/32 位元 PNG。',
        },
        {
          title: '下載 PNG',
          description: '儲存保留透明度的 .png 檔案。',
        },
      ],
      advancedDetails: [
        '來源 WebP 中的透明度會保留為 PNG 的 Alpha 色版。',
        '動態 WebP 只有第一個影格會變成靜態 PNG；若需要動畫，請改為轉換成 GIF。',
        'PNG 是無損格式，因此輸出通常比來源 WebP 大；這是換取廣泛相容性與無損儲存的代價。',
      ],
      whyItMatters: [
        '部分編輯器、簡報工具和較舊的軟體仍然無法開啟 WebP。',
        'PNG 能保留透明度，JPG 則不行，這對標誌和去背圖來說很重要。',
        'PNG 是處理圖形時安全、無損的交換格式。',
      ],
      useCases: [
        {
          title: '在編輯器中開啟 WebP',
          description: '轉換為 PNG，讓不支援 WebP 的編輯器也能開啟。',
        },
        {
          title: '保留透明度',
          description: '將透明的 WebP 標誌保留為透明的 PNG。',
        },
        {
          title: '設計交接',
          description: '將 PNG 交給需要 PNG 素材的工具或團隊成員。',
        },
        {
          title: '簡報',
          description: '將 PNG 放進不接受 WebP 的投影片軟體。',
        },
      ],
      whyMediaManipulator: [
        '輸出鎖定為 PNG，並自動保留透明度。',
        '在我們自己的伺服器上執行，你的圖片不會經過第三方處理。',
      ],
      privacyNote: '你的 WebP 會在我們的伺服器上解碼，並儲存為無損 PNG，同時保留其透明度。不會傳送任何內容給外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。原始檔案絕不會被更改：你下載的是一個新檔案。',
      faq: [
        {
          question: '如何免費將 WebP 轉換為 PNG？',
          answer: '在上方上傳你的 .webp 並點選轉換。下載的是保留透明度的無損 .png。完全免費，無需註冊。',
        },
        {
          question: 'WebP 轉 PNG 會保留透明度嗎？',
          answer: '會。如果你的 WebP 有透明背景，產生的 PNG 會完整保留該 Alpha 色版。',
        },
        {
          question: '為什麼要將 WebP 轉換為 PNG，而不是 JPG？',
          answer: 'PNG 是無損格式並會保留透明度，JPG 則會將透明度平面化並加入壓縮。需要透明度或無損圖形時請選擇 PNG；想要最小的相片檔案時請選擇 JPG。',
        },
        {
          question: '可以轉換動態 WebP 嗎？',
          answer: '只有第一個影格會變成 PNG。若需要動畫，請改為將 WebP 轉換成動態 GIF。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '會保留透明度。動態 WebP 只會轉換第一個影格。',
        ],
      },
      related: [
        {
          label: '將 PNG 轉換為 WebP',
          to: '/tools/convert-png-to-webp',
          description: '反向轉換，將 PNG 縮小成 WebP。',
        },
        {
          label: '將 WebP 轉換為 JPG',
          to: '/tools/convert-webp-to-jpg',
          description: '改將 WebP 轉換為精簡的 JPG。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在 JPG、PNG、WebP、AVIF 等格式之間轉換。',
        },
        {
          label: '壓縮圖片',
          to: '/tools/compress-image',
          description: '縮小圖片，免去轉換格式的麻煩。',
        },
      ],
      embed: {
        title: '將 WebP 轉換為 PNG',
        description: '上傳 WebP 圖片。此工具的輸出鎖定為 PNG，因此會保留透明度，檔案也能在任何圖片編輯器或看圖軟體中開啟。',
      },
    },
    'convert-png-to-webp': {
      name: '將 PNG 轉換為 WebP',
      h1: '線上免費將 PNG 轉換為 WebP',
      tagline: '把 PNG 圖形壓縮成新式 WebP 檔案，網頁載入更快，並完整保留透明度。',
      metaTitle: '線上免費將 PNG 轉換為 WebP | Media Manipulator',
      metaDescription: '免費線上 PNG 轉 WebP 工具。將 .png 檔案縮小成更小的 WebP 圖片，在保留透明度的同時讓網站更快。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 PNG 轉換為 WebP',
      ogDescription: '將 PNG 圖形縮小成保留透明度的較小 WebP 檔案，讓網站更快。免費、無需註冊。',
      intro: 'WebP 是新式的網頁圖片格式：它產生的檔案比 PNG 小得多，同時保留透明度，這代表網頁更快、Core Web Vitals 表現更好。Media Manipulator 會依你選擇的品質將 PNG 轉換為 WebP：免費、線上完成、完整保留透明度，而且無需註冊。',
      whatItDoes: [
        '將任何 .png 圖片轉換為新式的 .webp 檔案。',
        '保留 Alpha 色版，讓透明的 PNG 維持透明。',
        '讓你選擇品質，在檔案大小與保真度之間取得平衡。',
        '產生的檔案通常比來源 PNG 小 25–80%。',
      ],
      flowSteps: [
        {
          title: '上傳 PNG',
          description: '拖放 .png 圖形、圖示或螢幕截圖。',
        },
        {
          title: '選擇 WebP 品質',
          description: '80–85 是網頁用途的絕佳預設值。',
        },
        {
          title: '編碼 WebP',
          description: 'ImageMagick 將你的圖片重新編碼為 WebP。',
        },
        {
          title: '下載 WebP',
          description: '儲存體積更小、保留透明度的 .webp 檔案。',
        },
      ],
      advancedDetails: [
        'WebP 同時支援有損與無損模式；在品質約 80 時，檔案大小通常遠小於 PNG，畫面依然乾淨。',
        '會保留透明度，因此標誌和 UI 素材都能保有 Alpha 色版。',
        '所有新式瀏覽器都支援 WebP，可以直接提供給瀏覽器，加快網頁載入。',
        '若要與非常舊的軟體保持最大相容性，請保留一份 PNG 備用檔。',
      ],
      whyItMatters: [
        '縮小圖片是加快網頁載入、改善 SEO 最有效的單一手段。',
        'WebP 會保留透明度，所以不必像使用 JPG 時那樣，為了檔案大小犧牲 Alpha 色版。',
        'Google 的 Core Web Vitals 會獎勵較輕量的網頁，WebP 能直接幫上忙。',
      ],
      useCases: [
        {
          title: '更快的網站',
          description: '用 WebP 取代笨重的 PNG 素材，降低網頁容量。',
        },
        {
          title: '透明標誌',
          description: '縮小透明的 PNG 標誌，同時保留其 Alpha 色版。',
        },
        {
          title: '應用程式與 UI 素材',
          description: '交付更輕量的圖形，同時不失清晰度。',
        },
        {
          title: '大量圖片的相簿',
          description: '將一批 PNG 轉換為 WebP，讓相簿更流暢。',
        },
      ],
      whyMediaManipulator: [
        '輸出鎖定為 WebP，並保留透明度。',
        '精確的品質控制，由你決定大小與保真度之間的取捨。',
      ],
      privacyNote: '你的 PNG 會在我們的伺服器上，依你選擇的品質重新編碼為 WebP，並保留其透明度。不會傳送任何內容給外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。原始檔案絕不會被更改：你下載的是一個新檔案。',
      faq: [
        {
          question: '如何免費將 PNG 轉換為 WebP？',
          answer: '在上方上傳你的 .png，選擇品質，然後點選轉換。下載的是 .webp 檔案。完全免費，無需註冊。',
        },
        {
          question: 'PNG 轉 WebP 會保留透明度嗎？',
          answer: '會。WebP 支援 Alpha 色版，因此透明的 PNG 在轉換後依然透明。',
        },
        {
          question: 'WebP 會小多少？',
          answer: '視圖片而定，但在視覺品質相近的情況下，WebP 通常比來源 PNG 小 25–80%。',
        },
        {
          question: 'WebP 到處都支援嗎？',
          answer: '所有新式瀏覽器都支援 WebP。少數較舊或小眾的程式不支援；如果你需要支援這些程式，請保留一份 PNG 備用檔。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'WebP 輸出會保留透明度。',
        ],
      },
      related: [
        {
          label: '將 WebP 轉換為 PNG',
          to: '/tools/convert-webp-to-png',
          description: '反向轉換，回到無損的 PNG。',
        },
        {
          label: '將 JPG 轉換為 WebP',
          to: '/tools/convert-jpg-to-webp',
          description: '將 JPG 相片縮小成網頁用的 WebP。',
        },
        {
          label: '壓縮圖片',
          to: '/tools/compress-image',
          description: '在不變更格式的情況下進一步縮小圖片。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在 JPG、PNG、WebP、AVIF 和 GIF 之間轉換。',
        },
        {
          label: '圖片轉換器教學',
          to: '/tutorials/image/getting-started',
          description: '詳細說明每一個圖片選項。',
        },
      ],
      embed: {
        title: '將 PNG 轉換為 WebP',
        description: '上傳 PNG 圖片。此工具的輸出鎖定為 WebP，選擇品質並轉換即可。會保留透明度，而且 WebP 檔案通常比 PNG 小得多。',
      },
    },
    'convert-jpg-to-webp': {
      name: '將 JPG 轉換為 WebP',
      h1: '線上免費將 JPG 轉換為 WebP',
      tagline: '把 JPG 相片壓縮成新式 WebP 檔案，在相同視覺畫質下網頁載入更快。',
      metaTitle: '線上免費將 JPG 轉換為 WebP | Media Manipulator',
      metaDescription: '免費線上 JPG 轉 WebP 工具。依你選擇的品質，將 .jpg 相片縮小成更小的 WebP 圖片，讓網站更快。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 JPG 轉換為 WebP',
      ogDescription: '將 JPG 相片縮小成更小的 WebP 檔案，在相同視覺品質下讓網站更快。免費、無需註冊。',
      intro: 'WebP 能以明顯更小的檔案提供與 JPG 相同的視覺品質，這正是它成為高速網站預設圖片格式的原因。Media Manipulator 會依你選擇的品質將 JPG 轉換為 WebP，讓你的相片看起來一樣，卻載入得更快。',
      whatItDoes: [
        '將任何 .jpg/.jpeg 相片轉換為新式的 .webp 檔案。',
        '讓你選擇 WebP 品質，在檔案大小與保真度之間取得平衡。',
        '在相同品質下，產生的檔案通常比來源 JPG 小 25–35%。',
        '相片看起來一樣；其資料會以 WebP 重新編碼，讓檔案更小。',
      ],
      flowSteps: [
        {
          title: '上傳 JPG',
          description: '拖放 .jpg 或 .jpeg 相片。',
        },
        {
          title: '選擇 WebP 品質',
          description: '80–85 與一般的 JPG 品質非常接近。',
        },
        {
          title: '編碼 WebP',
          description: 'ImageMagick 將你的相片重新編碼為 WebP。',
        },
        {
          title: '下載 WebP',
          description: '儲存可直接用於網頁的較小 .webp。',
        },
      ],
      advancedDetails: [
        '在同等視覺品質下，由於採用更新的壓縮技術，WebP 通常比 JPG 小 25–35%。',
        '避免疊加重度壓縮：將已經是有損格式的 JPG 以非常低的 WebP 品質重新編碼，可能會使瑕疵加劇。',
        '所有新式瀏覽器都支援 WebP，可以直接提供給瀏覽器，加快網頁載入。',
        '若要與非常舊的軟體保持最大相容性，請保留一份 JPG 備用檔。',
      ],
      whyItMatters: [
        '更輕量的圖片能直接改善網頁載入時間、跳出率和 SEO。',
        '只要轉換一次，WebP 就能以更小的檔案提供接近 JPG 的品質。',
        'Core Web Vitals 會獎勵較小的圖片，WebP 是立竿見影的改善方法。',
      ],
      useCases: [
        {
          title: '更快的網站',
          description: '將主視覺和相簿中的 JPG 轉換為 WebP，降低網頁容量。',
        },
        {
          title: '電商商品目錄',
          description: '縮小商品相片，讓商品頁面瞬間載入。',
        },
        {
          title: '部落格與文章',
          description: '提供更輕量的內文圖片，且看不出畫質損失。',
        },
        {
          title: '適合電子郵件的相片',
          description: '取得更小的檔案，符合附件大小限制。',
        },
      ],
      whyMediaManipulator: [
        '輸出鎖定為 WebP，因此不會有設定錯誤的問題。',
        '精確的品質控制，而不是固定的預設組。',
      ],
      privacyNote: '你的 JPG 會在我們的伺服器上，依你選擇的品質重新編碼為較小的 WebP。不會傳送任何內容給外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。原始檔案絕不會被更改：你下載的是一個新檔案。',
      faq: [
        {
          question: '如何免費將 JPG 轉換為 WebP？',
          answer: '在上方上傳你的 .jpg，選擇品質，然後點選轉換。下載的是 .webp 檔案。完全免費，無需註冊。',
        },
        {
          question: 'WebP 比 JPG 好嗎？',
          answer: '用於網頁時通常是的：WebP 能以更小的檔案提供相近的品質。不過在與非常舊的軟體的通用相容性上，JPG 仍然勝出。',
        },
        {
          question: 'WebP 比 JPG 小多少？',
          answer: '在同等視覺品質下，WebP 通常比 JPG 小 25–35%，但實際能節省多少取決於圖片。',
        },
        {
          question: '將 JPG 轉換為 WebP 會損失品質嗎？',
          answer: '兩種格式都是有損格式。在品質 80–85 時，結果看起來與 JPG 相同。請避免將 WebP 品質設得太低，以免瑕疵加劇。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'JPG 沒有透明度，因此 WebP 輸出完全不透明。',
        ],
      },
      related: [
        {
          label: '將 WebP 轉換為 JPG',
          to: '/tools/convert-webp-to-jpg',
          description: '反向轉換，回到通用的 JPG。',
        },
        {
          label: '將 PNG 轉換為 WebP',
          to: '/tools/convert-png-to-webp',
          description: '將 PNG 圖形縮小成網頁用的 WebP。',
        },
        {
          label: '壓縮圖片',
          to: '/tools/compress-image',
          description: '在不變更格式的情況下進一步縮小圖片。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在 JPG、PNG、WebP、AVIF 和 GIF 之間轉換。',
        },
        {
          label: '圖片轉換器教學',
          to: '/tutorials/image/getting-started',
          description: '詳細說明每一個圖片選項。',
        },
      ],
      embed: {
        title: '將 JPG 轉換為 WebP',
        description: '上傳 JPG 圖片。此工具的輸出鎖定為 WebP，選擇品質並轉換即可。在相同的視覺品質下，WebP 產生的檔案通常比 JPG 小。',
      },
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
      h1: '線上免費將 JPG 轉換為 PDF',
      tagline: '把 JPG 相片和掃描檔變成整潔的 PDF 文件，方便分享、列印或上傳。',
      metaTitle: '線上免費將 JPG 轉換為 PDF | Media Manipulator',
      metaDescription: '免費線上 JPG 轉 PDF 工具。將 .jpg 相片與掃描檔變成整潔的 PDF 文件，畫質毫無損失。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 JPG 轉換為 PDF',
      ogDescription: '將 JPG 相片與掃描檔變成整潔的 PDF 文件。無損、免費，無需註冊。',
      intro: 'JPG 是手機與相機拍攝時使用的格式，但大多數表單、申請與辦公室需要的是 PDF。Media Manipulator 會直接將你的 JPG 嵌入 PDF，不重新壓縮，因此文件看起來與你的相片完全相同，檔案也維持小巧。',
      whatItDoes: [
        '將 JPG/JPEG 相片包裝成單頁 PDF 文件。',
        '以無損方式嵌入原始 JPG 位元組，完全不增加任何壓縮。',
        '依相片設定頁面尺寸，不會裁切或拉伸任何內容。',
        '產生在任何地方都能開啟與列印的標準 PDF。',
      ],
      flowSteps: [
        {
          title: '上傳 JPG',
          description: '拖放一張 .jpg 或 .jpeg 相片或掃描檔。',
        },
        {
          title: '我們嵌入圖片',
          description: 'JPG 會放在尺寸相符的頁面上，不經任何壓縮。',
        },
        {
          title: '產生 PDF',
          description: '組合出一份標準的單頁 PDF。',
        },
        {
          title: '下載 PDF',
          description: '儲存一份整潔的 .pdf，隨時可分享或上傳。',
        },
      ],
      advancedDetails: [
        'JPG 資料流會以 PDF 的 /DCTDecode 濾鏡嵌入，也就是相片會原樣儲存，不會再經歷一次有損壓縮。',
        '由於沒有重新編碼，JPG 轉成的 PDF 文件通常與原始相片大小差不多。',
        '頁面依 96 DPI 從圖片計算尺寸，因此一般手機相片會產生大小適中的頁面。',
      ],
      whyItMatters: [
        '表單、入口網站與申請程序常常要求 PDF，而不是 JPG。',
        'PDF 的列印結果可預期，而原始 JPG 可能會被拼貼或重新縮放。',
        '無損嵌入能讓掃描文件中的文字保持清晰可讀。',
      ],
      useCases: [
        {
          title: '求職申請',
          description: '把已簽名表單的相片變成入口網站會接受的 PDF。',
        },
        {
          title: '收據與報帳',
          description: '將收據相片轉換為 PDF，用於報帳。',
        },
        {
          title: '掃描文件',
          description: '將用手機掃描的頁面包裝成整潔的 PDF。',
        },
        {
          title: '列印',
          description: '讓 JPG 的列印結果可預期。',
        },
      ],
      whyMediaManipulator: [
        '真正無損：PDF 中的 JPG 與你的原檔完全相同。',
        '輸出已鎖定為 PDF，沒有任何會設定錯誤的地方。',
      ],
      privacyNote: '你的 JPG 會在不重新壓縮的情況下，放進我們伺服器所建構的單一 PDF 頁面中。不會傳送任何內容到外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。原檔絕不會被更改：你下載的是一個新檔案。',
      faq: [
        {
          question: '如何免費將 JPG 轉換為 PDF？',
          answer: '在上方上傳你的 .jpg，然後點擊轉換，輸出就是一份單頁 PDF。完全免費，無需註冊。',
        },
        {
          question: '將 JPG 轉換為 PDF 會降低畫質嗎？',
          answer: '不會。JPG 會直接嵌入 PDF，不經重新壓縮，因此圖片畫質與你的原檔完全相同。',
        },
        {
          question: 'PDF 會比我的 JPG 大很多嗎？',
          answer: '不會。由於沒有重新編碼，PDF 大小約等於來源 JPG，再加上一層極小的文件外殼。',
        },
        {
          question: '可以把多張 JPG 合併成一份 PDF 嗎？',
          answer: '這個工具每張圖片製作一份 PDF。如果你需要多頁，請逐一轉換每張 JPG，再用合併工具合併這些 PDF。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'JPG 會以無損方式（不重新壓縮）嵌入單頁 PDF。',
        ],
      },
      related: [
        {
          label: '將 PNG 轉換為 PDF',
          to: '/tools/convert-png-to-pdf',
          description: '專門的 PNG → PDF 轉換器。',
        },
        {
          label: '圖片轉 PDF',
          to: '/tools/image-to-pdf',
          description: '將任何圖片格式轉換為 PDF。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在 JPG、PNG、WebP、AVIF 等格式之間轉換。',
        },
        {
          label: 'PDF 轉 JPG',
          to: '/tools/pdf-to-jpg',
          description: '反向轉換：將 PDF 轉譯為 JPG。',
        },
        {
          label: 'PDF 轉換器',
          to: '/tools/pdf-converter',
          description: '完整的 PDF 轉換中心。',
        },
      ],
      embed: {
        title: '將 JPG 轉換為 PDF',
        description: '上傳一張 JPG 圖片。輸出已鎖定為 PDF，你的 JPG 會以無損方式嵌入：PDF 中的相片與你的原檔逐位元完全相同。',
      },
    },
    'convert-png-to-pdf': {
      name: '將 PNG 轉換為 PDF',
      h1: '線上免費將 PNG 轉換為 PDF',
      tagline: '把 PNG 螢幕截圖、圖形和掃描檔變成整潔清晰的 PDF 文件。',
      metaTitle: '線上免費將 PNG 轉換為 PDF | Media Manipulator',
      metaDescription: '免費線上 PNG 轉 PDF 工具。將 .png 螢幕截圖與圖形變成清晰、無損的 PDF 文件。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 PNG 轉換為 PDF',
      ogDescription: '將 PNG 螢幕截圖與圖形變成清晰、無損的 PDF 文件。免費，無需註冊。',
      intro: 'PNG 是螢幕截圖、圖表，以及文字清晰、邊緣銳利的圖形所用的格式。當你需要把它當成文件寄出或列印時，PDF 就是合適的外殼。Media Manipulator 會以無損方式將你的 PNG 嵌入 PDF，讓每一條邊緣都保持銳利。',
      whatItDoes: [
        '將 PNG 圖片包裝成單頁 PDF 文件。',
        '以無損方式嵌入圖片，讓文字與線條圖保持清晰。',
        '由於 PDF 頁面不透明，透明部分會被平面化到白色上。',
        '產生在任何地方都能開啟與列印的標準 PDF。',
      ],
      flowSteps: [
        {
          title: '上傳 PNG',
          description: '拖放一張 .png 螢幕截圖、圖表或圖形。',
        },
        {
          title: '我們嵌入圖片',
          description: 'PNG 會合成到白色頁面上，並以無損方式嵌入。',
        },
        {
          title: '產生 PDF',
          description: '組合出一份標準的單頁 PDF。',
        },
        {
          title: '下載 PDF',
          description: '儲存一份清晰的 .pdf，隨時可分享或列印。',
        },
      ],
      advancedDetails: [
        'PNG 會被解碼，並以無損的 zlib（Flate）壓縮嵌入，因此銳利的文字與邊緣會被精確保留，不會出現 JPEG 瑕疵。',
        '由於 PDF 頁面沒有 Alpha 通道，透明區域會變成白色。',
        '頁面依 96 DPI 從圖片計算尺寸，作為合理的預設實體尺寸。',
      ],
      whyItMatters: [
        '螢幕截圖與圖表在問題回報單與報告中常以 PDF 形式提交。',
        '無損嵌入能讓小字與細線保持清晰可讀。',
        'PDF 的列印結果可預期，而原始 PNG 可能會被意外縮放。',
      ],
      useCases: [
        {
          title: '錯誤回報',
          description: '把螢幕截圖變成 PDF，附加到問題回報單上。',
        },
        {
          title: '示意圖與圖表',
          description: '將匯出的圖形包裝成方便分享的 PDF。',
        },
        {
          title: '掃描表單',
          description: '將 PNG 掃描檔轉換為整潔的 PDF 文件。',
        },
        {
          title: '列印',
          description: '從 PNG 取得清晰、可預期的列印結果。',
        },
      ],
      whyMediaManipulator: [
        '無損嵌入讓文字與邊緣保持極致銳利。',
        '輸出已鎖定為 PDF，沒有任何會設定錯誤的地方。',
      ],
      privacyNote: '你的 PNG 會在我們的伺服器上以無損方式嵌入單頁 PDF，透明部分會被平面化到白色上。不會傳送任何內容到外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。原檔絕不會被更改：你下載的是一個新檔案。',
      faq: [
        {
          question: '如何免費將 PNG 轉換為 PDF？',
          answer: '在上方上傳你的 .png，然後點擊轉換，輸出就是一份單頁 PDF。完全免費，無需註冊。',
        },
        {
          question: 'PNG 轉 PDF 能保持文字清晰嗎？',
          answer: '可以。PNG 會以無損方式嵌入，因此銳利的文字與線條圖會保持清晰，不會出現 JPEG 那樣的瑕疵。',
        },
        {
          question: '透明的 PNG 會怎樣？',
          answer: '由於 PDF 頁面不透明，透明區域會被平面化到白色背景上。可見的內容不會改變。',
        },
        {
          question: '可以把多張 PNG 合併成一份 PDF 嗎？',
          answer: '這個工具每張圖片建立一份 PDF。若要製作多頁文件，請逐一轉換每張 PNG，再用合併工具合併這些 PDF。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'PNG 會以無損方式嵌入。由於 PDF 頁面不透明，透明部分會被平面化到白色上。',
        ],
      },
      related: [
        {
          label: '將 JPG 轉換為 PDF',
          to: '/tools/convert-jpg-to-pdf',
          description: '專門的 JPG → PDF 轉換器。',
        },
        {
          label: '圖片轉 PDF',
          to: '/tools/image-to-pdf',
          description: '將任何圖片格式轉換為 PDF。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在 JPG、PNG、WebP、AVIF 等格式之間轉換。',
        },
        {
          label: 'PDF 轉 PNG',
          to: '/tools/pdf-to-png',
          description: '反向轉換：將 PDF 轉譯為 PNG。',
        },
        {
          label: 'PDF 轉換器',
          to: '/tools/pdf-converter',
          description: '完整的 PDF 轉換中心。',
        },
      ],
      embed: {
        title: '將 PNG 轉換為 PDF',
        description: '上傳一張 PNG 圖片。輸出已鎖定為 PDF，你的 PNG 會以無損方式嵌入，讓頁面上的文字與銳利邊緣保持清晰。',
      },
    },
    'pdf-to-png': {
      name: 'PDF 轉 PNG',
      h1: '線上免費將 PDF 轉換為 PNG',
      tagline: '將 PDF 的每一頁轉為清晰的無損 PNG 圖片，適合處理文字、圖表和編輯。',
      metaTitle: '線上免費將 PDF 轉換為 PNG | Media Manipulator',
      metaDescription: '免費線上 PDF 轉 PNG 工具。將 PDF 的每一頁轉譯為清晰、無損的 PNG 圖片，並以 ZIP 下載。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 PDF 轉換為 PNG',
      ogDescription: '將 PDF 的每一頁轉譯為清晰、無損的 PNG 圖片。免費、快速，無需註冊。',
      intro: '當 PDF 頁面有清晰的文字、細線或你想保持銳利的圖表時，PNG 是最佳選擇。Media Manipulator 會使用 Poppler 將每一頁轉譯為無損 PNG，因此文字周圍不會出現 JPEG 瑕疵。你可以選擇所有頁面或僅第一頁，並選擇解析度。',
      whatItDoes: [
        '以你選擇的 DPI 將每個 PDF 頁面轉譯為無損 PNG 圖片。',
        '轉換所有頁面（以 ZIP 下載）或僅第一頁（單一 PNG）。',
        '多頁輸出的檔名清楚明瞭：page-001.png、page-002.png，依此類推。',
        '以無損 PNG 編碼讓文字與線條圖保持清晰。',
      ],
      flowSteps: [
        {
          title: '上傳 PDF',
          description: '拖放任何 .pdf 文件。',
        },
        {
          title: '選擇頁面與 DPI',
          description: '所有頁面或僅第一頁；150 DPI 是不錯的預設值。',
        },
        {
          title: '轉譯為 PNG',
          description: 'Poppler 將每一頁點陣化為無損 PNG。',
        },
        {
          title: '下載',
          description: '取得單一 PNG，或每頁一張 PNG 的 ZIP。',
        },
      ],
      advancedDetails: [
        '轉譯使用 Poppler（pdftoppm），頁面輸出準確而忠實。',
        'PNG 是無損格式，因此當頁面以文字、圖表或銳利圖形為主時，它比 JPG 更合適。',
        'DPI 越高，圖片越清晰、也越大：150 DPI 適合螢幕，300 DPI 適合列印。',
        '轉譯出的 PNG 為白色背景；PDF 頁面不透明，因此沒有可保留的透明度。',
      ],
      whyItMatters: [
        '無損 PNG 讓小字與細線保持清晰可讀，沒有任何瑕疵。',
        'PNG 頁面可以順利放進編輯器、文件與設計工具。',
        '轉譯出的頁面能精確呈現文件的視覺版面。',
      ],
      useCases: [
        {
          title: '圖表與示意圖',
          description: '轉譯技術頁面，不留任何瑕疵。',
        },
        {
          title: '標註與審閱',
          description: '在編輯器中開啟清晰的頁面進行註解。',
        },
        {
          title: '設計素材',
          description: '將乾淨的頁面圖形匯入設計工具。',
        },
        {
          title: '縮圖',
          description: '產生第一頁的清晰 PNG 預覽。',
        },
      ],
      whyMediaManipulator: [
        '無損 PNG 轉譯讓文字與邊緣保持銳利。',
        '清楚整齊的 ZIP 打包，檔名附頁碼且可依序排列。',
      ],
      privacyNote: '你的 PDF 頁面會在我們的伺服器上以 Poppler 轉譯為 PNG 圖片，超過一頁時會打包成 ZIP。不會傳送任何內容到外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。原檔絕不會被更改：你下載的是一個新檔案。',
      faq: [
        {
          question: '如何免費將 PDF 轉換為 PNG？',
          answer: '在上方上傳你的 .pdf，選擇所有頁面或僅第一頁，選擇 DPI，然後點擊轉換。',
        },
        {
          question: '為什麼 PDF 要選 PNG 而不是 JPG？',
          answer: 'PNG 是無損格式，因此能讓文字、細線與圖表保持清晰，沒有壓縮瑕疵。若相片較多的頁面想要更小的檔案，JPG 會更合適。',
        },
        {
          question: '我會得到一張還是多張圖片？',
          answer: '選擇「所有頁面」可取得每頁一張 PNG 的 ZIP（page-001.png、…），選擇「僅第一頁」則取得單一 PNG。',
        },
        {
          question: 'PNG 會是透明背景嗎？',
          answer: '不會。PDF 頁面不透明，因此轉譯出的頁面為白色背景，沒有可保留的透明度。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '所有頁面的輸出以 .zip 提供；僅第一頁的輸出則是單一 .png。',
          '轉譯出的頁面為白色背景：PDF 頁面不透明，因此沒有透明度。',
        ],
      },
      related: [
        {
          label: 'PDF 轉 JPG',
          to: '/tools/pdf-to-jpg',
          description: '改為將 PDF 頁面轉譯為體積較小的 JPG。',
        },
        {
          label: 'PDF 轉換器',
          to: '/tools/pdf-converter',
          description: '將 PDF 轉換為圖片，或將圖片轉換為 PDF。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在不同格式之間轉換轉譯出的圖片。',
        },
        {
          label: '圖片轉 PDF',
          to: '/tools/image-to-pdf',
          description: '反向轉換：將圖片變成 PDF。',
        },
      ],
      embed: {
        title: '將 PDF 轉換為 PNG',
        description: '上傳 PDF，每一頁都會轉譯為無損 PNG 圖片。選擇「所有頁面」可取得 ZIP，選擇「僅第一頁」則取得單一 PNG。選擇轉譯 DPI 可獲得更清晰的輸出。',
      },
    },
    'pdf-converter': {
      name: 'PDF 轉換器',
      h1: '免費線上 PDF 轉換器',
      tagline: '將 PDF 轉為 JPG 或 PNG 圖片，也能把圖片轉成 PDF，全都在同一個地方完成。',
      metaTitle: '免費線上 PDF 轉換器 | Media Manipulator',
      metaDescription: '免費線上 PDF 轉換器。將 PDF 轉換為 JPG 或 PNG 圖片，也能將圖片轉換為 PDF。無需註冊，無浮水印。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '免費線上 PDF 轉換器',
      ogDescription: '將 PDF 轉換為 JPG/PNG 圖片，也能將圖片轉換為 PDF，全部集中在一個免費工具中。無需註冊。',
      intro: 'PDF 轉換器在同一個地方處理雙向轉換：將 PDF 的頁面轉譯為 JPG 或 PNG 圖片，或將圖片包裝成 PDF 文件。上傳 PDF 會出現圖片匯出控制項；上傳圖片則會進行圖片轉 PDF。所有處理都在我們自己的伺服器上執行。',
      whatItDoes: [
        '以你選擇的解析度將 PDF 頁面轉換為 JPG 或 PNG。',
        '將 JPG、PNG 及其他圖片轉換為單頁 PDF。',
        '將多頁 PDF 的匯出結果打包成一個整齊、內含編號圖片的 ZIP。',
        '依你上傳的檔案自動調整表單。',
      ],
      flowSteps: [
        {
          title: '上傳檔案',
          description: '拖放一份 PDF，或一張 JPG、PNG 之類的圖片。',
        },
        {
          title: '選擇輸出',
          description: '若是 PDF，請選擇 JPG/PNG、頁面與 DPI；若是圖片，輸出則為 PDF。',
        },
        {
          title: '轉換',
          description: '我們在伺服器上轉譯或包裝你的檔案。',
        },
        {
          title: '下載',
          description: '儲存 PDF、單張圖片，或頁面圖片的 ZIP。',
        },
      ],
      advancedDetails: [
        'PDF → 圖片的轉譯使用 Poppler（pdftoppm）；圖片 → PDF 會以無損方式嵌入 JPG，其他格式則以無損的 Flate 壓縮嵌入。',
        '多頁 PDF 的匯出結果會以 .zip 提供，檔名為可依序排列的 page-001/page-002。',
        '圖片轉 PDF 會依 96 DPI 將頁面尺寸對應圖片；PDF 轉圖片預設為 150 DPI，列印時最高可支援 300 以上。',
        '頁數上限可防止過大的 PDF。',
      ],
      whyItMatters: [
        '一個工具就涵蓋兩種常見的 PDF 轉換方向。',
        '不必依轉換方向另外尋找工具。',
        '在伺服器端處理，品質一致，與你的瀏覽器或裝置無關。',
      ],
      useCases: [
        {
          title: '混合工作流程',
          description: '在 PDF→圖片與圖片→PDF 之間切換，無需更換工具。',
        },
        {
          title: '文件準備',
          description: '將圖片變成 PDF，供上傳表單使用。',
        },
        {
          title: '內容再利用',
          description: '將 PDF 頁面轉譯為圖片，用於簡報或社群媒體。',
        },
        {
          title: '快速預覽',
          description: '從任何 PDF 產生第一頁的圖片。',
        },
      ],
      whyMediaManipulator: [
        '兩種轉換方向集中在單一、可自動調整的工具中。',
        '無損的圖片→PDF 與精確的 Poppler PDF→圖片轉譯。',
      ],
      privacyNote: '你的 PDF 會由我們伺服器上的 Poppler 與 ImageMagick 逐頁轉譯為圖片，或你的圖片會被包裝成 PDF。不會傳送任何內容到外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。原檔絕不會被更改：你下載的是一個新檔案。',
      faq: [
        {
          question: 'PDF 轉換器能做什麼？',
          answer: '它能將 PDF 頁面轉換為 JPG 或 PNG 圖片，也能將圖片（JPG、PNG 等）轉換為 PDF 文件，全部集中在一個免費工具中。',
        },
        {
          question: '它怎麼知道要往哪個方向轉換？',
          answer: '它會依你上傳的檔案調整：PDF 會顯示圖片匯出控制項（格式、頁面、DPI），圖片則會被轉換為 PDF。',
        },
        {
          question: '可以將多頁 PDF 轉換為圖片嗎？',
          answer: '可以。選擇「所有頁面」，你會得到一個每頁一張圖片的 ZIP，檔名依序為 page-001、page-002 等。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '上傳 PDF 進行 PDF→圖片轉換；上傳圖片進行圖片→PDF 轉換。表單會自動調整。',
          '所有頁面的 PDF 匯出會以內含編號圖片的 .zip 提供。',
        ],
      },
      related: [
        {
          label: 'PDF 轉 JPG',
          to: '/tools/pdf-to-jpg',
          description: '將 PDF 頁面轉譯為 JPG 圖片。',
        },
        {
          label: 'PDF 轉 PNG',
          to: '/tools/pdf-to-png',
          description: '將 PDF 頁面轉譯為無損 PNG 圖片。',
        },
        {
          label: '圖片轉 PDF',
          to: '/tools/image-to-pdf',
          description: '將任何圖片變成 PDF。',
        },
        {
          label: '將 JPG 轉換為 PDF',
          to: '/tools/convert-jpg-to-pdf',
          description: '專門的 JPG → PDF 轉換器。',
        },
        {
          label: '將 PNG 轉換為 PDF',
          to: '/tools/convert-png-to-pdf',
          description: '專門的 PNG → PDF 轉換器。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在不同圖片格式之間轉換。',
        },
      ],
      embed: {
        title: '轉換 PDF 或圖片',
        description: '上傳 PDF 可將其頁面轉譯為 JPG 或 PNG 圖片，上傳圖片則可將它變成 PDF。表單會依你選擇的檔案自動調整。',
      },
    },
    'convert-heic-to-jpg': {
      name: '將 HEIC 轉換為 JPG',
      h1: '線上免費將 HEIC 轉換為 JPG',
      tagline: '把 iPhone 的 HEIC 相片轉為各處都能開啟和上傳的 JPG 檔案。',
      metaTitle: '線上免費將 HEIC 轉換為 JPG | Media Manipulator',
      metaDescription: '免費線上 HEIC 轉 JPG 工具。將 iPhone 的 .heic/.heif 相片轉為相容性廣泛的 JPG 檔案。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 HEIC 轉換為 JPG',
      ogDescription: '將 iPhone 的 HEIC 相片轉為相容性廣泛的 JPG 檔案。免費、快速，無需註冊。',
      intro: 'HEIC 是 iPhone 為了節省空間而使用的高效率格式，但許多 Windows 電腦、網站和較舊的應用程式都無法開啟。Media Manipulator 會將你的 HEIC 相片轉換為到處都能用的 JPG 格式，方向正確，畫質由你選擇。',
      whatItDoes: [
        '將 Apple HEIC/HEIF 相片轉換為標準 JPG。',
        '依 EXIF 自動轉正圖片，直式相片不會橫躺。',
        '讓你選擇 JPG 品質，在檔案大小與保真度之間取得平衡。',
        '產生在任何裝置、網站或應用程式上都能開啟的 JPG。',
      ],
      flowSteps: [
        {
          title: '上傳 HEIC',
          description: '拖放 iPhone 上的 .heic 或 .heif 相片。',
        },
        {
          title: '自動轉正',
          description: '我們讀取 EXIF 方向資訊，讓相片保持正向。',
        },
        {
          title: '編碼為 JPG',
          description: 'ImageMagick 解碼 HEIC（libheif）並寫出 JPG。',
        },
        {
          title: '下載 JPG',
          description: '儲存相容性廣泛的 .jpg 檔案。',
        },
      ],
      advancedDetails: [
        'HEIC 解碼仰賴搭配 libheif 委派程式建置的 ImageMagick。若伺服器缺少 HEIC 支援，工具會傳回明確的錯誤，而不是損壞的檔案。',
        '品質 85–90 是很好的預設值：HEIC 本身已經很有效率，因此高品質的 JPG 能讓相片看起來完全相同。',
        '編碼前會先套用 EXIF 方向，修正單純轉換 HEIC 時常見的「旋轉了 90°」問題。',
      ],
      whyItMatters: [
        'Windows、許多網頁上傳表單和較舊的軟體仍然無法開啟 HEIC。',
        '分享 JPG 能確保收件者在任何裝置上都能檢視。',
        '大多數沖印店與電商平台都要求 JPG。',
      ],
      useCases: [
        {
          title: '分享 iPhone 相片',
          description: '傳送在任何手機或電腦上都能開啟的相片。',
        },
        {
          title: '網頁上傳',
          description: '滿足拒收 HEIC 的表單與網站。',
        },
        {
          title: '列印',
          description: '訂購沖印前先轉換為 JPG。',
        },
        {
          title: '在較舊的應用程式中編輯',
          description: '在不支援 HEIC 的軟體中開啟你的相片。',
        },
      ],
      whyMediaManipulator: [
        '正確的自動轉正，相片不會橫躺。',
        '可自行控制品質，而不是固定的預設值。',
      ],
      privacyNote: '你的 HEIC 相片會在我們的伺服器上解碼、轉為正向，並儲存為 JPG。不會傳送任何內容到外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。原檔絕不會被更改：你下載的是一個新檔案。',
      faq: [
        {
          question: '如何免費將 HEIC 轉換為 JPG？',
          answer: '在上方上傳你的 .heic 相片，選擇品質，然後點擊轉換。你會取得一個標準的 .jpg。',
        },
        {
          question: '為什麼我的 HEIC 相片在 Windows 上打不開？',
          answer: 'HEIC 是 Apple 偏好的格式，較舊的 Windows 版本和許多應用程式都無法讀取。轉換為 JPG 後，相片在任何地方都能開啟。',
        },
        {
          question: '相片會損失畫質嗎？',
          answer: 'JPG 是有損格式，但在品質 85–90 下，幾乎所有相片的結果看起來都與 HEIC 原檔完全相同。',
        },
        {
          question: '為什麼我以前轉換的相片會旋轉？',
          answer: '簡易的轉換器會忽略 EXIF 方向。我們會自動轉正圖片，所以你的相片會以正確方向輸出。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'HEIC 解碼需要伺服器上的 ImageMagick 具備 libheif 委派程式。',
        ],
      },
      related: [
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在 JPG、PNG、WebP、AVIF 等格式之間轉換。',
        },
        {
          label: '將 AVIF 轉換為 JPG',
          to: '/tools/convert-avif-to-jpg',
          description: '將新式 AVIF 相片轉換為 JPG。',
        },
        {
          label: '壓縮圖片',
          to: '/tools/compress-image',
          description: '為網頁縮小 JPG。',
        },
        {
          label: '圖片轉換器教學',
          to: '/tutorials/image/getting-started',
          description: '逐一了解每個圖片選項。',
        },
      ],
      embed: {
        title: '將 HEIC 轉換為 JPG',
        description: '上傳 iPhone 上的 HEIC 或 HEIF 相片。輸出已鎖定為 JPG，會自動轉正以正確方向顯示，畫質由你選擇。',
      },
    },
    'convert-avif-to-jpg': {
      name: '將 AVIF 轉換為 JPG',
      h1: '線上免費將 AVIF 轉換為 JPG',
      tagline: '把新式 AVIF 圖片轉為相容性廣泛的 JPG 檔案，供不接受 AVIF 的應用程式和網站使用。',
      metaTitle: '線上免費將 AVIF 轉換為 JPG | Media Manipulator',
      metaDescription: '免費線上 AVIF 轉 JPG 工具。以你選擇的畫質，將 .avif 圖片轉為相容性廣泛的 JPG 檔案。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 AVIF 轉換為 JPG',
      ogDescription: '將新式 AVIF 圖片轉為相容性廣泛的 JPG 檔案。免費、快速、無需註冊。',
      intro: 'AVIF 是尖端的圖片格式，能產生極小的檔案，但仍有許多應用程式、編輯器和上傳表單無法開啟它。Media Manipulator 會將 AVIF 轉換為 JPG，讓你的圖片在任何地方都能使用。選擇畫質，然後下載即可。',
      whatItDoes: [
        '將 AVIF 圖片轉換為標準 JPG。',
        '由於 JPG 沒有 Alpha 通道，任何透明區域都會平面化到背景上。',
        '讓你選擇 JPG 畫質，取得想要的檔案大小與保真度平衡。',
        '產生在任何裝置或應用程式上都能開啟的 JPG。',
      ],
      flowSteps: [
        {
          title: '上傳 AVIF',
          description: '放入一張 .avif 圖片。',
        },
        {
          title: '選擇 JPG 畫質',
          description: '85 是兼顧大小與畫質的預設值。',
        },
        {
          title: '編碼 JPG',
          description: 'ImageMagick 解碼 AVIF（libaom/libheif）並寫入 JPG。',
        },
        {
          title: '下載 JPG',
          description: '儲存相容性廣泛的 .jpg。',
        },
      ],
      advancedDetails: [
        'AVIF 解碼仰賴內建 AVIF 委派程式（libaom 或 libheif）的 ImageMagick。如果伺服器缺少 AVIF 支援，工具會傳回明確的錯誤訊息。',
        'AVIF 支援透明度；轉換為 JPG 時，由於 JPG 沒有 Alpha 通道，透明區域會被平面化。若要保留透明度，請使用 AVIF → PNG。',
        '對大多數圖片而言，畫質 85–90 能讓 JPG 在視覺上與 AVIF 完全相同。',
      ],
      whyItMatters: [
        '許多應用程式和上傳表單仍不支援 AVIF。',
        'JPG 保證收件者能開啟圖片。',
        '轉換後，你下載的 AVIF 就能用在任何需要 JPG 的地方。',
      ],
      useCases: [
        {
          title: '儲存網頁圖片',
          description: '將下載的 AVIF 轉換為可用的 JPG。',
        },
        {
          title: '應用程式相容性',
          description: '在不支援 AVIF 的軟體中開啟 AVIF。',
        },
        {
          title: '上傳',
          description: '符合只接受 JPG 的表單要求。',
        },
        {
          title: '列印',
          description: '為沖印店製作 JPG。',
        },
      ],
      whyMediaManipulator: [
        '可自行控制畫質，而不是一體適用的預設組。',
        '在我們自己的伺服器上執行，不經第三方處理。',
      ],
      privacyNote: '你的 AVIF 會在我們的伺服器上解碼，並以你設定的畫質重新編碼為 JPG。不會傳送到任何外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。原始檔案絕不會被變更：你下載的是一個新檔案。',
      faq: [
        {
          question: '如何免費將 AVIF 轉換為 JPG？',
          answer: '在上方上傳你的 .avif 圖片，選擇畫質，然後按一下轉換。你會取得一個標準的 .jpg。',
        },
        {
          question: '為什麼我無法開啟 AVIF 檔案？',
          answer: 'AVIF 是較新的格式；許多應用程式、編輯器和網站尚未支援。轉換為 JPG 後，圖片在任何地方都能開啟。',
        },
        {
          question: '透明度怎麼辦？',
          answer: 'JPG 沒有透明度，所以 AVIF 的透明區域會平面化到背景上。如果需要保留透明度，請使用 AVIF → PNG 工具。',
        },
        {
          question: '畫質會下降嗎？',
          answer: '對大多數圖片而言，在畫質 85–90 下，JPG 看起來與 AVIF 幾乎完全相同。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'AVIF 解碼需要伺服器上具備 AVIF 委派程式的 ImageMagick。JPG 輸出中的透明度會被平面化。',
        ],
      },
      related: [
        {
          label: '將 AVIF 轉換為 PNG',
          to: '/tools/convert-avif-to-png',
          description: '改用 PNG 以保留透明度。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在 JPG、PNG、WebP、AVIF 等格式之間轉換。',
        },
        {
          label: '將 HEIC 轉換為 JPG',
          to: '/tools/convert-heic-to-jpg',
          description: '將 iPhone 的 HEIC 相片轉換為 JPG。',
        },
        {
          label: '壓縮圖片',
          to: '/tools/compress-image',
          description: '為網頁縮小 JPG。',
        },
      ],
      embed: {
        title: '將 AVIF 轉換為 JPG',
        description: '上傳 AVIF 圖片。輸出固定為 JPG，因此你會以自己選擇的畫質，取得每個應用程式、編輯器和上傳表單都接受的檔案。',
      },
    },
    'convert-avif-to-png': {
      name: '將 AVIF 轉換為 PNG',
      h1: '線上免費將 AVIF 轉換為 PNG',
      tagline: '把 AVIF 圖片轉為無損 PNG 檔案，到處都能開啟，並完整保留透明度。',
      metaTitle: '線上免費將 AVIF 轉換為 PNG | Media Manipulator',
      metaDescription: '免費線上 AVIF 轉 PNG 工具。將 .avif 圖片轉為保留透明度、任何編輯器都能開啟的無損 PNG 檔案。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 AVIF 轉換為 PNG',
      ogDescription: '將 AVIF 圖片轉為無損且保留透明度的 PNG 檔案。免費、快速、無需註冊。',
      intro: '當 AVIF 圖片含有透明度時（例如標誌或去背圖），轉換為 JPG 會將其平面化。PNG 會保留 Alpha 通道，而且是無損格式，因此是圖形的正確目標格式。Media Manipulator 會將 AVIF 轉換為 PNG，並完整保留透明度。',
      whatItDoes: [
        '將 AVIF 圖片轉換為無損 PNG。',
        '保留 Alpha 通道，讓透明的 AVIF 維持透明。',
        '產生在任何編輯器、檢視器或設計工具中都能開啟的 PNG。',
        'AVIF 變成 PNG 時，圖片會逐像素完整保留。',
      ],
      flowSteps: [
        {
          title: '上傳 AVIF',
          description: '放入一張 .avif 圖片，透明或不透明皆可。',
        },
        {
          title: '解碼 AVIF',
          description: 'ImageMagick 透過其 AVIF 委派程式解碼 AVIF。',
        },
        {
          title: '編碼 PNG',
          description: '寫入保留透明度的無損 PNG。',
        },
        {
          title: '下載 PNG',
          description: '儲存保留透明度的 .png 檔案。',
        },
      ],
      advancedDetails: [
        'AVIF 解碼仰賴內建 AVIF 委派程式（libaom 或 libheif）的 ImageMagick。如果伺服器缺少 AVIF 支援，工具會傳回明確的錯誤訊息。',
        'AVIF 中的透明度會保留為 PNG 的 Alpha 通道。',
        'PNG 是無損格式，所以輸出通常比來源 AVIF 大，這是換取廣泛相容性與透明度的代價。',
      ],
      whyItMatters: [
        'PNG 會保留 JPG 會破壞的透明度，這對標誌和去背圖至關重要。',
        '有些編輯器和應用程式無法開啟 AVIF；PNG 則到處都能開啟。',
        'PNG 是安全、無損的圖形交換格式。',
      ],
      useCases: [
        {
          title: '透明標誌',
          description: '將透明的 AVIF 標誌轉換為可用的 PNG。',
        },
        {
          title: '設計交接',
          description: '為無法讀取 AVIF 的工具提供 PNG。',
        },
        {
          title: '編輯',
          description: '在你的編輯器中無損開啟圖片。',
        },
        {
          title: '網頁素材',
          description: '保留 PNG 作為舊版瀏覽器的備用格式。',
        },
      ],
      whyMediaManipulator: [
        '自動保留透明度。',
        '無損 PNG 輸出，適合圖形工作。',
      ],
      privacyNote: '你的 AVIF 會在我們的伺服器上解碼，並儲存為完整保留透明度的無損 PNG。不會傳送到任何外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。原始檔案絕不會被變更：你下載的是一個新檔案。',
      faq: [
        {
          question: '如何免費將 AVIF 轉換為 PNG？',
          answer: '在上方上傳你的 .avif 圖片並按一下轉換，輸出會是保留透明度的無損 .png。',
        },
        {
          question: 'AVIF 轉 PNG 會保留透明度嗎？',
          answer: '會。PNG 支援 Alpha 通道，所以透明的 AVIF 在轉換後仍然透明。',
        },
        {
          question: '我的 AVIF 應該轉成 PNG 還是 JPG？',
          answer: '需要透明度或無損畫質時（標誌、圖形），請選擇 PNG。如果圖片是沒有透明度的相片，而你想要最小的檔案，請選擇 JPG。',
        },
        {
          question: '為什麼 PNG 比 AVIF 大？',
          answer: 'AVIF 是高效率的壓縮格式，而 PNG 是無損格式，所以 PNG 通常較大。這是正常現象。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'AVIF 解碼需要具備 AVIF 委派程式的 ImageMagick。PNG 輸出會保留透明度。',
        ],
      },
      related: [
        {
          label: '將 AVIF 轉換為 JPG',
          to: '/tools/convert-avif-to-jpg',
          description: '改為將 AVIF 轉換為精簡的 JPG。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在 JPG、PNG、WebP、AVIF 等格式之間轉換。',
        },
        {
          label: '將 HEIC 轉換為 JPG',
          to: '/tools/convert-heic-to-jpg',
          description: '將 iPhone 的 HEIC 相片轉換為 JPG。',
        },
        {
          label: '移除圖片背景',
          to: '/tools/remove-background-from-image',
          description: '自動製作透明 PNG 去背圖。',
        },
      ],
      embed: {
        title: '將 AVIF 轉換為 PNG',
        description: '上傳 AVIF 圖片。輸出固定為 PNG，因此會保留透明度，檔案也能在任何編輯器或檢視器中無損開啟。',
      },
    },
    'convert-svg-to-png': {
      name: '將 SVG 轉換為 PNG',
      h1: '線上免費將 SVG 轉換為 PNG',
      tagline: '把 SVG 圖示和標誌轉為任意尺寸的 PNG 圖片，用於上傳、簡報和應用程式。',
      metaTitle: '線上免費將 SVG 轉換為 PNG | Media Manipulator',
      metaDescription: '免費線上 SVG 轉 PNG 工具。以你選擇的尺寸，將 SVG 圖示和標誌點陣化為 PNG 圖片。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 SVG 轉換為 PNG',
      ogDescription: '將 SVG 圖示和標誌點陣化為任意尺寸的 PNG 圖片。免費、快速、無需註冊。',
      intro: 'SVG 是完美的向量圖，但許多平台（社群網路、電商平台、簡報工具和應用程式）只接受 PNG 等點陣圖片。Media Manipulator 會以你選擇的尺寸，將 SVG 點陣化為清晰且保留透明度的 PNG。SVG 會被視為不受信任的輸入，並以安全的算繪器處理。',
      whatItDoes: [
        '將 SVG 向量檔案點陣化為 PNG 圖片。',
        '讓你設定目標寬度和／或高度，以決定輸出解析度。',
        '在 PNG 中保留 SVG 的透明度。',
        '使用不會擷取外部網路資源的安全點陣化程式進行算繪。',
      ],
      flowSteps: [
        {
          title: '上傳 SVG',
          description: '放入 .svg 圖示、標誌或插圖。',
        },
        {
          title: '設定尺寸（選用）',
          description: '選擇寬度／高度，或使用 SVG 的原始尺寸。',
        },
        {
          title: '點陣化',
          description: 'SVG 會在我們的伺服器上算繪為像素圖片。',
        },
        {
          title: '下載 PNG',
          description: '儲存清晰且保留透明度的 .png。',
        },
      ],
      advancedDetails: [
        '可用時會使用 rsvg-convert（librsvg）算繪，它預設不會載入遠端資源；ImageMagick 則作為經過強化的備用方案。',
        '由於 SVG 是向量格式，你可以用任何解析度算繪而不損失畫質；選擇較大的寬度可獲得更清晰的輸出。',
        '上傳的 SVG 會被視為不受信任的輸入，並在停用網路存取的情況下處理，以避免 SSRF／外部擷取的風險。',
      ],
      whyItMatters: [
        '大多數上傳表單和社群平台不接受 SVG，但接受 PNG。',
        '以選定的尺寸點陣化，可保證該用途的輸出清晰銳利。',
        'PNG 會保留圖示和標誌所仰賴的透明度。',
      ],
      useCases: [
        {
          title: '社群與上傳',
          description: '將 SVG 標誌轉為平台接受的 PNG。',
        },
        {
          title: '簡報',
          description: '將清晰的圖示 PNG 放進投影片。',
        },
        {
          title: '應用程式素材',
          description: '以應用程式所需的精確尺寸匯出 PNG。',
        },
        {
          title: '電子郵件',
          description: '在不支援 SVG 的地方使用 PNG。',
        },
      ],
      whyMediaManipulator: [
        '以任何尺寸算繪都不損失畫質，向量圖能完美縮放。',
        '安全處理 SVG，並停用外部擷取。',
      ],
      privacyNote: '你的 SVG 會在我們的伺服器上由 librsvg 算繪為 PNG，其中參照的外部圖片和字型都不會被擷取。不會傳送到任何外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。原始檔案絕不會被變更：你下載的是一個新檔案。',
      faq: [
        {
          question: '如何免費將 SVG 轉換為 PNG？',
          answer: '在上方上傳你的 .svg，視需要設定寬度或高度，然後按一下轉換。你會取得一個清晰的 .png。',
        },
        {
          question: 'PNG 會是多大的尺寸？',
          answer: '預設使用 SVG 的原始尺寸。設定寬度和／或高度即可算繪得更大或更小，向量圖縮放不會損失畫質。',
        },
        {
          question: 'PNG 會保留透明度嗎？',
          answer: '會。SVG 的透明區域在 PNG 中會保留為透明。',
        },
        {
          question: '上傳 SVG 安全嗎？',
          answer: '安全。我們將 SVG 視為不受信任的輸入，並在停用外部網路擷取的情況下算繪，因此內嵌的遠端參照無法載入。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '以 rsvg-convert（優先）或經過強化的 ImageMagick 備用方案算繪。SVG 中的外部網路擷取已停用。',
        ],
      },
      related: [
        {
          label: '將 PNG 轉換為 SVG',
          to: '/tools/convert-png-to-svg',
          description: '反向操作：將 PNG 向量化為 SVG。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在 JPG、PNG、WebP、AVIF 等格式之間轉換。',
        },
        {
          label: 'PNG 轉 ICO',
          to: '/tools/png-to-ico',
          description: '將 PNG 變成網站圖示。',
        },
      ],
      embed: {
        title: '將 SVG 轉換為 PNG',
        description: '上傳 SVG。輸出固定為 PNG。可選擇設定寬度或高度來控制算繪解析度；留空則使用 SVG 的原始尺寸。',
      },
    },
    'convert-png-to-svg': {
      name: '將 PNG 轉換為 SVG',
      h1: '線上免費將 PNG 轉換為 SVG',
      tagline: '使用 potrace 把 PNG 標誌、圖示和線稿向量化，變成真正可縮放的 SVG 路徑。',
      metaTitle: '線上免費將 PNG 轉換為 SVG | Media Manipulator',
      metaDescription: '免費線上 PNG 轉 SVG 向量化工具。將標誌、圖示和線稿描摹成真正可縮放的 SVG 路徑。最適合簡單圖形，不適合相片。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 PNG 轉換為 SVG',
      ogDescription: '將 PNG 中的標誌、圖示和線稿向量化為真正可縮放的 SVG 路徑。免費、無需註冊。',
      intro: '真正的 PNG 轉 SVG，是把圖片描摹成真正的向量路徑，可縮放到任何尺寸而不會出現像素化。Media Manipulator 使用 potrace 將你的 PNG 向量化，非常適合標誌、圖示、簽名和黑白線稿。這是真正的向量化，而不是把 PNG 藏在 SVG 裡。它並非設計用來把相片變成乾淨的向量圖。',
      whatItDoes: [
        '使用 potrace 將 PNG 描摹成真正可縮放的 SVG 向量路徑。',
        '先將圖片簡化為乾淨的黑白點陣圖，再將形狀向量化。',
        '讓你調整黑白閾值，擷取較多或較少的細節。',
        '輸出真正的 .svg，而不是包在 <image> 標籤裡的點陣圖片。',
      ],
      flowSteps: [
        {
          title: '上傳 PNG',
          description: '放入標誌、圖示、簽名或線稿 PNG。',
        },
        {
          title: '設定閾值',
          description: '選擇黑白分界點以控制細節。',
        },
        {
          title: '描摹成向量',
          description: 'ImageMagick 準備點陣圖；potrace 描摹路徑。',
        },
        {
          title: '下載 SVG',
          description: '儲存真正可縮放的 .svg 檔案。',
        },
      ],
      advancedDetails: [
        '處理流程會先將 PNG 平面化為雙色階點陣圖（ImageMagick threshold），再執行 potrace 產生平滑的貝茲向量路徑。',
        '向量化最適合高對比、簡單的圖形：標誌、圖示、字母組合標誌、簽名和黑白線稿。',
        '它無法忠實重現相片或複雜的漸層：描摹相片會產生龐大又雜亂的路徑，而不是乾淨的向量圖。',
        '提高閾值可擷取更細緻／更淡的細節；降低閾值則只保留最粗重的形狀。',
      ],
      whyItMatters: [
        '向量標誌可縮放到任何尺寸，從網站圖示到廣告看板都不會像素化。',
        '簡單圖形的 SVG 檔案非常小，而且可以在 Illustrator 或 Inkscape 等向量工具中編輯。',
        '從 PNG 標誌還原出向量圖，就省去從頭重新製作的工夫。',
      ],
      useCases: [
        {
          title: '還原標誌',
          description: '將已經沒有原始檔的 PNG 標誌向量化。',
        },
        {
          title: '圖示與字母組合標誌',
          description: '將簡單的圖示轉為可縮放的 SVG。',
        },
        {
          title: '簽名',
          description: '將掃描的簽名向量化，以便乾淨地重複使用。',
        },
        {
          title: '線稿',
          description: '將黑白作品描摹成可編輯的路徑。',
        },
      ],
      whyMediaManipulator: [
        '真正的 potrace 向量化，並坦白說明它擅長什麼（以及不擅長什麼）。',
        '閾值控制，讓你精確調整描摹結果。',
      ],
      privacyNote: '你的圖片會在我們的伺服器上被簡化為黑白，再由 potrace 描摹成向量路徑。不會傳送到任何外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。原始檔案絕不會被變更：你下載的是一個新檔案。',
      faq: [
        {
          question: '如何免費將 PNG 轉換為 SVG？',
          answer: '在上方上傳你的 .png，視需要調整閾值，然後按一下轉換。你會取得一個真正的向量 .svg。',
        },
        {
          question: '這是真正的向量化，還是只是包起來的 PNG？',
          answer: '是真正的向量化。我們用 potrace 將圖片描摹成實際的 SVG 路徑，而不是把 PNG 嵌入 SVG 就交差了事。',
        },
        {
          question: '它能把我的相片向量化嗎？',
          answer: '效果不好。向量化是為標誌、圖示、簽名和線稿設計的。相片和複雜的漸層會產生龐大又雜亂的路徑，而不是乾淨的向量。',
        },
        {
          question: '閾值控制有什麼作用？',
          answer: '它設定描摹前的黑白分界點。提高閾值可擷取更多（較淡的）細節；降低閾值則只保留最粗重的形狀。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '向量化需要伺服器上的 potrace。最適合標誌／圖示／線稿，不適合相片。',
        ],
      },
      related: [
        {
          label: '將 SVG 轉換為 PNG',
          to: '/tools/convert-svg-to-png',
          description: '反向操作：將 SVG 點陣化為 PNG。',
        },
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在 JPG、PNG、WebP、AVIF 等格式之間轉換。',
        },
        {
          label: 'PNG 轉 ICO',
          to: '/tools/png-to-ico',
          description: '將 PNG 變成網站圖示。',
        },
      ],
      embed: {
        title: '將 PNG 向量化為 SVG',
        description: '上傳 PNG。輸出固定為 SVG，由真正的向量化（potrace）產生，而不是包在 SVG 裡的點陣圖。調整黑白閾值可擷取較多或較少的細節。最適合標誌、圖示、簽名和線稿。',
      },
    },
    'png-to-ico': {
      name: 'PNG 轉 ICO',
      h1: '線上免費將 PNG 轉換為 ICO',
      tagline: '把 PNG 轉為真正的多尺寸 .ico 網站圖示，可用於網站 favicon 和 Windows 應用程式圖示。',
      metaTitle: '線上免費將 PNG 轉換為 ICO | Media Manipulator',
      metaDescription: '免費線上 PNG 轉 ICO 工具。為網站和 Windows 圖示產生真正的多尺寸 .ico 網站圖示（16–256px）。無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 PNG 轉換為 ICO',
      ogDescription: '從 PNG 產生真正的多尺寸 .ico 網站圖示。免費、快速、無需註冊。',
      intro: '網站圖示必須是包含多種尺寸的真正 .ico 檔案，瀏覽器和 Windows 才能挑選合適的尺寸。Media Manipulator 會從你的 PNG 產生真正的多尺寸 ICO（而不是改了副檔名的檔案），封裝標準的 16–256 px 圖示尺寸階梯。',
      whatItDoes: [
        '從 PNG 圖片產生真正的 .ico 容器。',
        '將多種尺寸（16、32、48、64、128、256 px）封裝成一個檔案。',
        '保留透明度，讓圖示在任何背景上都能乾淨呈現。',
        '產生瀏覽器和 Windows 都接受作為網站圖示／應用程式圖示的檔案。',
      ],
      flowSteps: [
        {
          title: '上傳 PNG',
          description: '放入 PNG，正方形圖片能做出最好的圖示。',
        },
        {
          title: '產生尺寸',
          description: '我們會從你的圖片算繪每一種標準圖示尺寸。',
        },
        {
          title: '封裝 ICO',
          description: '這些尺寸會封裝進一個真正的 .ico 容器。',
        },
        {
          title: '下載 ICO',
          description: '為你的網站或應用程式儲存 favicon.ico。',
        },
      ],
      advancedDetails: [
        'ICO 是以 ImageMagick 的圖示自動調整尺寸功能建立，產生真正的多影像容器，而不是改了副檔名的 PNG。',
        '包含多種尺寸，可讓瀏覽器和 Windows 為每種情境（分頁、工作列、桌面）挑選最清晰的圖示。',
        '若要獲得最乾淨的結果，請從 256×256 或更大的正方形 PNG 開始，讓每種尺寸都能清晰地縮小取樣。',
      ],
      whyItMatters: [
        '瀏覽器預期的是真正的 .ico 網站圖示；改了副檔名的 PNG 可能無法使用或看起來模糊。',
        '多尺寸圖示從 16px 的分頁到 256px 的桌面捷徑都能保持清晰。',
        'Windows 應用程式圖示必須使用 .ico 格式。',
      ],
      useCases: [
        {
          title: '網站圖示',
          description: '為網站的分頁圖示產生 favicon.ico。',
        },
        {
          title: 'Windows 應用程式圖示',
          description: '為桌面應用程式建立 .ico。',
        },
        {
          title: '捷徑',
          description: '為桌面捷徑製作清晰的圖示。',
        },
        {
          title: '品牌形象',
          description: '將標誌 PNG 變成正式的圖示檔案。',
        },
      ],
      whyMediaManipulator: [
        '真正的多尺寸 ICO，而不是改了副檔名的 PNG。',
        '保留透明度，圖示更乾淨。',
      ],
      privacyNote: '你的圖片會在我們的伺服器上由 ImageMagick 調整為每種標準圖示尺寸，並封裝成一個 .ico 檔案。不會傳送到任何外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。原始檔案絕不會被變更：你下載的是一個新檔案。',
      faq: [
        {
          question: '如何免費將 PNG 轉換為 ICO？',
          answer: '在上方上傳你的 .png 並按一下轉換，你會取得一個真正的多尺寸 .ico。',
        },
        {
          question: '這是真正的 ICO，還是改了副檔名的 PNG？',
          answer: '是真正的 ICO。我們會產生數種圖示尺寸，並將它們封裝進真正的 .ico 容器，這正是瀏覽器和 Windows 所預期的格式。',
        },
        {
          question: '包含哪些尺寸？',
          answer: '標準的網站圖示尺寸階梯：16、32、48、64、128 和 256 px。瀏覽器和 Windows 會為每種情境挑選最合適的尺寸。',
        },
        {
          question: '什麼樣的圖片效果最好？',
          answer: '256×256 或更大的正方形 PNG 能產生最清晰的結果，因為每個較小的尺寸都能從它乾淨地縮小取樣。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '會產生多尺寸 ICO（16/32/48/64/128/256 px）。從正方形圖片開始可獲得最佳結果。',
        ],
      },
      related: [
        {
          label: '圖片轉換器',
          to: '/tools/image-converter',
          description: '在 JPG、PNG、WebP、AVIF 等格式之間轉換。',
        },
        {
          label: '將 SVG 轉換為 PNG',
          to: '/tools/convert-svg-to-png',
          description: '製作圖示前，先將 SVG 標誌點陣化。',
        },
        {
          label: '圖片尺寸調整',
          to: '/tools/image-resizer',
          description: '產生圖示前，先製作正方形圖片。',
        },
        {
          label: '移除圖片背景',
          to: '/tools/remove-background-from-image',
          description: '製作透明的圖示來源圖。',
        },
      ],
      embed: {
        title: '將 PNG 轉換為 ICO',
        description: '上傳 PNG（正方形圖片效果最好）。輸出固定為 ICO，並會產生包含 16、32、48、64、128 和 256 px 版本的真正多尺寸圖示。',
      },
    },
    'svg-converter': {
      name: 'SVG 轉換器',
      tagline: '將 SVG 轉為 PNG，或把 PNG 描摹成 SVG：以 SVG 為起點的圖片轉換器。',
    },
    'convert-wav-to-mp3': {
      name: '將 WAV 轉換為 MP3',
      h1: '線上將 WAV 轉換為 MP3',
      tagline: '把容量龐大的無損 WAV 錄音壓縮成相容性廣泛的 MP3 檔案，適合 Podcast、分享和儲存。',
      metaTitle: '線上將 WAV 轉換為 MP3（免費） | Media Manipulator',
      metaDescription: '免費線上 WAV 轉 MP3 工具。以你選擇的位元率，將無損 .wav 錄音壓縮成較小的 MP3 檔案。',
      ogTitle: '線上將 WAV 轉換為 MP3',
      ogDescription: '以你選擇的位元率，將 WAV 錄音壓縮成相容性廣泛的 MP3 檔案。',
      intro: 'WAV 檔案是無損的，而且很大。MP3 是相容性最廣的壓縮音訊格式，每支手機、每台筆電和每個音樂應用程式都能播放。Media Manipulator 會以你選擇的位元率將 WAV 重新編碼為 MP3，讓你只犧牲一點點音質，就能換來小 5–10 倍的檔案。',
      whatItDoes: [
        '以你選擇的位元率將 WAV 錄音重新編碼為 MP3。',
        '支援自訂取樣率、聲道與位元率（128 到 320 kbps）。',
        '保留響度，並避免不必要的重新取樣。',
        '輸出附 ID3 標籤的標準 .mp3 檔案。',
      ],
      flowSteps: [
        {
          title: '上傳 WAV',
          description: '放入電腦上的任何 .wav 檔案。',
        },
        {
          title: '選擇位元率',
          description: '語音用 192 kbps，音樂用 256–320 kbps。',
        },
        {
          title: '編碼 MP3',
          description: 'FFmpeg 以選定的設定編碼出乾淨的 MP3。',
        },
        {
          title: '下載 MP3',
          description: '儲存相容性廣泛的 .mp3。',
        },
      ],
      advancedDetails: [
        '底層透過 FFmpeg 使用 LAME 式編碼。',
        'MP3 是有損編解碼器，音樂的音質大約在 256 kbps 達到上限。語音內容在 128–192 kbps 就很好聽。',
        '如果你需要更小的無損檔案，請改用 FLAC 或 ALAC。若播放器由你掌控，可使用 Opus（封裝在 OGG 中）取得最小的新式有損檔案。',
      ],
      whyItMatters: [
        '在合理的位元率下，WAV 檔案比同等的 MP3 大 5–10 倍。',
        'MP3 在每台裝置上都能播放，沒有編解碼器相容性問題。',
        'Podcast、有聲書和音樂平台通常要求或偏好上傳 MP3。',
      ],
      useCases: [
        {
          title: 'Podcast 單集',
          description: '以 WAV 完成母帶處理，再以 96–128 kbps 單聲道 MP3 發布。',
        },
        {
          title: '語音備忘錄',
          description: '在分享或封存前縮小手機錄音。',
        },
        {
          title: '音樂試聽帶',
          description: '以 256–320 kbps 傳送混音，附件不會太大。',
        },
        {
          title: '嵌入網站',
          description: '使用 MP3 確保相容性，每個瀏覽器都能原生播放。',
        },
      ],
      whyMediaManipulator: [
        '精確選擇位元率、取樣率與聲道配置。',
        '免費、無需註冊、無浮水印，輸出完全屬於你。',
        '與整套工具其他部分相同的保留期限隱私模式。',
      ],
      privacyNote: '你的 WAV 會在我們的伺服器上由 FFmpeg 以你選擇的位元率編碼為 MP3。不涉及任何外部音訊服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你會得到一個新檔案；上傳的檔案本身不會被變更。',
      faq: [
        {
          question: '我應該選擇哪個位元率？',
          answer: '192 kbps 是兼顧大小與音質的預設值。語音／Podcast 用 128 kbps，音樂用 256–320 kbps。',
        },
        {
          question: '音質會下降嗎？',
          answer: '會稍微下降，因為 MP3 是有損格式。在 256+ kbps 下，大多數聽眾分辨不出與原始 WAV 的差異。',
        },
        {
          question: '可以將其他格式轉換為 MP3 嗎？',
          answer: '可以，音訊轉換器接受 FLAC、M4A/AAC、OGG、OPUS 等格式。請使用通用的音訊轉換器工具。',
        },
        {
          question: '有檔案大小限制嗎？',
          answer: '接受合理的檔案大小。若是非常長的錄音，可以考慮先裁剪。',
        },
      ],
      related: [
        {
          label: '音訊轉換器',
          to: '/tools/audio-converter',
          description: '在任意兩種音訊格式之間轉換。',
        },
        {
          label: '從歌曲中分離人聲',
          to: '/tools/isolate-vocals-from-song',
          description: '從音樂音軌中擷取人聲。',
        },
        {
          label: '音訊轉換器教學',
          to: '/tutorials/audio/getting-started',
          description: '逐一介紹每個音訊選項，包括 AI 工具。',
        },
      ],
      embed: {
        title: '將 WAV 轉換為 MP3',
        description: '上傳 WAV 檔案並選擇 MP3 作為輸出格式。語音用 192 kbps 是不錯的預設值；音樂請用 256–320 kbps。',
      },
    },
    'isolate-vocals-from-song': {
      name: '分離歌曲人聲',
      h1: '線上分離歌曲人聲',
      tagline: '從音樂音軌中擷取人聲，用於混音、翻唱、轉錄和分析。請僅用於你擁有權利的音樂。',
      metaTitle: '線上分離歌曲人聲（免費） | Media Manipulator',
      metaDescription: '免費線上人聲分離。將歌曲中的人聲擷取為乾淨的分軌，用於混音、翻唱、轉錄或分析。',
      ogTitle: '線上分離歌曲人聲',
      ogDescription: '將歌曲中的人聲擷取為乾淨的獨立分軌，用於重混、翻唱、轉錄或分析。',
      intro: '以 AI 為基礎的音源分離，可以從完成的混音中擷取出人聲軌，非常適合重混、翻唱、卡拉 OK 準備或轉錄歌詞。Media Manipulator 在我們自己的 GPU 伺服器上執行分離。結果是單一的人聲分軌，你可以下載並在任何地方使用，前提是你對來源素材擁有相應的權利。',
      whatItDoes: [
        '執行以 AI 為基礎的音源分離，從音樂錄音中擷取人聲軌。',
        '輸出單一的獨立人聲分軌，格式與你的檔案相同（MP3 仍為 MP3），或依你的選擇輸出 FLAC、WAV 或 MP3。',
        '可搭配降噪和 EQ 等音訊清理工具，得到更精緻的結果。',
        '支援 WAV、MP3、FLAC、M4A、OGG、OPUS 等輸入格式。',
      ],
      flowSteps: [
        {
          title: '上傳歌曲',
          description: '放入任何混有人聲與音樂的常見音訊檔案。',
        },
        {
          title: '執行 AI 分離',
          description: '本機 GPU 模型會將人聲從混音的其他部分中分離出來。',
        },
        {
          title: '清理（選用）',
          description: '套用降噪、EQ 或增益來修飾分軌。',
        },
        {
          title: '下載人聲分軌',
          description: '儲存分離出的人聲：預設與你的檔案格式相同，也可選擇 FLAC、WAV 或 MP3。',
        },
      ],
      advancedDetails: [
        '音源分離本質上就不完美：殘響、和聲和重度效果會滲入輸出中。',
        'MP3 或其他壓縮檔案會以原本的格式傳回（MP3 為 320 kbps）。無損檔案（WAV、FLAC、AIFF）會以 FLAC 傳回。FLAC 和 WAV 保留最多細節，方便在 DAW 中進一步編輯；WAV 檔案最大。',
        '若要製作卡拉 OK（只要伴奏），請改用音訊轉換器中專用的「移除人聲」模式。',
      ],
      whyItMatters: [
        '製作人和混音師可以圍繞現有的人聲打造新曲目。',
        '歌手可以更準確地轉錄歌詞或旋律。',
        '教育者和音訊工程師使用分離出的分軌研究混音技巧。',
      ],
      useCases: [
        {
          title: '重混與翻唱',
          description: '圍繞分離出的人聲打造新的伴奏。',
        },
        {
          title: '歌詞與旋律轉錄',
          description: '為人工或 AI 轉錄取得更清楚的訊號。',
        },
        {
          title: '卡拉 OK 準備',
          description: '將分離出的人聲與另一個伴奏版本搭配使用。',
        },
        {
          title: '音訊工程練習',
          description: '用商業錄音研究混音技巧。',
        },
      ],
      whyMediaManipulator: [
        '本機 GPU AI，沒有任何第三方 AI 供應商會接觸到你的音訊。',
        '一次上傳即可結合 EQ、降噪和裁剪。',
        '免費、無需註冊，輸出無浮水印。',
      ],
      privacyNote: '你的歌曲會在我們自己的 GPU 伺服器上由 Demucs 分成多個分軌，只有人聲分軌會傳回給你。不涉及任何外部音訊服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你會得到一個新檔案；上傳的檔案本身不會被變更。',
      faq: [
        {
          question: '這是完全乾淨的分離嗎？',
          answer: '沒有任何音源分離工具是完美的。預期會有一些瑕疵，尤其是在重度殘響和和聲附近。如果你打算之後在 DAW 中清理分軌，請選擇 FLAC 或 WAV 輸出。',
        },
        {
          question: '支援哪些音訊格式？',
          answer: 'WAV、MP3、FLAC、M4A/AAC、OGG、OPUS，以及大多數其他常見的音訊格式。',
        },
        {
          question: '可以用在受著作權保護的音樂上嗎？',
          answer: '只有在你擁有權利、取得授權，或屬於你所在司法管轄區的合理使用範圍時才可以。你須對輸出內容的使用方式負責。',
        },
        {
          question: '哪裡可以只取得伴奏？',
          answer: '使用音訊轉換器中的「移除人聲」AI 模式：同樣的上傳，不同的輸出。',
        },
      ],
      related: [
        {
          label: '音訊轉換器',
          to: '/tools/audio-converter',
          description: '分離後轉換並清理分軌。',
        },
        {
          label: '將 WAV 轉換為 MP3',
          to: '/tools/convert-wav-to-mp3',
          description: '將 WAV 分軌壓縮成 MP3 以便分享。',
        },
        {
          label: '音訊轉換器教學',
          to: '/tutorials/audio/getting-started',
          description: '逐一介紹每個音訊選項，包括 AI 工具。',
        },
      ],
      embed: {
        title: '分離人聲',
        description: '上傳歌曲並按下按鈕：「分離人聲」已預先選好。結果會以與你的檔案相同的格式傳回（MP3 仍為 MP3）；若要無損輸出，請在「輸出格式」下選擇 FLAC 或 WAV。',
      },
    },
    'image-converter': {
      name: '圖片轉換器',
      h1: '線上免費圖片轉換器',
      tagline: '在 JPG、PNG、WebP、AVIF、GIF 等格式之間轉換，並可控制畫質、調整尺寸、裁切和中繼資料。',
      metaTitle: '線上免費圖片轉換器 | Media Manipulator',
      metaDescription: '免費線上圖片轉換器，支援 JPG、PNG、WebP、AVIF、GIF 與 HEIC。一次上傳即可調整尺寸、壓縮、裁切並移除中繼資料。',
      ogTitle: '線上免費圖片轉換器',
      ogDescription: '轉換 JPG、PNG、WebP、AVIF、GIF 與 HEIC。一次上傳即可調整尺寸、壓縮並移除中繼資料。',
      intro: '同一張圖片常常需要用在好幾個地方：你的網站、簡報、印刷品、電商平台的商品頁。每個地方偏好的格式都不同。Media Manipulator 在同一個地方處理所有常見的圖片格式，並能精細控制畫質、尺寸調整與中繼資料。',
      whatItDoes: [
        '在 JPG、PNG、WebP、AVIF、GIF、HEIC 等格式之間轉換。',
        '一次完成尺寸調整、裁切、旋轉與視覺濾鏡套用。',
        '依需要移除或保留 EXIF/IPTC/XMP 中繼資料。',
        'AI 工具：人臉模糊、背景移除、放大，以及文字／個資遮蔽。',
      ],
      flowSteps: [
        {
          title: '上傳圖片',
          description: '放入任何常見的圖片檔案。',
        },
        {
          title: '選擇輸出格式',
          description: 'JPG、PNG、WebP、AVIF、GIF。',
        },
        {
          title: '調整畫質與中繼資料',
          description: '調整尺寸、裁切或移除 EXIF。',
        },
        {
          title: '下載',
          description: '儲存轉換後的圖片。',
        },
      ],
      advancedDetails: [
        'WebP 與 AVIF 能產生最小的網頁檔案；在相同的視覺畫質下，AVIF 常常比 WebP 更勝一籌。',
        'PNG 是無損格式並支援透明度，非常適合 UI 素材與螢幕截圖。',
        'JPG 是交換相片時最安全的格式。',
      ],
      whyItMatters: [
        '不同的平台與工具接受不同的圖片格式。',
        '較小的圖片檔案能讓頁面載入更快，而 Google 會將載入較快的頁面排得更前面。',
        '分享前移除中繼資料可以保護你的隱私。',
      ],
      useCases: [
        {
          title: '網頁最佳化',
          description: '將 PNG 相片轉為 WebP/AVIF，減輕頁面重量。',
        },
        {
          title: '跨平台分享',
          description: '將 iPhone 的 HEIC 相片轉為 JPG。',
        },
        {
          title: '電商平台商品頁',
          description: '發布前移除中繼資料並調整尺寸。',
        },
        {
          title: '印刷與簡報',
          description: '以高畫質預設組輸出 JPG。',
        },
      ],
      whyMediaManipulator: [
        '一次上傳就涵蓋轉換、尺寸調整、裁切、濾鏡、AI 與中繼資料。',
        '免費、無需註冊、無浮水印。',
        'AI 工具在我們自己的 GPU 伺服器上執行。',
      ],
      privacyNote: '你的圖片會在我們的伺服器上由 ImageMagick 轉換，如果你有要求，也會一併調整尺寸或裁切。不會傳送任何內容給外部服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。原始檔絕不會被更動：你下載的是一個新檔案。',
      faq: [
        {
          question: '最好的圖片格式是哪一種？',
          answer: '視情況而定：網頁用 WebP/AVIF，需要透明度用 PNG，講求相容性用 JPG。',
        },
        {
          question: '可以批次轉換嗎？',
          answer: '免費工具一次轉換一張圖片。請依序執行多次轉換。',
        },
        {
          question: '它會移除中繼資料嗎？',
          answer: '只有在你將中繼資料模式設為「移除所有中繼資料」時才會。預設會保留中繼資料。',
        },
        {
          question: '支援 HEIC 嗎？',
          answer: '支援。iPhone 的 HEIC 相片可以順利轉換為 JPG、PNG 或 WebP。',
        },
      ],
      related: [
        {
          label: '圖片尺寸調整',
          to: '/tools/image-resizer',
          description: '調整為精確的像素尺寸。',
        },
        {
          label: '壓縮圖片',
          to: '/tools/compress-image',
          description: '縮小網頁用圖片的檔案大小。',
        },
        {
          label: '圖片轉 PDF',
          to: '/tools/image-to-pdf',
          description: '將圖片包裝成 PDF 文件。',
        },
        {
          label: 'PDF 轉換器',
          to: '/tools/pdf-converter',
          description: '將 PDF 轉為圖片，也能反向轉換。',
        },
        {
          label: '將 HEIC 轉換為 JPG',
          to: '/tools/convert-heic-to-jpg',
          description: '將 iPhone 的 HEIC 相片轉為 JPG。',
        },
        {
          label: '移除圖片背景',
          to: '/tools/remove-background-from-image',
          description: '自動擦除背景，輸出透明 PNG。',
        },
        {
          label: '將 WebP 轉換為 JPG',
          to: '/tools/convert-webp-to-jpg',
          description: '專門的 WebP → JPG 轉換器。',
        },
        {
          label: '圖片轉換器教學',
          to: '/tutorials/image/getting-started',
          description: '每個選項的完整逐步說明。',
        },
      ],
      embed: {
        title: '轉換圖片',
        description: '上傳任何圖片，並選擇輸出格式、畫質與尺寸調整／裁切設定。JPG 適合相片，PNG 能保留透明度，WebP/AVIF 則能產生最小的網頁檔案。',
      },
    },
    'video-converter': {
      name: '影片轉換器',
      h1: '線上免費影片轉換器',
      tagline: '在 MP4、WebM、MOV、AVI、MKV 等格式之間轉換，並可完整控制編解碼器、解析度和音訊。',
      metaTitle: '線上免費影片轉換器 | Media Manipulator',
      metaDescription: '免費線上影片轉換器，支援 MP4、WebM、MOV、AVI、MKV 等格式。可選擇編解碼器、位元率、解析度與音訊設定。',
      ogTitle: '線上免費影片轉換器',
      ogDescription: '轉換 MP4、WebM、MOV、AVI、MKV、FLV、WMV 等格式。可選擇編解碼器、位元率與音訊設定。',
      intro: '不同的平台需要不同的影片格式。在 Mac 上用 MOV 剪輯，以 MP4 或 WebM 發布到網路，用 MKV 封存。Media Manipulator 在同一個地方處理所有常見的影片容器與編解碼器，並可完整控制位元率、解析度與音訊。',
      whatItDoes: [
        '在 MP4、WebM、MOV、AVI、MKV、FLV、WMV 與 ProRes 之間轉換。',
        '選擇編解碼器（H.264、H.265、VP9、ProRes、DNxHD）。',
        '調整尺寸、變更影格率、剪輯，並重新編碼音訊。',
        '可選擇套用濾鏡與調色。',
      ],
      flowSteps: [
        {
          title: '上傳影片',
          description: '放入任何常見格式的影片容器。',
        },
        {
          title: '選擇目標格式',
          description: 'MP4、WebM、MOV、AVI、MKV。',
        },
        {
          title: '調整編解碼器與畫質',
          description: '位元率、解析度、音訊。',
        },
        {
          title: '下載',
          description: '儲存轉換後的影片。',
        },
      ],
      advancedDetails: [
        'MP4 中的 H.264 是到處都能播放的安全預設。',
        'H.265（HEVC）與 VP9 在相同的視覺畫質下，檔案可小約 25–50%，但需要較新的播放器。',
        '交付剪輯時，ProRes（MOV 封裝）或 DNxHD（MOV/MXF 封裝）能保留最多畫質。',
      ],
      whyItMatters: [
        '剪輯軟體、瀏覽器與社群平台各自偏好不同的格式。',
        '較小的影片檔案能縮短頁面載入時間並降低頻寬成本。',
        '重新編碼可以修正錯誤的編解碼器或無法播放的檔案。',
      ],
      useCases: [
        {
          title: 'MOV → MP4',
          description: '讓 Apple 裝置拍攝的影片到處都能播放。',
        },
        {
          title: 'AVI → MP4',
          description: '讓舊的封存影片跟上時代。',
        },
        {
          title: 'MP4 → WebM',
          description: '為新式瀏覽器縮小網頁影片。',
        },
        {
          title: '交付剪輯',
          description: '匯出 ProRes 或 DNxHD，以進行高品質剪輯。',
        },
      ],
      whyMediaManipulator: [
        '一次上傳就能完整控制編解碼器、位元率與音訊。',
        '同一個檔案也能使用 AI 轉錄。',
        '免費、無需註冊、無浮水印。',
      ],
      privacyNote: '你的影片會在我們的伺服器上由 FFmpeg 重新編碼為你選擇的容器與編解碼器。處理在我們自己的伺服器上進行，而不是第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的來源檔案不會被更動，結果是一個新檔案。',
      faq: [
        {
          question: '哪種輸出格式最好？',
          answer: '講求相容性用搭配 H.264 的 MP4，想要最小的網頁檔案則用搭配 VP9 的 WebM。',
        },
        {
          question: '可以在轉換前剪輯嗎？',
          answer: '可以。表單中的剪輯區塊能讓你在重新編碼前先剪短片段。',
        },
        {
          question: '音訊會保持同步嗎？',
          answer: '會。FFmpeg 會維持影音同步。如果你變更影格率或速度，音訊也會相應地重新取樣。',
        },
        {
          question: '有檔案大小限制嗎？',
          answer: '在免費方案中，非常大的檔案可能會被拒絕。請先試著降低解析度。',
        },
      ],
      related: [
        {
          label: '將 MOV 轉換為 MP4',
          to: '/tools/convert-mov-to-mp4',
          description: '讓 QuickTime/iPhone 拍攝的影片到處都能播放。',
        },
        {
          label: '將 WebM 轉換為 MP4',
          to: '/tools/convert-webm-to-mp4',
          description: '將網頁影片轉為可編輯的 MP4。',
        },
        {
          label: '將 MP4 轉換為 WebM',
          to: '/tools/convert-mp4-to-webm',
          description: '將 MP4 縮小為適合網頁的 VP9 WebM。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '專門縮小影片檔案的壓縮工具。',
        },
        {
          label: '將影片轉換為 GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: '將短片變成動態 GIF。',
        },
        {
          label: '從影片擷取音訊',
          to: '/tools/extract-audio-from-video',
          description: '將音軌儲存為 MP3、WAV 或 M4A。',
        },
        {
          label: '影片裁剪',
          to: '/tools/video-trimmer',
          description: '無損地把片段剪成你想要的部分。',
        },
        {
          label: '調整影片尺寸',
          to: '/tools/resize-video',
          description: '將解析度變更為 1080p、720p 或自訂。',
        },
        {
          label: '旋轉影片',
          to: '/tools/rotate-video',
          description: '修正橫躺或上下顛倒的影片。',
        },
        {
          label: '影片轉錄',
          to: '/tools/transcribe-video',
          description: '將影片中的語音擷取為文字或 VTT 字幕。',
        },
        {
          label: 'AI 影格插補',
          to: '/tools/ai-frame-interpolation',
          description: '用 AI 產生的影格將影片 FPS 提高到 48、60 或 120。',
        },
        {
          label: '將影片轉碼為 HLS',
          to: '/tools/transcode-to-hls',
          description: '從任何影片產生自適應 HLS 套件。',
        },
        {
          label: '將影片轉碼為 DASH',
          to: '/tools/transcode-to-dash',
          description: '從任何影片產生 MPEG-DASH AV1/VP9 套件。',
        },
        {
          label: '影片轉換器教學',
          to: '/tutorials/video/getting-started',
          description: '每個選項的完整逐步說明。',
        },
      ],
      embed: {
        title: '轉換影片',
        description: '上傳任何影片，並選擇目標容器／編解碼器。「中」畫質預設組是不錯的預設選擇。MP4 到處都能播放；WebM 在新式瀏覽器中能產生較小的檔案。',
      },
    },
    'mp4-converter': {
      name: 'MP4 轉換器',
      tagline: '將影片轉換為 MP4：預先選好 MP4 的影片轉換器。',
    },
    'convert-mov-to-mp4': {
      name: '將 MOV 轉換為 MP4',
      h1: '線上免費將 MOV 轉換為 MP4',
      tagline: '把 QuickTime 和 iPhone 的 .mov 檔案變成通用的 MP4，各處都能播放和上傳。',
      metaTitle: '線上免費將 MOV 轉換為 MP4 | Media Manipulator',
      metaDescription: '免費線上 MOV 轉 MP4 工具。將 QuickTime 和 iPhone 的 .mov 影片轉換為隨處都能播放的 MP4。無浮水印，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 MOV 轉換為 MP4',
      ogDescription: '將 QuickTime／iPhone 的 MOV 檔案轉換為通用的 MP4，可在任何裝置上上傳和播放。',
      intro: 'MOV 是 Apple 的 QuickTime 容器格式，也是 iPhone、Mac 和許多相機預設的錄影格式。它在 Apple 生態系中表現很好，但在 Windows、Android 或某些上傳表單上可能無法播放。將 MOV 轉換為 MP4 會把同樣的 H.264 影片和 AAC 音訊放進全世界都接受的容器中，通常不會有肉眼可見的畫質變化。',
      whatItDoes: [
        '將 QuickTime／iPhone 的 .mov 檔案轉換為 MP4。',
        '將輸出鎖定為 MP4（H.264 + AAC），讓結果隨處都能播放。',
        '加入 -pix_fmt yuv420p 和 +faststart，讓 MP4 能在瀏覽器中播放並立即開始。',
        '在同一次上傳中裁剪 MOV、調整尺寸或選擇品質預設組。',
      ],
      flowSteps: [
        {
          title: '上傳你的 MOV',
          description: '放入來自 iPhone、Mac 或相機的 .mov 檔案。',
        },
        {
          title: '輸出已鎖定為 MP4',
          description: '不需要選擇格式：此工具已設定為 MP4。',
        },
        {
          title: '轉換',
          description: '我們將影片重新封裝或重新編碼為乾淨的 MP4。',
        },
        {
          title: '下載',
          description: '儲存你的 MP4，可直接用於任何裝置或平台。',
        },
      ],
      advancedDetails: [
        '大多數 MOV 檔案本身就包含 H.264 影片，所以轉換速度快，在「高」品質下幾乎無損。',
        '我們強制使用 yuv420p 色度取樣，讓 MP4 能在 Safari 以及會拒絕 4:2:2/4:4:4 影片的社群平台上播放。',
        '如果你的 MOV 內含 ProRes，轉換器會將其轉碼為 H.264；選擇「高」品質可保留最多細節。',
      ],
      whyItMatters: [
        '沒有額外的編解碼器，MOV 在 Windows 或 Android 上往往無法播放。',
        '許多上傳表單和編輯器接受 MP4，卻拒絕 MOV。',
        'MP4 是與任何人分享 iPhone 影片最保險的格式。',
      ],
      useCases: [
        {
          title: 'iPhone 影片',
          description: '轉換在 iPhone 上錄製的 .mov，讓它能在 Windows 電腦上播放。',
        },
        {
          title: '上傳到網路',
          description: '把 QuickTime 匯出的檔案變成網站會接受的 MP4。',
        },
        {
          title: '傳送給非 Apple 使用者',
          description: '與 Android 和 Windows 使用者分享影片，不會有播放問題。',
        },
        {
          title: '編輯器相容性',
          description: '將 MP4 匯入難以處理原始 MOV 的編輯器。',
        },
      ],
      whyMediaManipulator: [
        '輸出鎖定為經過驗證的 MP4 設定檔，不必猜測設定。',
        '伺服器端的 FFmpeg 也能處理 MOV 中的 ProRes 和 HEVC 來源。',
      ],
      privacyNote: '你的 MOV 會在我們的伺服器上由 FFmpeg 重新編碼為 H.264 和 AAC 的 MP4。處理工作在我們自己的伺服器上執行，不使用第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的原始檔案不會被更動，結果會是一個新檔案。',
      faq: [
        {
          question: '如何將 MOV 轉換為 MP4？',
          answer: '上傳你的 .mov 檔案並按下轉換。輸出已設定為 MP4，所以不需要再選擇其他任何東西。',
        },
        {
          question: '將 MOV 轉換為 MP4 會損失畫質嗎？',
          answer: '大多數 MOV 檔案使用 H.264，所以在「高」品質下，重新編碼在視覺上幾乎無損。較低的預設組會犧牲一些畫質，換取較小的檔案。',
        },
        {
          question: '為什麼我的 iPhone MOV 無法在 Windows 上播放？',
          answer: 'Windows 可能缺少 QuickTime／HEVC 編解碼器。採用 H.264 + AAC 的 MP4 不需要額外軟體就能播放。',
        },
        {
          question: 'QuickTime 轉 MP4 是同一件事嗎？',
          answer: '是的。QuickTime 檔案使用 .mov 容器，所以將 QuickTime 轉換為 MP4 正是這個工具的用途。',
        },
        {
          question: '有浮水印或需要註冊嗎？',
          answer: '沒有浮水印，也不需要帳號。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '輸出已鎖定為 MP4（H.264 + AAC、yuv420p、+faststart）。',
        ],
      },
      related: [
        {
          label: '影片轉換器',
          to: '/tools/video-converter',
          description: '將任何影片轉換為 MP4。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '縮小 MP4，方便透過電子郵件寄送或放上網路。',
        },
        {
          label: '將影片轉換為 GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: '裁剪片段並匯出動態 GIF。',
        },
        {
          label: '影片轉換器教學',
          to: '/tutorials/video/getting-started',
          description: '逐步了解裁剪、調整尺寸和品質選項。',
        },
      ],
      embed: {
        title: '將 MOV 轉換為 MP4',
        description: '上傳你的 .mov 檔案。此工具的輸出已鎖定為 MP4（H.264 + AAC），只要上傳並轉換即可。',
      },
    },
    'convert-webm-to-mp4': {
      name: '將 WebM 轉換為 MP4',
      h1: '線上免費將 WebM 轉換為 MP4',
      tagline: '把網頁最佳化的 .webm 影片變成 MP4，可在任何裝置上剪輯、分享和播放。',
      metaTitle: '線上免費將 WebM 轉換為 MP4 | Media Manipulator',
      metaDescription: '免費線上 WebM 轉 MP4 工具。將 .webm（VP8/VP9）影片轉換為 MP4（H.264 + AAC），供無法開啟 WebM 的編輯器和裝置使用。無浮水印，無需註冊。',
      ogTitle: '線上免費將 WebM 轉換為 MP4',
      ogDescription: '將 .webm 影片轉換為編輯器、手機和電視都能播放的通用 MP4。',
      intro: 'WebM 是專為網路打造的現代開放式容器：檔案小，非常適合瀏覽器影片。但許多影片編輯器、較舊的裝置和通訊應用程式都無法開啟 WebM。將 WebM 轉換為 MP4 會把 VP8/VP9 影片重新編碼為 H.264、把音訊重新編碼為 AAC，讓你得到一個能在 Premiere、Resolve、手機和電視上使用的檔案。',
      whatItDoes: [
        '將 .webm（VP8/VP9 + Vorbis/Opus）影片轉換為 MP4。',
        '將輸出鎖定為 MP4（H.264 + AAC），以獲得最大相容性。',
        '加入 yuv420p 和 +faststart，讓 MP4 能在每個瀏覽器中播放並立即開始。',
        'WebM 螢幕錄影可以在轉換為 MP4 的過程中裁剪或調整尺寸。',
      ],
      flowSteps: [
        {
          title: '上傳你的 WebM',
          description: '放入從網路下載或由螢幕錄影程式產生的 .webm 檔案。',
        },
        {
          title: '輸出已鎖定為 MP4',
          description: '此工具已預設為 MP4，不需要任何設定。',
        },
        {
          title: '轉換',
          description: '我們將 VP8/VP9 轉碼為 H.264 + AAC。',
        },
        {
          title: '下載',
          description: '儲存你的 MP4，在任何地方剪輯或播放。',
        },
      ],
      advancedDetails: [
        'WebM 使用 VP8/VP9 影片，大多數編輯器都無法匯入；MP4/H.264 則能順利匯入每一款非線性剪輯軟體（NLE）。',
        '我們強制使用 yuv420p，讓 MP4 能在 Safari 和社群平台上播放。',
        '如果你其實想要更小的網頁檔案，反向的 MP4 轉 WebM 工具會改為產生 VP9 WebM。',
      ],
      whyItMatters: [
        '大多數桌面編輯器無法匯入 WebM，但原生支援 MP4。',
        '有些手機、電視和聊天應用程式拒絕播放 WebM。',
        '對於你以 WebM 格式下載的影片，MP4 是交接時最保險的格式。',
      ],
      useCases: [
        {
          title: '剪輯下載的影片',
          description: '將 .webm 片段以 MP4 匯入 Premiere 或 Resolve。',
        },
        {
          title: '螢幕錄影',
          description: '將 WebM 螢幕錄影轉換為方便分享的 MP4。',
        },
        {
          title: '在較舊的裝置上播放',
          description: '讓 WebM 檔案能在不支援它的電視或手機上播放。',
        },
        {
          title: '通訊應用程式',
          description: '將影片傳送到接受 MP4 但不接受 WebM 的應用程式。',
        },
      ],
      whyMediaManipulator: [
        '伺服器端的 FFmpeg 能可靠地解碼 VP8 和 VP9。',
        '輸出鎖定為經過驗證的 MP4 設定檔。',
      ],
      privacyNote: '你的 WebM 會在我們的伺服器上由 FFmpeg 從 VP8 或 VP9 重新編碼為 H.264 的 MP4。處理工作在我們自己的伺服器上執行，不使用第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的原始檔案不會被更動，結果會是一個新檔案。',
      faq: [
        {
          question: '如何將 WebM 轉換為 MP4？',
          answer: '上傳你的 .webm 檔案並按下轉換。輸出已設定為 MP4。',
        },
        {
          question: '為什麼我的編輯器無法開啟 WebM？',
          answer: '大多數編輯器不支援匯入 VP8/VP9。轉換為 MP4（H.264）即可解決匯入問題。',
        },
        {
          question: '檔案會變大嗎？',
          answer: '在相同畫質下，MP4/H.264 可能比 VP9 WebM 稍大。如果在意檔案大小，請選擇較低的品質預設組。',
        },
        {
          question: '會保留音訊嗎？',
          answer: '會。Vorbis/Opus 音訊會重新編碼為 AAC，並保持同步。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '輸出已鎖定為 MP4（H.264 + AAC、yuv420p、+faststart）。',
        ],
      },
      related: [
        {
          label: '影片轉換器',
          to: '/tools/video-converter',
          description: '將任何影片轉換為 MP4。',
        },
        {
          label: '將 MP4 轉換為 WebM',
          to: '/tools/convert-mp4-to-webm',
          description: '反向操作：製作小巧的 VP9 WebM。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '縮小 MP4，方便分享。',
        },
      ],
      embed: {
        title: '將 WebM 轉換為 MP4',
        description: '上傳你的 .webm 檔案。此工具的輸出已鎖定為 MP4（H.264 + AAC），只要上傳並轉換即可。',
      },
    },
    'convert-avi-to-mp4': {
      name: '將 AVI 轉換為 MP4',
      h1: '線上免費將 AVI 轉換為 MP4',
      tagline: '把老舊的 .avi 影片升級成小巧的 MP4，在每支手機、瀏覽器和電視上都能播放。',
      metaTitle: '線上免費將 AVI 轉換為 MP4 | Media Manipulator',
      metaDescription: '免費線上 AVI 轉 MP4 工具。將老舊的 .avi（Xvid/DivX）影片轉換為隨處都能播放的 MP4（H.264 + AAC）。無浮水印，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 AVI 轉換為 MP4',
      ogDescription: '將舊式 .avi 影片轉換為現代、小巧的 MP4，可在任何裝置上播放。',
      intro: 'AVI 是 DivX/Xvid 時代的經典 Windows 容器格式。這類檔案通常很大，而且使用的編解碼器在現代手機、瀏覽器和電視上已無法播放。將 AVI 轉換為 MP4 會把影片重新編碼為高效率的 H.264、把音訊重新編碼為 AAC，產生更小的檔案，能在你現在擁有的任何裝置上播放。',
      whatItDoes: [
        '將舊式 .avi（Xvid、DivX、MJPEG 等）轉換為 MP4。',
        '將輸出鎖定為 MP4（H.264 + AAC），以便在現代裝置上播放。',
        '產生的檔案通常明顯比 AVI 原始檔小。',
        '舊的 AVI 可以在轉換的同時剪短並縮放。',
      ],
      flowSteps: [
        {
          title: '上傳你的 AVI',
          description: '放入來自封存資料或相機的舊 .avi 檔案。',
        },
        {
          title: '輸出已鎖定為 MP4',
          description: '已預設為 MP4，不需要任何設定。',
        },
        {
          title: '轉換',
          description: '我們重新編碼為 H.264 + AAC。',
        },
        {
          title: '下載',
          description: '儲存更小、更現代的 MP4。',
        },
      ],
      advancedDetails: [
        'AVI 常使用 Xvid/DivX（MPEG-4 Part 2）；H.264 的效率大約是它的兩倍，所以 MP4 通常會小得多。',
        '我們強制使用 yuv420p，讓結果能在瀏覽器和社群平台上播放。',
        '交錯掃描的 AVI 擷取檔可以善用完整影片轉換器中的去交錯選項。',
      ],
      whyItMatters: [
        'AVI 檔案很大，在現代裝置上也越來越無法播放。',
        'MP4/H.264 更小，而且隨處都能播放。',
        '將舊的封存影片轉換為 MP4，可確保它們在未來仍能使用。',
      ],
      useCases: [
        {
          title: '舊影片封存',
          description: '將攝錄影機錄製或從 DVD 擷取的 AVI 升級為 MP4。',
        },
        {
          title: '釋放空間',
          description: '將大型 AVI 縮小為較小的 MP4。',
        },
        {
          title: '手機與電視播放',
          description: '讓 AVI 能在已不再支援 AVI 的裝置上播放。',
        },
        {
          title: '上傳到網路',
          description: '把 AVI 變成網站會接受的 MP4。',
        },
      ],
      whyMediaManipulator: [
        '伺服器端的 FFmpeg 能解碼其他工具處理不了的舊 AVI 編解碼器。',
        '輸出鎖定為經過驗證的 MP4 設定檔。',
      ],
      privacyNote: '你的 AVI 會在我們的伺服器上由 FFmpeg 重新編碼為現代的 H.264 MP4。處理工作在我們自己的伺服器上執行，不使用第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的原始檔案不會被更動，結果會是一個新檔案。',
      faq: [
        {
          question: '如何將 AVI 轉換為 MP4？',
          answer: '上傳你的 .avi 檔案並按下轉換。輸出已設定為 MP4。',
        },
        {
          question: 'MP4 會比 AVI 小嗎？',
          answer: '通常會。H.264 的效率遠高於大多數 AVI 使用的 Xvid/DivX 編解碼器。',
        },
        {
          question: '支援舊的 DivX/Xvid AVI 嗎？',
          answer: '支援。FFmpeg 能解碼常見的 AVI 編解碼器，並將其重新編碼為 H.264。',
        },
        {
          question: '我會損失畫質嗎？',
          answer: '重新編碼是有損的，但在「高」品質下差異極小，而且檔案仍然更小。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '輸出已鎖定為 MP4（H.264 + AAC、yuv420p、+faststart）。',
        ],
      },
      related: [
        {
          label: '影片轉換器',
          to: '/tools/video-converter',
          description: '將任何影片轉換為 MP4。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '進一步縮小 MP4。',
        },
        {
          label: '影片轉換器教學',
          to: '/tutorials/video/getting-started',
          description: '逐步了解裁剪、調整尺寸和去交錯。',
        },
      ],
      embed: {
        title: '將 AVI 轉換為 MP4',
        description: '上傳你的 .avi 檔案。此工具的輸出已鎖定為 MP4（H.264 + AAC），只要上傳並轉換即可。',
      },
    },
    'convert-mkv-to-mp4': {
      name: '將 MKV 轉換為 MP4',
      h1: '線上免費將 MKV 轉換為 MP4',
      tagline: '把 Matroska .mkv 檔案變成 MP4，在不支援 MKV 的裝置上也能串流、上傳和播放。',
      metaTitle: '線上免費將 MKV 轉換為 MP4 | Media Manipulator',
      metaDescription: '免費線上 MKV 轉 MP4 工具。將 Matroska .mkv 影片轉換為 MP4（H.264 + AAC），供無法播放 MKV 的裝置和網站使用。無浮水印，無需註冊。',
      ogTitle: '線上免費將 MKV 轉換為 MP4',
      ogDescription: '將 Matroska .mkv 影片轉換為隨處都能播放和上傳的通用 MP4。',
      intro: 'MKV（Matroska）是一種靈活的容器格式，常用於高畫質影片，但許多手機、瀏覽器、智慧電視和上傳表單都無法播放它。將 MKV 轉換為 MP4 會把影片放進這些裝置能理解的容器中。Media Manipulator 會重新編碼為 H.264 + AAC，讓結果能順利播放和上傳。',
      whatItDoes: [
        '將 Matroska .mkv 檔案轉換為 MP4。',
        '將輸出鎖定為 MP4（H.264 + AAC），支援廣泛的裝置。',
        '加入 yuv420p 和 +faststart，讓 MP4 能串流播放並立即開始。',
        '在寫入 MP4 之前，先裁剪 MKV 劇集或變更其尺寸。',
      ],
      flowSteps: [
        {
          title: '上傳你的 MKV',
          description: '放入 .mkv 檔案。',
        },
        {
          title: '輸出已鎖定為 MP4',
          description: '此工具已預設為 MP4。',
        },
        {
          title: '轉換',
          description: '我們將影片搬移或轉碼為 MP4。',
        },
        {
          title: '下載',
          description: '儲存隨處都能播放的 MP4。',
        },
      ],
      advancedDetails: [
        '如果 MKV 本身已包含 H.264 + AAC，轉換速度快，在視覺上也是無損的。',
        '我們強制使用 yuv420p，讓 MP4 能在 Safari 和社群平台上播放。',
        'MKV 可以容納許多字幕軌和音軌；轉換器會保留主要影片和第一條音軌。',
      ],
      whyItMatters: [
        '許多裝置和網站根本不支援 MKV。',
        'MP4 是分享和上傳時最保險的容器。',
        '轉換能讓你的高畫質影片在任何地方都能使用。',
      ],
      useCases: [
        {
          title: '手機與電視播放',
          description: '讓 MKV 在拒絕它的裝置上也能播放。',
        },
        {
          title: '上傳到網路',
          description: '把 MKV 變成網站會接受的 MP4。',
        },
        {
          title: '交給編輯器',
          description: '將 MP4 匯入難以處理 MKV 的編輯器。',
        },
        {
          title: '統一影片庫',
          description: '讓下載的 MKV 與你的 MP4 收藏保持一致。',
        },
      ],
      whyMediaManipulator: [
        '伺服器端的 FFmpeg 能處理含有多條軌道的 MKV。',
        '輸出鎖定為經過驗證的 MP4 設定檔。',
      ],
      privacyNote: '你的 MKV 會在我們的伺服器上由 FFmpeg 重新編碼為手機和瀏覽器都能播放的 MP4。處理工作在我們自己的伺服器上執行，不使用第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的原始檔案不會被更動，結果會是一個新檔案。',
      faq: [
        {
          question: '如何將 MKV 轉換為 MP4？',
          answer: '上傳你的 .mkv 檔案並按下轉換。輸出已設定為 MP4。',
        },
        {
          question: '將 MKV 轉換為 MP4 會損失畫質嗎？',
          answer: '如果 MKV 已使用 H.264，在「高」品質下，結果在視覺上是無損的。否則就是一般的有損重新編碼。',
        },
        {
          question: '額外的音軌或字幕軌會怎麼樣？',
          answer: '轉換器會保留主要影片和第一條音軌。如果你需要多條軌道，請與我們聯絡，我們可以研究軌道選擇功能。',
        },
        {
          question: '為什麼我的 MKV 無法播放？',
          answer: '即使內部的編解碼器很常見，許多手機、電視、瀏覽器和網站仍不支援 MKV 容器。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '輸出已鎖定為 MP4（H.264 + AAC、yuv420p、+faststart）。會保留主要影片和第一條音軌。',
        ],
      },
      related: [
        {
          label: '影片轉換器',
          to: '/tools/video-converter',
          description: '將任何影片轉換為 MP4。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '縮小 MP4，方便分享。',
        },
        {
          label: '影片轉換器教學',
          to: '/tutorials/video/getting-started',
          description: '逐一了解每個選項。',
        },
      ],
      embed: {
        title: '將 MKV 轉換為 MP4',
        description: '上傳你的 .mkv 檔案。此工具的輸出已鎖定為 MP4（H.264 + AAC），只要上傳並轉換即可。',
      },
    },
    'convert-mp4-to-webm': {
      name: '將 MP4 轉換為 WebM',
      h1: '線上免費將 MP4 轉換為 WebM',
      tagline: '把 MP4 重新編碼為更小的開放式 VP9 WebM，非常適合載入快速的網頁影片。',
      metaTitle: '線上免費將 MP4 轉換為 WebM | Media Manipulator',
      metaDescription: '免費線上 MP4 轉 WebM 工具。將 MP4 重新編碼為 VP9 + Opus 的 WebM，打造更小、更快的網頁影片。無浮水印，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費將 MP4 轉換為 WebM',
      ogDescription: '將 MP4 轉換為更小的開放式 VP9 WebM，非常適合內嵌在現代網頁中。',
      intro: 'WebM 是專為網路打造的開放式影片格式。搭配 VP9 影片和 Opus 音訊，它在相同畫質下能提供比 MP4 更小的檔案，也就是說內嵌影片的網頁能載入得更快。當你能掌控播放器時，將 MP4 轉換為 WebM 是正確的選擇：現代瀏覽器都原生支援它。',
      whatItDoes: [
        '將 MP4（H.264）轉換為 WebM（VP9 + Opus）。',
        '將輸出鎖定為 WebM，讓開放網路上的內嵌保持一致。',
        '在相同的視覺畫質下，通常會產生比 MP4 更小的檔案。',
        '在製作 WebM 之前，先剪短或縮小片段，並選擇品質預設組。',
      ],
      flowSteps: [
        {
          title: '上傳你的 MP4',
          description: '放入 .mp4 檔案。',
        },
        {
          title: '輸出已鎖定為 WebM',
          description: '此工具已預設為 WebM（VP9 + Opus）。',
        },
        {
          title: '轉換',
          description: '我們將 H.264 重新編碼為 VP9，將 AAC 重新編碼為 Opus。',
        },
        {
          title: '下載',
          description: '儲存更小的 .webm，用於網路。',
        },
      ],
      advancedDetails: [
        'WebM 輸出在可用時使用 VP9 影片搭配 Opus 音訊；在不支援 VP9/Opus 的 FFmpeg 版本上，則退回使用 VP8 + Vorbis。',
        'VP9 編碼比 H.264 慢，但在相近畫質下，檔案可縮小約 25-50%。',
        '使用 <video> 標籤同時提供 WebM 和 MP4 來源，讓瀏覽器挑選它支援的最佳來源。',
      ],
      whyItMatters: [
        '更小的網頁影片意味著更快的網頁和更低的頻寬費用。',
        'WebM 免權利金，而且所有現代瀏覽器都支援。',
        'WebM + MP4 的組合幾乎涵蓋所有瀏覽器，檔案也盡可能小。',
      ],
      useCases: [
        {
          title: '網站主視覺影片',
          description: '提供小巧、載入快速的背景或主視覺片段。',
        },
        {
          title: '開放網路內嵌',
          description: '內嵌影片，不必擔心專有編解碼器的問題。',
        },
        {
          title: '節省頻寬',
          description: '為高流量網頁減少傳輸大小。',
        },
        {
          title: 'HTML5 <video>',
          description: '提供 WebM 來源，並搭配 MP4 作為備援。',
        },
      ],
      whyMediaManipulator: [
        'VP9 + Opus 編碼，並可自動退回使用 VP8 + Vorbis。',
        '輸出鎖定為 WebM，結果可預期。',
      ],
      privacyNote: '你的影片會在我們的伺服器上由 FFmpeg 重新編碼為 VP9 WebM。處理工作在我們自己的伺服器上執行，不使用第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的原始檔案不會被更動，結果會是一個新檔案。',
      faq: [
        {
          question: '如何將 MP4 轉換為 WebM？',
          answer: '上傳你的 .mp4 檔案並按下轉換。輸出已設定為 WebM。',
        },
        {
          question: 'WebM 比 MP4 小嗎？',
          answer: '在相同的視覺畫質下，VP9 WebM 通常比 H.264 MP4 小 25-50%。',
        },
        {
          question: '所有瀏覽器都支援 WebM 嗎？',
          answer: '所有現代瀏覽器都支援。對於較舊的瀏覽器，請在你的 <video> 標籤中提供 MP4 備援。',
        },
        {
          question: '為什麼 WebM 編碼比較慢？',
          answer: 'VP9 的運算量比 H.264 更大。換來的好處是更小的檔案。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '輸出已鎖定為 WebM（VP9 + Opus；若無法使用 VP9/Opus，則為 VP8 + Vorbis）。',
        ],
      },
      related: [
        {
          label: '將 WebM 轉換為 MP4',
          to: '/tools/convert-webm-to-mp4',
          description: '反向轉換。',
        },
        {
          label: '影片轉換器',
          to: '/tools/video-converter',
          description: '將任何影片轉換為 MP4。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '縮小影片，不變更容器。',
        },
      ],
      embed: {
        title: '將 MP4 轉換為 WebM',
        description: '上傳你的 .mp4 檔案。此工具的輸出已鎖定為 WebM（VP9 + Opus），只要上傳並轉換即可。',
      },
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
      h1: '線上免費裁切影片',
      tagline: '裁掉影片的邊緣，不需要剪輯軟體就能改變構圖或長寬比。',
      metaTitle: '線上免費裁切影片 | Media Manipulator',
      metaDescription: '免費線上影片裁切工具。裁掉影片的邊緣，以重新構圖或改變長寬比。輸出 MP4，無浮水印，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費裁切影片',
      ogDescription: '裁掉影片的邊緣，以重新構圖或改變長寬比。免費，無浮水印。',
      intro: '裁切會移除影片的外側邊緣，適合用來重新構圖、去除黑邊或浮水印，或是為了某個平台改變長寬比。Media Manipulator 影片裁切工具會使用一個像素矩形（從哪裡開始、範圍多大），並只將該區域匯出為乾淨的 MP4。',
      whatItDoes: [
        '將影片裁切為你以像素指定的矩形。',
        '移除黑邊、邊緣、浮水印或不需要的區域。',
        '協助重新構圖為正方形或直式，以用於社群平台。',
        '預設匯出 MP4（H.264 + AAC）。',
      ],
      flowSteps: [
        {
          title: '上傳你的影片',
          description: '要裁切的 MP4、MOV、MKV、WebM、AVI 或 M4V。',
        },
        {
          title: '輸入裁切矩形',
          description: '設定要保留區域的 X/Y 位移與寬度／高度。',
        },
        {
          title: '裁切',
          description: 'FFmpeg 會精確地裁切到該區域並重新編碼。',
        },
        {
          title: '下載',
          description: '儲存裁切後的影片。',
        },
      ],
      advancedDetails: [
        '裁切座標以左上角為原點、以像素為單位：X/Y 是保留區域的起點，寬度／高度是它的大小。',
        '裁切會重新編碼影片；MP4 輸出使用 H.264 + AAC + yuv420p + faststart。',
        '如果要在預覽上進行像素級精準的構圖，首頁上的完整轉換器提供視覺化的裁切疊加層。',
      ],
      whyItMatters: [
        '裁切能重新構圖，不必重新拍攝。',
        '它能移除黑邊（上下黑邊／左右黑邊）和不需要的邊緣。',
        '改變長寬比（例如改為 9:16）有助於讓影片符合平台的要求。',
      ],
      useCases: [
        {
          title: '改成直式',
          description: '將橫式片段裁切為 9:16，用於 Reels／Shorts／TikTok。',
        },
        {
          title: '移除黑邊',
          description: '裁掉上下黑邊。',
        },
        {
          title: '隱藏浮水印',
          description: '裁掉角落的標誌或時間戳記。',
        },
        {
          title: '重新為主體構圖',
          description: '把畫面收緊在重要的內容上。',
        },
      ],
      whyMediaManipulator: [
        '在伺服器端以 FFmpeg 進行精確的像素裁切。',
        '乾淨的 MP4 輸出，無浮水印。',
      ],
      privacyNote: '你的影片會在我們的伺服器上裁切為你繪製的矩形，並由 FFmpeg 重新編碼。處理工作在我們自己的伺服器上執行，不使用第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的原始檔案不會被更動，結果會是一個新檔案。',
      faq: [
        {
          question: '如何裁切影片？',
          answer: '上傳影片，輸入要保留的矩形（以像素為單位的 X/Y 位移與寬度／高度），然後下載裁切後的影片。',
        },
        {
          question: '可以裁切成正方形或直式長寬比嗎？',
          answer: '可以。將寬度和高度設定為你想要的比例（例如正方形就設為相同的值，9:16 則讓高度大於寬度）。',
        },
        {
          question: '裁切會降低畫質嗎？',
          answer: '裁切會重新編碼，但在我們的預設品質下，損失極小。',
        },
        {
          question: '可以裁掉浮水印嗎？',
          answer: '可以，前提是浮水印靠近邊緣：裁切畫面，將它排除在外。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '裁切會重新編碼；MP4 輸出使用 H.264 + AAC + yuv420p + faststart。',
        ],
      },
      related: [
        {
          label: '調整影片尺寸',
          to: '/tools/resize-video',
          description: '改變解析度，而不是裁切。',
        },
        {
          label: '旋轉影片',
          to: '/tools/rotate-video',
          description: '修正橫躺或上下顛倒的影片。',
        },
        {
          label: '影片轉換器',
          to: '/tools/video-converter',
          description: '在影片格式之間轉換。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '縮小裁切後的影片。',
        },
      ],
      embed: {
        title: '裁切影片',
        description: '上傳影片並輸入要保留的矩形（以像素為單位的位移 + 寬度／高度）。我們會精確地裁切到該區域並匯出 MP4。',
      },
    },
    'resize-video': {
      name: '調整影片尺寸',
      h1: '線上免費調整影片尺寸',
      tagline: '變更影片解析度，可縮放為 1080p、720p、480p，或任意自訂的寬度與高度。',
      metaTitle: '線上免費調整影片尺寸 | Media Manipulator',
      metaDescription: '免費線上影片尺寸調整工具。將影片解析度變更為 1080p、720p、480p 或自訂尺寸。輸出 MP4，無浮水印，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費調整影片尺寸',
      ogDescription: '將影片解析度變更為 1080p、720p、480p 或自訂尺寸。免費，無浮水印。',
      intro: '調整尺寸會改變影片的解析度：把 4K 片段變成 1080p、縮小到 720p 用於網路，或符合平台要求的精確像素尺寸。Media Manipulator 影片尺寸調整工具會將你的影片縮放到你選擇的尺寸，預設保持長寬比，並匯出乾淨的 MP4。',
      whatItDoes: [
        '將影片縮放到目標寬度和／或高度。',
        '預設保持長寬比（留空其中一個尺寸即可自動縮放）。',
        '縮小以減少檔案大小，或放大以符合目標尺寸。',
        '預設匯出 MP4（H.264 + AAC）。',
      ],
      flowSteps: [
        {
          title: '上傳你的影片',
          description: '選擇你想改變尺寸的片段。',
        },
        {
          title: '設定尺寸',
          description: '以像素為單位輸入寬度和／或高度。',
        },
        {
          title: '調整尺寸',
          description: 'FFmpeg 會縮放影片並重新編碼。',
        },
        {
          title: '下載',
          description: '儲存調整尺寸後的影片。',
        },
      ],
      advancedDetails: [
        '留空其中一個尺寸，即可等比例縮放並保持原始長寬比。',
        '同時設定兩個尺寸時，保持開啟「保持長寬比」，讓影片在方框內縮放而不變形。',
        '調整尺寸會重新編碼；MP4 輸出使用 H.264 + AAC + yuv420p + faststart。每邊最大 4096 px。',
      ],
      whyItMatters: [
        '較低的解析度意味著較小的檔案和較快的上傳。',
        '有些平台要求精確的解析度。',
        '調整尺寸能統一解析度不一的影片庫。',
      ],
      useCases: [
        {
          title: '為網路縮小',
          description: '將 4K 降到 1080p 或 720p，讓網頁更快。',
        },
        {
          title: '符合目標尺寸',
          description: '精確符合平台規格。',
        },
        {
          title: '減少檔案大小',
          description: '降低解析度以減少位元組數。',
        },
        {
          title: '統一素材',
          description: '讓片段統一為同一種解析度。',
        },
      ],
      whyMediaManipulator: [
        '在伺服器端以 FFmpeg 進行顧及長寬比的縮放。',
        '乾淨的 MP4 輸出，無浮水印。',
      ],
      privacyNote: '你的影片會在我們的伺服器上縮放為你設定的寬度和高度，並由 FFmpeg 重新編碼。處理工作在我們自己的伺服器上執行，不使用第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的原始檔案不會被更動，結果會是一個新檔案。',
      faq: [
        {
          question: '如何調整影片尺寸？',
          answer: '上傳影片，設定目標寬度和／或高度，然後下載調整尺寸後的影片。',
        },
        {
          question: '如何將解析度改為 720p？',
          answer: '將高度設為 720，並將寬度留空以等比例縮放。',
        },
        {
          question: '調整尺寸會保持長寬比嗎？',
          answer: '會。留空其中一個尺寸，或保持開啟「保持長寬比」，影片就不會被拉伸變形。',
        },
        {
          question: '可以放大影片嗎？',
          answer: '你可以放大到更大的尺寸，但放大無法增加拍攝時沒有捕捉到的細節。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '調整尺寸會重新編碼；MP4 輸出使用 H.264 + AAC + yuv420p + faststart。每邊最大 4096 px。',
        ],
      },
      related: [
        {
          label: '裁切影片',
          to: '/tools/crop-video',
          description: '裁掉邊緣，而不是縮放。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '使用預設組縮小檔案。',
        },
        {
          label: '影片轉換器',
          to: '/tools/video-converter',
          description: '轉換為 MP4。',
        },
        {
          label: '旋轉影片',
          to: '/tools/rotate-video',
          description: '修正方向。',
        },
      ],
      embed: {
        title: '調整影片尺寸',
        description: '上傳影片並設定目標寬度和／或高度。留空其中一項即可等比例縮放。預設輸出為 MP4。',
      },
    },
    'rotate-video': {
      name: '旋轉影片',
      h1: '線上免費旋轉影片',
      tagline: '修正橫躺或上下顛倒的影片，一鍵旋轉 90°、180° 或 270°，並可翻轉。',
      metaTitle: '線上免費旋轉影片 | Media Manipulator',
      metaDescription: '免費線上影片旋轉工具。將影片旋轉 90°、180° 或 270°，修正橫躺或上下顛倒的片段。輸出 MP4，無浮水印，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費旋轉影片',
      ogDescription: '將影片旋轉 90°、180° 或 270°，修正橫躺或上下顛倒的畫面。免費，無浮水印。',
      intro: '手機拍的影片常常是橫躺的，有些片段甚至上下顛倒。Media Manipulator 的影片旋轉工具能徹底修正方向：選擇 90°、180° 或 270°，我們就會旋轉實際的影格（旋轉 90°/270° 時會對調寬度與高度），讓影片在每一種播放器上都以正確方向播放，而不只是在會讀取旋轉標記的播放器上。',
      whatItDoes: [
        '將影片順時針旋轉 90°、180° 或 270°（即逆時針 90°）。',
        '可選擇將影片水平或垂直翻轉（鏡像）。',
        '重新編碼，讓旋轉直接寫入影格，而不只是一個中繼資料標記。',
        '預設匯出 MP4（H.264 + AAC）。',
      ],
      flowSteps: [
        {
          title: '上傳你的影片',
          description: '例如一段橫躺的手機片段。',
        },
        {
          title: '選擇旋轉角度',
          description: '90°、180° 或 270°，需要時也可以翻轉。',
        },
        {
          title: '旋轉',
          description: 'FFmpeg 旋轉影格（transpose）並重新編碼。',
        },
        {
          title: '下載',
          description: '儲存方向正確的影片。',
        },
      ],
      advancedDetails: [
        '旋轉 90°/270° 時我們使用 FFmpeg 的 transpose（會正確對調寬度與高度），旋轉 180° 時則使用兩次 transpose。',
        '把旋轉寫入像素，就能修正那些忽略容器旋轉標記的播放器。',
        '旋轉需要重新編碼；MP4 輸出使用 H.264 + AAC + yuv420p + faststart。',
      ],
      whyItMatters: [
        '橫躺的手機影片是最常見的影片困擾之一。',
        '寫入影格的旋轉在任何地方都能正確播放，旋轉標記則不然。',
        '翻轉可以修正鏡像的自拍／網路攝影機畫面。',
      ],
      useCases: [
        {
          title: '修正橫躺的片段',
          description: '旋轉直式手機影片，讓它正向播放。',
        },
        {
          title: '翻轉自拍影片',
          description: '取消網路攝影機或前鏡頭畫面的鏡像。',
        },
        {
          title: '旋轉 180°',
          description: '修正上下顛倒的錄影。',
        },
        {
          title: '為剪輯調整方向',
          description: '在匯入之前先把方向調正。',
        },
      ],
      whyMediaManipulator: [
        '真正旋轉影格（transpose），而不只是設定中繼資料標記。',
        '在同一個專注的面板中完成旋轉與翻轉。',
      ],
      privacyNote: '你的影片會依你選擇的角度旋轉，並由我們伺服器上的 FFmpeg 重新編碼。處理在我們自己的伺服器上執行，而不是第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的來源檔案保持不變，結果是一個新檔案。',
      faq: [
        {
          question: '如何旋轉影片？',
          answer: '上傳影片，選擇 90°、180° 或 270°，然後下載旋轉後的影片。',
        },
        {
          question: '如何修正橫躺的手機影片？',
          answer: '順時針或逆時針旋轉 90°，直到影片正向播放；旋轉會直接寫入影格。',
        },
        {
          question: '它真的會旋轉影格，還是只設定一個標記？',
          answer: '它會旋轉實際的影格（FFmpeg transpose），所以影片在每一種播放器中都是正向的。',
        },
        {
          question: '我也可以翻轉／鏡像影片嗎？',
          answer: '可以，內建水平與垂直翻轉選項。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '旋轉透過 FFmpeg transpose 重新編碼；MP4 輸出使用 H.264 + AAC + yuv420p + faststart。',
        ],
      },
      related: [
        {
          label: '裁切影片',
          to: '/tools/crop-video',
          description: '裁掉邊緣。',
        },
        {
          label: '調整影片尺寸',
          to: '/tools/resize-video',
          description: '變更解析度。',
        },
        {
          label: '影片轉換器',
          to: '/tools/video-converter',
          description: '在不同影片格式之間轉換。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '縮小旋轉後的影片。',
        },
      ],
      embed: {
        title: '旋轉影片',
        description: '上傳影片並選擇旋轉角度（90°、180° 或 270°）。你也可以翻轉影片。我們會旋轉實際的影格並匯出 MP4。',
      },
    },
    'remove-audio-from-video': {
      name: '移除影片中的音訊',
      h1: '線上免費移除影片中的音訊',
      tagline: '讓影片徹底靜音：移除音軌，下載沒有聲音、只有畫面的檔案。',
      metaTitle: '線上免費移除影片中的音訊 | Media Manipulator',
      metaDescription: '免費線上工具，可移除影片中的音訊。去除聲音並下載無聲、只有畫面的 MP4。無浮水印，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ogTitle: '線上免費移除影片中的音訊',
      ogDescription: '去除影片的音軌，下載無聲、只有畫面的檔案。免費，無浮水印。',
      intro: '移除影片中的音訊後，你會得到一個無聲、只有畫面的檔案，很適合用來消除背景雜音、在重新上傳前拿掉受著作權保護的音樂，或準備一段之後要配上新音訊的片段。Media Manipulator 會去除音軌並傳回影片，並盡可能直接複製畫面串流，因此不會損失畫質。',
      whatItDoes: [
        '移除（靜音）音軌，並傳回只有畫面的檔案。',
        '盡可能直接複製影片串流：不重新編碼，不損失畫質。',
        '當容器格式或編解碼器有需要時，改為重新編碼。',
        '預設輸出 MP4（也提供 WebM）。',
      ],
      flowSteps: [
        {
          title: '上傳你的影片',
          description: '想去掉聲音的那段片段。',
        },
        {
          title: '選擇輸出格式',
          description: 'MP4（預設）或 WebM。',
        },
        {
          title: '移除音訊',
          description: 'FFmpeg 捨棄音訊並保留影片。',
        },
        {
          title: '下載',
          description: '儲存無聲、只有畫面的檔案。',
        },
      ],
      advancedDetails: [
        '我們直接複製影片串流（`-c:v copy -an`），所以畫面完全不受影響；如果容器格式不接受來源編解碼器，我們會重新編碼為 H.264。',
        '輸出完全沒有音軌：它是無聲的，而不只是把音量調到零。',
        '下載的檔名會加上 `_silent` 後綴，方便你和原始檔案區分。',
      ],
      whyItMatters: [
        '靜音能徹底去除背景雜音、交談聲或風聲。',
        '拿掉受著作權保護的音樂，可避免重新上傳後被下架。',
        '無聲的基底片段是加入新音訊或旁白的起點。',
      ],
      useCases: [
        {
          title: '消除背景雜音',
          description: '移除片段中不想要的聲音。',
        },
        {
          title: '拿掉受著作權保護的音訊',
          description: '在重新發布前去除音樂。',
        },
        {
          title: '為新音訊做準備',
          description: '取得可加入旁白的無聲基底。',
        },
        {
          title: '隱私',
          description: '移除背景中錄到的對話。',
        },
      ],
      whyMediaManipulator: [
        '直接複製影片串流，保留畫質。',
        '真正無聲的輸出（移除音軌，而不只是調低音量）。',
      ],
      privacyNote: '你影片的音軌會由我們伺服器上的 FFmpeg 捨棄，畫面則予以保留。處理在我們自己的伺服器上執行，而不是第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的來源檔案保持不變，結果是一個新檔案。',
      faq: [
        {
          question: '如何移除影片中的音訊？',
          answer: '上傳影片，選擇輸出格式，然後下載無聲、只有畫面的檔案。',
        },
        {
          question: '這是把影片靜音，還是移除音軌？',
          answer: '它會完全移除音軌，所以結果是真正無聲，而不是把音量調到零。',
        },
        {
          question: '影片畫質會改變嗎？',
          answer: '不會。我們會盡可能直接複製影片串流，所以畫面完全不受影響。',
        },
        {
          question: '為什麼檔名有「_silent」？',
          answer: '我們會加上 _silent 後綴，方便你區分沒有音訊的副本和原始檔案。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '盡可能直接複製影片；音軌會被完全移除。下載檔名後綴：_silent。',
        ],
      },
      related: [
        {
          label: '移除音訊（純影像）',
          to: '/tools/extract-video-only-from-video',
          description: '同樣的無聲影片工具。',
        },
        {
          label: '從影片擷取音訊',
          to: '/tools/extract-audio-from-video',
          description: '保存音訊，而不是移除它。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '縮小無聲影片。',
        },
        {
          label: '為影片加入音訊',
          to: '/tools/stitch-audio-to-video',
          description: '為無聲片段加上新的配樂。',
        },
      ],
      embed: {
        title: '移除影片中的音訊',
        description: '上傳影片，我們會去除音軌，傳回無聲、只有畫面的檔案。預設輸出 MP4。我們會盡可能直接複製影片（不損失畫質）。',
      },
    },
    'audio-converter': {
      name: '音訊轉換器',
      h1: '免費線上音訊轉換器',
      tagline: '在 MP3、WAV、M4A、OGG、FLAC、OPUS 等格式之間轉換，並可完整控制位元率、取樣率和聲道。',
      metaTitle: '免費線上音訊轉換器 | Media Manipulator',
      metaDescription: '免費線上音訊轉換器，支援 MP3、WAV、M4A、OGG、FLAC、OPUS 等格式。可選擇位元率、取樣率和聲道。',
      ogTitle: '免費線上音訊轉換器',
      ogDescription: '轉換 WAV、MP3、M4A、OGG、FLAC、OPUS 等格式。可選擇位元率、取樣率和聲道。',
      intro: '不同的裝置、Podcast 平台和音訊編輯器需要不同的格式。Media Manipulator 在同一個地方處理所有常見的音訊格式，並可精細控制位元率、取樣率和聲道配置。',
      whatItDoes: [
        '在 MP3、WAV、M4A/AAC、OGG、FLAC、ALAC、OPUS、AC3、DTS 之間轉換。',
        '選擇位元率、取樣率和聲道配置。',
        '在同一次上傳中裁剪，並套用等化器、降噪或 AI 清理。',
        '輸出有效的檔案，並在適用時加上 ID3 標籤。',
      ],
      flowSteps: [
        {
          title: '上傳音訊',
          description: 'MP3、WAV、M4A、FLAC、OGG 等。',
        },
        {
          title: '選擇輸出格式',
          description: 'MP3、WAV、FLAC、M4A、OGG、OPUS。',
        },
        {
          title: '調整位元率與取樣率',
          description: '裁剪或執行 AI 清理。',
        },
        {
          title: '下載',
          description: '儲存轉換後的音訊。',
        },
      ],
      advancedDetails: [
        'MP3 是通用的壓縮格式，每種裝置都能播放。',
        'FLAC 和 ALAC 是無損格式：比 MP3 大，但比 WAV 小。',
        'OPUS（封裝於 OGG）是體積最小的新式有損格式，適用於語音和音樂；當你能掌控播放器時是絕佳選擇。',
      ],
      whyItMatters: [
        'Podcast 平台、音樂服務和音訊編輯器各自偏好不同的格式。',
        '檔案越小，佔用的儲存空間越少，傳送也越快。',
        '當音訊之後還要重新編輯時，無損格式至關重要。',
      ],
      useCases: [
        {
          title: 'Podcast 發布',
          description: 'WAV 母帶 → MP3 單集。',
        },
        {
          title: '分享語音備忘錄',
          description: '裁剪並壓縮成 MP3。',
        },
        {
          title: '音樂典藏',
          description: '轉換 MP3 → FLAC（音質不會因此提升），或 WAV → FLAC，以無損方式保存。',
        },
        {
          title: '遊戲與應用程式素材',
          description: '將 WAV → OPUS，製作極小的行動裝置素材。',
        },
      ],
      whyMediaManipulator: [
        '完整控制位元率、取樣率和聲道。',
        '同一次上傳即可使用 AI 清理工具（降噪、分離人聲、去除人聲）。',
        '免費，無需註冊，無浮水印。',
      ],
      privacyNote: '你的音訊會由我們伺服器上的 FFmpeg 解碼，再依你選擇的格式和位元率重新編碼。過程不涉及任何外部音訊服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你會得到一個新檔案；上傳的檔案本身不會被更改。',
      faq: [
        {
          question: '音樂最適合用什麼格式？',
          answer: '無損保存用 FLAC，分享用 256–320 kbps 的 MP3，想要最小的可串流檔案則用 OPUS。',
        },
        {
          question: '語音最適合用什麼格式？',
          answer: '96–128 kbps 的 MP3 是很好的 Podcast 預設選擇。',
        },
        {
          question: '可以在轉換時裁剪嗎？',
          answer: '可以，在送出前於裁剪區塊設定開始／結束秒數。',
        },
        {
          question: 'FLAC 真的是無損的嗎？',
          answer: '是的。FLAC 壓縮時不會丟棄任何資料，解碼後可得到與輸入逐位元相同的副本。',
        },
      ],
      related: [
        {
          label: '將 WAV 轉換為 MP3',
          to: '/tools/convert-wav-to-mp3',
          description: '專門的 WAV → MP3 轉換器。',
        },
        {
          label: '分離歌曲人聲',
          to: '/tools/isolate-vocals-from-song',
          description: '從音樂音軌中取出人聲。',
        },
        {
          label: '音訊轉換器教學',
          to: '/tutorials/audio/getting-started',
          description: '完整說明每一個選項。',
        },
      ],
      embed: {
        title: '轉換音訊檔案',
        description: '上傳任何音訊檔案並選擇目標格式。192 kbps 的 MP3 是合理的預設值。WAV 是無損格式但檔案很大；M4A/AAC 是適合音樂的壓縮格式。',
      },
    },
    'srt-generator': {
      name: 'SRT 字幕產生器',
      h1: '免費 SRT 字幕產生器',
      tagline: '上傳影片或音訊檔案，產生可下載的 .srt 字幕檔，可用於 YouTube、剪輯軟體和無障礙工具。',
      metaTitle: '免費線上 SRT 字幕產生器：將影片與音訊轉為 SRT | Media Manipulator',
      metaDescription: '從 MP4、MOV、MP3、WAV 等檔案產生 SRT 字幕檔。免費，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。適用於 YouTube、Premiere、DaVinci Resolve。',
      ogTitle: '免費 SRT 字幕產生器：將影片與音訊轉為 SRT',
      ogDescription: '從任何影片或音訊產生準確的 SRT 字幕檔。本地 AI 轉錄，不使用第三方供應商。',
      intro: 'SRT（SubRip）是網路上支援最廣泛的字幕格式：YouTube、Vimeo、Premiere、DaVinci Resolve、Final Cut，以及幾乎所有社群平台都接受它。Media Manipulator 讓你只要上傳一次，就能從任何影片或音訊產生 SRT 檔案。轉錄在我們自己的 GPU 伺服器上以 whisper-ctranslate2 執行，所以音訊絕不會離開我們的基礎架構，也絕不會經過第三方 AI 供應商。',
      whatItDoes: [
        '將任何影片或音訊檔案轉錄為帶時間碼的 .srt 字幕檔。',
        '在我們本地的 GPU 伺服器上使用 whisper-ctranslate2，沒有任何第三方 AI 供應商會看到你的媒體。',
        '產生 SubRip 格式的檔案（HH:MM:SS,mmm 時間戳記、連續的字幕序號），與所有主流影片剪輯軟體和播放器相容。',
        '支援自動偵測語言，也可選填 BCP-47 語言提示，提升短片段的準確度。',
      ],
      flowSteps: [
        {
          title: '上傳你的媒體',
          description: '拖放任何 MP4、MOV、MP3、WAV 或其他支援的檔案。',
        },
        {
          title: '我們擷取音訊',
          description: 'FFmpeg 取出音軌，並轉換成 Whisper 需要的格式。',
        },
        {
          title: 'Whisper 進行轉錄',
          description: '我們的 GPU 伺服器執行 whisper-ctranslate2，產生帶時間的片段。',
        },
        {
          title: '下載 .srt',
          description: '產生乾淨的 SubRip 檔案，字幕序號連續、時間準確。',
        },
      ],
      advancedDetails: [
        'Whisper 使用 ctranslate2 在我們自己的 NVIDIA GPU 伺服器上執行，整個流程中沒有任何外部 API。',
        'SRT 輸出使用以逗號分隔毫秒的時間戳記（00:00:01,234）以及從 1 開始的連續字幕序號，這是剪輯軟體相容性最高的格式。',
        '轉錄流程支援自動偵測語言，也可透過語言欄位傳入 WHISPER_CT2_LANGUAGE 形式的 BCP-47 提示。',
        '輸出經過與應用程式其他部分相同的工作系統；你也可以在轉錄表單中選擇 VTT、純文字或結構化 JSON。',
      ],
      whyItMatters: [
        'YouTube、Vimeo、Premiere、DaVinci Resolve、Final Cut 和大多數社群平台都以 SRT 作為預設字幕格式。',
        '字幕讓聾人與重聽觀眾也能觀看影片，並提升社群平台上的互動，因為那裡大多數影片都是靜音播放。',
        '當你在影片旁一併發布對應的 .srt，搜尋引擎就能為影片的逐字稿內容建立索引。',
      ],
      useCases: [
        {
          title: 'YouTube 創作者',
          description: '產生準確的字幕，並在每支影片上傳為 SRT 字幕軌。',
        },
        {
          title: '課程製作者',
          description: '為講課影片加上逐字稿，方便學生日後搜尋、複習和翻譯。',
        },
        {
          title: '將 Podcast 轉為影片的 Podcaster',
          description: '把 Podcast 單集變成適合社群平台、附字幕的影片片段。',
        },
        {
          title: '行銷／社群團隊',
          description: '為每段片段加上字幕，讓靜音自動播放的觀眾也能接收到訊息。',
        },
      ],
      whyMediaManipulator: [
        'Whisper 在我們自己的 GPU 基礎架構上執行，你的媒體絕不會接觸第三方 AI 供應商。',
        '無需註冊，無浮水印。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
        '與應用程式其他部分使用相同的轉錄引擎，所以 SRT、VTT、純文字和 JSON 輸出的準確度一致。',
      ],
      privacyNote: '你檔案中的語音會由我們自己 GPU 伺服器上的 Whisper 轉錄，並依時間整理成 SRT 字幕檔。AI 處理在我們營運的硬體上執行，絕不使用第三方 AI 供應商，你上傳的任何內容也不會被用來訓練模型。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      faq: [
        {
          question: '什麼是 SRT 檔案？',
          answer: 'SRT（SubRip）是一種包含時間戳記和字幕序號的純文字字幕檔。它是 YouTube、大多數影片剪輯軟體和大多數影片播放器接受的預設字幕格式。',
        },
        {
          question: '可以從 MP4 產生字幕嗎？',
          answer: '可以。上傳任何 MP4（或 MOV、MKV、WebM、AVI、M4V），我們就會產生可下載的 .srt 字幕檔。',
        },
        {
          question: '可以在 YouTube 上使用 SRT 檔案嗎？',
          answer: '可以，YouTube 直接接受 SRT。上傳影片後，在「字幕 → 新增語言 → 上傳檔案」中加入字幕檔。',
        },
        {
          question: '支援哪些語言？',
          answer: 'Whisper 支援數十種語言，並能自動偵測說話的語言。你也可以傳入 BCP-47 提示（例如 en、es、ja），提升極短片段的準確度。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '轉錄在我們本地的 GPU 伺服器上執行，你的檔案絕不會傳送給外部 AI 供應商。',
          '長影片的工作會以非同步方式執行，你可以保持分頁開啟來查看進度。',
        ],
      },
      related: [
        {
          label: '字幕翻譯器',
          to: '/tools/caption-translator',
          description: '將產生的 SRT 翻譯成其他語言。',
        },
        {
          label: '從影片擷取音訊',
          to: '/tools/extract-audio-from-video',
          description: '先取出音訊，再自行手動轉錄。',
        },
        {
          label: '從影片擷取影格',
          to: '/tools/extract-frames-from-video',
          description: '擷取靜態畫面作為縮圖和參考。',
        },
        {
          label: '將影片轉碼為 HLS',
          to: '/tools/transcode-to-hls',
          description: '為串流準備影片。',
        },
        {
          label: '將影片轉碼為 DASH',
          to: '/tools/transcode-to-dash',
          description: 'AV1 / VP9 DASH 封裝。',
        },
      ],
      embed: {
        title: '產生 SRT 字幕檔',
        description: '上傳影片或音訊檔案。我們會在自己的 GPU 伺服器上以 whisper-ctranslate2 轉錄，並傳回可放進任何影片剪輯軟體的 .srt 字幕檔。',
      },
    },
    'caption-translator': {
      name: '字幕翻譯器',
      h1: '免費字幕翻譯器',
      tagline: '翻譯 SRT 和 VTT 字幕檔，同時保留字幕的時間點、順序和結構，不使用第三方 AI 供應商。',
      metaTitle: '免費字幕翻譯器（SRT 與 VTT）：保留時間戳記 | Media Manipulator',
      metaDescription: '線上翻譯 SRT 和 VTT 字幕，並完整保留每個字幕條目的時間點。在我們自己的本地 AI 伺服器上執行，你的字幕絕不會傳送給第三方供應商。',
      ogTitle: '免費字幕翻譯器：SRT 與 VTT',
      ogDescription: '翻譯 SRT 或 VTT 字幕，同時保留時間戳記和字幕順序。本地 AI，不使用第三方供應商。',
      intro: '在不同語言之間翻譯現有的字幕檔，完全不動到字幕時間點。Media Manipulator 會解析你的 .srt 或 .vtt 檔案中的字幕條目，使用我們在本地託管的字幕翻譯模型只翻譯文字，再原封不動地寫回原本的時間戳記。沒有任何第三方翻譯 API 會看到你的字幕：模型在我們自己的 GPU 伺服器上執行。',
      whatItDoes: [
        '接受 .srt 或 .vtt 字幕檔，並產生相同格式的翻譯副本（你也可以選擇輸出為另一種格式）。',
        '完整保留字幕序號、條目順序和時間戳記，只翻譯字幕文字。',
        '在我們本地的 Ollama 模型伺服器上，使用專為字幕調校的自訂模型進行翻譯，你的字幕絕不會離開我們的基礎架構。',
        '支援 30 多種目標語言，包括主要的歐洲、亞洲和中東語言。',
      ],
      flowSteps: [
        {
          title: '上傳 .srt 或 .vtt',
          description: '將現有的字幕檔拖放到上傳區。',
        },
        {
          title: '選擇語言',
          description: '自動偵測或選擇來源語言，再選擇目標語言。',
        },
        {
          title: '我們翻譯字幕文字',
          description: '我們的本地 AI 只翻譯字幕文字，時間戳記和順序保持不變。',
        },
        {
          title: '下載翻譯後的字幕',
          description: '取回乾淨的 .srt 或 .vtt，時間完全相同，每個字幕條目都已翻譯。',
        },
      ],
      advancedDetails: [
        '翻譯在我們自己的 Ollama 伺服器上執行，使用的是以 Translate-Gemma 為基礎、專為字幕調校的衍生模型（mm-captions-translategemma-12b）。',
        '我們只把字幕文字加上嚴格的 JSON 結構描述標頭送給模型，讀取回應時再從原始檔案把時間點套回去，所以即使模型出錯，也無法破壞你的字幕時間點。',
        'VTT 檔案中的 NOTE 和 STYLE 區塊會被保留，絕不會送給翻譯器。',
        '對於很長的字幕軌，我們會分批處理字幕條目，讓模型永遠不會接近其上下文長度上限。',
      ],
      whyItMatters: [
        '手動翻譯字幕很容易出錯：非常容易弄壞時間戳記格式，或不小心打亂字幕條目的順序。',
        '專門打造的字幕翻譯器會保留剪輯軟體和播放器所預期的檔案結構。',
        '以本地模型在內部完成翻譯，讓創作者的工作流程不受第三方翻譯服務的價格與政策左右。',
      ],
      useCases: [
        {
          title: '多語言 YouTube 頻道',
          description: '將一份英文 SRT 母檔翻譯成 5 種以上語言，用於同一支影片。',
        },
        {
          title: '線上課程',
          description: '以母語字幕觸及國際學生。',
        },
        {
          title: '紀錄片／影展',
          description: '在不動到字幕時間點的情況下準備翻譯字幕軌。',
        },
        {
          title: '新聞與新聞報導',
          description: '翻譯突發新聞的字幕軌，同時保持精準同步。',
        },
      ],
      whyMediaManipulator: [
        '本地 AI 翻譯：你的字幕絕不會送往第三方 AI 供應商。',
        '時間安全的解析方式：即使模型出錯，也會把原始字幕條目的開始／結束時間套回去。',
      ],
      privacyNote: '只會讀取你的 SRT 或 VTT 檔案中的文字：每條字幕都由我們在自己 GPU 伺服器上執行的語言模型翻譯，時間點則原封不動地複製過去。AI 處理在我們營運的硬體上執行，絕不使用第三方 AI 供應商，你上傳的任何內容也不會被用來訓練模型。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      faq: [
        {
          question: '可以翻譯 SRT 檔案而不破壞時間戳記嗎？',
          answer: '可以，這正是這個工具的重點。我們會解析字幕條目，只翻譯文字，然後在寫出檔案前把原始時間戳記精確地套回去。',
        },
        {
          question: '支援哪些字幕格式？',
          answer: '同時支援 SubRip（.srt）和 WebVTT（.vtt）。你可以讓輸出格式與輸入相同，也可以在兩者之間轉換。',
        },
        {
          question: '可以翻譯 YouTube 影片的字幕嗎？',
          answer: '可以。從你的影片產生（或匯出）SRT，在這裡翻譯，然後把新的 SRT 上傳到 YouTube，作為額外的語言字幕軌。',
        },
        {
          question: '字幕會用第三方 AI 供應商翻譯嗎？',
          answer: '不會。翻譯在我們自己以 Ollama 託管的模型上執行，你的字幕絕不會離開我們的基礎架構。',
        },
        {
          question: '字幕時間點會怎麼樣？',
          answer: '字幕條目的開始和結束時間會被完整保留：翻譯後我們會從原始檔案把它們套回去，所以即使模型出錯，也無法破壞你的時間點。',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '字幕檔大小上限：2 MB（實際的字幕軌通常遠小於此）。',
        ],
        processingNotes: [
          '翻譯在本地託管的 Ollama 模型上執行，不會連線到任何第三方翻譯 API。',
          'WebVTT 檔案中的 NOTE 和 STYLE 區塊會原樣保留。',
        ],
      },
      related: [
        {
          label: 'SRT 字幕產生器',
          to: '/tools/srt-generator',
          description: '從影片或音訊檔案產生全新的 SRT。',
        },
        {
          label: '從影片擷取音訊',
          to: '/tools/extract-audio-from-video',
          description: '取出音訊以便檢查或重新轉錄。',
        },
        {
          label: '為影片加入音訊',
          to: '/tools/stitch-audio-to-video',
          description: '翻譯字幕之後，再加入翻譯後的配音。',
        },
        {
          label: '將影片轉碼為 HLS',
          to: '/tools/transcode-to-hls',
          description: '將影片打包以便串流。',
        },
        {
          label: '將影片轉碼為 DASH',
          to: '/tools/transcode-to-dash',
          description: 'AV1 / VP9 DASH 封裝。',
        },
      ],
      embed: {
        title: '翻譯 SRT 或 VTT 字幕檔',
        description: '上傳現有的 .srt 或 .vtt 檔案，選擇目標語言，即可取回翻譯後的字幕檔，原本的字幕時間點完整保留。',
      },
    },
    'audio-waveform-generator': {
      name: '音訊波形產生器',
      h1: '免費音訊波形產生器',
      tagline: '把任何音訊檔案變成可自訂的波形影片、波形圖片，或兩者兼具，適合 Podcast、音樂預覽和社群短片。',
      metaTitle: '免費音訊波形產生器：波形影片與圖片 | Media Manipulator',
      metaDescription: '從任何音訊檔案產生波形影片和圖片。寬幅 10:1 Podcast 長條、正方形社群預覽、分割立體聲聲道、自訂顏色等功能一應俱全。',
      ogTitle: '免費音訊波形產生器',
      ogDescription: '從 MP3、WAV、M4A、FLAC 等檔案產生波形影片和圖片。高度可自訂，無需註冊。',
      intro: '波形讓音訊變得看得見，是 Podcast、音樂預覽、社群短片縮圖和剪輯時間軸不可或缺的素材。Media Manipulator 使用 FFmpeg 的 showwaves／showwavespic 濾鏡轉譯波形，提供合理的預設值（1600×160 的寬幅 10:1 長條），以及完整的進階面板，可調整轉譯模式、顏色、刻度和立體聲分割。',
      whatItDoes: [
        '使用 FFmpeg 的 showwaves 濾鏡轉譯動態波形影片，提供 point／line／p2p／cline 模式。',
        '使用 FFmpeg 的 showwavespic 濾鏡轉譯靜態波形圖片，非常適合縮圖和專輯封面。',
        '支援建議的長寬比預設（10:1 寬幅、8:1、6:1、16:9、1:1），也可自訂寬度和高度。',
        '可選擇分割聲道轉譯，以不同顏色分別繪製左右聲道。',
      ],
      flowSteps: [
        {
          title: '上傳音訊',
          description: '拖放任何 MP3、WAV、M4A、AAC、FLAC 或 OGG 檔案。',
        },
        {
          title: '選擇輸出與大小',
          description: '選擇波形影片、圖片或兩者，並挑選長寬比預設或自訂大小。',
        },
        {
          title: '調整外觀（選用）',
          description: '在進階面板中調整轉譯模式、影格率、顏色、刻度和繪製模式。',
        },
        {
          title: '下載',
          description: '儲存你的波形影片、圖片，或同時包含兩者的 .zip。',
        },
      ],
      advancedDetails: [
        '轉譯模式直接對應 FFmpeg 的 showwaves 模式：point、line、p2p、cline。表單中會預覽每一種模式，讓你用眼睛挑選。',
        '你可以選擇輸出影格率（rate=）或每欄取樣數（n=），但不能兩者同時設定，這與 FFmpeg 中互斥的參數一致。',
        '刻度選項（lin、log、sqrt、cbrt）讓你決定安靜段落要多明顯。',
        '同時要求影片和圖片時，我們會將兩者打包成單一 .zip，與 Media Manipulator 其他所有下載使用相同的工作系統。',
      ],
      whyItMatters: [
        '波形視覺效果讓音訊內容更容易分享：在靜音自動播放的社群動態中，帶有動態波形的片段表現遠勝於靜態縮圖。',
        '剪輯師和製作人在安排時間軸或設計專輯封面時，會把波形當作參考素材。',
        '調整得當的波形可以同時當作縮圖、音訊圖和音訊預告。',
      ],
      useCases: [
        {
          title: 'Podcast',
          description: '製作社群用的音訊圖：片段 + 波形 + 字幕 = 表現最好的 Podcast 宣傳形式。',
        },
        {
          title: '音樂預覽',
          description: '為 Instagram 產生正方形波形卡片，或為 YouTube 說明欄產生寬幅波形。',
        },
        {
          title: '剪輯時間軸',
          description: '在 Premiere 或 DaVinci Resolve 中把靜態波形圖片當作參考畫面。',
        },
        {
          title: '配音交件',
          description: '將波形卡片與 WAV 一起寄給客戶，讓他們一眼就能預覽。',
        },
      ],
      whyMediaManipulator: [
        '預設值偏向最實用的形狀（寬幅 10:1），而不是 FFmpeg 預設的 600×240。',
        '安全地開放進階 FFmpeg 控制項：每項設定在傳入濾鏡圖之前都會先在伺服器端驗證。',
        '輸出為 MP4、PNG 或兩者合併的 ZIP，不必再執行第二次工作。',
      ],
      privacyNote: '你的音訊會由我們伺服器上的 FFmpeg 繪製成波形圖片或影片。過程不涉及任何外部音訊服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你會得到一個新檔案；上傳的檔案本身不會被更改。',
      faq: [
        {
          question: '什麼是音訊波形？',
          answer: '波形是以視覺方式呈現音訊訊號振幅隨時間變化的圖形。它就是你在影片剪輯軟體和 SoundCloud 等平台上看到的那條起伏線條。',
        },
        {
          question: '可以用 MP3 製作波形影片嗎？',
          answer: '可以。上傳 MP3（或 WAV/M4A/FLAC/OGG/AAC），工具就會使用 FFmpeg 的 showwaves 濾鏡轉譯波形影片。',
        },
        {
          question: '也可以製作波形圖片嗎？',
          answer: '可以。將輸出設為「波形圖片」可取得靜態 PNG/WebP，設為「兩者（ZIP）」則會收到同時包含影片和圖片的 ZIP。',
        },
        {
          question: '波形應該用什麼尺寸？',
          answer: '對大多數 Podcast 和音樂工作流程來說，10:1 寬幅預設（1600×160）效果最好。如果需要適合社群平台的形狀，請使用 16:9 或 1:1。',
        },
        {
          question: 'point、line、p2p 和 cline 模式是什麼意思？',
          answer: '這些是 FFmpeg showwaves 的轉譯模式。point 為每個取樣繪製一個點，line 繪製一條垂直線，p2p 以線條連接各點，cline 繪製置中的垂直線。表單會預覽每一種模式。',
        },
        {
          question: '可以分割左右聲道嗎？',
          answer: '可以，在進階設定中啟用「分割立體聲聲道」，並為每個聲道選擇不同的顏色。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '建議預設值：10:1 寬幅波形（1600×160），非常適合 Podcast、音樂預覽和剪輯時間軸。',
          '選擇「兩者（ZIP）」時，結果會打包成單一 ZIP，內含影片和圖片。',
        ],
      },
      related: [
        {
          label: '從影片擷取音訊',
          to: '/tools/extract-audio-from-video',
          description: '先從影片中取出音訊，再產生波形。',
        },
        {
          label: 'SRT 字幕產生器',
          to: '/tools/srt-generator',
          description: '將波形與字幕搭配，製作社群音訊圖。',
        },
        {
          label: '為影片加入音訊',
          to: '/tools/stitch-audio-to-video',
          description: '將波形轉譯結果與另一支影片合併。',
        },
      ],
      embed: {
        title: '從音訊檔案產生波形',
        description: '上傳音訊檔案，選擇你要波形影片、波形圖片，還是兩者都要。進階控制項讓你調整大小、顏色、轉譯模式和立體聲行為。預設為寬幅 10:1 波形影片，適合 Podcast 和音樂預覽。',
      },
    },
    'extract-video-only-from-video': {
      name: '擷取無音訊影片',
      h1: '擷取無音訊影片（純影像）',
      tagline: '匯出移除所有音軌的靜音、純影像副本，適合靜音預覽、B-roll、剪輯和重新配樂。',
      metaTitle: '擷取無音訊影片：匯出純影像檔案 | Media Manipulator',
      metaDescription: '免費線上工具，可匯出移除所有音軌的純影像（無聲）副本。盡可能直接複製影片串流：不重新編碼，不損失畫質。',
      ogTitle: '擷取無音訊影片（純影像）',
      ogDescription: '匯出移除所有音軌的純影像（無聲）影片副本。免費，無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      intro: '有時你只想要影片而不要音訊：用於靜音的社群動態預覽、放進新剪輯中的 B-roll 素材，或是要配上新音樂的重新配樂流程。Media Manipulator 會去除所有音軌，輸出乾淨的純影像檔案。影片串流會盡可能直接複製，因此不必重新編碼，也不會損失畫質。',
      whatItDoes: [
        '移除影片中的所有音訊串流。',
        '盡可能直接複製影片串流：不重新編碼，不損失畫質。',
        '只有在目標容器格式需要時，才重新編碼為相容的 H.264 baseline。',
        '傳回無聲的 MP4（或 WebM），可直接放進新的剪輯中。',
      ],
      flowSteps: [
        {
          title: '上傳你的影片',
          description: '拖放任何 MP4、MOV、MKV、WebM、AVI 或 M4V 檔案。',
        },
        {
          title: '選擇輸出容器格式',
          description: 'MP4 是穩妥的預設選擇。WebM 則提供給 VP9/AV1 來源使用。',
        },
        {
          title: '我們去除音訊',
          description: 'FFmpeg 捨棄音訊串流，並在可能時直接複製影片串流。',
        },
        {
          title: '下載無聲影片',
          description: '儲存乾淨、沒有音訊的影片副本。',
        },
      ],
      advancedDetails: [
        '預設會嘗試使用 `-c:v copy`，因此不會重新編碼：影片串流的品質逐位元保留。',
        '如果目標容器格式不接受來源編解碼器，我們會改以 CRF 20 進行 libx264 + yuv420p 重新編碼。',
        '不加浮水印、不加疊加層、不縮放：預設情況下，視覺輸出與來源完全相同。',
      ],
      whyItMatters: [
        '無聲影片是大多數社群平台事實上的自動播放格式。',
        '移除音訊也是一種隱私措施：在分享螢幕錄影之前，去除其中內嵌的語音／對話內容。',
        '剪輯師常常需要乾淨的純影像檔案，用來重新配樂或與另一段錄音同步。',
      ],
      useCases: [
        {
          title: '靜音社群預覽',
          description: '為 Instagram、X、LinkedIn 或 TikTok 製作乾淨的自動播放片段。',
        },
        {
          title: '重新配樂專案',
          description: '在加入音樂或旁白之前，先去除原本的音訊。',
        },
        {
          title: '注重隱私的分享',
          description: '移除螢幕錄影時錄到的背景對話。',
        },
        {
          title: 'B-roll 準備',
          description: '將沒有音訊的片段放進多機位或以 B-roll 為主的剪輯中。',
        },
      ],
      whyMediaManipulator: [
        '盡可能直接複製串流，保留原始影片畫質。',
        '清楚、快速，無需註冊，無浮水印。',
        '免費。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ],
      privacyNote: '你的影片會由我們伺服器上的 FFmpeg 複製成不含音軌的版本。處理在我們自己的伺服器上執行，而不是第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的來源檔案保持不變，結果是一個新檔案。',
      faq: [
        {
          question: '如何移除影片中的音訊？',
          answer: '上傳你的影片，然後按一下「從影片移除音訊」。工具會以你選擇的容器格式輸出純影像副本。',
        },
        {
          question: '影片畫質會改變嗎？',
          answer: '預設情況下不會。我們直接複製影片串流，所以輸出的影像部分與原始檔逐位元相同。只有在目標容器格式需要時，我們才會重新編碼。',
        },
        {
          question: '可以把 MP4 變成無聲嗎？',
          answer: '可以，MP4 是預設的輸出容器格式，也是最常見的用途。',
        },
        {
          question: '原始影片會被修改嗎？',
          answer: '不會。原始上傳檔案保持不變。我們會產生一個新檔案，並依照保留規則保留或刪除上傳檔案：訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
        },
        {
          question: '如果我的影片沒有音訊怎麼辦？',
          answer: '沒問題，工具會正常完成，並傳回一份重新封裝的乾淨副本。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '只要目標容器格式支援，影片串流就會直接複製而不重新編碼。',
          '沒有音訊串流的輸入影片會正常完成，並傳回重新封裝的副本。',
        ],
      },
      related: [
        {
          label: '移除影片中的音訊',
          to: '/tools/remove-audio-from-video',
          description: '適合一般使用者的靜音／去除聲音頁面。',
        },
        {
          label: '從影片擷取音訊',
          to: '/tools/extract-audio-from-video',
          description: '將音軌取出為 MP3、WAV 等格式。',
        },
        {
          label: '為影片加入音訊',
          to: '/tools/stitch-audio-to-video',
          description: '為你的無聲影片加上新的配樂。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '縮小無聲影片。',
        },
        {
          label: '從影片擷取影格',
          to: '/tools/extract-frames-from-video',
          description: '從無聲影片中取出靜態圖片。',
        },
      ],
      embed: {
        title: '移除影片中的音訊',
        description: '上傳你的影片，我們會產生無聲／純影像的副本。影片串流會盡可能直接複製，因此不必重新編碼，也不會損失畫質。',
      },
    },
    'extract-frames-from-video': {
      name: '從影片擷取影格',
      h1: '從影片擷取影格',
      tagline: '從任何影片擷取靜態影格：每隔 N 秒、依指定影格率，或在特定時間點擷取，並下載為 ZIP。',
      metaTitle: '從影片擷取影格：免費影格擷取工具 | Media Manipulator',
      metaDescription: '免費線上工具，可從任何影片擷取靜態圖片。可選擇每 N 秒、每秒影格數或特定時間點。輸出為包含 JPG、PNG 或 WebP 影格的 ZIP。',
      ogTitle: '從影片擷取影格',
      ogDescription: '從 MP4、MOV、MKV、WebM、AVI 和 M4V 中擷取靜態圖片影格。以包含 JPG、PNG 或 WebP 影格的 ZIP 下載。',
      intro: '影格擷取能把影片還原成一連串靜態圖片，適合用於縮圖、參考畫面、設計模型、機器學習資料集，以及動畫／分鏡預覽。Media Manipulator 讓你每隔 N 秒、以目標影格率或在特定時間點取樣影格，並將產生的圖片打包成單一 ZIP 供你下載。',
      whatItDoes: [
        '將靜態影格擷取為 JPG、PNG 或 WebP 圖片。',
        '支援三種取樣模式：每 N 秒、目標每秒影格數，或特定時間點。',
        '將影格打包成單一 ZIP，一鍵即可下載。',
        '設有最大影格數防護上限，讓每次執行都保持快速且可預期。',
      ],
      flowSteps: [
        {
          title: '上傳你的影片',
          description: '拖放任何 MP4、MOV、MKV、WebM、AVI 或 M4V 檔案。',
        },
        {
          title: '選擇取樣模式',
          description: '每 N 秒、目標 FPS，或以逗號分隔的時間點清單。',
        },
        {
          title: '選擇圖片格式',
          description: 'JPG 適合精簡的縮圖，PNG 適合無損的靜態圖片，WebP 則能產生更小的現代格式檔案。',
        },
        {
          title: '下載 ZIP',
          description: '所有擷取的影格都會打包成單一 .zip，可在任何地方解壓縮。',
        },
      ],
      advancedDetails: [
        '「每 N 秒」與 FPS 模式使用 FFmpeg 的 fps 濾鏡，在整條時間軸上平均取樣。',
        '時間戳記模式會為每個要求的時間點各執行一次 FFmpeg，因此單一影格的失敗（例如超出範圍的要求）都會清楚呈現。',
        '最大影格數防護上限預設為 300，最高為 1000，能讓工作保持快速，並避免失控的擷取。',
      ],
      whyItMatters: [
        '影格擷取是從現有影片素材中抓取縮圖或參考影格最簡單的方法。',
        '設計師與動畫師會把取樣的影格當作繪圖參考，也會當作分鏡的 B-roll 素材。',
        '機器學習從業者用它們建立分類或偵測資料集，無需自訂處理流程。',
      ],
      useCases: [
        {
          title: '縮圖與預覽',
          description: '挑選單一影格作為 YouTube／Vimeo 縮圖。',
        },
        {
          title: '設計參考',
          description: '從遊戲畫面或動畫中取樣一連串影格作為繪圖參考。',
        },
        {
          title: '分鏡',
          description: '產生一連串關鍵影格，用於分鏡提案。',
        },
        {
          title: '機器學習資料集',
          description: '從少量影片快速建立小型圖片資料集。',
        },
      ],
      whyMediaManipulator: [
        '三種取樣模式幾乎涵蓋所有實際需求：間隔、FPS 或特定時間點。',
        'ZIP 輸出讓下載只需一次點擊，無論你擷取了多少影格。',
        '伺服器端 FFmpeg 讓輸出結果保持一致，不受瀏覽器或編解碼器支援影響。',
      ],
      privacyNote: '影格由我們伺服器上的 FFmpeg 依你選擇的頻率從影片中擷取，並以圖片 ZIP 的形式傳回。處理在我們自己的伺服器上執行，而非第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的原始檔案不會被更動，結果是一個新檔案。',
      faq: [
        {
          question: '如何從影片擷取影格？',
          answer: '上傳影片，選擇取樣模式（預設為每 N 秒），選擇圖片格式，然後點選「擷取影格」。結果是一個包含靜態圖片的 ZIP。',
        },
        {
          question: '可以每隔幾秒匯出一個影格嗎？',
          answer: '可以，這就是預設模式。將「影格間隔秒數」設為你想要的任何間隔即可。',
        },
        {
          question: '支援哪些圖片格式？',
          answer: 'JPG（精簡，最適合縮圖）、PNG（無損）和 WebP（更小的現代格式檔案）。',
        },
        {
          question: '為什麼這個工具會傳回 ZIP 檔案？',
          answer: '即使是短片也可能產生數十個影格。傳回單一 ZIP 讓下載只需一次點擊，也不必和瀏覽器的多檔下載限制周旋。',
        },
        {
          question: '為什麼有最大影格數限制？',
          answer: '這個限制能防止意外失控的工作（例如從長影片中擷取數萬個影格）。預設值為 300，絕對上限為 1000。',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '預設最大影格數上限為 300；如果真的需要更多，可在表單中提高到 1000。',
          '時間戳記模式接受以逗號分隔的秒數清單（例如「1, 5.5, 12.25, 30」）。',
        ],
      },
      related: [
        {
          label: '從影片擷取音訊',
          to: '/tools/extract-audio-from-video',
          description: '從同一部影片取出音訊。',
        },
        {
          label: 'SRT 字幕產生器',
          to: '/tools/srt-generator',
          description: '將同一部影片轉錄為 .srt 字幕。',
        },
        {
          label: '移除影片中的音訊',
          to: '/tools/extract-video-only-from-video',
          description: '去除音訊，保留一份無聲的影片副本。',
        },
      ],
      embed: {
        title: '從影片擷取影格',
        description: '上傳影片，選擇取樣模式（每 N 秒、依影格率或在特定時間點），然後下載包含靜態影格的 ZIP。',
      },
    },
    'stitch-audio-to-video': {
      name: '為影片加入音訊',
      h1: '為影片加入音訊',
      tagline: '將一支基底影片與最多三個額外的音訊檔案（配音、音樂、旁白）合併，並下載新的 MP4。',
      metaTitle: '為影片加入音訊：配音、音樂、取代、混音 | Media Manipulator',
      metaDescription: '免費線上工具，可為影片加入配音、音樂或旁白，或完全取代原始音訊。可逐軌控制音量與偏移，輸出 MP4。',
      ogTitle: '為影片加入音訊',
      ogDescription: '加入配音、音樂、旁白，或取代原始音訊。逐軌音量與偏移控制，輸出 MP4，無需註冊。',
      intro: '將一支基底影片與一個或多個額外的音訊檔案合併，是最常見的剪輯工作之一：加入配音、放入背景音樂、為螢幕錄影加上旁白，或完全取代原始音訊。Media Manipulator 提供逐軌的音量與偏移控制、「混合」與「取代」切換，以及能在任何播放器中順暢播放的 MP4 輸出。',
      whatItDoes: [
        '將一支基底影片與最多三條額外音軌合併。',
        '逐軌控制：音量（0–4×）、以秒為單位的開始偏移，以及可選的循環至影片長度。',
        '頂層模式切換：「混合」保留原始音訊，「取代」則捨棄原始音訊。',
        '輸出一律為 MP4，音訊為 192 kbps 的 AAC，這是到處都能播放的安全預設值。',
      ],
      flowSteps: [
        {
          title: '上傳基底影片',
          description: '拖放任何 MP4、MOV、MKV、WebM、AVI 或 M4V 檔案。',
        },
        {
          title: '加入音軌',
          description: '加入最多三個音訊檔案（配音、音樂、旁白），並分別設定每條音軌。',
        },
        {
          title: '選擇混合或取代',
          description: '保留原始音訊並混入新音軌，或捨棄原始音訊、只使用新音訊。',
        },
        {
          title: '下載新的 MP4',
          description: '我們在伺服器上完成合併，並傳回乾淨的 MP4。',
        },
      ],
      advancedDetails: [
        '濾鏡圖以程式方式建構：每條音軌各有 adelay 與 volume 節點，再以單一 amix 將它們合併。',
        '視訊串流會盡可能直接複製，只有音訊會重新編碼（編碼為 192 kbps 的 AAC）。',
        '循環是透過在音訊輸入上使用 `-stream_loop -1` 實作，讓較短的背景音樂能順暢延伸到影片長度。',
        '輸出長度預設為「裁剪至影片長度」；如果你希望輸出延伸到最長的輸入，請取消勾選。',
      ],
      whyItMatters: [
        '配音、音樂和旁白是短影音最常加入的音訊。',
        '逐軌的音量與偏移控制讓你能做出真正的混音，而不只是放入單一音軌。',
        '在瀏覽器中處理既慢又不可靠；伺服器端 FFmpeg 則快速又正確。',
      ],
      useCases: [
        {
          title: '創作者影片',
          description: '在人物講話的片段下方鋪上背景音樂，或用乾淨的配音取代現場收音。',
        },
        {
          title: '教學影片',
          description: '在螢幕錄影上疊加旁白音軌。',
        },
        {
          title: '社群短片',
          description: '在 15 秒的剪輯中，於特定偏移位置加入熱門音樂。',
        },
        {
          title: '家庭／個人影片',
          description: '為旅遊精華影片加入背景音樂。',
        },
      ],
      whyMediaManipulator: [
        '逐軌的音量與偏移控制，而不只是放入單一音訊檔案。',
        '盡可能直接複製視訊串流，保留原始影片畫質。',
        '免費、無需註冊、伺服器端 FFmpeg。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ],
      privacyNote: '你的影片與你加入的音訊檔案會由我們伺服器上的 FFmpeg 合併成一個 MP4。處理在我們自己的伺服器上執行，而非第三方轉碼服務。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。你的原始檔案不會被更動，結果是一個新檔案。',
      faq: [
        {
          question: '可以為影片加入音樂嗎？',
          answer: '可以。將音樂檔案加入為音軌，設定音量，並將模式保留為「混合」，讓原始音訊保留在下方。',
        },
        {
          question: '可以加入配音並保留原始音訊嗎？',
          answer: '可以。將模式保留為「混合」，加入配音；如果你希望配音位於最上層，可透過為額外音軌設定較低的音量來壓低原始音訊。',
        },
        {
          question: '可以取代原始音軌嗎？',
          answer: '可以。將模式設為「取代」，原始音訊就會被捨棄。輸出中只會混入你加入的音軌。',
        },
        {
          question: '如果音訊比影片長會怎樣？',
          answer: '預設會裁剪至影片長度。如果你希望輸出延伸到最長的輸入，請取消勾選「裁剪至影片長度」。',
        },
        {
          question: '可以調整加入音訊的音量嗎？',
          answer: '可以。每條加入的音軌都有自己的音量倍率（0–4×），以及以秒為單位的開始偏移。',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '每個工作最多可加入 3 條音軌。',
        ],
        processingNotes: [
          '視訊串流會盡可能直接複製，只有音訊會重新編碼（編碼為 AAC 192 kbps）。',
          '勾選「循環」可將較短的背景音樂延伸到影片長度。',
        ],
      },
      related: [
        {
          label: '從影片擷取音訊',
          to: '/tools/extract-audio-from-video',
          description: '從一部影片取出音訊，在另一部影片中重複使用。',
        },
        {
          label: '移除影片中的音訊',
          to: '/tools/extract-video-only-from-video',
          description: '去除音訊，準備乾淨的重新配樂基底。',
        },
        {
          label: '音訊波形產生器',
          to: '/tools/audio-waveform-generator',
          description: '為你的音軌製作搭配的視覺畫面。',
        },
      ],
      embed: {
        title: '為影片加入或取代音軌',
        description: '上傳基底影片，加入一到三個音訊檔案，設定每條音軌的音量與偏移，然後選擇「混合」或「取代」。我們會傳回合併所有內容的 MP4。',
      },
    },
    'ai-frame-interpolation': {
      name: 'AI 影格插補',
      h1: 'AI 影格插補工具',
      tagline: '以 AI 產生的中間影格，將影片影格率提高到 48、60 或 120 FPS，讓動作更流暢。',
      metaTitle: 'AI 影格插補工具：將影片轉換為 60 或 120 FPS | Media Manipulator',
      metaDescription: '免費線上 AI 影格插補工具。使用 RIFE 將 24/30fps 影片轉換為更流暢的 48、60 或 120 FPS MP4。不使用第三方 API，在我們自己的 GPU 上執行。',
      ogTitle: 'AI 影格插補工具：讓影片流暢提升至 60 或 120 FPS',
      ogDescription: '上傳影片、選擇目標 FPS，然後下載含有 AI 產生的中間影格、動作更流暢的 MP4。',
      intro: 'AI 影格插補會以神經網路（RIFE）產生新的中間影格來提高影片影格率，而不是單純複製或混合現有影格。結果是明顯更流暢的動作：24/30fps 的畫面開始有 60fps 的感覺，60fps 的片段則可提升到適合高更新率螢幕的 120fps。處理在我們自己的 GPU 伺服器上執行，而非第三方 API，輸出是可以直接放進任何播放器的 MP4。',
      whatItDoes: [
        '以 RIFE（rife-ncnn-vulkan）合成新的中間影格，而不是複製或混合現有影格。',
        '以 48、60 或 120 FPS 為目標，並提供由你控制的品質與最大處理高度預設組。',
        '在我們自己的 GPU 伺服器上執行，沒有任何第三方 AI 供應商會看到你的檔案。',
        '傳回 H.264 + AAC 的 MP4（預設保留來源的音軌）。',
        '事先限制過長或過高的來源，避免單一工作霸佔 GPU。',
      ],
      flowSteps: [
        {
          title: '上傳影片',
          description: '放入簡短的 MP4、MOV、WebM、MKV 或 AVI 片段。',
        },
        {
          title: '開啟 AI 影片工具',
          description: '在影片表單中捲動到「AI 影片工具」，然後選擇 AI 影格插補。',
        },
        {
          title: '選擇目標 FPS 與品質',
          description: '選擇 48、60 或 120 FPS，以及編碼品質／最大處理高度。',
        },
        {
          title: '執行插補',
          description: '我們會擷取影格、在 GPU 上執行 RIFE，並以新的 FPS 重新編碼為 MP4。',
        },
        {
          title: '下載 MP4',
          description: '儲存插補後的片段，並與原始影片並排預覽。',
        },
      ],
      advancedDetails: [
        '影格擷取使用帶有 vsync=0 的 ffmpeg，讓輸入影格數與來源 FPS 完全一致。',
        'RIFE 透過 rife-ncnn-vulkan 搭配所選的模型目錄執行（建議預設為 rife-v4.6；為了相容性，也提供 rife-v4 和 rife-v2.3）。',
        '插補完成後，ffmpeg 會以所選品質重新編碼為 H.264（libx264）+ AAC（低／中／高分別為 CRF 26/20/17）。',
        '來源音訊會重新對應到新的編碼上，輸出使用 +faststart，讓檔案能透過 HTTP 順暢串流。',
        '最大處理高度（預設 720p）會限制過高來源對 GPU 記憶體的壓力；原始長寬比則以 -2:min(ih,N) 縮放保留。',
      ],
      whyItMatters: [
        '動作流暢度是消費級影片與廣播級影片之間最大的感知差異之一。',
        '現代顯示器與許多社群平台都偏好 60fps 和 120fps 內容，以獲得更流暢的播放。',
        '較舊或低影格率的畫面可以再提升一個檔次，無需重新拍攝原始素材。',
      ],
      useCases: [
        {
          title: '30fps → 60fps 用於網頁',
          description: '將人物講話、螢幕錄影或 vlog 畫面提升到現代社群與影片網站常見、更流暢的 60fps 範圍。',
        },
        {
          title: '60fps → 120fps 用於高更新率播放',
          description: '為 120Hz/144Hz 顯示器或後續的慢動作剪輯準備素材。',
        },
        {
          title: '更流暢的短片',
          description: '在分享前讓 5–10 秒的剪輯看起來明顯更流暢。',
        },
        {
          title: '修復較舊的片段',
          description: '將舊有的 24/30fps 片段提升到 48 或 60fps，獲得更現代的播放感受。',
        },
        {
          title: '剪輯前準備',
          description: '在後續剪輯軟體中套用慢動作或動態圖像之前，先產生更密集的影格時間軸。',
        },
      ],
      whyMediaManipulator: [
        '在我們自己的 GPU 基礎設施上執行，沒有任何第三方 AI 供應商會收到檔案。',
        '使用 rife-ncnn-vulkan 這個可攜的 Vulkan 執行檔，而不是笨重的 PyTorch 堆疊：相依套件更少，冷啟動更快。',
        '免費、無需註冊。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      ],
      privacyNote: '新的中間影格由我們自己的 GPU 伺服器上的 RIFE 為你的影片產生。AI 處理在我們營運的硬體上執行，絕不會交給第三方 AI 供應商，你上傳的任何內容都不會用於訓練模型。訪客的檔案保留 24 小時；使用免費帳號可自行選擇 24 小時到 2 年。',
      faq: [
        {
          question: 'AI 影格插補真的能提升影片畫質嗎？',
          answer: '它提升的是動作流暢度，而不是解析度或清晰度。如果你的來源已經是 60fps，在 120fps 下會感覺更流暢。如果你的來源是 24/30fps，會感覺更接近 60fps。它無法神奇地找回攝影機從未拍到的真實動作。',
        },
        {
          question: 'AI 影格插補和單純提高 FPS 一樣嗎？',
          answer: '不一樣。基本的 FPS 轉換通常會複製、捨棄或混合現有影格。AI 插補會根據估算的動作合成全新的中間影格，看起來通常比複製自然得多。',
        },
        {
          question: '可以把 30fps 轉成 60fps 嗎？',
          answer: '可以。30fps 轉 60fps 是最常見的目標之一，也很適合作為第一次測試。',
        },
        {
          question: '可以把 60fps 轉成 120fps 嗎？',
          answer: '可以。120fps 的 GPU 工作量是 60fps 的兩倍，產生的檔案也更大，所以請先用短片段試試。',
        },
        {
          question: '為什麼影格插補可能產生瑕疵？',
          answer: '動作估算必須猜測兩個真實影格之間發生了什麼。快速動作、手、頭髮、車輪、遮擋與場景切換本來就比較困難，合成的影格可能在這些區域出現扭曲、殘影或拖影。',
        },
        {
          question: '這個工具輸出什麼格式？',
          answer: '以 H.264 影片與 AAC 音訊組成的 MP4。v1 只輸出 MP4，因為這種容器到處都能播放，而且支援本工具產生的較高影格率。',
        },
        {
          question: '60fps 一定比 30fps 好嗎？',
          answer: '對於 UI 螢幕錄影、運動、遊戲畫面與動作較多的片段，60fps 通常感覺更流暢。對於電影感的內容，24/30fps 往往才是想要的效果。請選擇符合你想要的成品感受的 FPS。',
        },
        {
          question: 'AI 影格插補比 FFmpeg minterpolate 好嗎？',
          answer: 'AI 插補（RIFE）產生的動作通常比 FFmpeg 內建的 minterpolate 濾鏡更乾淨，尤其是非剛性的動作。minterpolate 更快、更簡單，仍適合用於快速的備用轉換。',
        },
        {
          question: '為什麼場景切換在插補後有時看起來很奇怪？',
          answer: '模型假設相鄰影格屬於同一段動作序列。硬切會打破這個假設，因此邊界處的合成影格可能出現短暫的扭曲。乾淨的剪接與短片段會有幫助。',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '最大來源長度與處理高度受伺服器上的 AI_FRAME_INTERPOLATION_MAX_DURATION_SECONDS 和 AI_FRAME_INTERPOLATION_MAX_HEIGHT 限制。',
        ],
        processingNotes: [
          'AI 插補非常吃 GPU。對於較高的來源，降低最大處理高度可以更快完成。',
          'v1 的輸出為 MP4（H.264 + AAC）。預設保留來源音訊。',
        ],
      },
      related: [
        {
          label: '影片轉換器',
          to: '/tools/video-converter',
          description: '轉換 MP4、WebM、MOV、AVI、MKV 等格式。',
        },
        {
          label: '壓縮影片',
          to: '/tools/compress-video',
          description: '在插補後縮小影片檔案大小。',
        },
        {
          label: '將影片轉換為動態 GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: '把短片段變成方便分享的動態 GIF。',
        },
        {
          label: '從影片擷取影格',
          to: '/tools/extract-frames-from-video',
          description: '將個別影格擷取為 PNG。',
        },
        {
          label: 'AI 影格插補教學',
          to: '/tutorials/ai-frame-interpolation',
          description: '了解 AI 插補的原理與使用時機。',
        },
      ],
      embed: {
        title: 'AI 影格插補',
        description: '上傳簡短的影片。AI 影格插補已預先選取：選擇目標 FPS（48、60 或 120），工具就會合成新的中間影格並傳回 MP4。',
      },
    },
    // MM100: Aperture's page lines (name, tagline, SEO title and description); full bodies come with MM102-<prefix>. Model-written, needs native review.
    'aperture': {
      name: 'Aperture',
      tagline: '瀏覽器中以圖層為基礎的照片編輯器：曝光度、曲線、色彩、遮色片、修復與預設集，以完整解析度匯出。',
      metaTitle: 'Aperture 線上照片編輯器：圖層、曲線、遮色片 | Media Manipulator',
      metaDescription: '在瀏覽器中用 Aperture 編輯照片：非破壞性調整圖層、曲線、色階、HSL、遮色片、污點修復、預設集與完整解析度匯出。',
    },
    'brighten-image': {
      name: '提亮圖片',
      tagline: '用線性光下真正的曝光度控制提亮偏暗的照片，或用亮度與陰影做更溫和、更有針對性的調整。',
      metaTitle: '線上提亮圖片：曝光度、亮度、陰影 | Aperture',
      metaDescription: '在瀏覽器中提亮偏暗的照片。以 EV 檔為單位的曝光度、亮度滑桿與陰影還原，即時預覽並以完整解析度匯出。',
    },
    'adjust-image-contrast': {
      name: '調整對比',
      tagline: '圍繞中間灰階的對比滑桿，加上影調與曲線，讓你在增加對比的同時不壓死兩端。',
      metaTitle: '線上調整圖片對比：滑桿、影調或曲線 | Aperture',
      metaDescription: '在瀏覽器中增加或降低圖片對比。對比滑桿圍繞中間灰階調整；影調與曲線讓你控制形狀。以完整尺寸匯出。',
    },
    'fix-photo-exposure': {
      name: '修正曝光',
      tagline: '以檔為單位設定曝光度，再分別還原亮部與陰影，同時用直方圖查看還剩下多少可用資訊。',
      metaTitle: '線上修正曝光過度或不足的照片 | Aperture',
      metaDescription: '在瀏覽器中校正照片曝光：以 EV 檔為單位的曝光度，加上亮部、陰影、白色與黑色還原，附即時直方圖與完整解析度匯出。',
    },
    'adjust-image-hue': {
      name: '調整圖片色相',
      tagline: '將照片中的每種顏色旋轉最多 180 度，或只移動紅色、綠色或藍色，即時預覽並以完整解析度匯出。',
      metaTitle: '線上調整圖片色相：移動所有顏色或單一範圍 | Media Manipulator',
      metaDescription: '將整張照片的色相移動 -180 到 180 度，或只移動紅色、黃色、綠色、青色、藍色或洋紅。即時 GPU 預覽，完整解析度匯出。',
    },
    'change-image-color': {
      name: '更改物件顏色',
      tagline: '用滴管選取顏色，設定選取範圍的大小，旋轉色相，然後匯出：紅色的汽車變成綠色，明暗與反光都保持不變。',
      metaTitle: '線上更改照片中物件的顏色 | Media Manipulator',
      metaDescription: '用「顏色範圍」遮色片依顏色選取物件，用「色彩（HSL）」滑桿旋轉其色相，並以完整解析度匯出。明暗與亮部保持不變。',
    },
    'color-pop': {
      name: '色彩強調',
      tagline: '保留紅色、藍色或六個色系中的任意一種，用一個之後還能調整的內建風格把其餘部分變成灰色。',
      metaTitle: '把照片變成黑白、只保留一種顏色 | Media Manipulator',
      metaDescription: '瀏覽器中的選擇性色彩：保留紅色、黃色、綠色、青色、藍色或洋紅，其餘去除飽和度。六種內建風格，可逐範圍控制，完整解析度匯出。',
    },
    'image-saturation': {
      name: '圖片飽和度',
      tagline: '自然飽和度可提升色彩，同時保護膚色與本已強烈的顏色；飽和度則統一縮放，兩者都是可以加遮色片的圖層。',
      metaTitle: '線上增加或降低圖片飽和度 | Aperture',
      metaDescription: '在瀏覽器中變更照片的飽和度。自然飽和度提升暗淡的顏色並保護膚色；飽和度均勻縮放所有顏色。完整解析度匯出。',
    },
    'photo-levels': {
      name: '色階',
      tagline: '針對即時直方圖，依色版設定輸入黑色、輸入白色、中間調伽瑪與輸出範圍。',
      metaTitle: '線上調整照片色階：黑點、白點、中間調',
      metaDescription: '瀏覽器中的色階：RGB、紅、綠、藍的輸入黑白點、中間調伽瑪與輸出限制，附即時直方圖。',
    },
    'photo-curves': {
      name: '曲線',
      tagline: '用可拖曳的曲線為 RGB 與每個色版塑造影調與色彩，最多 16 個點，並附滴管。',
      metaTitle: '線上照片曲線工具：瀏覽器中的 RGB 與單色版曲線',
      metaDescription: '瀏覽器中的曲線：在 RGB、紅、綠、藍曲線上拖曳最多 16 個點，用滴管選取影調，並以完整解析度匯出。',
    },
    'white-balance-photo': {
      name: '白平衡',
      tagline: '用在線性光下作用於中間調的色溫與色調滑桿，去除偏黃、偏藍、偏綠或偏洋紅的色偏。',
      metaTitle: '線上修正照片的白平衡與色偏 | Aperture',
      metaDescription: '在瀏覽器中校正色偏。色溫與色調滑桿在線性光下移動中間調，附即時預覽與完整解析度匯出。',
    },
    'black-and-white-photo': {
      name: '黑白照片',
      tagline: '依色版加權的單色轉換，附六個色彩滑桿、柔和的底片曲線與細緻的顆粒，開啟時即套用，匯出前仍可調整。',
      metaTitle: '線上將照片轉換為黑白 | Media Manipulator',
      metaDescription: '可逐色控制的黑白：六個色版滑桿決定紅、黃、綠、青、藍與洋紅如何變為灰色。已套用底片風格，完整尺寸匯出。',
    },
    'tint-photo': {
      name: '為照片著色',
      tagline: '像鏡頭前的濾鏡一樣為照片罩上一層顏色：選擇加溫、冷卻、深褐色或任意自訂色彩，設定濃度，並保持亮度不變。',
      metaTitle: '線上為照片著色：加溫、深褐色或任意顏色 | Media Manipulator',
      metaDescription: '用相片濾鏡圖層為照片加上色調：加溫、冷卻、深褐色、紅、綠、藍或自訂十六進位色彩，濃度 0 到 100，保留明度。完整尺寸匯出。',
    },
    'color-balance-photo': {
      name: '色彩平衡',
      tagline: '在陰影、中間調與亮部中分別推動紅、綠、藍，以去除色偏或打造風格，並保持明度不變。',
      metaTitle: '線上照片色彩平衡：修正色偏 | Media Manipulator',
      metaDescription: '九個滑桿，即陰影、中間調與亮部各自的紅、綠、藍，並可保留明度。修正偏藍或偏橙的色偏，或為照片調色，然後以完整尺寸匯出。',
    },
    'split-toning': {
      name: '分割色調',
      tagline: '把一種色相推入陰影，另一種推入亮部，再在兩者之間滑動平衡點。',
      metaTitle: '線上分割色調：分別為陰影與亮部上色',
      metaDescription: '在瀏覽器中用兩種不同的色相為陰影與亮部著色：色相、飽和度與平衡滑桿，即時前後對照，完整解析度匯出。',
    },
    'apply-lut-to-photo': {
      name: '套用 LUT',
      tagline: '將 .cube 3D LUT 拖放到照片上，設定強度，並以完整解析度匯出調色後的影像。',
      metaTitle: '線上為照片套用 LUT：在瀏覽器中載入 .cube 檔案',
      metaDescription: '載入最大尺寸為 65、不超過 1 MB 的 .cube 3D LUT，立即在照片上檢視調色效果，用強度滑桿混合，並以完整尺寸匯出。',
    },
    'invert-image-colors': {
      name: '反轉色彩',
      tagline: '把每個像素翻轉為其負片，作為可以加遮色片、混合或復原的非破壞性圖層。',
      metaTitle: '線上反轉圖片色彩：製作照片的負片',
      metaDescription: '在瀏覽器中一鍵將照片反轉為負片。每個色版變為 1 減去其值；可加遮色片、疊加，並以完整解析度匯出。',
    },
    'posterize-image': {
      name: '色調分離',
      tagline: '將每個色版壓縮為選定數量的色階，得到帶有明顯色調層次的平面海報風格色彩。',
      metaTitle: '線上色調分離圖片：每色版 2 到 255 個色階',
      metaDescription: '在瀏覽器中把每個色版吸附到 2 至 255 個色階來對照片做色調分離。即時查看色帶，可與黑白疊加，並以完整尺寸匯出。',
    },
    'reduce-image-noise': {
      name: '降低圖片雜訊',
      tagline: '分別降低明亮度雜訊與色彩雜訊，附即時預覽，然後以完整解析度匯出。',
      metaTitle: '線上降低照片雜訊：明亮度與色彩降噪',
      metaDescription: '在瀏覽器中為顆粒明顯的高 ISO 照片降噪：對明亮度使用雙邊濾波，對色彩使用高斯濾波，在 100% 縮放下判斷，並以完整解析度匯出。',
    },
    'add-vignette': {
      name: '加入暈影',
      tagline: '透過中點、圓度、羽化與亮部保護，壓暗或提亮照片的邊緣。',
      metaTitle: '線上加入或移除暈影：中點、圓度、羽化',
      metaDescription: '在瀏覽器中為照片加入暗角或亮角暈影，或用正值抵銷鏡頭暗角。五個滑桿、即時預覽與完整解析度匯出。',
    },
    'sharpen-photo-online': {
      name: '銳利化照片',
      tagline: '對明度使用的遮色片銳利化，附強度、半徑與臨界值，另有清晰度與紋理，在 100% 下判斷。',
      metaTitle: '線上銳利化照片：強度、半徑與臨界值',
      metaDescription: '在瀏覽器中用真正的遮色片銳利化來銳利化照片：強度 0-500、半徑 0.1-50 px、臨界值 0-255，另有清晰度與紋理。即時預覽，完整解析度匯出。',
    },
    'straighten-photo': {
      name: '拉直照片',
      tagline: '依角度或畫一條線來修正傾斜的地平線，然後自動裁切為最大的矩形。',
      metaTitle: '線上拉直歪斜的照片：修正傾斜的地平線',
      metaDescription: '在瀏覽器中校平傾斜的地平線：輸入角度或沿地平線畫一條線，自動裁切為最大的內接矩形，並以完整解析度匯出。',
    },
    'fix-perspective-photo': {
      name: '修正透視',
      tagline: '拖曳四個角來校正梯形失真與匯聚的垂直線，然後自動裁切結果。',
      metaTitle: '線上修正照片透視：梯形校正',
      metaDescription: '在瀏覽器中透過拖曳四個角校正匯聚的垂直線與梯形扭曲。投影映射、雙線性重新取樣、自動裁切與完整解析度匯出。',
    },
    'remove-blemishes': {
      name: '移除瑕疵',
      tagline: '塗抹斑點，按「修復」，讓我們 GPU 上的修補模型根據周圍的皮膚將其填滿。',
      metaTitle: '線上移除照片中的瑕疵與斑點：修復工具',
      metaDescription: '塗抹痘痘、灰塵斑點與多餘的痕跡，按「修復」，由我們自己 GPU 上的修補模型填滿。每按一次計一次 AI 操作，失敗時退還，完整解析度匯出。',
    },
    'select-by-color': {
      name: '依顏色選取',
      tagline: '用滴管選取顏色，用顏色容差擴大範圍，並只調整該選取範圍。',
      metaTitle: '線上依顏色選取照片：顏色範圍遮色片',
      metaDescription: '在瀏覽器中建立顏色範圍遮色片：滴管、按住 Shift 並點擊最多加入 8 種顏色、以 Lab 色差衡量的顏色容差、羽化與反相，然後只調整選取範圍。',
    },
  },
} as const;

export default zhTwToolPages;
