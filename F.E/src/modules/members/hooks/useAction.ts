import toast from "react-hot-toast";
import { handleToastMessageErrors } from "../../../core/utils/toastMessageError";
import { useMembersQuery } from "../useQuery";

export default function useAction() {
  const { useRemoveMember } = useMembersQuery;

  const { mutate: mutateDelete, isPending: isPendingDelete } = useRemoveMember(
    () => toast.success("Gỡ thành viên thành công"),
    (error) => handleToastMessageErrors(error)
  );

  return {
    mutateDelete,
    isPending: isPendingDelete,
  };
}
