# Claude Code Session Prompt Template (COMPLETE VERSION)

For all future sessions, use this template that includes navigation and startup:

```
## Terminal Setup Instructions

First, navigate to the project and start Claude Code:

```bash
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1
./claude-code-aggressive.sh
```

## Session Execution Instructions

For this session, you have permission to:
- Create all files and directories
- Run all npm/npx commands
- Install all packages
- Modify any files in the project
- Execute git commands
- Run the development server
- [Add any session-specific permissions]

Please proceed with Session [X] without asking for individual approvals.

I need you to execute Session [X] for the Bara-v1 project. This is a DOUBLE SESSION (90 minutes) combining [feature A] and [feature B].

The session definition is located at:
/Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/session-[XX]-[name].md

Please:
1. Read the entire session document carefully
2. Execute ALL implementation steps in order
3. Complete both Part A and Part B
4. Run all verification steps as you go
5. Ensure everything works before the final git push
6. **IMPORTANT**: Save your completion report to:
   /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/session-[XX]-status.json
7. Confirm the session is complete and the status file is saved

Important notes:
- This is a 90-minute double session - complete BOTH parts
- All verification steps are part of implementation
- Only push to GitHub after all verification passes
- The status report MUST be saved as a file, not just displayed

[Add any session-specific notes]
```

## Quick Copy Template

For easy copying, here's the condensed version:

```
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1 && ./claude-code-aggressive.sh

Then paste:
Execute Session X from /sessions/session-XX.md. You have full permissions. Complete both parts, save status to /sessions/session-XX-status.json
```
