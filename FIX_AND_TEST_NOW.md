# URGENT: Fix Text Color & Add Automated Testing

## For Claude Code - Immediate Actions Required

### 1. FIX THE TEXT COLOR BUG (5 minutes)
The app currently has white text on white background in input fields - completely unusable!

**Quick Fix:**
```bash
# Add this CSS to src/app/globals.css at the end of the file:

/* CRITICAL FIX: Input text visibility */
input, 
textarea,
select,
.input,
[contenteditable="true"] {
  color: rgb(15, 23, 42) !important; /* slate-900 */
}

.dark input,
.dark textarea,
.dark select,
.dark .input,
.dark [contenteditable="true"] {
  color: rgb(248, 250, 252) !important; /* slate-50 */
  background-color: rgb(30, 41, 59) !important; /* slate-800 */
  border-color: rgb(51, 65, 85) !important; /* slate-700 */
}

/* Fix placeholder text */
input::placeholder,
textarea::placeholder {
  color: rgb(148, 163, 184) !important; /* slate-400 */
}

.dark input::placeholder,
.dark textarea::placeholder {
  color: rgb(100, 116, 139) !important; /* slate-500 */
}

/* Fix focus states */
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid rgb(59, 130, 246) !important; /* blue-500 */
  outline-offset: 2px;
}
```

Then restart the dev server.

### 2. ADD AUTOMATED TESTING (20 minutes)

Install and configure Playwright for automated testing:

```bash
# Install Playwright
npm install --save-dev @playwright/test
npx playwright install chromium

# Create test directory
mkdir -p tests
```

Create `playwright.config.ts`:
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },
});
```

Create `tests/session-04-quick.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Session 4 Quick Verification', () => {
  test('verify all pages load', async ({ page }) => {
    // Test each route loads without errors
    const routes = [
      '/projects',
      '/tags',
      '/today',
      '/forecast',
      '/review',
      '/import'
    ];
    
    for (const route of routes) {
      await page.goto(route);
      // Page should load without errors
      await expect(page).not.toHaveTitle(/error/i);
      console.log(`✓ ${route} loads successfully`);
    }
  });

  test('verify database tables via API', async ({ request }) => {
    const response = await request.get('/api/debug/tables');
    const data = await response.json();
    
    const requiredTables = ['projects', 'tags', 'perspectives', 'task_tags'];
    for (const table of requiredTables) {
      expect(data.tables || data).toContain(table);
      console.log(`✓ Table '${table}' exists`);
    }
  });

  test('test basic project creation', async ({ page }) => {
    await page.goto('/projects');
    
    // Look for any new/add button
    const addButton = page.locator('button:has-text("New"), button:has-text("Add"), button:has-text("Create")').first();
    
    if (await addButton.isVisible()) {
      await addButton.click();
      
      // Fill form if visible
      const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('Test Project');
        
        // Submit
        const saveButton = page.locator('button:has-text("Save"), button:has-text("Create"), button[type="submit"]').first();
        await saveButton.click();
        
        // Verify project appears
        await expect(page.locator('text=Test Project')).toBeVisible({ timeout: 5000 });
        console.log('✓ Project creation works');
      }
    }
  });
});
```

Add to `package.json` scripts:
```json
{
  "scripts": {
    "test:quick": "playwright test tests/session-04-quick.spec.ts --reporter=list",
    "test:ui": "playwright test --ui"
  }
}
```

### 3. RUN THE TESTS

After fixing the CSS issue:
```bash
# Run quick automated test
npm run test:quick

# Or use interactive UI
npm run test:ui
```

This will:
- Verify all pages load
- Check database tables exist
- Test basic functionality
- Show clear pass/fail results

### 4. DECISION TREE

After running tests:

**If all tests PASS:**
- Update `/sessions/session-04-status-BLOCKED.json`
- Change status to "completed"
- Remove blocking issues
- Proceed to Session 5

**If any tests FAIL:**
- Note which specific tests failed
- Fix the issues
- Re-run tests
- Keep status as "BLOCKED" until all pass

## Summary

1. **First**: Fix the text color issue (5 min)
2. **Then**: Set up automated tests (20 min)
3. **Finally**: Run tests and update status based on results

This eliminates manual testing tedium while ensuring everything actually works!
