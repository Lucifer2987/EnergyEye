import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

function CarbonMeter({ value = 0, max = 100, unit = 'kg CO₂', label = 'Carbon Saved' }) {
  const percentage = Math.min((value / max) * 100, 100);
  const data = [
    { name: 'bg',   value: 100,        fill: 'rgba(255,255,255,0.05)' },
    { name: 'fill', value: percentage, fill: 'url(#carbonGrad)' },
  ];

  const getColor = () => {
    if (percentage >= 70) return '#39d98a';
    if (percentage >= 40) return '#f7a23e';
    return '#ff6b6b';
  };

  return (
    <div className='carbon-meter'>
      <div className='carbon-meter__chart'>
        <ResponsiveContainer width='100%' height='100%'>
          <RadialBarChart
            cx='50%' cy='50%'
            innerRadius='65%' outerRadius='90%'
            startAngle={225} endAngle={-45}
            data={data}
            barSize={14}
          >
            <defs>
              <linearGradient id='carbonGrad' x1='0' y1='0' x2='1' y2='0'>
                <stop offset='0%'   stopColor='#39d98a' />
                <stop offset='100%' stopColor='#00f5d4' />
              </linearGradient>
            </defs>
            <RadialBar dataKey='value' cornerRadius={8} background={false} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className='carbon-meter__center'>
          <span className='carbon-meter__value' style={{ color: getColor() }}>{value}</span>
          <span className='carbon-meter__unit'>{unit}</span>
        </div>
      </div>
      <p className='carbon-meter__label'>{label}</p>
      <div className='carbon-meter__bar-wrap'>
        <div className='carbon-meter__bar'>
          <div className='carbon-meter__bar-fill' style={{ width: `${percentage}%`, background: getColor() }} />
        </div>
        <span className='carbon-meter__pct'>{Math.round(percentage)}% of goal</span>
      </div>
    </div>
  );
}

export default CarbonMeter;
