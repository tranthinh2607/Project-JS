import { Result } from "antd";
import { LockOutlined } from "@ant-design/icons";

const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white text-gray-800 px-4">
      <div className="">
        <Result
          icon={<LockOutlined className="text-6xl text-red-500 animate-pulse" />}
          status="403"
          title={<h1 className="text-4xl font-bold text-gray-800">Truy cập bị từ chối</h1>}
          subTitle={
            <p className="text-lg text-gray-600 mt-2">
              Xin lỗi, bạn không có quyền truy cập vào trang này.
            </p>
          }
        />
      </div>
    </div>
  );
};

export default ForbiddenPage;
