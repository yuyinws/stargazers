"use client";

import { Separator } from "@/components/ui/separator";
import { useStore, useAccountStore, useStarStore } from "@/store";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Trash2Icon, RefreshCcwIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Account } from "@/lib/db";
import { useRouter } from "next/navigation";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function Settings() {
  const accountStore = useStore(useAccountStore, (state) => state);
  const starStore = useStore(useStarStore, (state) => state);

  const router = useRouter();

  const [currentSyncIndex, setCurrentSyncIndex] = useState(0);
  const [currentDeleteIndex, setCurrentDeleteIndex] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleDeleteAccount(account: Account, index: number) {
    try {
      setDeleteLoading(true);
      setCurrentDeleteIndex(index);
      await accountStore?.deleteAccount(account);
      toast.success("Account deleted");
      if (accountStore?.allAccount?.length === 1) router.replace("/login");
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

  useEffect(() => {
    if (accountStore?.allAccount?.length === 0) router.replace("/login");
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Manage existing accounts and sync star data from GitHub.
        </p>
      </div>
      <Separator />
      <div>
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
                        ? "Synced on " +
                          dayjs(Number(account.lastSyncAt)).fromNow()
                        : "Never"}
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
            {Array(5)
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
    </div>
  );
}
