import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";
import { loadAdmin } from "../hydrate";
import Cookies from "js-cookie";

interface AuthState {
  admin: any;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  admin: loadAdmin(),
  loading: false,
  error: null,
};

//
// 🔐 ADMIN SIGNUP
//
export const adminSignup = createAsyncThunk(
  "admin/signup",
  async ({ username, password }: any, { rejectWithValue }) => {
    const cleanedUsername = username.trim();
    const cleanedPassword = password.trim();
    try {
      // ── Check if sign-up is open ──
      const { data: config, error: configError } = await supabase
        .from("config")
        .select("openAdminSignUp")
        .single();

      if (configError || !config) {
        throw new Error("Unable to verify sign-up status. Try again.");
      }

      if (config.openAdminSignUp !== true) {
        throw new Error("Admin sign-up is currently closed.");
      }

      const { data, error } = await supabase
        .from("admins")
        .insert([
          {
            username: cleanedUsername,
            password: cleanedPassword,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      await fetch("/api/email/admin-created", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cleanedUsername,
        }),
      });

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

//
// 🔐 ADMIN LOGIN
//
export const adminLogin = createAsyncThunk(
  "admin/login",
  async ({ username, password }: any, { rejectWithValue }) => {
    try {
      const cleanedUsername = username.trim();
      const cleanedPassword = password.trim();

      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .eq("username", cleanedUsername)
        .maybeSingle();

      if (!data) throw new Error("Admin not found");

      if (data.password !== cleanedPassword) {
        throw new Error("Invalid credentials");
      }

      if (data.blocked === true) {
        throw new Error(
          "Your account has been blocked. Contact a master admin.",
        );
      }

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    adminLogout: (state) => {
      state.admin = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("admin");
        Cookies.remove("admin"); // ✅ important
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // SIGNUP
      .addCase(adminSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(adminSignup.rejected, (state, action: any) => {
        state.loading = false;
        // Humanise Postgres unique-constraint violation
        const raw: string = action.payload ?? "";
        state.error = raw.includes("unique constraint")
          ? "That username is already taken. Please choose a different one."
          : raw;
      })

      // LOGIN
      .addCase(adminLogin.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        console.log("LOGIN SUCCESS:", action.payload); // 👈 add this

        if (typeof window !== "undefined") {
          localStorage.setItem("admin", JSON.stringify(action.payload));

          Cookies.set("admin", JSON.stringify(action.payload), {
            // expires: 1, // 1 day
          });
        }
      })

      .addCase(adminLogin.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
