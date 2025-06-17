# Session 5.5: Critical Security Hardening

## Session Metadata
```json
{
  "session": 5.5,
  "title": "Critical Security Hardening - Single User Lockdown",
  "duration": "90 minutes",
  "type": "security-critical",
  "priority": "URGENT - BLOCKS ALL OTHER WORK",
  "project": "Bara-v1",
  "dependencies": ["Sessions 1-5 complete"]
}
```

## CRITICAL CONTEXT
Bara currently has PUBLIC SIGNUP enabled, which is completely inappropriate for a personal productivity system containing health, financial, and journal data. This session converts Bara into a proper single-user private system.

## Security Requirements
- **Data sensitivity**: CRITICAL (health, financial, journal data)
- **Access model**: SINGLE USER ONLY
- **Public endpoints**: NONE ALLOWED
- **Authentication**: Required for EVERY route
- **Deployment**: Private access only

## Implementation Steps

### Part A: Disable Public Access (20 min)

#### 1. Remove Signup Functionality
- Delete or disable ALL signup routes
- Remove `/auth/signup` page completely
- Remove "Create Account" buttons from UI
- Update auth components to remove registration options
- Ensure password reset (if exists) only works for YOUR email

#### 2. Lock Authentication Routes
```typescript
// In auth configuration
export const AUTH_CONFIG = {
  allowSignup: false,
  allowedUsers: [process.env.OWNER_USER_ID],
  publicAccess: false,
  requireAuth: true
}
```

#### 3. Update UI for Single User
- Replace "Sign In / Sign Up" with just "Sign In"
- Add message: "Private System - Authorized Access Only"
- Remove any onboarding flows for new users
- Simplify auth to just email/password for your account

### Part B: Implement Single-User Enforcement (25 min)

#### 4. Create Security Middleware
Create `src/middleware/security.ts`:
```typescript
// Verify EVERY request is from the authorized user
export async function securityMiddleware(req: Request) {
  const userId = await getUserId(req);
  
  if (userId !== process.env.OWNER_USER_ID) {
    // Log the intrusion attempt
    await logSecurityEvent({
      type: 'UNAUTHORIZED_ACCESS',
      attemptedUserId: userId,
      ip: req.ip,
      timestamp: new Date()
    });
    
    throw new Error('Unauthorized: Private System');
  }
}
```

#### 5. Harden Database Access
Update ALL Supabase RLS policies:
```sql
-- Example for tasks table
CREATE POLICY "Only owner can access tasks" ON tasks
  FOR ALL USING (auth.uid() = 'YOUR-SPECIFIC-USER-ID-HERE');

-- Add constraint to prevent other users
ALTER TABLE tasks 
ADD CONSTRAINT owner_only 
CHECK (user_id = 'YOUR-SPECIFIC-USER-ID-HERE');
```

#### 6. Environment Configuration
Create `.env.local.example`:
```bash
# REQUIRED - The app will not start without these
OWNER_USER_ID=your-user-id-here
OWNER_EMAIL=your-email@example.com
DEPLOYMENT_MODE=personal
ALLOW_PUBLIC_SIGNUP=false
REQUIRE_AUTH=true
```

Add startup check that refuses to run if these aren't set.

### Part C: Add Security Monitoring (20 min)

#### 7. Create Security Dashboard
Add `/admin/security` page (only accessible by you):
- Failed login attempts log
- Access attempt monitoring
- Security event timeline
- Quick lockdown button
- Data export tools

#### 8. Implement Intrusion Detection
- Log all authentication attempts
- Alert on multiple failed logins
- Track IP addresses accessing the system
- Auto-lockdown after suspicious activity

#### 9. Add Session Security
- Implement session timeout (30 min default)
- Clear sessions on password change
- Single session enforcement (logout other devices)
- Secure session storage

### Part D: Data Protection (15 min)

#### 10. Implement Data Encryption
- Encrypt sensitive fields in database
- Use app-level encryption for journal entries
- Secure key management
- Encrypted backups

#### 11. Add Privacy Features
- Auto-logout on idle
- Blur sensitive data when inactive
- No data in URLs
- Secure clipboard handling

#### 12. Export Capabilities
- Add "Export All My Data" feature
- Encrypted backup downloads
- Regular backup reminders
- Data portability

### Part E: Deployment Security (10 min)

#### 13. Production Hardening
- Disable all debug endpoints
- Remove error details in production
- Add security headers
- Configure CORS properly

#### 14. Access Control
Create deployment guide:
- Local-only option (recommended)
- VPN-only cloud access
- IP whitelist configuration
- Cloudflare Access setup

### Part F: Verification (10 min)

#### 15. Security Testing
Run comprehensive tests:
```bash
# Test unauthorized access
- Try to create a new account → MUST FAIL
- Try to access without auth → MUST FAIL
- Try with wrong user ID → MUST FAIL
- Try API endpoints without auth → MUST FAIL

# Test authorized access
- Login with your account → MUST WORK
- All features accessible → MUST WORK
- Data properly isolated → VERIFIED
- Security logs working → VERIFIED
```

## Success Criteria Checklist
- [ ] NO public signup possible
- [ ] Create Account UI completely removed
- [ ] Only YOUR user ID can authenticate
- [ ] All routes require authentication
- [ ] Failed access attempts are logged
- [ ] Database constraints prevent other users
- [ ] Security monitoring dashboard works
- [ ] Data encryption implemented
- [ ] Export functionality available
- [ ] Production hardening complete
- [ ] All security tests pass

## Critical Reminders
- This is a SINGLE USER system
- There should be NO multi-user features
- Every access attempt must be authenticated
- Security cannot be compromised for convenience
- Your personal data must be protected

## Context Window Monitoring
**IMPORTANT**: Report context usage at:
- After Part C (45 min): "Context: X% remaining"
- After Part E (70 min): "Context: X% remaining"
- If <15% remaining: STOP and complete what you can
- Report final % in session status

## Session Completion
Update `/sessions/session-05.5-status.json` with security audit results including context metrics.

## Next Steps
Only after this session is verified complete:
1. Full security audit of existing code
2. Proceed with Session 6 (Life Management)
3. Regular security reviews going forward
