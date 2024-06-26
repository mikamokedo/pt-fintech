import axios, { AxiosError, AxiosResponse } from "axios";

const API_URL = `http://localhost:3000`;

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const errorHandler = (error: AxiosError) => {
  const resError = error.response;
  if (resError?.status === 401) {
    localStorage.removeItem("token");
    if (window.location.pathname === "/login") return Promise.reject(resError?.data || error.message);
    window.location.href = "/login";
  }
  return Promise.reject(resError?.data || error.message);
};

const successHandler = async (response: AxiosResponse) => {
  return response;
};

axiosInstance.interceptors.response.use(
  (response) => successHandler(response),
  (error) => errorHandler(error)
);
