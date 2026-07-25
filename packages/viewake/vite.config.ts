import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL(".", import.meta.url));

export default {
  build: {
    emptyOutDir: false,
    lib: {
      entry: `${packageRoot}src/index.ts`,
      name: "Viewake",
      formats: ["iife"],
      fileName: () => "viewake.global.js",
    },
    outDir: `${packageRoot}dist`,
    sourcemap: true,
  },
};
