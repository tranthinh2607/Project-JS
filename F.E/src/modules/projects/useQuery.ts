import { useMutation, useQuery } from "@tanstack/react-query";
import type { IParams, IProject, IMyProject, IPayload } from "./types";
import type { ApiResponse } from "../../core/utils/axiosClient";
import { api } from "./api";
import { queryClient } from "../../core/utils/queryClientHook";

const moduleName = "projects";

export const useProjectQuery = {
  useGetMyProjects(params: IParams) {
    return useQuery({
      queryKey: [moduleName, "my", params],
      queryFn: async () => await api.getMyProjects(params),
    });
  },
  useGetById(id: string) {
    return useQuery({
      queryKey: [moduleName, id],
      queryFn: async () => {
        const res = await api.getById(id);
        if (res.status === 200) {
          return res.data;
        }
        return null;
      },
      enabled: !!id,
    });
  },
  useCreate(onSuccess?: (data: ApiResponse<IProject>) => void, onError?: (error: ApiResponse) => void) {
    return useMutation({
      mutationFn: async (payload: IPayload) => {
        const res = await api.create(payload);
        if (res.status === 200 || res.status === 201) {
          queryClient.invalidateQueries({ queryKey: [moduleName] });
          return res;
        }
        throw res;
      },
      onSuccess,
      onError,
    });
  },
  useUpdate(onSuccess?: (data: ApiResponse<IProject>) => void, onError?: (error: ApiResponse) => void) {
    return useMutation({
      mutationFn: async ({ id, payload }: { id: string, payload: IPayload }) => {
        const res = await api.update(id, payload);
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
  useDelete(onSuccess?: (data: ApiResponse) => void, onError?: (error: ApiResponse) => void) {
    return useMutation({
      mutationFn: async (id: string) => {
        const res = await api.delete(id);
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