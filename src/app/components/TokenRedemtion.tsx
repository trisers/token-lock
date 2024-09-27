"use client";

import React, { useState } from 'react';

interface Redemption {
  product: string;
  orderNumber: string;
  account: string;
  tokenId: number;
}

const initialRedemptions: Redemption[] = [
  { product: 'Snowboard Blue', orderNumber: '#1043', account: 'testing', tokenId: 298 },
  { product: 'Ski Red', orderNumber: '#1044', account: 'user1', tokenId: 299 },
  { product: 'Helmet Green', orderNumber: '#1045', account: 'user2', tokenId: 300 },
  { product: 'Goggles Yellow', orderNumber: '#1046', account: 'user3', tokenId: 301 },
  { product: 'Boots Black', orderNumber: '#1047', account: 'user4', tokenId: 302 },
  { product: 'Gloves White', orderNumber: '#1048', account: 'user5', tokenId: 303 },
  { product: 'Jacket Orange', orderNumber: '#1049', account: 'user6', tokenId: 304 },
];

const ITEMS_PER_PAGE = 5;

const TokenRedemptions: React.FC = () => {
  const [redemptions, setRedemptions] = useState(initialRedemptions);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = redemptions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(redemptions.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleRemoveProduct = (tokenId: number) => {
    setRedemptions((prevRedemptions) => 
      prevRedemptions.filter((redemption) => redemption.tokenId !== tokenId)
    );
    // Adjust current page if necessary
    if (currentItems.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 border mt-4 bg-white shadow-lg rounded-lg">
      <h3 className="text-2xl font-normal mb-4">Token Redemptions</h3>
      <p className="mb-4">All of the following tokens have been redeemed for physical products</p>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-white-100">
            <th className="border-b px-4 py-2 text-left font-medium">Product</th>
            <th className="border-b px-4 py-2 text-left font-medium">Order #</th>
            <th className="border-b px-4 py-2 text-left font-medium">Account</th>
            <th className="border-b px-4 py-2 text-left font-medium">Token ID</th>
            <th className="border-b px-4 py-2 text-left font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((redemption) => (
            <tr key={redemption.tokenId} className="border-b">
              <td className="px-4 py-2">{redemption.product}</td>
              <td className="px-4 py-2">{redemption.orderNumber}</td>
              <td className="px-4 py-2">{redemption.account}</td>
              <td className="px-4 py-2">{redemption.tokenId}</td>
              <td className="px-4 py-2 cursor-pointer">
                <button 
                  className='hover:text-red-600'
                  onClick={() => handleRemoveProduct(redemption.tokenId)}
                >
                  x
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
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
    </div>
  );
};

export default TokenRedemptions;