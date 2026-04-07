import { Form, Input, Modal, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useProjectQuery } from "../useQuery";
import type { IProject, IMyProject, IPayload } from "../types";
import { handleToastMessageErrors } from "../../../core/utils/toastMessageError";
import toast from "react-hot-toast";

interface IProps {
  open: boolean;
  data?: IMyProject | IProject;
  onClose: () => void;
}

function FormUpdate({ open, data, onClose }: IProps) {
  const [form] = Form.useForm<IPayload>();

  // Check if data is IMyProject or IProject
  const projectData = data as IProject;

  const { mutate: updateItem, isPending } = useProjectQuery.useUpdate(
    () => {
      toast.success("Cập nhật dự án thành công");
      form.resetFields();
      onClose();
    },
    (error) => {
      handleToastMessageErrors(error);
    }
  );

  useEffect(() => {
    if (projectData && open) {
      form.setFieldsValue({
        name: projectData.name,
        description: projectData.description,
        expected_start_date: projectData.expected_start_date ? dayjs(projectData.expected_start_date) : undefined,
        expected_end_date: projectData.expected_end_date ? dayjs(projectData.expected_end_date) : (undefined as any),
        status: projectData.status || "active",
      } as any);
    }
  }, [projectData, open, form]);

  const handleFinish = (values: any) => {
    if (!projectData) return;

    const payload = {
      ...values,
      expected_start_date: values.expected_start_date ? values.expected_start_date.toISOString() : undefined,
      expected_end_date: values.expected_end_date ? values.expected_end_date.toISOString() : undefined,
    };

    updateItem({
      id: projectData._id,
      payload: payload,
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Cập nhật thông tin dự án"
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Cập nhật"
      cancelText="Huỷ"
      confirmLoading={isPending}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
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
          <Input.TextArea placeholder="Nhập mô tả mới..." rows={4} />
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

export default FormUpdate;