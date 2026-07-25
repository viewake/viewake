---
layout: home

hero:
  name: Viewake
  text: 화면에 들어오는 요소를 깨우세요.
  tagline: 스크롤 방향을 이해하는 가벼운 등장 애니메이션 라이브러리입니다. 예측 가능한 once·replay 모드와 CDN, React, Next.js, Vue를 지원합니다.
  actions:
    - theme: brand
      text: 시작하기
      link: /ko/guide/getting-started
    - theme: alt
      text: replay 이해하기
      link: /ko/guide/modes
  image:
    src: /brand/icon.png
    alt: Viewake 아이콘

features:
  - title: 애니메이션은 CSS가 담당
    details: JavaScript는 data-viewake-state 속성만 바꿉니다. 새 애니메이션은 CSS만으로 추가합니다.
  - title: 방향을 이해하는 replay
    details: 화면 위로 지나간 콘텐츠는 숨기지 않고, 요소가 화면 아래에 있을 때만 안전하게 재설정합니다.
  - title: 어디서든 같은 방식
    details: 일반 HTML과 CDN, React, Next.js, Vue가 하나의 작은 프레임워크 독립 코어를 공유합니다.
  - title: 접근성을 고려한 기본값
    details: JavaScript가 실패해도 콘텐츠는 보이며 모션 감소 설정을 자동으로 존중합니다.
  - title: SSR 안전
    details: 모듈을 평가할 때 window나 document에 접근하지 않아 서버 렌더링 프로젝트에서도 안전하게 불러옵니다.
  - title: gzip 약 2KB
    details: IntersectionObserver와 두 상태의 상태 머신, CSS transition만으로 동작합니다.
---

<div class="viewake-home-demo">
  <ViewakePlayground />
</div>
