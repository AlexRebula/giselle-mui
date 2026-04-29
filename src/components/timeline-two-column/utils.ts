// Pure helpers co-located with the component.
// No JSX. No MUI imports. Fully unit-testable in isolation.

// ----------------------------------------------------------------------

/** Extracts the last 4-digit year from a date string. Returns null if none found. */
export function getLastYear(date: string): number | null {
  const re = /\b(20\d{2}|19\d{2})\b/g;
  let last: RegExpExecArray | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(date)) !== null) last = m;
  return last ? Number.parseInt(last[1]!, 10) : null;
}

export const MONTH_INDEX: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

/**
 * Parses the last date expression found in a date range string.
 *
 * Range strings like "Apr 2026 – 29 Jun 2026" return the END date so that
 * overdue detection only triggers once the entire range has passed.
 *
 * For month-only partial dates (e.g. "Apr 2026") returns the last day of that
 * month so the phase is only overdue once the whole month has elapsed.
 */
export function parseLastDate(dateStr: string): Date | null {
  // Broad pattern — month validity and year range are checked in JS below.
  // Avoids a 12-way month alternation + 2-way year alternation in the regex.
  const re = /\b(\d\d?)?\s*([a-z]+)\s*(\d{4})\b/gi;
  let lastMatch: RegExpExecArray | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(dateStr)) !== null) {
    const year = Number.parseInt(m[3]!, 10);
    if (!(m[2]!.slice(0, 3).toLowerCase() in MONTH_INDEX) || year < 1900 || year > 2099) continue;
    lastMatch = m;
  }
  if (!lastMatch) return null;
  const hasDay = Boolean(lastMatch[1]);
  const month = MONTH_INDEX[lastMatch[2]!.slice(0, 3).toLowerCase()];
  const year = Number.parseInt(lastMatch[3]!, 10);
  if (!hasDay) {
    // last day of that month
    return new Date(year, month! + 1, 0);
  }
  return new Date(year, month!, Number.parseInt(lastMatch[1]!, 10));
}

// ----------------------------------------------------------------------

/**
 * Returns a millisecond timestamp suitable for chronological sorting.
 *
 * Strategy (most-precise to least):
 * 1. `parseLastDate` — extracts a specific day/month/year (or end of a range).
 * 2. `getLastYear` — year-only strings like `'~1994'` or `'2015 – present'`.
 *    These map to Jan 1 of that year so they sort before finer-grained dates in the same year.
 * 3. null — no date found; caller decides how to handle (sort to end).
 */
export function parseSortableDate(dateStr: string): number | null {
  const precise = parseLastDate(dateStr);
  if (precise !== null) return precise.getTime();
  const year = getLastYear(dateStr);
  if (year !== null) return new Date(year, 0, 1).getTime();
  return null;
}

// ----------------------------------------------------------------------

/** Minimal subset of TimelinePhase needed for chronological sorting. */
type SortablePhase = { date: string; key: number; active?: boolean };

/**
 * Returns a new array sorted newest-first (descending by date).
 *
 * Rules:
 * - `active` phases are always pinned first.
 * - Phases with a parseable date are sorted descending (newest at top).
 * - Phases with no parseable date sort last.
 * - Ties (same millisecond) fall back to descending key order.
 */
export function sortPhasesByDate<T extends SortablePhase>(phases: T[]): T[] {
  return [...phases].sort((a, b) => {
    // Both active — fall back to key tie-break so the comparator is symmetric.
    if (a.active && b.active) return b.key - a.key;
    if (a.active) return -1;
    if (b.active) return 1;
    const da = parseSortableDate(a.date);
    const db = parseSortableDate(b.date);
    if (da === null && db === null) return b.key - a.key;
    if (da === null) return 1; // undated → last
    if (db === null) return -1; // undated → last
    if (db !== da) return db - da; // descending: newer first
    return b.key - a.key; // tie-break: higher key first
  });
}
