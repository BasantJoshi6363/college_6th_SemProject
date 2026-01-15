
import React from 'react'
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("google-token");
    if(!token){
        return <Navigate to={"/login"}/>
    }

    

    return children;
  
}

export default ProtectedRoute