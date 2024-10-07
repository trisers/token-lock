import React from 'react';
import { Loader2 } from 'lucide-react';

interface Product {
  id: number;
  name: string;
}

interface PurchaseLimit {
  id: number;
  product: Product;
  quantityLimit: number | 'token-owned';
}

interface PurchaseLimitsTableProps {
  limits: PurchaseLimit[];
  onUpdateLimit: (id: number, newLimit: number | 'token-owned') => void;
  onDeleteLimit: (id: number) => void;
  changedLimits: { [key: number]: number | 'token-owned' };
}

const PurchaseLimitsTable: React.FC<PurchaseLimitsTableProps> = ({ limits, onUpdateLimit, onDeleteLimit, changedLimits }) => {
  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Product</th>
            <th className="px-4 py-2 text-right">Quantity Limit</th>
            <th className="px-2 py-2 text-left"></th>
          </tr>
        </thead>
      </table>
      <div className="max-h-60 overflow-y-auto">
        <table className="w-full">
          <tbody>
            {limits.map((limit) => {
              const currentLimit = changedLimits[limit.id] !== undefined ? changedLimits[limit.id] : limit.quantityLimit;
              return (
                <tr key={limit.id}>
                  <td className="px-4 py-2 text-left text-sm">{limit.product.name || 'Unknown Product'}</td>
                  <td className="px-4 py-2 text-right">
                    {currentLimit === 'token-owned' ? (
                      'Tokens Owned'
                    ) : (
                      <input
                        type="number"
                        value={currentLimit || ''}
                        min="1"
                        className="border p-1 w-28 rounded-md"
                        onChange={(e) => onUpdateLimit(limit.id, Number(e.target.value))}
                      />
                    )}
                  </td>
                  <td className="px-2 py-2 text-left">
                    <button className='hover:text-red-600' onClick={() => onDeleteLimit(limit.id)}>x</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseLimitsTable;