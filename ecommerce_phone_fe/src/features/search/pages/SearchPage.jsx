import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import SidebarFilter from "../../home/components/SidebarFilter";
import HomeProductList from "../../home/components/HomeProductList";
import SortBar from "../../home/components/SortBar";

export default function SearchPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("keyword") || "";

  const [filters, setFilters] = useState({
    keyword,
    brands: [],
    minPrice: null,
    maxPrice: null,
    ram: [],
    storage: [],
    batteryMin: null,
    batteryMax: null,
    screenMin: null,
    screenMax: null,
    refreshRate: [],
    sort: "featured",
    page: 0,
    size: 20,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      keyword,
      page: 0,
    }));
  }, [keyword]);

  useEffect(() => {
    const handleToggle = () => setShowFilter((prev) => !prev);
    window.addEventListener("toggleMobileFilter", handleToggle);
    return () => window.removeEventListener("toggleMobileFilter", handleToggle);
  }, []);

  const handleSortChange = (sort) => {
    setFilters((prev) => ({
      ...prev,
      sort,
      page: 0,
    }));
  };

  return (
    <div className="mx-auto mt-2 max-w-7xl md:mt-6 md:px-6">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-14 md:gap-6">
        {/* OVERLAY for Mobile */}
        {showFilter && (
          <div 
            className="fixed inset-0 z-[150] bg-black/50 md:hidden transition-opacity" 
            onClick={() => setShowFilter(false)}
          />
        )}

        {/* SIDEBAR */}
        <div 
          className={`fixed inset-y-0 right-0 z-[200] w-[280px] bg-white shadow-2xl transition-transform duration-300 md:static md:z-auto md:col-span-3 md:block md:w-auto md:bg-transparent md:shadow-none md:translate-x-0 ${
            showFilter ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Close button for mobile */}
          <div className="flex items-center justify-between p-4 md:hidden border-b border-black/5">
            <span className="font-semibold text-lg text-gray-800">Bộ lọc</span>
            <button onClick={() => setShowFilter(false)} className="p-1 text-gray-500 hover:bg-gray-100 rounded-full">
              <span className="text-2xl leading-none">&times;</span>
            </button>
          </div>

          <div className="h-full overflow-y-auto p-4 md:p-0 md:sticky md:top-4 md:h-auto md:overflow-visible pb-20">
            <SidebarFilter filters={filters} onChange={setFilters} />
          </div>
        </div>

        {/* MAIN */}
        <div className="flex flex-col gap-5 md:col-span-11">
          {/* SEARCH TITLE */}
          <h2 className="text-lg font-semibold md:text-xl">
            Kết quả tìm kiếm cho:
            <span className="text-blue-600"> "{keyword}"</span>
          </h2>

          {/* SORT */}
          <SortBar value={filters.sort} onChange={handleSortChange} />

          {/* PRODUCT LIST */}
          <HomeProductList filters={filters} />
        </div>
      </div>
    </div>
  );
}