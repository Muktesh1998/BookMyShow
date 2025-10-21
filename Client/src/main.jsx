import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./redux/store";
import { Provider } from "react-redux";
import ThemeProvider from "./components/ThemeProvider.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
        <ThemeToggle />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
