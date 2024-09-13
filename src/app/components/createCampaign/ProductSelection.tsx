import React, { useState, useEffect, useCallback } from 'react';

interface Product {
  id: number;
  name: string;
}

interface ProductSelectionProps {
  autoActivate: boolean;
  onAutoActivateChange: (value: boolean) => void;
  onProductsChange: (value: number[]) => void;
  onProductSelectionTypeChange: (selectionType: 'all' | 'selected') => void;
  initialSelectedProducts: number[];
  initialProductSelectionType: 'all' | 'selected';
}

const ProductSelection: React.FC<ProductSelectionProps> = ({
  autoActivate,
  onAutoActivateChange,
  onProductsChange,
  onProductSelectionTypeChange,
  initialSelectedProducts,
  initialProductSelectionType,
}) => {
  const [productSelectionType, setProductSelectionType] = useState<'all' | 'selected'>(initialProductSelectionType);
  const [selectedProducts, setSelectedProducts] = useState<number[]>(initialSelectedProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tempSelectedProducts, setTempSelectedProducts] = useState<number[]>([]);
  const [searchProduct, setSearchProduct] = useState('');

  const products: Product[] = [
    { id: 1, name: 'Standard Printed T-shirt' },
    { id: 2, name: 'Sleeved Printed T-shirt' },
    { id: 3, name: 'Mesh Ergonomic Black Chair' },
    { id: 4, name: 'Fantastic Typography Mug' },
    { id: 5, name: 'Techni Black Bluetooth Soundbar' },
    { id: 6, name: 'Boost Master AFS0029' },
    { id: 7, name: 'Iron 1000 W Dry' },
  ];

  const productsPerPage = 5;
  const totalPages = Math.ceil(selectedProducts.length / productsPerPage);

  const updateSelectedProducts = useCallback((newSelectedProducts: number[]) => {
    setSelectedProducts(newSelectedProducts);
    onProductsChange(newSelectedProducts);
  }, [onProductsChange]);

  useEffect(() => {
    if (productSelectionType === 'all') {
      const allProductIds = products.map(p => p.id);
      // Only update selected products if they haven't already been set
      if (selectedProducts.length !== allProductIds.length) {
        updateSelectedProducts(allProductIds);
      }
    }
  }, [productSelectionType, products, selectedProducts.length, updateSelectedProducts]);
  

  const handleSelectionTypeChange = (type: 'all' | 'selected') => {
    setProductSelectionType(type);
    onProductSelectionTypeChange(type);
    if (type === 'all') {
      const allProductIds = products.map(p => p.id);
      updateSelectedProducts(allProductIds);
    } else {
      updateSelectedProducts([]);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    const updatedProducts = selectedProducts.filter(id => id !== productId);
    updateSelectedProducts(updatedProducts);
  };

  const handleProductSelect = (productId: number) => {
    setTempSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSaveProducts = () => {
    updateSelectedProducts(tempSelectedProducts);
    setIsModalOpen(false);
    setCurrentPage(1);
    setSearchProduct('');
  };

  const handleOpenModal = () => {
    setTempSelectedProducts(selectedProducts);
    setIsModalOpen(true);
  };

  const mainPageProducts = products.filter(p => selectedProducts.includes(p.id))
    .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );


  return (
    <div className="space-y-4">
      <h2 className="text-lg mb-2">Product</h2>
      <div className="flex items-center space-x-2 mt-4">
        <input
          type="checkbox"
          id="auto-activate"
          checked={autoActivate}
          onChange={(e) => onAutoActivateChange(e.target.checked)}
          className="form-checkbox h-5 w-5 text-blue-600 mb-4"
        />
        <label htmlFor="auto-activate" className="text-sm text-gray-700 mb-4">
          Automatically activate and archive products based on the campaign Start Date and End Date
        </label>
      </div>
      <p className="text-sm text-gray-600">Please select products to include in this campaign</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          className={`p-4 rounded-lg text-center ${productSelectionType === 'all'
            ? 'bg-blue-50 border-2 border-blue-500'
            : 'border border-gray-300'
          }`}
          onClick={() => handleSelectionTypeChange('all')}
        >
          <h3 className={`font-semibold mb-4 ${productSelectionType === 'all' ? 'text-blue-600' : 'text-[#626E7F]'
            }`}>All Products</h3>
          <p className="text-sm text-[#626E7F]">Add all products to your campaign</p>
        </button>
        <button
          className={`p-4 rounded-lg text-center ${productSelectionType === 'selected'
            ? 'bg-blue-50 border-2 border-blue-500'
            : 'border border-gray-300'
          }`}
          onClick={() => handleSelectionTypeChange('selected')}
        >
          <h3 className={`font-semibold mb-4 ${productSelectionType === 'selected' ? 'text-blue-600' : 'text-[#626E7F]'
            }`}>Selected Products</h3>
          <p className="text-sm text-[#626E7F]">Select particular products to add to our campaign</p>
        </button>
      </div>
      <div className="h-8"></div>
      {productSelectionType === 'selected' && (
        <div className="bg-white shadow-md shadow-gray-300 border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg">Selected Products</h3>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
              onClick={handleOpenModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Products
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-2 font-normal">Product Name</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {mainPageProducts.map((product) => (
                <tr key={product.id} className="border-t border-gray-200">
                  <td className="py-3 flex items-center">
                    <span className="text-sm">{product.name}</span>
                  </td>
                  <td className="text-right">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => handleRemoveProduct(product.id)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Showing {(currentPage - 1) * productsPerPage + 1} - {Math.min(currentPage * productsPerPage, selectedProducts.length)} of {selectedProducts.length} Results
            </span>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded-md"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'border border-gray-300'} rounded-md`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 border border-gray-300 rounded-md"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {productSelectionType === 'all' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">All products have been selected for this campaign.</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-2/3 max-h-[80vh] flex flex-col">
            <h2 className="text-xl font-bold mb-4">Add Products</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="overflow-y-auto flex-grow">
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="text-left text-gray-600">
                    <th className="pb-2 font-normal">Product Name</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-t border-gray-200">
                      <td className="py-3 flex items-center">
                        <input
                          type="checkbox"
                          id={`modal-product-${product.id}`}
                          checked={tempSelectedProducts.includes(product.id)}
                          onChange={() => handleProductSelect(product.id)}
                          className="form-checkbox h-5 w-5 text-blue-600 mr-3"
                        />
                        <label htmlFor={`modal-product-${product.id}`} className="text-sm">
                          {product.name}
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setIsModalOpen(false);
                  setSearchProduct('');
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleSaveProducts}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSelection;