import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let client: ReturnType<typeof createClient> | null = null;

try {
  if (supabaseUrl && supabaseKey) {
    client = createClient(supabaseUrl, supabaseKey);
  } else {
    console.error("Missing Supabase environment variables");
  }
} catch (error) {
  console.error("Failed to initialize Supabase:", error);
}

export const supabase = client;
