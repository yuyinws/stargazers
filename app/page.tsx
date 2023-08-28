"use client";

import RepoList from "@/components/repo-list";
import Search from "@/components/search";
import Pagination from "@/components/pagination";
import {
  useStore,
  useStarStore,
  useAccountStore,
  useSettingStore,
} from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/app/loading";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const starStore = useStore(useStarStore, (state) => state)!;
  const accountStore = useStore(useAccountStore, (state) => state)!;
  const settingStore = useStore(useSettingStore, (state) => state)!;
  const router = useRouter();

  async function getAccount() {
    if (accountStore.currentAccount) {
      if (accountStore.currentAccount.lastSyncAt) {
        const dateRange = settingStore.settings.dateRange;
        starStore.setQueryForm({
          startTimeId: dateRange,
        });

        starStore.syncSearchQueryForm();
        await starStore.getStarFromIndexDB(accountStore!.currentAccount!.login);
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
  }, [accountStore?.allAccount]);

  return (
    <div className="min-h-screen flex flex-col gap-3 w-[22rem] lg:w-[46rem] xl:w-[70rem] 2xl:w-[92rem] m-auto pt-2 pb-10">
      {!starStore || starStore?.loading ? (
        <>
          <Skeleton className="w-full h-[3rem]"></Skeleton>
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {Array(12)
              .fill(0)
              .map((_, index) => {
                return (
                  <div key={index}>
                    <div className="rounded-lg border bg-card text-card-foreground w-[22rem] h-[11rem]">
                      <div className="px-5 py-3 h-full flex flex-col justify-between">
                        <div>
                          <div className="flex gap-2">
                            <Skeleton className="h-[1.5rem] w-[1.5rem] rounded-full"></Skeleton>
                            <Skeleton className="h-[1.3rem] flex-1"></Skeleton>
                          </div>
                          <Skeleton className="h-[1.3rem] flex-1 mt-2"></Skeleton>
                          <Skeleton className="h-[5rem] flex-1 mt-2"></Skeleton>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
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
