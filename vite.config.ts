import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { internalIpV4 } from "internal-ip";

// @ts-expect-error process is a nodejs global
const mobile = !!/android|ios/.exec(process.env.TAURI_ENV_PLATFORM);

// https://vitejs.dev/config/
export default defineConfig(async () => ({
   plugins: [solid()],

   // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
   //
   // 1. prevent vite from obscuring rust errors
   clearScreen: false,
   // 2. tauri expects a fixed port, fail if that port is not available
   server: {
      port: 1420,
      strictPort: true,
      host: mobile ? "0.0.0.0" : false,
      hmr: mobile
         ? {
            protocol: "ws",
            host: await internalIpV4(),
            port: 1421,
         }
         : undefined,
      watch: {
         // 3. tell vite to ignore watching `src-tauri`
         ignored: ["**/src-tauri/**"],
      },
      proxy: {
         "/translation_text": {
            target: "https://dict-mobile.iciba.com/interface/index.php",
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/translation_text/, ""),
         },
         "/iciba_translation_text": {
            target: "https://www.iciba.com/_next/data/dTlbEbttstfo-ZBl63u0M/word.json",
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/iciba_translation_text/, ""),
         },
         "/translation_audio": {
            target: "https://dict.youdao.com/dictvoice",
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/translation_audio/, ""),
         },
      },
   },
}));
