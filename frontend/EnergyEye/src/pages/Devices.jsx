import { useState } from 'react';
import DeviceCard from '../components/DeviceCard.jsx';
import { Search, Filter } from 'lucide-react';
import '../assets/styles/shared.css';

const ALL_DEVICES = [
  { deviceName: 'Air Conditioner', roomName: 'Living Room', energyConsumed: 4.2, wattage: 1500, isConnected: true,  room: 'Living Room' },
  { deviceName: 'Television',      roomName: 'Living Room', energyConsumed: 1.1, wattage: 120,  isConnected: true,  room: 'Living Room' },
  { deviceName: 'Water Heater',    roomName: 'Bathroom',    energyConsumed: 2.8, wattage: 2000, isConnected: true,  room: 'Bathroom'    },
  { deviceName: 'Refrigerator',    roomName: 'Kitchen',     energyConsumed: 1.9, wattage: 150,  isConnected: true,  room: 'Kitchen'     },
  { deviceName: 'Microwave',       roomName: 'Kitchen',     energyConsumed: 0.4, wattage: 1200, isConnected: true,  room: 'Kitchen'     },
  { deviceName: 'Dishwasher',      roomName: 'Kitchen',     energyConsumed: 0.8, wattage: 1800, isConnected: false, room: 'Kitchen'     },
  { deviceName: 'Washing Machine', roomName: 'Utility Room',energyConsumed: 1.5, wattage: 500,  isConnected: true,  room: 'Utility Room'},
  { deviceName: 'Lighting',        roomName: 'Bedroom',     energyConsumed: 0.3, wattage: 40,   isConnected: true,  room: 'Bedroom'     },
  { deviceName: 'Air Conditioner', roomName: 'Bedroom',     energyConsumed: 2.1, wattage: 1200, isConnected: true,  room: 'Bedroom'     },
  { deviceName: 'Television',      roomName: 'Bedroom',     energyConsumed: 0.6, wattage: 80,   isConnected: false, room: 'Bedroom'     },
  { deviceName: 'Lighting',        roomName: 'Study',       energyConsumed: 0.2, wattage: 25,   isConnected: true,  room: 'Study'       },
  { deviceName: 'Lighting',        roomName: 'Living Room', energyConsumed: 0.5, wattage: 60,   isConnected: true,  room: 'Living Room' },
];

const ROOMS = ['All', 'Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Study', 'Utility Room'];

function Devices() {
  const [activeRoom, setActiveRoom] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = ALL_DEVICES.filter(d => {
    const matchRoom = activeRoom === 'All' || d.room === activeRoom;
    const matchSearch = d.deviceName.toLowerCase().includes(search.toLowerCase()) ||
                        d.roomName.toLowerCase().includes(search.toLowerCase());
    return matchRoom && matchSearch;
  });

  const connected = ALL_DEVICES.filter(d => d.isConnected).length;

  return (
    <div className='page-container'>
      <div className='page-header'>
        <div>
          <h1 className='page-title'>Devices</h1>
          <p className='page-subtitle'>{connected} of {ALL_DEVICES.length} devices connected & monitored</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-pill)', padding: '8px 16px',
          }}>
            <Search size={15} color='var(--text-muted)' />
            <input
              type='text' placeholder='Search devices...'
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                background: 'none', border: 'none', outline: 'none',
                color: 'var(--text-primary)', fontSize: 13, width: 160,
              }}
            />
          </div>
        </div>
      </div>

      {/* Room filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--space-xl)' }}>
        {ROOMS.map(r => (
          <button
            key={r}
            onClick={() => setActiveRoom(r)}
            style={{
              padding: '7px 16px',
              borderRadius: 'var(--radius-pill)',
              border: `1px solid ${activeRoom === r ? 'rgba(79,110,247,0.5)' : 'var(--border)'}`,
              background: activeRoom === r ? 'rgba(79,110,247,0.2)' : 'var(--bg-card)',
              color: activeRoom === r ? 'var(--accent-blue)' : 'var(--text-muted)',
              fontSize: 13, fontWeight: activeRoom === r ? 600 : 400,
              transition: 'var(--transition-fast)', cursor: 'pointer',
            }}
          >{r}</button>
        ))}
      </div>

      {/* Devices grid */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-lg)' }}>
          {filtered.map((d, i) => <DeviceCard key={i} {...d} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <Filter size={48} strokeWidth={1} style={{ marginBottom: 16, opacity: 0.4 }} />
          <p style={{ fontSize: 16 }}>No devices found</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your filter or search</p>
        </div>
      )}
    </div>
  );
}

export default Devices;
