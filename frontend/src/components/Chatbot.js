import React, { useState, useRef, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';
import { BsChatDots, BsRobot } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import cbitData from '../data/cbitData.json';
import api from '../services/api';
import './Chatbot.css';

// API endpoints and keys should be in environment variables
const HF_API_URL = process.env.REACT_APP_HF_API_URL || 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta';
const HF_API_KEY = process.env.REACT_APP_HF_API_KEY;

// Add this mapping at the top of your file
const abbreviationMap = {
  cosc: "open source club",
  samskruthi: "Chaitanya Samskruthi",
  ieee: "IEEE Student Branch",
  ecell: "Entrepreneurship Cell",
  ace: "Association of Computer Engineers",
  asme: "ASME Student Chapter",
  sae: "SAE CBIT",
  iste: "ISTE Student Chapter",
  csi: "CSI Student Branch",
};

function expandAbbreviations(question) {
  let q = question.toLowerCase();
  for (const [abbr, full] of Object.entries(abbreviationMap)) {
    if (q.includes(abbr)) {
      q = q.replace(new RegExp(`\\b${abbr}\\b`, 'g'), full.toLowerCase());
    }
  }
  return q;
}

function getRelevantContext(question) {
  let q = expandAbbreviations(question);
  let best = { text: '', score: 0 };
  for (const page of Array.isArray(cbitData) ? cbitData : []) {
    let score = 0;
    // Score for each word in the question
    for (const word of q.split(' ')) {
      if (page.text && page.text.toLowerCase().includes(word)) score++;
      if (page.name && page.name.toLowerCase().includes(word)) score += 2;
    }
    // Score for full question substring
    if (page.text && page.text.toLowerCase().includes(q)) score += 2;
    if (page.name && page.name.toLowerCase().includes(q)) score += 3;
    if (score > best.score) best = { text: page.text, score };
  }
  return best.text || '';
}

async function askGenAI(question, context = '') {
  try {
    console.log('Sending request to chatbot endpoint...');
    
    // Prepare the message with context if available
    const fullMessage = context 
      ? `Context: ${context}\n\nQuestion: ${question}`
      : question;

    const response = await api.post('/chatbot/chat', {
      message: fullMessage
    }, {
      timeout: 90000 // 90 seconds timeout
    });

    console.log('Received response:', response);

    if (!response.data || !response.data.response) {
      console.error('Invalid response format:', response);
      throw new Error('Invalid response from AI service');
    }

    return response.data.response;
  } catch (error) {
    console.error('AI response error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    
    // Handle specific error cases
    if (error.response?.status === 503) {
      throw new Error('AI service is currently unavailable. Please try again later.');
    } else if (error.response?.status === 504) {
      throw new Error('The AI service took too long to respond. Please try again.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.request) {
      throw new Error('Unable to connect to the AI service. Please check your internet connection.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your CBIT Assistant.\nHow can I help you today?\nI can search the internet for recent information about CBIT!",
      type: "bot",
      options: [
        {
          text: "Tell me about CBIT",
          action: "about"
        },
        {
          text: "List departments",
          action: "departments"
        },
        {
          text: "Show facilities",
          action: "facilities"
        },
        {
          text: "Contact information",
          action: "contact"
        },
        {
          text: "Latest news about CBIT",
          action: "news"
        }
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (text, type, options = null) => {
    setMessages(prev => [...prev, { text, type, options }]);
  };

  const simulateTyping = async (message, delay = 1000) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsLoading(false);
    addMessage(message, 'bot');
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    addMessage(userMessage, 'user');
    setInputText('');

    try {
      setIsLoading(true);
      const context = getRelevantContext(userMessage);
      const response = await askGenAI(userMessage, context);
      setRetryCount(0); // Reset retry count on success
      await simulateTyping(response);
    } catch (error) {
      setRetryCount(prev => prev + 1);
      const retryMessage = retryCount < 3 
        ? `${error.message} Would you like to try again?`
        : "I'm having trouble connecting to the AI service. Please try again later.";
      
      addMessage(retryMessage, 'bot', [
        { text: "Try Again", action: "retry" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = async (option) => {
    if (option.action === 'retry') {
      setInputText(messages[messages.length - 2].text);
      handleSend();
      return;
    }

    if (option.action === 'navigate' && option.path) {
      navigate(option.path);
      setIsOpen(false);
      return;
    }

    setInputText(option.text);
    handleSend();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(true)}
        className={`chat-bubble-button${isOpen ? ' hide' : ' show'}`}
        aria-label="Open chat"
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <BsChatDots size={28} />
      </button>

      <div className={`chat-container${isOpen ? ' open' : ' closed'}`}>
        <div className="chat-header">
          <div className="title-section">
            <BsRobot size={28} />
            <h3>Event Assistant</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="close-button"
            aria-label="Close chat"
          >
            <RxCross2 size={24} />
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-wrapper ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-avatar">
                {message.type === 'user' ? <FaUser /> : <BsRobot />}
              </div>
              <div className="message-content">
                <div className={`message-bubble ${message.type === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                  {message.text}
                </div>
                {message.options && (
                  <div className="message-options">
                    {message.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(option)}
                        className="option-button"
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {(isLoading) && (
            <div className="message-wrapper bot-message">
              <div className="message-avatar">
                <BsRobot />
              </div>
              <div className="message-content">
                <div className="message-bubble bot-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="chat-input"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className="send-button"
              disabled={isLoading || !inputText.trim()}
              aria-label="Send message"
            >
              <IoMdSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot; 