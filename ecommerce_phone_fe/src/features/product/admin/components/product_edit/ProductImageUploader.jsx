import { getImageUrl } from "../../../../../utils/image";

export default function ProductImageUploader({ product, handleSelectImage }) {
  return (
    <div>
      <label className="font-semibold">Ảnh sản phẩm</label>
      <div className="mt-3 flex items-center gap-4">
        <img
          src={product.imagePreview || getImageUrl(product.imageUrl)}
          className="w-32 h-32 object-cover rounded-lg shadow"
        />
        <input type="file" onChange={handleSelectImage} />
      </div>
    </div>
  );
}