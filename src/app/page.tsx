"use client";
import { TodoList } from "@/components/TodoList";
import { Auth } from "@/components/Auth";
import { useAuth } from "@/contexts/AuthContext";
import { TestNotification } from "@/components/TestNotification";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="container mx-auto p-4 max-w-md">
      {!user ? (
        <Auth />
      ) : (
        <>
          <TodoList />
          <div className="mt-4">
            <TestNotification />
          </div>
        </>
      )}
    </main>
  );
}
