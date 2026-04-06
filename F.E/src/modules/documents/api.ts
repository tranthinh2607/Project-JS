import { axiosTaskFlowClient, type ApiResponse } from "../../core/utils/axiosClient";

const moduleName = "documents";

export const documentApi = {
  getByProject: async (projectId: string, params: any): Promise<ApiResponse> => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse>({
        method: "GET",
        url: `${moduleName}/project/${projectId}`,
        params,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  upload: async (projectId: string, file: File): Promise<ApiResponse> => {
    try {
      const formData = new FormData();
      formData.append("project_id", projectId);
      formData.append("file", file);
      const res = await axiosTaskFlowClient<ApiResponse>({
        method: "POST",
        url: `${moduleName}/upload`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id: string): Promise<ApiResponse> => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse>({
        method: "DELETE",
        url: `${moduleName}/${id}`,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};
