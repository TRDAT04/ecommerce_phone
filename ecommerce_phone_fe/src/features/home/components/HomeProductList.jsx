import { useEffect, useState, useCallback } from "react";
import ProductCard from "./HomeProductCard";
import axiosClient from "../../../service/axiosClient";
import { PackageSearch } from "lucide-react";

// =========== Skeleton Card ===========
const SkeletonCard = () => (
  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white animate-pulse">
    <div className="h-52 bg-neutral-100" />
    <div className="flex flex-col gap-3 p-4">
      <div className="h-4 w-3/4 rounded-lg bg-neutral-100" />
      <div className="h-4 w-1/2 rounded-lg bg-neutral-100" />
      <div className="mt-2 flex gap-2">
        <div className="h-6 w-12 rounded-md bg-neutral-100" />
        <div className="h-6 w-12 rounded-md bg-neutral-100" />
        <div className="h-6 w-14 rounded-md bg-neutral-100" />
      </div>
      <div className="mt-auto flex justify-between pt-2">
        <div className="h-5 w-16 rounded-lg bg-neutral-100" />
        <div className="h-8 w-16 rounded-xl bg-neutral-100" />
      </div>
    </div>
  </div>
);

// =========== Empty State ===========
const EmptyState = ({ keyword }) => (
  <div className="col-span-full flex flex-col items-center justify-center gap-4 py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200">
    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50">
      <PackageSearch className="h-12 w-12 text-emerald-400" strokeWidth={1.5} />
    </div>
    <div>
      <p className="text-xl font-bold text-gray-800">
        Không tìm thấy sản phẩm nào
      </p>
      <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
        {keyword ? (
          <>Không có kết quả nào cho "<b>{keyword}</b>". Vui lòng thử từ khóa khác hoặc điều chỉnh bộ lọc.</>
        ) : (
          "Rất tiếc, không có sản phẩm nào phù hợp với bộ lọc của bạn."
        )}
      </p>
    </div>
  </div>
);

// =========== Build Params ===========
const buildParams = (filters) => {
  const params = {};
  Object.entries(filters || {}).forEach(([key, value]) => {
    if (value == null) return;
    if (Array.isArray(value)) {
      if (value.length > 0) params[key] = value;
    } else {
      params[key] = value;
    }
  });
  return params;
};

const paramsSerializer = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, v));
    } else {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
};

// =========== Main Component ===========
const ProductList = ({ filters, onTotalChange }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const params = buildParams(filters);
      const res = await axiosClient.get("/api/products", {
        params,
        paramsSerializer,
      });

      const raw = res.data;
      const data = Array.isArray(raw) ? raw : raw?.content || [];
      const total = raw?.totalElements ?? data.length;

      setProducts(data);
      onTotalChange?.(total);
    } catch (err) {
      console.error("Load products error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = setTimeout(loadData, 200);
    return () => clearTimeout(timer);
  }, [loadData]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : products.length > 0
            ? products.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))
            : !loading && <EmptyState keyword={filters?.keyword} />}
      </div>
    </div>
  );
};

export default ProductList;