import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";
import Cookies from "js-cookie";

interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// ─────────────────────────────
// LOGIN
// ─────────────────────────────
export const userLogin = createAsyncThunk(
  "user/login",
  async ({ routingNumber, password }: any, { rejectWithValue }) => {
    const cleanedRoutingNumber = routingNumber?.trim();
    const cleanedPassword = password?.trim();

    if (!cleanedRoutingNumber || !cleanedPassword) {
      return rejectWithValue("All fields are required");
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("routingNumber", cleanedRoutingNumber)
        .single();

      if (error || !data) throw new Error("User not found");

      if (data.password !== cleanedPassword) {
        throw new Error("Invalid credentials");
      }

      if (data.blocked) {
        throw new Error(
          "Your account has been blocked. Please contact support.",
        );
      }

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// ─────────────────────────────
// CHECK AUTH (RUN ON REFRESH)
// ─────────────────────────────
export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      if (typeof window === "undefined") throw new Error("No window");

      // Get persisted user id — redux-persist already gave us the cached data
      // We just need to verify + refresh from Supabase
      const raw = localStorage.getItem("persist:root");
      if (!raw) throw new Error("No session");

      const root = JSON.parse(raw);
      const user = JSON.parse(root.user ?? "{}");
      const parsed = user?.user;

      if (!parsed?.id) throw new Error("Invalid session");

      // ── Always fetch fresh from Supabase ──
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", parsed.id)
        .single();

      if (error || !data) throw new Error("Session expired");

      if (data.blocked) {
        localStorage.removeItem("persist:root");
        Cookies.remove("user");
        throw new Error(
          "Your account has been blocked. Please contact support.",
        );
      }

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// ─────────────────────────────
// SLICE
// ─────────────────────────────
const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    userLogout: (state) => {
      state.user = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("user_cached_at");
        Cookies.remove("user");
        Cookies.remove("admin");
        localStorage.removeItem("admin");
      }
    },

    // Instantly hydrate from localStorage — call this before checkAuth
    setUserFromCache: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // ─── LOGIN ───
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(action.payload));
          localStorage.setItem("user_cached_at", String(Date.now()));
          Cookies.remove("admin");
          localStorage.removeItem("admin");
          Cookies.set("user", JSON.stringify(action.payload), { expires: 1 });
        }
      })
      .addCase(userLogin.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── CHECK AUTH ───
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(action.payload));
          localStorage.setItem("user_cached_at", String(Date.now()));
          Cookies.set("user", JSON.stringify(action.payload), { expires: 1 });
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;

        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          localStorage.removeItem("user_cached_at");
          Cookies.remove("user");
        }
      });
  },
});

export const { userLogout, setUserFromCache } = userAuthSlice.actions;
export default userAuthSlice.reducer;
