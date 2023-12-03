export function formatDate(date: string | Date): string {
  let year: string, month: string, day: string;
  if (typeof date === 'string') {
    year = date.substring(0, 4);
    month = date.substring(4, 6);
    day = date.substring(6, 8);
  } else {
    year = String(date.getFullYear());
    month = String(date.getMonth() + 1).padStart(2, '0');
    day = String(date.getDate()).padStart(2, '0');
  }

  return `${year}-${month}-${day}`;
}
