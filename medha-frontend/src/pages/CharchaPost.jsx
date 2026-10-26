import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import "../styles/CharchaStyles.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AVATARS = ['🐼', '🦊', '🦉', '🐯', '🦁', '🐺', '🐸', '🐵', '🐰', '🐻', 
                 '🦄', '🐲', '🦅', '🐧', '🦋', '🌟', '🚀', '🎨', '📚', '💡'];

const CATEGORIES = [
  { id: 'doubts', label: '💡 Doubts' },
  { id: 'resources', label: '📚 Resources' },
  { id: 'memes', label: '😂 Memes' },
  { id: 'off-topic', label: '💬 Off-Topic' },
  { id: 'announcements', label: '📢 Announcements' },
];

const COMMENT_SORTS = [
  { id: 'best', label: '🏆 Best' },
  { id: 'new', label: '✨ New' },
  { id: 'top', label: '⬆️ Top' },
  { id: 'old', label: '📅 Old' },
];

const CharchaPost = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentSort, setCommentSort] = useState('best');
  
  // New comment state
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [idOrSlug]);

  useEffect(() => {
    if (post) {
      fetchComments();
    }
  }, [post, commentSort]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};
      
      const res = await axios.get(
        `${BACKEND_URL}/api/charcha/posts/${idOrSlug}`,
        config
      );
      setPost(res.data.post);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};
      
      const res = await axios.get(
        `${BACKEND_URL}/api/charcha/posts/${post._id}/comments?sort=${commentSort}`,
        config
      );
      setComments(res.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleVote = async (targetType, targetId, voteType) => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/charcha/vote`,
        { targetType, targetId, voteType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (targetType === 'post') {
        setPost(prev => ({
          ...prev,
          upvotes: res.data.upvotes,
          downvotes: res.data.downvotes,
          score: res.data.score,
          userVote: res.data.userVote,
        }));
      } else {
        // Update comment in nested structure
        const updateCommentVote = (comments) => {
          return comments.map(comment => {
            if (comment._id === targetId) {
              return {
                ...comment,
                upvotes: res.data.upvotes,
                downvotes: res.data.downvotes,
                score: res.data.score,
                userVote: res.data.userVote,
              };
            }
            if (comment.replies?.length > 0) {
              return { ...comment, replies: updateCommentVote(comment.replies) };
            }
            return comment;
          });
        };
        setComments(updateCommentVote(comments));
      }
    } catch (error) {
      console.error("Vote error:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!token || !newComment.trim()) return;
    
    try {
      setSubmitting(true);
      const res = await axios.post(
        `${BACKEND_URL}/api/charcha/posts/${post._id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setComments(prev => [res.data.comment, ...prev]);
      setNewComment('');
      setPost(prev => ({ ...prev, commentCount: (prev.commentCount || 0) + 1 }));
    } catch (error) {
      console.error("Add comment error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentCommentId) => {
    if (!token || !replyContent.trim()) return;
    
    try {
      setSubmitting(true);
      const res = await axios.post(
        `${BACKEND_URL}/api/charcha/posts/${post._id}/comments`,
        { content: replyContent, parentCommentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add reply to parent comment
      const addReplyToComment = (comments) => {
        return comments.map(comment => {
          if (comment._id === parentCommentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), res.data.comment]
            };
          }
          if (comment.replies?.length > 0) {
            return { ...comment, replies: addReplyToComment(comment.replies) };
          }
          return comment;
        });
      };
      
      setComments(addReplyToComment(comments));
      setReplyingTo(null);
      setReplyContent('');
      setPost(prev => ({ ...prev, commentCount: (prev.commentCount || 0) + 1 }));
    } catch (error) {
      console.error("Reply error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/charcha/post/${post.shareSlug || post._id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.substring(0, 100) + '...',
          url: shareUrl,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const getAvatar = (avatarIndex) => {
    if (avatarIndex === -1) return '🎭';
    return AVATARS[avatarIndex % AVATARS.length];
  };

  // Render comment recursively
  const renderComment = (comment, depth = 0) => {
    const maxDepth = 5;
    const isCollapsed = depth >= maxDepth;
    
    return (
      <div 
        key={comment._id} 
        className="charcha-comment"
        style={{ 
          marginLeft: Math.min(depth, maxDepth) * 20,
          borderLeft: depth > 0 ? '2px dashed var(--charcha-lines)' : 'none',
          paddingLeft: depth > 0 ? '1rem' : 0,
        }}
      >
        <div className="charcha-comment-header">
          <span className="charcha-comment-avatar">{getAvatar(comment.author?.avatarIndex)}</span>
          <span className="charcha-comment-author">
            {comment.author?.charchaUsername || 'Anonymous'}
          </span>
          <span className="charcha-comment-time">{formatTime(comment.createdAt)}</span>
        </div>
        
        <p className="charcha-comment-content">{comment.content}</p>
        
        <div className="charcha-comment-actions">
          <button 
            className={`charcha-vote-btn ${comment.userVote === 1 ? 'upvoted' : ''}`}
            onClick={() => handleVote('comment', comment._id, 1)}
          >
            <span className="icon">⬆️</span>
          </button>
          <span className="charcha-score">{comment.score || 0}</span>
          <button 
            className={`charcha-vote-btn ${comment.userVote === -1 ? 'downvoted' : ''}`}
            onClick={() => handleVote('comment', comment._id, -1)}
          >
            <span className="icon">⬇️</span>
          </button>
          
          {token && depth < maxDepth && (
            <button 
              className="charcha-action-btn"
              onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
            >
              💬 Reply
            </button>
          )}
        </div>
        
        {/* Reply form */}
        {replyingTo === comment._id && (
          <div className="charcha-reply-form" style={{ marginTop: '0.75rem' }}>
            <textarea
              className="charcha-form-textarea"
              style={{ minHeight: '80px' }}
              placeholder="Write a reply..."
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button 
                className="charcha-submit-btn"
                style={{ flex: 1 }}
                onClick={() => handleReply(comment._id)}
                disabled={submitting || !replyContent.trim()}
              >
                {submitting ? 'Posting...' : 'Reply'}
              </button>
              <button 
                className="charcha-action-btn"
                onClick={() => setReplyingTo(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {/* Nested replies */}
        {comment.replies?.length > 0 && (
          <div className="charcha-replies" style={{ marginTop: '1rem' }}>
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="charcha-page">
        <div className="charcha-loading">
          <div className="charcha-spinner"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="charcha-page">
        <div className="charcha-empty">
          <div className="charcha-empty-icon">🔍</div>
          <h3 className="charcha-empty-title">Post not found</h3>
          <p className="charcha-empty-text">It may have been deleted or doesn't exist</p>
          <button 
            className="charcha-submit-btn" 
            style={{ marginTop: '1rem' }}
            onClick={() => navigate('/charcha')}
          >
            Back to Charcha
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="charcha-page">
      {/* Back button */}
      <button 
        className="charcha-action-btn"
        onClick={() => navigate('/charcha')}
        style={{ marginBottom: '1rem' }}
      >
        ← Back to Charcha
      </button>

      {/* Post */}
      <article className="charcha-post-card" style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
        <div className="charcha-post-header">
          <div className="charcha-post-avatar">
            {getAvatar(post.author?.avatarIndex)}
          </div>
          <div className="charcha-post-meta">
            <div className="charcha-post-author">
              {post.author?.charchaUsername || 'Anonymous'}
              {post.author?.rank && post.author?.rank !== 'Noob' && (
                <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', opacity: 0.7 }}>
                  [{post.author.rank}]
                </span>
              )}
            </div>
            <div className="charcha-post-time">{formatTime(post.createdAt)}</div>
          </div>
          <span className={`charcha-post-tag ${post.tag}`}>
            {CATEGORIES.find(c => c.id === post.tag)?.label || post.tag}
          </span>
        </div>

        <h1 className="charcha-post-title">{post.title}</h1>
        <div 
          className="charcha-post-content"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {post.content}
        </div>

        <div className="charcha-post-actions">
          <button 
            className={`charcha-vote-btn ${post.userVote === 1 ? 'upvoted' : ''}`}
            onClick={() => handleVote('post', post._id, 1)}
          >
            <span className="icon">⬆️</span>
          </button>
          <span className="charcha-score">{post.score || 0}</span>
          <button 
            className={`charcha-vote-btn ${post.userVote === -1 ? 'downvoted' : ''}`}
            onClick={() => handleVote('post', post._id, -1)}
          >
            <span className="icon">⬇️</span>
          </button>
          
          <span style={{ marginLeft: 'auto' }}>
            💬 {post.commentCount || 0} Comments
          </span>
          
          <button className="charcha-action-btn" onClick={handleShare}>
            🔗 Share
          </button>
        </div>
      </article>

      {/* Comments section */}
      <section style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'var(--charcha-font-title)', fontSize: '1.5rem', margin: 0 }}>
            💬 Comments
          </h2>
          <div className="charcha-sort-tabs" style={{ margin: 0 }}>
            {COMMENT_SORTS.map(sort => (
              <button
                key={sort.id}
                className={`charcha-sort-tab ${commentSort === sort.id ? 'active' : ''}`}
                onClick={() => setCommentSort(sort.id)}
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem' }}
              >
                {sort.label}
              </button>
            ))}
          </div>
        </div>

        {/* Add comment */}
        {token ? (
          <form onSubmit={handleAddComment} style={{ marginBottom: '1.5rem' }}>
            <textarea
              className="charcha-form-textarea"
              style={{ minHeight: '100px' }}
              placeholder="Add a comment... Use @username to mention someone"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <button 
              type="submit"
              className="charcha-submit-btn"
              style={{ marginTop: '0.5rem' }}
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? 'Posting...' : '💬 Comment'}
            </button>
          </form>
        ) : (
          <div className="charcha-sidebar-card" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <p style={{ margin: 0 }}>
              <a href="/login" style={{ color: 'var(--charcha-accent-2)' }}>Login</a> to join the discussion
            </p>
          </div>
        )}

        {/* Comments list */}
        <div className="charcha-comments-list">
          {comments.length === 0 ? (
            <div className="charcha-empty" style={{ padding: '2rem' }}>
              <div className="charcha-empty-icon">💭</div>
              <h3 className="charcha-empty-title">No comments yet</h3>
              <p className="charcha-empty-text">Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map(comment => renderComment(comment))
          )}
        </div>
      </section>
    </div>
  );
};

export default CharchaPost;
