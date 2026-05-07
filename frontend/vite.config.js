import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

// =====================================================
// ================= VITE CONFIG =======================
// =====================================================

export default defineConfig({

  plugins: [
    react(),
  ],

  // =====================================================
  // ================= DEV SERVER ========================
  // =====================================================

  server: {

    proxy: {

      "/api": {

        target:
          "http://localhost:5001",

        changeOrigin: true,

        secure: false,
      },
    },
  },

  // =====================================================
  // ================= BUILD OPTIMIZATION ================
  // =====================================================

  build: {

    // ✅ REMOVE LARGE WARNING
    chunkSizeWarningLimit: 1000,

    // ✅ BETTER MINIFY
    minify: "esbuild",

    // ✅ SPLIT CHUNKS
    rollupOptions: {

      output: {

        manualChunks: {

          react: [
            "react",
            "react-dom",
          ],

          router: [
            "react-router-dom",
          ],

          editor: [
            "@tiptap/react",
            "@tiptap/starter-kit",
            "quill",
          ],

          icons: [
            "react-icons",
          ],
        },
      },
    },
  },
});