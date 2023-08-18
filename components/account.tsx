"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Account } from "@/lib/db";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import UserSearch from "@/components/user-search";
import { useStarStore } from "@/store/star";
import { useAccountStore } from "@/store/account";
import { Skeleton } from "@/components/ui/skeleton";

export default function Account() {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { getStarFromIndexDB, fetchStars } = useStarStore();
  const { currentAccount, setCurrentAccount, allAccount, refreshAllAccount } =
    useAccountStore();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {currentAccount ? (
          <Avatar className={cn("h-[2rem] w-[2rem] ml-2 cursor-pointer")}>
            <AvatarImage src={currentAccount.avatarUrl} />
            <AvatarFallback>
              <Skeleton className="h-[2rem] w-[2rem] rounded-full"></Skeleton>
            </AvatarFallback>
          </Avatar>
        ) : null}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] py-2 px-0">
        <div>
          {allAccount?.map((account) => (
            <div
              key={account.login}
              onClick={async () => {
                setCurrentAccount(account);
                localStorage.setItem("current-acount", JSON.stringify(account));
                setOpen(false);
                if (!account.lastSyncAt) {
                  await fetchStars(account.login);
                  await refreshAllAccount();
                } else {
                  getStarFromIndexDB(account.login);
                }
              }}
              className="flex items-center py-1 cursor-pointer gap-2 hover:bg-slate-100"
            >
              <Avatar
                className={cn("h-[1.4rem] w-[1.4rem] ml-2 cursor-pointer")}
              >
                <AvatarImage src={account.avatarUrl} />
                <AvatarFallback>
                  <Skeleton className="h-[1.4rem] w-[1.4rem] rounded-full"></Skeleton>
                </AvatarFallback>
              </Avatar>
              <span className="text-[14px]">{account.name}</span>
            </div>
          ))}

          <div className="h-[1px] bg-zinc-200 my-2"></div>
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
              <div className="flex items-center px-2 py-1 gap-2 hover:bg-slate-100 cursor-pointer">
                <PlusCircledIcon className="h-[1rem] w-[1rem]"></PlusCircledIcon>
                <span className="text-[14px]">Add account</span>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="flex flex-col items-center gap-0">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-3xl mb-5">
                  Add account
                </AlertDialogTitle>
              </AlertDialogHeader>
              <UserSearch
                callback={() => {
                  setDialogOpen(false);
                }}
              ></UserSearch>
              <AlertDialogFooter className="mt-5">
                <AlertDialogCancel className="w-[270px]">
                  Cancel
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </PopoverContent>
    </Popover>
  );
}
