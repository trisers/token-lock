"use client";

import React, { useState, useEffect } from 'react';
import ProductSelectionModal from './ProductSelectionModal';
import SetLimitModal from './SetLimitModal';
import PurchaseLimitsTable from './PurchaseLimitsTable';
import Toast from '../Toast';
import { Loader2 } from 'lucide-react';
import LoadingSpinner from './PurchaseLimitsSkeleton';

interface Product {
  id: number;
  name: string;
}

interface PurchaseLimit {
  id: number;
  product: Product;
  quantityLimit: number | 'token-owned';
  blockchain?: string;
  contractAddress?: string;
}

const PurchaseLimitsComponent: React.FC = () => {
  const [isProductSelectionModalOpen, setIsProductSelectionModalOpen] = useState<boolean>(false);
  const [isSetLimitModalOpen, setIsSetLimitModalOpen] = useState<boolean>(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [purchaseLimits, setPurchaseLimits] = useState<PurchaseLimit[]>([]);
  const [changedLimits, setChangedLimits] = useState<{ [key: number]: number | 'token-owned' }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [limitToDelete, setLimitToDelete] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPurchaseLimits();
  }, []);


  const fetchPurchaseLimits = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/purchase-limits');
      if (!response.ok) throw new Error('Failed to fetch purchase limits');
      const data = await response.json();
      const formattedLimits: PurchaseLimit[] = data.map((limit: any) => ({
        id: limit.id,
        product: {
          id: limit.product_id,
          name: limit.product_name
        },
        quantityLimit: limit.tokens_owned ? 'token-owned' : limit.purchase_limit
      }));
      setPurchaseLimits(formattedLimits);
    } catch (error) {
      console.error('Error fetching purchase limits:', error);
      showToast('Failed to fetch purchase limits', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (products: Product[]) => {
    if (products.length > 0) {
      const selectedProduct = products[0];
      const existingLimit = purchaseLimits.find(limit => limit.product.id === selectedProduct.id);

      if (existingLimit) {
        showToast(`Purchase limit for "${selectedProduct.name}" already exists`, 'error');
        setIsProductSelectionModalOpen(false);
      } else {
        setSelectedProduct(selectedProduct);
        setIsProductSelectionModalOpen(false);
        setIsSetLimitModalOpen(true);
      }
    }
  };

  const handleSetLimit = async (limitData: {
    limit: number | 'token-owned';
    blockchain?: string;
    contractAddress?: string;
  }) => {
    if (selectedProduct) {
      const newLimit: PurchaseLimit = {
        product: selectedProduct,
        quantityLimit: limitData.limit,
        id: 0,
        blockchain: limitData.blockchain,
        contractAddress: limitData.contractAddress,
      };

      try {
        const response = await fetch('/api/purchase-limits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: selectedProduct.id,
            product_name: selectedProduct.name,
            purchase_limit: typeof limitData.limit === 'number' ? limitData.limit : null,
            tokens_owned: limitData.limit === 'token-owned',
            blockchain: limitData.blockchain,
            contract_address: limitData.contractAddress,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 409) {
            showToast(`Purchase limit for "${selectedProduct.name}" already exists`, 'error');
          } else {
            throw new Error(errorData.message || 'Failed to create purchase limit');
          }
        } else {
          const createdLimit = await response.json();
          setPurchaseLimits([...purchaseLimits, { ...newLimit, id: createdLimit.id }]);
          showToast('Purchase limit created successfully', 'success');
        }
      } catch (error) {
        console.error('Error creating purchase limit:', error);
        showToast('Failed to create purchase limit', 'error');
      }
    }
    setIsSetLimitModalOpen(false);
    setSelectedProduct(null);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
  };


  const handleUpdateLimit = (id: number, newLimit: number | 'token-owned') => {
    setChangedLimits({ ...changedLimits, [id]: newLimit });
  };

  const handleDeleteConfirmation = (id: number) => {
    setLimitToDelete(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleDeleteLimit = async () => {
    if (limitToDelete === null) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/purchase-limit-update/${limitToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete purchase limit');

      setPurchaseLimits(purchaseLimits.filter(limit => limit.id !== limitToDelete));
      const { [limitToDelete]: _, ...remainingChanges } = changedLimits;
      setChangedLimits(remainingChanges);
      showToast('Purchase limit deleted successfully', 'success');
    } catch (error) {
      setIsDeleting(false);
      console.error('Error deleting purchase limit:', error);
      showToast('Failed to delete purchase limit', 'error');
    }

    setIsDeleteConfirmationOpen(false);
    setLimitToDelete(null);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    for (const [id, newLimit] of Object.entries(changedLimits)) {
      const limitToUpdate = purchaseLimits.find(limit => limit.id === Number(id));
      if (!limitToUpdate) continue;

      try {
        const response = await fetch(`/api/purchase-limit-update/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: limitToUpdate.product.id,
            product_name: limitToUpdate.product.name,
            purchase_limit: typeof newLimit === 'number' ? newLimit : null,
            tokens_owned: newLimit === 'token-owned' ? 'token-owned' : false,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update purchase limit');
        }
      } catch (error) {
        console.error(`Error updating purchase limit ${id}:`, error);
        showToast('Failed to update purchase limits', 'error');
        setIsUpdating(false);
        return;
      }
    }

    // Update local state
    setPurchaseLimits(purchaseLimits.map(limit =>
      changedLimits[limit.id] !== undefined
        ? { ...limit, quantityLimit: changedLimits[limit.id] }
        : limit
    ));

    // Clear changed limits
    setChangedLimits({});
    showToast('Purchase limits updated successfully', 'success');
    setIsUpdating(false);
  };

  const handleCancel = () => {
    setChangedLimits({});
  };

  const isChanged = Object.keys(changedLimits).length > 0;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
        <div className="max-full mx-auto p-6 bg-white shadow-lg rounded-lg border">
        <div className='flex justify-between'>
          <h1 className="text-2xl font-normal mb-4">Purchase Limits</h1>
          <button
            className="bg-white-500 text-blue-500 px-4 py-2 rounded hover:text-blue-600 underline"
            onClick={() => setIsProductSelectionModalOpen(true)}
          >
            + Add Purchase Limits
          </button>
        </div>
        <p className='mb-6'>Set limits on the total of a given product shoppers may buy</p>
        <PurchaseLimitsTable
          limits={purchaseLimits}
          onUpdateLimit={handleUpdateLimit}
          onDeleteLimit={handleDeleteConfirmation}
          changedLimits={changedLimits}
          isLoading={isLoading}
        />
        <ProductSelectionModal
          isOpen={isProductSelectionModalOpen}
          onClose={() => setIsProductSelectionModalOpen(false)}
          onSelectProducts={handleProductSelect}
          existingProducts={purchaseLimits.map(limit => limit.product)}
        />
        <SetLimitModal
          isOpen={isSetLimitModalOpen}
          onClose={() => setIsSetLimitModalOpen(false)}
          onSetLimit={handleSetLimit}
          productName={selectedProduct?.name || ''}
        />
        {isDeleteConfirmationOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <p>Are you sure you want to delete this purchase limit?</p>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-gray-300 px-4 py-2 rounded mr-2"
                  onClick={() => setIsDeleteConfirmationOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
                  onClick={handleDeleteLimit}
                >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-6 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  ' Delete'
                )}
                 
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='flex justify-between mt-4'>
        <button
          className={`bg-white-500 text-black border ml-2 px-4 py-2 rounded ${!isChanged || isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleCancel}
          disabled={!isChanged || isUpdating}
        >
          Cancel
        </button>
        <button
          className={`bg-blue-500 hover:bg-blue-600 text-white mr-2 px-4 py-2 rounded flex items-center ${!isChanged || isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleUpdate}
          disabled={!isChanged || isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update'
          )}
        </button>
      </div>
      { toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default PurchaseLimitsComponent;