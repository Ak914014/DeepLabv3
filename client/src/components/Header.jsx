import React from 'react'

const Header = () => {
  return (
    <div className=' p-5 border-b-2'>

    <div className=' text-3xl  font-bold'>
          DeepLab v3 Demo
    </div>
    <div className=' mt-4 text-sm w-4/5'>
    DeepLab v3 is a deep learning model for semantic image segmentation, which assigns a class label to each pixel in an image. DeepLab v3 is used in applications such as autonomous driving, medical imaging, urban planning, and augmented reality to identify and segment objects in images.
    </div>
    </div>
  )
}

export default Header