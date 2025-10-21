import { PropsWithChildren } from "react";
export function ChartCard({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <div className="card p-4">
      <div className="mb-2 text-sm text-base-mute">{title}</div>
      {children}
    </div>
  );
}
