#!/bin/bash
# Apple Watch Notification via ntfy (simplest method)

# Default to ntfy.sh with a unique topic
TOPIC="${NTFY_TOPIC:-bara-claude-sessions-$(whoami)}"
MESSAGE="${1:-Session Complete!}"

# Send to Apple Watch via ntfy
echo "📱 Sending notification to Apple Watch..."
curl -s -d "$MESSAGE 🎉" "https://ntfy.sh/$TOPIC" > /dev/null

echo "✅ Notification sent to topic: $TOPIC"
echo ""
echo "📲 To receive on Apple Watch:"
echo "1. Install 'ntfy' app on iPhone (free)"
echo "2. Open ntfy and tap +"
echo "3. Subscribe to topic: $TOPIC"
echo "4. Notifications will appear on your Apple Watch!"

# Also do local notification as backup
./notify-complete.sh "$MESSAGE" 2>/dev/null || true
