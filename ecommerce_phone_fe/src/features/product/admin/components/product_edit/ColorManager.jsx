export default function ColorManager({
    id,
    product,
    navigate,
    draftColor,
    showColorInput,
    setDraftColor,
    setShowColorInput,
    addColor,
    deleteColor,
  }) {
    return (
      <div>
        <h3 className="font-bold text-xl mb-3">Màu sắc</h3>
  
        {product.colors.map((color) => {
          const isUsed = product.variants.some((v) => v.colorKey === color.key);
  
          return (
            <div
              key={color.key}
              className="border p-3 mb-4 rounded flex justify-between items-center"
            >
              <p className="font-semibold">{color.name}</p>
  
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/admin/products/${id}/images/${color.key}`)
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Ảnh
                </button>
  
                <button
                  type="button"
                  disabled={isUsed}
                  onClick={() => deleteColor(color.key)}
                  className={`px-3 py-1 text-sm rounded ${
                    isUsed
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-red-500 text-white"
                  }`}
                >
                  Xóa
                </button>
              </div>
            </div>
          );
        })}
  
        {!showColorInput ? (
          <button
            type="button"
            onClick={() => setShowColorInput(true)}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            + Thêm màu
          </button>
        ) : (
          <div className="flex gap-2 mt-3">
            <input
              value={draftColor}
              onChange={(e) => setDraftColor(e.target.value)}
              placeholder="Nhập màu..."
              className="border p-2 rounded w-40"
            />
  
            <button
              type="button"
              onClick={addColor}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        )}
      </div>
    );
  }