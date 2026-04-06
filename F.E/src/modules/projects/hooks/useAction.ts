import toast from "react-hot-toast";
import { handleToastMessageErrors } from "../../../core/utils/toastMessageError";
import { useProjectQuery } from "../useQuery";

export default function useAction() {
  const { useDelete } = useProjectQuery;

  const { mutate: mutateDelete, isPending: isPendingDelete } = useDelete(
    () => toast.success("Xoá dự án thành công"),
    (error) => handleToastMessageErrors(error)
  );

  return {
    mutateDelete,
    isPending: isPendingDelete,
  };
}
