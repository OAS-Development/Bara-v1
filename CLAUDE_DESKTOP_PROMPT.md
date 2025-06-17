# Claude Desktop Context Restoration Prompt

Copy and paste this prompt when starting a new Claude Desktop chat for the Bara project:

---

I'm working on the Bara-v1 project using the two-actor development model. Please connect to the project MCP and read these files to restore context:

1. First, read: `/Volumes/DevDrive/ClaudeProjects/active/Bara-v1/CURRENT_STATE.md`
2. Then skim: `/Volumes/DevDrive/ClaudeProjects/active/Bara-v1/TWO_ACTOR_MODEL.md`
3. Check the latest session status in: `/Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/`

After reading these, confirm you understand:
- The current session number and status
- The two-actor model (Desktop plans, Code implements)
- What work is in progress or ready to start

Then we can continue from where we left off.

---

## For Quick Updates

If you just need a specific context, use one of these shorter prompts:

### After Session Completion:
"Bara project - Claude Code just completed Session [X]. Read `/Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/session-[X]-status.json` and `CURRENT_STATE.md` to see results."

### For Planning Next Session:
"Bara project - Ready to plan Session [X]. Check `CURRENT_STATE.md` and the previous session status, then create the next session document."

### For Troubleshooting:
"Bara project - Issue with [describe]. Read `CURRENT_STATE.md` and relevant session documents to help resolve."

## Maintaining Context

After each significant action, update `CURRENT_STATE.md` with:
- New session number
- Completion status
- Any blockers
- Next actions
- Last updated timestamp

This ensures smooth context restoration across chat windows.
