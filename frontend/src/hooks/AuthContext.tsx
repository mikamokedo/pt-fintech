import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../services/backendServices";
import { getProfileService } from "../services/auth.services";
import Loading from "../components/Loading";

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface User {
  username: string;
  password: string;
  tasks: Task[];
}

export interface Task {
  title: string;
  description: string;
  status: TaskStatus;
  id: string;
  dueDate: Date;
}

interface AuthContextProps {
  login: (user: User) => void;
  logout: () => void;
  currentUser: User | null;
}

export const AuthContext = createContext<AuthContextProps>({
  login: () => {},
  logout: () => {},
  currentUser: null,
});

export interface User {
  username: string;
  email: string;
  role: string;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const login = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      navigate("/login");
      return;
    }
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    getProfileService()
      .then((user) => {
        setIsLoading(false);
        setUser(user);
        navigate("/");
      })
      .catch(() => {
        setIsLoading(false);
        navigate("/login");
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
      }}
    >
      {isLoading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
