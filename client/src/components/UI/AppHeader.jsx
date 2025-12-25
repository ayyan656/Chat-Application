import React from 'react';

const AppHeader = () => { 
    return (
        <div className="flex justify-between items-center p-4 lg:p-6"> 
            <h1 className="text-2xl font-bold text-gray-800">Chat ONN</h1>
            <p className="text-gray-500 text-sm hidden sm:block">Create memorable talks</p>
        </div>
    );
};

export default AppHeader;