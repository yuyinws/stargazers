"use client";

import DatePicker from "./date-picker";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { subMonths } from "date-fns";
import { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/useStore";
import { useStarStore } from "@/store/star";
import { useAccountStore } from "@/store/account";

export default function Search() {
  const starStore = useStore(useStarStore, (state) => state)!;
  const accountStore = useStore(useAccountStore, (state) => state)!;

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 12),
    to: new Date(),
  });

  const [keyword, setKeyword] = useState("");
  const [language, setLanguage] = useState("");

  function handleSearch() {
    if (accountStore.currentAccount)
      starStore.getStarFromIndexDB(accountStore.currentAccount?.login);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <DatePicker
        dateRange={dateRange}
        setDateRange={setDateRange}
      ></DatePicker>
      <Input
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          starStore.setQueryForm({
            keyword: e.target.value,
          });
        }}
        className="w-[20rem]"
        placeholder="search by owner, repo name, description ..."
      ></Input>
      <Input
        value={language}
        onChange={(e) => {
          setLanguage(e.target.value);
          starStore.setQueryForm({
            language: e.target.value,
          });
        }}
        className="w-[20rem]"
        placeholder="search by language"
      ></Input>
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}
