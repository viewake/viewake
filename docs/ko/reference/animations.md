# 애니메이션 프리셋

모든 프리셋은 `data-viewake="이름"`으로 선택합니다. JavaScript는 애니메이션 이름을 해석하지 않고 상태만 바꾸며, 실제 움직임은 `viewake/styles.css`에 있습니다.

프리셋 계열은 AOS 사용자가 낯설지 않도록
[AOS 공식 저장소](https://github.com/michalsnik/aos)의 fade·flip·slide·zoom
목록을 기준으로 검토했습니다. 다만 동작 코드는 Viewake의 방향 기반
once/replay 상태 머신과 CSS 변수 구조로 독립 구현했습니다.

## Fade: 짧은 이동과 투명도

| 값 | 등장 전 위치 |
| --- | --- |
| `fade` | 이동 없이 투명 |
| `fade-up` / `fade-down` | 아래 / 위 |
| `fade-left` / `fade-right` | 오른쪽 / 왼쪽 |
| `fade-up-right` / `fade-up-left` | 왼쪽 아래 / 오른쪽 아래 |
| `fade-down-right` / `fade-down-left` | 왼쪽 위 / 오른쪽 위 |

```html
<section data-viewake="fade-up-right">대각선에서 등장</section>
```

## Slide: 더 큰 거리 이동

`slide-up`, `slide-down`, `slide-left`, `slide-right`를 제공합니다. Fade보다 이동 거리가 커서 섹션 전환이나 큰 이미지에 적합합니다.

```html
<img data-viewake="slide-left" src="/product.webp" alt="제품" />
```

## Zoom: 확대·축소

- 가운데: `zoom-in`, `zoom-out`
- 방향 결합: `zoom-in-up`, `zoom-in-down`, `zoom-in-left`, `zoom-in-right`
- 반대 크기 결합: `zoom-out-up`, `zoom-out-down`, `zoom-out-left`, `zoom-out-right`

```html
<div data-viewake="zoom-in" data-viewake-delay="200">카드</div>
```

## Flip: 3D 회전

`flip-up`, `flip-down`, `flip-left`, `flip-right`를 제공합니다. 텍스트가 많은 긴 본문보다는 배지나 작은 카드에 제한적으로 사용하는 편이 읽기 좋습니다.

```html
<div data-viewake="flip-up">새 기능</div>
```

## 속도와 이동 거리 바꾸기

CSS 변수를 요소나 프로젝트 CSS에서 덮어쓸 수 있습니다.

```css
.slow-section {
  --viewake-duration: 900ms;
  --viewake-distance: 40px;
  --viewake-slide-distance: 100px;
  --viewake-easing: cubic-bezier(0.16, 1, 0.3, 1);
}
```

```html
<section class="slow-section" data-viewake="fade-up">...</section>
```

delay·duration·easing만 다르면 CSS를 만들 필요 없이 각각
`data-viewake-delay`, `data-viewake-duration`, `data-viewake-easing`을
사용하세요. CSS 변수는 여러 값을 프로젝트 클래스 하나로 묶을 때 유용합니다.

## 어떤 프리셋을 선택할까요?

본문과 카드에는 `fade-up`, 좌우 비교 콘텐츠에는 `fade-left/right`, 큰 시각 자료에는 `slide-*`, 짧은 강조 카드에는 `zoom-in`을 먼저 시도하세요. Flip을 많은 요소에 사용하면 시선이 분산될 수 있습니다.

## 실습 완료 조건

- 네 계열에서 하나씩 적용하고 차이를 확인했다.
- `--viewake-duration`과 `data-viewake-delay`의 역할 차이를 설명할 수 있다.
- 새 프리셋을 고를 때 콘텐츠의 크기와 중요도를 고려했다.

직접 효과를 만들려면 [사용자 애니메이션 만들기](/ko/guide/custom-animation)로 이동하세요.
