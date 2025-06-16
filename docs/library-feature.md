# Library Feature: AI-Powered Theological Analysis

## Overview
The Library feature enables users to build a personal theological reference system where foundational texts ("Primary" books) serve as the benchmark for analyzing new content. This creates a personalized AI research assistant that understands your specific theological framework.

## Core Functionality

### 1. Document Management
```typescript
interface LibraryDocument {
  id: string;
  title: string;
  author: string;
  type: 'book' | 'article' | 'paper' | 'sermon' | 'commentary';
  uploadDate: Date;
  fileType: 'pdf' | 'epub' | 'txt' | 'docx';
  
  // Metadata
  publicationYear?: number;
  publisher?: string;
  isbn?: string;
  tags: string[];
  category: string[]; // ['Systematic Theology', 'Biblical Commentary', etc.]
  
  // Primary designation
  isPrimary: boolean;
  primaryCategory?: string; // Which aspect makes it primary
  
  // Processing status
  status: 'uploading' | 'processing' | 'indexed' | 'error';
  pageCount: number;
  wordCount: number;
  
  // Theological metadata
  theologicalTradition?: string; // Reformed, Catholic, Orthodox, etc.
  primaryTopics?: string[]; // Christology, Soteriology, etc.
}
```

### 2. Content Processing Pipeline
```typescript
interface ProcessingPipeline {
  // Step 1: Extract text from various formats
  extractText(file: File): Promise<string>;
  
  // Step 2: Chunk intelligently (respecting chapter/section boundaries)
  chunkContent(text: string): ContentChunk[];
  
  // Step 3: Generate embeddings for semantic search
  generateEmbeddings(chunks: ContentChunk[]): Promise<Embedding[]>;
  
  // Step 4: Extract key theological concepts
  extractConcepts(text: string): Promise<TheologicalConcept[]>;
  
  // Step 5: Create searchable index
  indexDocument(doc: LibraryDocument, chunks: ContentChunk[]): Promise<void>;
}

interface ContentChunk {
  documentId: string;
  chunkId: string;
  text: string;
  context: {
    chapter?: string;
    section?: string;
    pageNumber?: number;
    previousChunk?: string;
    nextChunk?: string;
  };
  embedding?: number[];
}
```

### 3. Comparative Analysis Engine
```typescript
interface ComparativeAnalysis {
  sourceDocument: LibraryDocument;
  primaryDocuments: LibraryDocument[];
  analysisType: AnalysisType;
  
  results: {
    summary: string;
    agreements: TheologicalPoint[];
    disagreements: TheologicalPoint[];
    uniqueContributions: string[];
    concerningElements?: string[];
    overallAlignment: number; // 0-100 score
    detailedReport: AnalysisSection[];
  };
}

type AnalysisType = 
  | 'doctrinal-alignment'
  | 'hermeneutical-approach' 
  | 'theological-method'
  | 'scriptural-interpretation'
  | 'historical-accuracy'
  | 'comprehensive';

interface TheologicalPoint {
  topic: string;
  sourcePosition: string;
  sourceQuotes: Quote[];
  primaryPositions: {
    document: string;
    position: string;
    quotes: Quote[];
    alignmentScore: number;
  }[];
  analysis: string;
}
```

### 4. AI Analysis Prompts
```typescript
// Example analysis prompt structure
const analysisPrompt = `
You are a theological scholar analyzing texts for doctrinal consistency.

Primary Reference Texts:
${primaryBooks.map(book => `- ${book.title} by ${book.author}: ${book.summary}`).join('\n')}

New Document to Analyze:
Title: ${newDocument.title}
Author: ${newDocument.author}
Content: ${relevantChunks}

Please analyze this new document against the primary texts, considering:
1. Doctrinal alignment on key theological points
2. Hermeneutical methodology
3. Use of Scripture and interpretation approach
4. Areas of agreement and disagreement
5. Any theological concerns or red flags

Provide specific quotes and page references for all claims.
`;
```

### 5. Smart Features

#### Theological Concept Mapping
```typescript
interface ConceptMap {
  concept: string; // "Trinity", "Justification", etc.
  definitions: {
    document: string;
    definition: string;
    references: string[];
  }[];
  relationships: {
    relatedConcepts: string[];
    conflictingViews: ConflictingView[];
  };
}
```

#### Cross-Reference Detection
- Automatically identify when documents reference each other
- Track citation patterns
- Build influence maps

#### Reading Plans & Study Guides
```typescript
interface StudyGuide {
  topic: string;
  primaryReadings: Reading[];
  supplementaryReadings: Reading[];
  analysisQuestions: string[];
  keyTakeaways: string[];
}
```

## Implementation Architecture

### Storage Strategy
```typescript
// Hybrid approach for security and performance
interface StorageArchitecture {
  // Metadata: Supabase (encrypted)
  metadata: {
    documents: LibraryDocument[];
    userPreferences: UserLibraryPrefs;
    analysisHistory: Analysis[];
  };
  
  // Full texts: Chunked in PostgreSQL with pgvector
  content: {
    chunks: ContentChunk[];
    embeddings: Embedding[];
  };
  
  // Original files: Supabase Storage (encrypted)
  files: {
    bucket: 'library-documents';
    encryption: 'client-side-aes-256';
  };
  
  // Cache: Local IndexedDB for offline access
  cache: {
    recentDocuments: CachedDocument[];
    primaryBookSummaries: Summary[];
  };
}
```

### Privacy & Security
- All documents encrypted client-side before upload
- Option to process sensitive documents locally only
- Granular control over what gets sent to AI
- Audit log of all AI analyses
- DMCA compliance for copyrighted materials

### UI Components

#### Library Dashboard
- Grid/list view of all documents
- Primary book showcase
- Recent analyses
- Reading statistics

#### Document Viewer
- Full-text reading experience
- Highlighting and annotation
- Side-by-side comparison view
- AI analysis overlay

#### Analysis Interface
- Drag-and-drop for new documents
- Analysis type selection
- Real-time processing status
- Interactive results explorer

## Use Cases

1. **Sermon Preparation**
   - Upload sermon outline
   - Check against primary theological sources
   - Get suggestions for supporting quotes

2. **Book Review**
   - Analyze new theology book
   - Compare with trusted sources
   - Generate comprehensive review

3. **Study Group Preparation**
   - Create study guides from primary sources
   - Generate discussion questions
   - Track group reading progress

4. **Research Projects**
   - Build topic-specific sub-libraries
   - Track evolving theological thought
   - Export analysis for papers

## Integration with GTD System
- Create tasks from analysis insights
- Set reading goals and track progress
- Schedule study sessions based on energy levels
- Link theological insights to projects
