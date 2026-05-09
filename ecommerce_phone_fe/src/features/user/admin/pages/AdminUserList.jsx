import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../../service/axiosClient";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
     
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (user) => {
    if (!window.confirm("Bạn có chắc muốn xoá user này?")) return;

    try {
      await axiosClient.delete(`/api/admin/users/${user.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
  };

  const handleChangeRole = async (user, newRole) => {
    if (!window.confirm("Bạn có chắc muốn đổi role?")) return;

    try {
      await axiosClient.put(`/api/admin/users/${user.id}`, {
        ...user,
        role: newRole,
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error(err);
      alert("Không đổi được role");
    }
  };

  const isSuperAdmin = (u) => u.role === "ROLE_SUPER_ADMIN";
  const isCurrentSuper = currentUser?.role === "ROLE_SUPER_ADMIN";

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">👤 Quản lý tài khoản</h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th>Email</th>
                <th>Tên</th>
                <th>SĐT</th>
                <th>Địa chỉ</th>
                <th>Role</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => {
                const targetIsSuper = isSuperAdmin(u);

                return (
                  <tr
                    key={u.id}
                    className={`border-t hover:bg-gray-50 ${
                      targetIsSuper ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="p-3">{u.id}</td>
                    <td>{u.email}</td>
                    <td>{u.name}</td>
                    <td>{u.phone || "-"}</td>
                    <td>{u.address || "-"}</td>

                    {/* ROLE SELECT */}
                    <td>
                      <select
                        value={u.role}
                        disabled={targetIsSuper} // SUPER ADMIN luôn khóa
                        onChange={(e) => handleChangeRole(u, e.target.value)}
                        className={`border px-2 py-1 rounded ${
                          targetIsSuper
                            ? "bg-red-100 text-red-600 font-semibold"
                            : ""
                        }`}
                      >
                        <option value="ROLE_USER">USER</option>
                        <option value="ROLE_ADMIN">ADMIN</option>

                        {/* nếu user đang là super admin thì phải hiển thị option */}
                        {targetIsSuper && (
                          <option value="ROLE_SUPER_ADMIN">SUPER ADMIN</option>
                        )}

                        {/* nếu người đăng nhập là super admin */}
                        {!targetIsSuper && isCurrentSuper && (
                          <option value="ROLE_SUPER_ADMIN">SUPER ADMIN</option>
                        )}
                      </select>
                    </td>

                    {/* ACTION BUTTONS */}
                    <td className="text-center space-x-2">
                      {/* EDIT BUTTON */}
                      <button
                        className={`px-3 py-1 rounded text-white 
                          ${
                            isCurrentSuper
                              ? "bg-yellow-600 hover:bg-yellow-700" 
                              : !targetIsSuper
                              ? "bg-blue-600 hover:bg-blue-700" 
                              : "bg-gray-400 cursor-not-allowed" 
                          }`}
                        disabled={
                          isCurrentSuper ? false : targetIsSuper 
                        }
                        onClick={() => {
                          if (!targetIsSuper || isCurrentSuper) {
                            navigate(`/admin/users/${u.id}`);
                          }
                        }}
                      >
                        Sửa
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        className={`
                          px-3 py-1 rounded text-white
                          ${
                            targetIsSuper
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600"
                          }
                        `}
                        disabled={targetIsSuper}
                        onClick={() => {
                          if (!targetIsSuper) handleDelete(u);
                        }}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="p-4 text-gray-500 text-center">Không có user nào</p>
          )}
        </div>
      )}
    </div>
  );
}
