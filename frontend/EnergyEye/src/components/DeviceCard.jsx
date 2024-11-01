import React, { useState } from 'react';
import '../assets/styles/DeviceCard.css';
import Svg from './Svg.jsx';

function DeviceCard({ deviceImage, deviceName, roomName, energyConsumed }) {
    const [isOn, setIsOn] = useState(false);

    const handleToggle = () => {
        setIsOn(!isOn);
    };

    return (
        <div className='card'>
            <div className='device-control'>
                <img src={deviceImage} alt={deviceName} className='image' />
                <div className='device-info'>
                    <h2 className='title'>{roomName}</h2>
                    <h2 className='title'>{deviceName}</h2>
                </div>
                <button
                    className={`toggle ${isOn ? 'active' : ''}`}
                    onClick={handleToggle}
                >
                    <Svg color={isOn ? 'white' : 'black'} />
                </button>
            </div>
            <div className='energy'>
                <p>Energy Consumed: {energyConsumed} kWh</p>
            </div>
        </div>
    );
};

export default DeviceCard;
