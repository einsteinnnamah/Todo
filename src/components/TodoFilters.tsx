type FilterType = "all" | "active" | "completed";

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const TodoFilters = ({
  currentFilter,
  onFilterChange,
}: TodoFiltersProps) => {
  return (
    <div className="flex gap-4 mb-4">
      <button
        className={`px-3 py-1 rounded ${
          currentFilter === "all"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-black"
        }`}
        onClick={() => onFilterChange("all")}
      >
        All
      </button>
      <button
        className={`px-3 py-1 rounded ${
          currentFilter === "active"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-black"
        }`}
        onClick={() => onFilterChange("active")}
      >
        Active
      </button>
      <button
        className={`px-3 py-1 rounded ${
          currentFilter === "completed"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-black"
        }`}
        onClick={() => onFilterChange("completed")}
      >
        Completed
      </button>
    </div>
  );
};
