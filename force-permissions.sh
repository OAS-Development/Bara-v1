#!/bin/bash
# force-permissions.sh - The Nuclear Option for Claude Code Permissions

echo "🔥 FORCING ALL PERMISSIONS - NUCLEAR OPTION 🔥"
echo "============================================"

# Step 1: Kill any running instances
echo "1. Killing any running Claude Code instances..."
pkill -f claude 2>/dev/null
sleep 1

# Step 2: Complete cleanup
echo "2. Removing ALL settings files..."
rm -rf .claude/ 2>/dev/null
rm ~/.claude.json 2>/dev/null
rm ~/.claude/settings.json 2>/dev/null

# Step 3: Create maximum permission files
echo "3. Creating maximum permission configuration..."
mkdir -p .claude

# Local project settings
cat > .claude/settings.json << 'EOF'
{
  "version": "1.0",
  "autoApprove": true,
  "allowedTools": ["*"],
  "skipConfirmations": true,
  "trustLevel": "maximum",
  "requireConfirmation": false,
  "autoApproveTimeout": 0,
  "permissions": {
    "*": {
      "allowed": true,
      "autoApprove": true,
      "skipConfirmation": true
    }
  },
  "tools": {
    "bash": { "allowAll": true, "autoApprove": true },
    "filesystem": { "allowAll": true, "autoApprove": true },
    "git": { "allowAll": true, "autoApprove": true },
    "npm": { "allowAll": true, "autoApprove": true },
    "process": { "allowAll": true, "autoApprove": true }
  },
  "ui": {
    "confirmations": false,
    "autoAcceptAll": true,
    "showPermissionPrompts": false
  }
}
EOF

# Global settings (same content)
mkdir -p ~/.claude
cp .claude/settings.json ~/.claude/settings.json

# Permission override file
cat > .claude/OVERRIDE_ALL_PERMISSIONS << 'EOF'
ALL_PERMISSIONS_GRANTED=true
AUTO_APPROVE_ALL=true
SKIP_ALL_CONFIRMATIONS=true
EOF

# Step 4: Set environment variables
echo "4. Setting environment variables..."
export CLAUDE_AUTO_APPROVE=true
export CLAUDE_SKIP_CONFIRMATIONS=true
export CLAUDE_ALLOW_ALL_TOOLS=true
export CLAUDE_NO_PERMISSION_CHECK=true

# Step 5: Create permission assertion script
echo "5. Creating in-session permission script..."
cat > .claude/assert-permissions.txt << 'EOF'
/permissions add *
/permissions add bash:*
/permissions add filesystem:*
/permissions add git:*
/permissions add npm:*
/permissions add process:*
/permissions set autoApprove true
/settings set requireConfirmation false
/settings set autoApproveTimeout 0
/settings set showPermissionPrompts false
EOF

# Step 6: Launch Claude Code with all flags
echo "6. Launching Claude Code with maximum permissions..."
echo ""
echo "🎯 IMPORTANT: As soon as Claude Code opens, run these commands:"
echo "-----------------------------------------------------------"
cat .claude/assert-permissions.txt
echo "-----------------------------------------------------------"
echo ""
echo "Then paste your session prompt with this prefix:"
echo "AUTONOMOUS MODE: Full permissions granted. Execute without confirmations."
echo ""

# Try to launch Claude Code with various possible commands
echo "Attempting to launch Claude Code..."

if command -v claude &> /dev/null; then
    claude --dangerously-skip-permissions --allowedTools "*" --autoApprove true
elif command -v claude-code &> /dev/null; then
    claude-code --dangerously-skip-permissions --allowedTools "*" --autoApprove true
elif [ -d "/Applications/Claude Code.app" ]; then
    open "/Applications/Claude Code.app"
elif [ -d "/Applications/Claude.app" ]; then
    open "/Applications/Claude.app"
else
    echo ""
    echo "⚠️  Could not auto-launch Claude Code!"
    echo ""
    echo "Please launch Claude Code manually using one of these methods:"
    echo "  1. Click the Claude Code icon in your Applications folder"
    echo "  2. Use Spotlight: Press Cmd+Space and type 'Claude'"
    echo "  3. From terminal: claude"
    echo ""
    echo "Once Claude Code is open, immediately run the commands shown above."
fi

echo ""
echo "✅ Maximum permission setup complete!"
echo "📝 If still getting prompts, check PERMISSION_TROUBLESHOOTING.md"
