import React from "react";

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./theme/neo-orange-theme.css";

createRoot(document.getElementById("root")!).render(<App />);
