import { useState } from "react";
import { ListItems, Search, TaskDetail } from "../components";
import type { ITask, IParams } from "../types";
import { useLoadingToast } from "../../../core/utils/useLoadingToast";
import { useGetList } from "../hooks/useGetList";
import { useTasksQuery } from "../useQuery";
import { Drawer } from "antd";

const moduleKeyName = "tasks";

const defaultParams: IParams = {
  page: 1,
  limit: 10,
  keyword: undefined,
  type: "all",
};

function ListPage() {
  const moduleName = "Nhiệm vụ của tôi";
  document.title = moduleName;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  const {
    data,
    pagination,
    isLoading,
    handlePageChange,
    handleSearch,
    params,
  } = useGetList<ITask, IParams>(
    useTasksQuery.useGetAll,
    defaultParams
  );

  const { mutate: mutateDelete, isPending: isDeleting } = useTasksQuery.useDelete();

  useLoadingToast(
    isDeleting,
    "Đang xóa nhiệm vụ",
    `${moduleKeyName}-delete`
  );

  const handleDelete = (id: string) => {
    mutateDelete(id);
  };

  const handleView = (record: ITask) => {
    setSelectedTask(record);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 rounded-sm relative p-4 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{moduleName}</h2>
      </div>

      <Search handleSearch={handleSearch} />

      <ListItems
        data={data ?? []}
        pagination={pagination}
        onChangePage={handlePageChange}
        handleDelete={handleDelete}
        handleView={handleView}
        isLoading={isLoading}
        moduleKeyName={moduleKeyName}
        keyword={params.keyword}
        projectId=""
        showProjectColumn={true}
      />

      <TaskDetail
        open={drawerOpen}
        task={selectedTask}
        projectId={selectedTask?.project_id || ""}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedTask(null);
        }}
      />
    </div>
  );
}

export default ListPage;
