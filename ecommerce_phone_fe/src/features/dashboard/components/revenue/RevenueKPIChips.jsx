import {
  Wallet, ShoppingCart, BarChart2, Layers,
  ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown,
} from "lucide-react";
import { fmtVND, fmtShort } from "./revenueConstants";

// ─── Atom: single chip ────────────────────────────────────────────────────────
export function KPIChip({ icon: Icon, label, value, color, sub }) {
  return (
    <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ring-1 ${color}`}>
      <Icon size={13} />
      <div>
        <p className="text-[10px] font-medium opacity-80">{label}</p>
        <p className="text-xs font-bold leading-tight">{value}</p>
        {sub && <p className="text-[9px] opacity-60 leading-tight">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Composed: full KPI row from summary + momGrowth ─────────────────────────
/**
 * @param {{ summary: object, year: number, momGrowth: number|null }} props
 */
export default function RevenueKPIChips({ summary, year, momGrowth }) {
  if (!summary) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <KPIChip
        icon={Wallet}
        label={`Tổng ${year}`}
        value={fmtVND(summary.totalRevenue)}
        color="bg-emerald-50 text-emerald-700 ring-emerald-100"
      />
      <KPIChip
        icon={ShoppingCart}
        label="Đơn DONE"
        value={summary.totalOrders?.toLocaleString()}
        color="bg-blue-50 text-blue-700 ring-blue-100"
      />
      <KPIChip
        icon={BarChart2}
        label="TB/tháng"
        value={fmtVND(summary.avgMonthlyRevenue)}
        color="bg-violet-50 text-violet-700 ring-violet-100"
      />

      {summary.bestMonth && (
        <KPIChip
          icon={Layers}
          label="Đỉnh"
          value={`T${parseInt(summary.bestMonth.slice(5))}`}
          sub={fmtShort(summary.bestMonthRevenue) + "₫"}
          color="bg-amber-50 text-amber-700 ring-amber-100"
        />
      )}

      {summary.growthVsLastYear !== 0 && (
        <KPIChip
          icon={summary.growthVsLastYear >= 0 ? ArrowUpRight : ArrowDownRight}
          label={`vs ${year - 1}`}
          value={`${summary.growthVsLastYear >= 0 ? "+" : ""}${summary.growthVsLastYear.toFixed(1)}%`}
          color={
            summary.growthVsLastYear >= 0
              ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
              : "bg-red-50 text-red-600 ring-red-100"
          }
        />
      )}

      {momGrowth !== null && (
        <KPIChip
          icon={momGrowth >= 0 ? TrendingUp : TrendingDown}
          label="MoM"
          value={`${momGrowth >= 0 ? "+" : ""}${momGrowth.toFixed(1)}%`}
          sub="vs tháng trước"
          color={
            momGrowth >= 0
              ? "bg-teal-50 text-teal-700 ring-teal-100"
              : "bg-rose-50 text-rose-600 ring-rose-100"
          }
        />
      )}
    </div>
  );
}
