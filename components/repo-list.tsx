"use client";

import useSWR, { mutate } from "swr";
import Loading from "@/app/loading";

export default function RepoList() {
  const { data, error } = useSWR("/api/gh/stars", null);

  async function fetchData() {
    try {
      const response = await fetch("/api/gh/stars");
      const data = await response.json();
      mutate("/api/gh/stars", data);
    } catch (error) {}
  }

  fetchData();

  if (!data) {
    return <Loading></Loading>;
  }

  if (error) {
    return <div>Failed to load</div>;
  }

  return <div>{JSON.stringify(data)}</div>;
}
