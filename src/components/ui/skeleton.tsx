import { cn } from '@/lib/utils'
import { skeleton as skeletonStyles } from '@/lib/animations'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'heading' | 'button' | 'avatar' | 'custom'
}

export function Skeleton({
  className,
  variant = 'custom',
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        skeletonStyles.base,
        variant !== 'custom' && skeletonStyles[variant],
        className
      )}
      {...props}
    />
  )
}

export function TaskListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-800">
          <Skeleton className="h-5 w-5 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProjectListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-4 rounded-lg border border-gray-800">
          <Skeleton variant="heading" className="mb-2" />
          <Skeleton variant="text" className="mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-12 rounded" />
            <Skeleton className="h-6 w-16 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}