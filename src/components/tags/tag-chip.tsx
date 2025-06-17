'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagChipProps {
  name: string
  color?: string
  icon?: string | null
  onRemove?: () => void
  onClick?: () => void
  size?: 'sm' | 'md'
}

export function TagChip({
  name,
  color = '#6B7280',
  icon,
  onRemove,
  onClick,
  size = 'sm'
}: TagChipProps) {
  const isSmall = size === 'sm'

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full',
        isSmall ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        onClick && 'cursor-pointer hover:opacity-80',
        'transition-opacity'
      )}
      style={{ backgroundColor: `${color}20`, color }}
      onClick={onClick}
    >
      {icon && <span className="text-xs">{icon}</span>}
      <span>{name}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-0.5 hover:opacity-60"
        >
          <X className={cn(isSmall ? 'h-3 w-3' : 'h-4 w-4')} />
        </button>
      )}
    </div>
  )
}
