import React from "react";

export default function RadioRangeGroup({
  title,
  options,
  minKey,
  maxKey,
  filters,
  updateFilters,
  name,
}) {
  const toggleRange = (min, max) => {
    updateFilters((prev) => {
      const isActive = prev[minKey] === min && prev[maxKey] === max;

      return {
        ...prev,
        [minKey]: isActive ? null : min,
        [maxKey]: isActive ? null : max,
      };
    });
  };

  return (
    <div className="mb-5">
      <h2 className="mb-1 font-semibold text-gray-800">{title}</h2>

      <div className="">
        {options.map((opt) => {
          const active =
            filters[minKey] === opt.min && filters[maxKey] === opt.max;

          return (
            <div
              key={opt.label}
              onClick={() => toggleRange(opt.min, opt.max)}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 transition hover:border-red-300 hover:bg-gray-50 ${active ? " bg-red-50 text-red-600" : "border-gray-200"} `}
            >
              <input
                type="radio"
                name={name}
                checked={active}
                readOnly
                className="h-3 w-3 accent-red-500"
              />

              <span className="text-sm">{opt.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
