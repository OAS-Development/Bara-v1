# Bara-v1: Personal Productivity Suite

A secure, cloud-based GTD (Getting Things Done) productivity system with cross-platform sync between web and iPhone.

**GitHub Repository**: https://github.com/OAS-Development/Bara-v1

## Development Model

This project uses a **Two-Actor Session-Based Development Model**:
- **Claude Desktop**: Architecture, planning, and strategy
- **Claude Code**: Implementation in 45-minute Sessions
- **Sessions**: Each development unit is ~45 minutes (not weeks)
- **Verification**: Every Session includes parallel terminal verification

See [TWO_ACTOR_MODEL.md](./TWO_ACTOR_MODEL.md) for details.

## Tech Stack

### Frontend
- **Web App**: Next.js 14+ with TypeScript
- **iOS App**: React Native (code sharing with web)
- **Styling**: Tailwind CSS + Radix UI (accessible components)
- **State Management**: Zustand with persist middleware
- **Data Sync**: TanStack Query with persistent cache
- **Offline Support**: PWA with Workbox
- **Maps/Location**: Mapbox GL JS / React Native Maps

### Backend & Security
- **Database**: Supabase (PostgreSQL + Auth + Realtime)
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Built-in authentication
- **Encryption**: End-to-end using Web Crypto API
  - Zero-knowledge architecture
  - Client-side encryption before storage
- **Sync**: Yjs (CRDT implementation)
- **Search**: PostgreSQL full-text search + pgvector for semantic search

### AI & Intelligence
- **LLM Integration**: Anthropic Claude API
- **Voice Processing**: OpenAI Whisper API
- **Local ML**: TensorFlow.js for on-device processing
- **Knowledge Graph**: Neo4j (future phase)
- **Vector Search**: pgvector extension for PostgreSQL
- **Document Processing**: 
  - PDF.js for client-side PDF parsing
  - Tesseract.js for OCR if needed
  - Natural for text processing
- **Embeddings**: OpenAI Embeddings API
- **Receipt OCR**: Google Vision API / Tesseract.js

### Context Services
- **Location**: Mapbox Geofencing API
- **Calendar**: Google Calendar API / CalDAV
- **Weather**: OpenWeather API
- **Device Info**: React Native Device Info
- **Travel Data**: 
  - Amadeus API (flight data)
  - Booking.com API (accommodation)
  - Points valuation APIs
- **Financial Services**:
  - QuickBooks API (OAuth2)
  - Plaid (bank connections - optional)
  - XE.com API (currency conversion)

### Deployment & Infrastructure
- **Frontend**: Vercel
- **Backend**: Supabase Cloud
- **Security**: Cloudflare WAF
- **Monitoring**: Sentry + Vercel Analytics
- **CI/CD**: GitHub Actions

## Implementation Roadmap

### Phase 0: Foundation & Import (Sessions 1-5)
- [ ] **OmniFocus Data Import**
  - Support .ofocus-archive format
  - Parse TaskPaper exports
  - Preserve task hierarchy
  - Import completed/archived items
  - Create searchable historical index
  - Migration status tracking
- [ ] **UI Framework Setup**
  - Implement OmniFocus-inspired design system
  - Dark theme with familiar layout
  - Three-panel responsive structure
  - Keyboard shortcut system
  - Quick entry modal
- [ ] **Database Schema**
  - Design for GTD + new features
  - Support for legacy data
  - Efficient search indexing
  - Encrypted storage setup

### Phase 1: Core GTD System (Sessions 6-10)
- [ ] Quick Capture Inbox
- [ ] Projects (Sequential/Parallel)
- [ ] Contexts/Tags System
- [ ] Defer & Due Dates
- [ ] Custom Perspectives
- [ ] Forecast View
- [ ] Review Cycles
- [ ] Focus Mode

### Phase 2: Context-Aware Features (Sessions 11-15)
- [ ] **Location Intelligence**
  - Geofencing for location-based task activation
  - Commute detection with audio/call task queuing
  - Proximity alerts for errands
  - Home/Office/Travel mode switching
- [ ] **Temporal Awareness**
  - Meeting preparation (surface relevant tasks/notes)
  - Time-of-day energy matching
  - Calendar integration for time blocking
  - Deadline proximity warnings
- [ ] **Environmental Context**
  - Device-aware task filtering (mobile vs desktop)
  - Network status (online/offline task segregation)
  - Weather-based task suggestions
  - Focus mode with distraction blocking
- [ ] **Social Context**
  - Contact-based task grouping
  - Communication history integration
  - Collaborative task indicators
  - Waiting-for reminders with follow-up automation

### Phase 3: AI-Powered Knowledge Management (Sessions 16-20)
- [ ] **Claude API Integration**
  - Natural language task processing
  - Project planning assistance
  - Weekly review summaries and insights
  - Task prioritization recommendations
- [ ] **Intelligent Capture**
  - Voice-to-task with AI summarization
  - Email parsing and task extraction
  - Meeting notes to action items
  - Handwriting/screenshot OCR to tasks
- [ ] **Knowledge Base**
  - AI-powered search across all notes/tasks
  - Automatic topic clustering
  - Related content suggestions
  - Knowledge graph visualization
- [ ] **Learning System**
  - Pattern recognition in task completion
  - Time estimation improvements
  - Productivity insights and coaching
  - Personalized workflow optimization
- [ ] **Content Generation**
  - AI-assisted project templates
  - Email/document drafts from tasks
  - Meeting agenda generation
  - Progress report creation

### Phase 4: Theological Library & AI Analysis (Sessions 21-25)
- [ ] **Document Management**
  - Multi-format upload (PDF, EPUB, DOCX)
  - Client-side text extraction
  - Intelligent chunking with context preservation
  - Primary book designation system
- [ ] **AI-Powered Analysis**
  - Comparative theological analysis
  - Doctrinal alignment scoring
  - Automated cross-reference detection
  - Concept mapping across documents
- [ ] **Research Tools**
  - Semantic search across library
  - Side-by-side document comparison
  - Highlighting and annotation system
  - Citation management
- [ ] **Study Features**
  - Auto-generated study guides
  - Reading plan creation
  - Progress tracking
  - Insight capture to task system
- [ ] **Integration**
  - Link insights to GTD projects
  - Create tasks from analysis
  - Schedule study sessions
  - Export reports and summaries

### Phase 5: AI-Powered Travel Planning (Sessions 26-30)
- [ ] **Travel Profile Management**
  - Loyalty program tracking
  - Travel preference learning
  - Points balance monitoring
  - Historical trip analysis
- [ ] **Intelligent Trip Planning**
  - Natural language trip requests
  - Points optimization engine
  - Multi-platform search aggregation
  - AI itinerary generation
- [ ] **Secure Platform Integration**
  - OAuth authentication
  - Browser extension for data extraction
  - Email booking parser
  - Privacy-first architecture
- [ ] **GTD Travel Mode**
  - Automatic travel project creation
  - Context-aware task filtering
  - Pre-trip task generation
  - Travel document management
- [ ] **Mobile Travel Companion**
  - Offline document access
  - Location-based recommendations
  - Quick expense capture
  - Real-time flight tracking

### Phase 6: Financial Management & Invoicing (Sessions 31-35)
- [ ] **Multi-Channel Receipt Capture**
  - Mobile photo capture with AI enhancement
  - Email forwarding system
  - Desktop drag-and-drop
  - Credit card integration
- [ ] **AI-Powered Processing**
  - OCR with intelligent extraction
  - Automatic categorization
  - Merchant identification
  - Multi-currency support
- [ ] **Client & Project Management**
  - Client database with QuickBooks sync
  - Project expense tracking
  - Budget monitoring
  - Billing rules engine
- [ ] **QuickBooks Integration**
  - OAuth secure connection
  - Automated invoice generation
  - Expense sync
  - Tax category mapping
- [ ] **Financial Intelligence**
  - Spending pattern analysis
  - Client profitability insights
  - Tax optimization suggestions
  - Monthly automated reporting

### Security Features
- [ ] Biometric authentication (Face ID/Touch ID)
- [ ] 2FA for web access
- [ ] Zero-knowledge encryption
- [ ] Automatic session timeouts
- [ ] Encrypted backups
