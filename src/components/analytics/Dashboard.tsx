import { ChartCard } from "@components/ChartCard";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

export function Dashboard({ data }: { data: any[] }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <ChartCard title="Workout Volume (by day)">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="volume" name="Volume" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Calories vs Target">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="calories"
              name="Calories"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="calTarget"
              name="Target"
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Macros (stacked)">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="protein"
              name="Protein"
              stackId="1"
            />
            <Area type="monotone" dataKey="carbs" name="Carbs" stackId="1" />
            <Area type="monotone" dataKey="fat" name="Fat" stackId="1" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Hydration vs Target">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="water"
              name="Water (ml)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="waterTarget"
              name="Target (ml)"
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
