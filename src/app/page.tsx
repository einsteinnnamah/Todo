import { TodoList } from "@/components/TodoList";
import MobileCheck from "@/components/MobileCheck";

export default function Home(): JSX.Element {
  return (
    <MobileCheck mobileOnly>
      <TodoList />
    </MobileCheck>
  );
}
