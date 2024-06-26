import React, { useState } from "react";
import { Task, TaskStatus } from "../hooks/AuthContext";
import TaskItem from "./TaskItem";
import { useDrop } from "react-dnd";
interface BoardProps {
  name: string;
  tasks: Task[];
  color: string;
  setEditId: (id: string) => void;
  id: TaskStatus;
  onDelete: (id: string) => void;
  handleDragTask: (task: { id: string; status: TaskStatus }) => void;
}

const Board: React.FC<BoardProps> = ({ name, tasks, color, setEditId, id, onDelete, handleDragTask }) => {
  const [sortType, setSortType] = useState("asc");

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "task",
      drop: (item: Task) => {
        handleDragTask({ id: item.id, status: id });
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [tasks, id]
  );

  return (
    <div ref={drop} className={`relative rounded-md w-1/4 border ${isOver ? "bg-red-200" : ""}`}>
      <div className={`mb-3 border-b text-center text-xl py-3 font-bold ${color}`}>{name}</div>
      <div className="absolute right-2 top-4 w-[20px] h-[20px]">
        <button className="triangle-up" onClick={() => setSortType("asc")} />
        <button className="triangle-down" onClick={() => setSortType("dsc")} />
      </div>
      <div className="p-3 gap-3 flex flex-col">
        {tasks
          .sort((a, b) => {
            if (sortType === "asc") {
              return new Date(a.dueDate).getTime() < new Date(b.dueDate).getTime() ? -1 : 1;
            } else {
              return new Date(a.dueDate).getTime() > new Date(b.dueDate).getTime() ? -1 : 1;
            }
          })
          .map((task) => (
            <TaskItem task={task} key={task.id} onClick={setEditId} onDelete={onDelete} />
          ))}
      </div>
    </div>
  );
};

export default Board;
