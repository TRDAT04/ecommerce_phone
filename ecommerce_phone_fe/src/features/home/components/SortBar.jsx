import React from "react";

import {
  Flame,
  TrendingUp,
  Sparkles,
  ArrowUpWideNarrow,
  ArrowDownWideNarrow,
} from "lucide-react";

const options = [
  {
    label: "Nổi bật",
    value: "featured",
    icon: Flame,
  },

  {
    label: "Bán chạy",
    value: "best_seller",
    icon: TrendingUp,
  },

  {
    label: "Mới",
    value: "newest",
    icon: Sparkles,
  },

  {
    label: "Giá ↑",
    value: "price_asc",
    icon: ArrowUpWideNarrow,
  },

  {
    label: "Giá ↓",
    value: "price_desc",
    icon: ArrowDownWideNarrow,
  },
];

export default function SortBar({ value, onChange }) {
  return (
    <div className="scrollbar-none flex items-center gap-2 overflow-x-auto whitespace-nowrap rounded-2xl bg-white/80 p-3">
      {/* LABEL */}
      <span className="mr-1 text-sm font-semibold text-gray-700">Sắp xếp:</span>

      {/* OPTIONS */}
      {options.map((opt) => {
        const active = value === opt.value;

        const Icon = opt.icon;

        return (
          <button
            key={opt.value}
            onClick={() => onChange(active ? null : opt.value)}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
              active
                ? `border-emerald-500 bg-emerald-500 text-white shadow-sm`
                : `border-transparent bg-neutral-50 text-gray-700 hover:border-emerald-200 hover:bg-emerald-50`
            } `}
          >
            <Icon className="h-4 w-4" />

            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
