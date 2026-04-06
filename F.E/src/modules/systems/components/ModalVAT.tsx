import { Form, InputNumber, Modal } from "antd";
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

function ModalVAT({ open, onClose, data }: IProps) {
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
      title="Cập nhật Thuế GTGT"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Lưu thay đổi"
      cancelText="Huỷ"
      confirmLoading={isPending}
      destroyOnClose
      width={400}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
        <Form.Item
          name="vat_rate"
          label="Thuế GTGT (VAT Rate) %"
          rules={[{ required: true, message: "Vui lòng nhập thuế GTGT" }]}
        >
          <InputNumber
            className="w-full"
            formatter={(value) => `${value}%`}
            parser={(value) => value!.replace('%', '') as any}
            min={0}
            max={100}
            placeholder="Nhập phần trăm..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ModalVAT;
