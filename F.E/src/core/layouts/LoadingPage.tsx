import { Spin } from "antd";

function LoadingPage() {
    return (
        <div className="flex flex-col items-center pb-[15%] justify-center h-screen gap-3">
            <Spin size="large" />
            <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
        </div>
    );
}

export default LoadingPage;