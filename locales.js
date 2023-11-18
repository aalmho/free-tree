// locales.js
import dayjs from 'dayjs';
import 'dayjs/locale/da';
import LocalizedFormat  from 'dayjs/plugin/localizedFormat';
dayjs.extend(LocalizedFormat)
dayjs.locale('da');

export default dayjs;
