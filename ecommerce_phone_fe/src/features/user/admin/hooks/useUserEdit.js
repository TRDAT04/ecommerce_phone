import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminUserById, updateAdminUser, resetUserPassword } from "../api/adminUserService";

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
        alert("Không tải được user");
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
      alert("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) return alert("Nhập mật khẩu mới");
    if (!window.confirm("Bạn có chắc muốn reset mật khẩu user này?")) return;
    try {
      await resetUserPassword(id, newPassword);
      alert("Reset mật khẩu thành công!");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert("Lỗi reset mật khẩu");
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