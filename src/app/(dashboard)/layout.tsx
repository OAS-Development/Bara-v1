import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { MainContent } from '@/components/layout/main-content'
import { Inspector } from '@/components/layout/inspector'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar - 240px */}
      <aside className="w-60 border-r border-gray-800 flex-shrink-0">
        <Sidebar />
      </aside>
      
      {/* Main Content - Flexible */}
      <main className="flex-1 flex flex-col min-w-0">
        <MainContent>{children}</MainContent>
      </main>
      
      {/* Inspector - 320px, collapsible */}
      <aside className="w-80 border-l border-gray-800 flex-shrink-0">
        <Inspector />
      </aside>
    </div>
  )
}