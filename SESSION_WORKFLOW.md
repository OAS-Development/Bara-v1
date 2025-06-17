# 🚀 BARA SESSION WORKFLOW - QUICK REFERENCE

## Complete Session Execution Flow

### 1️⃣ Check Current Status
```bash
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1
./status.sh
```

### 2️⃣ Launch a Session (Easy Way)
```bash
./launch-session.sh 2    # For Session 2
```
This will show you exactly what to copy and paste!

### 3️⃣ Launch a Session (Manual Way)
Open a **fresh terminal** for each session:
```bash
# Navigate to project
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1

# Start Claude Code with full permissions
./claude-code-aggressive.sh

# Once Claude Code starts, paste the session prompt
# Find prompts in: CLAUDE_CODE_SESSION_X_PROMPT_COMPLETE.txt
```

### 4️⃣ After Session Completion
```bash
# Check that status was saved
./check-sessions.sh

# View specific session status
cat sessions/session-02-status.json | jq
```

### 5️⃣ Start New Claude Desktop Chat
```bash
# Generate context prompt
./generate-context-prompt.sh | pbcopy
# Then paste in new Claude Desktop chat
```

## 📝 Important Notes

1. **Fresh Terminal**: Always start with a new terminal for each session (clears Claude Code's context)
2. **Navigation First**: Must cd to project directory before launching Claude Code
3. **Aggressive Script**: The `claude-code-aggressive.sh` script enables all permissions
4. **Status Reports**: Claude Code must save status to `/sessions/session-XX-status.json`
5. **Double Sessions**: All sessions are 90 minutes combining two feature sets

## 🔧 Troubleshooting

If Claude Code asks for permissions despite aggressive settings:
```
/permissions add *
```

If scripts aren't executable:
```bash
./setup-aggressive.sh
```

## 📊 Session Status at a Glance
- Session 1: ✅ Complete
- Session 2: 🔲 Ready to execute (Database + Layout)
- Session 3: 🔲 Planned (Tasks + Keyboard)
- Sessions 4-18: 📋 Mapped and ready

## 💡 Pro Tips

1. **Copy Session Prompt**: 
   ```bash
   cat CLAUDE_CODE_SESSION_2_PROMPT_COMPLETE.txt | pbcopy
   ```

2. **Quick Session Launch**:
   ```bash
   ./launch-session.sh 2
   ```

3. **Check Git Status**:
   ```bash
   git log --oneline -5
   ```

4. **View Project Structure**:
   ```bash
   tree -L 2 -I 'node_modules|.next'
   ```

Remember: The key is starting fresh for each session to maximize Claude Code's context capacity!
