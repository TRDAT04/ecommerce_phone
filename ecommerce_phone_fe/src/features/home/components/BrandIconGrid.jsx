export default function BrandIconGrid({
  title,
  options,
  value = [],
  onToggle,
  renderIcon,
}) {
  return (
    <div>
      <h2 className="mb-2 font-semibold text-gray-800">{title}</h2>

      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const active = value.includes(opt);

          return (
            <div
              key={opt}
              onClick={() => onToggle(opt)}
              className={`flex cursor-pointer items-center justify-center rounded-md border border-black/30 p-2 transition hover:shadow-sm ${active ? "border-red-500 bg-red-50" : "border-gray-200"} `}
            >
              {renderIcon?.(opt) && (
                <img
                  src={renderIcon(opt)}
                  alt={opt}
                  className="h-5 w-full object-contain"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
