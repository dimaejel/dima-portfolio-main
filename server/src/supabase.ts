console.log("SUPABASE MODULE STARTED");
console.log("SUPABASE_URL EXISTS:", Boolean(process.env.SUPABASE_URL));
console.log("SUPABASE_KEY EXISTS:", Boolean(process.env.SUPABASE_KEY));

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
}

let client: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseKey) {
  try {
    client = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.error("Failed to initialize Supabase client (check SUPABASE_URL format):", err);
  }
}

export const supabase = client;