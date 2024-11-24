import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="text-center">
        <h1 className="text-2xl font-bold">My Todo List</h1>
      </header>

      <main className="w-full max-w-md mx-auto">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Add
          </button>
        </div>

        <ul className="space-y-2">{/* Todo items will go here */}</ul>
      </main>

      <footer className="text-center text-sm text-gray-500">
        Your Tasks: 0
      </footer>
    </div>
  );
}
