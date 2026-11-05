/**
 * Korean partial overrides for the data-driven tool pages
 * (see `i18n/toolPageContent.ts` — anything omitted falls back to English).
 *
 * Scope: MM62 (2026-10-27) added Motion's full page body; MM92 (2026-10-31)
 * added `name` + `tagline` for every tool; MM93 (2026-11-04) added the full
 * body of every non-alias tool page (98), model-written by Opus 5.5; native
 * review pending. MM102-ko (2026-11-04) added the full bodies of the 25
 * Aperture pages (`aperture` + the 24 adjustment pages), model-written by
 * Opus 5.5 from MM100's English; native review pending. Trim is 자르기 and
 * crop is 화면 자르기; frame rate is 프레임 레이트 (tools.json); allowances are
 * 일반 작업 and AI 작업 (pricing FAQ); the Free tier is 무료 계정; "third-party"
 * is 외부. Aperture terms follow interface/panels.json `photo.*`. Number words
 * the English spells out are written as Korean words: the body checker
 * matches ASCII digits with English.
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
      h1: 'Motion',
      tagline: 'SVG를 그리거나 가져와 키프레임 타임라인에서 애니메이션하고, 애니메이션 SVG, Lottie, React, JavaScript, Flutter 또는 GIF로 내보내세요. 모두 브라우저 안에서 이루어져요.',
      intro: 'Motion은 Media Manipulator에 내장된 애니메이션 타임라인이 있는 SVG 편집기예요. SVG 파일(또는 Lottie 애니메이션)을 열면 모든 도형이 선택하고, 옮기고, 색을 바꾸고, 애니메이션할 수 있는 레이어가 돼요. 빈 캔버스에서 시작해 사각형, 타원, 선, 펜, 텍스트 도구로 그릴 수도 있어요. 애니메이션하는 각 속성은 이징 프리셋, 맞춤 이징을 위한 커브 편집기, 즉시 전환되는 홀드 키를 갖춘 자신만의 키프레임 트랙을 가져요. 원클릭 애니메이터로 선 그리기, 경로를 따라 이동, 모양 모프, 그라데이션 색 변화, 마스크 애니메이션, 흐림을 추가할 수 있어요. 원하는 대로 움직이면 애니메이션 SVG, Lottie 파일, React 컴포넌트, JavaScript 또는 TypeScript 모듈, Flutter 위젯 또는 GIF로 내보내세요. 편집과 모든 내보내기는 브라우저에서 실행되므로 내보내기를 위해 아트워크가 업로드되는 일은 없어요.',
      whatItDoes: [
        'SVG 파일을 편집 가능한 레이어 트리(그룹, 경로, 도형, 텍스트, 이미지, 그라데이션, 마스크, 클립 경로)로 가져오고, Lottie JSON 애니메이션을 키프레임과 함께 가져와요. 파일당 최대 4 MB까지 가능해요.',
        '사각형, 타원, 선, 펜(베지어), 텍스트 도구로 새 아트워크를 그리고 캔버스에서 경로 노드를 직접 편집해요.',
        '위치, 배율, 회전, 기울이기, 불투명도, 채우기, 선, 선 두께를 키프레임 타임라인에서 애니메이션하며, 선형, 이즈 인, 이즈 아웃, 이즈 인아웃, 맞춤 큐빅 베지어, 홀드 이징을 쓸 수 있어요.',
        '클릭 한 번으로 적용하는 애니메이터 여섯 가지를 추가해요: 선 그리기, 자동 회전 옵션이 있는 경로 따라 이동, 모양 모프, 그라데이션 지점 색상, 마스크와 클립 경로 애니메이션, 흐림.',
        '정적 SVG(항상 무료이며 횟수에 포함되지 않아요), 라이브러리 없이 재생되는 애니메이션 SVG, Lottie JSON, React 컴포넌트, JavaScript 또는 TypeScript 모듈, Flutter 위젯, 애니메이션 GIF를 내보내요. 모두 내 기기에서 생성돼요.',
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
        '애니메이션 SVG 내보내기는 모든 효과를 Chrome, Firefox, Safari에서 CSS로 표현할 수 있을 때 순수 CSS 키프레임을 사용해요. 모양 모프, 움직이는 그라데이션 지점, 흐림에는 스크립트가 필요하므로, 그런 파일에는 라이선스 고지가 맨 위에 적힌 축소판 anime.js(MIT 라이선스, 스크립트 약 31 KB, gzip 후 약 13 KB)가 포함돼요.',
        '모양 모프는 두 모양을 같은 수의 곡선 세그먼트로 정규화하고 시작점과 감기 방향을 맞추므로 모프가 뒤틀리지 않아요. 맞출 수 없는 두 모양은 모프하는 대신 홀드돼요.',
        'Lottie 작성기는 Lottie 1.0.1 사양과 LottieFiles "Basic" 기능 세트를 대상으로 해요. Lottie가 담을 수 없는 것(필터, 텍스트, 고급 마스크 등)은 다운로드 후 목록으로 표시되며, 아무것도 조용히 버려지지 않아요. 가져오기 기능도 반대 방향으로 같은 목록을 사용해요.',
        'GIF 내보내기는 프레임을 하나씩 렌더링해 각각 Worker로 넘기고, Media Manipulator를 위해 작성된 인코더로 인코딩해요. 구간 전체에 고르게 분포한 다섯 프레임에서 샘플링한 하나의 전역 팔레트를 쓰고, 디더링은 기본적으로 꺼져 있으며(평면 벡터 아트는 색이 적고 디더링은 노이즈만 더해요), 프레임 지연은 round(100 / fps) 센티초이고, 투명도는 캔버스 배경이 투명할 때만 유지돼요. 출력은 최대 2 GB로 제한되며, 시작하기 전에 대화 상자에서 예상 크기를 보여 줘요.',
        '가져온 SVG는 들어오는 길에 정리돼요. 스크립트, 이벤트 핸들러, 외부 참조, 기타 안전하지 않은 콘텐츠는 제거되고, 편집기는 지원되지 않는 마크업을 HTML로 삽입하는 대신 허용 목록에서 다시 만들어요. 편집기가 모델링할 수 없는 마크업은 변경 없이 그대로 오가는 불투명 레이어로 유지돼요.',
        '내보내기 카운터는 단일 데이터베이스 트랜잭션이에요. 형식 잠금과 한도를 확인한 다음, 카운터와 내보내기 행을 함께 기록해요. 거부된 내보내기는 아무것도 기록하지 않고 사용량도 차감하지 않지만, 그 후에 브라우저가 취소하거나 실패한 내보내기는 이미 집계된 상태예요.',
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
      workedExamples: [
        {
          title: '애니메이션 SVG로 만든 2초짜리 로고 선 그리기',
          body: '경로 몇 개로 된 워드마크에 선 그리기 애니메이터를 2,000 ms에 걸쳐 적용하고 애니메이션 SVG로 내보내요. 선 그리기는 stroke-dasharray와 stroke-dashoffset 애니메이션이고 모든 주요 브라우저에서 CSS로 표현할 수 있으므로, 내보내기 도구는 @keyframes가 담긴 <style> 블록만 작성하고 스크립트는 전혀 넣지 않아요. 파일은 원래 SVG에 CSS 수백 바이트를 더한 것이고, 페이지에 들어가는 순간 재생되며, svg_animated 내보내기 한 건으로 집계돼요. 계정이 없으면 하루 2건 중 하나이고 비회원용 10초 길이 한도 안에 들어요. 무료 계정이 있으면 5건 중 하나예요. 내보내기는 브라우저 안의 문자열 변환이라 즉시 끝나요.',
        },
        {
          title: 'GIF로 만든 400 x 400 모프 루프',
          body: '400 x 400 캔버스의 2초짜리 모양 모프를 Premium 요금제에서 25 fps GIF로 내보내요(GIF는 기본적으로 Premium 형식이에요). 대화 상자는 요금제의 높이와 프레임 레이트 프리셋에 맞춰 제한되며, 25 fps에서는 프레임당 지연이 round(100 / 25) = 4센티초, 전체 50프레임이 돼요. 예상 크기는 픽셀 x 프레임 x 0.25바이트 + 1 KB이므로 160,000 x 50 x 0.25는 약 2 MB예요. 일부러 넉넉하게 잡은 값이라 두 가지 색의 평면 아트는 보통 이보다 훨씬 작게 나와요. 프레임은 메인 스레드에서 렌더링되고 Worker에서 하나씩 인코딩되므로 메모리는 프레임 두어 개와 커져 가는 파일 정도로 유지돼요. 시간은 SVG 50프레임을 래스터화하는 데 쓰이며, 노트북에서 몇 초 정도예요.',
        },
      ],
      whenNotToUse: 'Motion은 벡터 아트워크를 애니메이션해요. 동영상이나 사진은 편집하지 않아요. 시작점이 영상이라면 Darkroom이 맞는 편집기이고, 동영상 GIF 변환 페이지가 클립을 GIF로 바꿔 줘요. 복잡한 래스터 이미지를 위한 벡터화 도구도 아니에요. 사진을 경로로 추적하면 파일이 무거워지고 결과도 의미 있게 애니메이션되지 않아요. 필터, 텍스트 효과, 고급 마스크에 의존하는 애니메이션은 Lottie 내보내기에서 온전히 유지되지 않으므로(대화 상자에 무엇이 빠졌는지 표시돼요), 그런 대상에는 애니메이션 SVG, React, JavaScript 내보내기를 사용하세요. 또 MP4나 WebM 출력은 브라우저의 WebCodecs 지원과 요금제에 따라 달라지므로, 동영상 결과물을 계획하기 전에 요금제 표를 확인하세요.',
      whyMediaManipulator: [
        '템플릿 갤러리가 아니라 홀드, 맞춤 커브, 여섯 가지 애니메이터를 갖춘 진짜 레이어·키프레임 편집기예요.',
        '디자이너와 개발자 모두를 위한 내보내기: 하나의 프로젝트에서 애니메이션 SVG, Lottie, React, JavaScript 또는 TypeScript, Flutter, GIF를 얻을 수 있어요.',
        '내보내기는 브라우저에서 만들어지고, 내보내기에 쓰이는 외부 코드는 허용적 라이선스를 따르는 코드뿐이에요(MIT 라이선스의 anime.js, Flutter용 flutter_svg와 webview_flutter). 해당 라이선스 고지는 파일 안에 그대로 남아요.',
      ],
      privacyNote: '편집과 내보내기는 브라우저에서 이루어지며, 내보내기를 위해 아트워크가 업로드되지 않아요. 계정이 없으면 프로젝트는 이 브라우저에만 보관돼요. 로그인해서 프로젝트를 계정에 저장하면 정리된 문서(최대 4 MB)와 썸네일이 Darkroom 프로젝트처럼 저희 서버에 저장되고, 직접 선택한 보관 기간을 따르며, 계정 페이지에서 삭제할 수 있어요. 집계되는 각 내보내기에 대해서는 일일 사용량을 적용하기 위해 형식, 높이, 프레임 레이트, 길이, 시각만 소유자인 계정 또는 세션과 함께 기록해요. 내보내기 행에는 아트워크가 절대 담기지 않아요.',
      faq: [
        {
          question: 'Motion은 무료인가요?',
          answer: '네. Motion을 열고, 그리고, 애니메이션하고, 이 브라우저에 저장하고, 정적 SVG를 내보내는 것은 무료이고 무제한이며 계정도 필요 없어요. 애니메이션 내보내기는 요금제에 따른 일일 사용량에 포함돼요. 기본적으로 계정이 없으면 하루 2회(애니메이션 SVG만), 무료 계정은 5회, Premium은 30회, Pro는 150회예요. 이 페이지의 요금제 표에서 각 요금제의 실시간 사용량과 형식을 확인할 수 있어요.',
        },
        {
          question: '어떤 형식으로 내보낼 수 있나요?',
          answer: '정적 SVG, 애니메이션 SVG(CSS, 필요하면 작은 인라인 스크립트), Lottie JSON, React 컴포넌트(.tsx), JavaScript 또는 TypeScript 모듈, Flutter 위젯(.dart), 애니메이션 GIF예요. 기본적으로 애니메이션 SVG는 모든 요금제에서, Lottie는 무료 계정부터, React, JS/TS, Flutter, GIF는 Premium부터 쓸 수 있어요. 요금제에 이 중 어떤 형식이 포함되는지와 일일 내보내기 횟수는 이 페이지의 요금제 표에 나와 있어요.',
        },
        {
          question: '제한은 어떻게 되나요?',
          answer: '애니메이션 내보내기는 하루 단위로 집계되며 UTC 자정에 초기화돼요. 거부된 내보내기는 집계되지 않지만, 집계가 이루어진 뒤에 취소한 내보내기는 집계돼요. 비회원은 프로젝트를 브라우저에만 저장할 수 있고 최대 10초 길이의 애니메이션을 내보낼 수 있어요. 무료 계정은 프로젝트 3개, Premium은 25개를 계정에 저장할 수 있고 Pro는 제한이 없어요. SVG와 Lottie 가져오기는 각각 최대 4 MB, GIF 내보내기는 최대 50 fps와 출력 2 GB로 제한돼요. 현재의 모든 수치는 이 페이지의 요금제 표와 요금 페이지에 나와 있어요.',
        },
        {
          question: '이미 갖고 있는 SVG를 애니메이션할 수 있나요?',
          answer: '네. 어떤 SVG든 가져오면 그 그룹, 경로, 도형, 텍스트, 그라데이션, 마스크, 클립 경로가 편집 가능한 레이어가 돼요. 패턴이나 복잡한 필터처럼 편집기가 편집할 수 없는 부분은 그대로 유지되어 변경 없이 내보내지고, 안전하지 않은 것(스크립트, 이벤트 핸들러, 외부 링크)은 제거되어 가져온 뒤 목록으로 표시돼요.',
        },
        {
          question: 'Lottie를 지원하나요?',
          answer: '네, 양방향으로요. Lottie JSON 파일을 가져와 편집할 수 있고(가져오기는 무료 요금제 이상에서 한 단위로 계산돼요), 애니메이션을 lottie-web과 iOS, Android, Flutter의 Lottie 플레이어용 Lottie JSON으로 내보낼 수 있어요. 한쪽에서 표현할 수 없는 기능은 조용히 버려지는 대신 대화 상자에 목록으로 표시돼요.',
        },
        {
          question: '동영상 내보내기를 지원하는 브라우저는 무엇인가요?',
          answer: 'GIF 내보내기는 모든 최신 브라우저에서 작동해요. MP4와 WebM 내보내기는 브라우저 내장 동영상 인코더인 WebCodecs에 의존하며, Chrome과 Edge, 그리고 코덱에 따라 최신 버전의 Safari와 Firefox에서 사용할 수 있어요. 내보내기 대화 상자가 브라우저를 확인하고 인코딩할 수 없을 때 알려 줘요. 이 페이지의 요금제 표에서 각 동영상 형식이 어떤 요금제에 포함되는지 확인할 수 있어요.',
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
      featureList: [
        'SVG를 편집 가능한 레이어로 가져오기',
        'Lottie JSON 가져오기',
        '사각형, 타원, 선, 펜, 텍스트 도구',
        '이징 프리셋, 맞춤 큐빅 베지어 곡선, 홀드 키를 갖춘 키프레임 타임라인',
        '선 그리기, 모션 경로, 모양 모프, 그라데이션, 마스크, 흐림 애니메이터',
        '정적 SVG 내보내기',
        '애니메이션 SVG 내보내기(CSS 또는 인라인 anime.js 런타임)',
        'Lottie JSON 내보내기',
        'React, JavaScript, TypeScript, Flutter 코드 내보내기',
        '애니메이션 GIF 내보내기',
        '브라우저 또는 계정에 저장되는 프로젝트',
      ],
    },
    // 2026-10-28 catalog expansion: name + tagline for the /tools catalog cards (model-written, needs native review).
    'inspect-metadata': {
      name: '메타데이터 검사기',
      h1: '온라인 파일 메타데이터 검사',
      tagline: '공유하기 전에 사진, 동영상, 오디오 파일, PDF에 숨겨진 모든 태그(EXIF, GPS 위치, 카메라, 코덱, ID3, XMP 등)를 확인해요.',
      metaTitle: '온라인 파일 메타데이터 검사: EXIF, GPS, 코덱, ID3 | Media Manipulator',
      metaDescription: '이미지, 동영상, 오디오, PDF용 무료 온라인 메타데이터 검사기예요. EXIF, 지도 위 GPS 좌표, 카메라와 렌즈, 코덱과 비트레이트, ID3 태그, XMP, IPTC를 확인하세요. 가입 필요 없어요.',
      ogTitle: '온라인 파일 메타데이터 검사',
      ogDescription: '파일의 모든 EXIF, GPS, 코덱, ID3, XMP 태그를 묶어서 검색할 수 있게 보여 주고, 개인정보 태그는 표시해 줘요.',
      intro: '파일에는 픽셀과 샘플 이상의 정보가 담겨 있어요. 휴대폰 사진은 언제 어디서 어떤 기기로 찍었는지 기록하고, 동영상은 인코더와 비트레이트를 남기며, MP3에는 ID3 태그와 앨범 아트가, PDF에는 작성자와 만든 소프트웨어가 저장돼요. Media Manipulator 메타데이터 검사기는 저희 서버에서 ExifTool과 ffprobe로 이 모든 정보를 읽어 카메라, 위치, 기기, 시간, 코덱, 문서 섹션으로 묶고, 나를 식별할 수 있는 항목을 강조 표시해요. 그래서 파일을 내보내기 전에 무엇을 지울지 정할 수 있어요.',
      whatItDoes: [
        'JPG, PNG, WebP, HEIC, AVIF, TIFF, RAW에서 파생된 이미지의 EXIF, GPS, IPTC, XMP, ICC 데이터를 읽어요.',
        'MP4, MOV, MKV, WebM 등 동영상 파일의 컨테이너, 스트림, 코덱, 비트레이트, 프레임 레이트, 챕터 데이터를 읽어요.',
        'MP3, M4A, FLAC, OGG, WAV의 ID3, Vorbis, MP4 태그와 커버 아트, 인코더 설정을 읽어요.',
        'PDF의 작성자, 생성 프로그램, 생성 날짜, 페이지 수를 읽어요.',
        'GPS 좌표를 지도 윤곽 위에 표시하고 개인정보와 관련된 모든 항목에 표시를 붙여요.',
        'ExifTool과 ffprobe 원본 출력을 제공하고 어떤 블록이든 클릭 한 번으로 복사할 수 있어요.',
      ],
      flowSteps: [
        {
          title: '파일 업로드',
          description: '이미지, 동영상, 오디오 또는 PDF.',
        },
        {
          title: '파일 읽기',
          description: '저희 서버에서 ExifTool과 ffprobe가 실행돼요.',
        },
        {
          title: '보고서 살펴보기',
          description: '항목별로 묶여 있고 검색할 수 있으며, 개인정보 항목은 표시돼요.',
        },
        {
          title: '결정하기',
          description: '필요하면 EXIF 도구로 메타데이터를 지우세요.',
        },
      ],
      advancedDetails: [
        '이미지와 PDF는 자동으로 검사돼요. 100 MB가 넘는 동영상과 오디오는 큰 파일이 실수로 업로드되지 않도록 클릭할 때까지 기다려요.',
        '오디오 파일에 포함된 커버 아트는 동영상 스트림이 아니라 그림 항목으로 보고돼요.',
        '보고서는 EXIF 삭제 도구와 모든 변환의 결과 검사기에 쓰이는 것과 같은 메타데이터 카탈로그를 사용해요.',
      ],
      whyItMatters: [
        '휴대폰에서 공유한 사진의 GPS 태그로 집 주소가 드러날 수 있어요.',
        '동영상의 실제 코덱, 비트레이트, 프레임 레이트를 알면 어디서는 재생되고 어디서는 안 되는 이유를 알 수 있어요.',
        '문서 메타데이터에는 작성자와 편집 소프트웨어가 적혀 있어서, 익명으로 게시하는 모든 것에 중요해요.',
      ],
      useCases: [
        {
          title: '사진을 올리기 전에',
          description: 'GPS 좌표와 기기 일련번호가 있는지 확인하세요.',
        },
        {
          title: '동영상 문제 해결',
          description: '실제 코덱, 프로필, 프레임 레이트, 오디오 구성을 확인하세요.',
        },
        {
          title: '음악 파일 확인',
          description: '태그와 비트레이트, 그리고 더 낮은 비트레이트에서 트랜스코딩되었는지 확인하세요.',
        },
        {
          title: 'PDF 검토',
          description: '작성자 항목에 누구의 이름이 있는지, 어떤 소프트웨어로 만들었는지 확인하세요.',
        },
      ],
      whyMediaManipulator: [
        '도구 네 개를 따로 쓸 필요 없이 검사기 하나로 이미지, 동영상, 오디오, PDF를 확인해요.',
        '개인정보와 관련된 항목이 표시되고, 바로 지울 수 있는 경로도 제공해요.',
        '변환도 계정도 필요 없어요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      ],
      privacyNote: '파일은 저희 서버의 ExifTool과 ffprobe가 읽고, 보고서는 브라우저로 돌아가며, 임시 사본은 보고서가 만들어지는 즉시 삭제돼요. 외부의 누구도 파일이나 태그를 보지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: '파일을 검사하면 파일이 바뀌나요?',
          answer: '아니요. 파일을 읽고 보고서를 만든 뒤 분석이 끝나면 삭제해요. 파일에 다시 기록하는 것은 없어요.',
        },
        {
          question: '검사기가 찾은 정보를 지울 수 있나요?',
          answer: '네. 이미지는 EXIF 메타데이터 삭제 도구를 사용하세요. 모든 정보를 지우고 전후 비교를 보여 줘요.',
        },
        {
          question: '큰 동영상은 왜 클릭해야 하나요?',
          answer: '100 MB가 넘는 동영상과 오디오는 요청할 때만 업로드되므로, 큰 파일을 실수로 보낼 일이 없어요.',
        },
        {
          question: '일일 변환 횟수에 포함되나요?',
          answer: '아니요. 검사는 무료이며 일반 작업을 사용하지 않아요.',
        },
        {
          question: '데이터가 외부로 전송되나요?',
          answer: '아니요. ExifTool과 ffprobe는 저희 자체 서버에서 실행되고, 파일은 이후 삭제돼요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '검사는 읽기 전용이며 변환으로 계산되지 않아요.',
        ],
      },
      related: [
        {
          label: 'EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '검사기가 찾은 정보를 모두 지우세요.',
        },
        {
          label: '이미지 메타데이터 편집',
          to: '/tools/edit-image-metadata',
          description: '제목, 작성자, 저작권, GPS를 다시 쓰세요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: '메타데이터를 유지하거나 지우면서 변환하세요.',
        },
      ],
      embed: {
        title: '파일 검사하기',
        description: '이미지, 동영상, 오디오 파일 또는 PDF를 끌어다 놓으세요. 보고서가 모든 태그를 분류별로 묶고, 나나 내 위치를 식별할 수 있는 태그를 표시하며, ExifTool과 ffprobe 원본 보기를 제공해요.',
      },
    },
    'edit-image-metadata': {
      name: '이미지 메타데이터 편집',
      h1: '온라인 이미지 메타데이터 편집',
      tagline: '사진의 제목, 작성자, 저작권, 키워드, 설명을 설정하고, GPS 위치를 수정하거나 삭제하고, EXIF와 IPTC 태그를 다시 쓸 수 있어요.',
      metaTitle: '온라인 이미지 메타데이터 편집: EXIF, IPTC, 저작권, GPS | Media Manipulator',
      metaDescription: '무료 온라인 이미지 메타데이터 편집기예요. 제목, 작성자, 저작권, 설명, 키워드를 설정하고, GPS 위치를 교체하거나 제거하고, JPG, PNG, WebP 등의 EXIF와 IPTC 태그를 편집하세요.',
      ogTitle: '온라인 이미지 메타데이터 편집',
      ogDescription: '저작권 고지를 넣고, 위치를 바로잡고, 키워드를 설정하세요. 무료이고 가입이 필요 없어요.',
      intro: '사진작가는 납품하는 모든 파일에 저작권 고지와 연락처를 넣어야 해요. 에이전시는 IPTC 키워드와 캡션을 원하고요. 사진을 공유하는 사람이라면 누구나 위치 정보를 없애거나, 집 앞이 아니라 도시 단위로 바꾸고 싶을 수 있어요. Media Manipulator는 저희 서버에서 ExifTool로 EXIF, IPTC, XMP 필드를 제자리에서 다시 쓰고, 이미지 데이터는 그대로 두며, 전후 비교를 보여 줘요.',
      whatItDoes: [
        '제목, 작성자/아티스트, 설명, 저작권, 코멘트, 키워드를 설정해요.',
        'GPS 위치를 제거하거나 직접 고른 좌표로 교체해요.',
        '개별 EXIF/TIFF, IPTC, 고급 태그를 이름으로 지정해 편집해요.',
        '픽셀은 그대로 두며, 원하면 같은 처리에서 형식도 변환해요.',
        '작업 후 무엇이 바뀌었는지 비교해서 보여 줘요.',
      ],
      flowSteps: [
        {
          title: '이미지 업로드',
          description: 'JPG, PNG, WebP, HEIC, TIFF.',
        },
        {
          title: '항목 입력',
          description: '제목, 작성자, 저작권, 키워드, 위치.',
        },
        {
          title: '적용',
          description: '저희 서버에서 ExifTool이 태그를 다시 써요.',
        },
        {
          title: '다운로드',
          description: '전후를 비교한 다음 저장하세요.',
        },
      ],
      advancedDetails: [
        '사용자 지정 메타데이터 모드는 표준 EXIF(Artist, Copyright, ImageDescription), IPTC(Keywords, Caption), XMP(dc:title, dc:creator)의 대응 항목을 함께 기록하므로 모든 뷰어에서 같은 값이 보여요.',
        'GPS 위치를 교체하면 올바른 기준 반구와 함께 GPSLatitude/GPSLongitude를 기록하고, 제거하면 모든 GPS 태그를 지워요.',
        'PNG와 WebP는 메타데이터를 텍스트 청크와 XMP에 담아요. 같은 항목이 그곳에 기록돼요.',
      ],
      whyItMatters: [
        '파일에 넣은 저작권 고지는 다시 게시될 때도 파일과 함께 따라가요.',
        'IPTC의 키워드와 캡션은 스톡 에이전시와 DAM 시스템이 색인하는 정보예요.',
        '위치를 도시 단위로 설정하면 사진의 지오태그는 유지하면서 집을 보호할 수 있어요.',
      ],
      useCases: [
        {
          title: '고객 사진 납품',
          description: '모든 파일에 이름, 저작권, 연락처를 넣으세요.',
        },
        {
          title: '스톡 사진 제출',
          description: 'IPTC 키워드와 캡션을 추가하세요.',
        },
        {
          title: '대략적인 지오태그',
          description: '정밀한 GPS 위치를 도심 좌표로 바꾸세요.',
        },
        {
          title: '잘못된 태그 수정',
          description: '스캐너가 기록한 작성자나 날짜를 바로잡으세요.',
        },
      ],
      whyMediaManipulator: [
        'EXIF, IPTC, XMP 중 하나만이 아니라 모두 함께 기록해요.',
        '전후 비교로 무엇이 바뀌었는지 정확히 볼 수 있어요.',
      ],
      privacyNote: '이미지의 태그는 저희 서버의 ExifTool이 입력한 값으로 다시 쓰고, 픽셀은 그대로 둬요. 외부의 누구도 파일이나 태그를 보지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: '메타데이터를 편집하면 JPG가 다시 인코딩되나요?',
          answer: '출력 형식을 바꾸거나 크기를 조절할 때만 그래요. 같은 형식이고 픽셀을 편집하지 않으면 이미지 데이터는 그대로 복사되고 태그만 다시 써져요.',
        },
        {
          question: '위치만 지우고 나머지는 모두 유지할 수 있나요?',
          answer: '네. "위치 데이터 제거"에 체크하고 다른 항목은 그대로 두세요.',
        },
        {
          question: '목록에 없는 태그도 편집할 수 있나요?',
          answer: '네. 고급 섹션을 펼치고 원하는 EXIF 또는 IPTC 태그를 이름으로 지정해 설정하세요.',
        },
        {
          question: '대신 모든 정보를 지우려면 어떻게 하나요?',
          answer: 'EXIF 메타데이터 삭제 도구를 사용하세요. 클릭 한 번으로 모든 태그를 지워요.',
        },
      ],
      related: [
        {
          label: '메타데이터 검사',
          to: '/tools/inspect-metadata',
          description: '먼저 파일에 무엇이 들어 있는지 확인하세요.',
        },
        {
          label: 'EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '모든 정보를 지우세요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: '이미지 형식을 서로 변환하세요.',
        },
        {
          label: '이미지 자르기',
          to: '/tools/crop-image',
          description: '원하는 영역만 잘라내세요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '크기를 바꾸세요.',
        },
        {
          label: '이미지에 텍스트 추가',
          to: '/tools/add-text-to-image',
          description: '캡션이나 워터마크를 넣으세요.',
        },
        {
          label: '이미지 필터',
          to: '/tools/image-filters',
          description: '세피아, 스케치, 엠보스 등.',
        },
      ],
      embed: {
        title: '이미지 메타데이터 편집하기',
        description: '이미지를 업로드하세요. 메타데이터 섹션이 사용자 지정 모드로 열려요. 제목, 작성자, 저작권, 키워드를 입력하고, GPS 위치를 교체하거나 제거하고, 필요하면 고급 태그를 펼치세요. 형식도 함께 바꾸지 않는 한 이미지 픽셀은 그대로 유지돼요.',
      },
    },
    'change-video-speed': {
      name: '동영상 속도 변경',
      h1: '온라인 동영상 속도 변경: 빠르게 또는 느리게',
      tagline: '2배, 4배 또는 더 빠르게 타임랩스를 만들거나, 클립을 0.5배나 0.25배로 느리게 만들 수 있어요. 오디오 싱크도 그대로 유지돼요.',
      metaTitle: '무료 온라인 동영상 속도 변경: 빨리 감기 또는 슬로 모션 | Media Manipulator',
      metaDescription: '무료 온라인 동영상 속도 변경 도구예요. 타임랩스를 위해 동영상을 1.5배, 2배, 4배로 빠르게 하거나 0.5배, 0.25배로 느리게 만드세요. 오디오 싱크도 그대로 유지돼요. MP4로 출력하며 워터마크가 없어요.',
      ogTitle: '무료 온라인 동영상 속도 변경',
      ogDescription: '어떤 동영상이든 0.25배~4배로 빠르게 또는 느리게 만드세요. 오디오 싱크도 그대로 유지돼요. 무료이며 가입이 필요 없어요.',
      intro: '늘어지는 화면 녹화, 십 초짜리 타임랩스로 만들고 싶은 일몰, 슬로 모션으로 볼 만한 스케이트보드 묘기처럼, 재생 속도 변경은 가장 흔한 동영상 편집 중 하나이고 데스크톱 편집기 없이도 할 수 있어야 해요. Media Manipulator는 저희 서버에서 FFmpeg로 화면과 소리의 타이밍을 모두 다시 맞춰요. 사분의 일 속도부터 네 배 속도까지 가능하며, 어디서나 새 속도로 재생되는 MP4로 내보내요.',
      whatItDoes: [
        '어떤 동영상이든 빠르게(1.25배~4배) 하거나 느리게(0.25배~0.9배) 만들어요.',
        '음높이를 유지하는 템포 조절로 오디오 타이밍을 다시 맞춰서 목소리가 자연스럽게 들려요.',
        '해상도와 화질을 유지해요. 기본값은 MP4로 내보내며, 지원되는 다른 컨테이너도 고를 수 있어요.',
        '같은 작업에서 자르기, 크기 조절, 색상 조정과 함께 쓸 수 있어요.',
      ],
      flowSteps: [
        {
          title: '동영상 업로드',
          description: '일반적인 동영상 형식이면 무엇이든 돼요.',
        },
        {
          title: '속도 설정',
          description: '0.25배~4배이며, 기본값은 2배예요.',
        },
        {
          title: '변환',
          description: 'FFmpeg가 영상과 오디오의 타이밍을 다시 맞춰요.',
        },
        {
          title: '다운로드',
          description: '새 MP4를 저장하세요.',
        },
      ],
      advancedDetails: [
        '영상은 setpts로 표시 타임스탬프의 배율을 조정하고, 오디오는 atempo를 사용하며 0.5~2.0 범위를 벗어나는 배율에서는 atempo를 여러 번 연결해 적용해요.',
        '느리게 해도 새 프레임이 만들어지지는 않아요. 부드러운 슬로 모션을 원하면 클립을 느리게 만든 뒤 AI 프레임 보간을 사용하세요.',
        '프레임 레이트는 유지되므로 4배 타임랩스에는 원래 프레임의 사분의 일만 남아요.',
      ],
      whyItMatters: [
        '타임랩스와 요약 영상은 2배~4배에서 훨씬 보기 편해요.',
        '슬로 모션을 쓰면 스포츠와 액션 클립의 움직임을 알아보기 쉬워요.',
        '튜토리얼과 화면 녹화는 1.25배~1.5배가 더 나은 경우가 많아요.',
      ],
      useCases: [
        {
          title: '타임랩스',
          description: '한 시간 동안의 조립, 요리, 그림 작업을 몇 분으로 압축하세요.',
        },
        {
          title: '슬로 모션',
          description: '스포츠나 반려동물 클립을 절반 속도로 늦추세요.',
        },
        {
          title: '더 빠른 튜토리얼',
          description: '다람쥐 목소리 없이 화면 녹화의 속도를 높이세요.',
        },
        {
          title: '음악 트랙에 맞추기',
          description: '클립을 1.1배로 살짝 조정해 박자에 맞추세요.',
        },
      ],
      whyMediaManipulator: [
        '오디오는 뒤처지거나 다람쥐 목소리가 되지 않고, 음높이를 유지한 채 타이밍이 다시 맞춰져요.',
        '같은 양식에서 역재생, 자르기, 색상 조정과 함께 쓸 수 있어요.',
      ],
      privacyNote: '동영상은 저희 서버에서 FFmpeg로 빠르게 또는 느리게 처리되고, 오디오 템포도 그에 맞게 바뀌어요. 작업은 외부 트랜스코딩 서비스가 아니라 저희 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: '오디오 싱크가 유지되나요?',
          answer: '네. 오디오도 같은 배율로 템포가 조절되며 음높이는 유지돼요.',
        },
        {
          question: '최대 속도는 얼마인가요?',
          answer: '한 번에 4배 빠르게, 0.25배 느리게까지 가능해요. 그 이상이 필요하면 결과물을 이 도구로 한 번 더 처리하세요.',
        },
        {
          question: '슬로 모션이 부드럽게 보이나요?',
          answer: '느리게 하면 프레임이 반복돼요. 정말 부드러운 슬로 모션을 원하면 여기서 클립을 느리게 만든 다음 AI 프레임 보간을 사용하세요.',
        },
        {
          question: '대신 오디오를 음소거할 수 있나요?',
          answer: '네. 먼저 동영상에서 오디오 제거 도구를 사용하거나, 오디오가 없는 GIF로 내보내세요.',
        },
      ],
      related: [
        {
          label: 'AI 프레임 보간',
          to: '/tools/ai-frame-interpolation',
          description: '생성된 프레임으로 부드러운 슬로 모션을 만들어요.',
        },
        {
          label: '동영상 변환기',
          to: '/tools/video-converter',
          description: '동영상 형식 간에 변환해요.',
        },
        {
          label: '동영상 거꾸로 재생',
          to: '/tools/reverse-video',
          description: '클립을 거꾸로 재생해요.',
        },
        {
          label: '동영상 뒤집기',
          to: '/tools/flip-video',
          description: '좌우 또는 상하로 반전해요.',
        },
        {
          label: '동영상 흔들림 보정',
          to: '/tools/stabilize-video',
          description: '흔들린 영상을 부드럽게 잡아 줘요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '파일 크기를 줄여요.',
        },
        {
          label: '동영상 자르기',
          to: '/tools/video-trimmer',
          description: '원하는 구간만 잘라내요.',
        },
      ],
      embed: {
        title: '동영상 속도 변경하기',
        description: '동영상을 업로드하고 속도 배율을 설정하세요. 1보다 크면 빨라지고 1보다 작으면 느려져요. 기본값은 2배예요. 오디오도 그에 맞게 타이밍이 다시 맞춰지므로 빨라진 목소리도 알아들을 수 있어요.',
      },
    },
    'reverse-video': {
      name: '동영상 거꾸로 재생',
      h1: '무료 온라인 동영상 거꾸로 재생',
      tagline: '어떤 클립이든 거꾸로 재생해요. 오디오를 함께 뒤집을지 선택할 수 있고, 정방향 후 역방향으로 반복 재생하는 핑퐁 효과도 줄 수 있어요.',
      metaTitle: '무료 온라인 동영상 거꾸로 재생: 역재생, 핑퐁 | Media Manipulator',
      metaDescription: '무료 온라인 동영상 역재생 도구예요. 동영상을 거꾸로 재생하고, 오디오도 함께 뒤집거나, 정방향 후 역방향으로 재생되는 핑퐁 루프를 만드세요. MP4 또는 GIF로 출력하며 워터마크도 가입도 필요 없어요.',
      ogTitle: '무료 온라인 동영상 거꾸로 재생',
      ogDescription: '클립을 거꾸로 재생하거나 정방향 후 역방향으로 반복되는 루프를 만드세요. 무료이며 가입이 필요 없어요.',
      intro: '역재생 효과는 인터넷보다 오래됐지만 여전히 통해요. 산산조각 난 유리가 다시 붙고, 다이버가 수영장 밖으로 튀어 오르고, 흩어지던 군중이 다시 모여요. Media Manipulator는 저희 서버에서 FFmpeg로 어떤 클립이든 프레임을, 원하면 오디오까지 거꾸로 뒤집어요. 핑퐁 옵션은 정방향 사본을 이어 붙여 결과가 끊김 없이 반복되게 하는데, 소셜 미디어와 GIF 용도에서는 대부분 이 방식을 원해요.',
      whatItDoes: [
        '어떤 클립이든 영상 프레임을 거꾸로 뒤집어요.',
        '오디오도 함께 뒤집거나, 오디오를 빼서 무음 결과물을 만들어요.',
        '핑퐁 모드는 정방향 후 역방향으로 재생해 끊김 없는 루프를 만들어요.',
        'MP4, WebM 또는 움직이는 GIF로 내보내요.',
      ],
      flowSteps: [
        {
          title: '클립 업로드',
          description: '짧은 클립이 가장 좋아요. 역재생은 클립 전체를 메모리에 올려요.',
        },
        {
          title: '역재생 또는 핑퐁 선택',
          description: '기본값은 역재생이에요.',
        },
        {
          title: '변환',
          description: 'FFmpeg가 프레임과 오디오를 거꾸로 뒤집어요.',
        },
        {
          title: '다운로드',
          description: '동영상은 MP4로, 루프는 GIF로 받으세요.',
        },
      ],
      advancedDetails: [
        '역재생은 클립의 모든 프레임을 버퍼에 담기 때문에 아주 긴 클립이나 4K 클립은 시간이 더 걸리고 메모리도 더 많이 써요. 가장 좋은 결과를 얻으려면 먼저 자르세요.',
        '오디오에는 areverse 필터를 사용해요. 무음 역재생 클립을 원하면 먼저 오디오를 제거하세요.',
        '핑퐁은 정방향 스트림과 역방향 스트림을 이어 붙이므로 길이가 두 배가 돼요.',
      ],
      whyItMatters: [
        '역재생과 부메랑 클립은 짧은 소셜 동영상의 단골 소재예요.',
        '핑퐁 루프는 일반 루프에서 드러나는 이음매를 감춰 줘요.',
        '역재생은 "되감기" 전환 효과를 만드는 손쉬운 방법이기도 해요.',
      ],
      useCases: [
        {
          title: '부메랑 스타일 루프',
          description: '두어 초짜리 클립을 끊김 없이 앞뒤로 오가는 영상으로 바꾸세요.',
        },
        {
          title: '역재생 공개',
          description: '언박싱이나 제작 과정을 거꾸로 재생하세요.',
        },
        {
          title: '되감기 전환',
          description: '몇 초를 거꾸로 재생해 장면 사이를 전환하세요.',
        },
        {
          title: '거꾸로 재생되는 GIF',
          description: '채팅과 포럼용으로 바로 GIF로 내보내세요.',
        },
      ],
      whyMediaManipulator: [
        '스위치 하나로 역재생과 핑퐁을 고르고, 오디오도 올바르게 처리해요.',
        '같은 양식에서 먼저 자르고 GIF로 내보낼 수 있어요.',
      ],
      privacyNote: '클립은 저희 서버에서 FFmpeg로 디코딩된 뒤 거꾸로 재생되는 새 파일로 만들어져요. 작업은 외부 트랜스코딩 서비스가 아니라 저희 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: '오디오도 거꾸로 재생되나요?',
          answer: '네, 기본적으로 그래요. 무음 클립을 원하면 먼저 오디오를 제거하세요.',
        },
        {
          question: '핑퐁이 무엇인가요?',
          answer: '클립이 정방향으로 재생된 뒤 역방향으로 재생되므로 눈에 띄는 끊김 없이 반복돼요.',
        },
        {
          question: '길이 제한이 있나요?',
          answer: '역재생은 클립 전체를 메모리에 담아요. 일이 분 정도의 클립은 문제없고, 더 긴 동영상은 먼저 자르세요.',
        },
        {
          question: 'GIF로 받을 수 있나요?',
          answer: '네. 출력 형식으로 GIF를 고르세요. 핑퐁 루프에 안성맞춤이에요.',
        },
      ],
      related: [
        {
          label: '동영상을 GIF로',
          to: '/tools/convert-video-to-animated-gif',
          description: '반복 재생되는 GIF를 만들어요.',
        },
        {
          label: '동영상 변환기',
          to: '/tools/video-converter',
          description: '동영상 형식 간에 변환해요.',
        },
        {
          label: '동영상 속도 변경',
          to: '/tools/change-video-speed',
          description: '타임랩스 또는 슬로 모션.',
        },
        {
          label: '동영상 뒤집기',
          to: '/tools/flip-video',
          description: '좌우 또는 상하로 반전해요.',
        },
        {
          label: '동영상 흔들림 보정',
          to: '/tools/stabilize-video',
          description: '흔들린 영상을 부드럽게 잡아 줘요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '파일 크기를 줄여요.',
        },
        {
          label: '동영상 자르기',
          to: '/tools/video-trimmer',
          description: '원하는 구간만 잘라내요.',
        },
      ],
      embed: {
        title: '동영상 거꾸로 재생하기',
        description: '클립을 업로드하세요. 시간 효과 섹션에서 역재생이 이미 켜져 있어요. 정방향 후 역방향으로 반복되는 루프를 원하면 대신 핑퐁을 켜세요. MP4 또는 GIF로 내보내세요.',
      },
    },
    'flip-video': {
      name: '동영상 뒤집기 & 좌우 반전',
      h1: '무료 온라인 동영상 뒤집기 & 좌우 반전',
      tagline: '좌우가 바뀐 웹캠이나 셀카 영상을 가로로 반전해 바로잡거나, 세로로 뒤집을 수 있어요. 클릭 한 번이면 끝나요.',
      metaTitle: '무료 온라인 동영상 뒤집기 & 좌우 반전 | Media Manipulator',
      metaDescription: '무료 온라인 동영상 뒤집기 도구예요. 동영상을 좌우로 반전하거나(좌우가 바뀐 셀카와 웹캠 영상 바로잡기) 상하로 뒤집으세요. MP4로 출력하며 워터마크도 가입도 필요 없어요.',
      ogTitle: '무료 온라인 동영상 뒤집기 & 좌우 반전',
      ogDescription: '좌우가 바뀐 셀카 영상을 바로잡거나 클립을 위아래로 뒤집으세요. 무료이며 가입이 필요 없어요.',
      intro: '전면 카메라와 웹캠은 거울에 비친 모습으로 녹화되는 경우가 많아요. 글자가 거꾸로 읽히고 가르마가 반대쪽에 가 있죠. 클립을 한 번 좌우 반전하면 바로잡혀요. Media Manipulator는 저희 서버에서 FFmpeg로 동영상을 좌우 또는 상하로 뒤집고, 다시 인코딩해 뒤집기를 프레임에 직접 반영한 뒤, 모든 플레이어에서 올바르게 재생되는 MP4로 내보내요.',
      whatItDoes: [
        '동영상을 좌우로 반전하거나 상하로 뒤집어요.',
        '같은 작업에서 90°, 180°, 270° 회전과 함께 쓸 수 있어요.',
        '변형을 프레임에 직접 반영하므로 회전 플래그에 의존하지 않아요.',
        '기본값은 MP4로 내보내며, 지원되는 다른 컨테이너도 고를 수 있어요.',
      ],
      flowSteps: [
        {
          title: '동영상 업로드',
          description: '일반적인 형식이면 무엇이든 돼요.',
        },
        {
          title: '뒤집기 선택',
          description: '기본값은 좌우 뒤집기예요. 상하 뒤집기나 회전을 추가할 수 있어요.',
        },
        {
          title: '변환',
          description: 'FFmpeg가 hflip/vflip을 적용하고 다시 인코딩해요.',
        },
        {
          title: '다운로드',
          description: '바로잡은 MP4를 저장하세요.',
        },
      ],
      advancedDetails: [
        '좌우 뒤집기는 hflip 필터를, 상하 뒤집기는 vflip 필터를 사용해요. 둘 다 기하학적으로는 손실이 없으며 프레임을 다시 인코딩해요.',
        '좌우 반전에 180° 회전을 더하면 상하 뒤집기와 같아요. 패널에서 자유롭게 조합할 수 있어요.',
        'MP4 출력은 H.264 + AAC + yuv420p + faststart를 사용해요.',
      ],
      whyItMatters: [
        '좌우가 바뀐 셀카 영상에서는 화면 속 글자를 읽을 수 없어요.',
        '거꾸로 장착한 액션 카메라 중에는 회전이 아니라 상하 뒤집기가 필요한 경우가 있어요.',
        '좌우 반전한 사본은 춤이나 운동 튜토리얼을 더 쉽게 따라 하게 만드는 간단한 방법이에요.',
      ],
      useCases: [
        {
          title: '셀카 좌우 반전 바로잡기',
          description: '글자와 로고가 올바르게 읽히게 하세요.',
        },
        {
          title: '거꾸로 장착한 카메라',
          description: '뒤집힌 카메라로 찍은 영상을 뒤집으세요.',
        },
        {
          title: '튜토리얼용 좌우 반전',
          description: '시청자가 그대로 따라 할 수 있도록 시범 영상을 좌우 반전하세요.',
        },
        {
          title: '장면 맞추기',
          description: '피사체가 반대쪽을 보도록 클립을 좌우 반전하세요.',
        },
      ],
      whyMediaManipulator: [
        '하나의 변형 섹션에서 뒤집기와 회전을 함께 하고, 결과를 프레임에 직접 반영해요.',
        '같은 업로드에서 자르기, 크기 조절, 색상 조정도 할 수 있어요.',
      ],
      privacyNote: '동영상은 저희 서버에서 FFmpeg로 좌우 또는 상하로 반전돼요. 작업은 외부 트랜스코딩 서비스가 아니라 저희 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: '좌우 반전과 뒤집기, 무엇이 다른가요?',
          answer: '좌우 반전(가로 뒤집기)은 왼쪽과 오른쪽을 바꿔요. 상하 뒤집기는 위와 아래를 바꿔요.',
        },
        {
          question: '뒤집기는 영구적인가요?',
          answer: '네. 뒤집기가 적용된 상태로 프레임이 다시 인코딩되므로 모든 플레이어에서 그대로 보여요.',
        },
        {
          question: '회전도 할 수 있나요?',
          answer: '네. 회전은 같은 변형 섹션에 있고, 전용 동영상 회전 도구를 사용해도 돼요.',
        },
        {
          question: '뒤집으면 화질이 떨어지나요?',
          answer: '다시 인코딩하면 약간의 손실이 생겨요. 고화질을 선택하면 거의 티가 나지 않아요.',
        },
      ],
      related: [
        {
          label: '동영상 회전',
          to: '/tools/rotate-video',
          description: '90°, 180°, 270°.',
        },
        {
          label: '동영상 변환기',
          to: '/tools/video-converter',
          description: '동영상 형식 간에 변환해요.',
        },
        {
          label: '동영상 속도 변경',
          to: '/tools/change-video-speed',
          description: '타임랩스 또는 슬로 모션.',
        },
        {
          label: '동영상 거꾸로 재생',
          to: '/tools/reverse-video',
          description: '클립을 거꾸로 재생해요.',
        },
        {
          label: '동영상 흔들림 보정',
          to: '/tools/stabilize-video',
          description: '흔들린 영상을 부드럽게 잡아 줘요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '파일 크기를 줄여요.',
        },
        {
          label: '동영상 자르기',
          to: '/tools/video-trimmer',
          description: '원하는 구간만 잘라내요.',
        },
      ],
      embed: {
        title: '동영상 뒤집기 또는 좌우 반전하기',
        description: '동영상을 업로드하세요. 변형 섹션에서 좌우 뒤집기(반전)가 기본으로 선택되어 있어요. 대신 또는 함께 상하 뒤집기를 켜세요. 같은 섹션에서 회전도 할 수 있어요.',
      },
    },
    'stabilize-video': {
      name: '동영상 흔들림 보정',
      h1: '무료 온라인 흔들린 동영상 손떨림 보정',
      tagline: '두 번에 걸쳐 분석하는 손떨림 보정 기능으로 손떨림과 걸을 때의 흔들림을 부드럽게 잡아 줘요. 삼각대도 데스크톱 편집기도 필요 없어요.',
      metaTitle: '무료 온라인 흔들린 동영상 손떨림 보정 | Media Manipulator',
      metaDescription: '무료 온라인 동영상 손떨림 보정 도구예요. FFmpeg 움직임 보정으로 손떨림과 걸을 때의 흔들림을 줄이세요. 강도를 조절할 수 있고, MP4로 출력하며 워터마크도 가입도 필요 없어요.',
      ogTitle: '무료 온라인 흔들린 동영상 손떨림 보정',
      ogDescription: '어떤 클립이든 카메라 흔들림을 부드럽게 잡으세요. 무료이며 가입이 필요 없어요.',
      intro: '손으로 들고 찍은 영상은 흔들리고, 작은 흔들림도 큰 화면에서는 크게 보여요. 소프트웨어 손떨림 보정은 프레임 사이의 움직임을 추적하고, 카메라 경로를 부드럽게 다듬은 뒤, 보정 흔적을 숨기려고 가장자리를 조금 잘라내요. Media Manipulator는 저희 서버에서 강도를 조절할 수 있는 FFmpeg의 움직임 보정 안정화 필터를 실행하므로, 걸으며 찍은 브이로그나 줌으로 당겨 찍은 휴대폰 클립이 눈에 띄게 안정돼요.',
      whatItDoes: [
        '프레임 간 움직임을 분석하고 카메라 경로를 부드럽게 다듬어요.',
        '흔들림 정도(예상되는 흔들림의 양)와 정확도(탐색 강도)를 조절할 수 있어요.',
        '보정 흔적을 숨기려고 살짝 잘라내며, 확대는 자동으로 적용돼요.',
        '기본값은 MP4로 내보내며, 같은 작업에서 자르기와 색상 조정도 함께 할 수 있어요.',
      ],
      flowSteps: [
        {
          title: '흔들린 클립 업로드',
          description: '일반적인 형식이면 무엇이든 돼요.',
        },
        {
          title: '강도 유지 또는 조정',
          description: '기본값은 손으로 들고 찍은 휴대폰 영상에 맞춰져 있어요.',
        },
        {
          title: '변환',
          description: 'FFmpeg가 움직임을 추정하고 보정해요.',
        },
        {
          title: '다운로드',
          description: '더 안정된 결과를 비교해 보세요.',
        },
      ],
      advancedDetails: [
        'FFmpeg의 deshake 움직임 보정 필터를 사용해요. 흔들림 정도 값은 탐색 범위를, 정확도 값은 탐색 깊이를 정해요.',
        '손떨림 보정은 프레임에 이미 있는 모션 블러를 고칠 수 없어요. 프레임 사이의 떨림만 없애요.',
        '카메라가 움직인 정도에 비례해 가장자리가 조금 잘릴 수 있어요.',
      ],
      whyItMatters: [
        '안정된 영상은 더 전문적으로 보이고 보기도 편해요.',
        '걸으면서 찍은 휴대폰 클립이 가장 흔한 경우이고 보정 효과도 좋아요.',
        '손떨림을 보정한 클립은 프레임 사이에 바뀌는 부분이 적어서 더 잘 압축돼요.',
      ],
      useCases: [
        {
          title: '걸으며 찍은 브이로그',
          description: '손에 들고 걸으며 말하는 영상의 출렁임을 없애세요.',
        },
        {
          title: '줌으로 찍은 휴대폰 영상',
          description: '최대 줌으로 찍은 공연이나 야생동물 클립을 안정시키세요.',
        },
        {
          title: '차량 또는 자전거 거치',
          description: '대시보드나 핸들바 거치대에서 생기는 진동을 줄이세요.',
        },
        {
          title: 'GIF로 만들기 전에',
          description: '루프가 떨리지 않도록 먼저 손떨림을 보정하세요.',
        },
      ],
      whyMediaManipulator: [
        '강도를 숨기지 않고 직접 조절할 수 있게 한 진짜 움직임 보정이에요.',
        '같은 양식에서 자르기, 속도 변경, 색상 조정도 할 수 있어요.',
      ],
      privacyNote: '영상은 저희 서버에서 FFmpeg의 deshake 필터로 흔들림을 분석해 부드럽게 다듬어요. 작업은 외부 트랜스코딩 서비스가 아니라 저희 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: '동영상이 잘리나요?',
          answer: '약간 잘려요. 안정화 필터는 흔들림을 상쇄하려고 프레임을 옮기고, 움직이는 가장자리를 숨기려고 살짝 확대해요.',
        },
        {
          question: '흐림도 고칠 수 있나요?',
          answer: '아니요. 프레임 안의 흐림은 되돌릴 수 없어요. 손떨림 보정은 프레임 사이의 움직임만 안정시켜요.',
        },
        {
          question: '어떤 설정을 써야 하나요?',
          answer: '기본값으로 시작하세요. 아주 심하게 흔들린 영상이면 흔들림 정도를 높이고, 결과가 여전히 한쪽으로 흘러가면 정확도를 높이세요.',
        },
        {
          question: '4K에서도 되나요?',
          answer: '네, 하지만 처리 시간이 더 걸려요. 같은 작업에서 1080p로 크기를 줄이는 것도 고려해 보세요.',
        },
      ],
      related: [
        {
          label: 'AI 동영상 복원',
          to: '/tools/ai-video-restoration',
          description: 'AI로 노이즈 제거, 흐림 제거, 업스케일을 해요.',
        },
        {
          label: '동영상 변환기',
          to: '/tools/video-converter',
          description: '동영상 형식 간에 변환해요.',
        },
        {
          label: '동영상 속도 변경',
          to: '/tools/change-video-speed',
          description: '타임랩스 또는 슬로 모션.',
        },
        {
          label: '동영상 거꾸로 재생',
          to: '/tools/reverse-video',
          description: '클립을 거꾸로 재생해요.',
        },
        {
          label: '동영상 뒤집기',
          to: '/tools/flip-video',
          description: '좌우 또는 상하로 반전해요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '파일 크기를 줄여요.',
        },
        {
          label: '동영상 자르기',
          to: '/tools/video-trimmer',
          description: '원하는 구간만 잘라내요.',
        },
      ],
      embed: {
        title: '동영상 손떨림 보정하기',
        description: '흔들린 클립을 업로드하세요. 시간 효과 섹션에서 손떨림 보정이 이미 켜져 있어요. 기본값이 너무 약하거나 너무 많이 잘리면 흔들림 정도와 정확도를 조정하세요.',
      },
    },
    'change-video-frame-rate': {
      name: '동영상 프레임 레이트 변경',
      h1: '온라인 동영상 프레임 레이트 변경',
      tagline: '동영상을 24, 25, 30, 60fps로 변환하거나, 60fps 클립을 30fps로 낮춰 파일 크기를 줄이거나, 프로젝트 프레임 레이트에 맞출 수 있어요.',
      metaTitle: '온라인 동영상 프레임 레이트 변경 (24, 30, 60fps) | Media Manipulator',
      metaDescription: '무료 온라인 프레임 레이트 변환기예요. 동영상을 24, 25, 30, 50, 60fps로 바꾸거나, 60fps를 30fps로 낮춰 파일을 줄이거나, 편집 타임라인에 맞추세요. MP4로 출력하며 가입이 필요 없어요.',
      ogTitle: '온라인 동영상 프레임 레이트 변경',
      ogDescription: '어떤 동영상이든 24, 25, 30, 60fps로 변환하세요. 무료이며 가입이 필요 없어요.',
      intro: '프레임 레이트는 동영상의 느낌과 크기를 좌우해요. 영화는 24fps, 유럽 방송은 25fps, 대부분의 휴대폰은 30fps나 60fps이고, 한 타임라인에 섞으면 화면이 덜컹거려요. Media Manipulator는 저희 서버에서 FFmpeg로 어떤 동영상이든 필요한 프레임 레이트로 리샘플링하고, 프레임을 정확하게 빼거나 반복한 뒤 MP4로 내보내요. 프레임을 줄이는 대신 늘리고 싶다면 AI 프레임 보간 도구가 중간 프레임을 생성해요.',
      whatItDoes: [
        '동영상을 1~120fps 사이의 원하는 프레임 레이트로 리샘플링해요.',
        '60fps를 절반인 30fps로 낮춰, 대부분의 콘텐츠에서 눈에 띄는 차이 없이 파일을 훨씬 작게 만들어요.',
        '편집기로 가져오기 전에 프로젝트 프레임 레이트(24, 25, 29.97, 30, 50, 60)에 맞춰요.',
        '해상도, 오디오, 길이는 바뀌지 않아요.',
      ],
      flowSteps: [
        {
          title: '동영상 업로드',
          description: '일반적인 형식이면 무엇이든 돼요.',
        },
        {
          title: '목표 fps 설정',
          description: '기본값은 30이에요.',
        },
        {
          title: '변환',
          description: 'FFmpeg가 프레임을 빼거나 복제해 맞춰요.',
        },
        {
          title: '다운로드',
          description: '리샘플링된 MP4를 저장하세요.',
        },
      ],
      advancedDetails: [
        'fps 필터를 사용해요. 타임스탬프에 따라 프레임을 빼거나 복제하므로 길이와 오디오 싱크가 정확히 유지돼요.',
        '높이는 경우(30에서 60으로)에는 프레임이 복제될 뿐 더 부드러워 보이지 않아요. 진짜 새 프레임이 필요하면 AI 프레임 보간을 사용하세요.',
        '낮추는 경우에는 데이터가 제거되며 되돌릴 수 없어요. 원본을 보관하세요.',
      ],
      whyItMatters: [
        '대부분의 콘텐츠에서 60fps 휴대폰 클립은 눈에 보이는 화질이 같은데도 30fps보다 두 배 커요.',
        '편집 타임라인에 프레임 레이트가 섞이면 끊김이 생겨요. 먼저 맞춰 두면 피할 수 있어요.',
        '일부 플랫폼과 기기는 특정 프레임 레이트로 제한하거나 특정 프레임 레이트를 요구해요.',
      ],
      useCases: [
        {
          title: '60fps 클립 줄이기',
          description: '이메일, 채팅, 더 작은 업로드를 위해 30fps로 낮추세요.',
        },
        {
          title: '편집용으로 맞추기',
          description: '모든 클립을 프로젝트 프레임 레이트에 맞추세요.',
        },
        {
          title: '영화 같은 느낌',
          description: '영화 같은 리듬을 위해 24fps로 변환하세요.',
        },
        {
          title: '방송 납품',
          description: 'PAL 지역용으로 25fps 또는 50fps로 변환하세요.',
        },
      ],
      whyMediaManipulator: [
        '길이와 오디오는 그대로 둔 채 타임스탬프 기반으로 정확하게 리샘플링해요.',
        '프레임을 줄이는 대신 늘려야 할 때는 AI 보간을 사용할 수 있어요.',
      ],
      privacyNote: '동영상은 저희 서버에서 FFmpeg로 선택한 프레임 레이트에 맞게 변환돼요. 작업은 외부 트랜스코딩 서비스가 아니라 저희 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: '동영상이 짧아지거나 길어지나요?',
          answer: '아니요. 길이는 유지되며, 새 프레임 레이트에 맞추려고 프레임을 빼거나 반복해요.',
        },
        {
          question: '30fps를 60fps로 바꾸면 더 부드러워 보이나요?',
          answer: '이 도구로는 그렇지 않아요. 프레임을 복제하기 때문이에요. 진짜 중간 프레임을 생성하려면 AI 프레임 보간을 사용하세요.',
        },
        {
          question: '어떤 프레임 레이트를 골라야 하나요?',
          answer: '대부분의 웹과 휴대폰 콘텐츠는 30fps, 영화 같은 느낌은 24fps, PAL 방송은 25fps나 50fps, 게임과 스포츠는 60fps예요.',
        },
        {
          question: '오디오에 영향이 있나요?',
          answer: '아니요. 오디오 스트림은 같은 타이밍으로 복사되거나 다시 인코딩돼요.',
        },
      ],
      related: [
        {
          label: 'AI 프레임 보간',
          to: '/tools/ai-frame-interpolation',
          description: '최대 120fps까지 프레임을 생성해요.',
        },
        {
          label: '동영상 변환기',
          to: '/tools/video-converter',
          description: '동영상 형식 간에 변환해요.',
        },
        {
          label: '동영상 속도 변경',
          to: '/tools/change-video-speed',
          description: '타임랩스 또는 슬로 모션.',
        },
        {
          label: '동영상 거꾸로 재생',
          to: '/tools/reverse-video',
          description: '클립을 거꾸로 재생해요.',
        },
        {
          label: '동영상 뒤집기',
          to: '/tools/flip-video',
          description: '좌우 또는 상하로 반전해요.',
        },
        {
          label: '동영상 흔들림 보정',
          to: '/tools/stabilize-video',
          description: '흔들린 영상을 부드럽게 잡아 줘요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '파일 크기를 줄여요.',
        },
        {
          label: '동영상 자르기',
          to: '/tools/video-trimmer',
          description: '원하는 구간만 잘라내요.',
        },
      ],
      embed: {
        title: '동영상 프레임 레이트 변경하기',
        description: '동영상을 업로드하고 시간 효과 섹션에서 목표 프레임 레이트를 설정하세요. 기본값은 30fps예요. 목표에 맞추려고 프레임을 빼거나 복제해요. 생성된 중간 프레임으로 더 높은 프레임 레이트를 얻으려면 대신 AI 프레임 보간을 사용하세요.',
      },
    },
    'adjust-video-color': {
      name: '동영상 밝기 및 색상 조정',
      h1: '온라인 동영상 밝기, 대비, 색상 조정',
      tagline: '어두운 클립을 밝게 하고, 대비와 채도를 높이고, 색조를 바꾸거나, 흐림 효과나 아트 효과를 적용해요. 슬라이더와 실시간 미리보기를 제공해요.',
      metaTitle: '온라인 동영상 밝기, 대비, 채도 조정 | Media Manipulator',
      metaDescription: '무료 온라인 동영상 색상 조정 도구예요. 밝기, 대비, 채도, 색조, 감마, 노출을 바로잡고, 흐림이나 선명 효과를 더하거나, 예술적 효과를 적용하세요. MP4로 출력하며 워터마크도 가입도 필요 없어요.',
      ogTitle: '온라인 동영상 밝기 및 색상 조정',
      ogDescription: '어떤 클립이든 밝게 하고, 대비를 더하고, 색감을 높이거나 효과를 적용하세요. 무료이며 가입이 필요 없어요.',
      intro: '실내에서 찍은 클립은 어둡고 주황빛이 돌고, 밋밋한 휴대폰 영상은 대비와 색감이 더 필요하고, 썸네일용 클립에는 개성 있는 느낌이 필요해요. Media Manipulator는 저희 서버에서 FFmpeg로 밝기, 대비, 채도, 색조, 감마, 노출 보정을 흐림, 선명 효과, 그레인, 여러 예술적 필터와 함께 적용하고 MP4로 내보내요. 편집기를 열지 않고 하는 색 보정 작업이에요.',
      whatItDoes: [
        '-100부터 +100까지 조절할 수 있는 밝기, 대비, 채도, 색조 슬라이더를 제공해요.',
        '더 세밀한 톤 조절을 위한 감마, 노출, 그림자, 하이라이트를 제공해요.',
        '가우시안 흐림과 모션 블러, 언샵 마스크 선명화, 필름 그레인과 노이즈를 지원해요.',
        '유화, 스케치, 빈티지 같은 예술적 효과를 지원해요.',
        '같은 작업에서 자르기, 크기 조절, 속도 변경, 뒤집기와 함께 쓸 수 있어요.',
      ],
      flowSteps: [
        {
          title: '클립 업로드',
          description: '일반적인 형식이면 무엇이든 돼요.',
        },
        {
          title: '슬라이더 조절',
          description: '밝기, 대비, 채도, 색조 등을 조절하세요.',
        },
        {
          title: '변환',
          description: 'FFmpeg가 eq 필터와 효과 필터를 적용해요.',
        },
        {
          title: '다운로드',
          description: '색 보정된 MP4를 저장하세요.',
        },
      ],
      advancedDetails: [
        '밝기, 대비, 채도, 감마는 FFmpeg의 eq 필터에 대응하고, 색조는 도 단위로 hue 필터를 사용해요.',
        '선명화는 반경, 양, 임계값을 지정하는 unsharp 필터이고, 흐림은 gblur 또는 방향성 모션 블러예요.',
        '3D LUT, 크로마 키, 타임라인에서의 클립별 색 보정이 필요하면 Darkroom을 사용하세요.',
      ],
      whyItMatters: [
        '대부분의 휴대폰 영상은 대비와 채도를 조금만 높여도 좋아져요.',
        '업로드 전에 노출을 바로잡으면 플랫폼의 재인코딩으로 더 나빠지는 일을 막을 수 있어요.',
        '클립 전체에 일관된 느낌을 주면 편집본이 완성도 있게 느껴져요.',
      ],
      useCases: [
        {
          title: '어두운 클립 밝게 하기',
          description: '실내 영상의 노출과 그림자를 끌어올리세요.',
        },
        {
          title: '밋밋한 클립에 생기 더하기',
          description: '로그 촬영처럼 보이는 휴대폰 영상에 대비와 채도를 더하세요.',
        },
        {
          title: '색 틀어짐 바로잡기',
          description: '색조를 옮겨 주황빛이나 초록빛을 없애세요.',
        },
        {
          title: '소셜 미디어용 스타일 입히기',
          description: '빈티지, 스케치, 유화 효과를 적용하세요.',
        },
      ],
      whyMediaManipulator: [
        '"보정" 버튼 하나가 아니라 톤, 색상, 효과 조절을 한 섹션에서 모두 제공해요.',
        '더 많은 기능이 필요하면 Darkroom에서 LUT로 타임라인 색 보정을 하세요.',
      ],
      privacyNote: '동영상의 밝기, 대비, 채도, 감마는 저희 서버에서 FFmpeg로 변경돼요. 작업은 외부 트랜스코딩 서비스가 아니라 저희 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: '결과를 미리 볼 수 있나요?',
          answer: '슬라이더에는 값이 표시되고, 전체 색 보정은 변환할 때 적용돼요. 몇 초로 잘라 빠르게 테스트한 다음 클립 전체를 처리하세요.',
        },
        {
          question: 'LUT를 적용할 수 있나요?',
          answer: '여기서는 안 돼요. 저희 멀티트랙 편집기인 Darkroom에서 3D LUT와 클립별 색 보정을 지원해요.',
        },
        {
          question: '노출 과다 영상을 고칠 수 있나요?',
          answer: '하이라이트를 낮출 수는 있지만, 하얗게 날아간 디테일은 되살릴 수 없어요.',
        },
        {
          question: '흐릿한 클립을 선명하게 할 수 있나요?',
          answer: '네. 언샵 마스크 조절 항목을 사용하세요. 실제로 디테일을 복원하려면 AI 동영상 복원을 사용해 보세요.',
        },
      ],
      related: [
        {
          label: 'Darkroom 동영상 편집기',
          to: '/tools/content-studio',
          description: '타임라인에서 LUT로 색 보정해요.',
        },
        {
          label: 'AI 동영상 복원',
          to: '/tools/ai-video-restoration',
          description: 'AI로 노이즈 제거와 업스케일을 해요.',
        },
        {
          label: '동영상 변환기',
          to: '/tools/video-converter',
          description: '동영상 형식 간에 변환해요.',
        },
        {
          label: '동영상 속도 변경',
          to: '/tools/change-video-speed',
          description: '타임랩스 또는 슬로 모션.',
        },
        {
          label: '동영상 거꾸로 재생',
          to: '/tools/reverse-video',
          description: '클립을 거꾸로 재생해요.',
        },
        {
          label: '동영상 뒤집기',
          to: '/tools/flip-video',
          description: '좌우 또는 상하로 반전해요.',
        },
        {
          label: '동영상 흔들림 보정',
          to: '/tools/stabilize-video',
          description: '흔들린 영상을 부드럽게 잡아 줘요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '파일 크기를 줄여요.',
        },
        {
          label: '동영상 자르기',
          to: '/tools/video-trimmer',
          description: '원하는 구간만 잘라내요.',
        },
      ],
      embed: {
        title: '동영상 색상 조정하기',
        description: '클립을 업로드하세요. 시각 효과 섹션이 열리며 밝기, 대비, 채도, 색조, 감마, 노출 슬라이더와 흐림, 선명, 노이즈, 예술적 효과가 제공돼요. MP4로 내보내세요.',
      },
    },
    'convert-video-to-hevc': {
      name: '동영상을 HEVC(H.265)로 변환',
      h1: '온라인 동영상 HEVC / H.265 변환',
      tagline: '어떤 동영상이든 H.265로 다시 인코딩해 같은 화질에서 H.264의 절반 정도 크기로 줄여요. 보관, 4K, 최신 기기에 알맞아요.',
      metaTitle: '무료 온라인 동영상 HEVC(H.265) 변환 | Media Manipulator',
      metaDescription: '무료 온라인 H.265 / HEVC 변환기예요. MP4, MOV, MKV, WebM을 HEVC로 다시 인코딩해 같은 화질에서 크기를 절반 정도로 줄이세요. 화질 프리셋을 고를 수 있어요. 워터마크도 가입도 필요 없어요.',
      ogTitle: '온라인 동영상 HEVC / H.265 변환',
      ogDescription: 'H.265로 동영상 크기를 절반으로 줄이세요. 무료이며 가입이 필요 없어요.',
      intro: 'H.265라고도 하는 HEVC는 H.264의 후속 코덱이에요. 같은 화질에서 비트가 40~50% 정도 덜 필요해서, 휴대폰이 4K를 이 형식으로 녹화하고 영상 보관에도 가장 많이 쓰여요. Media Manipulator는 저희 서버에서 FFmpeg의 x265 인코더로 원하는 화질 수준에 맞춰 어떤 동영상이든 HEVC로 다시 인코딩하고, iPhone, Mac, Windows 10+, Android, 최신 TV에서 모두 재생되는 MP4 컨테이너에 담아요.',
      whatItDoes: [
        '어떤 입력 동영상이든 MP4 컨테이너 안의 H.265로 다시 인코딩해요.',
        'CRF 값에 대응하는 세 가지 화질 프리셋을 제공하며, H.264보다 파일 크기가 대략 절반으로 줄어요.',
        '해상도와 프레임 레이트를 유지하며, 원하면 4K를 1080p로 줄여 파일을 훨씬 작게 만들 수 있어요.',
        '오디오는 AAC로 다시 인코딩돼요.',
      ],
      flowSteps: [
        {
          title: '동영상 업로드',
          description: 'H.264 MP4를 포함해 일반적인 형식이면 무엇이든 돼요.',
        },
        {
          title: '화질 선택',
          description: '최소 크기, 균형, 고화질 중에서 고르세요.',
        },
        {
          title: '변환',
          description: '저희 서버에서 x265가 인코딩해요. H.264보다 느려요.',
        },
        {
          title: '다운로드',
          description: 'HEVC가 담긴 .mp4를 저장하세요.',
        },
      ],
      advancedDetails: [
        'libx265로 CRF 28(균형), 32(최소 크기), 24(고화질)에 medium 프리셋을 사용해 인코딩하며, Apple 호환성을 위해 hvc1 태그를 붙여요.',
        'HEVC 인코딩은 H.264보다 몇 배 느려요. 긴 4K 파일은 몇 분이 걸려요.',
        '브라우저: Safari와 Edge는 HEVC를 재생하지만 Chrome과 Firefox는 대개 재생하지 못해요. 웹 임베드에는 H.264를 사용하세요.',
      ],
      whyItMatters: [
        '같은 화질에 저장 공간이 절반이면 라이브러리 전체에서는 큰 차이가 돼요.',
        '대부분의 기기에서 4K와 HDR 전송은 HEVC로 표준화되어 있어요.',
        '파일이 작을수록 업로드와 동기화가 빨라요.',
      ],
      useCases: [
        {
          title: '영상 보관',
          description: '눈에 띄는 손실 없이 카메라 롤 용량을 절반으로 줄이세요.',
        },
        {
          title: '4K 공유',
          description: '4K 클립을 보낼 수 있을 만큼 작게 만드세요.',
        },
        {
          title: 'Apple 생태계',
          description: 'iPhone이 이미 녹화하는 HEVC 파일과 맞추세요.',
        },
        {
          title: '드라이브 공간 확보',
          description: '오래된 H.264 녹화본을 HEVC로 변환하세요.',
        },
      ],
      whyMediaManipulator: [
        '합리적인 CRF 프리셋과 Apple 호환 태그를 갖춘 x265를 사용해요.',
        'H.264, VP9, AV1이 대신 필요하면 같은 패널에서 그 코덱으로 압축할 수 있어요.',
      ],
      privacyNote: '동영상은 저희 서버에서 FFmpeg로 H.265(HEVC)로 다시 인코딩돼요. 작업은 외부 트랜스코딩 서비스가 아니라 저희 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: 'HEVC는 어디서나 재생되나요?',
          answer: 'iPhone, Mac, Windows 10+, Android 5+, 최신 TV, Safari/Edge에서 재생돼요. Chrome과 Firefox, 오래된 기기에서는 대개 재생되지 않으니 이런 환경에는 H.264를 사용하세요.',
        },
        {
          question: '파일이 얼마나 작아지나요?',
          answer: '같은 화질에서 보통 H.264보다 40~50% 작고, 단순한 콘텐츠는 더 작아져요.',
        },
        {
          question: '화질이 나빠지나요?',
          answer: '균형 프리셋에서는 대부분의 콘텐츠에서 차이가 보이지 않아요. 다시 편집할 영상이라면 고화질을 고르세요.',
        },
        {
          question: '왜 느린가요?',
          answer: 'x265는 x264보다 프레임마다 훨씬 많은 작업을 해요. 더 작은 파일을 얻는 대가예요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'HEVC 인코딩은 CPU를 많이 써요. 길거나 4K인 원본은 몇 분 정도 걸려요.',
        ],
      },
      related: [
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: 'H.264, VP9, AV1 압축.',
        },
        {
          label: '동영상 변환기',
          to: '/tools/video-converter',
          description: '표준 H.264 MP4.',
        },
        {
          label: '동영상 변환기',
          to: '/tools/video-converter',
          description: '동영상 형식 간에 변환해요.',
        },
        {
          label: '동영상 속도 변경',
          to: '/tools/change-video-speed',
          description: '타임랩스 또는 슬로 모션.',
        },
        {
          label: '동영상 거꾸로 재생',
          to: '/tools/reverse-video',
          description: '클립을 거꾸로 재생해요.',
        },
        {
          label: '동영상 뒤집기',
          to: '/tools/flip-video',
          description: '좌우 또는 상하로 반전해요.',
        },
        {
          label: '동영상 흔들림 보정',
          to: '/tools/stabilize-video',
          description: '흔들린 영상을 부드럽게 잡아 줘요.',
        },
        {
          label: '동영상 자르기',
          to: '/tools/video-trimmer',
          description: '원하는 구간만 잘라내요.',
        },
      ],
      embed: {
        title: '동영상을 HEVC로 변환하기',
        description: '동영상을 업로드하세요. 코덱은 MP4 컨테이너 안의 H.265로, 프리셋은 균형으로 설정되어 있어요. 대신 최소 크기나 고화질을 고를 수 있어요. 오래된 기기와 일부 브라우저는 HEVC를 재생하지 못하니 그런 환경을 위해 H.264 사본을 남겨 두세요.',
      },
    },
    'convert-audio-to-wav': {
      name: '오디오를 WAV로 변환',
      h1: '무료 온라인 오디오 WAV 변환',
      tagline: 'MP3, M4A, WAV, OGG, FLAC 등 모든 오디오 파일을 손실 없이 WAV로 변환해요.',
      metaTitle: '무료 온라인 오디오 WAV 변환 | Media Manipulator',
      metaDescription: '무료 온라인 오디오 WAV 변환기예요. MP3, WAV, M4A, OGG, FLAC, AAC를 업로드하고 WAV로 내려받으세요. 무손실로 출력해요. 워터마크도 가입도 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '무료 온라인 오디오 WAV 변환',
      ogDescription: '오디오 파일을 업로드하고 WAV로 내려받으세요. 무손실이에요. 무료이며 가입이 필요 없어요.',
      intro: 'WAV는 압축되지 않은 PCM 오디오예요. 모든 샘플이 그대로 저장되므로 손실이 전혀 없고, 어떤 편집기, DAW, 샘플러에서도 바로 열려요. Media Manipulator는 일반적인 오디오 형식이면 무엇이든 한 번의 업로드로 WAV로 변환해요. 직접 바꾸지 않는 한 샘플 레이트와 채널 구성은 그대로 유지하고, 같은 양식에서 자르기, 노멀라이즈, EQ, AI 정리 도구도 제공해요.',
      whatItDoes: [
        'MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3, WMA를 WAV로 변환해요.',
        '모든 샘플을 유지해요. 출력물은 입력과 정확히 같은 데이터로 디코딩돼요.',
        'PCM을 기록하기 전에 자르기, 볼륨, 노멀라이즈, EQ, 효과를 적용할 수 있어요.',
        '같은 양식에서 AI 정리도 할 수 있어요. WAV로 저장하기 전에 배경 소음을 없애고, 목소리를 깨끗하게 다듬고, 보컬을 분리하거나 제거하세요.',
      ],
      flowSteps: [
        {
          title: '오디오 업로드',
          description: '압축 여부와 관계없이 일반적인 오디오 파일이면 무엇이든 돼요.',
        },
        {
          title: '필요하면 조정',
          description: '자르기, 노멀라이즈, 효과를 적용하세요.',
        },
        {
          title: '변환',
          description: '저희 서버에서 FFmpeg가 WAV로 인코딩해요.',
        },
        {
          title: '다운로드',
          description: 'WAV 파일을 저장하세요.',
        },
      ],
      advancedDetails: [
        'WAV 출력은 원본 샘플 레이트로 FFmpeg의 기본 pcm_s16le 인코더를 사용해 인코딩돼요.',
        '손실 압축된 MP3를 WAV로 변환해도 MP3 인코더가 버린 디테일은 되살아나지 않아요. 추가 손실을 막을 뿐이에요.',
        'MP3나 M4A 원본에 들어 있는 앨범 아트는 정지 이미지로 인식되므로, 검증 단계에서 파일을 동영상으로 오인하지 않아요.',
      ],
      whyItMatters: [
        '편집이나 마스터링: WAV는 디코딩 단계도 세대 손실도 없어서 오디오 편집기가 원하는 형식이에요.',
        '마스터 음원이나 현장 녹음 보관.',
        'PCM이 필요한 샘플러, 게임 엔진, 방송 시스템.',
      ],
      useCases: [
        {
          title: '기기에 맞게 형식 바꾸기',
          description: 'WAV가 필요한 플레이어용으로 WAV 사본을 만드세요.',
        },
        {
          title: '편집 준비',
          description: 'DAW나 동영상 편집기에 무손실 파일을 넘기세요.',
        },
        {
          title: '한 번에 한 파일씩',
          description: '음성 메모가 담긴 폴더를 한 번에 하나씩 WAV로 바꾸면서 각각 잘라 다듬으세요.',
        },
        {
          title: '변환하면서 정리하기',
          description: '현장 녹음을 압축되지 않은 마스터로 만들면서 쉭쉭거리는 소리를 없애세요.',
        },
      ],
      whyMediaManipulator: [
        '따로 선택하지 않는 한 샘플 레이트와 채널 구성이 유지돼요.',
        'WAV를 만드는 같은 업로드에서 녹음을 노멀라이즈하고 자를 수 있어요.',
      ],
      privacyNote: '오디오는 저희 서버에서 FFmpeg로 디코딩된 뒤 압축되지 않은 PCM WAV로 기록돼요. 외부 오디오 서비스는 전혀 사용하지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 결과는 새 파일로 제공되며, 업로드한 파일 자체는 변경되지 않아요.',
      faq: [
        {
          question: 'WAV란 무엇인가요?',
          answer: 'WAV는 압축되지 않은 PCM 오디오예요. 모든 샘플이 그대로 저장되므로 손실이 전혀 없고, 어떤 편집기, DAW, 샘플러에서도 바로 열려요.',
        },
        {
          question: 'WAV로 변환하면 음질이 좋아지나요?',
          answer: '아니요. 손실 압축된 MP3를 WAV로 변환해도 MP3 인코더가 버린 디테일은 되살아나지 않아요. 추가 손실을 막을 뿐이에요.',
        },
        {
          question: 'WAV로 변환하면서 오디오를 자를 수 있나요?',
          answer: '네. 자르기 섹션에서 시작과 끝을 설정하면 그 구간만 WAV에 기록돼요.',
        },
        {
          question: 'MP3에 앨범 아트가 있어요. 그래도 WAV로 바꿀 수 있나요?',
          answer: '네. 아트는 동영상 트랙이 아니라 이미지로 인식되므로 업로드가 받아들여지고, 오디오는 평소처럼 PCM으로 디코딩돼요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '무손실 출력이며, 파일 크기는 길이와 샘플 레이트에 따라 달라져요.',
        ],
      },
      related: [
        {
          label: '오디오 변환기',
          to: '/tools/audio-converter',
          description: '모든 일반적인 오디오 형식 간에 변환해요.',
        },
        {
          label: '오디오 속도 변경',
          to: '/tools/change-audio-speed',
          description: '녹음을 빠르게 하거나 느리게 만들어요.',
        },
        {
          label: '오디오 음높이 변경',
          to: '/tools/change-audio-pitch',
          description: '키를 올리거나 내려요.',
        },
        {
          label: '오디오 노멀라이즈',
          to: '/tools/normalize-audio',
          description: '음량을 고르게 맞춰요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: 'AI 노이즈 제거.',
        },
        {
          label: '노래에서 보컬 제거',
          to: '/tools/remove-vocals-from-song',
          description: '인스트루멘털을 만들어요.',
        },
      ],
      embed: {
        title: '오디오를 WAV로 변환하기',
        description: '오디오 파일을 업로드하세요. 출력 형식은 WAV로 고정되어 있어요. 직접 바꾸지 않는 한 샘플 레이트와 채널은 유지되며, 그다음 변환을 누르세요.',
      },
    },
    'convert-audio-to-flac': {
      name: '오디오를 FLAC로 변환',
      h1: '오디오를 FLAC로 온라인 무료 변환',
      tagline: 'MP3, M4A, WAV, OGG, FLAC 등 모든 오디오 파일을 손실 없이 FLAC로 변환해요.',
      metaTitle: '오디오를 FLAC로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 오디오 FLAC 변환기예요. MP3, WAV, M4A, OGG, FLAC, AAC를 업로드하고 FLAC로 다운로드하세요. 무손실로 출력돼요. 워터마크도 가입도 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '오디오를 FLAC로 온라인 무료 변환',
      ogDescription: '어떤 오디오 파일이든 업로드하고 FLAC로 다운로드하세요. 무손실이에요. 무료이며 가입이 필요 없어요.',
      intro: 'FLAC는 아무것도 잃지 않고 오디오를 압축해 보통 WAV 크기의 50~70%로 줄이고, 디코딩하면 비트 단위까지 똑같은 사본이 돼요. Media Manipulator는 흔히 쓰는 모든 오디오 형식을 한 번의 업로드로 FLAC로 변환하며, 직접 바꾸지 않는 한 샘플 레이트와 채널 레이아웃을 그대로 유지하고, 같은 양식에서 자르기, 노멀라이즈, EQ, AI 정리 도구도 제공해요.',
      whatItDoes: [
        'MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3, WMA를 FLAC로 변환해요.',
        '모든 샘플을 보존해요. 출력을 디코딩하면 입력과 정확히 같아요.',
        'FLAC로 압축하기 전에 볼륨, 자르기, 노멀라이즈, EQ를 적용할 수 있어요.',
        '정리된 무손실 사본이 필요하면 같은 업로드에서 노이즈 제거, 음성 정리, 보컬 분리를 실행할 수 있어요.',
      ],
      flowSteps: [
        {
          title: '오디오 업로드',
          description: 'WAV, AIFF 방식의 PCM, MP3, M4A 등.',
        },
        {
          title: '필요하면 조정',
          description: '자르기, 노멀라이즈, 효과 적용을 할 수 있어요.',
        },
        {
          title: '변환',
          description: 'FFmpeg가 저희 서버에서 FLAC로 인코딩해요.',
        },
        {
          title: '다운로드',
          description: 'FLAC 파일을 저장하세요.',
        },
      ],
      advancedDetails: [
        'FLAC 출력은 FFmpeg 내장 flac 인코더로 원본 샘플 레이트 그대로 인코딩돼요.',
        'MP3로 만든 FLAC는 그 MP3보다 나을 수 없어요. FLAC는 이미 있는 것만 보존해요.',
        '커버 아트가 포함된 MP3나 M4A도 검증을 통과해요. 아트는 동영상 스트림이 아니라 이미지로 처리돼요.',
      ],
      whyItMatters: [
        'WAV의 절반 용량만 차지하는 무손실 음악 라이브러리.',
        '100 MB짜리 첨부 파일 없이 협업자에게 마스터 파일 보내기.',
        '형식 자체에 체크섬이 내장된 장기 보관.',
      ],
      useCases: [
        {
          title: '기기에 맞게 형식 바꾸기',
          description: '필요한 플레이어를 위해 FLAC 사본을 만드세요.',
        },
        {
          title: '편집 준비',
          description: '무손실 파일을 DAW나 동영상 편집기에 넘기세요.',
        },
        {
          title: '한 번에 파일 하나씩',
          description: '녹음 여러 개를 하나씩 업로드해 무손실로 보관하세요.',
        },
        {
          title: '변환하면서 정리하기',
          description: '먼저 배경 소음을 제거하고 정리된 결과를 FLAC로 보관하세요.',
        },
      ],
      whyMediaManipulator: [
        '샘플 레이트나 채널 레이아웃을 고르거나, 둘 다 원본 그대로 둘 수 있어요.',
        '작게 녹음된 마스터의 레벨을 맞추고 한 번에 FLAC로 보관하세요.',
      ],
      privacyNote: '오디오는 저희 서버에서 FFmpeg로 FLAC로 무손실 압축돼요. 외부 오디오 서비스는 사용하지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 결과는 새 파일로 만들어지며, 업로드한 원본은 바뀌지 않아요.',
      faq: [
        {
          question: 'FLAC란 무엇인가요?',
          answer: 'FLAC는 아무것도 잃지 않고 오디오를 압축해 보통 WAV 크기의 50~70%로 줄이고, 디코딩하면 비트 단위까지 똑같은 사본이 돼요.',
        },
        {
          question: 'FLAC로 변환하면 음질이 좋아지나요?',
          answer: '아니요. MP3로 만든 FLAC는 그 MP3보다 나을 수 없어요. FLAC는 이미 있는 것만 보존해요.',
        },
        {
          question: 'FLAC로 변환하면서 오디오를 자를 수 있나요?',
          answer: '네. 자르기 섹션에서 시작과 끝을 정하면 FLAC는 그 구간만 인코딩해요.',
        },
        {
          question: '커버 아트가 있는 MP3도 FLAC로 변환되나요?',
          answer: '네. 포함된 아트는 동영상이 아니라 이미지로 읽히므로 검증을 통과하고 오디오는 평소처럼 인코딩돼요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '무손실 출력이에요. 파일 크기는 길이와 샘플 레이트에 따라 달라져요.',
        ],
      },
      related: [
        {
          label: '오디오 변환기',
          to: '/tools/audio-converter',
          description: '흔히 쓰는 모든 오디오 형식 사이에서 변환해요.',
        },
        {
          label: '오디오 속도 변경',
          to: '/tools/change-audio-speed',
          description: '녹음을 빠르게 하거나 느리게 해요.',
        },
        {
          label: '오디오 음높이 변경',
          to: '/tools/change-audio-pitch',
          description: '키를 올리거나 내려요.',
        },
        {
          label: '오디오 노멀라이즈',
          to: '/tools/normalize-audio',
          description: '음량을 고르게 맞춰요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: 'AI 노이즈 제거.',
        },
        {
          label: '노래에서 보컬 제거',
          to: '/tools/remove-vocals-from-song',
          description: '인스트루멘털을 만들어요.',
        },
      ],
      embed: {
        title: '오디오를 FLAC로 변환',
        description: '어떤 오디오 파일이든 업로드하세요. 출력은 FLAC로 고정되어 있고, 샘플 레이트와 채널은 직접 바꾸지 않는 한 그대로 유지돼요. 그런 다음 파일 변환을 누르세요.',
      },
    },
    'convert-audio-to-ogg': {
      name: '오디오를 OGG로 변환',
      h1: '오디오를 OGG로 온라인 무료 변환',
      tagline: 'MP3, M4A, WAV, OGG, FLAC 등 모든 오디오 파일을 원하는 비트레이트의 OGG로 변환해요.',
      metaTitle: '오디오를 OGG로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 오디오 OGG 변환기예요. MP3, WAV, M4A, OGG, FLAC, AAC를 업로드하고 OGG로 다운로드하세요. 비트레이트를 고를 수 있어요. 워터마크도 가입도 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '오디오를 OGG로 온라인 무료 변환',
      ogDescription: '어떤 오디오 파일이든 업로드하고 OGG로 다운로드하세요. 비트레이트를 고를 수 있어요. 무료이며 가입이 필요 없어요.',
      intro: 'OGG Vorbis는 특허 제약이 없는 무료 손실 형식으로, 같은 비트레이트에서 MP3보다 음질이 좋고 브라우저, Android, 게임 엔진에서 기본 지원돼요. Media Manipulator는 흔히 쓰는 모든 오디오 형식을 한 번의 업로드로 OGG로 변환하며, 직접 바꾸지 않는 한 샘플 레이트와 채널 레이아웃을 그대로 유지하고, 같은 양식에서 자르기, 노멀라이즈, EQ, AI 정리 도구도 제공해요.',
      whatItDoes: [
        'MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3, WMA를 OGG로 변환해요.',
        '비트레이트, 샘플 레이트, 채널 레이아웃을 선택할 수 있어요.',
        '자르기, 볼륨, 라우드니스 노멀라이즈, EQ가 Vorbis 인코딩과 같은 FFmpeg 패스에서 처리돼요.',
        'Vorbis 인코더가 실행되기 전에 AI로 음성을 정리하거나 배경 소음을 제거하세요.',
      ],
      flowSteps: [
        {
          title: '오디오 업로드',
          description: '게임이나 사이트에 쓸 MP3, WAV, FLAC 등의 오디오 파일.',
        },
        {
          title: '필요하면 조정',
          description: '비트레이트를 고르고, 자르거나 효과를 적용하세요.',
        },
        {
          title: '변환',
          description: 'FFmpeg가 저희 서버에서 OGG로 인코딩해요.',
        },
        {
          title: '다운로드',
          description: 'OGG 파일을 저장하세요.',
        },
      ],
      advancedDetails: [
        'OGG 출력은 FFmpeg의 libvorbis 인코더를 사용해요. 기본값은 192 kbps로, 음악에 무난한 선택이에요.',
        'Apple 기기와 일부 카 스테레오는 OGG를 재생하지 못하므로, 이런 기기에는 M4A나 MP3를 쓰세요.',
        '원본의 커버 아트는 이미지 첨부로 인식되어 동영상 트랙 검사에 걸리지 않아요.',
      ],
      whyItMatters: [
        '작은 파일과 로열티 없는 디코딩이 중요한 게임 및 앱 사운드 에셋.',
        '라이선스 없이 Firefox와 Chrome에서 재생되어야 하는 웹 오디오.',
        'Linux와 Android 플레이어용 팟캐스트나 음악 파일.',
      ],
      useCases: [
        {
          title: '기기에 맞게 형식 바꾸기',
          description: '필요한 플레이어를 위해 OGG 사본을 만드세요.',
        },
        {
          title: '편집 준비',
          description: '프로젝트에 쓸 작고 호환성 좋은 파일을 만드세요.',
        },
        {
          title: '한 번에 파일 하나씩',
          description: '게임 엔진용 효과음을 한 번에 파일 하나씩 준비하세요.',
        },
        {
          title: '변환하면서 정리하기',
          description: '녹음의 험 노이즈를 없앤 다음 OGG 에셋으로 내보내세요.',
        },
      ],
      whyMediaManipulator: [
        'OGG마다 비트레이트, 샘플 레이트, 채널을 직접 설정할 수 있어요.',
        '효과음을 OGG로 바꾸면서 앞뒤 무음을 잘라내세요.',
      ],
      privacyNote: '오디오는 저희 서버에서 FFmpeg로 OGG Vorbis로 인코딩돼요. 외부 오디오 서비스는 사용하지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 결과는 새 파일로 만들어지며, 업로드한 원본은 바뀌지 않아요.',
      faq: [
        {
          question: 'OGG란 무엇인가요?',
          answer: 'OGG Vorbis는 특허 제약이 없는 무료 손실 형식으로, 같은 비트레이트에서 MP3보다 음질이 좋고 브라우저, Android, 게임 엔진에서 기본 지원돼요.',
        },
        {
          question: 'OGG로 변환하면 음질이 좋아지나요?',
          answer: '아니요. Apple 기기와 일부 카 스테레오는 OGG를 재생하지 못하므로, 이런 기기에는 M4A나 MP3를 쓰세요.',
        },
        {
          question: 'OGG로 변환하면서 오디오를 자를 수 있나요?',
          answer: '네. 시작과 끝을 표시하면 OGG에는 그 부분만 담겨요.',
        },
        {
          question: '앨범 아트가 있는 M4A를 OGG로 변환할 수 있나요?',
          answer: '네. 커버는 동영상 트랙이 아니라 이미지 첨부로 인식되므로 작업이 진행되어 오디오만 담긴 Vorbis 파일이 만들어져요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '손실 압축 출력이에요. 선택한 비트레이트가 파일 크기를 결정해요.',
        ],
      },
      related: [
        {
          label: '오디오 변환기',
          to: '/tools/audio-converter',
          description: '흔히 쓰는 모든 오디오 형식 사이에서 변환해요.',
        },
        {
          label: '오디오 속도 변경',
          to: '/tools/change-audio-speed',
          description: '녹음을 빠르게 하거나 느리게 해요.',
        },
        {
          label: '오디오 음높이 변경',
          to: '/tools/change-audio-pitch',
          description: '키를 올리거나 내려요.',
        },
        {
          label: '오디오 노멀라이즈',
          to: '/tools/normalize-audio',
          description: '음량을 고르게 맞춰요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: 'AI 노이즈 제거.',
        },
        {
          label: '노래에서 보컬 제거',
          to: '/tools/remove-vocals-from-song',
          description: '인스트루멘털을 만들어요.',
        },
      ],
      embed: {
        title: '오디오를 OGG로 변환',
        description: '어떤 오디오 파일이든 업로드하세요. 출력은 OGG로 고정되어 있어요. 비트레이트, 샘플 레이트, 채널을 고른 뒤 파일 변환을 누르세요.',
      },
    },
    'convert-audio-to-m4a': {
      name: '오디오를 M4A / AAC로 변환',
      h1: '오디오를 M4A / AAC로 온라인 무료 변환',
      tagline: 'MP3, M4A, WAV, OGG, FLAC 등 모든 오디오 파일을 원하는 비트레이트의 M4A / AAC로 변환해요.',
      metaTitle: '오디오를 M4A / AAC로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 오디오 M4A / AAC 변환기예요. MP3, WAV, M4A, OGG, FLAC, AAC를 업로드하고 M4A / AAC로 다운로드하세요. 비트레이트를 고를 수 있어요. 워터마크도 가입도 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '오디오를 M4A / AAC로 온라인 무료 변환',
      ogDescription: '어떤 오디오 파일이든 업로드하고 M4A / AAC로 다운로드하세요. 비트레이트를 고를 수 있어요. 무료이며 가입이 필요 없어요.',
      intro: 'M4A는 MP4 컨테이너에 담긴 AAC 오디오로, Apple Music, iPhone, YouTube와 대부분의 스트리밍 서비스가 쓰는 형식이에요. 킬로바이트당 음질은 MP3보다 뛰어나요. Media Manipulator는 흔히 쓰는 모든 오디오 형식을 한 번의 업로드로 M4A / AAC로 변환하며, 직접 바꾸지 않는 한 샘플 레이트와 채널 레이아웃을 그대로 유지하고, 같은 양식에서 자르기, 노멀라이즈, EQ, AI 정리 도구도 제공해요.',
      whatItDoes: [
        'MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3, WMA를 M4A / AAC로 변환해요.',
        '비트레이트, 샘플 레이트, 채널 레이아웃을 선택할 수 있어요.',
        '자르기, 게인, 노멀라이즈, EQ, 효과가 AAC와 같은 인코딩 과정에서 적용돼요.',
        '양식의 AI 도구로 AAC를 기록하기 전에 음성 메모를 정리하거나 보컬을 제거할 수 있어요.',
      ],
      flowSteps: [
        {
          title: '오디오 업로드',
          description: 'WAV 마스터, MP3, 음성 메모.',
        },
        {
          title: '필요하면 조정',
          description: '비트레이트를 고르고, 자르거나 효과를 적용하세요.',
        },
        {
          title: '변환',
          description: 'FFmpeg가 저희 서버에서 M4A / AAC로 인코딩해요.',
        },
        {
          title: '다운로드',
          description: 'M4A / AAC 파일을 저장하세요.',
        },
      ],
      advancedDetails: [
        'M4A / AAC 출력은 FFmpeg의 aac 인코더를 사용해요. 기본값은 192 kbps로, 음악에 무난한 선택이에요.',
        'MP3만 지원하는 일부 구형 플레이어와 카 오디오는 AAC를 읽지 못해요.',
        '포함된 앨범 커버는 이미지로 인식되며 동영상 트랙으로 오인되지 않아요.',
      ],
      whyItMatters: [
        'iPhone, iPad, Mac용 음악과 음성 메모.',
        '나중에 MP4 동영상에 합칠 오디오 트랙.',
        '팟캐스트와 오디오북: 챕터 마커를 지원하고 MP3보다 파일이 작아요.',
      ],
      useCases: [
        {
          title: '기기에 맞게 형식 바꾸기',
          description: '필요한 플레이어를 위해 M4A / AAC 사본을 만드세요.',
        },
        {
          title: '편집 준비',
          description: '프로젝트에 쓸 작고 호환성 좋은 파일을 만드세요.',
        },
        {
          title: '한 번에 파일 하나씩',
          description: 'iPhone 라이브러리용 음성 메모를 변환하면서 무음 구간을 잘라내세요.',
        },
        {
          title: '변환하면서 정리하기',
          description: '팟캐스트 녹음에 음성 정리를 실행하고 바로 M4A로 저장하세요.',
        },
      ],
      whyMediaManipulator: [
        'AAC 출력의 비트레이트, 샘플 레이트, 채널 수를 조정할 수 있어요.',
        '두 번째 업로드 없이 에피소드를 노멀라이즈하고 M4A로 바꾸세요.',
      ],
      privacyNote: '오디오는 저희 서버에서 FFmpeg로 AAC로 인코딩되어 M4A 파일에 담겨요. 외부 오디오 서비스는 사용하지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 결과는 새 파일로 만들어지며, 업로드한 원본은 바뀌지 않아요.',
      faq: [
        {
          question: 'M4A / AAC란 무엇인가요?',
          answer: 'M4A는 MP4 컨테이너에 담긴 AAC 오디오로, Apple Music, iPhone, YouTube와 대부분의 스트리밍 서비스가 쓰는 형식이에요. 킬로바이트당 음질은 MP3보다 뛰어나요.',
        },
        {
          question: 'M4A / AAC로 변환하면 음질이 좋아지나요?',
          answer: '아니요. MP3만 지원하는 일부 구형 플레이어와 카 오디오는 AAC를 읽지 못해요.',
        },
        {
          question: 'M4A / AAC로 변환하면서 오디오를 자를 수 있나요?',
          answer: '네. 자르기 섹션에서 구간을 정하면 M4A가 지정한 지점에서 시작하고 끝나요.',
        },
        {
          question: 'MP3의 앨범 아트 때문에 M4A 변환이 실패하나요?',
          answer: '아니요. 아트 스트림은 동영상이 아니라 이미지로 식별되며 AAC 인코딩은 정상적으로 실행돼요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '손실 압축 출력이에요. 선택한 비트레이트가 파일 크기를 결정해요.',
        ],
      },
      related: [
        {
          label: '오디오 변환기',
          to: '/tools/audio-converter',
          description: '흔히 쓰는 모든 오디오 형식 사이에서 변환해요.',
        },
        {
          label: '오디오 속도 변경',
          to: '/tools/change-audio-speed',
          description: '녹음을 빠르게 하거나 느리게 해요.',
        },
        {
          label: '오디오 음높이 변경',
          to: '/tools/change-audio-pitch',
          description: '키를 올리거나 내려요.',
        },
        {
          label: '오디오 노멀라이즈',
          to: '/tools/normalize-audio',
          description: '음량을 고르게 맞춰요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: 'AI 노이즈 제거.',
        },
        {
          label: '노래에서 보컬 제거',
          to: '/tools/remove-vocals-from-song',
          description: '인스트루멘털을 만들어요.',
        },
      ],
      embed: {
        title: '오디오를 M4A / AAC로 변환',
        description: '어떤 오디오 파일이든 업로드하세요. 출력은 M4A / AAC로 고정되어 있어요. 비트레이트, 샘플 레이트, 채널을 고른 뒤 파일 변환을 누르세요.',
      },
    },
    'convert-audio-to-opus': {
      name: '오디오를 Opus로 변환',
      h1: '오디오를 Opus로 온라인 무료 변환',
      tagline: 'MP3, M4A, WAV, OGG, FLAC 등 모든 오디오 파일을 원하는 비트레이트의 Opus로 변환해요.',
      metaTitle: '오디오를 Opus로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 오디오 Opus 변환기예요. MP3, WAV, M4A, OGG, FLAC, AAC를 업로드하고 Opus로 다운로드하세요. 비트레이트를 고를 수 있어요. 워터마크도 가입도 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '오디오를 Opus로 온라인 무료 변환',
      ogDescription: '어떤 오디오 파일이든 업로드하고 Opus로 다운로드하세요. 비트레이트를 고를 수 있어요. 무료이며 가입이 필요 없어요.',
      intro: 'Opus는 가장 새로운 개방형 코덱이자, 낮은 비트레이트에서 음성과 음악 모두에 가장 좋은 손실 형식이에요. 64 kbps Opus는 128 kbps MP3처럼 들려요. WhatsApp, Discord, WebRTC가 쓰는 코덱이기도 해요. Media Manipulator는 흔히 쓰는 모든 오디오 형식을 한 번의 업로드로 Opus로 변환하며, 직접 바꾸지 않는 한 샘플 레이트와 채널 레이아웃을 그대로 유지하고, 같은 양식에서 자르기, 노멀라이즈, EQ, AI 정리 도구도 제공해요.',
      whatItDoes: [
        'MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3, WMA를 Opus로 변환해요.',
        '비트레이트, 샘플 레이트, 채널 레이아웃을 선택할 수 있어요.',
        '자르기, 볼륨, 노멀라이즈, EQ가 Opus 인코딩과 같은 패스에서 적용돼요.',
        '인코딩 전에 양식에서 저희 GPU의 AI로 배경 소음을 제거하거나 음성을 정리할 수 있어요.',
      ],
      flowSteps: [
        {
          title: '오디오 업로드',
          description: '음성 메모, 팟캐스트, 음악 등 흔히 쓰는 모든 오디오.',
        },
        {
          title: '필요하면 조정',
          description: '비트레이트를 고르고, 자르거나 효과를 적용하세요.',
        },
        {
          title: '변환',
          description: 'FFmpeg가 저희 서버에서 Opus로 인코딩해요.',
        },
        {
          title: '다운로드',
          description: 'Opus 파일을 저장하세요.',
        },
      ],
      advancedDetails: [
        'Opus 출력은 FFmpeg의 libopus 인코더를 사용해요. 기본값은 192 kbps로, 음악에 무난한 선택이에요.',
        'iTunes, 구형 Apple 기기, 많은 하드웨어 플레이어는 Opus를 지원하지 않으므로, 이런 경우에는 M4A를 고르세요.',
        '원본 파일의 앨범 아트는 이미지로 감지되며 변환을 멈추지 않아요.',
      ],
      whyItMatters: [
        '훨씬 작은 크기로 줄인 음성 메모, 팟캐스트, 오디오북.',
        '대역폭이 중요한 오디오 스트리밍이나 임베드.',
        'Opus를 기본으로 받는 Discord, Matrix, 메시징 봇.',
      ],
      useCases: [
        {
          title: '기기에 맞게 형식 바꾸기',
          description: '필요한 플레이어를 위해 Opus 사본을 만드세요.',
        },
        {
          title: '편집 준비',
          description: '프로젝트에 쓸 작고 호환성 좋은 파일을 만드세요.',
        },
        {
          title: '한 번에 파일 하나씩',
          description: '강의 시리즈를 하나씩 Opus로 줄이세요.',
        },
        {
          title: '변환하면서 정리하기',
          description: '잡음이 많은 통화 녹음을 정리하고 작은 Opus 파일로 보관하세요.',
        },
      ],
      whyMediaManipulator: [
        'Opus 비트레이트, 샘플 레이트, 채널을 고르거나 기본값을 그대로 쓰세요.',
        '음성 메모를 Opus로 바꾸면서 자르고 노멀라이즈하세요.',
      ],
      privacyNote: '오디오는 저희 서버에서 FFmpeg로 Opus로 인코딩돼요. 외부 오디오 서비스는 사용하지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 결과는 새 파일로 만들어지며, 업로드한 원본은 바뀌지 않아요.',
      faq: [
        {
          question: 'Opus란 무엇인가요?',
          answer: 'Opus는 가장 새로운 개방형 코덱이자, 낮은 비트레이트에서 음성과 음악 모두에 가장 좋은 손실 형식이에요. 64 kbps Opus는 128 kbps MP3처럼 들려요. WhatsApp, Discord, WebRTC가 쓰는 코덱이기도 해요.',
        },
        {
          question: 'Opus로 변환하면 음질이 좋아지나요?',
          answer: '아니요. iTunes, 구형 Apple 기기, 많은 하드웨어 플레이어는 Opus를 지원하지 않으므로, 이런 경우에는 M4A를 고르세요.',
        },
        {
          question: 'Opus로 변환하면서 오디오를 자를 수 있나요?',
          answer: '네. 지정한 시작과 끝 사이의 구간만 Opus로 인코딩돼요.',
        },
        {
          question: '커버 아트가 있는 오디오 파일도 Opus로 변환되나요?',
          answer: '네. 커버 아트는 동영상 스트림이 아니라 이미지로 감지되므로 파일이 받아들여지고 오디오만 인코딩돼요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '손실 압축 출력이에요. 선택한 비트레이트가 파일 크기를 결정해요.',
        ],
      },
      related: [
        {
          label: '오디오 변환기',
          to: '/tools/audio-converter',
          description: '흔히 쓰는 모든 오디오 형식 사이에서 변환해요.',
        },
        {
          label: '오디오 속도 변경',
          to: '/tools/change-audio-speed',
          description: '녹음을 빠르게 하거나 느리게 해요.',
        },
        {
          label: '오디오 음높이 변경',
          to: '/tools/change-audio-pitch',
          description: '키를 올리거나 내려요.',
        },
        {
          label: '오디오 노멀라이즈',
          to: '/tools/normalize-audio',
          description: '음량을 고르게 맞춰요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: 'AI 노이즈 제거.',
        },
        {
          label: '노래에서 보컬 제거',
          to: '/tools/remove-vocals-from-song',
          description: '인스트루멘털을 만들어요.',
        },
      ],
      embed: {
        title: '오디오를 Opus로 변환',
        description: '어떤 오디오 파일이든 업로드하세요. 출력은 Opus로 고정되어 있어요. 비트레이트, 샘플 레이트, 채널을 고른 뒤 파일 변환을 누르세요.',
      },
    },
    'convert-mp3-to-wav': {
      name: 'MP3를 WAV로 변환',
      h1: 'MP3를 WAV로 온라인 무료 변환',
      tagline: 'MP3를 압축되지 않은 WAV로 바꿔 편집, 샘플링, CD 굽기에 사용하세요.',
      metaTitle: 'MP3를 WAV로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 MP3 WAV 변환기예요. MP3를 업로드하고 원본 샘플 레이트 그대로의 압축되지 않은 16비트 PCM WAV를 다운로드하세요. 워터마크도 가입도 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'MP3를 WAV로 온라인 무료 변환',
      ogDescription: 'MP3를 넣으면 압축되지 않은 WAV가 나와요. 무료이며 가입이 필요 없어요.',
      intro: '오디오 편집기, 샘플러, CD 굽기 프로그램은 압축되지 않은 PCM을 원하고, 일부 오래된 도구는 MP3를 아예 받지 않아요. WAV로 변환하면 MP3를 한 번만 디코딩하므로 편집하면서 음질이 더 떨어지지 않아요. Media Manipulator는 저희 서버에서 FFmpeg로 변환하며, 원본 샘플 레이트와 채널을 유지하고, 포함된 앨범 아트를 동영상 트랙으로 오인하지 않고 무시해요.',
      whatItDoes: [
        'MP3를 원본 샘플 레이트와 채널 레이아웃 그대로 16비트 PCM WAV로 디코딩해요.',
        '같은 패스에서 자르기, 노멀라이즈, 페이드, EQ를 선택적으로 적용해요.',
        '커버 아트와 ID3 태그가 포함된 MP3도 처리해요.',
      ],
      flowSteps: [
        {
          title: 'MP3 업로드',
          description: '비트레이트와 커버 아트 유무에 상관없어요.',
        },
        {
          title: '필요하면 조정',
          description: '자르기, 노멀라이즈, EQ.',
        },
        {
          title: '변환',
          description: 'FFmpeg가 PCM으로 디코딩해요.',
        },
        {
          title: '다운로드',
          description: 'WAV를 저장하세요.',
        },
      ],
      advancedDetails: [
        'WAV 출력은 pcm_s16le이며, 파일 크기는 스테레오 44.1 kHz 오디오 기준 분당 약 10 MB예요.',
        '디코딩으로 MP3 인코더가 버린 정보가 되살아나지는 않아요. 추가 손실을 막을 뿐이에요.',
      ],
      whyItMatters: [
        'MP3를 편집하고 다시 MP3로 저장하면 그때마다 음질이 떨어지지만, WAV는 이를 막아 줘요.',
        '샘플러, DAW, CD 굽기 프로그램은 PCM을 기대해요.',
      ],
      useCases: [
        {
          title: 'DAW에서 편집',
          description: '디코딩 단계나 세대 손실 없이 가져오세요.',
        },
        {
          title: '오디오 CD 굽기',
          description: 'CD 굽기 프로그램은 44.1 kHz WAV를 원해요.',
        },
        {
          title: '사운드 샘플링',
          description: '샘플러나 게임 엔진에 불러오세요.',
        },
      ],
      whyMediaManipulator: [
        '원본 샘플 레이트와 채널을 유지해요.',
        'MP3의 커버 아트를 올바르게 처리해요.',
      ],
      privacyNote: 'MP3는 저희 서버에서 FFmpeg로 한 번만 디코딩되어 16비트 PCM WAV가 돼요. 외부 오디오 서비스는 사용하지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 결과는 새 파일로 만들어지며, 업로드한 원본은 바뀌지 않아요.',
      faq: [
        {
          question: 'WAV가 MP3보다 음질이 좋나요?',
          answer: '아니요. 똑같이 들려요. 핵심은 이후에 편집해도 음질이 떨어지지 않는다는 점이에요.',
        },
        {
          question: 'WAV는 왜 훨씬 큰가요?',
          answer: 'WAV는 압축되지 않아서 스테레오 CD 음질 오디오 기준 분당 약 10 MB예요.',
        },
        {
          question: 'MP3에 앨범 아트가 있어요. 문제가 되나요?',
          answer: '아니요. 포함된 커버 아트는 이미지로 인식되어 무시돼요.',
        },
      ],
      related: [
        {
          label: '오디오를 WAV로 변환',
          to: '/tools/convert-audio-to-wav',
          description: '어떤 형식이든 WAV로.',
        },
        {
          label: 'WAV를 MP3로 변환',
          to: '/tools/convert-wav-to-mp3',
          description: '반대 방향으로 변환해요.',
        },
        {
          label: '오디오 변환기',
          to: '/tools/audio-converter',
          description: '흔히 쓰는 모든 오디오 형식 사이에서 변환해요.',
        },
        {
          label: '오디오 속도 변경',
          to: '/tools/change-audio-speed',
          description: '녹음을 빠르게 하거나 느리게 해요.',
        },
        {
          label: '오디오 음높이 변경',
          to: '/tools/change-audio-pitch',
          description: '키를 올리거나 내려요.',
        },
        {
          label: '오디오 노멀라이즈',
          to: '/tools/normalize-audio',
          description: '음량을 고르게 맞춰요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: 'AI 노이즈 제거.',
        },
        {
          label: '노래에서 보컬 제거',
          to: '/tools/remove-vocals-from-song',
          description: '인스트루멘털을 만들어요.',
        },
      ],
      embed: {
        title: 'MP3를 WAV로 변환',
        description: 'MP3를 업로드하세요. 출력은 WAV로 고정되어 있어요. 원하면 자르거나 노멀라이즈한 뒤 파일 변환을 누르세요.',
      },
    },
    'change-audio-speed': {
      name: '오디오 속도 변경',
      h1: '오디오 속도 온라인 변경: 빠르게 또는 느리게',
      tagline: '강의나 팟캐스트는 1.5배로 빠르게, 연습용 노래나 녹음은 0.75배로 느리게 만들 수 있어요. 음높이는 그대로예요.',
      metaTitle: '오디오 속도 온라인 무료 변경 (음높이 유지) | Media Manipulator',
      metaDescription: '무료 온라인 오디오 속도 변경 도구예요. MP3, WAV, M4A 등의 속도를 음높이는 유지한 채 0.25배부터 4배까지 빠르게 하거나 느리게 하세요. 강의, 팟캐스트, 연습용 트랙에 알맞아요. 가입이 필요 없어요.',
      ogTitle: '오디오 속도 온라인 무료 변경',
      ogDescription: '다람쥐 목소리 없이 빠르게 또는 느리게. 무료이며 가입이 필요 없어요.',
      intro: '두 시간짜리 강의도 1.5배로 들으면 80분이에요. 기타 솔로도 0.75배로 들으면 따라 배울 수 있어요. 오디오 속도 변경은 매일 쓸모가 있지만, 문제는 음높이예요. 단순히 빠르게 하면 목소리가 다람쥐처럼 변해요. Media Manipulator는 저희 서버에서 FFmpeg의 템포 필터로 오디오를 타임 스트레치하며, 사분의 일 속도부터 네 배까지 음높이를 정확히 그대로 유지해요.',
      whatItDoes: [
        '어떤 오디오 파일이든 빠르게(1.1배~4배) 또는 느리게(0.25배~0.9배) 만들어요.',
        '음높이를 유지하므로 말소리와 음악의 키가 그대로예요.',
        '기본적으로 MP3로 내보내며, WAV, FLAC, M4A, OGG, Opus도 선택할 수 있어요.',
        '같은 패스에서 자르기, 노멀라이즈, EQ를 선택적으로 적용해요.',
      ],
      flowSteps: [
        {
          title: '오디오 업로드',
          description: 'MP3, WAV, M4A, OGG, FLAC 등.',
        },
        {
          title: '속도 설정',
          description: '1.5배가 미리 선택되어 있고, 0.25배~4배까지 가능해요.',
        },
        {
          title: '변환',
          description: 'FFmpeg가 음높이를 유지한 채 타임 스트레치해요.',
        },
        {
          title: '다운로드',
          description: '속도를 바꾼 파일을 저장하세요.',
        },
      ],
      advancedDetails: [
        'atempo 필터를 사용하며, 0.5~2.0 범위를 벗어나는 배율은 필터를 자동으로 연결해 처리해요.',
        '극단적인 배율에서는 타임 스트레치로 약간의 아티팩트가 생겨요. 말소리는 0.5배~2배에서 티가 나지 않아요.',
        '속도와 음높이를 함께 바꾸려면(테이프 효과) 음높이 도구의 타임 스트레치 옵션을 쓰세요.',
      ],
      whyItMatters: [
        '강의, 오디오북, 팟캐스트는 1.25배~2배로 들어도 편한 경우가 많아요.',
        '음악가는 어려운 구간을 50~75% 속도로 연습해요.',
        '받아쓰는 사람은 모든 단어를 들으려고 녹음을 느리게 해요.',
      ],
      useCases: [
        {
          title: '더 빠른 강의',
          description: '녹화된 수업을 1.5배로 들으세요.',
        },
        {
          title: '연습용 트랙',
          description: '같은 키 그대로 솔로를 0.75배로 느리게 하세요.',
        },
        {
          title: '받아쓰기',
          description: '인터뷰를 0.8배로 느리게 하세요.',
        },
        {
          title: '시간 맞추기',
          description: '보이스오버를 5% 조정해 시간에 맞추세요.',
        },
      ],
      whyMediaManipulator: [
        '기본적으로 음높이가 유지되어 다람쥐 목소리나 늘어진 테이프 소리가 나지 않아요.',
        '어떤 출력 형식이든 고를 수 있고, 같은 업로드에서 자르기와 노멀라이즈도 할 수 있어요.',
      ],
      privacyNote: '녹음은 저희 서버에서 FFmpeg로 빠르게 또는 느리게 처리되며, 선택한 모드에 따라 rubberband나 atempo를 사용해요. 외부 오디오 서비스는 사용하지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 결과는 새 파일로 만들어지며, 업로드한 원본은 바뀌지 않아요.',
      faq: [
        {
          question: '음높이가 바뀌나요?',
          answer: '아니요. 템포 필터가 음높이를 정확히 그대로 유지해요.',
        },
        {
          question: '얼마나 빠르게 할 수 있나요?',
          answer: '한 번에 4배까지 가능해요. 더 빠르게 하려면 결과를 다시 처리하세요.',
        },
        {
          question: '느리게 한 오디오가 기계음처럼 들리나요?',
          answer: '0.5배까지는 깨끗해요. 그보다 느리면 약간의 위상 왜곡이 들려요.',
        },
        {
          question: '속도와 음높이를 함께 바꿀 수 있나요?',
          answer: '네. 타임 스트레치 조절이 있는 오디오 음높이 변경 도구를 쓰세요.',
        },
      ],
      related: [
        {
          label: '오디오 변환기',
          to: '/tools/audio-converter',
          description: '흔히 쓰는 모든 오디오 형식 사이에서 변환해요.',
        },
        {
          label: '오디오 음높이 변경',
          to: '/tools/change-audio-pitch',
          description: '키를 올리거나 내려요.',
        },
        {
          label: '오디오 노멀라이즈',
          to: '/tools/normalize-audio',
          description: '음량을 고르게 맞춰요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: 'AI 노이즈 제거.',
        },
        {
          label: '노래에서 보컬 제거',
          to: '/tools/remove-vocals-from-song',
          description: '인스트루멘털을 만들어요.',
        },
      ],
      embed: {
        title: '오디오 파일 속도 변경',
        description: '오디오 파일을 업로드하고 속도 배율을 설정하세요. 1.5배가 미리 선택되어 있어요. 음높이가 유지되므로 목소리가 자연스러워요. 키도 바꾸려면 음높이 도구를 쓰세요.',
      },
    },
    'change-audio-pitch': {
      name: '오디오 음높이 변경',
      h1: '오디오 음높이 온라인 변경: 위아래로 조옮김',
      tagline: '반음 단위로 조옮김해 노래나 녹음의 키를 바꾸고, 보컬을 낮추거나 샘플을 맞출 수 있어요. 템포는 그대로 유지돼요.',
      metaTitle: '오디오 음높이 온라인 무료 변경: 반음 단위 조옮김 | Media Manipulator',
      metaDescription: '무료 온라인 음높이 변경 도구예요. MP3, WAV 등 어떤 오디오든 속도는 그대로 둔 채 반음 단위로 올리거나 내려 키를 바꾸세요. 타임 스트레치도 선택할 수 있어요. 워터마크도 가입도 필요 없어요.',
      ogTitle: '오디오 음높이 온라인 무료 변경',
      ogDescription: '어떤 오디오든 반음 단위로 조옮김하세요. 무료이며 가입이 필요 없어요.',
      intro: '목소리에 맞지 않는 키의 반주 트랙, 노래에 맞춰야 하는 샘플, 한 음 낮게 자리 잡아야 할 보컬: 음높이 변경이면 모두 해결돼요. Media Manipulator는 저희 서버에서 FFmpeg로 길이는 그대로 둔 채 오디오를 반음 단위로 조옮김하며, 예전 테이프 속도 효과를 원할 때는 타임 스트레치와 함께 쓸 수 있어요.',
      whatItDoes: [
        '오디오를 최대 12반음(한 옥타브)까지 올리거나 내려요.',
        '길이가 그대로라서 트랙이 여전히 들어맞아요.',
        '길이를 따로 바꾸는 타임 스트레치를 선택할 수 있어요.',
        '음높이를 바꾼 오디오를 MP3, WAV, FLAC, M4A, OGG, Opus로 저장해요.',
      ],
      flowSteps: [
        {
          title: '오디오 업로드',
          description: '흔히 쓰는 모든 오디오 형식.',
        },
        {
          title: '반음 설정',
          description: '+2가 미리 선택되어 있고, -12~+12까지 가능해요.',
        },
        {
          title: '변환',
          description: 'FFmpeg가 리샘플링하고 타이밍을 다시 맞춰요.',
        },
        {
          title: '다운로드',
          description: '조옮김한 파일을 저장하세요.',
        },
      ],
      advancedDetails: [
        '2^(반음/12) 비율로 리샘플링한 뒤 템포를 보정해 길이가 바뀌지 않게 해요.',
        '전체 믹스를 크게(5반음 넘게) 옮기면 인공적으로 들릴 수 있어요. 보컬과 단일 악기는 결과가 더 좋아요.',
        '포먼트 보존이 켜져 있어서 낮춘 목소리가 다른 사람처럼 들리지 않아요.',
      ],
      whyItMatters: [
        '가수는 반주 트랙을 편한 키로 조옮김해요.',
        '프로듀서는 샘플과 보컬을 노래에 맞춰 튜닝해요.',
        '반음 한두 개만 내려도 데모 보컬이 더 편안하게 들려요.',
      ],
      useCases: [
        {
          title: '반주 트랙 키 바꾸기',
          description: '노래방 트랙을 반음 두 개 내리세요.',
        },
        {
          title: '샘플 튜닝',
          description: '드럼이나 보컬 히트를 노래에 맞추세요.',
        },
        {
          title: '보이스오버 낮추기',
          description: '녹음을 반음 하나 내리세요.',
        },
        {
          title: '옥타브 효과',
          description: '+12나 -12로 옮겨 효과 레이어를 만드세요.',
        },
      ],
      whyMediaManipulator: [
        '길이를 유지하는 반음 단위 조절에, 원할 때는 타임 스트레치까지 쓸 수 있어요.',
        '어떤 출력 형식이든 고를 수 있고, 같은 업로드에서 자르기와 노멀라이즈도 할 수 있어요.',
      ],
      privacyNote: '오디오는 저희 서버에서 FFmpeg로 선택한 반음 수만큼 올라가거나 내려가요. 외부 오디오 서비스는 사용하지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 결과는 새 파일로 만들어지며, 업로드한 원본은 바뀌지 않아요.',
      faq: [
        {
          question: '속도가 바뀌나요?',
          answer: '아니요. 길이는 유지돼요. 바꾸고 싶다면 타임 스트레치 조절을 쓰세요.',
        },
        {
          question: '얼마나 옮길 수 있나요?',
          answer: '위아래로 최대 12반음(한 옥타브)까지예요.',
        },
        {
          question: '음높이를 바꾼 목소리가 자연스럽게 들리나요?',
          answer: '반음 한 개에서 세 개까지는 그래요. 더 크게 옮기면 티가 나지만, 포먼트 보존 덕분에 만화 캐릭터처럼 들리지는 않아요.',
        },
        {
          question: '센트 단위로 옮길 수 있나요?',
          answer: '아직은 안 돼요. 조절은 반음 단위예요.',
        },
      ],
      related: [
        {
          label: '오디오 변환기',
          to: '/tools/audio-converter',
          description: '흔히 쓰는 모든 오디오 형식 사이에서 변환해요.',
        },
        {
          label: '오디오 속도 변경',
          to: '/tools/change-audio-speed',
          description: '녹음을 빠르게 하거나 느리게 해요.',
        },
        {
          label: '오디오 노멀라이즈',
          to: '/tools/normalize-audio',
          description: '음량을 고르게 맞춰요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: 'AI 노이즈 제거.',
        },
        {
          label: '노래에서 보컬 제거',
          to: '/tools/remove-vocals-from-song',
          description: '인스트루멘털을 만들어요.',
        },
      ],
      embed: {
        title: '오디오 파일 음높이 변경',
        description: '오디오 파일을 업로드하세요. 고급 처리 섹션이 음높이 슬라이더와 함께 열리고, +2반음이 미리 선택되어 있어요. 음수 값은 키를 낮춰요. 길이도 바꾸고 싶다면 바로 옆에 타임 스트레치가 있어요.',
      },
    },
    'normalize-audio': {
      name: '오디오 노멀라이즈',
      h1: '오디오 라우드니스 온라인 노멀라이즈',
      tagline: '작게 녹음된 소리를 일정한 음량으로 맞춰 팟캐스트, 음성 메모, 섞인 재생목록이 같은 크기로 재생되게 해요.',
      metaTitle: '오디오 온라인 무료 노멀라이즈 (라우드니스) | Media Manipulator',
      metaDescription: '무료 온라인 오디오 노멀라이저예요. EBU R128 라우드니스 노멀라이즈로 MP3, WAV, M4A 등 파일의 음량을 고르게 맞추세요. 팟캐스트와 음성 메모에 알맞아요. 워터마크도 가입도 필요 없어요.',
      ogTitle: '오디오 온라인 무료 노멀라이즈',
      ogDescription: '어떤 녹음이든 일정한 라우드니스로. 무료이며 가입이 필요 없어요.',
      intro: '팔을 뻗은 거리에서 녹음한 음성 메모는 소리가 작고, CD에서 추출한 노래는 소리가 커서, 연달아 재생하면 듣는 사람이 볼륨 조절에 손을 뻗게 돼요. 라우드니스 노멀라이즈는 파일 전체의 체감 음량을 측정해 표준 목표치에 맞추며, 방송사와 스트리밍 서비스가 쓰는 것과 같은 EBU R128 측정 방식을 사용해요. Media Manipulator는 저희 서버에서 FFmpeg의 loudnorm 필터로 이를 실행하며, 이 필터는 트루 피크도 상한선 아래로 유지해 클리핑이 생기지 않아요.',
      whatItDoes: [
        '통합 라우드니스를 측정하고 방송 표준 목표치에 맞춰 노멀라이즈해요.',
        '트루 피크를 제한해 출력에 클리핑이 생기지 않아요.',
        '같은 섹션에서 게인, 페이드 인/아웃, 다이내믹 레인지 압축을 선택적으로 적용해요.',
        '레벨을 맞춘 파일을 MP3, WAV, FLAC, M4A, OGG, Opus로 저장해요.',
      ],
      flowSteps: [
        {
          title: '오디오 업로드',
          description: '흔히 쓰는 모든 형식.',
        },
        {
          title: '노멀라이즈 켜 두기',
          description: '필요하면 페이드나 압축을 추가하세요.',
        },
        {
          title: '변환',
          description: 'FFmpeg loudnorm이 측정하고 보정해요.',
        },
        {
          title: '다운로드',
          description: '레벨을 맞춘 파일을 저장하세요.',
        },
      ],
      advancedDetails: [
        'loudnorm(EBU R128)을 기본 통합 목표치 -24 LUFS와 트루 피크 상한 -2 dBTP로 사용해요.',
        '이것은 피크 노멀라이즈가 아니라 라우드니스 노멀라이즈예요. 둘 다 0 dB에서 피크가 찍히는 두 파일도 체감 음량은 크게 다를 수 있어요.',
        '분석 없이 고정된 게인만 빠르게 바꾸려면 증폭 슬라이더나 오디오 볼륨 조절 도구를 쓰세요.',
      ],
      whyItMatters: [
        '볼륨을 계속 조절해야 하는 팟캐스트는 청취자가 떠나요.',
        '재생목록과 DJ 세트는 트랙의 레벨이 일정해야 해요.',
        '플랫폼은 업로드할 때 노멀라이즈하므로, 미리 해 두면 예상치 못한 결과가 없어요.',
      ],
      useCases: [
        {
          title: '팟캐스트 에피소드',
          description: '녹음한 대화를 게시하기 전에 레벨을 맞추세요.',
        },
        {
          title: '음성 메모',
          description: '작게 녹음된 휴대폰 녹음의 소리를 키우세요.',
        },
        {
          title: '강의 녹음',
          description: '마이크에서 멀어지는 발표자의 음량을 고르게 맞추세요.',
        },
        {
          title: '재생목록 준비',
          description: '여러 출처에서 추출한 트랙을 노멀라이즈하세요.',
        },
      ],
      whyMediaManipulator: [
        '피크만 훑는 게 아니라 진짜 EBU R128 라우드니스 측정을 해요.',
        '같은 섹션에서 페이드, 게인, 압축까지 적용할 수 있어요.',
      ],
      privacyNote: '오디오의 라우드니스는 저희 서버에서 FFmpeg로 측정되고 고르게 맞춰져요. 외부 오디오 서비스는 사용하지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 결과는 새 파일로 만들어지며, 업로드한 원본은 바뀌지 않아요.',
      faq: [
        {
          question: '어떤 목표 라우드니스를 쓰나요?',
          answer: 'EBU R128 기본값인 통합 -24 LUFS와 트루 피크 상한 -2 dBTP예요. 팟캐스트 플랫폼은 보통 -16~-19 LUFS를 목표로 하므로, 더 크게 만들고 싶다면 증폭을 몇 dB 더하세요.',
        },
        {
          question: '파일 안의 모든 부분이 같은 음량이 되나요?',
          answer: '아니요. 파일 전체를 기준으로 레벨을 맞춰요. 파일 안의 음량 차이를 줄이려면 컴프레서도 함께 켜세요.',
        },
        {
          question: '클리핑이 생길 수 있나요?',
          answer: '아니요. 트루 피크 리미터가 피크를 상한선 아래로 유지해요.',
        },
        {
          question: '그냥 소리만 키울 수 있나요?',
          answer: '네. 고정된 게인 변경에는 오디오 볼륨 조절 도구를 쓰세요.',
        },
      ],
      related: [
        {
          label: '볼륨 조절',
          to: '/tools/adjust-audio-volume',
          description: '고정된 게인으로 키우거나 줄여요.',
        },
        {
          label: '오디오 변환기',
          to: '/tools/audio-converter',
          description: '흔히 쓰는 모든 오디오 형식 사이에서 변환해요.',
        },
        {
          label: '오디오 속도 변경',
          to: '/tools/change-audio-speed',
          description: '녹음을 빠르게 하거나 느리게 해요.',
        },
        {
          label: '오디오 음높이 변경',
          to: '/tools/change-audio-pitch',
          description: '키를 올리거나 내려요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: 'AI 노이즈 제거.',
        },
        {
          label: '노래에서 보컬 제거',
          to: '/tools/remove-vocals-from-song',
          description: '인스트루멘털을 만들어요.',
        },
      ],
      embed: {
        title: '오디오 파일 노멀라이즈',
        description: '오디오 파일을 업로드하세요. 기본 오디오 처리 섹션에서 라우드니스 노멀라이즈가 이미 켜져 있어요. 원하면 증폭, 페이드, 압축을 추가하세요. 파일 변환을 누르세요.',
      },
    },
    'adjust-audio-volume': {
      name: '오디오 볼륨 조절',
      h1: '온라인에서 오디오 볼륨 키우기 또는 줄이기',
      tagline: '오디오 파일의 소리를 10%부터 두 배까지 정해진 만큼 키우거나 줄이고, 증폭 슬라이더로 데시벨 단위로 조절할 수도 있어요.',
      metaTitle: '오디오 볼륨 온라인 무료로 키우기 (MP3 소리 크게) | Media Manipulator',
      metaDescription: '무료 온라인 볼륨 변경 도구예요. MP3, WAV 등 모든 오디오 파일의 소리를 정해진 배수나 데시벨 단위로 키우거나 줄이고, 페이드도 넣을 수 있어요. 워터마크도 가입도 필요 없어요.',
      ogTitle: '온라인에서 오디오 볼륨 키우기 또는 줄이기',
      ogDescription: '어떤 오디오든 소리를 크게 또는 작게 바꿔요. 무료이며 가입이 필요 없어요.',
      intro: '파일 소리가 그냥 너무 작거나, 재생목록의 다른 곡보다 지나치게 클 때가 있어요. 이럴 때는 정해진 만큼 게인을 바꾸기만 하면 돼요. Media Manipulator는 저희 서버에서 FFmpeg로 오디오 볼륨을 배수나 데시벨 단위로 조절하고, 원하면 페이드를 더하며, 결과가 클리핑되지 않도록 라우드니스 노멀라이즈와 함께 적용할 수도 있어요.',
      whatItDoes: [
        '볼륨을 0.1배(아주 작게)부터 2배(두 배)까지 곱해요.',
        '또는 증폭 슬라이더로 -60~+60 dB 범위에서 데시벨 단위의 정확한 게인을 설정해요.',
        '페이드 인과 페이드 아웃을 초 단위로 설정해요.',
        '크게 키울 때 클리핑을 막아 주는 노멀라이즈와 컴프레션을 선택해서 적용할 수 있어요.',
      ],
      flowSteps: [
        {
          title: '오디오 업로드',
          description: '자주 쓰이는 형식이면 모두 돼요.',
        },
        {
          title: '볼륨 설정',
          description: '1.5배가 미리 선택돼 있어요. 데시벨을 써도 돼요.',
        },
        {
          title: '변환',
          description: 'FFmpeg가 게인을 적용해요.',
        },
        {
          title: '다운로드',
          description: '조절된 파일을 저장하세요.',
        },
      ],
      advancedDetails: [
        '볼륨은 volume 필터로 조절해요. 배수 2는 +6 dB, 0.5는 -6 dB예요.',
        '이미 피크가 0 dBFS 가까이 닿는 파일을 키우면 클리핑이 생겨요. 트루 피크 리미터가 포함된 노멀라이즈를 켜세요.',
        '고정 게인 대신 체감 음량을 일정하게 맞추려면 오디오 노멀라이즈를 사용하세요.',
      ],
      whyItMatters: [
        '작게 녹음된 소리는 휴대폰 스피커로 듣기 어려워요.',
        '너무 큰 벨소리나 효과음은 듣기 불편하고 클리핑이 생겨요.',
        '얼마나 바꿀지 정확히 알 때는 고정 게인이 알맞은 도구예요.',
      ],
      useCases: [
        {
          title: '작은 음성 메모 키우기',
          description: '휴대폰 녹음이 잘 들리게 해요.',
        },
        {
          title: '큰 효과음 줄이기',
          description: '효과음을 10 dB 낮춰요.',
        },
        {
          title: '벨소리',
          description: '소리를 키우고 페이드 아웃을 더해요.',
        },
        {
          title: '배경 음악',
          description: '음성 아래에 깔리도록 트랙 소리를 낮춰요.',
        },
      ],
      whyMediaManipulator: [
        '배수나 데시벨 조절과 페이드를 한곳에서 할 수 있어요.',
        '같은 처리 과정에서 노멀라이즈와 컴프레션으로 클리핑을 막아요.',
      ],
      privacyNote: '오디오는 저희 서버의 FFmpeg가 설정한 만큼 키우거나 줄여요. 외부 오디오 서비스는 사용하지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 결과는 새 파일로 받으며, 업로드한 파일 자체는 바뀌지 않아요.',
      faq: [
        {
          question: '최대 얼마나 키울 수 있나요?',
          answer: '배수로는 2배, 증폭 슬라이더로는 최대 +60 dB까지 키울 수 있어요. 노멀라이즈를 켜지 않으면 크게 키울 때 클리핑이 생겨요.',
        },
        {
          question: '소리가 찌그러지나요?',
          answer: '키운 신호가 풀 스케일을 넘을 때만 그래요. 트루 피크를 제한하는 노멀라이즈를 켜세요.',
        },
        {
          question: '배수와 데시벨 중 무엇을 쓸까요?',
          answer: '하는 일은 같아요. 2배는 +6 dB, 0.5배는 -6 dB와 같아요.',
        },
        {
          question: '대신 음량을 고르게 맞출 수 있나요?',
          answer: '네. 체감 음량을 일정하게 맞추려면 오디오 노멀라이즈를 사용하세요.',
        },
      ],
      related: [
        {
          label: '오디오 노멀라이즈',
          to: '/tools/normalize-audio',
          description: '일정한 음량으로 맞춰요.',
        },
        {
          label: '오디오 변환기',
          to: '/tools/audio-converter',
          description: '자주 쓰이는 모든 오디오 형식 간에 변환해요.',
        },
        {
          label: '오디오 속도 변경',
          to: '/tools/change-audio-speed',
          description: '녹음을 빠르게 하거나 느리게 해요.',
        },
        {
          label: '오디오 음높이 변경',
          to: '/tools/change-audio-pitch',
          description: '키를 올리거나 내려요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: 'AI 노이즈 제거.',
        },
        {
          label: '노래에서 보컬 제거',
          to: '/tools/remove-vocals-from-song',
          description: '인스트루멘털을 만들어요.',
        },
      ],
      embed: {
        title: '오디오 파일 볼륨 조절하기',
        description: '오디오 파일을 업로드하고 볼륨 배수를 설정하세요. 1.5배가 미리 선택돼 있어요. 데시벨 단위로 바꾸려면 기본 오디오 처리의 증폭 슬라이더를 사용하세요. 크게 키우면 클리핑이 생길 수 있으니, 안전한 결과를 원하면 노멀라이즈를 켜세요.',
      },
    },
    'audio-equalizer': {
      name: '오디오 이퀄라이저',
      h1: '온라인 오디오 이퀄라이저: 베이스 부스트, 고음, 프리셋',
      tagline: '베이스 부스트, 고음 강조, 보컬 선명도, 장르 프리셋을 적용하거나 로패스와 하이패스 필터를 설정한 뒤 결과를 다운로드하세요.',
      metaTitle: '온라인 오디오 이퀄라이저: 베이스 부스트, 고음, 보컬 | Media Manipulator',
      metaDescription: '무료 온라인 오디오 이퀄라이저예요. MP3, WAV 등에 베이스 부스트, 고음 강조, 보컬, 록, 재즈, 클래식 EQ 프리셋을 적용하거나 하이패스와 로패스 필터를 설정하세요. 가입이 필요 없어요.',
      ogTitle: '온라인 오디오 이퀄라이저',
      ogDescription: '베이스 부스트, 고음, 보컬 프레즌스 등을 적용해요. 무료이며 가입이 필요 없어요.',
      intro: 'EQ는 녹음의 음색을 다듬어요. 얇은 트랙에는 저음을 더하고, 웅웅 울리는 방 소리에서는 저음을 덜어 내고, 음성이 또렷이 들리도록 프레즌스 대역을 올리고, 하이패스로 럼블을 없애요. Media Manipulator는 원클릭 프리셋부터 직접 지정하는 필터 컷오프까지 저희 서버에서 FFmpeg로 이퀄라이징을 적용하고, 어떤 오디오 형식으로든 내보내요.',
      whatItDoes: [
        '프리셋: 베이스 부스트, 고음 강조, 보컬, 록, 재즈, 클래식.',
        '컷오프 주파수를 조절할 수 있는 하이패스와 로패스 필터.',
        '볼륨, 노멀라이즈, 컴프레션, 리버브와 함께 적용할 수 있어요.',
        '이퀄라이징한 결과는 MP3, WAV, FLAC, M4A, OGG, Opus로 받을 수 있어요.',
      ],
      flowSteps: [
        {
          title: '오디오 업로드',
          description: '자주 쓰이는 형식이면 모두 돼요.',
        },
        {
          title: '프리셋이나 필터 선택',
          description: '베이스 부스트가 미리 선택돼 있어요.',
        },
        {
          title: '변환',
          description: 'FFmpeg가 EQ 체인을 적용해요.',
        },
        {
          title: '다운로드',
          description: '음색을 다듬은 파일을 저장하세요.',
        },
      ],
      advancedDetails: [
        '프리셋은 고정된 게인과 Q 값을 쓰는 FFmpeg의 equalizer, bass, treble 필터에 대응해요.',
        '80~120 Hz 하이패스는 음성 녹음에서 핸들링 노이즈와 럼블을 없애고, 8~10 kHz 로패스는 쉭쉭거리는 소리를 줄여요.',
        'EQ는 녹음되지 않은 주파수를 만들어 낼 수 없어요. 휴대폰 녹음에는 키울 만한 100 Hz 이하 소리가 거의 없어요.',
      ],
      whyItMatters: [
        '프레즌스 대역을 조금만 올려도 작은 스피커에서 말소리가 훨씬 잘 들려요.',
        '럼블과 쉭쉭거리는 소리는 가장 흔한 두 가지 문제이고, 둘 다 간단한 필터로 해결돼요.',
        '장르 프리셋으로 재생목록에 빠르고 일관된 색깔을 입힐 수 있어요.',
      ],
      useCases: [
        {
          title: '음성 선명도',
          description: '팟캐스트에 보컬 프리셋과 하이패스를 함께 적용해요.',
        },
        {
          title: '베이스 부스트',
          description: '얇은 녹음을 풍성하게 채워요.',
        },
        {
          title: '럼블 제거',
          description: '100 Hz 하이패스.',
        },
        {
          title: '쉭쉭거리는 소리 줄이기',
          description: '오래된 테이프를 옮긴 녹음에 10 kHz 로패스.',
        },
      ],
      whyMediaManipulator: [
        '프리셋과 직접 지정하는 필터 컷오프를 한 섹션에서 다뤄요.',
        '한 번 업로드로 노멀라이즈, 컴프레션, 리버브까지 이어서 적용해요.',
      ],
      privacyNote: '오디오의 저음, 중음, 고음은 저희 서버에서 FFmpeg의 이퀄라이저가 다듬어요. 외부 오디오 서비스는 사용하지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 결과는 새 파일로 받으며, 업로드한 파일 자체는 바뀌지 않아요.',
      faq: [
        {
          question: '대역을 직접 설정할 수 있나요?',
          answer: '프리셋과 하이패스, 로패스 컷오프를 제공해요. 대역별 게인 조절은 추가할 예정이에요.',
        },
        {
          question: '하이패스 필터는 무엇을 하나요?',
          answer: '컷오프 주파수 아래의 모든 소리를 없애요. 럼블, 핸들링 노이즈, 파열음의 퍽 하는 소리 같은 것들이요.',
        },
        {
          question: 'EQ로 먹먹한 녹음을 고칠 수 있나요?',
          answer: '고음이 단지 작게 녹음된 경우라면 고음 강조가 도움이 돼요. 처음부터 녹음되지 않았다면 EQ로 만들어 낼 수 없으니 AI 음성 정리를 사용해 보세요.',
        },
        {
          question: 'EQ 때문에 클리핑이 생기나요?',
          answer: '키우는 설정이라면 생길 수 있어요. 트루 피크 리미터가 포함된 노멀라이즈를 켜세요.',
        },
      ],
      related: [
        {
          label: '음성 오디오 정리',
          to: '/tools/clean-voice-audio',
          description: 'AI 음성 향상.',
        },
        {
          label: '오디오 변환기',
          to: '/tools/audio-converter',
          description: '자주 쓰이는 모든 오디오 형식 간에 변환해요.',
        },
        {
          label: '오디오 속도 변경',
          to: '/tools/change-audio-speed',
          description: '녹음을 빠르게 하거나 느리게 해요.',
        },
        {
          label: '오디오 음높이 변경',
          to: '/tools/change-audio-pitch',
          description: '키를 올리거나 내려요.',
        },
        {
          label: '오디오 노멀라이즈',
          to: '/tools/normalize-audio',
          description: '음량을 고르게 맞춰요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: 'AI 노이즈 제거.',
        },
        {
          label: '노래에서 보컬 제거',
          to: '/tools/remove-vocals-from-song',
          description: '인스트루멘털을 만들어요.',
        },
      ],
      embed: {
        title: '오디오 파일 이퀄라이징하기',
        description: '오디오 파일을 업로드하세요. 기본 오디오 처리의 이퀄라이저가 베이스 부스트 프리셋으로 이미 켜져 있어요. 다른 프리셋을 고르거나 하이패스와 로패스 컷오프를 설정하세요. 파일 변환을 누르세요.',
      },
    },
    'add-reverb-to-audio': {
      name: '오디오에 리버브 추가',
      h1: '온라인에서 오디오에 리버브 또는 에코 추가',
      tagline: '드라이한 보컬이나 녹음에 룸, 홀, 플레이트, 스프링 리버브를 입히거나 딜레이와 에코를 추가한 뒤 결과를 다운로드하세요.',
      metaTitle: '오디오에 리버브·에코 온라인 무료 추가 | Media Manipulator',
      metaDescription: '무료 온라인 리버브 및 에코 도구예요. MP3, WAV 등 모든 오디오 파일에 룸, 홀, 플레이트, 스프링 리버브나 딜레이를 더하고, 웨트 레벨과 룸 크기를 조절하세요. 가입이 필요 없어요.',
      ogTitle: '온라인에서 오디오에 리버브 또는 에코 추가',
      ogDescription: '룸, 홀, 플레이트, 스프링, 딜레이. 무료이며 가입이 필요 없어요.',
      intro: '흡음 처리된 방에서 녹음한 보컬은 어떤 공간에 놓이기 전까지 생기 없이 들려요. 리버브는 그 공간감을, 딜레이는 리듬감을 더해요. Media Manipulator는 저희 서버에서 FFmpeg로 룸, 홀, 플레이트, 스프링 리버브와 에코 스타일 딜레이를 적용하고, 웨트 레벨과 룸 크기를 조절할 수 있게 하며, 어떤 오디오 형식으로든 내보내요.',
      whatItDoes: [
        '룸 크기, 댐핑, 웨트/드라이 믹스를 조절할 수 있는 룸, 홀, 플레이트, 스프링 리버브.',
        '시간과 피드백을 조절할 수 있는 에코, 멀티탭, 핑퐁 딜레이.',
        '같은 섹션에 코러스, 플랜저, 페이저, 트레몰로 모듈레이션도 있어요.',
        '효과를 입힌 버전은 MP3, WAV, FLAC, M4A, OGG, Opus 중에서 고르세요.',
      ],
      flowSteps: [
        {
          title: '오디오 업로드',
          description: '드라이한 보컬이나 악기 소리가 가장 잘 맞아요.',
        },
        {
          title: '리버브 선택',
          description: '홀이 미리 선택돼 있어요. 크기와 믹스를 설정하세요.',
        },
        {
          title: '변환',
          description: 'FFmpeg가 효과를 렌더링해요.',
        },
        {
          title: '다운로드',
          description: '결과를 저장하세요.',
        },
      ],
      advancedDetails: [
        '리버브는 유형별 딜레이·감쇠 값 세트를 쓰는 FFmpeg의 aecho로 만들어요. 웨트 레벨은 효과음과 드라이 신호를 섞는 비율이에요.',
        '딜레이 시간은 밀리초 단위예요. 피드백이 70%를 넘으면 소리가 빠르게 쌓여요.',
        '효과는 파일에 렌더링돼요. 나중에 바꿀 수도 있다면 드라이 원본을 보관하세요.',
      ],
      whyItMatters: [
        '드라이한 보컬과 내레이션은 공간감이 어느 정도 없으면 부자연스럽게 들려요.',
        '짧은 플레이트 리버브는 낭독과 노래를 다듬는 기본 마무리예요.',
        '딜레이와 모듈레이션은 사운드 디자인 요소를 만드는 가장 빠른 방법이에요.',
      ],
      useCases: [
        {
          title: '보컬 다듬기',
          description: '노래나 말소리 테이크에 짧은 플레이트를 걸어요.',
        },
        {
          title: '넓은 홀',
          description: '합창이나 패드를 대성당 안에 놓아요.',
        },
        {
          title: '슬랩백',
          description: '기타나 보컬에 짧은 에코를 더해요.',
        },
        {
          title: '사운드 디자인',
          description: '효과음에 핑퐁 딜레이와 플랜저를 걸어요.',
        },
      ],
      whyMediaManipulator: [
        '리버브 네 가지, 딜레이 세 가지, 모듈레이션 효과 네 가지를 한 섹션에서 다뤄요.',
        '한 번 업로드로 EQ, 노멀라이즈, 음높이 조절과 함께 적용해요.',
      ],
      privacyNote: '리버브는 저희 서버의 FFmpeg가 오디오에 더해요. 외부 오디오 서비스는 사용하지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 결과는 새 파일로 받으며, 업로드한 파일 자체는 바뀌지 않아요.',
      faq: [
        {
          question: '음성에는 어떤 리버브를 써야 하나요?',
          answer: '웨트 20~30%의 플레이트나 작은 룸이 좋아요. 홀은 음악과 효과음용이에요.',
        },
        {
          question: '리버브를 없앨 수 있나요?',
          answer: '이 도구에서는 안 돼요. AI 음성 정리 도구가 말소리의 방 울림을 줄여 줘요.',
        },
        {
          question: '리버브와 딜레이를 함께 넣을 수 있나요?',
          answer: '네. 둘 다 같은 섹션에 있어서 함께 켤 수 있어요.',
        },
        {
          question: '효과를 되돌릴 수 있나요?',
          answer: '아니요. 효과는 파일에 렌더링되니 드라이 원본을 보관하세요.',
        },
      ],
      related: [
        {
          label: '오디오 변환기',
          to: '/tools/audio-converter',
          description: '자주 쓰이는 모든 오디오 형식 간에 변환해요.',
        },
        {
          label: '오디오 속도 변경',
          to: '/tools/change-audio-speed',
          description: '녹음을 빠르게 하거나 느리게 해요.',
        },
        {
          label: '오디오 음높이 변경',
          to: '/tools/change-audio-pitch',
          description: '키를 올리거나 내려요.',
        },
        {
          label: '오디오 노멀라이즈',
          to: '/tools/normalize-audio',
          description: '음량을 고르게 맞춰요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: 'AI 노이즈 제거.',
        },
        {
          label: '노래에서 보컬 제거',
          to: '/tools/remove-vocals-from-song',
          description: '인스트루멘털을 만들어요.',
        },
      ],
      embed: {
        title: '오디오 파일에 리버브 추가하기',
        description: '오디오 파일을 업로드하세요. 시간 기반 효과 섹션이 홀 리버브가 선택된 상태로 열려요. 룸 크기와 웨트 레벨을 조절하거나, 룸, 플레이트, 스프링을 고르거나, 딜레이를 추가하세요. 파일 변환을 누르세요.',
      },
    },
    'trim-audio': {
      name: '오디오 자르기',
      h1: '온라인에서 무료로 오디오 자르기',
      tagline: 'MP3, WAV 등 어떤 녹음이든 시작과 끝 시간으로 잘라요. 파형을 보며 구간을 고르고 필요한 부분만 다운로드하세요.',
      metaTitle: '오디오 온라인 무료 자르기: MP3, WAV 자르기 | Media Manipulator',
      metaDescription: '무료 온라인 오디오 자르기 도구예요. 파형을 보며 어떤 오디오 파일이든 원하는 구간으로 자르고, 페이드를 더한 뒤 MP3, WAV, M4A 등으로 다운로드하세요. 벨소리나 클립도 만들 수 있어요. 워터마크도 가입도 필요 없어요.',
      ogTitle: '온라인에서 무료로 오디오 자르기',
      ogDescription: '파형에서 시작과 끝을 고르고 클립을 다운로드하세요. 무료이며 가입이 필요 없어요.',
      intro: '벨소리로 쓸 후렴, 두 시간짜리 녹음에서 건질 만한 단 일 분, 도입부를 뺀 짧은 인용 구간까지. 자르기는 누구에게나 필요한 오디오 편집이에요. Media Manipulator는 파형을 보여 주고, 시작점과 끝점을 끌어서 정하게 하며, 저희 서버에서 FFmpeg로 자른 뒤 원하면 페이드를 더해 어떤 형식으로든 내보내요.',
      whatItDoes: [
        '파형에서 고른 시작 시간과 끝 시간으로 어떤 오디오 파일이든 잘라요.',
        '잘린 지점에서 딸깍 소리가 나지 않도록 페이드 인과 페이드 아웃을 넣어요.',
        '잘라 낸 결과는 MP3, WAV, FLAC, M4A, OGG, Opus로 받아요.',
        '같은 처리 과정에서 볼륨, 노멀라이즈, EQ와 함께 적용할 수 있어요.',
      ],
      flowSteps: [
        {
          title: '오디오 업로드',
          description: '자주 쓰이는 형식이면 모두 돼요.',
        },
        {
          title: '구간 설정',
          description: '파형 위의 마커를 끌어요.',
        },
        {
          title: '변환',
          description: 'FFmpeg가 자르고 인코딩해요.',
        },
        {
          title: '다운로드',
          description: '클립을 저장하세요.',
        },
      ],
      advancedDetails: [
        '샘플 단위로 정확하게 자르고, 결과는 선택한 형식으로 다시 인코딩해요.',
        '0.05~0.2초 길이의 페이드를 넣으면 잘린 지점의 딸깍 소리가 사라져요.',
        '동영상은 동영상 자르기를, 결과물의 파형 동영상은 오디오 파형 생성기를 사용하세요.',
      ],
      whyItMatters: [
        '벨소리와 알림음에는 20~30초 길이의 구간이 필요해요.',
        '녹음 전체보다 짧은 인용 구간을 공유하는 편이 더 쉬워요.',
        '받아쓰기 전에 무음과 도입부를 잘라 내면 시간이 절약돼요.',
      ],
      useCases: [
        {
          title: '벨소리',
          description: '후렴을 잘라 페이드를 더해요.',
        },
        {
          title: '짧은 인용',
          description: '인터뷰에서 한 문장을 뽑아요.',
        },
        {
          title: '잘못된 시작 부분 삭제',
          description: '음성 메모의 처음 10초를 잘라 내요.',
        },
        {
          title: '샘플',
          description: '타격음이나 한 구절만 떼어 내요.',
        },
      ],
      whyMediaManipulator: [
        '타임스탬프를 입력하는 대신 마커를 끌어서 편집하는 파형 편집.',
        '한 번 업로드로 페이드, 노멀라이즈, 원하는 출력 형식까지.',
      ],
      privacyNote: '오디오는 저희 서버의 FFmpeg가 설정한 시작점과 끝점으로 잘라요. 외부 오디오 서비스는 사용하지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 결과는 새 파일로 받으며, 업로드한 파일 자체는 바뀌지 않아요.',
      faq: [
        {
          question: '정확한 시간을 입력할 수 있나요?',
          answer: '네. 자르기 대화상자에는 끌 수 있는 마커와 함께 시작·끝 입력란도 있어요.',
        },
        {
          question: '잘린 부분에서 딸깍 소리가 나나요?',
          answer: '기본 오디오 처리에서 짧은 페이드 인과 페이드 아웃을 넣으면 막을 수 있어요.',
        },
        {
          question: '원본 음질을 유지할 수 있나요?',
          answer: '손실 압축으로 다시 인코딩되지 않도록 WAV나 FLAC 출력을 고르세요.',
        },
        {
          question: '중간 부분만 잘라 낼 수 있나요?',
          answer: '한 번에 한 구간만 가능해요. 도구를 두 번 실행한 뒤 Darkroom에서 두 부분을 이어 붙이세요.',
        },
      ],
      related: [
        {
          label: '동영상 자르기',
          to: '/tools/video-trimmer',
          description: '동영상도 똑같이 잘라요.',
        },
        {
          label: '동영상에서 오디오 추출',
          to: '/tools/extract-audio-from-video',
          description: '먼저 오디오를 꺼내세요.',
        },
        {
          label: '오디오 변환기',
          to: '/tools/audio-converter',
          description: '자주 쓰이는 모든 오디오 형식 간에 변환해요.',
        },
        {
          label: '오디오 속도 변경',
          to: '/tools/change-audio-speed',
          description: '녹음을 빠르게 하거나 느리게 해요.',
        },
        {
          label: '오디오 음높이 변경',
          to: '/tools/change-audio-pitch',
          description: '키를 올리거나 내려요.',
        },
        {
          label: '오디오 노멀라이즈',
          to: '/tools/normalize-audio',
          description: '음량을 고르게 맞춰요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: 'AI 노이즈 제거.',
        },
        {
          label: '노래에서 보컬 제거',
          to: '/tools/remove-vocals-from-song',
          description: '인스트루멘털을 만들어요.',
        },
      ],
      embed: {
        title: '오디오 파일 자르기',
        description: '오디오 파일을 업로드하고 오디오 자르기를 누른 뒤 파형 위의 시작·끝 마커를 끄세요. 원하면 기본 오디오 처리에서 페이드 인이나 페이드 아웃을 더하세요. 파일 변환을 누르세요.',
      },
    },
    'transcribe-audio': {
      name: '오디오 받아쓰기',
      h1: '온라인에서 오디오를 텍스트로 받아쓰기',
      tagline: '자체 GPU 서버의 AI 음성 인식으로 MP3, WAV, M4A 등 모든 녹음을 텍스트, 자막, JSON으로 변환해요.',
      metaTitle: '오디오를 텍스트로 온라인 받아쓰기 (무료 AI) | Media Manipulator',
      metaDescription: '무료 온라인 오디오 받아쓰기예요. MP3, WAV, M4A, OGG, FLAC 녹음을 일반 텍스트, VTT 또는 SRT 자막, 타임스탬프가 있는 JSON으로 변환하세요. 자체 GPU에서 실행되며 외부 AI를 쓰지 않아요.',
      ogTitle: '온라인에서 오디오를 텍스트로 받아쓰기',
      ogDescription: '녹음, 인터뷰, 음성 메모를 텍스트로 바꿔요. 무료이며 가입이 필요 없어요.',
      intro: '인터뷰, 강의, 음성 메모, 회의 녹음은 텍스트로 바꾸면 훨씬 쓸모가 많아져요. 검색하고, 인용하고, 번역할 수 있으니까요. Media Manipulator는 직접 운영하는 GPU 서버에서 Whisper 모델로 오디오를 받아쓰기 때문에 녹음이 저희 인프라 밖으로 나가지 않아요. 결과는 일반 텍스트, VTT 또는 SRT 자막, 단어별 타임스탬프가 있는 JSON 전사본으로 받을 수 있어요.',
      whatItDoes: [
        'Whisper로 MP3, WAV, M4A, OGG, FLAC 등 오디오를 받아써요.',
        '일반 텍스트, VTT, SRT, 타임스탬프가 있는 JSON으로 출력해요.',
        '수십 개 언어 중에서 언어를 자동으로 감지해요.',
        '자체 GPU에서 실행되며 외부 AI 제공업체를 쓰지 않아요.',
      ],
      flowSteps: [
        {
          title: '오디오 업로드',
          description: '자주 쓰이는 형식이면 모두 돼요.',
        },
        {
          title: '출력 선택',
          description: '텍스트, VTT, SRT, JSON.',
        },
        {
          title: '받아쓰기',
          description: '저희 GPU 서버에서 Whisper가 실행돼요.',
        },
        {
          title: '다운로드',
          description: '전사본 뷰어를 열거나 파일을 저장하세요.',
        },
      ],
      advancedDetails: [
        '대형 다국어 모델과 함께 whisper-ctranslate2를 사용해요. 배경 소음이 적은 또렷한 말소리에서 정확도가 가장 높아요.',
        '소음이 많은 녹음은 먼저 배경 소음 제거 도구로 정리하면 더 좋은 전사본을 얻을 수 있어요.',
        '받아쓰기는 일반 작업 횟수가 아니라 일일 AI 작업 횟수에서 AI 작업 한 건으로 계산돼요. 실패한 작업은 포함되지 않아요.',
      ],
      whyItMatters: [
        '텍스트는 검색하고 훑어볼 수 있지만 오디오는 그렇지 않아요.',
        '자막은 오디오 콘텐츠의 접근성을 높이고 검색에 잡히게 해 줘요.',
        '전사본은 노트, 기사, 번역의 출발점이에요.',
      ],
      useCases: [
        {
          title: '인터뷰 노트',
          description: '인용할 수 있는 텍스트를 얻어요.',
        },
        {
          title: '강의 전사본',
          description: '텍스트로 공부하고 용어를 검색해요.',
        },
        {
          title: '팟캐스트 자막',
          description: '동영상 버전용 SRT 또는 VTT.',
        },
        {
          title: '음성 메모를 텍스트로',
          description: '생각을 문서로 바꿔요.',
        },
      ],
      whyMediaManipulator: [
        'Whisper는 직접 운영하는 하드웨어에서 실행돼요. 오디오는 외부 AI로 절대 전송되지 않아요.',
        '네 가지 출력 형식과 내장 전사본 뷰어를 제공해요.',
      ],
      privacyNote: '녹음은 자체 GPU 서버의 Whisper가 받아쓰고, 텍스트는 작업과 함께 보관돼요. AI 작업은 직접 운영하는 하드웨어에서 실행되며 외부 AI 제공업체를 쓰지 않고, 업로드한 어떤 파일도 모델 학습에 쓰이지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: '어떤 언어를 지원하나요?',
          answer: 'Whisper는 수십 개 언어를 처리하고 언어를 자동으로 감지해요.',
        },
        {
          question: '얼마나 정확한가요?',
          answer: '또렷한 말소리에서는 매우 정확해요. 배경 소음, 겹치는 대화, 강한 억양은 정확도를 낮추니 가능하면 먼저 소음을 제거하세요.',
        },
        {
          question: '녹음이 OpenAI로 전송되나요?',
          answer: '아니요. 모델은 자체 GPU 서버에서 실행돼요.',
        },
        {
          question: '화자 라벨을 받을 수 있나요?',
          answer: '아직은 안 돼요. JSON 출력에는 구간을 나눌 때 쓸 수 있는 단어별 타임스탬프가 있어요.',
        },
        {
          question: '사용량에 포함되나요?',
          answer: '네, 일반 작업 횟수와는 별도인 AI 작업 횟수에서 AI 작업 한 건으로 계산돼요. 실패한 작업은 포함되지 않아요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'AI 작업 한 건으로 계산돼요. 실패한 작업은 포함되지 않아요.',
        ],
      },
      related: [
        {
          label: '동영상 텍스트 변환',
          to: '/tools/transcribe-video',
          description: '동영상 파일도 똑같이 받아써요.',
        },
        {
          label: 'SRT 자막 생성기',
          to: '/tools/srt-generator',
          description: '바로 자막으로 만들어요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: '먼저 오디오를 깨끗하게 만드세요.',
        },
        {
          label: '자막 번역기',
          to: '/tools/caption-translator',
          description: '자막을 번역해요.',
        },
      ],
      embed: {
        title: '오디오 파일 받아쓰기',
        description: '오디오 파일을 업로드하고 출력을 고르세요. 문서용은 일반 텍스트, 자막용은 VTT나 SRT, 타임스탬프용은 JSON이에요. Whisper는 저희 GPU 서버에서 실행되며 외부 AI로는 아무것도 전송되지 않아요.',
      },
    },
    'add-text-to-image': {
      name: '이미지에 텍스트 추가',
      h1: '온라인에서 무료로 이미지에 텍스트 추가',
      tagline: '사진에 캡션, 제목, 워터마크를 넣어요. 글꼴, 크기, 색상, 외곽선, 위치를 고른 뒤 다운로드하세요.',
      metaTitle: '이미지에 텍스트 온라인 무료 추가: 캡션, 워터마크 | Media Manipulator',
      metaDescription: '사진에 텍스트를 넣는 무료 온라인 도구예요. JPG, PNG, WebP 등에 넣을 캡션, 밈, 워터마크의 글꼴, 크기, 색상, 외곽선, 위치를 고르세요. 가입이 필요 없어요.',
      ogTitle: '온라인에서 무료로 이미지에 텍스트 추가',
      ogDescription: '어떤 사진에든 캡션, 제목, 워터마크를 넣어요. 무료이며 가입이 필요 없어요.',
      intro: '스크린샷의 캡션, 썸네일의 제목, 사진 모서리의 저작권 문구처럼, 텍스트 추가는 자르기 다음으로 흔한 이미지 편집이에요. Media Manipulator는 저희 서버에서 ImageMagick으로 이미지에 텍스트를 그려 넣어요. 글꼴, 크기, 글자색과 외곽선 색을 정하고, 위치는 아홉 개 앵커 중에서 고르거나 정확한 픽셀 좌표로 지정할 수 있으며, 같은 형식이나 다른 형식으로 내보낼 수 있어요.',
      whatItDoes: [
        '텍스트 블록 하나를 원하는 크기와 글자색, 외곽선 색으로 그려요.',
        '기본 제공 글꼴 여섯 가지(산세리프, 세리프, 고정폭을 각각 두 계열씩).',
        '아홉 개 앵커 위치 또는 정확한 x/y 배치.',
        '같은 처리 과정에서 크기 조절, 자르기, 필터, 메타데이터 옵션과 함께 적용할 수 있어요.',
      ],
      flowSteps: [
        {
          title: '이미지 업로드',
          description: 'JPG, PNG, WebP, HEIC 등.',
        },
        {
          title: '텍스트 입력과 스타일 지정',
          description: '크기, 색상, 외곽선, 글꼴, 위치.',
        },
        {
          title: '변환',
          description: 'ImageMagick이 텍스트를 그려요.',
        },
        {
          title: '다운로드',
          description: '캡션을 넣은 이미지를 저장하세요.',
        },
      ],
      advancedDetails: [
        '텍스트는 출력 크기에 맞춰 래스터화돼요. 글자 크기는 이미지 너비를 기준으로 픽셀 단위로 정하세요.',
        '대비되는 색으로 2~4 px 외곽선을 넣으면 복잡한 사진 위에서도 텍스트가 잘 읽혀요.',
        '워터마크 템플릿용으로 투명 배경을 유지하려면 PNG 출력을 고르세요.',
      ],
      whyItMatters: [
        '캡션이 있으면 스크린샷만 봐도 내용을 알 수 있어요.',
        '눈에 보이는 저작권 문구는 출처 없는 재게시를 막아 줘요.',
        '제목이 있는 썸네일이 더 많은 클릭을 받아요.',
      ],
      useCases: [
        {
          title: '스크린샷에 캡션 달기',
          description: '보는 사람이 무엇을 보고 있는지 표시해요.',
        },
        {
          title: '사진에 워터마크 넣기',
          description: '아래쪽 모서리에 내 이름을 넣어요.',
        },
        {
          title: '썸네일 제목',
          description: '동영상 썸네일에 크고 굵은 텍스트를 넣어요.',
        },
        {
          title: '밈',
          description: '위에 한 줄, 아래에 한 줄.',
        },
      ],
      whyMediaManipulator: [
        '단순한 텍스트 상자가 아니라 글자색, 외곽선, 글꼴, 아홉 지점 배치까지 지원해요.',
        '한 번 업로드로 크기 조절, 자르기, 변환까지 할 수 있어요.',
      ],
      privacyNote: '입력한 텍스트는 저희 서버의 ImageMagick이 이미지 위에 그려요. 외부 서비스로는 아무것도 전송되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 원본은 절대 바뀌지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: '여러 줄을 넣을 수 있나요?',
          answer: '한 번에 텍스트 블록 하나만 넣을 수 있어요. 텍스트에 줄바꿈을 넣으면 새 줄로 그려져요. 두 번째 블록은 도구를 다시 실행해서 넣으세요.',
        },
        {
          question: '내 글꼴을 쓸 수 있나요?',
          answer: '기본 제공 글꼴 여섯 가지를 쓸 수 있어요. 사용자 글꼴 업로드는 지원하지 않아요.',
        },
        {
          question: '텍스트 위치를 정확히 정하려면 어떻게 하나요?',
          answer: '앵커를 고르고 x/y 오프셋을 픽셀 단위로 더하세요.',
        },
        {
          question: '화질이 떨어지나요?',
          answer: '이미지는 다시 인코딩돼요. 선명하게 유지하려면 PNG나 높은 JPG 품질을 고르세요.',
        },
      ],
      related: [
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: '이미지 형식 간에 변환해요.',
        },
        {
          label: '이미지 자르기',
          to: '/tools/crop-image',
          description: '원하는 영역만 잘라요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '크기를 바꿔요.',
        },
        {
          label: '이미지 필터',
          to: '/tools/image-filters',
          description: '세피아, 스케치, 엠보스 등.',
        },
        {
          label: 'EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '위치와 기기 데이터를 지워요.',
        },
      ],
      embed: {
        title: '이미지에 텍스트 추가하기',
        description: '이미지를 업로드하세요. 텍스트 오버레이 섹션이 강조 표시돼 있어요. 텍스트를 입력하고 크기, 색상, 외곽선, 글꼴, 위치(아홉 개 앵커 지점 또는 정확한 좌표)를 설정하세요. 파일 변환을 누르세요.',
      },
    },
    'crop-image': {
      name: '이미지 자르기',
      h1: '온라인에서 무료로 이미지 자르기',
      tagline: '사진에서 원하는 부분 위로 상자를 끌어 구도를 바로잡고, 그 영역만 원하는 형식으로 다운로드하세요.',
      metaTitle: '이미지 온라인 무료 자르기 | Media Manipulator',
      metaDescription: '무료 온라인 이미지 자르기 도구예요. JPG, PNG, WebP, HEIC 사진에서 원하는 영역을 끌어서 선택하고 다운로드하세요. 크기 조절, 필터, 형식 변환과 함께 쓸 수 있어요. 가입이 필요 없어요.',
      ogTitle: '온라인에서 무료로 이미지 자르기',
      ogDescription: '상자를 끌어 그 영역을 다운로드하세요. 무료이며 가입이 필요 없어요.',
      intro: '자르기는 구도를 바로잡고, 가장자리의 잡다한 요소를 없애고, 사진을 더 꽉 찬 구도로 바꿔 줘요. Media Manipulator는 업로드한 이미지 위에 시각적 자르기 도구를 열고, 저희 서버에서 ImageMagick으로 자른 뒤, 같은 처리 과정에서 결과의 크기를 조절하고 필터를 적용하고 변환할 수 있게 해요.',
      whatItDoes: [
        '실제 이미지 위에 끌 수 있는 핸들이 달린 시각적 자르기 상자.',
        '정확한 자르기 좌표를 보여 주고 직접 수정할 수도 있어요.',
        '자른 다음 목표 너비와 높이로 크기를 조절할 수 있어요.',
        '자른 영역을 JPG, PNG, WebP, AVIF, GIF로 저장하세요.',
      ],
      flowSteps: [
        {
          title: '이미지 업로드',
          description: '자주 쓰이는 형식이면 모두 돼요.',
        },
        {
          title: '자를 영역 그리기',
          description: '상자와 핸들을 끌어요.',
        },
        {
          title: '변환',
          description: 'ImageMagick이 자르고 인코딩해요.',
        },
        {
          title: '다운로드',
          description: '잘라 낸 이미지를 저장하세요.',
        },
      ],
      advancedDetails: [
        '자르기는 크기 조절보다 먼저 적용돼요. 그래서 4000 px 사진을 1000 px로 자르고 500 px로 크기를 조절하면 축소는 한 번만 일어나요.',
        '자르기는 픽셀을 없애므로 되돌릴 수 없어요. 원본을 보관하세요.',
        'EXIF 방향 정보를 반영하므로 회전된 휴대폰 사진도 보이는 그대로 잘려요.',
      ],
      whyItMatters: [
        '구도를 더 꽉 차게 잡는 것이 대부분의 사진을 가장 빠르게 개선하는 방법이에요.',
        '프로필 사진과 썸네일에는 특정 영역과 비율이 필요해요.',
        '지나가는 사람이나 번호판을 잘라 내는 것은 개인정보를 지키는 방법이에요.',
      ],
      useCases: [
        {
          title: '프로필 사진',
          description: '얼굴에 맞춰 잘라요.',
        },
        {
          title: '잡다한 요소 없애기',
          description: '사진 가장자리를 덜어 내요.',
        },
        {
          title: '스크린샷 세부',
          description: '필요한 부분만 남겨요.',
        },
        {
          title: '제품 사진',
          description: '꽉 차게 자른 뒤 판매 페이지에 맞게 크기를 조절해요.',
        },
      ],
      whyMediaManipulator: [
        '정확한 좌표를 보여 주는 시각적 자르기 도구에, 같은 처리 과정에서 크기 조절과 변환까지.',
        '메타데이터는 원하는 대로 유지하거나 삭제해요.',
      ],
      privacyNote: '이미지는 저희 서버의 ImageMagick이 선택한 영역으로 잘라요. 외부 서비스로는 아무것도 전송되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 원본은 절대 바뀌지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: '고정 비율로 자를 수 있나요?',
          answer: '원하는 비율이 되도록 상자를 끌어 보세요. 끄는 동안 너비와 높이가 표시돼요.',
        },
        {
          question: '자르면 화질이 떨어지나요?',
          answer: '남은 픽셀은 그대로예요. 다시 인코딩할 때는 PNG나 높은 JPG 품질을 고르세요.',
        },
        {
          question: '동영상도 자를 수 있나요?',
          answer: '네, 동영상 화면 자르기 도구를 사용하세요.',
        },
        {
          question: '먼저 회전할 수 있나요?',
          answer: '이미지 회전 도구를 사용한 다음 자르세요.',
        },
      ],
      related: [
        {
          label: '동영상 화면 자르기',
          to: '/tools/crop-video',
          description: '동영상도 똑같이 잘라요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: '이미지 형식 간에 변환해요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '크기를 바꿔요.',
        },
        {
          label: '이미지에 텍스트 추가',
          to: '/tools/add-text-to-image',
          description: '캡션이나 워터마크를 넣어요.',
        },
        {
          label: '이미지 필터',
          to: '/tools/image-filters',
          description: '세피아, 스케치, 엠보스 등.',
        },
        {
          label: 'EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '위치와 기기 데이터를 지워요.',
        },
      ],
      embed: {
        title: '이미지 자르기',
        description: '이미지를 업로드하고 이미지 자르기를 눌러 시각적 자르기 도구를 여세요. 원하는 영역으로 상자를 끈 다음 저장하세요. 자르기는 파일 변환을 누를 때 적용돼요.',
      },
    },
    'grayscale-image': {
      name: '이미지를 흑백으로 변환',
      h1: '온라인에서 이미지를 흑백으로 변환',
      tagline: '컬러 사진을 그레이스케일이나 빈티지 느낌의 세피아로 바꾸고 원하는 형식으로 다운로드하세요.',
      metaTitle: '이미지를 흑백으로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 흑백 사진 변환기예요. JPG, PNG, WebP, HEIC 이미지를 그레이스케일이나 세피아로 바꾸고 다운로드하세요. 자르기, 크기 조절, 형식 변경과 함께 쓸 수 있어요. 가입이 필요 없어요.',
      ogTitle: '온라인에서 이미지를 흑백으로 변환',
      ogDescription: '클릭 한 번으로 흑백 또는 세피아로 바꿔요. 무료이며 가입이 필요 없어요.',
      intro: '흑백은 사진에서 빛, 형태, 질감만 남기고, 색 틀어짐과 섞인 조명을 감추며, 사진 묶음에 일관된 분위기를 줘요. Media Manipulator는 저희 서버에서 ImageMagick으로 휘도 가중치를 적용해 그레이스케일로 변환하고, 세피아와 빈티지 톤도 제공하며, 어떤 이미지 형식으로든 내보내요.',
      whatItDoes: [
        '올바른 휘도 가중치로 컬러 이미지를 그레이스케일로 변환해요.',
        '따뜻하거나 오래된 느낌을 위한 세피아와 빈티지 옵션.',
        '자르기, 크기 조절, 텍스트, 형식 변환과 함께 적용할 수 있어요.',
        '흑백 결과물은 JPG, PNG, WebP, AVIF, GIF로 받을 수 있어요.',
      ],
      flowSteps: [
        {
          title: '이미지 업로드',
          description: '자주 쓰이는 형식이면 모두 돼요.',
        },
        {
          title: '흑백 유지 또는 세피아 선택',
          description: '필터가 미리 선택돼 있어요.',
        },
        {
          title: '변환',
          description: 'ImageMagick이 변환을 적용해요.',
        },
        {
          title: '다운로드',
          description: '결과를 저장하세요.',
        },
      ],
      advancedDetails: [
        '그레이스케일은 Rec. 709 휘도 가중치를 사용하므로, 눈이 느끼는 대로 녹색이 파란색보다 밝게 보여요.',
        '세피아는 그레이스케일 뒤에 톤을 입히고, 빈티지는 약간 바랜 느낌과 비네트를 더해요.',
        '그레이스케일을 그대로 저장하는 형식을 고르지 않으면 출력은 세 채널을 유지해요.',
      ],
      whyItMatters: [
        '흑백은 좋지 않은 색감과 섞인 조명을 감춰 줘요.',
        '일관된 흑백 사진 묶음은 잘 골라 다듬은 것처럼 보여요.',
        '그레이스케일 이미지는 더 작게 압축돼요.',
      ],
      useCases: [
        {
          title: '인물 사진',
          description: '클래식한 흑백 프로필 사진.',
        },
        {
          title: '문서 스캔',
          description: '촬영한 페이지를 그레이스케일로 바꿔요.',
        },
        {
          title: '빈티지 느낌',
          description: '가족사진에 세피아를 입혀요.',
        },
        {
          title: '인쇄',
          description: '흑백 프린터용으로 준비해요.',
        },
      ],
      whyMediaManipulator: [
        '휘도를 정확히 반영한 그레이스케일과 세피아, 빈티지를 제공해요.',
        '한 번 업로드로 자르기, 크기 조절, 변환까지 할 수 있어요.',
      ],
      privacyNote: '이미지의 색은 저희 서버의 ImageMagick이 제거해요. 외부 서비스로는 아무것도 전송되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 원본은 절대 바뀌지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: '그레이스케일과 채도 제거, 무엇이 다른가요?',
          answer: '이 도구는 휘도 가중치를 적용한 그레이스케일이라서 단순히 채도를 없애는 것보다 더 자연스러워 보여요.',
        },
        {
          question: '세피아 톤으로 만들 수 있나요?',
          answer: '네. 필터 선택 목록에서 세피아나 빈티지를 고르세요.',
        },
        {
          question: '동영상에도 할 수 있나요?',
          answer: '네. 동영상 밝기 및 색상 조정에서 채도를 -100으로 설정하세요.',
        },
        {
          question: '원래 색을 되살릴 수 있나요?',
          answer: '아니요. 원본 파일을 보관하세요.',
        },
      ],
      related: [
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: '이미지 형식 간에 변환해요.',
        },
        {
          label: '이미지 자르기',
          to: '/tools/crop-image',
          description: '원하는 영역만 잘라요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '크기를 바꿔요.',
        },
        {
          label: '이미지에 텍스트 추가',
          to: '/tools/add-text-to-image',
          description: '캡션이나 워터마크를 넣어요.',
        },
        {
          label: '이미지 필터',
          to: '/tools/image-filters',
          description: '세피아, 스케치, 엠보스 등.',
        },
        {
          label: 'EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '위치와 기기 데이터를 지워요.',
        },
      ],
      embed: {
        title: '이미지를 흑백으로 변환하기',
        description: '이미지를 업로드하세요. 필터가 흑백으로 미리 설정돼 있어요. 더 따뜻한 톤을 원하면 세피아나 빈티지로 바꾸세요. 파일 변환을 누르세요.',
      },
    },
    'image-filters': {
      name: '이미지 필터 & 효과',
      h1: '온라인에서 이미지에 필터와 효과 적용하기',
      tagline: '유화, 스케치, 목탄, 엠보스, 빈티지, 소용돌이, 흐림, 선명하게 등의 효과를 어떤 사진에든 클릭 한 번으로 적용해요.',
      metaTitle: '무료 온라인 이미지 필터: 스케치, 유화, 엠보스 | Media Manipulator',
      metaDescription: '무료 온라인 사진 필터예요. JPG, PNG, WebP 등의 이미지에 유화, 연필 스케치, 목탄, 엠보스, 빈티지, 세피아, 소용돌이, 흐림, 선명하게 효과를 적용한 뒤 다운로드하세요. 가입이 필요 없어요.',
      ogTitle: '온라인에서 이미지에 필터와 효과 적용하기',
      ogDescription: '스케치, 유화, 엠보스, 빈티지 등. 무료이며 가입이 필요 없어요.',
      intro: '사진이 다른 무언가가 되고 싶어 할 때가 있어요. 초대장에 넣을 스케치, 인쇄용 유화, 엠보스 처리한 로고, 소용돌이치는 추상화처럼요. Media Manipulator는 연필 스케치부터 선명하게까지 ImageMagick의 예술 필터와 보정 필터를 저희 서버에서 적용하고 원하는 이미지 형식으로 내보내요. 같은 작업에서 자르기, 크기 조절, 캡션 넣기도 함께 할 수 있어요.',
      whatItDoes: [
        '예술 효과: 유화, 스케치, 목탄, 엠보스, 빈티지, 세피아, 소용돌이, 배럴 왜곡.',
        '보정 효과: 흐림, 선명하게, 흑백.',
        '같은 선택 목록에서 45, 90, 180, 270도 회전도 할 수 있어요.',
        '자르기, 크기 조절, 텍스트 오버레이, 형식 변환과 함께 쓸 수 있어요.',
      ],
      flowSteps: [
        {
          title: '이미지 업로드',
          description: '일반적인 형식이면 무엇이든 돼요.',
        },
        {
          title: '필터 선택',
          description: '유화가 미리 선택되어 있어요.',
        },
        {
          title: '변환',
          description: 'ImageMagick이 효과를 렌더링해요.',
        },
        {
          title: '다운로드',
          description: '결과를 저장하세요.',
        },
      ],
      advancedDetails: [
        '유화와 목탄은 반경 기반이라 이미지 크기에 따라 효과가 달라져요. 가장 강한 효과를 원하면 1500~2500 px로 크기를 조절하세요.',
        '스케치와 엠보스는 윤곽이 뚜렷하고 대비가 좋은 이미지에서 가장 잘 어울려요.',
        '효과는 픽셀에 직접 렌더링되니 원본은 따로 보관해 두세요.',
      ],
      whyItMatters: [
        '스타일을 입힌 이미지는 사진이 가득한 피드에서 눈에 띄어요.',
        '스케치나 그림 느낌은 카드, 포스터, 인쇄물에 흔히 쓰여요.',
        '선명하게와 흐림은 일상적인 보정이에요.',
      ],
      useCases: [
        {
          title: '연필 초상화',
          description: '카드에 넣을 사진에 스케치 필터를 적용해요.',
        },
        {
          title: '그림 같은 인쇄물',
          description: '캔버스 인쇄용 유화 효과.',
        },
        {
          title: '엠보스 로고',
          description: '평면 로고에 엠보스를 입혀요.',
        },
        {
          title: '스캔본 선명하게',
          description: '흐릿한 스캔본의 윤곽을 살려요.',
        },
      ],
      whyMediaManipulator: [
        '열두 가지 예술 필터와 보정 필터를 하나의 선택 목록에서 고를 수 있어요.',
        '한 번 업로드로 자르기, 크기 조절, 캡션, 변환까지 할 수 있어요.',
      ],
      privacyNote: '선택한 필터는 저희 서버의 ImageMagick이 이미지에 적용해요. 외부 서비스로는 아무것도 전송되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 원본은 절대 바뀌지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: '강도를 조절할 수 있나요?',
          answer: '필터는 미리 조정된 고정 강도를 사용해요. 반경 기반 효과가 얼마나 강하게 보일지 바꾸려면 이미지를 더 크게 또는 더 작게 조절하세요.',
        },
        {
          question: '필터를 여러 개 겹칠 수 있나요?',
          answer: '한 번에 필터 하나씩 적용돼요. 두 번째 필터를 쓰려면 결과물을 도구에 다시 넣으세요.',
        },
        {
          question: 'AI 스타일 변환 기능이 있나요?',
          answer: '아니요. 모두 즉시 실행되는 고전적인 ImageMagick 효과예요.',
        },
        {
          question: '로고에는 어떤 필터가 좋나요?',
          answer: '대비가 높은 로고에 엠보스나 목탄을 써 보세요.',
        },
      ],
      related: [
        {
          label: '흑백 변환',
          to: '/tools/grayscale-image',
          description: '그레이스케일과 세피아.',
        },
        {
          label: '이미지 흐리게',
          to: '/tools/blur-image',
          description: '부드럽게 하거나 가려요.',
        },
        {
          label: '이미지 선명하게',
          to: '/tools/sharpen-image',
          description: '디테일을 살려요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: '이미지 형식 간에 변환해요.',
        },
        {
          label: '이미지 자르기',
          to: '/tools/crop-image',
          description: '원하는 영역만 잘라요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '크기를 바꿔요.',
        },
        {
          label: '이미지에 텍스트 추가',
          to: '/tools/add-text-to-image',
          description: '캡션이나 워터마크.',
        },
        {
          label: 'EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '위치와 기기 데이터를 제거해요.',
        },
      ],
      embed: {
        title: '이미지에 필터 적용하기',
        description: '이미지를 업로드하고 필터를 고르세요. 유화가 미리 선택되어 있어요. 스케치, 목탄, 엠보스, 빈티지, 세피아, 소용돌이, 배럴 왜곡, 흐림, 선명하게를 쓸 수 있어요. 변환을 누르세요.',
      },
    },
    'rotate-image': {
      name: '이미지 회전',
      h1: '온라인에서 무료로 이미지 회전하기',
      tagline: '사진을 90°, 180°, 270° 회전해 옆으로 누운 스캔본이나 휴대폰 사진을 바로잡고 원하는 형식으로 다운로드하세요.',
      metaTitle: '무료 온라인 이미지 회전 (90°, 180°, 270°) | Media Manipulator',
      metaDescription: '무료 온라인 이미지 회전 도구예요. JPG, PNG, WebP, HEIC 사진을 90, 180, 270도로, 또는 기울이려면 45도로 회전하고 다운로드하세요. 회전은 픽셀에 직접 적용돼요. 가입이 필요 없어요.',
      ogTitle: '온라인에서 무료로 이미지 회전하기',
      ogDescription: '옆으로 누운 사진을 클릭 한 번으로 바로잡으세요. 무료이며 가입이 필요 없어요.',
      intro: '휴대폰은 방향을 태그로 기록하는데 일부 뷰어는 이 태그를 무시하고, 스캐너와 오래된 카메라는 아예 잘못 기록하기도 해요. 픽셀 자체를 회전하면 문제가 완전히 해결돼요. Media Manipulator는 저희 서버의 ImageMagick으로 이미지를 90, 180, 270, 45도 회전하는데, 기존 방향 태그를 먼저 반영한 뒤 원하는 형식으로 내보내요.',
      whatItDoes: [
        '90°(시계 방향), 180°, 270°(반시계 방향), 45°로 회전해요.',
        '회전을 픽셀에 직접 적용하고 EXIF 방향 태그를 지워요.',
        '자르기, 크기 조절, 형식 변환과 함께 쓸 수 있어요.',
        '회전한 이미지를 JPG, PNG, WebP, AVIF, GIF로 저장해요.',
      ],
      flowSteps: [
        {
          title: '이미지 업로드',
          description: '일반적인 형식이면 무엇이든 돼요.',
        },
        {
          title: '각도 선택',
          description: '90°가 미리 선택되어 있어요.',
        },
        {
          title: '변환',
          description: 'ImageMagick이 회전하고 인코딩해요.',
        },
        {
          title: '다운로드',
          description: '똑바로 선 이미지를 저장하세요.',
        },
      ],
      advancedDetails: [
        '기존 EXIF 방향이 먼저 적용되므로 화면에 보이는 그대로 회전돼요.',
        '45° 회전은 모서리에 배경 채우기가 추가돼요. 필요하면 나중에 자르세요.',
        '좌우나 상하로 반전하려면 대신 뒤집기·미러 도구를 사용하세요.',
      ],
      whyItMatters: [
        '옆으로 누운 사진은 포럼과 신청 양식에서 가장 흔한 업로드 불만이에요.',
        '방향 태그를 무시하는 앱도 있어서, 픽셀에 회전을 적용하는 것만이 확실한 해결책이에요.',
        '스캔본과 오래된 카메라 파일에는 태그가 아예 없는 경우가 많아요.',
      ],
      useCases: [
        {
          title: '옆으로 누운 휴대폰 사진',
          description: '90° 회전해 어디서나 똑바로 보이게 해요.',
        },
        {
          title: '거꾸로 된 스캔본',
          description: '180° 회전해요.',
        },
        {
          title: '양식 업로드 바로잡기',
          description: '문서 사진을 제출하기 전에 회전해요.',
        },
        {
          title: '기울어진 효과',
          description: '디자인 요소용으로 45° 회전해요.',
        },
      ],
      whyMediaManipulator: [
        '방향 태그를 올바르게 처리하면서 회전을 픽셀에 적용해요.',
        '한 번 업로드로 자르기, 크기 조절, 변환까지 할 수 있어요.',
      ],
      privacyNote: '이미지는 저희 서버의 ImageMagick이 선택한 각도만큼 회전해요. 외부 서비스로는 아무것도 전송되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 원본은 절대 바뀌지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: '휴대폰에서는 똑바로 보이는데 다른 곳에서는 왜 옆으로 누워 보이나요?',
          answer: '휴대폰이 방향 태그를 기록했는데 다른 앱이 그 태그를 무시하기 때문이에요. 여기서 회전하면 방향이 픽셀에 직접 적용돼요.',
        },
        {
          question: '회전하면 화질이 떨어지나요?',
          answer: '90° 단위 회전은 기하학적으로 손실이 없고, 다시 인코딩하는 과정만 영향을 줘요. PNG나 높은 JPG 품질을 사용하세요.',
        },
        {
          question: '원하는 각도로 자유롭게 회전할 수 있나요?',
          answer: '45°와 90° 단위 각도만 제공해요.',
        },
        {
          question: '대신 좌우 반전할 수 있나요?',
          answer: '여기서는 안 돼요. 이미지 좌우 반전은 현재 제공하지 않아요.',
        },
      ],
      related: [
        {
          label: '동영상 회전',
          to: '/tools/rotate-video',
          description: '동영상도 똑같이 회전해요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: '이미지 형식 간에 변환해요.',
        },
        {
          label: '이미지 자르기',
          to: '/tools/crop-image',
          description: '원하는 영역만 잘라요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '크기를 바꿔요.',
        },
        {
          label: '이미지에 텍스트 추가',
          to: '/tools/add-text-to-image',
          description: '캡션이나 워터마크.',
        },
        {
          label: '이미지 필터',
          to: '/tools/image-filters',
          description: '세피아, 스케치, 엠보스 등.',
        },
        {
          label: 'EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '위치와 기기 데이터를 제거해요.',
        },
      ],
      embed: {
        title: '이미지 회전하기',
        description: '이미지를 업로드하세요. 필터 선택이 90° 회전으로 미리 설정되어 있으니, 원하면 180°, 270°, 45°를 고르세요. 회전이 픽셀에 적용되므로 어떤 뷰어에서든 똑같이 보여요. 변환을 누르세요.',
      },
    },
    'sharpen-image': {
      name: '이미지 선명하게',
      h1: '온라인에서 무료로 이미지 선명하게 만들기',
      tagline: '약간 흐릿한 사진이나 스캔본의 윤곽을 클릭 한 번으로 또렷하게 만들고 원하는 형식으로 다운로드하세요.',
      metaTitle: '무료 온라인 이미지 선명하게 | Media Manipulator',
      metaDescription: '무료 온라인 이미지 선명화 도구예요. 흐릿한 JPG, PNG, WebP, HEIC 사진이나 스캔본을 또렷하게 만들고 다운로드하세요. 실제 디테일을 복구하려면 AI 이미지 복원을 사용해 보세요. 가입이 필요 없어요.',
      ogTitle: '온라인에서 무료로 이미지 선명하게 만들기',
      ogDescription: '흐릿한 사진을 클릭 한 번으로 또렷하게. 무료이며 가입이 필요 없어요.',
      intro: '느린 렌즈, 크기 조절, 스캐너 때문에 살짝 흐릿해진 사진은 윤곽의 대비를 높이는 선명화 처리로 좋아져요. Media Manipulator는 저희 서버의 ImageMagick으로 언샤프 마스크 선명화를 적용하고 원하는 형식으로 내보내요. 살짝 흐릿한 정도를 넘어선 흐림이라면, AI 이미지 복원 도구가 선명화로는 되살릴 수 없는 디테일을 복구해요.',
      whatItDoes: [
        '미리 조정된 언샤프 마스크 선명화를 어떤 이미지에든 적용해요.',
        '크기 조절과 함께 쓸 수 있어요. 축소한 뒤 선명하게 하면 썸네일이 또렷해져요.',
        '선명해진 결과를 JPG, PNG, WebP, AVIF, GIF로 다운로드하세요.',
        '원본과 결과를 나란히 비교해요.',
      ],
      flowSteps: [
        {
          title: '이미지 업로드',
          description: '일반적인 형식이면 무엇이든 돼요.',
        },
        {
          title: '선명하게 선택 유지',
          description: '원하면 크기 조절을 추가하세요.',
        },
        {
          title: '변환',
          description: 'ImageMagick이 언샤프 마스크를 적용해요.',
        },
        {
          title: '다운로드',
          description: '더 또렷해진 이미지를 저장하세요.',
        },
      ],
      advancedDetails: [
        '선명화는 윤곽의 국소 대비를 높일 뿐 디테일을 더하지는 않아요. 지나치게 선명하게 하면 윤곽 주위에 후광이 생겨요.',
        '축소한 다음 선명하게 하는 것이 웹용 이미지를 또렷하게 만드는 전형적인 방법이에요.',
        '움직임 흐림, 초점 흐림, 저해상도 원본에는 AI 이미지 복원을 사용하세요.',
      ],
      whyItMatters: [
        '축소한 이미지는 윤곽 대비를 잃어서 선명화 없이는 흐릿해 보여요.',
        '문서와 인쇄물 스캔본은 대개 약간 흐릿해요.',
        '또렷한 이미지는 더 고품질로 보여요.',
      ],
      useCases: [
        {
          title: '썸네일',
          description: '웹용으로 크기를 조절하고 선명하게 해요.',
        },
        {
          title: '흐릿한 스캔본',
          description: '스캔한 인쇄물을 또렷하게 만들어요.',
        },
        {
          title: '제품 사진',
          description: '판매 등록 전에 윤곽을 뚜렷하게 해요.',
        },
        {
          title: '살짝 빗나간 초점',
          description: '체감 선명도를 조금 되살려요.',
        },
      ],
      whyMediaManipulator: [
        '미리 조정된 언샤프 마스크와 크기 조절을 한 번에 처리해요.',
        '선명화로 부족할 때는 AI 복원을 쓸 수 있어요.',
      ],
      privacyNote: '이미지는 저희 서버의 ImageMagick이 설정한 강도로 선명하게 만들어요. 외부 서비스로는 아무것도 전송되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 원본은 절대 바뀌지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: '흐릿한 사진을 고칠 수 있나요?',
          answer: '가볍게 흐릿한 사진에는 도움이 돼요. 제대로 흐린 사진에는 디테일을 재구성하는 AI 이미지 복원을 사용하세요.',
        },
        {
          question: '강도를 조절할 수 있나요?',
          answer: '강도는 미리 조정된 고정값이에요. 더 강하게 하려면 두 번 실행하거나, 출력 크기를 더 작게 해서 상대적으로 더 강한 효과를 내세요.',
        },
        {
          question: '노이즈가 생기나요?',
          answer: '선명화는 기존 그레인을 강조할 수 있어요. 노이즈가 더 쌓이지 않도록 높은 JPG 품질을 사용하세요.',
        },
      ],
      related: [
        {
          label: 'AI 이미지 복원',
          to: '/tools/ai-image-restoration',
          description: 'AI로 실제 디테일을 복구해요.',
        },
        {
          label: 'AI 이미지 업스케일러',
          to: '/tools/ai-image-upscaler',
          description: '흐려지지 않게 확대해요.',
        },
        {
          label: '이미지 흐리게',
          to: '/tools/blur-image',
          description: '반대 기능이에요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: '이미지 형식 간에 변환해요.',
        },
        {
          label: '이미지 자르기',
          to: '/tools/crop-image',
          description: '원하는 영역만 잘라요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '크기를 바꿔요.',
        },
        {
          label: '이미지에 텍스트 추가',
          to: '/tools/add-text-to-image',
          description: '캡션이나 워터마크.',
        },
        {
          label: '이미지 필터',
          to: '/tools/image-filters',
          description: '세피아, 스케치, 엠보스 등.',
        },
        {
          label: 'EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '위치와 기기 데이터를 제거해요.',
        },
      ],
      embed: {
        title: '이미지 선명하게 만들기',
        description: '이미지를 업로드하세요. 필터가 선명하게로 미리 설정되어 있어요. 변환을 누르고 뷰어에서 결과를 원본과 비교해 보세요.',
      },
    },
    'blur-image': {
      name: '이미지 흐리게',
      h1: '온라인에서 무료로 이미지 흐리게 하기',
      tagline: '사진 전체를 부드럽게 흐려 배경, 플레이스홀더, 개인정보 보호용으로 쓰고 원하는 형식으로 다운로드하세요.',
      metaTitle: '무료 온라인 이미지 흐리게 | Media Manipulator',
      metaDescription: '무료 온라인 이미지 흐림 도구예요. JPG, PNG, WebP, HEIC 사진 전체를 부드럽게 흐려 배경, 플레이스홀더, 개인정보 가림막으로 쓰세요. 얼굴만 흐리게 하려면 얼굴 흐림 도구를 사용하세요. 가입이 필요 없어요.',
      ogTitle: '온라인에서 무료로 이미지 흐리게 하기',
      ogDescription: '사진을 클릭 한 번으로 부드럽게. 무료이며 가입이 필요 없어요.',
      intro: '흐린 사진은 텍스트 뒤의 차분한 배경, 실제 이미지가 로드되는 동안 보여 줄 디테일이 적은 플레이스홀더, 스크린샷의 개인정보 가림막이 돼요. Media Manipulator는 저희 서버의 ImageMagick으로 이미지 전체에 가우시안 흐림을 적용하고 원하는 형식으로 내보내요. 얼굴이나 번호판만 흐리게 하려면 AI 얼굴 흐림 도구와 텍스트 가리기 도구가 해당 영역만 처리해요.',
      whatItDoes: [
        '이미지 전체에 가우시안 흐림을 적용해요.',
        '크기 조절과 함께 쓰면 아주 작은 흐린 플레이스홀더를 만들 수 있어요.',
        '부드러워진 이미지는 JPG, PNG, WebP, AVIF, GIF로 받아요.',
        '관련 도구로 얼굴만 흐리게 하거나 텍스트만 골라 가릴 수 있어요.',
      ],
      flowSteps: [
        {
          title: '이미지 업로드',
          description: '일반적인 형식이면 무엇이든 돼요.',
        },
        {
          title: '흐림 선택 유지',
          description: '원하면 크기를 조절하세요.',
        },
        {
          title: '변환',
          description: 'ImageMagick이 흐리게 처리하고 인코딩해요.',
        },
        {
          title: '다운로드',
          description: '부드러워진 이미지를 저장하세요.',
        },
      ],
      advancedDetails: [
        '흐림 반경은 고정이에요. 더 강한 효과를 원하면 먼저 크기를 줄이고, 흐리게 한 다음, 다시 키우세요.',
        '흐린 이미지는 아주 작게 압축되기 때문에 플레이스홀더로 쓰기 좋아요.',
        '흐리게 한 스크린샷은 가리기가 아니에요. 텍스트가 복원될 수도 있어요. 민감한 내용에는 텍스트 가리기를 사용하세요.',
      ],
      whyItMatters: [
        '흐린 배경은 위에 얹은 텍스트를 읽기 쉽게 해 줘요.',
        '저화질 이미지 플레이스홀더는 체감 페이지 속도를 높여요.',
        '사진을 부드럽게 만든 버전은 흔히 쓰이는 디자인 요소예요.',
      ],
      useCases: [
        {
          title: '텍스트 배경',
          description: '제목을 얹을 사진을 흐리게 해요.',
        },
        {
          title: '플레이스홀더',
          description: '지연 로딩용 작은 흐린 미리보기.',
        },
        {
          title: '개인정보 가림막',
          description: '공유하기 전에 스크린샷을 흐리게 한 다음, 제대로 가리세요.',
        },
        {
          title: '몽환적인 효과',
          description: '디자인용 부드러운 오버레이.',
        },
      ],
      whyMediaManipulator: [
        '여기서는 이미지 전체를 흐리게 하고, 얼굴 흐림과 텍스트 가리기는 전용 AI 도구로 제공해요.',
        '한 번 업로드로 크기 조절과 변환까지 할 수 있어요.',
      ],
      privacyNote: '이미지는 저희 서버의 ImageMagick이 설정한 반경으로 흐리게 처리해요. 외부 서비스로는 아무것도 전송되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 원본은 절대 바뀌지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: '이미지 일부만 흐리게 할 수 있나요?',
          answer: '얼굴은 "사진 속 얼굴 흐리게 처리"를, 텍스트와 번호판은 "이미지 속 텍스트 가리기"를 사용하세요.',
        },
        {
          question: '흐림만으로 텍스트를 숨길 수 있나요?',
          answer: '확실하지 않아요. 해당 영역을 덮어 칠하는 가리기 도구를 사용하세요.',
        },
        {
          question: '흐림 정도를 조절할 수 있나요?',
          answer: '반경은 고정이에요. 더 강한 효과를 원하면 흐리게 하기 전에 크기를 줄이세요.',
        },
      ],
      related: [
        {
          label: '사진 속 얼굴 흐리게 처리',
          to: '/tools/blur-faces-in-photo',
          description: 'AI 얼굴 흐림.',
        },
        {
          label: '이미지 속 텍스트 가리기',
          to: '/tools/redact-text-in-image',
          description: '텍스트와 번호판을 숨겨요.',
        },
        {
          label: '이미지 선명하게',
          to: '/tools/sharpen-image',
          description: '반대 기능이에요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: '이미지 형식 간에 변환해요.',
        },
        {
          label: '이미지 자르기',
          to: '/tools/crop-image',
          description: '원하는 영역만 잘라요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '크기를 바꿔요.',
        },
        {
          label: '이미지에 텍스트 추가',
          to: '/tools/add-text-to-image',
          description: '캡션이나 워터마크.',
        },
        {
          label: '이미지 필터',
          to: '/tools/image-filters',
          description: '세피아, 스케치, 엠보스 등.',
        },
        {
          label: 'EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '위치와 기기 데이터를 제거해요.',
        },
      ],
      embed: {
        title: '이미지 흐리게 하기',
        description: '이미지를 업로드하세요. 필터가 흐림으로 미리 설정되어 있어 사진 전체가 부드러워져요. 얼굴만 흐리게 하려면 "사진 속 얼굴 흐리게 처리" 도구를 사용하세요. 변환을 누르세요.',
      },
    },
    'generate-vtt-captions': {
      name: 'VTT 자막 생성기',
      h1: '동영상이나 오디오에서 WebVTT 자막 생성하기',
      tagline: '자체 GPU 서버의 AI 전사로 HTML5 비디오, YouTube, 플레이어에 쓸 .vtt 자막 파일을 만들어요.',
      metaTitle: '온라인 VTT 자막 생성기 (무료 AI) | Media Manipulator',
      metaDescription: '무료 온라인 WebVTT 자막 생성기예요. 동영상이나 오디오 파일을 업로드하고 HTML5 비디오, YouTube, Vimeo 또는 어떤 플레이어에서든 쓸 수 있는 시간 정보가 담긴 .vtt 자막 파일을 다운로드하세요. 자체 GPU에서 실행돼요.',
      ogTitle: '온라인에서 WebVTT 자막 생성하기',
      ogDescription: '어떤 동영상이든 AI가 시간을 맞춘 .vtt 자막으로. 무료이며 가입이 필요 없어요.',
      intro: 'WebVTT는 웹의 자막 형식이에요. HTML5 track 요소, YouTube, Vimeo, HLS와 DASH 플레이어가 모두 이 형식을 읽어요. Media Manipulator는 저희가 운영하는 GPU 서버에서 Whisper 모델로 어떤 동영상이나 오디오에서든 시간 정보가 담긴 VTT 자막을 생성하므로 미디어가 외부 AI로 전송되지 않아요. 결과는 자막 뷰어에서 열려서 다운로드하기 전에 타이밍을 확인할 수 있어요.',
      whatItDoes: [
        '음성을 전사하고 시간이 지정된 큐로 나눠요.',
        '표준을 준수하는 .vtt 파일을 출력해요.',
        '언어를 자동으로 감지해요.',
        '자체 GPU에서 실행되며 외부 AI 제공업체를 쓰지 않아요.',
      ],
      flowSteps: [
        {
          title: '동영상 또는 오디오 업로드',
          description: '일반적인 형식이면 무엇이든 돼요.',
        },
        {
          title: 'VTT 선택 유지',
          description: '또는 SRT, 텍스트, JSON으로 바꾸세요.',
        },
        {
          title: '전사',
          description: 'Whisper가 각 큐의 시간을 정해요.',
        },
        {
          title: '다운로드',
          description: '.vtt 파일을 플레이어에 연결하세요.',
        },
      ],
      advancedDetails: [
        '큐는 Whisper의 구간 분할을 따르며, 보통 큐 하나에 2~7초 길이의 문장이나 절 하나가 들어가요.',
        '자막 번역기로 결과를 다른 언어로 번역하세요.',
        '자막을 영상에 입히려면 Darkroom의 자막 레인을 사용하세요.',
      ],
      whyItMatters: [
        '자막은 접근성을 위해 필수이고, 대부분의 시청자는 음소거 상태로 자막을 보며 시청해요.',
        'VTT는 HTML5 비디오가 기본으로 읽을 수 있는 유일한 형식이에요.',
        '시간 정보가 담긴 자막은 검색 엔진에 색인될 수 있어요.',
      ],
      useCases: [
        {
          title: 'HTML5 비디오',
          description: 'track 요소로 파일을 연결해요.',
        },
        {
          title: 'YouTube 업로드',
          description: '.vtt를 자막 트랙으로 업로드해요.',
        },
        {
          title: '강의 동영상',
          description: 'LMS 플레이어용 자막.',
        },
        {
          title: '나중에 번역',
          description: 'VTT를 넣으면 번역된 VTT가 나와요.',
        },
      ],
      whyMediaManipulator: [
        'Whisper가 자체 하드웨어에서 실행돼요. 외부 AI로는 아무것도 전송되지 않아요.',
        '다운로드하기 전에 자막 뷰어에서 타이밍을 확인할 수 있어요.',
      ],
      privacyNote: '파일 속 음성은 자체 GPU 서버의 Whisper가 전사하고 시간을 맞춰 WebVTT 자막으로 만들어요. AI 작업은 저희가 운영하는 하드웨어에서 실행되며 외부 AI 제공업체는 절대 쓰지 않고, 업로드한 어떤 것도 모델 학습에 사용되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: 'VTT와 SRT 중 무엇을 써야 하나요?',
          answer: '웹 플레이어와 YouTube에는 VTT, 동영상 편집기와 일부 오래된 플랫폼에는 SRT를 쓰세요. 둘 다 제공해요.',
        },
        {
          question: '자막을 편집할 수 있나요?',
          answer: '.vtt를 다운로드해 아무 텍스트 편집기에서나 편집하세요. 일반 텍스트 형식이에요.',
        },
        {
          question: '번역할 수 있나요?',
          answer: '네, 자막 번역기 도구로 번역할 수 있어요.',
        },
        {
          question: '내 동영상이 외부로 전송되나요?',
          answer: '아니요. 전사는 자체 GPU 서버에서 실행돼요.',
        },
        {
          question: '사용량에 포함되나요?',
          answer: 'VTT 파일 하나는 AI 작업 한 건으로 계산되며, AI 작업 사용량에서 차감되고 일반 작업 사용량에서는 절대 차감되지 않아요. 실패한 작업은 포함되지 않아요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '자막 파일 하나는 AI 작업 한 건으로 계산돼요. 실패한 작업은 포함되지 않아요.',
        ],
      },
      related: [
        {
          label: 'SRT 자막 생성기',
          to: '/tools/srt-generator',
          description: 'SubRip 형식.',
        },
        {
          label: '동영상 전사',
          to: '/tools/transcribe-video',
          description: '일반 텍스트 또는 JSON.',
        },
        {
          label: '자막 번역기',
          to: '/tools/caption-translator',
          description: '자막을 번역해요.',
        },
        {
          label: 'Darkroom 동영상 편집기',
          to: '/tools/content-studio',
          description: '자막을 영상에 입혀요.',
        },
      ],
      embed: {
        title: 'VTT 자막 생성하기',
        description: '동영상이나 오디오 파일을 업로드하세요. 출력이 WebVTT로 미리 설정되어 있어요. 저희 GPU 서버의 Whisper가 전사본의 시간을 맞추고, track 요소로 연결하거나 플랫폼에 업로드할 수 있는 .vtt 파일로 돌려드려요.',
      },
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
      intro: '정말 중요했던 오 분을 찾으려고 한 시간짜리 회의나 강의를 다시 보고 싶은 사람은 없어요. Media Manipulator가 대신 보고 들어요. Whisper로 음성을 전사하고, 화면이 바뀌는 지점에서 고른 프레임을 비전 모델로 살펴본 다음, 둘을 바탕으로 요약을 써요. 모두 저희가 직접 운영하는 GPU 서버에서 처리해요. 결과는 짧은 문서예요. 제목, 몇 문장의 요약, 시작·종료 시간이 있는 챕터, 주제, 화면에 나온 텍스트가 들어 있어요. 챕터를 클릭하면 동영상의 해당 지점으로 이동하고, 전체를 Markdown으로 복사하거나 Markdown 또는 JSON으로 다운로드할 수 있어요. 요약에는 무료 계정이 필요해요.',
      whatItDoes: [
        '동영상 전체의 제목과 세 문장에서 여섯 문장 분량의 요약을 작성해요.',
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
        '음성은 Whisper로 전사하고, 프레임은 장면이 바뀌는 지점에서 요금제의 프레임 한도(무료 계정 24개, Premium 48개, Pro 96개)까지 골라 비전 모델이 묶음으로 설명해요.',
        '언어 모델이 전사본과 프레임 메모를 바탕으로 요약을 작성해요. Pro 계정은 가능한 경우 더 큰 모델이 작성하는 심층 요약을 요청할 수 있어요.',
        '요약 한 건은 일일 사용량에서 AI 작업 한 건으로 계산돼요. 실패하거나 거부된 작업은 포함되지 않아요.',
        '전사본은 기계가 생성한 것이라 이름이나 숫자가 틀릴 수 있어요. 요약의 참고란에도 이 내용이 표시돼요.',
      ],
      whyItMatters: [
        '챕터가 있는 요약은 일 분이면 훑어볼 수 있지만, 동영상은 그렇지 않아요.',
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
      ],
      privacyNote: '요약에는 무료 계정이 필요하므로 작업이 계정에 연결돼요. 파일은 자체 서버에서 처리되고 AI 모델은 직접 운영하는 GPU 서버에서 실행돼요. 외부 AI 제공업체로는 아무것도 전송되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: '계정이 필요한가요?',
          answer: '네, 무료 계정이 필요해요. 요약은 여러 AI 모델을 저희 GPU 서버에서 실행하기 때문에 로그인한 사용자만 이용할 수 있어요.',
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
          answer: '아니요. 모든 모델은 저희가 직접 운영하는 GPU 서버에서 실행돼요.',
        },
        {
          question: '사용량에 포함되나요?',
          answer: '네, AI 작업 한 건으로 계산돼요. 실패한 작업은 포함되지 않아요.',
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
          'AI 작업 한 건으로 계산돼요. 실패한 작업은 포함되지 않아요.',
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
        '요약 한 건은 일일 사용량에서 AI 작업 한 건으로 계산돼요. 실패하거나 거부된 작업은 포함되지 않아요.',
        '전사본은 기계가 생성한 것이라 이름이나 숫자가 틀릴 수 있어요. 요약의 참고란에도 이 내용이 표시돼요.',
      ],
      whyItMatters: [
        '요약은 일 분이면 읽을 수 있어서 무엇을 들을지 바로 정할 수 있어요.',
        '시간이 표시된 챕터로 긴 녹음도 쉽게 탐색할 수 있어요.',
        '주제 덕분에 지난 에피소드도 검색할 수 있게 돼요.',
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
      ],
      privacyNote: '요약에는 무료 계정이 필요하므로 작업이 계정에 연결돼요. 파일은 자체 서버에서 처리되고 AI 모델은 직접 운영하는 GPU 서버에서 실행돼요. 외부 AI 제공업체로는 아무것도 전송되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: '계정이 필요한가요?',
          answer: '네, 무료 계정이 필요해요. 요약은 AI 모델을 저희 GPU 서버에서 실행하기 때문에 로그인한 사용자만 이용할 수 있어요.',
        },
        {
          question: '전사와는 어떻게 다른가요?',
          answer: '전사는 모든 말을 그대로 옮겨 줘요. 요약은 그 전사본을 바탕으로 작성한 제목, 몇 문장의 요약, 챕터, 주제를 제공해요.',
        },
        {
          question: '요약 언어를 선택할 수 있나요?',
          answer: '네. 사이트에서 지원하는 18개 언어 중에서 고르거나, "음성과 같은 언어"를 선택할 수 있어요.',
        },
        {
          question: '내 녹음이 외부로 전송되나요?',
          answer: '아니요. 모델은 저희가 직접 운영하는 GPU 서버에서 실행돼요.',
        },
        {
          question: '사용량에 포함되나요?',
          answer: '네, AI 작업 한 건으로 계산돼요. 실패한 작업은 포함되지 않아요.',
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
          'AI 작업 한 건으로 계산돼요. 실패한 작업은 포함되지 않아요.',
        ],
      },
    },
    // MM78 voices: name + tagline (model-written, needs native review).
    'voice-cloning': {
      name: '음성 클론',
      h1: '짧은 녹음으로 내 목소리 클론하기',
      tagline: '내 말소리를 5초에서 60초 동안 녹음하거나 업로드해 음성을 만들고, 스무 개가 넘는 언어로 원하는 텍스트를 읽게 하세요.',
      metaTitle: '녹음으로 내 목소리 클론하기 | Media Manipulator',
      metaDescription: '내 말소리 5~60초로 음성을 만들고, 그 음성으로 20개가 넘는 언어의 텍스트를 말소리로 바꾸세요. 자체 서버에서 실행되며 출력물에는 워터마크가 들어가요.',
      ogTitle: '짧은 녹음으로 내 목소리 클론하기',
      ogDescription: '문장 몇 개를 녹음하고 본인 목소리임을 확인한 뒤, 그 목소리로 20개가 넘는 언어의 말소리를 생성하세요. 자체 호스팅 모델, 워터마크가 들어간 출력물.',
      intro: '음성 클론은 내 말소리를 짧게 녹음한 것으로 다시 쓸 수 있는 음성을 만들어요. 마이크에 대고 자연스러운 문장 몇 개를 읽거나 5~60초 길이의 클립을 업로드하고, 그 음성이 본인의 것임을(또는 말하는 사람의 명시적인 허락을 받았음을) 확인한 다음 음성을 만드세요. 음성은 짧은 미리 듣기와 함께 내 음성에 나타나요. 그 후로는 원하는 텍스트를 입력하고 스무 개가 넘는 언어 중 하나와 감정 수준을 고르면, 그 음성이 읽어 주는 MP3와 WAV를 받을 수 있어요. 모델은 저희가 운영하는 GPU 서버에서 실행되고, 생성된 모든 파일에는 들리지 않는 워터마크가 들어가며, 녹음한 어떤 것도 학습에 사용되지 않아요.',
      whatItDoes: [
        '브라우저에서 녹음하거나 오디오 파일로 업로드한 5~60초의 말소리로 저장된 음성을 만들어요.',
        '사용량에 집계하기 전에 녹음이 충분히 길고 실제로 말소리가 들어 있는지 확인해요.',
        '저장된 음성으로 20개가 넘는 언어의 텍스트를 읽으며, 차분한 느낌부터 풍부한 표현까지 감정을 조절할 수 있어요.',
        '말소리를 MP3로 돌려주고, WAV 다운로드는 브라우저에서 만들어져요.',
        '생성된 모든 파일에 들리지 않는 워터마크를 넣어 합성 음성임을 식별할 수 있게 해요.',
      ],
      flowSteps: [
        {
          title: '녹음 또는 업로드',
          description: '조용한 방에서 또렷하게 말한 5~60초 분량.',
        },
        {
          title: '동의 확인',
          description: '음성이 본인의 것이거나 말하는 사람의 허락을 받았다고 체크하세요.',
        },
        {
          title: '음성 만들기',
          description: '짧은 미리 듣기가 렌더링되고 음성이 계정에 저장돼요.',
        },
        {
          title: '말소리 생성',
          description: '텍스트를 입력하고 언어와 감정을 고른 뒤 오디오를 다운로드하세요.',
        },
      ],
      advancedDetails: [
        '음성 엔진은 자체 GPU 서버에서 실행되는 Chatterbox Multilingual(MIT 라이선스)이에요. 생성하는 순간 참조 클립으로 음성을 클론하며, 내 목소리로 모델을 학습시키지 않아요.',
        '음성 만들기는 AI 작업 한 건(미리 듣기)으로 계산돼요. 생성할 때마다 AI 작업 한 건으로 계산돼요. 실패하거나 거부된 요청은 포함되지 않아요.',
        '요청당 텍스트 길이는 요금제에 따라 달라지며, 말소리 초당 약 18자 기준이에요. 텍스트 상자 아래 카운터에 한도가 표시돼요.',
        '생성된 모든 파일에는 Resemble AI의 PerTh 워터마크가 들어가요. 들리지 않으며 일반적인 편집과 압축을 거쳐도 유지돼요.',
        '한동안 사용이 없다가 들어온 첫 요청은 엔진을 불러오는 동안 최대 20초가 걸릴 수 있어요.',
      ],
      whyItMatters: [
        '대본을 고칠 때마다 스튜디오를 예약하지 않고도 내 목소리로 내레이션할 수 있어요.',
        '같은 목소리를 다른 언어로 들려줘 동영상이나 강의가 더 많은 사람에게 닿아요.',
        '자체 호스팅 엔진이라 녹음이 외부 AI 제공업체가 아닌 저희에게만 남아요.',
      ],
      useCases: [
        {
          title: '동영상 내레이션',
          description: '대본에서 바뀐 줄을 다시 녹음하지 않고 새로 읽게 해요.',
        },
        {
          title: '강의와 튜토리얼',
          description: '같은 강의를 여러 언어로 녹음해요.',
        },
        {
          title: '접근성',
          description: '긴 텍스트를 익숙한 목소리로 읽어 줘요.',
        },
        {
          title: '프로토타이핑',
          description: '최종 녹음 전에 대본이 읽히는 것을 들어 봐요.',
        },
      ],
      whyMediaManipulator: [
        '저희가 운영하는 하드웨어의 오픈 모델을 써요. 녹음은 외부 AI 서비스로 절대 전송되지 않아요.',
        '음성을 만들기 전에 명시적인 동의를 받고, 그 동의를 음성과 함께 기록해요.',
        '출력물에는 워터마크가 들어가고, 저장한 모든 음성은 직접 삭제할 수 있어요.',
      ],
      privacyNote: '녹음하거나 업로드한 5~60초의 말소리는 계정에 저장된 음성이 돼요. 음성이 말할 때마다 모델이 읽는 것이 바로 이 참조 녹음이에요. 음성 녹음과 저장된 음성은 자체 서버에서 처리되며, 외부 AI 제공업체로는 아무것도 전송되지 않고 어떤 모델의 학습에도 사용되지 않아요. 저장된 음성(참조 녹음과 미리 듣기)은 계정에 보관되고, 직접 선택한 보관 기간을 따르며, 언제든지 계정의 음성 메뉴에서 삭제할 수 있고, 계정을 삭제하면 함께 삭제돼요. 생성된 오디오는 다른 결과물과 똑같이 보관돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: '다른 사람의 목소리를 클론할 수 있나요?',
          answer: '그 사람의 명시적인 허락이 있을 때만 가능해요. 음성을 만들기 전에 그 음성이 본인의 것이거나 허락을 받았다고 확인해야 하며, 저희는 그 확인을 음성과 함께 저장해요. 허락 없이 다른 사람을 사칭하는 것, 사기, 정치적 딥페이크는 이용약관에서 금지하고 있어요.',
        },
        {
          question: '내 목소리와 똑같이 들리나요?',
          answer: '대개 말하는 사람임을 알아볼 수 있을 만큼 비슷하지만 완벽한 복제는 아니에요. 억양이 강한 말투, 독특한 목소리, 잡음이 많은 녹음은 더 어려워요. 가장 좋은 결과를 얻으려면 조용한 방에서 자연스러운 문장 몇 개를 녹음하세요.',
        },
        {
          question: '내 녹음이 AI 모델 학습에 사용되나요?',
          answer: '아니요. 업로드하거나 생성한 어떤 것도 모델 학습에 사용되지 않아요. 음성은 말소리를 생성할 때마다 참조 클립으로 클론돼요.',
        },
        {
          question: '생성된 오디오라는 걸 다른 사람이 알 수 있나요?',
          answer: '저장된 음성으로 생성한 모든 파일에는 탐지 도구가 읽을 수 있는 들리지 않는 워터마크가 들어가요. 오디오가 들리는 방식은 바뀌지 않아요.',
        },
        {
          question: '음성은 어떻게 삭제하나요?',
          answer: '계정의 음성 메뉴를 열고 삭제하세요. 참조 녹음과 미리 듣기가 제거되며, 이미 생성한 오디오는 각자의 보관 기간이 끝날 때까지 기록에 남아요.',
        },
        {
          question: '음성은 몇 개까지 보관할 수 있나요?',
          answer: '요금제에 따라 달라요. 페이지에 저장한 음성 수와 한도가 표시돼요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '참조 녹음은 5~60초 길이여야 하고 말소리가 들어 있어야 해요.',
          '음성을 저장하려면 계정이 필요해요. 프리셋 음성은 계정 없이도 쓸 수 있어요.',
        ],
      },
      related: [
        {
          label: '음성 디자이너',
          to: '/tools/voice-designer',
          description: '새 음성을 말로 설명하고 보관해요.',
        },
        {
          label: '음성 변경기',
          to: '/tools/voice-changer',
          description: '녹음의 음높이를 바꾸거나 다른 음성으로 변환해요.',
        },
        {
          label: '음성 오디오 정리',
          to: '/tools/clean-voice-audio',
          description: '사용하기 전에 녹음을 깨끗하게 정리해요.',
        },
        {
          label: '오디오 음높이 변경',
          to: '/tools/change-audio-pitch',
          description: '음악이나 말소리의 키를 바꿔요.',
        },
      ],
      embed: {
        title: '음성 만들기',
        description: '5~60초 길이의 깨끗한 녹음을 녹음하거나 업로드하고, 음성이 본인의 것이거나 말하는 사람의 허락을 받았음을 확인한 다음 음성을 만드세요. 그런 다음 텍스트를 입력하고 말소리를 생성하세요. 프리셋 음성은 계정 없이도 쓸 수 있어요.',
      },
    },
    'voice-designer': {
      name: '음성 디자이너',
      h1: '설명으로 새 음성 디자인하기',
      tagline: '음성을 말로 설명하고 미리 들어 본 뒤, 마음에 드는 음성을 보관해 스무 개가 넘는 언어로 원하는 텍스트를 읽게 하세요.',
      metaTitle: '텍스트 설명으로 새 음성 디자인하기 | Media Manipulator',
      metaDescription: '따뜻하고 낮고 차분한 목소리처럼 원하는 음성을 설명하고, 무료로 미리 들어 본 뒤 보관해 그 음성으로 말소리를 생성하세요. 자체 호스팅 모델을 쓰며 출력물에는 워터마크가 들어가요.',
      ogTitle: '설명으로 새 음성 디자인하기',
      ogDescription: '음성을 설명하고 무료 미리 듣기를 들어 본 뒤, 마음에 드는 음성을 보관해 말소리를 생성하세요. 자체 호스팅, 워터마크 포함.',
      intro: '음성 디자이너는 누구의 것도 아닌 음성을 만들어요. 성별, 나이, 억양, 음색, 속도 등을 몇 단어로 설명하거나 칩을 눌러 설명을 만든 다음, 예시 문장을 미리 들어 보세요. 미리 듣기는 무료이며 설명 하나당 시간당 세 번까지 할 수 있어요. 원하는 음성이 들리면 이름을 붙여 보관하세요. 미리 들은 바로 그 음성이 계정에 저장되고, 이후 음성 도구가 지원하는 모든 언어로 어떤 텍스트든 읽을 수 있어요. 디자인은 Qwen3-TTS, 말하기는 Chatterbox가 맡으며 둘 다 직접 운영하는 GPU 서버에서 실행돼요. 생성된 모든 파일에는 들리지 않는 워터마크가 들어가요.',
      whatItDoes: [
        '음성에 대한 텍스트 설명을 말소리 미리 듣기로 바꿔요.',
        '음성을 저장하면 미리 들은 음성(같은 시드)을 그대로 보관해요.',
        '보관한 음성으로 20개가 넘는 언어에서 어떤 텍스트든 읽어요.',
        '말소리를 MP3로 돌려주며, WAV 다운로드는 브라우저에서 만들어져요.',
      ],
      flowSteps: [
        {
          title: '설명하기',
          description: '원하는 특징을 직접 쓰거나 클릭하세요.',
        },
        {
          title: '미리 듣기',
          description: '설명 하나당 시간당 세 번 무료로 미리 들을 수 있어요.',
        },
        {
          title: '보관하기',
          description: '음성에 이름을 붙여 계정에 저장하세요.',
        },
        {
          title: '음성 생성',
          description: '원하는 텍스트를 입력하고 오디오를 다운로드하세요.',
        },
      ],
      advancedDetails: [
        '디자인에는 Qwen3-TTS VoiceDesign(Apache 2.0)을 사용해요. 미리 듣기 문장은 중국어, 영어, 일본어, 한국어, 독일어, 프랑스어, 러시아어, 포르투갈어, 스페인어, 이탈리아어의 열 가지 언어로 들을 수 있어요.',
        '보관한 음성은 설명, 시드, 10초 길이의 참조 클립으로 저장돼요. 그 뒤로는 Chatterbox가 이 음성으로 말하기 때문에 어디서든, 지원하는 모든 언어에서 똑같이 들려요.',
        '미리 듣기는 사용량에 포함되지 않아요. 음성을 보관하면 AI 작업 한 건으로 계산되고, 생성할 때마다 AI 작업 한 건으로 계산돼요.',
        '설명은 영어로 쓸 때 가장 잘 작동해요. 칩은 영어로 된 특징을 추가해요.',
      ],
      whyItMatters: [
        '초안을 위해 성우를 고용하지 않아도 개성 있는 내레이터나 캐릭터 음성을 얻을 수 있어요.',
        '실제 사람의 목소리가 쓰이지 않으므로 누구의 개인적 특징도 빌려 쓰지 않아요.',
        '보관한 음성은 모든 스크립트와 언어에서 일관되게 유지돼요.',
      ],
      useCases: [
        {
          title: '캐릭터',
          description: '이야기나 게임 프로토타입의 캐릭터마다 고유한 음성을 부여하세요.',
        },
        {
          title: '설명 영상',
          description: '제품 영상과 교육 영상을 위한 차분하고 또렷한 내레이터.',
        },
        {
          title: '임시 오디오',
          description: '스크립트가 아직 바뀌는 동안 쓸 임시 보이스오버.',
        },
        {
          title: '접근성',
          description: '긴 문서를 읽어 줄 듣기 편한 음성.',
        },
      ],
      whyMediaManipulator: [
        '직접 운영하는 GPU 서버의 오픈 모델을 사용해요. 외부 AI 제공업체를 거치지 않아요.',
        '사용량에 포함되기 전에 무료로 미리 들을 수 있어요.',
        '출력물에는 워터마크가 들어가고, 보관한 음성마다 삭제 버튼이 있어요.',
      ],
      privacyNote: '음성 모델에는 직접 작성한 텍스트 설명만 전송돼요. 모델이 만드는 미리 듣기는 저희가 생성하는 오디오이며, 보관한 음성은 시드로 저장돼요. 음성 녹음과 저장된 음성은 자체 서버에서 처리돼요. 외부 AI 제공업체로는 아무것도 전송되지 않으며, 어떤 모델의 학습에도 사용되지 않아요. 저장된 음성(참조 녹음과 미리 듣기)은 계정에 저장되고, 선택한 보관 기간을 따르며, 언제든지 계정 → 음성에서 삭제할 수 있어요. 계정을 삭제하면 함께 삭제돼요. 생성된 오디오는 다른 결과물과 똑같이 보관돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: '디자인한 음성은 누군가의 실제 목소리인가요?',
          answer: '아니요. 설명과 무작위 시드로 생성되며, 특정 인물을 본떠 만들지 않아요.',
        },
        {
          question: '미리 듣기 횟수가 왜 소진되나요?',
          answer: '무료 미리 듣기를 모두가 계속 이용할 수 있도록 설명 하나당 시간당 세 번까지만 미리 들을 수 있어요. 다시 미리 들으려면 설명을 바꾸거나, 마음에 드는 음성을 보관하세요.',
        },
        {
          question: '보관한 음성이 미리 듣기와 똑같이 들리나요?',
          answer: '네. 보관할 때 들으셨던 미리 듣기와 같은 설명과 시드를 보내고, 그 렌더링에서 음성을 저장해요.',
        },
        {
          question: '어떤 언어로 말할 수 있나요?',
          answer: '음성은 열 가지 언어 중 하나로 디자인되며, 보관하고 나면 음성 도구의 모든 언어, 통틀어 스무 개가 넘는 언어로 말할 수 있어요.',
        },
        {
          question: '출력물에 생성된 오디오라는 표시가 있나요?',
          answer: '네. 생성된 모든 파일에는 감지 도구가 읽을 수 있는 들리지 않는 워터마크가 들어가요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '미리 듣기: 설명 하나당 시간당 3회, 사용량에 포함되지 않아요.',
          '음성을 보관하려면 계정이 필요해요.',
        ],
      },
      related: [
        {
          label: '음성 클론',
          to: '/tools/voice-cloning',
          description: '내 녹음으로 음성을 만들어요.',
        },
        {
          label: '음성 변경기',
          to: '/tools/voice-changer',
          description: '녹음의 음높이를 바꾸거나 다른 음성으로 변환해요.',
        },
        {
          label: '음성 오디오 정리',
          to: '/tools/clean-voice-audio',
          description: '사용하기 전에 녹음을 깨끗하게 정리해요.',
        },
        {
          label: '오디오 음높이 변경',
          to: '/tools/change-audio-pitch',
          description: '음악이나 말소리의 키를 바꿔요.',
        },
      ],
      embed: {
        title: '음성 설명하기',
        description: '짧은 설명을 쓰거나 특징 칩을 클릭해 음성을 미리 들은 다음(설명 하나당 시간당 세 번 무료), 보관해서 말소리를 생성하세요. 음성을 보관하려면 계정이 필요해요.',
      },
    },
    'voice-changer': {
      name: '음성 변경기',
      h1: '녹음 속 목소리 바꾸기',
      tagline: '녹음의 음높이와 성격을 즉시 바꾸거나, AI로 말소리를 저장한 음성이나 프리셋 음성으로 변환하세요.',
      metaTitle: '음성 변경기: 녹음의 음높이 변경 또는 음성 변환 | Media Manipulator',
      metaDescription: '녹음 속 목소리를 바꾸세요. 음높이와 포먼트를 즉시 바꾸거나, AI로 말소리를 저장한 음성이나 프리셋 음성으로 변환할 수 있어요. 변경 전후를 비교해 보세요.',
      ogTitle: '녹음 속 목소리 바꾸기',
      ogDescription: '음높이와 포먼트를 즉시 바꾸거나 AI로 말소리를 다른 음성으로 변환한 다음, 변경 전후를 비교하세요.',
      intro: '음성 변경기로 녹음을 바꾸는 방법은 두 가지예요. "음높이 변경"은 전통적인 음높이·포먼트 변경이에요. 음높이를 위아래로 최대 열두 반음까지 옮기고, 화자의 개성을 유지하거나 음높이와 함께 바꿀 수 있으며, "더 낮게", "더 높게", "아이 같은", "노년", "전화기" 같은 프리셋에서 시작할 수도 있어요. 즉시 처리되고, 계정이 필요 없으며, AI를 쓰지 않아요. "음성으로 변환"은 AI 음성 변환으로 말의 내용, 타이밍, 억양은 그대로 두고 말소리를 저장한 음성이나 프리셋 음성처럼 들리게 만들어요. 어느 방법이든 다운로드하기 전에 끊김 없는 A/B 플레이어로 원본과 결과를 비교할 수 있어요.',
      whatItDoes: [
        '포먼트를 유지하거나 함께 옮기면서 음높이를 위아래로 최대 12반음까지 바꿔요.',
        '음높이 변경 프리셋을 제공해요: 더 낮게, 더 높게, 아이 같은, 노년, 전화기.',
        'AI 음성 변환으로 말소리를 저장한 음성이나 프리셋 음성으로 변환해요.',
        '원본과 결과를 동기화된 A/B 비교로 재생해요.',
        'MP3로 돌려주며, WAV 다운로드는 브라우저에서 만들어져요.',
      ],
      flowSteps: [
        {
          title: '녹음 또는 업로드',
          description: '마이크로 녹음한 말소리나 오디오·동영상 파일.',
        },
        {
          title: '음높이 변경 또는 음성으로 변환 선택',
          description: '즉시 음높이를 바꾸거나, AI로 다른 음성으로 변환해요.',
        },
        {
          title: '비교',
          description: '원본과 결과를 끊김 없이 전환해요.',
        },
        {
          title: '다운로드',
          description: 'MP3 또는 브라우저에서 만든 WAV.',
        },
      ],
      advancedDetails: [
        '음높이 변경은 저희 서버에서 ffmpeg를 통해 rubberband 피치 시프터를 사용해요. "목소리의 개성 유지"는 포먼트를 그대로 두고, "음높이와 함께 변경"은 포먼트도 옮겨서 더 작거나 큰 사람이 말하는 것처럼 들려요. "전화기"는 300~3400 Hz 대역 통과 필터도 적용해요.',
        '음높이 변경은 일반 작업 한 건으로 계산되며 출력물에 워터마크가 들어가지 않아요. 음성으로 변환은 AI 작업 한 건으로 계산되며 출력물에 들리지 않는 워터마크가 들어가요.',
        '음성으로 변환은 직접 운영하는 GPU 서버에서 Chatterbox 음성 변환을 사용해요. 변환할 수 있는 녹음 길이는 요금제에 따라 달라요.',
        '변환하려면 계정이 필요해요. 다른 사람의 목소리로 변환하려면 클론과 마찬가지로 그 사람의 허락이 필요해요.',
      ],
      whyItMatters: [
        '간단한 음높이 변경으로 익명 인터뷰나 개인정보를 고려한 클립 속 목소리를 숨길 수 있어요.',
        '잘못된 목소리로 녹음한 테이크를 다시 녹음하지 않고 바로잡을 수 있어요.',
        '짐작하는 대신 A/B 플레이어로 차이를 바로 들어 볼 수 있어요.',
      ],
      useCases: [
        {
          title: '익명 오디오',
          description: '화자를 알아보기 어렵도록 목소리를 바꿔요.',
        },
        {
          title: '캐릭터 음성',
          description: '직접 읽은 내레이션을 이야기에 쓸 다른 목소리로 바꿔요.',
        },
        {
          title: '일관된 내레이션',
          description: '게스트의 대사를 내레이터의 저장된 음성으로 변환해요.',
        },
        {
          title: '효과',
          description: '동영상 장면에 쓸 전화기 효과나 아이 같은 목소리 효과.',
        },
      ],
      whyMediaManipulator: [
        '음높이 변경 도구는 무료이고 계정이 필요 없어요.',
        'AI 변환은 외부 서비스가 아닌 직접 운영하는 GPU 서버에서 실행돼요.',
        '원본과 결과를 비교하는 A/B 기능이 내장되어 있어요.',
      ],
      privacyNote: '업로드한 녹음은 선택한 모드에 따라 rubberband로 음높이가 바뀌거나 AI 모델로 다른 음성으로 변환돼요. 음성 녹음과 저장된 음성은 자체 서버에서 처리돼요. 외부 AI 제공업체로는 아무것도 전송되지 않으며, 어떤 모델의 학습에도 사용되지 않아요. 저장된 음성(참조 녹음과 미리 듣기)은 계정에 저장되고, 선택한 보관 기간을 따르며, 언제든지 계정 → 음성에서 삭제할 수 있어요. 계정을 삭제하면 함께 삭제돼요. 생성된 오디오는 다른 결과물과 똑같이 보관돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: '음높이 변경과 음성으로 변환은 어떻게 다른가요?',
          answer: '음높이 변경은 신호 처리로 같은 목소리의 음높이와 개성을 바꿔요. 즉시 처리되고 무료예요. 음성으로 변환은 AI로 말소리를 다른 목소리, 즉 저장한 음성이나 프리셋 음성 중 하나처럼 들리게 만들어요.',
        },
        {
          question: '음높이를 바꾸면 워터마크가 들어가나요?',
          answer: '아니요. 음높이를 바꾼 오디오는 일반적인 신호 처리 결과라 워터마크가 들어가지 않아요. 변환한 오디오에는 들리지 않는 워터마크가 들어가요.',
        },
        {
          question: '내 목소리를 유명인의 목소리로 바꿀 수 있나요?',
          answer: '아니요. 직접 저장한 음성이나 저희 프리셋 음성으로만 변환할 수 있으며, 실제 사람의 목소리를 사용하려면 그 사람의 명시적인 허락이 필요해요. 허락 없는 사칭은 이용약관에서 금지하고 있어요.',
        },
        {
          question: '녹음은 얼마나 길어도 되나요?',
          answer: '음높이 변경은 요금제의 길이 제한까지 녹음을 받아요. 변환은 요금제마다 별도의 제한이 있으며, 업로드할 때 표시돼요.',
        },
        {
          question: '동영상 파일을 사용할 수 있나요?',
          answer: '네. 오디오 트랙을 사용하고 영상은 제외해요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '음높이 변경: 일반 작업 한 번, 계정이 필요 없어요.',
          '음성으로 변환: AI 작업 한 번, 계정과 요금제가 필요해요.',
        ],
      },
      related: [
        {
          label: '음성 클론',
          to: '/tools/voice-cloning',
          description: '내 녹음으로 음성을 만들어요.',
        },
        {
          label: '음성 디자이너',
          to: '/tools/voice-designer',
          description: '새 음성을 설명하고 보관해요.',
        },
        {
          label: '음성 오디오 정리',
          to: '/tools/clean-voice-audio',
          description: '사용하기 전에 녹음을 깨끗하게 정리해요.',
        },
        {
          label: '오디오 음높이 변경',
          to: '/tools/change-audio-pitch',
          description: '음악이나 말소리의 키를 바꿔요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: '먼저 녹음을 깨끗하게 만드세요.',
        },
      ],
      embed: {
        title: '목소리 바꾸기',
        description: '말소리를 녹음하거나 업로드하세요. 음높이 변경은 누구나 사용할 수 있으며 음높이와 포먼트를 즉시 바꿔요. 음성으로 변환은 녹음을 저장한 음성이나 프리셋 음성처럼 들리게 만들며, 이 기능이 포함된 요금제의 계정이 필요해요.',
      },
    },
    // MM84: name / tagline / metaTitle / metaDescription for the copy-bar tool pages (model-written, needs native review).
    'content-studio': {
      name: 'Darkroom',
      h1: 'Darkroom',
      tagline: '멀티트랙 타임라인에서 영상과 오디오를 편집하고, 겹치고, 믹싱한 다음 MP4로 내보내세요. 브라우저에서 바로 쓰는 Premiere Pro 스타일 편집기입니다.',
      metaTitle: 'Darkroom: 무료 온라인 멀티트랙 동영상 편집기 | Media Manipulator',
      metaDescription: '멀티트랙 타임라인에서 영상과 오디오를 편집하고, 겹치고, 믹싱한 다음 MP4로 내보내세요. 브라우저에서 바로 실행되는 무료 Premiere Pro 스타일 동영상 편집기입니다. 가입도 설치도 필요 없습니다.',
      ogTitle: '🎬 Darkroom: 브라우저에서 쓰는 무료 멀티트랙 동영상 편집기',
      ogDescription: '멀티트랙 타임라인에서 동영상과 오디오를 편집하고 겹치고 믹싱하고, 타이틀·전환·색 보정을 더한 뒤 MP4로 내보내세요. Premiere Pro 스타일 편집기를 브라우저에서 바로, 가입 없이 완전 무료로 쓸 수 있어요. 지금 써 보세요! 🎬',
      intro: 'Darkroom은 브라우저 탭에서 실행되는 멀티트랙 동영상 편집기예요. 캔버스와 프레임 레이트를 정해 프로젝트를 만들고, 동영상·이미지·오디오 파일을 미디어 빈에 넣어 쌓인 트랙 위에 배치하고, 프레임 경계에서 트리밍하고 분할하고, 색 보정과 키잉을 하고, 타이틀·전환·자막을 추가하고, 트랙별 믹서로 오디오를 믹싱한 다음, 완성된 타임라인을 저희 렌더 서버로 넘기면 돼요. 서버에서는 ffmpeg가 전체 편집을 하나의 필터 그래프로 구성해 MP4 안의 H.264 또는 HEVC로, 오디오만 있는 프로젝트라면 MP3 또는 WAV로 인코딩해요. 편집하면서 보는 미리보기는 WebGL2로 여러분의 GPU에서 실시간 합성되고, 내보낸 결과는 그 미리보기와 대조해 확인하므로 본 그대로 얻을 수 있어요.',
      whatItDoes: [
        '프레임 단위로 정확한 멀티트랙 타임라인에서 트리밍, 분할, 리플 삭제, 면도칼, 슬립, 슬라이드, 롤, 리플 편집, 마커, 그룹, 트랙 잠금·솔로·숨기기, 동영상에서 오디오 분리를 할 수 있어요.',
        '트랙을 쌓인 순서대로 합성하며 자르기, 맞춤, 변형, Lumetri 스타일 색 보정(노출, 대비, 채도, 색온도, 색조, 활기), 3D LUT, 스포이트를 쓰는 크로마 키, 불투명도, 여덟 가지 블렌드 모드를 적용해요.',
        '위치, 배율, 회전, 불투명도, 볼륨, 팬, 효과 매개변수를 키프레임과 다섯 가지 이징 곡선으로 애니메이션하고, 열다섯 가지 전환과 텍스트·도형 레이어로 만든 타이틀 클립을 추가해요.',
        '트랙별 페이더, 팬, 세 대역 EQ, 컴프레서와 실시간 미터로 오디오를 믹싱하고, 마스터 버스에서 더킹과 스트리밍·팟캐스트·방송 라우드니스 프리셋을 적용해요.',
        '저희 GPU에서 Whisper로 자막을 생성하고, 자막 레인에서 편집할 수 있게 하며, 화면에 새기거나 SRT 또는 VTT 별도 파일로 내보내요.',
        'AAC 오디오가 포함된 H.264 또는 HEVC MP4, 또는 MP3나 WAV를 캔버스 크기 그대로 또는 높이 720, 1080, 1440, 2160으로 조정해 내보내고, 진행 상황과 다시 렌더링 기능이 있는 내보내기 패널을 제공해요.',
      ],
      flowSteps: [
        {
          title: '프로젝트 만들기',
          description: '캔버스(1920 x 1080의 16:9, 1080 x 1920의 9:16, 1:1, 4:5 또는 사용자 지정 크기)와 프레임 레이트 24, 30, 60 중 하나를 고르세요.',
        },
        {
          title: '미디어 가져오기',
          description: '동영상, 이미지, 오디오를 미디어 빈에 업로드하세요. 서버가 매초 키프레임이 있는 미리보기 프록시를 렌더링하므로 스크러빙이 가벼워요.',
        },
        {
          title: '자르고 쌓기',
          description: '클립을 트랙에 놓고, 재생 헤드에서 트리밍하고 분할하고, 기본 영상 위에 오버레이와 타이틀을 쌓고, 정지 이미지를 원하는 길이만큼 유지하세요.',
        },
        {
          title: '색 보정, 키잉, 믹싱',
          description: '색을 조정하고, LUT를 적용하고, 배경을 키로 빼고, 움직여야 할 요소에 키프레임을 넣고, 믹서에서 오디오 트랙의 균형을 맞추세요.',
        },
        {
          title: '내보내기',
          description: '형식, 품질, 출력 높이, 자막 모드, 라우드니스 프리셋을 고르세요. ffmpeg가 저희 서버에서 타임라인을 렌더링하고 파일이 내보내기 패널에 나타나요.',
        },
      ],
      advancedDetails: [
        '내보내기는 ffmpeg 한 번의 실행이에요. 모든 소스가 입력이 되고, 타임라인은 filter_complex 그래프(trim, scale, overlay, 타이틀용 drawtext, eq와 색상 필터, 오디오용 normalize=0 설정의 amix)가 되며, 출력은 단일 패스로 인코딩돼요. 키프레임이 있는 매개변수는 그래프에 붙은 sendcmd 사이드카로 전달되며, 이를 위해 렌더 호스트에 ffmpeg 4.4 이상이 필요해요.',
        'H.264는 렌더 GPU에서 시험 인코딩이 성공하면 h264_nvenc 하드웨어 인코더를, 아니면 libx264를 사용해요. 품질 프리셋은 NVENC에서 preset p4·고정 품질 23(중간), p5·CQ 19(높음), p4·CQ 28(낮음)에 대응하고, libx264에서는 preset medium CRF 23, slow CRF 18, veryfast CRF 28이에요. 둘 다 yuv420p로 고정해요.',
        'HEVC는 hevc_nvenc 또는 libx265를 CQ나 CRF 값을 다섯 포인트 높여(NVENC에서 28, 24, 33, libx265에서 28, 24, 32) 사용해요. 체감 화질을 같게 맞추는 일반적인 차이이며, 스트림에 hvc1 태그를 붙여 MP4가 Safari와 QuickTime에서 재생되게 해요. 두 인코더 모두 없으면 HEVC라는 이름을 붙인 H.264를 돌려주는 대신 내보내기가 분명하게 실패해요.',
        '오디오는 그래프 안에서 48 kHz 스테레오로 리샘플링되고, 동영상 내보내기에서는 192 kb/s AAC로 인코딩돼요. MP3 내보내기는 192 kb/s의 libmp3lame을, WAV 내보내기는 16비트 PCM을 사용해요. 라우드니스 프리셋은 ffmpeg loudnorm이에요: 스트리밍 I=-14 LUFS TP=-1.5 LRA=11, 팟캐스트 I=-16 TP=-1.5 LRA=11, 방송 I=-23 TP=-2 LRA=7.',
        '출력 높이를 고르면 자막을 새긴 뒤 마지막 필터로 합성된 프레임의 크기를 조정해요(lanczos, 정사각형 픽셀, 너비는 짝수로 반올림). 그래서 텍스트를 다시 그리지 않고 화면과 함께 크기가 바뀌어요. 요금제가 렌더링할 수 없는 높이는 오류와 함께 거부되며, 조용히 낮춰지는 일은 없어요.',
        'MP4 파일은 -movflags +faststart로 기록되므로 인덱스가 앞쪽에 있어 다운로드가 끝나기 전에 재생이 시작돼요. 타임라인의 정지 이미지는 -loop 1 -framerate <project fps> -t <hold> 입력이 되므로, 유지된 사진의 디코딩 비용은 그 프레임 수만큼만 들어요.',
      ],
      whyItMatters: [
        '변환 도구는 파일 하나를 바꿔요. 편집은 여러 파일을 합쳐요. 인터뷰 아래의 B롤, 오프닝 위의 타이틀, 그 둘 아래에 깔리는 배경 음악을 각각 프레임 단위로 트리밍해서요.',
        '브라우저 편집기에서는 보통 미리보기와 내보낸 결과가 어긋나요. Darkroom은 미리보기를 여러분의 GPU에서, 내보내기를 저희 GPU에서 렌더링하고, 골든 이미지 테스트 하네스로 둘의 차이를 문서화된 허용 범위 안에 유지해요.',
        '무거운 작업은 여러분의 노트북에서 하지 않아요. 4K 내보내기, Whisper 전사, LUT로 보정한 다층 합성은 GPU 렌더 서버에서 실행되므로 얇은 노트북으로도 작업을 마칠 수 있어요.',
      ],
      useCases: [
        {
          title: '쇼트폼 플랫폼용 세로 클립',
          description: '1080 x 1920 캔버스, 화자 펀치 인, 타이틀 카드, 목소리 아래로 더킹한 음악, 화면에 새긴 자막.',
        },
        {
          title: '튜토리얼과 화면 녹화',
          description: '공백 구간을 잘라내고, 테이크를 이어 붙이고, 웹캠 PIP를 겹치고, 콜아웃을 추가한 뒤 별도 자막 파일과 함께 1080p로 내보내세요.',
        },
        {
          title: '인터뷰와 팟캐스트 에피소드',
          description: '화자에 맞춰 편집한 두 카메라 앵글, 라우드니스를 정규화한 믹스, 오디오 피드용으로 같은 타임라인을 MP3로 내보내기.',
        },
        {
          title: '프로모션과 제품 동영상',
          description: '배경 플레이트 위에 크로마 키로 합성한 영상, 룩을 위한 LUT, 키프레임으로 움직이는 로고, 대형 화면용 4K 15초 편집본.',
        },
      ],
      workedExamples: [
        {
          title: '중간 프리셋으로 만든 90초 1080p30 편집본',
          body: '1920 x 1080, 30 fps 캔버스에 1080p 클립 두 개, 음악 트랙, 타이틀 카드를 놓고 H.264 중간 품질로 내보내요. NVENC가 동작하는 렌더 서버에서는 h264_nvenc preset p4, 고정 품질 23, yuv420p가 되고, 그렇지 않으면 libx264 preset medium CRF 23이 돼요. 오디오 믹스는 192 kb/s AAC로 인코딩되며, 90초 동안이면 192,000 x 90 / 8, 즉 내용과 관계없이 약 2.2 MB의 오디오예요. 동영상 쪽은 비트레이트가 아니라 화질을 목표로 하므로 크기는 영상에 따라 달라져요. CQ 23에서 정적인 토킹 헤드 영상은 작게, 손으로 든 카메라의 움직임은 크게 인코딩돼요. 렌더링 시간은 타임라인 길이와 동시에 보이는 클립 수에 비례해요. 인코더에 전달되기 전에 보이는 모든 클립의 모든 프레임이 디코딩되고 합성되기 때문이에요.',
        },
        {
          title: 'MP3와 WAV로 내보낸 20분 팟캐스트',
          body: '오디오 전용 프로젝트(음성 트랙 두 개, 인트로 효과음, 팟캐스트 라우드니스 프리셋)는 동영상 그래프를 완전히 건너뛰어요. MP3로 내보내면 고정 192 kb/s의 libmp3lame 파일이 돼요: 192,000 x 1,200 / 8 = 28.8 MB, 즉 약 29 MB예요. WAV로 내보내면 그래프의 48 kHz 스테레오에서 16비트 PCM이에요: 48,000 x 2채널 x 2바이트 = 초당 192,000바이트, 20분이면 230 MB예요. loudnorm 단계는 통합 라우드니스 -16 LUFS, -1.5 dBTP 상한, 11 LU의 라우드니스 범위를 목표로 해요. 합성할 프레임이 없으니 작업 시간은 소스 디코딩과 오디오 필터에 좌우되어 에피소드 길이보다 훨씬 짧은 시간에 끝나요.',
        },
      ],
      whenNotToUse: 'Darkroom은 한 단계로 끝나는 작업에는 맞지 않는 도구예요. 클립의 시작과 끝만 자르거나, 형식을 바꾸거나, 크기를 줄이기만 하면 된다면 단일 목적의 동영상 자르기와 압축 페이지가 프로젝트 없이 업로드 한 번으로 해 줘요. 업로드할 수 없는 영상을 다루는 곳도 아니에요. 모든 소스는 프록시와 렌더링을 위해 저희 서버로 전송되므로, 절대 내 컴퓨터를 떠나면 안 되는 자료는 데스크톱 편집기에서 다뤄야 해요. 비회원 세션의 프로젝트는 하나로 제한되고 24시간 동안 유지돼요. 다음 주에 다시 볼 작업이라면 시작하기 전에 로그인하세요.',
      whyMediaManipulator: [
        '진짜 편집 기능: 면도칼, 슬립, 슬라이드, 롤, 리플, 마커, 그룹, 이징이 있는 키프레임, EQ와 컴프레서가 있는 믹서. 제목 입력란이 달린 자르기 도구가 아니에요.',
        '정직한 내보내기: 하드웨어 또는 소프트웨어 인코딩은 실시간 검사로 선택되고, HEVC는 속이지 않고 거부하며, 요금제가 렌더링할 수 없는 해상도는 조용히 낮춰지지 않고 오류가 돼요.',
        '하나의 계정, 하나의 공간: 편집하는 바로 그 파일을 전사하거나 압축하거나 메타데이터를 지울 수 있고, 같은 GPU 서버에서 내레이션이나 자막을 생성할 수 있어요.',
      ],
      privacyNote: 'Darkroom은 프로젝트가 존재하는 동안 미디어를 저희 서버에 보관해요. 업로드한 파일은 에셋으로 미디어 빈에 들어가고, 서버는 이를 바탕으로 미리보기 프록시, 필름스트립, 파형 피크를 렌더링하며, 내보내기는 ffmpeg가 렌더 호스트의 outputs/<jobId>/에 만들어요. 자막을 요청하면 오디오가 저희 자체 GPU의 Whisper로 전송되고, 그 결과로 나온 자막 항목은 프로젝트와 함께 저장돼요. 프로젝트 문서와 에셋, 버전, 내보낸 파일은 편집기나 계정 페이지에서 삭제할 수 있어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 업로드한 동영상과 오디오는 저희 자체 서버의 자동 분석 단계도 거쳐요. 외부 AI 제공업체로는 아무것도 전송되지 않으며 어떤 파일도 학습에 사용되지 않아요.',
      faq: [
        {
          question: 'Darkroom은 무료인가요?',
          answer: '네. 계정이 없어도 프로젝트 하나를 보관하고 하루 5회 내보낼 수 있으며, 업로드는 파일당 최대 200 MB, 출력 높이는 최대 1080이에요. 무료 계정은 이를 프로젝트 5개, 하루 30회 내보내기, 1 GB 파일, 높이 1440으로 늘려 주고, Premium은 무제한 프로젝트, 하루 300회 내보내기, 5 GB 파일, 높이 2160 출력을 제공하며, Pro는 내보내기를 하루 700회로 늘려요. 내보내기는 별도의 일일 카운터가 있어 일일 일반 작업 횟수를 소모하지 않아요. 이는 기본값이며, 실시간 수치는 요금 페이지에 나와 있어요.',
        },
        {
          question: '무엇을 내보낼 수 있나요?',
          answer: 'H.264 또는 HEVC 동영상과 AAC 오디오가 담긴 MP4, 또는 오디오 전용 프로젝트라면 MP3나 WAV예요. 동영상은 캔버스 크기 그대로 또는 높이 720, 1080, 1440, 2160으로 조정해 내보낼 수 있고, 자막은 화면에 새기거나, SRT 또는 VTT 별도 파일로 만들거나, 생략할 수 있으며, 믹스에는 스트리밍·팟캐스트·방송 라우드니스 프리셋을 적용할 수 있어요.',
        },
        {
          question: '어떤 품질 프리셋을 골라야 하나요?',
          answer: '중간은 libx264의 CRF 23 또는 NVENC의 고정 품질 23으로, 어차피 다시 인코딩하는 플랫폼에 업로드할 때 무난한 기본값이에요. 높음(CRF 18 또는 CQ 19, preset slow 또는 p5)은 다시 편집하거나 큰 화면에 띄울 마스터용이에요. 낮음(CRF 28 또는 CQ 28, veryfast 또는 p4)은 동료에게 보낼 빠른 미리보기용이에요.',
        },
        {
          question: 'HEVC 내보내기가 왜 실패했나요?',
          answer: 'HEVC에는 렌더 GPU의 hevc_nvenc나 ffmpeg 빌드의 libx265 중 하나가 필요해요. 서버에 둘 다 없으면 HEVC라고 표시된 H.264 파일을 돌려주는 대신 지원되지 않는 인코더라는 메시지와 함께 내보내기가 실패해요. 형식을 H.264로 바꾸면 같은 타임라인이 렌더링돼요.',
        },
        {
          question: '자막은 어떻게 만들어지나요?',
          answer: '자막 생성을 누르면 타임라인 오디오가 저희 GPU 서버의 Whisper로 전송돼요. 구간은 자막 레인에서 편집할 수 있는 자막 항목으로 돌아오고, 이를 화면에 새기거나(프레임에 렌더링되는 ASS 자막 트랙) 동영상 옆에 SRT 또는 VTT 파일로 내보낼 수 있어요. 자막 생성은 AI 작업 한 건으로, 일일 AI 작업 횟수에서 차감돼요.',
        },
        {
          question: '내보낸 결과가 미리보기와 같나요?',
          answer: '그게 바로 설계의 핵심이에요. 미리보기는 서버 필터 그래프와 같은 순서(자르기, 맞춤, 변형, 색 보정, LUT, 키, 불투명도, 블렌드)로 WebGL2에서 합성되고, 골든 이미지 하네스가 양쪽의 프레임을 문서화된 허용 범위 안에서 비교해요. 솔로와 숨기기는 미리보기에서와 똑같이 내보내기에도 적용돼요.',
        },
        {
          question: '나중에 프로젝트로 돌아올 수 있나요?',
          answer: '네. 프로젝트는 리비전 번호와 함께 저장되므로 오래된 탭이 더 새로운 작업을 덮어쓸 수 없고, 버전 기록에 돌아갈 수 있는 체크포인트가 남아요. 충돌 복구를 위해 브라우저에도 초안이 보관돼요. 로그인한 사용자는 어떤 기기에서든 최근 프로젝트를 열 수 있고, 비회원 프로젝트는 브라우저 세션과 24시간 보관 기간을 따라요.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '원본 파일과 내보낸 파일은 저희 서버에서 처리돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
        ],
        processingNotes: [
          '미리보기는 브라우저에서 합성되고, 최종 내보내기는 서버에서 H.264 또는 HEVC MP4, 또는 MP3나 WAV 오디오로 인코딩돼요.',
        ],
      },
      related: [
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '이메일이나 느린 연결을 위해 내보낸 파일을 더 줄이세요.',
        },
        {
          label: '동영상 텍스트 변환',
          to: '/tools/transcribe-video',
          description: '자막뿐 아니라 완성된 편집본의 전체 전사본을 받으세요.',
        },
        {
          label: '동영상에서 오디오 추출',
          to: '/tools/extract-audio-from-video',
          description: '타임라인에 가져오기 전에 클립에서 사운드트랙을 뽑아내세요.',
        },
        {
          label: '동영상 자르기',
          to: '/tools/video-trimmer',
          description: '한 번만 자르면 될 때.',
        },
        {
          label: 'Motion',
          to: '/tools/motion',
          description: '로고나 하단 자막을 SVG로 애니메이션한 뒤 타임라인용 GIF로 내보내세요.',
        },
        {
          label: 'Darkroom 튜토리얼',
          to: '/tutorials/content-studio',
          description: '빈 프로젝트에서 MP4 내보내기까지 편집본을 단계별로 만들어 보세요.',
        },
      ],
      embed: {
        title: '동영상 편집',
        description: '새 프로젝트를 만들거나 최근 프로젝트를 다시 열고, 동영상·이미지·오디오 파일을 미디어 빈으로 끌어온 다음 멀티트랙 타임라인에 놓으세요. 클립을 트리밍, 분할, 배치하고, 오버레이와 타이틀을 겹치고, 오디오를 믹싱하고, 완성된 MP4를 내보내세요. 모두 브라우저에서 이루어져요.',
      },
    },
    'remove-exif-metadata': {
      name: '이미지에서 EXIF 메타데이터 삭제',
      h1: '이미지에서 EXIF 메타데이터 온라인으로 삭제하기',
      tagline: '사진을 어디에 공유하기 전에 GPS 위치, 기기, 카메라, 촬영 시각 데이터를 제거하세요.',
      metaTitle: '이미지 EXIF 메타데이터 온라인 삭제 (무료) | Media Manipulator',
      metaDescription: 'JPG, PNG, WebP, HEIC 이미지에서 EXIF, GPS, IPTC, 카메라 메타데이터를 삭제하는 무료 온라인 도구입니다. 가입이 필요 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '이미지에서 EXIF 메타데이터 온라인으로 삭제하기',
      ogDescription: '이미지를 공개적으로 공유하기 전에 GPS 위치, 카메라, 촬영 시각 메타데이터를 지우세요.',
      intro: '사진 안에는 또 하나의 문서가 들어 있어요. 휴대폰이나 카메라는 픽셀과 함께 기기 제조사와 모델, 종종 일련번호, 렌즈, 노출, 셔터가 눌린 정확한 초, 파일을 마지막으로 저장한 소프트웨어, 작은 미리보기 썸네일, 그리고 위치 서비스가 켜져 있었다면 여러분이 서 있던 곳의 위도, 경도, 고도까지 기록해요. 이 도구는 JPG, PNG, WebP, HEIC에서 그 모든 정보를 읽어 내고, 무엇을 드러내는지에 따라 모든 태그를 묶어 보여 준 다음, ExifTool을 한 번 실행해 전부 제거하므로 공유하는 사본에는 그림만 남아요.',
      whatItDoes: [
        'ExifTool로 업로드한 파일을 검사해 찾아낸 모든 태그를 카테고리(카메라, 렌즈, GPS, 날짜와 시간, XMP, IPTC, 썸네일, 색상, 제조사 노트 등)별로 나열하고, 위치·신원·기기·기록 태그를 따로 표시해요.',
        'EXIF 블록(IFD0과 ExifIFD: 제조사, 모델, 본체 일련번호, 렌즈 모델, 노출, ISO, 초점 거리, 촬영·수정 날짜)과 GPS IFD(위도, 경도, 고도, 해당 기준 태그, GPS 타임스탬프)를 제거해요.',
        'IFD1에 포함된 미리보기 썸네일을 제거해요. 이것은 이미지의 별도 작은 사본으로, 많은 편집기에서 자르기를 해도 남아 있어요.',
        'XMP 패킷(생성 도구, 편집 기록, 키워드, 평점), IPTC 레코드(작성자, 저작권, 캡션), Photoshop 리소스 블록, 제조사 노트, ICC 색상 프로필을 제거해요.',
        '먼저 EXIF 방향 정보를 픽셀에 적용하므로, 회전 태그에 의존하던 휴대폰 사진이 태그가 사라진 뒤 옆으로 누워 나오지 않아요.',
        '처리 전후 보고서를 비교해 제거된 항목 수를 세어 보여 주고, 위치 태그가 포함되어 있었다면 그 사실도 알려 줘요.',
      ],
      flowSteps: [
        {
          title: '사진 업로드',
          description: 'JPG, PNG, WebP 또는 HEIC를 넣으세요. 서버가 ExifTool을 두 번(읽기 쉬운 값을 위한 패스와 GPS·노출 값을 위한 숫자 패스) 실행하고 보고서를 돌려줘요.',
        },
        {
          title: '보고서 읽기',
          description: '태그는 카테고리별로 묶이고, GPS 좌표는 위치 표시 지도에 찍혀 파일이 정확히 무엇을 드러내는지 볼 수 있어요.',
        },
        {
          title: '모두 제거',
          description: '클릭 한 번으로 ImageMagick이 이미지를 다시 저장하고 그 결과에 exiftool -all=을 실행해요.',
        },
        {
          title: '비교하고 다운로드',
          description: '결과 화면에서 몇 개의 태그가 제거됐는지 알려 주고, 두 보고서를 나란히 비교해 보여 주며, 깨끗한 파일을 내려받을 수 있어요.',
        },
      ],
      advancedDetails: [
        '픽셀 단계는 ImageMagick이에요: convert <input> -auto-orient -quality 85 <output>. JPG, PNG, WebP, GIF, AVIF는 출력 컨테이너가 입력과 같아요. HEIC, TIFF, BMP는 이 페이지에서 같은 컨테이너로 내보내는 경로가 없어 JPG로 돌아와요.',
        '메타데이터 단계는 변환된 파일에 exiftool -overwrite_original -all=을 실행하는 거예요. -all=은 쓰기 가능한 모든 그룹을 한 번에 제거해요: EXIF(IFD0, ExifIFD, GPS, InteropIFD), IFD1 썸네일, XMP, IPTC, Photoshop IRB, ICC_Profile, 제조사 노트, ExifTool이 쓸 수 있는 모든 APP 세그먼트. JPEG 디코더에 필요한 JFIF와 Adobe APP14 세그먼트는 그대로 남아요. 이들은 여러분이 아니라 픽셀 배치를 설명하는 정보예요.',
        '이미지를 다시 인코딩하므로 JPG는 품질 85로 다시 쓰이고 PNG는 무손실로 다시 쓰여요. 메타데이터만 잘라낸 바이트 단위 동일 사본이 아니에요.',
        '처리 전후 보고서는 검사기가 만드는 것과 같은 MetadataDocument예요. GPS:GPSLatitude나 XMP-xmpMM:History 같은 그룹 키 항목으로 구성되고, 각 항목은 약 1,800개 태그 카탈로그에 따라 22개 카테고리와 네 가지 개인정보 등급(위치, 신원, 기기, 기록)으로 분류돼요.',
        '제거 개수에는 변환할 때마다 바뀌는 행(파일 이름, 크기, 수정 날짜, MIME 형식, 이미지 크기)이 빠지므로, 관리용 정보가 아니라 실제로 삭제된 메타데이터를 반영해요.',
        '동영상과 오디오 컨테이너도 동영상·오디오 변환기에서 메타데이터를 제거할 수 있어요. ffmpeg를 -map_metadata -1 -map_chapters -1로 실행하고, MP4, MOV, M4A, M4V는 ffmpeg가 QuickTime 키와 XMP를 남기기 때문에 이어서 exiftool -all= 패스를 실행해요.',
      ],
      whyItMatters: [
        'GPS 태그는 도로명 주소로 바뀌어요. 집에서 올린 중고 소파 사진 한 장이 낯선 사람에게 그 소파가 어디 있는지 알려 줄 수 있어요.',
        '기기와 일련번호 태그는 사진끼리, 그리고 사진과 여러분을 연결해요. BodySerialNumber가 같은 두 이미지는 어떤 계정이 올렸든 같은 카메라로 찍은 거예요.',
        'IFD1 썸네일은 원본 프레임의 사본이에요. 사진에서 얼굴이나 문서를 잘라내도 미리보기에는 여전히 보일 수 있어요.',
        '업로드할 때 EXIF를 제거하는 사이트도 많지만 그렇지 않은 곳도 많아요. 메신저 앱, 이메일 첨부, 클라우드 공유, 마켓플레이스는 파일을 손대지 않고 그대로 전달하는 경우가 흔해요.',
      ],
      useCases: [
        {
          title: '마켓플레이스와 중고 거래 게시물',
          description: '집에서 찍은 상품 사진의 위치와 촬영 시각을 구매자가 보기 전에 제거하세요.',
        },
        {
          title: '문서 사진',
          description: '서식이나 편지를 찍은 사진에는 언제 어디서 찍었는지도 기록돼요. 다른 사람에게 보내기 전에 지우세요.',
        },
        {
          title: '민감한 장소에서 게시하기',
          description: '이미지가 내 손을 떠나기 전에 기기 식별자와 좌표를 삭제하고, 비교 화면으로 사라졌는지 확인하세요.',
        },
        {
          title: '편집한 이미지 정리',
          description: '편집기는 XMP 기록을 덧붙이고 원본 썸네일을 남겨 둬요. 둘 다 제거해 파일이 의도한 것만 보여 주게 하세요.',
        },
      ],
      workedExamples: [
        {
          title: 'GPS가 포함된 12메가픽셀 iPhone JPEG',
          body: 'iPhone 15 Pro에서 바로 나온 4032 x 3024 JPEG에는 일반적으로 IFD0 태그 5개(제조사, 모델, 방향, 소프트웨어, 수정 날짜), 본체 일련번호와 렌즈 모델을 포함한 ExifIFD 태그 7개, GPS 태그 5개, 편집 기록을 포함한 XMP 항목 4개, ICC 프로필 항목 2개, IFD1 썸네일 항목 3개(약 5 KB의 미리보기 JPEG), 그리고 파생된 GPSPosition이 들어 있어요. 결과 화면은 위치 정보를 포함해 27개 태그가 제거됐다고 알려 줘요. 이 27개는 어느 파일에나 있는 파일 이름, 크기, 날짜, 형식 행과 이미지 크기를 제외한 모든 항목이에요. 출력은 방향이 픽셀에 반영된 품질 85의 재인코딩 JPG이며, 최종 크기는 재인코딩이 결정해요. 작업은 ImageMagick 디코딩·인코딩 한 번과 ExifTool 재작성 한 번이라 몇 초 만에 끝나고, 시간은 태그가 아니라 픽셀 처리에 쓰여요.',
        },
        {
          title: '최신 휴대폰에서 나온 HEIC',
          body: 'HEIC는 이 페이지에서 같은 컨테이너로 내보내는 경로가 없으므로, 12메가픽셀 HEIC는 ImageMagick이 디코딩해 품질 85의 JPG로 쓴 다음 exiftool -all=로 메타데이터를 제거해요. HEIC 컨테이너와 그 색상 프로필은 잃지만, 어떤 브라우저와 마켓플레이스에서도 받아 주는 파일을 얻어요. 품질 85의 JPEG 재인코딩이 유일하게 적용되는 압축이고 그것이 크기를 결정하므로, 업로드한 HEIC보다 파일이 커질 수 있어요. 보고서에는 처리 전에 Apple 제조사 노트와 GPS 블록이 나오고, 처리 후에는 파일과 이미지 크기 행만 남아요. 느린 부분은 HEIC 디코딩이지만, 사진 한 장이면 여전히 몇 초면 돼요.',
        },
      ],
      whenNotToUse: '아직 편집해야 하거나 출처를 증명해야 하는 사진은 메타데이터를 제거하지 마세요. 카메라 RAW 파일은 여기서 받지 않으며, 어차피 -all=로 제거해서도 안 돼요. 제조사 노트에 RAW 변환기에 필요한 데이터가 들어 있기 때문이에요. GPS와 기기 태그는 지우면서 저작권 고지나 제목은 남기고 싶다면, 대신 이미지 변환기의 사용자 지정 메타데이터 모드를 사용하세요. 모든 것을 제거한 뒤 입력한 필드만 다시 써 줘요. 그리고 메타데이터를 지워도 사진에 보이는 것은 지워지지 않는다는 점을 기억하세요. 도로 표지판, 반사된 모습, 얼굴은 여전히 여러분이 어디 있었는지 알려 줘요. 이런 것은 얼굴 흐리게 처리와 텍스트 가리기 도구로 처리할 수 있어요.',
      whyMediaManipulator: [
        '증거를 직접 볼 수 있어요. 녹색 체크 표시와 약속 대신, 검사기가 제거 전 모든 태그를 나열하고 비교 화면이 제거 후 무엇이 사라졌는지 증명해요.',
        '한 번에 모든 그룹을. ExifTool -all=은 EXIF, GPS, XMP, IPTC, Photoshop, ICC, 제조사 노트, 미리보기 썸네일을 함께 제거하므로 블록을 하나씩 체크할 필요가 없어요.',
        '방향도 처리해요. 회전 태그를 제거하기 전에 픽셀에 적용하므로, 메타데이터를 지운 휴대폰 사진이 다른 곳에서 옆으로 누워 보이지 않아요. 픽셀을 회전하지 않고 태그만 지우면 보통 그렇게 돼요.',
      ],
      privacyNote: '이 도구는 돌려주는 사본에서 EXIF 블록(카메라 제조사, 모델, 일련번호, 렌즈, 노출, 날짜), GPS 블록, IFD1 미리보기 썸네일, XMP와 IPTC 레코드, Photoshop 리소스, 제조사 노트, ICC 프로필을 제거해요. 그러려면 서버가 먼저 이를 읽어야 해요. 업로드한 파일은 ExifTool로 검사되고 보고서는 작업 폴더에 metadata.json으로 기록되며, 제거 후에는 결과에 대한 두 번째 보고서가 그 옆에 보관되어 비교 화면에서 차이를 보여 줄 수 있어요. 두 보고서와 두 파일은 uploads/<jobId>/와 outputs/<jobId>/에 있으며 보관 기간이 끝나면 함께 삭제돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 독립형 검사기(파일을 변환하지 않고 읽기만 하는 기능)는 보고서가 만들어지는 즉시 임시 사본을 삭제해요. 이미지는 저희 자체 서버의 자동 분석 단계도 거치며, 외부로는 아무것도 전송되지 않아요.',
      faq: [
        {
          question: '정확히 어떤 메타데이터 그룹이 제거되나요?',
          answer: 'ExifTool이 쓸 수 있는 모든 것이에요: EXIF(IFD0, ExifIFD, InteropIFD), GPS IFD, IFD1 썸네일, 모든 네임스페이스의 XMP(xmp, dc, xmpMM, photoshop 등), IPTC IIM 레코드, Photoshop 리소스 블록, Apple, Canon, Nikon, Sony 등 제조사의 제조사 노트, ICC 색상 프로필. PNG라면 tEXt, iTXt, zTXt, eXIf, iCCP 청크가, WebP라면 EXIF, XMP, ICCP 청크가 포함돼요.',
        },
        {
          question: '이미지가 다시 인코딩되나요?',
          answer: '네. ExifTool이 태그를 제거하기 전에 파일이 ImageMagick을 거쳐요(이때 방향 태그도 픽셀에 적용돼요). JPG는 품질 85로, PNG는 무손실로, WebP는 품질 85로 다시 쓰여요. 일반적인 보기 크기에서 JPG 재인코딩은 원본과 눈으로 구분하기 어렵지만, 동일한 비트스트림은 아니에요.',
        },
        {
          question: 'HEIC가 왜 JPG로 돌아왔나요?',
          answer: '원클릭 제거는 JPG, PNG, WebP, GIF, AVIF의 컨테이너를 유지해요. HEIC, TIFF, BMP는 결과가 어디서나 열리도록 디코딩해 JPG로 써요. HEIC로 받아야 한다면 이미지 변환기에서 메타데이터를 제거로 설정해 변환하세요.',
        },
        {
          question: '색상 프로필도 제거되나요? 그게 중요한가요?',
          answer: '네, exiftool -all=은 ICC 프로필을 제거해요. 표준 sRGB 사진은 아무것도 달라지지 않아요. 프로필이 없으면 뷰어가 sRGB로 가정하기 때문이에요. 최신 휴대폰의 광색역 Display P3 사진은 프로필을 반영하는 소프트웨어에서 색이 약간 덜 선명해 보일 수 있어요. 이게 중요하다면 이미지 변환기의 사용자 지정 메타데이터 모드를 사용해 프로필을 유지하세요.',
        },
        {
          question: '저작권 문구나 제목을 남길 수 있나요?',
          answer: '모든 것을 제거하는 원클릭 제거로는 안 돼요. 이미지 변환기의 메타데이터 섹션에는 파일을 정리한 뒤 입력한 내용만 다시 쓰는 사용자 지정 모드가 있어요: 제목, 작성자, 설명, 저작권, 주석, 키워드, 선택한 EXIF 또는 GPS 필드. 깨끗하면서도 여러분의 이름이 남는 파일이 필요할 때 사용하세요.',
        },
        {
          question: '제대로 됐는지 어떻게 알 수 있나요?',
          answer: '결과 화면에 제거된 태그 수가 표시되고, 위치 데이터가 포함되어 있었다면 따로 표시돼요. 처리 전후 전체 내용은 비교를 열어 확인하세요. 출력 파일에 대해 실행한 같은 ExifTool 보고서이므로, GPS나 일련번호 행이 남아 있다면 거기에 나타나요.',
        },
        {
          question: '무료인가요? 사진을 몇 장까지 처리할 수 있나요?',
          answer: '네. 메타데이터 제거 한 번은 표준 변환기를 통한 업로드 한 번이므로 일일 일반 작업 횟수에서 차감돼요: 기본적으로 계정이 없으면 하루 5회에 파일당 최대 200 MB, 무료 계정이면 하루 30회에 파일 최대 1 GB, Premium은 300회, Pro는 700회예요. 실패한 작업은 횟수를 돌려받아요. 실시간 수치는 요금 페이지에 나와 있어요.',
        },
      ],
      related: [
        {
          label: '사진 속 얼굴 흐리게 처리',
          to: '/tools/blur-faces-in-photo',
          description: '메타데이터는 절반의 이야기일 뿐이에요. 사진 자체에 보이는 얼굴도 가리세요.',
        },
        {
          label: '이미지 속 텍스트 가리기',
          to: '/tools/redact-text-in-image',
          description: '사진에 찍힌 이름, 주소, 숫자를 검게 가리세요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '정리한 사진을 게시하기 전에 크기를 줄이세요.',
        },
        {
          label: '이미지를 PDF로',
          to: '/tools/image-to-pdf',
          description: '메타데이터를 지운 문서 사진을 PDF 하나로 묶으세요.',
        },
        {
          label: '개인정보 처리방침',
          to: '/privacy-policy',
          description: '업로드한 파일, 보고서, 결과가 어떻게 보관되고 삭제되는지 알아보세요.',
        },
      ],
      embed: {
        title: '이미지에서 메타데이터 제거',
        description: 'JPG, PNG, WebP 또는 HEIC 사진을 업로드하세요. 사진에 담긴 모든 태그를 보여 드리며, 모두 제거를 누르면 전부 지우고 정확히 무엇이 제거됐는지 확인할 수 있어요.',
      },
    },
    'compress-image': {
      name: '이미지 압축',
      h1: '이미지 온라인 무료 압축',
      tagline: 'JPG, PNG, WebP 파일 크기를 줄여 웹사이트를 더 빠르게 하고, 업로드 용량을 줄이고, 더 쉽게 공유하세요.',
      metaTitle: '이미지 온라인 무료 압축 | Media Manipulator',
      metaDescription: '무료 온라인 이미지 압축기입니다. 좋은 화질을 유지하면서 JPG, PNG, WebP 파일 크기를 줄이세요. 가입이 필요 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '이미지 온라인 무료 압축',
      ogDescription: '좋은 화질을 유지하면서 JPG, PNG, WebP 파일 크기를 줄여요. 무료이고 빠르며 가입이 필요 없어요.',
      intro: '이미지 압축이란 같은 그림이 더 적은 바이트를 차지하도록 다시 인코딩하는 것을 말해요. 이 페이지는 품질 칸이 80으로 미리 설정되고 출력 형식이 업로드한 파일에 맞춰진 상태로 이미지 변환기를 열어요. 그래서 JPG는 JPG로, WebP는 WebP로 남아요. 저희 서버에서 이 작업은 ImageMagick 명령 하나예요. 파일의 방향을 EXIF 회전 플래그에 따라 자동으로 맞춘 다음 -quality 80, 또는 1부터 100 사이에서 입력한 숫자로 저장해요. JPG와 WebP에서는 이 숫자가 파일 크기를 결정해요. PNG는 무손실이라 이 숫자가 무시되므로, PNG 사진을 줄이는 진짜 방법은 출력을 JPG나 WebP로 바꾸는 거예요.',
      whatItDoes: [
        'JPG와 WebP 출력을 선택한 품질로 다시 인코딩해요. 양식은 80에서 시작해요.',
        '직접 바꾸지 않으면 입력 형식을 유지해요. PNG 사진의 큰 절감 효과는 WebP나 JPG로 바꿀 때 나와요.',
        '같은 처리에서 픽셀 치수도 줄일 수 있어요. 크기 조절 칸에 입력한 너비나 높이는 품질 설정보다 먼저 적용되므로 두 절감 효과가 함께 쌓여요.',
        '메타데이터 모드를 제거로 설정하지 않으면 원본 EXIF, IPTC, XMP 태그를 압축된 파일에 다시 복사해요.',
        '결과는 작업 출력 폴더 안에 converted.jpg, converted.webp 또는 converted.png로 저장되며, 다운로드 링크가 이 파일을 제공해요.',
      ],
      flowSteps: [
        {
          title: 'JPG, PNG 또는 WebP 업로드',
          description: '요금제의 파일당 한도 이내라면 무엇이든 돼요. 비회원의 기본 한도는 200 MB예요.',
        },
        {
          title: '품질 숫자 선택',
          description: '80이 미리 설정되어 있어요. 60~75는 더 강하게 줄이고, 90 이상은 거의 모든 것을 유지해요.',
        },
        {
          title: 'ImageMagick이 다시 인코딩',
          description: 'convert input -auto-orient -quality N output을 실행한 뒤 exiftool로 태그를 복사해요.',
        },
        {
          title: '더 작아진 파일 다운로드',
          description: '출력물은 보관 기간이 끝날 때까지 작업 폴더에서 제공돼요.',
        },
      ],
      advancedDetails: [
        '정확한 명령은 ImageMagick convert에 입력 경로를 먼저 넣고, 그다음 -auto-orient, 선택적인 -crop과 -resize, 이어서 -quality N, 마지막으로 출력 경로를 넣는 형태예요. -quality 인수는 출력 형식이 jpg, jpeg, webp일 때만 붙어요(converter.go의 convertImage).',
        '품질은 서버에서 1부터 100까지의 범위로 검증돼요. 범위를 벗어난 값은 작업이 시작되기 전에 거부되고, 사용한 작업 횟수는 환불돼요.',
        'PNG 출력에는 -quality 인수가 붙지 않으므로, PNG에서 PNG로 가는 작업에서 숫자를 낮춰도 아무것도 바뀌지 않아요. 변환기는 pngquant나 팔레트 축소를 실행하지 않아요. PNG를 작게 하려면 형식을 바꾸세요.',
        '기본 메타데이터 모드에서는 서버가 결과물에 exiftool -TagsFromFile <original> -all:all -unsafe를 실행하므로 카메라, 렌즈, 날짜, GPS 태그가 압축 후에도 남아요. 제거를 고르면 대신 출력물에 exiftool -all=을 실행해요.',
        '크기 조절을 설정하면 품질이 적용되기 전에 실행돼요. 너비만 입력하면 가로세로 비율이 유지되고, 너비와 높이를 함께 입력하면 비율이 달라도 정확히 그 상자 크기로 강제해요.',
        '같은 양식에서 필터, 색조, 텍스트 오버레이도 쓸 수 있어요. 필터는 크기 조절 직후에 적용되고, 색조와 텍스트 오버레이는 품질 설정 이후 마지막에 추가돼요.',
      ],
      whyItMatters: [
        '웹 페이지나 이메일에서 가장 큰 부분은 보통 이미지 바이트이므로, 이를 절반으로 줄이는 것이 가장 저렴하게 속도를 높이는 방법이에요.',
        '업로드 양식, CMS 필드, 메신저 앱은 픽셀이 아니라 메가바이트 단위로 한도를 둬요.',
        '직접 고른 품질로 한 번 다시 인코딩하는 편이 플랫폼이 제멋대로 다시 인코딩하게 두는 것보다 나아요.',
      ],
      useCases: [
        {
          title: '블로그 및 제품 사진',
          description: '4~6 MB짜리 카메라 JPEG를 게시하기 전에 1 MB보다 훨씬 작게 줄이세요.',
        },
        {
          title: '이메일 첨부 파일',
          description: '사진 여러 장을 20 또는 25 MB 메일함 한도 아래로 맞추세요.',
        },
        {
          title: '지원서 제출 포털',
          description: '증명사진이나 서류 사진의 2 MB 한도를 눈에 띄는 손실 없이 맞추세요.',
        },
        {
          title: '작업용 사본',
          description: '원본은 보관함에 두고 일상적으로 쓸 작은 사본을 만들어 두세요.',
        },
      ],
      workedExamples: [
        {
          title: '너비 1600 px, 품질 80으로 줄인 4000 x 3000 휴대폰 JPEG',
          body: '입력: 휴대폰 카메라에서 바로 가져온 4000 x 3000 픽셀, 4.8 MB JPEG. 설정: 너비 1600, 높이 비움, 품질 80, 형식 그대로. ImageMagick이 -resize 1600x를 실행하면 비율이 유지되어 1600 x 1200 픽셀이 돼요. 원본 12메가픽셀 대비 1.92메가픽셀로, 픽셀 수가 약 육분의 일이에요. 결과는 -quality 80으로 저장되고 EXIF가 다시 복사되므로, 출력은 크기가 그만큼 줄어든 픽셀 수를 따라가는 1600 x 1200 JPG예요. 원본의 대략 육분의 일이니 4.8 MB에서 약 1 MB 이하를 예상하세요. 변환은 12메가픽셀 이미지에 대한 ImageMagick 처리 한 번이라 몇 초 걸리며, 보통은 4.8 MB 파일을 업로드하는 시간이 변환 시간보다 더 길어요.',
        },
        {
          title: 'WebP로 바꾼 2.6 MB PNG 스크린샷',
          body: '입력: 투명도가 없는 1920 x 1080, 2.6 MB PNG 스크린샷. 형식을 PNG로 두고 품질을 60으로 옮겨도 아무것도 바뀌지 않아요. PNG 출력에는 -quality가 전달되지 않기 때문이에요. 출력을 미리 설정된 80의 WebP로 바꾸면 convert input -auto-orient -quality 80 converted.webp가 실행돼요. 압축하지 않은 상태에서 이 2,073,600픽셀은 RGB로 6.2 MB이고, 품질 80의 손실 WebP는 그중 일부만 남기므로 결과는 2.6 MB PNG의 몇 분의 일 크기가 되며, 정확한 수치는 스크린샷에 단색 영역과 텍스트가 얼마나 많은지에 따라 달라져요. 치수는 1920 x 1080 그대로이고 작업은 몇 초 만에 끝나요.',
        },
      ],
      whenNotToUse: '아직 많이 편집할 이미지, 투명도를 PNG로 유지해야 하는 PNG(JPG로 바꾸면 알파 채널이 평탄화돼요), 작은 글씨가 있는 스크린샷(품질이 85보다 많이 낮으면 글자가 번져요)에는 손실 압축을 쓰지 마세요. 파일이 픽셀 치수 때문에만 크다면 이미지 크기 조절 도구를 먼저 쓰는 편이 좋고, 목적이 용량이 아니라 개인정보 보호라면 EXIF 제거 도구가 픽셀은 건드리지 않고 태그만 지워요. 그리고 이미 품질 70으로 저장된 JPG는 80으로 다시 저장해도 크게 작아지지 않아요. 다시 저장할 때마다 그에 걸맞은 이득 없이 손실만 더해져요.',
      whyMediaManipulator: [
        'PNG가 품질 숫자를 무시한다는 사실까지 포함해 실제로 실행되는 명령이 이 페이지에 적혀 있으므로, 파일이 왜 줄지 않았는지 추측할 필요가 없어요.',
        '품질, 크기 조절, 형식, 메타데이터 설정이 한 양식과 한 번의 업로드에 모여 있고, 워터마크도 추가되지 않아요.',
        '설치할 것도 없고 표준 도구는 계정도 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ],
      privacyNote: '이미지는 저희 서버의 uploads/<jobId>/에 저장되고, ImageMagick이 압축된 사본을 outputs/<jobId>/에 쓰며, 그 옆에 원본의 메타데이터 보고서도 작성돼요. 기본 모드에서는 exiftool이 원본 EXIF, IPTC, XMP 태그를 압축된 파일에 복사하므로, 제거 옵션을 고르지 않으면 위치와 카메라 데이터가 결과물에 다시 들어가요. 업로드된 모든 이미지는 같은 서버의 비전 모델이 실행하는 자동 분석에도 전달되며, 그 JSON 요약은 작업과 함께 보관돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 외부 서비스로는 아무것도 전송되지 않아요.',
      faq: [
        {
          question: '여기서 이미지를 압축하는 것은 무료인가요?',
          answer: '표준 도구는 무료예요. 압축 작업 한 번에 그날의 일반 작업 한 번이 사용돼요. 기본값으로 비회원은 하루 5회와 파일당 200 MB, 무료 계정은 하루 30회와 파일당 1 GB이고, Premium과 Pro는 300회와 700회예요. 한도는 바뀔 수 있으므로 현재 숫자는 /pricing에서 확인하세요.',
        },
        {
          question: '품질 숫자는 얼마로 해야 하나요?',
          answer: '80이 미리 설정된 값이며 사진에 알맞은 기본값이에요. 엄격한 용량 한도 때문에 어쩔 수 없을 때만 낮추고, 인쇄하거나 나중에 자를 이미지에는 90 이상을 쓰세요. 이 숫자는 ImageMagick의 -quality 옵션에 그대로 전달되므로, ImageMagick 기반의 다른 도구에서와 같은 의미예요.',
        },
        {
          question: 'PNG가 왜 작아지지 않았나요?',
          answer: '품질 칸은 PNG 출력에 아무 영향을 주지 않기 때문이에요. 서버는 jpg, jpeg, webp에만 -quality를 붙여요. 출력 형식을 WebP나 JPG로 바꾸세요. 투명도를 유지해야 한다면 WebP는 알파 채널을 유지하지만 JPG는 그렇지 않아요.',
        },
        {
          question: '압축하면 EXIF와 GPS 데이터가 유지되나요?',
          answer: '기본적으로는 그래요. ImageMagick이 파일을 쓴 뒤 exiftool이 원본의 모든 태그 그룹을 결과물에 복사해요. 대신 모두 제거하려면 메타데이터 섹션에서 제거를 고르거나 전용 EXIF 제거 도구를 사용하세요.',
        },
        {
          question: '그림 크기도 함께 조절되나요?',
          answer: '너비나 높이를 입력하지 않으면 그렇지 않아요. 두 칸이 모두 비어 있으면 픽셀 치수는 그대로이고 인코딩만 바뀌어요.',
        },
        {
          question: '여러 이미지를 한 번에 압축할 수 있나요?',
          answer: '업로드 한 번은 출력 파일 하나가 나오는 작업 하나예요. 이미지마다 도구를 한 번씩 실행하세요. 작업 하나하나가 일일 사용량에서 일반 작업 한 번으로 계산돼요.',
        },
        {
          question: '같은 품질이면 WebP가 항상 JPG보다 작나요?',
          answer: '사진은 대개 그렇지만 두 인코더의 품질 척도가 똑같지는 않으므로, 짐작하지 말고 두 결과물을 비교해 보세요. WebP 지원 이전에 만들어진 소프트웨어에서 파일을 열어야 한다면 JPG를 유지하세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '품질을 낮추면 JPG와 WebP 출력에 영향을 줘요. PNG 사진을 크게 줄이려면 JPG나 WebP로 변환하세요.',
        ],
      },
      related: [
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '가장 크게 줄이려면 먼저 픽셀 치수를 줄이세요.',
        },
        {
          label: '이미지에서 EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '다시 인코딩하지 않고 위치와 카메라 태그를 제거하세요.',
        },
        {
          label: '이미지를 PDF로',
          to: '/tools/image-to-pdf',
          description: '압축한 JPG를 한 페이지짜리 PDF에 담으세요.',
        },
        {
          label: 'AI 이미지 업스케일러',
          to: '/tools/ai-image-upscaler',
          description: '반대로 작은 이미지를 확대하세요.',
        },
        {
          label: '이미지 변환기 튜토리얼',
          to: '/tutorials/image/getting-started',
          description: '품질, 크기 조절, 형식 설정을 살펴보세요.',
        },
      ],
      embed: {
        title: '이미지 압축',
        description: '이미지를 업로드하고 품질 슬라이더를 낮춰 파일을 줄이세요. 출력 형식은 기본적으로 그대로이며, 가장 작은 크기를 원하면 WebP로 바꾸세요. 75~85 정도의 품질이 좋은 균형점이에요.',
      },
    },
    'image-resizer': {
      name: '이미지 크기 조절',
      h1: '이미지 온라인 무료 크기 조절',
      tagline: 'JPG, PNG, WebP, GIF 이미지를 가로세로 비율을 유지한 채 정확한 픽셀 크기로 조절하세요.',
      metaTitle: '이미지 온라인 무료 크기 조절 | Media Manipulator',
      metaDescription: '무료 온라인 이미지 크기 조절 도구입니다. JPG, PNG, WebP, GIF 이미지를 가로세로 비율을 유지한 채 정확한 픽셀 크기로 조절하세요. 가입이 필요 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '이미지 온라인 무료 크기 조절',
      ogDescription: 'JPG, PNG, WebP, GIF 이미지를 정확한 픽셀 크기로 조절하세요. 무료이고 빠르며 가입이 필요 없어요.',
      intro: '이 페이지는 크기 조절 칸이 앞에 나오도록 이미지 변환기를 열어요. 너비나 높이, 또는 둘 다 입력하면 서버가 입력한 값 그대로 만든 -resize 인수로 ImageMagick을 실행해요. 너비만 입력하면 1600x, 높이만 입력하면 x900, 둘 다 채우면 1600x900!이 돼요. 끝에 붙는 느낌표가 중요해요. 비율이 원본과 다르더라도 정확히 그 크기의 상자를 만들라고 ImageMagick에 지시하므로 그림이 늘어나요. 그래서 규칙은 간단해요. 칸 하나만 채우면 비율이 유지되고, 두 칸을 모두 채우면 정확한 크기가 되며, 이때는 비율을 맞게 골랐거나 먼저 잘라 냈다고 보고 그대로 처리해요.',
      whatItDoes: [
        'JPG, PNG, WebP, GIF 이미지를 EXIF 회전 플래그에 따라 자동으로 방향을 맞춘 뒤 입력한 픽셀 너비와 높이로 조절해요.',
        '치수를 하나만 채우면 가로세로 비율을 유지하고, 둘 다 채우면 정확한 상자 크기로 강제해요.',
        '같은 양식에서 크기 조절 전에 적용되는 자르기 상자를 제공해요. 왜곡 없이 정확한 정사각형이나 배너를 얻는 방법이에요.',
        '기본적으로 원본 형식으로 출력하고, JPG와 WebP에는 품질 85를 적용하며, 원본 메타데이터 태그를 출력물에 복사해요.',
        '요청한 높이는 요금제의 출력 한도로, 치수는 ImageMagick이 만들 수 있는 범위로 제한해요.',
      ],
      flowSteps: [
        {
          title: '이미지 업로드',
          description: '요금제의 파일당 한도 이내의 JPG, PNG, WebP, GIF.',
        },
        {
          title: '너비, 높이 또는 둘 다 입력',
          description: '값 하나는 비율을 유지해요. 값 두 개는 상자 크기를 강제해요. 비율을 바꿔야 한다면 먼저 자르세요.',
        },
        {
          title: 'ImageMagick이 크기 조절',
          description: 'convert input -auto-orient [-crop WxH+X+Y] -resize <arg> [-quality 85] output.',
        },
        {
          title: '다운로드',
          description: '크기가 조절된 파일은 작업 출력 폴더에서 converted.<format>으로 제공돼요.',
        },
      ],
      advancedDetails: [
        '크기 조절 인수는 convertImage(converter.go)에서 만들어져요. 두 값을 모두 입력하면 WxH!(정확한 크기 강제), 너비만 입력하면 Wx, 높이만 입력하면 xH가 돼요. ImageMagick의 기본 리샘플링 필터를 사용하며, 다른 필터를 고르는 옵션은 없어요.',
        '자르기를 설정하면 -crop WxH+X+Y로 전달되어 -resize보다 먼저 실행되므로, 자르기 좌표는 크기를 조절한 결과가 아니라 방향이 자동으로 맞춰진 원본을 기준으로 해요.',
        '서버는 10000을 넘거나 1보다 작은 너비나 높이를 거부하며, 양식은 두 칸 모두 4096으로 제한해요.',
        '높이를 명시하면 업로드가 수락되기 전에 요금제의 출력 높이 한도와도 비교해요. 기본값은 비회원 1080 px, 무료 계정 1440, Premium과 Pro는 2160이에요. 한도를 넘는 요청은 두 숫자를 모두 알려 주는 메시지와 함께 거부되며 작업 횟수는 차감되지 않아요. 너비만 입력한 경우에는 확인하지 않아요.',
        'JPG와 WebP 출력에는 숫자를 바꾸지 않는 한 -quality 85가 적용되고, PNG와 GIF는 이를 무시해요. 이 도구로 확대하면 기존 픽셀을 보간할 뿐이라 2배나 4배 확대는 흐릿해 보여요. 그런 경우를 위해 AI 업스케일러가 있어요.',
        'ImageMagick이 끝나면 기본 메타데이터 모드에서 exiftool이 원본 태그를 결과물에 복사하므로, 크기를 조절한 파일에도 촬영 날짜, 카메라 모델, GPS 위치가 그대로 남아요.',
      ],
      whyItMatters: [
        '아바타, 커버, 썸네일 자리는 특정 픽셀 크기를 요구하며, 플랫폼이 알아서 하는 크기 조절은 대개 화질이 더 낮고 통제할 수도 없어요.',
        '픽셀 수는 파일 크기를 좌우하는 가장 큰 단일 요인이에요. 너비 1920 px로 표시되는 24메가픽셀 사진은 화면이 보여 줄 수 있는 데이터의 열 배를 담고 있어요.',
        '직접 크기를 조절하면 정사각형 자리가 머리를 잘라 내게 두는 대신 자를 영역도 직접 고를 수 있어요.',
      ],
      useCases: [
        {
          title: '프로필 사진과 아바타',
          description: '정사각형으로 자른 다음 서비스가 요구하는 400 또는 512 px로 조절하세요.',
        },
        {
          title: '웹 및 블로그 이미지',
          description: '카메라 사진을 실제로 표시될 칼럼 너비에 맞춰 조절하세요.',
        },
        {
          title: '배너와 헤더',
          description: '정확한 가로세로 비율로 자른 다음, 요구되는 너비를 픽셀 단위까지 맞추세요.',
        },
        {
          title: '양식 업로드 한도',
          description: '치수를 줄여 메가픽셀이나 메가바이트 한도 아래로 맞추세요.',
        },
      ],
      workedExamples: [
        {
          title: '6000 x 4000 카메라 JPEG를 너비 1920 px로 조절',
          body: '입력: 미러리스 카메라로 찍은 8.5 MB, 24메가픽셀 JPEG. 설정: 너비 1920, 높이 비움, 형식 그대로, 품질 85. 서버는 convert input -auto-orient -resize 1920x -quality 85 converted.jpg를 실행해요. 비율이 3:2이므로 출력은 1920 x 1280 픽셀, 약 2.46메가픽셀로 원본 픽셀 수의 대략 십분의 일이에요. 파일 크기도 비슷한 비율로 줄어드니 1 MB 미만을 예상하세요. 24메가픽셀에 대한 ImageMagick 처리 한 번은 서버에서 몇 초 걸리고, 그 뒤의 exiftool 복사로 렌즈와 노출 태그가 유지돼요.',
        },
        {
          title: '3024 x 4032 세로 휴대폰 사진으로 만든 400 x 400 아바타',
          body: '입력: 너비 3024, 높이 4032인 3.1 MB 세로 JPEG. 400과 400만 입력하면 -resize 400x400!이 실행되어 3:4 그림이 정사각형으로 찌그러져요. 대신 자르기를 오프셋 0,504에서 3024 x 3024(가운데의 정사각형)로 설정한 다음 너비 400, 높이 400을 입력하세요. 명령은 convert input -auto-orient -crop 3024x3024+0+504 -resize 400x400! -quality 85 converted.jpg가 되고, 결과는 160,000픽셀의 왜곡 없는 400 x 400 JPG로 몇십 킬로바이트 정도예요. 자르기와 크기 조절은 한 번의 처리로 이루어지며 몇 초 안에 끝나요.',
        },
      ],
      whenNotToUse: '작은 이미지를 크게 만드는 데는 크기 조절 도구를 쓰지 마세요. ImageMagick은 있는 픽셀을 보간할 뿐이라 640 px 사진을 2560 px로 늘리면 흐릿하게 나오며, 그런 경우는 AI 업스케일러의 몫이에요. 먼저 자르지 않았다면 그림과 비율이 다른 너비와 높이를 둘 다 입력하지 마세요. 정확한 상자 모드는 레터박스를 넣는 대신 그림을 늘려요. 파일은 크지만 치수가 이미 알맞다면 픽셀은 그대로 두고 대신 압축 도구를 쓰세요. 그리고 움직이는 GIF는 단순한 크기 조절보다 전용 GIF 도구로 다루는 편이 좋아요.',
      whyMediaManipulator: [
        '정확한 상자 모드와 비율 유지 모드의 동작을 실제 ImageMagick 인수와 함께 여기에 자세히 적어 두었으므로, 사진이 늘어난 채 돌아와도 놀랄 일이 없어요.',
        '자르기, 크기 조절, 형식, 품질을 한 번의 업로드로 처리하며, 출력물에 워터마크가 없어요.',
        '표준 도구는 가입이 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ],
      privacyNote: '업로드한 그림은 저희 서버의 uploads/<jobId>/에, 크기를 조절한 사본은 outputs/<jobId>/에 저장돼요. 두 디렉터리 모두 보관 기록에 올라가 함께 삭제돼요. 기본 메타데이터 모드에서는 exiftool이 원본 태그를 크기를 조절한 파일에 복사하므로, 양식의 메타데이터 섹션에서 제거를 고르지 않으면 GPS 좌표와 카메라 일련번호가 결과물에 함께 남아요. 크기 조절을 위해 업로드한 이미지도 저희 서버에서 모든 이미지에 실행되는 자동 분석을 거치며, 이 분석은 로컬 비전 모델을 사용하고 요약은 작업 폴더에 저장돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 외부의 누구도 파일을 받지 않아요.',
      faq: [
        {
          question: '크기 조절에 비용이 드나요?',
          answer: '표준 도구는 계정도 결제도 필요 없어요. 크기 조절 한 번은 일일 일반 작업 한 번으로 계산돼요. 기본값으로 비회원은 하루 5회, 무료 계정은 30회이며, 파일당 한도는 각각 200 MB와 1 GB예요. Premium과 Pro는 횟수를 300회와 700회로 늘려요. 현재 적용되는 숫자는 /pricing에서 확인하세요.',
        },
        {
          question: '가로세로 비율을 유지하려면 어떻게 하나요?',
          answer: '두 칸 중 하나만 채우세요. 너비만 입력하면 -resize 1600x가 되고 높이는 원본 비율로 계산돼요. 높이만 입력하면 x900이 되고 너비가 그에 따라 정해져요.',
        },
        {
          question: '이미지가 왜 늘어난 채로 나왔나요?',
          answer: '그림과 맞지 않는 비율로 너비와 높이를 둘 다 입력했기 때문이에요. 값 두 개는 WxH!로 전송되어 정확히 그 크기의 상자를 강제해요. 같은 양식에서 먼저 목표 비율로 자른 다음 두 값을 설정하세요.',
        },
        {
          question: '요청할 수 있는 최대 크기는 얼마인가요?',
          answer: '양식은 각 칸에 최대 4096까지, 서버는 최대 10000까지 받아요. 요금제 출력 한도(기본값으로 비회원 1080 px)를 넘는 높이를 명시하면 업로드가 시작되기 전에 거부되며 아무것도 차감되지 않아요.',
        },
        {
          question: '이 도구로 작은 사진을 크게 만들 수 있나요?',
          answer: '더 큰 숫자를 입력할 수는 있지만 ImageMagick은 보간만 하므로 결과가 흐릿해요. 세부 묘사를 다시 만들어 내는 2배 또는 4배 확대에는 Real-ESRGAN을 실행하는 AI 업스케일러를 사용하세요.',
        },
        {
          question: '출력물에 EXIF 데이터와 방향이 유지되나요?',
          answer: '픽셀의 방향을 먼저 자동으로 맞추므로 결과물은 어디서나 똑바로 표시되고, 기본 모드에서는 exiftool이 원본 태그를 다시 복사해요. 태그를 없애고 싶다면 제거를 고르세요.',
        },
        {
          question: 'GIF 크기도 조절할 수 있나요?',
          answer: 'GIF는 입력과 출력 모두 지원되며 같은 ImageMagick 명령을 거쳐요. 이 도구는 정지 이미지용으로 만들어졌으므로, 움직이는 GIF는 전용 GIF 도구를 쓰면 프레임과 팔레트를 더 세밀하게 다룰 수 있어요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '가로세로 비율을 유지하며 비례적으로 조절하려면 치수 하나를 비워 두세요.',
        ],
      },
      related: [
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '치수는 그대로 두고 품질을 낮추세요.',
        },
        {
          label: 'AI 이미지 업스케일러',
          to: '/tools/ai-image-upscaler',
          description: '보간 대신 모델로 2배 또는 4배 확대하세요.',
        },
        {
          label: '이미지에서 EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '크기 조절 시 기본으로 유지되는 태그를 제거하세요.',
        },
        {
          label: '이미지를 PDF로',
          to: '/tools/image-to-pdf',
          description: '크기를 조절한 이미지를 PDF 페이지에 담으세요.',
        },
        {
          label: '이미지 변환기 튜토리얼',
          to: '/tutorials/image/getting-started',
          description: '크기 조절, 자르기, 품질 설정을 살펴보세요.',
        },
      ],
      embed: {
        title: '이미지 크기 조절',
        description: '이미지를 업로드하고 아래에서 목표 너비와 높이 중 하나 또는 둘 다를 설정하세요. 하나를 비워 두면 비례적으로 조절되어 원본 가로세로 비율이 유지돼요. 직접 바꾸지 않으면 출력 형식은 그대로예요.',
      },
    },
    'remove-background-from-image': {
      name: '이미지 배경 제거',
      h1: '이미지 배경 온라인 무료 제거',
      tagline: '어떤 사진이든 배경을 자동으로 지우고 깔끔한 투명 PNG 누끼 이미지를 내려받으세요.',
      metaTitle: '이미지 배경 온라인 무료 제거 | Media Manipulator',
      metaDescription: '무료 온라인 배경 제거 도구입니다. 어떤 사진이든 배경을 자동으로 지우고 투명 PNG를 내려받으세요. 자체 GPU에서 실행되며 외부 AI를 쓰지 않습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '이미지 배경 온라인 무료 제거',
      ogDescription: '어떤 사진이든 배경을 자동으로 지우고 투명 PNG 누끼 이미지를 내려받으세요. 무료이며 가입이 필요 없어요.',
      intro: '이 페이지는 AI 작업이 배경 제거로, 출력이 PNG로 고정된 이미지 변환기를 열어요. 변환하면 서버가 파일을 직접 보유한 GPU에서 실행되는 오픈 소스 분할 도구 rembg에 넘겨요. rembg는 기본적으로 BiRefNet General 모델을 불러와 어떤 픽셀이 피사체에 속하는지 예측하고, 그 밖의 모든 영역은 알파 채널이 투명한 PNG를 써요. 일반 모델이 머리카락, 유리, 복잡한 배경 앞의 사람을 잘못 판단하는 경우를 위해 양식에서 다른 모델 여섯 가지(더 가벼운 BiRefNet, 인물용 변형, ISNet, U2Net 빌드 세 가지)를 고를 수 있어요.',
      whatItDoes: [
        '선택한 모델(바꾸지 않으면 BiRefNet General)로 rembg를 실행하고 투명한 배경 위의 피사체를 돌려줘요.',
        '투명도에는 알파 채널이 필요하고 API가 이 작업에 .png 확장자를 강제하므로 항상 PNG로 저장해요.',
        '업로드한 이미지의 픽셀 크기를 그대로 유지해요. 누끼 이미지는 크기가 조절되거나 잘리지 않아요.',
        'CUDA를 사용하는 ONNX Runtime으로 자체 GPU에서 실행돼요. 어떤 이미지도 외부 AI 서비스로 전송되지 않아요.',
        'AI 작업이 아니라 일반 작업 한 건으로 계산돼요. 단순한 형식 변환과 같은 단위예요.',
      ],
      flowSteps: [
        {
          title: 'JPG, PNG 또는 WebP 업로드',
          description: '뚜렷한 피사체가 하나일 때 가장 깔끔한 마스크가 나와요.',
        },
        {
          title: '모델 선택 또는 기본값 유지',
          description: 'BiRefNet General이 미리 선택되어 있어요. 사람에게는 인물 모델과 인체 분할 모델을 쓸 수 있어요.',
        },
        {
          title: 'GPU에서 rembg가 분할',
          description: 'CUDA ONNX Runtime 환경을 불러온 상태에서 rembg i -m <model> input output.png가 실행돼요.',
        },
        {
          title: '투명 PNG 다운로드',
          description: '결과는 작업 출력 폴더의 converted.png예요.',
        },
      ],
      advancedDetails: [
        '호출은 ai_tools.go의 RemoveBackground예요. bash 셸이 ONNX Runtime CUDA 환경 스크립트를 불러오고, U2NET_HOME을 서버 모델 디렉터리로 설정한 다음 rembg i -m <model> <input> <output>을 실행해요. 모델 가중치는 서버에 캐시되므로, 재시작 후 첫 작업은 가중치를 불러오는 동안 조금 더 오래 걸릴 수 있어요.',
        '허용되는 모델 이름은 birefnet-general, birefnet-general-lite, isnet-general-use, u2net, u2netp, u2net_human_seg, birefnet-portrait이며, 그 밖의 값은 작업이 시작되기 전에 거부돼요. 빈 값은 birefnet-general이 돼요.',
        'AI 경로는 ImageMagick 파이프라인을 완전히 대체하므로 양식의 품질 값, 필터, 색조, 텍스트 오버레이, 메타데이터 옵션은 이 작업에 아무 영향을 주지 않아요. 출력은 rembg가 쓴 그대로예요.',
        'AI 작업에서는 일반적인 exiftool 복사 단계가 실행되지 않으므로 PNG에는 원본의 EXIF가 없어요. 누끼 이미지에 태그가 필요하면 메타데이터 편집기로 두 번째 작업에서 추가할 수 있어요.',
        '출력 크기는 피사체에 따라 달라져요. 완전히 투명한 영역은 PNG에서 거의 용량을 차지하지 않을 만큼 압축되므로, 큰 캔버스 위의 작은 제품은 작은 파일이 되고 화면을 가득 채운 피사체는 원본을 무손실 PNG로 저장한 것과 비슷한 크기가 돼요.',
      ],
      whyItMatters: [
        '제품 목록, 썸네일, 합성 이미지는 모두 누끼에서 시작하고, 손으로 마스크를 따면 이미지 한 장에 몇 분씩 걸려요.',
        '마켓플레이스는 점점 더 단색이나 흰색 배경을 요구하는데, 이는 투명한 누끼 이미지를 흰색 레이어 위에 올린 것이에요.',
        '수백만 개의 마스크로 학습한 모델은 자동 선택 도구보다 털, 머리카락, 반투명 가장자리를 더 잘 처리해요.',
      ],
      useCases: [
        {
          title: '전자상거래 제품',
          description: '상품만 분리해 흰색이나 원하는 브랜드 색상 위에 올리세요.',
        },
        {
          title: '프로필 사진과 팀 소개 페이지',
          description: '인물 모델로 사무실 배경에서 사람을 깔끔하게 오려 내세요.',
        },
        {
          title: '사진에서 가져온 로고',
          description: '색이 있는 간판이나 페이지에만 있는 로고의 투명 버전을 얻으세요.',
        },
        {
          title: '썸네일과 스티커',
          description: '편집기에서 여러 누끼 이미지로 레이어 디자인을 만드세요.',
        },
      ],
      workedExamples: [
        {
          title: '기본 모델로 처리한 3000 x 2000 제품 JPEG',
          body: '입력: 회색 배경 위의 신발을 찍은 2.1 MB, 3000 x 2000 JPEG. 모델은 BiRefNet General 그대로 둬요. 서버는 GPU에서 rembg를 실행해 같은 3000 x 2000 픽셀, 네 채널의 converted.png를 써요. 압축하지 않으면 RGBA로 24 MB지만 투명한 배경은 거의 용량을 차지하지 않을 만큼 압축되므로, PNG 크기는 신발 자체가 좌우해요. PNG는 무손실이라 보통 몇 메가바이트예요. 소요 시간은 이미지에 대한 모델의 순전파 한 번과 PNG 인코딩이며, 모델이 준비된 상태라면 몇 초예요. 한동안 사용이 없다가 처음 실행하면 가중치를 불러오는 시간이 더해져요.',
        },
        {
          title: '인물 모델로 처리한 1080 x 1080 프로필 사진',
          body: '입력: 책장 앞에서 찍은 640 KB, 1080 x 1080 WebP 셀카. 모델을 사람과 머리카락에 맞게 조정된 BiRefNet Portrait로 바꿔요. 출력은 사람은 불투명하고 책장은 완전히 투명한 1080 x 1080 PNG예요. 1.17메가픽셀이라 모델 처리는 빨라요. 실제 소요 시간의 대부분은 업로드와 PNG 쓰기예요. AI 경로는 메타데이터 복사를 건너뛰므로 PNG에 EXIF가 없는데, 프로필 이미지라면 보통 이쪽이 바라는 결과예요.',
        },
      ],
      whenNotToUse: '피사체가 뚜렷한 하나의 대상이 아니라면 이 도구를 쓰지 마세요. 군중, 풍경, 패턴, 뚜렷한 전경이 없는 실내는 모델이 분리할 대상이 없어 마스크가 제멋대로 만들어져요. 피사체 뒤를 투명하게 하는 대신 부드럽게 흐리고 싶을 때, 결과가 JPG로 필요할 때(JPG는 알파 채널을 담을 수 없어 나중에 평탄화해야 해요), 입력이 스크린샷이나 선화일 때도 맞지 않는 도구예요. 스크린샷이나 선화에는 사진으로 학습한 모델보다 ISNet이나 편집기에서 직접 선택하는 편이 더 잘 맞아요.',
      whyMediaManipulator: [
        '실제 분할 모델 일곱 가지를 이름 그대로 제공하므로, 가장자리가 잘못 나오면 일반 모델에서 인물 모델이나 U2Net 빌드로 바꿀 수 있어요.',
        '출력은 워터마크도 강제 축소도 없는 원본 해상도의 투명 PNG예요.',
        '모델은 직접 운영하는 하드웨어에서 실행되고, 기본 도구는 계정이 필요 없어요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      ],
      privacyNote: '사진은 서버의 uploads/<jobId>/에 저장되고, 같은 머신의 GPU에서 실행되는 rembg가 읽어요. 누끼 이미지는 outputs/<jobId>/converted.png에 저장돼요. 분할을 위해 외부 API를 호출하지 않으며, 이미지의 어떤 내용도 학습에 사용되지 않아요. 다른 모든 이미지 업로드와 마찬가지로, 파일은 서버에서 호스팅하는 비전 모델을 사용하는 자동 분석 단계에서도 한 번 검사되고, 그 요약은 작업과 함께 저장돼요. AI 작업에서는 메타데이터 복사 단계가 실행되지 않으므로 PNG에는 원본의 EXIF가 없어요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: '배경 제거는 무료인가요?',
          answer: '네, 일일 한도 안에서 무료예요. 배경 제거는 별도의 AI 작업 한도가 아니라 의도적으로 일반 작업으로 계산돼요. 기본적으로 비회원은 하루 5건, 무료 계정은 30건이며, 파일당 한도는 각각 200 MB와 1 GB예요. Premium과 Pro는 300건과 700건이에요. 현재 수치는 /pricing에서 확인하세요.',
        },
        {
          question: '어떤 모델을 골라야 하나요?',
          answer: '사물, 제품, 대부분의 사진에는 BiRefNet General을 그대로 쓰세요. 사람에게는 BiRefNet Portrait나 U2Net Human Segmentation을, 큰 이미지를 더 빠르게 처리하고 싶을 때는 BiRefNet General Lite나 U2Net Lite를 고르세요.',
        },
        {
          question: '출력이 항상 PNG인 이유는 무엇인가요?',
          answer: '누끼 이미지에는 알파 채널이 필요하기 때문에 API가 이 작업에 .png 확장자를 강제해요. JPG에는 알파 채널이 없어 배경이 검은색이나 흰색으로 보일 거예요. 단색 위에 평탄화했다면 그다음에 다른 형식으로 변환하세요.',
        },
        {
          question: '투명 대신 흰색 배경으로 받을 수 있나요?',
          answer: '이 도구에서 바로는 안 돼요. 아무 편집기나 Darkroom에서 PNG를 흰색 레이어 위에 올리세요. 투명한 픽셀은 아래에 있는 색을 띠게 돼요.',
        },
        {
          question: '머리카락, 털, 유리에도 잘 되나요?',
          answer: '대체로 잘 돼요. 인물 모델과 BiRefNet 모델은 그런 가장자리를 염두에 두고 학습했지만, 반투명 영역은 가장 어려운 경우예요. 첫 번째 모델이 테두리를 남기면 다른 모델을 써 보세요.',
        },
        {
          question: '내 사진이 외부 AI 회사로 전송되나요?',
          answer: '아니요. rembg와 모델은 자체 GPU 서버에서 실행되며, 작업 중에 서드파티 API를 호출하지 않아요.',
        },
        {
          question: '누끼 이미지에 EXIF 데이터가 남나요?',
          answer: '아니요. AI 작업은 일반 변환기가 수행하는 exiftool 복사를 건너뛰므로 PNG에는 카메라, 날짜, GPS 태그가 없어요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '출력은 항상 투명 PNG예요. 배경 제거는 서드파티 API가 아닌 자체 로컬 GPU 서버에서 실행돼요.',
        ],
      },
      related: [
        {
          label: '사진에서 개체 제거',
          to: '/tools/remove-object-from-photo',
          description: '한 가지만 지우고 나머지 장면은 그대로 둬요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '누끼 이미지를 레이아웃에 필요한 크기로 조절해요.',
        },
        {
          label: 'AI 이미지 업스케일러',
          to: '/tools/ai-image-upscaler',
          description: '작은 누끼 이미지를 배치하기 전에 확대해요.',
        },
        {
          label: '사진 속 얼굴 흐리게 처리',
          to: '/tools/blur-faces-in-photo',
          description: '사람을 분리하는 대신 익명으로 처리해요.',
        },
        {
          label: '이미지 변환기 튜토리얼',
          to: '/tutorials/image/getting-started',
          description: '모든 AI 및 이미지 옵션을 차례로 살펴봐요.',
        },
      ],
      embed: {
        title: '이미지 배경 제거하기',
        description: '사진을 업로드하세요. 이 도구는 AI 배경 제거로 미리 설정되어 있고 투명 PNG를 출력해요. 업로드하고 변환만 하면 피사체는 남고 배경은 지워져요.',
      },
    },
    'image-to-pdf': {
      name: '이미지를 PDF로',
      h1: '이미지를 PDF로 온라인 무료 변환',
      tagline: 'JPG, PNG 등의 이미지를 깔끔하고 공유하기 쉬운 PDF 문서로 한 번에 바꾸세요.',
      metaTitle: '이미지를 PDF로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 이미지 PDF 변환기입니다. JPG, PNG 등의 이미지를 깔끔한 PDF 문서로 바꾸세요. 가입도 워터마크도 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '이미지를 PDF로 온라인 무료 변환',
      ogDescription: 'JPG, PNG 등의 이미지를 깔끔하고 공유하기 쉬운 PDF로 바꾸세요. 무료이고 빠르며 가입이 필요 없어요.',
      intro: '이 페이지는 출력 형식을 PDF로 고정해요. 그러면 이미지는 API의 전용 경로로 보내지고, 이 경로는 ImageMagick이나 Ghostscript를 거치지 않고 순수 Go로 문서를 만들어요. JPEG는 /DCTDecode 필터로 바이트 하나까지 그대로 삽입되므로, PDF 안의 사진은 업로드한 것과 똑같은 압축 스트림이에요. PNG, GIF, WebP는 디코딩한 뒤 흰색 위에 합성해 zlib으로 압축한 8비트 RGB로 저장해요. 한 페이지의 크기는 이미지가 인치당 96픽셀이 되도록 정해져요. 모든 픽셀이 0.75포인트가 되므로 리샘플링 없이 원래 해상도가 유지돼요.',
      whatItDoes: [
        '이미지 한 장을 96 DPI 기준 이미지 크기에 맞춘 한 페이지짜리 PDF 1.4 문서로 감싸요.',
        'JPEG 데이터를 손대지 않고 삽입하므로 사진이 다시 압축되는 일이 없어요.',
        '투명한 PNG와 GIF 픽셀을 흰색 위에 평탄화하고 zlib으로 무손실 저장해요.',
        'WebP처럼 Go가 디코딩할 수 없는 컨테이너는 먼저 ImageMagick으로 래스터화한 뒤 그 결과를 무손실로 삽입해요.',
        '품질, 크기 조절, 자르기, 필터, AI 설정은 무시해요. PDF 경로는 이미지만 받아요.',
      ],
      flowSteps: [
        {
          title: '아무 이미지나 업로드',
          description: '보통 JPG, PNG, GIF, WebP를 넣지만, 어떤 이미지 형식이든 받아요.',
        },
        {
          title: '서버가 픽셀 읽기',
          description: 'JPEG 크기는 헤더에서 읽고, 다른 형식은 디코딩해 RGB로 평탄화해요.',
        },
        {
          title: '한 페이지짜리 PDF 조립',
          description: '카탈로그, 페이지, 이미지 XObject, 그리고 이미지가 페이지를 채우도록 그리는 콘텐츠 스트림으로 구성돼요.',
        },
        {
          title: 'converted.pdf 다운로드',
          description: '보관 기간이 끝날 때까지 작업 출력 폴더에서 제공돼요.',
        },
      ],
      advancedDetails: [
        '빌더는 pdf_tools.go의 imageToPDFBytes예요. JPEG 마커 FF D8 FF로 시작하는 파일은 /DeviceRGB 또는 /DeviceGray와 함께 /DCTDecode로 삽입돼요. CMYK JPEG는 디코딩 후 평탄화하는 경로로 넘어가므로 PDF에 CMYK 스트림이 들어가는 일은 없어요.',
        'JPEG가 아닌 입력은 Go 이미지 코덱(PNG와 GIF가 등록됨)으로 디코딩해요. 각 픽셀은 흰색 위에 알파 합성되어 세 바이트로 기록되고, 버퍼 전체를 zlib으로 압축해 구성 요소당 8비트, /FlateDecode로 저장해요.',
        'WebP를 비롯해 Go가 디코딩할 수 없는 형식은 먼저 ImageMagick이 -auto-orient로 메모리 안의 PNG 스트림으로 래스터화하고, 그 PNG를 평탄화해 삽입해요.',
        '포인트 단위의 페이지 크기는 너비 x 72 / 96, 높이 x 72 / 96이므로 1200 x 1600 이미지는 900 x 1200포인트 페이지(12.5 x 16.7인치)가 돼요. PDF 뷰어는 페이지를 창에 맞게, 프린터는 용지에 맞게 조절하므로 큰 페이지도 보는 데는 문제가 없지만, 인쇄할 때는 "페이지에 맞춤"을 설정하세요.',
        '빠른 경로를 거친 JPEG는 Orientation 플래그를 포함한 EXIF를 유지하지만, PDF 뷰어는 EXIF 방향을 적용하지 않아요. 회전 플래그와 함께 옆으로 저장된 휴대폰 사진은 PDF에서 옆으로 보여요. 먼저 JPG로 한 번 변환한 뒤(자동 회전이 적용돼요) PDF로 변환하세요.',
        '양식이 보내는 품질 값은 받지만 이 경로에서는 쓰이지 않아요. 여러 이미지를 넣는 모드도 없어요. 업로드 한 번에 한 페이지짜리 PDF 하나가 만들어져요.',
      ],
      whyItMatters: [
        '비자, 대학, 인사 시스템의 포털은 영수증 사진조차 PDF만 받는 경우가 많아요.',
        'PDF는 어느 기기에서나 똑같이 인쇄되고 미리 보이지만, 이미지 파일만 보내면 뷰어가 회전하거나 크기를 바꿀 수 있어요.',
        'JPEG를 손대지 않고 삽입하므로 PDF는 교정쇄 수준의 품질이에요. 들어가는 과정에서 아무것도 다시 인코딩되지 않았어요.',
      ],
      useCases: [
        {
          title: '영수증과 서식',
          description: '서명한 페이지를 휴대폰으로 찍은 사진을 포털이 받아 주는 PDF로 바꾸세요.',
        },
        {
          title: '신분증과 서류 업로드',
          description: '스캔한 카드나 증명서를 양식이 요구하는 PDF로 제출하세요.',
        },
        {
          title: '아트워크 시안',
          description: '투명도를 흰색으로 평탄화한 PNG 디자인을 PDF로 클라이언트에게 보내세요.',
        },
        {
          title: '보관',
          description: '사진을 다른 문서와 같은 형식으로 함께 보관하세요.',
        },
      ],
      workedExamples: [
        {
          title: '3024 x 4032 휴대폰 JPEG(2.9 MB)',
          body: '입력: 가로 3024, 세로 4032의 2.9 MB RGB JPEG. 헤더에서 크기를 읽고 JPEG 스트림을 /DCTDecode로 그대로 삽입해요. 페이지는 너비 3024 x 0.75 = 2268포인트, 높이 4032 x 0.75 = 3024포인트로, 31.5 x 42인치예요. 아무것도 다시 인코딩하지 않으므로 PDF는 약 2.9 MB에 킬로바이트도 안 되는 PDF 구조를 더한 크기로 나와요. 작업은 파일을 읽고 다시 쓰는 것뿐이라 CPU보다 디스크와 업로드 속도에 좌우되며, 몇 초 안에 끝나요.',
        },
        {
          title: '투명 배경이 있는 1920 x 1080 PNG',
          body: '입력: 투명 배경 위 로고가 담긴 1.4 MB PNG. PNG를 디코딩하고 모든 픽셀을 흰색 위에 합성한 뒤, 1920 x 1080 x 3 = 6,220,800바이트의 RGB를 zlib으로 압축해 /FlateDecode로 저장해요. 페이지는 1440 x 810포인트(20 x 11.25인치)예요. 균일한 흰색과 단색은 zlib에서 잘 압축되므로 PDF는 보통 PNG와 비슷한 크기이고, 단순 zlib에는 PNG가 쓰는 행 필터가 없어서 가끔은 더 커지기도 해요. 디코딩, 이백만 개 픽셀의 합성, 압축은 CPU 작업이라 몇 초가 걸려요. 결과에서 투명도는 설계상 사라져요.',
        },
      ],
      whenNotToUse: '여러 페이지 문서에는 맞지 않는 도구예요. 이미지 한 장으로 정확히 한 페이지를 만들기 때문에, 스캔본 여러 장은 페이지마다 변환한 뒤 PDF 편집기에서 합쳐야 해요. 모든 픽셀이 흰색 위에 평탄화되므로 투명도가 유지되어야 할 때도 쓰지 마세요. 파일이 작아지길 기대하지도 마세요. JPEG는 그대로 삽입되고 PNG는 zlib으로 압축한 RGB가 되므로, 용량이 중요하다면 먼저 이미지를 압축하거나 크기를 줄이세요. 그리고 올바른 방향 정보가 EXIF 플래그에만 있는 사진은 미리 JPG로 한 번 변환하세요. 그렇지 않으면 PDF에 저장된 방향 그대로 보여요.',
      whyMediaManipulator: [
        'JPEG를 그대로 통과시키는 것은 의도한 설계예요. 사진이 다시 인코딩되지 않고 삽입되는데, 많은 변환기가 이를 약속하지 않아요.',
        '경로에 Ghostscript도 ImageMagick PDF 정책도 없으므로, PDF를 거부할 수 있는 서버 측 보안 설정에 변환이 좌우되지 않아요.',
        '기본 도구는 무료이며 계정이 필요 없어요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      ],
      privacyNote: '이미지는 자체 서버의 uploads/<jobId>/에, PDF는 outputs/<jobId>/converted.pdf에 저장되며, 보관 기간이 끝나면 둘 다 함께 삭제돼요. JPEG는 스트림이 그대로 복사되므로 PDF 안에 삽입된 메타데이터를 모두 유지해요. 따라서 이미지를 추출하는 사람은 누구나 EXIF 위치와 카메라 태그를 읽을 수 있어요. 이것이 신경 쓰인다면 먼저 EXIF 삭제 도구로 제거하세요. PNG와 다른 입력은 원시 픽셀로 디코딩되므로 태그가 넘어가지 않아요. 업로드한 파일 자체는 이미지이므로 서버에서 실행되는 비전 모델 자동 분석도 거치며, 그 요약은 작업과 함께 남아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: '이미지를 PDF로 변환하는 기능은 무료인가요?',
          answer: '기본 도구는 무료예요. 변환할 때마다 일일 일반 작업 한 건을 써요. 기본값 기준으로 비회원은 하루 5건에 파일 한도 200 MB, 무료 계정은 하루 30건에 1 GB, Premium과 Pro는 300건 또는 700건이며, 모두 /pricing에 나와 있어요.',
        },
        {
          question: 'PDF 안에서 사진이 다시 압축되나요?',
          answer: 'JPEG라면 아니에요. 원본 바이트가 /DCTDecode로 삽입돼요. PNG, GIF, WebP는 평탄화한 뒤 zlib으로 압축한 RGB로 무손실 저장되므로 역시 화질 손실이 없어요.',
        },
        {
          question: 'PDF의 페이지 크기는 어떻게 되나요?',
          answer: '페이지는 인치당 96픽셀 기준으로 이미지에 맞춰지므로, 포인트 단위의 너비와 높이는 픽셀 크기의 0.75배예요. 1200 x 1600 이미지는 12.5 x 16.7인치 페이지가 되고, 뷰어와 프린터가 맞게 조절해요.',
        },
        {
          question: '여러 이미지를 PDF 하나로 합칠 수 있나요?',
          answer: '이 페이지에서는 안 돼요. 업로드할 때마다 한 페이지짜리 PDF가 만들어져요. 이미지를 각각 변환한 뒤 PDF 편집기에서 결과 PDF를 합치세요.',
        },
        {
          question: '투명도는 어떻게 되나요?',
          answer: '흰색 위에 평탄화돼요. 이 경로의 PDF 이미지 XObject에는 알파가 없으므로 투명한 픽셀은 흰색 픽셀이 돼요.',
        },
        {
          question: 'PDF에서 휴대폰 사진이 옆으로 누워 있는 이유는 무엇인가요?',
          answer: '휴대폰은 픽셀을 가로 방향으로 저장하고 EXIF Orientation 플래그를 설정하는 경우가 많아요. JPEG는 손대지 않고 삽입되며 PDF 뷰어는 이 플래그를 무시해요. 먼저 이미지 변환기에서 사진을 JPG로 변환해 자동 회전을 적용한 다음, 그 결과를 PDF로 변환하세요.',
        },
        {
          question: 'PDF에 EXIF 데이터가 남나요?',
          answer: 'JPEG라면 남아요. EXIF를 포함한 JPEG 스트림 전체가 PDF 안에 들어가기 때문이에요. 원하지 않으면 먼저 EXIF 삭제 도구를 사용하세요. PNG와 다른 입력은 픽셀만 남아요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '출력은 한 페이지짜리 PDF예요. PDF 페이지는 불투명하므로 투명도는 흰색 위에 평탄화돼요.',
        ],
      },
      related: [
        {
          label: 'PDF를 JPG로',
          to: '/tools/pdf-to-jpg',
          description: 'PDF 페이지를 다시 이미지로 렌더링해요.',
        },
        {
          label: 'EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: 'PDF에 삽입되기 전에 태그를 제거해요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: 'PDF가 JPEG를 그대로 삽입하므로 먼저 JPEG를 줄여요.',
        },
        {
          label: 'AI 문서 스캔',
          to: '/tools/ai-document-scan',
          description: '찍은 페이지를 단순히 감싸는 대신 정리하고 OCR해요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '픽셀 크기, 즉 페이지 크기를 먼저 정해요.',
        },
      ],
      embed: {
        title: '이미지를 PDF로 변환하기',
        description: 'JPG, PNG 등 어떤 이미지든 업로드하세요. 이 도구의 출력은 PDF로 고정되어 있어, 이미지를 원래 해상도 그대로 감싼 한 페이지짜리 PDF를 받을 수 있어요.',
      },
    },
    'pdf-to-jpg': {
      name: 'PDF를 JPG로',
      h1: 'PDF를 JPG로 온라인 무료 변환',
      tagline: 'PDF의 모든 페이지를 공유, 편집, 게시할 수 있는 고화질 JPG 이미지로 변환하세요.',
      metaTitle: 'PDF를 JPG로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 PDF JPG 변환기입니다. PDF의 모든 페이지를 고화질 JPG 이미지로 변환해 ZIP으로 내려받으세요. 가입이 필요 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'PDF를 JPG로 온라인 무료 변환',
      ogDescription: 'PDF의 모든 페이지를 고화질 JPG 이미지로 렌더링하세요. 무료이고 빠르며 가입이 필요 없어요.',
      intro: 'PDF를 업로드하면 서버가 Poppler 툴킷의 pdftoppm으로 각 페이지를 렌더링해요. 많은 데스크톱 PDF 뷰어가 쓰는 것과 같은 래스터라이저예요. 이 페이지의 양식은 JPG, 모든 페이지, 150 DPI로 미리 설정되어 있어요. DPI를 100, 200, 300으로 바꾸거나, 작업을 첫 페이지로 제한하거나, 기본값이 90인 JPEG 품질을 설정할 수 있어요. 모든 페이지를 선택하면 page-001.jpg, page-002.jpg 등이 담긴 ZIP을, 첫 페이지만 선택하면 JPG 한 장을 받아요. 렌더링 전에 pdfinfo가 페이지 수를 세고, 500페이지가 넘으면 작업이 거부돼요.',
      whatItDoes: [
        '모든 페이지 또는 첫 페이지만 선택한 해상도의 JPG로 래스터화해요.',
        '여러 페이지 출력을 자릿수를 맞춰 정렬하기 쉬운 파일 이름과 함께 ZIP 하나로 묶어요.',
        '설정한 JPEG 품질(기본값 90)을 모든 페이지에 사용해요.',
        '페이지 수를 먼저 읽으므로 너무 큰 문서는 렌더링이 시작되기 전에 실패해요.',
        'PDF는 자동 이미지 분석 대상에서 제외돼요. 이 분석은 이미지, 동영상, 오디오 업로드에만 실행돼요.',
      ],
      flowSteps: [
        {
          title: 'PDF 업로드',
          description: '파일당 한도 이내의 .pdf라면 무엇이든 돼요. 페이지 수는 500 이하여야 해요.',
        },
        {
          title: '페이지, DPI, 품질 선택',
          description: '모든 페이지 또는 첫 페이지만, 100, 150, 200, 300 DPI, JPEG 품질 1~100 중에서 골라요.',
        },
        {
          title: 'pdftoppm 렌더링',
          description: 'pdftoppm -r <dpi> -jpeg -jpegopt quality=<q> [-f 1 -l 1] input page',
        },
        {
          title: '다운로드',
          description: '한 페이지는 converted.jpg, 모든 페이지는 converted.zip으로 받아요.',
        },
      ],
      advancedDetails: [
        '렌더러는 pdf_tools.go의 convertPDFToImages예요. pdfinfo로 페이지 수를 확인하고 500페이지를 넘으면 거부한 뒤, DPI에는 -r, JPG 출력에는 -jpeg와 -jpegopt quality=N, 첫 페이지만 원할 때는 -f 1 -l 1을 붙여 pdftoppm을 실행해요.',
        '양식이 무엇을 보내든 서버는 DPI를 50~400, 품질을 1~100 범위로 제한해요. 양식 자체는 100, 150, 200, 300을 제공해요.',
        'pdftoppm은 페이지마다 파일 하나를 쓰고, 서버가 이를 page-001.jpg, page-002.jpg 등(세 자리로 자릿수를 맞춘 이름)으로 바꿔 ZIP으로 묶으므로, 어떤 파일 관리자에서도 페이지 순서대로 정렬돼요.',
        '픽셀 크기는 DPI에서 바로 정해져요. US Letter 페이지(8.5 x 11인치)는 150 DPI에서 1275 x 1650픽셀, 300에서 2550 x 3300이고, A4 페이지(8.27 x 11.69인치)는 150에서 1240 x 1754, 300에서 2480 x 3508이에요.',
        'PDF 자체가 스캔본이면 다시 래스터화돼요. 삽입된 스캔본이 300 DPI인데 150으로 렌더링하면 각 페이지는 스캔본 선형 해상도의 절반으로 나와요. 스캔본의 해상도를 유지하려면 300을 고르세요.',
        '이 도구의 PNG 버전은 같은 렌더러를 -png로, 품질 옵션 없이 사용해요. 사진이나 스캔 페이지에는 JPG가, JPEG 링잉이 눈에 띌 만한 선명한 글자와 단색 페이지에는 PNG가 알맞아요.',
      ],
      whyItMatters: [
        '슬라이드 덱, 소셜 게시물, 채팅 앱, 이미지 편집기처럼 이미지는 받지만 PDF는 받지 않는 도구와 플랫폼이 많아요.',
        '렌더링된 페이지는 레이아웃, 글꼴, 벡터 그래픽을 충실하게 담은 그림이라 따로 포함하거나 다시 배치할 것이 없어요.',
        'DPI를 직접 고르므로 빠른 미리보기와 인쇄 해상도 내보내기 중에서 선택할 수 있어요.',
      ],
      useCases: [
        {
          title: '슬라이드와 소셜 게시물',
          description: '보고서 페이지나 포스터를 게시하거나 슬라이드에 넣을 수 있는 이미지로 렌더링하세요.',
        },
        {
          title: '썸네일과 미리보기',
          description: '표지 이미지용으로 첫 페이지만 100 DPI로 렌더링하세요.',
        },
        {
          title: '편집기에서 표시하기',
          description: '이미지 편집기에서 페이지를 열어 주석을 달거나, 가리거나, 자르세요.',
        },
        {
          title: '스캔본 추출',
          description: 'PDF에서 스캔한 페이지를 원래 해상도의 JPG로 한 장씩 다시 꺼내세요.',
        },
      ],
      workedExamples: [
        {
          title: '12페이지 A4 보고서, 모든 페이지를 150 DPI로',
          body: '입력: 텍스트와 차트 몇 개가 담긴 1.8 MB, 12페이지 A4 PDF. 설정은 미리 정해진 값 그대로 JPG, 모든 페이지, 150 DPI, 품질 90이에요. pdfinfo가 500 한도 미만인 12페이지를 보고하고, pdftoppm이 -r 150 -jpeg -jpegopt quality=90으로 실행돼요. 각 페이지는 가로 8.27 x 150, 세로 11.69 x 150, 즉 1240 x 1754픽셀(2.2메가픽셀)로 렌더링돼요. 파일 열두 개는 page-001.jpg부터 page-012.jpg까지 이름이 바뀌어 converted.zip으로 묶여요. 렌더링은 페이지 단위로 이루어지며, 각 페이지에 벡터 콘텐츠와 텍스트가 얼마나 많은지에 따라 시간이 좌우돼요. 텍스트 페이지 열두 장 정도는 모두 합쳐 몇 초면 돼요. 페이지별 JPEG 크기는 내용에 따라 달라요. 대부분 흰 바탕인 텍스트 페이지는 페이지 전체를 채운 차트보다 훨씬 잘 압축돼요.',
        },
        {
          title: 'US Letter 스캔본의 첫 페이지만 300 DPI로',
          body: '입력: Letter 크기의 40페이지 스캔 계약서, 28 MB. 첫 페이지만과 300 DPI를 선택하고 품질은 90 그대로 둬요. 서버는 pdftoppm -r 300 -jpeg -jpegopt quality=90 -f 1 -l 1을 실행하므로 한 페이지만 가로 8.5 x 300, 세로 11 x 300 = 2550 x 3300픽셀(8.4메가픽셀)로 래스터화돼요. 출력은 ZIP이 아니라 converted.jpg 한 장이에요. 스캔 페이지는 삽입된 이미지 하나라서 한 페이지를 렌더링하는 것은 빨라요. 28 MB를 업로드하는 시간이 렌더링보다 길어요. 150 DPI라면 같은 페이지가 1275 x 1650으로 픽셀 수가 사분의 일인데, 화면으로 읽기에는 충분하지만 스캔본을 다시 인쇄하기에는 부족해요.',
        },
      ],
      whenNotToUse: '텍스트를 선택하거나 검색할 수 있어야 한다면 PDF를 JPG로 렌더링하지 마세요. 결과는 픽셀이라 스크린 리더나 검색 색인은 아무것도 얻지 못해요. 확대해서 볼 예정이라면 대부분 선명한 글자와 선화로 된 페이지에 JPG를 쓰지 마세요. JPEG 압축은 가장자리 주변에 희미한 링잉을 남기므로 이런 경우에는 PNG 버전이 더 깔끔해요. 500페이지가 넘는 문서는 바로 거부되고, 긴 문서를 아주 높은 DPI로 렌더링하면 ZIP이 커지므로 실제로 필요한 페이지만 렌더링하세요. 그리고 PDF를 그림으로 만드는 것이 아니라 내용을 편집하는 것이 목적이라면 PDF 편집기가 알맞은 도구예요.',
      whyMediaManipulator: [
        '고정된 미리보기 크기가 아니라 실제 DPI와 품질 조절을 제공하는 Poppler 렌더링이에요.',
        '다운로드 파일이 잔뜩 쌓이는 대신 페이지 번호가 붙은 파일 이름의 ZIP 하나로 받아요.',
        '기본 도구는 가입이 필요 없어요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      ],
      privacyNote: 'PDF는 서버의 uploads/<jobId>/에, 렌더링된 JPG 또는 그 ZIP은 outputs/<jobId>/에 저장돼요. 페이지는 출력 폴더 안의 임시 디렉터리에 렌더링되며, 이 디렉터리는 ZIP이 만들어지는 즉시 삭제돼요. PDF 업로드는 문서로 인식되어, 이미지·동영상·오디오 업로드가 거치는 자동 비전 분석에 전달되지 않아요. Poppler는 전적으로 자체 머신에서 실행되며 어떤 페이지도 외부 서비스로 전송되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: 'PDF를 JPG로 변환하는 기능은 무료인가요?',
          answer: '기본 도구는 무료예요. PDF 한 개는 페이지 수와 관계없이 일일 일반 작업 한 건이에요. 기본값 기준으로 비회원은 하루 5건에 파일당 한도 200 MB, 무료 계정은 하루 30건에 1 GB, Premium은 300건, Pro는 700건이며, 모두 /pricing에 나와 있어요.',
        },
        {
          question: '이미지를 몇 장 받게 되나요?',
          answer: '모든 페이지를 선택하면 페이지마다 한 장씩, page-001.jpg부터 이름이 붙은 파일이 converted.zip으로 제공돼요. 첫 페이지만 선택하면 ZIP 없이 converted.jpg 한 장을 받아요.',
        },
        {
          question: '어떤 DPI를 골라야 하나요?',
          answer: '화면으로 읽고 공유하려면 150(A4 기준 1240 x 1754). 인쇄용이나 300으로 만든 스캔본이라면 300(A4 기준 2480 x 3508). 작은 미리보기에는 100. 서버는 50~400을 받아요.',
        },
        {
          question: '품질 설정은 어떤 역할을 하나요?',
          answer: '표준 JPEG 품질 척도인 -jpegopt quality=N으로 pdftoppm에 전달돼요. 기본값은 90이며, 사진이 많은 페이지에서 파일을 더 작게 만들려면 낮추세요.',
        },
        {
          question: '페이지 제한이 있나요?',
          answer: '네, 500페이지예요. 렌더링이 시작되기 전에 pdfinfo가 페이지 수를 세고, 그보다 긴 문서는 페이지 수와 한도를 알려 주는 메시지와 함께 거부되며 작업 횟수는 환불돼요.',
        },
        {
          question: '이미지 속 텍스트를 검색할 수 있나요?',
          answer: '아니요. 출력은 각 페이지의 래스터 이미지예요. 텍스트가 필요하면 PDF를 그대로 두거나, 찍은 페이지에 OCR을 실행하는 AI 문서 스캔 도구를 사용하세요.',
        },
        {
          question: 'JPG 대신 PNG로 받을 수 있나요?',
          answer: '이 페이지는 형식이 JPG로 고정되어 있어요. PDF를 PNG로 페이지에서는 같은 렌더러가 -png를 사용해 PNG를 만들며, 품질 설정은 없어요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '모든 페이지 출력은 .zip으로, 첫 페이지 출력은 .jpg 한 장으로 제공돼요.',
          '기본 렌더링 해상도는 150 DPI예요. 인쇄 품질 출력이 필요하면 높이세요.',
        ],
      },
      related: [
        {
          label: '이미지를 PDF로',
          to: '/tools/image-to-pdf',
          description: '반대 방향: 이미지를 PDF 페이지로 감싸요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '렌더링된 JPG를 웹용으로 줄여요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '렌더링된 페이지를 썸네일이나 배너 크기로 조절해요.',
        },
        {
          label: 'AI 문서 스캔',
          to: '/tools/ai-document-scan',
          description: '찍은 페이지를 OCR하고 정리해요.',
        },
        {
          label: '이미지 속 텍스트 가리기',
          to: '/tools/redact-text-in-image',
          description: '렌더링된 페이지의 이름이나 숫자를 검게 가려요.',
        },
      ],
      embed: {
        title: 'PDF를 JPG로 변환하기',
        description: 'PDF를 업로드하세요. 각 페이지가 JPG 이미지로 렌더링돼요. 이미지 ZIP을 받으려면 "모든 페이지"를, JPG 한 장을 받으려면 "첫 페이지만"을 선택하세요. 더 선명한 결과를 원하면 렌더링 DPI를 고르세요.',
      },
    },
    'compress-video': {
      name: '동영상 압축',
      h1: '화질을 망치지 않고 동영상 온라인 압축하기',
      tagline: '웹, 이메일, 소셜 미디어, 클라우드 업로드에 맞게 MP4, WebM, MOV, MKV, AVI 파일 크기를 줄이세요.',
      metaTitle: '동영상 온라인 압축 (무료) | Media Manipulator',
      metaDescription: '무료 온라인 동영상 압축기입니다. 좋은 화질을 유지하면서 MP4, WebM, MOV, MKV, AVI 파일 크기를 줄이세요. 가입이 필요 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '화질을 망치지 않고 동영상 온라인 압축하기',
      ogDescription: '볼 만한 화질을 잃지 않고 웹용으로 MP4, WebM, MOV, AVI 동영상 파일을 줄이세요.',
      intro: '동영상 파일이 큰 이유는 비트레이트, 즉 인코더가 영상 초당 비트를 얼마나 썼는지에 있어요. 휴대폰과 화면 녹화 프로그램은 비트를 넉넉하게 쓰기 때문에 짧은 1080p 클립도 수십에서 수백 메가바이트가 될 수 있어요. 이 페이지는 전체 변환기 대신 컨트롤이 세 개뿐인 압축기를 열어요: 압축 수준, 출력 컨테이너, 그리고 선택 사항인 해상도와 코덱이에요. 저희 서버에서 이 작업은 FFmpeg 명령 하나로, 수준에 따라 정해진 고정 품질 설정(CRF)으로 화면을 다시 인코딩하고, 오디오를 AAC 또는 Opus로 다시 인코딩하고, 인덱스를 파일 앞쪽에 두어 다운로드가 끝나기 전에 재생이 시작되도록 결과를 기록해요.',
      whatItDoes: [
        '고정 비트레이트가 아니라 고정 품질 수준으로 동영상을 다시 인코딩해요: 가장 작은 파일은 CRF 31, 균형은 CRF 26, 고품질은 CRF 22예요.',
        'MP4(기본은 H.264, 선택하면 H.265/HEVC) 또는 WebM(VP9과 Opus 오디오)으로 출력해요.',
        '선택하면 같은 패스에서 가로세로 비율을 유지한 채 화면을 1080p, 720p, 480p로 줄여요.',
        '가능한 한 작은 파일을 위해 선택하면 오디오 트랙을 아예 제거해요.',
        'MP4, MOV, M4V, WebM, MKV, AVI, FLV, WMV, MPEG, MPG 업로드를 받아요. ProRes 등 편집용 형식은 전체 변환기 페이지에서 처리해요.',
      ],
      flowSteps: [
        {
          title: '동영상 업로드',
          description: '브라우저가 파일을 저희 스토리지 버킷에 바로 넣은 다음 API에 작업 시작을 요청해요.',
        },
        {
          title: '수준 선택',
          description: '균형이 미리 선택되어 있어요. 가장 작은 파일은 눈에 보이는 디테일을 희생해 크기를 줄이고, 고품질은 디테일을 더 많이 유지해요.',
        },
        {
          title: '필요하면 형식, 해상도, 코덱 변경',
          description: 'H.264 MP4는 어디서나 재생되고, H.265와 WebM은 이를 디코딩할 수 있는 기기에서 더 작아요.',
        },
        {
          title: 'FFmpeg가 다시 인코딩',
          description: '선택한 수준의 CRF로 libx264, libx265 또는 libvpx-vp9를 실행하고, AAC 또는 Opus 오디오와 MP4용 faststart를 적용해요.',
        },
        {
          title: '더 작아진 파일 다운로드',
          description: '결과는 보관 기간이 끝날 때까지 작업 폴더에 남아요.',
        },
      ],
      advancedDetails: [
        'MP4의 정확한 명령은 ffmpeg -i input [-vf scale=-1:H] -c:v libx264 -crf N -pix_fmt yuv420p -movflags +faststart -c:a aac output.mp4이며, N은 세 수준에 따라 31, 26, 22예요(converter.go의 buildVideoCodecArgs와 videoCRF). 인코더 속도 프리셋은 전달하지 않으므로 libx264는 기본값인 medium으로 실행돼요.',
        'H.265를 고르면 인코더가 libx265로 바뀌고 -tag:v hvc1이 추가돼요. QuickTime과 Safari가 MP4 안의 HEVC를 인식하는 데 필요한 태그예요. 구형 Android 휴대폰, 스마트 TV, 많은 웹 플레이어는 H.265를 아예 디코딩하지 못해요.',
        'WebM 출력은 libvpx-vp9를 -b:v 0 -crf N과 Opus 오디오로 실행해요. 서버의 FFmpeg 빌드에 VP9이나 Opus가 없다면 VP8과 Vorbis로 대체될 거예요. 같은 N이 전달되지만 VP9은 CRF를 0부터 63까지의 척도로 해석하므로, 거기서 26은 비교적 높은 품질 설정이에요.',
        '해상도를 고르면 scale=-1:1080, scale=-1:720 또는 scale=-1:480이 돼요. 높이를 고정하고 너비는 원본의 가로세로 비율로 계산해요. 높이는 주어진 그대로 적용되므로, 720p 원본에 1080p를 고르면 업스케일되어 파일이 작아지지 않고 오히려 커져요. 원본과 같거나 낮은 높이를 고르세요.',
        '오디오 트랙 제거를 선택하면 -an이 추가돼요. 그렇지 않으면 오디오는 FFmpeg 내장 AAC 인코더가 기본 비트레이트로 다시 인코딩해요(-b:a는 전달하지 않으며, 스테레오라면 보통 약 128 kbps예요). 어느 수준에서든 파일에서 차지하는 비중은 작아요.',
        '압축은 CRF 기반이므로 출력 크기는 콘텐츠에 따라 달라져요. 정적인 슬라이드는 색종이 조각이나 물보다 훨씬 많이 압축돼요. 서버는 인코딩을 시작하기 전에 CRF가 0부터 51 사이인지, 압축 수준이 세 가지 이름 중 하나인지 검증해요.',
        '업로드한 파일은 모든 표준 변환이 거치는 자동 콘텐츠 분석에도 대기열로 들어가요. 프레임을 샘플링해 로컬 비전 모델이 설명하고, 오디오는 저희 자체 하드웨어에서 전사돼요. 분석 결과는 작업과 함께 저장되며 공유되지 않아요.',
      ],
      whyItMatters: [
        '채팅 앱, 메일 서버, 학습 플랫폼은 메가바이트 단위로 용량 제한을 두는데, 원래 비트레이트 그대로의 휴대폰 클립은 그 제한을 쉽게 넘어요.',
        '60 MB짜리 배경 동영상을 자동 재생하는 페이지는 모바일 연결에서 멈추지만, 같은 클립을 CRF 26으로 압축하면 그 일부 크기로 줄어요.',
        '스토리지와 대역폭 비용은 바이트에 비례하므로, 거의 열어 보지 않는 원본의 압축 사본을 보관하면 비용이 빠르게 절약돼요.',
      ],
      useCases: [
        {
          title: '이메일과 채팅',
          description: '별도의 공유 링크 없이 1분짜리 휴대폰 녹화를 25 MB 또는 100 MB 제한 아래로 줄이세요.',
        },
        {
          title: '웹사이트 히어로와 배경 루프',
          description: '페이지가 오래 버퍼링하지 않고 자동 재생할 수 있는 WebM 또는 H.264 MP4로 인코딩하세요.',
        },
        {
          title: '강의와 회의 녹화',
          description: '정적인 슬라이드는 어떤 CRF에서도 매우 잘 압축되므로 화면 녹화를 크게 줄일 수 있어요.',
        },
        {
          title: '보관용 사본',
          description: '긴 원본은 720p 균형 사본을 보관하고 마스터는 콜드 스토리지로 옮기세요.',
        },
      ],
      workedExamples: [
        {
          title: '48 MB, 30초 1080p 휴대폰 클립을 균형으로',
          body: '입력: 휴대폰으로 찍은 30초 MP4, 1920 x 1080, 48 MB로 약 12.8 Mbps예요. 설정: 균형, MP4, H.264, 해상도 유지, 오디오 유지. 서버는 libx264를 CRF 26, yuv420p, faststart로 실행하고 오디오를 128 kbps AAC로 다시 인코딩하므로, 결과에서 사운드 트랙만 약 0.5 MB예요(128 kbps x 30 s). 나머지는 모두 화면이 결정해요. CRF 26은 미세한 입자와 노이즈부터 포기하므로, 안정적인 핸드헬드 촬영은 12.8 Mbps 원본의 작은 일부 크기로 나오고, 빠른 액션이나 카메라 노이즈가 심한 영상은 덜 줄어요. 인코딩은 기본 medium 프리셋으로 1080p 900프레임을 한 번 처리하는 것이라 저희 서버에서는 짧은 작업이고, 보통은 48 MB를 업로드하는 시간이 대기 시간의 대부분을 차지해요.',
        },
        {
          title: '160 MB, 60초 4K 클립을 720p H.265 가장 작은 파일로',
          body: '입력: 3840 x 2160, 60초, 160 MB의 MP4로 약 21 Mbps이며, 비회원 한도인 200 MB 이내예요. 설정: 가장 작은 파일, MP4, 코덱 H.265, 해상도 720p, 오디오 제거. FFmpeg가 scale=-1:720을 적용하면 1280 x 720이 돼요. 프레임당 0.92메가픽셀로, 원본의 8.3메가픽셀에 비하면 코덱이 아무것도 하기 전에 이미 픽셀이 대략 아홉 배 줄어요. 그다음 libx265가 CRF 31과 -tag:v hvc1로 실행되고 -an이 오디오를 제거해요. 아홉 배 적은 픽셀, 더 효율적인 코덱, 높은 CRF의 조합에서 가장 큰 감소가 나오므로, 결과는 수십이 아니라 몇 메가바이트 수준으로 예상하세요. 시간은 4K 프레임 디코딩과, 같은 프리셋에서 libx264보다 눈에 띄게 느린 libx265가 대부분을 차지하므로, 출력이 더 작은데도 이 작업은 1080p 예시보다 오래 걸려요.',
        },
      ],
      whenNotToUse: '아직 편집하거나 색 보정할 파일은 압축하지 마세요. 다시 인코딩할 때마다 디테일이 손실되며, 편집기에는 원본이나 전체 변환기에서 만든 ProRes 중간 파일이 필요해요. 문제가 크기가 아니라 컨테이너라면, 특정 기기에서 클립을 재생하려고 이 도구를 쓰지 마세요. 동영상 변환기는 화질을 낮추지 않고 형식을 바꿔 줘요. 일부 구간만 잘라내는 것이 목표라면, 자르기 도구가 다시 인코딩하지 않고 스트림을 복사하므로 더 빠르고 손실도 없어요. 그리고 파일이 긴 탓에 크다면 압축의 효과는 기대보다 작아요. CRF 26으로 압축한 20분짜리 녹화도 여전히 20분짜리 녹화예요.',
      whyMediaManipulator: [
        '각 수준의 CRF가 이 페이지에 적혀 있으므로, 기다리기 전에 가장 작은 파일이 디테일이 많은 영상에 어떤 영향을 줄지 예측할 수 있어요.',
        'MP4 안의 H.265에는 Apple 플레이어가 요구하는 hvc1 태그가 붙어요. 많은 온라인 압축기가 이를 빠뜨려요.',
        '인코딩은 저희 자체 서버에서 FFmpeg로 실행돼요. 외부 처리 서비스에 아무것도 넘기지 않으며, 워터마크도 추가하지 않아요.',
        '압축 한 번은 일일 일반 작업 횟수에서 한 번으로 집계돼요: 기본적으로 계정이 없으면 하루 5회, 무료 계정이면 30회예요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ],
      privacyNote: '압축기는 저희 자체 서버에서 FFmpeg로 동영상을 다시 인코딩해요. 업로드한 파일은 uploads/<jobId>/에, 압축된 파일은 outputs/<jobId>/에 저장되며, 둘 다 보관 대장에 등록되어 기간이 끝나면 삭제돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 표준 변환이므로 업로드한 파일은 같은 하드웨어에서 자동 콘텐츠 분석도 거쳐요(샘플링한 프레임을 로컬 비전 모델이 설명하고, 오디오는 로컬에서 전사). 그 보고서는 작업과 함께 보관되며 외부와 공유되지 않아요. 컨테이너 메타데이터는 제거를 선택하지 않는 한 유지되며, 외부 AI나 처리 제공업체로는 아무것도 전송되지 않아요.',
      faq: [
        {
          question: '압축하면 동영상 화질이 나빠지나요?',
          answer: '다시 인코딩하면 언제나 디테일이 어느 정도 손실돼요. 고품질(CRF 22)과 균형(CRF 26)에서는 손실이 대부분 시청자 대부분이 알아차리지 못하는 미세한 입자와 노이즈에서 일어나요. 가장 작은 파일(CRF 31)에서는 디테일이 많은 영상이 부드러워지는 것이 보일 수 있어요. 해상도를 유지하면 축소로 인한 흐림을 피할 수 있어요.',
        },
        {
          question: 'H.264, H.265, WebM 중 무엇을 골라야 하나요?',
          answer: 'H.264 MP4는 오래된 TV와 회사 노트북을 포함해 어디서나 재생돼요. H.265는 같은 CRF에서 더 작은 파일을 만들지만 HEVC를 디코딩할 수 있는 기기가 필요해요. Apple 플레이어가 받아들이도록 hvc1 태그를 붙여요. WebM(VP9과 Opus)은 플레이어를 직접 관리하는 웹 페이지에 적합해요.',
        },
        {
          question: '파일이 얼마나 작아지나요?',
          answer: '원본 비트레이트와 콘텐츠에 따라 달라요. 12 Mbps의 휴대폰 클립은 여유가 많아 CRF 26에서 극적으로 줄어들지만, 이미 적당한 비트레이트로 인코딩된 파일은 거의 줄지 않아요. CRF는 화면에 필요한 만큼만 비트를 쓰기 때문이에요. 720p로 낮추고 오디오를 제거하면 항상 도움이 돼요.',
        },
        {
          question: '압축기가 워터마크를 넣거나 프레임 레이트를 바꾸나요?',
          answer: '아니요. 프레임 레이트, 길이, 가로세로 비율은 유지되고 화면에 아무것도 그려지지 않아요. 바뀌는 것은 코덱, CRF, 선택한 높이, 선택한 오디오 제거뿐이에요.',
        },
        {
          question: '동영상 압축은 무료인가요? 제한은 무엇인가요?',
          answer: '기본적으로 비회원은 하루 5회 작업, 파일 최대 200 MB와 동영상 5분, 출력 최대 1080p를 이용할 수 있고, 무료 계정이면 하루 30회, 1 GB, 20분으로 늘어나요. 실패한 압축은 횟수가 환불돼요. 현재 수치는 요금 페이지에 나와 있어요.',
        },
        {
          question: '출력이 원본보다 작지 않은 이유는 무엇인가요?',
          answer: '원본이 이미 효율적으로 압축되어 있었거나, 해상도에 비해 비트레이트가 낮았을 가능성이 높아요. CRF는 더 낮은 수준을 고르지 않는 한 화면에 필요한 것보다 줄일 수 없어요. 가장 작은 파일을 시도하거나, 해상도를 낮추거나, H.265로 바꿔 보세요.',
        },
        {
          question: '오디오가 없는 동영상을 압축하거나 원본 오디오를 그대로 유지할 수 있나요?',
          answer: '소리가 없는 원본은 소리 없이 유지돼요. 유지하는 트랙의 오디오는 이 페이지에서 항상 AAC(MP4) 또는 Opus(WebM)로 다시 인코딩돼요. 오디오 비트레이트를 직접 지정하려면 전체 동영상 변환기를 사용하세요.',
        },
      ],
      related: [
        {
          label: '동영상 자르기',
          to: '/tools/video-trimmer',
          description: '먼저 클립을 자르면 압축기가 인코딩할 분량이 줄어요.',
        },
        {
          label: '동영상을 움직이는 GIF로 변환',
          to: '/tools/convert-video-to-animated-gif',
          description: '몇 초짜리 클립이라면 인라인으로 재생되는 형식은 GIF예요.',
        },
        {
          label: '동영상을 HLS로 트랜스코딩',
          to: '/tools/transcode-to-hls',
          description: '파일 하나 대신 적응형 스트림으로 동영상을 패키징하세요.',
        },
        {
          label: '동영상에서 오디오 추출',
          to: '/tools/extract-audio-from-video',
          description: '사운드 트랙만 MP3, WAV 또는 FLAC로 보관하세요.',
        },
        {
          label: '동영상 텍스트 변환',
          to: '/tools/transcribe-video',
          description: '압축 전이나 후에 음성을 텍스트로 받으세요.',
        },
        {
          label: '동영상 변환기 튜토리얼',
          to: '/tutorials/video/getting-started',
          description: '모든 동영상 옵션을 단계별로 안내해요.',
        },
      ],
      embed: {
        title: '동영상 압축하기',
        description: '동영상을 업로드하고 더 작은 품질 프리셋이나 더 낮은 비트레이트를 고르세요. 가장 빠른 결과를 원하면 같은 코덱을 유지하고, 최신 기기에서 더 작은 파일을 원하면 WebM/H.265로 바꾸세요. 해상도를 그대로 유지하면 가장 자연스러운 결과를 얻을 수 있어요.',
      },
    },
    'video-trimmer': {
      name: '동영상 자르기',
      h1: '동영상 온라인 무료 자르기',
      tagline: '빠르고 화질이 유지되는 트리밍으로 클립에서 원하는 부분만 잘라내세요. 가능하면 다시 인코딩하지 않습니다.',
      metaTitle: '동영상 온라인 무료 자르기 | Media Manipulator',
      metaDescription: '무료 온라인 동영상 자르기 도구입니다. 시작 시간과 종료 시간을 정하고 빠르고 손실 없는 트리밍으로 클립을 자르세요. MP4 출력, 워터마크 없음, 가입 불필요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '동영상 온라인 무료 자르기',
      ogDescription: '화질을 유지하는 빠른 자르기로 동영상에서 원하는 부분만 남기세요. 무료이고 워터마크도 없어요.',
      intro: '자르기는 동영상에서 한 구간만 남기고 나머지를 버리는 작업이에요. 대부분의 온라인 자르기 도구는 이를 위해 클립 전체를 다시 인코딩하는데, 느리고 화질도 떨어져요. 이 페이지는 기본적으로 더 단순한 방법을 써요. FFmpeg에 시작 시간으로 이동한 다음, 요청한 길이만큼 압축된 동영상과 오디오 패킷을 디코딩하지 않고 새 파일로 복사하도록 요청해요. 이것이 스트림 복사이고, 무손실이며, 파일을 읽는 속도만큼 빠르게 실행돼요. 원본 코덱이 선택한 컨테이너에 허용되지 않거나 프레임 단위 정확도 옵션을 선택해서 복사가 불가능하면, 서버는 대신 선택한 구간만 다시 인코딩해요.',
      whatItDoes: [
        '시작 시간부터 종료 시간까지 동영상에서 한 구간을 잘라내요. 시간은 초 단위로 입력하거나 시각적 타임라인에서 고를 수 있어요.',
        '출력 컨테이너가 원본 코덱을 받아들이면 언제나 다시 인코딩하지 않고 스트림을 복사하므로, 남긴 부분은 원본과 비트 단위로 똑같아요.',
        '복사가 거부되면 자동으로 다시 인코딩으로 전환하고, 정확한 프레임에서 자르고 싶다면 다시 인코딩을 강제할 수도 있어요.',
        '기본으로 MP4를 만들고, MOV나 WebM도 고를 수 있어요. MP4와 MOV에는 faststart 플래그가 붙어 다운로드가 끝나기 전에 재생이 시작돼요.',
        'ffprobe로 파일에 실제로 동영상 스트림이 있는지 확인하고, 오디오만 있는 업로드는 명확한 메시지와 함께 거부해요.',
      ],
      flowSteps: [
        {
          title: '동영상 업로드',
          description: 'MP4, MOV, M4V, WebM, MKV, AVI, FLV, WMV, MPEG 또는 MPG 파일이 저희 스토리지 버킷으로 바로 업로드돼요.',
        },
        {
          title: '시작과 끝 설정',
          description: '초를 입력하거나 두 핸들을 끌어 보세요. 패널에 그 결과 클립 길이가 표시돼요.',
        },
        {
          title: '컨테이너 선택, 필요하면 프레임 정확도도',
          description: 'MP4가 미리 설정돼 있어요. 정확한 프레임이 중요할 때만 ‘프레임 단위로 정확하게 자르기 위해 다시 인코딩’을 선택하세요.',
        },
        {
          title: 'FFmpeg가 자르기',
          description: '-ss, -t, -c copy로 스트림을 복사하거나, 복사가 불가능하거나 직접 요청한 경우 libx264 CRF 18로 다시 인코딩해요.',
        },
        {
          title: '클립 다운로드',
          description: '출력 파일에는 _trimmed 접미사가 붙고, 보관 기간이 끝날 때까지 작업 폴더에 남아 있어요.',
        },
      ],
      advancedDetails: [
        '스트림 복사 명령은 ffmpeg -ss START -i input -t DURATION -map 0 -c copy -avoid_negative_ts make_zero [-movflags +faststart] output이에요(specialized_tools.go의 runTrimVideo). -map 0은 추가 오디오 트랙과 자막을 포함한 모든 스트림을 유지하고, 시간은 밀리초 정밀도로 기록돼요.',
        '-ss를 -i 앞에 두고 디코딩하지 않으면 FFmpeg는 키프레임에서만 시작할 수 있으므로, 복사는 시작 시간과 같거나 그 이전의 가장 가까운 키프레임에서 시작돼요. 휴대폰 녹화에서는 키프레임 간격이 보통 1~2초이고, 이것이 시작 지점이 어긋날 수 있는 최대치예요. 그다음 -avoid_negative_ts make_zero가 타임스탬프를 다시 맞춰 플레이어가 깔끔하게 시작해요.',
        '다시 인코딩 경로는 높은 품질 설정의 buildVideoCodecArgs를 사용해요. MP4와 MOV에는 AAC와 함께 libx264 -crf 18 -pix_fmt yuv420p를, WebM에는 Opus와 함께 libvpx-vp9 -b:v 0 -crf 18을 써요. 첫 번째 동영상 스트림과 (있다면) 첫 번째 오디오 스트림만 매핑하므로, 이 경로에서는 추가 트랙이 빠져요.',
        '복사 모드는 auto로 전송되며, 복사를 시도하고 실패하면 다시 인코딩해요. H.264 원본에 WebM을 선택하면 항상 다시 인코딩 경로로 가는데, WebM은 VP8, VP9, AV1 동영상만 받기 때문이에요.',
        '서버 검증: 시작은 0 이상이어야 하고, 클립 길이는 최소 0.1초, 최대 6시간이어야 하며, 끝은 시작보다 뒤여야 해요. 그 밖의 값은 FFmpeg가 시작되기 전에 거부되고 차감된 작업 횟수는 환불돼요.',
        '자르기는 특수 모드이므로, 업로드는 일반 변환에 적용되는 자동 콘텐츠 분석을 건너뛰어요. 서버는 ffprobe와 자르기만 실행해요.',
      ],
      whyItMatters: [
        '시작 부분의 공백과 끝 부분의 어설픈 마무리는 거의 모든 녹화에 있고, 이를 없애는 것이 가장 흔한 편집이에요.',
        '무손실로 자르면 세대 손실이 생긴 사본을 따로 만들지 않고도 마스터 파일을 자를 수 있어요.',
        '먼저 자르면 이후 모든 단계가 가벼워져요. 압축, 자막 달기, GIF 만들기 모두 남긴 부분만 처리하면 되니까요.',
      ],
      useCases: [
        {
          title: '회의 및 강의 녹화',
          description: '내용이 시작되기 전 사람들이 접속하는 몇 분을 잘라내세요.',
        },
        {
          title: '소셜 게시물용 하이라이트',
          description: '중요한 20초만 남기고 그 부분만 업로드하세요.',
        },
        {
          title: '증거 자료와 버그 보고',
          description: '문제가 발생한 바로 그 순간을 원본 화질 그대로 공유하세요.',
        },
        {
          title: 'GIF나 복원용 짧은 클립 준비',
          description: '짧은 입력에서 가장 잘 작동하는 도구에 넣기 전에 클립을 몇 초로 자르세요.',
        },
      ],
      workedExamples: [
        {
          title: '180 MB, 4.5분 길이의 1080p MP4에서 30초를 스트림 복사로 자르기',
          body: '입력: 4분 30초 길이의 1920 x 1080 H.264 MP4로, 180 MB, 약 5.3 Mbps이며 기본 비회원 한도인 200 MB와 5분 안에 들어가요. 설정: 시작 45.000, 끝 75.000, 출력 MP4, 다시 인코딩 선택 안 함. 서버는 -ss 45.000과 -t 30.000으로 복사 명령을 실행해요. 패킷을 복사하므로 출력에는 270초 분량의 데이터 중 약 30초, 약 20 MB가 원본과 정확히 같은 화질, 코덱, 프레임 레이트로 담겨요. 자르기는 45초 이전의 마지막 키프레임에서 시작되므로 클립이 한두 초 일찍 시작될 수 있어요. 이 작업은 계산이 아니라 파일 읽기 속도에 좌우되며 몇 초 만에 끝나요.',
        },
        {
          title: '60 MB 1080p MP4에서 프레임 단위로 정확하게 12초 자르기',
          body: '입력: 2분 길이의 1920 x 1080 MP4, 60 MB. 설정: 시작 30.250, 끝 42.250, 출력 MP4, ‘프레임 단위로 정확하게 자르기 위해 다시 인코딩’ 선택. 이제 FFmpeg는 정확히 30.250부터 디코딩하고, 12초(30 fps로 360프레임)를 libx264 CRF 18, yuv420p, faststart로 인코딩하며, 오디오는 AAC로 다시 인코딩해요. CRF 18은 화면을 원본과 눈으로 보기에 매우 가깝게 유지하므로, 결과물의 초당 크기는 원본과 비슷한 수준이며 12초에 몇 메가바이트 정도예요. 전체 2분이 아니라 남긴 12초만 인코딩하므로, 몇 초 만에 끝나는 복사가 아니라 짧은 인코딩 작업이 돼요.',
        },
      ],
      whenNotToUse: '한 동영상에서 떨어져 있는 여러 구간을 제거하려면 자르기 도구를 쓰지 마세요. 정확히 한 구간만 남기므로, 가운데를 잘라내려면 두 번 자른 뒤 Darkroom에서 이어 붙여야 해요. 스트림 복사가 정확한 프레임에 맞춰 잘릴 거라고 기대하지 마세요. 일 초 일찍 잘리는 것이 문제라면 다시 인코딩 옵션을 선택하고 짧은 인코딩을 감수하세요. 진짜 목표가 더 작은 파일이라면, 자르기는 잘라낸 만큼만 도움이 돼요. 비트레이트를 바꾸는 것은 압축 도구예요. 그리고 업로드에 동영상 스트림이 없으면(예: 이름만 MP4로 바꾼 M4A) 자르기 도구가 거부해요. 오디오만 있는 파일은 오디오 도구에서 처리하세요.',
      whyMediaManipulator: [
        '무손실 스트림 복사가 기본이며, 모든 것을 느리지만 안전하게 다시 인코딩하는 방식 뒤에 숨기지 않고 다시 인코딩 대체 경로를 그대로 적어 두었어요.',
        '정확한 FFmpeg 플래그가 이 페이지에 나와 있어요. 자르기가 이전 키프레임에서 시작될 수 있는 이유와 이를 피하는 방법도 함께요.',
        '자르기 한 번은 일일 일반 작업 횟수에서 한 번을 차감하고(기본값은 비회원 하루 5회, 무료 계정 30회), 실패한 작업은 환불돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ],
      privacyNote: '자르기 도구는 자체 서버에서 ffprobe와 FFmpeg 명령 하나를 실행해요. 기본 경로에서는 동영상과 오디오 패킷을 디코딩하지 않고 복사만 하므로, 서버가 파일에서 단 한 장의 화면도 재구성하지 않아요. 다시 인코딩 경로에서는 FFmpeg가 남긴 구간만 디코딩해요. 업로드는 uploads/<jobId>/에, 클립은 outputs/<jobId>/에 저장되며, 둘 다 보관 기록부에 등록되고 보관 기간이 끝나면 삭제돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 자르기는 특수 모드이므로 일반 변환에 적용되는 자동 콘텐츠 분석이 이 업로드에는 실행되지 않으며, 외부 서비스로는 아무것도 전송되지 않아요.',
      faq: [
        {
          question: '자르기를 하면 동영상이 다시 인코딩되나요?',
          answer: '기본적으로는 아니에요. 서버가 -c copy로 압축된 스트림을 복사하므로 남긴 부분은 원본과 똑같아요. 프레임 단위 정확도 옵션을 선택했거나, H.264 파일에 WebM을 고른 경우처럼 선택한 컨테이너가 원본 코덱을 담을 수 없을 때만 다시 인코딩해요.',
        },
        {
          question: '클립이 입력한 시간보다 조금 일찍 시작되는 이유는 무엇인가요?',
          answer: '스트림 복사는 키프레임에서만 시작할 수 있고, FFmpeg는 시작 시간과 같거나 그 이전의 가장 가까운 키프레임을 골라요. 카메라 영상에서 키프레임 간격은 보통 1~2초예요. 정확한 프레임에서 시작하려면 ‘프레임 단위로 정확하게 자르기 위해 다시 인코딩’을 선택하세요.',
        },
        {
          question: '어떤 출력 컨테이너를 고를 수 있고, 어떤 것이 원본 화질을 유지하나요?',
          answer: 'MP4, MOV, WebM이에요. MP4와 MOV는 대부분의 카메라가 만드는 H.264 또는 HEVC 동영상과 AAC 오디오를 받아들이므로 무손실로 유지돼요. WebM은 VP8, VP9, AV1만 받기 때문에, 이 선택에서는 H.264 원본이 CRF 18의 VP9로 다시 인코딩돼요.',
        },
        {
          question: '자른 클립은 얼마나 길거나 짧을 수 있나요?',
          answer: '끝이 시작보다 뒤여야 하며, 최소 0.1초, 최대 6시간이에요. 실제로는 업로드 한도가 먼저 적용돼요. 기본적으로 비회원은 동영상 5분, 무료 계정은 20분, Premium은 2시간이에요.',
        },
        {
          question: '모든 오디오 트랙과 자막이 유지되나요?',
          answer: '스트림 복사 경로에서는 그래요. -map 0이 파일의 모든 스트림을 복사해요. 다시 인코딩 경로에서는 첫 번째 동영상 스트림과 첫 번째 오디오 스트림만 유지돼요.',
        },
        {
          question: '동영상을 한 번에 여러 부분으로 자를 수 있나요?',
          answer: '아니요. 업로드 한 번으로 한 구간에서 클립 하나를 만들어요. 여러 조각이 필요하면 구간마다 자르기 도구를 한 번씩 실행하거나, Darkroom의 타임라인에서 조각들을 이어 붙이세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '가능하면 스트림 복사(화질 손실 없음), 다시 인코딩 대체 경로는 MP4에 H.264 + AAC를 사용해요.',
        ],
      },
      related: [
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '자른 다음 클립 크기를 줄이세요.',
        },
        {
          label: '동영상을 애니메이션 GIF로 변환',
          to: '/tools/convert-video-to-animated-gif',
          description: '자른 몇 초를 GIF로 바꾸세요.',
        },
        {
          label: '동영상에서 오디오 추출',
          to: '/tools/extract-audio-from-video',
          description: '클립의 소리만 저장하세요.',
        },
        {
          label: 'AI 동영상 복원',
          to: '/tools/ai-video-restoration',
          description: '복원은 15초 이하의 짧은 클립에서 작동해요. 먼저 자르세요.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '자른 여러 조각을 하나의 편집본으로 이어 붙이세요.',
        },
      ],
      embed: {
        title: '동영상 자르기',
        description: '동영상을 업로드한 다음 시작 시간과 종료 시간을 설정하세요(또는 구간을 눈으로 보며 선택하세요). 가능하면 빠른 무손실 자르기로 원본 화질을 유지해요.',
      },
    },
    'extract-audio-from-video': {
      name: '동영상에서 오디오 추출',
      h1: '동영상에서 오디오 추출',
      tagline: '어떤 동영상이든 오디오 트랙을 깔끔한 MP3, WAV, M4A, AAC, FLAC, OGG 파일로 저장하세요.',
      metaTitle: '동영상에서 오디오 추출: MP3, WAV, M4A 등 | Media Manipulator',
      metaDescription: '모든 동영상 파일(MP4, MOV, MKV, WebM, AVI)에서 오디오를 추출하는 무료 온라인 도구입니다. MP3, WAV, M4A, AAC, FLAC, OGG로 출력할 수 있습니다. 가입이 필요 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '동영상에서 오디오 추출',
      ogDescription: 'MP4/MOV/MKV/WebM/AVI의 오디오 트랙을 MP3, WAV, M4A, AAC, FLAC, OGG로 저장하세요. 무료, 가입 불필요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      intro: '모든 동영상 컨테이너는 오디오를 별도의 스트림으로 담고 있으므로, 소리를 꺼내는 데 영상은 전혀 관여하지 않아요. 이 페이지는 FFmpeg에 첫 번째 오디오 스트림을 선택하고, 영상은 무시하고, 그 스트림을 선택한 형식으로 인코딩하도록 요청해요. 음악을 재생하는 모든 기기에는 MP3, 샘플을 손대지 않고 유지하려면 WAV나 FLAC, 휴대폰이 기본으로 처리하는 작은 파일에는 M4A나 AAC, 또는 OGG Vorbis를 고르세요. 시작하기 전에 서버가 ffprobe로 오디오 스트림이 있는지 확인해요. 그렇지 않으면 FFmpeg가 아무 경고 없이 빈 파일을 써 버리기 때문이에요.',
      whatItDoes: [
        'MP4, MOV, M4V, WebM, MKV, AVI 등 흔히 쓰는 동영상 컨테이너에서 첫 번째 오디오 스트림을 선택하고(-map 0:a:0) 영상은 버려요(-vn).',
        'MP3는 libmp3lame 품질 2(평균 약 190 kbps의 가변 비트레이트), WAV는 16비트 PCM, M4A 또는 AAC는 192 kbps, FLAC은 무손실, OGG는 libvorbis 품질 5로 인코딩해요.',
        '원래 샘플 레이트와 채널 수를 유지해요. 리샘플링하거나 다운믹스하지 않아요.',
        '오디오 스트림이 없는 동영상은 추출할 것이 없다는 메시지와 함께 처음부터 거부해요.',
        '원본 이름에 선택한 확장자를 붙인 오디오 파일 하나를 돌려드려요.',
      ],
      flowSteps: [
        {
          title: '동영상 업로드',
          description: '흔히 쓰는 컨테이너라면 모두 돼요. 파일은 곧바로 저희 스토리지 버킷으로 가고 API가 가져가요.',
        },
        {
          title: '오디오 형식 선택',
          description: 'MP3가 기본으로 선택돼 있어요. WAV와 FLAC은 무손실, M4A와 AAC는 용량이 작고, OGG는 개방형 손실 형식이에요.',
        },
        {
          title: 'ffprobe가 오디오 스트림 확인',
          description: '소리 없는 동영상은 빈 파일을 만드는 대신 여기서 명확한 오류와 함께 멈춰요.',
        },
        {
          title: 'FFmpeg가 스트림 인코딩',
          description: '-map 0:a:0 -vn과 선택한 형식의 인코더를 쓰는 명령 하나로 처리해요.',
        },
        {
          title: '오디오 다운로드',
          description: '파일은 보관 기간이 끝날 때까지 작업 폴더에 남아 있어요.',
        },
      ],
      advancedDetails: [
        '명령은 ffmpeg -y -i input -map 0:a:0 -vn <encoder args> output이에요(specialized_tools.go의 runExtractAudio). -vn은 동영상 스트림을 아예 디코딩하지 않는다는 뜻이라서 4K 원본에서도 추출이 빨라요.',
        'MP3는 LAME V2 가변 비트레이트 설정인 -c:a libmp3lame -q:a 2를 사용하며, 음악에서는 평균 약 190 kbps, 말소리에서는 그보다 낮아요. WAV는 -c:a pcm_s16le를 사용하므로 44.1 kHz 스테레오 원본은 분당 약 10.1 MB, 48 kHz 원본은 분당 약 11 MB가 필요해요.',
        'M4A와 AAC는 모두 -b:a 192k로 FFmpeg 기본 AAC 인코더를 사용해요. FLAC은 무손실이며 보통 WAV 크기의 50~70퍼센트 정도가 돼요. OGG는 -c:a libvorbis -q:a 5를 사용하며 약 160 kbps예요.',
        '-ar 또는 -ac 플래그를 전달하지 않으므로 출력은 원본의 샘플 레이트와 채널 구성을 유지해요. WAV와 FLAC에서는 5.1 서라운드가 그대로 5.1로 남지만, MP3에는 최대 두 채널까지만 담겨요.',
        '스트림 0:a:0만 매핑돼요. 해설 트랙이나 두 번째 언어 트랙이 있는 파일은 컨테이너에 먼저 나열된 트랙만 남아요.',
        '추출은 특수 모드예요. 업로드는 일반 변환에서 거치는 자동 콘텐츠 분석 대기열에 들어가지 않으며, 동영상 변환기의 품질, 크기 조정, 효과 컨트롤도 적용되지 않아요.',
      ],
      whyItMatters: [
        '팟캐스터, 받아쓰기 작업자, 편집자는 보통 픽셀 없이 소리만 필요하며, 동영상은 그 안에 든 오디오보다 20~50배 큰 경우가 많아요.',
        '태그가 올바르게 붙은 MP3나 M4A는 배터리를 소모하는 동영상 디코딩 없이 모든 휴대폰과 모든 플레이어에서 재생돼요.',
        '무손실 WAV나 FLAC 출력은 노이즈 정리, 보컬 분리, 꼼꼼한 받아쓰기에 알맞은 입력이에요.',
      ],
      useCases: [
        {
          title: '오디오 전용 에피소드',
          description: '녹화한 동영상 인터뷰의 소리를 팟캐스트 MP3로 게시하세요.',
        },
        {
          title: '받아쓰기 준비',
          description: '18분짜리 녹화본을 540 MB MP4 대신 25 MB MP3로 받아쓰기 도구에 넣으세요.',
        },
        {
          title: '사운드 디자인과 샘플링',
          description: '클립에서 WAV를 뽑아 다른 편집에서 앰비언스나 음악을 재사용하세요.',
        },
        {
          title: '강의 노트',
          description: '수업 녹화본의 오디오를 보관해 이동 중에 들으세요.',
        },
      ],
      workedExamples: [
        {
          title: '18분, 540 MB 720p 녹화본을 MP3로',
          body: '입력: 18분 길이의 1280 x 720 MP4, 540 MB(약 4 Mbps). 비회원 기본 한도인 200 MB와 5분을 넘기 때문에 무료 계정으로 업로드했어요. 설정: MP3. 서버가 ffprobe로 스테레오 48 kHz AAC 트랙을 확인하고 libmp3lame -q:a 2를 실행해요. 약 190 kbps면 분당 약 1.4 MB이므로, 결과는 약 25 MB로 업로드 파일의 약 이십분의 일이에요. -vn이 영상을 완전히 건너뛰므로 작업은 단순한 오디오 디코딩과 인코딩이라 빨라요. 540 MB를 업로드하는 데 걸리는 시간이 추출 시간보다 훨씬 길어요.',
        },
        {
          title: '4분, 95 MB 1080p 뮤직비디오를 WAV로',
          body: '입력: 4분 길이의 1920 x 1080 MP4, 95 MB, 44.1 kHz 스테레오 AAC 트랙 포함, 비회원 한도 이내. 설정: WAV. FFmpeg가 AAC를 한 번 디코딩하고 pcm_s16le로 16비트 PCM을 써요. 44.1 kHz와 두 채널은 그대로 유지돼요. 이 샘플 레이트의 PCM은 초당 44,100 x 16 x 2비트, 즉 분당 약 10.1 MB이므로 음악이 얼마나 크거나 복잡하든 파일은 약 40 MB가 돼요. 대신 FLAC을 고르면 같은 샘플을 무손실로 압축해 소재에 따라 약 20~28 MB가 돼요. 소요 시간은 오디오 디코딩 몇 초뿐이고, 영상은 전혀 건드리지 않아요.',
        },
      ],
      whenNotToUse: '소리를 개선하려고 이 페이지를 쓰지 마세요. 있는 그대로 복사할 뿐이라 잡음이 많거나 멀리서 녹음된 소리는 그대로 남아요. 그런 용도에는 음성 오디오 정리와 배경 소음 제거 도구가 있어요. WAV가 동영상에서 잃어버린 음질을 되살려 줄 거라고 기대하지 마세요. 원본 트랙은 거의 항상 손실 AAC이므로, WAV는 스튜디오 마스터가 아니라 압축된 신호를 충실히 복사한 것일 뿐이에요. 동영상에 언어 트랙이 두 개 있고 두 번째 트랙이 필요하다면, 이 도구는 첫 번째 트랙만 가져와요. 그리고 정말 원하는 것이 말의 내용이라면, 받아쓰기 도구가 오디오를 읽어 텍스트와 자막을 바로 만들어 드려요.',
      whyMediaManipulator: [
        '인코더 설정을 명시해요. MP3는 LAME V2, AAC는 192 kbps, WAV는 16비트 PCM이며, 모든 형식에서 원래 샘플 레이트를 유지해요.',
        '소리 없는 동영상은 처리가 시작되기 전에 ffprobe가 잡아내므로 길이가 없는 빈 파일을 다운로드할 일이 없어요.',
        '추출 한 번은 일일 일반 작업 횟수에서 한 번으로 계산돼요. 기본적으로 비회원은 하루 5회, 무료 계정은 30회이며, 거부되거나 실패한 작업은 횟수를 돌려드려요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ],
      privacyNote: '추출은 저희 자체 서버에서 업로드 파일의 첫 번째 오디오 스트림만 읽는 FFmpeg 명령 하나로 실행돼요. 영상 프레임은 디코딩되지 않아요. 업로드한 파일은 uploads/<jobId>/에, 오디오는 outputs/<jobId>/에 저장되며, 둘 다 보관 기록부에 등록되어 보관 기간이 끝나면 삭제돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 추출은 특수 모드이므로 업로드는 일반 변환에서 거치는 자동 콘텐츠 분석을 거치지 않아요. 받아쓰거나 설명을 생성하지 않으며, 어떤 것도 저희 하드웨어 밖으로 나가지 않아요.',
      faq: [
        {
          question: '어떤 오디오 형식으로 추출할 수 있고, 무손실 형식은 무엇인가요?',
          answer: 'MP3, WAV, M4A, AAC, FLAC, OGG예요. WAV와 FLAC은 디코딩된 트랙의 무손실 사본이에요. MP3(약 190 kbps VBR), M4A와 AAC(192 kbps), OGG(품질 5)는 손실 형식이지만 대부분의 동영상 사운드트랙보다 비트레이트가 높아요.',
        },
        {
          question: '추출한 오디오는 얼마나 큰가요?',
          answer: 'WAV는 44.1 kHz 스테레오에서 분당 약 10.1 MB, 48 kHz에서는 11 MB예요. 이 페이지 설정의 MP3는 분당 약 1.4 MB, 192 kbps의 M4A와 AAC는 분당 약 1.4 MB, OGG는 분당 약 1.2 MB예요. FLAC은 보통 WAV 크기의 절반에서 삼분의 이 사이예요.',
        },
        {
          question: '추출하면 샘플 레이트나 스테레오 이미지가 바뀌나요?',
          answer: '아니요. FFmpeg를 -ar이나 -ac 없이 실행하므로 출력은 원본의 샘플 레이트와 채널 구성을 유지해요. 48 kHz 스테레오 트랙은 48 kHz 스테레오 그대로예요.',
        },
        {
          question: '동영상에 오디오가 없으면 어떻게 되나요?',
          answer: '서버가 먼저 파일을 검사하고 추출할 것이 없다는 메시지와 함께 멈춰요. 작업 횟수는 돌려드리고, 빈 파일은 만들어지지 않아요.',
        },
        {
          question: '동영상에 오디오 트랙이 두 개 있으면 어느 쪽을 받나요?',
          answer: '컨테이너의 첫 번째 트랙인 스트림 0:a:0이에요. 아직 트랙 선택 기능은 없어요. 필요한 트랙이 두 번째라면 먼저 그 트랙으로 동영상을 리먹싱하거나 다시 내보내세요.',
        },
        {
          question: '오디오 추출은 무료인가요? 얼마나 긴 동영상을 업로드할 수 있나요?',
          answer: '네, 무료예요. 기본적으로 비회원은 최대 200 MB, 5분 길이의 파일로 하루 5회 작업할 수 있고, 무료 계정은 하루 30회, 1 GB, 20분까지, Premium은 5 GB, 2시간까지 가능해요. 현재 한도는 요금 페이지에 나와 있어요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '첫 번째 오디오 스트림을 추출해요. 오디오 스트림이 없는 동영상은 빈 파일 대신 명확한 오류를 반환해요.',
        ],
      },
      related: [
        {
          label: '동영상 텍스트 변환',
          to: '/tools/transcribe-video',
          description: '오디오 파일을 거치지 않고 바로 말의 내용을 얻으세요.',
        },
        {
          label: '음성 오디오 정리',
          to: '/tools/clean-voice-audio',
          description: '추출한 말소리의 잡음을 줄이고 음량을 고르게 맞추세요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: '추출한 트랙에서 험 노이즈와 쉭쉭거리는 소리를 없애세요.',
        },
        {
          label: '노래에서 보컬 제거',
          to: '/tools/remove-vocals-from-song',
          description: '추출한 음악을 인스트루멘털로 만드세요.',
        },
        {
          label: '동영상 자르기',
          to: '/tools/video-trimmer',
          description: '추출하기 전에 원하는 부분만 남도록 동영상을 자르세요.',
        },
      ],
      embed: {
        title: '동영상에서 오디오 트랙 추출',
        description: '흔히 쓰는 동영상 컨테이너라면 무엇이든 업로드하세요. 폭넓은 호환성에는 MP3, 무손실에는 WAV, 작은 압축 파일에는 M4A/AAC를 고르세요. 오디오 트랙이 없는 동영상은 명확한 오류를 반환해요.',
      },
    },
    'convert-video-to-animated-gif': {
      name: '동영상을 움직이는 GIF로 변환',
      h1: '동영상을 움직이는 GIF로 온라인 변환하기',
      tagline: '짧은 MP4, WebM, MOV, MKV 클립을 공유하기 좋은 움직이는 GIF로 몇 초 만에 바꾸세요.',
      metaTitle: '동영상을 움직이는 GIF로 온라인 변환 (무료) | Media Manipulator',
      metaDescription: '무료 온라인 동영상 GIF 변환기입니다. 짧은 MP4, WebM, MOV, MKV 클립을 크기와 프레임 레이트를 조절해 움직이는 GIF로 바꾸세요.',
      ogTitle: '동영상을 움직이는 GIF로 온라인 변환하기',
      ogDescription: '짧은 동영상 클립을 공유하기 좋은 움직이는 GIF로 바꾸세요. 프레임 레이트, 크기, 반복을 조절할 수 있어요.',
      intro: '움직이는 GIF는 인덱스 색상 프레임을 쌓아 놓은 것으로, 팔레트당 최대 256색이며 단순한 런 렝스 부호화 외에는 프레임 간 압축이 없어요. 그래서 몇 초짜리 GIF가 일 분짜리 MP4보다 무거울 수 있고, 좋은 GIF를 만드는 일은 대부분 너비, 프레임 레이트, 팔레트 크기를 고르는 일이에요. 이 페이지는 두 단계 파이프라인을 실행해요. FFmpeg가 동영상을 설정한 너비로 조정하고 설정한 프레임 레이트로 샘플링해 원시 GIF를 만든 다음, gifsicle이 팔레트를 지정한 색 수로 다시 양자화하고, 프레임 지연을 설정하고, 바뀐 픽셀만 저장되도록 프레임을 최적화해요. 기본값은 화면 녹화에 맞춰져 있어요: 너비 900픽셀, 초당 12프레임, 128색.',
      whatItDoes: [
        '클립을 선택한 너비(16에서 2000 px)로 조정하고, 높이는 가로세로 비율로 계산해 4의 배수로 반올림해요.',
        'FFmpeg로 원본을 선택한 프레임 레이트(1에서 50 fps, 기본 12)로 샘플링해요.',
        '각 프레임을 2에서 256색(기본 128색) 팔레트로 양자화하고, gifsicle로 레벨 1에서 3까지 프레임 간 저장을 최적화해요.',
        '프레임 지연을 백분의 일 초 단위로 설정해요. 이 값이 샘플링 속도와 별개로 재생 속도를 결정해요.',
        '변환기 양식의 자르기 구간을 따르므로 선택한 구간만 프레임이 돼요.',
      ],
      flowSteps: [
        {
          title: '동영상 업로드 후 GIF 선택',
          description: '이 페이지에서는 출력으로 GIF가 이미 선택되어 있어요. 품질 컨트롤은 적용되지 않으므로 비활성화돼요.',
        },
        {
          title: '몇 초로 자르기',
          description: '자르기 컨트롤로 원하는 순간만 남기세요. 기본 속도에서는 구간이 한 초 늘어날 때마다 프레임이 12개 늘어나요.',
        },
        {
          title: '너비, 프레임 레이트, 색 수, 지연 설정',
          description: '애니메이션 GIF 설정 패널은 900 px, 12 fps, 128색, 지연 3, 최적화 3에서 시작해요.',
        },
        {
          title: 'FFmpeg가 샘플링하고 gifsicle이 최적화',
          description: 'ffmpeg scale=W:-4 -pix_fmt rgb8 -r FPS, 그다음 gifsicle --optimize --delay --colors --interlace.',
        },
        {
          title: 'GIF 다운로드',
          description: '채팅 앱과 브라우저에서 인라인으로 재생되는 표준 반복 GIF예요.',
        },
      ],
      advancedDetails: [
        '첫 번째 단계는 ffmpeg -i input [-ss START -t DURATION] -vf scale=W:-4 -pix_fmt rgb8 -r FPS -f gif raw.gif예요(converter.go의 convertVideoToGIF). -4는 가로세로 비율을 유지하면서 4로 나누어떨어지는 높이를 요청하고, rgb8은 두 번째 단계에서 다시 양자화하는 8비트 인덱스 중간 형식이에요.',
        '두 번째 단계는 gifsicle --optimize=L --delay=D --colors C --interlace raw.gif -o output.gif예요. 최적화 레벨 3은 가장 느리지만 가장 작아요. 프레임 사이에 바뀐 픽셀 영역만 저장하기 때문에, 툴바가 고정된 스크린캐스트가 패닝하는 카메라 영상보다 훨씬 잘 압축돼요.',
        '지연은 샘플링 후 모든 프레임에 적용되며 샘플링 속도와는 별개예요. 기본값인 12 fps와 지연 3(프레임당 30 ms)에서는 클립이 실제 시간보다 약 2.8배 빠르게 재생돼요. 12 fps에서 거의 실제 시간으로 재생하려면 지연을 8(80 ms, 12.5 fps)로, 10 fps라면 10으로 설정하세요.',
        '변환기의 기본 너비 필드에 입력한 값이 GIF 패널의 너비보다 우선하므로, 숙련 사용자는 조절 항목 하나만 관리하면 돼요. 색 수는 양식에서 2에서 256 사이로 제한돼요. GIF 팔레트는 절대 256을 넘을 수 없어요.',
        '여기서는 FFmpeg의 palettegen 패스가 없어요. 팔레트 품질은 애니메이션 전체에 대해 최적화된 팔레트 하나를 만드는 gifsicle --colors에서 나와요. 부드러운 그라데이션이 있는 사진 같은 클립은 256색이 좋고, 단순한 UI 영상은 64색에서도 똑같아 보여요.',
        'gifsicle 단계는 6시간 제한 시간 안에서 실행되며, GIF가 일반 동영상 변환기의 형식이므로 업로드한 파일은 표준 변환과 같은 자동 콘텐츠 분석도 거쳐요.',
      ],
      whyItMatters: [
        'GIF는 이슈 트래커, 채팅 앱, 문서 사이트, 이메일 클라이언트에서 인라인으로 자동 재생돼요. 동영상 첨부라면 재생 버튼만 보이거나 아무것도 보이지 않는 곳에서도요.',
        '버그를 담은 5초짜리 GIF는 문단 하나보다 빠르게 버그를 재현해 보여 주고, 동영상 플레이어도 필요 없어요.',
        '팔레트와 프레임 레이트 선택에 따라 크기가 열 배 단위로 달라지므로, 이를 직접 조절할 수 있게 하는 편이 일괄 프리셋보다 나아요.',
      ],
      useCases: [
        {
          title: '버그 재현',
          description: '화면을 녹화하고, 오류가 나는 부분으로 자른 뒤, 티켓에 GIF를 넣으세요.',
        },
        {
          title: 'README와 문서 데모',
          description: '동영상 임베드가 허용되지 않는 곳에서 기능이 움직이는 모습을 보여 주세요.',
        },
        {
          title: '리액션 클립',
          description: '동영상에서 3초를 잘라 이미지를 받는 곳이라면 어디든 공유하세요.',
        },
        {
          title: '이메일 미리보기',
          description: '동영상 자체가 재생되지 않는 곳에서, 전체 동영상으로 연결되는 작은 반복 GIF.',
        },
      ],
      workedExamples: [
        {
          title: '기본값으로 변환한 8초짜리 1080p 화면 녹화',
          body: '입력: 약 15 MB의 8초, 1920 x 1080 MP4 화면 녹화. 설정: GIF, 너비 900, 12 fps, 128색, 지연 3, 최적화 3. FFmpeg가 너비 900픽셀, 높이 약 506픽셀(4의 배수로 조정)로 조정하고 96프레임을 샘플링해요. 압축하지 않으면 이 96개의 인덱스 프레임은 약 43 MB(900 x 504 x 96바이트)로, gifsicle이 줄여 나가는 출발점이에요. 툴바가 고정되어 있고 커서만 움직인다면 레벨 3 최적화가 바뀌는 영역만 저장하므로, 스크린캐스트는 그 상한보다 훨씬 작게, 보통 몇 메가바이트 정도로 나와요. 지연 3이면 96프레임이 약 2.9초 만에 재생되어 8초 원본보다 대략 2.8배 빨라요. 지연을 8로 하면 약 7.7초에 재생돼요. 작업은 짧은 인코딩과 96프레임에 대한 gifsicle 패스 한 번이에요.',
        },
        {
          title: '480 px, 10 fps, 64색으로 만든 5초짜리 리액션 클립',
          body: '입력: 20초, 1080p, 40 MB의 MP4를 양식에서 5초 구간으로 잘랐어요. 설정: GIF, 너비 480, 10 fps, 64색, 지연 10, 최적화 3. FFmpeg가 5초를 잘라 너비 480픽셀, 높이 약 270픽셀(4의 배수로 반올림)로 조정하고 50프레임을 샘플링해요. 최적화 전 원시 프레임 데이터는 약 6.5 MB(480 x 268 x 50바이트)이고, 64색 팔레트는 픽셀당 6비트만 필요하므로 화면 전체에 움직임이 있는 카메라 영상도 그보다 꽤 작게 나오며, 안정적인 토킹 헤드는 그 일부 크기로 압축돼요. 지연 10은 프레임당 100 ms이므로 50프레임이 정확히 5초에 재생되어, 10 fps에서 실제 시간과 일치해요.',
        },
      ],
      whenNotToUse: '약 10초보다 긴 영상이나 화면 전체에 사진 같은 움직임이 있는 영상은 GIF로 만들지 마세요. 이 형식에는 제대로 된 프레임 간 압축이 없어서 그런 클립은 수십 메가바이트가 되지만, 같은 내용의 MP4나 WebM은 그 십분의 일 크기예요. 색 재현이 중요할 때도 GIF는 쓰지 마세요. 모든 프레임이 256색 팔레트로 제한되어 그라데이션에 띠가 생겨요. 목적지에서 동영상이 인라인으로 재생된다면 압축한 MP4가 모든 면에서 더 나아요. 그리고 오디오가 필요하다면 GIF는 소리를 아예 담을 수 없어요.',
      whyMediaManipulator: [
        '파이프라인의 두 단계와 그 기본값이 여기에 문서화되어 있어요. 기본 GIF가 빠르게 재생되는 이유인 지연 동작도 포함해서요.',
        '크기 슬라이더 하나가 아니라 너비, 프레임 레이트, 색 수, 지연, 최적화 레벨을 모두 조절할 수 있어요.',
        'GIF 변환 한 번은 일일 일반 작업 한 번으로 집계되며(기본적으로 비회원은 하루 5회, 무료 계정은 30회), 실패한 작업은 횟수가 환불돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ],
      privacyNote: 'GIF 변환은 저희 자체 서버에서 실행돼요. FFmpeg가 프레임을 샘플링하고 크기를 조정한 다음 gifsicle이 양자화하고 최적화하며, 임시 원시 GIF는 gifsicle이 끝나는 즉시 삭제돼요. 업로드한 파일은 uploads/<jobId>/에, GIF는 outputs/<jobId>/에 보관되며, 둘 다 보관 대장에 등록되어 기간이 끝나면 삭제돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 표준 동영상 변환기의 형식이므로 업로드한 파일은 같은 하드웨어에서 자동 콘텐츠 분석도 거쳐요(샘플링한 프레임을 로컬 비전 모델이 설명하고, 오디오가 있으면 로컬에서 전사). 그 보고서는 작업과 함께 남으며 외부와 공유되지 않아요.',
      faq: [
        {
          question: 'GIF가 원본 동영상보다 빠르게 재생되는 이유는 무엇인가요?',
          answer: '프레임 지연은 샘플링 후에 설정되며 기본값은 3(백분의 일 초 단위)이에요. 초당 12개로 샘플링한 프레임이 초당 약 33프레임으로 재생되는 셈이에요. 실제 시간으로 재생하려면 12 fps에서는 지연을 8로, 10 fps에서는 10으로 설정하세요.',
        },
        {
          question: 'GIF를 더 작게 만들려면 어떻게 하나요?',
          answer: '효과가 큰 순서대로: 더 짧게 자르고, 너비를 낮추고(채팅에는 480이면 충분해요), 프레임 레이트를 8이나 10으로 낮추고, 단순한 UI 영상이라면 색 수를 64로 줄이세요. 최적화는 3으로 두세요. 레벨 1과 2는 크기를 희생해 속도를 얻을 뿐이에요.',
        },
        {
          question: '색 수는 얼마로 해야 하나요?',
          answer: '기본값인 128은 대부분의 화면 녹화에 적합해요. 단순한 인터페이스는 64에서도 똑같아 보이고 용량을 아낄 수 있어요. 그라데이션이 있는 사진 같은 영상은 GIF 최댓값인 256이 필요해요.',
        },
        {
          question: '동영상의 어느 부분을 GIF로 만들지 고를 수 있나요?',
          answer: '네. 변환기의 자르기 컨트롤로 시작과 끝을 정하면 그 구간만 샘플링돼요. 초마다 선택한 속도만큼 프레임이 늘어나므로 짧을수록 좋아요.',
        },
        {
          question: 'GIF가 반복 재생되나요? 소리도 유지되나요?',
          answer: '모든 플레이어에서 GIF가 기본적으로 그렇듯 반복 재생돼요. 오디오는 담을 수 없어요. 이 형식에는 사운드 트랙이 없어요. 필요하다면 오디오를 따로 추출하세요.',
        },
        {
          question: '만들 수 있는 가장 큰 GIF는 어느 정도인가요?',
          answer: '양식에서는 너비 최대 2000 px, 50 fps, 256색까지 허용하지만, 그 설정의 GIF는 금세 엄청나게 커져요. 업로드 자체는 요금제에 따라 제한되며, 비회원은 기본적으로 200 MB와 동영상 5분이에요.',
        },
      ],
      related: [
        {
          label: '동영상 자르기',
          to: '/tools/video-trimmer',
          description: '먼저 원하는 초만 손실 없이 잘라내세요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '몇 초보다 긴 영상이라면 작은 MP4가 GIF보다 나아요.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '클립을 내보내기 전에 자막을 넣거나 화면을 자르세요.',
        },
        {
          label: '동영상 변환기 튜토리얼',
          to: '/tutorials/video/getting-started',
          description: '자르기, 크기 조절, 필터 설정을 차근차근 알아보세요.',
        },
      ],
      embed: {
        title: '동영상 클립을 GIF로 변환',
        description: '짧은 동영상을 업로드하고 출력 형식으로 GIF를 고르세요. 파일을 더 작게 하려면 약 10초 이하로 자르고 프레임 레이트를 낮추세요.',
      },
    },
    'transcribe-video': {
      name: '동영상 텍스트 변환',
      h1: '동영상을 텍스트로 온라인 변환하기',
      tagline: '동영상이나 오디오 파일 속 음성을 WebVTT 또는 SRT 자막, 일반 텍스트, 타임스탬프가 있는 JSON으로 추출하세요.',
      metaTitle: '동영상을 텍스트로 온라인 변환 (무료) | Media Manipulator',
      metaDescription: '무료 온라인 동영상 받아쓰기 도구입니다. MP4, MOV, WebM, MKV, 오디오 파일을 검색 가능한 텍스트, VTT 자막, JSON 스크립트로 변환하세요.',
      ogTitle: '동영상을 텍스트로 온라인 변환하기',
      ogDescription: '동영상의 음성을 텍스트, 자막 또는 JSON 전사본으로 추출하세요. 로컬 GPU 서버에서 실행돼요.',
      intro: '동영상 텍스트 변환은 MP4, MOV, WebM, MKV 또는 일반 오디오 파일을 받아 오디오 트랙을 분리하고, 저희가 운영하는 GPU 서버의 Whisper로 처리해요. 결과 형태는 업로드하기 전에 고르세요: 자막 타이밍이 있는 WebVTT 또는 SRT 자막 파일, 말한 내용만 담긴 일반 텍스트 파일, 또는 모든 구간과 그 시작·종료 시간을 밀리초 단위로 담은 JSON 문서예요. 언어는 자동으로 감지되며, 두 글자 코드를 입력해 고정할 수도 있어요.',
      whatItDoes: [
        'ffmpeg로 오디오 트랙을 Whisper가 요구하는 샘플레이트인 16 kHz 모노 WAV로 디코딩하고, 작업이 끝나면 그 중간 파일을 삭제해요.',
        '저희 GPU에서 medium Whisper 모델을 float16으로 whisper-ctranslate2로 실행하며, 음성 구간 필터를 켜서 무음과 긴 음악 구간은 건너뛰어요.',
        '선택한 형식에 따라 transcript.vtt, transcript.srt, transcript.txt 또는 transcript.json이라는 파일 하나를 작성해요.',
        '오디오 자체에서 말한 언어를 감지해요. 짧거나 여러 언어가 섞인 클립이라면 양식에 입력한 언어 코드가 감지 결과보다 우선해요.',
        '전사할 내용이 없을 때도 정직하게 알려 줘요. 오디오 스트림이 없는 동영상이나 알아들을 수 있는 말이 없는 오디오도 빈 파일 대신 짧은 메시지와 함께 완료돼요.',
      ],
      flowSteps: [
        {
          title: '동영상 또는 오디오 업로드',
          description: 'MP4, MOV, WebM, MKV, AVI 또는 MP3, WAV, M4A, FLAC 같은 오디오 파일.',
        },
        {
          title: '형식 선택',
          description: '자막이라면 VTT 또는 SRT, 읽기 쉬운 전사본이라면 TXT, 처리할 수 있는 타임스탬프가 필요하면 JSON.',
        },
        {
          title: 'ffmpeg가 오디오 추출',
          description: '트랙이 16 kHz 모노 PCM으로 변환돼요. 동영상 프레임은 전혀 디코딩하지 않아요.',
        },
        {
          title: '저희 GPU에서 Whisper가 전사',
          description: '작업은 빈 GPU 슬롯을 기다린 다음, medium 모델이 파일 전체를 한 번에 처리해요.',
        },
        {
          title: '전사본 다운로드',
          description: '파일이 작업과 함께 나타나며, 작업이 보관되는 동안 다운로드할 수 있어요.',
        },
      ],
      advancedDetails: [
        '정확한 추출 명령은 ffmpeg -vn -acodec pcm_s16le -ar 16000 -ac 1이므로, 48 kHz 스테레오 트랙은 Whisper가 보기 전에 모노로 합쳐지고 리샘플링돼요. 이 중간 파일은 작업 중에 초당 32 KB(분당 약 1.9 MB)의 디스크를 차지하고 끝나면 삭제돼요.',
        'whisper-ctranslate2는 --model medium --device cuda --compute_type float16 --vad_filter True와 --output_format json으로 실행되며, API가 그 JSON을 파싱해 선택한 형식으로 직접 렌더링해요. 모델은 서버 설정(WHISPER_CT2_MODEL)이므로 medium은 기본값일 뿐 보장은 아니에요.',
        'VTT 출력은 WEBVTT 헤더로 시작하고 각 자막 항목에 번호를 매기며, 타임스탬프는 HH:MM:SS.mmm이에요. SRT는 같은 자막 목록에 밀리초 구분자로 쉼표를 써요. 종료 시간이 시작 시간과 같은 구간에는 반 초를 부여해 플레이어가 표시할 수 있게 해요.',
        'JSON 출력에는 language, hasAudio, hasSpeech, transcript, durationSeconds와 밀리초 단위로 반올림된 시간이 담긴 {id, start, end, text} 형식의 segments 배열이 들어 있어요. 이 출력에는 단어별 타이밍도 신뢰도 점수도 없어요.',
        '기본적으로 Whisper 프로세스는 한 번에 하나만 실행되고(WHISPER_GPU_CONCURRENCY=1), GPU 스케줄러는 시작 전에 남은 VRAM을 확인해요. float16의 medium 모델에는 약 3.5 GB와 512 MB의 여유분이 필요해요. 카드가 사용 중이면 작업은 실패하지 않고 대기열에서 기다려요.',
        'VAD 필터가 켜져 있으므로 전부 음악이거나 아주 희미한 말소리만 있는 파일은 "Audio was detected but no recognizable speech was found."(오디오는 감지됐지만 알아들을 수 있는 말을 찾지 못했다는 뜻)라는 메시지로 돌아올 수 있어요. 이 메시지는 전사본 파일에 기록되므로 다운로드 파일이 비는 일은 없어요.',
      ],
      whyItMatters: [
        '자막 파일이 있느냐 없느냐에 따라 동영상을 소리 없이 보고, 검색하고, 인용할 수 있는지가 갈려요.',
        '타임스탬프가 있는 구간으로 어떤 말이 나온 순간으로 바로 이동할 수 있어요. 두 시간짜리 녹화를 실제로 쓸 수 있게 만드는 건 바로 이 기능이에요.',
        '저희가 운영하는 하드웨어에서 전사하므로 오디오가 외부 음성 API에 넘어가지 않아요.',
      ],
      useCases: [
        {
          title: '게시한 동영상의 자막',
          description: 'HTML 동영상과 대부분의 웹 플레이어에는 VTT를, 편집 프로그램과 TV 방식 자막 작업에는 SRT를 내보내세요.',
        },
        {
          title: '회의와 인터뷰 노트',
          description: '처음부터 타이핑하는 대신 TXT 출력을 문서로 가져와 거기서부터 편집하세요.',
        },
        {
          title: '녹화 아카이브 색인',
          description: 'JSON 구간으로 어떤 단어가 말해진 정확한 초를 가리키는 검색 색인을 만드세요.',
        },
        {
          title: '기사 초안',
          description: '강연이나 스크린캐스트를 전사한 다음 일반 텍스트를 글로 다시 쓰세요.',
        },
      ],
      workedExamples: [
        {
          title: '120 MB, 9분짜리 1080p MP4를 VTT 자막으로',
          body: '120 MB는 비회원 한도인 200 MB 미만이지만 9분은 비회원 한도인 5분을 넘으므로, 기본적으로 20분까지 허용하는 무료 계정이 필요해요. ffmpeg가 약 17 MB(540초 동안 초당 32,000바이트)의 16 kHz 모노 WAV를 만들고, 실행 후 삭제해요. 이어서 Whisper medium이 HH:MM:SS.mmm 타이밍의 번호 매긴 자막 항목을 만들고, 결과 transcript.vtt는 텍스트와 타임스탬프만 담기 때문에 몇 킬로바이트에 불과해요. 가정용 인터넷에서는 보통 120 MB 업로드가 몇 초면 끝나는 추출보다 오래 걸려요. 나머지는 Whisper 처리 시간이며, 동영상 크기가 아니라 말소리 길이에 비례해요.',
        },
        {
          title: '약 26 MB, 18분짜리 팟캐스트 MP3를 JSON으로',
          body: '192 kbps MP3는 초당 24 KB이므로 1,080초면 약 26 MB가 돼요. 오디오 전용 파일도 동영상과 같은 길이 한도를 따르므로, 18분이면 비회원 세션(5분)이 아니라 무료 계정(20분 한도)이 필요해요. 건너뛸 동영상은 없지만 파일은 먼저 16 kHz 모노 PCM으로 변환돼요(디스크에서 약 35 MB, 이후 삭제). 언어는 오디오에서 감지되어 JSON에 두 글자 코드로 기록되고, 각 구간에는 자체 시작·종료 시간이 있어요. 모든 구간이 각자의 객체로 감싸지므로 JSON은 같은 녹음의 TXT보다 크지만, 그래도 일 메가바이트에 한참 못 미쳐요.',
        },
      ],
      whenNotToUse: '단어별 타이밍, 화자 구분, 신뢰도 점수가 필요하다면 이 도구를 쓰지 마세요. 출력에는 그런 정보가 없고 구간 단위 타임스탬프만 있어요. 말소리 없이 음악만 있는 파일에도 맞지 않는 도구예요. 음성 구간 필터가 건너뛰어 가사 대신 짧은 메시지를 받게 돼요. 파일을 듣기만 하면 되거나 자막을 다른 언어로 번역하고 싶다면 다른 단계가 필요해요. 그리고 녹화가 요금제 허용 길이(기본적으로 비회원은 5분, 무료 계정은 20분)보다 길다면 먼저 자르거나 로그인하세요.',
      whyMediaManipulator: [
        '업로드하기 전에 VTT, SRT, TXT, JSON 중에서 고르므로, 전사본이 생긴 뒤 다시 변환할 필요가 없어요.',
        'Whisper는 모델 캐시를 오프라인 모드로 설정한 저희 자체 GPU에서 실행돼요. 어떤 외부 음성 서비스도 오디오를 받지 않아요.',
        '전사는 AI 작업 한 건으로 집계되어 일일 AI 작업 횟수에서 차감되며, 이는 일반 작업 횟수와 별개예요. 기본적으로 비회원은 하루 3회, 무료 계정은 10회이며, 일반 작업 횟수는 그대로 남아요(/pricing 참고).',
      ],
      privacyNote: '동영상이나 오디오 파일은 저희 서버의 작업 폴더에 저장돼요. ffmpeg가 임시 16 kHz 모노 WAV를 만들면 저희 GPU의 Whisper가 이를 읽고, 그 WAV는 작업이 끝나면 삭제돼요. 전사본 파일과 구간을 복사한 transcribe_result.json은 작업과 함께 남으며, 전사 텍스트는 자동 요약과 안전 검토를 위해 저희 자체 하드웨어에서 실행되는 언어 모델에도 전달되고 그 결과는 작업과 함께 보관돼요. 외부 AI 제공업체로는 아무것도 전송되지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      faq: [
        {
          question: '자막 형식은 VTT와 SRT 중 무엇을 골라야 하나요?',
          answer: '자막이 웹용(HTML 동영상, 대부분의 플레이어)이라면 VTT, 동영상 편집기나 방송 방식 작업에 들어간다면 SRT예요. 둘 다 같은 자막 항목을 담고 있고, 헤더와 밀리초 구분자만 달라요. VTT는 마침표, SRT는 쉼표를 써요.',
        },
        {
          question: 'JSON 전사본에 신뢰도 점수나 단어별 타이밍이 포함되나요?',
          answer: '아니요. 각 구간에는 id, 초 단위(밀리초로 반올림)의 시작·종료 시간, 텍스트가 있어요. 파일에는 감지된 언어, 길이, 말소리가 있었는지도 기록되지만, 단어별 타이밍과 확률은 없어요.',
        },
        {
          question: '얼마나 긴 파일까지 전사할 수 있나요?',
          answer: '오디오 전용 업로드도 동영상과 같은 길이 한도를 따라요. 기본적으로 비회원은 5분, 무료 계정은 20분, Premium과 Pro는 2시간이며, 파일당 각각 200 MB, 1 GB, 5 GB예요. 양식에 적용되는 한도가 표시되고, /pricing에 현재 수치가 나와 있어요.',
        },
        {
          question: '왜 "no recognizable speech was found"(알아들을 수 있는 말을 찾지 못함) 메시지가 나왔나요?',
          answer: 'Whisper는 음성 구간 감지를 켠 상태로 실행되므로, 음악, 주변 소음, 무음, 아주 희미한 말소리만 있는 파일은 남는 내용이 없을 수 있어요. 메시지가 전사본 파일 자체에 기록되므로 다운로드는 여전히 작동해요. 더 크게 다시 녹음하거나 말하는 부분만 잘라 다시 시도하세요.',
        },
        {
          question: '자동 감지 대신 언어를 지정할 수 있나요?',
          answer: '네. 언어 필드에 en, de, es 같은 두 글자 언어 코드를 입력하면 Whisper가 그 언어로 전사해요. 비워 두면 자동 감지되며, 몇 초보다 긴 클립에서 잘 작동해요.',
        },
        {
          question: '전사에 AI 작업 횟수가 쓰이나요?',
          answer: '네. 전사 한 번은 AI 작업 한 건이에요. 기본적으로 비회원은 하루 3회, 무료 계정은 10회, Premium은 100회, Pro는 200회예요. 일일 AI 작업 횟수는 별도의 카운터이므로 전사해도 변환에 쓰는 일일 일반 작업 횟수는 줄지 않아요. 실패한 작업은 횟수를 돌려받아요.',
        },
        {
          question: '어떤 모델을 쓰나요? 더 큰 모델을 고를 수 있나요?',
          answer: '서비스는 기본적으로 CUDA GPU에서 medium 모델을 float16으로 whisper-ctranslate2로 실행해요. 양식에는 모델 선택기가 없어요. 모델은 서버에서 설정되므로 아주 빠르거나 아주 큰 변형을 작업마다 요청할 수는 없어요.',
        },
      ],
      related: [
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '전사본을 받기 위해 업로드하기 전에 큰 녹화 파일을 줄이세요.',
        },
        {
          label: '동영상에서 오디오 추출',
          to: '/tools/extract-audio-from-video',
          description: '오디오 트랙도 따로 보관하고 싶다면 추출하세요.',
        },
        {
          label: '음성 오디오 정리',
          to: '/tools/clean-voice-audio',
          description: '전사하기 전에 잡음이 많은 녹음을 깨끗하게 다듬으세요.',
        },
        {
          label: '동영상 자르기',
          to: '/tools/video-trimmer',
          description: '먼저 파일을 말하는 부분만 남도록 자르세요.',
        },
        {
          label: '동영상 변환기 튜토리얼',
          to: '/tutorials/video/getting-started',
          description: '전사하기 전에 동영상을 준비하고 변환하세요.',
        },
      ],
      embed: {
        title: '동영상 전사하기',
        description: '동영상을 업로드하세요. AI 전사 모델이 저희 로컬 GPU 서버에서 실행되며 VTT 자막, 일반 텍스트 또는 JSON으로 내보내요. 자막에는 VTT, 기사에는 일반 텍스트, 후속 도구에는 JSON을 쓰세요.',
      },
    },
    'transcode-to-hls': {
      name: '동영상을 HLS로 트랜스코딩',
      h1: '동영상을 HLS로 온라인 트랜스코딩하기',
      tagline: '모든 동영상을 Apple HLS VOD 번들로 패키징하세요. master.m3u8과 화질별 .ts 세그먼트로, 바로 웹에서 쓸 수 있습니다.',
      metaTitle: '동영상을 HLS로 온라인 트랜스코딩 | 무료 적응형 스트리밍 도구 | Media Manipulator',
      metaDescription: '무료 온라인 HLS 트랜스코더입니다. MP4, MOV, WebM, MKV를 360p/480p/720p 화질과 선택형 자막, 스토리보드를 갖춘 HLS VOD 패키지로 변환하세요.',
      ogTitle: '동영상을 HLS로 온라인 트랜스코딩하기',
      ogDescription: '어떤 동영상이든 브라우저에서 무료로 적응형 HLS 패키지(master.m3u8 + 변형 재생목록 + .ts 세그먼트)를 만드세요.',
      intro: 'HTTP Live Streaming은 동영상을 여러 화질 수준의 짧은 세그먼트로 된 재생목록으로 제공하므로, 플레이어가 빠르게 재생을 시작하고 연결 상태가 바뀔 때 화질 단계를 전환할 수 있어요. 이런 패키지를 직접 만들려면 각 렌디션을 키프레임을 맞춰 인코딩하고, 세그먼트로 나누고, 모든 변형을 정확히 설명하는 마스터 재생목록을 작성해야 해요. 이 페이지가 그 작업을 전부 해 줘요. 업로드한 파일을 검사하고, 원본과 요금제가 허용하는 화질 단계를 제시하고, 각 단계를 libx264와 AAC로 2초 길이의 MPEG-TS 세그먼트로 인코딩하고, 선택하면 저희 자체 Whisper 전사기로 만든 자막, 스토리보드 스프라이트 시트, 탐색용 I-프레임 재생목록을 추가한 뒤, 어떤 정적 호스트에든 풀어 올릴 수 있는 tar.gz 또는 zip으로 모두 묶어 드려요.',
      whatItDoes: [
        'ffprobe로 원본을 검사하고 화질 단계를 나열해요: 144p, 240p, 360p, 480p, 720p, 1080p, 2160p이며, 각각 원본 높이가 충분하고 요금제가 허용할 때만 활성화돼요.',
        '선택한 각 단계를 libx264 High 프로필 레벨 4.1과 48 kHz AAC 스테레오로 인코딩하고, 모든 세그먼트 경계에 키프레임이 있는 2초 길이의 .ts 세그먼트로 만들어요.',
        '모든 변형의 BANDWIDTH, RESOLUTION, FRAME-RATE, CODECS가 담긴 hls/master.m3u8과 단계별 index.m3u8을 하나씩 작성해요.',
        '선택하면 Whisper로 오디오를 WebVTT 트랙으로 전사하고, 로컬 모델로 최대 3개 언어로 추가 번역해, 각각을 마스터의 자막 렌디션으로 연결해요.',
        '선택하면 스크러버 썸네일용 WebVTT 인덱스가 있는 스토리보드 스프라이트 시트를 렌더링하고, 240p I-프레임 전용 재생목록은 항상 추가를 시도해요.',
        '폴더를 README.txt, report.json과 함께 tar.gz(또는 zip)로 패키징하고 사전 서명된 다운로드 링크를 드려요.',
      ],
      flowSteps: [
        {
          title: '업로드',
          description: '브라우저가 사전 서명된 PUT으로 저희 스토리지 버킷에 바로 업로드하고, API가 작업을 위해 이를 내려받아요.',
        },
        {
          title: '검사',
          description: 'ffprobe가 너비, 높이, 프레임 레이트, 길이, 오디오 유무를 읽고, 원본보다 높은 단계는 회색으로 비활성화돼요.',
        },
        {
          title: '단계와 추가 항목 선택',
          description: '360p, 480p, 720p가 미리 선택되어 있어요. 자막, 추가 자막 언어, 스토리보드, tar.gz 또는 zip을 체크하세요.',
        },
        {
          title: '단계별 인코딩',
          description: '단계별 CRF와 비트레이트, 2초 GOP의 libx264, 단계별 오디오 비트레이트의 AAC, HLS VOD 출력.',
        },
        {
          title: '추가 항목 생성과 마스터 작성',
          description: '자막, 스토리보드, I-프레임 재생목록이 생성되고, master.m3u8이 이들을 참조하도록 다시 작성돼요.',
        },
        {
          title: '패키지 다운로드',
          description: '기본적으로 30분 동안 유효한 사전 서명 링크이며, 유효한 동안 작업 페이지에서 받을 수 있어요.',
        },
      ],
      advancedDetails: [
        '화질 단계 구성(transcode_profiles.go)은 다음과 같아요: 144p 동영상 200 kbps와 오디오 64 kbps, CRF 26; 240p 400/64, CRF 25; 360p 800/96, CRF 23; 480p 1200/128, CRF 23; 720p 2800/128, CRF 22; 1080p 5000/192, CRF 22; 2160p 12000/256, CRF 21. slow를 쓰는 2160p를 제외한 모든 단계는 veryfast 프리셋을 사용해요.',
        '각 단계는 ffmpeg -i input -map 0:v:0 -vf scale=-2:H -r FPS -c:v libx264 -profile:v high -level 4.1 -preset P -crf N -sc_threshold 0 -g GOP -keyint_min GOP -b:v B -maxrate 1.2B -bufsize 2B -force_key_frames expr:gte(t,n_forced*2) -map 0:a:0? -c:a aac -b:a A -ac 2 -ar 48000 -hls_time 2 -hls_playlist_type vod -hls_flags independent_segments로 인코딩돼요. GOP는 프레임 레이트의 2배이므로 모든 단계에서 세그먼트가 키프레임으로 시작해요.',
        '인코딩이 CRF 기반이고 -maxrate가 상한이므로, 각 단계의 평균은 많아야 표시된 비트레이트 정도이고(상한은 그 1.2배) 쉬운 콘텐츠에서는 더 낮게 나와요. 마스터 재생목록은 BANDWIDTH를 표시된 동영상 비트레이트와 오디오 비트레이트의 합으로, CODECS를 avc1.640028(오디오가 있으면 mp4a.40.2를 덧붙여)로 알려요.',
        '기본적으로 비회원은 360p부터 720p까지, 무료 계정은 360p부터 1080p까지, Premium이나 Pro는 144p부터 2160p까지 전체 단계를 고를 수 있어요. 360p보다 낮은 원본은 Premium 미만에서는 거부돼요. 서버는 시작할 때 단계를 다시 검증하므로, 클라이언트가 제시받지 않은 단계를 요청할 수 없어요.',
        '자막은 전사기와 같은 Whisper 모델(whisper-ctranslate2, medium)을 사용해요. 기본 트랙은 세그먼트 하나짜리 subs.m3u8 래퍼와 함께 captions/<lang>/auto.vtt에 기록되고, 마스터에서 EXT-X-MEDIA TYPE=SUBTITLES로 참조돼요. 37개 언어 목록 중 최대 3개 추가 언어는 로컬 Ollama 모델(translategemma 12b 빌드)이 세그먼트별로 번역해요. 번역 실패는 경고로 기록될 뿐 작업 실패가 되지 않아요.',
        '스토리보드는 ffmpeg 한 번의 패스예요: 길이에 따라(10분 미만, 30분 미만, 그 이상) N을 5, 10 또는 15초로 하는 fps=1/N, 16:9로 패딩한 160 x 90 타일을 JPEG 스프라이트마다 10 x 10 격자로 배치하고, #xywh 큐가 있는 storyboard.vtt를 함께 만들어요. I-프레임 재생목록은 키프레임만 240p로 다시 인코딩하며(select=eq(pict_type,I), libx264 CRF 30, 4초 세그먼트) EXT-X-I-FRAME-STREAM-INF로 등록돼요.',
        '마스터에는 EXT-X-VERSION:6, EXT-X-INDEPENDENT-SEGMENTS, 그리고 제작자, 사이트, 저작권자를 밝히는 EXT-X-SESSION-DATA 항목 세 개가 들어가요. report.json에는 검사 결과, 세그먼트 수와 바이트 크기가 담긴 변형 정보, 경고, 타임스탬프가 기록돼요.',
      ],
      whyItMatters: [
        'HLS는 iOS, Safari, 모든 CDN의 기본 스트리밍 형식이며, hls.js를 쓰면 다른 모든 브라우저에서도 재생돼요.',
        '적응형 화질 단계 덕분에 연결이 약한 시청자는 1080p에서 버퍼링하는 대신 360p로 계속 볼 수 있어요.',
        '미리 세그먼트로 나눈 VOD 패키지는 정적 파일이므로, 뒤에 트랜스코딩 서버 없이 객체 스토리지에서 호스팅할 수 있어요.',
      ],
      useCases: [
        {
          title: '강의 플랫폼',
          description: '적응형 비트레이트와 여러 언어 자막으로 버킷에서 강의를 제공하세요.',
        },
        {
          title: '제품과 마케팅 페이지',
          description: '외부 동영상 호스트와 그 플레이어 브랜딩 없이 데모를 스트리밍하세요.',
        },
        {
          title: '사내 포털',
          description: '스크러버 썸네일과 함께 자체 CDN에서 교육 동영상을 호스팅하세요.',
        },
        {
          title: '아카이브',
          description: '기존 동영상 목록을 직접 관리하고 미러링할 수 있는 스트리밍 가능한 구조로 변환하세요.',
        },
      ],
      workedExamples: [
        {
          title: '기본 화질 단계 세 개로 처리한 3분짜리 1080p 클립',
          body: '입력: 스테레오 오디오가 있는 3분, 1920 x 1080, 30 fps, 140 MB의 MP4로 비회원 한도 이내예요. 설정: 360p, 480p, 720p(기본 선택이자 비회원이 고를 수 있는 최대), 자막과 스토리보드 없음, tar.gz. 각 단계는 2초 세그먼트로 단계당 90개로 나뉘고, GOP는 60프레임이라 모든 세그먼트가 키프레임으로 시작해요. 표시된 비트레이트 기준으로 각 단계의 크기는 많아야 360p 약 20 MB(800 + 96 kbps x 180 s), 480p 약 30 MB(1200 + 128 kbps), 720p 약 66 MB(2800 + 128 kbps)로, 작은 240p I-프레임 재생목록을 빼고 합쳐서 약 116 MB예요. 인코딩이 CRF 기반이고 비트레이트는 상한이므로 쉬운 콘텐츠에서는 더 작아요. 결과 패키지에는 .ts 세그먼트 270개, index.m3u8 파일 세 개, 마스터가 들어 있어요. 시간은 각각 5400프레임을 처리하는 libx264 veryfast 인코딩 세 번이 차례로 실행되는 만큼 걸리며, 720p 단계가 가장 오래 걸려요.',
        },
        {
          title: '영어 자막, 스페인어 번역, 스토리보드가 있는 12분짜리 720p 웨비나',
          body: '입력: 12분, 1280 x 720, 25 fps, 380 MB의 MP4로, 비회원 기본값인 5분을 넘기 때문에 무료 계정으로 업로드했어요. 설정: 360p와 720p(원본이 720p라서 1080p는 회색으로 비활성화), 자막 켜짐과 추가 언어로 스페인어, 스토리보드 켜짐, zip. Whisper가 먼저 12분을 전사해 captions/en/auto.vtt를 작성하고, 스페인어 트랙은 세그먼트 30개씩 묶어 번역해 captions/es/auto.vtt로 만들며, 둘 다 마스터에 자막 렌디션으로 등록돼요. 스토리보드는 10분이 넘는 원본이므로 10초 간격을 사용해요: 160 x 90 썸네일 72개가 1600 x 900 크기의 sprite_001.jpg 하나에 들어가고, storyboard.vtt가 각 타일을 가리켜요. 두 단계는 각각 2초 세그먼트 360개이고 25 fps에서 GOP는 50프레임이며, 표시된 비트레이트 기준으로 많아야 약 81 MB(360p)와 264 MB(720p)예요. 작업 시간은 대부분 Whisper와 두 번의 인코딩에 쓰이고, 번역은 짧은 추가 단계예요.',
        },
      ],
      whenNotToUse: '보내거나 임베드할 더 작은 단일 파일만 필요하다면 HLS로 트랜스코딩하지 마세요. 압축기가 세그먼트나 재생목록 없이 한 번에 해 줘요. 출력은 완성된 VOD 재생목록이지 라이브 오리진이 아니므로 라이브 이벤트에도 쓰지 마세요. 원본이 360p 미만이라면 Premium 없이는 화질 단계를 구성할 수 없어요. 그리고 플레이어가 HLS를 지원하지 않는 일반 video 태그라면 먼저 MP4나 hls.js 같은 플레이어가 필요해요. master.m3u8만으로는 Safari와 Apple 기기에서만 기본 재생돼요.',
      whyMediaManipulator: [
        '모든 단계의 비트레이트, CRF, 프리셋, FFmpeg 플래그가 이 페이지에 나와 있어 패키지 내용에 놀랄 일이 없어요.',
        '자막은 저희 자체 Whisper 전사기로, 번역은 저희 하드웨어의 모델로 만들어지며, 둘 다 마스터 재생목록에 올바르게 참조돼요.',
        '패키지는 README와 report.json이 들어 있는 평범한 파일들이에요. 어떤 정적 호스트에든 풀어 올리고 플레이어가 master.m3u8을 가리키게 하세요.',
        '트랜스코딩 한 번은 일일 일반 작업 횟수에서 한 번을 쓰며(기본적으로 비회원은 하루 5회, 무료 계정은 30회), 세션당 시간당 10회 시작으로 제한돼요. 실패한 작업은 횟수가 환불돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ],
      privacyNote: '업로드한 파일은 브라우저에서 저희 스토리지 버킷으로 바로 전송된 뒤 저희 자체 서버로 내려받아져, 그곳에서 ffprobe, FFmpeg, 그리고 자막을 체크했다면 저희 Whisper 전사기와 로컬 Ollama 번역 모델이 실행돼요. 외부 트랜스코딩이나 AI 서비스는 관여하지 않아요. 원본 객체, 작업 디렉터리, 완성된 패키지는 모두 보관 대장에 등록되어 기간이 끝나면 삭제되며, 다운로드 링크 자체는 기본적으로 30분 후 만료돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 트랜스코딩에는 표준 변환이 거치는 자동 콘텐츠 분석이 실행되지 않아요. 생성된 마스터 재생목록에는 Media Manipulator를 제작자로 밝히는 세션 데이터 줄이 들어 있지만, 여러분에 대한 정보는 담겨 있지 않아요.',
      faq: [
        {
          question: '제 요금제에서는 어떤 화질 단계를 고를 수 있나요?',
          answer: '기본적으로 비회원은 360p, 480p, 720p를 쓸 수 있고, 무료 계정은 1080p가 추가되며, Premium과 Pro는 144p, 240p, 2160p까지 열려요. 업스케일은 하지 않으므로 원본보다 높은 단계는 항상 비활성화돼요. 칩에 마우스를 올리면 이유가 표시돼요.',
        },
        {
          question: '세그먼트 길이는 얼마이며, 왜 2초인가요?',
          answer: '모든 단계는 경계마다 강제 키프레임이 있는 2초 길이의 MPEG-TS 세그먼트로 나뉘므로, 플레이어가 어느 세그먼트에서든 화면 깨짐 없이 단계를 전환할 수 있어요. I-프레임 재생목록은 키프레임만 담기 때문에 4초 세그먼트를 사용해요.',
        },
        {
          question: '자막이 마스터 재생목록에 연결되나요?',
          answer: '네. 각 언어는 subs.m3u8 래퍼와 함께 captions/<lang>/auto.vtt로 기록되고, master.m3u8의 subs 그룹에 EXT-X-MEDIA TYPE=SUBTITLES로 선언되며, 원본 언어에는 DEFAULT가 표시돼요. 37개 언어 목록에서 번역 언어를 최대 3개까지 추가할 수 있어요.',
        },
        {
          question: '동영상에 오디오가 없으면 어떻게 되나요?',
          answer: '각 단계는 -an으로 동영상만 인코딩되고, CODECS 속성에서 mp4a.40.2가 빠지며, 전사할 내용이 없으므로 자막 단계는 report.json에 경고를 남기고 건너뛰어요.',
        },
        {
          question: '패키지에는 무엇이 들어 있고, 어떻게 호스팅하나요?',
          answer: 'hls/master.m3u8, index.m3u8과 세그먼트가 담긴 단계별 폴더, hls/iframes/, 선택 사항인 captions/와 storyboards/, README.txt, report.json이 들어 있어요. .m3u8과 .ts를 올바른 MIME 형식으로 제공하는 정적 호스트나 버킷에 풀어 올리고, 플레이어가 master.m3u8을 가리키게 하세요.',
        },
        {
          question: '다운로드 링크는 얼마나 유효하며, tar.gz나 zip으로 받을 수 있나요?',
          answer: '사전 서명 링크는 기본적으로 30분 동안 유효해요. 만료됐다면 작업을 다시 실행하세요. 시작하기 전에 양식에서 tar.gz(기본값) 또는 zip을 고르세요.',
        },
        {
          question: 'HLS 트랜스코딩은 얼마나 걸리나요?',
          answer: '선택한 각 단계는 veryfast 프리셋으로 하는 전체 libx264 인코딩이며 차례로 실행되므로, 시간은 길이와 단계 수의 곱에 비례해요. 기본 세 단계 중에서는 720p가 가장 오래 걸려요. 자막을 켜면 오디오 전체에 대한 Whisper 패스가 추가돼요. 작업 페이지에서 각 단계가 완료될 때마다 보여 줘요.',
        },
      ],
      related: [
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '스트리밍 패키지 대신 더 작은 MP4 하나.',
        },
        {
          label: '동영상 텍스트 변환',
          to: '/tools/transcribe-video',
          description: '같은 Whisper 자막을 독립된 VTT 또는 SRT로 받으세요.',
        },
        {
          label: '동영상 자르기',
          to: '/tools/video-trimmer',
          description: '트랜스코딩하기 전에 불필요한 시작과 끝을 잘라내세요.',
        },
        {
          label: 'AI 동영상 복원',
          to: '/tools/ai-video-restoration',
          description: '화질 단계를 구성하기 전에 저해상도 클립을 업스케일하세요.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '동영상을 편집하고 자막을 넣은 다음 내보낸 파일을 트랜스코딩하세요.',
        },
      ],
      embed: {
        title: '동영상을 HLS로 트랜스코딩',
        description: 'MP4/MOV/WebM/MKV를 업로드하세요. 원본을 ffprobe로 분석하고, 무료 화질 단계(360p/480p/720p)를 고르게 한 다음, H.264 + AAC ffmpeg 인코딩을 실행해 HLS 패키지를 내려받을 수 있는 tar.gz로 묶어 드려요.',
      },
    },
    'ai-video-restoration': {
      name: 'AI 동영상 복원',
      h1: 'AI 동영상 복원 도구',
      tagline: '최대 여섯 개의 AI 모델(Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT, VRT)로 짧은 동영상 구간을 업스케일하고 복원한 뒤, 모든 결과를 나란히 비교해 보세요.',
      metaTitle: 'AI 동영상 복원 도구: 업스케일링 모델 6종 온라인 비교 | Media Manipulator',
      metaDescription: '무료 AI 동영상 복원 도구입니다. 짧은 클립을 자체 GPU에서 Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT, VRT 초해상도 모델로 처리하고 모든 결과를 하나의 패키지로 내려받으세요.',
      ogTitle: 'AI 동영상 복원: Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT, VRT 비교',
      ogDescription: '동영상에서 구간을 고르고 복원 모델을 선택한 다음, 개선된 모든 버전과 A/B 비교용 원본을 담은 패키지 하나를 다운로드하세요.',
      intro: '동영상 복원 모델들은 서로 다른 결과를 내요. Real-ESRGAN 같은 GAN 업스케일러는 프레임 하나하나는 선명하지만 움직일 때 반짝거릴 수 있고, VRT 같은 동영상 트랜스포머는 시퀀스를 안정적으로 유지하지만 디테일이 부드러워질 수 있어요. 정직하게 고르는 유일한 방법은 같은 영상을 모든 모델에 돌려 보고 직접 보는 거예요. 이 페이지가 바로 그 일을 최대 15초 길이의 구간에서 해요. 프레임을 추출하고, 선택한 모델을 여섯 개 중에서 골라 저희 자체 GPU에서 실행하고, 각 결과를 원본 프레임 레이트와 원래 오디오로 MP4에 다시 합친 다음, 손대지 않은 원본 구간까지 포함해 모든 결과를 나란히 비교할 수 있도록 하나의 아카이브로 묶어요. 아래의 모든 수치는 현재 실제로 돌아가는 파이프라인에서 나온 것이에요.',
      whatItDoes: [
        '선택한 구간(0.5초에서 15초, 동영상의 프레임 레이트 기준 최대 450프레임)을 오디오와 함께 프레임 단위로 정확하게 잘라내요.',
        'Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT, VRT를 원하는 조합으로 실행해요. 앞의 세 모델은 프레임마다 개선하고, 뒤의 세 모델은 시퀀스 전체를 한꺼번에 복원해요.',
        '540p 이하 원본에는 4x를, 그보다 크면 2x를 골라요. 모든 모델은 기본 4x 네트워크로 실행되고, 2x 결과는 합칠 때 Lanczos로 축소한 것이기 때문이에요.',
        '각 결과를 정확한 원본 프레임 레이트 분수에 맞춰 libx264, CRF 16으로 합치고 오디오를 다시 붙여요.',
        'original/clip.mp4, 모델별 폴더 하나씩, 프레임 단위 모델의 개선된 PNG 프레임(선택 사항), manifest.json, README.txt를 하나의 tar.gz로 묶어요.',
        '모델이 실패해도 계속 진행해요. 해당 폴더에는 FAILED.txt가 생기고, manifest에 이유가 기록되며, 나머지 결과는 모두 그대로 전달돼요.',
      ],
      flowSteps: [
        {
          title: '동영상 업로드',
          description: '최대 1920 x 1080까지 가능해요. 선택한 구간만 처리하므로 원본이 길어도 괜찮아요.',
        },
        {
          title: '구간 선택',
          description: '핸들을 끌어 최대 15초까지 고르세요. 10초 이하를 권장하며, 그보다 길면 선택기가 경고해요.',
        },
        {
          title: '모델과 프레임 포함 여부 선택',
          description: '여섯 개 중 원하는 것을 고르세요. 선택기는 서버가 공개한 프레임당 초 수치로 계산한 모델별 예상 시간을 보여 줘요.',
        },
        {
          title: '단계 지켜보기',
          description: '다운로드, 분석, 클립 추출, 프레임 추출, 그다음 가장 빠른 모델부터 가장 느린 모델까지 차례로, 마지막으로 패키징이에요.',
        },
        {
          title: '비교 및 다운로드',
          description: '뷰어에서 모델별 MP4를 원본과 나란히 재생한 다음, 6시간 동안 유효한 링크로 아카이브를 받으세요.',
        },
      ],
      advancedDetails: [
        '기준 클립은 ffmpeg -ss START -i source -t WINDOW -c:v libx264 -crf 10 -preset medium -pix_fmt yuv420p -c:a aac로 잘라내고, 이어서 -vsync 0으로 번호가 매겨진 PNG로 프레임을 추출해요. 프레임 수가 450을 넘으면 초과분은 버려져요.',
        'Real-ESRGAN은 realesrgan-x4plus 모델, 배율 4, 256 px 타일로 realesrgan-ncnn-vulkan을 실행해요. SwinIR은 003_realSR_BSRGAN SwinIR-L x4 GAN 가중치를, HAT은 Real_HAT_GAN_SRx4를 사용하며, 둘 다 타일 추론(320 px 타일, 32 px 겹침)으로 실행되어 1080p 프레임도 메모리에 들어가요.',
        'BasicVSR++는 REDS4 c64n7 생성기를 mmagic으로 16프레임 단위 창에서 실행해요. RVRT(001_RVRT_videosr_bi_REDS_30frames)와 VRT(001_VRT_videosr_bi_REDS_6frames)는 KAIR 테스트 스크립트로 각각 30프레임과 12프레임의 시간 타일, 128 x 128 공간 타일을 사용해 실행돼요.',
        '합치기 방식은 모두 같아요: ffmpeg -framerate FPS_FRACTION -i frames/%06d.png [-i clip.mp4 -map 0:v -map 1:a -c:a aac] [-vf scale=iw/2:ih/2:flags=lanczos] -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -movflags +faststart -shortest. 프레임 레이트 분수(예: 30000/1001)는 ffprobe에서 그대로 가져오므로 오디오 싱크가 유지돼요.',
        '모델은 Real-ESRGAN, BasicVSR++, SwinIR, RVRT, HAT, VRT의 고정된 순서로 GPU 스케줄러 임대 아래에서 실행되며, VRAM 예산은 각각 3, 11, 9, 12, 10, 14 GB예요. 서버 전체에서 복원 작업은 한 번에 하나만 실행되고, 모델마다 75분의 시간 제한이 있어요.',
        '선택기가 프레임 수에 곱하는 공개된 프레임당 예상 시간은 0.8 s(Real-ESRGAN), 1.0 s(BasicVSR++), 3.0 s(RVRT), 3.5 s(SwinIR), 5.0 s(HAT), 7.0 s(VRT)예요. 이는 바뀔 수 있는 서버 측 기본값이며 내 클립을 측정한 값이 아니에요.',
        '1080p보다 높은 원본에서는 출력이 4K를 넘기 때문에 4x를 직접 지정하면 거부돼요. 자동 모드는 541p에서 1080p까지는 2x를, 540p 이하는 4x를 골라요. 포함되는 프레임은 2x 경로에서도 기본 4x PNG이므로, 1080p 원본이면 7680 x 4320 프레임이 나와요.',
      ],
      whyItMatters: [
        '모든 영상에서 이기는 복원 모델은 없고, 정지 프레임 비교로는 재생할 때만 드러나는 깜빡임을 알 수 없어요.',
        '10초 구간을 모든 모델에 돌리는 데는 GPU 시간이 몇 분 들지만, 어떤 모델로 다른 곳에서 전체 길이를 처리할 가치가 있는지 알려 줘요.',
        '디지털로 변환한 테이프, 초기 디지털카메라 클립, 압축된 소셜 미디어 내보내기는 저마다 다르게 열화되고, 서로 다른 모델 계열에 반응해요.',
      ],
      useCases: [
        {
          title: '오래된 가족 동영상',
          description: '전체 릴을 복원하기 전에 480p 테이프 변환본에서 어떤 모델이 얼굴과 옷감을 잘 되살리는지 확인하세요.',
        },
        {
          title: '아카이브 영상',
          description: '360p와 480p 자료에서 4x를 시험하고, 4K급 출력을 내 모니터에서 직접 판단하세요.',
        },
        {
          title: '긴 렌더링 전 모델 선택',
          description: '대표성 있는 10초 테스트로 몇 시간짜리 작업에 쓸 모델을 고르세요.',
        },
        {
          title: '압축된 다운로드 영상',
          description: '블록이 깨진 소셜 미디어 내보내기에서 GAN의 선명화와 트랜스포머의 안정성을 비교하세요.',
        },
        {
          title: '시간적 안정성 확인',
          description: '모델별 MP4를 나란히 재생해 정지 프레임으로는 보이지 않는 반짝임과 깜빡임을 찾아내세요.',
        },
      ],
      workedExamples: [
        {
          title: '8초 길이의 640 x 480 홈 비디오를 여섯 모델 모두로 처리',
          body: '입력: 디지털로 변환한 테이프에서 나온 29.97 fps의 640 x 480 MP4, 오디오 포함. 설정: 8초 구간, 여섯 모델 모두, 개선된 프레임 포함, 배율 자동. 파이프라인은 8초 길이의 기준 클립을 자르고 240프레임(8 x 29.97, 반올림)을 추출해요. 480p이므로 자동 규칙이 4x를 고르고, 모든 모델이 2560 x 1920 프레임을 만들며, 합쳐진 MP4는 원래 오디오와 함께 30000/1001 fps의 2560 x 1920이 돼요. 선택기의 예상 시간은 프레임 수에 공개된 프레임당 초를 곱한 값이에요. Real-ESRGAN 약 3.2분, BasicVSR++ 4분, RVRT 12분, SwinIR 14분, HAT 20분, VRT 28분이고, 모델이 차례로 실행되므로 합계 약 81분이에요. 프레임을 포함하면 2560 x 1920 PNG 3 x 240장이 아카이브에 추가되기 때문에, 다운로드 크기가 메가바이트가 아니라 기가바이트 단위가 돼요.',
        },
        {
          title: '10초 길이의 1080p 클립을 자동 배율로 Real-ESRGAN과 BasicVSR++로 처리',
          body: '입력: 이 도구가 받는 가장 큰 원본 해상도인 1920 x 1080, 30 fps, 90 MB MP4. 설정: 10초 구간, Real-ESRGAN과 BasicVSR++, 프레임 제외, 배율 자동. 추출 결과는 300프레임으로 450 상한 안에 들어요(60 fps라면 같은 상한 때문에 구간이 7.5초로 제한돼요). 540p를 넘으므로 자동 모드는 2x를 고르지만, 각 모델은 여전히 기본 4x 네트워크로 실행되어 7680 x 4320 프레임을 만들고, 합치기 단계에서 scale=iw/2:ih/2:flags=lanczos를 적용해 CRF 16의 3840 x 2160 MP4를 만들어요. 공개된 예상치로는 Real-ESRGAN이 약 4분(0.8 s x 300), BasicVSR++가 약 5분(1.0 s x 300)이므로, 작업은 모델당 75분 시간 제한보다 훨씬 빨리 끝나고, 아카이브에는 4K MP4 두 개, 원본 클립, manifest.json, README.txt가 들어 있어요.',
        },
      ],
      whenNotToUse: '영화 한 편 전체를 복원하는 데는 이 페이지를 쓰지 마세요. 15초와 450프레임으로 제한된 비교 도구이고, 그 정도 분량도 아카이브가 기가바이트 단위가 될 수 있어요. 애초에 기록되지 않은 것을 만들어 낼 거라고 기대하지도 마세요. 심한 모션 블러, 극단적인 압축 블록, 아주 어두운 영상은 나아지긴 하지만 깨끗해지지는 않아요. 1920 x 1080을 넘는 원본은 거부돼요. 복원은 저해상도 자료를 대상으로 하고, 1080p의 2x는 이미 4K이기 때문이에요. 클립에 필요한 것이 더 작은 파일, 형식 변경, 자르기뿐이라면 압축기, 변환기, 자르기 도구가 GPU 없이 몇 초 만에 해결해 줘요.',
      whyMediaManipulator: [
        '업로드 한 번으로 연구 수준의 모델 여섯 개를 쓸 수 있고, 가중치, 타일 크기, 합치기 명령이 브랜드 이름 뒤에 숨겨지지 않고 이 페이지에 그대로 나와 있어요.',
        '모든 처리가 저희 자체 GPU에서 실행돼요. 영상은 외부 AI 제공업체로 가지 않으며, 학습에도 사용되지 않아요.',
        '복원을 한 번 실행하면 일일 AI 작업 횟수에서 AI 작업 한 번이 차감돼요. 기본값은 계정 없이 하루 3회, 무료 계정으로 10회이고, 세션마다 한 시간에 2회까지만 시작할 수 있어요. 실패한 작업은 환불돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      ],
      privacyNote: '업로드한 파일은 브라우저에서 저희 스토리지 버킷으로 가고, 저희 자체 GPU 서버로 내려받아져요. 그곳에서 FFmpeg가 구간을 자르고 여섯 개 모델이 로컬 프로세스로 실행돼요. 외부 AI 제공업체는 관여하지 않으며 학습에도 사용되지 않아요. 선택한 구간만 프레임으로 디코딩되고, 원본의 나머지 부분은 전혀 처리되지 않아요. 원본 객체, 작업용 프레임, 비교 뷰어용으로 보관하는 모델별 MP4, 결과 아카이브는 모두 보관 기록에 등록되어 보관 기간이 끝나면 삭제되며, 아카이브 링크는 6시간 후 만료돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 복원 작업에는 일반 변환에 적용되는 자동 콘텐츠 분석이 실행되지 않아요.',
      faq: [
        {
          question: '어떤 AI 동영상 업스케일링 모델이 가장 좋나요?',
          answer: '영상에 따라 달라요. 그래서 이 도구가 있는 거예요. Real-ESRGAN과 HAT 같은 GAN 업스케일러는 선명한 프레임을 만들지만 움직일 때 반짝거릴 수 있고, BasicVSR++, RVRT, VRT 같은 시퀀스 모델은 인접 프레임을 활용해 안정적이지만 더 부드러워 보일 수 있어요. 내 구간을 직접 돌려 보고 움직이는 상태에서 판단하세요.',
        },
        {
          question: '클립이 15초와 450프레임으로 제한되는 이유는 무엇인가요?',
          answer: '복원은 프레임당 비용이 커요. 공개된 예상치로 VRT만 해도 4x에서 프레임당 7초가 걸려요. 프레임 상한은 실제 프레임 레이트를 기준으로 확인하므로 60 fps 원본은 7.5초로 제한돼요. 다른 곳에서 더 긴 복원을 하기 전에 화질을 판단하는 데는 짧은 구간이면 충분해요.',
        },
        {
          question: '2x와 4x는 어떻게 선택되나요?',
          answer: '자동 모드는 540p 이하 원본에 4x를, 그보다 크면 2x를 골라요. 어떤 경우든 모든 모델은 기본 4x 네트워크로 실행되고, 2x 경로에서는 합치기 단계에서 Lanczos 필터로 프레임을 절반으로 줄여요. 1080p를 넘으면 출력이 4K를 넘기 때문에 4x를 직접 지정하면 거부돼요.',
        },
        {
          question: '복원된 동영상에 오디오와 프레임 레이트가 유지되나요?',
          answer: '네. 구간은 오디오와 함께 잘리고, 모든 합치기 단계에서 ffprobe의 정확한 프레임 레이트 분수(예: 30000/1001)를 사용해 그 오디오를 AAC로 다시 붙이므로, 모든 결과가 A/B 재생에 맞게 정렬돼요.',
        },
        {
          question: '결과 아카이브에는 무엇이 들어 있고, 크기는 얼마나 되나요?',
          answer: 'original/clip.mp4, 모델별 MP4가 든 폴더(프레임을 포함한 경우 Real-ESRGAN, SwinIR, HAT 폴더에는 기본 4x 해상도의 개선된 PNG 전체도 들어 있어요), 처리 시간과 크기가 기록된 manifest.json, README.txt가 들어 있어요. 프레임을 켜면 10초 클립에서도 모델마다 큰 PNG가 수백 장 추가되므로 기가바이트 단위를 예상하세요.',
        },
        {
          question: '모델 하나가 실패하거나 시간 초과되면 어떻게 되나요?',
          answer: '작업은 계속돼요. 해당 모델 폴더에는 이유가 적힌 FAILED.txt가 들어가고, manifest.json에도 기록되며, 선택한 다른 모델의 결과는 모두 아카이브에 그대로 담겨요. 선택한 모델이 모두 실패할 때만 작업이 실패해요.',
        },
        {
          question: '복원 작업은 얼마나 걸리나요?',
          answer: '모델이 차례로 실행되므로, 프레임 수에 모델별 예상치를 곱해 선택한 모델 전체를 더한 값이에요. Real-ESRGAN, BasicVSR++, RVRT, SwinIR, HAT, VRT의 프레임당 시간은 각각 0.8, 1.0, 3.0, 3.5, 5.0, 7.0초예요. 300프레임 클립을 여섯 모델 모두로 처리하면 약 100분, Real-ESRGAN만 쓰면 약 4분이에요.',
        },
        {
          question: '복원은 몇 번 실행할 수 있고, AI 작업을 사용하나요?',
          answer: '복원을 시작하면 AI 작업 한 번을 사용해요. 기본값은 계정 없이 하루 3회, 무료 계정 10회, Premium 100회, Pro 200회이고, 여기에 세션마다 한 시간에 2회까지만 시작할 수 있다는 제한이 더해져요. 완전히 실패한 작업은 환불돼요. 최신 수치는 요금 페이지에서 확인하세요.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '구간은 15초 또는 450프레임 중 동영상의 프레임 레이트 기준으로 더 짧은 쪽으로 제한돼요. 10초 이하를 권장해요.',
          '원본 해상도는 1920×1080까지예요. 복원은 저해상도 영상을 대상으로 하며, 1080p의 4x 출력은 이미 4K를 넘어요.',
        ],
        processingNotes: [
          '모델은 가장 빠른 것부터 가장 느린 것 순서로 실행되므로(Real-ESRGAN이 처음, VRT가 마지막) 일부 결과를 일찍 받을 수 있어요.',
          '모델 하나가 실패해도 작업 전체가 실패하지 않아요. 해당 폴더에 FAILED.txt가 들어가고 다른 결과는 그대로 다운로드할 수 있어요.',
          '다운로드 링크는 6시간 동안 유효해요. 개선된 프레임을 포함하면 아카이브가 커질 수 있어요.',
        ],
      },
      related: [
        {
          label: '동영상 자르기',
          to: '/tools/video-trimmer',
          description: '업로드하기 전에 복원할 구간을 잘라내세요.',
        },
        {
          label: 'AI 이미지 복원',
          to: '/tools/ai-image-restoration',
          description: '같은 모델 계열을 사진 한 장이나 프레임 하나에 적용하세요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '복원된 4K 결과를 공유하기 좋게 줄이세요.',
        },
        {
          label: 'HLS로 트랜스코딩',
          to: '/tools/transcode-to-hls',
          description: '복원된 클립을 적응형 스트리밍용으로 패키징하세요.',
        },
        {
          label: '동영상 전사',
          to: '/tools/transcribe-video',
          description: '복원된 영상에 자막을 추가하세요.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '복원된 구간을 더 긴 작품으로 편집하세요.',
        },
      ],
      embed: {
        title: 'AI 동영상 복원',
        description: '동영상을 업로드하고, 끌어서 짧은 구간을 선택한 뒤(10초 이하가 가장 좋아요), 비교할 복원 모델을 고르고, 개선된 결과를 모두 담은 패키지 하나를 다운로드하세요.',
      },
    },
    'ai-image-restoration': {
      name: 'AI 이미지 복원 및 업스케일링',
      h1: 'AI 이미지 복원 및 업스케일링 도구',
      tagline: '최대 여덟 개의 AI 모델로 사진을 정리하고, 업스케일하고, 복원하세요. 원본 충실도를 지키는 사전 정리(FBCNN, SCUNet, NAFNet), 범용 업스케일러(Real-ESRGAN, SwinIR, HAT), 얼굴 보정(GFPGAN, CodeFormer)을 지원하며, 모든 결과를 원본과 비교할 수 있어요.',
      metaTitle: 'AI 이미지 복원 및 업스케일러: 모델 8종 온라인 비교 | Media Manipulator',
      metaDescription: '무료 AI 사진 복원 및 업스케일링입니다. JPEG 노이즈를 없애고, 잡음과 흐림을 줄인 다음 Real-ESRGAN, SwinIR, HAT로 4K/8K까지 업스케일하고 GFPGAN/CodeFormer로 얼굴을 보정하세요. 모두 자체 GPU에서 처리되며 나란히 비교할 수 있습니다.',
      ogTitle: 'AI 이미지 복원 및 업스케일링: 사전 정리, 업스케일, 얼굴 보정',
      ogDescription: '이미지 한 장을 업로드하고, 필요하면 자르고 사전 정리한 다음, 여러 업스케일링 및 얼굴 모델을 실행해 모든 결과를 원본과 바로 비교하세요.',
      intro: 'AI 이미지 복원은 사진 한 장을 최대 여덟 개 모델로 이루어진 구성 가능한 파이프라인에 통과시키고, 모든 결과를 원본 옆에 보여 줘요. 원본 충실도를 지키는 사전 정리 단계(JPEG 아티팩트에는 FBCNN, 노이즈에는 SCUNet, 모션 블러에는 NAFNet)가 디테일을 지어내지 않고 열화를 걷어 내고, 이어서 범용 업스케일러(Real-ESRGAN, SwinIR, HAT)가 2x 또는 4x로 확대하며, 선택 사항인 얼굴 보정(GFPGAN, CodeFormer)이 얼굴을 재구성해요. 사전 정리는 비생성형이에요. 이미 있는 신호를 걸러 낼 뿐이에요. 얼굴 보정은 생성형이에요. 그럴듯한 디테일을 합성하므로 원본을 충실하게 되살린 것으로 취급해서는 안 돼요. 모든 모델은 저희 자체 GPU 서버에서 실행돼요.',
      whatItDoes: [
        '끌어서 자를 영역을 선택하면 픽셀 예산과 GPU 시간이 관심 있는 영역에 쓰여요. 자르기는 자동 회전된 원본에 서버에서 적용되므로 브라우저에서 화질이 손실되지 않아요.',
        '선택하면 먼저 사전 정리를 실행해요. 순서는 항상 FBCNN, SCUNet, NAFNet이고, 각 모델은 앞 모델의 출력을 받아 작업해요. 정리된 이미지가 이후 모든 모델의 출발점이 돼요.',
        'Real-ESRGAN, SwinIR, HAT을 원하는 조합으로 2x 또는 4x로 실행해요. 세 모델 모두 기본 x4 네트워크이며, 2x 결과는 x4 출력을 Lanczos 필터로 50퍼센트 축소한 것이에요.',
        '선택하면 GFPGAN v1.4와, 서버에서 활성화된 경우 충실도 가중치가 있는 CodeFormer를 원본에 실행하고, 체인을 켜면 각 업스케일러의 결과에도 실행해요.',
        '준비된 원본, 모든 출력 PNG, manifest.json, README를 하나의 .tar.gz로 묶고, 아카이브가 작업에서 제공되는 동안 인라인 비교 그리드를 보여 줘요.',
        '실패한 모델은 사용자에게 안전한 이유와 함께 실패 항목으로 기록하고, 성공한 결과는 모두 그대로 패키징해요.',
      ],
      flowSteps: [
        {
          title: '이미지 업로드',
          description: '각 변이 12,000픽셀 이하인 PNG, JPEG, WebP, TIFF, BMP를 지원해요. 오래되고, 작고, 과하게 압축된 사진이 주 대상이에요.',
        },
        {
          title: '자르기 또는 전체 유지',
          description: '얼굴, 번호판, 표지판 같은 영역을 끌어서 고르거나, 자르기를 끈 채 전체를 복원하세요.',
        },
        {
          title: '사전 정리, 업스케일러, 얼굴, 배율 선택',
          description: '원하는 모델에 체크하세요. 선택기가 허용된 12개 중 선택한 조합으로 몇 개의 출력이 나오는지 보여 줘요.',
        },
        {
          title: '단계 지켜보기',
          description: '작업은 하나뿐인 복원 슬롯을 기다렸다가 이미지를 준비하고, 이어서 각 단위를 자체 진행률과 실패 배지와 함께 실행해요.',
        },
        {
          title: '비교 및 다운로드',
          description: '각 결과가 그리드에서 원본 옆에 놓여요. 어떤 파이프라인이 나은지 정했으면 아카이브를 다운로드하세요.',
        },
      ],
      advancedDetails: [
        '준비 단계에서는 ImageMagick -auto-orient로 정규화된 PNG를 만들고, 크기를 읽은 뒤, 12,000 x 12,000을 넘는 것은 거부하고, 정규화된 자르기 사각형을 정수 픽셀로 변환해 working_source.png를 기록해요. 이 파일은 결과에 original.png로도 저장되므로, 비교 대상은 모델이 받은 것과 정확히 같아요.',
        '자동 배율은 자른 영역의 높이가 540픽셀 이하면 4x, 그 외에는 2x를 골라요. 배율과 관계없이 출력은 67,108,864픽셀(약 64메가픽셀)의 예산과 대조돼요. 6,000 x 4,000 전체 이미지를 2x로 하면 96메가픽셀이므로, 2x 또는 더 작은 자르기 영역을 고르라는 메시지와 함께 거부돼요.',
        'Real-ESRGAN은 realesrgan-x4plus 네트워크를 256픽셀 타일로 realesrgan-ncnn-vulkan을 통해 실행해요. SwinIR은 003_realSR_BSRGAN SwinIR-L x4 GAN 가중치를, HAT은 Real_HAT_GAN_SRx4 가중치를 사용하며, 둘 다 AI 동영상 복원과 같은 프레임 단위 스크립트로 320픽셀 타일과 32픽셀 겹침을 적용해 실행되므로 큰 자르기 영역도 GPU 메모리를 넘지 않아요.',
        '사전 정리 가중치는 fbcnn_color.pth, scunet_color_real_psnr.pth(질감을 지어내는 GAN 변형이 아니라 PSNR로 학습된 실제 노이즈 모델), NAFNet-GoPro-width64.pth(초점 흐림이 아니라 모션 블러 제거)예요. 512픽셀 타일과 32픽셀 겹침으로 실행되며 크기는 절대 바꾸지 않아요. FBCNN은 1에서 100 사이 값을 직접 지정하지 않으면 JPEG 품질 계수를 블라인드로 예측해요. 숫자가 낮을수록 더 심한 압축을 가정해요.',
        'GFPGAN은 배경 업샘플링을 끈 깔끔한 v1.4 아키텍처를 사용하므로, 얼굴 밖의 영역은 모델로 개선되지 않고 배율만큼 단순히 크기만 바뀌어요. 그래야 비교가 정직해져요. CodeFormer는 0에서 1 사이의 충실도 가중치 w(기본 0.7)를 받아요. 낮을수록 더 보기 좋고, 높을수록 입력에 더 가깝게 유지돼요. CodeFormer는 비상업적 라이선스로 배포되며, 기본적으로 꺼져 있는 서버 플래그 뒤에 있어요.',
        '체인은 원본에 더해 모든 업스케일러의 출력에 각 얼굴 모델을 1x로 다시 실행하므로, 출력 수는 사전 정리 + 범용 + 얼굴 + 얼굴 x 범용이에요. 서버는 작업 하나당 출력을 12개로 제한하고, 복원 작업을 한 번에 하나만 실행하며, 각 모델에 1,800초를 준 뒤 시간 초과로 표시해요.',
        '서버는 자체 메가픽셀당 초 기본값으로 모델별 실행 시간을 추정해요: FBCNN 3, SCUNet 8, NAFNet 6, Real-ESRGAN 2, SwinIR 12, HAT 18, GFPGAN 6, CodeFormer 8. 이 값은 진행률 가중치와 UI 예상 시간에 쓰이는 조정값이며 보장이 아니에요.',
        '결과는 객체 스토리지에 업로드되지 않아요. .tar.gz와 결과 PNG는 작업의 출력 폴더에 남아 보관 기간 동안 작업에서 제공돼요.',
      ],
      whyItMatters: [
        '모든 사진에서 이기는 모델은 없어요. 아티팩트 제거, 노이즈 제거, 업스케일링, 얼굴 재구성은 각기 다른 손상을 고치고, 올바른 순서는 이미지가 어떻게 열화되었는지에 달려 있어요.',
        '업로드 한 번으로 여러 모델을 실행하고 나란히 보면, 더 큰 일괄 작업에 들어가기 전에 "어떤 모델을, 어떤 배율로?"라는 질문에 답할 수 있어요.',
        '비생성형과 생성형의 구분은 중요해요. 사전 정리된 이미지는 증거를 걸러 낸 사본이고, 얼굴 보정된 이미지는 그럴듯한 재구성이며, 페이지가 어느 쪽인지 표시해 줘요.',
      ],
      useCases: [
        {
          title: '오래되거나 스캔한 사진 복원',
          description: '스캐너 노이즈와 압축을 먼저 정리한 다음 업스케일하고, 원하면 얼굴을 재구성하세요.',
        },
        {
          title: '저해상도 정지 이미지 개선',
          description: '관심 영역으로 자르고, 아티팩트를 없애고, 업스케일하세요. 얼굴 보정을 체인으로 연결하면 또렷해지지만, 신원 확인 증거로는 절대 쓰지 마세요.',
        },
        {
          title: '압축된 다운로드 이미지 복구',
          description: '여러 번 다시 압축된 소셜 미디어 이미지는 FBCNN, 이어서 SCUNet, 그다음 GAN 업스케일러를 거치면 잘 살아나요.',
        },
        {
          title: '일괄 작업 전 업스케일러 비교',
          description: '대표 이미지 한 장을 Real-ESRGAN, SwinIR, HAT에 돌려 더 큰 세트에 쓸 모델을 고르세요.',
        },
        {
          title: '한 영역에 예산 집중',
          description: '얼굴이나 표지판만 끌어서 선택하면 64메가픽셀 예산과 GPU 시간이 중요한 곳에 쓰여요.',
        },
      ],
      workedExamples: [
        {
          title: '1,200 x 800 JPEG(약 350 KB), 전체 프레임, 자동 배율, FBCNN + Real-ESRGAN + GFPGAN',
          body: '자르기 영역은 0.96메가픽셀 프레임 전체이고 높이 800픽셀이 540보다 크므로, 자동 배율은 2x로 정해져요. FBCNN이 먼저 1x로 실행되고 그 출력이 작업용 원본이 돼요. Real-ESRGAN이 realesrgan-x4plus로 이를 4,800 x 3,200으로 업스케일하고, ImageMagick이 Lanczos로 50퍼센트 축소해 2,400 x 1,600 PNG를 만들어요. GFPGAN은 사전 정리된 원본에 업스케일 2로 실행되어, 얼굴은 재구성되고 나머지는 단순히 크기만 바뀐 또 다른 2,400 x 1,600 PNG를 만들어요. 허용된 12개 중 출력 세 개예요. 서버의 메가픽셀당 예상치로 모델 시간은 약 0.96 x (3 + 2 + 6), 대략 11초이고, 준비와 패키징에 몇 초가 더 들어요. 하나뿐인 복원 슬롯을 기다리느라 더 걸릴 수도 있어요. 작업 하나에 AI 작업 한 번을 사용해요.',
        },
        {
          title: '640 x 480 정지 이미지에서 자른 300 x 400 얼굴 영역, 사전 정리, 업스케일러 세 개, 체인을 켠 GFPGAN',
          body: '자르기 영역은 0.12메가픽셀, 높이 400픽셀이므로 자동 배율은 4x를 고르고, 업스케일된 결과는 모두 1,200 x 1,600(1.92메가픽셀)으로 64메가픽셀 예산에 한참 못 미쳐요. FBCNN과 SCUNet 사전 정리, Real-ESRGAN, SwinIR, HAT, 체인을 켠 GFPGAN으로 작업은 2 + 3 + 1 + 1 x 3 = 9개의 출력을 만들어요. 사전 정리 두 단계, 업스케일 세 개, 정리된 원본에 대한 GFPGAN, 그리고 업스케일된 각 결과에 1x로 실행한 GFPGAN이에요. 0.12메가픽셀에 대한 사전 정리와 업스케일 단계는 서버 예상치로 각각 몇 초면 끝나지만, 체인으로 연결된 얼굴 단계 세 개는 1.92메가픽셀 결과에서 실행되므로 그만큼 더 오래 걸려요. 각 얼굴 출력에는 manifest에 생성형 표시가 붙어요. 그 얼굴에서 보이는 것은 복구가 아니라 재구성이기 때문이에요.',
        },
      ],
      whenNotToUse: '얼굴 보정을 신원 확인에 쓰지 마세요. GFPGAN과 CodeFormer는 학습된 사전 지식으로 그럴듯한 얼굴을 그려 내므로, 재구성된 얼굴은 기껏해야 단서일 뿐 사진 속 인물이 누구인지 증명하지 못해요. 이미 크고 선명한 이미지는 2x 처리가 대부분 GAN 질감만 더하므로 이 도구를 쓰지 마세요. 한 변이 12,000픽셀을 넘는 사진도 거부돼요. 사전 정리, 얼굴 모델, 비교 그리드 없이 깨끗한 이미지를 크게 만들기만 하면 된다면 AI 이미지 업스케일러가 시간이 덜 들어요. 그리고 손상이 모션 블러가 아니라 초점 흐림이라면 NAFNet의 GoPro 가중치는 맞지 않는 모델이에요.',
      whyMediaManipulator: [
        '업로드 한 번으로 연구용 모델 여덟 개를 쓸 수 있고, 노트북, CUDA 설정, 가중치 파일을 관리할 필요가 없어요.',
        '모든 모델은 저희가 운영하는 GPU 서버에서 실행돼요. 이미지는 외부 AI 서비스로 전송되지 않아요.',
        '페이지가 구분을 정직하게 유지해요. 사전 정리 출력에는 충실도 표시가, 얼굴 출력에는 생성형 표시가 붙고, 준비된 원본은 항상 그리드에 있어요.',
      ],
      privacyNote: '이미지는 작업 폴더에 저장되고, ImageMagick이 자동 회전하고 잘라 작업용 PNG로 만든 뒤, 선택한 모델이 저희 자체 GPU에서 처리해요. 작업이 끝나면 업로드 폴더와 작업 트리는 삭제돼요. 작업에 남는 것은 준비된 원본, 각 결과 PNG, manifest, 패키징된 .tar.gz이며, 다운로드와 비교 그리드를 위해 작업에서 제공돼요. 얼굴 모델 출력은 그 manifest에 생성형 재구성으로 표시돼요. 어떤 외부 AI 제공업체도 이미지를 받지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: '사전 정리와 업스케일링 또는 얼굴 모델은 어떻게 다른가요?',
          answer: '사전 정리 모델(FBCNN, SCUNet, NAFNet)은 비생성형이에요. 기존 신호를 1x로 걸러 내 압축 아티팩트, 노이즈, 모션 블러를 없애요. 업스케일러는 해상도를 더하고, 얼굴 모델(GFPGAN, CodeFormer)은 생성형이라 그럴듯한 얼굴 디테일을 합성해요. 사전 정리 출력은 충실하게 걸러 낸 이미지이고, 얼굴 출력은 재구성이에요.',
        },
        {
          question: '보정된 얼굴을 신원 확인 증거로 쓸 수 있나요?',
          answer: '아니요. GFPGAN과 CodeFormer는 학습된 사전 지식으로 그럴듯한 얼굴을 만들 뿐, 실제 얼굴을 되살리지 않아요. 바로 그 이유로 manifest는 모든 얼굴 출력에 생성형 표시를 붙여요. 시각적으로 또렷하게 보거나 단서를 얻는 용도로만 쓰세요.',
        },
        {
          question: '무엇에 체크하든 사전 정리 모델이 정해진 순서로 실행되는 이유는 무엇인가요?',
          answer: '노이즈를 제거하기 전에 압축 아티팩트를 먼저 없애야 해요. 그렇지 않으면 노이즈 제거기가 블록을 신호로 취급해요. 또 흐림 제거는 가장 깨끗한 입력에서 가장 잘 작동하므로, 서버는 항상 FBCNN, SCUNet, NAFNet 순서로 각각 앞의 결과에 실행해요. 그중 하나가 실패하면 다음 모델은 마지막으로 성공한 단계에서 이어 가요.',
        },
        {
          question: '자동 모드는 2x와 4x를 어떻게 정하고, 크기 제한은 얼마인가요?',
          answer: '자동 모드는 자른 영역의 높이가 540픽셀 이하면 4x를, 그 외에는 2x를 골라요. 그다음 출력이 약 64메가픽셀(67,108,864픽셀)의 예산과 대조돼요. 예산을 넘는 요청은 메가픽셀 수와 함께 2x 또는 더 작은 자르기 영역을 고르라는 제안과 함께 거부돼요. 어느 한 변이라도 12,000픽셀을 넘는 원본은 그 전에 거부돼요.',
        },
        {
          question: '체인은 출력 수에 어떤 영향을 주나요?',
          answer: '체인을 켜면 각 얼굴 모델이 모든 업스케일러의 결과에도 1x로 실행되므로, 출력 수 = 사전 정리 + 범용 + 얼굴 + 얼굴 x 범용이에요. 업스케일러 두 개와 얼굴 모델 두 개를 체인으로 연결하면 사전 정리 전 기준으로 2 + 2 + 4 = 8개의 출력이에요. 서버는 작업 하나당 12개까지 허용해요.',
        },
        {
          question: '이미지 모델 하나가 실패하거나 시간 초과되면 어떻게 되나요?',
          answer: '작업은 계속돼요. 해당 단위는 사용자에게 안전한 이유(예: 1,800초 후 시간 초과, 더 작은 자르기 영역이나 2x 권장)와 함께 실패로 표시되고, manifest에 기록되며, 다른 결과는 모두 그대로 패키징되어 표시돼요. 선택한 모든 모델이 실패할 때만 작업이 실패하며, 그때는 AI 작업이 환불돼요.',
        },
        {
          question: 'CodeFormer가 회색으로 비활성화된 이유는 무엇인가요?',
          answer: 'CodeFormer는 비상업적 용도로만 라이선스되어 있어서, 기본적으로 꺼져 있는 서버 플래그 뒤에 있어요. 그래서 기능 정보에 현재 비활성화된 것으로 표시돼요. GFPGAN과 사전 정리 모델 세 개는 관대한 라이선스를 갖고 있어서 가중치가 설치되어 있으면 언제든 사용할 수 있어요.',
        },
        {
          question: '복원은 몇 번 실행할 수 있고, 무료인가요?',
          answer: '복원을 시작하면 AI 작업 한 번을 사용해요. 기본값은 비회원 하루 3회, 무료 계정 10회, Premium 100회, Pro 200회이며, 그 작업에서 모델을 몇 개 체크하든 상관없어요. 별도로 세션마다 한 시간에 6회까지만 시작할 수 있는 전용 제한도 있어요. 업로드 한도는 비회원 200 MB, 무료 계정 1 GB예요. 현재 수치는 /pricing에서 확인하세요.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '출력은 픽셀 예산(약 64메가픽셀)으로 제한되며, 8K를 넉넉히 넘는 크기예요. 자르기 영역과 배율이 이를 넘으면 2x 또는 더 작은 자르기 영역을 고르세요.',
          '사전 정리 모델은 크기를 절대 바꾸지 않아요(1x). 해상도를 바꾸는 것은 범용 업스케일러뿐이에요.',
        ],
        processingNotes: [
          '사전 정리는 항상 정해진 순서로 가장 먼저 실행돼요(FBCNN → SCUNet → NAFNet). 정리된 이미지가 다른 모든 모델의 바탕이 돼요.',
          '모델 하나가 실패해도 작업 전체가 실패하지 않아요. 해당 항목에 이유가 표시되고 다른 결과는 그대로 다운로드할 수 있어요.',
          '얼굴 보정은 생성형 재구성이에요. 또렷하게 보거나 단서를 얻는 데 쓰고, 신원 확인 증거로는 쓰지 마세요.',
        ],
      },
      related: [
        {
          label: 'AI 동영상 복원',
          to: '/tools/ai-video-restoration',
          description: '움직이는 영상용 짝꿍 도구로, 같은 업스케일러를 짧은 클립에 적용해요.',
        },
        {
          label: 'AI 이미지 업스케일러',
          to: '/tools/ai-image-upscaler',
          description: '이미지를 크게 만들기만 하면 될 때 쓰는 Real-ESRGAN 단일 처리.',
        },
        {
          label: '배경 제거',
          to: '/tools/remove-background-from-image',
          description: '복원한 뒤 피사체를 오려 내세요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '복원된 PNG를 공유하기 좋게 줄이세요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '복원된 이미지를 정확한 크기로 조절하세요.',
        },
        {
          label: 'EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '게시하기 전에 결과에서 메타데이터를 지우세요.',
        },
      ],
      embed: {
        title: 'AI 이미지 복원 및 업스케일링',
        description: '이미지를 업로드하고, 필요하면 영역을 자르고, 필요하면 사전 정리를 한 다음, 비교할 업스케일링 및 얼굴 보정 모델을 고르고, 모든 결과를 담은 패키지 하나를 다운로드하세요.',
      },
    },
    'ai-document-scan': {
      name: 'AI 문서 스캔',
      h1: 'AI 문서 스캔: 스캔한 페이지와 손글씨를 검색 가능한 PDF / Word로',
      tagline: '스캔한 문서와 손으로 쓴 메모를 검색 가능한 여러 페이지 PDF와 편집 가능한 Word 문서로 바꾸세요. 인쇄된 페이지에는 Tesseract의 충실한 텍스트 레이어가 입혀지고, 손글씨는 비전 AI가 받아 적으며 불확실한 부분은 표시할 뿐 지어내지 않습니다.',
      metaTitle: 'AI 문서 스캔: 스캔한 페이지와 손글씨를 PDF/Word로 | Media Manipulator',
      metaDescription: '무료 AI 문서 스캔입니다. 스캔한 이미지를 검색 가능한 PDF와 이미지 Word OCR로 변환하고, 손으로 쓴 메모도 텍스트로 옮기세요. 페이지 순서 변경, 인쇄물과 손글씨 혼합도 가능하며, 모두 자체 GPU에서 원문 그대로 처리하고 불확실한 부분은 표시합니다.',
      ogTitle: 'AI 문서 스캔: 스캔과 손글씨로 검색 가능한 PDF + Word 만들기',
      ogDescription: '인쇄물이든 손글씨든 스캔한 페이지를 한 장 이상 업로드하고 순서를 정하면, 검색 가능한 PDF와 편집 가능한 DOCX를 받을 수 있어요. 인쇄된 페이지는 충실하게 유지되고, 손글씨는 [illegible]/[?] 표시를 보존한 채 원문 그대로 전사돼요.',
      intro: 'AI 문서 스캔은 사진으로 찍거나 스캔한 페이지 한 장 이상을 검색 가능한 여러 페이지 PDF로, 원하면 편집 가능한 Word 문서로도 바꿔요. 두 종류의 페이지를 다르게 처리하고, 어느 쪽인지 알려 줘요. 인쇄되거나 타이핑된 페이지는 OCRmyPDF와 Tesseract를 거쳐요. 출력 페이지는 손대지 않은 스캔 그대로이고, 그 아래에 보이지 않는 텍스트 레이어가 깔려 검색, 선택, 복사가 가능해져요. 손글씨 페이지는 저희 자체 GPU에서 실행되는 비전 언어 모델이 읽어요. 이 모델은 글씨를 한 단어도 빠짐없이 그대로 받아 적고, 읽을 수 없는 부분은 [illegible]로 표시하며, 확실하지 않은 단어는 [?: best guess] 형태로 감싸요(가장 가능성 높은 추측을 넣어요). 그리고 무엇이든 완성하거나, 고치거나, 다듬지 말라는 지시를 받아요. 작업 하나에서 두 종류를 페이지별로, 정한 순서대로 섞을 수 있고, 결과에는 모든 페이지의 엔진과 신뢰도가 표시돼요.',
      whatItDoes: [
        '작업당 최대 50장의 페이지 이미지(PNG, JPEG, WebP, TIFF, BMP, HEIC, 기본적으로 각 25 MB)를 받아 각각 똑바로 선 PNG로 정규화하고, 먼저 끌어서 읽는 순서대로 정렬할 수 있게 해 줘요.',
        '자동 모드에서는 비전 모델에 페이지마다 질문 하나(인쇄물인가, 손글씨인가?)를 던져 그에 따라 페이지를 보내요. 인쇄 모드와 손글씨 모드는 답을 고정해요.',
        'PDF/A를 만들어요. 인쇄된 페이지는 모두 원본 스캔에 Tesseract 텍스트 레이어를 더한 것이고, 손글씨 페이지는 모두 스캔에 줄 단위로 배치된 보이지 않는 기계 전사 레이어를 더하고, 그 사실을 알리는 바닥글을 보이게 넣은 것이에요.',
        '선택하면 Word 문서도 만들어요. 인쇄된 페이지는 PaddleOCR-VL(또는 Docling)이 제목, 목록, 표로 재구성하고, 손글씨 페이지는 스캔과 대조하라는 굵은 안내문 아래에 원문 그대로의 전사로 들어가며, Pandoc이 렌더링해요.',
        '페이지마다 사용한 엔진, 높음·보통·낮음의 신뢰도, 불확실성 표시 개수를 알려 주므로 어디를 살펴봐야 할지 알 수 있어요.',
        '서버에서 해당 엔진이 활성화되어 있으면, 표시된 토큰만 다시 읽는 검증 단계, 불일치를 [?: vlm | other]로 표시하는 독립적인 두 번째 의견, 별도로 표시된 AI 요약을 실행할 수 있어요.',
      ],
      flowSteps: [
        {
          title: '페이지 추가',
          description: '파일 하나에 페이지 이미지 하나씩, 인쇄물이든 손글씨든 섞여 있든 끌어다 놓고 순서대로 정렬하세요.',
        },
        {
          title: '모드와 출력 선택',
          description: '자동, 인쇄, 손글씨 중에서 고르세요. PDF는 항상, Word는 선택 사항이에요. 인쇄된 페이지용 Tesseract 언어와, 인쇄물 OCR용 기울기 보정 및 자동 회전도 정하세요.',
        },
        {
          title: '준비 및 읽기',
          description: '페이지는 자동 회전되고, 손글씨는 모델이 읽기 전에 Real-ESRGAN으로 2x 업스케일돼요. 인쇄된 페이지는 PDF 단계에서 Tesseract를 기다려요.',
        },
        {
          title: '파일 만들기',
          description: 'OCRmyPDF와 reportlab이 페이지별 PDF를 만들고 pikepdf가 합쳐요. Word 문서는 Pandoc이 Markdown으로부터 조립해요.',
        },
        {
          title: '검토 및 다운로드',
          description: 'PDF가 뷰어에서 열려요. PDF와, 요청했다면 Word 파일, 그리고 페이지별 엔진과 신뢰도가 기록된 manifest를 다운로드하세요.',
        },
      ],
      advancedDetails: [
        '인쇄된 페이지: 정규화된 PNG를 img2pdf로 무손실 래핑한 다음, OCRmyPDF가 지정한 언어 코드로 Tesseract를 실행하고, 체크한 경우 deskew와 rotate_pages를, 그리고 output_type pdfa와 force_ocr를 적용해 이미지 아래에 텍스트 레이어를 기록해요. 어떤 페이지에서 OCRmyPDF가 실패하면 이미지만 있는 페이지를 유지하므로, PDF는 여전히 완전해요.',
        '손글씨 페이지: 모델은 Ollama가 temperature 0.1로 제공하는 qwen3-vl(8B, instruct, q8_0 양자화)이에요. 원문 그대로 받아 적고, 줄바꿈을 유지하고, [illegible]과 [?: guess]를 표시하고, (arrow)나 (circled) 같은 표시를 기록하고, 전체 텍스트와 줄마다 하나의 경계 상자를 담은 JSON을 반환하도록 지시받아요.',
        '손글씨 PDF 페이지는 reportlab이 이미지의 픽셀 크기로 그려요. 스캔이 눈에 보이는 페이지이고, 전사된 각 줄은 텍스트 렌더링 모드 3(검색은 되지만 그려지지 않음)으로 경계 상자 위치에 배치되며, 글꼴은 줄 높이에 맞춰 6에서 48포인트 사이 크기의 Helvetica예요. 경계 상자가 돌아오지 않으면 페이지 전체에 보이지 않는 블록을 대신 넣고, "Machine transcription, verify against original"(기계 전사이니 원본과 대조하세요)라고 적힌 회색 8포인트 바닥글을 넣어요.',
        '신뢰도는 추측이 아니라 계산한 값이에요. 페이지에 표시가 없으면 높음, 표시가 있는 줄이 15퍼센트 미만이면 보통, 그 외에는 낮음이에요. 검증 단계(기본으로 켜짐)는 페이지와 초안을 모델에 다시 보내 표시된 토큰만 해결하고 다른 것은 아무것도 바꾸지 말라고 지시해요. 검증이 실패하면 초안을 유지해요.',
        '손글씨용 사전 정리는 Vulkan GPU에서 배율 2의 realesrgan-x4plus로 실행되며, 자동과 손글씨 모드에서는 기본으로 켜지고 인쇄 모드에서는 꺼져 있어요. 최선을 다하는 방식이라 실패하면 원본을 유지해요. Word 문서는 Pandoc이 GitHub 방식 Markdown으로 만들어요. 선택 사항인 요약은 별도의 텍스트 모델을 사용하며, AI 생성 표시와 함께 별도 파일로 기록돼요.',
        '서버에서는 기본적으로 문서 작업이 한 번에 하나씩 실행되고, 모델 호출마다 40분의 상한이 있으며, 업로드 파일과 작업 폴더는 작업이 끝나는 즉시 삭제돼요. 보관 기간 동안 남는 것은 결과 폴더(PDF, DOCX, manifest.json, README.txt)뿐이에요.',
      ],
      whyItMatters: [
        '페이지 사진은 검색하고 인용할 수 있어야 비로소 문서가 돼요. PDF는 픽셀에 손대지 않고 그 기능을 더하므로, 스캔이 계속 기준으로 남아요.',
        '자신 있게 추측하는 손글씨 인식은 없느니만 못해요. 명시적인 [illegible]과 [?: guess] 표시, 페이지별 신뢰도, 눈에 보이는 안내 표시 덕분에 전사본을 초안으로 쓸 수 있고, 원본으로 오인할 일도 없어요.',
        '인쇄된 페이지와 손글씨 페이지에는 서로 다른 엔진이 필요해요. 순서가 정해진 작업 하나 안에서 각 페이지를 알맞은 엔진으로 보내기 때문에, 인쇄된 양식과 손으로 쓴 답이 함께 있는 노트도 파일 하나로 나와요.',
      ],
      useCases: [
        {
          title: '검색 가능한 서류',
          description: '스캔한 계약서, 영수증, 양식이 검색하고 복사할 수 있는 PDF/A 하나가 되고, 페이지 이미지는 그대로 유지돼요.',
        },
        {
          title: '현장 및 실험 노트',
          description: '손으로 쓴 메모가 검색 가능한 PDF와 Word 초안이 되고, 확인해야 할 불확실한 단어는 모두 표시돼요.',
        },
        {
          title: '이미지를 Word로',
          description: '휴대폰으로 찍은 인쇄된 페이지가 제목, 목록, 표가 재구성된 편집 가능한 .docx가 돼요.',
        },
        {
          title: '혼합 문서',
          description: '손으로 답을 적은 인쇄 설문지가 두 엔진을 모두 거쳐 순서가 정해진 파일 하나로 돌아와요.',
        },
        {
          title: '아카이브',
          description: '오래된 타자 편지와 회의록에 색인용 텍스트 레이어가 생기고, 스캔은 원래 모습 그대로 남아요.',
        },
      ],
      workedExamples: [
        {
          title: '300 dpi로 스캔한 인쇄된 A4 페이지 세 장',
          body: '2480 x 3508 JPEG 스캔 세 장을 인쇄 모드, PDF만, 언어 eng, 기울기 보정과 자동 회전 켜짐으로 처리해요. 모델은 관여하지 않아요. 각 페이지를 img2pdf로 래핑하고, OCRmyPDF가 Tesseract를 실행해 보이지 않는 텍스트 레이어를 기록하고 PDF/A로 출력하며, pikepdf가 세 장을 document.pdf로 합쳐요. 텍스트 레이어는 페이지당 몇 킬로바이트만 더하므로, PDF는 대략 페이지 이미지 세 장을 합친 크기예요(기울기를 바로잡은 페이지는 다시 렌더링되고, 손대지 않은 페이지는 그대로 포함돼요). 작업은 AI 작업 한 번을 사용하며(실패하면 환불), 시간은 CPU에서 페이지마다 차례로 실행되는 Tesseract에 대기열 대기 시간을 더한 만큼이에요. 기본적으로 문서 작업은 한 번에 하나씩 실행되기 때문이에요.',
        },
        {
          title: '휴대폰으로 찍은 손글씨 페이지 두 장, Word 포함',
          body: '노트 페이지를 찍은 4032 x 3024 휴대폰 사진 두 장을 자동 모드, PDF와 DOCX로 처리해요. 준비 단계에서 두 장을 자동 회전해 PNG로 만들고, 인쇄 모드가 아니므로 realesrgan-x4plus로 2x 업스케일해 8064 x 6048로 키워요. 분류 단계는 qwen3-vl에 페이지마다 질문 하나를 던지고, 인식 단계는 줄마다 경계 상자가 있는 전사를 반환하며, 검증 단계는 표시된 토큰만 다시 읽어요. 어떤 페이지가 30줄이고 그중 2줄에 [?: ...] 표시가 있다면, 2 / 30은 15퍼센트 미만이므로 그 페이지는 illegibleCount 2와 함께 보통 신뢰도로 표시돼요. PDF 페이지는 처리된 이미지에 그 경계 상자 위치의 보이지 않는 Helvetica 줄과 바닥글 표시가 더해진 것이고, Word 파일에는 굵은 검증 안내문 아래 원문 그대로의 텍스트가 들어가요. 시간은 저희 GPU에서 페이지마다 차례로 실행되는 비전 모델 처리 세 번만큼 걸리며, 다른 곳에서 실행되는 것은 없어요.',
        },
      ],
      whenNotToUse: '확인 없이 그대로 믿을 수 있는 텍스트가 필요하다면 이 도구를 쓰지 마세요. 손글씨 출력은 빈틈이 표시된 기계 판독이고, Word 문서와 요약은 재구성이므로, 인용하기 전에 스캔과 대조하세요. PDF를 PDF로 OCR하는 도구도 아니에요. 입력은 페이지 이미지이므로 기존 PDF는 먼저 이미지로 렌더링하세요. 번역기도 아니에요. 텍스트 레이어 없이 페이지를 PDF로 묶기만 하면 된다면, 일반 이미지를 PDF로 도구가 AI 작업 대신 일반 작업으로 처리해 주므로, 하루 세 번인 비회원 AI 작업 횟수를 모델이 필요한 작업에 아껴 둘 수 있어요.',
      whyMediaManipulator: [
        '인쇄물 PDF는 구조적으로 충실해요. OCRmyPDF가 손대지 않은 페이지 이미지 아래에 텍스트를 넣고 PDF/A로 출력하며, 다시 그리는 것은 없어요.',
        '손글씨는 근거와 함께 원문 그대로 옮겨요. 프롬프트가 지어내기를 금지하고, 불확실한 부분은 텍스트에 표시되며, 신뢰도는 그 표시를 세어 계산하고, 페이지에는 기계 전사라는 사실이 적혀 있어요.',
        '모든 엔진은 저희 것이에요. CPU의 Tesseract, Ollama를 통한 qwen3-vl과 텍스트 모델, 저희 GPU의 PaddleOCR-VL과 Real-ESRGAN. 어떤 페이지도 외부 AI 서비스로 가지 않아요.',
      ],
      privacyNote: '페이지 이미지는 uploads/<jobId>/src/에, 정규화된 사본은 작업 폴더에 저장돼요. 손글씨 페이지는 저희 자체 GPU에서 Ollama가 제공하는 qwen3-vl 모델로 보내지고, 인쇄된 페이지는 CPU의 Tesseract가 읽으며, 페이지별 전사 초안은 작업이 실행되는 동안 그 작업 폴더에 JSON으로 보관돼요. 작업이 끝나면 업로드 파일과 작업 폴더가 모두 즉시 삭제돼요. 남는 것은 outputs/<jobId>/의 결과 폴더로, PDF, 요청한 경우 Word 파일, manifest(페이지별 엔진, 신뢰도, 표시 개수), README가 들어 있으며, 이 폴더는 보관 기간이 끝나면 삭제돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 전사된 텍스트는 다운로드하는 PDF의 텍스트 레이어와 DOCX 안에 들어 있어요. 외부 AI 제공업체로는 아무것도 전송되지 않으며, 학습에도 사용되지 않아요.',
      faq: [
        {
          question: 'PDF와 Word 문서는 어떻게 다른가요?',
          answer: 'PDF는 검색 가능한 텍스트 레이어가 있는 스캔이에요. 인쇄된 페이지 아래에는 Tesseract 레이어가, 손글씨 페이지 아래에는 보이지 않는 기계 전사가 있고, 두 경우 모두 원본 이미지가 눈에 보이는 페이지예요. Word 문서는 별도의 재구성이에요. 인쇄된 페이지는 PaddleOCR-VL이나 Docling이 만든 제목, 목록, 표로, 손글씨 페이지는 검증하라는 굵은 안내문 아래 원문 그대로의 전사로 들어가요. PDF 이미지를 기준으로, DOCX는 초안으로 취급하세요.',
        },
        {
          question: '손글씨 전사는 얼마나 믿을 만한가요?',
          answer: '꼼꼼한 기계 판독이지 공인된 녹취록은 아니에요. 모델은 적힌 그대로 옮기고, 읽을 수 없는 부분은 [illegible]로, 확실하지 않은 단어는 [?: best guess]로 표시하며, 절대 지어내거나 고치지 말라는 지시를 받아요. 각 페이지에는 신뢰도(표시가 없으면 높음, 표시된 줄이 15퍼센트 미만이면 보통, 그 이상이면 낮음)와 표시 개수가 붙고, PDF 페이지에는 기계 전사임을 알리는 바닥글이 보이게 들어가요. 표시된 단어는 스캔과 대조해 읽으세요.',
        },
        {
          question: '인쇄된 페이지와 손글씨 페이지를 섞을 수 있나요?',
          answer: '네. 자동 모드에서는 비전 모델이 페이지마다 주로 인쇄물인지 손글씨인지 판단하고, 그에 따라 페이지가 Tesseract나 손글씨 모델로 가요. manifest에 페이지별 판단이 기록되고, 최종 PDF와 Word 파일은 시작 전에 정한 순서를 유지해요.',
        },
        {
          question: '인쇄물 OCR은 어떤 언어를 지원하나요?',
          answer: 'Tesseract 언어 코드를 쓰며, 여러 언어가 섞인 페이지는 더하기 기호로 이어요(예: eng+fra). 서버가 제공하는 코드는 양식에 나와 있어요. 영어는 기본으로 설치되어 있고 다른 언어는 추가되는 대로 나타나요. 손글씨는 비전 모델이 읽으므로 이 코드를 쓰지 않아요.',
        },
        {
          question: '작업당 제한은 어떻게 되나요?',
          answer: '기본적으로 작업당 최대 50장의 페이지 이미지(이미지 하나가 한 페이지이므로 실제로는 50이 페이지 한도이기도 해요), 이미지당 25 MB, 서버당 한 번에 실행 중인 작업 하나(나머지는 대기열에서 기다려요), 모델 단계마다 40분의 상한이 있어요. 작업마다 AI 작업 한 번을 사용해요. 계정 없이 하루 3회, 무료 계정 10회, Premium 100회, Pro 200회이며, 작업이 실패하면 그 한 번은 환불돼요. 최신 수치는 요금 페이지에 나와 있어요.',
        },
        {
          question: '손글씨 PDF에 바닥글이 있는 이유는 무엇이고, 없앨 수 있나요?',
          answer: '모든 손글씨 페이지에는 "Machine transcription, verify against original"(기계 전사이니 원본과 대조하세요)라는 작은 회색 줄이 들어가고, Word 섹션에는 같은 뜻의 굵은 안내문이 들어가요. 검색 가능한 손글씨 사본이 검증된 것으로 오인될 수 있기 때문이에요. 이 표시는 의도적으로 출력의 일부이며 끌 수 없어요. 레이어가 결정론적인 Tesseract 출력인 인쇄된 페이지에는 표시가 붙지 않아요.',
        },
        {
          question: '내 페이지가 서버 밖으로 나가나요?',
          answer: '아니요. Tesseract는 CPU에서, 손글씨 및 분류 모델은 저희 GPU의 Ollama를 통해 실행되고, 구조 분석 엔진과 업스케일러는 같은 머신의 두 번째 GPU에서 실행돼요. 업로드 파일과 작업 파일은 작업이 끝나는 즉시 삭제돼요.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '기본적으로 작업당 최대 50장의 페이지 이미지를 추가할 수 있으며, 페이지 이미지마다 개별 크기 한도(약 25 MB)가 있어요.',
          '검색 가능한 PDF는 항상 만들어지고, 편집 가능한 Word 문서는 선택 사항이에요.',
        ],
        processingNotes: [
          '인쇄된 페이지는 결정론적 OCR(OCRmyPDF + Tesseract)을 사용해 충실하고 검색 가능한 텍스트 레이어를 만들어요.',
          '손글씨는 비전 AI가 [illegible]/[?] 표시를 보존한 채 원문 그대로 전사해요. 기계 전사이며 기준이 되는 페이지가 아니에요.',
          'Word 문서와 AI 요약은 재구성이에요. 원본 스캔과 대조해 확인하세요.',
        ],
      },
      related: [
        {
          label: '이미지를 PDF로',
          to: '/tools/image-to-pdf',
          description: '텍스트 레이어 없이 페이지 이미지를 PDF로 묶어요. 일반 작업으로 처리돼요.',
        },
        {
          label: 'PDF를 JPG로',
          to: '/tools/pdf-to-jpg',
          description: '기존 PDF를 스캔에 넣을 수 있는 페이지 이미지로 렌더링하세요.',
        },
        {
          label: 'AI 이미지 복원',
          to: '/tools/ai-image-restoration',
          description: '전사하기 전에 바래거나 흐릿한 스캔을 복구하세요.',
        },
        {
          label: 'EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '휴대폰으로 찍은 문서 사진에서 위치와 기기 태그를 지우세요.',
        },
        {
          label: '이미지 속 텍스트 가리기',
          to: '/tools/redact-text-in-image',
          description: '스캔을 공유하기 전에 페이지의 이름이나 숫자를 검게 가리세요.',
        },
      ],
      embed: {
        title: 'AI 문서 스캔',
        description: '스캔한 페이지 이미지(인쇄 문서 또는 손글씨 메모)를 한 장 이상 추가하고, 필요하면 순서를 바꾼 뒤, 콘텐츠 모드와 출력을 고르면 검색 가능한 PDF와 선택 사항인 Word 문서를 받을 수 있어요.',
      },
    },
    'ai-image-upscaler': {
      name: 'AI 이미지 업스케일러',
      h1: 'AI 이미지 업스케일러: 사진을 온라인에서 2배 또는 4배로 확대',
      tagline: '작거나 흐릿한 사진을 단순히 픽셀을 늘리는 대신 세부 묘사를 다시 만들어 내는 Real-ESRGAN 모델로 확대하세요.',
      metaTitle: 'AI 이미지 업스케일러: 사진을 2배 또는 4배로 확대 | Media Manipulator',
      metaDescription: '저해상도 사진을 윤곽과 질감을 되살리는 AI로 2배 또는 4배 업스케일하세요. 자체 GPU에서 실행되며 PNG로 출력합니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'AI 이미지 업스케일러: 사진을 2배 또는 4배로 확대',
      ogDescription: '픽셀을 늘리는 대신 디테일을 다시 만들어 내는 Real-ESRGAN AI 모델로 작거나 흐릿한 사진을 확대하세요.',
      intro: '이 페이지는 AI 업스케일이 고정되고 출력이 PNG로 설정된 이미지 변환기를 열어요. 서버는 저희가 소유한 GPU에서 Real-ESRGAN의 Vulkan 빌드인 realesrgan-ncnn-vulkan을 실행해요. 기본 모델은 4배의 realesrgan-x4plus이고, 그림과 애니메이션 프레임용으로 realesrgan-x4plus-anime과 realesr-animevideov3을 쓸 수 있으며, 다른 배율로 2배도 고를 수 있어요. 네트워크는 기존 픽셀 사이를 보간하는 대신, 더 큰 크기에서 윤곽, 피부, 직물, 나뭇잎이 어떻게 보일지 예측해 그 디테일을 그려 넣어요. 결과는 무손실 PNG로 저장되므로 합성된 디테일 위에 새로운 압축 아티팩트가 쌓이지 않아요.',
      whatItDoes: [
        '저희 GPU에서 실행되는 Real-ESRGAN 모델로 이미지의 너비와 높이를 2배 또는 4배로 확대해요.',
        '양식에서 사진 모델과 애니메이션 스타일 모델 두 가지 중에서 고를 수 있어요. 4배와 사진 모델이 미리 선택되어 있어요.',
        '항상 PNG로 출력해요. 이 작업에서는 API가 .png 확장자를 강제해요.',
        'GPU에서 이미지를 자동으로 타일로 나눠 처리하므로 큰 입력도 비디오 메모리가 부족해지지 않아요.',
        '별도의 카운터인 일일 AI 작업 횟수에서 AI 작업 한 건을 사용해요. 변환에 쓰이는 일일 일반 작업 횟수는 줄어들지 않아요.',
      ],
      flowSteps: [
        {
          title: '작거나 흐릿한 이미지 업로드',
          description: 'JPG, PNG 또는 WebP. 입력이 작을수록 모델이 지어내야 할 부분이 많아져요.',
        },
        {
          title: '4배 또는 2배와 모델 선택',
          description: '사진에는 realesrgan-x4plus, 선화와 만화 프레임에는 애니메이션 모델을 쓰세요.',
        },
        {
          title: 'GPU에서 Real-ESRGAN 실행',
          description: 'realesrgan-ncnn-vulkan -i in -o out -n <model> -s <2|4> -t 0 -g <gpu> -f png',
        },
        {
          title: 'PNG 다운로드',
          description: '원본 픽셀 크기의 2배 또는 4배인 converted.png를 받아요.',
        },
      ],
      advancedDetails: [
        '호출은 ai_tools.go의 UpscaleImage예요. 모델은 -n, 배율은 -s, 자동 타일 크기는 -t 0, GPU 인덱스는 -g, 그리고 -f png로 realesrgan-ncnn-vulkan을 실행해요. Vulkan ICD는 환경 변수로 고정되어 있어 로더가 항상 NVIDIA 드라이버를 찾아요.',
        '배율은 2와 4만, 모델 이름은 realesrgan-x4plus, realesrgan-x4plus-anime, realesr-animevideov3 세 가지만 허용돼요. 그 밖의 값은 작업이 시작되기 전에 거부돼요.',
        '2배는 같은 x4 네트워크를 절반 배율로 실행해요. 양식에는 일부 이미지에서 2배 결과가 약간 잘리거나 확대된 것처럼 보일 수 있다는 안내가 있는데, 서버에서 640 x 360 사진으로 확인된 현상이에요. API는 4배로 실행한 뒤 축소하는 방식으로 이 현상을 감추지 않기로 일부러 정했어요.',
        'AI 경로는 ImageMagick과 exiftool 복사를 거치지 않으므로, 양식의 품질, 크기 조정, 필터, 메타데이터 설정은 여기서 아무 효과가 없고, PNG에는 원본의 EXIF가 담기지 않아요.',
        '픽셀 수는 배율의 제곱으로 늘어나요. 4배는 픽셀이 16배, 2배는 4배가 돼요. 출력의 비압축 RGB 크기는 너비 x 높이 x 3바이트이며, 이것이 PNG 크기의 상한이 돼요.',
        '이 작업에만 적용되는 입력 크기 제한은 서버에 없고, 요금제의 파일당 크기 제한만 적용돼요. 아주 큰 입력은 타일 단위로 처리되어 시간이 더 걸릴 뿐이에요.',
      ],
      whyItMatters: [
        '오래된 디지털 사진, 저해상도 다운로드, 작은 웹 이미지는 촬영된 크기보다 훨씬 크게 인쇄하거나 보여 줘야 할 때가 많아요.',
        '단순한 보간은 이미지를 더 크게 만들 뿐 더 선명하게 만들지는 않아요. 초해상도 모델이 흐릿한 결과와 쓸 만한 결과를 가르는 차이예요.',
        '무손실 PNG에서 시작하면 나중에 아티팩트가 겹겹이 쌓일 걱정 없이 결과를 압축하거나 크기를 조절할 수 있어요.',
      ],
      useCases: [
        {
          title: '오래된 사진 인쇄',
          description: '초기 카메라로 찍은 1메가픽셀 사진을 인쇄하기 좋은 크기로 키우세요.',
        },
        {
          title: '작은 다운로드 이미지 살리기',
          description: '400 px 제품 이미지나 참고 이미지를 쓸 만한 크기로 확대하세요.',
        },
        {
          title: '애니메이션과 일러스트',
          description: 'realesrgan-x4plus-anime으로 윤곽이 뭉개지지 않게 선화를 확대하세요.',
        },
        {
          title: '게임과 동영상 프레임',
          description: '캡처한 애니메이션 프레임에 realesr-animevideov3을 사용하세요.',
        },
      ],
      workedExamples: [
        {
          title: 'realesrgan-x4plus로 640 x 360 JPEG를 4배로',
          body: '입력: 92 KB, 640 x 360 크기의 풍경 JPEG 썸네일. 설정은 프리셋 그대로 두었어요(4배, 사진 모델, PNG 출력). 서버는 realesrgan-ncnn-vulkan -n realesrgan-x4plus -s 4 -t 0 -f png를 실행하고 2560 x 1440 픽셀의 converted.png를 저장해요. 원본 230,400픽셀의 16배예요. 비압축 출력은 2560 x 1440 x 3 = 11 MB의 RGB이고, PNG는 하늘과 단색 영역이 얼마나 많은지에 따라 그보다 작아지므로, 92 KB 입력에서 몇 메가바이트짜리 파일이 나온다고 예상하세요. 이 정도 크기의 출력이라면 자동으로 정해진 타일에 대한 GPU 처리는 몇 초면 끝나요. 전체 시간 중 PNG 인코딩과 몇 메가바이트짜리 파일 다운로드가 차지하는 몫도 꽤 커요.',
        },
        {
          title: '1200 x 800 사진을 2배로',
          body: '입력: 480 KB, 1200 x 800 크기의 인물 JPEG. 2배를 고르고 사진 모델은 그대로 두세요. 출력은 2400 x 1600 PNG로, 3.84메가픽셀이며 원본 0.96메가픽셀의 네 배예요. 비압축으로는 11.5 MB의 RGB이고, PNG는 그중 일부 크기가 돼요. 2배는 x4 네트워크를 절반 배율로 실행하므로, 양식이 경고하는 약간의 잘림이나 확대가 없는지 가장자리를 확인하세요. 그런 현상이 보이면 대신 4배로 실행하고, 4800 x 3200 결과를 이미지 크기 조절 도구로 2400 x 1600까지 줄이세요. 이 경우 작업이 한 번 더 들어가요.',
        },
      ],
      whenNotToUse: '이미 크고 선명한 이미지는 업스케일하지 마세요. 12메가픽셀 사진을 4배로 키우면 192메가픽셀 PNG가 되는데, 만드는 데 오래 걸리고 비압축 시 수백 메가바이트에 달하면서도 눈에 보이는 이득은 없어요. 얼굴, 텍스트, 로고처럼 원본을 정확히 보존해야 하는 대상에는 의존하지 마세요. 추가된 디테일은 복원된 것이 아니라 예측된 것이라서, 작은 텍스트가 그럴듯하지만 틀린 글자로 나올 수 있어요. 심한 모션 블러나 초점이 맞지 않은 사진은 해상도로 고쳐지지 않아요. 큰 원본에서 특정 픽셀 크기만 필요하다면 일반 크기 조절 도구가 더 빠르고 저렴해요.',
      whyMediaManipulator: [
        '실제 바이너리, 모델, 플래그를 여기에 밝혀 두었으므로, 막연한 "향상" 기능이 아니라 자동 타일링을 쓰는 Real-ESRGAN이라는 것을 알 수 있어요.',
        '2배의 주의점을 숨기지 않고 밝혀 두었고, 작업이 고정되어 있어 메뉴를 뒤질 필요가 없어요.',
        '저희가 소유한 하드웨어에서 실행돼요. 표준 도구는 계정이 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ],
      privacyNote: '이미지는 저희 서버의 uploads/<jobId>/에 저장되고, 같은 머신에 있는 GPU에서 realesrgan-ncnn-vulkan 바이너리가 직접 읽어요. 바이너리가 만든 PNG는 outputs/<jobId>/converted.png로 저장돼요. 외부 AI 제공업체는 관여하지 않으며, 이미지는 어떤 학습에도 사용되지 않아요. 모든 이미지 업로드와 마찬가지로, 저희 서버의 자동 분석 단계가 로컬 비전 모델로 파일을 한 번 분석하고 그 요약을 작업과 함께 저장해요. AI 작업은 메타데이터 복사를 건너뛰므로 결과에는 원본의 EXIF가 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      faq: [
        {
          question: 'AI 업스케일러는 무료인가요?',
          answer: '네, 일일 AI 작업 횟수 안에서 무료예요. 업스케일 한 번에 AI 작업 한 건을 사용해요. 기본적으로 비회원은 하루 3건, 무료 계정은 10건이며, 파일당 크기 제한은 각각 200 MB와 1 GB예요. Premium과 Pro는 100건과 200건이에요. 이 횟수는 일일 일반 작업 횟수와 별개라서 변환 작업에는 영향이 없어요. 실시간 수치는 /pricing에서 확인할 수 있어요.',
        },
        {
          question: '이미지 크기 조절 도구와 무엇이 다른가요?',
          answer: '크기 조절 도구는 ImageMagick을 실행해 기존 픽셀을 보간하므로, 더 크지만 더 흐릿한 이미지를 만들어요. 이 도구는 학습된 Real-ESRGAN 네트워크를 실행해 더 큰 크기에서 윤곽과 질감을 합성해요. 이는 추론일 뿐, 복원된 데이터가 아니에요.',
        },
        {
          question: '2배와 4배 중 무엇을 골라야 하나요?',
          answer: '4배가 기본값이며 가장 일관된 결과를 내요. 2배는 같은 네트워크를 절반 배율로 실행해 일부 이미지에서 약간 잘린 것처럼 보일 수 있으므로, 4배가 필요 이상이라면 4배로 키운 뒤 크기를 줄이는 방법을 고려하세요.',
        },
        {
          question: '그림에는 어떤 모델이 알맞나요?',
          answer: '일러스트와 단색 위주의 그림에는 realesrgan-x4plus-anime, 애니메이션에서 가져온 프레임에는 realesr-animevideov3을 쓰세요. 사진 모델은 선화에서 어색해 보이는 피부 같은 질감을 더해요.',
        },
        {
          question: '출력이 PNG이고 용량이 큰 이유는 뭔가요?',
          answer: '합성된 디테일이 JPEG 압축으로 곧바로 손상되지 않도록 PNG를 강제해요. 4배 결과는 픽셀이 16배라서 파일이 커요. 공유하려면 나중에 JPG나 WebP로 압축하세요.',
        },
        {
          question: '흐릿하거나 초점이 나간 사진도 고칠 수 있나요?',
          answer: '낮은 해상도에서 오는 흐릿함에는 도움이 돼요. 모션 블러나 초점이 맞지 않은 것은 되돌릴 수 없고, 얼굴과 작은 텍스트를 매끄럽게 뭉개거나 바꿀 수도 있어요. 사용하기 전에 결과를 원본과 비교하세요.',
        },
        {
          question: '제 사진이 외부 AI 서비스로 전송되나요?',
          answer: '아니요. Real-ESRGAN은 저희가 운영하는 GPU 서버에서 실행되며, 작업 중에 외부 API를 호출하지 않아요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '출력은 PNG예요. 크기 제한과 일일 AI 작업 횟수는 요금제에 따라 다르며, 이 페이지에 고정된 값이 아니라 양식에 표시돼요.',
        ],
      },
      related: [
        {
          label: 'AI 이미지 복원',
          to: '/tools/ai-image-restoration',
          description: '확대 전후에 압축 흔적과 노이즈를 정리하세요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '4배 결과를 필요한 정확한 크기로 줄이세요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '큰 PNG를 공유하기 좋은 JPG나 WebP로 바꾸세요.',
        },
        {
          label: '이미지 배경 제거',
          to: '/tools/remove-background-from-image',
          description: '확대한 피사체를 투명 배경 위로 잘라 내세요.',
        },
        {
          label: 'AI 동영상 복원',
          to: '/tools/ai-video-restoration',
          description: '동영상 프레임을 위한 같은 기능이에요.',
        },
      ],
      embed: {
        title: 'AI로 이미지 업스케일',
        description: '사진을 업로드하세요. AI 업스케일이 이미 선택되어 고정되어 있고, 출력은 PNG로 설정되어 있어요. 2배 또는 4배와 모델(사진 또는 애니메이션)을 고른 다음 변환하세요.',
      },
    },
    'blur-faces-in-photo': {
      name: '사진 속 얼굴 흐리게 처리',
      h1: '사진 속 얼굴 온라인 흐리게 처리',
      tagline: '얼굴을 자동으로 감지한 다음, 모든 얼굴 또는 선택한 얼굴만 흐리게, 모자이크로, 검게 가리세요.',
      metaTitle: '사진 속 얼굴 온라인 흐리게 처리 | Media Manipulator',
      metaDescription: '사진 속 얼굴을 흐리게, 모자이크로, 검게 가리세요. 모든 얼굴을 감지한 다음 가릴 얼굴을 고르세요. AI는 자체 GPU에서 실행됩니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '사진 속 얼굴 온라인 흐리게 처리',
      ogDescription: '사진 속 얼굴을 자동으로 찾아 모든 얼굴 또는 고른 얼굴만 흐리게, 모자이크로, 검게 가리세요.',
      intro: '군중, 교실, 거리 사진을 게시하려면 보통 사진에 나오는 데 동의한 적 없는 사람들을 가려야 해요. 이 페이지는 저희 자체 서버의 OpenCV에서 실행되는 YuNet 감지기로 얼굴을 찾아, 각 얼굴을 가우시안 흐림, 픽셀 모자이크, 또는 불투명한 검은 사각형으로 덮어요. 감지된 모든 얼굴을 한 번에 가릴 수도 있고, 먼저 감지를 실행해 사진 위에 그려진 상자를 확인한 다음 가릴 얼굴만 또는 남길 얼굴만 고를 수도 있어요. 감지기, 신뢰도 임곗값, 각 효과의 정확한 크기를 아래에 설명해 두었으니 결과물이 무엇을 보호하고 무엇을 보호하지 못하는지 알 수 있어요.',
      whatItDoes: [
        'OpenCV FaceDetectorYN과 YuNet 2023 모델로 신뢰도 임곗값 0.85에서 얼굴을 감지한 다음, 머리카락과 턱선까지 가려지도록 각 상자를 모든 방향으로 18%씩 넓혀요.',
        '선택한 각 얼굴을 커널이 상자 크기의 삼분의 일인 가우시안 흐림, 상자 가로로 14개 블록이 놓이는 모자이크, 또는 검은색 채우기로 가려요.',
        '세 가지 선택 모드를 제공해요. 감지된 모든 얼굴, 체크한 얼굴만, 또는 체크한 얼굴을 제외한 모두예요.',
        '감지 결과를 파일의 SHA-256에 묶인 30분짜리 세션에 저장하므로, 적용되는 상자는 화면에서 본 상자와 정확히 같아요.',
        '픽셀 크기가 같은 새 JPG, PNG 또는 WebP를 만들어요. 원본 업로드는 바뀌지 않아요.',
      ],
      flowSteps: [
        {
          title: '사진 업로드',
          description: 'JPG, PNG 또는 WebP. 이 페이지에서는 얼굴 흐림 / 픽셀화가 미리 선택되어 고정돼요.',
        },
        {
          title: '흐림, 픽셀화, 검은 상자 중 선택',
          description: '흐림이 기본값이에요. 검은 상자는 픽셀을 완전히 없애요.',
        },
        {
          title: '필요하면 감지 후 선택',
          description: '얼굴 감지를 누르면 번호가 매겨진 상자가 나타나요. 그다음 가릴 얼굴이나 남길 얼굴을 체크하세요.',
        },
        {
          title: '작업 실행',
          description: '서버가 선택한 각 상자 안에 효과를 적용하고 새 이미지를 저장해요.',
        },
        {
          title: '확인 후 다운로드',
          description: '게시하기 전에 원본 크기로 확대해서 놓친 얼굴이 없는지 살펴보세요.',
        },
      ],
      advancedDetails: [
        '감지는 face_privacy.py가 face_detection_yunet_2023mar.onnx 모델로 OpenCV FaceDetectorYN을 실행하는 방식이며, 전체 이미지 해상도, 점수 임곗값 0.85, NMS 임곗값 0.3, 최대 5000개 후보로 진행돼요. 상자에는 각 방향으로 너비와 높이의 0.18만큼 여백이 더해지고, 이미지 경계 안으로 제한돼요.',
        '흐림은 max(3, 상자의 긴 변 / 3) 픽셀 크기의 홀수 커널로 cv2.GaussianBlur를 적용하므로, 300 px 얼굴에는 101 px 커널이 쓰여요. 얼굴이 클수록 흐림도 강해져요. 픽셀화는 상자를 선형 필터링으로 가로 14개 블록까지 줄였다가 최근접 이웃 방식으로 다시 키워, 눈에 보이는 정사각형 타일을 만들어요. 검은 상자는 영역에 (0, 0, 0)을 기록해요.',
        '먼저 감지하면 서버가 업로드의 SHA-256을 계산하고 정규화된 상자를 30분 후 만료되는 세션에 저장하며, 나중에 제출한 파일과 해시가 맞지 않는 세션은 적용을 거부해요. 그래서 상자를 다른 사진에 옮겨 쓸 수 없어요.',
        '감지 세션이 없으면 스크립트가 실행 시점에 다시 감지해 찾은 모든 얼굴을 가려요. 결과는 얼굴 감지를 실행하고 선택 모드를 감지된 모든 얼굴로 둔 것과 같아요.',
        '출력은 OpenCV가 기록하고 변환기의 exiftool 메타데이터 복사 단계는 AI 출력에서 실행되지 않으므로, 결과에는 원본의 EXIF, GPS, 카메라 태그가 전혀 남지 않아요. 그렇다고 무엇을 지울지 직접 보고 고를 수 있는 EXIF 도구를 대신하지는 못해요.',
        '크고 선명한 얼굴에 약한 흐림을 적용하면 디컨볼루션 도구로 일부 복원될 수 있어요. 정보를 완전히 없애는 것은 검은 상자뿐이고, 거친 모자이크는 그 중간이에요.',
      ],
      whyItMatters: [
        '다른 사람, 특히 어린이가 찍힌 사진에는 동의 문제와 때로는 법적 의무가 따르며, 이는 캡션으로 해결되지 않아요.',
        '얼굴이 20개인 사진을 손으로 편집하면 느리고 결과도 들쭉날쭉해요. 감지 기능은 뒷줄의 작은 얼굴까지 찾아내요.',
        '감지 후 선택하면 내 일행은 그대로 보이게 두고 지나가는 사람만 익명 처리할 수 있어요.',
      ],
      useCases: [
        {
          title: '행사 및 군중 사진',
          description: '공개 행사 사진을 게시하기 전에 주변 사람들을 가리세요.',
        },
        {
          title: '학교 및 동아리 게시물',
          description: '가족이 동의하지 않은 특정 어린이를 가리세요.',
        },
        {
          title: '저널리즘 및 보도',
          description: '다큐멘터리 스틸 사진 속 취재원이나 참여자를 보호하세요.',
        },
        {
          title: '화상 회의 스크린샷',
          description: '회의 화면 캡처를 팀 밖에 공유하기 전에 동료들을 익명 처리하세요.',
        },
      ],
      workedExamples: [
        {
          title: '얼굴 14개가 있는 4000 x 3000 단체 사진, 전부 흐림 처리',
          body: '입력: 휴대폰으로 찍은 4000 x 3000 픽셀, 3.5 MB의 JPEG로, 14명이 담겨 있어요. 설정: 흐림, 선택 모드는 감지된 모든 얼굴, 사전 감지 없음. 스크립트가 12메가픽셀 프레임 전체에 YuNet을 실행해요. 상자가 300 x 360 픽셀인 얼굴은 18%만큼 여백이 더해져 약 408 x 490이 되고, 163 px 가우시안 커널(490 / 3을 홀수로 반올림)로 흐려져 특징을 알아볼 수 없는 덩어리가 돼요. 뒷줄의 60 px 얼굴에는 27 px 커널이 쓰이는데, 그 크기에서는 이목구비를 지우기에 충분해요. 출력은 OpenCV가 기록한 4000 x 3000 JPG이며, 보통 원본 크기와 수백 킬로바이트 이내로 차이 나요. 감지와 흐림은 몇 초면 끝나고, 3.5 MB 업로드가 보통 더 오래 걸려요.',
        },
        {
          title: '1920 x 1080 화상 회의 스크린샷, 얼굴 여섯 개 중 두 개 픽셀화',
          body: '입력: 참여자 여섯 명이 보이는 1920 x 1080, 1.1 MB PNG 스크린샷. 설정: 먼저 얼굴 감지, 선택 모드는 선택한 얼굴만, 얼굴 두 개 체크, 픽셀화. 감지는 상자 여섯 개를 반환하고 이를 파일 해시에 묶인 30분짜리 세션에 저장해요. 제출하면 서버가 해시를 확인하고 선택된 상자 ID 두 개를 스크립트에 넘겨요. 여백을 더한 뒤 약 140 x 180 픽셀인 각 선택 상자는 가로 14개 블록으로 줄어들어 타일 하나가 대략 10 x 13 픽셀이 되고, 뚜렷한 정사각형으로 다시 기록돼요. 나머지 얼굴 네 개는 그대로예요. 출력은 1920 x 1080 PNG이고, 다시 감지할 필요가 없어서 작업은 몇 초 만에 끝나요.',
        },
      ],
      whenNotToUse: '얼굴 하나만 놓쳐도 용납되지 않는 경우, 예를 들어 법적으로 의무화된 가리기 작업에는 이 도구에 의존하지 마세요. 임곗값 0.85의 YuNet은 아주 작거나, 돌아섰거나, 마스크를 썼거나, 짙은 그림자 속에 있는 얼굴을 건너뛰므로 결과를 직접 확인해야 해요. 신원을 절대 알아볼 수 없어야 하는 사람의 큰 얼굴에는 약한 흐림을 쓰지 말고 검은 상자를 쓰세요. 이름표, 번호판, 화면은 얼굴이 아니므로 그런 경우에는 텍스트 가리기 도구나 개체 제거 도구가 알맞아요. 또 얼굴을 가리는 것이 아니라 사람을 장면에서 아예 지우고 싶다면 개체 제거 도구가 그 일을 해요.',
      whyMediaManipulator: [
        '감지기, 임곗값, 여백, 커널 계산식을 공개하므로 각 스타일이 얼마나 보호해 주는지 직접 판단할 수 있어요.',
        '감지 상자는 파일 해시에 묶이고 30분 후 만료되므로, 실제로 처리되는 바로 그 이미지에서 선택하게 돼요.',
        '얼굴 흐림은 일일 AI 작업 횟수에서 AI 작업 한 번을 사용해요(기본값 기준 계정 없이 하루 3회, 무료 계정은 10회). 이 횟수는 일일 일반 작업 횟수와 따로 관리되며, 얼굴 감지 미리보기는 전혀 집계되지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ],
      privacyNote: '얼굴 감지와 흐림 처리는 저희 자체 하드웨어에서 로컬 OpenCV 프로세스로 실행돼요. 외부 AI 서비스는 사진을 받지 않으며, 어떤 것도 학습에 사용되지 않아요. 얼굴 감지 미리보기는 임시 사본을 저장하고, 해시를 계산하고, 감지한 뒤 응답하기 전에 사본을 삭제해요. 상자 좌표만 30분 동안 보관돼요. 업로드한 사진은 uploads/<jobId>/에, 결과는 outputs/<jobId>/에 있으며, 둘 다 보관 대장에 등록되어 보관 기간이 끝나면 삭제돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 일반 이미지 업로드이므로 사진은 같은 서버의 자동 콘텐츠 분석도 거치며, 여기서 로컬 비전 모델이 짧은 설명을 작성해요. 이 설명은 작업과 함께 보관되고 제삼자와 공유되지 않아요.',
      faq: [
        {
          question: '감지기가 놓치는 얼굴은 어떤 건가요?',
          answer: 'YuNet은 신뢰도 임곗값 0.85로 실행되므로 신뢰도가 낮은 후보는 건너뛰어요. 아주 작은 얼굴, 카메라에서 돌아선 옆모습, 마스크나 손으로 가려진 얼굴, 짙은 그림자 속 얼굴이 그래요. 공유하기 전에 결과를 원본 크기로 확인하세요.',
        },
        {
          question: '일부 얼굴만 흐리게 하려면 어떻게 하나요?',
          answer: '얼굴 감지를 누르고 번호가 매겨진 상자를 체크한 다음, 선택 모드를 선택한 얼굴만 또는 선택한 얼굴을 제외한 모두로 설정하세요. 상자는 파일 해시에 묶여 30분 동안 보관되므로, 사진을 바꾸면 다시 감지하세요.',
        },
        {
          question: '흐림은 얼마나 강하고, 되돌릴 수 있나요?',
          answer: '가우시안 커널은 상자 크기의 삼분의 일이라서 300 px 얼굴에는 101 px 커널이 쓰여요. 강한 흐림은 되돌리기 어렵지만, 선명하고 큰 얼굴이라면 작정한 공격자에게 가능성이 있어요. 검은 상자는 픽셀을 없애므로 되돌릴 수 없어요.',
        },
        {
          question: '출력에 사진의 EXIF와 GPS 데이터가 남나요?',
          answer: '아니요. 결과는 OpenCV가 새로 기록하고 AI 출력에서는 메타데이터 복사 단계를 건너뛰므로 카메라와 위치 태그가 옮겨지지 않아요. 태그를 확인하거나 골라서 지우고 싶다면 EXIF 도구를 사용하세요.',
        },
        {
          question: '사진이 외부 AI 회사로 전송되나요?',
          answer: '아니요. 감지와 효과는 저희 자체 서버의 로컬 OpenCV 프로세스에서 실행되며, 파일은 제삼자 AI 제공업체와 공유되지 않아요.',
        },
        {
          question: '얼굴 흐림은 일일 AI 작업 횟수를 사용하나요?',
          answer: '네. 흐림 처리한 사진 한 장이 AI 작업 한 번이에요. 기본값 기준 비회원은 하루 3회, 무료 계정은 10회예요. 일일 일반 작업 횟수는 전혀 사용하지 않아요. 얼굴 감지 미리보기는 요청 빈도 제한이 있지만 집계되지 않아요. 실패한 작업은 횟수가 복구돼요.',
        },
        {
          question: '번호판, 이름표, 화면 속 텍스트는요?',
          answer: '그런 것은 얼굴이 아니므로 여기서는 감지되지 않아요. 읽을 수 있는 것은 텍스트 가리기 도구로, 사진에서 번호판이나 표지판을 지우려면 개체 제거 도구로 처리하세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '작업마다 일일 AI 작업 횟수에서 AI 작업 한 번을 사용해요. 요금제별 파일당 크기 제한은 양식에 표시돼요.',
        ],
      },
      related: [
        {
          label: '이미지 속 텍스트 가리기',
          to: '/tools/redact-text-in-image',
          description: '이메일, 전화번호 등 읽을 수 있는 텍스트를 가리세요.',
        },
        {
          label: '사진에서 개체 제거',
          to: '/tools/remove-object-from-photo',
          description: '사람, 번호판, 표지판을 통째로 지우세요.',
        },
        {
          label: 'EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '같은 사진에서 GPS와 카메라 데이터를 지우세요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '익명 처리한 사진을 게시하기 전에 용량을 줄이세요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '결과를 플랫폼이 원하는 크기로 조절하세요.',
        },
      ],
      embed: {
        title: '사진 속 얼굴 흐리게 처리',
        description: '사진을 업로드하세요. 얼굴 흐림 / 픽셀화가 이미 선택되어 고정되어 있어요. 스타일을 고르고, 필요하면 얼굴을 감지해 가릴 얼굴을 선택한 다음 변환하세요.',
      },
    },
    'redact-text-in-image': {
      name: '이미지 속 텍스트 가리기',
      h1: '이미지 속 텍스트와 개인 정보 가리기',
      tagline: '스크린샷이나 사진에서 읽을 수 있는 텍스트를 찾아 개인 정보 또는 모든 텍스트를 흐림 효과나 검은 상자로 가리세요.',
      metaTitle: '이미지 속 텍스트 온라인 가리기 | Media Manipulator',
      metaDescription: '이미지에서 텍스트를 자동으로 찾아 이름, 이메일, 번호 등 개인 정보를 검게 가리거나 흐리게 처리하세요. AI는 자체 GPU에서 실행됩니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '이미지 속 텍스트와 개인 정보 가리기',
      ogDescription: '스크린샷과 사진에서 텍스트를 찾아 개인 정보 또는 모든 텍스트를 흐림이나 검은 상자로 가리세요.',
      intro: '스크린샷에는 주인이 더 이상 눈여겨보지 않는 정보가 새어 나와요. 머리글의 이메일 주소, 표 속의 계좌 번호, 채팅 말풍선 속 전화번호 같은 것들이죠. 이 페이지는 저희 자체 서버의 EasyOCR로 이미지 속 모든 텍스트를 읽고, 일치하는 부분을 검은 사각형, 흐림, 또는 픽셀 모자이크로 덮어요. 기본 모드에서는 개인 정보 패턴과 일치하는 텍스트만 가려요. 이메일 주소, 전화번호, 사회보장번호 형식의 번호, 카드 번호처럼 긴 숫자열, 도로명 주소가 여기에 해당해요. 모든 텍스트 모드에서는 읽을 수 있는 모든 단어를 가리며, 페이지에 무엇이 있을지 예상할 수 없을 때 더 안전한 선택이에요.',
      whatItDoes: [
        '저희 서버의 GPU를 사용해 이미지 전체에 EasyOCR을 실행하고 텍스트 상자와 그 안의 텍스트를 찾아요.',
        '개인정보 모드에서는 텍스트가 다섯 가지 패턴 중 하나와 일치하는 상자를 가려요. 이메일, 전화번호, 3-2-4 자리 식별 번호, 13~19자리 카드 형식 숫자열, 또는 Street, Avenue, Road, Drive, Lane, Boulevard, Way, Court, Circle, Place로 끝나는 도로명 주소예요.',
        '모든 텍스트 모드에서는 내용과 관계없이 인식된 모든 텍스트 상자를 가려요.',
        '각 상자에 더 긴 변의 8%(최소 3픽셀)만큼 여백을 더한 뒤, 검은색으로 채우거나, 크기의 삼분의 일인 커널로 흐리게 하거나, 12개 블록으로 픽셀화해요.',
        '크기가 같은 새 JPG, PNG 또는 WebP를 만들고 몇 군데를 가렸는지 알려 줘요.',
      ],
      flowSteps: [
        {
          title: '이미지 업로드',
          description: '읽을 수 있는 텍스트가 있는 스크린샷, 스캔한 양식, 사진을 JPG, PNG 또는 WebP로 올리세요.',
        },
        {
          title: '개인정보만 또는 모든 텍스트 선택',
          description: '이 페이지에서는 텍스트 / 개인정보 가리기가 미리 선택되어 고정돼요. 기본 감지 모드는 개인정보만이에요.',
        },
        {
          title: '검은 상자, 흐림, 픽셀화 중 선택',
          description: '검은 상자가 기본값이며, 되돌릴 수 없는 유일한 방식이에요.',
        },
        {
          title: 'OCR 및 가리기 실행',
          description: 'EasyOCR이 이미지를 읽고, 일치하는 각 상자에 여백을 더해 덮은 뒤 결과를 저장해요.',
        },
        {
          title: '꼼꼼히 확인 후 다운로드',
          description: 'OCR이 읽지 못한 텍스트, 특히 작거나, 회전했거나, 손으로 쓴 텍스트가 없는지 확인하세요.',
        },
      ],
      advancedDetails: [
        '서버는 redact_text_pii.py를 --detect pii 또는 all-text, --redaction blackbox, blur 또는 pixelate, 그리고 --gpu 옵션으로 실행해요. 스크립트는 영어용 EasyOCR Reader(현재 전달되는 유일한 언어)를 만들고 파일에 readtext를 호출하며, 이 호출은 줄마다 상자, 텍스트, 신뢰도를 반환해요.',
        '개인정보 패턴은 정규 표현식이에요. 이메일(로컬 부분, @, 점이 있고 최상위 도메인이 2글자 이상인 도메인), 선택적인 +1, 괄호, 점, 공백, 대시가 들어갈 수 있는 10자리 북미 전화번호, 대시나 공백으로 구분된 세 자리, 두 자리, 네 자리 숫자, 공백이나 대시로 구분될 수 있는 13~19자리 숫자(카드 번호), 그리고 번지 뒤에 이름과 도로 유형 단어가 오는 주소예요. 사람 이름, 생년월일, 미국 외 식별 번호에 대한 패턴은 없어요.',
        '일치하는 각 상자는 모든 방향으로 max(3, 0.08 x 너비와 높이 중 큰 값) 픽셀만큼 넓어지고 이미지 경계 안으로 제한돼요. 검은 상자는 안쪽을 검게 채운 cv2.rectangle을 사용하고, 픽셀화는 영역을 가로 12개 블록으로 줄였다가 최근접 이웃 방식으로 다시 키우며, 흐림은 max(11, 긴 변 / 3)을 홀수로 맞춘 가우시안 커널을 사용해요.',
        'OCR은 깔끔한 가로 인쇄체를 가장 잘 읽어요. 손글씨, 장식용 글꼴, 아주 작은 텍스트, 심한 기울기, 낮은 대비는 신뢰도를 떨어뜨리고 아예 놓칠 수도 있어요. 모든 텍스트 모드라도 OCR이 보지 못한 줄은 가릴 수 없어요.',
        '출력은 OpenCV가 기록하고 변환기의 exiftool 메타데이터 복사는 AI 출력에서 건너뛰므로, 원본의 EXIF, GPS, 카메라 태그는 결과에 옮겨지지 않아요. 이 도구가 다루는 것은 메타데이터가 아니라 픽셀이에요.',
        '스크립트는 끝날 때 redactions=N을 출력해요. 가린 곳이 하나도 없다고 나오면 OCR이 일치하는 텍스트를 찾지 못했다는 뜻이지, 이미지가 깨끗하다는 뜻이 아니에요.',
      ],
      whyItMatters: [
        '고객 지원 티켓, 버그 리포트, 소셜 게시물에는 실제 고객이나 계정 데이터가 담긴 스크린샷이 흔히 들어 있어요.',
        '그리기 도구로 텍스트를 손수 가리면 줄을 빠뜨리고 결과도 고르지 않아요. 패턴 검색은 눈에 익어 지나친 세 번째 이메일까지 찾아내요.',
        '선명하게 하기, 대비 늘리기, 확대를 거쳐도 살아남는 가리기는 불투명한 사각형뿐이에요.',
      ],
      useCases: [
        {
          title: '버그 리포트와 고객 지원',
          description: '이메일, 전화번호, 카드 번호를 드러내지 않고 스크린샷을 공유하세요.',
        },
        {
          title: '스캔한 양식',
          description: '페이지를 전달하기 전에 식별 번호와 주소를 가리세요.',
        },
        {
          title: '채팅 스크린샷',
          description: '대화를 게시하기 전에 전화번호와 이메일을 지우세요.',
        },
        {
          title: '교육 자료',
          description: '실제 화면 캡처의 모든 텍스트를 가려 안전한 예시로 만드세요.',
        },
      ],
      workedExamples: [
        {
          title: '개인정보 모드로 처리한 1440 x 900 고객 지원 티켓 스크린샷',
          body: '입력: 이메일 주소 두 개, (555) 123-4567 형식으로 적힌 전화번호 한 개, 고객 이름이 있는 고객 기록을 보여 주는 1440 x 900, 400 KB PNG. 설정: 개인정보만, 검은 상자. EasyOCR은 약 40줄의 텍스트를 반환하고, 그중 세 줄이 이메일과 전화번호 패턴에 일치하며, 이름은 어디에도 일치하지 않아요. 세 상자 각각, 예를 들어 이메일의 경우 260 x 22 픽셀인 상자는 260의 8%인 약 21픽셀만큼 모든 방향으로 여백이 더해지고 검게 채워져 302 x 64 사각형이 돼요. 이름 패턴은 없으므로 이름은 그대로 보여요. 이름도 지워야 한다면 모든 텍스트로 바꾸세요. 출력은 1440 x 900 PNG이며, 작업은 몇 초가 걸리는데 대부분은 OCR 모델을 불러오고 페이지를 읽는 시간이에요.',
        },
        {
          title: '작성된 양식을 휴대폰으로 찍은 3024 x 4032 사진, 모든 텍스트 모드와 흐림',
          body: '입력: 인쇄된 양식을 찍은 3024 x 4032 픽셀, 2.1 MB의 JPEG 사진으로, 약간 기울어져 있어요. 설정: 모든 텍스트, 흐림. EasyOCR이 읽는 모든 줄이 가려져요. 600 x 40 픽셀인 입력란 값은 각 방향으로 48픽셀의 여백이 더해지고 201 px 커널(600 / 3을 홀수로 맞춤)로 흐려지며, 이 크기에서는 글자가 완전히 사라져요. 120 x 30인 라벨에는 최소 커널인 11 px가 쓰이는데, 그 크기에서는 글자 모양을 여전히 짐작할 수 있으니 민감한 내용에는 검은 상자를 고르세요. OCR이 읽지 못하는 손글씨 항목은 그대로 남으므로 눈으로 확인해야 해요. 출력은 3024 x 4032 JPG이며, 12메가픽셀 사진에 대한 OCR이 가장 느린 단계로 스크린샷보다 오래 걸려요.',
        },
      ],
      whenNotToUse: '완전히 가려야 하는 문서에서 이 도구를 유일한 안전장치로 쓰지 마세요. OCR은 최선을 다할 뿐 완벽하지 않고, 현재는 영어 인쇄체만 읽으며, 개인정보 패턴은 이름, 생년월일, 북미 외 지역의 식별 번호를 전혀 알지 못해요. 게시할 텍스트에는 흐림을 쓰지 마세요. 텍스트 흐림은 가장 쉽게 되돌려지는 가리기 방식이니 검은 상자를 쓰세요. 얼굴, 로고, 사진은 텍스트가 아니므로 건드리지 않아요. 그런 것은 얼굴 흐림 도구와 개체 제거 도구가 처리해요. 그리고 민감한 데이터가 픽셀이 아니라 파일 메타데이터에 있다면 EXIF 도구를 사용하세요.',
      whyMediaManipulator: [
        '다섯 가지 개인정보 패턴, 여백, 커널 크기를 모두 공개하므로 어떤 텍스트가 잡히고 어떻게 가려지는지 정확히 알 수 있어요.',
        'OCR과 가리기는 저희 자체 GPU의 로컬 프로세스에서 실행돼요. 고객 데이터로 가득한 스크린샷이 저희 하드웨어 밖으로 나가는 일은 없어요.',
        '텍스트 가리기는 AI 작업 한 번을 사용하며(기본값 기준 계정 없이 하루 3회, 무료 계정은 10회), 일일 일반 작업 횟수가 아니라 일일 AI 작업 횟수에서 차감되고, 실패한 작업은 횟수가 복구돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ],
      privacyNote: '텍스트 인식과 가리기는 저희 자체 GPU 서버에서 로컬 EasyOCR 및 OpenCV 프로세스로 실행돼요. 외부 OCR이나 AI 서비스는 이미지를 받지 않으며, 인식된 텍스트는 어떤 상자를 가릴지 정하는 데만 쓰이고 저장되지 않아요. 업로드는 uploads/<jobId>/에, 가린 이미지는 outputs/<jobId>/에 있으며, 둘 다 보관 대장에 등록되어 보관 기간이 끝나면 삭제돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 다른 모든 일반 이미지 업로드와 마찬가지로 파일은 같은 서버의 자동 콘텐츠 분석도 거치며, 여기서 로컬 비전 모델이 짧은 설명을 작성해요. 이 설명은 작업과 함께 보관되고 제삼자와 공유되지 않아요.',
      faq: [
        {
          question: '개인정보 모드는 어떤 개인 정보를 감지하나요?',
          answer: '다섯 가지 패턴과 일치하는 텍스트예요. 이메일 주소, 북미 전화번호, 3-2-4 자리 식별 번호, 13~19자리 카드 형식 숫자열, 그리고 Street, Avenue, Road 같은 단어로 끝나는 도로명 주소예요. 이름, 날짜, 미국 외 식별 번호는 일치시키지 않으니 그런 경우에는 모든 텍스트를 사용하세요.',
        },
        {
          question: '개인정보만 대신 모든 텍스트는 언제 써야 하나요?',
          answer: '무엇이 민감한지 미리 나열할 수 없을 때는 언제든지요. 양식, 표, 이름이 담긴 채팅 기록 같은 경우예요. 모든 텍스트는 OCR이 읽는 모든 줄을 가리므로, 남는 위험은 OCR이 읽지 못한 텍스트뿐이에요.',
        },
        {
          question: '영어 외의 언어도 읽나요?',
          answer: '현재는 아니에요. OCR 리더가 영어 전용으로 시작되므로 라틴 문자 텍스트는 어느 정도 읽지만 다른 문자는 놓치거나 잘못 읽을 수 있어요. 페이지가 영어가 아니라면 결과를 확인하세요.',
        },
        {
          question: '여기서는 검은 상자가 흐림이나 픽셀화보다 안전한가요?',
          answer: '네. 상자가 완전한 검은색으로 채워지므로 아무것도 남지 않아요. 흐림은 상자 크기의 삼분의 일인 커널(최소 11 px)을 쓰고, 픽셀화는 가로 12개 블록을 남겨요. 둘 다 짧은 텍스트는 짐작할 수 있게 남길 수 있어요. 게시할 것이라면 검은 상자를 고르세요.',
        },
        {
          question: '가리기를 하면 사진에 숨겨진 메타데이터도 지워지나요?',
          answer: '결과는 원본 태그를 복사하지 않고 OpenCV가 새로 기록하므로 EXIF와 GPS 데이터는 옮겨지지 않아요. 따로 편집하지 않는 파일에서 의도적으로, 확인하면서 태그를 지우려면 EXIF 메타데이터 도구를 사용하세요.',
        },
        {
          question: '왜 일부 텍스트가 그대로 보이나요?',
          answer: 'OCR이 읽지 못했거나(손글씨, 아주 작은 글자, 기울기, 낮은 대비), 개인정보 모드에서 패턴과 일치하지 않았기 때문이에요. 서버는 가린 상자 수를 알려 줘요. 가린 상자가 하나도 없다면 일치하는 것이 없었다는 뜻이지, 아무것도 없었다는 뜻이 아니에요.',
        },
        {
          question: '텍스트 가리기는 무료인가요? 그리고 무엇이 횟수에서 차감되나요?',
          answer: '네, 무료예요. AI 작업으로, 기본값 기준 계정 없이 하루 3회, 무료 계정은 10회이며, 각각 최대 200 MB와 1 GB 이미지까지 처리해요. 일일 AI 작업 횟수만 사용하고 일일 일반 작업 횟수는 전혀 사용하지 않아요. 최신 수치는 요금 페이지에 나와 있어요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '작업마다 일일 AI 작업 횟수에서 AI 작업 한 번을 사용해요. 요금제별 파일당 크기 제한은 양식에 표시돼요.',
        ],
      },
      related: [
        {
          label: '사진 속 얼굴 흐리게 처리',
          to: '/tools/blur-faces-in-photo',
          description: '같은 사진 속 사람들을 가리세요.',
        },
        {
          label: 'EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '숨겨진 위치 정보와 기기 데이터를 지우세요.',
        },
        {
          label: 'AI 문서 스캔',
          to: '/tools/ai-document-scan',
          description: '사진으로 찍은 페이지를 깔끔하고 검색 가능한 PDF로 바꾸세요.',
        },
        {
          label: '사진에서 개체 제거',
          to: '/tools/remove-object-from-photo',
          description: '텍스트가 아닌 로고, 번호판, 배지를 지우세요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '가린 스크린샷을 첨부하기 전에 용량을 줄이세요.',
        },
      ],
      embed: {
        title: '이미지 속 텍스트 가리기',
        description: '스크린샷이나 사진을 업로드하세요. 텍스트 / 개인정보 가리기가 이미 선택되어 고정되어 있어요. 개인 정보만 가릴지 모든 텍스트를 가릴지, 그리고 가리기 스타일을 고른 다음 변환하세요.',
      },
    },
    'remove-object-from-photo': {
      name: '사진에서 개체 제거',
      h1: '사진에서 개체 온라인 제거',
      tagline: '사진에 넣고 싶지 않은 대상 주위에 상자를 그리면 인페인팅 모델이 어울리는 배경으로 빈 곳을 채웁니다.',
      metaTitle: '사진에서 개체 온라인 제거 | Media Manipulator',
      metaDescription: '사진에서 원치 않는 개체를 지우세요. 사각형을 그리면 AI 인페인팅이 배경에 맞춰 빈 곳을 채웁니다. 자체 GPU에서 실행됩니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '사진에서 개체 온라인 제거',
      ogDescription: '원치 않는 개체 위에 상자를 그리면 AI 인페인팅이 어울리는 배경으로 빈 곳을 채워요.',
      intro: '사진을 업로드하고, 없애고 싶은 대상 위로 사각형을 하나 이상 끌어 그린 다음 변환하세요. 양식은 각 사각형을 이미지에 대한 비율(0과 1 사이의 왼쪽, 위쪽, 너비, 높이)로 보내고, 저희 API는 이를 마스크로 바꿔요. 마스크는 사진과 크기가 같은 회색조 PNG로, 사각형 안쪽은 흰색이고 나머지는 모두 검은색이에요. 그다음 Python 스크립트가 이미지와 마스크를 열고 저희 GPU에서 simple_lama_inpainting 패키지의 LaMa 인페인팅 모델을 실행하며, 이 모델이 주변 장면을 이용해 흰색 영역을 다시 그려요. 표시한 영역이 채워진 사진을 원래 크기 그대로, 선택한 형식으로 돌려받아요.',
      whatItDoes: [
        '미리보기 위에 그린 사각형을 하나 이상 받아 그 안에 있는 것을 지워요.',
        '정규화된 사각형 좌표로 서버에서 픽셀 단위까지 정확한 마스크를 만들므로, 마스크는 화면 크기에 영향을 받지 않아요.',
        '저희가 운영하는 GPU에서 LaMa 인페인팅을 실행해 마스크 영역을 배경이 이어지는 내용으로 채워요.',
        '양식에서 선택한 대로 JPG, PNG, WebP 또는 GIF의 원본 해상도 이미지를 돌려줘요.',
        '일일 AI 작업 횟수에서 AI 작업 한 번으로 집계돼요. 일반 변환은 이와 별개인 다른 횟수를 사용해요.',
      ],
      flowSteps: [
        {
          title: '사진 업로드',
          description: 'JPG, PNG 또는 WebP. 그리기 오버레이가 있는 미리보기가 나타나요.',
        },
        {
          title: '사각형 그리기',
          description: '개체마다 상자 하나씩, 개체보다 조금 크게 그리세요. 상자는 최소 하나 있어야 해요.',
        },
        {
          title: '마스크 생성 및 인페인팅',
          description: '서버가 같은 크기의 마스크 PNG를 기록한 다음, 이미지와 마스크로 remove_object_lama.py를 실행해요.',
        },
        {
          title: '다운로드 후 확인',
          description: '이미지를 사용하기 전에 채워진 영역을 확대해 이음매를 확인하세요.',
        },
      ],
      advancedDetails: [
        '처리기는 ai_tools.go의 RemoveObject예요. ImageMagick identify로 이미지 크기를 읽고, 서버 임시 디렉터리에 사각형을 회색조 PNG 마스크로 래스터화하고(안쪽은 흰색, 바깥은 검은색, 좌표는 정수 픽셀로 반올림하고 이미지 경계 안으로 제한), 스크립트를 실행한 뒤 마스크를 삭제해요.',
        'remove_object_lama.py는 Pillow로 이미지를 열어 RGB로 변환하고, 마스크를 회색조로 불러와 크기가 다르면 이미지 크기에 맞춘 다음, SimpleLama(image, mask)를 호출해 결과를 출력 경로에 저장해요. RGB 변환 때문에 투명 PNG 입력은 알파 채널을 잃어요.',
        '각 사각형은 서버에서 검증돼요. 너비와 높이가 양수여야 하고 상자가 두 축 모두 0에서 1 사이에 있어야 하며, 그렇지 않으면 작업이 시작되기 전에 거부되고 사용 횟수가 복구돼요.',
        'AI 경로는 ImageMagick 단계를 건너뛰므로 필터, 색조, 텍스트 오버레이, 품질, 크기 조절 설정이 적용되지 않고, exiftool 메타데이터 복사도 실행되지 않아요. 결과에는 원본의 EXIF가 없어요. Pillow는 선택한 형식의 기본 인코더 설정으로 파일을 저장해요.',
        'LaMa는 주변 맥락으로 채우므로 채우기 품질은 상자 주변에 무엇이 있는지에 달려 있어요. 하늘, 잔디, 모래, 물, 벽, 바닥은 자연스러운 결과를 내지만, 얼굴, 텍스트, 규칙적인 무늬를 가로지르는 상자는 모델이 알 수 없는 구조를 지어내게 만들어요.',
      ],
      whyItMatters: [
        '질감 있는 배경에 복제 도장으로 리터칭하려면 연습과 시간이 필요하지만, 사각형 하나 그리는 데는 두어 초면 충분해요.',
        '잘못 들어간 사람 한 명, 케이블, 표지판 하나가 쓸 만한 사진과 재촬영 사이를 가르는 유일한 요소일 때가 있어요.',
        '공유할 사진에 나오면 안 되는 집 번지, 번호판, 화면을 지우는 개인정보 보호 도구로도 쓸 수 있어요.',
      ],
      useCases: [
        {
          title: '여행 및 풍경',
          description: '깔끔한 풍경에서 관광객, 전선, 쓰레기통을 지우세요.',
        },
        {
          title: '제품 사진',
          description: '판매용 이미지에서 가격표, 거치대, 먼지 한 점을 지우세요.',
        },
        {
          title: '부동산',
          description: '프레임 가장자리의 자동차, 쓰레기통, 잡동사니를 치우세요.',
        },
        {
          title: '개인정보 보호',
          description: '번지, 차량 번호판, 화면에 보이는 모니터를 지우세요.',
        },
      ],
      workedExamples: [
        {
          title: '4000 x 3000 해변 사진에 사각형 하나',
          body: '입력: 물가에 사람이 있는 4000 x 3000, 5.2 MB JPEG. 가로 60%, 세로 40% 지점에서 시작해 너비 10%, 높이 15%인 상자를 그리고 출력은 JPG로 두세요. API는 이 비율에 이미지 크기를 곱해, (2400, 1200) 위치에 400 x 450 픽셀의 흰색 블록이 있는 4000 x 3000 마스크를 기록해요. LaMa가 GPU에서 이미지와 마스크에 대해 한 번 실행되고, 스크립트는 마스크된 180,000픽셀을 주변의 모래와 물로 채운 4000 x 3000 JPG를 저장해요. 12메가픽셀 이미지의 모델 처리는 GPU에서 몇 초면 끝나고, 수 메가바이트짜리 JPG를 기록하고 다운로드하는 시간도 전체에서 비슷한 비중을 차지해요.',
        },
        {
          title: '1920 x 1080 PNG 제품 사진에 사각형 두 개',
          body: '입력: 케이블과 가격 스티커가 있는 테이블 위 램프를 찍은 1920 x 1080, 2.3 MB PNG. 상자 두 개를 그리세요. 하나는 케이블 위(약 5% x 30%), 하나는 스티커 위(약 8% x 6%)예요. 둘 다 같은 1920 x 1080 마스크에 래스터화되므로 인페인팅 한 번으로 두 영역을 모두 처리해요. 채워진 영역에 JPEG 아티팩트가 생기지 않도록 출력은 PNG를 고르세요. 결과는 1920 x 1080 PNG이며, Pillow가 인페인팅 전에 입력을 RGB로 변환하므로 불투명한 RGB예요. 2메가픽셀에서는 GPU 처리가 빠르고, 실제 소요 시간의 대부분은 업로드와 PNG 기록이에요.',
        },
      ],
      whenNotToUse: '프레임의 큰 부분을 차지하거나, 얼굴 앞에 있거나, 읽을 수 있는 텍스트와 겹치거나, 벽돌, 타일, 키보드 같은 규칙적인 무늬를 끊는 개체에는 인페인팅을 쓰지 마세요. 모델이 구조를 지어내야 해서 결과가 번지거나 반복된 것처럼 보여요. 투명 PNG를 그대로 유지하고 싶을 때도 맞지 않는 도구예요. 스크립트가 입력을 RGB로 평탄화하기 때문이에요. 또 편집이 포렌식 관점에서 정직해야 할 때도 맞지 않아요. 채워진 영역은 생성된 콘텐츠이기 때문이에요. 배경 전체를 바꾸려면 배경 제거 도구를 쓰고, 얼굴을 가리기만 하면 된다면 얼굴 흐림 도구가 더 알맞아요.',
      whyMediaManipulator: [
        '마스크는 정확한 비율로 서버에서 만들어지므로, 휴대폰 미리보기에서 그린 것도 데스크톱에서와 같은 픽셀에 대응돼요.',
        '모델 이름(simple_lama_inpainting을 통한 LaMa)을 밝히고, 형식과 알파 채널 동작을 짐작에 맡기지 않고 문서로 정리해 두었어요.',
        '저희 자체 GPU에서 실행되며, 기본 도구는 계정이 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ],
      privacyNote: '사진은 저희 서버의 uploads/<jobId>/ 아래에 저장돼요. 사각형 마스크는 서버 임시 디렉터리에 임시 PNG로 기록되며 인페인팅 스크립트가 끝나는 즉시 삭제되고, 채워진 이미지는 outputs/<jobId>/로 가요. 사각형 좌표는 작업에 대한 보고가 가능하도록 작업 옵션에 보관돼요. LaMa는 같은 장비의 GPU에서 실행되며 이미지의 어떤 부분도 외부 제공업체로 가지 않아요. 이번 업로드를 포함한 모든 이미지 업로드는 저희 서버에서 로컬 비전 모델을 사용하는 자동 분석 단계로 한 번 요약되며, 그 요약은 작업과 함께 보관돼요. AI 작업은 메타데이터 복사를 건너뛰므로 출력에는 EXIF가 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      faq: [
        {
          question: '개체 제거는 무료인가요?',
          answer: '네, 일일 AI 작업 횟수 안에서는요. 제거할 때마다 AI 작업 한 번을 사용해요. 기본값 기준 비회원은 하루 3회, 무료 계정은 10회이며, 파일당 한도는 각각 200 MB와 1 GB예요. Premium과 Pro는 100회와 200회예요. 변환에 쓰는 일일 일반 작업 횟수는 별개이며 그대로 유지돼요. 현재 적용되는 수치는 /pricing에 나와 있어요.',
        },
        {
          question: '사각형은 얼마나 정확해야 하나요?',
          answer: '그렇게 정확할 필요는 없어요. 마스크는 그린 사각형을 정수 픽셀로 반올림한 것이므로, 개체와 그림자 주변의 배경을 조금 포함하세요. 여유 부분은 모델이 자연스럽게 섞어 줘요.',
        },
        {
          question: '여러 개체를 한 번에 지울 수 있나요?',
          answer: '네. 그린 모든 사각형이 같은 마스크에 칠해지고 한 번의 처리로 모두 채워져요. 사각형이 최소 하나는 있어야 하며, 없으면 작업이 거부돼요.',
        },
        {
          question: '채워진 영역이 흐릿하거나 반복돼 보이는 이유는 뭔가요?',
          answer: 'LaMa는 상자 주변 픽셀로 채워요. 섬세한 디테일이나 규칙적인 무늬 위에 상자를 그리면 모델이 추측할 수밖에 없어요. 상자를 더 꼭 맞게 그리거나, 개체를 하나씩 지우거나, 개체 뒤 배경이 더 단순한 사진을 고르세요.',
        },
        {
          question: '결과는 어떤 형식으로 나오나요?',
          answer: '양식에서 선택한 형식, 즉 JPG, PNG, WebP 또는 GIF예요. 인페인팅 전에 입력이 RGB로 변환되므로 투명도는 유지되지 않아요. PNG를 고르면 채워진 영역에 JPEG 아티팩트가 생기지 않아요.',
        },
        {
          question: '결과에 EXIF 데이터가 남나요?',
          answer: '아니요. AI 경로는 일반 변환기가 하는 exiftool 복사를 건너뛰고 Pillow가 새 파일을 기록하므로, 카메라, 날짜, GPS 태그가 옮겨지지 않아요.',
        },
        {
          question: '마스크나 사진이 다른 곳으로 전송되나요?',
          answer: '아니요. 마스크는 실행 후 삭제되는 저희 서버의 임시 파일이고, 인페인팅 모델은 저희 자체 GPU에서 실행돼요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '작업마다 일일 AI 작업 횟수에서 AI 작업 한 번을 사용해요. 요금제별 파일당 크기 제한은 양식에 표시돼요.',
        ],
      },
      related: [
        {
          label: '이미지 배경 제거',
          to: '/tools/remove-background-from-image',
          description: '한 영역을 메우는 대신 피사체를 통째로 잘라 내세요.',
        },
        {
          label: '사진 속 얼굴 흐리게 처리',
          to: '/tools/blur-faces-in-photo',
          description: '배경을 지어내지 않고 사람을 가리세요.',
        },
        {
          label: '이미지 속 텍스트 가리기',
          to: '/tools/redact-text-in-image',
          description: 'OCR이 찾을 수 있는 텍스트는 인페인팅 대신 검게 가리세요.',
        },
        {
          label: 'AI 이미지 복원',
          to: '/tools/ai-image-restoration',
          description: '수정한 부분 주변의 노이즈와 압축 흔적을 정리하세요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '완성된 사진을 공유하기 좋게 용량을 줄이세요.',
        },
      ],
      embed: {
        title: '사진에서 개체 제거',
        description: '사진을 업로드하세요. 개체 제거가 이미 선택되어 고정되어 있어요. 없애고 싶은 대상 위로 사각형을 하나 이상 그린 다음 변환하세요.',
      },
    },
    'clean-voice-audio': {
      name: '음성 오디오 정리',
      h1: 'AI로 음성 녹음 정리하기',
      tagline: '팟캐스트, 인터뷰, 음성 메모에서 쉭쉭거리는 소리, 방 울림, 낮은 웅웅거림을 줄여 말소리를 더 또렷하게 만드세요.',
      metaTitle: 'AI로 음성 녹음 정리하기 | Media Manipulator',
      metaDescription: 'AI로 음성 녹음을 정리하세요. 쉭쉭거리는 소리, 험 노이즈, 방 소음을 줄여 말소리를 더 잘 들리게 합니다. 자체 GPU에서 실행됩니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'AI로 음성 녹음 정리하기',
      ogDescription: '쉭쉭거리는 소리, 험 노이즈, 방 소음을 줄여 팟캐스트, 인터뷰, 음성 메모의 말소리를 더 또렷하게 만드세요.',
      intro: '울림이 심한 부엌에서 녹음한 휴대폰 음성 메모, 노트북 마이크로 참여한 팟캐스트 게스트, 강의실 뒤쪽에서 녹음한 강의처럼, 말은 담겨 있지만 쉭쉭거리는 소리와 방 소음에 묻혀 있는 경우가 있어요. 음성 정리는 녹음을 저희 GPU의 DeepFilterNet으로 처리한 다음, 고정된 방송용 마무리 체인을 거치게 해요. 이 체인은 웅웅거리는 저음을 잘라 내고, 고음역을 제한하고, 레벨을 일정한 라우드니스로 맞추고, 피크가 클리핑되지 않게 막아요. 음악이 아니라 말소리를 위해 만들어진 도구예요.',
      whatItDoes: [
        '업로드한 파일을 ffmpeg로 DeepFilterNet이 요구하는 입력인 48 kHz 모노로 변환하고, 그 WAV를 저희 GPU의 모델에 넘겨요.',
        'DeepFilterNet 음성 향상 네트워크로 말소리는 유지하면서 지속적인 배경 소리(쉭쉭거리는 소리, 팬 소음, 험 노이즈, 실내 잡음)를 억제해요.',
        '노이즈 제거 후 마무리 체인을 적용해요. 80 Hz 하이패스, 14 kHz 로우패스, -1.5 dBTP 트루 피크 상한을 둔 -16 LUFS 라우드니스 정규화, 0.95 리미터예요.',
        '결과를 원하는 형식으로 인코딩해요. 192 kbps의 MP3, AAC 또는 OGG, 128 kbps의 Opus, FLAC, 또는 16비트 WAV예요.',
        'AI 경로가 일반 ffmpeg 필터 파이프라인을 대신하므로 표준 비트레이트, EQ, 효과, 자르기 설정은 건너뛰어요.',
      ],
      flowSteps: [
        {
          title: '녹음 업로드',
          description: '음성 메모, 인터뷰 오디오, 팟캐스트 녹음, 강의 녹음을 MP3, WAV, FLAC, M4A, AAC, OGG 또는 Opus로 올리세요.',
        },
        {
          title: '음성 정리가 미리 설정됨',
          description: '이 페이지에서는 작업이 고정되어 있어요. 남은 선택은 출력 형식뿐이에요.',
        },
        {
          title: '정규화, 노이즈 제거, 마무리',
          description: 'ffmpeg가 48 kHz 모노 WAV를 만들고, DeepFilterNet이 노이즈를 제거하고, 마무리 필터가 음색과 라우드니스를 맞춰요.',
        },
        {
          title: '다운로드 후 들어 보기',
          description: '게시하기 전에 헤드폰으로 원본과 비교해 보세요.',
        },
      ],
      advancedDetails: [
        '마무리 체인은 정확히 highpass=f=80,lowpass=f=14000,loudnorm=I=-16:TP=-1.5:LRA=11,alimiter=limit=0.95이며, 노이즈를 제거한 WAV에 한 번 적용돼요. 하이패스는 마이크를 만지는 소리와 파열음의 쿵 소리를 없애고, 로우패스는 14 kHz 이상의 쉭쉭거리는 소리를 다스리며, loudnorm은 통합 라우드니스를 말소리 팟캐스트의 일반적인 목표치인 -16 LUFS로 맞춰요.',
        '모델이 단일 채널에서 실행되므로 출력은 항상 48 kHz 모노예요. 스테레오 인터뷰도 알아듣기에는 문제가 없지만 좌우 위치감은 사라져요. 스테레오가 필요하다면 이 도구는 맞지 않아요.',
        '인코더 설정은 출력 확장자에 따라 정해져요. MP3는 192 kbps의 libmp3lame, AAC나 M4A는 192 kbps의 aac, OGG는 192 kbps의 libvorbis, Opus는 128 kbps의 libopus, FLAC은 flac, WAV는 pcm_s16le예요. AI 경로에는 비트레이트 선택기가 없어요.',
        'AI 작업을 선택하면 자르기 구간과 일반 효과는 무시돼요. 변환기가 파일을 곧바로 모델로 보내고 결과를 돌려주기 때문이에요. 일부만 정리하고 싶다면 먼저 녹음을 잘라 두세요.',
        '음성 정리를 두 번 거치면 이미 -16 LUFS인 오디오를 다시 정규화하게 되고, 자음에 물기 어린 듯한 음질이 생길 수 있어요. 한 번만 실행하세요.',
        '모델은 겹치는 다른 목소리, 배경 음악, 갑작스러운 큰 소리에 약해요. 이런 소리는 "지속적인 배경"이 아니므로 대부분 그대로 남아요.',
      ],
      whyItMatters: [
        '듣기 피곤한 녹음은 내용이 들을 가치가 있더라도 청취자가 중간에 멈춰 버려요.',
        '-16 LUFS로 일정한 레벨이면 수동으로 게인을 조정하지 않아도 에피소드가 앞뒤 에피소드와 같은 음량으로 재생돼요.',
        '소음에서 끌어올린 말소리는 받아쓰기도 더 정확해지므로, 먼저 정리하면 자막 품질도 좋아져요.',
      ],
      useCases: [
        {
          title: '팟캐스트 및 인터뷰',
          description: '기본 마이크로 녹음된 원격 게스트의 소리를 정리하고 진행자와 같은 라우드니스로 맞추세요.',
        },
        {
          title: '음성 메모 및 받아쓰기',
          description: '휴대폰 녹음을 나중에 알아들을 수 있게, 헤드폰 없이도 들릴 만큼 크게 만드세요.',
        },
        {
          title: '강의 및 회의',
          description: '강의실 뒤쪽에서 녹음한 파일에서 에어컨 웅웅거림과 프로젝터 팬 소리를 낮추세요.',
        },
        {
          title: '동영상 내레이션',
          description: 'Darkroom 편집기에 넣기 전에 보이스오버를 다듬으세요.',
        },
      ],
      workedExamples: [
        {
          title: '12분짜리 휴대폰 메모(M4A, 128 kbps, 약 11 MB)를 MP3로',
          body: '128 kbps의 AAC 파일은 초당 16 KB이므로 720초면 약 11.5 MB예요. 십이 분은 비회원 길이 제한인 5분을 넘기 때문에 무료 계정(20분)이 필요해요. ffmpeg가 먼저 약 69 MB(초당 96,000바이트)의 48 kHz 모노 WAV를 임시 폴더에 기록하며, 이 폴더는 작업이 끝나면 삭제돼요. 그 파일에 DeepFilterNet과 마무리 체인이 실행되고, MP3 인코더가 192 kbps로 결과를 기록해요. 약 17 MB로, 192 kbps가 메모의 녹음 비트레이트보다 높아서 입력보다 커져요. ffmpeg 두 단계는 몇 초면 끝나고, 대부분의 시간은 DeepFilterNet 처리가 차지하며 녹음 길이에 따라 늘어나요.',
        },
        {
          title: '4분짜리 스테레오 WAV 인터뷰(44.1 kHz, 16비트, 약 42 MB)를 WAV로',
          body: '스테레오 16비트 44.1 kHz PCM은 초당 176,400바이트이므로 240초면 약 42 MB이고, 비회원 제한인 200 MB와 5분 안에 들어요. 모델이 실행되기 전에 파일은 모노로 합쳐지고 48 kHz로 리샘플링되며, 정리된 WAV는 16비트 모노 48 kHz로 돌아와요. 초당 96,000바이트, 약 23 MB예요. 입력보다 작은 이유는 채널이 두 개가 아니라 한 개이기 때문일 뿐이에요. 대신 FLAC을 고르면 같은 샘플을 손실 없이 더 작은 용량에 담고, MP3를 고르면 192 kbps에서 약 5.8 MB가 돼요.',
        },
      ],
      whenNotToUse: '음악, 노래, 또는 배경이 남기고 싶은 소리의 일부인 경우에는 이 도구를 쓰지 마세요. 모델은 말소리가 아닌 모든 것을 소음으로 취급하고, 마무리 체인이 80 Hz 미만과 14 kHz 초과를 잘라 내서 악기 소리가 텅 비게 돼요. 스테레오를 유지해야 할 때, 녹음이 클리핑되었거나 찌그러졌을 때(그런 손상은 소음이 아니라서 걸러 낼 수 없어요), 또는 레벨이나 음색은 전혀 바꾸지 않고 소음만 낮추고 싶을 때도 맞지 않아요. 마지막 경우에는 배경 소음 제거 페이지가 그 일을 해요.',
      whyMediaManipulator: [
        'DeepFilterNet과 마무리 체인은 저희가 운영하는 GPU에서 실행되며, 녹음이 외부 음성 향상 서비스로 전송되지 않아요.',
        '페이지가 열릴 때 음성 정리가 이미 선택되어 있고 작업 메뉴는 숨겨져 있으므로, 정할 것은 출력 형식뿐이에요.',
        '정리 작업 한 번은 AI 작업이 아니라 일일 일반 작업 횟수에서 일반 작업 한 번으로 집계되며(기본값 기준 비회원 5회, 무료 계정 30회), 실패한 작업은 횟수가 복구돼요.',
      ],
      privacyNote: '녹음은 작업 폴더에 저장되고, ffmpeg로 임시 디렉터리 안의 48 kHz 모노 WAV로 변환된 다음, 저희 자체 GPU의 DeepFilterNet으로 전달돼요. 이 임시 디렉터리는 정리된 파일의 인코딩이 끝나는 즉시 삭제돼요. 정리된 출력은 다운로드할 수 있도록 작업과 함께 남아 있어요. 오디오 업로드는 저희 서버의 자동 분석 과정도 거치며, 여기서 내부 콘텐츠 검토를 위해 Whisper로 녹음을 받아쓰고 그 결과를 작업과 함께 보관해요. 제삼자 AI 제공업체는 파일을 받지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      faq: [
        {
          question: '정리된 파일이 왜 모노로 나오나요?',
          answer: '파이프라인은 DeepFilterNet이 실행되기 전에 모든 입력을 48 kHz 단일 채널로 변환하고, 모델 출력을 그대로 인코딩해요. 그래서 스테레오 녹음도 모노로 돌아와요. 마이크 두 개로 녹음한 인터뷰에서 분리 상태를 유지해야 한다면 먼저 채널을 나눈 뒤 각각 따로 정리하세요.',
        },
        {
          question: '음성 정리는 라우드니스를 어느 수준으로 맞추나요?',
          answer: '마무리 체인은 통합 목표 -16 LUFS, 트루 피크 상한 -1.5 dBTP, 라우드니스 범위 11 LU로 ffmpeg loudnorm을 사용하고, 그 뒤에 0.95 리미터를 적용해요. 일반적인 말소리 콘텐츠 송출 목표치와 같으므로, 여기서 정리한 에피소드는 전문적으로 마스터링한 팟캐스트와 비슷한 레벨이 돼요.',
        },
        {
          question: '이 페이지에서 비트레이트를 정하거나 파일을 자를 수 있나요?',
          answer: '아니요. AI 작업이 활성화되면 변환기는 곧바로 모델로 보내고 비트레이트, EQ, 효과, 자르기 설정을 무시해요. 출력 비트레이트는 형식에 따라 고정돼요. MP3, AAC, OGG는 192 kbps, Opus는 128 kbps예요. 일부만 원한다면 먼저 다른 도구로 녹음을 자르세요.',
        },
        {
          question: '배경 소음 제거와 무엇이 다른가요?',
          answer: '둘 다 같은 DeepFilterNet 모델을 실행해요. 음성 정리는 그 뒤에 하이패스, 로우패스, 라우드니스 정규화, 리미터를 더하고, 배경 소음 제거는 노이즈를 제거한 신호에서 멈춰 레벨과 음색을 그대로 둬요. 완성된 말소리 파일이 필요하면 음성 정리를, 직접 믹싱이나 마스터링을 할 계획이라면 다른 페이지를 고르세요.',
        },
        {
          question: '클리핑되거나 찌그러진 녹음도 고칠 수 있나요?',
          answer: '아니요. 클리핑은 더해진 소음이 아니라 사라진 파형이라서 모델이 뺄 것이 없어요. 찌그러진 녹음 주변의 쉭쉭거리는 소리는 낮출 수 있지만, 큰 음절의 갈라지는 소리는 남아요.',
        },
        {
          question: '하루에 몇 개의 녹음을 정리할 수 있고, 무료인가요?',
          answer: '음성 정리는 의도적으로 일반 작업으로 집계되므로 일일 일반 작업 횟수에서 한 번을 사용해요. 기본값 기준 비회원은 하루 5회, 무료 계정은 30회, Premium은 300회, Pro는 700회이고, 파일 한도는 200 MB, 1 GB, 5 GB, 길이 한도는 5분, 20분, 2시간이에요. 현재 표는 /pricing에 있어요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '음성 정리는 일일 일반 작업 횟수를 사용해요. 길이 제한은 요금제에 따라 다르며 양식에 실시간으로 표시돼요.',
        ],
      },
      related: [
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: '라우드니스와 음색 마무리 없이 같은 노이즈 제거기를 사용해요.',
        },
        {
          label: '동영상 텍스트 변환',
          to: '/tools/transcribe-video',
          description: '정리된 말소리를 자막이나 텍스트로 바꾸세요.',
        },
        {
          label: '동영상에서 오디오 추출',
          to: '/tools/extract-audio-from-video',
          description: '정리하기 전에 동영상에서 음성 트랙을 뽑아내세요.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '다듬은 내레이션을 동영상 타임라인에 배치하세요.',
        },
        {
          label: '노래에서 보컬 제거',
          to: '/tools/remove-vocals-from-song',
          description: '말소리가 아니라 음악이라면 대신 가수의 목소리를 분리하세요.',
        },
      ],
      embed: {
        title: '음성 녹음 정리하기',
        description: '녹음을 업로드하세요. 음성 정리가 이미 적용되어 있어 설정할 작업 메뉴가 없어요. 기본값이 아닌 형식이 필요하면 출력 형식을 고른 다음 변환하세요.',
      },
    },
    'remove-background-noise': {
      name: '배경 소음 제거',
      h1: '오디오 배경 소음 온라인 제거',
      tagline: 'AI 노이즈 제거기로 녹음 속 쉭쉭거리는 소리, 험 노이즈, 교통 소음, 방 소음을 낮추고 주된 소리는 앞에 유지하세요.',
      metaTitle: '오디오 배경 소음 온라인 제거 | Media Manipulator',
      metaDescription: '오디오에서 배경 소음을 제거하세요. AI 노이즈 제거기가 녹음 속 쉭쉭거리는 소리, 험 노이즈, 주변 소리를 낮춥니다. 자체 GPU에서 실행됩니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '오디오 배경 소음 온라인 제거',
      ogDescription: '오디오 녹음 속 쉭쉭거리는 소리, 험 노이즈, 차량 소음, 방 소음을 낮추는 AI 노이즈 제거기예요.',
      intro: '에어컨, 컴퓨터 팬, 거리의 차량 소음, 전기 험 노이즈는 실제로 녹음하려던 소리 밑에 깔리는 지속적인 소리예요. 이 페이지는 파일을 저희 GPU에서 딥러닝 노이즈 제거기인 DeepFilterNet으로 처리하고, 다른 것은 전혀 바꾸지 않은 채 노이즈를 제거한 신호를 돌려줘요. 라우드니스 정규화도, 이퀄라이징도, 리미터도 없어요. 그래서 결과를 직접 믹싱하거나 마스터링할 계획이거나, 원본의 특성을 그대로 두고 싶을 때 알맞은 선택이에요.',
      whatItDoes: [
        '업로드한 파일을 ffmpeg로 48 kHz 모노로 리샘플링하고, 그 WAV를 저희 GPU의 DeepFilterNet 실행 파일에 넘겨요.',
        '정상 상태의 노이즈 플로어를 추정해 빼내어 쉭쉭거리는 소리, 험 노이즈, 팬, 공조 장치, 끊이지 않는 차량 소음을 낮춰요.',
        '모델의 원시 출력을 원하는 형식으로 인코딩해 돌려주며, 피크 레벨과 음색 균형은 모델이 만든 그대로예요. 이 페이지에는 후처리 단계가 없어요.',
        '작업 메뉴가 계속 보이므로 같은 양식에서 음성 정리나 보컬 도구로 바꿀 수 있어요.',
      ],
      flowSteps: [
        {
          title: '오디오 업로드',
          description: '동영상에서 추출한 트랙을 포함해 일반적인 오디오 파일이면 무엇이든 돼요.',
        },
        {
          title: '노이즈 제거가 미리 선택됨',
          description: '배경 소음 제거가 이미 선택되어 있어요. MP3가 아닌 형식을 원하면 출력 형식을 바꾸세요.',
        },
        {
          title: '저희 GPU에서 DeepFilterNet 실행',
          description: '모델이 지속적인 소음을 전경 소리와 분리하고 향상된 WAV를 기록해요.',
        },
        {
          title: '인코딩 후 다운로드',
          description: 'ffmpeg가 향상된 WAV를 선택한 형식으로 기록해요. 원본과 나란히 들어 보세요.',
        },
      ],
      advancedDetails: [
        'API에서 이 페이지와 음성 정리의 차이는 polish=false라는 플래그 하나뿐이에요. ffmpeg 인코딩 단계에 -af 필터가 전달되지 않으므로, 향상된 WAV가 DeepFilterNet이 기록한 그대로 인코딩돼요.',
        '입력 정규화는 ffmpeg -ac 1 -ar 48000이에요. 모델이 48 kHz 채널 하나에서 실행되므로, 입력의 채널 구성이나 샘플레이트와 관계없이 출력은 48 kHz 모노예요.',
        '인코더는 확장자에 따라 정해져요. MP3는 192 kbps의 libmp3lame, AAC는 192 kbps, OGG는 192 kbps의 libvorbis, Opus는 128 kbps의 libopus, FLAC은 무손실, WAV는 pcm_s16le예요. 추가로 편집할 계획이라면 손실 인코딩을 한 번만 거치도록 WAV나 FLAC을 고르세요.',
        '라우드니스 정규화가 실행되지 않으므로 조용한 녹음은 조용한 그대로예요. 노이즈 제거는 에너지를 덜어 내므로 결과 레벨이 입력보다 조금 낮을 수 있어요. 필요하면 나중에 편집기에서 게인을 올리세요.',
        'DeepFilterNet은 정상 상태이거나 천천히 변하는 노이즈로 학습되었어요. 키보드 클릭, 문 쾅 닫는 소리, 다른 화자, 배경 음악은 모델에게 신호처럼 보이므로 대부분 보존돼요.',
        '정규화된 WAV와 향상된 WAV를 담은 임시 디렉터리는 작업이 끝나면 삭제돼요. 인코딩된 출력만 작업과 함께 남아요.',
      ],
      whyItMatters: [
        '지속적인 소음은 작은 자음을 묻어 버리고, 청취자가 이유를 알아채기도 전에 지치게 만들어요.',
        '다시 녹음할 수 없는 경우가 많아요. 결혼식 축사, 강의, 더 이상 만날 수 없는 사람과의 인터뷰 같은 것들이죠.',
        '정규화나 리미팅을 거치지 않고 노이즈만 제거한 트랙은, 다시 되돌려야 하는 완성된 소리의 파일이 아니라 직접 믹싱하기 위한 깨끗한 출발점이 돼요.',
      ],
      useCases: [
        {
          title: '동영상에서 뽑아낸 오디오',
          description: '트랙을 추출해 카메라 팬 소리나 바람 소리를 없앤 다음, Darkroom에서 다시 영상 밑에 까세요.',
        },
        {
          title: '현장 녹음',
          description: '야외 인터뷰 밑에 깔린 도로나 발전기의 웅웅거림을 낮추세요.',
        },
        {
          title: '통화 및 회의 녹음 파일',
          description: '녹음된 통화를 공유하거나 받아쓰기 전에 회선의 쉭쉭거리는 소리를 줄이세요.',
        },
        {
          title: '디지털로 변환한 카세트테이프',
          description: '변환한 녹음의 레벨은 바꾸지 않고 테이프 히스 노이즈를 낮추세요.',
        },
      ],
      workedExamples: [
        {
          title: '128 kbps의 18분짜리 MP3 통화 녹음(약 17 MB)을 FLAC으로',
          body: '128 kbps에서 MP3는 초당 16 KB이므로 1,080초면 약 17 MB예요. 십팔 분은 무료 계정 제한인 20분 안이지만 비회원 제한인 5분을 넘으므로 먼저 로그인하세요. ffmpeg가 모델용으로 약 104 MB(초당 96,000바이트)의 48 kHz 모노 WAV를 기록하고, 이 WAV는 인코딩 후 폐기돼요. FLAC을 고르면 향상된 48 kHz 모노 샘플을 손실 없이 돌려받아요. FLAC이 104 MB WAV보다 얼마나 작아지는지는 무음과 쉭쉭거리는 소리가 얼마나 제거되었는지에 달려 있으며, 노이즈 제거 자체가 보통 FLAC 압축을 더 잘 되게 해요. 대신 MP3를 고르면 192 kbps에서 약 26 MB가 돼요.',
        },
        {
          title: '4분 30초짜리 스테레오 FLAC 현장 녹음(약 30 MB)을 WAV로',
          body: '사 분 반, 30 MB는 비회원 제한인 5분과 200 MB 안에 들므로 계정이 필요 없어요. 스테레오 파일은 모노로 합쳐지고 48 kHz로 리샘플링되며, DeepFilterNet이 깔려 있는 차량 소음을 낮추고, WAV 출력은 16비트 모노 48 kHz가 돼요. 270초 동안 초당 96,000바이트이므로 약 26 MB예요. 정규화가 적용되지 않으므로 레벨은 모델이 남긴 그대로이니, 원본이 조용했다면 편집기에서 올리세요. ffmpeg 변환 두 번은 각각 몇 초면 끝나고, GPU 처리 시간은 길이에 비례해요.',
        },
      ],
      whenNotToUse: '소음이 간헐적이거나 소음 자체가 목소리인 녹음에는 맞지 않는 도구예요. 겹치는 화자, 옆방의 텔레비전, 의자 끄는 소리, 키보드 두드리는 소리는 모델이 지속적인 소음용으로 만들어졌기 때문에 대부분 그대로 남아요. 완성된 음악에는 쓰지 마세요. 모델이 제거하는 "소음"이 공들여 담은 잔향과 공간감일 수 있어요. 파이프라인이 모노이므로 출력이 스테레오여야 한다면 맞지 않는 선택이에요. 그리고 표준 라우드니스로 바로 게시할 수 있는 말소리 파일이 필요하다면 음성 정리가 그런 마무리를 더해 줘요. 이 페이지는 의도적으로 그렇게 하지 않아요.',
      whyMediaManipulator: [
        '노이즈 제거기는 저희가 운영하는 GPU에서 실행되며, 오디오가 제삼자 소음 제거 서비스에 업로드되지 않아요.',
        '모델 뒤에 더해지는 것이 없어요. 라우드니스 변경도 EQ도 없으므로, 들리는 것은 오직 노이즈 제거의 결과뿐이에요.',
        '노이즈 제거 작업 한 번은 AI 작업이 아니라 일일 일반 작업 횟수에서 일반 작업 한 번으로 집계되며, 작업이 실패하면 횟수가 복구돼요.',
      ],
      privacyNote: '업로드한 파일은 작업 폴더에 기록되고, ffmpeg로 임시 디렉터리 안의 48 kHz 모노 WAV로 리샘플링된 다음, 저희 자체 GPU의 DeepFilterNet으로 노이즈가 제거돼요. 임시 디렉터리는 출력의 인코딩이 끝나면 삭제돼요. 인코딩된 결과는 다운로드할 수 있도록 작업과 함께 보관돼요. 다른 모든 오디오 업로드와 마찬가지로 저희 서버의 자동 분석 단계도 거치며, 여기서 내부 검토를 위해 Whisper로 받아쓰고 그 결과는 작업과 함께 남아요. 외부 AI 제공업체로는 아무것도 전송되지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      faq: [
        {
          question: 'DeepFilterNet이 잘 처리하는 소음과 그렇지 못한 소음은 무엇인가요?',
          answer: '지속적이고 천천히 변하는 소리예요. 쉭쉭거리는 소리, 전원 험 노이즈, 팬, 에어컨, 실내 잡음, 끊이지 않는 도로 소음이 그래요. 짧은 사건음과 말소리 같은 것(다른 사람, 텔레비전, 딸깍거리는 소리, 쾅 하는 소리)은 모델에게 전경 소리로 보이므로 대부분 남아요.',
        },
        {
          question: '녹음의 레벨이나 음색이 바뀌나요?',
          answer: '소음 에너지를 제거하는 데 따른 부수 효과로만 바뀌어요. 이 페이지에서는 정규화, EQ, 리미팅이 적용되지 않아요. 일정한 -16 LUFS 말소리 레벨과 하이패스, 로우패스 처리까지 원한다면 같은 모델에 그 마무리 체인을 더해 실행하는 음성 정리를 사용하세요.',
        },
        {
          question: '노이즈를 제거한 파일이 왜 모노인가요?',
          answer: '모델이 48 kHz 단일 채널을 받으므로 ffmpeg가 스테레오 입력을 먼저 모노로 합치고, 출력도 그대로 기록돼요. 채널마다 소음이 다른 스테레오 녹음을 스테레오로 유지해야 한다면 채널을 나눠 하나씩 노이즈를 제거하세요.',
        },
        {
          question: '동영상의 오디오에서 바로 노이즈를 제거할 수 있나요?',
          answer: '동영상 대신 오디오 트랙을 업로드하세요. 오디오 추출 도구로 추출하고, 여기서 노이즈를 제거한 다음, Darkroom에서 정리된 트랙과 동영상을 합치세요.',
        },
        {
          question: '추가 편집에는 어떤 출력 형식이 가장 좋나요?',
          answer: 'WAV(16비트 모노 48 kHz, 초당 96 KB) 또는 같은 샘플을 더 작은 용량에 담는 FLAC이에요. MP3, AAC, OGG는 192 kbps, Opus는 128 kbps로 기록되니, 손실 인코딩이 한 번만 일어나도록 최종 공유용으로만 고르세요.',
        },
        {
          question: '노이즈 제거는 일일 AI 작업 횟수에서 차감되나요?',
          answer: '아니요. 배경 소음 제거는 음성 정리와 마찬가지로 의도적으로 일반 작업으로 집계돼요. 기본값 기준 비회원은 하루 5회, 무료 계정은 30회, Premium은 300회, Pro는 700회예요. (보컬 분리나 보컬 제거는 달라요. 각각 AI 작업 한 번이에요.) 길이는 비회원 5분, 무료 계정 20분으로 제한되며, 현재 한도는 /pricing에 나와 있어요.',
        },
        {
          question: '녹음이 이미 꽤 깨끗하다면요?',
          answer: '모델은 그래도 실행되어 남아 있는 노이즈 플로어를 제거하지만, 귀로 느끼는 차이는 작을 것이고 손대지 않은 원본이 더 나을 수도 있어요. 무엇이든 바꾸기 전에 두 파일을 비교해 보세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '노이즈 제거는 일일 일반 작업 횟수를 사용해요. 길이 제한은 요금제에 따라 다르며 양식에 실시간으로 표시돼요.',
        ],
      },
      related: [
        {
          label: '음성 오디오 정리',
          to: '/tools/clean-voice-audio',
          description: '같은 노이즈 제거기에 말소리용 라우드니스와 음색 마무리를 더했어요.',
        },
        {
          label: '동영상에서 오디오 추출',
          to: '/tools/extract-audio-from-video',
          description: '먼저 동영상에서 오디오 트랙을 뽑아내세요.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '노이즈를 제거한 트랙을 다시 동영상 밑에 까세요.',
        },
        {
          label: '동영상 텍스트 변환',
          to: '/tools/transcribe-video',
          description: '더 깨끗해진 오디오를 받아써 자막을 만드세요.',
        },
        {
          label: '노래에서 보컬 제거',
          to: '/tools/remove-vocals-from-song',
          description: '다른 모델로 노래와 음악을 분리하세요.',
        },
      ],
      embed: {
        title: '배경 소음 제거',
        description: '녹음을 업로드하세요. 배경 소음 제거가 이미 선택되어 있어요. 출력 형식은 여전히 바꿀 수 있으니, 정한 다음 변환하세요.',
      },
    },
    'remove-vocals-from-song': {
      name: '노래에서 보컬 제거',
      h1: '노래에서 보컬 제거: 인스트루멘털 및 노래방 트랙 만들기',
      tagline: '트랙에서 노래를 빼고 음악만 남겨 노래방, 연습, 반주 트랙에 쓰세요. 사용 권한이 있는 음악에만 사용하세요.',
      metaTitle: '노래에서 보컬 제거: 노래방 메이커 | Media Manipulator',
      metaDescription: 'AI로 노래에서 보컬을 제거하고 인스트루멘털을 원본 파일과 같은 형식이나 FLAC, WAV로 내려받으세요. 노래방 및 연습용 트랙을 자체 GPU에서 만듭니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '노래에서 보컬 제거: 노래방 트랙 만들기',
      ogDescription: 'AI로 노래에서 보컬을 지우고 인스트루멘털을 MP3, FLAC 또는 WAV로 내려받으세요.',
      intro: '노래방 모임, 노래 연습, 커버 녹음에는 모두 가수 없는 반주가 필요해요. 이 페이지는 저희 GPU에서 Demucs(htdemucs 모델)를 두 스템 모드로 실행해 믹스를 "보컬"과 "나머지 전부"로 나누고, 나머지 전부에 해당하는 스템을 돌려줘요. 인스트루멘털은 기본적으로 원본 파일과 같은 형식으로 돌아오므로, 320 kbps MP3는 WAV로 부풀지 않고 320 kbps MP3 그대로 남아요. 편집용 무손실 파일이 필요하면 FLAC과 WAV를 고를 수 있어요.',
      whatItDoes: [
        'Demucs htdemucs를 --two-stems=vocals로 실행하므로, 모델은 리드 보컬과 반주라는 두 부분만 추정해요.',
        'no_vocals 스템은 남기고 보컬 스템은 버려요. 결과는 노래가 제거된 스테레오 파일 하나예요.',
        '업로드 시 "입력과 동일"을 구체적인 형식으로 정해요. MP3는 MP3로, AAC/M4A는 AAC/M4A로, OGG와 Opus는 그대로 남고, WAV, FLAC, AIFF, ALAC 입력은 FLAC으로 돌아와요.',
        'MP3와 AAC 스템은 다른 오디오 도구가 쓰는 192 kbps가 아니라 320 kbps로 기록하므로, 인코딩이 분리 결과 위에 귀에 들리는 손실을 더하지 않아요.',
        '시작하기 전에 파일 길이를 바탕으로 형식별 예상 출력 크기를 보여 줘요.',
      ],
      flowSteps: [
        {
          title: '노래 업로드',
          description: '소유하고 있거나 사용 권한이 있는 트랙을 MP3, WAV, FLAC, M4A, AAC, OGG 또는 Opus로 올리세요.',
        },
        {
          title: '보컬 제거가 미리 설정됨',
          description: '작업은 고정되어 있어요. "출력 형식"의 기본값은 입력과 동일이며, MP3, FLAC, WAV도 고를 수 있어요.',
        },
        {
          title: 'Demucs가 믹스를 분리',
          description: '모델이 저희 GPU에서 노래를 7초 단위 구간으로 처리하고 vocals.wav와 no_vocals.wav를 기록해요.',
        },
        {
          title: '인코딩 후 다운로드',
          description: 'no_vocals 스템이 결정된 형식으로 인코딩되어 다운로드할 수 있게 제공돼요.',
        },
      ],
      advancedDetails: [
        '정확한 실행 명령은 demucs -n htdemucs --two-stems=vocals --segment 7이에요. 구간 길이가 GPU 메모리 사용량을 제한하므로 긴 트랙도 그래픽 카드 한 장에서 실행할 수 있어요. Demucs는 입력의 샘플레이트나 채널 수와 관계없이 44.1 kHz 스테레오 스템을 기록하므로, 모노나 48 kHz 원본도 44.1 kHz 스테레오로 돌아와요.',
        '스템 인코딩은 MP3는 libmp3lame -b:a 320k, AAC나 M4A는 aac -b:a 320k예요. OGG는 192 kbps, Opus는 128 kbps를 유지하고, FLAC과 WAV는 무손실이에요. 다른 모든 AI 오디오 작업은 192 kbps를 쓰며, 320 kbps는 스템에만 적용되는 비트레이트예요.',
        '"입력과 동일" 규칙은 이래요. 손실 입력은 같은 컨테이너로, 무손실 입력은 FLAC으로 돌아오고, 동영상 파일이나 서버가 판단할 수 없는 파일은 320 kbps MP3로 돌아와요. .m4a는 AAC가 아니라 무손실 ALAC을 담고 있을 수 있으므로 결정하기 전에 ffprobe로 검사해요.',
        '이 규칙은 실제 작업 때문에 생겼어요. 87분, 68 MB짜리 MP3가 880 MB WAV로 돌아온 적이 있었어요. PCM은 손실 원본에 애초에 없던 충실도를 더해 주지 않으므로, 이제 기본값은 손실 오디오를 WAV로 키우지 않아요. 직접 WAV를 고르면 여전히 그대로 따라요.',
        '분리가 완벽한 경우는 없어요. 보컬의 잔향 꼬리, 백킹 화음, 모델이 "목소리 같다"고 듣는 소리(일부 신스 리드, 휘파람)는 인스트루멘털로 새어 들어갈 수 있고, 빽빽한 믹스는 여백이 잘 잡힌 최신 프로덕션보다 분리가 잘 안 돼요.',
        '44.1 kHz 스테레오 16비트 WAV는 초당 176,400바이트, 즉 분당 약 10.6 MB이므로, WAV를 고른 결과가 500 MB를 넘으면 양식이 경고해요.',
      ],
      whyItMatters: [
        '대부분의 노래에는 공식 인스트루멘털 버전이 없고, 라이선스를 받은 반주 트랙은 원곡 편곡이 아니라 다시 녹음한 경우가 많아요.',
        '가수는 MIDI로 흉내 낸 반주보다 실제 편곡에 맞춰 연습할 때 더 많은 것을 얻어요.',
        '입력 형식 그대로 스템을 돌려주면 휴대폰에 맞는 크기의 파일이 그 크기를 유지해요. 10 MB MP3가 실수로 50 MB 다운로드가 되어서는 안 되니까요.',
      ],
      useCases: [
        {
          title: '집에서 노래방',
          description: '이미 소유한 노래로 따라 부를 수 있는 버전을 만드세요.',
        },
        {
          title: '보컬 연습',
          description: '리드 가수의 목소리 없이 원곡 밴드 반주에 맞춰 내 파트를 연습하세요.',
        },
        {
          title: '커버 및 리믹스',
          description: '인스트루멘털을 내 보컬 녹음의 반주로 사용하세요.',
        },
        {
          title: '동영상 배경 음악',
          description: '사용 권한이 있는 음악에서 보컬 없는 반주를 뽑아 Darkroom 프로젝트에 쓰세요.',
        },
      ],
      workedExamples: [
        {
          title: '4분짜리 320 kbps MP3(약 9.6 MB), 입력과 동일 선택',
          body: '320 kbps에서 MP3는 초당 40 KB이므로 240초면 약 9.6 MB이고, 비회원 제한인 5분과 200 MB에 충분히 들어요. 입력이 MP3이므로 형식은 MP3로 정해져요. Demucs가 저희 GPU에서 노래를 7초 단위 창으로 처리해 약 42 MB의 44.1 kHz 스테레오 no_vocals.wav를 임시 폴더에 기록하고, ffmpeg가 이를 320 kbps의 libmp3lame으로 인코딩해요. 인스트루멘털도 다시 약 9.6 MB가 돼요. 임시 WAV는 삭제돼요. 실행 시간의 대부분은 분리 처리가 차지하며 트랙 길이에 따라 늘어나요.',
        },
        {
          title: '4분 50초짜리 CD 음질 WAV(약 51 MB), 기본 FLAC 또는 직접 WAV 선택',
          body: '44.1 kHz 스테레오 16비트 WAV는 초당 176,400바이트이므로 290초면 약 51 MB이고, 여전히 비회원 제한인 5분 안이에요. 입력이 무손실이므로 입력과 동일은 FLAC으로 정해져요. 양식은 FLAC을 PCM 크기의 약 55%인 약 28 MB로 예상하며, 실제 수치는 음악에 따라 달라요. 대신 WAV를 고르면 스템이 약 51 MB의 16비트 PCM으로, 입력과 같은 크기로 돌아오고, MP3를 고르면 320 kbps에서 약 11.6 MB가 돼요. 세 가지 모두 같은 no_vocals 스템에서 나오며, 인코더만 달라요.',
        },
      ],
      whenNotToUse: '소유하지 않았거나 라이선스가 없는 음악에는 사용하지 마세요. 결과를 어떻게 쓰는지는 사용자의 책임이에요. 밴드가 아니라 가수의 목소리를 원할 때(같은 양식의 보컬 분리 작업이 그 일을 해요), 드럼, 베이스, 기타 악기로 네 갈래 분리가 필요할 때(이 페이지는 보컬과 반주만 만들어요), 녹음이 노래가 아니라 말소리일 때(음성 정리와 배경 소음 제거 페이지가 더 잘 처리해요)에도 맞지 않는 도구예요. 아주 오래된 모노 녹음이나 보컬이 모든 마이크에 새어 들어간 라이브 해적판은 분리가 잘 안 되므로, 유령 같은 잔여음이 들릴 것을 예상하세요.',
      whyMediaManipulator: [
        '분리는 저희가 운영하는 GPU에서 Demucs htdemucs 모델로 실행되며, 음악이 외부 스템 서비스로 전송되지 않아요.',
        '출력은 기본적으로 원본 파일을 따르고, MP3나 AAC 스템은 320 kbps로 인코딩되며, FLAC이나 WAV는 클릭 한 번이면 고를 수 있어요.',
        '시작하기 전에 형식별 예상 크기가 표시되므로, 지나치게 큰 WAV는 뜻밖의 결과가 아니라 직접 고른 선택이 돼요.',
      ],
      privacyNote: '노래는 작업 폴더에 저장되고 저희 자체 GPU의 Demucs로 전달되며, Demucs는 보컬 스템과 반주 스템을 임시 디렉터리에 기록해요. 다운로드 파일로 인코딩되는 것은 반주뿐이고, 임시 디렉터리(버려진 보컬 스템 포함)는 작업이 끝나면 삭제돼요. 인코딩된 인스트루멘털은 작업과 함께 보관돼요. 오디오 업로드는 저희 서버의 자동 분석 단계도 거치며, 여기서 내부 검토를 위해 Whisper로 파일을 받아쓰고 그 결과를 작업과 함께 보관해요. 제삼자 AI 제공업체는 관여하지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      faq: [
        {
          question: '가수의 흔적이 전부 사라지나요?',
          answer: '리드 보컬은 대부분 사라지지만 전부 사라지는 경우는 드물어요. 잔향 꼬리, 더블링 보컬과 화음 보컬, 모델이 목소리 같다고 듣는 소리는 낮은 레벨로 남을 수 있어요. 최신 스테레오 프로덕션이 가장 잘 분리되고, 모노나 소리가 심하게 섞인 라이브 녹음이 가장 잘 안 돼요.',
        },
        {
          question: '인스트루멘털은 어떤 형식과 샘플레이트로 나오나요?',
          answer: 'Demucs가 44.1 kHz 스테레오 스템을 기록하므로 모든 출력이 그 샘플레이트예요. 컨테이너는 기본적으로 원본 파일을 따라요. MP3를 넣으면 320 kbps MP3가, AAC나 M4A를 넣으면 같은 형식의 320 kbps가, WAV, FLAC, AIFF, ALAC을 넣으면 FLAC이 나와요. 대신 MP3, FLAC, WAV를 직접 고를 수도 있어요.',
        },
        {
          question: '기본값이 더 이상 WAV가 아닌 이유는 뭔가요?',
          answer: '68 MB짜리 87분 MP3가 880 MB WAV로 돌아오곤 했는데, PCM은 손실 원본에 애초에 없던 디테일을 되살릴 수 없기 때문이에요. 이제 스템은 입력 형식을 유지하고, 손실 스템은 추가 인코딩이 귀에 들리지 않도록 320 kbps로 기록돼요. 원하면 WAV도 여전히 고를 수 있어요.',
        },
        {
          question: '반주 대신 보컬만 얻을 수 있나요?',
          answer: '네, 오디오 변환기의 작업 메뉴에서 보컬 분리를 선택하세요. 같은 Demucs 두 스템 실행에서 vocals.wav 스템을 남기고 반주를 버려요.',
        },
        {
          question: '오디오 파일 대신 뮤직비디오를 업로드할 수 있나요?',
          answer: '오디오를 업로드하세요. 먼저 동영상에서 트랙을 추출하면 돼요. 동영상 파일이 이 작업에 들어오면, 동영상 컨테이너는 오디오 형식이 아니므로 서버가 입력과 동일을 320 kbps MP3로 정해요.',
        },
        {
          question: '하루에 몇 곡까지 무료로 분리할 수 있나요?',
          answer: '노래 한 곡이 AI 작업 한 번이에요. 기본값 기준 계정 없이 하루 3회, 무료 계정은 10회, Premium은 100회, Pro는 200회예요. 일일 AI 작업 횟수는 따로 집계되므로, 노래를 분리해도 일일 일반 작업 횟수는 그대로예요. 노래 길이는 비회원 5분, 무료 계정 20분, 유료 요금제 2시간으로 제한돼요. 현재 표는 /pricing에 있어요.',
        },
        {
          question: '이렇게 노래방 트랙을 만드는 것이 합법인가요?',
          answer: '소유하고 있거나, 사용 권한이 있거나, 거주 지역의 예외 규정에 따라 사용할 수 있는 음악에 한해서만 그래요. 도구는 권리를 확인하지 않아요. 결과와 그 배포 방식은 사용자의 책임이에요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '보컬 제거는 일일 AI 작업 횟수를 사용해요. 횟수와 길이 제한은 요금제에 따라 다르며 양식에 실시간으로 표시돼요.',
        ],
      },
      related: [
        {
          label: '동영상에서 오디오 추출',
          to: '/tools/extract-audio-from-video',
          description: '분리하기 전에 뮤직비디오에서 오디오를 꺼내세요.',
        },
        {
          label: '음성 오디오 정리',
          to: '/tools/clean-voice-audio',
          description: '말소리 녹음에는 대신 음성 향상 모델을 사용하세요.',
        },
        {
          label: '배경 소음 제거',
          to: '/tools/remove-background-noise',
          description: '분리하지 않고 녹음 속 지속적인 소음을 낮추세요.',
        },
        {
          label: 'Darkroom',
          to: '/tools/content-studio',
          description: '인스트루멘털을 동영상 편집의 배경 음악으로 사용하세요.',
        },
        {
          label: '동영상 텍스트 변환',
          to: '/tools/transcribe-video',
          description: '원곡 믹스에서 가사를 텍스트로 받아 보세요.',
        },
      ],
      embed: {
        title: '노래에서 보컬 제거',
        description: '노래를 업로드하세요. 보컬 제거가 이미 선택되어 있고, 인스트루멘털은 원본 파일과 같은 형식으로 돌아와요(MP3는 MP3 그대로). 무손실이 필요하면 출력 형식에서 FLAC이나 WAV를 고르세요. 변환을 누르세요.',
      },
    },

    // 2026-10-31 (MM92): name + tagline for every remaining tool, so the /tools catalog
    // and the home grid never show an English card in this locale. Model-written; native review pending.
    'transcode-to-dash': {
      name: '동영상을 DASH(AV1 / VP9)로 변환',
      h1: '동영상을 DASH AV1 또는 VP9로 온라인 트랜스코딩하기',
      tagline: '어떤 동영상이든 manifest.mpd와 화질별 초기화/미디어 세그먼트가 담긴 MPEG-DASH 번들로 패키징해요.',
      metaTitle: '동영상을 DASH AV1/VP9로 온라인 트랜스코딩 | 무료 MPEG-DASH 도구',
      metaDescription: '무료 온라인 MPEG-DASH 트랜스코더입니다. MP4, MOV, WebM, MKV를 AV1 또는 VP9 동영상, 선택형 자막과 스토리보드를 갖춘 DASH 패키지로 변환하세요.',
      ogTitle: '동영상을 DASH AV1/VP9로 온라인 트랜스코딩하기',
      ogDescription: '어떤 동영상이든 브라우저에서 무료로 적응형 DASH 패키지(manifest.mpd + 렌디션별 초기화/미디어 세그먼트)를 만드세요.',
      intro: 'MPEG-DASH는 모든 최신 브라우저가 지원하는 개방형 적응형 스트리밍 표준이에요. Media Manipulator는 원본 동영상을 AV1(더 작은 파일, 새로운 웹 플레이어에 최적) 또는 VP9(더 넓은 재생 지원)를 사용해 DASH VOD 번들, 즉 manifest.mpd와 렌디션별 init.mp4 및 .m4s 세그먼트로 트랜스코딩해요. 압축을 푼 폴더를 아무 CDN이나 오리진에 올리고 클라이언트에 manifest.mpd를 제공하세요. 무료 등급에서는 360p, 480p, 720p를 쓸 수 있어요.',
      whatItDoes: [
        'ffprobe로 원본을 검사해 해상도, FPS, 길이, 코덱, 오디오 유무를 보여 줘요.',
        '어떤 화질 단계를 인코딩할지, AV1과 VP9 중 무엇으로 출력할지 고를 수 있어요.',
        '사용 가능한 가장 좋은 AV1 인코더를 자동으로 감지해요(av1_nvenc → libsvtav1 → libaom-av1).',
        '각 동영상 Representation과, 오디오가 있으면 AAC 오디오 Representation을 참조하는 MPEG-DASH manifest.mpd를 생성해요.',
        '선택하면 WebVTT 자막과 스토리보드 스크러버 썸네일을 생성해요.',
        '결과를 report.json, README와 함께 media-manipulator-dash-<codec>-<jobID>.tar.gz로 묶어요.',
        'tar 파일을 S3에 업로드하고 유효 기간이 짧은 사전 서명 GET URL을 돌려 드려요.',
      ],
      flowSteps: [
        {
          title: '업로드',
          description: 'S3 사전 서명 PUT으로 직접 업로드하므로 파일이 API 서버를 거치지 않아요.',
        },
        {
          title: '검사',
          description: 'ffprobe가 해상도, FPS, 오디오 유무, 코덱 메타데이터를 읽어요.',
        },
        {
          title: '화질 단계와 코덱 선택',
          description: 'AV1 또는 VP9을 고르고, 360p/480p/720p를 원하는 대로 조합하세요.',
        },
        {
          title: '인코딩',
          description: 'AV1(svtav1/libaom/nvenc) 또는 libvpx-vp9로 2초 세그먼트를 만들어요.',
        },
        {
          title: '패키징',
          description: 'manifest.mpd와 렌디션별 init/세그먼트를 report.json, README와 함께 tar.gz로 묶어요.',
        },
        {
          title: '다운로드',
          description: '30분 동안 유효한 S3 사전 서명 GET URL이에요.',
        },
      ],
      advancedDetails: [
        'AV1 인코더는 사용할 수 있으면 av1_nvenc(GPU)를 우선 선택하고, 없으면 libsvtav1, 그다음 libaom-av1로 대체해요.',
        'VP9은 row-mt, 프레임 병렬 디코딩, CRF와 비트레이트 가이드를 적용한 libvpx-vp9를 사용해요.',
        'DASH 변형은 -seg_duration 2 -use_template 1 -use_timeline 0 -single_file 0으로 생성돼요.',
        'manifest.mpd는 콘텐츠 유형마다(동영상, 그리고 오디오가 있으면 오디오) AdaptationSet을 하나씩 선언하며, codecs 속성은 "av01.0.08M.08" / "vp09.00.51.08" / "mp4a.40.2"예요.',
        '업스케일 없음: 원본 해상도보다 높은 단계는 툴팁과 함께 비활성화돼요.',
      ],
      whyItMatters: [
        'AV1은 같은 화질에서 보통 H.264보다 비트레이트가 절반으로 줄어요.',
        'DASH는 Apple 생태계 밖에서 가장 널리 쓰이는 적응형 스트리밍 형식이에요.',
        '미리 패키징한 VOD를 쓰면 스트리밍 플랫폼에서 요청마다 발생하는 트랜스코딩 비용을 피할 수 있어요.',
      ],
      useCases: [
        {
          title: '최신 웹 플레이어',
          description: 'Shaka Player와 dash.js는 manifest.mpd를 기본으로 읽어요.',
        },
        {
          title: '대역폭에 민감한 배포',
          description: 'AV1은 H.264 HLS 패키지의 거의 절반 크기예요.',
        },
        {
          title: '사내 미디어 라이브러리',
          description: 'SaaS 스트리밍 플랫폼에 비용을 내지 않고 적응형 동영상을 직접 호스팅하세요.',
        },
        {
          title: '화질 테스트',
          description: '같은 원본으로 만든 AV1과 VP9 인코딩을 나란히 A/B 비교하세요.',
        },
      ],
      whyMediaManipulator: [
        '저희 자체 서버에서 실행되므로 외부 트랜스코딩 업체가 동영상을 볼 일이 없어요.',
        '고화질 적응형 스트리밍의 미래가 AV1이기 때문에 기본으로 AV1이 선택돼요.',
        '개방형 패키지 형식: .tar.gz 압축을 풀고 manifest.mpd를 호스팅하기만 하면 돼요.',
      ],
      privacyNote: '동영상은 FFmpeg가 한 번 읽어 AV1 또는 VP9 렌디션으로 인코딩하고 매니페스트와 함께 DASH 세그먼트로 나누며, 이 모든 과정이 저희 서버에서 이루어져요. 작업은 외부 트랜스코딩 서비스가 아니라 저희 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어요.',
      faq: [
        {
          question: 'AV1과 VP9 중 무엇을 골라야 하나요?',
          answer: 'AV1은 같은 화질에서 더 작은 파일을 만들지만, CPU만 있는 호스트에서는 인코딩이 느려요. VP9은 재생 지원 범위가 더 넓고 인코딩이 빨라요. 기본값은 AV1이에요.',
        },
        {
          question: '서버에서 AV1을 사용할 수 없다고 나와요.',
          answer: 'AV1에는 FFmpeg에 av1_nvenc(NVIDIA GPU), libsvtav1, libaom-av1 중 하나가 필요해요. 설치된 환경에서 무엇을 쓸 수 있는지는 /api/video-transcode/capabilities에서 확인하세요.',
        },
        {
          question: '오디오는 항상 AAC인가요?',
          answer: '네. 최대 호환성을 위해 DASH 오디오 AdaptationSet은 현재 원본 코덱과 관계없이 128 kbps AAC LC로 출력돼요.',
        },
        {
          question: '이 매니페스트를 다른 출처(cross-origin)에서 제공할 수 있나요?',
          answer: '네. 다만 CDN이나 오리진에서 .mpd, init.mp4, .m4s 파일에 올바른 CORS 헤더를 설정해야 해요. tar 파일에는 그런 헤더가 포함되지 않아요.',
        },
        {
          question: '다운로드 URL은 얼마나 유효한가요?',
          answer: '사전 서명 GET URL은 기본적으로 30분 동안 유효해요. 새 링크가 필요하면 트랜스코딩을 다시 실행하세요.',
        },
      ],
      related: [
        {
          label: '동영상을 HLS로 트랜스코딩',
          to: '/tools/transcode-to-hls',
          description: '같은 업로드로 H.264 + AAC Apple HLS 패키지를 만들어요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '일반 FFmpeg 파이프라인으로 MP4를 줄이세요.',
        },
        {
          label: '동영상 텍스트 변환',
          to: '/tools/transcribe-video',
          description: '동영상의 음성을 검색 가능한 텍스트로 추출하세요.',
        },
      ],
      embed: {
        title: '동영상을 DASH(AV1 / VP9)로 트랜스코딩',
        description: 'MP4/MOV/WebM/MKV를 업로드하세요. 원본을 ffprobe로 분석하고, 무료 화질 단계(360p/480p/720p)를 고르게 한 다음, AV1(기본값) 또는 VP9 ffmpeg 인코딩을 실행해 manifest.mpd가 담긴 tar.gz로 묶어 드려요.',
      },
    },
    'convert-webp-to-jpg': {
      name: 'WebP를 JPG로 변환',
      h1: 'WebP를 JPG로 온라인 변환',
      tagline: 'WebP 이미지를 어떤 이미지 뷰어나 편집기에서도 열리는 호환성 좋은 JPG 파일로 바꿔요.',
      metaTitle: 'WebP를 JPG로 온라인 변환 (무료) | Media Manipulator',
      metaDescription: '무료 온라인 WebP JPG 변환기예요. .webp 이미지를 원하는 품질로, 어디서나 열리는 JPG 파일로 빠르게 바꿔요.',
      ogTitle: 'WebP를 JPG로 온라인 변환',
      ogDescription: '클릭 몇 번으로 WebP 이미지를 어디서나 열리는 JPG 파일로 바꿔요.',
      intro: 'WebP는 웹에 잘 맞는 형식이지만, 오래된 소프트웨어나 프레젠테이션 도구, 프린터는 이 형식을 읽지 못하는 경우가 많아요. Media Manipulator가 WebP를 다시 JPG로 변환해 드리므로 이미지를 어디서든 쓸 수 있어요. 원하는 품질만 고르면 나머지는 저희가 처리해요.',
      whatItDoes: [
        '모든 .webp 이미지(정지 이미지 또는 애니메이션의 프레임)를 표준 .jpg로 변환해요.',
        'JPG 품질을 고를 수 있어요. 품질이 높을수록 파일이 커져요.',
        '투명한 부분을 선택한 배경색 위에 합쳐요(JPG에는 알파 채널이 없어요).',
        '가능하면 색상 프로필을 유지해요.',
      ],
      flowSteps: [
        {
          title: 'WebP 업로드',
          description: '컴퓨터에서 .webp 파일을 끌어다 놓으세요.',
        },
        {
          title: 'JPG 품질 선택',
          description: '85가 무난한 기본값이에요. 파일을 더 작게 하려면 낮추세요.',
        },
        {
          title: 'JPG 인코딩',
          description: 'ImageMagick이 선택한 품질로 다시 인코딩해요.',
        },
        {
          title: 'JPG 다운로드',
          description: '어디서나 열리는 .jpg 파일로 저장하세요.',
        },
      ],
      advancedDetails: [
        '품질 85는 오래전부터 쓰여 온 균형점이에요. 약 92를 넘으면 눈에 띄는 개선은 거의 없이 파일 크기만 커지는 경우가 대부분이에요.',
        'JPG에는 투명도가 없어서 투명한 WebP는 배경 위에 합쳐져요. 투명도가 필요하면 대신 PNG로 변환하세요.',
        '무손실 이미지 변환이나 애니메이션 WebP에는 PNG(정지 이미지) 또는 애니메이션 GIF가 더 알맞아요.',
      ],
      whyItMatters: [
        '일부 오래된 브라우저, 이미지 편집기, 임베디드 소프트웨어는 여전히 WebP를 지원하지 않아요.',
        '많은 프린터, 사진 키오스크, 프레젠테이션 도구는 JPG나 PNG를 요구해요.',
        'JPG는 사진을 주고받을 때 쓰는 사실상의 표준 형식이에요.',
      ],
      useCases: [
        {
          title: '고객에게 사진 보내기',
          description: '받는 사람이 어떤 기기에서든 파일을 열 수 있게 해요.',
        },
        {
          title: '프레젠테이션에 넣기',
          description: 'PowerPoint/Keynote 슬라이드는 어디서나 JPG를 받지만, WebP는 될 때도 있고 안 될 때도 있어요.',
        },
        {
          title: '인쇄 및 사진 현상소',
          description: '대부분의 현상소는 JPG만 받아요.',
        },
        {
          title: '스톡 사진 제출',
          description: '많은 스톡 사이트가 JPG 업로드를 요구해요.',
        },
      ],
      whyMediaManipulator: [
        '워터마크도, 가입도 없고 가볍게 쓰기에는 무료예요.',
        '모두에게 똑같은 프리셋 대신 품질과 압축을 정밀하게 조절할 수 있어요.',
        '다른 도구들과 같은 개인정보 보호 및 보관 방식을 따라요.',
      ],
      privacyNote: 'WebP는 저희 서버에서 디코딩된 뒤 JPG로 다시 인코딩되며, JPG는 투명한 영역을 저장할 수 없으므로 그 부분은 배경 위에 합쳐져요. 외부 서비스로는 아무것도 전송되지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본은 절대 변경되지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: '투명도는 어떻게 되나요?',
          answer: 'JPG는 투명도를 지원하지 않아요. 투명한 WebP는 선택한 배경색 위에 합쳐져요. 투명도가 필요하면 대신 PNG로 변환하세요.',
        },
        {
          question: '품질은 얼마로 설정해야 하나요?',
          answer: '85가 균형 잡힌 기본값이에요. 화질이 가장 중요한 사진에는 90 이상, 썸네일이나 미리보기에는 70을 쓰세요.',
        },
        {
          question: '애니메이션 WebP에도 쓸 수 있나요?',
          answer: '첫 프레임만 JPG가 돼요. 애니메이션 WebP는 대신 애니메이션 GIF로 변환하세요.',
        },
        {
          question: '여러 파일을 한꺼번에 변환할 수 있나요?',
          answer: '무료 도구는 한 번에 파일 하나씩 처리해요. 지금은 WebP를 하나씩 변환해 주세요.',
        },
      ],
      related: [
        {
          label: 'WebP를 PNG로 변환',
          to: '/tools/convert-webp-to-png',
          description: '대신 무손실 PNG로 투명도를 유지하세요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: 'JPG, PNG, WebP, AVIF, GIF 간에 변환하세요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: 'JPG 파일 크기를 더 줄이세요.',
        },
        {
          label: '이미지에서 EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: 'JPG를 공유하기 전에 개인 메타데이터를 제거하세요.',
        },
        {
          label: '이미지 변환기 튜토리얼',
          to: '/tutorials/image/getting-started',
          description: '모든 이미지 옵션을 단계별로 안내해요.',
        },
      ],
      embed: {
        title: 'WebP를 JPG로 변환',
        description: 'WebP 이미지를 업로드하고 출력 형식으로 JPG를 고르세요. 품질 슬라이더를 조절해 파일 크기와 화질의 균형을 맞추세요. JPG는 투명도를 버리므로, 이미지 배경이 투명하다면 대신 PNG를 사용하세요.',
      },
    },
    'convert-png-to-jpg': {
      name: 'PNG를 JPG로 변환',
      h1: 'PNG를 JPG로 온라인 무료 변환',
      tagline: '용량이 큰 PNG 스크린샷과 그래픽을 어디서나 열리는 작은 JPG 사진으로 몇 초 만에 바꿔요.',
      metaTitle: 'PNG를 JPG로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 PNG JPG 변환기예요. .png 파일을 원하는 품질로, 더 작고 어디서나 열리는 JPG 이미지로 바꿔요. 가입이 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'PNG를 JPG로 온라인 무료 변환',
      ogDescription: 'PNG 이미지를 더 작고 어디서나 열리는 JPG 파일로 바꿔요. 무료이고 빠르며 가입이 필요 없어요.',
      intro: 'PNG는 무손실 형식이라 스크린샷과 그래픽에는 완벽하지만, 사진에는 필요 이상으로 훨씬 큰 경우가 많아요. PNG를 JPG로 변환하면 사진 콘텐츠는 눈에 보이는 차이 없이 파일을 5~10배 줄일 수 있어요. Media Manipulator는 PNG를 원하는 품질의 깔끔한 JPG로 변환해요. 무료이고, 온라인에서 바로 되고, 가입도 필요 없어요.',
      whatItDoes: [
        '모든 .png 이미지를 표준 .jpg(JPEG) 파일로 변환해요.',
        'JPG 품질을 골라 파일 크기와 충실도 사이의 균형을 맞출 수 있어요.',
        'JPG에는 알파 채널이 없으므로 투명한 부분을 단색 배경 위에 합쳐요.',
        '보이는 픽셀은 그대로이고, 파일만 PNG에서 JPG로 다시 인코딩돼요.',
      ],
      flowSteps: [
        {
          title: 'PNG 업로드',
          description: '.png 스크린샷, 그래픽, 사진을 끌어다 놓으세요.',
        },
        {
          title: 'JPG 품질 선택',
          description: '85가 균형 잡힌 기본값이에요. 파일을 더 작게 하려면 낮추세요.',
        },
        {
          title: 'JPG 인코딩',
          description: 'ImageMagick이 이미지를 JPEG로 다시 인코딩해요.',
        },
        {
          title: 'JPG 다운로드',
          description: '더 작고 어디서나 열리는 .jpg 파일로 저장하세요.',
        },
      ],
      advancedDetails: [
        '품질 85는 오래전부터 검증된 최적점이에요. 약 92를 넘으면 눈에 보이는 이득은 거의 없이 파일 크기만 늘어나요.',
        '사진 PNG는 JPG로 바꾸면 몇 메가바이트에서 몇백 킬로바이트로 줄어드는 경우가 많아요.',
        '윤곽이 선명한 그래픽이나 텍스트는 같은 크기라면 보통 JPG보다 PNG나 WebP가 더 깔끔해 보여요.',
        'PNG의 투명도를 유지하고 싶다면 대신 WebP로 변환하세요. JPG는 알파 채널을 저장할 수 없어요.',
      ],
      whyItMatters: [
        'JPG는 가장 널리 받아들여지는 사진 형식이에요. 모든 기기, 편집기, 업로드 양식이 지원해요.',
        '작은 JPG는 웹에서 더 빨리 로드되고 이메일과 양식의 업로드 한도를 넘지 않아요.',
        '많은 인쇄소, 마켓플레이스, 스톡 사이트는 JPG만 받아요.',
      ],
      useCases: [
        {
          title: '스크린샷 용량 줄이기',
          description: '무거운 PNG 스크린샷을 이메일이나 채팅용 가벼운 JPG로 바꾸세요.',
        },
        {
          title: '사진 업로드',
          description: '사진 PNG를 JPG로 변환해 사이트의 형식 요건을 맞추세요.',
        },
        {
          title: '인쇄 및 사진 현상소',
          description: '대부분의 현상소는 JPG를 요구해요. 주문하기 전에 변환하세요.',
        },
        {
          title: '더 빠른 웹 페이지',
          description: '큰 PNG 사진을 작은 JPG로 바꿔 페이지 용량을 줄이세요.',
        },
      ],
      whyMediaManipulator: [
        '출력이 실제로 JPG로 고정되어 있어 잘못 설정할 일이 없어요.',
        '모두에게 똑같은 프리셋 대신 품질을 정밀하게 조절할 수 있어요.',
      ],
      privacyNote: 'PNG는 저희 서버에서 설정한 품질의 JPG로 다시 인코딩되고, 투명한 부분은 단색 배경 위에 합쳐져요. 외부 서비스로는 아무것도 전송되지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본은 절대 변경되지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: 'PNG를 JPG로 무료로 변환하려면 어떻게 하나요?',
          answer: '위에서 .png를 업로드하고 JPG 품질을 고른 다음 변환을 클릭하세요. 표준 .jpg 파일로 다운로드돼요.',
        },
        {
          question: 'PNG를 JPG로 변환하면 화질이 떨어지나요?',
          answer: 'JPG는 손실 압축 형식이라 화질을 약간 양보하게 돼요. 품질 85~90에서는 사진의 경우 차이가 보이지 않아요. 선명한 텍스트가 있는 그래픽은 PNG를 유지하거나 WebP를 사용하세요.',
        },
        {
          question: 'PNG를 JPG로 변환하면 투명도는 어떻게 되나요?',
          answer: 'JPG는 투명도를 지원하지 않으므로 투명한 영역은 단색 배경 위에 합쳐져요. 투명도를 유지해야 한다면 대신 PNG를 WebP로 변환하세요.',
        },
        {
          question: 'PNG가 JPG보다 훨씬 큰 이유는 뭔가요?',
          answer: 'PNG는 무손실 형식이라 모든 픽셀을 정확하게 저장하기 때문에 사진에서는 용량이 커요. JPG는 지각 기반 압축을 사용하므로 사진 이미지는 눈에 띄는 변화가 거의 없이 크게 줄어들어요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'JPG에는 투명도가 없으므로 PNG의 투명한 영역은 단색 배경 위에 합쳐져요.',
        ],
      },
      related: [
        {
          label: 'JPG를 PNG로 변환',
          to: '/tools/convert-jpg-to-png',
          description: '반대로 변환해 투명도를 지원하는 PNG를 만드세요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: 'JPG, PNG, WebP, AVIF 등 여러 형식 간에 변환하세요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '형식을 바꾸지 않고 JPG를 더 줄이세요.',
        },
        {
          label: '이미지 변환기 튜토리얼',
          to: '/tutorials/image/getting-started',
          description: '모든 이미지 옵션을 자세히 살펴보세요.',
        },
      ],
      embed: {
        title: 'PNG를 JPG로 변환',
        description: 'PNG 이미지를 업로드하세요. 이 도구의 출력은 JPG로 고정되어 있으니 품질만 고르고 변환하면 돼요. JPG에는 알파 채널이 없으므로 투명한 영역은 단색 배경 위에 합쳐져요.',
      },
    },
    'convert-jpg-to-png': {
      name: 'JPG를 PNG로 변환',
      h1: 'JPG를 PNG로 온라인 무료 변환',
      tagline: 'JPG 사진을 편집, 투명 배경, 고품질 그래픽 작업에 알맞은 무손실 PNG 파일로 바꿔요.',
      metaTitle: 'JPG를 PNG로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 JPG PNG 변환기예요. .jpg 사진을 편집, 투명도, 그래픽 작업에 알맞은 무손실 PNG 파일로 바꿔요. 가입이 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'JPG를 PNG로 온라인 무료 변환',
      ogDescription: 'JPG 사진을 편집과 그래픽 작업용 무손실 PNG 파일로 바꿔요. 무료이고 빠르며 가입이 필요 없어요.',
      intro: 'PNG는 압축 아티팩트를 전혀 더하지 않는 무손실 형식이라, 이미지를 편집하거나 투명도를 추가하거나 그래픽을 겹치기 시작할 때 이상적이에요. JPG를 PNG로 변환하면 현재 픽셀이 그대로 고정되어 이후 편집으로 화질이 떨어지지 않아요. Media Manipulator는 JPG를 깔끔한 PNG로 온라인에서 무료로, 가입 없이 변환해요.',
      whatItDoes: [
        '모든 .jpg/.jpeg 이미지를 무손실 .png 파일로 변환해요.',
        '현재 픽셀을 정확히 보존하므로 반복해서 편집해도 아티팩트가 생기지 않아요.',
        '나중에 편집기에서 레이어를 쌓거나, 마스크를 씌우거나, 투명하게 만들 수 있는 PNG를 만들어요.',
        'JPG의 모든 픽셀이 정확히 유지되며, PNG는 추가 손실 없이 이를 저장해요.',
      ],
      flowSteps: [
        {
          title: 'JPG 업로드',
          description: '.jpg 또는 .jpeg 사진을 끌어다 놓으세요.',
        },
        {
          title: 'PNG로 변환',
          description: '이미지를 PNG로 손실 없이 다시 인코딩해요.',
        },
        {
          title: 'PNG 인코딩',
          description: 'ImageMagick이 표준 24/32비트 PNG를 작성해요.',
        },
        {
          title: 'PNG 다운로드',
          description: '편집할 준비가 된 무손실 .png로 저장하세요.',
        },
      ],
      advancedDetails: [
        'PNG는 무손실이라 변환된 파일은 보통 원본 JPG보다 커요. 이는 정상이에요.',
        'JPG를 PNG로 변환해도 JPG가 이미 버린 세부 묘사는 복구되지 않아요. 현재 픽셀을 손실 없이 고정할 뿐이에요.',
        'PNG는 알파 채널을 지원하므로, 결과물에 편집기에서 바로 투명도를 추가할 수 있어요.',
        '가장 작은 무손실 웹 파일이 필요하다면 WebP(무손실)가 PNG보다 작은 경우가 많아요.',
      ],
      whyItMatters: [
        '이미지를 반복해서 편집할 예정이라면 무손실 PNG가 알맞은 작업 형식이에요.',
        '디자인 도구, 앱 에셋, UI 작업에서는 선명한 윤곽과 투명도 지원 때문에 PNG를 기대해요.',
        'PNG를 쓰면 JPG를 계속 다시 저장할 때 생기는 세대 손실을 피할 수 있어요.',
      ],
      useCases: [
        {
          title: '편집 준비',
          description: '보정 전에 JPG를 PNG로 변환해 편집 내용이 손실 없이 유지되게 하세요.',
        },
        {
          title: '투명도 추가',
          description: '배경을 오려 낼 PNG 캔버스를 준비하세요.',
        },
        {
          title: 'UI 및 앱 에셋',
          description: '대부분의 디자인 시스템은 아이콘과 그래픽에 PNG를 기대해요.',
        },
        {
          title: '문서에 넣기',
          description: '파일 크기보다 선명한 텍스트와 선이 중요한 곳에 PNG를 쓰세요.',
        },
      ],
      whyMediaManipulator: [
        '출력이 실제로 PNG로 고정되어 있어 결과물은 항상 무손실이에요.',
        '자체 서버에서 실행되며, 이미지를 외부 업체가 처리하지 않아요.',
      ],
      privacyNote: 'JPG는 저희 서버에서 디코딩된 뒤 픽셀이 완전히 같은 무손실 PNG로 저장돼요. 외부 서비스로는 아무것도 전송되지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본은 절대 변경되지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: 'JPG를 PNG로 무료로 변환하려면 어떻게 하나요?',
          answer: '위에서 .jpg를 업로드하고 변환을 클릭하세요. 출력은 무손실 .png예요. 무료이고, 가입이 필요 없고, 브라우저에서 바로 쓸 수 있어요.',
        },
        {
          question: 'JPG를 PNG로 변환하면 화질이 좋아지나요?',
          answer: '아니요. 변환 자체는 무손실이지만 JPG가 이미 버린 세부 묘사는 복구할 수 없어요. 현재 픽셀을 고정해 이후 편집에서 아티팩트가 생기지 않게 할 뿐이에요.',
        },
        {
          question: 'PNG가 JPG보다 커지나요?',
          answer: '보통 그래요. PNG는 손실 압축 없이 모든 픽셀을 정확하게 저장하므로, 사진 PNG는 대개 같은 이미지의 JPG보다 커요.',
        },
        {
          question: 'PNG로 변환한 뒤 투명도를 추가할 수 있나요?',
          answer: '네. PNG는 알파 채널을 지원하므로 PNG로 만든 뒤에는 어떤 이미지 편집기에서든 배경을 지우거나 오려 낼 수 있어요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'PNG는 무손실이라 출력물은 보통 원본 JPG보다 커요.',
        ],
      },
      related: [
        {
          label: 'PNG를 JPG로 변환',
          to: '/tools/convert-png-to-jpg',
          description: '반대로 변환해 PNG를 JPG로 줄이세요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: 'JPG, PNG, WebP, AVIF 등 여러 형식 간에 변환하세요.',
        },
        {
          label: '이미지 배경 제거',
          to: '/tools/remove-background-from-image',
          description: '투명 PNG 누끼 이미지를 자동으로 만드세요.',
        },
        {
          label: '이미지 변환기 튜토리얼',
          to: '/tutorials/image/getting-started',
          description: '모든 이미지 옵션을 자세히 살펴보세요.',
        },
      ],
      embed: {
        title: 'JPG를 PNG로 변환',
        description: 'JPG 이미지를 업로드하세요. 이 도구의 출력은 PNG로 고정되어 있어, 편집하거나 투명 캔버스에 겹칠 준비가 된 무손실 파일을 받을 수 있어요.',
      },
    },
    'convert-webp-to-png': {
      name: 'WebP를 PNG로 변환',
      h1: 'WebP를 PNG로 온라인 무료 변환',
      tagline: 'WebP 이미지를 어디서나 열리고 투명도도 그대로 유지되는 무손실 PNG 파일로 바꿔요.',
      metaTitle: 'WebP를 PNG로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 WebP PNG 변환기예요. .webp 이미지를 투명도가 유지되고 어떤 편집기에서든 열리는 무손실 PNG 파일로 바꿔요. 가입이 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'WebP를 PNG로 온라인 무료 변환',
      ogDescription: 'WebP 이미지를 투명도가 유지되는 무손실 PNG 파일로 바꿔요. 무료이고 빠르며 가입이 필요 없어요.',
      intro: 'WebP는 웹에 잘 맞지만, 많은 편집기와 오래된 소프트웨어, 디자인 도구는 여전히 PNG를 기대해요. 게다가 PNG는 JPG와 달리 투명도를 온전히 유지해요. Media Manipulator는 WebP를 깔끔한 무손실 PNG로 변환해, 어디서나 열리고 알파 채널도 그대로 남게 해요.',
      whatItDoes: [
        '모든 .webp 이미지를 무손실 .png 파일로 변환해요.',
        '알파 채널을 보존하므로 투명한 WebP는 투명한 그대로 남아요.',
        '어떤 편집기, 뷰어, 디자인 도구에서든 열리는 PNG를 만들어요.',
        '그림은 바뀌지 않아요. WebP 압축이 무손실 PNG 저장 방식으로 바뀔 뿐이에요.',
      ],
      flowSteps: [
        {
          title: 'WebP 업로드',
          description: '투명하든 아니든 .webp 파일을 끌어다 놓으세요.',
        },
        {
          title: 'PNG로 변환',
          description: 'WebP를 디코딩한 뒤 PNG로 다시 인코딩해요.',
        },
        {
          title: 'PNG 인코딩',
          description: 'ImageMagick이 무손실 24/32비트 PNG를 작성해요.',
        },
        {
          title: 'PNG 다운로드',
          description: '투명도가 유지된 .png 파일로 저장하세요.',
        },
      ],
      advancedDetails: [
        '원본 WebP의 투명도는 PNG 알파 채널로 보존돼요.',
        '애니메이션 WebP는 첫 프레임만 정지 PNG가 돼요. 애니메이션이 필요하면 대신 GIF로 변환하세요.',
        'PNG는 무손실이라 출력물은 보통 원본 WebP보다 커요. 어디서나 열리는 호환성과 무손실 저장의 대가예요.',
      ],
      whyItMatters: [
        '일부 편집기, 프레젠테이션 도구, 오래된 소프트웨어는 여전히 WebP를 열지 못해요.',
        'PNG는 JPG와 달리 투명도를 유지해요. 로고와 누끼 이미지에서 중요한 점이에요.',
        'PNG는 그래픽 작업을 위한 안전한 무손실 교환 형식이에요.',
      ],
      useCases: [
        {
          title: '편집기에서 WebP 열기',
          description: 'WebP를 지원하지 않는 편집기에서도 열 수 있게 PNG로 변환하세요.',
        },
        {
          title: '투명도 유지',
          description: '투명한 WebP 로고를 투명 PNG로 보존하세요.',
        },
        {
          title: '디자인 인계',
          description: 'PNG 에셋을 기대하는 도구나 팀원에게 PNG를 넘기세요.',
        },
        {
          title: '프레젠테이션',
          description: 'WebP를 받지 않는 슬라이드 소프트웨어에 PNG를 넣으세요.',
        },
      ],
      whyMediaManipulator: [
        '출력이 PNG로 고정되어 있고 투명도는 자동으로 보존돼요.',
        '자체 서버에서 실행되며, 이미지를 외부 업체가 처리하지 않아요.',
      ],
      privacyNote: 'WebP는 저희 서버에서 디코딩된 뒤 투명도를 유지한 채 무손실 PNG로 저장돼요. 외부 서비스로는 아무것도 전송되지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본은 절대 변경되지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: 'WebP를 PNG로 무료로 변환하려면 어떻게 하나요?',
          answer: '위에서 .webp를 업로드하고 변환을 클릭하세요. 투명도가 유지된 무손실 .png로 다운로드돼요. 무료이고 가입이 필요 없어요.',
        },
        {
          question: 'WebP를 PNG로 바꾸면 투명도가 유지되나요?',
          answer: '네. WebP의 배경이 투명하다면 결과 PNG도 그 알파 채널을 그대로 유지해요.',
        },
        {
          question: 'WebP를 JPG가 아니라 PNG로 변환하는 이유는 뭔가요?',
          answer: 'PNG는 무손실이고 투명도를 보존하지만, JPG는 투명한 부분을 배경 위에 합치고 압축을 더해요. 투명도나 무손실 그래픽이 필요하면 PNG를, 가장 작은 사진 파일이 필요하면 JPG를 고르세요.',
        },
        {
          question: '애니메이션 WebP도 변환할 수 있나요?',
          answer: '첫 프레임만 PNG가 돼요. 애니메이션이 필요하면 대신 WebP를 애니메이션 GIF로 변환하세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '투명도는 보존돼요. 애니메이션 WebP는 첫 프레임만 변환돼요.',
        ],
      },
      related: [
        {
          label: 'PNG를 WebP로 변환',
          to: '/tools/convert-png-to-webp',
          description: '반대로 변환해 PNG를 WebP로 줄이세요.',
        },
        {
          label: 'WebP를 JPG로 변환',
          to: '/tools/convert-webp-to-jpg',
          description: '대신 WebP를 작은 JPG로 변환하세요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: 'JPG, PNG, WebP, AVIF 등 여러 형식 간에 변환하세요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '형식 변환의 번거로움 없이 이미지를 줄이세요.',
        },
      ],
      embed: {
        title: 'WebP를 PNG로 변환',
        description: 'WebP 이미지를 업로드하세요. 이 도구의 출력은 PNG로 고정되어 있어 투명도가 보존되고, 파일은 어떤 이미지 편집기나 뷰어에서든 열려요.',
      },
    },
    'convert-png-to-webp': {
      name: 'PNG를 WebP로 변환',
      h1: 'PNG를 WebP로 온라인 무료 변환',
      tagline: 'PNG 그래픽을 웹에서 더 빠르게 로드되는 최신 WebP 파일로 줄여요. 투명도는 그대로 유지돼요.',
      metaTitle: 'PNG를 WebP로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 PNG WebP 변환기예요. .png 파일을 투명도는 유지한 채 더 작은 WebP 이미지로 줄여 웹사이트를 더 빠르게 만드세요. 가입이 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'PNG를 WebP로 온라인 무료 변환',
      ogDescription: 'PNG 그래픽을 투명도가 유지되는 더 작은 WebP 파일로 줄여 웹사이트를 더 빠르게 만드세요. 무료이고 가입이 필요 없어요.',
      intro: 'WebP는 최신 웹 이미지 형식이에요. 투명도를 유지하면서 PNG보다 훨씬 작은 파일을 만들어 주므로 페이지가 빨라지고 Core Web Vitals 점수도 좋아져요. Media Manipulator는 PNG를 원하는 품질의 WebP로 변환해요. 무료이고, 온라인에서 바로 되고, 투명도는 그대로 유지되며, 가입도 필요 없어요.',
      whatItDoes: [
        '모든 .png 이미지를 최신 .webp 파일로 변환해요.',
        '알파 채널을 보존하므로 투명한 PNG는 투명한 그대로 남아요.',
        '품질을 골라 파일 크기와 충실도 사이의 균형을 맞출 수 있어요.',
        '보통 원본 PNG보다 25~80% 작은 파일을 만들어요.',
      ],
      flowSteps: [
        {
          title: 'PNG 업로드',
          description: '.png 그래픽, 아이콘, 스크린샷을 끌어다 놓으세요.',
        },
        {
          title: 'WebP 품질 선택',
          description: '웹용으로는 80~85가 훌륭한 기본값이에요.',
        },
        {
          title: 'WebP 인코딩',
          description: 'ImageMagick이 이미지를 WebP로 다시 인코딩해요.',
        },
        {
          title: 'WebP 다운로드',
          description: '투명도가 유지된 더 작은 .webp 파일로 저장하세요.',
        },
      ],
      advancedDetails: [
        'WebP는 손실 방식과 무손실 방식을 모두 지원해요. 품질 약 80에서는 보통 PNG보다 파일 크기가 크게 작으면서도 시각적으로 깔끔하게 유지돼요.',
        '투명도가 보존되므로 로고와 UI 에셋의 알파 채널이 그대로 남아요.',
        'WebP는 모든 최신 브라우저에서 지원돼요. 페이지를 더 빨리 로드하려면 WebP를 그대로 제공하세요.',
        '아주 오래된 소프트웨어와의 호환성을 최대한 확보하려면 PNG 대체 파일을 함께 두세요.',
      ],
      whyItMatters: [
        '이미지를 줄이는 것이 페이지 로딩 속도와 SEO를 개선하는 가장 큰 단일 수단이에요.',
        'WebP는 투명도를 유지하므로 JPG처럼 용량을 위해 알파 채널을 포기할 필요가 없어요.',
        'Google의 Core Web Vitals는 가벼운 페이지에 더 좋은 점수를 줘요. WebP가 여기에 직접 도움이 돼요.',
      ],
      useCases: [
        {
          title: '더 빠른 웹사이트',
          description: '무거운 PNG 에셋을 WebP로 바꿔 페이지 용량을 줄이세요.',
        },
        {
          title: '투명한 로고',
          description: '알파 채널은 유지한 채 투명 PNG 로고의 용량을 줄이세요.',
        },
        {
          title: '앱 및 UI 에셋',
          description: '선명함을 잃지 않고 더 가벼운 그래픽을 배포하세요.',
        },
        {
          title: '이미지가 많은 갤러리',
          description: '여러 PNG를 WebP로 변환해 갤러리를 더 빠릿하게 만드세요.',
        },
      ],
      whyMediaManipulator: [
        '출력이 WebP로 고정되어 있고 투명도가 보존돼요.',
        '품질을 정밀하게 조절할 수 있어 크기와 충실도 사이의 균형을 직접 정할 수 있어요.',
      ],
      privacyNote: 'PNG는 저희 서버에서 선택한 품질의 WebP로, 투명도를 유지한 채 다시 인코딩돼요. 외부 서비스로는 아무것도 전송되지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본은 절대 변경되지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: 'PNG를 WebP로 무료로 변환하려면 어떻게 하나요?',
          answer: '위에서 .png를 업로드하고 품질을 고른 다음 변환을 클릭하세요. .webp 파일로 다운로드돼요. 무료이고 가입이 필요 없어요.',
        },
        {
          question: 'PNG를 WebP로 바꾸면 투명도가 유지되나요?',
          answer: '네. WebP는 알파 채널을 지원하므로 투명한 PNG는 변환 후에도 투명해요.',
        },
        {
          question: 'WebP는 얼마나 작아지나요?',
          answer: '이미지에 따라 다르지만, 시각적으로 비슷한 품질에서 WebP는 보통 원본 PNG보다 25~80% 작아요.',
        },
        {
          question: 'WebP는 어디서나 지원되나요?',
          answer: '모든 최신 브라우저가 WebP를 지원해요. 일부 오래되거나 특수한 프로그램은 지원하지 않으니, 그런 프로그램을 지원해야 한다면 PNG 대체 파일을 함께 두세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'WebP 출력에서도 투명도가 보존돼요.',
        ],
      },
      related: [
        {
          label: 'WebP를 PNG로 변환',
          to: '/tools/convert-webp-to-png',
          description: '반대로 무손실 PNG로 되돌리세요.',
        },
        {
          label: 'JPG를 WebP로 변환',
          to: '/tools/convert-jpg-to-webp',
          description: 'JPG 사진을 웹용 WebP로 줄이세요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '형식을 바꾸지 않고 이미지를 더 줄이세요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: 'JPG, PNG, WebP, AVIF, GIF 간에 변환하세요.',
        },
        {
          label: '이미지 변환기 튜토리얼',
          to: '/tutorials/image/getting-started',
          description: '모든 이미지 옵션을 자세히 살펴보세요.',
        },
      ],
      embed: {
        title: 'PNG를 WebP로 변환',
        description: 'PNG 이미지를 업로드하세요. 이 도구의 출력은 WebP로 고정되어 있으니 품질을 고르고 변환하면 돼요. 투명도는 보존되며, WebP 파일은 보통 PNG보다 훨씬 작아요.',
      },
    },
    'convert-jpg-to-webp': {
      name: 'JPG를 WebP로 변환',
      h1: 'JPG를 WebP로 온라인 무료 변환',
      tagline: 'JPG 사진을 같은 화질로 웹에서 더 빠르게 로드되는 최신 WebP 파일로 줄여요.',
      metaTitle: 'JPG를 WebP로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 JPG WebP 변환기예요. .jpg 사진을 원하는 품질의 더 작은 WebP 이미지로 줄여 웹사이트를 더 빠르게 만드세요. 가입이 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'JPG를 WebP로 온라인 무료 변환',
      ogDescription: 'JPG 사진을 같은 시각적 화질의 더 작은 WebP 파일로 줄여 웹사이트를 더 빠르게 만드세요. 무료이고 가입이 필요 없어요.',
      intro: 'WebP는 JPG와 같은 화질을 눈에 띄게 작은 파일로 제공하기 때문에 빠른 웹사이트의 기본 이미지 형식이 되었어요. Media Manipulator는 JPG를 원하는 품질의 WebP로 변환하므로, 사진은 똑같아 보이면서 더 빨리 로드돼요.',
      whatItDoes: [
        '모든 .jpg/.jpeg 사진을 최신 .webp 파일로 변환해요.',
        'WebP 품질을 골라 파일 크기와 충실도 사이의 균형을 맞출 수 있어요.',
        '같은 화질에서 보통 원본 JPG보다 25~35% 작은 파일을 만들어요.',
        '사진은 똑같아 보여요. 파일을 더 작게 만들기 위해 데이터를 WebP로 다시 인코딩할 뿐이에요.',
      ],
      flowSteps: [
        {
          title: 'JPG 업로드',
          description: '.jpg 또는 .jpeg 사진을 끌어다 놓으세요.',
        },
        {
          title: 'WebP 품질 선택',
          description: '80~85는 일반적인 JPG 품질과 거의 같아요.',
        },
        {
          title: 'WebP 인코딩',
          description: 'ImageMagick이 사진을 WebP로 다시 인코딩해요.',
        },
        {
          title: 'WebP 다운로드',
          description: '웹에 바로 쓸 수 있는 더 작은 .webp로 저장하세요.',
        },
      ],
      advancedDetails: [
        '같은 시각적 화질에서 WebP는 더 현대적인 압축 덕분에 보통 JPG보다 25~35% 작아요.',
        '강한 압축을 겹치지 마세요. 이미 손실 압축된 JPG를 아주 낮은 WebP 품질로 다시 인코딩하면 아티팩트가 누적될 수 있어요.',
        'WebP는 모든 최신 브라우저에서 지원돼요. 페이지 로딩을 빠르게 하려면 WebP를 그대로 제공하세요.',
        '아주 오래된 소프트웨어와의 호환성을 최대한 확보하려면 JPG 대체 파일을 함께 두세요.',
      ],
      whyItMatters: [
        '가벼운 이미지는 페이지 로딩 시간, 이탈률, SEO를 직접 개선해요.',
        'WebP는 변환 한 번으로 JPG 수준의 화질을 더 작은 크기로 제공해요.',
        'Core Web Vitals는 작은 이미지에 더 좋은 점수를 줘요. WebP는 손쉽게 효과를 볼 수 있는 방법이에요.',
      ],
      useCases: [
        {
          title: '더 빠른 웹사이트',
          description: '히어로 이미지와 갤러리 JPG를 WebP로 변환해 페이지 용량을 줄이세요.',
        },
        {
          title: '쇼핑몰 카탈로그',
          description: '제품 사진을 줄여 상품 목록이 즉시 로드되게 하세요.',
        },
        {
          title: '블로그와 아티클',
          description: '눈에 보이는 화질 저하 없이 더 가벼운 본문 이미지를 제공하세요.',
        },
        {
          title: '이메일에 알맞은 사진',
          description: '첨부 파일 한도를 넘지 않는 더 작은 파일을 만드세요.',
        },
      ],
      whyMediaManipulator: [
        '출력이 WebP로 고정되어 있어 잘못 설정할 일이 없어요.',
        '고정된 프리셋 대신 품질을 정밀하게 조절할 수 있어요.',
      ],
      privacyNote: 'JPG는 저희 서버에서 선택한 품질의 더 작은 WebP로 다시 인코딩돼요. 외부 서비스로는 아무것도 전송되지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본은 절대 변경되지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: 'JPG를 WebP로 무료로 변환하려면 어떻게 하나요?',
          answer: '위에서 .jpg를 업로드하고 품질을 고른 다음 변환을 클릭하세요. .webp 파일로 다운로드돼요. 무료이고 가입이 필요 없어요.',
        },
        {
          question: 'WebP가 JPG보다 더 좋은가요?',
          answer: '웹용으로는 대개 그래요. WebP는 더 작은 크기로 비슷한 화질을 제공해요. 다만 아주 오래된 소프트웨어까지 아우르는 호환성은 여전히 JPG가 앞서요.',
        },
        {
          question: 'WebP는 JPG보다 얼마나 작나요?',
          answer: '같은 시각적 화질에서 WebP는 보통 JPG보다 25~35% 작지만, 정확한 절감량은 이미지에 따라 달라요.',
        },
        {
          question: 'JPG를 WebP로 변환하면 화질이 떨어지나요?',
          answer: '두 형식 모두 손실 압축이에요. 품질 80~85에서는 결과물이 JPG와 똑같아 보여요. 아티팩트가 누적되지 않도록 WebP 품질을 너무 낮게 설정하지 마세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'JPG에는 투명도가 없으므로 WebP 출력은 완전히 불투명해요.',
        ],
      },
      related: [
        {
          label: 'WebP를 JPG로 변환',
          to: '/tools/convert-webp-to-jpg',
          description: '반대로 어디서나 열리는 JPG로 되돌리세요.',
        },
        {
          label: 'PNG를 WebP로 변환',
          to: '/tools/convert-png-to-webp',
          description: 'PNG 그래픽을 웹용 WebP로 줄이세요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '형식을 바꾸지 않고 이미지를 더 줄이세요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: 'JPG, PNG, WebP, AVIF, GIF 간에 변환하세요.',
        },
        {
          label: '이미지 변환기 튜토리얼',
          to: '/tutorials/image/getting-started',
          description: '모든 이미지 옵션을 자세히 살펴보세요.',
        },
      ],
      embed: {
        title: 'JPG를 WebP로 변환',
        description: 'JPG 이미지를 업로드하세요. 이 도구의 출력은 WebP로 고정되어 있으니 품질을 고르고 변환하면 돼요. WebP는 같은 시각적 화질에서 보통 JPG보다 작은 파일을 만들어요.',
      },
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
      h1: 'JPG를 PDF로 온라인 무료 변환',
      tagline: 'JPG 사진과 스캔본을 공유, 인쇄, 업로드하기 좋은 깔끔한 PDF 문서로 바꿔요.',
      metaTitle: 'JPG를 PDF로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 JPG PDF 변환기입니다. .jpg 사진과 스캔본을 화질 손실 없이 깔끔한 PDF 문서로 바꾸세요. 가입이 필요 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'JPG를 PDF로 온라인 무료 변환',
      ogDescription: 'JPG 사진과 스캔본을 깔끔한 PDF 문서로 바꾸세요. 무손실이고 무료이며 가입이 필요 없어요.',
      intro: 'JPG는 휴대폰과 카메라가 사진을 찍는 형식이지만, 대부분의 서식, 지원서, 사무실에서는 PDF를 원해요. Media Manipulator는 JPG를 다시 압축하지 않고 PDF에 바로 삽입하므로, 문서는 사진과 똑같이 보이고 용량도 작게 유지돼요.',
      whatItDoes: [
        'JPG/JPEG 사진을 한 페이지짜리 PDF 문서로 감싸요.',
        '원본 JPG 바이트를 무손실로 삽입해요. 추가 압축이 전혀 없어요.',
        '페이지 크기를 사진에 맞추므로 잘리거나 늘어나는 부분이 없어요.',
        '어디서나 열고 인쇄할 수 있는 표준 PDF를 만들어요.',
      ],
      flowSteps: [
        {
          title: 'JPG 업로드',
          description: '.jpg 또는 .jpeg 사진이나 스캔본을 넣으세요.',
        },
        {
          title: 'JPG 삽입',
          description: 'JPG를 압축하지 않고 같은 크기의 페이지에 배치해요.',
        },
        {
          title: 'PDF 생성',
          description: '표준 한 페이지짜리 PDF를 조립해요.',
        },
        {
          title: 'PDF 다운로드',
          description: '공유하거나 업로드할 준비가 된 깔끔한 .pdf를 저장하세요.',
        },
      ],
      advancedDetails: [
        'JPG 스트림은 PDF /DCTDecode 필터로 삽입돼요. 즉 사진이 그대로 저장되어 손실 압축을 한 번 더 거치지 않아요.',
        '다시 인코딩하지 않으므로 JPG에서 변환한 PDF 문서는 보통 원본 사진과 크기가 거의 같아요.',
        '페이지 크기는 이미지를 기준으로 96 DPI로 정해지므로, 일반적인 휴대폰 사진은 적당한 크기의 페이지가 돼요.',
      ],
      whyItMatters: [
        '서식, 포털, 지원서는 JPG가 아니라 PDF를 요구하는 경우가 많아요.',
        'JPG 파일을 그대로 인쇄하면 바둑판식으로 배치되거나 크기가 바뀔 수 있지만, PDF는 예측한 대로 인쇄돼요.',
        '무손실 삽입으로 스캔 문서의 글자를 읽기 쉽게 유지해요.',
      ],
      useCases: [
        {
          title: '입사 지원',
          description: '서명한 서식을 찍은 사진을 포털이 받아 주는 PDF로 바꾸세요.',
        },
        {
          title: '영수증과 경비',
          description: '경비 보고서용으로 영수증 사진을 PDF로 변환하세요.',
        },
        {
          title: '스캔 문서',
          description: '휴대폰으로 스캔한 페이지를 깔끔한 PDF로 감싸세요.',
        },
        {
          title: '인쇄',
          description: 'JPG를 예측 가능한 결과로 인쇄하세요.',
        },
      ],
      whyMediaManipulator: [
        '진정한 무손실이에요. PDF 안의 JPG는 원본과 똑같아요.',
        '출력이 PDF로 고정되어 있어 잘못 설정할 일이 없어요.',
      ],
      privacyNote: 'JPG는 다시 압축되지 않은 채 서버가 만드는 한 페이지짜리 PDF에 배치돼요. 외부 서비스로는 아무것도 전송되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 원본은 절대 변경되지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: 'JPG를 PDF로 무료로 변환하려면 어떻게 하나요?',
          answer: '위에서 .jpg를 업로드하고 변환을 클릭하세요. 한 페이지짜리 PDF가 출력돼요. 무료이며 가입이 필요 없어요.',
        },
        {
          question: 'JPG를 PDF로 변환하면 화질이 떨어지나요?',
          answer: '아니요. JPG가 다시 압축되지 않고 PDF에 바로 삽입되므로 이미지 화질은 원본 파일과 똑같아요.',
        },
        {
          question: 'PDF가 JPG보다 훨씬 커지나요?',
          answer: '아니요. 다시 인코딩하지 않으므로 PDF는 원본 JPG에 아주 작은 문서 래퍼를 더한 정도의 크기예요.',
        },
        {
          question: '여러 JPG를 PDF 하나로 합칠 수 있나요?',
          answer: '이 도구는 이미지 한 장당 PDF 하나를 만들어요. 여러 페이지가 필요하면 JPG를 각각 변환한 뒤 병합 도구에서 PDF를 합치세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'JPG는 한 페이지짜리 PDF에 무손실로(다시 압축하지 않고) 삽입돼요.',
        ],
      },
      related: [
        {
          label: 'PNG를 PDF로 변환',
          to: '/tools/convert-png-to-pdf',
          description: 'PNG → PDF 전용 변환기예요.',
        },
        {
          label: '이미지를 PDF로',
          to: '/tools/image-to-pdf',
          description: '어떤 이미지 형식이든 PDF로 변환해요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: 'JPG, PNG, WebP, AVIF 등의 형식 간에 변환해요.',
        },
        {
          label: 'PDF를 JPG로',
          to: '/tools/pdf-to-jpg',
          description: '반대 방향: PDF를 JPG로 렌더링해요.',
        },
        {
          label: 'PDF 변환기',
          to: '/tools/pdf-converter',
          description: 'PDF 변환 기능을 모두 모은 허브예요.',
        },
      ],
      embed: {
        title: 'JPG를 PDF로 변환하기',
        description: 'JPG 이미지를 업로드하세요. 출력은 PDF로 고정되어 있고 JPG는 무손실로 삽입돼요. PDF 안의 사진은 원본과 비트 하나까지 똑같아요.',
      },
    },
    'convert-png-to-pdf': {
      name: 'PNG를 PDF로 변환',
      h1: 'PNG를 PDF로 온라인 무료 변환',
      tagline: 'PNG 스크린샷, 그래픽, 스캔본을 깔끔하고 선명한 PDF 문서로 바꿔요.',
      metaTitle: 'PNG를 PDF로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 PNG PDF 변환기입니다. .png 스크린샷과 그래픽을 선명한 무손실 PDF 문서로 바꾸세요. 가입이 필요 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'PNG를 PDF로 온라인 무료 변환',
      ogDescription: 'PNG 스크린샷과 그래픽을 선명한 무손실 PDF 문서로 바꾸세요. 무료이며 가입이 필요 없어요.',
      intro: 'PNG는 선명한 글자와 날카로운 가장자리가 있는 스크린샷, 다이어그램, 그래픽을 위한 형식이에요. 이런 이미지를 문서로 보내거나 인쇄해야 할 때는 PDF로 감싸는 것이 알맞아요. Media Manipulator는 PNG를 PDF에 무손실로 삽입하므로 모든 가장자리가 선명하게 유지돼요.',
      whatItDoes: [
        'PNG 이미지를 한 페이지짜리 PDF 문서로 감싸요.',
        '이미지를 무손실로 삽입해 글자와 선화를 선명하게 유지해요.',
        'PDF 페이지는 불투명하므로 투명도를 흰색 위에 평탄화해요.',
        '어디서나 열고 인쇄할 수 있는 표준 PDF를 만들어요.',
      ],
      flowSteps: [
        {
          title: 'PNG 업로드',
          description: '.png 스크린샷, 다이어그램, 그래픽을 넣으세요.',
        },
        {
          title: 'PNG 삽입',
          description: 'PNG를 흰색 페이지 위에 합성해 무손실로 삽입해요.',
        },
        {
          title: 'PDF 생성',
          description: '표준 한 페이지짜리 PDF를 조립해요.',
        },
        {
          title: 'PDF 다운로드',
          description: '공유하거나 인쇄할 준비가 된 선명한 .pdf를 저장하세요.',
        },
      ],
      advancedDetails: [
        'PNG는 디코딩된 뒤 무손실 zlib(Flate) 압축으로 삽입되므로, 선명한 글자와 가장자리가 그대로 보존되고 JPEG 아티팩트가 생기지 않아요.',
        'PDF 페이지에는 알파 채널이 없으므로 투명한 영역은 흰색이 돼요.',
        '페이지 크기는 적절한 기본 실제 크기가 되도록 이미지를 기준으로 96 DPI로 정해져요.',
      ],
      whyItMatters: [
        '스크린샷과 다이어그램은 티켓과 보고서에 PDF로 제출하는 경우가 많아요.',
        '무손실 삽입으로 작은 글자와 가는 선을 읽기 쉽게 유지해요.',
        'PNG 파일을 그대로 인쇄하면 예상치 못하게 크기가 바뀔 수 있지만, PDF는 예측한 대로 인쇄돼요.',
      ],
      useCases: [
        {
          title: '버그 리포트',
          description: '스크린샷을 티켓에 첨부할 PDF로 바꾸세요.',
        },
        {
          title: '다이어그램과 차트',
          description: '내보낸 그래픽을 공유하기 쉬운 PDF로 감싸세요.',
        },
        {
          title: '스캔한 서식',
          description: 'PNG 스캔본을 깔끔한 PDF 문서로 변환하세요.',
        },
        {
          title: '인쇄',
          description: 'PNG를 선명하고 예측 가능한 결과로 인쇄하세요.',
        },
      ],
      whyMediaManipulator: [
        '무손실 삽입으로 글자와 가장자리를 아주 선명하게 유지해요.',
        '출력이 PDF로 고정되어 있어 잘못 설정할 일이 없어요.',
      ],
      privacyNote: 'PNG는 서버에서 한 페이지짜리 PDF에 무손실로 삽입되며, 투명도는 흰색 위에 평탄화돼요. 외부 서비스로는 아무것도 전송되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 원본은 절대 변경되지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: 'PNG를 PDF로 무료로 변환하려면 어떻게 하나요?',
          answer: '위에서 .png를 업로드하고 변환을 클릭하세요. 한 페이지짜리 PDF가 출력돼요. 무료이며 가입이 필요 없어요.',
        },
        {
          question: 'PNG를 PDF로 바꿔도 글자가 선명하게 유지되나요?',
          answer: '네. PNG가 무손실로 삽입되므로 선명한 글자와 선화가 JPEG 같은 아티팩트 없이 그대로 유지돼요.',
        },
        {
          question: '투명한 PNG는 어떻게 되나요?',
          answer: 'PDF 페이지는 불투명하므로 투명한 영역은 흰색 배경 위에 평탄화돼요. 보이는 내용은 바뀌지 않아요.',
        },
        {
          question: '여러 PNG를 PDF 하나로 합칠 수 있나요?',
          answer: '이 도구는 이미지 한 장당 PDF 하나를 만들어요. 여러 페이지 문서가 필요하면 PNG를 각각 변환한 뒤 병합 도구에서 PDF를 합치세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'PNG는 무손실로 삽입돼요. PDF 페이지는 불투명하므로 투명도는 흰색 위에 평탄화돼요.',
        ],
      },
      related: [
        {
          label: 'JPG를 PDF로 변환',
          to: '/tools/convert-jpg-to-pdf',
          description: 'JPG → PDF 전용 변환기예요.',
        },
        {
          label: '이미지를 PDF로',
          to: '/tools/image-to-pdf',
          description: '어떤 이미지 형식이든 PDF로 변환해요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: 'JPG, PNG, WebP, AVIF 등의 형식 간에 변환해요.',
        },
        {
          label: 'PDF를 PNG로',
          to: '/tools/pdf-to-png',
          description: '반대 방향: PDF를 PNG로 렌더링해요.',
        },
        {
          label: 'PDF 변환기',
          to: '/tools/pdf-converter',
          description: 'PDF 변환 기능을 모두 모은 허브예요.',
        },
      ],
      embed: {
        title: 'PNG를 PDF로 변환하기',
        description: 'PNG 이미지를 업로드하세요. 출력은 PDF로 고정되어 있고 PNG가 무손실로 삽입되므로, 페이지에서 글자와 날카로운 가장자리가 선명하게 유지돼요.',
      },
    },
    'pdf-to-png': {
      name: 'PDF를 PNG로',
      h1: 'PDF를 PNG로 온라인 무료 변환',
      tagline: 'PDF의 모든 페이지를 선명한 무손실 PNG 이미지로 변환해요. 텍스트, 도표, 편집 작업에 알맞아요.',
      metaTitle: 'PDF를 PNG로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 PDF PNG 변환기입니다. PDF의 모든 페이지를 선명한 무손실 PNG 이미지로 렌더링해 ZIP으로 내려받으세요. 가입이 필요 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'PDF를 PNG로 온라인 무료 변환',
      ogDescription: 'PDF의 모든 페이지를 선명한 무손실 PNG 이미지로 렌더링하세요. 무료이고 빠르며 가입이 필요 없어요.',
      intro: 'PDF 페이지에 아주 선명하게 유지하고 싶은 또렷한 글자, 가는 선, 다이어그램이 있다면 PNG가 가장 좋은 선택이에요. Media Manipulator는 Poppler로 각 페이지를 무손실 PNG로 렌더링하므로 글자 주변에 JPEG 아티팩트가 생기지 않아요. 모든 페이지 또는 첫 페이지만 선택하고 해상도를 고르세요.',
      whatItDoes: [
        '각 PDF 페이지를 선택한 DPI의 무손실 PNG 이미지로 렌더링해요.',
        '모든 페이지(ZIP으로 다운로드) 또는 첫 페이지만(PNG 한 장) 변환해요.',
        '여러 페이지 출력에 page-001.png, page-002.png처럼 알아보기 쉬운 이름을 붙여요.',
        '무손실 PNG 인코딩으로 글자와 선화를 선명하게 유지해요.',
      ],
      flowSteps: [
        {
          title: 'PDF 업로드',
          description: '어떤 .pdf 문서든 넣으세요.',
        },
        {
          title: '페이지와 DPI 선택',
          description: '모든 페이지 또는 첫 페이지만 고르세요. 150 DPI가 좋은 기본값이에요.',
        },
        {
          title: 'PNG로 렌더링',
          description: 'Poppler가 각 페이지를 무손실 PNG로 래스터화해요.',
        },
        {
          title: '다운로드',
          description: 'PNG 한 장, 또는 페이지마다 PNG가 한 장씩 담긴 ZIP을 받으세요.',
        },
      ],
      advancedDetails: [
        '렌더링에는 정확하고 충실한 페이지 출력을 위해 Poppler(pdftoppm)를 사용해요.',
        'PNG는 무손실이므로 페이지 대부분이 글자, 다이어그램, 선명한 그래픽일 때는 JPG보다 나은 선택이에요.',
        'DPI가 높을수록 더 선명하고 큰 이미지가 돼요. 화면에는 150 DPI, 인쇄에는 300 DPI가 알맞아요.',
        '렌더링된 PNG는 흰색 배경이에요. PDF 페이지는 불투명하므로 보존할 투명도가 없어요.',
      ],
      whyItMatters: [
        '무손실 PNG는 작은 글자와 가는 선을 아티팩트 없이 읽기 쉽게 유지해요.',
        'PNG 페이지는 편집기, 문서, 디자인 도구에 깔끔하게 들어가요.',
        '렌더링된 페이지는 문서의 시각적 레이아웃을 정확히 담아요.',
      ],
      useCases: [
        {
          title: '다이어그램과 도면',
          description: '기술 문서 페이지를 아티팩트 없이 렌더링하세요.',
        },
        {
          title: '주석과 검토',
          description: '선명한 페이지를 편집기에서 열어 주석을 다세요.',
        },
        {
          title: '디자인 에셋',
          description: '깔끔한 페이지 그래픽을 디자인 도구로 가져오세요.',
        },
        {
          title: '썸네일',
          description: '첫 페이지의 선명한 PNG 미리보기를 만드세요.',
        },
      ],
      whyMediaManipulator: [
        '무손실 PNG 렌더링으로 글자와 가장자리를 선명하게 유지해요.',
        '정렬하기 쉬운 페이지 번호 파일 이름으로 깔끔하게 정리된 ZIP을 받아요.',
      ],
      privacyNote: 'PDF의 페이지는 서버에서 Poppler로 PNG 이미지로 렌더링되고, 두 페이지 이상이면 ZIP으로 묶여요. 외부 서비스로는 아무것도 전송되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 원본은 절대 변경되지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: 'PDF를 PNG로 무료로 변환하려면 어떻게 하나요?',
          answer: '위에서 .pdf를 업로드하고, 모든 페이지 또는 첫 페이지만 선택하고, DPI를 고른 뒤 변환을 클릭하세요.',
        },
        {
          question: 'PDF에 JPG보다 PNG를 고르는 이유는 무엇인가요?',
          answer: 'PNG는 무손실이라 글자, 가는 선, 다이어그램을 압축 아티팩트 없이 선명하게 유지해요. 사진이 많은 페이지에서 파일을 더 작게 만들고 싶다면 JPG가 나아요.',
        },
        {
          question: '이미지를 한 장 받나요, 여러 장 받나요?',
          answer: '"모든 페이지"를 선택하면 페이지마다 PNG가 한 장씩 담긴 ZIP(page-001.png, …)을, "첫 페이지만"을 선택하면 PNG 한 장을 받아요.',
        },
        {
          question: 'PNG 배경이 투명한가요?',
          answer: '아니요. PDF 페이지는 불투명하므로 렌더링된 페이지는 흰색 배경이에요. 보존할 투명도가 없어요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '모든 페이지 출력은 .zip으로, 첫 페이지 출력은 .png 한 장으로 제공돼요.',
          '렌더링된 페이지는 흰색 배경이에요. PDF 페이지는 불투명하므로 투명도가 없어요.',
        ],
      },
      related: [
        {
          label: 'PDF를 JPG로',
          to: '/tools/pdf-to-jpg',
          description: 'PDF 페이지를 대신 용량이 작은 JPG로 렌더링해요.',
        },
        {
          label: 'PDF 변환기',
          to: '/tools/pdf-converter',
          description: 'PDF를 이미지로, 이미지를 PDF로 변환해요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: '렌더링된 이미지를 다른 형식으로 변환해요.',
        },
        {
          label: '이미지를 PDF로',
          to: '/tools/image-to-pdf',
          description: '반대 방향: 이미지를 PDF로 바꿔요.',
        },
      ],
      embed: {
        title: 'PDF를 PNG로 변환하기',
        description: 'PDF를 업로드하세요. 각 페이지가 무손실 PNG 이미지로 렌더링돼요. ZIP을 받으려면 "모든 페이지"를, PNG 한 장을 받으려면 "첫 페이지만"을 선택하세요. 더 선명한 결과를 원하면 렌더링 DPI를 고르세요.',
      },
    },
    'pdf-converter': {
      name: 'PDF 변환기',
      h1: '무료 온라인 PDF 변환기',
      tagline: 'PDF를 JPG나 PNG 이미지로 바꾸고, 이미지를 PDF로 만드는 일까지 한곳에서 할 수 있어요.',
      metaTitle: '무료 온라인 PDF 변환기 | Media Manipulator',
      metaDescription: '무료 온라인 PDF 변환기입니다. PDF를 JPG나 PNG 이미지로, 이미지를 PDF로 변환하세요. 가입도 워터마크도 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '무료 온라인 PDF 변환기',
      ogDescription: 'PDF를 JPG/PNG 이미지로, 이미지를 PDF로 변환하세요. 무료 도구 하나로 모두 가능하며 가입이 필요 없어요.',
      intro: 'PDF 변환기는 양방향 변환을 한곳에서 처리해요. PDF 페이지를 JPG나 PNG 이미지로 렌더링하거나, 이미지를 PDF 문서로 감쌀 수 있어요. PDF를 업로드하면 이미지 내보내기 옵션이, 이미지를 업로드하면 이미지를 PDF로 변환하는 기능이 나타나요. 모든 작업은 자체 서버에서 실행돼요.',
      whatItDoes: [
        'PDF 페이지를 선택한 해상도의 JPG나 PNG로 변환해요.',
        'JPG, PNG 등의 이미지를 한 페이지짜리 PDF로 변환해요.',
        '여러 페이지 PDF 내보내기를 번호가 매겨진 이미지의 깔끔한 ZIP으로 묶어요.',
        '업로드한 파일에 맞춰 양식이 자동으로 바뀌어요.',
      ],
      flowSteps: [
        {
          title: '파일 업로드',
          description: 'PDF 또는 JPG, PNG 같은 이미지를 넣으세요.',
        },
        {
          title: '출력 선택',
          description: 'PDF라면 JPG/PNG, 페이지, DPI를 고르고, 이미지라면 출력은 PDF예요.',
        },
        {
          title: '변환',
          description: '서버에서 파일을 렌더링하거나 감싸요.',
        },
        {
          title: '다운로드',
          description: 'PDF, 이미지 한 장, 또는 페이지 이미지 ZIP을 저장하세요.',
        },
      ],
      advancedDetails: [
        'PDF → 이미지 렌더링에는 Poppler(pdftoppm)를 사용하고, 이미지 → PDF는 JPG를 무손실로, 다른 형식은 무손실 Flate 압축으로 삽입해요.',
        '여러 페이지 PDF 내보내기는 정렬하기 쉬운 page-001/page-002 파일 이름과 함께 .zip으로 제공돼요.',
        '이미지를 PDF로 변환할 때는 96 DPI 기준으로 페이지를 이미지 크기에 맞추고, PDF를 이미지로 변환할 때는 기본 150 DPI이며 인쇄용으로 300+까지 지원해요.',
        '페이지 수 제한이 너무 큰 PDF를 막아 줘요.',
      ],
      whyItMatters: [
        '도구 하나로 흔히 쓰는 PDF 변환의 양방향을 모두 처리해요.',
        '변환 방향에 따라 다른 도구를 찾아다닐 필요가 없어요.',
        '브라우저나 기기와 관계없이 서버 측에서 일관된 품질을 제공해요.',
      ],
      useCases: [
        {
          title: '혼합 워크플로',
          description: '도구를 바꾸지 않고 PDF→이미지와 이미지→PDF를 오가세요.',
        },
        {
          title: '서류 준비',
          description: '업로드 양식용으로 이미지를 PDF로 바꾸세요.',
        },
        {
          title: '용도 변경',
          description: '슬라이드나 소셜 미디어용으로 PDF 페이지를 이미지로 렌더링하세요.',
        },
        {
          title: '빠른 미리보기',
          description: '어떤 PDF에서든 첫 페이지 이미지를 만드세요.',
        },
      ],
      whyMediaManipulator: [
        '양방향 변환을 파일에 맞춰 바뀌는 도구 하나에 담았어요.',
        '무손실 이미지→PDF 변환과 정확한 Poppler PDF→이미지 렌더링을 제공해요.',
      ],
      privacyNote: 'PDF는 페이지별로 이미지로 렌더링되거나, 이미지는 PDF로 감싸지며, 이 작업은 서버의 Poppler와 ImageMagick이 처리해요. 외부 서비스로는 아무것도 전송되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 원본은 절대 변경되지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: 'PDF 변환기로 무엇을 할 수 있나요?',
          answer: 'PDF 페이지를 JPG나 PNG 이미지로, 이미지(JPG, PNG 등)를 PDF 문서로 변환해요. 모두 무료 도구 하나로 할 수 있어요.',
        },
        {
          question: '변환 방향은 어떻게 정해지나요?',
          answer: '업로드한 파일에 맞춰 바뀌어요. PDF를 올리면 이미지 내보내기 옵션(형식, 페이지, DPI)이 나타나고, 이미지는 PDF로 변환돼요.',
        },
        {
          question: '여러 페이지 PDF를 이미지로 변환할 수 있나요?',
          answer: '네. "모든 페이지"를 선택하면 page-001, page-002 등의 이름으로 페이지마다 이미지가 한 장씩 담긴 ZIP을 받아요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'PDF→이미지는 PDF를, 이미지→PDF는 이미지를 업로드하세요. 양식은 자동으로 바뀌어요.',
          '모든 페이지 PDF 내보내기는 번호가 매겨진 이미지의 .zip으로 제공돼요.',
        ],
      },
      related: [
        {
          label: 'PDF를 JPG로',
          to: '/tools/pdf-to-jpg',
          description: 'PDF 페이지를 JPG 이미지로 렌더링해요.',
        },
        {
          label: 'PDF를 PNG로',
          to: '/tools/pdf-to-png',
          description: 'PDF 페이지를 무손실 PNG 이미지로 렌더링해요.',
        },
        {
          label: '이미지를 PDF로',
          to: '/tools/image-to-pdf',
          description: '어떤 이미지든 PDF로 바꿔요.',
        },
        {
          label: 'JPG를 PDF로 변환',
          to: '/tools/convert-jpg-to-pdf',
          description: 'JPG → PDF 전용 변환기예요.',
        },
        {
          label: 'PNG를 PDF로 변환',
          to: '/tools/convert-png-to-pdf',
          description: 'PNG → PDF 전용 변환기예요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: '이미지 형식 간에 변환해요.',
        },
      ],
      embed: {
        title: 'PDF 또는 이미지 변환하기',
        description: 'PDF를 업로드하면 페이지를 JPG나 PNG 이미지로 렌더링하고, 이미지를 업로드하면 PDF로 바꿔요. 양식은 선택한 파일에 맞춰 바뀌어요.',
      },
    },
    'convert-heic-to-jpg': {
      name: 'HEIC를 JPG로 변환',
      h1: 'HEIC를 JPG로 온라인 무료 변환',
      tagline: 'iPhone의 HEIC 사진을 어디서나 열고 업로드할 수 있는 JPG 파일로 바꿔요.',
      metaTitle: 'HEIC를 JPG로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 HEIC JPG 변환기입니다. iPhone의 .heic/.heif 사진을 어디서나 호환되는 JPG 파일로 바꾸세요. 가입이 필요 없습니다. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'HEIC를 JPG로 온라인 무료 변환',
      ogDescription: 'iPhone HEIC 사진을 어디서나 호환되는 JPG 파일로 바꾸세요. 무료이고 빠르며 가입이 필요 없어요.',
      intro: 'HEIC는 iPhone이 저장 공간을 아끼려고 쓰는 고효율 형식이지만, 많은 Windows PC, 웹사이트, 오래된 앱에서는 열리지 않아요. Media Manipulator는 HEIC 사진을 어디서나 쓸 수 있는 형식인 JPG로, 올바른 방향과 원하는 품질로 변환해요.',
      whatItDoes: [
        'Apple HEIC/HEIF 사진을 표준 JPG로 변환해요.',
        'EXIF를 사용해 이미지를 자동 회전하므로 세로 사진이 옆으로 눕지 않아요.',
        'JPG 품질을 골라 파일 크기와 충실도의 균형을 맞출 수 있어요.',
        '어떤 기기, 사이트, 앱에서도 열리는 JPG를 만들어요.',
      ],
      flowSteps: [
        {
          title: 'HEIC 업로드',
          description: 'iPhone의 .heic 또는 .heif 사진을 넣으세요.',
        },
        {
          title: '자동 회전',
          description: 'EXIF 방향 정보를 읽어 사진을 똑바로 세워요.',
        },
        {
          title: 'JPG 인코딩',
          description: 'ImageMagick이 HEIC를 디코딩(libheif)하고 JPG를 써요.',
        },
        {
          title: 'JPG 다운로드',
          description: '어디서나 호환되는 .jpg 파일을 저장하세요.',
        },
      ],
      advancedDetails: [
        'HEIC 디코딩은 libheif 델리게이트와 함께 빌드된 ImageMagick에 의존해요. 서버에 HEIC 지원이 없으면 깨진 파일 대신 명확한 오류를 반환해요.',
        '품질 85~90이 훌륭한 기본값이에요. HEIC는 이미 효율적이므로 고품질 JPG면 사진이 똑같아 보여요.',
        '인코딩 전에 EXIF 방향을 적용하므로, HEIC를 단순하게 변환할 때 흔히 생기는 "90° 회전" 문제가 해결돼요.',
      ],
      whyItMatters: [
        'Windows, 많은 웹 업로드 양식, 오래된 소프트웨어는 여전히 HEIC를 열지 못해요.',
        'JPG로 공유하면 받는 사람이 어떤 기기에서든 볼 수 있어요.',
        '대부분의 인화소와 마켓플레이스는 JPG를 요구해요.',
      ],
      useCases: [
        {
          title: 'iPhone 사진 공유',
          description: '어떤 휴대폰이나 PC에서든 열리는 사진을 보내세요.',
        },
        {
          title: '웹 업로드',
          description: 'HEIC를 거부하는 양식과 사이트의 조건을 맞추세요.',
        },
        {
          title: '인쇄',
          description: '인화를 주문하기 전에 JPG로 변환하세요.',
        },
        {
          title: '오래된 앱에서 편집',
          description: 'HEIC를 지원하지 않는 소프트웨어에서 사진을 여세요.',
        },
      ],
      whyMediaManipulator: [
        '올바른 자동 회전으로 옆으로 누운 사진이 없어요.',
        '고정된 프리셋이 아니라 품질을 직접 조절할 수 있어요.',
      ],
      privacyNote: 'HEIC 사진은 서버에서 디코딩되고, 바른 방향으로 돌려진 뒤 JPG로 저장돼요. 외부 서비스로는 아무것도 전송되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 원본은 절대 변경되지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: 'HEIC를 JPG로 무료로 변환하려면 어떻게 하나요?',
          answer: '위에서 .heic 사진을 업로드하고 품질을 고른 뒤 변환을 클릭하세요. 표준 .jpg 파일을 받게 돼요.',
        },
        {
          question: 'HEIC 사진이 Windows에서 열리지 않는 이유는 무엇인가요?',
          answer: 'HEIC는 Apple이 선호하는 형식으로, 오래된 Windows 버전과 많은 앱이 읽지 못해요. JPG로 변환하면 사진이 어디서나 열려요.',
        },
        {
          question: '사진 화질이 떨어지나요?',
          answer: 'JPG는 손실 압축이지만, 품질 85~90이면 사실상 모든 사진에서 결과가 HEIC 원본과 똑같아 보여요.',
        },
        {
          question: '예전에 변환한 사진은 왜 회전되어 있었나요?',
          answer: '단순한 변환기는 EXIF 방향을 무시해요. 이 도구는 이미지를 자동 회전하므로 사진이 바른 방향으로 나와요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'HEIC 디코딩에는 서버에 libheif 델리게이트가 포함된 ImageMagick이 필요해요.',
        ],
      },
      related: [
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: 'JPG, PNG, WebP, AVIF 등의 형식 간에 변환해요.',
        },
        {
          label: 'AVIF를 JPG로 변환',
          to: '/tools/convert-avif-to-jpg',
          description: '최신 AVIF 사진을 JPG로 변환해요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: 'JPG를 웹용으로 줄여요.',
        },
        {
          label: '이미지 변환기 튜토리얼',
          to: '/tutorials/image/getting-started',
          description: '모든 이미지 옵션을 차례로 살펴봐요.',
        },
      ],
      embed: {
        title: 'HEIC를 JPG로 변환하기',
        description: 'iPhone의 HEIC 또는 HEIF 사진을 업로드하세요. 출력은 JPG로 고정되며, 바른 방향으로 보이도록 자동 회전되고, 선택한 품질로 저장돼요.',
      },
    },
    'convert-avif-to-jpg': {
      name: 'AVIF를 JPG로 변환',
      h1: 'AVIF를 JPG로 온라인 무료 변환',
      tagline: '최신 AVIF 이미지를 AVIF를 지원하지 않는 앱과 사이트에서도 쓸 수 있는 JPG 파일로 바꿔요.',
      metaTitle: 'AVIF를 JPG로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 AVIF JPG 변환기예요. .avif 이미지를 원하는 품질의 어디서나 호환되는 JPG 파일로 바꾸세요. 가입이 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'AVIF를 JPG로 온라인 무료 변환',
      ogDescription: '최신 AVIF 이미지를 어디서나 호환되는 JPG 파일로 바꾸세요. 무료, 빠른 처리, 가입 불필요.',
      intro: 'AVIF는 아주 작은 파일을 만드는 최첨단 이미지 형식이지만, 아직 많은 앱, 편집기, 업로드 양식에서 열리지 않아요. Media Manipulator는 AVIF를 JPG로 변환해 이미지를 어디서나 쓸 수 있게 해 줘요. 품질을 고르고 다운로드하세요.',
      whatItDoes: [
        'AVIF 이미지를 표준 JPG로 변환해요.',
        'JPG에는 알파 채널이 없으므로 투명한 부분은 배경 위에 평탄화해요.',
        '원하는 크기와 화질의 균형에 맞게 JPG 품질을 고를 수 있어요.',
        '어떤 기기나 앱에서도 열리는 JPG를 만들어요.',
      ],
      flowSteps: [
        {
          title: 'AVIF 업로드',
          description: '.avif 이미지를 끌어다 놓으세요.',
        },
        {
          title: 'JPG 품질 선택',
          description: '85가 균형 잡힌 기본값이에요.',
        },
        {
          title: 'JPG 인코딩',
          description: 'ImageMagick이 AVIF를 디코딩(libaom/libheif)하고 JPG로 저장해요.',
        },
        {
          title: 'JPG 다운로드',
          description: '어디서나 호환되는 .jpg를 저장하세요.',
        },
      ],
      advancedDetails: [
        'AVIF 디코딩은 AVIF 델리게이트(libaom 또는 libheif)와 함께 빌드된 ImageMagick에 의존해요. 서버에 AVIF 지원이 없으면 도구가 명확한 오류를 반환해요.',
        'AVIF는 투명도를 지원해요. JPG로 변환할 때는 JPG에 알파 채널이 없어서 투명한 영역이 평탄화돼요. 투명도를 유지하려면 AVIF → PNG를 사용하세요.',
        '품질 85~90이면 대부분의 이미지에서 JPG가 AVIF와 눈으로 보기에 똑같아요.',
      ],
      whyItMatters: [
        '아직 많은 앱과 업로드 양식이 AVIF를 지원하지 않아요.',
        'JPG라면 받는 사람이 확실히 이미지를 열 수 있어요.',
        '변환하면 다운로드한 AVIF를 JPG가 필요한 곳 어디서나 쓸 수 있어요.',
      ],
      useCases: [
        {
          title: '웹 이미지 저장',
          description: '다운로드한 AVIF를 바로 쓸 수 있는 JPG로 변환하세요.',
        },
        {
          title: '앱 호환성',
          description: 'AVIF를 지원하지 않는 소프트웨어에서도 AVIF 이미지를 여세요.',
        },
        {
          title: '업로드',
          description: 'JPG만 받는 양식에 맞추세요.',
        },
        {
          title: '인쇄',
          description: '사진 인화소에 보낼 JPG를 만드세요.',
        },
      ],
      whyMediaManipulator: [
        '일률적인 프리셋 대신 품질을 직접 조절할 수 있어요.',
        '자체 서버에서 실행돼요. 외부 업체에 처리를 맡기지 않아요.',
      ],
      privacyNote: 'AVIF는 저희 서버에서 디코딩되고 설정한 품질의 JPG로 다시 인코딩돼요. 외부 서비스로는 아무것도 전송되지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본은 절대 변경되지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: 'AVIF를 JPG로 무료 변환하려면 어떻게 하나요?',
          answer: '위에서 .avif 이미지를 업로드하고 품질을 고른 다음 변환을 클릭하세요. 표준 .jpg 파일을 받을 수 있어요.',
        },
        {
          question: 'AVIF 파일이 열리지 않는 이유는 뭔가요?',
          answer: 'AVIF는 비교적 새로운 형식이라 아직 많은 앱, 편집기, 웹사이트가 지원하지 않아요. JPG로 변환하면 어디서나 이미지가 열려요.',
        },
        {
          question: '투명도는 어떻게 되나요?',
          answer: 'JPG에는 투명도가 없어서 AVIF의 투명한 영역은 배경 위에 평탄화돼요. 투명도를 유지해야 한다면 AVIF → PNG 도구를 사용하세요.',
        },
        {
          question: '화질이 떨어지나요?',
          answer: '품질 85~90이면 대부분의 이미지에서 JPG가 AVIF와 사실상 똑같아 보여요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'AVIF 디코딩에는 서버에 AVIF 델리게이트가 있는 ImageMagick이 필요해요. JPG 출력에서는 투명도가 평탄화돼요.',
        ],
      },
      related: [
        {
          label: 'AVIF를 PNG로 변환',
          to: '/tools/convert-avif-to-png',
          description: '대신 PNG로 투명도를 유지하세요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: 'JPG, PNG, WebP, AVIF 등 여러 형식 사이를 변환하세요.',
        },
        {
          label: 'HEIC를 JPG로 변환',
          to: '/tools/convert-heic-to-jpg',
          description: 'iPhone의 HEIC 사진을 JPG로 변환하세요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '웹용으로 JPG 용량을 줄이세요.',
        },
      ],
      embed: {
        title: 'AVIF를 JPG로 변환',
        description: 'AVIF 이미지를 업로드하세요. 출력은 JPG로 고정되어 있어서, 모든 앱, 편집기, 업로드 양식이 받아 주는 파일을 원하는 품질로 얻을 수 있어요.',
      },
    },
    'convert-avif-to-png': {
      name: 'AVIF를 PNG로 변환',
      h1: 'AVIF를 PNG로 온라인 무료 변환',
      tagline: 'AVIF 이미지를 어디서나 열리고 투명도도 그대로 유지되는 무손실 PNG 파일로 바꿔요.',
      metaTitle: 'AVIF를 PNG로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 AVIF PNG 변환기예요. .avif 이미지를 투명도가 유지되고 어떤 편집기에서도 열리는 무손실 PNG 파일로 바꾸세요. 가입이 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'AVIF를 PNG로 온라인 무료 변환',
      ogDescription: 'AVIF 이미지를 투명도가 유지되는 무손실 PNG 파일로 바꾸세요. 무료, 빠른 처리, 가입 불필요.',
      intro: '로고나 누끼 이미지처럼 AVIF 이미지에 투명도가 있으면, JPG로 변환할 때 투명한 부분이 평탄화돼요. PNG는 알파 채널을 유지하고 무손실이라 그래픽에 알맞은 출력 형식이에요. Media Manipulator는 투명도를 그대로 살려 AVIF를 PNG로 변환해요.',
      whatItDoes: [
        'AVIF 이미지를 무손실 PNG로 변환해요.',
        '알파 채널을 유지하므로 투명한 AVIF는 투명한 그대로 남아요.',
        '어떤 편집기, 뷰어, 디자인 도구에서도 열리는 PNG를 만들어요.',
        'AVIF가 PNG로 바뀔 때 이미지가 픽셀 하나하나 그대로 보존돼요.',
      ],
      flowSteps: [
        {
          title: 'AVIF 업로드',
          description: '투명하든 불투명하든 .avif 이미지를 끌어다 놓으세요.',
        },
        {
          title: 'AVIF 디코딩',
          description: 'ImageMagick이 AVIF 델리게이트로 AVIF를 디코딩해요.',
        },
        {
          title: 'PNG 인코딩',
          description: '투명도가 유지된 무손실 PNG로 저장해요.',
        },
        {
          title: 'PNG 다운로드',
          description: '투명도가 유지된 .png 파일을 저장하세요.',
        },
      ],
      advancedDetails: [
        'AVIF 디코딩은 AVIF 델리게이트(libaom 또는 libheif)와 함께 빌드된 ImageMagick에 의존해요. 서버에 AVIF 지원이 없으면 도구가 명확한 오류를 반환해요.',
        'AVIF의 투명도는 PNG 알파 채널로 보존돼요.',
        'PNG는 무손실이라 출력이 보통 원본 AVIF보다 커요. 어디서나 쓸 수 있는 호환성과 투명도를 얻는 대가예요.',
      ],
      whyItMatters: [
        'PNG는 JPG였다면 사라졌을 투명도를 유지해요. 로고와 누끼 이미지에 꼭 필요해요.',
        '일부 편집기와 앱은 AVIF를 열지 못하지만, PNG는 어디서나 열려요.',
        'PNG는 그래픽을 주고받기에 안전한 무손실 형식이에요.',
      ],
      useCases: [
        {
          title: '투명 로고',
          description: '투명한 AVIF 로고를 바로 쓸 수 있는 PNG로 변환하세요.',
        },
        {
          title: '디자인 전달',
          description: 'AVIF를 읽지 못하는 도구에 PNG를 넘겨주세요.',
        },
        {
          title: '편집',
          description: '편집기에서 이미지를 손실 없이 여세요.',
        },
        {
          title: '웹 에셋',
          description: '오래된 브라우저를 위한 PNG 대체 이미지를 준비해 두세요.',
        },
      ],
      whyMediaManipulator: [
        '투명도가 자동으로 유지돼요.',
        '그래픽 작업을 위한 무손실 PNG 출력이에요.',
      ],
      privacyNote: 'AVIF는 저희 서버에서 디코딩되고 투명도를 그대로 유지한 무손실 PNG로 저장돼요. 외부 서비스로는 아무것도 전송되지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본은 절대 변경되지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: 'AVIF를 PNG로 무료 변환하려면 어떻게 하나요?',
          answer: '위에서 .avif 이미지를 업로드하고 변환을 클릭하세요. 투명도가 유지된 무손실 .png가 출력돼요.',
        },
        {
          question: 'AVIF를 PNG로 바꾸면 투명도가 유지되나요?',
          answer: '네. PNG는 알파 채널을 지원하므로 투명한 AVIF는 변환 후에도 투명해요.',
        },
        {
          question: 'AVIF를 PNG와 JPG 중 무엇으로 바꿔야 하나요?',
          answer: '투명도나 무손실 화질이 필요하면(로고, 그래픽) PNG를 고르세요. 투명도가 없는 사진이라 파일을 가장 작게 만들고 싶다면 JPG를 고르세요.',
        },
        {
          question: 'PNG가 AVIF보다 큰 이유는 뭔가요?',
          answer: 'AVIF는 매우 효율적인 압축 형식이고 PNG는 무손실이라 PNG가 보통 더 커요. 정상적인 현상이에요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'AVIF 디코딩에는 AVIF 델리게이트가 있는 ImageMagick이 필요해요. PNG 출력에서는 투명도가 유지돼요.',
        ],
      },
      related: [
        {
          label: 'AVIF를 JPG로 변환',
          to: '/tools/convert-avif-to-jpg',
          description: '대신 AVIF를 용량이 작은 JPG로 변환하세요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: 'JPG, PNG, WebP, AVIF 등 여러 형식 사이를 변환하세요.',
        },
        {
          label: 'HEIC를 JPG로 변환',
          to: '/tools/convert-heic-to-jpg',
          description: 'iPhone의 HEIC 사진을 JPG로 변환하세요.',
        },
        {
          label: '이미지 배경 제거',
          to: '/tools/remove-background-from-image',
          description: '투명 PNG 누끼 이미지를 자동으로 만드세요.',
        },
      ],
      embed: {
        title: 'AVIF를 PNG로 변환',
        description: 'AVIF 이미지를 업로드하세요. 출력은 PNG로 고정되어 있어서 투명도가 유지되고, 어떤 편집기나 뷰어에서도 손실 없이 열려요.',
      },
    },
    'convert-svg-to-png': {
      name: 'SVG를 PNG로 변환',
      h1: 'SVG를 PNG로 온라인 무료 변환',
      tagline: 'SVG 아이콘과 로고를 업로드, 슬라이드, 앱에 쓸 수 있도록 원하는 크기의 PNG 이미지로 변환해요.',
      metaTitle: 'SVG를 PNG로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 SVG PNG 변환기예요. SVG 아이콘과 로고를 원하는 크기의 PNG 이미지로 래스터화하세요. 가입이 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'SVG를 PNG로 온라인 무료 변환',
      ogDescription: 'SVG 아이콘과 로고를 어떤 크기로든 PNG 이미지로 래스터화하세요. 무료, 빠른 처리, 가입 불필요.',
      intro: 'SVG는 완벽한 벡터지만, 소셜 네트워크, 마켓플레이스, 슬라이드 도구, 앱 등 많은 플랫폼은 PNG 같은 래스터 이미지만 받아요. Media Manipulator는 SVG를 원하는 크기의 선명하고 투명도가 유지되는 PNG로 래스터화해요. SVG는 신뢰할 수 없는 입력으로 취급되어 안전한 렌더러로 처리돼요.',
      whatItDoes: [
        'SVG 벡터 파일을 PNG 이미지로 래스터화해요.',
        '출력 해상도에 맞춰 목표 너비, 높이 또는 둘 다를 설정할 수 있어요.',
        'SVG의 투명도를 PNG에서도 유지해요.',
        '외부 네트워크 리소스를 가져오지 않는 안전한 래스터라이저로 렌더링해요.',
      ],
      flowSteps: [
        {
          title: 'SVG 업로드',
          description: '.svg 아이콘, 로고, 일러스트를 끌어다 놓으세요.',
        },
        {
          title: '크기 설정(선택)',
          description: '너비/높이를 고르거나 SVG의 원래 크기를 사용하세요.',
        },
        {
          title: '래스터화',
          description: '저희 서버에서 SVG를 픽셀 이미지로 렌더링해요.',
        },
        {
          title: 'PNG 다운로드',
          description: '선명하고 투명도가 유지된 .png를 저장하세요.',
        },
      ],
      advancedDetails: [
        '렌더링에는 가능하면 rsvg-convert(librsvg)를 사용하고(기본적으로 원격 리소스를 불러오지 않아요), 보안을 강화한 ImageMagick을 대체 수단으로 써요.',
        'SVG는 벡터라서 화질 손실 없이 어떤 해상도로든 렌더링할 수 있어요. 더 선명한 출력을 원하면 너비를 크게 고르세요.',
        '업로드된 SVG는 신뢰할 수 없는 입력으로 취급되며, SSRF/외부 리소스 요청 위험을 피하기 위해 네트워크 접근을 끈 상태로 처리돼요.',
      ],
      whyItMatters: [
        '대부분의 업로드 양식과 소셜 플랫폼은 SVG를 거부하지만 PNG는 받아요.',
        '정한 크기로 래스터화하면 그 용도에 맞는 선명한 출력이 보장돼요.',
        'PNG는 아이콘과 로고에 꼭 필요한 투명도를 유지해요.',
      ],
      useCases: [
        {
          title: '소셜 및 업로드',
          description: 'SVG 로고를 플랫폼이 받아 주는 PNG로 바꾸세요.',
        },
        {
          title: '프레젠테이션',
          description: '선명한 아이콘 PNG를 슬라이드에 넣으세요.',
        },
        {
          title: '앱 에셋',
          description: '앱에 필요한 정확한 크기로 PNG를 내보내세요.',
        },
        {
          title: '이메일',
          description: 'SVG가 지원되지 않는 곳에서는 PNG를 사용하세요.',
        },
      ],
      whyMediaManipulator: [
        '화질 손실 없이 어떤 크기로든 렌더링해요. 벡터는 완벽하게 확대·축소돼요.',
        '외부 요청을 차단한 안전한 SVG 처리예요.',
      ],
      privacyNote: 'SVG는 저희 서버의 librsvg가 PNG로 렌더링하며, SVG가 참조하는 외부 이미지와 글꼴은 가져오지 않아요. 외부 서비스로는 아무것도 전송되지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본은 절대 변경되지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: 'SVG를 PNG로 무료 변환하려면 어떻게 하나요?',
          answer: '위에서 .svg를 업로드하고, 필요하면 너비나 높이를 설정한 다음 변환을 클릭하세요. 선명한 .png를 받을 수 있어요.',
        },
        {
          question: 'PNG는 어떤 크기가 되나요?',
          answer: '기본적으로 SVG의 원래 크기를 사용해요. 더 크게 또는 더 작게 렌더링하려면 너비, 높이 또는 둘 다를 설정하세요. 벡터는 화질 손실 없이 크기가 바뀌어요.',
        },
        {
          question: 'PNG에서도 투명도가 유지되나요?',
          answer: '네. SVG의 투명한 영역은 PNG에서도 투명하게 유지돼요.',
        },
        {
          question: 'SVG를 업로드해도 안전한가요?',
          answer: '네. SVG를 신뢰할 수 없는 입력으로 취급하고 외부 네트워크 요청을 차단한 상태로 렌더링하므로, 파일에 포함된 원격 참조를 불러올 수 없어요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'rsvg-convert(우선) 또는 보안을 강화한 ImageMagick 대체 수단으로 렌더링해요. SVG에서 나가는 외부 네트워크 요청은 차단돼요.',
        ],
      },
      related: [
        {
          label: 'PNG를 SVG로 변환',
          to: '/tools/convert-png-to-svg',
          description: '반대 방향으로: PNG를 SVG로 벡터화하세요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: 'JPG, PNG, WebP, AVIF 등 여러 형식 사이를 변환하세요.',
        },
        {
          label: 'PNG를 ICO로',
          to: '/tools/png-to-ico',
          description: 'PNG를 파비콘으로 만드세요.',
        },
      ],
      embed: {
        title: 'SVG를 PNG로 변환',
        description: 'SVG를 업로드하세요. 출력은 PNG로 고정되어 있어요. 렌더링 해상도를 조절하려면 너비나 높이를 설정하고, SVG의 원래 크기를 쓰려면 비워 두세요.',
      },
    },
    'convert-png-to-svg': {
      name: 'PNG를 SVG로 변환',
      h1: 'PNG를 SVG로 온라인 무료 변환',
      tagline: 'PNG 로고, 아이콘, 선화를 potrace로 확대해도 깨지지 않는 진짜 SVG 패스로 벡터화해요.',
      metaTitle: 'PNG를 SVG로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 PNG SVG 벡터 변환기예요. 로고, 아이콘, 선화를 트레이싱해 확대해도 깨지지 않는 진짜 SVG 패스로 만드세요. 사진이 아닌 단순한 그래픽에 가장 알맞아요. 가입이 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'PNG를 SVG로 온라인 무료 변환',
      ogDescription: 'PNG 로고, 아이콘, 선화를 확대해도 깨지지 않는 진짜 SVG 패스로 벡터화하세요. 무료, 가입 불필요.',
      intro: '진정한 PNG-SVG 변환이란 이미지를 트레이싱해, 어떤 크기로 확대해도 픽셀이 깨지지 않는 실제 벡터 패스로 만드는 것이에요. Media Manipulator는 potrace로 PNG를 벡터화해요. 로고, 아이콘, 서명, 흑백 선화에 이상적이에요. SVG 안에 PNG를 숨겨 둔 것이 아닌 진짜 벡터화예요. 사진을 깔끔한 벡터 아트로 바꾸도록 설계된 도구는 아니에요.',
      whatItDoes: [
        'potrace로 PNG를 트레이싱해 확대해도 깨지지 않는 진짜 SVG 벡터 패스로 만들어요.',
        '이미지를 깔끔한 흑백 비트맵으로 단순화한 다음 도형을 벡터화해요.',
        '흑백 임계값을 조절해 디테일을 더 많이 또는 더 적게 담을 수 있어요.',
        '<image> 태그로 감싼 래스터 이미지가 아닌 진짜 .svg를 출력해요.',
      ],
      flowSteps: [
        {
          title: 'PNG 업로드',
          description: '로고, 아이콘, 서명, 선화 PNG를 끌어다 놓으세요.',
        },
        {
          title: '임계값 설정',
          description: '흑백을 나누는 기준값을 골라 디테일을 조절하세요.',
        },
        {
          title: '벡터로 트레이싱',
          description: 'ImageMagick이 비트맵을 준비하고 potrace가 패스를 트레이싱해요.',
        },
        {
          title: 'SVG 다운로드',
          description: '확대해도 깨지지 않는 진짜 .svg 파일을 저장하세요.',
        },
      ],
      advancedDetails: [
        '파이프라인은 PNG를 이진(흑백) 비트맵으로 평탄화한 다음(ImageMagick threshold), potrace를 실행해 매끄러운 베지어 벡터 패스를 만들어요.',
        '벡터화는 대비가 높고 단순한 그래픽에서 가장 잘 작동해요. 로고, 아이콘, 모노그램, 서명, 흑백 선화가 여기에 해당해요.',
        '사진이나 복잡한 그라데이션은 충실하게 재현하지 못해요. 사진을 트레이싱하면 깔끔한 벡터 아트가 아니라 크고 지저분한 패스가 만들어져요.',
        '더 섬세하고 옅은 디테일을 담으려면 임계값을 높이고, 가장 굵은 도형만 남기려면 낮추세요.',
      ],
      whyItMatters: [
        '벡터 로고는 파비콘부터 옥외 광고판까지 어떤 크기로 확대해도 픽셀이 깨지지 않아요.',
        '단순한 그래픽의 SVG는 용량이 아주 작고, Illustrator나 Inkscape 같은 벡터 도구에서 편집할 수 있어요.',
        'PNG 로고에서 벡터를 되살리면 처음부터 다시 만들 필요가 없어요.',
      ],
      useCases: [
        {
          title: '로고 복구',
          description: '원본 파일이 더 이상 없는 PNG 로고를 벡터화하세요.',
        },
        {
          title: '아이콘과 모노그램',
          description: '단순한 아이콘을 확대해도 깨지지 않는 SVG로 바꾸세요.',
        },
        {
          title: '서명',
          description: '스캔한 서명을 벡터화해 깔끔하게 다시 사용하세요.',
        },
        {
          title: '선화',
          description: '흑백 아트워크를 편집 가능한 패스로 트레이싱하세요.',
        },
      ],
      whyMediaManipulator: [
        '진짜 potrace 벡터화예요. 잘하는 것(과 못하는 것)을 솔직하게 알려 드려요.',
        '임계값 조절로 트레이싱 결과를 원하는 대로 맞출 수 있어요.',
      ],
      privacyNote: '이미지는 저희 서버에서 흑백으로 단순화된 다음 potrace가 벡터 패스로 트레이싱해요. 외부 서비스로는 아무것도 전송되지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본은 절대 변경되지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: 'PNG를 SVG로 무료 변환하려면 어떻게 하나요?',
          answer: '위에서 .png를 업로드하고, 필요하면 임계값을 조절한 다음 변환을 클릭하세요. 진짜 벡터 .svg를 받을 수 있어요.',
        },
        {
          question: '진짜 벡터화인가요, 아니면 PNG를 감싼 것뿐인가요?',
          answer: '진짜 벡터화예요. potrace로 이미지를 실제 SVG 패스로 트레이싱해요. PNG를 SVG 안에 넣어 두고 끝내지 않아요.',
        },
        {
          question: '사진도 벡터화되나요?',
          answer: '잘 되지 않아요. 벡터화는 로고, 아이콘, 서명, 선화를 위해 설계됐어요. 사진과 복잡한 그라데이션은 깔끔한 벡터 대신 크고 지저분한 패스를 만들어요.',
        },
        {
          question: '임계값 조절은 무슨 역할을 하나요?',
          answer: '트레이싱 전에 흑백을 나누는 기준값을 정해요. 더 많은(옅은) 디테일을 담으려면 높이고, 가장 굵은 도형만 남기려면 낮추세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '벡터화에는 서버에 potrace가 필요해요. 로고/아이콘/선화에 가장 알맞으며 사진에는 맞지 않아요.',
        ],
      },
      related: [
        {
          label: 'SVG를 PNG로 변환',
          to: '/tools/convert-svg-to-png',
          description: '반대 방향으로: SVG를 PNG로 래스터화하세요.',
        },
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: 'JPG, PNG, WebP, AVIF 등 여러 형식 사이를 변환하세요.',
        },
        {
          label: 'PNG를 ICO로',
          to: '/tools/png-to-ico',
          description: 'PNG를 파비콘으로 만드세요.',
        },
      ],
      embed: {
        title: 'PNG를 SVG로 벡터화',
        description: 'PNG를 업로드하세요. 출력은 SVG로 고정되며, SVG로 감싼 래스터가 아니라 진짜 벡터화(potrace)로 만들어져요. 흑백 임계값을 조절해 디테일을 더 많이 또는 더 적게 담으세요. 로고, 아이콘, 서명, 선화에 가장 알맞아요.',
      },
    },
    'png-to-ico': {
      name: 'PNG를 ICO로',
      h1: 'PNG를 ICO로 온라인 무료 변환',
      tagline: 'PNG를 웹사이트 파비콘과 Windows 앱 아이콘에 쓸 수 있는 여러 크기의 .ico 파일로 만들어요.',
      metaTitle: 'PNG를 ICO로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 PNG ICO 변환기예요. 웹사이트와 Windows 아이콘에 쓸 수 있는 여러 크기(16~256px)의 진짜 .ico 파비콘을 만드세요. 가입이 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'PNG를 ICO로 온라인 무료 변환',
      ogDescription: 'PNG로 진짜 다중 크기 .ico 파비콘을 만드세요. 무료, 빠른 처리, 가입 불필요.',
      intro: '파비콘은 브라우저와 Windows가 알맞은 크기를 고를 수 있도록 여러 크기가 담긴 진짜 .ico 파일이어야 해요. Media Manipulator는 이름만 바꾼 파일이 아니라, 표준 16~256 px 아이콘 크기 세트를 담은 진짜 다중 크기 ICO를 PNG로 만들어요.',
      whatItDoes: [
        'PNG 이미지로 진짜 .ico 컨테이너를 만들어요.',
        '여러 크기(16, 32, 48, 64, 128, 256 px)를 하나의 파일에 담아요.',
        '투명도를 유지해 아이콘이 어떤 배경에서도 깔끔하게 보여요.',
        '브라우저와 Windows가 파비콘/앱 아이콘으로 받아들이는 파일을 만들어요.',
      ],
      flowSteps: [
        {
          title: 'PNG 업로드',
          description: 'PNG를 끌어다 놓으세요. 정사각형 이미지가 가장 좋은 아이콘이 돼요.',
        },
        {
          title: '크기 생성',
          description: '이미지에서 표준 아이콘 크기를 하나씩 렌더링해요.',
        },
        {
          title: 'ICO로 묶기',
          description: '여러 크기를 하나의 진짜 .ico 컨테이너에 담아요.',
        },
        {
          title: 'ICO 다운로드',
          description: '사이트나 앱에 쓸 favicon.ico를 저장하세요.',
        },
      ],
      advancedDetails: [
        'ICO는 ImageMagick의 아이콘 자동 크기 조절로 만들어지며, 이름만 바꾼 PNG가 아닌 진짜 다중 이미지 컨테이너가 돼요.',
        '여러 크기를 넣어 두면 브라우저와 Windows가 상황(탭, 작업 표시줄, 바탕 화면)마다 가장 선명한 아이콘을 고를 수 있어요.',
        '가장 깔끔한 결과를 얻으려면 256×256 이상의 정사각형 PNG로 시작하세요. 그래야 모든 크기가 선명하게 축소돼요.',
      ],
      whyItMatters: [
        '브라우저는 진짜 .ico 파비콘을 기대해요. 이름만 바꾼 PNG는 작동하지 않거나 흐릿하게 보일 수 있어요.',
        '다중 크기 아이콘은 16px 탭부터 256px 바탕 화면 바로 가기까지 선명하게 유지돼요.',
        'Windows 앱 아이콘에는 .ico 형식이 필요해요.',
      ],
      useCases: [
        {
          title: '웹사이트 파비콘',
          description: '사이트 탭 아이콘용 favicon.ico를 만드세요.',
        },
        {
          title: 'Windows 앱 아이콘',
          description: '데스크톱 애플리케이션용 .ico를 만드세요.',
        },
        {
          title: '바로 가기',
          description: '바탕 화면 바로 가기용 선명한 아이콘을 만드세요.',
        },
        {
          title: '브랜딩',
          description: '로고 PNG를 제대로 된 아이콘 파일로 바꾸세요.',
        },
      ],
      whyMediaManipulator: [
        '이름만 바꾼 PNG가 아닌 진짜 다중 크기 ICO예요.',
        '깔끔한 아이콘을 위해 투명도를 유지해요.',
      ],
      privacyNote: '이미지는 저희 서버의 ImageMagick이 표준 아이콘 크기마다 크기를 조절해 하나의 .ico 파일에 담아요. 외부 서비스로는 아무것도 전송되지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본은 절대 변경되지 않으며, 새 파일을 다운로드하게 돼요.',
      faq: [
        {
          question: 'PNG를 ICO로 무료 변환하려면 어떻게 하나요?',
          answer: '위에서 .png를 업로드하고 변환을 클릭하세요. 진짜 다중 크기 .ico를 받을 수 있어요.',
        },
        {
          question: '진짜 ICO인가요, 이름만 바꾼 PNG인가요?',
          answer: '진짜 ICO예요. 여러 아이콘 크기를 만들어 진짜 .ico 컨테이너에 담아요. 브라우저와 Windows가 기대하는 바로 그 형식이에요.',
        },
        {
          question: '어떤 크기가 포함되나요?',
          answer: '표준 파비콘 크기 세트인 16, 32, 48, 64, 128, 256 px예요. 브라우저와 Windows가 상황마다 가장 알맞은 크기를 골라요.',
        },
        {
          question: '어떤 이미지가 가장 좋나요?',
          answer: '256×256 이상의 정사각형 PNG가 가장 선명한 결과를 내요. 더 작은 크기는 모두 그 이미지에서 깔끔하게 축소되기 때문이에요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '다중 크기 ICO(16/32/48/64/128/256 px)가 만들어져요. 가장 좋은 결과를 얻으려면 정사각형 이미지로 시작하세요.',
        ],
      },
      related: [
        {
          label: '이미지 변환기',
          to: '/tools/image-converter',
          description: 'JPG, PNG, WebP, AVIF 등 여러 형식 사이를 변환하세요.',
        },
        {
          label: 'SVG를 PNG로 변환',
          to: '/tools/convert-svg-to-png',
          description: '아이콘을 만들기 전에 SVG 로고를 래스터화하세요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '아이콘을 만들기 전에 정사각형 이미지를 준비하세요.',
        },
        {
          label: '이미지 배경 제거',
          to: '/tools/remove-background-from-image',
          description: '투명한 아이콘 원본을 만드세요.',
        },
      ],
      embed: {
        title: 'PNG를 ICO로 변환',
        description: 'PNG를 업로드하세요(정사각형 이미지가 가장 좋아요). 출력은 ICO로 고정되며, 16, 32, 48, 64, 128, 256 px 버전이 담긴 진짜 다중 크기 아이콘이 만들어져요.',
      },
    },
    'svg-converter': {
      name: 'SVG 변환기',
      tagline: 'SVG를 PNG로 바꾸거나 PNG를 SVG로 트레이싱해요. SVG를 시작점으로 둔 이미지 변환기예요.',
    },
    'convert-wav-to-mp3': {
      name: 'WAV를 MP3로 변환',
      h1: 'WAV를 MP3로 온라인 변환',
      tagline: '용량이 큰 무손실 WAV 녹음을 팟캐스트, 공유, 보관에 알맞은 호환성 좋은 MP3 파일로 줄여요.',
      metaTitle: 'WAV를 MP3로 온라인 변환 (무료) | Media Manipulator',
      metaDescription: '무료 온라인 WAV MP3 변환기예요. 무손실 .wav 녹음을 원하는 비트레이트의 더 작은 MP3 파일로 압축하세요.',
      ogTitle: 'WAV를 MP3로 온라인 변환',
      ogDescription: 'WAV 녹음을 원하는 비트레이트의 호환성 좋은 MP3 파일로 압축하세요.',
      intro: 'WAV 파일은 무손실이라 용량이 커요. MP3는 어디서나 호환되는 압축 오디오 형식으로, 모든 휴대폰, 노트북, 음악 앱에서 재생돼요. Media Manipulator는 WAV를 원하는 비트레이트의 MP3로 다시 인코딩하므로, 음질은 아주 조금만 내주고 5~10배 작은 파일을 얻을 수 있어요.',
      whatItDoes: [
        'WAV 녹음을 선택한 비트레이트의 MP3로 다시 인코딩해요.',
        '샘플 레이트, 채널, 비트레이트(128~320 kbps)를 직접 설정할 수 있어요.',
        '음량을 유지하고 불필요한 리샘플링을 피해요.',
        'ID3 태그가 붙은 표준 .mp3 파일을 출력해요.',
      ],
      flowSteps: [
        {
          title: 'WAV 업로드',
          description: '컴퓨터에 있는 .wav 파일을 끌어다 놓으세요.',
        },
        {
          title: '비트레이트 선택',
          description: '음성은 192 kbps, 음악은 256~320 kbps.',
        },
        {
          title: 'MP3 인코딩',
          description: 'FFmpeg가 선택한 설정으로 깔끔한 MP3를 인코딩해요.',
        },
        {
          title: 'MP3 다운로드',
          description: '어디서나 호환되는 .mp3를 저장하세요.',
        },
      ],
      advancedDetails: [
        '내부적으로 FFmpeg를 통해 LAME 방식으로 인코딩해요.',
        'MP3는 손실 코덱이에요. 음악은 256 kbps 정도에서 음질 향상이 거의 멈춰요. 음성 콘텐츠는 128~192 kbps에서도 훌륭하게 들려요.',
        '손실 없이 더 작은 파일이 필요하면 대신 FLAC나 ALAC를 사용하세요. 플레이어를 직접 정할 수 있다면, 가장 작은 최신 손실 파일을 위해 Opus(OGG 컨테이너)를 사용하세요.',
      ],
      whyItMatters: [
        '적절한 비트레이트 기준으로 WAV 파일은 같은 내용의 MP3보다 5~10배 커요.',
        'MP3는 모든 기기에서 재생돼요. 코덱 호환성 문제가 없어요.',
        '팟캐스트, 오디오북, 음악 플랫폼은 대개 MP3 업로드를 요구하거나 선호해요.',
      ],
      useCases: [
        {
          title: '팟캐스트 에피소드',
          description: 'WAV로 마스터링하고 96~128 kbps 모노 MP3로 게시하세요.',
        },
        {
          title: '음성 메모',
          description: '휴대폰 녹음을 공유하거나 보관하기 전에 용량을 줄이세요.',
        },
        {
          title: '음악 데모',
          description: '첨부 파일 용량 걱정 없이 256~320 kbps로 믹스를 보내세요.',
        },
        {
          title: '웹사이트에 삽입',
          description: '호환성을 위해 MP3를 사용하세요. 모든 브라우저가 기본으로 재생해요.',
        },
      ],
      whyMediaManipulator: [
        '비트레이트, 샘플 레이트, 채널 구성을 정확히 고를 수 있어요.',
        '무료이고, 가입도 워터마크도 없으며, 출력물은 온전히 여러분의 것이에요.',
        '다른 도구들과 같은 보관 기간 기반 개인정보 보호 방식을 따라요.',
      ],
      privacyNote: 'WAV는 저희 서버의 FFmpeg가 선택한 비트레이트의 MP3로 인코딩해요. 외부 오디오 서비스는 관여하지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 새 파일을 받게 되며, 업로드한 파일 자체는 변경되지 않아요.',
      faq: [
        {
          question: '어떤 비트레이트를 골라야 하나요?',
          answer: '192 kbps가 균형 잡힌 기본값이에요. 음성/팟캐스트는 128 kbps, 음악은 256~320 kbps를 사용하세요.',
        },
        {
          question: '음질이 떨어지나요?',
          answer: '약간 떨어져요. MP3는 손실 형식이에요. 256 kbps 이상에서는 대부분의 청취자가 원본 WAV와 차이를 구분하지 못해요.',
        },
        {
          question: '다른 형식도 MP3로 변환할 수 있나요?',
          answer: '네. 오디오 변환기는 FLAC, M4A/AAC, OGG, OPUS 등을 받아요. 범용 오디오 변환기 도구를 사용하세요.',
        },
        {
          question: '파일 크기 제한이 있나요?',
          answer: '적당한 크기의 파일은 받아요. 아주 긴 녹음이라면 먼저 잘라 내는 것을 고려하세요.',
        },
      ],
      related: [
        {
          label: '오디오 변환기',
          to: '/tools/audio-converter',
          description: '어떤 오디오 형식끼리든 변환하세요.',
        },
        {
          label: '노래에서 보컬 분리',
          to: '/tools/isolate-vocals-from-song',
          description: '음악 트랙에서 보컬을 추출하세요.',
        },
        {
          label: '오디오 변환기 튜토리얼',
          to: '/tutorials/audio/getting-started',
          description: 'AI 도구를 포함한 모든 오디오 옵션을 단계별로 살펴보세요.',
        },
      ],
      embed: {
        title: 'WAV를 MP3로 변환',
        description: 'WAV 파일을 업로드하고 출력 형식으로 MP3를 고르세요. 음성에는 192 kbps가 좋은 기본값이고, 음악에는 256~320 kbps를 사용하세요.',
      },
    },
    'isolate-vocals-from-song': {
      name: '노래에서 보컬 분리',
      h1: '노래에서 보컬 온라인 분리',
      tagline: '리믹스, 커버, 받아쓰기, 분석을 위해 음악 트랙에서 보컬을 추출해요. 사용 권한이 있는 음악에만 사용하세요.',
      metaTitle: '노래에서 보컬 온라인 분리 (무료) | Media Manipulator',
      metaDescription: '무료 온라인 보컬 분리 도구예요. 리믹스, 커버, 받아쓰기, 분석을 위해 노래에서 보컬을 깔끔한 스템으로 추출하세요.',
      ogTitle: '노래에서 보컬 온라인 분리',
      ogDescription: '리믹스, 커버, 받아쓰기, 분석을 위해 노래에서 보컬을 깔끔하게 분리된 스템으로 추출하세요.',
      intro: 'AI 기반 음원 분리로 완성된 믹스에서 보컬 트랙을 뽑아낼 수 있어요. 리믹스, 커버, 노래방 준비, 가사 받아쓰기에 좋아요. Media Manipulator는 자체 GPU 서버에서 분리 작업을 실행해요. 결과물은 다운로드해 어디서든 쓸 수 있는 보컬 스템 하나예요. 단, 원본 음원에 대해 그렇게 할 권리가 있어야 해요.',
      whatItDoes: [
        'AI 기반 음원 분리를 실행해 음악 녹음에서 보컬 트랙을 추출해요.',
        '분리된 보컬 스템 하나를 원본 파일과 같은 형식(MP3는 MP3 그대로)으로, 또는 선택하면 FLAC, WAV, MP3로 출력해요.',
        '노이즈 제거, EQ 같은 오디오 정리 도구와 함께 쓰면 완성도 높은 결과를 얻을 수 있어요.',
        'WAV, MP3, FLAC, M4A, OGG, OPUS 등 다양한 입력을 지원해요.',
      ],
      flowSteps: [
        {
          title: '노래 업로드',
          description: '보컬과 음악이 섞인 일반적인 오디오 파일을 끌어다 놓으세요.',
        },
        {
          title: 'AI 분리 실행',
          description: '로컬 GPU 모델이 보컬을 나머지 믹스에서 분리해요.',
        },
        {
          title: '정리(선택)',
          description: '노이즈 제거, EQ, 게인을 적용해 스템을 다듬으세요.',
        },
        {
          title: '보컬 스템 다운로드',
          description: '분리된 보컬을 저장하세요. 기본은 원본 파일과 같은 형식이고, FLAC, WAV, MP3도 고를 수 있어요.',
        },
      ],
      advancedDetails: [
        '음원 분리는 본질적으로 완벽하지 않아요. 리버브, 화음, 강한 이펙트가 결과물에 섞여 들어가요.',
        'MP3 등 압축 파일은 원래 형식(MP3는 320 kbps)으로 돌아와요. 무손실 파일(WAV, FLAC, AIFF)은 FLAC로 돌아와요. FLAC와 WAV는 DAW에서 추가로 편집할 때 디테일을 가장 많이 유지하며, WAV가 가장 커요.',
        '노래방용(반주만)이라면 대신 오디오 변환기의 전용 "보컬 제거" 모드를 사용하세요.',
      ],
      whyItMatters: [
        '프로듀서와 리믹서는 기존 보컬을 중심으로 새 트랙을 만들 수 있어요.',
        '가수는 가사나 멜로디를 더 정확하게 받아 적을 수 있어요.',
        '교육자와 오디오 엔지니어는 분리된 스템으로 믹싱 기법을 연구해요.',
      ],
      useCases: [
        {
          title: '리믹스와 커버',
          description: '분리된 보컬을 중심으로 새 반주를 만드세요.',
        },
        {
          title: '가사와 멜로디 받아쓰기',
          description: '직접 또는 AI로 받아 적을 때 더 깨끗한 신호를 얻으세요.',
        },
        {
          title: '노래방 준비',
          description: '분리된 보컬을 별도의 반주 버전과 함께 사용하세요.',
        },
        {
          title: '오디오 엔지니어링 연습',
          description: '상업 음반으로 믹싱 기법을 공부하세요.',
        },
      ],
      whyMediaManipulator: [
        '로컬 GPU AI라서 외부 AI 제공업체가 오디오를 볼 수 없어요.',
        '한 번 업로드로 EQ, 노이즈 제거, 자르기를 함께 적용할 수 있어요.',
        '무료이고, 가입이 필요 없으며, 출력물에 워터마크가 없어요.',
      ],
      privacyNote: '노래는 저희 자체 GPU 서버의 Demucs가 스템으로 분리하며, 보컬 스템만 돌려드려요. 외부 오디오 서비스는 관여하지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 새 파일을 받게 되며, 업로드한 파일 자체는 변경되지 않아요.',
      faq: [
        {
          question: '완벽하게 깨끗하게 분리되나요?',
          answer: '완벽한 음원 분리 도구는 없어요. 특히 강한 리버브와 화음 주변에서 약간의 아티팩트가 생길 수 있어요. 나중에 DAW에서 스템을 정리할 계획이라면 FLAC나 WAV 출력을 고르세요.',
        },
        {
          question: '어떤 오디오 형식을 지원하나요?',
          answer: 'WAV, MP3, FLAC, M4A/AAC, OGG, OPUS 및 대부분의 일반적인 오디오 형식을 지원해요.',
        },
        {
          question: '저작권이 있는 음악에 사용해도 되나요?',
          answer: '권리를 보유하고 있거나, 라이선스가 있거나, 해당 관할권의 공정 이용 범위 안에 있을 때만 가능해요. 출력물을 어떻게 사용하는지는 여러분의 책임이에요.',
        },
        {
          question: '반주만 받으려면 어떻게 하나요?',
          answer: '오디오 변환기의 "보컬 제거" AI 모드를 사용하세요. 같은 업로드로 다른 결과물을 얻을 수 있어요.',
        },
      ],
      related: [
        {
          label: '오디오 변환기',
          to: '/tools/audio-converter',
          description: '분리한 뒤 스템을 변환하고 정리하세요.',
        },
        {
          label: 'WAV를 MP3로 변환',
          to: '/tools/convert-wav-to-mp3',
          description: '공유하기 좋게 WAV 스템을 MP3로 압축하세요.',
        },
        {
          label: '오디오 변환기 튜토리얼',
          to: '/tutorials/audio/getting-started',
          description: 'AI 도구를 포함한 모든 오디오 옵션을 단계별로 살펴보세요.',
        },
      ],
      embed: {
        title: '보컬 분리',
        description: '노래를 업로드하고 버튼을 누르세요. 보컬 분리가 이미 선택되어 있어요. 결과는 원본 파일과 같은 형식(MP3는 MP3 그대로)으로 돌아오며, 무손실을 원하면 출력 형식에서 FLAC나 WAV를 고르세요.',
      },
    },
    'image-converter': {
      name: '이미지 변환기',
      h1: '무료 온라인 이미지 변환기',
      tagline: 'JPG, PNG, WebP, AVIF, GIF 등 여러 형식 사이를 변환해요. 품질, 크기 조정, 자르기, 메타데이터도 직접 정할 수 있어요.',
      metaTitle: '무료 온라인 이미지 변환기 | Media Manipulator',
      metaDescription: 'JPG, PNG, WebP, AVIF, GIF, HEIC를 지원하는 무료 온라인 이미지 변환기입니다. 한 번의 업로드로 크기 조절, 압축, 자르기, 메타데이터 삭제까지 할 수 있어요.',
      ogTitle: '무료 온라인 이미지 변환기',
      ogDescription: 'JPG, PNG, WebP, AVIF, GIF, HEIC를 변환하세요. 한 번의 업로드로 크기 조절, 압축, 메타데이터 삭제까지 할 수 있어요.',
      intro: '이미지 하나가 여러 곳에 쓰여야 하는 경우가 많아요. 웹사이트, 프레젠테이션, 인쇄물, 마켓 판매 목록처럼요. 그리고 곳마다 선호하는 형식이 달라요. Media Manipulator는 품질, 크기 조절, 메타데이터를 세밀하게 설정하면서 모든 일반 이미지 형식을 한곳에서 처리해요.',
      whatItDoes: [
        'JPG, PNG, WebP, AVIF, GIF, HEIC 등 여러 형식 사이를 변환해요.',
        '크기 조절, 자르기, 회전, 시각 필터 적용을 한 번에 처리해요.',
        '필요에 따라 EXIF/IPTC/XMP 메타데이터를 지우거나 유지해요.',
        'AI 도구: 얼굴 흐림, 배경 제거, 업스케일링, 텍스트/개인정보 가리기.',
      ],
      flowSteps: [
        {
          title: '이미지 업로드',
          description: '일반적인 이미지 파일이면 무엇이든 끌어다 놓으세요.',
        },
        {
          title: '출력 형식 선택',
          description: 'JPG, PNG, WebP, AVIF, GIF.',
        },
        {
          title: '품질과 메타데이터 조정',
          description: '크기를 조절하거나, 자르거나, EXIF를 지우세요.',
        },
        {
          title: '다운로드',
          description: '변환된 이미지를 저장하세요.',
        },
      ],
      advancedDetails: [
        'WebP와 AVIF는 웹용 파일을 가장 작게 만들어요. 같은 시각적 품질에서 AVIF가 WebP보다 작은 경우가 많아요.',
        'PNG는 무손실이고 투명도를 지원해서 UI 에셋과 스크린샷에 잘 맞아요.',
        'JPG는 사진을 주고받을 때 가장 안전한 형식이에요.',
      ],
      whyItMatters: [
        '플랫폼과 도구마다 받아들이는 이미지 형식이 달라요.',
        '이미지 파일이 작을수록 페이지가 빨리 로드되고, Google은 빠른 페이지를 더 높게 평가해요.',
        '공유하기 전에 메타데이터를 지우면 개인 정보를 보호할 수 있어요.',
      ],
      useCases: [
        {
          title: '웹 최적화',
          description: 'PNG 사진을 WebP/AVIF로 변환해 페이지 용량을 줄이세요.',
        },
        {
          title: '플랫폼 간 공유',
          description: 'iPhone의 HEIC 사진을 JPG로 변환하세요.',
        },
        {
          title: '마켓 판매 목록',
          description: '게시하기 전에 메타데이터를 지우고 크기를 조절하세요.',
        },
        {
          title: '인쇄 및 프레젠테이션',
          description: '고품질 프리셋으로 JPG를 출력하세요.',
        },
      ],
      whyMediaManipulator: [
        '한 번의 업로드로 변환, 크기 조절, 자르기, 필터, AI, 메타데이터를 모두 처리해요.',
        '무료이고, 가입도 워터마크도 없어요.',
        'AI 도구는 저희 자체 GPU 서버에서 실행돼요.',
      ],
      privacyNote: '이미지는 저희 서버의 ImageMagick으로 변환되며, 요청한 경우 크기 조절이나 자르기도 함께 처리돼요. 외부 서비스로는 아무것도 전송되지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본은 절대 바뀌지 않고, 새 파일을 내려받게 돼요.',
      faq: [
        {
          question: '가장 좋은 이미지 형식은 무엇인가요?',
          answer: '용도에 따라 달라요. 웹에는 WebP/AVIF, 투명도가 필요하면 PNG, 호환성이 중요하면 JPG예요.',
        },
        {
          question: '여러 장을 한꺼번에 변환할 수 있나요?',
          answer: '무료 도구는 한 번에 이미지 한 장씩 변환해요. 여러 장은 차례대로 변환하세요.',
        },
        {
          question: '메타데이터가 지워지나요?',
          answer: '메타데이터 모드를 "제거"로 설정한 경우에만 지워져요. 기본값은 메타데이터 유지예요.',
        },
        {
          question: 'HEIC에서도 작동하나요?',
          answer: '네. iPhone의 HEIC 사진을 JPG, PNG, WebP로 깔끔하게 변환해요.',
        },
      ],
      related: [
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '정확한 픽셀 크기로 조절하세요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '웹용으로 이미지 파일 크기를 줄이세요.',
        },
        {
          label: '이미지를 PDF로',
          to: '/tools/image-to-pdf',
          description: '이미지를 PDF 문서로 만드세요.',
        },
        {
          label: 'PDF 변환기',
          to: '/tools/pdf-converter',
          description: 'PDF를 이미지로, 이미지를 다시 PDF로 변환하세요.',
        },
        {
          label: 'HEIC를 JPG로 변환',
          to: '/tools/convert-heic-to-jpg',
          description: 'iPhone의 HEIC 사진을 JPG로 변환하세요.',
        },
        {
          label: '이미지 배경 제거',
          to: '/tools/remove-background-from-image',
          description: '배경을 자동으로 지워 투명 PNG로 만드세요.',
        },
        {
          label: 'WebP를 JPG로 변환',
          to: '/tools/convert-webp-to-jpg',
          description: 'WebP → JPG 전용 변환기예요.',
        },
        {
          label: '이미지 변환기 튜토리얼',
          to: '/tutorials/image/getting-started',
          description: '모든 옵션을 처음부터 끝까지 안내해요.',
        },
      ],
      embed: {
        title: '이미지 변환하기',
        description: '이미지를 업로드하고 출력 형식, 품질, 크기 조절/자르기 설정을 고르세요. 사진에는 JPG가, 투명도를 유지하려면 PNG가 알맞고, WebP/AVIF는 웹용 파일을 가장 작게 만들어요.',
      },
    },
    'video-converter': {
      name: '동영상 변환기',
      h1: '무료 온라인 동영상 변환기',
      tagline: 'MP4, WebM, MOV, AVI, MKV 등 여러 형식 사이를 변환해요. 코덱, 해상도, 오디오도 자유롭게 설정할 수 있어요.',
      metaTitle: '무료 온라인 동영상 변환기 | Media Manipulator',
      metaDescription: 'MP4, WebM, MOV, AVI, MKV 등을 지원하는 무료 온라인 동영상 변환기입니다. 코덱, 비트레이트, 해상도, 오디오 설정을 직접 고르세요.',
      ogTitle: '무료 온라인 동영상 변환기',
      ogDescription: 'MP4, WebM, MOV, AVI, MKV, FLV, WMV 등을 변환하세요. 코덱, 비트레이트, 오디오 설정을 직접 고를 수 있어요.',
      intro: '플랫폼마다 원하는 동영상 형식이 달라요. Mac에서는 MOV로 편집하고, 웹에는 MP4나 WebM으로 올리고, 보관은 MKV로 하죠. Media Manipulator는 비트레이트, 해상도, 오디오를 완전히 제어하면서 모든 일반 동영상 컨테이너와 코덱을 한곳에서 처리해요.',
      whatItDoes: [
        'MP4, WebM, MOV, AVI, MKV, FLV, WMV, ProRes 사이를 변환해요.',
        '코덱(H.264, H.265, VP9, ProRes, DNxHD)을 선택해요.',
        '크기 조절, 프레임 레이트 변경, 자르기, 오디오 재인코딩을 해요.',
        '필요하면 필터와 색 보정을 적용해요.',
      ],
      flowSteps: [
        {
          title: '동영상 업로드',
          description: '일반적인 동영상 컨테이너면 무엇이든 끌어다 놓으세요.',
        },
        {
          title: '대상 형식 선택',
          description: 'MP4, WebM, MOV, AVI, MKV.',
        },
        {
          title: '코덱과 품질 조정',
          description: '비트레이트, 해상도, 오디오.',
        },
        {
          title: '다운로드',
          description: '변환된 동영상을 저장하세요.',
        },
      ],
      advancedDetails: [
        'MP4에 담긴 H.264는 어디서나 안전한 기본 선택이에요.',
        'H.265(HEVC)와 VP9는 같은 시각적 품질에서 파일이 약 25–50% 작지만, 최신 플레이어가 필요해요.',
        '편집용으로 넘길 때는 ProRes(MOV) 또는 DNxHD(MOV/MXF)가 품질을 가장 잘 보존해요.',
      ],
      whyItMatters: [
        '편집 앱, 브라우저, 소셜 플랫폼마다 선호하는 형식이 달라요.',
        '동영상 파일이 작을수록 페이지 로드 시간과 대역폭 비용이 줄어요.',
        '재인코딩하면 잘못된 코덱이나 재생되지 않는 파일을 고칠 수 있어요.',
      ],
      useCases: [
        {
          title: 'MOV → MP4',
          description: 'Apple 기기로 찍은 영상을 어디서나 재생되게 만드세요.',
        },
        {
          title: 'AVI → MP4',
          description: '오래된 보관용 동영상을 최신 형식으로 바꾸세요.',
        },
        {
          title: 'MP4 → WebM',
          description: '최신 브라우저용으로 웹 동영상 용량을 줄이세요.',
        },
        {
          title: '편집용 전달',
          description: '고품질 편집을 위해 ProRes나 DNxHD로 내보내세요.',
        },
      ],
      whyMediaManipulator: [
        '한 번의 업로드로 코덱, 비트레이트, 오디오를 완전히 제어할 수 있어요.',
        '같은 파일로 AI 받아쓰기도 할 수 있어요.',
        '무료이고, 가입도 워터마크도 없어요.',
      ],
      privacyNote: '동영상은 저희 서버의 FFmpeg로 선택한 컨테이너와 코덱으로 재인코딩돼요. 작업은 제삼자 트랜스코딩 서비스가 아니라 저희 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고, 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: '어떤 출력 형식이 가장 좋나요?',
          answer: '호환성에는 H.264를 쓴 MP4, 가장 작은 웹용 파일에는 VP9를 쓴 WebM이 좋아요.',
        },
        {
          question: '변환하기 전에 자를 수 있나요?',
          answer: '네. 양식의 자르기 섹션에서 재인코딩 전에 클립을 잘라 낼 수 있어요.',
        },
        {
          question: '오디오 싱크가 유지되나요?',
          answer: '네. FFmpeg가 오디오와 영상의 싱크를 유지해요. 프레임 레이트나 재생 속도를 바꾸면 오디오도 그에 맞게 리샘플링돼요.',
        },
        {
          question: '파일 크기 제한이 있나요?',
          answer: '무료 요금제에서는 아주 큰 파일이 거부될 수 있어요. 먼저 해상도를 낮춰 보세요.',
        },
      ],
      related: [
        {
          label: 'MOV를 MP4로 변환',
          to: '/tools/convert-mov-to-mp4',
          description: 'QuickTime/iPhone 영상을 어디서나 재생되게 만드세요.',
        },
        {
          label: 'WebM을 MP4로 변환',
          to: '/tools/convert-webm-to-mp4',
          description: '웹 동영상을 편집 가능한 MP4로 바꾸세요.',
        },
        {
          label: 'MP4를 WebM으로 변환',
          to: '/tools/convert-mp4-to-webm',
          description: 'MP4를 웹용 VP9 WebM으로 줄이세요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '동영상 파일 크기를 줄이는 전용 압축기예요.',
        },
        {
          label: '동영상을 GIF로 변환',
          to: '/tools/convert-video-to-animated-gif',
          description: '짧은 클립을 움직이는 GIF로 바꾸세요.',
        },
        {
          label: '동영상에서 오디오 추출',
          to: '/tools/extract-audio-from-video',
          description: '사운드트랙을 MP3, WAV, M4A로 저장하세요.',
        },
        {
          label: '동영상 자르기',
          to: '/tools/video-trimmer',
          description: '클립에서 원하는 부분만 손실 없이 잘라 내세요.',
        },
        {
          label: '동영상 크기 조정',
          to: '/tools/resize-video',
          description: '해상도를 1080p, 720p 또는 원하는 크기로 바꾸세요.',
        },
        {
          label: '동영상 회전',
          to: '/tools/rotate-video',
          description: '옆으로 눕거나 뒤집힌 영상을 바로잡으세요.',
        },
        {
          label: '동영상 텍스트 변환',
          to: '/tools/transcribe-video',
          description: '동영상 속 음성을 텍스트나 VTT 자막으로 추출하세요.',
        },
        {
          label: 'AI 프레임 보간',
          to: '/tools/ai-frame-interpolation',
          description: 'AI가 생성한 프레임으로 동영상 FPS를 48, 60 또는 120으로 높이세요.',
        },
        {
          label: '동영상을 HLS로 트랜스코딩',
          to: '/tools/transcode-to-hls',
          description: '어떤 동영상이든 적응형 HLS 패키지로 만드세요.',
        },
        {
          label: '동영상을 DASH로 트랜스코딩',
          to: '/tools/transcode-to-dash',
          description: '어떤 동영상이든 MPEG-DASH AV1/VP9 패키지로 만드세요.',
        },
        {
          label: '동영상 변환기 튜토리얼',
          to: '/tutorials/video/getting-started',
          description: '모든 옵션을 처음부터 끝까지 안내해요.',
        },
      ],
      embed: {
        title: '동영상 변환하기',
        description: '동영상을 업로드하고 대상 컨테이너/코덱을 고르세요. "중간" 품질 프리셋이 무난한 기본값이에요. MP4는 어디서나 재생되고, WebM은 최신 브라우저에서 더 작은 파일을 만들어요.',
      },
    },
    'mp4-converter': {
      name: 'MP4 변환기',
      tagline: '동영상을 MP4로 변환해요. MP4가 미리 선택된 동영상 변환기예요.',
    },
    'convert-mov-to-mp4': {
      name: 'MOV를 MP4로 변환',
      h1: 'MOV를 MP4로 온라인 무료 변환',
      tagline: 'QuickTime과 iPhone의 .mov 파일을 어디서나 재생하고 업로드할 수 있는 MP4로 바꿔요.',
      metaTitle: 'MOV를 MP4로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 MOV MP4 변환기예요. QuickTime과 iPhone의 .mov 동영상을 어디서나 재생되는 MP4로 변환하세요. 워터마크도 가입도 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'MOV를 MP4로 온라인 무료 변환',
      ogDescription: 'QuickTime / iPhone MOV 파일을 어떤 기기에서나 업로드하고 재생할 수 있는 범용 MP4로 변환하세요.',
      intro: 'MOV는 Apple의 QuickTime 컨테이너로, iPhone, Mac, 그리고 많은 카메라가 기본으로 녹화하는 형식이에요. Apple 생태계 안에서는 훌륭하지만 Windows, Android, 일부 업로드 양식에서는 재생되지 않을 수 있어요. MOV를 MP4로 변환하면 같은 H.264 동영상과 AAC 오디오를 전 세계 어디서나 받아들이는 컨테이너에 담을 수 있고, 대개 눈에 보이는 화질 변화도 없어요.',
      whatItDoes: [
        'QuickTime / iPhone .mov 파일을 MP4로 변환해요.',
        '출력을 MP4(H.264 + AAC)로 고정해 결과물이 어디서나 재생돼요.',
        '-pix_fmt yuv420p와 +faststart를 추가해 MP4가 브라우저에서 재생되고 바로 시작돼요.',
        '같은 업로드에서 MOV를 자르거나, 크기를 조정하거나, 품질 프리셋을 고를 수 있어요.',
      ],
      flowSteps: [
        {
          title: 'MOV 업로드',
          description: 'iPhone, Mac 또는 카메라의 .mov 파일을 끌어다 놓으세요.',
        },
        {
          title: '출력은 MP4로 고정',
          description: '형식을 고를 필요가 없어요. 이 도구는 MP4로 설정돼 있어요.',
        },
        {
          title: '변환',
          description: '동영상을 깔끔한 MP4로 다시 감싸거나 다시 인코딩해요.',
        },
        {
          title: '다운로드',
          description: '어떤 기기나 플랫폼에서도 쓸 수 있는 MP4를 저장하세요.',
        },
      ],
      advancedDetails: [
        '대부분의 MOV 파일에는 이미 H.264 동영상이 들어 있어서, 품질을 높음으로 하면 변환이 빠르고 거의 무손실이에요.',
        'yuv420p 크로마를 강제로 적용해 Safari와 4:2:2/4:4:4 동영상을 거부하는 소셜 플랫폼에서도 MP4가 재생돼요.',
        'MOV에 ProRes가 들어 있으면 변환기가 H.264로 트랜스코딩해요. 디테일을 최대한 살리려면 품질을 높음으로 선택하세요.',
      ],
      whyItMatters: [
        'MOV는 추가 코덱 없이는 Windows나 Android에서 재생되지 않는 경우가 많아요.',
        '많은 업로드 양식과 편집기가 MP4는 받지만 MOV는 거부해요.',
        'iPhone 동영상을 누구와든 공유하기에 가장 안전한 형식은 MP4예요.',
      ],
      useCases: [
        {
          title: 'iPhone 동영상',
          description: 'iPhone으로 녹화한 .mov를 Windows PC에서 재생되도록 변환하세요.',
        },
        {
          title: '웹에 업로드',
          description: 'QuickTime으로 내보낸 파일을 웹사이트가 받아 주는 MP4로 바꾸세요.',
        },
        {
          title: 'Apple 기기를 쓰지 않는 사람에게 보내기',
          description: 'Android와 Windows 사용자에게 재생 문제 없이 영상을 공유하세요.',
        },
        {
          title: '편집기 호환성',
          description: '원본 MOV를 잘 다루지 못하는 편집기에 MP4를 넣으세요.',
        },
      ],
      whyMediaManipulator: [
        '검증된 MP4 프로필로 출력이 고정돼 설정을 추측할 필요가 없어요.',
        '서버 측 FFmpeg가 ProRes나 HEVC가 담긴 MOV 원본도 처리해요.',
      ],
      privacyNote: 'MOV는 저희 서버의 FFmpeg가 H.264 및 AAC MP4로 다시 인코딩해요. 작업은 외부 트랜스코딩 서비스가 아닌 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: 'MOV를 MP4로 어떻게 변환하나요?',
          answer: '.mov 파일을 업로드하고 변환을 클릭하세요. 출력이 이미 MP4로 설정돼 있어서 더 고를 것이 없어요.',
        },
        {
          question: 'MOV를 MP4로 변환하면 화질이 떨어지나요?',
          answer: '대부분의 MOV 파일은 H.264를 사용하므로 품질을 높음으로 하면 다시 인코딩해도 눈으로는 거의 무손실이에요. 더 낮은 프리셋은 화질을 조금 양보하는 대신 파일이 작아져요.',
        },
        {
          question: 'iPhone MOV가 Windows에서 재생되지 않는 이유는 무엇인가요?',
          answer: 'Windows에 QuickTime/HEVC 코덱이 없을 수 있어요. H.264 + AAC를 사용하는 MP4는 추가 소프트웨어 없이 재생돼요.',
        },
        {
          question: 'QuickTime을 MP4로 변환하는 것과 같은 건가요?',
          answer: '네. QuickTime 파일은 .mov 컨테이너를 사용하므로, QuickTime을 MP4로 변환하는 도구가 바로 이 도구예요.',
        },
        {
          question: '워터마크나 가입이 있나요?',
          answer: '워터마크가 없고 계정도 필요 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '출력은 MP4(H.264 + AAC, yuv420p, +faststart)로 고정돼요.',
        ],
      },
      related: [
        {
          label: '동영상 변환기',
          to: '/tools/video-converter',
          description: '어떤 동영상이든 MP4로 변환하세요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '이메일이나 웹에 맞게 MP4를 줄이세요.',
        },
        {
          label: '동영상을 GIF로 변환',
          to: '/tools/convert-video-to-animated-gif',
          description: '클립을 잘라 애니메이션 GIF로 내보내세요.',
        },
        {
          label: '동영상 변환기 튜토리얼',
          to: '/tutorials/video/getting-started',
          description: '자르기, 크기 조정, 품질 옵션을 차례로 알아보세요.',
        },
      ],
      embed: {
        title: 'MOV를 MP4로 변환',
        description: '.mov 파일을 업로드하세요. 이 도구는 출력이 MP4(H.264 + AAC)로 고정돼 있으니 업로드하고 변환하기만 하면 돼요.',
      },
    },
    'convert-webm-to-mp4': {
      name: 'WebM을 MP4로 변환',
      h1: 'WebM을 MP4로 온라인 무료 변환',
      tagline: '웹에 최적화된 .webm 동영상을 편집, 공유하고 어떤 기기에서나 재생할 수 있는 MP4로 바꿔요.',
      metaTitle: 'WebM을 MP4로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 WebM MP4 변환기예요. WebM을 열지 못하는 편집기와 기기를 위해 .webm(VP8/VP9) 동영상을 MP4(H.264 + AAC)로 변환하세요. 워터마크도 가입도 없어요.',
      ogTitle: 'WebM을 MP4로 온라인 무료 변환',
      ogDescription: '.webm 동영상을 편집기, 휴대폰, TV에서 재생할 수 있는 범용 MP4로 변환하세요.',
      intro: 'WebM은 웹을 위해 만들어진 최신 개방형 컨테이너예요. 파일이 작아서 브라우저 동영상에 아주 좋아요. 하지만 많은 동영상 편집기, 오래된 기기, 메신저 앱은 WebM을 열지 못해요. WebM을 MP4로 변환하면 VP8/VP9 동영상은 H.264로, 오디오는 AAC로 다시 인코딩되어 Premiere, Resolve, 휴대폰, TV에서 모두 쓸 수 있는 파일이 돼요.',
      whatItDoes: [
        '.webm(VP8/VP9 + Vorbis/Opus) 동영상을 MP4로 변환해요.',
        '호환성을 최대로 높이기 위해 출력을 MP4(H.264 + AAC)로 고정해요.',
        'yuv420p와 +faststart를 추가해 MP4가 모든 브라우저에서 재생되고 바로 시작돼요.',
        'WebM 화면 녹화를 MP4로 변환하면서 자르거나 크기를 조정할 수 있어요.',
      ],
      flowSteps: [
        {
          title: 'WebM 업로드',
          description: '웹에서 내려받았거나 화면 녹화 프로그램으로 만든 .webm 파일을 끌어다 놓으세요.',
        },
        {
          title: '출력은 MP4로 고정',
          description: '이 도구는 MP4로 미리 설정돼 있어서 따로 설정할 것이 없어요.',
        },
        {
          title: '변환',
          description: 'VP8/VP9를 H.264 + AAC로 트랜스코딩해요.',
        },
        {
          title: '다운로드',
          description: '어디서나 편집하고 재생할 수 있는 MP4를 저장하세요.',
        },
      ],
      advancedDetails: [
        'WebM은 대부분의 편집기가 가져올 수 없는 VP8/VP9 동영상을 사용해요. MP4/H.264는 모든 NLE에 문제없이 들어가요.',
        'yuv420p를 강제로 적용해 Safari와 소셜 플랫폼에서도 MP4가 재생돼요.',
        '실제로 더 작은 웹용 파일이 필요하다면, 반대 방향의 MP4-WebM 변환 도구가 대신 VP9 WebM을 만들어 줘요.',
      ],
      whyItMatters: [
        '대부분의 데스크톱 편집기는 WebM을 가져오지 못하지만 MP4는 기본으로 지원해요.',
        '일부 휴대폰, TV, 채팅 앱은 WebM 재생을 거부해요.',
        'WebM으로 내려받은 동영상을 넘겨줄 때 안전한 형식은 MP4예요.',
      ],
      useCases: [
        {
          title: '내려받은 동영상 편집',
          description: '.webm 클립을 MP4로 Premiere나 Resolve에 가져오세요.',
        },
        {
          title: '화면 녹화',
          description: 'WebM 화면 녹화를 공유하기 쉬운 MP4로 변환하세요.',
        },
        {
          title: '오래된 기기에서 재생',
          description: 'WebM을 지원하지 않는 TV나 휴대폰에서도 파일이 재생되게 하세요.',
        },
        {
          title: '메신저 앱',
          description: 'MP4는 받지만 WebM은 받지 않는 앱으로 동영상을 보내세요.',
        },
      ],
      whyMediaManipulator: [
        '서버 측 FFmpeg가 VP8과 VP9를 안정적으로 디코딩해요.',
        '검증된 MP4 프로필로 출력이 고정돼요.',
      ],
      privacyNote: 'WebM은 저희 서버의 FFmpeg가 VP8 또는 VP9에서 H.264 MP4로 다시 인코딩해요. 작업은 외부 트랜스코딩 서비스가 아닌 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: 'WebM을 MP4로 어떻게 변환하나요?',
          answer: '.webm 파일을 업로드하고 변환을 클릭하세요. 출력이 이미 MP4로 설정돼 있어요.',
        },
        {
          question: '편집기에서 WebM을 열 수 없는 이유는 무엇인가요?',
          answer: '대부분의 편집기에는 VP8/VP9 가져오기 기능이 없어요. MP4(H.264)로 변환하면 가져오기 문제가 해결돼요.',
        },
        {
          question: '파일이 더 커지나요?',
          answer: '같은 화질이라면 MP4/H.264가 VP9 WebM보다 약간 클 수 있어요. 크기가 중요하다면 더 낮은 품질 프리셋을 고르세요.',
        },
        {
          question: '오디오도 유지되나요?',
          answer: '네. Vorbis/Opus 오디오는 AAC로 다시 인코딩되고 싱크도 그대로 맞아요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '출력은 MP4(H.264 + AAC, yuv420p, +faststart)로 고정돼요.',
        ],
      },
      related: [
        {
          label: '동영상 변환기',
          to: '/tools/video-converter',
          description: '어떤 동영상이든 MP4로 변환하세요.',
        },
        {
          label: 'MP4를 WebM으로 변환',
          to: '/tools/convert-mp4-to-webm',
          description: '반대 방향이에요. 작은 VP9 WebM을 만드세요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '공유하기 좋게 MP4를 줄이세요.',
        },
      ],
      embed: {
        title: 'WebM을 MP4로 변환',
        description: '.webm 파일을 업로드하세요. 이 도구는 출력이 MP4(H.264 + AAC)로 고정돼 있으니 업로드하고 변환하기만 하면 돼요.',
      },
    },
    'convert-avi-to-mp4': {
      name: 'AVI를 MP4로 변환',
      h1: 'AVI를 MP4로 온라인 무료 변환',
      tagline: '오래된 .avi 동영상을 모든 휴대폰, 브라우저, TV에서 재생되는 작은 MP4로 새롭게 바꿔요.',
      metaTitle: 'AVI를 MP4로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 AVI MP4 변환기예요. 오래된 .avi(Xvid/DivX) 동영상을 어디서나 재생되는 MP4(H.264 + AAC)로 변환하세요. 워터마크도 가입도 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'AVI를 MP4로 온라인 무료 변환',
      ogDescription: '오래된 .avi 동영상을 어떤 기기에서나 재생되는 작고 최신인 MP4로 변환하세요.',
      intro: 'AVI는 DivX/Xvid 시대의 고전적인 Windows 컨테이너예요. 파일이 큰 경우가 많고, 요즘 휴대폰, 브라우저, TV가 더는 재생하지 않는 코덱을 사용해요. AVI를 MP4로 변환하면 동영상은 효율적인 H.264로, 오디오는 AAC로 다시 인코딩되어, 지금 가진 어떤 기기에서도 재생되는 더 작은 파일이 만들어져요.',
      whatItDoes: [
        '오래된 .avi(Xvid, DivX, MJPEG 등)를 MP4로 변환해요.',
        '최신 기기에서 재생되도록 출력을 MP4(H.264 + AAC)로 고정해요.',
        '대개 AVI 원본보다 눈에 띄게 작은 파일이 만들어져요.',
        '오래된 AVI를 변환하면서 잘라 내고 크기를 조정할 수 있어요.',
      ],
      flowSteps: [
        {
          title: 'AVI 업로드',
          description: '보관 자료나 카메라에서 가져온 오래된 .avi 파일을 끌어다 놓으세요.',
        },
        {
          title: '출력은 MP4로 고정',
          description: 'MP4로 미리 설정돼 있어서 따로 설정할 것이 없어요.',
        },
        {
          title: '변환',
          description: 'H.264 + AAC로 다시 인코딩해요.',
        },
        {
          title: '다운로드',
          description: '더 작고 최신 형식인 MP4를 저장하세요.',
        },
      ],
      advancedDetails: [
        'AVI는 흔히 Xvid/DivX(MPEG-4 Part 2)를 사용해요. H.264는 대략 두 배 효율적이라 MP4가 대개 훨씬 작아요.',
        'yuv420p를 강제로 적용해 결과물이 브라우저와 소셜 플랫폼에서 재생돼요.',
        '인터레이스 방식으로 녹화된 AVI는 전체 동영상 변환기의 디인터레이스 옵션이 도움이 될 수 있어요.',
      ],
      whyItMatters: [
        'AVI 파일은 크고, 최신 기기에서 재생되지 않는 경우가 점점 늘고 있어요.',
        'MP4/H.264는 더 작고 어디서나 재생돼요.',
        '오래된 보관 자료를 MP4로 변환해 두면 앞으로도 계속 쓸 수 있어요.',
      ],
      useCases: [
        {
          title: '오래된 동영상 보관 자료',
          description: '캠코더 영상이나 DVD에서 추출한 AVI를 최신 MP4로 바꾸세요.',
        },
        {
          title: '저장 공간 확보',
          description: '큰 AVI를 더 작은 MP4로 줄이세요.',
        },
        {
          title: '휴대폰 및 TV 재생',
          description: 'AVI 지원을 중단한 기기에서도 AVI가 재생되게 하세요.',
        },
        {
          title: '웹에 업로드',
          description: 'AVI를 사이트가 받아 주는 MP4로 바꾸세요.',
        },
      ],
      whyMediaManipulator: [
        '서버 측 FFmpeg가 다른 도구에서는 막히는 오래된 AVI 코덱도 디코딩해요.',
        '검증된 MP4 프로필로 출력이 고정돼요.',
      ],
      privacyNote: 'AVI는 저희 서버의 FFmpeg가 최신 H.264 MP4로 다시 인코딩해요. 작업은 외부 트랜스코딩 서비스가 아닌 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: 'AVI를 MP4로 어떻게 변환하나요?',
          answer: '.avi 파일을 업로드하고 변환을 클릭하세요. 출력이 이미 MP4로 설정돼 있어요.',
        },
        {
          question: 'MP4가 AVI보다 작아지나요?',
          answer: '대개 그래요. H.264는 대부분의 AVI가 사용하는 Xvid/DivX 코덱보다 훨씬 효율적이에요.',
        },
        {
          question: '오래된 DivX/Xvid AVI도 지원하나요?',
          answer: '네. FFmpeg가 일반적인 AVI 코덱을 디코딩해 H.264로 다시 인코딩해요.',
        },
        {
          question: '화질이 떨어지나요?',
          answer: '다시 인코딩은 손실 방식이지만, 품질을 높음으로 하면 차이가 아주 적고 파일은 여전히 더 작아요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '출력은 MP4(H.264 + AAC, yuv420p, +faststart)로 고정돼요.',
        ],
      },
      related: [
        {
          label: '동영상 변환기',
          to: '/tools/video-converter',
          description: '어떤 동영상이든 MP4로 변환하세요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: 'MP4를 더 줄이세요.',
        },
        {
          label: '동영상 변환기 튜토리얼',
          to: '/tutorials/video/getting-started',
          description: '자르기, 크기 조정, 디인터레이스를 차례로 알아보세요.',
        },
      ],
      embed: {
        title: 'AVI를 MP4로 변환',
        description: '.avi 파일을 업로드하세요. 이 도구는 출력이 MP4(H.264 + AAC)로 고정돼 있으니 업로드하고 변환하기만 하면 돼요.',
      },
    },
    'convert-mkv-to-mp4': {
      name: 'MKV를 MP4로 변환',
      h1: 'MKV를 MP4로 온라인 무료 변환',
      tagline: 'Matroska .mkv 파일을 MKV를 지원하지 않는 기기에서도 스트리밍, 업로드, 재생할 수 있는 MP4로 바꿔요.',
      metaTitle: 'MKV를 MP4로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 MKV MP4 변환기예요. MKV를 재생하지 못하는 기기와 사이트를 위해 Matroska .mkv 동영상을 MP4(H.264 + AAC)로 변환하세요. 워터마크도 가입도 없어요.',
      ogTitle: 'MKV를 MP4로 온라인 무료 변환',
      ogDescription: 'Matroska .mkv 동영상을 어디서나 재생하고 업로드할 수 있는 범용 MP4로 변환하세요.',
      intro: 'MKV(Matroska)는 고화질 동영상에 많이 쓰이는 유연한 컨테이너지만, 많은 휴대폰, 브라우저, 스마트 TV, 업로드 양식이 이를 재생하지 못해요. MKV를 MP4로 변환하면 동영상이 이런 기기가 이해하는 컨테이너에 담겨요. Media Manipulator는 H.264 + AAC로 다시 인코딩하므로 결과물이 문제없이 재생되고 업로드돼요.',
      whatItDoes: [
        'Matroska .mkv 파일을 MP4로 변환해요.',
        '폭넓은 기기 지원을 위해 출력을 MP4(H.264 + AAC)로 고정해요.',
        'yuv420p와 +faststart를 추가해 MP4가 스트리밍되고 바로 시작돼요.',
        'MP4를 만들기 전에 MKV 에피소드를 자르거나 크기를 바꿀 수 있어요.',
      ],
      flowSteps: [
        {
          title: 'MKV 업로드',
          description: '.mkv 파일을 끌어다 놓으세요.',
        },
        {
          title: '출력은 MP4로 고정',
          description: '이 도구는 MP4로 미리 설정돼 있어요.',
        },
        {
          title: '변환',
          description: '동영상을 MP4로 옮기거나 트랜스코딩해요.',
        },
        {
          title: '다운로드',
          description: '어디서나 재생되는 MP4를 저장하세요.',
        },
      ],
      advancedDetails: [
        'MKV에 이미 H.264 + AAC가 들어 있으면 변환이 빠르고 눈으로 보기에 무손실이에요.',
        'yuv420p를 강제로 적용해 Safari와 소셜 플랫폼에서도 MP4가 재생돼요.',
        'MKV에는 자막/오디오 트랙이 여러 개 들어 있을 수 있어요. 변환기는 기본 동영상과 첫 번째 오디오 트랙을 유지해요.',
      ],
      whyItMatters: [
        '많은 기기와 웹사이트가 MKV를 아예 지원하지 않아요.',
        '공유와 업로드에 안전한 컨테이너는 MP4예요.',
        '변환해 두면 고화질 동영상을 어디서나 쓸 수 있어요.',
      ],
      useCases: [
        {
          title: '휴대폰 및 TV 재생',
          description: 'MKV를 거부하는 기기에서도 재생되게 하세요.',
        },
        {
          title: '웹에 업로드',
          description: 'MKV를 사이트가 받아 주는 MP4로 바꾸세요.',
        },
        {
          title: '편집기로 넘기기',
          description: 'MKV를 잘 다루지 못하는 편집기에 MP4를 가져오세요.',
        },
        {
          title: '라이브러리 통일',
          description: '내려받은 MKV를 기존 MP4 컬렉션과 같은 형식으로 맞추세요.',
        },
      ],
      whyMediaManipulator: [
        '서버 측 FFmpeg가 여러 트랙이 있는 MKV도 처리해요.',
        '검증된 MP4 프로필로 출력이 고정돼요.',
      ],
      privacyNote: 'MKV는 저희 서버의 FFmpeg가 휴대폰과 브라우저에서 재생되는 MP4로 다시 인코딩해요. 작업은 외부 트랜스코딩 서비스가 아닌 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: 'MKV를 MP4로 어떻게 변환하나요?',
          answer: '.mkv 파일을 업로드하고 변환을 클릭하세요. 출력이 이미 MP4로 설정돼 있어요.',
        },
        {
          question: 'MKV를 MP4로 변환하면 화질이 떨어지나요?',
          answer: 'MKV가 이미 H.264를 사용한다면 품질을 높음으로 했을 때 결과물이 눈으로 보기에 무손실이에요. 그렇지 않으면 일반적인 손실 방식의 다시 인코딩이에요.',
        },
        {
          question: '추가 오디오나 자막 트랙은 어떻게 되나요?',
          answer: '변환기는 기본 동영상과 첫 번째 오디오 트랙을 유지해요. 여러 트랙이 필요하다면 연락해 주세요. 트랙 선택 기능을 검토해 볼게요.',
        },
        {
          question: 'MKV가 재생되지 않는 이유는 무엇인가요?',
          answer: '안에 든 코덱이 흔한 것이어도 많은 휴대폰, TV, 브라우저, 사이트가 MKV 컨테이너를 지원하지 않아요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '출력은 MP4(H.264 + AAC, yuv420p, +faststart)로 고정돼요. 기본 동영상과 첫 번째 오디오 트랙이 유지돼요.',
        ],
      },
      related: [
        {
          label: '동영상 변환기',
          to: '/tools/video-converter',
          description: '어떤 동영상이든 MP4로 변환하세요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '공유하기 좋게 MP4를 줄이세요.',
        },
        {
          label: '동영상 변환기 튜토리얼',
          to: '/tutorials/video/getting-started',
          description: '모든 옵션을 차례로 알아보세요.',
        },
      ],
      embed: {
        title: 'MKV를 MP4로 변환',
        description: '.mkv 파일을 업로드하세요. 이 도구는 출력이 MP4(H.264 + AAC)로 고정돼 있으니 업로드하고 변환하기만 하면 돼요.',
      },
    },
    'convert-mp4-to-webm': {
      name: 'MP4를 WebM으로 변환',
      h1: 'MP4를 WebM으로 온라인 무료 변환',
      tagline: 'MP4를 더 작고 개방형인 VP9 WebM으로 다시 인코딩해요. 빠르게 로드되는 웹 동영상에 안성맞춤이에요.',
      metaTitle: 'MP4를 WebM으로 온라인 무료 변환 | Media Manipulator',
      metaDescription: '무료 온라인 MP4 WebM 변환기예요. MP4를 VP9 + Opus WebM으로 다시 인코딩해 더 작고 빠른 웹 동영상을 만드세요. 워터마크도 가입도 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: 'MP4를 WebM으로 온라인 무료 변환',
      ogDescription: 'MP4를 최신 웹에 삽입하기 좋은, 더 작은 개방형 VP9 WebM으로 변환하세요.',
      intro: 'WebM은 웹을 위해 만들어진 개방형 동영상 형식이에요. VP9 동영상과 Opus 오디오를 쓰면 같은 화질에서 MP4보다 파일이 작아서, 동영상이 삽입된 페이지가 더 빨리 로드돼요. 플레이어를 직접 관리한다면 MP4를 WebM으로 변환하는 것이 올바른 선택이에요. 최신 브라우저는 모두 WebM을 기본으로 지원해요.',
      whatItDoes: [
        'MP4(H.264)를 WebM(VP9 + Opus)으로 변환해요.',
        '일관된 개방형 웹 삽입을 위해 출력을 WebM으로 고정해요.',
        '같은 화질에서 대개 MP4보다 작은 파일이 만들어져요.',
        'WebM을 만들기 전에 클립을 짧게 자르거나 크기를 줄이고 품질 프리셋을 고를 수 있어요.',
      ],
      flowSteps: [
        {
          title: 'MP4 업로드',
          description: '.mp4 파일을 끌어다 놓으세요.',
        },
        {
          title: '출력은 WebM으로 고정',
          description: '이 도구는 WebM(VP9 + Opus)으로 미리 설정돼 있어요.',
        },
        {
          title: '변환',
          description: 'H.264는 VP9로, AAC는 Opus로 다시 인코딩해요.',
        },
        {
          title: '다운로드',
          description: '웹용으로 더 작은 .webm을 저장하세요.',
        },
      ],
      advancedDetails: [
        'WebM 출력은 가능하면 VP9 동영상과 Opus 오디오를 사용하고, VP9/Opus가 없는 FFmpeg 빌드에서는 VP8 + Vorbis로 대체해요.',
        'VP9 인코딩은 H.264보다 느리지만 비슷한 화질에서 파일이 약 25~50% 작아요.',
        '<video> 태그에 WebM과 MP4 소스를 모두 넣으면 브라우저가 지원하는 것 중 가장 좋은 쪽을 골라요.',
      ],
      whyItMatters: [
        '웹 동영상이 작을수록 페이지가 빨라지고 대역폭 비용이 줄어요.',
        'WebM은 로열티가 없고 모든 최신 브라우저에서 지원돼요.',
        'WebM + MP4를 함께 쓰면 가능한 가장 작은 파일로 사실상 모든 브라우저를 지원할 수 있어요.',
      ],
      useCases: [
        {
          title: '웹사이트 히어로 동영상',
          description: '작고 빠르게 로드되는 배경 또는 히어로 클립을 제공하세요.',
        },
        {
          title: '개방형 웹 삽입',
          description: '독점 코덱 걱정 없이 동영상을 삽입하세요.',
        },
        {
          title: '대역폭 절약',
          description: '트래픽이 많은 페이지의 전송 용량을 줄이세요.',
        },
        {
          title: 'HTML5 <video>',
          description: 'MP4 대체 소스와 함께 WebM 소스를 제공하세요.',
        },
      ],
      whyMediaManipulator: [
        'VP9 + Opus 인코딩에 VP8 + Vorbis 자동 대체까지 갖췄어요.',
        '출력이 WebM으로 고정돼 결과를 예측할 수 있어요.',
      ],
      privacyNote: '동영상은 저희 서버의 FFmpeg가 VP9 WebM으로 다시 인코딩해요. 작업은 외부 트랜스코딩 서비스가 아닌 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: 'MP4를 WebM으로 어떻게 변환하나요?',
          answer: '.mp4 파일을 업로드하고 변환을 클릭하세요. 출력이 이미 WebM으로 설정돼 있어요.',
        },
        {
          question: 'WebM이 MP4보다 작나요?',
          answer: '같은 화질이라면 VP9 WebM은 대개 H.264 MP4보다 25~50% 작아요.',
        },
        {
          question: '모든 브라우저가 WebM을 지원하나요?',
          answer: '최신 브라우저는 모두 지원해요. 오래된 브라우저를 위해서는 <video> 태그에 MP4 대체 소스를 넣으세요.',
        },
        {
          question: 'WebM 인코딩이 더 느린 이유는 무엇인가요?',
          answer: 'VP9는 H.264보다 계산량이 많아요. 그 대가로 파일이 더 작아져요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '출력은 WebM(VP9 + Opus, VP9/Opus를 쓸 수 없으면 VP8 + Vorbis)으로 고정돼요.',
        ],
      },
      related: [
        {
          label: 'WebM을 MP4로 변환',
          to: '/tools/convert-webm-to-mp4',
          description: '반대 방향 변환이에요.',
        },
        {
          label: '동영상 변환기',
          to: '/tools/video-converter',
          description: '어떤 동영상이든 MP4로 변환하세요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '컨테이너를 바꾸지 않고 동영상을 줄이세요.',
        },
      ],
      embed: {
        title: 'MP4를 WebM으로 변환',
        description: '.mp4 파일을 업로드하세요. 이 도구는 출력이 WebM(VP9 + Opus)으로 고정돼 있으니 업로드하고 변환하기만 하면 돼요.',
      },
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
      h1: '동영상 화면 온라인 무료 자르기',
      tagline: '동영상의 가장자리를 잘라내 편집기 없이 구도나 화면 비율을 바꿔요.',
      metaTitle: '동영상 화면 온라인 무료 자르기 | Media Manipulator',
      metaDescription: '무료 온라인 동영상 화면 자르기 도구예요. 동영상 가장자리를 잘라 구도를 바꾸거나 화면 비율을 변경하세요. MP4 출력, 워터마크 없음, 가입 불필요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '동영상 화면 온라인 무료 자르기',
      ogDescription: '동영상 가장자리를 잘라 구도를 바꾸거나 화면 비율을 변경하세요. 무료이고 워터마크도 없어요.',
      intro: '화면 자르기는 동영상의 바깥 가장자리를 없애는 작업이에요. 장면의 구도를 다시 잡거나, 검은 띠나 워터마크를 잘라내거나, 플랫폼에 맞게 화면 비율을 바꿀 때 유용해요. Media Manipulator 동영상 화면 자르기 도구는 픽셀 단위 사각형(어디서 시작하고 크기가 얼마인지)을 받아 그 영역만 깔끔한 MP4로 내보내요.',
      whatItDoes: [
        '지정한 픽셀 단위 사각형으로 동영상을 잘라요.',
        '검은 띠, 가장자리, 워터마크, 원치 않는 영역을 없애요.',
        '소셜 플랫폼용 정사각형이나 세로 화면으로 구도를 다시 잡을 수 있어요.',
        '기본으로 MP4(H.264 + AAC)로 내보내요.',
      ],
      flowSteps: [
        {
          title: '동영상 업로드',
          description: '자를 MP4, MOV, MKV, WebM, AVI 또는 M4V 파일을 올리세요.',
        },
        {
          title: '자르기 사각형 입력',
          description: 'X/Y 오프셋과 남길 너비/높이를 설정하세요.',
        },
        {
          title: '자르기',
          description: 'FFmpeg가 정확히 그 영역으로 잘라 다시 인코딩해요.',
        },
        {
          title: '다운로드',
          description: '잘라낸 동영상을 저장하세요.',
        },
      ],
      advancedDetails: [
        '자르기 좌표는 왼쪽 위 모서리를 기준으로 한 픽셀 값이에요. X/Y는 남길 영역이 시작되는 위치이고, 너비/높이는 그 크기예요.',
        '화면 자르기는 동영상을 다시 인코딩해요. MP4 출력은 H.264 + AAC + yuv420p + faststart를 사용해요.',
        '미리보기에서 픽셀 단위로 정확하게 구도를 잡으려면 홈페이지의 전체 변환기에 있는 시각적 자르기 오버레이를 쓰세요.',
      ],
      whyItMatters: [
        '화면 자르기로 다시 촬영하지 않고도 구도를 바꿀 수 있어요.',
        '검은 띠(레터박스/필러박스)와 원치 않는 가장자리를 없애요.',
        '화면 비율을 바꾸면(예: 9:16) 동영상을 플랫폼에 맞출 수 있어요.',
      ],
      useCases: [
        {
          title: '세로 화면으로 만들기',
          description: '가로 클립을 Reels/Shorts/TikTok용 9:16으로 자르세요.',
        },
        {
          title: '검은 띠 제거',
          description: '레터박스를 잘라내세요.',
        },
        {
          title: '워터마크 가리기',
          description: '모서리의 로고나 타임스탬프를 잘라내세요.',
        },
        {
          title: '피사체 구도 다시 잡기',
          description: '중요한 부분에 맞춰 화면을 좁히세요.',
        },
      ],
      whyMediaManipulator: [
        '서버 측 FFmpeg로 픽셀 단위까지 정밀하게 잘라요.',
        '깔끔한 MP4 출력, 워터마크 없음.',
      ],
      privacyNote: '동영상은 직접 지정한 사각형으로 잘리고 저희 서버의 FFmpeg가 다시 인코딩해요. 작업은 외부 트랜스코딩 서비스가 아닌 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: '동영상 화면은 어떻게 자르나요?',
          answer: '업로드하고, 남길 사각형(픽셀 단위의 X/Y 오프셋과 너비/높이)을 입력한 다음, 잘라낸 동영상을 다운로드하세요.',
        },
        {
          question: '정사각형이나 세로 화면 비율로 자를 수 있나요?',
          answer: '네. 너비와 높이를 원하는 비율로 설정하세요(예: 정사각형은 같은 값, 9:16은 너비보다 높이를 크게).',
        },
        {
          question: '화면을 자르면 화질이 떨어지나요?',
          answer: '화면 자르기는 다시 인코딩하지만, 기본 품질에서는 손실이 아주 적어요.',
        },
        {
          question: '워터마크를 잘라낼 수 있나요?',
          answer: '네, 워터마크가 가장자리 근처에 있다면 그 부분이 빠지도록 화면을 자르세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '화면 자르기는 다시 인코딩해요. MP4 출력은 H.264 + AAC + yuv420p + faststart를 사용해요.',
        ],
      },
      related: [
        {
          label: '동영상 크기 조정',
          to: '/tools/resize-video',
          description: '자르는 대신 해상도를 바꾸세요.',
        },
        {
          label: '동영상 회전',
          to: '/tools/rotate-video',
          description: '옆으로 누웠거나 거꾸로 된 동영상을 바로잡으세요.',
        },
        {
          label: '동영상 변환기',
          to: '/tools/video-converter',
          description: '동영상 형식 간에 변환하세요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '잘라낸 동영상의 크기를 줄이세요.',
        },
      ],
      embed: {
        title: '동영상 화면 자르기',
        description: '동영상을 업로드하고 남길 사각형(오프셋 + 픽셀 단위 너비/높이)을 입력하세요. 정확히 그 영역으로 잘라 MP4로 내보내요.',
      },
    },
    'resize-video': {
      name: '동영상 크기 조정',
      h1: '동영상 크기 온라인 무료 조정',
      tagline: '동영상 해상도를 바꿔요. 1080p, 720p, 480p나 원하는 가로세로 크기로 조정할 수 있어요.',
      metaTitle: '동영상 크기 온라인 무료 조정 | Media Manipulator',
      metaDescription: '무료 온라인 동영상 크기 조정 도구예요. 동영상 해상도를 1080p, 720p, 480p 또는 원하는 크기로 바꾸세요. MP4 출력, 워터마크 없음, 가입 불필요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '동영상 크기 온라인 무료 조정',
      ogDescription: '동영상 해상도를 1080p, 720p, 480p 또는 원하는 크기로 바꾸세요. 무료이고 워터마크도 없어요.',
      intro: '크기 조정은 동영상 해상도를 바꾸는 작업이에요. 4K 클립을 1080p로 만들거나, 웹용으로 720p로 줄이거나, 플랫폼이 요구하는 정확한 픽셀 크기에 맞출 수 있어요. Media Manipulator 동영상 크기 조정 도구는 기본적으로 화면 비율을 유지하면서 선택한 크기로 동영상을 조정하고 깔끔한 MP4로 내보내요.',
      whatItDoes: [
        '동영상을 목표 너비 및/또는 높이로 조정해요.',
        '기본적으로 화면 비율을 유지해요(한쪽 크기를 비워 두면 자동으로 비례 조정돼요).',
        '파일을 줄이려면 축소하고, 목표 크기에 맞추려면 확대해요.',
        '기본으로 MP4(H.264 + AAC)로 내보내요.',
      ],
      flowSteps: [
        {
          title: '동영상 업로드',
          description: '크기를 바꾸고 싶은 클립을 고르세요.',
        },
        {
          title: '크기 설정',
          description: '너비 및/또는 높이를 픽셀 단위로 입력하세요.',
        },
        {
          title: '크기 조정',
          description: 'FFmpeg가 동영상 크기를 조정하고 다시 인코딩해요.',
        },
        {
          title: '다운로드',
          description: '크기를 조정한 동영상을 저장하세요.',
        },
      ],
      advancedDetails: [
        '한쪽 크기를 비워 두면 비례해서 조정되어 원래 화면 비율이 유지돼요.',
        '너비와 높이를 모두 설정할 때는 "화면 비율 유지"를 켜 두면 늘어나지 않고 상자 안에 맞춰져요.',
        '크기 조정은 다시 인코딩해요. MP4 출력은 H.264 + AAC + yuv420p + faststart를 사용해요. 한 변당 최대 4096 px.',
      ],
      whyItMatters: [
        '해상도가 낮을수록 파일이 작아지고 업로드가 빨라져요.',
        '일부 플랫폼은 정확한 해상도를 요구해요.',
        '크기 조정으로 해상도가 제각각인 라이브러리를 통일할 수 있어요.',
      ],
      useCases: [
        {
          title: '웹용으로 줄이기',
          description: '4K를 1080p나 720p로 낮춰 페이지를 빠르게 하세요.',
        },
        {
          title: '목표 크기 맞추기',
          description: '플랫폼 사양에 정확히 맞추세요.',
        },
        {
          title: '파일 크기 줄이기',
          description: '해상도를 낮춰 용량을 줄이세요.',
        },
        {
          title: '영상 통일',
          description: '클립들을 하나의 해상도로 맞추세요.',
        },
      ],
      whyMediaManipulator: [
        '서버 측 FFmpeg로 화면 비율을 고려해 크기를 조정해요.',
        '깔끔한 MP4 출력, 워터마크 없음.',
      ],
      privacyNote: '동영상은 설정한 너비와 높이로 조정되고 저희 서버의 FFmpeg가 다시 인코딩해요. 작업은 외부 트랜스코딩 서비스가 아닌 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: '동영상 크기는 어떻게 조정하나요?',
          answer: '업로드하고, 목표 너비 및/또는 높이를 설정한 다음, 크기를 조정한 동영상을 다운로드하세요.',
        },
        {
          question: '해상도를 720p로 바꾸려면 어떻게 하나요?',
          answer: '높이를 720으로 설정하고 너비는 비워 두면 비례해서 조정돼요.',
        },
        {
          question: '크기를 조정해도 화면 비율이 유지되나요?',
          answer: '네. 한쪽 크기를 비워 두거나 "화면 비율 유지"를 켜 두면 동영상이 늘어나지 않아요.',
        },
        {
          question: '동영상을 확대할 수 있나요?',
          answer: '더 큰 크기로 확대할 수는 있지만, 촬영되지 않은 디테일을 확대로 더할 수는 없어요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '크기 조정은 다시 인코딩해요. MP4 출력은 H.264 + AAC + yuv420p + faststart를 사용해요. 한 변당 최대 4096 px.',
        ],
      },
      related: [
        {
          label: '동영상 화면 자르기',
          to: '/tools/crop-video',
          description: '크기를 조정하는 대신 가장자리를 잘라내세요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '프리셋으로 파일 크기를 줄이세요.',
        },
        {
          label: '동영상 변환기',
          to: '/tools/video-converter',
          description: 'MP4로 변환하세요.',
        },
        {
          label: '동영상 회전',
          to: '/tools/rotate-video',
          description: '방향을 바로잡으세요.',
        },
      ],
      embed: {
        title: '동영상 크기 조정',
        description: '동영상을 업로드하고 목표 너비 및/또는 높이를 설정하세요. 한쪽을 비워 두면 비례해서 조정돼요. 기본 출력은 MP4예요.',
      },
    },
    'rotate-video': {
      name: '동영상 회전',
      h1: '동영상 온라인 무료 회전',
      tagline: '옆으로 누웠거나 거꾸로 된 동영상을 바로잡아요. 90°, 180°, 270° 회전과 뒤집기를 클릭 한 번으로 할 수 있어요.',
      metaTitle: '동영상 온라인 무료 회전 | Media Manipulator',
      metaDescription: '무료 온라인 동영상 회전 도구예요. 동영상을 90°, 180°, 270° 회전해 옆으로 눕거나 거꾸로 된 클립을 바로잡으세요. MP4 출력, 워터마크 없음, 가입 불필요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '동영상 온라인 무료 회전',
      ogDescription: '동영상을 90°, 180°, 270° 회전해 옆으로 눕거나 거꾸로 된 영상을 바로잡으세요. 무료, 워터마크 없음.',
      intro: '휴대폰 동영상은 옆으로 누운 채 녹화되는 경우가 많고, 어떤 클립은 거꾸로 저장되기도 해요. Media Manipulator 동영상 회전 도구는 방향을 영구적으로 바로잡아요. 90°, 180°, 270° 중 하나를 고르면 실제 프레임을 회전하므로(90°/270°에서는 너비와 높이를 서로 바꿔요), 회전 플래그를 읽는 플레이어뿐 아니라 모든 플레이어에서 동영상이 똑바로 재생돼요.',
      whatItDoes: [
        '동영상을 시계 방향으로 90°, 180°, 또는 270°(반시계 방향 90°) 회전해요.',
        '필요하면 동영상을 좌우 또는 상하로 뒤집어요(미러).',
        '다시 인코딩하므로 회전이 메타데이터 플래그가 아니라 프레임 자체에 반영돼요.',
        '기본적으로 MP4(H.264 + AAC)로 내보내요.',
      ],
      flowSteps: [
        {
          title: '동영상 업로드',
          description: '예를 들어 옆으로 누운 휴대폰 클립이요.',
        },
        {
          title: '회전 각도 선택',
          description: '90°, 180°, 270° 중에서 고르고, 필요하면 뒤집기도 선택하세요.',
        },
        {
          title: '회전',
          description: 'FFmpeg가 프레임을 회전(transpose)하고 다시 인코딩해요.',
        },
        {
          title: '다운로드',
          description: '방향이 바로잡힌 동영상을 저장하세요.',
        },
      ],
      advancedDetails: [
        '90°/270°에는 FFmpeg transpose를 사용하고(너비와 높이를 올바르게 바꿔요), 180°에는 transpose를 두 번 적용해요.',
        '회전을 픽셀에 직접 반영하면 컨테이너의 회전 플래그를 무시하는 플레이어에서도 문제가 해결돼요.',
        '회전은 다시 인코딩을 거치며, MP4 출력은 H.264 + AAC + yuv420p + faststart를 사용해요.',
      ],
      whyItMatters: [
        '옆으로 누운 휴대폰 동영상은 가장 흔한 동영상 골칫거리 중 하나예요.',
        '프레임에 반영된 회전은 회전 플래그와 달리 어디서나 올바르게 재생돼요.',
        '뒤집기로 좌우가 반전된 셀카/웹캠 영상을 바로잡을 수 있어요.',
      ],
      useCases: [
        {
          title: '옆으로 누운 클립 바로잡기',
          description: '세로로 찍은 휴대폰 동영상을 회전해 똑바로 재생되게 하세요.',
        },
        {
          title: '셀카 동영상 뒤집기',
          description: '웹캠이나 전면 카메라 영상의 좌우 반전을 되돌리세요.',
        },
        {
          title: '180° 돌리기',
          description: '거꾸로 녹화된 영상을 바로잡으세요.',
        },
        {
          title: '편집 전 방향 맞추기',
          description: '가져오기 전에 방향을 제대로 맞춰 두세요.',
        },
      ],
      whyMediaManipulator: [
        '메타데이터 플래그만 바꾸는 게 아니라 실제로 프레임을 회전(transpose)해요.',
        '회전과 뒤집기를 하나의 간결한 패널에서 할 수 있어요.',
      ],
      privacyNote: '동영상은 저희 서버에서 선택한 각도만큼 회전되고 FFmpeg로 다시 인코딩돼요. 작업은 외부 트랜스코딩 서비스가 아니라 저희 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: '동영상은 어떻게 회전하나요?',
          answer: '업로드하고 90°, 180°, 270° 중 하나를 고른 다음 회전된 동영상을 다운로드하세요.',
        },
        {
          question: '옆으로 누운 휴대폰 동영상은 어떻게 바로잡나요?',
          answer: '똑바로 재생될 때까지 시계 방향 또는 반시계 방향으로 90° 회전하세요. 회전은 프레임 자체에 반영돼요.',
        },
        {
          question: '정말 프레임을 회전하나요, 아니면 플래그만 설정하나요?',
          answer: '실제 프레임을 회전하므로(FFmpeg transpose) 어떤 플레이어에서든 동영상이 똑바로 보여요.',
        },
        {
          question: '동영상을 뒤집거나 미러링할 수도 있나요?',
          answer: '네. 좌우 뒤집기와 상하 뒤집기 옵션이 포함돼 있어요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '회전은 FFmpeg transpose로 다시 인코딩하며, MP4 출력은 H.264 + AAC + yuv420p + faststart를 사용해요.',
        ],
      },
      related: [
        {
          label: '동영상 화면 자르기',
          to: '/tools/crop-video',
          description: '가장자리를 잘라내요.',
        },
        {
          label: '동영상 크기 조정',
          to: '/tools/resize-video',
          description: '해상도를 바꿔요.',
        },
        {
          label: '동영상 변환기',
          to: '/tools/video-converter',
          description: '동영상 형식 사이를 변환해요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '회전한 동영상의 용량을 줄여요.',
        },
      ],
      embed: {
        title: '동영상 회전',
        description: '동영상을 업로드하고 회전 각도(90°, 180°, 270°)를 고르세요. 뒤집기도 할 수 있어요. 실제 프레임을 회전해 MP4로 내보내요.',
      },
    },
    'remove-audio-from-video': {
      name: '동영상에서 오디오 제거',
      h1: '동영상에서 오디오 온라인 무료 제거',
      tagline: '동영상을 완전히 무음으로 만들어요. 오디오 트랙을 제거하고 소리 없는 동영상 파일을 다운로드하세요.',
      metaTitle: '동영상에서 오디오 온라인 무료 제거 | Media Manipulator',
      metaDescription: '동영상에서 오디오를 제거하는 무료 온라인 도구예요. 소리를 없애고 무음의 동영상 전용 MP4를 다운로드하세요. 워터마크 없음, 가입 불필요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ogTitle: '동영상에서 오디오 온라인 무료 제거',
      ogDescription: '동영상에서 오디오 트랙을 제거하고 소리 없는 동영상 전용 파일을 다운로드하세요. 무료, 워터마크 없음.',
      intro: '동영상에서 오디오를 제거하면 소리 없는 동영상 전용 파일이 생겨요. 배경 소음을 없애거나, 다시 업로드하기 전에 저작권이 있는 음악을 빼거나, 새 오디오를 입힐 클립을 준비할 때 편리해요. Media Manipulator는 오디오 트랙을 제거하고 동영상을 돌려드리며, 가능하면 영상을 스트림 복사하므로 화질 손실이 없어요.',
      whatItDoes: [
        '오디오 트랙을 제거(음소거)하고 동영상 전용 파일을 돌려드려요.',
        '가능하면 동영상 스트림을 스트림 복사해요. 다시 인코딩하지 않으니 화질 손실도 없어요.',
        '컨테이너나 코덱 때문에 필요할 때는 다시 인코딩으로 전환해요.',
        '기본적으로 MP4로 출력해요(WebM도 선택할 수 있어요).',
      ],
      flowSteps: [
        {
          title: '동영상 업로드',
          description: '소리를 없애고 싶은 클립이요.',
        },
        {
          title: '출력 형식 선택',
          description: 'MP4(기본값) 또는 WebM.',
        },
        {
          title: '오디오 제거',
          description: 'FFmpeg가 오디오를 빼고 영상은 유지해요.',
        },
        {
          title: '다운로드',
          description: '소리 없는 동영상 전용 파일을 저장하세요.',
        },
      ],
      advancedDetails: [
        '동영상 스트림을 스트림 복사(`-c:v copy -an`)하므로 영상에는 손대지 않아요. 컨테이너가 원본 코덱을 받지 않으면 H.264로 다시 인코딩해요.',
        '출력에는 오디오 트랙이 아예 없어요. 볼륨만 끝까지 낮춘 것이 아니라 완전한 무음이에요.',
        '다운로드 파일 이름에는 `_silent`가 붙으므로 원본과 쉽게 구분할 수 있어요.',
      ],
      whyItMatters: [
        '음소거하면 배경 소음, 말소리, 바람 소리를 영구적으로 없앨 수 있어요.',
        '저작권이 있는 음악을 빼면 다시 업로드할 때 삭제 조치를 피할 수 있어요.',
        '소리 없는 기본 클립은 새 오디오나 보이스오버를 입히는 출발점이에요.',
      ],
      useCases: [
        {
          title: '배경 소음 없애기',
          description: '클립에서 원치 않는 소리를 제거하세요.',
        },
        {
          title: '저작권 있는 오디오 빼기',
          description: '다시 게시하기 전에 음악을 제거하세요.',
        },
        {
          title: '새 오디오 준비',
          description: '보이스오버를 입힐 무음 기본 클립을 만드세요.',
        },
        {
          title: '개인정보 보호',
          description: '배경에 녹음된 대화를 제거하세요.',
        },
      ],
      whyMediaManipulator: [
        '화질을 그대로 지키는 동영상 스트림 복사.',
        '진짜 무음 출력(볼륨을 낮춘 것이 아니라 오디오 트랙 자체를 제거).',
      ],
      privacyNote: '동영상의 오디오 트랙은 저희 서버에서 FFmpeg로 제거되고 영상은 그대로 유지돼요. 작업은 외부 트랜스코딩 서비스가 아니라 저희 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: '동영상에서 오디오는 어떻게 제거하나요?',
          answer: '동영상을 업로드하고 출력 형식을 고른 다음 소리 없는 동영상 전용 파일을 다운로드하세요.',
        },
        {
          question: '동영상을 음소거하나요, 아니면 트랙을 제거하나요?',
          answer: '오디오 트랙을 완전히 제거하므로 볼륨만 끝까지 낮춘 것이 아니라 진짜 무음이 돼요.',
        },
        {
          question: '동영상 화질이 바뀌나요?',
          answer: '아니요. 가능하면 동영상 스트림을 스트림 복사하므로 영상은 그대로예요.',
        },
        {
          question: '파일 이름에 왜 "_silent"가 붙나요?',
          answer: '오디오가 없는 사본을 원본과 구분할 수 있도록 _silent 접미사를 붙여요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '가능하면 동영상을 스트림 복사하고, 오디오 트랙은 완전히 제거해요. 다운로드 파일 접미사: _silent.',
        ],
      },
      related: [
        {
          label: '오디오 제거(동영상만)',
          to: '/tools/extract-video-only-from-video',
          description: '같은 무음 동영상 도구예요.',
        },
        {
          label: '동영상에서 오디오 추출',
          to: '/tools/extract-audio-from-video',
          description: '오디오를 제거하는 대신 저장해요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '무음 동영상의 용량을 줄여요.',
        },
        {
          label: '동영상에 오디오 추가',
          to: '/tools/stitch-audio-to-video',
          description: '무음 클립에 새 사운드트랙을 입혀요.',
        },
      ],
      embed: {
        title: '동영상에서 오디오 제거',
        description: '동영상을 업로드하면 오디오 트랙을 제거해 소리 없는 동영상 전용 파일을 돌려드려요. 출력 기본값은 MP4예요. 가능하면 동영상을 스트림 복사해요(화질 손실 없음).',
      },
    },
    'audio-converter': {
      name: '오디오 변환기',
      h1: '무료 온라인 오디오 변환기',
      tagline: 'MP3, WAV, M4A, OGG, FLAC, OPUS 등 여러 형식 사이를 변환해요. 비트레이트, 샘플 레이트, 채널도 자유롭게 설정할 수 있어요.',
      metaTitle: '무료 온라인 오디오 변환기 | Media Manipulator',
      metaDescription: 'MP3, WAV, M4A, OGG, FLAC, OPUS 등을 지원하는 무료 온라인 오디오 변환기예요. 비트레이트, 샘플 레이트, 채널을 선택하세요.',
      ogTitle: '무료 온라인 오디오 변환기',
      ogDescription: 'WAV, MP3, M4A, OGG, FLAC, OPUS 등을 변환하세요. 비트레이트, 샘플 레이트, 채널을 선택할 수 있어요.',
      intro: '기기, 팟캐스트 호스팅 서비스, 오디오 편집기마다 원하는 형식이 달라요. Media Manipulator는 자주 쓰는 모든 오디오 형식을 한곳에서 처리하며, 비트레이트, 샘플 레이트, 채널 구성을 세밀하게 조절할 수 있어요.',
      whatItDoes: [
        'MP3, WAV, M4A/AAC, OGG, FLAC, ALAC, OPUS, AC3, DTS 사이를 변환해요.',
        '비트레이트, 샘플 레이트, 채널 구성을 선택하세요.',
        '같은 업로드에서 트리밍하고 EQ, 노이즈 제거, AI 정리를 적용할 수 있어요.',
        '해당되는 경우 ID3 태그가 들어간 올바른 파일을 출력해요.',
      ],
      flowSteps: [
        {
          title: '오디오 업로드',
          description: 'MP3, WAV, M4A, FLAC, OGG 등.',
        },
        {
          title: '출력 형식 선택',
          description: 'MP3, WAV, FLAC, M4A, OGG, OPUS.',
        },
        {
          title: '비트레이트와 샘플 레이트 조정',
          description: '트리밍하거나 AI 정리를 실행하세요.',
        },
        {
          title: '다운로드',
          description: '변환된 오디오를 저장하세요.',
        },
      ],
      advancedDetails: [
        'MP3는 범용 압축 형식이에요. 모든 기기에서 재생돼요.',
        'FLAC과 ALAC은 무손실이에요. MP3보다 크고 WAV보다 작아요.',
        'OPUS(OGG 컨테이너)는 음성과 음악에 쓰이는 가장 작은 최신 손실 형식이에요. 재생할 플레이어를 직접 정할 수 있을 때 아주 좋아요.',
      ],
      whyItMatters: [
        '팟캐스트 플랫폼, 음악 서비스, 오디오 편집기는 각각 선호하는 형식이 달라요.',
        '파일이 작을수록 저장 공간이 줄고 전송이 빨라져요.',
        '오디오를 다시 편집할 예정이라면 무손실 형식이 꼭 필요해요.',
      ],
      useCases: [
        {
          title: '팟캐스트 게시',
          description: 'WAV 마스터 → MP3 에피소드.',
        },
        {
          title: '음성 메모 공유',
          description: '트리밍한 뒤 MP3로 압축하세요.',
        },
        {
          title: '음악 보관',
          description: 'MP3 → FLAC(음질이 좋아지지는 않아요) 또는 WAV → FLAC으로 변환해 무손실로 보관하세요.',
        },
        {
          title: '게임 및 앱 에셋',
          description: 'WAV → OPUS로 변환해 아주 작은 모바일 에셋을 만드세요.',
        },
      ],
      whyMediaManipulator: [
        '비트레이트, 샘플 레이트, 채널을 완전히 제어할 수 있어요.',
        '같은 업로드에서 AI 정리 도구(노이즈 제거, 보컬 분리, 보컬 제거)를 쓸 수 있어요.',
        '무료이고 가입도 워터마크도 없어요.',
      ],
      privacyNote: '오디오는 저희 서버에서 FFmpeg로 디코딩된 뒤 선택한 형식과 비트레이트로 다시 인코딩돼요. 외부 오디오 서비스는 관여하지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 새 파일이 만들어지며 업로드한 파일 자체는 바뀌지 않아요.',
      faq: [
        {
          question: '음악에는 어떤 형식이 가장 좋나요?',
          answer: '무손실 보관에는 FLAC, 공유에는 MP3 256–320 kbps, 가장 작은 스트리밍용 파일에는 OPUS가 좋아요.',
        },
        {
          question: '음성에는 어떤 형식이 가장 좋나요?',
          answer: '96–128 kbps의 MP3가 팟캐스트 기본값으로 훌륭해요.',
        },
        {
          question: '변환하면서 트리밍할 수 있나요?',
          answer: '네. 제출하기 전에 트리밍 섹션에서 시작/종료 초를 설정하세요.',
        },
        {
          question: 'FLAC은 정말 무손실인가요?',
          answer: '네. FLAC은 데이터를 하나도 버리지 않고 압축해요. 디코딩하면 입력과 비트 단위로 똑같은 사본이 나와요.',
        },
      ],
      related: [
        {
          label: 'WAV를 MP3로 변환',
          to: '/tools/convert-wav-to-mp3',
          description: 'WAV → MP3 전용 변환기예요.',
        },
        {
          label: '노래에서 보컬 분리',
          to: '/tools/isolate-vocals-from-song',
          description: '음악 트랙에서 보컬을 뽑아내요.',
        },
        {
          label: '오디오 변환기 튜토리얼',
          to: '/tutorials/audio/getting-started',
          description: '모든 옵션을 자세히 안내해요.',
        },
      ],
      embed: {
        title: '오디오 파일 변환',
        description: '오디오 파일을 업로드하고 대상 형식을 고르세요. 192 kbps MP3가 무난한 기본값이에요. WAV는 무손실이지만 용량이 크고, M4A/AAC는 음악용 압축 형식으로 좋은 선택이에요.',
      },
    },
    'srt-generator': {
      name: 'SRT 자막 생성기',
      h1: '무료 SRT 자막 생성기',
      tagline: '동영상이나 오디오 파일을 업로드하면 YouTube, 편집기, 접근성 도구에 바로 쓸 수 있는 .srt 자막 파일을 만들어 다운로드할 수 있어요.',
      metaTitle: '무료 온라인 SRT 생성기: 동영상과 오디오를 SRT로 | Media Manipulator',
      metaDescription: 'MP4, MOV, MP3, WAV 등에서 SRT 자막 파일을 만드세요. 무료, 가입 불필요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. YouTube, Premiere, DaVinci Resolve와 호환돼요.',
      ogTitle: '무료 SRT 생성기: 동영상과 오디오를 SRT로',
      ogDescription: '어떤 동영상이나 오디오에서든 정확한 SRT 자막 파일을 만드세요. 로컬 AI 받아쓰기, 외부 제공업체 없음.',
      intro: 'SRT(SubRip)는 인터넷에서 가장 폭넓게 지원되는 자막 형식이에요. YouTube, Vimeo, Premiere, DaVinci Resolve, Final Cut, 그리고 거의 모든 소셜 플랫폼이 SRT를 받아요. Media Manipulator를 사용하면 동영상이나 오디오를 한 번만 업로드해 SRT 파일을 만들 수 있어요. 받아쓰기는 저희 자체 GPU 서버에서 whisper-ctranslate2로 실행되므로 오디오가 저희 인프라 밖으로 나가지 않고 외부 AI 제공업체에 전달되지도 않아요.',
      whatItDoes: [
        '어떤 동영상이나 오디오 파일이든 타임코드가 있는 .srt 자막 파일로 받아써요.',
        '저희 로컬 GPU 서버의 whisper-ctranslate2를 사용해요. 외부 AI 제공업체는 미디어를 볼 수 없어요.',
        '모든 주요 동영상 편집기와 플레이어에서 호환되는 SubRip 형식 파일(HH:MM:SS,mmm 타임스탬프, 순차적 큐 번호)을 만들어요.',
        '언어 자동 감지를 지원하며, 짧은 클립의 정확도를 높이려면 선택적으로 BCP-47 언어 힌트를 줄 수 있어요.',
      ],
      flowSteps: [
        {
          title: '미디어 업로드',
          description: 'MP4, MOV, MP3, WAV 등 지원되는 파일을 끌어다 놓으세요.',
        },
        {
          title: '오디오 추출',
          description: 'FFmpeg가 오디오 트랙을 뽑아 whisper가 요구하는 형식으로 변환해요.',
        },
        {
          title: 'Whisper 받아쓰기',
          description: '저희 GPU 서버가 whisper-ctranslate2를 실행해 타이밍이 있는 구간을 만들어요.',
        },
        {
          title: '.srt 다운로드',
          description: '순차적인 큐와 정확한 타이밍을 갖춘 깔끔한 SubRip 파일이 만들어져요.',
        },
      ],
      advancedDetails: [
        'Whisper는 ctranslate2를 사용해 저희 자체 NVIDIA GPU 서버에서 실행돼요. 중간에 외부 API가 전혀 끼지 않아요.',
        'SRT 출력은 쉼표-밀리초 타임스탬프(00:00:01,234)와 1부터 시작하는 순차 큐 번호를 사용해요. 편집기 호환성을 가장 높이는 형식이에요.',
        '받아쓰기 파이프라인은 언어 자동 감지를 지원하며, 언어 필드를 통해 WHISPER_CT2_LANGUAGE 방식의 BCP-47 힌트를 선택적으로 줄 수도 있어요.',
        '출력은 앱의 다른 도구와 같은 작업 시스템을 거쳐요. 받아쓰기 양식에서 VTT, 일반 텍스트, 구조화된 JSON을 고를 수도 있어요.',
      ],
      whyItMatters: [
        'YouTube, Vimeo, Premiere, DaVinci Resolve, Final Cut, 그리고 대부분의 소셜 플랫폼은 SRT를 기본 자막 형식으로 받아요.',
        '자막은 청각 장애가 있거나 잘 듣지 못하는 시청자도 동영상을 볼 수 있게 하고, 대부분의 동영상이 소리 없이 재생되는 소셜 플랫폼에서 참여도를 높여요.',
        '동영상과 함께 일치하는 .srt를 게시하면 검색 엔진이 동영상의 스크립트 내용을 색인할 수 있어요.',
      ],
      useCases: [
        {
          title: 'YouTube 크리에이터',
          description: '정확한 자막을 만들어 모든 동영상에 SRT 트랙으로 업로드하세요.',
        },
        {
          title: '강의 제작자',
          description: '강의 동영상에 스크립트를 추가해 학생들이 나중에 검색하고, 복습하고, 번역할 수 있게 하세요.',
        },
        {
          title: '동영상으로 재게시하는 팟캐스터',
          description: '팟캐스트 에피소드를 소셜 플랫폼용 자막 동영상 클립으로 만드세요.',
        },
        {
          title: '마케팅/소셜 팀',
          description: '모든 클립에 자막을 넣어 소리 없이 자동 재생으로 보는 시청자에게도 메시지가 전달되게 하세요.',
        },
      ],
      whyMediaManipulator: [
        'Whisper는 저희 자체 GPU 인프라에서 실행돼요. 미디어가 외부 AI 제공업체에 닿지 않아요.',
        '가입도 워터마크도 없어요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
        '앱의 다른 부분과 같은 받아쓰기 엔진을 사용하므로 SRT, VTT, 일반 텍스트, JSON 출력 전반에서 정확도가 일정해요.',
      ],
      privacyNote: '파일 속 음성은 저희 자체 GPU 서버의 Whisper가 받아쓰고 타이밍을 맞춰 SRT 자막 파일로 만들어요. AI 작업은 외부 AI 제공업체가 아니라 저희가 운영하는 하드웨어에서 실행되며, 업로드한 내용은 모델 학습에 사용되지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      faq: [
        {
          question: 'SRT 파일이 무엇인가요?',
          answer: 'SRT(SubRip)는 타임스탬프와 큐 번호가 있는 일반 텍스트 자막 파일이에요. YouTube, 대부분의 동영상 편집기, 대부분의 동영상 플레이어가 기본으로 받는 자막 형식이에요.',
        },
        {
          question: 'MP4에서 자막을 만들 수 있나요?',
          answer: '네. MP4(또는 MOV, MKV, WebM, AVI, M4V)를 업로드하면 다운로드할 수 있는 .srt 자막 파일을 만들어 드려요.',
        },
        {
          question: 'SRT 파일을 YouTube에서 쓸 수 있나요?',
          answer: '네. YouTube는 SRT를 바로 받아요. 동영상을 업로드한 다음 자막 → 언어 추가 → 파일 업로드에서 자막 파일을 추가하세요.',
        },
        {
          question: '어떤 언어를 지원하나요?',
          answer: 'Whisper는 수십 개 언어를 지원하며 말하는 언어를 자동으로 감지할 수 있어요. 아주 짧은 클립의 정확도를 높이려면 BCP-47 힌트(예: en, es, ja)를 줄 수도 있어요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '받아쓰기는 저희 로컬 GPU 서버에서 실행돼요. 파일이 외부 AI 제공업체로 전송되지 않아요.',
          '긴 동영상은 작업이 비동기로 실행되며, 탭을 열어 두고 진행 상황을 지켜볼 수 있어요.',
        ],
      },
      related: [
        {
          label: '자막 번역기',
          to: '/tools/caption-translator',
          description: '만든 SRT를 다른 언어로 번역하세요.',
        },
        {
          label: '동영상에서 오디오 추출',
          to: '/tools/extract-audio-from-video',
          description: '직접 받아쓰기 전에 오디오를 뽑아내세요.',
        },
        {
          label: '동영상에서 프레임 추출',
          to: '/tools/extract-frames-from-video',
          description: '썸네일과 참고용 정지 이미지를 뽑아내세요.',
        },
        {
          label: '동영상을 HLS로 트랜스코딩',
          to: '/tools/transcode-to-hls',
          description: '스트리밍용으로 동영상을 준비하세요.',
        },
        {
          label: '동영상을 DASH로 트랜스코딩',
          to: '/tools/transcode-to-dash',
          description: 'AV1 / VP9 DASH 패키징.',
        },
      ],
      embed: {
        title: 'SRT 자막 파일 만들기',
        description: '동영상이나 오디오 파일을 업로드하세요. 저희 자체 GPU 서버에서 whisper-ctranslate2로 받아쓰고, 어떤 동영상 편집기에든 바로 넣을 수 있는 .srt 자막 파일을 돌려드려요.',
      },
    },
    'caption-translator': {
      name: '자막 번역기',
      h1: '무료 자막 번역기',
      tagline: 'SRT와 VTT 자막 파일을 큐 타이밍, 큐 순서, 구조를 그대로 유지하면서 번역해요. 외부 AI 제공업체는 쓰지 않아요.',
      metaTitle: '무료 자막 번역기(SRT 및 VTT): 타임스탬프 그대로 유지 | Media Manipulator',
      metaDescription: 'SRT와 VTT 자막을 큐 타이밍 그대로 온라인에서 번역하세요. 저희 자체 로컬 AI 서버에서 실행되므로 자막이 외부 제공업체로 전송되지 않아요.',
      ogTitle: '무료 자막 번역기: SRT 및 VTT',
      ogDescription: '타임스탬프와 큐 순서를 유지하면서 SRT 또는 VTT 자막을 번역하세요. 로컬 AI, 외부 제공업체 없음.',
      intro: '큐 타이밍은 전혀 건드리지 않고 기존 자막 파일을 다른 언어로 번역하세요. Media Manipulator는 .srt 또는 .vtt 파일에서 큐를 파싱하고, 저희가 직접 호스팅하는 자막 번역 모델로 텍스트만 번역한 다음, 원래 타임스탬프를 그대로 다시 써 넣어요. 어떤 외부 번역 API도 자막을 보지 않아요. 모델은 저희 자체 GPU 서버에서 실행돼요.',
      whatItDoes: [
        '.srt 또는 .vtt 자막 파일을 받아 같은 형식(원하면 다른 형식)으로 번역본을 만들어요.',
        '큐 번호, 큐 순서, 타임스탬프를 정확히 유지해요. 번역되는 건 큐 텍스트뿐이에요.',
        '자막에 맞게 조정한 맞춤 모델로 저희 로컬 Ollama 모델 서버에서 번역을 실행해요. 자막은 저희 인프라 밖으로 나가지 않아요.',
        '주요 유럽, 아시아, 중동 언어를 포함해 30개 이상의 대상 언어를 지원해요.',
      ],
      flowSteps: [
        {
          title: '.srt 또는 .vtt 업로드',
          description: '기존 자막 파일을 업로더에 끌어다 놓으세요.',
        },
        {
          title: '언어 선택',
          description: '원본 언어를 자동 감지하거나 직접 고른 다음 대상 언어를 선택하세요.',
        },
        {
          title: '큐 텍스트 번역',
          description: '저희 로컬 AI가 자막 텍스트만 번역해요. 타임스탬프와 순서는 고정돼요.',
        },
        {
          title: '번역된 자막 다운로드',
          description: '타이밍은 똑같고 모든 큐가 번역된 깔끔한 .srt 또는 .vtt를 받으세요.',
        },
      ],
      advancedDetails: [
        '번역은 저희 자체 Ollama 서버에서 Translate-Gemma를 자막용으로 조정한 파생 모델(mm-captions-translategemma-12b)로 실행돼요.',
        '모델에는 큐 텍스트와 엄격한 JSON 스키마 헤더만 보내고, 응답을 읽을 때 원본 파일의 타이밍을 다시 고정해요. 그래서 모델이 오작동하더라도 큐 타이밍이 망가지지 않아요.',
        'VTT 파일의 NOTE 및 STYLE 블록은 그대로 보존되며 번역기로 전송되지 않아요.',
        '긴 자막 트랙은 큐를 묶어서 처리하므로 모델이 컨텍스트 한도에 가까워지지 않아요.',
      ],
      whyItMatters: [
        '자막을 직접 번역하면 실수하기 쉬워요. 타임스탬프 형식을 깨뜨리거나 실수로 큐 순서를 뒤바꾸기가 아주 쉽거든요.',
        '자막 전용 번역기는 편집기와 플레이어가 기대하는 파일 구조를 그대로 지켜요.',
        '로컬 모델로 직접 번역하면 크리에이터의 작업 흐름이 외부 번역 서비스의 가격과 정책에 좌우되지 않아요.',
      ],
      useCases: [
        {
          title: '다국어 YouTube 채널',
          description: '하나의 영어 마스터 SRT를 같은 업로드용으로 5개 이상의 언어로 번역하세요.',
        },
        {
          title: '온라인 강의',
          description: '해외 학생들에게 모국어 자막으로 다가가세요.',
        },
        {
          title: '다큐멘터리/영화제',
          description: '큐 타이밍을 건드리지 않고 번역 트랙을 준비하세요.',
        },
        {
          title: '뉴스 및 저널리즘',
          description: '정확한 싱크를 유지하면서 속보 자막 트랙을 번역하세요.',
        },
      ],
      whyMediaManipulator: [
        '로컬 AI 번역: 자막이 외부 AI 제공업체로 전송되지 않아요.',
        '모델이 오작동하더라도 원래 큐의 시작/종료 시간을 다시 고정하는, 타이밍에 안전한 파싱.',
      ],
      privacyNote: 'SRT 또는 VTT 파일에서는 텍스트만 읽어요. 각 자막은 저희 자체 GPU 서버에서 실행하는 언어 모델이 번역하고, 타이밍은 바뀌지 않은 채 그대로 복사돼요. AI 작업은 외부 AI 제공업체가 아니라 저희가 운영하는 하드웨어에서 실행되며, 업로드한 내용은 모델 학습에 사용되지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      faq: [
        {
          question: '타임스탬프를 깨뜨리지 않고 SRT 파일을 번역할 수 있나요?',
          answer: '네. 그게 바로 이 도구의 핵심이에요. 큐를 파싱하고 텍스트만 번역한 다음, 출력을 쓰기 전에 원래 타임스탬프를 정확히 다시 고정해요.',
        },
        {
          question: '어떤 자막 형식을 지원하나요?',
          answer: 'SubRip(.srt)과 WebVTT(.vtt)를 모두 지원해요. 출력 형식을 입력과 같게 유지하거나 서로 변환할 수 있어요.',
        },
        {
          question: 'YouTube 동영상의 자막을 번역할 수 있나요?',
          answer: '네. 동영상에서 SRT를 만들거나 내보내고, 여기서 번역한 다음, 새 SRT를 YouTube에 추가 언어 트랙으로 업로드하세요.',
        },
        {
          question: '자막을 외부 AI 제공업체로 번역하나요?',
          answer: '아니요. 번역은 저희가 직접 Ollama로 호스팅하는 모델에서 실행돼요. 자막은 저희 인프라 밖으로 나가지 않아요.',
        },
        {
          question: '큐 타이밍은 어떻게 되나요?',
          answer: '큐 시작 시간과 종료 시간은 정확히 유지돼요. 번역 후 원본 파일에서 다시 고정하므로 모델이 오작동하더라도 타이밍이 망가지지 않아요.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '최대 자막 파일 크기: 2 MB(실제 자막 트랙은 보통 이보다 훨씬 작아요).',
        ],
        processingNotes: [
          '번역은 직접 호스팅하는 Ollama 모델에서 실행돼요. 외부 번역 API에는 연결하지 않아요.',
          'WebVTT 파일의 NOTE 및 STYLE 블록은 그대로 보존돼요.',
        ],
      },
      related: [
        {
          label: 'SRT 자막 생성기',
          to: '/tools/srt-generator',
          description: '동영상이나 오디오 파일에서 새 SRT를 만드세요.',
        },
        {
          label: '동영상에서 오디오 추출',
          to: '/tools/extract-audio-from-video',
          description: '검토하거나 다시 받아쓰기 위해 오디오를 뽑아내세요.',
        },
        {
          label: '동영상에 오디오 추가',
          to: '/tools/stitch-audio-to-video',
          description: '자막을 번역한 뒤 번역된 보이스오버를 입히세요.',
        },
        {
          label: '동영상을 HLS로 트랜스코딩',
          to: '/tools/transcode-to-hls',
          description: '스트리밍용으로 동영상을 묶으세요.',
        },
        {
          label: '동영상을 DASH로 트랜스코딩',
          to: '/tools/transcode-to-dash',
          description: 'AV1 / VP9 DASH 패키징.',
        },
      ],
      embed: {
        title: 'SRT 또는 VTT 자막 파일 번역',
        description: '기존 .srt 또는 .vtt 파일을 업로드하고 대상 언어를 고르면, 원래 큐 타이밍이 정확히 유지된 번역 자막 파일을 받을 수 있어요.',
      },
    },
    'audio-waveform-generator': {
      name: '오디오 파형 생성기',
      h1: '무료 오디오 파형 생성기',
      tagline: '어떤 오디오 파일이든 설정 가능한 파형 동영상이나 파형 이미지, 또는 둘 다로 만들어요. 팟캐스트, 음악 미리듣기, 소셜 클립에 알맞아요.',
      metaTitle: '무료 오디오 파형 생성기: 파형 동영상과 이미지 | Media Manipulator',
      metaDescription: '어떤 오디오 파일에서든 파형 동영상과 이미지를 만드세요. 10:1 와이드 팟캐스트 띠, 정사각형 소셜 미리보기, 스테레오 채널 분리, 맞춤 색상 등을 지원해요.',
      ogTitle: '무료 오디오 파형 생성기',
      ogDescription: 'MP3, WAV, M4A, FLAC 등에서 파형 동영상과 이미지를 만드세요. 세밀하게 설정할 수 있고 가입이 필요 없어요.',
      intro: '파형은 오디오를 눈에 보이게 만들어요. 팟캐스트, 음악 미리듣기, 소셜 클립 썸네일, 편집 타임라인에 꼭 필요한 에셋이에요. Media Manipulator는 FFmpeg의 showwaves / showwavespic 필터로 파형을 렌더링하며, 합리적인 기본값(1600×160의 10:1 와이드 띠)과 함께 렌더링 모드, 색상, 스케일, 스테레오 분리를 조정하는 완전한 고급 패널을 제공해요.',
      whatItDoes: [
        'FFmpeg의 showwaves 필터로 애니메이션 파형 동영상을 렌더링하며, point / line / p2p / cline 모드를 지원해요.',
        'FFmpeg의 showwavespic 필터로 정지 파형 이미지를 렌더링해요. 썸네일과 앨범 아트에 딱 맞아요.',
        '권장 화면 비율 프리셋(10:1 와이드, 8:1, 6:1, 16:9, 1:1)과 사용자 지정 너비 및 높이를 지원해요.',
        '선택적인 채널 분리 렌더링으로 왼쪽과 오른쪽 채널을 서로 다른 색으로 그려요.',
      ],
      flowSteps: [
        {
          title: '오디오 업로드',
          description: 'MP3, WAV, M4A, AAC, FLAC, OGG 파일을 끌어다 놓으세요.',
        },
        {
          title: '출력과 크기 선택',
          description: '파형 동영상, 이미지 또는 둘 다를 고르고, 화면 비율 프리셋이나 사용자 지정 크기를 선택하세요.',
        },
        {
          title: '모양 조정(선택 사항)',
          description: '고급 패널에서 렌더링 모드, 프레임 레이트, 색상, 스케일, 그리기 모드를 조정하세요.',
        },
        {
          title: '다운로드',
          description: '파형 동영상, 이미지, 또는 둘 다 담긴 .zip을 저장하세요.',
        },
      ],
      advancedDetails: [
        '렌더링 모드는 FFmpeg의 showwaves 모드인 point, line, p2p, cline에 그대로 대응해요. 양식에서 각 모드를 미리 볼 수 있어 눈으로 보고 고를 수 있어요.',
        '출력 프레임 레이트(rate=)와 열당 샘플 수(n=) 중 하나만 선택할 수 있어요. 둘을 함께 쓸 수 없는 FFmpeg 매개변수 규칙과 같아요.',
        '스케일 옵션(lin, log, sqrt, cbrt)으로 조용한 구간이 얼마나 잘 보일지 정할 수 있어요.',
        '동영상과 이미지를 모두 요청하면 하나의 .zip으로 묶어 드려요. 다른 모든 Media Manipulator 다운로드와 같은 작업 시스템이에요.',
      ],
      whyItMatters: [
        '파형 영상은 오디오 콘텐츠를 공유하기 좋게 만들어요. 움직이는 파형이 있는 클립은 소리 없이 자동 재생되는 소셜 피드에서 정적인 썸네일보다 훨씬 좋은 성과를 내요.',
        '편집자와 프로듀서는 타임라인을 구성하거나 앨범 커버를 디자인할 때 파형을 참고 에셋으로 사용해요.',
        '잘 조정된 파형 하나는 썸네일, 오디오그램, 오디오 티저 역할을 한꺼번에 해요.',
      ],
      useCases: [
        {
          title: '팟캐스트',
          description: '소셜용 오디오그램을 만드세요. 클립 + 파형 + 자막 = 가장 성과가 좋은 팟캐스트 홍보 형식이에요.',
        },
        {
          title: '음악 미리듣기',
          description: 'Instagram용 정사각형 파형 카드나 YouTube 설명란용 와이드 카드를 만드세요.',
        },
        {
          title: '편집 타임라인',
          description: 'Premiere나 DaVinci Resolve 안에서 정지 이미지 파형을 참고 프레임으로 사용하세요.',
        },
        {
          title: '보이스오버 납품',
          description: 'WAV와 함께 파형 카드를 보내 클라이언트가 한눈에 미리 볼 수 있게 하세요.',
        },
      ],
      whyMediaManipulator: [
        '기본값이 FFmpeg의 600×240 기본값 대신 가장 유용한 모양(10:1 와이드)에 맞춰져 있어요.',
        '고급 FFmpeg 컨트롤을 안전하게 제공해요. 모든 설정은 필터 그래프에 전달되기 전에 서버에서 검증돼요.',
        'MP4, PNG, 또는 둘 다 담긴 ZIP으로 출력해요. 두 번째 작업을 실행할 필요가 없어요.',
      ],
      privacyNote: '오디오는 저희 서버에서 FFmpeg로 파형 이미지나 동영상으로 그려져요. 외부 오디오 서비스는 관여하지 않아요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 새 파일이 만들어지며 업로드한 파일 자체는 바뀌지 않아요.',
      faq: [
        {
          question: '오디오 파형이 무엇인가요?',
          answer: '파형은 오디오 신호의 진폭을 시간에 따라 시각적으로 나타낸 거예요. 동영상 편집기나 SoundCloud 같은 플랫폼에서 보이는 움직이는 선이 바로 파형이에요.',
        },
        {
          question: 'MP3로 파형 동영상을 만들 수 있나요?',
          answer: '네. MP3(또는 WAV/M4A/FLAC/OGG/AAC)를 업로드하면 FFmpeg의 showwaves 필터로 파형 동영상을 렌더링해요.',
        },
        {
          question: '파형 이미지도 만들 수 있나요?',
          answer: '네. 출력을 "이미지"로 설정하면 정지 PNG/WebP를, "둘 다"로 설정하면 동영상과 이미지가 담긴 ZIP을 받을 수 있어요.',
        },
        {
          question: '파형은 어떤 크기로 만들어야 하나요?',
          answer: '대부분의 팟캐스트와 음악 작업에는 10:1 와이드 프리셋(1600×160)이 가장 보기 좋아요. 소셜에 맞는 모양이 필요하면 16:9나 1:1을 쓰세요.',
        },
        {
          question: 'point, line, p2p, cline 모드는 무슨 뜻인가요?',
          answer: 'FFmpeg showwaves의 렌더링 모드예요. point는 샘플마다 점을 찍고, line은 세로 막대를 그리고, p2p는 각 점을 선으로 잇고, cline은 가운데를 중심으로 한 세로 막대를 그려요. 양식에서 각 모드를 미리 볼 수 있어요.',
        },
        {
          question: '왼쪽과 오른쪽 오디오 채널을 분리할 수 있나요?',
          answer: '네. 고급 설정에서 "스테레오 채널 분리"를 켜고 채널마다 다른 색을 고르세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '권장 기본값: 10:1 와이드 파형(1600×160). 팟캐스트, 음악 미리듣기, 편집 타임라인에 좋아요.',
          '"둘 다"를 선택하면 동영상과 이미지가 담긴 하나의 ZIP으로 결과가 묶여요.',
        ],
      },
      related: [
        {
          label: '동영상에서 오디오 추출',
          to: '/tools/extract-audio-from-video',
          description: '파형을 만들기 전에 동영상에서 오디오를 뽑아내세요.',
        },
        {
          label: 'SRT 자막 생성기',
          to: '/tools/srt-generator',
          description: '파형에 자막을 더해 소셜 오디오그램을 만드세요.',
        },
        {
          label: '동영상에 오디오 추가',
          to: '/tools/stitch-audio-to-video',
          description: '파형 렌더링을 다른 동영상과 합치세요.',
        },
      ],
      embed: {
        title: '오디오 파일로 파형 만들기',
        description: '오디오 파일을 업로드하고 파형 동영상, 파형 이미지, 또는 둘 다 중에서 원하는 것을 고르세요. 고급 컨트롤로 크기, 색상, 렌더링 모드, 스테레오 동작을 조정할 수 있어요. 기본값은 팟캐스트와 음악 미리듣기에 알맞은 10:1 와이드 파형 동영상이에요.',
      },
    },
    'extract-video-only-from-video': {
      name: '오디오 없이 동영상만 추출',
      h1: '오디오 없이 동영상만 추출 (동영상 전용)',
      tagline: '모든 오디오 트랙을 제거한 무음, 동영상 전용 사본을 내보내요. 무음 미리보기, B-roll, 편집, 음악 다시 입히기에 알맞아요.',
      metaTitle: '오디오 없이 동영상만 추출: 동영상 전용 내보내기 | Media Manipulator',
      metaDescription: '모든 오디오 트랙을 제거한 동영상 전용(무음) 사본을 내보내는 무료 온라인 도구예요. 가능하면 동영상을 스트림 복사해요. 다시 인코딩하지 않으니 화질 손실도 없어요.',
      ogTitle: '오디오 없이 동영상만 추출 (동영상 전용)',
      ogDescription: '모든 오디오 트랙을 제거한 동영상 전용(무음) 사본을 내보내세요. 무료, 가입 불필요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      intro: '오디오 없이 동영상만 필요할 때가 있어요. 소리 없는 소셜 피드 미리보기, 새 편집에 넣을 B-roll 에셋, 새 음악을 입히는 음악 재작업 등이 그래요. Media Manipulator는 모든 오디오 트랙을 제거하고 깔끔한 동영상 전용 파일을 만들어요. 동영상 스트림은 가능한 한 스트림 복사하므로 다시 인코딩도, 화질 손실도 없어요.',
      whatItDoes: [
        '동영상에서 모든 오디오 스트림을 제거해요.',
        '가능한 한 동영상 스트림을 스트림 복사해요. 다시 인코딩하지 않으니 화질 손실도 없어요.',
        '대상 컨테이너가 요구할 때만 호환되는 H.264 baseline으로 다시 인코딩해요.',
        '새 편집에 바로 넣을 수 있는 무음 MP4(또는 WebM)를 돌려드려요.',
      ],
      flowSteps: [
        {
          title: '동영상 업로드',
          description: 'MP4, MOV, MKV, WebM, AVI, M4V 파일을 끌어다 놓으세요.',
        },
        {
          title: '출력 컨테이너 선택',
          description: 'MP4가 안전한 기본값이에요. WebM은 VP9/AV1 원본용으로 제공돼요.',
        },
        {
          title: '오디오 제거',
          description: 'FFmpeg가 오디오 스트림을 빼고 가능하면 동영상 스트림을 복사해요.',
        },
        {
          title: '무음 동영상 다운로드',
          description: '오디오가 없는 깔끔한 동영상 사본을 저장하세요.',
        },
      ],
      advancedDetails: [
        '기본 시도는 `-c:v copy`를 사용하므로 다시 인코딩하지 않아요. 동영상 스트림의 화질이 비트 단위까지 그대로 유지돼요.',
        '대상 컨테이너가 원본 코덱을 받지 않으면 CRF 20의 libx264 + yuv420p 다시 인코딩으로 전환해요.',
        '워터마크도, 오버레이도, 크기 조정도 없어요. 기본적으로 출력 영상은 원본과 똑같아요.',
      ],
      whyItMatters: [
        '무음 동영상은 대부분의 소셜 플랫폼에서 사실상 표준인 자동 재생 형식이에요.',
        '오디오 제거는 개인정보 보호 단계이기도 해요. 화면 녹화를 공유하기 전에 녹음된 목소리나 대화 내용을 없애 줘요.',
        '편집자는 음악을 새로 입히거나 다른 오디오 녹음과 싱크를 맞추기 위해 깔끔한 동영상 전용 파일을 원하는 경우가 많아요.',
      ],
      useCases: [
        {
          title: '무음 소셜 미리보기',
          description: 'Instagram, X, LinkedIn, TikTok용 깔끔한 자동 재생 클립을 만드세요.',
        },
        {
          title: '음악 재작업 프로젝트',
          description: '음악이나 보이스오버를 추가하기 전에 원래 오디오를 제거하세요.',
        },
        {
          title: '개인정보에 민감한 공유',
          description: '화면 녹화 중 녹음된 배경 대화를 제거하세요.',
        },
        {
          title: 'B-roll 준비',
          description: '오디오 없는 클립을 멀티캠 편집이나 B-roll 중심 편집에 넣으세요.',
        },
      ],
      whyMediaManipulator: [
        '가능하면 스트림 복사해 원래 동영상 화질을 유지해요.',
        '명확하고 빠르며, 가입도 워터마크도 없어요.',
        '무료예요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
      ],
      privacyNote: '동영상은 저희 서버에서 FFmpeg로 오디오 트랙만 뺀 채 복사돼요. 작업은 외부 트랜스코딩 서비스가 아니라 저희 자체 서버에서 실행돼요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: '동영상에서 오디오는 어떻게 제거하나요?',
          answer: '동영상을 업로드하고 "동영상에서 오디오 제거"를 클릭하세요. 선택한 컨테이너로 동영상 전용 사본을 만들어 드려요.',
        },
        {
          question: '동영상 화질이 바뀌나요?',
          answer: '기본적으로는 아니요. 동영상 스트림을 스트림 복사하므로 출력의 영상 부분은 비트 단위까지 똑같아요. 대상 컨테이너가 필요로 할 때만 다시 인코딩해요.',
        },
        {
          question: 'MP4를 무음으로 만들 수 있나요?',
          answer: '네. MP4가 기본 출력 컨테이너이며 가장 흔한 사용 사례예요.',
        },
        {
          question: '원본 동영상이 수정되나요?',
          answer: '아니요. 업로드한 원본은 그대로 유지돼요. 새 파일을 만들고, 업로드한 파일은 보관 규칙에 따라 보관하거나 삭제해요. 비회원의 파일은 24시간 보관되며, 무료 계정이 있으면 24시간부터 2년까지 직접 선택할 수 있어요.',
        },
        {
          question: '동영상에 오디오가 없으면 어떻게 되나요?',
          answer: '문제없어요. 도구가 정상적으로 완료되고 깔끔하게 다시 패키징한 사본을 돌려드려요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '대상 컨테이너가 지원하는 한 동영상 스트림은 다시 인코딩 없이 복사돼요.',
          '오디오 스트림이 없는 입력 동영상도 정상적으로 처리되어 다시 패키징된 사본을 돌려드려요.',
        ],
      },
      related: [
        {
          label: '동영상에서 오디오 제거',
          to: '/tools/remove-audio-from-video',
          description: '일반 사용자를 위한 음소거/소리 제거 페이지예요.',
        },
        {
          label: '동영상에서 오디오 추출',
          to: '/tools/extract-audio-from-video',
          description: '오디오 트랙을 MP3, WAV 등으로 뽑아내세요.',
        },
        {
          label: '동영상에 오디오 추가',
          to: '/tools/stitch-audio-to-video',
          description: '무음 동영상에 새 사운드트랙을 입히세요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '무음 동영상의 용량을 줄여요.',
        },
        {
          label: '동영상에서 프레임 추출',
          to: '/tools/extract-frames-from-video',
          description: '무음 동영상에서 정지 이미지를 뽑아내세요.',
        },
      ],
      embed: {
        title: '동영상에서 오디오 제거',
        description: '동영상을 업로드하면 무음/동영상 전용 사본을 만들어 드려요. 동영상 스트림은 가능한 한 스트림 복사하므로 다시 인코딩도, 화질 손실도 없어요.',
      },
    },
    'extract-frames-from-video': {
      name: '동영상에서 프레임 추출',
      h1: '동영상에서 프레임 추출',
      tagline: 'N초마다, 원하는 프레임 레이트로, 또는 특정 시점에서 동영상의 정지 이미지 프레임을 뽑아 ZIP으로 다운로드해요.',
      metaTitle: '동영상에서 프레임 추출: 무료 프레임 추출 도구 | Media Manipulator',
      metaDescription: '어떤 동영상에서든 정지 이미지를 추출하는 무료 온라인 도구예요. N초마다, 초당 프레임 수, 특정 타임스탬프 중에서 고르세요. JPG, PNG 또는 WebP 프레임을 ZIP으로 받을 수 있어요.',
      ogTitle: '동영상에서 프레임 추출',
      ogDescription: 'MP4, MOV, MKV, WebM, AVI, M4V에서 정지 이미지 프레임을 뽑아내세요. JPG, PNG 또는 WebP 프레임이 담긴 ZIP으로 다운로드할 수 있어요.',
      intro: '프레임 추출은 동영상을 다시 정지 이미지의 연속으로 바꿔요. 썸네일, 참고용 장면, 디자인 목업, 머신러닝 데이터셋, 애니메이션·스토리보드 미리보기에 유용해요. Media Manipulator에서는 N초마다, 목표 프레임 레이트로, 또는 특정 타임스탬프에서 프레임을 뽑을 수 있고, 추출된 이미지를 하나의 ZIP으로 묶어 다운로드할 수 있게 해 줘요.',
      whatItDoes: [
        '정지 프레임을 JPG, PNG 또는 WebP 이미지로 추출해요.',
        '세 가지 샘플링 방식을 지원해요: N초마다, 목표 초당 프레임 수, 특정 타임스탬프.',
        '프레임을 하나의 ZIP으로 묶어 클릭 한 번으로 다운로드할 수 있어요.',
        '최대 프레임 수 제한을 적용해 작업이 빠르고 예측 가능하게 끝나요.',
      ],
      flowSteps: [
        {
          title: '동영상 업로드',
          description: 'MP4, MOV, MKV, WebM, AVI, M4V 파일을 끌어다 놓으세요.',
        },
        {
          title: '샘플링 방식 선택',
          description: 'N초마다, 목표 FPS, 또는 쉼표로 구분한 타임스탬프 목록 중에서 고르세요.',
        },
        {
          title: '이미지 형식 선택',
          description: '작은 썸네일에는 JPG, 무손실 정지 이미지에는 PNG, 더 작은 최신 파일에는 WebP를 고르세요.',
        },
        {
          title: 'ZIP 다운로드',
          description: '추출된 모든 프레임이 어디서든 압축을 풀 수 있는 하나의 .zip으로 묶여요.',
        },
      ],
      advancedDetails: [
        'N초마다 방식과 FPS 방식은 FFmpeg의 fps 필터를 사용해 타임라인 전체에서 고르게 샘플링해요.',
        '타임스탬프 방식은 요청한 타임스탬프마다 FFmpeg를 한 번씩 실행하므로, 프레임별 실패(범위를 벗어난 요청 등)가 분명하게 드러나요.',
        '최대 프레임 수 제한은 기본 300이고 최대 1000까지 올릴 수 있어요. 작업을 빠르게 유지하고 걷잡을 수 없이 커지는 추출을 막아 줘요.',
      ],
      whyItMatters: [
        '프레임 추출은 기존 동영상에서 썸네일이나 참고용 프레임을 얻는 가장 간단한 방법이에요.',
        '디자이너와 애니메이터는 샘플링한 프레임을 드로잉 참고 자료나 스토리보드용 B-roll로 활용해요.',
        '머신러닝 실무자는 별도 파이프라인 없이도 분류나 탐지용 데이터셋을 만드는 데 사용해요.',
      ],
      useCases: [
        {
          title: '썸네일과 미리보기',
          description: 'YouTube/Vimeo 썸네일로 쓸 프레임 하나를 골라요.',
        },
        {
          title: '디자인 참고 자료',
          description: '게임 플레이나 애니메이션에서 연속 프레임을 뽑아 드로잉 참고 자료로 써요.',
        },
        {
          title: '스토리보드',
          description: '스토리보드 피치용 키 프레임을 연속으로 만들어요.',
        },
        {
          title: '머신러닝 데이터셋',
          description: '적은 수의 동영상으로 작은 이미지 데이터셋을 빠르게 만들어요.',
        },
      ],
      whyMediaManipulator: [
        '간격, FPS, 특정 타임스탬프의 세 가지 샘플링 방식으로 실제로 필요한 거의 모든 경우를 다룰 수 있어요.',
        'ZIP으로 출력되므로 프레임을 몇 개 뽑든 클릭 한 번으로 다운로드할 수 있어요.',
        '서버의 FFmpeg로 처리하므로 브라우저나 코덱 지원 여부와 관계없이 일관된 결과를 얻어요.',
      ],
      privacyNote: '저희 서버의 FFmpeg가 선택한 간격으로 동영상에서 프레임을 뽑아 이미지 ZIP으로 돌려드려요. 작업은 외부 트랜스코딩 서비스가 아니라 저희 자체 서버에서 실행돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: '동영상에서 프레임을 어떻게 추출하나요?',
          answer: '동영상을 업로드하고 샘플링 방식(기본값은 N초마다)과 이미지 형식을 고른 다음 "프레임 추출"을 클릭하세요. 결과는 정지 이미지가 담긴 ZIP이에요.',
        },
        {
          question: '몇 초마다 프레임을 하나씩 내보낼 수 있나요?',
          answer: '네, 그게 기본 방식이에요. "프레임 간격 (초)"을 원하는 간격으로 설정하세요.',
        },
        {
          question: '어떤 이미지 형식을 지원하나요?',
          answer: 'JPG(작고 썸네일에 적합), PNG(무손실), WebP(더 작은 최신 파일)를 지원해요.',
        },
        {
          question: '왜 ZIP 파일로 받게 되나요?',
          answer: '짧은 동영상에서도 프레임이 수십 개 나올 수 있어요. 하나의 ZIP으로 돌려드리면 클릭 한 번으로 다운로드할 수 있고, 여러 파일을 내려받을 때 브라우저와 씨름할 필요도 없어요.',
        },
        {
          question: '최대 프레임 수 제한이 왜 있나요?',
          answer: '실수로 작업이 걷잡을 수 없이 커지는 것(예: 긴 동영상에서 프레임 수만 개 추출)을 막기 위해서예요. 기본값은 300이고 절대 상한은 1000이에요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '기본 최대 프레임 수는 300이에요. 정말 더 필요하면 양식에서 1000까지 올릴 수 있어요.',
          '타임스탬프 방식은 쉼표로 구분한 초 목록을 받아요(예: "1, 5.5, 12.25, 30").',
        ],
      },
      related: [
        {
          label: '동영상에서 오디오 추출',
          to: '/tools/extract-audio-from-video',
          description: '같은 동영상에서 오디오를 뽑아내세요.',
        },
        {
          label: 'SRT 자막 생성기',
          to: '/tools/srt-generator',
          description: '같은 동영상을 .srt 자막으로 전사하세요.',
        },
        {
          label: '동영상에서 오디오 제거',
          to: '/tools/extract-video-only-from-video',
          description: '오디오를 없애고 소리 없는 동영상 사본을 만드세요.',
        },
      ],
      embed: {
        title: '동영상에서 프레임 추출하기',
        description: '동영상을 업로드하고 샘플링 방식(N초마다, 지정한 프레임 레이트로, 또는 특정 타임스탬프에서)을 고른 다음 정지 프레임이 담긴 ZIP을 다운로드하세요.',
      },
    },
    'stitch-audio-to-video': {
      name: '동영상에 오디오 추가',
      h1: '동영상에 오디오 추가',
      tagline: '기본 동영상에 보이스오버, 음악, 내레이션 등 오디오 파일을 최대 세 개까지 합쳐 새 MP4로 다운로드해요.',
      metaTitle: '동영상에 오디오 추가: 보이스오버, 음악, 교체, 믹스 | Media Manipulator',
      metaDescription: '동영상에 보이스오버, 음악, 내레이션을 추가하거나 원본 오디오를 통째로 교체하는 무료 온라인 도구예요. 트랙별 볼륨과 시작 오프셋을 조절하고 MP4로 출력해요.',
      ogTitle: '동영상에 오디오 추가',
      ogDescription: '보이스오버, 음악, 내레이션을 추가하거나 원본 오디오를 교체하세요. 트랙별 볼륨과 오프셋 조절, MP4 출력, 가입 필요 없음.',
      intro: '기본 동영상에 오디오 파일을 하나 이상 합치는 것은 가장 흔한 편집 작업 중 하나예요. 보이스오버를 넣거나, 배경 음악을 깔거나, 화면 녹화에 내레이션을 입히거나, 원본 오디오를 통째로 바꾸는 경우죠. Media Manipulator는 트랙별 볼륨과 오프셋 조절, 믹스/교체 전환, 그리고 어떤 플레이어에서든 문제없이 재생되는 MP4 출력을 제공해요.',
      whatItDoes: [
        '기본 동영상에 오디오 트랙을 최대 세 개까지 추가로 합쳐요.',
        '트랙별 조절: 볼륨(0–4×), 초 단위 시작 오프셋, 동영상 길이에 맞춘 반복(선택 사항).',
        '전체 모드 전환: "믹스"는 원본 오디오를 유지하고, "교체"는 원본 오디오를 없애요.',
        '출력은 항상 192 kbps AAC 오디오가 들어간 MP4예요. 어디서나 안전하게 재생되는 기본값이에요.',
      ],
      flowSteps: [
        {
          title: '기본 동영상 업로드',
          description: 'MP4, MOV, MKV, WebM, AVI, M4V 파일을 끌어다 놓으세요.',
        },
        {
          title: '오디오 트랙 추가',
          description: '보이스오버, 음악, 내레이션 등 오디오 파일을 최대 세 개까지 트랙별 설정과 함께 추가하세요.',
        },
        {
          title: '믹스 또는 교체 선택',
          description: '원본 오디오를 유지하고 새 트랙을 섞거나, 원본을 없애고 새 오디오만 사용하세요.',
        },
        {
          title: '새 MP4 다운로드',
          description: '저희 서버에서 합친 뒤 깔끔한 MP4로 돌려드려요.',
        },
      ],
      advancedDetails: [
        '필터 그래프는 프로그램으로 구성돼요. 트랙마다 adelay와 volume 노드를 두고, 하나의 amix로 모두 합쳐요.',
        '동영상 스트림은 가능한 한 스트림 복사돼요. 오디오만 다시 인코딩돼요(192 kbps AAC로).',
        '반복은 오디오 입력에 `-stream_loop -1`을 적용해 구현하므로, 짧은 배경 음악도 동영상 길이만큼 깔끔하게 이어져요.',
        '출력 길이는 기본적으로 "동영상 길이에 맞춰 자르기"예요. 가장 긴 입력까지 출력을 늘리려면 체크를 해제하세요.',
      ],
      whyItMatters: [
        '보이스오버, 음악, 내레이션은 숏폼 동영상에 가장 흔히 추가되는 오디오예요.',
        '트랙별 볼륨과 오프셋을 조절할 수 있어서 트랙 하나를 얹는 데 그치지 않고 제대로 된 믹스를 만들 수 있어요.',
        '브라우저에서 이 작업을 하면 느리고 불안정해요. 서버의 FFmpeg는 빠르고 정확해요.',
      ],
      useCases: [
        {
          title: '크리에이터 동영상',
          description: '토킹 헤드 구간 아래에 배경 음악을 깔거나, 현장 소리를 깨끗한 보이스오버로 바꾸세요.',
        },
        {
          title: '튜토리얼',
          description: '화면 녹화 위에 내레이션 트랙을 얹으세요.',
        },
        {
          title: '소셜 클립',
          description: '15초 편집본의 원하는 지점에 유행하는 음악을 넣으세요.',
        },
        {
          title: '가족 / 개인 동영상',
          description: '여행 몽타주에 배경 음악을 추가하세요.',
        },
      ],
      whyMediaManipulator: [
        '오디오 파일 하나를 얹는 게 아니라 트랙별로 볼륨과 오프셋을 조절할 수 있어요.',
        '가능하면 동영상을 스트림 복사해서 원본 화질을 그대로 지켜요.',
        '무료이고 가입이 필요 없으며 서버의 FFmpeg로 처리해요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      ],
      privacyNote: '동영상과 추가한 오디오 파일은 저희 서버의 FFmpeg가 하나의 MP4로 합쳐요. 작업은 외부 트랜스코딩 서비스가 아니라 저희 자체 서버에서 실행돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 원본 파일은 그대로 두고 결과는 새 파일로 만들어져요.',
      faq: [
        {
          question: '동영상에 음악을 넣을 수 있나요?',
          answer: '네. 음악 파일을 오디오 트랙으로 추가하고 볼륨을 정한 다음, 모드를 "믹스"로 두면 원본 오디오가 그 아래에 유지돼요.',
        },
        {
          question: '원본 오디오를 유지하면서 보이스오버를 추가할 수 있나요?',
          answer: '네. 모드를 "믹스"로 두고 보이스오버를 추가하세요. 보이스오버가 위에 또렷하게 들리게 하려면 추가 트랙의 볼륨을 낮게 설정해 원본 오디오를 상대적으로 줄이세요.',
        },
        {
          question: '원본 오디오 트랙을 교체할 수 있나요?',
          answer: '네. 모드를 "교체"로 설정하면 원본 오디오가 제거돼요. 추가한 트랙만 출력에 섞여요.',
        },
        {
          question: '오디오가 동영상보다 길면 어떻게 되나요?',
          answer: '기본적으로 동영상 길이에 맞춰 잘라요. 가장 긴 입력까지 출력을 늘리려면 "동영상 길이에 맞춰 자르기"의 체크를 해제하세요.',
        },
        {
          question: '추가한 오디오의 볼륨을 조절할 수 있나요?',
          answer: '네. 추가한 트랙마다 볼륨 배율(0–4×)과 초 단위 시작 오프셋을 따로 설정할 수 있어요.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '작업 하나에 오디오 트랙을 최대 3개까지 추가할 수 있어요.',
        ],
        processingNotes: [
          '동영상 스트림은 가능한 한 스트림 복사돼요. 오디오만 다시 인코딩돼요(AAC 192 kbps로).',
          '반복 체크박스를 켜면 짧은 배경 음악이 동영상 길이만큼 늘어나요.',
        ],
      },
      related: [
        {
          label: '동영상에서 오디오 추출',
          to: '/tools/extract-audio-from-video',
          description: '한 동영상에서 오디오를 뽑아 다른 동영상에 다시 쓰세요.',
        },
        {
          label: '동영상에서 오디오 제거',
          to: '/tools/extract-video-only-from-video',
          description: '오디오를 없애고 새로 음악을 입힐 깨끗한 바탕을 준비하세요.',
        },
        {
          label: '오디오 파형 생성기',
          to: '/tools/audio-waveform-generator',
          description: '오디오 트랙에 어울리는 시각 자료를 만드세요.',
        },
      ],
      embed: {
        title: '동영상의 오디오 트랙 추가 또는 교체',
        description: '기본 동영상을 업로드하고 오디오 파일을 한 개에서 세 개까지 추가한 뒤, 트랙별 볼륨과 오프셋을 정하고 "믹스" 또는 "교체"를 고르세요. 모두 합친 MP4를 돌려드려요.',
      },
    },
    'ai-frame-interpolation': {
      name: 'AI 프레임 보간',
      h1: 'AI 프레임 보간 도구',
      tagline: 'AI가 만든 중간 프레임으로 동영상 프레임 레이트를 48, 60, 120FPS로 높여 움직임을 더 부드럽게 만들어요.',
      metaTitle: 'AI 프레임 보간 도구: 동영상을 60 또는 120 FPS로 변환 | Media Manipulator',
      metaDescription: '무료 온라인 AI 프레임 보간 도구예요. RIFE로 24/30fps 동영상을 더 부드러운 48, 60, 120 FPS MP4로 바꿔요. 외부 API 없이 자체 GPU에서 실행돼요.',
      ogTitle: 'AI 프레임 보간 도구: 동영상을 60 또는 120 FPS로 부드럽게',
      ogDescription: '동영상을 업로드하고 목표 FPS를 고르면, AI가 만든 중간 프레임으로 움직임이 더 부드러워진 MP4를 다운로드할 수 있어요.',
      intro: 'AI 프레임 보간은 기존 프레임을 단순히 복제하거나 섞는 대신 신경망(RIFE)으로 새로운 중간 프레임을 만들어 동영상의 프레임 레이트를 높여요. 결과적으로 움직임이 눈에 띄게 부드러워져요. 24/30fps 영상이 60fps처럼 느껴지기 시작하고, 60fps 클립은 고주사율 화면에 알맞은 120fps로 끌어올릴 수 있어요. 처리는 외부 API가 아니라 저희 자체 GPU 서버에서 이루어지며, 결과는 어떤 플레이어에서든 바로 재생할 수 있는 MP4예요.',
      whatItDoes: [
        '기존 프레임을 복제하거나 섞지 않고 RIFE(rife-ncnn-vulkan)로 새로운 중간 프레임을 합성해요.',
        '직접 정하는 화질 및 최대 처리 높이 프리셋으로 48, 60, 120 FPS를 목표로 해요.',
        '저희 자체 GPU 서버에서 실행되므로 어떤 외부 AI 제공업체도 파일을 보지 않아요.',
        'H.264 + AAC MP4로 돌려드려요(원본의 오디오 트랙은 기본적으로 유지돼요).',
        '길거나 세로로 아주 큰 원본은 미리 제한해 작업 하나가 GPU를 독차지하지 못하게 해요.',
      ],
      flowSteps: [
        {
          title: '동영상 업로드',
          description: '짧은 MP4, MOV, WebM, MKV, AVI 클립을 끌어다 놓으세요.',
        },
        {
          title: 'AI 동영상 도구 열기',
          description: '동영상 양식에서 "AI 동영상 도구"까지 스크롤한 뒤 AI 프레임 보간을 선택하세요.',
        },
        {
          title: '목표 FPS와 화질 선택',
          description: '48, 60, 120 FPS 중 하나와 인코딩 화질 / 최대 처리 높이를 고르세요.',
        },
        {
          title: '보간 실행',
          description: '프레임을 추출하고, 저희 GPU에서 RIFE를 실행한 뒤, 새 FPS로 MP4를 다시 인코딩해요.',
        },
        {
          title: 'MP4 다운로드',
          description: '보간된 클립을 저장하고 원본과 나란히 미리 보세요.',
        },
      ],
      advancedDetails: [
        '프레임 추출에는 vsync=0을 적용한 ffmpeg를 사용해 입력 프레임 수가 원본 FPS와 정확히 일치해요.',
        'RIFE는 선택한 모델 디렉터리로 rife-ncnn-vulkan을 통해 실행돼요(rife-v4.6이 권장 기본값이고, 호환성을 위해 rife-v4와 rife-v2.3도 사용할 수 있어요).',
        '보간 후 ffmpeg가 선택한 화질(낮음/보통/높음에 각각 CRF 26/20/17)로 H.264(libx264) + AAC로 다시 인코딩해요.',
        '원본 오디오는 새 인코딩에 다시 매핑되고, 출력에는 +faststart가 적용되어 HTTP로 문제없이 스트리밍돼요.',
        '최대 처리 높이(기본 720p)가 세로로 큰 원본의 GPU 메모리 부담을 제한해요. 원래 화면 비율은 -2:min(ih,N) 스케일링으로 유지돼요.',
      ],
      whyItMatters: [
        '움직임의 부드러움은 일반 동영상과 방송 품질 동영상 사이에서 체감 차이가 가장 큰 요소 중 하나예요.',
        '최신 디스플레이와 많은 소셜 플랫폼은 더 부드러운 재생을 위해 60fps와 120fps 콘텐츠를 선호해요.',
        '오래되었거나 프레임 레이트가 낮은 영상도 다시 촬영하지 않고 한 단계 끌어올릴 수 있어요.',
      ],
      useCases: [
        {
          title: '웹용 30fps → 60fps',
          description: '토킹 헤드, 화면 녹화, 브이로그 영상을 최신 소셜·동영상 사이트에서 흔한 더 부드러운 60fps 수준으로 끌어올리세요.',
        },
        {
          title: '고주사율 재생용 60fps → 120fps',
          description: '120Hz/144Hz 디스플레이나 이후의 슬로 모션 편집을 위해 영상을 준비하세요.',
        },
        {
          title: '더 부드러운 짧은 클립',
          description: '공유하기 전에 5–10초 편집본을 눈에 띄게 부드럽게 만드세요.',
        },
        {
          title: '오래된 클립 복원',
          description: '예전 24/30fps 클립을 48 또는 60fps로 끌어올려 더 현대적인 재생감을 주세요.',
        },
        {
          title: '편집 준비',
          description: '다른 편집기에서 슬로 모션이나 모션 그래픽을 적용하기 전에 더 촘촘한 프레임 타임라인을 만드세요.',
        },
      ],
      whyMediaManipulator: [
        '저희 자체 GPU 인프라에서 실행되므로 어떤 외부 AI 제공업체도 파일을 받지 않아요.',
        '무거운 PyTorch 스택 대신 이식성 높은 Vulkan 바이너리인 rife-ncnn-vulkan을 사용해요. 의존성이 적고 콜드 스타트가 빨라요.',
        '무료이고 가입이 필요 없어요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      ],
      privacyNote: '새 중간 프레임은 저희 자체 GPU 서버의 RIFE가 동영상에 맞춰 만들어요. AI 작업은 외부 AI 제공업체가 아니라 저희가 운영하는 하드웨어에서 실행되며, 업로드한 어떤 것도 모델 학습에 사용되지 않아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: 'AI 프레임 보간이 실제로 동영상 화질을 높여 주나요?',
          answer: '해상도나 선명도가 아니라 움직임의 부드러움을 높여 줘요. 원본이 이미 60fps라면 120fps에서 더 부드럽게 느껴지고, 24/30fps라면 60fps에 가깝게 느껴져요. 카메라가 담지 못한 실제 움직임을 마법처럼 되살리지는 않아요.',
        },
        {
          question: 'AI 프레임 보간은 그냥 FPS를 높이는 것과 같은가요?',
          answer: '아니요. 일반적인 FPS 변환은 보통 기존 프레임을 복제하거나, 버리거나, 섞어요. AI 보간은 추정한 움직임을 바탕으로 완전히 새로운 중간 프레임을 합성하므로, 대개 복제보다 훨씬 자연스러워 보여요.',
        },
        {
          question: '30fps를 60fps로 변환할 수 있나요?',
          answer: '네. 30fps에서 60fps는 가장 흔한 목표 중 하나이고 처음 시험해 보기에도 좋아요.',
        },
        {
          question: '60fps를 120fps로 변환할 수 있나요?',
          answer: '네. 120fps는 60fps보다 GPU 작업량이 두 배이고 파일도 커지므로, 먼저 짧은 클립으로 시험해 보세요.',
        },
        {
          question: '프레임 보간에서 아티팩트가 생기는 이유는 무엇인가요?',
          answer: '움직임 추정은 실제 프레임 두 개 사이에서 무슨 일이 일어나는지 추측해야 해요. 빠른 움직임, 손, 머리카락, 바퀴, 가려짐, 장면 전환은 본질적으로 더 어려워서, 그런 영역에서는 합성된 프레임이 뒤틀리거나, 잔상이 남거나, 번질 수 있어요.',
        },
        {
          question: '어떤 출력 형식으로 만들어지나요?',
          answer: 'H.264 동영상과 AAC 오디오가 들어간 MP4예요. v1에서는 MP4만 출력해요. 이 컨테이너는 어디서나 재생되고 이 도구가 만드는 높은 프레임 레이트를 지원하기 때문이에요.',
        },
        {
          question: '60fps가 항상 30fps보다 나은가요?',
          answer: 'UI 화면 녹화, 스포츠, 게임 플레이, 움직임이 많은 클립은 보통 60fps가 더 매끄럽게 느껴져요. 영화 같은 콘텐츠는 24/30fps가 의도된 느낌인 경우가 많아요. 결과물이 주었으면 하는 느낌에 맞는 FPS를 고르세요.',
        },
        {
          question: 'AI 프레임 보간이 FFmpeg minterpolate보다 나은가요?',
          answer: 'AI 보간(RIFE)은 대체로 FFmpeg에 내장된 minterpolate 필터보다 깔끔한 움직임을 만들어요. 특히 형태가 변하는 움직임에서 그래요. minterpolate는 더 빠르고 간단하며, 빠른 대체 변환에는 여전히 유용해요.',
        },
        {
          question: '보간 후 장면 전환이 가끔 이상해 보이는 이유는 무엇인가요?',
          answer: '모델은 인접한 프레임이 같은 움직임 흐름에 속한다고 가정해요. 장면이 갑자기 바뀌면 그 가정이 깨지므로, 경계에서 합성된 프레임이 잠깐 뒤틀려 보일 수 있어요. 깔끔한 컷과 짧은 클립이 도움이 돼요.',
        },
      ],
      supportedFormats: {
        maxFileNotes: [
          '최대 원본 길이와 처리 높이는 서버의 AI_FRAME_INTERPOLATION_MAX_DURATION_SECONDS와 AI_FRAME_INTERPOLATION_MAX_HEIGHT로 제한돼요.',
        ],
        processingNotes: [
          'AI 보간은 GPU 부하가 커요. 세로로 큰 원본은 최대 처리 높이를 낮추면 더 빨리 끝나요.',
          'v1에서 출력은 MP4(H.264 + AAC)예요. 오디오는 기본적으로 원본에서 유지돼요.',
        ],
      },
      related: [
        {
          label: '동영상 변환기',
          to: '/tools/video-converter',
          description: 'MP4, WebM, MOV, AVI, MKV 등을 변환하세요.',
        },
        {
          label: '동영상 압축',
          to: '/tools/compress-video',
          description: '보간 후 동영상 파일 크기를 줄이세요.',
        },
        {
          label: '동영상을 움직이는 GIF로 변환',
          to: '/tools/convert-video-to-animated-gif',
          description: '짧은 클립을 공유하기 좋은 움직이는 GIF로 바꾸세요.',
        },
        {
          label: '동영상에서 프레임 추출',
          to: '/tools/extract-frames-from-video',
          description: '개별 프레임을 PNG로 뽑아내세요.',
        },
        {
          label: 'AI 프레임 보간 튜토리얼',
          to: '/tutorials/ai-frame-interpolation',
          description: 'AI 보간의 작동 방식과 사용할 때를 알아보세요.',
        },
      ],
      embed: {
        title: 'AI 프레임 보간',
        description: '짧은 동영상을 업로드하세요. AI 프레임 보간이 이미 선택되어 있어요. 목표 FPS(48, 60, 120)를 고르면 도구가 새 중간 프레임을 합성해 MP4로 돌려드려요.',
      },
    },
    // MM100: Aperture's page lines (name, tagline, SEO title and description); full bodies come with MM102-<prefix>. Model-written, needs native review.
    'aperture': {
      name: 'Aperture',
      h1: 'Aperture: 온라인 사진 편집기',
      tagline: '브라우저에서 쓰는 레이어 기반 사진 편집기. 노출, 커브, 색상, 마스크, 복구, 프리셋을 지원하고 전체 해상도로 내보내요.',
      metaTitle: 'Aperture 온라인 사진 편집기: 레이어, 커브, 마스크 | Media Manipulator',
      metaDescription: 'Aperture로 브라우저에서 사진을 편집하세요. 비파괴 조정 레이어, 커브, 레벨, HSL, 마스크, 스팟 복구, 프리셋, 전체 해상도 내보내기를 지원해요.',
      ogTitle: 'Aperture: 온라인 사진 편집기',
      ogDescription: '브라우저에서 비파괴 방식으로 사진을 편집하세요. 조정 레이어를 쌓고, 마스크를 씌우고, 스팟을 복구한 뒤 JPG, PNG, WebP, AVIF, TIFF로 전체 해상도로 내보내요.',
      intro: 'Aperture는 Media Manipulator에 들어 있는 사진 편집기예요. 사진 한 장을 광고 없이 전체 화면으로 열고, 손대지 않은 원본 위에 조정 레이어를 쌓아 가며 편집해요. 노출 레이어, 커브, 한 가지 색상 범위로 제한한 HSL 레이어, 비네팅, 샤프닝 단계처럼요. 레이어마다 불투명도, 혼합 모드, 선택 사항인 마스크가 따로 있어요. 미리보기는 1920 px 사본으로 그래픽 카드에서 그려지므로 모든 슬라이더가 즉시 반응하고, 내보내기는 저희 서버에서 같은 계산식으로 원본 파일을 전체 해상도로 렌더링해요. 여기서 무엇을 하든 처음 연 파일은 다시 쓰이지 않아요. 결과는 언제나 원본 이름에 (retouched)라는 접미사가 붙은 새 파일이에요.',
      whatItDoes: [
        '모든 편집을 별도의 조정 레이어로 보관해요. 사진마다 최대 64개까지 쌓을 수 있고, 나머지 스택은 건드리지 않은 채 어느 레이어든 나중에 숨기고, 순서를 바꾸고, 복제하고, 다시 조정하고, 삭제할 수 있어요.',
        '기본, 커브, 레벨, 색상(HSL), 색상 균형, 흑백, 채널 혼합, 포토 필터, 스플릿 토닝, LUT, 효과 패널에서 전체 톤과 색을 다루며, 슬라이더 범위는 데스크톱 편집기와 같아요.',
        '선형 그레이디언트, 방사형, 직접 칠하는 브러시, 휘도 범위, 스포이트로 고른 색상 범위, AI 피사체 마스크로 어느 레이어든 화면의 일부에만 적용되게 제한하고, 이 요소들을 추가, 빼기, 교차로 결합해요.',
        '복구 도구(스팟을 칠하고 복구를 누르면 저희 GPU의 인페인팅 모델이 채워요), 적목 현상 보정, 그리고 자르기, 수평 맞추기, 회전, 뒤집기, 네 모서리 원근 보정을 하는 기하학 패널로 픽셀을 고쳐요.',
        '룩을 저장하고 다시 적용해요. 기본 제공 프리셋 18개와 자동, 이 브라우저에 저장하거나 JSON으로 내보낸 내 프리셋을 쓸 수 있고, 어떤 요금제든 로그인하면 같은 스택을 다른 사진 여러 장에 한꺼번에 적용할 수 있어요.',
      ],
      flowSteps: [
        {
          title: '사진 열기',
          description: '이 페이지에 파일을 끌어다 놓으세요. 브라우저가 파일을 디코딩하면 편집기가 열리고, 패널 아래에 실시간 히스토그램이 나타나요.',
        },
        {
          title: '조정 쌓기',
          description: '아무 패널에서나 슬라이더를 움직이면 레이어 목록에 레이어가 생겨요. 마스크를 씌우거나, 불투명도를 낮추거나, 혼합 모드를 광도나 색상으로 바꿔 보세요.',
        },
        {
          title: '비교하며 다듬기',
          description: '백슬래시 키를 길게 누르면 원본이 보이고, 분할 보기로 나란히 비교할 수도 있어요. 실행 취소, 다시 실행, 작업 내역 패널로 원하는 만큼 되돌아갈 수 있어요.',
        },
        {
          title: '원본 크기로 내보내기',
          description: 'JPG, PNG, WebP, AVIF, TIFF 중에서 형식을 고르고, 품질을 1~100으로 정하고, 메타데이터 유지 여부와 최대 크기를 선택하세요. 서버가 원본을 렌더링하면 파일이 다운로드돼요.',
        },
      ],
      advancedDetails: [
        '작업 값은 0~1 범위의 sRGB 부동소수점이고, 모든 단계의 결과는 이 범위를 넘지 않도록 잘려요. 노출과 화이트 밸런스 레이어만 먼저 선형 빛으로 변환하고(sRGB 디코딩: 0.04045 미만이면 v / 12.92, 그 외에는 ((v + 0.055) / 1.055)의 2.4제곱), 계산이 끝나면 다시 인코딩해요.',
        '레이어는 스택 순서대로 아래에서 위로 적용돼요. 각 레이어가 조정된 색을 계산하면, 혼합 모드가 결과 전체(표준), 가중치 0.2126, 0.7152, 0.0722를 쓰는 BT.709 루마 변화만(광도), 또는 크로마 변화만(색상) 가져와요. 마지막으로 레이어 불투명도에 0~1의 마스크 값을 곱한 비율로 입력과 섞어요.',
        '미리보기는 사진의 1920 px 사본으로 내 GPU에서 WebGL2로 그려지고, 내보낸 파일은 같은 공식으로 저희 서버에서 원본을 전체 해상도로 렌더링해요. 두 결과는 문서화된 작은 허용 오차 안에서 일치해요. 색상 연산은 평균 차이가 8비트 기준 많아야 한 단계이고 네 단계를 넘지 않으며, 컨볼루션은 많아야 여덟 단계 차이가 나고, 그레인은 양쪽이 같은 해시 하나를 쓰므로 정확히 같아요.',
        '마스크는 0에서 시작해 구성 요소를 순서대로 합쳐 계산해요. 추가는 누적 값과 구성 요소 중 큰 값을, 빼기는 누적 값과 일에서 구성 요소를 뺀 값 중 작은 값을, 교차는 둘 중 작은 값을 취해요. 마스크 페더는 가우시안 흐림이며, 시그마는 페더 퍼센트에 0.05와 이미지의 긴 변 길이를 곱한 값이에요. 반전과 마스크 강도는 흐림 다음에 적용돼요.',
        '기하학은 하나의 역매핑이에요. 회전, 수평 맞추기 각도, 뒤집기, 네 모서리 원근 사각형, 자르기가 단일 변환으로 합성되고 출력 픽셀은 원본에서 쌍선형으로 샘플링되므로, 기하학 변경을 여러 개 겹쳐도 사진이 두 번 이상 리샘플링되지 않아요.',
        '4메가픽셀 이하 이미지는 TypeScript 기준 구현과 비트 단위까지 일치하도록 서버에서 float64로 렌더링하고, 더 큰 이미지는 float32를 써요. 배포할 때 실행되는 자체 테스트는 기준 렌더링 126개와 비교하며, 현재 측정된 최대 오차는 8비트 기준 한 단계예요.',
      ],
      whyItMatters: [
        '한 번에 적용하고 끝나는 필터 도구는 기회가 한 번뿐이에요. 레이어 스택이 있으면 일주일 뒤에 돌아와 비네팅만 불투명도 40%로 낮추고 나머지는 그대로 둘 수 있어요.',
        '본격적인 편집기는 모두 축소한 사본으로 미리보기를 그려 빠른 반응을 유지해요. 다만 내보낸 결과가 미리보기와 같다는 보장이 있어야 의미가 있어서, 서버 렌더링과 미리보기는 같은 공식과 측정된 허용 오차를 공유해요.',
        '마스크를 쓰면 전체 슬라이더가 국소 도구가 돼요. 같은 노출 슬라이더라도 어떤 마스크를 붙이느냐에 따라 얼굴 하나, 하늘, 또는 휘도 0.3 미만인 모든 부분을 밝게 해요.',
      ],
      useCases: [
        {
          title: '휴대폰 사진 살리기',
          description: '그림자를 올리고, 그레이디언트 마스크를 씌운 노출 레이어로 하얗게 날아간 하늘을 되살리고, 화이트 밸런스를 따뜻하게 맞춘 뒤, 아무것도 설치하지 않고 12 MP JPG로 내보내세요.',
        },
        {
          title: '판매 목록용 제품 사진',
          description: '수평을 맞추고, 1:1이나 4:5로 자르고, 스포이트로 깔끔한 화이트 밸런스를 잡고, 먼지를 복구하고, 반경 1 px로 선명하게 한 뒤, 같은 스택을 일괄 처리로 나머지 사진 9장에 적용하세요.',
        },
        {
          title: '여러 장에 일관된 룩 입히기',
          description: '룩을 한 번 만들어 프리셋으로 저장하고 다시 적용하세요. 프리셋은 레이어를 그룹으로 추가하므로, 그 아래에서 사진마다 노출을 따로 조정할 수 있어요.',
        },
        {
          title: '인물과 피부',
          description: '잡티를 복구하고, 브러시 마스크 아래에서 명료도 -20으로 부드럽게 하고, HSL에서 빨강 채도를 몇 포인트 낮춘 뒤, 선명하게 레이어에 방사형 마스크를 씌워 눈은 또렷하게 유지하세요.',
        },
      ],
      workedExamples: [
        {
          title: '레이어 네 개로 편집한 24 MP 풍경 사진',
          body: '6000 x 4000 JPEG(24 MP, 9.6 MB)에 노출 +0.5 EV 레이어, 밝은 영역 -60과 그림자 +30의 톤 레이어, 하늘에 선형 그레이디언트 마스크를 씌우고 파랑 채도를 +20으로 올린 HSL 레이어, 양 120, 반경 1.0, 한계값 4의 선명하게 레이어를 적용해요. 미리보기는 1920 x 1280 사본에서 작동하고, 내보내기는 서버에서 24메가픽셀 전체를 렌더링해요. 품질 92의 JPG로 내보내면 파일은 약 10.8 MB이고 일반 작업 한 번이 차감돼요. 무료 계정에서는 12 MP 한도 때문에 4243 x 2828, 약 5.4 MB로 줄어들어요.',
        },
        {
          title: '비회원으로 편집한 12 MP 휴대폰 사진',
          body: '로그인하지 않은 상태에서, 휴대폰으로 찍은 4032 x 3024 JPEG(12.2 MP, 3.1 MB)에 화이트 밸런스 색온도 -30과 얼굴에 브러시 마스크를 씌운 +0.8 EV 노출 레이어를 적용하고, 먼지 스팟 두 곳을 칠한 뒤 복구를 한 번 눌러 없애요(AI 작업 한 번). 품질 85의 WebP로 내보내면 12 MP 비회원 한도에 맞춰 약 4000 x 3000으로 줄어들고, 메가픽셀당 0.3 MB 기준으로 약 3.6 MB가 돼요. 프로젝트는 복구를 누르기 전까지 IndexedDB에 머물고, 복구를 누르면 사진이 비회원 작업으로 업로드돼요.',
        },
      ],
      whenNotToUse: 'Aperture는 파라메트릭 레이어로 사진을 한 번에 한 장씩 편집하므로, 픽셀 페인팅, 텍스트와 도형 오버레이, 두 사진 합성, 그림 그리기에는 맞지 않아요. 파일 크기만 줄이면 된다면 이미지 압축 도구가 편집기를 열지 않고 한 번에 처리해 줘요. 배경이 투명하게 오려 낸 이미지가 필요하면 배경 제거 도구가 PNG를 바로 돌려줘요. 사진을 올리기 전에 위치 정보를 지우고 싶다면, 메타데이터를 제거로 설정해 내보내는 것보다 EXIF 제거 도구가 더 빨라요. 25장이 넘는 사진의 일괄 편집도 이 편집기의 한도를 벗어나요.',
      whyMediaManipulator: [
        'Aperture는 Media Manipulator의 일부라서, 이미지 변환, 압축, 배경 제거, 그리고 이 편집기에 같은 계정, 기록, 요금제 한도가 적용돼요.',
        '편집기는 광고도, 워터마크도, 캔버스 안의 유료 전환 권유도 없이 전체 화면으로 열려요. 요금제 한도가 정하는 것은 내보내기 크기, 저장 프로젝트 수, 일괄 처리 크기뿐이에요.',
        '계산 방식은 비밀이 아니에요. 이 사이트의 각 도구 페이지는 슬라이더가 실행하는 정확한 공식을 실제 숫자 예시와 함께 설명하므로, 값 40이 실제로 무엇을 하는지 알 수 있어요.',
      ],
      privacyNote: '계정이 없으면 편집기 전체가 이 브라우저에서 실행돼요. 사진과 레이어 스택은 내 기기의 IndexedDB에 있고, 내보내기를 하거나 피사체 선택이나 복구를 누르기 전에는 아무것도 업로드되지 않아요. 이때는 각각 사진이 일반적인 비회원 작업으로 저희 서버에 전송돼요. 로그인하면 원본, 1920 px 미리보기, 썸네일이 보관 기간 설정에 따라 프로젝트와 함께 저장되고, 프로젝트나 계정을 삭제하면 함께 삭제돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 피사체 마스크와 복구는 저희가 운영하는 GPU에서 실행되며, 어떤 사진도 외부로 전송되지 않아요.',
      faq: [
        {
          question: 'Aperture는 파괴적 편집기인가요?',
          answer: '아니요. 원본 파일은 절대 수정되지 않아요. 모든 변경은 레이어의 매개변수이고, 스택은 사진 옆에 작은 JSON 문서로 저장되며, 내보내기를 하면 확장자 앞에 (retouched)가 붙은 이름으로 새 파일이 만들어져요.',
        },
        {
          question: '사진 한 장에 레이어와 마스크를 몇 개까지 쓸 수 있나요?',
          answer: '조정 레이어는 최대 64개까지 쓸 수 있어요. 각 레이어는 0~100%의 불투명도, 표준, 광도, 색상 중 하나의 혼합 모드, 그리고 그레이디언트, 방사형, 브러시, 휘도, 색상 범위, 피사체 구성 요소를 개수 제한 없이 조합한 선택 사항 마스크를 가질 수 있어요.',
        },
        {
          question: '내보낼 수 있는 가장 큰 사진은 얼마인가요?',
          answer: '비회원과 무료 계정은 12메가픽셀까지 내보낼 수 있고, 더 큰 원본은 이 크기에 맞게 축소돼요. Premium과 Pro는 120메가픽셀까지 내보낼 수 있으며, 내보내기 대화상자에서 최대 크기로 원본, 12, 24, 64, 120 MP를 고를 수 있어요.',
        },
        {
          question: '어떤 작업이 일일 사용량에서 차감되나요?',
          answer: '내보내기는 한 번마다 일반 작업 한 번, 사진마다 처음 하는 피사체 선택은 일반 작업 한 번(똑같은 요청을 반복하면 캐시를 사용하므로 무료예요), 복구는 누를 때마다 AI 작업 한 번이에요. 슬라이더, 실행 취소, 프리셋, 나머지 다섯 가지 마스크 종류는 비용이 들지 않아요. 정확한 일일 사용량은 요금 페이지에 나와 있어요.',
        },
        {
          question: '아이폰으로 찍은 HEIC 사진도 열 수 있나요?',
          answer: '네, 로그인한 상태라면 열 수 있어요. 브라우저는 HEIC, HEIF, TIFF, BMP를 자체적으로 디코딩하지 못하므로 서버가 편집기용 미리보기 사본을 만들어요. JPG, PNG, WebP, GIF, AVIF는 계정 없이 바로 열려요.',
        },
        {
          question: '내보낸 사진이 미리보기와 똑같아 보이나요?',
          answer: '문서화된 허용 오차 안에서는 같아요. 색상 조정은 최악의 경우에도 8비트 기준 몇 단계 이내로 일치하고 대개는 완전히 같으며, 그레인은 비트 단위까지 같아요. 미리보기는 1920 px 사본으로 계산되므로 아주 미세한 샤프닝이나 노이즈 감소는 원본 크기에서 조금 다르게 보일 수 있어요. 그래서 내보낸 결과를 최종 기준으로 삼아요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'HEIC, HEIF, TIFF, BMP는 계정이 필요해요. 브라우저가 디코딩하지 못하므로 서버가 미리보기 사본으로 디코딩해 줘요. 나머지 형식은 기기에서 바로 열려요.',
          '대화상자에 표시되는 메가픽셀당 대략적인 내보내기 크기는 품질 92의 JPG가 약 0.45 MB, WebP가 약 0.3 MB, AVIF가 약 0.2 MB, PNG가 사진 기준 약 2.5 MB, TIFF가 약 3.0 MB예요.',
        ],
      },
      related: [
        {
          label: '이미지 밝게 하기',
          to: '/tools/brighten-image',
          description: '선형 빛에서 작동하는 노출과 밝기, 그림자 슬라이더의 차이를 각각의 숫자와 함께 설명해요.',
        },
        {
          label: '커브',
          to: '/tools/photo-curves',
          description: '채널당 최대 16개의 점을 단조 삼차 곡선으로 잇고, 256개 항목의 테이블로 샘플링해요.',
        },
        {
          label: '잡티 제거',
          to: '/tools/remove-blemishes',
          description: '스팟을 칠하고 복구를 누르면 저희 GPU의 인페인팅 모델이 채워요.',
        },
        {
          label: '색상으로 선택',
          to: '/tools/select-by-color',
          description: '스포이트로 색을 고르고, 그 색과의 Lab 거리 안에 있는 픽셀에만 레이어가 적용되게 제한하세요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '편집 없이 파일만 작게 만들면 될 때는 압축 도구가 더 빨라요.',
        },
        {
          label: 'Aperture 튜토리얼',
          to: '/tutorials/aperture',
          description: '사진을 여는 것부터 완성된 내보내기까지, 첫 편집을 단계별로 안내해요.',
        },
      ],
      embed: {
        title: '편집기 열기',
        description: 'JPG, PNG, WebP, GIF, HEIC, AVIF, TIFF, BMP 사진을 여기에 끌어다 놓거나 기기에서 선택하세요. 편집기가 전체 화면으로 열리고 기본 패널이 맨 앞에 표시돼요.',
      },
    },
    'brighten-image': {
      name: '이미지 밝게 하기',
      h1: '온라인에서 이미지 밝게 하기',
      tagline: '선형 빛에서 작동하는 진짜 노출 조절로 어두운 사진을 끌어올리거나, 더 부드럽고 선택적으로 바꾸고 싶다면 밝기와 그림자를 쓰세요.',
      metaTitle: '이미지를 온라인으로 밝게: 노출, 밝기, 그림자 | Aperture',
      metaDescription: '어두운 사진을 브라우저에서 밝게 하세요. EV 스톱 단위 노출, 밝기 슬라이더, 그림자 복원을 실시간으로 미리 보고 전체 해상도로 내보내요.',
      ogTitle: '온라인에서 이미지 밝게 하기',
      ogDescription: '어두운 사진을 밝히는 세 가지 방법: 선형 빛에서 EV 스톱 단위로 조절하는 노출, 밝기, 그림자 복원. 실시간 미리보기와 전체 해상도 내보내기를 지원해요.',
      intro: '어두운 사진을 밝게 하는 방법은 세 가지이고, 결과도 서로 달라요. Aperture 기본 패널의 노출(EV) 슬라이더는 카메라의 스톱처럼 선형 빛에서 작동해요. +1 EV는 모든 픽셀의 빛을 두 배로 늘리므로 그림자와 중간 톤은 비례해서 밝아지지만, 이미 밝은 부분은 더 빨리 흰색으로 클리핑돼요. 반면 밝기 슬라이더는 sRGB 값에 일정한 양을 더하기 때문에 검은 부분이 가장 많이 올라가고 결과가 더 밋밋해 보여요. 톤 그룹의 그림자 슬라이더는 휘도에 따라 가중치를 두어 어두운 쪽만 올리고 밝은 영역은 그대로 둬요. 이 페이지에서는 각 방식의 계산을 숫자와 함께 설명하니, 지금 보고 있는 사진에 맞는 방법을 골라 보세요.',
      whatItDoes: [
        '노출(EV) -5~+5: 각 채널을 sRGB에서 선형 빛으로 디코딩하고, 2의 EV 제곱을 곱하고, 오프셋을 더하고, 다시 인코딩한 뒤 감마를 적용해요. 카메라와 똑같이 한 스톱은 빛이 두 배가 되는 거예요.',
        '빛 그룹의 밝기 -100~+100: 대비 단계 전에 값을 200으로 나눈 만큼 sRGB 채널에 더해요. 따라서 +50은 여유가 있는 모든 픽셀에 0.25, 즉 8비트 기준 약 64단계를 더해요.',
        '톤 그룹의 그림자 -100~+100: 휘도 가중치를 둔 끌어올림으로, 검정에서 가장 강하고 루마 0.6에서 완전히 사라지며, 세 채널을 함께 배율 조정하므로 색조가 유지돼요.',
        '각 컨트롤이 별도의 조정 레이어라서, +1 EV 레이어와 그림자 +40 레이어에 각각 따로 마스크를 씌우고, 혼합하고, 끌 수 있어요.',
        '패널 아래의 히스토그램은 드래그하는 동안 바로 갱신되므로, 오른쪽 끝이 흰색에 쌓이기 시작하는 순간을 보고 클리핑되기 전에 물러설 수 있어요.',
      ],
      flowSteps: [
        {
          title: '어두운 사진 열기',
          description: 'JPG, PNG, WebP, AVIF 파일을 끌어다 놓으세요. HEIC와 TIFF는 로그인하면 열 수 있어요. 기본 패널이 맨 앞에 열려요.',
        },
        {
          title: '노출 설정',
          description: '히스토그램을 보면서 노출(EV)을 +1 쪽으로 드래그하세요. 가장 어두운 구석이 아직 탁해도 중간 톤이 원하는 위치에 오면 멈추세요.',
        },
        {
          title: '그림자 열기',
          description: '남은 어두운 부분에는 톤 그룹의 그림자를 쓰세요. 루마 0.6 미만인 픽셀만 건드리므로 하늘과 피부의 밝은 부분은 그대로 있어요.',
        },
        {
          title: '확인하고 내보내기',
          description: '백슬래시 키를 누르고 있으면 원본과 비교할 수 있어요. 그다음 내보내세요. 서버가 같은 두 공식으로 원본을 전체 크기로 다시 렌더링해요.',
        },
      ],
      advancedDetails: [
        '채널별 노출: v를 sRGB에서 디코딩해 선형 값을 구하고, 선형 값에 2의 EV 제곱을 곱하고 오프셋을 더한 결과를 clamp로 0~1 범위에 맞춘 뒤, sRGB로 다시 인코딩하고 1 / 감마 제곱을 해요. 디코딩은 0.04045 미만에서 v / 12.92, 그 이상에서 ((v + 0.055) / 1.055)의 2.4제곱을 써요.',
        '곱셈이 선형 빛에서 일어나므로 0.5(255 중 128)인 중간 회색은 +1 EV에서 0.686(175), +1.5 EV에서 0.801(204), +2 EV에서 0.934(238)가 되지만, 0.8(204)은 +1 EV에서 이미 1.0으로 클리핑돼요.',
        '밝기와 대비는 한 레이어를 공유해요. 먼저 v = clamp(v + brightness / 200)을 계산하고, 그다음 (v - 0.5) × 2의 (contrast / 50) 제곱 + 0.5를 계산해요. 대비가 0이면 두 번째 단계는 항등 변환이므로, 밝기 +25는 여유가 있는 모든 채널에 정확히 0.125를 더해요.',
        '그림자: L을 BT.709 루마라고 하면 가중치는 1 - smoothstep(0, 0.6, L)이고, 루마 변화량은 0.25 × shadows / 100 × 가중치예요. 새 루마를 이전 루마(최솟값 0.0001)로 나눈 값으로 세 채널을 모두 배율 조정하므로, 루마가 0.1인 픽셀은 가중치 0.926을 받고 그림자 +50에서 0.216으로 올라가요.',
        '미리보기는 1920 px 사본으로 내 GPU(WebGL2)에서 그려지고, 내보낸 파일은 같은 공식으로 저희 서버에서 원본을 전체 해상도로 렌더링해요. 두 결과는 문서화된 작은 허용 오차, 많아야 8비트 기준 몇 단계 안에서 일치해요(그레인은 정확히 같아요). 노출만 바꾼 경우에는 대개 단계까지 정확히 일치해요.',
        '오프셋(-0.5~+0.5)은 곱셈 다음에 선형 빛에서 더해져요. 그래서 0.05 같은 작은 값도 순수한 검정 0을 0.248(63)로 바꿔요. 밝게 하는 것이 아니라 바닥을 올리는 것이며, 주로 매트한 느낌을 낼 때 유용해요.',
      ],
      whyItMatters: [
        '많은 간편 도구처럼 sRGB 공간에서 밝게 하면 밝은 영역이 압축되고 어두운 사진이 회색빛으로 보여요. 선형 빛에서 노출을 조절하면 카메라가 기록한 톤 사이의 관계가 그대로 유지돼요.',
        '노출이 부족한 휴대폰 사진에는 대개 그림자에 쓸 만한 데이터가 남아 있어요. 노출을 한 스톱 올린 다음 그림자를 열면, 밋밋하게 밝기만 올렸을 때 뭉개져 버릴 디테일을 되살릴 수 있어요.',
        '차이를 알면 시간이 절약돼요. 중간 톤은 괜찮고 구석만 어둡다면 그림자 슬라이더 하나만 건드리면 되고, 전체가 어둡다면 노출을 쓰면 돼요.',
      ],
      useCases: [
        {
          title: '어둡게 나온 실내 사진',
          description: '노출 +1.2 EV에 그림자 +40을 더하면 어두운 거실 사진이 살아나요. 램프의 밝은 부분은 클리핑되므로, 램프 주변에 방사형 마스크를 추가하고 그 안쪽은 노출 레이어에서 빼세요.',
        },
        {
          title: '역광 인물 사진',
          description: '창문이 하얗게 날아가지 않고 흰색으로 남도록 노출은 0으로 두고, 얼굴에는 그림자 +60 톤 레이어를 추가하거나 노출 +1 레이어에 브러시 마스크로 얼굴만 칠하세요.',
        },
        {
          title: '회색으로 보이는 스캔 인화물',
          description: '전체적으로 어둡지만 진짜 검정이 없는 스캔은 노출보다 밝기 -10에 대비 +20이 더 잘 맞아요. 문제가 빛의 부족이 아니라 들뜬 바닥이기 때문이에요.',
        },
        {
          title: '스크린샷이나 단색 그래픽',
          description: '단색 면으로 된 그림에는 밝기 +15가 모든 색에 똑같이 0.075를 더해 면을 균일하게 유지해 줘요. 노출을 바꾸면 면마다 고르지 않게 변해요.',
        },
      ],
      workedExamples: [
        {
          title: '어두운 12 MP 식당 사진에 +1 EV와 그림자 적용',
          body: '4000 x 3000 JPEG(12 MP, 4.2 MB)에서 가장 어두운 구석, 재킷, 식탁보, 촛불의 샘플 값이 각각 20, 60, 128, 200이에요. 노출 +1 EV만 적용하면 이 값들은 31, 85, 176, 255가 되어 촛불이 클리핑돼요. 그 위에 그림자 +30 톤 레이어를 얹으면 어두운 세 값이 48, 93, 176으로 올라가고 촛불은 255에 머물러요. 대신 노출을 +0.7 EV로 낮추면 28, 77, 160, 248이 되어 촛불이 살아 있어요. 품질 92의 JPG로 내보내면 약 5.4 MB, 일반 작업 한 번이고, 12 MP라서 비회원 한도에 정확히 맞아요.',
        },
        {
          title: '같은 6 MP 스캔에서 밝기와 노출 비교',
          body: '3000 x 2000 TIFF 스캔(6 MP, 36 MB, 로그인해서 열기)의 톤이 20, 60, 128, 200이에요. 밝기 +30은 이 값을 58, 98, 166, 238로 옮기는데, 어디서나 거의 같은 38단계를 더하므로 검은 테두리가 회색이 돼요. 반면 노출 +1.2 EV는 34, 91, 187, 255로 옮겨 테두리는 검정에 가깝게 유지하지만 가장 밝은 톤은 클리핑돼요. 그 중간 방법으로 노출 +1 EV에 톤의 검정 계열 +20을 더하면 20, 60, 128, 200이 35, 85, 176, 255가 돼요. PNG로 내보내면 6 MP 결과물은 약 15 MB, 품질 90의 WebP로는 약 1.8 MB예요.',
        },
      ],
      whenNotToUse: '사진이 충분히 밝은데 칙칙해 보일 뿐이라면 밝게 할 필요가 전혀 없어요. 대비 페이지나 커브가 알맞은 해결책이고, 노출을 더하면 밝은 영역이 흰색으로 밀려날 뿐이에요. 그림자가 질감 없이 새까만 사진은 어떤 슬라이더로도 살릴 수 없어요. 8비트 JPEG는 영보다 낮은 값을 저장하지 않기 때문이에요. 그리고 구석만 어두운 사진이라면, 전체 노출을 바꾸는 것보다 비네팅 슬라이더의 양을 양수로 두는 편이 가장자리 위주로 더 깔끔하게 밝혀 줘요.',
      whyMediaManipulator: [
        'Aperture는 밝기 슬라이더 하나가 아니라 세 가지 밝게 하기 컨트롤을 모두 별도 레이어로 제공하고, 각 레이어는 마스크로 적용 범위를 제한할 수 있어요.',
        '미리보기, 내보내기, 모바일 앱의 공식이 모두 같고, 서버는 배포할 때마다 기준 렌더링과 비교해 검증돼요.',
        '히스토그램과 길게 눌러 비교하는 키가 항상 화면에 있으므로, 기억에 의존하지 않고 원본과 비교하며 얼마나 밝혔는지 판단할 수 있어요.',
      ],
      privacyNote: '밝게 하기는 픽셀 단위의 산술 변경이라 내보내기 전까지는 모두 브라우저에서 실행돼요. 로그인하거나 피사체 선택 또는 복구를 쓰지 않는 한, 어두운 사진과 그 노출, 빛, 톤 레이어는 내 기기의 IndexedDB에 머물러요. 내보낼 때 원본이 한 번 업로드되어 같은 공식으로 저희 서버에서 렌더링되고, 결과는 다른 작업과 똑같이 보관돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 이미지는 외부로 전달되지 않아요.',
      faq: [
        {
          question: '+1 EV는 픽셀을 어떻게 바꾸나요?',
          answer: '선형 빛에서 픽셀 값을 두 배로 만들어요. sRGB 척도에서는 두 배가 아니에요. 0.5는 0.686, 0.2는 0.285가 되고, 0.8은 1.0으로 클리핑돼요. 곱한 뒤 값을 0~1로 제한하므로, 흰색을 넘는 부분은 노출을 낮추거나 그 영역에 마스크를 씌우지 않는 한 사라져요.',
        },
        {
          question: '밝기가 노출보다 밋밋해 보이는 이유는 뭔가요?',
          answer: '밝기는 sRGB에서 모든 채널에 같은 양을 더해요. +25는 0인 검정에도, 0.5인 회색에도 똑같이 0.125를 더하므로 바닥이 올라가고 사진의 대비가 줄어들어요. 노출은 선형 빛에서 곱하므로 어두운 톤이 밝은 톤에 비해 계속 어둡게 유지돼요.',
        },
        {
          question: '어디까지 밝게 하면 사진이 무너지나요?',
          answer: '약 +1.5 EV까지는 8비트 JPEG가 대개 버티지만 그림자 노이즈가 보이기 시작해요. +2 EV를 넘으면 파일에 처음부터 256단계밖에 없었기 때문에 부드러운 그라데이션에 밴딩이 생겨요. 디테일 패널의 노이즈 감소와 그레인 레이어로 이를 어느 정도 가릴 수 있어요.',
        },
        {
          question: '사진 일부만 밝게 할 수 있나요?',
          answer: '네. 노출 레이어를 추가한 뒤 마스크를 씌우세요. 어두운 전경에는 선형 그레이디언트, 얼굴에는 브러시, 정한 밝기보다 어두운 모든 부분에는 휘도 범위, 주요 대상에는 피사체 선택을 쓰면 돼요. 조정은 마스크가 흰색인 곳에만 적용돼요.',
        },
        {
          question: '밝게 하면 색이 바뀌나요?',
          answer: '노출과 그림자는 빨강, 초록, 파랑을 함께 배율 조정하므로 채널이 클리핑되기 전까지 색조가 유지돼요. 밝기도 세 채널에 같은 값을 더하지만, 강한 색이 흰색에 가까워질수록 채도가 살짝 떨어져요. 색이 틀어져 보이면 양을 줄이거나 레이어 혼합을 광도로 바꾸세요.',
        },
        {
          question: '내보낸 사진도 미리보기와 정확히 같은 만큼 밝아지나요?',
          answer: '네, 8비트 기준 한두 단계 이내로 같아요. 서버는 전체 해상도 원본에 똑같은 노출 디코딩, 곱셈, 인코딩을 실행하며, 4메가픽셀 이하 사진은 float64로 계산해요. 배포할 때 자체 테스트가 저장된 기준 렌더링과 비교해 이를 검증해요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '노출과 톤은 주변 픽셀을 참조하지 않는 픽셀 단위 연산이라, 크기와 관계없이 미리보기가 즉시 나타나고 내보내기 시간은 대부분 파일 디코딩과 인코딩에 쓰여요.',
          '8비트 원본을 밝게 해도 카메라에서 검정으로 클리핑된 디테일이 생겨나지는 않아요. 0, 0, 0으로 기록된 영역은 중립색으로 남고, 오프셋이나 밝기로만 올라가요.',
        ],
      },
      related: [
        {
          label: '노출 보정',
          to: '/tools/fix-photo-exposure',
          description: '같은 노출과 톤 컨트롤을 노출 과다 사진과 노출 부족 사진 모두에 적용하고, 밝은 영역 복원까지 다뤄요.',
        },
        {
          label: '대비 조정',
          to: '/tools/adjust-image-contrast',
          description: '밝게 한 뒤 결과가 밋밋해 보일 때 쓸 수 있는 대비 슬라이더, 톤, 커브를 다뤄요.',
        },
        {
          label: '레벨',
          to: '/tools/photo-levels',
          description: '히스토그램이 양 끝에 닿지 않을 때 입력 검정과 입력 흰색 지점을 정하세요.',
        },
        {
          label: '커브',
          to: '/tools/photo-curves',
          description: '커브에 점 하나만 찍어 그림자를 올리고, 올라가는 모양을 완전히 직접 제어하세요.',
        },
        {
          label: '이미지 노이즈 줄이기',
          to: '/tools/reduce-image-noise',
          description: '노출을 크게 올리면 드러나는 그림자 노이즈를 정리하세요.',
        },
      ],
      embed: {
        title: '사진 밝게 하기',
        description: '어두운 사진을 여기에 끌어다 놓으세요. 기본 패널이 맨 앞에 열리고 노출(EV) 슬라이더를 바로 쓸 수 있어요.',
      },
    },
    'adjust-image-contrast': {
      name: '대비 조정',
      h1: '온라인에서 이미지 대비 조정하기',
      tagline: '중간 회색을 기준으로 움직이는 대비 슬라이더에 더해, 양 끝을 뭉개지 않고 대비를 주고 싶을 때 쓰는 톤과 커브도 있어요.',
      metaTitle: '이미지 대비를 온라인으로 조정: 슬라이더, 톤, 커브 | Aperture',
      metaDescription: '이미지 대비를 브라우저에서 높이거나 낮추세요. 대비 슬라이더는 중간 회색을 기준으로 움직이고, 톤과 커브로 모양을 세밀하게 조절해요. 원본 크기로 내보내요.',
      ogTitle: '온라인에서 이미지 대비 조정하기',
      ogDescription: '슬라이더 하나로 중간 회색을 기준으로 대비를 조절하거나, 톤과 커브로 모양을 잡으세요. 실시간 미리보기와 전체 해상도 내보내기를 지원해요.',
      intro: '대비는 사진의 어두운 톤과 밝은 톤 사이의 거리예요. Aperture 기본 패널의 빛 그룹에 있는 대비 슬라이더는 모든 채널을 중간 회색에서 2의 (contrast / 50) 제곱배만큼 멀어지게 늘려요. +50이면 0.5로부터의 거리가 두 배가 되고, -50이면 절반이 되며, 0.5 자체는 절대 움직이지 않아요. 투박한 도구이지만, 밋밋한 스캔이나 뿌연 휴대폰 사진에는 바로 그 점이 필요하고, 밝은 영역이 이미 흰색에 가까울 때는 바로 그 점이 문제가 돼요. 그런 경우를 위해 이 페이지에서는 휘도 가중치로 밝은 영역과 그림자를 서로 벌려 대비를 주는 톤 그룹, 그리고 최대 16개의 점으로 원하는 기울기의 S자 곡선을 그릴 수 있는 커브 패널도 함께 소개해요. 세 가지 모두 별도의 레이어이며 마스크를 씌울 수 있어요.',
      whatItDoes: [
        '빛 그룹의 대비 -100~+100: 각 채널이 0.5에서 떨어진 거리에 2의 (contrast / 50) 제곱을 곱해요. 따라서 +50은 2배, +100은 4배, -50은 0.5배예요.',
        '먼저 더해지는 밝기와 레이어를 공유해요. 밝기를 몇 포인트만 움직여도 사실상 기준점이 옮겨지므로, 대비를 올릴 때 중간 톤이 어두워지지 않게 하는 방법이 돼요.',
        '대안으로 쓰는 톤 대비: 밝은 영역을 양수로, 그림자를 음수로 설정하면 부드러운 휘도 가중치로 양 끝을 벌려요. 세 채널을 함께 배율 조정하므로 모든 픽셀의 색조가 유지돼요.',
        '정밀한 대안인 커브: (0.25, 0.2)와 (0.75, 0.8)을 지나는 S자 곡선은 가벼운 대비 상승이면서도 범위의 양 끝까지 그대로 닿아요. 커브가 0과 1을 고정하기 때문이에요.',
        '대비를 낮추면(음수 값) 제대로 된 페이드가 돼요. -50은 검정을 0.25로, 흰색을 0.75로 옮겨 매트 인화지 같은 느낌을 주고, 아무것도 클리핑되지 않아요.',
      ],
      flowSteps: [
        {
          title: '사진 열기',
          description: '이미지를 끌어다 놓고 히스토그램을 보세요. 밋밋한 사진은 가운데가 불룩하고 양 끝이 비어 있어요.',
        },
        {
          title: '먼저 슬라이더로 시도',
          description: '대비를 +30 쪽으로 올려 보세요. 사진이 괜찮아 보이기 전에 히스토그램이 한쪽 끝을 넘쳐 버리면 멈추고 다음 단계로 넘어가세요.',
        },
        {
          title: '톤이나 커브로 모양 잡기',
          description: '대비를 다시 0으로 돌리고 밝은 영역 +30과 그림자 -30을 쓰거나, RGB 커브에 S자를 그리세요. 두 방법 모두 양 극단은 제자리에 둬요.',
        },
        {
          title: '내보내기',
          description: '원본과 비교한 뒤 전체 해상도로 내보내세요. 서버가 원본 픽셀에 같은 곱셈, 같은 가중치, 또는 같은 커브 테이블을 적용해요.',
        },
      ],
      advancedDetails: [
        '빛 레이어는 채널마다 sRGB 공간에서 휘도 가중치 없이 v = clamp(v + brightness / 200)을 계산한 다음, v = clamp((v - 0.5) × 2의 (contrast / 50) 제곱 + 0.5)를 계산해요.',
        '자주 쓰는 값의 배율: +20은 1.32, +25는 1.41, +30은 1.52, +40은 1.74, +50은 2.0, +100은 4.0이고, -25는 0.71, -30은 0.66, -50은 0.5예요. +50 이상에서는 중간 회색에서 0.5 / 배율보다 멀리 떨어진 픽셀이 클리핑돼요. 그래서 +50에서는 0.25 미만이 모두 검정이 되고 0.75 초과가 모두 흰색이 돼요.',
        '톤 대비: L을 BT.709 루마라고 하면 밝은 영역은 루마에 0.25 × highlights / 100 × smoothstep(0.4, 1, L)을, 그림자는 0.25 × shadows / 100 × (1 - smoothstep(0, 0.6, L))을 더해요. 새 루마를 이전 루마로 나눈 값으로 R, G, B를 배율 조정하므로, 슬라이더 하나를 최대로 썼을 때 움직이는 양은 최대 범위의 사분의 일이에요.',
        '커브는 찍은 점들을 지나는 단조 삼차 곡선으로 256개 항목의 테이블을 만들므로, S자 곡선이 톤의 순서를 뒤집는 일은 없어요. 테이블은 먼저 채널별(빨강, 초록, 파랑 커브)로, 그다음 RGB 마스터 커브로 샘플링돼요.',
        '미리보기는 1920 px 사본으로 내 GPU(WebGL2)에서 그려지고, 내보낸 파일은 같은 공식으로 저희 서버에서 원본을 전체 해상도로 렌더링해요. 두 결과는 문서화된 작은 허용 오차(많아야 8비트 기준 몇 단계, 그레인은 정확히 같음) 안에서 일치해요. 대비, 톤, 커브는 픽셀 단위 연산이라 단계까지 정확히 일치하는 연산에 속해요.',
        '빛 레이어의 혼합을 광도로 바꾸면 루마 변화만 적용되고 크로마는 그대로 남아요. 그래서 한 채널이 다른 채널보다 먼저 클리핑될 때 색이 강한 픽셀의 색조가 틀어지는 것을 막아 줘요.',
      ],
      whyItMatters: [
        '단순 곱셈으로 대비를 올리면 뿌연 사진을 가장 빨리 선명하게 만들 수 있지만, 하늘이나 흰 셔츠를 가장 빨리 잃는 방법이기도 해요. 클리핑이 시작되는 지점을 알면 그 전에 멈출 수 있어요.',
        '대비를 낮추는 것은 되돌려야 할 실수가 아니라 엄연한 스타일이에요. 검정을 0.25로, 흰색을 0.75로 옮기는 공식으로 하면 매번 같은 매트한 느낌을 낼 수 있어요.',
        'sRGB 공간에서 채널별로 대비를 바꾸면 채도도 달라져요. 대비를 더하면 채도가 높은 색은 더 진해지고, 대비를 빼면 더 칙칙해져요. 휘도 가중치를 쓰는 톤 레이어는 이런 문제가 없어요.',
      ],
      useCases: [
        {
          title: '뿌연 풍경 사진',
          description: '대비 +30에 밝기 -5를 주면 깊이감이 돌아와요. 하늘이 클리핑되면 대신 디테일 패널의 안개 제거 +40을 쓰세요. 안개 제거는 모든 톤을 늘리는 대신 15 x 15 이웃 영역마다 가장 어두운 채널을 기준으로 작동해요.',
        },
        {
          title: '밋밋하게 스캔한 문서나 인화물',
          description: '대비 +40을 준 다음 레벨에서 입력 검정을 0.08, 입력 흰색을 0.92로 설정하면 종이는 흰색으로, 잉크는 검정으로 또렷해져요.',
        },
        {
          title: '한낮의 강한 빛 아래 인물 사진',
          description: '얼굴 위에 브러시 마스크를 씌운 레이어에서 대비를 -20으로 주면 피부에 닿는 빛이 부드러워지고 배경은 힘 있는 느낌을 유지해요.',
        },
        {
          title: '매트한 필름 룩',
          description: '대비 -35는 검정을 0.19로 올리고 흰색을 0.81로 내려요. 그다음 스플릿 토닝으로 밝은 영역에는 따뜻한 색을, 그림자에는 차가운 색을 더해 룩을 완성하세요.',
        },
      ],
      workedExamples: [
        {
          title: '밋밋한 20 MP 흐린 날 사진에 대비 +25',
          body: '5472 x 3648 JPEG(20 MP, 7.1 MB)의 톤 40, 90, 128, 166, 215가 범위 한참 안쪽에 머물러 있어요. 대비 +25는 1.414배라서 이 값들을 4, 74, 128, 182, 251로 옮겨요. 이제 양 끝이 검정과 흰색에 거의 닿고, 중간 톤은 변하지 않아요. +40(1.74배)에서는 같은 톤이 0, 62, 128, 195, 255가 되어 가장 어두운 부분과 가장 밝은 부분이 클리핑돼요. 품질 92의 JPG로 내보내면 유료 요금제에서 전체 20 MP 파일이 약 9 MB이고, 비회원 한도인 12 MP에서는 약 4243 x 2828, 약 5.4 MB로 줄어요.',
        },
        {
          title: '8 MP 인물 사진에 대비 -35로 매트 페이드',
          body: '3264 x 2448 JPEG(8 MP, 2.9 MB)예요. 대비 -35는 0.616배예요. 순수한 검정 0은 49, 40인 그림자는 74가 되고, 중간 회색은 128 그대로이며, 215인 밝은 부분은 181, 순수한 흰색은 206이 돼요. 이제 사진 전체가 49와 206 사이에 있어요. 검정 계열 -30을 준 두 번째 톤 레이어가 가장 깊은 톤을 다시 0 쪽으로 당기므로(10은 0, 30은 24가 되고 60과 128은 그대로), 페이드를 줘도 탄탄한 바닥이 남아요. 품질 85의 WebP로 내보내면 8 MP 결과물은 약 2.4 MB이고 일반 작업 한 번이 차감돼요.',
        },
      ],
      whenNotToUse: '톤 범위가 좁아서가 아니라 안개나 눈부심 때문에 사진이 밋밋해 보인다면 디테일 패널의 안개 제거가 더 잘 맞아요. 모든 톤을 늘리는 대신 국소적인 어두운 채널을 바탕으로 추정한 베일을 빼 주기 때문이에요. 사진이 그냥 어두워서 밋밋해 보인다면 먼저 노출을 올리세요. 어두운 상태에서 대비를 주면 그림자가 더 뭉개질 뿐이에요. 또 히스토그램 한쪽이 이미 클리핑되었다면 어떤 대비 슬라이더로도 되살릴 수 없으니, 대비를 건드리기 전에 밝은 영역이나 흰색 계열을 낮추세요.',
      whyMediaManipulator: [
        '대비를 더하는 세 가지 방법이 한 편집기에 있어서, 슬라이더로 시작했다가 다시 업로드하지 않고 톤이나 커브로 넘어갈 수 있어요.',
        'Aperture에서는 모든 대비 변경이 불투명도를 가진 레이어라서, 조금 과한 +50을 새 값을 짐작하는 대신 드래그 한 번으로 불투명도 70%의 +50으로 바꿀 수 있어요.',
        'Media Manipulator는 슬라이더 값마다 실제 배율을 문서로 밝혀 두므로, 같은 대비 설정은 어느 사진에서나 같은 의미예요.',
      ],
      privacyNote: '대비 변경은 각 픽셀이 중간 회색에서 떨어진 거리를 곱하는 계산이고, 내보내기 전까지 이 곱셈은 내 그래픽 카드에서 이루어져요. 비회원이면 사진은 이 브라우저에 머물고, 그전에는 어디로도 전송되지 않아요. 전체 해상도 렌더링은 저희가 운영하는 하드웨어에서 실행되는 서버 작업이에요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 외부 서비스로는 아무것도 전송되지 않아요.',
      faq: [
        {
          question: '대비를 움직여도 중간 회색이 변하지 않는 이유는 뭔가요?',
          answer: '공식이 0.5를 기준으로 회전하기 때문이에요. 기준값을 뺀 다음 곱하고 다시 더하므로 (0.5 - 0.5)에 어떤 배율을 곱해도 0이에요. 더 밝은 부분은 모두 흰색 쪽으로, 더 어두운 부분은 모두 검정 쪽으로 같은 비율만큼 움직여요.',
        },
        {
          question: '대비 슬라이더는 어떤 값부터 클리핑되나요?',
          answer: '사진이 이미 양 끝에 닿아 있다면 양수 값은 무엇이든 어딘가를 클리핑해요. +25(1.41배)에서는 0.146 미만이나 0.854 초과인 톤이 클리핑되고, +50(2배)에서는 기준이 0.25와 0.75이며, +100(4배)에서는 0.375~0.625만 살아남아요. 히스토그램이 가장자리에 닿아 있다면 톤이나 커브를 쓰세요.',
        },
        {
          question: '대비와 명료도 중 무엇을 써야 하나요?',
          answer: '대비는 전체에 적용되는 톤 조정이에요. 디테일 패널의 명료도는 국소 대비로, 픽셀과 주변을 흐리게 한 사본 사이의 차이를 중간 톤에 가중치를 두어 더해요. 명료도는 히스토그램의 양 끝을 움직이지 않고 질감을 살리고, 대비는 분포 전체를 움직여요.',
        },
        {
          question: '사진이 물 빠진 것처럼 보이지 않게 대비를 낮추려면 어떻게 하나요?',
          answer: '-15 정도의 작은 음수 대비를 준 다음, 톤의 검정 계열 -20으로 가장 어두운 톤을 바닥까지 되돌리세요. 결과는 탄탄한 블랙 포인트를 유지하면서 중간 톤이 압축되어, 뿌옇다기보다 부드럽게 보여요.',
        },
        {
          question: '슬라이더가 채도도 바꾸나요?',
          answer: '네, 약간 바꿔요. sRGB에서 채널별로 작동하기 때문이에요. 채널 값이 200, 120, 80인 색은 +30에서 237, 116, 56이 되어 채널 사이의 간격이 넓어져요. 색은 바꾸지 않고 톤만 바꾸고 싶다면 레이어 혼합을 광도로 설정하세요.',
        },
        {
          question: '대비와 레벨은 무엇이 다른가요?',
          answer: '레벨은 입력 검정과 입력 흰색 지점, 중간 톤 감마를 직접 지정하므로 어떤 톤이 0과 1이 될지 정확히 정할 수 있어요. 대비는 0.5를 중심으로 대칭인 배율 하나를 적용해요. 히스토그램이 한쪽으로 치우쳐 있으면 레벨이 낫고, 가운데에 모여 있으면 대비가 더 빨라요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '대비 곱셈은 부동소수점으로 픽셀마다 적용되므로, 원본 파일과 선택한 출력 품질에서 생기는 것 이상의 밴딩은 내보낸 파일에 나타나지 않아요.',
          '8비트 원본에 강한 양수 대비를 주면 기존 단계들이 서로 벌어져요. +100에서 살아남는 0.375~0.625 범위에는 원본 단계가 64개뿐이라 그라데이션에 밴딩이 생길 수 있어요.',
        ],
      },
      related: [
        {
          label: '커브',
          to: '/tools/photo-curves',
          description: '채널당 최대 16개의 점으로 대비의 모양을 정확히 그리세요.',
        },
        {
          label: '레벨',
          to: '/tools/photo-levels',
          description: '히스토그램을 보며 채널별로 블랙 포인트와 화이트 포인트를 정하세요. 톤 범위가 한쪽으로 치우쳤을 때 알맞은 도구예요.',
        },
        {
          label: '노출 보정',
          to: '/tools/fix-photo-exposure',
          description: '문제가 범위가 아니라 전체 밝기라면 여기서 시작하세요.',
        },
        {
          label: '흑백 사진',
          to: '/tools/black-and-white-photo',
          description: '채널 슬라이더로 단색으로 변환해요. 대비 선택이 가장 중요한 작업이에요.',
        },
        {
          label: '사진 선명하게',
          to: '/tools/sharpen-photo-online',
          description: '톤 대비가 아닌 가장자리 대비를 언샤프 마스크로 높여요.',
        },
      ],
      embed: {
        title: '대비 바꾸기',
        description: '밋밋하거나 너무 강한 사진을 여기에 끌어다 놓으세요. 기본 패널이 대비 슬라이더가 있는 빛 그룹과 함께 열려요.',
      },
    },
    'fix-photo-exposure': {
      name: '노출 보정',
      h1: '노출 과다·부족 사진 보정하기',
      tagline: '노출을 스톱 단위로 맞춘 뒤, 히스토그램으로 남은 정보를 확인하면서 밝은 영역과 그림자를 따로 되살리세요.',
      metaTitle: '노출 과다·부족 사진을 온라인으로 보정 | Aperture',
      metaDescription: '사진 노출을 브라우저에서 보정하세요. EV 스톱 단위 노출에 밝은 영역, 그림자, 흰색 계열, 검정 계열 복원, 실시간 히스토그램, 전체 해상도 내보내기까지 지원해요.',
      ogTitle: '노출 과다·부족 사진을 온라인으로 보정하기',
      ogDescription: '스톱 단위 노출에 밝은 영역, 그림자, 흰색 계열, 검정 계열 복원을 더하고 실시간 RGB 히스토그램을 보면서 보정하세요. 전체 해상도로 내보내요.',
      intro: '노출 문제는 곧 히스토그램 문제예요. 데이터가 오른쪽 끝(노출 과다)이나 왼쪽 끝(노출 부족)에 쌓여 있고, 해결책은 아직 남아 있는 정보를 버리지 않으면서 데이터를 가운데 쪽으로 되돌리는 거예요. Aperture에서는 기본 패널의 레이어 두 개로 이 작업을 해요. 노출(EV)은 선형 빛에서 전체를 한 스톱 단위나 그 일부만큼 옮겨, 쌓인 데이터의 위치를 바꿔요. 그다음 톤 그룹이 양 끝을 따로 다뤄요. 밝은 영역과 흰색 계열은 밝은 쪽을, 그림자와 검정 계열은 어두운 쪽을 압축하거나 늘리며, 각각 휘도 가중치가 있어서 중간 톤은 거의 건드리지 않아요. 패널 아래의 실시간 RGB 및 루마 히스토그램은 쌓인 데이터가 가장자리에서 떨어졌는지 알려 주고, 길게 눌러 비교하는 키는 너무 많이 조정했는지 알려 줘요.',
      whatItDoes: [
        '노출(EV) -5~+5는 카메라와 같은 단위인 스톱으로 선형 빛에서 사진 전체를 옮겨요. -1 EV는 빛을 절반으로 줄이므로, 클리핑된 흰색 255는 디테일 없는 밋밋한 회색 188이 되고, 230은 168이 돼요.',
        '밝은 영역 -100~+100은 루마 0.4보다 밝은 톤을 압축하거나 펼치며, 흰색에서 최대 강도에 이르러요. -100은 순수한 흰색을 0.75로 내리고 중간 회색은 0.48에 둬요.',
        '그림자 -100~+100은 검정부터 루마 0.6까지에서 같은 일을 해요. +100은 0.05인 거의 검정에 가까운 톤을 0.295로 올리지만, 0.5는 0.519로만 움직여요.',
        '흰색 계열과 검정 계열은 각 끝의 마지막 사분의 일을 다루는, 범위가 더 좁고 약한 버전이에요. 흰색 계열은 루마 0.75 이상에서, 검정 계열은 0.25 미만에서 작동하며, 각각 최대 이동량은 0.15예요.',
        '히스토그램은 현재 미리보기의 빨강, 초록, 파랑, 루마 분포를 보여 주므로, 사진 전체는 괜찮아 보여도 채널 하나만 클리핑된 경우(빨간 꽃, 파란 하늘)를 알아볼 수 있어요.',
      ],
      flowSteps: [
        {
          title: '히스토그램 읽기',
          description: '사진을 열고 데이터가 어디에 몰려 있는지 보세요. 맨 오른쪽의 뾰족한 봉우리는 날아간 밝은 영역이고, 맨 왼쪽의 봉우리는 뭉개진 그림자예요.',
        },
        {
          title: '노출 옮기기',
          description: '중간 톤이 괜찮아 보일 때까지 노출(EV)을 반 스톱씩 드래그하세요. 양 끝은 일단 신경 쓰지 마세요. 다음 단계에서 다뤄요.',
        },
        {
          title: '양 끝 되살리기',
          description: '노출 과다 사진이라면 밝은 영역을 음수로 당기고, 가장 밝은 부분이 여전히 밋밋하면 흰색 계열도 음수로 당기세요. 노출 부족 사진이라면 그림자를 올리고, 필요하면 검정 계열도 올리세요.',
        },
        {
          title: '확인하고 내보내기',
          description: '히스토그램이 더 이상 가장자리에 닿지 않는지 확인하고, 백슬래시 키를 누르고 있으면서 원본과 비교한 뒤, 전체 해상도로 내보내세요.',
        },
      ],
      advancedDetails: [
        '노출은 sRGB를 선형으로 디코딩하고(0.04045 미만이면 v / 12.92, 그 외에는 ((v + 0.055) / 1.055)의 2.4제곱), 2의 EV 제곱을 곱하고, 오프셋을 더하고, 0~1로 제한한 뒤, 다시 인코딩하고 1 / 감마를 적용해요. 클리핑은 되돌릴 수 없어요. 파일에서 이미 1.0인 채널에는 숨은 데이터가 없으므로, -1 EV를 주면 밋밋한 0.735(188)가 돼요.',
        '톤은 L을 BT.709 루마(0.2126 R + 0.7152 G + 0.0722 B)로 계산하고 네 가지 가중치를 구해요. 그림자는 1 - smoothstep(0, 0.6, L), 밝은 영역은 smoothstep(0.4, 1, L), 검정 계열은 1 - smoothstep(0, 0.25, L), 흰색 계열은 smoothstep(0.75, 1, L)이에요. 여기서 smoothstep(a, b, x)는 t = (x - a) / (b - a)를 범위 안으로 제한했을 때 t의 제곱 × (3 - 2t)예요.',
        '루마 변화량은 0.25 × (shadows / 100) × 해당 가중치, 0.25 × (highlights / 100) × 해당 가중치, 0.15 × (blacks / 100) × 해당 가중치, 0.15 × (whites / 100) × 해당 가중치를 모두 더한 값이에요. 범위 안으로 제한한 새 루마를 이전 루마(최솟값 0.0001)로 나눈 값으로 R, G, B를 함께 배율 조정하므로, 톤은 색조를 절대 바꾸지 않아요.',
        '몇 가지 루마 값에서의 가중치: L = 0.1에서 그림자는 0.926, 검정 계열은 0.648이에요. L = 0.5에서는 그림자와 밝은 영역이 모두 0.074예요. L = 0.8에서는 밝은 영역이 0.741, 흰색 계열이 0.104이고, L = 0.9에서는 밝은 영역이 0.926, 흰색 계열이 0.648이에요.',
        '미리보기는 1920 px 사본으로 내 GPU(WebGL2)에서 그려지고, 내보낸 파일은 같은 공식으로 저희 서버에서 원본을 전체 해상도로 렌더링해요. 두 결과는 문서화된 작은 허용 오차, 많아야 8비트 기준 몇 단계 안에서 일치해요(그레인은 정확히 같아요). 노출과 톤은 순수한 픽셀 단위 계산이라 그 허용 오차 중 완전히 같은 쪽 끝에 있어요.',
        '히스토그램은 미리보기에서 계산되므로 1920 px 사본을 반영해요. 공식이 픽셀 단위이고 이미지 크기와 무관하므로, 전체 해상도로 내보낸 결과도 분포가 같아요.',
      ],
      whyItMatters: [
        '노출 과다 사진에서 노출을 내리는 것과 밝은 영역을 되살리는 것은 같지 않아요. 곱셈은 클리핑된 흰색을 균일한 회색으로 만들지만, 밝은 영역 슬라이더는 아직 질감이 남아 있는 밝은 톤을 압축하고, 클리핑된 부분은 마스크로 처리하거나 그대로 받아들이도록 남겨 둬요.',
        '노출이 부족한 사진은 그림자에 노이즈가 있어요. 루마 0.6 미만으로 제한된 그림자 끌어올림은 깨끗한 중간 톤을 그대로 두지만, 전체 노출을 올리면 모든 곳의 노이즈가 커져요.',
        '모든 변경이 별도 레이어라서, 날아간 창문 위에 노출 레이어의 방사형 마스크를 씌우고 톤 레이어는 전체에 적용할 수 있어요. 실제 노출 보정은 대개 이런 모습으로 끝나요.',
      ],
      useCases: [
        {
          title: '하얗게 날아간 해변이나 설경',
          description: '노출 -0.7 EV를 준 다음, 밝은 영역 -50과 흰색 계열 -20으로 모래나 눈을 흰색에서 질감 있는 0.7 정도로 되돌리세요. 진짜 흰색인 반사광 점은 흰색으로 남아요.',
        },
        {
          title: '어두운 공연 사진이나 야경',
          description: '먼저 노출 +1.5 EV를 주고, 노출 때문에 가장자리까지 밀려난 무대 조명을 지키려고 밝은 영역 -40을 준 뒤, 관객에는 그림자 +20을 주세요.',
        },
        {
          title: '배경에 창문이 있을 때',
          description: '전체 노출은 그대로 두고, 창문만 덮는 선형 그레이디언트나 브러시 마스크 아래에 -1.5 EV의 노출 레이어를 하나 더 추가하세요.',
        },
        {
          title: '카메라가 엉뚱한 대상에 노출을 맞췄을 때',
          description: '밝은 벽 앞에서 너무 어둡게 나온 얼굴은 노출 +0.5 EV에 피사체 선택 마스크를 씌우면 벽까지 밝아지지 않아요.',
        },
      ],
      workedExamples: [
        {
          title: '노출 과다 16 MP 해변 사진에 -0.7 EV와 밝은 영역 -50',
          body: '4608 x 3456 JPEG(16 MP, 6.0 MB)에 모래 245, 235, 220, 중간 톤 128, 그림자 30이 있어요. 노출 -0.7 EV는 모래를 198, 189, 177로, 중간 톤을 102로, 그림자를 22로 옮겨요. 그 위에 밝은 영역 -50의 톤 레이어를 얹으면 모래가 177, 170, 159까지 더 내려가지만, 중간 톤은 102에 머물러요. 그 루마에서의 가중치가 0.1 미만이기 때문이에요. 파일에서 순수한 255였던 영역은 노출 단계를 거치면 밋밋한 188이 되므로, 방사형 마스크로 태양을 제외해요. 품질 92의 JPG로 내보내면 전체 16 MP 파일은 약 7.2 MB(유료 요금제), 12 MP 한도에서는 약 5.4 MB예요.',
        },
        {
          title: '노출 부족 12 MP 공연 사진에 +1.5 EV와 밝은 영역 -40',
          body: '4000 x 3000 JPEG(12 MP, 3.8 MB)에 관객 톤 20과 60, 얼굴 128, 무대 조명 180과 200이 있어요. 노출 +1.5 EV를 주면 38, 100, 205, 255, 255가 되어 두 조명이 모두 클리핑돼요. 그 위에 밝은 영역 -40을 더하면 38, 100, 186, 229, 229가 되어 조명이 흰색 아래로 돌아오지만, 노출 단계에서 이미 클리핑되었기 때문에 두 조명이 똑같은 값이 돼요. 대신 노출을 +1.2 EV로 낮추고 그림자 +40의 톤 레이어를 쓰면 어두운 세 톤은 56, 100, 187이 되지만 두 조명은 여전히 255에서 클리핑돼요. 노출을 약 +0.75 EV로 해야만 두 조명이 227과 252로 구분돼요. 품질 80의 AVIF로 내보내면 약 2.4 MB, 일반 작업 한 번이에요.',
        },
      ],
      whenNotToUse: '너무 밝지도 어둡지도 않은데 조금 밋밋하거나 칙칙한 것이 유일한 문제라면 이 페이지는 맞지 않아요. 대비 도구나 커브가 더 적은 조정으로 더 많은 것을 해 줘요. 얼굴이나 하늘이 완전히 흰색이 될 정도로 노출이 과하다면 어떤 슬라이더로도 질감을 되돌릴 수 없어요. JPEG가 애초에 그 정보를 저장하지 않았기 때문이에요. 작게 날아간 부분은 복구 도구로 메울 수 있지만, 날아간 하늘에는 다른 사진이 필요해요. 그리고 노출 문제가 가장자리에만 있다면, 마스크를 씌운 노출 레이어보다 양을 양수로 둔 비네팅이 더 간단해요.',
      whyMediaManipulator: [
        '노출과 복원이 각각 마스크를 가진 별도의 레이어라서, 간편 보정 도구의 밝기 슬라이더 하나로는 할 수 없는 작업이 가능해요.',
        'Aperture는 내보내기 대화상자에서만이 아니라 항상 RGB 히스토그램을 보여 주므로, 모니터가 아니라 데이터를 보면서 노출을 보정할 수 있어요.',
        '같은 보정을 프리셋으로 저장해, 똑같이 잘못 측광된 같은 촬영의 나머지 사진에 적용할 수 있어요. 무료 계정은 한 번에 3장, Pro는 25장까지예요.',
      ],
      privacyNote: '노출 보정은 편집하는 동안 노출과 톤 계산을 내 GPU에서 실행하므로, 여기에 끌어다 놓은 사진은 내보내기, 피사체 선택, 복구를 선택하기 전까지 브라우저에 머물러요. 내보낼 때 원본이 한 번 업로드되어 저희 서버가 모든 픽셀에 같은 스톱과 복원 가중치를 적용하고, 파일은 이후 다른 비회원 작업이나 계정 작업과 똑같이 보관돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 히스토그램은 기기에서 계산되며 어디로도 전송되지 않아요.',
      faq: [
        {
          question: 'JPEG에서 날아간 밝은 영역을 되살릴 수 있나요?',
          answer: '정말로 클리핑되었다면 불가능해요. 255, 255, 255로 저장된 픽셀에는 남은 정보가 없고, 노출을 낮추면 밋밋한 회색(-1 EV에서 188)이 될 뿐이에요. 대개 되살릴 수 있는 것은 240~254처럼 흰색에 가까운 부분으로, 밝은 영역 -60을 주면 질감을 유지한 채 약 205~217로 압축돼요. RAW 파일이라면 더 많은 정보가 있겠지만, 편집기는 브라우저가 디코딩할 수 있는 이미지로 작업해요.',
        },
        {
          question: '노출과 톤은 어떤 순서로 적용해야 하나요?',
          answer: '노출을 먼저, 톤을 그 위에 두세요. 톤 가중치는 입력으로 받는 루마에 따라 달라지므로, 밝은 영역을 되살린 다음 노출을 올리면 복원이 더 이상 알맞은 픽셀을 겨냥하지 못해요. 레이어는 아래에서 위로 적용되고, 기본 패널은 레이어를 그 순서로 만들어요.',
        },
        {
          question: '밝은 영역과 흰색 계열은 무엇이 다른가요?',
          answer: '밝은 영역은 루마 0.4에서 시작해 1.0에서 최대 강도에 이르고, 최대 이동량은 0.25예요. 흰색 계열은 0.75에서 시작하고 최대 이동량은 0.15예요. 밝은 하늘이나 피부에는 밝은 영역을, 가장 밝은 톤이 여전히 밋밋할 때 순수한 흰색 직전의 마지막 단계에는 흰색 계열을 쓰세요.',
        },
        {
          question: '-1 EV가 픽셀 값을 단순히 절반으로 만들지 않는 이유는 뭔가요?',
          answer: '절반으로 줄이는 계산은 선형 빛에서 일어나는데, 파일은 sRGB로 인코딩되어 있기 때문이에요. 128인 중간 회색은 64가 아니라 92가 되고, 230인 밝은 톤은 168이 돼요. sRGB 곡선은 밝은 톤을 압축하므로, 한 스톱 변화가 범위의 아래쪽 절반보다 위쪽 절반에서 더 작게 보여요.',
        },
        {
          question: '자동 노출 보정과는 무엇이 다른가요?',
          answer: '프리셋 패널의 자동 룩은 무난한 시작 스택을 추가하고, 한 단계로 실행 취소할 수 있어요. 이 페이지의 슬라이더는 히스토그램과 비교 키를 갖춘 수동 방식으로, 자동 추정이 피사체를 잘못 판단하는 사진에 쓰여요.',
        },
        {
          question: '노출을 보정하면 사진의 색이 바뀌나요?',
          answer: '노출은 선형 빛에서 세 채널을 똑같이 배율 조정하고, 톤은 루마 비율로 세 채널을 똑같이 배율 조정하므로, 채널이 클리핑되기 전까지 색조가 유지돼요. 노출을 올렸을 때 노을의 빨간색이 사라진다면 빨강 채널이 클리핑된 것이고, RGB 히스토그램의 오른쪽 끝에 빨간 봉우리로 나타나요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '복원은 파일에 아직 남아 있는 톤에만 작동해요. 로그인해서 연 16비트 TIFF 원본은 밝기를 낮출 때 8비트 JPEG보다 밝은 영역의 계조를 더 많이 유지해요.',
          'JPEG에 큰 음수 노출을 주면 밝은 부분에 숨어 있던 압축 블록이 드러나요. 품질 92 이상의 JPG로 내보내면 블록이 더 늘어나지 않아요.',
        ],
      },
      related: [
        {
          label: '이미지 밝게 하기',
          to: '/tools/brighten-image',
          description: '이 페이지의 노출 부족 부분을 밝기와 노출의 비교까지 포함해 더 깊이 다뤄요.',
        },
        {
          label: '레벨',
          to: '/tools/photo-levels',
          description: '히스토그램에서 바로 검정과 흰색 입력 지점을 정하세요.',
        },
        {
          label: '커브',
          to: '/tools/photo-curves',
          description: '커브의 밝은 쪽 끝을 손으로 끌어내려 더 부드러운 모양으로 복원하세요.',
        },
        {
          label: '대비 조정',
          to: '/tools/adjust-image-contrast',
          description: '복원 때문에 톤 범위가 압축된 뒤 힘 있는 느낌을 되찾으세요.',
        },
        {
          label: '이미지 노이즈 줄이기',
          to: '/tools/reduce-image-noise',
          description: '노출을 크게 올리면 드러나는 그림자 노이즈를 정리하세요.',
        },
        {
          label: '비네팅 추가',
          to: '/tools/add-vignette',
          description: '가장자리만 어두울 때는 양을 양수로 둔 비네팅이 모서리를 밝혀 줘요.',
        },
      ],
      embed: {
        title: '노출 보정하기',
        description: '너무 밝거나 너무 어두운 사진을 여기에 끌어다 놓으세요. 기본 패널이 노출과 톤 그룹과 함께 열리고, 그 아래에 히스토그램이 있어요.',
      },
    },
    'adjust-image-hue': {
      name: '이미지 색조 조정',
      h1: '온라인에서 이미지 색조 조정하기',
      tagline: '사진의 모든 색을 최대 180도까지 돌리거나, 빨강, 초록, 파랑만 따로 옮기세요. 실시간 미리보기와 전체 해상도 내보내기를 지원해요.',
      metaTitle: '이미지 색조를 온라인으로 조정: 전체 색 또는 한 범위 이동 | Media Manipulator',
      metaDescription: '사진 전체의 색조를 -180~180도로 옮기거나, 빨강, 노랑, 초록, 청록, 파랑, 자홍만 따로 옮기세요. GPU 실시간 미리보기와 전체 해상도 내보내기를 지원해요.',
      ogTitle: '온라인에서 이미지 색조 조정하기 | Media Manipulator',
      ogDescription: '모든 색조를 한 번에 돌리거나 한 색상 범위를 몇 도만 살짝 옮기세요. 폭과 페더로 각 범위가 미치는 정도를 정하고, 회색은 그대로 둬요.',
      intro: '색조는 색상환 위에서 색이 놓인 각도예요. 이 페이지에서는 Media Manipulator의 사진 편집기 Aperture가 색상(HSL) 패널을 앞에 띄운 채 열리므로 바로 그 각도를 돌릴 수 있어요. 조정은 스택 안의 레이어 하나예요. 모든 픽셀을 sRGB에서 HSL로 변환하고, 색조를 모든 색상 슬라이더 값만큼, 그리고 여섯 범위 슬라이더가 그 색조에 더하는 만큼 돌린 뒤, 다시 변환해 범위를 벗어난 값을 잘라 내요. 픽셀에 굳어지는 것은 없어요. 색조를 +30으로 드래그해 청록빛 물을 파란색 쪽으로 밀고, GPU 미리보기에서 변화를 바로 확인한 다음, 저희 서버가 원본 픽셀로 렌더링한 파일을 내보낼 수 있어요. 전체를 180도 돌리면 모든 색이 보색으로 바뀌고, 범위 하나를 20도 돌리면 한 색 계열만 움직이고 나머지는 제자리에 남아요.',
      whatItDoes: [
        '모든 색상의 색조 슬라이더는 -180~180도 범위이고 모든 픽셀을 같은 각도만큼 돌려요. 그래서 +120이면 빨강이 초록이 되고, -120이면 빨강이 파랑이 되며, 180이든 -180이든 색상환의 정반대 쪽에 닿아요.',
        '이름이 붙은 범위 여섯 개, 즉 0도의 빨강, 60도의 노랑, 120도의 초록, 180도의 청록, 240도의 파랑, 300도의 자홍에는 각각 색조, 채도, 명도 슬라이더와 함께 범위가 얼마나 넓게 미칠지 정하는 폭과 페더가 있어요.',
        '스포이트로 사진에서 아무 색이나 클릭하면 그 색을 중심으로 한 사용자 지정 범위가 추가돼요. 레이어 하나에 범위를 최대 32개까지 둘 수 있고, 이름 붙은 두 범위 사이에 있는 특정한 주황이나 보라를 겨냥할 때 이 방법을 쓰면 돼요.',
        '범위 편집은 회색에서는 약해져요. HSL 채도가 10% 미만인 픽셀은 그만큼 비례해서 덜 움직이므로, 빨강을 옮겨도 콘크리트, 흰 벽, 그림자에 색 치우침이 생기지 않아요.',
        '레이어는 비파괴 방식이고 불투명도, 혼합 모드, 선택 사항인 마스크, 무제한 실행 취소를 갖춰요. 두 번째 색 계열을 다루려면 색상(HSL) 레이어를 하나 더 쌓고, 미리보기가 마음에 들면 내보내세요.',
      ],
      flowSteps: [
        {
          title: '사진 열기',
          description: '위 상자에 JPG, PNG, WebP, GIF, HEIC, AVIF 또는 TIFF 파일을 끌어다 놓으세요. 편집기가 전체 화면으로 열리고 색상(HSL)이 선택되어 있어요.',
        },
        {
          title: '전체 또는 범위 선택',
          description: '전체를 돌리려면 모든 색상의 색조 슬라이더를 드래그하고, 한 범위만 옮기려면 빨강, 노랑, 초록, 청록, 파랑, 자홍 중 하나를 고르세요.',
        },
        {
          title: '폭과 페더 조정',
          description: '범위를 넓혀 이웃한 색조까지 포함하거나 좁혀서 한 색만 골라내고, 페더를 설정해 이동의 경계가 보이지 않게 하세요.',
        },
        {
          title: '내보내기',
          description: 'JPG, PNG, WebP, AVIF 또는 TIFF와 품질을 고르세요. 서버가 같은 색조 계산으로 원본을 전체 크기로 다시 렌더링하고 파일 이름에 (retouched)를 붙여요.',
        },
      ],
      advancedDetails: [
        '픽셀마다 HSL로 색조 h, 채도 s, 명도 l을 구해요. 출력 색조는 h에 전체 색조를 더하고, 범위마다 가중치와 그 범위 색조를 곱한 값의 합을 더한 값이에요. 채도는 s에 1 + 전체 채도/100을 곱하고, 범위마다 1 + 가중치 × 범위 채도/100을 곱한 값을 다시 곱해요. 명도가 양수면 l이 양 × (1 - l)만큼 1 쪽으로, 음수면 양 × l만큼 0 쪽으로 움직여요. 결과는 RGB로 되돌린 뒤 0..1로 잘라 내요.',
        '픽셀 색조와 범위 중심 사이의 원형 거리가 폭/2 이하이면 범위 가중치는 1이고, 페더 구간을 지나며 직선으로 0까지 떨어지며, 폭/2 + 페더를 넘으면 0이에요. 기본값인 폭 30, 페더 30에서는 범위가 중심 양쪽 15도까지 온전히 적용되고 45도까지 점점 줄어요. 색조 20은 빨강 가중치 0.833을 받고, 색조 30은 빨강에서 0.5, 노랑에서 0.5를 받으며, 색조 45는 전부 노랑에 속해요. 폭은 10~120, 페더는 0~90을 받아요.',
        '모든 범위 가중치에는 중립색 감쇠인 min(1, s / 0.1)이 곱해져요. HSL 채도가 0.04인 픽셀은 범위 이동의 40%만 받고, 0.1 이상인 픽셀은 전부 받아요. 전체 색조는 감쇠되지 않지만, 진짜 회색은 채도가 전혀 없어서 어떤 각도를 더해도 같은 회색으로 돌아오고, 채도 4%인 거의 회색인 픽셀은 몇 단계만 바뀌어요.',
        '색조는 원형이라 중심이 0인 빨강은 이음매의 양쪽을 모두 덮어요. 색조 350인 픽셀은 빨강 중심에서 10도 떨어져 있어 빨강 가중치를 온전히 받고, 360을 넘어가도록 밀린 색조는 색상환의 처음으로 돌아가요.',
        '미리보기는 사진의 1920 px 프록시로 그래픽 카드의 WebGL2에서 그려지고, 다운로드하는 파일은 저희 서버가 같은 HSL 공식으로 원본 픽셀에서 렌더링해요. 두 결과는 색상 연산에 대해 문서화된 허용 오차, 즉 255단계 중 평균 오차 1 이하, 최대 4단계 안에서 일치해요.',
      ],
      whyItMatters: [
        '색조는 밝기와 대비 도구로는 건드릴 수 없는 유일한 색의 축이에요. 노랑이어야 할 초록은 노출을 어떻게 잡아도 초록으로 남고, 색조를 돌려야만 바로잡을 수 있어요.',
        '카메라와 휴대폰의 처리 과정은 나뭇잎을 지나치게 청록빛으로, 노을을 지나치게 자홍빛으로 표현하는 경우가 많아요. 범위 하나를 10~20도 옮기면 화면의 다른 부분은 바꾸지 않고 이를 바로잡을 수 있어요.',
        '제품이나 브랜드 작업에서는 같은 사물을 다른 색으로 보여 줘야 할 때가 많아요. 페더를 준 범위별 색조 이동이 음영과 하이라이트를 그대로 지키면서 가장 빨리 해내는 방법이에요.',
      ],
      useCases: [
        {
          title: '물과 하늘 보정',
          description: '청록색으로 나온 열대 바다는 청록 색조 +20~+30으로 파란색 쪽으로 옮겨지고, 청록이 거의 없는 모래는 그대로 남아요.',
        },
        {
          title: '나뭇잎을 따뜻하게 또는 차갑게',
          description: '초록 색조를 음수로 하면 나뭇잎이 노란색 쪽으로 가서 가을 느낌이 나고, 양수로 하면 청록 쪽으로 가서 더 차갑고 촉촉한 느낌이 나요.',
        },
        {
          title: '제품 색 바꾸기',
          description: '스포이트로 제품 색을 고르고, 사용자 지정 범위의 색조를 원하는 각도로 설정한 뒤, 다른 것이 움직이지 않도록 폭과 페더를 작게 두세요.',
        },
        {
          title: '창의적인 색 바꾸기',
          description: '전체를 180도 돌리면 한 번에 보색으로 뒤바뀐 화면을 얻고, 전체를 조금만 돌리면 색이 틀어진 필름처럼 크로스 프로세스 느낌이 나요.',
        },
      ],
      workedExamples: [
        {
          title: '청록빛 물을 파랗게: 12 MP JPEG에 모든 색상 색조 +30',
          body: '너무 초록빛으로 나온 석호를 찍은 4000 x 3000 사진(12메가픽셀, 4.8 MB)이에요. 물 픽셀 (26, 153, 166)은 색조 185.5도, 채도 0.73, 명도 0.375예요. 모든 색상의 색조를 +30으로, 모든 범위를 0으로 두면 채도와 명도는 그대로이고 색조만 215.5가 되며, 픽셀은 선명한 파랑인 (25, 83, 166)으로 내보내져요. 채도가 0.2 안팎인 모래도 30도 돌아가요. 전체 슬라이더는 낮은 채도에서 감쇠되지 않기 때문이에요. 그래서 이 사진에는 청록 범위를 +30 옮기는 편이 더 나아요(색조 185.5에서 가중치 1, 색조 35인 모래에서는 가중치 0). 품질 92의 JPG로 내보내면 대화상자의 메가픽셀당 0.45 MB 추정치로 약 5.4 MB이고, 내보내기는 일반 작업 한 번이에요.',
        },
        {
          title: '가을 나뭇잎: RAW에서 뽑은 24 MP JPEG에 초록 색조 -30',
          body: '카메라에서 내보낸 6000 x 4000 파일(24메가픽셀, 11 MB)이에요. 잎 픽셀 (77, 140, 46)은 색조 100.5도예요. 기본값인 폭 30, 페더 30에서 이 픽셀은 초록 중심에서 19.5도 떨어져 있으므로 초록 가중치가 1 - (19.5 - 15) / 30 = 0.85이고, 노랑 중심에서는 40.5도 떨어져 있어 노랑 가중치가 0.15예요. 초록 색조를 -30으로 하면 잎이 0.85 x -30 = -25.5도 돌아 색조 75가 되고, 올리브빛 노랑인 (117, 140, 46)으로 내보내져요. 대신 노랑 색조를 -30으로 하면 0.15 x -30 = -4.5도만 움직여 (84, 140, 46)이 되므로 거의 차이가 없어요. 채도 0.04, 색조 105인 초록빛 회색 바위 (125, 133, 122)는 초록 가중치에 0.4가 곱해져 12도만 움직이고, (127, 133, 122)로 2단계만 바뀌어요. 24메가픽셀 전체를 내보내려면 Premium이나 Pro가 필요하고, 품질 92에서 JPG는 약 10.8 MB예요.',
        },
      ],
      whenNotToUse: '촬영할 때의 빛 때문에 사진 전체에 색이 끼었다면 색조 슬라이더는 맞는 도구가 아니에요. 그건 화이트 밸런스 문제이고, 저희 화이트 밸런스 페이지의 색온도와 색조 슬라이더가 색조끼리 밀어내지 않고 선형 빛에서 바로잡아요. 같은 색의 다른 사물은 그대로 두고 사물 하나만 바꿔야 할 때도 맞지 않아요. 색조 범위는 위치가 아니라 색으로 선택하므로, 브러시나 방사형 마스크를 추가하거나 사물 색상 페이지를 쓰세요. 단순히 채도를 빼는 일은 채도 페이지에서, 단색으로 바꾸는 일은 여섯 개의 채널 슬라이더로 색조마다 회색 정도를 정하는 흑백 페이지에서 하세요.',
      whyMediaManipulator: [
        'Aperture는 드래그하는 동안 GPU에서 회전 결과를 보여 주고, 내보내는 파일은 같은 범위별 가중치로 원본 픽셀에서 계산해요. 그래서 화면에서 본 색조가 그대로 결과물이 돼요.',
        '범위별 폭과 페더, 회색을 위한 중립색 감쇠, 스포이트 범위는 데스크톱 편집기가 주는 컨트롤이에요. 여기서는 설치 없이 브라우저 탭에서 쓸 수 있어요.',
        '모든 조정, 피사체 선택을 뺀 모든 마스크 종류, 모든 룩, 모든 실행 취소는 무료예요. 마지막 내보내기만 일반 작업 한 번으로 계산되고, 일일 사용량은 요금 페이지에 나와 있어요.',
      ],
      privacyNote: '계정이 없으면 여기에 끌어다 놓은 사진은 브라우저에서 디코딩되고, 색조 이동은 브라우저 밖으로 나가지 않아요. 프로젝트는 내보내기 전까지 이 브라우저의 IndexedDB에 남고, 내보내기는 저희 서버에서 렌더링되는 일반적인 비회원 업로드예요. 로그인하면 원본, 1920 px 미리보기, 썸네일이 보관 기간 설정에 따라 프로젝트와 함께 저장되고, 프로젝트나 계정을 삭제하면 함께 지워져요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 외부의 누구에게도 파일이 전달되지 않아요.',
      faq: [
        {
          question: '모든 색상의 색조와 범위 색조는 어떻게 다른가요?',
          answer: '모든 색상은 색과 관계없이 모든 픽셀에 같은 각도를 더해요. 범위 색조는 색조가 그 범위 안에 있는 픽셀에만 각도를 더하고, 범위 가중치에 따라 조절되며 거의 회색인 픽셀에서는 약해져요. 그래서 한 색 계열만 움직이고 나머지는 건드리지 않아요.',
        },
        {
          question: '색조를 조금만 바꿨는데 어떤 색에서는 왜 크게 달라 보이나요?',
          answer: '색조는 각도이고, 같은 각도만큼 돌려도 체감되는 변화는 색상환 위치마다 달라요. 노랑과 초록 사이에서는 몇 도만 움직여도 확연하지만, 파랑과 보라 사이에서는 같은 폭이 미묘해요. 특정 숫자를 노리기보다 미리보기를 보고 히스토그램을 활용하세요.',
        },
        {
          question: '빨강을 옮기면 피부에도 영향이 있나요?',
          answer: '네, 보통은 그래요. 피부 톤은 색조 15~30 부근으로 빨강 범위 안에 있고 일부는 노랑 범위에도 걸치므로, 빨강 색조를 바꾸면 피부도 움직여요. 얼굴을 제외하려면 레이어에 색상 범위나 브러시 마스크를 추가하거나, 빨강의 폭을 좁혀 범위가 주황빛 피부 색조 앞에서 멈추게 하세요.',
        },
        {
          question: '빨강을 돌렸는데 회색 배경은 왜 바뀌지 않았나요?',
          answer: '범위 이동에는 min(1, saturation / 0.1)이 곱해져요. 회색 배경은 채도가 거의 없어서 가중치도 사라지고, 원래 톤을 유지해요. 일부러 이렇게 만들었어요. 중립색에 색조 편집이 적용되면 원하지 않은 색 치우침이 생기니까요.',
        },
        {
          question: '이름 붙은 두 범위 사이에 있는 색의 색조도 돌릴 수 있나요?',
          answer: '스포이트로 그 색을 클릭하면 정확히 그 색조를 중심으로 한 사용자 지정 범위가 만들어져요. 그런 다음 그 범위에 색조, 폭, 페더를 따로 주세요. 색상(HSL) 레이어 하나에 범위를 최대 32개까지 넣을 수 있어요.',
        },
        {
          question: '색조를 옮기면 사진의 밝기도 바뀌나요?',
          answer: '편집기가 쓰는 HSL 모델에서는 바뀌지 않아요. 각도가 돌아가는 동안 명도는 그대로 유지돼요. 하지만 체감 밝기는 색조마다 다르기 때문에, 노랑을 파랑으로 돌리면 HSL 명도가 같아도 더 어두워 보여요. 명도 슬라이더로 보정하고 싶다면 실시간 히스토그램에서 루마 변화를 확인할 수 있어요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '색조 회전은 감마 공간 HSL에서 픽셀 단위로 이루어지는 연산이에요. 24메가픽셀 원본을 내보내는 데는 서버에서 몇 초가 걸리고, 시간을 좌우하는 것은 계산이 아니라 인코딩이에요.',
          'HEIC, TIFF, BMP 원본은 브라우저가 디코딩할 수 없어 서버가 미리보기용 사본을 준비해야 하므로 계정이 필요해요.',
        ],
      },
      related: [
        {
          label: '사물 색상 바꾸기',
          to: '/tools/change-image-color',
          description: '색조 회전과 색상 범위 마스크를 함께 써서 사물 하나만 바꿔요.',
        },
        {
          label: '이미지 채도',
          to: '/tools/image-saturation',
          description: '사진 전체의 활기와 채도, 같은 색상(HSL) 패널의 나머지 두 축이에요.',
        },
        {
          label: '컬러 팝',
          to: '/tools/color-pop',
          description: '기본 제공 룩으로 한 가지 색만 남기고 나머지는 채도를 빼요.',
        },
        {
          label: '화이트 밸런스',
          to: '/tools/white-balance-photo',
          description: '화면 전체가 파란색이나 주황색으로 기울었다면 색상(HSL)의 색조가 아니라 화이트 밸런스의 색온도와 색조로 바로잡아야 해요.',
        },
        {
          label: '스플릿 토닝',
          to: '/tools/split-toning',
          description: '기존 색을 돌리는 대신 그림자와 밝은 영역에 각각 다른 색조를 더해요.',
        },
        {
          label: '사진 편집기 튜토리얼',
          to: '/tutorials/aperture',
          description: '레이어, 마스크, 룩, 내보내기를 처음 편집할 때 만나는 순서대로 다뤄요.',
        },
      ],
      embed: {
        title: '이미지 색조 조정하기',
        description: '사진을 끌어다 놓으면 Aperture가 색상(HSL) 패널로 열려요. 모든 색이나 한 범위를 -180~180도 돌리고 전체 해상도로 내보내세요.',
      },
    },
    'change-image-color': {
      name: '사물 색상 바꾸기',
      h1: '사진 속 사물의 색상 바꾸기',
      tagline: '스포이트로 색을 고르고, 선택 범위를 얼마나 넓힐지 정하고, 색조를 돌린 뒤 내보내세요. 빨간 자동차가 음영과 반사는 그대로 둔 채 초록색이 돼요.',
      metaTitle: '사진 속 사물의 색상을 온라인으로 바꾸기 | Media Manipulator',
      metaDescription: '색상 범위 마스크로 색을 기준으로 사물을 선택하고, 색상(HSL) 슬라이더로 색조를 돌린 뒤 전체 해상도로 내보내세요. 음영과 하이라이트는 그대로 유지돼요.',
      ogTitle: '사진 속 사물 색상 바꾸기 | Media Manipulator',
      ogDescription: '스포이트, 허용량, 색조 회전. 브라우저에서 자동차, 셔츠, 벽의 색을 바꾸고 저희 서버가 렌더링한 전체 크기 파일을 다운로드하세요.',
      intro: '이 페이지에서는 Media Manipulator의 사진 편집기 Aperture가 색상(HSL) 패널로 열리고, 클릭 한 번이면 색상 범위 마스크를 쓸 수 있어요. 사물의 색을 바꾸는 데 필요한 두 도구가 바로 이 둘이에요. 선택은 마스크가 맡아요. 스포이트로 사물을 클릭하면 모든 픽셀이 고른 색과 얼마나 다른지 CIE Lab으로 측정해 점수를 받고, 허용량 슬라이더가 그 범위를 정해요. 색을 바꾸는 일은 색상(HSL) 레이어가 해요. 마스크 안에서 색조를 돌리면 사물의 색은 바뀌지만 명도와 채도는 그대로이므로 음영, 반사, 질감도 그대로 남아요. 둘은 스택 안에서 별개의 레이어라서, 색을 정한 뒤에 선택을 다듬을 수도 있고 어느 쪽이든 실행 취소할 수 있어요.',
      whatItDoes: [
        '색상 범위 마스크 구성 요소는 사진에서 고른 대상 색과의 거리로 픽셀을 선택해요. Shift 키를 누른 채 클릭하면 대상을 최대 8개까지 추가할 수 있어서, 두 가지 빨강이 섞인 자동차도 한 번에 선택돼요.',
        '허용량은 0~100이고 선택 반경을 Lab 단위로 정해요. 허용량을 끝까지 올리면 최대 60이고, 반경의 바깥쪽 절반에는 부드러운 가장자리가 있어 사물의 경계가 칼로 자른 듯 끊기지 않아요.',
        '색상(HSL) 레이어에서 전체 또는 범위별로 색조를 돌리면 선택된 픽셀이 색상환 위에서 움직이고, HSL 채도와 명도는 정확히 그대로 유지돼요.',
        '마스크 구성 요소는 결합할 수 있어요. 같은 색이 화면의 다른 곳에도 있다면 색상 선택을 방사형, 선형 그레이디언트, 브러시 구성 요소와 교차해 사물 하나로 제한하세요. 반전은 선택을 뒤집고, 마스크 페더는 경계를 부드럽게 해요.',
        '마스크는 오버레이로 보거나 마스크만 따로 볼 수 있고, 레이어는 자체 불투명도와 혼합 모드를 가지며, 내보내기는 같은 마스크 계산으로 원본을 전체 해상도로 렌더링해요.',
      ],
      flowSteps: [
        {
          title: '사진 끌어다 놓기',
          description: 'JPG, PNG, WebP, GIF, HEIC, AVIF, TIFF 중 무엇이든 돼요. 편집기가 색상(HSL)을 앞에 띄운 채 열리고, 그 레이어에 빈 마스크가 준비되어 있어요.',
        },
        {
          title: '색 고르기',
          description: '마스크 패널에서 색상 범위 구성 요소를 추가하고, 스포이트로 사물을 클릭한 뒤, 마스크 오버레이에서 사물 전체가 덮일 때까지 허용량을 올리세요.',
        },
        {
          title: '색조 돌리기',
          description: '사물이 원하는 색이 될 때까지 모든 색상의 색조 슬라이더를 움직이세요. 마스크가 씌워진 픽셀만 바뀌어요.',
        },
        {
          title: '다듬고 내보내기',
          description: '같은 색이 다른 곳에도 있다면 브러시나 방사형 구성 요소를 교차로 추가하고, 마스크에 페더를 준 뒤 JPG, PNG, WebP, AVIF 또는 TIFF로 내보내세요.',
        },
      ],
      advancedDetails: [
        '색상 범위 마스크는 픽셀과 각 대상 색을 모두 CIE Lab(D65, 선형 sRGB 기준)으로 변환하고 둘 사이의 유클리드 거리 dE, 즉 1976 델타 E를 구해요. 반경은 R = 허용량 / 100 x 60이고, 마스크 값은 1 - smoothstep(0.5 R, R, dE)예요. 반경의 절반까지는 완전히 선택되고, 반경 끝에서 완전히 사라질 때까지 부드럽게 줄어들며, 대상이 여럿이면 가장 큰 값이 적용돼요. 허용량 40이면 R = 24이므로 dE 12 이하인 픽셀은 완전히 선택되고 dE 24 이상인 픽셀은 전혀 선택되지 않아요.',
        '구성 요소는 왼쪽에서 오른쪽으로 차례로 결합돼요. 추가는 최댓값, 빼기는 min(m, 1 - component), 교차는 최솟값을 써요. 결합된 마스크는 sigma = 마스크 페더 / 100 x 0.05 x 사진의 긴 변인 가우시안으로 흐려지고, 선택에 따라 반전된 뒤 마스크 강도가 곱해져요. 픽셀별 레이어 출력은 lerp(input, adjusted, m)이에요.',
        '색 변경 자체는 색상(HSL) 공식이에요. 색조 h에 전체 색조와 가중치가 적용된 범위 색조를 더하고, 채도와 명도는 슬라이더가 0이면 그대로 둔 채 RGB로 되돌려요. 마스크는 조정 뒤에 적용되므로 마스크 값이 0.9인 픽셀은 원래 값에서 새 색 값까지 90%만큼 이동하고, 이 덕분에 가장자리가 자연스럽게 섞여요.',
        'Lab 거리에는 명도가 포함되므로, 빨간 사물의 깊은 그림자는 벽돌 벽보다도 고른 빨강에서 더 멀 수 있어요. 벽까지 딸려 올 만큼 허용량을 올리지 말고, Shift 키를 누른 채 클릭해 사물의 음영을 따라 대상 두세 개를 고르세요.',
        '화면에 보이는 것은 1920 px 사본을 내 GPU에서 WebGL2로 렌더링한 결과이고, 다운로드하는 파일은 저희 서버가 똑같은 Lab, smoothstep, HSL 코드로 전체 크기 원본에서 렌더링한 결과예요. 두 결과는 색상 연산에 대해 문서화된 허용 오차, 즉 8비트 기준 평균 1, 최대 4단계 안에서 일치해요.',
      ],
      whyItMatters: [
        '색으로 선택하면 음영, 반사광, 질감의 모든 픽셀이 그대로 남아요. 단색으로 덧칠하면 이런 것이 사라지죠. 색을 바꾼 뒤에도 사물은 같은 빛을 받는 것처럼 보여요.',
        'Lab 거리는 RGB 거리보다 사람 눈에 두 색이 얼마나 달라 보이는지를 더 잘 따라가므로, 선택 경계가 직접 그렸을 위치에 놓여요.',
        '선택과 색이 별개의 레이어라서, 나중에 색을 바꾸고 싶어지면 다시 선택할 필요 없이 슬라이더 하나만 움직이면 돼요.',
      ],
      useCases: [
        {
          title: '제품 색상 변형',
          description: '한 가지 색상만 촬영하고 그 색을 고른 뒤 색조를 돌려 나머지 색상을 만드세요. 바느질과 그림자는 모든 변형에서 똑같아요.',
        },
        {
          title: '자동차와 자전거 판매 글',
          description: '구매자가 묻는 색으로 차량을 보여 주세요. 밝은 패널에 하나, 그림자에 하나, 대상 두 개면 차체 전체가 선택돼요.',
        },
        {
          title: '인물 사진 속 옷',
          description: '셔츠를 노란색에서 파란색으로 바꾸세요. 색상 선택을 브러시 구성 요소와 교차하면 배경의 노란 간판은 그대로 남아요.',
        },
        {
          title: '벽과 방',
          description: '방 사진에 페인트 색을 미리 입혀 보세요. 흰색 몰딩은 Lab 거리가 너무 멀어서, 색상 선택이 벽만 잡고 몰딩은 남겨 둬요.',
        },
      ],
      workedExamples: [
        {
          title: '빨간 자동차를 초록으로: 20 MP JPEG에 허용량 60, 모든 색상 색조 +120',
          body: '판매 글에 쓸 5472 x 3648 사진(20메가픽셀, 9 MB)이에요. 문을 클릭하면 (204, 26, 31), Lab (43.8, 64.9, 45.5)가 선택돼요. 그늘진 패널 (153, 20, 26)은 이 색에서 dE 20.7, 햇빛을 받은 하이라이트 (242, 89, 84)는 dE 19.6 떨어져 있어요. 허용량 40에서는 반경이 24라서 이 둘이 0.187과 0.309밖에 받지 못해 자동차가 얼룩덜룩해져요. 허용량 60에서는 반경이 36이고 둘은 0.940과 0.979을 받아요. 자동차 뒤 벽돌 벽 (166, 77, 56)은 dE 33.8로 0.041을, 아스팔트 (89, 89, 92)는 dE 80.0로 0을 받아요. 모든 색상의 색조를 +120으로 하면 그림자 픽셀은 (26, 153, 20)으로 바뀌고 0.940으로 섞여 (34, 145, 20)이 되며, 하이라이트는 (84, 242, 89)가 되고 0.979로 섞여 (87, 239, 89)가 돼요. 품질 92의 JPG로 내보내면 메가픽셀당 0.45 MB 추정치로 약 9 MB이고, 20메가픽셀 전체를 내보내려면 Premium이나 Pro가 필요해요. 무료 계정은 12 MP까지예요.',
        },
        {
          title: '노란 재킷을 파랑으로: 12 MP 휴대폰 사진에서 노랑 범위 이동과 마스크 비교',
          body: '휴대폰으로 찍은 4032 x 3024 HEIC(12.2메가픽셀)예요. 재킷 픽셀 (242, 204, 38)은 색조 48.8, 채도 0.89, 명도 0.55예요. 두 가지 방법 모두 같은 재킷을 만들어요. 첫 번째 방법은 마스크 없이 노랑 색조를 -170으로 하는 거예요. 노랑 중심에서 11.2도 떨어져 있어 가중치가 1이고, 색조는 238.8이 되며, 픽셀은 (38, 42, 242)로 내보내져요. 하지만 배경의 노란 도로 표지판도 파랗게 변해요. 두 번째 방법은 허용량 50(반경 30)으로 재킷에서 고른 색상 범위 구성 요소를 재킷 위에 칠한 브러시 구성 요소와 교차하고, 모든 색상의 색조를 -170으로 하는 거예요. 표지판은 브러시가 제외하므로 0을 받고, 재킷 픽셀은 똑같이 (38, 42, 242)로 내보내져요. 품질 92로 내보내면 약 5.5 MB예요. HEIC 원본은 서버가 미리보기용으로 디코딩해야 하므로 계정이 필요해요.',
        },
      ],
      whenNotToUse: '색상 선택으로는 같은 빛 아래 같은 색인 두 사물을 구분할 수 없어요. 그럴 때는 브러시나 방사형 마스크를 쓰거나, 사물이 화면의 주인공이라면 피사체 선택을 쓰세요. 색조가 아닌 색은 만들 수 없으므로, 흰색, 검은색, 금속 마감은 회전 대신 채도와 명도를 바꿔야 하고, 표면의 무늬나 재질도 바꿀 수 없어요. 사물 하나가 아니라 사진 전체에 색 치우침이 있다면 화이트 밸런스나 색상 균형 페이지를 쓰고, 사물을 투명한 배경 위에 오려 내고 싶다면 배경 제거 도구를 쓰세요.',
      whyMediaManipulator: [
        'Aperture의 색상 범위 마스크는 허용량, 여러 대상, 페더를 갖춘 진짜 Lab 거리 기반 선택이고, 비용이 들지 않아요. 계산되는 것은 내보내기, 즉 일반 작업 한 번뿐이에요.',
        '마스크는 그레이디언트, 방사형, 브러시, 휘도 범위와 추가, 빼기, 교차로 겹쳐 쓸 수 있으므로, 전부 칠하지 않고도 색상 선택을 사물 하나에 고정할 수 있어요.',
        '미리보기는 내 GPU에서 실행되고, 최종 파일은 저희 서버가 원본 픽셀로 렌더링해 미리보기와 일치해요. 그래서 24메가픽셀 판매용 사진은 24메가픽셀 그대로 돌아와요.',
      ],
      privacyNote: '색상 범위 선택과 색조 회전은 모두 브라우저에서 실행되고, 이를 위해 사진의 픽셀을 업로드하지 않아요. 로그인하지 않으면 프로젝트는 이 브라우저의 IndexedDB에 남고, 내보내기, 피사체 선택, 복구를 할 때만 일반적인 비회원 작업으로 브라우저 밖으로 나가요. 로그인하면 원본, 1920 px 미리보기, 썸네일이 보관 기간 설정에 따라 프로젝트와 함께 보관되고, 프로젝트나 계정을 삭제하면 함께 지워져요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 외부와 공유하는 것은 아무것도 없어요.',
      faq: [
        {
          question: '같은 색이 두 군데 있을 때 사물 하나만 색을 바꾸려면 어떻게 하나요?',
          answer: '원하는 사물 위에 방사형이나 브러시로 두 번째 마스크 구성 요소를 그리고 교차로 설정하세요. 그러면 마스크는 색상 선택과 그 모양 중 최솟값이 되므로, 모양 밖에 있는 다른 사물은 전혀 선택되지 않은 채로 남아요.',
        },
        {
          question: '허용량 슬라이더는 정확히 무엇을 조절하나요?',
          answer: '선택의 Lab 반경이에요. 허용량을 100으로 나누고 60을 곱한 값이죠. 고른 색과의 거리가 반경의 절반보다 가까운 픽셀은 완전히 선택되고, 반경보다 먼 픽셀은 선택되지 않으며, 그 사이에서는 값이 smoothstep 곡선을 따라 줄어들어요.',
        },
        {
          question: '빨간 사물을 흰색이나 검은색으로 바꿀 수 있나요?',
          answer: '흰색과 검은색에는 색조가 없으므로 색조 회전으로는 할 수 없어요. 같은 마스크를 그대로 두고 색상(HSL) 레이어의 채도 슬라이더를 -100으로 설정한 뒤, 명도나 마스크를 씌운 커브 레이어로 회색을 흰색이나 검은색 쪽으로 미세요.',
        },
        {
          question: '사물의 가장 어두운 부분은 왜 선택되지 않나요?',
          answer: 'Lab 거리에는 명도가 포함되므로, 빨간 자동차의 그늘진 면은 다른 사물보다도 클릭한 색에서 더 멀 수 있어요. 전체 허용량을 올리는 대신 Shift 키를 누른 채 그늘진 부분을 클릭해 두 번째 대상을 추가하세요.',
        },
        {
          question: '사물 색을 바꾸면 AI 작업이 차감되나요?',
          answer: '아니요. 색상 범위 마스크와 색조 회전은 픽셀로 계산하는 일반적인 조정이에요. AI 모델을 쓰는 것은 피사체 선택과 복구뿐이에요. 색상 선택은 무료이고, 내보내기는 일반 작업 한 번으로 계산돼요.',
        },
        {
          question: '새 색도 원래 색과 같은 음영을 갖나요?',
          answer: '네. 회전은 색조 각도만 바꾸고 모든 픽셀의 HSL 채도와 명도는 유지되므로, 하이라이트, 반사, 그림자의 형태가 그대로 남아요. 다만 체감 밝기는 색조마다 달라지며, 실시간 히스토그램에서 확인할 수 있어요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '내보낼 때 Lab 변환과 마스크 흐림은 원본의 모든 픽셀에 적용돼요. 20메가픽셀 파일은 서버에서 몇 초 안에 렌더링돼요.',
          '투명한 PNG 원본은 알파를 유지해요. 마스크와 색 변경은 알파 채널을 절대 건드리지 않아요.',
        ],
      },
      related: [
        {
          label: '이미지 색조 조정',
          to: '/tools/adjust-image-hue',
          description: '같은 색조 슬라이더를 마스크 없이 사진 전체나 이름 붙은 범위 하나에 적용해요.',
        },
        {
          label: '색상으로 선택',
          to: '/tools/select-by-color',
          description: '어떤 조정이든 한 가지 색으로 제한하고 싶을 때 쓰는 색상 범위 마스크 단독 기능이에요.',
        },
        {
          label: '컬러 팝',
          to: '/tools/color-pop',
          description: '사물의 색은 남기고 화면의 나머지를 회색으로 바꿔요.',
        },
        {
          label: '이미지 배경 제거',
          to: '/tools/remove-background-from-image',
          description: '사물의 색을 바꾸기보다 사물만 완전히 분리하고 싶을 때 쓰세요.',
        },
        {
          label: '이미지 채도',
          to: '/tools/image-saturation',
          description: '새 색을 이미지 전체에서 더 강하게 또는 더 부드럽게 만들어요.',
        },
      ],
      embed: {
        title: '사물의 색상 바꾸기',
        description: '사진을 끌어다 놓으면 Aperture가 열려요. 스포이트로 사물의 색을 고르고, 허용량을 정하고, 색조를 돌린 뒤 전체 크기로 내보내세요.',
      },
    },
    'color-pop': {
      name: '컬러 팝',
      h1: '한 가지 색만 남기고 사진을 흑백으로 만들기',
      tagline: '빨강이든 파랑이든 여섯 가지 색 계열 중 하나만 남기고 나머지를 회색으로 바꿔요. 기본 제공 룩 하나로 간단히 적용하고 나중에 조정할 수 있어요.',
      metaTitle: '한 가지 색만 남기고 사진을 흑백으로 만들기 | Media Manipulator',
      metaDescription: '브라우저에서 선택적 색상 효과: 빨강, 노랑, 초록, 청록, 파랑, 자홍 중 하나만 남기고 나머지는 채도를 낮춰요. 기본 제공 룩 여섯 가지, 범위별 조절, 전체 해상도 내보내기.',
      ogTitle: '한 가지 색만 남긴 흑백 사진 | Media Manipulator',
      ogDescription: '컬러 팝 룩은 여섯 색조 범위 중 다섯 범위의 채도를 빼고 남긴 범위는 살짝 강조해요. 남긴 범위의 폭을 조정하고, 마스크를 추가하고, 내보내세요.',
      intro: '이 페이지에서는 Media Manipulator의 사진 편집기 Aperture가 색상(HSL) 패널을 앞에 띄우고 컬러 팝: 빨강 룩을 이미 적용한 채로 열려요. 룩은 조정 내용을 하나의 그룹으로 스택에 추가하는데, 이 룩은 색상(HSL) 레이어 하나예요. 여섯 범위 중 빨강은 채도 +10, 노랑, 초록, 청록, 파랑, 자홍은 각각 채도 -100으로 설정되어 있어요. 결과는 고전적인 선택적 색상 사진이에요. 한 색 계열만 살아남고 나머지는 모두 회색으로 바뀌어요. 자매 룩 다섯 개는 노랑, 초록, 청록, 파랑 또는 자홍을 대신 남기고, 패널의 이 색 제외 회색 칩을 누르면 어떤 범위든 클릭 한 번으로 같은 효과를 낼 수 있어요. 스포이트로 고른 사용자 지정 범위도 마찬가지예요.',
      whatItDoes: [
        '열 때 컬러 팝: 빨강을 적용해요. 빨강 채도 +10, 나머지 다섯 범위는 채도 -100인 색상(HSL) 레이어 하나예요. 다른 색 계열을 위해 룩 패널에는 컬러 팝: 노랑, 초록, 청록, 파랑, 자홍이 있어요.',
        '사용자 지정 스포이트 범위를 포함해 어떤 범위든 옆의 이 색 제외 회색 칩을 누르면 다른 모든 범위의 채도가 한 번에 -100이 돼요. 그래서 특정한 주황이나 보라도 남길 색으로 정할 수 있어요.',
        '남긴 범위마다 폭(10~120도)과 페더(0~90) 슬라이더가 있어서 이웃한 색조를 얼마나 살릴지 정해요. 주황을 빨강과 함께 남기거나 제외하는 것도 이 슬라이더로 해요.',
        '중립색 감쇠 덕분에 회색은 그대로 남고, 남긴 범위는 자체 색조와 명도 슬라이더로 미세 조정할 수 있으며, 룩 전체에 마스크를 씌우거나 불투명도를 낮추거나 실행 취소 한 번으로 제거할 수 있어요.',
        '내보내기는 같은 여섯 범위 공식으로 원본을 전체 해상도로 렌더링하고 파일 이름에 (retouched)를 붙여요.',
      ],
      flowSteps: [
        {
          title: '사진 끌어다 놓기',
          description: '편집기가 전체 화면으로 색상(HSL) 패널을 열고, 컬러 팝: 빨강을 레이어 하나짜리 그룹으로 적용해요.',
        },
        {
          title: '남길 색 고르기',
          description: '룩에서 컬러 팝: 파랑, 초록, 노랑, 청록 또는 자홍으로 바꾸거나, 사진에서 고른 범위를 포함해 아무 범위에서나 이 색 제외 회색을 누르세요.',
        },
        {
          title: '남긴 범위 넓히기 또는 좁히기',
          description: '폭을 올리면 이웃한 색조까지 포함되고, 내리면 한 색만 골라내요. 무엇이 살아남았는지는 마스크 오버레이나 히스토그램으로 확인하세요.',
        },
        {
          title: '내보내기',
          description: '원하는 품질의 JPG, PNG, WebP, AVIF 또는 TIFF로, 서버가 원본 픽셀에서 렌더링해요.',
        },
      ],
      advancedDetails: [
        '픽셀별 채도는 s에 범위마다 구한 1 + 가중치 x 채도/100을 모두 곱한 값이에요. -100인 범위 안에서는 계수가 1 - 가중치이므로, 파랑 범위 안에 완전히 들어간 픽셀은 계수 0을 받아 회색이 돼요. +10인 남긴 빨강 범위 안에서는 계수가 1.1이라 채도가 십 퍼센트 올라가요. 룩은 색조와 명도를 절대 바꾸지 않아요.',
        '범위 가중치는 기본값인 폭 30, 페더 30에서 범위 중심까지의 원형 거리로 정해져요. 15도 이하면 온전히 적용되고, 45도 이상이면 전혀 적용되지 않으며, 그 사이는 직선으로 바뀌어요. 색조 30인 주황처럼 두 범위의 정확히 중간에 있는 픽셀은 양쪽에서 가중치 0.5를 받으므로, 빨강을 남기면 채도에 1.05 x 0.5 = 0.525가 곱해져요.',
        '채도를 뺀 두 범위 사이에서는 두 계수의 곱이 중요해요. 청록과 파랑의 중간인 색조 210에서는 가중치가 각각 0.5이고 채도 계수는 0이 아니라 0.5 x 0.5 = 0.25예요. 그래서 그 색조의 하늘은 색의 사분의 일이 남아요. 두 범위의 폭을 60으로 올리면 두 범위의 중심부가 210에서 만나 계수가 0으로 떨어져요.',
        '모든 범위 가중치에는 min(1, s / 0.1)이 곱해지므로, HSL 채도가 0.1 미만인 픽셀은 남긴 범위에서도 그만큼 비례해서 덜 올라가요. 이미 거의 회색이라 -100 범위가 뺄 것도 별로 없어요.',
        '룩은 프로젝트에 일반 레이어 그룹으로 저장돼요. 룩은 기존 편집 위에 더해지고, 실행 취소하면 그룹 전체가 제거되며, 직접 만든 변형은 이 브라우저에 프리셋으로 저장하거나 JSON으로 내보낼 수 있어요.',
        '화면에는 1920 px 사본을 WebGL2로 렌더링한 결과가 보이고, 내보내는 파일은 저희 서버가 같은 범위 계산으로 원본에서 만들어요. 두 결과는 색상 연산에 대해 문서화된 허용 오차, 즉 8비트 기준 평균 오차 1 이하, 최대 4단계 안에서 일치해요.',
      ],
      whyItMatters: [
        '선택적 색상은 회색 거리의 빨간 우산이나 돌담 속 파란 문처럼 한 요소로 시선을 끌어요. 칠한 마스크가 아니라 원래 음영을 그대로 살린 채로요.',
        '손으로 칠하지 않고 색조 범위로 처리하므로, 브러시로는 놓치기 쉬운 반사와 작은 디테일까지 화면 속 빨간 사물을 전부 잡아내요.',
        '남길 범위가 매개변수라서, 로그인한 요금제에서는 다른 사진에도 적용으로 같은 룩을 사진 묶음 전체에 다시 쓸 수 있어요.',
      ],
      useCases: [
        {
          title: '거리 사진의 포인트 색',
          description: '흑백 거리 풍경에서 코트, 버스, 간판의 빨강을 남기세요. 빨강 범위가 한 번에 모두 잡아내요.',
        },
        {
          title: '회색 배경 속 제품',
          description: '제품의 브랜드 색은 남기고, 주변의 세트, 손, 소품은 회색으로 바꾸세요.',
        },
        {
          title: '결혼식과 행사의 디테일',
          description: '회색 공간에서 꽃이나 드레스 색을 남기세요. 카펫도 같은 색조라면 룩에 마스크를 씌워 테이블로만 제한하세요.',
        },
        {
          title: '문, 배, 자동차',
          description: '칠한 사물 하나에는 컬러 팝: 파랑이나 컬러 팝: 노랑을 쓰세요. 그늘에서 페인트 색이 청록이나 주황 쪽으로 기운다면 남긴 범위를 넓히세요.',
        },
      ],
      workedExamples: [
        {
          title: '회색 거리의 빨간 우산: 12 MP 휴대폰 JPEG에 컬러 팝: 빨강',
          body: '4032 x 3024 JPEG(12.2메가픽셀, 3.9 MB)예요. 우산 픽셀 (204, 51, 51)은 색조 0, HSL 채도 0.6이에요. 빨강 범위 안에 완전히 들어가므로 채도가 0.6 x 1.1 = 0.66이 되고, (212, 43, 43)으로 내보내져요. 색조 230인 파란 코트 (51, 77, 204)는 파랑 범위 안에 완전히 들어가므로 0.6 x 0 = 0이 되고, 명도는 이전과 같은 0.5인 (128, 128, 128)로 내보내져요. 색조 210인 하늘 (140, 191, 242)는 청록에서 0.5, 파랑에서 0.5의 가중치를 받으므로 채도 0.8이 0.8 x 0.5 x 0.5 = 0.2가 되고, 옅은 파랑인 (179, 191, 204)로 내보내져요. 두 폭을 60으로 올리면 완전한 회색이 돼요. 색조 30인 주황색 가게 전면 (230, 128, 26)은 0.8 x 1.05 x 0.5 = 0.42가 남아 (181, 128, 74)로 내보내져요. 품질 92의 JPG로 내보내면 약 5.5 MB이고, 일반 작업 한 번이에요.',
        },
        {
          title: '돌담 속 파란 문: 24 MP 카메라 JPEG에 컬러 팝: 파랑',
          body: '6000 x 4000 파일(24메가픽셀, 12 MB)이에요. 컬러 팝: 파랑으로 바꾸면 파랑 채도는 +10, 나머지 다섯 범위는 -100이 돼요. 문 (51, 77, 204)는 (43, 71, 212)가 되고, 빨간 자전거 (204, 51, 51)은 (128, 128, 128)로 회색이 되며, 하늘 (140, 191, 242)는 청록과 공유하는 경계 덕분에 채도의 0.8 x 0.5 x 1.05 = 0.42가 남아 (164, 191, 218)로 내보내져요. 돌담 (133, 128, 122)는 채도가 0.04로 중립색 기준값 0.1보다 낮으므로 모든 범위 가중치에 0.4가 곱해지고, 어느 쪽으로든 많아야 한두 단계만 움직여요. 24메가픽셀 전체를 내보내려면 Premium이나 Pro가 필요해요. 계정이 없으면 대화상자의 최대 크기가 12로 제한되고, 품질 92의 24메가픽셀 JPG는 약 10.8 MB예요.',
        },
      ],
      whenNotToUse: '선택적 색상은 어디에 있든 같은 색조를 남기므로, 두 사물이 같은 색인데 하나만 색을 남겨야 한다면 범위를 넓히거나 좁히는 대신 룩에 브러시나 방사형 마스크를 씌우거나 피사체 선택을 쓰세요. 깔끔한 단색을 얻는 방법도 아니에요. +10인 남긴 범위 하나와 -100인 범위 다섯 개로는 경계 부분에 사분의 일 강도의 색이 남거든요. 그럴 때는 흑백 페이지를 쓰세요. 모든 색을 더 강하게 또는 더 부드럽게 만들고 싶다면 채도 페이지에서 슬라이더 하나로 할 수 있고, 남긴 색을 그대로 두는 대신 바꾸고 싶다면 사물 색상 페이지로 가세요.',
      whyMediaManipulator: [
        'Aperture에는 컬러 팝 룩 여섯 개와 어떤 사용자 지정 범위에도 쓸 수 있는 이 색 제외 회색 칩이 있어서, 남길 색이 여섯 가지 이름에 갇히지 않아요.',
        '남긴 범위에는 폭과 페더가 있고, 마스크로 효과를 사물 하나에 가둘 수 있으며, 룩은 레이어이므로 전부 아니면 전무 대신 60%로 낮춰 부분적인 효과를 낼 수도 있어요.',
        '룩 적용, 조정, 실행 취소는 무료예요. 완성한 사진을 내보낼 때 일반 작업 한 번이 계산되고, 일일 횟수는 요금 페이지에 나와 있어요.',
      ],
      privacyNote: '컬러 팝: 빨강 적용과 남길 범위 변경은 모두 브라우저 안에서 이루어지고, 룩 때문에 사진이 어디로 전송되는 일은 없어요. 로그인하지 않으면 프로젝트는 이 브라우저의 IndexedDB에 보관되고, 내보내기, 피사체 선택, 복구를 할 때만 일반적인 비회원 작업으로 업로드돼요. 로그인하면 원본과 1920 px 미리보기, 썸네일이 보관 기간 설정에 따라 프로젝트나 계정을 삭제할 때까지 저희 서버에 남아요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 외부의 누구도 사진을 보지 않아요.',
      faq: [
        {
          question: '어떤 색을 남길 수 있나요?',
          answer: '컬러 팝 룩으로 이름 붙은 여섯 범위인 빨강, 노랑, 초록, 청록, 파랑, 자홍 중 어느 것이든 남길 수 있어요. 그 밖의 색조는 스포이트로 사진에서 클릭한 뒤 새로 생긴 사용자 지정 범위에서 이 색 제외 회색을 누르면 돼요.',
        },
        {
          question: '컬러 팝: 빨강을 적용했는데 하늘이 왜 아직 살짝 파란가요?',
          answer: '색조 210인 하늘은 청록과 파랑의 정확히 중간에 있어서 각 범위에서 가중치 0.5를 받고, -100인 두 계수를 곱하면 0.25가 되어 채도의 사분의 일이 남아요. 두 범위의 폭을 60으로 올리면 중심부가 210에서 겹쳐 계수가 완전히 없어져요.',
        },
        {
          question: '빨강을 남기면 얼굴에도 왜 색이 남나요?',
          answer: '피부는 빨강 범위 안인 색조 20 부근에 있으므로, 룩이 설계상 피부도 남겨요. (217, 158, 128) 픽셀은 채도의 약 11%만 잃어요. 피부를 회색으로 만들고 싶다면 빨강의 폭을 좁히거나, 얼굴 위에 빼기로 설정한 브러시 마스크를 추가하세요.',
        },
        {
          question: '두 가지 색을 함께 남길 수 있나요?',
          answer: '네. 룩은 일반 색상(HSL) 레이어이므로, 적용한 뒤 노랑 같은 두 번째 범위를 -100에서 0으로 되돌리세요. 또는 사용자 지정 범위에서 이 색 제외 회색을 누른 다음 함께 남기고 싶은 이름 붙은 범위를 원래대로 되돌리세요.',
        },
        {
          question: '내보낸 뒤에도 효과를 되돌릴 수 있나요?',
          answer: '내보내기는 이름에 (retouched)가 붙은 새 파일을 만들고, 원본은 절대 바뀌지 않아요. 프로젝트 안에서 룩은 레이어 그룹이므로 실행 취소하면 제거되고, 레이어는 언제든 숨기거나 삭제할 수 있어요.',
        },
        {
          question: '남긴 범위의 +10은 어떤 역할을 하나요?',
          answer: '남긴 범위 안에 완전히 들어간 픽셀의 채도에 1.1을 곱해서, 살아남은 색이 주변 회색보다 조금 더 강하게 보이도록 해요. 찍힌 그대로의 색을 원한다면 0으로 되돌리세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '룩은 픽셀 단위 HSL 계산으로 된 레이어 하나예요. 내보내기 시간은 인코더와 픽셀 수가 정하며, 12메가픽셀 JPG라면 몇 초면 돼요.',
          '페이지를 통해 적용된 룩은 다른 레이어처럼 이름을 바꾸거나, 마스크를 씌우거나, 삭제할 수 있는 레이어 그룹이에요.',
        ],
      },
      related: [
        {
          label: '흑백 사진',
          to: '/tools/black-and-white-photo',
          description: '아무 색도 남기지 않을 때 쓰는, 채널 슬라이더 여섯 개를 갖춘 완전한 단색 변환이에요.',
        },
        {
          label: '이미지 채도',
          to: '/tools/image-saturation',
          description: '범위별 선택 없이 모든 색의 활기와 채도를 조절해요.',
        },
        {
          label: '사물 색상 바꾸기',
          to: '/tools/change-image-color',
          description: '남긴 사물을 찍힌 그대로 두지 않고 색을 바꿔요.',
        },
        {
          label: '색상으로 선택',
          to: '/tools/select-by-color',
          description: '다른 조정을 한 색조로 제한하고 싶을 때 쓰는 색상 범위 마스크예요.',
        },
        {
          label: '비네팅 추가',
          to: '/tools/add-vignette',
          description: '모서리를 어둡게 해서 남긴 색으로 시선을 더 모아요.',
        },
      ],
      embed: {
        title: '한 가지 색만 남기고 나머지는 회색으로',
        description: '사진을 끌어다 놓으면 컬러 팝: 빨강 룩이 적용된 채로 Aperture가 열려요. 남길 색은 룩에서 바꾸거나 이 색 제외 회색으로 바꾸세요.',
      },
    },
    'image-saturation': {
      name: '이미지 채도',
      h1: '온라인에서 이미지 채도 높이기·낮추기',
      tagline: '활기는 피부와 이미 강한 색을 보호하면서 색을 살려 주고, 채도는 전체를 균일하게 조절해요. 둘 다 마스크를 씌울 수 있는 레이어예요.',
      metaTitle: '이미지 채도를 온라인으로 높이거나 낮추기 | Aperture',
      metaDescription: '사진의 채도를 브라우저에서 바꾸세요. 활기는 칙칙한 색을 살리면서 피부를 보호하고, 채도는 모든 색을 고르게 조절해요. 전체 해상도로 내보내요.',
      ogTitle: '온라인에서 이미지 채도 높이기·낮추기',
      ogDescription: '활기와 채도의 차이를 공식과 실제 숫자로 설명해요. 내 GPU에서 실시간으로 미리 보고, 전체 해상도로 내보내세요.',
      intro: '채도는 같은 밝기에서 색이 회색으로부터 얼마나 떨어져 있는지를 나타내요. Aperture 기본 패널의 색상 그룹에는 채도를 다루는 슬라이더가 두 개 있고, 둘의 차이가 바로 이 페이지의 핵심이에요. 채도는 모든 픽셀이 자기 루마에서 떨어진 거리에 같은 배율 1 + saturation / 100을 곱해요. 그래서 +50은 옅은 파스텔과 네온사인을 같은 비율로 밀어내고, 네온이 먼저 클리핑돼요. 활기는 그 거리에 색의 채도가 높을수록 작아지는 배율 1 + v × (1 - range)를 곱해요. 여기서 range는 가장 큰 채널과 가장 작은 채널의 차이예요. 따라서 칙칙한 색은 많이, 강한 색은 조금 움직이고, 중립 회색은 전혀 움직이지 않아요. 한 레이어 안에서 활기가 먼저, 채도가 그다음에 적용되며, 이 레이어는 색상 범위나 피사체로 마스크를 씌울 수 있어요.',
      whatItDoes: [
        '활기 -100~+100: 채도를 고려해 색을 살리거나 줄여요. 양수 값에서 배율은 1 + v × (1 - range)이므로, 채널 범위가 0.08인 칙칙한 색은 거의 최대치를 받고, 범위가 0.63인 선명한 색은 그 삼분의 일 정도만 받아요.',
        '채도 -100~+100: 모든 채널이 픽셀의 BT.709 루마에서 배율 1 + saturation / 100만큼 멀어지거나 가까워져요. -100은 가중치 0.2126, 0.7152, 0.0722를 쓰는 완벽한 회색 변환이에요.',
        '두 슬라이더는 활기/채도 레이어 하나에 들어 있어서, 불투명도, 혼합 모드, 마스크도 둘이 함께 하나씩 써요. 각각 다른 마스크를 쓰고 싶다면 레이어를 하나 더 추가하세요.',
        '피부 보호는 활기 공식에서 저절로 따라와요. 일반적인 피부 톤은 채널 범위가 0.3 근처라서, 활기 +50은 같은 값이 회색에 가까운 색에 주는 채도 증가의 약 70%를 피부 톤에 줘요.',
        '특정 색만 다루고 싶다면 이 페이지에서 안내하는 색상(HSL) 패널을 쓰세요. 여섯 가지 색조 범위마다 폭과 페더가 있는 채도 슬라이더가 따로 있어요.',
      ],
      flowSteps: [
        {
          title: '이미지 열기',
          description: '파일을 끌어다 놓으세요. 색상 그룹에 활기와 채도가 0으로 표시되고, 히스토그램에는 RGB 채널이 나타나요.',
        },
        {
          title: '활기부터 시작',
          description: '+40이나 +60까지 올려 보세요. 나뭇잎, 물, 천처럼 칙칙한 부분이 먼저 살아나고, 얼굴과 이미 선명한 색은 거의 변하지 않아요.',
        },
        {
          title: '채도 더하거나 빼기',
          description: '활기로 색의 균형을 잡은 뒤, 채도를 조금만 바꿔(+10~+20, 차분한 느낌을 원하면 -20~-40) 전체 수준을 정하세요.',
        },
        {
          title: '필요하면 마스크를 씌우고 내보내기',
          description: '특정 영역에 변화가 가지 않도록 레이어에 색상 범위나 피사체 선택 마스크를 씌운 뒤 전체 해상도로 내보내세요.',
        },
      ],
      advancedDetails: [
        '활기: range = max(R, G, B) - min(R, G, B), l = 픽셀의 활기용 루마(가중치는 빨강 0.072, 초록 0.715, 파랑 0.213으로, 바탕이 되는 필터가 쓰는 순서예요), v = vibrance / 100일 때 배율 f = 1 + v × (1 - sign(v) × range)예요. 각 채널은 l + (채널 - l) × f가 되고, 범위 안으로 제한돼요.',
        '채도: l = BT.709 루마(0.2126, 0.7152, 0.0722)이고, 각 채널은 l + (채널 - l) × (1 + saturation / 100)이 되며 범위 안으로 제한돼요. -100에서는 모든 채널이 l과 같아지므로, 루마 가중 흑백 변환과 같은 회색이 나와요.',
        '부호 항 때문에 음수 활기는 채도가 높은 색에 더 강하게 작용해요. -40에서 네온 핑크 255, 40, 180(범위 0.84)은 배율이 0.26이라 130, 73, 110으로 떨어지지만, 나무 갈색 160, 120, 80(범위 0.31)은 배율이 0.47이라 136, 117, 98로만 내려가요.',
        '어느 슬라이더도 중립 픽셀은 바꾸지 않아요. R = G = B이면 루마로부터의 거리가 0이고 어떤 배율을 곱해도 0이므로, 회색, 검정, 흰색은 어떤 설정에서도 그대로예요.',
        '편집하는 동안 미리보기는 사진의 1920 px 사본으로 내 GPU(WebGL2)에서 그려지고, 내보낼 때는 같은 공식으로 저희 서버에서 원본을 전체 해상도로 렌더링해요. 두 결과는 문서화된 작은 허용 오차, 많아야 8비트 기준 몇 단계 안에서 일치하며 그레인은 정확히 같아요. 활기와 채도는 픽셀 단위 연산이라 실제로는 단계까지 일치해요.',
        '두 단계 모두 결과를 0~1로 제한하므로, 강한 색을 크게 올리면 한 채널이 클리핑되어 색조가 살짝 틀어져요. 레이어 혼합을 색상으로 바꾸면 원래 루마는 유지하고 크로마만 움직이므로 이런 틀어짐이 줄어들어요.',
      ],
      whyItMatters: [
        '채도 슬라이더 하나로는 햇볕에 탄 얼굴과 회색 벽을 똑같이 다뤄요. 요즘 편집기가 풍경의 색을 살리면서도 사진 속 사람을 주황색으로 만들지 않을 수 있는 것은 활기 덕분이에요.',
        '채도를 낮추는 것도 하나의 스타일이에요. 채도 -40(모든 것이 밋밋해짐)과 활기 -40(강한 색은 누그러지고 칙칙한 색은 유지됨)의 차이는 바랜 인화물과 절제된 인화물의 차이예요.',
        '회색은 움직이지 않는다는 것을 알면, 배경이 중립색인 제품 사진에서 활기를 세게 올려도 배경은 정확히 그대로라는 것을 믿고 작업할 수 있어요.',
      ],
      useCases: [
        {
          title: '밋밋한 흐린 날 풍경',
          description: '활기 +60에 채도 +10을 주세요. 70, 110, 50인 나뭇잎과 물은 살아나고, 회색 하늘은 회색으로 남으며, 빨간 재킷을 입은 등산객이 신호등처럼 튀지 않아요.',
        },
        {
          title: '색이 너무 강한 인물 사진',
          description: '활기 -30은 빨간 재킷과 파란 배경을 차분하게 만들고, 채널 범위가 중간 정도인 피부는 따뜻한 느낌을 대부분 유지해요.',
        },
        {
          title: '차분한 필름 룩',
          description: '채도 -35에 빛 그룹의 대비 -20과 스플릿 토닝 레이어를 더하면 프리셋 없이도 바랜 색감이 나와요.',
        },
        {
          title: '흰 배경의 제품',
          description: '피사체 선택 마스크 아래에서 채도 +20을 주면 제품만 살아나요. 흰 배경은 중립색이라 어차피 움직이지 않지만, 마스크가 배경에 진 그림자까지 깔끔하게 지켜 줘요.',
        },
      ],
      workedExamples: [
        {
          title: '24 MP 흐린 날 풍경에 활기 +60',
          body: '6000 x 4000 JPEG(24 MP, 10.1 MB)예요. 130, 120, 110인 칙칙한 땅의 톤은 채널 범위가 0.078이라, 활기 +60이 배율 1.55를 적용해 136, 121, 105로 올려요. 60, 140, 150인 청록색 호수(범위 0.35)는 배율 1.39를 받아 30, 141, 155가 돼요. 200, 40, 40인 채도 높은 빨간 재킷(범위 0.63)은 1.22만 받아 233, 37, 37이 되고, 220, 170, 140인 피부 톤은 242, 171, 129가 돼요. 대신 채도 +35를 주면 같은 땅의 톤은 133, 120, 106으로 움직이지만 재킷은 244, 28, 28까지 밀려나요. 품질 92의 JPG로 내보내면 Premium에서는 약 10.8 MB, 비회원은 12 MP로 줄어 약 5.4 MB예요.',
        },
        {
          title: '12 MP 거리 사진의 채도를 두 가지 방법으로 낮추기',
          body: '4000 x 3000 JPEG(12 MP, 4.5 MB)에 255, 40, 180인 네온 핑크 간판, 160, 120, 80인 나무 문, 90, 150, 230인 파란 자동차가 있어요. 채도 -30을 주면 각각 207, 57, 155, 150, 122, 94, 106, 148, 204가 되어, 모든 색이 회색으로부터의 거리를 30% 잃어요. 대신 활기 -40을 주면 간판은 130, 73, 110(배율 0.26), 문은 136, 117, 98(배율 0.47)이 되고, 자동차는 그 중간이에요. 결과적으로 가장 요란한 색이 가장 많이 누그러져요. 채도 -100이면 세 가지 모두 96, 126, 143의 밋밋한 회색이 돼요. 품질 88의 WebP로 내보내면 약 3.6 MB예요.',
        },
      ],
      whenNotToUse: '이 페이지는 모든 색의 강도를 한꺼번에 바꾸므로, 한 가지 색만 문제일 때는 맞지 않아요. 파랑이 더 필요한 하늘이나 빨강을 줄여야 하는 얼굴은 색조 범위마다 채도가 따로 있는 색상(HSL) 패널에서 다루세요. 한 대상만 남기고 사진을 회색으로 만들고 싶다면 컬러 팝 프리셋이 이미 그 일을 해 줘요. 그리고 색이 약한 게 아니라 틀려 보인다면 화이트 밸런스부터 맞추세요. 색 치우침이 있는 사진의 채도를 올리면 색 치우침만 더 강해져요.',
      whyMediaManipulator: [
        'Aperture는 이 사이트의 Darkroom 동영상 편집기와 같은 활기와 채도 계산을 쓰므로, 사진에서 맞춘 룩이 영상 클립에도 그대로 옮겨져요.',
        '두 슬라이더 모두 스포이트로 고른 색상 범위로 제한할 수 있어서, 다른 패널을 열지 않고도 전체 채도 변경을 색별 변경으로 바꿀 수 있어요.',
        'Media Manipulator는 슬라이더 값마다 만들어지는 배율을 공개하므로, +50은 느낌이 아니라 정해진 양이에요.',
      ],
      privacyNote: '채도를 바꾸면 각 픽셀이 자기 회색 값 쪽으로 가까워지거나 멀어지며, 이 계산은 브라우저가 기기에 있는 사진 사본으로 해요. 비회원이면 내보내기를 하거나 피사체 선택 또는 복구를 누르기 전까지 아무것도 업로드되지 않아요. 내보낼 때 원본이 전체 해상도 렌더링을 위해 저희 서버로 한 번 전송되고, 결과는 다른 작업과 똑같이 보관돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 저희는 이미지를 외부 서비스에 넘기지 않아요.',
      faq: [
        {
          question: '언제 채도 대신 활기를 써야 하나요?',
          answer: '사진에 사람이 있거나 이미 강한 색이 하나 있을 때는 활기를 쓰세요. 활기는 색의 채도가 높을수록 효과가 작아지므로, 채널 범위가 약 0.3인 피부는 칙칙한 회녹색보다 대략 삼분의 일 적게 받아요. 차분한 스타일을 위해 채도를 균일하게 낮출 때처럼 모든 색을 같은 비율로 움직이고 싶다면 채도를 쓰세요.',
        },
        {
          question: '채도 -100이면 제대로 된 흑백이 되나요?',
          answer: 'BT.709 가중치를 쓴 루마 가중 회색이 되고, 무난한 기본값이에요. 각 색이 어떻게 변환될지 직접 정하고 싶다면 흑백 패널이 더 나아요. 여섯 개의 채널 슬라이더는 기본값이 40, 60, 40, 60, 20, 80이고, 변환할 때 파란 하늘을 어둡게 하거나 나뭇잎을 밝게 할 수 있어요.',
        },
        {
          question: '채도를 올리면 강한 색의 색조가 바뀌는 이유는 뭔가요?',
          answer: '결과가 채널마다 0과 1에서 잘리기 때문이에요. 200, 40, 40인 빨강은 채도 +50에서 255, 23, 23이 돼요. 빨강 채널은 상한에 닿았는데 다른 채널은 계속 내려가서 채널 사이의 비율이 바뀐 거예요. 레이어 혼합을 색상으로 바꾸거나 더 작은 값을 쓰면 이를 줄일 수 있어요.',
        },
        {
          question: '회색이나 흰색 부분에 색 치우침이 생기나요?',
          answer: '아니요. 채널 값이 모두 같은 픽셀은 이미 자기 루마와 같은 위치에 있어요. 떨어진 거리가 없으니 어떤 배율을 곱해도 거리는 여전히 없어서, 양쪽 방향 어떤 슬라이더 위치에서도 중립색은 중립색으로 남아요.',
        },
        {
          question: '하늘처럼 한 가지 색만 채도를 올릴 수 있나요?',
          answer: '두 가지 방법이 있어요. 이 레이어에 색상 범위 마스크를 추가하고 스포이트로 하늘을 찍거나, 색상(HSL) 패널을 열어 파랑 범위의 채도만 올리세요. HSL 방식에서는 범위의 폭과 페더도 정할 수 있어요.',
        },
        {
          question: '채도 변경이 전체 크기로 내보낸 파일에도 그대로 보이나요?',
          answer: '네, 똑같이 보여요. 서버가 원본에 같은 두 공식을 픽셀마다 적용하고, 공식에 흐림이나 이웃 픽셀 단계가 없으므로 내보낸 결과가 미리보기와 8비트 기준 한 단계 이내로 일치해요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'JPEG에서 채도를 크게 올리면 빨강과 파랑 가장자리 주변의 크로마 서브샘플링 결함이 두드러져요. PNG나 품질 95 이상의 WebP로 내보내면 결함이 더 늘어나지 않아요.',
          '채도 계산은 이웃 픽셀을 참조하지 않는 픽셀 단위 연산이라, 내보내기 시간은 조정보다 디코딩과 인코딩에 대부분 쓰여요.',
        ],
      },
      related: [
        {
          label: '컬러 팝',
          to: '/tools/color-pop',
          description: '한 가지 색만 남기고 나머지를 모두 회색으로 바꾸는, HSL 패널로 만든 프리셋이에요.',
        },
        {
          label: '사물 색상 바꾸기',
          to: '/tools/change-image-color',
          description: '색상 범위 하나의 강도 대신 색조를 옮겨요.',
        },
        {
          label: '이미지 색조 조정',
          to: '/tools/adjust-image-hue',
          description: '색상(HSL) 패널의 전체 색조 슬라이더와 범위별 색조 이동을 다뤄요.',
        },
        {
          label: '흑백 사진',
          to: '/tools/black-and-white-photo',
          description: '채도 -100이 너무 단조로울 때 쓰는 채널 가중 변환이에요.',
        },
        {
          label: '색상으로 선택',
          to: '/tools/select-by-color',
          description: '이 레이어를 포함한 어떤 레이어든, 허용량 컨트롤로 고른 색에만 적용되게 마스크를 씌우세요.',
        },
      ],
      embed: {
        title: '채도 바꾸기',
        description: '사진을 여기에 끌어다 놓으세요. 기본 패널이 색상 그룹에서 열리고, 활기와 채도가 나란히 표시돼요.',
      },
    },
    'photo-levels': {
      name: '레벨',
      h1: '온라인에서 사진 레벨 조정하기',
      tagline: '실시간 히스토그램을 보면서 채널별로 입력 검정, 입력 흰색, 중간 톤 감마, 출력 범위를 설정하세요.',
      metaTitle: '사진 레벨을 온라인으로 조정: 블랙 포인트, 화이트 포인트, 중간 톤',
      metaDescription: '브라우저에서 레벨: RGB, 빨강, 초록, 파랑의 입력 검정과 흰색 지점, 중간 톤 감마, 출력 한계를 실시간 히스토그램과 함께 조정해요.',
      ogTitle: '온라인에서 사진 레벨 조정하기',
      ogDescription: '레벨 레이어와 히스토그램으로 사진의 톤 범위를 채널별로 늘리거나 압축한 뒤, 원본 픽셀에서 내보내세요.',
      intro: '레벨은 밋밋한 사진을 바로잡는 가장 직접적인 방법이에요. 입력 블랙 포인트를 히스토그램이 시작되는 곳까지 올리고, 입력 화이트 포인트를 히스토그램이 끝나는 곳까지 내리면 사진이 전체 범위를 쓰게 돼요. Aperture는 레벨을 감마 공간 톤 단계의 레이어로 구현하고, RGB, 빨강, 초록, 파랑의 네 채널마다 입력 검정, 입력 흰색, 중간 톤(0.1~10의 감마), 출력 검정, 출력 흰색의 다섯 가지 컨트롤을 제공해요. 세 색상 채널이 먼저 적용되고 RGB 채널이 마지막에 적용되므로, 채널별 색 치우침 보정과 전체 대비 늘리기를 레이어 하나에 담을 수 있어요. 슬라이더 위에는 현재 결과의 히스토그램이 있어 값을 바꿀 때마다 갱신되고, 이 레이어도 다른 레이어처럼 마스크, 불투명도, 혼합 모드를 적용할 수 있어요.',
      whatItDoes: [
        'RGB 마스터 채널과 빨강, 초록, 파랑 채널 각각에 입력 검정, 입력 흰색, 중간 톤, 출력 검정, 출력 흰색이 있는 레벨 레이어를 추가해요.',
        '선택한 입력 범위를 선택한 출력 범위로 늘리고 중간 톤에 감마를 적용하며, 입력 지점 바깥의 값은 양 끝으로 고정해요.',
        '빨강, 초록, 파랑 채널을 먼저 적용하고 RGB 채널을 나중에 적용하므로, 색 치우침 보정과 대비 보정을 한 패널에서 설정할 수 있어요.',
        'RGB와 휘도의 실시간 히스토그램을 그려 주므로, 블랙 포인트와 화이트 포인트를 실제 데이터의 양 끝에 맞출 수 있어요.',
        '보정한 사진을 같은 채널별 매핑으로 원본에서 전체 해상도로 내보내요.',
      ],
      flowSteps: [
        {
          title: '사진 끌어다 놓기',
          description: '레벨 패널과 히스토그램이 앞에 열린 상태로 편집기가 시작돼요.',
        },
        {
          title: '양 끝 지점 설정',
          description: 'RGB 채널에서 입력 검정을 히스토그램이 시작되는 곳으로, 입력 흰색을 히스토그램이 끝나는 곳으로 드래그하세요.',
        },
        {
          title: '색 치우침과 중간 톤 보정',
          description: '빨강, 초록, 파랑 중 하나로 바꿔 그 채널의 양 끝 지점을 옮긴 다음, 중간 톤을 1보다 낮추면 어두워지고 1보다 높이면 밝아져요.',
        },
        {
          title: '내보내기',
          description: '형식, 품질, 크기를 고르세요. 서버가 같은 레벨 값으로 원본을 렌더링해요.',
        },
      ],
      advancedDetails: [
        '채널마다 매핑은 t = clamp((v - inBlack) / (inWhite - inBlack), 0, 1)을 구한 다음 out = clamp(t ^ (1 / gamma) x (outWhite - outBlack) + outBlack, 0, 1)을 계산하는 방식이에요. 입력 폭은 최소 백만분의 일로 제한되므로, 블랙 포인트와 화이트 포인트가 같아도 영으로 나누는 일이 생기지 않아요. 다섯 값은 모두 0..1의 비율이라, 8비트 블랙 포인트 26은 0.102예요.',
        '중간 톤은 감마예요. 1보다 크면 중간이 밝아지고(입력 0.5가 감마 1.2에서 0.5612, 255 중 약 143이 돼요), 1보다 작으면 어두워지며(감마 0.85에서 0.5가 0.4424, 약 113이 돼요), 0과 1은 그대로 유지돼요. 효과 패널의 감마 항목, 노출 섹션의 감마 슬라이더와 같은 거듭제곱 법칙이에요.',
        '레이어 안의 순서는 고정돼 있어요. 빨강, 초록, 파랑이 각자의 다섯 값으로 매핑된 다음, 세 결과 모두에 마스터 매핑이 적용돼요. 그래서 파랑 채널의 중간 톤을 0.85로 두고 마스터에서 범위를 늘리면, 마스터 매핑은 이미 어두워진 파랑을 받아요.',
        '출력 검정을 0보다 높이고 출력 흰색을 1보다 낮추면 범위가 늘어나는 대신 압축되는데, 매트 룩은 이렇게 만들어요. 출력 검정 0.08과 출력 흰색 0.97이면 순수한 검정은 0.08(약 20), 순수한 흰색은 0.97(약 247)이 되고 0.5는 0.525가 돼요.',
        '히스토그램과 미리보기는 내 GPU(WebGL2)가 사진의 1920 px 사본으로 만들어요. 내보내는 파일은 저희 서버가 같은 레벨 공식으로 원본을 전체 해상도로 렌더링하며, 미리보기와 내보내기는 문서화된 작은 허용 오차, 8비트 기준 많아야 몇 단계 이내에서 일치하고 그레인은 정확히 같아요.',
      ],
      whyItMatters: [
        '스캔본, 동영상 화면 캡처, 안개 속에서 찍은 사진은 진짜 검정이나 흰색까지 닿는 경우가 드물어요. 양 끝 지점을 히스토그램에 맞추면 그 사이의 색은 건드리지 않고 대비를 되살릴 수 있어요.',
        '채널별 양 끝 지점은 가장 직접적인 색 치우침 보정 방법이에요. 파랑 채널이 0이 아니라 40에서 시작하는 스캔본은 슬라이더 하나로 고쳐져요.',
        '출력 한계를 쓰면 인쇄용이나 매트 스타일로 페이드를 통제된 방식으로 줄 수 있고, 같은 숫자를 다음 사진에도 그대로 쓸 수 있어요.',
      ],
      useCases: [
        {
          title: '밋밋한 스캔본 살리기',
          description: 'RGB에서 입력 검정 0.1, 입력 흰색 0.9로 두면 히스토그램이 26~230 사이에 있는 스캔본이 전체 범위로 늘어나요.',
        },
        {
          title: '채널 색 치우침 없애기',
          description: '파랑 채널을 열고, 파랑 히스토그램이 빨강과 초록이 시작되는 지점에서 시작할 때까지 입력 검정을 올리세요.',
        },
        {
          title: '매트 필름 룩',
          description: '출력 검정 0.08, 출력 흰색 0.97로 두고, 원한다면 파랑 중간 톤을 약간 낮춰 그림자를 따뜻하게 하세요.',
        },
        {
          title: '인쇄용 이미지 준비',
          description: '출력 검정 0.04, 출력 흰색 0.96이면 톤이 인쇄기가 재현할 수 있는 범위 안에 머물러요.',
        },
      ],
      workedExamples: [
        {
          title: '밋밋한 19.4 MP 스캔본 늘리기',
          body: '히스토그램이 약 26에서 230까지 분포하는 5400 x 3600 JPEG 스캔본(19.4 MP, 7.2 MB)이에요. RGB 채널에서 입력 검정 0.1, 입력 흰색 0.9, 중간 톤 1.2, 출력 검정 0, 출력 흰색 1로 설정해요. 0.3 픽셀은 ((0.3 - 0.1) / 0.8) ^ (1 / 1.2) = 0.315, 약 80이 되고, 0.5 픽셀은 0.5612, 약 143, 0.7 픽셀은 0.7868, 약 201이 되며, 0.1과 0.9는 각각 0과 1이 돼요. 0.1 이하인 값은 모두 검정으로 클리핑돼요. 품질 92의 JPG로 내보내면 19.4 MP 파일이 Premium이나 Pro에서 약 8.7 MB이고, 비회원은 12 MP로 축소되어 약 5.4 MB예요.',
        },
        {
          title: '채널별 파랑 보정과 인쇄용 마스터 설정',
          body: '그림자에 파란 색 치우침이 있는 4000 x 3000 JPEG(12 MP, 4.4 MB)예요. 파랑 채널은 중간 톤 0.85, 나머지는 기본값으로 둬요. RGB 채널은 입력 검정 0.05, 입력 흰색 0.95, 출력 검정 0.04, 출력 흰색 0.96이에요. 중립 회색 0.5는 (0.5, 0.5, 0.4412), 약 (128, 128, 112)가 돼요. 감마가 적용된 건 파랑 채널뿐이고, 마스터 매핑은 0.5를 다시 0.5로 보내기 때문이에요. (0.3, 0.25, 0.2)인 그림자는 (75, 62, 36)이 돼요. 순수한 검정은 0.04(10), 순수한 흰색은 0.96(245)에 놓이는데, 이것이 인쇄물이 재현할 수 있는 출력 범위예요. PNG로 내보내면 약 30 MB, 품질 92의 JPG는 약 5.4 MB예요.',
        },
      ],
      whenNotToUse: '레벨은 톤 커브를 한 군데보다 많이 휘게 할 수 없으므로, S 커브를 만들거나 어두운 중간 톤만 골라 올리려면 커브 패널을 쓰세요. 사진이 밋밋한 게 아니라 노출 부족이라면, 선형 빛에서 작동해 카메라가 했을 방식대로 이미지를 스케일하는 노출 슬라이더가 맞아요. 감마 공간에서 작동하는 레벨은 그렇게 하지 못해요. 조명 때문에 생긴 색 치우침은 화이트 밸런스 슬라이더가 세 채널 대신 값 두 개로 고쳐 주고, 슬라이더 하나로 끝내고 싶다면 대비 조정 페이지가 더 빨라요.',
      whyMediaManipulator: [
        'Aperture는 GPU 미리보기, 내보내기 서버, 휴대폰 앱에서 같은 공식으로 레벨을 적용하고, 지점을 맞출 때 보는 히스토그램은 원본만이 아니라 실제로 렌더링된 결과에서 계산돼요.',
        '레벨은 마스크를 지원하는 최대 64개의 비파괴 레이어 스택에 들어가므로, 휘도 범위로 톤 늘리기를 하늘이나 그림자에만 적용할 수 있어요.',
        '로그인하면 프로젝트가 계정에 저장되고 내보내기는 원본 파일에서 렌더링되므로, 1920 px 미리보기 크기에서 보정한 스캔본도 실제 폭인 5400 px로 내보내져요.',
      ],
      privacyNote: '레벨 슬라이더는 브라우저에서 디코딩된 사진과 결과의 히스토그램을 대상으로 계산돼요. 파일은 내보내기, 피사체 마스크, 복구를 할 때만 업로드되고, 서버는 같은 양 끝 지점과 감마로 원본을 매핑해요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 로그인한 상태라면 원본과 미리보기는 프로젝트를 삭제할 때까지 보관 기간 설정에 따라 유지돼요.',
      faq: [
        {
          question: '레벨과 커브는 어떻게 다른가요?',
          answer: '레벨은 감마로 한 번 휘게 하는 직선형 늘리기로, 채널마다 숫자 다섯 개예요. 커브는 점을 최대 16개까지 찍어 어떤 단조 형태든 만들 수 있어요. 블랙 포인트, 화이트 포인트, 색 치우침에는 레벨이 더 빠르고, 특정 톤 영역의 대비를 다듬을 때는 커브가 맞아요.',
        },
        {
          question: '어떤 채널이 먼저 적용되나요?',
          answer: '빨강, 초록, 파랑이 각자의 다섯 값으로 먼저 적용되고, RGB 마스터 채널은 이미 보정된 채널을 대상으로 마지막에 적용돼요.',
        },
        {
          question: '입력 블랙 포인트보다 어두운 픽셀은 어떻게 되나요?',
          answer: '정규화된 값이 감마 전에 0으로 고정되므로 출력 검정 값으로 클리핑돼요. 히스토그램 왼쪽 끝에 뾰족한 막대로 나타나니, 그 막대가 커지면 입력 검정을 다시 낮추세요.',
        },
        {
          question: '중간 톤은 노출의 감마 슬라이더와 같은 건가요?',
          answer: '계산은 out = in ^ (1 / gamma)라는 같은 거듭제곱 법칙이에요. 하지만 레벨에서는 각 채널의 입력 늘리기와 출력 범위 사이에서 실행되고 채널마다 따로 설정할 수 있는데, 노출의 감마는 그렇게 할 수 없어요.',
        },
        {
          question: '슬라이더 값을 8비트 숫자로 읽을 수 있나요?',
          answer: '슬라이더는 0~1 범위예요. 255를 곱하면 익숙한 0-255 값이 돼요. 입력 검정 0.1은 26단계, 입력 흰색 0.9는 230단계예요.',
        },
        {
          question: '레벨로 범위를 늘리면 밴딩이 생기나요?',
          answer: '8비트 원본을 늘리면 값 사이의 간격이 벌어지므로, 밋밋한 JPEG를 크게 늘리면 부드러운 그라데이션에 단계가 보일 수 있어요. 늘리는 정도를 적당히 하거나, 압축 때문에 단계가 더 심해지지 않도록 PNG로 내보내세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '히스토그램은 렌더링된 미리보기에서 계산돼요. 8비트 원본을 크게 늘리면 히스토그램에 빈틈이 드러날 수 있어요.',
          'TIFF와 BMP 스캔본은 편집 가능한 미리보기를 위해 계정이 필요하고, 12메가픽셀을 넘는 내보내기에는 Premium이나 Pro가 필요해요.',
        ],
      },
      related: [
        {
          label: '커브',
          to: '/tools/photo-curves',
          description: '채널마다 최대 16개의 점으로 톤을 자유롭게 다듬어요.',
        },
        {
          label: '대비 조정',
          to: '/tools/adjust-image-contrast',
          description: '양 끝 지점이 이미 괜찮을 때 쓰는 대비 슬라이더 하나예요.',
        },
        {
          label: '노출 보정',
          to: '/tools/fix-photo-exposure',
          description: '노출이 부족한 사진을 위해 선형 빛에서 EV, 오프셋, 감마를 조정해요.',
        },
        {
          label: '화이트 밸런스',
          to: '/tools/white-balance-photo',
          description: '스캔이 아니라 빛 때문에 생긴 색 치우침에는 색온도와 색조를 쓰세요.',
        },
        {
          label: '색상 반전',
          to: '/tools/invert-image-colors',
          description: '네거티브를 먼저 반전한 다음, 채널별 레벨로 필름 베이스 색을 걷어 내세요.',
        },
        {
          label: 'Aperture 튜토리얼',
          to: '/tutorials/aperture',
          description: '레이어, 히스토그램, 내보내기를 차근차근 안내해요.',
        },
      ],
      embed: {
        title: '사진 레벨 조정하기',
        description: '사진을 끌어다 놓으면 히스토그램과 함께 레벨 패널이 열려요. 블랙 포인트, 화이트 포인트, 중간 톤 지점을 설정한 뒤 내보내세요.',
      },
    },
    'photo-curves': {
      name: '커브',
      h1: '온라인 사진 커브 도구',
      tagline: 'RGB와 각 채널의 드래그 가능한 커브로 톤과 색을 다듬으세요. 최대 16개의 점과 스포이트를 지원해요.',
      metaTitle: '온라인 사진 커브 도구: 브라우저에서 RGB 및 채널별 커브',
      metaDescription: '브라우저에서 커브: RGB, 빨강, 초록, 파랑 커브에서 최대 16개의 점을 드래그하고, 스포이트로 톤을 고른 뒤 전체 해상도로 내보내세요.',
      ogTitle: '온라인 사진 커브 도구',
      ogDescription: '제대로 된 커브 패널이에요. 찍은 점을 지나는 단조 삼차 곡선, 채널별 조정, 스포이트, 히스토그램, 원본에서의 전체 크기 내보내기를 지원해요.',
      intro: '커브는 직접 그린 선을 따라 모든 입력 톤을 출력 톤에 대응시켜요. 어떤 편집기에서든 가장 유연한 톤과 색 도구예요. Aperture는 RGB, 빨강, 초록, 파랑의 네 가지 커브를 제공하고, 커브마다 드래그할 수 있는 점을 2~16개 둘 수 있어요. 사진에서 점 선택 스포이트를 쓰면 사진에서 커서 아래에 있는 값의 위치에 점이 추가돼요. 점을 잇는 커브는 단조 삼차 곡선이라 점 사이에서 넘치거나 방향이 뒤집히지 않고, 256개 항목의 표로 샘플링되어 GPU와 내보내기 서버가 모두 선형 보간으로 읽어요. 레이어 스택의 감마 공간 톤 단계에서 세 색상 커브가 먼저, RGB 커브가 마지막에 적용되며, 실시간 히스토그램 아래에서 작업하고 레이어에는 늘 쓰던 마스크, 불투명도, 혼합 모드 컨트롤이 있어요.',
      whatItDoes: [
        'RGB, 빨강, 초록, 파랑의 그래프 네 개가 있는 커브 레이어를 추가해요. 그래프에서 점을 드래그하고, 커브마다 최대 16개까지 추가하고, 양 끝을 제외한 어떤 점이든 제거할 수 있어요.',
        '점들을 지나는 단조 삼차 에르미트 곡선을 맞추므로, S 커브는 부드럽게 유지되고 가파른 단계에서도 방향이 뒤집히지 않아요.',
        '각 커브를 256개 항목으로 샘플링하고, 색상 커브를 먼저 적용한 다음 그 결과에 RGB 커브를 적용해요.',
        '스포이트로 사진에서 점을 골라, 특정 피부 톤이나 하늘 값을 그래프 위의 조절점으로 만들어요.',
        '결과를 실시간 히스토그램에 보여 주고, 원본에서 전체 해상도로 내보내요.',
      ],
      flowSteps: [
        {
          title: '사진 끌어다 놓기',
          description: '커브 패널과 RGB 그래프가 앞에 열린 상태로 편집기가 시작돼요.',
        },
        {
          title: '점 찍기',
          description: '그래프를 클릭하거나 사진에 스포이트를 써서 점을 추가한 다음, 드래그해 커브 모양을 만드세요.',
        },
        {
          title: '채널별로 작업',
          description: '빨강, 초록, 파랑 중 하나로 바꿔 색 치우침을 바로잡거나, 반대 방향의 커브로 색 보정을 더하세요.',
        },
        {
          title: '내보내기',
          description: '형식과 크기를 고르세요. 서버가 같은 표를 만들어 원본을 렌더링해요.',
        },
      ],
      advancedDetails: [
        '점의 x 값은 0에서 1까지 엄격하게 증가해야 해요. 점에서의 기울기는 Fritsch-Carlson 방법을 써요. 이웃한 점 사이의 할선 기울기 d를 구하고, 양 끝의 기울기는 첫 번째 또는 마지막 할선과 같게, 안쪽 기울기는 두 할선의 평균(할선의 부호가 바뀌는 곳에서는 0)으로 둬요. 할선에 대한 비율의 제곱이 9를 넘는 기울기 쌍은 다시 줄여서 구간이 넘치지 않게 해요.',
        '각 커브는 삼차 에르미트 기저(2t 세제곱 - 3t 제곱 + 1, t 세제곱 - 2t 제곱 + t, 그리고 그 보완 함수들)를 사용해 x = i / 255인 256개 값에서 샘플링되고, 0..1로 고정돼요. 첫 번째 점보다 앞의 x는 첫 점의 y를, 마지막 점보다 뒤의 x는 마지막 점의 y를 가져요. 그다음 픽셀 값은 가장 가까운 두 항목 사이를 선형 보간해 표에서 읽는데, GPU의 선형 샘플러가 하는 방식과 같아요.',
        '(0.25, 0.2)와 (0.75, 0.8)을 지나는 대칭 S 커브는 0.4를 0.3716으로, 0.6을 0.6284로 바꾸고 0.5는 정확히 0.5로 둬요. 이 커브의 127번과 128번 표 항목은 0.4975와 0.5025이고, 0.5를 샘플링하면 그 정중간에 놓여요.',
        '레이어 안의 순서는 이래요. 빨강, 초록, 파랑 커브가 각자의 채널을 매핑하고, 그다음 RGB 커브가 세 결과 모두를 매핑해요. 맞춤이 단조이므로 (0.4, 0.1)에서 (0.5, 0.9)로 올라가는 가파른 세 점 단계도 링잉 없이 정확히 1에서 정점에 이르러요. 일반 삼차 스플라인이라면 그 단계 옆에서 1 위로, 0 아래로 넘쳤을 거예요.',
        '커브를 드래그하면서 보는 미리보기는 내 GPU(WebGL2)가 1920 px 사본으로 그려요. 내보내는 파일은 저희 서버가 같은 표와 보간으로 원본을 전체 해상도로 렌더링하며, 두 결과는 문서화된 작은 허용 오차, 8비트 기준 많아야 몇 단계 이내에서 일치해요(그레인은 정확히 같아요).',
      ],
      whyItMatters: [
        'S 커브는 필요한 곳에 대비를 더하면서 양 끝을 지켜 줘요. 중간 회색을 축으로 도는 대비 슬라이더로는 할 수 없는 일이에요.',
        '채널별 커브는 색 보정의 정밀한 형태예요. 파랑을 올린 그림자와 파랑을 내린 밝은 영역은 차가운 그림자와 따뜻한 밝은 영역으로 나누는 전형적인 스플릿 효과인데, 이를 어림잡지 않고 직접 그려서 만들 수 있어요.',
        '스포이트가 그래프를 실제 픽셀과 연결해 주므로, 축의 어디쯤인지 짐작하지 않고 클릭한 톤 자체를 보정할 수 있어요.',
      ],
      useCases: [
        {
          title: '선명한 느낌을 주는 완만한 S 커브',
          description: 'RGB에서 (0.25, 0.2)와 (0.75, 0.8)에 점을 두면, 0.25의 그림자는 약 13단계 내려가고 0.75의 밝은 영역은 같은 만큼 올라가며, 중간 회색은 그대로예요.',
        },
        {
          title: '매트 페이드',
          description: 'RGB의 첫 번째 점을 y = 0.08로 올려 순수한 검정을 255 중 20으로 만들고, (0.3, 0.3)을 추가해 중간 톤을 제자리에 고정하세요.',
        },
        {
          title: '그림자를 차갑게',
          description: '파랑 커브에 (0.25, 0.3)을, 빨강 커브에 (0.25, 0.22)를 추가하세요. 밝은 영역은 중립을 유지한 채 그림자가 파란색 쪽으로 옮겨 가요.',
        },
        {
          title: '특정 톤 보정',
          description: '얼굴에 사진에서 점 선택을 쓴 다음, 그 점을 몇 퍼센트 위나 아래로 드래그하세요. 그 근처의 톤만 움직여요.',
        },
      ],
      workedExamples: [
        {
          title: '24 MP 풍경에 S 커브와 파랑 채널 낮추기',
          body: '6000 x 4000 JPEG(24 MP, 10.2 MB)예요. RGB 커브 점은 (0, 0), (0.25, 0.2), (0.75, 0.8), (1, 1)이고, 파랑 커브 점은 (0, 0), (0.5, 0.45), (1, 1)이에요. (0.35, 0.55, 0.85), 즉 (89, 140, 217)인 하늘 픽셀은 먼저 파랑 커브가 0.85를 0.8729로 매핑하고, 이어서 RGB S 커브가 세 채널을 (0.3104, 0.5648, 0.8729), 즉 (79, 144, 223)으로 매핑해요. 그래서 하늘은 대비가 늘고 중간 톤의 파랑이 조금 줄어요. S 커브만 놓고 보면 0.1은 0.0752(19), 0.4는 0.3716(95), 0.6은 0.6284(160), 0.9는 0.9248(236)이 돼요. 품질 92의 JPG로 내보내면 Premium이나 Pro에서 약 10.8 MB이고, 비회원은 12 MP, 약 5.4 MB예요.',
        },
        {
          title: '12 MP 인물 사진 밝히기와 매트',
          body: '3000 x 4000 JPEG(12 MP, 4.6 MB)예요. 첫 번째 레이어의 RGB 점은 (0, 0), (0.5, 0.6), (1, 1)이에요. 가운데 점 하나를 올리면 0.25는 0.3125(80), 0.5는 0.6(153), 0.75는 0.8125(207), 0.9는 0.9232(235)가 되어, 양 끝은 고정한 채 부드럽게 밝아져요. 두 번째 레이어의 RGB 점은 (0, 0.08), (0.3, 0.3), (1, 1)이에요. 순수한 검정은 0.08(20), 0.1은 0.1504(38)가 되고, 0.3은 0.3 그대로이며, 0.5는 고정한 점 다음에서 단조 맞춤이 평평해지므로 0.4864(124)로 살짝 내려가요. 두 레이어는 각각 따로 실행 취소할 수 있어요. 품질 85의 WebP로 내보내면 약 3.6 MB예요.',
        },
      ],
      whenNotToUse: '사진에 블랙 포인트와 화이트 포인트만 필요하다면 커브는 과해요. 레벨 패널이 슬라이더 두 개와 히스토그램으로 설정해 줘요. 전체 대비나 밝기를 한 번만 바꾸면 되는 경우에도 기본 패널에서 한 번에 처리돼요. 노출 문제는 노출 슬라이더로 다루세요. 노출 슬라이더는 선형 빛에서 작동하지만 커브는 그렇지 않아요. 그리고 보정이 이미 .cube 파일로 있다면, LUT 페이지가 손으로 그린 근사치 대신 그 표를 정확히 적용해 줘요.',
      whyMediaManipulator: [
        'Aperture는 GPU 미리보기, 내보내기 서버, 휴대폰 앱 모두에서 공개된 단조 스플라인과 256개 항목 표를 써요. 그래서 한 번 그린 커브는 Media Manipulator가 보여 주는 어디에서나 똑같이 렌더링돼요.',
        '커브 레이어는 마스크와 함께 쌓을 수 있어서, S 커브를 휘도 범위나 브러시로 칠한 영역에만 적용하거나, 피사체 마스크로 채널별 색 보정을 배경에만 적용할 수 있어요.',
        '커브는 프로젝트 문서에 점 그대로 저장돼요. 그래서 저장한 프로젝트를 나중에도 편집할 수 있고, 내보내기는 미리보기 해상도와 상관없이 이루어져요.',
      ],
      privacyNote: '커브 점은 브라우저에서 조회 표로 바뀌고, 디코딩된 사진에 그 자리에서 적용돼요. 파일은 내보내기, 피사체 선택, 복구를 할 때만 업로드되고, 서버는 원본을 위해 같은 표를 다시 만들어요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 계정이 있으면 원본과 1920 px 미리보기는 프로젝트를 삭제할 때까지 보관 기간 설정에 따라 유지돼요.',
      faq: [
        {
          question: '커브에 점을 몇 개까지 둘 수 있나요?',
          answer: '커브마다 2~16개이고, x 값은 엄격하게 증가해야 해요. 양 끝의 두 점은 위아래로 움직일 수는 있지만 제거할 수는 없고, 그 사이의 점은 드래그하거나 삭제할 수 있어요.',
        },
        {
          question: '커브가 점 사이에서 넘치지 않는 이유는 뭔가요?',
          answer: 'Fritsch-Carlson 단조 삼차 곡선이기 때문이에요. 각 점의 기울기를 제한해서 두 점 사이의 구간이 두 점의 y 값 사이에 머물러요. 가파르게 올라가도 위쪽 점에는 정확히 닿지만, 자유 삼차 스플라인처럼 그 위로 불룩 솟을 수는 없어요.',
        },
        {
          question: 'RGB와 색상 채널 중 어떤 커브가 먼저 적용되나요?',
          answer: '빨강, 초록, 파랑이 각자의 채널에 먼저 적용되고, 그다음 RGB 커브가 세 출력 모두에 적용돼요. 그래서 RGB S 커브는 이미 색 보정된 채널에 대비를 더해요.',
        },
        {
          question: '256개 항목 표는 얼마나 정밀한가요?',
          answer: '표의 각 항목은 i / 255에서 샘플링한 부동소수점 값이고, 두 항목 사이의 픽셀 값은 선형 보간돼요. 그래서 부드러운 커브라면 정확한 스플라인과의 오차가 8비트 한 단계보다 훨씬 작아요.',
        },
        {
          question: '스포이트는 무슨 일을 하나요?',
          answer: '사진에서 점 선택은 커서 아래 값(RGB에서는 휘도, 채널에서는 그 채널의 값)의 x 위치에 현재 커브의 점을 추가해요. y는 x와 같으므로, 드래그하기 전까지는 아무것도 바뀌지 않아요.',
        },
        {
          question: '커브로 색 치우침을 고칠 수 있나요?',
          answer: '네. 각 채널에서 스포이트로 중립 회색을 찾고, 세 출력이 같아질 때까지 생긴 점을 드래그하거나, 부족한 채널의 입력 끝을 올리세요. 조명 때문에 생긴 색 치우침이라면 보통 화이트 밸런스가 더 빨라요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '각 커브는 256개 항목 표가 돼요. 8비트 원본에 가파른 커브를 적용하면 히스토그램에 빈틈이 드러날 수 있으니, 그게 중요하다면 PNG로 내보내세요.',
          'HEIC, HEIF, TIFF, BMP는 편집 가능한 미리보기를 위해 계정이 필요하고, 12메가픽셀을 넘는 내보내기에는 Premium이나 Pro가 필요해요.',
        ],
      },
      related: [
        {
          label: '레벨',
          to: '/tools/photo-levels',
          description: '채널마다 다섯 값으로 양 끝 지점과 감마를 정해 빠르게 늘려요.',
        },
        {
          label: '대비 조정',
          to: '/tools/adjust-image-contrast',
          description: '커브 전체까지는 필요 없을 때 쓰는 슬라이더 하나짜리 버전이에요.',
        },
        {
          label: '스플릿 토닝',
          to: '/tools/split-toning',
          description: '균형 슬라이더가 있는 두 가지 색조로, 반대 방향 색상 커브의 지름길이에요.',
        },
        {
          label: 'LUT 적용',
          to: '/tools/apply-lut-to-photo',
          description: '보정이 이미 .cube 파일로 있다면 3D 표를 불러오세요.',
        },
        {
          label: '색상 균형',
          to: '/tools/color-balance-photo',
          description: '커브를 그리는 대신 광도를 유지하며 세 톤 영역의 RGB를 옮겨요.',
        },
        {
          label: 'Aperture 튜토리얼',
          to: '/tutorials/aperture',
          description: '스택, 마스크, 작업 내역이 어떻게 맞물리는지 알아보세요.',
        },
      ],
      embed: {
        title: '사진 커브 조정하기',
        description: '사진을 끌어다 놓으면 커브 패널이 열려요. RGB나 채널 그래프에서 점을 드래그하고, 스포이트로 톤을 고른 뒤 내보내세요.',
      },
    },
    'white-balance-photo': {
      name: '화이트 밸런스',
      h1: '온라인에서 사진 화이트 밸런스 보정하기',
      tagline: '노랑, 파랑, 초록, 자홍 색 치우침을 선형 빛에서 중간 톤에 작용하는 색온도와 색조 슬라이더로 없애세요.',
      metaTitle: '사진의 화이트 밸런스와 색 치우침을 온라인으로 보정 | Aperture',
      metaDescription: '브라우저에서 색 치우침을 보정하세요. 색온도와 색조 슬라이더가 선형 빛에서 중간 톤을 옮기며, 실시간 미리보기와 전체 해상도 내보내기를 지원해요.',
      ogTitle: '온라인에서 사진 화이트 밸런스 보정하기',
      ogDescription: '선형 빛에서 작동하는 색온도와 색조, 중간 톤에 가중치를 두어 검정과 흰색은 중립으로 유지해요. 실시간 미리보기와 전체 해상도 내보내기를 지원해요.',
      intro: '색 치우침은 카메라가 빛을 잘못 판단했을 때 생겨요. 텅스텐 전구 아래에서는 모든 것이 주황색으로, 그늘에서는 파란색으로, 형광등과 일부 LED 패널 아래에서는 초록색으로 물들어요. Aperture 기본 패널의 화이트 밸런스 그룹에는 이런 치우침을 각각 되돌리는 슬라이더 두 개가 있어요. 색온도는 사진을 파란색(음수)과 호박색(양수) 사이에서 옮기고, 색조는 초록색(음수)과 자홍색(양수) 사이에서 옮겨요. 둘 다 sRGB 디코딩을 거친 선형 빛에서 작동하고 명도에 따라 중간 톤에 가중치를 두므로, 회색 벽과 피부와 식탁보에서는 색 치우침이 걷히고 가장 깊은 그림자와 가장 밝은 흰색은 거의 그대로 남아요. 시작하기 전에 색상(HSL) 패널과 마스크 패널의 스포이트로 중립이어야 할 표면이 실제로 어떤 값인지 확인해 볼 수 있어요.',
      whatItDoes: [
        '색온도 -100~+100: 선형 빛에서 temperature / 100에 중간 톤 가중치를 곱한 값을 빨강 채널에 더하고, 같은 값을 파랑 채널에서 빼요. 음수는 주황빛 텅스텐 사진을 차갑게, 양수는 푸른 그늘 사진을 따뜻하게 만들어요.',
        '색조 -100~+100: tint / 100에 같은 가중치를 곱한 값을 초록 채널에서 빼요. 그래서 양수 값은 형광등의 초록빛 치우침을, 음수 값은 자홍빛 치우침을 없애요.',
        '중간 톤 가중치는 선형 명도가 0.5(sRGB 값으로 약 188)일 때 0.7로 가장 크고, 선형 명도가 0.208(sRGB 126)보다 낮거나 0.792(sRGB 230)보다 높으면 완전히 사라져요. 그래서 깊은 그림자와 흰색에 가까운 부분은 움직이지 않아요.',
        '결과는 다시 sRGB로 인코딩되고 범위를 벗어난 값은 잘려요. 레이어에는 마스크도 씌울 수 있어요. 햇빛이 드는 방에 텅스텐 램프가 하나 있다면 사진 전체를 바꾸는 대신 차갑게 만드는 레이어에 방사형 마스크를 씌우세요.',
        '그림자와 밝은 영역의 색 치우침이 서로 다르다면 이 페이지는 색상 균형 패널로 안내해요. 이 패널에는 그림자, 중간 톤, 밝은 영역마다 빨강, 초록, 파랑 슬라이더가 따로 있어요.',
      ],
      flowSteps: [
        {
          title: '중립색 찾기',
          description: '사진을 열고 종이, 벽, 셔츠처럼 회색이나 흰색이어야 하는 부분을 찾으세요. 그 부분의 채널 값을 보면 색 치우침이 어느 쪽으로 기울었는지 알 수 있어요.',
        },
        {
          title: '색온도 설정',
          description: '그 중립색에서 빨강이 파랑보다 높으면 두 값이 만날 때까지 색온도를 음수 쪽으로, 파랑이 더 높으면 양수 쪽으로 드래그하세요. 150~220 정도의 표면에서는 중간 톤 가중치가 대부분의 일을 해 줘요.',
        },
        {
          title: '색조 설정',
          description: '초록이 여전히 빨강과 파랑보다 높으면 색조를 올리고, 낮으면 내리세요. 보통 10~20 정도의 작은 값이면 충분해요.',
        },
        {
          title: '비교 후 내보내기',
          description: '백슬래시 키를 누르고 있으면 원본과 비교할 수 있어요. 확인했으면 내보내세요. 서버가 같은 선형 빛 이동을 전체 해상도 파일에 적용해요.',
        },
      ],
      advancedDetails: [
        '픽셀마다 R, G, B를 sRGB에서 선형으로 디코딩해요(0.04045 미만이면 v / 12.92, 그 외에는 ((v + 0.055) / 1.055)의 2.4제곱). 명도 l = 선형 채널의 (max + min) / 2. 가중치 w = clamp((l - 0.333) × 4 + 0.5) × clamp((1 - l - 0.333) × 4 + 0.5) × 0.7.',
        '그다음 R += (temperature / 100) × w, G += (-tint / 100) × w, B += (-temperature / 100) × w를 계산하고, 각각 0~1로 잘라 낸 뒤 세 채널을 다시 sRGB로 인코딩해요. Darkroom 동영상 편집기의 중간 톤 색상 균형을 그대로 가져온 거예요.',
        '가중치 값: 선형 명도 0.1에서 0, 0.25에서 0.118, 0.333에서 0.35, 0.5에서 0.7, 0.6에서 0.538, 0.75에서 0.118, 0.9에서 0. sRGB로 보면 효과는 대략 126~230 범위에 한정되고 188 근처에서 가장 강해요.',
        '회색으로 계산한 예: sRGB 회색 188은 색온도 +40에서 229, 188, 130이 되고, -40에서는 130, 188, 229가 돼요. 같은 슬라이더 값을 128 회색에 적용하면 129, 128, 126, 230 회색에 적용하면 230, 230, 229가 돼요. 중간 톤 밖에서는 변화가 작도록 일부러 설계했어요.',
        '같은 188 회색에 색조를 적용하면 +30은 188, 147, 188(초록이 빠져서 픽셀이 자홍빛으로 보여요), -30은 188, 220, 188이 돼요.',
        '미리보기는 1920 px 사본으로 내 GPU(WebGL2)에서 그려지고, 내보내는 파일은 저희 서버가 같은 공식으로 원본을 전체 해상도로 렌더링해요. 두 결과는 문서화된 작은 허용 오차, 많아야 8비트 기준 몇 단계 안에서 일치하고(그레인은 정확히 같아요), 화이트 밸런스는 픽셀 단위 연산이라 단계 하나까지 똑같아요.',
      ],
      whyItMatters: [
        '색 치우침은 보는 사람이 가장 먼저 알아채지만 정작 무엇이 문제인지는 말하기 어려운 부분이에요. 다른 조정보다 먼저 바로잡아야 이어지는 채도, 대비, 커브 작업이 진짜 색 위에서 이루어져요.',
        '빛은 더해지는 방식으로 섞이기 때문에 여기서는 선형 빛에서 작업하는 것이 중요해요. sRGB 값을 그대로 옮기면 같은 색 치우침이라도 어두운 톤과 밝은 톤이 서로 다른 양만큼 움직여요.',
        '중간 톤에 가중치를 두면 검정은 검정으로, 흰색은 흰색으로 남아요. 올바른 화이트 밸런스가 바로 그런 모습이에요. 색 치우침은 양 끝이 아니라 빛을 받은 표면에 있었으니까요.',
      ],
      useCases: [
        {
          title: '전구 아래에서 찍은 주황빛 실내 사진',
          description: '색온도 -35는 210, 170, 120인 벽을 중립에 가까운 177, 170, 168로 바꿔요. 90, 70, 50인 그림자는 명도가 가중치 기준값보다 낮아서 그대로 남아요.',
        },
        {
          title: '그늘이나 눈밭에서 찍은 푸른 사진',
          description: '색온도 +25는 그늘 속 150, 160, 180 회색을 174, 160, 157로 따뜻하게 해요. 200, 210, 235인 눈은 흰색에 가까워 가중치가 이미 줄어드는 구간이라 +50을 줘야 218, 210, 219가 돼요.',
        },
        {
          title: '사무실이나 체육관의 초록빛 조명',
          description: '색조 +15는 185, 200, 180인 벽을 185, 183, 180으로 바꿔요. 빨강과 파랑 채널은 건드리지 않고 형광등의 초록빛만 없애요.',
        },
        {
          title: '혼합광',
          description: '텅스텐 램프 하나가 켜진 햇빛 드는 방이라면 먼저 방 전체를 보정하세요. 그런 다음 램프를 중심으로 한 방사형 마스크를 씌운 두 번째 화이트 밸런스 레이어를 색온도 -40으로 추가하세요.',
        },
      ],
      workedExamples: [
        {
          title: '텅스텐 조명 아래 저녁 식사 사진, 12 MP, 색온도 -35',
          body: '따뜻한 전구 아래에서 찍은 4000 x 3000 JPEG(12 MP, 3.9 MB)예요. 흰 식탁보는 210, 170, 120, 중간 톤은 160, 130, 95, 어두운 구석은 90, 70, 50, 밝은 냅킨은 250, 235, 200이에요. 색온도 -35를 적용하면 식탁보는 177, 170, 168, 중간 톤은 155, 130, 104가 되고, 구석은 90, 70, 50 그대로 남으며(선형 명도가 기준값 0.208보다 낮아요), 냅킨은 247, 235, 204로 조금만 움직여요. 이제 식탁보는 중립에서 9단계 안에 들어와요. 필요하면 색조 +5로 초록을 조금 덜고 자홍을 더할 수 있어요. 품질 92의 JPG로 내보내면 약 5.4 MB이고, 일반 작업 한 번이며, 비회원 한도 안이에요.',
        },
        {
          title: '그늘에서 찍은 푸른 인물 사진, 20 MP, 색온도 +20',
          body: '그늘에서 찍은 5472 x 3648 JPEG(20 MP, 7.4 MB)예요. 회색 재킷은 150, 160, 180, 볼은 190, 165, 160이에요. 색온도 +20을 적용하면 재킷은 170, 160, 162, 볼은 210, 165, 131이 돼요. 재킷은 거의 중립이 되고, 피부는 명도가 가중치 최고점 근처에 있어서 눈에 띄게 따뜻해져요. 얼굴에 너무 강하다면 같은 레이어의 불투명도를 60%로 낮추세요. 결과가 원본 쪽으로 40%만큼 되돌아가요. 품질 90의 WebP로 내보내면 20 MP 파일은 유료 요금제에서 약 6 MB, 12 MP 한도에서는 약 3.6 MB예요.',
        },
      ],
      whenNotToUse: '색온도와 색조는 중간 톤만 움직여요. 그래서 일부 수중 사진의 청록빛 그림자처럼 그림자나 밝은 영역에서 가장 강한 색 치우침에는 행이 따로 나뉜 색상 균형 패널이 필요해요. 색 치우침을 없애는 게 아니라 분위기를 더하는 것이 목적이라면, 바로 그 용도로 만들어졌고 광도도 유지하는 포토 필터와 스플릿 토닝 패널을 쓰세요. 그리고 원본에서 한 채널이 클리핑되어 있다면, 예를 들어 빨간 무대 조명 아래에서 빨강 채널이 255에 붙어 있다면, 정보가 이미 사라졌기 때문에 어떤 화이트 밸런스로도 그 부분을 중립으로 되돌릴 수 없어요.',
      whyMediaManipulator: [
        'Aperture는 여러 간편 필터처럼 이미지 전체에 고르게 색을 입히지 않고, 문서화된 중간 톤 가중치를 써서 선형 빛에서 화이트 밸런스를 적용해요.',
        '레이어에는 브러시, 방사형, 그레이디언트, 휘도, 색상 범위, 피사체 기준으로 마스크를 씌울 수 있어요. 혼합광은 이렇게 해야 제대로 보정돼요.',
        '이 사이트의 Darkroom 동영상 편집기에서도 같은 색온도와 색조 계산이 돌아가므로, 한 촬영에서 나온 사진과 동영상을 숫자로 맞출 수 있어요.',
      ],
      privacyNote: '화이트 밸런스 보정은 선형 빛에서 중간 톤의 빨강, 초록, 파랑을 옮기고, 편집하는 동안 이 작업은 내 그래픽 카드에서 이루어져요. 비회원이라면 내보내기, 피사체 선택, 복구를 하기 전까지 사진이 이 브라우저에 남아요. 내보낼 때는 서버가 전체 해상도의 모든 픽셀에 같은 이동을 반복할 수 있도록 원본을 한 번 업로드하고, 결과는 다른 작업과 똑같이 보관돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 외부와 공유하는 것은 아무것도 없어요.',
      faq: [
        {
          question: '아주 어둡거나 아주 밝은 부분에는 왜 색 치우침이 남나요?',
          answer: '중간 톤 가중치는 선형 명도가 약 0.21보다 낮거나 약 0.79보다 높으면 완전히 사라져요. 색 치우침은 보통 빛을 받은 중간 톤에 있으므로 대개는 이 방식이 맞아요. 색 치우침이 그림자까지 번져 있다면 색상 균형 패널을 쓰세요. 그림자 행에 빨강, 초록, 파랑 슬라이더가 따로 있어요.',
        },
        {
          question: '노란색이나 주황색 치우침은 어느 방향으로 없애나요?',
          answer: '색온도를 음수로 내리세요. 선형 빛에서 빨강을 빼고 파랑을 더하므로, 텅스텐 조명 아래 210, 170, 120인 벽이 -35에서 177, 170, 168이 돼요. 결과가 살짝 초록빛을 띠면 색조를 양수로 몇 포인트 올리세요.',
        },
        {
          question: '자동 화이트 밸런스나 중립색용 스포이트가 있나요?',
          answer: '프리셋 패널의 자동 룩은 출발점이 되는 조정 묶음을 추가하고, 이후에 조정하거나 실행 취소할 수 있어요. 화이트 밸런스 그룹 자체는 슬라이더 두 개뿐이에요. 색상(HSL) 패널과 마스크 패널의 스포이트는 사진에서 색을 읽어 오므로, 중립이라고 생각한 부분에 실제로 어떤 색이 섞여 있는지 확인할 때 유용해요.',
        },
        {
          question: '색온도 값은 어느 정도가 보통인가요?',
          answer: '대부분의 색 치우침에는 15~40 사이예요. 40이면 188 중간 회색이 빨강에서 41단계, 파랑에서 58단계 움직이므로 꽤 강한 보정이에요. 100에 가까운 값은 보정보다는 의도적인 색감 연출용이에요.',
        },
        {
          question: '화이트 밸런스를 바꾸면 밝기도 바뀌나요?',
          answer: '조금 바뀌어요. 한 채널은 올라가고 다른 채널은 같은 선형 양만큼 내려가는데, 빨강과 파랑의 루마 가중치가 서로 다르기 때문이에요. 188 회색을 -40으로 차갑게 하면 130, 188, 229가 되고, 루마는 원본보다 조금 낮아요. 변화는 많아야 몇 단계이고, 원래 끝에 가까웠던 채널이 아니라면 클리핑되지 않아요.',
        },
        {
          question: '하늘과 땅의 색 치우침이 서로 다르면 어떻게 보정하나요?',
          answer: '레이어 두 개로 보정할 수 있어요. 하늘을 덮는 선형 그레이디언트 마스크를 씌운 화이트 밸런스 레이어 하나와 땅을 위한 레이어 하나를 쓰거나, 밝은 영역과 그림자를 따로 다루는 색상 균형 레이어 하나를 쓰세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '화이트 밸런스는 센서의 RAW 데이터가 아니라 디코딩된 이미지에 적용돼요. 그래서 채널이 클리핑된 JPEG에 새겨진 색 치우침은 그 채널에서 완전히 중립으로 되돌릴 수 없어요.',
          '선형 빛 디코딩과 인코딩은 주변 픽셀을 참조하지 않고 픽셀마다 부동소수점으로 실행돼요. 그래서 내보내기 시간은 슬라이더 값이 아니라 파일 크기에 따라 달라져요.',
        ],
      },
      related: [
        {
          label: '색상 균형',
          to: '/tools/color-balance-photo',
          description: '한 번의 이동으로 부족할 때 그림자, 중간 톤, 밝은 영역의 빨강, 초록, 파랑을 따로 조절해요.',
        },
        {
          label: '사진에 색조 입히기',
          to: '/tools/tint-photo',
          description: '색을 없애는 대신 일부러 더할 때 쓰는 포토 필터 패널이에요.',
        },
        {
          label: '레벨',
          to: '/tools/photo-levels',
          description: '채널별 입력 포인트로, 검정과 흰색 양 끝에서 색 치우침을 중립으로 만드는 또 다른 방법이에요.',
        },
        {
          label: '커브',
          to: '/tools/photo-curves',
          description: '밝기에 따라 달라지는 색 치우침에는 빨강, 초록, 파랑 커브를 쓰세요.',
        },
        {
          label: '이미지 채도',
          to: '/tools/image-saturation',
          description: '색은 색 치우침을 없앤 뒤에 살리세요. 그 전에는 하지 마세요.',
        },
      ],
      embed: {
        title: '색 치우침 보정하기',
        description: '노랑, 파랑 또는 초록 색 치우침이 있는 사진을 여기에 끌어다 놓으세요. 기본 패널이 화이트 밸런스 그룹을 연 상태로 열려요.',
      },
    },
    'black-and-white-photo': {
      name: '흑백 사진',
      h1: '온라인에서 사진을 흑백으로 변환하기',
      tagline: '여섯 가지 색상 슬라이더로 채널을 가중해 단색으로 변환하고, 은은한 필름 커브와 고운 그레인을 더해요. 열 때 적용되며 내보내기 전에 조정할 수 있어요.',
      metaTitle: '사진을 온라인으로 흑백으로 변환 | Media Manipulator',
      metaDescription: '색상별 조절이 되는 흑백: 여섯 개의 채널 슬라이더로 빨강, 노랑, 초록, 청록, 파랑, 자홍이 어떻게 회색이 될지 정해요. 필름 룩 적용, 원본 크기로 내보내기.',
      ogTitle: '흑백 사진 변환기 | Media Manipulator',
      ogDescription: '채널 슬라이더 여섯 개, 선택 사항인 색조 입히기, 필름 커브와 그레인. 내 GPU에서 실시간으로 미리 보고, 저희 서버가 원본으로 렌더링한 파일을 내보내세요.',
      intro: '이 페이지에서는 Media Manipulator의 사진 편집기 Aperture가 흑백 패널로 열리고, 흑백 필름 룩이 레이어 세 개짜리 그룹으로 이미 적용되어 있어요. 기본 채널 가중치의 흑백 레이어, (0.25, 0.22)와 (0.75, 0.78)을 지나는 완만한 S자 커브 레이어, 양 20의 그레인 레이어예요. 흑백 레이어는 단순히 채도를 빼는 것이 아니라 색조별로 채널을 섞어요. 각 픽셀의 회색은 루마와 가중값 사이를 섞은 값이고, 가중치는 여섯 슬라이더에서 나와요. 기본값은 빨강 40, 노랑 60, 초록 40, 청록 60, 파랑 20, 자홍 80이에요. 파랑을 내리면 하늘이 어두워지고, 빨강을 올리면 입술과 벽돌이 밝아져요. 커브와 그레인은 별개의 레이어라서 조정하거나 삭제할 수 있어요.',
      whatItDoes: [
        '-200~300 범위의 채널 슬라이더 여섯 개로 각 색조 계열이 얼마나 밝아질지 정해 모든 픽셀을 회색으로 바꿔요. 필름 시절 암실 필터가, 데스크톱 편집기에서는 흑백 패널이 주던 바로 그 조절 기능이에요.',
        '열 때 흑백 필름을 적용해요. 기본 채널 가중치, 그림자를 살짝 낮추고 밝은 영역을 살짝 올리는 점 (0, 0), (0.25, 0.22), (0.75, 0.78), (1, 1)의 커브 레이어, 양 20, 크기 1, 거칠기 50의 그레인 레이어로 구성돼요.',
        '룩 패널에는 대안으로 고대비 흑백이 있어요. 빨강 40, 노랑 40, 파랑 -40에 대비 +40과 명료도 25를 더해 하늘이 어두운 더 강한 느낌을 줘요.',
        '색조와 강도를 정하는 색조 입히기 옵션을 더하면, 두 번째 레이어 없이도 회색을 세피아나 셀레늄 블루, 그 밖의 원하는 단일 색 쪽으로 기울일 수 있어요.',
        '변환은 레이어로 남아요. 마스크를 씌워 한 부분만 컬러로 남기거나, 불투명도를 낮춰 채도를 일부만 빼거나, 커브 레이어 아래로 순서를 바꾸고, 전체 해상도로 내보내세요.',
      ],
      flowSteps: [
        {
          title: '사진 끌어다 놓기',
          description: 'JPG, PNG, WebP, GIF, HEIC, AVIF 또는 TIFF 파일이면 돼요. 편집기가 흑백 패널로 열리고 필름 룩이 이미 스택에 들어 있어요.',
        },
        {
          title: '채널 슬라이더 설정',
          description: '하늘을 어둡게 하려면 파랑을 내리고, 피부를 밝게 하려면 빨강이나 노랑을 올리고, 나뭇잎을 밝게 하려면 초록을 올리세요. 히스토그램이 모든 움직임을 따라가요.',
        },
        {
          title: '커브와 그레인 조정',
          description: '룩이 추가한 커브 레이어를 편집하거나, 디테일 패널에서 그레인의 양이나 크기를 바꾸거나, 그룹에서 어느 레이어든 삭제하세요.',
        },
        {
          title: '내보내기',
          description: '원하는 품질의 JPG, PNG, WebP, AVIF 또는 TIFF로 내보내세요. 그레인은 서버에서 같은 시드로 정확히 똑같이 재현돼요.',
        },
      ],
      advancedDetails: [
        '편집기는 픽셀마다 HSV 채도 S와 명도 V, BT.709 루마 L = 0.2126 R + 0.7152 G + 0.0722 B, 색조 h를 구해요. 회색은 (1 - S) x L + S x (여섯 범위에 대한 w_i(h) x k_i / 100의 합) x V예요. 여기서 k_i는 채널 슬라이더이고, w_i는 표준 색조 범위 가중치로, 기본값인 폭 30, 페더 30에서 범위 중심으로부터 15도 이내는 1이고 45도에서 0이 될 때까지 직선으로 줄어요. 회색 픽셀은 S = 0이라 루마가 정확히 그대로 유지되고, 채도가 완전한 순수 빨강은 S = 1이라 빨강/100 x V가 되므로 기본값에서는 0.4, 즉 102단계가 돼요.',
        '슬라이더는 자연스러운 범위를 넘을 수 있어요. 채널을 300으로 두면 채도 높은 색조가 잘리기 전에 원래 값의 세 배가 되고, 채널을 음수로 두면 값이 음수로 내려가 검정으로 잘려요. 고대비 흑백이 짙푸른 하늘을 순수한 검정으로 만드는 방법이 이거예요.',
        '색조 입히기 옵션은 회색의 각 채널에 틴트 강도 / 100 x 0.25 x (hueToRGB(틴트 색조) - 0.5)를 더해요. hueToRGB는 그 색조의 채도가 완전한 색을 돌려줘요. 128 중간 회색에 색조 40, 강도 30의 따뜻한 틴트를 주면 (137, 131, 118)이 돼요.',
        '룩의 커브 레이어는 네 점을 지나는 Fritsch-Carlson 단조 삼차 곡선을 256칸짜리 조회 테이블로 샘플링한 것이라, 0.25는 0.22로, 0.75는 0.78로, 0.5는 정확히 0.5로 매핑돼요. 그레인 레이어는 픽셀마다 양 / 100 x 0.2 x (노이즈 - 0.5)를 더하므로 양 20에서는 많아야 0.02, 약 5단계예요. 노이즈는 픽셀 위치와 시드의 해시에서 나와요.',
        '화면의 미리보기는 1920 px 사본을 내 GPU에서 WebGL2로 렌더링한 결과이고, 다운로드 파일은 저희 서버가 같은 채널, 커브, 그레인 코드로 전체 해상도 원본에서 렌더링해요. 색상 단계는 평균 1, 최대 4단계 안에서 일치하고, 그레인 해시는 공유되므로 그레인은 정확히 일치해요.',
      ],
      whyItMatters: [
        '단순히 채도를 빼면 루마가 같은 빨강과 초록이 같은 회색이 되어, 빨간 꽃이 잎 속에 묻혀 버려요. 둘을 갈라 주는 것이 채널 가중치예요.',
        '하늘, 피부, 나뭇잎은 저마다 고유한 색조 계열에 있으므로, 대부분의 사진은 슬라이더 세 개면 톤 관계를 정할 수 있어요.',
        '디지털 변환이 회색 JPEG가 아니라 인화지처럼 보이게 하는 것이 그레인과 부드러운 커브예요. 여기서는 둘 다 끌 수 있는 레이어예요.',
      ],
      useCases: [
        {
          title: '인물 사진',
          description: '빨강과 노랑을 조금 올려 피부를 환하게 하고, 파랑을 내려 배경이 물러나게 하고, 질감을 위해 그레인은 남겨 두세요.',
        },
        {
          title: '하늘이 있는 풍경',
          description: '파랑 -40과 청록 20이면 필름에 빨간 필터를 쓴 것 같은 어두운 하늘이 나와요. 초록을 올리면 그 하늘을 배경으로 풀과 나무가 밝아져요.',
        },
        {
          title: '건축과 거리 사진',
          description: '명료도 25가 들어간 고대비 흑백은 돌, 콘크리트, 유리의 윤곽을 또렷하게 끌어내요.',
        },
        {
          title: '기록물과 문서',
          description: '기본 가중치에서 커브를 지우면 스캔본과 복제물에 맞는 중립적인 변환이 돼요.',
        },
      ],
      workedExamples: [
        {
          title: '파란 하늘이 있는 인물 사진: 24 MP JPEG에 흑백 필름',
          body: '기본 채널 가중치를 쓴 6000 x 4000 JPEG(24메가픽셀, 11 MB)예요. 피부 픽셀 (217, 158, 128)은 HSV 채도 0.410, 명도 0.851, 루마 0.660이에요. 색조가 20.2도라서 빨강 가중치 0.826, 노랑 가중치 0.174을 받으므로 가중값은 0.826 x 0.4 + 0.174 x 0.6 = 0.435이고, 회색은 0.590 x 0.660 + 0.410 x 0.435 x 0.851 = 0.541, 즉 138단계예요. 색조 210, 채도 0.421, 명도 0.95, 루마 0.721인 하늘 픽셀 (140, 191, 242)는 0.6인 청록에서 0.5, 0.2인 파랑에서 0.5를 받으므로 회색은 0.579 x 0.721 + 0.421 x 0.4 x 0.95 = 0.577, 즉 147단계예요. 이어서 커브가 0.541을 0.549(140)로, 0.577을 0.590(151)로 매핑하고, 그레인이 어느 쪽으로든 최대 5단계를 더해요. 128인 회색 카드는 두 단계를 거쳐도 128 그대로예요. 24메가픽셀 전체를 내보내려면 Premium이나 Pro가 필요하고, 품질 92의 JPG는 약 10.8 MB예요.',
        },
        {
          title: '하늘 어둡게 하기: 12 MP 사진에 파랑 -40과 고대비 흑백',
          body: '4000 x 3000 JPEG(12메가픽셀, 5 MB)예요. 고대비 흑백으로 바꾸면 빨강 40, 노랑 40, 파랑 -40이 되고, 초록 40, 청록 60, 자홍 80은 그대로예요. 같은 하늘 픽셀 (140, 191, 242)는 이제 가중값이 0.5 x 0.6 + 0.5 x -0.4 = 0.1이므로, 회색은 0.579 x 0.721 + 0.421 x 0.1 x 0.95 = 0.457이 되어 147단계가 아니라 117단계가 돼요. 색조 230인 짙은 파란 재킷 (51, 77, 204)는 채도 0.75, 명도 0.8이에요. 0.25 x 0.315 + 0.75 x -0.4 x 0.8 = -0.161이고, 0으로 잘려 순수한 검정이 돼요. 빨간 문 (204, 51, 51)은 빨강이 여전히 40이라 바꿔도 그대로 0.25 x 0.328 + 0.75 x 0.4 x 0.8 = 0.322, 즉 82단계예요. 그다음 룩이 대비 +40과 명료도 25를 레이어 두 개로 더 추가해요. 12메가픽셀 내보내기는 무료 계정 한도 안에 들어가고, 품질 92의 JPG로 약 5.4 MB예요.',
        },
      ],
      whenNotToUse: '흑백 변환은 색조를 버려요. 그래서 한 가지 색은 남기고 나머지만 회색으로 만들고 싶다면, 색조 정보를 유지한 채 다른 범위의 채도만 빼는 컬러 팝 페이지를 쓰세요. 사진이 이미 단색인데 밋밋하기만 하다면, 커브, 레벨, 대비 페이지에서 변환 레이어 없이 톤을 바꿀 수 있어요. 색이 바랜 컬러 이미지의 색을 되살리는 일은 채도나 활기로 해야 해요. 그리고 세피아나 시아노타입 같은 색감은 이 변환을 대체하는 것이 아니라, 이 변환 위에 포토 필터나 스플릿 토닝 레이어를 얹어서 만들어요.',
      whyMediaManipulator: [
        'Aperture는 색조 채널 여섯 개, 색조 입히기, -200~300까지 움직이는 슬라이더로 변환하므로, 변환이 채도 빼기 버튼 하나가 아니라 색마다 내리는 결정이 돼요.',
        '필름 룩은 일반 레이어 세 개로 된 그룹이에요. 커브와 그레인은 계속 편집할 수 있고, 실행 취소하면 세 레이어가 함께 제거돼요.',
        '모든 슬라이더, 룩, 실행 취소 내역은 무료이고, 전체 크기 내보내기는 일반 작업 한 번이에요. 그레인은 서버에서 같은 시드로 정확히 똑같이 재현돼요.',
      ],
      privacyNote: '흑백 변환, 채널 슬라이더 변경, 그레인 추가는 끌어다 놓은 사진으로 브라우저에서 계산되고, 이를 위해 업로드되는 것은 없어요. 로그인하지 않으면 프로젝트는 내보내기 전까지 이 브라우저의 IndexedDB에 남고, 내보내기는 일반적인 비회원 작업이에요. 로그인하면 원본, 1920 px 미리보기, 썸네일이 보관 기간 설정에 따라 프로젝트와 함께 보관되고, 프로젝트나 계정을 삭제하면 함께 사라져요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 렌더링은 저희 서버가 하고, 외부는 전혀 관여하지 않아요.',
      faq: [
        {
          question: '그냥 채도를 -100으로 하면 안 되나요?',
          answer: '채도 -100은 모든 픽셀을 루마 값으로 바꾸므로, 루마가 같은 색들이 하나로 합쳐져요. 흑백 레이어를 쓰면 파랑을 빨강보다 어둡게, 노랑을 초록보다 밝게 정할 수 있어서 하늘과 구름, 입술과 볼이 구분돼요.',
        },
        {
          question: '기본값 40, 60, 40, 60, 20, 80은 무슨 뜻인가요?',
          answer: '각 색조 계열이 채도 높은 색의 명도 중 몇 퍼센트를 유지하는지 나타내요. 순수한 빨강은 명도의 40%, 순수한 노랑은 60, 순수한 파랑은 20이 돼요. 대부분의 데스크톱 편집기가 쓰는 기본값과 같아서, 다른 곳에서 같은 숫자로 만든 변환이 여기서도 똑같이 보여요.',
        },
        {
          question: '사진의 한 부분만 컬러로 남길 수 있나요?',
          answer: '흑백 레이어에 마스크를 씌우세요. 컬러로 남길 영역 위에 브러시 구성 요소를 칠하고 반전을 켜거나, 색상 범위 구성 요소를 빼기로 설정하면 돼요. 룩의 커브와 그레인 레이어는 거기에도 마스크를 씌우지 않는 한 어느 쪽이든 적용돼요.',
        },
        {
          question: '내보낸 파일의 그레인도 화면과 똑같이 보이나요?',
          answer: '네, 정확히 같아요. 그레인은 난수 없이 픽셀 위치와 시드의 해시로 만들어지고, 서버도 원본 픽셀에 같은 해시를 써요. 미리보기는 1920 px 사본이라 화면의 그레인은 축소되어 보이지만, 내보낸 그레인은 원본 픽셀 단위로 들어가요.',
        },
        {
          question: '진짜 그레이스케일 파일로 내보낼 수 있나요?',
          answer: '내보내기는 고른 형식의 RGB 파일에 똑같은 세 채널을 기록해요. 흑백 이미지의 JPG나 WebP는 색차 정보가 비어 있어 압축이 잘 되므로, 같은 품질에서 컬러 원본보다 파일이 작아요.',
        },
        {
          question: '중립적인 회색 대신 세피아 인화 느낌을 내려면 어떻게 하나요?',
          answer: '흑백 패널에서 색조 입히기를 켜고, 틴트 색조를 35~40 정도, 강도를 20~30으로 설정하세요. 회색은 색조의 색과 중간 회색 사이 거리의 강도 / 100 x 0.25만큼만 그 색조 쪽으로 밀리므로 은은하게 유지돼요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '변환, 커브, 그레인은 픽셀 단위 단계예요. 내보낸 그레인은 서버에서 같은 시드로 생성되며 기준 결과와 비트 하나까지 일치해요.',
          '흑백 JPG와 WebP 내보내기는 색차 평면에 담긴 정보가 없어서, 같은 품질에서 보통 컬러 원본보다 삼분의 일 정도 작아요.',
        ],
      },
      related: [
        {
          label: '컬러 팝',
          to: '/tools/color-pop',
          description: '한 색조 계열만 빼고 모두 단색으로 만들어요.',
        },
        {
          label: '사진에 색조 입히기',
          to: '/tools/tint-photo',
          description: '회색 위에 더 강한 세피아나 원하는 색감을 입히는 포토 필터 레이어예요.',
        },
        {
          label: '커브',
          to: '/tools/photo-curves',
          description: '채널마다 최대 16개의 점으로 변환 결과의 톤을 다듬어요.',
        },
        {
          label: '비네팅 추가',
          to: '/tools/add-vignette',
          description: '흑백 인화에는 보통 어둡게 처리한 가장자리가 함께해요.',
        },
        {
          label: '스플릿 토닝',
          to: '/tools/split-toning',
          description: '회색 위에 그림자용 하나, 밝은 영역용 하나, 두 가지 색조를 입혀요.',
        },
        {
          label: '사진 선명하게',
          to: '/tools/sharpen-photo-online',
          description: '한계값이 있는 언샤프 마스크를 루마에 적용해 단색 디테일을 더 또렷하게 해요.',
        },
      ],
      embed: {
        title: '사진을 흑백으로 변환하기',
        description: '사진을 끌어다 놓으면 흑백 필름 룩이 적용된 채로 Aperture가 열려요. 채널 슬라이더 여섯 개, 커브, 그레인을 조정한 뒤 내보내세요.',
      },
    },
    'tint-photo': {
      name: '사진에 색조 입히기',
      h1: '온라인에서 사진에 색조 입히기',
      tagline: '렌즈에 필터를 씌우듯 사진 위에 색을 얹으세요. 따뜻하게, 차갑게, 세피아 또는 원하는 색을 고르고 농도를 정해도 밝기는 그대로예요.',
      metaTitle: '사진에 색조를 온라인으로 입히기: 따뜻하게, 세피아, 원하는 색 | Media Manipulator',
      metaDescription: '포토 필터 레이어로 사진에 색조를 더하세요. 따뜻하게, 차갑게, 세피아, 빨강, 초록, 파랑 또는 사용자 지정 HEX 색상, 농도 0~100, 광도 유지. 원본 크기로 내보내요.',
      ogTitle: '온라인에서 사진에 색조 입히기 | Media Manipulator',
      ogDescription: '포토 필터 레이어는 이미지에 색을 곱하고 농도에 따라 혼합하며, 휘도를 그대로 유지하는 옵션도 있어요. 내 GPU에서 미리 보고 원본에서 내보내세요.',
      intro: '이 페이지는 Media Manipulator의 사진 편집기 Aperture를 포토 필터 패널이 앞에 나온 상태로 열고, 따뜻하게 필터를 농도 25, 광도 유지 켬으로 불러와요. 여기서 포토 필터는 렌즈에 끼우는 유리 필터와 같은 일을 해요. 각 픽셀에 필터 색을 곱하고, 농도 슬라이더로 픽셀이 원본에서 그 필터 값 쪽으로 얼마나 옮겨 갈지 정해요. 광도 유지를 켜면 결과의 BT.709 루마가 원본과 같아지도록 배율을 다시 맞추므로, 사진이 어두워지지 않고 색만 입혀져요. 따뜻하게, 차갑게, 세피아, 빨강, 초록, 파랑의 여섯 가지 필터 칩으로 색을 정하고, 사용자 지정 색상에는 어떤 HEX 값이든 넣을 수 있어요. 세피아 인화 느낌을 원하면 흑백 레이어 위에 쌓으세요.',
      whatItDoes: [
        '사진을 열면 따뜻하게 색상 #ec8a00, 농도 25의 포토 필터 레이어를 불러오고, 차갑게 #0a5dc8, 세피아 #ac7a33, 빨강 #e81c1c, 초록 #1fb52f, 파랑 #1c3ee8과 사용자 지정 색상 선택기도 제공해요.',
        '농도는 0~100 범위예요. 0이면 레이어가 아무 일도 하지 않고, 100이면 모든 픽셀에 필터 색이 완전히 곱해지며, 그 사이에서는 단순한 선형 혼합이에요.',
        '기본으로 켜져 있는 광도 유지는 색을 입힌 각 픽셀의 배율을 다시 맞춰 루마가 색을 입히기 전 픽셀과 같아지게 해요. 덕분에 사진의 노출은 그대로이고 필터는 순수한 색 이동이 돼요.',
        '다른 모든 기능처럼 레이어로 작동해요. 마스크를 씌워 하늘에만 색을 입히거나, 불투명도를 낮추거나, 혼합 모드를 색상으로 설정해 휘도에는 전혀 손대지 않게 할 수 있고, 언제든 실행 취소할 수 있어요.',
        '색을 입힌 사진을 원본 픽셀에서 전체 해상도로 렌더링해 JPG, PNG, WebP, AVIF 또는 TIFF로 내보내요.',
      ],
      flowSteps: [
        {
          title: '사진 끌어다 놓기',
          description: '편집기가 포토 필터 패널로 열리고, 농도 25%의 따뜻하게가 이미 레이어로 적용되어 있어요.',
        },
        {
          title: '색 고르기',
          description: '따뜻하게, 차갑게, 세피아, 빨강, 초록, 파랑 중에서 고르거나, 브랜드 색조에 맞춰 사용자 지정 HEX 색상을 입력하세요.',
        },
        {
          title: '농도 설정',
          description: '색이 원하는 만큼 진해질 때까지 농도를 드래그하세요. 광도 유지는 실제 유리 필터처럼 필터가 사진을 어둡게 하기를 원할 때만 끄세요.',
        },
        {
          title: '내보내기',
          description: '형식과 품질을 고르세요. 서버가 원본에 색조를 렌더링하고 파일 이름에 (retouched)를 붙여요.',
        },
      ],
      advancedDetails: [
        '채널별 공식은 lerp(c, c x f, Density / 100)이에요. c는 sRGB 0..1 범위의 픽셀 값, f는 같은 척도의 필터 색, Density는 농도 슬라이더 값이며, 따뜻하게 #ec8a00은 f = (0.9255, 0.5412, 0)이에요. 필터는 곱하는 방식이라 채널을 낮출 수만 있고, 따뜻하게의 파랑처럼 필터 값이 0인 채널은 정확히 1 - Density / 100배가 돼요.',
        '광도 유지를 켜면 편집기는 원본과 색을 입힌 픽셀 각각의 BT.709 루마 L = 0.2126 R + 0.7152 G + 0.0722 B를 계산하고, 색을 입힌 픽셀에 두 값의 비율을 곱한 뒤 0..1 범위로 제한해요. 중간 회색 0.5는 농도 25의 따뜻하게를 거치면 배율 조정 전 (0.4907, 0.4427, 0.375)가 되고 루마는 0.448이에요. 여기에 비율 1.116을 곱하면 (0.5477, 0.4941, 0.4185), 값으로는 (140, 126, 107)로 올라가요.',
        '범위 제한 때문에 흰색 근처에서는 광도가 완전히 유지되지 않아요. 순백색에 따뜻하게를 25%로 적용하면 루마를 유지하려면 빨강이 1을 넘어야 하므로 값이 잘려 (255, 252, 213)으로 내보내지고, 원본보다 약간 어두워져요. 그래서 이 옵션을 켜도 농도가 높으면 밝은 영역의 밝기가 조금 줄어요.',
        '광도 유지를 켠 농도 100%의 필터는 한 가지 색으로 평평하게 덮는 것이 아니라 필터 색 쪽으로의 순수한 색 이동이에요. 픽셀이 원래 루마를 유지하므로, 중간 회색에 세피아를 100으로 적용하면 (172, 122, 51)이 되고 여전히 중간 톤이에요.',
        '조정하면서 보는 미리보기는 사진의 1920 px 사본을 내 GPU에서 WebGL2로 그린 것이고, 다운로드 파일은 저희 서버가 같은 곱하기, 혼합, 루마 배율 조정으로 원본에서 렌더링해요. 차이는 색상 단계에 대해 문서화된 허용 오차, 즉 평균 오차 최대 1, 최대 오차 255단계 중 4단계 이내예요.',
      ],
      whyItMatters: [
        '곱해서 입힌 색은 색유리를 통과하는 빛처럼 작동해요. 그래서 밝은 영역과 그림자가 위에 덧칠되는 대신 각자의 밝기에 비례해 색을 받아요.',
        '광도 유지는 색의 문제와 노출의 문제를 분리해 주므로, 사진을 따뜻하게 만든 뒤 따로 밝게 할 필요가 없어요.',
        '색조 레이어 하나로 서로 다른 빛에서 찍은 사진 묶음을 통일할 수 있어요. 갤러리나 피드를 하나의 시리즈처럼 보이게 하는 흔한 방법이에요.',
      ],
      useCases: [
        {
          title: '차가운 사진 따뜻하게',
          description: '흐린 날과 그늘에서는 사진이 파랗게 나와요. 따뜻하게를 20~35%로 적용하면 노출은 그대로 두고 햇빛의 색을 되살릴 수 있어요.',
        },
        {
          title: '세피아 인화',
          description: '흑백 레이어 위에 세피아를 50~70%로, 광도 유지를 켜고 적용하면 고전적인 갈색 인화 느낌이 나요.',
        },
        {
          title: '브랜드 색 입히기',
          description: '브랜드 HEX 값을 사용자 지정 색상으로 입력하고 농도를 낮게 유지하면 한 페이지의 제품 사진들이 같은 색감을 띠어요.',
        },
        {
          title: '야경 차갑게',
          description: '차갑게를 30~40%로 적용하면 밤거리가 파란색 쪽으로 옮겨 가면서도 나트륨 가로등은 상대적인 따뜻함을 유지해요.',
        },
      ],
      workedExamples: [
        {
          title: '그늘진 인물 사진 따뜻하게: 12 MP HEIC에 농도 25의 따뜻하게',
          body: '휴대폰으로 찍은 4032 x 3024 HEIC(12.2메가픽셀)예요. 서버가 미리보기용으로 디코딩해야 하므로 계정이 필요해요. 따뜻하게 #ec8a00, 농도 25, 광도 유지 켬으로 설정하면 중간 회색 (128, 128, 128)은 (140, 126, 107)로 내보내져요. 파랑 채널은 배율 조정 전에 0.5 x 0.75 = 0.375로 떨어지고, 루마 비율 1.116이 나머지 채널을 끌어올려 결과는 루마 0.5를 유지해요. 피부 픽셀 (217, 158, 128)은 (235, 155, 106)이 되고, 하늘 부분 (140, 191, 242)는 (155, 191, 205)가 돼요. 광도 유지를 끄면 같은 세 픽셀이 각각 (125, 113, 96), (213, 140, 96), (138, 169, 182)로 내보내져 모두 더 어두워요. 품질 92의 JPG로 내보내면 파일은 약 5.5 MB이고 일반 작업 한 번이에요.',
        },
        {
          title: '세피아 인화: 45 MP 스캔에 흑백 후 농도 50의 세피아',
          body: '8256 x 5504 TIFF 스캔(45메가픽셀, 136 MB)이에요. 열려면 계정이 필요하고, 12메가픽셀보다 크게 내보내려면 Premium 또는 Pro 요금제가 필요해요. 기본 가중치의 흑백 레이어 위에 세피아 #ac7a33, 농도 50, 광도 유지 켬으로 설정한 포토 필터가 있어요. 중간 회색 128은 (142, 126, 102)가 돼요. 배율 조정 전에는 (0.4186, 0.3696, 0.3), 루마 0.375였고, 비율 1.333이 루마를 0.5로 되돌려요. 흰색 255는 빨강이 잘려 (255, 251, 204)로 내보내져요. 광도 유지를 끄면 중간 회색은 (107, 94, 77)이 되어 눈에 띄게 어두운 인화가 돼요. 최대 크기를 64메가픽셀로 두고 내보내면 파일은 45메가픽셀 전체 크기 그대로예요. 품질 92의 JPG로는 약 20 MB, WebP로는 메가픽셀당 0.3 MB 추정치 기준 약 13.6 MB예요.',
        },
      ],
      whenNotToUse: '포토 필터는 색 치우침을 더하는 도구이지 없애는 도구가 아니에요. 색을 곱해서는 빛이 앗아 간 채널을 되살릴 수 없기 때문이에요. 색 치우침을 없애는 일은 화이트 밸런스 페이지가 선형 광에서 색온도와 색조 한 쌍으로 처리해요. 그림자와 밝은 영역에 서로 다른 색을 입히고 싶다면, 스플릿 토닝에 양 끝 각각의 슬라이더와 둘 사이의 균형 슬라이더가 있어요. 참조 파일의 색 보정을 통째로 가져오려면 LUT 패널의 .cube LUT로 레이어 하나에서 재현할 수 있어요. 노출까지 부족한 사진이라면 노출을 먼저 바로잡은 뒤에 색조를 입히세요. 루마 배율 조정은 지금 있는 밝기를 그대로 유지하기 때문이에요.',
      whyMediaManipulator: [
        'Aperture는 농도, 광도 유지, 마스크, 혼합 모드를 갖춘 레이어로 색조를 적용해요. 한 번 누르고 끝나는 세피아 버튼보다 훨씬 많은 것을 할 수 있으면서도 브라우저 탭에서 실행돼요.',
        '사용자 지정 색상 칸에는 어떤 HEX 값이든 넣을 수 있어서, 여섯 가지 고정된 룩 중 하나가 아니라 브랜드나 참조 이미지에 맞춘 색조를 입힐 수 있어요.',
        '색조 입히기, 마스크, 실행 취소는 비용이 들지 않아요. 전체 크기 내보내기는 일반 작업 한 번이고, 일일 사용량은 요금 페이지에 나와 있어요.',
      ],
      privacyNote: '포토 필터는 끌어다 놓은 사진을 대상으로 브라우저에서 계산되며, 내보내기 전까지 색조는 서버로 가지 않아요. 로그인하지 않으면 프로젝트는 이 브라우저의 IndexedDB에 남고, 내보내기는 다른 비회원 작업과 똑같이 저희 서버에서 렌더링돼요. 로그인하면 원본, 1920 px 미리보기, 썸네일이 보관 기간 설정에 따라 프로젝트와 함께 보관되고, 프로젝트나 계정을 삭제하면 함께 삭제돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 외부 서비스로는 파일이 전달되지 않아요.',
      faq: [
        {
          question: '색조 입히기와 화이트 밸런스 조정은 무엇이 다른가요?',
          answer: '화이트 밸런스는 선형 광에서 작동하며, 촬영 당시의 빛을 보정하기 위해 중간 톤을 파랑-노랑, 초록-자홍 축을 따라 옮겨요. 포토 필터는 감마 공간에서 어떤 색이든 농도에 따라 곱하는 방식이라 보정이 아니라 창의적인 색 입히기예요. 색 치우침을 바로잡을 때는 화이트 밸런스를, 색을 더할 때는 필터를 쓰세요.',
        },
        {
          question: '광도 유지를 끄면 사진이 왜 어두워지나요?',
          answer: '필터는 각 채널에 필터 색을 곱하는데 필터 값은 모두 1 이하예요. 그래서 배율을 다시 맞추지 않으면 색을 입힌 픽셀은 원래와 같거나 더 어두울 수밖에 없어요. 따뜻하게는 파랑 값이 0이라서 농도를 최대로 올리면 파랑 채널이 완전히 사라져요.',
        },
        {
          question: '세피아 사진은 어떻게 만드나요?',
          answer: '먼저 흑백 레이어를 추가한 뒤, 세피아 칩을 고른 포토 필터를 농도 50~70%, 광도 유지 켬으로 추가하세요. 중간 회색 128은 50%에서 (142, 126, 102)가 되고, 100%에서는 (172, 122, 51)이 돼요.',
        },
        {
          question: '하늘이나 그림자에만 색조를 입힐 수 있나요?',
          answer: '네. 포토 필터 레이어에 마스크를 씌우세요. 하늘에는 위에서 내려오는 선형 그레이디언트를, 그림자에는 0에서 약 0.3까지의 휘도 범위를 쓰면 돼요. 그러면 픽셀마다 마스크 값만큼 색조가 혼합돼요.',
        },
        {
          question: '빈티지 룩에는 어떤 HEX 색상을 써야 하나요?',
          answer: '세피아 칩은 #ac7a33이에요. 이보다 더 따뜻하고 밝은 #d9a66b를 30~40%로 쓰면 바랜 인화처럼 보여요. 차가운 빈티지는 룩 패널의 페이드 룩 위에 차갑게 #0a5dc8을 15%로 얹으면 돼요.',
        },
        {
          question: '투명한 PNG에도 색조가 적용되나요?',
          answer: '색상 채널에만 적용돼요. 알파는 어떤 조정으로도 바뀌지 않으므로, 배경을 지운 제품 이미지는 투명한 배경을 그대로 유지하고 색조는 보이는 픽셀에만 나타나요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '포토 필터는 픽셀당 곱하기 세 번과 혼합 한 번이라서, 45메가픽셀 내보내기도 몇 초 만에 렌더링되고 시간은 대부분 인코딩에 쓰여요.',
          'TIFF 출력은 채널당 8비트를 유지해요. 색조는 인코딩 전에 적용되므로 TIFF는 원본에 레이어를 더한 파일이 아니라 렌더링된 결과예요.',
        ],
      },
      related: [
        {
          label: '흑백 사진',
          to: '/tools/black-and-white-photo',
          description: '세피아 필터 아래에 둘 흑백 변환이에요.',
        },
        {
          label: '스플릿 토닝',
          to: '/tools/split-toning',
          description: '그림자에 하나, 밝은 영역에 하나, 두 가지 색조를 한꺼번에 입혀요.',
        },
        {
          label: '화이트 밸런스',
          to: '/tools/white-balance-photo',
          description: '색 치우침을 더하는 대신 선형 광에서 바로잡아요.',
        },
        {
          label: '색상 균형',
          to: '/tools/color-balance-photo',
          description: '그림자, 중간 톤, 밝은 영역에서 빨강, 초록, 파랑을 각각 밀어요.',
        },
        {
          label: 'LUT 적용',
          to: '/tools/apply-lut-to-photo',
          description: '.cube 파일을 불러와 레이어 하나로 완전한 색 보정을 적용해요.',
        },
      ],
      embed: {
        title: '사진에 색조 입히기',
        description: '사진을 끌어다 놓으면 Aperture가 따뜻하게 25%가 적용된 포토 필터 패널로 열려요. 다른 색이나 사용자 지정 HEX 값을 고르고, 농도를 정한 뒤 내보내세요.',
      },
    },
    'color-balance-photo': {
      name: '색상 균형',
      h1: '온라인에서 사진 색상 균형 조정하기',
      tagline: '그림자, 중간 톤, 밝은 영역에서 빨강, 초록, 파랑을 각각 밀어 색 치우침을 없애거나 룩을 만드세요. 광도는 유지돼요.',
      metaTitle: '사진 색상 균형을 온라인으로 조정: 색 치우침 보정 | Media Manipulator',
      metaDescription: '슬라이더 아홉 개로 그림자, 중간 톤, 밝은 영역의 빨강, 초록, 파랑을 조절하고 광도를 유지해요. 파랑이나 주황 색 치우침을 바로잡거나 사진을 색 보정한 뒤 원본 크기로 내보내요.',
      ogTitle: '온라인에서 사진 색상 균형 조정하기 | Media Manipulator',
      ogDescription: '그림자, 중간 톤, 밝은 영역마다 빨강, 초록, 파랑 슬라이더가 있어요. 루마로 가중치를 주고 광도를 유지하며, 내 GPU에서 미리 보고 원본에서 내보내요.',
      intro: '이 페이지는 Media Manipulator의 사진 편집기 Aperture를 색상 균형 패널이 앞에 나온 상태로 열어요. 색상 균형은 감마 공간에서 작동하는 조정 레이어로, 그림자, 중간 톤, 밝은 영역마다 빨강, 초록, 파랑 슬라이더가 하나씩, 세 개씩 세 묶음으로 있고 각각 -100~100 범위예요. 편집기는 픽셀마다 루마를 기준으로 각 톤 영역에 얼마나 속하는지 계산하고, 가중치를 적용한 세 이동량을 게인 0.3으로 각 채널에 더해요. 광도 유지를 켜 두면 픽셀의 배율을 다시 맞춰 루마를 원래대로 돌려놓아요. 그래서 그늘에서 찍은 사진의 그림자에서 파랑을 빼거나 노을 사진의 밝은 영역에 따뜻함을 더해도 노출은 바뀌지 않아요. 색 치우침이 톤 범위 전체에 고르지 않아 화이트 밸런스 보정 한 번으로는 해결되지 않을 때 딱 맞는 도구예요.',
      whatItDoes: [
        '그림자, 중간 톤, 밝은 영역마다 빨강, 초록, 파랑이 있는 아홉 개의 슬라이더(-100~100)와 기본으로 켜져 있는 광도 유지 스위치를 제공해요.',
        '그림자와 밝은 영역의 가중치는 BT.709 루마에서, 중간 톤의 가중치는 HSL 명도에서 계산해요. 그래서 한계값 하나로 딱 잘라 나누지 않고, 각 픽셀이 세 묶음을 섞어서 받아요.',
        '가중치가 최대인 채널에서 100만큼 이동하면 채널 값이 0.3, 즉 255단계 중 77단계 움직여요. 몇 단계짜리 색 치우침을 바로잡을 만큼 섬세하면서도 틸 앤 오렌지 색 보정을 할 만큼 강해요.',
        '광도 유지는 이동 후 모든 픽셀의 배율을 원래 루마로 되돌려서, 색은 움직여도 히스토그램은 제자리에 있게 해요. 끄면 슬라이더가 밝기도 함께 올리거나 내려요.',
        '다른 레이어처럼 마스크, 불투명도, 혼합 모드를 쓸 수 있고, 내보낼 때는 같은 가중치로 원본을 전체 해상도로 렌더링해요.',
      ],
      flowSteps: [
        {
          title: '사진 끌어다 놓기',
          description: 'JPG, PNG, WebP, GIF, HEIC, AVIF 또는 TIFF를 쓸 수 있어요. 편집기가 아홉 개 슬라이더가 모두 0인 색상 균형 패널로 열려요.',
        },
        {
          title: '색 치우침 찾기',
          description: '백슬래시 키를 누르고 있으면 원본과 비교할 수 있어요. RGB 히스토그램도 읽어 보세요. 파란 색 치우침이 있으면 파랑 채널이 빨강과 초록보다 오른쪽에 놓여요.',
        },
        {
          title: '톤 영역별 이동',
          description: '색 치우침이 있는 톤 영역에서 파랑을 내리세요. 그늘이라면 보통 그림자, 혼합광이라면 중간 톤이에요. 사진에 따뜻함이 필요하면 빨강을 조금 더하세요.',
        },
        {
          title: '내보내기',
          description: '형식과 품질을 고르세요. 서버가 원본에 보정을 렌더링하고 파일 이름에 (retouched)를 붙여요.',
        },
      ],
      advancedDetails: [
        '그림자 가중치는 1 - smoothstep(0, 0.5, L), 밝은 영역 가중치는 smoothstep(0.5, 1, L)이에요. 여기서 L은 BT.709 루마 0.2126 R + 0.7152 G + 0.0722 B예요. 루마 0.122인 픽셀은 그림자 가중치가 0.851이고 밝은 영역 가중치는 없어요. 루마 0.897인 픽셀은 밝은 영역 가중치가 0.889이고 그림자 가중치는 없어요. 루마 0.5에서는 둘 다 0이에요.',
        '중간 톤 가중치는 Darkroom의 색상 균형 가중치와 같아요. HSL 명도를 l = (max + min) / 2라고 하면 clamp((l - 0.333) x 4 + 0.5) x clamp((1 - l - 0.333) x 4 + 0.5) x 0.7이고, l = 0.5에서 최댓값 0.7이 되며 l이 약 0.21 아래이거나 약 0.79 위이면 0이 돼요. 세 가중치를 더한 값이 꼭 하나가 되도록 맞추지는 않아요. 중간 회색은 중간 톤에서 0.7을 받고 나머지 두 영역에서는 아무것도 받지 않아요.',
        '채널별 이동량은 0.3 x (그림자 가중치 x 그림자 슬라이더 + 중간 톤 가중치 x 중간 톤 슬라이더 + 밝은 영역 가중치 x 밝은 영역 슬라이더) / 100이고, 채널에 더한 뒤 0..1 범위로 제한해요. 중간 회색 0.5에 중간 톤 빨강 +20을 적용하면 0.3 x 0.7 x 0.2 = 0.042이므로 빨강은 0.542, 값으로는 138이 돼요.',
        '광도 유지를 켜면 이동한 픽셀에 원래 루마를 이동 후 루마로 나눈 값을 곱하고 범위를 제한해요. 그러면 같은 중간 톤 빨강 +20을 적용한 중간 회색은 (136, 125, 125)로 내보내져요. 빨강은 올라가고 초록과 파랑은 내려가서 루마가 정확히 0.5로 유지돼요.',
        '색상 균형과 화이트 밸런스는 서로 다른 연산이에요. 화이트 밸런스는 선형 광에서 고정된 색온도 축과 색조 축을 따라 중간 톤을 옮기고, 이 레이어는 감마 인코딩된 값에 아홉 개의 자유로운 슬라이더로 작동해요. 혼합광 장면에서는 둘을 겹쳐 쓰세요.',
        '화면의 미리보기는 1920 px 사본을 내 GPU에서 WebGL2로 렌더링한 것이고, 내보낸 파일은 저희 서버가 같은 가중치, 게인, 루마 배율 조정으로 원본에서 렌더링해요. 두 결과는 문서화된 허용 오차, 즉 8비트 기준 평균 오차 최대 1, 최대 오차 4단계 이내에서 일치해요.',
      ],
      whyItMatters: [
        '색 치우침이 고른 경우는 드물어요. 그늘에서는 그림자가 파랗지만 햇빛을 받은 밝은 영역은 중립적이라서, 톤 영역별 보정이어야만 한쪽을 해치지 않고 다른 쪽을 바로잡을 수 있어요.',
        '광도가 유지되니 색 보정이 노출 문제로 번지지 않아요. 톤을 맞춘 뒤에 색 보정을 해도 히스토그램이 움직이지 않아요.',
        '그림자와 밝은 영역을 반대 방향으로 이동하는 것이 대부분의 필름 룩과 영화 룩의 기본이고, 아홉 개의 슬라이더로 이를 그대로 표현할 수 있어요.',
      ],
      useCases: [
        {
          title: '그늘의 파란 색 치우침 보정',
          description: '그림자에서 파랑 -15, 중간 톤에서 파랑 -20과 빨강 +5, 밝은 영역에서 파랑 -10을 주면 탁 트인 그늘에서 찍은 인물 사진이 중립으로 돌아와요.',
        },
        {
          title: '텅스텐 조명의 주황색 제거',
          description: '중간 톤에서 빨강 -15와 파랑 +10, 그림자에서 그보다 작은 값을 주면 실내 장면이 다시 중립이 돼요.',
        },
        {
          title: '틸 앤 오렌지 색 보정',
          description: '그림자에서 빨강 -10과 파랑 +15, 밝은 영역에서 빨강 +15, 초록 +5, 파랑 -10, 중간 톤은 0으로 두면 피부와 배경이 분리되는 영화 같은 느낌이 나요.',
        },
        {
          title: '두 사진 색 맞추기',
          description: '두 사진의 히스토그램을 읽고, 한쪽 사진의 채널 정점이 다른 사진과 맞을 때까지 톤 영역을 이동하세요.',
        },
      ],
      workedExamples: [
        {
          title: '탁 트인 그늘의 인물 사진: 24 MP JPEG의 세 톤 영역에서 파랑 빼기',
          body: '건물 그늘에서 찍은 6000 x 4000 JPEG(24메가픽셀, 11 MB)예요. 설정은 그림자 파랑 -15, 중간 톤 빨강 +5와 파랑 -20, 밝은 영역 파랑 -10, 광도 유지 켬이에요. 사진 속 그레이 카드는 (115, 122, 143), 루마 0.479이고 그림자 가중치 0.005, 중간 톤 가중치 0.7, 밝은 영역 가중치 0이에요. 빨강은 0.3 x 0.7 x 0.05 = 0.0105만큼 올라가고 파랑은 0.3 x (0.005 x 0.15 + 0.7 x 0.20) = 0.0422만큼 내려가며, 루마 배율 조정 후 카드는 (118, 123, 132)로 거의 중립이 되어 내보내져요. 흰 셔츠 (219, 230, 247)은 루마 0.897로 밝은 영역 가중치 0.889를 받으므로 파랑이 0.3 x 0.889 x 0.1 = 0.0267 내려가 (220, 230, 241)로 내보내져요. 어두운 재킷 (26, 31, 51)은 루마 0.122로 그림자 슬라이더를 가중치 0.851로 받아 파랑이 0.0383 내려가고 (26, 31, 42)로 내보내져요. 24메가픽셀 내보내기에는 Premium 또는 Pro가 필요하고, 품질 92의 JPG로는 약 10.8 MB예요.',
        },
        {
          title: '그레이 카드에 중간 톤 빨강 +20, 광도 유지 켬과 끔 비교, 6 MP',
          body: '중간 회색 (128, 128, 128)이 있는 3000 x 2000 JPEG(6메가픽셀, 2.4 MB)예요. 이 회색은 루마 0.5, HSL 명도 0.5이므로 중간 톤 가중치는 최댓값 0.7이고, 그림자와 밝은 영역 가중치는 0이에요. 중간 톤 빨강 +20은 빨강에 0.3 x 0.7 x 0.2 = 0.042를 더해요. 광도 유지를 끄면 카드는 (138, 128, 128), 루마 0.509로 살짝 밝게 내보내져요. 켜면 픽셀에 0.5 / 0.509 = 0.982를 곱해 (136, 125, 125), 루마 정확히 0.5로 내보내져요. 같은 +20을 그림자나 밝은 영역에 주면 이 픽셀에는 아무 변화가 없어요. 루마 0.5에서는 두 가중치가 모두 0이기 때문이에요. 6메가픽셀 내보내기는 무료 계정 한도 안에 들어가요. 품질 92의 JPG로는 약 2.7 MB, WebP로는 약 1.8 MB예요.',
        },
      ],
      whenNotToUse: '사진 전체가 고르게 너무 파랗거나 너무 주황색이라면, 화이트 밸런스 페이지가 선형 광에서 슬라이더 두 개로 보정하는 편이 더 빠르고 정확해요. 색상 균형은 그림자와 밝은 영역의 색 치우침이 서로 다를 때만 쓰세요. 그림자에 한 가지 색, 밝은 영역에 다른 색을 창의적으로 입히는 것이 목적이라면, 스플릿 토닝에 양 끝 각각의 색조와 채도, 그리고 균형 슬라이더가 있어 슬라이더 아홉 개보다 간단해요. 방 한쪽에 있는 조명처럼 밝기가 아니라 위치에 따라 달라지는 색 치우침에는 마스크를 씌운 레이어나 이 레이어에 그레이디언트 마스크가 필요해요. 그리고 0이나 255에서 클리핑된 채널은 균형을 맞춰도 되살릴 수 없어요.',
      whyMediaManipulator: [
        'Aperture는 광도 유지와 실시간 RGB 히스토그램이 있는 루마 가중 슬라이더 아홉 개를 제공해요. 데스크톱 편집기와 같은 수준의 제어를 브라우저의 레이어 하나로 쓸 수 있어요.',
        '색상 균형은 화이트 밸런스, 커브, 레벨의 아래나 위에 쌓을 수 있어서, 혼합광 장면에 선형 광 보정과 감마 공간 색 보정을 한 프로젝트에서 함께 적용할 수 있어요.',
        '조정과 미리보기는 비용이 들지 않아요. 전체 해상도 내보내기는 일반 작업 한 번이고, 일일 사용량은 요금 페이지에 나와 있어요.',
      ],
      privacyNote: '색상 균형은 끌어다 놓은 사진을 바탕으로 브라우저에서 계산되며, 보정 자체는 내 기기를 벗어나지 않아요. 로그인하지 않으면 프로젝트는 이 브라우저의 IndexedDB에 보관되고, 내보낼 때만 다른 비회원 작업과 똑같이 업로드되어 저희 서버에서 렌더링돼요. 로그인하면 원본, 1920 px 미리보기, 썸네일이 보관 기간 설정에 따라 프로젝트와 함께 남고, 프로젝트나 계정을 삭제하면 함께 삭제돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 저희는 어떤 외부 서비스에도 파일을 넘기지 않아요.',
      faq: [
        {
          question: '색 치우침을 바로잡을 때 색상 균형과 화이트 밸런스 중 무엇을 써야 하나요?',
          answer: '사진 전체가 한 방향으로 틀어져 있다면 화이트 밸런스부터 쓰세요. 선형 광에서 슬라이더 두 개로 보정해요. 그림자와 밝은 영역의 색 치우침이 다르거나, 화이트 밸런스로 중간 톤은 바로잡았는데 그림자가 여전히 파랗다면 색상 균형을 쓰세요.',
        },
        {
          question: '여기서 그림자, 중간 톤, 밝은 영역은 정확히 어떻게 나뉘나요?',
          answer: '그림자 가중치는 smoothstep 곡선을 따라 검정에서 1, 루마 0.5에서 0으로 떨어져요. 밝은 영역은 0.5에서 0, 흰색에서 1로 올라가요. 중간 톤은 명도 0.5에서 최댓값 0.7이고 0.21과 0.79 근처에서 0이 돼요. 모든 픽셀이 섞인 값을 받으므로 톤 영역 사이에 딱 잘린 경계는 없어요.',
        },
        {
          question: '슬라이더 값 20은 얼마나 큰 변화인가요?',
          answer: '해당 톤 영역에서 가중치가 최대일 때 20은 채널을 0.3 x 0.2 = 0.06, 약 15단계 옮겨요. 최대 가중치가 0.7인 중간 톤에서는 같은 20이 0.042, 약 11단계이고, 그다음 광도 배율 조정이 이 변화를 세 채널에 나눠요.',
        },
        {
          question: '파랑을 내리면 왜 빨강과 초록도 조금 올라가나요?',
          answer: '광도 유지가 작동하기 때문이에요. 파랑을 내리면 루마가 떨어지므로, 루마가 원본과 같아질 때까지 픽셀의 배율을 다시 올리고, 세 채널 모두 그 배율을 함께 적용받아요. 이동량 그대로를 보려면 이 옵션을 끄세요.',
        },
        {
          question: '보정을 사진의 일부에만 적용할 수 있나요?',
          answer: '레이어에 마스크를 씌우세요. 하늘에는 선형 그레이디언트, 톤 영역을 더 좁히려면 휘도 범위, 아니면 브러시를 쓰면 돼요. 마스크 값에 따라 원본과 보정된 픽셀이 혼합돼요.',
        },
        {
          question: 'Darkroom의 색상 균형과 같은 기능인가요?',
          answer: '중간 톤 가중치 함수는 저희 동영상 편집기 Darkroom과 공유하므로, 중간 톤 이동이 사진과 동영상 프레임에서 똑같이 나타나요. 사진 레이어에는 그림자와 밝은 영역 톤 영역, 광도 유지 옵션이 더해져 있어요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '색상 균형은 가중치 세 개와 배율 조정 한 번으로 이루어진 픽셀 단위 단계예요. 내보내기 시간은 인코더가 좌우하며, 24메가픽셀 JPG라면 몇 초 걸려요.',
          '내보낼 때 메타데이터를 제거하거나 유지할 수 있어요. 보정되는 것은 태그가 아니라 픽셀이므로, 어느 쪽이든 카메라의 원래 화이트 밸런스 태그는 바뀌지 않아요.',
        ],
      },
      related: [
        {
          label: '화이트 밸런스',
          to: '/tools/white-balance-photo',
          description: '고른 색 치우침에는 선형 광에서 색온도와 색조로 보정해요.',
        },
        {
          label: '스플릿 토닝',
          to: '/tools/split-toning',
          description: '채널 슬라이더 아홉 개 대신 그림자와 밝은 영역에 색조와 채도를 하나씩 정해요.',
        },
        {
          label: '커브',
          to: '/tools/photo-curves',
          description: '세 톤 영역으로는 따라갈 수 없게 색 치우침이 달라질 때 쓰는 채널별 커브예요.',
        },
        {
          label: '레벨',
          to: '/tools/photo-levels',
          description: '중간 톤 균형을 맞추기 전에 채널별로 검정점과 흰색점을 정해요.',
        },
        {
          label: '사진에 색조 입히기',
          to: '/tools/tint-photo',
          description: '세 채널의 균형을 맞추는 대신 농도로 한 가지 색을 입혀요.',
        },
        {
          label: '사진 편집기 튜토리얼',
          to: '/tutorials/aperture',
          description: '편집기에서 레이어, 마스크, 룩이 어떻게 맞물리는지 알아보세요.',
        },
      ],
      embed: {
        title: '사진 색상 균형 조정하기',
        description: '사진을 끌어다 놓으면 Aperture가 색상 균형 패널로 열려요. 그림자, 중간 톤, 밝은 영역의 빨강, 초록, 파랑을 조절하는 슬라이더 아홉 개가 있고 광도는 유지돼요.',
      },
    },
    'split-toning': {
      name: '스플릿 토닝',
      h1: '온라인 스플릿 토닝',
      tagline: '그림자에는 한 가지 색조를, 밝은 영역에는 다른 색조를 입히고, 둘 사이의 균형점을 움직이세요.',
      metaTitle: '스플릿 토닝을 온라인으로: 그림자와 밝은 영역에 따로 색 입히기',
      metaDescription: '브라우저에서 그림자와 밝은 영역에 서로 다른 두 색조를 입히세요. 색조, 채도, 균형 슬라이더, 실시간 전후 비교, 전체 해상도 내보내기를 지원해요.',
      ogTitle: '온라인 스플릿 토닝',
      ogDescription: '사진의 어두운 절반에는 한 가지 색을, 밝은 절반에는 다른 색을 입히고, 두 색이 만나는 지점은 균형 슬라이더로 정하세요. 비파괴 방식이며 전체 크기로 내보내요.',
      intro: '스플릿 토닝은 사진의 어두운 톤에 한 가지 색감을, 밝은 톤에 다른 색감을 더해요. 틸 앤 오렌지 색 보정, 밝은 영역이 따뜻한 필름 룩, 시아노타입풍 단색 사진이 모두 이렇게 만들어져요. Aperture는 이 기능을 레이어 스택에서 노출, 톤, 화이트 밸런스 다음에 오는 감마 공간 색상 단계로 실행해요. 각 픽셀의 BT.709 루마가 그림자 색조와 밝은 영역 색조를 각각 얼마나 받을지 정하고, 균형 슬라이더는 한쪽 가중치가 사라지고 다른 쪽 가중치가 나타나는 지점을 옮겨요. 이 조정은 최대 64개 레이어 중 하나이므로 불투명도를 낮추거나, 마스크로 범위를 제한하거나, 혼합 모드를 색상으로 바꿔 사진의 휘도에는 전혀 손대지 않게 할 수 있어요.',
      whatItDoes: [
        '그림자용 색조(0-360)와 채도(0-100) 슬라이더, 밝은 영역용 슬라이더 한 쌍, 그리고 -100~100 범위의 균형 슬라이더가 있는 스플릿 토닝 레이어를 추가해요.',
        '모든 픽셀에 루마로 가중치를 줘요. 어두운 픽셀은 그림자 색을, 밝은 픽셀은 밝은 영역 색을 받고, 분할 지점 근처의 중간 회색은 그대로 남아요.',
        '최대 이동량은 의도적으로 작게 잡혀 있어요. 채도 최대일 때 게인이 0.25라서, 극단적인 설정에서도 사진을 다시 칠하는 것이 아니라 색감만 더해요.',
        '미리보기에 결과가 실시간으로 나타나고, 전후 분할 보기와 백슬래시 키를 누르고 있는 비교 기능을 쓸 수 있으며, 슬라이더 변경은 모두 작업 내역 목록에 기록돼요.',
        '서버에서 원본 픽셀로 토닝한 사진을 렌더링해 JPG, PNG, WebP, AVIF 또는 TIFF로 내보내고, 파일 이름에는 (retouched) 접미사가 붙어요.',
      ],
      flowSteps: [
        {
          title: '사진 끌어다 놓기',
          description: '편집기가 스플릿 토닝 패널이 앞에 나온 상태로 열리고, 이미지는 브라우저에서 디코딩돼요.',
        },
        {
          title: '두 색조 고르기',
          description: '그림자 색조와 밝은 영역 색조를 정한 다음, 색감이 보일 때까지 각각의 채도 슬라이더를 올리세요.',
        },
        {
          title: '균형 옮기기',
          description: '균형을 음수로 밀면 밝은 영역 색이 중간 톤을 더 많이 차지하고, 양수로 밀면 그림자 색이 더 높이 올라가요.',
        },
        {
          title: '내보내기',
          description: '형식과 품질을 고르세요. 서버가 원본을 전체 해상도로 렌더링하고 다운로드가 시작돼요.',
        },
      ],
      advancedDetails: [
        '각 픽셀의 루마 L은 sRGB로 인코딩된 값에서 0.2126 R + 0.7152 G + 0.0722 B예요. 분할 지점은 e = 0.5 + balance / 100 x 0.25이므로 균형 -100이면 분할 지점이 0.25, 균형 +100이면 0.75에 놓여요. 그림자 가중치는 1 - smoothstep(0, e, L), 밝은 영역 가중치는 smoothstep(e, 1, L)이고, smoothstep은 흔히 쓰는 t x t x (3 - 2t) 곡선이에요.',
        '각 색조는 표준 색조-RGB 변환으로 채도가 최대인 색이 돼요(색조 220은 빨강 0, 초록 0.333, 파랑 1, 색조 40은 1, 0.667, 0). 그런 다음 레이어는 양 끝마다 채널별로 0.25 x (saturation / 100) x weight x (hueColor - 0.5)를 더하고 0..1 범위로 제한해요. 여기서 saturation은 채도, weight는 가중치, hueColor는 색조의 색이에요. 그래서 한 채널은 한쪽 끝에서 최대 0.125(255단계 중 약 32단계)까지만 움직이고, 그것도 가중치가 1인 곳에서만 그래요.',
        '이동량이 색조의 색에서 0.5를 뺀 값이므로, 토닝은 언제나 어떤 채널은 올리고 어떤 채널은 내려요. 파란 그림자 톤은 파랑을 올리면서 빨강과 초록을 살짝 내리는데, 그래서 토닝한 그림자가 탁해지거나 밝아지지 않고 색을 띤 것처럼 보여요.',
        '균형이 0일 때 루마 0.5인 픽셀은 두 가중치가 모두 0이므로, 채도를 아무리 높여도 진짜 중간 회색은 바뀌지 않아요. 두 톤은 분할 지점에서 겹치지 않고 만나며, 그 양쪽의 부드러운 곡선을 통해서만 겹쳐요.',
        '토닝을 조정하는 동안 미리보기는 1920 px 사본을 내 GPU(WebGL2)에서 그린 것이고, 내보낸 파일은 저희 서버가 같은 스플릿 토닝 공식으로 원본을 전체 해상도로 렌더링해요. 미리보기와 내보내기는 문서화된 작은 허용 오차 안에서 일치해요. 색상 단계는 많아야 8비트 기준 몇 단계, 그레인은 정확히 같아요.',
      ],
      whyItMatters: [
        '전체에 하나의 색조를 입히면 모든 것이 같은 방향으로 밀리지만, 스플릿 토닝은 그림자와 밝은 영역을 서로 보완하는 색으로 유지해요. 그래서 색 보정한 사진이 색 치우침이 아니라 깊이를 갖게 돼요.',
        '필름 인화, 크로스 프로세스 슬라이드, 대부분의 영화 같은 룩은 들여다보면 두 가지 색조의 색 보정이에요. 색조 슬라이더 두 개와 균형으로 재현하는 편이 마스크를 칠하는 것보다 빨라요.',
        '불투명도와 혼합 모드가 있는 레이어로 실행되므로, 강한 색 보정도 몇 달 뒤에 편집을 처음부터 다시 하지 않고 취향에 맞게 줄일 수 있어요.',
      ],
      useCases: [
        {
          title: '틸 앤 오렌지 인물 사진',
          description: '그림자 색조 200에 채도 50, 밝은 영역 색조 40에 채도 30으로 설정하면 피부는 따뜻하게 유지되고 배경은 차가워져요.',
        },
        {
          title: '흑백 사진에 따뜻한 필름 룩',
          description: '먼저 흑백 레이어를 추가한 뒤, 그림자는 갈색 쪽으로, 밝은 영역은 크림색 쪽으로 토닝하면 톤이 분리된 세피아 인화가 돼요.',
        },
        {
          title: '차가운 야경',
          description: '파란 그림자에 균형 +30을 주면 색감이 중간 톤까지 더 높이 올라가고, 가로등은 은은한 호박색 밝은 영역 톤을 유지해요.',
        },
        {
          title: '사진 시리즈 맞추기',
          description: '토닝을 룩으로 저장해 한 세트의 모든 사진에 적용하면 갤러리나 제품 그리드의 색이 맞아요.',
        },
      ],
      workedExamples: [
        {
          title: '24 MP 인물 사진에 파란 그림자와 호박색 밝은 영역',
          body: '6000 x 4000 JPEG(24 MP, 9.6 MB)예요. 그림자는 색조 220, 채도 40, 밝은 영역은 색조 40, 채도 30이고 균형은 0이라 분할 지점은 루마 0.5에 있어요. 그림자 회색 0.2는 그림자 가중치가 0.648이고 빨강 0.1676, 초록 0.1892, 파랑 0.2324, 8비트로는 (51, 51, 51) 대신 (43, 48, 59)가 돼요. 밝은 회색 0.85는 밝은 영역 가중치가 0.784이고 (217, 217, 217) 대신 (224, 219, 209)가 돼요. 0.5 회색은 (128, 128, 128) 그대로예요. 품질 92의 JPG로 내보내면 파일은 약 10.8 MB이고, 24 MP 전체 크기로 내보내려면 Premium 또는 Pro 요금제가 필요해요. 비회원이면 12 MP로 축소되어 약 5.4 MB가 돼요. 일반 작업 한 번이에요.',
        },
        {
          title: '균형을 올린 틸 앤 오렌지',
          body: '휴대폰으로 찍은 4000 x 3000 JPEG(12 MP, 4.1 MB)예요. 그림자는 색조 200, 채도 60, 밝은 영역은 색조 50, 채도 50이에요. 균형 +20은 분할 지점을 0.55로 옮겨요. 이제 0.2 회색은 그림자 가중치가 0.6995이고 (38, 55, 64)가 돼요. 0.5 회색은 그림자 가중치 0.0233을 받아 한 단계도 안 되게 움직여 (127, 128, 128)이 되고, 0.85 회색은 밝은 영역 가중치가 0.7407이고 (229, 225, 205)가 돼요. (0.3, 0.25, 0.2)인 갈색 그림자 픽셀은 (66, 67, 61)이 되어 눈에 띄게 차가워져요. 품질 85의 WebP로 내보내면 약 3.6 MB이고, 전체 크기로도 비회원 한도인 12 MP 안에 들어가요.',
        },
      ],
      whenNotToUse: '색을 더하는 것이 아니라 사진의 색 치우침을 없애고 싶을 뿐이라면 스플릿 토닝은 건너뛰세요. 색온도와 색조 슬라이더로 하는 화이트 밸런스 보정이나, 광도 유지를 켠 색상 균형 패널이 두 번째 색조를 만들어 내지 않고 색 치우침을 바로잡아요. 원하는 강도로 특정한 한 가지 색을 전체에 입히려면 색조 입히기 페이지의 포토 필터가 더 간단하고, 원하는 룩이 이미 .cube 파일로 있다면 LUT 페이지가 두 색조로 비슷하게 흉내 내는 대신 그 룩을 정확히 적용해요.',
      whyMediaManipulator: [
        'Aperture의 토닝은 상수까지 공개된 문서화된 공식이라서, 같은 슬라이더 값이면 브라우저 미리보기, 내보내기 서버, 휴대폰 앱에서 똑같은 픽셀이 나와요.',
        '색조를 조정하는 동안 사진에 관한 어떤 것도 브라우저를 벗어나지 않아요. 파일이 전송되는 것은 내보내기, 피사체 마스크, 복구뿐이고, 비회원 내보내기는 비회원 보관 기간이 적용되는 일반 작업이에요.',
        '스플릿 토닝 단계는 마스크, 커브, 레벨과 같은 스택에 있으므로, 두 색조 색 보정을 사진 전체가 아니라 하늘이나 특정 휘도 범위로 제한할 수 있어요.',
      ],
      privacyNote: '스플릿 토닝은 디코딩한 사진을 대상으로 브라우저에서 계산돼요. 파일은 내보내기, 피사체 선택, 복구를 할 때만 저희 서버로 전송되고, 그때 원본이 같은 그림자 가중치와 밝은 영역 가중치로 렌더링돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 로그인하면 원본과 1920 px 미리보기가 보관 기간 설정에 따라 남고, 프로젝트를 삭제하면 함께 삭제돼요.',
      faq: [
        {
          question: '균형 슬라이더는 실제로 무엇을 옮기나요?',
          answer: '그림자 가중치가 완전히 사라지고 밝은 영역 가중치가 올라가기 시작하는 루마 값을 옮겨요. 균형 0이면 그 지점이 루마 0.5에 있고, 균형 100마다 0.25씩 움직이므로 +40이면 0.6, -40이면 0.4로 옮겨 가요.',
        },
        {
          question: '중간 회색 픽셀은 왜 전혀 바뀌지 않나요?',
          answer: '균형이 0이면 그림자 가중치는 1 - smoothstep(0, 0.5, L), 밝은 영역 가중치는 smoothstep(0.5, 1, L)이에요. L = 0.5에서는 두 곡선이 모두 값이 없는 쪽 끝에 있으므로, 루마가 정확히 중간인 픽셀에는 색이 더해지지 않아요.',
        },
        {
          question: '색감은 얼마나 강해질 수 있나요?',
          answer: '게인 상수가 0.25이므로 채도 100에서 채널별 최대 이동량은 0.25 x 0.5 = 0.125, 255단계 중 약 32단계이고, 그것도 가중치가 완전히 1인 곳에서만 그래요. 그보다 더 필요하면 스플릿 토닝 레이어를 두 개 쌓으세요.',
        },
        {
          question: '스플릿 토닝이 밝기를 바꾸나요?',
          answer: '조금 바꿔요. 루마로 가중치를 준 뒤 채널별 이동량이 서로 완전히 상쇄되지 않기 때문이에요. 원래 휘도를 정확히 유지하고 채도와 색상만 움직이려면 레이어의 혼합 모드를 색상으로 설정하세요.',
        },
        {
          question: '그림자에만 토닝할 수 있나요?',
          answer: '네. 밝은 영역 채도를 0으로 두면 그림자 항만 반영되고, 이때 밝은 영역 색조 값은 완전히 무시돼요.',
        },
        {
          question: '흑백 사진에도 쓸 수 있나요?',
          answer: '가장 좋은 활용법 중 하나예요. 스플릿 토닝 레이어 아래에 흑백 레이어를 두세요. 회색 값이 루마 가중치를 제공하고, 두 색조가 사진의 유일한 색이 돼요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'HEIC, HEIF, TIFF, BMP는 서버가 편집 가능한 미리보기 사본을 만들어야 하므로 계정이 필요해요. 나머지 형식은 브라우저에서 디코딩돼요.',
          '계정이 없을 때와 무료 계정에서는 내보내기가 12메가픽셀로 제한되고, Premium과 Pro는 120메가픽셀까지 내보낼 수 있어요.',
        ],
      },
      related: [
        {
          label: '색상 균형',
          to: '/tools/color-balance-photo',
          description: '색조 대신 채널별로 제어하고 싶을 때, 그림자, 중간 톤, 밝은 영역 세 영역에서 RGB를 이동해요.',
        },
        {
          label: '사진에 색조 입히기',
          to: '/tools/tint-photo',
          description: '포토 필터 색 하나를 원하는 농도로 이미지 전체에 입혀요.',
        },
        {
          label: '흑백 사진',
          to: '/tools/black-and-white-photo',
          description: '톤을 더하기 전에 채널 슬라이더 여섯 개로 단색으로 변환해요.',
        },
        {
          label: 'LUT 적용',
          to: '/tools/apply-lut-to-photo',
          description: '룩이 이미 3D 표로 담겨 있다면 .cube 색 보정을 불러와요.',
        },
        {
          label: '커브',
          to: '/tools/photo-curves',
          description: '채널별 커브로 대비를 다듬어 토닝과 함께 쓰세요.',
        },
        {
          label: 'Aperture 튜토리얼',
          to: '/tutorials/aperture',
          description: '레이어, 마스크, 작업 내역, 내보내기를 다루는 편집기 안내예요.',
        },
      ],
      embed: {
        title: '사진에 스플릿 토닝 적용하기',
        description: '사진을 끌어다 놓으면 편집기가 스플릿 토닝 패널로 열려요. 두 색조와 균형을 정한 뒤 전체 크기로 내보내세요.',
      },
    },
    'apply-lut-to-photo': {
      name: 'LUT 적용',
      h1: '온라인에서 사진에 LUT(.cube) 적용하기',
      tagline: '사진에 .cube 3D LUT를 끌어다 놓고, 강도를 정한 뒤, 색 보정된 이미지를 전체 해상도로 내보내세요.',
      metaTitle: '사진에 LUT를 온라인으로 적용: 브라우저에서 .cube 파일 불러오기',
      metaDescription: '크기 65, 1 MB까지의 .cube 3D LUT를 불러와 사진에 입힌 색 보정을 바로 확인하고, 강도 슬라이더로 섞은 뒤 원본 크기로 내보내세요.',
      ogTitle: '온라인에서 사진에 LUT 적용하기',
      ogDescription: '사진에 .cube 색상 참조 표를 적용하세요. 삼선형 참조, 강도 혼합, 마스크와 레이어를 지원하고 원본 픽셀에서 내보내요.',
      intro: 'LUT는 모든 입력 색을 출력 색에 대응시키는 참조 표이고, 대부분의 카메라 프로필, 필름 에뮬레이션, 영상 색 보정은 .cube 형식으로 공유돼요. Aperture는 .cube 파일을 LUT 레이어로 받아요. 표는 브라우저에서 해석되어 바이트 단위로 양자화되고, 3D 텍스처로 GPU에 올라가 1920 px 미리보기의 모든 픽셀에 대해 삼선형 샘플링돼요. 이 과정은 스택에서 그 아래에 놓인 노출, 커브, 색상 레이어가 적용된 다음에 일어나요. 강도 슬라이더는 손대지 않은 픽셀과 표에서 찾은 픽셀 사이를 혼합해요. LUT 텍스트가 프로젝트 문서 안에 저장되므로 내보내기 서버도 같은 표를 읽어 원본 전체 크기에 같은 보간을 적용해요. 그래서 영상용으로 만든 색 보정이 24메가픽셀 사진에도 의도한 그대로 적용돼요.',
      whatItDoes: [
        'LUT 레이어를 추가해요. .cube 파일을 끌어다 놓거나 선택하면, 표 해석이 끝난 뒤 패널에 큐브 크기가 표시돼요.',
        '축당 2~65개 점, 텍스트 최대 1 MB인 모든 크기의 3D LUT를 적용하고, 가장 가까운 표 항목 여덟 개 사이를 삼선형 보간해요.',
        '강도 슬라이더(0~1)로 표에서 찾은 색과 입력 색을 혼합하므로, 강한 영화풍 색 보정도 절반 강도로 쓸 수 있어요.',
        '다른 모든 조정과 함께 쌓을 수 있어요. 노출이나 화이트 밸런스를 LUT 아래에 두어 표가 정돈된 이미지를 받게 하고, 커브나 그레인은 그 위에 두세요.',
        '클릭 한 번으로 표를 제거해도 레이어 자리는 남아 있고, 불러오기와 강도 변경은 모두 실행 취소할 수 있는 작업 내역에 기록돼요.',
      ],
      flowSteps: [
        {
          title: '사진 끌어다 놓기',
          description: '편집기가 LUT 패널로 열리고 이미지는 내 기기에서 디코딩돼요.',
        },
        {
          title: '.cube 파일 불러오기',
          description: 'LUT를 패널에 끌어다 놓거나 선택하세요. 크기 확인과 해석은 브라우저에서 이루어져요.',
        },
        {
          title: '강도 설정',
          description: '표 전체를 적용한 결과가 너무 강하면 강도를 1에서 내리세요. 전후 분할 보기로 비교할 수 있어요.',
        },
        {
          title: '내보내기',
          description: '형식, 품질, 크기를 고르세요. 서버가 같은 표로 원본을 렌더링해요.',
        },
      ],
      advancedDetails: [
        '.cube 파일은 일반 텍스트예요. LUT_3D_SIZE N 줄이 격자 크기를 선언하고, 선택 사항인 TITLE, DOMAIN_MIN, DOMAIN_MAX, LUT_3D_INPUT_RANGE 줄은 건너뛰며, 주석 줄은 #로 시작해요. 그 뒤에 실수 세 개로 된 N x N x N개의 행이 빨강이 가장 빠르게, 그다음 초록, 그다음 파랑 순으로 바뀌며 이어져요. 그래서 크기 33 큐브는 35,937행, 크기 65 큐브는 274,625행이에요.',
        '파서는 2~65의 헤더를 받아요. 3D 표만 지원하므로 LUT_1D_SIZE를 선언한 파일은 거부돼요. 텍스트는 1 MB(1,048,576바이트)로 제한되는데, 소수점 여섯 자리 값으로 된 크기 33 표가 이미 약 970 KB이므로 들어가는 흔한 격자 중 가장 큰 것은 33이에요. 크기 65 파일은 약 7 MB라서 해석하기 전에 너무 크다는 이유로 거부돼요.',
        '표의 모든 값은 round(value x 255)를 0..255로 제한해 한 바이트로 양자화되므로, 표를 RGB8 3D 텍스처로 올릴 수 있어요. 0.5는 128/255 = 0.50196이 돼요. 정밀도 손실은 이것뿐이며 8비트 내보내기 허용 오차보다 작아요.',
        '참조는 삼선형으로 이루어져요. 입력 색을 축마다 0..N-1로 늘리고, 아래쪽 셀 인덱스는 floor(value)를 N-2로 제한한 값이며, 결과는 주변 항목 여덟 개 사이에서 빨강, 초록, 파랑 순으로 lerp한 값이에요. 그다음 출력은 lerp(input, lookup, intensity)이므로 강도 0.6이면 표가 주는 변화의 60퍼센트가 반영돼요.',
        '색 보정된 미리보기는 사진의 1920 px 사본을 내 GPU(WebGL2)에서 그린 것이고, 내보낸 파일은 저희 서버가 같은 표와 같은 삼선형 공식으로 원본을 전체 해상도로 렌더링해요. 둘은 문서화된 작은 허용 오차, 즉 많아야 8비트 기준 몇 단계 안에서 일치하고, 그레인은 정확히 같아요.',
      ],
      whyItMatters: [
        'LUT는 색 보정을 주고받는 형식이에요. 동영상 편집기에서 만든 룩, 카메라 제조사의 로그-디스플레이 변환, 구매한 필름 팩을 슬라이더 하나하나로 다시 만들지 않고 사진에 쓸 수 있어요.',
        '3D 표는 주황색에만 영향을 주는 색조별 채도 변화처럼, 단순한 슬라이더를 어떻게 조합해도 재현할 수 없는 색 변환을 표현할 수 있어요.',
        '강도 혼합과 마스크가 고정된 표를 조절 가능한 것으로 바꿔 줘요. 필터와 편집의 차이가 바로 여기에 있어요.',
      ],
      useCases: [
        {
          title: '색 보정한 영상과 사진 맞추기',
          description: '동영상 프로젝트에 쓴 .cube를 비하인드 사진에도 적용하면 썸네일과 사진이 같은 색 보정을 공유해요.',
        },
        {
          title: '필름 에뮬레이션 팩',
          description: '구매했거나 무료인 에뮬레이션 LUT를 불러와 강도를 0.6으로 설정하면 표 전체보다 은은한 버전이 돼요.',
        },
        {
          title: '카메라 프로필 변환',
          description: '카메라의 중립 프로필로 내보낸 평평하고 대비가 낮은 이미지에 제조사가 제공하는 디스플레이 LUT를 쓰세요.',
        },
        {
          title: '고객 사진 세트의 일관성',
          description: 'LUT 레이어를 룩으로 저장하고 같은 촬영의 나머지 사진에 일괄 적용하세요. 무료 계정은 한 번에 3장, Pro는 최대 25장까지 돼요.',
        },
      ],
      workedExamples: [
        {
          title: '크기 33의 따뜻한 LUT, 강도 최대와 0.6 비교',
          body: '5472 x 3648 JPEG(20 MP, 8.3 MB)와, 빨강에 1.08을, 파랑에 0.92를 곱하는 표가 담긴 약 970 KB의 크기 33 .cube예요. 중간 회색 0.5는 표에서 빨강 0.5412, 초록 0.502, 파랑 0.4588, 즉 (138, 128, 117)로 바뀌어요. 초록 채널이 0.5가 아니라 0.502인 것은 0.5가 바이트 128로 저장되었기 때문이에요. 강도 0.6에서는 같은 회색이 (134, 128, 121)이 돼요. 피부 톤 (0.75, 0.6, 0.45)는 강도 최대에서 (207, 153, 106), 0.6에서 (201, 153, 109)가 돼요. PNG로 내보내면 20 MP 파일은 약 50 MB이고, 품질 90의 WebP로는 약 6 MB예요. 둘 다 12 MP 한도를 넘으므로 Premium 또는 Pro가 필요해요.',
        },
        {
          title: '하늘 픽셀에 크기 2의 항등 큐브 적용',
          body: '가장 작은 유효 LUT는 LUT_3D_SIZE 2에 8행이에요. 꼭짓점 색을 빨강이 가장 빠르게 바뀌는 순서(0 0 0, 1 0 0, 0 1 0, 1 1 0, 0 0 1, 1 0 1, 0 1 1, 1 1 1)로 적으면 항등 표가 돼요. 하늘 픽셀 (0.3, 0.6, 0.9)는 정확히 (0.3, 0.6, 0.9)로 돌아와요. 8개 꼭짓점 사이의 삼선형 보간은 채널마다 선형이고, 꼭짓점 바이트 0과 255는 정확하기 때문이에요. 두 번째 행과 다섯 번째 행을 맞바꾸면 빨강과 파랑 채널을 서로 바꾸는 표가 돼요. 4000 x 3000 JPEG(12 MP)는 전체 크기로도 비회원 한도 안에서 내보낼 수 있고, 품질 92로 약 5.4 MB이며 일반 작업 한 번이에요.',
        },
      ],
      whenNotToUse: '문제가 채널별 밝기 대응이라면 LUT를 꺼내지 마세요. 커브 패널이 편집 가능한 점 최대 16개로, 관리할 파일 없이 해결해요. 그림자와 밝은 영역에 색만 입히고 싶을 때도 마찬가지예요. 스플릿 토닝 페이지가 색조 슬라이더 두 개로 처리해요. 이미 디스플레이용으로 만들어진 JPEG에 로그-디스플레이 LUT를 적용하면 대비가 망가지니, 대신 기본 패널을 쓰세요. 그리고 표가 1 MB보다 크거나 1D LUT라면 먼저 다른 곳에서 변환해야 해요.',
      whyMediaManipulator: [
        'Aperture는 Darkroom이 동영상에 쓰는 것과 같은 .cube 파서와 삼선형 참조를 그대로 써요. 그래서 Media Manipulator에서 영상에 맞춘 색 보정을 여기서 사진에 적용해도 같은 색이 나와요.',
        'LUT는 마스크를 쓸 수 있는 비파괴 스택 안에서 적용되므로, 피사체 마스크로 피부는 그대로 두고 영화풍 표를 배경에만 적용할 수 있어요.',
        '표 텍스트가 프로젝트 문서와 함께 이동하므로, 저장한 프로젝트를 다시 열어도 색 보정이 그대로이고 내보내기도 파일이 아직 내 디스크에 있는지와 상관없어요.',
      ],
      privacyNote: '.cube 텍스트는 브라우저에서 해석되어 프로젝트 문서에 저장돼요. 사진 자체는 내보내기, 피사체 선택, 복구를 할 때만 업로드되고, 서버는 원본에 같은 표를 적용해요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 로그인한 상태의 프로젝트는 프로젝트나 계정을 삭제할 때까지 원본과 1920 px 미리보기를 보관 기간 설정에 따라 보관해요.',
      faq: [
        {
          question: '.cube 파일이 무엇인가요?',
          answer: 'Adobe Cube 형식의 텍스트 파일이에요. 격자 크기 N을 알려 주는 LUT_3D_SIZE 줄이 있고, 그 뒤로 0과 1 사이의 출력 값 세 개로 된 줄이 N의 세제곱만큼, 빨강이 가장 빠르게 바뀌는 순서로 이어져요. 각 줄은 격자 위 입력 색 하나에 대한 출력 색이고, 격자점 사이의 색은 보간돼요.',
        },
        {
          question: '어떤 LUT 크기와 파일 크기를 받나요?',
          answer: 'LUT_3D_SIZE 2~65, 파일 크기 1 MB 이하예요. 실제로는 1 MB 제한 때문에 불러올 수 있는 흔한 격자 중 가장 큰 것은 크기 33 큐브(35,937행)예요. 크기 17(약 130 KB)과 크기 25는 여유 있게 불러와져요.',
        },
        {
          question: '1D LUT는 왜 불러올 수 없나요?',
          answer: '3D 표만 지원하기 때문이에요. LUT_1D_SIZE를 선언한 파일은 잘못된 파일이라는 메시지와 함께 거부돼요. 만든 도구에서 3D 큐브로 변환하거나, 1D 표와 같은 일을 하는 커브 패널로 채널별 변환을 다시 만드세요.',
        },
        {
          question: 'LUT는 로그 이미지와 일반 이미지 중 무엇을 기대하나요?',
          answer: 'LUT마다 달라요. 카메라의 로그-디스플레이 표는 평평한 로그 영상을 기대하므로, 일반 JPEG에 적용하면 대비가 뭉개져요. 디스플레이 이미지용으로 만든 룩 계열 표가 일반 사진에 맞는 종류예요. 입력 색 공간이 맞지 않는 LUT는 강도 슬라이더로 바로잡을 수 없어요.',
        },
        {
          question: '색은 보간되나요, 아니면 격자에 맞춰 끊기나요?',
          answer: '보간돼요. 출력의 각 채널은 입력 색 주변 격자 항목 여덟 개를 삼선형으로 혼합한 값이므로, 크기 17 표에서도 눈에 띄는 계단 없이 부드러운 그레이디언트가 나와요.',
        },
        {
          question: 'LUT가 외부로 전송되나요?',
          answer: '아니요. 표는 프로젝트 문서에 보관되고, 브라우저에서 해석되며, 저희 내보내기 서버만 읽어요. 파일이나 사진에 관한 어떤 것도 다른 누구와도 공유되지 않아요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '.cube 표는 항목당 8비트로 양자화되고 삼선형으로 샘플링돼요. 1D LUT와 1 MB보다 큰 표는 거부돼요.',
          'HEIC, HEIF, TIFF, BMP 사진은 편집 가능한 미리보기를 만들려면 계정이 필요하고, 12메가픽셀보다 크게 내보내려면 Premium 또는 Pro가 필요해요.',
        ],
      },
      related: [
        {
          label: '커브',
          to: '/tools/photo-curves',
          description: '1D LUT가 하는 일을 최대 16개 점의 채널별 커브로 할 수 있어요.',
        },
        {
          label: '스플릿 토닝',
          to: '/tools/split-toning',
          description: '표가 없을 때 슬라이더로 두 색조 색 보정을 만들어요.',
        },
        {
          label: '사물 색상 바꾸기',
          to: '/tools/change-image-color',
          description: '색 범위마다 색조, 채도, 명도를 조절해 원하는 부분만 바꿔요.',
        },
        {
          label: '노출 보정',
          to: '/tools/fix-photo-exposure',
          description: 'LUT 아래에서 노출을 정돈해 표가 기대하는 밝기를 받게 하세요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '색 보정이 끝나면 내보낸 파일을 웹용으로 더 줄여요.',
        },
      ],
      embed: {
        title: '.cube LUT 적용하기',
        description: '사진을 끌어다 놓아 LUT 패널을 연 다음, 그 위에 .cube 파일을 끌어다 놓으세요. 강도를 정하고 내보내면 돼요.',
      },
    },
    'invert-image-colors': {
      name: '색상 반전',
      h1: '온라인에서 이미지 색상 반전하기',
      tagline: '모든 픽셀을 네거티브로 뒤집어요. 마스크를 씌우고, 혼합하고, 실행 취소할 수 있는 비파괴 레이어예요.',
      metaTitle: '이미지 색상을 온라인으로 반전: 사진의 네거티브 만들기',
      metaDescription: '클릭 한 번으로 브라우저에서 사진을 네거티브로 반전하세요. 각 채널은 1에서 원래 값을 뺀 값이 되며, 마스크를 씌우고 겹쳐서 전체 해상도로 내보낼 수 있어요.',
      ogTitle: '온라인에서 이미지 색상 반전하기',
      ogDescription: '마스크와 혼합을 쓸 수 있는 반전 레이어로 사진을 네거티브로, 스캔한 네거티브를 포지티브로 바꾸세요. 전체 크기로 내보내요.',
      intro: '이미지를 반전하면 모든 색이 반대색으로 바뀌어요. 검정은 흰색이, 짙푸른 하늘은 따뜻한 주황색이 되고, 스캔한 필름 네거티브는 볼 수 있는 포지티브가 돼요. Aperture에서는 효과 패널의 반전 항목이에요. 스택의 감마 공간 단계에 놓이는 조정 레이어로, sRGB로 인코딩된 픽셀의 각 채널을 1에서 뺀 값을 계산해요. 원본을 바꾸는 필터가 아니라 레이어라서, 마스크로 특정 영역에만 적용하거나, 불투명도를 낮춰 부분적으로만 반전하거나(정확히 50%에서는 모든 픽셀이 중간 회색이 돼요), 혼합 모드를 광도로 설정해 색조는 두고 톤만 뒤집거나, 레벨과 커브 아래에 쌓아 네거티브 변환을 마무리할 수 있어요. 같은 패널에 포스터라이즈, 한계값, 감마도 있어서 반전과 자연스럽게 함께 쓸 수 있어요.',
      whatItDoes: [
        '효과 패널에서 각 채널을 1에서 그 값을 뺀 값으로 바꾸는 반전 레이어를 추가해, 사진을 정확한 네거티브로 만들어요.',
        '마스크를 씌울 수 있어서, 선택한 영역이나 휘도 범위, 색상 범위만 반전하고 나머지는 촬영한 그대로 둘 수 있어요.',
        '불투명도와 표준, 광도, 색상 혼합 모드를 지원하므로 부분 반전, 톤만 반전, 색조만 반전이 가능해요.',
        '레벨, 커브, 다른 효과 항목과 함께 쌓을 수 있어서, 반전한 필름 스캔을 같은 프로젝트에서 색 보정할 수 있어요.',
        '반전한 결과를 원본에서 전체 해상도로 렌더링해 JPG, PNG, WebP, AVIF 또는 TIFF로 내보내고, 메타데이터는 유지하거나 제거할 수 있어요.',
      ],
      flowSteps: [
        {
          title: '사진 끌어다 놓기',
          description: '편집기가 효과 패널로 열리고 이미지는 브라우저에서 디코딩돼요.',
        },
        {
          title: '반전 추가',
          description: '효과 패널에서 반전을 선택하세요. 미리보기가 바로 네거티브로 바뀌어요.',
        },
        {
          title: '다듬기',
          description: '필요하면 마스크를 추가하거나, 불투명도를 낮추거나, 필름 스캔 보정을 위해 레벨과 커브를 위에 쌓으세요.',
        },
        {
          title: '내보내기',
          description: '형식과 크기를 고르세요. 서버가 같은 반전으로 원본을 렌더링해요.',
        },
      ],
      advancedDetails: [
        '공식은 0과 1 사이의 sRGB 인코딩 값에서 빨강, 초록, 파랑 각각에 대해 out = 1 - c예요. 루마 항도, 감마 변화도 없고, 입력이 이미 범위 안에 있으므로 제한할 것도 없어요. 8비트로 보면 값 v가 255 - v가 돼요.',
        '두 번 반전하면 1 - (1 - c) = c이므로 부동소수점 처리 과정에서는 정확히 원본으로 돌아오고, 내보낸 파일에서는 반올림 오차 안에서 돌아와요. 서버는 4메가픽셀까지의 이미지는 float64로, 그보다 큰 이미지는 float32로 렌더링하므로, 두 번 반전한 결과는 인코딩 후 원본과 많아야 8비트 기준 한 단계 차이가 나요.',
        '레이어 불투명도가 100% 미만이면 입력과 네거티브가 섞이므로, 불투명도 50%에서는 모든 픽셀이 0.5 회색 쪽으로 모여요. 0.2도 0.8도 모두 0.5가 돼요. 광도 혼합은 원래의 색조와 채도를 유지하고 반전된 루마만 가져오며, 색상 혼합은 그 반대예요.',
        '필름 스캔에서는 순서가 중요해요. 컬러 네거티브의 주황색 마스크는 전체에 걸친 색 치우침이므로, 반전 레이어를 먼저 두고, 그다음 히스토그램을 보고 채널별 입력 검정점과 입력 흰색점을 설정한 레벨, 그다음 커브를 두면 두 번 손볼 필요 없이 표준적인 변환이 돼요.',
        '반전된 미리보기는 사진의 1920 px 사본을 내 GPU(WebGL2)에서 그린 것이고, 내보낼 때는 저희 서버가 같은 뺄셈으로 원본을 전체 해상도로 렌더링해요. 두 결과는 문서화된 작은 허용 오차 안에서 일치해요. 색상 단계는 많아야 8비트 기준 몇 단계, 그레인은 정확히 같아요.',
      ],
      whyItMatters: [
        '스캔하거나 촬영한 컬러 네거티브는 반전하기 전까지는 알아볼 수 없어요. 레이어로 반전하면 색 치우침 보정과 반전을 각각 따로 편집할 수 있어요.',
        '반전한 선화, 청사진, 다이어그램은 어두운 배경에서 더 읽기 쉬워요. 클릭 한 번으로 만드는 네거티브가 검정 바탕에 흰 선 버전으로 가는 첫걸음이에요.',
        '부분 반전과 마스크를 씌운 반전은 디자인 도구이기도 해요. 솔라리제이션된 가장자리, 손대지 않은 배경 위의 반전된 피사체, 색은 그대로 두고 톤만 뒤집는 효과를 만들 수 있어요.',
      ],
      useCases: [
        {
          title: '촬영한 필름 네거티브 변환',
          description: '사진을 반전한 다음 레벨에서 채널별로 입력 검정과 입력 흰색을 설정해 주황색 베이스를 없애고, 커브로 마무리하세요.',
        },
        {
          title: '다이어그램의 다크 모드 버전',
          description: '흰 배경의 차트나 스케치를 반전해 어두운 슬라이드에 쓰고, 스캔이 검정이 아니라 회색이라면 한계값을 적용하세요.',
        },
        {
          title: '솔라리제이션 효과',
          description: '밝은 영역만 뒤집히도록 휘도 마스크를 추가하면 사바티에 효과 같은 느낌이 나요. 그냥 불투명도 50%로 반전하면 대신 프레임 전체가 중간 회색이 돼요.',
        },
        {
          title: '합성 이미지의 이음매 확인',
          description: '임시로 반전 레이어를 두면 붙여 넣은 가장자리를 따라 밝기가 어긋난 곳이 더 잘 보여요. 내보내기 전에 삭제하세요.',
        },
      ],
      workedExamples: [
        {
          title: '3000 x 2000 네거티브 스캔을 포지티브로',
          body: '계정으로 연 3000 x 2000 TIFF 스캔(6 MP, 약 18 MB)이에요. 반전은 필름 베이스 픽셀 (0.93, 0.08, 0.12)를 (0.07, 0.92, 0.88), 즉 (18, 235, 224)로 바꾸는데, 반전한 컬러 네거티브라면 어김없이 나타나는 파랑-청록 색 치우침이에요. 그 위에 마스터 채널의 입력 검정 0.06, 입력 흰색 0.86인 레벨 레이어를 두면 대비만 늘어나 0.3은 0.3으로, 0.7은 0.8로 바뀌고 색 치우침은 그대로 남아요. 색 치우침은 히스토그램을 보고 빨강, 초록, 파랑의 입력 점을 따로 설정해야 사라져요. PNG로 내보내면 약 15 MB, 품질 92의 JPG로는 약 2.7 MB예요. 사진 전체가 12 MP 한도 안에 들어가요.',
        },
        {
          title: '포스터를 위한 절반 반전과 완전 반전',
          body: '4000 x 3000 JPEG(12 MP, 4.5 MB)예요. 불투명도 50%의 반전 레이어에서 0.2는 네거티브 0.8과 섞여 0.5가 되고, 0.8은 0.2와 섞여 0.5가 되어 모든 픽셀이 정확히 중간 회색이 돼요. 그래서 절반 강도 반전만으로는 그림이 지워져요. 100%에서는 어두운 회색 (51, 51, 51)이 (204, 204, 204)가 돼요. 완전 강도의 반전 위에 레벨 0.5의 한계값 레이어를 추가하면, 반전 전 루마가 0.529인 하늘 픽셀은 반전 후 루마가 0.471이 되어 검정이 되고, 원래 0.5보다 어두웠던 것은 모두 흰색이 돼요. 품질 85의 WebP로 내보내면 약 3.6 MB이고 일반 작업 한 번이에요.',
        },
      ],
      whenNotToUse: '사진이 그저 너무 어둡거나 색 치우침이 있을 뿐이라면 반전은 맞는 도구가 아니에요. 노출은 기본 패널로, 색 치우침은 화이트 밸런스나 색상 균형으로 바로잡으세요. 채도를 뺀 이미지를 반전하는 것보다 채널 슬라이더가 있는 흑백 변환이 톤을 훨씬 세밀하게 다룰 수 있어요. 또 가장자리가 선명한 검정 바탕 흰 선 다이어그램이 필요하다면, 보통은 반전 자체보다 반전 뒤에 두는 한계값 레이어가 더 많은 일을 해요.',
      whyMediaManipulator: [
        'Aperture는 실행 취소, 작업 내역, 길게 눌러 원본 보기와 함께 반전을 비파괴로 유지하므로, 저장한 프로젝트에서 네거티브 변환을 여러 번에 걸쳐 다듬을 수 있어요.',
        '효과 패널이 같은 스택에서 레벨, 커브와 나란히 있어서, 필름 스캔 변환에 필요한 조합을 별도의 도구를 오가지 않고 그대로 쓸 수 있어요.',
        '반전한 결과는 외부 서비스를 거치지 않고 저희 서버에서 원본 픽셀로 렌더링되며, 비회원 내보내기는 일반 작업 한 번이에요.',
      ],
      privacyNote: '반전은 채널마다 뺄셈 한 번이며 브라우저에서 계산돼요. 사진은 내보내기, 피사체 선택, 복구를 할 때만 업로드되고, 그때 저희 서버가 원본을 같은 방식으로 반전해요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 계정이 있으면 원본, 미리보기, 썸네일이 프로젝트를 삭제할 때까지 보관 기간 설정에 따라 보관돼요.',
      faq: [
        {
          question: '반전은 네거티브를 만드는 것과 같나요?',
          answer: '네. 각 채널이 1에서 그 값을 뺀 값이 되는데, 그게 바로 네거티브예요. 8비트 (51, 51, 51)은 (204, 204, 204)가 되고, 하늘색 (89, 140, 217)은 따뜻한 (166, 115, 38)이 돼요.',
        },
        {
          question: '두 번 반전하면 원본으로 돌아오나요?',
          answer: '미리보기와 부동소수점 렌더링에서는 정확히 돌아와요. 1 - (1 - c)는 c이기 때문이에요. 내보낸 파일은 다시 인코딩한 뒤 원본과 많아야 8비트 기준 한 단계 차이가 날 수 있고, 손실 압축인 JPG로 내보내면 그 위에 압축 노이즈가 더해져요.',
        },
        {
          question: '사진의 일부만 반전할 수 있나요?',
          answer: '반전 레이어에 마스크를 추가하세요. 브러시, 그레이디언트, 방사형, 휘도 범위, 색상 범위, 피사체 마스크 모두 쓸 수 있고, 마스크 자체도 페더를 주거나 반전할 수 있어요.',
        },
        {
          question: '반전한 네거티브가 왜 여전히 주황색이나 파란색으로 보이나요?',
          answer: '컬러 네거티브 필름에는 주황색 베이스가 있어서 반전하면 파란 색 치우침이 돼요. 반전 위에 레벨 레이어를 추가하고 히스토그램을 보며 채널별로 입력 검정점과 입력 흰색점을 설정하세요. 반전에는 영향을 주지 않고 베이스 색을 중화할 수 있어요.',
        },
        {
          question: '효과 패널에는 또 무엇이 있나요?',
          answer: '포스터라이즈(채널당 2~255단계), 한계값(정한 레벨을 기준으로 루마에 따라 검정 또는 흰색), 감마(0.1~10의 거듭제곱 곡선)가 있어요. 각각 별도의 레이어이고 반전과 어떤 순서로든 쌓을 수 있어요.',
        },
        {
          question: '반전하면 투명도가 바뀌나요?',
          answer: '아니요. PNG나 WebP의 알파 채널은 그대로이고 빨강, 초록, 파랑만 뒤집히므로, 투명한 배경은 투명하게 남아요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '알파는 유지되고, 세 색상 채널만 반전돼요.',
          'TIFF 스캔과 BMP 파일은 편집 가능한 미리보기 사본을 만들려면 계정이 필요하고, JPG와 PNG 스캔은 브라우저에서 디코딩돼요.',
        ],
      },
      related: [
        {
          label: '포스터라이즈',
          to: '/tools/posterize-image',
          description: '같은 효과 패널에서 각 채널을 몇 단계로 줄여요.',
        },
        {
          label: '레벨',
          to: '/tools/photo-levels',
          description: '필름 스캔을 반전한 뒤 채널별 검정점과 흰색점을 설정해요.',
        },
        {
          label: '커브',
          to: '/tools/photo-curves',
          description: '대비 커브로 네거티브 변환을 마무리해요.',
        },
        {
          label: '흑백 사진',
          to: '/tools/black-and-white-photo',
          description: '반전 전이나 후에 단색으로 변환해 회색 네거티브를 만들어요.',
        },
        {
          label: '이미지에서 EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '내보낸 파일을 공유할 예정이라면 카메라 정보를 제거하세요.',
        },
      ],
      embed: {
        title: '사진 반전하기',
        description: '사진을 끌어다 놓아 효과 패널을 열고, 반전을 추가해 바로 네거티브를 만든 뒤 내보내세요.',
      },
    },
    'posterize-image': {
      name: '포스터라이즈',
      h1: '온라인에서 이미지 포스터라이즈하기',
      tagline: '모든 채널을 정한 단계 수로 줄여 뚜렷한 톤 단계가 있는 평평한 포스터풍 색감을 만드세요.',
      metaTitle: '이미지를 온라인으로 포스터라이즈: 채널당 2~255단계',
      metaDescription: '브라우저에서 각 채널을 2~255단계로 맞춰 사진을 포스터라이즈하세요. 띠 모양을 실시간으로 확인하고, 흑백과 겹쳐 원본 크기로 내보내요.',
      ogTitle: '온라인에서 이미지 포스터라이즈하기',
      ogDescription: '포스터라이즈 레이어로 사진을 평평한 색 띠로 줄이세요. 정확한 단계 계산, 마스크, 실행 취소, 전체 해상도 내보내기를 지원해요.',
      intro: '포스터라이즈는 각 색상 채널을 일정한 간격의 몇 가지 값으로 양자화해요. 그래서 부드러운 그라데이션이 평평한 띠로 바뀌고, 사진이 실크스크린 인쇄물처럼 보이기 시작해요. Aperture에서는 효과 패널의 포스터라이즈 항목으로, 2~255(기본값 4) 범위의 ‘레벨’ 슬라이더 하나로 조절해요. 레이어 스택에서 톤과 색상 단계 다음에 감마 공간 레이어로 적용돼요. ‘레벨’은 각 채널이 가질 수 있는 서로 다른 값의 개수예요. 2로 두면 채널마다 순수한 검정 아니면 흰색만 남아 전체 색은 여덟 가지가 되고, 4로 두면 64가지가 돼요. 조정 레이어이므로 마스크를 씌운 영역만 포스터라이즈하거나, 광도 혼합 모드로 원래 색조를 유지하거나, 아래에 흑백 레이어를 두어 전형적인 두 가지 톤 또는 세 가지 톤 포스터를 만들 수 있어요.',
      whatItDoes: [
        '‘레벨’ 슬라이더 하나가 있는 포스터라이즈 레이어를 추가해요. 2는 8가지, 4는 64가지, 8은 512가지 색을 만들며, 모두 간격이 균등해요.',
        '각 채널을 독립적으로 가장 가까운 허용 단계에 맞추므로, 한 픽셀의 빨강, 초록, 파랑이 서로 다른 단계에 놓일 수 있어요.',
        '1920 px 프록시와 히스토그램에서 띠 모양을 즉시 미리 보여 줘요. 히스토그램의 뾰족한 막대를 보면 어떤 단계가 쓰이고 있는지 정확히 알 수 있어요.',
        '마스크, 불투명도, 혼합 모드와 함께 쓸 수 있고, 흑백, 한계값, 커브 등 다른 레이어와 겹쳐 쌓을 수 있어요.',
        '양자화된 이미지를 원본 해상도에서 내보내요. 평평한 색을 정확히 유지하려면 PNG를, 그 밖에는 JPG, WebP, AVIF, TIFF를 고를 수 있어요.',
      ],
      flowSteps: [
        {
          title: '사진 끌어다 놓기',
          description: '이미지를 내 기기에서 바로 디코딩하고, 효과 패널이 열린 상태로 편집기가 시작돼요.',
        },
        {
          title: '포스터라이즈 추가',
          description: '포스터라이즈를 선택하고 ‘레벨’ 슬라이더를 설정하세요. 3~6에서 포스터 효과가 가장 강해요.',
        },
        {
          title: '톤 먼저 다듬기',
          description: '포스터라이즈 레이어 아래에 흑백이나 커브를 추가해 띠의 경계가 놓일 위치를 정하세요.',
        },
        {
          title: '내보내기',
          description: 'PNG는 평평한 색을 바이트 단위까지 정확히 유지하고, 높은 품질의 JPG는 파일이 더 작아요.',
        },
      ],
      advancedDetails: [
        '‘레벨’을 슬라이더 값으로 두면 코드는 n = levels - 1을 간격 수로 쓰고, 채널마다 floor(clamp(v, 0, 1) x n + 0.5) / n을 계산해요. 출력될 수 있는 값은 0, 1/n, 2/n, ... 1이므로, 검정과 흰색을 포함해 채널마다 정확히 levels개의 서로 다른 값이 생겨요.',
        'floor 앞의 + 0.5 덕분에 가장 가까운 값으로 반올림돼요. 단계 수 4(n = 3)에서 0.45는 floor(1.85) / 3 = 0.3333으로, 0.5는 floor(2.0) / 3 = 0.6667로 바뀌어요. 따라서 입력 기준으로 두 번째와 세 번째 띠의 경계는 0.5이고, 나머지 두 경계는 0.1667과 0.8333이에요.',
        '단계 수 2는 휘도가 아니라 채널별로 0.5에서 자르는 한계값이에요. (0.35, 0.55, 0.85) 픽셀은 (0, 1, 1), 즉 청록이 되지만, 한계값 레이어는 BT.709 휘도를 쓰므로 같은 픽셀을 흰색으로 출력해요. 단계 수 255는 8비트 입력에서 아무것도 바꾸지 않는 항등 변환이에요.',
        '채널마다 따로 양자화하므로 회색 그라데이션은 회색 띠가 되지만, 색이 있는 그라데이션은 한 채널만 경계를 넘는 단계마다 색조가 바뀌는 띠가 돼요. 이를 피하려면 아래에 흑백 레이어를 추가하고, 원래 색조를 유지하려면 광도 혼합 모드를 쓰세요.',
        '띠가 진 미리보기는 내 GPU(WebGL2)가 1920 px 사본으로 그려요. 내보내는 파일은 저희 서버가 같은 반올림 공식으로 원본을 전체 해상도로 렌더링하며, 두 결과는 문서화된 작은 허용 오차, 8비트 기준 많아야 몇 단계 이내에서 일치해요(그레인은 정확히 같아요).',
      ],
      whyItMatters: [
        '포스터라이즈는 실크스크린, 리소 인쇄, 팝아트 룩의 바탕이에요. 띠의 경계가 정확히 어디인지 알면 짐작하지 않고 커브로 경계를 원하는 곳에 둘 수 있어요.',
        '이미지를 평평한 색 몇 가지로 줄여 두면 벡터 트레이싱이나 스텐실 재단 전 준비 단계로도 유용해요.',
        '레이어라서 되돌릴 수 있고 마스크도 씌울 수 있어요. 그래서 피사체는 톤을 온전히 유지한 채 배경에만 포스터 효과를 줄 수 있어요.',
      ],
      useCases: [
        {
          title: '팝아트 인물 사진',
          description: '아래에 흑백, 위에 단계 수 3의 포스터라이즈를 두고, 스플릿 토닝으로 그렇게 생긴 두세 개의 띠에 색을 입히세요.',
        },
        {
          title: '스텐실과 실크스크린 준비',
          description: '흑백 이미지에 단계 수 2를 적용하면 채널마다 0.5에서 잘린 깔끔한 흑백 분리를 얻을 수 있어요.',
        },
        {
          title: '레트로 게임이나 픽셀 아트 색감',
          description: '크기를 줄인 사진에 단계 수 4~6을 적용하면 원본 색조를 유지하면서 제한된 팔레트에 가까운 느낌을 낼 수 있어요.',
        },
        {
          title: '톤 구조 드러내기',
          description: '임시로 단계 수 6 레이어를 두면 커브를 설정하는 동안 풍경의 톤 영역이 한눈에 보여요. 내보내기 전에 삭제하세요.',
        },
      ],
      workedExamples: [
        {
          title: '12 MP 풍경에 네 단계',
          body: '4000 x 3000 JPEG(12 MP, 4.8 MB)에 포스터라이즈를 단계 수 4, 즉 n = 3으로 적용해요. (0.35, 0.55, 0.85), 즉 (89, 140, 217)인 하늘 픽셀은 (0.333, 0.667, 1), 즉 (85, 170, 255)가 돼요. 0.5인 중간 회색은 floor(1.5 + 0.5) = 2이므로 0.667로 올라가고, 0.45는 0.333으로 내려가요. 그림자 값 0.1은 0이 되고 밝은 값 0.9는 1이 돼요. 히스토그램에는 채널마다 뾰족한 막대가 네 개 나타나요. PNG로 내보내면 같은 크기의 일반 사진이 30 MB쯤 되는 것과 달리 평평한 이미지라 약 12~15 MB이고, 품질 100의 WebP로는 약 2 MB예요. 일반 작업 한 번이며 비회원 한도 안이에요.',
        },
        {
          title: '피부에 여섯 단계, 이어서 두 단계',
          body: '3000 x 4000 인물 사진(12 MP, 5.1 MB)이에요. 단계 수 6(n = 5)에서 (0.78, 0.6, 0.5)인 피부 톤은 (0.8, 0.6, 0.6), 즉 (204, 153, 153)이 돼요. 0.5 x 5 + 0.5 = 3.0이 내림되어 3이 되므로 파랑 채널이 128에서 153으로 올라가요. 슬라이더를 단계 수 2(n = 1)로 바꾸면 모든 채널이 0.5 이상이라 반올림되므로 (1, 1, 1), 즉 흰색이 되고, (0.3, 0.25, 0.2)인 그림자는 (0, 0, 0)이 돼요. 기본 채널 배합의 흑백 레이어를 아래에 두면 같은 단계 수 2 분리로 깔끔한 두 가지 톤 스텐실이 만들어져요. PNG로 내보내면 약 8 MB예요.',
        },
      ],
      whenNotToUse: '포스터라이즈는 보정이 아니라 그래픽 효과예요. 없애고 싶은 밴딩이 있는 사진에 쓰면 밴딩이 오히려 늘어나니, 노이즈 감소나 완만한 커브 조정 쪽이 맞는 방향이에요. 밝기에 따라 순수한 흑백으로 오려 내려면 채널별이 아니라 휘도로 판단하는 한계값 레이어를 쓰세요. 파일 크기를 줄이려고 색 수를 줄이려는 거라면 이미지 압축 도구가 눈에 띄는 단계 없이 용량을 줄여 주고, 썸네일에는 팔레트를 줄이는 것보다 크기 조절이 더 효과적이에요.',
      whyMediaManipulator: [
        'Aperture는 정확한 양자화 공식을 공개하므로, 미리보기에서 보이는 띠는 내보내기 서버가 전체 해상도 원본으로 만드는 띠와 같아요.',
        '포스터라이즈 레이어에는 저희 GPU로 만드는 피사체 마스크를 포함해 여섯 가지 마스크를 씌울 수 있어요. 그래서 인물의 얼굴은 건드리지 않고 주변에만 포스터 효과를 줄 수 있어요.',
        'PNG로 내보내면 평평한 색이 정확히 유지되고 프로젝트는 계속 편집할 수 있어서, 나중에 4단계를 5단계로 바꿀 때도 처음부터 다시 할 필요 없이 슬라이더만 움직이면 돼요.',
      ],
      privacyNote: '포스터라이즈는 디코딩된 사진을 브라우저에서 채널별로 반올림하는 작업이에요. 내보내기, 피사체 선택, 복구를 하기 전에는 아무것도 업로드되지 않고, 내보낼 때 서버가 같은 단계 수로 원본을 양자화해요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 로그인한 상태라면 원본과 1920 px 미리보기는 프로젝트를 삭제할 때까지 보관 기간 설정에 따라 유지돼요.',
      faq: [
        {
          question: '‘레벨’ 숫자는 정확히 무엇을 뜻하나요?',
          answer: '각 채널이 가질 수 있는 서로 다른 값의 개수로, 0과 1을 포함해요. 단계 수 4에서는 채널마다 0, 0.333, 0.667, 1이 허용되므로, 한 픽셀은 4 x 4 x 4 = 64가지 색 중 하나가 될 수 있어요.',
        },
        {
          question: '띠의 경계는 어디에 생기나요?',
          answer: '반올림이 floor(v x n + 0.5) / n(n = levels - 1)이므로 이웃한 두 단계의 정중간에 생겨요. 단계 수 4의 입력 경계는 0.1667, 0.5, 0.8333이고, 단계 수 3에서는 0.25와 0.75예요.',
        },
        {
          question: '띠 경계에서 왜 색이 달라지나요?',
          answer: '채널마다 따로 반올림하므로, 그라데이션을 따라가다 보면 빨강 채널이 초록 채널보다 먼저 다음 단계로 넘어가 색조가 잠깐 바뀌어요. 색조를 안정적으로 유지하려면 포스터라이즈 레이어 아래에 흑백 레이어를 두거나, 혼합 모드를 광도로 설정하세요.',
        },
        {
          question: '단계 수 2의 포스터라이즈와 한계값은 어떻게 다른가요?',
          answer: '포스터라이즈 2는 각 채널을 0.5에서 잘라 8가지 색 중 무엇이든 출력할 수 있고, 한계값은 휘도를 정한 수준과 비교해 검정이나 흰색만 출력해요.',
        },
        {
          question: '단계 수를 255로 하면 달라지는 게 있나요?',
          answer: '8비트 사진에서는 없어요. n = 254이면 허용 단계의 간격이 1/254이고, 한 단계 이내에서 같은 8비트 값으로 다시 반올림되므로 사실상 아무 효과가 없어요. 슬라이더의 출발점으로만 쓸모가 있어요.',
        },
        {
          question: '어떤 내보내기 형식이 띠를 정확히 유지하나요?',
          answer: '무손실인 PNG예요. JPG는 품질이 낮을수록 압축 링잉이 생겨 띠의 날카로운 경계가 뭉개져요. 용량이 중요하다면 품질 100의 WebP나 높은 품질의 AVIF가 적절한 절충안이에요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '포스터라이즈한 평평한 색은 PNG로 아주 잘 압축돼요. 사진 기준인 메가픽셀당 2.5 MB 추정치가 평평한 그래픽 기준인 1.0 MB 쪽으로 내려가요.',
          '비회원과 무료 계정의 내보내기는 12메가픽셀로 제한되고, HEIC, TIFF, BMP는 편집 가능한 미리보기를 위해 계정이 필요해요.',
        ],
      },
      related: [
        {
          label: '색상 반전',
          to: '/tools/invert-image-colors',
          description: '효과 패널의 또 다른 항목으로, 사진을 네거티브로 뒤집어요.',
        },
        {
          label: '흑백 사진',
          to: '/tools/black-and-white-photo',
          description: '먼저 흑백으로 바꾸면 포스터라이즈가 깔끔한 회색 띠를 만들어요.',
        },
        {
          label: '커브',
          to: '/tools/photo-curves',
          description: '양자화하기 전에 톤을 띠 경계 너머로 옮기세요.',
        },
        {
          label: '컬러 팝',
          to: '/tools/color-pop',
          description: '한 가지 색만 남기고 나머지를 회색으로 바꿔 또 다른 그래픽 룩을 만드세요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '포스터라이즈한 이미지를 썸네일이나 아이콘 크기로 줄이세요.',
        },
      ],
      embed: {
        title: '사진 포스터라이즈하기',
        description: '사진을 끌어다 놓으면 효과 패널이 열려요. 포스터라이즈를 추가하고 단계 수를 설정한 뒤 내보내세요.',
      },
    },
    'reduce-image-noise': {
      name: '이미지 노이즈 줄이기',
      h1: '온라인에서 사진 노이즈 줄이기',
      tagline: '휘도 노이즈와 색상 노이즈를 따로 줄이고, 실시간 미리보기로 확인한 뒤 전체 해상도로 내보내세요.',
      metaTitle: '사진 노이즈를 온라인으로 줄이기: 휘도 및 색상 노이즈 제거',
      metaDescription: 'ISO가 높아 거친 사진의 노이즈를 브라우저에서 제거하세요. 휘도에는 양방향 필터, 색상에는 가우시안을 쓰고 100% 확대로 확인해 전체 해상도로 내보내요.',
      ogTitle: '온라인에서 사진 노이즈 줄이기',
      ogDescription: '휘도와 색상, 두 슬라이더로 높은 ISO 사진의 반점을 플라스틱처럼 만들지 않고 없애요. 실시간 미리보기, 전체 해상도 내보내기, 외부 AI 없음.',
      intro: 'Aperture의 노이즈 감소는 휘도와 색상, 두 슬라이더(각각 0~100)가 있는 디테일 레이어예요. 둘 다 Lab 색 공간에서 작동해요. 휘도 노이즈는 L 채널에서 가장자리를 보존하는 양방향 필터로 부드럽게 하고, 색상 얼룩은 a와 b 채널에서 일반 가우시안 흐림으로 부드럽게 해요. 그래서 색상은 휘도보다 훨씬 과감하게 올려도 사진이 흐려 보이지 않아요. 이 레이어는 다른 모든 조정과 같은 비파괴 스택에 들어가므로, 휘도 범위로 그림자에만 마스크를 씌우거나, 불투명도를 낮추거나, 나중에 빼 버릴 수 있어요. 미리보기는 드래그하는 동안 바로 갱신되고, 내보내는 파일은 같은 계산으로 원본 픽셀에서 렌더링돼요. 노이즈는 화면에 맞춘 배율에서는 보이지 않으니, 결정하기 전에 100%로 확인 버튼을 누르세요.',
      whatItDoes: [
        'Lab 명도 채널에 9 x 9 양방향 필터를 적용해 휘도 노이즈를 부드럽게 해요. 범위 기준을 넘는 가장자리는 보존되고 평평한 영역만 평균화돼요.',
        'Lab a, b 채널에 분리 가능한 가우시안을 적용해 색상 노이즈를 부드럽게 하고, 높은 ISO가 그림자에 남기는 보라색과 초록색 반점을 없애요.',
        '두 종류의 노이즈를 따로 다뤄요. 색상 60, 휘도 0으로 두면 색 얼룩은 깨끗해지고 그레인 같은 질감은 하나도 빠짐없이 그대로 남아요.',
        '불투명도, 혼합 모드, 선택 사항인 마스크가 있는 조정 레이어라서, 하늘이나 그림자에만 노이즈를 줄일 수 있어요.',
        '내보내기는 화면 미리보기가 아니라 원본 파일에서 같은 공식으로 저희 서버가 전체 해상도로 렌더링해요.',
      ],
      flowSteps: [
        {
          title: '사진 넣기',
          description: 'JPG, PNG, WebP, GIF, HEIC, HEIF, AVIF, TIFF, BMP를 쓸 수 있어요. 노이즈 감소가 보이는 디테일 패널이 앞에 열려요.',
        },
        {
          title: '100%로 확대',
          description: '100%로 확인을 눌러 이미지 픽셀 하나가 화면 픽셀 하나가 되게 하세요. 창에 맞춘 배율에서는 노이즈가 평균화되어 어떤 설정이든 괜찮아 보여요.',
        },
        {
          title: '색상, 그다음 휘도 설정',
          description: '색 반점이 사라질 때까지 색상을 올리세요. 보통 40~70이에요. 그다음 휘도는 그레인이 거슬리는 만큼만 올리세요. 20~40이면 질감이 유지돼요.',
        },
        {
          title: '내보내기',
          description: 'JPG, PNG, WebP, AVIF, TIFF 중 하나와 품질을 고르세요. 서버가 원본의 노이즈를 줄이고 파일을 인코딩하며, 원본은 절대 바뀌지 않아요.',
        },
      ],
      advancedDetails: [
        '휘도: 이미지를 CIE Lab(D65)으로 변환하고 L을 0..1로 맞춰요. 고정된 9 x 9 창(반경 4픽셀, 가장자리 픽셀 복제)의 양방향 필터를 공간 시그마 2 + 6 l, 범위 시그마 max(0.2 l, 0.001)로 적용하는데, 여기서 l은 휘도 슬라이더 값을 100으로 나눈 값이에요. 휘도 50에서는 공간 시그마 5 px, 범위 시그마 0.1, 즉 Lab 명도 10단위이고, 100에서는 공간 시그마 8 px, 범위 시그마 0.2예요.',
        '색상: Lab a, b 채널을 시그마가 6 c 픽셀인 분리 가능한 가우시안으로 흐리게 해요. c는 색상 슬라이더 값을 100으로 나눈 값이므로, 색상 50은 시그마 3 px, 색상 100은 시그마 6 px예요. 탭은 마이너스 ceil(3 sigma)부터 플러스 ceil(3 sigma)까지이고, float64로 정규화하며 가장자리 픽셀은 복제해요.',
        '필터를 거친 L, a, b는 표준 역행렬로 sRGB로 되돌리고, 결과는 0..1로 고정해요. 창과 시그마가 픽셀 단위이므로, 같은 슬라이더 값이라도 6000 px 원본보다 1920 px 미리보기에서 화면의 더 큰 부분을 부드럽게 해요. 결과는 100% 확대에서 판단하고, 내보낸 파일은 화면에 맞춘 미리보기보다 조금 덜 부드러워 보일 거라고 예상하세요.',
        '휘도가 0이면 양방향 필터 단계를 아예 건너뛰고, 색상이 0이면 가우시안을 건너뛰어요. 그래서 둘 다 0인 레이어는 아주 약한 흐림이 아니라 완전한 항등 변환이에요.',
        '미리보기는 내 GPU가 WebGL2로 사진의 1920 px 사본에서 그리고, 내보내는 파일은 저희 서버가 같은 공식으로 원본을 전체 해상도로 렌더링하며, 두 결과는 문서화된 허용 오차 안에서 일치해요. Aperture의 일치 정책에서 노이즈 감소는 허용 오차가 가장 느슨해서 평균 오차 많아야 8비트 기준 3단계, 최대 12단계이고, 색상 조정은 평균 1단계로 관리되며 그레인은 비트 단위까지 정확히 같아요.',
      ],
      whyItMatters: [
        '높은 ISO 노이즈는 대부분 색 반점이고, 색 정보는 세게 흐려도 눈에 띄게 흐릿해지지 않아요. 그래서 두 채널을 따로 다루면 하나로 합친 슬라이더보다 깨끗한 결과를 얻을 수 있어요.',
        '양방향 필터는 명도 차이가 범위 시그마를 넘는 가장자리를 지켜 줘요. 노이즈를 줄인 얼굴이 밀랍처럼 뭉개지지 않는 건 이 덕분이에요.',
        '레이어가 비파괴라서 백슬래시 키를 누른 채 100% 크롭을 비교하고, 파일에 굳어지기 전에 강도를 줄일 수 있어요.',
      ],
      useCases: [
        {
          title: 'ISO 6400의 공연과 야경 사진',
          description: '색상 60은 검은 부분의 자홍색과 초록색 얼룩을 없애고, 휘도 30은 무대 연무를 지우지 않으면서 그레인을 가라앉혀요.',
        },
        {
          title: '노출을 크게 올린 뒤 그림자 살리기',
          description: '그림자를 2 EV 올리면 숨어 있던 노이즈가 커져요. 노출 레이어 위에 노이즈 감소를 추가하고, 어두운 부분의 휘도 범위로 마스크를 씌우세요.',
        },
        {
          title: '오래된 인화 사진 스캔본',
          description: '스캐너 노이즈는 미세하고 대부분 휘도 노이즈예요. 휘도 40에 가벼운 색상 20(1.2 px 가우시안) 정도면 대개 충분해요. 그 뒤에는 텍스처를 0으로 두세요.',
        },
        {
          title: '어두운 배경의 제품 사진',
          description: '배경에 색상 범위 마스크를 씌워 배경만 노이즈를 줄이면, 제품 가장자리는 디테일을 한 픽셀도 잃지 않아요.',
        },
      ],
      workedExamples: [
        {
          title: 'ISO 6400 공연 JPG, 6000 x 4000, 24 MP, 11.4 MB',
          body: '색상 50, 휘도 50이에요. 명도와 색 모두 표준편차 약 6단계의 노이즈가 있는 평평한 회색 영역에서, 휘도 단계(공간 시그마 5 px, 범위 시그마 L 10단위)는 명도 편차를 약 0.7단계로, 색상 단계(시그마 3 px)는 색 편차를 약 0.4단계로 줄여요. 비회원 한도인 12 MP에서 품질 92의 JPG로 내보내면 약 5.4 MB이고, Premium으로 로그인해 전체 24 MP로 내보내면 약 10.8 MB예요. 일반 작업 한 번이에요.',
        },
        {
          title: '그림자를 올린 4032 x 3024 휴대폰 사진, 12.2 MP, 4.6 MB',
          body: '노출 +1.5 EV를 적용한 다음, 휘도 30, 색상 60의 노이즈 감소를 0~0.3 휘도 범위 마스크로 적용해요. 휘도 30에서 양방향 필터는 공간 시그마 3.8 px, 범위 시그마 0.06(L 6단위)을 써요. 같은 노이즈 영역의 명도 편차는 약 6단계에서 약 1.1로 떨어지지만, 20단계짜리 가장자리는 범위 시그마를 3배 넘게 웃돌기 때문에 그대로 남아요. 색상 60은 a와 b에 적용되는 3.6 px 가우시안이에요. 품질 85의 WebP로 내보내면 약 3.7 MB예요.',
        },
      ],
      whenNotToUse: '실제로는 선명한데 아주 낮은 JPG 품질로 저장된 사진에는 노이즈 감소를 쓰지 마세요. 8 x 8 블록 모양의 압축 아티팩트는 노이즈가 아니고, 양방향 필터는 그 가장자리를 없애기는커녕 보존해요. 원본이 있다면 원본에서 다시 인코딩하세요. 문제가 모션 블러나 초점이 빗나간 것이라면 아무리 부드럽게 해도 도움이 되지 않아요. 살짝 흐린 정도라면 사진 선명하게 페이지를 써 보세요. 일부러 거친 필름 룩을 원한다면 그레인을 없앨 게 아니라 더해야 하고, 같은 디테일 패널의 그레인 슬라이더가 비트 단위까지 정확한 내보내기로 그 일을 해 줘요.',
      whyMediaManipulator: [
        '두 단계 모두 실제 상수가 담긴 공개된 공식이고 블랙박스가 아니므로, 사진이 바뀌어도 결과를 예측할 수 있어요.',
        '노이즈 감소는 미리보기에서는 내 GPU에서, 내보내기에서는 저희 서버에서 실행되고, 외부 AI 서비스는 사진을 전혀 보지 않아요.',
        '노이즈 감소 레이어는 마스크, 샤프닝, 그레인과 한 프로젝트 안에서 함께 쌓이므로, 용도가 하나뿐인 도구 세 개를 오갈 필요가 없어요.',
      ],
      privacyNote: '노이즈 감소는 순수한 픽셀 필터라서 AI 서비스가 필요 없어요. 로그인하지 않았다면 사진은 내보낼 때까지 브라우저에 머물고, 내보낸 결과는 다른 비회원 작업처럼 보관돼요. 로그인했다면 원본과 1920 px 미리보기는 보관 기간 설정에 따라 유지되고 프로젝트와 함께 삭제돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 외부로는 아무것도 전송되지 않아요.',
      faq: [
        {
          question: '미리보기에서는 깨끗해 보였는데 내보낸 뒤에는 왜 아직 노이즈가 조금 있나요?',
          answer: '필터 창은 픽셀 단위로 정해져요. 1920 px 미리보기에서는 9 x 9 창이 전체 크기 원본에서보다 화면의 더 큰 부분을 덮으므로, 내보내기는 상대적으로 덜 부드럽게 해요. 실제 픽셀 배율을 보여 주는 100% 확대에서 판단하세요.',
        },
        {
          question: '휘도 슬라이더와 색상 슬라이더는 어떻게 다른가요?',
          answer: '휘도는 Lab 명도 채널에 양방향 필터를 적용하고 가장자리를 보존해요. 색상은 Lab a, b 채널에 가우시안을 적용하고 색조와 채도의 반점에만 영향을 줘요. 보통 색상은 휘도보다 훨씬 높게 올릴 수 있어요.',
        },
        {
          question: 'AI 노이즈 제거인가요?',
          answer: '아니요. 결정론적인 양방향 필터와 가우시안 필터의 조합이라 쓸 때마다 드는 비용이 없고 미리보기에서 바로 실행돼요. 편집기에서 AI 모델을 쓰는 단계는 피사체 선택과 복구뿐이에요.',
        },
        {
          question: '그림자에만 노이즈를 줄일 수 있나요?',
          answer: '네. 노이즈 감소 레이어에 휘도 범위 마스크를 씌우고 밝기 시작을 0, 밝기 끝을 약 0.35로 설정한 뒤 페더를 주면, 중간 톤과 밝은 영역은 디테일을 온전히 유지해요.',
        },
        {
          question: '노이즈 감소가 색을 바꾸나요?',
          answer: 'Lab 변환을 왕복해도 평평한 영역에서는 8비트 한 단계보다 훨씬 작은 차이로 정확해요. 다만 색상 값이 강하면 멀리 있는 꼬마전구 같은 작은 색 디테일이 주변과 평균화되어 채도가 낮아질 수 있어요.',
        },
        {
          question: '샤프닝은 노이즈를 줄이기 전에 해야 하나요, 후에 해야 하나요?',
          answer: '선명하게 레이어를 노이즈 감소 레이어 위에 두어 언샤프 마스크가 부드러워진 이미지를 보게 하세요. 샤프닝을 먼저 하면 그레인이 증폭되고, 노이즈 감소가 그걸 다시 없애야 해요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          'HEIC, HEIF, TIFF, BMP는 서버가 디코딩 가능한 미리보기 사본을 만들어야 하므로 계정이 필요해요. 나머지 형식은 브라우저에서 바로 열려요.',
          '계정이 없으면 내보내기는 12메가픽셀로 제한되고, Premium과 Pro는 120메가픽셀까지 내보낼 수 있어요.',
        ],
      },
      related: [
        {
          label: '사진 선명하게',
          to: '/tools/sharpen-photo-online',
          description: '노이즈를 줄인 뒤 휘도 채널의 양, 반경, 한계값으로 또렷함을 되살려요.',
        },
        {
          label: '노출 보정',
          to: '/tools/fix-photo-exposure',
          description: '그림자를 올리면 이 페이지에서 없애는 노이즈가 드러나요. 두 레이어는 함께 쌓을 수 있어요.',
        },
        {
          label: '비네팅 추가',
          to: '/tools/add-vignette',
          description: '야경 사진의 노이즈 많은 모서리를 부드럽게 하는 대신 어둡게 만들어요.',
        },
        {
          label: '색상으로 선택',
          to: '/tools/select-by-color',
          description: '노이즈 감소 레이어에 배경색 마스크를 씌워 피사체는 선명하게 유지해요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '노이즈는 용량을 차지해요. 노이즈를 줄인 JPG는 눈에 띄게 작게 압축돼요.',
        },
        {
          label: '편집기 가이드',
          to: '/tutorials/aperture',
          description: '레이어, 마스크, 작업 내역 패널이 어떻게 맞물리는지 알아보세요.',
        },
      ],
      embed: {
        title: '사진 노이즈 줄이기',
        description: '사진을 끌어다 놓으면 디테일 패널이 앞에 열린 상태로 열려요. 100%로 확대한 상태에서 색상과 휘도를 설정하세요.',
      },
    },
    'add-vignette': {
      name: '비네팅 추가',
      h1: '온라인에서 비네팅 추가하거나 제거하기',
      tagline: '중간점, 둥글기, 페더, 밝은 영역 보호로 사진 가장자리를 어둡게 또는 밝게 만드세요.',
      metaTitle: '비네팅을 온라인으로 추가·제거: 중간점, 둥글기, 페더',
      metaDescription: '브라우저에서 사진에 어둡거나 밝은 비네팅을 추가하거나, 양수 값으로 렌즈 비네팅을 상쇄하세요. 슬라이더 다섯 개, 실시간 미리보기, 전체 해상도 내보내기를 지원해요.',
      ogTitle: '온라인에서 비네팅 추가하거나 제거하기',
      ogDescription: '양을 음수로 두면 모서리가 어두워지고, 양수로 두면 밝아져 렌즈 주변부 광량 저하를 없애요. 중간점, 둥글기, 페더로 모양을 다듬고, 밝은 영역을 보호하고, 전체 크기로 내보내세요.',
      intro: 'Aperture 디테일 패널의 비네팅 섹션은 각 픽셀에 프레임 중앙에서 얼마나 떨어져 있는지에 따라 달라지는 계수를 곱해요. 양은 -100~100이에요. 음수 값은 가장자리를 어둡게 해 시선을 안쪽으로 모으는 전형적인 효과를 내고, 양수 값은 가장자리를 밝게 해요. 조리개를 최대로 연 렌즈의 자연스러운 주변부 광량 저하를 상쇄할 때 이 방법을 써요. 중간점은 효과가 시작되는 위치를, 페더는 얼마나 서서히 강해지는지를, 둥글기는 모양이 직사각형 프레임을 따를지 원을 따를지를 정하고, 하이라이트는 밝은 픽셀이 어두워지지 않도록 보호해요. 다른 디테일 레이어와 마찬가지로 마스크를 씌우고, 불투명도로 약하게 하고, 실행 취소할 수 있어요. GPU 미리보기와 서버 내보내기는 같은 거리 계산과 같은 smoothstep 램프를 써요.',
      whatItDoes: [
        '양을 음수로 두면 가장자리를 어둡게, 양수로 두면 밝게 하며, 각 픽셀에 1 + amount/100 곱하기 프레임 거리 계수를 곱해요.',
        '중간점에서 효과를 시작해 페더 폭에 걸쳐 smoothstep으로 강해지므로, 눈에 보이는 고리가 생기지 않아요.',
        '둥글기로 감쇠 모양을 정해요. -100은 프레임의 직사각형을 따르고, 0은 그 중간, 100은 프레임 중앙에 놓여 네 모서리에 닿는 진짜 원이에요.',
        '어둡게 할 때 밝은 픽셀을 보호해요. 하이라이트를 50으로 두면 휘도 0.9인 픽셀은 검은 픽셀의 55퍼센트만큼만 어두워져요.',
        '정규화된 프레임 좌표로 원본에서 전체 해상도로 내보내므로, 24 MP 파일에서도 미리보기와 같은 위치에 비네팅이 생겨요.',
      ],
      flowSteps: [
        {
          title: '사진 열기',
          description: 'JPG, PNG, WebP, HEIC 등의 사진을 끌어다 놓으세요. 비네팅 슬라이더가 보이는 디테일 패널이 열려요.',
        },
        {
          title: '방향 정하기',
          description: '은은하게 어둡게 하려면 양을 -30 정도로, 렌즈 때문에 어두워진 모서리를 밝히려면 +20~+40으로 드래그하세요.',
        },
        {
          title: '모양 다듬기',
          description: '중간점을 낮춰 효과를 안쪽으로 끌어오고, 페더를 높여 전환을 부드럽게 하고, 넓은 프레임에서 원형을 원하면 둥글기를 100으로 두세요.',
        },
        {
          title: '보호하고 내보내기',
          description: '밝은 하늘이 밝기를 유지하도록 하이라이트를 올리고, 백슬래시 키로 확인한 뒤 JPG, PNG, WebP, AVIF, TIFF로 내보내세요.',
        },
      ],
      advancedDetails: [
        '각 픽셀은 프레임 전체에서 -1~1 범위의 정규화 좌표 nx, ny를 가져요(픽셀 중심은 +0.5). 거리는 두 가지로 계산해요. 직사각형 거리는 max(|nx|, |ny|)이고, 원형 거리는 중심에서의 유클리드 거리(픽셀)를 대각선 절반 길이로 나눈 값이에요. 둘은 원형 쪽에 (roundness + 100)/200의 가중치를 두어 섞으므로, 둥글기 -100은 순수한 직사각형, 0은 50/50 혼합, 100은 순수한 원이에요. 어느 거리든 중심에서 0이고 네 모서리에서 정확히 1이에요.',
        '계수 v는 smoothstep(midpoint/100, midpoint/100 + feather/100, d)이에요. 거리가 중간점에 이를 때까지는 0, 중간점에 페더를 더한 값에 이르면 1이고, 그 사이는 3t 제곱 빼기 2t 세제곱의 삼차 곡선으로 부드럽게 이어져요. 기본값인 중간점 50, 페더 50에서 모서리까지 절반 지점의 픽셀은 v = 0, 사분의 삼 지점의 픽셀은 v = 0.5, d = 0.9인 픽셀은 v = 0.896이에요.',
        '픽셀에는 k = 1 + amount/100 곱하기 v 곱하기 prot를 곱한 뒤 0..1로 고정해요. prot는 양이 음수일 때 1 - highlights/100 곱하기 픽셀의 BT.709 휘도이고, 양수일 때는 1이에요. 따라서 밝게 하면 클리핑이 생겨요. 모서리에서 양 +30이면 0.8(204)인 픽셀이 1.0(255)이 돼요.',
        '6000 x 4000 프레임에서 둥글기 0일 때 짧은 변의 가운데는 d = 0.916, 긴 변의 가운데는 d = 0.777이에요. 둥글기 100이면 각각 0.832와 0.555가 되므로, 3:2 프레임에서 원형 비네팅은 위아래 가장자리를 좌우보다 눈에 띄게 밝게 남겨요.',
        'Aperture 미리보기는 내 GPU(WebGL2)가 1920 px 사본으로 그리고, 내보내기는 저희 서버가 같은 공식으로 원본을 전체 해상도로 렌더링하며, 두 결과는 문서화된 작은 허용 오차 안에서 일치해요. 비네팅의 허용 오차는 평균 오차 많아야 8비트 한 단계인데, 거리를 정규화된 프레임 단위로 계산해 픽셀 수와 상관이 없기 때문이에요.',
      ],
      whyItMatters: [
        '알맞은 중간점에서 시작하는 비네팅은 효과가 아니라 빛처럼 보여요. 중심에 너무 가깝게 시작하면 터널처럼 보여요.',
        '밝은 단렌즈의 주변부 광량 저하는 모서리에서 한 스톱이나 될 수 있는데, 양을 양수로 두고 페더를 넓게 주면 중앙은 건드리지 않고 이를 없앨 수 있어요.',
        '하이라이트 보호는 어둡게 하는 비네팅이 모서리의 밝은 하늘이나 흰 드레스를 탁하게 만들지 않게 해 줘요.',
      ],
      useCases: [
        {
          title: '복잡한 배경 앞의 인물 사진',
          description: '양 -35, 중간점 40, 페더 60, 둥글기 60이면 어두운 고리가 티 나지 않게 얼굴로 시선을 모아요.',
        },
        {
          title: '조리개를 최대로 연 35mm 렌즈 보정',
          description: '양 +25, 중간점 30, 페더 70, 둥글기 100이면 모서리 값이 최대 25%까지 올라가고 하늘이 고르게 돼요.',
        },
        {
          title: '흰 배경의 제품 사진',
          description: '하이라이트 80으로 약한 음수 비네팅을 주면 흰 배경은 하얗게 유지하면서 제품에 은근한 안정감을 줘요.',
        },
        {
          title: 'SNS용 정사각형 크롭',
          description: '기하학에서 먼저 자르기를 설정하세요. 비네팅은 잘라 낸 프레임 기준으로 계산되므로 모서리가 모서리에 그대로 남아요.',
        },
      ],
      workedExamples: [
        {
          title: '6000 x 4000 인물 사진 어둡게 하기, 24 MP JPG, 9.8 MB',
          body: '양 -40, 중간점 50, 페더 50, 둥글기 0, 하이라이트 0이에요. 모서리(d = 1, v = 1)에서 계수는 1 - 0.40 = 0.60이므로 128인 중간 회색은 77이 돼요. 짧은 변의 가운데는 d = 0.916, v = 0.925이고, 128이 약 81이 돼요. 바깥쪽으로 사분의 삼 지점에서는 v = 0.5이고 128이 102가 되며, d = 0.5 안쪽은 아무것도 바뀌지 않아요. 비회원 한도인 12 MP에서 품질 92의 JPG로 내보내면 약 5.4 MB이고, 일반 작업 한 번이에요.',
        },
        {
          title: '4000 x 6000 풍경의 렌즈 주변부 광량 저하 밝히기, 24 MP, Premium 계정',
          body: '양 +30, 중간점 30, 페더 70, 둥글기 100이에요. 모서리에서는 v = 1이고 계수는 1.30이므로, 160인 모서리 하늘은 208이 되고 196보다 큰 값은 모두 255로 클리핑돼요. 모서리까지 절반 지점은 d = 0.5, v = smoothstep(0.3, 1.0, 0.5) = 0.198이고, 160이 약 170이 돼요. 품질 90의 24 MP WebP로 내보내면 파일은 약 7.2 MB예요.',
        },
      ],
      whenNotToUse: '피사체가 프레임 가장자리에 있다면 비네팅은 건너뛰세요. 중앙 기준으로 어둡게 하면 피사체까지 어두워지니, 대신 피사체 위에 방사형 마스크를 놓은 로컬 보정을 쓰세요. 노출이 부족한 사진 전체를 밝히려고 양수 양을 쓰지 마세요. 모서리만 밝아지고 밝은 픽셀이 255에서 클리핑되지만, 노출 슬라이더는 모든 부분을 고르게 올려요. 단색 테두리나 사진을 두르는 액자를 원한다면 비네팅은 아예 맞지 않는 도구예요. 램프가 항상 부드럽기 때문이에요. 원하는 비율로 자른 다음 레이아웃 프로그램에서 테두리를 더하세요.',
      whyMediaManipulator: [
        '모양, 램프, 보호 방식이 모두 정확한 상수와 함께 공개되어 있어서, 마음에 드는 설정을 룩으로 저장하면 다음 사진에도 똑같이 적용돼요.',
        '비네팅이 레이어이므로 광도 모드로 혼합해 어두워진 가장자리에 색 변화가 생기지 않게 할 수 있어요.',
        '내보내기는 화면 미리보기를 늘리는 게 아니라, 같은 정규화 좌표로 원본에서 렌더링되며 Premium과 Pro에서는 최대 120 MP까지 지원해요.',
      ],
      privacyNote: '비네팅은 프레임 좌표와 픽셀 값만으로 계산되고 AI 단계가 없어요. 계정이 없으면 사진과 가장자리 어둡게 하기는 내보내기 전까지 브라우저를 떠나지 않고, 내보내기는 일반적인 비회원 작업으로 처리돼요. 계정이 있으면 원본과 1920 px 미리보기는 보관 기간 설정에 따라 저희 서버에 유지돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 외부 업체는 전혀 관여하지 않아요.',
      faq: [
        {
          question: '렌즈 때문에 생긴 비네팅을 사진에서 없애려면 어떻게 하나요?',
          answer: '양을 양수로 쓰세요. 렌즈의 주변부 광량 저하는 대체로 원형이고 모서리까지 이어지므로, 둥글기 100, 중간점 20~35, 페더 60~80에 양 +15~+40이면 대개 상쇄돼요. 밝게 하면 클리핑이 생기니 밝은 모서리는 255에서 날아가지 않는지 지켜보세요.',
        },
        {
          question: '비네팅이 미리보기에서는 둥근데 내보내면 왜 좌우 가장자리가 먼저 어두워지나요?',
          answer: '그렇지 않아요. 두 경우 모두 거리가 프레임에 맞게 정규화돼요. 모양을 바꾸는 건 둥글기예요. -100이면 직사각형을 따라 좌우 가장자리가 먼저 어두워지고, 100이면 프레임 중앙에 놓인 원이 돼요.',
        },
        {
          question: '하이라이트는 정확히 무슨 일을 하나요?',
          answer: '양이 음수일 때 각 픽셀이 어두워지는 정도에 1 - highlights/100 곱하기 그 픽셀의 휘도를 곱해요. 하이라이트 100에서는 순수한 흰색 픽셀은 전혀 어두워지지 않고, 중간 회색은 절반만큼 어두워져요. 양이 양수일 때는 효과가 없어요.',
        },
        {
          question: '비네팅이 자르기를 따라가나요?',
          answer: '네. 자르기와 수평 맞추기를 포함한 기하학은 어떤 레이어보다도 먼저 적용되므로, 중심과 모서리는 원본 파일이 아니라 잘라 낸 프레임의 것이에요.',
        },
        {
          question: '비네팅을 중앙에서 벗어난 위치에 둘 수 있나요?',
          answer: '비네팅 슬라이더로는 안 돼요. 항상 중앙 기준이에요. 중앙에서 벗어난 곳을 어둡게 하려면 방사형 마스크로 로컬 보정을 추가하고, 마스크를 반전한 뒤 노출을 낮추세요. 방사형 마스크는 중심, 크기, 회전을 드래그로 바꿀 수 있어요.',
        },
        {
          question: '어두운 비네팅이 모서리의 색을 바꾸나요?',
          answer: '곱셈이 R, G, B를 똑같이 스케일하므로 색조는 바뀌지 않지만, 어두운 모서리가 조금 더 채도가 높아 보일 수는 있어요. 색 정보를 원래대로 정확히 두고 싶다면 레이어의 혼합 모드를 광도로 설정하세요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '비네팅은 정규화된 프레임 좌표로 계산되므로, 12~120메가픽셀 중 어떤 크기로 내보내도 똑같아요.',
          'PNG 내보내기는 투명도를 유지해요. 회전으로 생긴 투명한 모서리도 다른 픽셀처럼 곱해지지만 투명한 상태로 남아요.',
        ],
      },
      related: [
        {
          label: '노출 보정',
          to: '/tools/fix-photo-exposure',
          description: '가장자리를 얼마나 어둡게 할지 정하기 전에 전체 밝기를 맞추세요.',
        },
        {
          label: '사진 수평 맞추기',
          to: '/tools/straighten-photo',
          description: '수평 맞추기와 자르기를 먼저 하세요. 비네팅은 최종 프레임 기준으로 계산돼요.',
        },
        {
          label: '스플릿 토닝',
          to: '/tools/split-toning',
          description: '따뜻한 밝은 영역과 차가운 그림자 톤은 부드럽게 어두워지는 가장자리와 잘 어울려요.',
        },
        {
          label: '흑백 사진',
          to: '/tools/black-and-white-photo',
          description: '고전적인 흑백 인화 사진에는 거의 언제나 이런 가장자리 번이 들어가 있었어요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '웹사이트에 맞는 특정 픽셀 크기가 필요하면 내보낸 뒤 크기를 조절하세요.',
        },
      ],
      embed: {
        title: '비네팅 추가하거나 제거하기',
        description: '사진을 끌어다 놓으면 디테일 패널이 열려요. 양을 음수로 드래그하면 가장자리가 어두워지고, 양수로 드래그하면 밝아져요.',
      },
    },
    'sharpen-photo-online': {
      name: '사진 선명하게',
      h1: '온라인에서 사진 선명하게 하기',
      tagline: '휘도에 적용하는 양, 반경, 한계값을 갖춘 언샤프 마스크에 더해 명료도와 텍스처까지, 100%로 확인하며 조절하세요.',
      metaTitle: '사진을 온라인으로 선명하게: 양, 반경, 한계값',
      metaDescription: '진짜 언샤프 마스크로 사진을 브라우저에서 선명하게 하세요. 양 0~500, 반경 0.1~50 px, 한계값 0~255에 명료도와 텍스처까지. 실시간 미리보기와 전체 해상도 내보내기.',
      ogTitle: '온라인에서 사진 선명하게 하기',
      ogDescription: '데스크톱 편집기처럼 양, 반경, 한계값을 조절하고, 100%로 확인 버튼과 중간 톤과 미세한 디테일을 위한 명료도와 텍스처까지 갖췄어요. 내보낼 때 전체 해상도로 렌더링돼요.',
      intro: 'Aperture 디테일 패널의 선명하게 섹션은 휘도에만 계산하는 고전적인 언샤프 마스크예요. 각 픽셀의 밝기를 가우시안 블러를 적용한 사본과 비교하고, 그 차이에 양을 곱해 세 채널 모두에 다시 더해요. 반경은 블러의 시그마를 픽셀 단위로 정해서 미세한 질감을 또렷하게 할지, 넓은 윤곽을 강조할지를 결정해요. 한계값은 지정한 8비트 단계 수보다 작은 차이를 무시하므로 매끈한 피부와 하늘이 거칠어지지 않아요. 같은 엔진을 고정 반경으로 쓰는 보조 슬라이더도 두 개 있어요. 긴 변의 2% 반경에서 중간 톤에 가중치를 두는 명료도, 그리고 미세한 디테일을 위한 0.3% 반경의 텍스처예요. 모든 결과는 내 GPU에서 실시간으로 미리 볼 수 있고, 내보낼 때는 원본에서 전체 해상도로 렌더링돼요.',
      whatItDoes: [
        '휘도에 언샤프 마스크를 적용해요. 픽셀 밝기와 반경 픽셀 크기의 가우시안 블러 사이의 차이에 양/100을 곱해 R, G, B에 더해요.',
        '한계값으로 평평한 영역을 그대로 둘 수 있어요. 한계값 8에서는 8단계 이하의 차이를 무시하므로 하늘의 노이즈는 선명해지지 않아요.',
        '명료도와 텍스처를 더해요. 명료도는 큰 반경(긴 변의 2%)에서 중간 톤에 가중치를 두는 샤프닝으로 힘을 주고, 텍스처는 작은 반경(0.3%, 최소 1.5 px)의 샤프닝으로 표면 디테일을 살려요. 둘 다 -100~100 범위라 음수 값은 오히려 부드럽게 만들어요.',
        '100%로 확인 버튼으로 캔버스를 화면 픽셀 하나당 이미지 픽셀 하나로 맞춰요. 샤프닝을 제대로 판단할 수 있는 배율은 이것뿐이에요.',
        '저희 서버에서 같은 가우시안 탭과 게인으로 원본을 내보내므로, 반경 1 px는 전체 크기 파일에서도 1 px예요.',
      ],
      flowSteps: [
        {
          title: '사진 놓기',
          description: '디테일 패널이 맨 앞에 열려요. 바로 100%로 확인을 누르세요.',
        },
        {
          title: '반경 고르기',
          description: '24 MP 파일의 미세한 디테일에는 0.6~1.0 px, 부드러운 렌즈나 작은 웹용 내보내기에는 1.5~2.5를 쓰세요. 반경을 더 키우면 헤일로가 눈에 띄게 생겨요.',
        },
        {
          title: '양 올리고 한계값 설정',
          description: '양은 보통 80~150이에요. 피부나 하늘이 자글자글해 보이기 시작하면 한계값을 4~10으로 올리세요.',
        },
        {
          title: '내보내기',
          description: '형식과 크기를 고르세요. 서버가 원본을 전체 해상도로 선명하게 하므로 그 뒤에 크기를 줄이면 조금 부드러워져요. 작게 내보낼 때는 조금 더 강하게 선명하게 하세요.',
        },
      ],
      advancedDetails: [
        '휘도 L은 BT.709 기준으로 sRGB 인코딩 값의 0.2126 R + 0.7152 G + 0.0722 B예요. 블러는 시그마가 반경과 같은 분리형 가우시안이고, 탭은 -ceil(3 sigma)부터 +ceil(3 sigma)까지이며, float64로 정규화하고 가장자리 픽셀은 복제해요. 차이 d = L - blur(L)는 |d|가 한계값/255보다 크지 않은 곳에서 영이 되고, 그다음 shift = 양/100 × d를 R, G, B 각각에 더한 뒤 결과를 0..1로 클램프해요.',
        '0.3(77)에서 0.7(179)로 바뀌는 계단형 윤곽에 반경 1, 양 100을 적용하면 윤곽에 가장 가까운 두 픽셀이 46과 209가 되고, 그다음 한 쌍은 71과 184가 돼요. 같은 양에 반경 2를 쓰면 36과 219가 되고 폭 세 픽셀의 헤일로가 생겨요(어두운 쪽에서 66, 54, 36). 반경 1에서 양 150은 31과 224를 만들어요.',
        '명료도는 같은 언샤프 마스크에 시그마를 긴 변 × 0.02(6000 px 파일에서 120 px)로, 게인을 양/100 × 0.6으로 두고, 중간 톤 가중치 W = 1 - |2L - 1|를 적용해요. 이 가중치는 중간 회색에서 1, 검정과 흰색에서 0이에요. 텍스처는 시그마 max(1.5, 0.003 × 긴 변), 즉 6000 px 파일에서 18 px와 게인 양/100 × 0.5를 쓰고, 가중치와 한계값은 없어요.',
        '명료도와 텍스처의 반경은 긴 변에 대한 비율이라 이미지 크기에 따라 함께 바뀌므로 1920 px 미리보기와 전체 크기 내보내기가 일치해요. 반면 선명하게의 반경은 절대 픽셀 단위라 미리보기에서는 프록시 배율로 보여요. 100%로 확인 버튼이 있는 이유가 바로 이거예요.',
        'Aperture는 1920 px 사본으로 내 GPU(WebGL2)에서 미리보기를 그리고, 같은 공식으로 저희 서버에서 원본을 전체 해상도로 렌더링해 내보내며, 둘의 차이를 문서화된 작은 허용 오차 안에 유지해요. 샤프닝과 그 밖의 컨볼루션 연산은 평균 오차가 많아야 1.5단계, 최대 8단계(8비트 기준)이고, 색상 연산은 평균 1단계, 그레인은 정확히 일치해요.',
      ],
      whyItMatters: [
        '노브 하나짜리 샤프닝으로는 미세한 디테일과 윤곽 대비를 구분할 수 없어요. 머리카락은 또렷하게, 피부는 매끈하게 지켜 주는 건 반경과 한계값이에요.',
        '휘도에만 샤프닝하면 RGB 언샤프 마스크가 대비가 강한 윤곽을 따라 만드는 색 번짐을 피할 수 있어요.',
        '100%로 확인하면 가장 흔한 실수, 즉 브라우저가 이미 축소해서 보여 주던 화면 맞춤 미리보기를 보고 과하게 선명하게 하는 실수를 막을 수 있어요.',
      ],
      useCases: [
        {
          title: '웹용 출력 샤프닝',
          description: '가로 2048 px로 내보내고 양 120, 반경 0.7, 한계값 2로 축소 때문에 부드러워진 만큼을 상쇄하세요.',
        },
        {
          title: '살짝 부드러운 렌즈나 빗나간 초점',
          description: '24 MP 파일에서 반경 1.8, 양 90이면 겉보기 윤곽 대비가 살아나요. 반경 2.5를 넘으면 헤일로 때문에 티가 나요.',
        },
        {
          title: '인물 사진',
          description: '양 100, 반경 1에 한계값 10을 쓰면 눈, 속눈썹, 머리카락은 선명해지고 피부 톤의 10단계 잔물결은 그대로 남아요.',
        },
        {
          title: '건축과 풍경',
          description: '중간 톤에 힘을 주는 명료도 25와 돌, 나뭇잎을 위한 텍스처 30을 더한 뒤, 반경 0.8로 선명하게를 가볍게 적용하세요.',
        },
      ],
      workedExamples: [
        {
          title: '6000 x 4000 풍경 사진의 출력 샤프닝, 24 MP, 10.8 MB JPG',
          body: '선명하게를 양 100, 반경 1, 한계값 0으로 설정하고 Premium 계정에서 24 MP로 내보냈어요. 77/179 윤곽을 따라 가장 가까운 두 픽셀은 46과 209, 그다음 한 쌍은 71과 184가 되고, 세 픽셀 떨어진 픽셀은 변화량이 한 단계에 못 미쳐요. 명료도 25를 더하면 게인 0.15로 중간 톤에 가중치를 둔 시그마 120 px 언샤프 마스크가 적용돼요. 넓은 주변보다 0.1 밝은 중간 회색 픽셀은 0.015, 약 4단계 올라가요. JPG 품질 92로 내보내면 약 11.3 MB로, 선명하게 하지 않은 파일보다 5% 커져요.',
        },
        {
          title: '4032 x 3024 휴대폰 인물 사진, 12.2 MP, 3.9 MB HEIC, 로그인 상태',
          body: '양 120, 반경 0.8, 한계값 8로 설정했어요. 뺨의 2단계 잔물결(130, 126, 130, 126)은 한계값보다 작아서 정확히 그대로 남아요. 한계값이 0이었다면 같은 픽셀이 약 131과 124가 됐을 거예요. 89 대 149인 속눈썹 윤곽은 가장 가까운 두 픽셀이 71과 167로 밀려나 양쪽으로 18단계씩 벌어져요. WebP 품질 90 내보내기는 일반 작업 한 번이고, 약 3.1 MB예요.',
        },
      ],
      whenNotToUse: '이미 노이즈가 많거나 JPG 압축이 심한 사진은 한계값 없이 선명하게 하지 마세요. 언샤프 마스크가 진짜 디테일보다 그레인과 블록 경계를 먼저 키우기 때문이에요. 먼저 노이즈를 줄이거나 한계값을 올리세요. 실제 모션 블러나 크게 빗나간 초점은 어떤 언샤프 마스크로도 되돌릴 수 없어요. 언샤프 마스크는 이미 있는 윤곽의 대비만 높이므로 3 px가 넘는 반경은 헤일로만 그려요. 작은 이미지를 빠르게 고르게 또렷하게 하기만 하면 된다면, Media Manipulator의 한 번에 끝나는 ‘이미지 선명하게’ 도구가 더 빠르고 편집기 세션도 필요 없어요.',
      whyMediaManipulator: [
        'Aperture는 숨은 설정이 있는 강도 슬라이더 하나 대신 언샤프 마스크의 실제 컨트롤 세 가지를 제공하고, 그 공식까지 문서로 공개해요.',
        '선명하게 레이어는 노이즈 감소 위에 쌓이고 원하면 마스크로 범위를 제한할 수 있으며, 결과는 내 GPU에서 즉시 미리 볼 수 있어요.',
        'Premium과 Pro에서는 최대 120 MP까지 전체 해상도로 렌더링해 내보내므로, 100%에서 맞춘 반경이 그대로 최종 파일의 반경이 돼요.',
      ],
      privacyNote: '샤프닝은 로컬 컨볼루션이라 AI 서비스를 전혀 호출하지 않아요. 계정이 없으면 사진과 선명하게 설정은 내보낼 때까지 이 브라우저에 남고, 내보낼 때 그 한 번의 렌더링을 위해 비회원 작업으로 파일이 업로드돼요. 계정이 있으면 원본, 1920 px 미리보기, 썸네일이 보관 기간 설정에 따라 저희 서버에 남고, 프로젝트를 삭제하면 함께 삭제돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 어떤 외부 업체와도 공유하지 않아요.',
      faq: [
        {
          question: '24 MP 사진을 선명하게 하려면 반경을 얼마로 해야 하나요?',
          answer: '전체 크기로 볼 미세한 디테일에는 0.6~1.0 px예요. 몇천 픽셀로 줄일 이미지라면 출력에 맞춰 선명하게 하세요. 그 크기로 내보내면서 0.5~0.8 px에 양을 더 높여 쓰면 돼요.',
        },
        {
          question: '샤프닝에서 한계값은 어떤 역할을 하나요?',
          answer: '|L - blur(L)|이 threshold/255보다 크지 않은 곳에서는 휘도 차이를 영으로 만들어요. 한계값 8에서는 하늘의 2단계 잔물결이 131/124가 되지 않고 130/126으로 남지만, 100단계 윤곽은 온전히 선명해져요.',
        },
        {
          question: 'Media Manipulator의 ‘이미지 선명하게’ 도구와 무엇이 다른가요?',
          answer: '그 페이지는 강도가 고정된 한 번짜리 ImageMagick 필터예요. 이 도구는 양, 반경, 한계값을 갖춘 레이어이고, 100% 실시간 미리보기와 바로 옆의 명료도와 텍스처, 그리고 눈만 선명하게 할 수 있는 마스크까지 갖췄어요.',
        },
        {
          question: '다른 편집기에서는 샤프닝하면 윤곽에 색이 번지는데, 여기서는 왜 그렇지 않나요?',
          answer: 'RGB 언샤프 마스크는 각 채널을 따로 강조하므로 색수차가 과장돼요. 여기서는 차이를 BT.709 휘도로 계산하고 같은 변화량을 R, G, B에 더하므로 윤곽을 따라 색조가 유지돼요.',
        },
        {
          question: '명료도와 선명하게, 어느 쪽을 써야 하나요?',
          answer: '선명하게는 몇 픽셀 반경에서 작동해 윤곽에 영향을 주고, 명료도는 긴 변의 2% 반경에서 중간 톤에 가중치를 두고 작동해 형태 전체의 국소 대비를 높여요. 대부분의 사진에는 둘 다 조금씩 쓰고, 미세한 표면에는 텍스처를 더하면 좋아요.',
        },
        {
          question: '샤프닝하면 파일이 커지나요?',
          answer: '네, 조금 커져요. 선명해진 윤곽에는 JPG 인코더가 보존해야 할 고주파 성분이 더 많아요. 같은 품질에서 대략 5~10% 정도 용량이 늘어난다고 보면 돼요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '반경은 내보낸 파일의 픽셀 단위예요. 내보내기를 12 MP로 제한하면 서버는 샤프닝한 뒤에 결과의 크기를 줄여요.',
          'TIFF 내보내기는 메가픽셀당 약 3 MB이고, JPG 링잉 없이 선명하게 한 모든 단계를 보존해요.',
        ],
      },
      related: [
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '선명해진 윤곽은 용량을 늘려요. 내보낸 뒤 파일 크기를 다시 확인하세요.',
        },
        {
          label: '이미지 노이즈 줄이기',
          to: '/tools/reduce-image-noise',
          description: '먼저 노이즈를 줄이고 그 위에서 선명하게 해야 그레인이 커지지 않아요.',
        },
        {
          label: '대비 조정',
          to: '/tools/adjust-image-contrast',
          description: '전체 대비와 명료도는 서로 다른 문제를 해결해요. 나란히 비교해 보세요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '크기를 줄이면 부드러워져요. 결과물이 작을 때는 조금 더 선명하게 하세요.',
        },
        {
          label: '잡티 제거',
          to: '/tools/remove-blemishes',
          description: '잡티가 강조되지 않도록 선명하게 하기 전에 먼저 복구하세요.',
        },
        {
          label: '편집기 가이드',
          to: '/tutorials/aperture',
          description: '패널, 레이어, 마스크, 키보드 단축키를 한곳에서 확인하세요.',
        },
      ],
      embed: {
        title: '사진 선명하게 하기',
        description: '사진을 놓으면 디테일 패널이 열려요. 100%로 확인을 누르고 양, 반경, 한계값을 설정하세요.',
      },
    },
    'straighten-photo': {
      name: '사진 수평 맞추기',
      h1: '온라인에서 비뚤어진 사진 수평 맞추기',
      tagline: '기울어진 수평선을 각도로 또는 선을 그어 바로잡고, 가장 큰 직사각형으로 자동 자르기 하세요.',
      metaTitle: '비뚤어진 사진을 온라인으로 바로잡기: 기울어진 수평선 수정',
      metaDescription: '브라우저에서 기울어진 수평선을 맞추세요. 각도를 입력하거나 수평선을 따라 선을 그리고, 가장 큰 안쪽 직사각형으로 자동 자르기 한 뒤 전체 해상도로 내보내요.',
      ogTitle: '온라인에서 비뚤어진 사진 수평 맞추기',
      ogDescription: '수평선을 따라 선을 그으면 회전이 자동으로 설정돼요. 자동 자르기로 가장 큰 직사각형을 남기거나, 모서리를 투명, 가장자리 또는 색상으로 채우세요.',
      intro: '수평 맞추기는 Aperture의 기하학 패널에 있고, 어떤 조정 레이어보다도 먼저 원본 픽셀에 적용돼요. 각도를 도 단위로 입력하거나, 선 그리기를 누르고 수평 또는 수직이어야 하는 대상을 따라 드래그하세요. 편집기가 그은 선의 기울기를 계산해 -45~45도 범위로 접어 넣고, 그 기울기를 상쇄하도록 회전 값을 설정해요. 회전은 역매핑 방식의 쌍선형 리샘플링 한 번으로 처리되므로 픽셀은 정확히 한 번만 샘플링돼요. 기본적으로는 실제 픽셀만 담기는, 회전한 캔버스 비율의 중앙 정렬된 가장 큰 직사각형으로 프레임을 자동으로 잘라요. 이 옵션을 끄면 모서리를 투명, 늘린 가장자리 또는 직접 고른 색상으로 채워요. 자르기, 뒤집기, 원근도 같은 단일 리샘플링을 함께 써요.',
      whatItDoes: [
        '원본 픽셀을 쌍선형 리샘플링 한 번으로 -360~360도 사이의 어떤 각도로든 회전해요. 90도와 180도 단위 회전은 픽셀을 그대로 복사해요.',
        '그은 선으로 각도를 정해요. 선의 기울기를 (-45, 45]도 범위로 감싼 뒤 빼므로, 수평선을 따라 그어도 문틀을 따라 그어도 똑같이 작동해요.',
        '회전한 원본 안에 둘레 전체가 들어가는, 회전한 캔버스 비율의 중앙 정렬된 가장 큰 직사각형으로 자동 자르기 해요. 이 직사각형은 30단계 이진 탐색으로 찾아요.',
        '회전한 프레임 전체를 남기고 싶다면 빈 모서리를 투명, 클램프한 가장자리 픽셀 또는 단색으로 채워요.',
        '마스크 위치를 맞춰 줘요. 모든 마스크는 수평을 맞추고 자른 좌표 공간에 저장되고, 내보내기는 원본에 같은 기하학 변환을 적용해 렌더링해요.',
      ],
      flowSteps: [
        {
          title: '사진 놓기',
          description: '수평 맞추기 섹션과 선 그리기 버튼이 있는 기하학 패널이 맨 앞에 열려요.',
        },
        {
          title: '수평선 따라 그리기',
          description: '선 그리기를 클릭하고 수평선의 한쪽 끝에서 반대쪽 끝까지 드래그하세요. 8 px보다 짧은 드래그는 무시돼요. 각도 입력란이 바뀌어요.',
        },
        {
          title: '자르기 확인',
          description: '가장 큰 직사각형으로 자동 자르기가 기본으로 켜져 있어요. 모서리를 남기려면 끄고 채우기 방식을 고르세요.',
        },
        {
          title: '내보내기',
          description: '서버가 원본을 전체 해상도로 회전하고 잘라 JPG, PNG, WebP, AVIF 또는 TIFF로 인코딩해요.',
        },
      ],
      advancedDetails: [
        '회전한 캔버스는 회전한 원본의 경계 상자만큼 커져요. 폭은 |w cos| + |h sin|, 높이는 |w sin| + |h cos|이고 반올림해요. 6000 x 4000 사진을 2.5도 회전하면 캔버스는 6169 x 4258이 돼요. 각 출력 픽셀의 중심은 자르기, 원근 호모그래피, 뒤집기, 역회전을 차례로 거꾸로 거쳐 연속적인 원본 좌표로 되돌아가고, 이웃한 네 픽셀에서 쌍선형으로 샘플링돼요. 원본 바깥 좌표에는 채우기가 적용돼요.',
        '자동 자르기는 캔버스 비율로 중앙에 놓인 직사각형의 둘레를 따라 놓인 100개의 샘플 지점(변마다 25개)이 모두 원본 안에 들어가는 최대 배율 s를 찾아요. s에 대해 이진 탐색을 30번 반복해요. 6000 x 4000에 2.5도를 적용하면 캔버스의 가로세로 각각 88.44%를 자르게 되어 5456 x 3766 픽셀(캔버스 비율인 1.45:1), 20.55 MP가 되고, 원본 픽셀의 85.6%가 남아요. 1.2도에서는 92.5%, 5도에서는 약 75%가 남아요.',
        '선 그리기: 화면 좌표(y는 아래 방향)에서 선의 각도는 atan2(dy, dx)를 도 단위로 바꾼 값이고, 90의 배수를 빼서 (-45, 45] 범위로 줄인 다음 그 부호를 뒤집어 현재 회전에 더하고 0.01도 단위로 반올림해요. 1920 px 미리보기에서 (200, 1080)부터 (1800, 1020)까지 그은 선은 2.15도 기울어져 있으므로 회전이 +2.15로 설정돼요.',
        '채우기: 투명은 원본 바깥에 RGBA 0을 써요(PNG와 WebP는 이를 유지하고 JPG에서는 검정으로 보여요). 가장자리 늘리기는 샘플을 가장 가까운 가장자리 텍셀로 클램프하고, 색상은 불투명한 #rrggbb를 써요. 쌍선형 보간은 알파 채널에도 적용되므로 투명 채우기에는 한 픽셀 폭의 부드러운 경계가 생겨요.',
        'Aperture는 1920 px 사본으로 내 GPU(WebGL2)에서 미리보기를 그리고, 같은 공식으로 저희 서버에서 원본을 전체 해상도로 렌더링해 내보내며, 둘은 문서화된 작은 허용 오차 안에서 일치해요. 기하학 변환의 경우 2 px 테두리를 제외한 안쪽 영역에서 최대 2단계(8비트 기준)예요. 두 배율에서 쌍선형 샘플 위치가 조금씩 다르기 때문이에요. 색상 연산은 평균 1단계 안으로 유지되고 그레인은 정확히 일치해요.',
      ],
      whyItMatters: [
        '수평선은 단 한 도만 기울어도 바다나 호수 사진에서 눈에 띄고, 보는 사람이 가장 먼저 알아차리는 부분이에요.',
        '슬라이더를 조금씩 움직이는 것보다 선을 긋는 쪽이 더 빠르고 정확해요. 기울기를 눈대중으로 짐작하는 대신 편집기가 직접 측정하니까요.',
        '자르기로 픽셀이 얼마나 줄어드는지 알면, 내보내기 전에 꽉 맞춘 자동 자르기와 모서리 채우기 중에서 고를 수 있어요.',
      ],
      useCases: [
        {
          title: '바다 풍경과 일몰',
          description: '수면선을 따라 선을 그으세요. 24 MP 프레임을 1.5도 보정하면 픽셀의 90.8%가 남아요.',
        },
        {
          title: '건물과 출입구',
          description: '대신 수직 윤곽을 따라 그으세요. 각도가 같은 -45~45 범위로 감싸지므로 수직선도 수평선과 똑같이 작동해요.',
        },
        {
          title: '스캔한 문서와 인화 사진',
          description: '종이 가장자리를 따라 선을 긋고 채우기를 가장자리 늘리기로 정한 뒤, 다시 압축되지 않도록 PNG로 내보내세요.',
        },
        {
          title: '급하게 찍은 휴대폰 사진',
          description: '4032 x 3024 사진을 2도 보정하면 픽셀이 약 10% 줄어들지만 여전히 11 MP가 남아요.',
        },
      ],
      workedExamples: [
        {
          title: '2.5도 기울어진 6000 x 4000 바다 풍경, 24 MP, 10.8 MB JPG',
          body: '수평선을 따라 선을 그으면 회전이 2.5도로 설정돼요. 회전한 캔버스는 6169 x 4258이고, 자동 자르기는 각 변의 88.44%인 중앙 직사각형, 즉 5456 x 3766 픽셀, 20.55 MP를 남기는데, 이는 원본 픽셀의 85.6%예요. Premium 계정에서 JPG 품질 92, 전체 크기로 내보내면 약 9.2 MB이고, 비회원 한도인 12 MP에서는 크기가 줄어 약 5.4 MB가 돼요. 일반 작업 한 번이에요.',
        },
        {
          title: '1.8도 기울어진 4032 x 3024 휴대폰 사진, 12.2 MP, 4.4 MB',
          body: '각도에 1.8을 입력했어요. 캔버스는 4125 x 3149이고, 자동 자르기는 각 변의 92.28%, 즉 3807 x 2906 픽셀, 11.06 MP를 남겨 원본의 90.7%가 돼요. 자동 자르기를 끄고 채우기를 투명으로 설정하면, 네 모서리에 작은 투명 삼각형이 있는 4125 x 3149 캔버스 전체가 내보내져요. 삼각형은 가장 넓은 지점에서 높이가 각각 약 130 px이고, 이를 유지하려면 PNG(약 28 MB)나 WebP(품질 90에서 약 3.9 MB)로 내보내야 해요.',
        },
      ],
      whenNotToUse: '사진 속 선이 기울어진 게 아니라 한 점으로 모여든다면 수평 맞추기를 쓰지 마세요. 카메라를 위로 향해 찍어서 뒤로 넘어가는 듯한 건물에는 네 모서리 원근 도구가 필요하고, 회전해 봤자 한쪽 벽의 기울기를 다른 쪽 벽으로 옮길 뿐이에요. 단순히 90도 돌리려면 90도 회전 버튼을 쓰세요. 리샘플링 없이 픽셀을 그대로 복사해요. 파일이 올바른 방향으로 표시되도록 EXIF 방향 플래그만 적용하면 된다면, 크기 조절 도구나 메타데이터 도구가 편집기 프로젝트를 열지 않고도 처리해 줘요.',
      whyMediaManipulator: [
        '수평 맞추기, 자르기, 뒤집기, 원근을 리샘플링 한 번으로 합쳐 처리하므로, 수평을 맞춘 사진이 두 번 부드러워지지 않아요.',
        '자를 비율을 짐작하지 않고 기하학적으로 계산하며, 일반 작업을 쓰기 전에 내보낼 크기를 보여 줘요.',
        '마스크와 복구 결과가 기하학 변환을 따라 함께 움직이므로, 리터칭한 뒤에 수평을 맞춰도 마스크 작업을 다시 할 필요가 없어요.',
      ],
      privacyNote: '수평 맞추기는 내 픽셀에 적용하는 순수한 기하학 변환이에요. 모델도, 외부 서비스도 쓰지 않아요. 로그인하지 않았다면 회전한 미리보기는 브라우저에서 계산되고, 내보내기 전까지는 아무것도 업로드되지 않아요. 내보내기는 일반적인 비회원 작업이에요. 로그인했다면 원본과 1920 px 미리보기가 보관 기간 설정에 따라 저희 서버에 남고, 프로젝트와 함께 삭제돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: '수평을 맞추면 사진이 얼마나 잘려 나가나요?',
          answer: '각도와 비율에 따라 달라요. 3:2 프레임에서 1도는 픽셀의 약 94%, 2.5도는 약 86%, 5도는 약 75%가 남고, 자동 자르기는 회전한 캔버스의 비율을 유지해요.',
        },
        {
          question: '자르지 않고 모서리를 남길 수 있나요?',
          answer: '네. 가장 큰 직사각형으로 자동 자르기를 끄고 채우기를 고르세요. PNG나 WebP로 내보낼 때는 투명, 테두리 픽셀을 바깥쪽으로 번지게 하려면 가장자리 늘리기, 단색으로 채우려면 색상을 쓰면 돼요.',
        },
        {
          question: '작은 각도로 회전하면 사진이 흐려지나요?',
          answer: '쌍선형 리샘플링 한 번은 아주 살짝 부드러워지는 정도로, 반 픽셀 이동과 비슷해요. 편집기는 수평 맞추기와 자르기를 위해 두 번 리샘플링하는 일이 없고, 90도와 180도 회전은 픽셀이 그대로 유지돼요.',
        },
        {
          question: '양수 회전은 어느 방향인가요?',
          answer: '양수 각도는 화면에서 시계 방향으로 회전해요. 오른쪽 아래로 내려가는 선을 그으면 오른쪽을 들어 올리는 양수 보정이 적용돼요.',
        },
        {
          question: '수평선 대신 수직선으로 수평을 맞출 수 있나요?',
          answer: '네. 수직에서 45도 이내인 선은 똑바로 서 있어야 하는 대상으로 취급되므로, 가로등 기둥이나 문 가장자리로도 수평선과 같은 회전을 설정할 수 있어요.',
        },
        {
          question: '수평을 맞추기 전에 칠한 마스크는 어떻게 되나요?',
          answer: '마스크는 보정된 프레임 안에 있어요. 자르기를 바꾸면 같은 편집 안에서 모든 마스크 좌표를 다시 매핑하고 브러시 획을 새 공간에 맞춰 다시 샘플링하므로, 보정은 사진의 같은 내용에 계속 적용돼요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '투명한 모서리 채우기는 PNG, WebP, AVIF, TIFF에서만 유지돼요. JPG에는 알파가 없어 채운 부분이 검정으로 보여요.',
          '내보내기 대화상자에는 자른 뒤의 크기가 표시돼요. 비회원 한도 12 MP는 원본이 아니라 이 크기에 적용돼요.',
        ],
      },
      related: [
        {
          label: '원근 보정',
          to: '/tools/fix-perspective-photo',
          description: '모여드는 수직선에는 회전이 아니라 네 모서리 도구가 필요해요.',
        },
        {
          label: '비네팅 추가',
          to: '/tools/add-vignette',
          description: '비네팅은 수평을 맞추고 자른 프레임을 기준으로 계산돼요.',
        },
        {
          label: '이미지 크기 조절',
          to: '/tools/image-resizer',
          description: '자른 결과를 나중에 정확한 픽셀 크기로 맞추세요.',
        },
        {
          label: '이미지에서 EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '내보낸 파일에서 방향 태그와 위치 정보를 지우세요.',
        },
        {
          label: '편집기 가이드',
          to: '/tutorials/aperture',
          description: '처리 과정에서 기하학이 어디에 놓이고 마스크가 어떻게 따라가는지 알아보세요.',
        },
      ],
      embed: {
        title: '비뚤어진 사진 수평 맞추기',
        description: '사진을 놓으면 기하학 패널이 열려요. 각도를 입력하거나 수평선을 따라 선을 그으세요.',
      },
    },
    'fix-perspective-photo': {
      name: '원근 보정',
      h1: '온라인에서 사진 원근 보정하기',
      tagline: '네 모서리를 끌어 키스톤과 모여드는 수직선을 바로잡고 결과를 자동으로 잘라요.',
      metaTitle: '사진 원근을 온라인으로 보정: 키스톤 보정',
      metaDescription: '네 모서리를 끌어 브라우저에서 모여드는 수직선과 키스톤 왜곡을 바로잡으세요. 투영 변환, 쌍선형 리샘플링, 자동 자르기, 전체 해상도 내보내기를 지원해요.',
      ogTitle: '온라인에서 사진 원근 보정하기',
      ogDescription: '네 모서리 원근 도구로 기울어 보이는 건물과 비스듬히 찍힌 문서의 수직과 수평을 바로잡아요. 쌍선형 리샘플링은 한 번뿐이고, 빈 곳 없는 가장 큰 직사각형으로 자동으로 잘라요.',
      intro: 'Aperture 기하학 패널의 원근 보정은 네 모서리 투영 변환이에요. 모서리를 드래그하세요를 누르고 프레임의 각 모서리를 바깥쪽이나 안쪽으로 끌어당기세요. 편집기가 단위 정사각형을 내가 만든 사각형에 대응시키는 호모그래피를 만들고(Heckbert의 구성법), 모든 출력 픽셀을 이 호모그래피로 역매핑해 원본을 쌍선형으로 샘플링해요. 단순히 늘리는 게 아니라 진짜 투영 변환이라서, 길에서 찍은 건물의 모여드는 수직선은 평행해지고 직선은 직선으로 남아요. 원근, 회전, 뒤집기, 자르기는 어떤 조정 레이어보다도 먼저, 리샘플링 한 번으로 모두 적용돼요. 가장 큰 직사각형으로 자동 자르기를 켜면 프레임이 원본 비율에서 빈 곳 없는 가장 큰 직사각형으로 잘리고, 끄면 늘어난 모서리가 투명, 가장자리 또는 색상으로 채워져요.',
      whatItDoes: [
        '네 모서리의 오프셋으로 정의되는 투영 변환으로 프레임을 매핑해요. 각 오프셋은 프레임의 절반으로 제한되므로 모서리가 중앙을 넘어갈 수 없어요.',
        '어느 축의 키스톤이든 바로잡아요. 위로 갈수록 모여드는 수직선은 위쪽 모서리를 바깥쪽으로 당기고, 비스듬히 찍은 문서는 옆 모서리를 당겨 반듯하게 맞추세요.',
        '자르기, 원근, 뒤집기, 회전을 한꺼번에 원본 픽셀에서 쌍선형으로 한 번만 리샘플링하므로, 여러 번 거치면서 보정한 이미지가 부드러워지는 일이 없어요.',
        '둘레 전체가 실제 픽셀을 샘플링하는 중앙의 가장 큰 직사각형으로 자동 자르기 하거나, 고른 채우기로 캔버스 전체를 유지해요.',
        '미리보기에 쓴 것과 같은 호모그래피 계수로 저희 서버에서 보정한 원본을 전체 해상도로 내보내요.',
      ],
      flowSteps: [
        {
          title: '사진 놓기',
          description: '원근 섹션이 있는 기하학 패널이 열려요. 모서리를 드래그하세요를 누르세요.',
        },
        {
          title: '모서리 당기기',
          description: '뒤로 넘어가는 듯한 건물이라면 수직선이 평행하게 보일 때까지 왼쪽 위 모서리는 왼쪽으로, 오른쪽 위 모서리는 오른쪽으로 드래그하세요. 몇 퍼센트씩 조금씩 드래그하세요.',
        },
        {
          title: '자르기 결정',
          description: '자동 자르기는 가장 큰 직사각형으로 잘라요. 캔버스 전체를 남기려면 끄고 투명, 가장자리 늘리기 또는 색상을 고르세요.',
        },
        {
          title: '내보내기',
          description: 'JPG, PNG, WebP, AVIF 또는 TIFF로 원본에서 렌더링해요. 언제든 원근 초기화를 누르면 오프셋이 없는 처음 상태로 돌아가요.',
        },
      ],
      advancedDetails: [
        '각 모서리는 회전 후 캔버스 크기를 단위로 하는 오프셋 (x, y)을 저장하므로, tl = (-0.06, 0)은 왼쪽 위 모서리가 폭의 6%만큼 바깥쪽으로 옮겨졌다는 뜻이에요. 네 목표 점 tl, tr = (1 + x, y), br = (1 + x, 1 + y), bl = (x, 1 + y)이 사각형을 정의하고, 단위 정사각형은 계수 여덟 개짜리 호모그래피 x = (a u + b v + c) / (g u + h v + 1), y = (d u + e v + f) / (g u + h v + 1)로 이 사각형에 매핑돼요. 계수는 Heckbert의 닫힌 형식으로 계산하고, 평행사변형(투영 항이 없음)이면 아핀 변환이 돼요.',
        'tl.x = -0.06, tr.x = +0.06인 4000 x 6000 세로 사진의 계수는 a = 1.12, b = 0.06, c = -0.06, e = 1.12, h = 0.12이고 나머지는 0이에요. 출력의 맨 윗줄은 자기보다 12% 넓은 원본 줄을 샘플링하므로, 프레임 폭의 12%만큼 모여들던 수직선이 평행해져요.',
        '모든 출력 픽셀 중심은 호모그래피, 뒤집기, 역회전을 차례로 거쳐 연속적인 원본 좌표로 보내지고, 이웃한 네 픽셀에서 쌍선형으로 보간돼요. 원본 바깥의 샘플에는 채우기가 적용되고, 알파 채널도 같은 방식으로 보간되므로 투명 채우기에는 한 픽셀 폭의 부드러운 경계가 생겨요.',
        '자동 자르기는 30단계 이진 탐색으로, 둘레의 샘플 100개가 모두 원본 안에 들어가는 캔버스 비율의 중앙 정렬된 가장 큰 직사각형을 찾아요. 위의 6% 보정에서는 각 변의 89.83%, 즉 3593 x 5390 픽셀로 24 MP 원본의 80.7%가 남고, 10% 보정에서는 71.6%가 남아요. 반대로 모서리를 안쪽으로 당기면 모든 출력 픽셀이 원본 안으로 매핑되므로 자를 필요가 전혀 없어요.',
        'Aperture 미리보기는 1920 px 사본으로 내 GPU(WebGL2)에서 그려지고, 내보내기는 같은 공식으로 저희 서버에서 원본을 전체 해상도로 렌더링하며, 둘은 문서화된 작은 허용 오차 안에서 일치해요. 기하학 변환은 2 px 테두리를 제외한 안쪽 영역에서 최대 2단계(8비트 기준)이고, 색상 연산은 평균 1단계 안으로 유지되며 그레인은 정확히 일치해요.',
      ],
      whyItMatters: [
        '수직선이 모여들면 건물이 뒤로 넘어가는 것처럼 보여요. 직선을 직선으로 유지하면서 이를 바로잡을 수 있는 변환은 투영 보정뿐이에요.',
        '옆에서 찍은 문서나 화이트보드도 네 모서리를 다시 정사각형에 대응시키면 읽기 쉬운 직사각형이 돼요.',
        '자르기로 잃는 부분을 미리 확인하면, 내보낸 뒤에야 지붕선이 잘린 걸 발견하는 대신 처음부터 여유를 두고 촬영하거나 자를 수 있어요.',
      ],
      useCases: [
        {
          title: '길에서 찍은 건축물',
          description: '창문 기둥이 평행해질 때까지 위쪽 모서리를 바깥쪽으로 4~8% 당기세요. 픽셀은 80~90% 정도 남는다고 보면 돼요.',
        },
        {
          title: '화이트보드와 포스터',
          description: '프레임의 각 모서리를 보드의 모서리로 드래그하세요. 그다음 자동 자르기를 끄고 보드에 맞춰 직접 자르세요.',
        },
        {
          title: '광각 렌즈로 찍은 실내',
          description: '위쪽 모서리를 2~3%만 살짝 보정해도, 크게 보정할 때처럼 늘어진 느낌 없이 문틀이 반듯해져요.',
        },
        {
          title: '제품 촬영 사진',
          description: '살짝 위에서 찍은 상자를 반듯하게 맞춰 앞면을 정확한 직사각형으로 만든 다음 배경을 오려 내세요.',
        },
      ],
      workedExamples: [
        {
          title: '기울어 보이는 오피스 타워, 4000 x 6000 세로 사진, 24 MP, 12.1 MB JPG',
          body: '왼쪽 위 모서리를 x = -0.06으로, 오른쪽 위 모서리를 x = +0.06으로 드래그하고 아래쪽 모서리는 그대로 뒀어요. 호모그래피는 a = 1.12, b = 0.06, c = -0.06, e = 1.12, h = 0.12예요. 자동 자르기는 각 변의 89.83%를 남겨 3593 x 5390 픽셀, 19.4 MP로 원본의 80.7%가 돼요. Premium 계정에서 JPG 품질 92로 내보내면 약 8.7 MB이고, 비회원 내보내기는 12 MP로 줄어 약 5.4 MB예요. 일반 작업 한 번이에요.',
        },
        {
          title: '왼쪽에서 찍은 화이트보드, 4032 x 3024 휴대폰 JPG, 12.2 MP',
          body: '보드를 반듯하게 맞추기 위해 왼쪽 위 x = -0.05, 오른쪽 위 x = +0.05, 왼쪽 아래 y = +0.02, 오른쪽 아래 y = -0.02로 설정했어요. 계수는 a = 1.10, b = 0.073, c = -0.05, e = 1.146, h = 0.146이 나와요. 자동 자르기는 변마다 90.95%를 남겨 3667 x 2750 픽셀, 10.1 MP로 프레임의 82.7%가 돼요. 마커 글씨를 또렷하게 남기려고 PNG로 내보내면 메가픽셀당 약 2.5 MB라 대략 25 MB이고, WebP 품질 90이면 약 3.1 MB예요.',
        },
      ],
      whenNotToUse: '선이 모여드는 게 아니라 휘어 있다면 원근 도구를 쓰지 마세요. 광각 렌즈의 술통형 왜곡에는 이 편집기에 없는 방사형 보정이 필요하고, 투영 변환으로는 휘어진 곡선이 그대로 남아요. 단순히 기울어진 경우는 회전이므로 수평 맞추기를 쓰세요. 잃는 픽셀도 더 적어요. 프레임의 약 15%를 넘는 아주 큰 보정은 먼 쪽 가장자리를 너무 많이 늘려서 디테일이 뭉개지고, 자르기로 사진의 삼분의 일이 잘려 나가요. 가능하다면 더 긴 초점 거리로 더 멀리서 다시 찍으세요.',
      whyMediaManipulator: [
        '매핑은 문서화된 투영 호모그래피이므로, 메시로 근사한 워프가 아니라 정확한 기하학적 결과를 얻어요.',
        '원근은 수평 맞추기, 뒤집기, 자르기와 쌍선형 리샘플링 한 번을 함께 써요. 기울기와 키스톤을 모두 바로잡아야 하는 사진에서 특히 중요해요.',
        '보정한 원본은 Premium과 Pro에서 최대 120 MP까지 전체 해상도로 내보내지고, 미리보기는 문서화된 허용 오차 안에서 결과와 일치해요.',
      ],
      privacyNote: '원근 보정은 좌표에 대한 계산일 뿐이라 AI 모델도 외부 서비스도 쓰지 않아요. 계정이 없으면 보정한 미리보기는 내보내기 전까지 브라우저에만 존재하고, 내보낼 때 올린 파일은 다른 비회원 작업과 똑같이 보관돼요. 계정이 있으면 원본, 1920 px 미리보기, 썸네일이 보관 기간 설정에 따라 저희 서버에 남고 프로젝트와 함께 삭제돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요.',
      faq: [
        {
          question: '모서리를 얼마나 멀리 드래그할 수 있나요?',
          answer: '각 모서리의 오프셋은 축마다 캔버스 크기의 절반 이내(플러스 또는 마이너스)로 제한되므로, 모서리가 프레임 중앙에 가까워질 수는 있어도 넘어갈 수는 없어요. 어차피 약 15%를 넘는 보정은 대개 늘어나 보여요.',
        },
        {
          question: '높은 건물을 보정하면 자동 자르기가 왜 그렇게 많이 잘라 내나요?',
          answer: '위쪽 모서리를 바깥쪽으로 당기면 출력의 윗부분이 원본에 실제로 있는 것보다 넓은 띠를 샘플링해야 해요. 그래서 둘레 전체가 실제 픽셀이 될 때까지 양옆을 잘라야 해요. 3:2 세로 사진을 6% 당기면 픽셀의 약 81%가 남아요.',
        },
        {
          question: '원근 보정과 수평 맞추기를 함께 쓸 수 있나요?',
          answer: '네. 회전이 먼저 적용되고 원근 오프셋은 회전한 캔버스를 기준으로 해석되며, 둘 다 쌍선형 리샘플링 한 번으로 처리돼요. 먼저 수평선을 따라 선을 그은 다음 수직선을 반듯하게 맞추세요.',
        },
        {
          question: '렌즈 왜곡 보정과 같은 건가요?',
          answer: '아니요. 술통형 왜곡과 실패형 왜곡은 직선을 휘게 만들어서 방사형 모델이 필요해요. 원근 도구는 모여드는 선만 다루므로, 휘어진 선은 보정 후에도 휘어 있어요.',
        },
        {
          question: '원근 초기화는 어떤 기능인가요?',
          answer: '네 모서리의 오프셋을 모두 원래대로 되돌리고 호모그래피를 없애요. 설정해 둔 회전, 뒤집기, 자르기는 그대로 남아요. 오프셋이 이미 원래 상태라면 버튼이 비활성화돼요.',
        },
        {
          question: '보정한 사진이 흐릿해지나요?',
          answer: '늘어난 영역은 보간되므로 늘어난 정도에 대략 비례해 선명도가 조금 떨어져요. 6% 보정은 100% 확대에서도 거의 알아차리기 어려워요. 그 위에 선명하게 레이어를 가볍게 더하면 윤곽 대비가 되살아나요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '투명한 모서리 채우기에는 PNG, WebP, AVIF 또는 TIFF가 필요해요. JPG로 내보내면 채운 부분이 검정으로 보여요.',
          '비회원 한도 12 MP와 요금제별 한도 24, 64, 120 MP는 자동 자르기 후의 출력 크기를 기준으로 적용돼요.',
        ],
      },
      related: [
        {
          label: '사진 수평 맞추기',
          to: '/tools/straighten-photo',
          description: '기울어진 수평선은 원근 문제가 아니라 회전 문제예요.',
        },
        {
          label: '사진 선명하게',
          to: '/tools/sharpen-photo-online',
          description: '보정한 프레임에서 늘어난 부분의 윤곽 대비를 되살리세요.',
        },
        {
          label: '이미지 배경 제거',
          to: '/tools/remove-background-from-image',
          description: '제품 사진을 반듯하게 맞춘 다음 오려 내세요.',
        },
        {
          label: '이미지 압축',
          to: '/tools/compress-image',
          description: '상품 목록이나 슬라이드에 쓸 수 있게 내보낸 파일을 줄이세요.',
        },
        {
          label: '편집기 가이드',
          to: '/tutorials/aperture',
          description: '처리 과정에서 기하학, 마스크, 레이어가 어떤 순서로 적용되는지 알아보세요.',
        },
      ],
      embed: {
        title: '사진 원근 보정하기',
        description: '사진을 놓으면 기하학 패널이 열려요. 모서리를 드래그하세요를 누르고 선을 반듯하게 맞추세요.',
      },
    },
    'remove-blemishes': {
      name: '잡티 제거',
      h1: '온라인에서 사진의 잡티와 얼룩 제거하기',
      tagline: '잡티 위를 칠하고 복구를 누르면, 저희 GPU의 인페인팅 모델이 주변 피부를 바탕으로 채워요.',
      metaTitle: '사진의 잡티와 얼룩을 온라인으로 제거: 복구 도구',
      metaDescription: '여드름, 먼지 자국, 우연히 생긴 자국 위를 칠하고 복구를 누르면 저희가 직접 운영하는 GPU의 인페인팅 모델이 채워요. 누를 때마다 AI 작업 한 번, 실패하면 환불, 전체 해상도 내보내기.',
      ogTitle: '온라인에서 사진 잡티 제거하기',
      ogDescription: '브러시로 스팟을 표시하고 복구를 한 번 누르면, 저희 GPU의 LaMa 인페인팅이 각 스팟을 주변으로 채워요. 비파괴 방식이라 원본 파일은 그대로 남아요.',
      intro: 'Aperture의 복구 패널은 이 페이지에서 유일하게 모델을 쓰는 도구예요. 스팟 브러시로 잡티마다 칠하고 복구를 누르면, 칠한 마스크와 현재 이미지가 저희가 직접 운영하는 GPU 서버로 전송되고, LaMa 인페인팅이 주변을 바탕으로 가려진 픽셀을 다시 만들어 내요. 스팟을 몇 개 표시했든 한 번 누르면 AI 작업 한 번이에요. 작업이 실패하면 AI 작업은 차감되지 않고, 저장된 프로젝트에서 같은 기본 이미지에 똑같은 마스크로 다시 요청하면 캐시를 사용하므로 무료예요. 복구된 이미지는 새 기본 이미지가 되어 이후의 모든 조정 레이어, 마스크, 내보내기가 여기서 시작하고, 원본 파일은 절대 바뀌지 않아요. 피부, 센서 먼지, 배경지 위의 머리카락 한 올, 작은 표지판 모두 같은 방식으로 복구돼요.',
      whatItDoes: [
        '경도 80 브러시로 원하는 크기만큼 스팟 마스크를 칠해요. 점을 찍어도 짧게 그어도 되고, 복구를 누르기 전에 스팟 지우기로 마스크를 비울 수 있어요.',
        '마스크를 현재 이미지와 함께 저희 GPU로 보내면, LaMa 인페인팅 모델이 마스크로 덮인 각 영역을 주변 질감으로 채워요. 표시한 모든 스팟을 작업 하나로 처리해요.',
        '표시한 스팟 수와 관계없이 복구를 한 번 누를 때마다 AI 작업 한 번이 차감되고, 작업이 실패하면 차감된 AI 작업을 돌려주며, 저장된 프로젝트에서 똑같이 반복하면 캐시된 결과를 무료로 돌려줘요.',
        '복구된 결과가 스택의 새 기본 이미지가 되므로, 나중에 적용하는 샤프닝, 색상, 마스크는 깨끗해진 피부를 기준으로 작동하고, 작업 내역 패널로 복구 전 단계로 돌아갈 수 있어요.',
        '원본 파일은 건드리지 않아요. 내보내기는 복구된 기본 이미지를 전체 해상도로 렌더링해 이름 뒤에 (retouched)가 붙은 새 파일로 저장해요.',
      ],
      flowSteps: [
        {
          title: '사진 놓기',
          description: '스팟 브러시가 선택된 상태로 복구 패널이 열려요. 잡티 하나하나가 화면에서 수십 픽셀 크기로 보이도록 확대하세요.',
        },
        {
          title: '스팟 표시',
          description: '잡티보다 조금 큰 브러시로 잡티마다 클릭하거나 드래그하세요. 표시할 때마다 패널의 표시한 스팟 수가 늘어나요.',
        },
        {
          title: '복구 누르기',
          description: '마스크가 이미지와 함께 업로드되고 저희 GPU에서 작업이 실행돼요. 길게는 일 분 정도 걸릴 수 있어요. 결과가 돌아오면 적용된 복구 수가 늘어나요.',
        },
        {
          title: '편집을 이어 가고 내보내기',
          description: '필요하면 한 번 더 복구한 다음 톤을 조정하고 선명하게 한 뒤 내보내세요. 실행 취소나 작업 내역 패널로 복구를 되돌릴 수 있어요.',
        },
      ],
      advancedDetails: [
        '브러시는 눈에 보이는 기하학 보정 공간에 래스터를 칠하고, 모든 획을 자르기, 원근, 뒤집기, 회전을 거꾸로 거쳐 원본 픽셀 좌표로 되돌려요. 그래서 수평을 맞추고 자른 사진에서도 마스크가 기본 이미지의 픽셀과 정확히 맞아요. 각 획은 경도 80, 흐름 100으로 찍히고, 업로드되는 마스크는 현재 기본 이미지 크기로 알파가 0.05를 넘는 곳은 흰색, 나머지는 검정이에요.',
        '복구를 한 번 누르면 작업 하나예요. 저장된 프로젝트에서는 마스크와 현재 기본 이미지 해시를 담은 POST /api/photo/projects/:id/heal 요청이고, 로그인하지 않았다면 그 작업에만 쓰도록 사진과 마스크를 업로드하는 상태 비저장 경로 /api/photo/heal이에요. 서버는 현재 기본 이미지에 LaMa 모델을 실행하고 결과를 새 기본 이미지로 저장하는데, 그 이름은 이전 기본 이미지 해시와 마스크 다이제스트의 SHA-256이에요. 그래서 같은 기본 이미지에 같은 마스크를 쓰면 이를 알아보고 AI 작업을 다시 쓰지 않고 캐시에서 결과를 돌려줘요.',
        '문서는 각 복구를 마스크 참조와 새 기본 이미지 참조가 담긴 항목으로 기록해요. WebGL 미리보기, 서버 내보내기, 일괄 적용 등 모든 렌더러는 원본이 아니라 가장 최근의 기본 이미지에서 시작해요. 작업 내역에서 이 항목을 제거하면 이전 기본 이미지로 돌아가요.',
        '적목 현상은 별도의 패널이에요. 눈을 클릭하면 작은 원형 마스크가 놓이고(기본 반경은 긴 변의 2%), 그 안에서 빨강 채널이 min(r, (g + b)/2)로 바뀌므로 (200, 40, 40)인 동공은 (40, 40, 40)이 돼요. AI 작업을 쓰지 않는 평범한 픽셀 단위 색상 계산이에요.',
        '복구 자체를 제외한 모든 것은 Aperture의 일치 정책을 따라요. 미리보기는 1920 px 사본으로 내 GPU(WebGL2)에서 그려지고, 내보내는 파일은 같은 공식으로 저희 서버에서 원본(여기서는 복구된 기본 이미지)을 전체 해상도로 렌더링하며, 둘은 많아야 몇 단계(8비트 기준)인 문서화된 작은 허용 오차 안에서 일치하고 그레인은 정확히 일치해요. 복구된 픽셀 자체는 서버에서 한 번만 만들어지고, 미리보기는 바로 그 결과의 프록시를 보여 줘요.',
      ],
      whyItMatters: [
        '인페인팅은 스팟을 주변에서 가져온 그럴듯한 질감으로 채우므로, 블러나 복제 도장이 흐릿한 얼룩을 남기는 피부와 천에서도 자연스러워 보여요.',
        '스팟을 여러 개 표시하고 한 번만 누르면 AI 작업도 한 번, 기다림도 한 번으로 끝나요.',
        '복구는 원본을 덮어쓰는 편집이 아니라 기본 이미지가 되므로, 잘못 눌러도 실행 취소 한 번이면 되고 원본 파일은 그대로 남아요.',
      ],
      useCases: [
        {
          title: '인물 사진 피부 정리',
          description: '여드름, 작은 흉터, 삐져나온 머리카락을 잡티의 1.5배 정도 되는 브러시로 표시하고, 얼굴 전체에 대해 복구를 한 번 누르세요.',
        },
        {
          title: '하늘의 센서 먼지',
          description: '100%로 확대해 먼지 그림자마다 점을 찍고 한 번 복구하면, 매끄러운 하늘 그라데이션이 밴딩 없이 다시 만들어져요.',
        },
        {
          title: '제품 사진',
          description: '피사체를 오려 내기 전에 배경지의 보풀과 지문을 지워 두면 가장자리가 깔끔해요.',
        },
        {
          title: '스캔한 인화 사진',
          description: '스캐너 유리에서 생긴 긁힘과 얼룩 위를 칠하세요. 가는 선은 브러시가 약간의 여유를 두고 덮으면 잘 복구돼요.',
        },
      ],
      workedExamples: [
        {
          title: '프로필 사진, 6000 x 4000, 24 MP, 10.8 MB JPG, 로그인하지 않은 상태',
          body: '40 px 브러시로 잡티 7개, 12 px 획으로 삐져나온 머리카락 2가닥을 표시한 뒤 복구를 한 번 눌렀어요. AI 작업 1회이고, 사진과 마스크는 그 작업에만 쓰이도록 업로드되며, 일 분도 안 되어 결과가 돌아와요. 남은 세션 동안에는 복구된 기본 이미지가 원본을 대신해요. 비회원 한도인 12 MP에서 JPG 품질 92로 내보내면 약 5.4 MB이고, 일반 작업 1회예요. 마스크를 바꾸지 않고 복구를 다시 누르면 비회원은 작업이 다시 실행돼요. 저장된 프로젝트라면 같은 요청은 캐시를 사용하므로 무료예요.',
        },
        {
          title: '센서 먼지가 있는 하늘, 4032 x 3024, 12.2 MP, Premium 계정',
          body: '1차: 100% 확대에서 먼지 그림자 11개에 점을 찍고 복구를 눌러 AI 작업 1회. 2차: 노출을 0.5 EV 낮춘 뒤 3개를 더 찾아 복구를 다시 눌러, 새 기본 이미지에 두 번째 AI 작업. 2차를 실행 취소하고 똑같은 스팟 3개짜리 마스크로 복구를 누르면 캐시에서 무료로 결과를 돌려줘요. 전체 12.2 MP로 WebP 품질 90 내보내기는 약 3.7 MB이고, 일반 작업 1회예요.',
        },
      ],
      whenNotToUse: '복구는 스팟과 작은 자국을 위한 기능이지, 사람 한 명이나 큰 물체를 통째로 지우는 기능이 아니에요. 마스크가 넓은 영역을 덮으면 모델이 참고할 주변 정보가 너무 적어 채운 부분이 흐릿해지거나 같은 무늬가 반복돼요. 그런 작업에는 Media Manipulator의 전용 ‘사진에서 개체 제거’ 도구를 쓰세요. 피부 질감을 전체적으로 매끄럽게 하는 데도 쓰지 마세요. 무료이고 되돌릴 수 있는 노이즈 감소나 텍스처의 음수 값을 쓰세요. 주근깨처럼 무늬가 뚜렷한 넓은 피부 영역은 고르지 않게 복구되므로, 잡티만 작은 여유를 두고 표시하세요.',
      whyMediaManipulator: [
        'Aperture는 저희가 운영하는 하드웨어에서 인페인팅 모델을 실행하므로, 사진이 외부 AI 제공업체로 넘어가지 않아요.',
        '실패한 복구는 AI 작업이 차감되지 않고 똑같은 복구를 반복하면 무료이므로, 마스크를 이리저리 시험해도 작업 횟수가 낭비되지 않아요.',
        '복구된 기본 이미지는 다른 모든 보정과 같은 비파괴 스택으로 이어지고, 작업 내역, 마스크, 전체 해상도 내보내기를 그대로 쓸 수 있어요.',
      ],
      privacyNote: '복구는 이 페이지에서 내보내기 전에 브라우저를 벗어나는 유일한 단계예요. 복구를 누르면 현재 이미지와 칠한 마스크가 업로드되고, 저희가 직접 운영하는 GPU에서 LaMa 모델이 실행돼요. 로그인하지 않았다면 이 업로드는 그 작업에만 쓰이고 다른 비회원 작업과 똑같이 보관되며, 프로젝트 자체는 이 브라우저에 남아요. 로그인했다면 복구된 기본 이미지가 보관 기간 설정에 따라 프로젝트와 함께 저장되고 프로젝트와 함께 삭제돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 외부 AI 서비스는 전혀 관여하지 않아요.',
      faq: [
        {
          question: '스팟 하나마다 AI 작업이 따로 차감되나요?',
          answer: '아니요. 스팟을 몇 개 칠했든 복구를 한 번 누르면 AI 작업 한 번이에요. 그래서 패널이 스팟 수를 세어 주고, 먼저 모두 표시할 수 있게 되어 있어요.',
        },
        {
          question: '복구에 실패하면 어떻게 되나요?',
          answer: '사진은 전혀 바뀌지 않고, 패널에 복구가 완료되지 않았다는 메시지가 나오며, AI 작업도 차감되지 않아요. 같은 마스크로 복구를 다시 누르면 돼요.',
        },
        {
          question: '수평을 맞추거나 자른 사진의 잡티도 복구할 수 있나요?',
          answer: '네. 획은 보정된 화면 위에 칠해지고 기하학 변환을 거꾸로 거쳐 원본 좌표로 매핑되므로, 마스크가 기본 이미지의 정확한 픽셀에 놓여요.',
        },
        {
          question: '복구하면 원본 파일이 바뀌나요?',
          answer: '절대 바뀌지 않아요. 결과는 프로젝트 안에 새 기본 이미지로 저장되고, 내보내기는 (retouched)라는 접미사가 붙은 별도 파일을 만들어요. 작업 내역에서 복구를 제거하면 이전 기본 이미지로 돌아가요.',
        },
        {
          question: '브러시는 얼마나 커야 하나요?',
          answer: '잡티보다 조금 크게, 몇 픽셀 정도 여유를 두세요. 그래야 모델이 잡티 자체의 가장자리를 샘플링하지 않아요. 질감이 있는 영역에서 마스크가 너무 크면 자연스러워 보이기까지 시간이 더 걸려요.',
        },
        {
          question: '적목 현상 제거도 복구에 포함되나요?',
          answer: '적목 현상은 별도의 패널이고 AI가 필요 없어요. 눈을 클릭하면 작은 원형 마스크가 놓이고, 그 안에서 빨강 값을 자기 자신과 초록, 파랑 평균 중 더 작은 값으로 바꿔요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '복구 마스크는 현재 기본 이미지와 크기가 같아야 해요. 편집기가 자동으로 그 크기로 만들어요.',
          '복구를 한 번 누를 때마다 AI 작업 한 번이고, 내보내기는 일반 작업이에요. 일일 사용량은 요금 페이지에서 확인하세요.',
        ],
      },
      related: [
        {
          label: '사진 선명하게',
          to: '/tools/sharpen-photo-online',
          description: '잡티가 먼저 강조되지 않도록 복구한 뒤에 선명하게 하세요.',
        },
        {
          label: '이미지 노이즈 줄이기',
          to: '/tools/reduce-image-noise',
          description: '잡티를 없앤 뒤 피부의 그레인을 매끄럽게 다듬으세요.',
        },
        {
          label: '색상으로 선택',
          to: '/tools/select-by-color',
          description: '잡티를 복구한 뒤 색상 범위 선택으로 피부 톤을 고르게 맞추세요.',
        },
        {
          label: '이미지 배경 제거',
          to: '/tools/remove-background-from-image',
          description: '배경지를 정리한 뒤 피사체를 오려 내세요.',
        },
        {
          label: '이미지에서 EXIF 메타데이터 삭제',
          to: '/tools/remove-exif-metadata',
          description: '리터칭한 인물 사진을 공유하기 전에 위치 정보를 지우세요.',
        },
        {
          label: '편집기 가이드',
          to: '/tutorials/aperture',
          description: '복구, 작업 내역, 기본 이미지를 편집기의 나머지 기능과 함께 설명해요.',
        },
      ],
      embed: {
        title: '잡티와 얼룩 제거하기',
        description: '사진을 놓으면 복구 패널이 열려요. 스팟마다 칠한 다음 복구를 한 번 누르세요.',
      },
    },
    'select-by-color': {
      name: '색상으로 선택',
      h1: '온라인에서 사진을 색상으로 선택하기',
      tagline: '스포이트로 색을 고르고, 허용량으로 범위를 넓힌 뒤, 그 선택 범위만 조정하세요.',
      metaTitle: '사진에서 색상으로 선택을 온라인으로: 색상 범위 마스크',
      metaDescription: '브라우저에서 색상 범위 마스크를 만드세요. 스포이트, Shift 클릭으로 최대 8가지 색 추가, Lab 색 거리로 측정하는 허용량, 페더와 반전으로 선택 범위만 조정해요.',
      ogTitle: '온라인에서 사진을 색상으로 선택하기',
      ogDescription: '데스크톱 편집기의 색상 범위 명령 같은 색상 범위 마스크예요. 스포이트, 최대 8개의 샘플 색, Lab 거리 기반 허용량, 페더, 반전, 오버레이 보기를 갖췄어요. 그런 다음 선택한 부분만 보정하세요.',
      intro: '색상 범위는 Aperture 마스크 패널의 여섯 가지 마스크 종류 중 하나이고, 색상으로 선택하는 방법이에요. 아무 조정 레이어에 마스크를 추가하고 색상 범위 구성 요소를 넣은 뒤 스포이트로 사진 속 색을 클릭하면, 그 색과 가까운 색의 픽셀이 모두 선택돼요. 가까운 정도는 픽셀과 샘플링한 색 사이의 CIE Lab 거리로 측정하고, 허용량은 그 거리가 어디까지 닿을지를 정해요. Shift 키를 누른 채 클릭하면 샘플 색을 최대 8개까지 더할 수 있고, 선택은 가장 강하게 일치하는 값을 따라요. 페더는 가장자리를 부드럽게 하고, 반전은 선택을 뒤집고, 마스크 강도는 선택의 세기를 조절하며, 마스크 보기에서는 빨간 오버레이로 보거나 마스크만 따로 볼 수 있어요. 마스크는 원본 사진에서 계산되어 즉시 미리보기에 반영되고, 내보내기는 원본에 같은 마스크를 적용해 렌더링해요.',
      whatItDoes: [
        '스포이트로 사진에서 색을 샘플링하고, 그 색과의 Lab 색 거리를 기준으로 픽셀을 선택해요. RGB 숫자가 얼마나 다른지가 아니라 색이 눈에 얼마나 다르게 보이는지를 따라가요.',
        'Shift 클릭으로 대상 색을 최대 8개까지 추가하고 그중 가장 큰 가중치를 쓰므로, 두 가지 파랑이 섞인 하늘이나 밝은 부분과 그림자가 있는 재킷도 하나로 선택돼요.',
        '허용량 0~100으로 선택 반경을 Lab 거리 0~60 사이에서 조절하고, 반경의 바깥쪽 절반에서 부드럽게 줄어들어요.',
        '추가, 빼기, 교차로 다른 마스크 구성 요소와 결합한 다음, 합쳐진 결과에 마스크 페더, 반전, 마스크 강도를 적용해요.',
        '어떤 보정이든 선택 범위로 제한할 수 있어요. 노출, 톤, 채도를 위한 로컬 보정, 색조를 옮기는 색상(HSL) 레이어, 레벨, 커브, 흑백 변환까지요.',
      ],
      flowSteps: [
        {
          title: '사진을 놓고 보정 고르기',
          description: '마스크 패널이 열려요. 로컬 보정을 추가하거나, 기존 레이어를 선택하고 마스크를 추가하세요.',
        },
        {
          title: '색상 범위 추가 후 클릭',
          description: '색상 범위를 고르고 색상 선택을 누른 뒤 원하는 색을 클릭하세요. Shift 키를 누른 채 클릭하면 최대 8개까지 색을 추가할 수 있어요.',
        },
        {
          title: '허용량 조절과 마스크 확인',
          description: '마스크 보기를 오버레이로 바꾸고 영역 전체가 빨갛게 될 때까지 허용량을 올리세요. 선택이 넘친다면 빼기 구성 요소를 추가하세요.',
        },
        {
          title: '보정하고 내보내기',
          description: '레이어 슬라이더를 설정하면 선택 범위만 바뀌어요. JPG, PNG, WebP, AVIF 또는 TIFF로 원본에서 렌더링해 내보내세요.',
        },
      ],
      advancedDetails: [
        '각 대상 색과 각 원본 픽셀은 sRGB에서 CIE Lab(D65, 표준 행렬, 216/24389 선형 구간 포함)으로 변환돼요. 거리는 Delta E 76, 즉 L, a, b에 대한 유클리드 거리예요. 허용량이 f이면 반경은 R = f/100 × 60 Lab 단위이고, 가중치는 1 - smoothstep(0.5 R, R, Delta E)예요. 반경의 절반 안쪽은 완전히 선택되고, 반경에 이르면 완전히 사라지도록 세제곱 곡선으로 줄어들어요. 대상이 여러 개면 픽셀은 가장 큰 가중치를 취하고, 대상이 없으면 구성 요소 값은 0이에요.',
        'sRGB (92, 150, 214), 즉 Lab (60.7, -0.2, -38.4)로 샘플링한 하늘에 허용량 20(R = 12)을 쓰면, 같은 하늘의 더 밝은 부분 (110, 165, 222)은 Delta E 7.1로 가중치 0.91로 선택되고, 더 짙은 파랑 (60, 120, 200)은 Delta E 15.6으로 완전히 제외돼요. 허용량 40(R = 24)에서는 더 짙은 파랑이 가중치 0.78로 포함되지만, Delta E 49.8인 구름 (235, 238, 240)과 Delta E 83.8인 나뭇잎 초록은 허용량 60에서도 0으로 남아요.',
        '구성 요소는 왼쪽부터 오른쪽으로 합쳐져요. 추가는 max(m, value), 빼기는 min(m, 1 - value), 교차는 min(m, value)예요. 합쳐진 마스크에는 시그마가 feather/100 × 0.05 × 긴 변인 가우시안 블러가 적용되는데, 6000 px 사진에서 마스크 페더 10이면 30 px예요. 그다음 반전이 켜져 있으면 뒤집고, 마스크 강도를 곱한 뒤 0..1로 클램프해요. 레이어 출력은 lerp(input, adjusted, mask)예요.',
        '색상 범위는 앞선 레이어의 출력이 아니라 기하학 보정을 거친 원본 사진을 읽어요. 그래서 아래쪽 레이어를 편집해도 선택이 바뀌지 않고, 샘플링한 같은 색은 미리보기에서도 서버 렌더링에서도 같은 픽셀을 선택해요.',
        'Aperture 미리보기는 1920 px 사본으로 내 GPU(WebGL2)에서 그려지고, 내보내는 파일은 같은 공식으로 저희 서버에서 원본을 전체 해상도로 렌더링하며, 둘은 문서화된 작은 허용 오차 안에서 일치해요. 이 마스크 아래의 보정 같은 색상 연산은 평균 오차가 많아야 한 단계(8비트 기준), 99번째 백분위수가 2, 최대 4로 유지되고, 그레인은 비트 단위까지 정확히 일치해요.',
      ],
      whyItMatters: [
        '지각적 색 거리로 선택하면 하늘이나 옷의 밝은 부분과 어두운 부분까지 통째로 잡아내요. RGB 허용치였다면 처음 음영이 바뀌는 곳에서 멈췄을 거예요.',
        '일회성 선택이 아니라 마스크로 작동하므로, 보정을 적용한 뒤에도 선택을 다듬을 수 있고 다른 레이어에서 다시 쓸 수 있어요.',
        '오버레이 보기에서는 확정하기 전에 선택이 넘친 부분이 바로 보이므로, 결과를 보고 짐작할 필요가 없어요.',
      ],
      useCases: [
        {
          title: '구름은 그대로 두고 하늘만 짙게',
          description: '파랑을 샘플링하고 허용량 35로 설정한 뒤, 노출 -0.4와 채도 +15로 로컬 보정을 적용하세요. Delta E가 50 가까이 되는 구름은 선택에서 빠져요.',
        },
        {
          title: '제품 색상 바꾸기',
          description: '셔츠를 샘플링하고 그림자와 밝은 부분을 Shift 클릭으로 추가한 뒤, 색조를 옮긴 색상(HSL) 레이어를 적용하세요. 배경은 그대로예요.',
        },
        {
          title: '피부 톤 고르게 하기',
          description: '허용량 25, 마스크 페더 6으로 중간 밝기의 피부를 샘플링한 다음, 선택 범위에서 채도를 살짝 낮추고 그림자를 올리세요.',
        },
        {
          title: '한 가지 색만 남기고 회색으로',
          description: '색을 선택하고 마스크를 반전한 뒤 그 마스크로 흑백 레이어를 추가하면 선택한 색만 남아요.',
        },
      ],
      workedExamples: [
        {
          title: '하늘 짙게 하기, 6000 x 4000 풍경 사진, 24 MP, 10.4 MB JPG',
          body: '하늘 (92, 150, 214)을 샘플링하고 허용량 40, R = 24 Lab 단위로 설정했어요. Delta E 7.1인 더 밝은 부분은 가중치 1.0, Delta E 15.6인 더 짙은 파랑은 0.78, Delta E 49.8인 구름은 0이에요. 마스크 페더 5는 6000 px 변에서 15 px 가우시안이에요. 노출 -0.5 EV인 로컬 보정을 적용하면 완전히 선택된 하늘이 (92, 150, 214)에서 (78, 128, 183)으로 어두워지고, 가중치 0.78인 더 짙은 파랑에는 그 변화의 78%만 적용돼요. 비회원으로 12 MP에서 JPG 품질 92로 내보내면 약 5.4 MB예요.',
        },
        {
          title: '재킷 색 바꾸기, 4000 x 6000 세로 사진, 24 MP, Pro 계정',
          body: 'Shift 클릭으로 샘플 세 개를 찍었어요. 빛을 받은 빨강 (190, 40, 50), 그림자 (120, 20, 30), 밝은 부분 (230, 110, 115)이고, 허용량 30, R = 18이에요. 마스크는 세 샘플 중 가장 큰 가중치를 쓰므로 재킷 전체가 1.0이 되고, (214, 170, 140)인 피부는 가장 가까운 샘플과 Delta E 37만큼 떨어져 0으로 남아요. (200, 90, 100)인 입술은 밝은 부분 샘플과 Delta E 9.6밖에 차이 나지 않아 선택에 걸리므로, 입 위에 빼기 브러시 구성 요소를 칠해 제외해요. 그런 다음 이 마스크를 쓴 색상(HSL) 레이어에서 빨강의 색조를 +150도 옮기면 재킷이 청록색으로 바뀌어요. 전체 24 MP로 PNG는 약 60 MB, AVIF는 약 4.8 MB로 내보내져요.',
        },
      ],
      whenNotToUse: '피사체와 배경의 색이 같을 때, 예를 들어 잔디 위에 초록 셔츠를 입은 사람이 있을 때는 색상 범위 선택이 맞지 않아요. 대신 AI 마스크인 피사체 선택이나 브러시를 쓰세요. 그레이스케일이나 채도가 아주 낮은 사진에서도 잘 안 돼요. 모든 픽셀이 서로 몇 Lab 단위 안에 몰려 있어서 허용량으로 구분할 수 없거든요. 이럴 때는 휘도 범위 마스크가 더 나아요. 사진 전체에서 한 가지 색조를 옮기고 싶다면, ‘사물 색상 바꾸기’ 페이지의 색상(HSL) 범위로 마스크 없이 바로 할 수 있어요.',
      whyMediaManipulator: [
        '마스크가 반경과 감쇠 방식이 명시된 문서화된 Lab 거리를 쓰므로, 다음 사진에서도 같은 허용량이면 같은 선택이 나와요.',
        '색상 범위 마스크는 계산 비용이 들지 않고 내 GPU에서 실시간으로 미리 볼 수 있어요. 사진을 업로드하는 건 피사체 선택뿐이고, 일반 작업 한 번으로 처리돼요.',
        '마스크는 레이어끼리 공유할 수 있고, 하나의 스택 안에서 그레이디언트, 브러시, 휘도 범위와 결합한 뒤 전체 해상도로 내보낼 수 있어요.',
      ],
      privacyNote: '색상 범위 마스크는 내 픽셀을 Lab 공간에서 계산하므로 서버 호출이 필요 없어요. 로그인하지 않았다면 사진, 샘플링한 색, 모든 마스크가 내보내기 전까지 이 브라우저에 남고, 내보낼 때 그 한 번의 렌더링을 위해 비회원 작업으로 파일이 업로드돼요. 로그인했다면 원본과 1920 px 미리보기, 썸네일이 보관 기간 설정에 따라 프로젝트와 함께 저장되고 프로젝트와 함께 삭제돼요. 파일은 비회원일 때 24시간 보관되고, 무료 계정이 있으면 24시간에서 2년까지 선택할 수 있어요. 외부 업체로는 아무것도 전송되지 않아요.',
      faq: [
        {
          question: '허용량은 어떻게 측정하나요?',
          answer: 'CIE Lab Delta E 76 거리로 측정해요. 허용량 100은 반경 60 Lab 단위예요. 반경의 절반 안쪽에 있는 픽셀은 완전히 선택되고, 선택은 smoothstep을 따라 전체 반경에서 완전히 사라져요.',
        },
        {
          question: '선택 하나에 색을 몇 개까지 샘플링할 수 있나요?',
          answer: '색상 범위 구성 요소 하나당 최대 8개이고, Shift 클릭으로 추가해요. 각 픽셀은 그중 가장 강하게 일치하는 값을 따르고, 더 필요하면 두 번째 구성 요소를 추가하면 돼요.',
        },
        {
          question: '선택의 일부를 뺄 수 있나요?',
          answer: '네. 빼기 모드로 구성 요소를 하나 더 추가하세요. 예를 들어 넘친 부분을 칠하는 브러시나, 원하지 않는 색을 샘플링한 두 번째 색상 범위를 쓰면 min(m, 1 - value)로 제외돼요.',
        },
        {
          question: '밝기가 다른 그림자까지 선택되는 이유는 무엇인가요?',
          answer: 'Lab 거리는 색조뿐 아니라 밝기도 셈에 넣으므로, 색조가 같고 L이 20단위 어두운 그림자는 약 Delta E 20만큼 떨어져 있어요. 허용량을 낮추거나 휘도 범위와 교차시켜 밝기를 제한하세요.',
        },
        {
          question: '마스크만 따로 볼 수 있나요?',
          answer: '마스크 보기를 마스크만으로 설정하면 그레이스케일로, 오버레이로 설정하면 사진 위에 빨간색으로 보여요. 마스크를 선택한 상태에서 M 키를 누르면 보기 방식이 차례로 바뀌어요.',
        },
        {
          question: '다른 레이어를 편집하면 선택이 바뀌나요?',
          answer: '아니요. 색상 범위는 아래쪽 레이어의 출력이 아니라 기하학 보정을 거친 원본 사진을 읽으므로, 아래에서 노출을 조정해도 마스크는 움직이지 않아요.',
        },
      ],
      supportedFormats: {
        processingNotes: [
          '마스크는 매개변수 방식(샘플링한 색, 허용량, 페더)이라 내보낼 때 원본에 다시 렌더링되므로 프로젝트 크기를 전혀 늘리지 않아요.',
          '압축이 심한 JPG는 색차가 블록 모양으로 깨져 있어 선택 가장자리가 들쭉날쭉할 수 있어요. 마스크 페더를 조금 주면 감춰져요.',
        ],
      },
      related: [
        {
          label: '사물 색상 바꾸기',
          to: '/tools/change-image-color',
          description: '색상 범위별로 색조, 채도, 명도를 조정해요. 마스크를 써도 되고 안 써도 돼요.',
        },
        {
          label: '컬러 팝',
          to: '/tools/color-pop',
          description: '기본 제공 룩 하나로 한 가지 색만 남기고 나머지는 회색으로 만들어요.',
        },
        {
          label: '이미지 채도',
          to: '/tools/image-saturation',
          description: '활기와 채도를 선택 범위로 제한해 조정할 수 있어요.',
        },
        {
          label: '이미지 배경 제거',
          to: '/tools/remove-background-from-image',
          description: '피사체를 오려 낼 때는 색상 선택보다 AI 피사체 마스크가 나아요.',
        },
        {
          label: '잡티 제거',
          to: '/tools/remove-blemishes',
          description: '피부 톤 선택을 고르게 맞추기 전에 잡티를 먼저 복구하세요.',
        },
        {
          label: '편집기 가이드',
          to: '/tutorials/aperture',
          description: '여섯 가지 마스크 종류와 결합 방식을 모두 알아보세요.',
        },
      ],
      embed: {
        title: '색상으로 선택하기',
        description: '사진을 놓으면 마스크 패널이 열려요. 색상 범위를 추가하고 색을 클릭한 뒤 선택 범위만 보정하세요.',
      },
    },
    // MM111: Medi's launch page (model-written by Opus 5.5; native review pending).
    'medi': {
      name: "Medi",
      h1: "Medi: 나만의 가이드이자 편집 코파일럿",
      tagline: "알맞은 도구를 물어보고, 파일을 맡겨 작업을 준비시키고, 편집기에 원하는 것을 말한 뒤 바뀌는 모습을 지켜보세요. 모든 변경은 실행 취소 한 번으로 되돌릴 수 있어요.",
      metaTitle: "Medi: Media Manipulator의 AI 가이드이자 편집 코파일럿",
      metaDescription: "Medi는 알맞은 도구를 찾아 주고, 내가 확인할 작업을 준비하고, 평범한 말로 한 요청대로 사진, 동영상, 애니메이션을 편집해요. 모든 편집에는 이유가 있고 되돌릴 수 있어요.",
      ogTitle: "Medi: 나만의 가이드이자 편집 코파일럿",
      ogDescription: "어떤 도구를 써야 할지 Medi에게 묻고, 파일을 올리고, 준비된 작업을 검토한 뒤 버튼은 직접 누르세요. 편집기 안에서는 읽고, 미리 보고, 되돌릴 수 있는 편집을 해요.",
      embed: {
        defaultMediaKind: "image",
        defaultTask: "medi_guide",
        title: "Medi에게 물어보기",
        description: "가이드를 열고 하고 싶은 일을 설명하거나 클립 아이콘으로 파일을 첨부하세요. Medi가 설정이 채워진 알맞은 도구로 안내해요.",
      },
      intro: "Medi는 Media Manipulator에 들어 있는 어시스턴트이고, 두 곳에서 일해요. 모든 공개 페이지에서는 가이드예요. 작은 버튼을 누르면 채팅이 열리고, 사이트가 지원하는 어느 언어로든 원하는 것을 내 말로 말할 수 있어요. Medi는 사이트의 자체 문서를 바탕으로 각 도구가 하는 일, 어떤 설정이 있는지, 요금제에 무엇이 포함되는지 답해요. Aperture, Darkroom, Motion 안에서는 코파일럿이에요. 원하는 결과를 설명하면 문서를 한 단계로 바꿔 주고, 그 단계는 되돌릴 수 있어요. 두 곳 모두에서 지켜지는 규칙이 두 가지 있어요. 첫째, Medi는 준비만 해요. 내가 직접 버튼을 누르기 전에는 아무것도 시작되거나 내보내지거나 구매되지 않아요. 둘째, 스스로 설명해요. 가이드의 답변은 근거로 삼은 페이지를 밝히고, 모든 편집에는 한 문장짜리 이유가 붙어요.",
      whatItDoes: [
        "사이트의 도움말 페이지를 바탕으로 사이트에 관한 질문에 답해요. 그래서 이메일용으로 동영상을 줄이는 도구가 뭐냐는 질문에는 막연한 답이 아니라 도구 이름과 설정을 알려 줘요. Media Manipulator에 관한 이야기만 하고, 그 밖의 요청은 정중히 거절해요.",
        "클립 아이콘으로 가이드에 파일을 올릴 수 있어요. Medi는 형식, 크기, 길이, 해상도, 코덱 같은 파일의 기술 정보를 읽고, 이를 바탕으로 도구와 설정을 추천해요.",
        "도구 하나로 끝나는 작업을 준비해요. 원하는 것을 말하거나, 파일을 올리고 그냥 실행해 줘라고 말하면, Medi가 내 언어로 된 설정, 대기열 길이, 작업에 쓰일 일일 사용량을 담은 확인 카드를 보여 줘요. 스스로는 아무것도 시작하지 않아요. 작업을 시작하는 것은 카드의 버튼뿐이에요.",
        "Aperture, Darkroom, Motion 안에서 더 어두운 분위기로 해 줘, 쉬는 구간을 줄여 줘, 제목이 왼쪽에서 들어오게 해 줘 같은 요청대로 편집해요. 편집은 실행 취소 한 단계로 들어가고, 모든 변경에 짧은 이유가 붙어요.",
        "자기 작업을 수치로 확인해요. 편집한 뒤 미리보기를 측정할 수 있어요. 예를 들어 밝기와 화면 중 검정이나 흰색으로 잘린 부분의 비율, 또는 오디오의 음량을 재고, 최대 세 차례까지 다시 조정하며 그때마다 바뀐 수치를 근거로 들어요.",
      ],
      flowSteps: [
        {
          title: "가이드 열기",
          description: "아무 공개 페이지에서나 구석의 Medi 버튼을 누르거나, 편집기 안에서 Ctrl+J를 누르세요. 가이드는 계정이 필요 없고, 코파일럿은 로그인해야 써요.",
        },
        {
          title: "원하는 것 말하기",
          description: "요청을 입력하거나 시작 문구를 고르세요. 도움이 된다면 클립 아이콘으로 파일을 첨부하세요. Medi가 파일 정보를 읽어 그 파일에 맞는 조언을 해요.",
        },
        {
          title: "준비된 내용 검토하기",
          description: "작업은 설정, 대기열, 쓰일 사용량을 담은 카드로 나타나요. 편집은 줄마다 이유가 적힌 변경 카드로 나타나고, 적용 전에 검토하도록 설정할 수도 있어요.",
        },
        {
          title: "버튼은 직접 누르기",
          description: "시작을 누르면 지원되는 작업이 그 자리에서 실행되고, 열기를 누르면 설정이 채워진 도구로 이동해요. 편집기에서는 실행 취소 한 번으로 편집 전체가 되돌아가요.",
        },
      ],
      advancedDetails: [
        "가이드는 파일의 픽셀이나 오디오를 절대 읽지 않아요. 메타데이터를 바탕으로 작업하고, 몇몇 이미지와 오디오 점검에는 저희 서버에서 계산한 수치(휘도 히스토그램, 잘린 픽셀 비율, 통합 음량)를 써요. 모델이 보는 것은 이 수치이지 미디어 자체가 아니에요.",
        "준비된 작업은 카드가 표시되기 전에 도구의 실제 옵션 스키마와 대조해 검증돼요. 약 아흔 개 도구가 옵션을 공개하므로, 존재하지 않는 설정이나 범위를 벗어난 값을 요청하면 몰래 바뀌지 않고 거절돼요.",
        "시작을 누르면 그 자리에서 실행되는 작업은 동영상 압축, 크기 조정, 회전, 자르기와 트리밍, 오디오 트랙 추출이나 제거, 그리고 전사예요. 그 밖의 도구는 설정이 미리 채워진 채로 각자의 페이지에서 열려요. 출력 형식이나 페이지 범위 같은 세부 사항을 직접 확인해야 하는 양식이기 때문이에요.",
        "코파일럿 편집은 무엇이든 바뀌기 전에 편집기 자체 스키마와 대조해 검사하는 구조화된 연산이며, 전부 적용되거나 전혀 적용되지 않고, 편집기 작업 내역에 항목 하나로 기록돼요. 검증에 실패한 편집은 아무것도 바꾸지 않고, 모델에게 그 이유가 전달돼요.",
        "Medi의 모든 빌드는 짧은 버전 코드로 식별돼요. 이 코드는 빌드가 쓰는 지침, 문서, 편집 스키마의 콘텐츠 해시예요. 코파일럿 패널의 정보 메뉴에 표시되므로, 어떤 답변에 대해 지원팀에 문의할 때 그 답을 낸 빌드를 정확히 알려 줄 수 있어요.",
      ],
      whyItMatters: [
        "도구가 백 개가 넘는 사이트에는 찾기 문제가 있어요. 대부분의 방문자는 원하는 결과는 알지만, 그 결과를 내는 도구 이름은 몰라요. 사이트의 자체 페이지를 읽는 가이드는 막연한 요청을 도구, 설정, 링크로 바꿔 줘요.",
        "말로 하는 편집은 되돌릴 수 있고 설명할 수 있을 때만 믿을 수 있어요. 편집마다 이유가 적힌 실행 취소 한 단계이므로, 잘못 짚어도 키 한 번이면 되고 어떤 컨트롤이 무엇을 했는지 배울 수 있어요.",
        "어시스턴트에게 작업을 맡기는 것은 어시스턴트가 작업을 시작할 수 없을 때만 안전해요. 클릭을 내 손에 남겨 두면, AI의 실수로 잃는 것은 기껏해야 읽는 데 든 잠깐의 시간일 뿐 사용량이나 업로드, 내보내기가 낭비되지는 않아요.",
      ],
      useCases: [
        {
          title: "알맞은 도구 찾기",
          description: "동영상을 이메일로 보낼 만큼 작게 만드는 법이나 사진에서 배경이 투명한 로고를 얻는 법을 물어보면, Medi가 도구 이름과 가장 중요한 설정 하나를 알려 주고 링크를 걸어 줘요.",
        },
        {
          title: "빠른 작업 실행하기",
          description: "휴대폰 영상을 올리고 그냥 실행해 줘라고 말한 뒤 카드를 확인하세요. 균형 수준의 압축기, mp4 출력, 일반 작업 한 번, 대기 없음. 시작을 누르면 같은 창에 결과가 나타나요.",
        },
        {
          title: "설명으로 사진 보정하기",
          description: "Aperture에서 그림자를 끌어올린 더 차갑고 밝은 버전을 요청하세요. Medi가 조정 레이어를 추가하고 이유를 알려 주며, 보여주기를 누르면 각 슬라이더가 어디로 움직였는지 볼 수 있어요.",
        },
        {
          title: "타임라인 정리하기",
          description: "Darkroom이나 Motion에서 슬라이드로 들어오는 하단 자막 바나 긴 쉬는 구간 줄이기를 요청하고, 변경 카드를 검토해 적용한 뒤, 타이밍이 맞지 않으면 실행 취소하세요.",
        },
      ],
      workedExamples: [
        {
          title: "휴대폰 영상을 준비하고 확인하기",
          body: "휴대폰으로 찍은 1080 x 1920 영상을 올리고 그냥 실행해 줘, 작게 만들어 줘라고 입력해요. Medi가 메타데이터(59초, H.264, 30 fps)를 읽고, 균형 수준의 동영상 압축기에 mp4 출력과 원본 해상도를 골라 카드를 보여 줘요. 카드에는 이 작업이 일반 작업 1회를 쓰고 대기열이 없다고 나오며, 설정 하나하나가 내 언어로 적혀 있어요. 아직 아무 일도 일어나지 않았어요. 시작을 누르면 압축기가 정확히 그 설정으로 실행되고, 결과가 다운로드 버튼이 있는 창으로 열려요.",
        },
        {
          title: "어두운 사진을 측정하며 보정하기",
          body: "Aperture에서 Medi에게 어두운 사진을 고쳐 달라고 해요. Medi는 먼저 미리보기를 측정해요. 0에서 1 척도로 평균 밝기는 0.18이고, 픽셀의 9퍼센트가 검정으로 뭉개져 있어요. 노출 레이어와 그림자 올리기를 추가하고 다시 측정한 뒤(밝기 0.30, 그림자 5퍼센트), 작은 보정을 하나 더 더하고 0.43, 잘림 0.8퍼센트에서 멈춰요. 처음에 밝힌 목표 범위 안이에요. 모두 3차례였고, 이유마다 해당 수치를 근거로 들며, 실행 취소 한 번이면 전부 사라져요.",
        },
      ],
      whenNotToUse: "Medi는 도우미이지 도구 자체를 대신하지 않아요. 도구와 설정을 이미 알고 있다면 묻는 것보다 도구 페이지를 여는 편이 빨라요. 스스로 작업을 실행하지 않고, 웹을 검색하거나 Media Manipulator와 관계없는 질문에 답하지 않으며, 기술 정보 말고는 파일 내용을 볼 수 없어요. 그리고 취향을 판단하는 데는 서툴러요. 원하는 느낌을 요청하면 따르지만, 그 느낌이 맞는지는 내가 정해요. 정확한 자르기나 특정 비트레이트처럼 세밀한 제어가 필요한 작업은 값을 직접 정하세요.",
      whyMediaManipulator: [
        "Medi는 내가 보는 것과 같은 페이지를 읽어요. 도구, 설정, 요금제에 관한 답은 사이트의 자체 문서와 실시간 요금제 표에서 나오므로, 낡지 않고 사이트가 바뀌면 함께 바뀌어요.",
        "코파일럿은 편집기가 쓰는 것과 같은 연산으로 실제 프로젝트 파일을 편집해요. 그래서 Medi가 하는 모든 일은 편집기 작업 내역에 나타나고 실행 취소 규칙을 따라요.",
        "코파일럿의 일일 사용량은 사이트의 다른 모든 한도와 같은 요금제 표에서 정해지고, 가이드는 모든 요금제에서 쓸 수 있어요.",
      ],
      privacyNote: "Medi는 사이트에서 외부 AI 서비스를 쓰는 유일한 기능이에요. 내 메시지, 지금 보고 있는 페이지, 그리고 편집기에서는 프로젝트의 짧은 텍스트 요약(허용하면 작은 미리보기 이미지도)이 OpenRouter를 거쳐 Anthropic의 Claude 모델로 전송되며, 원본 미디어 파일은 전송되지 않아요. 가이드에 올린 파일은 다른 업로드와 똑같이 저장되고 계정의 보관 규칙에 따라 보관돼요. 로그인한 상태의 대화는 나를 위해 저장되며, 내가 고른 보관 기간이 지나거나 계정을 삭제하면 함께 삭제돼요. 자세한 내용은 개인정보 처리방침 1.13절에 있어요.",
      faq: [
        {
          question: "Medi를 쓰려면 계정이 필요한가요?",
          answer: "가이드는 필요 없어요. 누구나 도구, 설정, 요금제에 대해 물어볼 수 있어요. Aperture, Darkroom, Motion 안의 코파일럿은 내 계정에 딸린 일일 사용량을 쓰기 때문에 로그인해야 해요.",
        },
        {
          question: "내가 아무것도 누르지 않아도 Medi가 작업을 실행할 수 있나요?",
          answer: "아니요. 작업을 준비하고 카드를 보여 줄 수만 있어요. 작업을 시작하거나 도구를 여는 것은 카드를 클릭하는 것뿐이므로, 어시스턴트가 실수해도 사용량이 저절로 소모되는 일은 없어요.",
        },
        {
          question: "코파일럿 편집에는 얼마가 드나요?",
          answer: "편집을 하는 메시지 하나마다 하루 코파일럿 편집 횟수가 한 번 쓰여요. 편집 전체를 단계별로 계획하면 몇 번이 쓰여요. 가이드, 질문하기, 실행 취소는 무료예요. 요금제별 하루 횟수는 이 페이지의 표와 요금제 페이지에 있어요.",
        },
        {
          question: "Medi가 설정해 줄 수 있는 도구는 무엇인가요?",
          answer: "동영상과 오디오 변환기부터 이미지 필터, PDF 도구, AI 도구까지 약 아흔 개이고, 각각 실제 옵션 목록을 갖추고 있어요. 편집기 자체 같은 나머지는 설명하고 링크를 걸어 줘요. 도구에 없는 설정을 요청하면 없다고 알려 줘요.",
        },
        {
          question: "Medi의 편집은 어떻게 실행 취소하나요? 먼저 확인할 수도 있나요?",
          answer: "변경 카드의 실행 취소를 누르거나 편집기 자체의 실행 취소를 쓰면 편집 전체가 한 번에 되돌아가요. 바뀌기 전에 먼저 보고 싶다면 정보 메뉴에서 자동 적용을 끄세요. 그러면 각 편집이 전후 값과 적용, 취소 버튼이 있는 카드로 대기해요.",
        },
        {
          question: "편집 후 Medi가 말하는 수치를 믿어도 되나요?",
          answer: "추측이 아니라 측정한 값이에요. 이미지는 밝기, 잘린 비율, 색 편향을, 오디오는 음량과 트루 피크를 미리보기나 파일에서 계산해요. 모델은 이 수치를 읽고 목표에 맞추려고 최대 세 번까지 다시 조정할 수 있으며, 목표에 도달하면 멈추도록 지시받아요.",
        },
        {
          question: "Medi는 어떤 언어를 이해하나요?",
          answer: "사이트가 제공되는 모든 언어를 이해하고, 내가 쓴 언어로 답해요. 확인 카드와 설정 이름은 사이트 언어를 따르므로, 버튼을 누르기 전에 준비된 작업을 자연스럽게 읽을 수 있어요.",
        },
      ],
      related: [
        {
          label: "동영상 압축",
          to: "/tools/compress-video",
          description: "Medi가 준비하고 가이드에서 바로 시작할 수 있는 압축기예요.",
        },
        {
          label: "동영상 자르기",
          to: "/tools/video-trimmer",
          description: "시작과 끝 시간에 맞춰 영상을 잘라요. Medi가 확인된 카드로 실행할 수 있는 또 다른 작업이에요.",
        },
        {
          label: "동영상에서 오디오 추출",
          to: "/tools/extract-audio-from-video",
          description: "동영상에서 사운드트랙을 뽑아내요. 이것도 그 자리에서 실행되는 준비된 작업으로 쓸 수 있어요.",
        },
        {
          label: "Aperture",
          to: "/tools/aperture",
          description: "코파일럿이 요청대로 레이어와 마스크를 편집하는 사진 편집기예요.",
        },
        {
          label: "Motion",
          to: "/tools/motion",
          description: "코파일럿이 직접 살펴볼 수 있는 키프레임을 만들어 주는 SVG 애니메이션 편집기예요.",
        },
        {
          label: "Medi 튜토리얼",
          to: "/tutorials/medi",
          description: "짧은 작업 흐름 세 가지: 도구 찾기, 작업 실행하기, 읽을 수 있는 이유와 함께 편집하기.",
        },
      ],
    },
  },
} as const;

export default koToolPages;
