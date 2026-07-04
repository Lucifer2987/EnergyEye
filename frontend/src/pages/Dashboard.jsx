import { useState, useEffect } from 'react';
import { Zap, DollarSign, Leaf, Cpu, AlertTriangle, TrendingDown } from 'lucide-react';
import StatCard from '../components/StatCard.jsx';
import { EnergyAreaChart } from '../components/EnergyChart.jsx';
import CarbonMeter from '../components/CarbonMeter.jsx';
import DeviceCard from '../components/DeviceCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import '../assets/styles/shared.css';

/* ── Multi-period chart data ──────────────────── */
const CHART_DATA = {
  '24H': [
    { time: '12AM', usage: 1.2 }, { time: '2AM',  usage: 0.8 },
    { time: '4AM',  usage: 0.6 }, { time: '6AM',  usage: 1.4 },
    { time: '8AM',  usage: 2.8 }, { time: '10AM', usage: 3.5 },
    { time: '12PM', usage: 4.1 }, { time: '2PM',  usage: 3.8 },
    { time: '4PM',  usage: 3.2 }, { time: '6PM',  usage: 4.7 },
    { time: '8PM',  usage: 5.1 }, { time: '10PM', usage: 3.6 },
  ],
  '7D': [
    { time: 'Mon', usage: 18.4 }, { time: 'Tue', usage: 21.2 },
    { time: 'Wed', usage: 16.7 }, { time: 'Thu', usage: 23.5 },
    { time: 'Fri', usage: 19.8 }, { time: 'Sat', usage: 27.3 },
    { time: 'Sun', usage: 24.1 },
  ],
  '30D': [
    { time: '1', usage: 14.2 }, { time: '5', usage: 18.6 }, { time: '10', usage: 22.1 },
    { time: '15', usage: 19.8 }, { time: '20', usage: 16.3 }, { time: '25', usage: 20.5 },
    { time: '30', usage: 25.7 },
  ],
};

function useDateTime() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return now;
}

function Dashboard() {
  const now = useDateTime();
  const [tab, setTab] = useState('24H');
  const { state } = useApp();

  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const activeCount = state.devices.filter(d => d.isOn).length;
  const topDevices  = [...state.devices].sort((a, b) => b.energyConsumed - a.energyConsumed).slice(0, 3);

  return (
    <div className='page-container'>
      {/* Header */}
      <div className='page-header'>
        <div>
          <h1 className='page-title'>Dashboard</h1>
          <p className='page-subtitle'>Welcome back, {state.user.name}! Here's your energy overview.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p className='page-time'>{timeStr}</p>
          <p className='page-date'>{dateStr}</p>
          <span className='alert-badge' style={{ marginTop: 8, display: 'inline-flex' }}>
            <AlertTriangle size={13} /> Peak hours: 6PM – 10PM
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className='stats-grid'>
        <StatCard title='Total kWh Today'   value='11.2' unit='kWh'  icon={Zap}         color='blue'   trend={-8}  trendLabel='vs yesterday' />
        <StatCard title='Monthly Cost'       value='₹782' unit=''     icon={DollarSign}  color='orange' trend={5}   trendLabel='vs last month' />
        <StatCard title='CO₂ Saved'          value='14.6' unit='kg'   icon={Leaf}        color='green'  trend={12}  trendLabel='this month' />
        <StatCard title='Active Devices'     value={activeCount} unit={`/ ${state.devices.length}`} icon={Cpu} color='purple' subtitle='live from context' />
      </div>

      {/* Chart + Carbon */}
      <div className='three-col-wide' style={{ marginBottom: 'var(--space-xl)' }}>
        <div className='chart-card'>
          <div className='chart-card__header'>
            <div>
              <p className='chart-card__title'>Energy Consumption</p>
              <p className='chart-card__sub'>
                {tab === '24H' ? 'Hourly today' : tab === '7D' ? 'Daily this week' : 'Daily this month'}
              </p>
            </div>
            <div className='toggle-tabs'>
              {['24H', '7D', '30D'].map(t => (
                <button key={t} className={`toggle-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className='chart-card__body'>
            <EnergyAreaChart data={CHART_DATA[tab]} dataKey='usage' color='#4f6ef7' />
          </div>
        </div>

        <div className='chart-card' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p className='chart-card__title' style={{ alignSelf: 'flex-start', marginBottom: 'var(--space-md)' }}>Carbon Footprint</p>
          <CarbonMeter value={14.6} max={30} unit='kg CO₂' label='Monthly CO₂ Saved' />
        </div>
      </div>

      {/* AI Tip */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79,110,247,0.15), rgba(0,245,212,0.08))',
        border: '1px solid rgba(79,110,247,0.3)', borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-lg)', display: 'flex', alignItems: 'center',
        gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg,#4f6ef7,#00f5d4)',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <TrendingDown size={22} color='#000' />
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
            💡 AI Insight: You could save ₹120 this month
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Shifting your AC to off-peak hours (10PM–6AM) and raising thermostat by 2°C can reduce your bill by ~15%.
          </p>
        </div>
      </div>

      {/* Active Devices — live from context */}
      <p className='section-title'>Top Energy Consumers</p>
      <div className='three-col'>
        {topDevices.map(d => <DeviceCard key={d.id} {...d} />)}
      </div>
    </div>
  );
}

export default Dashboard;
