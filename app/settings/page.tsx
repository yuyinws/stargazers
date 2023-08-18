"use client";

import { useAccountStore } from "@/store/account";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trash2Icon, RefreshCcwIcon } from "lucide-react";
import { useStore } from "@/store/useStore";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import dayjs from "dayjs";
import { deleteAccount, initDb } from "@/lib/db";

export default function Settings() {
  const allAccount = useStore(useAccountStore, (state) => state.allAccount);

  return (
    <div className="w-screen flex justify-center mt-[5rem]">
      <div className="rounded-sm border bg-card text-card-foreground shadow-sm p-5 min-w-[40rem]">
        <div className="text-xl font-semibold">Accounts</div>
        <div className="text-sm text-muted-foreground mb-4">
          Manage existing accounts.
        </div>
        <div className="flex flex-col gap-3">
          {allAccount?.map((account) => (
            <div className="flex justify-between" key={account.login}>
              <div className="flex items-center gap-2">
                <Avatar className={cn("h-[2rem] w-[2rem]")}>
                  <AvatarImage src={account.avatarUrl} />
                  <AvatarFallback>
                    <Skeleton className="h-[2rem] w-[2rem] rounded-full"></Skeleton>
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{account.name}</span>
              </div>

              <div className="flex gap-2">
                <HoverCard>
                  <HoverCardTrigger>
                    <Button size="sm" variant="outline">
                      <RefreshCcwIcon className="h-[1rem] w-[1rem] mr-1"></RefreshCcwIcon>
                      Sync
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="text-sm font-medium">
                      Sync star data from GitHub.
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last sync at:{" "}
                      {account.lastSyncAt
                        ? dayjs(Number(account.lastSyncAt)).format("YYYY-MM-DD")
                        : "Never"}
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <Button
                  onClick={async () => {
                    const db = await initDb();
                    deleteAccount(db, account.login);
                  }}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2Icon className="h-[1rem] w-[1rem] mr-1"></Trash2Icon>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
