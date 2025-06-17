#!/bin/bash

# Quick Session 4 Verification Script
# This provides a fast way to check if Session 4 features are working

echo "🔍 Session 4 Quick Verification"
echo "=============================="

# Check if server is running
echo -n "1. Checking if dev server is running... "
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is up"
else
    echo "❌ Server not running. Start with: npm run dev"
    exit 1
fi

# Check database tables
echo -n "2. Checking database tables... "
TABLES=$(curl -s http://localhost:3000/api/debug/tables)
if [[ $TABLES == *"projects"* ]] && [[ $TABLES == *"tags"* ]] && [[ $TABLES == *"perspectives"* ]]; then
    echo "✅ All tables exist"
else
    echo "❌ Missing tables. Found: $TABLES"
    echo "   Run database migrations!"
fi

# Check each route
echo "3. Checking routes:"
ROUTES=("/projects" "/tags" "/today" "/forecast" "/review" "/import")
ALL_GOOD=true

for route in "${ROUTES[@]}"; do
    echo -n "   $route ... "
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$route)
    if [ $STATUS -eq 200 ]; then
        echo "✅"
    else
        echo "❌ (HTTP $STATUS)"
        ALL_GOOD=false
    fi
done

echo ""
echo "=============================="

if [ "$ALL_GOOD" = true ]; then
    echo "✅ BASIC CHECKS PASSED"
    echo ""
    echo "Next steps:"
    echo "1. Open http://localhost:3000 in your browser"
    echo "2. Try creating a project and a tag"
    echo "3. If everything works, update session-04-status-BLOCKED.json"
    echo ""
    echo "Or run automated tests with:"
    echo "npm run test:quick"
else
    echo "❌ SOME CHECKS FAILED"
    echo ""
    echo "Fix the issues above before proceeding to Session 5"
fi
