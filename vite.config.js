import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Utvecklingsservern ska ALLTID köra på port 3023 (enligt projektkrav).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3023,
    strictPort: true,
    host: true,
  },
  preview: {
    port: 3023,
    strictPort: true,
  },
  build: {
    outDir: "dist",
  },
});
