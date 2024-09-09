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

interface EditCampaignPageProps {
  params: { id: string };
}

const EditCampaignPage: React.FC<EditCampaignPageProps> = ({ params }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '',
    campaignName: '',
    campaignType: 'exclusive' as 'exclusive' | 'discount',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    offerHeading: '',
    offerDescription: '',
    startDate: '',
    endDate: '',
    autoActivate: false,
    selectedProducts: [] as number[],
    eligibilityConditions: [] as string[],
  });

  const [initialFormData, setInitialFormData] = useState({ ...formData });
  const [isDirty, setIsDirty] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const fetchCampaignData = async () => {
      const response = await fetch(`/api/campaigns/${params.id}`);
      const campaignData = await response.json();
      setFormData(campaignData);
      setInitialFormData(campaignData);
    };

    fetchCampaignData();
  }, [params.id]);

  useEffect(() => {
    const isFormChanged = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setIsDirty(isFormChanged);

    // Validate form
    const isValid = 
      formData.campaignName.trim() !== '' &&
      formData.offerHeading.trim() !== '' &&
      formData.offerDescription.trim() !== '' &&
      formData.startDate !== '' &&
      formData.endDate !== '' &&
      formData.selectedProducts.length > 0 &&
      formData.eligibilityConditions.length > 0 &&
      (formData.campaignType !== 'discount' || 
        (formData.discountType && formData.discountValue > 0));

    setIsFormValid(isValid);
  }, [formData, initialFormData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!isFormValid) {
      alert('Please fill in all required fields before saving.');
      return;
    }

    console.log('Saving form data:', formData);
    
    // Example API call (replace with your actual API endpoint)
    // await fetch(`/api/campaigns/${params.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData),
    // });

    setInitialFormData({ ...formData });
    setIsDirty(false);
    router.push('/campaign');
  };

  const handleCancel = () => {
    router.push('/campaign');
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Campaign</h1>
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
          selectedProducts={formData.selectedProducts}
          onAutoActivateChange={(value) => handleInputChange('autoActivate', value)}
          onProductsChange={(value) => handleInputChange('selectedProducts', value)}
        />

        <EligibilityConditions
          eligibilityConditions={formData.eligibilityConditions}
          onConditionsChange={(value) => handleInputChange('eligibilityConditions', value)}
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
              isDirty && isFormValid ? '' : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={handleSave}
            disabled={!isDirty || !isFormValid}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCampaignPage;