import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FaTimes, 
  FaCloudUploadAlt, 
  FaVideo, 
  FaFilePdf,
  FaCheck,
  FaSpinner,
  FaImage,
  FaTrash,
  FaPlay,
  FaVolumeUp,
  FaMagic
} from 'react-icons/fa';
import { getAllAnimations } from './animations';

/**
 * AdminContentUpload - YouTube-style upload modal for admins
 * Supports video and PDF uploads to ImageKit
 */
const AdminContentUpload = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState('select'); // 'select', 'details', 'uploading', 'complete'
  const [contentType, setContentType] = useState(null); // 'video', 'pdf', or 'animation'
  const [subjects, setSubjects] = useState([]);
  const [availableAnimations, setAvailableAnimations] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    description: '',
    unit: '',
    duration: '',
    pageCount: '',
    // Animation specific
    animationId: '',
    animationSteps: ''
  });
  
  // File states
  const [mainFile, setMainFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [mainFilePreview, setMainFilePreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  
  // Audio files for PDF explanations
  const [audioHindiFile, setAudioHindiFile] = useState(null);
  const [audioEnglishFile, setAudioEnglishFile] = useState(null);
  
  // Upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState(null);
  
  const mainFileRef = useRef(null);
  const thumbnailRef = useRef(null);
  const audioHindiRef = useRef(null);
  const audioEnglishRef = useRef(null);
  
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch subjects on open
  useEffect(() => {
    if (isOpen) {
      fetchSubjects();
      // Load available animations
      const animations = getAllAnimations();
      setAvailableAnimations(animations);
    }
  }, [isOpen]);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseUrl}/api/learn/admin/subjects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setSubjects(res.data.subjects);
      }
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };



  const handleMainFileDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isPdf = file.type === 'application/pdf';

    if (contentType === 'video' && !isVideo) {
      setError('Please upload a video file');
      return;
    }
    if (contentType === 'pdf' && !isPdf) {
      setError('Please upload a PDF file');
      return;
    }

    setMainFile(file);
    setError(null);

    // Generate preview
    if (isVideo) {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        setFormData(prev => ({
          ...prev,
          duration: `${minutes}:${seconds.toString().padStart(2, '0')}`
        }));
      };
      setMainFilePreview(URL.createObjectURL(file));
    }
  }, [contentType]);

  const handleThumbnailSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file for thumbnail');
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    setError(null);
  };

  const uploadToImageKit = async (file, folder) => {
    try {
      // 1. Fetch fresh authentication parameters for THIS specific upload
      const token = localStorage.getItem('token');
      const authRes = await axios.get(`${baseUrl}/api/learn/admin/imagekit-auth`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const authData = authRes.data;
      if (!authData || !authData.token) {
         throw new Error('Failed to get ImageKit authentication');
      }

      // 2. Perform the upload with the fresh auth params
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', `${Date.now()}_${file.name}`);
      formData.append('folder', folder);
      formData.append('publicKey', authData.publicKey);
      formData.append('signature', authData.signature);
      formData.append('expire', authData.expire);
      formData.append('token', authData.token);

      const response = await axios.post(
        'https://upload.imagekit.io/api/v1/files/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      );

      return {
        url: response.data.url,
        fileId: response.data.fileId
      };
    } catch (error) {
       console.error("ImageKit upload error:", error);
       throw error;
    }
  };

  const handleSubmit = async () => {
    // For video/pdf, require file. For animation, require animationId
    if (contentType !== 'animation' && !mainFile) {
      setError('Please select a file to upload');
      return;
    }
    if (contentType === 'animation' && !formData.animationId) {
      setError('Please select an animation component');
      return;
    }
    if (!formData.subject || !formData.title) {
      setError('Please fill in all required fields');
      return;
    }

    setStep('uploading');
    setUploadProgress(0);
    setError(null);

    try {
      let mainUpload = null;
      
      // Upload main file only for video/pdf
      if (contentType === 'video' || contentType === 'pdf') {
        setUploadStatus(`Uploading ${contentType}...`);
        const folder = contentType === 'video' ? '/Medha/Learn/Videos' : '/Medha/Learn/PDFs';
        mainUpload = await uploadToImageKit(mainFile, folder);
      }

      // Upload thumbnail if provided
      let thumbnailUpload = null;
      if (thumbnailFile) {
        setUploadStatus('Uploading thumbnail...');
        setUploadProgress(0);
        thumbnailUpload = await uploadToImageKit(thumbnailFile, '/Medha/Learn/Thumbnails');
      }

      // Save to database
      setUploadStatus('Saving content...');
      const token = localStorage.getItem('token');
      
      const contentData = {
        subject: formData.subject,
        title: formData.title,
        description: formData.description,
        unit: formData.unit ? parseInt(formData.unit) : null,
        type: contentType,
        thumbnailUrl: thumbnailUpload?.url || null,
        thumbnailFileId: thumbnailUpload?.fileId || null
      };

      if (contentType === 'video') {
        contentData.videoUrl = mainUpload.url;
        contentData.videoFileId = mainUpload.fileId;
        contentData.duration = formData.duration;
      } else if (contentType === 'pdf') {
        contentData.pdfUrl = mainUpload.url;
        contentData.pdfFileId = mainUpload.fileId;
        contentData.pageCount = formData.pageCount ? parseInt(formData.pageCount) : null;
        
        // Upload audio files if provided for PDF
        if (audioHindiFile) {
          setUploadStatus('Uploading Hindi audio...');
          setUploadProgress(0);
          const hindiAudio = await uploadToImageKit(audioHindiFile, '/Medha/Learn/Audio');
          contentData.audioHindiUrl = hindiAudio.url;
          contentData.audioHindiFileId = hindiAudio.fileId;
        }
        
        if (audioEnglishFile) {
          setUploadStatus('Uploading English audio...');
          setUploadProgress(0);
          const englishAudio = await uploadToImageKit(audioEnglishFile, '/Medha/Learn/Audio');
          contentData.audioEnglishUrl = englishAudio.url;
          contentData.audioEnglishFileId = englishAudio.fileId;
        }
      } else if (contentType === 'animation') {
        contentData.animationId = formData.animationId;
        contentData.animationSteps = formData.animationSteps ? parseInt(formData.animationSteps) : 1;
        contentData.animationThumbnailUrl = thumbnailUpload?.url || null;
        
        // Upload audio files if provided for Animation
        if (audioHindiFile) {
          setUploadStatus('Uploading Hindi audio...');
          setUploadProgress(0);
          const hindiAudio = await uploadToImageKit(audioHindiFile, '/Medha/Learn/Audio');
          contentData.audioHindiUrl = hindiAudio.url;
          contentData.audioHindiFileId = hindiAudio.fileId;
        }
        
        if (audioEnglishFile) {
          setUploadStatus('Uploading English audio...');
          setUploadProgress(0);
          const englishAudio = await uploadToImageKit(audioEnglishFile, '/Medha/Learn/Audio');
          contentData.audioEnglishUrl = englishAudio.url;
          contentData.audioEnglishFileId = englishAudio.fileId;
        }
      }

      await axios.post(
        `${baseUrl}/api/learn/admin/content`,
        contentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStep('complete');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      setStep('details');
    }
  };

  const resetForm = () => {
    setStep('select');
    setContentType(null);
    setFormData({
      subject: '',
      title: '',
      description: '',
      unit: '',
      duration: '',
      pageCount: '',
      animationId: '',
      animationSteps: ''
    });
    setMainFile(null);
    setThumbnailFile(null);
    setMainFilePreview(null);
    setThumbnailPreview(null);
    setAudioHindiFile(null);
    setAudioEnglishFile(null);
    setUploadProgress(0);
    setUploadStatus('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
          style={{ backgroundColor: "var(--bg-secondary)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border-default)" }}>
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              {step === 'select' && 'Upload Content'}
              {step === 'details' && `${contentType === 'animation' ? 'Add' : 'Upload'} ${contentType === 'video' ? 'Video' : contentType === 'pdf' ? 'PDF' : 'Animation'}`}
              {step === 'uploading' && (contentType === 'animation' ? 'Saving...' : 'Uploading...')}
              {step === 'complete' && (contentType === 'animation' ? 'Animation Added!' : 'Upload Complete!')}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]"
              style={{ color: "var(--text-tertiary)" }}
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Select Content Type */}
            {step === 'select' && (
              <div className="space-y-4">
                <p className="text-center mb-6" style={{ color: "var(--text-secondary)" }}>
                  What would you like to upload?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { setContentType('video'); setStep('details'); }}
                    className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-2xl transition-all group hover:bg-[var(--action-primary)]/10"
                    style={{ borderColor: "var(--border-default)" }}
                  >
                    <div className="p-4 rounded-full transition-colors bg-indigo-100 group-hover:bg-[var(--action-primary)]">
                      <FaVideo size={32} className="text-indigo-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-bold" style={{ color: "var(--text-primary)" }}>Video Lecture</span>
                    <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>MP4, WebM, etc.</span>
                  </button>

                  <button
                    onClick={() => { setContentType('pdf'); setStep('details'); }}
                    className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-2xl transition-all group hover:bg-red-500/10"
                    style={{ borderColor: "var(--border-default)" }}
                  >
                    <div className="p-4 bg-red-100 rounded-full group-hover:bg-red-500 transition-colors">
                      <FaFilePdf size={32} className="text-red-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-bold" style={{ color: "var(--text-primary)" }}>PDF Notes</span>
                    <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>Study materials</span>
                  </button>

                  <button
                    onClick={() => { setContentType('animation'); setStep('details'); }}
                    className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-2xl transition-all group hover:bg-purple-500/10 col-span-2"
                    style={{ borderColor: "var(--border-default)" }}
                  >
                    <div className="p-4 bg-purple-100 rounded-full group-hover:bg-purple-500 transition-colors">
                      <FaMagic size={32} className="text-purple-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-bold" style={{ color: "var(--text-primary)" }}>Animated Visualization</span>
                    <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>Step-by-step concept animations</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Upload Form */}
            {step === 'details' && (
              <div className="space-y-6">
                {/* File Upload Area - Only for video and pdf */}
                {(contentType === 'video' || contentType === 'pdf') && (
                <div
                  onDrop={handleMainFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => mainFileRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    mainFile
                      ? 'border-emerald-400 bg-emerald-500/10'
                      : 'hover:border-indigo-400 hover:bg-[var(--action-primary)]/5'
                  }`}
                  style={{ borderColor: mainFile ? undefined : "var(--border-default)" }}
                >
                  <input
                    ref={mainFileRef}
                    type="file"
                    accept={contentType === 'video' ? 'video/*' : 'application/pdf'}
                    onChange={handleMainFileDrop}
                    className="hidden"
                  />
                  
                  {mainFile ? (
                    <div className="flex items-center justify-center gap-4">
                      <div className="p-3 bg-emerald-100 rounded-full">
                        <FaCheck size={24} className="text-emerald-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold" style={{ color: "var(--text-primary)" }}>{mainFile.name}</p>
                        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                          {(mainFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setMainFile(null); setMainFilePreview(null); }}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <FaCloudUploadAlt size={48} className="mx-auto mb-4" style={{ color: "var(--text-tertiary)" }} />
                      <p className="font-medium" style={{ color: "var(--text-secondary)" }}>
                        Drag and drop your {contentType} here
                      </p>
                      <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>or click to browse</p>
                    </>
                  )}
                </div>
                )}

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-secondary)" }}>
                    <FaImage className="inline mr-2" />
                    Thumbnail (Optional)
                  </label>
                  <div
                    onClick={() => thumbnailRef.current?.click()}
                    className={`relative h-32 border-2 border-dashed rounded-xl cursor-pointer flex items-center justify-center transition-all ${
                      thumbnailFile ? 'border-emerald-400' : 'hover:border-indigo-400'
                    }`}
                    style={{ borderColor: thumbnailFile ? undefined : "var(--border-default)" }}
                  >
                    <input
                      ref={thumbnailRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailSelect}
                      className="hidden"
                    />
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Thumbnail" className="h-full w-auto rounded-lg object-cover" />
                    ) : (
                      <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>Click to upload thumbnail</span>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-secondary)" }}>Subject *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none"
                      style={{ 
                        backgroundColor: "var(--bg-tertiary)", 
                        borderColor: "var(--border-default)", 
                        color: "var(--text-primary)",
                        "--tw-ring-color": "var(--action-primary)",
                        "--tw-border-opacity": "1"
                      }}
                    >
                      <option value="">Select a subject</option>
                      {subjects.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-secondary)" }}>Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter title"
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none"
                      style={{ 
                        backgroundColor: "var(--bg-tertiary)", 
                        borderColor: "var(--border-default)", 
                        color: "var(--text-primary)",
                        "--tw-ring-color": "var(--action-primary)"
                      }}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-secondary)" }}>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter description"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none resize-none"
                      style={{ 
                        backgroundColor: "var(--bg-tertiary)", 
                        borderColor: "var(--border-default)", 
                        color: "var(--text-primary)",
                        "--tw-ring-color": "var(--action-primary)"
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-secondary)" }}>Unit (Optional)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="1-5"
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none"
                      style={{ 
                        backgroundColor: "var(--bg-tertiary)", 
                        borderColor: "var(--border-default)", 
                        color: "var(--text-primary)",
                        "--tw-ring-color": "var(--action-primary)"
                      }}
                    />
                  </div>

                  {contentType === 'video' ? (
                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-secondary)" }}>Duration</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="mm:ss"
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none"
                        style={{ 
                          backgroundColor: "var(--bg-tertiary)", 
                          borderColor: "var(--border-default)", 
                          color: "var(--text-primary)",
                          "--tw-ring-color": "var(--action-primary)"
                        }}
                      />
                    </div>
                  ) : contentType === 'pdf' ? (
                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-secondary)" }}>Page Count</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.pageCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, pageCount: e.target.value }))}
                        placeholder="Number of pages"
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none"
                        style={{ 
                          backgroundColor: "var(--bg-tertiary)", 
                          borderColor: "var(--border-default)", 
                          color: "var(--text-primary)",
                          "--tw-ring-color": "var(--action-primary)"
                        }}
                      />
                    </div>
                  ) : null}
                </div>

                {/* Animation Selection (Animation only) */}
                {contentType === 'animation' && (
                  <div className="mt-6 p-4 rounded-xl border" style={{ backgroundColor: "rgba(168, 85, 247, 0.1)", borderColor: "rgba(168, 85, 247, 0.2)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <FaMagic className="text-purple-400" />
                      <label className="font-bold text-purple-400">Animation Selection</label>
                    </div>
                    <p className="text-sm mb-4 text-purple-300/80">
                      Select the animation component to use for this concept visualization.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Animation Component *</label>
                        <select
                          value={formData.animationId}
                          onChange={(e) => {
                            const selected = availableAnimations.find(a => a.id === e.target.value);
                            setFormData(prev => ({ 
                              ...prev, 
                              animationId: e.target.value,
                              animationSteps: selected?.totalSteps?.toString() || '',
                              title: prev.title || selected?.title || ''
                            }));
                          }}
                          className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none"
                          style={{ 
                            backgroundColor: "var(--bg-tertiary)", 
                            borderColor: "var(--border-default)", 
                            color: "var(--text-primary)",
                            "--tw-ring-color": "var(--action-primary)"
                          }}
                        >
                          <option value="">Select an animation</option>
                          {availableAnimations.map(anim => (
                            <option key={anim.id} value={anim.id}>
                              {anim.title} ({anim.totalSteps} steps) - {anim.subject}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Number of Steps</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.animationSteps}
                          onChange={(e) => setFormData(prev => ({ ...prev, animationSteps: e.target.value }))}
                          placeholder="Auto-detected"
                          className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none"
                          style={{ 
                            backgroundColor: "var(--bg-tertiary)", 
                            borderColor: "var(--border-default)", 
                            color: "var(--text-primary)",
                            "--tw-ring-color": "var(--action-primary)"
                          }}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Audio Explanation Upload (PDF and Animation) */}
                {(contentType === 'pdf' || contentType === 'animation') && (
                  <div className="mt-6 p-4 rounded-xl border" style={{ backgroundColor: "var(--color-warning-bg)", backgroundOpacity: 0.1, borderColor: "var(--color-warning-bg)", borderOpacity: 0.2 }}>
                    <div className="flex items-center gap-2 mb-4">
                      <FaVolumeUp style={{ color: "var(--color-warning-text)" }} />
                      <label className="font-bold" style={{ color: "var(--color-warning-text)" }}>Audio Explanations (Optional)</label>
                    </div>
                    <p className="text-sm mb-4" style={{ color: "var(--color-warning-text)", opacity: 0.8 }}>
                      Upload audio files to help students understand the {contentType === 'pdf' ? 'PDF' : 'animation'} content.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Hindi Audio */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>🇮🇳 Hindi</label>
                        <div 
                          onClick={() => audioHindiRef.current?.click()}
                          className={`p-4 border-2 border-dashed rounded-xl cursor-pointer text-center transition-all ${
                            audioHindiFile ? 'bg-emerald-500/10' : 'hover:border-amber-400'
                          }`}
                          style={{ 
                            borderColor: audioHindiFile ? "var(--color-success-text)" : "var(--border-default)",
                            "--tw-border-opacity": "1"
                          }}
                        >
                          <input
                            ref={audioHindiRef}
                            type="file"
                            accept="audio/*"
                            onChange={(e) => setAudioHindiFile(e.target.files?.[0] || null)}
                            className="hidden"
                          />
                          {audioHindiFile ? (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-emerald-600 truncate">{audioHindiFile.name}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setAudioHindiFile(null); }}
                                className="text-red-500 p-1"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>Click to upload</span>
                          )}
                        </div>
                      </div>
                      
                      {/* English Audio */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>🇬🇧 English</label>
                        <div 
                          onClick={() => audioEnglishRef.current?.click()}
                          className={`p-4 border-2 border-dashed rounded-xl cursor-pointer text-center transition-all ${
                            audioEnglishFile ? 'bg-emerald-500/10' : 'hover:border-amber-400'
                          }`}
                          style={{ 
                            borderColor: audioEnglishFile ? "var(--color-success-text)" : "var(--border-default)",
                            "--tw-border-opacity": "1"
                          }}
                        >
                          <input
                            ref={audioEnglishRef}
                            type="file"
                            accept="audio/*"
                            onChange={(e) => setAudioEnglishFile(e.target.files?.[0] || null)}
                            className="hidden"
                          />
                          {audioEnglishFile ? (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-emerald-600 truncate">{audioEnglishFile.name}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setAudioEnglishFile(null); }}
                                className="text-red-500 p-1"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>Click to upload</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={
                    (contentType !== 'animation' && !mainFile) ||
                    (contentType === 'animation' && !formData.animationId) ||
                    !formData.subject || 
                    !formData.title
                  }
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                    (contentType !== 'animation' && !mainFile) ||
                    (contentType === 'animation' && !formData.animationId) ||
                    !formData.subject || 
                    !formData.title
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:scale-[1.02]'
                  }`}
                >
                  <FaCloudUploadAlt className="inline mr-2" />
                  {contentType === 'video' ? 'Upload Video' : contentType === 'pdf' ? 'Upload PDF' : 'Add Animation'}
                </button>
              </div>
            )}

            {/* Step 3: Uploading */}
            {step === 'uploading' && (
              <div className="text-center py-12">
                <div className="relative inline-block mb-6">
                  <svg className="w-32 h-32">
                    <circle
                      className="text-slate-200"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-indigo-600"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 56}
                      strokeDashoffset={2 * Math.PI * 56 * (1 - uploadProgress / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                      style={{ transition: 'stroke-dashoffset 0.3s' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-600">{uploadProgress}%</span>
                  </div>
                </div>
                <p className="text-lg font-medium text-slate-700">{uploadStatus}</p>
                <p className="text-sm text-slate-400 mt-2">Please don't close this window</p>
              </div>
            )}

            {/* Step 4: Complete */}
            {step === 'complete' && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: "var(--color-success-bg)" }}>
                  <FaCheck size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Upload Successful!</h3>
                <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
                  Your {contentType} has been uploaded and is now available for students.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 rounded-xl font-medium transition-colors border"
                    style={{ 
                      backgroundColor: "var(--bg-secondary)", 
                      color: "var(--text-secondary)",
                      borderColor: "var(--border-default)"
                    }}
                  >
                    Upload Another
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 text-white rounded-xl font-medium transition-colors"
                    style={{ backgroundColor: "var(--action-primary)" }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminContentUpload;
