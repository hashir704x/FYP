import { createClient } from "@supabase/supabase-js";

const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseURL || !supabaseApiKey) {
    throw new Error("Supabase keys not found");
}

const supabaseClient = createClient(supabaseURL, supabaseApiKey);

export { supabaseClient };
