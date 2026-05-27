import { useState } from "react";
import provincesData from "../../../../data/provincesData.json";

/**
 * Hook sử dụng dữ liệu tỉnh thành + phường/xã từ file local (provincesData.json).
 * Không cần gọi API, hoạt động offline hoàn toàn.
 */
export const useProvinces = () => {
  const [wards, setWards] = useState([]);

  // Lấy phường/xã theo province code từ local data
  const fetchWards = (provinceCode) => {
    if (!provinceCode) {
      setWards([]);
      return;
    }
    const province = provincesData.find((p) => p.code === parseInt(provinceCode));
    setWards(province ? province.wards : []);
  };

  return {
    provinces: provincesData,       // 34 tỉnh thành
    wards,                          // phường/xã của tỉnh đang chọn
    loadingProvinces: false,        // không cần loading vì dùng local
    loadingWards: false,
    fetchWards,
  };
};
