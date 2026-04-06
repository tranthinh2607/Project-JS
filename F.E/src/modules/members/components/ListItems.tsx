import { Pagination, Popconfirm, Table, Tag, Tooltip, Avatar } from "antd";
import type { IMember } from "../types";
import { formatDate } from "../../../core/utils/formatDate";
import { TrashIcon, UserIcon } from "@heroicons/react/24/outline";
import type { ColumnType } from "antd/es/table";
import { Button } from "../../../core/layouts";
import { formatAvatar } from "../../../core/utils/formatAvatar";

interface IProps {
  data: IMember[];
  pagination: {
    page: number;
    limit: number;
    totalRow: number;
  } | null;
  onChangePage: (page: number, pageSize: number) => void;
  isLoading?: boolean;
  handleDelete: (id: string) => void;
  moduleKeyName: string;
}

function ListItems({
  data,
  pagination,
  onChangePage,
  isLoading,
  handleDelete,
  moduleKeyName,
}: IProps) {
  const columns: ColumnType<IMember>[] = [
    {
      title: "Thành viên",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={formatAvatar(record.user?.avatar)}
            icon={!record.user?.avatar && <UserIcon className="w-4 h-4" />}
            className="bg-blue-100 text-blue-600"
          />
          <div className="flex flex-col">
            <span className="font-medium">{record.user?.name || "Chưa cập nhật"}</span>
            <span className="text-xs text-gray-500">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 120,
      align: "center",
      render: (role: string) => (
        <Tag color={role === "owner" ? "gold" : "blue"} className="rounded-full px-3">
          {role === "owner" ? "Chủ sở hữu" : "Thành viên"}
        </Tag>
      ),
    },
    {
      title: "Ngày tham gia",
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
      width: 100,
      render: (record: IMember) => (
        <div className="flex items-center justify-center gap-2">
          <Popconfirm
            title="Gỡ thành viên"
            description="Bạn có chắc muốn gỡ thành viên này khỏi dự án?"
            placement="left"
            onConfirm={() => handleDelete(record._id)}
            okText="Gỡ"
            cancelText="Huỷ"
          >
            <Button
              module_name={moduleKeyName}
              action="delete"
              variant="transaction"
              className="!p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-none"
            >
              <Tooltip title="Gỡ">
                <TrashIcon className="w-4 h-4 mx-auto" />
              </Tooltip>
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            loading={isLoading}
            pagination={false}
            dataSource={data}
            columns={columns}
            rowKey="_id"
          />
        </div>
      </div>

      {pagination && pagination.totalRow > pagination.limit && (
        <div className="flex justify-end">
          <Pagination
            current={pagination.page}
            pageSize={pagination.limit}
            total={pagination.totalRow}
            onChange={onChangePage}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}

export default ListItems;
