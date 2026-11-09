import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadContent } from "./scripts/content.mjs";
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    {
      name: "validated-content",
      transformIndexHtml(html) {
        if (command === "serve")
          return html.replace(
            "<!--page-head-->",
            '<title>Лилия Янушкевич — локальный просмотр</title><meta name="robots" content="noindex,follow"/>',
          );
      },
      resolveId(id) {
        if (id === "virtual:content") return "\0virtual:content";
      },
      load(id) {
        if (id === "\0virtual:content")
          return `export default ${JSON.stringify(loadContent({ preview: command === "serve" }))}`;
      },
      handleHotUpdate(ctx) {
        if (
          ctx.file.includes("/content/") ||
          ctx.file.includes("\\content\\")
        ) {
          const mod = ctx.server.moduleGraph.getModuleById("\0virtual:content");
          if (mod) ctx.server.moduleGraph.invalidateModule(mod);
          ctx.server.ws.send({ type: "full-reload" });
        }
      },
    },
  ],
  server: { watch: { ignored: ["**/.local/**"] } },
  build: { outDir: "dist" },
}));
