import React, { useState } from "react";
import Loader from "../Common/Loader";

const OcrTextEditor = ({ file, onExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  const handleOcrProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    
    try {
      // Simulate OCR processing - replace with actual OCR API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted text for demo purposes
      const mockText = `This is a sample of extracted text from your uploaded file.
      
The OCR system has processed your document and converted it to editable text.
You can now review and edit this text before saving it as a note.

Key features:
- Handwritten text recognition
- Mathematical equations
- Diagrams and symbols
- Multi-language support

Please review the extracted text and make any necessary corrections.`;
      
      setExtractedText(mockText);
      onExtracted(mockText);
    } catch (error) {
      console.error("OCR processing failed:", error);
      alert("Failed to process the document. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-bold text-blue-700 mb-4">
        Process Document with OCR
      </h2>
      
      <div className="mb-4">
        <p className="text-blue-900 mb-3">
          Click the button below to extract text from your uploaded file using OCR technology.
        </p>
        
        <button
          onClick={handleOcrProcess}
          disabled={isProcessing}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader size="sm" />
              Processing...
            </>
          ) : (
            "Extract Text with OCR"
          )}
        </button>
      </div>

      {extractedText && (
        <div className="mt-4">
          <h3 className="text-md font-semibold text-blue-700 mb-2">
            Extracted Text Preview:
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg border max-h-40 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {extractedText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default OcrTextEditor;
