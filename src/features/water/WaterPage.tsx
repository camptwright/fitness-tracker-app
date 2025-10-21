import { ListTable } from "@components/ListTable";
import { WaterForm } from "@components/forms/WaterForm";
import { WaterLog } from "@types";
import { useMemo } from "react";

export function WaterPage({
  waters,
  onAdd,
  onDelete,
  onExport,
  onImport,
  inRange,
}: {
  waters: WaterLog[];
  onAdd: (h: WaterLog) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  inRange: (iso: string) => boolean;
}) {
  const rows = useMemo(
    () =>
      waters
        .filter((h) => inRange(h.date))
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .map((h) => [
          h.date,
          h.ml,
          <button className="btn" onClick={() => onDelete(h.id)}>
            Delete
          </button>,
        ]),
    [waters, inRange, onDelete]
  );

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <WaterForm onAdd={onAdd} />
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
          title="Recent Water Logs"
          columns={["Date", "Amount (ml)", ""]}
          rows={rows}
        />
      </div>
    </div>
  );
}
