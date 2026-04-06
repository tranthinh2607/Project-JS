import { Form, Input } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FieldError, { setErrorForm, type errors } from "../../../core/layouts/FieldError";
import { useAuthQuery } from "../useQuery";
import toast from "react-hot-toast";
import { setAccessToken, setRefreshToken } from "../../../core/utils/cookies";
import { handleToastMessageErrors } from "../../../core/utils/toastMessageError";
import { useLoadingToast } from "../../../core/utils/useLoadingToast";
import type { IRegisterPayload } from "../types";
import { LockClosedIcon, UserIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

function RegisterPage() {
    const title = "Tạo tài khoản mới";

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [errorFeilds, setErrorFeilds] = useState<errors[]>([]);
    const { mutate: registerMutate, isPending } = useAuthQuery.useRegister(
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
    useLoadingToast(isPending, "Đang xử lý đăng ký...", "register-loading");

    const handleFinish = (values: IRegisterPayload) => {
        registerMutate(values);
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

                    <p className="!text-[20px] text-center max-w-md leading-relaxed text-gray-600">
                        Tham gia TaskFlow để tối ưu hóa quy trình làm việc và quản lý garage của bạn một cách chuyên nghiệp nhất.
                    </p>
                </div>
                <div className="flex justify-center items-center flex-col gap-8 pl-38 pb-10">
                    {/* Logo Replacement: System Name */}
                    <div className="flex flex-col items-center -mb-5">
                        <h2 className="text-4xl font-black text-white tracking-widest drop-shadow-md">
                            TASK FLOW
                        </h2>
                        <div className="h-1 w-20 bg-white mt-1 rounded-full opacity-80"></div>
                    </div>

                    <Form
                        form={form}
                        name="register"
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
                                    placeholder="Tên đăng nhập"
                                    className="!rounded-full !py-3 !px-6 !text-[14px] focus:shadow-lg transition-all duration-300"
                                />
                            </Form.Item>
                            <FieldError
                                field="username"
                                errors={errorFeilds}
                                className="text-[#FACC15] absolute top-[96%]"
                            />
                        </div>

                        {/* Name */}
                        <div className="relative">
                            <Form.Item
                                name="name"
                                rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                            >
                                <Input
                                    onChange={() =>
                                        setErrorFeilds((prev) => prev.filter((item) => item.field !== "name"))
                                    }
                                    prefix={<UserIcon className="w-5 h-5 text-gray-400 mr-2" />}
                                    placeholder="Họ và tên"
                                    className="!rounded-full !py-3 !px-6 !text-[14px] focus:shadow-lg transition-all duration-300"
                                />
                            </Form.Item>
                            <FieldError
                                field="name"
                                errors={errorFeilds}
                                className="text-[#FACC15] absolute top-[96%]"
                            />
                        </div>

                        <div className="relative">
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: "Vui lòng nhập email!" },
                                    { type: "email", message: "Email không đúng định dạng!" }
                                ]}
                            >
                                <Input
                                    onChange={() =>
                                        setErrorFeilds((prev) => prev.filter((item) => item.field !== "email"))
                                    }
                                    prefix={<EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2" />}
                                    placeholder="Địa chỉ Email"
                                    className="!rounded-full !py-3 !px-6 !text-[14px] focus:shadow-lg transition-all duration-300"
                                />
                            </Form.Item>
                            <FieldError
                                field="email"
                                errors={errorFeilds}
                                className="text-[#FACC15] absolute top-[96%]"
                            />
                        </div>

                        <div className="relative">
                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                                    { min: 6, message: "Mật khẩu phải từ 6 ký tự!" }
                                ]}
                            >
                                <Input.Password
                                    onChange={() =>
                                        setErrorFeilds((prev) => prev.filter((item) => item.field !== "password"))
                                    }
                                    prefix={<LockClosedIcon className="w-5 h-5 text-gray-400 mr-2" />}
                                    placeholder="Mật khẩu"
                                    className="!rounded-full !py-3 !px-6 !text-[14px] focus:shadow-lg transition-all duration-300"
                                />
                            </Form.Item>
                            <FieldError
                                field="password"
                                errors={errorFeilds}
                                className="text-[#FACC15] absolute top-[96%]"
                            />
                        </div>

                        <Form.Item>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-black text-white font-bold py-3 rounded-full hover:bg-gray-800 transition-all duration-300 text-[15px] shadow-md hover:shadow-lg"
                            >
                                Đăng ký
                            </button>
                        </Form.Item>

                        <div className="text-center">
                            <span className="text-white opacity-80">Đã có tài khoản? </span>
                            <Link to="/login" className="!text-white font-bold underline hover:opacity-80">
                                Đăng nhập
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;