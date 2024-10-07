import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface Product {
  id: number;
  name: string;
}

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProducts: (products: Product[]) => void;
  existingProducts: Product[];
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectProducts,
  existingProducts
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [products] = useState([
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

  useEffect(() => {
    if (isOpen) {
      setSelectedProducts([]);
      setErrorMessage(null);
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (product: Product) => {
    if (existingProducts.some(p => p.id === product.id)) {
      setErrorMessage(`Purchase limit for "${product.name}" already exists`);
      setSelectedProducts([]);
    } else {
      setSelectedProducts([product]);
      setErrorMessage(null);
    }
  };

  const handleAddClick = () => {
    if (selectedProducts.length > 0) {
      if (existingProducts.some(p => p.id === selectedProducts[0].id)) {
        setErrorMessage(`Purchase limit for "${selectedProducts[0].name}" already exists`);
      } else {
        onSelectProducts(selectedProducts);
        handleClose();
      }
    }
  };

  const handleClose = () => {
    setSelectedProducts([]);
    setErrorMessage(null);
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Add product</h2>
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 pl-10 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}
        <div className="max-h-60 overflow-y-auto mb-4">
          {filteredProducts.map((product) => (
            <label key={product.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedProducts.some(p => p.id === product.id)}
                onChange={() => handleProductSelect(product)}
                className="mr-2"
                disabled={existingProducts.some(p => p.id === product.id)}
              />
              <span className={existingProducts.some(p => p.id === product.id) ? 'text-gray-400' : ''}>
                {product.name}
              </span>
            </label>
          ))}
        </div>
        <div className="flex justify-end">
          <button onClick={handleClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button onClick={handleAddClick} className="px-4 py-2 bg-blue-500 text-white rounded">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelectionModal;