"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Search, ChevronDown, ChevronUp, Reply, Send, X } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface ReplyRecord {
  id: string;
  bookingId?: string;
  contactId?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Reply modal state
  const [replyTarget, setReplyTarget] = useState<Contact | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [replyError, setReplyError] = useState("");

  // Reply history state
  const [replyHistory, setReplyHistory] = useState<Record<string, ReplyRecord[]>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});

  useEffect(() => { fetchContacts(); }, []);

  async function fetchReplies(contactId: string) {
    if (replyHistory[contactId] !== undefined) return;
    setLoadingReplies((prev) => ({ ...prev, [contactId]: true }));
    try {
      const res = await fetch(`/api/admin/bookings/reply?contactId=${contactId}`);
      if (res.ok) {
        const replies = await res.json();
        setReplyHistory((prev) => ({ ...prev, [contactId]: replies }));
      }
    } catch {}
    setLoadingReplies((prev) => ({ ...prev, [contactId]: false }));
  }

  async function fetchContacts() {
    try {
      const res = await fetch("/api/admin/contacts");
      setContacts(await res.json());
    } catch {}
    setLoading(false);
  }

  async function deleteContact(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch("/api/admin/contacts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  function openReply(contact: Contact) {
    setReplyTarget(contact);
    setReplySubject(`Re: Your message to ASRONIXTECH`);
    setReplyMessage("");
    setReplySuccess(false);
    setReplyError("");
  }

  async function handleSendReply() {
    if (!replyTarget || !replySubject.trim() || !replyMessage.trim()) return;
    setSending(true);
    setReplyError("");
    try {
      const res = await fetch("/api/admin/contacts/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: replyTarget.id,
          name: replyTarget.name,
          email: replyTarget.email,
          subject: replySubject,
          message: replyMessage,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReplySuccess(true);
      // Refresh reply history for this contact
      const repliesRes = await fetch(`/api/admin/bookings/reply?contactId=${replyTarget.id}`);
      if (repliesRes.ok) {
        const replies = await repliesRes.json();
        setReplyHistory((prev) => ({ ...prev, [replyTarget.id!]: replies }));
      }
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSending(false);
    }
  }

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-sm text-gray-500">{contacts.length} total messages</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white text-sm"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">
          {contacts.length === 0 ? "No messages yet." : "No messages match your search."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((contact, i) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => {
                  const newId = expanded === contact.id ? null : contact.id;
                  setExpanded(newId);
                  if (newId) fetchReplies(newId);
                }}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{contact.name}</p>
                    <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); openReply(contact); }}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors relative"
                    title="Send reply"
                  >
                    <Reply className="w-4 h-4" />
                    {replyHistory[contact.id] && replyHistory[contact.id].length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {replyHistory[contact.id].length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteContact(contact.id); }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {expanded === contact.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>
              {expanded === contact.id && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="pt-4">
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider">Name</label>
                        <p className="text-sm text-gray-900 mt-0.5">{contact.name}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider">Email</label>
                        <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 mt-0.5 block hover:underline">{contact.email}</a>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Message</label>
                      <p className="text-sm text-gray-900 mt-0.5 whitespace-pre-wrap bg-gray-50 rounded-xl p-4">{contact.message}</p>
                    </div>

                    {/* Reply History */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <Reply className="w-4 h-4 text-blue-500" />
                          Reply History
                        </h3>
                        {replyHistory[contact.id] && (
                          <span className="text-xs text-gray-400">
                            {replyHistory[contact.id].length} {replyHistory[contact.id].length === 1 ? "reply" : "replies"}
                          </span>
                        )}
                      </div>
                      {loadingReplies[contact.id] ? (
                        <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                          <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                          Loading replies...
                        </div>
                      ) : replyHistory[contact.id] && replyHistory[contact.id].length > 0 ? (
                        <div className="space-y-3">
                          {replyHistory[contact.id].map((reply) => (
                            <div
                              key={reply.id}
                              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Send className="w-3.5 h-3.5 text-blue-500" />
                                  <span className="text-sm font-medium text-gray-900">{reply.subject}</span>
                                </div>
                                <span className="text-xs text-gray-400">
                                  {new Date(reply.createdAt).toLocaleDateString()} {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No replies sent yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {replyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !sending && setReplyTarget(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Send Reply</h2>
                  <p className="text-sm text-white/70">To: {replyTarget.name} &lt;{replyTarget.email}&gt;</p>
                </div>
              </div>
              <button
                onClick={() => !sending && setReplyTarget(null)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {replySuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Reply Sent!</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Your reply has been sent to {replyTarget.email}
                  </p>
                  <button
                    onClick={() => setReplyTarget(null)}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {replyError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      {replyError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                    <input
                      type="text"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white text-sm"
                      placeholder="Reply subject..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white text-sm resize-none"
                      placeholder="Type your reply here..."
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setReplyTarget(null)}
                      disabled={sending}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendReply}
                      disabled={sending || !replySubject.trim() || !replyMessage.trim()}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {sending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
