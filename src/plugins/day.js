// 设置dayjs并重新导出
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isToday from "dayjs/plugin/isToday";
import isoWeek from "dayjs/plugin/isoWeek";
import isBetween from "dayjs/plugin/isBetween"
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);
dayjs.extend(isToday);
dayjs.extend(isBetween);

// 默认时区为东八区
const _timezone = "Asia/Shanghai";
dayjs.tz.setDefault(_timezone);

export default dayjs;
