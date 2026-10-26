import React from 'react';
import { FaTrash, FaSpinner } from 'react-icons/fa6';

const DeleteUserModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName, 
  confirmText, 
  setConfirmText, 
  isDeleting 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="max-w-md w-full bg-white rounded-xl overflow-hidden shadow-2xl border-2 border-red-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <FaTrash />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Delete User?</h3>
          <p className="text-gray-600 mb-6">
            This action is <span className="font-bold text-red-600">PERMANENT</span> and cannot be undone. 
            All data associated with <span className="font-bold">{userName}</span> will be wiped.
          </p>
          
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-6 text-left">
            <label className="block text-xs font-bold text-gray-500 mb-1">To confirm, type "DELETE"</label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-mono"
              placeholder="DELETE"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-bold"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={confirmText !== 'DELETE' || isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDeleting ? <FaSpinner className="animate-spin" /> : <><FaTrash /> Delete User</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
