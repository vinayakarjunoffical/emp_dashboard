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
  { month: "Jul", value: 250 },
  { month: "Aug", value: 500 },
  { month: "Sep", value: 350 },
  { month: "Oct", value: 200 },
  { month: "Nov", value: 220 },
  { month: "Dec", value: 500 },
];

export default function DailySalesChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="month" axisLine={false} tickLine={false} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#2196F3"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
