import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const GOAL_DATE_FORMAT = "DD-MM-YYYY";

export const EMPTY_GOAL_COUNTDOWN = Object.freeze({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

export const normalizeGoalDeadline = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsedValue =
    typeof value === "string" && /^\d{2}-\d{2}-\d{4}$/.test(value)
      ? dayjs(value, GOAL_DATE_FORMAT, true)
      : dayjs(value);

  return parsedValue.isValid() ? parsedValue.startOf("day") : null;
};

export const getDefaultGoalDeadline = () =>
  dayjs().add(1, "day").startOf("day");

export const isGoalDeadlineDisabled = (candidate, now = dayjs()) => {
  if (!candidate || !dayjs(candidate).isValid()) {
    return true;
  }

  return !dayjs(candidate).startOf("day").isAfter(dayjs(now).startOf("day"));
};

export const calculateGoalTimeLeft = (deadline, now = dayjs()) => {
  const normalizedDeadline = normalizeGoalDeadline(deadline);

  if (!normalizedDeadline) {
    return { ...EMPTY_GOAL_COUNTDOWN };
  }

  const distance = normalizedDeadline.valueOf() - dayjs(now).valueOf();

  if (distance <= 0) {
    return { ...EMPTY_GOAL_COUNTDOWN };
  }

  const dayInMilliseconds = 1000 * 60 * 60 * 24;
  const hourInMilliseconds = 1000 * 60 * 60;
  const minuteInMilliseconds = 1000 * 60;

  return {
    days: Math.floor(distance / dayInMilliseconds),
    hours: Math.floor((distance % dayInMilliseconds) / hourInMilliseconds),
    minutes: Math.floor((distance % hourInMilliseconds) / minuteInMilliseconds),
    seconds: Math.floor((distance % minuteInMilliseconds) / 1000),
  };
};
