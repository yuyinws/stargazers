"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import Loading from "@/app/loading";

export default function RepoList() {
  const { data, error, isLoading } = useSWR("/api/gh/stars", fetcher);

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (error) {
    return <div>Failed to load</div>;
  }

  return <div>{JSON.stringify(data)}</div>;
}
