import { ListTable } from "@components/ListTable";
import { WorkoutForm } from "@components/forms/WorkoutForm";
import { Workout } from "@types";
import { useMemo } from "react";

export function WorkoutsPage({
  workouts,
  onAdd,
  onDelete,
  inRange,
}: {
  workouts: Workout[];
  onAdd: (w: Workout) => void;
  onDelete: (id: string) => void;
  inRange: (iso: string, start?: string) => boolean;
}) {
  const rows = useMemo(
    () =>
      workouts
        .filter((w) => inRange(w.date))
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .map((w) => [
          w.date,
          w.type,
          `${w.durationMin} min`,
          // compute volume = sum(weight*reps)
          w.exercises
            .reduce(
              (s, ex) =>
                s + ex.sets.reduce((ss, st) => ss + st.weight * st.reps, 0),
              0
            )
            .toLocaleString(),
          w.notes ?? "",
          <button className="btn" onClick={() => onDelete(w.id)}>
            Delete
          </button>,
        ]),
    [workouts, inRange, onDelete]
  );

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <WorkoutForm onAdd={onAdd} />
      <div className="md:col-span-2">
        <ListTable
          title="Recent Workouts"
          columns={["Date", "Type", "Duration", "Volume", "Notes", ""]}
          rows={rows}
        />
      </div>
    </div>
  );
}
