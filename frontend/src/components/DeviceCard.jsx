import React, { useState } from 'react';
import { Power, Wifi, WifiOff } from 'lucide-react';
import './DeviceCard.css';

const deviceIcons = {
  'Washing Machine': '🫧',
  'Air Conditioner': '❄️',
  'Refrigerator': '🧊',
  'Television': '📺',
  'Water Heater': '🚿',
  'Microwave': '📡',
  'Dishwasher': '🍽️',
  'Lighting': '💡',
  'default': '🔌',
};

function DeviceCard({ deviceImage, deviceName, roomName, energyConsumed, isConnected = true, wattage = 0 }) {
  const [isOn, setIsOn] = useState(false);

  const emoji = deviceIcons[deviceName] || deviceIcons['default'];

  return (
    <div className={`device-card ${isOn ? 'device-card--on' : ''}`}>
      <div className='device-card__header'>
        <div className='device-card__icon-wrap'>
          {deviceImage
            ? <img src={deviceImage} alt={deviceName} className='device-card__img' />
            : <span className='device-card__emoji'>{emoji}</span>
          }
        </div>
        <div className='device-card__status'>
          {isConnected
            ? <Wifi size={14} color='var(--accent-green)' />
            : <WifiOff size={14} color='var(--text-muted)' />
          }
        </div>
      </div>

      <div className='device-card__info'>
        <h3 className='device-card__name'>{deviceName}</h3>
        <p className='device-card__room'>{roomName}</p>
      </div>

      <div className='device-card__stats'>
        <div className='device-card__stat'>
          <span className='device-card__stat-value'>{energyConsumed}</span>
          <span className='device-card__stat-label'>kWh today</span>
        </div>
        {wattage > 0 && (
          <div className='device-card__stat'>
            <span className='device-card__stat-value'>{wattage}W</span>
            <span className='device-card__stat-label'>now</span>
          </div>
        )}
      </div>

      <div className='device-card__footer'>
        <span className={`device-card__state-label ${isOn ? 'on' : 'off'}`}>
          {isOn ? 'ON' : 'OFF'}
        </span>
        <button
          className={`device-card__toggle ${isOn ? 'active' : ''}`}
          onClick={() => setIsOn(!isOn)}
          aria-label={`Toggle ${deviceName}`}
        >
          <Power size={18} />
        </button>
      </div>
    </div>
  );
}

export default DeviceCard;
