import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "../../core/utils/axiosClient";
import { api } from "./api";
import { queryClient } from "../../core/utils/queryClientHook";

const moduleName = "system-configs";

export const useSystemConfigsQuery = {
  useGetByKeys(keys: string[]) {
    return useQuery({
      queryKey: [moduleName, "list", keys],
      queryFn: async () => await api.getByKeys(keys),
    });
  },



  useUpdate(onSuccess?: (data: ApiResponse) => void, onError?: (error: ApiResponse) => void) {
    return useMutation({
      mutationFn: async (payload: any) => {
        const res = await api.update(payload);
        if (res.status === 200) {
          queryClient.invalidateQueries({ queryKey: [moduleName] });
          return res;
        }
        throw res;
      },
      onSuccess,
      onError,
    });
  },


};
