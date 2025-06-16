# OmniFocus Data Migration Strategy

## Importing Your Existing Task Database

### 1. Export Options from OmniFocus
```typescript
interface OmniFocusExport {
  formats: {
    // OmniFocus supports these export formats
    omnifocusArchive: '.ofocus-archive'; // Complete backup
    taskPaper: '.taskpaper'; // Plain text format
    csv: '.csv'; // Basic data export
    opml: '.opml'; // Outline format
  };
  
  // What we can extract
  exportData: {
    tasks: Task[];
    projects: Project[];
    contexts: Context[];
    perspectives: Perspective[];
    attachments: Attachment[];
    notes: Note[];
    completedItems: CompletedTask[];
    archivedItems: ArchivedItem[];
  };
}
```

### 2. Import Pipeline for Bara-v1
```typescript
interface ImportPipeline {
  // Step 1: Parse OmniFocus export
  parser: {
    detectFormat(file: File): ExportFormat;
    parseArchive(archive: OFArchive): ParsedData;
    parseTaskPaper(text: string): ParsedData;
    validateData(data: ParsedData): ValidationResult;
  };
  
  // Step 2: Transform to Bara format
  transformer: {
    mapContextsToTags(contexts: OFContext[]): Tag[];
    mapPerspectives(perspectives: OFPerspective[]): View[];
    preserveHierarchy(projects: OFProject[]): Project[];
    maintainRelationships(tasks: OFTask[]): Task[];
  };
  
  // Step 3: Import with history
  importer: {
    createImportSession(): ImportSession;
    importBatch(items: Item[], batchSize: number): Progress;
    preserveMetadata: {
      createdDate: boolean;
      completedDate: boolean;
      modifiedDate: boolean;
      notes: boolean;
      attachments: boolean;
    };
    
    // Search index for historical data
    indexForSearch: {
      fullTextIndex: boolean;
      completedTasksSearchable: boolean;
      archivedProjectsIncluded: boolean;
    };
  };
}
```

### 3. Historical Data Access
```typescript
interface HistoricalSearch {
  // Dedicated search for imported OmniFocus data
  searchHistorical: {
    scope: 'all' | 'completed' | 'archived' | 'active';
    dateRange?: DateRange;
    includeAttachments: boolean;
    includeNotes: boolean;
  };
  
  // Special view for legacy data
  legacyView: {
    name: "OmniFocus Archive";
    icon: "archive";
    filters: {
      source: 'omnifocus-import';
      preserveOriginalDates: true;
    };
  };
  
  // Migration status
  migrationTracking: {
    totalItems: number;
    importedItems: number;
    failedItems: Item[];
    importDate: Date;
    omnifocusVersion: string;
  };
}
```

### 4. Import UI/UX
```typescript
interface ImportInterface {
  // Import wizard
  steps: [
    {
      name: "Select Export File";
      description: "Choose your OmniFocus archive or export file";
      fileTypes: ['.ofocus-archive', '.taskpaper', '.csv'];
    },
    {
      name: "Preview Data";
      description: "Review what will be imported";
      preview: {
        projects: number;
        tasks: number;
        completed: number;
        attachments: number;
      };
    },
    {
      name: "Configure Import";
      options: {
        importCompleted: boolean;
        importArchived: boolean;
        preserveDates: boolean;
        mapContextsToTags: boolean;
      };
    },
    {
      name: "Import Progress";
      realTimeUpdates: boolean;
      pauseable: boolean;
    }
  ];
}
```

## Design System Preservation

### Key OmniFocus Design Elements to Maintain:
1. **Sidebar Navigation** - Clean perspective list
2. **Dark Theme** - Easy on the eyes for long sessions
3. **Information Density** - Lots of data, minimal chrome
4. **Keyboard Navigation** - Power user friendly
5. **Inspector Panel** - Contextual task details
6. **Forecast View** - Calendar integration
7. **Quick Entry** - Rapid task capture

### Enhanced for Bara-v1:
- Keep the familiar layout while adding our new features
- Maintain keyboard shortcuts where possible
- Preserve the workflow patterns you're used to
- Add new capabilities without cluttering the interface
