
import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-[#445372] mb-6">Inventory Management System</h1>
        <p className="text-xl text-gray-600 mb-8">
          A comprehensive platform for managing your inventory efficiently
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-[#00859e] text-white rounded-md hover:bg-[#00859e]/90 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 border border-[#445372] text-[#445372] rounded-md hover:bg-gray-50 transition-colors"
          >
            Manage Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
