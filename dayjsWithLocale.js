// locales.js
import dayjs from 'dayjs';
import 'dayjs/locale/da';
import LocalizedFormat  from 'dayjs/plugin/localizedFormat';
import { NativeModules } from 'react-native'

// iOS:
export const locale = NativeModules.SettingsManager.settings.AppleLocale ||
               NativeModules.SettingsManager.settings.AppleLanguages[0] || 'da'
// // Android:
// const locale = NativeModules.I18nManager.localeIdentifier // "fr_FR"

dayjs.extend(LocalizedFormat);
dayjs.locale(locale.substring(0,2));

export default dayjs;
