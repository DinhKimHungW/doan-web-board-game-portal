import React, { useState, useEffect, useRef } from 'react'
import { conversationsApi } from '../../services/conversations.api'
import { friendsApi } from '../../services/friends.api'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../../components/common/Avatar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeConvId, setActiveConvId] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [friends, setFriends] = useState([])
  const [showNewConv, setShowNewConv] = useState(false)
  const messagesEndRef = useRef(null)

  const loadConversations = async () => {
    try {
      const data = await conversationsApi.list()
      setConversations(Array.isArray(data) ? data : data?.items || [])
    } catch { setConversations([]) }
  }

  const loadMessages = async (convId) => {
    setLoadingMessages(true)
    try {
      const data = await conversationsApi.getMessages(convId, { limit: 50 })
      const msgs = Array.isArray(data) ? data : data?.items || []
      setMessages(msgs)
    } catch { setMessages([]) }
    setLoadingMessages(false)
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([
      loadConversations(),
      friendsApi.list().then(data => setFriends(Array.isArray(data) ? data : data?.items || [])).catch(() => {})
    ]).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (activeConvId) loadMessages(activeConvId)
  }, [activeConvId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Poll every 10s for new messages
  useEffect(() => {
    if (!activeConvId) return
    const interval = setInterval(() => loadMessages(activeConvId), 10000)
    return () => clearInterval(interval)
  }, [activeConvId])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConvId) return
    setSending(true)
    try {
      const msg = await conversationsApi.sendMessage(activeConvId, newMessage.trim())
      setMessages(prev => [...prev, msg])
      setNewMessage('')
    } catch { /* ignore */ }
    setSending(false)
  }

  const handleStartConversation = async (friendUserId) => {
    try {
      const conv = await conversationsApi.getOrCreate(friendUserId)
      await loadConversations()
      setActiveConvId(conv.id)
      setShowNewConv(false)
    } catch { /* ignore */ }
  }

  const getOtherParticipant = (conv) => {
    const participants = conv.participants || []
    return participants.find(p => p.user_id !== user?.id || p.id !== user?.id)
  }

  const getConvTitle = (conv) => {
    if (conv.other_user) return conv.other_user.name
    const other = getOtherParticipant(conv)
    return other?.user?.name || other?.name || 'Conversation'
  }

  const activeConv = conversations.find(c => c.id === activeConvId)

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-72 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 dark:text-white">Messages</h2>
          <button
            onClick={() => setShowNewConv(!showNewConv)}
            className="btn btn-primary text-xs py-1.5 px-3"
          >
            + New
          </button>
        </div>

        {showNewConv && (
          <div className="p-3 border-b border-gray-200 dark:border-slate-700">
            <p className="text-xs text-gray-500 mb-2">Start conversation with a friend:</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {friends.map(f => {
                const friend = f.friend || f
                return (
                  <button
                    key={f.id}
                    onClick={() => handleStartConversation(friend.id || f.friend_id)}
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Avatar name={friend.name} src={friend.avatar_url} size="sm" />
                    <span className="text-sm text-gray-900 dark:text-white">{friend.name}</span>
                  </button>
                )
              })}
              {friends.length === 0 && <p className="text-xs text-gray-400">No friends yet</p>}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-8"><LoadingSpinner /></div>
        ) : conversations.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">No conversations yet</div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-left ${
                  activeConvId === conv.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                }`}
              >
                <Avatar name={getConvTitle(conv)} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{getConvTitle(conv)}</p>
                  {conv.last_message && (
                    <p className="text-xs text-gray-500 truncate">{conv.last_message}</p>
                  )}
                </div>
                {conv.unread_count > 0 && (
                  <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {conv.unread_count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-slate-900">
        {!activeConvId ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState icon="💬" title="Select a conversation" description="Choose a conversation from the sidebar or start a new one" />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center gap-3">
              <Avatar name={getConvTitle(activeConv || {})} size="md" />
              <span className="font-medium text-gray-900 dark:text-white">{getConvTitle(activeConv || {})}</span>
              <button
                onClick={() => loadMessages(activeConvId)}
                className="ml-auto text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Refresh
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMessages ? (
                <div className="flex justify-center py-8"><LoadingSpinner /></div>
              ) : messages.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">No messages yet. Say hello!</p>
              ) : (
                messages.map(msg => {
                  const isMe = msg.sender_id === user?.id
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                        isMe
                          ? 'bg-primary-500 text-white rounded-br-sm'
                          : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-bl-sm shadow-sm'
                      }`}>
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-primary-200' : 'text-gray-400'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                className="input flex-1"
                placeholder="Type a message..."
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="btn btn-primary px-6 disabled:opacity-50"
              >
                {sending ? '...' : 'Send'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
