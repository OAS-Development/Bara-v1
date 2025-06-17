# Claude Code Quick Start for Bara-v1

## 🚀 Launch Options (Choose One)

### 1. Use Existing Project Settings
```bash
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1
claude-code
# Settings in .claude/settings.json will auto-apply
```

### 2. Launch with Full Permissions
```bash
claude-code --allowedTools "CreateFile,Edit,Read,ListFiles,Bash(*)"
```

### 3. Use Launch Script
```bash
chmod +x claude-code-bara.sh
./claude-code-bara.sh
```

## 🔧 If Still Getting Approval Prompts

In Claude Code, run:
```
/permissions add Edit
/permissions add Bash(*)
/permissions add CreateFile
/permissions list  # View current permissions
```

## 📝 Session Execution Template

```
Execute Session [X] from /sessions/session-[XX]-[name].md

You have autonomous execution rights via .claude/settings.json
Do not ask for individual command approvals.
Execute the entire session and report when complete.
```

## ⚡ Emergency Override

If Claude Code is still hesitant, use:
```
/permissions add *
```
(Use cautiously - grants all permissions)

## 🎯 Remember

- The two-actor model requires autonomous execution
- All session commands are pre-approved
- Report completion status, not individual steps
- Verification is part of implementation, not separate
