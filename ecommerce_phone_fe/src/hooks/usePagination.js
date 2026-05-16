import { useState } from "react";

/**
 * usePagination — hook phân trang dùng chung
 *
 * @param {Array}  data      — mảng dữ liệu cần phân trang
 * @param {number} pageSize  — số item mỗi trang (mặc định 10)
 *
 * @returns {Object}
 *   - paginatedData   : mảng items của trang hiện tại
 *   - page            : trang hiện tại
 *   - totalPages      : tổng số trang
 *   - setPage         : set trang thủ công
 *   - resetPage       : reset về trang 1 (dùng khi search/filter thay đổi)
 *   - handlePrev      : về trang trước
 *   - handleNext      : sang trang sau
 *   - getPageNumbers  : mảng số trang (có "..." khi cần)
 *   - rangeText       : chuỗi "X–Y trong Z" để hiển thị info
 */
export function usePagination(data = [], pageSize = 10) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

  const resetPage = () => setPage(1);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (page >= totalPages - 2)
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const rangeText = data.length === 0
    ? "0 kết quả"
    : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, data.length)} trong ${data.length}`;

  return {
    paginatedData,
    page,
    totalPages,
    setPage,
    resetPage,
    handlePrev,
    handleNext,
    getPageNumbers,
    rangeText,
  };
}