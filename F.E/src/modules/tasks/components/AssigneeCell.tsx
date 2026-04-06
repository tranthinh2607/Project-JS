import { Avatar, Popover, Space, Divider, Tooltip } from "antd";
import { useEffect, useState } from "react";
import {
  PlusIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  XMarkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../../../core/layouts";
import { useMembersQuery } from "../../members/useQuery";

const colors = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];

interface IProps {
  data: any[]; // Array of assignee objects
  projectId: string;
  taskId: string;
  length?: number;
  multi?: boolean;
  moduleKeyName: string;
  handleRemoveAssignee: (userId: string) => void;
  handleAddAssignee: (userId: string) => void;
}

export default function AssigneeCell({
  data,
  projectId,
  taskId,
  length = 5,
  multi = true,
  moduleKeyName,
  handleRemoveAssignee,
  handleAddAssignee,
}: IProps) {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { data: membersRes } = useMembersQuery.useGetMembers(projectId, { page: 1, limit: 100 });

  const assignees = data || [];
  const assignedIds = assignees.map((a: any) => a._id || a.id);
  const projectMembers = (membersRes as any)?.data || [];

  const getInitial = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return parts[parts?.length - 1][0].toUpperCase();
  };

  const getColor = (id: string) => {
    if (!id) return colors[0];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const slugify = (str: string) =>
    str
      ? str
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, " ")
          .trim()
      : "";

  const filteredMembers = projectMembers.filter((item: any) => {
    const name = item.user?.name || item.email || "";
    const nameSlug = slugify(name);
    const keywordSlug = slugify(keyword);

    return (
      nameSlug.includes(keywordSlug) || keywordSlug.split(" ").every((k) => nameSlug.includes(k))
    );
  });

  const content = (
    <div style={{ minWidth: 250 }}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-sm">Chọn người thực hiện</div>
        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
      </div>

      <input
        placeholder="Tìm tên hoặc email..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-2 outline-none focus:border-blue-500"
      />

      <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
        {filteredMembers?.map((item: any) => {
          const userId = item.user?._id;
          const isChecked = userId ? assignedIds.includes(userId) : false;
          const isRegister = item.isRegister !== false; // Default to true if not provided, but we expect it from the API
          const displayName = item.user?.name || item.email;

          return (
            <div
              key={item._id}
              className={`flex items-center justify-between px-2 py-1.5 rounded transition-colors ${
                !isRegister ? "opacity-50 cursor-not-allowed bg-gray-50" : "hover:bg-gray-100 cursor-pointer"
              }`}
              onClick={() => {
                if (isRegister) {
                  if (isChecked) {
                    handleRemoveAssignee(userId);
                  } else {
                    handleAddAssignee(userId);
                  }
                }
              }}
            >
              <div className="flex items-center gap-2">
                <Avatar
                  size="small"
                  src={item.user?.avatar}
                  style={{
                    backgroundColor: isRegister ? getColor(userId || item._id) : "#ccc",
                  }}
                  icon={!item.user?.avatar && <UserIcon className="w-3 h-3" />}
                >
                  {getInitial(displayName)}
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{displayName}</span>
                  {!isRegister && (
                    <span className="text-[10px] text-red-500 italic">Chưa đăng ký hệ thống</span>
                  )}
                </div>
              </div>
              <div>
                {isChecked ? (
                  <CheckIcon className="w-4 h-4 text-green-500 font-bold" />
                ) : isRegister ? (
                  <PlusIcon className="w-4 h-4 text-gray-400" />
                ) : (
                  <Tooltip title="Thành viên này chưa đăng ký tài khoản">
                    <XMarkIcon className="w-4 h-4 text-gray-300" />
                  </Tooltip>
                )}
              </div>
            </div>
          );
        })}
        {filteredMembers?.length === 0 && (
          <div className="text-center py-4 text-gray-400 text-xs shadow-sm">Không tìm thấy thành viên</div>
        )}
      </div>
    </div>
  );

  return (
    <Space>
      {assignees.length === 0 ? (
        <Popover
          content={content}
          trigger="click"
          open={popoverVisible}
          onOpenChange={setPopoverVisible}
          placement="bottomLeft"
        >
          <Tooltip title="Giao việc">
            <Avatar
              size="small"
              className="bg-gray-100 text-gray-400 border-dashed border-gray-300 cursor-pointer hover:bg-gray-200 hover:text-gray-600 transition-all"
            >
              <PlusIcon className="w-3 h-3" />
            </Avatar>
          </Tooltip>
        </Popover>
      ) : (
        <div className="flex items-center">
          <Avatar.Group max={{ count: length, style: { color: '#f56a00', backgroundColor: '#fde3cf' } }} size="small">
            {assignees.map((user: any) => (
              <Tooltip key={user._id} title={user.name}>
                <Avatar
                  src={user.avatar}
                  style={{ backgroundColor: getColor(user._id) }}
                  icon={!user.avatar && <UserIcon className="w-3 h-3" />}
                >
                  {getInitial(user.name)}
                </Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>

          <Popover
            content={content}
            trigger="click"
            open={popoverVisible}
            onOpenChange={setPopoverVisible}
            placement="bottomLeft"
          >
            <Tooltip title="Chỉnh sửa người thực hiện">
              <div className="ml-1 cursor-pointer text-gray-400 hover:text-blue-500 transition-colors">
                 <PencilIcon className="w-3.5 h-3.5" />
              </div>
            </Tooltip>
          </Popover>
        </div>
      )}
    </Space>
  );
}
