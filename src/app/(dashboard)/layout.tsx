import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from '@/components/layout/dashboard-client'
import { ErrorBoundary } from '@/components/error-boundary'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <ErrorBoundary>
      <DashboardClient>{children}</DashboardClient>
    </ErrorBoundary>
  )
}
