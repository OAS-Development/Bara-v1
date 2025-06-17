import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function checkDatabase() {
  console.log('🔍 Checking database state...\n');
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  const tables = ['projects', 'tasks', 'tags', 'task_tags', 'perspectives'];
  const results: Record<string, any> = {};
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: false })
        .limit(1);
      
      if (error) {
        results[table] = {
          exists: false,
          error: error.message,
          code: error.code
        };
      } else {
        results[table] = {
          exists: true,
          count: count || 0,
          sample: data?.[0] || null
        };
      }
    } catch (e) {
      results[table] = {
        exists: false,
        error: e instanceof Error ? e.message : 'Unknown error'
      };
    }
  }
  
  // Print results
  console.log('📊 Database Table Status:\n');
  for (const [table, result] of Object.entries(results)) {
    console.log(`Table: ${table}`);
    console.log(`  Exists: ${result.exists ? '✅' : '❌'}`);
    if (result.exists) {
      console.log(`  Count: ${result.count}`);
      if (result.sample) {
        console.log(`  Sample columns: ${Object.keys(result.sample).join(', ')}`);
      }
    } else {
      console.log(`  Error: ${result.error} (${result.code || 'N/A'})`);
    }
    console.log('');
  }
  
  // Check if migrations need to be run
  const missingTables = Object.entries(results)
    .filter(([_, result]) => !result.exists)
    .map(([table]) => table);
  
  if (missingTables.length > 0) {
    console.log('⚠️  Missing tables:', missingTables.join(', '));
    console.log('\n📝 Migrations need to be run!');
    console.log('Run migrations using Supabase dashboard or CLI');
  } else {
    console.log('✅ All required tables exist!');
  }
}

checkDatabase().catch(console.error);