# CRITICAL UI FIX: Text Input Colors

## The Problem
Text inputs have white text on white background, making them unreadable.

## Quick Fix for Claude Code
Add this to your global CSS or create a fix file:

```css
/* Add to src/app/globals.css or create src/styles/input-fix.css */

/* Fix all input text colors */
input, 
textarea,
select,
.input,
[contenteditable="true"] {
  color: black !important;
  background-color: white !important;
}

/* Dark mode support */
.dark input,
.dark textarea,
.dark select,
.dark .input,
.dark [contenteditable="true"] {
  color: white !important;
  background-color: rgb(31, 41, 55) !important; /* gray-800 */
}

/* Placeholder text */
input::placeholder,
textarea::placeholder {
  color: rgb(156, 163, 175) !important; /* gray-400 */
}

.dark input::placeholder,
.dark textarea::placeholder {
  color: rgb(107, 114, 128) !important; /* gray-500 */
}
```

## Apply the Fix
1. Add the above CSS to your global styles
2. Or create a new component that includes these styles
3. Restart the dev server
