"use client";

import UserSearch from "@/components/user-search";
import { initDb, getAllAccount, addAccount } from "@/lib/db";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAccountStore, useSettingStore } from "@/store";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const accountStore = useAccountStore();
  const settingStore = useSettingStore();

  const access_token = searchParams.get("access_token");
  const encode = searchParams.get("encode");
  async function getAccount() {
    const db = await initDb();
    let addedUserLogin = "";

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

        addedUserLogin = user.login;

        toast.success("Account added");
      } catch (error) {
        toast.error("Error adding account", {
          description: String(error),
        });
      }
    } else if (encode) {
      try {
        const decoded = decodeURIComponent(atob(encode));
        const user = JSON.parse(decoded);

        await addAccount(db, {
          login: user.login,
          name: user.name,
          avatarUrl: user.avatar_url,
          from: "github",
          lastSyncAt: "",
          addedAt: new Date().toISOString(),
        });

        addedUserLogin = user.login;

        // if (settingStore.settings.autoSwitch) {
        //   const findAccount = accountStore.allAccount.find(
        //     (account) => account.login === userInfo.login
        //   );
        //   if (findAccount) accountStore?.setCurrentAccount(findAccount);
        // }

        toast.success("Account added");
      } catch (error) {
        toast.error("Error adding account", {
          description: String(error),
        });
      }
    }

    const accounts = await getAllAccount(db);
    if (accounts?.length > 0) {
      accountStore?.setAllAccount(accounts);

      if (settingStore.settings.autoSwitch) {
        const findAccount = accountStore.allAccount.find(
          (account) => account.login === addedUserLogin
        );
        if (findAccount) accountStore?.setCurrentAccount(findAccount);
      }

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
