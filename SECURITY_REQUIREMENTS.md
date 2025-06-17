# Bara Security Requirements

## CRITICAL: This is a PERSONAL SINGLE-USER System

### Core Security Principles:
1. **NO PUBLIC ACCESS** - This is not a SaaS product
2. **SINGLE USER ONLY** - Only the owner should ever access this
3. **PERSONAL DATA** - Contains health, financial, journal entries
4. **ZERO TRUST** - Assume every access attempt is hostile

### Mandatory Security Features:

#### Authentication & Access
- [ ] Public signup MUST be disabled
- [ ] Single user ID hard-coded
- [ ] No "Create Account" functionality
- [ ] Session timeout after inactivity
- [ ] IP whitelist option
- [ ] Failed login attempt logging

#### Data Protection
- [ ] All data encrypted at rest
- [ ] Encrypted backups
- [ ] No data sharing endpoints
- [ ] Audit log of all data access
- [ ] Automatic data export for ownership

#### Deployment Security
- [ ] Local-only option must exist
- [ ] If cloud: private VPN required
- [ ] Environment variable validation
- [ ] No public endpoints
- [ ] Security headers configured

#### Development Security
- [ ] No test accounts in production
- [ ] No debug endpoints in production
- [ ] Secrets never in code
- [ ] Security review before each session

### Security Review Checklist (EVERY SESSION):
1. Does this feature expose any data publicly?
2. Does this feature allow multi-user access?
3. Are we adding any public endpoints?
4. Are we storing new sensitive data?
5. Have we validated single-user enforcement?

### Red Flags That Require Immediate Stop:
- Any mention of "users" (plural)
- Any public signup/registration flow
- Any sharing or collaboration features
- Any public API endpoints
- Any analytics or telemetry sending data out

## This Document is MANDATORY READING:
- Before planning any session
- Before implementing any feature
- Before any deployment

Security is not a feature - it's THE foundation.
