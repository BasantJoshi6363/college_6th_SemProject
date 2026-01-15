import React, { useEffect, useState } from 'react'
import FlashSale from '../components/FlashSale'
import axios from 'axios';
import CategoryCard from '../components/CategoryCard';
import CategorySection from '../components/CategorySection';
import ExploreProducts from '../components/ExploreOurProduct';
import BestSellingProduct from '../components/BestSellingProducts';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
    const [result,setResult] = useState([]);
    const [loading,setLoading] = useState(false);
    const fetchProduct = async ()=>{
        setLoading(true);
        try {
            const response = await axios.get("https://dummyjson.com/products?limit=4");
            setResult(response.data.products);
            setLoading(false)
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    }
    useEffect(()=>{
        fetchProduct();
    },[]);

    if (loading) {
    return (
      <LoadingSpinner/>

    );
  }

    // if(loading && <><h1>Loading...</h1></>)
  return (
    <div>
        <FlashSale products={result}/>
        <CategorySection/>
        <ExploreProducts products={result}/>
        <BestSellingProduct products={result}/>
    </div>
  )
}

export default Home