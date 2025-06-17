export type DeviceType = 'desktop' | 'mobile' | 'tablet'
export type InputMethod = 'mouse' | 'touch' | 'keyboard'
export type NetworkStatus = 'online' | 'offline' | 'slow'

export interface DeviceContext {
  type: DeviceType
  screenSize: {
    width: number
    height: number
  }
  inputMethod: InputMethod
  networkStatus: NetworkStatus
  isPortrait: boolean
  hasNotificationPermission: boolean
}

export class DeviceDetector {
  private mediaQueries = {
    mobile: '(max-width: 640px)',
    tablet: '(min-width: 641px) and (max-width: 1024px)',
    desktop: '(min-width: 1025px)'
  }

  getDeviceType(): DeviceType {
    if (typeof window === 'undefined') return 'desktop'
    
    if (window.matchMedia(this.mediaQueries.mobile).matches) return 'mobile'
    if (window.matchMedia(this.mediaQueries.tablet).matches) return 'tablet'
    return 'desktop'
  }

  getScreenSize(): { width: number; height: number } {
    if (typeof window === 'undefined') {
      return { width: 1920, height: 1080 }
    }
    
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  getInputMethod(): InputMethod {
    if (typeof window === 'undefined') return 'mouse'
    
    // Check for touch capability
    const hasTouch = 'ontouchstart' in window || 
                    navigator.maxTouchPoints > 0 ||
                    (navigator as any).msMaxTouchPoints > 0
    
    // Check if mouse is being used
    const hasMouse = window.matchMedia('(hover: hover)').matches
    
    if (hasTouch && !hasMouse) return 'touch'
    if (hasMouse) return 'mouse'
    return 'keyboard'
  }

  async getNetworkStatus(): Promise<NetworkStatus> {
    if (typeof navigator === 'undefined' || !navigator.onLine) {
      return 'offline'
    }
    
    // Check connection speed if available
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection
    
    if (connection) {
      // Check effective type
      if (connection.effectiveType === 'slow-2g' || 
          connection.effectiveType === '2g') {
        return 'slow'
      }
      
      // Check downlink speed (in Mbps)
      if (connection.downlink && connection.downlink < 1) {
        return 'slow'
      }
    }
    
    // Perform a simple speed test
    try {
      const start = Date.now()
      await fetch('/api/ping', { 
        method: 'HEAD',
        cache: 'no-cache'
      })
      const duration = Date.now() - start
      
      if (duration > 1000) return 'slow'
    } catch (error) {
      // Ignore errors, assume online
    }
    
    return 'online'
  }

  isPortrait(): boolean {
    if (typeof window === 'undefined') return false
    return window.innerHeight > window.innerWidth
  }

  async hasNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false
    }
    
    return Notification.permission === 'granted'
  }

  async getCurrentContext(): Promise<DeviceContext> {
    return {
      type: this.getDeviceType(),
      screenSize: this.getScreenSize(),
      inputMethod: this.getInputMethod(),
      networkStatus: await this.getNetworkStatus(),
      isPortrait: this.isPortrait(),
      hasNotificationPermission: await this.hasNotificationPermission()
    }
  }

  // Get task recommendations based on device context
  getDeviceRecommendations(context: DeviceContext): {
    maxTasksToShow: number
    enableDragDrop: boolean
    enableKeyboardShortcuts: boolean
    showDetailedViews: boolean
    enableAnimations: boolean
  } {
    const recommendations = {
      maxTasksToShow: 50,
      enableDragDrop: true,
      enableKeyboardShortcuts: true,
      showDetailedViews: true,
      enableAnimations: true
    }
    
    // Adjust for device type
    if (context.type === 'mobile') {
      recommendations.maxTasksToShow = 20
      recommendations.enableDragDrop = false
      recommendations.enableKeyboardShortcuts = false
      recommendations.showDetailedViews = false
    } else if (context.type === 'tablet') {
      recommendations.maxTasksToShow = 30
      recommendations.showDetailedViews = !context.isPortrait
    }
    
    // Adjust for network
    if (context.networkStatus === 'slow' || context.networkStatus === 'offline') {
      recommendations.enableAnimations = false
      recommendations.maxTasksToShow = Math.min(recommendations.maxTasksToShow, 25)
    }
    
    // Adjust for input method
    if (context.inputMethod === 'touch') {
      recommendations.enableKeyboardShortcuts = false
    }
    
    return recommendations
  }
}