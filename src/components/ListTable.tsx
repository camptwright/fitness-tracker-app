export function ListTable({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: (string | number | JSX.Element)[][];
}) {
  return (
    <div className="card p-4">
      <div className="mb-3 font-medium">{title}</div>
      <div className="overflow-auto">
        <table className="w-full text-sm table">
          <thead>
            <tr className="text-left text-base-mute">
              {columns.map((c) => (
                <th key={c} className="font-normal border-b border-base-border">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="py-3 text-base-mute" colSpan={columns.length}>
                  No entries yet.
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i} className="border-b border-base-border/60">
                  {r.map((cell, j) => (
                    <td key={j} className="align-middle">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
