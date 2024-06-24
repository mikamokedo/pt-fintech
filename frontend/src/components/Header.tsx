import React from 'react';

export interface FormTaskData {
  title: string;
  description: string;
  date: Date;
}

interface HeaderProps {
  search: string;
  setSearch: (search: string) => void;
  createTasks: (task: FormTaskData) => void;
  setIsCreateTaskModalOpen: (isOpen: boolean) => void;
}
const Header: React.FC<HeaderProps> = ({
  search,
  setSearch,
  setIsCreateTaskModalOpen,
}) => {
  return (
    <div className="flex justify-between p-5 bg-gray-100">
      <div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="username"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="task name"
        />
      </div>
      <button
        onClick={() => setIsCreateTaskModalOpen(true)}
        className="w-[200px] text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        Create new task
      </button>
    </div>
  );
};

export default Header;
