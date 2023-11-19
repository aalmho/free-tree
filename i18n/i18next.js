import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import da from "./da.json";
import { NativeModules } from 'react-native'

const longLocale = NativeModules.SettingsManager.settings.AppleLocale ||
               NativeModules.SettingsManager.settings.AppleLanguages[0] || 'da'

const shortLocale = longLocale.substring(0, 2);

export const languageRessources = {
  da: { translation: da },
  en: { translation: en },
};

i18next.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: shortLocale,
  fallbackLng: "da",
  resources: languageRessources,
});

export default i18next;
