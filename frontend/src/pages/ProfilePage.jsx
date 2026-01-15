import React, { useContext, useState } from 'react';
import FormField from '../components/FormField';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const nameParts = user?.name?.split(" ") || ["", ""];
  
  const [formData, setFormData] = useState({
    firstName: nameParts[0],
    lastName: nameParts[1] || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // 1. Password Match Validation
  if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
    return toast.error("New passwords do not match!");
  }

  // 2. Build Dynamic Payload
  const payload = {};
  const newFullName = `${formData.firstName} ${formData.lastName}`.trim();

  // Only add name if it changed
  if (newFullName !== user.name) {
    payload.name = newFullName;
  }

  // Only add email if it changed and isn't empty
  if (formData.email && formData.email !== user.email) {
    payload.email = formData.email;
  }

  // 3. Handle Password logic
  if (formData.currentPassword) {
    if (!formData.newPassword) {
      return toast.error("Please enter a new password");
    }
    payload.currentPassword = formData.currentPassword;
    payload.password = formData.newPassword;
  }

  // 4. Check if there is actually anything to update
  if (Object.keys(payload).length === 0) {
    return toast.error("No changes detected");
  }

  const success = await updateProfile(payload);
  if (success) {
    setFormData(prev => ({ 
      ...prev, 
      currentPassword: "", 
      newPassword: "", 
      confirmPassword: "" 
    }));
  }
};

  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      <div className="flex justify-between items-center mb-20">
        <div className="text-sm text-gray-500">
          <span>Home</span> <span className="mx-2">/</span> <span className="text-black">My Account</span>
        </div>
        <div className="text-sm">
          Welcome! <span className="text-[#DB4444] ml-1">{user?.name}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <aside className="w-full md:w-64">
          <SidebarItem label="Manage My Account" items={['My Profile']} activeItem="My Profile" />
          <h3 className="font-medium text-base text-black cursor-pointer hover:text-[#DB4444]">My WishList</h3>
        </aside>

        <main className="flex-1 bg-white shadow-sm rounded p-8 md:p-14 border border-gray-50">
          <h2 className="text-xl font-medium text-[#DB4444] mb-4">Edit Your Profile</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm">First Name</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} className="bg-[#F5F5F5] p-3 rounded outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm">Last Name</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} className="bg-[#F5F5F5] p-3 rounded outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm">Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} className="bg-[#F5F5F5] p-3 rounded outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm">Address</label>
                <input placeholder="Kathmandu, Nepal" className="bg-[#F5F5F5] p-3 rounded outline-none" />
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <label className="text-base font-normal">Password Changes</label>
              <input 
                name="currentPassword"
                type="password" 
                placeholder="Current Password" 
                value={formData.currentPassword}
                onChange={handleChange}
                className="bg-[#F5F5F5] rounded py-3 px-4 focus:outline-none w-full"
              />
              <input 
                name="newPassword"
                type="password" 
                placeholder="New Password" 
                value={formData.newPassword}
                onChange={handleChange}
                className="bg-[#F5F5F5] rounded py-3 px-4 focus:outline-none w-full"
              />
              <input 
                name="confirmPassword"
                type="password" 
                placeholder="Confirm New Password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                className="bg-[#F5F5F5] rounded py-3 px-4 focus:outline-none w-full"
              />
            </div>

            <div className="flex justify-end items-center gap-8 mt-4">
              <button type="button" onClick={() => window.location.reload()} className="text-black font-normal hover:underline">
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-[#DB4444] text-white px-12 py-4 rounded hover:bg-red-600 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};


const SidebarItem = ({ label, items, activeItem }) => (
  <div className="mb-6">
    <h3 className="font-medium text-base mb-3 text-black">{label}</h3>
    <ul className="flex flex-col gap-2 ml-4">
      {items.map((item) => (
        <li 
          key={item} 
          className={`cursor-pointer text-sm transition-colors hover:text-[#DB4444] ${
            activeItem === item ? 'text-[#DB4444]' : 'text-gray-500'
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default ProfilePage;