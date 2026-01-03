import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        content: "src/content/content.js"
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "content") return "assets/content.js";
          return "assets/[name]-[hash].js";
        }
      }
    }
  }
});
