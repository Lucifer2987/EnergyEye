import { useState } from 'react';
import { Zap, TrendingUp, BarChart2 } from 'lucide-react';
import { EnergyAreaChart, EnergyBarChart, MultiLineChart } from '../components/EnergyChart.jsx';
import '../assets/styles/shared.css';

/* ── Multi-period trend data ─────────────── */
const TREND_DATA = {
  '24H': [
    { time: '12AM', usage: 1.2 }, { time: '3AM',  usage: 0.7 },
    { time: '6AM',  usage: 1.5 }, { time: '9AM',  usage: 3.2 },
    { time: '12PM', usage: 4.1 }, { time: '3PM',  usage: 3.5 },
    { time: '6PM',  usage: 4.9 }, { time: '9PM',  usage: 5.1 },
    { time: '12AM', usage: 2.1 },
  ],
  '7D': [
    { time: 'Mon', usage: 18.4 }, { time: 'Tue', usage: 21.2 },
    { time: 'Wed', usage: 16.7 }, { time: 'Thu', usage: 23.5 },
    { time: 'Fri', usage: 19.8 }, { time: 'Sat', usage: 27.3 },
    { time: 'Sun', usage: 24.1 },
  ],
  '30D': [
    { time: 'W1',  usage: 115 }, { time: 'W2', usage: 134 },
    { time: 'W3',  usage: 121 }, { time: 'W4', usage: 141 },
  ],
  '3M': [
    { time: 'Apr', usage: 490 }, { time: 'May', usage: 521 },
    { time: 'Jun', usage: 478 },
  ],
};

const STATS_BY_PERIOD = {
  '24H': { total: '11.2 kWh', vs: '-8%',    avg: '0.93 kWh' },
  '7D':  { total: '111 kWh',  vs: '+12.3%', avg: '15.9 kWh' },
  '30D': { total: '511 kWh',  vs: '+3.1%',  avg: '17.0 kWh' },
  '3M':  { total: '1,489 kWh',vs: '-2.4%',  avg: '16.5 kWh' },
};


const roomData = [
  { room: 'Living Room', usage: 32 }, { room: 'Kitchen',     usage: 21 },
  { room: 'Bedroom',     usage: 14 }, { room: 'Bathroom',    usage: 18 },
  { room: 'Study',       usage: 8  }, { room: 'Garage',      usage: 7  },
];
const solarGrid = [
  { time: 'Mon', solar: 4.2, grid: 14.2 }, { time: 'Tue', solar: 5.1, grid: 16.1 },
  { time: 'Wed', solar: 3.8, grid: 12.9 }, { time: 'Thu', solar: 6.0, grid: 17.5 },
  { time: 'Fri', solar: 4.9, grid: 14.9 }, { time: 'Sat', solar: 7.2, grid: 20.1 },
  { time: 'Sun', solar: 6.5, grid: 17.6 },
];

const deviceBreakdown = [
  { name: 'Air Conditioner', room: 'Living Room', kwh: 42.3, cost: '₹296', pct: 38 },
  { name: 'Water Heater',    room: 'Bathroom',    kwh: 28.1, cost: '₹197', pct: 25 },
  { name: 'Refrigerator',    room: 'Kitchen',     kwh: 14.5, cost: '₹102', pct: 13 },
  { name: 'Washing Machine', room: 'Kitchen',     kwh: 11.2, cost: '₹78',  pct: 10 },
  { name: 'Television',      room: 'Bedroom',     kwh: 7.8,  cost: '₹55',  pct: 7  },
  { name: 'Lighting',        room: 'All Rooms',   kwh: 6.4,  cost: '₹45',  pct: 6  },
  { name: 'Microwave',       room: 'Kitchen',     kwh: 1.1,  cost: '₹8',   pct: 1  },
];

function Energy() {
  const [period, setPeriod] = useState('7D');
  const stats = STATS_BY_PERIOD[period];

  return (
    <div className='page-container'>
      <div className='page-header'>
        <div>
          <h1 className='page-title'>Energy Analytics</h1>
          <p className='page-subtitle'>Detailed breakdown of your electricity usage.</p>
        </div>
        <div className='toggle-tabs'>
          {['24H', '7D', '30D', '3M'].map(t => (
            <button key={t} className={`toggle-tab ${period === t ? 'active' : ''}`} onClick={() => setPeriod(t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* Summary pills — update with period */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        {[
          { icon: Zap,        label: `Total (${period})`,      val: stats.total, color: '#4f6ef7' },
          { icon: TrendingUp, label: 'vs previous period',     val: stats.vs,    color: stats.vs.startsWith('-') ? '#39d98a' : '#ff6b6b' },
          { icon: BarChart2,  label: 'Avg per unit',           val: stats.avg,   color: '#39d98a' },
        ].map(({ icon: Icon, label, val, color }) => (

          <div key={label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <Icon size={18} color={color} />
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</p>
              <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className='two-col' style={{ marginBottom: 'var(--space-xl)' }}>
        <div className='chart-card'>
          <div className='chart-card__header'>
            <div>
              <p className='chart-card__title'>Usage Trend</p>
              <p className='chart-card__sub'>
                {period === '24H' ? 'Hourly today' : period === '7D' ? 'Daily this week' : period === '30D' ? 'Weekly this month' : 'Monthly (3M)'}
              </p>
            </div>
          </div>
          <div className='chart-card__body'>
            <EnergyAreaChart data={TREND_DATA[period]} dataKey='usage' color='#00f5d4' />
          </div>
        </div>
        <div className='chart-card'>
          <div className='chart-card__header'>
            <div>
              <p className='chart-card__title'>Room-wise Consumption</p>
              <p className='chart-card__sub'>kWh breakdown by room</p>
            </div>
          </div>
          <div className='chart-card__body'>
            <EnergyBarChart data={roomData} />
          </div>
        </div>
      </div>

      {/* Solar vs Grid */}
      <div className='chart-card' style={{ marginBottom: 'var(--space-xl)' }}>
        <div className='chart-card__header'>
          <div>
            <p className='chart-card__title'>Solar vs Grid Usage</p>
            <p className='chart-card__sub'>Renewable vs utility energy this week</p>
          </div>
        </div>
        <div className='chart-card__body' style={{ height: 220 }}>
          <MultiLineChart data={solarGrid} />
        </div>
      </div>

      {/* Device breakdown table */}
      <div className='chart-card'>
        <p className='chart-card__title' style={{ marginBottom: 'var(--space-lg)' }}>Per-Device Breakdown</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                {['Device', 'Room', 'kWh', 'Est. Cost', '% of Total'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deviceBreakdown.map((d, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 14px', color: 'var(--text-primary)', fontWeight: 600 }}>{d.name}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{d.room}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--accent-cyan)', fontWeight: 600 }}>{d.kwh}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--accent-orange)' }}>{d.cost}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 999 }}>
                        <div style={{ width: `${d.pct}%`, height: '100%', background: 'linear-gradient(90deg,#4f6ef7,#00f5d4)', borderRadius: 999 }} />
                      </div>
                      <span style={{ color: 'var(--text-secondary)', minWidth: 32, textAlign: 'right' }}>{d.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Energy;
