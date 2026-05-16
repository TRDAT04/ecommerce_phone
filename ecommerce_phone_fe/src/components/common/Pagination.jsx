import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Pagination — component UI phân trang dùng chung
 *
 * Props:
 *   - page           : trang hiện tại
 *   - totalPages     : tổng số trang
 *   - rangeText      : chuỗi info "X–Y trong Z"
 *   - onPrev         : callback về trang trước
 *   - onNext         : callback sang trang sau
 *   - onPageSelect   : callback khi chọn số trang
 *   - getPageNumbers : hàm trả về mảng số trang
 *   - accentColor    : màu trang active — "blue" | "emerald" | "gray" (mặc định "gray")
 */

const ACCENT = {
  blue: {
    active: "bg-blue-600 text-white shadow-sm",
    hover: "hover:border-blue-300 hover:text-blue-600",
    arrow: "hover:border-blue-300 hover:text-blue-600",
  },
  emerald: {
    active: "bg-emerald-600 text-white shadow-sm",
    hover: "hover:border-emerald-300 hover:text-emerald-600",
    arrow: "hover:border-emerald-300 hover:text-emerald-600",
  },
  gray: {
    active: "bg-gray-900 text-white shadow-sm",
    hover: "hover:border-gray-400 hover:text-gray-800",
    arrow: "hover:border-gray-400 hover:text-gray-700",
  },
};

export default function Pagination({
  page,
  totalPages,
  rangeText,
  onPrev,
  onNext,
  onPageSelect,
  getPageNumbers,
  accentColor = "gray",
}) {
  if (totalPages <= 1) return null;

  const accent = ACCENT[accentColor] || ACCENT.gray;

  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
      {/* Info */}
      <p className="text-xs text-gray-400">
        Hiển thị{" "}
        <span className="font-medium text-gray-600">{rangeText}</span>
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={onPrev}
          disabled={page === 1}
          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition ${accent.arrow} disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <ChevronLeft size={14} />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-8 w-8 items-center justify-center text-xs text-gray-400"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageSelect(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition ${
                page === p
                  ? accent.active
                  : `border border-gray-200 text-gray-600 ${accent.hover}`
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={onNext}
          disabled={page === totalPages}
          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition ${accent.arrow} disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}