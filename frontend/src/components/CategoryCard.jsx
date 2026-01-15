import React from 'react';

const   CategoryCard = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        flex h-[145px] w-[170px] cursor-pointer flex-col items-center justify-center gap-4 rounded border transition-all duration-300
        ${isActive 
          ? 'border-[#DB4444] bg-[#DB4444] text-white shadow-lg' 
          : 'border-gray-300 bg-white text-black hover:border-[#DB4444] hover:bg-[#DB4444] hover:text-white'
        }
      `}
    >
      <Icon size={56} strokeWidth={1.2} />
      <span className="text-base font-normal">{label}</span>
    </div>
  );
};

export default CategoryCard;