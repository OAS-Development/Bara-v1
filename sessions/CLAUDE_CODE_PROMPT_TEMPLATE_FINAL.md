# Claude Code Session Prompt Template (WITH AGGRESSIVE LAUNCH)

For all future sessions, use this template that ALWAYS includes the aggressive script:

```
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1
./claude-code-aggressive.sh

If the aggressive script doesn't work, run regular claude-code and immediately run:
/permissions add *

Now execute Session [X] for the Bara-v1 project. This is a DOUBLE SESSION (90 minutes) combining [feature A] and [feature B].

For this session, you have permission to:
- Create all files and directories
- Run all npm/npx commands
- Install all packages
- Modify any files in the project
- Execute git commands
- Run the development server
- [Add any session-specific permissions]

Please proceed with Session [X] without asking for individual approvals.

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

## Key Changes Made:
1. Navigation command is FIRST
2. Aggressive script launch is SECOND
3. Fallback /permissions command included
4. Everything Claude Code needs in one paste
