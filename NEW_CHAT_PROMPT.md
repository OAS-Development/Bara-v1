# 🚀 BARA PROJECT - NEW CHAT QUICK START

## Standard Context Restoration Prompt

Copy and paste this EXACT prompt when starting any new Claude Desktop chat:

```
I'm working on the Bara-v1 project using the two-actor development model. Please connect to the project MCP and read these files to restore context:

1. First, read: /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/CURRENT_STATE.md
2. Then skim: /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/TWO_ACTOR_MODEL.md
3. Check the latest session status in: /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/

After reading these, confirm you understand:
- The current session number and status
- The two-actor model (Desktop plans, Code implements)
- What work is in progress or ready to start

Then we can continue from where we left off.
```

## Alternative: Auto-Generated Prompt

For a prompt with current timestamps and session info:
```bash
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1
./generate-context-prompt.sh | pbcopy
# Then paste into new chat
```

## Quick Status Check

Before starting a new chat, check project status:
```bash
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1
./status.sh
```

## Context Preservation Workflow

1. **Starting New Chat**: Use the prompt above
2. **After Session Completion**: Update CURRENT_STATE.md
3. **When Blocked**: Document in CURRENT_STATE.md under "Active Decisions/Blockers"
4. **Regular Updates**: Run `./status.sh` to verify state

## Emergency Context Recovery

If context is completely lost:
```
Read these files in order:
1. /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/PLANNING_COMPLETE.md
2. /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/CURRENT_STATE.md
3. /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/session-01-setup.md
4. Latest status file in /sessions/*-status.json
```

## Remember

- You (Claude Desktop) are the PLANNER
- Claude Code is the IMPLEMENTER
- Sessions are ~45 minutes each
- Everything is documented in the project
- Aggressive permissions are already configured

This prompt system ensures you never lose context again! 🎯
