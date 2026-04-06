import { Form, Input, Modal, Select } from "antd";
import { useMembersQuery } from "../useQuery";
import type { IPayload } from "../types";
import toast from "react-hot-toast";
import { handleToastMessageErrors } from "../../../core/utils/toastMessageError";
import { setErrorForm } from "../../../core/layouts/FieldError";

interface IProps {
  projectId: string;
  open: boolean;
  onClose: () => void;
}

function FormCreate({ projectId, open, onClose }: IProps) {
  const [form] = Form.useForm<IPayload>();

  const { mutate: createItem, isPending } = useMembersQuery.useAddMember(
    () => {
      toast.success("Mời thành viên thành công");
      form.resetFields();
      onClose();
    },
    (error) => {
      handleToastMessageErrors(error);
      form.setFields(setErrorForm(error?.errors || []));
    }
  );

  const handleFinish = (values: IPayload) => {
    createItem({
      ...values,
      project_id: projectId,
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Mời thành viên mới"
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Mời"
      cancelText="Huỷ"
      confirmLoading={isPending}
      destroyOnClose
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ role: "member" }}
      >
        <Form.Item
          name="email"
          label="Email người được mời"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" }
          ]}
        >
          <Input placeholder="name@example.com" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Vai trò"
          rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
        >
          <Select
            options={[
              { value: "member", label: "Thành viên" },
              { value: "owner", label: "Chủ sở hữu" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default FormCreate;
