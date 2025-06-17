#!/bin/bash
# Quick status check for Bara project

PROJ_DIR="/Volumes/DevDrive/ClaudeProjects/active/Bara-v1"

echo "🚀 BARA PROJECT STATUS"
echo "====================="
echo ""

# Check current session
if [ -f "$PROJ_DIR/CURRENT_STATE.md" ]; then
    SESSION=$(grep -oP '(?<=Current Session: )\d+' "$PROJ_DIR/CURRENT_STATE.md" 2>/dev/null || echo "Unknown")
    echo "📍 Current Session: $SESSION"
fi

# Check for session files
echo ""
echo "📋 Available Sessions:"
ls -la "$PROJ_DIR/sessions/session-"*.md 2>/dev/null | grep -v status | tail -5

# Check last status file
echo ""
echo "📊 Last Session Status:"
LAST_STATUS=$(ls -t "$PROJ_DIR/sessions/"*-status.json 2>/dev/null | head -1)
if [ -n "$LAST_STATUS" ]; then
    echo "   File: $(basename "$LAST_STATUS")"
    grep -E '"status"|"completedAt"' "$LAST_STATUS" 2>/dev/null | head -2
else
    echo "   No status files found"
fi

# Check git status
echo ""
echo "🔧 Git Status:"
cd "$PROJ_DIR" 2>/dev/null
git status --porcelain 2>/dev/null | head -5 || echo "   Not a git repository yet"

echo ""
echo "📝 Session Structure:"
echo "   - Sessions are now 90-minute DOUBLE sessions"
echo "   - Each combines two related feature sets"
echo "   - See SESSIONS_DOUBLED_NOTICE.md for details"

echo ""
echo "💡 Quick Actions:"
echo "   - Start new chat: ./generate-context-prompt.sh | pbcopy"
echo "   - Launch Code: ./claude-code-aggressive.sh"
echo "   - Execute Session 2: See CLAUDE_CODE_SESSION_2_PROMPT.txt"
echo "   - Update state: Edit CURRENT_STATE.md"
echo ""
