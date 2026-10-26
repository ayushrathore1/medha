import React, { useRef } from "react";

const OcrUpload = ({ onFileSelected }) => {
  const inputRef = useRef(null);

  return (
    <div className="flex flex-col items-center py-8">
      <input
        type="file"
        ref={inputRef}
        accept="image/*,application/pdf"
        className="hidden"
        onChange={e => {
          if (e.target.files?.[0]) {
            onFileSelected(e.target.files[0]);
            inputRef.current.value = "";
          }
        }}
      />
      <button
        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        onClick={() => inputRef.current.click()}
      >
        Upload Image or PDF
      </button>
      <span className="text-sm text-blue-500 mt-3">
        (Works best with clear, high-res images)
      </span>
    </div>
  );
};

export default OcrUpload;
