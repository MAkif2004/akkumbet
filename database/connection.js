import {createClient} from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lugrfbxmtyvgjgfohrag.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Z3JmYnhtdHl2Z2pnZm9ocmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTMxNjYsImV4cCI6MjA4OTA2OTE2Nn0.PcpeK4175YlwVmRWb5AzzG0efLMC2rCe9JkOgtiBkJE'

export const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

