#!/bin/bash
# Generate context restoration prompt with current project state

CURRENT_DIR="/Volumes/DevDrive/ClaudeProjects/active/Bara-v1"
CURRENT_STATE_FILE="$CURRENT_DIR/CURRENT_STATE.md"

# Extract current session from CURRENT_STATE.md
CURRENT_SESSION=$(grep -oP '(?<=Current Session: )\d+' "$CURRENT_STATE_FILE" 2>/dev/null || echo "1")

# Generate timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M")

# Create the prompt
cat << EOF
==== COPY THIS PROMPT TO NEW CLAUDE DESKTOP CHAT ====

I'm working on the Bara-v1 project using the two-actor development model. Please connect to the project MCP and read these files to restore context:

1. First, read: /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/CURRENT_STATE.md
2. Then skim: /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/TWO_ACTOR_MODEL.md
3. Check session $CURRENT_SESSION status: /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/session-$(printf "%02d" $CURRENT_SESSION)-*.md

Context as of $TIMESTAMP:
- Working on Session $CURRENT_SESSION
- Two-actor model active (you're Claude Desktop - planning role)
- Project uses aggressive permissions for Claude Code

After reading these files, please confirm you've restored the Bara project context, then we can continue.

==== END PROMPT ====
EOF

echo ""
echo "✅ Prompt generated! Copy everything between the ==== markers"
echo "📋 To copy to clipboard on macOS: ./generate-context-prompt.sh | pbcopy"
