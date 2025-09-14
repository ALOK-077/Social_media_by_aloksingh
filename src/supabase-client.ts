import { createClient } from "@supabase/supabase-js";

// Env variables import karna
const supabaseURL = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAPIKEY = import.meta.env.VITE_SUPABASE_API_KEY as string;

// Client create karna
export const supabase = createClient(supabaseURL, supabaseAPIKEY);
