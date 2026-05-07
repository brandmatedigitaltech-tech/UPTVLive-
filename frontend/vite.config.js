import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

export default defineConfig({

  plugins: [
    react(),
  ],

  // DEV SERVER
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

  // BUILD
  build: {

    chunkSizeWarningLimit: 1000,

    rollupOptions: {

      output: {

        manualChunks(id) {

          // REACT
          if (
            id.includes("react")
          ) {
            return "react";
          }

          // ROUTER
          if (
            id.includes(
              "react-router-dom"
            )
          ) {
            return "router";
          }

          // EDITOR
          if (
            id.includes("@tiptap") ||
            id.includes("quill")
          ) {
            return "editor";
          }

          // ICONS
          if (
            id.includes("react-icons")
          ) {
            return "icons";
          }
        },
      },
    },
  },
});