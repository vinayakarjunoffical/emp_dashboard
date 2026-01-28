import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Apr", value: 50 },
  { month: "May", value: 40 },
  { month: "Jun", value: 300 },
  { month: "Jul", value: 200 },
  { month: "Aug", value: 500 },
  { month: "Sep", value: 250 },
  { month: "Oct", value: 400 },
  { month: "Nov", value: 220 },
  { month: "Dec", value: 480 },
];

export default function CompletedTasksChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="month" axisLine={false} tickLine={false} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#4CAF50"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
