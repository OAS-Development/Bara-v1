#!/bin/bash

# Session Completion Notifier for Claude Code
# This script provides multiple notification methods

# Function to play system sound (macOS)
play_sound_mac() {
    # Uses built-in macOS sounds
    afplay /System/Library/Sounds/Glass.aiff 2>/dev/null || \
    afplay /System/Library/Sounds/Hero.aiff 2>/dev/null || \
    osascript -e 'beep' 2>/dev/null
}

# Function to show notification (macOS)
show_notification_mac() {
    osascript -e "display notification \"$1\" with title \"Claude Code\" sound name \"Glass\""
}

# Function to speak message (macOS)
speak_message_mac() {
    say "$1" 2>/dev/null
}

# Terminal bell (works everywhere)
terminal_bell() {
    printf '\a'
    echo -e "\007"
}

# Main notification function
notify_completion() {
    local message="${1:-Session Complete!}"
    
    echo "🎉 ================================"
    echo "🎉 $message"
    echo "🎉 ================================"
    
    # Try multiple notification methods
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        play_sound_mac &
        show_notification_mac "$message" &
        speak_message_mac "$message" &
    fi
    
    # Universal terminal bell
    terminal_bell
}

# If called directly with a message
if [ $# -gt 0 ]; then
    notify_completion "$1"
else
    notify_completion "Claude Code Session Complete!"
fi
