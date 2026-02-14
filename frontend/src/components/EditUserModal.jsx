import React, { useState, useEffect } from "react";
import { X, Plus, Loader2 } from "lucide-react";

const EditUserModal = ({ user, currentUser, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    isAdmin: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        isAdmin: user.isAdmin || false,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSave(user._id, formData);
    } finally {
      setLoading(false);
    }
  };

  const isSelf = user._id === currentUser?._id;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold mb-4">Edit User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Name"
            required
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Email"
            required
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
              disabled={isSelf}
            />
            Admin Access
          </label>

          {isSelf && (
            <p className="text-xs text-gray-500">
              You cannot change your own admin status.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus size={16} />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditUserModal);
