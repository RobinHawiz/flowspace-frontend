import { defineConfig } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "src/**/*.{ts,tsx}" --cache',
        dev: {
          logLevel: ["error"],
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@images": path.resolve(import.meta.dirname, "public/images"),
      "@api": path.resolve(import.meta.dirname, "src/api"),
      "@components": path.resolve(import.meta.dirname, "src/components"),
      "@contexts": path.resolve(import.meta.dirname, "src/contexts"),
      "@hooks": path.resolve(import.meta.dirname, "src/hooks"),
      "@protectedRoutes": path.resolve(
        import.meta.dirname,
        "src/routes/protected",
      ),
      "@publicRoutes": path.resolve(import.meta.dirname, "src/routes/public"),
      "@customTypes": path.resolve(import.meta.dirname, "src/types"),
      "@utils": path.resolve(import.meta.dirname, "src/utils"),
      "@src": path.resolve(import.meta.dirname, "src"),
    },
  },
  server: {
    open: true,
  },
});
