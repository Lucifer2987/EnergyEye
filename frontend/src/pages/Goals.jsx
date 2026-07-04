import { useState } from 'react';
import { Zap, DollarSign, Leaf, Flame, Target, Sun, Battery, Home, Plus, Edit2, Trash2, Check } from 'lucide-react';
import Modal from '../components/Modal.jsx';
import { useApp } from '../context/AppContext.jsx';
import '../assets/styles/shared.css';
import '../components/Modal.css';

/* ── Icon & Color mappings ─────────────────── */
const ICON_MAP = { Zap, DollarSign, Leaf, Flame, Target, Sun, Battery, Home };
const ICON_OPTIONS = [
  { name: 'Zap',         label: '⚡ Energy'  },
  { name: 'DollarSign',  label: '💰 Cost'    },
  { name: 'Leaf',        label: '🌿 CO₂'     },
  { name: 'Flame',       label: '🔥 Peak'    },
  { name: 'Target',      label: '🎯 Target'  },
  { name: 'Sun',         label: '☀️ Solar'   },
  { name: 'Battery',     label: '🔋 Battery' },
  { name: 'Home',        label: '🏠 Home'    },
];
const COLOR_OPTIONS = ['#4f6ef7','#f7a23e','#39d98a','#a78bfa','#ff6b6b','#00f5d4','#f9a8d4','#fde68a'];
const UNIT_OPTIONS  = ['kWh', '₹', 'kg', 'days', '%', 'W', 'L'];
const EMPTY_GOAL    = { iconName: 'Zap', label: '', target: '', current: '', unit: 'kWh', color: '#4f6ef7' };

/* ── Calendar heatmap ───────────────────────── */
const CAL_DAYS = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    usage: [14.2,18.6,22.1,19.8,16.3,20.5,25.7,23.4,17.8,21.9,
            24.3,18.1,15.6,22.8,20.4,19.7,23.5,26.1,21.3,18.9,
            20.2,24.7,22.6,19.3,17.5,21.8,23.9,20.1,18.4,25.3][i],
  };
});

/* ── Goal progress bar ──────────────────────── */
function GoalBar({ goal, onEdit, onDelete }) {
  const Icon = ICON_MAP[goal.iconName] || Zap;
  const pct  = Math.min((+goal.current / +goal.target) * 100, 100);
  const done = pct >= 100;

  return (
    <div className='chart-card' style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)', flexShrink: 0,
            background: `${goal.color}22`, border: `1px solid ${goal.color}44`,
            display: 'grid', placeItems: 'center',
          }}>
            <Icon size={18} color={goal.color} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{goal.label}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {goal.current} / {goal.target} {goal.unit}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {done && <Check size={16} color='var(--accent-green)' />}
          <span style={{ fontSize: 18, fontWeight: 800, color: done ? 'var(--accent-green)' : 'var(--text-primary)' }}>
            {Math.round(pct)}%
          </span>
          <button onClick={() => onEdit(goal)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDelete(goal.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 4 }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: done ? 'var(--accent-green)' : goal.color,
          borderRadius: 999, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: `0 0 12px ${goal.color}66`,
        }} />
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
        {done
          ? '✅ Goal achieved!'
          : `${+goal.target - +goal.current} ${goal.unit} remaining`}
      </p>
    </div>
  );
}

/* ── Goal Form Modal ───────────────────────── */
function GoalModal({ isOpen, onClose, initial, onSave }) {
  const [form, setForm]   = useState(initial || EMPTY_GOAL);
  const [errs, setErrs]   = useState({});

  // Reset form when opened
  useState(() => { setForm(initial || EMPTY_GOAL); setErrs({}); });

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrs(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.label.trim())                        e.label   = 'Required';
    if (!form.target || +form.target <= 0)         e.target  = 'Must be > 0';
    if (form.current === '' || +form.current < 0)  e.current = 'Must be ≥ 0';
    setErrs(e);
    return !Object.keys(e).length;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...form, target: +form.target, current: +form.current });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      title={initial?.id ? 'Edit Goal' : 'New Goal'}
      size='md'
      footer={
        <>
          <button className='btn btn-secondary' onClick={onClose}>Cancel</button>
          <button className='btn btn-primary'   onClick={handleSave}>Save Goal</button>
        </>
      }
    >
      {/* Icon selector */}
      <div className='form-group'>
        <label className='form-label'>Icon</label>
        <div className='icon-grid'>
          {ICON_OPTIONS.map(({ name, label }) => {
            const Ic = ICON_MAP[name];
            return (
              <button key={name} type='button'
                className={`icon-option ${form.iconName === name ? 'selected' : ''}`}
                onClick={() => set('iconName', name)}
              >
                <Ic size={18} />{label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Label */}
      <div className='form-group'>
        <label className='form-label'>Goal Name</label>
        <input className='form-input' placeholder='e.g. Monthly Energy Budget'
          value={form.label} onChange={e => set('label', e.target.value)} />
        {errs.label && <p className='form-error'>{errs.label}</p>}
      </div>

      {/* Target + Unit */}
      <div className='form-row'>
        <div className='form-group'>
          <label className='form-label'>Target</label>
          <input type='number' className='form-input' placeholder='300'
            value={form.target} onChange={e => set('target', e.target.value)} />
          {errs.target && <p className='form-error'>{errs.target}</p>}
        </div>
        <div className='form-group'>
          <label className='form-label'>Unit</label>
          <select className='form-select' value={form.unit} onChange={e => set('unit', e.target.value)}>
            {UNIT_OPTIONS.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* Current progress */}
      <div className='form-group'>
        <label className='form-label'>Current Progress</label>
        <input type='number' className='form-input' placeholder='0'
          value={form.current} onChange={e => set('current', e.target.value)} />
        {errs.current && <p className='form-error'>{errs.current}</p>}
      </div>

      {/* Color */}
      <div className='form-group'>
        <label className='form-label'>Color</label>
        <div className='color-swatches'>
          {COLOR_OPTIONS.map(c => (
            <div key={c} className={`color-swatch ${form.color === c ? 'selected' : ''}`}
              style={{ background: c, boxShadow: form.color === c ? `0 0 12px ${c}` : 'none' }}
              onClick={() => set('color', c)}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}

/* ── Main Goals page ──────────────────────── */
function Goals() {
  const { state, dispatch, addToast } = useApp();
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);

  const openNew  = ()    => { setEditTarget(null); setModalOpen(true); };
  const openEdit = goal  => { setEditTarget(goal);  setModalOpen(true); };

  const handleSave = (goal) => {
    if (goal.id) {
      dispatch({ type: 'UPDATE_GOAL', goal });
      addToast('Goal updated!', 'success');
    } else {
      dispatch({ type: 'ADD_GOAL', goal });
      addToast('New goal added!', 'success');
    }
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_GOAL', id });
    addToast('Goal removed', 'warn');
    setDelConfirm(null);
  };

  return (
    <div className='page-container'>
      <div className='page-header'>
        <div>
          <h1 className='page-title'>Energy Goals</h1>
          <p className='page-subtitle'>Set, track, and achieve your monthly targets.</p>
        </div>
        <button onClick={openNew} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg,#4f6ef7,#00f5d4)', border: 'none',
          borderRadius: 'var(--radius-pill)', color: '#000',
          fontWeight: 600, fontSize: 13, padding: '10px 20px',
          cursor: 'pointer', boxShadow: '0 0 20px rgba(79,110,247,0.4)',
        }}>
          <Plus size={16} /> New Goal
        </button>
      </div>

      {state.goals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <Target size={56} strokeWidth={1} style={{ opacity: 0.3, marginBottom: 16 }} />
          <p style={{ fontSize: 16 }}>No goals yet</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Click "New Goal" to set your first energy target</p>
        </div>
      ) : (
        <div className='two-col' style={{ marginBottom: 'var(--space-xl)' }}>
          {state.goals.map(g => (
            <GoalBar key={g.id} goal={g}
              onEdit={openEdit}
              onDelete={id => setDelConfirm(id)}
            />
          ))}
        </div>
      )}

      {/* 30-day heatmap */}
      <div className='chart-card'>
        <div className='chart-card__header'>
          <div>
            <p className='chart-card__title'>30-Day Usage Heatmap</p>
            <p className='chart-card__sub'>Hover over a cell to see daily kWh</p>
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {CAL_DAYS.map((d, i) => {
            const norm = (d.usage - 8) / 18;
            const hot  = d.usage > 22;
            const opacity = 0.15 + norm * 0.75;
            return (
              <div key={i} title={`${d.date}: ${d.usage} kWh`} style={{
                width: 28, height: 28, borderRadius: 6, cursor: 'default',
                background: hot ? `rgba(255,107,107,${opacity})` : `rgba(79,110,247,${opacity})`,
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'transform 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.35)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            );
          })}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {CAL_DAYS.map((d, i) => (
            <span key={i} style={{ width: 28, fontSize: 9, textAlign: 'center', color: 'var(--text-disabled)' }}>
              {d.date.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Add/Edit modal */}
      <GoalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editTarget}
        onSave={handleSave}
      />

      {/* Delete confirm modal */}
      <Modal
        isOpen={!!delConfirm}
        onClose={() => setDelConfirm(null)}
        title='Delete Goal'
        size='sm'
        footer={
          <>
            <button className='btn btn-secondary' onClick={() => setDelConfirm(null)}>Cancel</button>
            <button className='btn btn-danger'    onClick={() => handleDelete(delConfirm)}>Delete</button>
          </>
        }
      >
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Are you sure you want to delete this goal? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export default Goals;
