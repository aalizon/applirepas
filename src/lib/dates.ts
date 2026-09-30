/** Dates manipulées au format "YYYY-MM-DD" (pas de fuseau horaire, pas de décalage). */

export const TIMEZONE = process.env.APP_TIMEZONE ?? "Europe/Paris";

export function today(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(new Date());
}

function toUTC(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

export function addDays(date: string, n: number): string {
  const d = toUTC(date);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** 1 = lundi … 7 = dimanche */
export function weekday(date: string): number {
  return ((toUTC(date).getUTCDay() + 6) % 7) + 1;
}

export function isWeekend(date: string) {
  return weekday(date) >= 6;
}

export function weekStart(date: string): string {
  return addDays(date, 1 - weekday(date));
}

export function weekDates(start: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function isValidDate(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(toUTC(s).getTime());
}

export const WEEKDAY_LABELS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
export const WEEKDAY_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function formatDay(date: string) {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(
    toUTC(date),
  );
}

export function formatShort(date: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" }).format(toUTC(date));
}

/** Saison (hémisphère nord) d'une date. */
export function seasonOf(date: string): "printemps" | "ete" | "automne" | "hiver" {
  const m = toUTC(date).getUTCMonth() + 1;
  if (m >= 3 && m <= 5) return "printemps";
  if (m >= 6 && m <= 8) return "ete";
  if (m >= 9 && m <= 11) return "automne";
  return "hiver";
}
