import { TaskList } from '@/components/tasks/task-list'
import { AsyncErrorBoundary } from '@/components/error-boundary'

export default function InboxPage() {
  return (
    <AsyncErrorBoundary>
      <TaskList />
    </AsyncErrorBoundary>
  )
}
