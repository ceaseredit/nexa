import { useMemo, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const NAMES = [
  "SpongeBob Official",
  "Christine Long",
  "Sam's Club",
  "Netflix",
  "Amazon",
  "Walmart",
  "Apple Store",
  "Google Pay",
  "Spotify",
  "Uber",
  "Lyft",
  "Airbnb",
  "PayPal",
  "Venmo",
  "Stripe",
  "Shopify",
  "Target",
  "Best Buy",
  "Costco",
  "McDonald's",
  "Starbucks",
  "Chick-fil-A",
  "Whole Foods",
  "Trader Joe's",
  "Home Depot",
  "IKEA",
  "Zara",
  "H&M",
  "Nike Store",
  "Adidas",
];
const TYPES = ["credit", "debit"];
const STATUSES = ["Completed", "Completed", "Completed", "Failed"];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function userIdToSeed(userId: string): number {
  return userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

function generateStatic(count: number, beforeMs: number, seed: number) {
  const rng = seededRandom(seed);
  const entries = [];
  const fiveYearsAgo = beforeMs - 365 * 5 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < count; i++) {
    const randomMs = fiveYearsAgo + rng() * (beforeMs - fiveYearsAgo);
    const nameIdx = Math.floor(rng() * NAMES.length);
    const typeIdx = Math.floor(rng() * TYPES.length);
    const statusIdx = Math.floor(rng() * STATUSES.length);
    const amount = Math.floor(rng() * 49999) + 1;

    entries.push({
      name: NAMES[nameIdx],
      date: new Date(randomMs).toISOString().split("T")[0],
      amount: String(amount),
      type: TYPES[typeIdx],
      status: STATUSES[statusIdx],
      _static: true,
    });
  }

  return entries;
}

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const cacheKey = (userId: string) => `history_cache_${userId}`;

function loadCache(userId: string): any[] | null {
  try {
    const raw = localStorage.getItem(cacheKey(userId));
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) {
      localStorage.removeItem(cacheKey(userId));
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function saveCache(userId: string, data: any[]) {
  try {
    localStorage.setItem(
      cacheKey(userId),
      JSON.stringify({ ts: Date.now(), data }),
    );
  } catch {}
}

export function useHistory(userId: string) {
  const [dbHistory, setDbHistory] = useState<any[]>([]);
  const [staticHistory, setStaticHistory] = useState<any[]>([]);
  const [hasHistory, setHasHistory] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select("history, hasHistory")
          .eq("id", userId)
          .single();

        if (error) throw error;
        setDbHistory(Array.isArray(data?.history) ? data.history : []);
        setHasHistory(!!data?.hasHistory);
      } catch (err: any) {
        console.error(
          "useHistory fetch failed:",
          err?.message ?? err?.code ?? JSON.stringify(err),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);
  const oldestMs = useMemo(() => {
    if (!dbHistory.length) return Date.now() - 30 * 24 * 60 * 60 * 1000;
    return Math.min(...dbHistory.map((h) => new Date(h.date).getTime()));
  }, [dbHistory]);

  useEffect(() => {
    if (!userId || loading || !hasHistory) return;
    if (typeof window === "undefined") return;

    const cached = loadCache(userId);
    if (cached) {
      setStaticHistory(cached);
      return;
    }

    const seed = userIdToSeed(userId);
    const generated = generateStatic(500, oldestMs, seed);
    saveCache(userId, generated);
    setStaticHistory(generated);
  }, [userId, oldestMs, loading, hasHistory]);

  const all = useMemo(() => {
    if (!hasHistory) {
      return [...dbHistory].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }
    const dbKeys = new Set(dbHistory.map((h) => h.date + h.name));
    const filteredStatic = staticHistory.filter(
      (h) => !dbKeys.has(h.date + h.name),
    );
    return [...dbHistory, ...filteredStatic].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [dbHistory, staticHistory, hasHistory]);

  return { history: all, loading, hasHistory };
}
