import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminUsers, deleteAdminUser, updateAdminUser } from "../api/adminUserService";

export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));
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
    if (!window.confirm("Bạn có chắc muốn xoá user này?")) return;
    try {
      await deleteAdminUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
  };

  // ================= CHANGE ROLE =================
  const handleChangeRole = async (user, newRole) => {
    if (!window.confirm("Bạn có chắc muốn đổi role?")) return;
    try {
      await updateAdminUser(user.id, { ...user, role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error(err);
      alert("Không đổi được role");
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