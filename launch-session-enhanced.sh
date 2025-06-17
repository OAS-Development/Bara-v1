#!/bin/bash

# Enhanced Session Launcher for Bara-v1
# Supports all development lifecycle phases

PROJECT_PATH="/Volumes/DevDrive/ClaudeProjects/active/Bara-v1"
SESSIONS_PATH="$PROJECT_PATH/sessions"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to display header
show_header() {
    echo -e "${BLUE}=================================================${NC}"
    echo -e "${BLUE}         Bara-v1 Enhanced Session Launcher       ${NC}"
    echo -e "${BLUE}=================================================${NC}"
    echo ""
}

# Function to show development phase
show_phase() {
    echo -e "${CYAN}📋 Current Development Phase Assessment:${NC}"
    echo ""
    
    # Check if Session 8 is complete
    if [ -f "$SESSIONS_PATH/session-08-status.json" ]; then
        echo -e "  ${GREEN}✅ PHASE 2: ITERATIVE ENHANCEMENT${NC}"
        echo -e "     • Enterprise-grade baseline complete"
        echo -e "     • Ready for user testing and feedback-driven development"
        echo -e "     • Variable session types available"
        echo ""
        return 0
    else
        echo -e "  ${YELLOW}🚧 PHASE 1: GREENFIELD DEVELOPMENT${NC}"
        echo -e "     • Building core functionality"
        echo -e "     • Mega sessions for rapid feature development"
        echo -e "     • Session 8 (Quality/Stabilization) required before Phase 2"
        echo ""
        return 1
    fi
}

# Function to show session type menu
show_session_types() {
    local phase=$1
    
    echo -e "${CYAN}🎯 Available Session Types:${NC}"
    echo ""
    
    if [ $phase -eq 1 ]; then
        # Phase 1: Greenfield Development
        echo -e "  ${PURPLE}MEGA SESSIONS (Phase 1):${NC}"
        echo -e "    8)  Quality/Stabilization (90 min) - ${RED}REQUIRED${NC}"
        echo -e "    9)  Advanced Features (90 min)"
        echo -e "    10) Future Enhancements (90 min)"
        echo ""
        echo -e "  ${YELLOW}⚠️  Phase 2 session types unavailable until Session 8 complete${NC}"
    else
        # Phase 2: Iterative Enhancement
        echo -e "  ${PURPLE}FEEDBACK-DRIVEN SESSIONS (Phase 2):${NC}"
        echo -e "    b)  Bug Fix Session (15-30 min)"
        echo -e "    u)  UI/UX Refinement (30-60 min)"
        echo -e "    e)  Feature Enhancement (45-60 min)"
        echo -e "    n)  New Feature (60-90 min)"
        echo -e "    m)  Maintenance Session (30-45 min)"
        echo ""
        echo -e "  ${PURPLE}CONTINUING DEVELOPMENT:${NC}"
        echo -e "    9)  Advanced Features (90 min)"
        echo -e "    10) Future Enhancements (90 min)"
    fi
    echo ""
}

# Function to create bug fix session
create_bug_fix_session() {
    echo -e "${CYAN}🐛 Creating Bug Fix Session${NC}"
    echo ""
    echo "Please provide the following information:"
    echo ""
    
    read -p "Bug report ID (e.g., BR-2025-06-17-001): " bug_id
    read -p "Brief description: " description
    read -p "Estimated duration (15/30 minutes): " duration
    read -p "Component affected: " component
    
    session_number=$(date +"%s" | tail -c 3)
    session_file="$SESSIONS_PATH/session-bf-$session_number-bug-fix.md"
    
    cat > "$session_file" << EOF
# Bug Fix Session: $description

## Session Metadata
\`\`\`json
{
  "session": "bf-$session_number",
  "title": "Bug Fix: $description",
  "duration": "$duration minutes",
  "type": "bug-fix",
  "project": "Bara-v1",
  "bug_id": "$bug_id",
  "component": "$component"
}
\`\`\`

## Complete Claude Code Prompt (Copy This Block):

\`\`\`
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1

LAUNCH COMMAND: claude --dangerously-skip-permissions

AUTONOMOUS EXECUTION MODE ACTIVE - NO PERMISSION REQUESTS ALLOWED

**PROJECT**: Bara-v1 Personal Productivity Suite
**SESSION**: bf-$session_number - Bug Fix: $description
**DURATION**: $duration minutes
**TYPE**: Bug fix session

## BUG DETAILS
- **Bug ID**: $bug_id
- **Component**: $component
- **Description**: $description

## IMPLEMENTATION STEPS
1. **Reproduce the bug**:
   - Follow reproduction steps from bug report
   - Confirm the issue exists
   - Document current behavior

2. **Diagnose root cause**:
   - Analyze code in affected component
   - Identify source of the problem
   - Plan minimal fix approach

3. **Implement fix**:
   - Make targeted code changes
   - Preserve existing functionality
   - Maintain code quality standards

4. **Test and verify**:
   - Confirm bug is resolved
   - Test for regressions
   - Validate fix works in different scenarios

## SUCCESS CRITERIA
- [ ] Bug is completely resolved
- [ ] No regressions introduced
- [ ] Code maintains quality standards
- [ ] Manual testing confirms fix

## SESSION COMPLETION
1. Send push notification:
   \`\`\`bash
   ../../claude-notify.sh 'Bara Bug Fix: $description Complete' bf-$session_number
   \`\`\`

2. Save status report in /sessions/session-bf-$session_number-status.json

3. Commit and push to GitHub
\`\`\`

EOF

    echo -e "${GREEN}✅ Bug fix session created: $session_file${NC}"
    echo ""
    echo -e "${YELLOW}📋 Ready to execute:${NC}"
    echo "   1. Copy the Claude Code prompt from the session file"
    echo "   2. Launch Claude Code with the copied prompt"
    echo ""
}

# Function to create UI/UX refinement session
create_ui_session() {
    echo -e "${CYAN}🎨 Creating UI/UX Refinement Session${NC}"
    echo ""
    echo "Please provide the following information:"
    echo ""
    
    read -p "UI feedback ID (e.g., UX-2025-06-17-001): " ui_id
    read -p "Component/feature to refine: " component
    read -p "Brief description: " description
    read -p "Estimated duration (30/45/60 minutes): " duration
    read -p "Figma link (if applicable): " figma_link
    
    session_number=$(date +"%s" | tail -c 3)
    session_file="$SESSIONS_PATH/session-ui-$session_number-refinement.md"
    
    cat > "$session_file" << EOF
# UI/UX Refinement Session: $component

## Session Metadata
\`\`\`json
{
  "session": "ui-$session_number",
  "title": "UI/UX: $component - $description",
  "duration": "$duration minutes",
  "type": "ui-refinement",
  "project": "Bara-v1",
  "ui_id": "$ui_id",
  "component": "$component",
  "figma_link": "$figma_link"
}
\`\`\`

## Complete Claude Code Prompt (Copy This Block):

\`\`\`
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1

LAUNCH COMMAND: claude --dangerously-skip-permissions

AUTONOMOUS EXECUTION MODE ACTIVE - NO PERMISSION REQUESTS ALLOWED

**PROJECT**: Bara-v1 Personal Productivity Suite
**SESSION**: ui-$session_number - UI/UX Refinement: $component
**DURATION**: $duration minutes
**TYPE**: UI/UX refinement session

## UI/UX REFINEMENT DETAILS
- **UI ID**: $ui_id
- **Component**: $component
- **Description**: $description
- **Figma Reference**: $figma_link

## FIGMA INTEGRATION STEPS
1. **Analyze current design** (if Figma MCP available):
   - Review current component design
   - Identify specific changes needed
   - Extract design specifications

2. **Design-to-code mapping**:
   - Map Figma components to React components
   - Identify CSS/styling changes needed
   - Plan responsive adaptations

## IMPLEMENTATION STEPS
1. **Current state analysis**:
   - Review existing component implementation
   - Document current styling and behavior
   - Identify improvement areas

2. **UI improvements**:
   - Implement visual changes per feedback
   - Update component styling
   - Ensure responsive behavior

3. **UX enhancements**:
   - Improve interaction patterns
   - Optimize user flow
   - Enhance accessibility

4. **Testing and verification**:
   - Test on desktop and mobile
   - Validate accessibility compliance
   - Confirm visual improvements

## SUCCESS CRITERIA
- [ ] Visual improvements implemented
- [ ] Responsive design maintained
- [ ] Accessibility compliance preserved
- [ ] User feedback addressed
- [ ] No functional regressions

## SESSION COMPLETION
1. Send push notification:
   \`\`\`bash
   ../../claude-notify.sh 'Bara UI/UX: $component Complete' ui-$session_number
   \`\`\`

2. Save status report in /sessions/session-ui-$session_number-status.json

3. Commit and push to GitHub
\`\`\`

EOF

    echo -e "${GREEN}✅ UI/UX refinement session created: $session_file${NC}"
    echo ""
    echo -e "${YELLOW}📋 Ready to execute:${NC}"
    echo "   1. Copy the Claude Code prompt from the session file"
    echo "   2. Launch Claude Code with the copied prompt"
    echo ""
}

# Function to create feature enhancement session
create_enhancement_session() {
    echo -e "${CYAN}⚡ Creating Feature Enhancement Session${NC}"
    echo ""
    echo "Please provide the following information:"
    echo ""
    
    read -p "Enhancement request ID (e.g., ER-2025-06-17-001): " er_id
    read -p "Feature to enhance: " feature
    read -p "Brief description: " description
    read -p "Estimated duration (45/60 minutes): " duration
    
    session_number=$(date +"%s" | tail -c 3)
    session_file="$SESSIONS_PATH/session-en-$session_number-enhancement.md"
    
    cat > "$session_file" << EOF
# Feature Enhancement Session: $feature

## Session Metadata
\`\`\`json
{
  "session": "en-$session_number",
  "title": "Enhancement: $feature - $description",
  "duration": "$duration minutes",
  "type": "feature-enhancement",
  "project": "Bara-v1",
  "enhancement_id": "$er_id",
  "feature": "$feature"
}
\`\`\`

## Complete Claude Code Prompt (Copy This Block):

\`\`\`
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1

LAUNCH COMMAND: claude --dangerously-skip-permissions

AUTONOMOUS EXECUTION MODE ACTIVE - NO PERMISSION REQUESTS ALLOWED

**PROJECT**: Bara-v1 Personal Productivity Suite
**SESSION**: en-$session_number - Feature Enhancement: $feature
**DURATION**: $duration minutes
**TYPE**: Feature enhancement session

## ENHANCEMENT DETAILS
- **Enhancement ID**: $er_id
- **Feature**: $feature
- **Description**: $description

## IMPLEMENTATION STEPS
1. **Current functionality analysis**:
   - Review existing feature implementation
   - Document current capabilities
   - Identify enhancement opportunities

2. **Enhancement planning**:
   - Design improved functionality
   - Plan backward compatibility
   - Consider performance implications

3. **Implementation**:
   - Modify existing components/logic
   - Add new capabilities as needed
   - Maintain code quality standards

4. **Testing and validation**:
   - Test enhanced functionality
   - Verify backward compatibility
   - Validate user experience improvements

## SUCCESS CRITERIA
- [ ] Enhancement fully implemented
- [ ] Existing functionality preserved
- [ ] Performance maintained or improved
- [ ] User experience enhanced
- [ ] Code quality standards met

## SESSION COMPLETION
1. Send push notification:
   \`\`\`bash
   ../../claude-notify.sh 'Bara Enhancement: $feature Complete' en-$session_number
   \`\`\`

2. Save status report in /sessions/session-en-$session_number-status.json

3. Commit and push to GitHub
\`\`\`

EOF

    echo -e "${GREEN}✅ Feature enhancement session created: $session_file${NC}"
    echo ""
    echo -e "${YELLOW}📋 Ready to execute:${NC}"
    echo "   1. Copy the Claude Code prompt from the session file"
    echo "   2. Launch Claude Code with the copied prompt"
    echo ""
}

# Function to show feedback tools
show_feedback_tools() {
    echo -e "${CYAN}📝 Feedback Collection Tools:${NC}"
    echo ""
    echo -e "  ${YELLOW}Available templates:${NC}"
    echo -e "    • USER_FEEDBACK_TEMPLATES.md - Bug reports, enhancement requests, UI feedback"
    echo -e "    • FIGMA_INTEGRATION_WORKFLOW.md - Design-to-code process"
    echo -e "    • DEVELOPMENT_LIFECYCLE_PHASES.md - Complete Phase 2 methodology"
    echo ""
    echo -e "  ${YELLOW}Usage workflow:${NC}"
    echo -e "    1. Use templates to document issues during testing"
    echo -e "    2. Prioritize feedback using the provided matrix"
    echo -e "    3. Create appropriate session type using this launcher"
    echo -e "    4. Execute session with Claude Code"
    echo -e "    5. Test and validate improvements"
    echo ""
}

# Main script execution
main() {
    show_header
    
    # Determine development phase
    show_phase
    phase=$?
    
    show_session_types $phase
    
    if [ $phase -eq 0 ]; then
        show_feedback_tools
    fi
    
    echo -e "${CYAN}🚀 What would you like to do?${NC}"
    echo ""
    echo "  Session Options:"
    
    if [ $phase -eq 1 ]; then
        echo "    8) Launch Session 8 (Quality/Stabilization) - REQUIRED"
        echo "    9) Launch Session 9 (Advanced Features)"
        echo "    10) Launch Session 10 (Future Enhancements)"
    else
        echo "    b) Create Bug Fix Session"
        echo "    u) Create UI/UX Refinement Session"
        echo "    e) Create Feature Enhancement Session"
        echo "    n) Create New Feature Session"
        echo "    m) Create Maintenance Session"
        echo "    9) Launch Session 9 (Advanced Features)"
        echo "    10) Launch Session 10 (Future Enhancements)"
    fi
    
    echo ""
    echo "  Information Options:"
    echo "    s) Show session status"
    echo "    f) Show feedback templates"
    echo "    q) Quit"
    echo ""
    
    read -p "Enter your choice: " choice
    
    case $choice in
        8)
            if [ $phase -eq 1 ]; then
                echo -e "${YELLOW}📋 Session 8 prompt ready in: $SESSIONS_PATH/session-08-quality-stabilization.md${NC}"
                echo "Copy the Claude Code prompt from that file and execute with Claude Code."
            else
                echo -e "${RED}❌ Session 8 already complete${NC}"
            fi
            ;;
        9)
            echo -e "${YELLOW}📋 Session 9 will be available after Session 8 completion${NC}"
            ;;
        10)
            echo -e "${YELLOW}📋 Session 10 will be available after previous sessions${NC}"
            ;;
        b)
            if [ $phase -eq 0 ]; then
                create_bug_fix_session
            else
                echo -e "${RED}❌ Bug fix sessions only available in Phase 2${NC}"
            fi
            ;;
        u)
            if [ $phase -eq 0 ]; then
                create_ui_session
            else
                echo -e "${RED}❌ UI refinement sessions only available in Phase 2${NC}"
            fi
            ;;
        e)
            if [ $phase -eq 0 ]; then
                create_enhancement_session
            else
                echo -e "${RED}❌ Enhancement sessions only available in Phase 2${NC}"
            fi
            ;;
        n|m)
            if [ $phase -eq 0 ]; then
                echo -e "${YELLOW}📋 Feature coming soon - similar process to enhancement sessions${NC}"
            else
                echo -e "${RED}❌ These session types only available in Phase 2${NC}"
            fi
            ;;
        s)
            echo -e "${CYAN}📊 Session Status:${NC}"
            ls -la "$SESSIONS_PATH"/*status*.json 2>/dev/null || echo "No status files found"
            ;;
        f)
            echo -e "${CYAN}📝 Opening feedback templates:${NC}"
            echo "USER_FEEDBACK_TEMPLATES.md"
            echo "FIGMA_INTEGRATION_WORKFLOW.md"
            echo "DEVELOPMENT_LIFECYCLE_PHASES.md"
            ;;
        q)
            echo -e "${GREEN}👋 Happy coding!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Invalid choice. Please try again.${NC}"
            ;;
    esac
}

# Run main function
main
