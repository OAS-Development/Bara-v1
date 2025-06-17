// Bara-v1 Figma Component Creation Script
// This script documents the MCP function calls needed to create Bara components in Figma

// STEP 1: Connect to Figma Document
// Channel: p4rsoq3p
join_channel("p4rsoq3p");

// STEP 2: Get Document Information
const docInfo = await get_document_info();
console.log("Connected to document:", docInfo);

// STEP 3: Create Document Structure

// Create main pages
const designSystemPageId = create_page({ name: "Design System" });
const componentLibraryPageId = create_page({ name: "Component Library" });
const screenLayoutsPageId = create_page({ name: "Screen Layouts" });

// STEP 4: Create Design System

// Color Styles
const colors = {
  // Backgrounds
  bgPrimary: { r: 0.04, g: 0.04, b: 0.04 }, // #0a0a0b
  bgSurface: { r: 0.12, g: 0.16, b: 0.22 }, // #1f2937
  bgHover: { r: 0.12, g: 0.16, b: 0.22, a: 0.5 }, // gray-800/50
  
  // Text
  textPrimary: { r: 1, g: 1, b: 1 }, // white
  textSecondary: { r: 0.82, g: 0.84, b: 0.86 }, // #d1d5db
  textMuted: { r: 0.61, g: 0.64, b: 0.69 }, // #9ca3af
  
  // Borders
  borderPrimary: { r: 0.12, g: 0.16, b: 0.22 }, // #1f2937
  borderSecondary: { r: 0.29, g: 0.33, b: 0.39 }, // #4b5563
  
  // Accents
  primaryBlue: { r: 0.15, g: 0.39, b: 0.92 }, // #2563eb
  focusBlue: { r: 0.23, g: 0.51, b: 0.96 }, // #3b82f6
  errorRed: { r: 0.60, g: 0.11, b: 0.11, a: 0.2 }, // red-950/20
  errorText: { r: 0.97, g: 0.44, b: 0.44 }, // #f87171
  warningYellow: { r: 0.98, g: 0.75, b: 0.14 }, // #fbbf24
};

// Create color styles
Object.entries(colors).forEach(([name, color]) => {
  create_style({
    name: `Bara/${name}`,
    type: "FILL",
    color: color
  });
});

// Typography Styles
const textStyles = [
  { name: "Heading/2xl", fontSize: 24, fontWeight: 600 },
  { name: "Heading/xl", fontSize: 20, fontWeight: 600 },
  { name: "Body/base", fontSize: 16, fontWeight: 400 },
  { name: "Body/sm", fontSize: 14, fontWeight: 400 },
  { name: "Body/xs", fontSize: 12, fontWeight: 400 },
  { name: "Label/uppercase", fontSize: 12, fontWeight: 600, textCase: "UPPER" },
  { name: "Button/default", fontSize: 14, fontWeight: 500 },
];

textStyles.forEach(style => {
  create_style({
    name: `Bara/${style.name}`,
    type: "TEXT",
    ...style
  });
});

// STEP 5: Create Layout Components

// Sidebar Component
const sidebarId = create_frame({
  x: 0,
  y: 0,
  width: 280,
  height: 1024,
  name: "Sidebar",
  fillColor: colors.bgPrimary,
  parentId: componentLibraryPageId
});

set_auto_layout({
  nodeId: sidebarId,
  layoutMode: "VERTICAL",
  primaryAxisAlignItems: "MIN",
  counterAxisAlignItems: "STRETCH",
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  itemSpacing: 0
});

// App Title Section
const appTitleId = create_frame({
  x: 0,
  y: 0,
  width: 280,
  height: 64,
  name: "AppTitle",
  parentId: sidebarId
});

set_auto_layout({
  nodeId: appTitleId,
  layoutMode: "HORIZONTAL",
  primaryAxisAlignItems: "CENTER",
  counterAxisAlignItems: "CENTER",
  paddingTop: 16,
  paddingBottom: 16,
  paddingLeft: 16,
  paddingRight: 16
});

set_stroke_color({
  nodeId: appTitleId,
  strokeColor: colors.borderPrimary,
  strokeWeight: 1,
  strokeAlign: "INSIDE",
  strokeSide: "BOTTOM"
});

const appTitleTextId = create_text({
  x: 0,
  y: 0,
  text: "Bara",
  parentId: appTitleId,
  fontSize: 20,
  fontWeight: 600,
  fontColor: colors.textPrimary
});

// Navigation Section
const navSectionId = create_frame({
  x: 0,
  y: 64,
  width: 280,
  height: 200,
  name: "NavigationSection",
  parentId: sidebarId
});

set_auto_layout({
  nodeId: navSectionId,
  layoutMode: "VERTICAL",
  paddingTop: 8,
  paddingBottom: 8,
  itemSpacing: 4
});

// Section Header
const sectionHeaderId = create_text({
  x: 8,
  y: 8,
  text: "PERSPECTIVES",
  parentId: navSectionId,
  fontSize: 12,
  fontWeight: 600,
  fontColor: colors.textMuted,
  textCase: "UPPER"
});

set_auto_layout({
  nodeId: sectionHeaderId,
  paddingLeft: 8,
  paddingRight: 8,
  paddingTop: 4,
  paddingBottom: 4
});

// Navigation Item Component
const navItemId = create_frame({
  x: 0,
  y: 32,
  width: 264,
  height: 36,
  name: "NavigationItem",
  parentId: navSectionId
});

set_auto_layout({
  nodeId: navItemId,
  layoutMode: "HORIZONTAL",
  primaryAxisAlignItems: "CENTER",
  counterAxisAlignItems: "CENTER",
  paddingTop: 8,
  paddingBottom: 8,
  paddingLeft: 12,
  paddingRight: 12,
  itemSpacing: 8
});

set_corner_radius({
  nodeId: navItemId,
  radius: 6
});

// Icon placeholder
const iconId = create_rectangle({
  x: 0,
  y: 0,
  width: 16,
  height: 16,
  name: "Icon",
  parentId: navItemId,
  fillColor: colors.textSecondary
});

// Nav text
const navTextId = create_text({
  x: 24,
  y: 0,
  text: "Inbox",
  parentId: navItemId,
  fontSize: 14,
  fontWeight: 400,
  fontColor: colors.textSecondary
});

// Create component variant for active state
const activeNavItemId = clone_node({
  nodeId: navItemId,
  x: 0,
  y: 80
});

set_fill_color({
  nodeId: activeNavItemId,
  fillColor: colors.primaryBlue
});

update_text({
  nodeId: `${activeNavItemId}/text`,
  fontColor: colors.textPrimary
});

// MainContent Component
const mainContentId = create_frame({
  x: 300,
  y: 0,
  width: 800,
  height: 1024,
  name: "MainContent",
  fillColor: { r: 1, g: 1, b: 1 },
  parentId: componentLibraryPageId
});

set_auto_layout({
  nodeId: mainContentId,
  layoutMode: "VERTICAL",
  counterAxisAlignItems: "STRETCH"
});

// Toolbar
const toolbarId = create_frame({
  x: 0,
  y: 0,
  width: 800,
  height: 48,
  name: "Toolbar",
  parentId: mainContentId
});

set_auto_layout({
  nodeId: toolbarId,
  layoutMode: "HORIZONTAL",
  primaryAxisAlignItems: "CENTER",
  counterAxisAlignItems: "CENTER",
  paddingLeft: 16,
  paddingRight: 16
});

set_stroke_color({
  nodeId: toolbarId,
  strokeColor: colors.borderPrimary,
  strokeWeight: 1,
  strokeAlign: "INSIDE",
  strokeSide: "BOTTOM"
});

// Content Area
const contentAreaId = create_frame({
  x: 0,
  y: 48,
  width: 800,
  height: 920,
  name: "ContentArea",
  parentId: mainContentId
});

set_fill_color({
  nodeId: contentAreaId,
  fillColor: { r: 1, g: 1, b: 1 }
});

// Quick Entry Bar
const quickEntryId = create_frame({
  x: 0,
  y: 968,
  width: 800,
  height: 56,
  name: "QuickEntryBar",
  parentId: mainContentId
});

set_auto_layout({
  nodeId: quickEntryId,
  layoutMode: "HORIZONTAL",
  primaryAxisAlignItems: "CENTER",
  counterAxisAlignItems: "CENTER",
  paddingLeft: 16,
  paddingRight: 16
});

set_stroke_color({
  nodeId: quickEntryId,
  strokeColor: colors.borderPrimary,
  strokeWeight: 1,
  strokeAlign: "INSIDE",
  strokeSide: "TOP"
});

// Quick Entry Input
const quickInputId = create_rectangle({
  x: 0,
  y: 0,
  width: 768,
  height: 40,
  name: "QuickInput",
  parentId: quickEntryId,
  fillColor: colors.bgSurface
});

set_corner_radius({
  nodeId: quickInputId,
  radius: 6
});

set_auto_layout({
  nodeId: quickInputId,
  paddingLeft: 12,
  paddingRight: 12,
  paddingTop: 8,
  paddingBottom: 8
});

// Inspector Component
const inspectorId = create_frame({
  x: 1120,
  y: 0,
  width: 320,
  height: 1024,
  name: "Inspector",
  fillColor: colors.bgPrimary,
  parentId: componentLibraryPageId
});

set_auto_layout({
  nodeId: inspectorId,
  layoutMode: "VERTICAL",
  counterAxisAlignItems: "STRETCH"
});

// Inspector Header
const inspectorHeaderId = create_frame({
  x: 0,
  y: 0,
  width: 320,
  height: 48,
  name: "InspectorHeader",
  parentId: inspectorId
});

set_auto_layout({
  nodeId: inspectorHeaderId,
  layoutMode: "HORIZONTAL",
  primaryAxisAlignItems: "CENTER",
  counterAxisAlignItems: "SPACE_BETWEEN",
  paddingLeft: 16,
  paddingRight: 16
});

set_stroke_color({
  nodeId: inspectorHeaderId,
  strokeColor: colors.borderPrimary,
  strokeWeight: 1,
  strokeAlign: "INSIDE",
  strokeSide: "BOTTOM"
});

// STEP 6: Create UI Components

// Button Component Set
const buttonSetId = create_component_set({
  x: 0,
  y: 200,
  name: "Button",
  parentId: componentLibraryPageId
});

// Default Button
const buttonDefaultId = create_component({
  x: 0,
  y: 0,
  width: 120,
  height: 40,
  name: "Button/variant=default,size=default",
  parentId: buttonSetId
});

set_fill_color({
  nodeId: buttonDefaultId,
  fillColor: colors.primaryBlue
});

set_corner_radius({
  nodeId: buttonDefaultId,
  radius: 6
});

set_auto_layout({
  nodeId: buttonDefaultId,
  layoutMode: "HORIZONTAL",
  primaryAxisAlignItems: "CENTER",
  counterAxisAlignItems: "CENTER",
  paddingLeft: 16,
  paddingRight: 16,
  paddingTop: 8,
  paddingBottom: 8
});

const buttonTextId = create_text({
  x: 0,
  y: 0,
  text: "Button",
  parentId: buttonDefaultId,
  fontSize: 14,
  fontWeight: 500,
  fontColor: colors.textPrimary
});

// TaskItem Component
const taskItemId = create_frame({
  x: 0,
  y: 300,
  width: 400,
  height: 64,
  name: "TaskItem",
  parentId: componentLibraryPageId
});

set_auto_layout({
  nodeId: taskItemId,
  layoutMode: "HORIZONTAL",
  primaryAxisAlignItems: "START",
  counterAxisAlignItems: "CENTER",
  paddingTop: 12,
  paddingBottom: 12,
  paddingLeft: 16,
  paddingRight: 16,
  itemSpacing: 12
});

set_stroke_color({
  nodeId: taskItemId,
  strokeColor: colors.borderPrimary,
  strokeWeight: 1,
  strokeAlign: "INSIDE",
  strokeSide: "BOTTOM"
});

// Checkbox
const checkboxId = create_rectangle({
  x: 0,
  y: 0,
  width: 20,
  height: 20,
  name: "Checkbox",
  parentId: taskItemId
});

set_stroke_color({
  nodeId: checkboxId,
  strokeColor: colors.textSecondary,
  strokeWeight: 1
});

set_corner_radius({
  nodeId: checkboxId,
  radius: 3
});

// Task Content
const taskContentId = create_frame({
  x: 32,
  y: 0,
  width: 300,
  height: 40,
  name: "TaskContent",
  parentId: taskItemId
});

set_auto_layout({
  nodeId: taskContentId,
  layoutMode: "VERTICAL",
  itemSpacing: 4
});

const taskTitleId = create_text({
  x: 0,
  y: 0,
  text: "Task title goes here",
  parentId: taskContentId,
  fontSize: 14,
  fontWeight: 400,
  fontColor: colors.textPrimary
});

const taskMetaId = create_text({
  x: 0,
  y: 20,
  text: "Due tomorrow • Project Name",
  parentId: taskContentId,
  fontSize: 12,
  fontWeight: 400,
  fontColor: colors.textMuted
});

// STEP 7: Create Screen Layouts

// Dashboard Screen
const dashboardId = create_frame({
  x: 0,
  y: 0,
  width: 1400,
  height: 1024,
  name: "Dashboard",
  parentId: screenLayoutsPageId
});

set_auto_layout({
  nodeId: dashboardId,
  layoutMode: "HORIZONTAL",
  counterAxisAlignItems: "STRETCH"
});

// Instance of Sidebar
const sidebarInstanceId = create_instance({
  componentId: sidebarId,
  x: 0,
  y: 0,
  parentId: dashboardId
});

// Instance of MainContent
const mainContentInstanceId = create_instance({
  componentId: mainContentId,
  x: 280,
  y: 0,
  parentId: dashboardId
});

// Instance of Inspector
const inspectorInstanceId = create_instance({
  componentId: inspectorId,
  x: 1080,
  y: 0,
  parentId: dashboardId
});

// STEP 8: Create Documentation

const docFrameId = create_frame({
  x: 0,
  y: 1200,
  width: 800,
  height: 600,
  name: "Component Documentation",
  parentId: componentLibraryPageId
});

const docTextId = create_text({
  x: 20,
  y: 20,
  text: `BARA-V1 COMPONENT MAPPING
========================

React Component → Figma Component
---------------------------------
src/components/layout/sidebar.tsx → Sidebar
src/components/layout/main-content.tsx → MainContent
src/components/layout/inspector.tsx → Inspector
src/components/tasks/task-list.tsx → TaskList (container)
src/components/tasks/task-item.tsx → TaskItem
src/components/ui/button.tsx → Button
src/components/ui/input.tsx → Input
src/components/ui/card.tsx → Card

Design Tokens
-------------
Colors: See Design System page
Typography: See Design System page
Spacing: 4px grid system
Corner Radius: 3px (small), 6px (medium), 8px (large)

Phase 2A Workflow
-----------------
1. Edit components in Figma
2. Document changes
3. Update React code
4. Visual QA
5. Iterate`,
  parentId: docFrameId,
  fontSize: 12,
  fontWeight: 400
});

console.log("Bara-v1 Figma components created successfully!");
console.log("Channel:", "p4rsoq3p");
console.log("Total components created:", 10);
console.log("Ready for Phase 2A design iteration");