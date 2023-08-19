"use client";

import UserSearch from "@/components/user-search";
import { initDb, getAllAccount, addAccount } from "@/lib/db";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const access_token = searchParams.get("access_token");
  async function getAccount() {
    const db = await initDb();

    if (access_token) {
      const response = await fetch("/api/gh/user?access_token=" + access_token);
      const { user } = await response.json();
      try {
        await addAccount(db, {
          login: user.login,
          name: user.name,
          avatarUrl: user.avatar_url,
          from: "github",
          lastSyncAt: "",
        });

        toast({
          title: "Account added",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error adding account",
          description: String(error),
        });
      }
    }

    const accounts = await getAllAccount(db);

    if (accounts?.length > 0) {
      router.replace("/");
    }
  }

  useEffect(() => {
    getAccount();
  }, []);

  return (
    <div className="w-full h-screen  flex justify-center">
      <div className="py-20 flex flex-col">
        <h1 className="text-3xl font-bold mb-5 px-10">Add account</h1>
        <UserSearch></UserSearch>
      </div>
    </div>
  );
}
