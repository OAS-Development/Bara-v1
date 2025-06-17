# Apple Watch Notification Setup for Claude Code

## Option 1: Pushover (Recommended - $5 one-time)
Most reliable and easiest to set up.

### Setup:
1. Download Pushover app on iPhone (transfers to Watch automatically)
2. Create account at pushover.net
3. Get your User Key and create an API Token
4. Add to `.env.local`:
   ```
   PUSHOVER_USER_KEY=your-user-key
   PUSHOVER_API_TOKEN=your-api-token
   ```

### Claude Code Usage:
```bash
# Send notification to your Apple Watch
curl -s \
  --form-string "token=$PUSHOVER_API_TOKEN" \
  --form-string "user=$PUSHOVER_USER_KEY" \
  --form-string "message=Session 6 Complete!" \
  --form-string "title=Claude Code" \
  --form-string "sound=cosmic" \
  https://api.pushover.net/1/messages.json
```

## Option 2: ntfy (Free, Self-hosted or Cloud)
Open source and free.

### Setup:
1. Install ntfy app on iPhone
2. Subscribe to a topic like: `bara-sessions`
3. No account needed!

### Claude Code Usage:
```bash
# Send notification
curl -d "Session 6 Complete! 🎉" ntfy.sh/bara-sessions
```

## Option 3: Apple Shortcuts + Webhook
Free but requires more setup.

### Setup:
1. Create Shortcut on iPhone:
   - Add "Get Contents of URL" action
   - Add "Show Notification" action
   - Enable "Show on Apple Watch"
2. Get the webhook URL from Shortcuts
3. Share the Shortcut to get a URL

### Claude Code Usage:
```bash
curl -X POST "your-shortcuts-webhook-url" \
  -H "Content-Type: application/json" \
  -d '{"message":"Session 6 Complete!"}'
```

## Option 4: IFTTT (Free tier available)
Connect anything to iOS notifications.

### Setup:
1. Install IFTTT app
2. Create applet: Webhook → iOS Notification
3. Get your webhook key

### Claude Code Usage:
```bash
curl -X POST "https://maker.ifttt.com/trigger/session_complete/with/key/YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"value1":"Session 6 Complete!"}'
```

## Integration with Session Notifier

```typescript
// src/lib/apple-watch-notifier.ts
export class AppleWatchNotifier {
  static async notify(message: string) {
    const method = process.env.NOTIFICATION_METHOD || 'pushover';
    
    switch(method) {
      case 'pushover':
        await fetch('https://api.pushover.net/1/messages.json', {
          method: 'POST',
          body: new URLSearchParams({
            token: process.env.PUSHOVER_API_TOKEN!,
            user: process.env.PUSHOVER_USER_KEY!,
            message,
            title: 'Claude Code',
            sound: 'cosmic'
          })
        });
        break;
        
      case 'ntfy':
        await fetch(`https://ntfy.sh/${process.env.NTFY_TOPIC || 'bara-sessions'}`, {
          method: 'POST',
          body: message
        });
        break;
    }
  }
}
```

## Quick Setup Script

```bash
#!/bin/bash
# notify-watch.sh

# Choose your method:
METHOD="ntfy"  # or "pushover", "ifttt", "shortcuts"

send_to_watch() {
  local message="${1:-Session Complete!}"
  
  case $METHOD in
    "ntfy")
      curl -d "$message 🎉" ntfy.sh/bara-sessions
      ;;
    "pushover")
      source .env.local
      curl -s \
        --form-string "token=$PUSHOVER_API_TOKEN" \
        --form-string "user=$PUSHOVER_USER_KEY" \
        --form-string "message=$message" \
        --form-string "title=Claude Code" \
        https://api.pushover.net/1/messages.json
      ;;
  esac
}

send_to_watch "$1"
```

## Recommended: ntfy
- ✅ Completely free
- ✅ No account required
- ✅ Works instantly
- ✅ Shows on Apple Watch
- ✅ Simple one-line command

Just install ntfy on your iPhone and Claude Code can send:
```bash
curl -d "Session Complete! 🎉" ntfy.sh/your-unique-topic
```
