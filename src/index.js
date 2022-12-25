import React from "react";
import reactDOM from "react-dom/client";
import { CONFIG } from "./config";
import { App } from "./App";

import "./index.css";

const root = reactDOM.createRoot(document.getElementById("root"));
root.render(<App config={CONFIG} />);
