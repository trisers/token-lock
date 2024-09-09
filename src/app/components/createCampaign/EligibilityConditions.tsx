import React, { useState } from 'react';
import { Pencil, X } from 'lucide-react';

interface EligibilityConditionsProps {
  eligibilityConditions: any[];
  onConditionsChange: (value: any[]) => void;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

interface AddConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: string, data: any, editIndex?: number) => void;
  editCondition?: any;
  editIndex?: number;
}

interface OwnTokenData {
  platform: string;
  quantity: string;
  contractAddress: string;
  tokenIds: string[];
}

interface AddressListData {
  operator: string;
  walletAddresses: string[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/2 max-h-[80vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const AddConditionModal: React.FC<AddConditionModalProps> = ({ isOpen, onClose, onSave, editCondition, editIndex }) => {
  const [activeTab, setActiveTab] = useState(editCondition ? editCondition.type : 'ownToken');
  const [ownTokenData, setOwnTokenData] = useState<OwnTokenData>(
    editCondition && editCondition.type === 'ownToken'
      ? editCondition
      : { platform: 'Ethereum', quantity: '1', contractAddress: '', tokenIds: [] }
  );

  const [addressListData, setAddressListData] = useState<AddressListData>(
    editCondition && editCondition.type === 'addressList'
      ? editCondition
      : { operator: 'Includes', walletAddresses: [] }
  );

  const [tempTokenId, setTempTokenId] = useState('');
  const [tempWalletAddress, setTempWalletAddress] = useState('');

  const handleSave = () => {
    const data = activeTab === 'ownToken' ? ownTokenData : addressListData;
    onSave(activeTab, data, editIndex);
    onClose();
  };

  const addTokenId = () => {
    if (tempTokenId.trim()) {
      setOwnTokenData({ ...ownTokenData, tokenIds: [...ownTokenData.tokenIds, tempTokenId.trim()] });
      setTempTokenId('');
    }
  };

  const removeTokenId = (index: number) => {
    const newTokenIds = ownTokenData.tokenIds.filter((_, i) => i !== index);
    setOwnTokenData({ ...ownTokenData, tokenIds: newTokenIds });
  };

  const addWalletAddress = () => {
    if (tempWalletAddress.trim()) {
      setAddressListData({ ...addressListData, walletAddresses: [...addressListData.walletAddresses, tempWalletAddress.trim()] });
      setTempWalletAddress('');
    }
  };

  const removeWalletAddress = (index: number) => {
    const newWalletAddresses = addressListData.walletAddresses.filter((_, i) => i !== index);
    setAddressListData({ ...addressListData, walletAddresses: newWalletAddresses });
  };

  const clearAllTokens = () => {
    setOwnTokenData({ ...ownTokenData, tokenIds: [] });
  };

  const clearAllWalletAddresses = () => {
    setAddressListData({ ...addressListData, walletAddresses: [] });
  };

  const isSaveEnabled = () => {
    if (activeTab === 'ownToken') {
      return ownTokenData.contractAddress.trim() !== '' && ownTokenData.tokenIds.length > 0;
    } else {
      return addressListData.walletAddresses.length > 0;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">{editCondition ? 'Edit' : 'Add'} Condition</h2>
      <div className="mb-4">
        <button
          className={`mr-2 px-3 rounded-md py-1 ${activeTab === 'ownToken' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('ownToken')}
        >
          Own Token
        </button>
        <button
          className={`px-3 py-1 rounded-md ${activeTab === 'addressList' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('addressList')}
        >
          Address List
        </button>
      </div>
      {activeTab === 'ownToken' ? (
        <div className="space-y-4">
          <p className="text-sm text-blue-600">Enter the Ethereum or Solana NFT contract address.</p>
          <div className="flex justify-between">
            <div className="w-full pr-2">
              <label className="block mb-1">Platform</label>
              <select
                value={ownTokenData.platform}
                onChange={(e) => setOwnTokenData({ ...ownTokenData, platform: e.target.value })}
                className="border p-2 rounded w-full"
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Solana">Solana</option>
              </select>
            </div>
            <div className="w-sm pl-2">
              <label className="block mb-1">Quantity</label>
              <input
                type="number"
                placeholder="Quantity"
                value={ownTokenData.quantity}
                onChange={(e) => setOwnTokenData({ ...ownTokenData, quantity: e.target.value })}
                className="border p-2 rounded w-[130px]"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1">Contract Address</label>
            <input
              placeholder="Contract Address"
              value={ownTokenData.contractAddress}
              onChange={(e) => setOwnTokenData({ ...ownTokenData, contractAddress: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Token IDs (optional)</label>
            <div className='flex gap-2'>
              <input
                placeholder="Enter Token ID"
                value={tempTokenId}
                onChange={(e) => setTempTokenId(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                className='px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300'
                onClick={addTokenId}
                disabled={!tempTokenId.trim()}
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div>
                {ownTokenData.tokenIds.map((tokenId, index) => (
                  <span key={index} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {tokenId}
                    <button onClick={() => removeTokenId(index)} className="ml-1 text-gray-500 hover:text-gray-700">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              {ownTokenData.tokenIds.length > 0 && (
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={clearAllTokens}
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-blue-600">Enter wallet addresses to include or exclude.</p>
          <div>
            <label className="block mb-1">Operator</label>
            <select
              value={addressListData.operator}
              onChange={(e) => setAddressListData({ ...addressListData, operator: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="Includes">Includes</option>
              <option value="Excludes">Excludes</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Wallet Addresses</label>
            <div className='flex gap-2'>
              <input
                placeholder="Enter Wallet Address"
                value={tempWalletAddress}
                onChange={(e) => setTempWalletAddress(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                className='px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300'
                onClick={addWalletAddress}
                disabled={!tempWalletAddress.trim()}
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div>
                {addressListData.walletAddresses.map((address, index) => (
                  <span key={index} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {address}
                    <button onClick={() => removeWalletAddress(index)} className="ml-1 text-gray-500 hover:text-gray-700">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              {addressListData.walletAddresses.length > 0 && (
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={clearAllWalletAddresses}
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-end space-x-2 mt-4">
        <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
          onClick={handleSave}
          disabled={!isSaveEnabled()}
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

const EligibilityConditions: React.FC<EligibilityConditionsProps> = ({
  eligibilityConditions,
  onConditionsChange,
}) => {
  const [conditionType, setConditionType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState<{ condition: any; index: number } | null>(null);

  const handleConditionTypeChange = (type: string) => {
    setConditionType(type);
  };

  const handleAddCondition = (type: string, data: any, editIndex?: number) => {
    if (editIndex !== undefined) {
      const newConditions = [...eligibilityConditions];
      newConditions[editIndex] = { type, ...data };
      onConditionsChange(newConditions);
    } else {
      const newCondition = { type, ...data };
      onConditionsChange([...eligibilityConditions, newCondition]);
    }
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = eligibilityConditions.filter((_, i) => i !== index);
    onConditionsChange(newConditions);
  };

  const handleEditCondition = (condition: any, index: number) => {
    setEditingCondition({ condition, index });
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className='flex justify-between mb-5'>
        <h2 className="text-lg font-bold">ELIGIBILITY CONDITIONS</h2>
        <button
          onClick={() => {
            setEditingCondition(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Condition
        </button>
      </div>
      <div className="flex items-center mb-4">
        <select
          className="mr-2 px-3 py-2 border border-gray-300 rounded"
          value={conditionType}
          onChange={(e) => handleConditionTypeChange(e.target.value)}
        >
          <option value="all">All</option>
          <option value="any">Any</option>
        </select>
        <span>Shoppers who meet the following condition(s) are eligible for this campaign</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">Please add at least one condition in order to proceed</p>
      <div className="bg-gray-50 rounded p-4">
        {eligibilityConditions.map((condition, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b">
            <div>
              <span className="font-semibold mr-2">{index + 1}. {condition.type}</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                {condition.type === 'addressList' ? condition.operator : 'Includes'}
              </span>
            </div>
            <div>
              <button className="text-gray-600 hover:text-gray-800 mr-2" onClick={() => handleEditCondition(condition, index)}>
                <Pencil size={18} />
              </button>
              <button className="text-gray-600 hover:text-gray-800" onClick={() => handleRemoveCondition(index)}>
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <AddConditionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCondition(null);
        }}
        onSave={handleAddCondition}
        editCondition={editingCondition?.condition}
        editIndex={editingCondition?.index}
      />
    </div>
  );
};

export default EligibilityConditions;