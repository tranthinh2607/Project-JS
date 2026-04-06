import { Form, Input, Modal } from "antd";
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
  const projectData = data && 'project_id' in data ? data.project_id : data as IProject;

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
      });
    }
  }, [projectData, open, form]);

  const handleFinish = (values: IPayload) => {
    if (!projectData) return;

    updateItem({
      id: projectData._id,
      payload: values,
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
      </Form>
    </Modal>
  );
}

export default FormUpdate;