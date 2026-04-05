import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from './api';
import type {
  ILoginPayload,
  IRegisterPayload,
} from './types';
import type { ApiResponse } from '../../core/utils/axiosClient';

export const useAuthQuery = {
  useLogin(onSuccess?: (data: ApiResponse) => void, onError?: (error: ApiResponse) => void) {
    return useMutation({
      mutationFn: async (payload: ILoginPayload) => {
        const res = await api.login(payload);
        if (res.status === 200) return res;
        throw res;
      },
      onSuccess,
      onError,
    });
  },
  useRegister(onSuccess?: (data: ApiResponse) => void, onError?: (error: ApiResponse) => void) {
    return useMutation({
      mutationFn: async (payload: IRegisterPayload) => {
        const res = await api.register(payload);
        if (res.status === 200 || res.status === 201) return res;
        throw res;
      },
      onSuccess,
      onError,
    });
  },
  useProfile() {
    return useQuery({
      queryKey: ['profile'],
      queryFn: async () => {
        const res = await api.profile();
        if (res.status === 200) return res.data;
        throw res.data;
      },
    });
  },

};
