import { axiosTaskFlowClient, type ApiResponse } from "../../core/utils/axiosClient";
import type { IMember, IParams, IPayload } from "./types";

const moduleName = "project-members";

export const api = {
  getMembersByProject: async (projectId: string, params: IParams) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse<IMember[]>>({
        method: "GET",
        url: `${moduleName}/project/${projectId}`,
        params,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  addMember: async (payload: IPayload) => {
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
  removeMember: async (id: string) => {
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

export default api;