import "./index.css";

import React from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./router/routes";

createRoot(document.getElementById("root")!).render(<AppRouter />);
