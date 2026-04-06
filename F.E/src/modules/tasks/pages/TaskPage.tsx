import { useState } from "react";
import { Button } from "../../../core/layouts";
import { ListItems, TaskDetail } from "../components";
import FormCreate from "../components/FormCreate";
import type { ITask, IParams } from "../types";
import { useLoadingToast } from "../../../core/utils/useLoadingToast";
import Search from "../components/Search";
import { useGetList } from "../hooks/useGetList";
import useAction from "../hooks/useAction";
import { useTasksQuery } from "../useQuery";
import { PlusIcon } from "@heroicons/react/24/outline";

const moduleKeyName = "tasks";

function TaskPage({ projectId }: { projectId: string }) {
  const defaultParams: IParams = {
    page: 1,
    limit: 10,
    keyword: undefined,
    priority: undefined,
  };
  const moduleName = "Nhiệm vụ";

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [parentTaskId, setParentTaskId] = useState<string | null>(null);

  const {
    data,
    pagination,
    isLoading,
    handlePageChange,
    handleSearch,
    params,
  } = useGetList<ITask, IParams>(
    (params) => useTasksQuery.useGetByProject(projectId, params),
    defaultParams
  );

  const { mutateDelete, isPending } = useAction();

  useLoadingToast(
    isPending,
    "Đang xử lý",
    `${moduleKeyName}`
  );

  const handleDelete = (id: string) => {
    mutateDelete(id);
  };

  const handleView = (record: ITask) => {
    setSelectedTask(record);
    setDetailOpen(true);
  };

  const handleCreateSubTask = (record: ITask) => {
    setParentTaskId(record._id);
    setOpenCreate(true);
  };

  return (
    <div className="flex flex-col gap-2 rounded-sm relative py-2">
      <div className="flex justify-between items-center">

        <div>
          <h3 className="text-lg font-bold text-gray-800">{moduleName}</h3>
          <p className="text-xs text-gray-500">Quản lý các nhiệm vụ trong dự án này</p>
        </div>

        <Button
          module_name={moduleKeyName}
          action="create"
          variant="primary"
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Tạo nhiệm vụ</span>
        </Button>
      </div>

      <Search handleSearch={handleSearch} />

      <ListItems
        data={data ?? []}
        pagination={pagination}
        onChangePage={handlePageChange}
        handleDelete={handleDelete}
        handleView={handleView}
        onCreateSubTask={handleCreateSubTask}
        isLoading={isLoading}
        moduleKeyName={moduleKeyName}
        keyword={params?.keyword}
        projectId={projectId}
      />

      <FormCreate
        projectId={projectId}
        parentTaskId={parentTaskId}
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          setParentTaskId(null);
        }}
      />

      <TaskDetail
        open={detailOpen}
        task={selectedTask}
        projectId={projectId}
        onClose={() => {
          setDetailOpen(false);
          setSelectedTask(null);
        }}
      />
    </div>
  );
}

export default TaskPage;
