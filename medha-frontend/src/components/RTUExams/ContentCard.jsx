import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlay, 
  FaFilePdf, 
  FaHeart, 
  FaRegHeart, 
  FaEye,
  FaClock,
  FaEdit,
  FaTrash,
  FaMagic
} from 'react-icons/fa';

/**
 * ContentCard - Card component for video or PDF content
 * Shows thumbnail, title, duration/pages, likes, and views
 */
const ContentCard = ({
  id,
  type, // 'video', 'pdf', or 'animation'
  title,
  description,
  thumbnailUrl,
  duration, // For videos
  pageCount, // For PDFs
  animationSteps, // For animations
  likeCount,
  views,
  isLiked,
  onClick,
  onLike,
  index = 0,
  isAdmin = false,
  onEdit,
  onDelete
}) => {
  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (onLike) onLike(id);
  };
  
  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit();
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      if (window.confirm('Are you sure you want to delete this content?')) {
        onDelete(id);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-sm border border-[var(--border-default)] hover:shadow-xl hover:border-[var(--action-primary)] transition-all duration-300 hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-[var(--bg-tertiary)] overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--action-primary)]/10 to-[var(--action-hover)]/10">
              {type === 'video' ? (
                <FaPlay size={40} className="text-[var(--action-primary)]/30" />
              ) : type === 'pdf' ? (
                <FaFilePdf size={40} className="text-[var(--color-danger-text)]/30" />
              ) : (
                <FaMagic size={40} className="text-purple-400/30" />
              )}
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              className="p-4 bg-[var(--bg-secondary)]/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {type === 'video' ? (
                <FaPlay size={24} className="text-[var(--action-primary)] ml-1" />
              ) : type === 'pdf' ? (
                <FaFilePdf size={24} className="text-[var(--color-danger-text)]" />
              ) : (
                <FaMagic size={24} className="text-purple-400" />
              )}
            </motion.div>
          </div>

          {/* Duration/Page Count/Steps Badge */}
          {(duration || pageCount || animationSteps) && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded-md">
              {type === 'video' ? (
                <span className="flex items-center gap-1">
                  <FaClock size={10} />
                  {duration}
                </span>
              ) : type === 'pdf' ? (
                <span>{pageCount} pages</span>
              ) : (
                <span>{animationSteps} steps</span>
              )}
            </div>
          )}

          {/* Type Badge */}
          <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-md ${
            type === 'video' 
              ? 'bg-[var(--action-primary)] text-white' 
              : type === 'pdf'
              ? 'bg-[var(--color-danger-text)] text-white'
              : 'bg-purple-500 text-white'
          }`}>
            {type === 'video' ? 'VIDEO' : type === 'pdf' ? 'PDF' : 'ANIMATION'}
          </div>
          
          {/* Admin Edit Button */}
          {isAdmin && (
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleEditClick}
                className="p-2 bg-[var(--bg-secondary)]/90 backdrop-blur-sm rounded-lg text-[var(--text-secondary)] hover:text-[var(--action-primary)] hover:bg-[var(--bg-secondary)] shadow-md transition-all"
                title="Edit content"
              >
                <FaEdit size={14} />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-2 bg-[var(--bg-secondary)]/90 backdrop-blur-sm rounded-lg text-[var(--text-secondary)] hover:text-[var(--color-danger-text)] hover:bg-[var(--bg-secondary)] shadow-md transition-all"
                title="Delete content"
              >
                <FaTrash size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-[var(--text-primary)] mb-1 line-clamp-2 group-hover:text-[var(--action-primary)] transition-colors">
            {title}
          </h3>
          
          {description && (
            <p className="text-sm text-[var(--text-tertiary)] line-clamp-2 mb-3">
              {description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-default)]">
            <div className="flex items-center gap-4 text-sm text-[var(--text-tertiary)]">
              {/* Views */}
              <span className="flex items-center gap-1">
                <FaEye size={14} />
                {views || 0}
              </span>
            </div>

            {/* Like Button */}
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                isLiked
                  ? 'bg-[var(--color-danger-bg)]/20 text-[var(--color-danger-text)]'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:bg-[var(--color-danger-bg)]/20 hover:text-[var(--color-danger-text)]'
              }`}
            >
              {isLiked ? (
                <FaHeart size={14} className="text-[var(--color-danger-text)]" />
              ) : (
                <FaRegHeart size={14} />
              )}
              <span>{likeCount || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Memoize to prevent re-renders when parent updates but props haven't changed
export default React.memo(ContentCard);
