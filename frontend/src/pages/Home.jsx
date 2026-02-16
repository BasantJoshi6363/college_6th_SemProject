import React, { useContext, useEffect } from 'react'
import FlashSale from '../components/FlashSale'
import CategorySection from '../components/CategorySection';
import ExploreProducts from '../components/ExploreOurProduct';
import BestSellingProduct from '../components/BestSellingProducts';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductContext from '../context/ProductContext';
import { RecommendationContext } from '../context/ReccomendationContext';

const getRandomSlice = (arr, count) => {
    const maxStart = arr.length - count;
    const start = Math.floor(Math.random() * (maxStart + 1));
    return arr.slice(start, start + count);
};

const Home = () => {

    const { loading, products } = useContext(ProductContext);
    const { 
        recommendations, 
        fetchRecommendations 
    } = useContext(RecommendationContext);

    useEffect(() => {
        fetchRecommendations({ limit: 8 });
    }, [fetchRecommendations]);

    if (loading) {
        return <LoadingSpinner />;
    }

    const flashSaleProducts = products.filter(product => product.isFlash);

    // Random slices
    const exploreProducts = getRandomSlice(products, 8);
    const bestSellingProducts = getRandomSlice(products, 8);

    return (
        <div>
            <FlashSale products={flashSaleProducts} />

            {/* 🔥 Recommended Section */}
            {recommendations.length > 0 && (
                <ExploreProducts 
                    title="Recommended For You"
                    products={recommendations}
                />
            )}

            <CategorySection />
            <ExploreProducts products={exploreProducts} />
            <BestSellingProduct products={bestSellingProducts} />
        </div>
    )
}

export default Home;
