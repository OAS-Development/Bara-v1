#!/bin/bash
# Launch a specific session with Claude Code

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if session number provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}Usage: ./launch-session.sh [session-number]${NC}"
    echo -e "Example: ./launch-session.sh 2"
    echo ""
    echo "Available sessions:"
    ls sessions/session-*.md 2>/dev/null | grep -v status | sed 's/.*session-/  /' | sed 's/-.*//'
    exit 1
fi

SESSION_NUM=$(printf "%02d" $1)
SESSION_FILE="sessions/session-${SESSION_NUM}-*.md"
PROMPT_FILE="CLAUDE_CODE_SESSION_${1}_PROMPT_COMPLETE.txt"

# Check if session exists
if ! ls $SESSION_FILE 1> /dev/null 2>&1; then
    echo -e "${YELLOW}Session $1 not found!${NC}"
    echo "Available sessions:"
    ls sessions/session-*.md 2>/dev/null | grep -v status | sed 's/.*session-/  /' | sed 's/-.*//'
    exit 1
fi

echo -e "${GREEN}🚀 Launching Session $1${NC}"
echo "=================================="
echo ""

# Show session info
echo -e "${BLUE}Session file:${NC} $(ls $SESSION_FILE)"
echo ""

# Show launch instructions
echo -e "${GREEN}Step 1: Open a fresh terminal${NC}"
echo ""

echo -e "${GREEN}Step 2: Copy and run these commands:${NC}"
echo -e "${YELLOW}cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1${NC}"
echo -e "${YELLOW}./claude-code-aggressive.sh${NC}"
echo ""

echo -e "${GREEN}Step 3: Once Claude Code starts, paste this:${NC}"
echo ""

if [ -f "$PROMPT_FILE" ]; then
    echo -e "${BLUE}Full prompt available in: $PROMPT_FILE${NC}"
    echo "cat $PROMPT_FILE | pbcopy    # To copy to clipboard"
else
    echo "Execute Session $1 from $(ls $SESSION_FILE)."
    echo "This is a 90-minute DOUBLE SESSION. Complete both parts."
    echo "You have full permissions - no approvals needed."
    echo "IMPORTANT: Save completion report to sessions/session-${SESSION_NUM}-status.json"
fi

echo ""
echo -e "${GREEN}Step 4: After completion, check status:${NC}"
echo "./check-sessions.sh"
echo ""
