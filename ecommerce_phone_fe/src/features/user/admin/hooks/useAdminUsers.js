import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminUsers, deleteAdminUser, updateAdminUser } from "../api/adminUserService";
import { useAuthStore } from "../../../../store/authStore";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Lấy user từ Zustand store (persist key là "auth-store", KHÔNG phải "user")
  const currentUser = useAuthStore((s) => s.user);
  const isCurrentSuper = currentUser?.role === "ROLE_SUPER_ADMIN";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getAdminUsers();
        setUsers(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ================= SEARCH FILTER =================
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(q)
    );
  }, [users, search]);

  // ================= DELETE =================
  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc muốn xoá user này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy"
    });
    if (!result.isConfirmed) return;
    
    try {
      await deleteAdminUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success("Xóa thành công");
    } catch (err) {
      console.error(err);
      toast.error("Xóa thất bại");
    }
  };

  // ================= CHANGE ROLE =================
  const handleChangeRole = async (user, newRole) => {
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc muốn đổi role?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Không"
    });
    if (!result.isConfirmed) return;
    
    try {
      await updateAdminUser(user.id, { ...user, role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
      toast.success("Đổi role thành công");
    } catch (err) {
      console.error(err);
      toast.error("Không đổi được role");
    }
  };

  return {
    users,
    filteredUsers,
    loading,
    search,
    setSearch,
    isCurrentSuper,
    handleDelete,
    handleChangeRole,
    navigate,
  };
};