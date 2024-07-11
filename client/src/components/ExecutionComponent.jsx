import React from "react";

const ExecutionComponent = () => {
  return (
    <div className="border-2 p-2 rounded-xl  mt-2  border-gray-300">
      <h3 className="text-center">
        Three types of pre-trained weights are available
      </h3>
      <div className="border-2 rounded-xl border-gray-300 w-full flex flex-row justify-around items-center h-2/3">
        <div
          className="h-2/5 w-1/3 flex flex-col items-center
            "
        >
          <h5>DeepLab PASCAL</h5>
          <div className="flex my-2 border-2 border-gray-200 p-1 rounded-xl gap-1">
            <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Toggle Example
            </button>
            <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Run
            </button>
          </div>
        </div>
        <div
          className="h-2/5 w-1/3 flex flex-col items-center
            "
        >
          <h5>DeepLab Cityscapes</h5>
          <div className="flex my-2 border-2 border-gray-200 p-1 rounded-xl gap-1">
            <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Toggle Example
            </button>
            <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Run
            </button>
          </div>
        </div>
        <div
          className="h-2/5 w-1/3 flex flex-col items-center
            "
        >
          <h5>DeepLab AOD20K</h5>
          <div className="flex my-2 border-2 border-gray-200 p-1 rounded-xl gap-1">
            <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Toggle Example
            </button>
            <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Run
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionComponent;
