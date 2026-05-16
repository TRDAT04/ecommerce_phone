import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

import SidebarFilter from "../components/SidebarFilter";
import ProductList from "../components/HomeProductList";
import BannerSlider from "../components/BannerSlider";
import SortBar from "../components/SortBar";

export default function Home() {
  const [showFilter, setShowFilter] = useState(false);
  const [searchParams] = useSearchParams();

  const brand = searchParams.get("brand");

  const [filters, setFilters] = useState({
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
    size: 100,
  });

  useEffect(() => {
    if (!brand) return;

    setFilters((prev) => ({
      ...prev,
      brands: [brand],
    }));
  }, [brand]);

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
    <div className="max-w-7xl mx-auto mt-2 md:mt-6  md:px-6">

      <div className="grid grid-cols-1 md:grid-cols-14 gap-2 md:gap-6">

        {/* OVERLAY for Mobile */}
        {showFilter && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity"
            onClick={() => setShowFilter(false)}
          />
        )}

        {/* SIDEBAR */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-[280px] bg-white shadow-2xl transition-transform duration-300 md:static md:col-span-3 md:block md:w-auto md:bg-transparent md:shadow-none md:translate-x-0 md:transform-none md:z-auto ${showFilter ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Close button for mobile */}
          <div className="flex items-center justify-between p-4 md:hidden border-b border-black/5">
            <span className="font-semibold text-lg text-gray-800">Bộ lọc</span>
            <button onClick={() => setShowFilter(false)} className="p-1 text-gray-500 hover:bg-gray-100 rounded-full">
              <span className="text-2xl leading-none">&times;</span>
            </button>
          </div>

          <div className="h-full overflow-y-auto p-4 pb-20 md:h-auto md:overflow-visible md:p-0">
            <SidebarFilter
              filters={filters}
              onChange={setFilters}
            />
          </div>
        </div>

        {/* MAIN */}
        <div className="md:col-span-11 flex flex-col gap-5">

          {/* BANNER */}
          <BannerSlider />

          {/* SORT */}
          <SortBar
            value={filters.sort}
            onChange={handleSortChange}
          />

          {/* PRODUCT LIST */}
          <ProductList filters={filters} />
        </div>
      </div>
    </div>
  );
}