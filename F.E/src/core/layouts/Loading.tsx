import { Spin } from "antd";

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-5 animate-fade-in">
      <Spin />
      <p className="text-gray-500 text-sm font-medium tracking-wide">Đang tải dữ liệu...</p>
    </div>
  );
}

export default Loading;
