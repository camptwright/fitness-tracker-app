import { useState } from "react";
import { Meal } from "@types";
import { todayISO, uid } from "@lib/storage";
import { Plus } from "lucide-react";

export function MealForm({ onAdd }: { onAdd: (m: Meal) => void }) {
  const [date, setDate] = useState(todayISO());
  const [name, setName] = useState("");
  const [calories, setCalories] = useState(600);
  const [protein, setProtein] = useState(40);
  const [carbs, setCarbs] = useState(60);
  const [fat, setFat] = useState(20);

  const submit = () => {
    if (!date || !name) return;
    onAdd({
      id: uid(),
      date,
      name,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
    });
  };

  return (
    <div className="card p-4 space-y-3">
      <h3 className="font-medium">Log Meal</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Date</label>
          <input
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm">Name</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Chicken bowl"
          />
        </div>
        <div>
          <label className="text-sm">Calories</label>
          <input
            className="input"
            type="number"
            value={calories}
            onChange={(e) => setCalories(parseInt(e.target.value || "0"))}
          />
        </div>
        <div>
          <label className="text-sm">Protein (g)</label>
          <input
            className="input"
            type="number"
            value={protein}
            onChange={(e) => setProtein(parseInt(e.target.value || "0"))}
          />
        </div>
        <div>
          <label className="text-sm">Carbs (g)</label>
          <input
            className="input"
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(parseInt(e.target.value || "0"))}
          />
        </div>
        <div>
          <label className="text-sm">Fat (g)</label>
          <input
            className="input"
            type="number"
            value={fat}
            onChange={(e) => setFat(parseInt(e.target.value || "0"))}
          />
        </div>
      </div>
      <button className="btn w-full" onClick={submit}>
        <Plus size={16} />
        Add Meal
      </button>
    </div>
  );
}
