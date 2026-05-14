import { useState, useEffect } from "react";
import { getAdminReviews, deleteAdminReview } from "../api/adminReviewService";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export const useAdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination & Search
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        keyword,
        page,
        size
      };
      const res = await getAdminReviews(params);
      setReviews(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (error) {
      console.error(error);
      toast.error("Không tải được danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, size]); // only fetch on page/size change or manual call

  const handleSearch = () => {
    setPage(0); // reset to first page on search
    fetchReviews();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc muốn xoá đánh giá này? Điểm đánh giá của sản phẩm sẽ được tính lại.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy"
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await deleteAdminReview(id);
      toast.success("Xóa đánh giá thành công!");
      fetchReviews(); // refresh
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return {
    reviews,
    loading,
    keyword,
    setKeyword,
    page,
    totalPages,
    handleSearch,
    handlePageChange,
    handleDelete,
    fetchReviews
  };
};
