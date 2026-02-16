import React, { useEffect, useState, useContext } from "react";
import { RecommendationContext } from "../context/ReccomendationContext";
import WishlistCard from "./WIshlistCard";

const RecommendedProduct = ({ excludeIds = [], limit = 4 }) => {
  const { getPersonalizedRecommendations, syncInteractions } = useContext(RecommendationContext);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!excludeIds || excludeIds.length === 0) {
        setRecommendedItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        await syncInteractions();
        const recommendations = await getPersonalizedRecommendations(excludeIds, limit);
        setRecommendedItems(recommendations || []);
      } catch (error) {
        console.error("Recommendation error:", error);
        setRecommendedItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [excludeIds, limit, syncInteractions, getPersonalizedRecommendations]);

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
