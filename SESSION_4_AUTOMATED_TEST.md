# Session 4 Automated Test Script

This script will automatically test all Session 4 features without manual clicking.

## To Run:
1. Make sure dev server is running: `npm run dev`
2. In a new terminal: `npm test:session4`

## What it tests:
- Projects: Creates, edits, deletes
- Tags: Creates with colors, assigns to tasks
- Dates: Sets defer/due dates, verifies filtering
- Perspectives: Creates custom views, verifies persistence
- Reviews: Marks projects for review
- Import: Tests file upload UI
- Data persistence: Verifies after page reload

## Test Results:
- ✅ Pass: Feature works correctly
- ❌ Fail: Feature has issues
- ⚠️ Warning: Feature works but has UI issues

The script will generate a report: `session-04-test-results.json`
