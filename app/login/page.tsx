"use client";

import UserSearch from "@/components/user-search";
import { initDb, getAllAccount, addAccount } from "@/lib/db";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAccountStore, useSettingStore } from "@/store";
import styles from "@/styles/login.module.css";
import Balancer from "react-wrap-balancer";

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

      if (settingStore.settings.autoSwitch && addedUserLogin) {
        const findAccount = accounts.find(
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
    <>
      <div className="w-full h-screen flex flex-col items-center mt-20">
        <h1
          className={`${styles.title} text-5xl xl:text-7xl font-bold !leading-[1.5]`}
        >
          Stargazers
        </h1>
        <h2
          className={`text-center text-muted-foreground text-xl xl:text-2xl mb-10`}
        >
          <Balancer>Analyze and explore the stars of any GitHub user.</Balancer>
        </h2>
        <UserSearch></UserSearch>
      </div>
    </>
  );
}
