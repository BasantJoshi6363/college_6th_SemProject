import React, { useState, useContext, useCallback } from "react";
import { AdminContext } from "../context/AdminContext";
import EditUserModal from "../components/EditUserModal";
import { Package, Loader2, Edit, X, Delete } from "lucide-react";

// ---------------- USER ROW ----------------
export const UserRow = React.memo(
  ({ user, onDelete, onRoleToggle, onEdit, isSelf, loadingId }) => {
    const isLoading = loadingId === user._id;

    return (
      <tr className="border-b hover:bg-gray-50 transition-colors">
        <td className="py-4 px-4 flex items-center gap-3">
          <div className="bg-gray-100 p-2 rounded-full">
            <Package size={16} className="text-gray-600" />
          </div>
          <span className="font-medium text-black">{user.name}</span>
        </td>

        <td className="py-4 px-4 text-gray-500">{user.email}</td>

        <td className="py-4 px-4">
          <button
            disabled={isSelf || isLoading}
            onClick={() => onRoleToggle(user._id, user.isAdmin)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
              user.isAdmin
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-gray-100 text-gray-600 border border-gray-200"
            } ${
              isSelf || isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-80"
            }`}
          >
            {isLoading ? (
              <Loader2 size={12} className="animate-spin mx-auto" />
            ) : user.isAdmin ? (
              "ADMIN"
            ) : (
              "USER"
            )}
          </button>
        </td>

        <td className="py-4 px-4 text-right">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onEdit(user)}
              className="text-gray-400 hover:text-blue-600 transition-colors p-2"
            >
             <Edit size={18} />
            </button>

            {!isSelf && (
              <button
                onClick={() => onDelete(user._id)}
                className="text-[#DB4444] hover:bg-red-50 rounded-full transition-colors p-2"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  }
);

// ---------------- USERS TAB ----------------
const UsersTab = ({ currentUser }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const { users, deleteUser, updateUserRole, updateUser } =
    useContext(AdminContext);

  const handleToggleRole = useCallback(
    async (id, current) => {
      if (!window.confirm("Change access for this user?")) return;

      try {
        setLoadingId(id);
        await updateUserRole(id, !current);
      } finally {
        setLoadingId(null);
      }
    },
    [updateUserRole]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Delete this user?")) return;

      try {
        setLoadingId(id);
        await deleteUser(id);
      } finally {
        setLoadingId(null);
      }
    },
    [deleteUser]
  );

  const handleEditUser = useCallback(
    async (userId, userData) => {
      try {
        await updateUser(userId, userData);
        setEditingUser(null);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },
    [updateUser]
  );

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-6">
        User Management ({users.length})
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F5F5F5] text-xs uppercase text-gray-600 font-bold">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Authorization</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <UserRow
                  key={u._id}
                  user={u}
                  onRoleToggle={handleToggleRole}
                  onDelete={handleDelete}
                  onEdit={setEditingUser}
                  isSelf={u._id === currentUser?._id}
                  loadingId={loadingId}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          currentUser={currentUser}
          onClose={() => setEditingUser(null)}
          onSave={handleEditUser}
        />
      )}
    </div>
  );
};

export default UsersTab;
