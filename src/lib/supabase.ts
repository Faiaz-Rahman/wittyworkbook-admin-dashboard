import { createClient } from "@supabase/supabase-js";
import { auth } from "../utils/firebase";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_PUB_KEY!,
  //   {
  //     accessToken: async () => {
  //       console.log("current user =>", auth.currentUser?.getIdToken());
  //       return (await auth.currentUser?.getIdToken(true)) ?? null;
  //     },
  //   },
);
