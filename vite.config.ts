import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": resolve(__dirname, "src/components"),
      "@lib": resolve(__dirname, "src/lib"),
      "@hooks": resolve(__dirname, "src/hooks"),
      "@features": resolve(__dirname, "src/features"),
      "@types": resolve(__dirname, "src/types"),
    },
  },
});
