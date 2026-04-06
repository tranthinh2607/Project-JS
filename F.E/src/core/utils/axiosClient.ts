import axios, { type AxiosInstance } from "axios";
import { getAccessToken, clearTokens } from "./cookies";

// Yopos
const urlSVTaskFlow = import.meta.env.VITE_API_TASK_FLOW_URL;

const createAxiosClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL: `${baseURL}/api`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use(async (config) => {
    const accessToken = getAccessToken();
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        clearTokens();
        if (window.location.pathname !== "/token-expired" && window.location.pathname !== "/login") {
            window.location.href = "/token-expired";
        }
      }
      return error.response;
    }
  );

  return client;
};


// Export từng client
const axiosTaskFlowClient = createAxiosClient(urlSVTaskFlow);

interface ApiResponse<T = any, M = any> {
  status: number;
  data: T;
  message: string;
  errors: IErrors[];
  pagination?: IPagination;
  meta?: M;
}

interface IErrors {
  field: string;
  message: string;
  messages?: string[];
}

export interface IPagination {
  page: number;
  limit: number;
  totalRow: number;
  totalPage: number;
}

export {
  axiosTaskFlowClient,
  type ApiResponse,
};
