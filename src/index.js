import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store";

//languages
import global_eng from './translations/eng/global.json';
import global_ar from './translations/ar/global.json';
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import secureLocalStorage from "react-secure-storage";

const language = secureLocalStorage.getItem("language");

i18next.init({
  interpolation: {escapeValue: false},
  lng: language ? language : 'eng',
  resources: {
    eng: {
      global: global_eng
    },
    ar: {
      global: global_ar
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
