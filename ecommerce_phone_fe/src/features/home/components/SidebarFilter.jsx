import { useEffect, useState } from "react";
import axios from "axios";

import CheckboxGroup from "./CheckboxGroup";
import RadioRangeGroup from "./RadioRangeGroup";
import BrandIconGrid from "./BrandIconGrid";

import {
  brandLogos,
  priceOptions,
  batteryOptions,
  screenOptions,
} from "../constants/filters";

import {
  Smartphone,
  Battery,
  Monitor,
  MemoryStick,
  HardDrive,
  Gauge,
  Tag,
  Wallet,
} from "lucide-react";

export default function SidebarFilter({ filters, onChange }) {
  const [brands, setBrands] = useState([]);

  // ===== LOAD BRAND =====
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products/brands")
      .then((res) => setBrands(res.data || []))
      .catch(() => {});
  }, []);

  // ===== UPDATE FILTER =====
  const updateFilters = (updater) => {
    onChange((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;

      return {
        ...next,
        page: 0,
      };
    });
  };

  // ===== TOGGLE CHECKBOX =====
  const toggle = (key, value) => {
    updateFilters((prev) => {
      const current = prev[key] || [];

      const exists = current.includes(value);

      return {
        ...prev,
        [key]: exists
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  // ===== SECTION TITLE =====
  const SectionTitle = ({ icon: Icon, title }) => (
    <div className="mb-3 flex items-center gap-2">
      <Icon className="h-4 w-4 text-emerald-600" />

      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
  );

  return (
    <div className="space-y-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
     
     

      {/* BRAND */}
      <div>
        <SectionTitle icon={Smartphone} title="Hãng" />

        <BrandIconGrid
          title=""
          options={brands}
          value={filters.brands}
          onToggle={(v) => toggle("brands", v)}
          renderIcon={(brand) => brandLogos[brand]}
        />
      </div>

      {/* PRICE */}
      <div className="border-t border-neutral-100 pt-4">
        <SectionTitle icon={Wallet} title="Giá" />

        <RadioRangeGroup
          title=""
          options={priceOptions}
          minKey="minPrice"
          maxKey="maxPrice"
          filters={filters}
          updateFilters={updateFilters}
          name="price"
        />
      </div>

      {/* RAM */}
      <div className="border-t border-neutral-100 pt-4">
        <SectionTitle icon={MemoryStick} title="RAM" />

        <CheckboxGroup
          title=""
          options={[4, 6, 8, 12]}
          value={filters.ram}
          onToggle={(v) => toggle("ram", v)}
          renderLabel={(v) => `${v}GB`}
        />
      </div>

      {/* STORAGE */}
      <div className="border-t border-neutral-100 pt-4">
        <SectionTitle icon={HardDrive} title="Bộ nhớ" />

        <CheckboxGroup
          title=""
          options={["128GB", "256GB", "512GB"]}
          value={filters.storage}
          onToggle={(v) => toggle("storage", v)}
        />
      </div>

      {/* BATTERY */}
      <div className="border-t border-neutral-100 pt-4">
        <SectionTitle icon={Battery} title="Pin" />

        <RadioRangeGroup
          title=""
          options={batteryOptions}
          minKey="batteryMin"
          maxKey="batteryMax"
          filters={filters}
          updateFilters={updateFilters}
          name="battery"
        />
      </div>

      {/* SCREEN */}
      <div className="border-t border-neutral-100 pt-4">
        <SectionTitle icon={Monitor} title="Màn hình" />

        <RadioRangeGroup
          title=""
          options={screenOptions}
          minKey="screenMin"
          maxKey="screenMax"
          filters={filters}
          updateFilters={updateFilters}
          name="screen"
        />
      </div>

      {/* REFRESH RATE */}
      <div className="border-t border-neutral-100 pt-4">
        <SectionTitle icon={Gauge} title="Tần số quét" />

        <CheckboxGroup
          title=""
          options={[60, 90, 120]}
          value={filters.refreshRate}
          onToggle={(v) => toggle("refreshRate", v)}
          renderLabel={(v) => `${v}Hz`}
        />
      </div>
    </div>
  );
}
