import { Form, Input, Modal, Select, DatePicker } from "antd";
import { useTasksQuery } from "../useQuery";
import type { IPayload } from "../types";
import toast from "react-hot-toast";
import { handleToastMessageErrors } from "../../../core/utils/toastMessageError";
import { setErrorForm } from "../../../core/layouts/FieldError";

interface IProps {
  projectId: string;
  parentTaskId?: string | null;
  open: boolean;
  onClose: () => void;
}

function FormCreate({ projectId, parentTaskId, open, onClose }: IProps) {
  const [form] = Form.useForm<IPayload>();

  const isSubtask = !!parentTaskId;

  const { mutate: createItem, isPending } = useTasksQuery.useCreate(
    () => {
      toast.success(isSubtask ? "Tạo subtask thành công" : "Tạo nhiệm vụ thành công");
      form.resetFields();
      onClose();
    },
    (error) => {
      handleToastMessageErrors(error);
      form.setFields(setErrorForm(error?.errors || []));
    }
  );

  const handleFinish = (values: any) => {
    createItem({
      ...values,
      project_id: projectId,
      parent_task_id: parentTaskId || null,
      start_date: values.start_date?.toISOString(),
      due_date: values.due_date?.toISOString(),
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={isSubtask ? "Tạo subtask" : "Tạo nhiệm vụ mới"}
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
        initialValues={{ priority: "medium" }}
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder="Nhập tiêu đề..." />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea placeholder="Mô tả chi tiết..." rows={3} />
        </Form.Item>

        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item
            name="priority"
            label="Độ ưu tiên"
            rules={[{ required: true, message: "Vui lòng chọn độ ưu tiên" }]}
          >
            <Select
              options={[
                { value: "low", label: "Thấp" },
                { value: "medium", label: "Trung bình" },
                { value: "high", label: "Cao" },
              ]}
            />
          </Form.Item>

          <div />

          <Form.Item name="start_date" label="Ngày bắt đầu">
            <DatePicker className="w-full" placeholder="Chọn ngày" />
          </Form.Item>

          <Form.Item name="due_date" label="Ngày hết hạn">
            <DatePicker className="w-full" placeholder="Chọn ngày" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}

export default FormCreate;
