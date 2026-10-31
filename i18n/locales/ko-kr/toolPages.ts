/**
 * Korean partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope (MM62, 2026-10-27): only the Motion tool page body, which
 * `i18n/motionTranslations.test.ts` (MM48) requires for every translated
 * locale. The other ~65 tool pages render English until a later session
 * extends this file slug by slug, as the other locales do.
 *
 * Register: polite 해요체 for explanatory text; brand names, formats and
 * codecs stay in Latin script; "Motion" and "Darkroom" stay as they are.
 * Model-written, needs native review.
 */

const koToolPages = {
  pages: {
    // MM48: Motion's full page body (model-written, needs native review). The brand stays "Motion".
    motion: {
      name: 'Motion',
      tagline: 'SVG를 그리거나 가져와 키프레임 타임라인에서 애니메이션하고, 애니메이션 SVG, Lottie, React, JavaScript, Flutter 또는 GIF로 내보내세요. 모두 브라우저 안에서 이루어져요.',
      intro: 'Motion은 Media Manipulator에 내장된 애니메이션 타임라인이 있는 SVG 편집기예요. SVG 파일(또는 Lottie 애니메이션)을 열면 모든 도형이 선택하고, 옮기고, 색을 바꾸고, 애니메이션할 수 있는 레이어가 돼요. 빈 캔버스에서 시작해 사각형, 타원, 선, 펜, 텍스트 도구로 그릴 수도 있어요. 애니메이션하는 각 속성은 이징 프리셋, 맞춤 이징을 위한 커브 편집기, 즉시 전환되는 홀드 키를 갖춘 자신만의 키프레임 트랙을 가져요. 원클릭 애니메이터로 선 그리기, 경로를 따라 이동, 모양 모프, 그라데이션 색 변화, 마스크 애니메이션, 흐림을 추가할 수 있어요. 원하는 대로 움직이면 애니메이션 SVG, Lottie 파일, React 컴포넌트, JavaScript 또는 TypeScript 모듈, Flutter 위젯 또는 GIF로 내보내세요. 편집과 모든 내보내기는 브라우저에서 실행되므로 내보내기를 위해 아트워크가 업로드되는 일은 없어요.',
      whatItDoes: [
        'SVG 파일을 편집 가능한 레이어 트리(그룹, 경로, 도형, 텍스트, 이미지, 그라데이션, 마스크, 클립 경로)로 가져오고, Lottie JSON 애니메이션을 키프레임과 함께 가져와요.',
        '사각형, 타원, 선, 펜(베지어), 텍스트 도구로 새 아트워크를 그리고 캔버스에서 경로 노드를 직접 편집해요.',
        '위치, 배율, 회전, 기울이기, 불투명도, 채우기, 선, 선 두께를 선형, 이즈 인, 이즈 아웃, 이즈 인아웃, 맞춤 3차 베지어, 홀드 이징이 있는 키프레임 타임라인에서 애니메이션해요.',
        '클릭 한 번으로 고급 애니메이션을 추가해요: 선 그리기, 자동 회전 옵션이 있는 경로 따라 이동, 모양 모프, 그라데이션 지점 색상, 마스크와 클립 경로 애니메이션, 흐림.',
        '정적 SVG(항상 무료), 라이브러리 없이 재생되는 애니메이션 SVG, Lottie JSON, React 컴포넌트, JavaScript 또는 TypeScript 모듈, Flutter 위젯, 애니메이션 GIF를 내보내요.',
      ],
      flowSteps: [
        {
          title: '열거나 그리기',
          description: 'SVG 또는 Lottie 파일을 가져오거나 빈 캔버스에 도형과 경로를 그리세요.',
        },
        {
          title: '애니메이션',
          description: '재생 헤드를 옮기고 속성을 바꾸면 타임라인이 키프레임을 기록해요.',
        },
        {
          title: '타이밍 다듬기',
          description: '이징 프리셋을 고르거나, 맞춤 커브를 그리거나, 홀드를 추가하거나, 원클릭 애니메이터를 적용하세요.',
        },
        {
          title: '내보내기',
          description: '브라우저에서 만들어진 애니메이션 SVG, Lottie, React, JS/TS, Flutter 또는 GIF를 다운로드하세요.',
        },
      ],
      advancedDetails: [
        '애니메이션 SVG 내보내기는 모든 효과를 Chrome, Firefox, Safari에서 CSS로 표현할 수 있을 때 순수 CSS 키프레임을 사용해요. 모양 모프, 움직이는 그라데이션 지점, 흐림에는 작은 스크립트가 필요하므로, 그런 파일에는 라이선스 고지가 맨 위에 적힌 축소판 anime.js(MIT 라이선스, 압축 시 약 14 KB)가 포함돼요.',
        '모양 모프는 두 모양을 같은 수의 곡선 세그먼트로 정규화하고 시작점과 감기 방향을 맞추므로 모프가 뒤틀리지 않아요. 맞출 수 없는 두 모양은 모프하는 대신 홀드돼요.',
        'Lottie 작성기는 Lottie 1.0.1 사양과 LottieFiles "Basic" 기능 세트를 대상으로 해요. Lottie가 담을 수 없는 것(필터, 텍스트, 고급 마스크 등)은 다운로드 후 목록으로 표시되며, 아무것도 조용히 버려지지 않아요.',
        'GIF 내보내기는 Media Manipulator를 위해 작성된 인코더를 사용하며, 애니메이션 전체의 프레임에서 하나의 전역 팔레트를 만들어 평면 벡터 아트의 색상을 정확하게 유지해요.',
        '가져온 SVG는 들어오는 길에 정리돼요. 스크립트, 이벤트 핸들러, 외부 참조, 기타 안전하지 않은 콘텐츠는 제거되고, 지원되지 않는 마크업은 HTML로 삽입되는 대신 허용 목록에서 다시 만들어져요.',
      ],
      whyItMatters: [
        '애니메이션 SVG는 어떤 크기에서도 선명하고, 같은 애니메이션의 동영상이나 GIF보다 보통 훨씬 작아서 웹의 로고, 아이콘, 로더, 일러스트에 이상적이에요.',
        '개발자에게는 동영상이 아니라 코드로 된 애니메이션이 필요해요. React 컴포넌트, JavaScript 모듈, Lottie 파일, Flutter 위젯은 앱에 바로 들어가요.',
        '브라우저에서 내보내기를 하므로 아트워크는 기기에 남아요. 일일 사용량을 적용하기 위해 각 내보내기의 횟수만 저희에게 전송돼요.',
      ],
      useCases: [
        {
          title: '로고 및 아이콘 애니메이션',
          description: '선 애니메이션으로 로고를 그려 내거나, 호버 시 아이콘이 튀거나 돌거나 색이 바뀌게 하세요.',
        },
        {
          title: '로더 및 UI 마이크로 애니메이션',
          description: '스피너와 진행 애니메이션을 만들어 CSS 전용 SVG나 React 컴포넌트로 내보내세요.',
        },
        {
          title: '모바일 앱용 Lottie',
          description: 'iOS, Android, 웹, Flutter의 Lottie 플레이어용으로 Lottie JSON을 내보내거나 기존 Lottie 파일을 편집하세요.',
        },
        {
          title: '애니메이션 일러스트',
          description: '일러스트의 일부를 경로를 따라 움직이고, 모양을 서로 모프하고, 채팅이나 이메일용 GIF를 내보내세요.',
        },
      ],
      whyMediaManipulator: [
        '템플릿 갤러리가 아니라 홀드, 맞춤 커브, 고급 애니메이터를 갖춘 진짜 레이어와 키프레임 편집기예요.',
        '디자이너와 개발자 모두를 위한 내보내기: 하나의 프로젝트에서 애니메이션 SVG, Lottie, React, JavaScript 또는 TypeScript, Flutter, GIF를 얻을 수 있어요.',
        '내보내기는 브라우저에서 만들어지고, 내보내기가 사용하는 유일한 제3자 코드는 관대한 라이선스(MIT의 anime.js, Flutter용 flutter_svg와 webview_flutter)이며 그 라이선스 고지는 파일에 유지돼요.',
      ],
      privacyNote: '편집과 내보내기는 브라우저에서 이루어지며, 내보내기를 위해 아트워크가 업로드되지 않아요. 계정이 없으면 프로젝트는 이 브라우저에만 보관돼요. 로그인해서 프로젝트를 계정에 저장하면 Darkroom 프로젝트처럼 저희 서버에 저장되고, 직접 선택한 보관 기간을 따르며, 계정 페이지에서 삭제할 수 있어요. 각 내보내기에 대해서는 일일 사용량을 적용하기 위해 형식, 크기, 길이, 시각만 기록해요.',
      faq: [
        {
          question: 'Motion은 무료인가요?',
          answer: '네. Motion을 열고, 그리고, 애니메이션하고, 저장하고, 정적 SVG를 내보내는 것은 계정 없이 무료이고 무제한이에요. 애니메이션 내보내기는 요금제에 따른 일일 사용량에 포함돼요. 이 페이지의 요금제 표에 각 요금제의 사용량과 형식이 나와 있어요.',
        },
        {
          question: '어떤 형식으로 내보낼 수 있나요?',
          answer: '정적 SVG, 애니메이션 SVG(CSS, 필요하면 작은 인라인 스크립트), Lottie JSON, React 컴포넌트(.tsx), JavaScript 또는 TypeScript 모듈, Flutter 위젯(.dart), 애니메이션 GIF예요. 요금제에 어떤 형식이 포함되는지와 일일 내보내기 횟수는 이 페이지의 요금제 표에 나와 있어요.',
        },
        {
          question: '제한이 있나요?',
          answer: '애니메이션 내보내기는 하루 단위로 집계되며 UTC 자정에 초기화돼요. 계정이 없는 방문자는 프로젝트를 브라우저에만 저장할 수 있고, 로그인한 요금제는 일정 수의 프로젝트를 계정에 저장해요. 방문자에게는 내보낼 수 있는 최대 애니메이션 길이도 있고, GIF 내보내기에는 크기와 길이 제한이 있어요. 현재의 모든 수치는 이 페이지의 요금제 표와 요금 페이지에 나와 있어요.',
        },
        {
          question: '이미 갖고 있는 SVG를 애니메이션할 수 있나요?',
          answer: '네. 어떤 SVG든 가져오면 그 그룹, 경로, 도형, 텍스트, 그라데이션, 마스크, 클립 경로가 편집 가능한 레이어가 돼요. 패턴이나 복잡한 필터처럼 편집기가 편집할 수 없는 부분은 그대로 유지되어 변경 없이 내보내지고, 안전하지 않은 것(스크립트나 외부 링크)은 제거되어 가져온 뒤 목록으로 표시돼요.',
        },
        {
          question: 'Lottie를 지원하나요?',
          answer: '네, 양방향으로요. Lottie JSON 파일을 가져와 편집할 수 있고, 애니메이션을 lottie-web과 iOS, Android, Flutter의 Lottie 플레이어용 Lottie JSON으로 내보낼 수 있어요. 한쪽에서 표현할 수 없는 기능은 조용히 버려지는 대신 대화 상자에 목록으로 표시돼요.',
        },
        {
          question: '동영상 내보내기를 지원하는 브라우저는 무엇인가요?',
          answer: 'GIF 내보내기는 모든 최신 브라우저에서 작동해요. MP4와 WebM 내보내기는 브라우저 내장 동영상 인코더인 WebCodecs에 의존하며, Chrome과 Edge, 그리고 코덱에 따라 최신 버전의 Safari와 Firefox에서 사용할 수 있어요. 내보내기 대화 상자가 브라우저를 확인하고 인코딩할 수 없을 때 알려 줘요. 이 페이지의 요금제 표에 어떤 요금제가 어떤 동영상 형식을 포함하는지 나와 있어요.',
        },
        {
          question: '내보낸 코드에는 어떤 라이선스가 적용되나요?',
          answer: '애니메이션은 여러분의 것이에요. 애니메이션 SVG나 코드 내보내기에 런타임이 필요하면 MIT 라이선스인 anime.js를 사용해요. 그 저작권 고지는 파일 맨 위에 기록되며 그 자리에 유지되어야 해요. Flutter 내보내기는 flutter_svg(MIT) 또는 webview_flutter(BSD-3-Clause) 패키지를 사용해요. 파일의 나머지는 모두 여러분의 프로젝트에서 생성돼요. 편집기가 사용하는 오픈소스 라이브러리는 라이선스 페이지에 나와 있어요.',
        },
        {
          question: '프로젝트는 어디에 저장되나요?',
          answer: '계정이 없으면 프로젝트는 이 브라우저에만 보관되므로 브라우저 데이터를 지우면 사라져요. 로그인한 상태에서는 프로젝트를 계정에 저장할 수 있고, 그러면 기기 간에 동기화되고, 작업 중에 자동 저장되고, 선택한 보관 기간을 따르며, 계정 페이지에서 삭제할 수 있어요.',
        },
      ],
      supportedFormats: {
        supportedInputFormats: [
          'SVG',
          'Lottie JSON',
          'Motion 프로젝트 (.json)',
        ],
        supportedOutputFormats: [
          '정적 SVG',
          '애니메이션 SVG',
          'Lottie JSON',
          'React (.tsx)',
          'JavaScript / TypeScript',
          'Flutter (.dart)',
          'GIF',
        ],
        maxFileNotes: [
          'SVG와 Lottie 가져오기는 각각 최대 4 MB.',
          '계정이 없는 프로젝트는 이 브라우저에만 존재하고, 로그인한 프로젝트는 직접 선택한 보관 기간을 따라요.',
        ],
        processingNotes: [
          '편집, 미리보기, 모든 내보내기는 브라우저에서 실행돼요. 각 내보내기의 횟수만 저희 서버로 전송돼요.',
        ],
      },
      embed: {
        title: 'Motion 열기',
        description: '새 드로잉을 시작하거나 최근 드로잉을 다시 여세요. 편집기는 전체 화면으로 열리고 작업은 이 브라우저에 보관되며, 로그인한 사용자는 계정에도 저장할 수 있어요.',
      },
      related: [
        {
          label: 'Motion 튜토리얼',
          to: '/tutorials/motion',
          description: 'SVG를 가져오고, 애니메이션하고, 이징을 다듬고, 내보내기까지 단계별로.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '멀티트랙 타임라인에서 동영상을 편집하고 MP4로 내보내세요.',
        },
        {
          label: '동영상을 애니메이션 GIF로 변환',
          to: '/tools/convert-video-to-animated-gif',
          description: '애니메이션이 영상에서 시작됐다면 동영상 클립을 GIF로 변환하세요.',
        },
        {
          label: '오픈소스 라이선스',
          to: '/licenses',
          description: '편집기가 실행하고 내보내기에 기록하는 라이브러리.',
        },
      ],
      metaTitle: 'Motion: 무료 온라인 SVG 애니메이션 편집기 | Media Manipulator',
      metaDescription: '브라우저에서 SVG를 애니메이션하세요: 키프레임, 이징, 홀드, 선 그리기, 모션 경로, 모프. 애니메이션 SVG, Lottie JSON, React, JS, Flutter 또는 GIF로 내보내기.',
      ogTitle: 'Motion: 브라우저에서 SVG 애니메이션 만들기',
      ogDescription: 'SVG를 가져오거나 그리고, 키프레임 타임라인에서 애니메이션하고, 애니메이션 SVG, Lottie JSON, React, JavaScript, Flutter 또는 GIF로 내보내세요. 내보내기는 브라우저에서 만들어져요.',
    },
    // 2026-10-28 catalog expansion: name + tagline for the /tools catalog cards (model-written, needs native review).
    'inspect-metadata': {
      name: '메타데이터 검사기',
      tagline: '공유하기 전에 사진, 동영상, 오디오 파일, PDF에 숨겨진 모든 태그(EXIF, GPS 위치, 카메라, 코덱, ID3, XMP 등)를 확인해요.',
    },
    'edit-image-metadata': {
      name: '이미지 메타데이터 편집',
      tagline: '사진의 제목, 작성자, 저작권, 키워드, 설명을 설정하고, GPS 위치를 수정하거나 삭제하고, EXIF와 IPTC 태그를 다시 쓸 수 있어요.',
    },
    'change-video-speed': {
      name: '동영상 속도 변경',
      tagline: '2배, 4배 또는 더 빠르게 타임랩스를 만들거나, 클립을 0.5배나 0.25배로 느리게 만들 수 있어요. 오디오 싱크도 그대로 유지돼요.',
    },
    'reverse-video': {
      name: '동영상 거꾸로 재생',
      tagline: '어떤 클립이든 거꾸로 재생해요. 오디오를 함께 뒤집을지 선택할 수 있고, 정방향 후 역방향으로 반복 재생하는 핑퐁 효과도 줄 수 있어요.',
    },
    'flip-video': {
      name: '동영상 뒤집기 & 좌우 반전',
      tagline: '좌우가 바뀐 웹캠이나 셀카 영상을 가로로 반전해 바로잡거나, 세로로 뒤집을 수 있어요. 클릭 한 번이면 끝나요.',
    },
    'stabilize-video': {
      name: '동영상 흔들림 보정',
      tagline: '2패스 안정화 기능으로 손떨림과 걸을 때의 흔들림을 부드럽게 잡아줘요. 삼각대도 데스크톱 편집기도 필요 없어요.',
    },
    'change-video-frame-rate': {
      name: '동영상 프레임 레이트 변경',
      tagline: '동영상을 24, 25, 30, 60fps로 변환하거나, 60fps 클립을 30fps로 낮춰 파일 크기를 줄이거나, 프로젝트 프레임 레이트에 맞출 수 있어요.',
    },
    'adjust-video-color': {
      name: '동영상 밝기 및 색상 조정',
      tagline: '어두운 클립을 밝게 하고, 대비와 채도를 높이고, 색조를 바꾸거나, 흐림 효과나 아트 효과를 적용해요. 슬라이더와 실시간 미리보기를 제공해요.',
    },
    'convert-video-to-hevc': {
      name: '동영상을 HEVC(H.265)로 변환',
      tagline: '어떤 동영상이든 H.265로 다시 인코딩해 같은 화질에서 H.264의 절반 정도 크기로 줄여요. 보관, 4K, 최신 기기에 알맞아요.',
    },
    'convert-audio-to-wav': {
      name: '오디오를 WAV로 변환',
      tagline: 'MP3, M4A, WAV, OGG, FLAC 등 모든 오디오 파일을 손실 없이 WAV로 변환해요.',
    },
    'convert-audio-to-flac': {
      name: '오디오를 FLAC로 변환',
      tagline: 'MP3, M4A, WAV, OGG, FLAC 등 모든 오디오 파일을 손실 없이 FLAC로 변환해요.',
    },
    'convert-audio-to-ogg': {
      name: '오디오를 OGG로 변환',
      tagline: 'MP3, M4A, WAV, OGG, FLAC 등 모든 오디오 파일을 원하는 비트레이트의 OGG로 변환해요.',
    },
    'convert-audio-to-m4a': {
      name: '오디오를 M4A / AAC로 변환',
      tagline: 'MP3, M4A, WAV, OGG, FLAC 등 모든 오디오 파일을 원하는 비트레이트의 M4A / AAC로 변환해요.',
    },
    'convert-audio-to-opus': {
      name: '오디오를 Opus로 변환',
      tagline: 'MP3, M4A, WAV, OGG, FLAC 등 모든 오디오 파일을 원하는 비트레이트의 Opus로 변환해요.',
    },
    'convert-mp3-to-wav': {
      name: 'MP3를 WAV로 변환',
      tagline: 'MP3를 압축되지 않은 WAV로 바꿔 편집, 샘플링, CD 굽기에 사용하세요.',
    },
    'change-audio-speed': {
      name: '오디오 속도 변경',
      tagline: '강의나 팟캐스트는 1.5배로 빠르게, 연습용 노래나 녹음은 0.75배로 느리게 만들 수 있어요. 음높이는 그대로예요.',
    },
    'change-audio-pitch': {
      name: '오디오 음높이 변경',
      tagline: '반음 단위로 조옮김해 노래나 녹음의 키를 바꾸고, 보컬을 낮추거나 샘플을 맞출 수 있어요. 템포는 그대로 유지돼요.',
    },
    'normalize-audio': {
      name: '오디오 노멀라이즈',
      tagline: '작게 녹음된 소리를 일정한 음량으로 맞춰 팟캐스트, 음성 메모, 섞인 재생목록이 같은 크기로 재생되게 해요.',
    },
    'adjust-audio-volume': {
      name: '오디오 볼륨 조절',
      tagline: '오디오 파일의 소리를 10%부터 두 배까지 정해진 만큼 키우거나 줄이고, 증폭 슬라이더로 데시벨 단위로 조절할 수도 있어요.',
    },
    'audio-equalizer': {
      name: '오디오 이퀄라이저',
      tagline: '베이스 부스트, 고음 강조, 보컬 선명도, 장르 프리셋을 적용하거나 로패스와 하이패스 필터를 설정한 뒤 결과를 다운로드하세요.',
    },
    'add-reverb-to-audio': {
      name: '오디오에 리버브 추가',
      tagline: '드라이한 보컬이나 녹음에 룸, 홀, 플레이트, 스프링 리버브를 입히거나 딜레이와 에코를 추가한 뒤 결과를 다운로드하세요.',
    },
    'trim-audio': {
      name: '오디오 자르기',
      tagline: 'MP3, WAV 등 어떤 녹음이든 시작과 끝 시간으로 잘라요. 파형을 보며 구간을 고르고 필요한 부분만 다운로드하세요.',
    },
    'transcribe-audio': {
      name: '오디오 받아쓰기',
      tagline: '자체 GPU 서버의 AI 음성 인식으로 MP3, WAV, M4A 등 모든 녹음을 텍스트, 자막, JSON으로 변환해요.',
    },
    'add-text-to-image': {
      name: '이미지에 텍스트 추가',
      tagline: '사진에 캡션, 제목, 워터마크를 넣어요. 글꼴, 크기, 색상, 외곽선, 위치를 고른 뒤 다운로드하세요.',
    },
    'crop-image': {
      name: '이미지 자르기',
      tagline: '사진에서 원하는 부분 위로 상자를 끌어 구도를 바로잡고, 그 영역만 원하는 형식으로 다운로드하세요.',
    },
    'grayscale-image': {
      name: '이미지를 흑백으로 변환',
      tagline: '컬러 사진을 그레이스케일이나 빈티지 느낌의 세피아로 바꾸고 원하는 형식으로 다운로드하세요.',
    },
    'image-filters': {
      name: '이미지 필터 & 효과',
      tagline: '유화, 스케치, 목탄, 엠보스, 빈티지, 소용돌이, 흐림, 선명하게 등의 효과를 어떤 사진에든 클릭 한 번으로 적용해요.',
    },
    'rotate-image': {
      name: '이미지 회전',
      tagline: '사진을 90°, 180°, 270° 회전해 옆으로 누운 스캔본이나 휴대폰 사진을 바로잡고 원하는 형식으로 다운로드하세요.',
    },
    'sharpen-image': {
      name: '이미지 선명하게',
      tagline: '약간 흐릿한 사진이나 스캔본의 윤곽을 클릭 한 번으로 또렷하게 만들고 원하는 형식으로 다운로드하세요.',
    },
    'blur-image': {
      name: '이미지 흐리게',
      tagline: '사진 전체를 부드럽게 흐려 배경, 플레이스홀더, 개인정보 보호용으로 쓰고 원하는 형식으로 다운로드하세요.',
    },
    'generate-vtt-captions': {
      name: 'VTT 자막 생성기',
      tagline: '자체 GPU 서버의 AI 전사로 HTML5 비디오, YouTube, 플레이어에 쓸 .vtt 자막 파일을 만들어요.',
    },
    // MM75: summarize-video / summarize-audio full page bodies (model-written, needs native review).
    'summarize-video': {
      name: '동영상 요약',
      h1: 'AI로 동영상 요약하기: 챕터, 주제, 화면 속 텍스트',
      tagline: '강의, 회의, 튜토리얼의 요약본을 받아 보세요. 클릭할 수 있는 챕터, 주제, 화면 속 텍스트까지 자체 GPU 서버에서 만들어요.',
      metaTitle: '챕터를 만들어 주는 AI 동영상 요약 | Media Manipulator',
      metaDescription: '동영상을 업로드하면 타임스탬프가 있는 챕터, 주제, 화면에 나온 텍스트가 담긴 요약을 만들어 드려요. AI는 자체 GPU 서버에서 실행되며 외부 AI를 쓰지 않아요. 무료 계정이 필요해요.',
      ogTitle: 'AI로 동영상 요약하기',
      ogDescription: '클릭할 수 있는 챕터, 주제, 화면 속 텍스트가 담긴 요약. 무료 계정이 필요해요.',
      embed: {
        title: '동영상 요약하기',
        description: '로그인하고 동영상(또는 오디오 파일)을 업로드한 다음 요약 언어를 고르세요. 제목, 짧은 요약, 동영상의 해당 지점으로 이동하는 챕터, 주제, 화면에 나타나는 텍스트를 받을 수 있어요.',
      },
      intro: '중요했던 5분을 찾으려고 한 시간짜리 회의나 강의를 다시 보고 싶은 사람은 없어요. Media Manipulator가 대신 보고 들어요. Whisper로 음성을 전사하고, 화면이 바뀌는 지점에서 고른 프레임을 비전 모델로 살펴본 다음, 둘을 바탕으로 요약을 써요. 모두 직접 운영하는 GPU 서버에서 처리해요. 결과는 짧은 문서예요. 제목, 몇 문장의 요약, 시작·종료 시간이 있는 챕터, 주제, 화면에 나온 텍스트가 들어 있어요. 챕터를 클릭하면 동영상의 해당 지점으로 이동하고, 전체를 Markdown으로 복사하거나 Markdown 또는 JSON으로 다운로드할 수 있어요. 요약에는 무료 계정이 필요해요.',
      whatItDoes: [
        '동영상 전체의 제목과 3~6문장 분량의 요약을 작성해요.',
        '동영상을 시작·종료 시간이 있는 챕터로 나눠요. 챕터를 클릭하면 플레이어가 해당 지점으로 이동해요.',
        '주제와 화면에 나타나는 텍스트를 처음 나타난 시간과 함께 나열해요.',
        '화면과 음성을 설명하고, 처리하지 못한 부분(예: 음성 없음)도 알려 줘요.',
        '선택한 언어 또는 음성에 쓰인 언어로 요약을 작성해요.',
      ],
      flowSteps: [
        {
          title: '로그인',
          description: '무료 계정이면 충분해요.',
        },
        {
          title: '업로드',
          description: '동영상 또는 오디오 파일.',
        },
        {
          title: '요약',
          description: '음성과 프레임을 자체 GPU 서버에서 분석해요.',
        },
        {
          title: '읽기',
          description: '챕터 클릭, Markdown 복사, .md 또는 .json 다운로드.',
        },
      ],
      advancedDetails: [
        '음성은 Whisper로 전사하고, 프레임은 장면이 바뀌는 지점에서 요금제의 프레임 한도(Free 24개, Premium 48개, Pro 96개)까지 골라 비전 모델이 묶음으로 설명해요.',
        '언어 모델이 전사본과 프레임 메모를 바탕으로 요약을 작성해요. Pro 계정은 가능한 경우 더 큰 모델이 작성하는 심층 요약을 요청할 수 있어요.',
        '요약 1건은 하루 사용량에서 AI 작업 1건으로 계산돼요. 실패하거나 거부된 작업은 포함되지 않아요.',
        '전사본은 기계가 생성한 것이라 이름이나 숫자가 틀릴 수 있어요. 요약의 참고란에도 이 내용이 표시돼요.',
      ],
      whyItMatters: [
        '챕터가 있는 요약은 1분이면 훑어볼 수 있지만, 동영상은 그렇지 않아요.',
        '클릭할 수 있는 타임스탬프로 필요한 부분으로 바로 이동할 수 있어요.',
        '화면 속 텍스트는 음성으로는 말하지 않는 슬라이드 제목과 자막까지 잡아내요.',
      ],
      useCases: [
        {
          title: '회의 요약',
          description: '결정 사항과 주제를, 세부 내용을 확인할 수 있는 시간과 함께.',
        },
        {
          title: '강의 노트',
          description: '섹션별 챕터와 슬라이드 텍스트로 공부할 수 있어요.',
        },
        {
          title: '튜토리얼 개요',
          description: '단계가 챕터가 되어 필요한 단계로 바로 이동할 수 있어요.',
        },
        {
          title: '인터뷰 개요',
          description: '어떤 이야기가 어디서 나왔는지.',
        },
      ],
      whyMediaManipulator: [
        'Whisper와 비전·언어 모델은 직접 운영하는 하드웨어에서 실행돼요. 동영상은 외부 AI로 전송되지 않아요.',
        '결과 뷰어에서 챕터로 내 동영상을 바로 탐색할 수 있어요.',
        'Markdown과 JSON 다운로드를 지원해요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      ],
      privacyNote: '요약에는 무료 계정이 필요하므로 작업이 계정에 연결돼요. 파일은 자체 서버에서 처리되고 AI 모델은 직접 운영하는 GPU 서버에서 실행돼요. 외부 AI 제공업체로는 아무것도 전송되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: '계정이 필요한가요?',
          answer: '네, 무료 계정이 필요해요. 요약은 여러 AI 모델을 GPU 서버에서 실행하기 때문에 로그인한 사용자만 이용할 수 있어요.',
        },
        {
          question: '무엇을 받을 수 있나요?',
          answer: '제목, 짧은 요약, 시작·종료 시간이 있는 챕터, 주제, 시간이 표시된 화면 속 텍스트, 화면과 음성에 대한 설명, 처리하지 못한 부분에 대한 참고 사항을 받을 수 있어요.',
        },
        {
          question: '요약 언어를 선택할 수 있나요?',
          answer: '네. 사이트에서 지원하는 18개 언어 중에서 고르거나, "음성과 같은 언어"를 선택해 음성에 쓰인 언어로 작성할 수 있어요.',
        },
        {
          question: '동영상에 음성이 없으면 어떻게 되나요?',
          answer: '화면만으로 요약을 작성하고 참고란에 그 사실을 알려요. 화면도 소리도 없는 파일은 거부되며 사용량에 포함되지 않아요.',
        },
        {
          question: '내 동영상이 외부로 전송되나요?',
          answer: '아니요. 모든 모델은 직접 운영하는 GPU 서버에서 실행돼요.',
        },
        {
          question: '사용량에 포함되나요?',
          answer: '네, AI 작업 1건으로 계산돼요. 실패한 작업은 포함되지 않아요.',
        },
      ],
      related: [
        {
          label: '오디오 요약',
          to: '/tools/summarize-audio',
          description: '팟캐스트와 녹음용.',
        },
        {
          label: '동영상 전사',
          to: '/tools/transcribe-video',
          description: '전체 전사본.',
        },
        {
          label: '오디오 전사',
          to: '/tools/transcribe-audio',
          description: '오디오 파일용.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: '먼저 오디오를 깨끗하게 만드세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'AI 작업 1건으로 계산돼요. 실패한 작업은 포함되지 않아요.',
          '길이는 요금제의 동영상 길이 한도까지 가능해요.',
        ],
      },
    },
    'summarize-audio': {
      name: '오디오 요약',
      h1: 'AI로 오디오 녹음 요약하기',
      tagline: '팟캐스트, 인터뷰, 음성 메모를 챕터와 주제가 담긴 요약본으로 바꿔 보세요. 자체 GPU 서버에서 만들어요.',
      metaTitle: '챕터를 만들어 주는 AI 오디오 요약 | Media Manipulator',
      metaDescription: 'MP3, WAV 또는 M4A를 업로드하면 타임스탬프가 있는 챕터와 주제가 담긴 요약을 만들어 드려요. Whisper와 언어 모델은 자체 GPU 서버에서 실행돼요. 무료 계정이 필요해요.',
      ogTitle: 'AI로 오디오 녹음 요약하기',
      ogDescription: '모든 녹음을 챕터와 주제가 담긴 요약으로. 무료 계정이 필요해요.',
      embed: {
        title: '오디오 파일 요약하기',
        description: '로그인하고 녹음을 업로드한 다음 요약 언어를 고르세요. 제목, 짧은 요약, 녹음의 해당 지점으로 이동하는 챕터, 주제를 받을 수 있어요.',
      },
      intro: '팟캐스트 에피소드, 인터뷰, 긴 음성 메모는 한 시간 분량의 오디오보다 한 페이지 문서로 보는 편이 활용하기 쉬워요. Media Manipulator는 Whisper로 녹음을 전사하고, 언어 모델이 그 전사본을 바탕으로 요약을 작성해요. 모두 직접 운영하는 GPU 서버에서 처리해요. 제목, 몇 문장의 요약, 시작·종료 시간이 있는 챕터, 주제를 받을 수 있어요. 챕터를 클릭하면 녹음의 해당 지점으로 이동하고, 요약을 Markdown으로 복사하거나 Markdown 또는 JSON으로 다운로드할 수 있어요. 요약에는 무료 계정이 필요해요.',
      whatItDoes: [
        '녹음의 제목과 짧은 요약을 작성해요.',
        '시간이 표시된 챕터로 나눠요. 챕터를 클릭하면 플레이어가 해당 지점으로 이동해요.',
        '주제를 나열하고 누가 어떤 어조로 말하는지 설명해요.',
        '선택한 언어 또는 음성에 쓰인 언어로 요약을 작성해요.',
      ],
      flowSteps: [
        {
          title: '로그인',
          description: '무료 계정이면 충분해요.',
        },
        {
          title: '업로드',
          description: 'MP3, WAV, M4A 및 기타 오디오.',
        },
        {
          title: '요약',
          description: '자체 GPU 서버에서 Whisper와 언어 모델이 처리해요.',
        },
        {
          title: '읽기',
          description: '챕터 클릭, Markdown 복사, .md 또는 .json 다운로드.',
        },
      ],
      advancedDetails: [
        '음성은 Whisper로 전사하고, 언어 모델이 전사본을 바탕으로 요약을 작성해요.',
        '커버 아트가 있는 오디오 파일은 오디오로 취급하며 이미지는 무시해요.',
        '요약 1건은 하루 사용량에서 AI 작업 1건으로 계산돼요. 실패하거나 거부된 작업은 포함되지 않아요.',
        '전사본은 기계가 생성한 것이라 이름이나 숫자가 틀릴 수 있어요. 요약의 참고란에도 이 내용이 표시돼요.',
      ],
      whyItMatters: [
        '요약은 1분이면 읽을 수 있어서 들어 볼지 바로 정할 수 있어요.',
        '시간이 표시된 챕터로 긴 녹음도 쉽게 탐색할 수 있어요.',
        '주제 덕분에 지난 에피소드도 검색하기 쉬워져요.',
      ],
      useCases: [
        {
          title: '팟캐스트 쇼 노트',
          description: '에피소드 페이지용 챕터와 주제.',
        },
        {
          title: '인터뷰 요약',
          description: '다룬 내용과 인용할 수 있는 시간.',
        },
        {
          title: '음성 메모를 노트로',
          description: '두서없는 메모를 짧은 페이지로.',
        },
        {
          title: '통화 요약',
          description: '녹음된 통화의 핵심 내용.',
        },
      ],
      whyMediaManipulator: [
        'Whisper와 언어 모델은 직접 운영하는 하드웨어에서 실행돼요. 녹음은 외부 AI로 전송되지 않아요.',
        '결과 뷰어에서 챕터로 내 녹음을 바로 탐색할 수 있어요.',
        'Markdown과 JSON 다운로드를 지원해요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      ],
      privacyNote: '요약에는 무료 계정이 필요하므로 작업이 계정에 연결돼요. 파일은 자체 서버에서 처리되고 AI 모델은 직접 운영하는 GPU 서버에서 실행돼요. 외부 AI 제공업체로는 아무것도 전송되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: '계정이 필요한가요?',
          answer: '네, 무료 계정이 필요해요. 요약은 AI 모델을 GPU 서버에서 실행하기 때문에 로그인한 사용자만 이용할 수 있어요.',
        },
        {
          question: '전사와는 어떻게 다른가요?',
          answer: '전사는 모든 말을 그대로 옮겨요. 요약은 그 전사본을 바탕으로 제목, 몇 문장의 요약, 챕터, 주제를 작성해요.',
        },
        {
          question: '요약 언어를 선택할 수 있나요?',
          answer: '네. 사이트에서 지원하는 18개 언어 중에서 고르거나, "음성과 같은 언어"를 선택할 수 있어요.',
        },
        {
          question: '내 녹음이 외부로 전송되나요?',
          answer: '아니요. 모델은 직접 운영하는 GPU 서버에서 실행돼요.',
        },
        {
          question: '사용량에 포함되나요?',
          answer: '네, AI 작업 1건으로 계산돼요. 실패한 작업은 포함되지 않아요.',
        },
      ],
      related: [
        {
          label: '오디오 전사',
          to: '/tools/transcribe-audio',
          description: '모든 말을 텍스트나 자막으로.',
        },
        {
          label: '동영상 요약',
          to: '/tools/summarize-video',
          description: '화면과 화면 속 텍스트까지 더해요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: '먼저 오디오를 깨끗하게 만드세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'AI 작업 1건으로 계산돼요. 실패한 작업은 포함되지 않아요.',
        ],
      },
    },
    // MM78 voices: name + tagline (model-written, needs native review).
    'voice-cloning': {
      name: '음성 클론',
      tagline:
        '내 말소리를 5초에서 60초 동안 녹음하거나 업로드해 음성을 만들고, 20개가 넘는 언어로 원하는 텍스트를 읽게 하세요.',
    },
    'voice-designer': {
      name: '음성 디자이너',
      tagline:
        '음성을 말로 설명하고 미리 들어 본 뒤, 마음에 드는 음성을 보관해 20개가 넘는 언어로 원하는 텍스트를 읽게 하세요.',
    },
    'voice-changer': {
      name: '음성 변경기',
      tagline:
        '녹음의 음높이와 성격을 즉시 바꾸거나, AI로 말소리를 저장한 음성이나 프리셋 음성으로 변환하세요.',
    },
    // MM84: name / tagline / metaTitle / metaDescription for the copy-bar tool pages (model-written, needs native review).
    'content-studio': {
      name: 'Darkroom',
      tagline: '멀티트랙 타임라인에서 영상과 오디오를 편집하고, 겹치고, 믹싱한 다음 MP4로 내보내세요. 브라우저에서 바로 쓰는 Premiere Pro 스타일 편집기입니다.',
      metaTitle: 'Darkroom: 무료 온라인 멀티트랙 동영상 편집기 | Media Manipulator',
      metaDescription: '멀티트랙 타임라인에서 영상과 오디오를 편집하고, 겹치고, 믹싱한 다음 MP4로 내보내세요. 브라우저에서 바로 실행되는 무료 Premiere Pro 스타일 동영상 편집기입니다. 가입도 설치도 필요 없습니다.',
    },
    'remove-exif-metadata': {
      name: '이미지에서 EXIF 메타데이터 삭제',
      tagline: '사진을 어디에 공유하기 전에 GPS 위치, 기기, 카메라, 촬영 시각 데이터를 제거하세요.',
      metaTitle: '이미지 EXIF 메타데이터 온라인 삭제 (무료) | Media Manipulator',
      metaDescription: 'JPG, PNG, WebP, HEIC 이미지에서 EXIF, GPS, IPTC, 카메라 메타데이터를 삭제하는 무료 온라인 도구입니다. 가입이 필요 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
    },
    'compress-image': {
      name: '이미지 압축',
      tagline: 'JPG, PNG, WebP 파일 크기를 줄여 웹사이트를 더 빠르게 하고, 업로드 용량을 줄이고, 더 쉽게 공유하세요.',
      metaTitle: '이미지 온라인 무료 압축 | Media Manipulator',
      metaDescription: '무료 온라인 이미지 압축기입니다. 좋은 화질을 유지하면서 JPG, PNG, WebP 파일 크기를 줄이세요. 가입이 필요 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
    },
    'image-resizer': {
      name: '이미지 크기 조절',
      tagline: 'JPG, PNG, WebP, GIF 이미지를 가로세로 비율을 유지한 채 정확한 픽셀 크기로 조절하세요.',
      metaTitle: '이미지 온라인 무료 크기 조절 | Media Manipulator',
      metaDescription: '무료 온라인 이미지 크기 조절 도구입니다. JPG, PNG, WebP, GIF 이미지를 가로세로 비율을 유지한 채 정확한 픽셀 크기로 조절하세요. 가입이 필요 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
    },
    'remove-background-from-image': {
      name: '이미지 배경 제거',
      tagline: '어떤 사진이든 배경을 자동으로 지우고 깔끔한 투명 PNG 누끼 이미지를 내려받으세요.',
      metaTitle: '이미지 배경 온라인 무료 제거 | Media Manipulator',
      metaDescription: '무료 온라인 배경 제거 도구입니다. 어떤 사진이든 배경을 자동으로 지우고 투명 PNG를 내려받으세요. 자체 GPU에서 실행되며 외부 AI를 쓰지 않습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
    },
    'image-to-pdf': {
      name: '이미지를 PDF로',
      tagline: 'JPG, PNG 등의 이미지를 깔끔하고 공유하기 쉬운 PDF 문서로 한 번에 바꾸세요.',
      metaTitle: '이미지를 PDF로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 이미지 PDF 변환기입니다. JPG, PNG 등의 이미지를 깔끔한 PDF 문서로 바꾸세요. 가입도 워터마크도 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
    },
    'pdf-to-jpg': {
      name: 'PDF를 JPG로',
      tagline: 'PDF의 모든 페이지를 공유, 편집, 게시할 수 있는 고화질 JPG 이미지로 변환하세요.',
      metaTitle: 'PDF를 JPG로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 PDF JPG 변환기입니다. PDF의 모든 페이지를 고화질 JPG 이미지로 변환해 ZIP으로 내려받으세요. 가입이 필요 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
    },
    'compress-video': {
      name: '동영상 압축',
      tagline: '웹, 이메일, 소셜 미디어, 클라우드 업로드에 맞게 MP4, WebM, MOV, MKV, AVI 파일 크기를 줄이세요.',
      metaTitle: '동영상 온라인 압축 (무료) | Media Manipulator',
      metaDescription: '무료 온라인 동영상 압축기입니다. 좋은 화질을 유지하면서 MP4, WebM, MOV, MKV, AVI 파일 크기를 줄이세요. 가입이 필요 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
    },
    'video-trimmer': {
      name: '동영상 자르기',
      tagline: '빠르고 화질이 유지되는 트리밍으로 클립에서 원하는 부분만 잘라내세요. 가능하면 다시 인코딩하지 않습니다.',
      metaTitle: '동영상 온라인 무료 자르기 | Media Manipulator',
      metaDescription: '무료 온라인 동영상 자르기 도구입니다. 시작 시간과 종료 시간을 정하고 빠르고 손실 없는 트리밍으로 클립을 자르세요. MP4 출력, 워터마크 없음, 가입 불필요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
    },
    'extract-audio-from-video': {
      name: '동영상에서 오디오 추출',
      tagline: '어떤 동영상이든 오디오 트랙을 깔끔한 MP3, WAV, M4A, AAC, FLAC, OGG 파일로 저장하세요.',
      metaTitle: '동영상에서 오디오 추출: MP3, WAV, M4A 등 | Media Manipulator',
      metaDescription: '모든 동영상 파일(MP4, MOV, MKV, WebM, AVI)에서 오디오를 추출하는 무료 온라인 도구입니다. MP3, WAV, M4A, AAC, FLAC, OGG로 출력할 수 있습니다. 가입이 필요 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
    },
    'convert-video-to-animated-gif': {
      name: '동영상을 움직이는 GIF로 변환',
      tagline: '짧은 MP4, WebM, MOV, MKV 클립을 공유하기 좋은 움직이는 GIF로 몇 초 만에 바꾸세요.',
      metaTitle: '동영상을 움직이는 GIF로 온라인 변환 (무료) | Media Manipulator',
      metaDescription: '무료 온라인 동영상 GIF 변환기입니다. 짧은 MP4, WebM, MOV, MKV 클립을 크기와 프레임 속도를 조절해 움직이는 GIF로 바꾸세요.',
    },
    'transcribe-video': {
      name: '동영상 텍스트 변환',
      tagline: '동영상이나 오디오 파일 속 음성을 WebVTT 또는 SRT 자막, 일반 텍스트, 타임스탬프가 있는 JSON으로 추출하세요.',
      metaTitle: '동영상을 텍스트로 온라인 변환 (무료) | Media Manipulator',
      metaDescription: '무료 온라인 동영상 받아쓰기 도구입니다. MP4, MOV, WebM, MKV, 오디오 파일을 검색 가능한 텍스트, VTT 자막, JSON 스크립트로 변환하세요.',
    },
    'transcode-to-hls': {
      name: '동영상을 HLS로 트랜스코딩',
      tagline: '모든 동영상을 Apple HLS VOD 번들로 패키징하세요. master.m3u8과 화질별 .ts 세그먼트로, 바로 웹에서 쓸 수 있습니다.',
      metaTitle: '동영상을 HLS로 온라인 트랜스코딩 | 무료 적응형 스트리밍 도구',
      metaDescription: '무료 온라인 HLS 트랜스코더입니다. MP4, MOV, WebM, MKV를 360p/480p/720p 화질과 선택형 자막, 스토리보드를 갖춘 HLS VOD 패키지로 변환하세요.',
    },
    'ai-video-restoration': {
      name: 'AI 동영상 복원',
      tagline: '최대 6개의 AI 모델(Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT, VRT)로 짧은 동영상을 업스케일하고 복원하며, 모든 결과를 나란히 비교하세요.',
      metaTitle: 'AI 동영상 복원 도구: 업스케일링 모델 6종 온라인 비교 | Media Manipulator',
      metaDescription: '무료 AI 동영상 복원 도구입니다. 짧은 클립을 자체 GPU에서 Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT, VRT 초해상도 모델로 처리하고 모든 결과를 하나의 패키지로 내려받으세요.',
    },
    'ai-image-restoration': {
      name: 'AI 이미지 복원 및 업스케일링',
      tagline: '최대 8개의 AI 모델로 사진을 정리하고, 업스케일하고, 복원하세요. 원본 충실도를 지키는 사전 정리(FBCNN, SCUNet, NAFNet), 범용 업스케일러(Real-ESRGAN, SwinIR, HAT), 얼굴 보정(GFPGAN, CodeFormer)을 지원하며, 모든 결과를 원본과 비교할 수 있습니다.',
      metaTitle: 'AI 이미지 복원 및 업스케일러: 모델 8종 온라인 비교 | Media Manipulator',
      metaDescription: '무료 AI 사진 복원 및 업스케일링입니다. JPEG 노이즈를 없애고, 잡음과 흐림을 줄인 다음 Real-ESRGAN, SwinIR, HAT로 4K/8K까지 업스케일하고 GFPGAN/CodeFormer로 얼굴을 보정하세요. 모두 자체 GPU에서 처리되며 나란히 비교할 수 있습니다.',
    },
    'ai-document-scan': {
      name: 'AI 문서 스캔',
      tagline: '스캔한 문서와 손으로 쓴 메모를 검색 가능한 여러 페이지 PDF와 편집 가능한 Word 문서로 바꾸세요. 인쇄된 페이지에는 Tesseract의 충실한 텍스트 레이어가 입혀지고, 손글씨는 비전 AI가 받아 적으며 불확실한 부분은 표시할 뿐 지어내지 않습니다.',
      metaTitle: 'AI 문서 스캔: 스캔한 페이지와 손글씨를 PDF/Word로 | Media Manipulator',
      metaDescription: '무료 AI 문서 스캔입니다. 스캔한 이미지를 검색 가능한 PDF와 이미지 Word OCR로 변환하고, 손으로 쓴 메모도 텍스트로 옮기세요. 페이지 순서 변경, 인쇄물과 손글씨 혼합도 가능하며, 모두 자체 GPU에서 원문 그대로 처리하고 불확실한 부분은 표시합니다.',
    },
    'ai-image-upscaler': {
      name: 'AI 이미지 업스케일러',
      tagline: '작거나 흐릿한 사진을 단순히 픽셀을 늘리는 대신 세부 묘사를 다시 만들어 내는 Real-ESRGAN 모델로 확대하세요.',
      metaTitle: 'AI 이미지 업스케일러: 사진을 2배 또는 4배로 확대 | Media Manipulator',
      metaDescription: '저해상도 사진을 윤곽과 질감을 되살리는 AI로 2배 또는 4배 업스케일하세요. 자체 GPU에서 실행되며 PNG로 출력합니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
    },
    'blur-faces-in-photo': {
      name: '사진 속 얼굴 흐리게 처리',
      tagline: '얼굴을 자동으로 감지한 다음, 모든 얼굴 또는 선택한 얼굴만 흐리게, 모자이크로, 검게 가리세요.',
      metaTitle: '사진 속 얼굴 온라인 흐리게 처리 | Media Manipulator',
      metaDescription: '사진 속 얼굴을 흐리게, 모자이크로, 검게 가리세요. 모든 얼굴을 감지한 다음 가릴 얼굴을 고르세요. AI는 자체 GPU에서 실행됩니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
    },
    'redact-text-in-image': {
      name: '이미지 속 텍스트 가리기',
      tagline: '스크린샷이나 사진에서 읽을 수 있는 텍스트를 찾아 개인 정보 또는 모든 텍스트를 흐림 효과나 검은 상자로 가리세요.',
      metaTitle: '이미지 속 텍스트 온라인 가리기 | Media Manipulator',
      metaDescription: '이미지에서 텍스트를 자동으로 찾아 이름, 이메일, 번호 등 개인 정보를 검게 가리거나 흐리게 처리하세요. AI는 자체 GPU에서 실행됩니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
    },
    'remove-object-from-photo': {
      name: '사진에서 개체 제거',
      tagline: '사진에 넣고 싶지 않은 대상 주위에 상자를 그리면 인페인팅 모델이 어울리는 배경으로 빈 곳을 채웁니다.',
      metaTitle: '사진에서 개체 온라인 제거 | Media Manipulator',
      metaDescription: '사진에서 원치 않는 개체를 지우세요. 사각형을 그리면 AI 인페인팅이 배경에 맞춰 빈 곳을 채웁니다. 자체 GPU에서 실행됩니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
    },
    'clean-voice-audio': {
      name: '음성 오디오 정리',
      tagline: '팟캐스트, 인터뷰, 음성 메모에서 쉭쉭거리는 소리, 방 울림, 낮은 웅웅거림을 줄여 말소리를 더 또렷하게 만드세요.',
      metaTitle: 'AI로 음성 녹음 정리하기 | Media Manipulator',
      metaDescription: 'AI로 음성 녹음을 정리하세요. 쉭쉭거리는 소리, 험 노이즈, 방 소음을 줄여 말소리를 더 잘 들리게 합니다. 자체 GPU에서 실행됩니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
    },
    'remove-background-noise': {
      name: '배경 소음 제거',
      tagline: 'AI 노이즈 제거기로 녹음 속 쉭쉭거리는 소리, 험 노이즈, 교통 소음, 방 소음을 낮추고 주된 소리는 앞에 유지하세요.',
      metaTitle: '오디오 배경 소음 온라인 제거 | Media Manipulator',
      metaDescription: '오디오에서 배경 소음을 제거하세요. AI 노이즈 제거기가 녹음 속 쉭쉭거리는 소리, 험 노이즈, 주변 소리를 낮춥니다. 자체 GPU에서 실행됩니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
    },
    'remove-vocals-from-song': {
      name: '노래에서 보컬 제거',
      tagline: '트랙에서 노래를 빼고 음악만 남겨 노래방, 연습, 반주 트랙에 쓰세요. 사용 권한이 있는 음악에만 사용하세요.',
      metaTitle: '노래에서 보컬 제거: 노래방 메이커 | Media Manipulator',
      metaDescription: 'AI로 노래에서 보컬을 제거하고 인스트루멘털을 원본 파일과 같은 형식이나 FLAC, WAV로 내려받으세요. 노래방 및 연습용 트랙을 자체 GPU에서 만듭니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
    },

    // 2026-10-31 (MM92): name + tagline for every remaining tool, so the /tools catalog
    // and the home grid never show an English card in this locale. Model-written; native review pending.
    'transcode-to-dash': {
      name: '동영상을 DASH(AV1 / VP9)로 변환',
      tagline: '어떤 동영상이든 manifest.mpd와 화질별 초기화/미디어 세그먼트가 담긴 MPEG-DASH 번들로 패키징해요.',
    },
    'convert-webp-to-jpg': {
      name: 'WebP를 JPG로 변환',
      tagline: 'WebP 이미지를 어떤 이미지 뷰어나 편집기에서도 열리는 호환성 좋은 JPG 파일로 바꿔요.',
    },
    'convert-png-to-jpg': {
      name: 'PNG를 JPG로 변환',
      tagline: '용량이 큰 PNG 스크린샷과 그래픽을 어디서나 열리는 작은 JPG 사진으로 몇 초 만에 바꿔요.',
    },
    'convert-jpg-to-png': {
      name: 'JPG를 PNG로 변환',
      tagline: 'JPG 사진을 편집, 투명 배경, 고품질 그래픽 작업에 알맞은 무손실 PNG 파일로 바꿔요.',
    },
    'convert-webp-to-png': {
      name: 'WebP를 PNG로 변환',
      tagline: 'WebP 이미지를 어디서나 열리고 투명도도 그대로 유지되는 무손실 PNG 파일로 바꿔요.',
    },
    'convert-png-to-webp': {
      name: 'PNG를 WebP로 변환',
      tagline: 'PNG 그래픽을 웹에서 더 빠르게 로드되는 최신 WebP 파일로 줄여요. 투명도는 그대로 유지돼요.',
    },
    'convert-jpg-to-webp': {
      name: 'JPG를 WebP로 변환',
      tagline: 'JPG 사진을 같은 화질로 웹에서 더 빠르게 로드되는 최신 WebP 파일로 줄여요.',
    },
    'jpg-converter': {
      name: 'JPG 변환기',
      tagline: '이미지를 JPG로 변환해요. JPG가 미리 선택된 이미지 변환기예요.',
    },
    'png-converter': {
      name: 'PNG 변환기',
      tagline: '이미지를 PNG로 변환해요. PNG가 미리 선택된 이미지 변환기예요.',
    },
    'convert-jpg-to-pdf': {
      name: 'JPG를 PDF로 변환',
      tagline: 'JPG 사진과 스캔본을 공유, 인쇄, 업로드하기 좋은 깔끔한 PDF 문서로 바꿔요.',
    },
    'convert-png-to-pdf': {
      name: 'PNG를 PDF로 변환',
      tagline: 'PNG 스크린샷, 그래픽, 스캔본을 깔끔하고 선명한 PDF 문서로 바꿔요.',
    },
    'pdf-to-png': {
      name: 'PDF를 PNG로',
      tagline: 'PDF의 모든 페이지를 선명한 무손실 PNG 이미지로 변환해요. 텍스트, 도표, 편집 작업에 알맞아요.',
    },
    'pdf-converter': {
      name: 'PDF 변환기',
      tagline: 'PDF를 JPG나 PNG 이미지로 바꾸고, 이미지를 PDF로 만드는 일까지 한곳에서 할 수 있어요.',
    },
    'convert-heic-to-jpg': {
      name: 'HEIC를 JPG로 변환',
      tagline: 'iPhone의 HEIC 사진을 어디서나 열고 업로드할 수 있는 JPG 파일로 바꿔요.',
    },
    'convert-avif-to-jpg': {
      name: 'AVIF를 JPG로 변환',
      tagline: '최신 AVIF 이미지를 AVIF를 지원하지 않는 앱과 사이트에서도 쓸 수 있는 JPG 파일로 바꿔요.',
    },
    'convert-avif-to-png': {
      name: 'AVIF를 PNG로 변환',
      tagline: 'AVIF 이미지를 어디서나 열리고 투명도도 그대로 유지되는 무손실 PNG 파일로 바꿔요.',
    },
    'convert-svg-to-png': {
      name: 'SVG를 PNG로 변환',
      tagline: 'SVG 아이콘과 로고를 업로드, 슬라이드, 앱에 쓸 수 있도록 원하는 크기의 PNG 이미지로 변환해요.',
    },
    'convert-png-to-svg': {
      name: 'PNG를 SVG로 변환',
      tagline: 'PNG 로고, 아이콘, 선화를 potrace로 확대해도 깨지지 않는 진짜 SVG 패스로 벡터화해요.',
    },
    'png-to-ico': {
      name: 'PNG를 ICO로',
      tagline: 'PNG를 웹사이트 파비콘과 Windows 앱 아이콘에 쓸 수 있는 여러 크기의 .ico 파일로 만들어요.',
    },
    'svg-converter': {
      name: 'SVG 변환기',
      tagline: 'SVG를 PNG로 바꾸거나 PNG를 SVG로 트레이싱해요. SVG를 시작점으로 둔 이미지 변환기예요.',
    },
    'convert-wav-to-mp3': {
      name: 'WAV를 MP3로 변환',
      tagline: '용량이 큰 무손실 WAV 녹음을 팟캐스트, 공유, 보관에 알맞은 호환성 좋은 MP3 파일로 줄여요.',
    },
    'isolate-vocals-from-song': {
      name: '노래에서 보컬 분리',
      tagline: '리믹스, 커버, 받아쓰기, 분석을 위해 음악 트랙에서 보컬을 추출해요. 사용 권한이 있는 음악에만 사용하세요.',
    },
    'image-converter': {
      name: '이미지 변환기',
      tagline: 'JPG, PNG, WebP, AVIF, GIF 등 여러 형식 사이를 변환해요. 품질, 크기 조정, 자르기, 메타데이터도 직접 정할 수 있어요.',
    },
    'video-converter': {
      name: '동영상 변환기',
      tagline: 'MP4, WebM, MOV, AVI, MKV 등 여러 형식 사이를 변환해요. 코덱, 해상도, 오디오도 자유롭게 설정할 수 있어요.',
    },
    'mp4-converter': {
      name: 'MP4 변환기',
      tagline: '동영상을 MP4로 변환해요. MP4가 미리 선택된 동영상 변환기예요.',
    },
    'convert-mov-to-mp4': {
      name: 'MOV를 MP4로 변환',
      tagline: 'QuickTime과 iPhone의 .mov 파일을 어디서나 재생하고 업로드할 수 있는 MP4로 바꿔요.',
    },
    'convert-webm-to-mp4': {
      name: 'WebM을 MP4로 변환',
      tagline: '웹에 최적화된 .webm 동영상을 편집, 공유하고 어떤 기기에서나 재생할 수 있는 MP4로 바꿔요.',
    },
    'convert-avi-to-mp4': {
      name: 'AVI를 MP4로 변환',
      tagline: '오래된 .avi 동영상을 모든 휴대폰, 브라우저, TV에서 재생되는 작은 MP4로 새롭게 바꿔요.',
    },
    'convert-mkv-to-mp4': {
      name: 'MKV를 MP4로 변환',
      tagline: 'Matroska .mkv 파일을 MKV를 지원하지 않는 기기에서도 스트리밍, 업로드, 재생할 수 있는 MP4로 바꿔요.',
    },
    'convert-mp4-to-webm': {
      name: 'MP4를 WebM으로 변환',
      tagline: 'MP4를 더 작고 개방형인 VP9 WebM으로 다시 인코딩해요. 빠르게 로드되는 웹 동영상에 안성맞춤이에요.',
    },
    'mp4-to-mp3': {
      name: 'MP4를 MP3로 변환',
      tagline: 'MP4의 오디오를 MP3로 가져와요. 입력은 MP4, 출력은 MP3로 설정된 ‘동영상에서 오디오 추출’이에요.',
    },
    'video-to-mp3': {
      name: '동영상을 MP3로 변환',
      tagline: '동영상의 사운드트랙을 MP3로 뽑아내요. ‘동영상에서 오디오 추출’과 같은 도구예요.',
    },
    'mp4-to-gif': {
      name: 'MP4를 GIF로 변환',
      tagline: 'MP4 클립으로 반복 재생되는 GIF를 만들어요. 입력이 MP4로 고정된 움직이는 GIF 변환기예요.',
    },
    'video-to-gif': {
      name: '동영상을 GIF로 변환',
      tagline: '흔한 동영상 형식의 짧은 클립을 반복 재생되는 GIF로 바꿔요. 움직이는 GIF 변환기와 같은 도구예요.',
    },
    'gif-converter': {
      name: 'GIF 변환기',
      tagline: '동영상 클립으로 움직이는 GIF를 만들고 다듬어요. 이름만 다른 움직이는 GIF 변환기예요.',
    },
    'video-compressor': {
      name: '동영상 압축기',
      tagline: '압축 프리셋으로 동영상 용량을 줄여요. ‘동영상 압축’과 같은 도구예요.',
    },
    'compress-mp4': {
      name: 'MP4 압축',
      tagline: 'MP4를 MP4 그대로 더 작게 만들어요. 컨테이너가 고정된 ‘동영상 압축’이에요.',
    },
    'mp4-trimmer': {
      name: 'MP4 자르기',
      tagline: '입력과 출력이 모두 MP4로 고정된 동영상 자르기 도구예요.',
    },
    'video-cutter': {
      name: '동영상 컷 편집',
      tagline: '동영상의 한 구간만 남기고 나머지는 잘라내요. 동영상 자르기와 같은 도구예요.',
    },
    'cut-video-online': {
      name: '온라인 동영상 자르기',
      tagline: '설치 없이 브라우저에서 동영상의 원하는 구간을 잘라내요. 이름만 다른 동영상 자르기 도구예요.',
    },
    'crop-video': {
      name: '동영상 화면 자르기',
      tagline: '동영상의 가장자리를 잘라내 편집기 없이 구도나 화면 비율을 바꿔요.',
    },
    'resize-video': {
      name: '동영상 크기 조정',
      tagline: '동영상 해상도를 바꿔요. 1080p, 720p, 480p나 원하는 가로세로 크기로 조정할 수 있어요.',
    },
    'rotate-video': {
      name: '동영상 회전',
      tagline: '옆으로 누웠거나 거꾸로 된 동영상을 바로잡아요. 90°, 180°, 270° 회전과 뒤집기를 클릭 한 번으로 할 수 있어요.',
    },
    'remove-audio-from-video': {
      name: '동영상에서 오디오 제거',
      tagline: '동영상을 완전히 무음으로 만들어요. 오디오 트랙을 제거하고 소리 없는 동영상 파일을 다운로드하세요.',
    },
    'audio-converter': {
      name: '오디오 변환기',
      tagline: 'MP3, WAV, M4A, OGG, FLAC, OPUS 등 여러 형식 사이를 변환해요. 비트레이트, 샘플 레이트, 채널도 자유롭게 설정할 수 있어요.',
    },
    'srt-generator': {
      name: 'SRT 자막 생성기',
      tagline: '동영상이나 오디오 파일을 업로드하면 YouTube, 편집기, 접근성 도구에 바로 쓸 수 있는 .srt 자막 파일을 만들어 다운로드할 수 있어요.',
    },
    'caption-translator': {
      name: '자막 번역기',
      tagline: 'SRT와 VTT 자막 파일의 큐 타이밍, 순서, 구조를 그대로 유지하면서 번역해요. 제3자 AI 제공업체는 사용하지 않아요.',
    },
    'audio-waveform-generator': {
      name: '오디오 파형 생성기',
      tagline: '어떤 오디오 파일이든 설정 가능한 파형 동영상이나 파형 이미지, 또는 둘 다로 만들어요. 팟캐스트, 음악 미리듣기, 소셜 클립에 알맞아요.',
    },
    'extract-video-only-from-video': {
      name: '오디오 없이 동영상만 추출',
      tagline: '모든 오디오 트랙을 제거한 무음, 동영상 전용 사본을 내보내요. 무음 미리보기, B-roll, 편집, 음악 다시 입히기에 알맞아요.',
    },
    'extract-frames-from-video': {
      name: '동영상에서 프레임 추출',
      tagline: 'N초마다, 원하는 프레임 레이트로, 또는 특정 시점에서 동영상의 정지 이미지 프레임을 뽑아 ZIP으로 다운로드해요.',
    },
    'stitch-audio-to-video': {
      name: '동영상에 오디오 추가',
      tagline: '기본 동영상에 보이스오버, 음악, 내레이션 등 오디오 파일을 최대 세 개까지 합쳐 새 MP4로 다운로드해요.',
    },
    'ai-frame-interpolation': {
      name: 'AI 프레임 보간',
      tagline: 'AI가 만든 중간 프레임으로 동영상 프레임 레이트를 48, 60, 120FPS로 높여 움직임을 더 부드럽게 만들어요.',
    },
  },
} as const;

export default koToolPages;
