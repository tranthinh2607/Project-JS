import toast from "react-hot-toast";

export const handleToastMessageErrors = (error: any) => {
  const message =
    error?.errors?.[0]?.messages?.[0] ||
    error?.errors?.[0]?.message ||
    error?.message ||
    "Đã có lỗi xảy ra, vui lòng thử lại.";

  toast.error(message);
};
