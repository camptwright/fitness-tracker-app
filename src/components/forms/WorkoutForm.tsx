import { useState } from "react";
import { Exercise, SetEntry, Workout } from "@types";
import { todayISO, uid } from "@lib/storage";
import { Plus, Trash2 } from "lucide-react";

const TEMPLATES: Record<string, Exercise[]> = {
  "StrongLifts 5x5 — A": [
    {
      id: uid(),
      name: "Squat",
      sets: Array.from({ length: 5 }, () => ({ weight: 0, reps: 5 })),
    },
    {
      id: uid(),
      name: "Bench Press",
      sets: Array.from({ length: 5 }, () => ({ weight: 0, reps: 5 })),
    },
    {
      id: uid(),
      name: "Barbell Row",
      sets: Array.from({ length: 5 }, () => ({ weight: 0, reps: 5 })),
    },
  ],
  "StrongLifts 5x5 — B": [
    {
      id: uid(),
      name: "Squat",
      sets: Array.from({ length: 5 }, () => ({ weight: 0, reps: 5 })),
    },
    {
      id: uid(),
      name: "Overhead Press",
      sets: Array.from({ length: 5 }, () => ({ weight: 0, reps: 5 })),
    },
    { id: uid(), name: "Deadlift", sets: [{ weight: 0, reps: 5 }] },
  ],
};

export function WorkoutForm({ onAdd }: { onAdd: (w: Workout) => void }) {
  const [date, setDate] = useState(todayISO());
  const [type, setType] = useState("Push");
  const [durationMin, setDurationMin] = useState(60);
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const addExercise = () =>
    setExercises((s) => [
      ...s,
      { id: uid(), name: "", sets: [{ weight: 0, reps: 8 }] },
    ]);
  const removeExercise = (id: string) =>
    setExercises((s) => s.filter((e) => e.id !== id));

  const updateExercise = (id: string, patch: Partial<Exercise>) =>
    setExercises((s) => s.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const updateSet = (eid: string, idx: number, patch: Partial<SetEntry>) =>
    setExercises((s) =>
      s.map((e) =>
        e.id !== eid
          ? e
          : {
              ...e,
              sets: e.sets.map((st, i) =>
                i === idx ? { ...st, ...patch } : st
              ),
            }
      )
    );
  const addSet = (eid: string) =>
    setExercises((s) =>
      s.map((e) =>
        e.id !== eid ? e : { ...e, sets: [...e.sets, { weight: 0, reps: 8 }] }
      )
    );
  const removeSet = (eid: string, idx: number) =>
    setExercises((s) =>
      s.map((e) =>
        e.id !== eid ? e : { ...e, sets: e.sets.filter((_, i) => i !== idx) }
      )
    );

  const applyTemplate = (key: string) =>
    setExercises(
      TEMPLATES[key].map((ex) => ({
        ...ex,
        id: uid(),
        sets: ex.sets.map((s) => ({ ...s })),
      }))
    );

  const submit = () => {
    if (!date || !type || !durationMin || exercises.length === 0) return;
    const w: Workout = {
      id: uid(),
      date,
      type,
      durationMin: Number(durationMin),
      notes: notes.trim() || undefined,
      exercises,
    };
    onAdd(w);
  };

  return (
    <div className="card p-4 space-y-3">
      <h3 className="font-medium">Log Workout</h3>
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
          <label className="text-sm">Type</label>
          <input
            className="input"
            placeholder="Push / Pull / Legs / Run"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm">Duration (min)</label>
          <input
            className="input"
            type="number"
            value={durationMin}
            onChange={(e) => setDurationMin(parseInt(e.target.value || "0"))}
          />
        </div>
        <div>
          <label className="text-sm">Template</label>
          <select
            className="select"
            defaultValue=""
            onChange={(e) => e.target.value && applyTemplate(e.target.value)}
          >
            <option value="">— choose template —</option>
            {Object.keys(TEMPLATES).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm">Notes</label>
        <input
          className="input"
          placeholder="Optional"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="btn" onClick={addExercise}>
          <Plus size={16} />
          Add exercise
        </button>
      </div>
      <div className="space-y-4">
        {exercises.map((ex) => (
          <div key={ex.id} className="border border-base-border rounded-xl p-3">
            <div className="flex items-center gap-2">
              <input
                className="input"
                placeholder="Exercise name"
                value={ex.name}
                onChange={(e) =>
                  updateExercise(ex.id, { name: e.target.value })
                }
              />
              <button className="btn" onClick={() => removeExercise(ex.id)}>
                <Trash2 size={16} />
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {ex.sets.map((st, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 items-center">
                  <div>
                    <label className="text-xs">Weight</label>
                    <input
                      className="input"
                      type="number"
                      value={st.weight}
                      onChange={(e) =>
                        updateSet(ex.id, i, { weight: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs">Reps</label>
                    <input
                      className="input"
                      type="number"
                      value={st.reps}
                      onChange={(e) =>
                        updateSet(ex.id, i, { reps: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <button className="btn" onClick={() => removeSet(ex.id, i)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button className="btn" onClick={() => addSet(ex.id)}>
                <Plus size={16} />
                Add set
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="btn w-full" onClick={submit}>
        <Plus size={16} />
        Add Workout
      </button>
    </div>
  );
}
