import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FaTimes, 
  FaSave,
  FaSpinner,
  FaVolumeUp,
  FaTrash,
  FaEdit
} from 'react-icons/fa';

/**
 * AdminContentEdit - Modal for editing existing content
 * Supports updating metadata and audio files
 */
const AdminContentEdit = ({
  isOpen,
  onClose,
  content,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    unit: '',
    pageCount: ''
  });
  
  const [audioHindiFile, setAudioHindiFile] = useState(null);
  const [audioEnglishFile, setAudioEnglishFile] = useState(null);
  const [existingHindiAudio, setExistingHindiAudio] = useState(null);
  const [existingEnglishAudio, setExistingEnglishAudio] = useState(null);
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  // Removed imagekitAuth state to prevent stale tokens

  const audioHindiRef = useRef(null);
  const audioEnglishRef = useRef(null);
  
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (isOpen && content) {
      setFormData({
        title: content.title || '',
        description: content.description || '',
        unit: content.unit || '',
        pageCount: content.pageCount || ''
      });
      setExistingHindiAudio(content.audioHindiUrl || null);
      setExistingEnglishAudio(content.audioEnglishUrl || null);
      setAudioHindiFile(null);
      setAudioEnglishFile(null);
    }
  }, [isOpen, content]);

  const getImageKitAuth = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${baseUrl}/api/learn/admin/imagekit-auth`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  };

  const uploadToImageKit = async (file, folder) => {
    // Fetch fresh auth for EACH upload to avoid "token used" error
    const auth = await getImageKitAuth();
    if (!auth.success) throw new Error('Failed to authenticate upload');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', `${Date.now()}_${file.name}`);
    formData.append('folder', folder);
    formData.append('publicKey', auth.publicKey);
    formData.append('signature', auth.signature);
    formData.append('expire', auth.expire);
    formData.append('token', auth.token);

    const response = await axios.post(
      'https://upload.imagekit.io/api/v1/files/upload',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return {
      url: response.data.url,
      fileId: response.data.fileId
    };
  };

  const handleSave = async () => {
    if (!content?._id) return;
    
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        title: formData.title,
        description: formData.description,
        unit: formData.unit ? parseInt(formData.unit) : null,
        pageCount: formData.pageCount ? parseInt(formData.pageCount) : null
      };

      // Upload new Hindi audio if provided
      if (audioHindiFile) {
        const hindiUpload = await uploadToImageKit(audioHindiFile, '/Medha/Learn/Audio');
        updateData.audioHindiUrl = hindiUpload.url;
        updateData.audioHindiFileId = hindiUpload.fileId;
      } else if (existingHindiAudio === null && content.audioHindiUrl) {
        // Audio was removed
        updateData.audioHindiUrl = null;
        updateData.audioHindiFileId = null;
      }

      // Upload new English audio if provided
      if (audioEnglishFile) {
        const englishUpload = await uploadToImageKit(audioEnglishFile, '/Medha/Learn/Audio');
        updateData.audioEnglishUrl = englishUpload.url;
        updateData.audioEnglishFileId = englishUpload.fileId;
      } else if (existingEnglishAudio === null && content.audioEnglishUrl) {
        // Audio was removed
        updateData.audioEnglishUrl = null;
        updateData.audioEnglishFileId = null;
      }

      await axios.patch(
        `${baseUrl}/api/learn/admin/content/${content._id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error updating content:', err);
      setError(err.response?.data?.message || 'Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !content) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-violet-50">
            <div className="flex items-center gap-3">
              <FaEdit className="text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-800">Edit Content</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none"
              />
            </div>

            {/* Unit & Page Count */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Unit</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                />
              </div>
              {content.type === 'pdf' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Page Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.pageCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, pageCount: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Audio Files (PDF only) */}
            {content.type === 'pdf' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <FaVolumeUp className="text-amber-600" />
                  <label className="font-bold text-amber-800">Audio Explanations</label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Hindi Audio */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">🇮🇳 Hindi</label>
                    {(existingHindiAudio || audioHindiFile) ? (
                      <div className="p-3 bg-white border border-emerald-300 rounded-xl flex items-center justify-between">
                        <span className="text-sm text-emerald-700 truncate">
                          {audioHindiFile ? audioHindiFile.name : 'Current audio'}
                        </span>
                        <button 
                          onClick={() => { setAudioHindiFile(null); setExistingHindiAudio(null); }}
                          className="text-red-500 p-1 hover:bg-red-50 rounded"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => audioHindiRef.current?.click()}
                        className="p-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer text-center hover:border-amber-400 transition-all"
                      >
                        <input
                          ref={audioHindiRef}
                          type="file"
                          accept="audio/*"
                          onChange={(e) => setAudioHindiFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <span className="text-sm text-slate-400">Click to upload</span>
                      </div>
                    )}
                  </div>
                  
                  {/* English Audio */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">🇬🇧 English</label>
                    {(existingEnglishAudio || audioEnglishFile) ? (
                      <div className="p-3 bg-white border border-emerald-300 rounded-xl flex items-center justify-between">
                        <span className="text-sm text-emerald-700 truncate">
                          {audioEnglishFile ? audioEnglishFile.name : 'Current audio'}
                        </span>
                        <button 
                          onClick={() => { setAudioEnglishFile(null); setExistingEnglishAudio(null); }}
                          className="text-red-500 p-1 hover:bg-red-50 rounded"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => audioEnglishRef.current?.click()}
                        className="p-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer text-center hover:border-amber-400 transition-all"
                      >
                        <input
                          ref={audioEnglishRef}
                          type="file"
                          accept="audio/*"
                          onChange={(e) => setAudioEnglishFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <span className="text-sm text-slate-400">Click to upload</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !formData.title}
              className={`px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all ${
                saving || !formData.title
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg'
              }`}
            >
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminContentEdit;
