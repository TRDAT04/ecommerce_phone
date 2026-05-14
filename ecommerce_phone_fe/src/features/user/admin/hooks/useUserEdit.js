import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminUserById, updateAdminUser, resetUserPassword } from "../api/adminUserService";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export const useUserEdit = (id) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // ================= LOAD =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getAdminUserById(id);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Không tải được user");
      }
    };
    fetchUser();
  }, [id]);

  // ================= AUTO HIDE SUCCESS =================
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [success]);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSuccess(false);
      await updateAdminUser(id, user);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) return toast.error("Nhập mật khẩu mới");
    
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc muốn reset mật khẩu user này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Không"
    });
    
    if (!result.isConfirmed) return;
    
    try {
      await resetUserPassword(id, newPassword);
      toast.success("Reset mật khẩu thành công!");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi reset mật khẩu");
    }
  };

  return {
    user,
    loading,
    success,
    newPassword,
    setNewPassword,
    handleChange,
    handleSubmit,
    handleResetPassword,
    navigate,
  };
};