export function parseDate(text) {
  const value = String(text).trim();
  let d, m, y, match;
  if ((match = value.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/)))
    [, y, m, d] = match;
  else if ((match = value.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/)))
    [, d, m, y] = match;
  else if ((match = value.match(/^(\d{2})(\d{2})(\d{4})$/)))
    [, d, m, y] = match;
  else return null;
  [d, m, y] = [d, m, y].map(Number);
  if (y < 1900 || y > 2199) return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
    ? String(d).padStart(2, "0") + "." + String(m).padStart(2, "0") + "." + y
    : null;
}
export function findDate(items) {
  for (const item of items) {
    const candidates =
      String(item.text).match(
        /[0-9OIlZ]+(?:[./-][0-9OIlZ]+){2}|[0-9OIlZ]{8}/g,
      ) || [];
    for (const candidate of candidates) {
      const date = parseDate(
        candidate.replace(/O/g, "0").replace(/[Il]/g, "1").replace(/Z/g, "2"),
      );
      if (date) return date;
    }
  }
  return null;
}
