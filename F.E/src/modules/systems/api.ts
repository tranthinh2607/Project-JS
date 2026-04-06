import { axiosTaskFlowClient, type ApiResponse } from "../../core/utils/axiosClient";

const moduleName = "system-configs";

export const api = {
    getByKeys: async (keys: string[]) => {
        try {
            const res = await axiosTaskFlowClient<ApiResponse>({
                method: "POST",
                url: `${moduleName}/get-by-keys`,
                data: { keys },
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    },
    update: async (data: any) => {
        try {
            const res = await axiosTaskFlowClient<ApiResponse>({
                method: "POST",
                url: `${moduleName}/update`,
                data,
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

};

export default api;