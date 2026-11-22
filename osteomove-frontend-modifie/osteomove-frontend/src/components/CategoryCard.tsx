import { Link } from "react-router-dom";
import type { CategoryInfo } from "../data/categories";
import { Card } from "./ui";

export function CategoryCard({ category }: { category: CategoryInfo }) {
  const Icon = category.icon;
  return (
    <Link to={`/exercises?category=${category.id}`} className="block rounded-card focus-visible:rounded-card">
      <Card className="h-full transition-colors hover:border-primary">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary-dark">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <h3 className="mb-2 text-xl font-semibold">{category.label}</h3>
        <p className="text-ink/80">{category.description}</p>
      </Card>
    </Link>
  );
}
