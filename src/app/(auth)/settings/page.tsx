"use client";

import React, { useState, useEffect, useRef } from "react";
import InputField from "../../components/InputField";
import SettingsPageSkeleton from "./SettingsPageSkeleton";
import ColorInput from "../../components/ColorInput";
import { Loader2 } from "lucide-react";

interface ButtonSettings {
    color: string;
    text: string;
    textColor: string;
    fontSize: number;
}

interface DescriptionSettings {
    color: string;
    fontSize: number;
}

interface Settings {
    id?: number;
    button_color: string;
    button_text: string;
    button_text_color: string;
    button_font_size: number;
    description_color: string;
    description_font_size: number;
}

interface ToastProps {
    message: string;
    type: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
    return (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center">
            <div className={`px-4 py-2 rounded-md text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                {message}
            </div>
        </div>
    );
};

const SettingsPage: React.FC = () => {

    const [isSaving, setIsSaving] = useState(false);

    const [buttonSettings, setButtonSettings] = useState<ButtonSettings>({
        color: "#2D2D2D",
        text: "Connect Tokenlock",
        textColor: "#F6F6F7",
        fontSize: 24,
    });

    const [descriptionSettings, setDescriptionSettings] = useState<DescriptionSettings>({
        color: "#000000",
        fontSize: 12,
    });

    const [isChanged, setIsChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<ToastProps | null>(null);

    const initialSettings = useRef({
        buttonSettings: { ...buttonSettings },
        descriptionSettings: { ...descriptionSettings },
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        const settingsChanged =
            JSON.stringify(initialSettings.current.buttonSettings) !== JSON.stringify(buttonSettings) ||
            JSON.stringify(initialSettings.current.descriptionSettings) !== JSON.stringify(descriptionSettings);
        setIsChanged(settingsChanged);
    }, [buttonSettings, descriptionSettings]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                setToast(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [toast]);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/settings');
            if (response.ok) {
                const data: Settings = await response.json();
                setButtonSettings({
                    color: data.button_color,
                    text: data.button_text,
                    textColor: data.button_text_color,
                    fontSize: data.button_font_size,
                });
                setDescriptionSettings({
                    color: data.description_color,
                    fontSize: data.description_font_size,
                });
                initialSettings.current = {
                    buttonSettings: {
                        color: data.button_color,
                        text: data.button_text,
                        textColor: data.button_text_color,
                        fontSize: data.button_font_size,
                    },
                    descriptionSettings: {
                        color: data.description_color,
                        fontSize: data.description_font_size,
                    },
                };
            } else if (response.status === 404) {
                console.log('No settings found. Using default values.');
            } else {
                console.error('Failed to fetch settings');
                setToast({ message: 'Failed to load settings. Using default values.', type: 'error' });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            setToast({ message: 'Error loading settings. Using default values.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSettings = async (): Promise<void> => {
        setIsSaving(true); // Start saving
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    buttonColor: buttonSettings.color,
                    buttonText: buttonSettings.text,
                    buttonTextColor: buttonSettings.textColor,
                    buttonFontSize: buttonSettings.fontSize,
                    descriptionColor: descriptionSettings.color,
                    descriptionFontSize: descriptionSettings.fontSize,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Settings saved successfully:', result);
                setToast({ message: 'Settings saved successfully!', type: 'success' });
                initialSettings.current = {
                    buttonSettings: { ...buttonSettings },
                    descriptionSettings: { ...descriptionSettings },
                };
                setIsChanged(false);
            } else {
                const errorData = await response.json();
                console.error('Failed to save settings:', errorData);
                setToast({ message: 'Failed to save settings. Please try again.', type: 'error' });
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            setToast({ message: 'Error saving settings. Please try again.', type: 'error' });
        } finally {
            setIsSaving(false); // End saving
        }
    };

    const handleButtonSettingsChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof ButtonSettings) => {
        setButtonSettings(prev => ({
            ...prev,
            [key]: key === "fontSize" ? parseInt(e.target.value) || 0 : e.target.value,
        }));
    };

    const handleDescriptionSettingsChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof DescriptionSettings) => {
        setDescriptionSettings(prev => ({
            ...prev,
            [key]: key === "fontSize" ? parseInt(e.target.value) || 0 : e.target.value,
        }));
    };

    if (isLoading) {
        return <SettingsPageSkeleton />;
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-medium mb-6">Settings</h1>
            {toast && <Toast message={toast.message} type={toast.type} />}
            <div className="flex space-x-8">
                {/* Settings section */}
                <div className="w-1/2 bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-medium mb-4">Settings for button</h2>
                    <div className="space-y-4">
                        <ColorInput
                            label="Button color"
                            value={buttonSettings.color}
                            onChange={(value) => handleButtonSettingsChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>, "color")}
                        />
                        <div className="flex items-center space-x-4">
                            <label className="font-medium text-md text-gray-700 w-1/3">Button text</label>
                            <input
                                type="text"
                                value={buttonSettings.text}
                                onChange={(e) => handleButtonSettingsChange(e, "text")}
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                            />
                        </div>
                        <ColorInput
                            label="Button text color"
                            value={buttonSettings.textColor}
                            onChange={(value) => handleButtonSettingsChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>, "textColor")}
                        />
                        <div className="flex items-center space-x-4">
                            <label className="font-medium text-md text-gray-700 w-1/3">Font Size(px)</label>
                            <input
                                type="number"
                                value={buttonSettings.fontSize}
                                onChange={(e) => handleButtonSettingsChange(e, "fontSize")}
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                            />
                        </div>
                    </div>

                    <h2 className="text-lg font-medium mt-6 mb-4">Descriptions settings</h2>
                    <div className="space-y-4">
                        <ColorInput
                            label="Text color"
                            value={descriptionSettings.color}
                            onChange={(value) => handleDescriptionSettingsChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>, "color")}
                        />
                        <div className="flex items-center space-x-4">
                            <label className="font-medium text-md text-gray-700 w-1/3">Font Size(px)</label>
                            <input
                                type="number"
                                value={descriptionSettings.fontSize}
                                onChange={(e) => handleDescriptionSettingsChange(e, "fontSize")}
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                    <div className="flex justify-end mt-6">
                <button
                    onClick={handleSaveSettings}
                    className={`px-4 py-2 rounded text-sm flex items-center ${
                        isChanged && !isSaving
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!isChanged || isSaving}
                >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
                    </div>
                </div>
                {/* Preview section */}
                <div className="w-2/3 bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-blue-500 p-2">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                    <div className="p-4 flex h-full">
                        <div className="w-1/3 flex-none bg-blue-50 p-3 rounded-lg shadow-sm flex items-start">
                            <div className="bg-white p-3 rounded-lg shadow-sm w-full">
                                <h2 className="text-sm font-semibold mb-1">
                                    Preview is not accurate
                                </h2>
                                <p
                                    className="text-xs"
                                    style={{
                                        color: descriptionSettings.color,
                                        fontSize: `${descriptionSettings.fontSize}px`,
                                    }}
                                >
                                    This is simply to provide you with an idea of how the
                                    TokenLock will be displayed on the product page, including the
                                    button text, font size, and color scheme.
                                </p>
                            </div>
                        </div>
                        <div className="w-2/3 bg-white-50 px-5 flex-1 flex flex-col justify-between p-3">
                            <div className="text-center">
                                <h3 className="text-lg font-medium mb-2">PRODUCT NAME</h3>
                                <div className="border-2 bg-indigo-50 border-dashed border-gray-300 h-[120px] mb-2 mx-auto p-3">
                                    <div className="flex space-x-4 items-center">
                                        <div className="w-[80px] h-[80px] border-2 rounded-lg border-gray-300 flex-shrink-0"></div>
                                        <div className="flex flex-col space-y-3 w-full">
                                            <div className="w-full h-5 border-2 rounded-md border-gray-300"></div>
                                            <div className="w-full h-5 border-2 rounded-md border-gray-300"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Moved Total div here */}
                            <div className="flex flex-col justify-center items-center mb-2">
                                <div className="w-full border-t border-gray-300 mb-2"></div>
                                <div className="flex justify-between items-center w-full px-2 py-2">
                                    <span className="text-sm">Total</span>
                                    <div className="w-12 h-4 bg-indigo-50 border-2 border-dashed border-gray-300"></div>
                                </div>
                                <div className="w-full border-b border-gray-300 mt-2"></div>
                            </div>
                            <div className="flex flex-col items-center">
                                <button className="w-full bg-white border border-gray-300 text-gray-800 py-3 rounded text-sm mb-2">
                                    Add To Cart
                                </button>
                                <button
                                    className="w-full py-3 px-5 rounded text-sm mb-4"
                                    style={{
                                        backgroundColor: buttonSettings.color,
                                        color: buttonSettings.textColor,
                                        fontSize: `${buttonSettings.fontSize}px`,
                                    }}
                                >
                                    {buttonSettings.text}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
