import React from 'react';
import { Task } from '../hooks/AuthContext';
import { useDrag } from 'react-dnd';
import DeletePopup from './DeletePopup';

interface TaskItemProps {
  task: Task;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
}
const TaskItem: React.FC<TaskItemProps> = ({ task, onClick, onDelete }) => {
  const [isDeletePopupOpen, setIsDeletePopupOpen] = React.useState(false);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const isFutureDate =
    task.date && new Date(task.date).getTime() < new Date().getTime();

  return (
    <div
      ref={drag}
      className="border rounded p-2 cursor-pointer hover:border-blue-300 relative"
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {isDeletePopupOpen && (
        <DeletePopup
          onConfirm={() => onDelete(task.id)}
          onCancel={() => setIsDeletePopupOpen(false)}
        />
      )}

      <div
        className="absolute right-2 top-2"
        onClick={() => setIsDeletePopupOpen(true)}
      >
        <img src="/delete.svg" width={20} />
      </div>
      <div onClick={() => onClick(task.id)}>
        <div className="font-medium mb-2">{task.title}</div>
        <div className="text-sm">{task.description}</div>
        <div
          className={`text-xs text-right ${isFutureDate ? 'text-red-500' : ''}`}
        >
          {String(task?.date)}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
