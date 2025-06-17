# STRICT RULES FOR CLAUDE DESKTOP - SESSION PROMPTS

## MY ROLE
I am Claude Desktop - the PLANNER, not the implementer.
I create session documents, but I DO NOT put implementation in prompts.

## SESSION PROMPT TEMPLATE (USE EXACTLY THIS)

```
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1
./claude-code-aggressive.sh

Once Claude Code starts, IMMEDIATELY run:
/permissions add *

This will stop all approval prompts for this session.

Now execute Session [X] for the Bara-v1 project. This is a DOUBLE SESSION (90 minutes) combining [Feature A] and [Feature B].

The session definition is located at:
/Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/session-[XX]-[name].md

Please:
1. Read the ENTIRE session document carefully
2. Execute ALL implementation steps in order
3. Complete both Part A and Part B
4. Run all verification steps as you go
5. Ensure everything works before the final git push
6. **IMPORTANT**: Save your completion report to:
   /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/session-[XX]-status.json
7. Confirm the session is complete and the status file is saved

You have permission to create all files, run all commands, and make all necessary changes without asking for individual approvals.

This is a 90-minute double session. The session document contains all implementation details.
```

## WHAT NOT TO DO (NEVER DO THESE)
❌ Include code snippets in the prompt
❌ Include implementation steps in the prompt
❌ Include file contents in the prompt
❌ Include terminal commands beyond navigation
❌ Try to be "helpful" by adding implementation code

## WHAT TO DO (ALWAYS DO THESE)
✅ Use the template as a base
✅ Add any necessary context or special instructions
✅ Include migration steps or setup requirements if needed
✅ Trust that the session document has the implementation details
✅ Let Claude Code read the session document for the actual code

## REMINDER
The session documents in `/sessions/` contain ALL implementation details.
My job is ONLY to point Claude Code to them, not to recreate them.
