import { Search, Loader2 } from "lucide-react";
import { useSearch } from "../hooks/useSearch";

const SearchBar = () => {
  const {
    keyword,
    setKeyword,
    suggestions,
    showSuggest,
    setShowSuggest,
    handleSearch,
    goToProduct,
    wrapperRef,
    loading,
  } = useSearch();

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      {/* INPUT WRAPPER */}
      <div className="relative w-full">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          onFocus={() => setShowSuggest(true)}
          placeholder="Hôm nay bạn muốn tìm gì?"
          className="h-11 w-full rounded-2xl border border-black/10 bg-neutral-100 pr-20 pl-12 transition outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
        />

        {/* SEARCH ICON */}
        <Search className="absolute top-3 left-4 h-5 w-5 text-gray-400" />

        {/* BUTTON */}
        <button
          onClick={handleSearch}
          className="absolute top-1.5 right-2 flex items-center gap-1 px-2 py-1.5 text-emerald-600 transition hover:text-emerald-700"
        >
          <Search className="h-4 w-4" />
          <span className="hidden md:inline text-sm font-medium">Tìm kiếm</span>
        </button>
      </div>

      {/* SUGGESTIONS BOX */}
      {showSuggest && (
        <div className="absolute z-[200] mt-2 w-full overflow-hidden rounded-xl border border-white/20 bg-white shadow-xl">
          {/* LOADING */}
          {loading && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang tìm kiếm...
            </div>
          )}

          {/* EMPTY */}
          {!loading && suggestions.length === 0 && keyword && (
            <div className="px-4 py-3 text-sm text-gray-500">
              Không tìm thấy sản phẩm phù hợp
            </div>
          )}

          {!loading && (
            <div className="custom-scroll max-h-64 overflow-y-auto">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => goToProduct(item.id)}
                  className="flex cursor-pointer items-center gap-3 px-4 py-2 transition hover:bg-gray-100"
                >
                  {/* IMAGE */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-10 w-10 rounded-md border object-cover"
                  />

                  {/* INFO */}
                  <div className="flex flex-col">
                    <span className="line-clamp-1 text-sm font-medium">
                      {item.name}
                    </span>

                    <span className="text-xs font-semibold text-emerald-600">
                      {item.minPrice?.toLocaleString()} ₫
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
