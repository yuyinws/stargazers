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

export default function Account() {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const router = useRouter();

  async function getAccount() {
    const db = await initDb();
    const accounts = await getAllAccount(db);

    if (accounts?.length === 0) {
      router.replace("/login");
    } else {
      setAccounts(accounts);
      setDialogOpen(false);
      setOpen(false);
    }
  }

  useEffect(() => {
    getAccount();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Avatar className={cn("h-[2rem] w-[2rem] ml-2 cursor-pointer")}>
          <AvatarImage src="https://avatars.githubusercontent.com/u/11247099?u=a83ed73998ba6f3048f3b671e6c1cd4789cc216f&v=4" />
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] py-2 px-0">
        <div>
          {accounts?.map((account) => (
            <div
              key={account.login}
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
              <UserSearch getAccount={getAccount}></UserSearch>
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
