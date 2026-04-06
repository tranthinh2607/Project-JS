import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

const moduleName = "dashboard";

export const useDashboardQuery = {
  useGetStatistics(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
      queryKey: [moduleName, "statistics", params],
      queryFn: async () => {
        const res = await api.getStatistics(params);
        if (res.status === 200) {
          return res.data;
        }
        return null;
      },
    });
  },
};
