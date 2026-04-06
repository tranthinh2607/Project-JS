import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentApi } from "./api";
import { type ApiResponse } from "../../core/utils/axiosClient";

export const useDocumentQuery = {
  useGetByProject: (projectId: string, params: any) => {
    return useQuery({
      queryKey: ["documents", projectId, params],
      queryFn: () => documentApi.getByProject(projectId, params),
      enabled: !!projectId,
    });
  },

  useUpload: (onSuccess?: (res: ApiResponse) => void, onError?: (error: any) => void) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ projectId, file }: { projectId: string; file: File }) =>
        documentApi.upload(projectId, file),
      onSuccess: (res, variables) => {
        queryClient.invalidateQueries({ queryKey: ["documents", variables.projectId] });
        onSuccess?.(res);
      },
      onError,
    });
  },

  useDelete: (projectId: string, onSuccess?: (res: ApiResponse) => void, onError?: (error: any) => void) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => documentApi.delete(id),
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
        onSuccess?.(res);
      },
      onError,
    });
  },
};
