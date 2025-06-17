#!/bin/bash
# Generate a proper session prompt for Claude Code

if [ -z "$1" ]; then
    echo "Usage: ./generate-session-prompt.sh [session-number]"
    exit 1
fi

SESSION_NUM=$1
SESSION_FILE=$(ls sessions/session-$(printf "%02d" $SESSION_NUM)-*.md 2>/dev/null | head -1)

if [ -z "$SESSION_FILE" ]; then
    echo "Session $SESSION_NUM not found!"
    exit 1
fi

# Extract session name from filename
SESSION_NAME=$(basename "$SESSION_FILE" .md | sed "s/session-[0-9]*-//")

# Read the session file to get feature names
FEATURES=$(grep -A 2 "combining" "$SESSION_FILE" | tail -1 || echo "[Feature A] and [Feature B]")

cat << EOF
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1
./claude-code-aggressive.sh

Once Claude Code starts, IMMEDIATELY run:
/permissions add *

This will stop all approval prompts for this session.

Now execute Session $SESSION_NUM for the Bara-v1 project. This is a DOUBLE SESSION (90 minutes) combining $FEATURES.

The session definition is located at:
/Volumes/DevDrive/ClaudeProjects/active/Bara-v1/$SESSION_FILE

Please:
1. Read the ENTIRE session document carefully
2. Execute ALL implementation steps in order
3. Complete both Part A and Part B
4. Run all verification steps as you go
5. Ensure everything works before the final git push
6. **IMPORTANT**: Save your completion report to:
   /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/session-$(printf "%02d" $SESSION_NUM)-status.json
7. Confirm the session is complete and the status file is saved

You have permission to create all files, run all commands, and make all necessary changes without asking for individual approvals.

This is a 90-minute double session. The session document contains all implementation details.
EOF
