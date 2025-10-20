import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">DataAging</h2>
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;