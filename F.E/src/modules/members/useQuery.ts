import { useMutation, useQuery } from "@tanstack/react-query";
import type { IParams, IPayload } from "./types";
import type { ApiResponse } from "../../core/utils/axiosClient";
import { api } from "./api";
import { queryClient } from "../../core/utils/queryClientHook";

const moduleName = "project-members";

export const useMembersQuery = {
  useGetMembers(projectId: string, params: IParams) {
    return useQuery({
      queryKey: [moduleName, "project", projectId, params],
      queryFn: async () => await api.getMembersByProject(projectId, params),
      enabled: !!projectId,
    });
  },
  useAddMember(onSuccess?: (data: ApiResponse) => void, onError?: (error: ApiResponse) => void) {
    return useMutation({
      mutationFn: async (payload: IPayload) => {
        const res = await api.addMember(payload);
        if (res.status === 201) {
          queryClient.invalidateQueries({ queryKey: [moduleName] });
          return res;
        }
        throw res;
      },
      onSuccess,
      onError,
    });
  },
  useRemoveMember(onSuccess?: (data: ApiResponse) => void, onError?: (error: ApiResponse) => void) {
    return useMutation({
      mutationFn: async (id: string) => {
        const res = await api.removeMember(id);
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