// ImageComponent.jsx
import React from 'react';

const ImageComponent = ({ image }) => {
  return (
    <div className=" mt-2 h-4/5 p-4 border-2 border-gray-300 rounded-lg">
      {image ? (
        <img src={image} alt="Uploaded" className="w-full h-full object-cover mb-4" />
      ) : (
        <div className="w-32 h-32 flex items-center justify-center bg-gray-100 text-gray-400 mb-4">
          No image selected
        </div>
      )}
    </div>
  );
};

export default ImageComponent;
