"use client";

import * as React from "react";
import { HeightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Command, CommandInput } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { initDb, addAccount, getAllAccount } from "@/lib/db";
import { toast } from "sonner";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useAccountStore } from "@/store/account";
import Link from "next/link";
import { GITHUB_CLIENT_ID } from "@/lib/constant";

export default function UserSearch({ callback }: { callback?: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState<{
    value: string;
    label: string;
    avatar: string;
    id: string;
  }>();

  const [users, setUsers] = React.useState<
    {
      value: string;
      label: string;
      avatar: string;
      id: string;
    }[]
  >([]);

  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  const { setCurrentAccount, currentAccount, setAllAccount } =
    useAccountStore();

  const handleInputChange = debounce(async (event: any) => {
    try {
      setLoading(true);
      const inputVal = event.target.value;
      if (inputVal === "") {
        return;
      }
      const res = await fetch(`/api/gh/users?name=${inputVal}`);
      const { data } = await res.json();

      const users = data.data.search.nodes
        ?.filter((i: any) => i?.login)
        ?.map((item: any) => {
          return {
            value: item.login,
            label: item.name || item.login,
            id: item.id,
            avatar: item.avatarUrl,
          };
        });

      setUsers(users);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, 500);

  async function handleAddAccount() {
    try {
      if (user) {
        const db = await initDb();
        await addAccount(db, {
          login: user.value,
          avatarUrl: user.avatar,
          name: user.label,
          from: "search",
          lastSyncAt: "",
          addedAt: new Date().toISOString(),
        });

        const accounts = await getAllAccount(db);
        setAllAccount(accounts);
        if (!currentAccount) {
          setCurrentAccount(accounts[0]);
        }

        toast.success("Account added");

        if (callback) {
          callback();
        } else {
          router.replace("/");
        }
      }
    } catch (error) {
      toast.error("Error adding account", {
        description: String(error),
      });
    }
  }

  return (
    <>
      <Link
        href={
          "https://github.com/login/oauth/authorize?client_id=" +
          GITHUB_CLIENT_ID
        }
      >
        <Button variant="outline" className="w-[270px] flex gap-3">
          <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem]"></GitHubLogoIcon>
          Continue with GitHub
        </Button>
      </Link>

      <div className="relative w-[270px] my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-[270px] border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or Search a user
          </span>
        </div>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[270px] justify-between"
          >
            {user ? (
              <div className="flex items-center gap-2">
                <Avatar className={cn("h-6 w-6")}>
                  <AvatarImage src={user.avatar} alt={user.label} />
                  <AvatarFallback>
                    <Skeleton className="h-6 w-6 rounded-full"></Skeleton>
                  </AvatarFallback>
                </Avatar>
                <span>{user.label}</span>
              </div>
            ) : (
              <span className="text-zinc-400">Search GitHub User</span>
            )}
            <HeightIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[270px] p-0">
          <Command className="w-[270px]">
            <CommandInput onInput={handleInputChange} placeholder="Search..." />
          </Command>
          {users?.length ? (
            <div className="p-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    setUser(user);
                    setOpen(false);
                  }}
                  className="flex items-center p-2 gap-2 rounded cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  <Avatar key={user.id} className={cn("h-6 w-6")}>
                    <AvatarImage src={user.avatar} alt={user.label} />
                    <AvatarFallback>
                      <Skeleton className="h-6 w-6 rounded-full"></Skeleton>
                    </AvatarFallback>
                  </Avatar>

                  {user.label}
                </div>
              ))}
            </div>
          ) : loading ? (
            <div>
              {Array(5)
                .fill(0)
                .map((_, index) => {
                  return (
                    <div
                      key={index}
                      className="flex w-[270px] items-center gap-2 justify-center p-2"
                    >
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="flex-1 h-6" />
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="flex justify-center p-3 text-zinc-400">
              No user found
            </div>
          )}
        </PopoverContent>
      </Popover>
      <Button
        className="mt-5 w-[270px]"
        onClick={handleAddAccount}
        disabled={!user?.value}
      >
        Add
      </Button>
    </>
  );
}
