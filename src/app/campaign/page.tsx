"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CampaignBasicInfo from '../components/createCampaign/CampaignBasicInfo';
import CampaignTypeSelector from '../components/createCampaign/CampaignTypeSelector';
import DiscountSection from '../components/createCampaign/DiscountSection';
import OfferDetails from '../components/createCampaign/OfferDetails';
import DateRange from '../components/createCampaign/DateRange';
import ProductSelection from '../components/createCampaign/ProductSelection';
import EligibilityConditions from '../components/createCampaign/EligibilityConditions';

const CreateCampaignPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    campaignName: '',
    campaignType: 'exclusive' as 'exclusive' | 'token_redemption' | 'discount',
    discountType: '' as 'percentage' | 'fixed' | '',
    discountValue: 0,
    offerHeading: '',
    offerDescription: '',
    startDate: '',
    endDate: '',
    autoActivate: false,
    selectedProducts: [] as number[],
    eligibilityConditions: [] as any[],
    productSelectionType: 'all' as 'all' | 'selected',
    evaluateCondition: 'all' as 'all' | 'any',
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Validate form
    const isValid: boolean = 
      formData.campaignName.trim() !== '' &&
      formData.offerHeading.trim() !== '' &&
      formData.offerDescription.trim() !== '' &&
      formData.startDate !== '' &&
      formData.endDate !== '' &&
      formData.eligibilityConditions.length > 0 &&
      (formData.campaignType !== 'discount' ||
        (formData.discountType !== '' && formData.discountValue > 0));

    setIsFormValid(isValid);
  }, [formData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prevData) => {
      if (field === 'campaignType') {
        // Reset discount fields if campaign type is not 'discount'
        if (value !== 'discount') {
          return {
            ...prevData,
            [field]: value,
            discountType: '',
            discountValue: 0,
          };
        }
      }
      return {
        ...prevData,
        [field]: value,
      };
    });
  };

  // const handleProductSelectionChange = (selectedProducts: number[]) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     selectedProducts,
  //   }));
  // };
  

  // const handleProductSelectionTypeChange = (selectionType: 'all' | 'selected') => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     productSelectionType: selectionType,
  //     selectedProducts: selectionType === 'all' ? [] : prevData.selectedProducts,
  //   }));
  // };


  const handleProductSelectionChange = (selectedProducts: number[]) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedProducts,
      productSelectionType: selectedProducts.length === 0 ? 'all' : 'selected',
    }));
  };


  const handleProductSelectionTypeChange = (selectionType: 'all' | 'selected') => {
    setFormData((prevData) => ({
      ...prevData,
      productSelectionType: selectionType,
      selectedProducts: selectionType === 'all' ? [] : prevData.selectedProducts,
    }));
  };
  

  const handleSave = async () => {
    if (!isFormValid) {
      alert('Please fill in all required fields before saving.');
      return;
    }

    try {
      const campaignData = {
        ...formData,
        selectedProducts: formData.productSelectionType === 'all' ? [] : formData.selectedProducts,
      };

      const response = await fetch('/api/createCampaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      const result = await response.json();
      console.log('Campaign created successfully:', result);
      router.push('/');
    } catch (error) {
      console.error('Error saving campaign:', error);
      alert('Failed to save campaign. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Create Campaign</h1>
      <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
        <CampaignBasicInfo
          campaignName={formData.campaignName}
          onChange={(value) => handleInputChange('campaignName', value)}
        />

        <CampaignTypeSelector
          selectedType={formData.campaignType}
          onChange={(value) => handleInputChange('campaignType', value)}
        />

        {formData.campaignType === 'discount' && (
          <DiscountSection
            discountType={formData.discountType}
            discountValue={formData.discountValue}
            onTypeChange={(value) => handleInputChange('discountType', value)}
            onValueChange={(value) => handleInputChange('discountValue', value)}
          />
        )}

        <OfferDetails
          offerHeading={formData.offerHeading}
          offerDescription={formData.offerDescription}
          onHeadingChange={(value) => handleInputChange('offerHeading', value)}
          onDescriptionChange={(value) => handleInputChange('offerDescription', value)}
        />

        <DateRange
          startDate={formData.startDate}
          endDate={formData.endDate}
          onStartDateChange={(value) => handleInputChange('startDate', value)}
          onEndDateChange={(value) => handleInputChange('endDate', value)}
        />

        <ProductSelection
          autoActivate={formData.autoActivate}
          onAutoActivateChange={(value) => handleInputChange('autoActivate', value)}
          onProductsChange={handleProductSelectionChange}
          onProductSelectionTypeChange={handleProductSelectionTypeChange}
          initialSelectedProducts={formData.selectedProducts}
          initialProductSelectionType={formData.productSelectionType}
        />

        <EligibilityConditions
          eligibilityConditions={formData.eligibilityConditions}
          evaluateCondition={formData.evaluateCondition}
          onConditionsChange={(value) => handleInputChange('eligibilityConditions', value)}
          onEvaluateConditionChange={(value) => handleInputChange('evaluateCondition', value)}
        />

        <div className="flex justify-end space-x-4 mt-8">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
              isFormValid ? '' : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={handleSave}
            disabled={!isFormValid}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignPage;