import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ProgressChartProps {
  type: "bar" | "line";
  data: { label: string; value: number }[];
  seriesName: string;
  ariaLabel: string;
}

const TEAL = "#239B8B";
const AXIS = "#20333D";

export function ProgressChart({ type, data, seriesName, ariaLabel }: ProgressChartProps) {
  const axisProps = { tick: { fill: AXIS, fontSize: 14 }, stroke: AXIS, tickLine: false };
  return (
    <div role="img" aria-label={ariaLabel} className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {type === "bar" ? (
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DFF3EC" vertical={false} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis allowDecimals={false} width={40} {...axisProps} />
            <Tooltip cursor={{ fill: "#DFF3EC" }} />
            <Bar dataKey="value" name={seriesName} fill={TEAL} radius={[8, 8, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DFF3EC" vertical={false} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis allowDecimals={false} width={40} {...axisProps} />
            <Tooltip />
            <Line type="monotone" dataKey="value" name={seriesName} stroke={TEAL} strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
