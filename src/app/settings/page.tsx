"use client";
import React, { useState, useEffect, useRef } from "react";

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

const SettingsPage: React.FC = () => {
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
    const initialSettings = useRef({
        buttonSettings: { ...buttonSettings },
        descriptionSettings: { ...descriptionSettings },
    });

    useEffect(() => {
        const settingsChanged =
            JSON.stringify(initialSettings.current.buttonSettings) !== JSON.stringify(buttonSettings) ||
            JSON.stringify(initialSettings.current.descriptionSettings) !== JSON.stringify(descriptionSettings);
        setIsChanged(settingsChanged);
    }, [buttonSettings, descriptionSettings]);

    const handleSaveSettings = (): void => {
        console.log("Settings saved:", { buttonSettings, descriptionSettings });
        initialSettings.current = {
            buttonSettings: { ...buttonSettings },
            descriptionSettings: { ...descriptionSettings },
        };
        setIsChanged(false);
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

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <div className="flex space-x-8">
                {/* Settings section */}
                <div className="w-1/3 bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Settings for button</h2>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span>Button color</span>
                            <input
                                type="text"
                                value={buttonSettings.color}
                                onChange={(e) => handleButtonSettingsChange(e, "color")}
                                className="border p-1 rounded w-1/2 text-sm"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Button text</span>
                            <input
                                type="text"
                                value={buttonSettings.text}
                                onChange={(e) => handleButtonSettingsChange(e, "text")}
                                className="border p-1 rounded w-1/2 text-sm"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Button text color</span>
                            <input
                                type="text"
                                value={buttonSettings.textColor}
                                onChange={(e) => handleButtonSettingsChange(e, "textColor")}
                                className="border p-1 rounded w-1/2 text-sm"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Font Size(px)</span>
                            <input
                                type="number"
                                value={buttonSettings.fontSize}
                                onChange={(e) => handleButtonSettingsChange(e, "fontSize")}
                                className="border p-1 rounded w-1/2 text-sm"
                            />
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mt-4 mb-4">Descriptions settings</h2>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span>Set color</span>
                            <input
                                type="text"
                                value={descriptionSettings.color}
                                onChange={(e) => handleDescriptionSettingsChange(e, "color")}
                                className="border p-1 rounded w-1/2 text-sm"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Font Size(px)</span>
                            <input
                                type="number"
                                value={descriptionSettings.fontSize}
                                onChange={(e) => handleDescriptionSettingsChange(e, "fontSize")}
                                className="border p-1 rounded w-1/2 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleSaveSettings}
                            className={`mt-4 px-4 py-2 rounded text-sm ${isChanged
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                            disabled={!isChanged}
                        >
                            Save Settings
                        </button>
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
                                <h3 className="text-lg font-bold mb-2">PRODUCT NAME</h3>
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
