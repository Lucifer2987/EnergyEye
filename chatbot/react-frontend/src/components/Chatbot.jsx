import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [chatLog, setChatLog] = useState([]);

  const getResponse = (question) => {
    fetch('http://localhost:5000/get_response', {
      mode: 'no-cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question })
    })
    .then(response => response.json())
    .then(data => {
      setChatLog([
        ...chatLog,
        { sender: 'user', message: `You: ${question}` },
        { sender: 'bot', message: `Bot: ${data.response}` }
      ]);
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <div className="chatbot-container">
      <h1>Electricity Consumption ChatBot</h1>
      <div className="question-buttons">
        <button onClick={() => getResponse('Why is my electricity bill high? 🤔')}>Why is my electricity bill high? 🤔</button>
        <button onClick={() => getResponse('How can I reduce my electricity consumption? 🌱')}>How can I reduce my electricity consumption? 🌱</button>
        <button onClick={() => getResponse('What are the most power-consuming appliances? 🔌')}>What are the most power-consuming appliances? 🔌</button>
        <button onClick={() => getResponse('Tips for saving electricity? 💡')}>Tips for saving electricity? 💡</button>
        <button onClick={() => getResponse('How does my current usage compare to previous months?')}>How does my current usage compare to previous months?</button>
        <button onClick={() => getResponse('Which appliances or activities are using the most electricity?')}>Which appliances or activities are using the most electricity?</button>
        <button onClick={() => getResponse('Are there any peak usage times, and why?')}>Are there any peak usage times, and why?</button>
      </div>
      <div className="chat-log">
        {chatLog.map((log, index) => (
          <p key={index} className={log.sender}>
            {log.message}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Chatbot;