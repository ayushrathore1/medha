import React, { useState } from "react";

const OcrReview = ({
  initialText = "",
  onSave,
  onRetry,
  loading = false,
  editable = true,
}) => {
  const [text, setText] = useState(initialText);

  return (
    <div className="bg-white/90 border border-blue-100 rounded-2xl shadow-xl p-8 max-w-2xl mx-auto my-10">
      <h3 className="mb-3 text-2xl font-bold text-blue-700 text-center">
        Review & Edit Extracted Note
      </h3>
      <textarea
        className="w-full min-h-[180px] border border-blue-200 bg-blue-50/50 rounded-lg p-4 text-lg text-blue-900 shadow-inner focus:outline-none focus:border-blue-400 transition"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Review or edit the extracted note..."
        disabled={loading || !editable}
        spellCheck
      />
      <div className="flex flex-wrap justify-end gap-4 mt-6">
        <button
          className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition"
          disabled={loading || !text.trim()}
          onClick={() => onSave && onSave(text.trim())}
        >
          {loading ? "Saving..." : "Save Note"}
        </button>
        <button
          className="bg-blue-100 border border-blue-300 text-blue-700 px-5 py-2 rounded-lg font-semibold hover:bg-blue-200 transition"
          disabled={loading}
          onClick={onRetry}
          type="button"
        >
          Re-extract
        </button>
      </div>
    </div>
  );
};

export default OcrReview;
