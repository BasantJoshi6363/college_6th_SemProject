import React from 'react'

const LoadingSpinner = () => {
    return (
        <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#DB4444]"></div>
        </div>
    )
}

export default LoadingSpinner;