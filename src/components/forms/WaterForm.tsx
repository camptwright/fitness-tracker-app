import { useState } from "react";
import { WaterLog } from "@types";
import { todayISO, uid } from "@lib/storage";
import { Plus } from "lucide-react";

export function WaterForm({ onAdd }: { onAdd: (h: WaterLog) => void }) {
  const [date, setDate] = useState(todayISO());
  const [ml, setMl] = useState(500);
  const submit = () => {
    if (!date || !ml) return;
    onAdd({ id: uid(), date, ml: Number(ml) });
  };
  return (
    <div className="card p-4 space-y-3">
      <h3 className="font-medium">Log Water</h3>
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
          <label className="text-sm">Amount (ml)</label>
          <input
            className="input"
            type="number"
            value={ml}
            onChange={(e) => setMl(parseInt(e.target.value || "0"))}
          />
        </div>
      </div>
      <button className="btn w-full" onClick={submit}>
        <Plus size={16} />
        Add Water
      </button>
    </div>
  );
}
