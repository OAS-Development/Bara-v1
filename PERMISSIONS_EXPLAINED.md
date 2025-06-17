# Claude Code Permissions - The Real Story

## The Problem
Claude Code's permission system has multiple layers that conflict:

1. **Command-line flags** - Most don't actually exist
2. **`.claude/settings.json`** - Should work but gets overridden
3. **`.claude/settings.local.json`** - Takes precedence, created by "don't ask again" clicks
4. **`~/.claude.json`** - Global settings (if exists)
5. **`/permissions add *`** - Should work but seems temporary

## The Hierarchy (highest to lowest priority)
1. `settings.local.json` (project-specific, created by user actions)
2. `settings.json` (project-specific, our aggressive settings)  
3. `~/.claude.json` (global)
4. Command-line flags (most don't exist)

## The Solution

### Step 1: Clean Everything
```bash
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1
./fix-permissions.sh
```

### Step 2: Start Fresh
1. Close Claude Code completely
2. Start with just: `claude`
3. Our aggressive `settings.json` should now be respected

### Step 3: If Still Broken
The nuclear option - create a global config:
```bash
cp /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/.claude/settings.json ~/.claude.json
```

## What We Learned
- `settings.local.json` is the villain
- It gets created every time you click "don't ask again"
- It only contains specific commands, not wildcards
- It overrides everything else

## Going Forward
- Always delete `settings.local.json` before starting
- Use `/permissions add *` as backup
- Consider copying aggressive settings to global
- Accept that the permission system is broken by design
