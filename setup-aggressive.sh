#!/bin/bash
# One-command setup for aggressive permissions

echo "🚀 Setting up AGGRESSIVE PERMISSIONS for Bara-v1..."
echo ""

# 1. Make scripts executable
chmod +x claude-code-aggressive.sh generate-context-prompt.sh status.sh check-sessions.sh launch-session.sh start-new-session.sh show-migrations.sh fix-permissions.sh 2>/dev/null

# 2. Remove any restrictive settings
rm -f .claude/settings.local.json 2>/dev/null
rm -f .claude/preferences.json 2>/dev/null

# 3. Ensure aggressive settings are in place
if [ ! -f ".claude/settings.json" ]; then
    echo "ERROR: .claude/settings.json not found!"
    exit 1
fi

echo "✅ Aggressive permissions configured!"
echo ""
echo "🎯 Quick Start Commands:"
echo "  1. ./claude-code-aggressive.sh              (Recommended)"
echo "  2. claude-code --allowedTools '*'"
echo ""
echo "📝 In Claude Code, if needed:"
echo "  /permissions add *"
echo ""
echo "Ready for ZERO-APPROVAL development! 🔥"
