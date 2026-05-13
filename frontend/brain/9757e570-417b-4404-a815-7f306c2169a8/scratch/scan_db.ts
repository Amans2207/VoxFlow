import { createClient } from './src/utils/supabase/server.ts';

async function scanProfiles() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    
    if (error) {
      console.error("Error fetching profiles:", error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log("PROFILE COLUMNS FOUND:", Object.keys(data[0]));
    } else {
      console.log("Profiles table is empty. Trying to insert a test profile...");
      // Try to find the auth user to insert for them
      const { data: { users } } = await supabase.auth.admin.listUsers();
      if (users && users.length > 0) {
        console.log("Found user:", users[0].id);
      }
    }
  } catch (err) {
    console.error("Scan failed:", err);
  }
}

scanProfiles();
