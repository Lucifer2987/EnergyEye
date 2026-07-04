import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AppProvider, AppContext } from './context/AppContext.jsx';
import NavigationBar from './components/NavigationBar.jsx';
import Chatbot from './components/Chatbot.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Energy from './pages/Energy.jsx';
import Devices from './pages/Devices.jsx';
import Goals from './pages/Goals.jsx';
import AISuggestions from './pages/AISuggestions.jsx';
import Settings from './pages/Settings.jsx';
import { useContext } from 'react';

/* ── Toast renderer ────────────────────────────── */
function Toasts() {
  const { state, dispatch } = useContext(AppContext);
  const icons = { success: '✓', error: '✕', info: 'ℹ', warn: '⚠' };
  return (
    <div className='toast-container'>
      {state.toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type || 'success'}`}>
          <span>{icons[t.type] || '✓'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

function AppLayout() {
  return (
    <BrowserRouter>
      <div className='app-layout'>
        <NavigationBar />
        <main className='main-content'>
          <Routes>
            <Route path='/'            element={<Dashboard />} />
            <Route path='/energy'      element={<Energy />} />
            <Route path='/devices'     element={<Devices />} />
            <Route path='/goals'       element={<Goals />} />
            <Route path='/suggestions' element={<AISuggestions />} />
            <Route path='/settings'    element={<Settings />} />
          </Routes>
        </main>
        <Chatbot />
        <Toasts />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}

export default App;
