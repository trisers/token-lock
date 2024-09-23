"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import CampaignBasicInfo from '../../../components/createCampaign/CampaignBasicInfo';
import CampaignTypeSelector from '../../../components/createCampaign/CampaignTypeSelector';
import DiscountSection from '../../../components/createCampaign/DiscountSection';
import OfferDetails from '../../../components/createCampaign/OfferDetails';
import DateRange from '../../../components/createCampaign/DateRange';
import ProductSelection from '../../../components/createCampaign/ProductSelection';
import EligibilityConditions from '../../../components/createCampaign/EligibilityConditions';

const EditCampaignPage: React.FC = () => {

    const router = useRouter();
    const params = useParams();
    const campaignId = params.id as string;

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
        eligibilityConditions: [] as any[],
        productSelectionType: 'all' as 'all' | 'selected',
        evaluateCondition: 'all' as 'all' | 'any',
        campaignStatus: 1 as 0 | 1,
    });

    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        if (campaignId) {
            fetchCampaignData(campaignId);
        }
    }, [campaignId]);

    const fetchCampaignData = async (id: string) => {
        try {
            const response = await fetch(`/api/campaigns/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch campaign data');
            }

            const campaignData = await response.json();

            // Convert date strings to the format expected by input[type="date"]
            const startDate = new Date(campaignData.startDate).toISOString().split('T')[0];
            const endDate = new Date(campaignData.endDate).toISOString().split('T')[0];

            setFormData(prevData => ({
                ...prevData,
                ...campaignData,
                startDate,
                endDate,
                productSelectionType: campaignData.selectedProducts.length > 0 ? 'selected' : 'all',
            }));
        } catch (error) {
            console.error('Error fetching campaign data:', error);
            alert('Failed to fetch campaign data. Please try again.');
        }
    };

    useEffect(() => {
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
    }, [formData]);

    const handleInputChange = (field: string, value: any) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleUpdate = async () => {
        if (!isFormValid) {
            alert('Please fill in all required fields before updating.');
            return;
        }

        try {
            const response = await fetch(`/api/campaigns/${campaignId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    autoActivate: formData.autoActivate ? 1 : 0,
                    startDate: new Date(formData.startDate).toISOString(),
                    endDate: new Date(formData.endDate).toISOString(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update campaign');
            }
            
            const result = await response.json();
            console.log('Campaign updated successfully:', result);
            router.push('/dashboard');
        } catch (error) {
            console.error('Error updating campaign:', error);
            alert(`Failed to update campaign: ${error}`);
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
            try {
                const response = await fetch(`/api/campaigns/${campaignId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete campaign');
                }

                console.log('Campaign deleted successfully');
                router.push('/dashboard');
            } catch (error) {
                console.error('Error deleting campaign:', error);
                alert('Failed to delete campaign. Please try again.');
            }
        }
    };

    const handleActivateDeactivate = async () => {
        const newStatus = formData.campaignStatus === 1 ? 0 : 1;
        try {
            const response = await fetch(`/api/campaigns/${campaignId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ campaignStatus: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update campaign status');
            }

            setFormData(prevData => ({
                ...prevData,
                campaignStatus: newStatus,
            }));

            console.log(`Campaign ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
            console.error('Error updating campaign status:', error);
            alert('Failed to update campaign status. Please try again.');
        }
    };

    const handleProductSelectionTypeChange = (value: 'all' | 'selected') => {
        setFormData(prevData => ({
            ...prevData,
            productSelectionType: value,
            selectedProducts: value === 'all' ? [] : prevData.selectedProducts
        }));
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
                    onAutoActivateChange={(value) => handleInputChange('autoActivate', value)}
                    onProductsChange={(value) => handleInputChange('selectedProducts', value)}
                    initialSelectedProducts={formData.selectedProducts}
                    initialProductSelectionType={formData.productSelectionType}
                    onProductSelectionTypeChange={handleProductSelectionTypeChange}
                />


                <EligibilityConditions
                    eligibilityConditions={formData.eligibilityConditions}
                    evaluateCondition={formData.evaluateCondition}
                    onConditionsChange={(value) => handleInputChange('eligibilityConditions', value)}
                    onEvaluateConditionChange={(value) => handleInputChange('evaluateCondition', value)}
                />

                <div className="flex justify-between mt-8">
                    <button
                        className="px-2 py-2 border bg-red-600 border-gray-300 rounded-md text-white hover:bg-red-800"
                        onClick={handleDelete}
                    >
                        Delete Campaign
                    </button>

                    <div className="flex justify-end space-x-4 ">
                        <button
                            className={`px-2 py-2 border-gray-300 rounded-md ${formData.campaignStatus === 1 ? 'text-red-500 hover:bg-red-100' : 'text-green-500 hover:bg-green-100'
                                }`}
                            onClick={handleActivateDeactivate}
                        >
                            {formData.campaignStatus === 1 ? 'Deactivate' : 'Activate'}
                        </button>

                        <button
                            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${isFormValid ? '' : 'opacity-50 cursor-not-allowed'
                                }`}
                            onClick={handleUpdate}
                            disabled={!isFormValid}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCampaignPage;