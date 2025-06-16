# Sessions Directory

This directory contains Session definitions for Claude Code to execute.

## Session Naming Convention
`session-XX-brief-description.md`

Examples:
- `session-01-setup.md`
- `session-02-database.md`
- `session-03-layout.md`

## Session Status

| Session | Title | Status | Completed |
|---------|-------|--------|-----------|
| 01 | Project Setup & Authentication | Ready | ⬜ |
| 02 | Database Schema & RLS | Planned | ⬜ |
| 03 | Layout Components | Planned | ⬜ |
| 04 | Task CRUD Operations | Planned | ⬜ |
| 05 | Keyboard Shortcuts | Planned | ⬜ |
| 06 | Project Management | Planned | ⬜ |
| 07 | Tags/Contexts System | Planned | ⬜ |
| 08 | Defer & Due Dates | Planned | ⬜ |
| 09 | Views & Perspectives | Planned | ⬜ |
| 10 | Review System | Planned | ⬜ |
| 11 | Import Parser | Planned | ⬜ |
| 12 | Import Mapping | Planned | ⬜ |
| 13 | Import Execution | Planned | ⬜ |
| 14 | Location Context | Planned | ⬜ |
| 15 | Time Context | Planned | ⬜ |
| 16 | Device Context | Planned | ⬜ |
| 17 | AI Natural Language | Planned | ⬜ |
| 18 | AI Task Suggestions | Planned | ⬜ |
| 19 | Library Upload | Planned | ⬜ |
| 20 | Library AI Analysis | Planned | ⬜ |
| 21 | Library UI | Planned | ⬜ |
| 22 | Travel Profile | Planned | ⬜ |
| 23 | Travel Planning | Planned | ⬜ |
| 24 | Travel Integration | Planned | ⬜ |
| 25 | Financial Capture | Planned | ⬜ |
| 26 | Financial Processing | Planned | ⬜ |
| 27 | QuickBooks Integration | Planned | ⬜ |
| 28 | Mobile Responsive | Planned | ⬜ |
| 29 | PWA Features | Planned | ⬜ |
| 30 | Performance Optimization | Planned | ⬜ |
| 31 | Security Audit | Planned | ⬜ |
| 32 | Testing Suite | Planned | ⬜ |
| 33 | Documentation | Planned | ⬜ |
| 34 | Deployment Setup | Planned | ⬜ |
| 35 | Launch Preparation | Planned | ⬜ |

## How to Use

1. Claude Code opens the next "Ready" session
2. Executes all steps
3. Runs verification
4. Updates status to "Complete" ✅
5. Claude Desktop prepares next session

## Session Template

Each session follows this structure:
- Metadata (JSON)
- Objectives (numbered list)
- Context (current state)
- Implementation Steps
- Verification Commands
- Success Criteria
- Handoff Format

## Important Notes

- Each session is self-contained
- No assumptions about prior sessions
- Always run verification
- Report blockers immediately
- ~45 minute time limit
