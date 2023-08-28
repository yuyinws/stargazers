"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Settings, PlusCircleIcon, CheckIcon } from "lucide-react";
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
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { subMonths } from "date-fns";

export default function Account() {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { getStarFromIndexDB, fetchStars, setQueryForm, syncSearchQueryForm } =
    useStarStore();
  const { currentAccount, setCurrentAccount, allAccount, refreshAllAccount } =
    useAccountStore();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {currentAccount ? (
          <div>
            <Avatar className={cn("h-[1.5rem] w-[1.5rem] ml-2 cursor-pointer")}>
              <AvatarImage src={currentAccount.avatarUrl} />
              <AvatarFallback>
                <Skeleton className="h-[1.5rem] w-[1.5rem] rounded-full"></Skeleton>
              </AvatarFallback>
            </Avatar>
          </div>
        ) : null}
      </PopoverTrigger>
      <PopoverContent className="w-[13rem] px-1 py-1 mt-2">
        <div>
          {allAccount?.map((account) => (
            <div
              key={account.login}
              onClick={async () => {
                if (currentAccount?.login === account.login) return;
                setCurrentAccount(account);
                setOpen(false);
                setQueryForm({
                  startTime: subMonths(new Date(), 12),
                  endTime: new Date(),
                  keyword: "",
                  language: "",
                });

                syncSearchQueryForm();

                if (!account.lastSyncAt) {
                  await fetchStars(account.login);
                  await refreshAllAccount();
                } else {
                  getStarFromIndexDB(account.login);
                }
              }}
              className={[
                "flex py-1.5 px-2 rounded-sm justify-between items-center hover:bg-accent",
                currentAccount?.login === account.login
                  ? "cursor-not-allowed"
                  : "cursor-pointer",
              ].join(" ")}
            >
              <div className="flex gap-2">
                <Avatar className={cn("h-[1.4rem] w-[1.4rem] cursor-pointer")}>
                  <AvatarImage src={account.avatarUrl} />
                  <AvatarFallback>
                    <Skeleton className="h-[1.4rem] w-[1.4rem] rounded-full"></Skeleton>
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{account.name}</span>
              </div>
              {currentAccount!.login === account.login && (
                <CheckIcon className="text-accent-foreground h-[1rem] w-[1rem]"></CheckIcon>
              )}
            </div>
          ))}
          <Separator className="my-1"></Separator>
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
              <div>
                <div className="text-sm rounded-sm flex py-1.5 px-2 gap-1 items-center hover:bg-accent cursor-pointer">
                  <PlusCircleIcon className="text-accent-foreground h-[1.2rem] w-[1.2rem]"></PlusCircleIcon>
                  Add account
                </div>
                <Link href="/settings">
                  <div
                    onClick={() => setOpen(false)}
                    className="text-sm rounded-sm flex py-1.5 px-2 gap-1 items-center hover:bg-accent cursor-pointer"
                  >
                    <Settings className="text-accent-foreground h-[1.2rem] w-[1.2rem]"></Settings>
                    Settings
                  </div>
                </Link>
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
                  setOpen(false);
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
