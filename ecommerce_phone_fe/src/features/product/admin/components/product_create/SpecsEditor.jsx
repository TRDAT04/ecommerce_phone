export default function SpecsEditor({
  specs,
  SPEC_OPTIONS,
  updateSpec,
  addSpec,
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4 ">
      <h2>Specifications</h2>

      {specs.map((s, i) => (
        <div key={i} className="flex gap-2">
          {/* Chọn spec */}
          <select
            className="border px-2"
            value={s.specKey}
            onChange={(e) => updateSpec(i, "specKey", e.target.value)}
          >
            <option value="">-- Chọn thông số --</option>
            {SPEC_OPTIONS.map((opt) => (
              <option key={opt.specKey} value={opt.specKey}>
                {opt.specName}
              </option>
            ))}
          </select>

          {/* Nhập giá trị */}
          <textarea
            className="border rounded px-2 py-1 w-full 
             focus:outline-none focus:border-blue-400
             text-sm resize-none"
            value={s.specValue}
            onChange={(e) => {
              updateSpec(i, "specValue", e.target.value);

              // Auto height
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            rows={1}
          />
        </div>
      ))}

      <button onClick={addSpec} className="bg-blue-500 text-white px-4 py-2">
        + Add Spec
      </button>
    </div>
  );
}
