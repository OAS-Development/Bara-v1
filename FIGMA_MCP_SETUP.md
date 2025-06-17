# Figma MCP Setup Guide

This guide provides step-by-step instructions for connecting Claude to Figma using the ClaudeTalkToFigma MCP (Model Context Protocol) server.

## Prerequisites

- Figma desktop app installed
- Claude Code CLI installed
- Node.js installed (for npm)
- A Figma file open in the desktop app

## Setup Instructions

### Step 1: Install Bun Runtime

The Figma MCP WebSocket server requires Bun runtime. Install it by running:

```bash
curl -fsSL https://bun.sh/install | bash
```

After installation, add Bun to your PATH:
```bash
export PATH="$HOME/.bun/bin:$PATH"
```

### Step 2: Install ClaudeTalkToFigma MCP

Install the MCP server globally using npm:

```bash
npm install -g claude-talk-to-figma-mcp@latest
```

### Step 3: Install the Figma Plugin

1. Open Figma desktop app
2. Go to **Plugins** → **Development** → **Import plugin from manifest**
3. Navigate to the ClaudeTalkToFigma plugin folder
4. Select the manifest.json file

### Step 4: Start the WebSocket Server

The WebSocket server acts as a bridge between Claude and Figma. Start it with:

```bash
# Find the socket.js file location
find ~/.npm -name "socket.js" | grep claude-talk-to-figma

# Start the server (replace path with your actual path)
bun ~/.npm/_npx/[your-hash]/node_modules/claude-talk-to-figma-mcp/dist/socket.js
```

You should see:
```
[INFO] Claude to Figma WebSocket server running on port 3055
[INFO] Status endpoint available at http://localhost:3055/status
```

To run it in the background:
```bash
bun ~/.npm/_npx/[your-hash]/node_modules/claude-talk-to-figma-mcp/dist/socket.js > /tmp/figma-websocket.log 2>&1 &
```

### Step 5: Connect Figma Plugin

1. Open a Figma file
2. Go to **Plugins** → **Development** → **ClaudeTalkToFigma**
3. In the plugin window, ensure the port is set to `3055`
4. Click **Connect**
5. The status should change from "Disconnected from server" to "Connected"

### Step 6: Start Claude with MCP

In a new terminal, start Claude with the MCP configuration:

```bash
claude --mcp figma --dangerously-skip-permissions
```

### Step 7: Verify Connection

You can verify the WebSocket server is running by checking its status:

```bash
curl http://localhost:3055/status
```

This should return JSON with server statistics.

## Troubleshooting

### Connection Refused Error

If you see "ERR_CONNECTION_REFUSED" in the Figma console:
1. Ensure the WebSocket server is running (Step 4)
2. Check that port 3055 is not blocked by firewall
3. Verify the server is listening: `lsof -i :3055`

### Plugin Not Appearing

- Make sure you've correctly imported the plugin manifest in Figma
- Restart Figma if necessary
- Check Figma console for errors: **Plugins** → **Development** → **Open Console**

### Server Crashes

If the WebSocket server crashes:
1. Check the log file: `cat /tmp/figma-websocket.log`
2. Kill any existing processes: `pkill -f socket.js`
3. Restart the server

### MCP Not Connecting

- Ensure you're using the correct MCP name: `--mcp figma`
- Check Claude's MCP configuration is correct
- Restart Claude after configuration changes

## Available MCP Tools

Once connected, Claude can use these Figma tools:
- `get_document_info` - Get document details
- `get_selection` - Get current selection info
- `get_node_info` - Get specific node details
- `get_styles` - Get all document styles
- `get_local_components` - Get local components
- `export_node_as_image` - Export nodes as images

## Quick Start Script

Create a script to start both servers:

```bash
#!/bin/bash
# figma-mcp-start.sh

# Start WebSocket server in background
echo "Starting WebSocket server..."
bun ~/.npm/_npx/*/node_modules/claude-talk-to-figma-mcp/dist/socket.js > /tmp/figma-websocket.log 2>&1 &
WEBSOCKET_PID=$!

echo "WebSocket server started (PID: $WEBSOCKET_PID)"
echo "Waiting for server to initialize..."
sleep 3

# Check if server is running
if curl -s http://localhost:3055/status > /dev/null; then
    echo "✅ WebSocket server is running on port 3055"
    echo ""
    echo "Next steps:"
    echo "1. Open Figma and connect the plugin"
    echo "2. Run: claude --mcp figma --dangerously-skip-permissions"
else
    echo "❌ WebSocket server failed to start"
    echo "Check logs: cat /tmp/figma-websocket.log"
fi
```

Make it executable: `chmod +x figma-mcp-start.sh`

## Architecture Overview

```
Figma Desktop App
       ↓
ClaudeTalkToFigma Plugin
       ↓
WebSocket (Port 3055)
       ↓
WebSocket Server (Bun)
       ↓
MCP Server
       ↓
Claude Desktop
```

## Notes

- The WebSocket server must be running before connecting the Figma plugin
- Keep the Figma file open while using the MCP connection
- The connection persists across Claude conversations
- Server logs are helpful for debugging connection issues