import { axiosTaskFlowClient, type ApiResponse } from "../../core/utils/axiosClient";
import type { ITask, IParams, IPayload, IChecklistItem, IStatusHistory } from "./types";

const moduleName = "tasks";

export const api = {
  getByProject: async (projectId: string, params: IParams) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse<ITask[]>>({
        method: "GET",
        url: `${moduleName}/project/${projectId}`,
        params,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  getAll: async (params: IParams) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse<ITask[]>>({
        method: "GET",
        url: `${moduleName}`,
        params,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  getById: async (id: string) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse<ITask>>({
        method: "GET",
        url: `${moduleName}/${id}`,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (payload: IPayload) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse>({
        method: "POST",
        url: `${moduleName}`,
        data: payload,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  changeStatus: async (id: string, payload: { status: string; note?: string }) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse>({
        method: "POST",
        url: `${moduleName}/${id}/status`,
        data: payload,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  delete: async (id: string) => {
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
  // Assignees
  assign: async (taskId: string, userIds: string | string[]) => {
    try {
      const payload = Array.isArray(userIds) ? { user_ids: userIds } : { user_id: userIds };
      const res = await axiosTaskFlowClient<ApiResponse>({
        method: "POST",
        url: `${moduleName}/${taskId}/assign`,
        data: payload,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  unassign: async (taskId: string, userId: string) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse>({
        method: "DELETE",
        url: `${moduleName}/${taskId}/assign/${userId}`,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  // Checklists
  getChecklists: async (taskId: string) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse<IChecklistItem[]>>({
        method: "GET",
        url: `${moduleName}/${taskId}/checklists`,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  addChecklist: async (taskId: string, title: string) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse>({
        method: "POST",
        url: `${moduleName}/${taskId}/checklists`,
        data: { title },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  toggleChecklist: async (taskId: string, itemId: string, is_completed: boolean) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse>({
        method: "PATCH",
        url: `${moduleName}/${taskId}/checklists/${itemId}`,
        data: { is_completed },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  deleteChecklist: async (taskId: string, itemId: string) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse>({
        method: "DELETE",
        url: `${moduleName}/${taskId}/checklists/${itemId}`,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  // Status History
  getStatusHistory: async (taskId: string) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse<IStatusHistory[]>>({
        method: "GET",
        url: `${moduleName}/${taskId}/status-history`,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  // Comments
  getComments: async (taskId: string) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse<any[]>>({
        method: "GET",
        url: `${moduleName}/${taskId}/comments`,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  addComment: async (taskId: string, content: string) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse<any>>({
        method: "POST",
        url: `${moduleName}/${taskId}/comments`,
        data: { content },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  deleteComment: async (commentId: string) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse<any>>({
        method: "DELETE",
        url: `${moduleName}/comments/${commentId}`,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
