/**
 * Vietnamese partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope: MM67 (2026-10-27) added Motion's full page body; MM92 (2026-10-31)
 * added `name` + `tagline` for every tool; MM93 (2026-11-04) added the full
 * body of every non-alias tool page (98), model-written by Opus 5.5; native
 * review pending. Allowances are tác vụ thường and tác vụ AI (pricing FAQ);
 * visitors are khách; frame rate is tốc độ khung hình; remove vocals is
 * "Loại bỏ giọng hát" (the form's label) so it no longer shares a name with
 * isolate vocals ("Tách giọng hát"). Decimals take a comma. Number words the
 * English spells out stay words: the body checker matches ASCII digits.
 *
 * Register: "bạn"; brand names, formats and codecs stay untranslated;
 * "Darkroom" and "Motion" stay as they are. Model-written, needs native review.
 */

const viToolPages = {
  pages: {
    // MM48/MM67: Motion's full page body (model-written, needs native review). The brand stays "Motion".
    motion: {
      name: 'Motion',
      h1: 'Motion',
      tagline: 'Vẽ hoặc nhập SVG, tạo hoạt ảnh trên dòng thời gian keyframe và xuất thành SVG động, Lottie, React, JavaScript, Flutter hoặc GIF, tất cả ngay trong trình duyệt của bạn.',
      intro: 'Motion là trình biên tập SVG có dòng thời gian hoạt ảnh, tích hợp trong Media Manipulator. Mở một tệp SVG (hoặc hoạt ảnh Lottie) và mỗi hình trở thành một lớp bạn có thể chọn, di chuyển, đổi màu và tạo hoạt ảnh, hoặc bắt đầu từ vùng vẽ trống và vẽ bằng các công cụ hình chữ nhật, hình elip, đường thẳng, bút và văn bản. Mỗi thuộc tính được tạo hoạt ảnh có track keyframe riêng, với các thiết lập easing, trình chỉnh sửa đường cong cho easing tùy chỉnh, và khóa giữ cho các bước nhảy tức thì. Các bộ tạo hoạt ảnh một chạm thêm hiệu ứng vẽ dần nét, di chuyển theo đường, biến hình, đổi màu chuyển màu, hoạt ảnh mặt nạ và làm mờ. Khi chuyển động đã như ý, hãy xuất thành SVG động, tệp Lottie, component React, module JavaScript hoặc TypeScript, widget Flutter hoặc GIF. Việc chỉnh sửa và mọi lần xuất đều chạy trong trình duyệt của bạn, nên đồ họa của bạn không bao giờ bị tải lên để xuất.',
      whatItDoes: [
        'Nhập tệp SVG thành cây lớp có thể chỉnh sửa (nhóm, đường path, hình, văn bản, hình ảnh, chuyển màu, mặt nạ và đường cắt) và nhập hoạt ảnh Lottie JSON kèm keyframe của chúng, mỗi tệp tối đa 4 MB.',
        'Vẽ đồ họa mới bằng các công cụ hình chữ nhật, hình elip, đường thẳng, bút (Bézier) và văn bản, và chỉnh sửa các nút của đường path ngay trên vùng vẽ.',
        'Tạo hoạt ảnh cho vị trí, tỷ lệ, xoay, nghiêng, độ mờ, màu tô, nét và độ dày nét trên dòng thời gian keyframe với easing tuyến tính, ease-in, ease-out, ease-in-out, cubic-bezier tùy chỉnh và giữ.',
        'Thêm sáu bộ tạo hoạt ảnh một chạm: vẽ dần nét, di chuyển theo đường với tùy chọn tự động xoay, biến hình, màu điểm dừng chuyển màu, hoạt ảnh mặt nạ và đường cắt, và làm mờ.',
        'Xuất SVG tĩnh (luôn miễn phí và không bao giờ bị tính lượt), SVG động phát được mà không cần thư viện nào, Lottie JSON, component React, module JavaScript hoặc TypeScript, widget Flutter và GIF động, tất cả đều được tạo ngay trên máy của bạn.',
      ],
      flowSteps: [
        {
          title: 'Mở hoặc vẽ',
          description: 'Nhập tệp SVG hoặc Lottie, hoặc vẽ hình và đường path trên vùng vẽ trống.',
        },
        {
          title: 'Tạo hoạt ảnh',
          description: 'Di chuyển đầu phát và thay đổi một thuộc tính: dòng thời gian ghi lại một keyframe cho nó.',
        },
        {
          title: 'Định hình nhịp độ',
          description: 'Chọn một thiết lập easing, vẽ đường cong tùy chỉnh, thêm giữ, hoặc áp dụng bộ tạo hoạt ảnh một chạm.',
        },
        {
          title: 'Xuất',
          description: 'Tải xuống SVG động, Lottie, React, JS/TS, Flutter hoặc GIF, được tạo trong trình duyệt của bạn.',
        },
      ],
      advancedDetails: [
        'Bản xuất SVG động dùng keyframe CSS thuần bất cứ khi nào mọi hiệu ứng đều biểu diễn được bằng CSS trên Chrome, Firefox và Safari. Biến hình, điểm dừng chuyển màu di chuyển và làm mờ cần một script, nên các tệp đó nhúng một bản rút gọn của anime.js (giấy phép MIT, khoảng 31 KB mã script, tức khoảng 13 KB sau khi nén gzip) kèm thông báo giấy phép ở đầu tệp.',
        'Biến hình chuẩn hóa cả hai hình về cùng số đoạn cong và căn chỉnh điểm bắt đầu cùng chiều vẽ, để quá trình biến hình không bị xoắn. Hai hình không thể ghép cặp sẽ được giữ nguyên thay vì biến hình.',
        'Bộ ghi Lottie hướng đến đặc tả Lottie 1.0.1 và tập tính năng "Basic" của LottieFiles. Bất cứ thứ gì Lottie không chứa được (như bộ lọc, văn bản hoặc mặt nạ nâng cao) sẽ được liệt kê sau khi tải xuống; không có gì bị bỏ đi trong im lặng. Bộ đọc dùng cùng danh sách đó theo chiều ngược lại.',
        'Xuất GIF kết xuất từng khung hình một, chuyển từng khung sang một Worker và mã hóa bằng bộ mã hóa được viết riêng cho Media Manipulator: một bảng màu chung lấy mẫu từ năm khung hình trải khắp hoạt ảnh, mặc định tắt dithering (đồ họa vector phẳng có ít màu và dithering chỉ thêm nhiễu), độ trễ khung hình là round(100 / fps) phần trăm giây, và chỉ giữ độ trong suốt khi nền vùng vẽ trong suốt. Đầu ra bị giới hạn ở 2 GB và hộp thoại hiển thị kích thước ước tính trước khi bạn bắt đầu.',
        'SVG nhập vào được làm sạch ngay khi vào: script, trình xử lý sự kiện, tham chiếu bên ngoài và nội dung không an toàn khác bị gỡ bỏ, và trình biên tập dựng lại mã không được hỗ trợ từ danh sách cho phép thay vì chèn dưới dạng HTML. Mã mà trình biên tập không mô hình hóa được sẽ được giữ thành một lớp đóng, đi qua nhập và xuất mà không thay đổi.',
        'Bộ đếm lượt xuất là một giao dịch cơ sở dữ liệu duy nhất: khóa định dạng và các giới hạn được kiểm tra, rồi bộ đếm và một dòng bản xuất được ghi cùng lúc. Một lượt xuất bị từ chối không ghi gì và không tốn gì; một lượt xuất sau đó bị trình duyệt hủy hoặc thất bại thì đã được tính.',
      ],
      whyItMatters: [
        'SVG động luôn sắc nét ở mọi kích thước và thường nhỏ hơn nhiều so với video hoặc GIF của cùng hoạt ảnh, nên lý tưởng cho logo, biểu tượng, hoạt ảnh tải và minh họa trên web.',
        'Lập trình viên cần hoạt ảnh dưới dạng mã, không chỉ là video: một component React, module JavaScript, tệp Lottie hoặc widget Flutter đưa thẳng vào ứng dụng.',
        'Xuất trong trình duyệt nghĩa là đồ họa của bạn ở lại trên thiết bị; chỉ một số đếm cho mỗi lần xuất được gửi cho chúng tôi, để áp dụng hạn mức hằng ngày.',
      ],
      useCases: [
        {
          title: 'Hoạt ảnh logo và biểu tượng',
          description: 'Vẽ dần một logo bằng hoạt ảnh nét, hoặc làm biểu tượng nảy, xoay hoặc đổi màu khi di chuột.',
        },
        {
          title: 'Hoạt ảnh tải và vi hoạt ảnh giao diện',
          description: 'Dựng spinner và hoạt ảnh tiến trình rồi xuất thành SVG chỉ dùng CSS hoặc component React.',
        },
        {
          title: 'Lottie cho ứng dụng di động',
          description: 'Xuất Lottie JSON cho các trình phát Lottie trên iOS, Android, web và Flutter, hoặc chỉnh sửa tệp Lottie có sẵn.',
        },
        {
          title: 'Minh họa động',
          description: 'Di chuyển các phần của minh họa theo đường, biến các hình vào nhau và xuất GIF cho chat hoặc email.',
        },
      ],
      workedExamples: [
        {
          title: 'Logo vẽ dần trong 2 giây dưới dạng SVG động',
          body: 'Một logo chữ gồm vài đường path với bộ tạo hoạt ảnh Vẽ dần kéo dài 2.000 ms, xuất thành SVG động. Vẽ dần là hoạt ảnh stroke-dasharray và stroke-dashoffset, thứ CSS biểu diễn được trên mọi trình duyệt lớn, nên bộ xuất ghi một khối <style> gồm @keyframes và hoàn toàn không có script. Tệp là SVG của bạn cộng thêm vài trăm byte CSS, phát ngay khi được đưa vào trang, và được tính là một lượt xuất svg_animated: không có tài khoản, đó là một trong 2 lượt mỗi ngày và nằm trong giới hạn độ dài 10 giây dành cho khách; với tài khoản miễn phí, là một trong 5 lượt. Bản xuất là một phép biến đổi chuỗi trong trình duyệt của bạn và hoàn tất ngay lập tức.',
        },
        {
          title: 'Vòng lặp biến hình 400 x 400 dưới dạng GIF',
          body: 'Một hoạt ảnh biến hình dài 2 giây trên vùng vẽ 400 x 400, xuất thành GIF ở 25 fps với gói Premium (GIF mặc định là định dạng của Premium). Hộp thoại giới hạn theo các mức chiều cao và tốc độ khung hình của gói; 25 fps cho độ trễ round(100 / 25) = 4 phần trăm giây mỗi khung hình và tổng cộng 50 khung hình. Kích thước ước tính là số điểm ảnh x số khung hình x 0,25 byte + 1 KB: 160.000 x 50 x 0,25 là khoảng 2 MB, cố ý ước tính cao, và đồ họa phẳng hai màu thường nhỏ hơn mức đó nhiều. Các khung hình được kết xuất trên luồng chính và mã hóa trong một Worker từng khung một, nên bộ nhớ chỉ chứa vài khung hình cộng với tệp đang lớn dần; thời gian chủ yếu dành cho việc raster hóa 50 khung hình SVG, vài giây trên một chiếc laptop.',
        },
      ],
      whenNotToUse: 'Motion tạo hoạt ảnh cho đồ họa vector; nó không chỉnh sửa video hay ảnh chụp. Nếu điểm khởi đầu của bạn là cảnh quay, Darkroom là trình biên tập phù hợp và trang chuyển video sang GIF sẽ biến một clip thành GIF. Đây cũng không phải công cụ vector hóa ảnh raster phức tạp: một bức ảnh chụp được dò thành đường path sẽ rất nặng và kết quả sẽ không tạo được hoạt ảnh có ý nghĩa. Hoạt ảnh phụ thuộc vào bộ lọc, hiệu ứng văn bản hoặc mặt nạ nâng cao sẽ không còn nguyên vẹn khi xuất Lottie (hộp thoại liệt kê những gì bị bỏ), nên với những mục tiêu đó, hãy dùng bản xuất SVG động, React hoặc JavaScript. Ngoài ra, đầu ra MP4 hoặc WebM phụ thuộc vào khả năng hỗ trợ WebCodecs của trình duyệt và vào gói của bạn, nên hãy xem bảng gói trước khi lên kế hoạch cho một sản phẩm video.',
      whyMediaManipulator: [
        'Một trình biên tập lớp và keyframe thực thụ với giữ, đường cong tùy chỉnh và bộ tạo hoạt ảnh nâng cao, không phải thư viện mẫu.',
        'Bản xuất cho cả nhà thiết kế lẫn lập trình viên: SVG động, Lottie, React, JavaScript hoặc TypeScript, Flutter và GIF từ một dự án duy nhất.',
        'Bản xuất được tạo trong trình duyệt của bạn, và mã bên thứ ba duy nhất mà bản xuất dùng đều có giấy phép thoáng (anime.js theo MIT; flutter_svg và webview_flutter cho Flutter), với thông báo giấy phép được giữ trong tệp.',
      ],
      privacyNote: 'Việc chỉnh sửa và xuất diễn ra trong trình duyệt của bạn; đồ họa của bạn không được tải lên để xuất. Không có tài khoản, dự án chỉ được lưu trong trình duyệt này. Nếu bạn đăng nhập và lưu dự án vào tài khoản, tài liệu đã được làm sạch (tối đa 4 MB) cùng một ảnh thu nhỏ được lưu trên máy chủ của chúng tôi như một dự án Darkroom, tuân theo thời gian lưu bạn chọn, và có thể bị xóa từ trang Tài khoản. Với mỗi lượt xuất được tính, chúng tôi chỉ ghi lại định dạng, chiều cao, tốc độ khung hình, độ dài và thời điểm của lượt đó, kèm tài khoản hoặc phiên của bạn với tư cách chủ sở hữu, để áp dụng hạn mức hằng ngày; bản ghi lượt xuất không bao giờ chứa đồ họa của bạn.',
      faq: [
        {
          question: 'Motion có miễn phí không?',
          answer: 'Có. Mở Motion, vẽ, tạo hoạt ảnh, lưu trong trình duyệt này và xuất SVG tĩnh đều miễn phí, không giới hạn và không cần tài khoản. Xuất hoạt ảnh được tính vào hạn mức hằng ngày tùy theo gói của bạn: mặc định là 2 lượt mỗi ngày khi không có tài khoản (chỉ SVG động), 5 lượt với tài khoản miễn phí, 30 lượt với Premium và 150 lượt với Pro. Bảng gói trên trang này hiển thị hạn mức và định dạng hiện hành của từng gói.',
        },
        {
          question: 'Tôi có thể xuất những định dạng nào?',
          answer: 'SVG tĩnh, SVG động (CSS, hoặc một script nhỏ nhúng kèm khi cần), Lottie JSON, component React (.tsx), module JavaScript hoặc TypeScript, widget Flutter (.dart) và GIF động. Theo mặc định, SVG động có ở mọi gói, Lottie có từ tài khoản miễn phí trở lên, còn React, JS/TS, Flutter và GIF có từ Premium trở lên. Gói của bạn bao gồm những định dạng nào, và số lượt xuất mỗi ngày, được hiển thị trong bảng gói trên trang này.',
        },
        {
          question: 'Giới hạn là gì?',
          answer: 'Lượt xuất hoạt ảnh được đếm theo ngày và đặt lại vào nửa đêm UTC; lượt xuất bị từ chối không được tính, nhưng lượt xuất bạn hủy sau khi đã bị tính thì vẫn được tính. Khách không có tài khoản chỉ lưu được dự án trong trình duyệt và có thể xuất hoạt ảnh dài tối đa 10 giây; tài khoản miễn phí lưu được 3 dự án vào tài khoản, Premium 25 dự án, Pro không giới hạn. Mỗi tệp SVG và Lottie nhập vào tối đa 4 MB, còn xuất GIF tối đa 50 fps và 2 GB đầu ra. Mọi con số hiện hành đều có trong bảng gói trên trang này và trên trang giá.',
        },
        {
          question: 'Tôi có thể tạo hoạt ảnh cho SVG có sẵn không?',
          answer: 'Có. Nhập bất kỳ SVG nào và các nhóm, đường path, hình, văn bản, chuyển màu, mặt nạ và đường cắt của nó trở thành các lớp có thể chỉnh sửa. Những phần trình biên tập không chỉnh sửa được, như pattern hoặc bộ lọc phức tạp, được giữ nguyên và xuất ra không đổi, còn bất cứ thứ gì không an toàn (script, trình xử lý sự kiện hoặc liên kết bên ngoài) đều bị gỡ bỏ và được liệt kê sau khi nhập.',
        },
        {
          question: 'Có hỗ trợ Lottie không?',
          answer: 'Có, theo cả hai chiều. Bạn có thể nhập tệp Lottie JSON để chỉnh sửa (lượt nhập được tính là một đơn vị, từ gói miễn phí trở lên), và xuất hoạt ảnh của mình thành Lottie JSON cho lottie-web và các trình phát Lottie trên iOS, Android và Flutter. Các tính năng mà một bên không biểu diễn được sẽ được liệt kê trong hộp thoại thay vì bị bỏ đi trong im lặng.',
        },
        {
          question: 'Trình duyệt nào hỗ trợ xuất video?',
          answer: 'Xuất GIF hoạt động trên mọi trình duyệt hiện đại. Xuất MP4 và WebM dựa vào WebCodecs, bộ mã hóa video tích hợp của trình duyệt, có trên Chrome và Edge và trên các phiên bản gần đây của Safari và Firefox tùy theo codec; hộp thoại xuất kiểm tra trình duyệt của bạn và báo khi không thể mã hóa. Bảng gói trên trang này hiển thị gói nào bao gồm từng định dạng video.',
        },
        {
          question: 'Giấy phép nào áp dụng cho mã xuất ra?',
          answer: 'Hoạt ảnh của bạn thuộc về bạn. Khi một SVG động hoặc bản xuất mã cần runtime, nó dùng anime.js, được cấp phép theo MIT; thông báo bản quyền của thư viện này được ghi ở đầu tệp và phải được giữ nguyên ở đó. Bản xuất Flutter dùng gói flutter_svg (MIT) hoặc webview_flutter (BSD-3-Clause). Mọi thứ còn lại trong tệp đều được tạo từ dự án của bạn. Các thư viện mã nguồn mở mà trình biên tập sử dụng được liệt kê trên trang giấy phép của chúng tôi.',
        },
        {
          question: 'Dự án của tôi được lưu ở đâu?',
          answer: 'Không có tài khoản, dự án chỉ được lưu trong trình duyệt này, nên xóa dữ liệu trình duyệt sẽ xóa luôn các dự án đó. Khi đã đăng nhập, bạn có thể lưu dự án vào tài khoản; khi đó dự án được đồng bộ giữa các thiết bị, tự động lưu trong lúc bạn làm việc, tuân theo thời gian lưu bạn đã chọn và có thể bị xóa từ trang Tài khoản.',
        },
      ],
      supportedFormats: {
        supportedInputFormats: [
          'SVG',
          'Lottie JSON',
          'Dự án Motion (.json)',
        ],
        supportedOutputFormats: [
          'SVG tĩnh',
          'SVG động',
          'Lottie JSON',
          'React (.tsx)',
          'JavaScript / TypeScript',
          'Flutter (.dart)',
          'GIF',
        ],
        maxFileNotes: [
          'Nhập SVG và Lottie tối đa 4 MB mỗi tệp.',
          'Dự án không có tài khoản chỉ tồn tại trong trình duyệt này; dự án trong tài khoản tuân theo thời gian lưu bạn chọn.',
        ],
        processingNotes: [
          'Chỉnh sửa, xem trước và mọi lần xuất đều chạy trong trình duyệt của bạn. Chỉ một số đếm cho mỗi lần xuất được gửi đến máy chủ của chúng tôi.',
        ],
      },
      embed: {
        title: 'Mở Motion',
        description: 'Bắt đầu bản vẽ mới hoặc mở lại bản gần đây. Trình biên tập mở toàn màn hình; công việc của bạn được lưu trong trình duyệt này, và người dùng đã đăng nhập có thể lưu vào tài khoản.',
      },
      related: [
        {
          label: 'Hướng dẫn Motion',
          to: '/tutorials/motion',
          description: 'Nhập SVG, tạo hoạt ảnh, định hình easing và xuất, từng bước một.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Chỉnh sửa video trên dòng thời gian đa track và xuất MP4.',
        },
        {
          label: 'Chuyển video thành GIF động',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Biến một đoạn video thành GIF khi hoạt ảnh của bạn bắt đầu từ cảnh quay.',
        },
        {
          label: 'Giấy phép mã nguồn mở',
          to: '/licenses',
          description: 'Các thư viện mà trình biên tập sử dụng và ghi vào bản xuất của bạn.',
        },
      ],
      metaTitle: 'Motion: Trình tạo hoạt ảnh SVG trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Tạo hoạt ảnh SVG trong trình duyệt: keyframe, easing, giữ, vẽ dần, đường chuyển động và biến hình. Xuất SVG động, Lottie JSON, React, JS, Flutter hoặc GIF.',
      ogTitle: 'Motion: Tạo hoạt ảnh SVG trong trình duyệt của bạn',
      ogDescription: 'Nhập hoặc vẽ một SVG, tạo hoạt ảnh trên dòng thời gian keyframe và xuất thành SVG động, Lottie JSON, React, JavaScript, Flutter hoặc GIF. Bản xuất được tạo trong trình duyệt của bạn.',
      featureList: [
        'Nhập SVG thành các lớp có thể chỉnh sửa',
        'Nhập Lottie JSON',
        'Công cụ hình chữ nhật, hình elip, đường thẳng, bút và văn bản',
        'Dòng thời gian keyframe với thiết lập easing, đường cong cubic-bezier tùy chỉnh và khóa giữ',
        'Bộ tạo hoạt ảnh vẽ dần nét, đường chuyển động, biến hình, chuyển màu, mặt nạ và làm mờ',
        'Xuất SVG tĩnh',
        'Xuất SVG động (CSS hoặc runtime anime.js nhúng sẵn)',
        'Xuất Lottie JSON',
        'Xuất mã React, JavaScript, TypeScript và Flutter',
        'Xuất GIF động',
        'Dự án được lưu trong trình duyệt hoặc vào tài khoản của bạn',
      ],
    },
    // 2026-10-28 catalog expansion: name + tagline for the /tools catalog cards (model-written, needs native review).
    'inspect-metadata': {
      name: 'Trình kiểm tra siêu dữ liệu',
      h1: 'Kiểm tra siêu dữ liệu tệp trực tuyến',
      tagline: 'Xem mọi thẻ ẩn trong ảnh, video, tệp âm thanh hoặc PDF: EXIF, vị trí GPS, máy ảnh, codec, ID3, XMP và nhiều hơn nữa, trước khi bạn chia sẻ.',
      metaTitle: 'Kiểm tra siêu dữ liệu tệp trực tuyến: EXIF, GPS, codec, ID3 | Media Manipulator',
      metaDescription: 'Trình kiểm tra siêu dữ liệu trực tuyến miễn phí cho ảnh, video, âm thanh và PDF. Xem EXIF, tọa độ GPS trên bản đồ, máy ảnh và ống kính, codec và bitrate, thẻ ID3, XMP và IPTC. Không cần đăng ký.',
      ogTitle: 'Kiểm tra siêu dữ liệu tệp trực tuyến',
      ogDescription: 'Mọi thẻ EXIF, GPS, codec, ID3 và XMP trong tệp của bạn, được phân nhóm và có thể tìm kiếm, với các thẻ riêng tư được đánh dấu.',
      intro: 'Tệp chứa nhiều thứ hơn điểm ảnh và mẫu âm thanh. Một bức ảnh chụp bằng điện thoại ghi lại nơi chụp, thời điểm chụp và thiết bị đã dùng; một video ghi tên bộ mã hóa và bitrate của nó; một tệp MP3 mang thẻ ID3 và ảnh bìa album; một tệp PDF lưu tên tác giả và phần mềm đã tạo ra nó. Trình kiểm tra siêu dữ liệu của Media Manipulator đọc tất cả những thông tin đó trên máy chủ của chúng tôi bằng ExifTool và ffprobe, nhóm chúng thành các mục máy ảnh, vị trí, thiết bị, thời gian, codec và tài liệu, đồng thời làm nổi bật những mục có thể nhận diện bạn, để bạn quyết định cần gỡ bỏ gì trước khi tệp rời khỏi tay mình.',
      whatItDoes: [
        'Đọc dữ liệu EXIF, GPS, IPTC, XMP và ICC từ ảnh JPG, PNG, WebP, HEIC, AVIF, TIFF và ảnh xuất từ RAW.',
        'Đọc dữ liệu định dạng chứa, luồng, codec, bitrate, tốc độ khung hình và chương từ MP4, MOV, MKV, WebM và các tệp video khác.',
        'Đọc thẻ ID3, Vorbis và MP4, ảnh bìa và thiết lập bộ mã hóa từ MP3, M4A, FLAC, OGG và WAV.',
        'Đọc tác giả, phần mềm tạo, ngày tạo và số trang từ tệp PDF.',
        'Hiển thị tọa độ GPS trên khung bản đồ và đánh dấu mọi mục nhạy cảm về quyền riêng tư.',
        'Cung cấp đầu ra thô của ExifTool và ffprobe, và sao chép bất kỳ khối nào chỉ với một cú nhấp.',
      ],
      flowSteps: [
        {
          title: 'Tải tệp lên',
          description: 'Ảnh, video, âm thanh hoặc PDF.',
        },
        {
          title: 'Chúng tôi đọc tệp',
          description: 'ExifTool và ffprobe chạy trên máy chủ của chúng tôi.',
        },
        {
          title: 'Xem báo cáo',
          description: 'Được phân nhóm, có thể tìm kiếm, với các mục riêng tư được đánh dấu.',
        },
        {
          title: 'Quyết định',
          description: 'Gỡ siêu dữ liệu bằng công cụ xóa EXIF nếu cần.',
        },
      ],
      advancedDetails: [
        'Ảnh và PDF được kiểm tra tự động; video và âm thanh trên 100 MB chờ bạn nhấp, để tệp lớn không bị tải lên ngoài ý muốn.',
        'Ảnh bìa nhúng trong tệp âm thanh được báo cáo dưới dạng một mục hình ảnh, không phải luồng video.',
        'Báo cáo dùng chung danh mục siêu dữ liệu với công cụ xóa EXIF và trình kiểm tra kết quả trên mọi lần chuyển đổi.',
      ],
      whyItMatters: [
        'Một bức ảnh chia sẻ từ điện thoại có thể làm lộ địa chỉ nhà bạn qua các thẻ GPS.',
        'Biết codec, bitrate và tốc độ khung hình thực của video sẽ giải thích vì sao nó phát được hoặc không phát được ở đâu đó.',
        'Siêu dữ liệu tài liệu ghi tên tác giả và phần mềm chỉnh sửa, điều quan trọng với bất cứ thứ gì bạn đăng tải ẩn danh.',
      ],
      useCases: [
        {
          title: 'Trước khi đăng ảnh',
          description: 'Kiểm tra tọa độ GPS và số sê-ri của thiết bị.',
        },
        {
          title: 'Gỡ lỗi video',
          description: 'Xem codec, profile, tốc độ khung hình và bố cục kênh âm thanh thực tế.',
        },
        {
          title: 'Kiểm tra tệp nhạc',
          description: 'Xác nhận thẻ, bitrate và liệu tệp có được chuyển mã từ bitrate thấp hơn hay không.',
        },
        {
          title: 'Xem xét tệp PDF',
          description: 'Xem trường tác giả ghi tên ai và phần mềm nào đã tạo ra tệp.',
        },
      ],
      whyMediaManipulator: [
        'Một trình kiểm tra duy nhất cho ảnh, video, âm thanh và PDF, thay vì bốn công cụ riêng lẻ.',
        'Các mục nhạy cảm về quyền riêng tư được đánh dấu, kèm đường dẫn trực tiếp để gỡ bỏ chúng.',
        'Không chuyển đổi, không cần tài khoản. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Tệp của bạn được ExifTool và ffprobe đọc trên máy chủ của chúng tôi, báo cáo được gửi về trình duyệt của bạn, và bản sao tạm thời bị xóa ngay khi báo cáo được tạo xong. Không bên thứ ba nào thấy tệp hay các thẻ của nó. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Kiểm tra tệp có làm thay đổi tệp không?',
          answer: 'Không. Tệp được đọc, lập báo cáo và bị xóa sau khi phân tích. Không có gì được ghi ngược lại.',
        },
        {
          question: 'Tôi có thể xóa những gì trình kiểm tra tìm thấy không?',
          answer: 'Có. Dùng công cụ Xóa siêu dữ liệu EXIF cho ảnh; công cụ này gỡ bỏ mọi thứ và hiển thị phần khác biệt trước và sau.',
        },
        {
          question: 'Vì sao video lớn cần phải nhấp?',
          answer: 'Video và âm thanh trên 100 MB chỉ được tải lên khi bạn yêu cầu, nên bạn không bao giờ gửi nhầm một tệp lớn.',
        },
        {
          question: 'Việc này có bị tính vào số lần chuyển đổi hằng ngày của tôi không?',
          answer: 'Không. Việc kiểm tra hoàn toàn miễn phí và không tiêu tốn tác vụ thường nào.',
        },
        {
          question: 'Dữ liệu có bị gửi cho bên thứ ba không?',
          answer: 'Không. ExifTool và ffprobe chạy trên máy chủ của chính chúng tôi, và tệp bị xóa sau đó.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Việc kiểm tra chỉ đọc và không được tính là một lần chuyển đổi.',
        ],
      },
      related: [
        {
          label: 'Xóa siêu dữ liệu EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Gỡ bỏ mọi thứ trình kiểm tra đã tìm thấy.',
        },
        {
          label: 'Chỉnh sửa siêu dữ liệu ảnh',
          to: '/tools/edit-image-metadata',
          description: 'Ghi lại tiêu đề, tác giả, bản quyền và GPS.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi có hoặc không kèm siêu dữ liệu.',
        },
      ],
      embed: {
        title: 'Kiểm tra một tệp',
        description: 'Thả vào một ảnh, video, tệp âm thanh hoặc PDF. Báo cáo nhóm mọi thẻ theo danh mục, đánh dấu những thẻ có thể nhận diện bạn hoặc vị trí của bạn, và cung cấp chế độ xem thô của ExifTool và ffprobe.',
      },
    },
    'edit-image-metadata': {
      name: 'Chỉnh sửa siêu dữ liệu ảnh',
      h1: 'Chỉnh sửa siêu dữ liệu ảnh trực tuyến',
      tagline: 'Đặt tiêu đề, tác giả, bản quyền, từ khóa và mô tả cho ảnh, sửa hoặc xóa vị trí GPS, và ghi lại các thẻ EXIF và IPTC.',
      metaTitle: 'Sửa siêu dữ liệu ảnh trực tuyến: EXIF, IPTC, bản quyền, GPS | Media Manipulator',
      metaDescription: 'Trình chỉnh sửa siêu dữ liệu ảnh trực tuyến miễn phí. Đặt tiêu đề, tác giả, bản quyền, mô tả và từ khóa, thay thế hoặc xóa vị trí GPS, và chỉnh sửa thẻ EXIF và IPTC trên JPG, PNG, WebP và nhiều định dạng khác.',
      ogTitle: 'Chỉnh sửa siêu dữ liệu ảnh trực tuyến',
      ogDescription: 'Ghi thông báo bản quyền, sửa vị trí, đặt từ khóa. Miễn phí, không cần đăng ký.',
      intro: 'Nhiếp ảnh gia cần có thông báo bản quyền và thông tin liên hệ trong mọi tệp họ giao. Các hãng ảnh muốn có từ khóa và chú thích IPTC. Bất kỳ ai chia sẻ ảnh cũng có thể muốn xóa vị trí, hoặc đặt nó ở mức thành phố thay vì ngay trước cửa nhà. Media Manipulator ghi lại trực tiếp các trường EXIF, IPTC và XMP trên máy chủ của chúng tôi bằng ExifTool, giữ nguyên dữ liệu hình ảnh và cho bạn xem phần khác biệt trước và sau.',
      whatItDoes: [
        'Đặt tiêu đề, tác giả/nghệ sĩ, mô tả, bản quyền, bình luận và từ khóa.',
        'Xóa vị trí GPS hoặc thay thế bằng tọa độ bạn chọn.',
        'Chỉnh sửa từng thẻ EXIF/TIFF, IPTC và thẻ nâng cao theo tên.',
        'Giữ nguyên điểm ảnh; tùy chọn chuyển đổi định dạng trong cùng một lượt.',
        'Hiển thị phần khác biệt về những gì đã thay đổi sau tác vụ.',
      ],
      flowSteps: [
        {
          title: 'Tải ảnh lên',
          description: 'JPG, PNG, WebP, HEIC, TIFF.',
        },
        {
          title: 'Điền các trường',
          description: 'Tiêu đề, tác giả, bản quyền, từ khóa, vị trí.',
        },
        {
          title: 'Áp dụng',
          description: 'ExifTool ghi lại các thẻ trên máy chủ của chúng tôi.',
        },
        {
          title: 'Tải xuống',
          description: 'So sánh trước và sau, rồi lưu lại.',
        },
      ],
      advancedDetails: [
        'Chế độ siêu dữ liệu tùy chỉnh ghi đồng thời các trường tương ứng trong EXIF (Artist, Copyright, ImageDescription), IPTC (Keywords, Caption) và XMP (dc:title, dc:creator) để mọi trình xem đều hiển thị giống nhau.',
        'Thay thế vị trí GPS sẽ ghi GPSLatitude/GPSLongitude với bán cầu tham chiếu chính xác; xóa vị trí sẽ xóa mọi thẻ GPS.',
        'PNG và WebP lưu siêu dữ liệu trong các khối văn bản và XMP; các trường tương tự được ghi vào đó.',
      ],
      whyItMatters: [
        'Thông báo bản quyền nhúng trong tệp sẽ đi theo tệp khi nó được đăng lại.',
        'Từ khóa và chú thích trong IPTC là thứ mà các hãng ảnh stock và hệ thống DAM dùng để lập chỉ mục.',
        'Vị trí được đặt ở mức thành phố bảo vệ nhà bạn mà vẫn giữ ảnh được gắn thẻ địa lý.',
      ],
      useCases: [
        {
          title: 'Giao ảnh cho khách hàng',
          description: 'Nhúng tên, bản quyền và thông tin liên hệ của bạn vào mọi tệp.',
        },
        {
          title: 'Gửi ảnh stock',
          description: 'Thêm từ khóa IPTC và chú thích.',
        },
        {
          title: 'Gắn thẻ địa lý ở mức tương đối',
          description: 'Thay một tọa độ GPS chính xác bằng trung tâm thành phố.',
        },
        {
          title: 'Sửa thẻ sai',
          description: 'Sửa tác giả hoặc ngày tháng mà máy quét đã ghi.',
        },
      ],
      whyMediaManipulator: [
        'Ghi đồng thời EXIF, IPTC và XMP, không chỉ một trong số đó.',
        'Phần khác biệt trước và sau để bạn thấy chính xác những gì đã thay đổi.',
      ],
      privacyNote: 'Các thẻ của ảnh được ExifTool ghi lại trên máy chủ của chúng tôi với các giá trị bạn đã nhập; điểm ảnh được giữ nguyên. Không bên thứ ba nào thấy tệp hay các thẻ của nó. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Chỉnh sửa siêu dữ liệu có mã hóa lại tệp JPG của tôi không?',
          answer: 'Chỉ khi bạn đổi định dạng đầu ra hoặc đổi kích thước. Với cùng định dạng và không chỉnh sửa điểm ảnh, dữ liệu hình ảnh được sao chép và chỉ các thẻ được ghi lại.',
        },
        {
          question: 'Tôi có thể xóa vị trí mà giữ nguyên mọi thứ khác không?',
          answer: 'Có. Đánh dấu "Xóa dữ liệu vị trí" và để nguyên các trường khác.',
        },
        {
          question: 'Tôi có thể chỉnh sửa một thẻ không có trong danh sách không?',
          answer: 'Có. Mở rộng phần nâng cao và đặt bất kỳ thẻ EXIF hoặc IPTC nào theo tên.',
        },
        {
          question: 'Làm sao để xóa toàn bộ thay vì chỉnh sửa?',
          answer: 'Dùng công cụ Xóa siêu dữ liệu EXIF, công cụ này gỡ bỏ mọi thẻ chỉ với một cú nhấp.',
        },
      ],
      related: [
        {
          label: 'Kiểm tra siêu dữ liệu',
          to: '/tools/inspect-metadata',
          description: 'Xem trước trong tệp có gì.',
        },
        {
          label: 'Xóa siêu dữ liệu EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Gỡ bỏ mọi thứ.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa các định dạng ảnh.',
        },
        {
          label: 'Cắt ảnh',
          to: '/tools/crop-image',
          description: 'Cắt lấy một vùng.',
        },
        {
          label: 'Đổi kích thước ảnh',
          to: '/tools/image-resizer',
          description: 'Thay đổi kích thước.',
        },
        {
          label: 'Thêm chữ vào ảnh',
          to: '/tools/add-text-to-image',
          description: 'Thêm chú thích hoặc hình mờ.',
        },
        {
          label: 'Bộ lọc ảnh',
          to: '/tools/image-filters',
          description: 'Sepia, phác họa, chạm nổi và nhiều hơn nữa.',
        },
      ],
      embed: {
        title: 'Chỉnh sửa siêu dữ liệu của ảnh',
        description: 'Tải ảnh lên. Phần siêu dữ liệu mở ở chế độ tùy chỉnh: điền tiêu đề, tác giả, bản quyền, từ khóa, thay thế hoặc xóa vị trí GPS, và mở rộng các thẻ nâng cao nếu cần. Điểm ảnh được giữ nguyên trừ khi bạn đổi cả định dạng.',
      },
    },
    'change-video-speed': {
      name: 'Đổi tốc độ video',
      h1: 'Đổi tốc độ video trực tuyến: tăng tốc hoặc làm chậm',
      tagline: 'Tạo video time-lapse ở 2x, 4x hoặc nhanh hơn, hoặc làm chậm clip xuống 0,5x hoặc 0,25x, âm thanh vẫn đồng bộ.',
      metaTitle: 'Đổi tốc độ video trực tuyến miễn phí: tua nhanh hoặc quay chậm | Media Manipulator',
      metaDescription: 'Công cụ đổi tốc độ video trực tuyến miễn phí. Tăng tốc video lên 1,5x, 2x hoặc 4x để tạo time-lapse, hoặc làm chậm xuống 0,5x hoặc 0,25x. Âm thanh vẫn đồng bộ. Xuất MP4, không hình mờ.',
      ogTitle: 'Đổi tốc độ video trực tuyến miễn phí',
      ogDescription: 'Tăng tốc hoặc làm chậm bất kỳ video nào từ 0,25x đến 4x. Âm thanh vẫn đồng bộ. Miễn phí, không cần đăng ký.',
      intro: 'Một bản ghi màn hình lê thê, cảnh hoàng hôn cần thành đoạn time-lapse mười giây, một cú trượt ván đáng được xem chậm: đổi tốc độ phát là một trong những thao tác chỉnh sửa video phổ biến nhất, và việc này không nên cần đến phần mềm chỉnh sửa trên máy tính. Media Manipulator căn lại thời gian cho cả hình ảnh lẫn âm thanh trên máy chủ của chúng tôi bằng FFmpeg, từ một phần tư tốc độ đến gấp bốn lần tốc độ, và xuất ra MP4 phát ở nhịp mới trên mọi thiết bị.',
      whatItDoes: [
        'Tăng tốc (1,25x đến 4x) hoặc làm chậm (0,25x đến 0,9x) bất kỳ video nào.',
        'Căn lại thời gian cho âm thanh bằng cách co giãn nhịp mà vẫn giữ nguyên cao độ, nên giọng nói vẫn tự nhiên.',
        'Giữ nguyên độ phân giải và chất lượng; mặc định xuất MP4 hoặc bất kỳ container nào được hỗ trợ.',
        'Kết hợp với cắt, đổi kích thước hoặc chỉnh màu trong cùng một lượt.',
      ],
      flowSteps: [
        {
          title: 'Tải video lên',
          description: 'Mọi định dạng video phổ biến.',
        },
        {
          title: 'Đặt tốc độ',
          description: 'Từ 0,25x đến 4x; mặc định chọn sẵn 2x.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg căn lại thời gian cho video và âm thanh.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu tệp MP4 mới.',
        },
      ],
      advancedDetails: [
        'Video dùng setpts để co giãn dấu thời gian hiển thị; âm thanh dùng atempo, được nối chuỗi cho các hệ số nằm ngoài khoảng 0,5 đến 2,0.',
        'Làm chậm không tự tạo ra khung hình mới; để có chuyển động chậm mượt mà, hãy dùng nội suy khung hình bằng AI sau khi làm chậm clip.',
        'Tốc độ khung hình được giữ nguyên, nên một đoạn time-lapse 4x chỉ còn một phần tư số khung hình gốc.',
      ],
      whyItMatters: [
        'Time-lapse và video tóm tắt dễ xem hơn nhiều ở tốc độ 2x đến 4x.',
        'Chuyển động chậm giúp người xem theo kịp các clip thể thao và hành động.',
        'Video hướng dẫn và bản ghi màn hình thường dễ theo dõi hơn ở 1,25x đến 1,5x.',
      ],
      useCases: [
        {
          title: 'Video time-lapse',
          description: 'Nén một giờ xây dựng, nấu ăn hay vẽ tranh vào vài phút.',
        },
        {
          title: 'Chuyển động chậm',
          description: 'Làm chậm clip thể thao hoặc thú cưng xuống một nửa tốc độ.',
        },
        {
          title: 'Video hướng dẫn nhanh hơn',
          description: 'Tăng tốc bản ghi màn hình mà giọng nói không bị the thé.',
        },
        {
          title: 'Khớp với bản nhạc',
          description: 'Nhích clip lên 1,1x cho vừa nhịp.',
        },
      ],
      whyMediaManipulator: [
        'Âm thanh được căn lại thời gian mà vẫn giữ nguyên cao độ, không bị lệch khỏi hình hay biến thành giọng the thé.',
        'Kết hợp với đảo ngược, cắt và chỉnh màu trên cùng một biểu mẫu.',
      ],
      privacyNote: 'Video của bạn được FFmpeg tăng tốc hoặc làm chậm trên máy chủ của chúng tôi, với nhịp âm thanh được thay đổi tương ứng. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Tệp gốc của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Âm thanh có còn đồng bộ không?',
          answer: 'Có. Âm thanh được co giãn nhịp theo cùng hệ số, với cao độ được giữ nguyên.',
        },
        {
          question: 'Tốc độ tối đa là bao nhiêu?',
          answer: 'Nhanh đến 4x và chậm đến 0,25x trong một lượt. Nếu cần hơn nữa, hãy cho kết quả chạy qua công cụ thêm một lần.',
        },
        {
          question: 'Chuyển động chậm có mượt không?',
          answer: 'Làm chậm sẽ lặp lại khung hình. Để có chuyển động chậm mượt thực sự, hãy làm chậm clip tại đây rồi dùng nội suy khung hình bằng AI.',
        },
        {
          question: 'Thay vào đó, tôi có thể tắt tiếng không?',
          answer: 'Có, hãy dùng công cụ Xóa âm thanh khỏi video trước, hoặc xuất ra GIF, định dạng vốn không có âm thanh.',
        },
      ],
      related: [
        {
          label: 'Nội suy khung hình bằng AI',
          to: '/tools/ai-frame-interpolation',
          description: 'Chuyển động chậm mượt mà nhờ các khung hình được tạo thêm.',
        },
        {
          label: 'Bộ chuyển đổi video',
          to: '/tools/video-converter',
          description: 'Chuyển đổi giữa các định dạng video.',
        },
        {
          label: 'Đảo ngược video',
          to: '/tools/reverse-video',
          description: 'Phát clip theo chiều ngược lại.',
        },
        {
          label: 'Lật video',
          to: '/tools/flip-video',
          description: 'Phản chiếu theo chiều ngang hoặc chiều dọc.',
        },
        {
          label: 'Ổn định video',
          to: '/tools/stabilize-video',
          description: 'Làm mượt cảnh quay bị rung.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Thu nhỏ dung lượng tệp.',
        },
        {
          label: 'Cắt video',
          to: '/tools/video-trimmer',
          description: 'Cắt lấy một đoạn.',
        },
      ],
      embed: {
        title: 'Đổi tốc độ của video',
        description: 'Tải video lên và đặt hệ số tốc độ: lớn hơn 1 là nhanh hơn, nhỏ hơn 1 là chậm hơn. Mặc định chọn sẵn 2x. Âm thanh được căn lại thời gian tương ứng, nên giọng nói đã tăng tốc vẫn nghe rõ.',
      },
    },
    'reverse-video': {
      name: 'Đảo ngược video',
      h1: 'Đảo ngược video trực tuyến miễn phí',
      tagline: 'Phát bất kỳ clip nào theo chiều ngược lại, có hoặc không đảo ngược âm thanh, và tùy chọn phát tiến rồi lùi (ping-pong).',
      metaTitle: 'Đảo ngược video trực tuyến miễn phí: phát ngược, ping-pong | Media Manipulator',
      metaDescription: 'Công cụ đảo ngược video trực tuyến miễn phí. Phát video theo chiều ngược lại, đảo ngược cả âm thanh, hoặc tạo vòng lặp ping-pong phát tiến rồi lùi. Xuất MP4 hoặc GIF, không hình mờ, không cần đăng ký.',
      ogTitle: 'Đảo ngược video trực tuyến miễn phí',
      ogDescription: 'Phát clip theo chiều ngược lại hoặc tạo vòng lặp tiến rồi lùi. Miễn phí, không cần đăng ký.',
      intro: 'Hiệu ứng video tua ngược còn lâu đời hơn cả internet và vẫn luôn hấp dẫn: kính vỡ tự liền lại, người nhảy cầu bật ngược lên khỏi hồ bơi, đám đông tụ lại thay vì tản ra. Media Manipulator đảo ngược các khung hình và, nếu bạn muốn, cả âm thanh của bất kỳ clip nào trên máy chủ của chúng tôi bằng FFmpeg, còn tùy chọn ping-pong nối thêm bản phát xuôi để kết quả lặp lại liền mạch, đúng điều mà hầu hết các nhu cầu trên mạng xã hội và GIF đều cần.',
      whatItDoes: [
        'Đảo ngược các khung hình của bất kỳ clip nào.',
        'Đảo ngược âm thanh cùng với hình, hoặc bỏ âm thanh để có kết quả không tiếng.',
        'Chế độ ping-pong phát tiến rồi lùi để tạo vòng lặp liền mạch.',
        'Xuất MP4, WebM hoặc GIF động.',
      ],
      flowSteps: [
        {
          title: 'Tải clip lên',
          description: 'Clip ngắn cho kết quả tốt nhất; việc đảo ngược nạp toàn bộ clip vào bộ nhớ.',
        },
        {
          title: 'Chọn đảo ngược hoặc ping-pong',
          description: 'Mặc định chọn sẵn đảo ngược.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg đảo ngược khung hình và âm thanh.',
        },
        {
          title: 'Tải xuống',
          description: 'MP4 cho video, GIF cho vòng lặp.',
        },
      ],
      advancedDetails: [
        'Việc đảo ngược phải đệm mọi khung hình của clip, nên clip rất dài hoặc 4K sẽ tốn nhiều thời gian và bộ nhớ hơn; hãy cắt trước để có kết quả tốt nhất.',
        'Âm thanh dùng bộ lọc areverse; để có clip đảo ngược không tiếng, hãy xóa âm thanh trước.',
        'Ping-pong nối luồng phát xuôi với luồng đảo ngược, làm thời lượng tăng gấp đôi.',
      ],
      whyItMatters: [
        'Clip tua ngược và boomerang là món quen thuộc của video ngắn trên mạng xã hội.',
        'Vòng lặp ping-pong che đi điểm cắt mà một vòng lặp thông thường sẽ để lộ.',
        'Đảo ngược cũng là cách đơn giản để tạo hiệu ứng chuyển cảnh "tua lại".',
      ],
      useCases: [
        {
          title: 'Vòng lặp kiểu boomerang',
          description: 'Biến một clip hai giây thành đoạn tới lui liền mạch.',
        },
        {
          title: 'Hé lộ theo chiều ngược',
          description: 'Phát ngược cảnh mở hộp hay quá trình lắp ráp.',
        },
        {
          title: 'Chuyển cảnh tua lại',
          description: 'Đảo ngược vài giây để chuyển giữa các cảnh.',
        },
        {
          title: 'GIF đảo ngược',
          description: 'Xuất thẳng ra GIF để dùng trong trò chuyện và diễn đàn.',
        },
      ],
      whyMediaManipulator: [
        'Đảo ngược và ping-pong chỉ bằng một công tắc, với âm thanh được xử lý đúng cách.',
        'Cắt trước và xuất GIF trên cùng một biểu mẫu.',
      ],
      privacyNote: 'Clip của bạn được FFmpeg giải mã và phát ngược vào một tệp mới trên máy chủ của chúng tôi. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Tệp gốc của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Âm thanh có bị đảo ngược theo không?',
          answer: 'Có, theo mặc định. Hãy xóa âm thanh trước nếu bạn muốn clip không tiếng.',
        },
        {
          question: 'Ping-pong là gì?',
          answer: 'Clip phát tiến rồi phát lùi, nên lặp lại mà không có bước nhảy nào lộ ra.',
        },
        {
          question: 'Có giới hạn độ dài không?',
          answer: 'Việc đảo ngược giữ toàn bộ clip trong bộ nhớ. Clip dài một hai phút thì không sao; với video dài hơn, hãy cắt trước.',
        },
        {
          question: 'Tôi có thể nhận GIF không?',
          answer: 'Có. Chọn GIF làm định dạng đầu ra; định dạng này rất hợp cho vòng lặp ping-pong.',
        },
      ],
      related: [
        {
          label: 'Video sang GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Tạo GIF lặp lại.',
        },
        {
          label: 'Bộ chuyển đổi video',
          to: '/tools/video-converter',
          description: 'Chuyển đổi giữa các định dạng video.',
        },
        {
          label: 'Đổi tốc độ video',
          to: '/tools/change-video-speed',
          description: 'Time-lapse hoặc chuyển động chậm.',
        },
        {
          label: 'Lật video',
          to: '/tools/flip-video',
          description: 'Phản chiếu theo chiều ngang hoặc chiều dọc.',
        },
        {
          label: 'Ổn định video',
          to: '/tools/stabilize-video',
          description: 'Làm mượt cảnh quay bị rung.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Thu nhỏ dung lượng tệp.',
        },
        {
          label: 'Cắt video',
          to: '/tools/video-trimmer',
          description: 'Cắt lấy một đoạn.',
        },
      ],
      embed: {
        title: 'Đảo ngược video',
        description: 'Tải clip lên. Tùy chọn đảo ngược đã được bật sẵn trong mục Hiệu ứng thời gian; thay vào đó, hãy bật ping-pong để có vòng lặp tiến rồi lùi. Xuất MP4 hoặc GIF.',
      },
    },
    'flip-video': {
      name: 'Lật và phản chiếu video',
      h1: 'Lật hoặc phản chiếu video trực tuyến miễn phí',
      tagline: 'Phản chiếu video theo chiều ngang để sửa webcam hoặc ảnh selfie bị ngược, hoặc lật theo chiều dọc, chỉ với một cú nhấp.',
      metaTitle: 'Lật hoặc phản chiếu video trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ lật video trực tuyến miễn phí. Phản chiếu video theo chiều ngang (sửa cảnh quay selfie và webcam bị ngược) hoặc lật theo chiều dọc. Xuất MP4, không hình mờ, không cần đăng ký.',
      ogTitle: 'Lật hoặc phản chiếu video trực tuyến miễn phí',
      ogDescription: 'Sửa video selfie bị ngược hoặc lật clip lộn ngược. Miễn phí, không cần đăng ký.',
      intro: 'Camera trước và webcam thường ghi lại hình ảnh phản chiếu: chữ bị ngược và đường ngôi tóc của bạn nằm sai bên. Chỉ cần phản chiếu clip một lần là mọi thứ trở lại đúng. Media Manipulator lật video theo chiều ngang hoặc chiều dọc trên máy chủ của chúng tôi bằng FFmpeg, mã hóa lại để phép lật được ghi thẳng vào khung hình, và xuất MP4 phát đúng chiều trên mọi trình phát.',
      whatItDoes: [
        'Phản chiếu video theo chiều ngang (trái-phải) hoặc lật theo chiều dọc (trên-dưới).',
        'Kết hợp với xoay 90°, 180° hoặc 270° trong cùng một lượt.',
        'Ghi phép biến đổi thẳng vào khung hình; không phụ thuộc vào cờ xoay.',
        'Mặc định xuất MP4, hoặc bất kỳ container nào được hỗ trợ.',
      ],
      flowSteps: [
        {
          title: 'Tải video lên',
          description: 'Mọi định dạng phổ biến.',
        },
        {
          title: 'Chọn kiểu lật',
          description: 'Mặc định chọn sẵn lật ngang; thêm lật dọc hoặc xoay.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg áp dụng hflip/vflip và mã hóa lại.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu tệp MP4 đã sửa.',
        },
      ],
      advancedDetails: [
        'Lật ngang dùng bộ lọc hflip, lật dọc dùng vflip; cả hai đều không làm sai lệch hình học và đều mã hóa lại các khung hình.',
        'Phản chiếu cộng với xoay 180° tương đương với lật dọc; bảng điều khiển cho phép bạn kết hợp chúng tùy ý.',
        'Đầu ra MP4 dùng H.264 + AAC + yuv420p + faststart.',
      ],
      whyItMatters: [
        'Video selfie bị phản chiếu khiến chữ trên màn hình không đọc được.',
        'Một số camera hành trình gắn lộn ngược cần lật dọc thay vì xoay.',
        'Một bản phản chiếu là cách nhanh để video hướng dẫn nhảy hoặc tập thể dục dễ làm theo hơn.',
      ],
      useCases: [
        {
          title: 'Sửa video selfie bị ngược',
          description: 'Giúp chữ và logo hiển thị đúng chiều.',
        },
        {
          title: 'Camera gắn lộn ngược',
          description: 'Lật cảnh quay từ camera bị đặt ngược.',
        },
        {
          title: 'Phản chiếu cho video hướng dẫn',
          description: 'Phản chiếu phần trình diễn để người xem có thể làm theo trực tiếp.',
        },
        {
          title: 'Khớp cảnh quay',
          description: 'Phản chiếu clip để chủ thể quay mặt về hướng ngược lại.',
        },
      ],
      whyMediaManipulator: [
        'Lật và xoay trong cùng một mục biến đổi, ghi thẳng vào khung hình.',
        'Cắt, đổi kích thước và chỉnh màu trong cùng một lần tải lên.',
      ],
      privacyNote: 'Video của bạn được FFmpeg phản chiếu theo chiều ngang hoặc chiều dọc trên máy chủ của chúng tôi. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Tệp gốc của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Phản chiếu và lật khác nhau thế nào?',
          answer: 'Phản chiếu (lật ngang) hoán đổi trái và phải. Lật dọc hoán đổi trên và dưới.',
        },
        {
          question: 'Phép lật có được áp dụng vĩnh viễn không?',
          answer: 'Có. Các khung hình được mã hóa lại với phép lật đã áp dụng, nên mọi trình phát đều hiển thị đúng như vậy.',
        },
        {
          question: 'Tôi có thể xoay luôn không?',
          answer: 'Có. Tùy chọn xoay nằm trong cùng mục Biến đổi hình học, hoặc bạn có thể dùng công cụ Xoay video chuyên dụng.',
        },
        {
          question: 'Lật có làm giảm chất lượng không?',
          answer: 'Việc mã hóa lại có chút hao hụt; hãy chọn chất lượng cao để mức hao hụt không đáng kể.',
        },
      ],
      related: [
        {
          label: 'Xoay video',
          to: '/tools/rotate-video',
          description: '90°, 180°, 270°.',
        },
        {
          label: 'Bộ chuyển đổi video',
          to: '/tools/video-converter',
          description: 'Chuyển đổi giữa các định dạng video.',
        },
        {
          label: 'Đổi tốc độ video',
          to: '/tools/change-video-speed',
          description: 'Time-lapse hoặc chuyển động chậm.',
        },
        {
          label: 'Đảo ngược video',
          to: '/tools/reverse-video',
          description: 'Phát clip theo chiều ngược lại.',
        },
        {
          label: 'Ổn định video',
          to: '/tools/stabilize-video',
          description: 'Làm mượt cảnh quay bị rung.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Thu nhỏ dung lượng tệp.',
        },
        {
          label: 'Cắt video',
          to: '/tools/video-trimmer',
          description: 'Cắt lấy một đoạn.',
        },
      ],
      embed: {
        title: 'Lật hoặc phản chiếu video',
        description: 'Tải video lên. Lật ngang (phản chiếu) đã được chọn sẵn trong mục Biến đổi hình học; hãy bật lật dọc để thay thế hoặc bật thêm. Tùy chọn xoay có sẵn trong cùng mục.',
      },
    },
    'stabilize-video': {
      name: 'Ổn định video',
      h1: 'Ổn định video bị rung trực tuyến miễn phí',
      tagline: 'Làm mượt rung tay và độ nảy khi đi bộ bằng bộ ổn định hai lượt, không cần chân máy hay phần mềm chỉnh sửa trên máy tính.',
      metaTitle: 'Ổn định video bị rung trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ ổn định video trực tuyến miễn phí. Giảm rung tay và độ nảy khi đi bộ bằng tính năng làm mượt chuyển động của FFmpeg. Cường độ tùy chỉnh được, xuất MP4, không hình mờ, không cần đăng ký.',
      ogTitle: 'Ổn định video bị rung trực tuyến miễn phí',
      ogDescription: 'Làm mượt hiện tượng rung máy trong bất kỳ clip nào. Miễn phí, không cần đăng ký.',
      intro: 'Cảnh quay cầm tay thường bị rung, và chút rung nhỏ sẽ thành rung mạnh trên màn hình lớn. Phần mềm ổn định hình ảnh theo dõi chuyển động giữa các khung hình, làm mượt đường đi của camera và cắt bớt một chút ở các cạnh để che phần hiệu chỉnh. Media Manipulator chạy bộ ổn định bù chuyển động của FFmpeg trên máy chủ của chúng tôi với cường độ tùy chỉnh được, nên một vlog vừa đi vừa quay hay một clip điện thoại phóng to sẽ ổn định hơn rõ rệt.',
      whatItDoes: [
        'Phân tích chuyển động giữa các khung hình và làm mượt đường đi của camera.',
        'Tùy chỉnh độ rung (mức rung dự kiến) và độ chính xác (mức độ tìm kiếm kỹ lưỡng).',
        'Cắt nhẹ để che phần hiệu chỉnh; mức thu phóng được áp dụng tự động.',
        'Mặc định xuất MP4; kết hợp với cắt và chỉnh màu trong cùng một lượt.',
      ],
      flowSteps: [
        {
          title: 'Tải clip bị rung lên',
          description: 'Mọi định dạng phổ biến.',
        },
        {
          title: 'Giữ nguyên hoặc tinh chỉnh cường độ',
          description: 'Thiết lập mặc định phù hợp với cảnh quay điện thoại cầm tay.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg ước tính và bù chuyển động.',
        },
        {
          title: 'Tải xuống',
          description: 'So sánh với kết quả đã ổn định hơn.',
        },
      ],
      advancedDetails: [
        'Dùng bộ lọc bù chuyển động deshake của FFmpeg; giá trị độ rung đặt phạm vi tìm kiếm, còn độ chính xác đặt độ sâu tìm kiếm.',
        'Ổn định hình ảnh không thể sửa hiện tượng nhòe chuyển động đã có sẵn trong khung hình; nó chỉ loại bỏ hiện tượng giật giữa các khung hình.',
        'Phần bị cắt nhỏ ở các cạnh sẽ tỷ lệ với mức độ di chuyển của camera.',
      ],
      whyItMatters: [
        'Cảnh quay ổn định trông chuyên nghiệp hơn và dễ xem hơn.',
        'Clip điện thoại quay khi đang đi bộ là trường hợp phổ biến nhất và cho kết quả tốt.',
        'Clip đã ổn định nén hiệu quả hơn, vì phần hình thay đổi giữa các khung hình ít hơn.',
      ],
      useCases: [
        {
          title: 'Vlog vừa đi vừa quay',
          description: 'Loại bỏ độ nảy khỏi đoạn vừa đi vừa nói quay cầm tay.',
        },
        {
          title: 'Video điện thoại phóng to',
          description: 'Ổn định clip buổi hòa nhạc hoặc động vật hoang dã quay ở mức phóng to tối đa.',
        },
        {
          title: 'Gắn trên ô tô hoặc xe đạp',
          description: 'Giảm rung từ giá gắn trên bảng điều khiển hoặc ghi đông.',
        },
        {
          title: 'Trước khi làm GIF',
          description: 'Ổn định trước để vòng lặp không bị giật.',
        },
      ],
      whyMediaManipulator: [
        'Bù chuyển động thực sự, với cường độ được hiển thị rõ thay vì bị ẩn đi.',
        'Cắt, tốc độ và màu sắc trên cùng một biểu mẫu.',
      ],
      privacyNote: 'Cảnh quay của bạn được bộ lọc deshake của FFmpeg phân tích độ rung và làm mượt trên máy chủ của chúng tôi. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Tệp gốc của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Video của tôi có bị cắt không?',
          answer: 'Có, một chút. Bộ ổn định dịch chuyển khung hình để triệt tiêu rung và phóng to nhẹ để che các cạnh bị dịch chuyển.',
        },
        {
          question: 'Công cụ có sửa được ảnh nhòe không?',
          answer: 'Không. Độ nhòe bên trong một khung hình không thể khôi phục; ổn định hình ảnh chỉ làm vững chuyển động giữa các khung hình.',
        },
        {
          question: 'Tôi nên dùng thiết lập nào?',
          answer: 'Hãy bắt đầu với thiết lập mặc định. Tăng độ rung với cảnh quay rất chao đảo; tăng độ chính xác nếu kết quả vẫn bị trôi.',
        },
        {
          question: 'Có dùng được với 4K không?',
          answer: 'Có, nhưng thời gian xử lý lâu hơn. Hãy cân nhắc đổi kích thước xuống 1080p trong cùng lượt.',
        },
      ],
      related: [
        {
          label: 'Phục hồi video bằng AI',
          to: '/tools/ai-video-restoration',
          description: 'Khử nhiễu, khử nhòe và nâng độ phân giải bằng AI.',
        },
        {
          label: 'Bộ chuyển đổi video',
          to: '/tools/video-converter',
          description: 'Chuyển đổi giữa các định dạng video.',
        },
        {
          label: 'Đổi tốc độ video',
          to: '/tools/change-video-speed',
          description: 'Time-lapse hoặc chuyển động chậm.',
        },
        {
          label: 'Đảo ngược video',
          to: '/tools/reverse-video',
          description: 'Phát clip theo chiều ngược lại.',
        },
        {
          label: 'Lật video',
          to: '/tools/flip-video',
          description: 'Phản chiếu theo chiều ngang hoặc chiều dọc.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Thu nhỏ dung lượng tệp.',
        },
        {
          label: 'Cắt video',
          to: '/tools/video-trimmer',
          description: 'Cắt lấy một đoạn.',
        },
      ],
      embed: {
        title: 'Ổn định video',
        description: 'Tải clip bị rung lên. Tính năng chống rung đã được bật sẵn trong mục Hiệu ứng thời gian; hãy chỉnh độ rung và độ chính xác nếu mức mặc định quá nhẹ hoặc cắt quá nhiều.',
      },
    },
    'change-video-frame-rate': {
      name: 'Đổi tốc độ khung hình video',
      h1: 'Đổi tốc độ khung hình video trực tuyến',
      tagline: 'Chuyển video sang 24, 25, 30 hoặc 60 fps, hạ clip 60 fps xuống 30 để có tệp nhỏ hơn, hoặc khớp với tốc độ khung hình của dự án.',
      metaTitle: 'Đổi tốc độ khung hình video (24, 30, 60 fps) | Media Manipulator',
      metaDescription: 'Công cụ đổi tốc độ khung hình trực tuyến miễn phí. Chuyển video sang 24, 25, 30, 50 hoặc 60 fps, hạ 60 fps xuống 30 để có tệp nhỏ hơn, hoặc khớp với dòng thời gian chỉnh sửa. Xuất MP4, không cần đăng ký.',
      ogTitle: 'Đổi tốc độ khung hình video trực tuyến',
      ogDescription: 'Chuyển bất kỳ video nào sang 24, 25, 30 hoặc 60 fps. Miễn phí, không cần đăng ký.',
      intro: 'Tốc độ khung hình quyết định cảm giác của video và dung lượng của nó. Phim điện ảnh là 24 fps, truyền hình châu Âu là 25, hầu hết điện thoại là 30 hoặc 60, và trộn lẫn chúng trên cùng một dòng thời gian sẽ gây giật hình. Media Manipulator lấy mẫu lại bất kỳ video nào về tốc độ khung hình bạn cần trên máy chủ của chúng tôi bằng FFmpeg, bỏ bớt hoặc lặp lại khung hình một cách chính xác, và xuất MP4. Khi bạn muốn nhiều khung hình hơn chứ không phải ít đi, công cụ nội suy khung hình bằng AI sẽ tạo ra các khung hình trung gian.',
      whatItDoes: [
        'Lấy mẫu lại video về bất kỳ tốc độ khung hình nào từ 1 đến 120 fps.',
        'Giảm một nửa từ 60 fps xuống 30 để có tệp nhỏ hơn nhiều mà không có khác biệt nào nhìn thấy được với hầu hết nội dung.',
        'Khớp với tốc độ khung hình của dự án (24, 25, 29,97, 30, 50, 60) trước khi nhập vào trình chỉnh sửa.',
        'Giữ nguyên độ phân giải, âm thanh và thời lượng.',
      ],
      flowSteps: [
        {
          title: 'Tải video lên',
          description: 'Mọi định dạng phổ biến.',
        },
        {
          title: 'Đặt fps mục tiêu',
          description: 'Mặc định chọn sẵn 30.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg bỏ bớt hoặc nhân đôi khung hình cho khớp.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu tệp MP4 đã lấy mẫu lại.',
        },
      ],
      advancedDetails: [
        'Dùng bộ lọc fps: khung hình được bỏ bớt hoặc nhân đôi theo dấu thời gian, nên thời lượng và độ đồng bộ âm thanh được giữ nguyên chính xác.',
        'Tăng lên (từ 30 lên 60) sẽ nhân đôi khung hình và không làm hình mượt hơn; hãy dùng nội suy khung hình bằng AI để có khung hình mới thực sự.',
        'Giảm xuống sẽ loại bỏ dữ liệu và không thể hoàn tác; hãy giữ lại bản gốc.',
      ],
      whyItMatters: [
        'Một clip điện thoại 60 fps có dung lượng gấp đôi bản 30 fps trong khi chất lượng nhìn thấy được như nhau với hầu hết nội dung.',
        'Tốc độ khung hình lẫn lộn trên dòng thời gian chỉnh sửa gây giật hình; chuẩn hóa trước sẽ tránh được điều đó.',
        'Một số nền tảng và thiết bị giới hạn hoặc yêu cầu một tốc độ khung hình cụ thể.',
      ],
      useCases: [
        {
          title: 'Thu nhỏ clip 60 fps',
          description: 'Hạ xuống 30 fps để gửi email, trò chuyện hoặc tải lên nhẹ hơn.',
        },
        {
          title: 'Chuẩn hóa để chỉnh sửa',
          description: 'Khớp mọi clip với tốc độ khung hình của dự án.',
        },
        {
          title: 'Cảm giác điện ảnh',
          description: 'Chuyển sang 24 fps để có nhịp hình như phim điện ảnh.',
        },
        {
          title: 'Phát sóng truyền hình',
          description: 'Chuyển sang 25 hoặc 50 fps cho các khu vực dùng PAL.',
        },
      ],
      whyMediaManipulator: [
        'Lấy mẫu lại chính xác theo dấu thời gian, giữ nguyên thời lượng và âm thanh.',
        'Có sẵn nội suy bằng AI khi bạn cần nhiều khung hình hơn chứ không phải ít đi.',
      ],
      privacyNote: 'Video của bạn được FFmpeg căn lại thời gian theo tốc độ khung hình bạn chọn trên máy chủ của chúng tôi. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Tệp gốc của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Video có bị ngắn đi hay dài ra không?',
          answer: 'Không. Thời lượng được giữ nguyên; khung hình được bỏ bớt hoặc lặp lại để đạt tốc độ mới.',
        },
        {
          question: 'Từ 30 lên 60 fps có trông mượt hơn không?',
          answer: 'Không với công cụ này, vì công cụ chỉ nhân đôi khung hình. Hãy dùng nội suy khung hình bằng AI để tạo khung hình trung gian thực sự.',
        },
        {
          question: 'Tôi nên chọn tốc độ khung hình nào?',
          answer: '30 fps cho hầu hết nội dung web và điện thoại, 24 cho cảm giác điện ảnh, 25 hoặc 50 cho phát sóng PAL, 60 cho game và thể thao.',
        },
        {
          question: 'Âm thanh có bị ảnh hưởng không?',
          answer: 'Không. Luồng âm thanh được sao chép hoặc mã hóa lại với cùng thời gian.',
        },
      ],
      related: [
        {
          label: 'Nội suy khung hình bằng AI',
          to: '/tools/ai-frame-interpolation',
          description: 'Tạo thêm khung hình lên đến 120 fps.',
        },
        {
          label: 'Bộ chuyển đổi video',
          to: '/tools/video-converter',
          description: 'Chuyển đổi giữa các định dạng video.',
        },
        {
          label: 'Đổi tốc độ video',
          to: '/tools/change-video-speed',
          description: 'Time-lapse hoặc chuyển động chậm.',
        },
        {
          label: 'Đảo ngược video',
          to: '/tools/reverse-video',
          description: 'Phát clip theo chiều ngược lại.',
        },
        {
          label: 'Lật video',
          to: '/tools/flip-video',
          description: 'Phản chiếu theo chiều ngang hoặc chiều dọc.',
        },
        {
          label: 'Ổn định video',
          to: '/tools/stabilize-video',
          description: 'Làm mượt cảnh quay bị rung.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Thu nhỏ dung lượng tệp.',
        },
        {
          label: 'Cắt video',
          to: '/tools/video-trimmer',
          description: 'Cắt lấy một đoạn.',
        },
      ],
      embed: {
        title: 'Đổi tốc độ khung hình của video',
        description: 'Tải video lên và đặt tốc độ khung hình mục tiêu trong mục Hiệu ứng thời gian; mặc định chọn sẵn 30 fps. Khung hình được bỏ bớt hoặc nhân đôi để đạt mục tiêu. Để có tốc độ cao hơn với các khung hình trung gian được tạo ra, hãy dùng nội suy khung hình bằng AI.',
      },
    },
    'adjust-video-color': {
      name: 'Chỉnh độ sáng và màu video',
      h1: 'Chỉnh độ sáng, độ tương phản và màu sắc video trực tuyến',
      tagline: 'Làm sáng clip tối, tăng độ tương phản và độ bão hòa, dịch sắc độ, hoặc áp dụng hiệu ứng làm mờ hay phong cách nghệ thuật, với thanh trượt và xem trước trực tiếp.',
      metaTitle: 'Chỉnh độ sáng, độ tương phản và độ bão hòa video trực tuyến | Media Manipulator',
      metaDescription: 'Công cụ chỉnh màu video trực tuyến miễn phí. Sửa độ sáng, độ tương phản, độ bão hòa, sắc độ, gamma và phơi sáng, thêm làm mờ hoặc làm nét, hoặc áp dụng phong cách nghệ thuật. Xuất MP4, không hình mờ, không cần đăng ký.',
      ogTitle: 'Chỉnh độ sáng và màu sắc video trực tuyến',
      ogDescription: 'Làm sáng, thêm độ tương phản, tăng màu sắc hoặc áp dụng phong cách cho bất kỳ clip nào. Miễn phí, không cần đăng ký.',
      intro: 'Clip quay trong nhà bị tối và ngả cam; video điện thoại nhạt nhòa cần thêm độ tương phản và màu sắc; clip dùng làm ảnh thu nhỏ cần một phong cách riêng. Media Manipulator áp dụng hiệu chỉnh độ sáng, độ tương phản, độ bão hòa, sắc độ, gamma và phơi sáng trên máy chủ của chúng tôi bằng FFmpeg, cùng với làm mờ, làm nét, hạt phim và một bộ bộ lọc nghệ thuật, rồi xuất MP4. Đó là một lượt chỉnh màu mà không cần mở trình chỉnh sửa.',
      whatItDoes: [
        'Thanh trượt độ sáng, độ tương phản, độ bão hòa và sắc độ từ -100 đến +100.',
        'Gamma, phơi sáng, vùng tối và vùng sáng để kiểm soát tông màu tinh tế hơn.',
        'Làm mờ Gaussian và làm mờ chuyển động, làm nét bằng unsharp mask, hạt phim và nhiễu.',
        'Các phong cách nghệ thuật như tranh sơn dầu, phác thảo và cổ điển.',
        'Kết hợp với cắt, đổi kích thước, tốc độ hoặc lật trong cùng một lượt.',
      ],
      flowSteps: [
        {
          title: 'Tải clip lên',
          description: 'Mọi định dạng phổ biến.',
        },
        {
          title: 'Kéo thanh trượt',
          description: 'Độ sáng, độ tương phản, độ bão hòa, sắc độ và nhiều hơn nữa.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg áp dụng bộ lọc eq và các bộ lọc hiệu ứng.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu tệp MP4 đã chỉnh màu.',
        },
      ],
      advancedDetails: [
        'Độ sáng, độ tương phản, độ bão hòa và gamma tương ứng với bộ lọc eq của FFmpeg; sắc độ dùng bộ lọc hue theo đơn vị độ.',
        'Làm nét dùng unsharp với bán kính, cường độ và ngưỡng; làm mờ dùng gblur hoặc làm mờ chuyển động có hướng.',
        'Để dùng 3D LUT, khóa màu (chroma key) hoặc chỉnh màu từng clip trên dòng thời gian, hãy dùng Darkroom.',
      ],
      whyItMatters: [
        'Hầu hết cảnh quay điện thoại đều đẹp hơn khi tăng nhẹ độ tương phản và độ bão hòa.',
        'Sửa phơi sáng trước khi tải lên giúp tránh việc nền tảng mã hóa lại làm hình tệ hơn.',
        'Phong cách nhất quán giữa các clip khiến bản dựng trông hoàn chỉnh.',
      ],
      useCases: [
        {
          title: 'Làm sáng clip tối',
          description: 'Tăng phơi sáng và vùng tối cho cảnh quay trong nhà.',
        },
        {
          title: 'Làm nổi bật clip nhạt nhòa',
          description: 'Thêm độ tương phản và độ bão hòa cho video điện thoại trông như quay ở chế độ log.',
        },
        {
          title: 'Sửa ám màu',
          description: 'Dịch sắc độ để loại bỏ sắc cam hoặc sắc xanh lá.',
        },
        {
          title: 'Tạo phong cách cho mạng xã hội',
          description: 'Áp dụng phong cách cổ điển, phác thảo hoặc tranh sơn dầu.',
        },
      ],
      whyMediaManipulator: [
        'Điều khiển tông màu, màu sắc và hiệu ứng trong cùng một mục, chứ không chỉ là một nút "tăng cường" duy nhất.',
        'Dùng Darkroom để chỉnh màu trên dòng thời gian với LUT khi bạn cần nhiều hơn.',
      ],
      privacyNote: 'Độ sáng, độ tương phản, độ bão hòa và gamma của video được FFmpeg thay đổi trên máy chủ của chúng tôi. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Tệp gốc của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Tôi có thể xem trước kết quả không?',
          answer: 'Các thanh trượt hiển thị giá trị của chúng; toàn bộ phần chỉnh màu được áp dụng khi chuyển đổi. Hãy cắt còn vài giây để thử nhanh, rồi chạy cả clip.',
        },
        {
          question: 'Tôi có thể áp dụng LUT không?',
          answer: 'Không phải ở đây. Darkroom, trình chỉnh sửa nhiều track của chúng tôi, hỗ trợ 3D LUT và chỉnh màu từng clip.',
        },
        {
          question: 'Công cụ này có sửa được cảnh quay bị dư sáng không?',
          answer: 'Công cụ có thể giảm vùng sáng, nhưng chi tiết đã bị cháy trắng thì không thể khôi phục.',
        },
        {
          question: 'Tôi có thể làm nét clip bị mềm không?',
          answer: 'Có. Hãy dùng các điều khiển unsharp mask; để khôi phục chi tiết thực sự, hãy thử phục hồi video bằng AI.',
        },
      ],
      related: [
        {
          label: 'Trình chỉnh sửa video Darkroom',
          to: '/tools/content-studio',
          description: 'Chỉnh màu bằng LUT trên dòng thời gian.',
        },
        {
          label: 'Phục hồi video bằng AI',
          to: '/tools/ai-video-restoration',
          description: 'Khử nhiễu và nâng độ phân giải bằng AI.',
        },
        {
          label: 'Bộ chuyển đổi video',
          to: '/tools/video-converter',
          description: 'Chuyển đổi giữa các định dạng video.',
        },
        {
          label: 'Đổi tốc độ video',
          to: '/tools/change-video-speed',
          description: 'Time-lapse hoặc chuyển động chậm.',
        },
        {
          label: 'Đảo ngược video',
          to: '/tools/reverse-video',
          description: 'Phát clip theo chiều ngược lại.',
        },
        {
          label: 'Lật video',
          to: '/tools/flip-video',
          description: 'Phản chiếu theo chiều ngang hoặc chiều dọc.',
        },
        {
          label: 'Ổn định video',
          to: '/tools/stabilize-video',
          description: 'Làm mượt cảnh quay bị rung.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Thu nhỏ dung lượng tệp.',
        },
        {
          label: 'Cắt video',
          to: '/tools/video-trimmer',
          description: 'Cắt lấy một đoạn.',
        },
      ],
      embed: {
        title: 'Chỉnh màu video',
        description: 'Tải clip lên. Mục Hiệu ứng hình ảnh mở ra với các thanh trượt độ sáng, độ tương phản, độ bão hòa, sắc độ, gamma và phơi sáng, cùng làm mờ, làm nét, nhiễu và các phong cách nghệ thuật. Xuất MP4.',
      },
    },
    'convert-video-to-hevc': {
      name: 'Chuyển video sang HEVC (H.265)',
      h1: 'Chuyển video sang HEVC / H.265 trực tuyến',
      tagline: 'Mã hóa lại bất kỳ video nào sang H.265 để có dung lượng chỉ bằng khoảng một nửa H.264 ở cùng chất lượng, phù hợp để lưu trữ, 4K và thiết bị hiện đại.',
      metaTitle: 'Chuyển video sang HEVC (H.265) trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển đổi H.265 / HEVC trực tuyến miễn phí. Mã hóa lại MP4, MOV, MKV hoặc WebM sang HEVC để có dung lượng khoảng một nửa ở cùng chất lượng. Chọn một mức chất lượng thiết lập sẵn. Không hình mờ, không cần đăng ký.',
      ogTitle: 'Chuyển video sang HEVC / H.265 trực tuyến',
      ogDescription: 'Giảm một nửa dung lượng video bằng H.265. Miễn phí, không cần đăng ký.',
      intro: 'HEVC, còn gọi là H.265, là thế hệ kế tiếp của H.264. Ở cùng chất lượng hình ảnh, codec này cần ít hơn khoảng 40 đến 50 phần trăm số bit, đó là lý do điện thoại quay 4K bằng HEVC và đây là định dạng được ưa chuộng để lưu trữ cảnh quay. Media Manipulator mã hóa lại bất kỳ video nào sang HEVC trên máy chủ của chúng tôi bằng bộ mã hóa x265 của FFmpeg ở mức chất lượng bạn chọn, trong container MP4 mà iPhone, Mac, Windows 10+, Android và TV đời mới đều phát được.',
      whatItDoes: [
        'Mã hóa lại bất kỳ video đầu vào nào thành H.265 trong container MP4.',
        'Ba mức chất lượng thiết lập sẵn tương ứng với các giá trị CRF; dung lượng tệp giảm khoảng một nửa so với H.264.',
        'Giữ nguyên độ phân giải và tốc độ khung hình; có thể tùy chọn giảm 4K xuống 1080p để có tệp nhỏ hơn nhiều.',
        'Âm thanh được mã hóa lại thành AAC.',
      ],
      flowSteps: [
        {
          title: 'Tải video lên',
          description: 'Mọi định dạng phổ biến, kể cả MP4 H.264.',
        },
        {
          title: 'Chọn chất lượng',
          description: 'Nhỏ nhất, cân bằng hoặc chất lượng cao.',
        },
        {
          title: 'Chuyển đổi',
          description: 'x265 mã hóa trên máy chủ của chúng tôi; chậm hơn H.264.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu tệp .mp4 chứa HEVC bên trong.',
        },
      ],
      advancedDetails: [
        'Mã hóa bằng libx265 với CRF 28 (cân bằng), 32 (nhỏ nhất) hoặc 24 (chất lượng cao), preset medium, thẻ hvc1 để tương thích với Apple.',
        'Mã hóa HEVC chậm hơn H.264 nhiều lần; tệp 4K dài sẽ mất vài phút.',
        'Trình duyệt: Safari và Edge phát được HEVC; Chrome và Firefox nhìn chung thì không. Hãy giữ H.264 cho video nhúng trên web.',
      ],
      whyItMatters: [
        'Chỉ tốn một nửa dung lượng lưu trữ cho cùng chất lượng, cộng dồn trên cả thư viện là con số đáng kể.',
        'Việc phân phối 4K và HDR trên hầu hết thiết bị đã được chuẩn hóa theo HEVC.',
        'Tệp nhỏ hơn tải lên và đồng bộ nhanh hơn.',
      ],
      useCases: [
        {
          title: 'Lưu trữ cảnh quay',
          description: 'Giảm một nửa dung lượng thư viện ảnh và video mà không mất chất lượng thấy được.',
        },
        {
          title: 'Chia sẻ video 4K',
          description: 'Làm clip 4K đủ nhỏ để gửi đi.',
        },
        {
          title: 'Hệ sinh thái Apple',
          description: 'Khớp với các tệp HEVC mà iPhone vốn đã quay.',
        },
        {
          title: 'Giải phóng ổ đĩa',
          description: 'Chuyển các bản ghi H.264 cũ sang HEVC.',
        },
      ],
      whyMediaManipulator: [
        'x265 với các mức CRF thiết lập sẵn hợp lý và gắn thẻ tương thích với Apple.',
        'Cùng bảng điều khiển này cũng nén sang H.264, VP9 hoặc AV1 nếu bạn cần các định dạng đó.',
      ],
      privacyNote: 'Video của bạn được FFmpeg mã hóa lại sang H.265 (HEVC) trên máy chủ của chúng tôi. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Tệp gốc của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'HEVC có phát được ở mọi nơi không?',
          answer: 'iPhone, Mac, Windows 10+, Android 5+, TV đời mới và Safari/Edge đều phát được. Chrome, Firefox và các thiết bị cũ thường không phát được; hãy giữ H.264 cho những trường hợp đó.',
        },
        {
          question: 'Tệp sẽ nhỏ đi bao nhiêu?',
          answer: 'Thường nhỏ hơn 40 đến 50 phần trăm so với H.264 ở cùng chất lượng; còn nhỏ hơn nữa với nội dung đơn giản.',
        },
        {
          question: 'Chất lượng có kém đi không?',
          answer: 'Ở mức cân bằng, khác biệt không nhìn thấy được với hầu hết nội dung. Hãy chọn chất lượng cao cho cảnh quay bạn sẽ còn chỉnh sửa lại.',
        },
        {
          question: 'Tại sao lại chậm?',
          answer: 'x265 xử lý nhiều hơn hẳn trên mỗi khung hình so với x264. Đó là cái giá cho tệp nhỏ hơn.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Mã hóa HEVC tốn nhiều CPU; hãy dự kiến vài phút với nguồn dài hoặc 4K.',
        ],
      },
      related: [
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Nén bằng H.264, VP9 hoặc AV1.',
        },
        {
          label: 'Bộ chuyển đổi video',
          to: '/tools/video-converter',
          description: 'MP4 H.264 tiêu chuẩn.',
        },
        {
          label: 'Bộ chuyển đổi video',
          to: '/tools/video-converter',
          description: 'Chuyển đổi giữa các định dạng video.',
        },
        {
          label: 'Đổi tốc độ video',
          to: '/tools/change-video-speed',
          description: 'Time-lapse hoặc chuyển động chậm.',
        },
        {
          label: 'Đảo ngược video',
          to: '/tools/reverse-video',
          description: 'Phát clip theo chiều ngược lại.',
        },
        {
          label: 'Lật video',
          to: '/tools/flip-video',
          description: 'Phản chiếu theo chiều ngang hoặc chiều dọc.',
        },
        {
          label: 'Ổn định video',
          to: '/tools/stabilize-video',
          description: 'Làm mượt cảnh quay bị rung.',
        },
        {
          label: 'Cắt video',
          to: '/tools/video-trimmer',
          description: 'Cắt lấy một đoạn.',
        },
      ],
      embed: {
        title: 'Chuyển video sang HEVC',
        description: 'Tải video lên. Codec được đặt là H.265 trong container MP4 với mức cân bằng; bạn có thể chọn mức nhỏ nhất hoặc chất lượng cao thay thế. Thiết bị cũ và một số trình duyệt không phát được HEVC; hãy giữ một bản H.264 cho những trường hợp đó.',
      },
    },
    'convert-audio-to-wav': {
      name: 'Chuyển âm thanh sang WAV',
      h1: 'Chuyển âm thanh sang WAV trực tuyến miễn phí',
      tagline: 'Chuyển MP3, M4A, WAV, OGG, FLAC và mọi tệp âm thanh khác sang WAV mà không mất gì.',
      metaTitle: 'Chuyển âm thanh sang WAV trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển âm thanh sang WAV trực tuyến miễn phí. Tải lên MP3, WAV, M4A, OGG, FLAC hoặc AAC và tải về WAV. Đầu ra không mất dữ liệu. Không hình mờ, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển âm thanh sang WAV trực tuyến miễn phí',
      ogDescription: 'Tải lên bất kỳ tệp âm thanh nào và tải về WAV. Không mất dữ liệu. Miễn phí, không cần đăng ký.',
      intro: 'WAV là âm thanh PCM không nén: mọi mẫu được lưu nguyên trạng, nên không mất gì và mọi trình chỉnh sửa, DAW hay sampler đều mở được ngay. Media Manipulator chuyển bất kỳ định dạng âm thanh phổ biến nào sang WAV chỉ với một lần tải lên, giữ nguyên tần số lấy mẫu và bố cục kênh trừ khi bạn thay đổi, đồng thời cung cấp tính năng cắt, chuẩn hóa, EQ và các công cụ làm sạch bằng AI trên cùng một biểu mẫu.',
      whatItDoes: [
        'Chuyển MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3 và WMA sang WAV.',
        'Giữ lại mọi mẫu: đầu ra giải mã ra đúng y như những gì đã đưa vào.',
        'Có thể áp dụng cắt, âm lượng, chuẩn hóa, EQ và hiệu ứng trước khi ghi dữ liệu PCM.',
        'Tính năng làm sạch bằng AI nằm trên cùng biểu mẫu: loại bỏ tiếng ồn nền, làm sạch giọng nói, hoặc tách hay xóa giọng hát trước khi lưu thành WAV.',
      ],
      flowSteps: [
        {
          title: 'Tải âm thanh lên',
          description: 'Mọi tệp âm thanh phổ biến, có nén hay không nén.',
        },
        {
          title: 'Điều chỉnh nếu cần',
          description: 'Cắt, chuẩn hóa hoặc áp dụng hiệu ứng.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg mã hóa WAV trên máy chủ của chúng tôi.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu tệp WAV.',
        },
      ],
      advancedDetails: [
        'Đầu ra WAV được mã hóa bằng bộ mã hóa pcm_s16le gốc của FFmpeg ở tần số lấy mẫu của nguồn.',
        'Chuyển một tệp MP3 nén mất dữ liệu sang WAV không khôi phục được chi tiết mà bộ mã hóa MP3 đã loại bỏ; việc này chỉ ngăn mất mát thêm.',
        'Ảnh bìa album trong nguồn MP3 hoặc M4A được nhận diện là ảnh tĩnh, nên bước kiểm tra không nhầm tệp là video.',
      ],
      whyItMatters: [
        'Chỉnh sửa hoặc mastering: WAV là định dạng mà các trình chỉnh sửa âm thanh cần, không cần bước giải mã và không suy hao qua các lần xử lý.',
        'Lưu trữ bản master hoặc bản thu hiện trường.',
        'Sampler, game engine và hệ thống phát sóng yêu cầu PCM.',
      ],
      useCases: [
        {
          title: 'Đổi định dạng cho thiết bị',
          description: 'Tạo bản sao WAV cho trình phát cần định dạng này.',
        },
        {
          title: 'Chuẩn bị để chỉnh sửa',
          description: 'Đưa tệp không mất dữ liệu vào DAW hoặc trình chỉnh sửa video.',
        },
        {
          title: 'Từng tệp một',
          description: 'Chuyển cả thư mục ghi chú giọng nói sang WAV lần lượt từng tệp, cắt gọn từng tệp trong lúc làm.',
        },
        {
          title: 'Làm sạch trong lúc chuyển',
          description: 'Loại bỏ tiếng xì khỏi bản thu hiện trường trên đường trở thành bản master không nén.',
        },
      ],
      whyMediaManipulator: [
        'Tần số lấy mẫu và bố cục kênh được giữ nguyên trừ khi bạn chọn khác.',
        'Chuẩn hóa và cắt một bản thu ngay trong lần tải lên tạo ra tệp WAV.',
      ],
      privacyNote: 'Âm thanh của bạn được FFmpeg giải mã trên máy chủ của chúng tôi và ghi ra dưới dạng WAV PCM không nén. Không có dịch vụ âm thanh bên ngoài nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Bạn nhận được một tệp mới; bản thân tệp đã tải lên không bị thay đổi.',
      faq: [
        {
          question: 'WAV là gì?',
          answer: 'WAV là âm thanh PCM không nén: mọi mẫu được lưu nguyên trạng, nên không mất gì và mọi trình chỉnh sửa, DAW hay sampler đều mở được ngay.',
        },
        {
          question: 'Chuyển sang WAV có cải thiện âm thanh không?',
          answer: 'Không. Chuyển một tệp MP3 nén mất dữ liệu sang WAV không khôi phục được chi tiết mà bộ mã hóa MP3 đã loại bỏ; việc này chỉ ngăn mất mát thêm.',
        },
        {
          question: 'Tôi có thể cắt âm thanh trong khi chuyển sang WAV không?',
          answer: 'Có. Đặt điểm bắt đầu và kết thúc trong mục cắt, và chỉ đoạn đó được ghi vào tệp WAV.',
        },
        {
          question: 'Tệp MP3 của tôi có ảnh bìa album. Vẫn chuyển thành WAV được chứ?',
          answer: 'Có. Ảnh bìa được nhận diện là hình ảnh chứ không phải track video, nên tệp tải lên được chấp nhận và âm thanh được giải mã sang PCM như bình thường.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Đầu ra không mất dữ liệu; dung lượng tệp phụ thuộc vào thời lượng và tần số lấy mẫu.',
        ],
      },
      related: [
        {
          label: 'Bộ chuyển đổi âm thanh',
          to: '/tools/audio-converter',
          description: 'Chuyển đổi giữa mọi định dạng âm thanh phổ biến.',
        },
        {
          label: 'Đổi tốc độ âm thanh',
          to: '/tools/change-audio-speed',
          description: 'Tăng tốc hoặc làm chậm bản ghi âm.',
        },
        {
          label: 'Đổi cao độ âm thanh',
          to: '/tools/change-audio-pitch',
          description: 'Dịch tông lên hoặc xuống.',
        },
        {
          label: 'Chuẩn hóa âm thanh',
          to: '/tools/normalize-audio',
          description: 'Cân bằng độ lớn âm thanh.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Loại bỏ tiếng ồn bằng AI.',
        },
        {
          label: 'Loại bỏ giọng hát khỏi bài hát',
          to: '/tools/remove-vocals-from-song',
          description: 'Tạo bản nhạc không lời.',
        },
      ],
      embed: {
        title: 'Chuyển âm thanh sang WAV',
        description: 'Tải lên bất kỳ tệp âm thanh nào. Đầu ra được cố định là WAV; tần số lấy mẫu và số kênh được giữ nguyên trừ khi bạn thay đổi, rồi nhấn Chuyển đổi.',
      },
    },
    'convert-audio-to-flac': {
      name: 'Chuyển âm thanh sang FLAC',
      h1: 'Chuyển âm thanh sang FLAC trực tuyến miễn phí',
      tagline: 'Chuyển MP3, M4A, WAV, OGG, FLAC và mọi tệp âm thanh khác sang FLAC mà không mất gì.',
      metaTitle: 'Chuyển âm thanh sang FLAC trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển âm thanh sang FLAC trực tuyến miễn phí. Tải lên MP3, WAV, M4A, OGG, FLAC hoặc AAC và tải về FLAC. Đầu ra không mất dữ liệu. Không hình mờ, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển âm thanh sang FLAC trực tuyến miễn phí',
      ogDescription: 'Tải lên bất kỳ tệp âm thanh nào và tải về FLAC. Không mất dữ liệu. Miễn phí, không cần đăng ký.',
      intro: 'FLAC nén âm thanh mà không làm mất gì, thường chỉ còn 50 đến 70 phần trăm dung lượng của WAV, và giải mã ra bản sao giống hệt đến từng bit. Media Manipulator chuyển mọi định dạng âm thanh phổ biến sang FLAC chỉ với một lần tải lên, giữ nguyên tần số lấy mẫu và bố cục kênh trừ khi bạn thay đổi, đồng thời cung cấp tính năng cắt đoạn, chuẩn hóa, EQ và các công cụ làm sạch bằng AI ngay trên cùng biểu mẫu.',
      whatItDoes: [
        'Chuyển MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3 và WMA sang FLAC.',
        'Giữ lại mọi mẫu âm: đầu ra giải mã ra đúng y những gì đã đưa vào.',
        'Có thể chỉnh âm lượng, cắt đoạn, chuẩn hóa và EQ trước khi FLAC nén kết quả.',
        'Khử tiếng ồn, làm sạch giọng nói và tách giọng hát chạy ngay trên cùng tệp tải lên nếu bạn muốn có bản sao không mất dữ liệu đã được làm sạch.',
      ],
      flowSteps: [
        {
          title: 'Tải âm thanh lên',
          description: 'WAV, PCM kiểu AIFF, MP3, M4A và các định dạng khác.',
        },
        {
          title: 'Điều chỉnh nếu cần',
          description: 'Cắt đoạn, chuẩn hóa hoặc áp dụng hiệu ứng.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg mã hóa FLAC trên máy chủ của chúng tôi.',
        },
        {
          title: 'Tải về',
          description: 'Lưu tệp FLAC.',
        },
      ],
      advancedDetails: [
        'Đầu ra FLAC được mã hóa bằng bộ mã hóa flac gốc của FFmpeg ở tần số lấy mẫu của tệp nguồn.',
        'Tệp FLAC tạo từ MP3 không hay hơn bản MP3; FLAC chỉ giữ lại những gì vốn đã có.',
        'Tệp MP3 hoặc M4A có ảnh bìa nhúng vẫn vượt qua bước kiểm tra: ảnh được coi là hình ảnh, không phải luồng video.',
      ],
      whyItMatters: [
        'Thư viện nhạc không mất dữ liệu chỉ chiếm một nửa dung lượng so với WAV.',
        'Gửi bản master cho cộng sự mà không cần tệp đính kèm 100 MB.',
        'Lưu trữ lâu dài với mã kiểm tra (checksum) được tích hợp sẵn trong định dạng.',
      ],
      useCases: [
        {
          title: 'Đổi định dạng cho thiết bị',
          description: 'Tạo bản sao FLAC cho trình phát cần định dạng này.',
        },
        {
          title: 'Chuẩn bị để chỉnh sửa',
          description: 'Đưa một tệp không mất dữ liệu vào DAW hoặc trình chỉnh sửa video.',
        },
        {
          title: 'Từng tệp một',
          description: 'Lưu trữ một loạt bản ghi âm không mất dữ liệu, mỗi tệp một lần tải lên.',
        },
        {
          title: 'Làm sạch trong lúc chuyển',
          description: 'Khử tiếng ồn nền trước rồi giữ kết quả đã làm sạch dưới dạng FLAC.',
        },
      ],
      whyMediaManipulator: [
        'Chọn tần số lấy mẫu hoặc bố cục kênh, hoặc giữ nguyên cả hai như trong tệp nguồn.',
        'Nâng mức một bản master nhỏ tiếng và lưu trữ thành FLAC chỉ trong một bước.',
      ],
      privacyNote: 'Âm thanh của bạn được FFmpeg nén không mất dữ liệu sang FLAC trên máy chủ của chúng tôi. Không có dịch vụ âm thanh bên ngoài nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Bạn nhận được một tệp mới; bản đã tải lên không bị thay đổi.',
      faq: [
        {
          question: 'FLAC là gì?',
          answer: 'FLAC nén âm thanh mà không làm mất gì, thường chỉ còn 50 đến 70 phần trăm dung lượng của WAV, và giải mã ra bản sao giống hệt đến từng bit.',
        },
        {
          question: 'Chuyển sang FLAC có làm âm thanh hay hơn không?',
          answer: 'Không. Tệp FLAC tạo từ MP3 không hay hơn bản MP3; FLAC chỉ giữ lại những gì vốn đã có.',
        },
        {
          question: 'Tôi có thể cắt đoạn âm thanh trong khi chuyển sang FLAC không?',
          answer: 'Có. Phần cắt đoạn cho phép đặt điểm bắt đầu và kết thúc, và FLAC chỉ mã hóa khoảng đó.',
        },
        {
          question: 'MP3 có ảnh bìa có chuyển sang FLAC được không?',
          answer: 'Có. Ảnh nhúng được đọc là hình ảnh, không phải video, nên bước kiểm tra vẫn thông qua và âm thanh được mã hóa như bình thường.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Đầu ra không mất dữ liệu; dung lượng tệp phụ thuộc vào thời lượng và tần số lấy mẫu.',
        ],
      },
      related: [
        {
          label: 'Bộ chuyển đổi âm thanh',
          to: '/tools/audio-converter',
          description: 'Chuyển đổi giữa mọi định dạng âm thanh phổ biến.',
        },
        {
          label: 'Đổi tốc độ âm thanh',
          to: '/tools/change-audio-speed',
          description: 'Tăng tốc hoặc làm chậm bản ghi âm.',
        },
        {
          label: 'Đổi cao độ âm thanh',
          to: '/tools/change-audio-pitch',
          description: 'Nâng hoặc hạ tông.',
        },
        {
          label: 'Chuẩn hóa âm thanh',
          to: '/tools/normalize-audio',
          description: 'Làm đều độ to.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Khử tiếng ồn bằng AI.',
        },
        {
          label: 'Loại bỏ giọng hát khỏi bài hát',
          to: '/tools/remove-vocals-from-song',
          description: 'Tạo bản nhạc không lời.',
        },
      ],
      embed: {
        title: 'Chuyển âm thanh sang FLAC',
        description: 'Tải lên bất kỳ tệp âm thanh nào. Đầu ra được cố định là FLAC; tần số lấy mẫu và kênh được giữ nguyên trừ khi bạn thay đổi, rồi bấm Chuyển đổi.',
      },
    },
    'convert-audio-to-ogg': {
      name: 'Chuyển âm thanh sang OGG',
      h1: 'Chuyển âm thanh sang OGG trực tuyến miễn phí',
      tagline: 'Chuyển MP3, M4A, WAV, OGG, FLAC và mọi tệp âm thanh khác sang OGG với bitrate bạn chọn.',
      metaTitle: 'Chuyển âm thanh sang OGG trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển âm thanh sang OGG trực tuyến miễn phí. Tải lên MP3, WAV, M4A, OGG, FLAC hoặc AAC và tải về OGG. Tự chọn bitrate. Không hình mờ, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển âm thanh sang OGG trực tuyến miễn phí',
      ogDescription: 'Tải lên bất kỳ tệp âm thanh nào và tải về OGG. Tự chọn bitrate. Miễn phí, không cần đăng ký.',
      intro: 'OGG Vorbis là định dạng nén có mất dữ liệu, miễn phí và không vướng bằng sáng chế, cho âm thanh hay hơn MP3 ở cùng bitrate và được hỗ trợ sẵn trong trình duyệt, Android và các engine game. Media Manipulator chuyển mọi định dạng âm thanh phổ biến sang OGG chỉ với một lần tải lên, giữ nguyên tần số lấy mẫu và bố cục kênh trừ khi bạn thay đổi, đồng thời cung cấp tính năng cắt đoạn, chuẩn hóa, EQ và các công cụ làm sạch bằng AI ngay trên cùng biểu mẫu.',
      whatItDoes: [
        'Chuyển MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3 và WMA sang OGG.',
        'Cho phép bạn chọn bitrate, tần số lấy mẫu và bố cục kênh.',
        'Cắt đoạn, âm lượng, chuẩn hóa độ to và EQ được thực hiện trong cùng lượt FFmpeg với bước mã hóa Vorbis.',
        'Làm sạch giọng nói hoặc khử tiếng ồn nền bằng AI trước khi bộ mã hóa Vorbis chạy.',
      ],
      flowSteps: [
        {
          title: 'Tải âm thanh lên',
          description: 'Một tệp MP3, WAV, FLAC hoặc tệp âm thanh khác cho game hoặc trang web của bạn.',
        },
        {
          title: 'Điều chỉnh nếu cần',
          description: 'Chọn bitrate; cắt đoạn hoặc áp dụng hiệu ứng.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg mã hóa OGG trên máy chủ của chúng tôi.',
        },
        {
          title: 'Tải về',
          description: 'Lưu tệp OGG.',
        },
      ],
      advancedDetails: [
        'Đầu ra OGG dùng bộ mã hóa libvorbis của FFmpeg; 192 kbps là mức mặc định và là lựa chọn an toàn cho nhạc.',
        'Thiết bị Apple và một số dàn âm thanh ô tô không phát được OGG; hãy dùng M4A hoặc MP3 cho những thiết bị đó.',
        'Ảnh bìa trong tệp nguồn được nhận diện là tệp đính kèm hình ảnh và không kích hoạt bước kiểm tra track video.',
      ],
      whyItMatters: [
        'Tài nguyên âm thanh cho game và ứng dụng, nơi tệp nhỏ và giải mã không mất phí bản quyền là điều quan trọng.',
        'Âm thanh trên web phải phát được trong Firefox và Chrome mà không cần giấy phép.',
        'Tệp podcast hoặc nhạc cho trình phát trên Linux và Android.',
      ],
      useCases: [
        {
          title: 'Đổi định dạng cho thiết bị',
          description: 'Tạo bản sao OGG cho trình phát cần định dạng này.',
        },
        {
          title: 'Chuẩn bị để chỉnh sửa',
          description: 'Tạo một tệp nhỏ, tương thích cho dự án.',
        },
        {
          title: 'Từng tệp một',
          description: 'Chuẩn bị hiệu ứng âm thanh cho engine game, mỗi lần một tệp.',
        },
        {
          title: 'Làm sạch trong lúc chuyển',
          description: 'Loại bỏ tiếng ù khỏi bản ghi âm trước khi xuất thành tài nguyên OGG.',
        },
      ],
      whyMediaManipulator: [
        'Bạn tự đặt bitrate, tần số lấy mẫu và kênh cho từng tệp OGG.',
        'Cắt bỏ khoảng lặng của hiệu ứng âm thanh ngay trong lúc chuyển sang OGG.',
      ],
      privacyNote: 'Âm thanh của bạn được FFmpeg mã hóa sang OGG Vorbis trên máy chủ của chúng tôi. Không có dịch vụ âm thanh bên ngoài nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Bạn nhận được một tệp mới; bản đã tải lên không bị thay đổi.',
      faq: [
        {
          question: 'OGG là gì?',
          answer: 'OGG Vorbis là định dạng nén có mất dữ liệu, miễn phí và không vướng bằng sáng chế, cho âm thanh hay hơn MP3 ở cùng bitrate và được hỗ trợ sẵn trong trình duyệt, Android và các engine game.',
        },
        {
          question: 'Chuyển sang OGG có làm âm thanh hay hơn không?',
          answer: 'Không. Thiết bị Apple và một số dàn âm thanh ô tô không phát được OGG; hãy dùng M4A hoặc MP3 cho những thiết bị đó.',
        },
        {
          question: 'Tôi có thể cắt đoạn âm thanh trong khi chuyển sang OGG không?',
          answer: 'Có. Đánh dấu điểm bắt đầu và kết thúc, tệp OGG sẽ chỉ chứa phần đó.',
        },
        {
          question: 'Tôi có thể chuyển M4A có ảnh album sang OGG không?',
          answer: 'Có. Ảnh bìa được coi là tệp đính kèm hình ảnh chứ không phải track video, nên tác vụ vẫn tiếp tục và tạo ra tệp Vorbis chỉ có âm thanh.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Đầu ra nén có mất dữ liệu; bitrate bạn chọn quyết định dung lượng.',
        ],
      },
      related: [
        {
          label: 'Bộ chuyển đổi âm thanh',
          to: '/tools/audio-converter',
          description: 'Chuyển đổi giữa mọi định dạng âm thanh phổ biến.',
        },
        {
          label: 'Đổi tốc độ âm thanh',
          to: '/tools/change-audio-speed',
          description: 'Tăng tốc hoặc làm chậm bản ghi âm.',
        },
        {
          label: 'Đổi cao độ âm thanh',
          to: '/tools/change-audio-pitch',
          description: 'Nâng hoặc hạ tông.',
        },
        {
          label: 'Chuẩn hóa âm thanh',
          to: '/tools/normalize-audio',
          description: 'Làm đều độ to.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Khử tiếng ồn bằng AI.',
        },
        {
          label: 'Loại bỏ giọng hát khỏi bài hát',
          to: '/tools/remove-vocals-from-song',
          description: 'Tạo bản nhạc không lời.',
        },
      ],
      embed: {
        title: 'Chuyển âm thanh sang OGG',
        description: 'Tải lên bất kỳ tệp âm thanh nào. Đầu ra được cố định là OGG; chọn bitrate, tần số lấy mẫu và kênh, rồi bấm Chuyển đổi.',
      },
    },
    'convert-audio-to-m4a': {
      name: 'Chuyển âm thanh sang M4A / AAC',
      h1: 'Chuyển âm thanh sang M4A / AAC trực tuyến miễn phí',
      tagline: 'Chuyển MP3, M4A, WAV, OGG, FLAC và mọi tệp âm thanh khác sang M4A / AAC với bitrate bạn chọn.',
      metaTitle: 'Chuyển âm thanh sang M4A / AAC trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển âm thanh sang M4A / AAC trực tuyến miễn phí. Tải lên MP3, WAV, M4A, OGG, FLAC hoặc AAC và tải về M4A / AAC. Tự chọn bitrate. Không hình mờ, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển âm thanh sang M4A / AAC trực tuyến miễn phí',
      ogDescription: 'Tải lên bất kỳ tệp âm thanh nào và tải về M4A / AAC. Tự chọn bitrate. Miễn phí, không cần đăng ký.',
      intro: 'M4A là âm thanh AAC trong định dạng chứa MP4, định dạng mà Apple Music, iPhone, YouTube và hầu hết dịch vụ phát trực tuyến sử dụng. Nó cho chất lượng trên mỗi kilobyte tốt hơn MP3. Media Manipulator chuyển mọi định dạng âm thanh phổ biến sang M4A / AAC chỉ với một lần tải lên, giữ nguyên tần số lấy mẫu và bố cục kênh trừ khi bạn thay đổi, đồng thời cung cấp tính năng cắt đoạn, chuẩn hóa, EQ và các công cụ làm sạch bằng AI ngay trên cùng biểu mẫu.',
      whatItDoes: [
        'Chuyển MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3 và WMA sang M4A / AAC.',
        'Cho phép bạn chọn bitrate, tần số lấy mẫu và bố cục kênh.',
        'Cắt đoạn, mức khuếch đại, chuẩn hóa, EQ và hiệu ứng được đưa vào cùng lượt mã hóa với AAC.',
        'Các công cụ AI trên biểu mẫu có thể làm sạch ghi chú giọng nói hoặc loại bỏ giọng hát trước khi tệp AAC được ghi ra.',
      ],
      flowSteps: [
        {
          title: 'Tải âm thanh lên',
          description: 'Một bản master WAV, một tệp MP3 hoặc một ghi chú giọng nói.',
        },
        {
          title: 'Điều chỉnh nếu cần',
          description: 'Chọn bitrate; cắt đoạn hoặc áp dụng hiệu ứng.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg mã hóa M4A / AAC trên máy chủ của chúng tôi.',
        },
        {
          title: 'Tải về',
          description: 'Lưu tệp M4A / AAC.',
        },
      ],
      advancedDetails: [
        'Đầu ra M4A / AAC dùng bộ mã hóa aac của FFmpeg; 192 kbps là mức mặc định và là lựa chọn an toàn cho nhạc.',
        'Một số trình phát cũ chỉ hỗ trợ MP3 và đầu phát trên ô tô sẽ không đọc được AAC.',
        'Ảnh bìa album được nhúng sẽ được nhận diện là hình ảnh và không bao giờ bị nhầm với track video.',
      ],
      whyItMatters: [
        'Nhạc và ghi chú giọng nói cho iPhone, iPad và Mac.',
        'Track âm thanh mà sau này bạn sẽ ghép (mux) vào video MP4.',
        'Podcast và sách nói: có điểm đánh dấu chương và tệp nhỏ hơn MP3.',
      ],
      useCases: [
        {
          title: 'Đổi định dạng cho thiết bị',
          description: 'Tạo bản sao M4A / AAC cho trình phát cần định dạng này.',
        },
        {
          title: 'Chuẩn bị để chỉnh sửa',
          description: 'Tạo một tệp nhỏ, tương thích cho dự án.',
        },
        {
          title: 'Từng tệp một',
          description: 'Chuyển ghi chú giọng nói cho thư viện trên iPhone, cắt bỏ khoảng lặng ngay trong lúc làm.',
        },
        {
          title: 'Làm sạch trong lúc chuyển',
          description: 'Làm sạch giọng nói cho một bản thu podcast và lưu thẳng thành M4A.',
        },
      ],
      whyMediaManipulator: [
        'Bitrate, tần số lấy mẫu và số kênh của đầu ra AAC đều có thể điều chỉnh.',
        'Chuẩn hóa một tập podcast và chuyển thành M4A mà không cần tải lên lần thứ hai.',
      ],
      privacyNote: 'Âm thanh của bạn được FFmpeg mã hóa sang AAC trong tệp M4A trên máy chủ của chúng tôi. Không có dịch vụ âm thanh bên ngoài nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Bạn nhận được một tệp mới; bản đã tải lên không bị thay đổi.',
      faq: [
        {
          question: 'M4A / AAC là gì?',
          answer: 'M4A là âm thanh AAC trong định dạng chứa MP4, định dạng mà Apple Music, iPhone, YouTube và hầu hết dịch vụ phát trực tuyến sử dụng. Nó cho chất lượng trên mỗi kilobyte tốt hơn MP3.',
        },
        {
          question: 'Chuyển sang M4A / AAC có làm âm thanh hay hơn không?',
          answer: 'Không. Một số trình phát cũ chỉ hỗ trợ MP3 và đầu phát trên ô tô sẽ không đọc được AAC.',
        },
        {
          question: 'Tôi có thể cắt đoạn âm thanh trong khi chuyển sang M4A / AAC không?',
          answer: 'Có. Đặt khoảng trong phần cắt đoạn; tệp M4A sẽ bắt đầu và kết thúc đúng chỗ bạn chọn.',
        },
        {
          question: 'Ảnh album trong MP3 của tôi có làm hỏng quá trình chuyển sang M4A không?',
          answer: 'Không. Luồng ảnh được xác định là hình ảnh, không phải video, và quá trình mã hóa AAC chạy bình thường.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Đầu ra nén có mất dữ liệu; bitrate bạn chọn quyết định dung lượng.',
        ],
      },
      related: [
        {
          label: 'Bộ chuyển đổi âm thanh',
          to: '/tools/audio-converter',
          description: 'Chuyển đổi giữa mọi định dạng âm thanh phổ biến.',
        },
        {
          label: 'Đổi tốc độ âm thanh',
          to: '/tools/change-audio-speed',
          description: 'Tăng tốc hoặc làm chậm bản ghi âm.',
        },
        {
          label: 'Đổi cao độ âm thanh',
          to: '/tools/change-audio-pitch',
          description: 'Nâng hoặc hạ tông.',
        },
        {
          label: 'Chuẩn hóa âm thanh',
          to: '/tools/normalize-audio',
          description: 'Làm đều độ to.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Khử tiếng ồn bằng AI.',
        },
        {
          label: 'Loại bỏ giọng hát khỏi bài hát',
          to: '/tools/remove-vocals-from-song',
          description: 'Tạo bản nhạc không lời.',
        },
      ],
      embed: {
        title: 'Chuyển âm thanh sang M4A / AAC',
        description: 'Tải lên bất kỳ tệp âm thanh nào. Đầu ra được cố định là M4A / AAC; chọn bitrate, tần số lấy mẫu và kênh, rồi bấm Chuyển đổi.',
      },
    },
    'convert-audio-to-opus': {
      name: 'Chuyển âm thanh sang Opus',
      h1: 'Chuyển âm thanh sang Opus trực tuyến miễn phí',
      tagline: 'Chuyển MP3, M4A, WAV, OGG, FLAC và mọi tệp âm thanh khác sang Opus với bitrate bạn chọn.',
      metaTitle: 'Chuyển âm thanh sang Opus trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển âm thanh sang Opus trực tuyến miễn phí. Tải lên MP3, WAV, M4A, OGG, FLAC hoặc AAC và tải về Opus. Tự chọn bitrate. Không hình mờ, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển âm thanh sang Opus trực tuyến miễn phí',
      ogDescription: 'Tải lên bất kỳ tệp âm thanh nào và tải về Opus. Tự chọn bitrate. Miễn phí, không cần đăng ký.',
      intro: 'Opus là codec mở mới nhất và là lựa chọn nén có mất dữ liệu tốt nhất cho giọng nói và nhạc ở bitrate thấp: Opus 64 kbps nghe như MP3 128 kbps. Đây là định dạng mà WhatsApp, Discord và WebRTC sử dụng. Media Manipulator chuyển mọi định dạng âm thanh phổ biến sang Opus chỉ với một lần tải lên, giữ nguyên tần số lấy mẫu và bố cục kênh trừ khi bạn thay đổi, đồng thời cung cấp tính năng cắt đoạn, chuẩn hóa, EQ và các công cụ làm sạch bằng AI ngay trên cùng biểu mẫu.',
      whatItDoes: [
        'Chuyển MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3 và WMA sang Opus.',
        'Cho phép bạn chọn bitrate, tần số lấy mẫu và bố cục kênh.',
        'Cắt đoạn, âm lượng, chuẩn hóa và EQ được áp dụng trong cùng lượt với bước mã hóa Opus.',
        'Trước khi mã hóa, biểu mẫu có thể khử tiếng ồn nền hoặc làm sạch giọng nói bằng AI trên GPU của chúng tôi.',
      ],
      flowSteps: [
        {
          title: 'Tải âm thanh lên',
          description: 'Ghi chú giọng nói, podcast, nhạc hoặc bất kỳ âm thanh phổ biến nào.',
        },
        {
          title: 'Điều chỉnh nếu cần',
          description: 'Chọn bitrate; cắt đoạn hoặc áp dụng hiệu ứng.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg mã hóa Opus trên máy chủ của chúng tôi.',
        },
        {
          title: 'Tải về',
          description: 'Lưu tệp Opus.',
        },
      ],
      advancedDetails: [
        'Đầu ra Opus dùng bộ mã hóa libopus của FFmpeg; 192 kbps là mức mặc định và là lựa chọn an toàn cho nhạc.',
        'iTunes, thiết bị Apple đời cũ và nhiều trình phát phần cứng không hỗ trợ Opus; hãy chọn M4A cho những thiết bị đó.',
        'Ảnh album trong tệp nguồn được phát hiện là hình ảnh và không làm gián đoạn quá trình chuyển đổi.',
      ],
      whyItMatters: [
        'Ghi chú giọng nói, podcast và sách nói với dung lượng chỉ bằng một phần nhỏ.',
        'Phát trực tuyến hoặc nhúng âm thanh ở nơi băng thông là yếu tố quan trọng.',
        'Discord, Matrix và các bot nhắn tin hỗ trợ Opus sẵn có.',
      ],
      useCases: [
        {
          title: 'Đổi định dạng cho thiết bị',
          description: 'Tạo bản sao Opus cho trình phát cần định dạng này.',
        },
        {
          title: 'Chuẩn bị để chỉnh sửa',
          description: 'Tạo một tệp nhỏ, tương thích cho dự án.',
        },
        {
          title: 'Từng tệp một',
          description: 'Thu nhỏ một loạt bài giảng sang Opus, lần lượt từng tệp.',
        },
        {
          title: 'Làm sạch trong lúc chuyển',
          description: 'Làm sạch bản ghi cuộc gọi nhiều tiếng ồn và giữ lại dưới dạng tệp Opus nhỏ.',
        },
      ],
      whyMediaManipulator: [
        'Chọn bitrate, tần số lấy mẫu và kênh cho Opus, hoặc giữ giá trị mặc định.',
        'Cắt đoạn và chuẩn hóa ghi chú giọng nói trong lúc chuyển sang Opus.',
      ],
      privacyNote: 'Âm thanh của bạn được FFmpeg mã hóa sang Opus trên máy chủ của chúng tôi. Không có dịch vụ âm thanh bên ngoài nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Bạn nhận được một tệp mới; bản đã tải lên không bị thay đổi.',
      faq: [
        {
          question: 'Opus là gì?',
          answer: 'Opus là codec mở mới nhất và là lựa chọn nén có mất dữ liệu tốt nhất cho giọng nói và nhạc ở bitrate thấp: Opus 64 kbps nghe như MP3 128 kbps. Đây là định dạng mà WhatsApp, Discord và WebRTC sử dụng.',
        },
        {
          question: 'Chuyển sang Opus có làm âm thanh hay hơn không?',
          answer: 'Không. iTunes, thiết bị Apple đời cũ và nhiều trình phát phần cứng không hỗ trợ Opus; hãy chọn M4A cho những thiết bị đó.',
        },
        {
          question: 'Tôi có thể cắt đoạn âm thanh trong khi chuyển sang Opus không?',
          answer: 'Có. Chỉ khoảng giữa điểm bắt đầu và kết thúc bạn đặt mới được mã hóa sang Opus.',
        },
        {
          question: 'Tệp âm thanh có ảnh bìa có chuyển sang Opus được không?',
          answer: 'Có. Ảnh bìa được phát hiện là hình ảnh, không phải luồng video, nên tệp được chấp nhận và chỉ phần âm thanh được mã hóa.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Đầu ra nén có mất dữ liệu; bitrate bạn chọn quyết định dung lượng.',
        ],
      },
      related: [
        {
          label: 'Bộ chuyển đổi âm thanh',
          to: '/tools/audio-converter',
          description: 'Chuyển đổi giữa mọi định dạng âm thanh phổ biến.',
        },
        {
          label: 'Đổi tốc độ âm thanh',
          to: '/tools/change-audio-speed',
          description: 'Tăng tốc hoặc làm chậm bản ghi âm.',
        },
        {
          label: 'Đổi cao độ âm thanh',
          to: '/tools/change-audio-pitch',
          description: 'Nâng hoặc hạ tông.',
        },
        {
          label: 'Chuẩn hóa âm thanh',
          to: '/tools/normalize-audio',
          description: 'Làm đều độ to.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Khử tiếng ồn bằng AI.',
        },
        {
          label: 'Loại bỏ giọng hát khỏi bài hát',
          to: '/tools/remove-vocals-from-song',
          description: 'Tạo bản nhạc không lời.',
        },
      ],
      embed: {
        title: 'Chuyển âm thanh sang Opus',
        description: 'Tải lên bất kỳ tệp âm thanh nào. Đầu ra được cố định là Opus; chọn bitrate, tần số lấy mẫu và kênh, rồi bấm Chuyển đổi.',
      },
    },
    'convert-mp3-to-wav': {
      name: 'Chuyển MP3 sang WAV',
      h1: 'Chuyển MP3 sang WAV trực tuyến miễn phí',
      tagline: 'Biến tệp MP3 thành WAV không nén để chỉnh sửa, lấy mẫu hoặc ghi ra đĩa CD.',
      metaTitle: 'Chuyển MP3 sang WAV trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển MP3 sang WAV trực tuyến miễn phí. Tải lên một tệp MP3 và tải về WAV PCM 16-bit không nén ở tần số lấy mẫu gốc. Không hình mờ, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển MP3 sang WAV trực tuyến miễn phí',
      ogDescription: 'Đưa MP3 vào, nhận WAV không nén. Miễn phí, không cần đăng ký.',
      intro: 'Trình chỉnh sửa âm thanh, sampler và phần mềm ghi đĩa CD cần PCM không nén, và một số công cụ cũ từ chối hẳn MP3. Chuyển sang WAV sẽ giải mã MP3 một lần để quá trình chỉnh sửa không làm mất thêm chất lượng. Media Manipulator thực hiện việc này trên máy chủ của chúng tôi bằng FFmpeg, giữ nguyên tần số lấy mẫu và kênh gốc, đồng thời bỏ qua ảnh bìa album được nhúng thay vì nhầm nó với track video.',
      whatItDoes: [
        'Giải mã MP3 thành WAV PCM 16-bit với tần số lấy mẫu và bố cục kênh của tệp nguồn.',
        'Tùy chọn cắt đoạn, chuẩn hóa, fade và EQ trong cùng một lượt.',
        'Xử lý được MP3 có ảnh bìa nhúng và thẻ ID3.',
      ],
      flowSteps: [
        {
          title: 'Tải MP3 lên',
          description: 'Bitrate bất kỳ, có hoặc không có ảnh bìa.',
        },
        {
          title: 'Điều chỉnh nếu cần',
          description: 'Cắt đoạn, chuẩn hóa, EQ.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg giải mã thành PCM.',
        },
        {
          title: 'Tải về',
          description: 'Lưu tệp WAV.',
        },
      ],
      advancedDetails: [
        'Đầu ra WAV là pcm_s16le; tệp có dung lượng khoảng 10 MB cho mỗi phút âm thanh stereo 44,1 kHz.',
        'Việc giải mã không khôi phục được những gì bộ mã hóa MP3 đã loại bỏ; nó chỉ ngăn mất mát thêm.',
      ],
      whyItMatters: [
        'Chỉnh sửa MP3 rồi lưu lại thành MP3 sẽ làm giảm chất lượng sau mỗi lần; WAV ngăn điều đó.',
        'Sampler, DAW và phần mềm ghi CD đều cần PCM.',
      ],
      useCases: [
        {
          title: 'Chỉnh sửa trong DAW',
          description: 'Nhập vào mà không cần bước giải mã và không bị suy giảm chất lượng qua các lần lưu.',
        },
        {
          title: 'Ghi đĩa CD âm thanh',
          description: 'Phần mềm ghi CD cần WAV 44,1 kHz.',
        },
        {
          title: 'Lấy mẫu âm thanh',
          description: 'Nạp vào sampler hoặc engine game.',
        },
      ],
      whyMediaManipulator: [
        'Giữ nguyên tần số lấy mẫu và kênh gốc.',
        'Ảnh bìa trong MP3 được xử lý đúng cách.',
      ],
      privacyNote: 'Tệp MP3 của bạn được FFmpeg giải mã một lần trên máy chủ của chúng tôi thành WAV PCM 16-bit. Không có dịch vụ âm thanh bên ngoài nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Bạn nhận được một tệp mới; bản đã tải lên không bị thay đổi.',
      faq: [
        {
          question: 'WAV có nghe hay hơn MP3 không?',
          answer: 'Không. Âm thanh giống hệt; điểm mấu chốt là các lần chỉnh sửa tiếp theo sẽ không làm giảm chất lượng.',
        },
        {
          question: 'Vì sao tệp WAV lớn hơn nhiều như vậy?',
          answer: 'WAV không nén: khoảng 10 MB cho mỗi phút âm thanh stereo chất lượng CD.',
        },
        {
          question: 'MP3 của tôi có ảnh album. Điều đó có gây vấn đề không?',
          answer: 'Không. Ảnh bìa nhúng được nhận diện là hình ảnh và bị bỏ qua.',
        },
      ],
      related: [
        {
          label: 'Chuyển âm thanh sang WAV',
          to: '/tools/convert-audio-to-wav',
          description: 'Mọi định dạng sang WAV.',
        },
        {
          label: 'Chuyển WAV sang MP3',
          to: '/tools/convert-wav-to-mp3',
          description: 'Chiều ngược lại.',
        },
        {
          label: 'Bộ chuyển đổi âm thanh',
          to: '/tools/audio-converter',
          description: 'Chuyển đổi giữa mọi định dạng âm thanh phổ biến.',
        },
        {
          label: 'Đổi tốc độ âm thanh',
          to: '/tools/change-audio-speed',
          description: 'Tăng tốc hoặc làm chậm bản ghi âm.',
        },
        {
          label: 'Đổi cao độ âm thanh',
          to: '/tools/change-audio-pitch',
          description: 'Nâng hoặc hạ tông.',
        },
        {
          label: 'Chuẩn hóa âm thanh',
          to: '/tools/normalize-audio',
          description: 'Làm đều độ to.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Khử tiếng ồn bằng AI.',
        },
        {
          label: 'Loại bỏ giọng hát khỏi bài hát',
          to: '/tools/remove-vocals-from-song',
          description: 'Tạo bản nhạc không lời.',
        },
      ],
      embed: {
        title: 'Chuyển MP3 sang WAV',
        description: 'Tải lên một tệp MP3. Đầu ra được cố định là WAV; cắt đoạn hoặc chuẩn hóa nếu bạn muốn, rồi bấm Chuyển đổi.',
      },
    },
    'change-audio-speed': {
      name: 'Đổi tốc độ âm thanh',
      h1: 'Đổi tốc độ âm thanh trực tuyến: Tăng tốc hoặc làm chậm',
      tagline: 'Tăng tốc bài giảng hoặc podcast lên 1,5x, hoặc làm chậm bài hát hay bản ghi âm xuống 0,75x để luyện tập, mà không đổi cao độ.',
      metaTitle: 'Đổi tốc độ âm thanh miễn phí (không đổi cao độ) | Media Manipulator',
      metaDescription: 'Công cụ đổi tốc độ âm thanh trực tuyến miễn phí. Tăng tốc hoặc làm chậm MP3, WAV, M4A và nhiều định dạng khác từ 0,25x đến 4x mà vẫn giữ nguyên cao độ. Lý tưởng cho bài giảng, podcast và bản nhạc luyện tập. Không cần đăng ký.',
      ogTitle: 'Đổi tốc độ âm thanh trực tuyến miễn phí',
      ogDescription: 'Nhanh hơn hoặc chậm hơn mà không bị hiệu ứng giọng sóc chuột. Miễn phí, không cần đăng ký.',
      intro: 'Một bài giảng dài hai giờ nghe ở tốc độ 1,5x chỉ còn 80 phút. Một đoạn solo guitar ở 0,75x thì có thể học theo được. Đổi tốc độ âm thanh hữu ích hằng ngày, và cái khó nằm ở cao độ: tăng tốc một cách đơn thuần sẽ biến giọng nói thành giọng sóc chuột. Media Manipulator kéo giãn thời gian âm thanh trên máy chủ của chúng tôi bằng bộ lọc tempo của FFmpeg, giữ cao độ đúng như ban đầu, từ một phần tư tốc độ đến gấp bốn lần.',
      whatItDoes: [
        'Tăng tốc (1,1x đến 4x) hoặc làm chậm (0,25x đến 0,9x) bất kỳ tệp âm thanh nào.',
        'Giữ nguyên cao độ, nên lời nói và nhạc vẫn đúng tông.',
        'Mặc định xuất MP3, hoặc WAV, FLAC, M4A, OGG, Opus.',
        'Tùy chọn cắt đoạn, chuẩn hóa và EQ trong cùng một lượt.',
      ],
      flowSteps: [
        {
          title: 'Tải âm thanh lên',
          description: 'MP3, WAV, M4A, OGG, FLAC và nhiều định dạng khác.',
        },
        {
          title: 'Đặt tốc độ',
          description: '1,5x được chọn sẵn; từ 0,25x đến 4x.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg kéo giãn thời gian mà vẫn giữ nguyên cao độ.',
        },
        {
          title: 'Tải về',
          description: 'Lưu tệp đã đổi tốc độ.',
        },
      ],
      advancedDetails: [
        'Dùng bộ lọc atempo, tự động nối chuỗi cho các hệ số nằm ngoài khoảng 0,5 đến 2,0.',
        'Kéo giãn thời gian gây ra một chút méo tiếng ở các hệ số cực đoan; từ 0,5x đến 2x thì gần như không nhận ra với lời nói.',
        'Để đổi cả tốc độ VÀ cao độ cùng lúc (hiệu ứng băng cassette), hãy dùng tùy chọn kéo giãn thời gian của công cụ đổi cao độ.',
      ],
      whyItMatters: [
        'Bài giảng, sách nói và podcast thường nghe thoải mái ở tốc độ 1,25x đến 2x.',
        'Nhạc công luyện các đoạn khó ở 50 đến 75 phần trăm tốc độ.',
        'Người chép lời làm chậm bản ghi âm để nghe rõ từng chữ.',
      ],
      useCases: [
        {
          title: 'Bài giảng nhanh hơn',
          description: 'Nghe lại buổi học đã ghi âm ở tốc độ 1,5x.',
        },
        {
          title: 'Bản nhạc luyện tập',
          description: 'Làm chậm đoạn solo xuống 0,75x mà vẫn giữ nguyên tông.',
        },
        {
          title: 'Chép lời',
          description: 'Làm chậm buổi phỏng vấn xuống 0,8x.',
        },
        {
          title: 'Vừa khung thời gian',
          description: 'Nhích tốc độ lời đọc thêm 5 phần trăm cho vừa.',
        },
      ],
      whyMediaManipulator: [
        'Cao độ được giữ nguyên theo mặc định; không có tiếng sóc chuột hay tiếng băng bị chậm.',
        'Mọi định dạng đầu ra, kèm cắt đoạn và chuẩn hóa trong cùng một lần tải lên.',
      ],
      privacyNote: 'Bản ghi âm của bạn được FFmpeg tăng tốc hoặc làm chậm trên máy chủ của chúng tôi, dùng rubberband hoặc atempo tùy theo chế độ bạn chọn. Không có dịch vụ âm thanh bên ngoài nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Bạn nhận được một tệp mới; bản đã tải lên không bị thay đổi.',
      faq: [
        {
          question: 'Cao độ có thay đổi không?',
          answer: 'Không. Bộ lọc tempo giữ cao độ đúng như ban đầu.',
        },
        {
          question: 'Tôi có thể tăng tốc tối đa bao nhiêu?',
          answer: '4x trong một lượt. Chạy lại kết quả để tăng thêm.',
        },
        {
          question: 'Âm thanh bị làm chậm có nghe như robot không?',
          answer: 'Đến 0,5x thì vẫn sạch; thấp hơn mức đó sẽ nghe thấy hiện tượng lệch pha.',
        },
        {
          question: 'Tôi có thể đổi tốc độ và cao độ cùng lúc không?',
          answer: 'Có. Hãy dùng công cụ Đổi cao độ âm thanh, công cụ này có điều khiển kéo giãn thời gian.',
        },
      ],
      related: [
        {
          label: 'Bộ chuyển đổi âm thanh',
          to: '/tools/audio-converter',
          description: 'Chuyển đổi giữa mọi định dạng âm thanh phổ biến.',
        },
        {
          label: 'Đổi cao độ âm thanh',
          to: '/tools/change-audio-pitch',
          description: 'Nâng hoặc hạ tông.',
        },
        {
          label: 'Chuẩn hóa âm thanh',
          to: '/tools/normalize-audio',
          description: 'Làm đều độ to.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Khử tiếng ồn bằng AI.',
        },
        {
          label: 'Loại bỏ giọng hát khỏi bài hát',
          to: '/tools/remove-vocals-from-song',
          description: 'Tạo bản nhạc không lời.',
        },
      ],
      embed: {
        title: 'Đổi tốc độ của tệp âm thanh',
        description: 'Tải lên một tệp âm thanh và đặt hệ số tốc độ; 1,5x được chọn sẵn. Cao độ được giữ nguyên nên giọng nói vẫn tự nhiên. Để đổi cả tông, hãy dùng công cụ đổi cao độ.',
      },
    },
    'change-audio-pitch': {
      name: 'Đổi cao độ âm thanh',
      h1: 'Đổi cao độ âm thanh trực tuyến: Nâng hoặc hạ tông',
      tagline: 'Dịch bài hát hoặc bản ghi âm theo nửa cung để đổi tông, hạ giọng hát hoặc chỉnh một mẫu âm, giữ nguyên nhịp độ.',
      metaTitle: 'Đổi cao độ âm thanh miễn phí: Dịch theo nửa cung | Media Manipulator',
      metaDescription: 'Công cụ đổi cao độ trực tuyến miễn phí. Dịch MP3, WAV hoặc bất kỳ âm thanh nào lên hoặc xuống theo nửa cung để đổi tông, giữ nguyên tốc độ. Tùy chọn kéo giãn thời gian. Không hình mờ, không cần đăng ký.',
      ogTitle: 'Đổi cao độ âm thanh trực tuyến miễn phí',
      ogDescription: 'Dịch giọng mọi âm thanh theo nửa cung. Miễn phí, không cần đăng ký.',
      intro: 'Một bản nhạc đệm sai tông so với giọng của bạn, một mẫu âm cần khớp với bài hát, một giọng hát nên thấp xuống một cung: dịch cao độ giải quyết được tất cả. Media Manipulator dịch giọng âm thanh theo nửa cung trên máy chủ của chúng tôi bằng FFmpeg, giữ nguyên thời lượng, và cho phép bạn kết hợp với kéo giãn thời gian khi bạn muốn có hiệu ứng tốc độ băng cassette kiểu cũ.',
      whatItDoes: [
        'Dịch âm thanh lên hoặc xuống tối đa 12 nửa cung (một quãng tám).',
        'Giữ nguyên thời lượng nên bản nhạc vẫn vừa khớp.',
        'Tùy chọn kéo giãn thời gian để đổi độ dài một cách độc lập.',
        'Ghi âm thanh đã dịch giọng thành MP3, WAV, FLAC, M4A, OGG hoặc Opus.',
      ],
      flowSteps: [
        {
          title: 'Tải âm thanh lên',
          description: 'Bất kỳ định dạng âm thanh phổ biến nào.',
        },
        {
          title: 'Đặt số nửa cung',
          description: '+2 được chọn sẵn; từ -12 đến +12.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg lấy mẫu lại và điều chỉnh thời gian.',
        },
        {
          title: 'Tải về',
          description: 'Lưu tệp đã dịch giọng.',
        },
      ],
      advancedDetails: [
        'Việc dịch giọng lấy mẫu lại theo hệ số 2^(số nửa cung/12) và bù tempo để độ dài không đổi.',
        'Dịch nhiều (hơn 5 nửa cung) trên bản phối hoàn chỉnh có thể nghe giả tạo; giọng hát và nhạc cụ đơn lẻ cho kết quả tốt hơn.',
        'Tính năng giữ formant được bật, nên giọng bị hạ thấp không biến thành giọng của một người khác.',
      ],
      whyItMatters: [
        'Ca sĩ dịch giọng nhạc đệm sang tông thoải mái.',
        'Nhà sản xuất chỉnh mẫu âm và giọng hát cho khớp với bài hát.',
        'Hạ một hoặc hai nửa cung giúp giọng hát trong bản demo nghe thư thái hơn.',
      ],
      useCases: [
        {
          title: 'Đổi tông nhạc đệm',
          description: 'Hạ một bản karaoke xuống hai nửa cung.',
        },
        {
          title: 'Chỉnh mẫu âm',
          description: 'Khớp một tiếng trống hoặc tiếng giọng với bài hát.',
        },
        {
          title: 'Hạ giọng lời đọc',
          description: 'Hạ một bản đọc xuống một nửa cung.',
        },
        {
          title: 'Hiệu ứng quãng tám',
          description: 'Dịch +12 hoặc -12 để tạo một lớp hiệu ứng.',
        },
      ],
      whyMediaManipulator: [
        'Điều khiển theo nửa cung mà vẫn giữ thời lượng, kèm kéo giãn thời gian khi bạn cần.',
        'Mọi định dạng đầu ra, kèm cắt đoạn và chuẩn hóa trong cùng một lần tải lên.',
      ],
      privacyNote: 'Âm thanh của bạn được FFmpeg dịch lên hoặc xuống theo số nửa cung bạn chọn, trên máy chủ của chúng tôi. Không có dịch vụ âm thanh bên ngoài nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Bạn nhận được một tệp mới; bản đã tải lên không bị thay đổi.',
      faq: [
        {
          question: 'Tốc độ có thay đổi không?',
          answer: 'Không. Thời lượng được giữ nguyên. Hãy dùng điều khiển kéo giãn thời gian nếu bạn muốn đổi.',
        },
        {
          question: 'Tôi có thể dịch xa đến mức nào?',
          answer: 'Tối đa 12 nửa cung (một quãng tám) lên hoặc xuống.',
        },
        {
          question: 'Giọng đã dịch có nghe tự nhiên không?',
          answer: 'Với một đến ba nửa cung thì có. Dịch nhiều hơn sẽ nghe ra được; tính năng giữ formant giúp giọng không nghe như nhân vật hoạt hình.',
        },
        {
          question: 'Tôi có thể dịch theo cent không?',
          answer: 'Chưa được; điều khiển chỉ nhận số nửa cung nguyên.',
        },
      ],
      related: [
        {
          label: 'Bộ chuyển đổi âm thanh',
          to: '/tools/audio-converter',
          description: 'Chuyển đổi giữa mọi định dạng âm thanh phổ biến.',
        },
        {
          label: 'Đổi tốc độ âm thanh',
          to: '/tools/change-audio-speed',
          description: 'Tăng tốc hoặc làm chậm bản ghi âm.',
        },
        {
          label: 'Chuẩn hóa âm thanh',
          to: '/tools/normalize-audio',
          description: 'Làm đều độ to.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Khử tiếng ồn bằng AI.',
        },
        {
          label: 'Loại bỏ giọng hát khỏi bài hát',
          to: '/tools/remove-vocals-from-song',
          description: 'Tạo bản nhạc không lời.',
        },
      ],
      embed: {
        title: 'Đổi cao độ của tệp âm thanh',
        description: 'Tải lên một tệp âm thanh. Phần Nâng cao mở ra với thanh trượt cao độ; +2 nửa cung được chọn sẵn. Giá trị âm sẽ hạ tông. Kéo giãn thời gian nằm ngay bên cạnh nếu bạn cũng muốn đổi độ dài.',
      },
    },
    'normalize-audio': {
      name: 'Chuẩn hóa âm thanh',
      h1: 'Chuẩn hóa độ to âm thanh trực tuyến',
      tagline: 'Đưa bản ghi nhỏ tiếng lên mức âm lượng đồng đều, để podcast, ghi chú giọng nói và danh sách phát hỗn hợp đều phát ở cùng mức.',
      metaTitle: 'Chuẩn hóa âm thanh trực tuyến miễn phí (độ to) | Media Manipulator',
      metaDescription: 'Công cụ chuẩn hóa âm thanh trực tuyến miễn phí. Làm đều độ to của MP3, WAV, M4A và các tệp khác bằng chuẩn hóa độ to EBU R128. Lý tưởng cho podcast và ghi chú giọng nói. Không hình mờ, không cần đăng ký.',
      ogTitle: 'Chuẩn hóa âm thanh trực tuyến miễn phí',
      ogDescription: 'Độ to đồng đều cho mọi bản ghi âm. Miễn phí, không cần đăng ký.',
      intro: 'Ghi chú giọng nói thu ở khoảng cách một sải tay thì nhỏ; bài hát rip từ CD thì to; phát liền nhau, chúng khiến người nghe phải với tay chỉnh âm lượng. Chuẩn hóa độ to đo độ to cảm nhận của cả tệp và đưa về một mức mục tiêu tiêu chuẩn, theo cùng phép đo EBU R128 mà các đài phát sóng và dịch vụ phát trực tuyến sử dụng. Media Manipulator chạy việc này trên máy chủ của chúng tôi bằng bộ lọc loudnorm của FFmpeg, bộ lọc này còn giữ đỉnh thực dưới ngưỡng trần để không có gì bị vỡ tiếng.',
      whatItDoes: [
        'Đo độ to tích hợp và chuẩn hóa về mức mục tiêu theo tiêu chuẩn phát sóng.',
        'Giới hạn đỉnh thực để đầu ra không bao giờ bị vỡ tiếng.',
        'Tùy chọn mức khuếch đại, fade in/out và nén dải động trong cùng một phần.',
        'Lưu tệp đã cân bằng mức dưới dạng MP3, WAV, FLAC, M4A, OGG hoặc Opus.',
      ],
      flowSteps: [
        {
          title: 'Tải âm thanh lên',
          description: 'Bất kỳ định dạng phổ biến nào.',
        },
        {
          title: 'Giữ chuẩn hóa ở trạng thái bật',
          description: 'Thêm fade hoặc nén nếu cần.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg loudnorm đo và hiệu chỉnh.',
        },
        {
          title: 'Tải về',
          description: 'Lưu tệp đã cân bằng mức.',
        },
      ],
      advancedDetails: [
        'Dùng loudnorm (EBU R128) với mức mục tiêu tích hợp mặc định -24 LUFS và ngưỡng trần đỉnh thực -2 dBTP.',
        'Đây là chuẩn hóa độ to, không phải chuẩn hóa đỉnh: hai tệp cùng có đỉnh ở 0 dB vẫn có thể chênh lệch rất nhiều về âm lượng cảm nhận.',
        'Để thay đổi mức khuếch đại cố định thật nhanh mà không cần phân tích, hãy dùng thanh trượt khuếch đại hoặc công cụ Chỉnh âm lượng.',
      ],
      whyItMatters: [
        'Người nghe bỏ những podcast bắt họ phải liên tục chỉnh âm lượng.',
        'Danh sách phát và set DJ cần các bản nhạc ở mức đồng đều.',
        'Các nền tảng chuẩn hóa khi tải lên; làm trước nghĩa là không có bất ngờ.',
      ],
      useCases: [
        {
          title: 'Tập podcast',
          description: 'Cân bằng mức một cuộc trò chuyện đã ghi âm trước khi đăng.',
        },
        {
          title: 'Ghi chú giọng nói',
          description: 'Nâng mức một bản ghi nhỏ tiếng trên điện thoại.',
        },
        {
          title: 'Ghi âm bài giảng',
          description: 'Làm đều giọng của người nói hay di chuyển xa micro.',
        },
        {
          title: 'Chuẩn bị danh sách phát',
          description: 'Chuẩn hóa các bản nhạc rip từ nhiều nguồn khác nhau.',
        },
      ],
      whyMediaManipulator: [
        'Đo độ to EBU R128 thực sự, không chỉ quét đỉnh.',
        'Fade, mức khuếch đại và nén trong cùng một phần.',
      ],
      privacyNote: 'Độ to của âm thanh được FFmpeg đo và làm đều trên máy chủ của chúng tôi. Không có dịch vụ âm thanh bên ngoài nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Bạn nhận được một tệp mới; bản đã tải lên không bị thay đổi.',
      faq: [
        {
          question: 'Mức độ to mục tiêu là bao nhiêu?',
          answer: '-24 LUFS tích hợp với ngưỡng trần đỉnh thực -2 dBTP, mức mặc định của EBU R128. Các nền tảng podcast thường nhắm tới -16 đến -19 LUFS; hãy thêm vài dB khuếch đại nếu bạn muốn to hơn.',
        },
        {
          question: 'Nó có làm mọi đoạn trong tệp to đều như nhau không?',
          answer: 'Không. Nó cân bằng mức cho toàn bộ tệp. Hãy bật thêm bộ nén để giảm sự chênh lệch bên trong tệp.',
        },
        {
          question: 'Có thể bị vỡ tiếng không?',
          answer: 'Không. Bộ giới hạn đỉnh thực giữ các đỉnh dưới ngưỡng trần.',
        },
        {
          question: 'Tôi có thể chỉ làm cho nó to hơn không?',
          answer: 'Có. Hãy dùng công cụ Chỉnh âm lượng để thay đổi mức khuếch đại cố định.',
        },
      ],
      related: [
        {
          label: 'Chỉnh âm lượng',
          to: '/tools/adjust-audio-volume',
          description: 'Tăng hoặc giảm một mức cố định.',
        },
        {
          label: 'Bộ chuyển đổi âm thanh',
          to: '/tools/audio-converter',
          description: 'Chuyển đổi giữa mọi định dạng âm thanh phổ biến.',
        },
        {
          label: 'Đổi tốc độ âm thanh',
          to: '/tools/change-audio-speed',
          description: 'Tăng tốc hoặc làm chậm bản ghi âm.',
        },
        {
          label: 'Đổi cao độ âm thanh',
          to: '/tools/change-audio-pitch',
          description: 'Nâng hoặc hạ tông.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Khử tiếng ồn bằng AI.',
        },
        {
          label: 'Loại bỏ giọng hát khỏi bài hát',
          to: '/tools/remove-vocals-from-song',
          description: 'Tạo bản nhạc không lời.',
        },
      ],
      embed: {
        title: 'Chuẩn hóa tệp âm thanh',
        description: 'Tải lên một tệp âm thanh. Chuẩn hóa độ to đã được bật sẵn trong phần Xử lý cơ bản; thêm khuếch đại, fade hoặc nén nếu bạn muốn. Bấm Chuyển đổi.',
      },
    },
    'adjust-audio-volume': {
      name: 'Chỉnh âm lượng',
      h1: 'Tăng hoặc giảm âm lượng âm thanh trực tuyến',
      tagline: 'Làm tệp âm thanh to hơn hoặc nhỏ hơn một lượng cố định, từ 10 phần trăm đến gấp đôi, hoặc theo decibel bằng thanh khuếch đại.',
      metaTitle: 'Tăng âm lượng trực tuyến miễn phí (làm MP3 to hơn) | Media Manipulator',
      metaDescription: 'Công cụ đổi âm lượng trực tuyến miễn phí. Làm tệp MP3, WAV hoặc bất kỳ tệp âm thanh nào to hơn hay nhỏ hơn theo một hệ số cố định hoặc theo decibel, kèm hiệu ứng fade. Không hình mờ, không cần đăng ký.',
      ogTitle: 'Tăng hoặc giảm âm lượng âm thanh trực tuyến',
      ogDescription: 'Làm mọi âm thanh to hơn hoặc nhỏ hơn. Miễn phí, không cần đăng ký.',
      intro: 'Đôi khi một tệp chỉ đơn giản là quá nhỏ, hoặc to hơn hẳn phần còn lại của danh sách phát, và tất cả những gì nó cần là tăng hoặc giảm một mức cố định. Media Manipulator điều chỉnh âm lượng trên máy chủ của chúng tôi bằng FFmpeg, theo hệ số nhân hoặc theo decibel, thêm hiệu ứng fade nếu bạn muốn, và có thể kết hợp thay đổi này với chuẩn hóa độ to để kết quả không bị clip (vỡ tiếng).',
      whatItDoes: [
        'Nhân âm lượng từ 0,1x (rất nhỏ) đến 2x (gấp đôi).',
        'Hoặc đặt mức khuếch đại chính xác theo decibel từ -60 đến +60 dB bằng thanh trượt Khuếch đại.',
        'Fade in và fade out tính bằng giây.',
        'Tùy chọn chuẩn hóa và nén dải động để tránh clip khi tăng mạnh.',
      ],
      flowSteps: [
        {
          title: 'Tải âm thanh lên',
          description: 'Mọi định dạng phổ biến.',
        },
        {
          title: 'Đặt âm lượng',
          description: '1,5x được chọn sẵn; hoặc dùng decibel.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg áp dụng mức khuếch đại.',
        },
        {
          title: 'Tải về',
          description: 'Lưu tệp đã điều chỉnh.',
        },
      ],
      advancedDetails: [
        'Âm lượng dùng bộ lọc volume; hệ số 2 tương đương +6 dB, 0,5 tương đương -6 dB.',
        'Tăng âm lượng cho một tệp vốn đã có đỉnh gần 0 dBFS sẽ gây clip; hãy bật chuẩn hóa, vốn có sẵn bộ giới hạn đỉnh thực (true-peak limiter).',
        'Để có độ to cảm nhận đồng đều thay vì một mức khuếch đại cố định, hãy dùng công cụ Chuẩn hóa âm thanh.',
      ],
      whyItMatters: [
        'Bản ghi nhỏ tiếng rất khó nghe trên loa điện thoại.',
        'Nhạc chuông hay hiệu ứng âm thanh quá to gây khó chịu và bị clip.',
        'Khuếch đại cố định là công cụ phù hợp khi bạn biết chính xác cần thay đổi bao nhiêu.',
      ],
      useCases: [
        {
          title: 'Tăng âm cho ghi chú nhỏ tiếng',
          description: 'Giúp bản ghi âm trên điện thoại nghe rõ.',
        },
        {
          title: 'Hạ một hiệu ứng quá to',
          description: 'Giảm hiệu ứng âm thanh đi 10 dB.',
        },
        {
          title: 'Nhạc chuông',
          description: 'Tăng âm lượng và thêm fade out.',
        },
        {
          title: 'Nhạc nền',
          description: 'Hạ nhỏ bản nhạc để làm nền cho giọng nói.',
        },
      ],
      whyMediaManipulator: [
        'Hệ số nhân hoặc decibel, cùng hiệu ứng fade, tất cả ở một nơi.',
        'Chuẩn hóa và nén dải động trong cùng một lượt để tránh clip.',
      ],
      privacyNote: 'Âm thanh của bạn được FFmpeg làm to hơn hoặc nhỏ hơn theo mức bạn đặt, trên máy chủ của chúng tôi. Không có dịch vụ âm thanh bên ngoài nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Bạn nhận được một tệp mới; bản tải lên không bị thay đổi.',
      faq: [
        {
          question: 'Mức tăng tối đa là bao nhiêu?',
          answer: '2x với hệ số nhân, hoặc tối đa +60 dB với thanh trượt Khuếch đại. Mức tăng lớn sẽ bị clip trừ khi bật chuẩn hóa.',
        },
        {
          question: 'Âm thanh có bị méo không?',
          answer: 'Chỉ khi tín hiệu sau khi tăng vượt quá mức toàn thang (full scale). Hãy bật chuẩn hóa, tính năng này giới hạn đỉnh thực.',
        },
        {
          question: 'Hệ số nhân hay decibel?',
          answer: 'Cả hai làm cùng một việc. 2x bằng +6 dB; 0,5x bằng -6 dB.',
        },
        {
          question: 'Thay vào đó, tôi có thể làm đều âm lượng không?',
          answer: 'Có. Hãy dùng công cụ Chuẩn hóa âm thanh để có độ to cảm nhận đồng đều.',
        },
      ],
      related: [
        {
          label: 'Chuẩn hóa âm thanh',
          to: '/tools/normalize-audio',
          description: 'Độ to đồng đều.',
        },
        {
          label: 'Bộ chuyển đổi âm thanh',
          to: '/tools/audio-converter',
          description: 'Chuyển đổi giữa mọi định dạng âm thanh phổ biến.',
        },
        {
          label: 'Đổi tốc độ âm thanh',
          to: '/tools/change-audio-speed',
          description: 'Tăng tốc hoặc làm chậm bản ghi âm.',
        },
        {
          label: 'Đổi cao độ âm thanh',
          to: '/tools/change-audio-pitch',
          description: 'Dịch tông lên hoặc xuống.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Khử tiếng ồn bằng AI.',
        },
        {
          label: 'Loại bỏ giọng hát khỏi bài hát',
          to: '/tools/remove-vocals-from-song',
          description: 'Tạo bản nhạc không lời.',
        },
      ],
      embed: {
        title: 'Điều chỉnh âm lượng tệp âm thanh',
        description: 'Tải lên tệp âm thanh và đặt hệ số âm lượng; 1,5x được chọn sẵn. Để thay đổi theo decibel, hãy dùng thanh trượt Khuếch đại trong phần Xử lý âm thanh cơ bản. Tăng mạnh có thể gây clip; hãy bật chuẩn hóa để có kết quả an toàn.',
      },
    },
    'audio-equalizer': {
      name: 'Bộ cân bằng âm thanh',
      h1: 'Cân bằng âm thanh trực tuyến: tăng âm trầm, âm cao, cài đặt sẵn',
      tagline: 'Áp dụng tăng âm trầm, nâng âm cao, làm nổi giọng hát hoặc cài đặt sẵn theo thể loại, hoặc đặt bộ lọc thông thấp và thông cao, rồi tải kết quả về.',
      metaTitle: 'Bộ cân bằng âm thanh trực tuyến: bass, treble, giọng | Media Manipulator',
      metaDescription: 'Bộ cân bằng âm thanh trực tuyến miễn phí. Áp dụng cài đặt sẵn tăng âm trầm, tăng âm cao, giọng hát, rock, jazz hoặc cổ điển, hoặc đặt bộ lọc thông cao và thông thấp, cho MP3, WAV và nhiều định dạng khác. Không cần đăng ký.',
      ogTitle: 'Cân bằng âm thanh trực tuyến',
      ogDescription: 'Tăng âm trầm, âm cao, làm nổi giọng nói và nhiều hơn nữa. Miễn phí, không cần đăng ký.',
      intro: 'EQ định hình âm sắc của bản ghi: thêm âm trầm cho bản nhạc mỏng, bớt âm trầm cho căn phòng bị dội ù, nâng dải presence để giọng nói nổi bật, thêm bộ lọc thông cao để loại bỏ tiếng ù trầm. Media Manipulator áp dụng cân bằng âm thanh trên máy chủ của chúng tôi bằng FFmpeg, từ cài đặt sẵn một chạm đến tần số cắt cụ thể của bộ lọc, và xuất ra bất kỳ định dạng âm thanh nào.',
      whatItDoes: [
        'Cài đặt sẵn: tăng âm trầm, tăng âm cao, giọng hát, rock, jazz, cổ điển.',
        'Bộ lọc thông cao và thông thấp với tần số cắt điều chỉnh được.',
        'Kết hợp với âm lượng, chuẩn hóa, nén dải động và hiệu ứng vang.',
        'Kết quả sau khi cân bằng có thể là MP3, WAV, FLAC, M4A, OGG hoặc Opus.',
      ],
      flowSteps: [
        {
          title: 'Tải âm thanh lên',
          description: 'Mọi định dạng phổ biến.',
        },
        {
          title: 'Chọn cài đặt sẵn hoặc bộ lọc',
          description: 'Tăng bass được chọn sẵn.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg áp dụng chuỗi EQ.',
        },
        {
          title: 'Tải về',
          description: 'Lưu tệp đã được chỉnh âm sắc.',
        },
      ],
      advancedDetails: [
        'Các cài đặt sẵn tương ứng với bộ lọc equalizer, bass và treble của FFmpeg, với mức khuếch đại và hệ số Q cố định.',
        'Bộ lọc thông cao ở 80 đến 120 Hz loại bỏ tiếng động khi cầm micro và tiếng ù trầm khỏi bản ghi giọng nói; bộ lọc thông thấp ở 8 đến 10 kHz làm dịu tiếng xì.',
        'EQ không thể thêm những tần số chưa từng được ghi lại; bản ghi bằng điện thoại có rất ít âm thanh dưới 100 Hz để tăng.',
      ],
      whyItMatters: [
        'Chỉ cần nâng nhẹ dải presence là lời nói dễ nghe hơn hẳn trên loa nhỏ.',
        'Tiếng ù trầm và tiếng xì là hai lỗi phổ biến nhất cần sửa, và cả hai đều chỉ cần một bộ lọc đơn giản.',
        'Cài đặt sẵn theo thể loại mang lại chất âm nhanh chóng và đồng nhất cho cả danh sách phát.',
      ],
      useCases: [
        {
          title: 'Giọng nói rõ ràng',
          description: 'Cài đặt sẵn giọng hát cùng bộ lọc thông cao cho podcast.',
        },
        {
          title: 'Tăng âm trầm',
          description: 'Làm dày một bản ghi bị mỏng.',
        },
        {
          title: 'Loại bỏ tiếng ù trầm',
          description: 'Thông cao ở 100 Hz.',
        },
        {
          title: 'Làm dịu tiếng xì',
          description: 'Thông thấp ở 10 kHz cho bản chuyển từ băng cassette cũ.',
        },
      ],
      whyMediaManipulator: [
        'Cài đặt sẵn và tần số cắt cụ thể của bộ lọc trong cùng một phần.',
        'Kết hợp với chuẩn hóa, nén dải động và hiệu ứng vang trong cùng một lần tải lên.',
      ],
      privacyNote: 'Âm trầm, âm trung và âm cao trong âm thanh của bạn được bộ cân bằng của FFmpeg định hình lại trên máy chủ của chúng tôi. Không có dịch vụ âm thanh bên ngoài nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Bạn nhận được một tệp mới; bản tải lên không bị thay đổi.',
      faq: [
        {
          question: 'Tôi có thể tự đặt các dải tần không?',
          answer: 'Hiện có các cài đặt sẵn cùng tần số cắt thông cao và thông thấp; mức khuếch đại cho từng dải đang nằm trong lộ trình phát triển.',
        },
        {
          question: 'Bộ lọc thông cao làm gì?',
          answer: 'Nó loại bỏ mọi thứ dưới tần số cắt: tiếng ù trầm, tiếng động khi cầm micro, tiếng bật hơi.',
        },
        {
          question: 'EQ có sửa được bản ghi bị đục không?',
          answer: 'Tăng âm cao sẽ giúp ích nếu dải cao chỉ đơn thuần bị nhỏ. Nếu chúng chưa từng được thu lại, EQ không thể tự tạo ra; hãy thử làm sạch giọng nói bằng AI.',
        },
        {
          question: 'EQ có gây clip không?',
          answer: 'Việc tăng có thể gây clip. Hãy bật chuẩn hóa, tính năng này có sẵn bộ giới hạn đỉnh thực.',
        },
      ],
      related: [
        {
          label: 'Làm sạch âm thanh giọng nói',
          to: '/tools/clean-voice-audio',
          description: 'Tăng cường giọng nói bằng AI.',
        },
        {
          label: 'Bộ chuyển đổi âm thanh',
          to: '/tools/audio-converter',
          description: 'Chuyển đổi giữa mọi định dạng âm thanh phổ biến.',
        },
        {
          label: 'Đổi tốc độ âm thanh',
          to: '/tools/change-audio-speed',
          description: 'Tăng tốc hoặc làm chậm bản ghi âm.',
        },
        {
          label: 'Đổi cao độ âm thanh',
          to: '/tools/change-audio-pitch',
          description: 'Dịch tông lên hoặc xuống.',
        },
        {
          label: 'Chuẩn hóa âm thanh',
          to: '/tools/normalize-audio',
          description: 'Làm đều độ to.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Khử tiếng ồn bằng AI.',
        },
        {
          label: 'Loại bỏ giọng hát khỏi bài hát',
          to: '/tools/remove-vocals-from-song',
          description: 'Tạo bản nhạc không lời.',
        },
      ],
      embed: {
        title: 'Cân bằng tệp âm thanh',
        description: 'Tải lên tệp âm thanh. Bộ cân bằng trong phần Xử lý âm thanh cơ bản đã được bật sẵn với cài đặt Tăng bass; hãy chọn cài đặt sẵn khác hoặc đặt tần số cắt thông cao và thông thấp. Nhấn Chuyển đổi.',
      },
    },
    'add-reverb-to-audio': {
      name: 'Thêm hiệu ứng vang vào âm thanh',
      h1: 'Thêm hiệu ứng vang hoặc tiếng vọng vào âm thanh trực tuyến',
      tagline: 'Đặt giọng hát khô hoặc bản ghi vào phòng, đại sảnh, vang tấm hoặc vang lò xo, hoặc thêm độ trễ hay tiếng vọng, rồi tải kết quả về.',
      metaTitle: 'Thêm vang hoặc tiếng vọng vào âm thanh miễn phí | Media Manipulator',
      metaDescription: 'Hiệu ứng vang và tiếng vọng trực tuyến miễn phí. Thêm vang phòng, đại sảnh, vang tấm hoặc vang lò xo, hoặc hiệu ứng trễ, vào MP3, WAV và mọi tệp âm thanh, với điều khiển mức wet và kích thước phòng. Không cần đăng ký.',
      ogTitle: 'Thêm vang hoặc tiếng vọng vào âm thanh trực tuyến',
      ogDescription: 'Vang phòng, đại sảnh, vang tấm, vang lò xo và hiệu ứng trễ. Miễn phí, không cần đăng ký.',
      intro: 'Giọng hát thu trong phòng đã xử lý âm học nghe sẽ khô và thiếu sức sống cho đến khi được đặt vào một không gian nào đó. Hiệu ứng vang tạo ra không gian ấy; hiệu ứng trễ thêm nhịp điệu. Media Manipulator áp dụng vang phòng, đại sảnh, vang tấm, vang lò xo và các hiệu ứng trễ kiểu tiếng vọng trên máy chủ của chúng tôi bằng FFmpeg, với điều khiển mức wet và kích thước phòng, và xuất ra bất kỳ định dạng âm thanh nào.',
      whatItDoes: [
        'Các kiểu vang phòng (Room), đại sảnh (Hall), vang tấm (Plate) và vang lò xo (Spring), với kích thước phòng, độ hãm (damping) và tỷ lệ wet/dry.',
        'Hiệu ứng trễ echo, multi-tap và ping-pong, với thời gian trễ và hồi tiếp.',
        'Các hiệu ứng điều biến chorus, flanger, phaser và tremolo trong cùng một phần.',
        'Chọn MP3, WAV, FLAC, M4A, OGG hoặc Opus cho bản đã thêm hiệu ứng.',
      ],
      flowSteps: [
        {
          title: 'Tải âm thanh lên',
          description: 'Giọng hát hoặc nhạc cụ khô (chưa có hiệu ứng) cho kết quả tốt nhất.',
        },
        {
          title: 'Chọn kiểu vang',
          description: 'Hall được chọn sẵn; đặt kích thước và tỷ lệ trộn.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg kết xuất hiệu ứng.',
        },
        {
          title: 'Tải về',
          description: 'Lưu kết quả.',
        },
      ],
      advancedDetails: [
        'Các hiệu ứng vang được tạo từ bộ lọc aecho của FFmpeg với bộ thông số trễ và tắt dần riêng cho từng kiểu; mức wet trộn hiệu ứng với tín hiệu khô.',
        'Thời gian trễ tính bằng mili giây; hồi tiếp trên 70 phần trăm sẽ dồn lên rất nhanh.',
        'Hiệu ứng được kết xuất thẳng vào tệp; hãy giữ bản gốc khô nếu bạn có thể muốn thay đổi chúng.',
      ],
      whyItMatters: [
        'Giọng hát và lời thuyết minh khô nghe không tự nhiên nếu thiếu chút không gian.',
        'Vang tấm ngắn là bước hoàn thiện tiêu chuẩn cho lời nói và bài hát.',
        'Hiệu ứng trễ và điều biến là cách nhanh nhất để tạo một yếu tố thiết kế âm thanh.',
      ],
      useCases: [
        {
          title: 'Hoàn thiện giọng hát',
          description: 'Vang tấm ngắn cho một đoạn hát hoặc lời nói.',
        },
        {
          title: 'Đại sảnh rộng lớn',
          description: 'Đặt dàn hợp xướng hoặc lớp pad vào một thánh đường.',
        },
        {
          title: 'Tiếng vọng slapback',
          description: 'Một tiếng vọng nhanh cho guitar hoặc giọng hát.',
        },
        {
          title: 'Thiết kế âm thanh',
          description: 'Trễ ping-pong và flanger cho một hiệu ứng.',
        },
      ],
      whyMediaManipulator: [
        'Bốn kiểu vang, ba kiểu trễ và bốn hiệu ứng điều biến trong cùng một phần.',
        'Kết hợp với EQ, chuẩn hóa và cao độ trong cùng một lần tải lên.',
      ],
      privacyNote: 'Hiệu ứng vang được FFmpeg thêm vào âm thanh của bạn trên máy chủ của chúng tôi. Không có dịch vụ âm thanh bên ngoài nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Bạn nhận được một tệp mới; bản tải lên không bị thay đổi.',
      faq: [
        {
          question: 'Tôi nên dùng kiểu vang nào cho giọng nói?',
          answer: 'Vang tấm hoặc phòng nhỏ với mức wet 20 đến 30 phần trăm. Đại sảnh dành cho âm nhạc và hiệu ứng.',
        },
        {
          question: 'Tôi có thể loại bỏ tiếng vang không?',
          answer: 'Không phải ở đây. Công cụ làm sạch giọng nói bằng AI giảm tiếng vang phòng trong lời nói.',
        },
        {
          question: 'Tôi có thể thêm cả vang và trễ không?',
          answer: 'Có. Cả hai nằm trong cùng một phần và có thể bật cùng lúc.',
        },
        {
          question: 'Hiệu ứng có hoàn tác được không?',
          answer: 'Không. Hiệu ứng được kết xuất thẳng vào tệp; hãy giữ bản gốc khô của bạn.',
        },
      ],
      related: [
        {
          label: 'Bộ chuyển đổi âm thanh',
          to: '/tools/audio-converter',
          description: 'Chuyển đổi giữa mọi định dạng âm thanh phổ biến.',
        },
        {
          label: 'Đổi tốc độ âm thanh',
          to: '/tools/change-audio-speed',
          description: 'Tăng tốc hoặc làm chậm bản ghi âm.',
        },
        {
          label: 'Đổi cao độ âm thanh',
          to: '/tools/change-audio-pitch',
          description: 'Dịch tông lên hoặc xuống.',
        },
        {
          label: 'Chuẩn hóa âm thanh',
          to: '/tools/normalize-audio',
          description: 'Làm đều độ to.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Khử tiếng ồn bằng AI.',
        },
        {
          label: 'Loại bỏ giọng hát khỏi bài hát',
          to: '/tools/remove-vocals-from-song',
          description: 'Tạo bản nhạc không lời.',
        },
      ],
      embed: {
        title: 'Thêm hiệu ứng vang vào tệp âm thanh',
        description: 'Tải lên tệp âm thanh. Phần Hiệu ứng theo thời gian mở ra với kiểu vang Hall được chọn; hãy chỉnh kích thước phòng và mức wet, hoặc chọn Room, Plate hay Spring, hoặc thêm hiệu ứng trễ. Nhấn Chuyển đổi.',
      },
    },
    'trim-audio': {
      name: 'Cắt âm thanh',
      h1: 'Cắt ngắn hoặc cắt đoạn âm thanh trực tuyến miễn phí',
      tagline: 'Cắt MP3, WAV hoặc bất kỳ bản ghi nào theo thời gian bắt đầu và kết thúc, có dạng sóng để chọn điểm, và chỉ tải phần đó về.',
      metaTitle: 'Cắt âm thanh trực tuyến miễn phí: cắt MP3, WAV | Media Manipulator',
      metaDescription: 'Công cụ cắt âm thanh trực tuyến miễn phí. Cắt bất kỳ tệp âm thanh nào theo một khoảng trên dạng sóng, thêm fade và tải về MP3, WAV, M4A hoặc định dạng khác. Tạo nhạc chuông hoặc một đoạn clip. Không hình mờ, không cần đăng ký.',
      ogTitle: 'Cắt ngắn hoặc cắt đoạn âm thanh trực tuyến miễn phí',
      ogDescription: 'Chọn điểm bắt đầu và kết thúc trên dạng sóng rồi tải đoạn clip về. Miễn phí, không cần đăng ký.',
      intro: 'Đoạn điệp khúc làm nhạc chuông, một phút đáng giá trong bản ghi dài hai giờ, câu nói đắt giá không kèm phần mở đầu: cắt là thao tác chỉnh sửa âm thanh ai cũng cần. Media Manipulator hiển thị dạng sóng, cho phép bạn kéo điểm bắt đầu và kết thúc, cắt trên máy chủ của chúng tôi bằng FFmpeg, và xuất ra bất kỳ định dạng nào với fade tùy chọn.',
      whatItDoes: [
        'Cắt bất kỳ tệp âm thanh nào theo thời gian bắt đầu và kết thúc chọn trên dạng sóng.',
        'Fade in và fade out để điểm cắt không bị tiếng tách.',
        'Đoạn cắt được trả về dưới dạng MP3, WAV, FLAC, M4A, OGG hoặc Opus.',
        'Kết hợp với âm lượng, chuẩn hóa và EQ trong cùng một lượt.',
      ],
      flowSteps: [
        {
          title: 'Tải âm thanh lên',
          description: 'Mọi định dạng phổ biến.',
        },
        {
          title: 'Đặt khoảng cắt',
          description: 'Kéo các điểm đánh dấu trên dạng sóng.',
        },
        {
          title: 'Chuyển đổi',
          description: 'FFmpeg cắt và mã hóa.',
        },
        {
          title: 'Tải về',
          description: 'Lưu đoạn clip.',
        },
      ],
      advancedDetails: [
        'Đoạn cắt chính xác đến từng mẫu; đầu ra được mã hóa lại theo định dạng bạn chọn.',
        'Fade dài 0,05 đến 0,2 giây sẽ loại bỏ tiếng tách tại các điểm cắt.',
        'Với video, hãy dùng công cụ Cắt video; để tạo video dạng sóng từ kết quả, hãy dùng Trình tạo dạng sóng âm thanh.',
      ],
      whyItMatters: [
        'Nhạc chuông và âm báo cần một đoạn cắt dài 20 đến 30 giây.',
        'Chia sẻ một câu nói ngắn dễ hơn chia sẻ cả bản ghi.',
        'Loại bỏ khoảng lặng và phần mở đầu trước khi chép lời giúp tiết kiệm thời gian.',
      ],
      useCases: [
        {
          title: 'Nhạc chuông',
          description: 'Cắt đoạn điệp khúc và thêm fade.',
        },
        {
          title: 'Câu nói đắt giá',
          description: 'Trích một câu từ buổi phỏng vấn.',
        },
        {
          title: 'Bỏ phần đầu hỏng',
          description: 'Bỏ 10 giây đầu của ghi chú giọng nói.',
        },
        {
          title: 'Mẫu âm',
          description: 'Tách riêng một tiếng gõ hoặc một câu nhạc.',
        },
      ],
      whyMediaManipulator: [
        'Chỉnh sửa trên dạng sóng với điểm đánh dấu kéo thả được, không phải gõ mốc thời gian.',
        'Fade, chuẩn hóa và mọi định dạng đầu ra trong cùng một lần tải lên.',
      ],
      privacyNote: 'Âm thanh của bạn được FFmpeg cắt theo điểm bắt đầu và kết thúc bạn đặt, trên máy chủ của chúng tôi. Không có dịch vụ âm thanh bên ngoài nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Bạn nhận được một tệp mới; bản tải lên không bị thay đổi.',
      faq: [
        {
          question: 'Tôi có thể nhập thời gian chính xác không?',
          answer: 'Có. Hộp thoại cắt có các ô bắt đầu và kết thúc bên cạnh các điểm đánh dấu kéo được.',
        },
        {
          question: 'Điểm cắt có bị tiếng tách không?',
          answer: 'Hãy thêm fade in và fade out ngắn trong phần Xử lý âm thanh cơ bản để tránh điều đó.',
        },
        {
          question: 'Tôi có thể giữ chất lượng gốc không?',
          answer: 'Hãy chọn đầu ra WAV hoặc FLAC để tránh mã hóa lại có tổn hao.',
        },
        {
          question: 'Tôi có thể cắt bỏ phần giữa không?',
          answer: 'Mỗi lượt chỉ một khoảng; hãy chạy công cụ hai lần và ghép các phần lại trong Darkroom.',
        },
      ],
      related: [
        {
          label: 'Cắt video',
          to: '/tools/video-trimmer',
          description: 'Tương tự, dành cho video.',
        },
        {
          label: 'Tách âm thanh khỏi video',
          to: '/tools/extract-audio-from-video',
          description: 'Lấy âm thanh ra trước.',
        },
        {
          label: 'Bộ chuyển đổi âm thanh',
          to: '/tools/audio-converter',
          description: 'Chuyển đổi giữa mọi định dạng âm thanh phổ biến.',
        },
        {
          label: 'Đổi tốc độ âm thanh',
          to: '/tools/change-audio-speed',
          description: 'Tăng tốc hoặc làm chậm bản ghi âm.',
        },
        {
          label: 'Đổi cao độ âm thanh',
          to: '/tools/change-audio-pitch',
          description: 'Dịch tông lên hoặc xuống.',
        },
        {
          label: 'Chuẩn hóa âm thanh',
          to: '/tools/normalize-audio',
          description: 'Làm đều độ to.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Khử tiếng ồn bằng AI.',
        },
        {
          label: 'Loại bỏ giọng hát khỏi bài hát',
          to: '/tools/remove-vocals-from-song',
          description: 'Tạo bản nhạc không lời.',
        },
      ],
      embed: {
        title: 'Cắt tệp âm thanh',
        description: 'Tải lên tệp âm thanh, nhấn Cắt đoạn âm thanh rồi kéo các điểm đánh dấu bắt đầu và kết thúc trên dạng sóng. Thêm fade in hoặc fade out trong phần Xử lý âm thanh cơ bản nếu muốn. Nhấn Chuyển đổi.',
      },
    },
    'transcribe-audio': {
      name: 'Chuyển âm thanh thành văn bản',
      h1: 'Chuyển âm thanh thành văn bản trực tuyến',
      tagline: 'Chuyển MP3, WAV, M4A hoặc bất kỳ bản ghi nào thành văn bản, phụ đề hoặc JSON bằng nhận dạng giọng nói AI trên máy chủ GPU của chúng tôi.',
      metaTitle: 'Chuyển âm thanh thành văn bản trực tuyến (AI miễn phí) | Media Manipulator',
      metaDescription: 'Chép lời âm thanh trực tuyến miễn phí. Chuyển bản ghi MP3, WAV, M4A, OGG hoặc FLAC thành văn bản thuần, phụ đề VTT hoặc SRT, hoặc JSON có dấu thời gian. Chạy trên GPU của chính chúng tôi, không dùng AI của bên thứ ba.',
      ogTitle: 'Chuyển âm thanh thành văn bản trực tuyến',
      ogDescription: 'Biến bản ghi âm, buổi phỏng vấn và ghi chú giọng nói thành văn bản. Miễn phí, không cần đăng ký.',
      intro: 'Phỏng vấn, bài giảng, ghi chú giọng nói và bản ghi cuộc họp hữu ích hơn nhiều khi ở dạng văn bản: có thể tìm kiếm, trích dẫn, dịch. Media Manipulator chép lời âm thanh bằng mô hình Whisper trên máy chủ GPU do chúng tôi vận hành, nên bản ghi của bạn không bao giờ rời khỏi hạ tầng của chúng tôi, và trả về văn bản thuần, phụ đề VTT hoặc SRT, hoặc bản chép lời JSON có dấu thời gian cho từng từ.',
      whatItDoes: [
        'Chép lời MP3, WAV, M4A, OGG, FLAC và các định dạng âm thanh khác bằng Whisper.',
        'Xuất văn bản thuần, VTT, SRT hoặc JSON có dấu thời gian.',
        'Tự động nhận diện ngôn ngữ trong số hàng chục ngôn ngữ.',
        'Chạy trên GPU của chính chúng tôi; không dùng nhà cung cấp AI bên thứ ba.',
      ],
      flowSteps: [
        {
          title: 'Tải âm thanh lên',
          description: 'Mọi định dạng phổ biến.',
        },
        {
          title: 'Chọn đầu ra',
          description: 'Văn bản, VTT, SRT hoặc JSON.',
        },
        {
          title: 'Chép lời',
          description: 'Whisper chạy trên máy chủ GPU của chúng tôi.',
        },
        {
          title: 'Tải về',
          description: 'Mở trình xem bản chép lời hoặc lưu tệp.',
        },
      ],
      advancedDetails: [
        'Dùng whisper-ctranslate2 với một mô hình đa ngôn ngữ cỡ lớn; độ chính xác tốt nhất với lời nói rõ ràng, ít tiếng ồn nền.',
        'Với bản ghi nhiều tiếng ồn, hãy chạy công cụ Loại bỏ tiếng ồn nền trước để có bản chép lời tốt hơn.',
        'Mỗi lần chép lời được tính là một tác vụ AI, trừ vào hạn mức tác vụ AI mỗi ngày chứ không phải hạn mức tác vụ thường; tác vụ thất bại không bị tính.',
      ],
      whyItMatters: [
        'Văn bản có thể tìm kiếm và đọc lướt; âm thanh thì không.',
        'Phụ đề giúp nội dung âm thanh dễ tiếp cận và được lập chỉ mục.',
        'Bản chép lời là điểm khởi đầu cho ghi chú, bài viết và bản dịch.',
      ],
      useCases: [
        {
          title: 'Ghi chú phỏng vấn',
          description: 'Có văn bản để bạn trích dẫn.',
        },
        {
          title: 'Bản chép lời bài giảng',
          description: 'Học từ văn bản, tìm kiếm thuật ngữ.',
        },
        {
          title: 'Phụ đề podcast',
          description: 'SRT hoặc VTT cho phiên bản video.',
        },
        {
          title: 'Ghi chú giọng nói thành văn bản',
          description: 'Biến suy nghĩ thành tài liệu.',
        },
      ],
      whyMediaManipulator: [
        'Whisper chạy trên phần cứng do chúng tôi vận hành; âm thanh của bạn không bao giờ được gửi đến AI của bên thứ ba.',
        'Bốn định dạng đầu ra và trình xem bản chép lời tích hợp sẵn.',
      ],
      privacyNote: 'Bản ghi của bạn được Whisper chép lời trên máy chủ GPU của chính chúng tôi, và văn bản được lưu cùng tác vụ. Các tác vụ AI chạy trên phần cứng do chúng tôi vận hành, không bao giờ qua nhà cung cấp AI bên thứ ba, và không có gì bạn tải lên được dùng để huấn luyện mô hình. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Hỗ trợ những ngôn ngữ nào?',
          answer: 'Whisper xử lý hàng chục ngôn ngữ và tự động nhận diện ngôn ngữ.',
        },
        {
          question: 'Độ chính xác ra sao?',
          answer: 'Rất tốt với lời nói rõ ràng. Tiếng ồn nền, nhiều người nói chồng lên nhau và giọng địa phương nặng làm giảm độ chính xác; hãy khử nhiễu trước nếu có thể.',
        },
        {
          question: 'Bản ghi của tôi có bị gửi đến OpenAI không?',
          answer: 'Không. Mô hình chạy trên máy chủ GPU của chính chúng tôi.',
        },
        {
          question: 'Tôi có thể nhận nhãn người nói không?',
          answer: 'Chưa. Đầu ra JSON có dấu thời gian theo từng từ để bạn tự phân đoạn.',
        },
        {
          question: 'Việc này có bị tính vào hạn mức của tôi không?',
          answer: 'Có, tính là một tác vụ AI trong hạn mức tác vụ AI, tách biệt với hạn mức tác vụ thường. Tác vụ thất bại không bị tính.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Tính là một tác vụ AI; tác vụ thất bại không bị tính.',
        ],
      },
      related: [
        {
          label: 'Chuyển video thành văn bản',
          to: '/tools/transcribe-video',
          description: 'Tương tự, dành cho tệp video.',
        },
        {
          label: 'Trình tạo phụ đề SRT',
          to: '/tools/srt-generator',
          description: 'Tạo thẳng phụ đề.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Làm sạch âm thanh trước.',
        },
        {
          label: 'Trình dịch phụ đề',
          to: '/tools/caption-translator',
          description: 'Dịch phụ đề.',
        },
      ],
      embed: {
        title: 'Chép lời tệp âm thanh',
        description: 'Tải lên tệp âm thanh và chọn đầu ra: văn bản thuần cho tài liệu, VTT hoặc SRT cho phụ đề, JSON cho dấu thời gian. Whisper chạy trên máy chủ GPU của chúng tôi; không có gì được gửi đến AI của bên thứ ba.',
      },
    },
    'add-text-to-image': {
      name: 'Thêm chữ vào ảnh',
      h1: 'Thêm chữ vào ảnh trực tuyến miễn phí',
      tagline: 'Đặt chú thích, tiêu đề hoặc hình mờ lên ảnh: chọn phông chữ, cỡ chữ, màu, viền và vị trí, rồi tải về.',
      metaTitle: 'Thêm chữ vào ảnh trực tuyến miễn phí: chú thích, hình mờ | Media Manipulator',
      metaDescription: 'Công cụ trực tuyến miễn phí để thêm chữ vào ảnh. Chọn phông chữ, cỡ chữ, màu, viền và vị trí cho chú thích, meme hoặc hình mờ trên JPG, PNG, WebP và nhiều định dạng khác. Không cần đăng ký.',
      ogTitle: 'Thêm chữ vào ảnh trực tuyến miễn phí',
      ogDescription: 'Chú thích, tiêu đề hoặc hình mờ trên mọi bức ảnh. Miễn phí, không cần đăng ký.',
      intro: 'Chú thích trên ảnh chụp màn hình, tiêu đề trên ảnh thu nhỏ, dòng bản quyền ở góc ảnh: thêm chữ là thao tác chỉnh sửa ảnh phổ biến nhất sau cắt ảnh. Media Manipulator vẽ chữ lên ảnh trên máy chủ của chúng tôi bằng ImageMagick, với phông chữ, cỡ chữ, màu chữ và màu viền, cùng vị trí chọn từ chín điểm neo hoặc tọa độ pixel chính xác, rồi xuất ra cùng định dạng hoặc một định dạng khác.',
      whatItDoes: [
        'Vẽ một khối chữ ở bất kỳ cỡ nào, với màu chữ và màu viền.',
        'Sáu phông chữ có sẵn (sans, serif, mono thuộc hai họ phông).',
        'Chín vị trí neo hoặc đặt chính xác theo x/y.',
        'Kết hợp với đổi kích thước, cắt, bộ lọc và tùy chọn siêu dữ liệu trong cùng một lượt.',
      ],
      flowSteps: [
        {
          title: 'Tải ảnh lên',
          description: 'JPG, PNG, WebP, HEIC và nhiều định dạng khác.',
        },
        {
          title: 'Nhập chữ và định kiểu',
          description: 'Cỡ chữ, màu, viền, phông chữ, vị trí.',
        },
        {
          title: 'Chuyển đổi',
          description: 'ImageMagick vẽ chữ.',
        },
        {
          title: 'Tải về',
          description: 'Lưu ảnh đã thêm chú thích.',
        },
      ],
      advancedDetails: [
        'Chữ được raster hóa ở kích thước đầu ra; hãy đặt cỡ chữ theo pixel, tương ứng với chiều rộng ảnh.',
        'Viền dày 2 đến 4 px với màu tương phản giúp chữ dễ đọc trên ảnh nhiều chi tiết.',
        'Chọn đầu ra PNG để giữ nền trong suốt cho mẫu hình mờ.',
      ],
      whyItMatters: [
        'Chú thích giúp ảnh chụp màn hình tự nói lên nội dung.',
        'Một dòng bản quyền hiển thị rõ giúp hạn chế việc đăng lại mà không ghi nguồn.',
        'Ảnh thu nhỏ có tiêu đề nhận được nhiều lượt nhấp hơn.',
      ],
      useCases: [
        {
          title: 'Chú thích ảnh chụp màn hình',
          description: 'Ghi rõ người xem đang nhìn thấy gì.',
        },
        {
          title: 'Đóng hình mờ lên ảnh',
          description: 'Tên bạn ở góc dưới.',
        },
        {
          title: 'Tiêu đề ảnh thu nhỏ',
          description: 'Chữ to, đậm cho ảnh thu nhỏ video.',
        },
        {
          title: 'Meme',
          description: 'Chữ ở trên, chữ ở dưới.',
        },
      ],
      whyMediaManipulator: [
        'Màu chữ, viền, phông chữ và chín vị trí đặt, không chỉ là một hộp văn bản.',
        'Đổi kích thước, cắt và chuyển đổi trong cùng một lần tải lên.',
      ],
      privacyNote: 'Văn bản bạn nhập được ImageMagick vẽ lên ảnh của bạn trên máy chủ của chúng tôi. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Ảnh gốc không bao giờ bị thay đổi: bạn tải về một tệp mới.',
      faq: [
        {
          question: 'Tôi có thể thêm nhiều hơn một dòng không?',
          answer: 'Mỗi lượt một khối chữ; dấu xuống dòng trong văn bản sẽ hiển thị thành dòng mới. Hãy chạy lại công cụ để thêm khối thứ hai.',
        },
        {
          question: 'Tôi có thể dùng phông chữ của riêng mình không?',
          answer: 'Có sẵn sáu phông chữ; không hỗ trợ tải lên phông chữ tùy chỉnh.',
        },
        {
          question: 'Làm sao để đặt chữ chính xác?',
          answer: 'Chọn một điểm neo và thêm độ lệch x/y theo pixel.',
        },
        {
          question: 'Chất lượng có bị giảm không?',
          answer: 'Ảnh được mã hóa lại; hãy chọn PNG hoặc chất lượng JPG cao để giữ độ nét.',
        },
      ],
      related: [
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa các định dạng ảnh.',
        },
        {
          label: 'Cắt ảnh',
          to: '/tools/crop-image',
          description: 'Cắt theo một vùng.',
        },
        {
          label: 'Đổi kích thước ảnh',
          to: '/tools/image-resizer',
          description: 'Thay đổi kích thước.',
        },
        {
          label: 'Bộ lọc ảnh',
          to: '/tools/image-filters',
          description: 'Sepia, phác họa, nổi khối và nhiều hơn nữa.',
        },
        {
          label: 'Xóa siêu dữ liệu EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Xóa dữ liệu vị trí và thiết bị.',
        },
      ],
      embed: {
        title: 'Thêm chữ vào ảnh',
        description: 'Tải ảnh lên. Phần Chữ phủ được làm nổi bật: nhập văn bản, đặt cỡ chữ, màu, viền, phông chữ và vị trí (chín điểm neo hoặc tọa độ chính xác). Nhấn Chuyển đổi.',
      },
    },
    'crop-image': {
      name: 'Cắt ảnh',
      h1: 'Cắt ảnh trực tuyến miễn phí',
      tagline: 'Kéo một khung lên phần ảnh bạn muốn, chỉnh lại bố cục, và chỉ tải vùng đó về ở bất kỳ định dạng nào.',
      metaTitle: 'Cắt ảnh trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ cắt ảnh trực tuyến miễn phí. Kéo để chọn một vùng trên ảnh JPG, PNG, WebP hoặc HEIC và tải về. Kết hợp với đổi kích thước, bộ lọc và chuyển đổi định dạng. Không cần đăng ký.',
      ogTitle: 'Cắt ảnh trực tuyến miễn phí',
      ogDescription: 'Kéo một khung, tải vùng đó về. Miễn phí, không cần đăng ký.',
      intro: 'Cắt ảnh giúp sửa bố cục, loại bỏ chi tiết thừa ở rìa và biến một bức ảnh thành phiên bản chặt chẽ hơn. Media Manipulator mở công cụ cắt trực quan trên ảnh đã tải lên, áp dụng vùng cắt trên máy chủ của chúng tôi bằng ImageMagick, và cho phép bạn đổi kích thước, áp bộ lọc và chuyển đổi kết quả trong cùng một lượt.',
      whatItDoes: [
        'Khung cắt trực quan với các tay nắm kéo được ngay trên ảnh thật.',
        'Tọa độ cắt chính xác được hiển thị và có thể chỉnh sửa.',
        'Kết hợp với đổi kích thước về chiều rộng và chiều cao mục tiêu sau khi cắt.',
        'Lưu vùng đã cắt dưới dạng JPG, PNG, WebP, AVIF hoặc GIF.',
      ],
      flowSteps: [
        {
          title: 'Tải ảnh lên',
          description: 'Mọi định dạng phổ biến.',
        },
        {
          title: 'Vẽ vùng cắt',
          description: 'Kéo khung và các tay nắm.',
        },
        {
          title: 'Chuyển đổi',
          description: 'ImageMagick cắt và mã hóa.',
        },
        {
          title: 'Tải về',
          description: 'Lưu ảnh đã cắt.',
        },
      ],
      advancedDetails: [
        'Vùng cắt được áp dụng trước khi đổi kích thước, nên một ảnh 4000 px được cắt còn 1000 px rồi đổi kích thước về 500 px chỉ bị thu nhỏ một lần.',
        'Cắt ảnh loại bỏ điểm ảnh và không thể hoàn tác; hãy giữ ảnh gốc.',
        'Hướng ảnh theo EXIF được tôn trọng, nên ảnh điện thoại bị xoay sẽ được cắt đúng như bạn thấy.',
      ],
      whyItMatters: [
        'Bố cục chặt hơn là cách cải thiện nhanh nhất cho hầu hết các bức ảnh.',
        'Ảnh đại diện và ảnh thu nhỏ cần những vùng và tỷ lệ cụ thể.',
        'Cắt bỏ người qua đường hoặc biển số xe là một cách bảo vệ quyền riêng tư.',
      ],
      useCases: [
        {
          title: 'Ảnh đại diện',
          description: 'Cắt sát khuôn mặt.',
        },
        {
          title: 'Loại bỏ chi tiết thừa',
          description: 'Bỏ phần rìa của ảnh.',
        },
        {
          title: 'Chi tiết ảnh chụp màn hình',
          description: 'Chỉ giữ lại phần liên quan.',
        },
        {
          title: 'Ảnh sản phẩm',
          description: 'Cắt sát, rồi đổi kích thước cho trang đăng bán.',
        },
      ],
      whyMediaManipulator: [
        'Công cụ cắt trực quan với tọa độ chính xác, cùng đổi kích thước và chuyển đổi trong cùng một lượt.',
        'Siêu dữ liệu được giữ lại hoặc xóa bỏ tùy bạn chọn.',
      ],
      privacyNote: 'Ảnh của bạn được ImageMagick cắt theo vùng bạn chọn trên máy chủ của chúng tôi. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Ảnh gốc không bao giờ bị thay đổi: bạn tải về một tệp mới.',
      faq: [
        {
          question: 'Tôi có thể cắt theo tỷ lệ cố định không?',
          answer: 'Hãy kéo khung theo tỷ lệ bạn cần; chiều rộng và chiều cao được hiển thị trong lúc bạn kéo.',
        },
        {
          question: 'Cắt ảnh có làm giảm chất lượng không?',
          answer: 'Các điểm ảnh còn lại không bị động đến. Hãy chọn PNG hoặc chất lượng JPG cao khi mã hóa lại.',
        },
        {
          question: 'Tôi có thể cắt video không?',
          answer: 'Có, với công cụ Cắt khung video.',
        },
        {
          question: 'Tôi có thể xoay ảnh trước không?',
          answer: 'Hãy dùng công cụ Xoay ảnh, rồi cắt.',
        },
      ],
      related: [
        {
          label: 'Cắt khung video',
          to: '/tools/crop-video',
          description: 'Tương tự, dành cho video.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa các định dạng ảnh.',
        },
        {
          label: 'Đổi kích thước ảnh',
          to: '/tools/image-resizer',
          description: 'Thay đổi kích thước.',
        },
        {
          label: 'Thêm chữ vào ảnh',
          to: '/tools/add-text-to-image',
          description: 'Chú thích hoặc hình mờ.',
        },
        {
          label: 'Bộ lọc ảnh',
          to: '/tools/image-filters',
          description: 'Sepia, phác họa, nổi khối và nhiều hơn nữa.',
        },
        {
          label: 'Xóa siêu dữ liệu EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Xóa dữ liệu vị trí và thiết bị.',
        },
      ],
      embed: {
        title: 'Cắt ảnh',
        description: 'Tải ảnh lên và nhấn Cắt hình ảnh để mở công cụ cắt trực quan. Kéo khung đến vùng bạn muốn và lưu; vùng cắt được áp dụng khi bạn nhấn Chuyển đổi.',
      },
    },
    'grayscale-image': {
      name: 'Chuyển ảnh sang đen trắng',
      h1: 'Chuyển ảnh sang đen trắng trực tuyến',
      tagline: 'Biến ảnh màu thành thang xám, hoặc sepia cho tông màu cổ điển, và tải về ở bất kỳ định dạng nào.',
      metaTitle: 'Chuyển ảnh sang đen trắng trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển ảnh sang đen trắng trực tuyến miễn phí. Biến mọi ảnh JPG, PNG, WebP hoặc HEIC thành thang xám hoặc sepia và tải về. Kết hợp với cắt, đổi kích thước và đổi định dạng. Không cần đăng ký.',
      ogTitle: 'Chuyển ảnh sang đen trắng trực tuyến',
      ogDescription: 'Thang xám hoặc sepia chỉ với một cú nhấp. Miễn phí, không cần đăng ký.',
      intro: 'Ảnh đen trắng lược bỏ mọi thứ chỉ còn ánh sáng, hình khối và kết cấu, che đi ám màu và ánh sáng hỗn hợp, đồng thời mang lại vẻ đồng nhất cho cả bộ ảnh. Media Manipulator chuyển sang thang xám trên máy chủ của chúng tôi bằng ImageMagick với phép chuyển đổi có trọng số độ chói, cung cấp tông sepia và cổ điển, và xuất ra bất kỳ định dạng ảnh nào.',
      whatItDoes: [
        'Chuyển ảnh màu sang thang xám với trọng số độ chói chính xác.',
        'Lựa chọn thay thế sepia và cổ điển cho tông màu ấm hoặc cũ kỹ.',
        'Kết hợp với cắt, đổi kích thước, thêm chữ và chuyển đổi định dạng.',
        'Bản đơn sắc có thể là JPG, PNG, WebP, AVIF hoặc GIF.',
      ],
      flowSteps: [
        {
          title: 'Tải ảnh lên',
          description: 'Mọi định dạng phổ biến.',
        },
        {
          title: 'Giữ thang xám hoặc chọn sepia',
          description: 'Bộ lọc đã được chọn sẵn.',
        },
        {
          title: 'Chuyển đổi',
          description: 'ImageMagick thực hiện chuyển đổi.',
        },
        {
          title: 'Tải về',
          description: 'Lưu kết quả.',
        },
      ],
      advancedDetails: [
        'Thang xám dùng trọng số độ chói Rec. 709, nên màu xanh lá trông sáng hơn màu xanh dương, đúng như mắt người cảm nhận.',
        'Sepia phủ một tông màu sau khi chuyển sang thang xám; cổ điển thêm hiệu ứng phai nhẹ và tối viền.',
        'Đầu ra giữ ba kênh màu, trừ khi bạn chọn một định dạng lưu thang xám nguyên bản.',
      ],
      whyItMatters: [
        'Ảnh đơn sắc che đi màu sắc kém và ánh sáng hỗn hợp.',
        'Một bộ ảnh đen trắng đồng nhất trông như được tuyển chọn kỹ lưỡng.',
        'Ảnh thang xám nén được nhỏ hơn.',
      ],
      useCases: [
        {
          title: 'Chân dung',
          description: 'Ảnh chân dung đen trắng cổ điển.',
        },
        {
          title: 'Bản quét tài liệu',
          description: 'Chuyển trang giấy được chụp lại sang thang xám.',
        },
        {
          title: 'Vẻ cổ điển',
          description: 'Sepia cho ảnh gia đình.',
        },
        {
          title: 'In ấn',
          description: 'Chuẩn bị cho máy in đen trắng.',
        },
      ],
      whyMediaManipulator: [
        'Thang xám đúng độ chói, cùng sepia và cổ điển.',
        'Cắt, đổi kích thước và chuyển đổi trong cùng một lần tải lên.',
      ],
      privacyNote: 'Màu sắc trong ảnh của bạn được ImageMagick loại bỏ trên máy chủ của chúng tôi. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Ảnh gốc không bao giờ bị thay đổi: bạn tải về một tệp mới.',
      faq: [
        {
          question: 'Thang xám hay khử bão hòa?',
          answer: 'Đây là thang xám có trọng số độ chói, trông tự nhiên hơn so với việc chỉ đơn giản loại bỏ độ bão hòa.',
        },
        {
          question: 'Tôi có thể có tông sepia không?',
          answer: 'Có. Hãy chọn Nâu đỏ (sepia) hoặc Cổ điển trong danh sách bộ lọc.',
        },
        {
          question: 'Tôi có thể làm điều này với video không?',
          answer: 'Có. Hãy dùng công cụ Chỉnh độ sáng và màu video và đặt độ bão hòa về -100.',
        },
        {
          question: 'Có khôi phục được màu gốc không?',
          answer: 'Không. Hãy giữ lại tệp gốc.',
        },
      ],
      related: [
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa các định dạng ảnh.',
        },
        {
          label: 'Cắt ảnh',
          to: '/tools/crop-image',
          description: 'Cắt theo một vùng.',
        },
        {
          label: 'Đổi kích thước ảnh',
          to: '/tools/image-resizer',
          description: 'Thay đổi kích thước.',
        },
        {
          label: 'Thêm chữ vào ảnh',
          to: '/tools/add-text-to-image',
          description: 'Chú thích hoặc hình mờ.',
        },
        {
          label: 'Bộ lọc ảnh',
          to: '/tools/image-filters',
          description: 'Sepia, phác họa, nổi khối và nhiều hơn nữa.',
        },
        {
          label: 'Xóa siêu dữ liệu EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Xóa dữ liệu vị trí và thiết bị.',
        },
      ],
      embed: {
        title: 'Chuyển ảnh sang đen trắng',
        description: 'Tải ảnh lên. Bộ lọc được đặt sẵn ở Thang xám; chuyển sang Nâu đỏ (sepia) hoặc Cổ điển để có tông ấm hơn. Nhấn Chuyển đổi.',
      },
    },
    'image-filters': {
      name: 'Bộ lọc và hiệu ứng ảnh',
      h1: 'Áp dụng bộ lọc và hiệu ứng cho ảnh trực tuyến',
      tagline: 'Tranh sơn dầu, phác họa, than chì, nổi khối, cổ điển, xoáy, làm mờ, làm nét và hơn thế nữa, áp dụng cho bất kỳ ảnh nào chỉ với một cú nhấp.',
      metaTitle: 'Bộ lọc ảnh trực tuyến miễn phí: Phác thảo, Sơn dầu, Dập nổi | Media Manipulator',
      metaDescription: 'Bộ lọc ảnh trực tuyến miễn phí. Áp dụng hiệu ứng sơn dầu, phác thảo bút chì, than chì, dập nổi, cổ điển, sepia, xoáy, làm mờ hoặc làm nét cho ảnh JPG, PNG, WebP và nhiều định dạng khác, rồi tải về. Không cần đăng ký.',
      ogTitle: 'Áp dụng bộ lọc và hiệu ứng cho ảnh trực tuyến',
      ogDescription: 'Phác thảo, sơn dầu, dập nổi, cổ điển và nhiều hiệu ứng khác. Miễn phí, không cần đăng ký.',
      intro: 'Đôi khi một bức ảnh muốn trở thành thứ khác: một bản phác thảo cho thiệp mời, một bức tranh sơn dầu để in, một logo dập nổi, một bức tranh trừu tượng xoáy. Media Manipulator áp dụng các bộ lọc nghệ thuật và hiệu chỉnh của ImageMagick trên máy chủ của chúng tôi, từ phác thảo bút chì đến làm nét, và xuất ra bất kỳ định dạng ảnh nào, có thể kèm cắt, đổi kích thước và thêm chú thích trong cùng một lượt.',
      whatItDoes: [
        'Nghệ thuật: sơn dầu, phác thảo, than chì, dập nổi, cổ điển, sepia, xoáy, méo thùng.',
        'Hiệu chỉnh: làm mờ, làm nét, thang xám.',
        'Xoay 45, 90, 180 và 270 độ ngay trong cùng ô chọn.',
        'Kết hợp với cắt, đổi kích thước, chèn chữ và chuyển đổi định dạng.',
      ],
      flowSteps: [
        {
          title: 'Tải ảnh lên',
          description: 'Mọi định dạng phổ biến.',
        },
        {
          title: 'Chọn bộ lọc',
          description: 'Sơn dầu được chọn sẵn.',
        },
        {
          title: 'Chuyển đổi',
          description: 'ImageMagick kết xuất hiệu ứng.',
        },
        {
          title: 'Tải về',
          description: 'Lưu kết quả.',
        },
      ],
      advancedDetails: [
        'Sơn dầu và than chì hoạt động dựa trên bán kính nên thay đổi theo kích thước ảnh; hãy đổi kích thước về 1500 đến 2500 px để có hiệu ứng mạnh nhất.',
        'Phác thảo và dập nổi cho kết quả tốt nhất với ảnh có đường nét rõ và độ tương phản tốt.',
        'Hiệu ứng được kết xuất thẳng vào điểm ảnh; hãy giữ lại bản gốc.',
      ],
      whyItMatters: [
        'Một bức ảnh cách điệu sẽ nổi bật giữa cả dòng ảnh chụp thông thường.',
        'Phong cách phác thảo và tranh vẽ rất phổ biến cho thiệp, áp phích và bản in.',
        'Làm nét và làm mờ là những chỉnh sửa hằng ngày.',
      ],
      useCases: [
        {
          title: 'Chân dung bút chì',
          description: 'Bộ lọc phác thảo cho một bức ảnh để làm thiệp.',
        },
        {
          title: 'Bản in kiểu tranh vẽ',
          description: 'Hiệu ứng sơn dầu để in lên canvas.',
        },
        {
          title: 'Logo dập nổi',
          description: 'Dập nổi một logo phẳng.',
        },
        {
          title: 'Làm nét bản quét',
          description: 'Làm rõ các cạnh của một bản quét bị mềm.',
        },
      ],
      whyMediaManipulator: [
        'Mười hai bộ lọc nghệ thuật và hiệu chỉnh trong một ô chọn.',
        'Cắt, đổi kích thước, thêm chú thích và chuyển đổi trong cùng một lần tải lên.',
      ],
      privacyNote: 'Bộ lọc bạn chọn được ImageMagick áp dụng cho ảnh của bạn trên máy chủ của chúng tôi. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Bản gốc không bao giờ bị thay đổi: bạn tải về một tệp mới.',
      faq: [
        {
          question: 'Tôi có thể điều chỉnh độ mạnh không?',
          answer: 'Các bộ lọc dùng mức độ cố định đã được tinh chỉnh. Hãy đổi kích thước ảnh lớn hơn hoặc nhỏ hơn để thay đổi độ mạnh trông thấy của hiệu ứng dựa trên bán kính.',
        },
        {
          question: 'Tôi có thể chồng nhiều bộ lọc không?',
          answer: 'Mỗi lượt một bộ lọc; hãy cho kết quả chạy lại qua công cụ để áp dụng bộ lọc thứ hai.',
        },
        {
          question: 'Có tính năng chuyển phong cách bằng AI không?',
          answer: 'Không. Đây là các hiệu ứng ImageMagick cổ điển, chạy tức thì.',
        },
        {
          question: 'Bộ lọc nào phù hợp với logo?',
          answer: 'Dập nổi hoặc than chì trên một logo có độ tương phản cao.',
        },
      ],
      related: [
        {
          label: 'Đen trắng',
          to: '/tools/grayscale-image',
          description: 'Thang xám và sepia.',
        },
        {
          label: 'Làm mờ ảnh',
          to: '/tools/blur-image',
          description: 'Làm mềm hoặc che khuất.',
        },
        {
          label: 'Làm nét ảnh',
          to: '/tools/sharpen-image',
          description: 'Làm rõ chi tiết.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa các định dạng ảnh.',
        },
        {
          label: 'Cắt ảnh',
          to: '/tools/crop-image',
          description: 'Cắt lấy một vùng.',
        },
        {
          label: 'Đổi kích thước ảnh',
          to: '/tools/image-resizer',
          description: 'Thay đổi kích thước.',
        },
        {
          label: 'Thêm chữ vào ảnh',
          to: '/tools/add-text-to-image',
          description: 'Chú thích hoặc hình mờ.',
        },
        {
          label: 'Xóa siêu dữ liệu EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Xóa dữ liệu vị trí và thiết bị.',
        },
      ],
      embed: {
        title: 'Áp dụng bộ lọc cho ảnh',
        description: 'Tải ảnh lên và chọn bộ lọc; Sơn dầu được chọn sẵn. Có sẵn các hiệu ứng phác thảo, than chì, dập nổi, cổ điển, sepia, xoáy, méo thùng, làm mờ và làm nét. Nhấn Chuyển đổi.',
      },
    },
    'rotate-image': {
      name: 'Xoay ảnh',
      h1: 'Xoay ảnh trực tuyến miễn phí',
      tagline: 'Xoay ảnh 90°, 180° hoặc 270°, sửa ảnh quét hoặc ảnh điện thoại bị nằm ngang, và tải về ở bất kỳ định dạng nào.',
      metaTitle: 'Xoay ảnh trực tuyến miễn phí (90°, 180°, 270°) | Media Manipulator',
      metaDescription: 'Công cụ xoay ảnh trực tuyến miễn phí. Xoay ảnh JPG, PNG, WebP hoặc HEIC 90, 180 hoặc 270 độ, hoặc 45 độ để tạo góc nghiêng, rồi tải về. Góc xoay được ghi thẳng vào điểm ảnh. Không cần đăng ký.',
      ogTitle: 'Xoay ảnh trực tuyến miễn phí',
      ogDescription: 'Sửa ảnh bị nằm ngang chỉ với một cú nhấp. Miễn phí, không cần đăng ký.',
      intro: 'Điện thoại ghi hướng ảnh dưới dạng một thẻ mà một số trình xem bỏ qua, còn máy quét và máy ảnh cũ thì ghi sai hẳn. Xoay chính các điểm ảnh sẽ khắc phục vĩnh viễn. Media Manipulator xoay ảnh 90, 180, 270 hoặc 45 độ trên máy chủ của chúng tôi bằng ImageMagick, áp dụng thẻ hướng hiện có trước, và xuất ra bất kỳ định dạng nào.',
      whatItDoes: [
        'Xoay 90° (theo chiều kim đồng hồ), 180°, 270° (ngược chiều kim đồng hồ) hoặc 45°.',
        'Ghi góc xoay thẳng vào điểm ảnh và xóa thẻ hướng EXIF.',
        'Kết hợp với cắt, đổi kích thước và chuyển đổi định dạng.',
        'Lưu ảnh đã xoay dưới dạng JPG, PNG, WebP, AVIF hoặc GIF.',
      ],
      flowSteps: [
        {
          title: 'Tải ảnh lên',
          description: 'Mọi định dạng phổ biến.',
        },
        {
          title: 'Chọn góc xoay',
          description: '90° được chọn sẵn.',
        },
        {
          title: 'Chuyển đổi',
          description: 'ImageMagick xoay và mã hóa.',
        },
        {
          title: 'Tải về',
          description: 'Lưu ảnh đã đứng thẳng.',
        },
      ],
      advancedDetails: [
        'Hướng EXIF hiện có được áp dụng trước, nên những gì bạn thấy chính là những gì được xoay.',
        'Xoay 45° sẽ thêm màu nền lấp đầy ở các góc; hãy cắt lại sau nếu cần.',
        'Để phản chiếu theo chiều ngang hoặc chiều dọc, hãy dùng các công cụ Lật và phản chiếu.',
      ],
      whyItMatters: [
        'Ảnh bị nằm ngang là phàn nàn phổ biến nhất khi tải lên diễn đàn và biểu mẫu.',
        'Một số ứng dụng bỏ qua thẻ hướng, nên xoay thẳng vào điểm ảnh là cách khắc phục đáng tin cậy duy nhất.',
        'Bản quét và tệp từ máy ảnh cũ thường không có thẻ hướng nào cả.',
      ],
      useCases: [
        {
          title: 'Ảnh điện thoại bị nằm ngang',
          description: 'Xoay 90° để ảnh đứng thẳng ở mọi nơi.',
        },
        {
          title: 'Bản quét bị lộn ngược',
          description: 'Xoay 180°.',
        },
        {
          title: 'Sửa ảnh tải lên biểu mẫu',
          description: 'Xoay trước khi gửi ảnh chụp giấy tờ.',
        },
        {
          title: 'Hiệu ứng nghiêng',
          description: 'Xoay 45° để làm một chi tiết thiết kế.',
        },
      ],
      whyMediaManipulator: [
        'Góc xoay được áp dụng vào điểm ảnh, với thẻ hướng được xử lý đúng cách.',
        'Cắt, đổi kích thước và chuyển đổi trong cùng một lần tải lên.',
      ],
      privacyNote: 'Ảnh của bạn được ImageMagick xoay theo góc bạn chọn trên máy chủ của chúng tôi. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Bản gốc không bao giờ bị thay đổi: bạn tải về một tệp mới.',
      faq: [
        {
          question: 'Vì sao ảnh của tôi đứng thẳng trên điện thoại nhưng lại nằm ngang ở nơi khác?',
          answer: 'Điện thoại của bạn đã ghi một thẻ hướng mà ứng dụng kia bỏ qua. Xoay ở đây sẽ ghi hướng thẳng vào điểm ảnh.',
        },
        {
          question: 'Xoay ảnh có làm giảm chất lượng không?',
          answer: 'Xoay theo bội số của 90° không làm mất gì về mặt hình học; cái giá duy nhất là lần mã hóa lại. Hãy dùng PNG hoặc chất lượng JPG cao.',
        },
        {
          question: 'Tôi có thể xoay theo góc bất kỳ không?',
          answer: 'Chỉ có 45° cùng các bội số của 90°.',
        },
        {
          question: 'Tôi có thể phản chiếu ảnh thay vì xoay không?',
          answer: 'Không phải ở đây; hiện chưa có tính năng phản chiếu cho ảnh.',
        },
      ],
      related: [
        {
          label: 'Xoay video',
          to: '/tools/rotate-video',
          description: 'Tương tự, dành cho video.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa các định dạng ảnh.',
        },
        {
          label: 'Cắt ảnh',
          to: '/tools/crop-image',
          description: 'Cắt lấy một vùng.',
        },
        {
          label: 'Đổi kích thước ảnh',
          to: '/tools/image-resizer',
          description: 'Thay đổi kích thước.',
        },
        {
          label: 'Thêm chữ vào ảnh',
          to: '/tools/add-text-to-image',
          description: 'Chú thích hoặc hình mờ.',
        },
        {
          label: 'Bộ lọc ảnh',
          to: '/tools/image-filters',
          description: 'Sepia, phác thảo, dập nổi và nhiều hiệu ứng khác.',
        },
        {
          label: 'Xóa siêu dữ liệu EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Xóa dữ liệu vị trí và thiết bị.',
        },
      ],
      embed: {
        title: 'Xoay ảnh',
        description: 'Tải ảnh lên. Ô chọn bộ lọc được đặt sẵn ở xoay 90°; bạn có thể chọn 180°, 270° hoặc 45° thay thế. Góc xoay được áp dụng vào điểm ảnh, nên mọi trình xem đều hiển thị giống nhau. Nhấn Chuyển đổi.',
      },
    },
    'sharpen-image': {
      name: 'Làm nét ảnh',
      h1: 'Làm nét ảnh trực tuyến miễn phí',
      tagline: 'Làm rõ các cạnh của ảnh hoặc bản quét hơi mềm chỉ với một cú nhấp làm nét, và tải về ở bất kỳ định dạng nào.',
      metaTitle: 'Làm nét ảnh trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ làm nét ảnh trực tuyến miễn phí. Làm rõ ảnh hoặc bản quét JPG, PNG, WebP hoặc HEIC bị mềm rồi tải về. Để khôi phục chi tiết thực sự, hãy thử phục hồi ảnh bằng AI. Không cần đăng ký.',
      ogTitle: 'Làm nét ảnh trực tuyến miễn phí',
      ogDescription: 'Làm rõ một bức ảnh bị mềm chỉ với một cú nhấp. Miễn phí, không cần đăng ký.',
      intro: 'Một bức ảnh hơi mềm do ống kính chậm, do đổi kích thước hay do máy quét sẽ đẹp hơn sau một lượt làm nét giúp tăng độ tương phản dọc theo các cạnh. Media Manipulator áp dụng làm nét unsharp mask trên máy chủ của chúng tôi bằng ImageMagick và xuất ra bất kỳ định dạng nào. Với độ mờ vượt quá mức hơi mềm, công cụ phục hồi ảnh bằng AI khôi phục được những chi tiết mà làm nét không thể.',
      whatItDoes: [
        'Áp dụng làm nét unsharp mask đã được tinh chỉnh cho mọi ảnh.',
        'Kết hợp với đổi kích thước: làm nét sau khi thu nhỏ để có ảnh thu nhỏ sắc nét.',
        'Tải kết quả đã làm nét về dưới dạng JPG, PNG, WebP, AVIF hoặc GIF.',
        'So sánh bản gốc và kết quả cạnh nhau.',
      ],
      flowSteps: [
        {
          title: 'Tải ảnh lên',
          description: 'Mọi định dạng phổ biến.',
        },
        {
          title: 'Giữ lựa chọn làm nét',
          description: 'Thêm đổi kích thước nếu bạn muốn.',
        },
        {
          title: 'Chuyển đổi',
          description: 'ImageMagick áp dụng unsharp mask.',
        },
        {
          title: 'Tải về',
          description: 'Lưu ảnh sắc nét hơn.',
        },
      ],
      advancedDetails: [
        'Làm nét tăng độ tương phản cục bộ tại các cạnh; nó không thêm chi tiết. Làm nét quá mức sẽ để lại quầng sáng.',
        'Thu nhỏ rồi làm nét là công thức kinh điển cho ảnh web sắc nét.',
        'Với ảnh bị nhòe chuyển động, lệch nét hoặc nguồn độ phân giải thấp, hãy dùng phục hồi ảnh bằng AI.',
      ],
      whyItMatters: [
        'Ảnh bị thu nhỏ mất độ tương phản ở cạnh và trông mềm nếu không được làm nét.',
        'Bản quét tài liệu và ảnh in thường hơi mềm.',
        'Ảnh sắc nét tạo cảm giác chất lượng cao hơn.',
      ],
      useCases: [
        {
          title: 'Ảnh thu nhỏ',
          description: 'Đổi kích thước và làm nét cho web.',
        },
        {
          title: 'Bản quét bị mềm',
          description: 'Làm rõ một bức ảnh in đã quét.',
        },
        {
          title: 'Ảnh sản phẩm',
          description: 'Tăng độ rõ của đường nét trước khi đăng bán.',
        },
        {
          title: 'Hơi lệch nét',
          description: 'Lấy lại một chút độ sắc nét cảm nhận được.',
        },
      ],
      whyMediaManipulator: [
        'Unsharp mask đã tinh chỉnh, kèm đổi kích thước trong cùng một lượt.',
        'Có sẵn phục hồi bằng AI khi làm nét là chưa đủ.',
      ],
      privacyNote: 'Ảnh của bạn được ImageMagick làm nét trên máy chủ của chúng tôi theo độ mạnh bạn đặt. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Bản gốc không bao giờ bị thay đổi: bạn tải về một tệp mới.',
      faq: [
        {
          question: 'Công cụ này có sửa được ảnh bị mờ không?',
          answer: 'Nó giúp ích với ảnh hơi mềm. Với ảnh mờ thật sự, hãy dùng phục hồi ảnh bằng AI, công cụ có thể tái tạo chi tiết.',
        },
        {
          question: 'Tôi có thể điều chỉnh độ mạnh không?',
          answer: 'Độ mạnh cố định và đã được tinh chỉnh; hãy chạy hai lần để nét hơn, hoặc chọn kích thước đầu ra nhỏ hơn để hiệu ứng tương đối mạnh hơn.',
        },
        {
          question: 'Làm nét có làm tăng nhiễu không?',
          answer: 'Làm nét có thể làm hạt nhiễu sẵn có lộ rõ hơn. Hãy dùng chất lượng JPG cao để nhiễu không bị cộng dồn.',
        },
      ],
      related: [
        {
          label: 'Phục hồi ảnh bằng AI',
          to: '/tools/ai-image-restoration',
          description: 'Khôi phục chi tiết thật bằng AI.',
        },
        {
          label: 'Nâng độ phân giải ảnh bằng AI',
          to: '/tools/ai-image-upscaler',
          description: 'Phóng to mà không bị mờ.',
        },
        {
          label: 'Làm mờ ảnh',
          to: '/tools/blur-image',
          description: 'Tác dụng ngược lại.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa các định dạng ảnh.',
        },
        {
          label: 'Cắt ảnh',
          to: '/tools/crop-image',
          description: 'Cắt lấy một vùng.',
        },
        {
          label: 'Đổi kích thước ảnh',
          to: '/tools/image-resizer',
          description: 'Thay đổi kích thước.',
        },
        {
          label: 'Thêm chữ vào ảnh',
          to: '/tools/add-text-to-image',
          description: 'Chú thích hoặc hình mờ.',
        },
        {
          label: 'Bộ lọc ảnh',
          to: '/tools/image-filters',
          description: 'Sepia, phác thảo, dập nổi và nhiều hiệu ứng khác.',
        },
        {
          label: 'Xóa siêu dữ liệu EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Xóa dữ liệu vị trí và thiết bị.',
        },
      ],
      embed: {
        title: 'Làm nét ảnh',
        description: 'Tải ảnh lên. Bộ lọc được đặt sẵn ở làm nét. Nhấn Chuyển đổi, rồi so sánh kết quả với bản gốc trong trình xem.',
      },
    },
    'blur-image': {
      name: 'Làm mờ ảnh',
      h1: 'Làm mờ ảnh trực tuyến miễn phí',
      tagline: 'Làm mềm toàn bộ ảnh để dùng làm nền, ảnh giữ chỗ hoặc lớp che riêng tư, và tải về ở bất kỳ định dạng nào.',
      metaTitle: 'Làm mờ ảnh trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ làm mờ ảnh trực tuyến miễn phí. Làm mềm toàn bộ ảnh JPG, PNG, WebP hoặc HEIC để làm nền, ảnh giữ chỗ hoặc lớp che riêng tư. Để chỉ làm mờ khuôn mặt, hãy dùng công cụ làm mờ khuôn mặt. Không cần đăng ký.',
      ogTitle: 'Làm mờ ảnh trực tuyến miễn phí',
      ogDescription: 'Làm mềm một bức ảnh chỉ với một cú nhấp. Miễn phí, không cần đăng ký.',
      intro: 'Một bức ảnh được làm mờ có thể thành nền dịu mắt phía sau chữ, ảnh giữ chỗ ít chi tiết trong lúc ảnh thật đang tải, hoặc lớp che riêng tư cho ảnh chụp màn hình. Media Manipulator áp dụng làm mờ Gaussian cho toàn bộ ảnh trên máy chủ của chúng tôi bằng ImageMagick và xuất ra bất kỳ định dạng nào. Để chỉ làm mờ khuôn mặt hoặc biển số xe, các công cụ làm mờ khuôn mặt và che văn bản bằng AI sẽ nhắm vào đúng những vùng đó.',
      whatItDoes: [
        'Áp dụng làm mờ Gaussian cho toàn bộ ảnh.',
        'Kết hợp với đổi kích thước để tạo ảnh giữ chỗ nhỏ đã làm mờ.',
        'Ảnh đã làm mềm được trả về dưới dạng JPG, PNG, WebP, AVIF hoặc GIF.',
        'Các công cụ liên quan làm mờ khuôn mặt hoặc che văn bản có chọn lọc.',
      ],
      flowSteps: [
        {
          title: 'Tải ảnh lên',
          description: 'Mọi định dạng phổ biến.',
        },
        {
          title: 'Giữ lựa chọn làm mờ',
          description: 'Có thể đổi kích thước nếu muốn.',
        },
        {
          title: 'Chuyển đổi',
          description: 'ImageMagick làm mờ và mã hóa.',
        },
        {
          title: 'Tải về',
          description: 'Lưu ảnh đã làm mềm.',
        },
      ],
      advancedDetails: [
        'Bán kính làm mờ là cố định; để hiệu ứng mạnh hơn, hãy thu nhỏ ảnh trước, làm mờ, rồi phóng to lại.',
        'Ảnh đã làm mờ nén được rất nhỏ, đó là lý do chúng thích hợp làm ảnh giữ chỗ.',
        'Ảnh chụp màn hình bị làm mờ không phải là che thông tin: đôi khi văn bản vẫn có thể được khôi phục. Hãy dùng công cụ che văn bản cho nội dung nhạy cảm.',
      ],
      whyItMatters: [
        'Nền được làm mờ giúp chữ đặt lên trên vẫn dễ đọc.',
        'Ảnh giữ chỗ chất lượng thấp giúp trang tạo cảm giác tải nhanh hơn.',
        'Phiên bản mềm của một bức ảnh là chi tiết thiết kế phổ biến.',
      ],
      useCases: [
        {
          title: 'Nền cho chữ',
          description: 'Làm mờ một bức ảnh để đặt tiêu đề lên trên.',
        },
        {
          title: 'Ảnh giữ chỗ',
          description: 'Bản xem trước nhỏ đã làm mờ cho tải lười (lazy loading).',
        },
        {
          title: 'Lớp che riêng tư',
          description: 'Làm mềm ảnh chụp màn hình trước khi chia sẻ, rồi che thông tin đúng cách.',
        },
        {
          title: 'Hiệu ứng mơ màng',
          description: 'Lớp phủ mềm cho một thiết kế.',
        },
      ],
      whyMediaManipulator: [
        'Làm mờ toàn bộ ảnh ở đây; làm mờ khuôn mặt và che văn bản là các công cụ AI riêng.',
        'Đổi kích thước và chuyển đổi trong cùng một lần tải lên.',
      ],
      privacyNote: 'Ảnh của bạn được ImageMagick làm mờ trên máy chủ của chúng tôi theo bán kính bạn đặt. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Bản gốc không bao giờ bị thay đổi: bạn tải về một tệp mới.',
      faq: [
        {
          question: 'Tôi có thể chỉ làm mờ một phần ảnh không?',
          answer: 'Hãy dùng Làm mờ khuôn mặt trong ảnh cho khuôn mặt, hoặc Che văn bản trong ảnh cho văn bản và biển số xe.',
        },
        {
          question: 'Làm mờ có đủ để ẩn văn bản không?',
          answer: 'Không đáng tin cậy. Hãy dùng công cụ che văn bản, công cụ này tô phủ kín vùng đó.',
        },
        {
          question: 'Tôi có thể điều chỉnh mức làm mờ không?',
          answer: 'Bán kính là cố định; hãy thu nhỏ ảnh trước khi làm mờ để hiệu ứng mạnh hơn.',
        },
      ],
      related: [
        {
          label: 'Làm mờ khuôn mặt trong ảnh',
          to: '/tools/blur-faces-in-photo',
          description: 'Làm mờ khuôn mặt bằng AI.',
        },
        {
          label: 'Che văn bản trong ảnh',
          to: '/tools/redact-text-in-image',
          description: 'Ẩn văn bản và biển số.',
        },
        {
          label: 'Làm nét ảnh',
          to: '/tools/sharpen-image',
          description: 'Tác dụng ngược lại.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa các định dạng ảnh.',
        },
        {
          label: 'Cắt ảnh',
          to: '/tools/crop-image',
          description: 'Cắt lấy một vùng.',
        },
        {
          label: 'Đổi kích thước ảnh',
          to: '/tools/image-resizer',
          description: 'Thay đổi kích thước.',
        },
        {
          label: 'Thêm chữ vào ảnh',
          to: '/tools/add-text-to-image',
          description: 'Chú thích hoặc hình mờ.',
        },
        {
          label: 'Bộ lọc ảnh',
          to: '/tools/image-filters',
          description: 'Sepia, phác thảo, dập nổi và nhiều hiệu ứng khác.',
        },
        {
          label: 'Xóa siêu dữ liệu EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Xóa dữ liệu vị trí và thiết bị.',
        },
      ],
      embed: {
        title: 'Làm mờ ảnh',
        description: 'Tải ảnh lên. Bộ lọc được đặt sẵn ở làm mờ, giúp làm mềm toàn bộ bức ảnh. Để chỉ làm mờ khuôn mặt, hãy dùng công cụ Làm mờ khuôn mặt trong ảnh. Nhấn Chuyển đổi.',
      },
    },
    'generate-vtt-captions': {
      name: 'Trình tạo phụ đề VTT',
      h1: 'Tạo phụ đề WebVTT từ video hoặc âm thanh',
      tagline: 'Tạo tệp phụ đề .vtt cho video HTML5, YouTube hoặc trình phát bằng phiên âm AI trên máy chủ GPU của chúng tôi.',
      metaTitle: 'Trình tạo phụ đề VTT trực tuyến (AI miễn phí) | Media Manipulator',
      metaDescription: 'Trình tạo phụ đề WebVTT trực tuyến miễn phí. Tải lên video hoặc tệp âm thanh và tải về tệp .vtt có phụ đề theo thời gian cho video HTML5, YouTube, Vimeo hoặc mọi trình phát. Chạy trên GPU của chính chúng tôi.',
      ogTitle: 'Tạo phụ đề WebVTT trực tuyến',
      ogDescription: 'Phụ đề .vtt được AI canh thời gian cho mọi video. Miễn phí, không cần đăng ký.',
      intro: 'WebVTT là định dạng phụ đề của web: phần tử track của HTML5, YouTube, Vimeo, các trình phát HLS và DASH đều đọc được. Media Manipulator tạo phụ đề VTT có thời gian từ mọi video hoặc âm thanh bằng mô hình Whisper trên máy chủ GPU do chúng tôi vận hành, nên tệp của bạn không bao giờ đến tay AI của bên thứ ba, rồi mở kết quả trong trình xem phụ đề để bạn kiểm tra thời gian trước khi tải về.',
      whatItDoes: [
        'Chép lời phần nói và chia thành các đoạn phụ đề có thời gian.',
        'Xuất tệp .vtt đúng chuẩn.',
        'Tự động nhận diện ngôn ngữ.',
        'Chạy trên GPU của chính chúng tôi; không dùng nhà cung cấp AI bên thứ ba.',
      ],
      flowSteps: [
        {
          title: 'Tải video hoặc âm thanh lên',
          description: 'Mọi định dạng phổ biến.',
        },
        {
          title: 'Giữ lựa chọn VTT',
          description: 'Hoặc chuyển sang SRT, văn bản hoặc JSON.',
        },
        {
          title: 'Chép lời',
          description: 'Whisper canh thời gian cho từng đoạn phụ đề.',
        },
        {
          title: 'Tải về',
          description: 'Gắn tệp .vtt vào trình phát của bạn.',
        },
      ],
      advancedDetails: [
        'Các đoạn phụ đề theo cách phân đoạn của Whisper, thường là một câu hoặc một mệnh đề cho mỗi đoạn dài 2 đến 7 giây.',
        'Dịch kết quả sang ngôn ngữ khác bằng Trình dịch phụ đề.',
        'Để có phụ đề in cứng vào hình, hãy dùng làn phụ đề của Darkroom.',
      ],
      whyItMatters: [
        'Phụ đề là yêu cầu bắt buộc về khả năng tiếp cận, và phần lớn người xem theo dõi phụ đề khi tắt tiếng.',
        'VTT là định dạng duy nhất mà video HTML5 đọc được trực tiếp.',
        'Phụ đề có thời gian có thể được công cụ tìm kiếm lập chỉ mục.',
      ],
      useCases: [
        {
          title: 'Video HTML5',
          description: 'Gắn tệp bằng phần tử track.',
        },
        {
          title: 'Tải lên YouTube',
          description: 'Tải tệp .vtt lên làm track phụ đề.',
        },
        {
          title: 'Video khóa học',
          description: 'Phụ đề cho trình phát của LMS.',
        },
        {
          title: 'Dịch sau',
          description: 'Đưa VTT vào, nhận VTT đã dịch.',
        },
      ],
      whyMediaManipulator: [
        'Whisper chạy trên phần cứng của chính chúng tôi; không có gì được gửi đến AI của bên thứ ba.',
        'Trình xem phụ đề để kiểm tra thời gian trước khi tải về.',
      ],
      privacyNote: 'Lời nói trong tệp của bạn được Whisper chép lời trên máy chủ GPU của chính chúng tôi và canh thời gian thành phụ đề WebVTT. Xử lý AI chạy trên phần cứng do chúng tôi vận hành, không bao giờ qua nhà cung cấp AI bên thứ ba, và không có gì bạn tải lên được dùng để huấn luyện mô hình. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'VTT hay SRT?',
          answer: 'VTT cho trình phát web và YouTube; SRT cho phần mềm chỉnh sửa video và một số nền tảng cũ hơn. Cả hai đều có sẵn.',
        },
        {
          question: 'Tôi có thể chỉnh sửa phụ đề không?',
          answer: 'Tải tệp .vtt về và chỉnh sửa bằng bất kỳ trình soạn thảo văn bản nào; định dạng này là văn bản thuần.',
        },
        {
          question: 'Tôi có thể dịch phụ đề không?',
          answer: 'Có, bằng công cụ Trình dịch phụ đề.',
        },
        {
          question: 'Video của tôi có bị gửi cho bên thứ ba không?',
          answer: 'Không. Việc chép lời chạy trên máy chủ GPU của chính chúng tôi.',
        },
        {
          question: 'Việc này có bị tính vào hạn mức của tôi không?',
          answer: 'Mỗi tệp VTT là một tác vụ AI, được trừ vào hạn mức tác vụ AI và không bao giờ vào hạn mức tác vụ thường. Tác vụ thất bại không bị tính.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Mỗi tệp phụ đề được tính là một tác vụ AI; tác vụ thất bại không bị tính.',
        ],
      },
      related: [
        {
          label: 'Trình tạo phụ đề SRT',
          to: '/tools/srt-generator',
          description: 'Định dạng SubRip.',
        },
        {
          label: 'Chuyển video thành văn bản',
          to: '/tools/transcribe-video',
          description: 'Văn bản thuần hoặc JSON.',
        },
        {
          label: 'Trình dịch phụ đề',
          to: '/tools/caption-translator',
          description: 'Dịch phụ đề.',
        },
        {
          label: 'Trình chỉnh sửa video Darkroom',
          to: '/tools/content-studio',
          description: 'In cứng phụ đề vào video.',
        },
      ],
      embed: {
        title: 'Tạo phụ đề VTT',
        description: 'Tải lên video hoặc tệp âm thanh. Đầu ra được đặt sẵn ở WebVTT; bản chép lời được Whisper canh thời gian trên máy chủ GPU của chúng tôi và trả về dưới dạng tệp .vtt mà bạn có thể gắn bằng phần tử track hoặc tải lên một nền tảng.',
      },
    },
    // MM75: summarize-video / summarize-audio full page bodies (model-written, needs native review).
    'summarize-video': {
      name: 'Tóm tắt video',
      h1: 'Tóm tắt video bằng AI: chương, chủ đề và văn bản trên màn hình',
      tagline: 'Nhận bản tóm tắt bằng văn bản cho bài giảng, cuộc họp hoặc video hướng dẫn, kèm các chương có thể bấm, chủ đề và văn bản trên màn hình, được tạo trên máy chủ GPU của chúng tôi.',
      metaTitle: 'Công cụ tóm tắt video bằng AI có chia chương | Media Manipulator',
      metaDescription: 'Tải video lên và nhận bản tóm tắt bằng văn bản với các chương có mốc thời gian, chủ đề và văn bản hiển thị trên màn hình. AI chạy trên máy chủ GPU của chúng tôi, không dùng AI của bên thứ ba. Cần tài khoản miễn phí.',
      ogTitle: 'Tóm tắt video bằng AI',
      ogDescription: 'Bản tóm tắt bằng văn bản với các chương có thể bấm, chủ đề và văn bản trên màn hình. Cần tài khoản miễn phí.',
      embed: {
        title: 'Tóm tắt video',
        description: 'Đăng nhập, tải lên một video (hoặc tệp âm thanh) và chọn ngôn ngữ của bản tóm tắt. Bạn sẽ nhận được tiêu đề, bản tóm tắt ngắn, các chương nhảy đến đúng thời điểm trong video, các chủ đề và văn bản xuất hiện trên màn hình.',
      },
      intro: 'Không ai muốn xem lại cả giờ họp hay bài giảng chỉ để tìm năm phút quan trọng. Media Manipulator xem và nghe thay bạn: chép lời phần nói bằng Whisper, dùng mô hình thị giác để xem các khung hình được chọn tại những chỗ hình ảnh thay đổi, rồi viết bản tóm tắt từ cả hai, tất cả trên máy chủ GPU do chúng tôi vận hành. Kết quả là một tài liệu ngắn: tiêu đề, vài câu tóm tắt, các chương có thời gian bắt đầu và kết thúc, các chủ đề và văn bản xuất hiện trên màn hình. Bấm vào một chương để nhảy đến đúng thời điểm trong video, sao chép toàn bộ dưới dạng Markdown hoặc tải xuống dưới dạng Markdown hay JSON. Tính năng tóm tắt cần một tài khoản miễn phí.',
      whatItDoes: [
        'Viết tiêu đề và bản tóm tắt từ ba đến sáu câu cho toàn bộ video.',
        'Chia video thành các chương có thời gian bắt đầu và kết thúc; bấm vào một chương sẽ nhảy trình phát đến đúng thời điểm đó.',
        'Liệt kê các chủ đề và văn bản xuất hiện trên màn hình, kèm thời điểm xuất hiện đầu tiên.',
        'Mô tả hình ảnh và lời nói, đồng thời ghi chú những gì không thực hiện được (ví dụ: không có lời nói).',
        'Viết bản tóm tắt bằng ngôn ngữ bạn chọn hoặc bằng ngôn ngữ được nói trong video.',
      ],
      flowSteps: [
        {
          title: 'Đăng nhập',
          description: 'Chỉ cần tài khoản miễn phí.',
        },
        {
          title: 'Tải lên',
          description: 'Một video hoặc tệp âm thanh.',
        },
        {
          title: 'Tóm tắt',
          description: 'Lời nói và khung hình được phân tích trên máy chủ GPU của chúng tôi.',
        },
        {
          title: 'Đọc',
          description: 'Bấm vào chương, sao chép Markdown, tải xuống .md hoặc .json.',
        },
      ],
      advancedDetails: [
        'Lời nói được chép lời bằng Whisper; các khung hình được chọn tại những chỗ chuyển cảnh, tối đa theo hạn mức khung hình của gói (24 với Free, 48 với Premium, 96 với Pro) và được mô hình thị giác mô tả theo từng lô.',
        'Một mô hình ngôn ngữ viết bản tóm tắt từ bản chép lời và ghi chú khung hình. Tài khoản Pro có thể yêu cầu bản tóm tắt chuyên sâu hơn từ một mô hình lớn hơn khi có sẵn.',
        'Một bản tóm tắt được tính là một tác vụ AI trong hạn mức hằng ngày; tác vụ thất bại hoặc bị từ chối không bị tính.',
        'Bản chép lời do máy tạo ra nên tên và con số có thể sai. Bản tóm tắt cũng ghi rõ điều này trong phần ghi chú.',
      ],
      whyItMatters: [
        'Bản tóm tắt có chương chỉ mất một phút để lướt qua, còn video thì không.',
        'Mốc thời gian có thể bấm đưa bạn thẳng đến phần cần xem.',
        'Văn bản trên màn hình ghi lại tiêu đề slide và chú thích mà lời nói không hề đọc to.',
      ],
      useCases: [
        {
          title: 'Tóm tắt cuộc họp',
          description: 'Các quyết định và chủ đề, kèm thời điểm để kiểm tra chi tiết.',
        },
        {
          title: 'Ghi chú bài giảng',
          description: 'Các chương theo từng phần và văn bản trên slide để bạn ôn tập.',
        },
        {
          title: 'Dàn ý video hướng dẫn',
          description: 'Các bước được chia thành chương để bạn nhảy đến bước cần xem.',
        },
        {
          title: 'Tổng quan buổi phỏng vấn',
          description: 'Những gì đã được thảo luận và ở đâu.',
        },
      ],
      whyMediaManipulator: [
        'Whisper cùng các mô hình thị giác và ngôn ngữ chạy trên phần cứng do chúng tôi vận hành; video của bạn không bao giờ được gửi đến AI của bên thứ ba.',
        'Các chương tua thẳng trong video của chính bạn, ngay trong trình xem kết quả.',
      ],
      privacyNote: 'Tính năng tóm tắt cần một tài khoản miễn phí nên tác vụ được gắn với tài khoản đó. Tệp của bạn được xử lý trên máy chủ của chúng tôi và các mô hình AI chạy trên máy chủ GPU do chúng tôi vận hành; không có gì được gửi đến nhà cung cấp AI bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Tôi có cần tài khoản không?',
          answer: 'Có, một tài khoản miễn phí. Tính năng tóm tắt chạy nhiều mô hình AI trên máy chủ GPU của chúng tôi nên chỉ dành cho người dùng đã đăng nhập.',
        },
        {
          question: 'Tôi nhận được gì?',
          answer: 'Một tiêu đề, bản tóm tắt ngắn, các chương có thời gian bắt đầu và kết thúc, chủ đề, văn bản trên màn hình kèm thời điểm, mô tả hình ảnh và lời nói, cùng ghi chú về bất cứ điều gì không thực hiện được.',
        },
        {
          question: 'Tôi có thể chọn ngôn ngữ của bản tóm tắt không?',
          answer: 'Có. Chọn một trong 18 ngôn ngữ của trang web, hoặc chọn "Giống ngôn ngữ trong lời nói" để viết bằng ngôn ngữ được nói.',
        },
        {
          question: 'Nếu video không có lời nói thì sao?',
          answer: 'Bản tóm tắt được viết chỉ từ hình ảnh và ghi rõ điều đó trong phần ghi chú. Tệp không có cả hình ảnh lẫn âm thanh sẽ bị từ chối và không bị tính.',
        },
        {
          question: 'Video của tôi có bị gửi cho bên thứ ba không?',
          answer: 'Không. Mọi mô hình đều chạy trên máy chủ GPU do chúng tôi vận hành.',
        },
        {
          question: 'Việc này có bị tính vào hạn mức của tôi không?',
          answer: 'Có, tính là một tác vụ AI. Tác vụ thất bại không bị tính.',
        },
      ],
      related: [
        {
          label: 'Tóm tắt âm thanh',
          to: '/tools/summarize-audio',
          description: 'Dành cho podcast và bản ghi âm.',
        },
        {
          label: 'Chép lời video',
          to: '/tools/transcribe-video',
          description: 'Bản chép lời đầy đủ.',
        },
        {
          label: 'Chép lời âm thanh',
          to: '/tools/transcribe-audio',
          description: 'Dành cho tệp âm thanh.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Làm sạch âm thanh trước.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Tính là một tác vụ AI; tác vụ thất bại không bị tính.',
          'Độ dài tối đa theo giới hạn thời lượng video của gói.',
        ],
      },
    },
    'summarize-audio': {
      name: 'Tóm tắt âm thanh',
      h1: 'Tóm tắt bản ghi âm bằng AI',
      tagline: 'Biến podcast, buổi phỏng vấn hoặc ghi chú giọng nói thành bản tóm tắt bằng văn bản có chương và chủ đề, được tạo trên máy chủ GPU của chúng tôi.',
      metaTitle: 'Công cụ tóm tắt âm thanh bằng AI có chia chương | Media Manipulator',
      metaDescription: 'Tải lên tệp MP3, WAV hoặc M4A và nhận bản tóm tắt bằng văn bản với các chương có mốc thời gian và chủ đề. Whisper và mô hình ngôn ngữ chạy trên máy chủ GPU của chúng tôi. Cần tài khoản miễn phí.',
      ogTitle: 'Tóm tắt bản ghi âm bằng AI',
      ogDescription: 'Bản tóm tắt bằng văn bản có chương và chủ đề cho mọi bản ghi âm. Cần tài khoản miễn phí.',
      embed: {
        title: 'Tóm tắt tệp âm thanh',
        description: 'Đăng nhập, tải lên bản ghi âm và chọn ngôn ngữ của bản tóm tắt. Bạn sẽ nhận được tiêu đề, bản tóm tắt ngắn, các chương nhảy đến đúng thời điểm trong bản ghi âm và các chủ đề.',
      },
      intro: 'Một tập podcast, một buổi phỏng vấn hay một ghi chú giọng nói dài sẽ dễ dùng hơn khi ở dạng một trang văn bản thay vì cả giờ âm thanh. Media Manipulator chép lời bản ghi âm bằng Whisper và nhờ một mô hình ngôn ngữ viết bản tóm tắt từ bản chép lời, cả hai đều chạy trên máy chủ GPU do chúng tôi vận hành. Bạn nhận được tiêu đề, vài câu tóm tắt, các chương có thời gian bắt đầu và kết thúc, cùng các chủ đề. Bấm vào một chương để nhảy đến đúng điểm đó trong bản ghi âm, sao chép bản tóm tắt dưới dạng Markdown hoặc tải xuống dưới dạng Markdown hay JSON. Tính năng tóm tắt cần một tài khoản miễn phí.',
      whatItDoes: [
        'Viết tiêu đề và bản tóm tắt ngắn cho bản ghi âm.',
        'Chia thành các chương có thời gian; bấm vào một chương sẽ nhảy trình phát đến đó.',
        'Liệt kê các chủ đề và mô tả ai đang nói, với giọng điệu thế nào.',
        'Viết bản tóm tắt bằng ngôn ngữ bạn chọn hoặc bằng ngôn ngữ được nói.',
      ],
      flowSteps: [
        {
          title: 'Đăng nhập',
          description: 'Chỉ cần tài khoản miễn phí.',
        },
        {
          title: 'Tải lên',
          description: 'MP3, WAV, M4A và các định dạng âm thanh khác.',
        },
        {
          title: 'Tóm tắt',
          description: 'Whisper và một mô hình ngôn ngữ trên máy chủ GPU của chúng tôi.',
        },
        {
          title: 'Đọc',
          description: 'Bấm vào chương, sao chép Markdown, tải xuống .md hoặc .json.',
        },
      ],
      advancedDetails: [
        'Lời nói được chép lời bằng Whisper; một mô hình ngôn ngữ viết bản tóm tắt từ bản chép lời.',
        'Tệp âm thanh có ảnh bìa được xử lý như âm thanh: hình ảnh bị bỏ qua.',
        'Một bản tóm tắt được tính là một tác vụ AI trong hạn mức hằng ngày; tác vụ thất bại hoặc bị từ chối không bị tính.',
        'Bản chép lời do máy tạo ra nên tên và con số có thể sai. Bản tóm tắt cũng ghi rõ điều này trong phần ghi chú.',
      ],
      whyItMatters: [
        'Bạn có thể đọc bản tóm tắt trong một phút và quyết định nên nghe phần nào.',
        'Các chương có thời gian biến một bản ghi âm dài thành thứ bạn có thể dễ dàng điều hướng.',
        'Các chủ đề giúp kho các tập cũ có thể tìm kiếm được.',
      ],
      useCases: [
        {
          title: 'Ghi chú cho podcast',
          description: 'Chương và chủ đề cho trang của tập.',
        },
        {
          title: 'Tóm tắt buổi phỏng vấn',
          description: 'Những nội dung đã đề cập, kèm thời điểm để trích dẫn.',
        },
        {
          title: 'Từ ghi chú giọng nói thành ghi chú văn bản',
          description: 'Một ghi chú lan man được rút gọn thành một trang ngắn.',
        },
        {
          title: 'Tóm tắt cuộc gọi',
          description: 'Các ý chính của một cuộc gọi đã ghi âm.',
        },
      ],
      whyMediaManipulator: [
        'Whisper và mô hình ngôn ngữ chạy trên phần cứng do chúng tôi vận hành; bản ghi âm của bạn không bao giờ được gửi đến AI của bên thứ ba.',
        'Các chương tua thẳng trong bản ghi âm của chính bạn, ngay trong trình xem kết quả.',
      ],
      privacyNote: 'Tính năng tóm tắt cần một tài khoản miễn phí nên tác vụ được gắn với tài khoản đó. Tệp của bạn được xử lý trên máy chủ của chúng tôi và các mô hình AI chạy trên máy chủ GPU do chúng tôi vận hành; không có gì được gửi đến nhà cung cấp AI bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Tôi có cần tài khoản không?',
          answer: 'Có, một tài khoản miễn phí. Tính năng tóm tắt chạy các mô hình AI trên máy chủ GPU của chúng tôi nên chỉ dành cho người dùng đã đăng nhập.',
        },
        {
          question: 'Điều này khác gì với chép lời?',
          answer: 'Chép lời cho bạn từng từ một. Bản tóm tắt cho bạn tiêu đề, vài câu, các chương và chủ đề, được viết từ bản chép lời đó.',
        },
        {
          question: 'Tôi có thể chọn ngôn ngữ của bản tóm tắt không?',
          answer: 'Có. Chọn một trong 18 ngôn ngữ của trang web, hoặc chọn "Giống ngôn ngữ trong lời nói".',
        },
        {
          question: 'Bản ghi âm của tôi có bị gửi cho bên thứ ba không?',
          answer: 'Không. Các mô hình chạy trên máy chủ GPU do chúng tôi vận hành.',
        },
        {
          question: 'Việc này có bị tính vào hạn mức của tôi không?',
          answer: 'Có, tính là một tác vụ AI. Tác vụ thất bại không bị tính.',
        },
      ],
      related: [
        {
          label: 'Chép lời âm thanh',
          to: '/tools/transcribe-audio',
          description: 'Từng từ một, dưới dạng văn bản hoặc phụ đề.',
        },
        {
          label: 'Tóm tắt video',
          to: '/tools/summarize-video',
          description: 'Thêm hình ảnh và văn bản trên màn hình.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Làm sạch âm thanh trước.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Tính là một tác vụ AI; tác vụ thất bại không bị tính.',
        ],
      },
    },
    // MM78 voices: name + tagline (model-written, needs native review).
    'voice-cloning': {
      name: 'Sao chép giọng nói',
      h1: 'Sao chép giọng nói của bạn từ một bản ghi âm ngắn',
      tagline: 'Ghi âm hoặc tải lên 5 đến 60 giây lời nói của chính bạn, tạo một giọng nói và để nó đọc bất kỳ văn bản nào bằng hơn hai mươi ngôn ngữ.',
      metaTitle: 'Sao chép giọng nói của chính bạn từ bản ghi âm | Media Manipulator',
      metaDescription: 'Tạo giọng nói từ 5 đến 60 giây lời nói của chính bạn và dùng nó để chuyển văn bản thành giọng nói bằng hơn 20 ngôn ngữ. Chạy trên máy chủ của chính chúng tôi; tệp tạo ra được gắn hình mờ âm thanh.',
      ogTitle: 'Sao chép giọng nói của chính bạn từ một bản ghi âm ngắn',
      ogDescription: 'Đọc vài câu, xác nhận đó là giọng của bạn và dùng nó để tạo lời nói bằng hơn 20 ngôn ngữ. Mô hình tự vận hành, tệp đầu ra có hình mờ âm thanh.',
      intro: 'Sao chép giọng nói tạo ra một giọng nói dùng lại được từ một bản ghi âm ngắn lời nói của chính bạn. Đọc vài câu tự nhiên vào micrô, hoặc tải lên một đoạn dài 5 đến 60 giây, xác nhận rằng giọng nói đó là của bạn (hoặc bạn có sự cho phép rõ ràng của người nói), rồi tạo giọng nói. Giọng nói sẽ xuất hiện trong Giọng nói của tôi kèm một bản nghe thử ngắn. Từ đó, bạn có thể nhập bất kỳ văn bản nào, chọn một trong hơn hai mươi ngôn ngữ và một mức cảm xúc, rồi nhận tệp MP3 và WAV của giọng nói đó đọc văn bản. Mô hình chạy trên máy chủ GPU do chúng tôi vận hành, mọi tệp được tạo ra đều mang một hình mờ âm thanh không nghe thấy được, và không có gì bạn ghi âm được dùng để huấn luyện bất cứ thứ gì.',
      whatItDoes: [
        'Tạo một giọng nói đã lưu từ 5 đến 60 giây lời nói được ghi âm trong trình duyệt hoặc tải lên dưới dạng tệp âm thanh.',
        'Kiểm tra rằng bản ghi âm đủ dài và thực sự có lời nói trước khi tính bất cứ thứ gì.',
        'Đọc bất kỳ văn bản nào bằng giọng nói đã lưu với hơn 20 ngôn ngữ, kèm nút điều chỉnh cảm xúc từ điềm tĩnh đến biểu cảm.',
        'Trả về lời nói dưới dạng MP3, kèm bản tải WAV được tạo ngay trong trình duyệt của bạn.',
        'Gắn hình mờ âm thanh không nghe thấy được vào mọi tệp được tạo để có thể nhận diện giọng nói tổng hợp.',
      ],
      flowSteps: [
        {
          title: 'Ghi âm hoặc tải lên',
          description: '5 đến 60 giây lời nói rõ ràng trong phòng yên tĩnh.',
        },
        {
          title: 'Xác nhận đồng ý',
          description: 'Đánh dấu rằng giọng nói là của bạn, hoặc bạn có sự cho phép của người nói.',
        },
        {
          title: 'Tạo giọng nói',
          description: 'Một bản nghe thử ngắn được kết xuất và giọng nói được lưu vào tài khoản của bạn.',
        },
        {
          title: 'Tạo lời nói',
          description: 'Nhập văn bản, chọn ngôn ngữ và cảm xúc, rồi tải âm thanh về.',
        },
      ],
      advancedDetails: [
        'Công cụ tạo giọng là Chatterbox Multilingual (giấy phép MIT), chạy trên máy chủ GPU của chính chúng tôi. Nó sao chép từ đoạn tham chiếu ngay lúc bạn tạo lời nói; không có mô hình nào được huấn luyện bằng giọng của bạn.',
        'Tạo một giọng nói được tính là một tác vụ AI (bản nghe thử). Mỗi lần tạo lời nói được tính là một tác vụ AI. Yêu cầu thất bại hoặc bị từ chối không bị tính.',
        'Độ dài văn bản cho mỗi yêu cầu tùy theo gói của bạn, khoảng 18 ký tự cho mỗi giây lời nói; bộ đếm dưới ô văn bản hiển thị giới hạn của bạn.',
        'Mọi tệp được tạo đều mang hình mờ PerTh của Resemble AI, không nghe thấy được và vẫn tồn tại qua các thao tác chỉnh sửa và nén thông thường.',
        'Yêu cầu đầu tiên sau một khoảng thời gian không hoạt động có thể mất tới 20 giây trong lúc công cụ khởi động.',
      ],
      whyItMatters: [
        'Lời dẫn bằng chính giọng của bạn, không cần đặt lịch phòng thu cho mỗi lần sửa kịch bản.',
        'Cùng một giọng nói bằng ngôn ngữ khác, cho video hoặc khóa học tiếp cận được nhiều người hơn.',
        'Công cụ tự vận hành nghĩa là bản ghi âm của bạn ở lại với chúng tôi, không đến tay nhà cung cấp AI bên thứ ba.',
      ],
      useCases: [
        {
          title: 'Lời dẫn video',
          description: 'Đọc lại một câu đã sửa trong kịch bản mà không cần ghi âm lại.',
        },
        {
          title: 'Khóa học và hướng dẫn',
          description: 'Lồng tiếng cùng một bài học bằng nhiều ngôn ngữ.',
        },
        {
          title: 'Hỗ trợ tiếp cận',
          description: 'Nghe đọc to văn bản dài bằng một giọng nói quen thuộc.',
        },
        {
          title: 'Làm bản thử',
          description: 'Nghe kịch bản được đọc trước khi ghi âm bản chính thức.',
        },
      ],
      whyMediaManipulator: [
        'Mô hình mở chạy trên phần cứng do chúng tôi vận hành; bản ghi âm không bao giờ được gửi đến dịch vụ AI bên ngoài.',
        'Sự đồng ý rõ ràng trước khi tạo bất kỳ giọng nói nào, được lưu cùng giọng nói đó.',
        'Tệp đầu ra có hình mờ âm thanh và nút xóa của riêng bạn cho mọi giọng nói đã lưu.',
      ],
      privacyNote: '5 đến 60 giây lời nói bạn ghi âm hoặc tải lên sẽ trở thành một giọng nói đã lưu trong tài khoản của bạn; bản ghi tham chiếu đó là thứ mô hình đọc mỗi lần giọng nói cất lời. Bản ghi âm giọng nói và giọng nói đã lưu được xử lý trên máy chủ của chính chúng tôi; không có gì được gửi đến nhà cung cấp AI bên thứ ba và không có gì được dùng để huấn luyện bất kỳ mô hình nào. Giọng nói đã lưu (bản ghi tham chiếu và bản nghe thử của nó) được lưu trong tài khoản của bạn, tuân theo thời gian lưu bạn chọn và có thể được xóa trong Tài khoản, Giọng nói bất cứ lúc nào; nó cũng bị xóa cùng tài khoản của bạn. Âm thanh được tạo ra được lưu như mọi kết quả khác: Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Tôi có thể sao chép giọng của người khác không?',
          answer: 'Chỉ khi có sự cho phép rõ ràng của người đó. Bạn phải xác nhận rằng giọng nói là của bạn hoặc bạn có sự cho phép trước khi giọng nói được tạo, và chúng tôi lưu xác nhận đó cùng giọng nói. Mạo danh người khác khi chưa được phép, lừa đảo và deepfake chính trị đều bị cấm theo Điều khoản của chúng tôi.',
        },
        {
          question: 'Giọng tạo ra có giống hệt giọng tôi không?',
          answer: 'Thường thì nghe vẫn nhận ra được là giọng của người nói, nhưng đó không phải bản sao hoàn hảo: giọng địa phương, chất giọng đặc biệt và bản ghi âm nhiều tạp âm sẽ khó hơn. Hãy đọc vài câu tự nhiên trong phòng yên tĩnh để có kết quả tốt nhất.',
        },
        {
          question: 'Bản ghi âm của tôi có được dùng để huấn luyện mô hình AI không?',
          answer: 'Không. Không có gì bạn tải lên hay tạo ra được dùng để huấn luyện bất kỳ mô hình nào. Giọng nói được sao chép từ đoạn tham chiếu của bạn mỗi lần bạn tạo lời nói.',
        },
        {
          question: 'Người khác có biết âm thanh là do máy tạo ra không?',
          answer: 'Mọi tệp được tạo bằng giọng nói đã lưu đều mang một hình mờ âm thanh không nghe thấy được mà các công cụ phát hiện có thể đọc. Hình mờ không làm thay đổi cách âm thanh nghe ra.',
        },
        {
          question: 'Làm sao để xóa một giọng nói?',
          answer: 'Mở Tài khoản, Giọng nói và xóa nó. Bản ghi tham chiếu và bản nghe thử của giọng nói sẽ bị xóa; âm thanh bạn đã tạo vẫn ở trong lịch sử cho đến khi hết thời gian lưu của chính nó.',
        },
        {
          question: 'Tôi có thể giữ bao nhiêu giọng nói?',
          answer: 'Tùy theo gói của bạn; trang hiển thị số giọng nói bạn đã lưu và giới hạn của bạn.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Bản tham chiếu phải dài 5 đến 60 giây và có lời nói.',
          'Lưu giọng nói cần có tài khoản; giọng có sẵn dùng được mà không cần tài khoản.',
        ],
      },
      related: [
        {
          label: 'Thiết kế giọng nói',
          to: '/tools/voice-designer',
          description: 'Mô tả một giọng nói mới và giữ lại.',
        },
        {
          label: 'Đổi giọng nói',
          to: '/tools/voice-changer',
          description: 'Đổi cao độ bản ghi âm hoặc chuyển nó sang một giọng nói.',
        },
        {
          label: 'Làm sạch âm thanh giọng nói',
          to: '/tools/clean-voice-audio',
          description: 'Làm sạch bản ghi âm trước khi dùng.',
        },
        {
          label: 'Đổi cao độ âm thanh',
          to: '/tools/change-audio-pitch',
          description: 'Đổi tông của nhạc hoặc lời nói.',
        },
      ],
      embed: {
        title: 'Tạo giọng nói',
        description: 'Ghi âm hoặc tải lên một bản ghi âm sạch dài 5 đến 60 giây, xác nhận rằng giọng nói là của bạn hoặc bạn có sự cho phép của người nói, rồi tạo giọng nói. Sau đó nhập văn bản và tạo lời nói. Giọng có sẵn dùng được mà không cần tài khoản.',
      },
    },
    'voice-designer': {
      name: 'Thiết kế giọng nói',
      h1: 'Thiết kế một giọng nói mới từ mô tả',
      tagline: 'Mô tả một giọng nói bằng lời, nghe thử và giữ lại giọng bạn thích để đọc bất kỳ văn bản nào bằng hơn hai mươi ngôn ngữ.',
      metaTitle: 'Thiết kế giọng nói mới từ mô tả bằng văn bản | Media Manipulator',
      metaDescription: 'Mô tả giọng nói bạn muốn, chẳng hạn ấm áp, trầm và điềm tĩnh, nghe thử miễn phí, giữ lại và dùng nó để tạo lời nói. Mô hình tự lưu trữ; đầu ra có hình mờ âm thanh.',
      ogTitle: 'Thiết kế một giọng nói mới từ mô tả',
      ogDescription: 'Mô tả một giọng nói, nghe các bản nghe thử miễn phí, giữ lại giọng bạn thích và dùng nó để tạo lời nói. Tự lưu trữ, có hình mờ âm thanh.',
      intro: 'Trình thiết kế giọng nói tạo ra một giọng nói không thuộc về bất kỳ ai. Hãy mô tả nó bằng vài từ, như giới tính, độ tuổi, giọng vùng, âm sắc và tốc độ, hoặc ghép mô tả từ các thẻ đặc điểm, rồi nghe thử một câu mẫu. Nghe thử là miễn phí, ba lượt cho mỗi mô tả mỗi giờ. Khi nghe thấy giọng bạn muốn, hãy đặt tên và giữ lại: đúng giọng nói bạn đã nghe thử sẽ được lưu vào tài khoản của bạn và sau đó có thể đọc bất kỳ văn bản nào, bằng bất kỳ ngôn ngữ nào của công cụ tạo lời nói. Việc thiết kế chạy trên Qwen3-TTS và việc đọc chạy trên Chatterbox, cả hai đều trên máy chủ GPU của chính chúng tôi, và mọi tệp được tạo ra đều mang một hình mờ âm thanh không nghe thấy được.',
      whatItDoes: [
        'Biến mô tả bằng văn bản về một giọng nói thành bản nghe thử có lời đọc.',
        'Giữ đúng giọng nói đã nghe thử (cùng một seed) khi bạn lưu nó.',
        'Đọc bất kỳ văn bản nào bằng giọng nói đã giữ lại, với hơn 20 ngôn ngữ.',
        'Trả về tệp MP3 của lời nói, kèm bản tải xuống WAV được tạo trong trình duyệt của bạn.',
      ],
      flowSteps: [
        {
          title: 'Mô tả',
          description: 'Viết hoặc nhấp vào các đặc điểm bạn muốn.',
        },
        {
          title: 'Nghe thử',
          description: 'Ba lượt nghe thử miễn phí cho mỗi mô tả mỗi giờ.',
        },
        {
          title: 'Giữ lại',
          description: 'Đặt tên cho giọng nói và lưu vào tài khoản của bạn.',
        },
        {
          title: 'Tạo lời nói',
          description: 'Nhập bất kỳ văn bản nào và tải âm thanh xuống.',
        },
      ],
      advancedDetails: [
        'Việc thiết kế dùng Qwen3-TTS VoiceDesign (Apache 2.0). Câu nghe thử có thể được tạo bằng mười ngôn ngữ: tiếng Trung, tiếng Anh, tiếng Nhật, tiếng Hàn, tiếng Đức, tiếng Pháp, tiếng Nga, tiếng Bồ Đào Nha, tiếng Tây Ban Nha và tiếng Ý.',
        'Một giọng nói đã giữ lại được lưu dưới dạng mô tả, seed và một đoạn âm thanh tham chiếu dài 10 giây; từ đó trở đi Chatterbox đọc bằng giọng này, nên nó nghe giống hệt nhau ở mọi nơi và trong mọi ngôn ngữ được hỗ trợ.',
        'Lượt nghe thử không bị tính. Giữ lại một giọng nói được tính là một tác vụ AI, và mỗi lần tạo lời nói được tính là một tác vụ AI.',
        'Mô tả bằng tiếng Anh cho kết quả tốt nhất; các thẻ đặc điểm thêm vào những đặc điểm bằng tiếng Anh.',
      ],
      whyItMatters: [
        'Một giọng người dẫn chuyện hoặc giọng nhân vật riêng biệt mà không cần thuê diễn viên lồng tiếng cho bản nháp.',
        'Không dùng đến giọng của bất kỳ người thật nào, nên không ai bị mượn đặc điểm nhận dạng.',
        'Giọng nói đã giữ lại luôn nhất quán qua mọi kịch bản và mọi ngôn ngữ.',
      ],
      useCases: [
        {
          title: 'Nhân vật',
          description: 'Cho mỗi nhân vật trong truyện hoặc trong bản mẫu trò chơi một giọng nói riêng.',
        },
        {
          title: 'Video giải thích',
          description: 'Một người dẫn chuyện điềm tĩnh, rõ ràng cho video giới thiệu sản phẩm và video đào tạo.',
        },
        {
          title: 'Âm thanh tạm thời',
          description: 'Lồng tiếng tạm trong lúc kịch bản vẫn còn thay đổi.',
        },
        {
          title: 'Hỗ trợ tiếp cận',
          description: 'Một giọng đọc dễ nghe cho các tài liệu dài.',
        },
      ],
      whyMediaManipulator: [
        'Mô hình mở trên máy chủ GPU của chính chúng tôi; không có nhà cung cấp AI bên thứ ba.',
        'Nghe thử miễn phí trước khi bất cứ thứ gì bị tính.',
        'Đầu ra có hình mờ âm thanh và nút xóa cho mọi giọng nói đã giữ lại.',
      ],
      privacyNote: 'Chỉ mô tả bằng văn bản do bạn viết được gửi đến mô hình giọng nói; các bản nghe thử mà nó tạo ra là âm thanh do chúng tôi tạo, và giọng nói bạn giữ lại được lưu theo seed của nó. Bản ghi âm giọng nói và giọng nói đã lưu được xử lý trên máy chủ của chính chúng tôi; không có gì được gửi đến nhà cung cấp AI bên thứ ba và không có gì được dùng để huấn luyện bất kỳ mô hình nào. Một giọng nói đã lưu (bản ghi âm tham chiếu và bản nghe thử của nó) được lưu trong tài khoản của bạn, tuân theo thời gian lưu bạn chọn và có thể bị xóa từ Tài khoản, Giọng nói bất cứ lúc nào; nó bị xóa cùng với tài khoản của bạn. Âm thanh được tạo ra được lưu như mọi kết quả khác: Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Giọng nói được thiết kế có phải là giọng thật của ai đó không?',
          answer: 'Không. Nó được tạo từ mô tả của bạn và một seed ngẫu nhiên; nó không được mô phỏng theo bất kỳ người cụ thể nào.',
        },
        {
          question: 'Vì sao lượt nghe thử lại hết?',
          answer: 'Mỗi mô tả chỉ được nghe thử ba lần mỗi giờ để lượt nghe thử miễn phí luôn sẵn có cho mọi người. Hãy đổi mô tả để nghe thử lại, hoặc giữ lại giọng nói bạn thích.',
        },
        {
          question: 'Giọng nói đã giữ lại có nghe giống bản nghe thử không?',
          answer: 'Có. Khi giữ lại, hệ thống gửi đúng mô tả và seed của bản nghe thử bạn đã nghe, và giọng nói được lưu từ chính lần tạo đó.',
        },
        {
          question: 'Nó có thể nói những ngôn ngữ nào?',
          answer: 'Một giọng nói được thiết kế bằng một trong mười ngôn ngữ, và khi đã được giữ lại, nó có thể nói mọi ngôn ngữ của công cụ tạo lời nói, tổng cộng hơn hai mươi ngôn ngữ.',
        },
        {
          question: 'Đầu ra có được đánh dấu là nội dung do AI tạo ra không?',
          answer: 'Có. Mọi tệp được tạo ra đều mang một hình mờ âm thanh không nghe thấy được mà các công cụ phát hiện có thể đọc.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Nghe thử: 3 lượt cho mỗi mô tả mỗi giờ, không bị tính.',
          'Giữ lại một giọng nói cần có tài khoản.',
        ],
      },
      related: [
        {
          label: 'Sao chép giọng nói',
          to: '/tools/voice-cloning',
          description: 'Tạo một giọng nói từ bản ghi âm của chính bạn.',
        },
        {
          label: 'Đổi giọng nói',
          to: '/tools/voice-changer',
          description: 'Đổi cao độ một bản ghi âm hoặc chuyển nó sang một giọng nói.',
        },
        {
          label: 'Làm sạch âm thanh giọng nói',
          to: '/tools/clean-voice-audio',
          description: 'Làm sạch bản ghi âm trước khi sử dụng.',
        },
        {
          label: 'Đổi cao độ âm thanh',
          to: '/tools/change-audio-pitch',
          description: 'Đổi tông của nhạc hoặc lời nói.',
        },
      ],
      embed: {
        title: 'Mô tả một giọng nói',
        description: 'Viết một mô tả ngắn hoặc nhấp vào các thẻ đặc điểm, nghe thử giọng nói (ba lượt nghe thử miễn phí cho mỗi mô tả mỗi giờ), rồi giữ lại để tạo lời nói. Giữ lại một giọng nói cần có tài khoản.',
      },
    },
    'voice-changer': {
      name: 'Đổi giọng nói',
      h1: 'Đổi giọng nói trong bản ghi âm',
      tagline: 'Đổi cao độ và đặc trưng của bản ghi âm tức thì, hoặc dùng AI chuyển lời nói sang một giọng nói đã lưu hoặc có sẵn.',
      metaTitle: 'Đổi giọng nói: Đổi cao độ hoặc chuyển đổi bản ghi âm | Media Manipulator',
      metaDescription: 'Đổi giọng nói trong bản ghi âm: đổi cao độ và formant tức thì, hoặc dùng AI chuyển lời nói sang một giọng nói đã lưu hoặc có sẵn. So sánh trước và sau.',
      ogTitle: 'Đổi giọng nói trong bản ghi âm',
      ogDescription: 'Đổi cao độ và formant tức thì, hoặc dùng AI chuyển lời nói sang một giọng nói khác, rồi so sánh trước và sau.',
      intro: 'Công cụ đổi giọng nói có hai cách để thay đổi một bản ghi âm. Đổi cao độ là cách thay đổi cao độ và formant cổ điển: nâng hoặc hạ cao độ tới mười hai nửa cung theo mỗi chiều, giữ nguyên đặc trưng của người nói hoặc đổi nó cùng với cao độ, hoặc bắt đầu từ một mẫu có sẵn như Trầm hơn, Cao hơn, Như trẻ em, Lớn tuổi hoặc Điện thoại. Cách này diễn ra tức thì, không cần tài khoản và không dùng AI. Chuyển đổi dùng công nghệ chuyển đổi giọng nói bằng AI để làm cho lời nói nghe như một trong các giọng nói đã lưu của bạn hoặc một giọng nói có sẵn, trong khi vẫn giữ nguyên lời, nhịp và ngữ điệu. Dù chọn cách nào, bạn cũng có thể so sánh bản gốc và kết quả bằng trình phát A/B không ngắt quãng trước khi tải xuống.',
      whatItDoes: [
        'Nâng hoặc hạ cao độ tới 12 nửa cung, với formant được giữ nguyên hoặc đổi theo.',
        'Cung cấp các mẫu đổi cao độ có sẵn: trầm hơn, cao hơn, như trẻ em, lớn tuổi và điện thoại.',
        'Chuyển lời nói sang một giọng nói đã lưu hoặc có sẵn bằng công nghệ chuyển đổi giọng nói AI.',
        'Phát bản gốc và kết quả trong trình so sánh A/B đồng bộ.',
        'Trả về tệp MP3, kèm bản tải xuống WAV được tạo trong trình duyệt của bạn.',
      ],
      flowSteps: [
        {
          title: 'Ghi âm hoặc tải lên',
          description: 'Lời nói từ micro của bạn hoặc từ một tệp âm thanh hay video.',
        },
        {
          title: 'Chọn Đổi cao độ hoặc Chuyển đổi',
          description: 'Đổi cao độ tức thì, hoặc dùng AI chuyển sang một giọng nói khác.',
        },
        {
          title: 'So sánh',
          description: 'Chuyển qua lại giữa bản gốc và kết quả mà không bị ngắt quãng.',
        },
        {
          title: 'Tải xuống',
          description: 'MP3, hoặc WAV được tạo trong trình duyệt của bạn.',
        },
      ],
      advancedDetails: [
        'Đổi cao độ dùng bộ dịch cao độ rubberband thông qua ffmpeg trên máy chủ của chúng tôi. "Giữ nguyên đặc trưng của giọng" giữ nguyên formant; "Đổi cùng với cao độ" dịch chuyển formant, nghe như người nói có vóc dáng nhỏ hơn hoặc lớn hơn. Điện thoại còn áp dụng bộ lọc thông dải từ 300 đến 3400 Hz.',
        'Đổi cao độ được tính là một tác vụ thường và đầu ra không có hình mờ âm thanh. Chuyển đổi được tính là một tác vụ AI và đầu ra mang một hình mờ âm thanh không nghe thấy được.',
        'Chuyển đổi dùng tính năng chuyển đổi giọng nói của Chatterbox trên máy chủ GPU của chính chúng tôi. Độ dài bản ghi âm bạn có thể chuyển đổi tùy thuộc vào gói của bạn.',
        'Chuyển đổi cần có tài khoản. Chuyển sang giọng của người khác cần có sự cho phép của người đó, giống như khi sao chép giọng nói.',
      ],
      whyItMatters: [
        'Ngụy trang giọng nói cho một cuộc phỏng vấn ẩn danh hoặc một clip cần bảo vệ quyền riêng tư chỉ bằng một lần đổi cao độ đơn giản.',
        'Sửa một đoạn thu bị ghi bằng giọng không phù hợp mà không cần thu lại.',
        'Nghe thấy sự khác biệt ngay lập tức với trình phát A/B thay vì phải đoán.',
      ],
      useCases: [
        {
          title: 'Âm thanh ẩn danh',
          description: 'Đổi cao độ giọng nói để người nói khó bị nhận ra hơn.',
        },
        {
          title: 'Giọng nhân vật',
          description: 'Biến bản đọc của chính bạn thành một giọng khác cho câu chuyện.',
        },
        {
          title: 'Lời dẫn nhất quán',
          description: 'Chuyển câu thoại của khách mời sang giọng đã lưu của người dẫn chuyện.',
        },
        {
          title: 'Hiệu ứng',
          description: 'Hiệu ứng giọng điện thoại hoặc giọng trẻ em cho một cảnh video.',
        },
      ],
      whyMediaManipulator: [
        'Công cụ đổi cao độ miễn phí và không cần tài khoản.',
        'Chuyển đổi bằng AI chạy trên máy chủ GPU của chính chúng tôi, không phải dịch vụ bên thứ ba.',
        'Tích hợp sẵn trình so sánh A/B giữa bản gốc và kết quả.',
      ],
      privacyNote: 'Bản ghi âm bạn tải lên sẽ được đổi cao độ bằng rubberband hoặc được một mô hình AI chuyển sang giọng nói khác, tùy theo chế độ bạn chọn. Bản ghi âm giọng nói và giọng nói đã lưu được xử lý trên máy chủ của chính chúng tôi; không có gì được gửi đến nhà cung cấp AI bên thứ ba và không có gì được dùng để huấn luyện bất kỳ mô hình nào. Một giọng nói đã lưu (bản ghi âm tham chiếu và bản nghe thử của nó) được lưu trong tài khoản của bạn, tuân theo thời gian lưu bạn chọn và có thể bị xóa từ Tài khoản, Giọng nói bất cứ lúc nào; nó bị xóa cùng với tài khoản của bạn. Âm thanh được tạo ra được lưu như mọi kết quả khác: Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Đổi cao độ và Chuyển đổi khác nhau thế nào?',
          answer: 'Đổi cao độ thay đổi cao độ và đặc trưng của cùng một giọng nói bằng xử lý tín hiệu; cách này diễn ra tức thì và miễn phí. Chuyển đổi dùng AI để làm cho lời nói nghe như một giọng nói khác, là một trong các giọng nói đã lưu của bạn hoặc một giọng nói có sẵn.',
        },
        {
          question: 'Đổi cao độ có thêm hình mờ âm thanh không?',
          answer: 'Không. Âm thanh được đổi cao độ chỉ qua xử lý tín hiệu thông thường và không có hình mờ âm thanh. Âm thanh được chuyển đổi mang một hình mờ âm thanh không nghe thấy được.',
        },
        {
          question: 'Tôi có thể chuyển giọng của mình thành giọng của một người nổi tiếng không?',
          answer: 'Không. Bạn chỉ có thể chuyển sang các giọng nói đã lưu của chính bạn hoặc các giọng nói có sẵn của chúng tôi, và việc dùng giọng của một người thật cần có sự cho phép rõ ràng của họ. Điều khoản của chúng tôi cấm mạo danh khi chưa được phép.',
        },
        {
          question: 'Bản ghi âm có thể dài bao nhiêu?',
          answer: 'Đổi cao độ chấp nhận bản ghi âm dài tối đa bằng giới hạn độ dài của gói bạn. Chuyển đổi có giới hạn riêng cho từng gói, được hiển thị khi bạn tải lên.',
        },
        {
          question: 'Tôi có thể dùng tệp video không?',
          answer: 'Có. Track âm thanh được sử dụng và phần hình ảnh bị bỏ đi.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Đổi cao độ: một tác vụ thường, không cần tài khoản.',
          'Chuyển đổi: một tác vụ AI, cần có tài khoản và gói phù hợp.',
        ],
      },
      related: [
        {
          label: 'Sao chép giọng nói',
          to: '/tools/voice-cloning',
          description: 'Tạo một giọng nói từ bản ghi âm của chính bạn.',
        },
        {
          label: 'Thiết kế giọng nói',
          to: '/tools/voice-designer',
          description: 'Mô tả một giọng nói mới và giữ lại.',
        },
        {
          label: 'Làm sạch âm thanh giọng nói',
          to: '/tools/clean-voice-audio',
          description: 'Làm sạch bản ghi âm trước khi sử dụng.',
        },
        {
          label: 'Đổi cao độ âm thanh',
          to: '/tools/change-audio-pitch',
          description: 'Đổi tông của nhạc hoặc lời nói.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Làm sạch bản ghi âm trước.',
        },
      ],
      embed: {
        title: 'Đổi giọng nói',
        description: 'Ghi âm hoặc tải lên lời nói. Chế độ Đổi cao độ điều chỉnh cao độ và formant tức thì, cho tất cả mọi người. Chuyển đổi làm cho bản ghi âm nghe như một trong các giọng nói đã lưu của bạn hoặc một giọng nói có sẵn, và cần có tài khoản với gói bao gồm tính năng này.',
      },
    },
    // MM84: name / tagline / metaTitle / metaDescription for the copy-bar tool pages (model-written, needs native review).
    'content-studio': {
      name: 'Darkroom',
      h1: 'Darkroom',
      tagline: 'Chỉnh sửa, xếp lớp và trộn video và âm thanh trên dòng thời gian nhiều track, rồi xuất MP4. Trình chỉnh sửa kiểu Premiere Pro, chạy ngay trong trình duyệt.',
      metaTitle: 'Darkroom: Sửa video nhiều track trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Chỉnh sửa, xếp lớp và trộn video và âm thanh trên dòng thời gian nhiều track, rồi xuất MP4. Trình chỉnh sửa video miễn phí kiểu Premiere Pro chạy ngay trong trình duyệt. Không cần đăng ký, không cần cài đặt.',
      ogTitle: '🎬 Darkroom: Trình chỉnh sửa video nhiều track miễn phí ngay trong trình duyệt',
      ogDescription: 'Chỉnh sửa, xếp lớp và trộn video và âm thanh trên dòng thời gian nhiều track, thêm tiêu đề, chuyển cảnh và màu sắc, rồi xuất MP4. Trình chỉnh sửa kiểu Premiere Pro ngay trong trình duyệt của bạn, không cần đăng ký, hoàn toàn miễn phí. Hãy dùng thử! 🎬',
      intro: 'Darkroom là trình biên tập video nhiều track chạy ngay trong một thẻ trình duyệt. Bạn tạo một dự án với vùng dựng (canvas) và tốc độ khung hình, thả tệp video, hình ảnh và âm thanh vào hộp Phương tiện, xếp chúng trên các track chồng lên nhau, cắt và tách chúng đúng ranh giới khung hình, chỉnh màu và tách nền, thêm tiêu đề, chuyển cảnh và phụ đề, trộn âm thanh bằng bộ trộn theo từng track, rồi giao dòng thời gian đã hoàn chỉnh cho máy chủ kết xuất của chúng tôi. Tại đó, ffmpeg dựng toàn bộ bản dựng thành một đồ thị bộ lọc duy nhất và mã hóa thành H.264 hoặc HEVC trong MP4, hoặc thành MP3 hoặc WAV khi dự án chỉ có âm thanh. Bản xem trước mà bạn chỉnh sửa được ghép lớp trực tiếp trên GPU của bạn bằng WebGL2; bản xuất được đối chiếu với bản xem trước đó, nên những gì bạn thấy chính là những gì bạn nhận được.',
      whatItDoes: [
        'Chạy dòng thời gian nhiều track chính xác đến từng khung hình: cắt, tách, xóa dồn, dao cắt, các thao tác slip, slide, roll và ripple, điểm đánh dấu, nhóm, khóa track, solo và ẩn track, cùng tách âm thanh khỏi video.',
        'Ghép lớp các track theo thứ tự chồng, với cắt khung, khớp khung, biến đổi, chỉnh màu kiểu Lumetri (phơi sáng, tương phản, độ bão hòa, nhiệt độ màu, sắc độ, độ rực), LUT 3D, tách nền chroma key bằng ống nhỏ giọt, độ mờ và tám chế độ hòa trộn.',
        'Tạo hoạt ảnh cho vị trí, tỷ lệ, xoay, độ mờ, âm lượng, cân bằng trái phải và tham số hiệu ứng bằng keyframe với năm đường cong easing; thêm mười lăm kiểu chuyển cảnh và clip tiêu đề dựng từ các lớp văn bản và hình khối.',
        'Trộn âm thanh qua fader, pan, EQ ba dải và bộ nén trên từng track với đồng hồ đo trực tiếp, cùng tính năng tự động hạ âm và các thiết lập độ ồn cho phát trực tuyến, podcast và phát sóng trên bus tổng.',
        'Tạo phụ đề bằng Whisper trên GPU của chúng tôi, cho phép bạn chỉnh sửa chúng trong làn phụ đề, rồi xuất chúng ghi thẳng vào hình hoặc dưới dạng tệp đi kèm SRT hoặc VTT.',
        'Xuất MP4 H.264 hoặc HEVC với âm thanh AAC, hoặc MP3 hoặc WAV, ở kích thước vùng dựng hoặc co giãn về 720, 1080, 1440 hoặc 2160 dòng, và có bảng xuất hiển thị tiến trình cùng tùy chọn kết xuất lại.',
      ],
      flowSteps: [
        {
          title: 'Tạo dự án',
          description: 'Chọn vùng dựng (16:9 ở 1920 x 1080, 9:16 ở 1080 x 1920, 1:1, 4:5 hoặc kích thước tùy chỉnh) và tốc độ khung hình 24, 30 hoặc 60.',
        },
        {
          title: 'Nhập phương tiện',
          description: 'Tải video, hình ảnh và âm thanh lên hộp Phương tiện. Máy chủ kết xuất một proxy xem trước có keyframe ở mỗi giây để việc tua luôn nhẹ nhàng.',
        },
        {
          title: 'Cắt và xếp lớp',
          description: 'Đặt clip lên các track, cắt và tách tại đầu phát, xếp lớp phủ và tiêu đề phía trên cảnh quay nền, và giữ ảnh tĩnh trong bao lâu tùy ý.',
        },
        {
          title: 'Chỉnh màu, tách nền và trộn âm',
          description: 'Điều chỉnh màu, áp dụng LUT, tách bỏ phông nền, đặt keyframe cho những gì cần chuyển động, và cân bằng các track âm thanh trên bộ trộn.',
        },
        {
          title: 'Xuất',
          description: 'Chọn định dạng, chất lượng, chiều cao đầu ra, chế độ phụ đề và thiết lập độ ồn. ffmpeg kết xuất dòng thời gian trên máy chủ của chúng tôi và tệp xuất hiện trong bảng xuất.',
        },
      ],
      advancedDetails: [
        'Bản xuất là một lần gọi ffmpeg duy nhất: mỗi nguồn là một đầu vào, dòng thời gian trở thành đồ thị filter_complex (trim, scale, overlay, drawtext cho tiêu đề, eq và các bộ lọc màu, amix với normalize=0 cho âm thanh) và đầu ra được mã hóa trong một lượt. Các tham số có keyframe được truyền qua một tệp sendcmd đi kèm đồ thị, nên máy kết xuất cần ffmpeg 4.4 trở lên.',
        'H.264 dùng bộ mã hóa phần cứng h264_nvenc khi một lần mã hóa thử thành công trên GPU kết xuất, nếu không thì dùng libx264. Các thiết lập chất lượng tương ứng với NVENC preset p4 ở chất lượng không đổi 23 (Trung bình), p5 ở CQ 19 (Cao) và p4 ở CQ 28 (Thấp); trên libx264 là preset medium CRF 23, slow CRF 18 và veryfast CRF 28. Cả hai đều cố định yuv420p.',
        'HEVC dùng hevc_nvenc hoặc libx265 với giá trị CQ hoặc CRF cao hơn năm điểm (28, 24, 33 trên NVENC; 28, 24, 32 trên libx265), mức chênh thông thường để có chất lượng cảm nhận tương đương, và gắn thẻ luồng là hvc1 để MP4 phát được trong Safari và QuickTime. Nếu không có bộ mã hóa nào khả dụng, bản xuất sẽ báo lỗi rõ ràng thay vì trả về H.264 dưới cái tên HEVC.',
        'Âm thanh được lấy mẫu lại thành stereo 48 kHz trong đồ thị và mã hóa thành AAC 192 kb/s cho bản xuất video; bản xuất MP3 dùng libmp3lame ở 192 kb/s và bản xuất WAV là PCM 16-bit. Các thiết lập độ ồn là bộ lọc loudnorm của ffmpeg: phát trực tuyến I=-14 LUFS TP=-1.5 LRA=11, podcast I=-16 TP=-1.5 LRA=11, phát sóng I=-23 TP=-2 LRA=7.',
        'Khi bạn chọn chiều cao đầu ra, khung hình đã ghép được co giãn ở bộ lọc cuối cùng (lanczos, điểm ảnh vuông, chiều rộng làm tròn thành số chẵn), sau khi phụ đề đã được ghi vào hình, nên văn bản được co giãn cùng hình ảnh thay vì được vẽ lại. Chiều cao mà gói của bạn không kết xuất được sẽ bị từ chối kèm thông báo lỗi, không bao giờ bị âm thầm hạ xuống.',
        'Tệp MP4 được ghi với -movflags +faststart để chỉ mục nằm ở đầu tệp và tệp bắt đầu phát trước khi tải xong hoàn toàn. Ảnh tĩnh trên dòng thời gian trở thành đầu vào với -loop 1 -framerate <project fps> -t <hold>, nên một ảnh được giữ không tốn công giải mã hơn số khung hình của nó.',
      ],
      whyItMatters: [
        'Một công cụ chuyển đổi thay đổi một tệp. Một bản dựng kết hợp nhiều tệp: cảnh phụ (b-roll) bên dưới buổi phỏng vấn, tiêu đề trên đoạn mở đầu, nhạc nền bên dưới cả hai, mỗi thứ được cắt đến từng khung hình.',
        'Trong các trình biên tập trên trình duyệt, bản xem trước và bản xuất thường lệch nhau. Darkroom kết xuất bản xem trước trên GPU của bạn và bản xuất trên GPU của chúng tôi, và giữ hai bản trong một sai số cho phép đã được công bố nhờ bộ kiểm thử ảnh chuẩn (golden-image).',
        'Phần việc nặng không chạy trên máy tính của bạn. Một bản xuất 4K, một lượt chép lời bằng Whisper hay một bản ghép nhiều lớp chỉnh màu bằng LUT đều chạy trên máy chủ kết xuất GPU, nên một chiếc laptop mỏng nhẹ vẫn hoàn thành được việc.',
      ],
      useCases: [
        {
          title: 'Clip dọc cho nền tảng video ngắn',
          description: 'Vùng dựng 1080 x 1920, cảnh phóng cận vào người nói, thẻ tiêu đề, nhạc được hạ âm dưới giọng nói và phụ đề ghi thẳng vào hình.',
        },
        {
          title: 'Video hướng dẫn và quay màn hình',
          description: 'Cắt bỏ khoảng lặng, nối các lần quay, chồng hình webcam dạng picture-in-picture, thêm chú thích và xuất ở 1080p kèm tệp phụ đề đi kèm.',
        },
        {
          title: 'Tập phỏng vấn và podcast',
          description: 'Hai góc máy cắt theo người đang nói, bản trộn đã chuẩn hóa độ ồn, và một bản xuất MP3 từ cùng dòng thời gian cho kênh âm thanh.',
        },
        {
          title: 'Video quảng bá và giới thiệu sản phẩm',
          description: 'Cảnh quay tách nền chroma key đặt trên một phông nền, LUT tạo phong cách màu, chuyển động logo bằng keyframe và một bản cắt 15 giây ở 4K cho màn hình treo tường.',
        },
      ],
      workedExamples: [
        {
          title: 'Bản cắt 1080p30 dài 90 giây ở mức Trung bình',
          body: 'Hai clip 1080p, một track nhạc và một thẻ tiêu đề trên vùng dựng 1920 x 1080 ở 30 fps, xuất thành H.264 ở mức Trung bình. Trên máy chủ kết xuất có NVENC hoạt động, đó là h264_nvenc preset p4 ở chất lượng không đổi 23 với yuv420p; nếu không có, là libx264 preset medium CRF 23. Bản trộn âm thanh được mã hóa thành AAC 192 kb/s, với 90 giây là 192.000 x 90 / 8, tức khoảng 2,2 MB âm thanh bất kể nội dung. Phần video nhắm đến chất lượng chứ không nhắm đến bitrate, nên kích thước phụ thuộc vào cảnh quay: cảnh người nói tĩnh ở CQ 23 cho tệp nhỏ, cảnh cầm tay nhiều chuyển động cho tệp lớn. Thời gian kết xuất tăng theo độ dài dòng thời gian và số clip hiển thị cùng lúc, vì mọi khung hình của mọi clip đang hiển thị đều được giải mã và ghép lớp trước khi đến bộ mã hóa.',
        },
        {
          title: 'Podcast 20 phút xuất thành MP3 và WAV',
          body: 'Một dự án chỉ có âm thanh (hai track giọng nói, một đoạn nhạc hiệu mở đầu, thiết lập độ ồn podcast) bỏ qua hoàn toàn đồ thị video. Khi xuất thành MP3, tệp được mã hóa bằng libmp3lame ở mức cố định 192 kb/s: 192.000 x 1.200 / 8 = 28,8 MB, tức khoảng 29 MB. Khi xuất thành WAV, tệp là PCM 16-bit ở định dạng stereo 48 kHz của đồ thị: 48.000 x 2 kênh x 2 byte = 192.000 byte mỗi giây, tức 230 MB cho 20 phút. Khâu loudnorm nhắm đến độ ồn tích hợp -16 LUFS với mức trần -1,5 dBTP và dải độ ồn 11 LU. Không có khung hình nào cần ghép lớp, tác vụ chỉ bị giới hạn bởi việc giải mã nguồn và các bộ lọc âm thanh, nên hoàn tất nhanh hơn nhiều so với độ dài của tập podcast.',
        },
      ],
      whenNotToUse: 'Darkroom không phải công cụ phù hợp cho việc chỉ cần một bước. Nếu bạn chỉ cần cắt phần đầu và phần cuối của một clip, đổi định dạng hoặc thu nhỏ nó, các trang cắt video và nén video chuyên dụng làm việc đó chỉ với một lần tải lên và không cần dự án. Đây cũng không phải nơi dành cho cảnh quay mà bạn không thể tải lên: mọi nguồn đều được gửi đến máy chủ của chúng tôi để tạo proxy và kết xuất, nên tư liệu tuyệt đối không được rời khỏi máy của bạn thì nên dựng bằng trình biên tập trên máy tính. Trong phiên khách, bạn chỉ có một dự án và dự án đó tồn tại 24 giờ; hãy đăng nhập trước khi bắt đầu bất cứ thứ gì bạn muốn quay lại vào tuần sau.',
      whyMediaManipulator: [
        'Các thao tác dựng thực thụ: dao cắt, slip, slide, roll, ripple, điểm đánh dấu, nhóm, keyframe có easing, bộ trộn với EQ và bộ nén, chứ không phải một công cụ cắt kèm thêm ô tiêu đề.',
        'Bản xuất trung thực: mã hóa phần cứng hay phần mềm được chọn bằng một lần dò thử trực tiếp, HEVC thà từ chối chứ không gắn nhãn sai, và độ phân giải mà gói của bạn không kết xuất được sẽ báo lỗi chứ không lặng lẽ bị hạ xuống.',
        'Một tài khoản, một nơi: chép lời, nén hoặc xóa siêu dữ liệu của chính những tệp bạn chỉnh sửa, và tạo lồng tiếng hoặc phụ đề trên cùng máy chủ GPU.',
      ],
      privacyNote: 'Darkroom lưu phương tiện của bạn trên máy chủ của chúng tôi trong suốt thời gian dự án tồn tại: tệp tải lên được đưa vào hộp Phương tiện dưới dạng tài nguyên, máy chủ kết xuất proxy xem trước, dải phim và đỉnh dạng sóng từ chúng, và bản xuất được ffmpeg dựng vào outputs/<jobId>/ trên máy kết xuất. Khi bạn yêu cầu phụ đề, âm thanh được gửi đến Whisper trên GPU của chính chúng tôi và các dòng phụ đề thu được được lưu cùng dự án. Tài liệu dự án, tài nguyên, phiên bản và bản xuất của nó có thể được xóa từ trình biên tập hoặc trang Tài khoản. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Video và âm thanh tải lên cũng đi qua một bước phân tích tự động trên máy chủ của chính chúng tôi. Không có gì được gửi đến nhà cung cấp AI bên thứ ba và không tệp nào được dùng để huấn luyện bất cứ thứ gì.',
      faq: [
        {
          question: 'Darkroom có miễn phí không?',
          answer: 'Có. Không cần tài khoản, bạn có thể giữ một dự án và kết xuất 5 bản xuất mỗi ngày, với tệp tải lên tối đa 200 MB mỗi tệp và đầu ra tối đa 1080 dòng. Tài khoản miễn phí nâng mức đó lên 5 dự án, 30 bản xuất mỗi ngày, tệp 1 GB và 1440 dòng; Premium cho số dự án không giới hạn, 300 bản xuất mỗi ngày, tệp 5 GB và đầu ra 2160 dòng; Pro nâng số bản xuất lên 700 mỗi ngày. Bản xuất có bộ đếm hằng ngày riêng và không tiêu tốn hạn mức tác vụ thường. Đây là các giá trị mặc định; trang giá hiển thị các con số hiện hành.',
        },
        {
          question: 'Tôi có thể xuất những gì?',
          answer: 'MP4 với video H.264 hoặc HEVC và âm thanh AAC, hoặc MP3 hoặc WAV cho dự án chỉ có âm thanh. Video có thể xuất ở kích thước vùng dựng hoặc co giãn về 720, 1080, 1440 hoặc 2160 dòng; phụ đề có thể ghi vào hình, xuất thành tệp đi kèm SRT hoặc VTT, hoặc bỏ qua; và bản trộn có thể dùng thiết lập độ ồn phát trực tuyến, podcast hoặc phát sóng.',
        },
        {
          question: 'Tôi nên chọn thiết lập chất lượng nào?',
          answer: 'Trung bình là CRF 23 trên libx264 hoặc chất lượng không đổi 23 trên NVENC, và là mặc định hợp lý khi tải lên một nền tảng vốn sẽ mã hóa lại. Cao (CRF 18 hoặc CQ 19, preset slow hoặc p5) dành cho bản gốc bạn sẽ chỉnh sửa tiếp hoặc chiếu trên màn hình lớn. Thấp (CRF 28 hoặc CQ 28, veryfast hoặc p4) dành cho bản xem trước nhanh để gửi đồng nghiệp.',
        },
        {
          question: 'Vì sao bản xuất HEVC của tôi thất bại?',
          answer: 'HEVC cần hevc_nvenc trên GPU kết xuất hoặc libx265 trong bản dựng ffmpeg. Nếu máy chủ không có cả hai, bản xuất sẽ thất bại với thông báo bộ mã hóa không được hỗ trợ thay vì trả về một tệp H.264 gắn nhãn HEVC. Hãy chuyển định dạng sang H.264 và cùng dòng thời gian đó sẽ kết xuất bình thường.',
        },
        {
          question: 'Phụ đề được tạo như thế nào?',
          answer: 'Nút Tạo phụ đề gửi âm thanh của dòng thời gian đến Whisper trên máy chủ GPU của chúng tôi. Các đoạn trả về dưới dạng dòng phụ đề mà bạn có thể chỉnh sửa trong làn phụ đề, rồi xuất ghi vào hình (một track phụ đề ASS được kết xuất vào khung hình) hoặc thành tệp SRT hoặc VTT nằm cạnh video. Mỗi lần tạo phụ đề được tính là một tác vụ AI, trừ vào hạn mức tác vụ AI.',
        },
        {
          question: 'Bản xuất có khớp với bản xem trước không?',
          answer: 'Đó chính là mục đích của thiết kế. Bản xem trước ghép lớp bằng WebGL2 theo đúng thứ tự mà đồ thị bộ lọc trên máy chủ sử dụng (cắt khung, khớp khung, biến đổi, chỉnh màu, LUT, tách nền, độ mờ, hòa trộn), và một bộ kiểm thử ảnh chuẩn so sánh khung hình của cả hai trong một sai số cho phép đã được công bố. Solo và ẩn áp dụng cho bản xuất giống hệt như cho bản xem trước.',
        },
        {
          question: 'Tôi có thể quay lại dự án sau không?',
          answer: 'Có. Dự án được lưu kèm số phiên bản sửa đổi, nên một thẻ trình duyệt cũ không thể ghi đè lên công việc mới hơn, và lịch sử phiên bản giữ các điểm lưu để bạn quay lại. Một bản nháp cũng được giữ trong trình duyệt của bạn để khôi phục khi gặp sự cố. Người dùng đã đăng nhập có thể mở dự án gần đây từ bất kỳ thiết bị nào; dự án của khách gắn với phiên trình duyệt và thời hạn lưu 24 giờ.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Tệp nguồn và tệp xuất được xử lý trên máy chủ của chúng tôi. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
        ],
        processingNotes: [
          'Bản xem trước được ghép lớp trong trình duyệt; bản xuất cuối cùng được mã hóa trên máy chủ thành MP4 H.264 hoặc HEVC, hoặc thành âm thanh MP3 hoặc WAV.',
        ],
      },
      related: [
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Thu nhỏ thêm bản xuất để gửi email hoặc dùng trên kết nối chậm.',
        },
        {
          label: 'Chuyển video thành văn bản',
          to: '/tools/transcribe-video',
          description: 'Nhận bản chép lời đầy đủ của bản dựng đã hoàn tất, không chỉ phụ đề.',
        },
        {
          label: 'Tách âm thanh khỏi video',
          to: '/tools/extract-audio-from-video',
          description: 'Lấy riêng track âm thanh của một clip trước khi đưa nó vào dòng thời gian.',
        },
        {
          label: 'Cắt video',
          to: '/tools/video-trimmer',
          description: 'Khi tất cả những gì bạn cần là một đường cắt.',
        },
        {
          label: 'Motion',
          to: '/tools/motion',
          description: 'Tạo hoạt ảnh cho logo hoặc dải chữ chân màn hình dưới dạng SVG, rồi xuất GIF cho dòng thời gian.',
        },
        {
          label: 'Hướng dẫn Darkroom',
          to: '/tutorials/content-studio',
          description: 'Dựng một video từ dự án trống đến MP4 đã xuất, từng bước một.',
        },
      ],
      embed: {
        title: 'Chỉnh sửa video',
        description: 'Tạo dự án mới (hoặc mở lại dự án gần đây), kéo tệp video, hình ảnh và âm thanh vào hộp Phương tiện, rồi thả chúng lên dòng thời gian nhiều track. Cắt, tách và sắp xếp clip, xếp lớp phủ và tiêu đề, trộn âm thanh và xuất MP4 hoàn chỉnh, tất cả ngay trong trình duyệt của bạn.',
      },
    },
    'remove-exif-metadata': {
      name: 'Xóa siêu dữ liệu EXIF khỏi ảnh',
      h1: 'Xóa siêu dữ liệu EXIF khỏi ảnh trực tuyến',
      tagline: 'Xóa dữ liệu vị trí GPS, thiết bị, máy ảnh và dấu thời gian khỏi ảnh trước khi bạn chia sẻ ở bất cứ đâu.',
      metaTitle: 'Xóa siêu dữ liệu EXIF khỏi ảnh trực tuyến (miễn phí) | Media Manipulator',
      metaDescription: 'Công cụ trực tuyến miễn phí để xóa siêu dữ liệu EXIF, GPS, IPTC và máy ảnh khỏi ảnh JPG, PNG, WebP và HEIC. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Xóa siêu dữ liệu EXIF khỏi ảnh trực tuyến',
      ogDescription: 'Xóa siêu dữ liệu vị trí GPS, máy ảnh và dấu thời gian khỏi ảnh trước khi chia sẻ công khai.',
      intro: 'Một bức ảnh mang theo cả một tài liệu thứ hai bên trong. Bên cạnh các điểm ảnh, điện thoại hoặc máy ảnh ghi lại hãng và mẫu thiết bị, thường cả số sê-ri, ống kính, thông số phơi sáng, chính xác giây mà màn trập bấm, phần mềm lưu tệp gần nhất, một ảnh thu nhỏ xem trước, và khi dịch vụ định vị đang bật, cả vĩ độ, kinh độ và độ cao của nơi bạn đứng. Công cụ này đọc toàn bộ những thông tin đó từ tệp JPG, PNG, WebP hoặc HEIC, hiển thị cho bạn từng thẻ được nhóm theo những gì nó tiết lộ, rồi xóa sạch chỉ trong một lượt ExifTool, để bản bạn chia sẻ chỉ còn lại hình ảnh.',
      whatItDoes: [
        'Kiểm tra tệp tải lên bằng ExifTool và liệt kê mọi thẻ tìm thấy, nhóm theo danh mục (máy ảnh, ống kính, GPS, ngày giờ, XMP, IPTC, ảnh thu nhỏ, màu sắc, ghi chú của hãng và nhiều hơn nữa), đồng thời đánh dấu các thẻ về vị trí, danh tính, thiết bị và lịch sử.',
        'Xóa các khối EXIF (IFD0 và ExifIFD: hãng, mẫu máy, số sê-ri thân máy, mẫu ống kính, phơi sáng, ISO, tiêu cự, ngày chụp và ngày sửa đổi) và GPS IFD (vĩ độ, kinh độ, độ cao, các thẻ tham chiếu của chúng, dấu thời gian GPS).',
        'Xóa ảnh thu nhỏ xem trước nhúng trong IFD1, một bản sao nhỏ riêng biệt của ảnh vẫn còn nguyên sau khi cắt ảnh trong nhiều trình chỉnh sửa.',
        'Xóa các gói XMP (công cụ tạo, lịch sử chỉnh sửa, từ khóa, xếp hạng), bản ghi IPTC (tác giả, bản quyền, chú thích), khối tài nguyên Photoshop, ghi chú của hãng và cấu hình màu ICC.',
        'Áp dụng hướng xoay EXIF vào điểm ảnh trước, để ảnh điện thoại vốn dựa vào thẻ xoay không bị nằm nghiêng sau khi thẻ đó bị xóa.',
        'Đếm số thẻ đã xóa bằng cách so sánh báo cáo trước và sau rồi hiển thị con số, kèm ghi chú khi trong đó có thẻ vị trí.',
      ],
      flowSteps: [
        {
          title: 'Tải ảnh lên',
          description: 'Thả vào một tệp JPG, PNG, WebP hoặc HEIC. Máy chủ chạy ExifTool hai lần (một lượt dạng dễ đọc và một lượt dạng số cho giá trị GPS và phơi sáng) rồi trả về báo cáo.',
        },
        {
          title: 'Đọc báo cáo',
          description: 'Các thẻ được nhóm theo danh mục; tọa độ GPS được đánh dấu trên bản đồ định vị để bạn thấy chính xác tệp đang để lộ những gì.',
        },
        {
          title: 'Xóa toàn bộ',
          description: 'Một cú nhấp sẽ lưu lại ảnh bằng ImageMagick và chạy exiftool -all= trên kết quả.',
        },
        {
          title: 'So sánh và tải xuống',
          description: 'Màn hình kết quả cho biết đã xóa bao nhiêu thẻ, cho phép so sánh song song hai báo cáo và trao cho bạn tệp sạch.',
        },
      ],
      advancedDetails: [
        'Lượt xử lý điểm ảnh dùng ImageMagick: convert <input> -auto-orient -quality 85 <output>, với định dạng chứa đầu ra giống đầu vào cho JPG, PNG, WebP, GIF và AVIF. HEIC, TIFF và BMP không giữ được định dạng chứa gốc trên trang này nên được trả về dưới dạng JPG.',
        'Lượt xử lý siêu dữ liệu là exiftool -overwrite_original -all= trên tệp đã chuyển đổi. -all= xóa mọi nhóm có thể ghi trong một lần: EXIF (IFD0, ExifIFD, GPS, InteropIFD), ảnh thu nhỏ IFD1, XMP, IPTC, Photoshop IRB, ICC_Profile, ghi chú của hãng và mọi phân đoạn APP mà ExifTool biết cách ghi. Các phân đoạn JFIF và Adobe APP14 mà bộ giải mã JPEG cần được giữ nguyên; chúng mô tả bố cục điểm ảnh, không phải về bạn.',
        'Vì ảnh được mã hóa lại, tệp JPG được ghi lại ở chất lượng 85 và tệp PNG được ghi lại không mất dữ liệu. Kết quả không phải là bản sao y từng byte chỉ khác ở chỗ đã cắt bỏ siêu dữ liệu.',
        'Báo cáo trước và sau là cùng loại MetadataDocument mà trình kiểm tra tạo ra: các mục theo khóa nhóm như GPS:GPSLatitude hoặc XMP-xmpMM:History, mỗi mục được phân loại theo một danh mục khoảng 1.800 thẻ vào 22 danh mục và bốn lớp quyền riêng tư (vị trí, danh tính, thiết bị, lịch sử).',
        'Số thẻ đã xóa không tính các dòng thay đổi sau mỗi lần chuyển đổi (tên tệp, kích thước, ngày sửa đổi, kiểu MIME, kích thước ảnh), nên con số phản ánh siêu dữ liệu thực sự bị loại bỏ chứ không phải thông tin quản lý tệp.',
        'Định dạng chứa video và âm thanh cũng có thể được xóa siêu dữ liệu, từ các trình chuyển đổi video và âm thanh: ffmpeg chạy với -map_metadata -1 -map_chapters -1, và với MP4, MOV, M4A và M4V còn có thêm một lượt exiftool -all= vì ffmpeg để sót khóa QuickTime và XMP.',
      ],
      whyItMatters: [
        'Thẻ GPS có thể quy ra một địa chỉ cụ thể. Ảnh một chiếc ghế sofa cần bán, đăng từ nhà, có thể cho người lạ biết chiếc sofa đó ở đâu.',
        'Thẻ thiết bị và số sê-ri liên kết các bức ảnh với nhau và với bạn. Hai ảnh có cùng BodySerialNumber được chụp bằng cùng một máy ảnh, bất kể tài khoản nào đã đăng chúng.',
        'Ảnh thu nhỏ IFD1 là bản sao của khung hình gốc. Hãy cắt bỏ một khuôn mặt hay một tài liệu khỏi ảnh, bản xem trước vẫn có thể hiển thị nó.',
        'Nhiều trang web xóa EXIF khi tải lên, nhưng cũng nhiều trang không làm vậy. Ứng dụng nhắn tin, tệp đính kèm email, liên kết chia sẻ đám mây và các sàn mua bán thường chuyển tiếp tệp nguyên trạng.',
      ],
      useCases: [
        {
          title: 'Tin đăng trên sàn mua bán và rao vặt',
          description: 'Xóa vị trí và thời gian chụp khỏi ảnh sản phẩm chụp tại nhà trước khi người mua nhìn thấy.',
        },
        {
          title: 'Ảnh chụp tài liệu',
          description: 'Ảnh chụp một biểu mẫu hay một lá thư cũng ghi lại thời điểm và địa điểm chụp; hãy xóa thông tin đó trước khi gửi đi.',
        },
        {
          title: 'Đăng ảnh từ một địa điểm nhạy cảm',
          description: 'Loại bỏ mã định danh thiết bị và tọa độ khỏi ảnh trước khi nó rời khỏi tầm kiểm soát của bạn, và xác minh qua phần so sánh rằng chúng đã biến mất.',
        },
        {
          title: 'Làm sạch ảnh đã chỉnh sửa',
          description: 'Trình chỉnh sửa ảnh thêm lịch sử XMP và giữ ảnh thu nhỏ gốc; hãy xóa cả hai để tệp chỉ thể hiện những gì bạn muốn.',
        },
      ],
      workedExamples: [
        {
          title: 'Ảnh JPEG 12 megapixel từ iPhone có GPS',
          body: 'Một ảnh JPEG 4032 x 3024 lấy thẳng từ iPhone 15 Pro, trong trường hợp điển hình, mang 5 thẻ IFD0 (hãng, mẫu máy, hướng xoay, phần mềm, ngày sửa đổi), 7 thẻ ExifIFD gồm cả số sê-ri thân máy và mẫu ống kính, 5 thẻ GPS, 4 mục XMP gồm cả lịch sử chỉnh sửa, 2 mục cấu hình ICC, 3 mục ảnh thu nhỏ IFD1 (khoảng 5 KB ảnh JPEG xem trước) và một mục GPSPosition suy ra. Màn hình kết quả báo đã xóa 27 thẻ, trong đó có vị trí: 27 thẻ đó là mọi mục trừ các dòng tên tệp, kích thước, ngày và loại tệp cùng kích thước ảnh, vốn có trên mọi tệp. Đầu ra là tệp JPG được mã hóa lại ở chất lượng 85 với hướng xoay đã được áp vào điểm ảnh; lần mã hóa lại quyết định kích thước cuối cùng. Tác vụ chỉ gồm một lần giải mã và mã hóa bằng ImageMagick cộng một lần ghi lại bằng ExifTool, nên hoàn tất trong vài giây, và thời gian dành cho điểm ảnh chứ không phải cho các thẻ.',
        },
        {
          title: 'Ảnh HEIC từ một chiếc điện thoại đời mới',
          body: 'HEIC không giữ được định dạng chứa gốc trên trang này, nên một ảnh HEIC 12 megapixel được ImageMagick giải mã và ghi thành JPG ở chất lượng 85, rồi được xóa siêu dữ liệu bằng exiftool -all=. Bạn mất định dạng chứa HEIC cùng cấu hình màu của nó, nhưng đổi lại có một tệp mà mọi trình duyệt và sàn mua bán đều chấp nhận. Tệp sẽ lớn hơn tệp HEIC bạn đã tải lên, vì lần mã hóa lại JPEG ở chất lượng 85 là bước nén duy nhất và nó quyết định kích thước. Báo cáo liệt kê ghi chú của hãng Apple và khối GPS ở bản trước, và ở bản sau chỉ còn các dòng về tệp và kích thước ảnh. Giải mã HEIC là bước chậm nhất; dù vậy, với một bức ảnh cũng chỉ mất vài giây.',
        },
      ],
      whenNotToUse: 'Đừng xóa siêu dữ liệu của ảnh mà bạn vẫn cần chỉnh sửa hoặc cần chứng minh nguồn gốc. Tệp RAW của máy ảnh không được chấp nhận ở đây, và dù sao cũng không nên xóa bằng -all=, vì ghi chú của hãng trong đó chứa dữ liệu mà trình chuyển đổi RAW cần. Nếu bạn muốn giữ thông báo bản quyền hoặc tiêu đề trong khi bỏ thẻ GPS và thẻ thiết bị, hãy dùng chế độ Siêu dữ liệu tùy chỉnh của trình chuyển đổi ảnh: chế độ này xóa mọi thứ rồi chỉ ghi lại những trường bạn điền. Và hãy nhớ rằng xóa siêu dữ liệu không xóa được những gì hiện trong ảnh: một biển tên đường, một hình phản chiếu hay một khuôn mặt vẫn cho biết bạn đã ở đâu; các công cụ làm mờ khuôn mặt và che văn bản sẽ xử lý những thứ đó.',
      whyMediaManipulator: [
        'Bạn thấy được bằng chứng. Trình kiểm tra liệt kê mọi thẻ trước khi xóa và phần so sánh chứng minh những gì đã bị loại bỏ sau đó, thay vì chỉ một dấu tích xanh và một lời hứa.',
        'Một lượt, mọi nhóm. ExifTool -all= xóa cùng lúc EXIF, GPS, XMP, IPTC, Photoshop, ICC, ghi chú của hãng và ảnh thu nhỏ xem trước; bạn không phải đánh dấu từng khối một.',
        'Hướng xoay được xử lý. Thẻ xoay được áp vào điểm ảnh trước khi bị xóa, nên ảnh điện thoại đã xóa siêu dữ liệu không bị nằm nghiêng ở nơi khác, điều thường xảy ra khi thẻ bị bỏ mà không xoay điểm ảnh.',
      ],
      privacyNote: 'Công cụ này xóa khỏi bản sao trả về các khối EXIF (hãng máy ảnh, mẫu máy, số sê-ri, ống kính, phơi sáng, ngày tháng), khối GPS, ảnh thu nhỏ xem trước IFD1, bản ghi XMP và IPTC, tài nguyên Photoshop, ghi chú của hãng và cấu hình ICC. Để làm vậy, máy chủ phải đọc chúng trước: tệp tải lên được kiểm tra bằng ExifTool và báo cáo được ghi vào thư mục tác vụ dưới tên metadata.json, và sau khi xóa, một báo cáo thứ hai về kết quả được lưu bên cạnh để chế độ So sánh hiển thị được sự khác biệt. Cả hai báo cáo và cả hai tệp nằm trong uploads/<jobId>/ và outputs/<jobId>/ và bị xóa cùng lúc khi hết thời hạn lưu. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Trình kiểm tra độc lập (đọc tệp mà không chuyển đổi) xóa bản sao tạm thời ngay khi báo cáo được tạo xong. Ảnh cũng đi qua một bước phân tích tự động trên máy chủ của chính chúng tôi; không có gì được gửi đến bên thứ ba.',
      faq: [
        {
          question: 'Chính xác những nhóm siêu dữ liệu nào bị xóa?',
          answer: 'Mọi thứ ExifTool có thể ghi: EXIF (IFD0, ExifIFD, InteropIFD), GPS IFD, ảnh thu nhỏ IFD1, XMP ở mọi không gian tên (xmp, dc, xmpMM, photoshop, v.v.), bản ghi IPTC IIM, khối tài nguyên Photoshop, ghi chú của hãng từ Apple, Canon, Nikon, Sony và các nhà sản xuất khác, cùng cấu hình màu ICC. Với PNG, điều đó bao gồm các chunk tEXt, iTXt, zTXt, eXIf và iCCP; với WebP là các chunk EXIF, XMP và ICCP.',
        },
        {
          question: 'Ảnh có bị mã hóa lại không?',
          answer: 'Có. Tệp đi qua ImageMagick (đồng thời áp thẻ hướng xoay vào điểm ảnh) trước khi ExifTool xóa các thẻ. Tệp JPG được ghi lại ở chất lượng 85, tệp PNG được ghi lại không mất dữ liệu, tệp WebP ở chất lượng 85. Ở kích thước xem thông thường, khó phân biệt bản JPG mã hóa lại với bản gốc bằng mắt, nhưng luồng bit không còn giống hệt.',
        },
        {
          question: 'Vì sao ảnh HEIC của tôi được trả về dưới dạng JPG?',
          answer: 'Chức năng xóa một cú nhấp giữ nguyên định dạng chứa cho JPG, PNG, WebP, GIF và AVIF. HEIC, TIFF và BMP được giải mã và ghi thành JPG để kết quả mở được ở mọi nơi. Nếu bạn cần nhận lại HEIC, hãy chuyển đổi trong trình chuyển đổi ảnh với siêu dữ liệu đặt ở chế độ Loại bỏ.',
        },
        {
          question: 'Cấu hình màu có bị xóa không, và điều đó có quan trọng không?',
          answer: 'Có, exiftool -all= xóa cấu hình ICC. Với ảnh sRGB tiêu chuẩn, không có gì thay đổi, vì trình xem mặc định coi là sRGB khi không có cấu hình. Với ảnh gam màu rộng Display P3 từ điện thoại đời mới, màu sắc có thể trông kém bão hòa hơn một chút trong phần mềm có tôn trọng cấu hình màu. Nếu điều đó quan trọng với bạn, hãy dùng chế độ Siêu dữ liệu tùy chỉnh của trình chuyển đổi ảnh và giữ lại cấu hình ở đó.',
        },
        {
          question: 'Tôi có thể giữ lại dòng bản quyền hoặc tiêu đề không?',
          answer: 'Không thể với chức năng xóa một cú nhấp, vì nó xóa mọi thứ. Phần siêu dữ liệu của trình chuyển đổi ảnh có chế độ Tùy chỉnh: xóa siêu dữ liệu của tệp rồi chỉ ghi lại những gì bạn nhập, gồm tiêu đề, tác giả, mô tả, bản quyền, bình luận, từ khóa và các trường EXIF hoặc GPS được chọn. Hãy dùng chế độ đó khi bạn muốn một tệp sạch mà vẫn ghi tên bạn.',
        },
        {
          question: 'Làm sao tôi biết là đã xóa thành công?',
          answer: 'Màn hình kết quả cho biết số thẻ đã xóa và đánh dấu khi trong đó có dữ liệu vị trí. Mở So sánh để xem đầy đủ trước và sau: đó chính là báo cáo ExifTool được chạy trên tệp đầu ra, nên nếu một dòng GPS hay số sê-ri còn sót, nó sẽ hiện ra ở đó.',
        },
        {
          question: 'Công cụ này có miễn phí không, và tôi có thể xóa siêu dữ liệu cho bao nhiêu ảnh?',
          answer: 'Có. Mỗi lần xóa là một lượt tải lên qua trình chuyển đổi tiêu chuẩn, nên được tính vào hạn mức tác vụ thường hằng ngày: mặc định 5 lượt mỗi ngày khi không có tài khoản với tệp tối đa 200 MB, 30 lượt mỗi ngày với tài khoản miễn phí và tệp tối đa 1 GB, 300 lượt với Premium và 700 lượt với Pro. Tác vụ thất bại được hoàn lại lượt. Các con số hiện hành có trên trang giá.',
        },
      ],
      related: [
        {
          label: 'Làm mờ khuôn mặt trong ảnh',
          to: '/tools/blur-faces-in-photo',
          description: 'Siêu dữ liệu chỉ là một nửa câu chuyện; hãy che cả những khuôn mặt hiện trong ảnh.',
        },
        {
          label: 'Che văn bản trong ảnh',
          to: '/tools/redact-text-in-image',
          description: 'Che đen tên, địa chỉ và các con số hiện trong ảnh.',
        },
        {
          label: 'Nén ảnh',
          to: '/tools/compress-image',
          description: 'Thu nhỏ ảnh đã làm sạch trước khi đăng.',
        },
        {
          label: 'Ảnh sang PDF',
          to: '/tools/image-to-pdf',
          description: 'Gộp các ảnh chụp tài liệu đã xóa siêu dữ liệu vào một tệp PDF.',
        },
        {
          label: 'Chính sách quyền riêng tư',
          to: '/privacy-policy',
          description: 'Cách tệp tải lên, báo cáo và kết quả được lưu trữ và xóa.',
        },
      ],
      embed: {
        title: 'Xóa siêu dữ liệu khỏi ảnh',
        description: 'Tải lên một ảnh JPG, PNG, WebP hoặc HEIC. Chúng tôi hiển thị mọi thẻ mà ảnh mang theo, sau đó bạn nhấn Xóa toàn bộ để loại bỏ tất cả và xem chính xác những gì đã bị xóa.',
      },
    },
    'compress-image': {
      name: 'Nén ảnh',
      h1: 'Nén ảnh trực tuyến miễn phí',
      tagline: 'Giảm dung lượng tệp JPG, PNG và WebP để trang web nhanh hơn, tải lên nhẹ hơn và chia sẻ dễ hơn.',
      metaTitle: 'Nén ảnh trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ nén ảnh trực tuyến miễn phí. Giảm dung lượng tệp JPG, PNG và WebP mà vẫn giữ chất lượng tốt. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Nén ảnh trực tuyến miễn phí',
      ogDescription: 'Giảm dung lượng tệp JPG, PNG và WebP mà vẫn giữ chất lượng tốt. Miễn phí, nhanh, không cần đăng ký.',
      intro: 'Nén ảnh nghĩa là mã hóa lại ảnh để cùng một hình ảnh chiếm ít byte hơn. Trang này mở bộ chuyển đổi ảnh với trường chất lượng đã đặt sẵn ở 80 và định dạng đầu ra khớp với tệp bạn tải lên, nên JPG vẫn là JPG và WebP vẫn là WebP. Trên máy chủ của chúng tôi, tác vụ chỉ là một lệnh ImageMagick: tệp được tự động xoay đúng hướng theo cờ xoay EXIF, rồi được ghi ra với -quality 80, hoặc bất kỳ số nào từ 1 đến 100 mà bạn nhập. Với JPG và WebP, chính con số đó quyết định dung lượng tệp. Với PNG, nó bị bỏ qua vì PNG không mất dữ liệu, nên cách thực sự để thu nhỏ một ảnh chụp dạng PNG là chuyển đầu ra sang JPG hoặc WebP.',
      whatItDoes: [
        'Mã hóa lại đầu ra JPG và WebP ở chất lượng bạn chọn; biểu mẫu bắt đầu ở mức 80.',
        'Giữ định dạng đầu vào trừ khi bạn thay đổi; chuyển ảnh chụp dạng PNG sang WebP hoặc JPG mới là cách tiết kiệm nhiều dung lượng cho PNG.',
        'Có thể giảm kích thước pixel trong cùng một lượt: chiều rộng hoặc chiều cao nhập vào các trường đổi kích thước được áp dụng trước thiết lập chất lượng, nên hai mức tiết kiệm cộng dồn với nhau.',
        'Sao chép lại các thẻ EXIF, IPTC và XMP gốc vào tệp đã nén trừ khi bạn đặt chế độ siêu dữ liệu là loại bỏ.',
        'Ghi kết quả thành converted.jpg, converted.webp hoặc converted.png trong thư mục đầu ra của tác vụ, cũng chính là tệp mà liên kết tải xuống cung cấp.',
      ],
      flowSteps: [
        {
          title: 'Tải lên JPG, PNG hoặc WebP',
          description: 'Bất kỳ tệp nào trong giới hạn mỗi tệp của gói bạn, mặc định 200 MB với khách.',
        },
        {
          title: 'Chọn mức chất lượng',
          description: 'Mặc định đặt sẵn 80. Từ 60 đến 75 nén mạnh hơn; từ 90 trở lên giữ lại gần như mọi thứ.',
        },
        {
          title: 'ImageMagick mã hóa lại',
          description: 'convert input -auto-orient -quality N output, sau đó một lượt exiftool sao chép các thẻ sang.',
        },
        {
          title: 'Tải xuống tệp nhỏ hơn',
          description: 'Đầu ra được cung cấp từ thư mục tác vụ cho đến khi hết thời gian lưu.',
        },
      ],
      advancedDetails: [
        'Lệnh chính xác là ImageMagick convert với đường dẫn đầu vào đứng trước, rồi -auto-orient, -crop và -resize tùy chọn, rồi -quality N, rồi đường dẫn đầu ra. Đối số -quality chỉ được thêm khi định dạng đầu ra là jpg, jpeg hoặc webp (convertImage trong converter.go).',
        'Chất lượng được máy chủ kiểm tra trong khoảng 1 đến 100; giá trị ngoài khoảng này bị từ chối trước khi bắt đầu xử lý, và lượt tác vụ được hoàn lại.',
        'Đầu ra PNG không bao giờ nhận đối số -quality, nên hạ con số với tác vụ PNG sang PNG chẳng thay đổi gì. Bộ chuyển đổi không chạy pngquant hay bất kỳ bước giảm bảng màu nào; để PNG nhỏ hơn, bạn phải đổi định dạng.',
        'Trong chế độ siêu dữ liệu mặc định, máy chủ chạy exiftool -TagsFromFile <original> -all:all -unsafe trên kết quả, nên các thẻ máy ảnh, ống kính, ngày chụp và GPS vẫn còn sau khi nén. Chọn chế độ loại bỏ thì máy chủ chạy exiftool -all= trên đầu ra.',
        'Nếu bạn đặt đổi kích thước, bước này diễn ra trước khi áp dụng chất lượng. Chỉ có chiều rộng thì giữ tỷ lệ khung hình; có cả chiều rộng và chiều cao thì ép đúng khung đó ngay cả khi tỷ lệ khác.',
        'Bộ lọc, tông màu và chữ phủ cũng có trong cùng biểu mẫu: bộ lọc được áp dụng ngay sau khi đổi kích thước, còn tông màu và chữ phủ được thêm sau cùng, sau thiết lập chất lượng.',
      ],
      whyItMatters: [
        'Dung lượng ảnh thường chiếm phần lớn nhất của một trang web hoặc email, nên giảm một nửa là cách tăng tốc rẻ nhất hiện có.',
        'Biểu mẫu tải lên, trường CMS và ứng dụng nhắn tin đặt giới hạn tính bằng megabyte, không phải bằng pixel.',
        'Tự mã hóa lại một lần ở chất lượng bạn chọn tốt hơn để nền tảng mã hóa lại theo cách riêng của họ.',
      ],
      useCases: [
        {
          title: 'Ảnh blog và ảnh sản phẩm',
          description: 'Đưa ảnh JPEG máy ảnh 4 đến 6 MB xuống dưới 1 MB một cách thoải mái trước khi đăng.',
        },
        {
          title: 'Tệp đính kèm email',
          description: 'Đưa một bộ ảnh xuống dưới giới hạn hộp thư 20 hoặc 25 MB.',
        },
        {
          title: 'Cổng nộp hồ sơ',
          description: 'Đáp ứng giới hạn 2 MB cho ảnh chân dung hoặc ảnh giấy tờ mà không thấy giảm chất lượng.',
        },
        {
          title: 'Bản sao làm việc',
          description: 'Giữ các bản sao nhỏ hơn để dùng hằng ngày trong khi bản gốc vẫn nằm trong kho lưu trữ.',
        },
      ],
      workedExamples: [
        {
          title: 'Ảnh JPEG điện thoại 4000 x 3000 ở chất lượng 80 với chiều rộng 1600 px',
          body: 'Đầu vào: một tệp JPEG 4,8 MB, 4000 x 3000 pixel, chụp thẳng từ camera điện thoại. Cài đặt: chiều rộng 1600, để trống chiều cao, chất lượng 80, giữ nguyên định dạng. ImageMagick chạy -resize 1600x, giữ tỷ lệ và tạo ra 1600 x 1200 pixel: 1,92 megapixel so với 12 của bản gốc, khoảng một phần sáu số pixel. Kết quả được ghi với -quality 80 và được sao chép lại EXIF, nên đầu ra là một ảnh JPG 1600 x 1200 có dung lượng giảm theo số pixel, khoảng một phần sáu bản gốc, tức là từ 4,8 MB bạn có thể kỳ vọng còn khoảng 1 MB hoặc ít hơn. Việc chuyển đổi là một lượt ImageMagick duy nhất trên ảnh 12 megapixel và mất vài giây; tải tệp 4,8 MB lên thường còn lâu hơn chuyển đổi nó.',
        },
        {
          title: 'Ảnh chụp màn hình PNG 2,6 MB chuyển sang WebP',
          body: 'Đầu vào: một ảnh chụp màn hình PNG 1920 x 1080, 2,6 MB, không có vùng trong suốt. Giữ định dạng PNG và hạ chất lượng xuống 60 sẽ chẳng thay đổi gì, vì -quality không được truyền cho đầu ra PNG. Chuyển đầu ra sang WebP ở mức đặt sẵn 80 sẽ chạy convert input -auto-orient -quality 80 converted.webp. Khi chưa nén, 2.073.600 pixel đó tương đương 6,2 MB dữ liệu RGB; WebP có mất dữ liệu ở chất lượng 80 chỉ giữ lại một phần nhỏ trong số đó, nên kết quả chỉ bằng một phần nhỏ của tệp PNG 2,6 MB, với con số chính xác tùy thuộc vào lượng màu phẳng và chữ trong ảnh chụp màn hình. Kích thước vẫn là 1920 x 1080 và tác vụ hoàn tất trong vài giây.',
        },
      ],
      whenNotToUse: 'Đừng dùng nén có mất dữ liệu cho ảnh bạn vẫn định chỉnh sửa nhiều, cho tệp PNG mà bạn cần giữ độ trong suốt ở dạng PNG (chuyển sang JPG sẽ làm phẳng kênh alpha), hoặc cho ảnh chụp màn hình chứa chữ nhỏ, nơi chất lượng thấp hơn 85 nhiều khiến chữ bị nhòe. Nếu tệp lớn chỉ vì kích thước pixel, công cụ đổi kích thước ảnh là bước đầu tiên tốt hơn; nếu mục tiêu của bạn là quyền riêng tư chứ không phải dung lượng, công cụ xóa EXIF loại bỏ các thẻ mà không động đến pixel. Và một ảnh JPG đã được lưu ở chất lượng 70 sẽ không nhỏ đi bao nhiêu ở mức 80; mỗi lần lưu lại chỉ thêm mất mát mà không đem lại lợi ích tương xứng.',
      whyMediaManipulator: [
        'Lệnh thực sự được chạy được ghi rõ trên trang này, kể cả việc PNG bỏ qua con số chất lượng, nên bạn không phải đoán vì sao một tệp không nhỏ đi.',
        'Các tùy chọn chất lượng, đổi kích thước, định dạng và siêu dữ liệu nằm trong một biểu mẫu và một lần tải lên, và không có hình mờ nào được thêm vào.',
        'Không cần cài đặt gì và không cần tài khoản với công cụ tiêu chuẩn. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Ảnh của bạn được lưu trong uploads/<jobId>/ trên máy chủ riêng của chúng tôi, ImageMagick ghi bản đã nén vào outputs/<jobId>/, và một báo cáo siêu dữ liệu của bản gốc được ghi bên cạnh. Trong chế độ mặc định, exiftool sao chép các thẻ EXIF, IPTC và XMP gốc sang tệp đã nén, nên dữ liệu vị trí và máy ảnh đi kèm kết quả trừ khi bạn chọn tùy chọn loại bỏ. Mọi ảnh tải lên cũng được chuyển qua bước phân tích tự động do một mô hình thị giác chạy trên cùng máy chủ thực hiện, và bản tóm tắt JSON của bước này được lưu cùng tác vụ. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Không có gì được gửi đến dịch vụ bên thứ ba.',
      faq: [
        {
          question: 'Nén ảnh ở đây có miễn phí không?',
          answer: 'Có, với công cụ tiêu chuẩn. Mỗi lần nén dùng một tác vụ thường trong ngày: mặc định khách có 5 tác vụ mỗi ngày với giới hạn 200 MB mỗi tệp, tài khoản miễn phí nâng lên 30 tác vụ mỗi ngày và 1 GB mỗi tệp, còn Premium và Pro lên 300 và 700. Các con số hiện hành có trên /pricing, vì giới hạn có thể thay đổi.',
        },
        {
          question: 'Tôi nên dùng mức chất lượng nào?',
          answer: '80 là mức đặt sẵn và là mặc định hợp lý cho ảnh chụp. Chỉ hạ thấp hơn khi bị buộc bởi giới hạn dung lượng nghiêm ngặt, và dùng từ 90 trở lên cho ảnh sẽ được in hoặc cắt sau này. Con số này được truyền thẳng vào tùy chọn -quality của ImageMagick, nên nó có cùng ý nghĩa như trong các công cụ khác xây dựng trên ImageMagick.',
        },
        {
          question: 'Tại sao PNG của tôi không nhỏ đi?',
          answer: 'Vì trường chất lượng không có tác dụng với đầu ra PNG: máy chủ chỉ thêm -quality cho jpg, jpeg và webp. Hãy đổi định dạng đầu ra sang WebP hoặc JPG. Nếu cần giữ độ trong suốt, WebP giữ được kênh alpha còn JPG thì không.',
        },
        {
          question: 'Nén có giữ dữ liệu EXIF và GPS của tôi không?',
          answer: 'Theo mặc định là có. Sau khi ImageMagick ghi tệp, exiftool sao chép mọi nhóm thẻ từ bản gốc sang kết quả. Hãy chọn chế độ loại bỏ trong phần siêu dữ liệu để xóa toàn bộ, hoặc dùng công cụ xóa EXIF chuyên dụng.',
        },
        {
          question: 'Ảnh có bị đổi kích thước luôn không?',
          answer: 'Không, trừ khi bạn nhập chiều rộng hoặc chiều cao. Khi cả hai trường để trống, kích thước pixel không đổi và chỉ cách mã hóa thay đổi.',
        },
        {
          question: 'Tôi có thể nén nhiều ảnh cùng lúc không?',
          answer: 'Mỗi lần tải lên là một lượt xử lý với một tệp đầu ra. Hãy chạy công cụ một lần cho mỗi ảnh; mỗi lượt được tính là một tác vụ thường trong hạn mức hằng ngày.',
        },
        {
          question: 'WebP có luôn nhỏ hơn JPG ở cùng chất lượng không?',
          answer: 'Thường là vậy với ảnh chụp, nhưng thang chất lượng của hai bộ mã hóa không giống hệt nhau, nên hãy so sánh hai kết quả thay vì mặc định như vậy. Hãy giữ JPG khi tệp phải mở được trong phần mềm ra đời trước khi có hỗ trợ WebP.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Giảm chất lượng có tác dụng với đầu ra JPG và WebP. Để thu nhỏ đáng kể một ảnh chụp dạng PNG, hãy chuyển sang JPG hoặc WebP.',
        ],
      },
      related: [
        {
          label: 'Đổi kích thước ảnh',
          to: '/tools/image-resizer',
          description: 'Giảm kích thước pixel trước để tiết kiệm nhiều nhất.',
        },
        {
          label: 'Xóa siêu dữ liệu EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Loại bỏ thẻ vị trí và máy ảnh mà không mã hóa lại.',
        },
        {
          label: 'Ảnh sang PDF',
          to: '/tools/image-to-pdf',
          description: 'Đặt ảnh JPG đã nén vào một tệp PDF một trang.',
        },
        {
          label: 'Nâng độ phân giải ảnh bằng AI',
          to: '/tools/ai-image-upscaler',
          description: 'Làm điều ngược lại và phóng to một ảnh nhỏ.',
        },
        {
          label: 'Hướng dẫn bộ chuyển đổi ảnh',
          to: '/tutorials/image/getting-started',
          description: 'Tìm hiểu các cài đặt chất lượng, đổi kích thước và định dạng.',
        },
      ],
      embed: {
        title: 'Nén ảnh',
        description: 'Tải ảnh lên và hạ thanh trượt chất lượng để thu nhỏ tệp. Định dạng đầu ra mặc định giữ nguyên, hoặc chuyển sang WebP để có dung lượng nhỏ nhất. Chất lượng khoảng 75–85 là mức cân bằng tốt.',
      },
    },
    'image-resizer': {
      name: 'Đổi kích thước ảnh',
      h1: 'Đổi kích thước ảnh trực tuyến miễn phí',
      tagline: 'Đổi kích thước ảnh JPG, PNG, WebP và GIF về số điểm ảnh chính xác mà vẫn giữ tỷ lệ khung hình.',
      metaTitle: 'Đổi kích thước ảnh trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ đổi kích thước ảnh trực tuyến miễn phí. Đổi kích thước ảnh JPG, PNG, WebP và GIF về số điểm ảnh chính xác mà vẫn giữ tỷ lệ khung hình. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Đổi kích thước ảnh trực tuyến miễn phí',
      ogDescription: 'Đổi kích thước ảnh JPG, PNG, WebP và GIF về đúng số pixel bạn cần. Miễn phí, nhanh, không cần đăng ký.',
      intro: 'Trang này mở bộ chuyển đổi ảnh với các trường đổi kích thước ở ngay phía trước. Nhập chiều rộng, chiều cao hoặc cả hai, và máy chủ chạy ImageMagick với đối số -resize được tạo từ đúng những gì bạn nhập: 1600x khi chỉ có chiều rộng, x900 khi chỉ có chiều cao, và 1600x900! khi bạn điền cả hai. Dấu chấm than ở cuối rất quan trọng: nó yêu cầu ImageMagick tạo ra đúng khung kích thước đó ngay cả khi tỷ lệ khác với ảnh gốc, khiến ảnh bị kéo giãn. Vì vậy quy tắc rất đơn giản. Một trường thì giữ tỷ lệ; hai trường cho bạn kích thước chính xác và tin rằng bạn đã chọn tỷ lệ phù hợp hoặc đã cắt ảnh trước.',
      whatItDoes: [
        'Co giãn ảnh JPG, PNG, WebP và GIF về chiều rộng và chiều cao (tính bằng pixel) bạn nhập, sau khi tự động xoay đúng hướng theo cờ xoay EXIF.',
        'Giữ tỷ lệ khung hình khi chỉ điền một chiều; ép đúng khung kích thước khi điền cả hai.',
        'Cung cấp khung cắt ngay trong cùng biểu mẫu, được áp dụng trước khi đổi kích thước; đó là cách tạo ảnh vuông hoặc banner chính xác mà không bị méo.',
        'Mặc định ghi đầu ra theo định dạng gốc, với chất lượng 85 cho JPG và WebP, và sao chép các thẻ siêu dữ liệu gốc sang tệp đó.',
        'Giới hạn chiều cao yêu cầu theo giới hạn đầu ra của gói bạn, và giới hạn kích thước theo mức ImageMagick được phép tạo ra.',
      ],
      flowSteps: [
        {
          title: 'Tải ảnh lên',
          description: 'JPG, PNG, WebP hoặc GIF, trong giới hạn mỗi tệp của gói bạn.',
        },
        {
          title: 'Nhập chiều rộng, chiều cao hoặc cả hai',
          description: 'Một giá trị giữ tỷ lệ. Hai giá trị ép đúng khung. Hãy cắt trước nếu cần đổi tỷ lệ.',
        },
        {
          title: 'ImageMagick đổi kích thước',
          description: 'convert input -auto-orient [-crop WxH+X+Y] -resize <arg> [-quality 85] output.',
        },
        {
          title: 'Tải xuống',
          description: 'Tệp đã đổi kích thước được cung cấp từ thư mục đầu ra của tác vụ dưới tên converted.<format>.',
        },
      ],
      advancedDetails: [
        'Đối số đổi kích thước được tạo trong convertImage (converter.go): có cả hai giá trị thì thành WxH! (ép chính xác), chỉ có chiều rộng thì thành Wx, chỉ có chiều cao thì thành xH. Bộ lọc lấy mẫu lại mặc định của ImageMagick được sử dụng; không có tùy chọn để chọn bộ lọc khác.',
        'Vùng cắt, khi được đặt, được truyền dưới dạng -crop WxH+X+Y và chạy trước -resize, nên tọa độ cắt tính theo ảnh gốc đã được tự động xoay hướng, không phải theo kết quả đã đổi kích thước.',
        'Máy chủ từ chối chiều rộng hoặc chiều cao lớn hơn 10000 hoặc nhỏ hơn 1, và biểu mẫu giới hạn cả hai trường ở 4096.',
        'Chiều cao được nhập cụ thể cũng được kiểm tra với giới hạn chiều cao đầu ra của gói bạn trước khi tệp tải lên được chấp nhận: mặc định 1080 px với khách, 1440 với tài khoản miễn phí, 2160 với Premium và Pro. Yêu cầu vượt giới hạn bị từ chối kèm thông báo nêu cả hai con số và không bị tính tác vụ nào. Riêng chiều rộng thì không được kiểm tra.',
        'Đầu ra JPG và WebP nhận -quality 85 trừ khi bạn đổi con số; PNG và GIF bỏ qua giá trị này. Phóng to bằng công cụ này chỉ nội suy các pixel có sẵn, nên ảnh phóng to 2x hoặc 4x trông mềm nhòe; công cụ nâng độ phân giải bằng AI dành cho trường hợp đó.',
        'Sau khi ImageMagick hoàn tất, exiftool sao chép các thẻ gốc sang kết quả trong chế độ siêu dữ liệu mặc định, nên tệp đã đổi kích thước vẫn mang ngày chụp, mẫu máy ảnh và mọi vị trí GPS.',
      ],
      whyItMatters: [
        'Ô ảnh đại diện, ảnh bìa và ảnh thu nhỏ cần kích thước pixel cụ thể, và việc đổi kích thước do nền tảng tự làm thường cho chất lượng thấp hơn và không kiểm soát được.',
        'Số pixel là yếu tố lớn nhất quyết định dung lượng tệp; một ảnh 24 megapixel hiển thị ở chiều rộng 1920 px chứa lượng dữ liệu gấp mười lần những gì màn hình có thể hiển thị.',
        'Tự đổi kích thước theo ý mình còn cho phép bạn chọn vùng cắt, thay vì để một ô vuông cắt mất đầu người trong ảnh.',
      ],
      useCases: [
        {
          title: 'Ảnh hồ sơ và ảnh đại diện',
          description: 'Cắt thành hình vuông, rồi đổi kích thước về 400 hoặc 512 px theo yêu cầu của dịch vụ.',
        },
        {
          title: 'Ảnh cho web và blog',
          description: 'Thu ảnh máy ảnh về đúng chiều rộng cột mà ảnh thực sự được hiển thị.',
        },
        {
          title: 'Banner và ảnh đầu trang',
          description: 'Cắt đúng tỷ lệ khung hình, rồi đạt chiều rộng yêu cầu chính xác đến từng pixel.',
        },
        {
          title: 'Giới hạn tải lên của biểu mẫu',
          description: 'Giảm kích thước để xuống dưới giới hạn tính bằng megapixel hoặc megabyte.',
        },
      ],
      workedExamples: [
        {
          title: 'Ảnh JPEG máy ảnh 6000 x 4000 thu về chiều rộng 1920 px',
          body: 'Đầu vào: một tệp JPEG 24 megapixel, 8,5 MB, từ máy ảnh không gương lật. Cài đặt: chiều rộng 1920, để trống chiều cao, giữ nguyên định dạng, chất lượng 85. Máy chủ chạy convert input -auto-orient -resize 1920x -quality 85 converted.jpg. Tỷ lệ là 3:2, nên đầu ra là 1920 x 1280 pixel, khoảng 2,46 megapixel, xấp xỉ một phần mười số pixel gốc. Dung lượng tệp giảm theo tỷ lệ tương tự, nên bạn có thể kỳ vọng dưới 1 MB. Một lượt ImageMagick trên 24 megapixel mất vài giây trên máy chủ, và bước sao chép bằng exiftool sau đó giữ lại các thẻ ống kính và phơi sáng.',
        },
        {
          title: 'Ảnh đại diện 400 x 400 từ ảnh điện thoại dọc 3024 x 4032',
          body: 'Đầu vào: một tệp JPEG dọc 3,1 MB, rộng 3024, cao 4032. Chỉ nhập 400 và 400 sẽ chạy -resize 400x400! và ép bức ảnh 3:4 thành hình vuông. Thay vào đó, hãy đặt vùng cắt 3024 x 3024 tại vị trí 0,504 (một hình vuông ở giữa), rồi đặt chiều rộng 400 và chiều cao 400. Lệnh trở thành convert input -auto-orient -crop 3024x3024+0+504 -resize 400x400! -quality 85 converted.jpg, và kết quả là một ảnh JPG 400 x 400 không bị méo, gồm 160.000 pixel, dung lượng vài chục kilobyte. Cắt và đổi kích thước diễn ra trong một lượt và hoàn tất trong vài giây.',
        },
      ],
      whenNotToUse: 'Đừng dùng công cụ đổi kích thước để phóng to ảnh nhỏ: ImageMagick chỉ nội suy các pixel có sẵn, nên một ảnh 640 px bị kéo lên 2560 px sẽ bị mờ, và trường hợp đó thuộc về công cụ nâng độ phân giải bằng AI. Đừng nhập cả chiều rộng và chiều cao có tỷ lệ khác với ảnh trừ khi bạn đã cắt trước, vì chế độ ép đúng khung sẽ kéo giãn ảnh thay vì thêm viền đen. Nếu tệp lớn nhưng kích thước đã đúng, hãy dùng công cụ nén và để nguyên các pixel. Còn GIF động thì nên xử lý bằng công cụ GIF chuyên dụng thay vì chỉ đổi kích thước đơn thuần.',
      whyMediaManipulator: [
        'Sự khác biệt giữa ép đúng khung và giữ tỷ lệ được giải thích rõ tại đây với các đối số ImageMagick thực tế, nên bạn sẽ không bất ngờ khi ảnh trả về bị kéo giãn.',
        'Cắt, đổi kích thước, định dạng và chất lượng nằm trong một lần tải lên, và đầu ra không có hình mờ.',
        'Không cần đăng ký với công cụ tiêu chuẩn. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Ảnh tải lên được lưu trong uploads/<jobId>/ trên máy chủ của chúng tôi và bản đã đổi kích thước trong outputs/<jobId>/; cả hai thư mục đều nằm trong sổ theo dõi thời gian lưu và được xóa cùng lúc. Vì chế độ siêu dữ liệu mặc định dùng exiftool để sao chép các thẻ gốc sang tệp đã đổi kích thước, tọa độ GPS và số sê-ri máy ảnh sẽ đi kèm kết quả trừ khi bạn chọn Loại bỏ toàn bộ siêu dữ liệu trong phần siêu dữ liệu của biểu mẫu. Ảnh tải lên để đổi kích thước cũng đi qua bước phân tích tự động áp dụng cho mọi ảnh trên máy chủ của chúng tôi, dùng một mô hình thị giác chạy cục bộ, và bản tóm tắt được lưu trong thư mục tác vụ. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Không có bên thứ ba nào nhận được tệp.',
      faq: [
        {
          question: 'Đổi kích thước có tốn phí không?',
          answer: 'Không cần tài khoản và không phải trả phí với công cụ tiêu chuẩn. Mỗi lần đổi kích thước là một tác vụ thường trong ngày: mặc định 5 tác vụ mỗi ngày với khách và 30 với tài khoản miễn phí, với giới hạn mỗi tệp lần lượt là 200 MB và 1 GB. Premium và Pro nâng số lượng lên 300 và 700. Xem /pricing để biết các con số đang áp dụng hiện nay.',
        },
        {
          question: 'Làm sao để giữ tỷ lệ khung hình?',
          answer: 'Chỉ điền một trong hai trường. Nếu chỉ có chiều rộng, giá trị sẽ thành -resize 1600x và chiều cao được tính từ tỷ lệ gốc; nếu chỉ có chiều cao, giá trị sẽ thành x900 và chiều rộng được tính theo.',
        },
        {
          question: 'Tại sao ảnh của tôi bị kéo giãn?',
          answer: 'Bạn đã điền cả chiều rộng và chiều cao với tỷ lệ không khớp với ảnh. Hai giá trị được gửi dưới dạng WxH!, buộc ảnh vào đúng khung kích thước đó. Hãy cắt về tỷ lệ mục tiêu trước, ngay trong cùng biểu mẫu, rồi mới đặt cả hai giá trị.',
        },
        {
          question: 'Kích thước lớn nhất tôi có thể yêu cầu là bao nhiêu?',
          answer: 'Biểu mẫu chấp nhận tối đa 4096 cho mỗi trường và máy chủ tối đa 10000. Chiều cao được nhập cụ thể vượt giới hạn đầu ra của gói bạn (mặc định 1080 px với khách) bị từ chối trước khi quá trình tải lên bắt đầu và không tốn gì.',
        },
        {
          question: 'Tôi có thể phóng to ảnh nhỏ bằng công cụ này không?',
          answer: 'Bạn có thể nhập số lớn hơn, nhưng ImageMagick chỉ nội suy, nên kết quả bị mềm nhòe. Để phóng to 2x hoặc 4x mà tái tạo được chi tiết, hãy dùng công cụ nâng độ phân giải bằng AI, vốn chạy Real-ESRGAN.',
        },
        {
          question: 'Đầu ra có giữ dữ liệu EXIF và hướng ảnh của tôi không?',
          answer: 'Các pixel được tự động xoay đúng hướng trước, nên kết quả hiển thị thẳng đứng ở mọi nơi, và trong chế độ mặc định exiftool sao chép lại các thẻ gốc vào đó. Hãy chọn chế độ loại bỏ nếu bạn muốn xóa các thẻ.',
        },
        {
          question: 'Tôi có thể đổi kích thước GIF không?',
          answer: 'GIF được chấp nhận làm đầu vào lẫn đầu ra, và đi qua cùng lệnh ImageMagick. Công cụ được thiết kế cho ảnh tĩnh; với GIF động, một công cụ GIF chuyên dụng cho bạn kiểm soát khung hình và bảng màu tốt hơn.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Để trống một chiều để co giãn theo tỷ lệ và giữ nguyên tỷ lệ khung hình.',
        ],
      },
      related: [
        {
          label: 'Nén ảnh',
          to: '/tools/compress-image',
          description: 'Giảm chất lượng mà không đổi kích thước.',
        },
        {
          label: 'Nâng độ phân giải ảnh bằng AI',
          to: '/tools/ai-image-upscaler',
          description: 'Phóng to 2x hoặc 4x bằng mô hình AI thay vì nội suy.',
        },
        {
          label: 'Xóa siêu dữ liệu EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Bỏ các thẻ mà thao tác đổi kích thước giữ lại theo mặc định.',
        },
        {
          label: 'Ảnh sang PDF',
          to: '/tools/image-to-pdf',
          description: 'Đặt ảnh đã đổi kích thước vào một trang PDF.',
        },
        {
          label: 'Hướng dẫn bộ chuyển đổi ảnh',
          to: '/tutorials/image/getting-started',
          description: 'Tìm hiểu các cài đặt đổi kích thước, cắt và chất lượng.',
        },
      ],
      embed: {
        title: 'Đổi kích thước ảnh',
        description: 'Tải ảnh lên và đặt chiều rộng và/hoặc chiều cao mục tiêu bên dưới. Để trống một trường để co giãn theo tỷ lệ và giữ nguyên tỷ lệ khung hình gốc. Định dạng đầu ra giữ nguyên trừ khi bạn thay đổi.',
      },
    },
    'remove-background-from-image': {
      name: 'Xóa nền ảnh',
      h1: 'Xóa nền ảnh trực tuyến miễn phí',
      tagline: 'Tự động xóa nền của mọi bức ảnh và tải về ảnh cắt PNG trong suốt, sạch sẽ.',
      metaTitle: 'Xóa nền ảnh trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ xóa nền ảnh trực tuyến miễn phí. Tự động xóa nền của mọi bức ảnh và tải về PNG trong suốt. Chạy trên GPU của chúng tôi, không dùng AI của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Xóa nền ảnh trực tuyến miễn phí',
      ogDescription: 'Tự động xóa nền của mọi bức ảnh và tải về ảnh cắt PNG trong suốt. Miễn phí, không cần đăng ký.',
      intro: 'Trang này mở bộ chuyển đổi ảnh với thao tác AI được khóa ở Xóa nền và đầu ra được khóa ở PNG. Khi bạn chuyển đổi, máy chủ giao tệp của bạn cho rembg, một công cụ phân đoạn mã nguồn mở, chạy trên GPU do chúng tôi sở hữu: theo mặc định, nó tải mô hình BiRefNet General, dự đoán điểm ảnh nào thuộc về chủ thể và ghi ra một tệp PNG có kênh alpha trong suốt ở mọi chỗ còn lại. Biểu mẫu còn cho chọn sáu mô hình khác (một bản BiRefNet nhẹ hơn, một biến thể chân dung, ISNet và ba bản dựng U2Net) cho những trường hợp mô hình tổng quát xử lý sai tóc, đồ thủy tinh hoặc người đứng trước phông nền rối mắt.',
      whatItDoes: [
        'Chạy rembg với mô hình bạn chọn (BiRefNet General nếu bạn không đổi) và trả về chủ thể trên nền trong suốt.',
        'Luôn ghi ra PNG, vì độ trong suốt cần kênh alpha và API bắt buộc phần mở rộng .png cho thao tác này.',
        'Giữ nguyên kích thước điểm ảnh đầy đủ của tệp tải lên; ảnh cắt không bị đổi kích thước hay cắt xén.',
        'Thực thi trên GPU của chính chúng tôi qua ONNX Runtime với CUDA; không có ảnh nào được gửi đến dịch vụ AI bên ngoài.',
        'Được tính là một tác vụ thường, cùng đơn vị với một lần chuyển đổi định dạng thông thường, không phải tác vụ AI.',
      ],
      flowSteps: [
        {
          title: 'Tải lên JPG, PNG hoặc WebP',
          description: 'Một chủ thể duy nhất, rõ ràng cho mặt nạ sạch nhất.',
        },
        {
          title: 'Chọn mô hình hoặc giữ mặc định',
          description: 'BiRefNet General được chọn sẵn; các mô hình chân dung và phân đoạn người dành cho ảnh có người.',
        },
        {
          title: 'rembg phân đoạn trên GPU',
          description: 'Lệnh rembg i -m <model> input output.png chạy sau khi môi trường CUDA của ONNX Runtime được nạp.',
        },
        {
          title: 'Tải xuống PNG trong suốt',
          description: 'Kết quả là converted.png trong thư mục đầu ra của tác vụ.',
        },
      ],
      advancedDetails: [
        'Lời gọi là RemoveBackground trong ai_tools.go: một shell bash nạp script môi trường CUDA của ONNX Runtime, đặt U2NET_HOME thành thư mục mô hình trên máy chủ và chạy rembg i -m <model> <input> <output>. Trọng số mô hình được lưu đệm trên máy chủ, nên tác vụ đầu tiên sau khi khởi động lại có thể lâu hơn một chút trong lúc chúng được tải.',
        'Các tên mô hình được chấp nhận là birefnet-general, birefnet-general-lite, isnet-general-use, u2net, u2netp, u2net_human_seg và birefnet-portrait; mọi giá trị khác đều bị từ chối trước khi tác vụ bắt đầu. Giá trị trống sẽ thành birefnet-general.',
        'Nhánh AI thay thế hoàn toàn quy trình ImageMagick, nên số chất lượng, bộ lọc, màu phủ, chữ phủ và các tùy chọn siêu dữ liệu trong biểu mẫu không có tác dụng với thao tác này; đầu ra chính là những gì rembg ghi ra.',
        'Vì bước sao chép bằng exiftool thông thường không chạy với các thao tác AI, tệp PNG không mang EXIF nào từ ảnh gốc. Nếu bạn cần các thẻ đó trên ảnh cắt, trình chỉnh sửa siêu dữ liệu có thể thêm chúng trong một tác vụ thứ hai.',
        'Dung lượng đầu ra phụ thuộc vào chủ thể: các vùng hoàn toàn trong suốt nén gần như về không trong PNG, nên một sản phẩm nhỏ trên khung lớn cho tệp nhỏ, còn chủ thể chiếm trọn khung hình cho tệp gần bằng một bản PNG không mất dữ liệu của ảnh gốc.',
      ],
      whyItMatters: [
        'Tin đăng sản phẩm, ảnh thu nhỏ và ảnh ghép đều bắt đầu từ một ảnh cắt, và tạo mặt nạ thủ công mất vài phút cho mỗi ảnh.',
        'Các sàn thương mại điện tử ngày càng yêu cầu nền trơn hoặc nền trắng, tức là một ảnh cắt trong suốt đặt trên một lớp trắng.',
        'Một mô hình được huấn luyện trên hàng triệu mặt nạ xử lý lông, tóc và các mép bán trong suốt tốt hơn công cụ chọn kiểu đũa thần.',
      ],
      useCases: [
        {
          title: 'Sản phẩm thương mại điện tử',
          description: 'Tách riêng món hàng và đặt lên nền trắng hoặc bất kỳ màu thương hiệu nào.',
        },
        {
          title: 'Ảnh chân dung và trang đội ngũ',
          description: 'Dùng mô hình chân dung để tách người khỏi phông nền văn phòng một cách gọn gàng.',
        },
        {
          title: 'Logo lấy từ ảnh chụp',
          description: 'Có được phiên bản trong suốt của một logo chỉ tồn tại trên biển hiệu hoặc trang giấy có màu.',
        },
        {
          title: 'Ảnh thu nhỏ và nhãn dán',
          description: 'Dựng thiết kế nhiều lớp từ nhiều ảnh cắt trong trình chỉnh sửa của bạn.',
        },
      ],
      workedExamples: [
        {
          title: 'Ảnh JPEG sản phẩm 3000 x 2000 với mô hình mặc định',
          body: 'Đầu vào: một tệp JPEG 2,1 MB, 3000 x 2000, chụp một chiếc giày trên phông xám. Mô hình để nguyên BiRefNet General. Máy chủ chạy rembg trên GPU và ghi ra converted.png với cùng kích thước 3000 x 2000 điểm ảnh, bốn kênh. Khi chưa nén, đó là 24 MB dữ liệu RGBA, nhưng phông nền trong suốt nén gần như về không, nên dung lượng PNG do chính chiếc giày quyết định, thường là vài megabyte vì PNG không mất dữ liệu. Thời gian xử lý là một lượt suy luận của mô hình trên ảnh cộng với việc mã hóa PNG, vài giây khi mô hình đã sẵn sàng; lần chạy đầu tiên sau một khoảng thời gian không hoạt động cộng thêm thời gian tải trọng số.',
        },
        {
          title: 'Ảnh chân dung 1080 x 1080 với mô hình chân dung',
          body: 'Đầu vào: một ảnh selfie WebP 640 KB, 1080 x 1080, chụp trước kệ sách. Chuyển mô hình sang BiRefNet Portrait, được tinh chỉnh cho người và tóc. Đầu ra là một tệp PNG 1080 x 1080 với người hiện rõ hoàn toàn và các kệ sách hoàn toàn trong suốt. Với 1,17 megapixel, lượt chạy mô hình diễn ra nhanh; phần lớn thời gian thực tế là việc tải lên và ghi PNG. Vì nhánh AI bỏ qua bước sao chép siêu dữ liệu, tệp PNG không có EXIF, thường là điều bạn muốn cho ảnh hồ sơ.',
        },
      ],
      whenNotToUse: 'Đừng dùng công cụ này khi chủ thể không phải là một vật riêng biệt duy nhất: một đám đông, một phong cảnh, một họa tiết hay một không gian nội thất không có tiền cảnh rõ ràng khiến mô hình không có gì để tách, và mặt nạ sẽ tùy tiện. Đây cũng là công cụ không phù hợp khi bạn muốn làm mờ nhẹ phía sau chủ thể thay vì làm trong suốt, khi bạn cần kết quả ở dạng JPG (JPG không chứa được kênh alpha, nên bạn sẽ phải làm phẳng ảnh sau đó), và khi đầu vào là ảnh chụp màn hình hoặc hình vẽ nét, nơi ISNet hoặc thao tác chọn thủ công trong trình chỉnh sửa hiệu quả hơn một mô hình được huấn luyện trên ảnh chụp.',
      whyMediaManipulator: [
        'Bảy mô hình phân đoạn thực thụ được hiển thị theo tên, nên bạn có thể chuyển từ mô hình tổng quát sang bản chân dung hoặc bản U2Net khi một đường viền ra sai.',
        'Đầu ra là một tệp PNG trong suốt thuần túy ở độ phân giải đầy đủ, không hình mờ và không bị ép giảm kích thước.',
        'Mô hình chạy trên phần cứng do chúng tôi vận hành, và công cụ tiêu chuẩn không cần tài khoản. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Ảnh của bạn được ghi vào uploads/<jobId>/ trên máy chủ của chúng tôi và được rembg đọc, chạy trên GPU trong cùng máy; ảnh cắt được ghi vào outputs/<jobId>/converted.png. Không có API bên ngoài nào được gọi để phân đoạn và không có gì từ ảnh của bạn được dùng để huấn luyện bất cứ thứ gì. Như mọi ảnh tải lên, tệp cũng được kiểm tra một lần bởi một bước phân tích tự động dùng mô hình thị giác chạy trên máy chủ của chúng tôi, và bản tóm tắt đó được lưu cùng tác vụ. Tệp PNG không mang EXIF từ ảnh gốc vì bước sao chép siêu dữ liệu không chạy với các thao tác AI. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Xóa nền có miễn phí không?',
          answer: 'Có, trong hạn mức hằng ngày. Xóa nền được chủ ý tính là một tác vụ thường, không tính vào hạn mức tác vụ AI riêng: theo mặc định là 5 tác vụ mỗi ngày với khách và 30 với tài khoản miễn phí, với giới hạn mỗi tệp là 200 MB và 1 GB. Premium và Pro được 300 và 700. Các con số hiện hành có trên /pricing.',
        },
        {
          question: 'Tôi nên chọn mô hình nào?',
          answer: 'Giữ BiRefNet General cho đồ vật, sản phẩm và hầu hết ảnh chụp. Chọn BiRefNet Portrait hoặc U2Net Human Segmentation cho ảnh người, và BiRefNet General Lite hoặc U2Net Lite khi bạn muốn xử lý nhanh hơn trên ảnh lớn.',
        },
        {
          question: 'Vì sao đầu ra luôn là PNG?',
          answer: 'API bắt buộc phần mở rộng .png cho thao tác này vì ảnh cắt cần kênh alpha; JPG không có kênh này và sẽ hiển thị nền thành màu đen hoặc trắng. Hãy chuyển sang định dạng khác sau đó nếu bạn đã làm phẳng ảnh lên một nền màu.',
        },
        {
          question: 'Tôi có thể nhận nền trắng thay vì nền trong suốt không?',
          answer: 'Không trực tiếp từ công cụ này. Hãy đặt tệp PNG lên một lớp trắng trong bất kỳ trình chỉnh sửa nào hoặc trong Darkroom; các điểm ảnh trong suốt sẽ mang màu của lớp bên dưới.',
        },
        {
          question: 'Công cụ có xử lý được tóc, lông và đồ thủy tinh không?',
          answer: 'Thường là được, và các mô hình chân dung và BiRefNet được huấn luyện có tính đến những đường viền như vậy, nhưng vùng bán trong suốt là trường hợp khó nhất. Hãy thử mô hình thứ hai nếu mô hình đầu tiên để lại viền.',
        },
        {
          question: 'Ảnh của tôi có bị gửi đến công ty AI bên ngoài không?',
          answer: 'Không. rembg và các mô hình của nó chạy trên máy chủ GPU của chính chúng tôi, và tác vụ không bao giờ gọi API của bên thứ ba.',
        },
        {
          question: 'Ảnh cắt có giữ dữ liệu EXIF của tôi không?',
          answer: 'Không. Các thao tác AI bỏ qua bước sao chép bằng exiftool mà bộ chuyển đổi thông thường thực hiện, nên tệp PNG không có thẻ máy ảnh, ngày tháng hay GPS.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Đầu ra luôn là PNG trong suốt. Xóa nền chạy trên máy chủ GPU cục bộ của chúng tôi, không qua API của bên thứ ba.',
        ],
      },
      related: [
        {
          label: 'Xóa vật thể khỏi ảnh',
          to: '/tools/remove-object-from-photo',
          description: 'Xóa một vật thể và giữ lại phần còn lại của cảnh.',
        },
        {
          label: 'Đổi kích thước ảnh',
          to: '/tools/image-resizer',
          description: 'Thu phóng ảnh cắt về kích thước mà bố cục của bạn cần.',
        },
        {
          label: 'Nâng độ phân giải ảnh bằng AI',
          to: '/tools/ai-image-upscaler',
          description: 'Phóng to một ảnh cắt nhỏ trước khi đặt vào bố cục.',
        },
        {
          label: 'Làm mờ khuôn mặt trong ảnh',
          to: '/tools/blur-faces-in-photo',
          description: 'Ẩn danh người trong ảnh thay vì tách họ ra.',
        },
        {
          label: 'Hướng dẫn bộ chuyển đổi ảnh',
          to: '/tutorials/image/getting-started',
          description: 'Đi qua từng tùy chọn AI và hình ảnh.',
        },
      ],
      embed: {
        title: 'Xóa nền khỏi ảnh',
        description: 'Tải lên một bức ảnh. Công cụ này được đặt sẵn ở chế độ xóa nền bằng AI và xuất ra PNG trong suốt. Chỉ cần tải lên và chuyển đổi — chủ thể được giữ lại và nền bị xóa.',
      },
    },
    'image-to-pdf': {
      name: 'Ảnh sang PDF',
      h1: 'Chuyển ảnh sang PDF trực tuyến miễn phí',
      tagline: 'Chuyển ảnh JPG, PNG và các ảnh khác thành tài liệu PDF gọn gàng, dễ chia sẻ chỉ với một lần bấm.',
      metaTitle: 'Chuyển ảnh sang PDF trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển ảnh sang PDF trực tuyến miễn phí. Chuyển ảnh JPG, PNG và các ảnh khác thành tài liệu PDF gọn gàng. Không cần đăng ký, không có hình mờ. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển ảnh sang PDF trực tuyến miễn phí',
      ogDescription: 'Biến ảnh JPG, PNG và các ảnh khác thành tệp PDF gọn gàng, dễ chia sẻ. Miễn phí, nhanh, không cần đăng ký.',
      intro: 'Trang này khóa định dạng đầu ra ở PDF, đưa ảnh của bạn vào một nhánh riêng trong API của chúng tôi, nơi tài liệu được dựng hoàn toàn bằng Go thay vì qua ImageMagick hay Ghostscript. Ảnh JPEG được nhúng nguyên từng byte với bộ lọc /DCTDecode, nên bức ảnh bên trong PDF chính là luồng dữ liệu nén y hệt bạn đã tải lên. Ảnh PNG, GIF hoặc WebP được giải mã, ghép lên nền trắng và lưu dưới dạng RGB 8 bit nén zlib. Trang duy nhất được định kích thước sao cho ảnh nằm ở mức 96 điểm ảnh mỗi inch: mỗi điểm ảnh thành 0,75 point, giúp bức ảnh giữ độ phân giải gốc mà không phải lấy mẫu lại.',
      whatItDoes: [
        'Bọc một ảnh trong tài liệu PDF 1.4 một trang có kích thước khớp với ảnh ở 96 DPI.',
        'Nhúng dữ liệu JPEG nguyên vẹn, nên ảnh chụp không bị nén thêm lần thứ hai.',
        'Làm phẳng các điểm ảnh trong suốt của PNG và GIF lên nền trắng và lưu chúng không mất dữ liệu bằng zlib.',
        'Trước tiên dùng ImageMagick để raster hóa WebP và các định dạng chứa khác mà Go không giải mã được, rồi nhúng kết quả không mất dữ liệu.',
        'Bỏ qua các thiết lập chất lượng, đổi kích thước, cắt, bộ lọc và AI; nhánh PDF chỉ nhận ảnh.',
      ],
      flowSteps: [
        {
          title: 'Tải lên bất kỳ ảnh nào',
          description: 'JPG, PNG, GIF và WebP là các đầu vào thường gặp; trường tải lên chấp nhận mọi loại ảnh.',
        },
        {
          title: 'Máy chủ đọc các điểm ảnh',
          description: 'Kích thước JPEG được lấy từ phần đầu tệp; các định dạng khác được giải mã và làm phẳng về RGB.',
        },
        {
          title: 'Một tệp PDF một trang được lắp ráp',
          description: 'Catalog, trang, image XObject và một content stream vẽ ảnh phủ kín trang.',
        },
        {
          title: 'Tải xuống converted.pdf',
          description: 'Được cung cấp từ thư mục đầu ra của tác vụ cho đến khi hết thời gian lưu.',
        },
      ],
      advancedDetails: [
        'Bộ dựng là imageToPDFBytes trong pdf_tools.go. Tệp bắt đầu bằng mã đánh dấu JPEG FF D8 FF được nhúng dưới dạng /DCTDecode với /DeviceRGB hoặc /DeviceGray; JPEG CMYK sẽ chuyển sang nhánh giải mã và làm phẳng để PDF không bao giờ chứa luồng CMYK.',
        'Các đầu vào không phải JPEG được giải mã bằng codec ảnh của Go (PNG và GIF được đăng ký). Mỗi điểm ảnh được ghép alpha lên nền trắng và ghi thành ba byte, rồi toàn bộ bộ đệm được nén zlib và lưu với /FlateDecode ở 8 bit mỗi thành phần.',
        'WebP và mọi thứ khác mà Go không giải mã được trước tiên được ImageMagick raster hóa với -auto-orient thành một luồng PNG trong bộ nhớ, rồi tệp PNG đó được làm phẳng và nhúng vào.',
        'Kích thước trang tính bằng point là chiều rộng x 72 / 96 và chiều cao x 72 / 96, nên ảnh 1200 x 1600 cho trang 900 x 1200 point (12,5 x 16,7 inch). Trình xem PDF thu phóng trang cho vừa cửa sổ và máy in thu phóng theo khổ giấy, nên trang lớn không phải là vấn đề khi xem, nhưng hãy đặt "vừa trang" khi in.',
        'JPEG trên nhánh nhanh giữ nguyên EXIF, kể cả cờ Orientation, nhưng trình xem PDF không áp dụng hướng EXIF. Ảnh điện thoại được lưu nằm ngang kèm cờ xoay sẽ hiện bị xoay ngang trong PDF; hãy chuyển nó sang JPG một lần trước (thao tác này tự xoay đúng hướng) rồi mới chuyển sang PDF.',
        'Giá trị chất lượng mà biểu mẫu gửi được chấp nhận nhưng không dùng trên nhánh này, và không có chế độ nhiều ảnh: một lần tải lên tạo ra một tệp PDF một trang.',
      ],
      whyItMatters: [
        'Các cổng nộp hồ sơ thị thực, trường đại học và hệ thống nhân sự thường chỉ chấp nhận PDF, ngay cả với ảnh chụp một tờ hóa đơn.',
        'PDF in và xem trước giống nhau trên mọi thiết bị, trong khi một ảnh trần có thể bị trình xem xoay hoặc thu phóng.',
        'Nhúng nguyên JPEG nghĩa là PDF đạt chất lượng bản in thử: không có gì bị mã hóa lại trên đường vào.',
      ],
      useCases: [
        {
          title: 'Hóa đơn và biểu mẫu',
          description: 'Biến ảnh chụp điện thoại một trang giấy đã ký thành PDF mà cổng nộp hồ sơ chấp nhận.',
        },
        {
          title: 'Tải lên giấy tờ tùy thân và tài liệu',
          description: 'Nộp thẻ hoặc chứng chỉ đã quét dưới dạng PDF mà biểu mẫu yêu cầu.',
        },
        {
          title: 'Bản in thử tác phẩm',
          description: 'Gửi khách hàng một tệp PDF của thiết kế PNG với phần trong suốt được làm phẳng lên nền trắng.',
        },
        {
          title: 'Lưu trữ',
          description: 'Giữ ảnh chụp cùng các tài liệu khác trong một định dạng.',
        },
      ],
      workedExamples: [
        {
          title: 'Ảnh JPEG điện thoại 3024 x 4032 (2,9 MB)',
          body: 'Đầu vào: một tệp JPEG 2,9 MB, rộng 3024 và cao 4032, RGB. Phần đầu tệp được đọc để lấy kích thước và luồng JPEG được nhúng nguyên trạng với /DCTDecode. Trang rộng 3024 x 0,75 = 2268 point và cao 4032 x 0,75 = 3024 point, tức 31,5 x 42 inch. Tệp PDF ra khoảng 2,9 MB cộng chưa tới một kilobyte cấu trúc PDF, vì không có gì bị mã hóa lại. Công việc chỉ là đọc tệp và ghi ra lại, nên tác vụ bị giới hạn bởi tốc độ đĩa và tốc độ tải lên chứ không phải CPU, và hoàn tất trong vài giây.',
        },
        {
          title: 'Ảnh PNG 1920 x 1080 có nền trong suốt',
          body: 'Đầu vào: một tệp PNG 1,4 MB chứa logo trên nền trong suốt. Tệp PNG được giải mã, mọi điểm ảnh được ghép lên nền trắng, và 1920 x 1080 x 3 = 6.220.800 byte RGB được nén zlib và lưu với /FlateDecode. Trang có kích thước 1440 x 810 point (20 x 11,25 inch). Vì màu trắng phẳng và màu đặc nén tốt bằng zlib, tệp PDF thường có dung lượng tương đương tệp PNG, đôi khi lớn hơn, do zlib thuần không có các bộ lọc theo hàng mà PNG dùng. Giải mã, ghép hai triệu điểm ảnh và nén chúng là công việc của CPU, mất vài giây; phần trong suốt không còn trong kết quả, theo đúng thiết kế.',
        },
      ],
      whenNotToUse: 'Đây không phải công cụ cho tài liệu nhiều trang: nó tạo đúng một trang từ một ảnh, nên một bộ bản quét cần chuyển đổi từng trang rồi gộp lại trong trình chỉnh sửa PDF. Đừng dùng công cụ này khi cần giữ độ trong suốt, vì mọi điểm ảnh đều được làm phẳng lên nền trắng. Đừng mong tệp nhỏ hơn: JPEG được nhúng không đổi và PNG trở thành RGB nén zlib, nên hãy nén hoặc đổi kích thước ảnh trước nếu dung lượng quan trọng. Và một bức ảnh mà hướng đúng chỉ nằm trong cờ EXIF nên được chuyển sang JPG một lần trước, nếu không PDF sẽ hiển thị ảnh theo đúng cách nó được lưu.',
      whyMediaManipulator: [
        'Việc nhúng thẳng JPEG là một quyết định thiết kế: ảnh của bạn được nhúng mà không mã hóa lại, điều mà nhiều trình chuyển đổi không cam kết.',
        'Không có Ghostscript và không có chính sách PDF của ImageMagick trên đường xử lý, nên việc chuyển đổi không phụ thuộc vào một thiết lập bảo mật phía máy chủ có thể từ chối PDF.',
        'Miễn phí với công cụ tiêu chuẩn, không cần tài khoản. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Ảnh được lưu trong uploads/<jobId>/ và tệp PDF trong outputs/<jobId>/converted.pdf trên máy chủ của chính chúng tôi; cả hai bị xóa cùng lúc khi hết thời gian lưu. Ảnh JPEG giữ toàn bộ siêu dữ liệu nhúng bên trong PDF vì luồng dữ liệu được sao chép nguyên văn, nên thẻ vị trí EXIF và thẻ máy ảnh vẫn đọc được với bất kỳ ai trích xuất ảnh; hãy xóa chúng trước bằng công cụ xóa EXIF nếu điều đó quan trọng với bạn. PNG và các đầu vào khác được giải mã thành điểm ảnh thô, nên không có thẻ nào được mang theo. Bản thân tệp tải lên là ảnh nên cũng đi qua bước phân tích tự động bằng mô hình thị giác chạy trên máy chủ của chúng tôi, và bản tóm tắt của bước này được lưu cùng tác vụ. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Chuyển ảnh sang PDF có miễn phí không?',
          answer: 'Có, với công cụ tiêu chuẩn. Mỗi lần chuyển đổi dùng một tác vụ thường trong ngày: 5 tác vụ mỗi ngày với khách, giới hạn tệp 200 MB; 30 tác vụ mỗi ngày và 1 GB với tài khoản miễn phí; và 300 hoặc 700 với Premium hoặc Pro, tất cả đều là mức mặc định và được liệt kê trên /pricing.',
        },
        {
          question: 'Ảnh có bị nén lại bên trong PDF không?',
          answer: 'Không, nếu đó là JPEG: các byte gốc được nhúng với /DCTDecode. PNG, GIF và WebP được lưu không mất dữ liệu dưới dạng RGB nén zlib sau khi làm phẳng, nên ở đó cũng không mất chất lượng.',
        },
        {
          question: 'Tệp PDF có kích thước trang thế nào?',
          answer: 'Trang khớp với ảnh ở mức 96 điểm ảnh mỗi inch, nên chiều rộng và chiều cao tính bằng point bằng 0,75 lần kích thước điểm ảnh. Ảnh 1200 x 1600 cho trang 12,5 x 16,7 inch; trình xem và máy in sẽ thu phóng cho vừa.',
        },
        {
          question: 'Tôi có thể gộp nhiều ảnh thành một PDF không?',
          answer: 'Không phải trên trang này. Mỗi lần tải lên tạo ra một tệp PDF một trang. Hãy chuyển đổi từng ảnh và gộp các tệp PDF thu được trong một trình chỉnh sửa PDF.',
        },
        {
          question: 'Điều gì xảy ra với phần trong suốt?',
          answer: 'Nó được làm phẳng lên nền trắng. Các image XObject của PDF trên nhánh này không có kênh alpha, nên điểm ảnh trong suốt trở thành điểm ảnh trắng.',
        },
        {
          question: 'Vì sao ảnh điện thoại của tôi bị xoay ngang trong PDF?',
          answer: 'Điện thoại thường lưu điểm ảnh theo chiều ngang và đặt cờ EXIF Orientation. Ảnh JPEG được nhúng nguyên vẹn và trình xem PDF bỏ qua cờ đó. Hãy cho ảnh qua bộ chuyển đổi ảnh sang JPG trước, bước này áp dụng tự xoay đúng hướng, rồi chuyển kết quả sang PDF.',
        },
        {
          question: 'PDF có giữ dữ liệu EXIF của tôi không?',
          answer: 'Với JPEG thì có, vì toàn bộ luồng JPEG, kể cả EXIF, nằm bên trong PDF. Hãy dùng công cụ xóa EXIF trước nếu bạn không muốn vậy. Với PNG và các đầu vào khác, chỉ điểm ảnh được giữ lại.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Đầu ra là tệp PDF một trang. Phần trong suốt được làm phẳng lên nền trắng vì trang PDF không trong suốt.',
        ],
      },
      related: [
        {
          label: 'PDF sang JPG',
          to: '/tools/pdf-to-jpg',
          description: 'Kết xuất các trang PDF trở lại thành ảnh.',
        },
        {
          label: 'Xóa siêu dữ liệu EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Xóa các thẻ trước khi chúng được nhúng vào PDF.',
        },
        {
          label: 'Nén ảnh',
          to: '/tools/compress-image',
          description: 'Thu nhỏ JPEG trước, vì PDF nhúng nó nguyên trạng.',
        },
        {
          label: 'Quét tài liệu bằng AI',
          to: '/tools/ai-document-scan',
          description: 'Làm sạch và nhận dạng chữ (OCR) cho trang đã chụp thay vì chỉ bọc nó lại.',
        },
        {
          label: 'Đổi kích thước ảnh',
          to: '/tools/image-resizer',
          description: 'Đặt kích thước điểm ảnh trước, và do đó cả kích thước trang.',
        },
      ],
      embed: {
        title: 'Chuyển ảnh sang PDF',
        description: 'Tải lên bất kỳ ảnh nào — JPG, PNG và nhiều định dạng khác. Đầu ra của công cụ này được khóa ở PDF, nên bạn nhận được một tệp PDF một trang bọc ảnh của bạn ở độ phân giải gốc.',
      },
    },
    'pdf-to-jpg': {
      name: 'PDF sang JPG',
      h1: 'Chuyển PDF sang JPG trực tuyến miễn phí',
      tagline: 'Kết xuất từng trang của tệp PDF thành ảnh JPG chất lượng cao để bạn chia sẻ, chỉnh sửa hoặc đăng tải.',
      metaTitle: 'Chuyển PDF sang JPG trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển PDF sang JPG trực tuyến miễn phí. Kết xuất từng trang của tệp PDF thành ảnh JPG chất lượng cao, tải về dưới dạng ZIP. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển PDF sang JPG trực tuyến miễn phí',
      ogDescription: 'Kết xuất mọi trang của tệp PDF thành ảnh JPG chất lượng cao. Miễn phí, nhanh, không cần đăng ký.',
      intro: 'Tải lên một tệp PDF và máy chủ của chúng tôi sẽ kết xuất từng trang bằng pdftoppm của bộ công cụ Poppler, cũng là trình raster hóa mà nhiều trình xem PDF trên máy tính sử dụng. Biểu mẫu trên trang này được đặt sẵn là JPG, tất cả các trang và 150 DPI; bạn có thể đổi DPI thành 100, 200 hoặc 300, giới hạn tác vụ chỉ ở trang đầu và đặt chất lượng JPEG, mặc định là 90. Khi chọn tất cả các trang, bạn nhận được một tệp ZIP chứa page-001.jpg, page-002.jpg, v.v.; khi chỉ chọn trang đầu, bạn nhận được một tệp JPG duy nhất. Trước khi kết xuất, pdfinfo đếm số trang và tác vụ bị từ chối nếu có nhiều hơn 500 trang.',
      whatItDoes: [
        'Raster hóa mọi trang, hoặc chỉ trang đầu, thành JPG ở độ phân giải bạn chọn.',
        'Đóng gói đầu ra nhiều trang thành một tệp ZIP với tên tệp được thêm số không ở đầu, sắp xếp được.',
        'Dùng chất lượng JPEG bạn đặt (mặc định là 90) cho mọi trang.',
        'Đọc số trang trước, để tài liệu quá lớn bị từ chối trước khi bất kỳ trang nào được kết xuất.',
        'Không đưa PDF vào bước phân tích ảnh tự động, vốn chỉ chạy với các tệp tải lên là ảnh, video và âm thanh.',
      ],
      flowSteps: [
        {
          title: 'Tải lên PDF',
          description: 'Bất kỳ tệp .pdf nào trong giới hạn dung lượng mỗi tệp của bạn; số trang phải từ 500 trở xuống.',
        },
        {
          title: 'Chọn trang, DPI và chất lượng',
          description: 'Tất cả các trang hoặc chỉ trang đầu; 100, 150, 200 hoặc 300 DPI; chất lượng JPEG từ 1 đến 100.',
        },
        {
          title: 'pdftoppm kết xuất',
          description: 'pdftoppm -r <dpi> -jpeg -jpegopt quality=<q> [-f 1 -l 1] input page',
        },
        {
          title: 'Tải xuống',
          description: 'converted.jpg cho một trang, converted.zip cho tất cả các trang.',
        },
      ],
      advancedDetails: [
        'Trình kết xuất là convertPDFToImages trong pdf_tools.go. Nó gọi pdfinfo để lấy số trang, từ chối tài liệu trên 500 trang, rồi chạy pdftoppm với -r cho DPI, -jpeg và -jpegopt quality=N cho đầu ra JPG, và -f 1 -l 1 khi chỉ cần trang đầu.',
        'Máy chủ giới hạn DPI trong khoảng 50 đến 400 và chất lượng trong khoảng 1 đến 100 bất kể biểu mẫu gửi gì; bản thân biểu mẫu cung cấp 100, 150, 200 và 300.',
        'pdftoppm ghi một tệp cho mỗi trang; máy chủ đổi tên chúng thành page-001.jpg, page-002.jpg, v.v. (ba chữ số, thêm số không ở đầu) và nén thành ZIP, nên các tệp được sắp theo thứ tự trang trong mọi trình quản lý tệp.',
        'Kích thước điểm ảnh suy ra trực tiếp từ DPI: một trang US Letter (8,5 x 11 inch) là 1275 x 1650 điểm ảnh ở 150 DPI và 2550 x 3300 ở 300; một trang A4 (8,27 x 11,69 inch) là 1240 x 1754 ở 150 và 2480 x 3508 ở 300.',
        'Một tệp PDF vốn là bản quét sẽ được raster hóa lại: nếu bản quét nhúng có độ phân giải 300 DPI và bạn kết xuất ở 150, mỗi trang sẽ có độ phân giải tuyến tính bằng một nửa bản quét. Hãy chọn 300 để giữ nguyên những gì bản quét có.',
        'Biến thể PNG của công cụ này dùng cùng trình kết xuất với -png và không có tùy chọn chất lượng; JPG là lựa chọn đúng cho các trang ảnh chụp hoặc bản quét, còn PNG cho các trang có chữ sắc nét và màu phẳng, nơi hiện tượng gợn viền của JPEG sẽ lộ ra.',
      ],
      whyItMatters: [
        'Nhiều công cụ và nền tảng chấp nhận ảnh nhưng không chấp nhận PDF: bộ slide, bài đăng mạng xã hội, ứng dụng chat và trình chỉnh sửa ảnh.',
        'Một trang được kết xuất là hình ảnh trung thực của bố cục, phông chữ và đồ họa vector, không cần nhúng hay dàn trang lại gì.',
        'Tự chọn DPI nghĩa là bạn quyết định giữa một bản xem trước nhanh và một bản xuất ở độ phân giải in.',
      ],
      useCases: [
        {
          title: 'Slide và bài đăng mạng xã hội',
          description: 'Kết xuất một trang báo cáo hoặc một áp phích thành ảnh để đăng hoặc đưa vào bộ slide.',
        },
        {
          title: 'Ảnh thu nhỏ và bản xem trước',
          description: 'Chỉ kết xuất trang đầu ở 100 DPI để làm ảnh bìa.',
        },
        {
          title: 'Đánh dấu trong trình chỉnh sửa',
          description: 'Mở một trang trong trình chỉnh sửa ảnh để chú thích, che thông tin hoặc cắt.',
        },
        {
          title: 'Trích xuất bản quét',
          description: 'Lấy lại từng trang đã quét từ PDF thành từng tệp JPG riêng ở độ phân giải gốc.',
        },
      ],
      workedExamples: [
        {
          title: 'Báo cáo A4 12 trang, tất cả các trang ở 150 DPI',
          body: 'Đầu vào: một tệp PDF A4 12 trang, 1,8 MB, chứa chữ và vài biểu đồ. Thiết lập giữ nguyên như đặt sẵn: JPG, tất cả các trang, 150 DPI, chất lượng 90. pdfinfo báo 12 trang, dưới giới hạn 500, và pdftoppm chạy -r 150 -jpeg -jpegopt quality=90. Mỗi trang được kết xuất ở 8,27 x 150 nhân 11,69 x 150, tức 1240 x 1754 điểm ảnh (2,2 megapixel). Mười hai tệp được đổi tên từ page-001.jpg đến page-012.jpg và nén vào converted.zip. Việc kết xuất diễn ra theo từng trang và chủ yếu phụ thuộc vào lượng nội dung vector và chữ trên mỗi trang; khoảng một chục trang chữ mất tổng cộng vài giây. Dung lượng JPEG mỗi trang tùy thuộc nội dung: trang chữ phần lớn là nền trắng nén tốt hơn nhiều so với một biểu đồ tràn trang.',
        },
        {
          title: 'Chỉ trang đầu của bản quét US Letter ở 300 DPI',
          body: 'Đầu vào: một hợp đồng đã quét dài 40 trang, khổ Letter, 28 MB. Chọn chỉ trang đầu và 300 DPI, giữ chất lượng 90. Máy chủ chạy pdftoppm -r 300 -jpeg -jpegopt quality=90 -f 1 -l 1, nên chỉ một trang được raster hóa, ở 8,5 x 300 nhân 11 x 300 = 2550 x 3300 điểm ảnh (8,4 megapixel). Đầu ra là một tệp converted.jpg duy nhất, không phải ZIP. Kết xuất một trang đã quét rất nhanh vì trang đó là một ảnh nhúng duy nhất; việc tải lên 28 MB còn lâu hơn việc kết xuất. Ở 150 DPI, cùng trang đó sẽ là 1275 x 1650, bằng một phần tư số điểm ảnh, đủ để đọc trên màn hình nhưng không đủ để in lại bản quét.',
        },
      ],
      whenNotToUse: 'Đừng kết xuất PDF sang JPG khi bạn cần chữ vẫn chọn được hoặc tìm kiếm được: kết quả là điểm ảnh, và trình đọc màn hình hay chỉ mục tìm kiếm sẽ không nhận được gì. Đừng dùng JPG cho các trang chủ yếu là chữ sắc nét và nét vẽ nếu bạn sẽ phóng to, vì nén JPEG để lại các gợn mờ quanh đường viền; biến thể PNG sạch hơn trong trường hợp đó. Tài liệu dài hơn 500 trang bị từ chối ngay, và DPI rất cao trên một tài liệu dài sẽ tạo ra tệp ZIP lớn, nên chỉ kết xuất những trang bạn thực sự cần. Và nếu mục tiêu là chỉnh sửa nội dung PDF thay vì chụp lại hình ảnh của nó, trình chỉnh sửa PDF mới là công cụ phù hợp.',
      whyMediaManipulator: [
        'Kết xuất bằng Poppler với các điều khiển DPI và chất lượng thực sự, không phải kích thước xem trước cố định.',
        'Một tệp ZIP duy nhất với tên tệp đánh số trang thay vì một đống lượt tải xuống.',
        'Không cần đăng ký với công cụ tiêu chuẩn. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Tệp PDF của bạn được lưu trong uploads/<jobId>/ trên máy chủ của chúng tôi, còn các ảnh JPG đã kết xuất hoặc tệp ZIP của chúng nằm trong outputs/<jobId>/; các trang được kết xuất vào một thư mục tạm bên trong thư mục đầu ra, và thư mục này bị xóa ngay khi tệp ZIP được ghi xong. Tệp PDF tải lên được nhận diện là tài liệu và không được chuyển cho bước phân tích thị giác tự động mà các tệp ảnh, video và âm thanh tải lên phải qua. Poppler chạy hoàn toàn trên máy của chúng tôi, và không trang nào được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Chuyển PDF sang JPG có miễn phí không?',
          answer: 'Có, với công cụ tiêu chuẩn. Một tệp PDF, dù có bao nhiêu trang, được tính là một tác vụ thường trong ngày: 5 tác vụ mỗi ngày với khách, giới hạn 200 MB mỗi tệp; 30 tác vụ mỗi ngày và 1 GB với tài khoản miễn phí; 300 với Premium và 700 với Pro, tất cả đều là mức mặc định và được hiển thị trên /pricing.',
        },
        {
          question: 'Tôi sẽ nhận được bao nhiêu ảnh?',
          answer: 'Mỗi trang một ảnh khi chọn tất cả các trang, được gửi dưới dạng converted.zip với các tệp được đặt tên từ page-001.jpg trở đi. Khi chỉ chọn trang đầu, bạn nhận được một tệp converted.jpg và không có ZIP.',
        },
        {
          question: 'Tôi nên chọn DPI nào?',
          answer: '150 để đọc trên màn hình và chia sẻ (1240 x 1754 với A4). 300 để in hoặc cho các bản quét được tạo ở 300 (2480 x 3508 với A4). 100 cho bản xem trước nhỏ. Máy chủ chấp nhận từ 50 đến 400.',
        },
        {
          question: 'Thiết lập chất lượng có tác dụng gì?',
          answer: 'Nó được truyền cho pdftoppm dưới dạng -jpegopt quality=N, thang chất lượng JPEG tiêu chuẩn. Mặc định là 90; hãy giảm xuống để có tệp nhỏ hơn với các trang nhiều ảnh chụp.',
        },
        {
          question: 'Có giới hạn số trang không?',
          answer: 'Có, 500 trang. pdfinfo đếm số trang trước khi bắt đầu kết xuất, và tài liệu dài hơn sẽ bị từ chối kèm thông báo nêu số trang và giới hạn, đồng thời tác vụ được hoàn lại.',
        },
        {
          question: 'Chữ trong ảnh có tìm kiếm được không?',
          answer: 'Không. Đầu ra là ảnh raster của từng trang. Nếu bạn cần chữ, hãy giữ tệp PDF, hoặc dùng công cụ quét tài liệu bằng AI, công cụ này chạy OCR trên trang đã chụp.',
        },
        {
          question: 'Tôi có thể nhận PNG thay vì JPG không?',
          answer: 'Trang này khóa định dạng ở JPG. Cùng trình kết xuất đó tạo PNG qua trang PDF sang PNG, vốn dùng -png và không có thiết lập chất lượng.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Đầu ra tất cả các trang được gửi dưới dạng tệp .zip; đầu ra trang đầu là một tệp .jpg duy nhất.',
          'Độ phân giải kết xuất mặc định là 150 DPI; hãy tăng lên để có đầu ra chất lượng in.',
        ],
      },
      related: [
        {
          label: 'Ảnh sang PDF',
          to: '/tools/image-to-pdf',
          description: 'Theo chiều ngược lại: bọc một ảnh trong trang PDF.',
        },
        {
          label: 'Nén ảnh',
          to: '/tools/compress-image',
          description: 'Thu nhỏ các ảnh JPG đã kết xuất cho web.',
        },
        {
          label: 'Đổi kích thước ảnh',
          to: '/tools/image-resizer',
          description: 'Thu phóng trang đã kết xuất về kích thước ảnh thu nhỏ hoặc banner.',
        },
        {
          label: 'Quét tài liệu bằng AI',
          to: '/tools/ai-document-scan',
          description: 'Nhận dạng chữ (OCR) và làm sạch trang đã chụp.',
        },
        {
          label: 'Che văn bản trong ảnh',
          to: '/tools/redact-text-in-image',
          description: 'Bôi đen tên hoặc số trên trang đã kết xuất.',
        },
      ],
      embed: {
        title: 'Chuyển PDF sang JPG',
        description: 'Tải lên một tệp PDF. Mỗi trang được kết xuất thành một ảnh JPG. Chọn "tất cả các trang" để nhận tệp ZIP chứa ảnh, hoặc "chỉ trang đầu" để nhận một ảnh JPG duy nhất. Chọn DPI kết xuất để có đầu ra sắc nét hơn.',
      },
    },
    'compress-video': {
      name: 'Nén video',
      h1: 'Nén video trực tuyến mà không làm hỏng chất lượng',
      tagline: 'Giảm dung lượng tệp MP4, WebM, MOV, MKV và AVI cho web, email, mạng xã hội và tải lên đám mây.',
      metaTitle: 'Nén video trực tuyến (miễn phí) | Media Manipulator',
      metaDescription: 'Công cụ nén video trực tuyến miễn phí. Giảm dung lượng tệp MP4, WebM, MOV, MKV và AVI mà vẫn giữ chất lượng tốt. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Nén video trực tuyến mà không làm hỏng chất lượng',
      ogDescription: 'Thu nhỏ tệp video MP4, WebM, MOV và AVI cho web mà vẫn giữ chất lượng xem tốt.',
      intro: 'Một tệp video lớn là do bitrate của nó: số bit mà bộ mã hóa dùng cho mỗi giây cảnh quay. Điện thoại và phần mềm quay màn hình dùng bit rất hào phóng, vì vậy một clip 1080p ngắn có thể nặng hàng chục hoặc hàng trăm megabyte. Trang này mở một trình nén với ba tùy chọn thay vì trình chuyển đổi đầy đủ: mức nén, định dạng chứa đầu ra, cùng độ phân giải và codec tùy chọn. Trên máy chủ của chúng tôi, tác vụ là một lệnh FFmpeg duy nhất: mã hóa lại hình ảnh ở mức chất lượng không đổi (CRF) tương ứng với mức nén, mã hóa lại âm thanh thành AAC hoặc Opus, và ghi kết quả với chỉ mục ở đầu tệp để video bắt đầu phát trước khi tải xong hoàn toàn.',
      whatItDoes: [
        'Mã hóa lại video ở một mức chất lượng cố định thay vì bitrate cố định: Tệp nhỏ nhất là CRF 31, Cân bằng là CRF 26 và Chất lượng cao là CRF 22.',
        'Xuất ra MP4 (mặc định H.264, hoặc H.265/HEVC khi bạn chọn) hoặc WebM (VP9 với âm thanh Opus).',
        'Có thể thu nhỏ hình ảnh xuống 1080p, 720p hoặc 480p ngay trong cùng một lượt mà vẫn giữ tỷ lệ khung hình.',
        'Có thể bỏ hẳn track âm thanh để có tệp nhỏ nhất có thể.',
        'Chấp nhận tệp tải lên MP4, MOV, M4V, WebM, MKV, AVI, FLV, WMV, MPEG và MPG; trang chuyển đổi đầy đủ xử lý ProRes và các định dạng dựng phim khác.',
      ],
      flowSteps: [
        {
          title: 'Tải video lên',
          description: 'Trình duyệt đưa tệp thẳng vào kho lưu trữ của chúng tôi, rồi yêu cầu API bắt đầu tác vụ.',
        },
        {
          title: 'Chọn mức nén',
          description: 'Cân bằng được chọn sẵn. Tệp nhỏ nhất đánh đổi chi tiết nhìn thấy được để lấy kích thước; Chất lượng cao giữ lại nhiều chi tiết hơn.',
        },
        {
          title: 'Tùy chọn đổi định dạng, độ phân giải hoặc codec',
          description: 'MP4 với H.264 phát được ở mọi nơi; H.265 và WebM cho tệp nhỏ hơn trên các thiết bị giải mã được chúng.',
        },
        {
          title: 'FFmpeg mã hóa lại',
          description: 'libx264, libx265 hoặc libvpx-vp9 với CRF theo mức bạn chọn, cùng âm thanh AAC hoặc Opus và faststart cho MP4.',
        },
        {
          title: 'Tải xuống tệp nhỏ hơn',
          description: 'Kết quả nằm trong thư mục tác vụ cho đến khi hết thời hạn lưu.',
        },
      ],
      advancedDetails: [
        'Lệnh chính xác cho MP4 là ffmpeg -i input [-vf scale=-1:H] -c:v libx264 -crf N -pix_fmt yuv420p -movflags +faststart -c:a aac output.mp4, trong đó N là 31, 26 hoặc 22 cho ba mức (buildVideoCodecArgs và videoCRF trong converter.go). Không truyền preset tốc độ mã hóa nào, nên libx264 chạy ở mặc định là medium.',
        'Chọn H.265 sẽ đổi bộ mã hóa sang libx265 và thêm -tag:v hvc1, thẻ mà QuickTime và Safari cần để nhận ra HEVC bên trong MP4. Điện thoại Android đời cũ, TV thông minh và nhiều trình phát web hoàn toàn không giải mã được H.265.',
        'Đầu ra WebM chạy libvpx-vp9 với -b:v 0 -crf N và âm thanh Opus; nếu bản dựng FFmpeg trên máy chủ thiếu VP9 hoặc Opus, nó sẽ chuyển về VP8 và Vorbis. Giá trị N được truyền như nhau, nhưng VP9 hiểu CRF trên thang từ 0 đến 63, nên 26 ở đó là mức chất lượng tương đối cao.',
        'Lựa chọn độ phân giải trở thành scale=-1:1080, scale=-1:720 hoặc scale=-1:480: chiều cao cố định, chiều rộng được tính từ tỷ lệ khung hình của nguồn. Chiều cao được áp dụng đúng như đã chọn, nên chọn 1080p cho nguồn 720p sẽ phóng to video và làm tệp lớn hơn chứ không nhỏ đi; hãy chọn chiều cao bằng hoặc thấp hơn nguồn.',
        'Tùy chọn bỏ track âm thanh thêm -an. Nếu không, âm thanh được mã hóa lại bằng bộ mã hóa AAC gốc của FFmpeg ở bitrate mặc định (không truyền -b:a; với stereo thường khoảng 128 kbps), chỉ chiếm một phần nhỏ của tệp ở mọi mức nén.',
        'Việc nén dựa trên CRF, nên kích thước đầu ra phụ thuộc vào nội dung: slide tĩnh nén được mạnh hơn nhiều so với cảnh pháo giấy hay mặt nước. Máy chủ kiểm tra CRF nằm trong khoảng 0 đến 51 và mức nén là một trong ba tên hợp lệ trước khi bắt đầu mã hóa.',
        'Tệp tải lên cũng được đưa vào hàng đợi phân tích nội dung tự động mà mọi lượt chuyển đổi tiêu chuẩn đều trải qua: các khung hình được lấy mẫu và mô tả bằng một mô hình thị giác cục bộ, và âm thanh được chép lời trên phần cứng của chính chúng tôi. Kết quả phân tích được lưu cùng tác vụ, không được chia sẻ.',
      ],
      whyItMatters: [
        'Ứng dụng chat, máy chủ thư và nền tảng học tập áp đặt giới hạn tính bằng megabyte, và một clip điện thoại ở bitrate gốc dễ dàng vượt qua các giới hạn đó.',
        'Một trang tự động phát video nền 60 MB sẽ bị đứng trên kết nối di động; cùng clip đó ở CRF 26 chỉ còn một phần nhỏ dung lượng.',
        'Chi phí lưu trữ và băng thông tăng theo số byte, nên giữ bản nén của những bản gốc hiếm khi mở sẽ giúp tiết kiệm đáng kể theo thời gian.',
      ],
      useCases: [
        {
          title: 'Email và chat',
          description: 'Đưa một đoạn quay điện thoại dài 1 phút xuống dưới giới hạn 25 MB hoặc 100 MB mà không cần gửi liên kết chia sẻ riêng.',
        },
        {
          title: 'Video nổi bật và vòng lặp nền cho trang web',
          description: 'Mã hóa WebM hoặc MP4 H.264 để trang có thể tự động phát mà không phải chờ tải lâu.',
        },
        {
          title: 'Bản ghi khóa học và cuộc họp',
          description: 'Thu nhỏ bản quay màn hình có slide tĩnh, loại nội dung nén cực tốt ở mọi mức CRF.',
        },
        {
          title: 'Bản sao lưu trữ',
          description: 'Giữ một bản 720p ở mức Cân bằng cho những bản gốc dài và chuyển bản master sang kho lưu trữ lạnh.',
        },
      ],
      workedExamples: [
        {
          title: 'Clip điện thoại 1080p dài 30 giây, 48 MB, ở mức Cân bằng',
          body: 'Đầu vào: một tệp MP4 dài 30 giây từ điện thoại, 1920 x 1080, 48 MB, tương đương khoảng 12,8 Mbps. Thiết lập: Cân bằng, MP4, H.264, giữ nguyên độ phân giải, giữ âm thanh. Máy chủ chạy libx264 ở CRF 26 với yuv420p và faststart, và mã hóa lại âm thanh thành AAC 128 kbps, nên riêng track âm thanh chiếm khoảng 0,5 MB của kết quả (128 kbps x 30 giây). Mọi thứ còn lại do hình ảnh quyết định: CRF 26 bỏ đi hạt mịn và nhiễu trước tiên, nên một cảnh quay cầm tay ổn định sẽ chỉ còn một phần nhỏ so với nguồn 12,8 Mbps, còn cảnh hành động nhanh hoặc nhiều nhiễu máy ảnh sẽ giảm ít hơn. Quá trình mã hóa là một lượt duy nhất qua 900 khung hình 1080p với preset mặc định medium; trên máy chủ của chúng tôi, đó là một tác vụ ngắn, và việc tải lên 48 MB thường chiếm phần lớn thời gian chờ.',
        },
        {
          title: 'Clip 4K dài 60 giây, 160 MB, sang 720p H.265 ở mức Tệp nhỏ nhất',
          body: 'Đầu vào: một tệp MP4 3840 x 2160 dài 60 giây, 160 MB, khoảng 21 Mbps, nằm trong giới hạn 200 MB dành cho khách. Thiết lập: Tệp nhỏ nhất, MP4, codec H.265, độ phân giải 720p, bỏ âm thanh. FFmpeg áp dụng scale=-1:720, cho ra 1280 x 720: 0,92 megapixel mỗi khung hình so với 8,3 của nguồn, tức khoảng một phần chín số điểm ảnh trước khi codec bắt đầu làm việc. Sau đó libx265 chạy ở CRF 31 với -tag:v hvc1 và -an bỏ âm thanh. Sự kết hợp giữa số điểm ảnh ít hơn chín lần, một codec hiệu quả hơn và CRF cao là nơi tạo ra mức giảm lớn nhất, nên hãy chờ đợi một kết quả tính bằng vài megabyte chứ không phải hàng chục. Thời gian chủ yếu dành cho việc giải mã khung hình 4K và cho libx265, vốn chậm hơn rõ rệt so với libx264 ở cùng preset, nên tác vụ này lâu hơn ví dụ 1080p dù đầu ra nhỏ hơn.',
        },
      ],
      whenNotToUse: 'Đừng nén một tệp mà bạn vẫn định chỉnh sửa hoặc chỉnh màu; mỗi lần mã hóa lại đều mất chi tiết, và trình dựng phim cần bản gốc hoặc một bản trung gian ProRes từ trình chuyển đổi đầy đủ. Đừng dùng công cụ này để làm clip phát được trên một thiết bị cụ thể nếu vấn đề nằm ở định dạng chứa chứ không phải kích thước; trình chuyển đổi video đổi định dạng mà không giảm chất lượng. Nếu mục tiêu duy nhất của bạn là cắt ra một đoạn, công cụ cắt video sao chép các luồng mà không mã hóa lại, vừa nhanh hơn vừa không mất dữ liệu. Và nếu tệp lớn vì nó dài, nén sẽ giúp ít hơn bạn mong đợi; một bản ghi 20 phút ở CRF 26 vẫn là một bản ghi 20 phút.',
      whyMediaManipulator: [
        'Giá trị CRF của từng mức được ghi rõ trên trang này, nên bạn có thể đoán trước mức Tệp nhỏ nhất sẽ ảnh hưởng thế nào đến cảnh quay nhiều chi tiết mà không cần chờ kết quả.',
        'H.265 trong MP4 được gắn thẻ hvc1 mà trình phát của Apple yêu cầu, điều nhiều trình nén trực tuyến bỏ quên.',
        'Việc mã hóa chạy trên máy chủ của chính chúng tôi bằng FFmpeg; không có gì được giao cho dịch vụ xử lý bên ngoài, và không có hình mờ nào được thêm vào.',
        'Mỗi lần nén được tính là một tác vụ thường trong hạn mức hằng ngày: mặc định 5 lượt mỗi ngày khi không có tài khoản, 30 lượt với tài khoản miễn phí. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Trình nén mã hóa lại video của bạn trên máy chủ của chính chúng tôi bằng FFmpeg. Tệp tải lên được lưu trong uploads/<jobId>/ và tệp đã nén trong outputs/<jobId>/; cả hai đều được ghi trong sổ theo dõi thời hạn lưu và bị xóa khi hết hạn. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Vì đây là một lượt chuyển đổi tiêu chuẩn, tệp tải lên cũng đi qua bước phân tích nội dung tự động của chúng tôi trên cùng phần cứng (các khung hình lấy mẫu được mô tả bằng một mô hình thị giác cục bộ, âm thanh được chép lời cục bộ); báo cáo đó được lưu cùng tác vụ và không được chia sẻ với bên thứ ba. Siêu dữ liệu của định dạng chứa được giữ nguyên trừ khi bạn chọn xóa; không có gì được gửi đến nhà cung cấp AI hoặc dịch vụ xử lý bên ngoài.',
      faq: [
        {
          question: 'Nén có làm video của tôi trông tệ hơn không?',
          answer: 'Mỗi lần mã hóa lại luôn mất một ít chi tiết. Ở mức Chất lượng cao (CRF 22) và Cân bằng (CRF 26), phần mất chủ yếu là hạt mịn và nhiễu mà đa số người xem không nhận ra; ở mức Tệp nhỏ nhất (CRF 31), bạn có thể thấy hình bị mềm đi với cảnh quay nhiều chi tiết. Giữ nguyên độ phân giải giúp tránh hiện tượng nhòe do thu nhỏ gây ra.',
        },
        {
          question: 'Tôi nên chọn H.264, H.265 hay WebM?',
          answer: 'MP4 H.264 phát được trên mọi thiết bị, kể cả TV đời cũ và laptop công ty. H.265 cho tệp nhỏ hơn ở cùng CRF nhưng cần thiết bị giải mã được HEVC; chúng tôi gắn thẻ hvc1 để trình phát của Apple chấp nhận. WebM (VP9 và Opus) là lựa chọn cho các trang web mà bạn kiểm soát trình phát.',
        },
        {
          question: 'Tệp sẽ nhỏ đi bao nhiêu?',
          answer: 'Điều đó phụ thuộc vào bitrate của nguồn và nội dung. Một clip điện thoại ở 12 Mbps còn nhiều dư địa và giảm mạnh ở CRF 26; một tệp đã được mã hóa ở bitrate vừa phải thì giảm ít, vì CRF chỉ dùng đúng lượng bit mà hình ảnh cần. Hạ xuống 720p và bỏ âm thanh luôn có ích.',
        },
        {
          question: 'Trình nén có thêm hình mờ hoặc thay đổi tốc độ khung hình không?',
          answer: 'Không. Tốc độ khung hình, thời lượng và tỷ lệ khung hình được giữ nguyên, và không có gì được vẽ lên hình. Chỉ codec, CRF, chiều cao tùy chọn và việc bỏ âm thanh tùy chọn là thay đổi.',
        },
        {
          question: 'Nén video có miễn phí không, và giới hạn là gì?',
          answer: 'Mặc định, khách có 5 tác vụ thường mỗi ngày với tệp tối đa 200 MB và 5 phút video, đầu ra tối đa 1080p; tài khoản miễn phí nâng lên 30 lượt mỗi ngày, 1 GB và 20 phút. Lượt nén thất bại được hoàn lại. Các con số hiện hành có trên trang giá.',
        },
        {
          question: 'Vì sao đầu ra không nhỏ hơn bản gốc?',
          answer: 'Nguồn có lẽ đã được nén hiệu quả từ trước, hoặc có bitrate thấp so với độ phân giải. CRF không thể xuống dưới mức hình ảnh cần nếu không chọn mức nén thấp hơn. Hãy thử Tệp nhỏ nhất, hoặc hạ độ phân giải, hoặc chuyển sang H.265.',
        },
        {
          question: 'Tôi có thể nén video không có âm thanh, hoặc giữ nguyên âm thanh gốc không?',
          answer: 'Nguồn không có tiếng vẫn sẽ không có tiếng. Âm thanh trong track được giữ lại luôn được trang này mã hóa lại thành AAC (MP4) hoặc Opus (WebM); trình chuyển đổi video đầy đủ là nơi bạn đặt bitrate âm thanh cụ thể.',
        },
      ],
      related: [
        {
          label: 'Cắt video',
          to: '/tools/video-trimmer',
          description: 'Cắt clip trước; sau đó trình nén sẽ có ít nội dung cần mã hóa hơn.',
        },
        {
          label: 'Chuyển video sang GIF động',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Với clip vài giây, GIF là định dạng phát ngay trong nội dung.',
        },
        {
          label: 'Chuyển mã sang HLS',
          to: '/tools/transcode-to-hls',
          description: 'Đóng gói video thành luồng thích ứng thay vì một tệp duy nhất.',
        },
        {
          label: 'Tách âm thanh khỏi video',
          to: '/tools/extract-audio-from-video',
          description: 'Chỉ giữ track âm thanh dưới dạng MP3, WAV hoặc FLAC.',
        },
        {
          label: 'Chuyển video thành văn bản',
          to: '/tools/transcribe-video',
          description: 'Lấy lời nói dưới dạng văn bản trước hoặc sau khi nén.',
        },
        {
          label: 'Hướng dẫn trình chuyển đổi video',
          to: '/tutorials/video/getting-started',
          description: 'Hướng dẫn từng bước cho mọi tùy chọn video.',
        },
      ],
      embed: {
        title: 'Nén video',
        description: 'Tải video lên và chọn một thiết lập chất lượng nhỏ hơn hoặc bitrate thấp hơn. Giữ nguyên codec để có kết quả nhanh nhất, hoặc chuyển sang WebM/H.265 để có tệp nhỏ hơn trên thiết bị hiện đại. Giữ nguyên độ phân giải cho kết quả trông tự nhiên nhất.',
      },
    },
    'video-trimmer': {
      name: 'Cắt video',
      h1: 'Cắt video trực tuyến miễn phí',
      tagline: 'Cắt đoạn clip về phần bạn muốn bằng thao tác cắt nhanh, giữ nguyên chất lượng, không cần mã hóa lại khi có thể.',
      metaTitle: 'Cắt video trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ cắt video trực tuyến miễn phí. Đặt thời điểm bắt đầu và kết thúc rồi cắt clip nhanh, không giảm chất lượng. Xuất MP4, không hình mờ, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Cắt video trực tuyến miễn phí',
      ogDescription: 'Cắt video về đúng phần bạn muốn bằng thao tác cắt nhanh, giữ nguyên chất lượng. Miễn phí, không hình mờ.',
      intro: 'Cắt video là giữ lại một đoạn của video và bỏ phần còn lại. Hầu hết công cụ cắt trực tuyến mã hóa lại toàn bộ clip để làm việc đó, vừa chậm vừa giảm chất lượng. Theo mặc định, trang này làm một việc đơn giản hơn: yêu cầu FFmpeg tua đến thời điểm bắt đầu của bạn và sao chép các gói video và âm thanh đã nén sang một tệp mới trong khoảng thời lượng yêu cầu, không giải mã chúng. Đó là sao chép luồng (stream copy), không mất dữ liệu, và chạy nhanh gần bằng tốc độ đọc tệp. Nếu không thể sao chép, vì codec nguồn không được phép trong định dạng chứa bạn chọn, hoặc vì bạn đã đánh dấu tùy chọn cắt chính xác từng khung hình, máy chủ sẽ chỉ mã hóa lại đoạn đã chọn.',
      whatItDoes: [
        'Cắt một đoạn duy nhất ra khỏi video, từ thời điểm bắt đầu đến thời điểm kết thúc, nhập bằng giây hoặc chọn trên dòng thời gian trực quan.',
        'Sao chép các luồng mà không mã hóa lại bất cứ khi nào định dạng chứa đầu ra chấp nhận codec nguồn, nên phần được giữ lại giống hệt bản gốc đến từng bit.',
        'Tự động chuyển sang mã hóa lại khi việc sao chép bị từ chối, và cho phép bạn buộc mã hóa lại để cắt đúng khung hình.',
        'Mặc định ghi ra MP4, hoặc MOV hay WebM; MP4 và MOV được gắn cờ faststart để video bắt đầu phát trước khi tải xuống xong.',
        'Dùng ffprobe kiểm tra xem tệp có thực sự chứa luồng video không, và từ chối tệp chỉ có âm thanh kèm thông báo rõ ràng.',
      ],
      flowSteps: [
        {
          title: 'Tải video lên',
          description: 'MP4, MOV, M4V, WebM, MKV, AVI, FLV, WMV, MPEG hoặc MPG, tải thẳng lên bucket lưu trữ của chúng tôi.',
        },
        {
          title: 'Đặt điểm bắt đầu và kết thúc',
          description: 'Nhập số giây hoặc kéo hai tay nắm; bảng điều khiển hiển thị độ dài clip thu được.',
        },
        {
          title: 'Chọn định dạng chứa và, nếu cần, độ chính xác khung hình',
          description: 'MP4 được đặt sẵn. Chỉ đánh dấu "Mã hóa lại để cắt chính xác từng khung hình" khi việc cắt đúng khung hình thực sự quan trọng.',
        },
        {
          title: 'FFmpeg cắt',
          description: 'Sao chép luồng với -ss, -t và -c copy; hoặc mã hóa lại bằng libx264 CRF 18 khi không thể sao chép hoặc khi bạn yêu cầu.',
        },
        {
          title: 'Tải clip xuống',
          description: 'Tệp đầu ra mang hậu tố _trimmed và nằm trong thư mục tác vụ cho đến khi hết thời hạn lưu giữ.',
        },
      ],
      advancedDetails: [
        'Lệnh sao chép luồng là ffmpeg -ss START -i input -t DURATION -map 0 -c copy -avoid_negative_ts make_zero [-movflags +faststart] output (runTrimVideo trong specialized_tools.go). -map 0 giữ mọi luồng, kể cả các track âm thanh phụ và phụ đề, và thời gian được ghi với độ chính xác đến mili giây.',
        'Khi -ss đặt trước -i và không giải mã, FFmpeg chỉ có thể bắt đầu tại một keyframe, nên bản sao bắt đầu ở keyframe gần nhất tại hoặc trước thời điểm bắt đầu của bạn. Với video quay bằng điện thoại, các keyframe thường cách nhau 1 đến 2 giây, đó là mức lệch tối đa ở đầu clip; sau đó -avoid_negative_ts make_zero đặt lại mốc dấu thời gian để trình phát bắt đầu gọn gàng.',
        'Nhánh mã hóa lại dùng buildVideoCodecArgs ở mức chất lượng cao: libx264 -crf 18 -pix_fmt yuv420p với AAC cho MP4 và MOV, hoặc libvpx-vp9 -b:v 0 -crf 18 với Opus cho WebM. Chỉ luồng video đầu tiên và luồng âm thanh đầu tiên (nếu có) được ánh xạ, nên các track phụ bị bỏ ở nhánh này.',
        'Chế độ sao chép được gửi dưới dạng auto, tức là thử sao chép trước và mã hóa lại nếu thất bại. Chọn WebM cho nguồn H.264 luôn dẫn đến nhánh mã hóa lại, vì WebM chỉ chấp nhận video VP8, VP9 và AV1.',
        'Kiểm tra trên máy chủ: thời điểm bắt đầu phải từ 0 trở lên, clip phải dài ít nhất 0,1 giây và tối đa 6 giờ, và thời điểm kết thúc phải sau thời điểm bắt đầu. Mọi trường hợp khác đều bị từ chối trước khi FFmpeg chạy và tác vụ được hoàn lại.',
        'Vì cắt video là một chế độ chuyên biệt, tệp tải lên bỏ qua bước phân tích nội dung tự động mà các lượt chuyển đổi tiêu chuẩn có; máy chủ chỉ chạy ffprobe và lệnh cắt.',
      ],
      whyItMatters: [
        'Khoảng lặng ở đầu và đoạn dừng vụng về ở cuối có mặt trong gần như mọi bản ghi, và cắt bỏ chúng là thao tác chỉnh sửa phổ biến nhất.',
        'Cắt không mất dữ liệu nghĩa là bạn có thể cắt tệp gốc mà không tạo ra bản sao thế hệ thứ hai.',
        'Cắt trước giúp mọi bước sau rẻ hơn: nén, thêm phụ đề hay biến clip thành GIF chỉ phải xử lý phần bạn giữ lại.',
      ],
      useCases: [
        {
          title: 'Bản ghi cuộc họp và bài giảng',
          description: 'Bỏ những phút mọi người đang vào phòng trước khi nội dung bắt đầu.',
        },
        {
          title: 'Đoạn nổi bật cho bài đăng mạng xã hội',
          description: 'Giữ 20 giây quan trọng và chỉ tải lên phần đó.',
        },
        {
          title: 'Bằng chứng và báo cáo lỗi',
          description: 'Chia sẻ đúng khoảnh khắc sự cố xảy ra, giữ nguyên chất lượng gốc.',
        },
        {
          title: 'Chuẩn bị GIF hoặc đoạn video để phục hồi',
          description: 'Cắt xuống còn vài giây trước khi đưa clip vào công cụ hoạt động tốt nhất với đầu vào ngắn.',
        },
      ],
      workedExamples: [
        {
          title: 'Cắt 30 giây bằng sao chép luồng từ MP4 1080p dài 4,5 phút, 180 MB',
          body: 'Đầu vào: một MP4 H.264 1920 x 1080 dài 4 phút 30 giây, 180 MB, khoảng 5,3 Mbps, nằm trong giới hạn mặc định 200 MB và 5 phút dành cho khách. Cài đặt: bắt đầu 45,000, kết thúc 75,000, đầu ra MP4, không đánh dấu mã hóa lại. Máy chủ chạy lệnh sao chép với -ss 45.000 và -t 30.000. Vì các gói được sao chép, đầu ra chứa khoảng 30 trong số 270 giây dữ liệu, khoảng 20 MB, với đúng chất lượng, codec và tốc độ khung hình gốc. Đoạn cắt bắt đầu ở keyframe cuối cùng trước giây thứ 45, nên clip có thể mở đầu sớm hơn tối đa một đến hai giây. Tác vụ bị giới hạn bởi tốc độ đọc tệp chứ không phải tính toán, và hoàn tất trong vài giây.',
        },
        {
          title: 'Cắt chính xác từng khung hình 12 giây từ MP4 1080p 60 MB',
          body: 'Đầu vào: một MP4 1920 x 1080 dài 2 phút, 60 MB. Cài đặt: bắt đầu 30,250, kết thúc 42,250, đầu ra MP4, đã đánh dấu "Mã hóa lại để cắt chính xác từng khung hình". Lúc này FFmpeg giải mã chính xác từ 30,250, mã hóa 12 giây (360 khung hình ở 30 fps) bằng libx264 ở CRF 18, yuv420p và faststart, đồng thời mã hóa lại âm thanh sang AAC. CRF 18 giữ hình ảnh rất gần với nguồn bằng mắt thường, nên kết quả có kích thước mỗi giây cùng cỡ với nguồn, vài megabyte cho 12 giây. Chỉ 12 giây được giữ lại mới được mã hóa, không bao giờ là toàn bộ 2 phút, nên đây là một lượt mã hóa ngắn chứ không phải một lần sao chép vài giây.',
        },
      ],
      whenNotToUse: 'Đừng dùng trình cắt để xóa nhiều đoạn riêng biệt khỏi một video; công cụ chỉ giữ đúng một đoạn, nên muốn bỏ phần giữa bạn cần cắt hai lần rồi ghép lại trong Darkroom. Đừng mong sao chép luồng rơi đúng khung hình; nếu một đoạn cắt sớm một giây là vấn đề, hãy đánh dấu tùy chọn mã hóa lại và chấp nhận một lượt mã hóa ngắn. Nếu mục tiêu thực sự của bạn là tệp nhỏ hơn, việc cắt chỉ giúp được tương ứng với phần bạn cắt bỏ; bộ nén mới là công cụ thay đổi bitrate. Và nếu tệp tải lên không có luồng video, ví dụ một tệp M4A bị đổi tên thành MP4, trình cắt sẽ từ chối nó; các công cụ âm thanh xử lý tệp chỉ có âm thanh.',
      whyMediaManipulator: [
        'Sao chép luồng không mất dữ liệu là mặc định, với nhánh mã hóa lại dự phòng được ghi rõ thay vì giấu sau một lượt mã hóa lại toàn bộ chậm nhưng an toàn.',
        'Các cờ FFmpeg chính xác có ngay trên trang này, kể cả lý do một đoạn cắt có thể bắt đầu ở keyframe trước đó và cách tránh điều đó.',
        'Một lần cắt dùng một tác vụ thường trong hạn mức hằng ngày của bạn (mặc định 5 tác vụ mỗi ngày với khách, 30 với tài khoản miễn phí), và tác vụ thất bại được hoàn lại. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Trình cắt chạy ffprobe và một lệnh FFmpeg trên máy chủ của chính chúng tôi. Ở nhánh mặc định, các gói video và âm thanh được sao chép, không bao giờ được giải mã, nên máy chủ không dựng lại dù chỉ một khung hình từ tệp của bạn; ở nhánh mã hóa lại, FFmpeg chỉ giải mã những giây bạn giữ lại. Tệp tải lên nằm trong uploads/<jobId>/ và clip nằm trong outputs/<jobId>/, cả hai đều được ghi vào sổ lưu giữ và bị xóa khi hết thời hạn. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Cắt video là một chế độ chuyên biệt, nên bước phân tích nội dung tự động mà các lượt chuyển đổi tiêu chuẩn có không được chạy trên tệp này, và không có gì được gửi đến dịch vụ của bên thứ ba.',
      faq: [
        {
          question: 'Cắt video có mã hóa lại video của tôi không?',
          answer: 'Theo mặc định thì không. Máy chủ sao chép các luồng đã nén bằng -c copy, nên phần được giữ lại giống hệt bản gốc. Video chỉ được mã hóa lại khi bạn đánh dấu tùy chọn cắt chính xác từng khung hình hoặc khi định dạng chứa bạn chọn không chứa được codec nguồn, như WebM với tệp H.264.',
        },
        {
          question: 'Vì sao clip của tôi bắt đầu sớm hơn một chút so với thời điểm tôi nhập?',
          answer: 'Sao chép luồng chỉ có thể bắt đầu tại một keyframe, và FFmpeg chọn keyframe gần nhất tại hoặc trước thời điểm bắt đầu của bạn. Với cảnh quay từ máy ảnh, các keyframe thường cách nhau 1 đến 2 giây. Hãy đánh dấu "Mã hóa lại để cắt chính xác từng khung hình" để bắt đầu đúng khung hình.',
        },
        {
          question: 'Tôi có thể chọn những định dạng chứa đầu ra nào, và định dạng nào giữ nguyên chất lượng gốc?',
          answer: 'MP4, MOV và WebM. MP4 và MOV chấp nhận video H.264 hoặc HEVC và âm thanh AAC mà hầu hết máy ảnh tạo ra, nên chúng vẫn không mất dữ liệu. WebM chỉ chấp nhận VP8, VP9 và AV1, nên với lựa chọn đó, nguồn H.264 sẽ được mã hóa lại sang VP9 ở CRF 18.',
        },
        {
          question: 'Clip sau khi cắt có thể dài hoặc ngắn đến mức nào?',
          answer: 'Ít nhất 0,1 giây và tối đa 6 giờ, với thời điểm kết thúc nằm sau thời điểm bắt đầu. Trên thực tế, giới hạn tải lên sẽ áp dụng trước: mặc định là 5 phút video với khách, 20 phút với tài khoản miễn phí, 2 giờ với Premium.',
        },
        {
          question: 'Công cụ có giữ mọi track âm thanh và phụ đề không?',
          answer: 'Ở nhánh sao chép luồng thì có: -map 0 sao chép mọi luồng trong tệp. Ở nhánh mã hóa lại, chỉ luồng video đầu tiên và luồng âm thanh đầu tiên được giữ lại.',
        },
        {
          question: 'Tôi có thể cắt một video thành nhiều phần cùng lúc không?',
          answer: 'Không. Một lần tải lên tạo ra một clip từ một đoạn. Để có nhiều phần, hãy chạy trình cắt một lần cho mỗi đoạn, hoặc ghép các phần trên dòng thời gian trong Darkroom.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Sao chép luồng khi có thể (không giảm chất lượng); nhánh mã hóa lại dự phòng dùng H.264 + AAC cho MP4.',
        ],
      },
      related: [
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Thu nhỏ clip sau khi cắt.',
        },
        {
          label: 'Chuyển video sang GIF động',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Biến những giây đã cắt thành GIF.',
        },
        {
          label: 'Tách âm thanh khỏi video',
          to: '/tools/extract-audio-from-video',
          description: 'Chỉ lưu phần âm thanh của clip.',
        },
        {
          label: 'Phục hồi video bằng AI',
          to: '/tools/ai-video-restoration',
          description: 'Tính năng phục hồi hoạt động trên các đoạn dài tối đa 15 giây; hãy cắt trước.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Ghép nhiều đoạn đã cắt thành một bản dựng.',
        },
      ],
      embed: {
        title: 'Cắt video',
        description: 'Tải video lên, rồi đặt thời điểm bắt đầu và kết thúc (hoặc chọn đoạn một cách trực quan). Chúng tôi giữ nguyên chất lượng gốc bằng thao tác cắt nhanh, không mất dữ liệu bất cứ khi nào có thể.',
      },
    },
    'extract-audio-from-video': {
      name: 'Tách âm thanh khỏi video',
      h1: 'Tách âm thanh khỏi video',
      tagline: 'Lưu track âm thanh của bất kỳ video nào thành tệp MP3, WAV, M4A, AAC, FLAC hoặc OGG sạch.',
      metaTitle: 'Tách âm thanh khỏi video: MP3, WAV, M4A và hơn thế | Media Manipulator',
      metaDescription: 'Công cụ trực tuyến miễn phí để tách âm thanh khỏi mọi tệp video (MP4, MOV, MKV, WebM, AVI). Xuất ra MP3, WAV, M4A, AAC, FLAC hoặc OGG. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Tách âm thanh khỏi video',
      ogDescription: 'Lưu track âm thanh của MP4/MOV/MKV/WebM/AVI thành MP3, WAV, M4A, AAC, FLAC hoặc OGG. Miễn phí, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      intro: 'Mọi container video đều chứa âm thanh dưới dạng một luồng riêng, nên việc lấy âm thanh ra hoàn toàn không liên quan đến hình ảnh. Trang này yêu cầu FFmpeg chọn luồng âm thanh đầu tiên, bỏ qua video và mã hóa luồng đó sang định dạng bạn chọn: MP3 cho mọi thiết bị phát nhạc, WAV hoặc FLAC khi bạn muốn giữ nguyên các mẫu âm thanh, M4A hoặc AAC cho tệp nhỏ mà điện thoại phát được sẵn, hoặc OGG Vorbis. Trước khi bắt đầu, máy chủ dùng ffprobe để kiểm tra xem có luồng âm thanh hay không, vì nếu không FFmpeg sẽ lặng lẽ ghi ra một tệp rỗng mà không báo lỗi.',
      whatItDoes: [
        'Chọn luồng âm thanh đầu tiên (-map 0:a:0) từ MP4, MOV, M4V, WebM, MKV, AVI và các container video phổ biến khác, rồi loại bỏ video (-vn).',
        'Mã hóa MP3 bằng libmp3lame ở chất lượng 2 (bitrate thay đổi, trung bình khoảng 190 kbps), WAV dưới dạng PCM 16-bit, M4A hoặc AAC ở 192 kbps, FLAC không mất dữ liệu, hoặc OGG bằng libvorbis ở chất lượng 5.',
        'Giữ nguyên tần số lấy mẫu và số kênh gốc; không lấy mẫu lại hay trộn giảm kênh.',
        'Từ chối ngay từ đầu video không có luồng âm thanh, kèm thông báo rằng không có gì để tách.',
        'Trả về một tệp âm thanh duy nhất mang tên tệp gốc với phần mở rộng bạn chọn.',
      ],
      flowSteps: [
        {
          title: 'Tải video lên',
          description: 'Bất kỳ container phổ biến nào; tệp đi thẳng vào bucket lưu trữ của chúng tôi và API nhận lấy từ đó.',
        },
        {
          title: 'Chọn định dạng âm thanh',
          description: 'MP3 được chọn sẵn. WAV và FLAC không mất dữ liệu; M4A và AAC gọn nhẹ; OGG là lựa chọn mở có mất dữ liệu.',
        },
        {
          title: 'ffprobe xác nhận có luồng âm thanh',
          description: 'Video không có tiếng sẽ dừng ở đây với thông báo lỗi rõ ràng thay vì tạo ra một tệp rỗng.',
        },
        {
          title: 'FFmpeg mã hóa luồng',
          description: 'Một lệnh duy nhất với -map 0:a:0 -vn và bộ mã hóa cho định dạng của bạn.',
        },
        {
          title: 'Tải âm thanh về',
          description: 'Tệp nằm trong thư mục của tác vụ cho đến khi hết thời hạn lưu.',
        },
      ],
      advancedDetails: [
        'Lệnh là ffmpeg -y -i input -map 0:a:0 -vn <encoder args> output (runExtractAudio trong specialized_tools.go). -vn nghĩa là luồng video không bao giờ được giải mã, vì vậy việc tách diễn ra nhanh ngay cả với nguồn 4K.',
        'MP3 dùng -c:a libmp3lame -q:a 2, thiết lập bitrate thay đổi LAME V2, trung bình khoảng 190 kbps với nhạc và thấp hơn với giọng nói. WAV dùng -c:a pcm_s16le, nên một nguồn stereo 44,1 kHz tốn khoảng 10,1 MB mỗi phút và một nguồn 48 kHz khoảng 11 MB mỗi phút.',
        'M4A và AAC đều dùng bộ mã hóa AAC gốc của FFmpeg với -b:a 192k. FLAC không mất dữ liệu và thường có dung lượng bằng 50 đến 70 phần trăm WAV. OGG dùng -c:a libvorbis -q:a 5, khoảng 160 kbps.',
        'Không truyền cờ -ar hay -ac, nên đầu ra giữ nguyên tần số lấy mẫu và bố cục kênh của nguồn; âm thanh vòm 5.1 vẫn là 5.1 trong WAV và FLAC, còn MP3 chỉ mang tối đa hai kênh.',
        'Chỉ luồng 0:a:0 được ánh xạ. Với tệp có track bình luận hoặc ngôn ngữ thứ hai, bạn nhận được track nào được liệt kê đầu tiên trong container.',
        'Tách âm thanh là một chế độ chuyên biệt: bản tải lên không được đưa vào hàng đợi phân tích nội dung tự động mà các lượt chuyển đổi thông thường trải qua, và các điều khiển chất lượng, đổi kích thước và hiệu ứng của bộ chuyển đổi video không áp dụng.',
      ],
      whyItMatters: [
        'Podcaster, người chép lời và biên tập viên thường cần âm thanh mà không cần điểm ảnh, và video thường lớn gấp 20 đến 50 lần phần âm thanh bên trong.',
        'Một tệp MP3 hoặc M4A được gắn thẻ đúng phát được trên mọi điện thoại và mọi trình phát mà không cần giải mã video, vốn rất hao pin.',
        'Đầu ra WAV hoặc FLAC không mất dữ liệu là đầu vào phù hợp cho việc làm sạch tiếng ồn, tách giọng hát hoặc chép lời cẩn thận.',
      ],
      useCases: [
        {
          title: 'Tập chỉ có âm thanh',
          description: 'Đăng phần âm thanh của một buổi phỏng vấn quay video thành tập podcast MP3.',
        },
        {
          title: 'Chuẩn bị chép lời',
          description: 'Đưa bản ghi 18 phút cho người chép lời dưới dạng MP3 25 MB thay vì MP4 540 MB.',
        },
        {
          title: 'Thiết kế âm thanh và lấy mẫu',
          description: 'Lấy tệp WAV từ một clip để dùng lại âm thanh môi trường hoặc nhạc trong một bản dựng khác.',
        },
        {
          title: 'Ghi chú bài giảng',
          description: 'Giữ lại phần âm thanh của buổi học được ghi hình để nghe khi đang di chuyển.',
        },
      ],
      workedExamples: [
        {
          title: 'Bản ghi 720p dài 18 phút, 540 MB sang MP3',
          body: 'Đầu vào: một tệp MP4 1280 x 720 dài 18 phút, dung lượng 540 MB (khoảng 4 Mbps), được tải lên bằng tài khoản miễn phí vì vượt mức mặc định 200 MB và 5 phút dành cho khách. Thiết lập: MP3. Máy chủ dùng ffprobe xác nhận track AAC stereo 48 kHz và chạy libmp3lame -q:a 2. Ở khoảng 190 kbps, mỗi phút tốn khoảng 1,4 MB, nên kết quả ra khoảng 25 MB, chừng một phần hai mươi bản tải lên. Vì -vn bỏ qua hoàn toàn phần video, tác vụ chỉ là giải mã và mã hóa âm thanh đơn thuần nên rất nhanh; tải lên 540 MB mất nhiều thời gian hơn hẳn so với việc tách âm thanh từ tệp đó.',
        },
        {
          title: 'Video ca nhạc 1080p dài 4 phút, 95 MB sang WAV',
          body: 'Đầu vào: một tệp MP4 1920 x 1080 dài 4 phút, dung lượng 95 MB, có track AAC stereo 44,1 kHz, nằm trong giới hạn dành cho khách. Thiết lập: WAV. FFmpeg giải mã AAC một lần và ghi PCM 16-bit bằng pcm_s16le, giữ nguyên 44,1 kHz và hai kênh. PCM ở tần số đó là 44.100 x 16 x 2 bit mỗi giây, khoảng 10,1 MB mỗi phút, nên tệp ra khoảng 40 MB bất kể bản nhạc to hay dày đặc đến đâu. Nếu chọn FLAC, chính những mẫu đó sẽ được nén không mất dữ liệu xuống khoảng 20 đến 28 MB tùy chất liệu. Thời gian xử lý chỉ là vài giây giải mã âm thanh; phần video không hề bị động đến.',
        },
      ],
      whenNotToUse: 'Đừng dùng trang này để cải thiện âm thanh; nó chỉ sao chép những gì có sẵn, và một bản ghi bị ồn hoặc thu từ xa vẫn sẽ ồn. Các công cụ Làm sạch âm thanh giọng nói và Loại bỏ tiếng ồn nền được tạo ra cho việc đó. Đừng mong tệp WAV khôi phục được chất lượng mà video đã mất; track nguồn gần như luôn là AAC có mất dữ liệu, nên WAV là bản sao trung thực của một tín hiệu đã nén, không phải bản master phòng thu. Nếu video có hai track ngôn ngữ và bạn cần track thứ hai, công cụ này chỉ lấy track đầu tiên. Và nếu thứ bạn thực sự cần là lời nói, công cụ chép lời sẽ đọc âm thanh và cho bạn văn bản cùng phụ đề trực tiếp.',
      whyMediaManipulator: [
        'Thiết lập bộ mã hóa được nêu rõ: LAME V2 cho MP3, 192 kbps cho AAC, PCM 16-bit cho WAV, và tần số lấy mẫu gốc xuyên suốt.',
        'Video không có tiếng được ffprobe phát hiện trước khi bất cứ thứ gì chạy, nên bạn không bao giờ tải về một tệp rỗng.',
        'Mỗi lần tách được tính là một tác vụ thường trong hạn mức hằng ngày: theo mặc định, khách có 5 tác vụ mỗi ngày, tài khoản miễn phí có 30; tác vụ bị từ chối hoặc thất bại được hoàn lại. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Việc tách chạy trên máy chủ của chính chúng tôi dưới dạng một lệnh FFmpeg duy nhất, chỉ đọc luồng âm thanh đầu tiên trong bản tải lên của bạn; các khung hình video không bao giờ được giải mã. Tệp tải lên nằm trong uploads/<jobId>/ và âm thanh nằm trong outputs/<jobId>/, cả hai đều được ghi vào sổ thời hạn lưu và bị xóa khi hết thời hạn. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Vì tách âm thanh là một chế độ chuyên biệt, bản tải lên không đi qua bước phân tích nội dung tự động mà các lượt chuyển đổi thông thường trải qua; tệp không được chép lời hay mô tả, và không có gì rời khỏi phần cứng của chúng tôi.',
      faq: [
        {
          question: 'Tôi có thể tách sang những định dạng âm thanh nào, và định dạng nào không mất dữ liệu?',
          answer: 'MP3, WAV, M4A, AAC, FLAC và OGG. WAV và FLAC là bản sao không mất dữ liệu của track đã giải mã. MP3 (VBR khoảng 190 kbps), M4A và AAC (192 kbps) và OGG (chất lượng 5) có mất dữ liệu nhưng có bitrate cao hơn phần lớn track âm thanh trong video.',
        },
        {
          question: 'Tệp âm thanh tách ra sẽ lớn cỡ nào?',
          answer: 'WAV khoảng 10,1 MB mỗi phút ở 44,1 kHz stereo, hoặc 11 MB ở 48 kHz. MP3 với thiết lập của trang này khoảng 1,4 MB mỗi phút, M4A và AAC khoảng 1,4 MB mỗi phút ở 192 kbps, OGG khoảng 1,2 MB mỗi phút. FLAC thường có dung lượng từ một nửa đến hai phần ba WAV.',
        },
        {
          question: 'Việc tách có làm thay đổi tần số lấy mẫu hay hình ảnh stereo không?',
          answer: 'Không. FFmpeg chạy không có -ar hay -ac, nên đầu ra giữ nguyên tần số lấy mẫu và bố cục kênh của nguồn. Một track stereo 48 kHz vẫn là stereo 48 kHz.',
        },
        {
          question: 'Nếu video của tôi không có âm thanh thì sao?',
          answer: 'Máy chủ kiểm tra tệp trước và dừng lại với thông báo rằng không có gì để tách. Tác vụ được hoàn lại và không có tệp rỗng nào được tạo ra.',
        },
        {
          question: 'Video của tôi có hai track âm thanh; tôi sẽ nhận được track nào?',
          answer: 'Track đầu tiên trong container, tức luồng 0:a:0. Hiện chưa có trình chọn track. Nếu track bạn cần là track thứ hai, hãy đóng gói lại (remux) hoặc xuất lại video với track đó trước.',
        },
        {
          question: 'Tách âm thanh có miễn phí không, và tôi có thể tải lên video dài bao nhiêu?',
          answer: 'Có. Theo mặc định, khách có thể chạy 5 tác vụ thường mỗi ngày với tệp tối đa 200 MB và 5 phút; tài khoản miễn phí cho phép 30 tác vụ mỗi ngày, 1 GB và 20 phút; Premium nhận tệp đến 5 GB và 2 giờ. Giới hạn hiện hành được liệt kê trên trang giá.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Chúng tôi tách luồng âm thanh đầu tiên. Video không có luồng âm thanh nào sẽ trả về thông báo lỗi rõ ràng thay vì một tệp rỗng.',
        ],
      },
      related: [
        {
          label: 'Chuyển video thành văn bản',
          to: '/tools/transcribe-video',
          description: 'Bỏ qua tệp âm thanh và nhận lời nói trực tiếp dưới dạng văn bản.',
        },
        {
          label: 'Làm sạch âm thanh giọng nói',
          to: '/tools/clean-voice-audio',
          description: 'Khử nhiễu và cân bằng mức âm của giọng nói đã tách.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Loại bỏ tiếng ù và tiếng xì khỏi track đã tách.',
        },
        {
          label: 'Xóa giọng hát khỏi bài hát',
          to: '/tools/remove-vocals-from-song',
          description: 'Biến phần nhạc đã tách thành bản nhạc không lời.',
        },
        {
          label: 'Cắt video',
          to: '/tools/video-trimmer',
          description: 'Cắt video về đoạn bạn muốn trước khi tách.',
        },
      ],
      embed: {
        title: 'Tách track âm thanh khỏi video',
        description: 'Tải lên bất kỳ container video phổ biến nào. Chọn MP3 để tương thích rộng, WAV để không mất dữ liệu, hoặc M4A/AAC cho tệp nén gọn nhẹ. Video không có track âm thanh sẽ trả về thông báo lỗi rõ ràng.',
      },
    },
    'convert-video-to-animated-gif': {
      name: 'Chuyển video sang GIF động',
      h1: 'Chuyển video sang GIF động trực tuyến',
      tagline: 'Biến các clip MP4, WebM, MOV hoặc MKV ngắn thành ảnh GIF động dễ chia sẻ chỉ trong vài giây.',
      metaTitle: 'Chuyển video sang GIF động trực tuyến (miễn phí) | Media Manipulator',
      metaDescription: 'Công cụ chuyển video sang GIF trực tuyến miễn phí. Biến các clip MP4, WebM, MOV và MKV ngắn thành GIF động, có thể điều chỉnh kích thước và tốc độ khung hình.',
      ogTitle: 'Chuyển video sang GIF động trực tuyến',
      ogDescription: 'Biến các đoạn video ngắn thành ảnh GIF động dễ chia sẻ. Điều chỉnh tốc độ khung hình, kích thước và vòng lặp.',
      intro: 'Một ảnh GIF động là một chồng khung hình dùng màu chỉ mục, mỗi bảng màu tối đa 256 màu, và không có cơ chế nén giữa các khung hình nào ngoài mã hóa độ dài loạt đơn giản. Đó là lý do một GIF vài giây có thể nặng hơn cả một tệp MP4 dài một phút, và vì sao làm một GIF đẹp chủ yếu là chuyện chọn chiều rộng, tốc độ khung hình và kích thước bảng màu. Trang này chạy một quy trình hai giai đoạn: FFmpeg co giãn video theo chiều rộng bạn đặt và lấy mẫu theo tốc độ khung hình bạn chọn, ghi ra một GIF thô; sau đó gifsicle lượng tử hóa lại bảng màu theo số màu của bạn, đặt độ trễ khung hình và tối ưu các khung hình để chỉ lưu những điểm ảnh thay đổi. Giá trị mặc định được tinh chỉnh cho bản quay màn hình: rộng 900 điểm ảnh, 12 khung hình mỗi giây, 128 màu.',
      whatItDoes: [
        'Co giãn clip về chiều rộng đã chọn (16 đến 2000 px), với chiều cao được tính từ tỷ lệ khung hình và làm tròn thành bội số của 4.',
        'Lấy mẫu nguồn bằng FFmpeg theo tốc độ khung hình đã chọn (1 đến 50 fps; mặc định 12).',
        'Lượng tử hóa mỗi khung hình về bảng màu từ 2 đến 256 màu (mặc định 128) và tối ưu cách lưu giữa các khung hình bằng gifsicle ở mức 1 đến 3.',
        'Đặt độ trễ khung hình tính bằng phần trăm giây, yếu tố quyết định tốc độ phát độc lập với tốc độ lấy mẫu.',
        'Tôn trọng đoạn cắt được đặt trong biểu mẫu chuyển đổi, để chỉ những giây đã chọn trở thành khung hình.',
      ],
      flowSteps: [
        {
          title: 'Tải video lên và chọn GIF',
          description: 'GIF đã được chọn sẵn làm đầu ra trên trang này; tùy chọn Chất lượng bị tắt vì không áp dụng.',
        },
        {
          title: 'Cắt còn vài giây',
          description: 'Dùng công cụ cắt đoạn để giữ khoảnh khắc bạn muốn; mỗi giây thêm vào là thêm 12 khung hình ở tốc độ mặc định.',
        },
        {
          title: 'Đặt chiều rộng, tốc độ khung hình, số màu và độ trễ',
          description: 'Bảng Cài đặt GIF động bắt đầu với 900 px, 12 fps, 128 màu, độ trễ 3, mức tối ưu 3.',
        },
        {
          title: 'FFmpeg lấy mẫu, gifsicle tối ưu',
          description: 'ffmpeg scale=W:-4 -pix_fmt rgb8 -r FPS, rồi gifsicle --optimize --delay --colors --interlace.',
        },
        {
          title: 'Tải GIF xuống',
          description: 'Một ảnh GIF lặp chuẩn mà ứng dụng chat và trình duyệt phát ngay trong nội dung.',
        },
      ],
      advancedDetails: [
        'Giai đoạn một là ffmpeg -i input [-ss START -t DURATION] -vf scale=W:-4 -pix_fmt rgb8 -r FPS -f gif raw.gif (convertVideoToGIF trong converter.go). Giá trị -4 yêu cầu chiều cao giữ đúng tỷ lệ khung hình và chia hết cho 4; rgb8 là định dạng trung gian màu chỉ mục 8-bit mà giai đoạn hai sẽ lượng tử hóa lại.',
        'Giai đoạn hai là gifsicle --optimize=L --delay=D --colors C --interlace raw.gif -o output.gif. Mức tối ưu 3 chậm nhất và cho tệp nhỏ nhất: nó chỉ lưu vùng chữ nhật chứa các điểm ảnh thay đổi giữa các khung hình, đó là lý do một bản quay màn hình có thanh công cụ tĩnh nén tốt hơn nhiều so với một cảnh máy quay lia.',
        'Độ trễ được áp dụng cho mọi khung hình sau khi lấy mẫu và độc lập với tốc độ lấy mẫu. Ở mặc định 12 fps và độ trễ 3 (30 ms mỗi khung hình), clip phát nhanh hơn thời gian thực khoảng 2,8 lần; hãy đặt độ trễ 8 (80 ms, 12,5 fps) để phát gần đúng thời gian thực ở 12 fps, hoặc 10 ở 10 fps.',
        'Chiều rộng nhập vào ô Chiều rộng chính của trình chuyển đổi sẽ ghi đè chiều rộng trong bảng GIF, để người dùng thành thạo chỉ cần chỉnh một chỗ. Số màu bị biểu mẫu giới hạn trong khoảng 2 đến 256; bảng màu GIF không bao giờ vượt quá 256.',
        'Ở đây không có lượt palettegen trong FFmpeg; chất lượng bảng màu đến từ gifsicle --colors, công cụ dựng một bảng màu tối ưu cho toàn bộ hoạt ảnh. Clip dạng ảnh chụp có chuyển màu mượt sẽ đẹp hơn với 256 màu; cảnh quay giao diện phẳng trông y hệt ở 64 màu.',
        'Giai đoạn gifsicle chạy với thời gian chờ tối đa 6 giờ, và tệp tải lên cũng được phân tích nội dung tự động như các lượt chuyển đổi tiêu chuẩn, vì GIF là một định dạng của trình chuyển đổi video thông thường.',
      ],
      whyItMatters: [
        'GIF tự động phát ngay trong nội dung ở trình theo dõi lỗi, ứng dụng chat, trang tài liệu và ứng dụng email, những nơi mà tệp video đính kèm chỉ hiện nút phát hoặc không hiện gì.',
        'Một GIF 5 giây về một lỗi cho thấy cách tái hiện nhanh hơn cả một đoạn văn và không cần trình phát video.',
        'Lựa chọn bảng màu và tốc độ khung hình có thể làm kích thước chênh nhau gấp mười lần, nên việc cho phép tùy chỉnh chúng tốt hơn một thiết lập dùng chung cho mọi trường hợp.',
      ],
      useCases: [
        {
          title: 'Tái hiện lỗi',
          description: 'Quay màn hình, cắt đến đoạn lỗi xảy ra và thả GIF vào phiếu báo lỗi.',
        },
        {
          title: 'Demo trong README và tài liệu',
          description: 'Cho thấy một tính năng đang hoạt động ở nơi không cho phép nhúng video.',
        },
        {
          title: 'Clip biểu cảm',
          description: 'Cắt 3 giây từ một video và chia sẻ ở bất cứ đâu chấp nhận hình ảnh.',
        },
        {
          title: 'Xem trước trong email',
          description: 'Một GIF lặp nhỏ liên kết đến video đầy đủ, ở nơi bản thân video không phát được.',
        },
      ],
      workedExamples: [
        {
          title: 'Bản quay màn hình 1080p dài 8 giây với thiết lập mặc định',
          body: 'Đầu vào: một bản quay màn hình MP4 1920 x 1080 dài 8 giây, khoảng 15 MB. Thiết lập: GIF, chiều rộng 900, 12 fps, 128 màu, độ trễ 3, mức tối ưu 3. FFmpeg co giãn về rộng 900 điểm ảnh, cao khoảng 506 (điều chỉnh về bội số của 4) và lấy mẫu 96 khung hình. Nếu không nén, 96 khung hình màu chỉ mục đó sẽ nặng khoảng 43 MB (900 x 504 x 96 byte), đó là mức trần mà gifsicle bắt đầu giảm xuống; với thanh công cụ tĩnh và con trỏ di chuyển, tối ưu mức 3 chỉ lưu các vùng chữ nhật thay đổi, nên một bản quay màn hình sẽ nhỏ hơn nhiều so với mức trần đó, thường chỉ vài megabyte. Với độ trễ 3, 96 khung hình phát trong khoảng 2,9 giây, nhanh hơn nguồn 8 giây khoảng 2,8 lần; đặt độ trễ 8 để phát trong khoảng 7,7 giây. Tác vụ gồm một lượt mã hóa ngắn cộng một lượt gifsicle qua 96 khung hình.',
        },
        {
          title: 'Clip biểu cảm 5 giây ở 480 px, 10 fps và 64 màu',
          body: 'Đầu vào: một tệp MP4 1080p dài 20 giây, 40 MB, được cắt trong biểu mẫu còn đoạn 5 giây. Thiết lập: GIF, chiều rộng 480, 10 fps, 64 màu, độ trễ 10, mức tối ưu 3. FFmpeg cắt lấy 5 giây, co giãn về rộng 480 điểm ảnh, cao khoảng 270 (làm tròn thành bội số của 4) và lấy mẫu 50 khung hình. Dữ liệu khung hình thô khoảng 6,5 MB (480 x 268 x 50 byte) trước khi tối ưu, và bảng màu 64 màu chỉ cần 6 bit mỗi điểm ảnh, nên một cảnh máy quay có chuyển động khắp khung hình vẫn sẽ nhỏ hơn mức đó khá nhiều, còn cảnh người nói ổn định thì chỉ còn một phần nhỏ. Độ trễ 10 là 100 ms mỗi khung hình, nên 50 khung hình phát trong đúng 5 giây, khớp thời gian thực ở 10 fps.',
        },
      ],
      whenNotToUse: 'Đừng làm GIF cho bất cứ thứ gì dài hơn khoảng 10 giây hoặc có chuyển động kiểu ảnh chụp trên toàn khung hình; định dạng này không thực sự nén giữa các khung hình, nên những clip như vậy sẽ nặng hàng chục megabyte, trong khi một tệp MP4 hoặc WebM cùng nội dung chỉ bằng một phần mười. Đừng dùng GIF khi độ trung thực màu sắc quan trọng, vì mỗi khung hình bị giới hạn trong bảng màu 256 màu và các vùng chuyển màu sẽ bị phân dải. Nếu nơi đăng phát được video ngay trong nội dung, một tệp MP4 đã nén tốt hơn về mọi mặt. Và nếu bạn cần âm thanh, GIF hoàn toàn không chứa được.',
      whyMediaManipulator: [
        'Cả hai giai đoạn của quy trình cùng giá trị mặc định đều được ghi rõ ở đây, kể cả cơ chế độ trễ khiến GIF mặc định phát nhanh.',
        'Chiều rộng, tốc độ khung hình, số màu, độ trễ và mức tối ưu đều có thể tùy chỉnh, chứ không chỉ một thanh trượt kích thước duy nhất.',
        'Mỗi lượt chuyển đổi GIF được tính là một tác vụ thường (mặc định 5 lượt mỗi ngày với khách, 30 lượt với tài khoản miễn phí), và tác vụ thất bại được hoàn lại. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Việc chuyển đổi GIF chạy trên máy chủ của chính chúng tôi: FFmpeg lấy mẫu và co giãn khung hình, rồi gifsicle lượng tử hóa và tối ưu chúng; một GIF thô tạm thời bị xóa ngay khi gifsicle chạy xong. Tệp tải lên được lưu trong uploads/<jobId>/ và GIF trong outputs/<jobId>/, cả hai đều được ghi trong sổ theo dõi thời hạn lưu và bị xóa khi hết hạn. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Vì là một định dạng của trình chuyển đổi video tiêu chuẩn, tệp tải lên cũng đi qua bước phân tích nội dung tự động của chúng tôi trên cùng phần cứng (các khung hình lấy mẫu được mô tả bằng một mô hình thị giác cục bộ, âm thanh nếu có được chép lời cục bộ); báo cáo đó được lưu cùng tác vụ và không được chia sẻ với bên thứ ba.',
      faq: [
        {
          question: 'Vì sao GIF của tôi phát nhanh hơn video gốc?',
          answer: 'Độ trễ khung hình được đặt sau khi lấy mẫu và mặc định là 3 phần trăm giây, tương đương khoảng 33 khung hình mỗi giây khi phát, trong khi khung hình được lấy mẫu ở 12 khung hình mỗi giây. Hãy đặt độ trễ 8 ở 12 fps, hoặc 10 ở 10 fps, để phát đúng thời gian thực.',
        },
        {
          question: 'Làm sao để GIF nhỏ hơn?',
          answer: 'Theo thứ tự hiệu quả: cắt bớt số giây, giảm chiều rộng (480 là đủ cho chat), hạ tốc độ khung hình xuống 8 hoặc 10, và giảm số màu xuống 64 với cảnh quay giao diện phẳng. Giữ mức tối ưu ở 3; mức 1 và 2 chỉ đánh đổi kích thước lấy tốc độ.',
        },
        {
          question: 'Tôi nên dùng bao nhiêu màu?',
          answer: '128, giá trị mặc định, phù hợp với đa số bản quay màn hình. Giao diện phẳng trông y hệt ở 64 màu và tiết kiệm dung lượng. Cảnh quay dạng ảnh chụp có chuyển màu cần 256, mức tối đa của GIF.',
        },
        {
          question: 'Tôi có thể chọn phần nào của video trở thành GIF không?',
          answer: 'Có. Dùng công cụ cắt đoạn trong trình chuyển đổi để đặt điểm bắt đầu và kết thúc; chỉ đoạn đó được lấy mẫu. Càng ngắn càng tốt, vì mỗi giây đều thêm khung hình theo tốc độ đã chọn.',
        },
        {
          question: 'GIF có lặp lại không, và có giữ âm thanh không?',
          answer: 'Có lặp lại, như mọi GIF trên mọi trình phát theo mặc định. GIF không thể chứa âm thanh; định dạng này không có track âm thanh. Hãy tách âm thanh riêng nếu bạn cần.',
        },
        {
          question: 'GIF lớn nhất tôi có thể tạo là bao nhiêu?',
          answer: 'Biểu mẫu cho phép rộng tối đa 2000 px, 50 fps và 256 màu, nhưng GIF với các thiết lập đó sẽ phình to rất nhanh. Bản thân tệp tải lên bị giới hạn theo gói của bạn, mặc định 200 MB và 5 phút video với khách.',
        },
      ],
      related: [
        {
          label: 'Cắt video',
          to: '/tools/video-trimmer',
          description: 'Cắt chính xác số giây cần thiết trước, không mất chất lượng.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Với bất cứ thứ gì dài hơn vài giây, một tệp MP4 nhỏ tốt hơn GIF.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Thêm phụ đề hoặc cắt khung trước khi xuất clip.',
        },
        {
          label: 'Hướng dẫn trình chuyển đổi video',
          to: '/tutorials/video/getting-started',
          description: 'Tìm hiểu các thiết lập cắt đoạn, đổi kích thước và bộ lọc.',
        },
      ],
      embed: {
        title: 'Chuyển một đoạn video sang GIF',
        description: 'Tải lên một video ngắn và chọn GIF làm định dạng đầu ra. Cắt còn dưới khoảng 10 giây và giảm tốc độ khung hình để có tệp nhỏ hơn.',
      },
    },
    'transcribe-video': {
      name: 'Chuyển video thành văn bản',
      h1: 'Chuyển video thành văn bản trực tuyến',
      tagline: 'Trích lời nói trong tệp video hoặc âm thanh thành phụ đề WebVTT hoặc SRT, văn bản thuần hoặc JSON có dấu thời gian.',
      metaTitle: 'Chuyển video thành văn bản trực tuyến (miễn phí) | Media Manipulator',
      metaDescription: 'Công cụ chuyển video thành văn bản trực tuyến miễn phí. Chuyển tệp MP4, MOV, WebM, MKV và âm thanh thành văn bản có thể tìm kiếm, phụ đề VTT hoặc bản chép JSON.',
      ogTitle: 'Chuyển video thành văn bản trực tuyến',
      ogDescription: 'Trích lời nói trong video thành văn bản, phụ đề hoặc bản chép lời JSON. Chạy trên máy chủ GPU nội bộ.',
      intro: 'Công cụ Chuyển video thành văn bản nhận một tệp MP4, MOV, WebM, MKV hoặc một tệp âm thanh thông thường, tách track âm thanh ra và cho chạy qua Whisper trên một máy chủ GPU do chúng tôi vận hành. Bạn chọn dạng kết quả trước khi tải lên: tệp phụ đề WebVTT hoặc SRT có thời gian của từng dòng phụ đề, tệp văn bản thuần chỉ có lời, hoặc tài liệu JSON chứa mọi đoạn kèm thời điểm bắt đầu và kết thúc chính xác đến mili giây. Ngôn ngữ được tự động nhận diện, hoặc bạn có thể nhập mã hai chữ cái để cố định ngôn ngữ.',
      whatItDoes: [
        'Giải mã track âm thanh bằng ffmpeg thành tệp WAV mono 16 kHz, tần số lấy mẫu mà Whisper yêu cầu, và xóa tệp trung gian đó khi tác vụ hoàn tất.',
        'Chạy whisper-ctranslate2 với mô hình Whisper medium ở float16 trên GPU của chúng tôi, có bật bộ lọc phát hiện giọng nói để bỏ qua khoảng lặng và những đoạn nhạc dài.',
        'Ghi ra một tệp tên transcript.vtt, transcript.srt, transcript.txt hoặc transcript.json, tùy theo định dạng bạn đã chọn.',
        'Nhận diện ngôn ngữ nói từ chính âm thanh; mã ngôn ngữ bạn nhập trong biểu mẫu sẽ ghi đè việc nhận diện với các clip ngắn hoặc pha trộn nhiều ngôn ngữ.',
        'Báo cáo trung thực khi không có gì để chép lời: video không có luồng âm thanh, hoặc âm thanh không có lời nói nhận diện được, vẫn hoàn tất với một thông báo ngắn thay vì một tệp trống.',
      ],
      flowSteps: [
        {
          title: 'Tải video hoặc âm thanh lên',
          description: 'MP4, MOV, WebM, MKV, AVI, hoặc tệp âm thanh như MP3, WAV, M4A hay FLAC.',
        },
        {
          title: 'Chọn định dạng',
          description: 'VTT hoặc SRT cho phụ đề, TXT cho bản chép lời dễ đọc, JSON cho dấu thời gian để xử lý tiếp.',
        },
        {
          title: 'ffmpeg tách âm thanh',
          description: 'Track được chuyển thành PCM mono 16 kHz; các khung hình video không bao giờ được giải mã.',
        },
        {
          title: 'Whisper chép lời trên GPU của chúng tôi',
          description: 'Tác vụ chờ đến khi có chỗ trống trên GPU, rồi mô hình medium chạy qua toàn bộ tệp trong một lượt.',
        },
        {
          title: 'Tải bản chép lời xuống',
          description: 'Tệp xuất hiện cùng tác vụ và có thể tải xuống chừng nào tác vụ còn được lưu.',
        },
      ],
      advancedDetails: [
        'Lệnh tách âm thanh chính xác là ffmpeg -vn -acodec pcm_s16le -ar 16000 -ac 1, nên một track stereo 48 kHz được gộp về mono và lấy mẫu lại trước khi đến Whisper. Tệp trung gian đó chiếm 32 KB mỗi giây (khoảng 1,9 MB mỗi phút) dung lượng đĩa trong lúc tác vụ chạy và bị xóa sau đó.',
        'whisper-ctranslate2 được khởi chạy với --model medium --device cuda --compute_type float16 --vad_filter True và --output_format json; API phân tích JSON đó và tự tạo định dạng bạn đã chọn. Mô hình là một thiết lập của máy chủ (WHISPER_CT2_MODEL), nên medium là mặc định, không phải một cam kết.',
        'Đầu ra VTT bắt đầu bằng tiêu đề WEBVTT và đánh số từng dòng phụ đề; dấu thời gian có dạng HH:MM:SS.mmm. SRT là cùng danh sách dòng phụ đề nhưng dùng dấu phẩy để ngăn cách mili giây. Đoạn nào có thời điểm kết thúc bằng thời điểm bắt đầu sẽ được cho thêm nửa giây để trình phát vẫn hiển thị.',
        'Đầu ra JSON chứa language, hasAudio, hasSpeech, transcript, durationSeconds và một mảng segments gồm {id, start, end, text} với thời gian làm tròn đến mili giây. Đầu ra này không có thời gian theo từng từ và không có điểm tin cậy.',
        'Mặc định mỗi lần chỉ chạy một tiến trình Whisper (WHISPER_GPU_CONCURRENCY=1), và bộ lập lịch GPU kiểm tra VRAM còn trống trước khi bắt đầu; mô hình medium ở float16 cần khoảng 3,5 GB cộng 512 MB dự phòng. Nếu card đang bận, tác vụ của bạn chờ trong hàng đợi thay vì thất bại.',
        'Khi bật bộ lọc VAD, một tệp toàn nhạc hoặc lời nói rất nhỏ có thể trả về thông báo "Audio was detected but no recognizable speech was found." (phát hiện có âm thanh nhưng không tìm thấy lời nói nhận diện được). Thông báo đó được ghi vào tệp bản chép lời để tệp tải xuống không bao giờ trống.',
      ],
      whyItMatters: [
        'Một tệp phụ đề quyết định video có thể được xem khi tắt tiếng, được tìm kiếm hay được trích dẫn hay không.',
        'Các đoạn có dấu thời gian cho phép bạn nhảy đến đúng lúc một câu được nói ra, điều biến một bản ghi hai giờ thành thứ bạn thực sự dùng được.',
        'Giữ việc chép lời trên phần cứng do chúng tôi vận hành nghĩa là âm thanh không bị giao cho một API nhận dạng giọng nói bên ngoài.',
      ],
      useCases: [
        {
          title: 'Phụ đề cho video đã đăng',
          description: 'Xuất VTT cho video HTML và hầu hết trình phát web, hoặc SRT cho phần mềm dựng phim và quy trình phụ đề kiểu truyền hình.',
        },
        {
          title: 'Ghi chú cuộc họp và phỏng vấn',
          description: 'Đưa đầu ra TXT vào một tài liệu và chỉnh sửa từ đó thay vì gõ lại từ đầu.',
        },
        {
          title: 'Lập chỉ mục kho bản ghi',
          description: 'Dùng các đoạn JSON để xây dựng chỉ mục tìm kiếm trỏ đến đúng giây một từ được nói ra.',
        },
        {
          title: 'Bản nháp đầu tiên của một bài viết',
          description: 'Chép lời một bài nói hoặc bản quay màn hình, rồi viết lại văn bản thuần thành bài văn.',
        },
      ],
      workedExamples: [
        {
          title: 'Tệp MP4 1080p dài 9 phút, 120 MB, thành phụ đề VTT',
          body: '120 MB nằm dưới giới hạn 200 MB dành cho khách, nhưng 9 phút vượt giới hạn 5 phút dành cho khách, nên tệp này cần tài khoản miễn phí, mặc định cho phép 20 phút. ffmpeg ghi một tệp WAV mono 16 kHz khoảng 17 MB (32.000 byte mỗi giây trong 540 giây), tệp này bị xóa sau khi chạy xong. Sau đó Whisper medium tạo các dòng phụ đề được đánh số với thời gian dạng HH:MM:SS.mmm, và tệp transcript.vtt thu được chỉ vài kilobyte, vì nó chỉ chứa văn bản và dấu thời gian. Tải lên 120 MB bằng kết nối gia đình thường lâu hơn bước tách âm thanh, vốn chỉ mất vài giây; phần còn lại là lượt Whisper, và thời gian của nó tăng theo độ dài lời nói chứ không theo kích thước video.',
        },
        {
          title: 'Podcast MP3 dài 18 phút, khoảng 26 MB, thành JSON',
          body: 'Một tệp MP3 192 kbps tương đương 24 KB mỗi giây, nên 1.080 giây vào khoảng 26 MB. Tệp chỉ có âm thanh bị áp cùng giới hạn thời lượng như video, nên 18 phút cần tài khoản miễn phí (giới hạn 20 phút) thay vì phiên khách (5 phút). Không có video để bỏ qua, nhưng tệp vẫn được chuyển thành PCM mono 16 kHz trước (khoảng 35 MB trên đĩa, bị xóa sau đó). Ngôn ngữ được nhận diện từ âm thanh và ghi vào JSON dưới dạng mã hai chữ cái, và mỗi đoạn mang thời điểm bắt đầu và kết thúc riêng. Tệp JSON lớn hơn tệp TXT của cùng bản ghi vì mỗi đoạn được bọc trong một đối tượng riêng, nhưng vẫn nhỏ hơn một megabyte khá nhiều.',
        },
      ],
      whenNotToUse: 'Đừng dùng công cụ này khi bạn cần thời gian theo từng từ, nhãn người nói hoặc điểm tin cậy: đầu ra không có những thứ đó, chỉ có dấu thời gian ở cấp đoạn. Đây cũng không phải công cụ phù hợp cho tệp mà âm thanh là nhạc không có lời nói, vì bộ lọc phát hiện giọng nói sẽ bỏ qua và bạn sẽ nhận một thông báo ngắn thay vì lời bài hát. Nếu bạn chỉ cần nghe tệp, hoặc muốn dịch phụ đề sang ngôn ngữ khác, bạn đang cần một bước khác. Và nếu bản ghi dài hơn mức gói của bạn cho phép (mặc định 5 phút với khách, 20 phút với tài khoản miễn phí), hãy cắt bớt trước hoặc đăng nhập.',
      whyMediaManipulator: [
        'Bạn chọn VTT, SRT, TXT hoặc JSON trước khi tải lên, nên không cần bước chuyển đổi thứ hai sau khi đã có bản chép lời.',
        'Whisper chạy trên GPU của chính chúng tôi với bộ nhớ đệm mô hình đặt ở chế độ ngoại tuyến; không dịch vụ nhận dạng giọng nói bên ngoài nào nhận được âm thanh.',
        'Mỗi lượt chép lời được tính là một tác vụ AI, trừ vào hạn mức tác vụ AI, tách biệt với hạn mức tác vụ thường: mặc định 3 lượt mỗi ngày với khách và 10 lượt với tài khoản miễn phí, và tác vụ thường của bạn không bị ảnh hưởng (xem /pricing).',
      ],
      privacyNote: 'Tệp video hoặc âm thanh của bạn được lưu trong thư mục tác vụ trên máy chủ của chúng tôi. ffmpeg ghi một tệp WAV mono 16 kHz tạm thời mà Whisper đọc trên GPU của chúng tôi, và tệp WAV đó bị xóa khi tác vụ hoàn tất. Tệp bản chép lời và một bản sao các đoạn dưới tên transcribe_result.json được lưu cùng tác vụ, và văn bản chép lời cũng được chuyển cho một mô hình ngôn ngữ chạy trên phần cứng của chính chúng tôi để tạo bản tóm tắt và kiểm tra an toàn tự động; kết quả được lưu cùng tác vụ. Không có gì được gửi đến nhà cung cấp AI bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Tôi nên chọn định dạng phụ đề nào, VTT hay SRT?',
          answer: 'VTT nếu phụ đề dùng cho web (video HTML, hầu hết trình phát) và SRT nếu phụ đề được đưa vào phần mềm dựng phim hoặc quy trình kiểu phát sóng. Cả hai chứa cùng các dòng phụ đề; chỉ khác phần tiêu đề và dấu ngăn cách mili giây: dấu chấm trong VTT và dấu phẩy trong SRT.',
        },
        {
          question: 'Bản chép lời JSON có điểm tin cậy hoặc thời gian theo từng từ không?',
          answer: 'Không. Mỗi đoạn có id, thời điểm bắt đầu và kết thúc tính bằng giây (làm tròn đến mili giây) và nội dung văn bản. Tệp cũng ghi lại ngôn ngữ nhận diện được, thời lượng và việc có tìm thấy lời nói hay không, nhưng không có thời gian theo từng từ và không có xác suất.',
        },
        {
          question: 'Tôi có thể chép lời tệp dài bao nhiêu?',
          answer: 'Tệp chỉ có âm thanh bị áp cùng giới hạn thời lượng như video: mặc định 5 phút với khách, 20 phút với tài khoản miễn phí, 2 giờ với Premium và Pro, và lần lượt 200 MB, 1 GB hoặc 5 GB mỗi tệp. Biểu mẫu hiển thị các giới hạn áp dụng cho bạn, và /pricing liệt kê các con số hiện hành.',
        },
        {
          question: 'Vì sao tôi nhận được thông báo "no recognizable speech was found"?',
          answer: 'Thông báo này nghĩa là không tìm thấy lời nói nhận diện được. Whisper chạy với tính năng phát hiện giọng nói được bật, nên một tệp toàn nhạc, âm thanh môi trường, im lặng hoặc lời nói rất nhỏ có thể bị lọc đến mức không còn gì. Thông báo được ghi thẳng vào tệp bản chép lời để việc tải xuống vẫn hoạt động. Hãy ghi âm lại to hơn hoặc cắt lấy phần có lời nói rồi thử lại.',
        },
        {
          question: 'Tôi có thể chỉ định ngôn ngữ thay vì để hệ thống tự nhận diện không?',
          answer: 'Có. Nhập mã ngôn ngữ hai chữ cái như en, de hoặc es vào ô ngôn ngữ và Whisper sẽ chép lời theo ngôn ngữ đó. Để trống để tự động nhận diện, cách này hoạt động tốt với clip dài hơn vài giây.',
        },
        {
          question: 'Chép lời có dùng hạn mức tác vụ AI của tôi không?',
          answer: 'Có. Mỗi lượt chép lời là một tác vụ AI: mặc định 3 lượt mỗi ngày với khách, 10 lượt với tài khoản miễn phí, 100 lượt với Premium và 200 lượt với Pro. Hạn mức tác vụ AI có bộ đếm riêng, nên chép lời không bao giờ tiêu tốn hạn mức tác vụ thường dành cho chuyển đổi. Tác vụ thất bại được hoàn lại lượt.',
        },
        {
          question: 'Công cụ dùng mô hình nào, và tôi có thể chọn mô hình lớn hơn không?',
          answer: 'Mặc định, dịch vụ chạy whisper-ctranslate2 với mô hình medium ở float16 trên GPU CUDA. Biểu mẫu không có tùy chọn chọn mô hình; mô hình được đặt trên máy chủ, nên bạn không thể yêu cầu các biến thể rất nhanh hoặc rất lớn cho từng tác vụ.',
        },
      ],
      related: [
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Thu nhỏ bản ghi lớn trước khi tải lên để lấy bản chép lời.',
        },
        {
          label: 'Tách âm thanh khỏi video',
          to: '/tools/extract-audio-from-video',
          description: 'Lấy riêng track âm thanh nếu bạn cũng muốn giữ một bản.',
        },
        {
          label: 'Làm sạch âm thanh giọng nói',
          to: '/tools/clean-voice-audio',
          description: 'Cải thiện bản ghi nhiều tạp âm trước khi chép lời.',
        },
        {
          label: 'Cắt video',
          to: '/tools/video-trimmer',
          description: 'Cắt tệp chỉ còn phần có lời nói trước.',
        },
        {
          label: 'Hướng dẫn trình chuyển đổi video',
          to: '/tutorials/video/getting-started',
          description: 'Chuẩn bị và chuyển đổi video trước khi chép lời.',
        },
      ],
      embed: {
        title: 'Chuyển video thành văn bản',
        description: 'Tải video lên. Mô hình chép lời AI chạy trên máy chủ GPU nội bộ của chúng tôi và xuất ra phụ đề VTT, văn bản thuần hoặc JSON: VTT cho phụ đề, văn bản thuần cho bài viết, JSON cho các công cụ xử lý tiếp theo.',
      },
    },
    'transcode-to-hls': {
      name: 'Chuyển mã video sang HLS',
      h1: 'Chuyển mã video sang HLS trực tuyến',
      tagline: 'Đóng gói mọi video thành gói Apple HLS VOD: master.m3u8 và các phân đoạn .ts theo từng độ phân giải, sẵn sàng cho web.',
      metaTitle: 'Chuyển mã video sang HLS: phát trực tuyến thích ứng miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển mã HLS trực tuyến miễn phí. Chuyển MP4, MOV, WebM, MKV thành gói HLS VOD với các độ phân giải 360p/480p/720p, kèm phụ đề và storyboard tùy chọn.',
      ogTitle: 'Chuyển mã video sang HLS trực tuyến',
      ogDescription: 'Tạo gói HLS thích ứng (master.m3u8 + danh sách phát biến thể + phân đoạn .ts) từ mọi video, miễn phí, ngay trong trình duyệt của bạn.',
      intro: 'HTTP Live Streaming phát video dưới dạng một danh sách phát gồm các phân đoạn ngắn ở nhiều mức chất lượng, để trình phát có thể bắt đầu nhanh và chuyển bậc khi kết nối thay đổi. Tự tạo gói đó bằng tay nghĩa là phải mã hóa từng phiên bản với keyframe được căn thẳng hàng, cắt chúng thành phân đoạn và viết một danh sách phát chính mô tả chính xác mọi biến thể. Trang này làm trọn toàn bộ công việc: dò tệp tải lên của bạn, đưa ra các bậc trong thang chất lượng mà nguồn và gói của bạn cho phép, mã hóa từng bậc bằng libx264 và AAC thành các phân đoạn MPEG-TS dài 2 giây, tùy chọn thêm phụ đề từ trình chép lời Whisper của chính chúng tôi, một sprite sheet storyboard và một danh sách phát I-frame để tua, rồi đóng gói tất cả thành tar.gz hoặc zip mà bạn có thể giải nén lên bất kỳ máy chủ tĩnh nào.',
      whatItDoes: [
        'Dò nguồn bằng ffprobe và liệt kê các bậc chất lượng: 144p, 240p, 360p, 480p, 720p, 1080p và 2160p, mỗi bậc chỉ được bật nếu nguồn đủ cao và gói của bạn cho phép.',
        'Mã hóa từng bậc đã chọn bằng libx264 High profile level 4.1 và AAC stereo ở 48 kHz, thành các phân đoạn .ts dài 2 giây với một keyframe ở mọi ranh giới phân đoạn.',
        'Ghi hls/master.m3u8 với BANDWIDTH, RESOLUTION, FRAME-RATE và CODECS cho mọi biến thể, cùng một tệp index.m3u8 cho mỗi bậc.',
        'Tùy chọn chép lời âm thanh bằng Whisper thành một track WebVTT, dịch sang tối đa 3 ngôn ngữ khác bằng một mô hình cục bộ, và liên kết từng bản như một phiên bản phụ đề trong danh sách phát chính.',
        'Tùy chọn kết xuất một sprite sheet storyboard kèm chỉ mục WebVTT cho ảnh thu nhỏ trên thanh tua, và luôn cố gắng thêm một danh sách phát chỉ gồm I-frame ở 240p.',
        'Đóng gói thư mục cùng README.txt và report.json thành tar.gz (hoặc zip) và trao cho bạn một liên kết tải xuống được ký sẵn.',
      ],
      flowSteps: [
        {
          title: 'Tải lên',
          description: 'Trình duyệt tải tệp thẳng lên kho lưu trữ của chúng tôi bằng một yêu cầu PUT được ký sẵn; sau đó API tải tệp về để xử lý.',
        },
        {
          title: 'Dò nguồn',
          description: 'ffprobe đọc chiều rộng, chiều cao, tốc độ khung hình, thời lượng và việc có âm thanh hay không; các bậc cao hơn nguồn sẽ bị làm mờ đi.',
        },
        {
          title: 'Chọn bậc và tính năng bổ sung',
          description: '360p, 480p và 720p được chọn sẵn. Đánh dấu phụ đề, ngôn ngữ phụ đề bổ sung, storyboard, và tar.gz hoặc zip.',
        },
        {
          title: 'Mã hóa từng bậc',
          description: 'libx264 theo CRF và bitrate của bậc với GOP 2 giây, AAC theo bitrate âm thanh của bậc, đầu ra HLS VOD.',
        },
        {
          title: 'Thêm tính năng bổ sung và ghi danh sách phát chính',
          description: 'Phụ đề, storyboard và danh sách phát I-frame được tạo, rồi master.m3u8 được ghi lại để tham chiếu đến chúng.',
        },
        {
          title: 'Tải gói xuống',
          description: 'Một liên kết được ký sẵn, mặc định có hiệu lực trong 30 phút; trang tác vụ cho phép bạn tải gói về khi liên kết còn hạn.',
        },
      ],
      advancedDetails: [
        'Thang chất lượng (transcode_profiles.go) gồm: 144p video 200 kbps và âm thanh 64 kbps, CRF 26; 240p 400/64, CRF 25; 360p 800/96, CRF 23; 480p 1200/128, CRF 23; 720p 2800/128, CRF 22; 1080p 5000/192, CRF 22; 2160p 12000/256, CRF 21. Mọi bậc đều dùng preset veryfast, trừ 2160p dùng slow.',
        'Mỗi bậc được mã hóa bằng lệnh ffmpeg -i input -map 0:v:0 -vf scale=-2:H -r FPS -c:v libx264 -profile:v high -level 4.1 -preset P -crf N -sc_threshold 0 -g GOP -keyint_min GOP -b:v B -maxrate 1.2B -bufsize 2B -force_key_frames expr:gte(t,n_forced*2) -map 0:a:0? -c:a aac -b:a A -ac 2 -ar 48000 -hls_time 2 -hls_playlist_type vod -hls_flags independent_segments. GOP bằng tốc độ khung hình nhân 2, nên ở mọi bậc, các phân đoạn đều bắt đầu bằng keyframe.',
        'Vì quá trình mã hóa dựa trên CRF với -maxrate làm mức trần, mỗi bậc có bitrate trung bình tối đa khoảng bằng bitrate đã liệt kê (mức trần là 1,2 lần giá trị đó) và thấp hơn với nội dung đơn giản. Danh sách phát chính khai báo BANDWIDTH bằng tổng bitrate video và âm thanh đã liệt kê, và CODECS là avc1.640028, thêm mp4a.40.2 khi có âm thanh.',
        'Mặc định, khách có thể chọn từ 360p đến 720p, tài khoản miễn phí từ 360p đến 1080p, còn Premium hoặc Pro có toàn bộ thang từ 144p đến 2160p; nguồn thấp hơn 360p bị từ chối với các gói dưới Premium. Máy chủ kiểm tra lại các bậc khi bắt đầu, nên trình duyệt không thể yêu cầu một bậc không được đề xuất.',
        'Phụ đề dùng cùng mô hình Whisper (whisper-ctranslate2, medium) với trình chép lời; track chính được ghi vào captions/<lang>/auto.vtt với một tệp bao subs.m3u8 gồm một phân đoạn và được tham chiếu từ danh sách phát chính dưới dạng EXT-X-MEDIA TYPE=SUBTITLES. Tối đa 3 ngôn ngữ bổ sung từ danh sách 37 ngôn ngữ được dịch từng đoạn bằng một mô hình Ollama cục bộ (một bản dựng translategemma 12b); bản dịch thất bại được ghi lại dưới dạng cảnh báo, không bao giờ làm tác vụ thất bại.',
        'Storyboard được tạo trong một lượt ffmpeg: fps=1/N với N là 5, 10 hoặc 15 giây tùy theo thời lượng (dưới 10 phút, dưới 30 phút, dài hơn), các ô 160 x 90 được đệm về 16:9 trong lưới 10 x 10 cho mỗi sprite JPEG, kèm storyboard.vtt với các cue #xywh. Danh sách phát I-frame chỉ mã hóa lại keyframe ở 240p (select=eq(pict_type,I), libx264 CRF 30, phân đoạn 4 giây) và được liệt kê dưới dạng EXT-X-I-FRAME-STREAM-INF.',
        'Danh sách phát chính chứa EXT-X-VERSION:6, EXT-X-INDEPENDENT-SEGMENTS và ba mục EXT-X-SESSION-DATA ghi tên đơn vị tạo, trang web và chủ sở hữu bản quyền. report.json ghi lại kết quả dò, các biến thể kèm số phân đoạn và kích thước tính bằng byte, các cảnh báo và dấu thời gian.',
      ],
      whyItMatters: [
        'HLS là định dạng phát trực tuyến gốc của iOS, Safari và mọi CDN, và với hls.js, nó cũng phát được trên mọi trình duyệt khác.',
        'Các bậc thích ứng cho phép người xem có kết nối yếu tiếp tục xem ở 360p thay vì phải chờ tải ở 1080p.',
        'Một gói VOD đã cắt phân đoạn sẵn chỉ gồm các tệp tĩnh, nên có thể lưu trữ trên kho lưu trữ đối tượng mà không cần máy chủ chuyển mã phía sau.',
      ],
      useCases: [
        {
          title: 'Nền tảng khóa học',
          description: 'Phát bài học từ một kho lưu trữ với bitrate thích ứng và phụ đề nhiều ngôn ngữ.',
        },
        {
          title: 'Trang sản phẩm và tiếp thị',
          description: 'Phát video demo mà không cần dịch vụ lưu trữ video bên thứ ba cùng thương hiệu trên trình phát của họ.',
        },
        {
          title: 'Cổng thông tin nội bộ',
          description: 'Lưu trữ video đào tạo trên CDN của riêng bạn, kèm ảnh thu nhỏ trên thanh tua.',
        },
        {
          title: 'Kho lưu trữ',
          description: 'Chuyển kho video cũ sang cấu trúc phát trực tuyến mà bạn kiểm soát và có thể nhân bản.',
        },
      ],
      workedExamples: [
        {
          title: 'Clip 1080p dài 3 phút ở ba bậc mặc định',
          body: 'Đầu vào: một tệp MP4 1920 x 1080 30 fps dài 3 phút, 140 MB, có âm thanh stereo, nằm trong giới hạn dành cho khách. Thiết lập: 360p, 480p và 720p (lựa chọn mặc định và cũng là mức tối đa khách có thể chọn), không phụ đề hay storyboard, tar.gz. Mỗi bậc được cắt thành các phân đoạn 2 giây, 90 phân đoạn mỗi bậc, với GOP 60 khung hình để mọi phân đoạn đều bắt đầu bằng keyframe. Ở bitrate đã liệt kê, các bậc nặng tối đa khoảng 20 MB cho 360p (800 + 96 kbps x 180 giây), 30 MB cho 480p (1200 + 128 kbps) và 66 MB cho 720p (2800 + 128 kbps), tổng cộng khoảng 116 MB trước khi tính danh sách phát I-frame 240p nhỏ, và ít hơn với nội dung đơn giản vì quá trình mã hóa dựa trên CRF với bitrate làm mức trần. Gói kết quả có 270 phân đoạn .ts, ba tệp index.m3u8 và danh sách phát chính. Thời gian là ba lượt mã hóa libx264 veryfast, mỗi lượt 5400 khung hình, chạy lần lượt; bậc 720p mất nhiều thời gian nhất.',
        },
        {
          title: 'Hội thảo trực tuyến 720p dài 12 phút có phụ đề tiếng Anh, bản dịch tiếng Tây Ban Nha và storyboard',
          body: 'Đầu vào: một tệp MP4 1280 x 720 25 fps dài 12 phút, 380 MB, được tải lên bằng tài khoản miễn phí vì vượt mức mặc định 5 phút dành cho khách. Thiết lập: 360p và 720p (1080p bị làm mờ vì nguồn là 720p), bật phụ đề với tiếng Tây Ban Nha là ngôn ngữ bổ sung, bật storyboard, zip. Whisper chép lời 12 phút trước và ghi captions/en/auto.vtt; track tiếng Tây Ban Nha được dịch theo từng lô 30 đoạn vào captions/es/auto.vtt, và cả hai được liệt kê là phiên bản phụ đề trong danh sách phát chính. Storyboard dùng khoảng cách 10 giây cho nguồn dài hơn 10 phút: 72 ảnh thu nhỏ 160 x 90 vừa trong một tệp sprite_001.jpg 1600 x 900 duy nhất, với storyboard.vtt trỏ đến từng ô. Mỗi bậc gồm 360 phân đoạn 2 giây, với GOP 50 khung hình ở 25 fps, và nặng tối đa khoảng 81 MB (360p) và 264 MB (720p) ở bitrate đã liệt kê. Tác vụ dành nhiều thời gian cho Whisper và hai lượt mã hóa hơn mọi việc khác; bản dịch chỉ là một bước bổ sung ngắn.',
        },
      ],
      whenNotToUse: 'Đừng chuyển mã sang HLS nếu bạn chỉ muốn một tệp đơn nhỏ hơn để gửi hoặc nhúng; trình nén làm việc đó trong một lượt mà không cần phân đoạn hay danh sách phát. Đừng dùng công cụ này cho sự kiện trực tiếp, vì đầu ra là một danh sách phát VOD hoàn chỉnh, không phải nguồn phát trực tiếp. Nếu nguồn của bạn thấp hơn 360p, thang chất lượng không thể được tạo nếu không có Premium. Và nếu trình phát của bạn chỉ là một thẻ video thông thường không hỗ trợ HLS, bạn cần MP4 hoặc một trình phát kiểu hls.js trước; riêng một tệp master.m3u8 chỉ phát gốc được trên Safari và các thiết bị Apple.',
      whyMediaManipulator: [
        'Mọi bitrate, CRF, preset và cờ FFmpeg của từng bậc đều được liệt kê trên trang này, nên nội dung của gói không có gì bất ngờ.',
        'Phụ đề đến từ trình chép lời Whisper của chính chúng tôi và bản dịch từ một mô hình trên phần cứng của chính chúng tôi, cả hai đều được tham chiếu chính xác trong danh sách phát chính.',
        'Gói chỉ gồm các tệp thông thường kèm README và report.json; giải nén lên bất kỳ máy chủ tĩnh nào và trỏ trình phát vào master.m3u8.',
        'Một lượt chuyển mã tiêu tốn một tác vụ thường trong hạn mức hằng ngày (mặc định 5 lượt mỗi ngày với khách, 30 lượt với tài khoản miễn phí) và bị giới hạn 10 lượt bắt đầu mỗi giờ cho mỗi phiên; tác vụ thất bại được hoàn lại. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Tệp tải lên của bạn đi thẳng từ trình duyệt vào kho lưu trữ của chúng tôi, rồi được tải về máy chủ của chính chúng tôi, nơi ffprobe, FFmpeg và, nếu bạn chọn phụ đề, trình chép lời Whisper cùng một mô hình dịch Ollama cục bộ được chạy; không có dịch vụ chuyển mã hay AI bên thứ ba nào tham gia. Đối tượng nguồn, thư mục làm việc và gói hoàn chỉnh đều được đăng ký trong sổ theo dõi thời hạn lưu và bị xóa khi hết hạn, và bản thân liên kết tải xuống mặc định hết hạn sau 30 phút. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Việc chuyển mã không chạy bước phân tích nội dung tự động mà các lượt chuyển đổi tiêu chuẩn trải qua. Danh sách phát chính được tạo ra chứa các dòng session-data ghi Media Manipulator là đơn vị tạo; chúng không mang thông tin nào về bạn.',
      faq: [
        {
          question: 'Tôi có thể chọn những bậc nào với gói của mình?',
          answer: 'Mặc định, khách có 360p, 480p và 720p; tài khoản miễn phí có thêm 1080p; Premium và Pro mở khóa thêm 144p, 240p và 2160p. Bậc nào cao hơn nguồn của bạn luôn bị tắt, vì không có gì được phóng to. Các nút chọn hiển thị lý do khi bạn di chuột qua.',
        },
        {
          question: 'Các phân đoạn dài bao lâu, và tại sao là 2 giây?',
          answer: 'Mọi bậc được cắt thành các phân đoạn MPEG-TS dài 2 giây với một keyframe bắt buộc ở mỗi ranh giới, để trình phát có thể chuyển bậc tại bất kỳ phân đoạn nào mà không bị giật hình. Danh sách phát I-frame dùng phân đoạn 4 giây vì nó chỉ chứa keyframe.',
        },
        {
          question: 'Phụ đề có được liên kết trong danh sách phát chính không?',
          answer: 'Có. Mỗi ngôn ngữ được ghi thành captions/<lang>/auto.vtt với một tệp bao subs.m3u8 và được khai báo trong master.m3u8 dưới dạng EXT-X-MEDIA TYPE=SUBTITLES trong nhóm subs, với ngôn ngữ nguồn được đánh dấu DEFAULT. Bạn có thể thêm tối đa 3 ngôn ngữ dịch từ danh sách 37 ngôn ngữ.',
        },
        {
          question: 'Nếu video của tôi không có âm thanh thì sao?',
          answer: 'Các bậc được mã hóa chỉ có video với -an, thuộc tính CODECS bỏ mp4a.40.2, và bước phụ đề bị bỏ qua kèm một cảnh báo trong report.json vì không có gì để chép lời.',
        },
        {
          question: 'Gói chứa những gì, và tôi lưu trữ nó như thế nào?',
          answer: 'hls/master.m3u8, mỗi bậc một thư mục chứa index.m3u8 và các phân đoạn, hls/iframes/, captions/ và storyboards/ tùy chọn, README.txt và report.json. Giải nén lên bất kỳ máy chủ tĩnh hoặc kho lưu trữ nào phục vụ .m3u8 và .ts với đúng kiểu MIME rồi trỏ trình phát vào master.m3u8.',
        },
        {
          question: 'Liên kết tải xuống dùng được bao lâu, và tôi có thể chọn tar.gz hoặc zip không?',
          answer: 'Liên kết được ký sẵn mặc định có hiệu lực 30 phút; hãy chạy lại tác vụ nếu liên kết đã hết hạn. Chọn tar.gz (mặc định) hoặc zip trong biểu mẫu trước khi bắt đầu.',
        },
        {
          question: 'Một lượt chuyển mã HLS mất bao lâu?',
          answer: 'Mỗi bậc được chọn là một lượt mã hóa libx264 đầy đủ với preset veryfast, chạy lần lượt, nên thời gian tăng theo thời lượng nhân với số bậc; 720p chiếm phần lớn thời gian trong ba bậc mặc định. Phụ đề thêm một lượt Whisper qua toàn bộ âm thanh. Trang tác vụ hiển thị từng giai đoạn khi hoàn tất.',
        },
      ],
      related: [
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Một tệp MP4 nhỏ hơn thay vì một gói phát trực tuyến.',
        },
        {
          label: 'Chuyển video thành văn bản',
          to: '/tools/transcribe-video',
          description: 'Nhận cùng phụ đề Whisper dưới dạng tệp VTT hoặc SRT riêng.',
        },
        {
          label: 'Cắt video',
          to: '/tools/video-trimmer',
          description: 'Bỏ phần đầu và phần cuối thừa trước khi chuyển mã.',
        },
        {
          label: 'Phục hồi video bằng AI',
          to: '/tools/ai-video-restoration',
          description: 'Nâng độ phân giải một đoạn ngắn có độ phân giải thấp trước khi tạo thang chất lượng từ nó.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Chỉnh sửa và thêm phụ đề cho video, rồi chuyển mã bản xuất.',
        },
      ],
      embed: {
        title: 'Chuyển mã video sang HLS',
        description: 'Tải lên MP4/MOV/WebM/MKV. Chúng tôi dò nguồn bằng ffprobe, cho bạn chọn các bậc chất lượng miễn phí (360p/480p/720p), rồi mã hóa H.264 + AAC bằng ffmpeg và đóng gói thành tệp tar.gz chứa gói HLS để bạn tải xuống.',
      },
    },
    'ai-video-restoration': {
      name: 'Phục hồi video bằng AI',
      h1: 'Công cụ phục hồi video bằng AI',
      tagline: 'Nâng độ phân giải và phục hồi một đoạn video ngắn với tối đa sáu mô hình AI (Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT và VRT), rồi so sánh mọi kết quả cạnh nhau.',
      metaTitle: 'Phục hồi video AI: So sánh 6 mô hình nâng độ phân giải trực tuyến | Media Manipulator',
      metaDescription: 'Công cụ phục hồi video bằng AI miễn phí. Cho một clip ngắn chạy qua các mô hình siêu phân giải Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT và VRT trên GPU của chúng tôi và tải mọi kết quả về trong một gói.',
      ogTitle: 'Phục hồi video bằng AI: So sánh Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT và VRT',
      ogDescription: 'Chọn một đoạn trích từ video của bạn, chọn các mô hình phục hồi và tải về một gói chứa mọi phiên bản đã tăng cường cùng bản gốc để so sánh A/B.',
      intro: 'Các mô hình phục hồi video không cho kết quả giống nhau. Một công cụ nâng độ phân giải dạng GAN như Real-ESRGAN cho bạn từng khung hình sắc nét nhưng có thể nhấp nháy khi chuyển động; một mô hình transformer video như VRT giữ chuỗi hình ổn định nhưng có thể làm mềm chi tiết. Cách trung thực duy nhất để chọn là cho cùng một đoạn cảnh quay chạy qua tất cả các mô hình rồi tự xem. Trang này làm đúng điều đó với một đoạn trích dài tối đa 15 giây: tách các khung hình, chạy những mô hình bạn chọn trong số sáu mô hình trên GPU của chính chúng tôi, ghép từng kết quả trở lại thành MP4 ở đúng tốc độ khung hình của nguồn kèm âm thanh gốc, rồi đóng gói mọi thứ, gồm cả đoạn trích chưa qua xử lý, vào một tệp lưu trữ duy nhất để so sánh cạnh nhau. Mọi con số bên dưới đều lấy từ quy trình xử lý đang chạy hiện nay.',
      whatItDoes: [
        'Cắt đoạn trích bạn chọn (0,5 đến 15 giây, tối đa 450 khung hình theo tốc độ khung hình của bạn) chính xác đến từng khung hình, kèm âm thanh.',
        'Chạy bất kỳ tổ hợp nào của Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT và VRT; ba mô hình đầu tăng cường từng khung hình một, ba mô hình sau phục hồi cả chuỗi hình như một khối.',
        'Chọn 4x cho nguồn từ 540p trở xuống và 2x cho nguồn cao hơn, vì mọi mô hình đều chạy mạng 4x gốc của nó và kết quả 2x là bản thu nhỏ bằng Lanczos ở bước ghép.',
        'Ghép từng kết quả bằng libx264 với CRF 16 theo đúng phân số tốc độ khung hình của nguồn và gắn lại âm thanh.',
        'Đóng gói original/clip.mp4, một thư mục cho mỗi mô hình, các khung hình PNG đã tăng cường (tùy chọn) cho các mô hình xử lý từng khung hình, manifest.json và README.txt vào một tệp tar.gz duy nhất.',
        'Tiếp tục chạy khi một mô hình thất bại: thư mục của mô hình đó nhận tệp FAILED.txt, manifest ghi lại lý do, và mọi kết quả khác vẫn được giao.',
      ],
      flowSteps: [
        {
          title: 'Tải video lên',
          description: 'Tối đa 1920 x 1080; nguồn dài cũng không sao vì chỉ đoạn trích được xử lý.',
        },
        {
          title: 'Chọn đoạn trích',
          description: 'Kéo các tay cầm để chọn tối đa 15 giây; khuyên dùng 10 giây trở xuống và bộ chọn sẽ cảnh báo khi vượt quá mức đó.',
        },
        {
          title: 'Chọn mô hình và có kèm khung hình hay không',
          description: 'Bất kỳ mô hình nào trong sáu mô hình; bộ chọn hiển thị thời gian ước tính cho từng mô hình dựa trên số giây mỗi khung hình mà máy chủ công bố.',
        },
        {
          title: 'Theo dõi các giai đoạn',
          description: 'Tải xuống, dò thông tin, tách clip, tách khung hình, rồi lần lượt từng mô hình từ nhanh nhất đến chậm nhất, sau cùng là đóng gói.',
        },
        {
          title: 'So sánh và tải xuống',
          description: 'Phát MP4 của từng mô hình cạnh bản gốc trong trình xem, rồi tải tệp lưu trữ về trong lúc liên kết 6 giờ của nó còn hiệu lực.',
        },
      ],
      advancedDetails: [
        'Clip tham chiếu được cắt bằng ffmpeg -ss START -i source -t WINDOW -c:v libx264 -crf 10 -preset medium -pix_fmt yuv420p -c:a aac, sau đó các khung hình được tách bằng -vsync 0 thành các tệp PNG được đánh số; nếu số lượng vượt quá 450, các khung hình thừa sẽ bị bỏ.',
        'Real-ESRGAN chạy realesrgan-ncnn-vulkan với mô hình realesrgan-x4plus, hệ số 4 và ô 256 px. SwinIR dùng bộ trọng số GAN SwinIR-L x4 003_realSR_BSRGAN, còn HAT dùng Real_HAT_GAN_SRx4, cả hai đều qua suy luận chia ô (ô 320 px, chồng lấn 32 px) để khung hình 1080p vừa với bộ nhớ.',
        'BasicVSR++ chạy bộ sinh REDS4 c64n7 qua mmagic theo các cửa sổ 16 khung hình; RVRT (001_RVRT_videosr_bi_REDS_30frames) và VRT (001_VRT_videosr_bi_REDS_6frames) chạy qua các script kiểm thử KAIR của chúng với ô thời gian 30 và 12 khung hình và ô không gian 128 x 128.',
        'Bước ghép là đồng nhất: ffmpeg -framerate FPS_FRACTION -i frames/%06d.png [-i clip.mp4 -map 0:v -map 1:a -c:a aac] [-vf scale=iw/2:ih/2:flags=lanczos] -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -movflags +faststart -shortest. Phân số tốc độ khung hình, ví dụ 30000/1001, được lấy nguyên văn từ ffprobe để âm thanh luôn khớp.',
        'Các mô hình chạy theo thứ tự cố định Real-ESRGAN, BasicVSR++, SwinIR, RVRT, HAT, VRT, dưới một suất cấp phát của bộ lập lịch GPU với ngân sách VRAM lần lượt là 3, 11, 9, 12, 10 và 14 GB, mỗi lúc chỉ một tác vụ phục hồi trên toàn máy chủ và thời gian chờ tối đa 75 phút cho mỗi mô hình.',
        'Các ước tính theo khung hình đã công bố mà bộ chọn nhân với số khung hình của bạn là 0,8 giây (Real-ESRGAN), 1,0 giây (BasicVSR++), 3,0 giây (RVRT), 3,5 giây (SwinIR), 5,0 giây (HAT) và 7,0 giây (VRT); đây là giá trị mặc định phía máy chủ có thể thay đổi, không phải số đo trên clip của bạn.',
        'Chọn 4x thủ công sẽ bị từ chối với nguồn cao hơn 1080p vì đầu ra sẽ vượt quá 4K; chế độ tự động chọn 2x cho 541p đến 1080p và 4x cho 540p trở xuống. Các khung hình được kèm theo là PNG 4x gốc kể cả khi đi theo nhánh 2x, nên một nguồn 1080p cho ra các khung hình 7680 x 4320.',
      ],
      whyItMatters: [
        'Không có mô hình phục hồi nào thắng trên mọi loại cảnh quay, và việc so sánh khung hình tĩnh che giấu hiện tượng nhấp nháy mà chỉ khi phát mới lộ ra.',
        'Một đoạn trích 10 giây qua mọi mô hình tốn vài phút thời gian GPU và cho bạn biết mô hình nào đáng để chạy toàn bộ thời lượng ở nơi khác.',
        'Băng từ đã số hóa, clip từ máy ảnh kỹ thuật số đời đầu và bản xuất mạng xã hội đã bị nén đều xuống cấp theo những cách khác nhau và hợp với những họ mô hình khác nhau.',
      ],
      useCases: [
        {
          title: 'Video gia đình cũ',
          description: 'Xem mô hình nào khôi phục khuôn mặt và chất liệu vải tốt nhất trên một bản chuyển từ băng 480p trước khi phục hồi cả cuộn băng.',
        },
        {
          title: 'Cảnh quay lưu trữ',
          description: 'Thử 4x trên tư liệu 360p và 480p rồi tự đánh giá đầu ra cỡ 4K trên màn hình của bạn.',
        },
        {
          title: 'Chọn mô hình trước một lần kết xuất dài',
          description: 'Chọn mô hình cho một tác vụ kéo dài hàng giờ dựa trên một bài thử 10 giây mang tính đại diện.',
        },
        {
          title: 'Video tải về đã bị nén',
          description: 'So sánh khả năng làm nét của GAN với độ ổn định của transformer trên các bản xuất mạng xã hội bị vỡ khối.',
        },
        {
          title: 'Kiểm tra độ ổn định theo thời gian',
          description: 'Phát các MP4 của từng mô hình cạnh nhau để phát hiện hiện tượng lấp lánh và nhấp nháy mà khung hình tĩnh che giấu.',
        },
      ],
      workedExamples: [
        {
          title: 'Một video gia đình 640 x 480 dài 8 giây qua cả sáu mô hình',
          body: 'Đầu vào: một MP4 640 x 480 ở 29,97 fps từ một cuộn băng đã số hóa, có âm thanh. Thiết lập: đoạn trích 8 giây, cả sáu mô hình, có kèm khung hình đã tăng cường, hệ số tự động. Quy trình cắt một clip tham chiếu 8 giây và tách ra 240 khung hình (8 x 29,97, làm tròn). Ở 480p, quy tắc tự động chọn 4x, nên mọi mô hình đều ghi ra khung hình 2560 x 1920 và các MP4 sau khi ghép có kích thước 2560 x 1920 ở 30000/1001 fps kèm âm thanh gốc. Ước tính của bộ chọn là số khung hình nhân với số giây mỗi khung hình đã công bố: khoảng 3,2 phút cho Real-ESRGAN, 4 phút cho BasicVSR++, 12 cho RVRT, 14 cho SwinIR, 20 cho HAT và 28 cho VRT, tổng cộng khoảng 81 phút vì các mô hình chạy lần lượt. Việc kèm khung hình thêm 3 x 240 tệp PNG 2560 x 1920 vào tệp lưu trữ, đó là lý do dung lượng tải xuống được tính bằng gigabyte thay vì megabyte.',
        },
        {
          title: 'Một clip 1080p dài 10 giây ở hệ số tự động với Real-ESRGAN và BasicVSR++',
          body: 'Đầu vào: một MP4 1920 x 1080 30 fps dung lượng 90 MB, độ phân giải nguồn lớn nhất mà công cụ chấp nhận. Thiết lập: đoạn trích 10 giây, Real-ESRGAN và BasicVSR++, không kèm khung hình, hệ số tự động. Bước tách cho ra 300 khung hình, nằm trong mức trần 450 (ở 60 fps, cùng mức trần đó sẽ giới hạn đoạn trích còn 7,5 giây). Trên 540p, chế độ tự động chọn 2x, nên mỗi mô hình vẫn chạy mạng 4x gốc của nó, tạo ra khung hình 7680 x 4320, và bước ghép áp dụng scale=iw/2:ih/2:flags=lanczos để xuất MP4 3840 x 2160 với CRF 16. Theo các ước tính đã công bố, Real-ESRGAN mất khoảng 4 phút (0,8 giây x 300) và BasicVSR++ khoảng 5 phút (1,0 giây x 300), nên tác vụ hoàn tất còn xa mới chạm thời gian chờ tối đa 75 phút cho mỗi mô hình, và tệp lưu trữ chứa hai MP4 4K, clip gốc, manifest.json và README.txt.',
        },
      ],
      whenNotToUse: 'Đừng dùng trang này để phục hồi cả một bộ phim; đây là công cụ so sánh có giới hạn 15 giây và 450 khung hình, và ngay cả với chừng đó, tệp lưu trữ cũng có thể lên tới nhiều gigabyte. Đừng mong nó tạo ra những gì chưa từng được ghi lại: nhòe chuyển động nặng, vỡ khối do nén quá mức và cảnh quay rất tối sẽ được cải thiện nhưng không trở nên hoàn hảo. Nguồn lớn hơn 1920 x 1080 bị từ chối, vì việc phục hồi nhắm đến tư liệu độ phân giải thấp và 2x của 1080p đã là 4K. Nếu clip của bạn chỉ cần dung lượng nhỏ hơn, đổi định dạng hoặc cắt bớt, các công cụ nén, chuyển đổi và cắt video làm việc đó trong vài giây mà không cần GPU.',
      whyMediaManipulator: [
        'Sáu mô hình đạt chuẩn nghiên cứu sau một lần tải lên, với bộ trọng số, kích thước ô và lệnh ghép được nêu rõ trên trang này thay vì giấu sau một tên thương hiệu.',
        'Mọi thứ chạy trên GPU của chính chúng tôi; cảnh quay của bạn không bao giờ được gửi đến nhà cung cấp AI bên thứ ba và không có gì được dùng để huấn luyện.',
        'Một lần phục hồi tiêu tốn một tác vụ AI trong hạn mức tác vụ AI mỗi ngày của bạn, mặc định là 3 mỗi ngày khi không có tài khoản và 10 với tài khoản miễn phí, đồng thời giới hạn 2 lần bắt đầu mỗi giờ cho mỗi phiên; tác vụ thất bại được hoàn lại. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Tệp bạn tải lên đi từ trình duyệt đến bucket lưu trữ của chúng tôi rồi được tải xuống máy chủ GPU của chính chúng tôi, nơi FFmpeg cắt đoạn trích và sáu mô hình chạy dưới dạng tiến trình cục bộ; không có nhà cung cấp AI bên ngoài nào tham gia và không có gì được dùng để huấn luyện. Chỉ đoạn trích được chọn mới được giải mã thành khung hình; phần còn lại của nguồn không bao giờ được xử lý. Đối tượng nguồn, các khung hình trung gian, các MP4 theo từng mô hình được giữ cho trình xem so sánh và tệp lưu trữ kết quả đều được ghi vào sổ thời hạn lưu trữ và bị xóa khi hết thời hạn, còn liên kết đến tệp lưu trữ hết hạn sau 6 giờ. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tác vụ phục hồi không chạy bước phân tích nội dung tự động mà các lần chuyển đổi thông thường phải qua.',
      faq: [
        {
          question: 'Mô hình nâng độ phân giải video bằng AI nào tốt nhất?',
          answer: 'Điều đó tùy vào cảnh quay, và đó chính là lý do công cụ này tồn tại. Các công cụ nâng độ phân giải dạng GAN như Real-ESRGAN và HAT tạo ra khung hình sắc nét nhưng có thể nhấp nháy khi chuyển động; các mô hình chuỗi hình như BasicVSR++, RVRT và VRT dùng các khung hình lân cận để giữ ổn định và có thể trông mềm hơn. Hãy cho đoạn trích của chính bạn chạy qua chúng và đánh giá khi video đang phát.',
        },
        {
          question: 'Vì sao clip bị giới hạn ở 15 giây và 450 khung hình?',
          answer: 'Phục hồi tốn kém trên từng khung hình: chỉ riêng VRT, ước tính đã công bố là 7 giây mỗi khung hình ở 4x. Mức trần khung hình được kiểm tra theo tốc độ khung hình thực của bạn, nên nguồn 60 fps bị giới hạn ở 7,5 giây. Một đoạn trích ngắn là đủ để đánh giá chất lượng trước khi phục hồi dài hơn ở nơi khác.',
        },
        {
          question: 'Lựa chọn 2x hay 4x hoạt động thế nào?',
          answer: 'Chế độ tự động chọn 4x cho nguồn từ 540p trở xuống và 2x cho nguồn cao hơn. Dù vậy, mọi mô hình đều chạy mạng 4x gốc của nó; ở nhánh 2x, bước ghép thu nhỏ khung hình còn một nửa bằng bộ lọc Lanczos. Chọn 4x thủ công bị từ chối với nguồn trên 1080p vì đầu ra sẽ vượt quá 4K.',
        },
        {
          question: 'Video sau khi phục hồi có giữ âm thanh và tốc độ khung hình của tôi không?',
          answer: 'Có. Đoạn trích được cắt kèm âm thanh, và mỗi lần ghép đều dùng đúng phân số tốc độ khung hình lấy từ ffprobe (ví dụ 30000/1001) rồi gắn lại âm thanh đó dưới dạng AAC, nên mọi kết quả đều khớp nhau khi phát so sánh A/B.',
        },
        {
          question: 'Tệp lưu trữ kết quả chứa gì và lớn đến mức nào?',
          answer: 'original/clip.mp4, mỗi mô hình một thư mục chứa MP4 của nó (và với Real-ESRGAN, SwinIR và HAT khi có kèm khung hình, mọi PNG đã tăng cường ở 4x gốc), manifest.json với thời gian xử lý và kích thước, và README.txt. Khi bật kèm khung hình, một clip 10 giây thêm hàng trăm PNG dung lượng lớn cho mỗi mô hình, nên hãy chuẩn bị cho dung lượng tính bằng gigabyte.',
        },
        {
          question: 'Điều gì xảy ra nếu một mô hình thất bại hoặc hết thời gian chờ?',
          answer: 'Tác vụ vẫn tiếp tục. Thư mục của mô hình đó chứa FAILED.txt kèm lý do, manifest.json ghi lại điều này, và mọi mô hình khác đã chọn vẫn có mặt trong tệp lưu trữ. Tác vụ chỉ thất bại khi tất cả các mô hình đã chọn đều thất bại.',
        },
        {
          question: 'Một lần phục hồi mất bao lâu?',
          answer: 'Số khung hình nhân với ước tính của từng mô hình, cộng lại trên các mô hình bạn chọn, vì chúng chạy lần lượt: 0,8; 1,0; 3,0; 3,5; 5,0 và 7,0 giây mỗi khung hình cho Real-ESRGAN, BasicVSR++, RVRT, SwinIR, HAT và VRT. Một clip 300 khung hình qua cả sáu mô hình mất khoảng 100 phút; chỉ qua Real-ESRGAN thì khoảng 4 phút.',
        },
        {
          question: 'Tôi có thể chạy bao nhiêu lần phục hồi, và việc này có tính là một tác vụ AI không?',
          answer: 'Mỗi lần bắt đầu phục hồi tiêu tốn một tác vụ AI: mặc định 3 mỗi ngày khi không có tài khoản, 10 với tài khoản miễn phí, 100 với Premium và 200 với Pro, cộng thêm giới hạn 2 lần bắt đầu mỗi giờ cho mỗi phiên. Tác vụ thất bại hoàn toàn được hoàn lại. Xem trang giá để biết các con số hiện hành.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Đoạn trích bị giới hạn ở 15 giây hoặc 450 khung hình (tùy giá trị nào nhỏ hơn theo tốc độ khung hình của video); khuyên dùng 10 giây trở xuống.',
          'Độ phân giải nguồn tối đa là 1920×1080: việc phục hồi nhắm đến cảnh quay độ phân giải thấp, và đầu ra 4x của 1080p đã là 4K trở lên.',
        ],
        processingNotes: [
          'Các mô hình chạy từ nhanh nhất đến chậm nhất (Real-ESRGAN đầu tiên, VRT sau cùng) để sớm có kết quả từng phần.',
          'Một mô hình thất bại không bao giờ làm hỏng cả tác vụ: thư mục của nó chứa FAILED.txt và các kết quả khác vẫn tải xuống được.',
          'Liên kết tải xuống có hiệu lực trong 6 giờ; tệp lưu trữ có thể rất lớn khi kèm các khung hình đã tăng cường.',
        ],
      },
      related: [
        {
          label: 'Cắt video',
          to: '/tools/video-trimmer',
          description: 'Cắt đoạn trích bạn muốn phục hồi trước khi tải lên.',
        },
        {
          label: 'Phục hồi ảnh bằng AI',
          to: '/tools/ai-image-restoration',
          description: 'Cùng các họ mô hình đó cho một bức ảnh hoặc một khung hình.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Giảm dung lượng kết quả 4K đã phục hồi để chia sẻ.',
        },
        {
          label: 'Chuyển mã sang HLS',
          to: '/tools/transcode-to-hls',
          description: 'Đóng gói clip đã phục hồi để phát trực tuyến thích ứng.',
        },
        {
          label: 'Chuyển video thành văn bản',
          to: '/tools/transcribe-video',
          description: 'Thêm phụ đề cho cảnh quay đã phục hồi.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Dựng đoạn trích đã phục hồi thành một tác phẩm dài hơn.',
        },
      ],
      embed: {
        title: 'Phục hồi video bằng AI',
        description: 'Tải video lên, kéo để chọn một đoạn trích ngắn (10 giây trở xuống cho kết quả tốt nhất), chọn các mô hình phục hồi bạn muốn so sánh và tải về một gói chứa mọi kết quả đã tăng cường.',
      },
    },
    'ai-image-restoration': {
      name: 'Phục hồi và nâng độ phân giải ảnh bằng AI',
      h1: 'Công cụ phục hồi và nâng độ phân giải ảnh bằng AI',
      tagline: 'Làm sạch, nâng độ phân giải và phục hồi ảnh với tối đa tám mô hình AI: làm sạch sơ bộ giữ nguyên độ trung thực (FBCNN, SCUNet, NAFNet), công cụ nâng độ phân giải đa dụng (Real-ESRGAN, SwinIR, HAT) và tăng cường khuôn mặt (GFPGAN, CodeFormer), rồi so sánh từng kết quả với ảnh gốc.',
      metaTitle: 'Phục hồi & nâng độ phân giải ảnh AI: So sánh 8 mô hình trực tuyến | Media Manipulator',
      metaDescription: 'Phục hồi và nâng độ phân giải ảnh bằng AI miễn phí. Loại bỏ nhiễu JPEG, khử nhiễu và làm nét, rồi nâng lên 4K/8K bằng Real-ESRGAN, SwinIR hoặc HAT và tăng cường khuôn mặt bằng GFPGAN/CodeFormer, tất cả trên GPU của chúng tôi và so sánh cạnh nhau.',
      ogTitle: 'Phục hồi và nâng độ phân giải ảnh bằng AI: Làm sạch, phóng to và tăng cường khuôn mặt',
      ogDescription: 'Tải lên một ảnh, tùy chọn cắt, tùy chọn làm sạch sơ bộ, rồi chạy nhiều mô hình nâng độ phân giải và khuôn mặt và so sánh mọi kết quả ngay trên trang với ảnh gốc.',
      intro: 'Phục hồi ảnh bằng AI cho một bức ảnh chạy qua một quy trình có thể cấu hình gồm tối đa tám mô hình và hiển thị mọi kết quả bên cạnh ảnh gốc. Giai đoạn làm sạch sơ bộ giữ nguyên độ trung thực (FBCNN cho nhiễu nén JPEG, SCUNet cho nhiễu hạt, NAFNet cho nhòe chuyển động) loại bỏ phần xuống cấp mà không bịa thêm chi tiết; tiếp đó các công cụ nâng độ phân giải đa dụng (Real-ESRGAN, SwinIR, HAT) phóng to 2x hoặc 4x; và bước tăng cường khuôn mặt tùy chọn (GFPGAN, CodeFormer) tái tạo khuôn mặt. Làm sạch sơ bộ không mang tính tạo sinh: nó lọc tín hiệu vốn có. Tăng cường khuôn mặt mang tính tạo sinh: nó tổng hợp chi tiết có vẻ hợp lý và không được xem là sự khôi phục trung thực của ảnh nguồn. Mọi mô hình đều chạy trên máy chủ GPU của chính chúng tôi.',
      whatItDoes: [
        'Cho phép bạn kéo để chọn một vùng cắt, để ngân sách điểm ảnh và thời gian GPU dồn vào vùng bạn quan tâm; vùng cắt được áp dụng phía máy chủ trên ảnh gốc đã tự xoay đúng chiều, nên không mất chút chất lượng nào trong trình duyệt.',
        'Tùy chọn làm sạch sơ bộ trước, luôn theo thứ tự FBCNN, SCUNet, NAFNet, mỗi mô hình xử lý đầu ra của mô hình trước; ảnh đã làm sạch trở thành nền xuất phát cho mọi mô hình phía sau.',
        'Chạy bất kỳ tổ hợp nào của Real-ESRGAN, SwinIR và HAT ở 2x hoặc 4x. Cả ba đều là mạng x4 gốc; kết quả 2x là đầu ra x4 được thu nhỏ còn 50% bằng bộ lọc Lanczos.',
        'Tùy chọn chạy GFPGAN v1.4 và, nếu được bật trên máy chủ, CodeFormer với trọng số độ trung thực, trên ảnh nguồn và, khi bật «Nối chuỗi», trên cả kết quả của từng công cụ nâng độ phân giải.',
        'Đóng gói ảnh gốc đã chuẩn bị, mọi PNG đầu ra, một manifest.json và một README vào một tệp .tar.gz duy nhất, đồng thời hiển thị lưới so sánh ngay trên trang trong lúc tệp lưu trữ được cung cấp từ tác vụ.',
        'Ghi nhận mô hình thất bại thành một mục thất bại kèm lý do an toàn để hiển thị cho người dùng, và vẫn đóng gói mọi kết quả thành công.',
      ],
      flowSteps: [
        {
          title: 'Tải ảnh lên',
          description: 'PNG, JPEG, WebP, TIFF hoặc BMP tối đa 12.000 điểm ảnh mỗi cạnh; ảnh cũ, ảnh nhỏ và ảnh bị nén quá mức là đối tượng hướng đến.',
        },
        {
          title: 'Cắt hoặc giữ nguyên khung hình',
          description: 'Kéo chọn một vùng (khuôn mặt, biển số, tấm biển) hoặc tắt vùng cắt để phục hồi toàn bộ.',
        },
        {
          title: 'Chọn làm sạch sơ bộ, công cụ nâng độ phân giải, khuôn mặt, hệ số',
          description: 'Đánh dấu các mô hình bạn muốn; bộ chọn hiển thị lựa chọn của bạn sẽ tạo ra bao nhiêu đầu ra trên tổng số 12 được phép.',
        },
        {
          title: 'Theo dõi các giai đoạn',
          description: 'Tác vụ xếp hàng chờ suất phục hồi duy nhất, chuẩn bị ảnh, rồi chạy từng đơn vị với thanh tiến trình và huy hiệu lỗi riêng.',
        },
        {
          title: 'So sánh và tải xuống',
          description: 'Mỗi kết quả nằm cạnh ảnh gốc trong lưới; tải tệp lưu trữ về khi bạn đã quyết định quy trình nào thắng.',
        },
      ],
      advancedDetails: [
        'Giai đoạn chuẩn bị chạy ImageMagick -auto-orient thành một PNG đã chuẩn hóa, đọc kích thước của nó, từ chối mọi ảnh lớn hơn 12.000 x 12.000, chuyển hình chữ nhật vùng cắt đã chuẩn hóa của bạn thành số điểm ảnh nguyên và ghi ra working_source.png. Tệp đó cũng được lưu thành original.png trong kết quả, nên thứ bạn so sánh chính xác là thứ các mô hình đã nhận.',
        'Hệ số tự động chọn 4x khi vùng cắt cao từ 540 điểm ảnh trở xuống và 2x trong các trường hợp khác. Dù hệ số là bao nhiêu, đầu ra đều được kiểm tra theo ngân sách 67.108.864 điểm ảnh (khoảng 64 megapixel): một ảnh nguyên khung 6.000 x 4.000 ở 2x là 96 megapixel và bị từ chối kèm thông báo đề nghị bạn chọn 2x hoặc một vùng cắt nhỏ hơn.',
        'Real-ESRGAN chạy mạng realesrgan-x4plus qua realesrgan-ncnn-vulkan với ô 256 điểm ảnh. SwinIR dùng bộ trọng số GAN SwinIR-L x4 003_realSR_BSRGAN và HAT dùng bộ trọng số Real_HAT_GAN_SRx4, cả hai qua cùng một script xử lý từng khung hình như Phục hồi video bằng AI, với ô 320 điểm ảnh và vùng chồng lấn 32 điểm ảnh, nên vùng cắt lớn không bao giờ vượt quá bộ nhớ GPU.',
        'Bộ trọng số làm sạch sơ bộ là fbcnn_color.pth, scunet_color_real_psnr.pth (mô hình nhiễu thực được huấn luyện theo PSNR, không phải biến thể GAN vốn bịa ra kết cấu) và NAFNet-GoPro-width64.pth (khử nhòe chuyển động, không phải nhòe do lệch nét). Chúng chạy theo ô 512 điểm ảnh với vùng chồng lấn 32 điểm ảnh và không bao giờ thay đổi kích thước. FBCNN tự đoán hệ số chất lượng JPEG trừ khi bạn đặt một giá trị từ 1 đến 100; số càng thấp thì mô hình càng giả định ảnh bị nén nặng.',
        'GFPGAN dùng kiến trúc v1.4 bản sạch với chức năng nâng mẫu nền bị tắt, nên phần ngoài khuôn mặt chỉ được đổi kích thước đơn thuần theo hệ số thay vì được mô hình tăng cường; điều đó giữ cho việc so sánh trung thực. CodeFormer nhận trọng số độ trung thực w từ 0 đến 1 (mặc định 0,7): thấp hơn thì đẹp hơn, cao hơn thì sát với đầu vào hơn. CodeFormer được phát hành theo giấy phép phi thương mại và nằm sau một cờ máy chủ mặc định bị tắt.',
        '«Nối chuỗi» chạy lại từng mô hình khuôn mặt ở 1x trên đầu ra của mọi công cụ nâng độ phân giải, ngoài ảnh nguồn, nên số đầu ra là làm sạch sơ bộ + đa dụng + khuôn mặt + khuôn mặt x đa dụng. Máy chủ giới hạn mỗi tác vụ ở 12 đầu ra, mỗi lúc chỉ chạy một tác vụ phục hồi, và cho mỗi mô hình 1.800 giây trước khi đánh dấu là hết thời gian chờ.',
        'Máy chủ ước tính thời gian chạy của từng mô hình theo giá trị mặc định số giây mỗi megapixel của chính nó: FBCNN 3, SCUNet 8, NAFNet 6, Real-ESRGAN 2, SwinIR 12, HAT 18, GFPGAN 6, CodeFormer 8. Các giá trị này dùng để tính trọng số tiến trình và ước tính trên giao diện; chúng là giá trị tinh chỉnh, không phải cam kết.',
        'Kết quả không được tải lên kho lưu trữ đối tượng: tệp .tar.gz và các PNG kết quả nằm trong thư mục đầu ra của tác vụ và được cung cấp từ tác vụ trong suốt thời hạn lưu trữ.',
      ],
      whyItMatters: [
        'Không có mô hình nào thắng trên mọi bức ảnh: loại bỏ nhiễu nén, khử nhiễu, nâng độ phân giải và tái tạo khuôn mặt mỗi thứ sửa một kiểu hư hại khác nhau, và thứ tự đúng phụ thuộc vào cách bức ảnh đã bị xuống cấp.',
        'Chạy nhiều mô hình trên một lần tải lên và xem chúng cạnh nhau sẽ trả lời câu hỏi "mô hình nào, và ở hệ số nào?" trước khi bạn bắt tay vào một lô lớn hơn.',
        'Sự phân biệt giữa không tạo sinh và tạo sinh là quan trọng: ảnh đã làm sạch sơ bộ là bản sao đã lọc của bằng chứng, ảnh đã tăng cường khuôn mặt là bản tái tạo có vẻ hợp lý, và trang này ghi rõ cái nào là cái nào.',
      ],
      useCases: [
        {
          title: 'Phục hồi ảnh cũ hoặc ảnh quét',
          description: 'Làm sạch sơ bộ nhiễu máy quét và nhiễu nén, rồi nâng độ phân giải và, nếu bạn muốn, tái tạo khuôn mặt.',
        },
        {
          title: 'Tăng cường ảnh tĩnh độ phân giải thấp',
          description: 'Cắt vào vùng cần quan tâm, loại bỏ nhiễu và nâng độ phân giải; nối tiếp bước tăng cường khuôn mặt để ảnh rõ hơn, nhưng không bao giờ dùng làm bằng chứng nhận dạng.',
        },
        {
          title: 'Sửa ảnh tải về đã bị nén',
          description: 'Các bản xuất mạng xã hội bị nén lại nhiều lần đáp ứng tốt với FBCNN rồi SCUNet, sau đó là một công cụ nâng độ phân giải dạng GAN.',
        },
        {
          title: 'So sánh công cụ nâng độ phân giải trước khi xử lý theo lô',
          description: 'Cho một ảnh đại diện chạy qua Real-ESRGAN, SwinIR và HAT để chọn mô hình cho một bộ ảnh lớn hơn.',
        },
        {
          title: 'Dồn ngân sách vào một vùng',
          description: 'Kéo chọn riêng một khuôn mặt hoặc một tấm biển để ngân sách 64 megapixel và thời gian GPU được dùng đúng chỗ.',
        },
      ],
      workedExamples: [
        {
          title: 'Một JPEG 1.200 x 800 (khoảng 350 KB), nguyên khung, hệ số tự động, FBCNN + Real-ESRGAN + GFPGAN',
          body: 'Vùng cắt là toàn bộ khung hình 0,96 megapixel và chiều cao 800 điểm ảnh của nó lớn hơn 540, nên hệ số tự động chọn 2x. FBCNN chạy trước ở 1x và đầu ra của nó trở thành nguồn làm việc. Real-ESRGAN nâng ảnh đó lên 4.800 x 3.200 bằng realesrgan-x4plus, rồi ImageMagick thu nhỏ còn 50% bằng Lanczos để có một PNG 2.400 x 1.600. GFPGAN chạy trên nguồn đã làm sạch sơ bộ với hệ số phóng 2, cho ra thêm một PNG 2.400 x 1.600 với khuôn mặt được tái tạo và phần còn lại chỉ được đổi kích thước đơn thuần. Đó là ba đầu ra trên tổng số 12 được phép. Theo ước tính mỗi megapixel của chính máy chủ, thời gian chạy mô hình vào khoảng 0,96 x (3 + 2 + 6), tức khoảng 11 giây, cộng thêm vài giây chuẩn bị và đóng gói; thời gian chờ suất phục hồi duy nhất có thể làm lâu hơn. Một tác vụ tiêu tốn một tác vụ AI.',
        },
        {
          title: 'Một vùng cắt khuôn mặt 300 x 400 từ ảnh tĩnh 640 x 480, làm sạch sơ bộ, ba công cụ nâng độ phân giải, GFPGAN với «Nối chuỗi»',
          body: 'Vùng cắt có 0,12 megapixel và cao 400 điểm ảnh, nên hệ số tự động chọn 4x và mọi kết quả đã nâng độ phân giải đều là 1.200 x 1.600 (1,92 megapixel), nằm rất xa trong ngân sách 64 megapixel. Với làm sạch sơ bộ bằng FBCNN và SCUNet, cùng Real-ESRGAN, SwinIR và HAT, và GFPGAN được nối chuỗi, tác vụ tạo ra 2 + 3 + 1 + 1 x 3 = 9 đầu ra: hai bước làm sạch sơ bộ, ba lần nâng độ phân giải, GFPGAN trên nguồn đã làm sạch, và GFPGAN trên từng kết quả đã nâng độ phân giải ở 1x. Theo ước tính của máy chủ, mỗi lượt làm sạch sơ bộ và nâng độ phân giải trên 0,12 megapixel chỉ mất vài giây, trong khi ba lượt khuôn mặt nối chuỗi chạy trên các kết quả 1,92 megapixel và mất nhiều thời gian hơn tương ứng. Mỗi đầu ra khuôn mặt đều mang ghi chú tạo sinh trong manifest, vì những gì bạn thấy trên các khuôn mặt đó là tái tạo, không phải khôi phục.',
        },
      ],
      whenNotToUse: 'Đừng dùng tăng cường khuôn mặt để nhận dạng: GFPGAN và CodeFormer vẽ ra những khuôn mặt có vẻ hợp lý từ một tiên nghiệm đã học, nên một khuôn mặt được tái tạo cùng lắm chỉ là manh mối và không bao giờ là bằng chứng về người có trong ảnh. Hãy bỏ qua công cụ này với những ảnh vốn đã lớn và sắc nét, nơi một lượt 2x chủ yếu chỉ thêm kết cấu GAN, và với ảnh lớn hơn 12.000 điểm ảnh mỗi cạnh, vốn sẽ bị từ chối. Nếu bạn chỉ cần một bản lớn hơn của một ảnh sạch mà không cần làm sạch sơ bộ, mô hình khuôn mặt hay lưới so sánh, công cụ Nâng độ phân giải ảnh bằng AI tốn ít thời gian hơn. Và nếu ảnh của bạn bị nhòe do lệch nét chứ không phải nhòe chuyển động, bộ trọng số GoPro của NAFNet không phải là mô hình phù hợp.',
      whyMediaManipulator: [
        'Tám mô hình nghiên cứu sau một lần tải lên, không cần notebook, thiết lập CUDA hay quản lý tệp trọng số.',
        'Mọi mô hình đều chạy trên máy chủ GPU do chúng tôi vận hành; ảnh không được gửi đến dịch vụ AI của bên thứ ba.',
        'Trang này giữ sự phân biệt một cách trung thực: đầu ra làm sạch sơ bộ mang ghi chú độ trung thực, đầu ra khuôn mặt mang ghi chú tạo sinh, và ảnh gốc đã chuẩn bị luôn có mặt trong lưới.',
      ],
      privacyNote: 'Ảnh của bạn được lưu trong thư mục tác vụ, được ImageMagick tự xoay đúng chiều và cắt thành một PNG làm việc, rồi được các mô hình đã chọn xử lý trên GPU của chính chúng tôi. Khi tác vụ kết thúc, thư mục tải lên và cây thư mục làm việc bị xóa; những gì còn lại cùng tác vụ là ảnh gốc đã chuẩn bị, từng PNG kết quả, manifest và tệp .tar.gz đã đóng gói, được cung cấp từ tác vụ để tải xuống và cho lưới so sánh. Đầu ra của mô hình khuôn mặt được ghi nhãn là bản tái tạo tạo sinh trong manifest đó. Không có nhà cung cấp AI bên thứ ba nào nhận được ảnh. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Làm sạch sơ bộ khác gì với các mô hình nâng độ phân giải hoặc mô hình khuôn mặt?',
          answer: 'Các mô hình làm sạch sơ bộ (FBCNN, SCUNet, NAFNet) không mang tính tạo sinh: chúng loại bỏ nhiễu nén, nhiễu hạt và nhòe chuyển động bằng cách lọc tín hiệu sẵn có ở 1x. Công cụ nâng độ phân giải thêm độ phân giải, còn các mô hình khuôn mặt (GFPGAN, CodeFormer) mang tính tạo sinh, tổng hợp chi tiết khuôn mặt có vẻ hợp lý. Đầu ra làm sạch sơ bộ là ảnh đã lọc trung thực; đầu ra khuôn mặt là một bản tái tạo.',
        },
        {
          question: 'Khuôn mặt đã tăng cường có thể dùng làm bằng chứng nhận dạng không?',
          answer: 'Không. GFPGAN và CodeFormer tạo ra những khuôn mặt có vẻ hợp lý từ một tiên nghiệm đã học; chúng không khôi phục khuôn mặt thật. Chính vì lý do này mà manifest đánh dấu mọi đầu ra khuôn mặt bằng ghi chú tạo sinh. Chỉ dùng chúng để ảnh rõ hơn và làm manh mối.',
        },
        {
          question: 'Vì sao các mô hình làm sạch sơ bộ luôn chạy theo thứ tự cố định dù tôi đánh dấu thế nào?',
          answer: 'Nhiễu nén phải được loại bỏ trước khi khử nhiễu, nếu không bộ khử nhiễu sẽ coi hiện tượng vỡ khối là tín hiệu, và khử nhòe hoạt động tốt nhất trên đầu vào sạch nhất, nên máy chủ luôn chạy FBCNN, rồi SCUNet, rồi NAFNet, mỗi mô hình trên kết quả trước đó. Nếu một trong số chúng thất bại, mô hình tiếp theo tiếp tục từ bước thành công gần nhất.',
        },
        {
          question: 'Chế độ tự động quyết định giữa 2x và 4x thế nào, và giới hạn kích thước là bao nhiêu?',
          answer: 'Chế độ tự động chọn 4x khi vùng cắt cao tối đa 540 điểm ảnh và 2x trong các trường hợp khác. Sau đó đầu ra được kiểm tra theo ngân sách khoảng 64 megapixel (67.108.864 điểm ảnh); yêu cầu vượt quá sẽ bị từ chối kèm số megapixel và gợi ý chọn 2x hoặc vùng cắt nhỏ hơn. Ảnh nguồn lớn hơn 12.000 điểm ảnh ở bất kỳ cạnh nào sẽ bị từ chối trước bước đó.',
        },
        {
          question: '«Nối chuỗi» ảnh hưởng thế nào đến số đầu ra?',
          answer: 'Khi bật «Nối chuỗi», mỗi mô hình khuôn mặt còn chạy ở 1x trên kết quả của mọi công cụ nâng độ phân giải, nên số đầu ra = làm sạch sơ bộ + đa dụng + khuôn mặt + khuôn mặt x đa dụng. Hai công cụ nâng độ phân giải và hai mô hình khuôn mặt có nối chuỗi là 2 + 2 + 4 = 8 đầu ra, chưa tính làm sạch sơ bộ; máy chủ cho phép 12 đầu ra mỗi tác vụ.',
        },
        {
          question: 'Điều gì xảy ra nếu một mô hình ảnh thất bại hoặc hết thời gian chờ?',
          answer: 'Tác vụ vẫn tiếp tục. Đơn vị đó được đánh dấu thất bại kèm lý do an toàn để hiển thị (ví dụ hết thời gian chờ sau 1.800 giây, kèm gợi ý dùng vùng cắt nhỏ hơn hoặc 2x), manifest ghi lại điều này, và mọi kết quả khác vẫn được đóng gói và hiển thị. Tác vụ chỉ thất bại khi mọi mô hình đã chọn đều thất bại, và khi đó tác vụ AI được hoàn lại.',
        },
        {
          question: 'Vì sao CodeFormer bị làm mờ?',
          answer: 'CodeFormer được cấp phép cho mục đích phi thương mại, nên nó nằm sau một cờ máy chủ mặc định bị tắt; khi đó danh sách khả năng báo rằng nó hiện đang bị vô hiệu hóa. GFPGAN và ba mô hình làm sạch sơ bộ có giấy phép thoáng và luôn sẵn dùng khi bộ trọng số của chúng đã được cài đặt.',
        },
        {
          question: 'Tôi có thể chạy bao nhiêu lần phục hồi, và có miễn phí không?',
          answer: 'Mỗi lần bắt đầu phục hồi tiêu tốn một tác vụ AI: theo mặc định 3 mỗi ngày với khách, 10 với tài khoản miễn phí, 100 với Premium và 200 với Pro, bất kể bạn đánh dấu bao nhiêu mô hình trong tác vụ đó. Ngoài ra còn có giới hạn riêng là 6 lần bắt đầu mỗi phiên mỗi giờ. Giới hạn tải lên là 200 MB với khách và 1 GB với tài khoản miễn phí; /pricing hiển thị các con số hiện hành.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Đầu ra bị giới hạn bởi ngân sách điểm ảnh (~64 megapixel), vượt xa 8K: nếu vùng cắt và hệ số sẽ vượt quá ngân sách này, hãy chọn 2x hoặc một vùng cắt nhỏ hơn.',
          'Các mô hình làm sạch sơ bộ không bao giờ thay đổi kích thước (1x); chỉ các công cụ nâng độ phân giải đa dụng mới thay đổi độ phân giải.',
        ],
        processingNotes: [
          'Làm sạch sơ bộ luôn chạy trước theo thứ tự cố định (FBCNN → SCUNet → NAFNet); ảnh đã làm sạch trở thành nền cho mọi mô hình khác.',
          'Một mô hình thất bại không bao giờ làm hỏng cả tác vụ: mục của nó hiển thị lý do và các kết quả khác vẫn tải xuống được.',
          'Tăng cường khuôn mặt là tái tạo mang tính tạo sinh: hãy dùng nó để ảnh rõ hơn và làm manh mối, không dùng làm bằng chứng nhận dạng.',
        ],
      },
      related: [
        {
          label: 'Phục hồi video bằng AI',
          to: '/tools/ai-video-restoration',
          description: 'Người anh em dành cho hình ảnh động: cùng các công cụ nâng độ phân giải trên một clip ngắn.',
        },
        {
          label: 'Nâng độ phân giải ảnh bằng AI',
          to: '/tools/ai-image-upscaler',
          description: 'Một lượt Real-ESRGAN duy nhất khi bạn chỉ cần ảnh lớn hơn.',
        },
        {
          label: 'Xóa nền ảnh',
          to: '/tools/remove-background-from-image',
          description: 'Tách chủ thể ra sau khi phục hồi.',
        },
        {
          label: 'Nén ảnh',
          to: '/tools/compress-image',
          description: 'Giảm dung lượng PNG đã phục hồi để chia sẻ.',
        },
        {
          label: 'Đổi kích thước ảnh',
          to: '/tools/image-resizer',
          description: 'Đổi kích thước ảnh đã phục hồi về đúng số đo mong muốn.',
        },
        {
          label: 'Xóa siêu dữ liệu EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Gỡ siêu dữ liệu khỏi kết quả trước khi đăng.',
        },
      ],
      embed: {
        title: 'Phục hồi và nâng độ phân giải ảnh bằng AI',
        description: 'Tải ảnh lên, tùy chọn cắt vào một vùng, tùy chọn làm sạch sơ bộ, chọn các mô hình nâng độ phân giải và tăng cường khuôn mặt bạn muốn so sánh, rồi tải về một gói chứa mọi kết quả.',
      },
    },
    'ai-document-scan': {
      name: 'Quét tài liệu bằng AI',
      h1: 'Quét tài liệu bằng AI: Trang quét và chữ viết tay sang PDF / Word có thể tìm kiếm',
      tagline: 'Biến tài liệu quét và ghi chú viết tay thành PDF nhiều trang có thể tìm kiếm và tài liệu Word có thể chỉnh sửa: trang in được gắn lớp văn bản Tesseract trung thực, chữ viết tay được AI thị giác chép lại, đánh dấu chỗ chưa chắc chắn và không bao giờ bịa ra.',
      metaTitle: 'Quét tài liệu bằng AI: Trang quét và chữ viết tay sang PDF/Word | Media Manipulator',
      metaDescription: 'Quét tài liệu bằng AI miễn phí: chuyển ảnh quét thành PDF có thể tìm kiếm và OCR ảnh sang Word, đồng thời chép ghi chú viết tay thành văn bản. Sắp xếp lại trang, trộn bản in và chữ viết tay, tất cả trên GPU của chúng tôi, nguyên văn và đánh dấu chỗ chưa chắc chắn.',
      ogTitle: 'Quét tài liệu bằng AI: PDF có thể tìm kiếm + Word từ bản quét và chữ viết tay',
      ogDescription: 'Tải lên một hoặc nhiều trang đã quét, in hoặc viết tay, sắp xếp lại và nhận PDF có thể tìm kiếm cùng DOCX có thể chỉnh sửa. Trang in được giữ trung thực; chữ viết tay được chép nguyên văn, giữ lại các dấu [illegible]/[?].',
      intro: 'Quét tài liệu bằng AI biến một hoặc nhiều trang được chụp hoặc quét thành tệp PDF nhiều trang có thể tìm kiếm và, nếu bạn yêu cầu, một tài liệu Word có thể chỉnh sửa. Công cụ xử lý hai loại trang theo cách khác nhau và cho bạn biết trang nào thuộc loại nào. Trang in hoặc đánh máy đi qua OCRmyPDF và Tesseract: trang đầu ra chính là bản quét của bạn, giữ nguyên, với một lớp văn bản ẩn bên dưới để bạn có thể tìm kiếm, chọn và sao chép. Trang viết tay được đọc bởi một mô hình thị giác - ngôn ngữ chạy trên GPU của chính chúng tôi; mô hình này chép lại chữ viết từng từ một, đánh dấu chỗ không đọc được là [illegible] (không đọc được) và bao một từ còn nghi ngờ thành [?: best guess] (phỏng đoán tốt nhất), đồng thời được dặn không bao giờ tự hoàn thiện, sửa hay chỉnh trau chuốt bất cứ thứ gì. Một tác vụ có thể trộn cả hai loại, từng trang một, theo thứ tự bạn đặt, và kết quả ghi rõ bộ máy xử lý cùng độ tin cậy của từng trang.',
      whatItDoes: [
        'Nhận tối đa 50 ảnh trang mỗi tác vụ (PNG, JPEG, WebP, TIFF, BMP hoặc HEIC, mặc định 25 MB mỗi ảnh), chuẩn hóa từng ảnh thành PNG đúng chiều, và cho bạn kéo sắp xếp chúng theo thứ tự đọc trước.',
        'Ở chế độ Tự động, công cụ hỏi mô hình thị giác một câu cho mỗi trang (in hay viết tay?) và chuyển trang đến đúng nơi xử lý; chế độ In và Viết tay áp đặt sẵn câu trả lời.',
        'Tạo một PDF/A trong đó mỗi trang in là bản quét gốc kèm lớp văn bản Tesseract, còn mỗi trang viết tay là bản quét kèm một lớp chép lời bằng máy vô hình được đặt theo từng dòng, với chân trang hiển thị ghi rõ điều đó.',
        'Tùy chọn tạo tài liệu Word: trang in được PaddleOCR-VL (hoặc Docling) dựng lại thành tiêu đề, danh sách và bảng, trang viết tay là bản chép nguyên văn nằm dưới một ghi chú in đậm nhắc đối chiếu với bản quét, tất cả được Pandoc kết xuất.',
        'Báo cáo cho từng trang bộ máy đã dùng, độ tin cậy cao, trung bình hoặc thấp, và số lượng dấu hiệu không chắc chắn, để bạn biết cần xem lại chỗ nào.',
        'Có thể chạy một lượt xác minh chỉ đọc lại các từ đã được đánh dấu, một ý kiến thứ hai độc lập đánh dấu chỗ bất đồng thành [?: vlm | other], và một bản tóm tắt AI được ghi nhãn riêng, khi máy chủ đã bật các bộ máy đó.',
      ],
      flowSteps: [
        {
          title: 'Thêm các trang',
          description: 'Thả vào mỗi tệp một ảnh trang, in hoặc viết tay hoặc trộn lẫn, rồi kéo để sắp xếp thứ tự.',
        },
        {
          title: 'Chọn chế độ và đầu ra',
          description: 'Tự động, In hoặc Viết tay; luôn có PDF, Word là tùy chọn; ngôn ngữ Tesseract cho trang in; chỉnh nghiêng và tự xoay cho OCR trang in.',
        },
        {
          title: 'Chuẩn bị và đọc',
          description: 'Các trang được tự xoay đúng chiều và, với chữ viết tay, được nâng độ phân giải 2x bằng Real-ESRGAN trước khi mô hình đọc; trang in chờ Tesseract ở bước tạo PDF.',
        },
        {
          title: 'Tạo các tệp',
          description: 'OCRmyPDF và reportlab tạo PDF cho từng trang, pikepdf ghép chúng lại; tài liệu Word được Pandoc dựng từ Markdown.',
        },
        {
          title: 'Xem lại và tải xuống',
          description: 'Trình xem mở tệp PDF; tải nó về, cùng tệp Word nếu bạn yêu cầu, và manifest ghi lại bộ máy xử lý và độ tin cậy của từng trang.',
        },
      ],
      advancedDetails: [
        'Trang in: PNG đã chuẩn hóa được img2pdf gói lại không mất dữ liệu, sau đó OCRmyPDF chạy Tesseract với (các) mã ngôn ngữ của bạn, deskew và rotate_pages khi được đánh dấu, output_type pdfa và force_ocr, rồi ghi lớp văn bản bên dưới hình ảnh. Nếu OCRmyPDF thất bại trên một trang, trang chỉ có hình ảnh vẫn được giữ, nên PDF vẫn đầy đủ.',
        'Trang viết tay: mô hình là qwen3-vl (8B, instruct, lượng tử hóa q8_0) do Ollama phục vụ ở nhiệt độ 0,1, được yêu cầu chép nguyên văn, giữ ngắt dòng, đánh dấu [illegible] và [?: guess], ghi chú các ký hiệu như (arrow) hoặc (circled), và trả về JSON gồm toàn bộ văn bản cùng một khung bao cho mỗi dòng.',
        'Trang PDF viết tay được reportlab vẽ theo kích thước điểm ảnh của hình: bản quét là trang hiển thị, mỗi dòng chép lời được đặt tại khung bao của nó ở chế độ hiển thị văn bản 3 (có thể tìm kiếm, không bao giờ được vẽ ra) bằng phông Helvetica cỡ theo chiều cao dòng trong khoảng 6 đến 48 point, với một khối vô hình phủ cả trang làm phương án dự phòng khi không nhận được khung bao nào, và một chân trang màu xám cỡ 8 point ghi "Machine transcription, verify against original" (Bản chép bằng máy, hãy đối chiếu với bản gốc).',
        'Độ tin cậy được tính toán, không phải đoán: cao khi trang không có dấu hiệu nào, trung bình khi dưới 15% số dòng có dấu hiệu, thấp trong các trường hợp còn lại. Lượt xác minh (bật theo mặc định) gửi trang và bản nháp trở lại mô hình kèm chỉ dẫn chỉ giải quyết các từ đã đánh dấu và không thay đổi gì khác; nếu lượt này thất bại, bản nháp được giữ lại.',
        'Làm sạch sơ bộ cho chữ viết tay là realesrgan-x4plus ở hệ số 2 trên GPU Vulkan, bật theo mặc định cho Tự động và Viết tay, tắt cho In; đây là bước cố gắng hết mức và ảnh gốc được giữ lại nếu nó thất bại. Tài liệu Word được Pandoc dựng từ Markdown kiểu GitHub; bản tóm tắt tùy chọn dùng một mô hình văn bản riêng và được ghi vào tệp riêng kèm nhãn do AI tạo.',
        'Theo mặc định, mỗi lúc máy chủ chỉ chạy một tác vụ tài liệu, mỗi lần gọi mô hình có giới hạn trần 40 phút, và các tệp tải lên cùng thư mục làm việc bị xóa ngay khi tác vụ kết thúc; chỉ thư mục kết quả (PDF, DOCX, manifest.json, README.txt) được giữ lại trong thời hạn lưu trữ.',
      ],
      whyItMatters: [
        'Ảnh chụp một trang giấy chưa phải là tài liệu cho đến khi có thể tìm kiếm và trích dẫn. Tệp PDF bổ sung điều đó mà không chạm đến điểm ảnh, nên bản quét vẫn là nguồn chuẩn.',
        'Nhận dạng chữ viết tay mà đoán một cách tự tin còn tệ hơn là không có. Các dấu hiệu [illegible] và [?: guess] rõ ràng, độ tin cậy theo từng trang và một nhãn hiển thị giúp bản chép dùng được như một bản nháp và không bao giờ bị nhầm với bản gốc.',
        'Trang in và trang viết tay cần những bộ máy khác nhau. Chuyển từng trang đến đúng bộ máy, trong một tác vụ có thứ tự, chính là điều giúp một cuốn sổ có biểu mẫu in và câu trả lời viết tay trở thành một tệp duy nhất.',
      ],
      useCases: [
        {
          title: 'Giấy tờ có thể tìm kiếm',
          description: 'Hợp đồng, biên lai và biểu mẫu đã quét trở thành một PDF/A duy nhất mà bạn có thể tìm kiếm và sao chép, ảnh trang được giữ nguyên.',
        },
        {
          title: 'Sổ ghi chép thực địa và phòng thí nghiệm',
          description: 'Ghi chú viết tay trở thành PDF có thể tìm kiếm và bản nháp Word với mọi từ chưa chắc chắn được đánh dấu để bạn kiểm tra.',
        },
        {
          title: 'Ảnh sang Word',
          description: 'Một trang in chụp bằng điện thoại trở thành tệp .docx có thể chỉnh sửa với tiêu đề, danh sách và bảng được dựng lại.',
        },
        {
          title: 'Tài liệu hỗn hợp',
          description: 'Một bảng câu hỏi in sẵn có câu trả lời viết tay đi qua cả hai bộ máy và trở về thành một tệp duy nhất theo đúng thứ tự.',
        },
        {
          title: 'Kho lưu trữ',
          description: 'Thư từ và biên bản đánh máy cũ có thêm lớp văn bản để lập chỉ mục, trong khi bản quét được giữ nguyên như cũ.',
        },
      ],
      workedExamples: [
        {
          title: 'Ba trang A4 in ở 300 dpi',
          body: 'Ba bản quét JPEG 2480 x 3508 ở chế độ In, chỉ xuất PDF, ngôn ngữ eng, bật chỉnh nghiêng và tự xoay. Không có mô hình nào tham gia: mỗi trang được img2pdf gói lại, sau đó OCRmyPDF chạy Tesseract và ghi một lớp văn bản ẩn, xuất PDF/A, rồi pikepdf ghép ba trang thành document.pdf. Lớp văn bản chỉ thêm vài kilobyte mỗi trang, nên PDF có dung lượng xấp xỉ ba ảnh trang (một trang được chỉnh thẳng sẽ được kết xuất lại, trang không bị chỉnh được nhúng nguyên trạng). Tác vụ tiêu tốn một tác vụ AI (được hoàn lại nếu thất bại) và thời gian xử lý là Tesseract chạy trên CPU, lần lượt từng trang, cộng với thời gian chờ trong hàng đợi, vì theo mặc định mỗi lúc chỉ chạy một tác vụ tài liệu.',
        },
        {
          title: 'Hai trang viết tay chụp bằng điện thoại, có Word',
          body: 'Hai ảnh chụp điện thoại 4032 x 3024 các trang sổ ghi chép ở chế độ Tự động, xuất PDF và DOCX. Bước chuẩn bị tự xoay cả hai về PNG và, vì chế độ không phải In, nâng độ phân giải 2x bằng realesrgan-x4plus lên 8064 x 6048. Bước phân loại hỏi qwen3-vl một câu cho mỗi trang, bước nhận dạng trả về bản chép kèm khung bao cho mỗi dòng, và bước xác minh chỉ đọc lại các từ đã đánh dấu. Nếu một trang có 30 dòng và 2 trong số đó mang dấu [?: ...], 2 / 30 thấp hơn 15% nên trang được đánh giá độ tin cậy trung bình với illegibleCount là 2. Các trang PDF là ảnh đã xử lý với các dòng Helvetica vô hình tại những khung bao đó cùng dấu chân trang; tệp Word chứa văn bản nguyên văn dưới ghi chú xác minh in đậm. Thời gian xử lý là ba lượt mô hình thị giác nối tiếp nhau cho mỗi trang trên GPU của chúng tôi; không có gì được chạy ở nơi khác.',
        },
      ],
      whenNotToUse: 'Đừng dùng công cụ này khi bạn cần văn bản có giá trị chuẩn mà không phải kiểm tra: đầu ra chữ viết tay là kết quả đọc bằng máy với các chỗ trống đã đánh dấu, còn tài liệu Word và bản tóm tắt là bản dựng lại, nên hãy đối chiếu chúng với bản quét trước khi trích dẫn. Đây không phải công cụ OCR từ PDF sang PDF: đầu vào là ảnh trang, nên hãy kết xuất PDF có sẵn thành ảnh trước, và đây cũng không phải công cụ dịch. Nếu bạn chỉ cần đóng các trang thành PDF mà không có lớp văn bản, công cụ ảnh sang PDF thông thường làm việc đó như một tác vụ thường thay vì một tác vụ AI, giúp giữ lại hạn mức ba tác vụ AI mỗi ngày của khách cho những việc cần đến mô hình.',
      whyMediaManipulator: [
        'PDF trang in trung thực ngay từ cách tạo: OCRmyPDF đặt văn bản bên dưới ảnh trang được giữ nguyên và xuất PDF/A, không có gì bị vẽ lại.',
        'Chữ viết tay được chép nguyên văn và có căn cứ: lời nhắc cấm bịa đặt, sự không chắc chắn được đánh dấu ngay trong văn bản, độ tin cậy được đếm từ những dấu hiệu đó, và trang ghi rõ đây là bản chép bằng máy.',
        'Mọi bộ máy đều là của chúng tôi: Tesseract trên CPU, qwen3-vl và mô hình văn bản qua Ollama, PaddleOCR-VL và Real-ESRGAN trên GPU của chúng tôi. Không trang nào được gửi đến dịch vụ AI của bên thứ ba.',
      ],
      privacyNote: 'Ảnh trang của bạn được lưu vào uploads/<jobId>/src/ và bản sao đã chuẩn hóa được lưu vào một thư mục làm việc; trang viết tay được gửi đến mô hình qwen3-vl do Ollama phục vụ trên GPU của chính chúng tôi, trang in được Tesseract đọc trên CPU, và các bản nháp chép lời theo từng trang được giữ dưới dạng JSON trong thư mục làm việc đó khi tác vụ đang chạy. Khi tác vụ kết thúc, cả thư mục tải lên lẫn thư mục làm việc đều bị xóa ngay lập tức; những gì còn lại là thư mục kết quả trong outputs/<jobId>/ với PDF, tệp Word nếu bạn yêu cầu, manifest (bộ máy, độ tin cậy và số dấu hiệu theo từng trang) và một README, và thư mục đó bị xóa khi hết thời hạn lưu trữ. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Văn bản đã chép nằm trong lớp văn bản của PDF và tệp DOCX bạn tải về. Không có gì được gửi đến nhà cung cấp AI bên thứ ba và không có gì được dùng để huấn luyện.',
      faq: [
        {
          question: 'PDF và tài liệu Word khác nhau thế nào?',
          answer: 'PDF là bản quét của bạn kèm lớp văn bản có thể tìm kiếm: lớp Tesseract dưới trang in, bản chép bằng máy vô hình dưới trang viết tay, trong cả hai trường hợp ảnh gốc đều là trang hiển thị. Tài liệu Word là một bản dựng lại riêng: trang in thành tiêu đề, danh sách và bảng do PaddleOCR-VL hoặc Docling tạo ra, trang viết tay là bản chép nguyên văn dưới một ghi chú in đậm nhắc bạn xác minh. Hãy xem ảnh trong PDF là nguồn chuẩn và DOCX là bản nháp.',
        },
        {
          question: 'Bản chép chữ viết tay đáng tin cậy đến mức nào?',
          answer: 'Đó là kết quả đọc cẩn thận bằng máy, không phải bản chép được chứng thực. Mô hình được chỉ dẫn sao chép chính xác những gì được viết, đánh dấu bất cứ chỗ nào không đọc được là [illegible] và mọi từ còn nghi ngờ là [?: best guess], và không bao giờ bịa thêm hay sửa chữa. Mỗi trang nhận một mức độ tin cậy (cao khi không có dấu hiệu, trung bình khi dưới 15% số dòng bị đánh dấu, thấp khi trên mức đó) và số lượng dấu hiệu, còn trang PDF mang chân trang hiển thị cho biết đây là bản chép bằng máy. Hãy đối chiếu các từ đã đánh dấu với bản quét.',
        },
        {
          question: 'Tôi có thể trộn trang in và trang viết tay không?',
          answer: 'Có. Ở chế độ Tự động, mô hình thị giác được hỏi với từng trang xem trang đó chủ yếu là in hay viết tay, và trang được chuyển đến Tesseract hoặc mô hình chữ viết tay tương ứng. Manifest ghi lại câu trả lời cho từng trang, và PDF cùng tệp Word cuối cùng giữ đúng thứ tự bạn đã đặt trước khi bắt đầu.',
        },
        {
          question: 'OCR trang in hỗ trợ những ngôn ngữ nào?',
          answer: 'Các mã ngôn ngữ của Tesseract, nối với nhau bằng dấu cộng cho trang có nhiều ngôn ngữ (ví dụ eng+fra). Các mã mà máy chủ cung cấp được liệt kê trong biểu mẫu; tiếng Anh được cài sẵn theo mặc định và các ngôn ngữ khác xuất hiện khi được bổ sung. Chữ viết tay được đọc bởi mô hình thị giác và không dùng các mã này.',
        },
        {
          question: 'Giới hạn cho mỗi tác vụ là gì?',
          answer: 'Theo mặc định, tối đa 50 ảnh trang mỗi tác vụ (mỗi ảnh là một trang, nên trên thực tế 50 cũng là giới hạn số trang), 25 MB mỗi ảnh, mỗi máy chủ chỉ chạy một tác vụ tại một thời điểm (các tác vụ khác chờ trong hàng đợi), và giới hạn trần 40 phút cho mỗi giai đoạn mô hình. Mỗi tác vụ tiêu tốn một tác vụ AI: 3 mỗi ngày khi không có tài khoản, 10 với tài khoản miễn phí, 100 với Premium và 200 với Pro, và lượt đó được hoàn lại khi tác vụ thất bại. Các con số hiện hành có trên trang giá.',
        },
        {
          question: 'Vì sao PDF chữ viết tay của tôi có chân trang, và tôi có thể xóa nó không?',
          answer: 'Mỗi trang viết tay đều mang một dòng nhỏ màu xám "Machine transcription, verify against original" (Bản chép bằng máy, hãy đối chiếu với bản gốc), và phần Word có một dòng tương đương in đậm, vì bản sao có thể tìm kiếm của chữ viết tay có thể bị nhầm với bản đã được xác minh. Chúng được chủ ý đưa vào đầu ra và không thể tắt. Trang in, có lớp văn bản là đầu ra Tesseract mang tính tất định, không có dấu này.',
        },
        {
          question: 'Các trang của tôi có rời khỏi máy chủ của các bạn không?',
          answer: 'Không. Tesseract chạy trên CPU, mô hình chữ viết tay và phân loại chạy qua Ollama trên GPU của chúng tôi, còn bộ máy phân tích cấu trúc và công cụ nâng độ phân giải chạy trên một GPU thứ hai trong cùng máy. Các tệp tải lên và tệp làm việc bị xóa ngay khi tác vụ hoàn tất.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Theo mặc định, thêm tối đa 50 ảnh trang mỗi tác vụ; mỗi ảnh trang có giới hạn dung lượng riêng (~25 MB).',
          'Luôn tạo ra một PDF có thể tìm kiếm; tài liệu Word có thể chỉnh sửa là tùy chọn.',
        ],
        processingNotes: [
          'Trang in dùng OCR tất định (OCRmyPDF + Tesseract) để có lớp văn bản trung thực, có thể tìm kiếm.',
          'Chữ viết tay được AI thị giác chép nguyên văn, giữ lại các dấu [illegible]/[?]: đây là bản chép bằng máy, không phải trang có giá trị chuẩn.',
          'Tài liệu Word và mọi bản tóm tắt AI đều là bản dựng lại: hãy đối chiếu chúng với bản quét gốc.',
        ],
      },
      related: [
        {
          label: 'Ảnh sang PDF',
          to: '/tools/image-to-pdf',
          description: 'Đóng các ảnh trang thành PDF không có lớp văn bản, như một tác vụ thường.',
        },
        {
          label: 'PDF sang JPG',
          to: '/tools/pdf-to-jpg',
          description: 'Kết xuất PDF có sẵn thành ảnh trang để đưa vào công cụ quét.',
        },
        {
          label: 'Phục hồi ảnh bằng AI',
          to: '/tools/ai-image-restoration',
          description: 'Sửa bản quét bị phai hoặc mờ trước khi chép lời.',
        },
        {
          label: 'Xóa siêu dữ liệu EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Gỡ thẻ vị trí và thiết bị khỏi ảnh chụp tài liệu bằng điện thoại.',
        },
        {
          label: 'Che văn bản trong ảnh',
          to: '/tools/redact-text-in-image',
          description: 'Bôi đen tên hoặc con số trên một trang trước khi bạn chia sẻ bản quét.',
        },
      ],
      embed: {
        title: 'Quét tài liệu bằng AI',
        description: 'Thêm một hoặc nhiều ảnh trang đã quét (tài liệu in hoặc ghi chú viết tay), sắp xếp lại nếu cần, chọn chế độ nội dung và đầu ra, rồi nhận PDF có thể tìm kiếm cùng tài liệu Word tùy chọn.',
      },
    },
    'ai-image-upscaler': {
      name: 'Nâng độ phân giải ảnh bằng AI',
      h1: 'Nâng độ phân giải ảnh bằng AI: Phóng to ảnh 2x hoặc 4x trực tuyến',
      tagline: 'Phóng to ảnh nhỏ hoặc bị mềm bằng mô hình Real-ESRGAN tái tạo chi tiết mịn thay vì chỉ kéo giãn điểm ảnh.',
      metaTitle: 'Nâng độ phân giải ảnh bằng AI: Phóng to ảnh 2x hoặc 4x | Media Manipulator',
      metaDescription: 'Phóng to ảnh độ phân giải thấp 2x hoặc 4x bằng AI khôi phục đường nét và kết cấu. Chạy trên GPU của chúng tôi, xuất PNG. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Nâng độ phân giải ảnh bằng AI: Phóng to ảnh 2x hoặc 4x',
      ogDescription: 'Phóng to ảnh nhỏ hoặc bị mềm bằng mô hình AI Real-ESRGAN tái tạo chi tiết thay vì kéo giãn điểm ảnh.',
      intro: 'Trang này mở bộ chuyển đổi ảnh với Nâng cấp bằng AI được khóa sẵn và đầu ra đặt là PNG. Máy chủ chạy realesrgan-ncnn-vulkan, bản dựng Vulkan của Real-ESRGAN, trên một GPU thuộc sở hữu của chúng tôi: mô hình mặc định là realesrgan-x4plus ở mức 4x, cùng realesrgan-x4plus-anime và realesr-animevideov3 dành cho tranh vẽ và khung hình hoạt hình, còn 2x là tỷ lệ thay thế. Thay vì nội suy giữa các điểm ảnh sẵn có, mạng nơ-ron dự đoán đường nét, làn da, vải vóc và tán lá trông như thế nào ở kích thước lớn hơn và vẽ thêm chi tiết đó vào. Kết quả được ghi thành PNG không mất dữ liệu, nên không có thêm nhiễu nén nào chồng lên phần chi tiết được tổng hợp.',
      whatItDoes: [
        'Phóng to ảnh lên 2x hoặc 4x chiều rộng và chiều cao bằng mô hình Real-ESRGAN chạy trên GPU của chúng tôi.',
        'Cho phép bạn chọn giữa một mô hình cho ảnh chụp và hai mô hình kiểu anime trong biểu mẫu; 4x và mô hình ảnh chụp được chọn sẵn.',
        'Luôn xuất PNG; API bắt buộc dùng phần mở rộng .png cho thao tác này.',
        'Tự động chia ảnh thành các ô trên GPU để ảnh đầu vào lớn không làm cạn bộ nhớ video.',
        'Tiêu tốn một tác vụ AI từ hạn mức tác vụ AI mỗi ngày, vốn là một bộ đếm riêng; hạn mức tác vụ thường dành cho các lượt chuyển đổi không bị ảnh hưởng.',
      ],
      flowSteps: [
        {
          title: 'Tải lên ảnh nhỏ hoặc bị mềm',
          description: 'JPG, PNG hoặc WebP. Ảnh đầu vào càng nhỏ, mô hình càng phải tự tạo ra nhiều chi tiết.',
        },
        {
          title: 'Chọn 4x hoặc 2x và một mô hình',
          description: 'realesrgan-x4plus cho ảnh chụp, các mô hình anime cho nét vẽ và khung hình hoạt hình.',
        },
        {
          title: 'Real-ESRGAN chạy trên GPU',
          description: 'realesrgan-ncnn-vulkan -i in -o out -n <model> -s <2|4> -t 0 -g <gpu> -f png',
        },
        {
          title: 'Tải PNG về',
          description: 'converted.png với kích thước điểm ảnh gấp 2x hoặc 4x bản gốc.',
        },
      ],
      advancedDetails: [
        'Lệnh gọi là UpscaleImage trong ai_tools.go. Nó khởi chạy realesrgan-ncnn-vulkan với -n cho mô hình, -s cho tỷ lệ, -t 0 cho kích thước ô tự động, -g cho chỉ số GPU và -f png; Vulkan ICD được cố định bằng biến môi trường để trình nạp luôn tìm thấy driver NVIDIA.',
        'Chỉ chấp nhận tỷ lệ 2 và 4 cùng ba tên mô hình realesrgan-x4plus, realesrgan-x4plus-anime và realesr-animevideov3; mọi giá trị khác đều bị từ chối trước khi tác vụ bắt đầu.',
        '2x chạy cùng mạng x4 ở nửa tỷ lệ. Biểu mẫu có ghi chú rằng 2x có thể trông hơi bị cắt hoặc phóng to trên một số ảnh, điều đã được quan sát trên máy chủ với một ảnh 640 x 360; API cố ý không che giấu điều này bằng cách chạy 4x rồi thu nhỏ lại.',
        'Vì nhánh AI bỏ qua ImageMagick và bước sao chép bằng exiftool, các thiết lập chất lượng, đổi kích thước, bộ lọc và siêu dữ liệu trong biểu mẫu không có tác dụng ở đây, và tệp PNG không mang EXIF từ ảnh gốc.',
        'Số điểm ảnh tăng theo bình phương của tỷ lệ: 4x nghĩa là gấp 16 lần số điểm ảnh và 2x nghĩa là gấp 4 lần. Dữ liệu RGB chưa nén của đầu ra là chiều rộng x chiều cao x 3 byte, đây là giới hạn trên cho dung lượng tệp PNG.',
        'Không có giới hạn phía máy chủ nào về kích thước ảnh đầu vào dành riêng cho thao tác này ngoài giới hạn dung lượng mỗi tệp của gói bạn dùng; ảnh đầu vào rất lớn chỉ đơn giản là mất nhiều thời gian hơn, từng ô một.',
      ],
      whyItMatters: [
        'Ảnh kỹ thuật số cũ, tệp tải về độ phân giải thấp và ảnh web nhỏ thường cần được in hoặc hiển thị lớn hơn nhiều so với khi chụp.',
        'Nội suy thông thường tạo ra ảnh lớn hơn, chứ không sắc nét hơn; mô hình siêu phân giải tạo nên khác biệt giữa ảnh mờ và ảnh dùng được.',
        'Bắt đầu từ một tệp PNG không mất dữ liệu giúp bạn thoải mái nén hoặc đổi kích thước kết quả sau đó mà không bị nhiễu chồng chất.',
      ],
      useCases: [
        {
          title: 'In ảnh cũ',
          description: 'Đưa một bức ảnh 1 megapixel từ máy ảnh đời đầu lên kích thước in đẹp.',
        },
        {
          title: 'Cứu ảnh tải về cỡ nhỏ',
          description: 'Phóng to ảnh sản phẩm hoặc ảnh tham khảo 400 px thành ảnh dùng được.',
        },
        {
          title: 'Anime và minh họa',
          description: 'Phóng to nét vẽ bằng realesrgan-x4plus-anime mà không bị nhòe đường viền.',
        },
        {
          title: 'Khung hình game và video',
          description: 'Dùng realesr-animevideov3 cho các khung hình hoạt hình đã chụp lại.',
        },
      ],
      workedExamples: [
        {
          title: 'Ảnh JPEG 640 x 360 ở 4x với realesrgan-x4plus',
          body: 'Đầu vào: ảnh thu nhỏ JPEG phong cảnh 92 KB, 640 x 360. Thiết lập giữ nguyên như cài sẵn: 4x, mô hình ảnh chụp, đầu ra PNG. Máy chủ chạy realesrgan-ncnn-vulkan -n realesrgan-x4plus -s 4 -t 0 -f png và ghi ra converted.png ở 2560 x 1440 điểm ảnh, gấp 16 lần so với 230.400 điểm ảnh ban đầu. Đầu ra chưa nén là 2560 x 1440 x 3 = 11 MB dữ liệu RGB, và tệp PNG sẽ nhỏ hơn mức đó tùy theo lượng bầu trời và mảng màu phẳng trong ảnh, nên hãy chờ đợi vài megabyte từ một đầu vào 92 KB. Lượt xử lý GPU trên các ô được chọn tự động chỉ mất vài giây với đầu ra cỡ này; việc mã hóa PNG và tải về một tệp nhiều megabyte chiếm một phần đáng kể trong tổng thời gian.',
        },
        {
          title: 'Ảnh 1200 x 800 ở 2x',
          body: 'Đầu vào: ảnh JPEG chụp một người, 480 KB, 1200 x 800. Chọn 2x và giữ mô hình ảnh chụp. Đầu ra là ảnh PNG 2400 x 1600, 3,84 megapixel, gấp bốn lần mức 0,96 ban đầu. Khi chưa nén, đó là 11,5 MB dữ liệu RGB, và tệp PNG sẽ chỉ bằng một phần trong số đó. Vì 2x chạy mạng x4 ở nửa tỷ lệ, hãy kiểm tra các cạnh xem có bị cắt hoặc phóng to nhẹ như biểu mẫu cảnh báo không; nếu có, hãy chạy 4x rồi dùng công cụ đổi kích thước ảnh để thu kết quả 4800 x 3200 về 2400 x 1600, việc này tốn thêm một tác vụ.',
        },
      ],
      whenNotToUse: 'Đừng nâng độ phân giải ảnh vốn đã lớn và sắc nét: một bức ảnh 12 megapixel ở 4x sẽ thành ảnh PNG 192 megapixel, tạo ra rất chậm, nặng hàng trăm megabyte khi chưa nén và không có cải thiện nào nhìn thấy được. Đừng dựa vào công cụ này cho khuôn mặt, chữ, logo hay bất cứ thứ gì cần giữ đúng bản gốc, vì chi tiết thêm vào là được dự đoán chứ không phải được khôi phục, và chữ nhỏ có thể thành những ký tự trông hợp lý nhưng sai. Nhòe do chuyển động mạnh và ảnh lệch nét không được khắc phục bằng độ phân giải. Nếu bạn chỉ cần một kích thước điểm ảnh cụ thể từ một ảnh gốc lớn hơn, công cụ đổi kích thước thông thường nhanh hơn và rẻ hơn.',
      whyMediaManipulator: [
        'Tệp thực thi, mô hình và cờ lệnh thật đều được nêu tên ở đây, nên bạn biết đây là Real-ESRGAN với chia ô tự động chứ không phải một chức năng "tăng cường" chung chung.',
        'Lưu ý về 2x được nói rõ thay vì giấu đi, và thao tác được khóa sẵn nên không có menu nào phải lục tìm.',
        'Chạy trên phần cứng của chúng tôi; công cụ tiêu chuẩn không cần tài khoản. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Ảnh của bạn được lưu trong uploads/<jobId>/ trên máy chủ của chúng tôi và được tệp thực thi realesrgan-ncnn-vulkan đọc trực tiếp trên một GPU ngay trong cùng máy; tệp PNG được tạo ra nằm ở outputs/<jobId>/converted.png. Không có nhà cung cấp AI bên ngoài nào tham gia và ảnh của bạn không được dùng để huấn luyện bất cứ thứ gì. Như với mọi ảnh được tải lên, một bước phân tích tự động trên máy chủ của chúng tôi chạy một mô hình thị giác cục bộ trên tệp một lần và lưu bản tóm tắt của nó cùng tác vụ. Kết quả không có EXIF từ ảnh gốc, vì các thao tác AI bỏ qua bước sao chép siêu dữ liệu. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Công cụ nâng độ phân giải ảnh bằng AI có miễn phí không?',
          answer: 'Có, trong phạm vi hạn mức tác vụ AI mỗi ngày. Mỗi lần nâng độ phân giải tiêu tốn một tác vụ AI: mặc định 3 lần mỗi ngày với khách và 10 lần với tài khoản miễn phí, với giới hạn mỗi tệp là 200 MB và 1 GB; 100 và 200 với Premium và Pro. Hạn mức đó tách biệt với hạn mức tác vụ thường, nên các lượt chuyển đổi của bạn không bị ảnh hưởng. Các con số hiện hành có trên /pricing.',
        },
        {
          question: 'Công cụ này khác gì công cụ đổi kích thước ảnh?',
          answer: 'Công cụ đổi kích thước chạy ImageMagick, vốn nội suy các điểm ảnh sẵn có và tạo ra ảnh lớn hơn nhưng mềm hơn. Công cụ này chạy một mạng Real-ESRGAN đã được huấn luyện để tổng hợp đường nét và kết cấu ở kích thước lớn hơn. Đó là suy luận, không phải dữ liệu được khôi phục.',
        },
        {
          question: 'Tôi nên chọn 2x hay 4x?',
          answer: '4x là mặc định và cho đầu ra ổn định nhất. 2x chạy cùng mạng ở nửa tỷ lệ và có thể trông hơi bị cắt trên một số ảnh, nên nếu 4x lớn hơn mức bạn cần, hãy cân nhắc chạy 4x rồi thu nhỏ lại.',
        },
        {
          question: 'Mô hình nào phù hợp với tranh vẽ?',
          answer: 'realesrgan-x4plus-anime cho tranh minh họa và hình màu phẳng; realesr-animevideov3 cho khung hình lấy từ phim hoạt hình. Mô hình ảnh chụp thêm kết cấu giống da, trông không hợp trên nét vẽ.',
        },
        {
          question: 'Tại sao đầu ra là PNG và lại lớn như vậy?',
          answer: 'PNG là bắt buộc để chi tiết được tổng hợp không bị nén JPEG làm hỏng ngay. Kết quả 4x có số điểm ảnh gấp 16 lần, nên tệp rất lớn; hãy nén sang JPG hoặc WebP sau đó để chia sẻ.',
        },
        {
          question: 'Công cụ có sửa được ảnh bị mờ hoặc lệch nét không?',
          answer: 'Công cụ giúp cải thiện độ mềm do độ phân giải thấp. Nó không thể khắc phục nhòe do chuyển động hay ảnh lệch nét, và có thể làm mịn hoặc thay đổi khuôn mặt và chữ nhỏ. Hãy so sánh kết quả với ảnh gốc trước khi sử dụng.',
        },
        {
          question: 'Ảnh của tôi có được gửi đến dịch vụ AI bên thứ ba không?',
          answer: 'Không. Real-ESRGAN chạy trên máy chủ GPU do chúng tôi vận hành, và tác vụ không bao giờ gọi API bên ngoài.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Đầu ra là PNG. Giới hạn dung lượng và hạn mức tác vụ AI mỗi ngày tùy thuộc vào gói của bạn và được hiển thị trong biểu mẫu, không cố định trên trang này.',
        ],
      },
      related: [
        {
          label: 'Phục hồi ảnh bằng AI',
          to: '/tools/ai-image-restoration',
          description: 'Làm sạch nhiễu nén và nhiễu hạt trước hoặc sau khi phóng to.',
        },
        {
          label: 'Đổi kích thước ảnh',
          to: '/tools/image-resizer',
          description: 'Đưa kết quả 4x về đúng kích thước bạn cần.',
        },
        {
          label: 'Nén ảnh',
          to: '/tools/compress-image',
          description: 'Biến tệp PNG lớn thành JPG hoặc WebP dễ chia sẻ.',
        },
        {
          label: 'Xóa nền ảnh',
          to: '/tools/remove-background-from-image',
          description: 'Cắt chủ thể đã phóng to ra nền trong suốt.',
        },
        {
          label: 'Phục hồi video bằng AI',
          to: '/tools/ai-video-restoration',
          description: 'Công cụ tương đương cho khung hình video.',
        },
      ],
      embed: {
        title: 'Nâng độ phân giải ảnh bằng AI',
        description: 'Tải lên một bức ảnh. Nâng cấp bằng AI đã được chọn và khóa sẵn, với đầu ra đặt là PNG. Chọn 2x hoặc 4x và một mô hình (ảnh chụp hoặc anime), rồi chuyển đổi.',
      },
    },
    'blur-faces-in-photo': {
      name: 'Làm mờ khuôn mặt trong ảnh',
      h1: 'Làm mờ khuôn mặt trong ảnh trực tuyến',
      tagline: 'Tự động phát hiện khuôn mặt, rồi làm mờ, pixel hóa hoặc che đen toàn bộ hoặc chỉ những khuôn mặt bạn chọn.',
      metaTitle: 'Làm mờ khuôn mặt trong ảnh trực tuyến | Media Manipulator',
      metaDescription: 'Làm mờ, pixel hóa hoặc che đen khuôn mặt trong ảnh. Phát hiện mọi khuôn mặt rồi chọn khuôn mặt cần ẩn. AI chạy trên GPU của chúng tôi. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Làm mờ khuôn mặt trong ảnh trực tuyến',
      ogDescription: 'Tự động tìm khuôn mặt trong ảnh rồi làm mờ, pixel hóa hoặc che đen toàn bộ hoặc chỉ những khuôn mặt bạn chọn.',
      intro: 'Đăng một bức ảnh đám đông, lớp học hay đường phố thường đồng nghĩa với việc phải ẩn những người chưa từng đồng ý xuất hiện trong đó. Trang này tìm khuôn mặt bằng bộ phát hiện YuNet chạy trong OpenCV trên máy chủ của chính chúng tôi và che từng khuôn mặt bằng hiệu ứng làm mờ Gaussian, khảm điểm ảnh hoặc hình chữ nhật đen đặc. Bạn có thể che mọi khuôn mặt được phát hiện chỉ trong một bước, hoặc chạy phát hiện trước, xem các khung được vẽ trên ảnh, rồi chỉ chọn những khuôn mặt cần ẩn hoặc chỉ những khuôn mặt cần giữ. Bộ phát hiện, ngưỡng tin cậy và kích thước chính xác của từng hiệu ứng được mô tả bên dưới để bạn biết kết quả sẽ bảo vệ được gì và không bảo vệ được gì.',
      whatItDoes: [
        'Phát hiện khuôn mặt bằng OpenCV FaceDetectorYN và mô hình YuNet 2023 ở ngưỡng tin cậy 0,85, rồi nới rộng mỗi khung thêm 18 phần trăm về mọi phía để che cả tóc và đường viền hàm.',
        'Ẩn từng khuôn mặt được chọn bằng hiệu ứng làm mờ Gaussian có kernel bằng một phần ba kích thước khung, hiệu ứng khảm 14 ô theo chiều ngang khung, hoặc tô đen.',
        'Có ba chế độ chọn: mọi khuôn mặt được phát hiện, chỉ những khuôn mặt bạn đánh dấu, hoặc tất cả trừ những khuôn mặt bạn đánh dấu.',
        'Lưu kết quả phát hiện trong một phiên 30 phút gắn với mã SHA-256 của tệp, để các khung được áp dụng đúng là các khung bạn đã thấy.',
        'Ghi ra một tệp JPG, PNG hoặc WebP mới có cùng kích thước điểm ảnh; tệp gốc tải lên không bị thay đổi.',
      ],
      flowSteps: [
        {
          title: 'Tải ảnh lên',
          description: 'JPG, PNG hoặc WebP. Thao tác Làm mờ / Pixel hóa khuôn mặt được chọn sẵn và khóa trên trang này.',
        },
        {
          title: 'Chọn làm mờ, pixel hóa hoặc hộp đen',
          description: 'Làm mờ được đặt sẵn; hộp đen xóa hoàn toàn các điểm ảnh.',
        },
        {
          title: 'Phát hiện và chọn (tùy chọn)',
          description: 'Nhấn Phát hiện khuôn mặt để xem các khung được đánh số, rồi đánh dấu những khung cần ẩn hoặc cần giữ.',
        },
        {
          title: 'Chạy tác vụ',
          description: 'Máy chủ áp dụng hiệu ứng bên trong từng khung được chọn và lưu thành ảnh mới.',
        },
        {
          title: 'Kiểm tra và tải xuống',
          description: 'Phóng to đủ kích thước và tìm những khuôn mặt bị bỏ sót trước khi đăng.',
        },
      ],
      advancedDetails: [
        'Việc phát hiện chạy face_privacy.py với OpenCV FaceDetectorYN trên face_detection_yunet_2023mar.onnx ở độ phân giải đầy đủ của ảnh, ngưỡng điểm 0,85, ngưỡng NMS 0,3 và tối đa 5000 ứng viên. Các khung được nới thêm 0,18 chiều rộng và chiều cao của chúng ở mỗi phía và được giới hạn trong phạm vi ảnh.',
        'Làm mờ dùng cv2.GaussianBlur với kernel lẻ có kích thước max(3, cạnh dài nhất của khung / 3) điểm ảnh, nên một khuôn mặt 300 px nhận kernel 101 px; khuôn mặt càng lớn, độ mờ càng mạnh. Pixel hóa thu nhỏ khung về 14 ô theo chiều ngang bằng lọc tuyến tính rồi phóng to trở lại bằng nội suy láng giềng gần nhất, tạo ra các ô vuông thấy rõ. Hộp đen ghi (0, 0, 0) vào vùng đó.',
        'Khi bạn phát hiện trước, máy chủ tính SHA-256 của tệp tải lên, lưu các khung đã chuẩn hóa trong một phiên hết hạn sau 30 phút, và từ chối áp dụng phiên có mã băm không khớp với tệp bạn gửi sau đó, nên không thể ghép các khung sang một bức ảnh khác.',
        'Khi không có phiên phát hiện, script phát hiện lại lúc chạy và che mọi khuôn mặt tìm thấy; kết quả giống hệt việc chạy Phát hiện khuôn mặt và để chế độ ở tất cả.',
        'Kết quả được OpenCV ghi ra, và bước sao chép ngược bằng exiftool của bộ chuyển đổi không chạy với kết quả AI, nên kết quả không mang thẻ EXIF, GPS hay máy ảnh nào của bản gốc. Tuy vậy, đây vẫn không thay thế được công cụ EXIF, nơi bạn xem và chọn những gì bị xóa.',
        'Hiệu ứng làm mờ nhẹ trên một khuôn mặt lớn, sắc nét có thể bị đảo ngược một phần bằng các công cụ giải chập (deconvolution); hộp đen là lựa chọn duy nhất hủy hoàn toàn thông tin, còn hiệu ứng khảm thô nằm ở giữa.',
      ],
      whyItMatters: [
        'Ảnh chụp người khác, nhất là trẻ em, kéo theo yêu cầu về sự đồng ý và đôi khi cả nghĩa vụ pháp lý mà một dòng chú thích không giải quyết được.',
        'Chỉnh tay một bức ảnh có 20 khuôn mặt vừa chậm vừa không đồng đều; bộ phát hiện tìm ra cả những khuôn mặt nhỏ ở hàng sau.',
        'Phát hiện rồi chọn giúp bạn giữ nhóm của mình hiển thị rõ trong khi ẩn danh những người qua đường.',
      ],
      useCases: [
        {
          title: 'Ảnh sự kiện và đám đông',
          description: 'Ẩn người qua đường trước khi đăng ảnh từ một sự kiện công cộng.',
        },
        {
          title: 'Bài đăng của trường học và câu lạc bộ',
          description: 'Che những em nhỏ cụ thể mà gia đình chưa đồng ý.',
        },
        {
          title: 'Báo chí và đưa tin',
          description: 'Bảo vệ nguồn tin hoặc người tham gia trong một khung hình phóng sự.',
        },
        {
          title: 'Ảnh chụp màn hình cuộc gọi video',
          description: 'Ẩn danh đồng nghiệp trong ảnh chụp cuộc họp trước khi chia sẻ ra ngoài nhóm.',
        },
      ],
      workedExamples: [
        {
          title: 'Ảnh nhóm 4000 x 3000 có 14 khuôn mặt, tất cả đều được làm mờ',
          body: 'Đầu vào: một tệp JPEG 3,5 MB kích thước 4000 x 3000 điểm ảnh chụp bằng điện thoại, có 14 người. Cài đặt: làm mờ, chế độ chọn tất cả, không phát hiện trước. Script chạy YuNet trên toàn bộ khung hình 12 megapixel; một khuôn mặt có khung 300 x 360 điểm ảnh được nới thêm 18 phần trăm thành khoảng 408 x 490 và được làm mờ bằng kernel Gaussian 163 px (490 / 3, làm tròn thành số lẻ), biến nó thành một mảng không còn đường nét. Một khuôn mặt 60 px ở hàng sau nhận kernel 27 px, đủ để xóa đường nét ở kích thước đó. Kết quả là một tệp JPG 4000 x 3000 do OpenCV ghi ra, thường chỉ chênh lệch vài trăm kilobyte so với kích thước gốc. Phát hiện và làm mờ mất vài giây; việc tải lên 3,5 MB thường lâu hơn.',
        },
        {
          title: 'Ảnh chụp màn hình cuộc gọi video 1920 x 1080, pixel hóa hai trong sáu khuôn mặt',
          body: 'Đầu vào: một ảnh chụp màn hình PNG 1,1 MB kích thước 1920 x 1080 có sáu người tham gia. Cài đặt: Phát hiện khuôn mặt trước, chế độ chọn chỉ khuôn mặt đã chọn, đánh dấu hai khuôn mặt, pixel hóa. Bước phát hiện trả về sáu khung và lưu chúng trong một phiên 30 phút gắn với mã băm của tệp. Khi gửi, máy chủ xác minh mã băm, chuyển mã của hai khung được chọn cho script, và mỗi khung được chọn, khoảng 140 x 180 điểm ảnh sau khi nới, được thu về 14 ô theo chiều ngang nên mỗi ô khoảng 10 x 13 điểm ảnh, rồi ghi trở lại thành những ô vuông sắc cạnh. Bốn khuôn mặt còn lại không bị động đến. Kết quả là một tệp PNG 1920 x 1080, và tác vụ chạy trong vài giây vì không cần phát hiện lại.',
        },
      ],
      whenNotToUse: 'Đừng dựa vào công cụ này cho bất cứ việc gì mà chỉ một khuôn mặt bị bỏ sót cũng là không chấp nhận được, chẳng hạn việc che thông tin theo yêu cầu pháp lý; YuNet ở ngưỡng 0,85 bỏ qua những khuôn mặt rất nhỏ, quay đi chỗ khác, đeo khẩu trang hoặc nằm trong bóng tối sâu, và bạn phải tự kiểm tra kết quả. Đừng dùng hiệu ứng làm mờ nhẹ trên khuôn mặt lớn nếu người đó phải hoàn toàn không thể nhận dạng; hãy dùng hộp đen. Thẻ tên, biển số xe và màn hình không phải là khuôn mặt, nên công cụ che văn bản hoặc công cụ xóa vật thể mới là lựa chọn phù hợp cho chúng. Và nếu mục tiêu của bạn là xóa hẳn một người khỏi khung cảnh thay vì chỉ ẩn khuôn mặt, công cụ xóa vật thể sẽ làm việc đó.',
      whyMediaManipulator: [
        'Bộ phát hiện, ngưỡng, phần nới khung và cách tính kernel đều được nêu rõ, để bạn đánh giá được mỗi kiểu che bảo vệ đến đâu.',
        'Các khung phát hiện được gắn với mã băm của tệp và hết hạn sau 30 phút, nên bạn chọn trên đúng bức ảnh sẽ được xử lý.',
        'Làm mờ khuôn mặt dùng một tác vụ AI từ hạn mức tác vụ AI hằng ngày (mặc định 3 mỗi ngày khi không có tài khoản, 10 với tài khoản miễn phí), tách biệt với hạn mức tác vụ thường, còn bản xem trước Phát hiện khuôn mặt hoàn toàn không bị tính. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Việc phát hiện và làm mờ khuôn mặt chạy dưới dạng một tiến trình OpenCV cục bộ trên phần cứng của chính chúng tôi; không dịch vụ AI bên ngoài nào nhận ảnh của bạn, và không có gì được dùng để huấn luyện. Bản xem trước Phát hiện khuôn mặt lưu một bản sao tạm thời, tính mã băm, phát hiện, rồi xóa bản sao trước khi phản hồi; chỉ tọa độ các khung được giữ lại, trong 30 phút. Ảnh tải lên nằm trong uploads/<jobId>/ và kết quả trong outputs/<jobId>/, cả hai đều được ghi vào sổ thời gian lưu và bị xóa khi hết thời hạn. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Như mọi ảnh tải lên thông thường, ảnh cũng đi qua bước phân tích nội dung tự động của chúng tôi trên cùng máy chủ, nơi một mô hình thị giác cục bộ viết một đoạn mô tả ngắn được giữ cùng tác vụ và không chia sẻ với bên thứ ba.',
      faq: [
        {
          question: 'Bộ phát hiện sẽ bỏ sót những khuôn mặt nào?',
          answer: 'YuNet chạy ở ngưỡng tin cậy 0,85, nên nó bỏ qua các ứng viên có độ tin cậy thấp: khuôn mặt rất nhỏ, khuôn mặt nghiêng quay đi khỏi máy ảnh, khuôn mặt bị khẩu trang hoặc tay che, và khuôn mặt trong bóng tối sâu. Hãy kiểm tra kết quả ở kích thước đầy đủ trước khi chia sẻ.',
        },
        {
          question: 'Làm sao để chỉ làm mờ một số khuôn mặt?',
          answer: 'Nhấn Phát hiện khuôn mặt, đánh dấu các khung được đánh số, rồi đặt chế độ chọn thành chỉ khuôn mặt đã chọn hoặc tất cả trừ khuôn mặt đã chọn. Các khung được lưu 30 phút theo mã băm của tệp, nên hãy phát hiện lại nếu bạn đổi ảnh.',
        },
        {
          question: 'Độ mờ mạnh đến đâu, và có thể bị đảo ngược không?',
          answer: 'Kernel Gaussian bằng một phần ba kích thước khung, nên một khuôn mặt 300 px nhận kernel 101 px. Độ mờ mạnh khó đảo ngược, nhưng một kẻ tấn công quyết tâm có trong tay khuôn mặt lớn, sắc nét vẫn có cơ hội; hộp đen xóa các điểm ảnh và không thể hoàn tác.',
        },
        {
          question: 'Kết quả có giữ dữ liệu EXIF và GPS của ảnh không?',
          answer: 'Không. Kết quả được OpenCV ghi mới hoàn toàn và bước sao chép ngược siêu dữ liệu bị bỏ qua với kết quả AI, nên thẻ máy ảnh và vị trí không được chuyển sang. Hãy dùng công cụ EXIF nếu bạn muốn kiểm tra hoặc xóa thẻ có chọn lọc.',
        },
        {
          question: 'Ảnh của tôi có bị gửi đến một công ty AI bên ngoài không?',
          answer: 'Không. Việc phát hiện và hiệu ứng chạy trong một tiến trình OpenCV cục bộ trên máy chủ của chính chúng tôi, và tệp không được chia sẻ với nhà cung cấp AI bên thứ ba.',
        },
        {
          question: 'Làm mờ khuôn mặt có dùng hạn mức tác vụ AI hằng ngày của tôi không?',
          answer: 'Có. Mỗi ảnh được làm mờ là một tác vụ AI: mặc định 3 mỗi ngày với khách, 10 với tài khoản miễn phí. Nó không bao giờ dùng đến hạn mức tác vụ thường. Bản xem trước Phát hiện khuôn mặt có giới hạn tần suất nhưng không bị tính. Tác vụ thất bại được hoàn lại.',
        },
        {
          question: 'Còn biển số xe, thẻ tên hay chữ trên màn hình thì sao?',
          answer: 'Đó không phải là khuôn mặt và không được phát hiện ở đây. Hãy dùng công cụ che văn bản cho mọi thứ đọc được, hoặc công cụ xóa vật thể để xóa biển số hay biển hiệu khỏi ảnh.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Mỗi lần chạy dùng một tác vụ AI từ hạn mức tác vụ AI hằng ngày của bạn; giới hạn kích thước mỗi tệp của gói bạn được hiển thị trong biểu mẫu.',
        ],
      },
      related: [
        {
          label: 'Che văn bản trong ảnh',
          to: '/tools/redact-text-in-image',
          description: 'Ẩn email, số điện thoại và các văn bản đọc được khác.',
        },
        {
          label: 'Xóa vật thể khỏi ảnh',
          to: '/tools/remove-object-from-photo',
          description: 'Xóa hẳn một người, biển số hoặc biển hiệu.',
        },
        {
          label: 'Xóa siêu dữ liệu EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Loại bỏ dữ liệu GPS và máy ảnh khỏi cùng bức ảnh.',
        },
        {
          label: 'Nén ảnh',
          to: '/tools/compress-image',
          description: 'Thu nhỏ ảnh đã ẩn danh trước khi đăng.',
        },
        {
          label: 'Đổi kích thước ảnh',
          to: '/tools/image-resizer',
          description: 'Chỉnh kết quả về kích thước mà nền tảng yêu cầu.',
        },
      ],
      embed: {
        title: 'Làm mờ khuôn mặt trong ảnh',
        description: 'Tải ảnh lên. Thao tác Làm mờ / Pixel hóa khuôn mặt đã được chọn và khóa sẵn. Chọn kiểu che, tùy chọn phát hiện khuôn mặt và chọn khuôn mặt cần ẩn, rồi chuyển đổi.',
      },
    },
    'redact-text-in-image': {
      name: 'Che văn bản trong ảnh',
      h1: 'Che văn bản và dữ liệu cá nhân trong ảnh',
      tagline: 'Tìm văn bản đọc được trong ảnh chụp màn hình hoặc ảnh và che thông tin cá nhân, hoặc toàn bộ văn bản, bằng hiệu ứng làm mờ hoặc ô đen.',
      metaTitle: 'Che văn bản trong ảnh trực tuyến | Media Manipulator',
      metaDescription: 'Tự động tìm văn bản trong ảnh và che đen hoặc làm mờ tên, email, số và dữ liệu cá nhân khác. AI chạy trên GPU của chúng tôi. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Che văn bản và dữ liệu cá nhân trong ảnh',
      ogDescription: 'Tìm văn bản trong ảnh chụp màn hình và ảnh, rồi che dữ liệu cá nhân hoặc toàn bộ văn bản bằng hiệu ứng làm mờ hoặc hộp đen.',
      intro: 'Ảnh chụp màn hình làm lộ những thứ mà chủ nhân đã quen mắt đến mức không còn để ý: một địa chỉ email ở phần đầu trang, một số tài khoản trong bảng, một số điện thoại trong bong bóng chat. Trang này đọc mọi đoạn văn bản trong ảnh bằng EasyOCR trên máy chủ của chính chúng tôi và che các kết quả khớp bằng hình chữ nhật đen, hiệu ứng làm mờ hoặc khảm điểm ảnh. Ở chế độ mặc định, công cụ chỉ che văn bản khớp với các mẫu dữ liệu cá nhân: địa chỉ email, số điện thoại, số kiểu số an sinh xã hội, chuỗi chữ số dài giống số thẻ và địa chỉ đường phố. Ở chế độ tất cả văn bản, công cụ che mọi từ đọc được, đây là lựa chọn an toàn hơn khi bạn không thể đoán trước trên trang có gì.',
      whatItDoes: [
        'Chạy EasyOCR trên toàn bộ ảnh để tìm các khung văn bản và nội dung bên trong, dùng GPU của máy chủ chúng tôi.',
        'Ở chế độ thông tin cá nhân, che những khung có văn bản khớp với một trong năm mẫu: email, số điện thoại, mã định danh dạng 3-2-4 chữ số, chuỗi 13 đến 19 chữ số giống số thẻ, hoặc địa chỉ đường phố kết thúc bằng Street, Avenue, Road, Drive, Lane, Boulevard, Way, Court, Circle hoặc Place.',
        'Ở chế độ tất cả văn bản, che mọi khung văn bản nhận dạng được bất kể nội dung.',
        'Nới mỗi khung thêm 8 phần trăm cạnh dài hơn của nó (ít nhất 3 điểm ảnh) rồi tô đen, làm mờ bằng kernel bằng một phần ba kích thước khung, hoặc pixel hóa thành 12 ô.',
        'Ghi ra một tệp JPG, PNG hoặc WebP mới cùng kích thước và báo số vùng đã được che.',
      ],
      flowSteps: [
        {
          title: 'Tải ảnh lên',
          description: 'Ảnh chụp màn hình, biểu mẫu đã quét hoặc ảnh chụp có văn bản đọc được, ở dạng JPG, PNG hoặc WebP.',
        },
        {
          title: 'Chọn chỉ thông tin cá nhân hoặc tất cả văn bản',
          description: 'Thao tác Che văn bản / thông tin cá nhân được chọn sẵn và khóa trên trang này; Chỉ thông tin cá nhân là chế độ phát hiện mặc định.',
        },
        {
          title: 'Chọn hộp đen, làm mờ hoặc pixel hóa',
          description: 'Hộp đen là mặc định và là kiểu duy nhất không thể đảo ngược.',
        },
        {
          title: 'Chạy OCR và che',
          description: 'EasyOCR đọc ảnh, mỗi khung khớp được nới rộng và che lại, rồi kết quả được lưu.',
        },
        {
          title: 'Đọc kỹ và tải xuống',
          description: 'Kiểm tra những văn bản mà OCR không đọc được, nhất là chữ nhỏ, bị xoay hoặc viết tay.',
        },
      ],
      advancedDetails: [
        'Máy chủ chạy redact_text_pii.py với --detect pii hoặc all-text, --redaction blackbox, blur hoặc pixelate và --gpu. Script tạo một EasyOCR Reader cho tiếng Anh (ngôn ngữ duy nhất được truyền vào hiện nay) và gọi readtext trên tệp, hàm này trả về một khung, văn bản và độ tin cậy cho từng dòng.',
        'Các mẫu thông tin cá nhân là biểu thức chính quy: email (phần cục bộ, @, tên miền có dấu chấm và TLD từ 2 chữ cái trở lên); số điện thoại Bắc Mỹ gồm 10 chữ số, có thể kèm +1, dấu ngoặc, dấu chấm, khoảng trắng hoặc gạch ngang; ba, hai và bốn chữ số ngăn cách bằng gạch ngang hoặc khoảng trắng; 13 đến 19 chữ số, có thể ngăn cách bằng khoảng trắng hoặc gạch ngang (số thẻ); và số nhà theo sau là tên đường và một từ chỉ loại đường. Không có mẫu nào cho tên người, ngày sinh hay mã định danh ngoài Hoa Kỳ.',
        'Mỗi khung khớp được nới thêm max(3, 0,08 x cạnh lớn hơn giữa chiều rộng và chiều cao) điểm ảnh về mọi phía và được giới hạn trong phạm vi ảnh. Hộp đen dùng cv2.rectangle với phần bên trong tô đen; pixel hóa thu vùng về 12 ô theo chiều ngang rồi phóng to lại bằng nội suy láng giềng gần nhất; làm mờ dùng kernel Gaussian max(11, cạnh dài nhất / 3), làm thành số lẻ.',
        'OCR đọc tốt nhất chữ in nằm ngang, rõ ràng. Chữ viết tay, phông chữ trang trí, chữ rất nhỏ, độ nghiêng lớn và độ tương phản thấp làm giảm độ tin cậy và có thể khiến văn bản bị bỏ sót hoàn toàn. Chế độ tất cả văn bản không khắc phục được một dòng mà OCR chưa từng thấy.',
        'Kết quả được OpenCV ghi ra và bước sao chép ngược bằng exiftool của bộ chuyển đổi bị bỏ qua với kết quả AI, nên các thẻ EXIF, GPS và máy ảnh gốc không được chuyển sang kết quả; công cụ này dành cho điểm ảnh, không phải siêu dữ liệu.',
        'Script in ra redactions=N khi hoàn tất; kết quả bằng không nghĩa là OCR không tìm thấy văn bản khớp, không phải ảnh đã sạch.',
      ],
      whyItMatters: [
        'Phiếu hỗ trợ, báo cáo lỗi và bài đăng mạng xã hội thường xuyên kèm ảnh chụp màn hình chứa dữ liệu thật của khách hàng hoặc tài khoản.',
        'Che chữ bằng tay với công cụ vẽ dễ sót dòng và để lại kết quả không đều; tìm kiếm theo mẫu sẽ tìm ra cả địa chỉ email thứ ba mà bạn đã không còn để ý.',
        'Hình chữ nhật đặc là kiểu che duy nhất vẫn giữ được sau khi làm nét, kéo giãn độ tương phản và phóng to.',
      ],
      useCases: [
        {
          title: 'Báo cáo lỗi và hỗ trợ',
          description: 'Chia sẻ ảnh chụp màn hình mà không để lộ email, số điện thoại hay chữ số thẻ.',
        },
        {
          title: 'Biểu mẫu đã quét',
          description: 'Ẩn mã định danh và địa chỉ trên một trang trước khi chuyển tiếp.',
        },
        {
          title: 'Ảnh chụp màn hình chat',
          description: 'Xóa số điện thoại và email khỏi cuộc trò chuyện trước khi đăng.',
        },
        {
          title: 'Tài liệu đào tạo',
          description: 'Biến một ảnh chụp màn hình thật thành ví dụ an toàn với mọi văn bản đã được che.',
        },
      ],
      workedExamples: [
        {
          title: 'Ảnh chụp màn hình phiếu hỗ trợ 1440 x 900 ở chế độ thông tin cá nhân',
          body: 'Đầu vào: một tệp PNG 400 KB kích thước 1440 x 900 hiển thị hồ sơ khách hàng với hai địa chỉ email, một số điện thoại viết dạng (555) 123-4567 và tên khách hàng. Cài đặt: Chỉ thông tin cá nhân, hộp đen. EasyOCR trả về khoảng 40 dòng văn bản; ba dòng khớp với mẫu email và số điện thoại, còn cái tên không khớp mẫu nào. Mỗi khung trong ba khung, chẳng hạn 260 x 22 điểm ảnh với một địa chỉ email, được nới thêm 8 phần trăm của 260, khoảng 21 điểm ảnh, về mọi phía và tô đen, tạo thành hình chữ nhật 302 x 64. Cái tên vẫn hiển thị, vì không có mẫu cho tên; hãy chuyển sang tất cả văn bản nếu nó cũng cần bị che. Kết quả là một tệp PNG 1440 x 900, và tác vụ mất vài giây, phần lớn là để tải mô hình OCR và đọc trang.',
        },
        {
          title: 'Ảnh điện thoại 3024 x 4032 chụp một biểu mẫu đã điền, chế độ tất cả văn bản kèm làm mờ',
          body: 'Đầu vào: một ảnh JPEG 2,1 MB chụp biểu mẫu in, 3024 x 4032 điểm ảnh, hơi nghiêng. Cài đặt: tất cả văn bản, làm mờ. Mọi dòng EasyOCR đọc được đều bị che: một giá trị trường được gõ máy kích thước 600 x 40 điểm ảnh được nới thêm 48 điểm ảnh mỗi phía và làm mờ bằng kernel 201 px (600 / 3, làm thành số lẻ), xóa hoàn toàn chữ ở tỷ lệ đó; một nhãn 120 x 30 nhận kernel tối thiểu 11 px, ở kích thước đó vẫn để lại hình dạng chữ có thể đoán được, nên hãy chọn hộp đen cho mọi thứ nhạy cảm. Các mục viết tay mà OCR không đọc được vẫn giữ nguyên và phải được kiểm tra bằng mắt. Kết quả là một tệp JPG 3024 x 4032; OCR trên một ảnh 12 megapixel là bước chậm nhất và mất nhiều thời gian hơn so với ảnh chụp màn hình.',
        },
      ],
      whenNotToUse: 'Đừng dùng công cụ này làm biện pháp bảo vệ duy nhất cho một tài liệu phải được che hoàn toàn; OCR chỉ ở mức tốt nhất có thể, hiện chỉ đọc chữ in tiếng Anh, và các mẫu thông tin cá nhân không biết gì về tên, ngày sinh hay mã định danh ngoài Bắc Mỹ. Đừng dùng làm mờ cho văn bản bạn sẽ công bố, vì làm mờ chữ là kiểu che dễ bị đảo ngược nhất; hãy dùng hộp đen. Khuôn mặt, logo và hình ảnh không phải văn bản nên không bị động đến; công cụ làm mờ khuôn mặt và công cụ xóa vật thể xử lý những thứ đó. Và nếu dữ liệu nhạy cảm nằm trong siêu dữ liệu của tệp thay vì trong điểm ảnh, công cụ EXIF mới là nơi phù hợp.',
      whyMediaManipulator: [
        'Năm mẫu thông tin cá nhân, phần nới khung và kích thước kernel đều được ghi rõ, để bạn biết chính xác văn bản nào sẽ bị phát hiện và được che như thế nào.',
        'OCR và việc che chạy trong một tiến trình cục bộ trên GPU của chính chúng tôi; ảnh chụp màn hình đầy dữ liệu khách hàng không bao giờ rời khỏi phần cứng của chúng tôi.',
        'Che văn bản dùng một tác vụ AI (mặc định 3 mỗi ngày khi không có tài khoản, 10 với tài khoản miễn phí), được tính vào hạn mức tác vụ AI chứ không phải hạn mức tác vụ thường, và tác vụ thất bại được hoàn lại. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Việc nhận dạng và che văn bản chạy dưới dạng một tiến trình EasyOCR và OpenCV cục bộ trên máy chủ GPU của chính chúng tôi; không dịch vụ OCR hay AI bên ngoài nào nhận ảnh, và văn bản nhận dạng được chỉ dùng để quyết định khung nào cần che và không được lưu lại. Tệp tải lên nằm trong uploads/<jobId>/ và ảnh đã che trong outputs/<jobId>/, cả hai đều được đăng ký trong sổ thời gian lưu và bị xóa khi hết thời hạn. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Như mọi ảnh tải lên thông thường, tệp cũng đi qua bước phân tích nội dung tự động của chúng tôi trên cùng máy chủ, nơi một mô hình thị giác cục bộ viết một đoạn mô tả ngắn được giữ cùng tác vụ và không chia sẻ với bên thứ ba.',
      faq: [
        {
          question: 'Chế độ thông tin cá nhân phát hiện những dữ liệu cá nhân nào?',
          answer: 'Văn bản khớp với năm mẫu: địa chỉ email, số điện thoại Bắc Mỹ, mã định danh dạng 3-2-4 chữ số, chuỗi 13 đến 19 chữ số giống số thẻ, và địa chỉ đường phố kết thúc bằng một từ như Street, Avenue hoặc Road. Tên, ngày tháng và mã định danh ngoài Hoa Kỳ không được khớp; hãy dùng tất cả văn bản cho những thứ đó.',
        },
        {
          question: 'Khi nào tôi nên dùng tất cả văn bản thay vì chỉ thông tin cá nhân?',
          answer: 'Bất cứ khi nào bạn không thể liệt kê trước những gì nhạy cảm: biểu mẫu, bảng, nhật ký chat có tên người. Tất cả văn bản che mọi dòng mà OCR đọc được, nên rủi ro duy nhất còn lại là văn bản OCR không đọc được.',
        },
        {
          question: 'Công cụ có đọc ngôn ngữ khác ngoài tiếng Anh không?',
          answer: 'Hiện tại thì chưa. Trình đọc OCR chỉ được khởi tạo cho tiếng Anh, nên văn bản chữ Latinh được đọc khá ổn nhưng các hệ chữ khác có thể bị bỏ sót hoặc đọc sai. Hãy rà soát kết quả khi trang không phải tiếng Anh.',
        },
        {
          question: 'Ở đây hộp đen có an toàn hơn làm mờ hay pixel hóa không?',
          answer: 'Có. Khung được tô đen đặc nên không còn gì sót lại. Làm mờ dùng kernel bằng một phần ba kích thước khung với tối thiểu 11 px, còn pixel hóa để lại 12 ô theo chiều ngang; cả hai đều có thể khiến đoạn văn bản ngắn vẫn đoán được. Hãy chọn hộp đen cho bất cứ thứ gì bạn sẽ công bố.',
        },
        {
          question: 'Việc che có xóa siêu dữ liệu ẩn trong ảnh của tôi không?',
          answer: 'Kết quả được OpenCV ghi mới mà không sao chép các thẻ gốc, nên dữ liệu EXIF và GPS không được chuyển sang. Để xóa có chủ đích và kiểm tra được trên một tệp mà bạn không chỉnh sửa gì khác, hãy dùng công cụ siêu dữ liệu EXIF.',
        },
        {
          question: 'Vì sao một số văn bản vẫn hiển thị?',
          answer: 'Hoặc OCR không đọc được (chữ viết tay, chữ in rất nhỏ, bị nghiêng, độ tương phản thấp), hoặc, ở chế độ thông tin cá nhân, văn bản đó không khớp mẫu nào. Máy chủ báo số khung đã che; bằng không nghĩa là không có gì khớp, không phải là không có gì ở đó.',
        },
        {
          question: 'Che văn bản có miễn phí không, và điều gì bị tính vào hạn mức của tôi?',
          answer: 'Có. Đây là một tác vụ AI, mặc định 3 mỗi ngày khi không có tài khoản và 10 với tài khoản miễn phí, với ảnh tối đa lần lượt 200 MB và 1 GB. Nó chỉ dùng hạn mức tác vụ AI, không bao giờ dùng hạn mức tác vụ thường. Trang giá có các con số hiện hành.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Mỗi lần chạy dùng một tác vụ AI từ hạn mức tác vụ AI hằng ngày của bạn; giới hạn kích thước mỗi tệp của gói bạn được hiển thị trong biểu mẫu.',
        ],
      },
      related: [
        {
          label: 'Làm mờ khuôn mặt trong ảnh',
          to: '/tools/blur-faces-in-photo',
          description: 'Ẩn những người có trong cùng bức ảnh.',
        },
        {
          label: 'Xóa siêu dữ liệu EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Loại bỏ dữ liệu vị trí và thiết bị ẩn.',
        },
        {
          label: 'Quét tài liệu bằng AI',
          to: '/tools/ai-document-scan',
          description: 'Biến trang giấy được chụp thành PDF gọn gàng, có thể tìm kiếm.',
        },
        {
          label: 'Xóa vật thể khỏi ảnh',
          to: '/tools/remove-object-from-photo',
          description: 'Xóa logo, biển số hoặc huy hiệu không phải là văn bản.',
        },
        {
          label: 'Nén ảnh',
          to: '/tools/compress-image',
          description: 'Thu nhỏ ảnh chụp màn hình đã che trước khi đính kèm.',
        },
      ],
      embed: {
        title: 'Che văn bản trong ảnh',
        description: 'Tải lên ảnh chụp màn hình hoặc ảnh. Thao tác Che văn bản / thông tin cá nhân đã được chọn và khóa sẵn. Chọn che dữ liệu cá nhân hay tất cả văn bản, chọn kiểu che, rồi chuyển đổi.',
      },
    },
    'remove-object-from-photo': {
      name: 'Xóa vật thể khỏi ảnh',
      h1: 'Xóa vật thể khỏi ảnh trực tuyến',
      tagline: 'Vẽ một khung quanh thứ bạn không muốn có trong ảnh, mô hình inpainting sẽ lấp chỗ trống bằng nền phù hợp.',
      metaTitle: 'Xóa vật thể khỏi ảnh trực tuyến | Media Manipulator',
      metaDescription: 'Xóa các vật thể không mong muốn khỏi ảnh. Vẽ một hình chữ nhật và inpainting bằng AI sẽ lấp khoảng trống cho khớp với nền. Chạy trên GPU của chúng tôi. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Xóa vật thể khỏi ảnh trực tuyến',
      ogDescription: 'Vẽ một khung quanh vật thể không mong muốn và inpainting bằng AI sẽ lấp khoảng trống bằng nền phù hợp.',
      intro: 'Tải ảnh lên, kéo một hoặc nhiều hình chữ nhật lên những thứ bạn muốn loại bỏ, rồi chuyển đổi. Biểu mẫu gửi mỗi hình chữ nhật dưới dạng tỷ lệ so với ảnh (trái, trên, chiều rộng và chiều cao trong khoảng từ 0 đến 1), và API của chúng tôi biến chúng thành một mặt nạ: một ảnh PNG thang xám cùng kích thước với ảnh của bạn, trắng bên trong các hình chữ nhật và đen ở mọi chỗ khác. Sau đó một script Python mở ảnh và mặt nạ rồi chạy mô hình inpainting LaMa từ gói simple_lama_inpainting trên GPU của chúng tôi, mô hình này vẽ lại các vùng trắng dựa trên khung cảnh xung quanh. Bạn nhận lại ảnh ở kích thước đầy đủ theo định dạng đã chọn, với các vùng được đánh dấu đã được lấp đầy.',
      whatItDoes: [
        'Nhận một hoặc nhiều hình chữ nhật được vẽ trên bản xem trước và xóa mọi thứ bên trong chúng.',
        'Dựng một mặt nạ chính xác đến từng điểm ảnh trên máy chủ từ tọa độ hình chữ nhật đã chuẩn hóa, nên mặt nạ không phụ thuộc vào kích thước màn hình của bạn.',
        'Chạy inpainting LaMa trên GPU do chúng tôi vận hành và lấp các vùng bị che bằng nội dung nối tiếp phần nền.',
        'Trả về ảnh ở độ phân giải đầy đủ dạng JPG, PNG, WebP hoặc GIF như đã chọn trong biểu mẫu.',
        'Được tính là một tác vụ AI trong hạn mức tác vụ AI hằng ngày; các lần chuyển đổi thông thường dùng một hạn mức khác, riêng biệt.',
      ],
      flowSteps: [
        {
          title: 'Tải ảnh lên',
          description: 'JPG, PNG hoặc WebP. Bản xem trước hiện ra cùng một lớp phủ để vẽ.',
        },
        {
          title: 'Vẽ hình chữ nhật',
          description: 'Mỗi vật thể một khung, lớn hơn vật thể một chút. Cần ít nhất một khung.',
        },
        {
          title: 'Tạo mặt nạ và inpainting',
          description: 'Máy chủ ghi một mặt nạ PNG cùng kích thước, rồi chạy remove_object_lama.py với ảnh và mặt nạ.',
        },
        {
          title: 'Tải xuống và kiểm tra',
          description: 'Phóng to các vùng được lấp để kiểm tra đường nối trước khi dùng ảnh.',
        },
      ],
      advancedDetails: [
        'Trình xử lý là RemoveObject trong ai_tools.go. Nó đọc kích thước ảnh bằng ImageMagick identify, raster hóa các hình chữ nhật thành một mặt nạ PNG thang xám trong thư mục tạm của máy chủ (trắng bên trong, đen bên ngoài, tọa độ làm tròn đến điểm ảnh nguyên và giới hạn trong phạm vi ảnh), chạy script, rồi xóa mặt nạ sau đó.',
        'remove_object_lama.py mở ảnh bằng Pillow và chuyển sang RGB, nạp mặt nạ dưới dạng thang xám, đổi kích thước mặt nạ theo ảnh nếu kích thước khác nhau, gọi SimpleLama(image, mask) và lưu kết quả vào đường dẫn đầu ra. Do bước chuyển sang RGB, ảnh PNG trong suốt đầu vào sẽ mất kênh alpha.',
        'Mỗi hình chữ nhật được kiểm tra ở phía máy chủ: chiều rộng và chiều cao phải dương và khung phải nằm trong khoảng 0 đến 1 trên cả hai trục, nếu không tác vụ bị từ chối trước khi bắt đầu và lượt sử dụng được hoàn lại.',
        'Nhánh AI bỏ qua giai đoạn ImageMagick, nên các thiết lập bộ lọc, tông màu, chữ phủ, chất lượng và đổi kích thước không được áp dụng, và bước sao chép siêu dữ liệu bằng exiftool không chạy; kết quả không mang EXIF nào từ bản gốc. Pillow lưu tệp với thiết lập bộ mã hóa mặc định của riêng nó cho định dạng đã chọn.',
        'LaMa lấp dựa trên ngữ cảnh, nên chất lượng phần lấp phụ thuộc vào những gì bao quanh khung. Bầu trời, cỏ, cát, nước, tường và sàn cho kết quả thuyết phục; một khung cắt ngang khuôn mặt, chữ hoặc họa tiết đều đặn buộc mô hình phải tự bịa ra cấu trúc mà nó không thể biết.',
      ],
      whyItMatters: [
        'Chỉnh sửa bằng clone stamp trên nền có kết cấu đòi hỏi kỹ năng và thời gian; vẽ một hình chữ nhật chỉ mất hai giây.',
        'Một người lạc vào khung hình, một sợi dây cáp hay một tấm biển có thể là thứ duy nhất ngăn cách giữa một bức ảnh dùng được và việc phải chụp lại.',
        'Công cụ này còn giúp bảo vệ quyền riêng tư cho số nhà, biển số xe và màn hình không nên xuất hiện trong ảnh chia sẻ.',
      ],
      useCases: [
        {
          title: 'Du lịch và phong cảnh',
          description: 'Xóa một du khách, một sợi dây điện hay một thùng rác khỏi khung cảnh vốn sạch sẽ.',
        },
        {
          title: 'Ảnh sản phẩm',
          description: 'Xóa nhãn giá, giá đỡ hoặc một hạt bụi khỏi ảnh đăng bán.',
        },
        {
          title: 'Bất động sản',
          description: 'Dọn một chiếc xe, thùng rác hoặc đồ lộn xộn ở mép khung hình.',
        },
        {
          title: 'Quyền riêng tư',
          description: 'Xóa số nhà, biển số xe hoặc màn hình máy tính đang hiện rõ.',
        },
      ],
      workedExamples: [
        {
          title: 'Một hình chữ nhật trên ảnh bãi biển 4000 x 3000',
          body: 'Đầu vào: một tệp JPEG 5,2 MB, 4000 x 3000, có một người ở mép nước. Vẽ một khung bắt đầu ở 60% chiều ngang và 40% chiều dọc, rộng 10% và cao 15%, và giữ JPG làm đầu ra. API nhân các tỷ lệ đó với kích thước ảnh và ghi một mặt nạ 4000 x 3000 với một khối trắng 400 x 450 điểm ảnh tại (2400, 1200). LaMa chạy một lần trên ảnh và mặt nạ trên GPU, và script lưu một tệp JPG 4000 x 3000 với 180.000 điểm ảnh bị che được lấp bằng cát và nước xung quanh. Lượt chạy mô hình trên ảnh 12 megapixel mất vài giây trên GPU; việc ghi và tải xuống một tệp JPG nhiều megabyte chiếm một phần thời gian tổng tương đương.',
        },
        {
          title: 'Hai hình chữ nhật trên ảnh sản phẩm PNG 1920 x 1080',
          body: 'Đầu vào: một tệp PNG 2,3 MB, 1920 x 1080, chụp một chiếc đèn trên bàn có dây cáp và nhãn giá. Vẽ hai khung: một trên dây cáp (khoảng 5% x 30%) và một trên nhãn giá (khoảng 8% x 6%). Cả hai được raster hóa vào cùng một mặt nạ 1920 x 1080, nên một lượt inpainting duy nhất xử lý cả hai vùng. Chọn PNG làm đầu ra để tránh nhiễu nén JPEG ở các vùng được lấp; kết quả là một tệp PNG 1920 x 1080, RGB không trong suốt vì Pillow chuyển đầu vào sang RGB trước khi inpainting. Ở 2 megapixel, lượt chạy GPU rất nhanh, và phần lớn thời gian thực tế là việc tải lên và ghi tệp PNG.',
        },
      ],
      whenNotToUse: 'Đừng dùng inpainting cho vật thể chiếm phần lớn khung hình, nằm trước khuôn mặt, chồng lên chữ đọc được, hoặc cắt ngang một họa tiết đều đặn như gạch, ô lát hay bàn phím: mô hình phải tự bịa ra cấu trúc và kết quả sẽ trông nhòe hoặc lặp lại. Đây cũng là công cụ không phù hợp khi bạn muốn giữ nguyên ảnh PNG trong suốt, vì script làm phẳng đầu vào thành RGB, và khi bản chỉnh sửa phải trung thực về mặt giám định, vì vùng được lấp là nội dung được tạo ra. Để thay toàn bộ nền, hãy dùng công cụ xóa nền; với khuôn mặt chỉ cần ẩn đi, công cụ làm mờ khuôn mặt phù hợp hơn.',
      whyMediaManipulator: [
        'Mặt nạ được dựng trên máy chủ từ tỷ lệ chính xác, nên những gì bạn vẽ trên bản xem trước ở điện thoại ứng với đúng những điểm ảnh như trên máy tính.',
        'Mô hình được nêu tên (LaMa qua simple_lama_inpainting) và cách xử lý định dạng cũng như kênh alpha được ghi rõ thay vì để bạn phải đoán.',
        'Chạy trên GPU của chính chúng tôi; công cụ tiêu chuẩn không cần tài khoản. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Ảnh của bạn được lưu trong uploads/<jobId>/ trên máy chủ của chúng tôi; mặt nạ hình chữ nhật được ghi thành một tệp PNG tạm trong thư mục tạm của máy chủ và bị xóa ngay khi script inpainting chạy xong; ảnh đã lấp được đưa vào outputs/<jobId>/. Tọa độ các hình chữ nhật được giữ trong tùy chọn của tác vụ để có thể lập báo cáo về tác vụ. LaMa chạy trên GPU trong cùng máy, và không phần nào của ảnh được gửi đến nhà cung cấp bên ngoài. Mọi ảnh tải lên, kể cả ảnh này, cũng được một bước phân tích tự động trên máy chủ của chúng tôi tóm tắt một lần bằng mô hình thị giác cục bộ, và bản tóm tắt đó được giữ cùng tác vụ. Kết quả không mang EXIF vì các thao tác AI bỏ qua bước sao chép siêu dữ liệu. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Xóa vật thể có miễn phí không?',
          answer: 'Có, trong phạm vi hạn mức tác vụ AI hằng ngày. Mỗi lần xóa dùng một tác vụ AI: mặc định 3 mỗi ngày với khách và 10 với tài khoản miễn phí, với giới hạn mỗi tệp 200 MB và 1 GB; 100 và 200 với Premium và Pro. Hạn mức tác vụ thường dành cho chuyển đổi là riêng biệt và không thay đổi. Các con số hiện hành có trên /pricing.',
        },
        {
          question: 'Hình chữ nhật cần chính xác đến mức nào?',
          answer: 'Không cần quá chính xác. Mặt nạ chính là hình chữ nhật bạn vẽ, làm tròn đến điểm ảnh nguyên, nên hãy chừa thêm một chút nền quanh vật thể và bóng của nó. Mô hình sẽ hòa trộn phần lề dư đó.',
        },
        {
          question: 'Tôi có thể xóa nhiều vật thể cùng lúc không?',
          answer: 'Có. Mọi hình chữ nhật bạn vẽ đều được tô vào cùng một mặt nạ và tất cả được lấp trong một lượt. Cần ít nhất một hình chữ nhật, nếu không tác vụ bị từ chối.',
        },
        {
          question: 'Vì sao vùng được lấp trông mờ hoặc lặp lại?',
          answer: 'LaMa lấp dựa trên các điểm ảnh quanh khung. Một khung nằm trên chi tiết mịn hoặc họa tiết đều đặn khiến mô hình phải đoán. Hãy thử khung sát hơn, xóa từng vật thể một, hoặc chọn ảnh có phần nền phía sau vật thể đơn giản hơn.',
        },
        {
          question: 'Kết quả có định dạng gì?',
          answer: 'Định dạng bạn đã chọn trong biểu mẫu: JPG, PNG, WebP hoặc GIF. Đầu vào được chuyển sang RGB trước khi inpainting, nên độ trong suốt không được giữ lại. PNG tránh được nhiễu nén JPEG ở các vùng được lấp.',
        },
        {
          question: 'Kết quả có giữ dữ liệu EXIF của tôi không?',
          answer: 'Không. Nhánh AI bỏ qua bước sao chép bằng exiftool mà bộ chuyển đổi thông thường thực hiện, và Pillow ghi một tệp mới, nên không có thẻ máy ảnh, ngày tháng hay GPS nào được chuyển sang.',
        },
        {
          question: 'Mặt nạ hoặc ảnh của tôi có bị gửi đi nơi khác không?',
          answer: 'Không. Mặt nạ là một tệp tạm trên máy chủ của chúng tôi và bị xóa sau khi chạy xong, còn mô hình inpainting chạy trên GPU của chính chúng tôi.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Mỗi lần chạy dùng một tác vụ AI từ hạn mức tác vụ AI hằng ngày của bạn; giới hạn kích thước mỗi tệp của gói bạn được hiển thị trong biểu mẫu.',
        ],
      },
      related: [
        {
          label: 'Xóa nền ảnh',
          to: '/tools/remove-background-from-image',
          description: 'Cắt hẳn chủ thể ra thay vì vá một vùng.',
        },
        {
          label: 'Làm mờ khuôn mặt trong ảnh',
          to: '/tools/blur-faces-in-photo',
          description: 'Ẩn người mà không cần tạo thêm nền.',
        },
        {
          label: 'Che văn bản trong ảnh',
          to: '/tools/redact-text-in-image',
          description: 'Che đen văn bản mà OCR tìm được, thay vì inpainting nó.',
        },
        {
          label: 'Phục hồi ảnh bằng AI',
          to: '/tools/ai-image-restoration',
          description: 'Làm sạch nhiễu và vết nén quanh vùng đã sửa.',
        },
        {
          label: 'Nén ảnh',
          to: '/tools/compress-image',
          description: 'Thu nhỏ ảnh hoàn chỉnh để chia sẻ.',
        },
      ],
      embed: {
        title: 'Xóa vật thể khỏi ảnh',
        description: 'Tải ảnh lên. Thao tác Xóa đối tượng đã được chọn và khóa sẵn. Vẽ một hoặc nhiều hình chữ nhật lên những gì bạn muốn loại bỏ, rồi chuyển đổi.',
      },
    },
    'clean-voice-audio': {
      name: 'Làm sạch âm thanh giọng nói',
      h1: 'Làm sạch bản ghi âm giọng nói bằng AI',
      tagline: 'Giúp giọng nói rõ hơn bằng cách giảm tiếng xì, tiếng vang phòng và tiếng ù trầm trong podcast, phỏng vấn và ghi chú giọng nói.',
      metaTitle: 'Làm sạch bản ghi âm giọng nói bằng AI | Media Manipulator',
      metaDescription: 'Làm sạch bản ghi âm giọng nói bằng AI. Giảm tiếng xì, tiếng ù và tạp âm phòng để giọng nói dễ nghe hơn. Chạy trên GPU của chúng tôi. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Làm sạch bản ghi âm giọng nói bằng AI',
      ogDescription: 'Giảm tiếng xì, tiếng ù và tạp âm phòng để lời nói rõ hơn trong podcast, phỏng vấn và ghi chú giọng nói.',
      intro: 'Một ghi chú giọng nói trên điện thoại trong căn bếp vang tiếng, một khách mời podcast dùng micro laptop, một bài giảng ghi âm từ cuối phòng: lời nói vẫn có đó, nhưng chìm dưới tiếng xì và âm thanh phòng. Làm sạch giọng nói đưa bản ghi qua DeepFilterNet trên GPU của chúng tôi, rồi qua một chuỗi tinh chỉnh cố định theo kiểu phát sóng giúp cắt tiếng ù trầm, giới hạn dải cao, đưa mức âm về độ lớn đồng đều và ngăn đỉnh âm bị vỡ. Công cụ được tạo ra cho lời nói, không phải cho âm nhạc.',
      whatItDoes: [
        'Chuyển tệp tải lên thành mono 48 kHz bằng ffmpeg, đúng dạng đầu vào DeepFilterNet cần, rồi giao tệp WAV đó cho mô hình trên GPU của chúng tôi.',
        'Triệt các âm nền ổn định (tiếng xì, quạt, tiếng ù, âm phòng) mà vẫn giữ lời nói, bằng mạng tăng cường DeepFilterNet.',
        'Áp dụng chuỗi tinh chỉnh sau khi khử nhiễu: bộ lọc thông cao 80 Hz, bộ lọc thông thấp 14 kHz, chuẩn hóa độ lớn về -16 LUFS với trần đỉnh thực -1,5 dBTP, và bộ giới hạn ở 0,95.',
        'Mã hóa kết quả theo định dạng bạn chọn: MP3, AAC hoặc OGG ở 192 kbps, Opus ở 128 kbps, FLAC, hoặc WAV 16-bit.',
        'Bỏ qua các tùy chọn bitrate, EQ, hiệu ứng và cắt tiêu chuẩn, vì nhánh AI thay thế chuỗi bộ lọc ffmpeg thông thường.',
      ],
      flowSteps: [
        {
          title: 'Tải bản ghi âm lên',
          description: 'Ghi chú giọng nói, âm thanh phỏng vấn, bản thu podcast hoặc bản ghi bài giảng ở dạng MP3, WAV, FLAC, M4A, AAC, OGG hoặc Opus.',
        },
        {
          title: 'Làm sạch giọng nói được đặt sẵn',
          description: 'Thao tác được cố định trên trang này; lựa chọn duy nhất còn lại là định dạng đầu ra.',
        },
        {
          title: 'Chuẩn hóa, khử nhiễu, tinh chỉnh',
          description: 'ffmpeg tạo tệp WAV mono 48 kHz, DeepFilterNet khử nhiễu, và các bộ lọc tinh chỉnh định hình âm sắc và độ lớn.',
        },
        {
          title: 'Tải xuống và nghe',
          description: 'So sánh với bản gốc bằng tai nghe trước khi xuất bản.',
        },
      ],
      advancedDetails: [
        'Chuỗi tinh chỉnh chính xác là highpass=f=80,lowpass=f=14000,loudnorm=I=-16:TP=-1.5:LRA=11,alimiter=limit=0.95, được áp dụng một lần lên tệp WAV đã khử nhiễu. Bộ lọc thông cao loại bỏ tiếng ù do cầm nắm và tiếng bụp của âm bật hơi, bộ lọc thông thấp chế ngự tiếng xì trên 14 kHz, và loudnorm đưa độ lớn tích hợp về -16 LUFS, mức mục tiêu thường dùng cho podcast lời nói.',
        'Đầu ra luôn là mono 48 kHz vì mô hình chạy trên một kênh duy nhất. Một buổi phỏng vấn stereo vẫn nghe rõ nhưng mất vị trí trái-phải; nếu bạn cần stereo, đây không phải công cụ phù hợp.',
        'Thiết lập bộ mã hóa dựa theo phần mở rộng đầu ra: libmp3lame ở 192 kbps cho MP3, aac ở 192 kbps cho AAC hoặc M4A, libvorbis ở 192 kbps cho OGG, libopus ở 128 kbps cho Opus, flac cho FLAC và pcm_s16le cho WAV. Nhánh AI không có bộ chọn bitrate.',
        'Khoảng cắt và các hiệu ứng thông thường bị bỏ qua khi chọn một thao tác AI; bộ chuyển đổi đưa tệp thẳng đến mô hình rồi trả về. Hãy cắt bản ghi trước nếu bạn chỉ muốn làm sạch một phần.',
        'Chạy lần thứ hai qua Làm sạch giọng nói sẽ chuẩn hóa lại âm thanh vốn đã ở -16 LUFS và có thể khiến phụ âm nghe như bị nhòe nước. Chỉ chạy một lần.',
        'Mô hình gặp khó với các giọng nói chồng nhau, nhạc nền và những âm thanh lớn đột ngột; đó không phải "nền ổn định" nên phần lớn được giữ nguyên.',
      ],
      whyItMatters: [
        'Người nghe sẽ bỏ dở một bản ghi âm nghe mệt tai, ngay cả khi nội dung đáng để nghe.',
        'Mức âm đồng đều -16 LUFS nghĩa là một tập phát ở cùng âm lượng với các tập xung quanh mà không cần chỉnh gain thủ công.',
        'Lời nói đã được tách khỏi tạp âm cũng được chép lời chính xác hơn, nên làm sạch trước còn giúp cải thiện phụ đề.',
      ],
      useCases: [
        {
          title: 'Podcast và phỏng vấn',
          description: 'Làm gọn tiếng của một khách mời từ xa thu bằng micro cơ bản và đưa họ về cùng độ lớn với người dẫn.',
        },
        {
          title: 'Ghi chú giọng nói và đọc chính tả',
          description: 'Giúp bản ghi trên điện thoại dễ hiểu khi nghe lại, và đủ to để nghe mà không cần tai nghe.',
        },
        {
          title: 'Bài giảng và cuộc họp',
          description: 'Giảm tiếng ù của điều hòa và quạt máy chiếu trong bản ghi thu từ cuối phòng.',
        },
        {
          title: 'Lời thuyết minh cho video',
          description: 'Tinh chỉnh giọng thuyết minh trước khi đặt vào trình biên tập Darkroom.',
        },
      ],
      workedExamples: [
        {
          title: 'Ghi chú điện thoại 12 phút (M4A, 128 kbps, khoảng 11 MB) sang MP3',
          body: 'Một tệp AAC ở 128 kbps chiếm 16 KB mỗi giây, nên 720 giây là khoảng 11,5 MB. Mười hai phút vượt quá giới hạn 5 phút cho khách, nên cần có tài khoản miễn phí (20 phút). Đầu tiên ffmpeg ghi một tệp WAV mono 48 kHz khoảng 69 MB (96.000 byte mỗi giây) vào một thư mục tạm sẽ bị xóa khi tác vụ kết thúc. DeepFilterNet và chuỗi tinh chỉnh chạy trên tệp đó, và bộ mã hóa MP3 ghi kết quả ở 192 kbps: khoảng 17 MB, lớn hơn đầu vào vì 192 kbps là tốc độ cao hơn tốc độ ghi của ghi chú gốc. Hai bước ffmpeg mất vài giây; lượt DeepFilterNet chiếm phần lớn thời gian và tăng theo độ dài bản ghi.',
        },
        {
          title: 'Phỏng vấn WAV stereo 4 phút (44,1 kHz, 16-bit, khoảng 42 MB) sang WAV',
          body: 'PCM stereo 16-bit 44,1 kHz là 176.400 byte mỗi giây, nên 240 giây là khoảng 42 MB, nằm trong giới hạn cho khách là 200 MB và 5 phút. Tệp được gộp thành mono và lấy mẫu lại ở 48 kHz trước khi mô hình chạy, và tệp WAV đã làm sạch trả về ở dạng mono 16-bit 48 kHz: 96.000 byte mỗi giây, khoảng 23 MB. Tệp nhỏ hơn đầu vào chỉ vì có một kênh thay vì hai. Nếu chọn FLAC, các mẫu âm được giữ nguyên không mất dữ liệu với dung lượng nhỏ hơn; chọn MP3 cho khoảng 5,8 MB ở 192 kbps.',
        },
      ],
      whenNotToUse: 'Đừng dùng công cụ này cho nhạc, giọng hát hoặc bất cứ thứ gì mà âm nền là một phần âm thanh bạn muốn giữ: mô hình coi mọi thứ không phải lời nói là tạp âm, và chuỗi tinh chỉnh cắt bỏ phần dưới 80 Hz và trên 14 kHz, làm rỗng âm sắc của nhạc cụ. Đây cũng là lựa chọn sai khi bạn cần giữ stereo, khi bản ghi bị vỡ tiếng hoặc méo (hư hại đó không phải tạp âm và không thể lọc bỏ), hoặc khi bạn chỉ muốn giảm tạp âm mà không thay đổi mức âm hay âm sắc, việc mà trang Loại bỏ tiếng ồn nền đảm nhận thay vào đó.',
      whyMediaManipulator: [
        'DeepFilterNet và chuỗi tinh chỉnh chạy trên GPU do chúng tôi vận hành; bản ghi âm không được gửi đến dịch vụ tăng cường giọng nói bên ngoài.',
        'Trang mở ra với Làm sạch giọng nói đã được chọn sẵn và menu thao tác bị ẩn, nên quyết định duy nhất là định dạng đầu ra.',
        'Một lần làm sạch là một tác vụ thường trong hạn mức hằng ngày của bạn (mặc định 5 với khách, 30 với tài khoản miễn phí), không phải tác vụ AI, và tác vụ thất bại được hoàn lại.',
      ],
      privacyNote: 'Bản ghi âm của bạn được lưu trong thư mục tác vụ, được ffmpeg chuyển thành một tệp WAV mono 48 kHz tạm thời trong thư mục nháp, rồi được chuyển cho DeepFilterNet trên GPU của chính chúng tôi; thư mục nháp đó bị xóa ngay khi tệp đã làm sạch được mã hóa xong. Kết quả đã làm sạch được giữ cùng tác vụ để tải xuống. Tệp âm thanh tải lên cũng đi qua một lượt phân tích tự động trên máy chủ của chúng tôi, lượt này chép lời bản ghi bằng Whisper để rà soát nội dung nội bộ và giữ kết quả cùng tác vụ. Không nhà cung cấp AI bên thứ ba nào nhận tệp. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Vì sao tệp đã làm sạch lại là mono?',
          answer: 'Quy trình chuyển mọi đầu vào thành một kênh ở 48 kHz trước khi DeepFilterNet chạy, và mã hóa đầu ra của mô hình như vốn có. Vì vậy bản ghi stereo sẽ trả về dạng mono. Với buổi phỏng vấn dùng hai micro, hãy tách các kênh trước và làm sạch từng kênh riêng nếu bạn cần giữ sự tách biệt.',
        },
        {
          question: 'Làm sạch giọng nói chuẩn hóa độ lớn về mức nào?',
          answer: 'Chuỗi tinh chỉnh dùng loudnorm của ffmpeg với mục tiêu tích hợp -16 LUFS, trần đỉnh thực -1,5 dBTP và dải độ lớn 11 LU, theo sau là bộ giới hạn ở 0,95. Mức này khớp với các mục tiêu phổ biến cho nội dung lời nói, nên một tập được làm sạch ở đây sẽ có mức âm tương tự các podcast được master chuyên nghiệp.',
        },
        {
          question: 'Tôi có thể đặt bitrate hoặc cắt tệp trên trang này không?',
          answer: 'Không. Khi một thao tác AI đang bật, bộ chuyển đổi đưa thẳng đến mô hình và bỏ qua các thiết lập bitrate, EQ, hiệu ứng và cắt. Tốc độ đầu ra cố định theo định dạng: 192 kbps cho MP3, AAC và OGG, 128 kbps cho Opus. Hãy cắt bản ghi bằng công cụ khác trước nếu bạn chỉ muốn một phần.',
        },
        {
          question: 'Công cụ này khác gì Loại bỏ tiếng ồn nền?',
          answer: 'Cả hai chạy cùng mô hình DeepFilterNet. Làm sạch giọng nói thêm bộ lọc thông cao, thông thấp, chuẩn hóa độ lớn và bộ giới hạn sau đó; Loại bỏ tiếng ồn nền dừng ở tín hiệu đã khử nhiễu và giữ nguyên mức âm và âm sắc của bạn. Chọn Làm sạch giọng nói cho tệp lời nói hoàn chỉnh, và trang kia khi bạn định tự mix hoặc master.',
        },
        {
          question: 'Công cụ có sửa được bản ghi bị vỡ tiếng hoặc méo không?',
          answer: 'Không. Vỡ tiếng là phần dạng sóng bị mất, không phải tạp âm thêm vào, nên mô hình không có gì để trừ đi. Nó vẫn có thể giảm tiếng xì quanh một bản thu bị méo, nhưng tiếng rè ở các âm tiết lớn vẫn còn.',
        },
        {
          question: 'Mỗi ngày tôi làm sạch được bao nhiêu bản ghi, và có miễn phí không?',
          answer: 'Làm sạch giọng nói được chủ ý tính là tác vụ thường, nên mỗi lần dùng một lượt từ hạn mức tác vụ thường: mặc định 5 mỗi ngày với khách, 30 với tài khoản miễn phí, 300 với Premium và 700 với Pro, với giới hạn tệp 200 MB, 1 GB và 5 GB và giới hạn độ dài 5 phút, 20 phút và 2 giờ. Bảng hiện hành có trên /pricing.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Làm sạch giọng nói dùng hạn mức tác vụ thường; giới hạn độ dài tùy theo gói của bạn và được hiển thị trực tiếp trong biểu mẫu.',
        ],
      },
      related: [
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Cùng bộ khử nhiễu nhưng không có bước tinh chỉnh độ lớn và âm sắc.',
        },
        {
          label: 'Chuyển video thành văn bản',
          to: '/tools/transcribe-video',
          description: 'Biến lời nói đã làm sạch thành phụ đề hoặc văn bản.',
        },
        {
          label: 'Tách âm thanh khỏi video',
          to: '/tools/extract-audio-from-video',
          description: 'Lấy track giọng nói ra khỏi video trước khi làm sạch.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Đặt lời thuyết minh đã tinh chỉnh lên dòng thời gian video.',
        },
        {
          label: 'Loại bỏ giọng hát khỏi bài hát',
          to: '/tools/remove-vocals-from-song',
          description: 'Với nhạc thay vì lời nói, hãy tách riêng ca sĩ.',
        },
      ],
      embed: {
        title: 'Làm sạch bản ghi âm giọng nói',
        description: 'Tải bản ghi âm lên. Làm sạch giọng nói đã được áp dụng sẵn nên không có menu thao tác nào cần đặt. Chọn định dạng đầu ra nếu bạn cần khác mặc định, rồi chuyển đổi.',
      },
    },
    'remove-background-noise': {
      name: 'Loại bỏ tiếng ồn nền',
      h1: 'Loại bỏ tiếng ồn nền khỏi âm thanh trực tuyến',
      tagline: 'Giảm tiếng xì, tiếng ù, tiếng xe cộ và tiếng ồn phòng trong bản ghi âm bằng bộ khử nhiễu AI, giữ âm thanh chính nổi bật.',
      metaTitle: 'Loại bỏ tiếng ồn nền khỏi âm thanh trực tuyến | Media Manipulator',
      metaDescription: 'Loại bỏ tiếng ồn nền khỏi âm thanh. Bộ khử nhiễu AI giảm tiếng xì, tiếng ù và âm thanh xung quanh trong bản ghi âm. Chạy trên GPU của chúng tôi. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Loại bỏ tiếng ồn nền khỏi âm thanh trực tuyến',
      ogDescription: 'Bộ khử nhiễu AI giảm tiếng xì, tiếng ù, tiếng xe cộ và tạp âm phòng trong bản ghi âm.',
      intro: 'Máy điều hòa, quạt máy tính, tiếng xe cộ ngoài phố và tiếng ù điện là những âm thanh ổn định nằm bên dưới thứ bạn thực sự muốn ghi. Trang này đưa tệp qua DeepFilterNet, một bộ khử nhiễu học sâu, trên GPU của chúng tôi và trả về tín hiệu đã khử nhiễu mà không thay đổi gì khác: không chuẩn hóa độ lớn, không cân bằng âm, không bộ giới hạn. Vì vậy đây là lựa chọn phù hợp khi bạn định tự mix hoặc master kết quả, hoặc khi bạn muốn giữ nguyên chất âm của bản gốc.',
      whatItDoes: [
        'Lấy mẫu lại tệp tải lên thành mono 48 kHz bằng ffmpeg và chuyển tệp WAV đó cho chương trình DeepFilterNet trên GPU của chúng tôi.',
        'Ước tính nền tạp âm ổn định rồi trừ đi, làm giảm tiếng xì, tiếng ù, quạt, hệ thống thông gió và tiếng xe cộ liên tục.',
        'Trả về đầu ra thô của mô hình, được mã hóa theo định dạng bạn chọn, với cùng mức đỉnh và cân bằng âm sắc mà mô hình tạo ra; trang này không có bước hậu xử lý nào.',
        'Giữ menu thao tác hiển thị, để bạn có thể chuyển sang Làm sạch giọng nói hoặc các công cụ giọng hát ngay trong cùng biểu mẫu.',
      ],
      flowSteps: [
        {
          title: 'Tải âm thanh lên',
          description: 'Bất kỳ tệp âm thanh phổ biến nào, kể cả track được tách từ video.',
        },
        {
          title: 'Khử nhiễu được chọn sẵn',
          description: 'Loại bỏ tiếng ồn nền đã được chọn; hãy đổi định dạng đầu ra nếu bạn muốn định dạng khác MP3.',
        },
        {
          title: 'DeepFilterNet chạy trên GPU của chúng tôi',
          description: 'Mô hình tách tạp âm ổn định khỏi âm thanh chính và ghi ra một tệp WAV đã tăng cường.',
        },
        {
          title: 'Mã hóa và tải xuống',
          description: 'ffmpeg ghi tệp WAV đã tăng cường theo định dạng bạn chọn; hãy nghe đối chiếu với bản gốc.',
        },
      ],
      advancedDetails: [
        'Khác biệt duy nhất giữa trang này và Làm sạch giọng nói trong API là một cờ duy nhất: polish=false. Bước mã hóa ffmpeg không nhận bộ lọc -af nào, nên tệp WAV đã tăng cường được mã hóa đúng như DeepFilterNet đã ghi.',
        'Bước chuẩn hóa đầu vào là ffmpeg -ac 1 -ar 48000: mô hình chạy trên một kênh 48 kHz, nên đầu ra là mono 48 kHz bất kể bố cục kênh hay tần số lấy mẫu của đầu vào.',
        'Bộ mã hóa theo phần mở rộng: MP3 qua libmp3lame ở 192 kbps, AAC ở 192 kbps, OGG qua libvorbis ở 192 kbps, Opus qua libopus ở 128 kbps, FLAC không mất dữ liệu, WAV dạng pcm_s16le. Hãy chọn WAV hoặc FLAC nếu bạn sẽ chỉnh sửa thêm, để chỉ phải chịu một lần mã hóa mất dữ liệu.',
        'Vì không có bước chuẩn hóa độ lớn, bản ghi nhỏ tiếng vẫn nhỏ tiếng. Khử nhiễu loại bỏ năng lượng, nên kết quả có thể có mức âm thấp hơn đầu vào một chút; hãy tăng gain trong trình biên tập sau đó nếu cần.',
        'DeepFilterNet được huấn luyện với tạp âm ổn định và thay đổi chậm. Tiếng gõ bàn phím, tiếng đóng sầm cửa, người nói thứ hai hay nhạc nền phần lớn được giữ lại, vì với mô hình chúng trông giống tín hiệu.',
        'Thư mục nháp chứa các tệp WAV đã chuẩn hóa và đã tăng cường bị xóa khi tác vụ hoàn tất; chỉ đầu ra đã mã hóa được giữ cùng tác vụ.',
      ],
      whyItMatters: [
        'Tạp âm liên tục lấn át các phụ âm nhỏ và làm người nghe mệt từ lâu trước khi họ nhận ra lý do.',
        'Nhiều bản ghi không thể làm lại: một bài phát biểu đám cưới, một bài giảng, một cuộc phỏng vấn với người không còn liên lạc được.',
        'Một track đã khử nhiễu nhưng chưa chuẩn hóa hay giới hạn cho bạn điểm khởi đầu sạch cho bản mix của riêng mình, thay vì một tệp nghe như đã hoàn thiện mà bạn lại phải gỡ ra.',
      ],
      useCases: [
        {
          title: 'Âm thanh lấy từ video',
          description: 'Tách track, loại bỏ tiếng quạt máy quay hoặc tiếng gió, rồi đặt lại dưới hình ảnh trong Darkroom.',
        },
        {
          title: 'Bản ghi ngoài hiện trường',
          description: 'Giảm tiếng ầm của đường xá hoặc máy phát điện dưới một buổi phỏng vấn ngoài trời.',
        },
        {
          title: 'Bản xuất cuộc gọi và cuộc họp',
          description: 'Giảm tiếng xì đường truyền trong cuộc gọi đã ghi trước khi chia sẻ hoặc chép lời.',
        },
        {
          title: 'Băng cassette đã số hóa',
          description: 'Giảm tiếng xì băng trong bản ghi đã chuyển đổi mà không thay đổi mức âm.',
        },
      ],
      workedExamples: [
        {
          title: 'Bản ghi cuộc gọi MP3 18 phút ở 128 kbps (khoảng 17 MB) sang FLAC',
          body: 'Ở 128 kbps, một tệp MP3 chiếm 16 KB mỗi giây, nên 1.080 giây là khoảng 17 MB. Mười tám phút nằm trong giới hạn 20 phút của tài khoản miễn phí nhưng vượt giới hạn 5 phút cho khách, nên hãy đăng nhập trước. ffmpeg ghi một tệp WAV mono 48 kHz khoảng 104 MB (96.000 byte mỗi giây) cho mô hình, và tệp WAV đó bị bỏ đi sau khi mã hóa. Chọn FLAC sẽ trả về các mẫu âm mono 48 kHz đã tăng cường mà không mất dữ liệu; tệp FLAC nhỏ hơn tệp WAV 104 MB một lượng tùy thuộc vào mức khoảng lặng và tiếng xì đã được loại bỏ, và bản thân việc khử nhiễu thường giúp FLAC nén tốt hơn. Nếu chọn MP3, bạn sẽ được khoảng 26 MB ở 192 kbps.',
        },
        {
          title: 'Bản ghi hiện trường FLAC stereo 4 phút 30 giây (khoảng 30 MB) sang WAV',
          body: 'Bốn phút rưỡi và 30 MB nằm trong giới hạn cho khách là 5 phút và 200 MB, nên không cần tài khoản. Tệp stereo được gộp thành mono và lấy mẫu lại ở 48 kHz, DeepFilterNet giảm tiếng xe cộ nền, và đầu ra WAV là mono 16-bit 48 kHz: 96.000 byte mỗi giây trong 270 giây, khoảng 26 MB. Mức âm là bất cứ mức nào mô hình để lại, không có chuẩn hóa, nên hãy tăng lên trong trình biên tập nếu bản gốc nhỏ tiếng. Hai lần chuyển đổi ffmpeg mỗi lần mất vài giây; lượt chạy GPU tăng theo thời lượng.',
        },
      ],
      whenNotToUse: 'Đây không phải công cụ cho những bản ghi mà tạp âm xuất hiện ngắt quãng hoặc chính nó là giọng nói: người nói chồng lên nhau, tiếng tivi ở phòng bên, tiếng kéo ghế và tiếng gõ bàn phím phần lớn được giữ nguyên vì mô hình được xây dựng cho tạp âm ổn định. Đừng dùng nó cho nhạc đã hoàn thiện, nơi "tạp âm" bị loại bỏ có thể là tiếng vang và không khí phòng mà bạn đã trả tiền để có. Nếu bạn cần đầu ra stereo, đây là lựa chọn sai vì quy trình chỉ xử lý mono. Và nếu bạn muốn một tệp lời nói sẵn sàng xuất bản ở độ lớn tiêu chuẩn, Làm sạch giọng nói có thêm bước tinh chỉnh đó; trang này chủ ý không làm vậy.',
      whyMediaManipulator: [
        'Bộ khử nhiễu chạy trên GPU do chúng tôi vận hành; âm thanh của bạn không được tải lên dịch vụ khử tạp âm của bên thứ ba.',
        'Không có gì được thêm sau mô hình: không thay đổi độ lớn, không EQ, nên những gì bạn nghe là việc khử nhiễu và chỉ có khử nhiễu.',
        'Một lần khử nhiễu là một tác vụ thường trong hạn mức hằng ngày của bạn, không phải tác vụ AI, và được hoàn lại nếu tác vụ thất bại.',
      ],
      privacyNote: 'Tệp bạn tải lên được ghi vào thư mục tác vụ, được ffmpeg lấy mẫu lại thành một tệp WAV mono 48 kHz tạm thời trong thư mục nháp, và được DeepFilterNet khử nhiễu trên GPU của chính chúng tôi; thư mục nháp bị xóa ngay khi đầu ra được mã hóa xong. Kết quả đã mã hóa được giữ cùng tác vụ để tải xuống. Như mọi tệp âm thanh tải lên, tệp cũng đi qua một bước phân tích tự động trên máy chủ của chúng tôi, bước này chép lời bằng Whisper cho một lượt rà soát nội bộ được giữ cùng tác vụ. Không có gì được gửi đến nhà cung cấp AI bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'DeepFilterNet xử lý tốt những tạp âm nào, và không xử lý được những tạp âm nào?',
          answer: 'Âm thanh ổn định, thay đổi chậm: tiếng xì, tiếng ù điện lưới, quạt, điều hòa, âm phòng, tiếng đường xá liên tục. Các âm thanh ngắn và mọi thứ giống lời nói (người thứ hai, tivi, tiếng lách cách, tiếng đập) trông như âm thanh chính đối với mô hình và phần lớn được giữ lại.',
        },
        {
          question: 'Mức âm hoặc âm sắc của bản ghi có thay đổi không?',
          answer: 'Chỉ như một tác dụng phụ của việc loại bỏ năng lượng tạp âm; trang này không áp dụng chuẩn hóa, EQ hay giới hạn nào. Nếu bạn muốn mức lời nói đồng đều -16 LUFS cùng với bước lọc thông cao và thông thấp, hãy dùng Làm sạch giọng nói, công cụ chạy cùng mô hình kèm thêm chuỗi tinh chỉnh đó.',
        },
        {
          question: 'Vì sao tệp đã khử nhiễu là mono?',
          answer: 'Mô hình nhận một kênh 48 kHz duy nhất, nên ffmpeg gộp mọi đầu vào stereo thành mono trước và đầu ra được ghi theo dạng đó. Một bản ghi stereo có tạp âm khác nhau ở mỗi kênh nên được tách ra và khử nhiễu từng kênh một nếu bạn cần giữ stereo.',
        },
        {
          question: 'Tôi có thể khử nhiễu trực tiếp âm thanh của video không?',
          answer: 'Hãy tải lên track âm thanh thay vì video: tách nó bằng công cụ Tách âm thanh khỏi video, khử nhiễu ở đây, rồi ghép track đã làm sạch với video trong Darkroom.',
        },
        {
          question: 'Định dạng đầu ra nào tốt nhất để chỉnh sửa tiếp?',
          answer: 'WAV (mono 16-bit 48 kHz, 96 KB mỗi giây) hoặc FLAC, định dạng chứa cùng các mẫu âm với dung lượng nhỏ hơn. MP3, AAC và OGG được ghi ở 192 kbps và Opus ở 128 kbps; chỉ chọn chúng cho bản chia sẻ cuối cùng để việc mã hóa mất dữ liệu chỉ xảy ra một lần.',
        },
        {
          question: 'Khử nhiễu có bị tính vào hạn mức tác vụ AI không?',
          answer: 'Không. Loại bỏ tiếng ồn nền được chủ ý tính là tác vụ thường, giống Làm sạch giọng nói: mặc định 5 mỗi ngày với khách, 30 với tài khoản miễn phí, 300 với Premium và 700 với Pro. (Tách hoặc loại bỏ giọng hát thì khác: mỗi lần là một tác vụ AI.) Độ dài bị giới hạn ở 5 phút với khách và 20 phút với tài khoản miễn phí; giới hạn hiện hành có trên /pricing.',
        },
        {
          question: 'Nếu bản ghi vốn đã khá sạch thì sao?',
          answer: 'Mô hình vẫn chạy và sẽ loại bỏ phần nền còn sót lại mà nó tìm thấy, nhưng khác biệt nghe được sẽ nhỏ và bạn có thể thích bản gốc chưa xử lý hơn. Hãy so sánh hai bản trước khi thay thế bất cứ thứ gì.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Khử nhiễu dùng hạn mức tác vụ thường; giới hạn độ dài tùy theo gói của bạn và được hiển thị trực tiếp trong biểu mẫu.',
        ],
      },
      related: [
        {
          label: 'Làm sạch âm thanh giọng nói',
          to: '/tools/clean-voice-audio',
          description: 'Cùng bộ khử nhiễu, kèm tinh chỉnh độ lớn và âm sắc cho lời nói.',
        },
        {
          label: 'Tách âm thanh khỏi video',
          to: '/tools/extract-audio-from-video',
          description: 'Lấy track âm thanh ra khỏi video trước.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Đặt lại track đã khử nhiễu dưới video.',
        },
        {
          label: 'Chuyển video thành văn bản',
          to: '/tools/transcribe-video',
          description: 'Chép lời phần âm thanh sạch hơn để làm phụ đề.',
        },
        {
          label: 'Loại bỏ giọng hát khỏi bài hát',
          to: '/tools/remove-vocals-from-song',
          description: 'Tách giọng hát khỏi nhạc bằng một mô hình khác.',
        },
      ],
      embed: {
        title: 'Loại bỏ tiếng ồn nền',
        description: 'Tải bản ghi âm lên. Loại bỏ tiếng ồn nền đã được chọn sẵn cho bạn. Bạn vẫn có thể đổi định dạng đầu ra, rồi chuyển đổi.',
      },
    },
    'remove-vocals-from-song': {
      name: 'Loại bỏ giọng hát khỏi bài hát',
      h1: 'Loại bỏ giọng hát khỏi bài hát để có bản nhạc nền hoặc karaoke',
      tagline: 'Loại bỏ giọng hát khỏi bản nhạc và giữ lại phần nhạc, dùng cho karaoke, luyện tập và nhạc nền. Chỉ dùng với nhạc mà bạn có quyền.',
      metaTitle: 'Loại bỏ giọng hát khỏi bài hát: Tạo nhạc karaoke | Media Manipulator',
      metaDescription: 'Loại bỏ giọng hát khỏi bài hát bằng AI và tải bản nhạc nền về cùng định dạng với tệp của bạn, hoặc FLAC hoặc WAV. Bản karaoke và bản luyện tập, trên GPU của chúng tôi. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Loại bỏ giọng hát khỏi bài hát để làm karaoke',
      ogDescription: 'Loại bỏ tiếng hát khỏi bài hát bằng AI và tải bản nhạc nền về dạng MP3, FLAC hoặc WAV.',
      intro: 'Những buổi tối karaoke, luyện hát và thu bản cover đều cần ban nhạc mà không có ca sĩ. Trang này đưa bài hát qua Demucs (mô hình htdemucs) trên GPU của chúng tôi ở chế độ hai stem, tách bản phối thành "giọng hát" và "mọi thứ còn lại", rồi trả về stem mọi thứ còn lại. Bản nhạc nền mặc định trả về cùng định dạng với tệp của bạn, nên một tệp MP3 320 kbps vẫn là MP3 320 kbps thay vì phình to thành WAV; FLAC và WAV luôn sẵn sàng khi bạn muốn một tệp không mất dữ liệu để chỉnh sửa.',
      whatItDoes: [
        'Chạy Demucs htdemucs với --two-stems=vocals, nên mô hình chỉ ước tính hai phần: giọng hát chính và phần đệm.',
        'Giữ stem no_vocals và bỏ stem giọng hát; kết quả là một tệp stereo đã loại bỏ tiếng hát.',
        'Quy "Giống tệp gốc" về một định dạng cụ thể khi tải lên: MP3 vẫn là MP3, AAC/M4A vẫn là AAC/M4A, OGG và Opus giữ nguyên, còn đầu vào WAV, FLAC, AIFF hoặc ALAC trả về dạng FLAC.',
        'Ghi stem MP3 và AAC ở 320 kbps thay vì 192 kbps như các công cụ âm thanh khác, để bước mã hóa không thêm suy hao nghe thấy được lên trên quá trình tách.',
        'Hiển thị dung lượng đầu ra ước tính cho từng lựa chọn định dạng trước khi bạn bắt đầu, dựa trên độ dài tệp của bạn.',
      ],
      flowSteps: [
        {
          title: 'Tải bài hát lên',
          description: 'Một bản nhạc bạn sở hữu hoặc được cấp phép sử dụng, ở dạng MP3, WAV, FLAC, M4A, AAC, OGG hoặc Opus.',
        },
        {
          title: 'Loại bỏ giọng hát được đặt sẵn',
          description: 'Thao tác được cố định; "Định dạng đầu ra" mặc định là Giống tệp gốc, với MP3, FLAC và WAV là các lựa chọn khác.',
        },
        {
          title: 'Demucs tách bản phối',
          description: 'Mô hình xử lý bài hát theo từng đoạn 7 giây trên GPU của chúng tôi và ghi ra vocals.wav và no_vocals.wav.',
        },
        {
          title: 'Mã hóa và tải xuống',
          description: 'Stem no_vocals được mã hóa theo định dạng đã xác định và sẵn sàng để tải xuống.',
        },
      ],
      advancedDetails: [
        'Lệnh chính xác là demucs -n htdemucs --two-stems=vocals --segment 7; độ dài đoạn giới hạn bộ nhớ GPU và cho phép các bản nhạc dài chạy trên một card duy nhất. Demucs ghi stem stereo 44,1 kHz bất kể tần số lấy mẫu hay số kênh của đầu vào, nên nguồn mono hoặc 48 kHz sẽ trả về dạng stereo 44,1 kHz.',
        'Mã hóa stem là libmp3lame -b:a 320k cho MP3 và aac -b:a 320k cho AAC hoặc M4A; OGG giữ ở 192 kbps, Opus ở 128 kbps, FLAC và WAV không mất dữ liệu. Mọi thao tác âm thanh AI khác dùng 192 kbps; tốc độ 320 kbps chỉ dành riêng cho stem.',
        'Quy tắc "Giống tệp gốc" là: đầu vào mất dữ liệu trả về cùng container, đầu vào không mất dữ liệu trả về FLAC, còn tệp video hoặc bất cứ thứ gì máy chủ không xác định được trả về MP3 ở 320 kbps. Tệp .m4a được kiểm tra bằng ffprobe trước khi quyết định, vì nó có thể chứa ALAC không mất dữ liệu thay vì AAC.',
        'Quy tắc này ra đời từ một tác vụ có thật: một tệp MP3 87 phút, 68 MB từng trả về thành tệp WAV 880 MB. PCM không thêm được độ trung thực mà một nguồn mất dữ liệu chưa từng có, nên giờ đây mặc định không bao giờ phóng to âm thanh mất dữ liệu thành WAV; việc chủ động chọn WAV vẫn được đáp ứng.',
        'Việc tách không bao giờ hoàn hảo. Đuôi tiếng vang của giọng hát, bè hòa âm và bất cứ thứ gì mô hình nghe như "giống giọng người" (một số tiếng synth lead, tiếng huýt sáo) có thể lọt vào bản nhạc nền, và các bản phối dày đặc tách kém hơn các bản sản xuất hiện đại, thoáng.',
        'Biểu mẫu cảnh báo khi lựa chọn WAV sẽ vượt quá 500 MB, vì WAV 44,1 kHz stereo 16-bit là 176.400 byte mỗi giây, khoảng 10,6 MB mỗi phút.',
      ],
      whyItMatters: [
        'Hầu hết bài hát không có bản nhạc nền chính thức, và các bản backing track có bản quyền thường được thu âm lại thay vì giữ bản phối gốc.',
        'Ca sĩ luyện tập với bản phối thật hiệu quả hơn nhiều so với một bản mô phỏng MIDI.',
        'Trả stem về đúng định dạng đầu vào giúp một tệp cỡ điện thoại vẫn giữ cỡ điện thoại; một tệp MP3 10 MB không nên vô tình thành bản tải xuống 50 MB.',
      ],
      useCases: [
        {
          title: 'Karaoke tại nhà',
          description: 'Tạo phiên bản hát theo của một bài hát bạn đã sở hữu.',
        },
        {
          title: 'Luyện thanh',
          description: 'Tập phần của bạn trên nền ban nhạc gốc mà không có giọng ca chính bên tai.',
        },
        {
          title: 'Cover và remix',
          description: 'Dùng bản nhạc nền làm nền cho phần thu giọng của riêng bạn.',
        },
        {
          title: 'Nhạc nền cho video',
          description: 'Lấy một nền nhạc không lời từ nhạc bạn được cấp phép sử dụng cho dự án Darkroom.',
        },
      ],
      workedExamples: [
        {
          title: 'Tệp MP3 320 kbps dài 4 phút (khoảng 9,6 MB) với Giống tệp gốc',
          body: 'Ở 320 kbps, một tệp MP3 chiếm 40 KB mỗi giây, nên 240 giây là khoảng 9,6 MB, nằm thoải mái trong giới hạn cho khách là 5 phút và 200 MB. Định dạng được xác định là MP3 vì đầu vào là MP3. Demucs xử lý bài hát theo các cửa sổ 7 giây trên GPU của chúng tôi và ghi một tệp no_vocals.wav stereo 44,1 kHz khoảng 42 MB vào thư mục nháp, sau đó ffmpeg mã hóa bằng libmp3lame ở 320 kbps: bản nhạc nền lại khoảng 9,6 MB. Tệp WAV nháp bị xóa. Lượt tách chiếm phần lớn thời gian chạy và tăng theo độ dài bản nhạc.',
        },
        {
          title: 'Tệp WAV chất lượng CD dài 4 phút 50 giây (khoảng 51 MB), FLAC mặc định hoặc chọn WAV',
          body: 'Một tệp WAV stereo 16-bit 44,1 kHz là 176.400 byte mỗi giây, nên 290 giây là khoảng 51 MB, vẫn trong giới hạn 5 phút cho khách. Vì đầu vào không mất dữ liệu, Giống tệp gốc được xác định là FLAC: biểu mẫu ước tính tệp FLAC khoảng 55 phần trăm kích thước PCM, khoảng 28 MB, và con số thực tế tùy vào bản nhạc. Chọn WAV thay vào đó sẽ trả stem về dạng PCM 16-bit khoảng 51 MB, bằng kích thước đầu vào; chọn MP3 cho khoảng 11,6 MB ở 320 kbps. Cả ba đều từ cùng một stem no_vocals, chỉ khác bộ mã hóa.',
        },
      ],
      whenNotToUse: 'Đừng dùng công cụ này với nhạc bạn không sở hữu hoặc không có giấy phép; bạn chịu trách nhiệm về cách sử dụng kết quả. Đây cũng là công cụ không phù hợp khi bạn muốn giữ ca sĩ thay vì ban nhạc (đó là thao tác tách giọng hát trong cùng biểu mẫu), khi bạn cần tách bốn phần thành trống, bass và các nhạc cụ khác (trang này chỉ tạo ra giọng hát và phần đệm), hoặc khi bản ghi là lời nói thay vì tiếng hát, vốn được các trang Làm sạch giọng nói và tiếng ồn nền xử lý tốt hơn. Các bản thu mono rất cũ và bản thu lén buổi diễn trực tiếp có giọng hát lọt vào mọi micro sẽ tách kém, nên hãy chờ đợi những tiếng vọng mờ nghe thấy được ở đó.',
      whyMediaManipulator: [
        'Việc tách chạy trên GPU do chúng tôi vận hành với mô hình Demucs htdemucs; nhạc của bạn không được gửi đến dịch vụ tách stem bên ngoài.',
        'Mặc định đầu ra theo tệp của bạn, với stem MP3 hoặc AAC được mã hóa ở 320 kbps, và FLAC hoặc WAV chỉ cách một cú nhấp.',
        'Dung lượng ước tính cho từng định dạng được hiển thị trước khi bạn bắt đầu, nên một tệp WAV quá lớn là lựa chọn của bạn, không phải điều bất ngờ.',
      ],
      privacyNote: 'Bài hát của bạn được lưu trong thư mục tác vụ và chuyển cho Demucs trên GPU của chính chúng tôi, mô hình này ghi stem giọng hát và stem phần đệm vào thư mục nháp; chỉ phần đệm được mã hóa thành tệp tải xuống của bạn, và thư mục nháp (kể cả stem giọng hát bị bỏ đi) bị xóa khi tác vụ kết thúc. Bản nhạc nền đã mã hóa được giữ cùng tác vụ. Tệp âm thanh tải lên cũng đi qua một bước phân tích tự động trên máy chủ của chúng tôi, bước này chép lời tệp bằng Whisper cho một lượt rà soát nội bộ được giữ cùng tác vụ. Không có nhà cung cấp AI bên thứ ba nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Mọi dấu vết của ca sĩ có biến mất hết không?',
          answer: 'Phần lớn giọng hát chính, nhưng hiếm khi là toàn bộ. Đuôi tiếng vang, giọng hát lồng đôi và bè hòa âm, cùng những âm thanh mô hình nghe như giống giọng người có thể còn lại ở mức nhỏ. Các bản sản xuất stereo hiện đại tách tốt nhất; bản thu mono hoặc bản thu trực tiếp bị lọt tiếng nhiều tách kém nhất.',
        },
        {
          question: 'Bản nhạc nền có định dạng và tần số lấy mẫu gì?',
          answer: 'Demucs ghi stem stereo 44,1 kHz, nên đó là tần số của mọi đầu ra. Container mặc định theo tệp của bạn: vào MP3, ra MP3 ở 320 kbps; vào AAC hoặc M4A, ra cùng định dạng ở 320 kbps; vào WAV, FLAC, AIFF hoặc ALAC, ra FLAC. Bạn cũng có thể chủ động chọn MP3, FLAC hoặc WAV.',
        },
        {
          question: 'Vì sao mặc định không còn là WAV?',
          answer: 'Vì một tệp MP3 87 phút dung lượng 68 MB từng trả về thành tệp WAV 880 MB, và PCM không thể khôi phục chi tiết mà nguồn mất dữ liệu chưa từng có. Giờ đây stem giữ nguyên định dạng đầu vào, với stem mất dữ liệu được ghi ở 320 kbps để lần mã hóa thêm không nghe thấy được. WAV vẫn có sẵn nếu bạn yêu cầu.',
        },
        {
          question: 'Tôi có thể lấy riêng giọng hát thay vì phần nhạc nền không?',
          answer: 'Có, hãy chọn Tách giọng hát trong menu thao tác của bộ chuyển đổi âm thanh; thao tác này giữ stem vocals.wav từ cùng lượt chạy Demucs hai stem và bỏ phần đệm.',
        },
        {
          question: 'Tôi có thể tải lên video ca nhạc thay vì tệp âm thanh không?',
          answer: 'Hãy tải lên phần âm thanh: tách track khỏi video trước. Nếu một tệp video vẫn đến được thao tác này, máy chủ sẽ quy Giống tệp gốc thành MP3 ở 320 kbps, vì container video không phải định dạng âm thanh.',
        },
        {
          question: 'Mỗi ngày tôi có thể tách miễn phí bao nhiêu bài hát?',
          answer: 'Mỗi bài hát là một tác vụ AI: mặc định 3 mỗi ngày khi không có tài khoản, 10 với tài khoản miễn phí, 100 với Premium và 200 với Pro. Hạn mức tác vụ AI được tính riêng, nên việc tách bài hát không ảnh hưởng đến hạn mức tác vụ thường của bạn. Bài hát bị giới hạn 5 phút với khách và 20 phút với tài khoản miễn phí, 2 giờ với các gói trả phí; /pricing có bảng hiện hành.',
        },
        {
          question: 'Tạo bản karaoke theo cách này có hợp pháp không?',
          answer: 'Chỉ khi từ nhạc bạn sở hữu, được cấp phép sử dụng, hoặc được phép dùng theo một ngoại lệ tại nơi bạn sống. Công cụ không kiểm tra quyền; bạn chịu trách nhiệm về kết quả và cách bạn phân phối nó.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Loại bỏ giọng hát dùng hạn mức tác vụ AI; hạn mức này và giới hạn độ dài tùy theo gói của bạn và được hiển thị trực tiếp trong biểu mẫu.',
        ],
      },
      related: [
        {
          label: 'Tách âm thanh khỏi video',
          to: '/tools/extract-audio-from-video',
          description: 'Lấy âm thanh ra khỏi video ca nhạc trước khi tách.',
        },
        {
          label: 'Làm sạch âm thanh giọng nói',
          to: '/tools/clean-voice-audio',
          description: 'Với bản ghi lời nói, hãy dùng mô hình tăng cường giọng nói.',
        },
        {
          label: 'Loại bỏ tiếng ồn nền',
          to: '/tools/remove-background-noise',
          description: 'Giảm tạp âm ổn định trong bản ghi mà không cần tách.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: 'Dùng bản nhạc nền làm nền nhạc trong bản dựng video.',
        },
        {
          label: 'Chuyển video thành văn bản',
          to: '/tools/transcribe-video',
          description: 'Lấy lời bài hát dạng văn bản từ bản phối gốc.',
        },
      ],
      embed: {
        title: 'Loại bỏ giọng hát khỏi bài hát',
        description: 'Tải bài hát lên. Loại bỏ giọng hát đã được chọn sẵn, và bản nhạc nền trả về cùng định dạng với tệp của bạn (MP3 vẫn là MP3); chọn FLAC hoặc WAV trong Định dạng đầu ra để có tệp không mất dữ liệu. Nhấn chuyển đổi.',
      },
    },

    // 2026-10-31 (MM92): name + tagline for every remaining tool, so the /tools catalog
    // and the home grid never show an English card in this locale. Model-written; native review pending.
    'transcode-to-dash': {
      name: 'Chuyển mã video sang DASH (AV1 / VP9)',
      h1: 'Chuyển mã video sang DASH AV1 hoặc VP9 trực tuyến',
      tagline: 'Đóng gói mọi video thành gói MPEG-DASH gồm manifest.mpd và các phân đoạn init/media theo từng độ phân giải.',
      metaTitle: 'Chuyển mã video sang DASH AV1/VP9 trực tuyến | Công cụ MPEG-DASH miễn phí',
      metaDescription: 'Công cụ chuyển mã MPEG-DASH trực tuyến miễn phí. Chuyển MP4, MOV, WebM, MKV thành gói DASH với video AV1 hoặc VP9, kèm phụ đề và storyboard tùy chọn.',
      ogTitle: 'Chuyển mã video sang DASH AV1/VP9 trực tuyến',
      ogDescription: 'Tạo gói DASH thích ứng (manifest.mpd + phân đoạn init/media cho từng phiên bản) từ mọi video, miễn phí, ngay trong trình duyệt của bạn.',
      intro: 'MPEG-DASH là chuẩn phát trực tuyến thích ứng mở được mọi trình duyệt hiện đại hỗ trợ. Media Manipulator chuyển mã video nguồn của bạn thành một gói DASH VOD (manifest.mpd cùng các phân đoạn init.mp4 và .m4s cho từng phiên bản) bằng AV1 (tệp nhỏ hơn, tốt nhất cho trình phát web mới) hoặc VP9 (hỗ trợ phát rộng hơn). Thả thư mục đã giải nén lên bất kỳ CDN hoặc máy chủ gốc nào và phục vụ manifest.mpd cho người xem. Gói miễn phí bao gồm 360p, 480p và 720p.',
      whatItDoes: [
        'Dò nguồn của bạn bằng ffprobe và hiển thị độ phân giải, FPS, thời lượng, codec và trạng thái âm thanh.',
        'Cho phép bạn chọn bậc chất lượng nào cần mã hóa và xuất AV1 hay VP9.',
        'Tự động phát hiện bộ mã hóa AV1 tốt nhất hiện có (av1_nvenc → libsvtav1 → libaom-av1).',
        'Tạo manifest.mpd MPEG-DASH tham chiếu đến từng Representation video, cùng một Representation âm thanh AAC khi có âm thanh.',
        'Tùy chọn tạo phụ đề WebVTT và ảnh thu nhỏ storyboard cho thanh tua.',
        'Đóng gói kết quả thành media-manipulator-dash-<codec>-<jobID>.tar.gz kèm report.json và README.',
        'Tải tệp tarball lên S3 và trả lại cho bạn một URL GET được ký sẵn, có thời hạn ngắn.',
      ],
      flowSteps: [
        {
          title: 'Tải lên',
          description: 'PUT được ký sẵn trực tiếp lên S3: tệp của bạn không bao giờ đi qua máy chủ API.',
        },
        {
          title: 'Dò nguồn',
          description: 'ffprobe đọc độ phân giải, FPS, việc có âm thanh hay không và siêu dữ liệu codec.',
        },
        {
          title: 'Chọn bậc và codec',
          description: 'Chọn AV1 hoặc VP9 và bất kỳ tổ hợp nào của 360p/480p/720p.',
        },
        {
          title: 'Mã hóa',
          description: 'AV1 (svtav1/libaom/nvenc) hoặc libvpx-vp9 với phân đoạn 2 giây.',
        },
        {
          title: 'Đóng gói',
          description: 'manifest.mpd cùng phần init/phân đoạn của từng phiên bản được nén thành tar.gz kèm report.json và README.',
        },
        {
          title: 'Tải xuống',
          description: 'URL GET S3 được ký sẵn, có hiệu lực trong 30 phút.',
        },
      ],
      advancedDetails: [
        'Khi chọn bộ mã hóa AV1, hệ thống ưu tiên av1_nvenc (GPU) nếu có, rồi chuyển sang libsvtav1, sau đó là libaom-av1.',
        'VP9 dùng libvpx-vp9 với row-mt, giải mã song song khung hình, và điều khiển bằng CRF kết hợp bitrate.',
        'Các biến thể DASH được xuất với -seg_duration 2 -use_template 1 -use_timeline 0 -single_file 0.',
        'manifest.mpd khai báo một AdaptationSet cho mỗi loại nội dung (video và âm thanh nếu có) với thuộc tính codecs "av01.0.08M.08" / "vp09.00.51.08" / "mp4a.40.2".',
        'Không phóng to: các bậc cao hơn độ phân giải nguồn bị tắt kèm chú thích giải thích.',
      ],
      whyItMatters: [
        'AV1 thường giảm một nửa bitrate ở chất lượng tương đương so với H.264.',
        'DASH là định dạng phát trực tuyến thích ứng phổ biến nhất ngoài hệ sinh thái Apple.',
        'VOD được đóng gói sẵn giúp tránh chi phí chuyển mã theo từng yêu cầu trên các nền tảng phát trực tuyến.',
      ],
      useCases: [
        {
          title: 'Trình phát web hiện đại',
          description: 'Shaka Player và dash.js đọc trực tiếp manifest.mpd.',
        },
        {
          title: 'Phân phối tiết kiệm băng thông',
          description: 'AV1 chỉ tốn gần một nửa dung lượng so với một gói HLS H.264.',
        },
        {
          title: 'Thư viện phương tiện nội bộ',
          description: 'Tự lưu trữ video thích ứng mà không phải trả tiền cho nền tảng phát trực tuyến SaaS.',
        },
        {
          title: 'Kiểm tra chất lượng',
          description: 'So sánh A/B bản mã hóa AV1 và VP9 cạnh nhau từ cùng một nguồn.',
        },
      ],
      whyMediaManipulator: [
        'Chạy trên máy chủ của chính chúng tôi: không nhà cung cấp dịch vụ chuyển mã bên thứ ba nào nhìn thấy video của bạn.',
        'AV1 được chọn mặc định vì AV1 là tương lai của phát trực tuyến thích ứng chất lượng cao.',
        'Định dạng gói mở: chỉ cần giải nén tệp .tar.gz và lưu trữ manifest.mpd.',
      ],
      privacyNote: 'Video của bạn được FFmpeg đọc một lần, mã hóa thành các phiên bản AV1 hoặc VP9 và chia thành các phân đoạn DASH kèm manifest, tất cả trên máy chủ của chúng tôi. Công việc chạy trên máy chủ của chính chúng tôi, không phải dịch vụ chuyển mã bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp nguồn của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'AV1 hay VP9: tôi nên chọn cái nào?',
          answer: 'AV1 cho tệp nhỏ hơn ở chất lượng tương đương, nhưng mã hóa chậm hơn trên máy chỉ có CPU. VP9 được hỗ trợ phát rộng hơn và mã hóa nhanh hơn. AV1 là mặc định.',
        },
        {
          question: 'Máy chủ của tôi báo AV1 không khả dụng?',
          answer: 'AV1 cần một trong các bộ mã hóa av1_nvenc (GPU NVIDIA), libsvtav1 hoặc libaom-av1 trong FFmpeg. Hãy kiểm tra /api/video-transcode/capabilities để biết bản cài đặt của bạn có những gì.',
        },
        {
          question: 'Âm thanh có luôn là AAC không?',
          answer: 'Có. AdaptationSet âm thanh của DASH hiện xuất AAC LC ở 128 kbps để tương thích tối đa, bất kể codec của nguồn.',
        },
        {
          question: 'Tôi có thể phục vụ manifest này từ một nguồn gốc khác (cross-origin) không?',
          answer: 'Có, nhưng CDN hoặc máy chủ gốc của bạn cần đúng header CORS cho các tệp .mpd, init.mp4 và .m4s. Tệp tarball không kèm các header đó.',
        },
        {
          question: 'URL tải xuống dùng được bao lâu?',
          answer: 'URL GET được ký sẵn mặc định có hiệu lực 30 phút. Hãy chạy lại lượt chuyển mã nếu bạn cần liên kết mới.',
        },
      ],
      related: [
        {
          label: 'Chuyển mã video sang HLS',
          to: '/tools/transcode-to-hls',
          description: 'Cùng cách tải lên, nhưng xuất gói Apple HLS với H.264 + AAC.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Thu nhỏ tệp MP4 bằng quy trình FFmpeg thông thường.',
        },
        {
          label: 'Chuyển video thành văn bản',
          to: '/tools/transcribe-video',
          description: 'Trích lời nói trong video thành văn bản có thể tìm kiếm.',
        },
      ],
      embed: {
        title: 'Chuyển mã video sang DASH (AV1 / VP9)',
        description: 'Tải lên MP4/MOV/WebM/MKV. Chúng tôi dò nguồn bằng ffprobe, cho bạn chọn các bậc chất lượng miễn phí (360p/480p/720p), rồi mã hóa AV1 (mặc định) hoặc VP9 bằng ffmpeg và đóng gói thành tệp tar.gz kèm manifest.mpd để bạn tải xuống.',
      },
    },
    'convert-webp-to-jpg': {
      name: 'Chuyển WebP sang JPG',
      h1: 'Chuyển WebP sang JPG trực tuyến',
      tagline: 'Biến ảnh WebP thành tệp JPG tương thích rộng rãi, mở được trong mọi trình xem và chỉnh sửa ảnh.',
      metaTitle: 'Chuyển WebP sang JPG trực tuyến (miễn phí) | Media Manipulator',
      metaDescription: 'Công cụ chuyển WebP sang JPG trực tuyến miễn phí. Nhanh chóng biến ảnh .webp thành tệp JPG tương thích mọi nơi với chất lượng bạn chọn.',
      ogTitle: 'Chuyển WebP sang JPG trực tuyến',
      ogDescription: 'Biến ảnh WebP thành tệp JPG tương thích mọi nơi chỉ với vài cú nhấp.',
      intro: 'WebP rất tốt cho web, nhưng phần mềm cũ, công cụ trình chiếu và máy in thường không đọc được định dạng này. Media Manipulator chuyển WebP trở lại JPG để bạn dùng ảnh ở bất cứ đâu. Hãy chọn chất lượng bạn muốn, phần còn lại để chúng tôi lo.',
      whatItDoes: [
        'Chuyển mọi ảnh .webp (ảnh tĩnh hoặc khung hình của ảnh động) sang tệp .jpg tiêu chuẩn.',
        'Cho phép bạn chọn chất lượng JPG: chất lượng càng cao, tệp càng lớn.',
        'Làm phẳng vùng trong suốt lên màu nền bạn chọn (JPG không có kênh alpha).',
        'Giữ nguyên hồ sơ màu khi có thể.',
      ],
      flowSteps: [
        {
          title: 'Tải WebP lên',
          description: 'Thả một tệp .webp từ máy tính của bạn.',
        },
        {
          title: 'Chọn chất lượng JPG',
          description: '85 là mức mặc định tốt; hạ thấp hơn để có tệp nhỏ hơn.',
        },
        {
          title: 'Mã hóa JPG',
          description: 'ImageMagick mã hóa lại ảnh với chất lượng đã chọn.',
        },
        {
          title: 'Tải JPG xuống',
          description: 'Lưu một tệp .jpg tương thích mọi nơi.',
        },
      ],
      advancedDetails: [
        'Chất lượng 85 là điểm cân bằng đã được dùng từ lâu: mọi mức trên ~92 chủ yếu chỉ làm tăng dung lượng tệp mà hình ảnh hầu như không đẹp hơn.',
        'JPG không hỗ trợ độ trong suốt, nên ảnh WebP trong suốt sẽ bị làm phẳng. Nếu cần giữ độ trong suốt, hãy chuyển sang PNG.',
        'Để chuyển đổi ảnh không mất dữ liệu hoặc chuyển WebP động, hãy ưu tiên PNG (ảnh tĩnh) hoặc GIF động.',
      ],
      whyItMatters: [
        'Một số trình duyệt cũ, trình chỉnh sửa ảnh và phần mềm nhúng vẫn chưa hỗ trợ WebP.',
        'Nhiều máy in, ki-ốt in ảnh và công cụ trình chiếu yêu cầu JPG hoặc PNG.',
        'Trên thực tế, JPG là định dạng tiêu chuẩn để trao đổi ảnh chụp.',
      ],
      useCases: [
        {
          title: 'Gửi ảnh cho khách hàng',
          description: 'Đảm bảo người nhận mở được tệp trên mọi thiết bị.',
        },
        {
          title: 'Chèn vào bài trình chiếu',
          description: 'Slide PowerPoint/Keynote nhận JPG ở mọi nơi; còn WebP thì lúc được lúc không.',
        },
        {
          title: 'In ấn và tiệm rửa ảnh',
          description: 'Hầu hết tiệm rửa ảnh chỉ nhận JPG.',
        },
        {
          title: 'Gửi ảnh lên trang ảnh stock',
          description: 'Nhiều trang ảnh stock yêu cầu tải lên JPG.',
        },
      ],
      whyMediaManipulator: [
        'Không hình mờ, không cần đăng ký, miễn phí cho nhu cầu thông thường.',
        'Tinh chỉnh chất lượng và mức nén chính xác, thay vì một thiết lập sẵn áp dụng cho mọi trường hợp.',
        'Cùng mô hình quyền riêng tư và thời gian lưu như các công cụ khác.',
      ],
      privacyNote: 'Ảnh WebP của bạn được giải mã và mã hóa lại thành JPG trên máy chủ của chúng tôi; vùng trong suốt bị làm phẳng vì JPG không lưu được độ trong suốt. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp gốc không bao giờ bị thay đổi: bạn tải xuống một tệp mới.',
      faq: [
        {
          question: 'Còn độ trong suốt thì sao?',
          answer: 'JPG không hỗ trợ độ trong suốt. Ảnh WebP trong suốt được làm phẳng lên màu nền đã chọn. Nếu cần giữ độ trong suốt, hãy chuyển sang PNG.',
        },
        {
          question: 'Tôi nên dùng mức chất lượng nào?',
          answer: '85 là mức mặc định cân bằng. Dùng từ 90 trở lên cho ảnh mà chất lượng quan trọng nhất, 70 cho ảnh thu nhỏ hoặc bản xem trước.',
        },
        {
          question: 'Có dùng được với WebP động không?',
          answer: 'Chỉ khung hình đầu tiên trở thành JPG. Với WebP động, hãy chuyển sang GIF động.',
        },
        {
          question: 'Tôi có thể chuyển đổi hàng loạt nhiều tệp không?',
          answer: 'Công cụ miễn phí xử lý từng tệp một. Hiện tại, hãy chuyển đổi từng tệp WebP riêng lẻ.',
        },
      ],
      related: [
        {
          label: 'Chuyển WebP sang PNG',
          to: '/tools/convert-webp-to-png',
          description: 'Giữ độ trong suốt với một tệp PNG không mất dữ liệu.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa JPG, PNG, WebP, AVIF và GIF.',
        },
        {
          label: 'Nén ảnh',
          to: '/tools/compress-image',
          description: 'Giảm dung lượng tệp JPG hơn nữa.',
        },
        {
          label: 'Xóa siêu dữ liệu EXIF',
          to: '/tools/remove-exif-metadata',
          description: 'Loại bỏ siêu dữ liệu riêng tư trước khi chia sẻ ảnh JPG.',
        },
        {
          label: 'Hướng dẫn bộ chuyển đổi ảnh',
          to: '/tutorials/image/getting-started',
          description: 'Hướng dẫn từng bước cho mọi tùy chọn ảnh.',
        },
      ],
      embed: {
        title: 'Chuyển WebP sang JPG',
        description: 'Tải lên một ảnh WebP và chọn JPG làm định dạng đầu ra. Điều chỉnh thanh trượt chất lượng để cân bằng giữa dung lượng tệp và chất lượng ảnh. JPG bỏ độ trong suốt, nên hãy dùng PNG nếu ảnh của bạn có nền trong suốt.',
      },
    },
    'convert-png-to-jpg': {
      name: 'Chuyển PNG sang JPG',
      h1: 'Chuyển PNG sang JPG trực tuyến miễn phí',
      tagline: 'Biến ảnh chụp màn hình và đồ họa PNG dung lượng lớn thành ảnh JPG nhỏ gọn, tương thích mọi nơi chỉ trong vài giây.',
      metaTitle: 'Chuyển PNG sang JPG trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển PNG sang JPG trực tuyến miễn phí. Biến tệp .png thành ảnh JPG nhỏ hơn, tương thích mọi nơi với chất lượng bạn chọn. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển PNG sang JPG trực tuyến miễn phí',
      ogDescription: 'Biến ảnh PNG thành tệp JPG nhỏ hơn, tương thích mọi nơi. Miễn phí, nhanh, không cần đăng ký.',
      intro: 'PNG là định dạng không mất dữ liệu, rất phù hợp cho ảnh chụp màn hình và đồ họa, nhưng với ảnh chụp thì thường lớn hơn nhiều so với mức cần thiết. Chuyển PNG sang JPG có thể giảm dung lượng tệp 5–10 lần mà không có khác biệt nào nhìn thấy được với nội dung ảnh chụp. Media Manipulator chuyển PNG của bạn thành tệp JPG sạch với chất lượng bạn chọn: miễn phí, trực tuyến và không cần đăng ký.',
      whatItDoes: [
        'Chuyển mọi ảnh .png sang tệp .jpg (JPEG) tiêu chuẩn.',
        'Cho phép bạn chọn chất lượng JPG để cân bằng giữa dung lượng tệp và độ trung thực.',
        'Làm phẳng vùng trong suốt lên một nền đồng màu, vì JPG không có kênh alpha.',
        'Các pixel bạn thấy vẫn giữ nguyên; chỉ tệp được mã hóa lại từ PNG sang JPG.',
      ],
      flowSteps: [
        {
          title: 'Tải PNG lên',
          description: 'Thả vào một ảnh chụp màn hình, đồ họa hoặc ảnh chụp .png.',
        },
        {
          title: 'Chọn chất lượng JPG',
          description: '85 là mức mặc định cân bằng; hạ xuống để có tệp nhỏ hơn.',
        },
        {
          title: 'Mã hóa JPG',
          description: 'ImageMagick mã hóa lại ảnh của bạn thành JPEG.',
        },
        {
          title: 'Tải JPG xuống',
          description: 'Lưu một tệp .jpg nhỏ hơn, tương thích mọi nơi.',
        },
      ],
      advancedDetails: [
        'Chất lượng 85 là điểm tối ưu được dùng từ lâu: trên ~92, bạn chủ yếu chỉ tăng dung lượng tệp mà khác biệt nhìn thấy được rất ít.',
        'Một tệp PNG ảnh chụp thường giảm từ vài megabyte xuống còn vài trăm kilobyte khi chuyển thành JPG.',
        'Với đồ họa có cạnh sắc hoặc chữ, PNG hoặc WebP thường trông sạch hơn JPG ở cùng dung lượng.',
        'Nếu PNG của bạn có vùng trong suốt cần giữ, hãy chuyển sang WebP: JPG không lưu được kênh alpha.',
      ],
      whyItMatters: [
        'JPG là định dạng ảnh được chấp nhận rộng rãi nhất: mọi thiết bị, trình chỉnh sửa và biểu mẫu tải lên đều nhận.',
        'Tệp JPG nhỏ hơn tải nhanh hơn trên web và không vượt giới hạn tải lên của email và biểu mẫu.',
        'Nhiều tiệm in ảnh, sàn thương mại và trang ảnh stock chỉ nhận JPG.',
      ],
      useCases: [
        {
          title: 'Thu nhỏ ảnh chụp màn hình',
          description: 'Biến ảnh chụp màn hình PNG nặng thành JPG nhẹ để gửi email hoặc chat.',
        },
        {
          title: 'Tải ảnh lên',
          description: 'Chuyển ảnh chụp dạng PNG sang JPG để đáp ứng yêu cầu định dạng của trang web.',
        },
        {
          title: 'In ấn và tiệm rửa ảnh',
          description: 'Hầu hết tiệm rửa ảnh yêu cầu JPG, nên hãy chuyển đổi trước khi đặt in.',
        },
        {
          title: 'Trang web nhanh hơn',
          description: 'Thay ảnh PNG lớn bằng JPG gọn nhẹ để giảm dung lượng trang.',
        },
      ],
      whyMediaManipulator: [
        'Đầu ra được khóa thật sự ở JPG, nên không có gì để cấu hình sai.',
        'Kiểm soát chất lượng chính xác thay vì một thiết lập sẵn áp dụng cho mọi trường hợp.',
      ],
      privacyNote: 'PNG của bạn được mã hóa lại thành JPG với chất lượng bạn đặt, trên máy chủ của chúng tôi, và mọi vùng trong suốt được làm phẳng lên một nền đồng màu. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp gốc không bao giờ bị thay đổi: bạn tải xuống một tệp mới.',
      faq: [
        {
          question: 'Làm sao để chuyển PNG sang JPG miễn phí?',
          answer: 'Tải tệp .png của bạn lên ở phía trên, chọn chất lượng JPG và nhấp chuyển đổi. Tệp tải xuống là một tệp .jpg tiêu chuẩn.',
        },
        {
          question: 'Chuyển PNG sang JPG có làm giảm chất lượng không?',
          answer: 'JPG là định dạng nén có mất dữ liệu, nên chất lượng giảm đi đôi chút. Ở mức chất lượng 85–90, khác biệt là không thể nhận ra với ảnh chụp. Với đồ họa có chữ sắc nét, hãy giữ PNG hoặc dùng WebP.',
        },
        {
          question: 'Vùng trong suốt sẽ ra sao khi tôi chuyển PNG sang JPG?',
          answer: 'JPG không hỗ trợ độ trong suốt, nên các vùng trong suốt được làm phẳng lên một nền đồng màu. Nếu cần giữ độ trong suốt, hãy chuyển PNG sang WebP.',
        },
        {
          question: 'Tại sao PNG của tôi lớn hơn JPG nhiều như vậy?',
          answer: 'PNG không mất dữ liệu và lưu chính xác từng pixel, nên rất nặng với ảnh chụp. JPG dùng kiểu nén dựa trên cảm nhận thị giác, nên ảnh chụp nhỏ đi đáng kể mà gần như không thấy khác biệt.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Vùng trong suốt của PNG được làm phẳng lên một nền đồng màu vì JPG không hỗ trợ độ trong suốt.',
        ],
      },
      related: [
        {
          label: 'Chuyển JPG sang PNG',
          to: '/tools/convert-jpg-to-png',
          description: 'Chuyển theo chiều ngược lại để có tệp PNG hỗ trợ độ trong suốt.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa JPG, PNG, WebP, AVIF và nhiều định dạng khác.',
        },
        {
          label: 'Nén ảnh',
          to: '/tools/compress-image',
          description: 'Thu nhỏ tệp JPG hơn nữa mà không đổi định dạng.',
        },
        {
          label: 'Hướng dẫn bộ chuyển đổi ảnh',
          to: '/tutorials/image/getting-started',
          description: 'Tìm hiểu chi tiết mọi tùy chọn ảnh.',
        },
      ],
      embed: {
        title: 'Chuyển PNG sang JPG',
        description: 'Tải lên một ảnh PNG. Đầu ra của công cụ này được khóa ở JPG: bạn chỉ cần chọn chất lượng và chuyển đổi. Vùng trong suốt được làm phẳng lên một nền đồng màu vì JPG không có kênh alpha.',
      },
    },
    'convert-jpg-to-png': {
      name: 'Chuyển JPG sang PNG',
      h1: 'Chuyển JPG sang PNG trực tuyến miễn phí',
      tagline: 'Biến ảnh JPG thành tệp PNG không mất dữ liệu, sẵn sàng để chỉnh sửa, dùng nền trong suốt và làm đồ họa chất lượng cao.',
      metaTitle: 'Chuyển JPG sang PNG trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển JPG sang PNG trực tuyến miễn phí. Biến ảnh .jpg thành tệp PNG không mất dữ liệu để chỉnh sửa, dùng nền trong suốt và làm đồ họa. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển JPG sang PNG trực tuyến miễn phí',
      ogDescription: 'Biến ảnh JPG thành tệp PNG không mất dữ liệu để chỉnh sửa và làm đồ họa. Miễn phí, nhanh, không cần đăng ký.',
      intro: 'PNG là định dạng không mất dữ liệu, không bao giờ thêm nhiễu nén, nên rất lý tưởng khi bạn bắt đầu chỉnh sửa ảnh, thêm độ trong suốt hoặc xếp lớp đồ họa. Chuyển JPG sang PNG giúp cố định các pixel hiện tại để những lần chỉnh sửa tiếp theo không làm giảm chất lượng. Media Manipulator chuyển JPG của bạn thành tệp PNG sạch, trực tuyến, miễn phí và không cần đăng ký.',
      whatItDoes: [
        'Chuyển mọi ảnh .jpg/.jpeg sang tệp .png không mất dữ liệu.',
        'Giữ nguyên chính xác các pixel hiện tại để chỉnh sửa nhiều lần không thêm nhiễu nén.',
        'Tạo ra tệp PNG mà sau này bạn có thể xếp lớp, tạo mặt nạ hoặc làm trong suốt trong trình chỉnh sửa.',
        'Mọi pixel của JPG được giữ chính xác; PNG lưu chúng mà không mất thêm dữ liệu.',
      ],
      flowSteps: [
        {
          title: 'Tải JPG lên',
          description: 'Thả vào một ảnh .jpg hoặc .jpeg.',
        },
        {
          title: 'Chuyển sang PNG',
          description: 'Chúng tôi mã hóa lại ảnh thành PNG mà không mất dữ liệu.',
        },
        {
          title: 'Mã hóa PNG',
          description: 'ImageMagick ghi ra một tệp PNG 24/32-bit tiêu chuẩn.',
        },
        {
          title: 'Tải PNG xuống',
          description: 'Lưu một tệp .png không mất dữ liệu, sẵn sàng để chỉnh sửa.',
        },
      ],
      advancedDetails: [
        'PNG không mất dữ liệu, nên tệp sau khi chuyển đổi thường lớn hơn tệp JPG gốc; điều đó là bình thường.',
        'Chuyển JPG sang PNG không khôi phục được chi tiết mà JPG đã loại bỏ; việc chuyển đổi chỉ cố định các pixel hiện tại mà không mất thêm dữ liệu.',
        'PNG hỗ trợ kênh alpha, nên kết quả đã sẵn sàng để bạn thêm độ trong suốt trong trình chỉnh sửa.',
        'Để có tệp web không mất dữ liệu nhỏ nhất, WebP (không mất dữ liệu) thường nhỏ hơn PNG.',
      ],
      whyItMatters: [
        'PNG không mất dữ liệu là định dạng làm việc phù hợp khi một ảnh sẽ được chỉnh sửa nhiều lần.',
        'Công cụ thiết kế, tài nguyên ứng dụng và công việc giao diện cần PNG để có cạnh sắc nét và hỗ trợ độ trong suốt.',
        'PNG tránh được hiện tượng chất lượng giảm dần qua mỗi lần lưu lại JPG.',
      ],
      useCases: [
        {
          title: 'Chuẩn bị chỉnh sửa',
          description: 'Chuyển JPG sang PNG trước khi chỉnh sửa ảnh để các thay đổi không làm mất dữ liệu.',
        },
        {
          title: 'Thêm độ trong suốt',
          description: 'Chuẩn bị sẵn một tệp PNG để tách nền.',
        },
        {
          title: 'Tài nguyên giao diện và ứng dụng',
          description: 'Hầu hết hệ thống thiết kế dùng PNG cho biểu tượng và đồ họa.',
        },
        {
          title: 'Chèn vào tài liệu',
          description: 'Dùng PNG khi chữ và nét vẽ sắc nét quan trọng hơn dung lượng tệp.',
        },
      ],
      whyMediaManipulator: [
        'Đầu ra được khóa thật sự ở PNG, nên kết quả luôn không mất dữ liệu.',
        'Chạy trên máy chủ riêng của chúng tôi: ảnh của bạn không được bên thứ ba nào xử lý.',
      ],
      privacyNote: 'JPG của bạn được giải mã trên máy chủ của chúng tôi và ghi ra thành tệp PNG không mất dữ liệu với đúng những pixel đó. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp gốc không bao giờ bị thay đổi: bạn tải xuống một tệp mới.',
      faq: [
        {
          question: 'Làm sao để chuyển JPG sang PNG miễn phí?',
          answer: 'Tải tệp .jpg của bạn lên ở phía trên và nhấp chuyển đổi: đầu ra là một tệp .png không mất dữ liệu. Công cụ miễn phí, không cần đăng ký và dùng ngay trong trình duyệt của bạn.',
        },
        {
          question: 'Chuyển JPG sang PNG có cải thiện chất lượng không?',
          answer: 'Không. Việc chuyển đổi không mất dữ liệu nhưng không thể khôi phục chi tiết mà JPG đã loại bỏ. Nó cố định các pixel hiện tại để những lần chỉnh sửa sau không bị nhiễu nén.',
        },
        {
          question: 'Tệp PNG có lớn hơn tệp JPG của tôi không?',
          answer: 'Thường là có. PNG lưu chính xác từng pixel mà không nén mất dữ liệu, nên ảnh chụp ở dạng PNG thường lớn hơn bản JPG tương đương.',
        },
        {
          question: 'Tôi có thể thêm độ trong suốt sau khi chuyển sang PNG không?',
          answer: 'Có. PNG hỗ trợ kênh alpha, nên khi đã có tệp PNG, bạn có thể xóa hoặc tách nền trong bất kỳ trình chỉnh sửa ảnh nào.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'PNG không mất dữ liệu, nên đầu ra thường lớn hơn tệp JPG gốc.',
        ],
      },
      related: [
        {
          label: 'Chuyển PNG sang JPG',
          to: '/tools/convert-png-to-jpg',
          description: 'Chuyển theo chiều ngược lại và thu nhỏ PNG thành JPG.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa JPG, PNG, WebP, AVIF và nhiều định dạng khác.',
        },
        {
          label: 'Xóa nền ảnh',
          to: '/tools/remove-background-from-image',
          description: 'Tự động tạo ảnh PNG đã tách nền trong suốt.',
        },
        {
          label: 'Hướng dẫn bộ chuyển đổi ảnh',
          to: '/tutorials/image/getting-started',
          description: 'Tìm hiểu chi tiết mọi tùy chọn ảnh.',
        },
      ],
      embed: {
        title: 'Chuyển JPG sang PNG',
        description: 'Tải lên một ảnh JPG. Đầu ra của công cụ này được khóa ở PNG, nên bạn nhận được một tệp không mất dữ liệu, sẵn sàng để chỉnh sửa hoặc xếp lớp trên nền trong suốt.',
      },
    },
    'convert-webp-to-png': {
      name: 'Chuyển WebP sang PNG',
      h1: 'Chuyển WebP sang PNG trực tuyến miễn phí',
      tagline: 'Biến ảnh WebP thành tệp PNG không mất dữ liệu, mở được ở mọi nơi và giữ nguyên độ trong suốt.',
      metaTitle: 'Chuyển WebP sang PNG trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển WebP sang PNG trực tuyến miễn phí. Biến ảnh .webp thành tệp PNG không mất dữ liệu, giữ độ trong suốt và mở được trong mọi trình chỉnh sửa. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển WebP sang PNG trực tuyến miễn phí',
      ogDescription: 'Biến ảnh WebP thành tệp PNG không mất dữ liệu, giữ nguyên độ trong suốt. Miễn phí, nhanh, không cần đăng ký.',
      intro: 'WebP rất tốt cho web, nhưng nhiều trình chỉnh sửa, phần mềm cũ và công cụ thiết kế vẫn cần PNG, và khác với JPG, PNG giữ trọn độ trong suốt. Media Manipulator chuyển WebP của bạn thành tệp PNG sạch, không mất dữ liệu, để tệp mở được ở mọi nơi và kênh alpha vẫn còn nguyên.',
      whatItDoes: [
        'Chuyển mọi ảnh .webp sang tệp .png không mất dữ liệu.',
        'Giữ kênh alpha để ảnh WebP trong suốt vẫn trong suốt.',
        'Tạo ra tệp PNG mở được trong mọi trình chỉnh sửa, trình xem hoặc công cụ thiết kế.',
        'Hình ảnh không thay đổi; cách nén WebP được thay bằng cách lưu PNG không mất dữ liệu.',
      ],
      flowSteps: [
        {
          title: 'Tải WebP lên',
          description: 'Thả vào một tệp .webp, có nền trong suốt hoặc nền đặc.',
        },
        {
          title: 'Chuyển sang PNG',
          description: 'Chúng tôi giải mã WebP và mã hóa lại thành PNG.',
        },
        {
          title: 'Mã hóa PNG',
          description: 'ImageMagick ghi ra một tệp PNG 24/32-bit không mất dữ liệu.',
        },
        {
          title: 'Tải PNG xuống',
          description: 'Lưu một tệp .png giữ nguyên độ trong suốt.',
        },
      ],
      advancedDetails: [
        'Độ trong suốt trong tệp WebP gốc được giữ lại dưới dạng kênh alpha của PNG.',
        'Chỉ khung hình đầu tiên của WebP động trở thành ảnh PNG tĩnh; nếu muốn giữ hoạt ảnh, hãy chuyển sang GIF.',
        'PNG không mất dữ liệu, nên đầu ra thường lớn hơn tệp WebP gốc; đó là cái giá cho khả năng tương thích mọi nơi và lưu trữ không mất dữ liệu.',
      ],
      whyItMatters: [
        'Một số trình chỉnh sửa, công cụ trình chiếu và phần mềm cũ vẫn không mở được WebP.',
        'PNG giữ được độ trong suốt, điều mà JPG không làm được; đây là điểm quan trọng với logo và ảnh tách nền.',
        'PNG là định dạng trao đổi an toàn, không mất dữ liệu cho công việc đồ họa.',
      ],
      useCases: [
        {
          title: 'Mở WebP trong trình chỉnh sửa',
          description: 'Chuyển sang PNG để trình chỉnh sửa không hỗ trợ WebP có thể mở được.',
        },
        {
          title: 'Giữ độ trong suốt',
          description: 'Giữ logo WebP trong suốt thành một tệp PNG trong suốt.',
        },
        {
          title: 'Bàn giao thiết kế',
          description: 'Giao tệp PNG cho công cụ hoặc đồng đội cần tài nguyên PNG.',
        },
        {
          title: 'Bài trình chiếu',
          description: 'Thả tệp PNG vào phần mềm trình chiếu không nhận WebP.',
        },
      ],
      whyMediaManipulator: [
        'Đầu ra được khóa ở PNG và độ trong suốt được giữ tự động.',
        'Chạy trên máy chủ riêng của chúng tôi: ảnh của bạn không được bên thứ ba nào xử lý.',
      ],
      privacyNote: 'WebP của bạn được giải mã trên máy chủ của chúng tôi và lưu thành tệp PNG không mất dữ liệu, giữ nguyên độ trong suốt. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp gốc không bao giờ bị thay đổi: bạn tải xuống một tệp mới.',
      faq: [
        {
          question: 'Làm sao để chuyển WebP sang PNG miễn phí?',
          answer: 'Tải tệp .webp của bạn lên ở phía trên và nhấp chuyển đổi. Tệp tải xuống là một tệp .png không mất dữ liệu, giữ nguyên độ trong suốt. Công cụ miễn phí và không cần đăng ký.',
        },
        {
          question: 'Chuyển WebP sang PNG có giữ độ trong suốt không?',
          answer: 'Có. Nếu WebP của bạn có nền trong suốt, tệp PNG tạo ra giữ nguyên kênh alpha đó.',
        },
        {
          question: 'Tại sao nên chuyển WebP sang PNG thay vì JPG?',
          answer: 'PNG không mất dữ liệu và giữ độ trong suốt, còn JPG làm phẳng độ trong suốt và thêm nén. Hãy chọn PNG khi bạn cần độ trong suốt hoặc đồ họa không mất dữ liệu; chọn JPG để có tệp ảnh chụp nhỏ nhất.',
        },
        {
          question: 'Tôi có thể chuyển đổi WebP động không?',
          answer: 'Chỉ khung hình đầu tiên trở thành PNG. Nếu muốn giữ hoạt ảnh, hãy chuyển WebP sang GIF động.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Độ trong suốt được giữ nguyên. Chỉ khung hình đầu tiên của WebP động được chuyển đổi.',
        ],
      },
      related: [
        {
          label: 'Chuyển PNG sang WebP',
          to: '/tools/convert-png-to-webp',
          description: 'Chuyển theo chiều ngược lại và thu nhỏ PNG thành WebP.',
        },
        {
          label: 'Chuyển WebP sang JPG',
          to: '/tools/convert-webp-to-jpg',
          description: 'Chuyển WebP thành một tệp JPG gọn nhẹ.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa JPG, PNG, WebP, AVIF và nhiều định dạng khác.',
        },
        {
          label: 'Nén ảnh',
          to: '/tools/compress-image',
          description: 'Thu nhỏ ảnh mà không phải bận tâm đổi định dạng.',
        },
      ],
      embed: {
        title: 'Chuyển WebP sang PNG',
        description: 'Tải lên một ảnh WebP. Đầu ra của công cụ này được khóa ở PNG, nên độ trong suốt được giữ nguyên và tệp mở được trong mọi trình chỉnh sửa hoặc trình xem ảnh.',
      },
    },
    'convert-png-to-webp': {
      name: 'Chuyển PNG sang WebP',
      h1: 'Chuyển PNG sang WebP trực tuyến miễn phí',
      tagline: 'Thu nhỏ đồ họa PNG thành tệp WebP hiện đại, tải nhanh hơn trên web và giữ nguyên độ trong suốt.',
      metaTitle: 'Chuyển PNG sang WebP trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển PNG sang WebP trực tuyến miễn phí. Thu nhỏ tệp .png thành ảnh WebP nhẹ hơn để trang web nhanh hơn mà vẫn giữ độ trong suốt. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển PNG sang WebP trực tuyến miễn phí',
      ogDescription: 'Thu nhỏ đồ họa PNG thành tệp WebP nhẹ hơn, giữ nguyên độ trong suốt, để trang web nhanh hơn. Miễn phí, không cần đăng ký.',
      intro: 'WebP là định dạng ảnh hiện đại cho web: tạo ra tệp nhỏ hơn PNG rất nhiều mà vẫn giữ độ trong suốt, nghĩa là trang tải nhanh hơn và chỉ số Core Web Vitals tốt hơn. Media Manipulator chuyển PNG của bạn sang WebP với chất lượng bạn chọn: miễn phí, trực tuyến, giữ nguyên độ trong suốt và không cần đăng ký.',
      whatItDoes: [
        'Chuyển mọi ảnh .png sang tệp .webp hiện đại.',
        'Giữ kênh alpha để ảnh PNG trong suốt vẫn trong suốt.',
        'Cho phép bạn chọn chất lượng để cân bằng giữa dung lượng tệp và độ trung thực.',
        'Thường tạo ra tệp nhỏ hơn 25–80% so với tệp PNG gốc.',
      ],
      flowSteps: [
        {
          title: 'Tải PNG lên',
          description: 'Thả vào một đồ họa, biểu tượng hoặc ảnh chụp màn hình .png.',
        },
        {
          title: 'Chọn chất lượng WebP',
          description: '80–85 là mức mặc định rất tốt cho web.',
        },
        {
          title: 'Mã hóa WebP',
          description: 'ImageMagick mã hóa lại ảnh của bạn thành WebP.',
        },
        {
          title: 'Tải WebP xuống',
          description: 'Lưu một tệp .webp nhỏ hơn, giữ nguyên độ trong suốt.',
        },
      ],
      advancedDetails: [
        'WebP hỗ trợ cả chế độ có mất dữ liệu lẫn không mất dữ liệu; ở chất lượng ~80, tệp thường nhỏ hơn PNG đáng kể mà hình ảnh vẫn sạch.',
        'Độ trong suốt được giữ nguyên, nên logo và tài nguyên giao diện vẫn giữ kênh alpha.',
        'Mọi trình duyệt hiện đại đều hỗ trợ WebP: hãy phục vụ trực tiếp để trang tải nhanh hơn.',
        'Để tương thích tối đa với phần mềm rất cũ, hãy giữ một bản PNG dự phòng.',
      ],
      whyItMatters: [
        'Ảnh nhỏ hơn là yếu tố lớn nhất giúp trang tải nhanh hơn và SEO tốt hơn.',
        'WebP giữ được độ trong suốt, nên bạn không phải đánh đổi kênh alpha lấy dung lượng như với JPG.',
        'Core Web Vitals của Google ưu tiên các trang nhẹ hơn, và WebP giúp ích trực tiếp.',
      ],
      useCases: [
        {
          title: 'Trang web nhanh hơn',
          description: 'Thay tài nguyên PNG nặng bằng WebP để giảm dung lượng trang.',
        },
        {
          title: 'Logo trong suốt',
          description: 'Thu nhỏ logo PNG trong suốt mà vẫn giữ kênh alpha.',
        },
        {
          title: 'Tài nguyên ứng dụng và giao diện',
          description: 'Phát hành đồ họa nhẹ hơn mà không mất độ sắc nét.',
        },
        {
          title: 'Thư viện nhiều ảnh',
          description: 'Chuyển một loạt PNG sang WebP để thư viện ảnh tải nhanh hơn.',
        },
      ],
      whyMediaManipulator: [
        'Đầu ra được khóa ở WebP và giữ nguyên độ trong suốt.',
        'Kiểm soát chất lượng chính xác để bạn tự quyết định cách đánh đổi giữa dung lượng và độ trung thực.',
      ],
      privacyNote: 'PNG của bạn được mã hóa lại thành WebP trên máy chủ của chúng tôi với chất lượng bạn chọn, giữ nguyên độ trong suốt. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp gốc không bao giờ bị thay đổi: bạn tải xuống một tệp mới.',
      faq: [
        {
          question: 'Làm sao để chuyển PNG sang WebP miễn phí?',
          answer: 'Tải tệp .png của bạn lên ở phía trên, chọn chất lượng và nhấp chuyển đổi. Tệp tải xuống là một tệp .webp. Công cụ miễn phí và không cần đăng ký.',
        },
        {
          question: 'Chuyển PNG sang WebP có giữ độ trong suốt không?',
          answer: 'Có. WebP hỗ trợ kênh alpha, nên ảnh PNG trong suốt vẫn trong suốt sau khi chuyển đổi.',
        },
        {
          question: 'Tệp WebP sẽ nhỏ hơn bao nhiêu?',
          answer: 'Tùy vào từng ảnh, nhưng WebP thường nhỏ hơn 25–80% so với tệp PNG gốc ở chất lượng hình ảnh tương đương.',
        },
        {
          question: 'WebP có được hỗ trợ ở mọi nơi không?',
          answer: 'Mọi trình duyệt hiện đại đều hỗ trợ WebP. Một số chương trình cũ hoặc ít phổ biến thì không; hãy giữ một bản PNG dự phòng nếu bạn cần hỗ trợ chúng.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Độ trong suốt được giữ nguyên trong tệp WebP đầu ra.',
        ],
      },
      related: [
        {
          label: 'Chuyển WebP sang PNG',
          to: '/tools/convert-webp-to-png',
          description: 'Chuyển theo chiều ngược lại về một tệp PNG không mất dữ liệu.',
        },
        {
          label: 'Chuyển JPG sang WebP',
          to: '/tools/convert-jpg-to-webp',
          description: 'Thu nhỏ ảnh JPG thành WebP cho web.',
        },
        {
          label: 'Nén ảnh',
          to: '/tools/compress-image',
          description: 'Thu nhỏ ảnh hơn nữa mà không đổi định dạng.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa JPG, PNG, WebP, AVIF và GIF.',
        },
        {
          label: 'Hướng dẫn bộ chuyển đổi ảnh',
          to: '/tutorials/image/getting-started',
          description: 'Tìm hiểu chi tiết mọi tùy chọn ảnh.',
        },
      ],
      embed: {
        title: 'Chuyển PNG sang WebP',
        description: 'Tải lên một ảnh PNG. Đầu ra của công cụ này được khóa ở WebP: chọn chất lượng và chuyển đổi. Độ trong suốt được giữ nguyên, và tệp WebP thường nhỏ hơn PNG rất nhiều.',
      },
    },
    'convert-jpg-to-webp': {
      name: 'Chuyển JPG sang WebP',
      h1: 'Chuyển JPG sang WebP trực tuyến miễn phí',
      tagline: 'Thu nhỏ ảnh JPG thành tệp WebP hiện đại, tải nhanh hơn trên web với chất lượng hình ảnh tương đương.',
      metaTitle: 'Chuyển JPG sang WebP trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển JPG sang WebP trực tuyến miễn phí. Thu nhỏ ảnh .jpg thành ảnh WebP nhẹ hơn để trang web nhanh hơn, với chất lượng bạn chọn. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển JPG sang WebP trực tuyến miễn phí',
      ogDescription: 'Thu nhỏ ảnh JPG thành tệp WebP nhẹ hơn để trang web nhanh hơn, với cùng chất lượng hình ảnh. Miễn phí, không cần đăng ký.',
      intro: 'WebP mang lại chất lượng hình ảnh như JPG trong một tệp nhỏ hơn rõ rệt, vì vậy nó đã trở thành định dạng ảnh mặc định cho các trang web tải nhanh. Media Manipulator chuyển JPG của bạn sang WebP với chất lượng bạn chọn, để ảnh trông vẫn như cũ nhưng tải nhanh hơn.',
      whatItDoes: [
        'Chuyển mọi ảnh .jpg/.jpeg sang tệp .webp hiện đại.',
        'Cho phép bạn chọn chất lượng WebP để cân bằng giữa dung lượng tệp và độ trung thực.',
        'Thường tạo ra tệp nhỏ hơn 25–35% so với tệp JPG gốc ở cùng chất lượng.',
        'Ảnh trông vẫn như cũ; dữ liệu được mã hóa lại bằng WebP để tệp nhỏ hơn.',
      ],
      flowSteps: [
        {
          title: 'Tải JPG lên',
          description: 'Thả vào một ảnh .jpg hoặc .jpeg.',
        },
        {
          title: 'Chọn chất lượng WebP',
          description: '80–85 gần tương đương chất lượng JPG thông thường.',
        },
        {
          title: 'Mã hóa WebP',
          description: 'ImageMagick mã hóa lại ảnh của bạn thành WebP.',
        },
        {
          title: 'Tải WebP xuống',
          description: 'Lưu một tệp .webp nhỏ hơn, sẵn sàng cho web.',
        },
      ],
      advancedDetails: [
        'Ở chất lượng hình ảnh tương đương, WebP thường nhỏ hơn JPG 25–35% nhờ kỹ thuật nén hiện đại hơn.',
        'Tránh nén chồng nhiều lần: mã hóa lại một tệp JPG vốn đã nén mất dữ liệu ở chất lượng WebP rất thấp có thể làm nhiễu nén tăng thêm.',
        'Mọi trình duyệt hiện đại đều hỗ trợ WebP: hãy phục vụ trực tiếp để trang tải nhanh hơn.',
        'Để tương thích tối đa với phần mềm rất cũ, hãy giữ một bản JPG dự phòng.',
      ],
      whyItMatters: [
        'Ảnh nhẹ hơn trực tiếp cải thiện thời gian tải trang, tỷ lệ thoát và SEO.',
        'Chỉ với một lần chuyển đổi, WebP cho bạn chất lượng gần như JPG ở dung lượng nhỏ hơn.',
        'Core Web Vitals ưu tiên ảnh nhỏ hơn, và WebP là cách cải thiện nhanh chóng.',
      ],
      useCases: [
        {
          title: 'Trang web nhanh hơn',
          description: 'Chuyển ảnh JPG ở đầu trang và trong thư viện ảnh sang WebP để giảm dung lượng trang.',
        },
        {
          title: 'Danh mục thương mại điện tử',
          description: 'Thu nhỏ ảnh sản phẩm để trang danh sách tải ngay lập tức.',
        },
        {
          title: 'Blog và bài viết',
          description: 'Phục vụ ảnh trong bài nhẹ hơn mà không giảm chất lượng thấy được.',
        },
        {
          title: 'Ảnh thân thiện với email',
          description: 'Có tệp nhỏ hơn, không vượt giới hạn tệp đính kèm.',
        },
      ],
      whyMediaManipulator: [
        'Đầu ra được khóa ở WebP, nên không có gì để cấu hình sai.',
        'Kiểm soát chất lượng chính xác thay vì một thiết lập cố định.',
      ],
      privacyNote: 'JPG của bạn được mã hóa lại thành một tệp WebP nhỏ hơn trên máy chủ của chúng tôi với chất lượng bạn chọn. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp gốc không bao giờ bị thay đổi: bạn tải xuống một tệp mới.',
      faq: [
        {
          question: 'Làm sao để chuyển JPG sang WebP miễn phí?',
          answer: 'Tải tệp .jpg của bạn lên ở phía trên, chọn chất lượng và nhấp chuyển đổi. Tệp tải xuống là một tệp .webp. Công cụ miễn phí và không cần đăng ký.',
        },
        {
          question: 'WebP có tốt hơn JPG không?',
          answer: 'Với web, thường là có: WebP cho chất lượng tương tự ở dung lượng nhỏ hơn. JPG vẫn vượt trội về khả năng tương thích với phần mềm rất cũ.',
        },
        {
          question: 'WebP nhỏ hơn JPG bao nhiêu?',
          answer: 'Ở chất lượng hình ảnh tương đương, WebP thường nhỏ hơn JPG 25–35%, dù mức tiết kiệm chính xác còn tùy vào từng ảnh.',
        },
        {
          question: 'Chuyển JPG sang WebP có làm giảm chất lượng không?',
          answer: 'Cả hai định dạng đều nén có mất dữ liệu. Ở chất lượng 80–85, kết quả trông giống hệt tệp JPG. Tránh đặt chất lượng WebP quá thấp để nhiễu nén không tích tụ.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'JPG không có độ trong suốt, nên tệp WebP đầu ra hoàn toàn không trong suốt.',
        ],
      },
      related: [
        {
          label: 'Chuyển WebP sang JPG',
          to: '/tools/convert-webp-to-jpg',
          description: 'Chuyển theo chiều ngược lại về một tệp JPG tương thích mọi nơi.',
        },
        {
          label: 'Chuyển PNG sang WebP',
          to: '/tools/convert-png-to-webp',
          description: 'Thu nhỏ đồ họa PNG thành WebP cho web.',
        },
        {
          label: 'Nén ảnh',
          to: '/tools/compress-image',
          description: 'Thu nhỏ ảnh hơn nữa mà không đổi định dạng.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa JPG, PNG, WebP, AVIF và GIF.',
        },
        {
          label: 'Hướng dẫn bộ chuyển đổi ảnh',
          to: '/tutorials/image/getting-started',
          description: 'Tìm hiểu chi tiết mọi tùy chọn ảnh.',
        },
      ],
      embed: {
        title: 'Chuyển JPG sang WebP',
        description: 'Tải lên một ảnh JPG. Đầu ra của công cụ này được khóa ở WebP: chọn chất lượng và chuyển đổi. WebP thường tạo ra tệp nhỏ hơn JPG ở cùng chất lượng hình ảnh.',
      },
    },
    'jpg-converter': {
      name: 'Bộ chuyển đổi JPG',
      tagline: 'Chuyển ảnh sang JPG: bộ chuyển đổi ảnh với JPG được chọn sẵn.',
    },
    'png-converter': {
      name: 'Bộ chuyển đổi PNG',
      tagline: 'Chuyển ảnh sang PNG: bộ chuyển đổi ảnh với PNG được chọn sẵn.',
    },
    'convert-jpg-to-pdf': {
      name: 'Chuyển JPG sang PDF',
      h1: 'Chuyển JPG sang PDF trực tuyến miễn phí',
      tagline: 'Biến ảnh JPG và bản quét thành tài liệu PDF gọn gàng, sẵn sàng để chia sẻ, in hoặc tải lên.',
      metaTitle: 'Chuyển JPG sang PDF trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển JPG sang PDF trực tuyến miễn phí. Biến ảnh chụp và bản quét .jpg thành tài liệu PDF gọn gàng mà không giảm chất lượng. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển JPG sang PDF trực tuyến miễn phí',
      ogDescription: 'Biến ảnh chụp và bản quét JPG thành tài liệu PDF gọn gàng. Không mất dữ liệu, miễn phí, không cần đăng ký.',
      intro: 'JPG là định dạng mà điện thoại và máy ảnh của bạn dùng khi chụp, nhưng PDF mới là thứ mà hầu hết biểu mẫu, hồ sơ và văn phòng cần. Media Manipulator nhúng thẳng ảnh JPG của bạn vào PDF mà không nén lại, nên tài liệu trông giống hệt bức ảnh và vẫn nhỏ gọn.',
      whatItDoes: [
        'Bọc ảnh JPG/JPEG vào một tài liệu PDF một trang.',
        'Nhúng các byte JPG gốc không mất dữ liệu — không nén thêm chút nào.',
        'Định kích thước trang theo ảnh nên không có gì bị cắt hoặc kéo giãn.',
        'Tạo ra tệp PDF chuẩn, mở và in được ở mọi nơi.',
      ],
      flowSteps: [
        {
          title: 'Tải lên JPG',
          description: 'Thả vào một ảnh chụp hoặc bản quét .jpg hay .jpeg.',
        },
        {
          title: 'Chúng tôi nhúng ảnh',
          description: 'Ảnh JPG được đặt lên một trang có kích thước tương ứng, không nén lại.',
        },
        {
          title: 'Tạo PDF',
          description: 'Một tệp PDF một trang chuẩn được lắp ráp.',
        },
        {
          title: 'Tải xuống PDF',
          description: 'Lưu tệp .pdf gọn gàng, sẵn sàng để chia sẻ hoặc tải lên.',
        },
      ],
      advancedDetails: [
        'Luồng JPG được nhúng bằng bộ lọc PDF /DCTDecode, nghĩa là ảnh được lưu nguyên trạng — không có lượt nén mất dữ liệu thứ hai.',
        'Vì không mã hóa lại, tài liệu chuyển từ JPG sang PDF thường có dung lượng xấp xỉ ảnh gốc.',
        'Trang được định kích thước theo ảnh ở 96 DPI, nên một ảnh điện thoại thông thường cho ra trang có kích thước vừa phải.',
      ],
      whyItMatters: [
        'Biểu mẫu, cổng nộp hồ sơ và đơn đăng ký thường yêu cầu PDF, không phải JPG.',
        'PDF in ra đúng như dự kiến, trong khi một tệp JPG thô có thể bị chia ô hoặc bị thu phóng lại.',
        'Nhúng không mất dữ liệu giúp chữ trong tài liệu được quét vẫn dễ đọc.',
      ],
      useCases: [
        {
          title: 'Hồ sơ xin việc',
          description: 'Biến ảnh chụp một biểu mẫu đã ký thành PDF mà cổng nộp hồ sơ chấp nhận.',
        },
        {
          title: 'Hóa đơn và chi phí',
          description: 'Chuyển ảnh chụp hóa đơn thành PDF cho báo cáo chi phí.',
        },
        {
          title: 'Tài liệu được quét',
          description: 'Bọc bản quét một trang giấy bằng điện thoại thành tệp PDF gọn gàng.',
        },
        {
          title: 'In ấn',
          description: 'Có bản in đúng như dự kiến từ ảnh JPG.',
        },
      ],
      whyMediaManipulator: [
        'Thực sự không mất dữ liệu — ảnh JPG bên trong PDF giống hệt bản gốc của bạn.',
        'Đầu ra được khóa ở PDF, nên không có gì để cấu hình sai.',
      ],
      privacyNote: 'Ảnh JPG của bạn được đặt, không bị nén lại, lên một trang PDF duy nhất do máy chủ của chúng tôi dựng. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Bản gốc không bao giờ bị thay đổi: bạn tải xuống một tệp mới.',
      faq: [
        {
          question: 'Làm thế nào để chuyển JPG sang PDF miễn phí?',
          answer: 'Tải tệp .jpg của bạn lên ở trên và bấm chuyển đổi — đầu ra là tệp PDF một trang. Hoàn toàn miễn phí và không cần đăng ký.',
        },
        {
          question: 'Chuyển JPG sang PDF có làm giảm chất lượng không?',
          answer: 'Không. Ảnh JPG được nhúng thẳng vào PDF mà không nén lại, nên chất lượng ảnh giống hệt tệp gốc của bạn.',
        },
        {
          question: 'Tệp PDF có lớn hơn nhiều so với tệp JPG của tôi không?',
          answer: 'Không — vì không mã hóa lại, tệp PDF có dung lượng xấp xỉ tệp JPG nguồn cộng thêm một lớp vỏ tài liệu rất nhỏ.',
        },
        {
          question: 'Tôi có thể gộp nhiều ảnh JPG thành một PDF không?',
          answer: 'Công cụ này tạo một tệp PDF cho mỗi ảnh. Hãy chuyển đổi từng ảnh JPG rồi gộp các tệp PDF bằng một công cụ gộp nếu bạn cần nhiều trang.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Ảnh JPG được nhúng không mất dữ liệu (không nén lại) vào một tệp PDF một trang.',
        ],
      },
      related: [
        {
          label: 'Chuyển PNG sang PDF',
          to: '/tools/convert-png-to-pdf',
          description: 'Trình chuyển đổi chuyên cho PNG → PDF.',
        },
        {
          label: 'Ảnh sang PDF',
          to: '/tools/image-to-pdf',
          description: 'Chuyển mọi định dạng ảnh sang PDF.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa JPG, PNG, WebP, AVIF và nhiều định dạng khác.',
        },
        {
          label: 'PDF sang JPG',
          to: '/tools/pdf-to-jpg',
          description: 'Theo chiều ngược lại: kết xuất PDF thành JPG.',
        },
        {
          label: 'Bộ chuyển đổi PDF',
          to: '/tools/pdf-converter',
          description: 'Trung tâm chuyển đổi PDF đầy đủ.',
        },
      ],
      embed: {
        title: 'Chuyển JPG sang PDF',
        description: 'Tải lên một ảnh JPG. Đầu ra được khóa ở PDF, và ảnh JPG của bạn được nhúng không mất dữ liệu — ảnh bên trong PDF giống hệt bản gốc đến từng bit.',
      },
    },
    'convert-png-to-pdf': {
      name: 'Chuyển PNG sang PDF',
      h1: 'Chuyển PNG sang PDF trực tuyến miễn phí',
      tagline: 'Biến ảnh chụp màn hình, đồ họa và bản quét PNG thành tài liệu PDF gọn gàng, sắc nét.',
      metaTitle: 'Chuyển PNG sang PDF trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển PNG sang PDF trực tuyến miễn phí. Biến ảnh chụp màn hình và đồ họa .png thành tài liệu PDF sắc nét, không mất dữ liệu. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển PNG sang PDF trực tuyến miễn phí',
      ogDescription: 'Biến ảnh chụp màn hình và đồ họa PNG thành tài liệu PDF sắc nét, không mất dữ liệu. Miễn phí, không cần đăng ký.',
      intro: 'PNG là định dạng dành cho ảnh chụp màn hình, sơ đồ và đồ họa có chữ sắc nét và đường viền rõ ràng. Khi bạn cần gửi hoặc in một ảnh như vậy dưới dạng tài liệu, PDF là lớp vỏ phù hợp. Media Manipulator nhúng ảnh PNG của bạn vào PDF không mất dữ liệu để mọi đường viền đều giữ được độ sắc nét.',
      whatItDoes: [
        'Bọc ảnh PNG vào một tài liệu PDF một trang.',
        'Nhúng ảnh không mất dữ liệu để chữ và nét vẽ luôn sắc nét.',
        'Làm phẳng phần trong suốt lên nền trắng, vì trang PDF không trong suốt.',
        'Tạo ra tệp PDF chuẩn, mở và in được ở mọi nơi.',
      ],
      flowSteps: [
        {
          title: 'Tải lên PNG',
          description: 'Thả vào ảnh chụp màn hình, sơ đồ hoặc đồ họa .png.',
        },
        {
          title: 'Chúng tôi nhúng ảnh',
          description: 'Ảnh PNG được ghép lên một trang trắng và nhúng không mất dữ liệu.',
        },
        {
          title: 'Tạo PDF',
          description: 'Một tệp PDF một trang chuẩn được lắp ráp.',
        },
        {
          title: 'Tải xuống PDF',
          description: 'Lưu tệp .pdf sắc nét, sẵn sàng để chia sẻ hoặc in.',
        },
      ],
      advancedDetails: [
        'Ảnh PNG được giải mã và nhúng với nén zlib (Flate) không mất dữ liệu, nên chữ và đường viền sắc nét được giữ nguyên chính xác — không có nhiễu nén JPEG.',
        'Các vùng trong suốt trở thành màu trắng vì trang PDF không có kênh alpha.',
        'Trang được định kích thước theo ảnh ở 96 DPI để có kích thước vật lý mặc định hợp lý.',
      ],
      whyItMatters: [
        'Ảnh chụp màn hình và sơ đồ thường được nộp dưới dạng PDF trong phiếu yêu cầu và báo cáo.',
        'Nhúng không mất dữ liệu giúp chữ nhỏ và nét mảnh vẫn dễ đọc.',
        'PDF in ra đúng như dự kiến, trong khi một tệp PNG thô có thể bị thu phóng ngoài ý muốn.',
      ],
      useCases: [
        {
          title: 'Báo cáo lỗi',
          description: 'Biến ảnh chụp màn hình thành PDF để đính kèm vào phiếu yêu cầu.',
        },
        {
          title: 'Sơ đồ và biểu đồ',
          description: 'Bọc một đồ họa đã xuất thành tệp PDF dễ chia sẻ.',
        },
        {
          title: 'Biểu mẫu được quét',
          description: 'Chuyển bản quét PNG thành tài liệu PDF gọn gàng.',
        },
        {
          title: 'In ấn',
          description: 'Có bản in sắc nét, đúng như dự kiến từ ảnh PNG.',
        },
      ],
      whyMediaManipulator: [
        'Nhúng không mất dữ liệu giữ chữ và đường viền sắc như dao cạo.',
        'Đầu ra được khóa ở PDF, nên không có gì để cấu hình sai.',
      ],
      privacyNote: 'Ảnh PNG của bạn được nhúng không mất dữ liệu vào một tệp PDF một trang trên máy chủ của chúng tôi, với phần trong suốt được làm phẳng lên nền trắng. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Bản gốc không bao giờ bị thay đổi: bạn tải xuống một tệp mới.',
      faq: [
        {
          question: 'Làm thế nào để chuyển PNG sang PDF miễn phí?',
          answer: 'Tải tệp .png của bạn lên ở trên và bấm chuyển đổi — đầu ra là tệp PDF một trang. Hoàn toàn miễn phí và không cần đăng ký.',
        },
        {
          question: 'Chuyển PNG sang PDF có giữ chữ sắc nét không?',
          answer: 'Có. Ảnh PNG được nhúng không mất dữ liệu, nên chữ và nét vẽ luôn sắc nét, không có nhiễu nén kiểu JPEG.',
        },
        {
          question: 'Điều gì xảy ra với ảnh PNG trong suốt?',
          answer: 'Các vùng trong suốt được làm phẳng lên nền trắng vì trang PDF không trong suốt. Nội dung nhìn thấy được không thay đổi.',
        },
        {
          question: 'Tôi có thể gộp nhiều ảnh PNG thành một PDF không?',
          answer: 'Công cụ này tạo một tệp PDF cho mỗi ảnh. Hãy chuyển đổi từng ảnh PNG rồi gộp các tệp PDF bằng một công cụ gộp để có tài liệu nhiều trang.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Ảnh PNG được nhúng không mất dữ liệu. Phần trong suốt được làm phẳng lên nền trắng vì trang PDF không trong suốt.',
        ],
      },
      related: [
        {
          label: 'Chuyển JPG sang PDF',
          to: '/tools/convert-jpg-to-pdf',
          description: 'Trình chuyển đổi chuyên cho JPG → PDF.',
        },
        {
          label: 'Ảnh sang PDF',
          to: '/tools/image-to-pdf',
          description: 'Chuyển mọi định dạng ảnh sang PDF.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa JPG, PNG, WebP, AVIF và nhiều định dạng khác.',
        },
        {
          label: 'PDF sang PNG',
          to: '/tools/pdf-to-png',
          description: 'Theo chiều ngược lại: kết xuất PDF thành PNG.',
        },
        {
          label: 'Bộ chuyển đổi PDF',
          to: '/tools/pdf-converter',
          description: 'Trung tâm chuyển đổi PDF đầy đủ.',
        },
      ],
      embed: {
        title: 'Chuyển PNG sang PDF',
        description: 'Tải lên một ảnh PNG. Đầu ra được khóa ở PDF, và ảnh PNG của bạn được nhúng không mất dữ liệu để chữ và đường viền luôn sắc nét trên trang.',
      },
    },
    'pdf-to-png': {
      name: 'PDF sang PNG',
      h1: 'Chuyển PDF sang PNG trực tuyến miễn phí',
      tagline: 'Kết xuất từng trang của tệp PDF thành ảnh PNG sắc nét, không mất dữ liệu, lý tưởng cho văn bản, sơ đồ và chỉnh sửa.',
      metaTitle: 'Chuyển PDF sang PNG trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển PDF sang PNG trực tuyến miễn phí. Kết xuất mọi trang của tệp PDF thành ảnh PNG sắc nét, không mất dữ liệu, tải về dưới dạng ZIP. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển PDF sang PNG trực tuyến miễn phí',
      ogDescription: 'Kết xuất mọi trang của tệp PDF thành ảnh PNG sắc nét, không mất dữ liệu. Miễn phí, nhanh, không cần đăng ký.',
      intro: 'PNG là lựa chọn tốt nhất khi một trang PDF có chữ sắc nét, nét mảnh hoặc sơ đồ mà bạn muốn giữ thật sắc. Media Manipulator kết xuất từng trang thành ảnh PNG không mất dữ liệu bằng Poppler, nên không có nhiễu nén JPEG quanh chữ. Hãy chọn mọi trang hoặc chỉ trang đầu, và chọn độ phân giải.',
      whatItDoes: [
        'Kết xuất từng trang PDF thành ảnh PNG không mất dữ liệu ở DPI bạn chọn.',
        'Chuyển đổi tất cả các trang (tải về dưới dạng ZIP) hoặc chỉ trang đầu (một ảnh PNG duy nhất).',
        'Đặt tên rõ ràng cho đầu ra nhiều trang: page-001.png, page-002.png, v.v.',
        'Giữ chữ và nét vẽ sắc nét nhờ mã hóa PNG không mất dữ liệu.',
      ],
      flowSteps: [
        {
          title: 'Tải lên PDF',
          description: 'Thả vào bất kỳ tài liệu .pdf nào.',
        },
        {
          title: 'Chọn trang và DPI',
          description: 'Tất cả các trang hoặc chỉ trang đầu; 150 DPI là mức mặc định tốt.',
        },
        {
          title: 'Kết xuất thành PNG',
          description: 'Poppler raster hóa từng trang thành một ảnh PNG không mất dữ liệu.',
        },
        {
          title: 'Tải xuống',
          description: 'Nhận một ảnh PNG duy nhất, hoặc một tệp ZIP với mỗi trang một ảnh PNG.',
        },
      ],
      advancedDetails: [
        'Việc kết xuất dùng Poppler (pdftoppm) để cho ra trang chính xác, trung thực.',
        'PNG không mất dữ liệu, nên là lựa chọn tốt hơn JPG khi trang chủ yếu là chữ, sơ đồ hoặc đồ họa sắc nét.',
        'DPI cao hơn cho ảnh sắc nét hơn, lớn hơn — 150 DPI phù hợp với màn hình, 300 DPI phù hợp để in.',
        'Ảnh PNG được kết xuất có nền trắng; trang PDF không trong suốt, nên không có độ trong suốt nào để giữ lại.',
      ],
      whyItMatters: [
        'PNG không mất dữ liệu giúp chữ nhỏ và nét mảnh dễ đọc, không có nhiễu nén.',
        'Các trang PNG đưa vào trình chỉnh sửa, tài liệu và công cụ thiết kế một cách gọn gàng.',
        'Một trang được kết xuất ghi lại chính xác bố cục hình ảnh của tài liệu.',
      ],
      useCases: [
        {
          title: 'Sơ đồ và bản vẽ kỹ thuật',
          description: 'Kết xuất các trang kỹ thuật mà không có nhiễu nén.',
        },
        {
          title: 'Đánh dấu và duyệt',
          description: 'Mở một trang sắc nét trong trình chỉnh sửa để chú thích.',
        },
        {
          title: 'Tài nguyên thiết kế',
          description: 'Đưa đồ họa trang sạch vào công cụ thiết kế.',
        },
        {
          title: 'Ảnh thu nhỏ',
          description: 'Tạo bản xem trước PNG sắc nét của trang đầu.',
        },
      ],
      whyMediaManipulator: [
        'Kết xuất PNG không mất dữ liệu giữ chữ và đường viền sắc nét.',
        'Đóng gói ZIP rõ ràng, gọn gàng với tên tệp đánh số trang, sắp xếp được.',
      ],
      privacyNote: 'Các trang trong tệp PDF của bạn được kết xuất thành ảnh PNG bằng Poppler trên máy chủ của chúng tôi và, nếu nhiều hơn một trang, được đóng gói vào một tệp ZIP. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Bản gốc không bao giờ bị thay đổi: bạn tải xuống một tệp mới.',
      faq: [
        {
          question: 'Làm thế nào để chuyển PDF sang PNG miễn phí?',
          answer: 'Tải tệp .pdf của bạn lên ở trên, chọn tất cả các trang hoặc chỉ trang đầu, chọn DPI và bấm chuyển đổi.',
        },
        {
          question: 'Vì sao nên chọn PNG thay vì JPG cho PDF?',
          answer: 'PNG không mất dữ liệu, nên giữ chữ, nét mảnh và sơ đồ sắc nét, không có nhiễu nén. JPG tốt hơn khi bạn muốn tệp nhỏ hơn cho các trang nhiều ảnh chụp.',
        },
        {
          question: 'Tôi sẽ nhận được một ảnh hay nhiều ảnh?',
          answer: 'Chọn "tất cả các trang" để nhận tệp ZIP với mỗi trang một ảnh PNG (page-001.png, …), hoặc "chỉ trang đầu" để nhận một ảnh PNG duy nhất.',
        },
        {
          question: 'Ảnh PNG có nền trong suốt không?',
          answer: 'Không — trang PDF không trong suốt, nên các trang được kết xuất có nền trắng. Không có độ trong suốt nào để giữ lại.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Đầu ra tất cả các trang được gửi dưới dạng tệp .zip; đầu ra trang đầu là một tệp .png duy nhất.',
          'Các trang được kết xuất có nền trắng — trang PDF không trong suốt, nên không có độ trong suốt.',
        ],
      },
      related: [
        {
          label: 'PDF sang JPG',
          to: '/tools/pdf-to-jpg',
          description: 'Kết xuất trang PDF thành JPG gọn nhẹ hơn.',
        },
        {
          label: 'Bộ chuyển đổi PDF',
          to: '/tools/pdf-converter',
          description: 'Chuyển PDF thành ảnh và ảnh thành PDF.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển các ảnh đã kết xuất giữa các định dạng.',
        },
        {
          label: 'Ảnh sang PDF',
          to: '/tools/image-to-pdf',
          description: 'Theo chiều ngược lại: biến ảnh thành PDF.',
        },
      ],
      embed: {
        title: 'Chuyển PDF sang PNG',
        description: 'Tải lên một tệp PDF. Mỗi trang được kết xuất thành một ảnh PNG không mất dữ liệu. Chọn "tất cả các trang" để nhận tệp ZIP, hoặc "chỉ trang đầu" để nhận một ảnh PNG duy nhất. Chọn DPI kết xuất để có đầu ra sắc nét hơn.',
      },
    },
    'pdf-converter': {
      name: 'Bộ chuyển đổi PDF',
      h1: 'Bộ chuyển đổi PDF trực tuyến miễn phí',
      tagline: 'Chuyển PDF thành ảnh JPG hoặc PNG và biến ảnh thành PDF, tất cả trong một nơi.',
      metaTitle: 'Bộ chuyển đổi PDF trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển đổi PDF trực tuyến miễn phí. Chuyển PDF thành ảnh JPG hoặc PNG, và chuyển ảnh thành PDF. Không cần đăng ký, không có hình mờ. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Bộ chuyển đổi PDF trực tuyến miễn phí',
      ogDescription: 'Chuyển PDF thành ảnh JPG/PNG và ảnh thành PDF — tất cả trong một công cụ miễn phí. Không cần đăng ký.',
      intro: 'Bộ chuyển đổi PDF xử lý cả hai chiều ở cùng một nơi: kết xuất các trang của tệp PDF thành ảnh JPG hoặc PNG, hoặc bọc một ảnh thành tài liệu PDF. Tải lên PDF, bạn sẽ có các điều khiển xuất ảnh; tải lên ảnh, bạn sẽ có chức năng chuyển ảnh sang PDF. Mọi thứ đều chạy trên máy chủ của chính chúng tôi.',
      whatItDoes: [
        'Chuyển các trang PDF thành JPG hoặc PNG ở độ phân giải bạn chọn.',
        'Chuyển ảnh JPG, PNG và các ảnh khác thành tệp PDF một trang.',
        'Đóng gói bản xuất PDF nhiều trang thành một tệp ZIP gọn gàng chứa các ảnh được đánh số.',
        'Tự động điều chỉnh biểu mẫu theo tệp bạn tải lên.',
      ],
      flowSteps: [
        {
          title: 'Tải lên một tệp',
          description: 'Thả vào một tệp PDF, hoặc một ảnh như JPG hay PNG.',
        },
        {
          title: 'Chọn đầu ra',
          description: 'Với PDF, chọn JPG/PNG, trang và DPI; với ảnh, đầu ra là PDF.',
        },
        {
          title: 'Chuyển đổi',
          description: 'Chúng tôi kết xuất hoặc bọc tệp của bạn trên máy chủ của chúng tôi.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu một tệp PDF, một ảnh duy nhất hoặc một tệp ZIP chứa ảnh các trang.',
        },
      ],
      advancedDetails: [
        'Kết xuất PDF → ảnh dùng Poppler (pdftoppm); ảnh → PDF nhúng JPG không mất dữ liệu và các định dạng khác với nén Flate không mất dữ liệu.',
        'Bản xuất PDF nhiều trang được gửi dưới dạng tệp .zip với tên tệp page-001/page-002 sắp xếp được.',
        'Chuyển ảnh sang PDF định kích thước trang theo ảnh ở 96 DPI; chuyển PDF sang ảnh mặc định là 150 DPI và hỗ trợ đến 300+ để in.',
        'Giới hạn số trang bảo vệ hệ thống khỏi các tệp PDF quá lớn.',
      ],
      whyItMatters: [
        'Một công cụ bao quát cả hai chiều chuyển đổi PDF phổ biến.',
        'Không cần tìm công cụ riêng tùy theo chiều bạn đang chuyển đổi.',
        'Chất lượng xử lý phía máy chủ nhất quán, bất kể trình duyệt hay thiết bị của bạn.',
      ],
      useCases: [
        {
          title: 'Quy trình kết hợp',
          description: 'Chuyển qua lại giữa PDF→ảnh và ảnh→PDF mà không phải đổi công cụ.',
        },
        {
          title: 'Chuẩn bị tài liệu',
          description: 'Biến ảnh thành PDF cho các biểu mẫu tải lên.',
        },
        {
          title: 'Tái sử dụng nội dung',
          description: 'Kết xuất trang PDF thành ảnh cho slide hoặc mạng xã hội.',
        },
        {
          title: 'Xem trước nhanh',
          description: 'Tạo ảnh trang đầu từ bất kỳ tệp PDF nào.',
        },
      ],
      whyMediaManipulator: [
        'Cả hai chiều chuyển đổi trong một công cụ duy nhất, tự thích ứng.',
        'Chuyển ảnh→PDF không mất dữ liệu và kết xuất PDF→ảnh chính xác bằng Poppler.',
      ],
      privacyNote: 'Tệp PDF của bạn được kết xuất từng trang thành ảnh, hoặc ảnh của bạn được bọc thành PDF, bằng Poppler và ImageMagick trên máy chủ của chúng tôi. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Bản gốc không bao giờ bị thay đổi: bạn tải xuống một tệp mới.',
      faq: [
        {
          question: 'Bộ chuyển đổi PDF làm được gì?',
          answer: 'Nó chuyển các trang PDF thành ảnh JPG hoặc PNG, và chuyển ảnh (JPG, PNG và nhiều định dạng khác) thành tài liệu PDF — tất cả trong một công cụ miễn phí.',
        },
        {
          question: 'Làm sao công cụ biết cần chuyển theo chiều nào?',
          answer: 'Nó thích ứng theo tệp bạn tải lên: tệp PDF sẽ hiển thị các điều khiển xuất ảnh (định dạng, trang, DPI), còn ảnh sẽ được chuyển thành PDF.',
        },
        {
          question: 'Tôi có thể chuyển tệp PDF nhiều trang thành ảnh không?',
          answer: 'Có. Chọn "tất cả các trang" và bạn nhận được tệp ZIP chứa mỗi trang một ảnh, được đặt tên page-001, page-002, v.v.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Tải lên PDF để chuyển PDF→ảnh; tải lên ảnh để chuyển ảnh→PDF. Biểu mẫu tự động thích ứng.',
          'Bản xuất PDF tất cả các trang được gửi dưới dạng tệp .zip chứa các ảnh được đánh số.',
        ],
      },
      related: [
        {
          label: 'PDF sang JPG',
          to: '/tools/pdf-to-jpg',
          description: 'Kết xuất trang PDF thành ảnh JPG.',
        },
        {
          label: 'PDF sang PNG',
          to: '/tools/pdf-to-png',
          description: 'Kết xuất trang PDF thành ảnh PNG không mất dữ liệu.',
        },
        {
          label: 'Ảnh sang PDF',
          to: '/tools/image-to-pdf',
          description: 'Biến bất kỳ ảnh nào thành PDF.',
        },
        {
          label: 'Chuyển JPG sang PDF',
          to: '/tools/convert-jpg-to-pdf',
          description: 'Trình chuyển đổi chuyên cho JPG → PDF.',
        },
        {
          label: 'Chuyển PNG sang PDF',
          to: '/tools/convert-png-to-pdf',
          description: 'Trình chuyển đổi chuyên cho PNG → PDF.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa các định dạng ảnh.',
        },
      ],
      embed: {
        title: 'Chuyển đổi PDF hoặc ảnh',
        description: 'Tải lên tệp PDF để kết xuất các trang thành ảnh JPG hoặc PNG, hoặc tải lên ảnh để biến nó thành PDF. Biểu mẫu thích ứng theo tệp bạn chọn.',
      },
    },
    'convert-heic-to-jpg': {
      name: 'Chuyển HEIC sang JPG',
      h1: 'Chuyển HEIC sang JPG trực tuyến miễn phí',
      tagline: 'Biến ảnh HEIC từ iPhone thành tệp JPG tương thích mọi nơi, mở và tải lên được ở bất cứ đâu.',
      metaTitle: 'Chuyển HEIC sang JPG trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển HEIC sang JPG trực tuyến miễn phí. Biến ảnh .heic/.heif từ iPhone thành tệp JPG tương thích mọi nơi. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển HEIC sang JPG trực tuyến miễn phí',
      ogDescription: 'Biến ảnh HEIC từ iPhone thành tệp JPG tương thích mọi nơi. Miễn phí, nhanh, không cần đăng ký.',
      intro: 'HEIC là định dạng hiệu suất cao mà iPhone dùng để tiết kiệm dung lượng, nhưng nó không mở được trên nhiều máy tính Windows, trang web hoặc ứng dụng cũ. Media Manipulator chuyển ảnh HEIC của bạn sang JPG — định dạng dùng được ở mọi nơi — với hướng ảnh chính xác và chất lượng bạn chọn.',
      whatItDoes: [
        'Chuyển ảnh HEIC/HEIF của Apple sang JPG tiêu chuẩn.',
        'Tự xoay ảnh đúng hướng dựa trên EXIF để ảnh dọc không bị nằm ngang.',
        'Cho phép bạn chọn chất lượng JPG để cân bằng giữa dung lượng tệp và độ trung thực.',
        'Tạo ra tệp JPG mở được trên mọi thiết bị, trang web hay ứng dụng.',
      ],
      flowSteps: [
        {
          title: 'Tải lên HEIC',
          description: 'Thả vào ảnh .heic hoặc .heif từ iPhone của bạn.',
        },
        {
          title: 'Tự xoay đúng hướng',
          description: 'Chúng tôi đọc hướng EXIF để ảnh đứng thẳng.',
        },
        {
          title: 'Mã hóa JPG',
          description: 'ImageMagick giải mã HEIC (libheif) và ghi ra tệp JPG.',
        },
        {
          title: 'Tải xuống JPG',
          description: 'Lưu tệp .jpg tương thích mọi nơi.',
        },
      ],
      advancedDetails: [
        'Việc giải mã HEIC dựa vào ImageMagick được dựng với delegate libheif. Nếu máy chủ thiếu hỗ trợ HEIC, công cụ trả về lỗi rõ ràng thay vì một tệp hỏng.',
        'Chất lượng 85–90 là mức mặc định rất tốt — HEIC vốn đã hiệu quả, nên một tệp JPG chất lượng cao giữ cho ảnh trông y hệt.',
        'Hướng EXIF được áp dụng trước khi mã hóa, giúp khắc phục lỗi phổ biến "bị xoay 90°" khi HEIC được chuyển đổi một cách đơn giản.',
      ],
      whyItMatters: [
        'Windows, nhiều biểu mẫu tải lên trên web và phần mềm cũ vẫn không mở được HEIC.',
        'Chia sẻ JPG đảm bảo người nhận xem được trên mọi thiết bị.',
        'Hầu hết các tiệm in ảnh và sàn thương mại điện tử yêu cầu JPG.',
      ],
      useCases: [
        {
          title: 'Chia sẻ ảnh iPhone',
          description: 'Gửi ảnh mở được trên mọi điện thoại hoặc máy tính.',
        },
        {
          title: 'Tải lên web',
          description: 'Đáp ứng các biểu mẫu và trang web từ chối HEIC.',
        },
        {
          title: 'In ấn',
          description: 'Chuyển sang JPG trước khi đặt in ảnh.',
        },
        {
          title: 'Chỉnh sửa trong ứng dụng cũ',
          description: 'Mở ảnh của bạn trong phần mềm không hỗ trợ HEIC.',
        },
      ],
      whyMediaManipulator: [
        'Tự xoay đúng hướng chính xác — không còn ảnh bị nằm ngang.',
        'Tùy chỉnh chất lượng thay vì một thiết lập cố định.',
      ],
      privacyNote: 'Ảnh HEIC của bạn được giải mã trên máy chủ của chúng tôi, xoay về đúng chiều và lưu thành JPG. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Bản gốc không bao giờ bị thay đổi: bạn tải xuống một tệp mới.',
      faq: [
        {
          question: 'Làm thế nào để chuyển HEIC sang JPG miễn phí?',
          answer: 'Tải ảnh .heic của bạn lên ở trên, chọn chất lượng và bấm chuyển đổi. Bạn sẽ nhận lại một tệp .jpg tiêu chuẩn.',
        },
        {
          question: 'Vì sao ảnh HEIC của tôi không mở được trên Windows?',
          answer: 'HEIC là định dạng được Apple ưu tiên mà các phiên bản Windows cũ và nhiều ứng dụng không đọc được. Chuyển sang JPG giúp ảnh mở được ở mọi nơi.',
        },
        {
          question: 'Ảnh có bị giảm chất lượng không?',
          answer: 'JPG là định dạng nén mất dữ liệu, nhưng ở chất lượng 85–90, kết quả trông giống hệt bản gốc HEIC với hầu như mọi bức ảnh.',
        },
        {
          question: 'Vì sao trước đây ảnh đã chuyển đổi của tôi bị xoay?',
          answer: 'Các trình chuyển đổi đơn giản bỏ qua hướng EXIF. Chúng tôi tự xoay ảnh đúng hướng, nên ảnh của bạn ra đúng chiều.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Việc giải mã HEIC cần ImageMagick có delegate libheif trên máy chủ.',
        ],
      },
      related: [
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa JPG, PNG, WebP, AVIF và nhiều định dạng khác.',
        },
        {
          label: 'Chuyển AVIF sang JPG',
          to: '/tools/convert-avif-to-jpg',
          description: 'Chuyển ảnh AVIF hiện đại sang JPG.',
        },
        {
          label: 'Nén ảnh',
          to: '/tools/compress-image',
          description: 'Thu nhỏ tệp JPG cho web.',
        },
        {
          label: 'Hướng dẫn bộ chuyển đổi ảnh',
          to: '/tutorials/image/getting-started',
          description: 'Đi qua từng tùy chọn ảnh.',
        },
      ],
      embed: {
        title: 'Chuyển HEIC sang JPG',
        description: 'Tải lên ảnh HEIC hoặc HEIF từ iPhone của bạn. Đầu ra được khóa ở JPG, tự xoay đúng hướng để ảnh hiển thị đúng chiều, ở chất lượng bạn chọn.',
      },
    },
    'convert-avif-to-jpg': {
      name: 'Chuyển AVIF sang JPG',
      h1: 'Chuyển AVIF sang JPG trực tuyến miễn phí',
      tagline: 'Biến ảnh AVIF hiện đại thành tệp JPG tương thích mọi nơi, dành cho ứng dụng và trang web không chấp nhận AVIF.',
      metaTitle: 'Chuyển AVIF sang JPG trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển AVIF sang JPG trực tuyến miễn phí. Biến ảnh .avif thành tệp JPG tương thích mọi nơi với chất lượng bạn chọn. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển AVIF sang JPG trực tuyến miễn phí',
      ogDescription: 'Biến ảnh AVIF hiện đại thành tệp JPG tương thích mọi nơi. Miễn phí, nhanh, không cần đăng ký.',
      intro: 'AVIF là định dạng ảnh tiên tiến cho ra tệp rất nhỏ, nhưng nhiều ứng dụng, trình chỉnh sửa và biểu mẫu tải lên vẫn chưa mở được nó. Media Manipulator chuyển AVIF sang JPG để ảnh của bạn dùng được ở mọi nơi. Chọn chất lượng rồi tải về.',
      whatItDoes: [
        'Chuyển ảnh AVIF sang JPG chuẩn.',
        'Làm phẳng mọi vùng trong suốt lên một nền, vì JPG không có kênh alpha.',
        'Cho phép bạn chọn chất lượng JPG để cân bằng giữa dung lượng và độ trung thực theo ý muốn.',
        'Tạo ra tệp JPG mở được trên mọi thiết bị hoặc ứng dụng.',
      ],
      flowSteps: [
        {
          title: 'Tải AVIF lên',
          description: 'Thả vào một ảnh .avif.',
        },
        {
          title: 'Chọn chất lượng JPG',
          description: '85 là mức mặc định cân bằng.',
        },
        {
          title: 'Mã hóa JPG',
          description: 'ImageMagick giải mã AVIF (libaom/libheif) và ghi ra tệp JPG.',
        },
        {
          title: 'Tải JPG về',
          description: 'Lưu tệp .jpg tương thích mọi nơi.',
        },
      ],
      advancedDetails: [
        'Việc giải mã AVIF dựa vào ImageMagick được biên dịch kèm delegate AVIF (libaom hoặc libheif). Nếu máy chủ không hỗ trợ AVIF, công cụ sẽ trả về thông báo lỗi rõ ràng.',
        'AVIF hỗ trợ độ trong suốt; khi chuyển sang JPG, các vùng trong suốt bị làm phẳng vì JPG không có kênh alpha. Hãy dùng AVIF → PNG để giữ độ trong suốt.',
        'Chất lượng 85–90 giữ cho JPG trông giống hệt AVIF với hầu hết các ảnh.',
      ],
      whyItMatters: [
        'Nhiều ứng dụng và biểu mẫu tải lên vẫn chưa hỗ trợ AVIF.',
        'JPG bảo đảm người nhận mở được ảnh.',
        'Chuyển đổi giúp bạn dùng ảnh AVIF đã tải về ở bất cứ nơi nào cần JPG.',
      ],
      useCases: [
        {
          title: 'Lưu ảnh từ web',
          description: 'Chuyển ảnh AVIF bạn đã tải về thành tệp JPG dùng được.',
        },
        {
          title: 'Tương thích ứng dụng',
          description: 'Mở ảnh AVIF trong phần mềm không hỗ trợ AVIF.',
        },
        {
          title: 'Tải lên',
          description: 'Đáp ứng biểu mẫu chỉ chấp nhận JPG.',
        },
        {
          title: 'In ấn',
          description: 'Tạo tệp JPG cho tiệm in ảnh.',
        },
      ],
      whyMediaManipulator: [
        'Tùy chỉnh chất lượng thay vì một thiết lập dùng chung cho mọi trường hợp.',
        'Chạy trên máy chủ riêng của chúng tôi, không xử lý qua bên thứ ba.',
      ],
      privacyNote: 'Ảnh AVIF của bạn được giải mã trên máy chủ của chúng tôi và mã hóa lại thành JPG với chất lượng bạn đặt. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp gốc không bao giờ bị thay đổi: bạn tải về một tệp mới.',
      faq: [
        {
          question: 'Làm sao để chuyển AVIF sang JPG miễn phí?',
          answer: 'Tải ảnh .avif của bạn lên ở phía trên, chọn chất lượng rồi bấm chuyển đổi. Bạn sẽ nhận lại một tệp .jpg chuẩn.',
        },
        {
          question: 'Tại sao tôi không mở được tệp AVIF?',
          answer: 'AVIF là định dạng mới hơn; nhiều ứng dụng, trình chỉnh sửa và trang web chưa bổ sung hỗ trợ. Chuyển sang JPG giúp ảnh mở được ở mọi nơi.',
        },
        {
          question: 'Còn độ trong suốt thì sao?',
          answer: 'JPG không có độ trong suốt, nên các vùng trong suốt của AVIF bị làm phẳng lên một nền. Nếu cần giữ độ trong suốt, hãy dùng công cụ AVIF → PNG.',
        },
        {
          question: 'Tôi có bị giảm chất lượng không?',
          answer: 'Ở chất lượng 85–90, JPG trông gần như giống hệt AVIF với hầu hết các ảnh.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Việc giải mã AVIF cần ImageMagick có delegate AVIF trên máy chủ. Độ trong suốt bị làm phẳng trong đầu ra JPG.',
        ],
      },
      related: [
        {
          label: 'Chuyển AVIF sang PNG',
          to: '/tools/convert-avif-to-png',
          description: 'Thay vào đó, giữ độ trong suốt với tệp PNG.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa JPG, PNG, WebP, AVIF và nhiều định dạng khác.',
        },
        {
          label: 'Chuyển HEIC sang JPG',
          to: '/tools/convert-heic-to-jpg',
          description: 'Chuyển ảnh HEIC từ iPhone sang JPG.',
        },
        {
          label: 'Nén ảnh',
          to: '/tools/compress-image',
          description: 'Thu nhỏ tệp JPG cho web.',
        },
      ],
      embed: {
        title: 'Chuyển AVIF sang JPG',
        description: 'Tải lên một ảnh AVIF. Đầu ra được cố định là JPG, nên bạn nhận được tệp mà mọi ứng dụng, trình chỉnh sửa và biểu mẫu tải lên đều chấp nhận, với chất lượng bạn chọn.',
      },
    },
    'convert-avif-to-png': {
      name: 'Chuyển AVIF sang PNG',
      h1: 'Chuyển AVIF sang PNG trực tuyến miễn phí',
      tagline: 'Biến ảnh AVIF thành tệp PNG không mất dữ liệu, mở được ở mọi nơi và giữ nguyên độ trong suốt.',
      metaTitle: 'Chuyển AVIF sang PNG trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển AVIF sang PNG trực tuyến miễn phí. Biến ảnh .avif thành tệp PNG không mất dữ liệu, giữ nguyên độ trong suốt và mở được trong mọi trình chỉnh sửa. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển AVIF sang PNG trực tuyến miễn phí',
      ogDescription: 'Biến ảnh AVIF thành tệp PNG không mất dữ liệu, giữ nguyên độ trong suốt. Miễn phí, nhanh, không cần đăng ký.',
      intro: 'Khi ảnh AVIF có vùng trong suốt, như logo hoặc ảnh cắt nền, chuyển sang JPG sẽ làm phẳng các vùng đó. PNG giữ kênh alpha và không mất dữ liệu, nên là định dạng đích phù hợp cho đồ họa. Media Manipulator chuyển AVIF sang PNG mà vẫn giữ nguyên độ trong suốt.',
      whatItDoes: [
        'Chuyển ảnh AVIF sang PNG không mất dữ liệu.',
        'Giữ kênh alpha để ảnh AVIF trong suốt vẫn trong suốt.',
        'Tạo ra tệp PNG mở được trong mọi trình chỉnh sửa, trình xem hoặc công cụ thiết kế.',
        'Ảnh được giữ nguyên đến từng điểm ảnh khi AVIF chuyển thành PNG.',
      ],
      flowSteps: [
        {
          title: 'Tải AVIF lên',
          description: 'Thả vào một ảnh .avif, trong suốt hay nền đặc đều được.',
        },
        {
          title: 'Giải mã AVIF',
          description: 'ImageMagick giải mã AVIF bằng delegate AVIF của nó.',
        },
        {
          title: 'Mã hóa PNG',
          description: 'Một tệp PNG không mất dữ liệu được ghi ra, giữ nguyên độ trong suốt.',
        },
        {
          title: 'Tải PNG về',
          description: 'Lưu tệp .png giữ nguyên độ trong suốt.',
        },
      ],
      advancedDetails: [
        'Việc giải mã AVIF dựa vào ImageMagick được biên dịch kèm delegate AVIF (libaom hoặc libheif). Nếu máy chủ không hỗ trợ AVIF, công cụ sẽ trả về thông báo lỗi rõ ràng.',
        'Độ trong suốt trong AVIF được giữ lại thành kênh alpha của PNG.',
        'PNG không mất dữ liệu, nên đầu ra thường lớn hơn tệp AVIF nguồn: đó là cái giá cho khả năng tương thích mọi nơi và độ trong suốt.',
      ],
      whyItMatters: [
        'PNG giữ được độ trong suốt mà JPG sẽ phá hỏng, điều thiết yếu với logo và ảnh cắt nền.',
        'Một số trình chỉnh sửa và ứng dụng không mở được AVIF; PNG mở được ở mọi nơi.',
        'PNG là định dạng trao đổi an toàn, không mất dữ liệu cho đồ họa.',
      ],
      useCases: [
        {
          title: 'Logo trong suốt',
          description: 'Chuyển logo AVIF trong suốt thành tệp PNG dùng được.',
        },
        {
          title: 'Bàn giao thiết kế',
          description: 'Cung cấp tệp PNG cho các công cụ không đọc được AVIF.',
        },
        {
          title: 'Chỉnh sửa',
          description: 'Mở ảnh trong trình chỉnh sửa mà không mất dữ liệu.',
        },
        {
          title: 'Tài nguyên web',
          description: 'Giữ một bản PNG dự phòng cho các trình duyệt cũ.',
        },
      ],
      whyMediaManipulator: [
        'Tự động giữ nguyên độ trong suốt.',
        'Đầu ra PNG không mất dữ liệu cho công việc đồ họa.',
      ],
      privacyNote: 'Ảnh AVIF của bạn được giải mã trên máy chủ của chúng tôi và lưu thành PNG không mất dữ liệu, giữ nguyên độ trong suốt. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp gốc không bao giờ bị thay đổi: bạn tải về một tệp mới.',
      faq: [
        {
          question: 'Làm sao để chuyển AVIF sang PNG miễn phí?',
          answer: 'Tải ảnh .avif của bạn lên ở phía trên rồi bấm chuyển đổi: đầu ra là tệp .png không mất dữ liệu, giữ nguyên độ trong suốt.',
        },
        {
          question: 'Chuyển AVIF sang PNG có giữ độ trong suốt không?',
          answer: 'Có. PNG hỗ trợ kênh alpha, nên ảnh AVIF trong suốt vẫn trong suốt sau khi chuyển đổi.',
        },
        {
          question: 'Tôi nên chọn PNG hay JPG cho ảnh AVIF của mình?',
          answer: 'Chọn PNG khi bạn cần độ trong suốt hoặc chất lượng không mất dữ liệu (logo, đồ họa). Chọn JPG để có tệp nhỏ nhất khi ảnh là ảnh chụp không có vùng trong suốt.',
        },
        {
          question: 'Tại sao tệp PNG lớn hơn tệp AVIF?',
          answer: 'AVIF là định dạng nén rất hiệu quả, còn PNG không mất dữ liệu, nên tệp PNG thường lớn hơn. Điều đó là bình thường.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Việc giải mã AVIF cần ImageMagick có delegate AVIF. Độ trong suốt được giữ nguyên trong đầu ra PNG.',
        ],
      },
      related: [
        {
          label: 'Chuyển AVIF sang JPG',
          to: '/tools/convert-avif-to-jpg',
          description: 'Thay vào đó, chuyển AVIF thành tệp JPG gọn nhẹ.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa JPG, PNG, WebP, AVIF và nhiều định dạng khác.',
        },
        {
          label: 'Chuyển HEIC sang JPG',
          to: '/tools/convert-heic-to-jpg',
          description: 'Chuyển ảnh HEIC từ iPhone sang JPG.',
        },
        {
          label: 'Xóa nền ảnh',
          to: '/tools/remove-background-from-image',
          description: 'Tự động tạo ảnh cắt PNG trong suốt.',
        },
      ],
      embed: {
        title: 'Chuyển AVIF sang PNG',
        description: 'Tải lên một ảnh AVIF. Đầu ra được cố định là PNG, nên độ trong suốt được giữ nguyên và tệp mở được mà không mất dữ liệu trong mọi trình chỉnh sửa hoặc trình xem.',
      },
    },
    'convert-svg-to-png': {
      name: 'Chuyển SVG sang PNG',
      h1: 'Chuyển SVG sang PNG trực tuyến miễn phí',
      tagline: 'Chuyển biểu tượng và logo SVG thành ảnh PNG ở bất kỳ kích thước nào để tải lên, đưa vào slide và ứng dụng.',
      metaTitle: 'Chuyển SVG sang PNG trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển SVG sang PNG trực tuyến miễn phí. Raster hóa biểu tượng và logo SVG thành ảnh PNG ở kích thước bạn chọn. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển SVG sang PNG trực tuyến miễn phí',
      ogDescription: 'Raster hóa biểu tượng và logo SVG thành ảnh PNG ở mọi kích thước. Miễn phí, nhanh, không cần đăng ký.',
      intro: 'SVG là đồ họa vector hoàn hảo, nhưng nhiều nền tảng (mạng xã hội, sàn thương mại, công cụ trình chiếu và ứng dụng) chỉ chấp nhận ảnh raster như PNG. Media Manipulator raster hóa SVG của bạn thành ảnh PNG sắc nét, giữ nguyên độ trong suốt, ở kích thước bạn chọn. SVG được xử lý như dữ liệu đầu vào không đáng tin cậy, bằng một trình kết xuất an toàn.',
      whatItDoes: [
        'Raster hóa tệp vector SVG thành ảnh PNG.',
        'Cho phép bạn đặt chiều rộng và/hoặc chiều cao mục tiêu cho độ phân giải đầu ra.',
        'Giữ độ trong suốt của SVG trong tệp PNG.',
        'Kết xuất bằng trình raster hóa an toàn, không tải tài nguyên mạng bên ngoài.',
      ],
      flowSteps: [
        {
          title: 'Tải SVG lên',
          description: 'Thả vào một biểu tượng, logo hoặc hình minh họa .svg.',
        },
        {
          title: 'Đặt kích thước (tùy chọn)',
          description: 'Chọn chiều rộng/chiều cao, hoặc dùng kích thước gốc của SVG.',
        },
        {
          title: 'Raster hóa',
          description: 'SVG được kết xuất thành ảnh điểm ảnh trên máy chủ của chúng tôi.',
        },
        {
          title: 'Tải PNG về',
          description: 'Lưu tệp .png sắc nét, giữ nguyên độ trong suốt.',
        },
      ],
      advancedDetails: [
        'Việc kết xuất dùng rsvg-convert (librsvg) khi có sẵn, vốn mặc định không tải tài nguyên từ xa, với ImageMagick đã được gia cố làm phương án dự phòng.',
        'Vì SVG là đồ họa vector, bạn có thể kết xuất ở mọi độ phân giải mà không giảm chất lượng; chọn chiều rộng lớn hơn để có đầu ra sắc nét hơn.',
        'SVG tải lên được coi là dữ liệu đầu vào không đáng tin cậy và được xử lý khi đã tắt truy cập mạng, để tránh rủi ro SSRF/tải dữ liệu từ bên ngoài.',
      ],
      whyItMatters: [
        'Hầu hết biểu mẫu tải lên và nền tảng mạng xã hội từ chối SVG nhưng chấp nhận PNG.',
        'Raster hóa ở kích thước đã chọn bảo đảm đầu ra sắc nét cho đúng mục đích đó.',
        'PNG giữ được độ trong suốt mà biểu tượng và logo cần đến.',
      ],
      useCases: [
        {
          title: 'Mạng xã hội và tải lên',
          description: 'Biến logo SVG thành ảnh PNG mà nền tảng chấp nhận.',
        },
        {
          title: 'Bài thuyết trình',
          description: 'Đưa ảnh PNG sắc nét của một biểu tượng vào slide.',
        },
        {
          title: 'Tài nguyên ứng dụng',
          description: 'Xuất PNG đúng kích thước mà ứng dụng của bạn cần.',
        },
        {
          title: 'Email',
          description: 'Dùng PNG ở nơi không hỗ trợ SVG.',
        },
      ],
      whyMediaManipulator: [
        'Kết xuất ở mọi kích thước mà không giảm chất lượng: đồ họa vector co giãn hoàn hảo.',
        'Xử lý SVG an toàn, đã tắt việc tải dữ liệu từ bên ngoài.',
      ],
      privacyNote: 'SVG của bạn được librsvg kết xuất thành PNG trên máy chủ của chúng tôi, và các ảnh cùng phông chữ bên ngoài mà nó tham chiếu sẽ không được tải. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp gốc không bao giờ bị thay đổi: bạn tải về một tệp mới.',
      faq: [
        {
          question: 'Làm sao để chuyển SVG sang PNG miễn phí?',
          answer: 'Tải tệp .svg của bạn lên ở phía trên, đặt chiều rộng hoặc chiều cao nếu muốn, rồi bấm chuyển đổi. Bạn sẽ nhận lại một tệp .png sắc nét.',
        },
        {
          question: 'Tệp PNG sẽ có kích thước bao nhiêu?',
          answer: 'Mặc định, công cụ dùng kích thước gốc của SVG. Đặt chiều rộng và/hoặc chiều cao để kết xuất lớn hơn hoặc nhỏ hơn: đồ họa vector co giãn mà không giảm chất lượng.',
        },
        {
          question: 'Tệp PNG có giữ độ trong suốt không?',
          answer: 'Có. Các vùng trong suốt của SVG được giữ nguyên thành vùng trong suốt trong PNG.',
        },
        {
          question: 'Tải SVG lên có an toàn không?',
          answer: 'Có. Chúng tôi coi SVG là dữ liệu đầu vào không đáng tin cậy và kết xuất chúng khi đã tắt việc tải dữ liệu qua mạng bên ngoài, nên các tham chiếu từ xa được nhúng trong tệp không thể được tải.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Được kết xuất bằng rsvg-convert (ưu tiên) hoặc phương án dự phòng ImageMagick đã được gia cố. Việc tải dữ liệu qua mạng bên ngoài từ SVG bị tắt.',
        ],
      },
      related: [
        {
          label: 'Chuyển PNG sang SVG',
          to: '/tools/convert-png-to-svg',
          description: 'Theo chiều ngược lại: vector hóa PNG thành SVG.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa JPG, PNG, WebP, AVIF và nhiều định dạng khác.',
        },
        {
          label: 'PNG sang ICO',
          to: '/tools/png-to-ico',
          description: 'Biến tệp PNG thành favicon.',
        },
      ],
      embed: {
        title: 'Chuyển SVG sang PNG',
        description: 'Tải lên một tệp SVG. Đầu ra được cố định là PNG. Bạn có thể đặt chiều rộng hoặc chiều cao để điều chỉnh độ phân giải kết xuất; để trống để dùng kích thước gốc của SVG.',
      },
    },
    'convert-png-to-svg': {
      name: 'Chuyển PNG sang SVG',
      h1: 'Chuyển PNG sang SVG trực tuyến miễn phí',
      tagline: 'Vector hóa logo, biểu tượng và nét vẽ từ PNG thành đường dẫn SVG thật, co giãn được, bằng potrace.',
      metaTitle: 'Chuyển PNG sang SVG trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ vector hóa PNG sang SVG trực tuyến miễn phí. Dò logo, biểu tượng và nét vẽ thành đường dẫn SVG thật, co giãn được. Phù hợp nhất với đồ họa đơn giản, không phải ảnh chụp. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển PNG sang SVG trực tuyến miễn phí',
      ogDescription: 'Vector hóa logo, biểu tượng và nét vẽ từ PNG thành đường dẫn SVG thật, co giãn được. Miễn phí, không cần đăng ký.',
      intro: 'Chuyển PNG sang SVG thực thụ nghĩa là dò ảnh của bạn thành các đường dẫn vector thật, co giãn đến mọi kích thước mà không bị vỡ điểm ảnh. Media Manipulator dùng potrace để vector hóa PNG của bạn, lý tưởng cho logo, biểu tượng, chữ ký và nét vẽ đen trắng. Đây là vector hóa thực thụ, không phải một tệp PNG giấu bên trong SVG. Công cụ không được thiết kế để biến ảnh chụp thành hình vector sạch sẽ.',
      whatItDoes: [
        'Dò PNG thành các đường dẫn vector SVG thật, co giãn được, bằng potrace.',
        'Đưa ảnh về dạng bitmap đen/trắng sạch, rồi vector hóa các hình.',
        'Cho phép bạn tinh chỉnh ngưỡng đen/trắng để giữ nhiều hoặc ít chi tiết hơn.',
        'Xuất ra tệp .svg thực thụ, không phải ảnh raster được bọc trong thẻ <image>.',
      ],
      flowSteps: [
        {
          title: 'Tải PNG lên',
          description: 'Thả vào một tệp PNG logo, biểu tượng, chữ ký hoặc nét vẽ.',
        },
        {
          title: 'Đặt ngưỡng',
          description: 'Chọn mức phân tách đen/trắng để điều chỉnh độ chi tiết.',
        },
        {
          title: 'Dò thành vector',
          description: 'ImageMagick chuẩn bị bitmap; potrace dò các đường dẫn.',
        },
        {
          title: 'Tải SVG về',
          description: 'Lưu tệp .svg thật, co giãn được.',
        },
      ],
      advancedDetails: [
        'Quy trình làm phẳng PNG thành bitmap hai mức (ngưỡng của ImageMagick), rồi chạy potrace để tạo các đường dẫn vector Bézier mượt.',
        'Vector hóa hoạt động tốt nhất với đồ họa đơn giản, tương phản cao: logo, biểu tượng, chữ lồng, chữ ký và nét vẽ đen trắng.',
        'Công cụ sẽ không tái tạo trung thực ảnh chụp hay chuyển màu phức tạp: dò một bức ảnh chụp sẽ cho ra các đường dẫn lớn, lộn xộn, chứ không phải hình vector sạch sẽ.',
        'Tăng ngưỡng để giữ chi tiết mảnh/nhạt hơn; giảm ngưỡng để chỉ giữ các hình đậm nhất.',
      ],
      whyItMatters: [
        'Logo vector co giãn đến mọi kích thước, từ favicon đến biển quảng cáo, mà không bị vỡ điểm ảnh.',
        'Với đồ họa đơn giản, SVG rất nhỏ và chỉnh sửa được trong các công cụ vector như Illustrator hoặc Inkscape.',
        'Khôi phục bản vector từ logo PNG giúp bạn khỏi phải vẽ lại từ đầu.',
      ],
      useCases: [
        {
          title: 'Khôi phục logo',
          description: 'Vector hóa logo PNG mà bạn không còn tệp gốc.',
        },
        {
          title: 'Biểu tượng và chữ lồng',
          description: 'Biến một biểu tượng đơn giản thành SVG co giãn được.',
        },
        {
          title: 'Chữ ký',
          description: 'Vector hóa chữ ký đã quét để tái sử dụng gọn gàng.',
        },
        {
          title: 'Nét vẽ',
          description: 'Dò tác phẩm đen trắng thành các đường dẫn có thể chỉnh sửa.',
        },
      ],
      whyMediaManipulator: [
        'Vector hóa bằng potrace thật, nói rõ công cụ làm tốt việc gì (và không làm tốt việc gì).',
        'Tùy chỉnh ngưỡng để bạn tinh chỉnh kết quả dò.',
      ],
      privacyNote: 'Ảnh của bạn được đưa về hai màu đen trắng và được potrace dò thành các đường dẫn vector trên máy chủ của chúng tôi. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp gốc không bao giờ bị thay đổi: bạn tải về một tệp mới.',
      faq: [
        {
          question: 'Làm sao để chuyển PNG sang SVG miễn phí?',
          answer: 'Tải tệp .png của bạn lên ở phía trên, điều chỉnh ngưỡng nếu cần, rồi bấm chuyển đổi. Bạn sẽ nhận lại một tệp .svg vector thật.',
        },
        {
          question: 'Đây là vector hóa thật hay chỉ là PNG được bọc lại?',
          answer: 'Đây là vector hóa thật. Chúng tôi dò ảnh thành các đường dẫn SVG thực sự bằng potrace; chúng tôi không nhúng PNG vào trong SVG rồi coi như xong.',
        },
        {
          question: 'Công cụ có vector hóa được ảnh chụp của tôi không?',
          answer: 'Không tốt lắm. Vector hóa được thiết kế cho logo, biểu tượng, chữ ký và nét vẽ. Ảnh chụp và chuyển màu phức tạp sẽ cho ra các đường dẫn lớn, lộn xộn thay vì hình vector sạch sẽ.',
        },
        {
          question: 'Tùy chỉnh ngưỡng có tác dụng gì?',
          answer: 'Nó đặt mức phân tách đen/trắng trước khi dò. Tăng lên để giữ thêm chi tiết (nhạt hơn); giảm xuống để chỉ giữ các hình đậm nhất.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Vector hóa cần potrace trên máy chủ. Phù hợp nhất với logo/biểu tượng/nét vẽ, không phải ảnh chụp.',
        ],
      },
      related: [
        {
          label: 'Chuyển SVG sang PNG',
          to: '/tools/convert-svg-to-png',
          description: 'Theo chiều ngược lại: raster hóa SVG thành PNG.',
        },
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa JPG, PNG, WebP, AVIF và nhiều định dạng khác.',
        },
        {
          label: 'PNG sang ICO',
          to: '/tools/png-to-ico',
          description: 'Biến tệp PNG thành favicon.',
        },
      ],
      embed: {
        title: 'Vector hóa PNG thành SVG',
        description: 'Tải lên một tệp PNG. Đầu ra được cố định là SVG và được tạo bằng vector hóa thật (potrace), không phải ảnh raster bọc trong SVG. Điều chỉnh ngưỡng đen/trắng để giữ nhiều hoặc ít chi tiết hơn. Phù hợp nhất với logo, biểu tượng, chữ ký và nét vẽ.',
      },
    },
    'png-to-ico': {
      name: 'PNG sang ICO',
      h1: 'Chuyển PNG sang ICO trực tuyến miễn phí',
      tagline: 'Biến PNG thành favicon .ico nhiều kích thước thực thụ cho trang web và biểu tượng ứng dụng Windows.',
      metaTitle: 'Chuyển PNG sang ICO trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển PNG sang ICO trực tuyến miễn phí. Tạo favicon .ico nhiều kích thước thực thụ (16–256px) cho trang web và biểu tượng Windows. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển PNG sang ICO trực tuyến miễn phí',
      ogDescription: 'Tạo favicon .ico nhiều kích thước thật từ tệp PNG. Miễn phí, nhanh, không cần đăng ký.',
      intro: 'Favicon cần là một tệp .ico thực thụ chứa nhiều kích thước để trình duyệt và Windows chọn được kích thước phù hợp. Media Manipulator tạo tệp ICO nhiều kích thước thật từ PNG của bạn, không phải tệp chỉ được đổi tên, gói trọn dãy kích thước biểu tượng chuẩn 16–256 px.',
      whatItDoes: [
        'Tạo vùng chứa .ico thật từ ảnh PNG.',
        'Gói nhiều kích thước (16, 32, 48, 64, 128, 256 px) vào một tệp.',
        'Giữ độ trong suốt để biểu tượng hiển thị gọn gàng trên mọi nền.',
        'Tạo ra tệp mà trình duyệt và Windows chấp nhận làm favicon/biểu tượng ứng dụng.',
      ],
      flowSteps: [
        {
          title: 'Tải PNG lên',
          description: 'Thả vào một tệp PNG; ảnh vuông cho ra biểu tượng đẹp nhất.',
        },
        {
          title: 'Tạo các kích thước',
          description: 'Chúng tôi kết xuất từng kích thước biểu tượng chuẩn từ ảnh của bạn.',
        },
        {
          title: 'Đóng gói ICO',
          description: 'Các kích thước được gói vào một vùng chứa .ico thật.',
        },
        {
          title: 'Tải ICO về',
          description: 'Lưu favicon.ico cho trang web hoặc ứng dụng của bạn.',
        },
      ],
      advancedDetails: [
        'Tệp ICO được tạo bằng tính năng tự đổi kích thước biểu tượng của ImageMagick, cho ra một vùng chứa nhiều ảnh thực thụ, không phải tệp PNG đổi tên.',
        'Đưa vào nhiều kích thước giúp trình duyệt và Windows chọn biểu tượng sắc nét nhất cho từng ngữ cảnh (thẻ, thanh tác vụ, màn hình nền).',
        'Để có kết quả gọn gàng nhất, hãy bắt đầu từ một tệp PNG vuông 256×256 trở lên để mọi kích thước đều được thu nhỏ sắc nét.',
      ],
      whyItMatters: [
        'Trình duyệt cần một favicon .ico thật; tệp PNG đổi tên có thể không hoạt động hoặc trông bị mờ.',
        'Biểu tượng nhiều kích thước luôn sắc nét, từ thẻ 16px đến lối tắt 256px trên màn hình nền.',
        'Biểu tượng ứng dụng Windows bắt buộc dùng định dạng .ico.',
      ],
      useCases: [
        {
          title: 'Favicon cho trang web',
          description: 'Tạo favicon.ico làm biểu tượng thẻ cho trang web của bạn.',
        },
        {
          title: 'Biểu tượng ứng dụng Windows',
          description: 'Tạo tệp .ico cho ứng dụng máy tính.',
        },
        {
          title: 'Lối tắt',
          description: 'Tạo biểu tượng sắc nét cho lối tắt trên màn hình nền.',
        },
        {
          title: 'Thương hiệu',
          description: 'Biến logo PNG thành tệp biểu tượng đúng chuẩn.',
        },
      ],
      whyMediaManipulator: [
        'Tệp ICO nhiều kích thước thực thụ, không phải PNG đổi tên.',
        'Giữ nguyên độ trong suốt để biểu tượng gọn gàng.',
      ],
      privacyNote: 'Ảnh của bạn được ImageMagick đổi về từng kích thước biểu tượng chuẩn và gói vào một tệp .ico trên máy chủ của chúng tôi. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp gốc không bao giờ bị thay đổi: bạn tải về một tệp mới.',
      faq: [
        {
          question: 'Làm sao để chuyển PNG sang ICO miễn phí?',
          answer: 'Tải tệp .png của bạn lên ở phía trên rồi bấm chuyển đổi: bạn sẽ nhận lại một tệp .ico nhiều kích thước thật.',
        },
        {
          question: 'Đây là ICO thật hay PNG đổi tên?',
          answer: 'Là ICO thật. Chúng tôi tạo nhiều kích thước biểu tượng và gói chúng vào một vùng chứa .ico thực thụ, đúng như trình duyệt và Windows yêu cầu.',
        },
        {
          question: 'Gồm những kích thước nào?',
          answer: 'Dãy kích thước favicon chuẩn: 16, 32, 48, 64, 128 và 256 px. Trình duyệt và Windows chọn kích thước tốt nhất cho từng ngữ cảnh.',
        },
        {
          question: 'Ảnh nào cho kết quả tốt nhất?',
          answer: 'Một tệp PNG vuông 256×256 trở lên cho kết quả sắc nét nhất, vì mọi kích thước nhỏ hơn đều được thu nhỏ gọn gàng từ đó.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Một tệp ICO nhiều kích thước (16/32/48/64/128/256 px) được tạo ra. Hãy bắt đầu từ ảnh vuông để có kết quả tốt nhất.',
        ],
      },
      related: [
        {
          label: 'Bộ chuyển đổi ảnh',
          to: '/tools/image-converter',
          description: 'Chuyển đổi giữa JPG, PNG, WebP, AVIF và nhiều định dạng khác.',
        },
        {
          label: 'Chuyển SVG sang PNG',
          to: '/tools/convert-svg-to-png',
          description: 'Raster hóa logo SVG trước khi tạo biểu tượng.',
        },
        {
          label: 'Đổi kích thước ảnh',
          to: '/tools/image-resizer',
          description: 'Tạo ảnh vuông trước khi tạo biểu tượng.',
        },
        {
          label: 'Xóa nền ảnh',
          to: '/tools/remove-background-from-image',
          description: 'Tạo ảnh nguồn trong suốt cho biểu tượng.',
        },
      ],
      embed: {
        title: 'Chuyển PNG sang ICO',
        description: 'Tải lên một tệp PNG (ảnh vuông cho kết quả tốt nhất). Đầu ra được cố định là ICO, và một biểu tượng nhiều kích thước thật được tạo ra, chứa các phiên bản 16, 32, 48, 64, 128 và 256 px.',
      },
    },
    'svg-converter': {
      name: 'Bộ chuyển đổi SVG',
      tagline: 'Chuyển SVG sang PNG hoặc vector hóa PNG thành SVG: bộ chuyển đổi ảnh với SVG làm điểm xuất phát.',
    },
    'convert-wav-to-mp3': {
      name: 'Chuyển WAV sang MP3',
      h1: 'Chuyển WAV sang MP3 trực tuyến',
      tagline: 'Thu nhỏ các bản ghi WAV không mất dữ liệu dung lượng lớn thành tệp MP3 tương thích rộng rãi cho podcast, chia sẻ và lưu trữ.',
      metaTitle: 'Chuyển WAV sang MP3 trực tuyến (miễn phí) | Media Manipulator',
      metaDescription: 'Công cụ chuyển WAV sang MP3 trực tuyến miễn phí. Nén các bản ghi .wav không mất dữ liệu thành tệp MP3 nhỏ hơn với bitrate bạn chọn.',
      ogTitle: 'Chuyển WAV sang MP3 trực tuyến',
      ogDescription: 'Nén bản ghi WAV thành tệp MP3 tương thích rộng rãi với bitrate bạn chọn.',
      intro: 'Tệp WAV không mất dữ liệu và có dung lượng lớn. MP3 là định dạng âm thanh nén tương thích mọi nơi: mọi điện thoại, máy tính xách tay và ứng dụng nghe nhạc đều phát được. Media Manipulator mã hóa lại tệp WAV của bạn thành MP3 với bitrate bạn chọn, nên bạn chỉ đánh đổi một chút chất lượng để có tệp nhỏ hơn 5–10×.',
      whatItDoes: [
        'Mã hóa lại bản ghi WAV thành MP3 với bitrate bạn chọn.',
        'Hỗ trợ tùy chỉnh tần số lấy mẫu, số kênh và bitrate (128 đến 320 kbps).',
        'Giữ nguyên độ lớn âm thanh và tránh lấy mẫu lại không cần thiết.',
        'Xuất ra tệp .mp3 chuẩn có thẻ ID3.',
      ],
      flowSteps: [
        {
          title: 'Tải WAV lên',
          description: 'Thả vào bất kỳ tệp .wav nào từ máy tính của bạn.',
        },
        {
          title: 'Chọn bitrate',
          description: '192 kbps cho giọng nói, 256–320 kbps cho âm nhạc.',
        },
        {
          title: 'Mã hóa MP3',
          description: 'FFmpeg mã hóa tệp MP3 sạch với các thiết lập đã chọn.',
        },
        {
          title: 'Tải MP3 về',
          description: 'Lưu tệp .mp3 tương thích rộng rãi.',
        },
      ],
      advancedDetails: [
        'Bên dưới, công cụ dùng cách mã hóa kiểu LAME thông qua FFmpeg.',
        'MP3 là codec nén có mất dữ liệu: với âm nhạc, chất lượng gần như không tăng thêm sau khoảng 256 kbps. Nội dung giọng nói nghe rất tốt ở 128–192 kbps.',
        'Nếu bạn cần tệp nhỏ hơn mà không mất dữ liệu, hãy dùng FLAC hoặc ALAC. Dùng Opus (trong OGG) để có tệp nén mất dữ liệu hiện đại nhỏ nhất khi bạn kiểm soát được trình phát.',
      ],
      whyItMatters: [
        'Tệp WAV lớn hơn 5–10× so với MP3 tương đương ở bitrate hợp lý.',
        'MP3 phát được trên mọi thiết bị, không gặp vấn đề tương thích codec.',
        'Các nền tảng podcast, sách nói và âm nhạc thường yêu cầu hoặc ưu tiên tải lên MP3.',
      ],
      useCases: [
        {
          title: 'Tập podcast',
          description: 'Làm master bằng WAV, phát hành dưới dạng MP3 mono 96–128 kbps.',
        },
        {
          title: 'Ghi chú giọng nói',
          description: 'Thu nhỏ bản ghi âm trên điện thoại trước khi chia sẻ hoặc lưu trữ.',
        },
        {
          title: 'Bản demo nhạc',
          description: 'Gửi bản mix ở 256–320 kbps mà tệp đính kèm không quá nặng.',
        },
        {
          title: 'Nhúng vào trang web',
          description: 'Dùng MP3 để tương thích: mọi trình duyệt đều phát được sẵn mà không cần thêm gì.',
        },
      ],
      whyMediaManipulator: [
        'Chọn chính xác bitrate, tần số lấy mẫu và bố cục kênh.',
        'Miễn phí, không cần đăng ký, không hình mờ, đầu ra hoàn toàn thuộc về bạn.',
        'Cùng mô hình quyền riêng tư về thời gian lưu trữ như các công cụ còn lại.',
      ],
      privacyNote: 'Tệp WAV của bạn được FFmpeg mã hóa thành MP3 trên máy chủ của chúng tôi với bitrate bạn chọn. Không có dịch vụ âm thanh bên ngoài nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Bạn nhận được một tệp mới; bản thân tệp tải lên không bị thay đổi.',
      faq: [
        {
          question: 'Tôi nên chọn bitrate nào?',
          answer: '192 kbps là mức mặc định cân bằng. Dùng 128 kbps cho giọng nói/podcast, 256–320 kbps cho âm nhạc.',
        },
        {
          question: 'Chất lượng âm thanh có bị giảm không?',
          answer: 'Có một chút, vì MP3 là định dạng mất dữ liệu. Ở 256+ kbps, hầu hết người nghe không phân biệt được với bản WAV gốc.',
        },
        {
          question: 'Tôi có thể chuyển các định dạng khác sang MP3 không?',
          answer: 'Có. Bộ chuyển đổi âm thanh nhận FLAC, M4A/AAC, OGG, OPUS và nhiều định dạng khác. Hãy dùng công cụ chuyển đổi âm thanh chung.',
        },
        {
          question: 'Có giới hạn dung lượng tệp không?',
          answer: 'Các tệp có dung lượng hợp lý đều được chấp nhận. Với bản ghi rất dài, hãy cân nhắc cắt bớt trước.',
        },
      ],
      related: [
        {
          label: 'Bộ chuyển đổi âm thanh',
          to: '/tools/audio-converter',
          description: 'Chuyển đổi giữa bất kỳ cặp định dạng âm thanh nào.',
        },
        {
          label: 'Tách giọng hát khỏi bài hát',
          to: '/tools/isolate-vocals-from-song',
          description: 'Lấy giọng hát ra khỏi bản nhạc.',
        },
        {
          label: 'Hướng dẫn bộ chuyển đổi âm thanh',
          to: '/tutorials/audio/getting-started',
          description: 'Đi qua mọi tùy chọn âm thanh, bao gồm cả các công cụ AI.',
        },
      ],
      embed: {
        title: 'Chuyển WAV sang MP3',
        description: 'Tải lên một tệp WAV và chọn MP3 làm định dạng đầu ra. 192 kbps là mức mặc định tốt cho giọng nói; dùng 256–320 kbps cho âm nhạc.',
      },
    },
    'isolate-vocals-from-song': {
      name: 'Tách giọng hát khỏi bài hát',
      h1: 'Tách giọng hát khỏi bài hát trực tuyến',
      tagline: 'Trích giọng hát từ bản nhạc để phối lại, cover, chép lời và phân tích. Chỉ dùng với nhạc mà bạn có quyền.',
      metaTitle: 'Tách giọng hát khỏi bài hát trực tuyến (miễn phí) | Media Manipulator',
      metaDescription: 'Công cụ tách giọng hát trực tuyến miễn phí. Trích giọng hát từ bài hát thành một stem sạch để phối lại, cover, chép lời hoặc phân tích.',
      ogTitle: 'Tách giọng hát khỏi bài hát trực tuyến',
      ogDescription: 'Trích giọng hát từ bài hát thành một stem đã tách sạch sẽ, để phối lại, cover, chép lời hoặc phân tích.',
      intro: 'Tách nguồn âm bằng AI có thể lấy track giọng hát ra khỏi một bản mix hoàn chỉnh, rất hợp để phối lại, cover, chuẩn bị karaoke hoặc chép lời bài hát. Media Manipulator chạy việc tách trên máy chủ GPU riêng của chúng tôi. Kết quả là một stem giọng hát duy nhất mà bạn có thể tải về và dùng ở bất cứ đâu, miễn là bạn có quyền làm vậy với tài liệu nguồn của mình.',
      whatItDoes: [
        'Chạy tách nguồn âm bằng AI để trích track giọng hát từ một bản ghi âm nhạc.',
        'Xuất ra một stem giọng hát đã tách duy nhất, cùng định dạng với tệp của bạn (MP3 vẫn là MP3), hoặc FLAC, WAV hay MP3 nếu bạn chọn.',
        'Kết hợp tốt với các công cụ làm sạch âm thanh như khử nhiễu và EQ để có kết quả chỉn chu.',
        'Hỗ trợ đầu vào WAV, MP3, FLAC, M4A, OGG, OPUS và nhiều định dạng khác.',
      ],
      flowSteps: [
        {
          title: 'Tải bài hát lên',
          description: 'Thả vào bất kỳ tệp âm thanh phổ biến nào có giọng hát lẫn với nhạc.',
        },
        {
          title: 'Chạy tách bằng AI',
          description: 'Mô hình trên GPU cục bộ tách giọng hát khỏi phần còn lại của bản mix.',
        },
        {
          title: 'Làm sạch (tùy chọn)',
          description: 'Áp dụng khử nhiễu, EQ hoặc gain để hoàn thiện stem.',
        },
        {
          title: 'Tải stem giọng hát về',
          description: 'Lưu phần giọng hát đã tách: mặc định cùng định dạng với tệp của bạn, hoặc FLAC, WAV hay MP3.',
        },
      ],
      advancedDetails: [
        'Tách nguồn âm vốn không hoàn hảo: tiếng vang, bè và hiệu ứng nặng sẽ lọt vào đầu ra.',
        'Tệp MP3 hoặc tệp nén khác được trả về đúng định dạng của nó (MP3 ở 320 kbps). Tệp không mất dữ liệu (WAV, FLAC, AIFF) được trả về dưới dạng FLAC. FLAC và WAV giữ nhiều chi tiết nhất để chỉnh sửa thêm trong DAW; WAV có dung lượng lớn nhất.',
        'Với karaoke (chỉ phần nhạc), hãy dùng chế độ riêng "Loại bỏ giọng hát" trong bộ chuyển đổi âm thanh.',
      ],
      whyItMatters: [
        'Nhà sản xuất và người phối lại có thể dựng bản nhạc mới quanh một giọng hát có sẵn.',
        'Ca sĩ có thể chép lời hoặc giai điệu chính xác hơn.',
        'Nhà giáo dục và kỹ sư âm thanh dùng stem đã tách để nghiên cứu kỹ thuật mix.',
      ],
      useCases: [
        {
          title: 'Phối lại và cover',
          description: 'Dựng phần nhạc mới quanh một giọng hát đã tách.',
        },
        {
          title: 'Chép lời và giai điệu',
          description: 'Có tín hiệu rõ hơn để chép thủ công hoặc bằng AI.',
        },
        {
          title: 'Chuẩn bị karaoke',
          description: 'Ghép giọng hát đã tách với một bản nhạc nền riêng.',
        },
        {
          title: 'Luyện tập kỹ thuật âm thanh',
          description: 'Nghiên cứu kỹ thuật mix trên các bản thu thương mại.',
        },
      ],
      whyMediaManipulator: [
        'AI chạy trên GPU cục bộ: không nhà cung cấp AI bên thứ ba nào thấy âm thanh của bạn.',
        'Kết hợp EQ, khử nhiễu và cắt trong một lần tải lên.',
        'Miễn phí, không cần đăng ký, không hình mờ trên đầu ra.',
      ],
      privacyNote: 'Bài hát của bạn được Demucs tách thành các stem trên máy chủ GPU riêng của chúng tôi và chỉ stem giọng hát được trả về cho bạn. Không có dịch vụ âm thanh bên ngoài nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Bạn nhận được một tệp mới; bản thân tệp tải lên không bị thay đổi.',
      faq: [
        {
          question: 'Việc tách có hoàn toàn sạch không?',
          answer: 'Không công cụ tách nguồn âm nào hoàn hảo. Hãy chờ đợi một số tạp âm, nhất là quanh những đoạn có tiếng vang nặng và bè. Chọn đầu ra FLAC hoặc WAV nếu bạn định làm sạch stem sau đó trong DAW.',
        },
        {
          question: 'Hỗ trợ những định dạng âm thanh nào?',
          answer: 'WAV, MP3, FLAC, M4A/AAC, OGG, OPUS và hầu hết các định dạng âm thanh phổ biến khác.',
        },
        {
          question: 'Tôi có thể dùng công cụ này với nhạc có bản quyền không?',
          answer: 'Chỉ khi bạn sở hữu quyền, có giấy phép, hoặc đang sử dụng hợp lý (fair use) theo pháp luật nơi bạn sinh sống. Bạn chịu trách nhiệm về cách sử dụng đầu ra.',
        },
        {
          question: 'Tôi có thể lấy riêng phần nhạc ở đâu?',
          answer: 'Hãy dùng chế độ AI "Loại bỏ giọng hát" trong bộ chuyển đổi âm thanh: cùng một lần tải lên, đầu ra khác.',
        },
      ],
      related: [
        {
          label: 'Bộ chuyển đổi âm thanh',
          to: '/tools/audio-converter',
          description: 'Chuyển đổi và làm sạch stem sau khi tách.',
        },
        {
          label: 'Chuyển WAV sang MP3',
          to: '/tools/convert-wav-to-mp3',
          description: 'Nén stem WAV thành MP3 để chia sẻ.',
        },
        {
          label: 'Hướng dẫn bộ chuyển đổi âm thanh',
          to: '/tutorials/audio/getting-started',
          description: 'Đi qua mọi tùy chọn âm thanh, bao gồm cả các công cụ AI.',
        },
      ],
      embed: {
        title: 'Tách giọng hát',
        description: 'Tải lên một bài hát và bấm nút: Tách giọng hát đã được chọn sẵn. Kết quả được trả về cùng định dạng với tệp của bạn (MP3 vẫn là MP3); chọn FLAC hoặc WAV trong Định dạng đầu ra để không mất dữ liệu.',
      },
    },
    'image-converter': {
      name: 'Bộ chuyển đổi ảnh',
      h1: 'Bộ chuyển đổi ảnh trực tuyến miễn phí',
      tagline: 'Chuyển đổi giữa JPG, PNG, WebP, AVIF, GIF và nhiều định dạng khác, với tùy chỉnh chất lượng, đổi kích thước, cắt và siêu dữ liệu.',
      metaTitle: 'Bộ chuyển đổi ảnh trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Bộ chuyển đổi ảnh trực tuyến miễn phí cho JPG, PNG, WebP, AVIF, GIF và HEIC. Đổi kích thước, nén, cắt và xóa siêu dữ liệu chỉ trong một lần tải lên.',
      ogTitle: 'Bộ chuyển đổi ảnh trực tuyến miễn phí',
      ogDescription: 'Chuyển đổi JPG, PNG, WebP, AVIF, GIF và HEIC. Đổi kích thước, nén và xóa siêu dữ liệu chỉ trong một lần tải lên.',
      intro: 'Một bức ảnh thường cần xuất hiện ở nhiều nơi: trang web, bài thuyết trình, ấn phẩm in, tin đăng trên sàn thương mại. Mỗi nơi lại ưa một định dạng khác nhau. Media Manipulator xử lý mọi định dạng ảnh phổ biến ở cùng một chỗ, với khả năng kiểm soát chi tiết chất lượng, kích thước và siêu dữ liệu.',
      whatItDoes: [
        'Chuyển đổi giữa JPG, PNG, WebP, AVIF, GIF, HEIC và nhiều định dạng khác.',
        'Đổi kích thước, cắt, xoay và áp dụng bộ lọc hình ảnh trong một lượt.',
        'Xóa hoặc giữ siêu dữ liệu EXIF/IPTC/XMP tùy nhu cầu.',
        'Công cụ AI: làm mờ khuôn mặt, xóa nền, nâng độ phân giải và che văn bản/thông tin cá nhân.',
      ],
      flowSteps: [
        {
          title: 'Tải ảnh lên',
          description: 'Thả vào bất kỳ tệp ảnh phổ biến nào.',
        },
        {
          title: 'Chọn định dạng đầu ra',
          description: 'JPG, PNG, WebP, AVIF, GIF.',
        },
        {
          title: 'Tinh chỉnh chất lượng và siêu dữ liệu',
          description: 'Đổi kích thước, cắt hoặc xóa EXIF.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu ảnh đã chuyển đổi.',
        },
      ],
      advancedDetails: [
        'WebP và AVIF cho tệp web nhỏ nhất; AVIF thường nhỏ hơn WebP ở cùng chất lượng hình ảnh.',
        'PNG không mất dữ liệu và hỗ trợ độ trong suốt; rất phù hợp cho tài nguyên giao diện và ảnh chụp màn hình.',
        'JPG là định dạng trao đổi an toàn nhất cho ảnh chụp.',
      ],
      whyItMatters: [
        'Mỗi nền tảng và công cụ chấp nhận những định dạng ảnh khác nhau.',
        'Tệp ảnh nhỏ hơn giúp trang tải nhanh hơn, và Google xếp hạng trang nhanh cao hơn.',
        'Xóa siêu dữ liệu trước khi chia sẻ giúp bảo vệ quyền riêng tư của bạn.',
      ],
      useCases: [
        {
          title: 'Tối ưu hóa web',
          description: 'Chuyển ảnh PNG sang WebP/AVIF để giảm dung lượng trang.',
        },
        {
          title: 'Chia sẻ đa nền tảng',
          description: 'Chuyển ảnh HEIC từ iPhone sang JPG.',
        },
        {
          title: 'Tin đăng trên sàn thương mại',
          description: 'Xóa siêu dữ liệu và đổi kích thước trước khi đăng.',
        },
        {
          title: 'In ấn và thuyết trình',
          description: 'Xuất JPG với thiết lập chất lượng cao.',
        },
      ],
      whyMediaManipulator: [
        'Một lần tải lên cho cả chuyển đổi, đổi kích thước, cắt, bộ lọc, AI và siêu dữ liệu.',
        'Miễn phí, không cần đăng ký, không hình mờ.',
        'Công cụ AI chạy trên máy chủ GPU của chính chúng tôi.',
      ],
      privacyNote: 'Ảnh của bạn được ImageMagick chuyển đổi, và đổi kích thước hoặc cắt nếu bạn yêu cầu, trên máy chủ của chúng tôi. Không có gì được gửi đến dịch vụ bên ngoài. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Bản gốc không bao giờ bị thay đổi: bạn tải xuống một tệp mới.',
      faq: [
        {
          question: 'Định dạng ảnh nào tốt nhất?',
          answer: 'Tùy trường hợp: WebP/AVIF cho web, PNG khi cần độ trong suốt, JPG để tương thích.',
        },
        {
          question: 'Tôi có thể chuyển đổi hàng loạt không?',
          answer: 'Công cụ miễn phí chuyển đổi từng ảnh một. Hãy chạy nhiều lần chuyển đổi lần lượt.',
        },
        {
          question: 'Công cụ có xóa siêu dữ liệu không?',
          answer: 'Chỉ khi bạn đặt Chế độ siêu dữ liệu thành "Loại bỏ toàn bộ siêu dữ liệu". Mặc định là giữ siêu dữ liệu.',
        },
        {
          question: 'Có dùng được với HEIC không?',
          answer: 'Có, ảnh HEIC từ iPhone được chuyển sang JPG, PNG hoặc WebP gọn gàng.',
        },
      ],
      related: [
        {
          label: 'Đổi kích thước ảnh',
          to: '/tools/image-resizer',
          description: 'Đổi kích thước về số điểm ảnh chính xác.',
        },
        {
          label: 'Nén ảnh',
          to: '/tools/compress-image',
          description: 'Giảm dung lượng tệp ảnh cho web.',
        },
        {
          label: 'Ảnh sang PDF',
          to: '/tools/image-to-pdf',
          description: 'Đóng gói ảnh thành tài liệu PDF.',
        },
        {
          label: 'Bộ chuyển đổi PDF',
          to: '/tools/pdf-converter',
          description: 'Chuyển PDF sang ảnh và ngược lại.',
        },
        {
          label: 'Chuyển HEIC sang JPG',
          to: '/tools/convert-heic-to-jpg',
          description: 'Chuyển ảnh HEIC từ iPhone sang JPG.',
        },
        {
          label: 'Xóa nền ảnh',
          to: '/tools/remove-background-from-image',
          description: 'Tự động xóa nền thành ảnh PNG trong suốt.',
        },
        {
          label: 'Chuyển WebP sang JPG',
          to: '/tools/convert-webp-to-jpg',
          description: 'Bộ chuyển đổi chuyên dụng WebP → JPG.',
        },
        {
          label: 'Hướng dẫn bộ chuyển đổi ảnh',
          to: '/tutorials/image/getting-started',
          description: 'Hướng dẫn đầy đủ từng tùy chọn.',
        },
      ],
      embed: {
        title: 'Chuyển đổi ảnh',
        description: 'Tải lên bất kỳ ảnh nào và chọn định dạng đầu ra, chất lượng và thiết lập đổi kích thước/cắt. JPG hợp với ảnh chụp, PNG giữ độ trong suốt, còn WebP/AVIF cho tệp web nhỏ nhất.',
      },
    },
    'video-converter': {
      name: 'Bộ chuyển đổi video',
      h1: 'Bộ chuyển đổi video trực tuyến miễn phí',
      tagline: 'Chuyển đổi giữa MP4, WebM, MOV, AVI, MKV và nhiều định dạng khác, với toàn quyền kiểm soát codec, độ phân giải và âm thanh.',
      metaTitle: 'Bộ chuyển đổi video trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Bộ chuyển đổi video trực tuyến miễn phí cho MP4, WebM, MOV, AVI, MKV và nhiều định dạng khác. Chọn codec, bitrate, độ phân giải và thiết lập âm thanh.',
      ogTitle: 'Bộ chuyển đổi video trực tuyến miễn phí',
      ogDescription: 'Chuyển đổi MP4, WebM, MOV, AVI, MKV, FLV, WMV và nhiều định dạng khác. Chọn codec, bitrate và thiết lập âm thanh.',
      intro: 'Mỗi nền tảng cần một định dạng video khác nhau. Chỉnh sửa trên Mac bằng MOV, đăng lên web bằng MP4 hoặc WebM, lưu trữ bằng MKV. Media Manipulator xử lý mọi container và codec video phổ biến ở cùng một chỗ, với toàn quyền kiểm soát bitrate, độ phân giải và âm thanh.',
      whatItDoes: [
        'Chuyển đổi giữa MP4, WebM, MOV, AVI, MKV, FLV, WMV và ProRes.',
        'Chọn codec (H.264, H.265, VP9, ProRes, DNxHD).',
        'Đổi kích thước, đổi tốc độ khung hình, cắt và mã hóa lại âm thanh.',
        'Tùy chọn áp dụng bộ lọc và chỉnh màu.',
      ],
      flowSteps: [
        {
          title: 'Tải video lên',
          description: 'Thả vào bất kỳ container video phổ biến nào.',
        },
        {
          title: 'Chọn định dạng đích',
          description: 'MP4, WebM, MOV, AVI, MKV.',
        },
        {
          title: 'Tinh chỉnh codec và chất lượng',
          description: 'Bitrate, độ phân giải, âm thanh.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu video đã chuyển đổi.',
        },
      ],
      advancedDetails: [
        'H.264 trong MP4 là lựa chọn mặc định an toàn ở mọi nơi.',
        'H.265 (HEVC) và VP9 cho tệp nhỏ hơn khoảng 25–50% ở cùng chất lượng hình ảnh, nhưng cần trình phát hiện đại.',
        'Khi bàn giao để biên tập, ProRes (trong MOV) hoặc DNxHD (trong MOV/MXF) giữ được nhiều chất lượng nhất.',
      ],
      whyItMatters: [
        'Ứng dụng chỉnh sửa, trình duyệt và nền tảng mạng xã hội mỗi nơi ưa một định dạng khác nhau.',
        'Tệp video nhỏ hơn giúp cải thiện thời gian tải trang và giảm chi phí băng thông.',
        'Mã hóa lại giúp bạn sửa codec sai hoặc tệp không phát được.',
      ],
      useCases: [
        {
          title: 'MOV → MP4',
          description: 'Giúp cảnh quay từ thiết bị Apple phát được ở mọi nơi.',
        },
        {
          title: 'AVI → MP4',
          description: 'Hiện đại hóa một video lưu trữ cũ.',
        },
        {
          title: 'MP4 → WebM',
          description: 'Thu nhỏ video web cho trình duyệt hiện đại.',
        },
        {
          title: 'Bàn giao cho biên tập',
          description: 'Xuất ProRes hoặc DNxHD để biên tập chất lượng cao.',
        },
      ],
      whyMediaManipulator: [
        'Toàn quyền kiểm soát codec, bitrate và âm thanh chỉ trong một lần tải lên.',
        'Có thể chép lời bằng AI trên cùng tệp.',
        'Miễn phí, không cần đăng ký, không hình mờ.',
      ],
      privacyNote: 'Video của bạn được FFmpeg mã hóa lại trên máy chủ của chúng tôi sang container và codec bạn chọn. Việc xử lý chạy trên máy chủ của chính chúng tôi, không phải dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp nguồn của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Định dạng đầu ra nào tốt nhất?',
          answer: 'MP4 với H.264 để tương thích, WebM với VP9 để có tệp web nhỏ nhất.',
        },
        {
          question: 'Tôi có thể cắt trước khi chuyển đổi không?',
          answer: 'Có, phần cắt trong biểu mẫu cho phép bạn cắt ngắn clip trước khi mã hóa lại.',
        },
        {
          question: 'Âm thanh có giữ đồng bộ không?',
          answer: 'Có, FFmpeg giữ đồng bộ âm thanh và hình ảnh. Nếu bạn đổi tốc độ khung hình hoặc tốc độ phát, âm thanh được lấy mẫu lại cho phù hợp.',
        },
        {
          question: 'Có giới hạn dung lượng tệp không?',
          answer: 'Tệp rất lớn có thể bị từ chối ở gói miễn phí. Hãy thử giảm độ phân giải trước.',
        },
      ],
      related: [
        {
          label: 'Chuyển MOV sang MP4',
          to: '/tools/convert-mov-to-mp4',
          description: 'Giúp cảnh quay QuickTime/iPhone phát được ở mọi nơi.',
        },
        {
          label: 'Chuyển WebM sang MP4',
          to: '/tools/convert-webm-to-mp4',
          description: 'Biến video web thành MP4 có thể chỉnh sửa.',
        },
        {
          label: 'Chuyển MP4 sang WebM',
          to: '/tools/convert-mp4-to-webm',
          description: 'Thu nhỏ MP4 thành WebM VP9 cho web.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Công cụ nén chuyên dụng để giảm dung lượng tệp video.',
        },
        {
          label: 'Chuyển video sang GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Biến clip ngắn thành GIF động.',
        },
        {
          label: 'Tách âm thanh khỏi video',
          to: '/tools/extract-audio-from-video',
          description: 'Lưu track âm thanh thành MP3, WAV hoặc M4A.',
        },
        {
          label: 'Cắt video',
          to: '/tools/video-trimmer',
          description: 'Cắt clip về đúng phần bạn muốn, không giảm chất lượng.',
        },
        {
          label: 'Đổi kích thước video',
          to: '/tools/resize-video',
          description: 'Đổi độ phân giải thành 1080p, 720p hoặc tùy chỉnh.',
        },
        {
          label: 'Xoay video',
          to: '/tools/rotate-video',
          description: 'Sửa cảnh quay bị nằm ngang hoặc lộn ngược.',
        },
        {
          label: 'Chuyển video thành văn bản',
          to: '/tools/transcribe-video',
          description: 'Trích lời nói trong video thành văn bản hoặc phụ đề VTT.',
        },
        {
          label: 'Nội suy khung hình bằng AI',
          to: '/tools/ai-frame-interpolation',
          description: 'Tăng tốc độ khung hình của video lên 48, 60 hoặc 120 FPS bằng khung hình do AI tạo ra.',
        },
        {
          label: 'Chuyển mã video sang HLS',
          to: '/tools/transcode-to-hls',
          description: 'Tạo gói HLS thích ứng từ bất kỳ video nào.',
        },
        {
          label: 'Chuyển mã video sang DASH',
          to: '/tools/transcode-to-dash',
          description: 'Tạo gói MPEG-DASH AV1/VP9 từ bất kỳ video nào.',
        },
        {
          label: 'Hướng dẫn bộ chuyển đổi video',
          to: '/tutorials/video/getting-started',
          description: 'Hướng dẫn đầy đủ từng tùy chọn.',
        },
      ],
      embed: {
        title: 'Chuyển đổi video',
        description: 'Tải lên bất kỳ video nào và chọn container/codec đích. Thiết lập chất lượng "Trung bình" là mặc định tốt. MP4 phát được ở mọi nơi; WebM cho tệp nhỏ hơn trên trình duyệt hiện đại.',
      },
    },
    'mp4-converter': {
      name: 'Bộ chuyển đổi MP4',
      tagline: 'Chuyển video sang MP4: bộ chuyển đổi video với MP4 được chọn sẵn.',
    },
    'convert-mov-to-mp4': {
      name: 'Chuyển MOV sang MP4',
      h1: 'Chuyển MOV sang MP4 trực tuyến miễn phí',
      tagline: 'Biến tệp .mov của QuickTime và iPhone thành MP4 phổ biến, phát và tải lên được ở mọi nơi.',
      metaTitle: 'Chuyển MOV sang MP4 trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển MOV sang MP4 trực tuyến miễn phí. Chuyển video .mov của QuickTime và iPhone sang MP4 phát được ở mọi nơi. Không hình mờ, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển MOV sang MP4 trực tuyến miễn phí',
      ogDescription: 'Chuyển tệp MOV của QuickTime / iPhone sang MP4 phổ biến, tải lên và phát được trên mọi thiết bị.',
      intro: 'MOV là định dạng chứa QuickTime của Apple — định dạng mà iPhone, máy Mac và nhiều máy ảnh ghi theo mặc định. Nó rất tốt trong hệ sinh thái Apple, nhưng có thể không phát được trên Windows, Android hoặc bị một số biểu mẫu tải lên từ chối. Chuyển MOV sang MP4 giữ nguyên video H.264 và âm thanh AAC trong một định dạng chứa được cả thế giới chấp nhận, thường không có thay đổi chất lượng nào nhìn thấy được.',
      whatItDoes: [
        'Chuyển tệp .mov của QuickTime / iPhone sang MP4.',
        'Cố định đầu ra là MP4 (H.264 + AAC) để kết quả phát được ở mọi nơi.',
        'Thêm -pix_fmt yuv420p và +faststart để MP4 phát được trong trình duyệt và bắt đầu ngay lập tức.',
        'Cắt MOV, đổi kích thước hoặc chọn mức chất lượng cài sẵn ngay trong cùng một lần tải lên.',
      ],
      flowSteps: [
        {
          title: 'Tải MOV lên',
          description: 'Thả vào một tệp .mov từ iPhone, máy Mac hoặc máy ảnh của bạn.',
        },
        {
          title: 'Đầu ra được cố định là MP4',
          description: 'Không cần chọn định dạng — công cụ này đã đặt sẵn MP4.',
        },
        {
          title: 'Chuyển đổi',
          description: 'Chúng tôi đóng gói lại hoặc mã hóa lại video thành một tệp MP4 sạch.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu tệp MP4, sẵn sàng cho mọi thiết bị hoặc nền tảng.',
        },
      ],
      advancedDetails: [
        'Hầu hết tệp MOV đã chứa video H.264, nên việc chuyển đổi diễn ra nhanh và gần như không mất dữ liệu ở chất lượng Cao.',
        'Chúng tôi ép chroma yuv420p để MP4 phát được trong Safari và trên các nền tảng mạng xã hội vốn từ chối video 4:2:2/4:4:4.',
        'Nếu MOV của bạn chứa ProRes, trình chuyển đổi sẽ chuyển mã xuống H.264 — hãy chọn chất lượng Cao để giữ nhiều chi tiết nhất.',
      ],
      whyItMatters: [
        'MOV thường không phát được trên Windows hoặc Android nếu không có codec bổ sung.',
        'Nhiều biểu mẫu tải lên và trình chỉnh sửa chấp nhận MP4 nhưng từ chối MOV.',
        'MP4 là định dạng an toàn nhất để chia sẻ video quay bằng iPhone với bất kỳ ai.',
      ],
      useCases: [
        {
          title: 'Video iPhone',
          description: 'Chuyển tệp .mov quay trên iPhone để phát được trên máy tính Windows.',
        },
        {
          title: 'Tải lên web',
          description: 'Biến bản xuất QuickTime thành MP4 mà trang web chấp nhận.',
        },
        {
          title: 'Gửi cho người không dùng Apple',
          description: 'Chia sẻ cảnh quay với người dùng Android và Windows mà không gặp sự cố khi phát.',
        },
        {
          title: 'Tương thích với trình chỉnh sửa',
          description: 'Đưa MP4 vào các trình chỉnh sửa gặp khó khăn với tệp MOV gốc.',
        },
      ],
      whyMediaManipulator: [
        'Đầu ra được cố định ở một cấu hình MP4 đã được kiểm chứng — không phải đoán cài đặt.',
        'FFmpeg phía máy chủ cũng xử lý được nguồn MOV chứa ProRes và HEVC.',
      ],
      privacyNote: 'Tệp MOV của bạn được FFmpeg mã hóa lại trên máy chủ của chúng tôi thành MP4 H.264 và AAC. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Tệp nguồn của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Làm cách nào để chuyển MOV sang MP4?',
          answer: 'Tải tệp .mov lên và bấm chuyển đổi — đầu ra đã được đặt sẵn là MP4, nên bạn không cần chọn gì thêm.',
        },
        {
          question: 'Chuyển MOV sang MP4 có làm giảm chất lượng không?',
          answer: 'Hầu hết tệp MOV dùng H.264, nên ở chất lượng Cao, việc mã hóa lại gần như không mất chất lượng bằng mắt thường. Các mức cài sẵn thấp hơn đánh đổi một phần chất lượng để có tệp nhỏ hơn.',
        },
        {
          question: 'Vì sao tệp MOV từ iPhone của tôi không phát được trên Windows?',
          answer: 'Windows có thể thiếu codec QuickTime/HEVC. MP4 với H.264 + AAC phát được mà không cần phần mềm bổ sung.',
        },
        {
          question: 'QuickTime sang MP4 có phải là cùng một việc không?',
          answer: 'Đúng vậy — tệp QuickTime dùng định dạng chứa .mov, nên chuyển QuickTime sang MP4 chính là công cụ này.',
        },
        {
          question: 'Có hình mờ hoặc phải đăng ký không?',
          answer: 'Không có hình mờ và không cần tài khoản. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Đầu ra được cố định là MP4 (H.264 + AAC, yuv420p, +faststart).',
        ],
      },
      related: [
        {
          label: 'Bộ chuyển đổi video',
          to: '/tools/video-converter',
          description: 'Chuyển mọi video sang MP4.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Thu nhỏ MP4 để gửi email hoặc đăng lên web.',
        },
        {
          label: 'Chuyển video sang GIF',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Cắt một clip và xuất thành GIF động.',
        },
        {
          label: 'Hướng dẫn bộ chuyển đổi video',
          to: '/tutorials/video/getting-started',
          description: 'Tìm hiểu từng bước các tùy chọn cắt, đổi kích thước và chất lượng.',
        },
      ],
      embed: {
        title: 'Chuyển MOV sang MP4',
        description: 'Tải tệp .mov của bạn lên. Công cụ này cố định đầu ra là MP4 (H.264 + AAC), nên bạn chỉ cần tải lên và chuyển đổi.',
      },
    },
    'convert-webm-to-mp4': {
      name: 'Chuyển WebM sang MP4',
      h1: 'Chuyển WebM sang MP4 trực tuyến miễn phí',
      tagline: 'Biến video .webm tối ưu cho web thành MP4 để bạn chỉnh sửa, chia sẻ và phát trên mọi thiết bị.',
      metaTitle: 'Chuyển WebM sang MP4 trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển WebM sang MP4 trực tuyến miễn phí. Chuyển video .webm (VP8/VP9) sang MP4 (H.264 + AAC) cho các trình chỉnh sửa và thiết bị không mở được WebM. Không hình mờ, không cần đăng ký.',
      ogTitle: 'Chuyển WebM sang MP4 trực tuyến miễn phí',
      ogDescription: 'Chuyển video .webm sang MP4 phổ biến mà trình chỉnh sửa, điện thoại và TV đều phát được.',
      intro: 'WebM là định dạng chứa mở, hiện đại, được xây dựng cho web — tệp nhỏ, rất phù hợp cho video trong trình duyệt. Nhưng nhiều trình chỉnh sửa video, thiết bị cũ và ứng dụng nhắn tin không mở được WebM. Chuyển WebM sang MP4 sẽ mã hóa lại video VP8/VP9 sang H.264 và âm thanh sang AAC, cho bạn một tệp dùng được trong Premiere, Resolve, trên điện thoại và TV.',
      whatItDoes: [
        'Chuyển video .webm (VP8/VP9 + Vorbis/Opus) sang MP4.',
        'Cố định đầu ra là MP4 (H.264 + AAC) để tương thích tối đa.',
        'Thêm yuv420p và +faststart để MP4 phát được trong mọi trình duyệt và bắt đầu ngay lập tức.',
        'Bản quay màn hình WebM có thể được cắt hoặc đổi kích thước trong lúc chuyển sang MP4.',
      ],
      flowSteps: [
        {
          title: 'Tải WebM lên',
          description: 'Thả vào một tệp .webm tải từ web hoặc từ trình quay màn hình.',
        },
        {
          title: 'Đầu ra được cố định là MP4',
          description: 'Công cụ này đã đặt sẵn MP4 — không cần cấu hình gì.',
        },
        {
          title: 'Chuyển đổi',
          description: 'Chúng tôi chuyển mã VP8/VP9 sang H.264 + AAC.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu tệp MP4 để chỉnh sửa hoặc phát ở bất cứ đâu.',
        },
      ],
      advancedDetails: [
        'WebM dùng video VP8/VP9, định dạng mà hầu hết trình chỉnh sửa không nhập được; MP4/H.264 được nhập trơn tru vào mọi phần mềm dựng phim (NLE).',
        'Chúng tôi ép yuv420p để MP4 phát được trong Safari và trên các nền tảng mạng xã hội.',
        'Nếu thực ra bạn muốn một tệp web nhỏ hơn, công cụ ngược lại MP4 sang WebM sẽ tạo ra WebM VP9.',
      ],
      whyItMatters: [
        'Hầu hết trình chỉnh sửa trên máy tính không nhập được WebM nhưng xử lý MP4 một cách tự nhiên.',
        'Một số điện thoại, TV và ứng dụng trò chuyện từ chối phát WebM.',
        'MP4 là định dạng bàn giao an toàn cho video bạn đã tải xuống dưới dạng WebM.',
      ],
      useCases: [
        {
          title: 'Chỉnh sửa video đã tải xuống',
          description: 'Đưa một clip .webm vào Premiere hoặc Resolve dưới dạng MP4.',
        },
        {
          title: 'Bản quay màn hình',
          description: 'Chuyển bản quay màn hình WebM thành MP4 dễ chia sẻ.',
        },
        {
          title: 'Phát trên thiết bị cũ',
          description: 'Giúp tệp WebM phát được trên TV hoặc điện thoại không hỗ trợ định dạng này.',
        },
        {
          title: 'Ứng dụng nhắn tin',
          description: 'Gửi video đến các ứng dụng chấp nhận MP4 nhưng không chấp nhận WebM.',
        },
      ],
      whyMediaManipulator: [
        'FFmpeg phía máy chủ giải mã VP8 và VP9 một cách ổn định.',
        'Đầu ra được cố định ở một cấu hình MP4 đã được kiểm chứng.',
      ],
      privacyNote: 'Tệp WebM của bạn được FFmpeg mã hóa lại trên máy chủ của chúng tôi từ VP8 hoặc VP9 thành MP4 H.264. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Tệp nguồn của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Làm cách nào để chuyển WebM sang MP4?',
          answer: 'Tải tệp .webm lên và bấm chuyển đổi — đầu ra đã được đặt sẵn là MP4.',
        },
        {
          question: 'Vì sao trình chỉnh sửa của tôi không mở được WebM?',
          answer: 'Hầu hết trình chỉnh sửa không hỗ trợ nhập VP8/VP9. Chuyển sang MP4 (H.264) sẽ khắc phục việc nhập tệp.',
        },
        {
          question: 'Tệp có lớn hơn không?',
          answer: 'Ở cùng chất lượng, MP4/H.264 có thể lớn hơn một chút so với WebM VP9. Nếu dung lượng quan trọng, hãy chọn mức chất lượng cài sẵn thấp hơn.',
        },
        {
          question: 'Công cụ có giữ âm thanh không?',
          answer: 'Có — âm thanh Vorbis/Opus được mã hóa lại sang AAC và vẫn đồng bộ.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Đầu ra được cố định là MP4 (H.264 + AAC, yuv420p, +faststart).',
        ],
      },
      related: [
        {
          label: 'Bộ chuyển đổi video',
          to: '/tools/video-converter',
          description: 'Chuyển mọi video sang MP4.',
        },
        {
          label: 'Chuyển MP4 sang WebM',
          to: '/tools/convert-mp4-to-webm',
          description: 'Chiều ngược lại — tạo WebM VP9 nhỏ gọn.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Thu nhỏ MP4 để chia sẻ.',
        },
      ],
      embed: {
        title: 'Chuyển WebM sang MP4',
        description: 'Tải tệp .webm của bạn lên. Công cụ này cố định đầu ra là MP4 (H.264 + AAC), nên bạn chỉ cần tải lên và chuyển đổi.',
      },
    },
    'convert-avi-to-mp4': {
      name: 'Chuyển AVI sang MP4',
      h1: 'Chuyển AVI sang MP4 trực tuyến miễn phí',
      tagline: 'Làm mới các video .avi cũ thành MP4 gọn nhẹ, phát được trên mọi điện thoại, trình duyệt và TV.',
      metaTitle: 'Chuyển AVI sang MP4 trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển AVI sang MP4 trực tuyến miễn phí. Chuyển video .avi cũ (Xvid/DivX) sang MP4 (H.264 + AAC) phát được ở mọi nơi. Không hình mờ, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển AVI sang MP4 trực tuyến miễn phí',
      ogDescription: 'Chuyển video .avi đời cũ sang MP4 hiện đại, gọn nhẹ, phát được trên mọi thiết bị.',
      intro: 'AVI là định dạng chứa kinh điển của Windows từ thời DivX/Xvid. Các tệp này thường lớn và dùng những codec mà điện thoại, trình duyệt và TV hiện đại không còn phát được. Chuyển AVI sang MP4 sẽ mã hóa lại video sang H.264 hiệu quả và âm thanh sang AAC, tạo ra một tệp nhỏ hơn phát được trên mọi thiết bị bạn đang dùng hiện nay.',
      whatItDoes: [
        'Chuyển tệp .avi đời cũ (Xvid, DivX, MJPEG và nhiều loại khác) sang MP4.',
        'Cố định đầu ra là MP4 (H.264 + AAC) để phát trên thiết bị hiện đại.',
        'Thường tạo ra tệp nhỏ hơn đáng kể so với tệp AVI nguồn.',
        'Tệp AVI cũ có thể được cắt ngắn và co giãn kích thước ngay trong lúc chuyển đổi.',
      ],
      flowSteps: [
        {
          title: 'Tải AVI lên',
          description: 'Thả vào một tệp .avi cũ từ kho lưu trữ hoặc máy quay.',
        },
        {
          title: 'Đầu ra được cố định là MP4',
          description: 'MP4 đã được đặt sẵn — không cần cấu hình gì.',
        },
        {
          title: 'Chuyển đổi',
          description: 'Chúng tôi mã hóa lại sang H.264 + AAC.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu một tệp MP4 hiện đại, nhỏ hơn.',
        },
      ],
      advancedDetails: [
        'AVI thường dùng Xvid/DivX (MPEG-4 Part 2); H.264 hiệu quả gần gấp đôi, nên tệp MP4 thường nhỏ hơn nhiều.',
        'Chúng tôi ép yuv420p để kết quả phát được trong trình duyệt và trên các nền tảng mạng xã hội.',
        'Các bản ghi AVI xen kẽ (interlaced) có thể cần dùng tùy chọn khử xen kẽ trong bộ chuyển đổi video đầy đủ.',
      ],
      whyItMatters: [
        'Tệp AVI có dung lượng lớn và ngày càng khó phát trên thiết bị hiện đại.',
        'MP4/H.264 nhỏ hơn và phát được ở mọi nơi.',
        'Chuyển kho lưu trữ cũ sang MP4 giúp chúng dùng được lâu dài về sau.',
      ],
      useCases: [
        {
          title: 'Kho video cũ',
          description: 'Hiện đại hóa các tệp AVI từ máy quay cầm tay hoặc rip từ DVD thành MP4.',
        },
        {
          title: 'Giải phóng dung lượng',
          description: 'Thu nhỏ một tệp AVI lớn thành MP4 nhỏ hơn.',
        },
        {
          title: 'Phát trên điện thoại và TV',
          description: 'Giúp tệp AVI phát được trên các thiết bị đã bỏ hỗ trợ AVI.',
        },
        {
          title: 'Tải lên web',
          description: 'Biến tệp AVI thành MP4 mà trang web chấp nhận.',
        },
      ],
      whyMediaManipulator: [
        'FFmpeg phía máy chủ giải mã được các codec AVI cũ mà nhiều công cụ khác bó tay.',
        'Đầu ra được cố định ở một cấu hình MP4 đã được kiểm chứng.',
      ],
      privacyNote: 'Tệp AVI của bạn được FFmpeg mã hóa lại trên máy chủ của chúng tôi thành MP4 H.264 hiện đại. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Tệp nguồn của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Làm cách nào để chuyển AVI sang MP4?',
          answer: 'Tải tệp .avi lên và bấm chuyển đổi — đầu ra đã được đặt sẵn là MP4.',
        },
        {
          question: 'Tệp MP4 có nhỏ hơn tệp AVI không?',
          answer: 'Thường là có. H.264 hiệu quả hơn nhiều so với các codec Xvid/DivX mà hầu hết tệp AVI sử dụng.',
        },
        {
          question: 'Công cụ có hỗ trợ tệp AVI DivX/Xvid cũ không?',
          answer: 'Có — FFmpeg giải mã các codec AVI phổ biến và mã hóa lại chúng sang H.264.',
        },
        {
          question: 'Tôi có bị giảm chất lượng không?',
          answer: 'Mã hóa lại là quá trình có mất dữ liệu, nhưng ở chất lượng Cao, sự khác biệt là rất nhỏ và tệp vẫn nhỏ hơn.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Đầu ra được cố định là MP4 (H.264 + AAC, yuv420p, +faststart).',
        ],
      },
      related: [
        {
          label: 'Bộ chuyển đổi video',
          to: '/tools/video-converter',
          description: 'Chuyển mọi video sang MP4.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Thu nhỏ MP4 hơn nữa.',
        },
        {
          label: 'Hướng dẫn bộ chuyển đổi video',
          to: '/tutorials/video/getting-started',
          description: 'Tìm hiểu từng bước các tùy chọn cắt, đổi kích thước và khử xen kẽ.',
        },
      ],
      embed: {
        title: 'Chuyển AVI sang MP4',
        description: 'Tải tệp .avi của bạn lên. Công cụ này cố định đầu ra là MP4 (H.264 + AAC), nên bạn chỉ cần tải lên và chuyển đổi.',
      },
    },
    'convert-mkv-to-mp4': {
      name: 'Chuyển MKV sang MP4',
      h1: 'Chuyển MKV sang MP4 trực tuyến miễn phí',
      tagline: 'Biến tệp .mkv Matroska thành MP4 để phát trực tuyến, tải lên và phát trên các thiết bị không hỗ trợ MKV.',
      metaTitle: 'Chuyển MKV sang MP4 trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển MKV sang MP4 trực tuyến miễn phí. Chuyển video Matroska .mkv sang MP4 (H.264 + AAC) cho các thiết bị và trang web không phát được MKV. Không hình mờ, không cần đăng ký.',
      ogTitle: 'Chuyển MKV sang MP4 trực tuyến miễn phí',
      ogDescription: 'Chuyển video Matroska .mkv sang MP4 phổ biến, phát và tải lên được ở mọi nơi.',
      intro: 'MKV (Matroska) là định dạng chứa linh hoạt, phổ biến cho video chất lượng cao, nhưng rất nhiều điện thoại, trình duyệt, TV thông minh và biểu mẫu tải lên không phát được nó. Chuyển MKV sang MP4 sẽ đặt video vào một định dạng chứa mà các thiết bị đó hiểu được. Media Manipulator mã hóa lại sang H.264 + AAC để kết quả phát và tải lên trơn tru.',
      whatItDoes: [
        'Chuyển tệp Matroska .mkv sang MP4.',
        'Cố định đầu ra là MP4 (H.264 + AAC) để hỗ trợ nhiều thiết bị.',
        'Thêm yuv420p và +faststart để MP4 phát trực tuyến được và bắt đầu ngay lập tức.',
        'Cắt một tập phim MKV hoặc đổi kích thước trước khi tệp MP4 được ghi ra.',
      ],
      flowSteps: [
        {
          title: 'Tải MKV lên',
          description: 'Thả vào một tệp .mkv.',
        },
        {
          title: 'Đầu ra được cố định là MP4',
          description: 'Công cụ này đã đặt sẵn MP4.',
        },
        {
          title: 'Chuyển đổi',
          description: 'Chúng tôi chuyển hoặc chuyển mã video vào một tệp MP4.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu tệp MP4 phát được ở mọi nơi.',
        },
      ],
      advancedDetails: [
        'Nếu MKV đã chứa H.264 + AAC, việc chuyển đổi diễn ra nhanh và không mất chất lượng bằng mắt thường.',
        'Chúng tôi ép yuv420p để MP4 phát được trong Safari và trên các nền tảng mạng xã hội.',
        'MKV có thể chứa nhiều track phụ đề/âm thanh; trình chuyển đổi giữ luồng video chính và track âm thanh đầu tiên.',
      ],
      whyItMatters: [
        'Nhiều thiết bị và trang web đơn giản là không hỗ trợ MKV.',
        'MP4 là định dạng chứa an toàn để chia sẻ và tải lên.',
        'Chuyển đổi giúp video chất lượng cao của bạn dùng được ở mọi nơi.',
      ],
      useCases: [
        {
          title: 'Phát trên điện thoại và TV',
          description: 'Giúp tệp MKV phát được trên thiết bị vốn từ chối nó.',
        },
        {
          title: 'Tải lên web',
          description: 'Biến tệp MKV thành MP4 mà trang web chấp nhận.',
        },
        {
          title: 'Bàn giao cho trình chỉnh sửa',
          description: 'Nhập MP4 vào các trình chỉnh sửa gặp khó khăn với MKV.',
        },
        {
          title: 'Chuẩn hóa thư viện',
          description: 'Đưa các tệp MKV đã tải xuống về cùng định dạng với bộ sưu tập MP4 của bạn.',
        },
      ],
      whyMediaManipulator: [
        'FFmpeg phía máy chủ xử lý được MKV có nhiều track.',
        'Đầu ra được cố định ở một cấu hình MP4 đã được kiểm chứng.',
      ],
      privacyNote: 'Tệp MKV của bạn được FFmpeg mã hóa lại trên máy chủ của chúng tôi thành MP4 mà điện thoại và trình duyệt phát được. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Tệp nguồn của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Làm cách nào để chuyển MKV sang MP4?',
          answer: 'Tải tệp .mkv lên và bấm chuyển đổi — đầu ra đã được đặt sẵn là MP4.',
        },
        {
          question: 'Chuyển MKV sang MP4 có làm giảm chất lượng không?',
          answer: 'Nếu MKV đã dùng H.264, kết quả không mất chất lượng bằng mắt thường ở chất lượng Cao. Nếu không, đó là một lần mã hóa lại có mất dữ liệu thông thường.',
        },
        {
          question: 'Các track âm thanh hoặc phụ đề bổ sung sẽ ra sao?',
          answer: 'Trình chuyển đổi giữ luồng video chính và track âm thanh đầu tiên. Nếu bạn cần nhiều track, hãy liên hệ để chúng tôi xem xét tính năng chọn track.',
        },
        {
          question: 'Vì sao tệp MKV của tôi không phát được?',
          answer: 'Nhiều điện thoại, TV, trình duyệt và trang web không hỗ trợ định dạng chứa MKV, ngay cả khi các codec bên trong là loại phổ biến.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Đầu ra được cố định là MP4 (H.264 + AAC, yuv420p, +faststart). Luồng video chính và track âm thanh đầu tiên được giữ lại.',
        ],
      },
      related: [
        {
          label: 'Bộ chuyển đổi video',
          to: '/tools/video-converter',
          description: 'Chuyển mọi video sang MP4.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Thu nhỏ MP4 để chia sẻ.',
        },
        {
          label: 'Hướng dẫn bộ chuyển đổi video',
          to: '/tutorials/video/getting-started',
          description: 'Tìm hiểu từng bước mọi tùy chọn.',
        },
      ],
      embed: {
        title: 'Chuyển MKV sang MP4',
        description: 'Tải tệp .mkv của bạn lên. Công cụ này cố định đầu ra là MP4 (H.264 + AAC), nên bạn chỉ cần tải lên và chuyển đổi.',
      },
    },
    'convert-mp4-to-webm': {
      name: 'Chuyển MP4 sang WebM',
      h1: 'Chuyển MP4 sang WebM trực tuyến miễn phí',
      tagline: 'Mã hóa lại MP4 thành WebM VP9 mở, nhỏ hơn, hoàn hảo cho video web tải nhanh.',
      metaTitle: 'Chuyển MP4 sang WebM trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển MP4 sang WebM trực tuyến miễn phí. Mã hóa lại MP4 thành WebM VP9 + Opus để video web nhỏ hơn, tải nhanh hơn. Không hình mờ, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Chuyển MP4 sang WebM trực tuyến miễn phí',
      ogDescription: 'Chuyển MP4 sang WebM VP9 mở, nhỏ hơn, lý tưởng để nhúng trên web hiện đại.',
      intro: 'WebM là định dạng video mở được xây dựng cho web. Với video VP9 và âm thanh Opus, nó cho tệp nhỏ hơn MP4 ở cùng chất lượng, nghĩa là trang có video nhúng tải nhanh hơn. Chuyển MP4 sang WebM là lựa chọn đúng khi bạn kiểm soát trình phát — mọi trình duyệt hiện đại đều hỗ trợ sẵn định dạng này.',
      whatItDoes: [
        'Chuyển MP4 (H.264) sang WebM (VP9 + Opus).',
        'Cố định đầu ra là WebM để nhúng nhất quán trên web mở.',
        'Thường tạo ra tệp nhỏ hơn MP4 ở cùng chất lượng hình ảnh.',
        'Rút ngắn hoặc thu nhỏ clip và chọn mức chất lượng cài sẵn trước khi tạo tệp WebM.',
      ],
      flowSteps: [
        {
          title: 'Tải MP4 lên',
          description: 'Thả vào một tệp .mp4.',
        },
        {
          title: 'Đầu ra được cố định là WebM',
          description: 'Công cụ này đã đặt sẵn WebM (VP9 + Opus).',
        },
        {
          title: 'Chuyển đổi',
          description: 'Chúng tôi mã hóa lại H.264 sang VP9 và AAC sang Opus.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu tệp .webm nhỏ hơn cho web.',
        },
      ],
      advancedDetails: [
        'Đầu ra WebM dùng video VP9 với âm thanh Opus khi có thể, và chuyển sang VP8 + Vorbis với các bản dựng FFmpeg không có VP9/Opus.',
        'Mã hóa VP9 chậm hơn H.264 nhưng cho tệp nhỏ hơn ~25-50% ở chất lượng tương đương.',
        'Dùng thẻ <video> với cả nguồn WebM lẫn nguồn MP4 để trình duyệt chọn nguồn tốt nhất mà nó hỗ trợ.',
      ],
      whyItMatters: [
        'Video web nhỏ hơn nghĩa là trang nhanh hơn và hóa đơn băng thông thấp hơn.',
        'WebM miễn phí bản quyền và được mọi trình duyệt hiện đại hỗ trợ.',
        'Một cặp WebM + MP4 bao phủ gần như mọi trình duyệt với tệp nhỏ nhất có thể.',
      ],
      useCases: [
        {
          title: 'Video hero cho trang web',
          description: 'Phục vụ một clip nền hoặc clip hero nhỏ, tải nhanh.',
        },
        {
          title: 'Nhúng trên web mở',
          description: 'Nhúng video mà không phải lo về codec độc quyền.',
        },
        {
          title: 'Tiết kiệm băng thông',
          description: 'Giảm dung lượng truyền tải cho các trang có lưu lượng truy cập cao.',
        },
        {
          title: 'HTML5 <video>',
          description: 'Cung cấp nguồn WebM bên cạnh nguồn MP4 dự phòng.',
        },
      ],
      whyMediaManipulator: [
        'Mã hóa VP9 + Opus, tự động chuyển sang VP8 + Vorbis khi cần.',
        'Đầu ra được cố định là WebM nên kết quả luôn có thể đoán trước.',
      ],
      privacyNote: 'Video của bạn được FFmpeg mã hóa lại trên máy chủ của chúng tôi thành WebM VP9. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Tệp nguồn của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Làm cách nào để chuyển MP4 sang WebM?',
          answer: 'Tải tệp .mp4 lên và bấm chuyển đổi — đầu ra đã được đặt sẵn là WebM.',
        },
        {
          question: 'WebM có nhỏ hơn MP4 không?',
          answer: 'Ở cùng chất lượng hình ảnh, WebM VP9 thường nhỏ hơn MP4 H.264 khoảng 25-50%.',
        },
        {
          question: 'Mọi trình duyệt có hỗ trợ WebM không?',
          answer: 'Mọi trình duyệt hiện đại đều hỗ trợ. Với trình duyệt cũ hơn, hãy cung cấp nguồn MP4 dự phòng trong thẻ <video> của bạn.',
        },
        {
          question: 'Vì sao mã hóa WebM chậm hơn?',
          answer: 'VP9 đòi hỏi nhiều tính toán hơn H.264. Bù lại, bạn có tệp nhỏ hơn.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Đầu ra được cố định là WebM (VP9 + Opus, hoặc VP8 + Vorbis nếu không có VP9/Opus).',
        ],
      },
      related: [
        {
          label: 'Chuyển WebM sang MP4',
          to: '/tools/convert-webm-to-mp4',
          description: 'Chiều ngược lại.',
        },
        {
          label: 'Bộ chuyển đổi video',
          to: '/tools/video-converter',
          description: 'Chuyển mọi video sang MP4.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Thu nhỏ video mà không đổi định dạng chứa.',
        },
      ],
      embed: {
        title: 'Chuyển MP4 sang WebM',
        description: 'Tải tệp .mp4 của bạn lên. Công cụ này cố định đầu ra là WebM (VP9 + Opus), nên bạn chỉ cần tải lên và chuyển đổi.',
      },
    },
    'mp4-to-mp3': {
      name: 'Chuyển MP4 sang MP3',
      tagline: 'Lấy âm thanh của MP4 thành MP3: Tách âm thanh khỏi video với MP4 đầu vào và MP3 đầu ra.',
    },
    'video-to-mp3': {
      name: 'Chuyển video sang MP3',
      tagline: 'Lấy nhạc nền của video thành MP3: cùng công cụ với Tách âm thanh khỏi video.',
    },
    'mp4-to-gif': {
      name: 'Chuyển MP4 sang GIF',
      tagline: 'Tạo GIF lặp từ một clip MP4: bộ chuyển đổi GIF động với đầu vào cố định là MP4.',
    },
    'video-to-gif': {
      name: 'Chuyển video sang GIF',
      tagline: 'Biến một clip ngắn ở bất kỳ định dạng video phổ biến nào thành GIF lặp: cùng công cụ với bộ chuyển đổi GIF động.',
    },
    'gif-converter': {
      name: 'Bộ chuyển đổi GIF',
      tagline: 'Tạo và tinh chỉnh GIF động từ các clip video: bộ chuyển đổi GIF động dưới một tên khác.',
    },
    'video-compressor': {
      name: 'Bộ nén video',
      tagline: 'Thu nhỏ video bằng một cài đặt nén sẵn: cùng công cụ với Nén video.',
    },
    'compress-mp4': {
      name: 'Nén MP4',
      tagline: 'Làm MP4 nhỏ hơn mà vẫn giữ là MP4: Nén video với định dạng chứa được cố định.',
    },
    'mp4-trimmer': {
      name: 'Trình cắt MP4',
      tagline: 'Trình cắt video với MP4 được cố định cho cả đầu vào và đầu ra.',
    },
    'video-cutter': {
      name: 'Trình cắt video',
      tagline: 'Giữ lại một đoạn của video và bỏ phần còn lại: cùng công cụ với trình cắt video.',
    },
    'cut-video-online': {
      name: 'Cắt video trực tuyến',
      tagline: 'Cắt một clip từ video ngay trong trình duyệt, không cần cài đặt gì: trình cắt video dưới một tên khác.',
    },
    'crop-video': {
      name: 'Cắt khung video',
      h1: 'Cắt khung video trực tuyến miễn phí',
      tagline: 'Cắt bỏ phần rìa của video, đổi khung hình hoặc tỷ lệ khung hình mà không cần trình chỉnh sửa.',
      metaTitle: 'Cắt khung video trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ cắt khung video trực tuyến miễn phí. Cắt bỏ phần rìa của video để đổi khung hình hoặc thay đổi tỷ lệ khung hình. Xuất MP4, không hình mờ, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Cắt khung video trực tuyến miễn phí',
      ogDescription: 'Cắt bỏ phần rìa của video để đổi khung hình hoặc thay đổi tỷ lệ khung hình. Miễn phí, không hình mờ.',
      intro: 'Cắt khung là loại bỏ phần rìa bên ngoài của video — hữu ích để đổi khung hình một cảnh quay, cắt bỏ viền đen hoặc hình mờ, hoặc thay đổi tỷ lệ khung hình cho một nền tảng. Công cụ cắt khung video của Media Manipulator nhận một hình chữ nhật tính bằng điểm ảnh (bắt đầu từ đâu và lớn bao nhiêu) và chỉ xuất đúng vùng đó thành một tệp MP4 sạch.',
      whatItDoes: [
        'Cắt khung video theo một hình chữ nhật bạn chỉ định bằng điểm ảnh.',
        'Loại bỏ viền đen, phần rìa, hình mờ hoặc các vùng không mong muốn.',
        'Giúp đổi khung hình sang dạng vuông hoặc dọc cho các nền tảng mạng xã hội.',
        'Mặc định xuất MP4 (H.264 + AAC).',
      ],
      flowSteps: [
        {
          title: 'Tải video lên',
          description: 'Tệp MP4, MOV, MKV, WebM, AVI hoặc M4V cần cắt khung.',
        },
        {
          title: 'Nhập hình chữ nhật cắt khung',
          description: 'Đặt độ lệch X/Y và chiều rộng/chiều cao cần giữ.',
        },
        {
          title: 'Cắt khung',
          description: 'FFmpeg cắt đúng vùng đó và mã hóa lại.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu video đã cắt khung.',
        },
      ],
      advancedDetails: [
        'Tọa độ cắt khung tính bằng điểm ảnh từ góc trên bên trái: X/Y là nơi vùng được giữ bắt đầu, chiều rộng/chiều cao là kích thước của vùng đó.',
        'Cắt khung sẽ mã hóa lại video; đầu ra MP4 dùng H.264 + AAC + yuv420p + faststart.',
        'Để căn khung chính xác đến từng điểm ảnh trên bản xem trước, bộ chuyển đổi đầy đủ ở trang chủ có lớp phủ cắt khung trực quan.',
      ],
      whyItMatters: [
        'Cắt khung giúp đổi khung hình một cảnh quay mà không cần quay lại.',
        'Nó loại bỏ viền đen (letterbox/pillarbox) và các phần rìa không mong muốn.',
        'Thay đổi tỷ lệ khung hình (ví dụ sang 9:16) giúp video vừa với một nền tảng.',
      ],
      useCases: [
        {
          title: 'Chuyển sang dạng dọc',
          description: 'Cắt khung một clip ngang về 9:16 cho Reels/Shorts/TikTok.',
        },
        {
          title: 'Loại bỏ viền đen',
          description: 'Cắt bỏ phần letterbox.',
        },
        {
          title: 'Ẩn hình mờ',
          description: 'Cắt bỏ logo hoặc dấu thời gian ở góc.',
        },
        {
          title: 'Đổi khung hình chủ thể',
          description: 'Thu hẹp khung hình vào phần quan trọng.',
        },
      ],
      whyMediaManipulator: [
        'Cắt khung chính xác đến từng điểm ảnh phía máy chủ bằng FFmpeg.',
        'Đầu ra MP4 sạch, không hình mờ.',
      ],
      privacyNote: 'Video của bạn được cắt theo hình chữ nhật bạn đã vẽ và được FFmpeg mã hóa lại trên máy chủ của chúng tôi. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Tệp nguồn của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Làm cách nào để cắt khung video?',
          answer: 'Tải video lên, nhập hình chữ nhật cần giữ (độ lệch X/Y và chiều rộng/chiều cao tính bằng điểm ảnh), rồi tải video đã cắt khung xuống.',
        },
        {
          question: 'Tôi có thể cắt khung về tỷ lệ vuông hoặc dọc không?',
          answer: 'Có — đặt chiều rộng và chiều cao theo tỷ lệ bạn muốn (ví dụ hai giá trị bằng nhau cho khung vuông, chiều cao lớn hơn chiều rộng cho 9:16).',
        },
        {
          question: 'Cắt khung có làm giảm chất lượng không?',
          answer: 'Cắt khung sẽ mã hóa lại, nhưng ở mức chất lượng mặc định của chúng tôi, mức suy giảm là rất nhỏ.',
        },
        {
          question: 'Tôi có thể cắt bỏ hình mờ không?',
          answer: 'Có, nếu hình mờ nằm gần mép — hãy cắt khung hình để loại nó ra.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Cắt khung sẽ mã hóa lại; đầu ra MP4 dùng H.264 + AAC + yuv420p + faststart.',
        ],
      },
      related: [
        {
          label: 'Đổi kích thước video',
          to: '/tools/resize-video',
          description: 'Thay đổi độ phân giải thay vì cắt khung.',
        },
        {
          label: 'Xoay video',
          to: '/tools/rotate-video',
          description: 'Sửa video bị nằm ngang hoặc lộn ngược.',
        },
        {
          label: 'Bộ chuyển đổi video',
          to: '/tools/video-converter',
          description: 'Chuyển đổi giữa các định dạng video.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Thu nhỏ video đã cắt khung.',
        },
      ],
      embed: {
        title: 'Cắt khung video',
        description: 'Tải video lên và nhập hình chữ nhật cần giữ (độ lệch + chiều rộng/chiều cao tính bằng điểm ảnh). Chúng tôi cắt đúng vùng đó và xuất MP4.',
      },
    },
    'resize-video': {
      name: 'Đổi kích thước video',
      h1: 'Đổi kích thước video trực tuyến miễn phí',
      tagline: 'Thay đổi độ phân giải video: chuyển về 1080p, 720p, 480p hoặc bất kỳ chiều rộng và chiều cao tùy chỉnh nào.',
      metaTitle: 'Đổi kích thước video trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ đổi kích thước video trực tuyến miễn phí. Thay đổi độ phân giải video về 1080p, 720p, 480p hoặc kích thước tùy chỉnh. Xuất MP4, không hình mờ, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Đổi kích thước video trực tuyến miễn phí',
      ogDescription: 'Thay đổi độ phân giải video về 1080p, 720p, 480p hoặc kích thước tùy chỉnh. Miễn phí, không hình mờ.',
      intro: 'Đổi kích thước là thay đổi độ phân giải của video — chuyển clip 4K về 1080p, thu nhỏ về 720p cho web, hoặc đạt đúng kích thước điểm ảnh mà một nền tảng yêu cầu. Công cụ đổi kích thước video của Media Manipulator co giãn video về kích thước bạn chọn, mặc định giữ nguyên tỷ lệ khung hình, và xuất thành một tệp MP4 sạch.',
      whatItDoes: [
        'Co giãn video về chiều rộng và/hoặc chiều cao mục tiêu.',
        'Mặc định giữ nguyên tỷ lệ khung hình (để trống một chiều để tự động co giãn).',
        'Thu nhỏ để giảm dung lượng tệp hoặc phóng to để vừa kích thước mục tiêu.',
        'Mặc định xuất MP4 (H.264 + AAC).',
      ],
      flowSteps: [
        {
          title: 'Tải video lên',
          description: 'Chọn clip bạn muốn đổi sang kích thước khác.',
        },
        {
          title: 'Đặt kích thước',
          description: 'Nhập chiều rộng và/hoặc chiều cao tính bằng điểm ảnh.',
        },
        {
          title: 'Đổi kích thước',
          description: 'FFmpeg co giãn video và mã hóa lại.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu video đã đổi kích thước.',
        },
      ],
      advancedDetails: [
        'Để trống một chiều để co giãn theo tỷ lệ và giữ nguyên tỷ lệ khung hình gốc.',
        'Bật "Giữ tỷ lệ khung hình" để video vừa trong khung mà không bị kéo giãn khi đặt cả hai chiều.',
        'Đổi kích thước sẽ mã hóa lại; đầu ra MP4 dùng H.264 + AAC + yuv420p + faststart. Tối đa 4096 px mỗi cạnh.',
      ],
      whyItMatters: [
        'Độ phân giải thấp hơn nghĩa là tệp nhỏ hơn và tải lên nhanh hơn.',
        'Một số nền tảng yêu cầu độ phân giải chính xác.',
        'Đổi kích thước giúp chuẩn hóa một thư viện có nhiều độ phân giải khác nhau.',
      ],
      useCases: [
        {
          title: 'Thu nhỏ cho web',
          description: 'Hạ 4K xuống 1080p hoặc 720p để trang tải nhanh hơn.',
        },
        {
          title: 'Đạt kích thước mục tiêu',
          description: 'Khớp chính xác thông số của một nền tảng.',
        },
        {
          title: 'Giảm dung lượng tệp',
          description: 'Hạ độ phân giải để bớt số byte.',
        },
        {
          title: 'Chuẩn hóa cảnh quay',
          description: 'Đưa các clip về cùng một độ phân giải.',
        },
      ],
      whyMediaManipulator: [
        'Co giãn có tính đến tỷ lệ khung hình, phía máy chủ bằng FFmpeg.',
        'Đầu ra MP4 sạch, không hình mờ.',
      ],
      privacyNote: 'Video của bạn được co giãn về chiều rộng và chiều cao bạn đặt và được FFmpeg mã hóa lại trên máy chủ của chúng tôi. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm. Tệp nguồn của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Làm cách nào để đổi kích thước video?',
          answer: 'Tải video lên, đặt chiều rộng và/hoặc chiều cao mục tiêu, rồi tải video đã đổi kích thước xuống.',
        },
        {
          question: 'Làm cách nào để đổi độ phân giải về 720p?',
          answer: 'Đặt chiều cao là 720 và để trống chiều rộng để co giãn theo tỷ lệ.',
        },
        {
          question: 'Đổi kích thước có giữ tỷ lệ khung hình không?',
          answer: 'Có — để trống một chiều, hoặc bật "Giữ tỷ lệ khung hình" để video không bị kéo giãn.',
        },
        {
          question: 'Tôi có thể phóng to video không?',
          answer: 'Bạn có thể phóng to lên kích thước lớn hơn, nhưng việc phóng to không thể thêm chi tiết vốn không được ghi lại.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Đổi kích thước sẽ mã hóa lại; đầu ra MP4 dùng H.264 + AAC + yuv420p + faststart. Tối đa 4096 px mỗi cạnh.',
        ],
      },
      related: [
        {
          label: 'Cắt khung video',
          to: '/tools/crop-video',
          description: 'Cắt bỏ phần rìa thay vì co giãn.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Thu nhỏ tệp bằng các mức cài sẵn.',
        },
        {
          label: 'Bộ chuyển đổi video',
          to: '/tools/video-converter',
          description: 'Chuyển sang MP4.',
        },
        {
          label: 'Xoay video',
          to: '/tools/rotate-video',
          description: 'Sửa hướng video.',
        },
      ],
      embed: {
        title: 'Đổi kích thước video',
        description: 'Tải video lên và đặt chiều rộng và/hoặc chiều cao mục tiêu. Để trống một chiều để co giãn theo tỷ lệ. Đầu ra mặc định là MP4.',
      },
    },
    'rotate-video': {
      name: 'Xoay video',
      h1: 'Xoay video trực tuyến miễn phí',
      tagline: 'Sửa video bị nằm ngang hoặc lộn ngược: xoay 90°, 180° hoặc 270° và lật chỉ với một cú nhấp.',
      metaTitle: 'Xoay video trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ xoay video trực tuyến miễn phí. Xoay video 90°, 180° hoặc 270° và sửa các clip bị nằm ngang hoặc lộn ngược. Xuất MP4, không hình mờ, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Xoay video trực tuyến miễn phí',
      ogDescription: 'Xoay video 90°, 180° hoặc 270° để sửa cảnh quay bị nằm ngang hoặc lộn ngược. Miễn phí, không hình mờ.',
      intro: 'Video quay bằng điện thoại thường bị nằm ngang, và một số clip còn bị lộn ngược. Công cụ xoay video của Media Manipulator sửa hướng video một cách triệt để: chọn 90°, 180° hoặc 270° và chúng tôi xoay chính các khung hình (hoán đổi chiều rộng và chiều cao khi xoay 90°/270°), để video phát đúng chiều trên mọi trình phát, chứ không chỉ trên những trình phát biết đọc cờ xoay.',
      whatItDoes: [
        'Xoay video 90° theo chiều kim đồng hồ, 180° hoặc 270° (90° ngược chiều kim đồng hồ).',
        'Tùy chọn lật video theo chiều ngang hoặc chiều dọc (phản chiếu).',
        'Mã hóa lại để phép xoay được ghi hẳn vào các khung hình, chứ không chỉ là một cờ siêu dữ liệu.',
        'Mặc định xuất MP4 (H.264 + AAC).',
      ],
      flowSteps: [
        {
          title: 'Tải video lên',
          description: 'Ví dụ: một clip điện thoại bị nằm ngang.',
        },
        {
          title: 'Chọn góc xoay',
          description: '90°, 180° hoặc 270°, và lật nếu cần.',
        },
        {
          title: 'Xoay',
          description: 'FFmpeg xoay các khung hình (transpose) và mã hóa lại.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu video đã đúng hướng.',
        },
      ],
      advancedDetails: [
        'Chúng tôi dùng bộ lọc transpose của FFmpeg cho 90°/270° (hoán đổi đúng chiều rộng và chiều cao) và transpose hai lần cho 180°.',
        'Ghi phép xoay thẳng vào điểm ảnh giúp sửa lỗi ở những trình phát bỏ qua cờ xoay của container.',
        'Việc xoay cần mã hóa lại; đầu ra MP4 dùng H.264 + AAC + yuv420p + faststart.',
      ],
      whyItMatters: [
        'Video điện thoại bị nằm ngang là một trong những phiền toái phổ biến nhất khi làm việc với video.',
        'Phép xoay được ghi vào khung hình sẽ phát đúng ở mọi nơi, không như cờ xoay.',
        'Lật video giúp sửa cảnh quay selfie/webcam bị phản chiếu.',
      ],
      useCases: [
        {
          title: 'Sửa clip bị nằm ngang',
          description: 'Xoay video dọc quay bằng điện thoại để phát đúng chiều.',
        },
        {
          title: 'Lật video selfie',
          description: 'Bỏ hiệu ứng phản chiếu ở cảnh quay webcam hoặc camera trước.',
        },
        {
          title: 'Xoay 180°',
          description: 'Sửa bản ghi bị lộn ngược.',
        },
        {
          title: 'Chỉnh hướng trước khi biên tập',
          description: 'Đặt đúng hướng trước khi nhập vào phần mềm chỉnh sửa.',
        },
      ],
      whyMediaManipulator: [
        'Xoay thực sự từng khung hình (transpose), không chỉ là một cờ siêu dữ liệu.',
        'Xoay và lật trong cùng một bảng điều khiển gọn gàng.',
      ],
      privacyNote: 'Video của bạn được xoay theo góc bạn chọn và mã hóa lại bằng FFmpeg trên máy chủ của chúng tôi. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp gốc của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Làm thế nào để xoay video?',
          answer: 'Tải video lên, chọn 90°, 180° hoặc 270° rồi tải video đã xoay về.',
        },
        {
          question: 'Làm thế nào để sửa video điện thoại bị nằm ngang?',
          answer: 'Xoay 90° theo chiều hoặc ngược chiều kim đồng hồ cho đến khi video phát đúng chiều; phép xoay được ghi hẳn vào các khung hình.',
        },
        {
          question: 'Công cụ có thật sự xoay khung hình, hay chỉ đặt một cờ?',
          answer: 'Công cụ xoay chính các khung hình (transpose của FFmpeg), nên video đứng đúng chiều trên mọi trình phát.',
        },
        {
          question: 'Tôi có thể lật / phản chiếu video không?',
          answer: 'Có, công cụ có sẵn tùy chọn lật ngang và lật dọc.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Việc xoay mã hóa lại qua bộ lọc transpose của FFmpeg; đầu ra MP4 dùng H.264 + AAC + yuv420p + faststart.',
        ],
      },
      related: [
        {
          label: 'Cắt khung video',
          to: '/tools/crop-video',
          description: 'Cắt bỏ phần viền.',
        },
        {
          label: 'Đổi kích thước video',
          to: '/tools/resize-video',
          description: 'Thay đổi độ phân giải.',
        },
        {
          label: 'Bộ chuyển đổi video',
          to: '/tools/video-converter',
          description: 'Chuyển đổi giữa các định dạng video.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Giảm dung lượng video đã xoay.',
        },
      ],
      embed: {
        title: 'Xoay video',
        description: 'Tải video lên và chọn góc xoay (90°, 180° hoặc 270°). Bạn cũng có thể lật video. Chúng tôi xoay chính các khung hình và xuất MP4.',
      },
    },
    'remove-audio-from-video': {
      name: 'Xóa âm thanh khỏi video',
      h1: 'Xóa âm thanh khỏi video trực tuyến miễn phí',
      tagline: 'Tắt tiếng video vĩnh viễn: gỡ track âm thanh và tải về tệp chỉ có hình, không có tiếng.',
      metaTitle: 'Xóa âm thanh khỏi video trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ trực tuyến miễn phí để xóa âm thanh khỏi video. Gỡ phần tiếng và tải về tệp MP4 không tiếng, chỉ có hình. Không hình mờ, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ogTitle: 'Xóa âm thanh khỏi video trực tuyến miễn phí',
      ogDescription: 'Gỡ track âm thanh khỏi video và tải về tệp không tiếng, chỉ có hình. Miễn phí, không hình mờ.',
      intro: 'Xóa âm thanh khỏi video cho bạn một tệp không tiếng, chỉ có hình: tiện để loại bỏ tiếng ồn nền, bỏ nhạc có bản quyền trước khi tải lên lại, hoặc chuẩn bị một clip mà bạn sẽ thêm âm thanh mới. Media Manipulator gỡ track âm thanh và trả về phần video, sao chép nguyên luồng hình ảnh khi có thể nên không giảm chất lượng.',
      whatItDoes: [
        'Xóa (tắt tiếng) track âm thanh và trả về tệp chỉ có hình.',
        'Sao chép nguyên luồng video khi có thể: không mã hóa lại, không giảm chất lượng.',
        'Chuyển sang mã hóa lại khi container/codec yêu cầu.',
        'Mặc định xuất MP4 (cũng có WebM).',
      ],
      flowSteps: [
        {
          title: 'Tải video lên',
          description: 'Clip mà bạn muốn bỏ tiếng.',
        },
        {
          title: 'Chọn định dạng đầu ra',
          description: 'MP4 (mặc định) hoặc WebM.',
        },
        {
          title: 'Xóa âm thanh',
          description: 'FFmpeg bỏ phần âm thanh và giữ lại phần video.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu tệp không tiếng, chỉ có hình.',
        },
      ],
      advancedDetails: [
        'Chúng tôi sao chép nguyên luồng video (`-c:v copy -an`) nên hình ảnh không bị động đến; nếu container không chấp nhận codec nguồn, chúng tôi mã hóa lại sang H.264.',
        'Đầu ra hoàn toàn không có track âm thanh: video thật sự không tiếng, chứ không chỉ bị hạ âm lượng xuống mức không.',
        'Tên tệp tải về có thêm hậu tố `_silent` để bạn phân biệt với bản gốc.',
      ],
      whyItMatters: [
        'Tắt tiếng loại bỏ vĩnh viễn tiếng ồn nền, tiếng nói chuyện hoặc tiếng gió.',
        'Bỏ nhạc có bản quyền giúp tránh bị gỡ video khi tải lên lại.',
        'Một clip nền không tiếng là điểm khởi đầu để thêm âm thanh mới hoặc lời thuyết minh.',
      ],
      useCases: [
        {
          title: 'Tắt tiếng ồn nền',
          description: 'Loại bỏ âm thanh không mong muốn khỏi clip.',
        },
        {
          title: 'Bỏ âm thanh có bản quyền',
          description: 'Gỡ nhạc trước khi đăng lại.',
        },
        {
          title: 'Chuẩn bị cho âm thanh mới',
          description: 'Có một nền không tiếng để thêm lời thuyết minh.',
        },
        {
          title: 'Quyền riêng tư',
          description: 'Xóa cuộc trò chuyện vô tình bị ghi lại ở phía sau.',
        },
      ],
      whyMediaManipulator: [
        'Sao chép nguyên luồng video, giữ nguyên chất lượng.',
        'Đầu ra thật sự không tiếng (track âm thanh bị gỡ bỏ, không chỉ bị hạ âm lượng).',
      ],
      privacyNote: 'Track âm thanh trong video của bạn được FFmpeg gỡ bỏ trên máy chủ của chúng tôi và phần hình ảnh được giữ lại. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp gốc của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Làm thế nào để xóa âm thanh khỏi video?',
          answer: 'Tải video lên, chọn định dạng đầu ra rồi tải về tệp không tiếng, chỉ có hình.',
        },
        {
          question: 'Công cụ này tắt tiếng video hay gỡ hẳn track âm thanh?',
          answer: 'Công cụ gỡ hoàn toàn track âm thanh, nên kết quả thật sự không có tiếng thay vì chỉ bị hạ âm lượng xuống mức không.',
        },
        {
          question: 'Chất lượng video có thay đổi không?',
          answer: 'Không. Chúng tôi sao chép nguyên luồng video khi có thể, nên hình ảnh không bị động đến.',
        },
        {
          question: 'Tại sao tệp có tên "_silent"?',
          answer: 'Chúng tôi thêm hậu tố _silent để bạn phân biệt bản không có âm thanh với bản gốc.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Video được sao chép nguyên luồng khi có thể; track âm thanh bị gỡ bỏ hoàn toàn. Hậu tố tệp tải về: _silent.',
        ],
      },
      related: [
        {
          label: 'Xóa âm thanh (chỉ giữ hình)',
          to: '/tools/extract-video-only-from-video',
          description: 'Cùng công cụ tạo video không tiếng.',
        },
        {
          label: 'Tách âm thanh khỏi video',
          to: '/tools/extract-audio-from-video',
          description: 'Lưu phần âm thanh thay vì xóa nó.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Giảm dung lượng video không tiếng.',
        },
        {
          label: 'Thêm âm thanh vào video',
          to: '/tools/stitch-audio-to-video',
          description: 'Thêm nhạc nền mới cho clip không tiếng.',
        },
      ],
      embed: {
        title: 'Xóa âm thanh khỏi video',
        description: 'Tải video lên và chúng tôi gỡ track âm thanh, trả về tệp không tiếng, chỉ có hình. Đầu ra mặc định là MP4. Chúng tôi sao chép nguyên luồng video khi có thể (không giảm chất lượng).',
      },
    },
    'audio-converter': {
      name: 'Bộ chuyển đổi âm thanh',
      h1: 'Bộ chuyển đổi âm thanh trực tuyến miễn phí',
      tagline: 'Chuyển đổi giữa MP3, WAV, M4A, OGG, FLAC, OPUS và nhiều định dạng khác, với toàn quyền kiểm soát bitrate, tần số lấy mẫu và kênh.',
      metaTitle: 'Bộ chuyển đổi âm thanh trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Bộ chuyển đổi âm thanh trực tuyến miễn phí cho MP3, WAV, M4A, OGG, FLAC, OPUS và nhiều định dạng khác. Chọn bitrate, tần số lấy mẫu và số kênh.',
      ogTitle: 'Bộ chuyển đổi âm thanh trực tuyến miễn phí',
      ogDescription: 'Chuyển đổi WAV, MP3, M4A, OGG, FLAC, OPUS và nhiều định dạng khác. Chọn bitrate, tần số lấy mẫu và số kênh.',
      intro: 'Mỗi thiết bị, nền tảng lưu trữ podcast và phần mềm chỉnh sửa âm thanh lại cần một định dạng khác nhau. Media Manipulator xử lý mọi định dạng âm thanh phổ biến ở cùng một nơi, với khả năng kiểm soát chi tiết bitrate, tần số lấy mẫu và bố cục kênh.',
      whatItDoes: [
        'Chuyển đổi giữa MP3, WAV, M4A/AAC, OGG, FLAC, ALAC, OPUS, AC3, DTS.',
        'Chọn bitrate, tần số lấy mẫu và bố cục kênh.',
        'Cắt và áp dụng EQ, khử nhiễu hoặc làm sạch bằng AI trong cùng một lần tải lên.',
        'Xuất tệp hợp lệ, có gắn thẻ ID3 khi phù hợp.',
      ],
      flowSteps: [
        {
          title: 'Tải âm thanh lên',
          description: 'MP3, WAV, M4A, FLAC, OGG và nhiều định dạng khác.',
        },
        {
          title: 'Chọn định dạng đầu ra',
          description: 'MP3, WAV, FLAC, M4A, OGG, OPUS.',
        },
        {
          title: 'Điều chỉnh bitrate và tần số',
          description: 'Cắt hoặc chạy làm sạch bằng AI.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu tệp âm thanh đã chuyển đổi.',
        },
      ],
      advancedDetails: [
        'MP3 là định dạng nén phổ quát: mọi thiết bị đều phát được.',
        'FLAC và ALAC là định dạng không mất dữ liệu: lớn hơn MP3, nhỏ hơn WAV.',
        'OPUS (trong OGG) là định dạng nén có mất dữ liệu hiện đại nhỏ gọn nhất cho giọng nói và âm nhạc, rất phù hợp khi bạn kiểm soát được trình phát.',
      ],
      whyItMatters: [
        'Nền tảng podcast, dịch vụ âm nhạc và phần mềm chỉnh sửa âm thanh đều ưu tiên những định dạng khác nhau.',
        'Tệp nhỏ hơn nghĩa là tốn ít dung lượng lưu trữ hơn và truyền tải nhanh hơn.',
        'Định dạng không mất dữ liệu rất quan trọng khi âm thanh sẽ được chỉnh sửa lại.',
      ],
      useCases: [
        {
          title: 'Phát hành podcast',
          description: 'Bản master WAV → tập MP3.',
        },
        {
          title: 'Chia sẻ ghi chú giọng nói',
          description: 'Cắt và nén thành MP3.',
        },
        {
          title: 'Lưu trữ âm nhạc',
          description: 'Chuyển MP3 → FLAC (không tăng chất lượng) hoặc WAV → FLAC để lưu trữ không mất dữ liệu.',
        },
        {
          title: 'Tài nguyên trò chơi và ứng dụng',
          description: 'Chuyển WAV → OPUS để có tài nguyên siêu nhỏ cho thiết bị di động.',
        },
      ],
      whyMediaManipulator: [
        'Toàn quyền kiểm soát bitrate, tần số lấy mẫu và số kênh.',
        'Công cụ làm sạch bằng AI (khử nhiễu, tách riêng giọng hát, xóa giọng hát) trong cùng một lần tải lên.',
        'Miễn phí, không cần đăng ký, không hình mờ.',
      ],
      privacyNote: 'Âm thanh của bạn được FFmpeg giải mã và mã hóa lại trên máy chủ của chúng tôi theo định dạng và bitrate bạn chọn. Không có dịch vụ âm thanh bên ngoài nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Bạn nhận được một tệp mới; bản tải lên không bị thay đổi.',
      faq: [
        {
          question: 'Định dạng nào tốt nhất cho âm nhạc?',
          answer: 'FLAC để lưu trữ không mất dữ liệu, MP3 256–320 kbps để chia sẻ, OPUS cho tệp nhỏ nhất có thể phát trực tuyến.',
        },
        {
          question: 'Định dạng nào tốt nhất cho giọng nói?',
          answer: 'MP3 ở 96–128 kbps là lựa chọn mặc định tuyệt vời cho podcast.',
        },
        {
          question: 'Tôi có thể cắt trong khi chuyển đổi không?',
          answer: 'Có. Đặt số giây bắt đầu/kết thúc trong phần cắt trước khi gửi.',
        },
        {
          question: 'FLAC có thật sự không mất dữ liệu không?',
          answer: 'Có. FLAC nén mà không loại bỏ bất kỳ dữ liệu nào. Khi giải mã, bạn nhận được bản sao giống hệt đầu vào đến từng bit.',
        },
      ],
      related: [
        {
          label: 'Chuyển WAV sang MP3',
          to: '/tools/convert-wav-to-mp3',
          description: 'Bộ chuyển đổi WAV → MP3 chuyên biệt.',
        },
        {
          label: 'Tách giọng hát khỏi bài hát',
          to: '/tools/isolate-vocals-from-song',
          description: 'Lấy riêng giọng hát ra khỏi bản nhạc.',
        },
        {
          label: 'Hướng dẫn bộ chuyển đổi âm thanh',
          to: '/tutorials/audio/getting-started',
          description: 'Hướng dẫn đầy đủ về mọi tùy chọn.',
        },
      ],
      embed: {
        title: 'Chuyển đổi tệp âm thanh',
        description: 'Tải lên bất kỳ tệp âm thanh nào và chọn định dạng đích. MP3 192 kbps là lựa chọn mặc định hợp lý. WAV không mất dữ liệu nhưng dung lượng lớn; M4A/AAC là lựa chọn nén tốt cho âm nhạc.',
      },
    },
    'srt-generator': {
      name: 'Trình tạo phụ đề SRT',
      h1: 'Trình tạo phụ đề SRT miễn phí',
      tagline: 'Tải lên video hoặc tệp âm thanh và tạo tệp phụ đề .srt có thể tải về, sẵn sàng cho YouTube, phần mềm chỉnh sửa và công cụ hỗ trợ tiếp cận.',
      metaTitle: 'Trình tạo SRT miễn phí: Video và âm thanh sang SRT | Media Manipulator',
      metaDescription: 'Tạo tệp phụ đề SRT từ MP4, MOV, MP3, WAV và nhiều định dạng khác. Miễn phí, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Dùng được với YouTube, Premiere, DaVinci Resolve.',
      ogTitle: 'Trình tạo SRT miễn phí: Video và âm thanh sang SRT',
      ogDescription: 'Tạo tệp phụ đề SRT chính xác từ bất kỳ video hoặc tệp âm thanh nào. Chép lời bằng AI cục bộ, không qua nhà cung cấp bên thứ ba.',
      intro: 'SRT (SubRip) là định dạng phụ đề được hỗ trợ rộng rãi nhất trên internet: YouTube, Vimeo, Premiere, DaVinci Resolve, Final Cut và gần như mọi nền tảng mạng xã hội đều chấp nhận. Media Manipulator cho phép bạn tạo tệp SRT từ bất kỳ video hoặc tệp âm thanh nào chỉ với một lần tải lên. Bản chép lời được tạo trên máy chủ GPU của chính chúng tôi bằng whisper-ctranslate2, nên âm thanh không bao giờ rời khỏi hạ tầng của chúng tôi và không bao giờ đến tay nhà cung cấp AI bên thứ ba.',
      whatItDoes: [
        'Chép lời bất kỳ tệp video hoặc âm thanh nào thành tệp phụ đề .srt có mã thời gian.',
        'Dùng whisper-ctranslate2 trên máy chủ GPU cục bộ của chúng tôi: không nhà cung cấp AI bên thứ ba nào thấy tệp của bạn.',
        'Tạo tệp định dạng SubRip (dấu thời gian HH:MM:SS,mmm, các dòng phụ đề được đánh số liên tiếp) tương thích với mọi phần mềm chỉnh sửa video và trình phát lớn.',
        'Hỗ trợ tự nhận diện ngôn ngữ hoặc gợi ý ngôn ngữ BCP-47 tùy chọn để chính xác hơn với clip ngắn.',
      ],
      flowSteps: [
        {
          title: 'Tải tệp lên',
          description: 'Thả vào bất kỳ tệp MP4, MOV, MP3, WAV hoặc tệp được hỗ trợ khác.',
        },
        {
          title: 'Chúng tôi tách âm thanh',
          description: 'FFmpeg lấy track âm thanh ra và chuyển sang định dạng mà whisper cần.',
        },
        {
          title: 'Whisper chép lời',
          description: 'Máy chủ GPU của chúng tôi chạy whisper-ctranslate2 để tạo các đoạn có thời gian.',
        },
        {
          title: 'Tải .srt về',
          description: 'Một tệp SubRip sạch được tạo với các dòng phụ đề liên tiếp và thời gian chính xác.',
        },
      ],
      advancedDetails: [
        'Whisper chạy trên máy chủ GPU NVIDIA của chính chúng tôi bằng ctranslate2; không có API bên ngoài nào tham gia.',
        'Đầu ra SRT dùng dấu thời gian có dấu phẩy trước phần mili giây (00:00:01,234) và các dòng phụ đề được đánh số liên tiếp bắt đầu từ 1, định dạng tương thích tốt nhất với các phần mềm chỉnh sửa.',
        'Quy trình chép lời hỗ trợ tự nhận diện ngôn ngữ hoặc gợi ý BCP-47 tùy chọn kiểu WHISPER_CT2_LANGUAGE qua trường ngôn ngữ.',
        'Đầu ra đi qua cùng hệ thống tác vụ như phần còn lại của ứng dụng; bạn cũng có thể chọn VTT, văn bản thuần hoặc JSON có cấu trúc trong biểu mẫu chép lời.',
      ],
      whyItMatters: [
        'YouTube, Vimeo, Premiere, DaVinci Resolve, Final Cut và hầu hết nền tảng mạng xã hội chấp nhận SRT làm định dạng phụ đề mặc định.',
        'Phụ đề giúp người khiếm thính và người nghe kém tiếp cận video, đồng thời tăng tương tác trên mạng xã hội, nơi phần lớn video tự phát mà không có tiếng.',
        'Công cụ tìm kiếm có thể lập chỉ mục nội dung bản chép lời của video khi bạn đăng kèm một tệp .srt tương ứng.',
      ],
      useCases: [
        {
          title: 'Nhà sáng tạo YouTube',
          description: 'Tạo phụ đề chính xác và tải lên làm track SRT cho mọi video.',
        },
        {
          title: 'Nhà sản xuất khóa học',
          description: 'Thêm bản chép lời cho video bài giảng để học viên có thể tìm kiếm, ôn tập và dịch sau này.',
        },
        {
          title: 'Podcaster đăng lại dưới dạng video',
          description: 'Biến các tập podcast thành clip video có phụ đề cho mạng xã hội.',
        },
        {
          title: 'Đội marketing / mạng xã hội',
          description: 'Thêm phụ đề cho mọi clip để người xem video tự phát không tiếng vẫn nắm được thông điệp.',
        },
      ],
      whyMediaManipulator: [
        'Whisper chạy trên hạ tầng GPU của chính chúng tôi: tệp của bạn không bao giờ đến tay nhà cung cấp AI bên thứ ba.',
        'Không cần đăng ký, không hình mờ. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
        'Dùng cùng công cụ chép lời với phần còn lại của ứng dụng, nên độ chính xác nhất quán giữa các đầu ra SRT, VTT, văn bản thuần và JSON.',
      ],
      privacyNote: 'Lời nói trong tệp của bạn được Whisper chép lại trên máy chủ GPU của chính chúng tôi và căn thời gian thành tệp phụ đề SRT. Việc xử lý AI chạy trên phần cứng do chúng tôi vận hành, không bao giờ qua nhà cung cấp AI bên thứ ba, và không nội dung nào bạn tải lên được dùng để huấn luyện mô hình. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Tệp SRT là gì?',
          answer: 'SRT (SubRip) là tệp phụ đề dạng văn bản thuần có dấu thời gian và số thứ tự cho từng dòng phụ đề. Đây là định dạng phụ đề mặc định được YouTube, hầu hết phần mềm chỉnh sửa video và hầu hết trình phát video chấp nhận.',
        },
        {
          question: 'Tôi có thể tạo phụ đề từ tệp MP4 không?',
          answer: 'Có. Tải lên bất kỳ tệp MP4 nào (hoặc MOV, MKV, WebM, AVI, M4V) và chúng tôi sẽ tạo một tệp phụ đề .srt để bạn tải về.',
        },
        {
          question: 'Tôi có thể dùng tệp SRT trên YouTube không?',
          answer: 'Có. YouTube chấp nhận SRT trực tiếp. Tải video lên, rồi thêm tệp phụ đề trong Phụ đề → Thêm ngôn ngữ → Tải tệp lên.',
        },
        {
          question: 'Những ngôn ngữ nào được hỗ trợ?',
          answer: 'Whisper hỗ trợ hàng chục ngôn ngữ và có thể tự nhận diện ngôn ngữ được nói. Bạn cũng có thể truyền gợi ý BCP-47 (ví dụ en, es, ja) để chính xác hơn với clip rất ngắn.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Việc chép lời chạy trên máy chủ GPU cục bộ của chúng tôi: tệp của bạn không bao giờ được gửi đến nhà cung cấp AI bên ngoài.',
          'Với video dài, tác vụ chạy bất đồng bộ và bạn có thể giữ tab mở để theo dõi tiến trình.',
        ],
      },
      related: [
        {
          label: 'Trình dịch phụ đề',
          to: '/tools/caption-translator',
          description: 'Dịch tệp SRT vừa tạo sang ngôn ngữ khác.',
        },
        {
          label: 'Tách âm thanh khỏi video',
          to: '/tools/extract-audio-from-video',
          description: 'Lấy âm thanh ra trước khi tự chép lời.',
        },
        {
          label: 'Tách khung hình từ video',
          to: '/tools/extract-frames-from-video',
          description: 'Lấy ảnh tĩnh làm hình thu nhỏ và tư liệu tham khảo.',
        },
        {
          label: 'Chuyển mã video sang HLS',
          to: '/tools/transcode-to-hls',
          description: 'Chuẩn bị video để phát trực tuyến.',
        },
        {
          label: 'Chuyển mã video sang DASH',
          to: '/tools/transcode-to-dash',
          description: 'Đóng gói DASH AV1 / VP9.',
        },
      ],
      embed: {
        title: 'Tạo tệp phụ đề SRT',
        description: 'Tải lên video hoặc tệp âm thanh. Chúng tôi chép lời trên máy chủ GPU của chính chúng tôi bằng whisper-ctranslate2 và trả về tệp phụ đề .srt mà bạn có thể đưa vào bất kỳ phần mềm chỉnh sửa video nào.',
      },
    },
    'caption-translator': {
      name: 'Trình dịch phụ đề',
      h1: 'Trình dịch phụ đề miễn phí',
      tagline: 'Dịch tệp phụ đề SRT và VTT mà vẫn giữ nguyên thời gian, thứ tự và cấu trúc của từng dòng phụ đề, không dùng nhà cung cấp AI bên thứ ba.',
      metaTitle: 'Trình dịch phụ đề miễn phí (SRT và VTT): Giữ nguyên dấu thời gian | Media Manipulator',
      metaDescription: 'Dịch phụ đề SRT và VTT trực tuyến mà vẫn giữ chính xác thời gian của từng dòng phụ đề. Chạy trên máy chủ AI cục bộ của chính chúng tôi: phụ đề của bạn không bao giờ được gửi đến nhà cung cấp bên thứ ba.',
      ogTitle: 'Trình dịch phụ đề miễn phí: SRT và VTT',
      ogDescription: 'Dịch phụ đề SRT hoặc VTT mà vẫn giữ nguyên dấu thời gian và thứ tự các dòng phụ đề. AI cục bộ, không qua nhà cung cấp bên thứ ba.',
      intro: 'Dịch tệp phụ đề có sẵn sang ngôn ngữ khác mà không hề động đến thời gian của các dòng phụ đề. Media Manipulator phân tích các dòng phụ đề trong tệp .srt hoặc .vtt của bạn, chỉ dịch phần văn bản bằng mô hình dịch phụ đề được lưu trữ cục bộ của chúng tôi, rồi ghi lại nguyên văn các dấu thời gian gốc. Không API dịch bên thứ ba nào thấy phụ đề của bạn: mô hình chạy trên máy chủ GPU của chính chúng tôi.',
      whatItDoes: [
        'Nhận tệp phụ đề .srt hoặc .vtt và tạo bản dịch cùng định dạng (hoặc định dạng còn lại, nếu bạn chọn).',
        'Giữ nguyên chính xác số thứ tự, thứ tự và dấu thời gian của các dòng phụ đề: chỉ phần văn bản được dịch.',
        'Dịch trên máy chủ mô hình Ollama cục bộ của chúng tôi bằng một mô hình tùy chỉnh được tinh chỉnh cho phụ đề: phụ đề của bạn không bao giờ rời khỏi hạ tầng của chúng tôi.',
        'Hỗ trợ hơn 30 ngôn ngữ đích, gồm các ngôn ngữ lớn ở châu Âu, châu Á và Trung Đông.',
      ],
      flowSteps: [
        {
          title: 'Tải lên .srt hoặc .vtt',
          description: 'Thả tệp phụ đề có sẵn của bạn vào trình tải lên.',
        },
        {
          title: 'Chọn ngôn ngữ',
          description: 'Tự nhận diện hoặc chọn ngôn ngữ nguồn, rồi chọn ngôn ngữ đích.',
        },
        {
          title: 'Chúng tôi dịch văn bản phụ đề',
          description: 'AI cục bộ của chúng tôi chỉ dịch phần văn bản phụ đề: dấu thời gian và thứ tự được giữ cố định.',
        },
        {
          title: 'Tải phụ đề đã dịch về',
          description: 'Nhận lại tệp .srt hoặc .vtt sạch với thời gian giống hệt và bản dịch của từng dòng phụ đề.',
        },
      ],
      advancedDetails: [
        'Việc dịch chạy trên máy chủ Ollama của chính chúng tôi, dùng một biến thể của Translate-Gemma được tinh chỉnh cho phụ đề (mm-captions-translategemma-12b).',
        'Chúng tôi chỉ gửi văn bản phụ đề kèm phần đầu lược đồ JSON nghiêm ngặt cho mô hình và gắn lại thời gian từ tệp gốc khi đọc phản hồi, nên ngay cả một mô hình hoạt động sai cũng không thể làm hỏng thời gian phụ đề của bạn.',
        'Các khối NOTE và STYLE trong tệp VTT được giữ nguyên và không bao giờ được gửi cho trình dịch.',
        'Với track phụ đề dài, chúng tôi chia các dòng phụ đề thành từng lô để mô hình không bao giờ chạm đến giới hạn ngữ cảnh.',
      ],
      whyItMatters: [
        'Dịch phụ đề thủ công rất dễ sai: chỉ cần sơ ý là làm hỏng định dạng dấu thời gian hoặc đảo lộn thứ tự các dòng phụ đề.',
        'Một trình dịch được xây dựng riêng cho phụ đề giữ nguyên cấu trúc tệp mà phần mềm chỉnh sửa và trình phát cần.',
        'Tự dịch bằng mô hình cục bộ giúp quy trình làm việc của nhà sáng tạo không phụ thuộc vào giá cả và chính sách của các dịch vụ dịch bên thứ ba.',
      ],
      useCases: [
        {
          title: 'Kênh YouTube đa ngôn ngữ',
          description: 'Dịch một tệp SRT tiếng Anh gốc sang hơn 5 ngôn ngữ cho cùng một video.',
        },
        {
          title: 'Khóa học trực tuyến',
          description: 'Tiếp cận học viên quốc tế bằng phụ đề tiếng mẹ đẻ của họ.',
        },
        {
          title: 'Phim tài liệu / liên hoan phim',
          description: 'Chuẩn bị track phụ đề dịch mà không động đến thời gian.',
        },
        {
          title: 'Tin tức và báo chí',
          description: 'Dịch track phụ đề tin nóng mà vẫn giữ đồng bộ chính xác.',
        },
      ],
      whyMediaManipulator: [
        'Dịch bằng AI cục bộ: phụ đề của bạn không bao giờ được gửi đến nhà cung cấp AI bên thứ ba.',
        'Phân tích an toàn về thời gian, gắn lại thời gian bắt đầu/kết thúc gốc của từng dòng phụ đề ngay cả khi mô hình hoạt động sai.',
      ],
      privacyNote: 'Chỉ phần văn bản trong tệp SRT hoặc VTT của bạn được đọc: từng dòng phụ đề được dịch bằng một mô hình ngôn ngữ chúng tôi chạy trên máy chủ GPU của chính mình, và thời gian được sao chép sang nguyên vẹn. Việc xử lý AI chạy trên phần cứng do chúng tôi vận hành, không bao giờ qua nhà cung cấp AI bên thứ ba, và không nội dung nào bạn tải lên được dùng để huấn luyện mô hình. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Tôi có thể dịch tệp SRT mà không làm hỏng dấu thời gian không?',
          answer: 'Có, đó chính là mục đích của công cụ này. Chúng tôi phân tích các dòng phụ đề, chỉ dịch phần văn bản, rồi gắn lại chính xác các dấu thời gian gốc trước khi ghi tệp đầu ra.',
        },
        {
          question: 'Những định dạng phụ đề nào được hỗ trợ?',
          answer: 'Cả SubRip (.srt) và WebVTT (.vtt) đều được hỗ trợ. Bạn có thể giữ định dạng đầu ra giống đầu vào hoặc chuyển đổi qua lại giữa chúng.',
        },
        {
          question: 'Tôi có thể dịch phụ đề cho video YouTube không?',
          answer: 'Có. Tạo (hoặc xuất) tệp SRT từ video của bạn, dịch ở đây, rồi tải tệp SRT mới lên YouTube làm track ngôn ngữ bổ sung.',
        },
        {
          question: 'Phụ đề có được dịch bằng nhà cung cấp AI bên thứ ba không?',
          answer: 'Không. Việc dịch chạy trên mô hình do chính chúng tôi lưu trữ bằng Ollama: phụ đề của bạn không bao giờ rời khỏi hạ tầng của chúng tôi.',
        },
        {
          question: 'Thời gian của các dòng phụ đề sẽ ra sao?',
          answer: 'Thời gian bắt đầu và kết thúc của các dòng phụ đề được giữ nguyên chính xác: chúng tôi gắn lại chúng từ tệp gốc sau khi dịch, nên ngay cả một mô hình hoạt động sai cũng không thể làm hỏng thời gian của bạn.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Dung lượng tệp phụ đề tối đa: 2 MB (track phụ đề thực tế thường nhỏ hơn nhiều).',
        ],
        processingNotes: [
          'Việc dịch chạy trên mô hình Ollama được lưu trữ cục bộ: không liên hệ với API dịch bên thứ ba nào.',
          'Các khối NOTE và STYLE trong tệp WebVTT được giữ nguyên trạng.',
        ],
      },
      related: [
        {
          label: 'Trình tạo phụ đề SRT',
          to: '/tools/srt-generator',
          description: 'Tạo tệp SRT mới từ video hoặc tệp âm thanh.',
        },
        {
          label: 'Tách âm thanh khỏi video',
          to: '/tools/extract-audio-from-video',
          description: 'Lấy âm thanh ra để nghe lại hoặc chép lời lại.',
        },
        {
          label: 'Thêm âm thanh vào video',
          to: '/tools/stitch-audio-to-video',
          description: 'Thêm lời thuyết minh đã dịch sau khi dịch phụ đề.',
        },
        {
          label: 'Chuyển mã video sang HLS',
          to: '/tools/transcode-to-hls',
          description: 'Đóng gói video để phát trực tuyến.',
        },
        {
          label: 'Chuyển mã video sang DASH',
          to: '/tools/transcode-to-dash',
          description: 'Đóng gói DASH AV1 / VP9.',
        },
      ],
      embed: {
        title: 'Dịch tệp phụ đề SRT hoặc VTT',
        description: 'Tải lên tệp .srt hoặc .vtt có sẵn, chọn ngôn ngữ đích và nhận lại tệp phụ đề đã dịch với thời gian gốc của các dòng phụ đề được giữ nguyên chính xác.',
      },
    },
    'audio-waveform-generator': {
      name: 'Trình tạo dạng sóng âm thanh',
      h1: 'Trình tạo dạng sóng âm thanh miễn phí',
      tagline: 'Biến bất kỳ tệp âm thanh nào thành video dạng sóng, ảnh dạng sóng hoặc cả hai, tùy chỉnh được, hoàn hảo cho podcast, bản nghe thử nhạc và clip mạng xã hội.',
      metaTitle: 'Trình tạo dạng sóng âm thanh miễn phí: Video và ảnh dạng sóng | Media Manipulator',
      metaDescription: 'Tạo video và hình ảnh dạng sóng từ bất kỳ tệp âm thanh nào. Dải rộng 10:1 cho podcast, bản xem trước vuông cho mạng xã hội, tách kênh stereo, màu tùy chỉnh và nhiều hơn nữa.',
      ogTitle: 'Trình tạo dạng sóng âm thanh miễn phí',
      ogDescription: 'Tạo video và hình ảnh dạng sóng từ MP3, WAV, M4A, FLAC và nhiều định dạng khác. Tùy chỉnh linh hoạt, không cần đăng ký.',
      intro: 'Dạng sóng giúp âm thanh trở nên hữu hình: một tư liệu quan trọng cho podcast, bản nghe thử nhạc, hình thu nhỏ của clip mạng xã hội và dòng thời gian biên tập. Media Manipulator kết xuất dạng sóng bằng các bộ lọc showwaves / showwavespic của FFmpeg, với thiết lập mặc định hợp lý (dải rộng 10:1 ở 1600×160) và một bảng nâng cao đầy đủ để tinh chỉnh chế độ kết xuất, màu sắc, thang và tách kênh stereo.',
      whatItDoes: [
        'Kết xuất video dạng sóng chuyển động bằng bộ lọc showwaves của FFmpeg, với các chế độ point / line / p2p / cline.',
        'Kết xuất hình ảnh dạng sóng tĩnh bằng bộ lọc showwavespic của FFmpeg, hoàn hảo cho hình thu nhỏ và ảnh bìa album.',
        'Hỗ trợ các thiết lập tỷ lệ khung hình được đề xuất (10:1 rộng, 8:1, 6:1, 16:9, 1:1) cùng chiều rộng và chiều cao tùy chỉnh.',
        'Tùy chọn kết xuất tách kênh để kênh trái và kênh phải được vẽ bằng màu riêng.',
      ],
      flowSteps: [
        {
          title: 'Tải âm thanh lên',
          description: 'Thả vào bất kỳ tệp MP3, WAV, M4A, AAC, FLAC hoặc OGG nào.',
        },
        {
          title: 'Chọn đầu ra và kích thước',
          description: 'Chọn video dạng sóng, hình ảnh hoặc cả hai, rồi chọn một thiết lập tỷ lệ khung hình hoặc kích thước tùy chỉnh.',
        },
        {
          title: 'Tinh chỉnh giao diện (tùy chọn)',
          description: 'Điều chỉnh chế độ kết xuất, tốc độ khung hình, màu sắc, thang và chế độ vẽ trong bảng nâng cao.',
        },
        {
          title: 'Tải xuống',
          description: 'Lưu video dạng sóng, hình ảnh hoặc tệp .zip chứa cả hai.',
        },
      ],
      advancedDetails: [
        'Các chế độ kết xuất tương ứng trực tiếp với các chế độ showwaves của FFmpeg: point, line, p2p, cline. Mỗi chế độ đều có bản xem trước trong biểu mẫu để bạn chọn bằng mắt.',
        'Bạn có thể chọn tốc độ khung hình đầu ra (rate=) hoặc số mẫu mỗi cột (n=), không bao giờ cả hai, đúng với việc FFmpeg coi hai tham số này là loại trừ lẫn nhau.',
        'Các tùy chọn thang (lin, log, sqrt, cbrt) cho phép bạn quyết định các đoạn nhỏ tiếng hiển thị rõ đến mức nào.',
        'Khi bạn yêu cầu cả video lẫn hình ảnh, chúng tôi đóng gói chúng vào một tệp .zip duy nhất, qua cùng hệ thống tác vụ như mọi lượt tải xuống khác của Media Manipulator.',
      ],
      whyItMatters: [
        'Hình ảnh dạng sóng giúp nội dung âm thanh dễ chia sẻ: trên các bảng tin mạng xã hội tự phát không tiếng, một clip có dạng sóng chuyển động hiệu quả hơn nhiều so với hình thu nhỏ tĩnh.',
        'Biên tập viên và nhà sản xuất dùng dạng sóng làm tư liệu tham chiếu khi sắp xếp dòng thời gian hoặc thiết kế bìa album.',
        'Một dạng sóng được tinh chỉnh tốt có thể cùng lúc làm hình thu nhỏ, audiogram và đoạn giới thiệu âm thanh.',
      ],
      useCases: [
        {
          title: 'Podcast',
          description: 'Làm audiogram cho mạng xã hội: clip + dạng sóng + phụ đề = định dạng quảng bá podcast hiệu quả nhất.',
        },
        {
          title: 'Bản nghe thử nhạc',
          description: 'Tạo thẻ dạng sóng vuông cho Instagram hoặc thẻ rộng cho phần mô tả trên YouTube.',
        },
        {
          title: 'Dòng thời gian biên tập',
          description: 'Dùng hình ảnh dạng sóng tĩnh làm khung tham chiếu trong Premiere hoặc DaVinci Resolve.',
        },
        {
          title: 'Bàn giao lời thuyết minh',
          description: 'Gửi khách hàng một thẻ dạng sóng kèm tệp WAV để họ xem nhanh trong nháy mắt.',
        },
      ],
      whyMediaManipulator: [
        'Thiết lập mặc định ưu tiên hình dạng hữu ích nhất (rộng 10:1) thay vì mặc định 600×240 của FFmpeg.',
        'Các điều khiển FFmpeg nâng cao được mở ra một cách an toàn: mọi thiết lập đều được kiểm tra phía máy chủ trước khi đưa vào filter graph.',
        'Xuất MP4, PNG hoặc ZIP chứa cả hai, không cần chạy tác vụ thứ hai.',
      ],
      privacyNote: 'Âm thanh của bạn được FFmpeg vẽ thành hình ảnh hoặc video dạng sóng trên máy chủ của chúng tôi. Không có dịch vụ âm thanh bên ngoài nào tham gia. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Bạn nhận được một tệp mới; bản tải lên không bị thay đổi.',
      faq: [
        {
          question: 'Dạng sóng âm thanh là gì?',
          answer: 'Dạng sóng là hình biểu diễn biên độ của tín hiệu âm thanh theo thời gian. Đó là đường chuyển động bạn thấy trong phần mềm chỉnh sửa video và trên các nền tảng như SoundCloud.',
        },
        {
          question: 'Tôi có thể tạo video dạng sóng từ tệp MP3 không?',
          answer: 'Có. Tải lên tệp MP3 (hoặc WAV/M4A/FLAC/OGG/AAC) và công cụ sẽ kết xuất video dạng sóng bằng bộ lọc showwaves của FFmpeg.',
        },
        {
          question: 'Tôi có thể tạo cả hình ảnh dạng sóng không?',
          answer: 'Có. Đặt đầu ra là "Hình ảnh dạng sóng" để có ảnh PNG/WebP tĩnh, hoặc "Cả hai" để nhận tệp ZIP chứa cả video lẫn hình ảnh.',
        },
        {
          question: 'Tôi nên dùng kích thước nào cho dạng sóng?',
          answer: 'Với hầu hết quy trình podcast và âm nhạc, thiết lập rộng 10:1 (1600×160) cho kết quả đẹp nhất. Dùng 16:9 hoặc 1:1 nếu bạn cần hình dạng phù hợp với mạng xã hội.',
        },
        {
          question: 'Các chế độ point, line, p2p và cline có nghĩa là gì?',
          answer: 'Đây là các chế độ kết xuất showwaves của FFmpeg. Point vẽ một chấm cho mỗi mẫu, line vẽ một thanh dọc, p2p nối các chấm bằng một đường, còn cline vẽ một thanh dọc căn giữa. Biểu mẫu có bản xem trước cho từng chế độ.',
        },
        {
          question: 'Tôi có thể tách kênh âm thanh trái và phải không?',
          answer: 'Có. Bật "Tách kênh stereo" trong cài đặt nâng cao và chọn một màu khác nhau cho từng kênh.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Mặc định được đề xuất: dạng sóng rộng 10:1 (1600×160), rất phù hợp cho podcast, bản nghe thử nhạc và dòng thời gian biên tập.',
          'Khi bạn chọn "Cả hai", kết quả được đóng gói vào một tệp ZIP duy nhất chứa cả video lẫn hình ảnh.',
        ],
      },
      related: [
        {
          label: 'Tách âm thanh khỏi video',
          to: '/tools/extract-audio-from-video',
          description: 'Lấy âm thanh ra khỏi video trước khi tạo dạng sóng.',
        },
        {
          label: 'Trình tạo phụ đề SRT',
          to: '/tools/srt-generator',
          description: 'Kết hợp dạng sóng với phụ đề để làm audiogram cho mạng xã hội.',
        },
        {
          label: 'Thêm âm thanh vào video',
          to: '/tools/stitch-audio-to-video',
          description: 'Kết hợp bản kết xuất dạng sóng với một video khác.',
        },
      ],
      embed: {
        title: 'Tạo dạng sóng từ tệp âm thanh',
        description: 'Tải lên tệp âm thanh và chọn bạn muốn video dạng sóng, hình ảnh dạng sóng hay cả hai. Các điều khiển nâng cao cho phép bạn tinh chỉnh kích thước, màu sắc, chế độ kết xuất và cách xử lý stereo. Mặc định là video dạng sóng rộng 10:1, phù hợp cho podcast và bản nghe thử nhạc.',
      },
    },
    'extract-video-only-from-video': {
      name: 'Tách video không âm thanh',
      h1: 'Tách video không âm thanh (chỉ có hình)',
      tagline: 'Xuất bản sao không tiếng, chỉ có hình, với mọi track âm thanh đã được gỡ bỏ, hoàn hảo cho bản xem trước không tiếng, cảnh B-roll, chỉnh sửa và phối nhạc lại.',
      metaTitle: 'Tách video không âm thanh: Xuất bản chỉ có hình | Media Manipulator',
      metaDescription: 'Công cụ trực tuyến miễn phí để xuất bản sao chỉ có hình (không tiếng) với mọi track âm thanh đã được gỡ bỏ. Sao chép nguyên luồng video khi có thể: không mã hóa lại, không giảm chất lượng.',
      ogTitle: 'Tách video không âm thanh (chỉ có hình)',
      ogDescription: 'Xuất bản sao chỉ có hình (không tiếng) của video với mọi track âm thanh đã được gỡ bỏ. Miễn phí, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      intro: 'Đôi khi bạn muốn video mà không có âm thanh: cho bản xem trước không tiếng trên bảng tin mạng xã hội, một cảnh B-roll để đưa vào bản dựng mới, hoặc quy trình phối nhạc lại khi bạn sẽ thêm nhạc mới. Media Manipulator gỡ mọi track âm thanh và xuất ra một tệp sạch chỉ có hình. Luồng video được sao chép nguyên vẹn bất cứ khi nào có thể, nên không mã hóa lại và không giảm chất lượng.',
      whatItDoes: [
        'Gỡ mọi luồng âm thanh khỏi video của bạn.',
        'Sao chép nguyên luồng video bất cứ khi nào có thể: không mã hóa lại, không giảm chất lượng.',
        'Chỉ mã hóa lại sang H.264 baseline tương thích nếu container đích yêu cầu.',
        'Trả về tệp MP4 (hoặc WebM) không tiếng mà bạn có thể đưa thẳng vào bản dựng mới.',
      ],
      flowSteps: [
        {
          title: 'Tải video lên',
          description: 'Thả vào bất kỳ tệp MP4, MOV, MKV, WebM, AVI hoặc M4V nào.',
        },
        {
          title: 'Chọn container đầu ra',
          description: 'MP4 là lựa chọn mặc định an toàn. WebM được cung cấp cho nguồn VP9/AV1.',
        },
        {
          title: 'Chúng tôi gỡ âm thanh',
          description: 'FFmpeg bỏ luồng âm thanh và sao chép luồng video khi có thể.',
        },
        {
          title: 'Tải video không tiếng về',
          description: 'Lưu bản sao sạch, không có âm thanh của video.',
        },
      ],
      advancedDetails: [
        'Lần thử mặc định dùng `-c:v copy` nên không có mã hóa lại: chất lượng luồng video được giữ nguyên đến từng bit.',
        'Nếu container đích từ chối codec nguồn, chúng tôi chuyển sang mã hóa lại bằng libx264 + yuv420p ở CRF 20.',
        'Không hình mờ, không lớp phủ, không đổi tỷ lệ: theo mặc định, hình ảnh đầu ra giống hệt nguồn.',
      ],
      whyItMatters: [
        'Video không tiếng gần như là định dạng tự phát mặc định trên hầu hết các nền tảng mạng xã hội.',
        'Xóa âm thanh cũng là một bước bảo vệ quyền riêng tư: nó loại bỏ giọng nói/cuộc trò chuyện có trong bản ghi màn hình trước khi bạn chia sẻ.',
        'Biên tập viên thường cần một tệp sạch chỉ có hình để phối nhạc lại hoặc đồng bộ với một bản ghi âm khác.',
      ],
      useCases: [
        {
          title: 'Bản xem trước không tiếng cho mạng xã hội',
          description: 'Tạo clip tự phát sạch cho Instagram, X, LinkedIn hoặc TikTok.',
        },
        {
          title: 'Dự án phối nhạc lại',
          description: 'Gỡ âm thanh gốc trước khi thêm nhạc hoặc lời thuyết minh.',
        },
        {
          title: 'Chia sẻ nội dung nhạy cảm về quyền riêng tư',
          description: 'Xóa cuộc trò chuyện ở phía sau bị ghi lại trong lúc quay màn hình.',
        },
        {
          title: 'Chuẩn bị B-roll',
          description: 'Đưa một clip không có âm thanh vào bản dựng nhiều máy quay hoặc dựa trên B-roll.',
        },
      ],
      whyMediaManipulator: [
        'Sao chép nguyên luồng khi có thể: giữ nguyên chất lượng video gốc.',
        'Rõ ràng, nhanh, không cần đăng ký, không hình mờ.',
        'Miễn phí. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Video của bạn được FFmpeg sao chép mà không kèm track âm thanh trên máy chủ của chúng tôi. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp gốc của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Làm thế nào để xóa âm thanh khỏi video?',
          answer: 'Tải video lên và bấm "Bỏ âm thanh khỏi video". Công cụ xuất ra bản sao chỉ có hình trong container bạn chọn.',
        },
        {
          question: 'Chất lượng video có thay đổi không?',
          answer: 'Không, trong trường hợp mặc định. Chúng tôi sao chép nguyên luồng video nên phần hình của đầu ra giống hệt đến từng bit. Chúng tôi chỉ mã hóa lại nếu container đích yêu cầu.',
        },
        {
          question: 'Tôi có thể làm cho tệp MP4 không còn tiếng không?',
          answer: 'Có. MP4 là container đầu ra mặc định và là trường hợp sử dụng phổ biến nhất.',
        },
        {
          question: 'Video gốc có bị thay đổi không?',
          answer: 'Không. Bản tải lên gốc được giữ nguyên. Chúng tôi tạo một tệp mới và giữ hoặc xóa bản tải lên theo quy tắc lưu trữ: Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
        },
        {
          question: 'Nếu video của tôi không có âm thanh thì sao?',
          answer: 'Không sao: công cụ vẫn chạy bình thường và trả về một bản sao được đóng gói lại sạch sẽ.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Luồng video được sao chép mà không mã hóa lại bất cứ khi nào container đích hỗ trợ.',
          'Video đầu vào không có luồng âm thanh vẫn được xử lý bình thường và trả về bản sao được đóng gói lại.',
        ],
      },
      related: [
        {
          label: 'Xóa âm thanh khỏi video',
          to: '/tools/remove-audio-from-video',
          description: 'Trang tắt tiếng / xóa âm thanh dễ dùng cho mọi người.',
        },
        {
          label: 'Tách âm thanh khỏi video',
          to: '/tools/extract-audio-from-video',
          description: 'Lấy track âm thanh ra dưới dạng MP3, WAV, v.v.',
        },
        {
          label: 'Thêm âm thanh vào video',
          to: '/tools/stitch-audio-to-video',
          description: 'Thêm nhạc nền mới cho video không tiếng.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Giảm dung lượng video không tiếng.',
        },
        {
          label: 'Tách khung hình từ video',
          to: '/tools/extract-frames-from-video',
          description: 'Lấy ảnh tĩnh từ video không tiếng.',
        },
      ],
      embed: {
        title: 'Xóa âm thanh khỏi video',
        description: 'Tải video lên và chúng tôi tạo một bản sao không tiếng, chỉ có hình. Luồng video được sao chép nguyên vẹn bất cứ khi nào có thể nên không mã hóa lại và không giảm chất lượng.',
      },
    },
    'extract-frames-from-video': {
      name: 'Tách khung hình từ video',
      h1: 'Tách khung hình từ video',
      tagline: 'Lấy các khung hình tĩnh ra khỏi bất kỳ video nào, cứ mỗi N giây, theo tốc độ khung hình mục tiêu hoặc tại các mốc thời gian cụ thể, rồi tải về dưới dạng ZIP.',
      metaTitle: 'Tách khung hình từ video: Công cụ miễn phí | Media Manipulator',
      metaDescription: 'Công cụ trực tuyến miễn phí để tách ảnh tĩnh từ mọi video. Chọn mỗi N giây, số khung hình mỗi giây hoặc các mốc thời gian cụ thể. Xuất ra tệp ZIP chứa các khung hình JPG, PNG hoặc WebP.',
      ogTitle: 'Tách khung hình từ video',
      ogDescription: 'Lấy các khung hình tĩnh từ MP4, MOV, MKV, WebM, AVI và M4V. Tải về dưới dạng tệp ZIP chứa các khung hình JPG, PNG hoặc WebP.',
      intro: 'Tách khung hình biến một video trở lại thành chuỗi ảnh tĩnh, hữu ích cho ảnh thu nhỏ, ảnh tham chiếu, bản mô phỏng thiết kế, bộ dữ liệu ML và bản xem trước hoạt hình/storyboard. Media Manipulator cho phép bạn lấy mẫu khung hình mỗi N giây, theo tốc độ khung hình mục tiêu hoặc tại các mốc thời gian cụ thể, rồi gói các ảnh thu được vào một tệp ZIP duy nhất để tải xuống.',
      whatItDoes: [
        'Tách các khung hình tĩnh thành ảnh JPG, PNG hoặc WebP.',
        'Hỗ trợ ba chế độ lấy mẫu: mỗi N giây, số khung hình mỗi giây mục tiêu hoặc các mốc thời gian cụ thể.',
        'Gói các khung hình vào một tệp ZIP duy nhất để tải xuống chỉ với một cú nhấp.',
        'Áp dụng giới hạn số khung hình tối đa để mỗi lần chạy luôn nhanh và dễ đoán.',
      ],
      flowSteps: [
        {
          title: 'Tải video lên',
          description: 'Thả vào bất kỳ tệp MP4, MOV, MKV, WebM, AVI hoặc M4V nào.',
        },
        {
          title: 'Chọn chế độ lấy mẫu',
          description: 'Mỗi N giây, một FPS mục tiêu hoặc danh sách mốc thời gian phân cách bằng dấu phẩy.',
        },
        {
          title: 'Chọn định dạng ảnh',
          description: 'JPG cho ảnh thu nhỏ gọn nhẹ, PNG cho ảnh tĩnh không mất dữ liệu, WebP cho tệp hiện đại nhỏ hơn.',
        },
        {
          title: 'Tải xuống ZIP',
          description: 'Mọi khung hình đã tách được gói vào một tệp .zip duy nhất mà bạn có thể giải nén ở bất cứ đâu.',
        },
      ],
      advancedDetails: [
        'Chế độ mỗi N giây và chế độ FPS dùng bộ lọc fps của FFmpeg để lấy mẫu đều trên toàn bộ dòng thời gian.',
        'Chế độ mốc thời gian chạy FFmpeg một lần cho mỗi mốc thời gian được yêu cầu, để lỗi của từng khung hình (yêu cầu vượt quá độ dài video, v.v.) hiện ra rõ ràng.',
        'Giới hạn số khung hình tối đa mặc định là 300 và cao nhất là 1000, giúp tác vụ luôn nhanh và tránh những lần tách vượt tầm kiểm soát.',
      ],
      whyItMatters: [
        'Tách khung hình là cách đơn giản nhất để lấy ảnh thu nhỏ hoặc khung hình tham chiếu từ những video bạn đã có.',
        'Nhà thiết kế và họa sĩ hoạt hình dùng các khung hình lấy mẫu làm tham chiếu khi vẽ và làm B-roll cho storyboard.',
        'Người làm ML dùng chúng để xây dựng bộ dữ liệu phân loại hoặc nhận diện mà không cần một quy trình xử lý tùy chỉnh.',
      ],
      useCases: [
        {
          title: 'Ảnh thu nhỏ và bản xem trước',
          description: 'Chọn một khung hình để làm ảnh thu nhỏ trên YouTube/Vimeo.',
        },
        {
          title: 'Tham chiếu thiết kế',
          description: 'Lấy mẫu một chuỗi khung hình từ gameplay hoặc phim hoạt hình làm tham chiếu khi vẽ.',
        },
        {
          title: 'Storyboard',
          description: 'Tạo một chuỗi khung hình chính cho buổi trình bày storyboard.',
        },
        {
          title: 'Bộ dữ liệu ML',
          description: 'Nhanh chóng xây dựng bộ dữ liệu ảnh nhỏ từ một số ít video.',
        },
      ],
      whyMediaManipulator: [
        'Ba chế độ lấy mẫu đáp ứng gần như mọi nhu cầu thực tế: theo khoảng thời gian, theo FPS hoặc tại các mốc thời gian cụ thể.',
        'Đầu ra ZIP giúp việc tải xuống chỉ cần một cú nhấp, dù bạn lấy bao nhiêu khung hình.',
        'FFmpeg chạy phía máy chủ nên đầu ra luôn nhất quán, bất kể trình duyệt hay khả năng hỗ trợ codec.',
      ],
      privacyNote: 'Các khung hình được FFmpeg trên máy chủ của chúng tôi lấy từ video của bạn theo tần suất bạn chọn và trả về dưới dạng tệp ZIP chứa ảnh. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp nguồn của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Làm thế nào để tách khung hình từ video?',
          answer: 'Tải video lên, chọn chế độ lấy mẫu (mặc định là mỗi N giây), chọn định dạng ảnh và nhấp "Trích xuất khung hình". Kết quả là một tệp ZIP chứa các ảnh tĩnh.',
        },
        {
          question: 'Tôi có thể xuất một khung hình sau mỗi vài giây không?',
          answer: 'Có, đó chính là chế độ mặc định. Đặt "Số giây giữa các khung hình" thành khoảng thời gian bạn muốn.',
        },
        {
          question: 'Hỗ trợ những định dạng ảnh nào?',
          answer: 'JPG (gọn nhẹ, lý tưởng cho ảnh thu nhỏ), PNG (không mất dữ liệu) và WebP (tệp hiện đại nhỏ hơn).',
        },
        {
          question: 'Vì sao công cụ trả về tệp ZIP?',
          answer: 'Ngay cả video ngắn cũng có thể tạo ra hàng chục khung hình. Trả về một tệp ZIP duy nhất giúp việc tải xuống chỉ cần một cú nhấp và tránh phải vật lộn với trình duyệt khi tải nhiều tệp cùng lúc.',
        },
        {
          question: 'Vì sao có giới hạn số khung hình tối đa?',
          answer: 'Giới hạn này ngăn các tác vụ vô tình vượt tầm kiểm soát (ví dụ: tách hàng chục nghìn khung hình từ một video dài). Mặc định là 300 và mức trần tuyệt đối là 1000.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'Mức trần mặc định là 300 khung hình; bạn có thể nâng lên tối đa 1000 trong biểu mẫu nếu thực sự cần nhiều hơn.',
          'Chế độ mốc thời gian nhận danh sách số giây phân cách bằng dấu phẩy (ví dụ: "1, 5.5, 12.25, 30").',
        ],
      },
      related: [
        {
          label: 'Tách âm thanh khỏi video',
          to: '/tools/extract-audio-from-video',
          description: 'Lấy âm thanh ra khỏi chính video đó.',
        },
        {
          label: 'Trình tạo phụ đề SRT',
          to: '/tools/srt-generator',
          description: 'Chép lời chính video đó thành phụ đề .srt.',
        },
        {
          label: 'Xóa âm thanh khỏi video',
          to: '/tools/extract-video-only-from-video',
          description: 'Gỡ âm thanh để giữ lại một bản sao không tiếng của video.',
        },
      ],
      embed: {
        title: 'Tách khung hình từ video',
        description: 'Tải video lên, chọn chế độ lấy mẫu (mỗi N giây, theo tốc độ khung hình hoặc tại các mốc thời gian cụ thể) và tải về tệp ZIP chứa các khung hình tĩnh.',
      },
    },
    'stitch-audio-to-video': {
      name: 'Thêm âm thanh vào video',
      h1: 'Thêm âm thanh vào video',
      tagline: 'Kết hợp video gốc với tối đa ba tệp âm thanh bổ sung như lồng tiếng, nhạc, thuyết minh, rồi tải về một MP4 mới.',
      metaTitle: 'Thêm âm thanh vào video: Lồng tiếng, nhạc, thay thế, trộn | Media Manipulator',
      metaDescription: 'Công cụ trực tuyến miễn phí để thêm lồng tiếng, nhạc hoặc thuyết minh vào video, hoặc thay thế hoàn toàn âm thanh gốc. Điều chỉnh âm lượng và độ lệch cho từng bản âm thanh, xuất MP4.',
      ogTitle: 'Thêm âm thanh vào video',
      ogDescription: 'Thêm lồng tiếng, nhạc, thuyết minh hoặc thay thế âm thanh gốc. Điều chỉnh âm lượng và độ lệch cho từng bản, xuất MP4, không cần đăng ký.',
      intro: 'Kết hợp video gốc với một hoặc nhiều tệp âm thanh bổ sung là một trong những thao tác chỉnh sửa phổ biến nhất: thêm lồng tiếng, chèn nhạc nền, thuyết minh cho bản quay màn hình hoặc thay thế hoàn toàn âm thanh gốc. Media Manipulator cho bạn điều chỉnh âm lượng và độ lệch cho từng bản âm thanh, một nút chuyển giữa trộn và thay thế, cùng đầu ra MP4 phát trơn tru trên mọi trình phát.',
      whatItDoes: [
        'Kết hợp video gốc với tối đa ba bản âm thanh bổ sung.',
        'Điều chỉnh riêng cho từng bản: âm lượng (0–4×), độ lệch bắt đầu tính bằng giây, tùy chọn lặp cho khớp độ dài video.',
        'Nút chọn chế độ chung: "trộn" giữ lại âm thanh gốc, "thay thế" loại bỏ nó.',
        'Đầu ra luôn là MP4 với âm thanh AAC 192 kbps, lựa chọn mặc định an toàn ở mọi nơi.',
      ],
      flowSteps: [
        {
          title: 'Tải video gốc lên',
          description: 'Thả vào bất kỳ tệp MP4, MOV, MKV, WebM, AVI hoặc M4V nào.',
        },
        {
          title: 'Thêm bản âm thanh',
          description: 'Thêm tối đa ba tệp âm thanh (lồng tiếng, nhạc, thuyết minh) với thiết lập riêng cho từng bản.',
        },
        {
          title: 'Chọn trộn hoặc thay thế',
          description: 'Giữ âm thanh gốc và trộn thêm các bản mới, hoặc bỏ âm thanh gốc và chỉ dùng âm thanh mới.',
        },
        {
          title: 'Tải xuống MP4 mới',
          description: 'Chúng tôi ghép trên máy chủ và trả về một tệp MP4 hoàn chỉnh.',
        },
      ],
      advancedDetails: [
        'Đồ thị bộ lọc được dựng tự động bằng mã: mỗi bản có một nút adelay và một nút volume, sau đó một bộ amix duy nhất kết hợp tất cả lại.',
        'Luồng video được sao chép nguyên trạng bất cứ khi nào có thể; chỉ âm thanh được mã hóa lại (sang AAC 192 kbps).',
        'Tính năng lặp được thực hiện bằng `-stream_loop -1` trên đầu vào âm thanh, để các bản nhạc nền ngắn kéo dài gọn gàng đúng bằng thời lượng video.',
        'Theo mặc định, thời lượng đầu ra là "Cắt theo thời lượng video"; bỏ chọn nếu bạn muốn đầu ra kéo dài theo đầu vào dài nhất.',
      ],
      whyItMatters: [
        'Lồng tiếng, nhạc và thuyết minh là những phần âm thanh được thêm vào video ngắn phổ biến nhất.',
        'Điều chỉnh âm lượng và độ lệch cho từng bản giúp bạn tạo một bản phối thực thụ thay vì chỉ chèn một bản âm thanh duy nhất.',
        'Làm việc này trong trình duyệt sẽ chậm và thiếu ổn định; FFmpeg phía máy chủ vừa nhanh vừa chính xác.',
      ],
      useCases: [
        {
          title: 'Video của nhà sáng tạo nội dung',
          description: 'Thêm nhạc nền bên dưới đoạn nói trước ống kính, hoặc thay âm thanh thu trong phòng bằng một bản lồng tiếng sạch.',
        },
        {
          title: 'Video hướng dẫn',
          description: 'Đặt một bản thuyết minh lên trên bản quay màn hình.',
        },
        {
          title: 'Clip mạng xã hội',
          description: 'Thêm một bản nhạc đang thịnh hành tại một độ lệch cụ thể vào đoạn cắt 15 giây.',
        },
        {
          title: 'Video gia đình / cá nhân',
          description: 'Thêm nhạc nền cho đoạn video tổng hợp chuyến đi nghỉ.',
        },
      ],
      whyMediaManipulator: [
        'Điều chỉnh âm lượng và độ lệch cho từng bản, không chỉ chèn một tệp âm thanh duy nhất.',
        'Sao chép nguyên trạng luồng video khi có thể, giữ nguyên chất lượng video gốc.',
        'Miễn phí, không cần đăng ký, FFmpeg chạy phía máy chủ. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Video của bạn và tệp âm thanh bạn thêm được FFmpeg trên máy chủ của chúng tôi ghép thành một tệp MP4. Việc xử lý chạy trên máy chủ của chính chúng tôi, không qua dịch vụ chuyển mã của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm. Tệp nguồn của bạn được giữ nguyên và kết quả là một tệp mới.',
      faq: [
        {
          question: 'Tôi có thể thêm nhạc vào video không?',
          answer: 'Có. Thêm tệp nhạc làm một bản âm thanh, đặt âm lượng cho nó và để chế độ ở "trộn" để giữ âm thanh gốc bên dưới.',
        },
        {
          question: 'Tôi có thể thêm lồng tiếng mà vẫn giữ âm thanh gốc không?',
          answer: 'Có. Giữ chế độ "trộn", thêm bản lồng tiếng, và hạ âm thanh gốc xuống bằng cách đặt âm lượng thấp cho các bản bổ sung nếu bạn muốn lồng tiếng nổi lên trên.',
        },
        {
          question: 'Tôi có thể thay thế bản âm thanh gốc không?',
          answer: 'Có. Đặt chế độ thành "thay thế" và âm thanh gốc sẽ bị loại bỏ. Chỉ các bản đã thêm được trộn vào đầu ra.',
        },
        {
          question: 'Điều gì xảy ra nếu âm thanh dài hơn video?',
          answer: 'Theo mặc định, chúng tôi cắt theo thời lượng video. Bỏ chọn "Cắt theo thời lượng video" nếu bạn muốn đầu ra kéo dài theo đầu vào dài nhất.',
        },
        {
          question: 'Tôi có thể điều chỉnh âm lượng của âm thanh đã thêm không?',
          answer: 'Có. Mỗi bản đã thêm có hệ số âm lượng riêng (0–4×) và độ lệch bắt đầu tính bằng giây.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Tối đa 3 bản âm thanh bổ sung cho mỗi tác vụ.',
        ],
        processingNotes: [
          'Luồng video được sao chép nguyên trạng khi có thể; chỉ âm thanh được mã hóa lại (sang AAC 192 kbps).',
          'Ô Lặp kéo dài các bản nhạc nền ngắn cho khớp độ dài video.',
        ],
      },
      related: [
        {
          label: 'Tách âm thanh khỏi video',
          to: '/tools/extract-audio-from-video',
          description: 'Lấy âm thanh từ một video để dùng lại trong video khác.',
        },
        {
          label: 'Xóa âm thanh khỏi video',
          to: '/tools/extract-video-only-from-video',
          description: 'Gỡ âm thanh để chuẩn bị một nền sạch cho việc phối nhạc lại.',
        },
        {
          label: 'Trình tạo dạng sóng âm thanh',
          to: '/tools/audio-waveform-generator',
          description: 'Tạo phần hình ảnh đi kèm cho bản âm thanh của bạn.',
        },
      ],
      embed: {
        title: 'Thêm hoặc thay thế bản âm thanh của video',
        description: 'Tải video gốc lên, thêm từ một đến ba tệp âm thanh, đặt âm lượng và độ lệch cho từng bản, rồi chọn "trộn" hoặc "thay thế". Chúng tôi trả về một tệp MP4 đã kết hợp tất cả.',
      },
    },
    'ai-frame-interpolation': {
      name: 'Nội suy khung hình bằng AI',
      h1: 'Công cụ nội suy khung hình bằng AI',
      tagline: 'Tăng tốc độ khung hình của video lên 48, 60 hoặc 120 FPS với các khung hình trung gian do AI tạo ra, cho chuyển động mượt hơn.',
      metaTitle: 'Nội suy khung hình bằng AI: Chuyển video sang 60 hoặc 120 FPS | Media Manipulator',
      metaDescription: 'Công cụ nội suy khung hình bằng AI trực tuyến miễn phí. Dùng RIFE để biến video 24/30fps thành MP4 48, 60 hoặc 120 FPS mượt hơn. Không dùng API bên thứ ba, chạy trên GPU của chính chúng tôi.',
      ogTitle: 'Nội suy khung hình bằng AI: Video mượt ở 60 hoặc 120 FPS',
      ogDescription: 'Tải video lên, chọn FPS mục tiêu và tải về MP4 với các khung hình trung gian do AI tạo ra cho chuyển động mượt hơn.',
      intro: 'Nội suy khung hình bằng AI tăng tốc độ khung hình của video bằng cách dùng mạng nơ-ron (RIFE) tạo ra các khung hình trung gian mới, thay vì chỉ nhân bản hoặc hòa trộn các khung hình có sẵn. Kết quả là chuyển động mượt hơn rõ rệt: cảnh quay 24/30fps bắt đầu cho cảm giác như 60fps, còn clip 60fps có thể được nâng lên 120fps, phù hợp với màn hình tần số quét cao. Quá trình xử lý chạy trên máy chủ GPU của chính chúng tôi, không qua API bên thứ ba, và đầu ra là tệp MP4 bạn có thể mở ngay trên mọi trình phát.',
      whatItDoes: [
        'Tổng hợp các khung hình trung gian mới bằng RIFE (rife-ncnn-vulkan) thay vì nhân bản hoặc hòa trộn các khung hình có sẵn.',
        'Hướng tới 48, 60 hoặc 120 FPS với các thiết lập sẵn về chất lượng và chiều cao xử lý tối đa do bạn kiểm soát.',
        'Chạy trên máy chủ GPU của chính chúng tôi: không nhà cung cấp AI bên thứ ba nào thấy tệp của bạn.',
        'Trả về MP4 với H.264 + AAC (bản âm thanh của tệp nguồn được giữ lại theo mặc định).',
        'Giới hạn ngay từ đầu các tệp nguồn quá dài hoặc quá cao, để một tác vụ đơn lẻ không chiếm hết GPU.',
      ],
      flowSteps: [
        {
          title: 'Tải video lên',
          description: 'Thả vào một clip MP4, MOV, WebM, MKV hoặc AVI ngắn.',
        },
        {
          title: 'Mở Công cụ video AI',
          description: 'Trong biểu mẫu video, cuộn đến "Công cụ video AI" và chọn Nội suy khung hình AI.',
        },
        {
          title: 'Chọn FPS mục tiêu và chất lượng',
          description: 'Chọn 48, 60 hoặc 120 FPS cùng chất lượng mã hóa / chiều cao xử lý tối đa.',
        },
        {
          title: 'Chạy nội suy',
          description: 'Chúng tôi tách khung hình, chạy RIFE trên GPU của chúng tôi và mã hóa lại thành MP4 ở FPS mới.',
        },
        {
          title: 'Tải xuống MP4',
          description: 'Lưu clip đã nội suy và xem trước nó bên cạnh bản gốc.',
        },
      ],
      advancedDetails: [
        'Việc tách khung hình dùng ffmpeg với vsync=0 để số khung hình đầu vào khớp chính xác với FPS của tệp nguồn.',
        'RIFE chạy qua rife-ncnn-vulkan với thư mục mô hình được chọn (rife-v4.6 là mặc định được khuyên dùng; rife-v4 và rife-v2.3 cũng có sẵn để tương thích).',
        'Sau khi nội suy, ffmpeg mã hóa lại sang H.264 (libx264) + AAC ở chất lượng đã chọn (CRF 26/20/17 cho thấp/trung bình/cao).',
        'Âm thanh nguồn được ánh xạ lại vào bản mã hóa mới và đầu ra dùng +faststart để tệp phát trực tuyến trơn tru qua HTTP.',
        'Chiều cao xử lý tối đa (mặc định 720p) giới hạn áp lực bộ nhớ GPU với các tệp nguồn có chiều cao lớn; tỷ lệ khung hình gốc được giữ nguyên nhờ phép co giãn -2:min(ih,N).',
      ],
      whyItMatters: [
        'Độ mượt của chuyển động là một trong những khác biệt dễ cảm nhận nhất giữa video phổ thông và video chất lượng truyền hình.',
        'Màn hình hiện đại và nhiều nền tảng mạng xã hội ưu tiên nội dung 60fps và 120fps để phát mượt hơn.',
        'Cảnh quay cũ hoặc có tốc độ khung hình thấp có thể được nâng lên một bậc mà không cần quay lại tư liệu gốc.',
      ],
      useCases: [
        {
          title: '30fps → 60fps cho web',
          description: 'Nâng cảnh quay nói trước ống kính, quay màn hình hoặc vlog lên mức 60fps mượt hơn, vốn phổ biến trên các trang mạng xã hội và video hiện đại.',
        },
        {
          title: '60fps → 120fps để phát trên màn hình tần số quét cao',
          description: 'Chuẩn bị cảnh quay cho màn hình 120Hz/144Hz hoặc cho công đoạn dựng chuyển động chậm phía sau.',
        },
        {
          title: 'Clip ngắn mượt hơn',
          description: 'Làm cho một đoạn cắt 5–10 giây trông mượt hơn rõ rệt trước khi chia sẻ.',
        },
        {
          title: 'Phục hồi clip cũ',
          description: 'Đưa các clip 24/30fps cũ lên 48 hoặc 60fps để có cảm giác phát hiện đại hơn.',
        },
        {
          title: 'Chuẩn bị cho dựng phim',
          description: 'Tạo dòng thời gian dày khung hình hơn trước khi áp dụng chuyển động chậm hoặc đồ họa chuyển động trong trình dựng phim ở công đoạn sau.',
        },
      ],
      whyMediaManipulator: [
        'Chạy trên hạ tầng GPU của chính chúng tôi: không nhà cung cấp AI bên thứ ba nào nhận được tệp.',
        'Dùng rife-ncnn-vulkan, một tệp thực thi Vulkan gọn nhẹ và dễ mang theo, thay vì một bộ PyTorch cồng kềnh: ít phụ thuộc hơn, khởi động nguội nhanh hơn.',
        'Miễn phí, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      ],
      privacyNote: 'Các khung hình trung gian mới cho video của bạn được RIFE tạo ra trên máy chủ GPU của chính chúng tôi. Tác vụ AI chạy trên phần cứng do chúng tôi vận hành, không bao giờ qua nhà cung cấp AI bên thứ ba, và không có gì bạn tải lên được dùng để huấn luyện mô hình. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
      faq: [
        {
          question: 'Nội suy khung hình bằng AI có thực sự cải thiện chất lượng video không?',
          answer: 'Nó cải thiện độ mượt của chuyển động, không phải độ phân giải hay độ sắc nét. Nếu tệp nguồn của bạn đã là 60fps, nó sẽ mượt hơn ở 120fps. Nếu tệp nguồn là 24/30fps, nó sẽ cho cảm giác gần với 60fps hơn. Nó không thể thần kỳ khôi phục những chuyển động thật mà máy quay chưa từng ghi lại.',
        },
        {
          question: 'Nội suy khung hình bằng AI có giống với chỉ tăng FPS không?',
          answer: 'Không. Chuyển đổi FPS cơ bản thường nhân bản, bỏ bớt hoặc hòa trộn các khung hình có sẵn. Nội suy AI tổng hợp các khung hình trung gian hoàn toàn mới dựa trên chuyển động được ước lượng, nên thường trông tự nhiên hơn nhiều so với nhân bản.',
        },
        {
          question: 'Tôi có thể chuyển 30fps sang 60fps không?',
          answer: 'Có. 30fps sang 60fps là một trong những mục tiêu phổ biến nhất và là bài thử đầu tiên tốt.',
        },
        {
          question: 'Tôi có thể chuyển 60fps sang 120fps không?',
          answer: 'Có. 120fps tốn gấp đôi công sức GPU so với 60fps và tạo ra tệp lớn hơn, nên hãy thử với một clip ngắn trước.',
        },
        {
          question: 'Vì sao nội suy khung hình có thể tạo ra lỗi hình ảnh?',
          answer: 'Việc ước lượng chuyển động phải đoán điều gì xảy ra giữa hai khung hình thật. Chuyển động nhanh, bàn tay, tóc, bánh xe, vật che khuất và chỗ chuyển cảnh vốn đã khó hơn: khung hình tổng hợp có thể bị méo, tạo bóng mờ hoặc nhòe ở những vùng đó.',
        },
        {
          question: 'Công cụ tạo ra định dạng đầu ra nào?',
          answer: 'MP4 với video H.264 và âm thanh AAC. Phiên bản v1 chỉ xuất MP4 vì định dạng chứa này phát được ở mọi nơi và hỗ trợ tốc độ khung hình cao hơn mà công cụ này tạo ra.',
        },
        {
          question: '60fps có luôn tốt hơn 30fps không?',
          answer: 'Với video quay màn hình giao diện, thể thao, gameplay và các clip nhiều chuyển động, 60fps thường cho cảm giác trôi chảy hơn. Với nội dung điện ảnh, 24/30fps thường là vẻ ngoài được chủ ý lựa chọn. Hãy chọn FPS phù hợp với cảm giác bạn muốn kết quả mang lại.',
        },
        {
          question: 'Nội suy khung hình bằng AI có tốt hơn minterpolate của FFmpeg không?',
          answer: 'Nội suy AI (RIFE) nhìn chung tạo ra chuyển động sạch hơn bộ lọc minterpolate tích hợp của FFmpeg, đặc biệt với chuyển động không cứng. minterpolate nhanh hơn, đơn giản hơn và vẫn hữu ích cho các lần chuyển đổi dự phòng nhanh.',
        },
        {
          question: 'Vì sao chỗ chuyển cảnh đôi khi trông lạ sau khi nội suy?',
          answer: 'Mô hình giả định các khung hình liền kề thuộc cùng một chuỗi chuyển động. Một chỗ chuyển cảnh đột ngột phá vỡ giả định đó, nên khung hình tổng hợp tại ranh giới có thể bị méo trong chốc lát. Chỗ cắt gọn gàng và clip ngắn sẽ giúp ích.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          'Thời lượng nguồn và chiều cao xử lý tối đa được giới hạn bởi AI_FRAME_INTERPOLATION_MAX_DURATION_SECONDS và AI_FRAME_INTERPOLATION_MAX_HEIGHT trên máy chủ.',
        ],
        processingNotes: [
          'Nội suy AI tốn nhiều GPU. Hãy hạ chiều cao xử lý tối đa để có kết quả nhanh hơn với các tệp nguồn có chiều cao lớn.',
          'Đầu ra là MP4 (H.264 + AAC) trong v1. Âm thanh từ tệp nguồn được giữ lại theo mặc định.',
        ],
      },
      related: [
        {
          label: 'Bộ chuyển đổi video',
          to: '/tools/video-converter',
          description: 'Chuyển đổi MP4, WebM, MOV, AVI, MKV và nhiều định dạng khác.',
        },
        {
          label: 'Nén video',
          to: '/tools/compress-video',
          description: 'Giảm dung lượng tệp video sau khi nội suy.',
        },
        {
          label: 'Chuyển video sang GIF động',
          to: '/tools/convert-video-to-animated-gif',
          description: 'Biến các clip ngắn thành GIF động dễ chia sẻ.',
        },
        {
          label: 'Tách khung hình từ video',
          to: '/tools/extract-frames-from-video',
          description: 'Lấy từng khung hình ra dưới dạng PNG.',
        },
        {
          label: 'Hướng dẫn nội suy khung hình bằng AI',
          to: '/tutorials/ai-frame-interpolation',
          description: 'Tìm hiểu cách nội suy AI hoạt động và khi nào nên dùng.',
        },
      ],
      embed: {
        title: 'Nội suy khung hình bằng AI',
        description: 'Tải lên một video ngắn. Nội suy khung hình AI đã được chọn sẵn: chọn FPS mục tiêu (48, 60 hoặc 120) và công cụ sẽ tổng hợp các khung hình trung gian mới rồi trả về một tệp MP4.',
      },
    },
    // MM100: Aperture's page lines (name, tagline, SEO title and description); full bodies come with MM102-<prefix>. Model-written, needs native review.
    'aperture': {
      name: 'Aperture',
      tagline: 'Trình chỉnh sửa ảnh theo lớp ngay trong trình duyệt: phơi sáng, đường cong, màu sắc, mặt nạ, chữa lành và cài đặt sẵn, xuất ở độ phân giải đầy đủ.',
      metaTitle: 'Aperture, chỉnh sửa ảnh trực tuyến: lớp, đường cong | Media Manipulator',
      metaDescription: 'Chỉnh sửa ảnh trong trình duyệt với Aperture: lớp chỉnh sửa không phá hủy, đường cong, mức, HSL, mặt nạ, chữa lành đốm, cài đặt sẵn và xuất ở độ phân giải đầy đủ.',
    },
    'brighten-image': {
      name: 'Làm sáng ảnh',
      tagline: 'Làm sáng một ảnh tối bằng điều khiển phơi sáng thực thụ trong ánh sáng tuyến tính, hoặc bằng Độ sáng và Vùng tối khi bạn muốn thay đổi nhẹ nhàng và có chọn lọc hơn.',
      metaTitle: 'Làm sáng ảnh trực tuyến: phơi sáng, độ sáng, vùng tối | Aperture',
      metaDescription: 'Làm sáng ảnh tối ngay trong trình duyệt. Phơi sáng theo stop EV, thanh trượt Độ sáng và khôi phục Vùng tối, xem trước trực tiếp và xuất ở độ phân giải đầy đủ.',
    },
    'adjust-image-contrast': {
      name: 'Chỉnh độ tương phản',
      tagline: 'Thanh trượt Độ tương phản xoay quanh màu xám trung bình, cùng Tông và Đường cong khi bạn muốn tăng tương phản mà không làm mất chi tiết ở hai đầu.',
      metaTitle: 'Chỉnh tương phản ảnh trực tuyến: thanh trượt, tông, đường cong | Aperture',
      metaDescription: 'Tăng hoặc giảm độ tương phản của ảnh ngay trong trình duyệt. Thanh trượt Độ tương phản xoay quanh màu xám trung bình; Tông và Đường cong cho bạn kiểm soát hình dạng. Xuất ở kích thước đầy đủ.',
    },
    'fix-photo-exposure': {
      name: 'Sửa phơi sáng',
      tagline: 'Đặt phơi sáng theo stop, rồi khôi phục vùng sáng và vùng tối riêng biệt trong khi biểu đồ tần suất cho bạn thấy còn lại gì để xử lý.',
      metaTitle: 'Sửa ảnh thừa sáng hoặc thiếu sáng trực tuyến | Aperture',
      metaDescription: 'Chỉnh phơi sáng ảnh ngay trong trình duyệt: Phơi sáng theo stop EV cùng khôi phục Vùng sáng, Vùng tối, Điểm trắng và Điểm đen, với biểu đồ tần suất trực tiếp và xuất ở độ phân giải đầy đủ.',
    },
    'adjust-image-hue': {
      name: 'Chỉnh sắc độ ảnh',
      tagline: 'Xoay mọi màu trong ảnh tối đa 180 độ, hoặc chỉ dịch chuyển màu đỏ, xanh lá hay xanh dương, với bản xem trước trực tiếp và xuất ở độ phân giải đầy đủ.',
      metaTitle: 'Chỉnh sắc độ ảnh trực tuyến: tất cả màu hoặc một dải | Media Manipulator',
      metaDescription: 'Dịch sắc độ của cả ảnh từ -180 đến 180 độ, hoặc chỉ di chuyển đỏ, vàng, xanh lá, xanh lơ, xanh dương hay tím đỏ. Xem trước GPU trực tiếp, xuất ở độ phân giải đầy đủ.',
    },
    'change-image-color': {
      name: 'Đổi màu vật thể',
      tagline: 'Chọn màu bằng ống nhỏ giọt, đặt phạm vi vùng chọn, xoay sắc độ rồi xuất: một chiếc xe đỏ thành xanh lá mà vẫn giữ nguyên bóng đổ và phản chiếu.',
      metaTitle: 'Đổi màu của một vật thể trong ảnh trực tuyến | Media Manipulator',
      metaDescription: 'Chọn một vật thể theo màu bằng mặt nạ Dải màu, xoay sắc độ của nó bằng các thanh trượt Màu (HSL) và xuất ở độ phân giải đầy đủ. Bóng đổ và vùng sáng được giữ nguyên.',
    },
    'color-pop': {
      name: 'Nổi bật màu',
      tagline: 'Giữ lại màu đỏ, hoặc màu xanh dương, hoặc bất kỳ họ màu nào trong sáu họ, và chuyển mọi thứ khác sang xám chỉ bằng một phong cách có sẵn mà bạn có thể tinh chỉnh sau.',
      metaTitle: 'Biến ảnh thành đen trắng trừ một màu | Media Manipulator',
      metaDescription: 'Màu chọn lọc ngay trong trình duyệt: giữ đỏ, vàng, xanh lá, xanh lơ, xanh dương hoặc tím đỏ và giảm bão hòa phần còn lại. Sáu phong cách có sẵn, kiểm soát theo từng dải, xuất ở độ phân giải đầy đủ.',
    },
    'image-saturation': {
      name: 'Độ bão hòa ảnh',
      tagline: 'Độ rực rỡ để tăng màu mà vẫn bảo vệ màu da và các màu vốn đã mạnh, Độ bão hòa để điều chỉnh đồng đều, cả hai đều là các lớp bạn có thể tạo mặt nạ.',
      metaTitle: 'Tăng hoặc giảm độ bão hòa ảnh trực tuyến | Aperture',
      metaDescription: 'Thay đổi độ bão hòa của ảnh ngay trong trình duyệt. Độ rực rỡ tăng các màu nhạt và bảo vệ màu da; Độ bão hòa điều chỉnh mọi màu đồng đều. Xuất ở độ phân giải đầy đủ.',
    },
    'photo-levels': {
      name: 'Mức',
      tagline: 'Đặt đen đầu vào, trắng đầu vào, gamma tông trung và dải đầu ra cho từng kênh dựa trên biểu đồ tần suất trực tiếp.',
      metaTitle: 'Chỉnh mức của ảnh trực tuyến: điểm đen, điểm trắng, tông trung',
      metaDescription: 'Mức ngay trong trình duyệt: điểm đen và trắng đầu vào, gamma tông trung và giới hạn đầu ra cho RGB, đỏ, xanh lá và xanh dương, với biểu đồ tần suất trực tiếp.',
    },
    'photo-curves': {
      name: 'Đường cong',
      tagline: 'Tạo hình tông và màu bằng một đường cong kéo được cho RGB và từng kênh, qua tối đa 16 điểm, kèm ống nhỏ giọt.',
      metaTitle: 'Công cụ đường cong ảnh trực tuyến: RGB và từng kênh trong trình duyệt',
      metaDescription: 'Đường cong ngay trong trình duyệt: kéo tối đa 16 điểm trên các đường cong RGB, đỏ, xanh lá và xanh dương, chọn tông bằng ống nhỏ giọt và xuất ở độ phân giải đầy đủ.',
    },
    'white-balance-photo': {
      name: 'Cân bằng trắng',
      tagline: 'Loại bỏ ám vàng, xanh dương, xanh lá hoặc tím đỏ bằng các thanh trượt Nhiệt độ màu và Sắc thái hoạt động trong ánh sáng tuyến tính trên các tông trung.',
      metaTitle: 'Sửa cân bằng trắng và ám màu của ảnh trực tuyến | Aperture',
      metaDescription: 'Sửa ám màu ngay trong trình duyệt. Các thanh trượt Nhiệt độ màu và Sắc thái dịch các tông trung trong ánh sáng tuyến tính, với bản xem trước trực tiếp và xuất ở độ phân giải đầy đủ.',
    },
    'black-and-white-photo': {
      name: 'Ảnh đen trắng',
      tagline: 'Chuyển đơn sắc có trọng số theo kênh với sáu thanh trượt màu, đường cong phim nhẹ nhàng và hạt mịn, áp dụng khi mở và chỉnh được trước khi xuất.',
      metaTitle: 'Chuyển ảnh sang đen trắng trực tuyến | Media Manipulator',
      metaDescription: 'Đen trắng với kiểm soát theo từng màu: sáu thanh trượt kênh quyết định đỏ, vàng, xanh lá, xanh lơ, xanh dương và tím đỏ chuyển thành xám ra sao. Đã áp dụng kiểu phim, xuất ở kích thước đầy đủ.',
    },
    'tint-photo': {
      name: 'Phủ sắc cho ảnh',
      tagline: 'Phủ một màu lên ảnh như bộ lọc trên ống kính: chọn ấm, lạnh, nâu đỏ hoặc bất kỳ màu tùy chỉnh nào, đặt mật độ và giữ nguyên độ sáng.',
      metaTitle: 'Phủ sắc cho ảnh trực tuyến: ấm, nâu đỏ hoặc màu bất kỳ | Media Manipulator',
      metaDescription: 'Thêm sắc màu cho ảnh bằng một lớp Bộ lọc ảnh: ấm, lạnh, nâu đỏ, đỏ, xanh lá, xanh dương hoặc màu hex tùy chỉnh, mật độ 0 đến 100, giữ nguyên độ chói. Xuất ở kích thước đầy đủ.',
    },
    'color-balance-photo': {
      name: 'Cân bằng màu',
      tagline: 'Đẩy riêng đỏ, xanh lá và xanh dương trong vùng tối, tông trung và vùng sáng để loại bỏ ám màu hoặc tạo phong cách, giữ nguyên độ chói.',
      metaTitle: 'Cân bằng màu ảnh trực tuyến: sửa ám màu | Media Manipulator',
      metaDescription: 'Chín thanh trượt, đỏ, xanh lá và xanh dương cho vùng tối, tông trung và vùng sáng, kèm giữ nguyên độ chói. Sửa ám xanh dương hoặc cam, hoặc chỉnh màu cho ảnh, rồi xuất ở kích thước đầy đủ.',
    },
    'split-toning': {
      name: 'Chia tông màu',
      tagline: 'Đẩy một sắc độ vào vùng tối và một sắc độ khác vào vùng sáng, rồi trượt điểm cân bằng giữa chúng.',
      metaTitle: 'Chia tông màu trực tuyến: tô màu vùng tối và vùng sáng riêng biệt',
      metaDescription: 'Phủ sắc cho vùng tối và vùng sáng bằng hai sắc độ khác nhau ngay trong trình duyệt: thanh trượt sắc độ, độ bão hòa và cân bằng, so sánh trước/sau trực tiếp, xuất ở độ phân giải đầy đủ.',
    },
    'apply-lut-to-photo': {
      name: 'Áp dụng LUT',
      tagline: 'Thả một LUT 3D .cube lên ảnh, đặt cường độ và xuất ảnh đã chỉnh màu ở độ phân giải đầy đủ.',
      metaTitle: 'Áp dụng LUT cho ảnh trực tuyến: tải tệp .cube trong trình duyệt',
      metaDescription: 'Tải một LUT 3D .cube kích thước tối đa 65 và 1 MB, xem ngay kết quả chỉnh màu trên ảnh, hòa trộn bằng thanh trượt cường độ và xuất ở kích thước đầy đủ.',
    },
    'invert-image-colors': {
      name: 'Đảo ngược màu',
      tagline: 'Lật mọi điểm ảnh thành âm bản, dưới dạng một lớp không phá hủy mà bạn có thể tạo mặt nạ, hòa trộn hoặc hoàn tác.',
      metaTitle: 'Đảo ngược màu ảnh trực tuyến: tạo âm bản của ảnh',
      metaDescription: 'Đảo ngược ảnh thành âm bản ngay trong trình duyệt chỉ bằng một cú nhấp. Mỗi kênh trở thành 1 trừ đi giá trị của nó; tạo mặt nạ, xếp chồng và xuất ở độ phân giải đầy đủ.',
    },
    'posterize-image': {
      name: 'Phân tách tông màu',
      tagline: 'Thu gọn mỗi kênh về một số mức đã chọn để có màu phẳng kiểu áp phích với các bậc tông cứng.',
      metaTitle: 'Phân tách tông màu ảnh trực tuyến: 2 đến 255 mức mỗi kênh',
      metaDescription: 'Phân tách tông màu ảnh ngay trong trình duyệt bằng cách ép mỗi kênh về 2-255 mức. Xem các dải trực tiếp, kết hợp với đen trắng, xuất ở kích thước đầy đủ.',
    },
    'reduce-image-noise': {
      name: 'Giảm nhiễu ảnh',
      tagline: 'Giảm nhiễu độ chói và nhiễu màu riêng biệt với bản xem trước trực tiếp, rồi xuất ở độ phân giải đầy đủ.',
      metaTitle: 'Giảm nhiễu ảnh trực tuyến: khử nhiễu độ chói và màu',
      metaDescription: 'Khử nhiễu ảnh ISO cao nhiều hạt ngay trong trình duyệt: bộ lọc song phương cho độ chói và Gaussian cho màu, đánh giá ở mức thu phóng 100%, xuất ở độ phân giải đầy đủ.',
    },
    'add-vignette': {
      name: 'Thêm tối góc',
      tagline: 'Làm tối hoặc sáng các cạnh của ảnh với điểm giữa, độ tròn, độ mềm viền và bảo vệ vùng sáng.',
      metaTitle: 'Thêm hoặc xóa tối góc trực tuyến: điểm giữa, độ tròn, độ mềm viền',
      metaDescription: 'Thêm hiệu ứng tối góc tối hoặc sáng cho ảnh ngay trong trình duyệt, hoặc triệt tiêu tối góc của ống kính bằng một lượng dương. Năm thanh trượt, xem trước trực tiếp và xuất ở độ phân giải đầy đủ.',
    },
    'sharpen-photo-online': {
      name: 'Làm nét ảnh',
      tagline: 'Unsharp mask với lượng, bán kính và ngưỡng trên độ chói, cùng Độ rõ nét và Kết cấu, đánh giá ở 100%.',
      metaTitle: 'Làm nét ảnh trực tuyến với lượng, bán kính và ngưỡng',
      metaDescription: 'Làm nét ảnh ngay trong trình duyệt bằng unsharp mask thực thụ: lượng 0-500, bán kính 0.1-50 px, ngưỡng 0-255, cùng Độ rõ nét và Kết cấu. Xem trước trực tiếp, xuất ở độ phân giải đầy đủ.',
    },
    'straighten-photo': {
      name: 'Chỉnh thẳng ảnh',
      tagline: 'Sửa đường chân trời bị nghiêng theo góc hoặc bằng cách vẽ một đường, rồi tự động cắt thành hình chữ nhật lớn nhất.',
      metaTitle: 'Chỉnh thẳng ảnh bị nghiêng trực tuyến: sửa đường chân trời',
      metaDescription: 'Làm phẳng đường chân trời bị nghiêng ngay trong trình duyệt: nhập một góc hoặc vẽ một đường dọc đường chân trời, tự động cắt thành hình chữ nhật nội tiếp lớn nhất và xuất ở độ phân giải đầy đủ.',
    },
    'fix-perspective-photo': {
      name: 'Sửa phối cảnh',
      tagline: 'Kéo bốn góc để sửa méo hình thang và các đường thẳng đứng hội tụ, rồi tự động cắt kết quả.',
      metaTitle: 'Sửa phối cảnh ảnh trực tuyến: chỉnh méo hình thang',
      metaDescription: 'Sửa các đường thẳng đứng hội tụ và méo hình thang ngay trong trình duyệt bằng cách kéo bốn góc. Ánh xạ xạ ảnh, lấy mẫu lại song tuyến tính, tự động cắt và xuất ở độ phân giải đầy đủ.',
    },
    'remove-blemishes': {
      name: 'Xóa khuyết điểm',
      tagline: 'Tô lên các đốm, nhấn Chữa lành, và để mô hình tô vá trên GPU của chúng tôi lấp chúng từ vùng da xung quanh.',
      metaTitle: 'Xóa khuyết điểm và đốm khỏi ảnh trực tuyến: công cụ Chữa lành',
      metaDescription: 'Tô lên mụn, đốm bụi và các vết thừa, nhấn Chữa lành và mô hình tô vá trên GPU của chính chúng tôi sẽ lấp chúng. Một tác vụ AI mỗi lần nhấn, được hoàn lại nếu thất bại, xuất ở độ phân giải đầy đủ.',
    },
    'select-by-color': {
      name: 'Chọn theo màu',
      tagline: 'Chọn một màu bằng ống nhỏ giọt, mở rộng dải bằng độ nhòe và chỉ chỉnh vùng chọn đó.',
      metaTitle: 'Chọn theo màu trong ảnh trực tuyến: mặt nạ dải màu',
      metaDescription: 'Tạo mặt nạ dải màu ngay trong trình duyệt: ống nhỏ giọt, Shift+nhấp để thêm tối đa 8 màu, độ nhòe đo bằng khoảng cách màu Lab, làm mờ viền và đảo ngược, rồi chỉ chỉnh vùng chọn.',
    },
  },
} as const;

export default viToolPages;
