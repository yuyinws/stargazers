"use client";

import DatePicker from "./date-picker";
import { Button } from "@/components/ui/button";
import { subMonths, subYears } from "date-fns";
import { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";
import {
  useStore,
  useStarStore,
  useAccountStore,
  useSettingStore,
} from "@/store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";
import { useState, useEffect } from "react";
import Analyze from "@/components/analyze";

export default function Search() {
  const starStore = useStore(useStarStore, (state) => state)!;
  const accountStore = useStore(useAccountStore, (state) => state)!;
  const settingStore = useStore(useSettingStore, (state) => state)!;
  // const [picker, setPicker] = useState("2");

  function handleSearch() {
    console.log(starStore);
    starStore.syncSearchQueryForm();
    starStore.setPagintion({
      page: 1,
    });
    starStore.getStarFromIndexDB(accountStore.currentAccount?.login!);
  }

  function handleReset() {
    // setPicker("2");
    starStore.setQueryForm({
      startTime: subMonths(new Date(), 12),
      endTime: new Date(),
      keyword: "",
      language: "",
    });
    starStore.syncSearchQueryForm();
    starStore.setPagintion({
      page: 1,
      size: 12,
    });
    starStore.getStarFromIndexDB(accountStore.currentAccount?.login!);
  }

  useKeyboardShortcut(["enter"], handleSearch);

  useEffect(() => {
    // console.log({
    //   settingStore,
    // });
    // if (settingStore) {
    //   starStore.setQueryForm({
    //     startTimeId: settingStore.settings.dateRange,
    //   });
    // }
  }, []);

  return starStore ? (
    <div className="flex flex-wrap gap-2 justify-between w-full">
      <div className="flex flex-wrap gap-3">
        <Select
          onValueChange={(event) => {
            starStore.setQueryForm({
              startTimeId: event,
            });
          }}
          value={starStore.queryForm.startTimeId}
        >
          <SelectTrigger className="w-[22rem] xl:w-[10rem]">
            <SelectValue placeholder="Pick a date range"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="0">Last 3 months</SelectItem>
              <SelectItem value="1">Last 6 months</SelectItem>
              <SelectItem value="2">Last 1 year</SelectItem>
              <SelectItem value="3">Last 2 year</SelectItem>
              <SelectItem value="4">Last 5 year</SelectItem>
              <SelectItem value="5">Last 10 year</SelectItem>
              <SelectItem value="6">Last 20 year</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <DatePicker
          dateRange={{
            from: starStore.queryForm.startTime,
            to: starStore.queryForm.endTime,
          }}
          setDateRange={(event: DateRange) => {
            if (event) {
              starStore.setQueryForm({
                startTime: event.from,
                endTime: event.to,
              });
            }
          }}
        ></DatePicker>
        <Input
          value={starStore.queryForm.keyword}
          onChange={(e) => {
            starStore.setQueryForm({
              keyword: e.target.value,
            });
          }}
          className="w-[22rem] xl:w-[15rem] 2xl:w-[20rem]"
          placeholder="search by owner, repo name, description ..."
        ></Input>
        <Input
          value={starStore.queryForm.language}
          onChange={(e) => {
            starStore.setQueryForm({
              language: e.target.value,
            });
          }}
          className="w-[22rem] xl:w-[15rem] 2xl:w-[20rem]"
          placeholder="search by language"
        ></Input>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSearch}>Search</Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Analyze></Analyze>
      </div>
    </div>
  ) : (
    ""
  );
}
