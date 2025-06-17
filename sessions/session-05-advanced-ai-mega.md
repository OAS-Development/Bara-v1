# Session 5: Advanced Features & Intelligence (MEGA SESSION)

## Session Metadata
```json
{
  "session": 5,
  "title": "Advanced Features & Intelligence - Import, Context Engine, AI",
  "duration": "5.25 hours planned (~50 minutes actual)",
  "type": "mega-implementation",
  "combinesSessions": [12, 13, 14, 15, 16, 17, 18],
  "project": "Bara-v1",
  "dependencies": [1, 2, 3, 4]
}
```

## Objectives
This mega-session adds intelligence and advanced features:

**Part A - Complete OmniFocus Import (45 min)**:
1. Import mapping and transformation
2. Batch import execution with transactions
3. Progress tracking and error handling
4. Import report generation
5. Duplicate detection

**Part B - Location Context (45 min)**:
1. Geolocation API integration
2. Location definitions (home, office, etc.)
3. Location-based task filtering
4. Location assignment to tasks
5. Location-aware perspectives

**Part C - Time & Energy Context (45 min)**:
1. Time-based availability rules
2. Energy level tracking
3. Calendar integration prep
4. Smart time-based filtering
5. Optimal task timing

**Part D - Device & Combined Context (45 min)**:
1. Device detection and filtering
2. Context combination rules
3. Smart context suggestions
4. Context-aware task lists
5. Context preference learning

**Part E - AI Natural Language (45 min)**:
1. Integrate Claude API for parsing
2. Natural language task input
3. Smart property extraction
4. Ambiguity handling
5. Training examples system

**Part F - AI Intelligence (45 min)**:
1. Task pattern analysis
2. Smart next action suggestions
3. Auto-prioritization
4. Learning from user behavior
5. AI settings and controls

## Context
Session 4 complete. We have the full GTD system with projects, tags, dates, views, reviews, and import parser. Now adding intelligence and completing the import system.

## Implementation Steps

### Part A: Complete OmniFocus Import

#### 1. Create Import Mapping System
Create `src/lib/import/import-mapper.ts`:
- Map OF contexts to Bara tags
- Transform project types
- Handle date conversions
- Preserve hierarchy
- Map completed status

#### 2. Create Import Executor
Create `src/lib/import/import-executor.ts`:
- Batch import with transactions
- Progress tracking
- Error handling and rollback
- Duplicate detection
- Import statistics

#### 3. Update Import UI
Enhance import components:
- Add mapping configuration UI
- Show real-time progress
- Display error details
- Generate import report
- Allow selective import

### Part B: Location Context

#### 4. Create Location Store
Create `src/stores/location-store.ts`:
- Define locations (coordinates + radius)
- Track current location
- Calculate location matches
- Store location preferences

#### 5. Add Geolocation
Create `src/hooks/use-geolocation.ts`:
- Request location permission
- Track current position
- Handle location errors
- Update frequency control

#### 6. Create Location Components
- `src/components/location/location-manager.tsx` - Define locations
- `src/components/location/location-picker.tsx` - Assign to tasks
- `src/components/location/location-indicator.tsx` - Show current

#### 7. Integrate Location Filtering
- Add location field to tasks
- Filter tasks by current location
- Create location-based perspectives
- Show location in task list

### Part C: Time & Energy Context

#### 8. Create Time Rules
Create `src/lib/context/time-rules.ts`:
- Define time windows (morning, afternoon, evening)
- Business hours detection
- Weekend/weekday rules
- Holiday awareness

#### 9. Add Energy Tracking
Create `src/stores/energy-store.ts`:
- Track current energy level
- Energy level history
- Task energy requirements
- Optimal matching

#### 10. Create Time Components
- `src/components/context/time-filter.tsx` - Time-based filtering
- `src/components/context/energy-picker.tsx` - Set energy levels
- `src/components/context/time-rules-editor.tsx` - Configure rules

### Part D: Device & Combined Context

#### 11. Device Detection
Create `src/lib/context/device-context.ts`:
- Detect device type (desktop/mobile/tablet)
- Screen size awareness
- Input method detection
- Network status

#### 12. Context Combination Engine
Create `src/lib/context/context-engine.ts`:
- Combine multiple contexts
- Priority weighting
- Context scoring
- Smart suggestions

#### 13. Create Context UI
- `src/components/context/context-dashboard.tsx` - Overview
- `src/components/context/context-filter.tsx` - Combined filtering
- `src/components/context/context-learn.tsx` - Preference learning

### Part E: AI Natural Language

#### 14. Set Up Claude API
Create `src/lib/ai/claude-client.ts`:
- API configuration
- Request handling
- Error management
- Rate limiting

#### 15. Natural Language Parser
Create `src/lib/ai/task-parser.ts`:
- Parse natural language input
- Extract task properties
- Handle dates naturally
- Identify projects/tags

#### 16. Create AI Input Components
- `src/components/ai/natural-input.tsx` - Natural language input
- `src/components/ai/parse-preview.tsx` - Show parsed result
- `src/components/ai/ambiguity-dialog.tsx` - Handle unclear input

### Part F: AI Intelligence

#### 17. Pattern Analysis
Create `src/lib/ai/pattern-analyzer.ts`:
- Analyze task completion patterns
- Time-of-day patterns
- Project velocity
- Tag correlations

#### 18. Smart Suggestions
Create `src/lib/ai/suggestion-engine.ts`:
- Next action recommendations
- Priority suggestions
- Context-based ordering
- Workload balancing

#### 19. Create AI Components
- `src/components/ai/suggestions-panel.tsx` - Show recommendations
- `src/components/ai/ai-settings.tsx` - Control AI features
- `src/components/ai/learning-feedback.tsx` - Train the system

#### 20. Integration
- Add AI toggle to settings
- Integrate throughout app
- Add keyboard shortcuts
- Performance optimization

## Verification Steps

### After Each Part:
1. Test new functionality
2. Verify integration
3. Check performance
4. Test edge cases

### Final Verification:
```bash
# 1. Test import
npm run dev
# Upload an OF file and execute full import

# 2. Test contexts
# Enable location, set energy level
# Verify filtering works

# 3. Test AI
# Use natural language input
# Check suggestions

# 4. Full integration test
# Use all features together

# 5. Performance test
# Import large dataset
# Verify no lag

# 6. Build test
npm run build
```

## Success Criteria Checklist
- [ ] Import: Can import full OF archive
- [ ] Location: Filters by current location
- [ ] Time: Shows time-appropriate tasks
- [ ] Energy: Matches tasks to energy
- [ ] Device: Adapts to device type
- [ ] Context: Combines multiple contexts
- [ ] NLP: Parses natural language
- [ ] AI: Provides smart suggestions
- [ ] Learning: Improves over time
- [ ] Performance: Handles large datasets
- [ ] Integration: All features work together
- [ ] Build: Production build succeeds

## Session Completion Report
Save to: `/sessions/session-05-status.json`

## Notes:
- API keys for Claude will be needed
- Location permission handling important
- Performance with AI features critical
- Privacy considerations for learning
