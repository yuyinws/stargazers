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

export default function UserSearch() {
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
            label: item.login,
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

  return (
    <>
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
                  <AvatarFallback>{user.label}</AvatarFallback>
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
          <Command>
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
                  className="flex items-center p-2 gap-2 rounded cursor-pointer hover:bg-slate-200"
                >
                  <Avatar key={user.id} className={cn("h-6 w-6")}>
                    <AvatarImage src={user.avatar} alt={user.label} />
                    <AvatarFallback>{user.label[0]}</AvatarFallback>
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
                      className="flex items-center gap-2 justify-center p-2"
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
      <Button className="mt-5" disabled={!user?.value}>
        Add
      </Button>
    </>
  );
}
