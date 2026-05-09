export default function BasicInfoForm({
    productInfo,
    setProductInfo,
    errors,
    setErrors,
  }) {
    return (
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <h2 className="font-semibold text-lg">Thông tin cơ bản</h2>
  
        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Tên sản phẩm"
            value={productInfo.name}
            onChange={(e) => {
              setProductInfo({ ...productInfo, name: e.target.value });
              setErrors((prev) => ({ ...prev, name: "" }));
            }}
            className={`w-full border px-3 py-2 rounded ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
  
        {/* Brand */}
        <div>
          <input
            type="text"
            placeholder="Thương hiệu"
            value={productInfo.brand}
            onChange={(e) => {
              setProductInfo({ ...productInfo, brand: e.target.value });
              setErrors((prev) => ({ ...prev, brand: "" }));
            }}
            className={`w-full border px-3 py-2 rounded ${
              errors.brand ? "border-red-500" : ""
            }`}
          />
          {errors.brand && (
            <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
          )}
        </div>
  
        {/* Thumbnail */}
        <div>
          <label>Ảnh đại diện:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setProductInfo({ ...productInfo, file: e.target.files[0] })
            }
            className="border rounded px-2 py-1"
          />
  
          {productInfo.file && (
            <img
              src={URL.createObjectURL(productInfo.file)}
              alt="preview"
              className="w-32 h-32 object-contain mt-2 border rounded"
            />
          )}
        </div>
  
        {/* Description */}
        <div>
          <label>Mô tả sản phẩm:</label>
          <textarea
            value={productInfo.description}
            onChange={(e) =>
              setProductInfo({ ...productInfo, description: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            rows={5}
          />
        </div>
      </div>
    );
  }