"use client";

import React from "react";

const SkeletonInput = () => (
  <div className="animate-pulse flex flex-col">
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
    <div className="h-10 bg-gray-200 rounded w-full"></div>
  </div>
);

const SettingsPageSkeleton: React.FC = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="flex space-x-8">
        {/* Settings section skeleton */}
        <div className="w-1/3 bg-white p-4 rounded-lg shadow">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-6">
            <SkeletonInput />
            <SkeletonInput />
            <SkeletonInput />
            <SkeletonInput />
          </div>

          <div className="h-6 bg-gray-200 rounded w-1/2 mt-8 mb-4"></div>
          <div className="space-y-6">
            <SkeletonInput />
            <SkeletonInput />
          </div>

          <div className="flex justify-end mt-4">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>

        {/* Preview section skeleton */}
        <div className="w-2/3 bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gray-200 p-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          <div className="p-4 flex h-full">
            <div className="w-1/3 flex-none bg-gray-100 p-3 rounded-lg shadow-sm flex items-start">
              <div className="bg-white p-3 rounded-lg shadow-sm w-full">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-20 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
            <div className="w-2/3 bg-white px-5 flex-1 flex flex-col justify-between p-3">
              <div className="text-center">
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                <div className="border-2 bg-gray-100 border-dashed border-gray-300 h-[120px] mb-2 mx-auto p-3">
                  <div className="flex space-x-4 items-center">
                    <div className="w-[80px] h-[80px] bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex flex-col space-y-3 w-full">
                      <div className="h-5 bg-gray-200 rounded w-full"></div>
                      <div className="h-5 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center mb-2">
                <div className="w-full border-t border-gray-300 mb-2"></div>
                <div className="flex justify-between items-center w-full px-2 py-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
                <div className="w-full border-b border-gray-300 mt-2"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-12 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPageSkeleton;