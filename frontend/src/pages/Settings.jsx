import { useState } from 'react';
import { User, Wifi, Bell, Shield, Cloud, ChevronRight, Check, AlertTriangle, Download, Lock, Trash2 } from 'lucide-react';
import Modal from '../components/Modal.jsx';
import { useApp } from '../context/AppContext.jsx';
import '../assets/styles/shared.css';
import '../components/Modal.css';

/* ── Toggle Switch ───────────────────────── */
function ToggleSwitch({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width: 48, height: 26, borderRadius: 999,
      background: value ? 'var(--accent-blue)' : 'var(--bg-elevated)',
      border: `1px solid ${value ? 'var(--accent-blue)' : 'var(--border)'}`,
      position: 'relative', cursor: 'pointer',
      transition: 'all 0.25s', boxShadow: value ? 'var(--glow-blue)' : 'none',
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3, left: value ? 26 : 4,
        transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
      }} />
    </div>
  );
}

/* ── Setting Row ─────────────────────────── */
function SettingRow({ label, desc, value, onChange, type = 'toggle', onClick }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '15px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</p>
        {desc && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</p>}
      </div>
      {type === 'toggle' && <ToggleSwitch value={value} onChange={onChange} />}
      {type === 'arrow'  && (
        <button onClick={onClick} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ChevronRight size={18} />
        </button>
      )}
      {type === 'button' && (
        <button onClick={onClick} className='btn btn-secondary' style={{ fontSize: 12, padding: '7px 14px' }}>
          {label === 'Export Data' ? <><Download size={13} /> Export</> : label}
        </button>
      )}
    </div>
  );
}

/* ── Section Card ────────────────────────── */
function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className='chart-card' style={{ marginBottom: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-md)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-md)' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 'var(--radius-sm)',
          background: 'rgba(79,110,247,0.15)', border: '1px solid rgba(79,110,247,0.3)',
          display: 'grid', placeItems: 'center',
        }}>
          <Icon size={16} color='var(--accent-blue)' />
        </div>
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</p>
      </div>
      {children}
    </div>
  );
}

/* ── Export CSV ──────────────────────────── */
function exportCSV(devices) {
  const headers = ['Device Name', 'Room', 'Status', 'Energy Today (kWh)', 'Wattage (W)', 'Connected'];
  const rows = devices.map(d => [d.deviceName, d.roomName, d.isOn ? 'ON' : 'OFF', d.energyConsumed, d.wattage, d.isConnected]);
  const csv  = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), {
    href: url,
    download: `energyeye_${new Date().toISOString().split('T')[0]}.csv`,
  });
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Main Settings ───────────────────────── */
function Settings() {
  const { state, dispatch, addToast } = useApp();
  const { user, settings } = state;

  // Modals
  const [profileOpen, setProfileOpen]   = useState(false);
  const [pwOpen,      setPwOpen]        = useState(false);
  const [deleteOpen,  setDeleteOpen]    = useState(false);

  // Profile form
  const [profileForm, setProfileForm]   = useState({ ...user });
  const [profileErr,  setProfileErr]    = useState({});

  // Password form
  const [pwForm, setPwForm]             = useState({ current: '', newPw: '', confirm: '' });
  const [pwErr,  setPwErr]              = useState({});

  // AWS service mock connect
  const [aws, setAws] = useState({ ...settings.aws });

  const setNotif = (k, v) => {
    const notifs = { ...settings.notifs, [k]: v };
    dispatch({ type: 'UPDATE_SETTINGS', settings: { notifs } });
  };
  const setPref = (k, v) => {
    const prefs = { ...settings.prefs, [k]: v };
    dispatch({ type: 'UPDATE_SETTINGS', settings: { prefs } });
  };

  /* Profile save */
  const saveProfile = () => {
    const e = {};
    if (!profileForm.name.trim())  e.name  = 'Required';
    if (!profileForm.email.trim()) e.email = 'Required';
    if (!/\S+@\S+\.\S+/.test(profileForm.email)) e.email = 'Invalid email';
    setProfileErr(e);
    if (Object.keys(e).length) return;
    dispatch({ type: 'UPDATE_USER', user: profileForm });
    addToast('Profile updated!', 'success');
    setProfileOpen(false);
  };

  /* Password save (mock) */
  const savePw = () => {
    const e = {};
    if (!pwForm.current)         e.current = 'Required';
    if (pwForm.newPw.length < 8) e.newPw   = 'Min 8 characters';
    if (pwForm.newPw !== pwForm.confirm) e.confirm = 'Passwords do not match';
    setPwErr(e);
    if (Object.keys(e).length) return;
    addToast('Password changed successfully!', 'success');
    setPwOpen(false);
    setPwForm({ current: '', newPw: '', confirm: '' });
  };

  /* AWS connect mock */
  const handleAWSConnect = (svc) => {
    setAws(a => ({ ...a, [svc]: true }));
    dispatch({ type: 'UPDATE_SETTINGS', settings: { aws: { ...aws, [svc]: true } } });
    addToast(`${svc} connected!`, 'success');
  };

  const awsServices = [
    { key: 'iotCore',  name: 'AWS IoT Core'      },
    { key: 'dynamoDB', name: 'Amazon DynamoDB'    },
    { key: 'lambda',   name: 'AWS Lambda'         },
    { key: 'sns',      name: 'Amazon SNS'         },
    { key: 'bedrock',  name: 'Amazon Bedrock AI'  },
  ];

  return (
    <div className='page-container'>
      <div className='page-header'>
        <div>
          <h1 className='page-title'>Settings</h1>
          <p className='page-subtitle'>Manage your account, preferences and AWS integration.</p>
        </div>
      </div>

      {/* Profile */}
      <SectionCard title='User Profile' icon={User}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
          <div style={{
            width: 68, height: 68, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(0,245,212,0.2), rgba(79,110,247,0.2))',
            border: '2px solid rgba(0,245,212,0.4)',
            display: 'grid', placeItems: 'center', fontSize: 28, flexShrink: 0,
          }}>👤</div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{user.email}</p>
            <p style={{ fontSize: 12, color: 'var(--accent-cyan)', marginTop: 4 }}>{user.plan} · {user.location}</p>
          </div>
          <button onClick={() => { setProfileForm({ ...user }); setProfileOpen(true); }}
            className='btn btn-secondary' style={{ marginLeft: 'auto' }}>
            Edit Profile
          </button>
        </div>
        <SettingRow label='Change Password' desc='Last changed 3 months ago' type='arrow' onClick={() => { setPwForm({ current:'',newPw:'',confirm:'' }); setPwOpen(true); }} />
        <SettingRow label='Linked Devices'  desc={`${state.devices.length} IoT devices registered`} type='arrow' onClick={() => addToast('Manage devices on the Devices page', 'info')} />
      </SectionCard>

      {/* AWS Integration */}
      <SectionCard title='AWS Integration' icon={Cloud}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 'var(--space-md)' }}>
          {awsServices.map(svc => (
            <div key={svc.key} style={{
              background: 'var(--bg-elevated)',
              border: `1px solid ${aws[svc.key] ? 'rgba(57,217,138,0.25)' : 'rgba(255,107,107,0.25)'}`,
              borderRadius: 'var(--radius-md)', padding: '12px 14px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{svc.name}</p>
                <p style={{ fontSize: 11, color: aws[svc.key] ? 'var(--accent-green)' : 'var(--danger)' }}>
                  {aws[svc.key] ? 'Connected' : 'Disconnected'}
                </p>
              </div>
              {aws[svc.key]
                ? <Check size={14} color='var(--accent-green)' />
                : (
                  <button onClick={() => handleAWSConnect(svc.key)}
                    style={{ fontSize: 11, background: 'rgba(79,110,247,0.2)', border: '1px solid rgba(79,110,247,0.4)',
                    borderRadius: 999, color: 'var(--accent-blue)', padding: '3px 10px', cursor: 'pointer', fontWeight: 600 }}>
                    Connect
                  </button>
                )
              }
            </div>
          ))}
        </div>
        <SettingRow label='Auto-sync to DynamoDB'  desc='Push live IoT data to AWS'        type='toggle' value={settings.prefs.awsSynced}   onChange={v => setPref('awsSynced', v)} />
        <SettingRow label='AI Insights (Bedrock)'  desc='Enable Amazon Bedrock AI analysis' type='toggle' value={settings.prefs.aiInsights}  onChange={v => setPref('aiInsights', v)} />
      </SectionCard>

      {/* Notifications */}
      <SectionCard title='Notifications' icon={Bell}>
        <SettingRow label='Peak Hour Alerts'  desc='Alert when entering high-demand periods' type='toggle' value={settings.notifs.peakAlert}    onChange={v => setNotif('peakAlert', v)} />
        <SettingRow label='Weekly Reports'    desc='Email digest every Monday'               type='toggle' value={settings.notifs.weeklyReport}  onChange={v => setNotif('weeklyReport', v)} />
        <SettingRow label='Goal Achieved'     desc='Celebrate when targets are hit'          type='toggle' value={settings.notifs.goalAchieved}  onChange={v => setNotif('goalAchieved', v)} />
        <SettingRow label='Anomaly Detection' desc='Alert on unusual usage spikes'           type='toggle' value={settings.notifs.anomaly}       onChange={v => setNotif('anomaly', v)} />
      </SectionCard>

      {/* Data & Privacy */}
      <SectionCard title='Data & Privacy' icon={Shield}>
        <SettingRow label='Export Data'    desc='Download all device data as CSV' type='arrow'
          onClick={() => { exportCSV(state.devices); addToast('Data exported as CSV!', 'success'); }} />
        <SettingRow label='Clear Local Cache' desc='Reset all locally stored settings' type='arrow'
          onClick={() => { if (window.confirm('Clear all local data?')) { localStorage.removeItem('ee_state'); addToast('Cache cleared. Reloading...', 'warn'); setTimeout(() => window.location.reload(), 1500); } }} />
        <SettingRow label='Delete Account'   desc='Permanently remove all data' type='arrow'
          onClick={() => setDeleteOpen(true)} />
      </SectionCard>

      <p style={{ fontSize: 12, color: 'var(--text-disabled)', textAlign: 'center', padding: '16px 0' }}>
        EnergyEye v1.0.0 · Powered by AWS · Built for a greener planet 🌿
      </p>

      {/* Edit Profile Modal */}
      <Modal isOpen={profileOpen} onClose={() => setProfileOpen(false)} title='Edit Profile' size='md'
        footer={
          <>
            <button className='btn btn-secondary' onClick={() => setProfileOpen(false)}>Cancel</button>
            <button className='btn btn-primary'   onClick={saveProfile}>Save Changes</button>
          </>
        }
      >
        <div className='form-group'>
          <label className='form-label'>Full Name</label>
          <input className='form-input' value={profileForm.name}
            onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} />
          {profileErr.name && <p className='form-error'>{profileErr.name}</p>}
        </div>
        <div className='form-group'>
          <label className='form-label'>Email</label>
          <input type='email' className='form-input' value={profileForm.email}
            onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} />
          {profileErr.email && <p className='form-error'>{profileErr.email}</p>}
        </div>
        <div className='form-group'>
          <label className='form-label'>Location</label>
          <input className='form-input' value={profileForm.location}
            onChange={e => setProfileForm(f => ({ ...f, location: e.target.value }))} />
        </div>
        <div className='form-group'>
          <label className='form-label'>Plan</label>
          <select className='form-select' value={profileForm.plan}
            onChange={e => setProfileForm(f => ({ ...f, plan: e.target.value }))}>
            {['Home Plan', 'Business Plan', 'Enterprise Plan'].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={pwOpen} onClose={() => setPwOpen(false)} title='Change Password' size='sm'
        footer={
          <>
            <button className='btn btn-secondary' onClick={() => setPwOpen(false)}>Cancel</button>
            <button className='btn btn-primary'   onClick={savePw}>Update Password</button>
          </>
        }
      >
        {[
          { key: 'current', label: 'Current Password', placeholder: '••••••••' },
          { key: 'newPw',   label: 'New Password',     placeholder: 'Min 8 characters' },
          { key: 'confirm', label: 'Confirm Password', placeholder: 'Repeat new password' },
        ].map(({ key, label, placeholder }) => (
          <div key={key} className='form-group'>
            <label className='form-label'>{label}</label>
            <input type='password' className='form-input' placeholder={placeholder}
              value={pwForm[key]} onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))} />
            {pwErr[key] && <p className='form-error'>{pwErr[key]}</p>}
          </div>
        ))}
      </Modal>

      {/* Delete Account Modal */}
      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title='Delete Account' size='sm'
        footer={
          <>
            <button className='btn btn-secondary' onClick={() => setDeleteOpen(false)}>Cancel</button>
            <button className='btn btn-danger' onClick={() => { addToast('Account deletion requires backend — coming in Phase 2', 'warn'); setDeleteOpen(false); }}>
              <Trash2 size={14} /> Request Deletion
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
          <AlertTriangle size={20} color='var(--danger)' style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            This will permanently delete your account and all associated data including devices, goals, and energy readings. This action <strong style={{ color: 'var(--danger)' }}>cannot be undone</strong>.
          </p>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Full account deletion will be available in Phase 2 after backend integration.
        </p>
      </Modal>
    </div>
  );
}

export default Settings;
