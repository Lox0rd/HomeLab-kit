interface AchievementProgressProps {
  completed: number
  total: number
  size?: 'sm' | 'md' | 'lg'
}

export function AchievementProgress({ completed, total, size = 'md' }: AchievementProgressProps) {
  const percentage = (completed / total) * 100
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
  }

  const textSizeMap = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  }

  return (
    <div className={`flex items-center justify-center ${sizeMap[size]} animate-scaleIn`}>
      <div className="relative w-full h-full">
        <svg className="transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-light-border dark:text-dark-border"
          />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-accent-primary transition-all duration-500"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${textSizeMap[size]} text-light-text dark:text-dark-text`}>
            {completed}
          </span>
          <span className="text-xs text-light-muted dark:text-dark-muted">
            / {total}
          </span>
        </div>
      </div>
    </div>
  )
}
