export default function SpecsManager({
    product,
    SPEC_OPTIONS,
    handleSpecChange,
    addSpec,
    deleteSpec,
  }) {
    return (
      <div>
        <h3 className="font-bold text-xl mb-3">Thông số kỹ thuật</h3>
  
        {product.specifications.map((s, i) => (
          <div key={i} className="flex gap-3 mb-3">
            {/* Select option */}
            <select
              value={s.specKey || ""}
              onChange={(e) => {
                const key = e.target.value;
                const opt = SPEC_OPTIONS.find((o) => o.specKey === key);
  
                handleSpecChange(i, "specKey", key);
                handleSpecChange(i, "specName", opt?.specName || "");
              }}
              className="border p-2 rounded w-1/3"
            >
              <option value="">-- Chọn thông số --</option>
              {SPEC_OPTIONS.map((opt) => (
                <option key={opt.specKey} value={opt.specKey}>
                  {opt.specName}
                </option>
              ))}
            </select>
  
            {/* Textarea — hỗ trợ xuống dòng */}
            <textarea
              value={s.specValue}
              onChange={(e) => {
                handleSpecChange(i, "specValue", e.target.value);
  
                // Auto resize
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              placeholder="Nhập thông số..."
              className="border p-2 rounded flex-1 resize-none leading-5"
              rows={1}
            />
  
            <button
              type="button"
              onClick={() => deleteSpec(i)}
              className="px-3 py-2 bg-red-500 text-white rounded"
            >
              X
            </button>
          </div>
        ))}
  
        <button
          type="button"
          onClick={addSpec}
          className="mt-2 bg-gray-200 px-4 py-2 rounded"
        >
          + Thêm thông số
        </button>
      </div>
    );
  }