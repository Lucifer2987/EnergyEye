import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import NavigationBar from './components/NavigationBar.jsx';
import App from './App.jsx';
// import AiRecommendations from './components/AiRecommendations.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavigationBar />
    <App />
    {/* <AiRecommendations /> */}
  </StrictMode>,
)
