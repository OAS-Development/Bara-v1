# Bara-v1 Figma Component Specifications

## Design System Tokens

### Color Palette (Dark Theme)

#### Background Colors
- **Primary Background**: #0a0a0b (gray-950)
- **Surface Background**: #1f2937 (gray-800)
- **Hover Background**: rgba(31, 41, 55, 0.5) (gray-800/50)
- **Card Background**: var(--card)
- **Input Background**: var(--background)

#### Text Colors
- **Primary Text**: #ffffff (white)
- **Secondary Text**: #d1d5db (gray-300)
- **Muted Text**: #9ca3af (gray-500)
- **Link Text**: var(--primary)

#### Border Colors
- **Primary Border**: #1f2937 (gray-800)
- **Secondary Border**: #4b5563 (gray-600)
- **Input Border**: var(--input)

#### Accent Colors
- **Primary Blue**: #2563eb (blue-600)
- **Focus Blue**: #3b82f6 (blue-500)
- **Focus Ring**: #60a5fa (blue-400)
- **Error/Overdue**: #991b1b (red-950/20)
- **Error Text**: #f87171 (red-400)
- **Warning/Due**: #fbbf24 (yellow-400)

#### Component States
- **Destructive**: var(--destructive)
- **Secondary**: var(--secondary)
- **Accent**: var(--accent)

### Typography Scale

#### Font Sizes
- **2xl**: 24px (1.5rem) - Card titles
- **xl**: 20px (1.25rem) - App title
- **base**: 16px (1rem) - Default
- **sm**: 14px (0.875rem) - Body text
- **xs**: 12px (0.75rem) - Small text, metadata

#### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600

#### Text Transforms
- **Uppercase**: Section headers

### Spacing System

#### Padding
- **xs**: 4px (p-1)
- **sm**: 8px (p-2)
- **md**: 16px (p-4)
- **lg**: 24px (p-6)

#### Component Gaps
- **sm**: 8px (gap-2)
- **md**: 12px (gap-3)
- **lg**: 16px (gap-4)

#### Specific Paddings
- **Button Default**: px-4 py-2 (16px, 8px)
- **Button Small**: px-3 (12px)
- **Button Large**: px-8 (32px)
- **Input**: px-3 py-2 (12px, 8px)
- **Card**: p-6 (24px)

### Layout Dimensions

#### Component Heights
- **Toolbar/Header**: 48px (h-12)
- **Quick Entry Bar**: 56px (h-14)
- **Button Default**: 40px (h-10)
- **Button Small**: 36px (h-9)
- **Button Large**: 44px (h-11)
- **Input**: 40px (h-10)
- **Icon Button**: 40px (h-10 w-10)

#### Component Widths
- **Sidebar**: 280px
- **Main Content**: Flexible
- **Inspector**: 320px
- **Full Screen**: 1400px

### Border Radius
- **Small**: 4px (rounded)
- **Medium**: 6px (rounded-md)
- **Large**: 8px (rounded-lg)

### Icons
- **Small**: 12px (h-3 w-3)
- **Default**: 16px (h-4 w-4)
- **Large**: 20px (h-5 w-5)

### Effects
- **Card Shadow**: 0 1px 2px 0 rgba(0, 0, 0, 0.05) (shadow-sm)
- **Focus Ring**: 2px solid with 2px offset
- **Hover Opacity**: 0.9 (90%)
- **Disabled Opacity**: 0.5 (50%)

## Component Specifications

### 1. Layout Components

#### Sidebar Component
```
Frame: Sidebar
- Width: 280px
- Height: 100%
- Fill: #0a0a0b (gray-950)
- Auto Layout: Vertical
- Padding: 0
- Item Spacing: 0

Children:
1. App Title Section
   - Height: Auto
   - Padding: 16px
   - Border Bottom: 1px #1f2937
   - Text: "Bara" (20px, Semibold)

2. Navigation Sections
   - Section Header: 12px, Semibold, Uppercase, #9ca3af
   - Padding: 8px horizontal, 4px vertical
   
3. Navigation Items
   - Height: Auto
   - Padding: 6px vertical, 8px horizontal
   - Border Radius: 6px
   - Gap: 8px
   - Default: Text #d1d5db
   - Hover: Background #1f2937
   - Active: Background #2563eb, Text #ffffff
   - Icon: 16x16px

4. User Menu
   - Height: Auto
   - Padding: 16px
   - Border Top: 1px #1f2937
```

#### MainContent Component
```
Frame: MainContent
- Width: Flexible (fill)
- Height: 100%
- Auto Layout: Vertical
- Padding: 0

Children:
1. Toolbar
   - Height: 48px
   - Border Bottom: 1px #1f2937
   - Padding: 0 16px
   - Align: Center

2. Content Area
   - Height: Fill
   - Overflow: Scroll

3. Quick Entry Bar
   - Height: 56px
   - Border Top: 1px #1f2937
   - Padding: 0 16px
   - Contains: Input field (fill width)
```

#### Inspector Component
```
Frame: Inspector
- Width: 320px
- Height: 100%
- Fill: #0a0a0b (gray-950)
- Auto Layout: Vertical

Children:
1. Header
   - Height: 48px
   - Border Bottom: 1px #1f2937
   - Padding: 0 16px
   - Justify: Space Between
   - Title: 14px, Semibold
   - Close Icon: 16x16px

2. Content
   - Padding: 16px
   - Fill Height
```

### 2. UI Components

#### Button Component
```
Component Set: Button
Variants:
- variant: default | destructive | outline | secondary | ghost | link
- size: default | sm | lg | icon

Base Properties:
- Border Radius: 6px
- Font Size: 14px
- Font Weight: 500
- Transition: All
- Focus Ring: 2px #3b82f6, 2px offset

Variant Styles:
default:
  - Fill: var(--primary)
  - Text: var(--primary-foreground)
  - Hover: 90% opacity

destructive:
  - Fill: var(--destructive)
  - Text: var(--destructive-foreground)
  - Hover: 90% opacity

outline:
  - Border: 1px var(--input)
  - Fill: var(--background)
  - Hover Fill: var(--accent)

secondary:
  - Fill: var(--secondary)
  - Text: var(--secondary-foreground)
  - Hover: 80% opacity

ghost:
  - Fill: transparent
  - Hover Fill: var(--accent)

link:
  - Fill: transparent
  - Text: var(--primary)
  - Underline on hover

Size Styles:
default: Height 40px, Padding 16px horizontal, 8px vertical
sm: Height 36px, Padding 12px horizontal
lg: Height 44px, Padding 32px horizontal
icon: 40x40px
```

#### Input Component
```
Component: Input
- Height: 40px
- Width: 100%
- Border: 1px var(--input)
- Border Radius: 6px
- Fill: var(--background)
- Padding: 12px horizontal, 8px vertical
- Font Size: 14px

States:
- Default: Border var(--input)
- Focus: Ring 2px var(--ring), Ring Offset 2px
- Disabled: Opacity 50%, Cursor not-allowed
- Error: Border var(--destructive)

Placeholder:
- Color: var(--muted-foreground)
```

#### Card Component
```
Component Set: Card
- Border Radius: 8px
- Border: 1px var(--border)
- Fill: var(--card)
- Shadow: 0 1px 2px rgba(0,0,0,0.05)

Sub-components:
CardHeader:
  - Padding: 24px
  - Gap: 6px

CardTitle:
  - Font Size: 24px
  - Font Weight: 600
  - Line Height: 1

CardDescription:
  - Font Size: 14px
  - Color: var(--muted-foreground)

CardContent:
  - Padding: 24px
  - Padding Top: 0

CardFooter:
  - Padding: 24px
  - Padding Top: 0
  - Align: Center
```

### 3. Task Components

#### TaskItem Component
```
Frame: TaskItem
- Width: 100%
- Height: Auto
- Padding: 12px vertical, 16px horizontal
- Border Bottom: 1px #1f2937
- Gap: 12px
- Align: Start
- Cursor: Pointer

States:
- Default: Transparent
- Hover: Fill rgba(31, 41, 55, 0.5)
- Selected: Fill #1f2937
- Overdue: Fill rgba(153, 27, 27, 0.2)

Children:
1. Checkbox
   - Size: 20x20px
   - Border: 1px #d1d5db
   - Border Radius: 3px
   - Checked: Fill #2563eb, Checkmark white

2. Task Content
   - Auto Layout: Vertical
   - Gap: 4px
   - Title: 14px, Default color
   - Completed: Line-through, #9ca3af

3. Metadata
   - Auto Layout: Horizontal
   - Gap: 8px
   - Font Size: 12px
   - Color: #9ca3af
   - Icons: 12x12px
   - Due Date Colors:
     - Overdue: #f87171
     - Due Today: #fbbf24
```

#### QuickEntry Component
```
Frame: QuickEntry
- Width: 100%
- Height: 50px
- Padding: 8px vertical, 12px horizontal
- Auto Layout: Horizontal
- Gap: 8px
- Align: Center

Children:
1. Input Field
   - Fill Width
   - Same specs as Input component
   
2. Add Button
   - Icon Button variant
   - Plus icon
```

### 4. Navigation Components

#### NavigationItem Component
```
Frame: NavigationItem
- Width: 240px
- Height: 36px
- Padding: 8px vertical, 12px horizontal
- Border Radius: 6px
- Auto Layout: Horizontal
- Gap: 8px
- Align: Center

States:
- Default: Transparent, Text #d1d5db
- Hover: Fill #1f2937
- Active: Fill #2563eb, Text #ffffff

Children:
1. Icon
   - Size: 16x16px
   - Color: Inherit from parent
   
2. Label
   - Font Size: 14px
   - Color: Inherit from parent
```

### 5. Screen Layouts

#### Dashboard Layout
```
Frame: Dashboard
- Width: 1400px
- Height: 1024px
- Auto Layout: Horizontal
- Gap: 0

Structure:
1. Sidebar (280px)
2. MainContent (Fill)
3. Inspector (320px)
```

#### Task Management Layout
```
Frame: TasksScreen
- Base: Dashboard Layout

MainContent Contains:
1. Header with view controls
2. Task filters
3. Task list with multiple TaskItem instances
4. Quick entry at bottom
```

## Component Mapping

### React to Figma Mapping
```
src/components/layout/sidebar.tsx → Sidebar
src/components/layout/main-content.tsx → MainContent
src/components/layout/inspector.tsx → Inspector
src/components/tasks/task-list.tsx → TaskList (container)
src/components/tasks/task-item.tsx → TaskItem
src/components/tasks/quick-entry.tsx → QuickEntry
src/components/ui/button.tsx → Button
src/components/ui/input.tsx → Input
src/components/ui/card.tsx → Card
src/components/ui/checkbox.tsx → Checkbox
src/components/projects/project-item.tsx → ProjectItem
src/components/tags/tag-chip.tsx → TagChip
```

## Implementation Notes

1. All components should use Figma's Auto Layout for responsive behavior
2. Use Figma Variables for the color system to enable easy theming
3. Create component variants for all states and sizes
4. Use consistent naming convention: ComponentName/Variant/State
5. Group related components in the same page/frame
6. Document any deviations from the React implementation

## Phase 2A Workflow

1. Designer edits Figma components
2. Changes are documented in Figma
3. Developer reviews changes in Figma
4. Developer implements changes in React code
5. Visual QA against Figma designs
6. Iterate as needed