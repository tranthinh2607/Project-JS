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

function ModalCompany({ open, onClose, data }: IProps) {
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
      title="Cập nhật Thông tin Công ty"
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
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="company_name"
            label="Tên Công Ty"
            rules={[{ required: true, message: "Vui lòng nhập tên công ty" }]}
          >
            <Input placeholder="Nhập tên công ty..." />
          </Form.Item>

          <Form.Item
            name="company_email"
            label="Email Công Ty"
          >
            <Input placeholder="Nhập email..." />
          </Form.Item>

          <Form.Item
            name="company_phone"
            label="Số Điện Thoại"
          >
            <Input placeholder="Nhập số điện thoại..." />
          </Form.Item>

          <Form.Item
            name="company_tax_code"
            label="Mã Số Thuế"
          >
            <Input placeholder="Nhập mã số thuế..." />
          </Form.Item>

          <Form.Item
            name="company_address"
            label="Địa Chỉ Công Ty"
            className="col-span-2"
          >
            <Input placeholder="Nhập địa chỉ..." />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}

export default ModalCompany;
