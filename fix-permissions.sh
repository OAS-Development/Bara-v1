#!/bin/bash
# Fix Claude Code permissions once and for all

echo "🔧 Fixing Claude Code permissions..."

# Navigate to project
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1

# Remove ALL restrictive settings
rm -f .claude/settings.local.json
rm -f .claude/preferences.json

# Ensure our aggressive settings are the only ones
echo "✅ Restrictive settings removed"

# Show what's left
echo ""
echo "📁 Current .claude directory:"
ls -la .claude/

echo ""
echo "🚀 Now start Claude Code fresh:"
echo "1. Close Claude Code completely"
echo "2. Run: claude"
echo "3. The aggressive settings.json should now work!"
echo ""
echo "If it STILL asks for permissions:"
echo "- Check ~/.claude.json (global settings)"
echo "- Run: /permissions add * in Claude Code"
