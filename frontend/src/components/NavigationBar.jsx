import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  MonitorSpeaker,
  Target,
  Sparkles,
  Settings,
  LogOut,
  User,
  Leaf
} from 'lucide-react';
import './NavigationBar.css';

const navItems = [
  { path: '/',           label: 'Dashboard',    Icon: LayoutDashboard },
  { path: '/energy',     label: 'Energy',        Icon: Zap },
  { path: '/devices',    label: 'Devices',       Icon: MonitorSpeaker },
  { path: '/goals',      label: 'Goals',         Icon: Target },
  { path: '/suggestions',label: 'AI Insights',   Icon: Sparkles },
];

const bottomItems = [
  { path: '/settings', label: 'Settings', Icon: Settings },
];

function NavigationBar() {
  const location = useLocation();

  return (
    <aside className='nav-sidebar'>
      {/* Logo */}
      <div className='nav-logo'>
        <div className='nav-logo-icon'>
          <Leaf size={22} color='#00f5d4' />
        </div>
        <div className='nav-logo-text'>
          <span className='nav-logo-title'>EnergyEye</span>
          <span className='nav-logo-sub'>Smart Monitor</span>
        </div>
      </div>

      <div className='nav-divider' />

      {/* User Profile */}
      <div className='nav-user'>
        <div className='nav-user-avatar'>
          <User size={20} color='var(--accent-cyan)' />
        </div>
        <div className='nav-user-info'>
          <span className='nav-user-name'>Amit Kumar</span>
          <span className='nav-user-role'>Home Owner</span>
        </div>
        <div className='nav-user-status' title='Connected' />
      </div>

      <div className='nav-divider' />

      {/* Main Nav */}
      <nav className='nav-links'>
        <span className='nav-section-label'>MAIN MENU</span>
        {navItems.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className='nav-item-icon'>
              <Icon size={20} />
            </span>
            <span className='nav-item-label'>{label}</span>
            {location.pathname === path && <span className='nav-item-dot' />}
          </NavLink>
        ))}
      </nav>

      <div className='nav-spacer' />

      {/* Bottom Nav */}
      <div className='nav-bottom'>
        <div className='nav-divider' />
        {bottomItems.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className='nav-item-icon'><Icon size={20} /></span>
            <span className='nav-item-label'>{label}</span>
          </NavLink>
        ))}
        <button className='nav-item nav-logout'>
          <span className='nav-item-icon'><LogOut size={20} /></span>
          <span className='nav-item-label'>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default NavigationBar;