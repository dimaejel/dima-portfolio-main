console.log("SUPABASE MODULE STARTED");
console.log("SUPABASE_URL EXISTS:", Boolean(process.env.SUPABASE_URL));
console.log("SUPABASE_KEY EXISTS:", Boolean(process.env.SUPABASE_KEY));

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_KEY?.trim();

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
