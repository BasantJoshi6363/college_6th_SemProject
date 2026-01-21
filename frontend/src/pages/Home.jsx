import React, { useContext, useEffect, useState } from 'react'
import FlashSale from '../components/FlashSale'
import axios from 'axios';
import CategoryCard from '../components/CategoryCard';
import CategorySection from '../components/CategorySection';
import ExploreProducts from '../components/ExploreOurProduct';
import BestSellingProduct from '../components/BestSellingProducts';
import LoadingSpinner from '../components/LoadingSpinner';
import { ProductContext } from '../context/ProductContext';

const Home = () => {

    const { loading, dummyProducts } = (useContext(ProductContext));
    if (loading) {
        return (
            <LoadingSpinner />

        );
    }

    // if(loading && <><h1>Loading...</h1></>)
    return (
        <div>
            <FlashSale products={dummyProducts} />
            <CategorySection />
            <ExploreProducts products={dummyProducts} />
            <BestSellingProduct products={dummyProducts} />
        </div>
    )
}

export default Home