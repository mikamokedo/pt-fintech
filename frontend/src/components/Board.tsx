import React from 'react';
import { Task, TaskStatus, useAuthContext } from '../hooks/AuthContext';
import TaskItem from './TaskItem';
import { useDrop } from 'react-dnd';
interface BoardProps {
  name: string;
  tasks: Task[];
  color: string;
  setEditId: (id: string) => void;
  id: TaskStatus;
  onDelete: (id: string) => void;
}

const Board: React.FC<BoardProps> = ({
  name,
  tasks,
  color,
  setEditId,
  id,
  onDelete,
}) => {
  const { handleUpdateTask, tasks: taskList } = useAuthContext();
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'task',
      drop: (item: Task) => {
        const task = taskList.find((t) => t.id === item.id);
        if (task) {
          handleUpdateTask({
            ...task,
            status: id,
          });
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [taskList, id]
  );

  return (
    <div
      ref={drop}
      className={`rounded-md w-1/4 border ${isOver ? 'bg-red-200' : ''}`}
    >
      <div
        className={`mb-3 border-b text-center text-xl py-3 font-bold ${color}`}
      >
        {name}
      </div>
      <div className="p-3 gap-3 flex flex-col">
        {tasks.map((task) => (
          <TaskItem
            task={task}
            key={task.id}
            onClick={setEditId}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
