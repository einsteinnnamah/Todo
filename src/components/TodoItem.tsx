import { Todo } from "../hooks/useTodos";

interface TodoItemProps {
  todo: {
    id: number;
    text: string;
    completed: boolean;
    dueDate: Date;
    createdAt: Date;
  };
  onToggle: () => void;
  onDelete: () => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <li className="flex items-center justify-between p-3 bg-white rounded shadow">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
          className="h-4 w-4"
        />
        <span className={todo.completed ? "line-through text-gray-500" : ""}>
          {todo.text}
        </span>
        <span className="text-sm text-gray-500">
          Due:{" "}
          {todo.dueDate
            ? new Date(todo.dueDate).toLocaleDateString()
            : "No date set"}
        </span>
      </div>
      <button
        onClick={onDelete}
        className="px-2 py-1 text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </li>
  );
};
