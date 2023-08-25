"use client";

import RepoList from "@/components/repo-list";
import Search from "@/components/search";
import Pagination from "@/components/pagination";
import { useStore, useStarStore, useAccountStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/app/loading";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const starStore = useStore(useStarStore, (state) => state)!;
  const accountStore = useStore(useAccountStore, (state) => state)!;

  const router = useRouter();

  async function getAccount() {
    if (accountStore.currentAccount) {
      if (accountStore.currentAccount.lastSyncAt) {
        await starStore.getStarFromIndexDB(accountStore.currentAccount.login);
      } else {
        await starStore.fetchStars(accountStore.currentAccount.login);
        await accountStore.refreshAllAccount();
      }
    } else {
      router.replace("/login");
    }
  }

  useEffect(() => {
    if (accountStore) {
      getAccount();
    }
  }, [accountStore]);

  return (
    <div className="h-screen flex flex-col gap-3 w-[22rem] lg:w-[46rem] xl:w-[70rem] 2xl:w-[92rem] m-auto pt-2 pb-10">
      {!starStore || starStore?.loading ? (
        <>
          <Skeleton className="w-full h-[3rem]"></Skeleton>
          <Loading></Loading>
          <Skeleton className="w-full h-[3rem]"></Skeleton>
        </>
      ) : (
        <>
          <Search></Search>
          <RepoList></RepoList>
          <Pagination></Pagination>
        </>
      )}
    </div>
  );
}
