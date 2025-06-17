#!/bin/bash
# AGGRESSIVE MODE: Launch Claude Code with ALL permissions for Bara development
# This completely disables the approval system

# Remove any restrictive local settings
if [ -f ".claude/settings.local.json" ]; then
    echo "Removing restrictive local settings..."
    rm .claude/settings.local.json
fi

# Ensure we're in the right directory
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1

# Launch Claude Code with maximum permissions
echo "Launching Claude Code in FULL AUTONOMOUS MODE..."
echo "All actions will be auto-approved. No confirmations required."
echo ""

claude \
  --allowedTools "*" \
  "$@"
