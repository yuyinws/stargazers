"use client";

import RepoList from "@/components/repo-list";
import Search from "@/components/search";
import Pagination from "@/components/pagination";
import { useAccountStore } from "@/store/account";
import { useStarStore } from "@/store/star";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/app/loading";

export default function Home() {
  const { getStarFromIndexDB, loading, fetchStars } = useStarStore(
    (state) => state
  );
  const { currentAccount, refreshAllAccount } = useAccountStore();

  const router = useRouter();
  async function getAccount() {
    if (currentAccount) {
      if (currentAccount.lastSyncAt) {
        await getStarFromIndexDB(currentAccount.login);
      } else {
        await fetchStars(currentAccount.login);
        await refreshAllAccount();
      }
    } else {
      router.replace("/login");
    }
  }

  useEffect(() => {
    getAccount();
  }, []);

  return (
    <div className="flex flex-col gap-3 w-[22rem] lg:w-[46rem] xl:w-[70rem] 2xl:w-[94rem] m-auto pt-2 pb-10">
      <Search></Search>
      {loading ? (
        <Loading></Loading>
      ) : (
        <>
          <RepoList></RepoList>
        </>
      )}
      <Pagination></Pagination>
    </div>
  );
}
