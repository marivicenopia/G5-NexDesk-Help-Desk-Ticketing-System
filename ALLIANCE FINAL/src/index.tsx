import React from "react";
import ReactDOM from "react-dom/client";

import "./includes/styles.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ToDoApp from "./views/containers/ToDoApp/todoapp";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      {/* <ToDoApp />       */}
    </BrowserRouter>
  </React.StrictMode>,
);