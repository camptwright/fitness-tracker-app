import { motion } from "framer-motion";

export function StatsRow({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-7 gap-3">
      {items.map((it) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="card p-3">
            <div className="text-xs text-base-mute">{it.label}</div>
            <div className="text-lg font-semibold">{it.value}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
