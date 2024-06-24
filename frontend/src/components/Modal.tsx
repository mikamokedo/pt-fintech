import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FormTaskData } from './Header';

interface ModalProps {
  errors: FieldErrors<FormTaskData>;
  handleSubmit: () => void;
  register: UseFormRegister<FormTaskData>;
  handleClose: () => void;
}
const Modal: React.FC<ModalProps> = ({
  errors,
  register,
  handleSubmit,
  handleClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.3)]">
      <div className="bg-gray-200 rounded-lg p-8 w-1/2 relative">
        <button
          onClick={handleClose}
          className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 mt-4 absolute top-[10px] right-[20px]"
        >
          X
        </button>
        <h2 className="text-lg font-bold mb-10 text-center">Task</h2>
        <div className="flex flex-col">
          <input
            className="border border-gray-300 rounded-lg p-2"
            placeholder="Title"
            {...register('title', { required: true })}
          />
          {errors.title && (
            <span className="text-red-500 text-sm">Title is required</span>
          )}
          <textarea
            {...register('description', { required: true })}
            className="border border-gray-300 rounded-lg p-2 mt-4"
            placeholder="Description"
          />
          {errors.description && (
            <span className="text-red-500 text-sm">
              Description is required
            </span>
          )}
          <input
            {...register('date', { required: false })}
            type="date"
            className="border border-gray-300 rounded-lg p-2 mt-4 mb-4"
            placeholder="Title"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
