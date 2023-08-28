"use client";

import UserSearch from "@/components/user-search";
import { initDb, getAllAccount, addAccount } from "@/lib/db";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAccountStore } from "@/store/account";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const accountStore = useAccountStore();

  const access_token = searchParams.get("access_token");
  const encode = searchParams.get("encode");
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
          addedAt: new Date().toISOString(),
        });

        toast.success("Account added");
      } catch (error) {
        toast.error("Error adding account", {
          description: String(error),
        });
      }
    } else if (encode) {
      try {
        const decoded = atob(encode);
        const userInfo = JSON.parse(decoded);

        await addAccount(db, {
          login: userInfo.login,
          name: userInfo.name,
          avatarUrl: userInfo.avatar_url,
          from: "github",
          lastSyncAt: "",
          addedAt: new Date().toISOString(),
        });

        toast.success("Account added");
      } catch (error) {}
    }

    const accounts = await getAllAccount(db);
    if (accounts?.length > 0) {
      accountStore?.setAllAccount(accounts);
      if (!accountStore?.currentAccount) {
        accountStore?.setCurrentAccount(accounts[0]);
      }
      router.replace("/");
    }
  }

  useEffect(() => {
    getAccount();
  }, []);

  return (
    <div className="w-full h-screen flex justify-center">
      <div className="py-60 flex flex-col">
        <h1 className="text-3xl font-bold mb-5 px-10">Add account</h1>
        <UserSearch></UserSearch>
      </div>
    </div>
  );
}
