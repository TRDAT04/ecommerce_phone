export default function VariantManager({
    variants,
    colors,
    updateVariant,
    removeVariant,
    addVariant,
    errors,
  }) {
    return (
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <h2 className="font-semibold text-lg">Variants</h2>
  
        {variants.map((v, i) => (
          <div key={i} className="border p-3 rounded-lg bg-gray-50 space-y-2">
            <button
              onClick={() => removeVariant(i)}
              className="text-red-500 font-bold float-right"
            >
              X
            </button>
  
            <div className="flex gap-2 flex-wrap">
              {/* Storage */}
              <input
                type="text"
                placeholder="Storage"
                value={v.storage}
                onChange={(e) => updateVariant(i, "storage", e.target.value)}
                className="border rounded px-2 py-1"
              />
  
              {/* Price */}
              <input
                type="number"
                placeholder="Price"
                value={v.price === 0 ? "" : v.price}
                onChange={(e) =>
                  updateVariant(
                    i,
                    "price",
                    e.target.value === "" ? 0 : +e.target.value
                  )
                }
                className="border rounded px-2 py-1 w-40"
              />
  
              {/* Original Price */}
              <input
                type="number"
                placeholder="Original Price"
                value={v.originalPrice === 0 ? "" : v.originalPrice}
                onChange={(e) =>
                  updateVariant(
                    i,
                    "originalPrice",
                    e.target.value === "" ? 0 : +e.target.value
                  )
                }
                className="border rounded px-2 py-1 w-40"
              />
  
              {/* Stock */}
              <input
                type="number"
                placeholder="Stock"
                value={v.stock === 0 ? "" : v.stock}
                onChange={(e) =>
                  updateVariant(
                    i,
                    "stock",
                    e.target.value === "" ? 0 : +e.target.value
                  )
                }
                className="border rounded px-2 py-1 w-40"
              />
            </div>
  
            {/* Select Color */}
            <select
              value={v.color}
              onChange={(e) => updateVariant(i, "color", e.target.value)}
              className="border px-2 py-1"
            >
              <option value="">Select color</option>
              {colors.map((c, idx) => (
                <option key={idx} value={c.key}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        ))}
  
        <button
          onClick={addVariant}
          className="bg-blue-500 text-white px-4 py-2"
        >
          + Add Variant
        </button>
  
        {errors.variants && (
          <p className="text-red-500 text-sm">{errors.variants}</p>
        )}
      </div>
    );
  }