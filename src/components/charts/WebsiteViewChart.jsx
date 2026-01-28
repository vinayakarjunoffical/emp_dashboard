import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "M", value: 50 },
  { day: "T", value: 20 },
  { day: "W", value: 10 },
  { day: "T", value: 22 },
  { day: "F", value: 50 },
  { day: "S", value: 10 },
  { day: "S", value: 40 },
];

export default function WebsiteViewChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="day" axisLine={false} tickLine={false} />
        <Tooltip />
        <Bar
          dataKey="value"
          radius={[6, 6, 0, 0]}
          fill="#4CAF50"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
