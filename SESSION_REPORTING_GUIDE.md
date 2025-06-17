# Session Status Reporting Instructions

## For Claude Code

**IMPORTANT**: After completing each session, you MUST save a status report file.

### File Location
Save your report as: `/sessions/session-XX-status.json`
(Replace XX with the zero-padded session number: 01, 02, 03, etc.)

### Report Format
```json
{
  "session": [number],
  "status": "complete|blocked|partial",
  "completedAt": "[ISO 8601 timestamp]",
  "duration": "[actual time taken, e.g., '47 minutes']",
  "completedObjectives": [
    "List each completed objective",
    "Be specific about what was implemented",
    "Include verification results"
  ],
  "blockers": [
    "List any blockers encountered",
    "Include error messages if relevant"
  ],
  "filesCreated": [
    "List new files created",
    "Include full paths"
  ],
  "filesModified": [
    "List files that were modified",
    "Include full paths"
  ],
  "packagesInstalled": [
    "List any new npm packages"
  ],
  "verificationResults": {
    "devServer": "passed|failed|skipped",
    "build": "passed|failed|skipped",
    "typeCheck": "passed|failed|skipped",
    "tests": "passed|failed|skipped",
    "other": "any other verification performed"
  },
  "gitCommit": "[commit hash if pushed]",
  "nextSession": [number],
  "notes": "Any important context for the next session"
}
```

### Example Command to Save Report
```bash
cat > /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/session-02-status.json << 'EOF'
{
  "session": 2,
  "status": "complete",
  "completedAt": "2025-06-16T19:30:00Z",
  "duration": "92 minutes",
  "completedObjectives": [
    "Database schema created with all GTD tables",
    "RLS policies implemented and tested",
    "TypeScript types generated",
    "Three-panel layout implemented",
    "Dark theme applied",
    "Sidebar navigation working",
    "Inspector panel created",
    "All verification tests passed",
    "Code pushed to GitHub"
  ],
  "blockers": [],
  "filesCreated": [
    "supabase/migrations/001_create_tables.sql",
    "supabase/migrations/002_rls_policies.sql",
    "src/types/database.types.ts",
    "src/lib/supabase/hooks.ts",
    "src/components/layout/sidebar.tsx",
    "src/components/layout/main-content.tsx",
    "src/components/layout/inspector.tsx"
  ],
  "filesModified": [
    "src/app/(dashboard)/layout.tsx",
    "tailwind.config.ts",
    "src/app/layout.tsx"
  ],
  "packagesInstalled": [],
  "verificationResults": {
    "devServer": "passed",
    "build": "passed",
    "typeCheck": "passed",
    "databaseConnection": "passed",
    "layoutRendering": "passed"
  },
  "gitCommit": "abc123def456",
  "nextSession": 3,
  "notes": "Database and UI foundation complete. Ready for task CRUD and keyboard shortcuts."
}
EOF
```

## For Claude Desktop

After each session, check for the status file:
```bash
cat /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/session-XX-status.json
```

Then update CURRENT_STATE.md based on the report.

## Benefits

1. **Persistent History**: All session outcomes are preserved
2. **Easy Handoffs**: Claude Desktop can read exactly what happened
3. **Progress Tracking**: Can query all status files to see project progress
4. **Debugging**: If issues arise, we have detailed records
5. **Automation**: Could build tools to parse these reports

## Checking All Session Status
```bash
# List all session status files
ls -la /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/*-status.json

# View latest status
ls -t /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/*-status.json | head -1 | xargs cat
```
