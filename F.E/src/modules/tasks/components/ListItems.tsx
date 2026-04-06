import { Pagination, Popconfirm, Table, Tag, Tooltip, Avatar, Select } from "antd";
import { useState, useEffect } from "react";
import AssigneeCell from "./AssigneeCell";
import type { ITask } from "../types";
import { formatDate } from "../../../core/utils/formatDate";
import { TrashIcon, UserIcon, EyeIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { ColumnType } from "antd/es/table";
import { Button } from "../../../core/layouts";
import toast from "react-hot-toast";
import { useTasksQuery } from "../useQuery";
import { handleToastMessageErrors } from "../../../core/utils/toastMessageError";
import api from "../api";

const priorityMap: Record<string, { color: string; label: string }> = {
  low: { color: "green", label: "Thấp" },
  medium: { color: "orange", label: "Trung bình" },
  high: { color: "red", label: "Cao" },
};

interface IProps {
  data: ITask[];
  pagination: {
    page: number;
    limit: number;
    totalRow: number;
    totalPages?: number;
  } | null;
  onChangePage: (page: number, pageSize: number) => void;
  isLoading?: boolean;
  handleDelete: (id: string) => void;
  handleView?: (record: ITask) => void;
  onCreateSubTask?: (record: ITask) => void;
  moduleKeyName: string;
  keyword?: string;
  projectId?: string;
  showProjectColumn?: boolean;
}

function ListItems({
  data,
  pagination,
  onChangePage,
  isLoading,
  handleDelete,
  handleView,
  onCreateSubTask,
  moduleKeyName,
  keyword,
  projectId,
  showProjectColumn = false,
}: IProps) {
  const [treeData, setTreeData] = useState<ITask[]>([]);

  const { mutate: changeStatus } = useTasksQuery.useChangeStatus(
    () => toast.success("Cập nhật trạng thái thành công"),
    (error) => handleToastMessageErrors(error)
  );

  const { mutate: assignUser } = useTasksQuery.useAssign(
    () => toast.success("Giao việc thành công"),
    (error) => handleToastMessageErrors(error)
  );

  const { mutate: unassignUser } = useTasksQuery.useUnassign(
    () => toast.success("Hủy giao việc thành công"),
    (error) => handleToastMessageErrors(error)
  );

  useEffect(() => {
    setTreeData(() => {
      if (!data) return [];
      return data.map((item) => {
        const shouldShowChildren = (item.subtask_count ?? 0) > 0 && !keyword;
        return {
          ...item,
          children: shouldShowChildren ? ([] as ITask[]) : undefined,
        };
      });
    });
  }, [data, keyword]);

  const updateTreeData = (
    list: ITask[],
    id: string,
    children: ITask[]
  ): ITask[] => {
    return list.map((item) => {
      if (item._id === id) {
        return { ...item, children: children.length > 0 ? children : undefined };
      }
      if (item.children) {
        return { ...item, children: updateTreeData(item.children, id, children) };
      }
      return item;
    });
  };

  const onExpand = async (expanded: boolean, record: ITask) => {
    if (expanded && (!record.children || record.children.length === 0)) {
      try {
        const res = await api.getById(record._id);
        const subtasks = (res as any)?.data?.subtasks || [];
        setTreeData((prev) => updateTreeData(prev, record._id, subtasks));
      } catch (error) {
        console.error("Failed to fetch subtasks:", error);
      }
    }
  };

  const columns: ColumnType<ITask>[] = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text: string, record) => (
        <span
          className={`font-medium cursor-pointer hover:underline ${record.parent_task_id ? "text-blue-500" : "text-blue-700"}`}
          onClick={() => handleView?.(record)}
        >
          {text}
        </span>
      ),
    },
    ...(showProjectColumn
      ? [
        {
          title: "Dự án",
          key: "project",
          width: 150,
          render: (_: any, record: ITask) => (
            <span className="text-gray-600 font-medium">
              {record.project_name || "---"}
            </span>
          ),
        },
      ]
      : []),
    {
      title: "Người thực hiện",
      key: "assignees",
      width: 160,
      render: (_, record) => (
        <AssigneeCell
          data={record.assignees || []}
          projectId={record.project_id}
          taskId={record._id}
          moduleKeyName={moduleKeyName}
          handleAddAssignee={(userId) => assignUser({ taskId: record._id, userIds: [userId] })}
          handleRemoveAssignee={(userId) => unassignUser({ taskId: record._id, userId })}
        />
      ),
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 120,
      align: "center",
      render: (priority: string) => {
        const p = priorityMap[priority] || { color: "default", label: priority };
        return <Tag color={p.color} className="rounded-full px-3">{p.label}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 180,
      align: "center",
      render: (status: string, record) => (
        <Select
          value={status}
          className="w-full"
          onChange={(value) => {
            changeStatus({ id: record._id, payload: { status: value } });
          }}
          options={[
            { value: "todo", label: "Chờ xử lý" },
            { value: "in_progress", label: "Đang thực hiện" },
            { value: "blocked", label: "Bị chặn" },
            { value: "done", label: "Hoàn thành" },
          ]}
        />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      align: "center",
      render: (text: string) => formatDate(text),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          {/* <Button
            module_name={moduleKeyName}
            action="create"
            variant="transaction"
            className="!p-1 h-8 w-8 text-blue-600 hover:text-blue-700"
            onClick={() => onCreateSubTask?.(record)}
          >
            <Tooltip title="Thêm nhiệm vụ con">
              <PlusIcon className="w-4 h-4 mx-auto" />
            </Tooltip>
          </Button> */}
          <Popconfirm
            title="Xoá nhiệm vụ"
            description="Bạn có chắc muốn xoá nhiệm vụ này?"
            placement="left"
            onConfirm={() => handleDelete(record._id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button
              module_name={moduleKeyName}
              action="delete"
              variant="transaction"
              className="!p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Tooltip title="Xoá">
                <TrashIcon className="w-4 h-4 mx-auto" />
              </Tooltip>
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <Table
            loading={isLoading}
            pagination={false}
            dataSource={treeData}
            columns={columns}
            rowKey="_id"
            expandable={keyword ? undefined : { onExpand }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Pagination
          current={pagination?.page}
          pageSize={pagination?.limit}
          total={pagination?.totalRow}
          onChange={onChangePage}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}

export default ListItems;
