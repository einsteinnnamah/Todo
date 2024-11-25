import { TodoList } from "@/components/TodoList";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8 text-white">
        Todo App
      </h1>
      <TodoList />
    </main>
  );
}
