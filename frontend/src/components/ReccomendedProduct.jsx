import React, { useEffect, useState, useContext } from "react";
import { RecommendationContext } from "../context/ReccomendationContext";
import WishlistCard from "./WIshlistCard";

const RecommendedProduct = ({ excludeIds = [], limit = 4 }) => {
  const { getPersonalizedRecommendations, syncInteractions } = useContext(RecommendationContext);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inside RecommendedProducts.js useEffect
useEffect(() => {
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      // OPTION: Remove the localStorage cache logic entirely 
      // to see immediate changes after browsing products.
      
      const { data } = await axios.get(
        `${baseUrl}/recommendations?limit=12`, // Use the baseUrl from env
        { headers: { Authorization: `Bearer ${localStorage.getItem('google-token')}` } }
      );
      
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  fetchRecommendations();
}, []); // Empty dependency or [user] to refresh on login
  if (loading) return <div className="text-center py-10 text-gray-500">Loading recommendations...</div>;

  if (recommendedItems.length === 0)
    return (
      <div className="col-span-full text-center py-10 text-gray-500 border border-dashed rounded">
        Browse more products to get personalized recommendations!
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {recommendedItems.map((item) => (
        <WishlistCard key={item._id} product={item} isRecommendation={true} />
      ))}
    </div>
  );
};

export default RecommendedProduct;
