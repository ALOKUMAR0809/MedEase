import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useFetchUser from '../utils/useFetchUser';
import io from 'socket.io-client';
import { BASE_URL } from '../config'

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const { sessionId , status} = useParams();

  // Create a socket instance using useMemo to ensure a single instance.
  const socket = useMemo(() => io(BASE_URL, { transports: ['websocket', 'polling'] }), []);

  const { userDetails, fetchUser} = useFetchUser();

  const fetchChatMessages = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/chat/${sessionId}`);
      const data = await response.json();
      setMessages(data.chatMessages);
    } catch (error) {
      console.error(error);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchUser();
    // Add socket event listener and return a cleanup function
    const messageListener = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
    socket.on('message', messageListener);
    // Fetch initial chat messages
    fetchChatMessages();// Clean up the event listener when component unmounts
    return () => {
      socket.off('message', messageListener);  
    };
  }, [socket, fetchUser, fetchChatMessages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '') {
      try {
        await fetch(`${BASE_URL}/api/chat/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            sender: userDetails._id,
            message: inputMessage,
          }),
        });
        const newMessage = { sessionId, sender: userDetails._id, message: inputMessage };
        socket.emit('message', newMessage);
        // Fetch updated chat messages
        fetchChatMessages();
        // Clear input
        setInputMessage('');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header text-center">Chat Room</div>
        <div className="card-body chat-messages d-flex flex-column gap-3 p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {messages.map((message, index) => (
            <div key={index} className={`message-wrapper ${message.sender === userDetails._id ? 'user' : 'other'} d-flex`}>
              <div className={`message ${message.sender} p-2`}
                  style={{
                    borderRadius: '10px',
                    maxWidth: '75%',
                    marginLeft: message.sender === userDetails._id  ? 'auto' : '0',
                    marginRight: message.sender === userDetails._id ? '0' : 'auto',
                    backgroundColor:
                    message.sender === userDetails._id ? '#8CABFF' : '#FFC6AC',
                    color: '#333',
                  }}>{message.message}
              </div>
            </div>
          ))}
        </div>
        <div className="card-footer input-container">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Type your message..." value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}/>
            <button className="btn btn-primary send-button" onClick={handleSendMessage} disabled={status==="Completed"}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
