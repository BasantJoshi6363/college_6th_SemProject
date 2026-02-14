import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Smartphone,
  Monitor,
  Watch,
  Camera,
  Headphones,
  Gamepad2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import CategoryCard from "./CategoryCard";
import ProductCard from "./ProductCard";
import ProductContext from "../context/ProductContext";
import { memo } from "react";


const categories = [
  { id: "phone", label: "Phone", icon: Smartphone },
  { id: "computer", label: "Computers", icon: Monitor },
  { id: "smartwatch", label: "SmartWatch", icon: Watch },
  { id: "camera", label: "Camera", icon: Camera },
  { id: "headphone", label: "HeadPhones", icon: Headphones },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
];

const CategorySection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const { products } = useContext(ProductContext);
  // console.log(products)

  const activeCategory = categories[activeIndex].id;

  // Filter products by category
  const filteredProducts = products.filter(
    (product) =>
      product.category?.toLowerCase() === activeCategory.toLowerCase()
  );

  // Auto scroll to active
  useEffect(() => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const item = container.children[activeIndex];

    if (item) {
      container.scrollTo({
        left: item.offsetLeft - 16,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? categories.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === categories.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 border-b border-gray-200">
      {/* Header */}
      <div className="mb-14 flex items-end justify-between">
        <div>
          <div className="mb-4 flex items-center gap-4">
            <div className="h-10 w-5 rounded bg-[#DB4444]" />
            <span className="font-semibold text-[#DB4444]">Categories</span>
          </div>
          <h2 className="text-4xl font-bold tracking-wider">
            Browse By Category
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="h-12 w-12 flex items-center justify-center rounded-full bg-[#F5F5F5] hover:bg-gray-200"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="h-12 w-12 flex items-center justify-center rounded-full bg-[#F5F5F5] hover:bg-gray-200"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* Category Scroll */}
      <div
        ref={scrollRef}
        className="flex gap-7 overflow-x-auto scrollbar-hide"
      >
        {categories.map((cat, index) => (
          <CategoryCard
            key={cat.id}
            icon={cat.icon}
            label={cat.label}
            isActive={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {/* Products Grid */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No products found in this category.
          </p>
        )}
      </div>
    </section>
  );
};

export default memo(CategorySection);
