import { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import DeviceCard from '../components/DeviceCard.jsx';
import Modal from '../components/Modal.jsx';
import { useApp } from '../context/AppContext.jsx';
import '../assets/styles/shared.css';
import '../components/Modal.css';

const ROOMS   = ['All', 'Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Study', 'Utility Room'];
const D_NAMES = ['Air Conditioner', 'Television', 'Water Heater', 'Refrigerator', 'Microwave',
                 'Dishwasher', 'Washing Machine', 'Lighting', 'Fan', 'Speaker', 'Router', 'Other'];

const EMPTY = { deviceName: 'Air Conditioner', roomName: 'Living Room', room: 'Living Room', wattage: '', energyConsumed: 0 };

function Devices() {
  const { state, dispatch, addToast } = useApp();
  const [activeRoom, setActiveRoom] = useState('All');
  const [search,     setSearch]     = useState('');
  const [addOpen,    setAddOpen]     = useState(false);
  const [form,       setForm]        = useState(EMPTY);
  const [errors,     setErrors]      = useState({});

  const filtered = state.devices.filter(d => {
    const matchRoom   = activeRoom === 'All' || d.room === activeRoom;
    const matchSearch = d.deviceName.toLowerCase().includes(search.toLowerCase()) ||
                        d.roomName.toLowerCase().includes(search.toLowerCase());
    return matchRoom && matchSearch;
  });

  const connected = state.devices.filter(d => d.isConnected).length;
  const onCount   = state.devices.filter(d => d.isOn).length;

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.deviceName) e.deviceName = 'Required';
    if (!form.roomName)   e.roomName   = 'Required';
    if (!form.wattage || isNaN(form.wattage) || +form.wattage <= 0)
      e.wattage = 'Enter a valid wattage';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    dispatch({
      type: 'ADD_DEVICE',
      device: { ...form, room: form.roomName, wattage: +form.wattage, energyConsumed: 0 },
    });
    addToast(`${form.deviceName} added to ${form.roomName}`, 'success');
    setAddOpen(false);
    setForm(EMPTY);
  };

  return (
    <div className='page-container'>
      {/* Header */}
      <div className='page-header'>
        <div>
          <h1 className='page-title'>Devices</h1>
          <p className='page-subtitle'>
            {connected} connected · {onCount} active · {state.devices.length} total
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-pill)', padding: '8px 16px',
          }}>
            <Search size={15} color='var(--text-muted)' />
            <input
              type='text' placeholder='Search devices...'
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, width: 160 }}
            />
          </div>
          {/* Add Device */}
          <button
            onClick={() => { setForm(EMPTY); setErrors({}); setAddOpen(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg,#4f6ef7,#00f5d4)', border: 'none',
              borderRadius: 'var(--radius-pill)', color: '#000',
              fontWeight: 600, fontSize: 13, padding: '10px 20px',
              cursor: 'pointer', boxShadow: '0 0 20px rgba(79,110,247,0.4)',
            }}
          >
            <Plus size={16} /> Add Device
          </button>
        </div>
      </div>

      {/* Room Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--space-xl)' }}>
        {ROOMS.map(r => (
          <button key={r} onClick={() => setActiveRoom(r)} style={{
            padding: '7px 16px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
            border: `1px solid ${activeRoom === r ? 'rgba(79,110,247,0.5)' : 'var(--border)'}`,
            background: activeRoom === r ? 'rgba(79,110,247,0.2)' : 'var(--bg-card)',
            color: activeRoom === r ? 'var(--accent-blue)' : 'var(--text-muted)',
            fontSize: 13, fontWeight: activeRoom === r ? 600 : 400, transition: 'all 0.2s',
          }}>{r} {r === 'All' ? `(${state.devices.length})` : ''}</button>
        ))}
      </div>

      {/* Device Grid */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-lg)' }}>
          {filtered.map(d => <DeviceCard key={d.id} {...d} showDelete={true} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <Filter size={48} strokeWidth={1} style={{ marginBottom: 16, opacity: 0.4 }} />
          <p style={{ fontSize: 16 }}>No devices found</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Try a different filter or add a new device</p>
        </div>
      )}

      {/* Add Device Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title='Add New Device'
        size='md'
        footer={
          <>
            <button className='btn btn-secondary' onClick={() => setAddOpen(false)}>Cancel</button>
            <button className='btn btn-primary'   onClick={handleAdd}>Add Device</button>
          </>
        }
      >
        <div className='form-group'>
          <label className='form-label'>Device Type</label>
          <select className='form-select' value={form.deviceName} onChange={e => set('deviceName', e.target.value)}>
            {D_NAMES.map(n => <option key={n}>{n}</option>)}
          </select>
          {errors.deviceName && <p className='form-error'>{errors.deviceName}</p>}
        </div>
        <div className='form-group'>
          <label className='form-label'>Room</label>
          <select className='form-select' value={form.roomName} onChange={e => set('roomName', e.target.value)}>
            {ROOMS.filter(r => r !== 'All').map(r => <option key={r}>{r}</option>)}
          </select>
          {errors.roomName && <p className='form-error'>{errors.roomName}</p>}
        </div>
        <div className='form-group'>
          <label className='form-label'>Power Rating (Watts)</label>
          <input
            type='number' className='form-input' placeholder='e.g. 1500'
            value={form.wattage} onChange={e => set('wattage', e.target.value)}
          />
          {errors.wattage && <p className='form-error'>{errors.wattage}</p>}
          <p className='form-hint'>Check the label on your appliance for its wattage.</p>
        </div>
      </Modal>
    </div>
  );
}

export default Devices;
