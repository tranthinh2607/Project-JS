export function formatDate(inputDate: string, type: "date" | "datetime" = "datetime"): string {
  if (!inputDate) return "";

  let dateObj: Date;

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(inputDate)) {
    // "YYYY-MM-DD HH:mm:ss" (không timezone, coi như local)
    dateObj = new Date(inputDate.replace(" ", "T"));
  } else {
    // ISO string có thể có Z hoặc offset
    dateObj = new Date(inputDate);
  }

  if (isNaN(dateObj.getTime())) return "";

  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();

  if (type === "date") {
    return `${day}/${month}/${year}`;
  }

  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
