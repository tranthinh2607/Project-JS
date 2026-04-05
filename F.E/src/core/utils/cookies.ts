import Cookies from "js-cookie";

const kEY_ACCESS_TOKEN = "garage_flow_access_token";
const kEY_REFRESH_TOKEN = "garage_flow_refresh_token";
export const setAccessToken = (access_token: string) => {
  Cookies.set(kEY_ACCESS_TOKEN, access_token);
};

export const setRefreshToken = (refresh_token: string) => {
  Cookies.set(kEY_REFRESH_TOKEN, refresh_token);
};

export const getAccessToken = () => {
  return Cookies.get(kEY_ACCESS_TOKEN);
};
export const getRefreshToken = () => {
  return Cookies.get(kEY_REFRESH_TOKEN);
};

export const clearTokens = () => {
  Cookies.remove(kEY_ACCESS_TOKEN);
  Cookies.remove(kEY_REFRESH_TOKEN);
};
