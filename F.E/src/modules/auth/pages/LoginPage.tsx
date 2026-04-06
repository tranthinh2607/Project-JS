import { Checkbox, Form, Input } from "antd";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FieldError, { setErrorForm, type errors } from "../../../core/layouts/FieldError";
import { useAuthQuery } from "../useQuery";
import toast from "react-hot-toast";
import { setAccessToken, setRefreshToken } from "../../../core/utils/cookies";
import { handleToastMessageErrors } from "../../../core/utils/toastMessageError";
import { useLoadingToast } from "../../../core/utils/useLoadingToast";
import type { ILoginPayload } from "../types";
import { LockClosedIcon, UserIcon, Cog8ToothIcon } from "@heroicons/react/24/outline";

function LoginPage() {
    const title = "Chào mừng đến TASK FLOW";

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [errorFeilds, setErrorFeilds] = useState<errors[]>([]);
    const { mutate: loginMutate, isPending } = useAuthQuery.useLogin(
        (res) => {
            toast.success(res?.message);
            setAccessToken(res?.data?.accessToken);
            setRefreshToken(res?.data?.refreshToken);
            navigate("/");
        },
        (error) => {
            if (!error?.errors) handleToastMessageErrors(error);
            form.setFields(setErrorForm(error?.errors || []))
        }
    );
    const { mutate: googleLoginMutate, isPending: isGooglePending } = useAuthQuery.useGoogleLogin(
        (res) => {
            toast.success(res?.message);
            setAccessToken(res?.data?.accessToken);
            setRefreshToken(res?.data?.refreshToken);
            navigate("/");
        },
        (error) => {
            handleToastMessageErrors(error);
        }
    );
    useLoadingToast(isPending || isGooglePending, "Đang đăng nhập...", "login-loading");

    const handleFinish = (values: ILoginPayload) => {
        loginMutate(values);
    };


    return (
        <div className="relative w-full h-screen ">
            <div className="absolute inset-0 bg-primary"></div>

            <svg
                className="absolute inset-0 w-[90%] h-[125%] top-[-25%]"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <path
                    d="M0 0 H60 C50 20, 50 40, 60 50 C70 60, 70 80, 60 100 H0 Z"
                    fill="white"
                />
            </svg>
            <div className="grid grid-cols-2 h-full z-50 relative">
                <div className="relative flex flex-col items-center justify-center">

                    <h1 className="text-[50px] font-bold mb-4 flex flex-wrap text-primary">
                        {title}
                    </h1>

                    {/* Đoạn mô tả */}
                    <p className="!text-[20px] text-center max-w-md leading-relaxed">
                        Tối ưu hóa quy trình làm việc với TaskFlow - Giải pháp quản lý thông minh, hiệu quả và chuyên nghiệp cho doanh nghiệp của bạn.
                    </p>
                </div>
                <div className="flex justify-center items-center flex-col gap-8 pt-20 pl-38 pb-20">
                    {/* Logo Replacement: System Name */}
                    <div className="flex flex-col items-center -mb-5">
                        <h2 className="text-6xl font-black text-white tracking-widest drop-shadow-lg">
                            TASK FLOW
                        </h2>
                        <div className="h-1.5 w-24 bg-white mt-2 rounded-full opacity-80"></div>
                    </div>

                    {/* Form */}
                    <Form
                        form={form}
                        name="login"
                        layout="vertical"
                        className="w-full max-w-sm space-y-4"
                        onFinish={handleFinish}
                    >
                        <div className="relative">
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
                            >
                                <Input
                                    onChange={() =>
                                        setErrorFeilds((prev) => prev.filter((item) => item.field !== "username"))
                                    }
                                    prefix={<UserIcon className="w-5 h-5 text-gray-400 mr-2" />}
                                    placeholder="Nhập tên đăng nhập"
                                    className="!rounded-full !py-3 !px-6 !text-[14px] focus:shadow-lg transition-all duration-300 "
                                />
                            </Form.Item>
                            <FieldError
                                field="username"
                                errors={errorFeilds}
                                className="text-[#FACC15] absolute top-[96%]"
                            />
                        </div>

                        <div className="relative">
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                            >
                                <Input.Password
                                    onChange={() =>
                                        setErrorFeilds((prev) => prev.filter((item) => item.field !== "password"))
                                    }
                                    prefix={<LockClosedIcon className="w-5 h-5 text-gray-400 mr-2" />}
                                    placeholder="Nhập mật khẩu"
                                    className="!rounded-full !py-3 !px-6 !text-[14px] focus:shadow-lg transition-all duration-300"
                                />
                            </Form.Item>
                            <FieldError
                                field="password"
                                errors={errorFeilds}
                                className="text-[#FACC15] absolute top-[96%]"
                            />
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox className="!text-white">Nhớ mật khẩu</Checkbox>
                            </Form.Item>
                            <Link
                                to="/"
                                className="!text-white text-sm underline hover:!text-gray-200"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <Form.Item>
                            <button
                                type="submit"
                                disabled={isPending || isGooglePending}
                                className="w-full bg-black text-white font-bold py-3 rounded-full hover:bg-gray-800 transition-all duration-300 text-[15px] shadow-md hover:shadow-lg"
                            >
                                Đăng nhập
                            </button>
                        </Form.Item>

                        <div className="flex items-center my-6">
                            <div className="flex-1 border-t border-white opacity-20"></div>
                            <span className="px-4 text-white text-sm opacity-60">Hoặc</span>
                            <div className="flex-1 border-t border-white opacity-20"></div>
                        </div>

                        <div className="flex justify-center w-full">
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    if (credentialResponse.credential) {
                                        googleLoginMutate(credentialResponse.credential);
                                    }
                                }}
                                onError={() => {
                                    toast.error("Đăng nhập Google thất bại");
                                }}
                                theme="outline"
                                shape="pill"
                                text="continue_with"
                                width="384px"
                            />
                        </div>

                        {/* <div className="flex items-center my-6">
                            <div className="flex-1 border-t border-white opacity-20"></div>
                            <span className="px-4 text-white text-sm opacity-60">Hoặc</span>
                            <div className="flex-1 border-t border-white opacity-20"></div>
                        </div> */}

                        {/* <Form.Item>
                            <button
                                type="button"
                                className="w-full bg-white text-gray-700 font-semibold py-3 rounded-full flex items-center justify-center gap-3 hover:bg-gray-100 transition-all duration-300 text-[15px] shadow-sm"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Tiếp tục với Google
                            </button>
                        </Form.Item> */}
                        <div className="text-center">
                            <span className="text-white opacity-80">Chưa có tài khoản? </span>
                            <Link to="/register" className="!text-white font-bold underline hover:opacity-80">
                                Đăng ký ngay
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>

    );
};

export default LoginPage;