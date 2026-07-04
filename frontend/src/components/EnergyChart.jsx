import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='chart-tooltip'>
        <p className='chart-tooltip__label'>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: <strong>{p.value} {p.unit || 'kWh'}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function EnergyAreaChart({ data, dataKey = 'usage', color = '#4f6ef7' }) {
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${dataKey}`} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%'  stopColor={color} stopOpacity={0.3} />
            <stop offset='95%' stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.05)' />
        <XAxis dataKey='time' tick={{ fill: '#7a7f9a', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#7a7f9a', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type='monotone'
          dataKey={dataKey}
          name='Usage'
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#grad-${dataKey})`}
          dot={false}
          activeDot={{ r: 5, fill: color, stroke: '#0b0c10', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function EnergyBarChart({ data }) {
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id='barGrad' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%'   stopColor='#4f6ef7' stopOpacity={1} />
            <stop offset='100%' stopColor='#00f5d4' stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.05)' />
        <XAxis dataKey='room' tick={{ fill: '#7a7f9a', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#7a7f9a', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey='usage' name='Usage' fill='url(#barGrad)' radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MultiLineChart({ data }) {
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id='grad-solar' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#f7a23e' stopOpacity={0.25} />
            <stop offset='95%' stopColor='#f7a23e' stopOpacity={0} />
          </linearGradient>
          <linearGradient id='grad-grid' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#4f6ef7' stopOpacity={0.25} />
            <stop offset='95%' stopColor='#4f6ef7' stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.05)' />
        <XAxis dataKey='time' tick={{ fill: '#7a7f9a', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#7a7f9a', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: '#adb3cc', fontSize: 13, paddingTop: 8 }} />
        <Area type='monotone' dataKey='solar' name='Solar' stroke='#f7a23e' strokeWidth={2} fill='url(#grad-solar)' dot={false} />
        <Area type='monotone' dataKey='grid'  name='Grid'  stroke='#4f6ef7' strokeWidth={2} fill='url(#grad-grid)'  dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
