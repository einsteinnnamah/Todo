"use client";

import React, { useState, useEffect } from "react";
import { TodoItem } from "./TodoItem";
import { TodoFilters } from "./TodoFilters";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

// Define the correct Todo interface matching your Supabase schema
interface Todo {
  id: string;
  task: string;
  completed: boolean;
  user_id: string;
  due_date: string | null;
  created_at: string;
}

// Update the interface to be exported
export interface TodoItemProps {
  todo: {
    task: string;
    completed: boolean;
    due_date: string | null;
  };
  onToggle: () => void;
  onDelete: () => void;
}

export const TodoList = () => {
  const { signOut, user } = useAuth();
  const firstName = user?.user_metadata?.first_name || "there";
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [dueDate, setDueDate] = useState<string>(
    new Date().toISOString().split("T")[0] + "T00:00"
  );
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Load todos
  useEffect(() => {
    const loadTodos = async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching todos:", error);
        return;
      }
      setTodos(data || []);
    };
    if (user) {
      loadTodos();
    }
  }, [user]);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!input.trim() || !user) return;

      // Ensure the date includes time
      const dateWithTime = dueDate.includes("T")
        ? dueDate
        : `${dueDate}T00:00:00`;

      const { data, error } = await supabase
        .from("todos")
        .insert([
          {
            task: input.trim(),
            user_id: user.id,
            due_date: dateWithTime,
            completed: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setTodos((prevTodos) => [data, ...prevTodos]);
      setInput("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create todo");
    }
  };

  const toggleTodo = async (todo: Todo) => {
    if (!todo.id || !user) return;
    const { data: updated, error } = await supabase
      .from("todos")
      .update({ completed: !todo.completed })
      .eq("id", todo.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
  };

  const removeTodo = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Hello, {firstName}! 👋
        </h1>
        <p className="text-white">What&apos;s on your mind today?</p>
      </div>

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
              task: todo.task,
              completed: todo.completed,
              due_date: todo.due_date,
            }}
            onToggle={() => toggleTodo(todo)}
            onDelete={() => removeTodo(todo.id)}
          />
        ))}
      </ul>

      <div className="mt-4 text-sm text-gray-500">
        {todos.length} total items, {todos.filter((t) => !t.completed).length}{" "}
        remaining
      </div>

      <div className="fixed bottom-4 left-0 right-0 px-4">
        <button
          onClick={signOut}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
