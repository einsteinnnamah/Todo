"use client";

import React, { useState } from "react";
import { TodoItem } from "./TodoItem";
import { TodoFilters } from "./TodoFilters";
import { useTodos } from "@/hooks/useTodos";

export const TodoList = () => {
  const { todos, setTodos } = useTodos();
  const [input, setInput] = useState("");
  const [dueDate, setDueDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
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
        dueDate: new Date(dueDate),
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
      <form onSubmit={addTodo} className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-4 py-2 border rounded text-black"
          placeholder="Add a new todo..."
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white">
            Select Due Date and Time:
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-4 py-2 border rounded text-black flex-1"
            />
            <input
              type="time"
              onChange={(e) => {
                const time = e.target.value;
                const [hours, minutes] = time.split(":");
                const formattedTime = `${hours}:${minutes}`;
                setDueDate(`${dueDate}T${formattedTime}`);
              }}
              className="px-4 py-2 border rounded text-black"
            />
            <select
              className="px-2 py-2 border rounded text-black"
              onChange={(e) => {
                const time = dueDate.split("T")[1];
                if (!time) return;

                const [hours, minutes] = time.split(":");
                let hour = parseInt(hours);

                if (e.target.value === "AM") {
                  if (hour === 12) hour = 0;
                } else if (e.target.value === "PM") {
                  if (hour !== 12) hour += 12;
                }

                const formattedTime = `${hour}:${minutes}`;
                setDueDate(`${dueDate.split("T")[0]}T${formattedTime}`);
              }}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
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
