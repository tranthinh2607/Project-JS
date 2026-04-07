import { Form, Input, Modal, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { useProjectQuery } from "../useQuery";
import type { IPayload, IProject } from "../types";
import toast from "react-hot-toast";
import { handleToastMessageErrors } from "../../../core/utils/toastMessageError";
import { setErrorForm } from "../../../core/layouts/FieldError";

interface IProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (data: IProject) => void;
}

function FormCreate({ open, onClose, onSuccess }: IProps) {
  const [form] = Form.useForm<IPayload>();

  const { mutate: createItem, isPending } = useProjectQuery.useCreate(
    (res) => {
      toast.success("Tạo dự án thành công");
      form.resetFields();
      onSuccess?.(res.data);
      onClose();
    },
    (error) => {
      handleToastMessageErrors(error);
      form.setFields(setErrorForm(error?.errors || []));
    }
  );

  const handleFinish = (values: any) => {
    const payload = {
      ...values,
      expected_start_date: values.expected_start_date ? values.expected_start_date.toISOString() : undefined,
      expected_end_date: values.expected_end_date ? values.expected_end_date.toISOString() : undefined,
    };
    createItem(payload);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Tạo dự án mới"
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Tạo"
      cancelText="Huỷ"
      confirmLoading={isPending}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          name="name"
          label="Tên dự án"
          rules={[
            { required: true, message: "Vui lòng nhập tên dự án" },
            { min: 3, message: "Tên dự án phải có ít nhất 3 ký tự" },
            { max: 100, message: "Tên dự án không được quá 100 ký tự" }
          ]}
        >
          <Input placeholder="Nhập tên dự án..." />
        </Form.Item>

        <Form.Item 
          name="description" 
          label="Mô tả dự án"
          rules={[{ max: 500, message: "Mô tả không được quá 500 ký tự" }]}
        >
          <Input.TextArea placeholder="Nhập mô tả chi tiết dự án (không bắt buộc)..." rows={4} />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="expected_start_date"
            label="Ngày bắt đầu dự kiến"
          >
            <DatePicker className="w-full" placeholder="Chọn ngày" format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="expected_end_date"
            label="Ngày kết thúc dự kiến"
          >
            <DatePicker className="w-full" placeholder="Chọn ngày" format="DD/MM/YYYY" />
          </Form.Item>
        </div>

        <Form.Item
          name="status"
          label="Trạng thái dự án"
          initialValue="active"
        >
          <Select placeholder="Chọn trạng thái">
            <Select.Option value="active">Đang hoạt động</Select.Option>
            <Select.Option value="on_hold">Tạm dừng</Select.Option>
            <Select.Option value="completed">Đã hoàn thành</Select.Option>
            <Select.Option value="cancelled">Đã hủy</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default FormCreate;