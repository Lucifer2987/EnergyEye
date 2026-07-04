function StatCard({ title, value, unit, icon: Icon, color = 'blue', trend, trendLabel, subtitle }) {
  const colorMap = {
    blue:   { accent: 'var(--accent-blue)',  glow: 'var(--accent-blue-glow)' },
    cyan:   { accent: 'var(--accent-cyan)',  glow: 'var(--accent-cyan-glow)' },
    green:  { accent: 'var(--accent-green)', glow: 'var(--accent-green-glow)' },
    orange: { accent: 'var(--accent-orange)', glow: 'rgba(247,162,62,0.3)' },
    purple: { accent: 'var(--accent-purple)', glow: 'rgba(167,139,250,0.3)' },
    danger: { accent: 'var(--danger)',        glow: 'var(--danger-glow)' },
  };
  const { accent, glow } = colorMap[color] || colorMap.blue;
  const trendUp = trend > 0;

  return (
    <div className='stat-card' style={{ '--accent': accent, '--glow': glow }}>
      <div className='stat-card__top'>
        <div className='stat-card__icon-wrap'>
          {Icon && <Icon size={20} color={accent} />}
        </div>
        {trend !== undefined && (
          <span className={`stat-card__trend ${trendUp ? 'up' : 'down'}`}>
            {trendUp ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className='stat-card__body'>
        <div className='stat-card__value-row'>
          <span className='stat-card__value'>{value}</span>
          {unit && <span className='stat-card__unit'>{unit}</span>}
        </div>
        <span className='stat-card__title'>{title}</span>
        {subtitle && <span className='stat-card__subtitle'>{subtitle}</span>}
        {trendLabel && <span className='stat-card__trend-label'>{trendLabel}</span>}
      </div>
      <div className='stat-card__glow' />
    </div>
  );
}

export default StatCard;
