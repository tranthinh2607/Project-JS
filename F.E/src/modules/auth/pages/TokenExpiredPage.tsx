import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { clearTokens } from "../../../core/utils/cookies";

export const TokenExpiredPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        clearTokens();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <Result
                    status="warning"
                    title="Phiên đăng nhập đã hết hạn"
                    subTitle="Vì lý do bảo mật, vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống."
                    extra={
                        <Button 
                            type="primary" 
                            size="large" 
                            onClick={() => navigate("/login")}
                            className="w-full bg-primary hover:bg-primary/90 rounded-lg font-bold"
                        >
                            Đăng nhập lại
                        </Button>
                    }
                />
            </div>
        </div>
    );
};
