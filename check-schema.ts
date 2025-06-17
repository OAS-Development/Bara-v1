import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function checkSchema() {
  console.log('🔍 Checking table schemas...\n');
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Query to get column information
  const { data: columns, error } = await supabase
    .rpc('get_table_columns', {
      schema_name: 'public'
    })
    .select('*');
  
  if (error) {
    // Fallback: try a simple query to infer schema
    console.log('Using fallback method to check schema...\n');
    
    const tables = ['projects', 'tasks', 'tags', 'task_tags', 'perspectives'];
    
    for (const table of tables) {
      console.log(`Table: ${table}`);
      try {
        // Insert a dummy row to see what columns are required
        const { error: insertError } = await supabase
          .from(table)
          .insert({})
          .select();
        
        if (insertError) {
          // Parse error message to find column info
          const message = insertError.message;
          console.log(`  Error reveals: ${message}\n`);
        }
      } catch (e) {
        console.log(`  Failed to check: ${e}\n`);
      }
    }
  } else {
    // Group columns by table
    const tableSchemas: Record<string, any[]> = {};
    columns?.forEach(col => {
      if (!tableSchemas[col.table_name]) {
        tableSchemas[col.table_name] = [];
      }
      tableSchemas[col.table_name].push(col);
    });
    
    // Print schema for each table
    for (const [table, cols] of Object.entries(tableSchemas)) {
      console.log(`Table: ${table}`);
      cols.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' (required)' : ''}`);
      });
      console.log('');
    }
  }
}

checkSchema().catch(console.error);