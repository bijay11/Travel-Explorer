import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const rootNode = document.getElementById("app");

if (rootNode)
  createRoot(rootNode).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
