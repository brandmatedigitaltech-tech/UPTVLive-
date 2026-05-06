import React from "react";

import ReactDOM from "react-dom/client";

import {
  HelmetProvider,
} from "react-helmet-async";

import App from "./App";

import "./App.css";

// =====================================================
// ================= ROOT ==============================
// =====================================================

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    {/* SEO PROVIDER */}
    <HelmetProvider>

      <App />

    </HelmetProvider>

  </React.StrictMode>
);