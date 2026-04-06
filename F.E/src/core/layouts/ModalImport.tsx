import { Modal, Upload, Button } from "antd";
import { ArrowDownTrayIcon, InboxIcon } from "@heroicons/react/24/outline";
import type { UploadProps } from "antd";
import toast from "react-hot-toast";

interface IProps {
  open: boolean;
  onCancel: () => void;
  onUpload: (file: File) => void;
  handleDowloadFile: () => void;
  errorImport?: string[];
}

function ModalImport({ open, onCancel, onUpload, handleDowloadFile, errorImport }: IProps) {
  const { Dragger } = Upload;

  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".xlsx,.xls",
    beforeUpload: (file) => {
      const isExcel =
        file.type === "application/vnd.ms-excel" ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      if (!isExcel) {
        toast.error("Chỉ hỗ trợ file Excel");
        return false;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File quá lớn");
        return false;
      }

      onUpload(file);
      return false; // Quan trọng: ngăn Dragger auto xử lý
    },
    fileList: [], // GIỮ DRAGGER LUÔN TRỐNG, KHÔNG SHOW FILE ĐÃ CHỌN
  };

  return (
    <Modal title="Import dữ liệu Excel" open={open} onCancel={onCancel} footer={null}>
      <div>
        <Dragger {...props} className="!p-8">
          <p className="ant-upload-drag-icon flex justify-center">
            <InboxIcon className="h-12 w-12 text-blue-500" />
          </p>
          <p className="ant-upload-text text-center">
            Kéo & thả file Excel vào đây hoặc click để chọn file
          </p>
          <p className="ant-upload-hint text-center text-gray-500">
            Hỗ trợ định dạng: .xlsx, .xls, tối đa 10MB
          </p>
        </Dragger>
        {Array.isArray(errorImport) && errorImport.length > 0 && (
          <div className="text-red-500 mb-5 -mt-3 max-h-[300px] overflow-y-auto">
            <ul>
              {errorImport.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          className="mx-auto"
          type="primary"
          icon={<ArrowDownTrayIcon className="h-4 w-4 mr-1" />}
          onClick={handleDowloadFile}
        >
          Tải file mẫu
        </Button>
      </div>
    </Modal>
  );
}

export default ModalImport;
