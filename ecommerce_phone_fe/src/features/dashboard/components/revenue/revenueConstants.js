// ─── Constants ───────────────────────────────────────────────────────────────
export const THIS_YEAR    = new Date().getFullYear();
export const YEARS        = [THIS_YEAR - 2, THIS_YEAR - 1, THIS_YEAR];
export const MONTH_KEYS   = ["01","02","03","04","05","06","07","08","09","10","11","12"];
export const MONTH_LABELS = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];
export const MONTH_NAMES  = [
  "Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
  "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12",
];

import { Activity, BarChart as BarChartIcon, BarChart2 } from "lucide-react";
export const CHART_TYPES = [
  { id: "area", label: "Area", Icon: Activity },
  { id: "bar",  label: "Bar",  Icon: BarChartIcon },
  { id: "line", label: "Line", Icon: BarChart2 },
];

// ─── Formatters ──────────────────────────────────────────────────────────────
export const fmtVND = (v) => v?.toLocaleString("vi-VN") + "₫";
export const fmtShort = (v) => {
  if (!v) return "0";
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + "B";
  if (v >= 1_000_000)     return (v / 1_000_000).toFixed(0) + "M";
  if (v >= 1_000)         return (v / 1_000).toFixed(0) + "K";
  return String(v);
};
