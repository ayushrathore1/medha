import React, { useRef, useState } from "react";

const FileUpload = ({ onFileSelect, accept = "image/*,application/pdf" }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setError(null);
    onFileSelect(file);
    inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center py-4">
      <input
        type="file"
        ref={inputRef}
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current.click()}
        className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Upload Image or PDF
      </button>
      {error ? (
        <span className="text-sm text-red-500 mt-2 font-medium">{error}</span>
      ) : (
        <span className="text-sm text-blue-500 mt-2">
          Supported: Images & PDFs — no size limit
        </span>
      )}
    </div>
  );
};

export default FileUpload;
