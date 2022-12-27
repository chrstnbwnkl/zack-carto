import React from "react";
import reactDOM from "react-dom/client";
import { zackConfig, defaultSettings } from "./config";
import { App } from "./App";

import "./index.css";

const root = reactDOM.createRoot(document.getElementById("root"));
// TODO: enable strict mode
root.render(<App config={zackConfig} defaultSettings={defaultSettings} />);
