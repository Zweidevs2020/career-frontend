import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  calculateGoalTimeLeft,
  isGoalDeadlineDisabled,
  normalizeGoalDeadline,
} from "./goalCountdown";

dayjs.extend(utc);

const totalSeconds = ({ days, hours, minutes, seconds }) =>
  days * 86400 + hours * 3600 + minutes * 60 + seconds;

describe("goal countdown", () => {
  test("normalizes different hidden API times to the same local midnight", () => {
    const productionDeadline = normalizeGoalDeadline("2026-09-04T15:20:52");
    const developmentDeadline = normalizeGoalDeadline("2026-09-04T15:22:37");

    expect(productionDeadline.valueOf()).toBe(developmentDeadline.valueOf());
    expect(productionDeadline.format("HH:mm:ss.SSS")).toBe("00:00:00.000");
  });

  test("calculates the exact difference to tomorrow at midnight", () => {
    const result = calculateGoalTimeLeft(
      "04-09-2026",
      dayjs("2026-09-03T15:24:21")
    );

    expect(result).toEqual({ days: 0, hours: 8, minutes: 35, seconds: 39 });
  });

  test("recalculates from the current time instead of accumulating interval drift", () => {
    const deadline = "04-09-2026";
    const firstResult = calculateGoalTimeLeft(
      deadline,
      dayjs("2026-09-03T15:24:21")
    );
    const delayedResult = calculateGoalTimeLeft(
      deadline,
      dayjs("2026-09-03T15:24:28")
    );

    expect(totalSeconds(firstResult) - totalSeconds(delayedResult)).toBe(7);
  });

  test("returns zeros for an expired deadline", () => {
    expect(
      calculateGoalTimeLeft("03-09-2026", dayjs("2026-09-03T00:00:01"))
    ).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  test("disables today and past dates but allows tomorrow", () => {
    const now = dayjs("2026-09-03T15:24:21");

    expect(isGoalDeadlineDisabled(dayjs("2026-09-02"), now)).toBe(true);
    expect(isGoalDeadlineDisabled(dayjs("2026-09-03"), now)).toBe(true);
    expect(isGoalDeadlineDisabled(dayjs("2026-09-04"), now)).toBe(false);
  });

  test.each([
    [300, "+05:00"],
    [-480, "-08:00"],
  ])("uses local midnight for a browser offset of %i minutes", (offsetMinutes, offset) => {
    const browserDate = dayjs
      .utc("2026-09-04T15:20:52")
      .utcOffset(offsetMinutes, true);
    const deadline = normalizeGoalDeadline(browserDate);

    expect(deadline.format("YYYY-MM-DD HH:mm:ss Z")).toBe(
      `2026-09-04 00:00:00 ${offset}`
    );
  });
});
