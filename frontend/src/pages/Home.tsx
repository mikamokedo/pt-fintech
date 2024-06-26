import React, { useEffect, useState } from "react";
import Board from "../components/Board";
import { Task, TaskStatus, useAuthContext } from "../hooks/AuthContext";
import Header, { FormTaskData } from "../components/Header";
import useDebounce from "../hooks/useDebounce";
import { useForm } from "react-hook-form";
import Modal from "../components/Modal";
import { getTasksService, createTaskService, updateTaskService, deleteTaskService } from "../services/tasks.services";

const boards = [
  { name: "Todo", id: TaskStatus.TODO, color: "bg-gray-300" },
  { name: "In Progress", id: TaskStatus.IN_PROGRESS, color: "bg-yellow-300" },
  { name: "Completed", id: TaskStatus.COMPLETED, color: "bg-green-300" },
];

const Home = () => {
  const { currentUser } = useAuthContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = React.useState("");
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const filterDebounce = useDebounce(search, 300);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormTaskData>();

  const onSubmit = (data: FormTaskData) => {
    createTasks(data);
    reset();
    setIsCreateTaskModalOpen(false);
  };
  const createTasks = (data: FormTaskData) => {
    if (editId) {
      const item = tasks.find((task) => task.id === editId);
      if (item) {
        updateTaskService(editId, data.title, data.description, item.status, data.dueDate).then((data) => {
          setTasks((t) => t.map((task) => (task.id === editId ? data : task)));
        });
      }
    } else {
      createTaskService(data.title, data.description, data.dueDate).then((data) => {
        setTasks([data, ...tasks]);
      });
    }

    setEditId(null);
    reset({
      title: "",
      description: "",
      dueDate: new Date(),
    });
  };

  const handleDelete = (id: string) => {
    deleteTaskService(id).then(() => {
      setTasks((t) => t.filter((task) => task.id !== id));
    });
  };

  const handleEditTask = (id: string) => {
    setEditId(id);
    setIsCreateTaskModalOpen(true);
    const item = tasks.find((task) => task.id === id);
    if (item) {
      reset({
        title: item.title,
        description: item.description,
        dueDate: item.dueDate,
      });
    }
  };
  const handleClose = () => {
    setIsCreateTaskModalOpen(false);
    setEditId(null);
    reset({
      title: "",
      description: "",
      dueDate: new Date(),
    });
  };

  const handleDragTask = (task: { id: string; status: TaskStatus }) => {
    const item = tasks.find((t) => t.id === task.id);
    if (item) {
      updateTaskService(task.id, item.title, item.description, task.status, item.dueDate).then((data) => {
        setTasks((t) => t.map((t) => (t.id === task.id ? data : t)));
      });
    }
  };

  useEffect(() => {
    const fetchTask = () =>
      getTasksService({
        title: filterDebounce,
      }).then((data) => {
        setTasks(data);
      });
    fetchTask();
  }, [filterDebounce]);

  return (
    <div className="px-3">
      {isCreateTaskModalOpen && (
        <Modal errors={errors} handleSubmit={handleSubmit(onSubmit)} register={register} handleClose={handleClose} />
      )}
      <Header
        search={search}
        setSearch={setSearch}
        createTasks={createTasks}
        setIsCreateTaskModalOpen={setIsCreateTaskModalOpen}
        currentUser={currentUser}
      />
      <div className="flex justify-center gap-5 py-10">
        {boards.map((board) => (
          <Board
            name={board.name}
            tasks={tasks.filter((t) => t.status === board.id)}
            key={board.id}
            color={board.color}
            setEditId={handleEditTask}
            id={board.id}
            onDelete={handleDelete}
            handleDragTask={handleDragTask}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
