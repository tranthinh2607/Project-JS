import toast from "react-hot-toast";
import { handleToastMessageErrors } from "../../../core/utils/toastMessageError";
import { useTasksQuery } from "../useQuery";

export default function useAction() {
  const { useDelete } = useTasksQuery;

  const { mutate: mutateDelete, isPending: isPendingDelete } = useDelete(
    () => toast.success("Xoá nhiệm vụ thành công"),
    (error) => handleToastMessageErrors(error)
  );

  return {
    mutateDelete,
    isPending: isPendingDelete,
  };
}
