import { Search } from "lucide-react";
import { categories } from "../data/categories";
import type { CategoryId, Difficulty } from "../types";
import { cn } from "../lib/utils";
import { Select } from "./ui";

export type DifficultyFilter = Difficulty | "all";

interface FilterBarProps {
  query: string;
  onQuery: (value: string) => void;
  category: CategoryId | null;
  onCategory: (value: CategoryId | null) => void;
  difficulty: DifficultyFilter;
  onDifficulty: (value: DifficultyFilter) => void;
  searchLabel: string;
  searchPlaceholder: string;
}

export function FilterBar({
  query,
  onQuery,
  category,
  onCategory,
  difficulty,
  onDifficulty,
  searchLabel,
  searchPlaceholder,
}: FilterBarProps) {
  const chip = (active: boolean) =>
    cn(
      "min-h-[48px] rounded-full border-2 px-5 font-medium transition-colors",
      active ? "border-primary-dark bg-primary-dark text-white" : "border-ink/20 bg-white text-ink hover:border-primary",
    );

  return (
    <div className="flex flex-col gap-6 rounded-card border border-secondary bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-2">
        <label htmlFor="search" className="font-medium">
          {searchLabel}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/60" aria-hidden="true" />
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="min-h-[48px] w-full rounded-xl border-2 border-ink/20 bg-white py-3 pl-12 pr-4 text-base outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <p className="mb-3 font-medium" id="category-filter-label">Catégorie</p>
        <div role="group" aria-labelledby="category-filter-label" className="flex flex-wrap gap-2">
          <button type="button" className={chip(category === null)} aria-pressed={category === null} onClick={() => onCategory(null)}>
            Tous
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={chip(category === c.id)}
              aria-pressed={category === c.id}
              onClick={() => onCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-xs">
        <Select
          id="difficulty-filter"
          label="Niveau de difficulté"
          value={difficulty}
          onChange={(e) => onDifficulty(e.target.value as DifficultyFilter)}
          options={[
            { value: "all", label: "Tous les niveaux" },
            { value: "beginner", label: "Débutant" },
            { value: "intermediate", label: "Intermédiaire" },
            { value: "advanced", label: "Avancé" },
          ]}
        />
      </div>
    </div>
  );
}
