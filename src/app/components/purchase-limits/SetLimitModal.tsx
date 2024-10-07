import React, { useState, useEffect } from 'react';

interface SetLimitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSetLimit: (limitData: {
        limit: number | 'token-owned',
        blockchain?: string,
        contractAddress?: string
    }) => void;
    productName: string;
}

const SetLimitModal: React.FC<SetLimitModalProps> = ({ isOpen, onClose, onSetLimit, productName }) => {
    const [quantityLimit, setQuantityLimit] = useState<number>(1);
    const [limitType, setLimitType] = useState<'manual' | 'token-owned'>('manual');
    const [blockchain, setBlockchain] = useState<string>('Ethereum');
    const [contractAddress, setContractAddress] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setQuantityLimit(1);
            setLimitType('manual');
            setBlockchain('Ethereum');
            setContractAddress('');
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (limitType === 'manual') {
            onSetLimit({ limit: quantityLimit });
        } else {
            if (!contractAddress.trim()) {
                setError('Contract address is required for token-owned limit');
                return;
            }
            onSetLimit({
                limit: 'token-owned',
                blockchain,
                contractAddress: contractAddress.trim()
            });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-1/3">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add Quantity Limit</h2>
                </div>
                <div className="mb-4">
                    <div className="flex items-center mb-4 justify-between">
                        <div>
                        <input
                            type="radio"
                            id="manual-limit"
                            name="limit-type"
                            checked={limitType === 'manual'}
                            onChange={() => setLimitType('manual')}
                            className="mr-2"
                        />
                        <label htmlFor="manual-limit">Manually set quantity Limit :</label>
                        </div>
                        <input
                            type="number"
                            value={quantityLimit}
                            onChange={(e) => setQuantityLimit(Number(e.target.value))}
                            min="1"
                            className="border p-1 ml-2 w-16 rounded-md border-black-400"
                            disabled={limitType !== 'manual'}
                        />
                    </div>
                    <div className="flex items-center mb-4">
                        <input
                            type="radio"
                            id="token-owned-limit"
                            name="limit-type"
                            checked={limitType === 'token-owned'}
                            onChange={() => setLimitType('token-owned')}
                            className="mr-2"
                        />
                        <label htmlFor="token-owned-limit">Limit by token-owned tokens owned</label>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Blockchain</label>
                    <select
                        value={blockchain}
                        onChange={(e) => setBlockchain(e.target.value)}
                        className="w-full border p-2 rounded"
                        disabled={limitType !== 'token-owned'}
                    >
                        <option value="Ethereum">Ethereum</option>
                        {/* Add other blockchain options here */}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Contract Address</label>
                    <input
                        type="text"
                        value={contractAddress}
                        onChange={(e) => {
                            setContractAddress(e.target.value);
                            setError(null);
                        }}
                        className={`w-full border p-2 rounded ${error ? 'border-red-500' : ''}`}
                        placeholder="0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB"
                        disabled={limitType !== 'token-owned'}
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>
                <div className="flex justify-end">
                    <button
                        className="bg-gray-300 px-4 py-2 rounded mr-2"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SetLimitModal;