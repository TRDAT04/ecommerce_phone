import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis,
  Tooltip, CartesianGrid, Legend,
} from "recharts";
import { fmtShort } from "./revenueConstants";
import RevenueTooltip from "./RevenueTooltip";

const AXIS_STYLE = { fontSize: 11, fill: "#94a3b8" };
const AXIS_PROPS = { tickLine: false, axisLine: false };

// Phần axes + legend dùng chung cho cả 3 loại chart
function SharedAxes() {
  return (
    <>
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#10b981" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
        </linearGradient>
        <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#3b82f6" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
        </linearGradient>
      </defs>

      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

      <XAxis
        dataKey="month"
        tick={AXIS_STYLE}
        {...AXIS_PROPS}
      />
      <YAxis
        yAxisId="rev"
        tickFormatter={fmtShort}
        tick={AXIS_STYLE}
        width={42}
        {...AXIS_PROPS}
      />
      <YAxis
        yAxisId="ord"
        orientation="right"
        tick={{ fontSize: 11, fill: "#93c5fd" }}
        width={30}
        {...AXIS_PROPS}
      />

      <Tooltip content={<RevenueTooltip />} />
      <Legend
        formatter={(val) => (val === "revenue" ? "Doanh thu" : "Số đơn")}
        wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
      />
    </>
  );
}

/**
 * Renders AreaChart / BarChart / LineChart với dual Y-axis.
 *
 * @param {{ chartType: "area"|"bar"|"line", data: object[], commonProps: object }} props
 */
export default function RevenueChartRenderer({ chartType, data, commonProps }) {
  if (chartType === "bar") {
    return (
      <BarChart {...commonProps} data={data}>
        <SharedAxes />
        <Bar 
          yAxisId="rev" dataKey="revenue"    
          fill="#10b981" radius={[4,4,0,0]} maxBarSize={24} 
        />
        <Bar 
          yAxisId="ord" dataKey="orderCount" 
          fill="#93c5fd" radius={[4,4,0,0]} maxBarSize={14} 
        />
      </BarChart>
    );
  }

  if (chartType === "line") {
    return (
      <LineChart {...commonProps} data={data}>
        <SharedAxes />
        <Line
          yAxisId="rev" type="monotone" dataKey="revenue"
          stroke="#10b981" strokeWidth={2.5}
          dot={{ r: 3, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
        <Line
          yAxisId="ord" type="monotone" dataKey="orderCount"
          stroke="#93c5fd" strokeWidth={2}
          dot={{ r: 3, fill: "#93c5fd", stroke: "#fff", strokeWidth: 2 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    );
  }

  // default: area
  return (
    <AreaChart {...commonProps} data={data}>
      <SharedAxes />
      <Area
        yAxisId="rev" type="monotone" dataKey="revenue"
        stroke="#10b981" strokeWidth={2.5} fill="url(#revGrad)"
        dot={{ r: 3, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
        activeDot={{ r: 6, fill: "#059669", stroke: "#fff", strokeWidth: 2 }}
      />
      <Area
        yAxisId="ord" type="monotone" dataKey="orderCount"
        stroke="#93c5fd" strokeWidth={1.5} fill="url(#ordGrad)"
        dot={{ r: 2, fill: "#93c5fd", stroke: "#fff", strokeWidth: 1 }}
        activeDot={{ r: 4 }}
      />
    </AreaChart>
  );
}
