import { TodoItemProps } from "./TodoList";
import { useState } from "react";

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    onDelete();
    setShowDeleteModal(false);
  };

  const formatDueDate = (date: string | null) => {
    if (!date) return "";
    const formattedDate = new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    return `Due: ${formattedDate}`;
  };

  return (
    <>
      <li className="flex items-center justify-between p-4 bg-white rounded shadow">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={onToggle}
            className="w-5 h-5"
          />
          <span className={todo.completed ? "line-through text-gray-500" : ""}>
            {todo.task}
          </span>
          {todo.due_date && (
            <span className="text-sm text-gray-500">
              {formatDueDate(todo.due_date)}
            </span>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </li>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this task?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
