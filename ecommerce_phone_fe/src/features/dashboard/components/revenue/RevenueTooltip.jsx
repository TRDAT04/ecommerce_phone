import { fmtVND } from "./revenueConstants";

/**
 * Tooltip hiển thị doanh thu, số đơn và giá trị TB/đơn.
 */
export default function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload ?? {};

  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-2xl min-w-[180px]">
      <p className="mb-2 text-xs font-bold text-gray-500 border-b border-gray-100 pb-1.5">
        Tháng {label}
      </p>
      <div className="space-y-1.5">
        <Row dot="bg-emerald-500" label="Doanh thu"  value={fmtVND(d.revenue)}       textColor="text-emerald-700" />
        {d.orderCount !== undefined && (
          <Row dot="bg-blue-400"   label="Số đơn"    value={d.orderCount}             textColor="text-blue-700" />
        )}
        {d.avgOrderValue > 0 && (
          <Row dot="bg-violet-400" label="TB/đơn"    value={fmtVND(d.avgOrderValue)}  textColor="text-violet-700" />
        )}
      </div>
    </div>
  );
}

function Row({ dot, label, value, textColor }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-1 text-xs text-gray-500">
        <span className={`h-2 w-2 rounded-full ${dot} inline-block`} />
        {label}
      </span>
      <span className={`text-xs font-bold ${textColor}`}>{value}</span>
    </div>
  );
}
