'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Shield, Lock, Activity } from 'lucide-react'
import { format } from 'date-fns'

interface SecurityEvent {
  type: string
  attemptedUserId?: string
  attemptedEmail?: string
  ip?: string
  userAgent?: string
  path?: string
  timestamp: Date
}

export default function SecurityDashboard() {
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSecurityEvents()
    // Refresh every 30 seconds
    const interval = setInterval(fetchSecurityEvents, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchSecurityEvents = async () => {
    try {
      const response = await fetch('/api/admin/security/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Failed to fetch security events:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearEvents = async () => {
    try {
      await fetch('/api/admin/security/events', { method: 'DELETE' })
      setEvents([])
    } catch (error) {
      console.error('Failed to clear events:', error)
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'UNAUTHORIZED_ACCESS':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'FAILED_LOGIN':
        return <Lock className="h-4 w-4 text-yellow-500" />
      case 'LOCKOUT':
        return <Shield className="h-4 w-4 text-orange-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'UNAUTHORIZED_ACCESS':
        return 'bg-red-50 border-red-200'
      case 'FAILED_LOGIN':
        return 'bg-yellow-50 border-yellow-200'
      case 'LOCKOUT':
        return 'bg-orange-50 border-orange-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Security Dashboard</h1>
        <p className="text-gray-600">Monitor access attempts and security events</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter((e) => e.type === 'FAILED_LOGIN').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unauthorized Access</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter((e) => e.type === 'UNAUTHORIZED_ACCESS').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Security Events</CardTitle>
              <CardDescription>Recent security events and access attempts</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearEvents}>
              Clear Events
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No security events recorded</p>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((event, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getEventColor(event.type)}`}>
                  <div className="flex items-start gap-3">
                    {getEventIcon(event.type)}
                    <div className="flex-1">
                      <div className="font-medium">{event.type.replace(/_/g, ' ')}</div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {event.attemptedEmail && <div>Email: {event.attemptedEmail}</div>}
                        {event.path && <div>Path: {event.path}</div>}
                        {event.ip && <div>IP: {event.ip}</div>}
                        <div>{format(new Date(event.timestamp), 'MMM d, yyyy HH:mm:ss')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
