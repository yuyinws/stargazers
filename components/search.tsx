"use client";

import DatePicker from "./date-picker";
import { Button } from "@/components/ui/button";
import { subMonths, subYears } from "date-fns";
import { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/useStore";
import { useStarStore } from "@/store/star";
import { useAccountStore } from "@/store/account";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";
import { useState } from "react";
import Analyze from "@/components/analyze";

export default function Search() {
  const starStore = useStore(useStarStore, (state) => state)!;
  const accountStore = useStore(useAccountStore, (state) => state)!;
  const [picker, setPicker] = useState("2");

  function handleSearch() {
    starStore.syncSearchQueryForm();
    starStore.setPagintion({
      page: 1,
    });
    starStore.getStarFromIndexDB(accountStore.currentAccount?.login!);
  }

  function handleReset() {
    setPicker("2");
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

  return starStore ? (
    <div className="flex flex-wrap justify-between gap-3">
      <div className="flex flex-wrap gap-3">
        <Select
          onValueChange={(event) => {
            switch (event) {
              case "0":
                starStore.setQueryForm({
                  startTime: subMonths(new Date(), 3),
                  endTime: new Date(),
                });
                break;
              case "1":
                starStore.setQueryForm({
                  startTime: subMonths(new Date(), 6),
                  endTime: new Date(),
                });
                break;
              case "2":
                starStore.setQueryForm({
                  startTime: subYears(new Date(), 1),
                  endTime: new Date(),
                });
                break;
              case "3":
                starStore.setQueryForm({
                  startTime: subYears(new Date(), 2),
                  endTime: new Date(),
                });
                break;
              case "4":
                starStore.setQueryForm({
                  startTime: subYears(new Date(), 5),
                  endTime: new Date(),
                });
              case "5":
                starStore.setQueryForm({
                  startTime: subYears(new Date(), 10),
                  endTime: new Date(),
                });
            }

            setPicker(event);
          }}
          value={picker}
        >
          <SelectTrigger className="w-[20rem] xl:w-[10rem]">
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
          className="w-[20rem] xl:w-[15rem] 2xl:w-[20rem]"
          placeholder="search by owner, repo name, description ..."
        ></Input>
        <Input
          value={starStore.queryForm.language}
          onChange={(e) => {
            starStore.setQueryForm({
              language: e.target.value,
            });
          }}
          className="w-[20rem] xl:w-[15rem] 2xl:w-[20rem]"
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
