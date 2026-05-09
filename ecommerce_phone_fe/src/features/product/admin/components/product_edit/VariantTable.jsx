export default function VariantTable({
    product,
    handleVariantChange,
    addVariant,
    deleteVariant,
  }) {
    return (
      <div>
        <h3 className="font-bold text-xl mb-3">Phiên bản (Variants)</h3>
  
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Storage</th>
              <th className="p-3 text-left">Color</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Original Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Xóa</th>
            </tr>
          </thead>
  
          <tbody>
            {product.variants.map((v, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">
                  <input
                    value={v.storage}
                    onChange={(e) =>
                      handleVariantChange(i, "storage", e.target.value)
                    }
                    className="border p-2 rounded w-full"
                  />
                </td>
  
                <td className="p-3">
                  <select
                    value={v.colorKey}
                    onChange={(e) =>
                      handleVariantChange(i, "colorKey", e.target.value)
                    }
                    className="border p-2 rounded w-full"
                  >
                    <option value="">-- chọn màu --</option>
                    {product.colors.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </td>
  
                <td className="p-3">
                  <input
                    type="number"
                    value={v.price}
                    onChange={(e) =>
                      handleVariantChange(i, "price", +e.target.value)
                    }
                    className="border p-2 rounded w-full"
                  />
                </td>
  
                <td className="p-3">
                  <input
                    type="number"
                    value={v.originalPrice}
                    onChange={(e) =>
                      handleVariantChange(i, "originalPrice", +e.target.value)
                    }
                    className="border p-2 rounded w-full"
                  />
                </td>
  
                <td className="p-3">
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) =>
                      handleVariantChange(i, "stock", +e.target.value)
                    }
                    className="border p-2 rounded w-full"
                  />
                </td>
  
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => deleteVariant(i)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        <button
          type="button"
          onClick={addVariant}
          className="mt-2 bg-gray-200 px-4 py-2 rounded"
        >
          + Thêm phiên bản
        </button>
      </div>
    );
  }