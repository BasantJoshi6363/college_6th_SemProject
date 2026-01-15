import React from 'react';

const FormField = ({ label, placeholder, required = false, type = "text" }) => (
  <div className="flex flex-col gap-2 w-full max-w-[470px]">
    <label className="text-gray-400 text-base font-light">
      {label}{required && <span className="text-[#DB4444] ml-1">*</span>}
    </label>
    <input 
      type={type} 
      placeholder={placeholder}
      className="bg-[#F5F5F5] rounded py-3 px-4 focus:outline-none focus:ring-1 focus:ring-black/10"
    />
  </div>
);

export default FormField;