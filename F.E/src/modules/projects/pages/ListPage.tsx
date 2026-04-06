import { useState } from "react";
import { Button } from "../../../core/layouts";
import { ListItems } from "../components";
import FormCreate from "../components/FormCreate";
import FormUpdate from "../components/FormUpdate";
import type { IMyProject, IParams } from "../types";
import { useLoadingToast } from "../../../core/utils/useLoadingToast";
import Search from "../components/Search";
import { useGetList } from "../hooks/useGetList";
import useAction from "../hooks/useAction";
import { useProjectQuery } from "../useQuery";
import { Drawer } from "antd";
import DetailPage from "./DetailPage";

const moduleKeyName = "projects";

const defaultParams: IParams = {
  page: 1,
  limit: 10,
  keyword: undefined,
};

function ListPage() {
  const moduleName = "Dự án của tôi";
  document.title = moduleName;

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IMyProject | undefined>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerProject, setDrawerProject] = useState<IMyProject | null>(null);

  const {
    data,
    pagination,
    isLoading,
    handlePageChange,
    handleSearch,
  } = useGetList<IMyProject, IParams>(
    useProjectQuery.useGetMyProjects,
    defaultParams
  );

  const { mutateDelete, isPending } = useAction();

  useLoadingToast(
    isPending,
    "Đang xử lý",
    `${moduleKeyName}`
  );


  const handleUpdate = (record: IMyProject) => {
    setSelectedItem(record);
    setOpenUpdate(true);
  };

  const handleDelete = (id: string) => {
    mutateDelete(id);
  };

  const handleView = (record: IMyProject) => {
    setDrawerProject(record);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-2 rounded-sm relative">
      <div className="flex justify-between items-center">
        <h2 className="title-module">{moduleName}</h2>

        <Button
          module_name={moduleKeyName}
          action="create"
          variant="primary"
          onClick={() => setOpenCreate(true)}
        >
          Tạo dự án mới
        </Button>
      </div>

      {/* nếu cần search thì bật lại */}
      <Search handleSearch={handleSearch} />

      <ListItems
        data={data ?? []}
        pagination={pagination}
        onChangePage={handlePageChange}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        handleView={handleView}
        isLoading={isLoading}
        moduleKeyName={moduleKeyName}
      />

      <FormCreate open={openCreate} onClose={() => setOpenCreate(false)} />

      <FormUpdate
        open={openUpdate}
        data={selectedItem}
        onClose={() => {
          setOpenUpdate(false);
          setSelectedItem(undefined);
        }}
      />

      <Drawer
        title="Chi tiết dự án"
        open={drawerOpen}
        width={window.innerWidth - 250}
        onClose={() => {
          setDrawerOpen(false);
          setDrawerProject(null);
        }}
      >
        <DetailPage projectId={drawerProject?._id} />
      </Drawer>
    </div>
  );
}

export default ListPage;