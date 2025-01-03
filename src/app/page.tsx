"use client";
import { Auth } from "@/components/Auth";
import { TodoList } from "@/components/TodoList";
import MobileCheck from "@/components/MobileCheck";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <MobileCheck mobileOnly>{!user ? <Auth /> : <TodoList />}</MobileCheck>
  );
}
