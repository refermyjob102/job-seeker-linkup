
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wdubevmcchmapgtmtlka.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkdWJldm1jY2htYXBndG10bGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNjA1MDgsImV4cCI6MjA1NzczNjUwOH0.WeKTDpXq_hfueOkwAx5e0AZv0ZerDS6-1tKdPG5DhYQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
