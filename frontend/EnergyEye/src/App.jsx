// import { useState } from 'react';
import './App.css';
import DeviceCard from './components/DeviceCard.jsx';

function App() {
	return (
		<>
		<div className='home'>
			<div className='total-energy'>
				
			</div>
			<div className='device-control-panel'>
				<DeviceCard 
				deviceImage="/src/assets/images/washing_machine.png"
				deviceName="Washing Machine"
				roomName="Living Room"
				energyConsumed={5.2}
				/>
				<DeviceCard 
				deviceImage="/src/assets/images/washing_machine.png"
				deviceName="Washing Machine"
				roomName="Living Room"
				energyConsumed={5.2}
				/>
				<DeviceCard 
				deviceImage="/src/assets/images/washing_machine.png"
				deviceName="Washing Machine"
				roomName="Living Room"
				energyConsumed={5.2}
				/>
			</div>
		</div>
		</>
	);
};

export default App
