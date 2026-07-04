import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import NavigationBar from './components/NavigationBar.jsx';
import Chatbot from './components/Chatbot.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Energy from './pages/Energy.jsx';
import Devices from './pages/Devices.jsx';
import Goals from './pages/Goals.jsx';
import AISuggestions from './pages/AISuggestions.jsx';
import Settings from './pages/Settings.jsx';

function App() {
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
      </div>
    </BrowserRouter>
  );
}

export default App;
