import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

/* ─── Seed Data ─────────────────────────────────────── */
export const DEVICE_LIST = [
  { id: 1,  deviceName: 'Air Conditioner', roomName: 'Living Room',  energyConsumed: 4.2, wattage: 1500, isConnected: true,  room: 'Living Room',  isOn: true,  schedule: null },
  { id: 2,  deviceName: 'Television',      roomName: 'Living Room',  energyConsumed: 1.1, wattage: 120,  isConnected: true,  room: 'Living Room',  isOn: true,  schedule: null },
  { id: 3,  deviceName: 'Water Heater',    roomName: 'Bathroom',     energyConsumed: 2.8, wattage: 2000, isConnected: true,  room: 'Bathroom',     isOn: false, schedule: { on: '06:00', off: '08:00' } },
  { id: 4,  deviceName: 'Refrigerator',    roomName: 'Kitchen',      energyConsumed: 1.9, wattage: 150,  isConnected: true,  room: 'Kitchen',      isOn: true,  schedule: null },
  { id: 5,  deviceName: 'Microwave',       roomName: 'Kitchen',      energyConsumed: 0.4, wattage: 1200, isConnected: true,  room: 'Kitchen',      isOn: false, schedule: null },
  { id: 6,  deviceName: 'Dishwasher',      roomName: 'Kitchen',      energyConsumed: 0.8, wattage: 1800, isConnected: false, room: 'Kitchen',      isOn: false, schedule: { on: '22:00', off: '23:30' } },
  { id: 7,  deviceName: 'Washing Machine', roomName: 'Utility Room', energyConsumed: 1.5, wattage: 500,  isConnected: true,  room: 'Utility Room', isOn: false, schedule: { on: '22:00', off: '00:00' } },
  { id: 8,  deviceName: 'Lighting',        roomName: 'Bedroom',      energyConsumed: 0.3, wattage: 40,   isConnected: true,  room: 'Bedroom',      isOn: true,  schedule: null },
  { id: 9,  deviceName: 'Air Conditioner', roomName: 'Bedroom',      energyConsumed: 2.1, wattage: 1200, isConnected: true,  room: 'Bedroom',      isOn: false, schedule: null },
  { id: 10, deviceName: 'Television',      roomName: 'Bedroom',      energyConsumed: 0.6, wattage: 80,   isConnected: false, room: 'Bedroom',      isOn: false, schedule: null },
  { id: 11, deviceName: 'Lighting',        roomName: 'Study',        energyConsumed: 0.2, wattage: 25,   isConnected: true,  room: 'Study',        isOn: true,  schedule: null },
  { id: 12, deviceName: 'Lighting',        roomName: 'Living Room',  energyConsumed: 0.5, wattage: 60,   isConnected: true,  room: 'Living Room',  isOn: true,  schedule: null },
];

const GOALS_LIST = [
  { id: 1, iconName: 'Zap',        label: 'Monthly Energy Budget', target: 300,  current: 211,  unit: 'kWh',  color: '#4f6ef7' },
  { id: 2, iconName: 'DollarSign', label: 'Monthly Cost Limit',    target: 1500, current: 782,  unit: '₹',   color: '#f7a23e' },
  { id: 3, iconName: 'Leaf',       label: 'CO₂ Reduction',         target: 50,   current: 33.2, unit: 'kg',   color: '#39d98a' },
  { id: 4, iconName: 'Flame',      label: 'Peak Hour Avoidance',   target: 30,   current: 21,   unit: 'days', color: '#a78bfa' },
];

const INITIAL = {
  user: { name: 'Amit Kumar', email: 'amit.kumar@gmail.com', location: 'Mumbai, India', plan: 'Home Plan' },
  devices: DEVICE_LIST,
  goals: GOALS_LIST,
  settings: {
    notifs: { peakAlert: true, weeklyReport: true, goalAchieved: false, anomaly: true },
    prefs:  { awsSynced: true, aiInsights: false },
    aws:    { iotCore: true, dynamoDB: true, lambda: true, sns: true, bedrock: false },
  },
  toasts: [],
};

/* ─── Load from localStorage ──────────────────────────── */
function load() {
  try {
    const raw = localStorage.getItem('ee_state');
    if (!raw) return INITIAL;
    return { ...INITIAL, ...JSON.parse(raw), toasts: [] };
  } catch { return INITIAL; }
}

/* ─── Reducer ─────────────────────────────────────────── */
function reducer(s, a) {
  switch (a.type) {
    case 'TOGGLE_DEVICE':
      return { ...s, devices: s.devices.map(d => d.id === a.id ? { ...d, isOn: !d.isOn } : d) };
    case 'SET_SCHEDULE':
      return { ...s, devices: s.devices.map(d => d.id === a.id ? { ...d, schedule: a.schedule } : d) };
    case 'ADD_DEVICE':
      return { ...s, devices: [...s.devices, { ...a.device, id: Date.now(), isOn: false, schedule: null, isConnected: true }] };
    case 'REMOVE_DEVICE':
      return { ...s, devices: s.devices.filter(d => d.id !== a.id) };
    case 'ADD_GOAL':
      return { ...s, goals: [...s.goals, { ...a.goal, id: Date.now() }] };
    case 'UPDATE_GOAL':
      return { ...s, goals: s.goals.map(g => g.id === a.goal.id ? a.goal : g) };
    case 'DELETE_GOAL':
      return { ...s, goals: s.goals.filter(g => g.id !== a.id) };
    case 'UPDATE_USER':
      return { ...s, user: { ...s.user, ...a.user } };
    case 'UPDATE_SETTINGS':
      return { ...s, settings: { ...s.settings, ...a.settings } };
    case 'ADD_TOAST': {
      const t = { id: Date.now(), ...a.toast };
      return { ...s, toasts: [...s.toasts, t] };
    }
    case 'REMOVE_TOAST':
      return { ...s, toasts: s.toasts.filter(t => t.id !== a.id) };
    default: return s;
  }
}

/* ─── Context & Provider ──────────────────────────────── */
export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  // Persist (excluding toasts)
  useEffect(() => {
    const { toasts, ...save } = state;
    localStorage.setItem('ee_state', JSON.stringify(save));
  }, [state]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    dispatch({ type: 'ADD_TOAST', toast: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 3500);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, addToast }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
