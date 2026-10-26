import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import "../styles/CharchaStyles.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Avatar emojis for display
const AVATARS = ['🐼', '🦊', '🦉', '🐯', '🦁', '🐺', '🐸', '🐵', '🐰', '🐻', 
                 '🦄', '🐲', '🦅', '🐧', '🦋', '🌟', '🚀', '🎨', '📚', '💡'];

// Category config
const CATEGORIES = [
  { id: 'all', label: '🎯 All', color: '' },
  { id: 'doubts', label: '💡 Doubts', color: 'doubts' },
  { id: 'resources', label: '📚 Resources', color: 'resources' },
  { id: 'memes', label: '😂 Memes', color: 'memes' },
  { id: 'off-topic', label: '💬 Off-Topic', color: 'off-topic' },
  { id: 'announcements', label: '📢 Announcements', color: 'announcements' },
];

// Sort options
const SORT_OPTIONS = [
  { id: 'hot', label: '🔥 Hot' },
  { id: 'new', label: '✨ New' },
  { id: 'top', label: '🏆 Top' },
  { id: 'controversial', label: '⚡ Controversial' },
];

const Charcha = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  
  // State
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('hot');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tag: 'off-topic',
    isAnonymous: false,
  });
  const [creating, setCreating] = useState(false);

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, [sort, category]);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(pageNum === 1);
      const params = new URLSearchParams({
        sort,
        page: pageNum,
        limit: 20,
      });
      if (category !== 'all') {
        params.append('tag', category);
      }
      
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};
      
      const res = await axios.get(
        `${BACKEND_URL}/api/charcha/posts?${params}`,
        config
      );
      
      if (pageNum === 1) {
        setPosts(res.data.posts);
      } else {
        setPosts(prev => [...prev, ...res.data.posts]);
      }
      
      setHasMore(res.data.pagination.page < res.data.pagination.pages);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Vote handler
  const handleVote = async (postId, voteType) => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/charcha/vote`,
        { targetType: 'post', targetId: postId, voteType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update post in state
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            upvotes: res.data.upvotes,
            downvotes: res.data.downvotes,
            score: res.data.score,
            userVote: res.data.userVote,
          };
        }
        return post;
      }));
    } catch (error) {
      console.error("Vote error:", error);
    }
  };

  // Create post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (!newPost.title.trim() || !newPost.content.trim()) {
      return;
    }
    
    try {
      setCreating(true);
      const res = await axios.post(
        `${BACKEND_URL}/api/charcha/posts`,
        newPost,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add to top of feed
      setPosts(prev => [res.data.post, ...prev]);
      setShowCreateModal(false);
      setNewPost({ title: '', content: '', tag: 'off-topic', isAnonymous: false });
    } catch (error) {
      console.error("Create post error:", error);
      alert(error.response?.data?.message || "Error creating post");
    } finally {
      setCreating(false);
    }
  };

  // Share post
  const handleShare = async (post) => {
    const shareUrl = `${window.location.origin}/charcha/post/${post.shareSlug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.substring(0, 100) + '...',
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  // Format time
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

  // Get avatar
  const getAvatar = (avatarIndex) => {
    if (avatarIndex === -1) return '🎭'; // Anonymous
    return AVATARS[avatarIndex % AVATARS.length];
  };

  return (
    <div className="charcha-page">
      {/* Header */}
      <header className="charcha-header">
        <h1 className="charcha-title">Charcha</h1>
        <p className="charcha-subtitle">Where students connect, share, and grow together ✨</p>
      </header>

      {/* Sort Tabs */}
      <div className="charcha-sort-tabs">
        {SORT_OPTIONS.map(option => (
          <button
            key={option.id}
            className={`charcha-sort-tab ${sort === option.id ? 'active' : ''}`}
            onClick={() => setSort(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="charcha-categories">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`charcha-category ${cat.color} ${category === cat.id ? 'active' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Layout */}
      <div className="charcha-layout">
        {/* Feed */}
        <div className="charcha-feed">
          {loading ? (
            <div className="charcha-loading">
              <div className="charcha-spinner"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="charcha-empty">
              <div className="charcha-empty-icon">📝</div>
              <h3 className="charcha-empty-title">No posts yet!</h3>
              <p className="charcha-empty-text">Be the first to start a discussion</p>
            </div>
          ) : (
            <>
              {posts.map(post => (
                <article key={post._id} className="charcha-post-card">
                  {/* Post Header */}
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

                  {/* Post Content */}
                  <h2 
                    className="charcha-post-title"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/charcha/post/${post.shareSlug || post._id}`)}
                  >
                    {post.title}
                  </h2>
                  <p className="charcha-post-content">
                    {post.content.length > 300 
                      ? post.content.substring(0, 300) + '...' 
                      : post.content}
                  </p>

                  {/* Post Actions */}
                  <div className="charcha-post-actions">
                    <button 
                      className={`charcha-vote-btn ${post.userVote === 1 ? 'upvoted' : ''}`}
                      onClick={() => handleVote(post._id, 1)}
                    >
                      <span className="icon">⬆️</span>
                    </button>
                    <span className="charcha-score">{post.score || 0}</span>
                    <button 
                      className={`charcha-vote-btn ${post.userVote === -1 ? 'downvoted' : ''}`}
                      onClick={() => handleVote(post._id, -1)}
                    >
                      <span className="icon">⬇️</span>
                    </button>
                    
                    <button 
                      className="charcha-action-btn"
                      onClick={() => navigate(`/charcha/post/${post.shareSlug || post._id}`)}
                    >
                      💬 {post.commentCount || 0} Comments
                    </button>
                    
                    <button 
                      className="charcha-action-btn"
                      onClick={() => handleShare(post)}
                    >
                      🔗 Share
                    </button>
                  </div>
                </article>
              ))}
              
              {/* Load More */}
              {hasMore && (
                <button 
                  className="charcha-submit-btn"
                  onClick={() => fetchPosts(page + 1)}
                  style={{ maxWidth: '200px', margin: '0 auto' }}
                >
                  Load More
                </button>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="charcha-sidebar">
          {/* Your Stats */}
          {user && (
            <div className="charcha-sidebar-card">
              <h3 className="charcha-sidebar-title">📊 Your Stats</h3>
              <div style={{ fontFamily: 'var(--charcha-font-hand)', fontSize: '1rem' }}>
                <p><strong>Username:</strong> {user.charchaUsername || 'Not set'}</p>
                <p><strong>Karma:</strong> {user.karma || 0}</p>
                <p><strong>Rank:</strong> {user.rank || 'Noob'}</p>
              </div>
            </div>
          )}

          {/* Community Rules */}
          <div className="charcha-sidebar-card">
            <h3 className="charcha-sidebar-title">📜 Community Rules</h3>
            <ol style={{ fontFamily: 'var(--charcha-font-hand)', fontSize: '0.95rem', paddingLeft: '1.2rem', margin: 0 }}>
              <li>Be respectful & kind</li>
              <li>No spam or self-promotion</li>
              <li>Stay on topic</li>
              <li>No plagiarism</li>
              <li>Use @admin for help</li>
            </ol>
          </div>
        </aside>
      </div>

      {/* Create Post Button - Always visible */}
      <button 
        className="charcha-create-btn"
        onClick={() => token ? setShowCreateModal(true) : navigate('/login')}
        title="Create Post"
      >
        ✏️
      </button>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="charcha-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="charcha-modal" onClick={e => e.stopPropagation()}>
            <div className="charcha-modal-header">
              <h2 className="charcha-modal-title">✏️ Create Post</h2>
              <button 
                className="charcha-modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="charcha-modal-body">
              <form onSubmit={handleCreatePost}>
                <div className="charcha-form-group">
                  <label className="charcha-form-label">Title</label>
                  <input
                    type="text"
                    className="charcha-form-input"
                    placeholder="What's on your mind?"
                    value={newPost.title}
                    onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                    maxLength={300}
                    required
                  />
                </div>

                <div className="charcha-form-group">
                  <label className="charcha-form-label">Content</label>
                  <textarea
                    className="charcha-form-textarea"
                    placeholder="Share your thoughts... Use @username to mention someone, @admin to reach admin"
                    value={newPost.content}
                    onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                    maxLength={10000}
                    required
                  />
                </div>

                <div className="charcha-form-group">
                  <label className="charcha-form-label">Category</label>
                  <select
                    className="charcha-form-select"
                    value={newPost.tag}
                    onChange={e => setNewPost({ ...newPost, tag: e.target.value })}
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="charcha-form-group">
                  <label className="charcha-form-checkbox">
                    <input
                      type="checkbox"
                      checked={newPost.isAnonymous}
                      onChange={e => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
                    />
                    Post anonymously (3/day limit)
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="charcha-submit-btn"
                  disabled={creating || !newPost.title.trim() || !newPost.content.trim()}
                >
                  {creating ? 'Posting...' : '📤 Post to Charcha'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Charcha;
