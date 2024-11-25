export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: Date;
  createdAt: Date;
}

export interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}