import React from "react";

export default function CheckboxGroup({
  title,
  options,
  value = [],
  onToggle,
  renderLabel,
}) {
  return (
    <div className="">
      <h2 className="mb-1 font-semibold text-gray-800">{title}</h2>

      <div className="">
        {options.map((opt) => {
          const isChecked = value.includes(opt);

          return (
            <label
              key={opt}
              onClick={() => onToggle(opt)}
              className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 transition hover:bg-gray-100 ${isChecked ? "bg-red-50 text-red-600" : "text-gray-700"} `}
            >
              <input
                type="checkbox"
                checked={isChecked}
                readOnly
                className="h-3 w-3 accent-red-500"
              />

              <span className="text-sm">
                {renderLabel ? renderLabel(opt) : opt}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
