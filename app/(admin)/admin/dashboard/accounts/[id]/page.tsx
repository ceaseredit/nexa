"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import AccountForm from "@/components/dashboardComponents/AccountForm";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function EditAccountPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

console.log(id)

  const fetchAccount = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    setData(data);
  };
    
  useEffect(() => {
    fetchAccount();
  }, []);

  if (!data) return <p className="p-6">Loading...</p>;

  return <AccountForm mode="edit" initialData={data} />;
}
