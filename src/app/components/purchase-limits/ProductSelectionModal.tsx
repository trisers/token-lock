"use client";

import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
}

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProducts: (products: Product[]) => void;
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({ isOpen, onClose, onSelectProducts }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [products] = useState<Product[]>([
    { id: 1, name: 'Snowboard' },
    { id: 2, name: 'Complete Snowboard' },
    { id: 3, name: 'Snowboard Blue' },
    { id: 4, name: 'Multi-location Snowboard' },
    { id: 5, name: 'Multi-managed Snowboard' },
    { id: 6, name: 'Snowboard' },
    { id: 7, name: 'Complete Snowboard' },
    { id: 8, name: 'Snowboard Blue' },
    { id: 9, name: 'Multi-location Snowboard' },
    { id: 10, name: 'Multi-managed Snowboard' },
  ]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (product: Product) => {
    setSelectedProducts(prevSelected => {
      const isAlreadySelected = prevSelected.some(p => p.id === product.id);
      if (isAlreadySelected) {
        return prevSelected.filter(p => p.id !== product.id);
      } else {
        return [product];
      }
    });
  };

  const handleAddClick = () => {
    if (selectedProducts.length > 0) {
      onSelectProducts(selectedProducts);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-2xl w-1/2">
      {/* <div className='bg-gray-300 w-full'> */}
        <h2 className="text-xl font-bold mb-4">Add product</h2>
        {/* </div> */}
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 w-full mb-6"
        />
        <div className="max-h-60 overflow-y-auto">
          {filteredProducts.map((product) => (
            <div key={product.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`product-${product.id}`}
                checked={selectedProducts.some(p => p.id === product.id)}
                onChange={() => handleProductSelect(product)}
                className="mr-2"
              />
              <label htmlFor={`product-${product.id}`}>{product.name}</label>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleAddClick}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelectionModal;