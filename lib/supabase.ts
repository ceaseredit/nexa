// import { createClient } from "@supabase/supabase-js";

// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// );
import { createClient } from "@supabase/supabase-js";

let realClient: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!realClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    realClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return realClient;
}

// Proxy that lazily initializes the client on first property access
export const supabase = new Proxy({} as any, {
  get(_, prop) {
    return getClient()[prop as keyof typeof realClient];
  },
});
