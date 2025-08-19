import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SubscribeProvider } from "./context/subscribe";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <SubscribeProvider>
      <App />
    </SubscribeProvider>
  </>
);

reportWebVitals();
