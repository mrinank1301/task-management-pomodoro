import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "@shared/schema";
import { Search, SlidersHorizontal } from "lucide-react";

interface TaskFiltersProps {
  tasks: Task[];
  onFilterChange: (filtered: Task[]) => void;
}

export function TaskFilters({ tasks, onFilterChange }: TaskFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Get unique categories from all tasks
  const allCategories = Array.from(
    new Set(tasks.flatMap((task) => task.categories))
  );

  const applyFilters = () => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((task) =>
        task.categories.some((category) => selectedCategories.includes(category))
      );
    }

    onFilterChange(filtered);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Apply filters whenever any filter changes
  useState(() => {
    applyFilters();
  }, [searchQuery, priorityFilter, selectedCategories]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="high">High priority</SelectItem>
            <SelectItem value="medium">Medium priority</SelectItem>
            <SelectItem value="low">Low priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {allCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
