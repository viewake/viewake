import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";

import ViewakePlayground from "./components/ViewakePlayground.vue";
import "./style.css";
import "../../../packages/viewake/styles/viewake.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("ViewakePlayground", ViewakePlayground);
  },
} satisfies Theme;
