"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AccountForm from "@/components/dashboardComponents/AccountForm";

import { supabase } from "@/lib/supabase";

export default function EditAccountPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  console.log(id);

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
