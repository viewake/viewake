import { defineConfig } from "vitepress";

const englishSidebar = [
  {
    text: "Start here",
    items: [
      { text: "What is Viewake?", link: "/guide/introduction" },
      { text: "Getting started", link: "/guide/getting-started" },
      { text: "Data attribute model", link: "/guide/data-attributes" },
      { text: "How it works", link: "/guide/architecture" },
      { text: "Once and replay", link: "/guide/modes" },
    ],
  },
  {
    text: "Use Viewake",
    items: [
      { text: "CDN and plain HTML", link: "/guide/cdn" },
      { text: "React and Next.js", link: "/frameworks/react-next" },
      { text: "Vue 3", link: "/frameworks/vue" },
    ],
  },
  {
    text: "Customize",
    items: [
      { text: "Animation presets", link: "/reference/animations" },
      { text: "Write a custom animation", link: "/guide/custom-animation" },
      { text: "Accessibility and SSR", link: "/guide/accessibility" },
    ],
  },
  {
    text: "API reference",
    items: [
      { text: "Options", link: "/reference/options" },
      { text: "Controller and events", link: "/reference/controller" },
      { text: "Troubleshooting", link: "/guide/troubleshooting" },
    ],
  },
];

const koreanSidebar = [
  {
    text: "시작하기",
    items: [
      { text: "Viewake란?", link: "/ko/guide/introduction" },
      { text: "시작하기", link: "/ko/guide/getting-started" },
      { text: "data 속성 사용법", link: "/ko/guide/data-attributes" },
      { text: "내부 동작 원리", link: "/ko/guide/architecture" },
      { text: "once와 replay", link: "/ko/guide/modes" },
    ],
  },
  {
    text: "Viewake 사용",
    items: [
      { text: "CDN과 일반 HTML", link: "/ko/guide/cdn" },
      { text: "React와 Next.js", link: "/ko/frameworks/react-next" },
      { text: "Vue 3", link: "/ko/frameworks/vue" },
    ],
  },
  {
    text: "커스터마이징",
    items: [
      { text: "애니메이션 프리셋", link: "/ko/reference/animations" },
      { text: "사용자 애니메이션 만들기", link: "/ko/guide/custom-animation" },
      { text: "접근성과 SSR", link: "/ko/guide/accessibility" },
    ],
  },
  {
    text: "API 레퍼런스",
    items: [
      { text: "옵션", link: "/ko/reference/options" },
      { text: "Controller와 이벤트", link: "/ko/reference/controller" },
      { text: "문제 해결", link: "/ko/guide/troubleshooting" },
    ],
  },
];

export default defineConfig({
  base: "/viewake/",
  title: "Viewake",
  description: "Wake elements as they enter the view.",
  appearance: "dark",
  cleanUrls: true,
  lastUpdated: true,
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        href: "/viewake/brand/icon.png",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        crossorigin: "",
        href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css",
      },
    ],
    [
      "meta",
      {
        name: "theme-color",
        content: "#ffffff",
        media: "(prefers-color-scheme: light)",
      },
    ],
    [
      "meta",
      {
        name: "theme-color",
        content: "#090b15",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "Viewake" }],
    [
      "meta",
      {
        property: "og:description",
        content: "A CSS-first, direction-aware scroll reveal library.",
      },
    ],
    [
      "meta",
      {
        property: "og:image",
        content: "https://viewake.github.io/viewake/brand/social.png",
      },
    ],
    [
      "meta",
      {
        property: "og:url",
        content: "https://viewake.github.io/viewake/",
      },
    ],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "Viewake, scroll animation, reveal animation, IntersectionObserver, React, Next.js, Vue",
      },
    ],
  ],
  locales: {
    root: {
      label: "English",
      lang: "en",
      themeConfig: {
        nav: [
          { text: "Guide", link: "/guide/getting-started" },
          { text: "Animations", link: "/reference/animations" },
          { text: "Frameworks", link: "/frameworks/react-next" },
          { text: "API", link: "/reference/options" },
        ],
        sidebar: englishSidebar,
        outline: {
          label: "On this page",
          level: [2, 3],
        },
        docFooter: {
          prev: "Previous page",
          next: "Next page",
        },
        lastUpdated: {
          text: "Last updated",
        },
        returnToTopLabel: "Back to top",
        sidebarMenuLabel: "Menu",
        darkModeSwitchLabel: "Theme",
        search: {
          provider: "local",
        },
        footer: {
          message: "Released under the MIT License.",
          copyright: "Copyright © 2026 Viewake contributors",
        },
      },
    },
    ko: {
      label: "한국어",
      lang: "ko",
      link: "/ko/",
      themeConfig: {
        nav: [
          { text: "가이드", link: "/ko/guide/getting-started" },
          { text: "애니메이션", link: "/ko/reference/animations" },
          { text: "프레임워크", link: "/ko/frameworks/react-next" },
          { text: "API", link: "/ko/reference/options" },
        ],
        sidebar: koreanSidebar,
        outline: {
          label: "이 페이지의 목차",
          level: [2, 3],
        },
        docFooter: {
          prev: "이전 페이지",
          next: "다음 페이지",
        },
        lastUpdated: {
          text: "마지막 업데이트",
        },
        returnToTopLabel: "맨 위로",
        sidebarMenuLabel: "메뉴",
        darkModeSwitchLabel: "테마",
        search: {
          provider: "local",
          options: {
            locales: {
              ko: {
                translations: {
                  button: {
                    buttonText: "문서 검색",
                    buttonAriaLabel: "문서 검색",
                  },
                  modal: {
                    noResultsText: "검색 결과가 없습니다.",
                    resetButtonTitle: "검색 초기화",
                    footer: {
                      selectText: "선택",
                      navigateText: "이동",
                      closeText: "닫기",
                    },
                  },
                },
              },
            },
          },
        },
        footer: {
          message: "MIT License로 배포됩니다.",
          copyright: "Copyright © 2026 Viewake contributors",
        },
      },
    },
  },
  themeConfig: {
    logo: {
      light: "/brand/logo-light.png",
      dark: "/brand/logo-dark.png",
      alt: "Viewake",
    },
    siteTitle: false,
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/viewake/viewake",
      },
    ],
  },
});
