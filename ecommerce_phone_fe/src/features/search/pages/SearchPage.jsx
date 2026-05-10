import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import SidebarFilter from "../../home/components/SidebarFilter";
import ProductList from "../../product/admin/pages/AdminProductList";
import SortBar from "../../home/components/SortBar";

export default function SearchPage() {
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

  const handleSortChange = (sort) => {
    setFilters((prev) => ({
      ...prev,
      sort,
      page: 0,
    }));
  };

  return (
    <div className="mx-auto mt-6 max-w-7xl px-4 md:px-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-14">
        {/* SIDEBAR */}
        <div className="md:col-span-3">
          <div className="sticky top-4">
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
          <ProductList filters={filters} />
        </div>
      </div>
    </div>
  );
}
