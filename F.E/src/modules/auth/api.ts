import { axiosTaskFlowClient, type ApiResponse } from '../../core/utils/axiosClient';
import type {
  ILoginPayload,
  IRegisterPayload,
} from './types';

const moduleName = 'auth';

export const api = {
  login: async (payload: ILoginPayload): Promise<ApiResponse> => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse>({
        method: 'POST',
        url: `${moduleName}/login`,
        data: payload,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (payload: IRegisterPayload): Promise<ApiResponse> => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse>({
        method: 'POST',
        url: `${moduleName}/register`,
        data: payload,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  profile: async (): Promise<ApiResponse> => {
    try {
      const res = await axiosTaskFlowClient<ApiResponse>({
        method: 'GET',
        url: `${moduleName}/profile`,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  }
};
