#!/bin/bash
# Make this file executable with: chmod +x claude-code-bara.sh
# Launch Claude Code with full permissions for Bara development

# Navigate to project directory
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1

# Launch Claude Code with all necessary permissions
claude-code \
  --allowedTools "CreateFile,Edit,Read,ListFiles,Bash(*)" \
  --context "Bara-v1 two-actor model: autonomous session execution" \
  "$@"
