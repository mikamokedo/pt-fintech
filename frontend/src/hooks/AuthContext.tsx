import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
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
  date?: Date;
}

interface AuthContextProps {
  login: (username: string, task: Task[]) => void;
  logout: () => void;
  userName: string;
  tasks: Task[];
  handleUpdateTask: (task: Task) => void;
  handleCreateTask: (task: Task) => void;
  handleDeleteTask: (task: string) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  login: () => {},
  logout: () => {},
  userName: '',
  tasks: [],
  handleUpdateTask: () => {},
  handleCreateTask: () => {},
  handleDeleteTask: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userName, setUserName] = useState<string>('');
  const navigate = useNavigate();

  const login = (username: string, tasks: Task[]) => {
    setUserName(username);
    setTasks(tasks);
    localStorage.setItem('user', JSON.stringify(username));
  };

  const logout = () => {
    setUserName('');
    setTasks([]);
    localStorage.removeItem('user');
  };

  const handleUpdateTask = (task: Task) => {
    const newTasks = tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      }
      return t;
    });
    setTasks(newTasks);
    const localStorageUSers = localStorage.getItem('users');
    if (localStorageUSers) {
      const users = JSON.parse(localStorageUSers);

      const newUsers = users.map((user: User) => {
        if (user.username === userName) {
          return { ...user, tasks: newTasks };
        }
        return user;
      });
      localStorage.setItem('users', JSON.stringify(newUsers));
    }
  };

  const handleCreateTask = (task: Task) => {
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    const localStorageUSers = localStorage.getItem('users');
    if (localStorageUSers) {
      const users = JSON.parse(localStorageUSers);

      const newUsers = users.map((user: User) => {
        if (user.username === userName) {
          return { ...user, tasks: newTasks };
        }
        return user;
      });
      localStorage.setItem('users', JSON.stringify(newUsers));
    }
  };

  const handleDeleteTask = (id: string) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    const localStorageUSers = localStorage.getItem('users');
    if (localStorageUSers) {
      const users = JSON.parse(localStorageUSers);

      const newUsers = users.map((user: User) => {
        if (user.username === userName) {
          return { ...user, tasks: newTasks };
        }
        return user;
      });
      localStorage.setItem('users', JSON.stringify(newUsers));
    }
  };

  useEffect(() => {
    const localStorageUSers = localStorage.getItem('users');
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      setUserName(JSON.parse(currentUser));
      if (localStorageUSers) {
        const users = JSON.parse(localStorageUSers);
        const user = users.find(
          (user: User) => user.username === JSON.parse(currentUser)
        );
        if (user) {
          setTasks(user.tasks);
        }
        navigate('/');
      }
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userName,
        login,
        logout,
        tasks,
        handleUpdateTask,
        handleCreateTask,
        handleDeleteTask,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
