import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { CashProvider } from "./context/CashContext";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CashProvider>
      <App />
    </CashProvider>
  </StrictMode>,
);