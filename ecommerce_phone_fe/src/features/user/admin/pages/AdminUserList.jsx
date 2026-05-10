import { Search } from "lucide-react";
import { useAdminUsers } from "../hooks/useAdminUsers";

export default function AdminUserList() {
  const {
    filteredUsers,
    loading,
    search,
    setSearch,
    isCurrentSuper,
    handleDelete,
    handleChangeRole,
    navigate,
  } = useAdminUsers();

  const isSuperAdmin = (u) => u.role === "ROLE_SUPER_ADMIN";

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-bold">👤 Quản lý tài khoản</h1>

      {/* SEARCH */}
      <div className="relative mb-5 max-w-md">
        <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên, email, số điện thoại..."
          className="w-full rounded-xl border py-2.5 pr-4 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow">
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
              {filteredUsers.map((u) => {
                const targetIsSuper = isSuperAdmin(u);

                return (
                  <tr
                    key={u.id}
                    className={`border-t hover:bg-gray-50 ${targetIsSuper ? "bg-red-50" : ""}`}
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
                        disabled={targetIsSuper}
                        onChange={(e) => handleChangeRole(u, e.target.value)}
                        className={`rounded border px-2 py-1 ${
                          targetIsSuper ? "bg-red-100 font-semibold text-red-600" : ""
                        }`}
                      >
                        <option value="ROLE_USER">USER</option>
                        <option value="ROLE_ADMIN">ADMIN</option>
                        {targetIsSuper && (
                          <option value="ROLE_SUPER_ADMIN">SUPER ADMIN</option>
                        )}
                        {!targetIsSuper && isCurrentSuper && (
                          <option value="ROLE_SUPER_ADMIN">SUPER ADMIN</option>
                        )}
                      </select>
                    </td>

                    {/* ACTION BUTTONS */}
                    <td className="space-x-2 text-center">
                      <button
                        disabled={isCurrentSuper ? false : targetIsSuper}
                        onClick={() => {
                          if (!targetIsSuper || isCurrentSuper)
                            navigate(`/admin/users/${u.id}`);
                        }}
                        className={`rounded px-3 py-1 text-white ${
                          isCurrentSuper
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : !targetIsSuper
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "cursor-not-allowed bg-gray-400"
                        }`}
                      >
                        Sửa
                      </button>

                      <button
                        disabled={targetIsSuper}
                        onClick={() => { if (!targetIsSuper) handleDelete(u); }}
                        className={`rounded px-3 py-1 text-white ${
                          targetIsSuper
                            ? "cursor-not-allowed bg-gray-400"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <p className="p-4 text-center text-gray-500">
              {search ? "Không tìm thấy kết quả" : "Không có user nào"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}