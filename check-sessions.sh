#!/bin/bash
# Check session status files

SESSIONS_DIR="/Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions"

echo "📊 SESSION STATUS REPORT"
echo "======================="
echo ""

# Check for status files
STATUS_FILES=$(ls "$SESSIONS_DIR"/*-status.json 2>/dev/null)

if [ -z "$STATUS_FILES" ]; then
    echo "No session status files found yet."
else
    echo "Found session status files:"
    echo ""
    
    for file in $STATUS_FILES; do
        SESSION_NAME=$(basename "$file")
        echo "📄 $SESSION_NAME"
        
        # Extract key fields
        STATUS=$(jq -r '.status // "unknown"' "$file" 2>/dev/null)
        COMPLETED_AT=$(jq -r '.completedAt // "unknown"' "$file" 2>/dev/null)
        OBJECTIVES_COUNT=$(jq -r '.completedObjectives | length // 0' "$file" 2>/dev/null)
        BLOCKERS_COUNT=$(jq -r '.blockers | length // 0' "$file" 2>/dev/null)
        
        echo "   Status: $STATUS"
        echo "   Completed: $COMPLETED_AT"
        echo "   Objectives: $OBJECTIVES_COUNT completed"
        echo "   Blockers: $BLOCKERS_COUNT"
        echo ""
    done
fi

echo "💡 To view a specific session status:"
echo "   cat $SESSIONS_DIR/session-XX-status.json | jq"
echo ""
