import { Search, Loader2, X, Clock, Trash2 } from "lucide-react";
import { useSearch } from "../hooks/useSearch";

// =========== Highlight keyword trong text ===========
const HighlightText = ({ text, keyword }) => {
  if (!keyword?.trim()) return <span>{text}</span>;

  const regex = new RegExp(`(${keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-transparent font-bold text-emerald-600">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
};

// =========== Main Component ===========
const SearchBar = () => {
  const {
    keyword,
    setKeyword,
    suggestions,
    showSuggest,
    loading,
    recentSearches,
    activeIndex,
    setActiveIndex,
    handleSearch,
    handleKeyDown,
    handleFocus,
    handleRecentClick,
    clearRecent,
    goToProduct,
    wrapperRef,
  } = useSearch();

 
  const hasContent =
    loading ||
    suggestions.length > 0 ||
    (recentSearches.length > 0 && !keyword.trim()) ||
    (keyword.trim() && !loading && suggestions.length === 0);

  const showDropdown = showSuggest && hasContent;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      {/* ===== INPUT ===== */}
      <div className="relative w-full">
        <Search className="pointer-events-none absolute top-3 left-4 h-5 w-5 text-gray-400" />

        <input
          id="search-input"
          type="text"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="Hôm nay bạn muốn tìm gì?"
          autoComplete="off"
          className="h-11 w-full rounded-2xl border border-black/10 bg-neutral-100 pl-12 pr-28 text-sm transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
        />

        {/* CLEAR BUTTON */}
        {keyword && (
          <button
            onClick={() => setKeyword("")}
            className="absolute top-2.5 right-20 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition hover:bg-gray-300"
            title="Xóa"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* SEARCH BUTTON */}
        <button
          onClick={handleSearch}
          className="absolute top-1.5 right-2 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium text-emerald-600 transition hover:text-emerald-700 active:scale-95"
        >
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">Tìm</span>
        </button>
      </div>

      {/* ===== DROPDOWN ===== */}
      {showDropdown && (
        <div className="dropdown-animate absolute z-[200] mt-2 w-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl ring-1 ring-black/5">

          {/* LOADING */}
          {loading && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
              Đang tìm kiếm...
            </div>
          )}

          {/* NO RESULT */}
          {!loading && keyword.trim() && suggestions.length === 0 && (
            <div className="flex flex-col items-center gap-1 px-4 py-6 text-center">
              <Search className="h-8 w-8 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">
                Không tìm thấy sản phẩm
              </p>
              <p className="text-xs text-gray-400">
                Thử từ khóa khác hoặc tên hãng
              </p>
            </div>
          )}

          {/* RECENT SEARCHES — hiện khi chưa gõ */}
          {!keyword.trim() && recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Tìm kiếm gần đây
                </div>
                <button
                  onClick={clearRecent}
                  className="flex items-center gap-1 text-gray-400 transition hover:text-red-500"
                  title="Xóa lịch sử"
                >
                  <Trash2 className="h-3 w-3" />
                  Xóa
                </button>
              </div>

              {recentSearches.map((kw, i) => (
                <button
                  key={i}
                  onClick={() => handleRecentClick(kw)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-neutral-50"
                >
                  <Clock className="h-4 w-4 shrink-0 text-gray-300" />
                  {kw}
                </button>
              ))}
            </div>
          )}

          {/* SUGGESTIONS LIST */}
          {!loading && suggestions.length > 0 && (
            <div className="custom-scroll max-h-72 overflow-y-auto">
              {suggestions.map((item, idx) => {
                const isActive = activeIndex === idx;

                return (
                  <div
                    key={item.id}
                    onClick={() => goToProduct(item.id)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors ${
                      isActive ? "bg-emerald-50" : "hover:bg-neutral-50"
                    }`}
                  >
                    {/* IMAGE */}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-11 w-11 shrink-0 rounded-xl border border-black/5 object-cover"
                    />

                    {/* INFO */}
                    <div className="flex min-w-0 flex-col">
                      <span className="line-clamp-1 text-sm font-medium text-gray-800">
                        <HighlightText text={item.name} keyword={keyword} />
                      </span>

                      <span className="mt-0.5 text-xs font-semibold text-emerald-600">
                        {item.minPrice?.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>

                    {/* ARROW INDICATOR */}
                    {isActive && (
                      <div className="ml-auto shrink-0 text-emerald-500">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* XEM TẤT CẢ */}
              {suggestions.length >= 5 && (
                <button
                  onClick={handleSearch}
                  className="flex w-full items-center justify-center gap-2 border-t border-neutral-100 py-3 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50"
                >
                  <Search className="h-4 w-4" />
                  Xem tất cả kết quả cho "{keyword}"
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
