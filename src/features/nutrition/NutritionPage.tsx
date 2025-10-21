import { ListTable } from "@components/ListTable";
import { MealForm } from "@components/forms/MealForm";
import { Meal } from "@types";
import { useMemo } from "react";

export function NutritionPage({
  meals,
  onAdd,
  onDelete,
  onExport,
  onImport,
  inRange,
}: {
  meals: Meal[];
  onAdd: (m: Meal) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  inRange: (iso: string) => boolean;
}) {
  const rows = useMemo(
    () =>
      meals
        .filter((m) => inRange(m.date))
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .map((m) => [
          m.date,
          m.name,
          m.calories,
          `${m.protein} g`,
          `${m.carbs} g`,
          `${m.fat} g`,
          <button className="btn" onClick={() => onDelete(m.id)}>
            Delete
          </button>,
        ]),
    [meals, inRange, onDelete]
  );

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <MealForm onAdd={onAdd} />
      <div className="md:col-span-2 space-y-3">
        <div className="flex gap-2">
          <button className="btn" onClick={onExport}>
            Export CSV
          </button>
          <label className="btn cursor-pointer">
            Import CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => e.target.files && onImport(e.target.files[0])}
            />
          </label>
        </div>
        <ListTable
          title="Recent Meals"
          columns={["Date", "Name", "Calories", "Protein", "Carbs", "Fat", ""]}
          rows={rows}
        />
      </div>
    </div>
  );
}
