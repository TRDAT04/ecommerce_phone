import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../utils/image";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);

  const storage = product.storages?.[0];

  const discountPercent =
    product.minOriginalPrice && product.minPrice
      ? Math.round(
        ((product.minOriginalPrice - product.minPrice) /
          product.minOriginalPrice) *
        100,
      )
      : 0;

  return (
    <div
      onClick={() => {
        window.scrollTo(0, 0);

        navigate(`/product/${product.id}`);
      }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* IMAGE */}
      <div className="relative flex h-52 items-center justify-center bg-neutral-50 p-5">
        {/* DISCOUNT */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 z-10 rounded-lg bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            -{discountPercent}%
          </div>
        )}

        {/* FAVORITE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-110"
        >
          <Heart
            className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : "text-gray-400"
              } `}
          />
        </button>

        <img
          src={
            product.imageUrl
              ? getImageUrl(product.imageUrl)
              : "/placeholder.png"
          }
          alt={product.name}
          className="max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-4">
        {/* NAME */}
        <h3 className="line-clamp-2 min-h-[42px] text-[15px] leading-snug font-semibold text-gray-800 transition group-hover:text-emerald-600">
          {product.name}{" "}
          {storage && (
            <span className="font-medium text-gray-500">{storage}</span>
          )}
        </h3>

        {/* PRICE */}
        <div className="mt-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-xl font-bold text-red-600">
              {product.minPrice?.toLocaleString("vi-VN")}₫
            </p>

            {product.minOriginalPrice && (
              <p className="text-sm text-gray-400 line-through">
                {product.minOriginalPrice.toLocaleString("vi-VN")}₫
              </p>
            )}
          </div>

          {/* SPECS */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-gray-700">
              {product.screen}”
            </span>

            <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-gray-700">
              {product.ram}GB
            </span>

            <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-gray-700">
              {product.battery}mAh
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-auto flex items-center justify-between pt-4">
          {/* RATING */}
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

            <span className="font-medium text-gray-700">
              {product.rating || ""}
            </span>
          </div>

          {/* BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();

              window.scrollTo(0, 0);

              navigate(`/product/${product.id}`);
            }}
            className="flex h-9 items-center gap-2 rounded-xl bg-emerald-500 px-3 text-sm font-medium text-white transition hover:bg-emerald-600"
          >
            <ShoppingCart className="h-4 w-4" />
            Mua
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
