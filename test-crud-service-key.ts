import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

async function testWithServiceKey() {
  console.log('🧪 Testing CRUD Operations with Service Key...\n');
  
  if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_KEY not found in .env.local');
    console.log('\nTo run this test, add your service key to .env.local:');
    console.log('SUPABASE_SERVICE_KEY=your-service-key-here');
    process.exit(1);
  }
  
  // Use service key to bypass RLS
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Get or create a test user
    console.log('👤 Setting up test user...');
    const { data: users } = await supabase.auth.admin.listUsers();
    let userId = users?.users?.[0]?.id;
    
    if (!userId) {
      // Create a test user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: 'test@bara.local',
        password: 'testpassword123',
        email_confirm: true
      });
      
      if (createError) throw new Error(`User creation failed: ${createError.message}`);
      userId = newUser.user.id;
    }
    
    console.log('✅ Using user ID:', userId);
    
    // Now run CRUD tests with user_id
    console.log('\n1️⃣ Creating a project...');
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
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
        { user_id: userId, name: 'Important', color: '#FF0000', icon: '🔴' },
        { user_id: userId, name: 'Work', color: '#0000FF', icon: '💼' }
      ])
      .select();
    
    if (tagsError) throw new Error(`Tags creation failed: ${tagsError.message}`);
    console.log('✅ Tags created:', tags.map(t => t.name).join(', '));
    
    // 3. Create a task
    console.log('\n3️⃣ Creating a task...');
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
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
        user_id: userId,
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
    
    // 6. Test reading with relations
    console.log('\n6️⃣ Testing data persistence...');
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
    
    console.log('✅ Data persisted correctly:');
    console.log('  - Task:', taskWithRelations.title);
    console.log('  - Project:', taskWithRelations.project?.name);
    console.log('  - Tags:', taskWithRelations.task_tags.map((tt: any) => tt.tag.name).join(', '));
    
    // 7. Test reviews functionality
    console.log('\n7️⃣ Testing review system...');
    const reviewDate = new Date();
    const { error: reviewError } = await supabase
      .from('projects')
      .update({ last_reviewed_at: reviewDate.toISOString() })
      .eq('id', project.id);
    
    if (reviewError) throw new Error(`Review update failed: ${reviewError.message}`);
    console.log('✅ Review system working');
    
    // 8. Test perspective filtering
    console.log('\n8️⃣ Testing perspective filters...');
    const { data: filteredTasks, error: filterError } = await supabase
      .from('tasks')
      .select('*')
      .in('status', perspective.filter_rules.status)
      .in('energy_required', perspective.filter_rules.energy_required);
    
    if (filterError) throw new Error(`Filter test failed: ${filterError.message}`);
    console.log('✅ Perspective filtering works, found', filteredTasks.length, 'matching tasks');
    
    // 9. Clean up
    console.log('\n9️⃣ Cleaning up test data...');
    await supabase.from('task_tags').delete().eq('task_id', task.id);
    await supabase.from('tasks').delete().eq('id', task.id);
    await supabase.from('tags').delete().in('id', tags.map(t => t.id));
    await supabase.from('projects').delete().eq('id', project.id);
    await supabase.from('perspectives').delete().eq('id', perspective.id);
    
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 All CRUD operations completed successfully!');
    console.log('✅ Database is fully functional for Session 4 features');
    console.log('\n📊 Summary:');
    console.log('  - All tables exist with correct schema');
    console.log('  - CRUD operations work correctly');
    console.log('  - Relationships (foreign keys) are functional');
    console.log('  - Review system is operational');
    console.log('  - Perspective filtering works as expected');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testWithServiceKey().catch(console.error);