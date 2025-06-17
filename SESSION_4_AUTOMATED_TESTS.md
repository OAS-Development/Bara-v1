# Session 4 Automated Test Suite

## Setup Automated Testing

### 1. Install Testing Dependencies
```bash
npm install --save-dev @playwright/test
npx playwright install
```

### 2. Create Test Configuration
Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### 3. Create Automated Test Suite
Create `tests/session-04.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

// Test user credentials
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'testpassword123';

test.describe('Session 4: GTD Core Features', () => {
  test.beforeEach(async ({ page }) => {
    // Login or create test account
    await page.goto('/');
    // Add your login logic here
  });

  test.describe('Projects', () => {
    test('create and manage projects', async ({ page }) => {
      await page.goto('/projects');
      
      // Create parent project
      await page.click('[data-testid="new-project-button"]');
      await page.fill('[name="name"]', 'Test Project 1');
      await page.selectOption('[name="type"]', 'parallel');
      await page.fill('[name="description"]', 'Test description');
      await page.fill('[name="reviewInterval"]', '7');
      await page.click('[data-testid="save-project"]');
      
      // Verify project created
      await expect(page.locator('text=Test Project 1')).toBeVisible();
      
      // Create sub-project
      await page.click('[data-testid="add-subproject-Test Project 1"]');
      await page.fill('[name="name"]', 'Test Sub-Project');
      await page.selectOption('[name="type"]', 'sequential');
      await page.click('[data-testid="save-project"]');
      
      // Verify hierarchy
      await expect(page.locator('[data-testid="project-hierarchy"]')).toContainText('Test Sub-Project');
    });
  });

  test.describe('Tags', () => {
    test('create and assign tags', async ({ page }) => {
      await page.goto('/tags');
      
      // Create tags
      const tags = [
        { name: 'Work', color: '#ff0000' },
        { name: 'Personal', color: '#0000ff' },
        { name: 'Urgent', color: '#ff8800' }
      ];
      
      for (const tag of tags) {
        await page.click('[data-testid="new-tag-button"]');
        await page.fill('[name="name"]', tag.name);
        await page.fill('[name="color"]', tag.color);
        await page.click('[data-testid="save-tag"]');
        await expect(page.locator(`text=${tag.name}`)).toBeVisible();
      }
      
      // Test tag assignment
      await page.goto('/inbox');
      await page.fill('[data-testid="quick-entry"]', 'Test task with tags');
      await page.click('[data-testid="tag-picker"]');
      await page.click('text=Work');
      await page.click('text=Personal');
      await page.keyboard.press('Enter');
      
      // Verify tags displayed
      await expect(page.locator('[data-testid="task-tags"]')).toContainText('Work');
      await expect(page.locator('[data-testid="task-tags"]')).toContainText('Personal');
    });
  });

  test.describe('Dates', () => {
    test('set defer and due dates', async ({ page }) => {
      await page.goto('/inbox');
      
      // Create task with dates
      await page.fill('[data-testid="quick-entry"]', 'Task with dates');
      await page.click('[data-testid="date-picker"]');
      
      // Set defer date to today
      await page.click('[data-testid="defer-today"]');
      
      // Set due date to tomorrow
      await page.click('[data-testid="due-tomorrow"]');
      
      await page.keyboard.press('Enter');
      
      // Verify in Today view
      await page.goto('/today');
      await expect(page.locator('text=Task with dates')).toBeVisible();
      
      // Verify in Forecast view
      await page.goto('/forecast');
      await expect(page.locator('[data-testid="forecast-grid"]')).toContainText('Task with dates');
    });
  });

  test.describe('Perspectives', () => {
    test('create custom perspectives', async ({ page }) => {
      await page.goto('/perspectives');
      
      // Create Work Focus perspective
      await page.click('[data-testid="new-perspective"]');
      await page.fill('[name="name"]', 'Work Focus');
      await page.click('[data-testid="add-filter"]');
      await page.selectOption('[name="filterType"]', 'tag');
      await page.selectOption('[name="tag"]', 'Work');
      await page.click('[data-testid="save-perspective"]');
      
      // Verify perspective saved
      await expect(page.locator('text=Work Focus')).toBeVisible();
      
      // Test perspective filtering
      await page.click('text=Work Focus');
      // Should only show tasks with Work tag
    });
  });

  test.describe('Reviews', () => {
    test('project review system', async ({ page }) => {
      await page.goto('/review');
      
      // Check review stats
      await expect(page.locator('[data-testid="review-stats"]')).toBeVisible();
      
      // Start review if available
      const startButton = page.locator('[data-testid="start-review"]');
      if (await startButton.isVisible()) {
        await startButton.click();
        
        // Complete one review
        await page.click('[data-testid="review-complete"]');
        
        // Verify stats updated
        await expect(page.locator('[data-testid="reviews-completed"]')).toContainText('1');
      }
    });
  });

  test.describe('Import', () => {
    test('import preview', async ({ page }) => {
      await page.goto('/import');
      
      // Create test CSV
      const csvContent = `Title,Project,Context,Defer Date,Due Date
Task 1,Project A,Work,2024-01-01,2024-01-15
Task 2,Project B,Personal,2024-01-02,2024-01-20`;
      
      // Upload file
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.click('[data-testid="file-upload"]')
      ]);
      
      // Create file from string
      const buffer = Buffer.from(csvContent, 'utf-8');
      await fileChooser.setFiles([{
        name: 'test.csv',
        mimeType: 'text/csv',
        buffer
      }]);
      
      // Verify preview
      await expect(page.locator('[data-testid="import-preview"]')).toContainText('Task 1');
      await expect(page.locator('[data-testid="import-preview"]')).toContainText('Task 2');
    });
  });

  test.describe('Data Persistence', () => {
    test('data persists after refresh', async ({ page }) => {
      // Create test data
      await page.goto('/inbox');
      await page.fill('[data-testid="quick-entry"]', 'Persistence test task');
      await page.keyboard.press('Enter');
      
      // Refresh
      await page.reload();
      
      // Verify data still exists
      await expect(page.locator('text=Persistence test task')).toBeVisible();
    });
  });
});

// Additional test for checking database tables
test('verify database tables exist', async ({ request }) => {
  const response = await request.get('/api/debug/tables');
  expect(response.ok()).toBeTruthy();
  
  const data = await response.json();
  expect(data.tables).toContain('projects');
  expect(data.tables).toContain('tags');
  expect(data.tables).toContain('perspectives');
  expect(data.tables).toContain('task_tags');
});
```

### 4. Add Test Scripts
Add to `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:session4": "playwright test tests/session-04.spec.ts"
  }
}
```

### 5. Run Automated Tests
```bash
# Run all tests
npm run test:e2e

# Run with UI (interactive)
npm run test:e2e:ui

# Run only Session 4 tests
npm run test:session4

# Debug mode
npm run test:e2e:debug
```

## Benefits
1. **Automated**: No manual clicking required
2. **Repeatable**: Run anytime to verify functionality
3. **Fast**: Tests run in parallel
4. **Visual**: Can watch tests run or review recordings
5. **CI/CD Ready**: Can run in GitHub Actions

## Quick Start
```bash
# 1. Install Playwright
npm install --save-dev @playwright/test

# 2. Copy the test file to your project

# 3. Run tests
npm run test:session4
```

This will automatically test all Session 4 features and generate a report!
