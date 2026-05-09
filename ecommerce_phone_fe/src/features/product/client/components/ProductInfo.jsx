import { ShoppingCart, CreditCard, BadgePercent, Check } from "lucide-react";

import { getImageUrl } from "../../../../utils/image";

export default function ProductInfo({
  product,
  variant,
  selectedStorage,
  selectedColor,
  availableColors,
  changeStorage,
  changeColor,
  addToCart,
  handleBuyNow,
}) {
  return (
    <div className=" ">
      {/* PRICE */}
      <div>
        <div className="text-3xl font-bold tracking-tight text-red-600">
          {variant?.price?.toLocaleString("vi-VN")} đ
        </div>

        <div className="text-sm text-gray-400 line-through">
          {variant?.originalPrice?.toLocaleString("vi-VN")} đ
        </div>
      </div>

      {/* STORAGE */}
      <div className="mt-2">
        <p className="mb-2 font-semibold">Lựa chọn phiên bản</p>

        <div className="flex flex-wrap gap-3">
          {product.storages.map((s) => {
            const isActive = selectedStorage === s;

            const storagePrice =
              product.variantMap?.[`${s}|${selectedColor}`]?.price ||
              variant?.price;

            return (
              <button
                key={s}
                onClick={() => changeStorage(s)}
                className={`relative flex w-35 flex-col items-center justify-center rounded-lg border bg-white px-2 py-1 transition-all duration-200 ${
                  isActive
                    ? "border-green-600 shadow-sm ring-1 ring-green-100"
                    : "border-gray-300 hover:border-gray-400"
                } `}
              >
                {isActive && (
                  <Check
                    size={13}
                    className="absolute top-1 right-1 text-green-600"
                  />
                )}

                <span className="text-sm font-medium">{s}</span>

                <span className="text-[12px] text-red-500">
                  {storagePrice?.toLocaleString("vi-VN")} đ
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* COLOR */}
      <div className="mt-6">
        <p className="mb-2 font-semibold">Màu sắc</p>

        <div className="grid grid-cols-3 gap-3">
          {availableColors.map((color) => {
            const colorVariant =
              product.variantMap[`${selectedStorage}|${color.key}`];

            return (
              <button
                key={color.key}
                onClick={() => changeColor(color.key)}
                className={`flex items-center gap-2 rounded-lg border bg-white transition-all duration-200 ${
                  selectedColor === color.key
                    ? "border-green-600 shadow-sm ring-1 ring-green-100"
                    : "border-gray-300 hover:border-gray-400"
                } `}
              >
                <img
                  src={
                    colorVariant?.images?.[0]
                      ? getImageUrl(colorVariant.images[0])
                      : getImageUrl(product.imageUrl)
                  }
                  className="h-12 w-8 object-contain"
                />

                <div className="flex flex-col text-left">
                  <span className="text-[13px] font-medium">{color.name}</span>

                  <span className="text-[12px] text-red-500">
                    {colorVariant?.price?.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STOCK */}
      <p className="mt-3 text-sm text-gray-500">
        Còn <span className="font-semibold">{variant?.stock ?? 0}</span> sản
        phẩm
      </p>

      {/* ACTIONS */}
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex gap-3">
          <button
            className="flex items-center justify-center rounded-lg border border-gray-300 px-4 py-3 transition hover:bg-gray-100"
            onClick={addToCart}
          >
            <ShoppingCart size={20} />
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-7 rounded-lg bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
          >
            MUA NGAY
          </button>
        </div>

        <div className="flex gap-3">
          <button className="flex flex-1 flex-col rounded-lg bg-green-600 py-2 text-center font-medium text-white transition hover:bg-green-700">
            <div className="flex items-center justify-center gap-1">
              <BadgePercent size={15} />
              <span className="font-semibold">TRẢ GÓP 0%</span>
            </div>

            <span className="text-sm opacity-90">
              Không phí - duyệt nhanh 10p
            </span>
          </button>

          <button className="flex flex-1 flex-col rounded-lg bg-green-600 py-2 text-center font-medium text-white transition hover:bg-green-700">
            <div className="flex items-center justify-center gap-1">
              <CreditCard size={15} />
              <span className="font-semibold">TRẢ GÓP QUA THẺ</span>
            </div>

            <span className="text-sm opacity-90">(Visa, Mastercard, JCB)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
