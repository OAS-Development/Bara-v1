#!/bin/bash
# Helper script to display migrations for Supabase dashboard

echo "🚀 SUPABASE MIGRATION HELPER"
echo "==========================="
echo ""
echo "Since Supabase client can't run raw SQL, copy these to your Supabase SQL Editor:"
echo ""
echo "1. Go to: https://app.supabase.com"
echo "2. Open your project (bcbbpwarqvaoaczqvdpv)"
echo "3. Click 'SQL Editor' in the sidebar"
echo "4. Create a new query"
echo ""
echo "📋 MIGRATION 1 - Create Tables:"
echo "================================"
cat supabase/migrations/001_create_tables.sql
echo ""
echo ""
echo "📋 MIGRATION 2 - RLS Policies:"
echo "================================"
cat supabase/migrations/002_rls_policies.sql
echo ""
echo ""
echo "✅ Run each migration separately in the SQL Editor"
echo "✅ After running, click 'Run' and verify success"
echo ""
