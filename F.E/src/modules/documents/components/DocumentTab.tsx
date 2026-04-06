import { useState } from "react";
import { Table, Space, Popconfirm, Tooltip, Avatar, Upload } from "antd";
import {
  DocumentIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  PhotoIcon,
  MusicalNoteIcon,
  VideoCameraIcon,
  EyeIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { useDocumentQuery } from "../useQuery";
import toast from "react-hot-toast";
import { formatDate } from "../../../core/utils/formatDate";
import { Button } from "../../../core/layouts";
import { useGetList } from "../../members/hooks/useGetList";
import { Pagination } from "antd";
import { formatAvatar } from "../../../core/utils/formatAvatar";

interface IProps {
  projectId: string;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes("image")) return <PhotoIcon className="w-5 h-5 text-blue-500" />;
  if (mimeType.includes("pdf")) return <DocumentTextIcon className="w-5 h-5 text-red-500" />;
  if (mimeType.includes("word") || mimeType.includes("officedocument.wordprocessingml"))
    return <DocumentIcon className="w-5 h-5 text-blue-600" />;
  if (mimeType.includes("excel") || mimeType.includes("officedocument.spreadsheetml"))
    return <DocumentIcon className="w-5 h-5 text-green-600" />;
  if (mimeType.includes("audio")) return <MusicalNoteIcon className="w-5 h-5 text-purple-500" />;
  if (mimeType.includes("video")) return <VideoCameraIcon className="w-5 h-5 text-orange-500" />;
  return <DocumentIcon className="w-5 h-5 text-gray-500" />;
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

function DocumentTab({ projectId }: IProps) {
  const moduleKeyName = "documents";

  const defaultParams = {
    page: 1,
    limit: 10,
  };

  const {
    data: documents,
    pagination,
    isLoading,
    handlePageChange,
  } = useGetList<any, any>(
    (params) => useDocumentQuery.useGetByProject(projectId, params),
    defaultParams
  );

  const { mutate: uploadMutate, isPending: isUploading } = useDocumentQuery.useUpload(
    (res) => toast.success(res.message),
    (error) => toast.error(error?.message || "Lỗi khi tải lên")
  );

  const { mutate: deleteMutate } = useDocumentQuery.useDelete(
    projectId,
    (res) => toast.success(res.message),
    (error) => toast.error(error?.message || "Lỗi khi xóa")
  );

  const handleQuickView = (record: any) => {
    const url = `${import.meta.env.VITE_API_TASK_FLOW_URL}${record.path}`;
    window.open(url, "_blank");
  };

  const columns = [
    {
      title: "Tài liệu",
      key: "name",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            {getFileIcon(record.mime_type)}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{record.original_name}</span>
            <span className="text-xs text-gray-500">{formatSize(record.size)}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Người đăng",
      key: "creator",
      width: 250,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          <Avatar
            size="small"
            src={formatAvatar(record.created_by?.avatar)}
            icon={<UserIcon className="w-3 h-3" />}
          />
          <span className="text-sm text-gray-700">{record.created_by?.name || "---"}</span>
        </div>
      ),
    },
    {
      title: "Ngày đăng",
      dataIndex: "createdAt",
      key: "date",
      width: 150,
      align: "center" as const,
      render: (date: string) => <span className="text-sm text-gray-600">{formatDate(date)}</span>,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      align: "center" as const,
      render: (_: any, record: any) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip title="Xem nhanh">
            <Button
              module_name={moduleKeyName}
              action="view"
              variant="transaction"
              onClick={() => handleQuickView(record)}
              className="!p-1 h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-none"
            >
              <EyeIcon className="w-4 h-4 mx-auto" />
            </Button>
          </Tooltip>

          <Popconfirm
            title="Xóa tài liệu"
            description="Bạn có chắc chắn muốn xóa tài liệu này?"
            placement="left"
            onConfirm={() => deleteMutate(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                module_name={moduleKeyName}
                action="delete"
                variant="transaction"
                className="!p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-none"
              >
                <TrashIcon className="w-4 h-4 mx-auto" />
              </Button>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 rounded-sm relative py-2 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Tài liệu dự án ({pagination?.totalRow || 0})</h3>
          <p className="text-xs text-gray-500">Quản lý và lưu trữ các tập tin liên quan đến dự án</p>
        </div>

        <Upload
          showUploadList={false}
          beforeUpload={(file) => {
            uploadMutate({ projectId, file });
            return false;
          }}
        >
          <Button
            module_name={moduleKeyName}
            action="create"
            variant="primary"
            isLoading={isUploading}
            className="flex items-center gap-2"
          >
            <CloudArrowUpIcon className="w-4 h-4" />
            <span>Tải tài liệu lên</span>
          </Button>
        </Upload>
      </div>

      <div className="mt-4 overflow-hidden  flex-1">
        <Table
          dataSource={documents || []}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          pagination={false}
          className="document-table"
          locale={{ emptyText: "Chưa có tài liệu nào" }}
        />
      </div>

      <div className="flex justify-end mt-4">
        <Pagination
          current={pagination?.page}
          pageSize={pagination?.limit}
          total={pagination?.totalRow}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}

export default DocumentTab;
