import { axiosInstance } from "./backendServices";

export const loginService = async (username: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/signing", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const registerService = async (username: string, password: string, email: string, role: string) => {
  try {
    const response = await axiosInstance.post("/auth/signup", {
      username,
      password,
      email,
      role,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getProfileService = async () => {
  try {
    const response = await axiosInstance.get("/auth/profile");
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
