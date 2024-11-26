"use client";

import React, { useState, useEffect } from "react";
import { TodoItem } from "./TodoItem";
import { TodoFilters } from "./TodoFilters";
import {
  Todo,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  testConnection,
} from "../lib/todoService";

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [dueDate, setDueDate] = useState<string>(
    new Date().toISOString().split("T")[0] + "T00:00"
  );
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Load todos
  useEffect(() => {
    const loadTodos = async () => {
      const data = await getTodos();
      setTodos(data);
    };
    loadTodos();
  }, []);

  // Add this useEffect to test connection on component mount
  useEffect(() => {
    testConnection().then((result) => {
      console.log("Initial connection test:", result);
    });
  }, []);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!input.trim()) return;

      // Ensure the date includes time
      const dateWithTime = dueDate.includes("T")
        ? dueDate
        : `${dueDate}T00:00:00`;

      const newTodo = await createTodo(input.trim(), dateWithTime);
      setTodos((prevTodos) => [newTodo, ...prevTodos]);
      setInput("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create todo");
    }
  };
  const toggleTodo = async (todo: Todo) => {
    if (!todo.id) return;
    const updated = await updateTodo(todo.id, { completed: !todo.completed });
    setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
  };

  const removeTodo = async (id: string) => {
    await deleteTodo(id);
    setTodos(todos.filter((t) => t.id !== id));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = dueDate.split("T")[0];
    setDueDate(`${date}T${e.target.value}`);
  };

  const handleAMPMChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [date, time] = dueDate.split("T");
    if (!time) return;

    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours);

    if (e.target.value === "AM") {
      hour = hour === 12 ? 0 : hour;
    } else {
      hour = hour === 12 ? 12 : hour + 12;
    }

    const formattedTime = `${hour.toString().padStart(2, "0")}:${minutes}`;
    setDueDate(`${date}T${formattedTime}`);
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
              value={dueDate.split("T")[0]}
              onChange={(e) => setDueDate(`${e.target.value}T00:00`)}
              className="px-4 py-2 border rounded text-black flex-1"
            />
            <input
              type="time"
              value={dueDate.split("T")[1] || "00:00"}
              onChange={handleTimeChange}
              className="px-4 py-2 border rounded text-black"
            />
            <select
              className="px-2 py-2 border rounded text-black"
              onChange={handleAMPMChange}
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
            todo={{
              ...todo,
              due_date: todo.due_date || null,
            }}
            onToggle={() => toggleTodo(todo)}
            onDelete={() => removeTodo(todo.id!)}
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
