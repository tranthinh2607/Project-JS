import { useState } from "react";
import { Drawer, Tabs, Tag, Select, Avatar, Tooltip, Input, Checkbox, Popconfirm, Timeline, Divider, Empty, Modal } from "antd";
import type { ITask, IChecklistItem, IStatusHistory } from "../types";
import { useTasksQuery } from "../useQuery";
import { formatDate } from "../../../core/utils/formatDate";
import { Button } from "../../../core/layouts";
import { UserIcon, PlusIcon, TrashIcon, ClockIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { handleToastMessageErrors } from "../../../core/utils/toastMessageError";
import FormCreate from "./FormCreate";
import { useMembersQuery } from "../../members/useQuery";
import AssigneeCell from "./AssigneeCell";

const moduleKeyName = "tasks";

const priorityMap: Record<string, { color: string; label: string }> = {
  low: { color: "green", label: "Thấp" },
  medium: { color: "orange", label: "Trung bình" },
  high: { color: "red", label: "Cao" },
};

const statusMap: Record<string, { color: string; label: string }> = {
  todo: { color: "default", label: "Chờ xử lý" },
  in_progress: { color: "processing", label: "Đang thực hiện" },
  blocked: { color: "error", label: "Bị chặn" },
  done: { color: "success", label: "Hoàn thành" },
};

interface IProps {
  open: boolean;
  task: ITask | null;
  projectId: string;
  onClose: () => void;
}

function TaskDetail({ open, task, projectId, onClose }: IProps) {
  const [activeTab, setActiveTab] = useState("info");
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [openCreateSubtask, setOpenCreateSubtask] = useState(false);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [blockedNote, setBlockedNote] = useState("");
  const [pandingStatus, setPandingStatus] = useState<string | null>(null);

  const taskId = task?._id || "";

  // Queries
  const { data: taskDetail, refetch: refetchDetail } = useTasksQuery.useGetById(taskId);
  const { data: checklistRes, refetch: refetchChecklists } = useTasksQuery.useGetChecklists(taskId);
  const { data: historyRes } = useTasksQuery.useGetStatusHistory(taskId);
  const { data: membersRes } = useMembersQuery.useGetMembers(projectId, { page: 1, limit: 100 });

  const detail = taskDetail || task;
  const checklists: IChecklistItem[] = (checklistRes as any)?.data || [];
  const statusHistory: IStatusHistory[] = (historyRes as any)?.data || [];

  // Mutations
  const { mutate: changeStatus } = useTasksQuery.useChangeStatus(
    () => { toast.success("Cập nhật trạng thái thành công"); refetchDetail(); },
    (error) => handleToastMessageErrors(error)
  );
  const { mutate: assignUser } = useTasksQuery.useAssign(
    () => { toast.success("Giao việc thành công"); refetchDetail(); },
    (error) => handleToastMessageErrors(error)
  );
  const { mutate: unassignUser } = useTasksQuery.useUnassign(
    () => { toast.success("Hủy giao việc thành công"); refetchDetail(); },
    (error) => handleToastMessageErrors(error)
  );
  const { mutate: addChecklist } = useTasksQuery.useAddChecklist(
    () => { toast.success("Thêm checklist thành công"); refetchChecklists(); setNewChecklistTitle(""); },
    (error) => handleToastMessageErrors(error)
  );
  const { mutate: toggleChecklist } = useTasksQuery.useToggleChecklist(
    () => refetchChecklists(),
    (error) => handleToastMessageErrors(error)
  );
  const { mutate: deleteChecklist } = useTasksQuery.useDeleteChecklist(
    () => { toast.success("Xoá checklist thành công"); refetchChecklists(); },
    (error) => handleToastMessageErrors(error)
  );

  if (!detail) return null;

  const subtasks = (detail as any)?.subtasks || [];

  return (
    <>
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">{detail.title}</span>
            <Tag color={priorityMap[detail.priority]?.color} className="rounded-full">
              {priorityMap[detail.priority]?.label}
            </Tag>
          </div>
        }
        open={open}
        width={Math.min(window.innerWidth - 250, 800)}
        onClose={onClose}
      >
        {/* Status + Quick Actions */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Trạng thái:</span>
            <Select
              value={detail.status}
              className="w-40"
              onChange={(value) => {
                if (value === "blocked") {
                  setPandingStatus(value);
                  setIsBlockedModalOpen(true);
                } else {
                  changeStatus({ id: taskId, payload: { status: value } });
                }
              }}
              options={[
                { value: "todo", label: "Chờ xử lý" },
                { value: "in_progress", label: "Đang thực hiện" },
                { value: "blocked", label: "Bị chặn" },
                { value: "done", label: "Hoàn thành" },
              ]}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Người tạo:</span>
            <span className="font-medium">{detail.created_name || "---"}</span>
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "info",
              label: "Thông tin",
              children: (
                <div className="flex flex-col gap-4">
                  {/* Description */}
                  <div>
                    <span className="text-gray-500 text-sm block mb-1">Mô tả</span>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-700 whitespace-pre-wrap min-h-[60px]">
                      {detail.description || "Không có mô tả."}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500 text-sm block mb-1">Ngày bắt đầu</span>
                      <span className="font-medium">{detail.start_date ? formatDate(detail.start_date) : "Chưa đặt"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm block mb-1">Ngày hết hạn</span>
                      <span className="font-medium">{detail.due_date ? formatDate(detail.due_date) : "Chưa đặt"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm block mb-1">Ngày tạo</span>
                      <span className="font-medium">{formatDate(detail.createdAt)}</span>
                    </div>
                  </div>

                  <Divider />

                  {/* Assignees */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-700">Người thực hiện</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <AssigneeCell
                        data={detail.assignees || []}
                        projectId={projectId}
                        taskId={taskId}
                        moduleKeyName={moduleKeyName}
                        handleAddAssignee={(userId) => assignUser({ taskId, userIds: [userId] })}
                        handleRemoveAssignee={(userId) => unassignUser({ taskId, userId })}
                      />
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "subtasks",
              label: `Subtask (${subtasks.length})`,
              children: (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      onClick={() => setOpenCreateSubtask(true)}
                      className="flex items-center gap-1"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>Tạo subtask</span>
                    </Button>
                  </div>

                  {subtasks.length === 0 ? (
                    <Empty description="Chưa có subtask" />
                  ) : (
                    <div className="flex flex-col gap-2">
                      {subtasks.map((sub: ITask) => (
                        <div key={sub._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <Tag color={statusMap[sub.status]?.color} className="rounded-full">
                              {statusMap[sub.status]?.label}
                            </Tag>
                            <span className="font-medium">{sub.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tag color={priorityMap[sub.priority]?.color} className="rounded-full">
                              {priorityMap[sub.priority]?.label}
                            </Tag>
                            <Avatar.Group max={{ count: 2 }} size="small">
                              {sub.assignees?.map((a) => (
                                <Tooltip key={a._id} title={a.name}>
                                  <Avatar src={a.avatar} size="small" icon={!a.avatar && <UserIcon className="w-3 h-3" />} className="bg-blue-100 text-blue-600" />
                                </Tooltip>
                              ))}
                            </Avatar.Group>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: "checklist",
              label: `Checklist (${checklists.length})`,
              children: (
                <div className="flex flex-col gap-3">
                  {/* Add Checklist */}
                  <div className="flex gap-2">
                    <Input
                      value={newChecklistTitle}
                      onChange={(e) => setNewChecklistTitle(e.target.value)}
                      placeholder="Thêm checklist item..."
                      onPressEnter={() => {
                        if (newChecklistTitle.trim()) {
                          addChecklist({ taskId, title: newChecklistTitle.trim() });
                        }
                      }}
                    />
                    <Button
                      variant="primary"
                      className="flex items-center gap-1"
                      onClick={() => {
                        if (newChecklistTitle.trim()) {
                          addChecklist({ taskId, title: newChecklistTitle.trim() });
                        }
                      }}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Checklist Items */}
                  {checklists.length === 0 ? (
                    <Empty description="Chưa có checklist" />
                  ) : (
                    <div className="flex flex-col gap-1">
                      {checklists.map((item) => (
                        <div key={item._id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 group transition-colors">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={item.is_completed}
                              onChange={(e) => toggleChecklist({ taskId, itemId: item._id, is_completed: e.target.checked })}
                            />
                            <span className={item.is_completed ? "line-through text-gray-400" : "text-gray-700"}>
                              {item.title}
                            </span>
                          </div>
                          <Popconfirm
                            title="Xoá checklist item?"
                            onConfirm={() => deleteChecklist({ taskId, itemId: item._id })}
                            okText="Xoá"
                            cancelText="Huỷ"
                          >
                            <button className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </Popconfirm>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: "history",
              label: "Lịch sử",
              children: (
                <div>
                  {statusHistory.length === 0 ? (
                    <Empty description="Chưa có lịch sử trạng thái" />
                  ) : (
                    <Timeline
                      items={statusHistory.map((h) => ({
                        dot: <ClockIcon className="w-4 h-4 text-blue-500" />,
                        children: (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Tag color={statusMap[h.old_status]?.color} className="rounded-full">
                                {statusMap[h.old_status]?.label || h.old_status}
                              </Tag>
                              <span className="text-gray-400">→</span>
                              <Tag color={statusMap[h.new_status]?.color} className="rounded-full">
                                {statusMap[h.new_status]?.label || h.new_status}
                              </Tag>
                            </div>
                            {h.note && <span className="text-gray-500 text-sm italic">{h.note}</span>}
                            <span className="text-gray-400 text-xs">
                              {h.changed_name || "---"} • {formatDate(h.createdAt)}
                            </span>
                          </div>
                        ),
                      }))}
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </Drawer>

      <FormCreate
        projectId={projectId}
        parentTaskId={taskId}
        open={openCreateSubtask}
        onClose={() => {
          setOpenCreateSubtask(false);
          refetchDetail();
        }}
      />

      <Modal
        title="Lý do bị chặn"
        open={isBlockedModalOpen}
        onCancel={() => {
          setIsBlockedModalOpen(false);
          setBlockedNote("");
          setPandingStatus(null);
        }}
        onOk={() => {
          if (!blockedNote.trim()) {
            return toast.error("Vui lòng nhập lý do");
          }
          if (pandingStatus) {
            changeStatus({
              id: taskId,
              payload: { status: pandingStatus, note: blockedNote.trim() }
            });
            setIsBlockedModalOpen(false);
            setBlockedNote("");
            setPandingStatus(null);
          }
        }}
        okText="Cập nhật"
        cancelText="Huỷ"
        destroyOnClose
      >
        <div className="py-2">
          <p className="text-sm text-gray-500 mb-2">Vui lòng nhập lý do tại sao nhiệm vụ này bị chặn:</p>
          <Input.TextArea
            rows={4}
            value={blockedNote}
            onChange={(e) => setBlockedNote(e.target.value)}
            placeholder="Nhập lý do tại đây..."
            autoFocus
          />
        </div>
      </Modal>
    </>
  );
}

export default TaskDetail;
