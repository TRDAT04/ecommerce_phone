import { ChevronLeft, ChevronRight } from "lucide-react";

import { getImageUrl } from "../../../../utils/image";

export default function ProductGallery({
  variant,
  product,
  imageIndex,
  changeImage,
  setImage,
}) {
  const images = variant?.images || [];

  return (
    <div className="space-y-4">
      {/* MAIN IMAGE */}
      <div className="group relative flex items-center justify-center overflow-hidden rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <img
          src={
            variant?.images?.[imageIndex]
              ? getImageUrl(variant.images[imageIndex])
              : getImageUrl(product.imageUrl) || "/placeholder.png"
          }
          alt={product.name}
          className="h-80 w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* LEFT BUTTON */}
        <button
          onClick={() => changeImage("prev")}
          className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 opacity-0 shadow-md backdrop-blur transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={() => changeImage("next")}
          className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 opacity-0 shadow-md backdrop-blur transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setImage(i)}
            className={`group/thumb relative flex h-15 w-15 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-white p-2 transition-all duration-200 ${
              imageIndex === i
                ? `border-emerald-500 shadow-md ring-2 ring-emerald-100`
                : `border-black/10 hover:border-emerald-300`
            } `}
          >
            <img
              src={getImageUrl(img)}
              alt={`image-${i}`}
              className="h-full w-full object-contain transition-transform duration-300 group-hover/thumb:scale-105"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
