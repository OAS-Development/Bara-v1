#!/bin/bash
# Quick setup for a new session terminal

echo "🚀 BARA SESSION QUICK START"
echo "=========================="
echo ""

# Show current session status
CURRENT_SESSION=$(grep -oP '(?<=Current Session: )\d+' CURRENT_STATE.md 2>/dev/null || echo "Unknown")
echo "📍 Current Session: $CURRENT_SESSION"
echo ""

# Show commands to copy
echo "📋 Copy these commands:"
echo ""
echo "cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1"
echo "./claude-code-aggressive.sh"
echo ""

# Show session launcher
echo "🎯 Then use session launcher:"
echo "./launch-session.sh $CURRENT_SESSION"
echo ""

echo "💡 Or copy the full prompt:"
echo "cat CLAUDE_CODE_SESSION_${CURRENT_SESSION}_PROMPT_COMPLETE.txt | pbcopy"
echo ""

# Quick status check
if [ -f "sessions/session-$(printf "%02d" $((CURRENT_SESSION-1)))-status.json" ]; then
    echo "✅ Previous session ($((CURRENT_SESSION-1))) completed"
else
    echo "⚠️  Previous session status not found"
fi

echo ""
echo "Ready to start Session $CURRENT_SESSION! 🚀"
