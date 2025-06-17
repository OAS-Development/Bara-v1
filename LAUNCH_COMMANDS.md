# 🚀 Quick Launch Commands

## To Run Force Permissions Script:
```bash
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1
chmod +x force-permissions.sh
./force-permissions.sh
```

## To Launch Claude Code Manually:
```bash
# Simple launch
claude

# With permissions (THIS IS THE KEY FLAG!)
claude --dangerously-skip-permissions --allowedTools "*" --autoApprove true

# Or use the launch script
chmod +x launch-claude.sh
./launch-claude.sh
```

## Scripts Available:
- `force-permissions.sh` - Nuclear option, sets up all permissions
- `claude-aggressive.sh` - Launches with aggressive permissions
- `claude-bara.sh` - Project-specific launcher
- `launch-claude.sh` - Simple launcher with correct command

## The Command is `claude` NOT `claude-code`!
All scripts have been updated to use the correct command.
