import { axiosInstance } from "./backendServices";

export const createTaskService = async (title: string, description: string, dueDate: Date) => {
  try {
    const response = await axiosInstance.post("/tasks", {
      title,
      description,
      dueDate,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getTasksService = async (query?: any) => {
  const filteredQuery = Object.fromEntries(
    Object.entries(query || {}).filter(([, value]) => value != null && value !== "")
  );

  try {
    const response = await axiosInstance.get("/tasks", {
      params: filteredQuery,
    });

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateTaskService = async (
  id: string,
  title: string,
  description: string,
  status: string,
  dueDate: Date
) => {
  try {
    const response = await axiosInstance.put(`/tasks/${id}`, {
      title,
      description,
      dueDate,
      status,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteTaskService = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getTaskByIdService = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
