import React, { useState, useEffect } from 'react';
import { RiSendPlaneFill, RiUserLine } from 'react-icons/ri';
import socketService from '../../services/socket';
import '../styles/MentorChat.css';

function MentorChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeThread, setActiveThread] = useState(null);
  const [threads, setThreads] = useState([
    { id: 1, title: 'React Hooks Discussion', participants: ['John', 'Sarah'] },
    { id: 2, title: 'State Management Patterns', participants: ['Mike', 'Emma'] },
  ]);

  useEffect(() => {
    // Listen for new messages
    socketService.socket?.on('newMessage', (message) => {
      if (message.threadId === activeThread?.id) {
        setMessages(prev => [...prev, message]);
      }
    });

    return () => {
      socketService.socket?.off('newMessage');
    };
  }, [activeThread]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeThread) return;

    const message = {
      id: Date.now(),
      threadId: activeThread.id,
      sender: 'Current Mentor', // Replace with actual mentor name
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    socketService.socket?.emit('sendMessage', message);
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="mentor-chat">
      <div className="chat-sidebar">
        <h3>Discussion Threads</h3>
        <div className="thread-list">
          {threads.map(thread => (
            <div
              key={thread.id}
              className={`thread-item ${activeThread?.id === thread.id ? 'active' : ''}`}
              onClick={() => setActiveThread(thread)}
            >
              <h4>{thread.title}</h4>
              <div className="thread-participants">
                {thread.participants.map(participant => (
                  <span key={participant} className="participant">
                    <RiUserLine /> {participant}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main">
        {activeThread ? (
          <>
            <div className="chat-header">
              <h3>{activeThread.title}</h3>
            </div>
            <div className="messages-container">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`message ${message.sender === 'Current Mentor' ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <p>{message.content}</p>
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <form className="message-input" onSubmit={sendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button type="submit">
                <RiSendPlaneFill />
              </button>
            </form>
          </>
        ) : (
          <div className="no-thread-selected">
            <p>Select a thread to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorChat;