import { TodoItemProps } from "./TodoList";

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
}) => {
  // Format the due date for display
  const formatDueDate = (date: string | null) => {
    if (!date) return ""; // Changed to return empty string instead of "No date set"
    const formattedDate = new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    return `Due: ${formattedDate}`;
  };

  return (
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
      <button onClick={onDelete} className="text-red-500 hover:text-red-700">
        Delete
      </button>
    </li>
  );
};
