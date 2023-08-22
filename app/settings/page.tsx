"use client";

import { useAccountStore } from "@/store/account";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2Icon, RefreshCcwIcon, Loader2Icon } from "lucide-react";
import { useStore } from "@/store/useStore";
import dayjs from "dayjs";
import { Account } from "@/lib/db";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useStarStore } from "@/store/star";

export default function Settings() {
  const accountStore = useStore(useAccountStore, (state) => state);
  const starStore = useStore(useStarStore, (state) => state);
  const route = useRouter();

  const [currentSyncIndex, setCurrentSyncIndex] = useState(0);
  const [currentDeleteIndex, setCurrentDeleteIndex] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (accountStore?.allAccount?.length === 0) route.replace("/login");
  });

  async function handleDeleteAccount(account: Account, index: number) {
    try {
      setDeleteLoading(true);
      setCurrentDeleteIndex(index);
      await accountStore?.deleteAccount(account);
      toast.success("Account deleted");
      if (accountStore?.allAccount?.length === 1) route.replace("/login");
    } catch (error) {
      toast.error("Error deleting account", {
        description: String(error),
      });
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleSync(login: string, index: number) {
    try {
      setCurrentSyncIndex(index);

      await starStore?.fetchStars(login);

      await accountStore?.refreshAllAccount();
      toast.success("Account synced");
    } catch (error) {
      console.log(error);
      toast.error("Error syncing account", {
        description: String(error),
      });
    } finally {
    }
  }

  return (
    <div className="w-screen flex flex-col items-center gap-4 justify-center mt-4 xl:mt-[5rem]">
      <div className="rounded-sm border bg-card text-card-foreground shadow-sm p-5 w-[22rem] xl:w-[40rem]">
        <div className="text-xl font-semibold">Accounts</div>
        <div className="text-sm text-muted-foreground mb-4">
          Manage existing accounts and sync star data from GitHub
        </div>

        {accountStore?.allAccount?.length ? (
          <div className="flex flex-col gap-3">
            {accountStore?.allAccount?.map((account, index) => (
              <div className="flex gap-2 justify-between" key={account.login}>
                <div className="flex items-center gap-2">
                  <Avatar className={cn("h-[2rem] w-[2rem]")}>
                    <AvatarImage src={account.avatarUrl} />
                    <AvatarFallback>
                      <Skeleton className="h-[2rem] w-[2rem] rounded-full"></Skeleton>
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{account.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {account.lastSyncAt
                        ? dayjs(Number(account.lastSyncAt)).format("YYYY-MM-DD")
                        : "Never"}
                      {index === 0 && " (last synced) "}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <Button
                    disabled={starStore?.loading || deleteLoading}
                    onClick={() => handleSync(account.login, index)}
                    size="sm"
                    variant="outline"
                  >
                    {starStore?.loading && index === currentSyncIndex ? (
                      <>
                        <Loader2Icon className="h-[1rem] w-[1rem] animate-spin"></Loader2Icon>
                        <span
                          className={["ml-1", "hidden", "xl:inline"].join(" ")}
                        >
                          Syncing ...
                        </span>
                      </>
                    ) : (
                      <>
                        <RefreshCcwIcon className="h-[1rem] w-[1rem]"></RefreshCcwIcon>
                        <span
                          className={["ml-1", "hidden", "xl:inline"].join(" ")}
                        >
                          Sync
                        </span>
                      </>
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        disabled={starStore?.loading || deleteLoading}
                        size="sm"
                        variant="destructive"
                      >
                        {deleteLoading && currentDeleteIndex === index ? (
                          <>
                            <Loader2Icon className="h-[1rem] w-[1rem] animate-spin"></Loader2Icon>
                            <span
                              className={["ml-1", "hidden", "xl:inline"].join(
                                " "
                              )}
                            >
                              Deleting ...
                            </span>
                          </>
                        ) : (
                          <>
                            <Trash2Icon className="h-[1rem] w-[1rem]"></Trash2Icon>
                            <span
                              className={["ml-1", "hidden", "xl:inline"].join(
                                " "
                              )}
                            >
                              Delete
                            </span>
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteAccount(account, index)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {Array(3)
              .fill(0)
              .map((_, index) => {
                return (
                  <div key={index} className="flex gap-2">
                    <Skeleton className="h-[2rem] w-[2rem] rounded-full"></Skeleton>
                    <Skeleton className="h-[2rem] flex-1"></Skeleton>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      <div className="rounded-sm border bg-card text-card-foreground shadow-sm p-5 w-[22rem] xl:w-[40rem]">
        <div className="text-xl font-semibold">Storage</div>
        <div className="text-sm text-muted-foreground mb-4">
          Manage existing accounts and sync star data from GitHub
        </div>
      </div>
    </div>
  );
}
