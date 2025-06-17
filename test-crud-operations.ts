import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function testCRUDOperations() {
  console.log('🧪 Testing CRUD Operations...\n');
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    // 1. Create a project
    console.log('1️⃣ Creating a project...');
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: 'Test Project',
        type: 'parallel',
        note: 'A test project to verify database functionality',
        review_interval_days: 7
      })
      .select()
      .single();
    
    if (projectError) throw new Error(`Project creation failed: ${projectError.message}`);
    console.log('✅ Project created:', project.name, `(ID: ${project.id})`);
    
    // 2. Create tags
    console.log('\n2️⃣ Creating tags...');
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .insert([
        { name: 'Important', color: '#FF0000', icon: '🔴' },
        { name: 'Work', color: '#0000FF', icon: '💼' }
      ])
      .select();
    
    if (tagsError) throw new Error(`Tags creation failed: ${tagsError.message}`);
    console.log('✅ Tags created:', tags.map(t => t.name).join(', '));
    
    // 3. Create a task with project and tags
    console.log('\n3️⃣ Creating a task...');
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        title: 'Test Task',
        note: 'This is a test task to verify functionality',
        status: 'active',
        project_id: project.id,
        energy_required: 'medium',
        estimated_minutes: 30
      })
      .select()
      .single();
    
    if (taskError) throw new Error(`Task creation failed: ${taskError.message}`);
    console.log('✅ Task created:', task.title, `(ID: ${task.id})`);
    
    // 4. Assign tags to task
    console.log('\n4️⃣ Assigning tags to task...');
    const { error: tagAssignError } = await supabase
      .from('task_tags')
      .insert(tags.map(tag => ({ task_id: task.id, tag_id: tag.id })));
    
    if (tagAssignError) throw new Error(`Tag assignment failed: ${tagAssignError.message}`);
    console.log('✅ Tags assigned to task');
    
    // 5. Create a perspective
    console.log('\n5️⃣ Creating a perspective...');
    const { data: perspective, error: perspectiveError } = await supabase
      .from('perspectives')
      .insert({
        name: 'High Energy Tasks',
        filter_rules: {
          status: ['active'],
          energy_required: ['high', 'medium']
        },
        sort_rules: [
          { field: 'due_date', direction: 'asc' },
          { field: 'created_at', direction: 'desc' }
        ]
      })
      .select()
      .single();
    
    if (perspectiveError) throw new Error(`Perspective creation failed: ${perspectiveError.message}`);
    console.log('✅ Perspective created:', perspective.name);
    
    // 6. Test reading data back
    console.log('\n6️⃣ Reading data back...');
    
    // Get task with relations
    const { data: taskWithRelations, error: readError } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects(*),
        task_tags(
          tag:tags(*)
        )
      `)
      .eq('id', task.id)
      .single();
    
    if (readError) throw new Error(`Read failed: ${readError.message}`);
    
    console.log('✅ Task retrieved with relations:');
    console.log('  - Title:', taskWithRelations.title);
    console.log('  - Project:', taskWithRelations.project?.name);
    console.log('  - Tags:', taskWithRelations.task_tags.map((tt: any) => tt.tag.name).join(', '));
    
    // 7. Test update
    console.log('\n7️⃣ Testing update...');
    const { error: updateError } = await supabase
      .from('tasks')
      .update({ title: 'Updated Test Task' })
      .eq('id', task.id);
    
    if (updateError) throw new Error(`Update failed: ${updateError.message}`);
    console.log('✅ Task updated successfully');
    
    // 8. Clean up
    console.log('\n8️⃣ Cleaning up test data...');
    
    // Delete in correct order due to foreign keys
    await supabase.from('task_tags').delete().eq('task_id', task.id);
    await supabase.from('tasks').delete().eq('id', task.id);
    await supabase.from('tags').delete().in('id', tags.map(t => t.id));
    await supabase.from('projects').delete().eq('id', project.id);
    await supabase.from('perspectives').delete().eq('id', perspective.id);
    
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 All CRUD operations completed successfully!');
    console.log('The database is fully functional for Session 4 features.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testCRUDOperations().catch(console.error);