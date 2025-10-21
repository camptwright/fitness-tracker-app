import { Targets } from "@types";

export function SettingsPage({
  targets,
  onUpdate,
  useCloud,
  onToggleCloud,
}: {
  targets: Targets;
  onUpdate: (t: Partial<Targets>) => void;
  useCloud: boolean;
  onToggleCloud: (v: boolean) => void;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card p-4 space-y-3">
        <h3 className="font-medium">Nutrition Targets (per day)</h3>
        <div className="grid grid-cols-2 gap-3">
          <LabeledNumber
            label="Calories"
            value={targets.calories}
            onChange={(v) => onUpdate({ calories: v })}
          />
          <LabeledNumber
            label="Protein (g)"
            value={targets.protein}
            onChange={(v) => onUpdate({ protein: v })}
          />
          <LabeledNumber
            label="Carbs (g)"
            value={targets.carbs}
            onChange={(v) => onUpdate({ carbs: v })}
          />
          <LabeledNumber
            label="Fat (g)"
            value={targets.fat}
            onChange={(v) => onUpdate({ fat: v })}
          />
        </div>
      </div>
      <div className="card p-4 space-y-3">
        <h3 className="font-medium">Hydration & Sync</h3>
        <LabeledNumber
          label="Water (ml)"
          value={targets.waterMl}
          onChange={(v) => onUpdate({ waterMl: v })}
        />
        <div className="flex items-center gap-2">
          <input
            id="cloud"
            type="checkbox"
            className="h-4 w-4"
            checked={useCloud}
            onChange={(e) => onToggleCloud(e.target.checked)}
          />
          <label htmlFor="cloud">Enable cloud sync (Supabase)</label>
        </div>
      </div>
    </div>
  );
}

function LabeledNumber({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        className="input"
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value || "0"))}
      />
    </div>
  );
}
