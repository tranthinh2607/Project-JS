import toast from "react-hot-toast";

/**
 * Hàm dùng chung để copy text vào clipboard.
 * @param text Chuỗi cần copy.
 * @param successMsg Thông báo khi copy thành công (mặc định: "Đã copy vào clipboard!")
 * @param errorMsg Thông báo khi copy thất bại (mặc định: "Copy thất bại!")
 */
export const copyToClipboard = async (
  text: string,
  successMsg: string = "Đã sao chép",
  errorMsg: string = "Sao chép thất bại"
): Promise<void> => {
  if (!text || text.trim() === "") {
    toast("Không có nội dung để copy!");
    return;
  }
  try {
    await navigator.clipboard.writeText(text);

    toast.success(successMsg);
  } catch (error) {
    console.error("Lỗi khi copy:", error);
    toast.error(errorMsg);
  }
};
