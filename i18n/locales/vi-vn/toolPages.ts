/**
 * Vietnamese partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope (MM67, 2026-10-27): only Motion's full page body, which
 * `i18n/motionTranslations.test.ts` requires for every `translated: true`
 * locale (coordinator decision; the ticket otherwise keeps toolPages out of
 * scope). The other tool pages render English until a later session adds
 * per-slug entries here, as de/es do.
 *
 * Register: "bạn"; brand names, formats and codecs stay untranslated;
 * "Darkroom" and "Motion" stay as they are. Model-written, needs native review.
 */

const viToolPages = {
  pages: {
    // MM48/MM67: Motion's full page body (model-written, needs native review). The brand stays "Motion".
    motion: {
      tagline: 'Vẽ hoặc nhập SVG, tạo hoạt ảnh trên dòng thời gian keyframe và xuất thành SVG động, Lottie, React, JavaScript, Flutter hoặc GIF, tất cả ngay trong trình duyệt của bạn.',
      intro: 'Motion là trình biên tập SVG có dòng thời gian hoạt ảnh, tích hợp trong Media Manipulator. Mở một tệp SVG (hoặc hoạt ảnh Lottie) và mỗi hình trở thành một lớp bạn có thể chọn, di chuyển, đổi màu và tạo hoạt ảnh, hoặc bắt đầu từ vùng vẽ trống và vẽ bằng các công cụ hình chữ nhật, hình elip, đường thẳng, bút và văn bản. Mỗi thuộc tính được tạo hoạt ảnh có track keyframe riêng, với các thiết lập easing, trình chỉnh sửa đường cong cho easing tùy chỉnh, và khóa giữ cho các bước nhảy tức thì. Các bộ tạo hoạt ảnh một chạm thêm hiệu ứng vẽ dần nét, di chuyển theo đường, biến hình, đổi màu chuyển màu, hoạt ảnh mặt nạ và làm mờ. Khi chuyển động đã như ý, hãy xuất thành SVG động, tệp Lottie, component React, module JavaScript hoặc TypeScript, widget Flutter hoặc GIF. Việc chỉnh sửa và mọi lần xuất đều chạy trong trình duyệt của bạn, nên đồ họa của bạn không bao giờ bị tải lên để xuất.',
      whatItDoes: [
        'Nhập tệp SVG thành cây lớp có thể chỉnh sửa (nhóm, đường path, hình, văn bản, hình ảnh, chuyển màu, mặt nạ và đường cắt) và nhập hoạt ảnh Lottie JSON kèm keyframe của chúng.',
        'Vẽ đồ họa mới bằng các công cụ hình chữ nhật, hình elip, đường thẳng, bút (Bézier) và văn bản, và chỉnh sửa các nút của đường path ngay trên vùng vẽ.',
        'Tạo hoạt ảnh cho vị trí, tỷ lệ, xoay, nghiêng, độ mờ, màu tô, nét và độ dày nét trên dòng thời gian keyframe với easing tuyến tính, ease-in, ease-out, ease-in-out, cubic-bezier tùy chỉnh và giữ.',
        'Thêm hoạt ảnh nâng cao chỉ với một cú nhấp: vẽ dần nét, di chuyển theo đường với tùy chọn tự động xoay, biến hình, màu điểm dừng chuyển màu, hoạt ảnh mặt nạ và đường cắt, và làm mờ.',
        'Xuất SVG tĩnh (luôn miễn phí), SVG động phát được mà không cần thư viện nào, Lottie JSON, component React, module JavaScript hoặc TypeScript, widget Flutter và GIF động.',
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
        'Bản xuất SVG động dùng keyframe CSS thuần bất cứ khi nào mọi hiệu ứng đều biểu diễn được bằng CSS trên Chrome, Firefox và Safari. Biến hình, điểm dừng chuyển màu di chuyển và làm mờ cần một script nhỏ, nên các tệp đó nhúng một bản rút gọn của anime.js (giấy phép MIT, khoảng 14 KB sau nén) kèm thông báo giấy phép ở đầu tệp.',
        'Biến hình chuẩn hóa cả hai hình về cùng số đoạn cong và căn chỉnh điểm bắt đầu cùng chiều vẽ, để quá trình biến hình không bị xoắn. Hai hình không thể ghép cặp sẽ được giữ nguyên thay vì biến hình.',
        'Bộ ghi Lottie hướng đến đặc tả Lottie 1.0.1 và tập tính năng "Basic" của LottieFiles. Bất cứ thứ gì Lottie không chứa được (như bộ lọc, văn bản hoặc mặt nạ nâng cao) sẽ được liệt kê sau khi tải xuống; không có gì bị bỏ đi trong im lặng.',
        'Xuất GIF dùng bộ mã hóa được viết riêng cho Media Manipulator, với một bảng màu chung xây dựng từ các khung hình trải khắp hoạt ảnh, để đồ họa vector phẳng giữ đúng màu.',
        'SVG nhập vào được làm sạch ngay khi vào: script, trình xử lý sự kiện, tham chiếu bên ngoài và nội dung không an toàn khác bị gỡ bỏ, và trình biên tập dựng lại mã không được hỗ trợ từ danh sách cho phép thay vì chèn dưới dạng HTML.',
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
      whyMediaManipulator: [
        'Một trình biên tập lớp và keyframe thực thụ với giữ, đường cong tùy chỉnh và bộ tạo hoạt ảnh nâng cao, không phải thư viện mẫu.',
        'Bản xuất cho cả nhà thiết kế lẫn lập trình viên: SVG động, Lottie, React, JavaScript hoặc TypeScript, Flutter và GIF từ một dự án duy nhất.',
        'Bản xuất được tạo trong trình duyệt của bạn, và mã bên thứ ba duy nhất mà bản xuất dùng đều có giấy phép thoáng (anime.js theo MIT; flutter_svg và webview_flutter cho Flutter), với thông báo giấy phép được giữ trong tệp.',
      ],
      privacyNote: 'Việc chỉnh sửa và xuất diễn ra trong trình duyệt của bạn; đồ họa của bạn không được tải lên để xuất. Không có tài khoản, dự án chỉ được lưu trong trình duyệt này. Nếu bạn đăng nhập và lưu dự án vào tài khoản, nó được lưu trên máy chủ của chúng tôi như một dự án Darkroom, tuân theo thời gian lưu bạn chọn, và có thể bị xóa từ trang Tài khoản. Với mỗi lần xuất, chúng tôi chỉ ghi lại định dạng, kích thước, độ dài và thời điểm, để áp dụng hạn mức hằng ngày.',
      faq: [
        {
          question: 'Motion có miễn phí không?',
          answer: 'Có. Mở Motion, vẽ, tạo hoạt ảnh, lưu và xuất SVG tĩnh đều miễn phí và không giới hạn, không cần tài khoản. Xuất hoạt ảnh được tính vào hạn mức hằng ngày tùy theo gói của bạn; bảng gói trên trang này hiển thị hạn mức và định dạng của từng gói.',
        },
        {
          question: 'Tôi có thể xuất những định dạng nào?',
          answer: 'SVG tĩnh, SVG động (CSS, hoặc một script nhỏ nhúng kèm khi cần), Lottie JSON, component React (.tsx), module JavaScript hoặc TypeScript, widget Flutter (.dart) và GIF động. Gói của bạn bao gồm những định dạng nào, và số lần xuất mỗi ngày, được hiển thị trong bảng gói trên trang này.',
        },
        {
          question: 'Giới hạn là gì?',
          answer: 'Xuất hoạt ảnh được đếm theo ngày và đặt lại vào nửa đêm UTC. Khách không có tài khoản chỉ có thể lưu dự án trong trình duyệt; các gói có đăng nhập lưu được một số dự án vào tài khoản. Khách cũng có độ dài hoạt ảnh tối đa khi xuất, và xuất GIF có giới hạn kích thước và độ dài. Mọi con số hiện hành đều có trong bảng gói trên trang này và trên trang giá.',
        },
        {
          question: 'Tôi có thể tạo hoạt ảnh cho SVG có sẵn không?',
          answer: 'Có. Nhập bất kỳ SVG nào và các nhóm, đường path, hình, văn bản, chuyển màu, mặt nạ và đường cắt của nó trở thành các lớp có thể chỉnh sửa. Những phần trình biên tập không chỉnh sửa được, như pattern hoặc bộ lọc phức tạp, được giữ nguyên và xuất ra không đổi, và bất cứ thứ gì không an toàn (script hoặc liên kết bên ngoài) bị gỡ bỏ và liệt kê sau khi nhập.',
        },
        {
          question: 'Có hỗ trợ Lottie không?',
          answer: 'Có, theo cả hai chiều. Bạn có thể nhập tệp Lottie JSON để chỉnh sửa, và xuất hoạt ảnh của mình thành Lottie JSON cho lottie-web và các trình phát Lottie trên iOS, Android và Flutter. Các tính năng mà một bên không biểu diễn được sẽ được liệt kê trong hộp thoại thay vì bị bỏ đi trong im lặng.',
        },
        {
          question: 'Trình duyệt nào hỗ trợ xuất video?',
          answer: 'Xuất GIF hoạt động trên mọi trình duyệt hiện đại. Xuất MP4 và WebM dựa vào WebCodecs, bộ mã hóa video tích hợp của trình duyệt, có trên Chrome và Edge và trên các phiên bản gần đây của Safari và Firefox tùy theo codec; hộp thoại xuất kiểm tra trình duyệt của bạn và báo khi không thể mã hóa. Bảng gói trên trang này hiển thị gói nào bao gồm từng định dạng video.',
        },
        {
          question: 'Giấy phép nào áp dụng cho mã xuất ra?',
          answer: 'Hoạt ảnh của bạn thuộc về bạn. Khi một SVG động hoặc bản xuất mã cần runtime, nó dùng anime.js, được cấp phép theo MIT; thông báo bản quyền của nó được ghi ở đầu tệp và phải được giữ nguyên ở đó. Bản xuất Flutter dùng gói flutter_svg (MIT) hoặc webview_flutter (BSD-3-Clause). Mọi thứ còn lại trong tệp được tạo từ dự án của bạn. Các thư viện mã nguồn mở mà trình biên tập sử dụng được liệt kê trên trang giấy phép của chúng tôi.',
        },
        {
          question: 'Dự án của tôi được lưu ở đâu?',
          answer: 'Không có tài khoản, dự án chỉ được lưu trong trình duyệt này, nên xóa dữ liệu trình duyệt sẽ xóa chúng. Khi đã đăng nhập, bạn có thể lưu dự án vào tài khoản; khi đó nó đồng bộ giữa các thiết bị, tự động lưu trong lúc bạn làm việc, tuân theo thời gian lưu bạn đã chọn và có thể bị xóa từ trang Tài khoản.',
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
    },
  },
} as const;

export default viToolPages;
