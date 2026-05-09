import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import SidebarFilter from "../components/SidebarFilter";
import ProductList from "../components/HomeProductList";
import BannerSlider from "../components/BannerSlider";
import SortBar from "../components/SortBar";

export default function Home() {
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
    size: 20,
  });

  useEffect(() => {
    if (!brand) return;

    setFilters((prev) => ({
      ...prev,
      brands: [brand],
    }));
  }, [brand]);

  const handleSortChange = (sort) => {
    setFilters((prev) => ({
      ...prev,
      sort,
      page: 0,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4 md:px-6">
      
      <div className="grid grid-cols-1 md:grid-cols-14 gap-6">

        {/* SIDEBAR */}
        <div className="md:col-span-3">
          <div className="sticky top-4">
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