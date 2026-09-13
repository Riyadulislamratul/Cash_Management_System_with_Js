import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { CashProvider } from "./context/CashContext";

import "./index.css";
import { SettingsProvider } from "./context/SettingsContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SettingsProvider>
    <CashProvider>
      <App />
    </CashProvider>
    </SettingsProvider>
  </StrictMode>,
);