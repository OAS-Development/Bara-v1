#!/bin/bash
# Simple launcher for Claude Code with the correct command

echo "Launching Claude Code..."
claude --dangerously-skip-permissions --allowedTools "*" --autoApprove true
