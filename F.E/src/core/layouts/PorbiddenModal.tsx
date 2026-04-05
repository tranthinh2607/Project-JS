import { Modal } from "antd";
import { useEffect, useState } from "react";

export default function ForbiddenModal() {
  const [open, setOpen] = useState(false);

  const handleBack = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleForbidden = () => setOpen(true);
    window.addEventListener("FORBIDDEN_ACCESS", handleForbidden);

    return () => {
      window.removeEventListener("FORBIDDEN_ACCESS", handleForbidden);
    };
  }, []);

  return (
    <Modal
      className="forbidden-modal"
      title={
        <div className="flex items-center">
          <svg
            className="w-6 h-6 text-red-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Thông báo</span>
        </div>
      }
      open={open}
      onOk={handleBack}
      onCancel={handleBack}
      cancelButtonProps={{ style: { display: "none" } }}
      centered
      zIndex={1100}
    >
      <div className="text-center py-4">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <svg
            className="h-10 w-10 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Truy cập bị từ chối</h3>
        <p className="text-gray-500">
          Bạn không có quyền truy cập vào chức năng này. Vui lòng liên hệ quản trị viên nếu bạn cho
          rằng đây là sự nhầm lẫn.
        </p>
      </div>
    </Modal>
  );
}
