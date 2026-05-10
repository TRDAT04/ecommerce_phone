import { useEffect, useState } from "react";
import ProductCard from "./HomeProductCard";
import axiosClient from "../../../service/axiosClient";

const ProductList = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===== BUILD PARAMS (FIX ARRAY FORMAT) =====
  const buildParams = (filters) => {
    const params = {};

    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value == null) return;

      // bỏ array rỗng
      if (Array.isArray(value)) {
        if (value.length === 0) return;
        params[key] = value; 
      } else {
        params[key] = value;
      }
    });

    return params;
  };

  // ===== LOAD DATA =====
  const loadData = async () => {
    try {
      setLoading(true);

      const params = buildParams(filters);

      const res = await axiosClient.get("/api/products", {
        params,
        paramsSerializer: (params) => {
         
          const searchParams = new URLSearchParams();

          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((v) => searchParams.append(key, v));
            } else {
              searchParams.append(key, value);
            }
          });

          return searchParams.toString();
        },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.content || [];

      setProducts(data);
    } catch (err) {
      console.error("Load products error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===== DEBOUNCE =====
  useEffect(() => {
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div>
      {loading && (
        <p className="text-center text-gray-400 mb-4">
          Đang tải sản phẩm...
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {products.length > 0 ? (
          products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))
        ) : (
          !loading && (
            <p className="col-span-full text-center text-gray-500">
              Không có sản phẩm phù hợp
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default ProductList;