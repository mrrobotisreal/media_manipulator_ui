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
      name: 'Motion',
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
    // 2026-10-28 catalog expansion: name + tagline for the /tools catalog cards (model-written, needs native review).
    'inspect-metadata': {
      name: 'Trình kiểm tra siêu dữ liệu',
      tagline: 'Xem mọi thẻ ẩn trong ảnh, video, tệp âm thanh hoặc PDF: EXIF, vị trí GPS, máy ảnh, codec, ID3, XMP và nhiều hơn nữa, trước khi bạn chia sẻ.',
    },
    'edit-image-metadata': {
      name: 'Chỉnh sửa siêu dữ liệu ảnh',
      tagline: 'Đặt tiêu đề, tác giả, bản quyền, từ khóa và mô tả cho ảnh, sửa hoặc xóa vị trí GPS, và ghi lại các thẻ EXIF và IPTC.',
    },
    'change-video-speed': {
      name: 'Đổi tốc độ video',
      tagline: 'Tạo video time-lapse ở 2x, 4x hoặc nhanh hơn, hoặc làm chậm clip xuống 0,5x hoặc 0,25x, âm thanh vẫn đồng bộ.',
    },
    'reverse-video': {
      name: 'Đảo ngược video',
      tagline: 'Phát bất kỳ clip nào theo chiều ngược lại, có hoặc không đảo ngược âm thanh, và tùy chọn phát tiến rồi lùi (ping-pong).',
    },
    'flip-video': {
      name: 'Lật và phản chiếu video',
      tagline: 'Phản chiếu video theo chiều ngang để sửa webcam hoặc ảnh selfie bị ngược, hoặc lật theo chiều dọc, chỉ với một cú nhấp.',
    },
    'stabilize-video': {
      name: 'Ổn định video',
      tagline: 'Làm mượt rung tay và độ nảy khi đi bộ bằng bộ ổn định hai lượt, không cần chân máy hay phần mềm chỉnh sửa trên máy tính.',
    },
    'change-video-frame-rate': {
      name: 'Đổi tốc độ khung hình video',
      tagline: 'Chuyển video sang 24, 25, 30 hoặc 60 fps, hạ clip 60 fps xuống 30 để có tệp nhỏ hơn, hoặc khớp với tốc độ khung hình của dự án.',
    },
    'adjust-video-color': {
      name: 'Chỉnh độ sáng và màu video',
      tagline: 'Làm sáng clip tối, tăng độ tương phản và độ bão hòa, dịch sắc độ, hoặc áp dụng hiệu ứng làm mờ hay phong cách nghệ thuật, với thanh trượt và xem trước trực tiếp.',
    },
    'convert-video-to-hevc': {
      name: 'Chuyển video sang HEVC (H.265)',
      tagline: 'Mã hóa lại bất kỳ video nào sang H.265 để có dung lượng chỉ bằng khoảng một nửa H.264 ở cùng chất lượng, phù hợp để lưu trữ, 4K và thiết bị hiện đại.',
    },
    'convert-audio-to-wav': {
      name: 'Chuyển âm thanh sang WAV',
      tagline: 'Chuyển MP3, M4A, WAV, OGG, FLAC và mọi tệp âm thanh khác sang WAV mà không mất gì.',
    },
    'convert-audio-to-flac': {
      name: 'Chuyển âm thanh sang FLAC',
      tagline: 'Chuyển MP3, M4A, WAV, OGG, FLAC và mọi tệp âm thanh khác sang FLAC mà không mất gì.',
    },
    'convert-audio-to-ogg': {
      name: 'Chuyển âm thanh sang OGG',
      tagline: 'Chuyển MP3, M4A, WAV, OGG, FLAC và mọi tệp âm thanh khác sang OGG với bitrate bạn chọn.',
    },
    'convert-audio-to-m4a': {
      name: 'Chuyển âm thanh sang M4A / AAC',
      tagline: 'Chuyển MP3, M4A, WAV, OGG, FLAC và mọi tệp âm thanh khác sang M4A / AAC với bitrate bạn chọn.',
    },
    'convert-audio-to-opus': {
      name: 'Chuyển âm thanh sang Opus',
      tagline: 'Chuyển MP3, M4A, WAV, OGG, FLAC và mọi tệp âm thanh khác sang Opus với bitrate bạn chọn.',
    },
    'convert-mp3-to-wav': {
      name: 'Chuyển MP3 sang WAV',
      tagline: 'Biến tệp MP3 thành WAV không nén để chỉnh sửa, lấy mẫu hoặc ghi ra đĩa CD.',
    },
    'change-audio-speed': {
      name: 'Đổi tốc độ âm thanh',
      tagline: 'Tăng tốc bài giảng hoặc podcast lên 1,5x, hoặc làm chậm bài hát hay bản ghi âm xuống 0,75x để luyện tập, mà không đổi cao độ.',
    },
    'change-audio-pitch': {
      name: 'Đổi cao độ âm thanh',
      tagline: 'Dịch bài hát hoặc bản ghi âm theo nửa cung để đổi tông, hạ giọng hát hoặc chỉnh một mẫu âm, giữ nguyên nhịp độ.',
    },
    'normalize-audio': {
      name: 'Chuẩn hóa âm thanh',
      tagline: 'Đưa bản ghi nhỏ tiếng lên mức âm lượng đồng đều, để podcast, ghi chú giọng nói và danh sách phát hỗn hợp đều phát ở cùng mức.',
    },
    'adjust-audio-volume': {
      name: 'Chỉnh âm lượng',
      tagline: 'Làm tệp âm thanh to hơn hoặc nhỏ hơn một lượng cố định, từ 10 phần trăm đến gấp đôi, hoặc theo decibel bằng thanh khuếch đại.',
    },
    'audio-equalizer': {
      name: 'Bộ cân bằng âm thanh',
      tagline: 'Áp dụng tăng âm trầm, nâng âm cao, làm nổi giọng hát hoặc cài đặt sẵn theo thể loại, hoặc đặt bộ lọc thông thấp và thông cao, rồi tải kết quả về.',
    },
    'add-reverb-to-audio': {
      name: 'Thêm hiệu ứng vang vào âm thanh',
      tagline: 'Đặt giọng hát khô hoặc bản ghi vào phòng, đại sảnh, vang tấm hoặc vang lò xo, hoặc thêm độ trễ hay tiếng vọng, rồi tải kết quả về.',
    },
    'trim-audio': {
      name: 'Cắt âm thanh',
      tagline: 'Cắt MP3, WAV hoặc bất kỳ bản ghi nào theo thời gian bắt đầu và kết thúc, có dạng sóng để chọn điểm, và chỉ tải phần đó về.',
    },
    'transcribe-audio': {
      name: 'Chuyển âm thanh thành văn bản',
      tagline: 'Chuyển MP3, WAV, M4A hoặc bất kỳ bản ghi nào thành văn bản, phụ đề hoặc JSON bằng nhận dạng giọng nói AI trên máy chủ GPU của chúng tôi.',
    },
    'add-text-to-image': {
      name: 'Thêm chữ vào ảnh',
      tagline: 'Đặt chú thích, tiêu đề hoặc hình mờ lên ảnh: chọn phông chữ, cỡ chữ, màu, viền và vị trí, rồi tải về.',
    },
    'crop-image': {
      name: 'Cắt ảnh',
      tagline: 'Kéo một khung lên phần ảnh bạn muốn, chỉnh lại bố cục, và chỉ tải vùng đó về ở bất kỳ định dạng nào.',
    },
    'grayscale-image': {
      name: 'Chuyển ảnh sang đen trắng',
      tagline: 'Biến ảnh màu thành thang xám, hoặc sepia cho tông màu cổ điển, và tải về ở bất kỳ định dạng nào.',
    },
    'image-filters': {
      name: 'Bộ lọc và hiệu ứng ảnh',
      tagline: 'Tranh sơn dầu, phác họa, than chì, nổi khối, cổ điển, xoáy, làm mờ, làm nét và hơn thế nữa, áp dụng cho bất kỳ ảnh nào chỉ với một cú nhấp.',
    },
    'rotate-image': {
      name: 'Xoay ảnh',
      tagline: 'Xoay ảnh 90°, 180° hoặc 270°, sửa ảnh quét hoặc ảnh điện thoại bị nằm ngang, và tải về ở bất kỳ định dạng nào.',
    },
    'sharpen-image': {
      name: 'Làm nét ảnh',
      tagline: 'Làm rõ các cạnh của ảnh hoặc bản quét hơi mềm chỉ với một cú nhấp làm nét, và tải về ở bất kỳ định dạng nào.',
    },
    'blur-image': {
      name: 'Làm mờ ảnh',
      tagline: 'Làm mềm toàn bộ ảnh để dùng làm nền, ảnh giữ chỗ hoặc lớp che riêng tư, và tải về ở bất kỳ định dạng nào.',
    },
    'generate-vtt-captions': {
      name: 'Trình tạo phụ đề VTT',
      tagline: 'Tạo tệp phụ đề .vtt cho video HTML5, YouTube hoặc trình phát bằng phiên âm AI trên máy chủ GPU của chúng tôi.',
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
        'Tải xuống dưới dạng Markdown và JSON. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm.',
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
        'Tải xuống dưới dạng Markdown và JSON. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí, bạn chọn từ 24 giờ đến 2 năm.',
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
      tagline:
        'Ghi âm hoặc tải lên 5 đến 60 giây lời nói của chính bạn, tạo một giọng nói và để nó đọc bất kỳ văn bản nào bằng hơn hai mươi ngôn ngữ.',
    },
    'voice-designer': {
      name: 'Thiết kế giọng nói',
      tagline:
        'Mô tả một giọng nói bằng lời, nghe thử và giữ lại giọng bạn thích để đọc bất kỳ văn bản nào bằng hơn hai mươi ngôn ngữ.',
    },
    'voice-changer': {
      name: 'Đổi giọng nói',
      tagline:
        'Đổi cao độ và đặc trưng của bản ghi âm tức thì, hoặc dùng AI chuyển lời nói sang một giọng nói đã lưu hoặc có sẵn.',
    },
    // MM84: name / tagline / metaTitle / metaDescription for the copy-bar tool pages (model-written, needs native review).
    'content-studio': {
      name: 'Darkroom',
      tagline: 'Chỉnh sửa, xếp lớp và trộn video và âm thanh trên dòng thời gian nhiều track, rồi xuất MP4. Trình chỉnh sửa kiểu Premiere Pro, chạy ngay trong trình duyệt.',
      metaTitle: 'Darkroom: Trình chỉnh sửa video nhiều track trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Chỉnh sửa, xếp lớp và trộn video và âm thanh trên dòng thời gian nhiều track, rồi xuất MP4. Trình chỉnh sửa video miễn phí kiểu Premiere Pro chạy ngay trong trình duyệt. Không cần đăng ký, không cần cài đặt.',
    },
    'remove-exif-metadata': {
      name: 'Xóa siêu dữ liệu EXIF khỏi ảnh',
      tagline: 'Xóa dữ liệu vị trí GPS, thiết bị, máy ảnh và dấu thời gian khỏi ảnh trước khi bạn chia sẻ ở bất cứ đâu.',
      metaTitle: 'Xóa siêu dữ liệu EXIF khỏi ảnh trực tuyến (miễn phí) | Media Manipulator',
      metaDescription: 'Công cụ trực tuyến miễn phí để xóa siêu dữ liệu EXIF, GPS, IPTC và máy ảnh khỏi ảnh JPG, PNG, WebP và HEIC. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
    },
    'compress-image': {
      name: 'Nén ảnh',
      tagline: 'Giảm dung lượng tệp JPG, PNG và WebP để trang web nhanh hơn, tải lên nhẹ hơn và chia sẻ dễ hơn.',
      metaTitle: 'Nén ảnh trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ nén ảnh trực tuyến miễn phí. Giảm dung lượng tệp JPG, PNG và WebP mà vẫn giữ chất lượng tốt. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
    },
    'image-resizer': {
      name: 'Đổi kích thước ảnh',
      tagline: 'Đổi kích thước ảnh JPG, PNG, WebP và GIF về số điểm ảnh chính xác mà vẫn giữ tỷ lệ khung hình.',
      metaTitle: 'Đổi kích thước ảnh trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ đổi kích thước ảnh trực tuyến miễn phí. Đổi kích thước ảnh JPG, PNG, WebP và GIF về số điểm ảnh chính xác mà vẫn giữ tỷ lệ khung hình. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
    },
    'remove-background-from-image': {
      name: 'Xóa nền ảnh',
      tagline: 'Tự động xóa nền của mọi bức ảnh và tải về ảnh cắt PNG trong suốt, sạch sẽ.',
      metaTitle: 'Xóa nền ảnh trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ xóa nền ảnh trực tuyến miễn phí. Tự động xóa nền của mọi bức ảnh và tải về PNG trong suốt. Chạy trên GPU của chúng tôi, không dùng AI của bên thứ ba. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
    },
    'image-to-pdf': {
      name: 'Ảnh sang PDF',
      tagline: 'Chuyển ảnh JPG, PNG và các ảnh khác thành tài liệu PDF gọn gàng, dễ chia sẻ chỉ với một lần bấm.',
      metaTitle: 'Chuyển ảnh sang PDF trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển ảnh sang PDF trực tuyến miễn phí. Chuyển ảnh JPG, PNG và các ảnh khác thành tài liệu PDF gọn gàng. Không cần đăng ký, không có hình mờ. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
    },
    'pdf-to-jpg': {
      name: 'PDF sang JPG',
      tagline: 'Kết xuất từng trang của tệp PDF thành ảnh JPG chất lượng cao để bạn chia sẻ, chỉnh sửa hoặc đăng tải.',
      metaTitle: 'Chuyển PDF sang JPG trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ chuyển PDF sang JPG trực tuyến miễn phí. Kết xuất từng trang của tệp PDF thành ảnh JPG chất lượng cao, tải về dưới dạng ZIP. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
    },
    'compress-video': {
      name: 'Nén video',
      tagline: 'Giảm dung lượng tệp MP4, WebM, MOV, MKV và AVI cho web, email, mạng xã hội và tải lên đám mây.',
      metaTitle: 'Nén video trực tuyến (miễn phí) | Media Manipulator',
      metaDescription: 'Công cụ nén video trực tuyến miễn phí. Giảm dung lượng tệp MP4, WebM, MOV, MKV và AVI mà vẫn giữ chất lượng tốt. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
    },
    'video-trimmer': {
      name: 'Cắt video',
      tagline: 'Cắt đoạn clip về phần bạn muốn bằng thao tác cắt nhanh, giữ nguyên chất lượng, không cần mã hóa lại khi có thể.',
      metaTitle: 'Cắt video trực tuyến miễn phí | Media Manipulator',
      metaDescription: 'Công cụ cắt video trực tuyến miễn phí. Đặt thời điểm bắt đầu và kết thúc rồi cắt clip nhanh, không giảm chất lượng. Xuất MP4, không hình mờ, không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
    },
    'extract-audio-from-video': {
      name: 'Tách âm thanh khỏi video',
      tagline: 'Lưu track âm thanh của bất kỳ video nào thành tệp MP3, WAV, M4A, AAC, FLAC hoặc OGG sạch.',
      metaTitle: 'Tách âm thanh khỏi video: MP3, WAV, M4A và hơn thế | Media Manipulator',
      metaDescription: 'Công cụ trực tuyến miễn phí để tách âm thanh khỏi mọi tệp video (MP4, MOV, MKV, WebM, AVI). Xuất ra MP3, WAV, M4A, AAC, FLAC hoặc OGG. Không cần đăng ký. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
    },
    'convert-video-to-animated-gif': {
      name: 'Chuyển video sang GIF động',
      tagline: 'Biến các clip MP4, WebM, MOV hoặc MKV ngắn thành ảnh GIF động dễ chia sẻ chỉ trong vài giây.',
      metaTitle: 'Chuyển video sang GIF động trực tuyến (miễn phí) | Media Manipulator',
      metaDescription: 'Công cụ chuyển video sang GIF trực tuyến miễn phí. Biến các clip MP4, WebM, MOV và MKV ngắn thành GIF động, có thể điều chỉnh kích thước và tốc độ khung hình.',
    },
    'transcribe-video': {
      name: 'Chuyển video thành văn bản',
      tagline: 'Trích lời nói trong tệp video hoặc âm thanh thành phụ đề WebVTT hoặc SRT, văn bản thuần hoặc JSON có dấu thời gian.',
      metaTitle: 'Chuyển video thành văn bản trực tuyến (miễn phí) | Media Manipulator',
      metaDescription: 'Công cụ chuyển video thành văn bản trực tuyến miễn phí. Chuyển tệp MP4, MOV, WebM, MKV và âm thanh thành văn bản có thể tìm kiếm, phụ đề VTT hoặc bản chép JSON.',
    },
    'transcode-to-hls': {
      name: 'Chuyển mã video sang HLS',
      tagline: 'Đóng gói mọi video thành gói Apple HLS VOD: master.m3u8 và các phân đoạn .ts theo từng độ phân giải, sẵn sàng cho web.',
      metaTitle: 'Chuyển mã video sang HLS trực tuyến | Công cụ phát trực tuyến thích ứng miễn phí',
      metaDescription: 'Công cụ chuyển mã HLS trực tuyến miễn phí. Chuyển MP4, MOV, WebM, MKV thành gói HLS VOD với các độ phân giải 360p/480p/720p, kèm phụ đề và storyboard tùy chọn.',
    },
    'ai-video-restoration': {
      name: 'Phục hồi video bằng AI',
      tagline: 'Nâng độ phân giải và phục hồi một đoạn video ngắn với tối đa sáu mô hình AI (Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT và VRT), rồi so sánh mọi kết quả cạnh nhau.',
      metaTitle: 'Công cụ phục hồi video bằng AI: So sánh 6 mô hình nâng độ phân giải trực tuyến | Media Manipulator',
      metaDescription: 'Công cụ phục hồi video bằng AI miễn phí. Cho một clip ngắn chạy qua các mô hình siêu phân giải Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT và VRT trên GPU của chúng tôi và tải mọi kết quả về trong một gói.',
    },
    'ai-image-restoration': {
      name: 'Phục hồi và nâng độ phân giải ảnh bằng AI',
      tagline: 'Làm sạch, nâng độ phân giải và phục hồi ảnh với tối đa tám mô hình AI: làm sạch sơ bộ giữ nguyên độ trung thực (FBCNN, SCUNet, NAFNet), công cụ nâng độ phân giải đa dụng (Real-ESRGAN, SwinIR, HAT) và tăng cường khuôn mặt (GFPGAN, CodeFormer), rồi so sánh từng kết quả với ảnh gốc.',
      metaTitle: 'Phục hồi và nâng độ phân giải ảnh bằng AI: So sánh 8 mô hình trực tuyến | Media Manipulator',
      metaDescription: 'Phục hồi và nâng độ phân giải ảnh bằng AI miễn phí. Loại bỏ nhiễu JPEG, khử nhiễu và làm nét, rồi nâng lên 4K/8K bằng Real-ESRGAN, SwinIR hoặc HAT và tăng cường khuôn mặt bằng GFPGAN/CodeFormer, tất cả trên GPU của chúng tôi và so sánh cạnh nhau.',
    },
    'ai-document-scan': {
      name: 'Quét tài liệu bằng AI',
      tagline: 'Biến tài liệu quét và ghi chú viết tay thành PDF nhiều trang có thể tìm kiếm và tài liệu Word có thể chỉnh sửa: trang in được gắn lớp văn bản Tesseract trung thực, chữ viết tay được AI thị giác chép lại, đánh dấu chỗ chưa chắc chắn và không bao giờ bịa ra.',
      metaTitle: 'Quét tài liệu bằng AI: Trang quét và chữ viết tay sang PDF/Word | Media Manipulator',
      metaDescription: 'Quét tài liệu bằng AI miễn phí: chuyển ảnh quét thành PDF có thể tìm kiếm và OCR ảnh sang Word, đồng thời chép ghi chú viết tay thành văn bản. Sắp xếp lại trang, trộn bản in và chữ viết tay, tất cả trên GPU của chúng tôi, nguyên văn và đánh dấu chỗ chưa chắc chắn.',
    },
    'ai-image-upscaler': {
      name: 'Nâng độ phân giải ảnh bằng AI',
      tagline: 'Phóng to ảnh nhỏ hoặc bị mềm bằng mô hình Real-ESRGAN tái tạo chi tiết mịn thay vì chỉ kéo giãn điểm ảnh.',
      metaTitle: 'Nâng độ phân giải ảnh bằng AI: Phóng to ảnh 2x hoặc 4x | Media Manipulator',
      metaDescription: 'Phóng to ảnh độ phân giải thấp 2x hoặc 4x bằng AI khôi phục đường nét và kết cấu. Chạy trên GPU của chúng tôi, xuất PNG. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
    },
    'blur-faces-in-photo': {
      name: 'Làm mờ khuôn mặt trong ảnh',
      tagline: 'Tự động phát hiện khuôn mặt, rồi làm mờ, pixel hóa hoặc che đen toàn bộ hoặc chỉ những khuôn mặt bạn chọn.',
      metaTitle: 'Làm mờ khuôn mặt trong ảnh trực tuyến | Media Manipulator',
      metaDescription: 'Làm mờ, pixel hóa hoặc che đen khuôn mặt trong ảnh. Phát hiện mọi khuôn mặt rồi chọn khuôn mặt cần ẩn. AI chạy trên GPU của chúng tôi. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
    },
    'redact-text-in-image': {
      name: 'Che văn bản trong ảnh',
      tagline: 'Tìm văn bản đọc được trong ảnh chụp màn hình hoặc ảnh và che thông tin cá nhân, hoặc toàn bộ văn bản, bằng hiệu ứng làm mờ hoặc ô đen.',
      metaTitle: 'Che văn bản trong ảnh trực tuyến | Media Manipulator',
      metaDescription: 'Tự động tìm văn bản trong ảnh và che đen hoặc làm mờ tên, email, số và dữ liệu cá nhân khác. AI chạy trên GPU của chúng tôi. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
    },
    'remove-object-from-photo': {
      name: 'Xóa vật thể khỏi ảnh',
      tagline: 'Vẽ một khung quanh thứ bạn không muốn có trong ảnh, mô hình inpainting sẽ lấp chỗ trống bằng nền phù hợp.',
      metaTitle: 'Xóa vật thể khỏi ảnh trực tuyến | Media Manipulator',
      metaDescription: 'Xóa các vật thể không mong muốn khỏi ảnh. Vẽ một hình chữ nhật và inpainting bằng AI sẽ lấp khoảng trống cho khớp với nền. Chạy trên GPU của chúng tôi. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
    },
    'clean-voice-audio': {
      name: 'Làm sạch âm thanh giọng nói',
      tagline: 'Giúp giọng nói rõ hơn bằng cách giảm tiếng xì, tiếng vang phòng và tiếng ù trầm trong podcast, phỏng vấn và ghi chú giọng nói.',
      metaTitle: 'Làm sạch bản ghi âm giọng nói bằng AI | Media Manipulator',
      metaDescription: 'Làm sạch bản ghi âm giọng nói bằng AI. Giảm tiếng xì, tiếng ù và tạp âm phòng để giọng nói dễ nghe hơn. Chạy trên GPU của chúng tôi. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
    },
    'remove-background-noise': {
      name: 'Loại bỏ tiếng ồn nền',
      tagline: 'Giảm tiếng xì, tiếng ù, tiếng xe cộ và tiếng ồn phòng trong bản ghi âm bằng bộ khử nhiễu AI, giữ âm thanh chính nổi bật.',
      metaTitle: 'Loại bỏ tiếng ồn nền khỏi âm thanh trực tuyến | Media Manipulator',
      metaDescription: 'Loại bỏ tiếng ồn nền khỏi âm thanh. Bộ khử nhiễu AI giảm tiếng xì, tiếng ù và âm thanh xung quanh trong bản ghi âm. Chạy trên GPU của chúng tôi. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
    },
    'remove-vocals-from-song': {
      name: 'Tách giọng hát khỏi bài hát',
      tagline: 'Loại bỏ giọng hát khỏi bản nhạc và giữ lại phần nhạc, dùng cho karaoke, luyện tập và nhạc nền. Chỉ dùng với nhạc mà bạn có quyền.',
      metaTitle: 'Tách giọng hát khỏi bài hát: Tạo nhạc karaoke | Media Manipulator',
      metaDescription: 'Tách giọng hát khỏi bài hát bằng AI và tải bản nhạc nền về cùng định dạng với tệp của bạn, hoặc FLAC hoặc WAV. Bản karaoke và bản luyện tập, trên GPU của chúng tôi. Tệp được lưu 24 giờ với khách; với tài khoản miễn phí bạn chọn từ 24 giờ đến 2 năm.',
    },
  },
} as const;

export default viToolPages;
