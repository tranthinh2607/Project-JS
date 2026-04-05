import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProjectQuery } from "../useQuery";
import { ArrowLeftIcon, ClipboardDocumentIcon, PencilIcon } from "@heroicons/react/24/outline";
import { copyToClipboard } from "../../../core/utils/copyToClipboard";
import { Divider, Tabs } from "antd";
import { ItemRow, LoadingPage, NotFoundPage } from "../../../core/layouts";
import FormUpdate from "../components/FormUpdate";
import { formatDate } from "../../../core/utils/formatDate";

interface IProps {
    projectId?: string | null;
}

function DetailPage({ projectId }: IProps) {
    const { id: idParam } = useParams();
    const id = projectId ?? idParam;
    const isPage = !projectId;
    const moduleTitle = "Chi tiết dự án";
    document.title = moduleTitle;
    const [activeTab, setActiveTab] = useState("generalInfo");
    const [openUpdate, setOpenUpdate] = useState(false);

    const { data: project, isLoading, refetch } = useProjectQuery.useGetById(id as string);

    if (isLoading) return <LoadingPage />
    if (!project) return <NotFoundPage />

    return (
        <div className="flex flex-col gap-2 rounded-sm relative">
            <div className="flex items-end justify-between">
                <div className="flex flex-col items-start gap-1 -mt-1 ">
                    {isPage && (
                        <Link to={`/projects`} className="text-blue-600 !underline flex items-center gap-1">
                            <ArrowLeftIcon className="w-4 h-4" />
                            Quay về danh sách
                        </Link>
                    )}
                    <div className="flex items-start gap-2">
                        <div className="w-14 h-14 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xl font-bold uppercase">
                            {project.name.charAt(0)}
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <h2 className="title-module">{project.name}</h2>
                            </div>

                            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                <span>Mã dự án:</span>
                                <span className="font-medium text-blue-600">{project.code}</span>
                                <ClipboardDocumentIcon
                                    className="w-4 h-4 cursor-pointer hover:text-blue-600"
                                    onClick={() => copyToClipboard(project.code, "Đã sao chép mã")}
                                />
                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setOpenUpdate(true)}
                        className="text-blue-600 !underline flex items-center gap-1"
                    >
                        <PencilIcon className="w-4 h-4" />
                        Cập nhật
                    </button>
                </div>
            </div>
            {/* Main Content */}
            <div className="overflow-y-auto h-[calc(100vh-195px)] border-t border-gray-100 mt-2">
                <Tabs
                    activeKey={activeTab}
                    renderTabBar={(props, DefaultTabBar) => (
                        <div className="sticky top-0 bg-white z-10">
                            <DefaultTabBar {...props} />
                        </div>
                    )}
                    items={[
                        {
                            key: "generalInfo",
                            label: "Thông tin chung",
                            children: (
                                <div className="py-4 flex flex-col">
                                    <div className="grid grid-cols-5 gap-6">
                                        <ItemRow label="Chủ sở hữu" value={project.owner_name} />
                                        <ItemRow label="Ngày tạo" value={formatDate(project.createdAt)} />
                                        <ItemRow label="Cập nhật lần cuối" value={formatDate(project.updatedAt)} />
                                    </div>
                                    <Divider />
                                    <div>
                                        <span className="text-gray-500 text-sm block mb-2">Mô tả dự án</span>
                                        <div className="text-gray-700 whitespace-pre-wrap">
                                            {project.description || "Không có mô tả cho dự án này."}
                                        </div>
                                    </div>
                                </div>
                            )
                        },
                    ]}
                    onChange={(key) => {
                        setActiveTab(key);
                        if (key === "generalInfo") {
                            refetch();
                        }
                    }}
                />
            </div>
            <FormUpdate
                open={openUpdate}
                data={project as any}
                onClose={() => {
                    setOpenUpdate(false);
                }}
            />
        </div>
    );
}

export default DetailPage;
