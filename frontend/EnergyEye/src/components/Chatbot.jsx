import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Zap } from 'lucide-react';
import './Chatbot.css';

const QUICK_REPLIES = [
  'How can I save energy?',
  'Which device uses most power?',
  "Show today's usage",
  'Set an energy goal',
];

const BOT_RESPONSES = {
  'how can i save energy': 'Great question! Here are my top tips:\n1. 🌡️ Set AC to 24°C — saves up to 20%\n2. 💡 Switch to LED bulbs\n3. 🕐 Use appliances off-peak (10PM–6AM)\n4. 🔌 Unplug idle devices',
  'which device uses most power': '🔍 Based on today\'s data:\n1. Air Conditioner — 4.2 kWh (38%)\n2. Water Heater — 2.8 kWh (25%)\n3. Washing Machine — 1.5 kWh (14%)\n\nConsider optimizing your AC schedule!',
  "show today's usage": '📊 Today\'s energy summary:\n• Total consumed: 11.2 kWh\n• Cost estimate: ₹78.40\n• CO₂ emitted: 5.6 kg\n• Peak hour: 7PM–9PM\n\nYou\'re 8% below yesterday! 🎉',
  'set an energy goal': 'I can help you set a goal! Navigate to the Goals page to configure your monthly energy budget, CO₂ target, and daily limits. 🎯',
};

const getResponse = (input) => {
  const key = Object.keys(BOT_RESPONSES).find(k => input.toLowerCase().includes(k.split(' ')[0]));
  return key
    ? BOT_RESPONSES[key]
    : "I'm analyzing your energy patterns... 🤔\n\nFor detailed insights, check the AI Insights page. I can help with energy tips, device info, and usage summaries!";
};

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '👋 Hi! I\'m your EnergyEye AI assistant. Ask me anything about your energy usage!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: getResponse(msg) }]);
    }, 900 + Math.random() * 600);
  };

  return (
    <>
      {/* Floating button */}
      <button
        className={`chatbot-fab ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label='Toggle AI Chat'
      >
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
        {!isOpen && <span className='chatbot-fab__badge'>AI</span>}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className='chatbot-panel'>
          {/* Header */}
          <div className='chatbot-header'>
            <div className='chatbot-header__avatar'>
              <Bot size={18} color='var(--accent-cyan)' />
            </div>
            <div>
              <p className='chatbot-header__name'>EnergyEye AI</p>
              <p className='chatbot-header__status'><span className='dot' />Online</p>
            </div>
            <button className='chatbot-header__close' onClick={() => setIsOpen(false)}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className='chatbot-messages'>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role}`}>
                {msg.role === 'bot' && (
                  <span className='chat-bubble__icon'><Zap size={12} /></span>
                )}
                <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
              </div>
            ))}
            {isTyping && (
              <div className='chat-bubble bot'>
                <span className='chat-bubble__icon'><Zap size={12} /></span>
                <div className='typing-indicator'>
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div className='chatbot-quick'>
            {QUICK_REPLIES.map((q, i) => (
              <button key={i} className='quick-reply' onClick={() => sendMessage(q)}>{q}</button>
            ))}
          </div>

          {/* Input */}
          <div className='chatbot-input-row'>
            <input
              type='text'
              className='chatbot-input'
              placeholder='Ask about your energy...'
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              className='chatbot-send'
              onClick={() => sendMessage()}
              disabled={!input.trim()}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
