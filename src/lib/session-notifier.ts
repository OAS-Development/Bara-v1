// Session Completion Notifier for Node.js/TypeScript projects
// Add this to your project for completion notifications

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class SessionNotifier {
  // Play system sound
  static async playSound() {
    try {
      if (process.platform === 'darwin') {
        // macOS sounds
        await execAsync('afplay /System/Library/Sounds/Glass.aiff');
      } else if (process.platform === 'win32') {
        // Windows beep
        process.stdout.write('\x07');
      } else {
        // Linux/Unix bell
        process.stdout.write('\x07');
      }
    } catch (error) {
      // Fallback to terminal bell
      console.log('\x07');
    }
  }

  // Show desktop notification
  static async showNotification(title: string, message: string) {
    try {
      if (process.platform === 'darwin') {
        // macOS notification
        await execAsync(`osascript -e 'display notification "${message}" with title "${title}" sound name "Glass"'`);
      } else if (process.platform === 'win32') {
        // Windows notification (requires node-notifier)
        console.log(`[NOTIFICATION] ${title}: ${message}`);
      } else {
        // Linux notification
        await execAsync(`notify-send "${title}" "${message}"`);
      }
    } catch (error) {
      console.log(`[NOTIFICATION] ${title}: ${message}`);
    }
  }

  // Speak message (macOS only)
  static async speak(message: string) {
    if (process.platform === 'darwin') {
      try {
        await execAsync(`say "${message}"`);
      } catch (error) {
        // Silent fail
      }
    }
  }

  // Combined notification
  static async notifyComplete(sessionNumber?: number) {
    const message = sessionNumber 
      ? `Session ${sessionNumber} complete!` 
      : 'Claude Code session complete!';
    
    console.log('\n🎉 ================================');
    console.log(`🎉 ${message}`);
    console.log('🎉 ================================\n');

    // Fire all notifications in parallel
    await Promise.all([
      this.playSound(),
      this.showNotification('Claude Code', message),
      this.speak(message)
    ]);
  }
}

// Example usage:
// await SessionNotifier.notifyComplete(6);

// For use in build scripts
if (require.main === module) {
  SessionNotifier.notifyComplete(parseInt(process.argv[2]) || undefined);
}
