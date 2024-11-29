export interface Todo {
  id: string;
  task: string;
  completed: boolean;
  due_date?: string;
  created_at: string;
  user_id: string;
}

export interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}