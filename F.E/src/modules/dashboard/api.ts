import { axiosTaskFlowClient, type ApiResponse } from "../../core/utils/axiosClient";
import type { IDashboardStatistics } from "./types";

const moduleName = "dashboard";

export const api = {
  getStatistics: async () => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse<IDashboardStatistics>>({
        method: "GET",
        url: `${moduleName}/statistics`,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
