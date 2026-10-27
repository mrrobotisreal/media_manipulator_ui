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
  },
} as const;

export default koToolPages;
