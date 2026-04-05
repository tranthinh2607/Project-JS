import { axiosTaskFlowClient, type ApiResponse } from "../../core/utils/axiosClient";
import type { IProject, IMyProject, IParams, IPayload } from "./types";

const moduleName = "projects";

export const api = {
  getMyProjects: async (params: IParams) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse<IMyProject[]>>({
        method: "GET",
        url: `${moduleName}/my`,
        params,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  getById: async (id: string) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse<IProject>>({
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
      const res = await axiosTaskFlowClient<ApiResponse<IProject>>({
        method: "POST",
        url: `${moduleName}`,
        data: payload,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (id: string, payload: IPayload) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse<IProject>>({
        method: "PATCH",
        url: `${moduleName}/${id}`,
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
};

export default api;