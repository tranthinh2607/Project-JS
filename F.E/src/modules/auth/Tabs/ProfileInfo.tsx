import { useEffect, useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useAuthQuery } from "../useQuery";
import { setErrorForm } from "../../../core/layouts/FieldError";

interface IProps {
  dataProfile: any;
}

function ProfileInfo({ dataProfile }: IProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { mutate: updateProfileMutate } = useAuthQuery.useUpdateProfileInfo(
    (res) => {
      toast.success(res.message);
      setIsEditing(false);
      // Reload page to reflect new profile info seamlessly
      window.location.reload();
    },
    (error) => form.setFields(setErrorForm(error?.errors || []))
  );

  const data = [
    { label: "Họ và tên", value: dataProfile?.name || "---" },
    { label: "Tên đăng nhập", value: dataProfile?.username || "---" },
    { label: "Email", value: dataProfile?.email || "---" },
    { label: "Trạng thái", value: dataProfile?.status === "active" ? "Hoạt động" : "Không hoạt động" },
  ];

  const handleSubmit = (values: any) => {
    updateProfileMutate(values);
  };

  useEffect(() => {
    if (!isEditing) {
      form.resetFields();
    } else {
      form.setFieldsValue({
        name: dataProfile?.name,
        username: dataProfile?.username,
        email: dataProfile?.email,
      });
    }
  }, [isEditing, dataProfile, form]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center ">
        <h2 className="title-module">Thông tin cơ bản</h2>
        <button
          onClick={() => {
            setIsEditing(true);
          }}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <PencilSquareIcon className="w-5 h-5" /> Cập nhật
        </button>
      </div>

      {/* Grid hiển thị */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
        {data.map((item) => (
          <div key={item.label} className="flex flex-col">
            <label className="text-xs text-gray-500 font-medium mb-1">{item.label}</label>
            <p className="text-base text-gray-900 font-semibold flex flex-row gap-1">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Modal Update */}
      <Modal
        title="Cập nhật thông tin cá nhân"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="flex flex-col gap-3 mt-4"
        >
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            label="Tên đăng nhập"
            name="username"

            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input disabled placeholder="Nhập email" />
          </Form.Item>

          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsEditing(false)} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default ProfileInfo;
