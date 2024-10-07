import React from 'react';

const TokenLockInstructions: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font text-gray-600 mb-6 ">How to Use TokenLock</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-normal mb-3">Step 1: Create a Campaign</h2>
          <p className="mb-2 font-light">Go to the Campaign page from the Sidebar menu. Complete the campaign details:</p>
          <ul className="list-disc pl-6 text-m space-y-1 font-light">
            <li>Input a campaign name.</li>
            <li>Select the type of token-gated campaign you would like to create.</li>
            <li>If you are token-gating a product, enter the Heading and Description you want to be displayed.</li>
            <li>If you are token-gating a product, choose the Start Date and End Date for the campaign.</li>
            <li>If you are token-gating a product, select the product(s) to include.</li>
            <li>Define the eligibility conditions for the campaign.</li>
          </ul>
          <p className="mt-2 font-light">Click the <strong>Save button</strong> to create the campaign with the specified rules and conditions.</p>
        </section>

        <section>
          <h2 className="text-xl font-normal mb-3">Step 2: View All Campaigns</h2>
          <p className='text-m font-light'>Navigate to the <strong>Campaigns page</strong> from the main menu. You can view all of your created campaigns and click on any campaign to view its details, edit its conditions, or deactivate it.</p>
        </section>

        <section>
          <h2 className="text-xl font-normal mb-3">Step 3: Customize Button Settings</h2>
          <p className="mb-2 text-m font-light">Go to the <strong>Settings page</strong> from the main menu. Use the design tools to customize the button's appearance:</p>
          <ul className="list-disc pl-6 space-y-1 text-m font-light">
            <li>Customize the button color, text, text color, and font size.</li>
            <li>Customize the description text color and font size.</li>
          </ul>
          <p className="mt-2 text-m font-light">Click <strong>Save Settings</strong> to apply your changes and preview the button appearance on the frontend.</p>
        </section>
      </div>

      <p className="mt-6 font-medium">You're now good to go!</p>
    </div>
  );
};

export default TokenLockInstructions;