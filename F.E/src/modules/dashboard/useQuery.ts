import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

const moduleName = "dashboard";

export const useDashboardQuery = {
  useGetStatistics() {
    return useQuery({
      queryKey: [moduleName, "statistics"],
      queryFn: async () => {
        const res = await api.getStatistics();
        if (res.status === 200) {
          return res.data;
        }
        return null;
      },
    });
  },
};
