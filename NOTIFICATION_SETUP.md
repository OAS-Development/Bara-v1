# Add to package.json scripts:
"scripts": {
  "notify": "node -e \"console.log('\\007'); process.exit(0)\"",
  "notify:complete": "./notify-complete.sh",
  "session:complete": "npm run notify:complete -- 'Session Complete!'"
}

# Then Claude Code can simply run:
npm run session:complete
