export default function ColorManager({
    colors,
    setColors,
    colorImages,
    addColorImages,
    removeColorImage,
    handleDragStartImage,
    handleDropImage,
    normalize,
    errors,
  }) {
    return (
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <h2 className="font-semibold text-lg">Colors</h2>
  
       {colors.map((color, i) => {
  const key = normalize(color.key);

  return (
    <div key={i} className="border p-3 rounded-lg bg-gray-50 relative">

    
      <button
        onClick={() => {
          const newColors = colors.filter((_, idx) => idx !== i);
          setColors(newColors);

          const k = normalize(color.key);
          if (k && colorImages[k]) delete colorImages[k];
        }}
        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 text-sm rounded-full flex items-center justify-center"
      >
        ×
      </button>

      {/* Input tên màu */}
      <input
        type="text"
        placeholder="Color name"
        value={color.name}
        onChange={(e) => {
          const newColors = [...colors];
          const value = e.target.value;
          newColors[i] = {
            name: value,
            key: value.trim().toLowerCase(),
          };
          setColors(newColors);
        }}
        className="border px-2 py-1"
      />

      {/* Upload ảnh */}
      <input
        type="file"
        multiple
        disabled={!color?.name}
        onChange={(e) => {
          const files = e.target.files;
          if (!files?.length) return;

          addColorImages(color.key, files);
          setTimeout(() => (e.target.value = null), 0);
        }}
      />

      {/* Hiển thị ảnh */}
      <div className="flex gap-2 mt-2">
        {(key && colorImages[key] ? colorImages[key] : []).map(
          (file, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => handleDragStartImage(color.key, idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropImage(color.key, idx)}
              className="relative cursor-move"
            >
              <span className="absolute top-0 left-0 bg-black/70 text-white text-xs px-1 rounded">
                {idx + 1}
              </span>

              <img
                src={URL.createObjectURL(file)}
                className="w-16 h-16 border rounded"
              />

              <button
                onClick={() => removeColorImage(color.key, idx)}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 text-xs rounded-full"
              >
                X
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
})}
  
        {/* Add color */}
        <button
          onClick={() => {
            if (colors.some((c) => !c.name)) return;
            setColors([...colors, { name: "", key: "" }]);
          }}
          className="bg-blue-500 text-white px-4 py-2"
        >
          + Add Color
        </button>
  
        {errors.color && (
          <p className="text-red-500 text-sm">{errors.color}</p>
        )}
      </div>
    );
  }