export default function BasicInfo({ product, handleChange }) {
    return (
      <>
        <div className="space-y-2">
          <label className="font-semibold">Tên sản phẩm</label>
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>
  
        <div className="space-y-2">
          <label className="font-semibold">Hãng</label>
          <input
            name="brand"
            value={product.brand}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>
      </>
    );
  }