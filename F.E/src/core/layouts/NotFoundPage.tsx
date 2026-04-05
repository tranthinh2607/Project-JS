
function NotFoundPage() {
    return (
        <div className="flex flex-col items-center pb-[15%] justify-center h-screen gap-3">
            <div className="flex flex-col items-center gap-2">
                <div className="text-4xl font-bold">404</div>
                <div className="text-gray-500 text-lg">Không tìm thấy dữ liệu</div>
            </div>
        </div>
    );
}

export default NotFoundPage;