import { Form, Input, Modal } from "antd";
import { useEffect } from "react";
import { useSystemConfigsQuery } from "../useQuery";
import toast from "react-hot-toast";
import { handleToastMessageErrors } from "../../../core/utils/toastMessageError";
import type { ISystemConfig } from "../types";

interface IProps {
  open: boolean;
  onClose: () => void;
  data: ISystemConfig;
}

function ModalBank({ open, onClose, data }: IProps) {
  const [form] = Form.useForm();

  const { mutate: updateItem, isPending } = useSystemConfigsQuery.useUpdate(
    () => {
      toast.success("Cập nhật thành công");
      onClose();
    },
    (error) => {
      handleToastMessageErrors(error);
    }
  );

  useEffect(() => {
    if (data && open) {
      form.setFieldsValue(data);
    }
  }, [data, open, form]);

  const handleFinish = (values: any) => {
    updateItem(values);
  };

  return (
    <Modal
      title="Cập nhật Thông tin Ngân hàng"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Lưu thay đổi"
      cancelText="Huỷ"
      confirmLoading={isPending}
      destroyOnClose
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <h3 className="text-[#C9A85D] font-medium border-l-2 border-[#C9A85D] pl-2 mb-4">
              NGÂN HÀNG CÔNG TY
            </h3>
            <Form.Item
              name="bank_company_bank_name"
              label="Tên Ngân Hàng"
            >
              <Input placeholder="Nhập tên ngân hàng..." />
            </Form.Item>
            <Form.Item
              name="bank_company_account_number"
              label="Số Tài Khoản"
            >
              <Input placeholder="Nhập số tài khoản..." />
            </Form.Item>
          </div>

          <div>
            <h3 className="text-[#C9A85D] font-medium border-l-2 border-[#C9A85D] pl-2 mb-4">
              NGÂN HÀNG CÁ NHÂN
            </h3>
            <Form.Item
              name="bank_personal_bank_name"
              label="Tên Ngân Hàng"
            >
              <Input placeholder="Nhập tên ngân hàng..." />
            </Form.Item>
            <Form.Item
              name="bank_personal_account_number"
              label="Số Tài Khoản"
            >
              <Input placeholder="Nhập số tài khoản..." />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
}

export default ModalBank;
