import React from "react";
import ReactDOM from "react-dom/client";
import "./includes/styles.css";
import { AppRoutes } from "./routes/AppRoutes";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
);