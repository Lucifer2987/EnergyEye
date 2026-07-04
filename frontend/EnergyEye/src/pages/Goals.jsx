import { useState } from 'react';
import { Target, Plus, Check, Flame, Leaf, DollarSign, Zap, Edit2 } from 'lucide-react';
import '../assets/styles/shared.css';

/* Calendar heatmap mock data */
const generateCalendar = () => {
  const days = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      usage: Math.round((8 + Math.random() * 18) * 10) / 10,
    });
  }
  return days;
};

const calDays = generateCalendar();
const GOALS = [
  { id: 1, icon: Zap,         label: 'Monthly Energy Budget', target: 300,  current: 211,  unit: 'kWh', color: '#4f6ef7' },
  { id: 2, icon: DollarSign,  label: 'Monthly Cost Limit',    target: 1500, current: 782,  unit: '₹',  color: '#f7a23e' },
  { id: 3, icon: Leaf,        label: 'CO₂ Reduction',         target: 50,   current: 33.2, unit: 'kg',  color: '#39d98a' },
  { id: 4, icon: Flame,       label: 'Peak Hour Avoidance',   target: 30,   current: 21,   unit: 'days', color: '#a78bfa' },
];

function GoalBar({ goal }) {
  const pct = Math.min((goal.current / goal.target) * 100, 100);
  const done = pct >= 100;
  return (
    <div className='chart-card' style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: `rgba(${goal.color === '#4f6ef7' ? '79,110,247' : goal.color === '#f7a23e' ? '247,162,62' : goal.color === '#39d98a' ? '57,217,138' : '167,139,250'},0.15)`,
            display: 'grid', placeItems: 'center', border: `1px solid ${goal.color}33`,
          }}>
            <goal.icon size={18} color={goal.color} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{goal.label}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{goal.current} / {goal.target} {goal.unit}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {done && <Check size={16} color='var(--accent-green)' />}
          <span style={{ fontSize: 18, fontWeight: 800, color: done ? 'var(--accent-green)' : 'var(--text-primary)' }}>
            {Math.round(pct)}%
          </span>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <Edit2 size={14} />
          </button>
        </div>
      </div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: done ? 'var(--accent-green)' : goal.color,
          borderRadius: 999,
          transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: `0 0 12px ${goal.color}66`,
        }} />
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
        {done ? '✅ Goal achieved!' : `${goal.target - goal.current} ${goal.unit} remaining to hit target`}
      </p>
    </div>
  );
}

function HeatCell({ day }) {
  const norm = (day.usage - 8) / 18;
  const opacity = 0.1 + norm * 0.85;
  const hot = day.usage > 22;
  return (
    <div
      title={`${day.date}: ${day.usage} kWh`}
      style={{
        width: 28, height: 28, borderRadius: 6,
        background: hot ? `rgba(255,107,107,${opacity})` : `rgba(79,110,247,${opacity})`,
        border: '1px solid rgba(255,255,255,0.05)',
        cursor: 'default',
        transition: 'transform 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    />
  );
}

function Goals() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className='page-container'>
      <div className='page-header'>
        <div>
          <h1 className='page-title'>Energy Goals</h1>
          <p className='page-subtitle'>Track your monthly targets and daily habits.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #4f6ef7, #00f5d4)',
            border: 'none', borderRadius: 'var(--radius-pill)',
            color: '#000', fontWeight: 600, fontSize: 13, padding: '10px 20px',
            cursor: 'pointer', boxShadow: '0 0 20px rgba(79,110,247,0.4)',
          }}
        >
          <Plus size={16} /> New Goal
        </button>
      </div>

      {/* Goal cards */}
      <div className='two-col' style={{ marginBottom: 'var(--space-xl)' }}>
        {GOALS.map(g => <GoalBar key={g.id} goal={g} />)}
      </div>

      {/* Calendar heatmap */}
      <div className='chart-card'>
        <div className='chart-card__header'>
          <div>
            <p className='chart-card__title'>30-Day Usage Heatmap</p>
            <p className='chart-card__sub'>Daily energy consumption — hover to see details</p>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(79,110,247,0.6)', display: 'inline-block' }} /> Low
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(255,107,107,0.7)', display: 'inline-block' }} /> High
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-start' }}>
          {calDays.map((d, i) => <HeatCell key={i} day={d} />)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {calDays.map((d, i) => (
            <span key={i} style={{ width: 28, fontSize: 9, textAlign: 'center', color: 'var(--text-disabled)' }}>
              {d.date.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Goals;
