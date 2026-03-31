"use client";

import { Provider } from "react-redux";
import { store, persistor } from "@/store";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, userLogout } from "@/store/slices/userAuthSlice";
import { createClient } from "@supabase/supabase-js";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

function AuthVerifier() {
  const dispatch = useDispatch<any>();
  const router = useRouter();

  // ← fix: use state.userAuth not state.user
  const user = useSelector((state: RootState) => state.user?.user ?? null);

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`user-block-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Realtime UPDATE:", payload.new);
          if (payload.new?.blocked === true) {
            dispatch(userLogout());
            router.replace("/signin?reason=blocked");
          }
        },
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return null;
}

export default function Providers({ children }: any) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthVerifier />
        {children}
      </PersistGate>
    </Provider>
  );
}
