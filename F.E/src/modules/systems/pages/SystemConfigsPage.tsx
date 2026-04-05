import { useState } from "react";
import { LockClosedIcon, BuildingOfficeIcon, BuildingLibraryIcon, DocumentDuplicateIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useSystemConfigsQuery } from "../useQuery";
import { ModalVAT, ModalCompany, ModalBank } from "../components";
import { Button } from "../../../core/layouts";
import toast from "react-hot-toast";
import { Divider, Drawer } from "antd";

function SystemConfigsPage() {
    document.title = "Cấu hình hệ thống";
    const [modalVatOpen, setModalVatOpen] = useState(false);
    const [modalCompanyOpen, setModalCompanyOpen] = useState(false);
    const [modalBankOpen, setModalBankOpen] = useState(false);

    const keys = [
        "vat_rate",
        "company_name",
        "company_email",
        "company_phone",
        "company_tax_code",
        "company_address",
        "bank_company_account_number",
        "bank_company_bank_name",
        "bank_personal_account_number",
        "bank_personal_bank_name",
    ];

    const { data, isLoading } = useSystemConfigsQuery.useGetByKeys(keys);

    const configsData = data?.data || {};

    const getConfig = (key: string) => {
        return configsData[key] || "";
    };

    const handleCopy = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            toast.success("Đã sao chép số tài khoản thành công!");
        });
    };

    const CardHeader = ({ section, title, icon: Icon }: { section: string, title: string, icon: any }) => (
        <div className="flex justify-between items-start mb-6">
            <div>
                <p className="text-[#C9A85D] text-[10px] font-bold tracking-wider mb-1 uppercase">{section}</p>
                <h3 className="text-[14px] font-semibold dark:text-white text-gray-900">{title}</h3>
            </div>
            <div className="text-gray-400 dark:text-gray-600">
                <Icon className="w-6 h-6 opacity-50" />
            </div>
        </div>
    );

    if (isLoading) {
        return <div className="p-6">Đang tải...</div>;
    }

    return (
        <div className="flex flex-col relative max-w-6xl mx-auto pt-2">
            <div className="mb-2">
                <h2 className="title-module mb-2">Cấu hình hệ thống</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-[13px]">
                    Thiết lập các thông số cơ bản cho quá trình vận hành garage. Mọi thay đổi sẽ ảnh hưởng trực tiếp đến quy trình tạo hóa đơn và báo cáo thuế.
                </p>
            </div>

            < Divider />


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">


                {/* Right Column */}
                <div className="lg:col-span-8">
                    {/* Phần 1 */}
                    <div className="bg-white dark:bg-[#1E1E1E]  h-full flex flex-col">
                        <CardHeader section="PHẦN 1" title="Thông tin Công ty" icon={BuildingOfficeIcon} />

                        <div className="grid grid-cols-2 gap-6 mb-8 flex-1">
                            <div className="col-span-2">
                                <label className="text-[11px] text-gray-500 uppercase font-medium mb-2 block">Tên công ty</label>
                                <div className="bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-[#333] rounded-md p-3 text-gray-800 dark:text-gray-200 line-clamp-1 text-[13px]">
                                    {getConfig("company_name")}
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] text-gray-500 uppercase font-medium mb-2 block">Email công ty</label>
                                <div className="bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-[#333] rounded-md p-3 text-gray-800 dark:text-gray-200 line-clamp-1 text-[13px]">
                                    {getConfig("company_email")}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[11px] text-gray-500 uppercase font-medium mb-2 block">Số điện thoại</label>
                                    <div className="bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-[#333] rounded-md p-3 text-gray-800 dark:text-gray-200 line-clamp-1 text-[13px]">
                                        {getConfig("company_phone")}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[11px] text-gray-500 uppercase font-medium mb-2 block">Mã số thuế</label>
                                    <div className="bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-[#333] rounded-md p-3 text-gray-800 dark:text-gray-200 line-clamp-1 text-[13px]">
                                        {getConfig("company_tax_code") || "---"}
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="text-[11px] text-gray-500 uppercase font-medium mb-2 block">Địa chỉ công ty</label>
                                <div className="bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-[#333] rounded-md p-3 text-gray-800 dark:text-gray-200 line-clamp-1 text-[13px]">
                                    {getConfig("company_address")}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-auto">
                            <Button
                                variant="primary"
                                className="!px-4 !py-2 font-semibold text-[13px]"
                                onClick={() => setModalCompanyOpen(true)}
                            >
                                <PencilIcon className="w-4 h-4" /> CẬP NHẬT THÔNG TIN CÔNG TY
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Left Column */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Phần 2 */}
                    <div className="bg-white dark:bg-[#1E1E1E]  ">
                        <CardHeader section="PHẦN 2" title="Thông tin chung" icon={(props: React.HTMLAttributes<HTMLSpanElement>) => <span {...props} className={(props.className || '') + " font-bold text-2xl"}>%</span>} />

                        <div className="mb-8">
                            <label className="text-[11px] text-gray-500 uppercase font-medium mb-2 block">Thuế GTGT (VAT Rate)</label>
                            <div className="bg-gray-50 dark:bg-[#2A2A2A] rounded-md p-3 flex justify-between items-center border border-gray-200 dark:border-[#333]">
                                <span className="font-medium dark:text-white text-[13px]">{getConfig("vat_rate") || "0"}%</span>
                                <LockClosedIcon className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            className="w-full !py-2.5 font-semibold text-[13px]"
                            onClick={() => setModalVatOpen(true)}
                        >
                            CẬP NHẬT <span>→</span>
                        </Button>
                    </div>

                </div>
            </div>

            {/* Phần 3 - Bottom Full Width */}
            <div className="bg-white dark:bg-[#1E1E1E] pb-10 ">
                <div className="flex items-center gap-4 mb-8">
                    <BuildingLibraryIcon className="w-6 h-6 text-[#C9A85D]" />
                    <div>
                        <p className="text-[#C9A85D] text-[10px] font-bold tracking-wider mb-1 uppercase">PHẦN 3</p>
                        <h3 className="text-[14px] font-semibold dark:text-white text-gray-900">Thông tin Ngân hàng</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Company Bank */}
                    <div className="bg-gray-50 dark:bg-[#171717] rounded-lg p-6 border border-gray-200 dark:border-[#2A2A2A]">
                        <h4 className="text-[13px] font-bold text-gray-800 dark:text-white border-l-4 border-[#C9A85D] pl-3 mb-6">
                            NGÂN HÀNG CÔNG TY
                        </h4>

                        <div className="mb-4">
                            <label className="text-[11px] text-gray-500 uppercase font-medium mb-1 block">Tên ngân hàng</label>
                            <div className="text-[#C9A85D] font-bold text-[14px]">
                                {getConfig("bank_company_bank_name") || "---"}
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] text-gray-500 uppercase font-medium mb-2 block">Số tài khoản</label>
                            <div
                                onClick={() => handleCopy(getConfig("bank_company_account_number"))}
                                className="bg-white dark:bg-[#222222] border border-gray-200 dark:border-[#333] rounded-md p-3 flex justify-between items-center group cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors"
                            >
                                <span className="font-mono text-gray-800 dark:text-gray-200 text-[14px] tracking-wider font-semibold">
                                    {getConfig("bank_company_account_number") || "---"}
                                </span>
                                <DocumentDuplicateIcon className="w-4 h-4 text-gray-400 group-hover:text-[#C9A85D] transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Personal Bank */}
                    <div className="bg-gray-50 dark:bg-[#171717] rounded-lg p-6 border border-gray-200 dark:border-[#2A2A2A]">
                        <h4 className="text-[13px] font-bold text-gray-800 dark:text-white border-l-4 border-[#C9A85D] pl-3 mb-6">
                            NGÂN HÀNG CÁ NHÂN
                        </h4>

                        <div className="mb-4">
                            <label className="text-[11px] text-gray-500 uppercase font-medium mb-1 block">Tên ngân hàng</label>
                            <div className="text-gray-800 dark:text-white font-bold text-[14px]">
                                {getConfig("bank_personal_bank_name") || "---"}
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] text-gray-500 uppercase font-medium mb-2 block">Số tài khoản</label>
                            <div
                                onClick={() => handleCopy(getConfig("bank_personal_account_number"))}
                                className="bg-white dark:bg-[#222222] border border-gray-200 dark:border-[#333] rounded-md p-3 flex justify-between items-center group cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors"
                            >
                                <span className="font-mono text-gray-800 dark:text-gray-200 text-[14px] tracking-wider font-semibold">
                                    {getConfig("bank_personal_account_number") || "---"}
                                </span>
                                <DocumentDuplicateIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-200 transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Button
                        variant="primary"
                        onClick={() => setModalBankOpen(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                        CẬP NHẬT THÔNG TIN NGÂN HÀNG
                    </Button>
                </div>
            </div>

            <ModalVAT open={modalVatOpen} onClose={() => setModalVatOpen(false)} data={configsData} />
            <ModalCompany open={modalCompanyOpen} onClose={() => setModalCompanyOpen(false)} data={configsData} />
            <ModalBank open={modalBankOpen} onClose={() => setModalBankOpen(false)} data={configsData} />
        </div>
    );
}

export default SystemConfigsPage;