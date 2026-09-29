interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  icon?: string
  trend?: number
  color?: 'primary' | 'success' | 'warning' | 'error'
}

export function StatCard({ title, value, unit, icon, trend, color = 'primary' }: StatCardProps) {
  const colorMap = {
    primary: 'text-accent-primary',
    success: 'text-status-success',
    warning: 'text-status-warning',
    error: 'text-status-error',
  }

  return (
    <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 border border-light-border dark:border-dark-border hover:shadow-lg transition-all duration-200 hover:scale-105 animate-fadeIn">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-light-muted dark:text-dark-muted text-sm mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${colorMap[color]}`}>
              {value}
            </span>
            {unit && <span className="text-light-muted dark:text-dark-muted">{unit}</span>}
          </div>
          {trend !== undefined && (
            <p className={`text-xs mt-2 ${trend >= 0 ? 'text-status-success' : 'text-status-error'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {icon && <span className="text-4xl opacity-50">{icon}</span>}
      </div>
    </div>
  )
}
