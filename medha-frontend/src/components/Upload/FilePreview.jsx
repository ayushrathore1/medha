import React from "react";

const FilePreview = ({ file }) => {
  if (!file) return null;

  let previewUrl = "";
  if (file.type.startsWith("image/")) {
    previewUrl = URL.createObjectURL(file);
  }

  return (
    <div className="w-full flex flex-col items-center mt-5">
      <div className="bg-blue-50 p-3 rounded-lg shadow border border-blue-200 max-w-[16rem] mx-auto">
        <div className="mb-2 font-semibold text-blue-700 text-sm">
          Preview:
        </div>
        {file.type.startsWith("image/") ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-48 h-48 object-contain rounded-lg"
          />
        ) : (
          <div className="text-blue-700 bg-white rounded p-6 border border-dashed border-blue-200">
            PDF File Selected: <span className="font-medium">{file.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreview;
