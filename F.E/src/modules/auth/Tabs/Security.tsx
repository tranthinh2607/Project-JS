import { Form, Input } from "antd";
import { Button } from "../../../core/layouts";
import { useAuthQuery } from "../useQuery";
import { setErrorForm } from "../../../core/layouts/FieldError";
import toast from "react-hot-toast";
import { clearTokens } from "../../../core/utils/cookies";
import { useNavigate } from "react-router-dom";
import { useLoadingToast } from "../../../core/utils/useLoadingToast";

function Security({ dataProfile }: { dataProfile: any }) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const hasPassword = dataProfile?.hasPassword;

  const { mutate, isPending } = useAuthQuery.useChangePassword(
    (res) => {
      toast.success(res?.message);
      clearTokens();
      window.location.href = "/login";
    },
    (error) => form.setFields(setErrorForm(error?.errors || []))
  );
  useLoadingToast(isPending, "Đang xử lý", "change-password");

  return (
    <div className="flex flex-col gap-6">
      <h2 className="title-module">{hasPassword ? "Đổi mật khẩu" : "Tạo mật khẩu"}</h2>
      <Form
        form={form}
        layout="horizontal"
        onFinish={(values) => {
          mutate(values);
        }}
      >
        <div className="flex flex-col items-center ">
          {hasPassword && (
            <div className="relative">
              <Form.Item
                label={
                  <span className="text-sm font-medium w-40 text-gray-700">Mật khẩu hiện tại</span>
                }
                name="oldPassword"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
              >
                <Input.Password className="!w-[500px]" placeholder="Nhập mật khẩu hiện tại" />
              </Form.Item>
            </div>
          )}
          {/* Mật khẩu mới */}
          <div className="relative">
            <Form.Item
              label={<span className="text-sm font-medium w-40 text-gray-700">Mật khẩu mới</span>}
              name="newPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
              ]}
            >
              <Input.Password className="!w-[500px]" placeholder="Nhập mật khẩu mới" />
            </Form.Item>
          </div>
          {/* Xác nhận mật khẩu */}
          {/* <div className="relative">
            <Form.Item
              label={<span className="text-sm font-medium w-40 text-gray-700">Xác nhận mật khẩu</span>}
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password className="!w-[500px]" placeholder="Xác nhận mật khẩu mới" />
            </Form.Item>
          </div> */}

          <div className="flex gap-4 !w-[560px]">
            <Button
              variant="primary"
              type="submit"
              disabled={isPending}
              className="bg-green-500 hover:bg-green-600 ml-42"
            >
              {hasPassword ? "Đổi mật khẩu" : "Tạo mật khẩu"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default Security;
