export const formatVND = (value: number): string => {
  return value ? value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "0 ₫";
};

// Dùng chung formatter/parser cho tất cả ô giá
export const priceFormatter = (value: number | string | undefined) => {
  if (!value && value !== 0) return "";
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const priceParser = (value: string | undefined) => {
  if (!value) return "";
  return value.replace(/\./g, "");
};

