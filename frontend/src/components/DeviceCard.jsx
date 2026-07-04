import { useState } from 'react';
import { Power, Wifi, WifiOff, Clock, Trash2 } from 'lucide-react';
import Modal from './Modal.jsx';
import { useApp } from '../context/AppContext.jsx';
import './DeviceCard.css';

const EMOJIS = {
  'Air Conditioner': '❄️', 'Water Heater': '🚿', 'Refrigerator': '🧊',
  'Television': '📺',       'Microwave': '📡',     'Dishwasher': '🍽️',
  'Washing Machine': '🫧',  'Lighting': '💡',      default: '🔌',
};

function DeviceCard({ id, deviceImage, deviceName, roomName, energyConsumed,
                      isConnected = true, wattage = 0, isOn = false,
                      schedule = null, showDelete = false }) {
  const { dispatch, addToast } = useApp();
  const [schedOpen, setSchedOpen] = useState(false);
  const [schedOn,   setSchedOn]   = useState(schedule?.on  || '');
  const [schedOff,  setSchedOff]  = useState(schedule?.off || '');

  const emoji = EMOJIS[deviceName] || EMOJIS.default;

  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_DEVICE', id });
    addToast(`${deviceName} turned ${!isOn ? 'ON' : 'OFF'}`, !isOn ? 'success' : 'info');
  };

  const handleSaveSchedule = () => {
    if (!schedOn || !schedOff) { addToast('Set both ON and OFF times', 'error'); return; }
    dispatch({ type: 'SET_SCHEDULE', id, schedule: { on: schedOn, off: schedOff } });
    addToast(`Schedule saved for ${deviceName}`, 'success');
    setSchedOpen(false);
  };

  const handleClearSchedule = () => {
    dispatch({ type: 'SET_SCHEDULE', id, schedule: null });
    setSchedOn(''); setSchedOff('');
    addToast(`Schedule cleared`, 'info');
    setSchedOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Remove ${deviceName} from ${roomName}?`)) {
      dispatch({ type: 'REMOVE_DEVICE', id });
      addToast(`${deviceName} removed`, 'warn');
    }
  };

  return (
    <>
      <div className={`device-card ${isOn ? 'device-card--on' : ''}`}>
        {/* Header */}
        <div className='device-card__header'>
          <div className='device-card__icon-wrap'>
            {deviceImage
              ? <img src={deviceImage} alt={deviceName} className='device-card__img' />
              : <span className='device-card__emoji'>{emoji}</span>
            }
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {schedule && (
              <span className='sched-badge' title={`ON ${schedule.on} → OFF ${schedule.off}`}>
                <Clock size={9} /> {schedule.on}
              </span>
            )}
            {isConnected
              ? <Wifi    size={14} color='var(--accent-green)' />
              : <WifiOff size={14} color='var(--text-muted)'   />
            }
          </div>
        </div>

        {/* Info */}
        <div className='device-card__info'>
          <h3 className='device-card__name'>{deviceName}</h3>
          <p  className='device-card__room'>{roomName}</p>
        </div>

        {/* Stats */}
        <div className='device-card__stats'>
          <div className='device-card__stat'>
            <span className='device-card__stat-value'>{energyConsumed}</span>
            <span className='device-card__stat-label'>kWh today</span>
          </div>
          {wattage > 0 && (
            <div className='device-card__stat'>
              <span className='device-card__stat-value'>{wattage}W</span>
              <span className='device-card__stat-label'>rated</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='device-card__footer'>
          <span className={`device-card__state-label ${isOn ? 'on' : 'off'}`}>
            {isOn ? 'ON' : 'OFF'}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className='icon-btn' onClick={() => { setSchedOn(schedule?.on||''); setSchedOff(schedule?.off||''); setSchedOpen(true); }} title='Set Schedule'>
              <Clock size={14} />
            </button>
            {showDelete && (
              <button className='icon-btn icon-btn--danger' onClick={handleDelete} title='Remove Device'>
                <Trash2 size={14} />
              </button>
            )}
            <button
              className={`device-card__toggle ${isOn ? 'active' : ''}`}
              onClick={handleToggle}
            >
              <Power size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={schedOpen}
        onClose={() => setSchedOpen(false)}
        title={`Schedule · ${deviceName}`}
        size='sm'
        footer={
          <>
            {schedule && <button className='btn btn-danger' onClick={handleClearSchedule}>Clear</button>}
            <button className='btn btn-secondary' onClick={() => setSchedOpen(false)}>Cancel</button>
            <button className='btn btn-primary'   onClick={handleSaveSchedule}>Save Schedule</button>
          </>
        }
      >
        <div className='form-group'>
          <label className='form-label'>Turn ON at</label>
          <input type='time' className='form-input' value={schedOn} onChange={e => setSchedOn(e.target.value)} />
        </div>
        <div className='form-group'>
          <label className='form-label'>Turn OFF at</label>
          <input type='time' className='form-input' value={schedOff} onChange={e => setSchedOff(e.target.value)} />
        </div>
        <p className='form-hint' style={{ marginTop: 8 }}>
          Device will automatically toggle at these times via AWS IoT Core.
        </p>
      </Modal>
    </>
  );
}

export default DeviceCard;
