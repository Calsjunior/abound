import { Temporal } from "@js-temporal/polyfill";

const dateFormatters = [
  {
    matches: (daysFromNow) => daysFromNow === -1,
    format: () => "Yesterday",
  },
  {
    matches: (daysFromNow) => daysFromNow === 0,
    format: () => "Today",
  },
  {
    matches: (daysFromNow) => daysFromNow === 1,
    format: () => "Tomorrow",
  },
  {
    matches: (daysFromNow) => daysFromNow > 1 && daysFromNow < 7,
    format: (inputDate) =>
      inputDate.toLocaleString(undefined, {
        weekday: "long",
      }),
  },
  {
    matches: (daysFromNow) => daysFromNow >= 7 && daysFromNow < 14,
    format: (inputDate) =>
      `Next ${inputDate.toLocaleString(undefined, { weekday: "long" })}`,
  },
  {
    matches: (inputDate, currentDate) => inputDate.year !== currentDate.year,
    format: (inputDate) =>
      inputDate.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
  },
  {
    matches: () => true,
    format: (inputDate) =>
      inputDate.toLocaleString(undefined, { month: "short", day: "2-digit" }),
  },
];

export function formatRelativeDate(dateString, formatters = dateFormatters) {
  if (!dateString) return null;

  const inputDate = Temporal.PlainDate.from(dateString);
  const currentDate = Temporal.Now.plainDateISO();
  const daysFromNow = currentDate.until(inputDate).days;

  const activeFormatter = formatters.find((formatter) =>
    formatter.matches(daysFromNow, inputDate, currentDate),
  );

  return activeFormatter.format(inputDate);
}
