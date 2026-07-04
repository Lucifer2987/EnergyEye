import { useState } from 'react';
import { Sparkles, CheckCircle, Clock, TrendingDown, Thermometer, Zap, Sun, AlertCircle } from 'lucide-react';
import '../assets/styles/shared.css';

const SUGGESTIONS = [
  {
    id: 1,
    icon: Thermometer,
    title: 'Optimise Air Conditioner Temperature',
    desc: 'Your AC is set to 20°C. Raising it to 24°C reduces energy use by ~20% with minimal comfort impact.',
    saving: '₹124/month', co2: '8.2 kg CO₂',
    impact: 'high', status: 'pending', category: 'Cooling',
  },
  {
    id: 2,
    icon: Clock,
    title: 'Shift Washing Machine to Off-Peak Hours',
    desc: 'Running your washing machine between 11PM–5AM saves energy during low-demand hours, reducing cost by 30%.',
    saving: '₹56/month', co2: '3.1 kg CO₂',
    impact: 'medium', status: 'applied', category: 'Scheduling',
  },
  {
    id: 3,
    icon: Zap,
    title: 'Replace Incandescent Bulbs with LEDs',
    desc: 'Replacing 8 incandescent bulbs with LEDs can save up to 75% of lighting energy.',
    saving: '₹88/month', co2: '5.4 kg CO₂',
    impact: 'high', status: 'pending', category: 'Lighting',
  },
  {
    id: 4,
    icon: Sun,
    title: 'Enable Solar Priority Mode',
    desc: 'Your solar panels generate peak energy 10AM–3PM. Scheduling heavy appliances in this window can offset grid usage.',
    saving: '₹210/month', co2: '14.8 kg CO₂',
    impact: 'high', status: 'pending', category: 'Solar',
  },
  {
    id: 5,
    icon: AlertCircle,
    title: 'Water Heater Running Continuously',
    desc: 'Your water heater is detected to be running 24/7. Setting a schedule can cut its usage by 40%.',
    saving: '₹77/month', co2: '4.6 kg CO₂',
    impact: 'medium', status: 'pending', category: 'Heating',
  },
  {
    id: 6,
    icon: TrendingDown,
    title: 'Standby Power Drain Detected',
    desc: 'TV and microwave are drawing standby power (~45W combined). Using smart plugs or switching off at the socket can help.',
    saving: '₹32/month', co2: '1.9 kg CO₂',
    impact: 'low', status: 'dismissed', category: 'Efficiency',
  },
];

const impactColor = {
  high:   { bg: 'rgba(255,107,107,0.15)', text: '#ff6b6b', border: 'rgba(255,107,107,0.3)' },
  medium: { bg: 'rgba(247,162,62,0.15)',  text: '#f7a23e', border: 'rgba(247,162,62,0.3)' },
  low:    { bg: 'rgba(57,217,138,0.15)',  text: '#39d98a', border: 'rgba(57,217,138,0.3)' },
};

function SuggestionCard({ s, onApply, onDismiss }) {
  const ic = impactColor[s.impact];
  const applied  = s.status === 'applied';
  const dismissed = s.status === 'dismissed';

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${applied ? 'rgba(57,217,138,0.35)' : dismissed ? 'rgba(255,255,255,0.04)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-lg)',
      display: 'flex', flexDirection: 'column', gap: 'var(--space-md)',
      opacity: dismissed ? 0.45 : 1,
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 'var(--radius-md)', flexShrink: 0,
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            display: 'grid', placeItems: 'center',
          }}>
            <s.icon size={20} color='var(--accent-blue)' />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{s.title}</p>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--radius-pill)', ...ic, display: 'inline-block', fontWeight: 600 }}>
              {s.impact.toUpperCase()} IMPACT
            </span>
          </div>
        </div>
        <span style={{
          fontSize: 11, padding: '3px 10px', borderRadius: 'var(--radius-pill)',
          background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border)',
        }}>{s.category}</span>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>

      <div style={{ display: 'flex', gap: 16 }}>
        <div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Estimated saving</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-green)' }}>{s.saving}</p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>CO₂ reduction</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-cyan)' }}>{s.co2}</p>
        </div>
      </div>

      {!applied && !dismissed && (
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button onClick={() => onApply(s.id)} style={{
            flex: 1, padding: '9px 0', borderRadius: 'var(--radius-pill)', border: 'none',
            background: 'linear-gradient(135deg,#4f6ef7,#00f5d4)', color: '#000',
            fontWeight: 600, fontSize: 13, cursor: 'pointer',
          }}>Apply Recommendation</button>
          <button onClick={() => onDismiss(s.id)} style={{
            padding: '9px 18px', borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer',
          }}>Dismiss</button>
        </div>
      )}
      {applied && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-green)', fontSize: 13, fontWeight: 600 }}>
          <CheckCircle size={16} /> Applied — tracking savings
        </div>
      )}
    </div>
  );
}

function AISuggestions() {
  const [suggestions, setSuggestions] = useState(SUGGESTIONS);
  const [filter, setFilter] = useState('All');

  const cats = ['All', 'Cooling', 'Scheduling', 'Lighting', 'Solar', 'Heating', 'Efficiency'];

  const shown = suggestions.filter(s => filter === 'All' || s.category === filter);
  const totalSaving = suggestions.filter(s => s.status === 'applied').reduce((a, s) => {
    return a + parseInt(s.saving.replace(/[^0-9]/g, ''));
  }, 0);

  const apply   = id => setSuggestions(p => p.map(s => s.id === id ? { ...s, status: 'applied'    } : s));
  const dismiss = id => setSuggestions(p => p.map(s => s.id === id ? { ...s, status: 'dismissed'  } : s));

  return (
    <div className='page-container'>
      <div className='page-header'>
        <div>
          <h1 className='page-title'>AI Insights</h1>
          <p className='page-subtitle'>Smart recommendations powered by your usage patterns.</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, rgba(79,110,247,0.2), rgba(0,245,212,0.1))',
          border: '1px solid rgba(79,110,247,0.3)', borderRadius: 'var(--radius-xl)',
          padding: '14px 20px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Potential monthly savings</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent-green)' }}>
            ₹{suggestions.filter(s => s.status !== 'dismissed').reduce((a, s) => a + parseInt(s.saving.replace(/[^0-9]/g,'')), 0)}
          </p>
        </div>
      </div>

      {totalSaving > 0 && (
        <div style={{
          background: 'rgba(57,217,138,0.1)', border: '1px solid rgba(57,217,138,0.3)',
          borderRadius: 'var(--radius-xl)', padding: '14px 20px', marginBottom: 'var(--space-lg)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <CheckCircle size={18} color='var(--accent-green)' />
          <p style={{ fontSize: 13, color: 'var(--accent-green)', fontWeight: 500 }}>
            Great! You've applied recommendations saving you ₹{totalSaving}/month so far.
          </p>
        </div>
      )}

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--space-xl)' }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: '6px 14px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
            border: `1px solid ${filter === c ? 'rgba(79,110,247,0.5)' : 'var(--border)'}`,
            background: filter === c ? 'rgba(79,110,247,0.2)' : 'var(--bg-card)',
            color: filter === c ? 'var(--accent-blue)' : 'var(--text-muted)',
            fontSize: 12, fontWeight: filter === c ? 600 : 400, transition: 'all 0.2s',
          }}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {shown.map(s => <SuggestionCard key={s.id} s={s} onApply={apply} onDismiss={dismiss} />)}
      </div>
    </div>
  );
}

export default AISuggestions;
