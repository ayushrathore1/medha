"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Search,
  Users,
  Radio,
  ArrowLeft,
  X,
  Check,
  CheckCheck,
  ChevronRight,
  Crown,
  Mail,
  Trash2,
  User,
  MessageSquare,
  AlertCircle
} from "lucide-react";

interface Participant {
  _id: string;
  name: string;
  avatar?: string;
  avatarIndex?: number;
  email?: string;
}

interface Message {
  _id: string;
  text: string;
  sender: {
    _id: string;
    name?: string;
    avatar?: string;
    avatarIndex?: number;
    isAdmin?: boolean;
  };
  createdAt: string;
  readBy?: string[];
}

interface Conversation {
  _id: string;
  isBroadcast: boolean;
  participants: Participant[];
  lastMessage?: {
    text: string;
    sender: { _id: string };
    timestamp: string;
  };
  unreadCount: number;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  avatarIndex?: number;
  hasConversation?: boolean;
}

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser, token, isAuthenticated } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<Participant | null>(null);

  // Admin Features
  const [showContactList, setShowContactList] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactSearch, setContactSearch] = useState("");
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Fetch messages
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const res = await apiGet<{ messages: Message[] }>(
        `/api/chats/conversations/${conversationId}/messages`
      );
      setMessages(res.messages || []);

      // Reset local unread counter
      setConversations((prev) =>
        prev.map((c) => (c._id === conversationId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  // Initialize and load conversations
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const init = async () => {
      try {
        setLoading(true);

        // Check if current user is admin
        const adminRes = await apiGet<{ isAdmin: boolean }>("/api/messages/check-admin");
        setIsAdmin(adminRes.isAdmin);

        // Fetch conversations
        const convRes = await apiGet<{ conversations: Conversation[] }>("/api/chats/conversations");
        const loadedConv = convRes.conversations || [];
        setConversations(loadedConv);

        // Fetch contacts/admin info
        if (adminRes.isAdmin) {
          const contactsRes = await apiGet<{ contacts: Contact[] }>("/api/chats/admin/contacts");
          setContacts(contactsRes.contacts || []);
        } else {
          try {
            const adminInfoRes = await apiGet<{ admin: Participant }>("/api/chats/get-admin");
            setAdminUser(adminInfoRes.admin);
          } catch {
            console.error("Could not fetch admin info");
          }
        }

        // Auto-select chat from query param if available
        const autoChatId = searchParams.get("chat");
        if (autoChatId) {
          const found = loadedConv.find((c) => c._id === autoChatId);
          if (found) {
            setSelectedConv(found);
            await fetchMessages(found._id);
          }
        }
      } catch (error) {
        console.error("Error initializing chats:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [isAuthenticated, router, searchParams, fetchMessages]);

  const handleSelectConversation = async (conv: Conversation) => {
    setSelectedConv(conv);
    await fetchMessages(conv._id);
    setShowContactList(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv || sending) return;

    setSending(true);
    const textToSend = newMessage.trim();
    try {
      const res = await apiPost<{ message: Message }>(
        `/api/chats/conversations/${selectedConv._id}/messages`,
        { text: textToSend }
      );

      setMessages((prev) => [...prev, res.message]);
      setNewMessage("");

      // Update conversations preview locally
      setConversations((prev) =>
        prev.map((c) =>
          c._id === selectedConv._id
            ? {
                ...c,
                lastMessage: {
                  text: textToSend,
                  sender: { _id: currentUser?._id || "" },
                  timestamp: new Date().toISOString(),
                },
              }
            : c
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleStartConversation = async (recipientId: string) => {
    try {
      const res = await apiPost<{ conversation: Conversation }>("/api/chats/conversations", {
        recipientId,
      });

      const newConv = res.conversation;
      const exists = conversations.find((c) => c._id === newConv._id);

      if (!exists) {
        setConversations((prev) => [newConv, ...prev]);
      }

      setSelectedConv(newConv);
      await fetchMessages(newConv._id);
      setShowContactList(false);
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim() || broadcastSending) return;

    setBroadcastSending(true);
    try {
      const res = await apiPost<{ recipientCount: number }>("/api/chats/broadcast", {
        text: broadcastMessage.trim(),
      });

      alert(`Announcement broadcast to ${res.recipientCount} users successfully!`);
      setBroadcastMessage("");
      setShowBroadcast(false);

      // Refresh conversations
      const convRes = await apiGet<{ conversations: Conversation[] }>("/api/chats/conversations");
      setConversations(convRes.conversations || []);
    } catch (error) {
      console.error("Error broadcasting announcement:", error);
    } finally {
      setBroadcastSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    setDeletingMessageId(messageId);
    try {
      await apiDelete(`/api/chats/messages/${messageId}`);
      setMessages((prev) => prev.filter((m) => m._id !== messageId));

      // Refresh conversations list to update preview
      const convRes = await apiGet<{ conversations: Conversation[] }>("/api/chats/conversations");
      setConversations(convRes.conversations || []);
    } catch (error) {
      console.error("Error deleting message:", error);
    } finally {
      setDeletingMessageId(null);
    }
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.email?.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const getChatPartnerName = (conv: Conversation) => {
    if (conv.isBroadcast) return "📢 Announcements";
    const other = conv.participants?.find((p) => p._id !== currentUser?._id);
    return other?.name || "System User";
  };

  const getChatPartner = (conv: Conversation) => {
    if (conv.isBroadcast) return null;
    return conv.participants?.find((p) => p._id !== currentUser?._id);
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "24px auto", padding: "0 16px" }}>
      {/* Title Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-black bg-gradient-to-r from-[var(--primary)] to-emerald-400 bg-clip-text text-transparent tracking-tight">
          Medha Hub Messages
        </h1>

        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowContactList(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition flex items-center gap-2 text-xs font-bold border border-emerald-500/20 cursor-pointer"
            >
              <Users size={14} /> Contacts Directory
            </button>
            <button
              onClick={() => setShowBroadcast(true)}
              className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition flex items-center gap-2 text-xs font-bold border border-purple-500/20 cursor-pointer"
            >
              <Radio size={14} /> Broadcast Announcement
            </button>
          </div>
        )}
      </div>

      {/* Main Chat Grid Component */}
      <div className="flex rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--card)] shadow-lg h-[68vh]">
        {/* Conversations Sidebar (Left Panel) */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-[var(--border)] flex flex-col ${
            selectedConv ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="p-4 border-b border-[var(--border)] bg-[var(--secondary)]/30">
            <h2 className="font-bold text-sm text-[var(--foreground)] uppercase tracking-wider">
              {isAdmin ? "All Active Student Chats" : "Direct Admin Chat"}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[var(--border)]">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-[var(--muted-foreground)]">
                <Mail size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-semibold mb-3">No conversations active</p>
                {isAdmin ? (
                  <button
                    onClick={() => setShowContactList(true)}
                    className="text-xs text-[var(--primary)] font-bold hover:underline cursor-pointer"
                  >
                    Browse Contacts List →
                  </button>
                ) : (
                  adminUser && (
                    <button
                      onClick={() => handleStartConversation(adminUser._id)}
                      className="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white font-bold text-xs transition hover:opacity-90 flex items-center gap-1.5 mx-auto cursor-pointer"
                    >
                      <MessageSquare size={14} /> Connect with Medha Admin
                    </button>
                  )
                )}
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = selectedConv?._id === conv._id;
                const partner = getChatPartner(conv);
                return (
                  <div
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`p-4 cursor-pointer hover:bg-[var(--secondary)]/40 transition flex items-start gap-3 relative ${
                      isActive ? "bg-[var(--secondary)] border-l-4 border-[var(--primary)]" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--primary)] to-emerald-500 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                      {conv.isBroadcast ? (
                        "📢"
                      ) : partner?.avatar ? (
                        <img
                          src={partner.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        partner?.name?.charAt(0) || <User size={18} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-[var(--foreground)] truncate pr-2">
                          {getChatPartnerName(conv)}
                        </span>
                        <span className="text-[10px] font-bold text-[var(--muted-foreground)]">
                          {formatDate(conv.lastMessage?.timestamp)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-[var(--muted-foreground)] truncate max-w-[80%]">
                          {conv.lastMessage?.text || "No messages sent yet"}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-[var(--primary)] text-white text-[10px] font-extrabold shadow-sm animate-pulse">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Dynamic Chat Pane (Right Panel) */}
        <div className={`flex-1 flex flex-col ${selectedConv ? "flex" : "hidden md:flex"}`}>
          {selectedConv ? (
            <>
              {/* Chat Header details */}
              <div className="p-4 border-b border-[var(--border)] bg-[var(--secondary)]/30 flex items-center gap-3">
                <button
                  onClick={() => setSelectedConv(null)}
                  className="md:hidden p-1.5 rounded-lg hover:bg-[var(--secondary)] mr-1 cursor-pointer"
                >
                  <ArrowLeft size={16} className="text-[var(--foreground)]" />
                </button>

                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-emerald-500 flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
                  {selectedConv.isBroadcast ? (
                    "📢"
                  ) : getChatPartner(selectedConv)?.avatar ? (
                    <img
                      src={getChatPartner(selectedConv)?.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    getChatPartner(selectedConv)?.name?.charAt(0) || <User size={16} />
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[var(--foreground)]">
                    {getChatPartnerName(selectedConv)}
                  </h3>
                  {selectedConv.isBroadcast && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-extrabold uppercase tracking-wider">
                      Official Broadcast Feed
                    </span>
                  )}
                </div>
              </div>

              {/* Chat Feed Messages list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--secondary)]/10">
                {messages.length === 0 ? (
                  <div className="text-center py-16 text-[var(--muted-foreground)]">
                    <p className="text-sm font-semibold">
                      {selectedConv.isBroadcast && !isAdmin
                        ? "Check back later for student announcements."
                        : "Start the conversation by typing below! 👋"}
                    </p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isOwn = msg.sender?._id === currentUser?._id;
                    return (
                      <div
                        key={msg._id || idx}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}
                      >
                        <div className="relative max-w-[70%]">
                          <div
                            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                              isOwn
                                ? "bg-[var(--primary)] text-white rounded-tr-sm"
                                : "bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] rounded-tl-sm"
                            }`}
                          >
                            {!isOwn && msg.sender?.isAdmin && (
                              <div className="flex items-center gap-1 text-[10px] font-extrabold text-amber-500 uppercase mb-1">
                                <Crown size={10} /> Medha Admin
                              </div>
                            )}
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <div
                              className={`text-[9px] font-bold mt-1.5 flex items-center gap-1.5 ${
                                isOwn ? "text-white/80 justify-end" : "text-[var(--muted-foreground)]"
                              }`}
                            >
                              {formatTime(msg.createdAt)}
                              {isOwn &&
                                (msg.readBy && msg.readBy.length > 1 ? (
                                  <CheckCheck size={11} className="text-emerald-300" />
                                ) : (
                                  <Check size={11} className="text-white/70" />
                                ))}
                            </div>
                          </div>

                          {/* Message deletion trigger (Admins only) */}
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteMessage(msg._id)}
                              disabled={deletingMessageId === msg._id}
                              className={`absolute -top-2 ${
                                isOwn ? "-left-8" : "-right-8"
                              } p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100 border border-red-500/10 cursor-pointer`}
                              title="Delete message"
                            >
                              {deletingMessageId === msg._id ? (
                                <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 size={12} />
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

              {/* Chat Input Field form */}
              {selectedConv.isBroadcast && !isAdmin ? (
                <div className="p-4 border-t border-[var(--border)] text-center bg-[var(--secondary)]/30 text-xs font-bold text-[var(--muted-foreground)] flex items-center justify-center gap-1.5">
                  <AlertCircle size={14} /> Announcements are read-only for students
                </div>
              ) : (
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-[var(--border)] flex gap-2 bg-[var(--card)]"
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message to student..."
                    className="flex-1 px-4 py-3 rounded-xl bg-[var(--secondary)]/30 border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)]"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="px-5 py-3 rounded-xl bg-[var(--primary)] text-white font-bold transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center cursor-pointer"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={15} />
                    )}
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[var(--muted-foreground)]">
              <div className="text-center p-8">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-base font-semibold">Select a conversation thread</p>
                <p className="text-xs mt-1">Start exchanging messages with classmates or administrators</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin Contacts Directory Drawer Modal */}
      <AnimatePresence>
        {showContactList && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowContactList(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md max-h-[75vh] rounded-2xl overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[var(--border)] bg-[var(--secondary)]/30 flex justify-between items-center">
                <h3 className="font-bold text-sm text-[var(--foreground)] uppercase tracking-wider">
                  Students Contact List
                </h3>
                <button
                  onClick={() => setShowContactList(false)}
                  className="p-1 rounded-lg hover:bg-[var(--secondary)] cursor-pointer"
                >
                  <X size={16} className="text-[var(--muted-foreground)]" />
                </button>
              </div>

              <div className="p-3 border-b border-[var(--border)] bg-[var(--card)]">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
                  />
                  <input
                    type="text"
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    placeholder="Search by student name or email..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--secondary)]/30 border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-[var(--border)]">
                {filteredContacts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[var(--muted-foreground)]">
                    No matching students found
                  </div>
                ) : (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact._id}
                      onClick={() => handleStartConversation(contact._id)}
                      className="p-3.5 flex items-center justify-between hover:bg-[var(--secondary)]/40 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-emerald-500 flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
                          {contact.avatar ? (
                            <img
                              src={contact.avatar}
                              alt="Avatar"
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            contact.name?.charAt(0) || <User size={14} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-[var(--foreground)]">{contact.name}</p>
                          <p className="text-[10px] text-[var(--muted-foreground)]">{contact.email}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-[var(--muted-foreground)]" />
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Announcements Broadcast modal drawer */}
      <AnimatePresence>
        {showBroadcast && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowBroadcast(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[var(--border)] bg-[var(--secondary)]/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Radio size={16} className="text-purple-500" />
                  <h3 className="font-bold text-sm text-[var(--foreground)] uppercase tracking-wider">
                    Broadcast Announcement
                  </h3>
                </div>
                <button
                  onClick={() => setShowBroadcast(false)}
                  className="p-1 rounded-lg hover:bg-[var(--secondary)] cursor-pointer"
                >
                  <X size={16} className="text-[var(--muted-foreground)]" />
                </button>
              </div>

              <div className="p-4">
                <p className="text-xs text-[var(--muted-foreground)] mb-4">
                  Note: This action broadcasts a notification message to the announcements channel of
                  every registered user on Medha.
                </p>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Type an announcement to broadcast..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--secondary)]/30 border border-[var(--border)] text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] resize-none"
                />
                <button
                  onClick={handleBroadcast}
                  disabled={!broadcastMessage.trim() || broadcastSending}
                  className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs disabled:opacity-50 transition hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {broadcastSending ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Broadcasting...
                    </>
                  ) : (
                    <>
                      <Radio size={14} /> Send Announcement
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
