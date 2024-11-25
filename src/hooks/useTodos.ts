import { useState, useEffect } from 'react';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('todos');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  return { todos, setTodos };
} 