'use client'

import {
  Home,
  Calendar,
  Flag,
  Archive,
  Tag,
  FolderOpen,
  CheckCircle,
  Heart,
  Activity,
  DollarSign,
  Target,
  Lock
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const perspectives = [
  { name: 'Inbox', href: '/inbox', icon: Home },
  { name: 'Today', href: '/today', icon: Calendar },
  { name: 'Upcoming', href: '/upcoming', icon: Calendar },
  { name: 'Anytime', href: '/anytime', icon: Archive },
  { name: 'Someday', href: '/someday', icon: Flag }
]

const organize = [
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Tags', href: '/tags', icon: Tag },
  { name: 'Review', href: '/review', icon: CheckCircle }
]

const life = [
  { name: 'Life Dashboard', href: '/life', icon: Heart },
  { name: 'Health', href: '/life/health', icon: Activity },
  { name: 'Finance', href: '/life/finance', icon: DollarSign },
  { name: 'Goals', href: '/life/goals', icon: Target },
  { name: 'Journal', href: '/life/journal', icon: Lock }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* App Title */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold">Bara</h1>
      </div>

      {/* Perspectives */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <h2 className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">Perspectives</h2>
          <nav className="space-y-1">
            {perspectives.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm',
                    pathname === item.href
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Organize */}
        <div className="p-2 mt-4">
          <h2 className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">Organize</h2>
          <nav className="space-y-1">
            {organize.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm',
                    pathname === item.href
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Life */}
        <div className="p-2 mt-4">
          <h2 className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">Life</h2>
          <nav className="space-y-1">
            {life.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm',
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* User Menu */}
      <div className="p-4 border-t border-gray-800">
        <button className="text-sm text-gray-400 hover:text-gray-200">Settings</button>
      </div>
    </div>
  )
}
