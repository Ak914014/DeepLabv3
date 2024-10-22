import React, { useState, useRef } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import Legend from "./Lengend";

/**
 * Form component for image upload, segmentation, and display.
 * @param {Object} props - Component props.
 * @param {Function} props.setImage - Function to set the segmented image URL.
 * @returns {JSX.Element} Form component.
 */
const Form = ({ setImage }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [canvasHasImage, setCanvasHasImage] = useState(false);
  const [legend, setLegend] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const canvasRef = useRef(null);

  /**
   * Handles image file selection.
   * @param {Object} e - Event object.
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadedImage(URL.createObjectURL(file));
      setErrorMessage(""); 
    }
  };

  /**
   * Handles image upload and segmentation.
   */
  const handleImageUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("No image selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3100/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      drawSegmentationMap(response.data);
      setErrorMessage(""); // Clear error message on successful upload
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("Error uploading image.");
    }
  };

  /**
   * Handles saving the segmented image.
   */
  const handleSaveImage = () => {
    if (!canvasHasImage) {
      setErrorMessage("No segmented image to save.");
      return;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.toBlob((blob) => {
        saveAs(blob, "segmented_image.png");
      });
      setErrorMessage(""); // Clear error message on successful save
    }
  };

  /**
   * Draws the segmentation map on the canvas.
   * @param {Object} data - Segmentation data.
   * @param {Array} data.segmentationMap - Segmentation map.
   * @param {number} data.height - Image height.
   * @param {number} data.width - Image width.
   * @param {Object} data.legend - Legend data.
   */
  const drawSegmentationMap = ({ segmentationMap, height, width, legend }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    const imageData = ctx.createImageData(width, height);

    for (let i = 0; i < segmentationMap.length; i += 4) {
      const r = segmentationMap[i];
      const g = segmentationMap[i + 1];
      const b = segmentationMap[i + 2];
      const a = segmentationMap[i + 3];

      imageData.data[i] = r;
      imageData.data[i + 1] = g;
      imageData.data[i + 2] = b;
      imageData.data[i + 3] = a;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
    setCanvasHasImage(true);
    const imageUrl = canvas.toDataURL();
    setImage(imageUrl);
    setLegend(legend);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center p-4">
        <div className="mt-2 flex gap-5 flex-row">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button
            onClick={handleImageUpload}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Upload Image
          </button>
          <button
            onClick={handleSaveImage}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Download Segment Image
          </button>
        </div>
        {errorMessage && (
          <div className="mt-4 text-red-600">
            {errorMessage}
          </div>
        )}
        <div className="flex gap-5 w-full h-auto">
          <div className="w-1/3">
            <h3 className="text-2xl mt-2">Uploaded Image:</h3>
            <div className="w-full">
              {uploadedImage && (
                <div className="mt-4 border-2 overflow-hidden border-gray-200 rounded-3xl">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="max-w-full h-auto"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-2xl">Segment Image:</h1>
            <canvas
              ref={canvasRef}
              width="400"
              height="400"
              className={`bg-contain mt-2 rounded-xl ${
                canvasHasImage ? "border-2" : ""
              }`}
            ></canvas>
          </div>
          <Legend legend={legend} />
        </div>
      </div>
      <div className="w-full justify-center flex "></div>
    </div>
  );
};

export default Form;
