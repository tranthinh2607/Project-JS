import { axiosTaskFlowClient, type ApiResponse } from "../../core/utils/axiosClient";

const moduleName = "dashboard";

export const api = {
  getStatistics: async (params?: { startDate?: string; endDate?: string }) => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse<any>>({
        method: "GET",
        url: `${moduleName}`,
        params,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
