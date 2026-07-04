import { useState } from 'react';
import { User, Wifi, Bell, Shield, Cloud, Moon, ChevronRight, Check, AlertTriangle } from 'lucide-react';
import '../assets/styles/shared.css';

function ToggleSwitch({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 48, height: 26, borderRadius: 999,
        background: value ? 'var(--accent-blue)' : 'var(--bg-elevated)',
        border: `1px solid ${value ? 'var(--accent-blue)' : 'var(--border)'}`,
        position: 'relative', cursor: 'pointer',
        transition: 'all 0.25s', boxShadow: value ? 'var(--glow-blue)' : 'none',
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3, left: value ? 26 : 4,
        transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
      }} />
    </div>
  );
}

function SettingRow({ label, desc, value, onChange, type = 'toggle' }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</p>
        {desc && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</p>}
      </div>
      {type === 'toggle' && <ToggleSwitch value={value} onChange={onChange} />}
      {type === 'arrow'  && (
        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}

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

function Settings() {
  const [notifs, setNotifs] = useState({ peakAlert: true, weeklyReport: true, goalAchieved: false, anomaly: true });
  const [prefs, setPrefs]   = useState({ darkMode: true, awsSynced: true, aiInsights: true });

  const awsServices = [
    { name: 'AWS IoT Core',      status: 'Connected',    ok: true },
    { name: 'Amazon DynamoDB',   status: 'Active',        ok: true },
    { name: 'AWS Lambda',        status: 'Running',       ok: true },
    { name: 'Amazon SNS',        status: 'Configured',    ok: true },
    { name: 'Amazon Bedrock AI', status: 'Disconnected',  ok: false },
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
            display: 'grid', placeItems: 'center', fontSize: 26, flexShrink: 0,
          }}>👤</div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Amit Kumar</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>amit.kumar@gmail.com</p>
            <p style={{ fontSize: 12, color: 'var(--accent-cyan)', marginTop: 4 }}>Home Plan · Mumbai, India</p>
          </div>
          <button style={{
            marginLeft: 'auto', padding: '8px 18px', borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border)', background: 'var(--bg-elevated)',
            color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer',
          }}>Edit Profile</button>
        </div>
        <SettingRow label='Change Password' desc='Last changed 3 months ago' type='arrow' />
        <SettingRow label='Linked Devices' desc='12 IoT devices registered' type='arrow' />
      </SectionCard>

      {/* AWS Integration */}
      <SectionCard title='AWS Integration' icon={Cloud}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 'var(--space-md)' }}>
          {awsServices.map(svc => (
            <div key={svc.name} style={{
              background: 'var(--bg-elevated)', border: `1px solid ${svc.ok ? 'rgba(57,217,138,0.2)' : 'rgba(255,107,107,0.2)'}`,
              borderRadius: 'var(--radius-md)', padding: '12px 14px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{svc.name}</p>
                <p style={{ fontSize: 11, color: svc.ok ? 'var(--accent-green)' : 'var(--danger)' }}>{svc.status}</p>
              </div>
              {svc.ok
                ? <Check size={14} color='var(--accent-green)' />
                : <AlertTriangle size={14} color='var(--danger)' />
              }
            </div>
          ))}
        </div>
        <SettingRow label='Auto-sync to DynamoDB'   desc='Push live IoT data to AWS'    value={prefs.awsSynced}  onChange={v => setPrefs(p => ({...p, awsSynced: v}))} />
        <SettingRow label='AI Insights (Bedrock)'    desc='Enable Amazon Bedrock AI analysis' value={prefs.aiInsights} onChange={v => setPrefs(p => ({...p, aiInsights: v}))} />
      </SectionCard>

      {/* Notifications */}
      <SectionCard title='Notifications' icon={Bell}>
        <SettingRow label='Peak Hour Alerts'  desc='Notify when entering high-demand periods' value={notifs.peakAlert}     onChange={v => setNotifs(p => ({...p, peakAlert: v}))} />
        <SettingRow label='Weekly Reports'    desc='Email summary every Monday'                value={notifs.weeklyReport}  onChange={v => setNotifs(p => ({...p, weeklyReport: v}))} />
        <SettingRow label='Goal Achieved'     desc='Celebrate when targets are hit'            value={notifs.goalAchieved}  onChange={v => setNotifs(p => ({...p, goalAchieved: v}))} />
        <SettingRow label='Anomaly Detection' desc='Alert on unusual usage spikes'             value={notifs.anomaly}       onChange={v => setNotifs(p => ({...p, anomaly: v}))} />
      </SectionCard>

      {/* Preferences */}
      <SectionCard title='Preferences' icon={Shield}>
        <SettingRow label='Dark Mode'        desc='Always on — optimal for energy dashboards' value={prefs.darkMode} onChange={() => {}} />
        <SettingRow label='Data Privacy'     desc='Manage how your data is stored and shared' type='arrow' />
        <SettingRow label='Export Data'      desc='Download your usage history as CSV'        type='arrow' />
        <SettingRow label='Delete Account'   desc='Permanently remove all data'               type='arrow' />
      </SectionCard>

      <p style={{ fontSize: 12, color: 'var(--text-disabled)', textAlign: 'center', padding: '16px 0' }}>
        EnergyEye v1.0.0 · Powered by AWS · Built with ❤️ for a greener planet
      </p>
    </div>
  );
}

export default Settings;
