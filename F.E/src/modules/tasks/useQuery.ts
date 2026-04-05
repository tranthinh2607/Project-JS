import { useMutation, useQuery } from "@tanstack/react-query";
import type { IParams, IPayload } from "./types";
import type { ApiResponse } from "../../core/utils/axiosClient";
import { api } from "./api";
import { queryClient } from "../../core/utils/queryClientHook";

const moduleName = "tasks";

export const useTasksQuery = {
  useGetByProject(projectId: string, params: IParams) {
    return useQuery({
      queryKey: [moduleName, "project", projectId, params],
      queryFn: async () => await api.getByProject(projectId, params),
      enabled: !!projectId,
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
  useCreate(onSuccess?: (data: ApiResponse) => void, onError?: (error: ApiResponse) => void) {
    return useMutation({
      mutationFn: async (payload: IPayload) => {
        const res = await api.create(payload);
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
  useChangeStatus(onSuccess?: (data: ApiResponse) => void, onError?: (error: ApiResponse) => void) {
    return useMutation({
      mutationFn: async ({ id, payload }: { id: string; payload: { status: string; note?: string } }) => {
        const res = await api.changeStatus(id, payload);
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
  // Assignees
  useAssign(onSuccess?: (data: ApiResponse) => void, onError?: (error: ApiResponse) => void) {
    return useMutation({
      mutationFn: async ({ taskId, userId }: { taskId: string; userId: string }) => {
        const res = await api.assign(taskId, userId);
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
  useUnassign(onSuccess?: (data: ApiResponse) => void, onError?: (error: ApiResponse) => void) {
    return useMutation({
      mutationFn: async ({ taskId, userId }: { taskId: string; userId: string }) => {
        const res = await api.unassign(taskId, userId);
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
  // Checklists
  useGetChecklists(taskId: string) {
    return useQuery({
      queryKey: [moduleName, taskId, "checklists"],
      queryFn: async () => await api.getChecklists(taskId),
      enabled: !!taskId,
    });
  },
  useAddChecklist(onSuccess?: (data: ApiResponse) => void, onError?: (error: ApiResponse) => void) {
    return useMutation({
      mutationFn: async ({ taskId, title }: { taskId: string; title: string }) => {
        const res = await api.addChecklist(taskId, title);
        if (res.status === 201 || res.status === 200) {
          queryClient.invalidateQueries({ queryKey: [moduleName] });
          return res;
        }
        throw res;
      },
      onSuccess,
      onError,
    });
  },
  useToggleChecklist(onSuccess?: (data: ApiResponse) => void, onError?: (error: ApiResponse) => void) {
    return useMutation({
      mutationFn: async ({ taskId, itemId, is_completed }: { taskId: string; itemId: string; is_completed: boolean }) => {
        const res = await api.toggleChecklist(taskId, itemId, is_completed);
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
  useDeleteChecklist(onSuccess?: (data: ApiResponse) => void, onError?: (error: ApiResponse) => void) {
    return useMutation({
      mutationFn: async ({ taskId, itemId }: { taskId: string; itemId: string }) => {
        const res = await api.deleteChecklist(taskId, itemId);
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
  // Status History
  useGetStatusHistory(taskId: string) {
    return useQuery({
      queryKey: [moduleName, taskId, "status-history"],
      queryFn: async () => await api.getStatusHistory(taskId),
      enabled: !!taskId,
    });
  },
};
