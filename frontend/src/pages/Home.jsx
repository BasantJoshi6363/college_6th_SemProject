import React, { useContext, useEffect, useState } from 'react'
import FlashSale from '../components/FlashSale'
import axios from 'axios';
import CategoryCard from '../components/CategoryCard';
import CategorySection from '../components/CategorySection';
import ExploreProducts from '../components/ExploreOurProduct';
import BestSellingProduct from '../components/BestSellingProducts';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductContext from '../context/ProductContext';
// import { ProductContext } from '../context/ProductContext';

const Home = () => {

    const { loading, products } = useContext(ProductContext);
    // console.log(products)
    if (loading) {
        return (
            <LoadingSpinner />

        );
    }
     const flashSaleProducts = products.filter(product => product.isFlash);

    // if(loading && <><h1>Loading...</h1></>)
    return (
        <div>
            <FlashSale products={flashSaleProducts} />
            <CategorySection />
            <ExploreProducts products={products} />
            <BestSellingProduct products={products} />
        </div>
    )
}

export default Home