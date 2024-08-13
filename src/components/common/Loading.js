import React from 'react';
import { useSelector } from 'react-redux';

const Loading = () => {
    const loading = useSelector((state) => state.loading);
    console.log(loading);
    if (!loading.isLoading) return null;
    return (
        // <div className="fixed inset-0  bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50">
        //     <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        // </div>
        <></>
    );
};

export default Loading;
