// Security configuration for single-user Bara system
export const SECURITY_CONFIG = {
  // CRITICAL: Only this user ID can access the system
  OWNER_USER_ID: process.env.OWNER_USER_ID || '',
  OWNER_EMAIL: process.env.OWNER_EMAIL || '',
  
  // System configuration
  DEPLOYMENT_MODE: 'personal',
  ALLOW_PUBLIC_SIGNUP: false,
  REQUIRE_AUTH: true,
  
  // Session configuration
  SESSION_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
  SINGLE_SESSION_ONLY: true, // Force logout on other devices
  
  // Security settings
  LOG_ALL_ACCESS_ATTEMPTS: true,
  AUTO_LOCKDOWN_AFTER_FAILED_ATTEMPTS: 5,
  LOCKDOWN_DURATION_MS: 15 * 60 * 1000, // 15 minutes
  
  // Public routes (minimal)
  PUBLIC_ROUTES: ['/', '/login'],
  
  // Protected routes (everything else)
  PROTECTED_ROUTE_PREFIX: ['/inbox', '/admin', '/today', '/import', '/api'],
}

// Validate security configuration on startup
export function validateSecurityConfig() {
  if (!SECURITY_CONFIG.OWNER_USER_ID) {
    console.error('CRITICAL: OWNER_USER_ID must be set in environment variables')
    console.error('Add OWNER_USER_ID=your-user-id to .env.local')
    return false
  }
  
  if (!SECURITY_CONFIG.OWNER_EMAIL) {
    console.error('CRITICAL: OWNER_EMAIL must be set in environment variables')
    console.error('Add OWNER_EMAIL=your-email@example.com to .env.local')
    return false
  }
  
  if (SECURITY_CONFIG.ALLOW_PUBLIC_SIGNUP) {
    console.error('CRITICAL: Public signup must be disabled for personal system')
    return false
  }
  
  console.log('Security configuration validated successfully')
  console.log(`System locked to user: ${SECURITY_CONFIG.OWNER_EMAIL}`)
  return true
}