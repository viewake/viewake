# CDN과 일반 HTML

번들러 없이 AOS처럼 CSS와 전역 스크립트 두 개만 연결할 수 있습니다.

::: warning 배포 전 안내
아래 CDN URL은 `viewake@0.1.0` 패키지를 npm에 공개한 뒤 활성화됩니다.
:::

## 1. CSS 연결

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/viewake@0.1.0/styles/viewake.css"
/>
```

## 2. data 속성 작성

```html
<section data-viewake="fade-up">
  한 번 등장
</section>

<section data-viewake="zoom-in" data-viewake-mode="replay" data-viewake-delay="200">
  다시 등장
</section>
```

## 3. 스크립트와 초기화

`body`가 닫히기 직전에 추가하면 앞의 DOM이 만들어진 뒤 실행됩니다.

```html
<script src="https://cdn.jsdelivr.net/npm/viewake@0.1.0/dist/viewake.global.js"></script>
<script>
  Viewake.init();
</script>
```

IIFE 번들이 `window.Viewake` 전역 객체를 만듭니다.

## 완전한 예제

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/viewake@0.1.0/styles/viewake.css"
    />
  </head>
  <body>
    <main>
      <section data-viewake="fade-up">
        한 번 등장하는 섹션
      </section>

      <section data-viewake="zoom-in" data-viewake-mode="replay">
        다시 등장하는 섹션
      </section>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/viewake@0.1.0/dist/viewake.global.js"></script>
    <script>
      Viewake.init({
        threshold: 0.2,
      });
    </script>
  </body>
</html>
```

## CSS 커스터마이징

```html
<style>
  [data-viewake] {
    --viewake-duration: 500ms;
    --viewake-distance: 20px;
  }

  [data-viewake="pop"][data-viewake-state="pending"] {
    opacity: 0;
    transform: scale(0.8);
  }
</style>
```

CDN 사용에서도 JavaScript를 바꾸지 않고 CSS 효과를 확장할 수 있습니다.

## 버전 고정

운영 사이트에서는 `@latest` 대신 `@0.1.0`처럼 버전을 고정하세요. 새 메이저
버전의 기본 동작 변경이 운영 화면에 즉시 반영되는 일을 막을 수 있습니다.

## 실습 완료 조건

- 빈 HTML 파일에서 CSS·스크립트·초기화만으로 실행했다.
- once와 replay를 data 속성 하나의 차이로 만들었다.
- CSS에 `viewake-pop`을 추가하고 코어 수정 없이 사용했다.
