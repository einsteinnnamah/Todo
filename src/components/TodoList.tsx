"use client";

import React, { useState } from "react";
import { TodoItem } from "./TodoItem";
import { TodoFilters } from "./TodoFilters";
import { useTodos } from "@/hooks/useTodos";

export const TodoList = () => {
  const { todos, setTodos } = useTodos();
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newTodo = {
        id: Date.now(),
        text: input.trim(),
        completed: false,
        dueDate: new Date(),
        createdAt: new Date(),
      };

      setTodos([...todos, newTodo]);
      setInput("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 border rounded text-black"
          placeholder="Add a new todo..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </form>

      <TodoFilters currentFilter={filter} onFilterChange={setFilter} />

      <ul className="space-y-2">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => deleteTodo(todo.id)}
          />
        ))}
      </ul>

      <div className="mt-4 text-sm text-gray-500">
        {todos.length} total items, {todos.filter((t) => !t.completed).length}{" "}
        remaining
      </div>
    </div>
  );
};
