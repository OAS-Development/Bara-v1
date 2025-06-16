# Context-Aware Features Design

## Smart Context Detection

### Location-Based Intelligence

#### 1. Geofencing Setup
Users can define meaningful locations with associated behaviors:

```typescript
interface Location {
  id: string;
  name: string;
  coordinates: Coordinates;
  radius: number; // meters
  type: 'home' | 'office' | 'gym' | 'store' | 'custom';
  activeTags: string[]; // Tags to activate here
  suppressTags: string[]; // Tags to hide here
  autoActivateProjects?: string[];
}

// Example configurations:
const locations = [
  {
    name: "Home Office",
    type: "home",
    activeTags: ["@computer", "@calls", "@deep-work"],
    suppressTags: ["@errands", "@office-only"],
    autoActivateProjects: ["Personal Development", "Side Projects"]
  },
  {
    name: "Grocery Store", 
    type: "store",
    activeTags: ["@errands", "@shopping"],
    radius: 200,
    // Auto-surface shopping lists when nearby
  }
];
```

#### 2. Commute Intelligence
```typescript
interface CommuteContext {
  isCommuting: boolean;
  estimatedDuration: number;
  mode: 'driving' | 'transit' | 'walking';
  suggestedTasks: Task[];
}

// During commute, automatically queue:
// - Phone calls (if hands-free)
// - Audio learning tasks
// - Voice memos for capture
// - Podcast/audiobook suggestions based on current projects
```

### Temporal Awareness

#### 1. Meeting Preparation
```typescript
interface MeetingPrep {
  meeting: CalendarEvent;
  relatedTasks: Task[];
  relatedNotes: Note[];
  suggestedAgenda: string[];
  participantContext: Contact[];
}

// 15 minutes before a meeting:
// - Surface related project tasks
// - Show recent notes about participants
// - Display action items from last meeting
// - Suggest agenda items based on open tasks
```

#### 2. Energy-Based Scheduling
```typescript
interface EnergyProfile {
  timeSlots: {
    start: string; // "09:00"
    end: string;   // "11:00"
    energyLevel: 'peak' | 'good' | 'low';
    idealTaskTypes: TaskType[];
  }[];
}

// Learn and adapt to user patterns:
// - Deep work during peak hours
// - Admin tasks during low energy
// - Creative work when most inspired
```

### Environmental Context

#### 1. Device-Aware Filtering
```typescript
interface DeviceContext {
  device: 'desktop' | 'laptop' | 'phone' | 'tablet';
  capabilities: {
    keyboard: boolean;
    largeScreen: boolean;
    cellular: boolean;
    batteryLevel?: number;
  };
}

// Adapt task display based on device:
// Desktop: Show complex project planning views
// Mobile: Focus on quick capture and simple tasks
// Tablet: Reading and review-focused interface
```

#### 2. Network-Aware Task Management
```typescript
interface NetworkContext {
  online: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'offline';
  dataRestricted: boolean;
}

// Offline mode:
// - Queue sync operations
// - Focus on local tasks
// - Cache AI responses for common queries
// - Enable offline-capable features only
```

### Social Context Integration

#### 1. Contact-Based Grouping
```typescript
interface ContactContext {
  person: Contact;
  recentInteractions: Interaction[];
  waitingForItems: Task[];
  sharedProjects: Project[];
  communicationPreference: 'email' | 'slack' | 'call' | 'text';
}

// Smart grouping:
// - "Tasks related to John" view
// - Automatic follow-up reminders
// - Preferred communication method suggestions
```

#### 2. Collaboration Indicators
```typescript
interface CollaborationContext {
  task: Task;
  collaborators: Contact[];
  lastUpdates: Update[];
  blockers: Task[];
  notifications: Notification[];
}

// Visual indicators:
// - Show when others are waiting on your task
// - Highlight tasks blocking team members
// - Surface tasks with recent collaborator updates
```

## Implementation Examples

### Morning Routine
```typescript
// At 7 AM at home:
const morningContext = {
  time: "07:00",
  location: "home",
  energy: "rising",
  upcomingEvents: [/* 9 AM standup */],
};

// System automatically:
// 1. Shows morning routine checklist
// 2. Surfaces tasks tagged @morning
// 3. Displays daily priorities
// 4. Shows weather-dependent tasks
// 5. Prepares standup talking points
```

### Context Switching
```typescript
// Arriving at office:
const officeArrival = {
  locationChange: { from: "commute", to: "office" },
  time: "09:15",
  networkStatus: "corporate-wifi",
};

// System responds:
// 1. Switches to work project focus
// 2. Activates @office tags
// 3. Shows tasks requiring office resources
// 4. Displays colleague waiting-for items
// 5. Syncs any offline changes
```

### Evening Wind-down
```typescript
// At 6 PM:
const eveningContext = {
  time: "18:00",
  location: "transitioning",
  energy: "declining",
  completedToday: 12,
};

// System suggests:
// 1. Quick wins to end the day
// 2. Tomorrow's preparation tasks
// 3. Personal tasks for evening
// 4. Review of day's accomplishments
// 5. Low-energy administrative tasks
```

## Privacy Controls

Users maintain full control over context detection:
- Toggle individual context features on/off
- Set privacy zones (no tracking)
- Configure what data is shared with AI
- Review and delete context history
- Export all collected context data
