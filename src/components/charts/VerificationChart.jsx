import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function VerificationChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <Tooltip />
        <Bar dataKey="completed" fill="#4CAF50" radius={[4,4,0,0]} />
        <Bar dataKey="pending" fill="#F44336" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
