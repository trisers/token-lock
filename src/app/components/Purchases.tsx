"use client";

import React, { useState, useEffect } from 'react';

interface Purchase {
  id: string;
  product: string;
  date: string;
  price: number;
}

const ITEMS_PER_PAGE = 10;

const Purchases: React.FC = () => {

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPurchases = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPurchases([
        { id: '1', product: 'Snowboard', date: '2024-03-15', price: 299.99 },
        { id: '2', product: 'Ski Boots', date: '2024-03-10', price: 199.99 },
        { id: '3', product: 'Goggles', date: '2024-03-05', price: 89.99 },
        { id: '4', product: 'Helmet', date: '2024-02-28', price: 129.99 },
        { id: '5', product: 'Gloves', date: '2024-02-20', price: 49.99 },
        { id: '6', product: 'Ski Jacket', date: '2024-02-15', price: 249.99 },
        { id: '7', product: 'Ski Pants', date: '2024-02-10', price: 179.99 },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = purchases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(purchases.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="max-w-full mx-auto p-6 border mt-4 bg-white shadow-lg rounded-lg">
      <p className="mb-4">Purchases made by shoppers with TokenLock connected.</p>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : currentItems.length > 0 ? (
        <>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="">
                <th className="border-b px-4 py-2 text-left">Product</th>
                <th className="border-b px-4 py-2 text-left">Date</th>
                <th className="border-b px-4 py-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((purchase) => (
                <tr key={purchase.id} className="border-b">
                  <td className="px-4 py-2">{purchase.product}</td>
                  <td className="px-4 py-2">{purchase.date}</td>
                  <td className="px-4 py-2">${purchase.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-blue-500 hover:text-blue-700'}`}
            >
              ◄
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-blue-500 hover:text-blue-700'}`}
            >
              ►
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-center text-gray-500">No Data Found</p>
        </div>
      )}
    </div>
  );
};

export default Purchases;