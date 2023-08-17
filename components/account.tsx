"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { initDb, getAllAccount } from "@/lib/db";
import { useRouter } from "next/navigation";
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

export default function Account() {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { getStarFromIndexDB } = useStarStore();
  const { currentAccount, setCurrentAccount, allAccount } = useAccountStore();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {currentAccount ? (
          <Avatar className={cn("h-[2rem] w-[2rem] ml-2 cursor-pointer")}>
            <AvatarImage src={currentAccount.avatarUrl} />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
        ) : null}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] py-2 px-0">
        <div>
          {allAccount?.map((account) => (
            <div
              key={account.login}
              onClick={() => {
                setCurrentAccount(account);
                localStorage.setItem("current-acount", JSON.stringify(account));
                getStarFromIndexDB(account.login);
                setOpen(false);
              }}
              className="flex items-center py-1 cursor-pointer gap-2 hover:bg-slate-100"
            >
              <Avatar
                className={cn("h-[1.4rem] w-[1.4rem] ml-2 cursor-pointer")}
              >
                <AvatarImage src={account.avatarUrl} />
                <AvatarFallback>S</AvatarFallback>
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
              <UserSearch></UserSearch>
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
