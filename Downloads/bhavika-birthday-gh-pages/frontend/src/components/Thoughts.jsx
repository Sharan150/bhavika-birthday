import React, { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, set, onDisconnect, serverTimestamp, update } from 'firebase/database';
import { db } from '../firebase';
import './Thoughts.css';

// ----------------------------------------------------
// Memoized ChatInput subcomponent to fix input typing lag
// ----------------------------------------------------
const ChatInput = React.memo(({ onSendMessage }) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);

  const emojis = [
    '🌸', '💖', '✨', '🎂', '🍰', 
    '🥰', '🥺', '😂', '😍', '😭', 
    '👍', '🎉', '🎈', '🎁', '❤️', '💕'
  ];

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText('');
    setShowEmojiPicker(false);
    
    // Focus back on textarea after sending
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emoji) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = text.substring(0, start) + emoji + text.substring(end);
    setText(newText);
    
    // Reset selection and keep focus on input
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  return (
    <div className="chat-input-bar">
      <button 
        type="button" 
        className="emoji-trigger-btn"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        title="Choose emoji"
      >
        😊
      </button>
      
      {showEmojiPicker && (
        <div className="emoji-picker-drawer">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="emoji-btn"
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <textarea
        ref={textareaRef}
        className="chat-textarea"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
      />
      
      <button 
        type="button" 
        className="chat-send-btn"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
});

// ----------------------------------------------------
// Main Thoughts Chat Component
// ----------------------------------------------------
const Thoughts = () => {
  const [thoughts, setThoughts] = useState([]);
  const [currentUser, setCurrentUser] = useState('Sharan');
  const [partnerPresence, setPartnerPresence] = useState({ status: 'offline', lastChanged: Date.now() });
  
  // Track message editing
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  
  const partner = currentUser === 'Sharan' ? 'Bhavika' : 'Sharan';
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Establish current user's presence state in Firebase RTDB
  useEffect(() => {
    if (!currentUser) return;
    
    const connectedRef = ref(db, '.info/connected');
    const myPresenceRef = ref(db, `presence/${currentUser}`);
    
    const unsubscribeConnected = onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === true) {
        // We are online. Setup presence.
        set(myPresenceRef, {
          status: 'online',
          lastChanged: serverTimestamp()
        });
        
        // Setup disconnection cleanup
        onDisconnect(myPresenceRef).set({
          status: 'offline',
          lastChanged: serverTimestamp()
        });
      }
    });

    return () => {
      unsubscribeConnected();
      // Set to offline when switching user profiles
      set(myPresenceRef, {
        status: 'offline',
        lastChanged: serverTimestamp()
      });
    };
  }, [currentUser]);

  // 2. Listen to partner's presence
  useEffect(() => {
    const partnerPresenceRef = ref(db, `presence/${partner}`);
    const unsubscribePartner = onValue(partnerPresenceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPartnerPresence(data);
      } else {
        setPartnerPresence({ status: 'offline', lastChanged: Date.now() });
      }
    });
    return () => unsubscribePartner();
  }, [partner]);

  // 3. Load chat messages in real time (chronological order)
  useEffect(() => {
    const thoughtsRef = ref(db, 'thoughts');
    
    const unsubscribe = onValue(thoughtsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        
        // Convert object to array, attach id, filter > 30 days, sort ascending (oldest first)
        const thoughtsArray = Object.entries(data)
          .map(([id, val]) => ({ id, ...val }))
          .filter(t => (now - t.timestamp) <= THIRTY_DAYS_MS)
          .sort((a, b) => a.timestamp - b.timestamp);
          
        setThoughts(thoughtsArray);
      } else {
        setThoughts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // 4. Trigger auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [thoughts]);

  // 5. Update Read Receipts (Seen status) for received messages
  useEffect(() => {
    if (!currentUser || thoughts.length === 0) return;

    // Filter messages that were written by the partner and are not marked seen
    const unreadMessages = thoughts.filter(
      (m) => m.author === partner && !m.isSeen
    );

    if (unreadMessages.length > 0) {
      unreadMessages.forEach((msg) => {
        update(ref(db, `thoughts/${msg.id}`), { isSeen: true }).catch((err) => {
          console.error("Error updating seen state: ", err);
        });
      });
    }
  }, [thoughts, currentUser, partner]);

  // 6. Handle sending message
  const handleSendMessage = (text) => {
    const thoughtsRef = ref(db, 'thoughts');
    push(thoughtsRef, {
      text: text,
      author: currentUser,
      timestamp: Date.now(),
      isSeen: false,
      isEdited: false
    }).catch((error) => {
      console.error("Error posting message: ", error);
      alert("Failed to send message.");
    });
  };

  // 7. Handle editing message
  const handleStartEdit = (msg) => {
    setEditingId(msg.id);
    setEditText(msg.text);
  };

  const handleSaveEdit = (id) => {
    if (!editText.trim()) return;
    update(ref(db, `thoughts/${id}`), {
      text: editText.trim(),
      isEdited: true
    }).then(() => {
      setEditingId(null);
      setEditText('');
    }).catch((err) => {
      console.error("Error editing message: ", err);
      alert("Failed to update message.");
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // 8. Format Last Seen helper
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Offline';
    const date = new Date(timestamp);
    const now = new Date();
    
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Check if same day
    if (date.toDateString() === now.toDateString()) {
      return `Last seen today at ${timeStr}`;
    }
    
    const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return `Last seen on ${dateStr} at ${timeStr}`;
  };

  const toggleUser = () => {
    setCurrentUser(currentUser === 'Sharan' ? 'Bhavika' : 'Sharan');
  };

  return (
    <div className="thoughts-section">
      {/* Header showing partner details and presence */}
      <div className="chat-header">
        <div className="chat-partner-info">
          <h2 className="chat-partner-name">{partner}</h2>
          <div className="chat-partner-status">
            {partnerPresence.status === 'online' ? (
              <>
                <span className="status-dot"></span>
                <span>Online</span>
              </>
            ) : (
              <>
                <span className="status-dot offline"></span>
                <span>{formatLastSeen(partnerPresence.lastChanged)}</span>
              </>
            )}
          </div>
        </div>
        
        {/* Swapper so the user can simulate either user role */}
        <div className="profile-switcher">
          <span>Chatting as: <strong>{currentUser}</strong></span>
          <button className="switch-btn" onClick={toggleUser}>
            Switch
          </button>
        </div>
      </div>

      {/* Messages Scrollable Container */}
      <div className="chat-messages-container">
        {thoughts.map((msg) => {
          const isSentByMe = msg.author === currentUser;
          const isEditing = editingId === msg.id;

          return (
            <div 
              key={msg.id} 
              className={`message-wrapper ${isSentByMe ? 'sent' : 'received'}`}
            >
              {/* If sent by me, enable Hover Edit option */}
              {isSentByMe && !isEditing && (
                <button 
                  className="bubble-action-trigger" 
                  onClick={() => handleStartEdit(msg)}
                  title="Edit message"
                >
                  ✏️
                </button>
              )}

              <div className="message-bubble">
                {isEditing ? (
                  <div className="edit-message-input-container">
                    <textarea
                      className="edit-message-textarea"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={2}
                    />
                    <div className="edit-actions">
                      <button 
                        className="edit-action-btn cancel" 
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button 
                        className="edit-action-btn save" 
                        onClick={() => handleSaveEdit(msg.id)}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  msg.text
                )}
              </div>

              {/* Message Meta: Timestamp, (edited) flag, and Seen receipt */}
              <div className="message-meta">
                {msg.isEdited && <span className="edited-tag">(edited)</span>}
                <span>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                
                {/* Seen receipt shown only for sent messages */}
                {isSentByMe && (
                  <span className="seen-receipt">
                    {msg.isSeen ? '✓✓ Seen' : '✓ Sent'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Area */}
      <div className="chat-input-container">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Thoughts;
