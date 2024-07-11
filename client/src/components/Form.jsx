// Form.jsx
import React from 'react';

const Form = ({ setImage }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    // Implement the image upload logic here
    console.log("Image uploaded!");
  };

  return (
    <div className="flex flex-col border-2 mt-2 rounded-xl items-center  p-4">
      <div className='w-3/4'>
        For best performance, upload images with objects (chairs, plants) or animals (humans, cats etc.)
      </div>
      <div>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          className=""
        />
        <button 
          onClick={handleImageUpload} 
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Upload Image
        </button>
      </div>
    </div>
  );
};

export default Form;
