import { Pagination, Popconfirm, Table, Tag, Tooltip } from "antd";
import type { IMyProject, IProject } from "../types";
import { formatDate } from "../../../core/utils/formatDate";
import { PencilSquareIcon, TrashIcon, EyeIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import type { ColumnType } from "antd/es/table";
import { Button } from "../../../core/layouts";
import { copyToClipboard } from "../../../core/utils/copyToClipboard";

interface IProps {
  data: IProject[];
  pagination: {
    page: number;
    limit: number;
    totalRow: number;
  } | null;
  onChangePage: (page: number, pageSize: number) => void;
  isLoading?: boolean;
  handleUpdate: (record: IProject) => void;
  handleDelete: (id: string) => void;
  handleView: (record: IProject) => void;
  moduleKeyName: string;
}

function ListItems({
  data,
  pagination,
  onChangePage,
  isLoading,
  handleUpdate,
  handleDelete,
  handleView,
  moduleKeyName,
}: IProps) {
  const columns: ColumnType<IProject>[] = [
    {
      title: "Mã dự án",
      dataIndex: "code",
      key: "code",
      width: 150,
      render: (text: string, record) => (
        <div className="flex items-center justify-between group">
          <span className="line-clamp-1 font-medium cursor-pointer text-blue-600 hover:underline" onClick={() => handleView(record)}>{text}</span>
          <div className="items-center gap-0 text-gray-500 hidden group-hover:flex absolute right-1">
            <button className=" hover:bg-white hover:border-gray-100 border border-transparent rounded-md">
              <Tooltip title="Sao chép">
                <ClipboardDocumentIcon className="w-4 h-4 cursor-pointer hover:text-blue-600" onClick={() => copyToClipboard(text || "")} />
              </Tooltip>
            </button>
          </div>
        </div>
      ),
    },
    {
      title: "Tên dự án",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text: string, record) => (
        <span className="font-medium cursor-pointer text-blue-600 hover:underline" onClick={() => handleView(record)}>
          {text}
        </span>
      ),
    },

    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 200,
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="line-clamp-1">{text ?? '---'}</span>
        </Tooltip>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      align: "center",
      width: 120,
      render: (role: string) => (
        <Tag color={role === "owner" ? "gold" : "blue"}>
          {role === "owner" ? "Chủ sở hữu" : "Thành viên"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      align: "center",
      render: (text: string) => formatDate(text),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      width: 120,
      render: (record) => (
        <div className="flex items-center justify-center gap-2">
          {record.role === "owner" && (
            <>
              <Button
                module_name={moduleKeyName}
                action="update"
                className="!p-1"
                onClick={() => handleUpdate(record)}
              >
                <PencilSquareIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              </Button>

              <Popconfirm
                title="Bạn có chắc muốn xoá dự án này?"
                placement="left"
                okText="Xoá"
                onConfirm={() => handleDelete(record._id)}
              >
                <Button
                  module_name={moduleKeyName}
                  action="delete"
                  className="!p-1"
                >
                  <TrashIcon className="w-5 h-5 cursor-pointer hover:text-red-600" />
                </Button>
              </Popconfirm>
            </>
          )}
        </div>
      ),
    }
  ];

  return (
    <div className="flex flex-col gap-2 h-full relative">
      <div className="flex-1">
        <div className="content-scroll">
          <Table
            loading={isLoading}
            pagination={false}
            dataSource={data}
            columns={columns}
            bordered
            rowKey={(record) => record._id}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span>
          Tổng số lượng: <span className="font-semibold">{pagination?.totalRow || 0}</span>
        </span>
        <Pagination
          total={pagination?.totalRow || 0}
          pageSize={pagination?.limit || 10}
          current={pagination?.page || 1}
          onChange={onChangePage}
          showSizeChanger
        />
      </div>
    </div>
  );
}

export default ListItems;