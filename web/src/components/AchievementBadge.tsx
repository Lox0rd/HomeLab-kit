interface AchievementBadgeProps {
  labId: string
  labTitle: string
  completedAt: string
  completionType: 'self_solved' | 'with_help'
  icon?: string
}

export function AchievementBadge({ labId, labTitle, completedAt, completionType, icon = '⭐' }: AchievementBadgeProps) {
  const date = new Date(completedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="group relative animate-slideUp">
      <div className="bg-light-surface dark:bg-dark-surface rounded-lg p-4 border border-light-border dark:border-dark-border hover:border-accent-primary transition-all duration-200 cursor-default">
        <div className="text-2xl mb-2">{icon}</div>
        <h3 className="text-sm font-semibold text-light-text dark:text-dark-text truncate">
          {labTitle}
        </h3>
        <p className="text-xs text-light-muted dark:text-dark-muted mt-1">{date}</p>
        <div className="mt-2">
          <span className={`inline-block text-xs px-2 py-1 rounded ${
            completionType === 'self_solved'
              ? 'bg-status-success/20 text-status-success'
              : 'bg-status-warning/20 text-status-warning'
          }`}>
            {completionType === 'self_solved' ? '✓ Solved' : '📖 With help'}
          </span>
        </div>
      </div>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-light-border dark:border-dark-border">
        {labId}
      </div>
    </div>
  )
}
