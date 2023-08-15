"use client";

import UserSearch from "@/components/user-search";
import { initDb, getAllAccount } from "@/lib/db";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();
  async function getAccount() {
    const db = await initDb();
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
