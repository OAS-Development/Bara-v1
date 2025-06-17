# 🚨 AGGRESSIVE PERMISSIONS SETUP FOR BARA-V1

## Quick Start (ZERO APPROVALS)

### Option 1: Use the Aggressive Launch Script
```bash
chmod +x claude-code-aggressive.sh
./claude-code-aggressive.sh
```

### Option 2: Manual Launch with All Permissions
```bash
# Remove any restrictive settings first
rm .claude/settings.local.json 2>/dev/null

# Launch with full permissions
claude-code --allowedTools "*" --autoApprove true
```

### Option 3: Set Global Permissions (Nuclear Option)
```bash
# Copy aggressive settings globally (affects ALL projects)
cp .claude/global-settings-example.json ~/.claude.json
```

## 🔥 If Claude Code STILL Asks for Permissions

1. **In Claude Code, immediately run:**
   ```
   /permissions add *
   /permissions set autoApprove true
   ```

2. **Nuclear Override Command:**
   ```
   /settings set requireConfirmation false
   /settings set trustLevel maximum
   ```

3. **Check Current Settings:**
   ```
   /permissions list
   /settings show
   ```

## ⚡ What These Settings Do

- `allowedTools: ["*"]` - Allows ALL tools without restriction
- `autoApprove: true` - Automatically approves all actions
- `skipConfirmations: true` - Bypasses all confirmation prompts
- `trustLevel: "maximum"` - Highest trust level possible
- `bashPermissions.allowAll: true` - Unrestricted bash command execution
- `filePermissions.allowAll: true` - Unrestricted file system access

## 🎯 Session Execution with Zero Friction

Start your session with this message to Claude Code:
```
AUTONOMOUS MODE ACTIVE: Execute Session X from /sessions/session-XX.md
Settings grant full permissions. Execute without confirmations.
```

## ⚠️ Important Notes

1. These settings completely disable Claude Code's safety features
2. Only use for trusted projects where you want maximum speed
3. The `.claude/settings.json` applies only to this project
4. The global `~/.claude.json` would affect ALL projects (use carefully)

## 🛠️ Troubleshooting

If permissions are still being requested:

1. **Check for conflicting settings:**
   ```bash
   ls -la .claude/
   cat .claude/settings.local.json  # This overrides settings.json
   ```

2. **Force remove all local overrides:**
   ```bash
   rm .claude/settings.local.json
   rm .claude/preferences.json
   ```

3. **Verify settings loaded:**
   In Claude Code: `/settings show`

## 🚀 Maximum Speed Development

With these settings, Claude Code will:
- Never ask for file creation/edit approval
- Never ask for command execution approval  
- Never ask for git operations approval
- Never ask for npm/package installation approval
- Execute entire sessions without interruption

This is exactly what the two-actor model requires for efficient development!
