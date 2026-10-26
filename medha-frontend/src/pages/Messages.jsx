import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaPaperPlane, FaMagnifyingGlass, FaUserCircle, FaBroadcastTower, 
  FaArrowLeft, FaXmark, FaSpinner, FaCheck, FaCheckDouble,
  FaCrown, FaUsers, FaCommentDots, FaEnvelope, FaTrash, FaUser
} from "react-icons/fa6";
import Card from "../components/Common/Card";
import Loader from "../components/Common/Loader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Messages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [adminUser, setAdminUser] = useState(null); // Admin user for regular users to contact
  
  // Admin features
  const [showContactList, setShowContactList] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactSearch, setContactSearch] = useState("");
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState(null);

  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch conversations
  useEffect(() => {
    const init = async () => {
      try {
        // Check admin status
        const adminRes = await axios.get(`${BACKEND_URL}/api/messages/check-admin`, { headers });
        setIsAdmin(adminRes.data.isAdmin);

        // Get current user ID from token
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(tokenData.id || tokenData.userId);

        // Fetch conversations
        const convRes = await axios.get(`${BACKEND_URL}/api/chats/conversations`, { headers });
        setConversations(convRes.data.conversations || []);

        // If admin, also fetch contacts
        if (adminRes.data.isAdmin) {
          const contactsRes = await axios.get(`${BACKEND_URL}/api/chats/admin/contacts`, { headers });
          setContacts(contactsRes.data.contacts || []);
        } else {
          // For regular users, fetch admin info so they can start conversation
          try {
            const adminInfoRes = await axios.get(`${BACKEND_URL}/api/chats/get-admin`, { headers });
            setAdminUser(adminInfoRes.data.admin);
          } catch {
            console.error("Could not fetch admin info");
          }
        }
      } catch (error) {
        console.error("Error initializing:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      init();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId) => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/chats/conversations/${conversationId}/messages`, 
        { headers }
      );
      setMessages(res.data.messages || []);
      
      // Update conversation unread count locally
      setConversations(prev => prev.map(c => 
        c._id === conversationId ? { ...c, unreadCount: 0 } : c
      ));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Select a conversation
  const handleSelectConversation = (conv) => {
    setSelectedConv(conv);
    fetchMessages(conv._id);
    setShowContactList(false);
  };

  // Send message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !selectedConv || sending) return;

    setSending(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/chats/conversations/${selectedConv._id}/messages`,
        { text: newMessage.trim() },
        { headers }
      );
      
      setMessages(prev => [...prev, res.data.message]);
      setNewMessage("");
      
      // Update conversation list
      setConversations(prev => prev.map(c => 
        c._id === selectedConv._id ? {
          ...c,
          lastMessage: {
            text: newMessage.trim().substring(0, 100),
            sender: { _id: currentUserId },
            timestamp: new Date()
          }
        } : c
      ));
    } catch (error) {
      console.error("Error sending message:", error);
      alert(error.response?.data?.error || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Start new conversation with a contact
  const handleStartConversation = async (userId) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/chats/conversations`,
        { recipientId: userId },
        { headers }
      );
      
      const newConv = res.data.conversation;
      
      // Check if conversation already exists in list
      const exists = conversations.find(c => c._id === newConv._id);
      if (!exists) {
        setConversations(prev => [newConv, ...prev]);
      }
      
      setSelectedConv(newConv);
      fetchMessages(newConv._id);
      setShowContactList(false);
    } catch (error) {
      console.error("Error starting conversation:", error);
      alert(error.response?.data?.error || "Failed to start conversation");
    }
  };

  // Broadcast message to all users
  const handleBroadcast = async () => {
    if (!broadcastMessage.trim() || broadcastSending) return;

    setBroadcastSending(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/chats/broadcast`,
        { text: broadcastMessage.trim() },
        { headers }
      );
      
      alert(`Message broadcast to ${res.data.recipientCount} users!`);
      setBroadcastMessage("");
      setShowBroadcast(false);
      
      // Refresh conversations
      const convRes = await axios.get(`${BACKEND_URL}/api/chats/conversations`, { headers });
      setConversations(convRes.data.conversations || []);
    } catch (error) {
      console.error("Error broadcasting:", error);
      alert(error.response?.data?.error || "Failed to broadcast message");
    } finally {
      setBroadcastSending(false);
    }
  };

  // Delete message (Admin only)
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    
    setDeletingMessageId(messageId);
    try {
      await axios.delete(
        `${BACKEND_URL}/api/chats/messages/${messageId}`,
        { headers }
      );
      
      // Remove message from local state
      setMessages(prev => prev.filter(m => m._id !== messageId));
      
      // Refresh conversations to update last message preview
      const convRes = await axios.get(`${BACKEND_URL}/api/chats/conversations`, { headers });
      setConversations(convRes.data.conversations || []);
    } catch (error) {
      console.error("Error deleting message:", error);
      alert(error.response?.data?.error || "Failed to delete message");
    } finally {
      setDeletingMessageId(null);
    }
  };

  // Filter contacts by search
  const filteredContacts = contacts.filter(c => 
    c.name?.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.email?.toLowerCase().includes(contactSearch.toLowerCase())
  );

  // Get chat partner name
  const getChatPartnerName = (conv) => {
    if (conv.isBroadcast) return "📢 Announcements";
    const other = conv.participants?.find(p => p._id !== currentUserId);
    return other?.name || "Unknown";
  };

  const getChatPartner = (conv) => {
    if (conv.isBroadcast) return null;
    return conv.participants?.find(p => p._id !== currentUserId);
  };

  // Format timestamp
  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString();
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div 
      className="min-h-screen pt-20 px-2 sm:px-4 pb-4"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-6xl mx-auto" style={{ height: "calc(100dvh - 6rem)" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Messages
          </h1>
          
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowContactList(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition flex items-center gap-2 text-sm font-medium"
              >
                <FaUsers /> Contacts
              </button>
              <button
                onClick={() => setShowBroadcast(true)}
                className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition flex items-center gap-2 text-sm font-medium"
              >
                <FaBroadcastTower /> Broadcast
              </button>
            </div>
          )}
        </div>

        {/* Main Chat Container */}
        <div 
          className="flex rounded-2xl overflow-hidden border"
          style={{ 
            backgroundColor: "var(--bg-secondary)", 
            borderColor: "var(--accent-secondary)",
            height: "calc(100dvh - 10rem)"
          }}
        >
          {/* Left Panel - Conversation List */}
          <div 
            className={`w-full md:w-80 lg:w-96 border-r flex flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}
            style={{ borderColor: "var(--accent-secondary)" }}
          >
            <div className="p-4 border-b" style={{ borderColor: "var(--accent-secondary)" }}>
              <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                {isAdmin ? "All Conversations" : "Chat with Admin"}
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-6 text-center" style={{ color: "var(--text-secondary)" }}>
                  <FaEnvelope className="text-4xl mx-auto mb-3 opacity-50" />
                  <p className="mb-3">No conversations yet</p>
                  {isAdmin ? (
                    <button
                      onClick={() => setShowContactList(true)}
                      className="text-sm text-emerald-400 hover:underline"
                    >
                      Start a conversation →
                    </button>
                  ) : adminUser && (
                    <button
                      onClick={() => handleStartConversation(adminUser._id)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold transition hover:shadow-lg flex items-center gap-2 mx-auto"
                    >
                      <FaCommentDots /> Contact Admin
                    </button>
                  )}
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`p-4 cursor-pointer hover:bg-white/5 transition border-b flex items-start gap-3 ${
                      selectedConv?._id === conv._id ? 'bg-white/10' : ''
                    }`}
                    style={{ borderColor: "var(--accent-secondary)" }}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold overflow-hidden">
                      {conv.isBroadcast ? (
                        "📢"
                      ) : getChatPartner(conv)?.avatar ? (
                        <img src={getChatPartner(conv).avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <FaUser />
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                          {getChatPartnerName(conv)}
                        </span>
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {formatDate(conv.lastMessage?.timestamp)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                          {conv.lastMessage?.text || "No messages yet"}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-bold">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel - Chat Window */}
          <div className={`flex-1 flex flex-col ${selectedConv ? 'flex' : 'hidden md:flex'}`}>
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div 
                  className="p-4 border-b flex items-center gap-3"
                  style={{ borderColor: "var(--accent-secondary)" }}
                >
                  <button
                    onClick={() => setSelectedConv(null)}
                    className="md:hidden p-2 rounded-lg hover:bg-white/10"
                  >
                    <FaArrowLeft style={{ color: "var(--text-primary)" }} />
                  </button>
                  
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold overflow-hidden">
                    {selectedConv.isBroadcast ? (
                      "📢"
                    ) : getChatPartner(selectedConv)?.avatar ? (
                      <img src={getChatPartner(selectedConv).avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <FaUser />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>
                      {getChatPartnerName(selectedConv)}
                    </h3>
                    {selectedConv.isBroadcast && (
                      <span className="text-xs text-purple-400">Broadcast Channel</span>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-12" style={{ color: "var(--text-secondary)" }}>
                      <p>{selectedConv?.isBroadcast && !isAdmin ? 'No announcements yet.' : 'No messages yet. Say hello! 👋'}</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isOwn = msg.sender?._id === currentUserId;
                      return (
                        <div
                          key={msg._id || idx}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
                        >
                          <div className="relative">
                            <div
                              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                                isOwn 
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-br-md' 
                                  : 'bg-white/10 rounded-bl-md'
                              }`}
                              style={!isOwn ? { color: "var(--text-primary)" } : {}}
                            >
                              {!isOwn && msg.sender?.isAdmin && (
                                <div className="flex items-center gap-1 text-xs text-amber-400 mb-1">
                                  <FaCrown /> Admin
                                </div>
                              )}
                              <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
                              <div className={`text-xs mt-1 flex items-center gap-1 ${isOwn ? 'text-white/70 justify-end' : ''}`}
                                style={!isOwn ? { color: "var(--text-secondary)" } : {}}
                              >
                                {formatTime(msg.createdAt)}
                                {isOwn && (
                                  msg.readBy?.length > 1 ? <FaCheckDouble className="text-blue-300" /> : <FaCheck />
                                )}
                              </div>
                            </div>
                            
                            {/* Admin Delete Button */}
                            {isAdmin && (
                              <button
                                onClick={() => handleDeleteMessage(msg._id)}
                                disabled={deletingMessageId === msg._id}
                                className={`absolute -top-2 ${isOwn ? '-left-8' : '-right-8'} p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition opacity-0 group-hover:opacity-100`}
                                title="Delete message"
                              >
                                {deletingMessageId === msg._id ? (
                                  <FaSpinner className="animate-spin text-xs" />
                                ) : (
                                  <FaTrash className="text-xs" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input - Hidden for non-admin in broadcast conversations */}
                {selectedConv?.isBroadcast && !isAdmin ? (
                  <div 
                    className="p-4 border-t text-center"
                    style={{ borderColor: "var(--accent-secondary)", color: "var(--text-secondary)" }}
                  >
                    <FaBroadcastTower className="inline-block mr-2 text-purple-400" />
                    <span>Announcements are posted by admin only</span>
                  </div>
                ) : (
                  <form 
                    onSubmit={handleSendMessage}
                    className="p-4 border-t flex gap-3"
                    style={{ borderColor: "var(--accent-secondary)" }}
                  >
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      style={{ 
                        borderColor: "var(--accent-secondary)", 
                        color: "var(--text-primary)" 
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold disabled:opacity-50 transition hover:shadow-lg"
                    >
                      {sending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                    </button>
                  </form>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center" style={{ color: "var(--text-secondary)" }}>
                <div className="text-center">
                  <FaUserCircle className="text-6xl mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact List Modal (Admin Only) */}
      {showContactList && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowContactList(false)}
        >
          <div 
            className="w-full max-w-md max-h-[80vh] rounded-2xl overflow-hidden"
            style={{ backgroundColor: "var(--bg-primary)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: "var(--accent-secondary)" }}>
              <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>All Users</h3>
              <button onClick={() => setShowContactList(false)}>
                <FaXmark style={{ color: "var(--text-secondary)" }} />
              </button>
            </div>
            
            <div className="p-4 border-b" style={{ borderColor: "var(--accent-secondary)" }}>
              <div className="relative">
                <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
                <input
                  type="text"
                  value={contactSearch}
                  onChange={e => setContactSearch(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  style={{ borderColor: "var(--accent-secondary)", color: "var(--text-primary)" }}
                />
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-96">
              {filteredContacts.length === 0 ? (
                <div className="p-6 text-center" style={{ color: "var(--text-secondary)" }}>
                  No users found
                </div>
              ) : (
                filteredContacts.map(contact => (
                  <div
                    key={contact._id}
                    onClick={() => handleStartConversation(contact._id)}
                    className="p-4 flex items-center gap-3 hover:bg-white/5 cursor-pointer transition border-b"
                    style={{ borderColor: "var(--accent-secondary)" }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold overflow-hidden">
                      {contact.avatar ? (
                        <img src={contact.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <FaUser />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: "var(--text-primary)" }}>{contact.name}</p>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{contact.email}</p>
                    </div>
                    {contact.hasConversation && (
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                        Chat exists
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Modal (Admin Only) */}
      {showBroadcast && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowBroadcast(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{ backgroundColor: "var(--bg-primary)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: "var(--accent-secondary)" }}>
              <div className="flex items-center gap-2">
                <FaBroadcastTower className="text-purple-400" />
                <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Broadcast to All Users</h3>
              </div>
              <button onClick={() => setShowBroadcast(false)}>
                <FaXmark style={{ color: "var(--text-secondary)" }} />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                This message will be sent to all registered users.
              </p>
              <textarea
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                placeholder="Write your announcement..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                style={{ borderColor: "var(--accent-secondary)", color: "var(--text-primary)" }}
              />
              <button
                onClick={handleBroadcast}
                disabled={!broadcastMessage.trim() || broadcastSending}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold disabled:opacity-50 transition hover:shadow-lg flex items-center justify-center gap-2"
              >
                {broadcastSending ? (
                  <><FaSpinner className="animate-spin" /> Sending...</>
                ) : (
                  <><FaBroadcastTower /> Send to All Users</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
