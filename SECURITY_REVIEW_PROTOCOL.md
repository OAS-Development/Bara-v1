# Security Review Protocol

## MANDATORY: Before Every Session

### Pre-Session Security Checklist:
- [ ] Review SECURITY_REQUIREMENTS.md
- [ ] Check if session adds any multi-user features
- [ ] Verify no public endpoints being added
- [ ] Confirm single-user enforcement remains
- [ ] Flag any new sensitive data storage

### In Every Session Plan:
```
## Security Considerations:
- Data sensitivity: [NONE/LOW/MEDIUM/HIGH]
- New endpoints: [List any]
- Authentication changes: [NONE/describe]
- Data access changes: [NONE/describe]
- Required security measures: [List]
```

### Post-Session Security Verification:
- [ ] No public signup/registration added
- [ ] Single-user check still enforced
- [ ] No data exposed publicly
- [ ] Audit log updated
- [ ] Security requirements still met

## Security Red Flags:

### STOP immediately if Claude Code:
1. Adds "Sign Up" or "Register" functionality
2. Creates public API endpoints
3. Implements user management features
4. Adds collaboration/sharing features
5. Removes authentication checks

### STOP immediately if session plan includes:
1. Multi-tenant features
2. User invitation systems
3. Public data access
4. Social features
5. Analytics that send data externally

## For Personal Data Projects:

### Every session MUST:
1. Maintain single-user enforcement
2. Keep all data private
3. Require authentication for ALL routes
4. Log access attempts
5. Provide data export capability

### Session 0 Security Setup (Should have been done):
- Disable all public signups
- Hard-code single user ID
- Remove multi-user UI elements
- Add security monitoring
- Set up encrypted backups

## This Protocol is NON-NEGOTIABLE for:
- Personal productivity systems
- Health tracking applications
- Financial management tools
- Journal/diary applications
- Any system with personal data

Remember: Security is not a feature to add later - it's the foundation everything builds on.
