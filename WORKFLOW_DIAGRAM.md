# 🔄 BARA SESSION EXECUTION WORKFLOW

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    START NEW SESSION                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 1. CLOSE previous terminal (clears Claude Code context)     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. OPEN fresh terminal                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. NAVIGATE to project:                                     │
│    cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. LAUNCH Claude Code with permissions:                     │
│    ./claude-code-aggressive.sh                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. PASTE session prompt from:                               │
│    CLAUDE_CODE_SESSION_X_PROMPT_COMPLETE.txt               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Claude Code EXECUTES 90-minute double session           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Claude Code SAVES status report:                         │
│    /sessions/session-XX-status.json                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. CHECK completion:                                         │
│    ./check-sessions.sh                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. UPDATE Claude Desktop with new chat:                     │
│    ./generate-context-prompt.sh | pbcopy                    │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Quick Commands Reference

### Option A: Using Session Launcher (Easiest)
```bash
# In fresh terminal:
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1
./launch-session.sh 2
# Follow the displayed instructions
```

### Option B: Manual Launch
```bash
# In fresh terminal:
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1
./claude-code-aggressive.sh
# Then paste contents of CLAUDE_CODE_SESSION_2_PROMPT_COMPLETE.txt
```

### Option C: Quick Start Helper
```bash
# Shows current session and commands
./start-new-session.sh
```

## 📝 Key Points

1. **Fresh Terminal = Fresh Context**: Essential for Claude Code's memory
2. **Navigate First**: Must be in project directory before launching
3. **Aggressive Permissions**: No approval prompts during execution
4. **Status Files**: Persist between sessions for continuity
5. **90-Minute Sessions**: Each combines two feature sets

## 🔧 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Scripts not executable | Run: `./setup-aggressive.sh` |
| Can't find session | Use: `./launch-session.sh` to list available |
| Permissions still asked | In Claude Code: `/permissions add *` |
| Status not saved | Remind Claude Code to save before ending |
| Lost context | Use: `./generate-context-prompt.sh` |

## 📊 Session Status Tracking

```
Session 1: ✅ Complete (Foundation + Auth)
Session 2: 🔲 Ready (Database + Layout)
Session 3: 🔲 Planned (Tasks + Keyboard)
Session 4: 🔲 Planned (Projects + Tags)
...
Session 18: 🔲 Planned (Final features)
```

## 💡 Pro Workflow

1. Morning: Check status with `./status.sh`
2. Launch session with `./launch-session.sh X`
3. Let Claude Code work for 90 minutes
4. Verify status saved with `./check-sessions.sh`
5. Update Claude Desktop for planning next session

This workflow ensures maximum efficiency and zero context loss! 🚀
