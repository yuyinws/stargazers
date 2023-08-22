"use client";

import RepoList from "@/components/repo-list";
import Search from "@/components/search";
import Pagination from "@/components/pagination";

export default function Home() {
  return (
    <div className="flex flex-col gap-3 w-[22rem] lg:w-[46rem] xl:w-[70rem] 2xl:w-[94rem] m-auto py-20">
      <Search></Search>
      <RepoList></RepoList>
      <Pagination></Pagination>
    </div>
  );
}
