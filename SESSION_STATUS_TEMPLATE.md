# Session Status Tracking

## For Claude Code
After completing each session, create a status file:
`/sessions/session-XX-status.json`

## Status File Template
```json
{
  "session": 1,
  "completedAt": "2025-06-16T17:45:00Z",
  "status": "complete|blocked|partial",
  "completedObjectives": [
    "Git repository initialized",
    "Next.js project created",
    "Dependencies installed",
    "Folder structure created",
    "Supabase authentication implemented",
    "All verification tests passed",
    "Code pushed to GitHub"
  ],
  "blockers": [],
  "changes": {
    "filesCreated": 47,
    "filesModified": 12,
    "packagesInstalled": [
      "@supabase/supabase-js",
      "@supabase/auth-helpers-nextjs",
      "zustand",
      "@tanstack/react-query"
    ],
    "majorImplementations": [
      "Authentication flow",
      "Protected routes",
      "Supabase client"
    ]
  },
  "verificationResults": {
    "devServer": "passed",
    "build": "passed",
    "typeCheck": "passed",
    "authFlow": "passed"
  },
  "nextSession": 2,
  "notes": "Ready for database schema implementation",
  "gitCommit": "abc123def456"
}
```

## For Claude Desktop
After reading a session status:
1. Update `CURRENT_STATE.md` with new session number
2. Update last modified timestamp
3. Add any blockers to active issues
4. Clear completed objectives from tracking
