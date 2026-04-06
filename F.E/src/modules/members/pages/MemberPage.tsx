import { useState } from "react";
import { Button } from "../../../core/layouts";
import { ListItems } from "../components";
import FormCreate from "../components/FormCreate";
import type { IMember, IParams } from "../types";
import { useLoadingToast } from "../../../core/utils/useLoadingToast";
import Search from "../components/Search";
import { useGetList } from "../hooks/useGetList";
import useAction from "../hooks/useAction";
import { useMembersQuery } from "../useQuery";
import { UserGroupIcon, UserPlusIcon } from "@heroicons/react/24/outline";

const moduleKeyName = "project-members";

function MemberPage({ projectId }: { projectId: string }) {
  const defaultParams: IParams = {
    page: 1,
    limit: 10,
    keyword: undefined,
  };
  const moduleName = "Thành viên dự án";

  const [openCreate, setOpenCreate] = useState(false);

  const {
    data,
    pagination,
    isLoading,
    handlePageChange,
    handleSearch,
  } = useGetList<IMember, IParams>(
    (params) => useMembersQuery.useGetMembers(projectId, params),
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

  return (
    <div className="flex flex-col gap-2 rounded-sm relative py-2">
      <div className="flex justify-between items-center">

        <div>
          <h3 className="text-lg font-bold text-gray-800">{moduleName}</h3>
          <p className="text-xs text-gray-500">Quản lý những người tham gia vào dự án này</p>
        </div>

        <Button
          module_name={moduleKeyName}
          action="create"
          variant="primary"
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2"
        >
          <UserPlusIcon className="w-4 h-4" />
          <span>Mời thành viên</span>
        </Button>
      </div>

      <Search handleSearch={handleSearch} />

      <ListItems
        data={data ?? []}
        pagination={pagination}
        onChangePage={handlePageChange}
        handleDelete={handleDelete}
        isLoading={isLoading}
        moduleKeyName={moduleKeyName}
      />

      <FormCreate projectId={projectId} open={openCreate} onClose={() => setOpenCreate(false)} />
    </div>
  );
}

export default MemberPage;
