import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import da from "./da.json";

//When messages are merged:
//import { locale } from "../../locales";

export const languageRessources = {
  da: { translation: da },
  en: { translation: en },
};

i18next.use(initReactI18next).init({
  compatibilityJSON: "v3",
  // When messages are merged: locale.substring(0, 2) 
  lng: "da",
  fallbackLng: "da",
  resources: languageRessources,
});

export default i18next;
