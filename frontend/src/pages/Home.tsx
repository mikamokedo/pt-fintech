import React, { useEffect, useState } from "react";
import Board from "../components/Board";
import { Task, TaskStatus, useAuthContext } from "../hooks/AuthContext";
import Header, { FormTaskData } from "../components/Header";
import useDebounce from "../hooks/useDebounce";
import { useForm } from "react-hook-form";
import Modal from "../components/Modal";

const boards = [
  { name: "Todo", id: TaskStatus.TODO, color: "bg-gray-300" },
  { name: "In Progress", id: TaskStatus.IN_PROGRESS, color: "bg-yellow-300" },
  { name: "Done", id: TaskStatus.DONE, color: "bg-green-300" },
];

const Home = () => {
  const { tasks, handleCreateTask, handleUpdateTask, handleDeleteTask } =
    useAuthContext();
  const [filteredTasks, setFilteredTasks] = React.useState<Task[]>([]);
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
      const item = filteredTasks.find((task) => task.id === editId);
      if (item) {
        handleUpdateTask({
          ...item,
          ...data,
        });
      }
    } else {
      handleCreateTask({
        ...data,
        status: TaskStatus.TODO,
        id: new Date().getTime().toString(),
      });
    }

    setEditId(null);
    reset({
      title: "",
      description: "",
      date: new Date(),
    });
  };

  useEffect(() => {
    setFilteredTasks(
      tasks.filter((task) => {
        return task.title.toLowerCase().includes(filterDebounce.toLowerCase());
      })
    );
  }, [filterDebounce, tasks]);

  const handleEditTask = (id: string) => {
    setEditId(id);
    setIsCreateTaskModalOpen(true);
    const item = filteredTasks.find((task) => task.id === id);
    if (item) {
      reset({
        title: item.title,
        description: item.description,
        date: item.date,
      });
    }
  };
  const handleClose = () => {
    setIsCreateTaskModalOpen(false);
    setEditId(null);
    reset({
      title: "",
      description: "",
      date: new Date(),
    });
  };

  return (
    <div className="px-3">
      {isCreateTaskModalOpen && (
        <Modal
          errors={errors}
          handleSubmit={handleSubmit(onSubmit)}
          register={register}
          handleClose={handleClose}
        />
      )}
      <Header
        search={search}
        setSearch={setSearch}
        createTasks={createTasks}
        setIsCreateTaskModalOpen={setIsCreateTaskModalOpen}
      />
      <div className="flex justify-center gap-5 py-10">
        {boards.map((board) => (
          <Board
            name={board.name}
            tasks={filteredTasks.filter((task) => task.status === board.id)}
            key={board.id}
            color={board.color}
            setEditId={handleEditTask}
            id={board.id}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
